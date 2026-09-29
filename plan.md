# Plan de implementación — HPU

## Objetivo
Construir y operar una landing/catálogo público en español para HPU, mueblería y herrería de Querétaro, con el eslogan “tus sueños en metal”. El sitio presenta productos, fabricación a medida, proyectos, showroom y contacto por teléfono/WhatsApp. El contenido público puede administrarse desde un panel privado sin editar código.

## Dirección visual
Se adopta “Forja editorial”: carbón, marfil cálido, gris piedra y cobre; mezcla de tipografía editorial con sans contemporánea; fotografía de producto en interiores y detalles de taller.

## Arquitectura actual
- **Frontend:** React + Vite, servido por el servidor Express en modo producción y por Vite en Preview.
- **Backend:** Express + tRPC; `/api/health` y `/api/trpc` son rutas dinámicas.
- **Autenticación:** Manus OAuth con sesión `webdev_app_session`; el panel usa `adminProcedure` y nunca expone datos de administración a visitantes anónimos.
- **Persistencia:** MySQL administrado con tablas `catalog_categories`, `catalog_items`, `media_assets` y `users`.
- **Imágenes:** almacenamiento durable `/manus-storage/<key>` mediante el helper de presigned storage; el backend valida usuario, tipo y límite de 8 MB antes de guardar. La biblioteca incluye espacios editables para `hero`, `custom`, `showroom` y `project-1` a `project-6`, además de fotos de producto.
- **Contenido editable:** categorías, productos, descripciones, precios/estados, visibilidad y fotos se administran en `/admin`.
- **Bootstrap de administración:** si no existe `OWNER_OPEN_ID`, la primera cuenta OAuth creada en un proyecto vacío queda como `admin`; las cuentas posteriores no reciben ese rol automáticamente.

## Rutas y experiencia
- `/`: catálogo público, fabricación a medida, proyectos, showroom y contacto.
- `/admin`: panel privado con resumen, productos/categorías y biblioteca de fotos.
- `/404`: fallback del starter.
- El catálogo público consulta el backend y conserva un fallback local para que la landing no quede vacía mientras la API no responde.

## Producción y SEO
Se usa una aplicación contenedorizada (`features.server: true`, `features.database: true`, Dockerfile y health check `/api/health`). Se mantienen title, description, Open Graph básico, favicon, `robots.txt`, `sitemap.xml` y manifiesto de rutas. El canonical absoluto se omitirá hasta conocer el dominio público real.

## Cache y despliegue
La publicación usa el Dockerfile existente: instala dependencias, construye frontend y backend, y arranca `dist/index.js` en `PORT`. Los datos mutables viven en MySQL y las fotos en almacenamiento durable; no se escriben en el filesystem efímero del contenedor.

## Verificación
- `pnpm check`
- `pnpm build`
- migración `pnpm db:migrate` aplicada y tablas verificadas en MySQL
- `/api/health`, `/`, `/admin` y `/api/trpc/catalog.public` responden correctamente en Preview local
- `/api/trpc/catalog.admin.dashboard` devuelve `403` sin autenticación
- configuración Webdev verificada con servidor, base de datos y deploy activos
- no se inventan dirección, horarios ni precios: el panel deja precios como texto editable (`Cotizar`, `Próximamente`, etc.)
