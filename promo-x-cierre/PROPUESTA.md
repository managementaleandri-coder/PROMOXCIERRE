# PROMO X CIERRE — web

Página de una sola columna, pensada para verse en el teléfono. **El muñeco vive en el carril derecho de los botones y sube o baja siguiendo al puntero**; cuando el puntero está a la altura de un botón, se posa sobre él. Al tocar, lo aprieta, dice una frase ("PASEN Y GOCEN", de su propio tuit) y recién ahí se abre el link.

| Dónde | Qué hace el muñeco |
|---|---|
| Teléfono | Sigue el scroll (se posa en el botón más cercano al centro). Al tocar un botón: va, lo aprieta, habla y abre el link. |
| Computadora | Sigue la altura del mouse. Clic: aprieta, habla y abre en otra pestaña. |
| Teclado | Se posa en el botón con foco. |
| "Reducir movimiento" activado | Queda quieto sobre el botón; los links abren directo. |

## Secciones

1. Cinta con las fechas de la gira (se arma sola desde los datos).
2. Nombre + chip de la gira. El muñeco arranca posado sobre el primer botón (entra cayendo).
3. Botones: Entradas CCW Tour, álbum, EP, Apple Music, Spotify, Instagram, YouTube, X y Booking (WhatsApp).
4. Fechas de la gira (las pasadas se ocultan solas; Uniclub muestra AGOTADO).
5. Discos en una tira que se desliza con el dedo.
6. Quiénes son (stickers con nombre y rol).

## Cómo publicar y actualizar

- **Contenido:** todo se edita en `data.js` (links, fechas, discos, integrantes). Las fechas van como `AAAA-MM-DD`.
- **Arte:** reemplazar `img/muneco.png` por el PNG real (transparente). Si es de cuerpo entero, no hay que tocar nada más.
- **GitHub Pages:** el workflow `.github/workflows/pages.yml` arma el sitio y lo publica en la rama `gh-pages` en cada cambio. Si Pages no apareciera solo: *Settings → Pages → Deploy from a branch → gh-pages / (root)*. URL resultante: `https://managementaleandri-coder.github.io/chofi-sistema-luces/` (la primera referencia, con brazo, queda en `/v1/`).
- **Verlo en local:** servir la carpeta (`npx serve promo-x-cierre`). Abierto con doble clic, el navegador bloquea las tipografías.

## Datos

- Gira **CCW TOUR** según el flyer (sin año en el flyer; se asume 2026): 9/10 Uniclub, CABA (agotado) · 11/10 CDG La Plata Sport · 17/10 West Party, Morón · 18/10 Club Tucumán, Quilmes · 5/12 HUM, Rosario · 6/12 Santa Fe (sede a anunciar) · 12/12 Brewhouse, Mar del Plata.
- Links de entradas: Quilmes (Central Ticket), Morón (Alpogo), La Plata (posteo de Instagram, por eso el botón dice "Info del show"). Rosario, Santa Fe y Mar del Plata van a `atom.bio/pxc` hasta que haya link directo.
- Integrantes según los créditos del EP (tuit de @soytarufa): Tarufa (voz y beats), Psicomance y Priveloop (beats), Ian Sánchez (visuales). A confirmar.

## Pendiente

1. **Teléfono de booking** (PACT/OVXL): cargarlo en `data.js` → `booking.phone` (solo dígitos con código de país, ej. `5491122334455`). Hasta entonces el botón figura como pendiente.
2. Link del single *Animales sueltos* (no aparece en búsquedas públicas).
3. Entradas directas de Rosario, Santa Fe y Mar del Plata (hoy van a atom.bio). TikTok quedó afuera porque el link de atom.bio está roto.
4. PNG original del muñeco (la captura es de 243 px de ancho y en pantalla grande se nota) y portadas de los discos.
5. Confirmar integrantes y roles.
6. Antes de publicar para el público: `showPending: false` en `data.js` oculta todo lo que no tenga link.
