(() => {
  "use strict";

  const D = window.PXC;
  if (!D) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const compact = matchMedia("(max-width: 899px)"); // mismo corte que el CSS del celular

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

    // Gira: las fechas pasadas se ocultan solas
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const upcoming = D.shows.filter((s) => !s.date || new Date(`${s.date}T00:00:00`) >= today);
    const tourChip = $("#tour-chip");
    if (D.tour && upcoming.length) {
      tourChip.innerHTML = `${esc(D.tour.sub)} · <b>${esc(D.tour.name)}</b>`;
    } else {
      tourChip.hidden = true;
    }
    $("#shows").innerHTML = upcoming.length
      ? upcoming.map((s) => {
          const { day, mon } = fmtDate(s.date);
          const meta = [s.city, s.note, s.lineup && s.lineup.length ? `con ${s.lineup.join(", ")}` : ""].filter(Boolean).join(" · ");
          const action = s.soldOut
            ? '<span class="sold">Agotado</span>'
            : btnHTML({ label: s.ticketLabel || "Entradas", href: s.tickets || D.ticketsUrl, tone: "tomato" }, true);
          return `<li class="show${s.soldOut ? " is-sold" : ""}${s.demo ? " is-demo" : ""}">
            <div class="show__date"><span class="show__day">${esc(day)}</span><span class="show__mon">${esc(mon)}</span></div>
            <div><p class="show__venue">${esc(s.venue)}</p><p class="show__meta">${esc(meta)}</p></div>
            ${action}
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

    const tones = ["sun", "sky", "tomato", "paper"], tilts = [-2, 1.5, -1, 2.5];
    $("#crew").innerHTML = D.crew.map((m, i) =>
      `<div class="member" data-tone="${tones[i % 4]}" style="--tilt:${tilts[i % 4]}deg"><p class="member__name">${esc(m.name)}</p><p class="member__role">${esc(m.role)}</p></div>`
    ).join("");

    // El muñeco: imagen + punto de donde nace el brazo
    const P = D.puppet;
    const img = new Image();
    img.alt = P.alt || "";
    img.decoding = "async";
    img.draggable = false;
    img.addEventListener("load", () => {
      document.documentElement.style.setProperty("--puppet-ratio", (img.naturalHeight / img.naturalWidth).toFixed(3));
    });
    img.src = P.src;
    $("#puppet-art").appendChild(img);
    document.documentElement.style.setProperty("--shoulder-x", `${P.shoulder[0]}%`);
    document.documentElement.style.setProperty("--shoulder-y", `${P.shoulder[1]}%`);
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
    toast("Este link todavía no está cargado. Falta copiarlo de atom.bio/pxc (data.js).");
  });

  /* =====================================================================
   * El brazo: nace del hombro del muñeco y llega hasta el botón más cercano.
   *  - mouse: se estira cuando el puntero se acerca (REACH px) y aprieta cuando está encima.
   *  - táctil: apunta al botón cercano a su altura y "toca" cada tanto; al tocar un botón, lo aprieta.
   *  - teclado: llega al botón con foco; Enter/Espacio lo aprieta.
   * ===================================================================== */
  const arm = { outline: $("#arm-outline"), fill: $("#arm-fill"), shine: $("#arm-shine"), hand: $("#hand") };
  const shoulderEl = $("#shoulder");
  const puppetEl = $("#puppet");
  const leanEl = $("#puppet-lean");
  const bubble = $("#bubble");
  const buttons = $$("[data-reach]");
  const REACH = 190; // px de distancia a los que el brazo empieza a estirarse (mouse)
  const TOUCH_REACH = 130; // en táctil: solo botones cerca de la altura del hombro

  let mode = matchMedia("(hover: hover) and (pointer: fine)").matches ? "mouse" : "touch";
  let pointer = null, focused = null, force = null, intro = null;
  let pressedEl = null, phraseIdx = 0, talkTimer = 0, bubbleTimer = 0, lean = 0;
  const hand = { x: 0, y: 0, vx: 0, vy: 0, reach: 0, press: 0, ready: false };

  function talk() {
    puppetEl.classList.add("is-talking");
    clearTimeout(talkTimer);
    talkTimer = setTimeout(() => puppetEl.classList.remove("is-talking"), 600);
    if (compact.matches) return; // en pantallas angostas el globo no se muestra (ver styles.css)
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
      T = { x: S.x + 24 + (calm ? 0 : Math.sin(t * 1.4) * 5), y: S.y + 96 + (calm ? 0 : Math.sin(t * 1.1) * 6) };
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
    const w = 28 - 9 * Math.min(dist / 800, 1);
    arm.outline.setAttribute("d", d);
    arm.outline.setAttribute("stroke-width", (w + 7).toFixed(1));
    arm.fill.setAttribute("d", d);
    arm.fill.setAttribute("stroke-width", w.toFixed(1));
    arm.shine.setAttribute("d", d);
    arm.hand.setAttribute(
      "transform",
      `translate(${(hand.x + 4 * hand.press).toFixed(1)} ${hand.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${(1 - 0.1 * hand.press).toFixed(3)})`
    );

    // el muñeco se inclina un poco hacia lo que mira (botón o puntero)
    if (!calm) {
      const pr = puppetEl.getBoundingClientRect();
      const px = pr.left + pr.width / 2;
      let want = 0;
      if (res.el) {
        const r = res.el.getBoundingClientRect();
        want = clamp((r.left + r.width / 2 - px) / 500, -1, 1) * 2.4;
      } else if (mode === "mouse" && pointer) {
        want = clamp((pointer.x - px) / 900, -1, 1) * 1.6;
      }
      lean += (want - lean) * (1 - Math.exp(-dt * 6));
      leanEl.style.transform = `rotate(${lean.toFixed(2)}deg)`;
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
