export type CatalogCategory = {
  id: number;
  slug: string;
  label: string;
  number: string;
  note: string;
  sortOrder: number;
  isPublished: boolean;
};

export type CatalogProduct = {
  id: number;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  priceLabel: string;
  categorySlug: string;
  accent: string;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type MediaAsset = {
  id: number;
  title: string;
  detail: string;
  slot: string;
  kind: "project" | "product";
  url: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  isPublished: boolean;
  createdAt: string;
};

export const DEFAULT_CATEGORIES = [
  { slug: "bases", label: "Bases de cama", number: "01", note: "Estructuras que sostienen el descanso.", sortOrder: 1 },
  { slug: "centro", label: "Mesas de centro", number: "02", note: "Piezas que le dan ritmo a la sala.", sortOrder: 2 },
  { slug: "comedor", label: "Mesas de comedor", number: "03", note: "Reuniones alrededor de un diseño propio.", sortOrder: 3 },
  { slug: "lamparas", label: "Lámparas de metal", number: "04", note: "Luz con carácter para cada espacio.", sortOrder: 4 },
  { slug: "medida", label: "Muebles a medida", number: "05", note: "Si puedes imaginarlo, podemos construirlo.", sortOrder: 5 },
] as const;

export const DEFAULT_PRODUCTS = [
  { slug: "base-cama", name: "Bases de cama", eyebrow: "Dormitorio", description: "Diseñadas a la medida de tu colchón, con líneas limpias y estructura sólida.", priceLabel: "Cotizar", categorySlug: "bases", accent: "olive", imageUrl: "/assets/hpu/base-cama-editorial.webp", sortOrder: 1 },
  { slug: "mesa-centro", name: "Mesas de centro", eyebrow: "Sala", description: "Proporciones pensadas para convivir con tu espacio, estilo y forma de vivir.", priceLabel: "Cotizar", categorySlug: "centro", accent: "copper", imageUrl: "/manus-storage/async-images/TNgbI0Dfy1GH1AMdXomToF/image-2.webp", sortOrder: 2 },
  { slug: "mesa-comedor", name: "Mesas de comedor", eyebrow: "Comedor", description: "Una pieza central para reunir personas, materiales y momentos.", priceLabel: "Cotizar", categorySlug: "comedor", accent: "stone", imageUrl: "/manus-storage/async-images/TNgbI0Dfy1GH1AMdXomToF/image-3.webp", sortOrder: 3 },
  { slug: "lampara-metal", name: "Lámparas de metal", eyebrow: "Iluminación", description: "Detalles escultóricos que transforman la atmósfera sin perder funcionalidad.", priceLabel: "Cotizar", categorySlug: "lamparas", accent: "ink", imageUrl: "/manus-storage/async-images/TNgbI0Dfy1GH1AMdXomToF/image-4.webp", sortOrder: 4 },
  { slug: "consola-dorada", name: "Consola dorada", eyebrow: "Muebles a medida", description: "Consola de herrería con cubierta de vidrio y acabado dorado para recibidores y espacios especiales.", priceLabel: "Cotizar", categorySlug: "medida", accent: "copper", imageUrl: "/assets/hpu/catalog/consola-dorada.webp", sortOrder: 10 },
  { slug: "mesa-auxiliar-madera", name: "Mesa auxiliar de madera", eyebrow: "Sala", description: "Mesa auxiliar con estructura de metal y cubierta de madera para acompañar cualquier rincón.", priceLabel: "Cotizar", categorySlug: "centro", accent: "olive", imageUrl: "/assets/hpu/catalog/mesa-auxiliar-madera.webp", sortOrder: 11 },
  { slug: "mesa-comedor-negra", name: "Mesa de comedor negra", eyebrow: "Comedor", description: "Estructura de líneas limpias para crear un comedor contemporáneo y duradero.", priceLabel: "Cotizar", categorySlug: "comedor", accent: "ink", imageUrl: "/assets/hpu/catalog/mesa-comedor-negra.webp", sortOrder: 12 },
  { slug: "aplique-metal", name: "Apliques de metal", eyebrow: "Iluminación", description: "Luminarias artesanales de metal que aportan carácter y textura a tus muros.", priceLabel: "Cotizar", categorySlug: "lamparas", accent: "copper", imageUrl: "/assets/hpu/catalog/aplique-metal-1.webp", sortOrder: 13 },
  { slug: "estructura-evento", name: "Estructura para eventos", eyebrow: "Muebles a medida", description: "Estructuras metálicas decorativas para celebraciones, jardines y montajes especiales.", priceLabel: "Cotizar", categorySlug: "medida", accent: "copper", imageUrl: "/assets/hpu/catalog/estructura-evento-dorada.webp", sortOrder: 14 },
  { slug: "mesa-centro-mosaico", name: "Mesa de centro con mosaico", eyebrow: "Sala", description: "Mesa de centro con estructura metálica y cubierta de mosaico, pensada para ser el punto focal de la sala.", priceLabel: "Cotizar", categorySlug: "centro", accent: "stone", imageUrl: "/assets/hpu/catalog/mesa-centro-mosaico-1.webp", sortOrder: 15 },
  { slug: "consola-azul", name: "Consola azul", eyebrow: "Muebles a medida", description: "Consola metálica con acabado azul y repisas para exhibir objetos con personalidad.", priceLabel: "Cotizar", categorySlug: "medida", accent: "ink", imageUrl: "/assets/hpu/catalog/consola-azul.webp", sortOrder: 16 },
  { slug: "barandal-decorativo", name: "Barandal decorativo", eyebrow: "Muebles a medida", description: "Diseño de herrería ornamental para transformar escaleras, muros y espacios arquitectónicos.", priceLabel: "Cotizar", categorySlug: "medida", accent: "ink", imageUrl: "/assets/hpu/catalog/barandal-decorativo.webp", sortOrder: 17 },
] as const;

export const DEFAULT_MEDIA = [
  { slot: "hero", kind: "project" as const, title: "Portada HPU", detail: "Sillón de metal · imagen principal", url: "/manus-storage/async-images/WPBOkKasRg8mmwUKmX90RC/image-1.webp", storageKey: "async-images/WPBOkKasRg8mmwUKmX90RC/image-1.webp" },
  { slot: "custom", kind: "project" as const, title: "Soportes", detail: "A medida · proceso y detalle", url: "/assets/hpu/facebook-6-upscaled.webp", storageKey: "local/facebook-6-upscaled.webp" },
  { slot: "showroom", kind: "project" as const, title: "Rueda botánica", detail: "Showroom · metal convertido en detalle", url: "/assets/hpu/facebook-1-upscaled.webp", storageKey: "local/facebook-1-upscaled.webp" },
  { slot: "project-1", kind: "project" as const, title: "Sillón tejido", detail: "Estructura y comodidad", url: "/assets/hpu/facebook-7-upscaled.webp", storageKey: "local/facebook-7-upscaled.webp" },
  { slot: "project-2", kind: "project" as const, title: "Jardineras", detail: "Piezas para exterior", url: "/assets/hpu/facebook-5-upscaled.webp", storageKey: "local/facebook-5-upscaled.webp" },
  { slot: "project-3", kind: "project" as const, title: "Rueda botánica", detail: "Metal convertido en detalle", url: "/assets/hpu/facebook-1-upscaled.webp", storageKey: "local/facebook-1-upscaled.webp" },
  { slot: "project-4", kind: "project" as const, title: "Soportes", detail: "Composición y equilibrio", url: "/assets/hpu/facebook-6-upscaled.webp", storageKey: "local/facebook-6-upscaled.webp" },
  { slot: "project-5", kind: "project" as const, title: "Arte en metal", detail: "Trabajo especial", url: "/assets/hpu/facebook-8-upscaled.webp", storageKey: "local/facebook-8-upscaled.webp" },
  { slot: "project-6", kind: "project" as const, title: "Pieza de exhibición", detail: "Fabricación a medida", url: "/assets/hpu/facebook-3-upscaled.webp", storageKey: "local/facebook-3-upscaled.webp" },
  { slot: "project-7", kind: "project" as const, title: "Lámparas geométricas", detail: "Iluminación de metal", url: "/assets/hpu/gallery-lamparas-cutout.png", storageKey: "local/gallery-lamparas-editorial.png" },
  { slot: "project-8", kind: "project" as const, title: "Estructura colorida", detail: "Mueble metálico a medida", url: "/assets/hpu/gallery-estructura-color-editorial.png", storageKey: "local/gallery-estructura-color-editorial.png" },
  { slot: "project-9", kind: "project" as const, title: "Detalle de madera y metal", detail: "Trabajo artesanal", url: "/assets/hpu/gallery-detalle-madera-editorial.png", storageKey: "local/gallery-detalle-madera-editorial.png" },
  { slot: "project-10", kind: "project" as const, title: "Cruz decorativa", detail: "Herrería ornamental", url: "/assets/hpu/gallery-cruz-metal-editorial.png", storageKey: "local/gallery-cruz-metal-editorial.png" },
  { slot: "project-11", kind: "project" as const, title: "Repisa circular", detail: "Diseño y funcionalidad", url: "/assets/hpu/gallery-repisa-circular-editorial.png", storageKey: "local/gallery-repisa-circular-editorial.png" },
  { slot: "project-12", kind: "project" as const, title: "Consola dorada", detail: "Herrería y vidrio · recibidor", url: "/assets/hpu/catalog/consola-dorada.webp", storageKey: "local/catalog/consola-dorada.webp" },
  { slot: "project-13", kind: "project" as const, title: "Mesa auxiliar de madera", detail: "Metal y madera · sala", url: "/assets/hpu/catalog/mesa-auxiliar-madera.webp", storageKey: "local/catalog/mesa-auxiliar-madera.webp" },
  { slot: "project-14", kind: "project" as const, title: "Cruz de madera y metal", detail: "Decoración artesanal", url: "/assets/hpu/catalog/cruz-madera-metal.webp", storageKey: "local/catalog/cruz-madera-metal.webp" },
  { slot: "project-15", kind: "project" as const, title: "Mesa de comedor negra", detail: "Comedor · estructura HPU", url: "/assets/hpu/catalog/mesa-comedor-negra.webp", storageKey: "local/catalog/mesa-comedor-negra.webp" },
  { slot: "project-16", kind: "project" as const, title: "Aplique de metal", detail: "Iluminación artesanal · vista 1", url: "/assets/hpu/catalog/aplique-metal-1.webp", storageKey: "local/catalog/aplique-metal-1.webp" },
  { slot: "project-17", kind: "project" as const, title: "Aplique de metal", detail: "Iluminación artesanal · vista 2", url: "/assets/hpu/catalog/aplique-metal-2.webp", storageKey: "local/catalog/aplique-metal-2.webp" },
  { slot: "project-18", kind: "project" as const, title: "Estructura para eventos", detail: "Herrería decorativa · exterior", url: "/assets/hpu/catalog/estructura-evento-dorada.webp", storageKey: "local/catalog/estructura-evento-dorada.webp" },
  { slot: "project-19", kind: "project" as const, title: "Mesa de centro con mosaico", detail: "Sala · vista 1", url: "/assets/hpu/catalog/mesa-centro-mosaico-1.webp", storageKey: "local/catalog/mesa-centro-mosaico-1.webp" },
  { slot: "project-20", kind: "project" as const, title: "Mesa de centro con mosaico", detail: "Sala · vista 2", url: "/assets/hpu/catalog/mesa-centro-mosaico-2.webp", storageKey: "local/catalog/mesa-centro-mosaico-2.webp" },
  { slot: "project-21", kind: "project" as const, title: "Consola azul", detail: "Mueble a medida · exhibición", url: "/assets/hpu/catalog/consola-azul.webp", storageKey: "local/catalog/consola-azul.webp" },
  { slot: "project-22", kind: "project" as const, title: "Mesa de centro con mosaico", detail: "Sala · detalle de cubierta", url: "/assets/hpu/catalog/mesa-centro-mosaico-3.webp", storageKey: "local/catalog/mesa-centro-mosaico-3.webp" },
  { slot: "project-23", kind: "project" as const, title: "Barandal decorativo", detail: "Herrería ornamental", url: "/assets/hpu/catalog/barandal-decorativo.webp", storageKey: "local/catalog/barandal-decorativo.webp" },
] as const;
