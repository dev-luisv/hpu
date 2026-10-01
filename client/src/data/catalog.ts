export type CatalogItem = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  price: string;
  category: string;
  accent: string;
  imageUrl?: string | null;
  imageUrls?: string[];
};

export type ProjectPhoto = {
  src: string;
  title: string;
  detail: string;
  tone: string;
  cutout?: boolean;
  softened?: boolean;
};

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const categories = [
  { id: "bases", label: "Bases de cama", number: "01", note: "Estructuras que sostienen el descanso." },
  { id: "centro", label: "Mesas de centro", number: "02", note: "Piezas que le dan ritmo a la sala." },
  { id: "lamparas", label: "Lámparas de metal", number: "03", note: "Luz con carácter para cada espacio." },
];

export const products: CatalogItem[] = [
  {
    id: "lampara-geometrica-triple",
    name: "Lámpara geométrica triple",
    eyebrow: "Iluminación",
    description: "Lámpara colgante de metal con diseño geométrico y tres luminarias suspendidas.",
    price: "Cotizar",
    category: "lamparas",
    accent: "ink",
    imageUrl: asset("/assets/hpu-fixed/catalog/lampara-geometrica-triple-v1.avif"),
  },
  {
    id: "base-cama-metal-negra",
    name: "Base de cama de metal",
    eyebrow: "Dormitorio",
    description: "Base de cama en metal negro con cabecera y piecera de diseño clásico.",
    price: "Cotizar",
    category: "bases",
    accent: "stone",
    imageUrl: asset("/assets/hpu-fixed/catalog/base-cama-metal-negra-v3.webp"),
  },
  {
    id: "mesa-auxiliar-negra",
    name: "Mesa auxiliar negra",
    eyebrow: "Sala",
    description: "Mesa auxiliar de metal negro con cubierta de madera para complementar la sala.",
    price: "Cotizar",
    category: "centro",
    accent: "ink",
    imageUrl: asset("/assets/hpu-fixed/imported/02-mesa-auxiliar-negra.webp"),
  },
  {
    id: "mesa-centro-decorativa",
    name: "Mesa de centro decorativa",
    eyebrow: "Sala",
    description: "Mesa de centro con cubierta de vidrio y trabajo metálico decorativo.",
    price: "Cotizar",
    category: "centro",
    accent: "copper",
    imageUrl: asset("/assets/hpu-fixed/imported/09-mesa-centro-ambiente.webp"),
  },
];

export const projectPhotos: ProjectPhoto[] = [
  { src: asset("/assets/hpu-fixed/projects/repisa-circular.png"), title: "Repisa circular", detail: "Metal con presencia", tone: "wide" },
  { src: asset("/assets/hpu-fixed/projects/detalle-madera-metal.png"), title: "Detalle de madera y metal", detail: "Acabados y contraste", tone: "square" },
  { src: asset("/assets/hpu-fixed/projects/cruz-decorativa.png"), title: "Cruz decorativa", detail: "Pieza especial", tone: "tall" },
  { src: asset("/assets/hpu-fixed/projects/jardineras.webp"), title: "Jardineras", detail: "Piezas para exterior", tone: "wide" },
  { src: asset("/assets/hpu-fixed/projects/estructura-colorida.png"), title: "Estructura colorida", detail: "Trabajo especial", tone: "square" },
  { src: asset("/assets/hpu-fixed/projects/lamparas-geometricas.png"), title: "Lámparas geométricas", detail: "Iluminación decorativa", tone: "tall" },
  { src: asset("/assets/hpu-fixed/projects/pieza-exhibicion.webp"), title: "Pieza de exhibición", detail: "Fabricación a medida", tone: "square" },
  { src: asset("/assets/hpu-fixed/projects/arte-metal.webp"), title: "Arte en metal", detail: "Diseño y oficio", tone: "tall" },
  { src: asset("/assets/hpu-fixed/projects/soportes.webp"), title: "Soportes", detail: "Composición y equilibrio", tone: "square" },
  { src: asset("/assets/hpu-fixed/projects/rueda-botanica.webp"), title: "Rueda botánica", detail: "Metal convertido en detalle", tone: "wide" },
  { src: asset("/assets/hpu-fixed/projects/sillon-tejido.webp"), title: "Sillón tejido", detail: "Estructura y comodidad", tone: "square" },

  { src: asset("/assets/hpu-fixed/imported/01-mesa-dorada.webp"), title: "Mesa dorada con vidrio", detail: "Pieza especial · fabricación a medida", tone: "wide" },
  { src: asset("/assets/hpu-fixed/imported/03-cruz-metal.webp"), title: "Cruz de metal", detail: "Pieza decorativa", tone: "tall" },
  { src: asset("/assets/hpu-fixed/imported/04-mesa-comedor.webp"), title: "Mesa de comedor", detail: "Mesa de comedor · trabajo realizado", tone: "wide" },
  { src: asset("/assets/hpu-fixed/imported/07-mesa-dorada-floral.webp"), title: "Estructura dorada floral", detail: "Proyecto especial · montaje decorativo", tone: "wide" },
  { src: asset("/assets/hpu-fixed/imported/11-consola-azul.webp"), title: "Consola azul", detail: "Mueble a medida · trabajo realizado", tone: "square" },
];

export const contact = {
  phoneDisplay: "442 787 8043",
  phoneHref: "tel:+524427878043",
  whatsappHref: "https://wa.me/524427878043?text=Hola%20HPU,%20quiero%20cotizar%20un%20mueble%20de%20metal.",
  facebookHref: "https://www.facebook.com/profile.php?id=100084615227080",
  city: "Querétaro, México",
};
