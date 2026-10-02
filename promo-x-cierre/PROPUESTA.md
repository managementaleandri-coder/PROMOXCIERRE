# PROMO X CIERRE — investigación y propuesta de web

> **Límite de la investigación:** el entorno de desarrollo bloquea Instagram, atom.bio/pxc, X, YouTube, Apple Music y Album of the Year, así que **no pude abrir ninguna de esas páginas**. La información sale de (1) resúmenes de buscador y (2) lo que pasó el cliente: captura del muñeco, flyer de la gira y los links propios de atom.bio.

## Quiénes son

- **Proyecto de rap argentino**, catalogado como *Latin Rap / Abstract Hip Hop / Drumless* (Album of the Year). Unos 23,9 mil oyentes mensuales en Spotify según un resumen de búsqueda (sin fecha de medición).
- **Créditos del EP** (tuit de @soytarufa, 13 feb 2026): voz y beats **Tarufa**; beats **Psicomance** y **Priveloop**; visuales **Ian Sánchez**. *A confirmar con ellos:* si son grupo o un solista con productores, y los nombres exactos.
- **Tono:** referencias culturales argentinas (fútbol, sala de ensayo, reposera, "wachas"), humor y producción con samples. Un usuario en X escribió *"no sé quiénes son, no sé quién produce, quién rapea"*: el misterio juega a favor de que los represente un **muñeco**.
- **Discos:** EP *PROMO X CIERRE* (13 feb 2026); álbum *CÓMO CONSEGUIR WACHAS* (17 ago 2026, 13 temas); single *Animales sueltos* con Halpe.
- **Gira actual: CCW TOUR** (CCW = Cómo Conseguir Wachas), 7 fechas según el flyer:

| Fecha | Ciudad | Lugar | Entradas |
|---|---|---|---|
| 9/10 | Capital Federal | Uniclub (20:00 hs) | **Agotado** |
| 11/10 | La Plata | CDG · La Plata Sport | posteo de Instagram (no es ticketera) |
| 17/10 | Morón | West Party | Alpogo |
| 18/10 | Quilmes | Club Tucumán | Central Ticket |
| 5/12 | Rosario | HUM | sin link directo |
| 6/12 | Santa Fe | sede a anunciar | sin link directo |
| 12/12 | Mar del Plata | Brewhouse | sin link directo |

El flyer no trae año: se asume 2026. "Uniclub" y "20:00" salen de un recorte del flyer de CABA más un listado de entradas encontrado por buscador (Uniclub, Guardia Vieja 3360, Abasto).

## Propuesta

**Idea:** una sola pantalla con onda de fanzine/cartel de recital. A la izquierda, **el muñeco principal** (fijo mientras scrolleás); a la derecha, los botones. **Cuando acercás el mouse a un botón, al muñeco se le estira un brazo de cuero negro, apoya la mano y lo aprieta**: el botón se hunde, el muñeco se inclina hacia él, rebota y dice "PASEN Y GOCEN" (frase de su propio tuit). Hacés clic y te lleva al link.

| Zona | Contenido |
|---|---|
| Cinta superior | Títulos de sus temas en movimiento |
| Hero + botones | Entradas CCW Tour, álbum, EP, Apple Music, Spotify, Instagram, X |
| Fechas | La gira: fecha, lugar, botón de entradas o sello AGOTADO; las fechas pasadas se ocultan solas |
| Discos | Portadas + botón "Escuchar" |
| Quiénes son | Stickers con nombre y rol de cada integrante |

Los divisores son **cierres** (zipper): la lengüeta corre al llegar a cada sección.

**Cómo funciona el brazo:** mouse → se estira a partir de 190 px y aprieta al estar encima · celular → apunta al botón cercano a su altura, "toca" solo cada tanto y aprieta el que tocás · teclado → llega al botón con foco · con "reducir movimiento" activado no hay vaivén ni toques automáticos.

## Qué hay hecho

Prototipo funcional sin dependencias (HTML + CSS + JS, tipografías incluidas). **Se actualiza editando solo `data.js`** (links, fechas, discos, integrantes y datos del muñeco).

- **Muñeco real**, recortado de la captura enviada (`img/muneco.png`). La captura mide solo 243 px de ancho: en pantalla grande se ve algo blando. Con el PNG original se resuelve.
- El **brazo** (cuero negro + mano clara) y el rebote son míos: el original está con los brazos cruzados.
- Las **portadas** de los discos son bloques de color con el título.
- Para verlo: servir la carpeta (por ej. `npx serve promo-x-cierre`). Abierto con doble clic (`file://`) el navegador bloquea las tipografías.

## Qué falta

1. **Links que todavía no tengo:** Spotify, el single *Animales sueltos*, y entradas directas de Rosario, Santa Fe y Mar del Plata (hoy esos tres botones llevan a atom.bio/pxc). TikTok quedó afuera: el link de atom.bio está roto (no tiene usuario).
2. **Arte:** PNG original del muñeco (idealmente de cuerpo entero, transparente), los de los otros integrantes si existen, y las portadas.
3. Confirmar integrantes y roles, y el año de la gira.
4. Dominio y hosting (GitHub Pages o Netlify alcanzan).
5. Opcional: fechas desde una planilla de Google para que las carguen ellos, y reproductor de Spotify embebido.
