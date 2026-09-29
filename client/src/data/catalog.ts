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
  cutout?: boolean;
  softened?: boolean;
};

/**
 * Edita este archivo para cambiar nombres, textos, precios y fotografías del catálogo.
 * Los precios pueden quedarse como "Cotizar" o "Próximamente" mientras se definen.
 */
export const categories = [
  { id: "bases", label: "Bases de cama", number: "01", note: "Estructuras que sostienen el descanso." },
  { id: "centro", label: "Mesas de centro", number: "02", note: "Piezas que le dan ritmo a la sala." },
  { id: "comedor", label: "Mesas de comedor", number: "03", note: "Reuniones alrededor de un diseño propio." },
  { id: "lamparas", label: "Lámparas de metal", number: "04", note: "Luz con carácter para cada espacio." },
  { id: "medida", label: "Muebles a medida", number: "05", note: "Si puedes imaginarlo, podemos construirlo." },
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
  },
  {
    id: "mesa-centro",
    name: "Mesas de centro",
    eyebrow: "Sala",
    description: "Proporciones pensadas para convivir con tu espacio, estilo y forma de vivir.",
    price: "Cotizar",
    category: "centro",
    accent: "copper",
  },
  {
    id: "mesa-comedor",
    name: "Mesas de comedor",
    eyebrow: "Comedor",
    description: "Una pieza central para reunir personas, materiales y momentos.",
    price: "Cotizar",
    category: "comedor",
    accent: "stone",
  },
  {
    id: "lampara-metal",
    name: "Lámparas de metal",
    eyebrow: "Iluminación",
    description: "Detalles escultóricos que transforman la atmósfera sin perder funcionalidad.",
    price: "Cotizar",
    category: "lamparas",
    accent: "ink",
  },
];

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const projectPhotos: ProjectPhoto[] = [
  { src: asset("/assets/hpu/facebook-7-upscaled.webp"), title: "Sillón tejido", detail: "Estructura y comodidad", tone: "wide" },
  { src: asset("/assets/hpu/facebook-5-upscaled.webp"), title: "Jardineras", detail: "Piezas para exterior", tone: "tall" },
  { src: asset("/assets/hpu/facebook-1-upscaled.webp"), title: "Rueda botánica", detail: "Metal convertido en detalle", tone: "square" },
  { src: asset("/assets/hpu/facebook-6-upscaled.webp"), title: "Soportes", detail: "Composición y equilibrio", tone: "square" },
  { src: asset("/assets/hpu/facebook-8-upscaled.webp"), title: "Arte en metal", detail: "Trabajo especial", tone: "tall" },
  { src: asset("/assets/hpu/facebook-3-upscaled.webp"), title: "Pieza de exhibición", detail: "Fabricación a medida", tone: "wide" },
];

export const contact = {
  phoneDisplay: "442 787 8043",
  phoneHref: "tel:+524427878043",
  whatsappHref: "https://wa.me/524427878043?text=Hola%20HPU,%20quiero%20cotizar%20un%20mueble%20de%20metal.",
  facebookHref: "https://www.facebook.com/profile.php?id=100084615227080",
  city: "Querétaro, México",
};
