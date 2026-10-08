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
  const cssPx = (name) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

  /* ===================================================================== Contenido */
  const btnHTML = ({ label, sub, href, pending, tone, icon }, small = false) => {
    const isPending = pending || !href;
    const attrs = isPending
      ? 'href="#" aria-disabled="true"'
      : `href="${esc(href)}" target="_blank" rel="noopener noreferrer"`;
    return `<a class="btn${small ? " btn--sm" : ""}${icon ? " btn--icon" : ""}${isPending ? " is-pending" : ""}" data-reach data-tone="${esc(tone || "paper")}" ${attrs}>
      ${icon ? `<span class="btn__icon" aria-hidden="true">${icon}</span>` : ""}<span>${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ""}</span></a>`;
  };

  // Logos (dibujados en línea para no depender de nada externo)
  const ICON = {
    whatsapp: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3 7l9 6.5L21 7"/></svg>',
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

    // Botones principales + booking al final
    const B = D.booking;
    const digits = B && String(B.phone || "").replace(/\D/g, "");
    const bookingHref = !digits ? ""
      : B.mode === "tel" ? `tel:+${digits}`
      : `https://wa.me/${digits}${B.message ? `?text=${encodeURIComponent(B.message)}` : ""}`;
    const visible = D.showPending === false ? D.links.filter((l) => l.href && !l.pending) : D.links;
    $("#links").innerHTML = visible.map((l) => btnHTML(l)).join("");

    // Sección Booking: WhatsApp (o llamada) y mail
    if (B) {
      const contact = [
        { label: B.mode === "tel" ? "Llamar" : "WhatsApp", sub: B.phone || "", href: bookingHref, tone: "sun", icon: ICON.whatsapp },
        B.email ? { label: "Mail", sub: B.email, href: `mailto:${B.email}?subject=${encodeURIComponent("Booking Promo x Cierre")}`, tone: "paper", icon: ICON.mail } : null,
      ].filter(Boolean).filter((c) => D.showPending !== false || c.href);
      $("#contact").innerHTML = `<p class="contact__name">${esc(B.name)}</p>` + contact.map((c) => btnHTML(c)).join("");
    } else {
      $("#booking").hidden = true;
    }

    // Gira: las fechas pasadas se ocultan solas
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const upcoming = D.shows.filter((s) => !s.date || new Date(`${s.date}T00:00:00`) >= today);
    // Cinta de arriba: las fechas de la gira (si no hay, los títulos de temas de data.js)
    const tickerItems = upcoming.length
      ? [D.tour ? D.tour.name : "Fechas"].concat(upcoming.map((s) => {
          const { day, mon } = fmtDate(s.date);
          return `${day} ${mon} · ${s.city}${s.soldOut ? " (agotado)" : ""}`;
        }))
      : D.ticker;
    const items = tickerItems.map((t) => `<span>${esc(t)}</span>`).join("");
    $("#ticker").innerHTML = items.repeat(4);

    const tourChip = $("#tour-chip");
    if (D.tour && upcoming.length) {
      tourChip.innerHTML = `${esc(D.tour.sub)} <b>${esc(D.tour.name)}</b> · ${upcoming.length} fechas`;
    } else {
      tourChip.hidden = true;
    }
    $("#shows").innerHTML = upcoming.length
      ? upcoming.map((s) => {
          const { day, mon } = fmtDate(s.date);
          const meta = [s.city, s.note, s.lineup && s.lineup.length ? `con ${s.lineup.join(", ")}` : ""].filter(Boolean).join(" · ");
          const action = s.soldOut
            ? '<span class="sold">Agotado</span>'
            : s.tickets
              ? btnHTML({ label: s.ticketLabel || "Entradas", href: s.tickets, tone: "tomato" }, true)
              : '<span class="soon">Próximamente disponible</span>';
          return `<li class="show${s.soldOut ? " is-sold" : ""}">
            <div class="show__date"><span class="show__day">${esc(day)}</span><span class="show__mon">${esc(mon)}</span></div>
            <div class="show__info"><p class="show__venue">${esc(s.venue)}</p><p class="show__meta">${esc(meta)}</p></div>
            ${action}
          </li>`;
        }).join("")
      : '<li class="empty">Sin fechas por ahora. Seguinos en redes para enterarte primero.</li>';

    const releases = D.showPending === false ? D.releases.filter((r) => r.href && !r.pending) : D.releases;
    $("#releases").innerHTML = releases.map((r) => `
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

  /* =====================================================================
   * Métricas. Se cargan solo si data.js tiene un ID (Tag Manager y/o Analytics 4).
   * Cada botón tocado manda un evento con el nombre del botón y la URL de destino.
   * ===================================================================== */
  const A = D.analytics || {};
  const GTM = /^GTM-[A-Z0-9]+$/i.test(A.gtm || "") ? A.gtm : "";
  const GA = /^G-[A-Z0-9]+$/i.test(A.ga4 || "") ? A.ga4 : "";
  if (GTM) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM)}`;
    document.head.appendChild(s);
  }
  if (GA) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA);
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA)}`;
    document.head.appendChild(s);
  }
  const slug = (t) => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  function track(btn) {
    if (!GTM && !GA) return;
    const show = btn.closest(".show"), rel = btn.closest(".release");
    const what = show ? `entradas_${slug(show.querySelector(".show__venue")?.textContent)}`
      : rel ? `escuchar_${slug(rel.querySelector(".release__title")?.textContent)}`
      : slug(btn.querySelector("span:not(.btn__icon)")?.firstChild?.textContent || btn.textContent);
    const section = show ? "fechas" : rel ? "discos" : btn.closest("#contact") ? "booking" : "botones";
    const link_url = btn.getAttribute("href") || "";
    if (GTM) window.dataLayer.push({ event: "click_boton", boton: what, seccion: section, link_url });
    if (GA && typeof window.gtag === "function") {
      gtag("event", `click_${what}`.slice(0, 40), { link_url, section, transport_type: "beacon" });
    }
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

  /* =====================================================================
   * El muñeco. Vive en el carril derecho de los botones y sube o baja siguiendo
   * al puntero; cuando el puntero está a la altura de un botón, se posa sobre él.
   *  - mouse: sigue la altura del mouse; clic → lo aprieta, habla y abre el link.
   *  - táctil: sigue el scroll (se posa en el botón más cercano al centro de la
   *    pantalla); al tocar un botón, va hasta él, lo aprieta, habla y recién ahí abre.
   *  - teclado: se posa en el botón con foco.
   * ===================================================================== */
  const puppet = $("#puppet"), pImg = $("#puppet-img"), shadow = $("#shadow");
  const bubble = $("#bubble"), bubbleText = $("#bubble-text");
  const links = $("#links");
  const buttons = $$("[data-reach]");
  const OVERLAP = 14; // px del muñeco que quedan detrás del borde del botón al estar posado
  const hoverable = matchMedia("(hover: hover) and (pointer: fine)").matches;

  let input = hoverable ? "mouse" : "touch";
  let W = 0, H = 0, ratio = 1.218;
  const img = new Image();
  img.alt = D.puppet.alt || "";
  img.decoding = "async";
  img.draggable = false;
  img.addEventListener("load", () => { ratio = img.naturalHeight / img.naturalWidth; W = 0; });
  img.src = D.puppet.src;
  pImg.appendChild(img);

  const pos = { x: 0, y: 0, vx: 0, vy: 0, s: 1, ready: false };
  let pointer = null;      // última posición del mouse (coordenadas de página)
  let focusBtn = null;     // botón con foco de teclado
  let tapBtn = null;       // botón tocado (táctil): ir, apretar y abrir
  let tapHref = null;
  let current = null;      // botón sobre el que está (o hacia el que va)
  let pressedEl = null, pressTimer = 0;
  let seated = 0, squash = 0, wasAir = false, introDone = false, phraseIdx = 0, bubbleTimer = 0;

  function measure() {
    W = puppet.getBoundingClientRect().width || cssPx("--puppet-w");
    H = W * ratio;
  }

  function perch(btn) {
    const r = btn.getBoundingClientRect();
    const small = btn.classList.contains("btn--sm");
    const lane = cssPx("--lane") * (small ? 0.8 : 1);
    return { x: r.right + scrollX - lane / 2, y: r.top + scrollY + OVERLAP, s: small ? 0.8 : 1 };
  }

  function say(text) {
    bubbleText.textContent = text || D.phrases[phraseIdx++ % D.phrases.length];
    bubble.hidden = false;
    bubbleText.style.animation = "none";
    void bubbleText.offsetWidth;
    bubbleText.style.animation = "";
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { bubble.hidden = true; }, 1100);
  }

  function press(btn, text) {
    if (pressedEl) pressedEl.classList.remove("is-pressed");
    pressedEl = btn;
    btn.classList.add("is-pressed");
    squash = 1;
    say(text);
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => { btn.classList.remove("is-pressed"); if (pressedEl === btn) pressedEl = null; }, 260);
  }

  function pickTarget() {
    if (tapBtn) return tapBtn;
    if (focusBtn) return focusBtn;
    if (input === "mouse") {
      if (!pointer) return current || buttons[0] || null;
      for (const b of buttons) {
        const r = b.getBoundingClientRect();
        if (pointer.y >= r.top + scrollY - 8 && pointer.y <= r.bottom + scrollY + 8) return b;
      }
      return null; // ningún botón a esa altura: sigue libre al mouse
    }
    // táctil: el botón más cercano al centro de la pantalla
    const cy = scrollY + innerHeight * 0.45;
    let best = null, bd = Infinity;
    for (const b of buttons) {
      const r = b.getBoundingClientRect();
      const d = Math.abs(r.top + scrollY + r.height / 2 - cy);
      if (d < bd) { bd = d; best = b; }
    }
    return bd < innerHeight * 0.7 ? best : current;
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!W) measure();
    const calm = reduced.matches;

    const target = pickTarget();
    let T;
    if (target) {
      T = perch(target);
    } else if (pointer) {
      const c = links.getBoundingClientRect();
      T = { x: c.right + scrollX - cssPx("--lane") / 2, y: pointer.y + H * 0.4, s: 1 };
    } else {
      T = { x: pos.x, y: pos.y, s: pos.s };
    }
    if (target !== current) {
      if (current && !calm) pos.vy -= 420; // saltito al cambiar de botón
      current = target;
    }

    if (calm || !pos.ready) {
      if (!pos.ready && !calm) { pos.x = T.x; pos.y = scrollY - H - 40; pos.vy = 0; }  // entra cayendo desde arriba
      else { pos.x = T.x; pos.y = T.y; pos.vx = pos.vy = 0; }
      pos.s = T.s;
      pos.ready = true;
    } else {
      const k = tapBtn ? 380 : 240, c = 2 * Math.sqrt(k) * 0.78;
      pos.vx += ((T.x - pos.x) * k - c * pos.vx) * dt;
      pos.vy += ((T.y - pos.y) * k - c * pos.vy) * dt;
      pos.x += pos.vx * dt;
      pos.y += pos.vy * dt;
      pos.s += (T.s - pos.s) * (1 - Math.exp(-dt * 10));
    }

    // estirar al moverse, aplastar al aterrizar
    const speed = Math.hypot(pos.vx, pos.vy);
    const air = calm ? 0 : clamp(speed / 900, 0, 1);
    const near = Math.hypot(T.x - pos.x, T.y - pos.y) < 10;
    if (wasAir && air < 0.12 && near && target) {
      squash = Math.max(squash, 0.9);
      if (!introDone) { introDone = true; say(D.phrases[0]); phraseIdx = 1; }
    }
    wasAir = air > 0.3;
    squash = Math.max(0, squash - dt * 5);
    const seatedTarget = near && air < 0.1 && target ? 1 : 0;
    seated += (seatedTarget - seated) * (calm ? 1 : 1 - Math.exp(-dt * (seatedTarget ? 12 : 30)));

    const bob = calm ? 0 : Math.sin(now / 420) * 0.012 * seated;
    const sy = (1 + 0.16 * air - 0.2 * squash + bob) * pos.s;
    const sx = (1 - 0.1 * air + 0.16 * squash - bob) * pos.s;
    const tilt = calm ? 0 : clamp(pos.vx / 45, -9, 9) + clamp(pos.vy / 160, -3, 3);

    puppet.style.transform = `translate(${(pos.x - W / 2).toFixed(1)}px, ${(pos.y - H).toFixed(1)}px) rotate(${tilt.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
    pImg.style.setProperty("--clip", `${(OVERLAP * seated).toFixed(1)}px`);
    shadow.style.transform = `translate(${T.x.toFixed(1)}px, ${(T.y - OVERLAP + 5).toFixed(1)}px) scale(${(0.55 + 0.45 * seated).toFixed(3)})`;
    shadow.style.opacity = (target ? 0.08 + 0.18 * seated : 0).toFixed(3);

    // toque pendiente: al posarse, aprieta, habla y abre
    if (tapBtn && current === tapBtn && seated > 0.7) {
      const btn = tapBtn, href = tapHref;
      tapBtn = null; tapHref = null;
      if (href) {
        press(btn);
        setTimeout(() => { location.href = href; }, 380);
      } else {
        press(btn, "TODAVÍA NO…");
        toast("Este link todavía no está cargado.");
      }
    }

    requestAnimationFrame(frame);
  }

  /* --- entrada --- */
  addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    input = "mouse";
    pointer = { x: e.clientX + scrollX, y: e.clientY + scrollY };
  }, { passive: true });
  addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") { input = "touch"; pointer = null; }
  }, { passive: true });
  addEventListener("scroll", () => {
    // con el mouse quieto y la página moviéndose, el puntero sigue a la misma altura de pantalla
    if (pointer && input === "mouse") pointer = { x: pointer.x, y: pointer.y };
  }, { passive: true });
  document.addEventListener("focusin", (e) => {
    const b = e.target.closest && e.target.closest("[data-reach]");
    focusBtn = b && b.matches(":focus-visible") ? b : null;
  });
  document.addEventListener("focusout", () => { focusBtn = null; });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest && e.target.closest("[data-reach]");
    if (!btn) return;
    const pending = btn.classList.contains("is-pending");
    const href = pending ? "" : btn.getAttribute("href");
    if (pending) e.preventDefault();
    if (!pending) track(btn);

    if (input === "touch" && !reduced.matches) {
      // táctil: primero va hasta el botón y lo aprieta; recién al posarse abre el link
      e.preventDefault();
      tapBtn = btn;
      tapHref = href;
      return;
    }
    if (pending) {
      press(btn, "TODAVÍA NO…");
      toast("Este link todavía no está cargado.");
      return;
    }
    press(btn); // mouse/teclado: el link se abre en otra pestaña como siempre
  });

  addEventListener("resize", () => { W = 0; });

  requestAnimationFrame(frame);
})();
