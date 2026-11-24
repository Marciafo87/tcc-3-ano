/* ==========================================================================
   NEXT LEVEL EXPERIENCE — Site público
   ========================================================================== */
(function () {
  "use strict";
  var NLX = window.NLX, esc = NLX.esc, icon = NLX.icon, safeUrl = NLX.safeUrl;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var state = { data: null, filter: "Todos" };
  NLX.getData = function () { return state.data; };

  /* ---------------- utilidades ---------------- */
  function toast(msg) {
    var t = $("#toast");
    t.innerHTML = icon("check") + "<span>" + esc(msg) + "</span>";
    t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  NLX.toast = toast;

  function initials(name) {
    return String(name || "?").trim().split(/\s+/).filter(function (w) { return /^[\p{L}\p{N}]/u.test(w); }).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
  }
  function talkStart(t) {
    if (!t.date || !t.start) return null;
    var d = t.date.split("-"), h = t.start.split(":");
    if (d.length !== 3 || h.length < 2) return null;
    return new Date(+d[0], +d[1] - 1, +d[2], +h[0], +h[1]);
  }

  /* ---------------- modal ---------------- */
  var lastFocus = null;
  function openModal(html) {
    lastFocus = document.activeElement;
    $("#modal-content").innerHTML = html;
    var m = $("#modal"); m.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(function () { $(".modal-close", m).focus(); }, 30);
  }
  function closeModal() {
    $("#modal").classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  NLX.openModal = openModal;

  /* ---------------- textos ---------------- */
  function applyTexts() {
    var d = state.data;
    $$("[data-text]").forEach(function (el) { el.textContent = d.texts[el.getAttribute("data-text")] || ""; });
    $$("[data-site]").forEach(function (el) { el.textContent = d.site[el.getAttribute("data-site")] || ""; });
    document.title = (d.site.name || "NEXT LEVEL EXPERIENCE") + " — Administração";
    // título do hero em linhas, com destaque na última palavra
    var words = (d.texts.heroTitle || "").trim().split(/\s+/);
    var lines = [], per = Math.ceil(words.length / 3) || 1;
    if (words.length <= 3) lines = [words];
    else for (var i = 0; i < words.length; i += per) lines.push(words.slice(i, i + per));
    $("#hero-title").innerHTML = lines.map(function (ln, li) {
      return '<span class="line"><span>' + ln.map(function (w, wi) {
        var last = li === lines.length - 1 && wi === ln.length - 1;
        return last ? '<span class="accent">' + esc(w) + "</span>" : esc(w);
      }).join(" ") + "</span></span>";
    }).join("");
    $("#formacao-note").innerHTML = d.texts.formacaoNote ? icon("spark") + "<span>" + esc(d.texts.formacaoNote) + "</span>" : "";
    $("#mercado-note").innerHTML = d.texts.mercadoDisclaimer ? icon("spark") + "<span>" + esc(d.texts.mercadoDisclaimer) + "</span>" : "";
    var realProjects = d.projects.filter(function (p) { return !p.demo; }).length;
    var stats = [
      [d.areas.length, "áreas de conhecimento"],
      ["2 anos", "de formação"],
      [realProjects || null, "projetos dos estudantes"],
      [d.simulator.rounds.length, "decisões no simulador"]
    ].filter(function (s) { return s[0]; });
    $("#hero-stats").innerHTML = stats.map(function (s) { return '<div class="hero-stat"><b>' + esc(s[0]) + "</b><span>" + esc(s[1]) + "</span></div>"; }).join("");
    $("#social").innerHTML = (d.site.social || []).filter(function (s) { return safeUrl(s.url); }).map(function (s) {
      return '<a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener">' + esc(s.label || s.url) + "</a>";
    }).join("");
  }

  /* ---------------- formação ---------------- */
  function renderAreas() {
    var g = $("#areas-grid");
    g.innerHTML = state.data.areas.map(function (a, i) {
      var img = safeUrl(a.image);
      return '<button class="area-card reveal" type="button" data-area="' + esc(a.id) + '">' +
        '<span class="area-num">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="icon-tile">' + (img ? '<img src="' + esc(img) + '" alt="">' : icon(a.icon)) + "</span>" +
        "<h3>" + esc(a.name) + "</h3><p>" + esc(a.description) + "</p>" +
        '<span class="area-more">Ver na prática ' + icon("arrowRight") + "</span></button>";
    }).join("");
    observeReveal(g);
  }
  function openArea(id) {
    var a = state.data.areas.find(function (x) { return x.id === id; });
    if (!a) return;
    var img = safeUrl(a.image);
    openModal((img ? '<div class="modal-hero"><img src="' + esc(img) + '" alt=""></div>' : "") +
      '<div class="modal-body"><span class="icon-tile">' + icon(a.icon) + "</span>" +
      '<h2 id="modal-title">' + esc(a.name) + "</h2><p class=\"lead\" style=\"margin-top:0\">" + esc(a.description) + "</p>" +
      '<div class="detail-grid"><div class="detail"><b>Aplicação prática</b><p>' + esc(a.practice) + "</p></div>" +
      '<div class="detail"><b>Exemplo no mercado</b><p>' + esc(a.market) + "</p></div></div></div>");
  }

  /* ---------------- jornada ---------------- */
  function renderJourney() {
    var d = state.data;
    var col = function (year, label) {
      var steps = d.journey.filter(function (s) { return String(s.year) === year; });
      var intro = year === "1" ? d.journeyIntro.year1 : d.journeyIntro.year2;
      return '<div class="year-col reveal' + (year === "2" ? " reveal-d1" : "") + '">' +
        '<div class="year-head"><span class="year-num">0' + year + "</span><div><h3>" + label + "</h3><p>" + esc(intro) + "</p></div></div>" +
        '<div class="track"><span class="track-fill"></span>' +
        steps.map(function (s, i) {
          return '<div class="step"><h4><span class="step-idx">ETAPA ' + (i + 1) + "</span>" + esc(s.title) +
"</h4><p>" + esc(s.text) + "</p></div>";
        }).join("") +
        (steps.length ? "" : '<div class="step"><p>Em breve.</p></div>') +
        '</div><div class="level-meter">Nível ' + (year === "1" ? "<i class=on></i><i></i>" : "<i class=on></i><i class=on></i>") + "</div></div>";
    };
    $("#journey").innerHTML = col("1", "Primeiro ano") + col("2", "Segundo ano");
    observeReveal($("#journey"));
    updateTracks();
  }
  function updateTracks() {
    var vh = window.innerHeight;
    $$("#journey .track").forEach(function (tr) {
      var r = tr.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
      $(".track-fill", tr).style.height = (p * (r.height - 12)) + "px";
      $$(".step", tr).forEach(function (st) {
        st.classList.toggle("lit", st.getBoundingClientRect().top < vh * 0.62);
      });
    });
  }

  /* ---------------- gestão na prática ---------------- */
  var practiceIdx = 0;
  function renderPractice() {
    var list = state.data.practice;
    if (practiceIdx >= list.length) practiceIdx = 0;
    $("#practice-tabs").innerHTML = list.map(function (p, i) {
      return '<button class="ptab" role="tab" type="button" id="ptab-' + i + '" aria-selected="' + (i === practiceIdx) + '" data-p="' + i + '">' + icon(p.icon) + "<span>" + esc(p.title) + "</span></button>";
    }).join("");
    showPractice(practiceIdx, false);
  }
  function showPractice(i, focus) {
    var p = state.data.practice[i]; if (!p) { $("#practice-panel").innerHTML = ""; return; }
    practiceIdx = i;
    $$(".ptab").forEach(function (b, j) { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; });
    if (focus) $("#ptab-" + i).focus();
    var steps = Array.isArray(p.steps) ? p.steps : String(p.steps || "").split("\n");
    $("#practice-panel").setAttribute("aria-labelledby", "ptab-" + i);
    $("#practice-panel").innerHTML =
      '<span class="badge">' + icon("spark") + esc(p.concept) + "</span>" +
      '<h3 style="margin-top:14px">' + esc(p.title) + "</h3>" +
      '<div class="pipeline">' + steps.filter(Boolean).map(function (s, k) {
        return '<div class="pip" style="animation-delay:' + (k * 0.09) + 's">' + esc(s) + "</div>";
      }).join("") + "</div>" +
      '<div class="practice-example">' + icon("bulb") + "<div><b>Na vida real</b>" + esc(p.example) + "</div></div>";
  }
  function brl(v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }); }
  function updateLab() {
    var f = parseFloat($("#lab-fixed").value) || 0, pr = parseFloat($("#lab-price").value) || 0, v = parseFloat($("#lab-var").value) || 0;
    var out = $("#lab-result"), m = pr - v;
    if (m <= 0) {
      out.innerHTML = '<small>Resultado</small><div class="big" style="color:var(--bad)">Sem equilíbrio</div><p style="color:var(--gray);font-size:14px;margin-top:8px">Com o custo por unidade maior ou igual ao preço, cada venda gera prejuízo. É preciso rever o preço ou os custos.</p>';
      return;
    }
    var units = Math.ceil(f / m), rev = units * pr, mpct = Math.round((m / pr) * 100);
    out.innerHTML = '<small>É preciso vender por mês</small><div class="big grad-text">' + units.toLocaleString("pt-BR") + " unidades</div>" +
      '<small>Faturamento mínimo: ' + brl(rev) + " · margem por unidade: " + brl(m) + " (" + mpct + "%)</small>" +
      '<div class="lab-bar"><i style="width:' + (100 - mpct) + '%;background:rgba(248,113,113,.7)"></i><i style="width:' + mpct + '%;background:var(--grad)"></i></div>' +
      '<small>Vermelho: custo de cada venda · Roxo: margem que paga os custos fixos</small>';
  }

  /* ---------------- projetos ---------------- */
  function visibleProjects() { return state.data.projects.filter(function (p) { return !p.demo; }); }
  function renderProjects() {
    var d = { projects: visibleProjects() }, cats = ["Todos"];
    d.projects.forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
    if (cats.indexOf(state.filter) < 0) state.filter = "Todos";
    $("#project-filters").innerHTML = d.projects.length > 1 ? cats.map(function (c) {
      return '<button class="chip" type="button" aria-pressed="' + (c === state.filter) + '" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
    }).join("") : "";
    var list = d.projects.filter(function (p) { return state.filter === "Todos" || p.category === state.filter; });
    var g = $("#projects-grid");
    if (!d.projects.length) {
      g.style.display = "block";
      g.innerHTML = '<div class="empty"><span class="icon-tile">' + icon("layers") + "</span><h3>Projetos em breve</h3><p>Os projetos desenvolvidos pelos estudantes serão publicados aqui.</p></div>";
      return;
    }
    g.style.display = "";
    g.innerHTML = list.map(function (p) {
      var cover = safeUrl(p.cover);
      return '<button class="project-card reveal" type="button" data-project="' + esc(p.id) + '">' +
        '<div class="project-cover">' + (cover ? '<img src="' + esc(cover) + '" alt="" loading="lazy">' : '<div class="cover-ph">' + icon(catIcon(p.category)) + "</div>") +
        '<div class="badges"><span class="badge">' + esc(p.category || "Projeto") + "</span>" + "</div></div>" +
        '<div class="project-info"><h3>' + esc(p.name) + "</h3><p>" + esc(p.description) + '</p><span class="area-more">Ver projeto ' + icon("arrowRight") + "</span></div></button>";
    }).join("");
    observeReveal(g);
  }
  function catIcon(c) {
    var m = { "Empreendedorismo": "rocket", "Planejamento": "target", "Gestão Empresarial": "building", "Marketing": "megaphone", "Finanças": "chart", "Recursos Humanos": "idcard", "Logística": "truck", "Projetos Integradores": "layers" };
    return m[c] || "bulb";
  }
  function openProject(id) {
    var p = visibleProjects().find(function (x) { return x.id === id; });
    if (!p) return;
    var cover = safeUrl(p.cover), link = safeUrl(p.link);
    var imgs = (p.images || []).map(safeUrl).filter(Boolean);
    var det = function (label, val, full) { return val ? '<div class="detail' + (full ? " full" : "") + '"><b>' + label + "</b><p>" + esc(val) + "</p></div>" : ""; };
    openModal((cover ? '<div class="modal-hero"><img src="' + esc(cover) + '" alt=""></div>' : "") +
      '<div class="modal-body"><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="badge">' + esc(p.category || "Projeto") + "</span></div>" +
      '<h2 id="modal-title">' + esc(p.name) + '</h2><p class="lead" style="margin-top:0">' + esc(p.description) + "</p>" +
      '<div class="detail-grid">' + det("Objetivo", p.objective) + det("Problema identificado", p.problem) + det("Solução proposta", p.solution) +
      det("Conhecimentos aplicados", p.knowledge) + det("Integrantes", p.members, true) + "</div>" +
      (imgs.length ? '<div class="thumbs">' + imgs.map(function (s) { return '<img src="' + esc(s) + '" alt="Imagem do projeto" data-zoom>'; }).join("") + "</div>" : "") +
      (link ? '<div class="row-end"><a class="btn btn-primary" href="' + esc(link) + '" target="_blank" rel="noopener">' + icon("external") + "Abrir demonstração</a></div>" : "") +
      "</div>");
  }

  /* ---------------- palestras ---------------- */
  function renderTalks() {
    var d = state.data, box = $("#talks");
    var talks = d.talks.slice().sort(function (a, b) {
      var ta = talkStart(a), tb = talkStart(b);
      return (ta ? ta.getTime() : Infinity) - (tb ? tb.getTime() : Infinity);
    });
    if (!talks.length) {
      box.innerHTML = '<div class="empty reveal"><span class="icon-tile">' + icon("calendar") + "</span><h3>Programação em atualização</h3><p>" + esc(d.texts.palestrasEmpty) + "</p></div>";
      observeReveal(box); return;
    }
    var now = Date.now(), next = null;
    talks.forEach(function (t) {
      var s = talkStart(t); if (!s) return;
      var end = s.getTime() + (parseInt(t.duration, 10) || 0) * 60000;
      if (!next && end > now) next = t;
    });
    var html = "";
    if (next) {
      var s = talkStart(next), live = s.getTime() <= now;
      var photo = safeUrl(next.photo);
      html += '<div class="next-talk reveal"><div class="avatar">' + (photo ? '<img src="' + esc(photo) + '" alt="">' : esc(initials(next.speaker || next.title))) + "</div>" +
        "<div><span class=\"badge\">" + (live ? '<span class="live-dot"></span> Acontecendo agora' : "Próxima atividade") + "</span><h3>" + esc(next.title) + "</h3>" +
        '<div class="meta">' + (next.speaker ? "<span>" + esc(next.speaker) + "</span>" : "") + "<span>" + esc(next.start) + (next.place ? " · " + esc(next.place) : "") + "</span></div></div>" +
        '<div class="countdown" id="countdown" data-start="' + s.getTime() + '"></div></div>';
    }
    var groups = {};
    talks.forEach(function (t) { var k = t.date || "sem-data"; (groups[k] = groups[k] || []).push(t); });
    Object.keys(groups).forEach(function (k) {
      html += '<div class="talk-day reveal"><h3>' + icon("calendar") + esc(k === "sem-data" ? "Data a definir" : fmtDate(k)) + '</h3><div class="talks">' +
        groups[k].map(function (t) {
          var st = talkStart(t), end = st ? st.getTime() + (parseInt(t.duration, 10) || 0) * 60000 : 0;
          var cls = t === next ? " is-next" : (st && end < now ? " is-past" : "");
          var photo = safeUrl(t.photo);
          return '<article class="talk' + cls + '"><div class="talk-time">' + esc(t.start || "--:--") + (t.duration ? "<small>" + esc(t.duration) + " min</small>" : "") + "</div>" +
            '<div class="avatar">' + (photo ? '<img src="' + esc(photo) + '" alt="">' : esc(initials(t.speaker || t.title))) + "</div>" +
            '<div class="talk-body">' + (t.theme ? '<span class="badge">' + esc(t.theme) + "</span>" : "") + '<h4 style="margin-top:6px">' + esc(t.title) + "</h4>" +
            '<div class="meta">' + (t.speaker ? "<span>" + icon("mic") + esc(t.speaker) + "</span>" : "") + (t.place ? "<span>" + icon("pin") + esc(t.place) + "</span>" : "") + "</div>" +
            (t.description ? "<p>" + esc(t.description) + "</p>" : "") + "</div></article>";
        }).join("") + "</div></div>";
    });
    box.innerHTML = html;
    observeReveal(box);
    tickCountdown();
  }
  function tickCountdown() {
    var c = $("#countdown"); if (!c) return;
    var diff = +c.getAttribute("data-start") - Date.now();
    if (diff <= 0) { c.innerHTML = "<b>AO VIVO</b><span>em andamento</span>"; return; }
    var m = Math.floor(diff / 60000), h = Math.floor(m / 60), dd = Math.floor(h / 24);
    var txt = dd > 0 ? dd + "d " + (h % 24) + "h" : h > 0 ? h + "h " + String(m % 60).padStart(2, "0") + "min" : m + " min";
    c.innerHTML = "<b>" + txt + "</b><span>para começar</span>";
  }

  /* ---------------- mercado ---------------- */
  function renderMarket() {
    var d = state.data;
    $("#careers").innerHTML = d.careers.map(function (c) {
      return '<article class="career reveal"><span class="icon-tile">' + icon(c.icon) + "</span><h3>" + esc(c.title) + "</h3><p>" + esc(c.description) + "</p></article>";
    }).join("");
    $("#studies").innerHTML = d.studies.map(function (s) {
      return '<div class="study reveal"><b>' + esc(s.title) + "</b><p>" + esc(s.description) + "</p></div>";
    }).join("");
    observeReveal($("#mercado"));
  }

  /* ---------------- formulário + QR ---------------- */
  function formUrl() { return safeUrl(state.data.links.googleForm); }
  function renderForm() {
    var url = formUrl(), act = $("#form-actions"), qr = $("#form-qr");
    if (!url) {
      act.innerHTML = '<p class="note">' + icon("spark") + "<span>" + esc(state.data.texts.formEmpty) + "</span></p>";
      qr.innerHTML = '<div class="qr-empty"><div>' + icon("qr", "") + "<p>O QR Code estará disponível em breve.</p></div></div>";
      return;
    }
    act.innerHTML = '<div class="form-actions"><a class="btn btn-primary" href="' + esc(url) + '" target="_blank" rel="noopener">' + icon("external") + "Abrir formulário</a>" +
      '<button class="btn btn-ghost" type="button" id="copy-link">' + icon("copy") + "Copiar endereço</button>" +
      '<button class="btn btn-ghost" type="button" id="open-stage">' + icon("screen") + "Mostrar no telão</button></div>" +
      '<p class="url-box">' + esc(url) + "</p>";
    var svg;
    try { svg = NLX.QR.svg(url, { ecl: "M" }); } catch (e) { svg = "<p style='color:#000'>Link longo demais para QR Code.</p>"; }
    qr.innerHTML = '<div class="qr-card"><i class="qr-corner tl"></i><i class="qr-corner tr"></i><i class="qr-corner bl"></i><i class="qr-corner br"></i>' + svg + '<div class="qr-label">APONTE A CÂMERA</div></div>';
  }
  function copyLink() {
    var url = formUrl(); if (!url) return;
    var done = function () { toast("Endereço copiado!"); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(done, fallback);
    else fallback();
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = url; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("Não foi possível copiar. Selecione o endereço manualmente."); }
      document.body.removeChild(ta);
    }
  }
  function openStage() {
    var url = formUrl();
    if (!url) { toast("O formulário ainda não foi configurado."); return; }
    var box = $("#stage-qr-code");
    $$("svg", box).forEach(function (s) { s.remove(); });
    box.insertAdjacentHTML("beforeend", NLX.QR.svg(url, { ecl: "M" }));
    $("#stage-qr").classList.add("open");
    $("#stage-close").focus();
  }
  function closeStage() { $("#stage-qr").classList.remove("open"); }

  /* ---------------- inscrição ---------------- */
  function signupUrl() { return safeUrl(state.data.links.signup) || formUrl(); }
  function renderSignup() {
    var url = signupUrl(), t = state.data.texts, box = $("#signup-actions");
    box.innerHTML = url
      ? '<a class="btn btn-primary btn-xl" href="' + esc(url) + '" target="_blank" rel="noopener">' + icon("arrowRight") + "<span>" + esc(t.inscricaoButton || "QUERO ME INSCREVER") + "</span></a>"
      : '<span class="btn btn-ghost btn-xl" aria-disabled="true" style="cursor:default">' + esc(t.inscricaoEmpty || "Inscrições em breve") + "</span>";
  }

  /* ---------------- sobre + galeria ---------------- */
  function renderAbout() {
    var s = state.data.site;
    var items = [["building", "Instituição", s.institution], ["briefcase", "Curso", s.course], ["users", "Turma", s.classGroup], ["calendar", "Data", s.eventDate], ["pin", "Local", s.eventPlace], ["chat", "Contato", s.contact]]
      .filter(function (i) { return i[2]; });
    $("#info-list").innerHTML = items.map(function (i) {
      return '<div class="info-item">' + icon(i[0]) + "<div><small>" + i[1] + "</small>" + esc(i[2]) + "</div></div>";
    }).join("") + (state.data.links.extra || []).filter(function (l) { return safeUrl(l.url); }).map(function (l) {
      return '<a class="info-item" style="text-decoration:none;color:#fff" href="' + esc(safeUrl(l.url)) + '" target="_blank" rel="noopener">' + icon("link") + "<div><small>Link</small>" + esc(l.label || l.url) + "</div></a>";
    }).join("");
    var gal = state.data.gallery.filter(function (g) { return safeUrl(g.image); });
    $("#gallery").innerHTML = gal.length ? '<div class="gallery">' + gal.map(function (g) {
      return '<figure style="margin:0"><button type="button" data-gallery="' + esc(g.id) + '"><img src="' + esc(safeUrl(g.image)) + '" alt="' + esc(g.caption || "Foto da galeria") + '">' + (g.caption ? "<figcaption>" + esc(g.caption) + "</figcaption>" : "") + "</button></figure>";
    }).join("") + "</div>" : '<div class="empty"><span class="icon-tile">' + icon("image") + "</span><p>" + esc(state.data.texts.galeriaEmpty) + "</p></div>";
  }
  function zoom(src, cap) {
    openModal('<div class="modal-body"><img src="' + esc(src) + '" alt="" style="width:100%;border-radius:14px">' + (cap ? '<p style="margin-top:12px;color:var(--gray)">' + esc(cap) + "</p>" : "") + "</div>");
  }

  /* ---------------- revelar ao rolar ---------------- */
  var io = null;
  function observeReveal(root) {
    var els = $$(".reveal:not(.in)", root);
    if (reduced || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    if (!io) io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------------- navegação ---------------- */
  var navMap = { simulador: "pratica", encerramento: "sobre" };
  function initNav() {
    var header = $("#header"), nav = $("#nav"), tog = $("#menu-toggle");
    tog.innerHTML = icon("menu");
    var setOpen = function (o) {
      nav.classList.toggle("open", o); tog.setAttribute("aria-expanded", o);
      tog.innerHTML = icon(o ? "x" : "menu"); tog.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu");
    };
    tog.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); tog.focus(); } });
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 20);
      updateTracks();
    };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    if ("IntersectionObserver" in window) {
      var secIO = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = navMap[en.target.id] || en.target.id;
          $$("a[data-nav]", nav).forEach(function (a) {
            var on = a.getAttribute("data-nav") === id;
            a.classList.toggle("active", on);
            if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      $$("main > section").forEach(function (s) { secIO.observe(s); });
    }
  }

  /* ---------------- hero canvas: rede de conexões ---------------- */
  function initHeroCanvas() {
    var c = $("#hero-canvas"); if (!c || !c.getContext) return;
    var g = c.getContext("2d"), pts = [], w, h, dpr, run = true, raf;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(90, (w * h) / 16000));
      pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.6 + 0.6 });
    }
    function frame() {
      g.clearRect(0, 0, w, h);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!reduced) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, dd = dx * dx + dy * dy;
          if (dd < 14000) { g.strokeStyle = "rgba(157,77,255," + (0.16 * (1 - dd / 14000)) + ")"; g.lineWidth = 1; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke(); }
        }
        g.fillStyle = "rgba(192,132,252,.7)"; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
      }
      if (run && !reduced) raf = requestAnimationFrame(frame);
    }
    size(); frame();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { size(); if (reduced || !run) frame(); }, 150); });
    if ("IntersectionObserver" in window && !reduced) {
      new IntersectionObserver(function (e) {
        var vis = e[0].isIntersecting && !document.body.classList.contains("present");
        if (vis && !run) { run = true; frame(); } else if (!vis) { run = false; cancelAnimationFrame(raf); }
      }).observe(c);
    }
  }

  /* ---------------- modo apresentação ---------------- */
  var present = { on: false, idx: 0 };
  function sections() { return $$("main > section"); }
  function currentSectionIdx() {
    var s = sections(), mid = window.innerHeight / 2, best = 0;
    s.forEach(function (sec, i) { if (sec.getBoundingClientRect().top <= mid) best = i; });
    return best;
  }
  function presentGo(i) {
    var s = sections();
    present.idx = Math.max(0, Math.min(s.length - 1, i));
    present.lock = Date.now() + 1800; // não deixa a rolagem suave alterar o contador
    s[present.idx].scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    updateHud();
  }
  function updateHud() {
    var s = sections()[present.idx];
    $("#present-count").textContent = (present.idx + 1) + " / " + sections().length + " · " + (s ? s.getAttribute("data-present-title") : "");
  }
  function setPresent(on) {
    present.on = on;
    document.body.classList.toggle("present", on);
    if (on) {
      $$(".reveal").forEach(function (e) { e.classList.add("in"); });
      present.idx = currentSectionIdx(); updateHud();
      $("#nex-panel").classList.remove("open");
      toast("Modo apresentação ativo · use ← → para navegar");
      setTimeout(function () { presentGo(present.idx); }, 60);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
      closeStage();
    }
  }
  function toggleFull() {
    if (!document.fullscreenEnabled) { toast("Tela cheia indisponível neste navegador. Use F11."); return; }
    if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(function () { toast("Use F11 para tela cheia."); });
  }
  function initPresent() {
    $("#live-btn").addEventListener("click", function () { setPresent(!present.on); });
    var hud = $("#present-hud");
    $('[data-present="prev"]', hud).innerHTML = icon("arrowLeft");
    $('[data-present="next"]', hud).innerHTML = icon("arrowRight");
    $('[data-present="qr"]', hud).innerHTML = icon("qr") + "QR";
    $('[data-present="full"]', hud).innerHTML = icon("expand");
    $('[data-present="exit"]', hud).innerHTML = icon("x") + "Sair";
    hud.addEventListener("click", function (e) {
      var b = e.target.closest("[data-present]"); if (!b) return;
      var a = b.getAttribute("data-present");
      if (a === "prev") presentGo(present.idx - 1);
      if (a === "next") presentGo(present.idx + 1);
      if (a === "qr") openStage();
      if (a === "full") toggleFull();
      if (a === "exit") setPresent(false);
    });
    window.addEventListener("scroll", function () { if (present.on && !(present.lock > Date.now())) { var i = currentSectionIdx(); if (i !== present.idx) { present.idx = i; updateHud(); } } }, { passive: true });
    document.addEventListener("keydown", function (e) {
      var typing = /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || "") || (e.target && e.target.isContentEditable);
      if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Escape") {
        if ($("#stage-qr").classList.contains("open")) { closeStage(); return; }
        if ($("#modal").classList.contains("open")) { closeModal(); return; }
        if (present.on && !document.fullscreenElement) { setPresent(false); return; }
      }
      if (e.key === "p" || e.key === "P") { setPresent(!present.on); return; }
      if (!present.on) return;
      if (document.querySelector("#sim.crowd") && /^[1-4]$/.test(e.key)) return; // votos do simulador
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); presentGo(present.idx + 1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); presentGo(present.idx - 1); }
      else if (e.key === "Home") { e.preventDefault(); presentGo(0); }
      else if (e.key === "End") { e.preventDefault(); presentGo(sections().length - 1); }
      else if (e.key === "f" || e.key === "F") toggleFull();
      else if (e.key === "q" || e.key === "Q") { if ($("#stage-qr").classList.contains("open")) closeStage(); else openStage(); }
    });
  }

  /* ---------------- eventos globais ---------------- */
  function initEvents() {
    document.addEventListener("click", function (e) {
      var t = e.target;
      var area = t.closest("[data-area]"); if (area) { openArea(area.getAttribute("data-area")); return; }
      var pr = t.closest("[data-project]"); if (pr) { openProject(pr.getAttribute("data-project")); return; }
      var chip = t.closest("[data-cat]"); if (chip) { state.filter = chip.getAttribute("data-cat"); renderProjects(); return; }
      var pt = t.closest("[data-p]"); if (pt) { showPractice(+pt.getAttribute("data-p")); return; }
      var gl = t.closest("[data-gallery]"); if (gl) { var g = state.data.gallery.find(function (x) { return x.id === gl.getAttribute("data-gallery"); }); if (g) zoom(safeUrl(g.image), g.caption); return; }
      if (t.closest("[data-zoom]")) { zoom(t.getAttribute("src")); return; }
      if (t.closest("[data-close]") || t.id === "modal") { closeModal(); return; }
      if (t.closest("#copy-link")) { copyLink(); return; }
      if (t.closest("#open-stage")) { openStage(); return; }
    });
    $("#stage-close").addEventListener("click", closeStage);
    $("#practice-tabs").addEventListener("keydown", function (e) {
      var n = state.data.practice.length;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); showPractice((practiceIdx + 1) % n, true); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); showPractice((practiceIdx - 1 + n) % n, true); }
    });
    ["#lab-fixed", "#lab-price", "#lab-var"].forEach(function (s) { $(s).addEventListener("input", updateLab); });
    // brilho que segue o cursor nos cards
    document.addEventListener("pointermove", function (e) {
      var c = e.target.closest && e.target.closest(".area-card"); if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
    // atualização ao vivo quando o painel salva em outra aba
    window.addEventListener("storage", function (e) {
      if (e.key === NLX.Store.KEY) { state.data = NLX.Store.load().data; renderContent(); toast("Conteúdo atualizado"); }
    });
    setInterval(function () { tickCountdown(); }, 30000);
    setInterval(function () { if (state.data.talks.length) renderTalks(); }, 120000);
    $("#year").textContent = new Date().getFullYear();
    $("#modal-content").parentNode.querySelector(".modal-close").innerHTML = icon("x");
  }

  function renderContent() {
    applyTexts(); renderAreas(); renderJourney(); renderPractice(); updateLab();
    renderProjects(); renderTalks(); renderMarket(); renderSignup(); renderForm(); renderAbout();
    $$("[data-icon]").forEach(function (el) { el.innerHTML = icon(el.getAttribute("data-icon")); });
    if (NLX.Experiences) NLX.Experiences.refresh(state.data);
  }

  /* ---------------- início ---------------- */
  function boot() {
    state.data = NLX.Store.load().data;
    renderContent();
    initNav(); initEvents(); initPresent(); initHeroCanvas();
    if (NLX.Experiences) NLX.Experiences.init(state.data);
    if (NLX.Nex) NLX.Nex.init();
    observeReveal(document);
    var loader = $("#loader");
    var reveal = function () { loader.classList.add("done"); $("#inicio").classList.add("ready"); };
    if (reduced) reveal(); else setTimeout(reveal, 1150);
    if (location.hash === "#apresentacao") setPresent(true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
