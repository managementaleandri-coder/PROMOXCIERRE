/*
 * CONTENIDO DE LA PÁGINA — es el único archivo que hace falta tocar para actualizar fechas, links y arte.
 *
 * Estado de los datos:
 *   - Fechas de la gira: salen del flyer "CCW TOUR" (sin año en el flyer: se asume 2026).
 *   - Links con href cargado: verificados. `pending: true` / href vacío = TODAVÍA NO CARGADO
 *     (falta copiarlo de https://www.atom.bio/pxc, que no se pudo abrir desde el entorno de desarrollo).
 */
window.PXC = {
  name: "PROMO X CIERRE",
  tagline: "Rap argentino · hip hop abstracto",

  // El muñeco principal. `shoulder` = dónde nace el brazo, en % [ancho, alto] sobre la imagen.
  // Para cambiar el arte: reemplazar img/muneco.png (PNG transparente) y ajustar `shoulder`.
  puppet: {
    src: "img/muneco.png",
    alt: "",
    shoulder: [88, 50],
  },

  // Frases que dice el muñeco al apretar un botón ("PASEN Y GOCEN" es de su propio tuit del EP)
  phrases: ["PASEN Y GOCEN", "¡DALE!", "¡ESO!", "SI QUIEREN MAGIA, AVISAN", "¡PASEN!"],

  // Link-in-bio oficial. Se usa para "Entradas" mientras no haya un link directo por fecha.
  ticketsUrl: "https://www.atom.bio/pxc",

  // Botones principales. tone: sun | sky | paper | tomato
  links: [
    { label: "Entradas · CCW Tour", sub: "7 fechas por el país", href: "https://www.atom.bio/pxc", tone: "tomato" },
    { label: "Cómo conseguir wachas", sub: "Álbum completo", href: "https://www.youtube.com/watch?v=5Nxp12kCCFE", tone: "sun" },
    { label: "Promo x Cierre EP", sub: "EP completo", href: "https://www.youtube.com/watch?v=U_RfPWhjLkY", tone: "sky" },
    { label: "Apple Music", sub: "Todos los discos", href: "https://music.apple.com/us/artist/promo-x-cierre/1874706301", tone: "paper" },
    { label: "Spotify", sub: "Todos los discos", href: "", pending: true, tone: "paper" },
    { label: "Instagram", sub: "@promoxcierre", href: "https://www.instagram.com/promoxcierre", tone: "sky" },
    { label: "X / Twitter", sub: "@promoxcierre", href: "https://x.com/promoxcierre", tone: "paper" },
  ],

  tour: { name: "CCW Tour", sub: "Promo x Cierre presenta" },

  // Fechas (flyer CCW TOUR). date: "AAAA-MM-DD". Las fechas pasadas se ocultan solas.
  // soldOut: true → muestra AGOTADO. tickets: link directo de esa fecha (si falta, usa ticketsUrl).
  shows: [
    { date: "2026-10-09", venue: "Uniclub", city: "Capital Federal", note: "20:00 hs", soldOut: true },
    // La Plata: el link de atom.bio lleva a un posteo de Instagram (no es una ticketera)
    { date: "2026-10-11", venue: "CDG · La Plata Sport", city: "La Plata", tickets: "https://www.instagram.com/p/DdusCXIKXnr/", ticketLabel: "Info del show" },
    { date: "2026-10-17", venue: "West Party", city: "Morón", tickets: "https://alpogo.com/evento/show-promo-x-cierre-en-moron-29253" },
    { date: "2026-10-18", venue: "Club Tucumán", city: "Quilmes", tickets: "https://centralticket.net/10383" },
    { date: "2026-12-05", venue: "HUM", city: "Rosario", tickets: "" },
    { date: "2026-12-06", venue: "Sede a anunciar", city: "Santa Fe", tickets: "" },
    { date: "2026-12-12", venue: "Brewhouse", city: "Mar del Plata", tickets: "" },
  ],

  // Discografía (las portadas son placeholders: reemplazar por las reales con `cover: "img/archivo.jpg"`)
  releases: [
    { title: "Cómo conseguir wachas", type: "Álbum", date: "17 ago 2026", detail: "13 temas", href: "https://www.youtube.com/watch?v=5Nxp12kCCFE", tone: "sun" },
    { title: "Animales sueltos", type: "Single", date: "2026", detail: "con Halpe", href: "", pending: true, tone: "tomato" },
    { title: "Promo x Cierre", type: "EP", date: "13 feb 2026", detail: "", href: "https://www.youtube.com/watch?v=U_RfPWhjLkY", tone: "sky" },
  ],

  // Integrantes — roles según los créditos del EP (tuit de @soytarufa). A confirmar con el grupo.
  crew: [
    { name: "Tarufa", role: "Voz y beats" },
    { name: "Psicomance", role: "Beats" },
    { name: "Priveloop", role: "Beats" },
    { name: "Ian Sánchez", role: "Visuales" },
  ],

  // Cinta de arriba: títulos de sus temas
  ticker: ["CCW TOUR", "RAP", "FÚTBOL", "SALA DE ENSAYO", "REPOSERA", "VAN A LLOVER RANAS", "FELIZ DOMINGO", "PASEN Y GOCEN"],
};
