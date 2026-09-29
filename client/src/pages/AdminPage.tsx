import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { AlertCircle, Eye, ExternalLink, ImagePlus, Package, Plus, Save, Tag, Trash2, UploadCloud, Users } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";

const emptyProduct = {
  slug: "",
  name: "",
  eyebrow: "",
  description: "",
  priceLabel: "Cotizar",
  categorySlug: "bases",
  accent: "copper",
  imageUrl: null as string | null,
  sortOrder: 10,
  isPublished: true,
};

const emptyCategory = { slug: "", label: "", number: "06", note: "", sortOrder: 6 };
type MediaSlot = "hero" | "custom" | "showroom" | "project-1" | "project-2" | "project-3" | "project-4" | "project-5" | "project-6" | "project-7" | "project-8" | "project-9" | "project-10" | "project-11" | "project" | "product";

function normalizeSlug(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function Notice({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "danger" }) {
  return <div className={`admin-notice admin-notice--${tone}`}><AlertCircle size={16} /> <span>{children}</span></div>;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const catalog = trpc.catalog.admin.dashboard.useQuery(undefined, { retry: false, enabled: Boolean(user) });
  const [tab, setTab] = useState<"overview" | "products" | "prices" | "photos" | "team">("overview");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [categoryDraft, setCategoryDraft] = useState(emptyCategory);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [notice, setNotice] = useState<{ text: string; tone: "success" | "danger" } | null>(null);
  const [uploadMeta, setUploadMeta] = useState<{ title: string; detail: string; kind: "project" | "product"; slot: MediaSlot }>({ title: "", detail: "Proyecto HPU", kind: "project", slot: "project-1" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);

  const invalidate = async () => {
    await utils.catalog.admin.dashboard.invalidate();
    await utils.catalog.public.invalidate();
  };
  const createProduct = trpc.catalog.admin.createProduct.useMutation({ onSuccess: async () => { await invalidate(); setProductForm(emptyProduct); setProductFile(null); setEditingProductId(null); setNotice({ text: "Producto creado y guardado.", tone: "success" }); }, onError: (error) => setNotice({ text: error.message, tone: "danger" }) });
  const updateProduct = trpc.catalog.admin.updateProduct.useMutation({ onSuccess: async () => { await invalidate(); setProductForm(emptyProduct); setProductFile(null); setEditingProductId(null); setNotice({ text: "Producto actualizado.", tone: "success" }); }, onError: (error) => setNotice({ text: error.message, tone: "danger" }) });
  const archiveProduct = trpc.catalog.admin.archiveProduct.useMutation({ onSuccess: async () => { await invalidate(); setNotice({ text: "Producto ocultado del sitio público.", tone: "success" }); } });
  const createCategory = trpc.catalog.admin.createCategory.useMutation({ onSuccess: async () => { await invalidate(); setCategoryDraft(emptyCategory); setNotice({ text: "Categoría creada.", tone: "success" }); } });
  const updateCategory = trpc.catalog.admin.updateCategory.useMutation({ onSuccess: async () => { await invalidate(); setEditingCategoryId(null); setCategoryDraft(emptyCategory); setNotice({ text: "Categoría actualizada.", tone: "success" }); } });
  const uploadImage = trpc.catalog.admin.uploadImage.useMutation({ onSuccess: async () => { await invalidate(); setSelectedFile(null); setUploadMeta({ title: "", detail: "Proyecto HPU", kind: "project", slot: "project-1" }); setNotice({ text: "Imagen subida y publicada.", tone: "success" }); } });
  const updateMedia = trpc.catalog.admin.updateMedia.useMutation({ onSuccess: async () => { await invalidate(); setNotice({ text: "Foto actualizada.", tone: "success" }); } });
  const archiveMedia = trpc.catalog.admin.archiveMedia.useMutation({ onSuccess: async () => { await invalidate(); setNotice({ text: "Foto ocultada del sitio público.", tone: "success" }); } });
  const updateTeamRole = trpc.catalog.admin.updateTeamRole.useMutation({ onSuccess: async () => { await invalidate(); setNotice({ text: "Permisos del equipo actualizados.", tone: "success" }); } });

  const data = catalog.data;
  const publishedProducts = useMemo(() => data?.items.filter((item) => item.isPublished === 1) ?? [], [data?.items]);
  const publishedPhotos = useMemo(() => data?.media.filter((asset) => asset.isPublished === 1) ?? [], [data?.media]);

  if (loading) return <div className="admin-loading">Cargando panel HPU…</div>;
  if (!user) return <DashboardLayout><div /></DashboardLayout>;
  if (catalog.error) return <DashboardLayout><div className="admin-page"><Notice tone="danger">Tu cuenta no tiene permisos de administración. Inicia sesión con la cuenta propietaria de HPU.</Notice></div></DashboardLayout>;

  const submitProduct = async (event: FormEvent) => {
    event.preventDefault();
    setNotice(null);
    const normalizedProduct = { ...productForm, slug: normalizeSlug(productForm.slug) };
    setProductForm(normalizedProduct);
    try {
      let imageUrl = normalizedProduct.imageUrl;
      if (productFile) {
        const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("No se pudo leer la imagen")); reader.onerror = () => reject(new Error("No se pudo leer la imagen")); reader.readAsDataURL(productFile); });
        const stored = await uploadImage.mutateAsync({ filename: productFile.name, contentType: productFile.type as "image/jpeg" | "image/png" | "image/webp", dataUrl, title: normalizedProduct.name, detail: normalizedProduct.description, kind: "product", slot: "product" });
        imageUrl = stored.url;
      }
      const payload = { ...normalizedProduct, imageUrl };
      if (editingProductId) await updateProduct.mutateAsync({ id: editingProductId, data: payload });
      else await createProduct.mutateAsync(payload);
    } catch (error) {
      setNotice({ text: error instanceof Error ? error.message : "No se pudo guardar el producto.", tone: "danger" });
    }
  };
  const submitCategory = (event: FormEvent) => {
    event.preventDefault();
    if (editingCategoryId) updateCategory.mutate({ id: editingCategoryId, data: categoryDraft });
    else createCategory.mutate(categoryDraft);
  };
  const startEditProduct = (item: NonNullable<typeof data>["items"][number]) => {
    setEditingProductId(item.id);
    setProductForm({ slug: item.slug, name: item.name, eyebrow: item.eyebrow, description: item.description, priceLabel: item.priceLabel, categorySlug: item.categorySlug, accent: item.accent, imageUrl: item.imageUrl, sortOrder: item.sortOrder, isPublished: item.isPublished === 1 });
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const startEditCategory = (category: NonNullable<typeof data>["categories"][number]) => {
    setEditingCategoryId(category.id);
    setCategoryDraft({ slug: category.slug, label: category.label, number: category.number, note: category.note, sortOrder: category.sortOrder });
  };
  const submitUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile || !uploadMeta.title) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      uploadImage.mutate({ filename: selectedFile.name, contentType: selectedFile.type as "image/jpeg" | "image/png" | "image/webp", dataUrl: reader.result, ...uploadMeta });
    };
    reader.readAsDataURL(selectedFile);
  };

  return <DashboardLayout>
    <div className="admin-page">
      <div className="admin-header"><div><p className="admin-kicker">HPU · administración privada</p><h1>Tu taller, <em>en tus manos.</em></h1><p className="admin-subtitle">Gestiona lo que tus clientes ven en el catálogo público.</p></div><a className="admin-view-site" href="/" target="_blank" rel="noreferrer"><Eye size={16} /> Ver sitio <ExternalLink size={14} /></a></div>
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
      <div className="admin-tabs" role="tablist"><button className={tab === "overview" ? "is-active" : ""} onClick={() => setTab("overview")}><Package size={16} /> Resumen</button><button className={tab === "products" ? "is-active" : ""} onClick={() => setTab("products")}><Package size={16} /> Productos</button><button className={tab === "prices" ? "is-active" : ""} onClick={() => setTab("prices")}><Tag size={16} /> Precios</button><button className={tab === "photos" ? "is-active" : ""} onClick={() => setTab("photos")}><ImagePlus size={16} /> Fotos</button><button className={tab === "team" ? "is-active" : ""} onClick={() => setTab("team")}><Users size={16} /> Equipo</button></div>

      {tab === "overview" && <section className="admin-overview"><div className="admin-stat"><span>Productos publicados</span><strong>{publishedProducts.length}</strong><small>Disponibles en catálogo</small></div><div className="admin-stat"><span>Fotos visibles</span><strong>{publishedPhotos.length}</strong><small>En galería de proyectos</small></div><div className="admin-stat admin-stat--copper"><span>Estado del contenido</span><strong>Listo</strong><small>Los cambios se guardan en la nube</small></div><div className="admin-guide"><p className="admin-kicker">Flujo recomendado</p><h2>Sube, revisa y publica.</h2><div className="admin-guide-steps"><span><b>01</b> Sube una foto</span><span><b>02</b> Describe la pieza</span><span><b>03</b> Marca visible</span></div><button className="admin-primary" onClick={() => setTab("photos")}><UploadCloud size={16} /> Subir primera foto</button></div></section>}

      {tab === "products" && <section className="admin-content-grid"><div className="admin-card"><div className="admin-card-heading"><div><p className="admin-kicker">Catálogo editable</p><h2>{editingProductId ? "Editar producto" : "Nuevo producto"}</h2></div>{editingProductId && <button className="admin-link" onClick={() => { setEditingProductId(null); setProductForm(emptyProduct); }}>Cancelar</button>}</div><form className="admin-form" onSubmit={submitProduct}><div className="admin-form-row"><label>Nombre<input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required placeholder="Ej. Mesa de comedor" /></label><label>Slug <small className="admin-field-help">Se convierte automáticamente a formato web</small><input value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: normalizeSlug(e.target.value) })} required placeholder="mesa-de-comedor" /></label></div><div className="admin-form-row"><label>Etiqueta<input value={productForm.eyebrow} onChange={(e) => setProductForm({ ...productForm, eyebrow: e.target.value })} required placeholder="Comedor" /></label><label>Precio<input value={productForm.priceLabel} onChange={(e) => setProductForm({ ...productForm, priceLabel: e.target.value })} required placeholder="Ej. $4,500 o Cotizar" /></label></div><label>Descripción<textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required rows={4} placeholder="Describe el producto…" /></label><div className="admin-form-row"><label>Categoría<select value={productForm.categorySlug} onChange={(e) => setProductForm({ ...productForm, categorySlug: e.target.value })}>{data?.categories.map((category) => <option key={category.slug} value={category.slug}>{category.label}</option>)}</select></label><label>Color visual<select value={productForm.accent} onChange={(e) => setProductForm({ ...productForm, accent: e.target.value })}><option value="copper">Cobre</option><option value="olive">Oliva</option><option value="stone">Piedra</option><option value="ink">Carbón</option></select></label></div><label>Foto del producto<select value={productForm.imageUrl ?? ""} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value || null })}><option value="">Usar ilustración HPU</option>{data?.media.filter((asset) => asset.kind === "product").map((asset) => <option key={asset.id} value={asset.url}>{asset.title}</option>)}</select></label><label className="admin-file-drop admin-product-file"><UploadCloud size={22} /><span>{productFile ? productFile.name : "Subir imagen del producto"}</span><small>JPG, PNG o WebP · máximo 8 MB</small><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event: ChangeEvent<HTMLInputElement>) => setProductFile(event.target.files?.[0] ?? null)} /></label><label className="admin-check"><input type="checkbox" checked={productForm.isPublished} onChange={(e) => setProductForm({ ...productForm, isPublished: e.target.checked })} /> Visible en el sitio público</label><button className="admin-primary" type="submit" disabled={createProduct.isPending || updateProduct.isPending}><Save size={16} /> {editingProductId ? "Guardar cambios" : "Crear producto"}</button></form></div><div className="admin-side-stack"><div className="admin-card"><div className="admin-card-heading"><div><p className="admin-kicker">Categorías</p><h2>Secciones del catálogo</h2></div></div><div className="admin-category-list">{data?.categories.map((category) => <div className="admin-category-row" key={category.id}><div><strong>{category.label}</strong><small>{category.note}</small></div><button className="admin-link" onClick={() => startEditCategory(category)}>Editar</button></div>)}</div><form className="admin-mini-form" onSubmit={submitCategory}><input value={categoryDraft.label} onChange={(e) => setCategoryDraft({ ...categoryDraft, label: e.target.value })} placeholder={editingCategoryId ? "Editar categoría" : "Nueva categoría"} required /><input value={categoryDraft.slug} onChange={(e) => setCategoryDraft({ ...categoryDraft, slug: e.target.value })} placeholder="slug" required disabled={Boolean(editingCategoryId)} /><input value={categoryDraft.note} onChange={(e) => setCategoryDraft({ ...categoryDraft, note: e.target.value })} placeholder="Descripción corta" required /><button className="admin-secondary" type="submit"><Plus size={15} /> {editingCategoryId ? "Guardar" : "Agregar"}</button></form></div><div className="admin-card admin-product-list-card"><div className="admin-card-heading"><div><p className="admin-kicker">Productos guardados</p><h2>Editar fichas</h2></div></div><div className="admin-product-list">{data?.items.map((item) => <div className="admin-product-row" key={item.id}><div>{item.imageUrl ? <img src={item.imageUrl} alt="" /> : <span className="admin-product-placeholder"><Package size={18} /></span>}<span><strong>{item.name}</strong><small>{item.priceLabel} · {item.isPublished ? "Publicado" : "Oculto"}</small></span></div><button className="admin-link" type="button" onClick={() => startEditProduct(item)}>Editar</button></div>)}</div></div><div className="admin-card admin-tip"><p className="admin-kicker">Precio editable</p><p>Escribe el precio exacto o usa <strong>“Cotizar”</strong> / <strong>“Próximamente”</strong>. El cambio se verá en la tarjeta pública.</p></div></div></section>}
      {tab === "prices" && <section className="admin-content-grid"><div className="admin-card"><div className="admin-card-heading"><div><p className="admin-kicker">Catálogo · precios</p><h2>Editar precios</h2></div></div><p className="admin-subtitle">Cambia el texto de precio de cualquier producto. Puedes usar una cantidad, “Desde $…”, “Cotizar” o “Próximamente”. Guarda cada fila con el botón.</p><div className="admin-price-list">{data?.items.map((item) => <div className="admin-price-row" key={item.id}><div><strong>{item.name}</strong><small>{item.eyebrow} · {item.isPublished ? "Visible" : "Oculto"}</small></div><input aria-label={`Precio de ${item.name}`} defaultValue={item.priceLabel} placeholder="Ej. $4,500 o Cotizar" onChange={(event) => { event.currentTarget.dataset.dirty = "true"; }} /><button className="admin-primary" onClick={(event) => { const input = event.currentTarget.previousElementSibling as HTMLInputElement; updateProduct.mutate({ id: item.id, data: { priceLabel: input.value } }); }}>Guardar precio</button></div>)}</div></div><div className="admin-card admin-tip"><p className="admin-kicker">Así lo verá tu cliente</p><p>El precio aparece en la esquina superior de cada tarjeta del catálogo público, junto al número del producto.</p></div></section>}

      {tab === "photos" && <section className="admin-content-grid"><div className="admin-card"><div className="admin-card-heading"><div><p className="admin-kicker">Biblioteca HPU</p><h2>Subir o reemplazar</h2></div></div><form className="admin-form" onSubmit={submitUpload}><label>Título de la imagen<input value={uploadMeta.title} onChange={(e) => setUploadMeta({ ...uploadMeta, title: e.target.value })} placeholder="Ej. Base de cama Nogal" required /></label><label>Descripción corta<input value={uploadMeta.detail} onChange={(e) => setUploadMeta({ ...uploadMeta, detail: e.target.value })} placeholder="Estructura y acabado" required /></label><label>Ubicación en el sitio<select value={uploadMeta.slot} onChange={(e) => setUploadMeta({ ...uploadMeta, slot: e.target.value as MediaSlot })}><option value="hero">Portada principal</option><option value="custom">Sección “A medida”</option><option value="showroom">Tarjeta del showroom</option><option value="project-1">Galería · foto 1</option><option value="project-2">Galería · foto 2</option><option value="project-3">Galería · foto 3</option><option value="project-4">Galería · foto 4</option><option value="project-5">Galería · foto 5</option><option value="project-6">Galería · foto 6</option><option value="project-7">Galería · foto 7</option><option value="project-8">Galería · foto 8</option><option value="project-9">Galería · foto 9</option><option value="project-10">Galería · foto 10</option><option value="project-11">Galería · foto 11</option><option value="product">Foto de producto nueva</option></select></label><label>Tipo de contenido<select value={uploadMeta.kind} onChange={(e) => setUploadMeta({ ...uploadMeta, kind: e.target.value as "project" | "product" })}><option value="project">Proyecto / galería</option><option value="product">Foto de producto</option></select></label><label className="admin-file-drop"><UploadCloud size={24} /><span>{selectedFile ? selectedFile.name : "Elige una foto JPG, PNG o WebP"}</span><small>Máximo 8 MB · si eliges una ubicación existente, la reemplaza</small><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event: ChangeEvent<HTMLInputElement>) => setSelectedFile(event.target.files?.[0] ?? null)} required /></label><button className="admin-primary" type="submit" disabled={!selectedFile || uploadImage.isPending}><UploadCloud size={16} /> {uploadImage.isPending ? "Subiendo…" : "Guardar imagen"}</button></form></div><div className="admin-card"><div className="admin-card-heading"><div><p className="admin-kicker">Fotos guardadas</p><h2>Biblioteca ({data?.media.length ?? 0})</h2></div></div><div className="admin-media-grid">{data?.media.map((asset) => <article className={`admin-media-card ${asset.isPublished ? "" : "is-hidden"}`} key={asset.id}><img src={asset.url} alt={asset.title} /><div className="admin-media-body"><input value={asset.title} onChange={(e) => updateMedia.mutate({ id: asset.id, data: { title: e.target.value } })} aria-label={`Título de ${asset.title}`} /><span>{asset.slot} · {asset.isPublished ? "Publicado" : "Oculto"}</span><div><button className="admin-link" onClick={() => updateMedia.mutate({ id: asset.id, data: { isPublished: asset.isPublished !== 1 } })}>{asset.isPublished ? "Ocultar" : "Publicar"}</button><button className="admin-danger" onClick={() => { if (window.confirm("¿Ocultar esta foto del sitio?")) archiveMedia.mutate({ id: asset.id }); }}><Trash2 size={14} /></button></div></div></article>)}</div>{!data?.media.length && <div className="admin-empty">Aún no hay fotos subidas.</div>}</div></section>}

      {tab === "team" && <section className="admin-content-grid"><div className="admin-card"><div className="admin-card-heading"><div><p className="admin-kicker">Acceso privado</p><h2>Equipo HPU</h2></div></div><p className="admin-subtitle">Las personas que entren al panel con su cuenta Manus aparecen aquí. Solo quienes tengan rol de administrador pueden editar productos y fotos.</p><div className="admin-category-list">{data?.team.map((member) => <div className="admin-category-row" key={member.id}><div><strong>{member.name || "Sin nombre"}</strong><small>{member.email || "Cuenta Manus"}</small></div><button className="admin-secondary" disabled={member.id === user.id || updateTeamRole.isPending} onClick={() => updateTeamRole.mutate({ id: member.id, role: member.role === "admin" ? "user" : "admin" })}>{member.id === user.id ? "Tu cuenta" : member.role === "admin" ? "Quitar admin" : "Dar acceso"}</button></div>)}</div>{!data?.team.length && <div className="admin-empty">El primer acceso del proyecto se convertirá en administrador.</div>}</div><div className="admin-card admin-tip"><p className="admin-kicker">Cómo invitar</p><p>Comparte el acceso al proyecto con la cuenta Manus de cada colaborador. Cuando entre al panel, aparecerá aquí para que puedas darle permisos.</p></div></section>}
    </div>
  </DashboardLayout>;
}
