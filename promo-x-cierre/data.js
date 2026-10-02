/*
 * CONTENIDO DE LA PÁGINA — es el único archivo que hace falta tocar para actualizar fechas y links.
 *
 * Estado de cada dato:
 *   - Los links con href cargado fueron verificados en búsquedas públicas.
 *   - `pending: true` / href vacío = TODAVÍA NO CARGADO. Falta copiarlo del Linktree de Instagram.
 *   - Los shows con `demo: true` son maquetas: borrá la línea `demo: true` y completá los datos reales.
 */
window.PXC = {
  name: "PROMO X CIERRE",
  tagline: "Rap argentino · hip hop abstracto",

  // Frases que dice el muñeco al apretar un botón ("PASEN Y GOCEN" es de su propio tuit del EP)
  phrases: ["PASEN Y GOCEN", "¡DALE!", "¡ESO!", "SI QUIEREN MAGIA, AVISAN", "¡PASEN!"],

  // Botones principales (lo que hoy está en el Linktree). tone: sun | sky | paper | tomato
  links: [
    {
      label: "Cómo conseguir wachas",
      sub: "Álbum completo",
      href: "https://www.youtube.com/watch?v=5Nxp12kCCFE",
      tone: "sun",
    },
    {
      label: "Promo x Cierre EP",
      sub: "EP completo",
      href: "https://www.youtube.com/watch?v=U_RfPWhjLkY",
      tone: "sky",
    },
    {
      label: "Apple Music",
      sub: "Todos los discos",
      href: "https://music.apple.com/us/artist/promo-x-cierre/1874706301",
      tone: "paper",
    },
    { label: "Spotify", sub: "Todos los discos", href: "", pending: true, tone: "paper" },
    { label: "Entradas", sub: "Próximo show", href: "", pending: true, tone: "tomato" },
    { label: "Instagram", sub: "Fotos, videos y novedades", href: "", pending: true, tone: "sky" },
    { label: "X / Twitter", sub: "@promoxcierre", href: "https://x.com/promoxcierre", tone: "paper" },
  ],

  // Fechas. date: "AAAA-MM-DD" (null = a confirmar). Orden: la próxima primero.
  shows: [
    {
      demo: true,
      date: null,
      venue: "Lugar a confirmar",
      city: "Ciudad",
      note: "Presentación del álbum",
      lineup: [],
      tickets: "",
    },
    {
      demo: true,
      date: null,
      venue: "Lugar a confirmar",
      city: "Ciudad",
      note: "",
      lineup: [],
      tickets: "",
    },
  ],

  // Discografía (las portadas son placeholders: reemplazar por las reales con `cover: "img/archivo.jpg"`)
  releases: [
    {
      title: "Cómo conseguir wachas",
      type: "Álbum",
      date: "17 ago 2026",
      detail: "13 temas",
      href: "https://www.youtube.com/watch?v=5Nxp12kCCFE",
      tone: "sun",
    },
    {
      title: "Animales sueltos",
      type: "Single",
      date: "2026",
      detail: "con Halpe",
      href: "",
      pending: true,
      tone: "tomato",
    },
    {
      title: "Promo x Cierre",
      type: "EP",
      date: "13 feb 2026",
      detail: "",
      href: "https://www.youtube.com/watch?v=U_RfPWhjLkY",
      tone: "sky",
    },
  ],

  // Integrantes — los roles salen de los créditos del EP (tuit de @soytarufa). A confirmar con el grupo.
  crew: [
    { name: "Tarufa", role: "Voz y beats", look: { skin: "#F0C48F", shirt: "#74ACDF", stripe: "#FFFFFF", hat: "beanie", hatColor: "#E8452C", mouth: "zip" } },
    { name: "Psicomance", role: "Beats", look: { skin: "#D9A273", shirt: "#F6B40E", stripe: "#F6B40E", hat: "headphones", hatColor: "#14110F", mouth: "smile" } },
    { name: "Priveloop", role: "Beats", look: { skin: "#F3D2B0", shirt: "#E8452C", stripe: "#E8452C", hat: "cap", hatColor: "#14110F", mouth: "flat" } },
    { name: "Ian Sánchez", role: "Visuales", look: { skin: "#B98055", shirt: "#14110F", stripe: "#14110F", hat: "none", hatColor: "#14110F", mouth: "smile" } },
  ],

  // Ticker de arriba: títulos de sus temas
  ticker: ["RAP", "FÚTBOL", "SALA DE ENSAYO", "REPOSERA", "VAN A LLOVER RANAS", "FELIZ DOMINGO", "PASEN Y GOCEN"],
};
