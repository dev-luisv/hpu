import { asc, count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, catalogCategories, catalogItems, mediaAssets, users } from "../drizzle/schema";
import { DEFAULT_CATEGORIES, DEFAULT_MEDIA, DEFAULT_PRODUCTS } from "../shared/catalog";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else {
      const userCount = await db.select({ value: count() }).from(users);
      const isFirstAccount = Number(userCount[0]?.value ?? 0) === 0;
      if (user.openId === ENV.ownerOpenId || (!ENV.ownerOpenId && isFirstAccount)) {
        values.role = "admin";
        updateSet.role = "admin";
      }
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function bootstrapSingleAdmin(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const [userCount, adminCount] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(users).where(eq(users.role, "admin")),
  ]);
  if (Number(userCount[0]?.value ?? 0) !== 1 || Number(adminCount[0]?.value ?? 0) !== 0) {
    return getUserByOpenId(openId);
  }
  await db.update(users).set({ role: "admin", updatedAt: new Date() }).where(eq(users.openId, openId));
  return getUserByOpenId(openId);
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db;
}

export async function seedCatalogIfNeeded() {
  const db = await requireDb();
  const categoryCount = await db.select({ value: count() }).from(catalogCategories);
  if (Number(categoryCount[0]?.value ?? 0) === 0) {
    await db.insert(catalogCategories).values(DEFAULT_CATEGORIES.map(category => ({ ...category, isPublished: 1 })));
  }
  const productCount = await db.select({ value: count() }).from(catalogItems);
  if (Number(productCount[0]?.value ?? 0) === 0) {
    await db.insert(catalogItems).values(DEFAULT_PRODUCTS.map(product => ({ ...product, isPublished: 1 })));
  }
  const mediaCount = await db.select({ value: count() }).from(mediaAssets);
  if (Number(mediaCount[0]?.value ?? 0) === 0) {
    await db.insert(mediaAssets).values(DEFAULT_MEDIA.map(media => ({ ...media, sizeBytes: 0, mimeType: "image/jpeg", isPublished: 1 })));
  }
}

export async function getPublicCatalog() {
  const db = await requireDb();
  await seedCatalogIfNeeded();
  const [categories, items, media] = await Promise.all([
    db.select().from(catalogCategories).where(eq(catalogCategories.isPublished, 1)).orderBy(asc(catalogCategories.sortOrder)),
    db.select().from(catalogItems).where(eq(catalogItems.isPublished, 1)).orderBy(asc(catalogItems.sortOrder)),
    db.select().from(mediaAssets).where(eq(mediaAssets.isPublished, 1)).orderBy(desc(mediaAssets.createdAt)),
  ]);
  return { categories, items, media };
}

export async function getAdminCatalog() {
  const db = await requireDb();
  await seedCatalogIfNeeded();
  const [categories, items, media, team] = await Promise.all([
    db.select().from(catalogCategories).orderBy(asc(catalogCategories.sortOrder)),
    db.select().from(catalogItems).orderBy(asc(catalogItems.sortOrder)),
    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)),
    db.select({ id: users.id, name: users.name, email: users.email, role: users.role, lastSignedIn: users.lastSignedIn }).from(users).orderBy(desc(users.lastSignedIn)),
  ]);
  return { categories, items, media, team };
}

export async function updateUserRole(id: number, role: "user" | "admin") {
  const db = await requireDb();
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id));
}

export async function createCategory(input: { slug: string; label: string; number: string; note: string; sortOrder: number }) {
  const db = await requireDb();
  const result = await db.insert(catalogCategories).values({ ...input, isPublished: 1 });
  return Number(result[0].insertId);
}

export async function updateCategory(id: number, input: Partial<{ label: string; number: string; note: string; sortOrder: number; isPublished: number }>) {
  const db = await requireDb();
  await db.update(catalogCategories).set({ ...input, updatedAt: new Date() }).where(eq(catalogCategories.id, id));
}

export async function createProduct(input: { slug: string; name: string; eyebrow: string; description: string; priceLabel: string; categorySlug: string; accent: string; imageUrl?: string | null; sortOrder: number; isPublished: number }) {
  const db = await requireDb();
  const result = await db.insert(catalogItems).values(input);
  return Number(result[0].insertId);
}

export async function updateProduct(id: number, input: Partial<{ slug: string; name: string; eyebrow: string; description: string; priceLabel: string; categorySlug: string; accent: string; imageUrl: string | null; sortOrder: number; isPublished: number }>) {
  const db = await requireDb();
  await db.update(catalogItems).set({ ...input, updatedAt: new Date() }).where(eq(catalogItems.id, id));
}

export async function archiveProduct(id: number) {
  const db = await requireDb();
  await db.update(catalogItems).set({ isPublished: 0, updatedAt: new Date() }).where(eq(catalogItems.id, id));
}

export async function createMedia(input: { title: string; detail: string; slot: string; kind: "project" | "product"; url: string; storageKey: string; mimeType: string; sizeBytes: number }) {
  const db = await requireDb();
  const fixedSlots = ["hero", "custom", "showroom", "project-1", "project-2", "project-3", "project-4", "project-5", "project-6"];
  if (fixedSlots.includes(input.slot)) {
    const existing = await db.select({ id: mediaAssets.id }).from(mediaAssets).where(eq(mediaAssets.slot, input.slot)).limit(1);
    if (existing[0]) {
      await db.update(mediaAssets).set({ ...input, isPublished: 1, updatedAt: new Date() }).where(eq(mediaAssets.id, existing[0].id));
      return existing[0].id;
    }
  }
  const result = await db.insert(mediaAssets).values({ ...input, isPublished: 1 });
  return Number(result[0].insertId);
}

export async function updateMedia(id: number, input: Partial<{ title: string; detail: string; slot: string; isPublished: number }>) {
  const db = await requireDb();
  await db.update(mediaAssets).set({ ...input, updatedAt: new Date() }).where(eq(mediaAssets.id, id));
}

export async function archiveMedia(id: number) {
  const db = await requireDb();
  await db.update(mediaAssets).set({ isPublished: 0, updatedAt: new Date() }).where(eq(mediaAssets.id, id));
}
