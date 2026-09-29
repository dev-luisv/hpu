import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { storagePut } from "./storage";
import * as db from "./db";

const categoryInput = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  label: z.string().trim().min(2).max(150),
  number: z.string().trim().min(1).max(10),
  note: z.string().trim().min(2).max(500),
  sortOrder: z.number().int().min(0).max(999),
});

const productInput = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(150),
  eyebrow: z.string().trim().min(1).max(80),
  description: z.string().trim().min(2).max(2000),
  priceLabel: z.string().trim().min(1).max(80),
  categorySlug: z.string().trim().min(2).max(80),
  accent: z.string().trim().min(2).max(30),
  imageUrl: z.string().trim().max(512).nullable().optional(),
  sortOrder: z.number().int().min(0).max(999),
  isPublished: z.boolean(),
});

const mediaUpdateInput = z.object({
  title: z.string().trim().min(2).max(150).optional(),
  detail: z.string().trim().min(2).max(200).optional(),
  slot: z.string().trim().min(2).max(80).optional(),
  isPublished: z.boolean().optional(),
});

const mediaSlot = z.enum(["hero", "custom", "showroom", "project-1", "project-2", "project-3", "project-4", "project-5", "project-6", "project-7", "project-8", "project-9", "project-10", "project-11", "project", "product"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    public: publicProcedure.query(async () => {
      try {
        return await db.getPublicCatalog();
      } catch (error) {
        console.error("[Catalog] Public read failed", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No se pudo cargar el catálogo" });
      }
    }),
    admin: router({
      dashboard: adminProcedure.query(async () => db.getAdminCatalog()),
      createCategory: adminProcedure.input(categoryInput).mutation(async ({ input }) => {
        const id = await db.createCategory(input);
        return { id };
      }),
      updateCategory: adminProcedure.input(z.object({ id: z.number().int().positive(), data: categoryInput.omit({ slug: true }).partial() })).mutation(async ({ input }) => {
        await db.updateCategory(input.id, input.data);
        return { success: true };
      }),
      createProduct: adminProcedure.input(productInput).mutation(async ({ input }) => {
        const id = await db.createProduct({ ...input, imageUrl: input.imageUrl ?? null, isPublished: input.isPublished ? 1 : 0 });
        return { id };
      }),
      updateProduct: adminProcedure.input(z.object({ id: z.number().int().positive(), data: productInput.partial() })).mutation(async ({ input }) => {
        const data = { ...input.data, ...(input.data.isPublished === undefined ? {} : { isPublished: input.data.isPublished ? 1 : 0 }) };
        delete (data as { isPublished?: boolean }).isPublished;
        await db.updateProduct(input.id, data as Parameters<typeof db.updateProduct>[1]);
        return { success: true };
      }),
      archiveProduct: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
        await db.archiveProduct(input.id);
        return { success: true };
      }),
      updateMedia: adminProcedure.input(z.object({ id: z.number().int().positive(), data: mediaUpdateInput })).mutation(async ({ input }) => {
        const data = { ...input.data, ...(input.data.isPublished === undefined ? {} : { isPublished: input.data.isPublished ? 1 : 0 }) };
        delete (data as { isPublished?: boolean }).isPublished;
        await db.updateMedia(input.id, data as Parameters<typeof db.updateMedia>[1]);
        return { success: true };
      }),
      archiveMedia: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
        await db.archiveMedia(input.id);
        return { success: true };
      }),
      updateTeamRole: adminProcedure.input(z.object({ id: z.number().int().positive(), role: z.enum(["user", "admin"]) })).mutation(async ({ ctx, input }) => {
        if (ctx.user.id === input.id && input.role !== "admin") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "No puedes quitarte tu propio acceso" });
        }
        await db.updateUserRole(input.id, input.role);
        return { success: true };
      }),
      uploadImage: adminProcedure.input(z.object({
        filename: z.string().trim().min(1).max(120),
        contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
        dataUrl: z.string().min(30).max(12_000_000),
        title: z.string().trim().min(2).max(150),
        detail: z.string().trim().min(2).max(200),
        kind: z.enum(["project", "product"]),
        slot: mediaSlot,
      })).mutation(async ({ input }) => {
        const [header, encoded] = input.dataUrl.split(",", 2);
        if (!header?.includes(input.contentType) || !encoded) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "El archivo de imagen no es válido" });
        }
        const buffer = Buffer.from(encoded, "base64");
        if (buffer.length > 8 * 1024 * 1024) {
          throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "La imagen debe pesar menos de 8 MB" });
        }
        const safeFilename = input.filename.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
        const stored = await storagePut(`hpu/${input.kind}/${Date.now()}-${safeFilename}`, buffer, input.contentType);
        const id = await db.createMedia({ title: input.title, detail: input.detail, slot: input.slot, kind: input.kind, url: stored.url, storageKey: stored.key, mimeType: input.contentType, sizeBytes: buffer.length });
        return { id, url: stored.url };
      }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
