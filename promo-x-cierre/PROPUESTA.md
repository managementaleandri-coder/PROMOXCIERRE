# PROMO X CIERRE — investigación y propuesta de web

> **Límite de esta investigación:** el entorno donde se hizo bloquea Instagram, Linktree, X, YouTube, Apple Music y Album of the Year. **No pude abrir ninguna de esas páginas**; todo lo de abajo sale de resúmenes de buscador. El Linktree **no lo vi**, así que fechas y links que viven ahí quedaron como pendientes (marcados en la página).

## Quiénes son

- **Proyecto de rap argentino**, catalogado como *Latin Rap / Abstract Hip Hop / Drumless* (Album of the Year). Unos 23,9 mil oyentes mensuales en Spotify según un resumen de búsqueda (sin fecha de medición).
- **Créditos del EP** (tuit de @soytarufa, 13 feb 2026): voz y beats **Tarufa**; beats **Psicomance** y **Priveloop**; visuales **Ian Sánchez**. Una fuente los presenta como grupo de esas cuatro personas. *A confirmar con ellos:* si son grupo o un solista con productores, y los nombres exactos.
- **Tono:** referencias culturales argentinas (fútbol, sala de ensayo, reposera, "wachas"), humor y producción con samples. Un usuario en X escribió *"no sé quiénes son, no sé quién produce, quién rapea"*: el misterio juega a favor de que los representen **muñecos**.
- **Discos:** EP *PROMO X CIERRE* (13 feb 2026; temas como *Buenas y Santas, Reposera, Me Voy, El Acto en Cuestión, Van a Llover Ranas, Rap Fútbol Sala de Ensayo, Pido Permiso, Octavo Color* — un listado dice 8 temas y otro 6, verificar); álbum *CÓMO CONSEGUIR WACHAS* (17 ago 2026, 13 temas, incluye *Pasen*, *Si quieren magia avisan*, *Feliz domingo*); single *Animales sueltos* con Halpe.
- **Shows:** un resultado menciona una presentación del EP en **Batacazo Cultural** (Almagro) con Swaggedvision, ICY GENESIS, LTHELIZARD, STRIDAH (UXC), Simoncito y Zaya, con entradas por **Alpogo**. Sin fecha: puede ser un show ya pasado, por eso no está en la página.

Fuentes usadas (solo vía buscador): [X](https://x.com/promoxcierre) · [Apple Music](https://music.apple.com/us/artist/promo-x-cierre/1874706301) · [Album of the Year](https://www.albumoftheyear.org/artist/641141-promo-x-cierre/) · YouTube [EP](https://www.youtube.com/watch?v=U_RfPWhjLkY) y [álbum](https://www.youtube.com/watch?v=5Nxp12kCCFE).

## Propuesta

**Idea:** una sola pantalla con onda de fanzine/cartel de recital. A la izquierda, **el muñeco principal** (fijo mientras scrolleás); a la derecha, los botones. **Cuando acercás el mouse a un botón, al muñeco se le estira el brazo, apoya la mano y lo aprieta**: el botón se hunde, el muñeco abre la boca (es un cierre/zipper, guiño al nombre) y dice "PASEN Y GOCEN" (frase de su propio tuit). Hacés clic y te lleva al link.

| Zona | Contenido |
|---|---|
| Cinta superior | Títulos de sus temas en movimiento |
| Hero + botones | Álbum, EP, Apple Music, Spotify, Entradas, Instagram, X (lo que hoy está en el Linktree) |
| Fechas | Tarjetas con fecha, lugar, line-up y botón de entradas; si no hay fechas, mensaje para seguir las redes; las pasadas se ocultan solas |
| Discos | Portadas + botón "Escuchar" |
| Quiénes son | Los muñecos de cada integrante con su rol |

Los divisores son **cierres**: la lengüeta corre al llegar a cada sección.

**Cómo funciona el brazo:** mouse → se estira a partir de 190 px y aprieta al estar encima · celular → apunta al botón cercano a su altura, "toca" solo cada tanto y aprieta el que tocás · teclado → llega al botón con foco · con "reducir movimiento" activado no hay vaivén ni toques automáticos.

## Qué hay hecho

Prototipo funcional sin dependencias (HTML + CSS + JS, tipografías incluidas). **Se actualiza editando solo `data.js`** (links, fechas, discos, integrantes).

- Los **muñecos son placeholders dibujados por mí**: no son los del grupo.
- Las **portadas** son bloques de color con el título.
- Marcado en la página: `LINK PENDIENTE` (Spotify, Entradas, Instagram, single *Animales sueltos*) y `DEMO` (las dos fechas de ejemplo, sin fecha inventada).
- Para verlo: servir la carpeta (por ej. `npx serve promo-x-cierre`). Abierto con doble clic (`file://`) el navegador bloquea las tipografías.

## Qué falta (en orden)

1. **Contenido del Linktree**: pegar los links y fechas, o habilitar `linktr.ee` e `instagram.com` en la red del entorno para que los lea yo.
2. **Arte de los muñecos reales** (PNG/SVG transparente del principal *sin* un brazo, y de los demás) y las **portadas** de los discos.
3. Confirmar integrantes, roles y el handle de Instagram.
4. Dominio y hosting (GitHub Pages o Netlify alcanzan).
5. Opcional: fechas desde una planilla de Google para que las carguen ellos, y reproductor de Spotify embebido.
