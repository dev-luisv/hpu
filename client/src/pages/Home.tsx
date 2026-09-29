import { useEffect, useState, type FormEvent, type SyntheticEvent } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Maximize2,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { categories, contact, products, projectPhotos } from "@/data/catalog";
import { heroFixed } from "@/assets/fixed/fixedImages";

function keepImageVisible(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset.fallback) return;
  image.dataset.fallback = "true";
  image.src = image.src.includes("-upscaled.webp")
    ? image.src.replace("-upscaled.webp", "-enhanced.jpg")
    : `${import.meta.env.BASE_URL}assets/hpu/facebook-7-enhanced.jpg`;
}

function formatPrice(value: string) {
  const normalized = value.trim().replace(/[$,]/g, "");
  if (/^\d+(\.\d+)?$/.test(normalized)) return `$${Number(normalized).toLocaleString("es-MX")}`;
  return value;
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#inicio" className={`brand ${compact ? "brand--compact" : ""}`} aria-label="HPU, inicio">
      <span className="brand-mark" aria-hidden="true"><span /></span>
      <span className="brand-copy"><strong>HPU</strong><small>tus sueños en metal</small></span>
    </a>
  );
}

function WhatsAppButton({ label = "Cotizar por WhatsApp", secondary = false }: { label?: string; secondary?: boolean }) {
  return (
    <a className={secondary ? "button button--outline" : "button button--copper"} href={contact.whatsappHref} target="_blank" rel="noreferrer">
      <MessageCircle size={17} strokeWidth={1.8} />
      {label}
      <ArrowUpRight size={16} strokeWidth={1.8} />
    </a>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; title: string; detail?: string } | null>(null);
  const liveCategories = categories;
  const liveProducts = products;
  const heroImage = heroFixed;
  const customImage = `${import.meta.env.BASE_URL}assets/hpu/facebook-6-upscaled.webp`;
  const showroomImage = `${import.meta.env.BASE_URL}assets/hpu/facebook-1-upscaled.webp`;
  const liveProjectPhotos = projectPhotos;
  const primaryProductSlugs = new Set(["base-cama", "mesa-centro", "mesa-comedor", "lampara-metal"]);
  const filteredProducts = activeCategory === "Todos"
    ? liveProducts.filter((product) => primaryProductSlugs.has(String("slug" in product ? product.slug : product.id)))
    : liveProducts.filter((product) => product.category === activeCategory && !primaryProductSlugs.has(String("slug" in product ? product.slug : product.id)));

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openImage = (src: string, title: string, detail?: string) => setLightbox({ src, title, detail });

  return (
    <main id="inicio" className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
            <a href="#catalogo" onClick={closeMenu}>Catálogo</a>
            <a href="#medida" onClick={closeMenu}>A medida</a>
            <a href="#proyectos" onClick={closeMenu}>Proyectos</a>
            <a href="#showroom" onClick={closeMenu}>Showroom</a>
            <a href="#contacto" onClick={closeMenu}>Contacto</a>
          </nav>
          <div className="header-actions">
            <a className="header-phone" href={contact.phoneHref}><Phone size={15} /> {contact.phoneDisplay}</a>
            <WhatsAppButton label="Cotizar" />
          </div>
          <button className="menu-toggle" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-grid container">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> Mueblería & herrería · Querétaro</p>
            <h1>Lo que imaginas,<br /><em>lo forjamos.</em></h1>
            <p className="hero-lede">Muebles de metal con diseño, oficio y carácter. Piezas que empiezan como una idea y terminan transformando tu espacio.</p>
            <div className="hero-actions">
              <a className="button button--dark" href="#catalogo">Explorar catálogo <ArrowDown size={17} /></a>
              <a className="text-link" href="#medida">Diseñar a medida <ArrowUpRight size={17} /></a>
            </div>
            <div className="hero-proof"><span>01</span><div><strong>Hecho en Querétaro</strong><small>Del taller a tu espacio</small></div></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <button className="image-trigger image-trigger--hero" type="button" onClick={() => openImage(heroImage, "Portada HPU", "Sillón de metal · imagen principal")} aria-label="Ampliar imagen de portada"><img src={heroImage} alt="Sillón de metal tejido fabricado por HPU" onError={keepImageVisible} /><span className="image-zoom-hint"><Maximize2 size={15} /> Ver imagen</span></button>
              <div className="image-stamp"><span>HPU</span><small>DESDE<br />EL TALLER</small></div>
            </div>
            <div className="hero-side-note"><span className="vertical-label">TUS SUEÑOS EN METAL</span><span className="side-rule" /></div>
            <div className="hero-index">01 <span>/</span> 04</div>
          </div>
        </div>
        <div className="hero-bottom container"><span>Desliza para descubrir</span><span className="hero-bottom-line" /><span>MX · QRO</span></div>
      </section>

      <section className="intro-section section-light">
        <div className="container intro-grid">
          <div className="section-kicker"><span>02</span><span className="kicker-line" /><span>La esencia HPU</span></div>
          <div className="intro-content"><p className="eyebrow">Metal con intención</p><h2>Diseño que nace<br />del <em>oficio.</em></h2><p className="intro-text">En HPU convertimos el metal en piezas que hacen hogar. Desde una base de cama hasta un mueble completamente personalizado, trabajamos cada proyecto con precisión, atención al detalle y gusto por lo bien hecho.</p><a className="text-link text-link--dark" href="#medida">Conoce nuestra forma de trabajar <ArrowUpRight size={17} /></a></div>
          <div className="intro-aside"><div className="aside-number">+<strong>∞</strong></div><p>Posibilidades<br />para crear</p><div className="aside-line" /></div>
        </div>
      </section>

      <section id="catalogo" className="catalog-section section-paper">
        <div className="container">
          <div className="section-heading section-heading--split"><div><p className="eyebrow"><span className="eyebrow-line" /> Colección actual</p><h2>Piezas para<br /><em>habitar.</em></h2></div><p className="section-intro">Una selección de muebles pensados para durar, convivir y contar algo de ti. Explora nuestras categorías o escríbenos para comenzar un diseño propio.</p></div>
          <div className="category-tabs" role="tablist" aria-label="Filtrar catálogo"><button className={activeCategory === "Todos" ? "is-active" : ""} onClick={() => setActiveCategory("Todos")}>Todos <span>{String(primaryProductSlugs.size).padStart(2, "0")}</span></button>{liveCategories.slice(0, 4).map((category) => <button key={category.id} className={activeCategory === category.id ? "is-active" : ""} onClick={() => setActiveCategory(category.id)}>{category.label} <span>{category.number}</span></button>)}</div>
          <div className="product-grid">{filteredProducts.map((product, index) => <article className={`product-card product-card--${product.accent}`} key={product.id}><div className="product-top"><span className="product-number">0{index + 1}</span><span className="product-price">{formatPrice(product.price)}</span></div>{product.imageUrl ? <button className="product-image image-trigger" type="button" onClick={() => openImage(product.imageUrl!, product.name, product.description)} aria-label={`Ampliar foto de ${product.name}`}><img src={product.imageUrl} alt={product.name} loading="lazy" onError={keepImageVisible} /><span className="image-zoom-hint"><Maximize2 size={14} /> Ampliar</span></button> : <div className="product-icon"><div className="icon-frame"><span className="icon-line icon-line--one" /><span className="icon-line icon-line--two" /><span className="icon-dot" /></div></div>}<div className="product-info"><p className="eyebrow">{product.eyebrow}</p><h3>{product.name}</h3><p>{product.description}</p><p className="product-price-visible"><strong>Precio:</strong> {formatPrice(product.price)}</p><a href={contact.whatsappHref} target="_blank" rel="noreferrer" className="product-link">Solicitar información <ChevronRight size={16} /></a></div></article>)}</div>
          <div className="catalog-foot"><span>Precios y medidas disponibles bajo cotización.</span><WhatsAppButton label="Cuéntanos qué buscas" secondary /></div>
        </div>
      </section>

      <section id="medida" className="custom-section section-ink">
        <div className="container custom-grid"><div className="custom-visual"><button className="custom-photo image-trigger" type="button" onClick={() => openImage(customImage, "Proceso y detalle", "Fabricación a medida HPU")} aria-label="Ampliar imagen del proceso"><img src={customImage} alt="Piezas de metal fabricadas en el taller HPU" onError={keepImageVisible} /><div className="custom-photo-label">PROCESO<br />& DETALLE</div><span className="image-zoom-hint"><Maximize2 size={14} /> Ampliar</span></button><div className="custom-ring" /></div><div className="custom-copy"><div className="section-kicker section-kicker--light"><span>03</span><span className="kicker-line" /><span>Fabricación a medida</span></div><p className="eyebrow eyebrow--light">Tu idea, nuestra herramienta</p><h2>Tu espacio no es<br /><em>como los demás.</em></h2><p>Por eso no fabricamos en serie. Diseñamos y construimos muebles de metal según tus medidas, tu estilo y la manera en que quieres vivirlos.</p><div className="process-list"><div><span>01</span><p><strong>Platícanos tu idea</strong><small>Puede ser un dibujo, una foto o solo una conversación.</small></p></div><div><span>02</span><p><strong>Definimos los detalles</strong><small>Medidas, acabados y la personalidad de tu pieza.</small></p></div><div><span>03</span><p><strong>La hacemos realidad</strong><small>Fabricamos con oficio y te acompañamos hasta verla en tu espacio.</small></p></div></div><WhatsAppButton label="Iniciar un proyecto" /></div></div>
      </section>

      <section id="proyectos" className="projects-section section-light"><div className="container"><div className="section-heading section-heading--projects"><div><p className="eyebrow"><span className="eyebrow-line" /> Hecho por HPU</p><h2>Ideas que ya<br /><em>tomaron forma.</em></h2></div><a className="text-link text-link--dark" href={contact.facebookHref} target="_blank" rel="noreferrer">Ver más en Facebook <ArrowUpRight size={17} /></a></div><div className="project-grid">{liveProjectPhotos.map((photo) => <figure className={`project-photo project-photo--${photo.tone}${photo.cutout ? " project-photo--cutout" : photo.softened ? " project-photo--softened" : ""}`} key={photo.src}><button className="project-image-trigger" type="button" onClick={() => openImage(photo.src, photo.title, photo.detail)} aria-label={`Ampliar ${photo.title}`}><img src={photo.src} alt={`${photo.title}, ${photo.detail}`} loading="lazy" onError={keepImageVisible} /><span className="image-zoom-hint"><Maximize2 size={14} /> Ver detalle</span></button><figcaption><span>{photo.detail}</span><strong>{photo.title}</strong></figcaption></figure>)}</div><p className="source-note">Fotografías del perfil público de Herrería Uribe · imágenes optimizadas para esta muestra. Toca cualquier imagen para verla en detalle.</p></div></section>

      <section id="showroom" className="showroom-section section-copper"><div className="container showroom-grid"><div className="showroom-copy"><p className="eyebrow eyebrow--dark"><span className="eyebrow-line eyebrow-line--dark" /> Ven a conocernos</p><h2>El metal se<br /><em>siente en persona.</em></h2><p>Tenemos un espacio de exhibición en Querétaro donde puedes ver de cerca nuestros muebles, comparar acabados y platicar sobre tu próximo proyecto.</p><div className="showroom-meta"><div><MapPin size={19} /><span><strong>Querétaro, México</strong><small>Dirección y horarios próximamente</small></span></div><div><Phone size={19} /><span><strong>{contact.phoneDisplay}</strong><small>Atención y cotizaciones</small></span></div></div><a className="button button--dark" href={contact.phoneHref}>Llamar ahora <Phone size={16} /></a></div><button className="showroom-card image-trigger" type="button" onClick={() => openImage(showroomImage, "Showroom HPU", "Metal que encuentra su lugar")} aria-label="Ampliar imagen del showroom"><div className="showroom-card-top"><span>SHOWROOM</span><span>QRO · MX</span></div><img src={showroomImage} alt="Detalle decorativo de metal en el espacio de HPU" loading="lazy" onError={keepImageVisible} /><div className="showroom-card-bottom"><span>Metal que encuentra<br />su lugar.</span><span className="arrow-circle"><ArrowUpRight size={19} /></span></div><span className="image-zoom-hint"><Maximize2 size={14} /> Ampliar</span></button></div></section>

      <section id="contacto" className="contact-section section-paper"><div className="container contact-grid"><div><p className="eyebrow"><span className="eyebrow-line" /> Hablemos</p><h2>Cuéntanos<br /><em>qué imaginas.</em></h2><p className="contact-lede">Estamos listos para escuchar tu idea y convertirla en una pieza que se quede contigo.</p><div className="contact-direct"><a href={contact.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={22} /><span><small>Escríbenos por WhatsApp</small><strong>{contact.phoneDisplay}</strong></span><ArrowUpRight size={19} /></a><a href={contact.phoneHref}><Phone size={22} /><span><small>Llámanos directamente</small><strong>{contact.phoneDisplay}</strong></span><ArrowUpRight size={19} /></a></div></div><form className="contact-form" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const values = new FormData(event.currentTarget); const message = encodeURIComponent(`Hola HPU, soy ${values.get("name")}. Me gustaría cotizar: ${values.get("message")}`); window.open(`https://wa.me/524427878043?text=${message}`, "_blank", "noopener,noreferrer"); setSent(true); }}><label>Tu nombre<input required name="name" placeholder="¿Cómo te llamas?" /></label><label>¿Qué te gustaría crear?<textarea required name="message" rows={4} placeholder="Cuéntanos sobre tu idea, medidas aproximadas o pieza que buscas." /></label><button className="button button--dark" type="submit">{sent ? <><Check size={17} /> Consulta enviada</> : <>Enviar por WhatsApp <ArrowUpRight size={17} /></>}</button>{sent && <p className="form-success">Se abrió WhatsApp con tu mensaje listo para enviar.</p>}</form></div></section>

      <footer className="site-footer"><div className="container footer-top"><Brand compact /><p>Metal con diseño.<br />Hecho para ti.</p><div className="footer-links"><a href="#catalogo">Catálogo</a><a href="#medida">A medida</a><a href="#proyectos">Proyectos</a><a href={contact.facebookHref} target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={14} /></a></div><a className="footer-arrow" href="#inicio" aria-label="Volver al inicio"><ArrowDown size={19} /></a></div><div className="container footer-bottom"><span>© 2026 HPU · Tus sueños en metal</span><span>Querétaro, México</span><span>Hecho con oficio</span></div></footer>
      <a className="floating-whatsapp" href={contact.whatsappHref} target="_blank" rel="noreferrer" aria-label="Abrir WhatsApp"><MessageCircle size={21} /></a>
      {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Imagen ampliada: ${lightbox.title}`} onClick={() => setLightbox(null)}><div className="lightbox-panel" onClick={(event) => event.stopPropagation()}><button className="lightbox-close" type="button" onClick={() => setLightbox(null)} aria-label="Cerrar imagen"><X size={22} /></button><img src={lightbox.src} alt={lightbox.title} onError={keepImageVisible} /><div className="lightbox-caption"><strong>{lightbox.title}</strong>{lightbox.detail && <span>{lightbox.detail}</span>}</div></div></div>}
    </main>
  );
}
