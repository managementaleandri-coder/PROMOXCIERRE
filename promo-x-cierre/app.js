(() => {
  "use strict";

  const D = window.PXC;
  if (!D) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const INK = "#14110F";

  /* =====================================================================
   * Muñecos (placeholders dibujados en SVG, 300x400).
   * Para usar los muñecos reales: reemplazar el contenido de #puppet-art por la
   * imagen (SIN el brazo derecho del personaje) y ajustar --shoulder-x/-y en styles.css.
   * ===================================================================== */
  let uid = 0;
  const STROKE = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;

  function hatSVG(hat, color) {
    switch (hat) {
      case "beanie":
        return `<path d="M72 122 Q70 52 150 50 Q230 52 228 122 Q150 100 72 122 Z" fill="${color}" ${STROKE}/>
          <path d="M70 108 Q150 88 230 108 L232 134 Q150 112 68 134 Z" fill="${color}" ${STROKE}/>
          <path d="M70 108 Q150 88 230 108 L232 134 Q150 112 68 134 Z" fill="rgba(255,255,255,.28)"/>
          <circle cx="150" cy="44" r="16" fill="#fff" ${STROKE}/>`;
      case "cap":
        return `<path d="M76 118 Q78 50 150 48 Q222 50 224 118 Q150 100 76 118 Z" fill="${color}" ${STROKE}/>
          <path d="M146 108 Q196 92 266 114 Q240 138 146 124 Z" fill="${color}" ${STROKE}/>
          <circle cx="150" cy="48" r="7" fill="#F6B40E" ${STROKE}/>`;
      case "headphones":
        return `<path d="M70 132 Q66 40 150 40 Q234 40 230 132" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
          <rect x="46" y="116" width="32" height="62" rx="14" fill="${color}" ${STROKE}/>
          <rect x="222" y="116" width="32" height="62" rx="14" fill="${color}" ${STROKE}/>
          <circle cx="62" cy="147" r="7" fill="#F6B40E"/><circle cx="238" cy="147" r="7" fill="#F6B40E"/>`;
      default:
        return `<path d="M74 122 L84 70 L108 94 L128 52 L150 90 L174 50 L192 92 L218 68 L226 122 Q150 96 74 122 Z" fill="${INK}" ${STROKE}/>`;
    }
  }

  function mouthSVG(kind) {
    // Cierre (zipper): la boca es un cierre con diente y lengüeta
    const P0 = [104, 190], P1 = [150, 214], P2 = [196, 190];
    const B = (t) => [0, 1].map((i) => (1 - t) ** 2 * P0[i] + 2 * (1 - t) * t * P1[i] + t * t * P2[i]);
    const Bd = (t) => [0, 1].map((i) => 2 * (1 - t) * (P1[i] - P0[i]) + 2 * t * (P2[i] - P1[i]));
    let closed;
    if (kind === "zip") {
      let teeth = "";
      for (let t = 0.1; t < 0.92; t += 0.075) {
        const [x, y] = B(t), [tx, ty] = Bd(t), l = Math.hypot(tx, ty);
        const nx = -ty / l, ny = tx / l;
        teeth += `M${(x - nx * 7).toFixed(1)} ${(y - ny * 7).toFixed(1)} L${(x + nx * 7).toFixed(1)} ${(y + ny * 7).toFixed(1)} `;
      }
      closed = `<path d="M${P0} Q${P1} ${P2}" fill="none" ${STROKE}/><path d="${teeth}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
    } else if (kind === "smile") {
      closed = `<path d="M110 188 Q150 224 190 188" fill="none" ${STROKE}/>`;
    } else {
      closed = `<path d="M118 196 L182 196" fill="none" ${STROKE}/>`;
    }
    const [px, py] = B(0.96);
    const tab = kind === "zip"
      ? `<rect x="${(px - 7).toFixed(1)}" y="${(py + 2).toFixed(1)}" width="14" height="20" rx="4" fill="#F6B40E" ${STROKE}/><circle cx="${px.toFixed(1)}" cy="${(py + 28).toFixed(1)}" r="6" fill="none" stroke="${INK}" stroke-width="4"/>`
      : "";
    return `<g class="m-closed">${closed}</g>
      <g class="m-open"><ellipse cx="150" cy="198" rx="36" ry="22" fill="${INK}"/><ellipse cx="150" cy="210" rx="20" ry="9" fill="#E8452C"/></g>${tab}`;
  }

  function puppetSVG(look, { main = false } = {}) {
    const { skin = "#F0C48F", shirt = "#74ACDF", stripe, hat = "none", hatColor = INK, mouth = "smile" } = look;
    const clip = `pxc-body-${uid++}`;
    const bodyPath = "M70 400 L70 284 Q70 234 120 222 L180 222 Q230 234 230 284 L230 400 Z";
    const stripes = stripe && stripe.toLowerCase() !== shirt.toLowerCase()
      ? `<g clip-path="url(#${clip})"><rect x="102" y="200" width="32" height="200" fill="${stripe}"/><rect x="166" y="200" width="32" height="200" fill="${stripe}"/></g>`
      : "";
    const leftArm = main
      ? `<path d="M84 254 Q52 292 62 336" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round"/>
         <path d="M84 254 Q52 292 62 336" fill="none" stroke="${shirt}" stroke-width="26" stroke-linecap="round"/>
         <g transform="translate(62 346) rotate(90)" stroke="${INK}" stroke-width="4" stroke-linejoin="round" fill="#fff">
           <ellipse cx="20" cy="-11" rx="12" ry="6.5"/><ellipse cx="23" cy="0" rx="13" ry="6.5"/><ellipse cx="20" cy="11" rx="12" ry="6.5"/>
           <rect x="-30" y="-14" width="15" height="28" rx="6"/><ellipse cx="2" cy="0" rx="19" ry="16"/>
         </g>`
      : "";
    const eye = (cx) => `<g class="eye"><circle cx="${cx}" cy="138" r="22" fill="#fff" ${STROKE}/>
      <g class="pupil"><circle cx="${cx}" cy="138" r="9" fill="${INK}"/><circle cx="${cx - 3.5}" cy="134.5" r="3" fill="#fff"/></g></g>`;

    return `<svg viewBox="${main ? "0 0 300 400" : "40 24 220 250"}" xmlns="http://www.w3.org/2000/svg" ${main ? 'aria-hidden="true"' : 'role="img"'}>
      <defs><clipPath id="${clip}"><path d="${bodyPath}"/></clipPath></defs>
      <circle cx="70" cy="150" r="15" fill="${skin}" ${STROKE}/><circle cx="230" cy="150" r="15" fill="${skin}" ${STROKE}/>
      <rect x="126" y="196" width="48" height="40" fill="${skin}" ${STROKE}/>
      <path d="${bodyPath}" fill="${shirt}"/>${stripes}<path d="${bodyPath}" fill="none" ${STROKE}/>
      ${leftArm}
      <ellipse cx="150" cy="140" rx="80" ry="84" fill="${skin}" ${STROKE}/>
      <circle cx="94" cy="176" r="12" fill="#E8452C" opacity=".35"/><circle cx="206" cy="176" r="12" fill="#E8452C" opacity=".35"/>
      <ellipse cx="150" cy="160" rx="8" ry="6" fill="rgba(20,17,15,.2)"/>
      ${eye(118)}${eye(182)}
      <g class="brows" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"><path d="M92 106 Q114 94 138 104"/><path d="M162 104 Q186 94 208 106"/></g>
      ${mouthSVG(mouth)}
      ${hatSVG(hat, hatColor)}
    </svg>`;
  }

  /* ===================================================================== Contenido */
  const btnHTML = ({ label, sub, href, pending, tone }, small = false) => {
    const isPending = pending || !href;
    const attrs = isPending
      ? 'href="#" aria-disabled="true"'
      : `href="${esc(href)}" target="_blank" rel="noopener noreferrer"`;
    return `<a class="btn${small ? " btn--sm" : ""}${isPending ? " is-pending" : ""}" data-reach data-tone="${esc(tone || "paper")}" ${attrs}>
      <span>${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ""}</span><span class="go" aria-hidden="true">↗</span></a>`;
  };

  function fmtDate(iso) {
    if (!iso) return { day: "??", mon: "Fecha" };
    const [y, m, d] = iso.split("-").map(Number);
    const mon = new Intl.DateTimeFormat("es-AR", { month: "short", timeZone: "UTC" })
      .format(new Date(Date.UTC(y, m - 1, d))).replace(".", "");
    return { day: String(d).padStart(2, "0"), mon };
  }

  function render() {
    $("#tagline").textContent = D.tagline;

    const items = D.ticker.map((t) => `<span>${esc(t)}</span>`).join("");
    $("#ticker").innerHTML = items.repeat(6);

    $("#links").innerHTML = D.links.map((l) => btnHTML(l)).join("");

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const upcoming = D.shows.filter((s) => !s.date || new Date(`${s.date}T00:00:00`) >= today);
    $("#shows").innerHTML = upcoming.length
      ? upcoming.map((s) => {
          const { day, mon } = fmtDate(s.date);
          const meta = [s.city, s.note, s.lineup && s.lineup.length ? `con ${s.lineup.join(", ")}` : ""].filter(Boolean).join(" · ");
          return `<li class="show${s.demo ? " is-demo" : ""}">
            <div class="show__date"><span class="show__day">${esc(day)}</span><span class="show__mon">${esc(mon)}</span></div>
            <div><p class="show__venue">${esc(s.venue)}</p><p class="show__meta">${esc(meta)}</p></div>
            ${btnHTML({ label: "Entradas", href: s.tickets, tone: "tomato" }, true)}
          </li>`;
        }).join("")
      : '<li class="empty">Sin fechas por ahora. Seguinos en redes para enterarte primero.</li>';

    $("#releases").innerHTML = D.releases.map((r) => `
      <article class="release">
        <div class="cover" data-tone="${esc(r.tone || "paper")}">${r.cover ? `<img src="${esc(r.cover)}" alt="Portada de ${esc(r.title)}">` : `<span>${esc(r.title)}</span>`}</div>
        <div>
          <p class="release__type">${esc([r.type, r.date].filter(Boolean).join(" · "))}</p>
          <h3 class="release__title">${esc(r.title)}</h3>
          ${r.detail ? `<p class="release__meta">${esc(r.detail)}</p>` : ""}
        </div>
        ${btnHTML({ label: "Escuchar", href: r.href, pending: r.pending, tone: "paper" }, true)}
      </article>`).join("");

    $("#crew").innerHTML = D.crew.map((m) => {
      const svg = puppetSVG(m.look).replace("<svg ", `<svg aria-label="Muñeco de ${esc(m.name)}" `);
      return `<div class="member">${svg}<p class="member__name">${esc(m.name)}</p><p class="member__role">${esc(m.role)}</p></div>`;
    }).join("");

    const main = (D.crew[0] && D.crew[0].look) || {};
    $("#puppet-art").innerHTML = puppetSVG(main, { main: true });
  }
  render();

  /* Divisores tipo cierre: la lengüeta corre al llegar */
  const zips = $$(".zip");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.6 });
    zips.forEach((z) => io.observe(z));
  } else {
    zips.forEach((z) => z.classList.add("in"));
  }

  /* Aviso para links que todavía no están cargados */
  const toastEl = $("#toast");
  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a.is-pending");
    if (!a) return;
    e.preventDefault();
    toast("Este link todavía no está cargado. Falta copiarlo del Linktree (data.js).");
  });

  /* =====================================================================
   * El brazo: nace del hombro del muñeco y llega hasta el botón más cercano.
   *  - mouse: se estira cuando el puntero se acerca (REACH px) y aprieta cuando está encima.
   *  - táctil: apunta al botón más cercano a su altura y "toca" cada tanto; al tocar un botón, lo aprieta.
   *  - teclado: llega al botón con foco; Enter/Espacio lo aprieta.
   * ===================================================================== */
  const arm = { outline: $("#arm-outline"), fill: $("#arm-fill"), hand: $("#hand") };
  const shoulderEl = $("#shoulder");
  const puppetEl = $("#puppet");
  const artEl = $("#puppet-art");
  const bubble = $("#bubble");
  const pupils = $$(".pupil", artEl);
  const buttons = $$("[data-reach]");
  const REACH = 190; // px de distancia a los que el brazo empieza a estirarse (mouse)
  const TOUCH_REACH = 130; // en táctil: solo botones cerca de la altura del hombro

  let mode = matchMedia("(hover: hover) and (pointer: fine)").matches ? "mouse" : "touch";
  let pointer = null, focused = null, force = null, intro = null;
  let pressedEl = null, phraseIdx = 0, talkTimer = 0, bubbleTimer = 0;
  const hand = { x: 0, y: 0, vx: 0, vy: 0, reach: 0, press: 0, ready: false };

  function talk() {
    puppetEl.classList.add("is-talking");
    clearTimeout(talkTimer);
    talkTimer = setTimeout(() => puppetEl.classList.remove("is-talking"), 900);
    if (getComputedStyle(bubble).display === "none") return;
    bubble.textContent = D.phrases[phraseIdx++ % D.phrases.length];
    bubble.hidden = false;
    bubble.classList.remove("pop");
    void bubble.offsetWidth;
    bubble.classList.add("pop");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { bubble.hidden = true; }, 1100);
  }

  function pick(now, S) {
    if (force && now < force.until) return { el: force.el, pressed: true, real: true };
    if (focused) return { el: focused, pressed: false, real: false };
    if (intro) {
      const t = now - intro.start;
      if (t > intro.dur) intro = null;
      else if (t > 0) return { el: buttons[0], pressed: t > 1100 && t < 1500, real: false };
    }
    if (mode === "mouse") {
      if (!pointer) return { el: null };
      let best = null, bd = Infinity;
      for (const b of buttons) {
        const r = b.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const dx = Math.max(r.left - pointer.x, 0, pointer.x - r.right);
        const dy = Math.max(r.top - pointer.y, 0, pointer.y - r.bottom);
        const d = Math.hypot(dx, dy);
        if (d < bd) { bd = d; best = b; }
      }
      if (!best || bd > REACH) return { el: null };
      // pequeña tolerancia mientras está apretado: el botón se corre 5px y no debe "soltarse" solo
      return { el: best, pressed: bd <= (best === pressedEl ? 8 : 0), real: true };
    }
    // táctil: el botón más cercano a la altura del hombro
    let best = null, bd = Infinity;
    for (const b of buttons) {
      const r = b.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const d = Math.abs(r.top + r.height / 2 - S.y);
      if (d < bd) { bd = d; best = b; }
    }
    if (!best || bd > TOUCH_REACH) return { el: null };
    return { el: best, pressed: !reduced.matches && now % 3600 < 380, real: false };
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const calm = reduced.matches;

    const sr = shoulderEl.getBoundingClientRect();
    const S = { x: sr.left + sr.width / 2, y: sr.top + sr.height / 2 };
    const res = pick(now, S);

    // estado visual del botón apretado
    const nowPressed = res.pressed ? res.el : null;
    if (nowPressed !== pressedEl) {
      if (pressedEl) pressedEl.classList.remove("is-pressed");
      if (nowPressed) { nowPressed.classList.add("is-pressed"); if (res.real) talk(); }
      pressedEl = nowPressed;
    }

    // objetivo de la mano: borde izquierdo del botón, o reposo junto al cuerpo
    let T;
    if (res.el) {
      const r = res.el.getBoundingClientRect();
      T = { x: r.left - 16, y: r.top + r.height / 2 };
    } else {
      const t = now / 1000;
      T = { x: S.x + 36 + (calm ? 0 : Math.sin(t * 1.4) * 5), y: S.y + 118 + (calm ? 0 : Math.sin(t * 1.1) * 6) };
    }

    if (calm || !hand.ready) {
      hand.x = T.x; hand.y = T.y; hand.vx = hand.vy = 0; hand.ready = true;
    } else {
      const k = 260, c = 2 * Math.sqrt(k) * 0.55; // resorte con un poco de rebote
      hand.vx += ((T.x - hand.x) * k - c * hand.vx) * dt;
      hand.vy += ((T.y - hand.y) * k - c * hand.vy) * dt;
      hand.x += hand.vx * dt;
      hand.y += hand.vy * dt;
    }
    hand.reach += ((res.el ? 1 : 0) - hand.reach) * (calm ? 1 : 1 - Math.exp(-dt * 10));
    hand.press += ((res.pressed ? 1 : 0) - hand.press) * (calm ? 1 : 1 - Math.exp(-dt * 24));

    // geometría del brazo (manguera de dibujito: se estira y se afina)
    const dx = hand.x - S.x, dy = hand.y - S.y, dist = Math.hypot(dx, dy);
    const sag = Math.min(dist * 0.22, 70) * (1 - 0.55 * hand.reach);
    const c1 = { x: S.x + dx * 0.28, y: S.y + dy * 0.05 + sag };
    const c2 = { x: hand.x - dx * 0.28, y: hand.y - dy * 0.05 + sag * 0.35 };
    let ang = Math.atan2(hand.y - c2.y, hand.x - c2.x) * 180 / Math.PI;
    ang *= 1 - 0.85 * hand.reach; // al alcanzar un botón, la mano apunta hacia la derecha
    const rad = ang * Math.PI / 180;
    const E = { x: hand.x - Math.cos(rad) * 22, y: hand.y - Math.sin(rad) * 22 }; // el brazo termina en el puño
    const d = `M${S.x.toFixed(1)} ${S.y.toFixed(1)} C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${E.x.toFixed(1)} ${E.y.toFixed(1)}`;
    const w = 26 - 8 * Math.min(dist / 800, 1);
    arm.outline.setAttribute("d", d);
    arm.outline.setAttribute("stroke-width", (w + 8).toFixed(1));
    arm.fill.setAttribute("d", d);
    arm.fill.setAttribute("stroke-width", w.toFixed(1));
    arm.hand.setAttribute(
      "transform",
      `translate(${(hand.x + 4 * hand.press).toFixed(1)} ${hand.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${(1 - 0.1 * hand.press).toFixed(3)})`
    );

    // los ojos siguen al objetivo / puntero
    if (pupils.length) {
      const er = artEl.getBoundingClientRect();
      const ex = er.left + er.width * 0.5, ey = er.top + er.height * 0.34;
      let lx = ex + 200, ly = ey + 40;
      if (res.el) {
        const r = res.el.getBoundingClientRect();
        lx = r.left + r.width / 2; ly = r.top + r.height / 2;
      } else if (mode === "mouse" && pointer) {
        lx = pointer.x; ly = pointer.y;
      }
      const vx = lx - ex, vy = ly - ey, len = Math.hypot(vx, vy) || 1;
      const m = Math.min(len / 220, 1) * 7;
      const tf = `translate(${((vx / len) * m).toFixed(2)}px, ${((vy / len) * m).toFixed(2)}px)`;
      pupils.forEach((p) => { p.style.transform = tf; });
    }

    requestAnimationFrame(frame);
  }

  addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    mode = "mouse";
    pointer = { x: e.clientX, y: e.clientY };
    intro = null;
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { pointer = null; });
  addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch") return;
    mode = "touch";
    pointer = null;
    intro = null;
    const b = e.target.closest && e.target.closest("[data-reach]");
    if (b) force = { el: b, until: performance.now() + 450 };
  }, { passive: true });
  document.addEventListener("focusin", (e) => {
    const b = e.target.closest && e.target.closest("[data-reach]");
    focused = b && b.matches(":focus-visible") ? b : null;
  });
  document.addEventListener("focusout", () => { focused = null; });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && focused) force = { el: focused, until: performance.now() + 300 };
  });

  // Saludo inicial: el muñeco aprieta el primer botón una vez, para que se entienda la idea
  if (!reduced.matches && buttons.length && mode === "mouse") intro = { start: performance.now() + 800, dur: 2700 };
  requestAnimationFrame(frame);
})();
