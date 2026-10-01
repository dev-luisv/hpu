export type CatalogItem = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  price: string;
  category: string;
  accent: string;
  imageUrl?: string | null;
};

export type ProjectPhoto = {
  src: string;
  title: string;
  detail: string;
  tone: string;
  group: "Muebles" | "Decoración" | "Iluminación" | "Estructuras";
  cutout?: boolean;
  softened?: boolean;
  polished?: boolean;
};

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

/**
 * Edita este archivo para cambiar nombres, textos, precios y fotografías del catálogo.
 * Los precios pueden quedarse como "Cotizar" o "Próximamente" mientras se definen.
 */
export const categories = [
  { id: "bases", label: "Bases de cama", number: "01", note: "Estructuras resistentes, limpias y hechas a la medida." },
  { id: "centro", label: "Mesas de centro", number: "02", note: "Mesas y auxiliares para sala en metal, madera y mosaico." },
  { id: "lamparas", label: "Lámparas", number: "03", note: "Lámparas y apliques de metal con carácter artesanal." },
];

export const products: CatalogItem[] = [
  {
    id: "base-cama",
    name: "Bases de cama",
    eyebrow: "Dormitorio",
    description: "Diseñadas a la medida de tu colchón, con líneas limpias y estructura sólida.",
    price: "Cotizar",
    category: "bases",
    accent: "olive",
    imageUrl: asset("/assets/hpu-fixed/base-cama.jpg"),
  },
  {
    id: "mesa-centro",
    name: "Mesa de centro",
    eyebrow: "Sala",
    description: "Una pieza versátil para sala, con estructura metálica y diseño a medida.",
    price: "Cotizar",
    category: "centro",
    accent: "copper",
    imageUrl: asset("/assets/hpu-fixed/mesa-centro.jpg"),
  },
  {
    id: "mesa-auxiliar-madera",
    name: "Mesa auxiliar de madera",
    eyebrow: "Sala",
    description: "Estructura de metal con cubierta de madera para complementar espacios pequeños.",
    price: "Cotizar",
    category: "centro",
    accent: "olive",
    imageUrl: asset("/assets/hpu-fixed/catalog/mesa-auxiliar-madera.webp"),
  },
  {
    id: "mesa-centro-mosaico",
    name: "Mesa de centro con mosaico",
    eyebrow: "Sala",
    description: "Estructura metálica con cubierta de mosaico para convertirse en el punto focal del espacio.",
    price: "Cotizar",
    category: "centro",
    accent: "stone",
    imageUrl: asset("/assets/hpu-fixed/catalog/mesa-centro-mosaico-1.webp"),
  },
  {
    id: "lampara-metal",
    name: "Lámparas de metal",
    eyebrow: "Iluminación",
    description: "Piezas de iluminación con formas geométricas y fabricación artesanal.",
    price: "Cotizar",
    category: "lamparas",
    accent: "ink",
    imageUrl: asset("/assets/hpu-fixed/lampara-metal.jpg"),
  },
  {
    id: "aplique-metal",
    name: "Apliques de metal",
    eyebrow: "Iluminación",
    description: "Luminarias artesanales de metal que aportan textura y carácter a los muros.",
    price: "Cotizar",
    category: "lamparas",
    accent: "copper",
    imageUrl: asset("/assets/hpu-fixed/catalog/aplique-metal-1.webp"),
  },
];

export const projectPhotos: ProjectPhoto[] = [
  { src: asset("/assets/hpu-fixed/projects/repisa-circular.png"), title: "Repisa circular", detail: "Metal con presencia", tone: "wide", group: "Muebles" },
  { src: asset("/assets/hpu-fixed/projects/detalle-madera-metal.png"), title: "Detalle de madera y metal", detail: "Acabados y contraste", tone: "square", group: "Muebles" },
  { src: asset("/assets/hpu-fixed/projects/cruz-decorativa.png"), title: "Cruz decorativa", detail: "Pieza especial", tone: "tall", group: "Decoración" },
  { src: asset("/assets/hpu-fixed/projects/jardineras.webp"), title: "Jardineras", detail: "Piezas para exterior", tone: "wide", group: "Decoración" },
  { src: asset("/assets/hpu-fixed/projects/estructura-colorida.png"), title: "Estructura colorida", detail: "Trabajo especial", tone: "square", group: "Estructuras" },
  { src: asset("/assets/hpu-fixed/projects/lamparas-geometricas.png"), title: "Lámparas geométricas", detail: "Iluminación decorativa", tone: "tall", group: "Iluminación" },
  { src: asset("/assets/hpu-fixed/projects/pieza-exhibicion.webp"), title: "Pieza de exhibición", detail: "Fabricación a medida", tone: "square", group: "Estructuras" },
  { src: asset("/assets/hpu-fixed/projects/arte-metal.webp"), title: "Arte en metal", detail: "Diseño y oficio", tone: "tall", group: "Decoración" },
  { src: asset("/assets/hpu-fixed/projects/soportes.webp"), title: "Soportes", detail: "Composición y equilibrio", tone: "square", group: "Estructuras" },
  { src: asset("/assets/hpu-fixed/projects/rueda-botanica.webp"), title: "Rueda botánica", detail: "Metal convertido en detalle", tone: "wide", group: "Decoración" },
  { src: asset("/assets/hpu-fixed/projects/sillon-tejido.webp"), title: "Sillón tejido", detail: "Estructura y comodidad", tone: "square", group: "Muebles" },

  { src: asset("/assets/hpu-fixed/mesa-comedor.jpg"), title: "Mesa de comedor", detail: "Mesa · fabricación HPU", tone: "wide", group: "Muebles", polished: true },
  { src: asset("/assets/hpu-fixed/catalog/consola-dorada.webp"), title: "Consola dorada", detail: "Herrería y vidrio · recibidor", tone: "wide", group: "Muebles", polished: true },
  { src: asset("/assets/hpu-fixed/catalog/cruz-madera-metal.webp"), title: "Cruz de madera y metal", detail: "Decoración artesanal", tone: "tall", group: "Decoración", polished: true },
  { src: asset("/assets/hpu-fixed/catalog/mesa-comedor-negra.webp"), title: "Mesa de comedor negra", detail: "Comedor · estructura HPU", tone: "wide", group: "Muebles", polished: true },
  { src: asset("/assets/hpu-fixed/catalog/estructura-evento-dorada.webp"), title: "Estructura para eventos", detail: "Herrería decorativa · exterior", tone: "wide", group: "Estructuras", polished: true },
  { src: asset("/assets/hpu-fixed/catalog/consola-azul.webp"), title: "Consola azul", detail: "Mueble a medida · exhibición", tone: "wide", group: "Muebles", polished: true },
  { src: asset("/assets/hpu-fixed/catalog/barandal-decorativo.webp"), title: "Barandal decorativo", detail: "Herrería ornamental", tone: "tall", group: "Estructuras", polished: true },

  { src: asset("/assets/hpu-fixed/catalog/aplique-metal-2.webp"), title: "Aplique de metal", detail: "Iluminación artesanal · vista 2", tone: "tall", group: "Iluminación", polished: true },
  { src: asset("/assets/hpu-fixed/catalog/mesa-centro-mosaico-2.webp"), title: "Mesa de centro con mosaico", detail: "Sala · vista 2", tone: "tall", group: "Muebles", polished: true },
  { src: asset("/assets/hpu-fixed/catalog/mesa-centro-mosaico-3.webp"), title: "Mesa de centro con mosaico", detail: "Sala · detalle de cubierta", tone: "square", group: "Muebles", polished: true },
];

export const contact = {
  phoneDisplay: "442 787 8043",
  phoneHref: "tel:+524427878043",
  whatsappHref: "https://wa.me/524427878043?text=Hola%20HPU,%20quiero%20cotizar%20un%20mueble%20de%20metal.",
  facebookHref: "https://www.facebook.com/profile.php?id=100084615227080",
  city: "Querétaro, México",
};
