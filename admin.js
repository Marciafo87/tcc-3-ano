/* ==========================================================================
   NEXT LEVEL EXPERIENCE — Painel administrativo
   Editor guiado por esquemas: cada coleção (projetos, palestras, áreas...)
   é descrita em SCHEMAS e ganha automaticamente lista, cadastro, edição,
   exclusão, reordenação e validação.
   ========================================================================== */
(function () {
  "use strict";
  var NLX = window.NLX, Store = NLX.Store, esc = NLX.esc, icon = NLX.icon, safeUrl = NLX.safeUrl;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var db = null, source = "default", currentPage = "dashboard";
  var AUTH_KEY = "nlx:auth", SESSION_KEY = "nlx:session";

  /* ======================= utilidades ======================= */
  function toast(msg, kind) {
    var t = $("#toast"); t.textContent = msg; t.className = "toast show " + (kind || "ok");
    clearTimeout(t._h); t._h = setTimeout(function () { t.className = "toast"; }, kind === "err" ? 5000 : 2600);
  }
  function getPath(o, p) { return p.split(".").reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function setPath(o, p, v) {
    var ks = p.split("."), last = ks.pop();
    var t = ks.reduce(function (a, k) { if (a[k] == null) a[k] = /^\d+$/.test(k) ? [] : {}; return a[k]; }, o);
    t[last] = v;
  }
  function fmtTime(ts) { return ts ? new Date(ts).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"; }
  function kb(n) { return n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.round(n / 1024) + " KB"; }
  function download(name, text, type) {
    var b = new Blob([text], { type: type || "application/json" }), a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function confirmBox(text, yesLabel) {
    return new Promise(function (res) {
      var c = $("#confirm"); $("#confirm-text").textContent = text; $("#confirm-yes").textContent = yesLabel || "Confirmar";
      c.classList.add("open"); $("#confirm-no").focus();
      var done = function (v) { c.classList.remove("open"); $("#confirm-yes").onclick = $("#confirm-no").onclick = null; res(v); };
      $("#confirm-yes").onclick = function () { done(true); };
      $("#confirm-no").onclick = function () { done(false); };
    });
  }
  /* Aplica uma alteração e salva; se o salvamento falhar, desfaz. */
  function commit(mutate, msg) {
    var snap = JSON.stringify(db);
    try { mutate(); Store.save(db, msg); setSaveState(); toast(msg + " ✓"); return true; }
    catch (e) { db = JSON.parse(snap); toast(e.message || "Erro ao salvar.", "err"); return false; }
  }
  function setSaveState() { $("#save-state").textContent = "Salvo neste navegador · " + fmtTime(db.meta.updatedAt); }

  /* ======================= imagens ======================= */
  var IMG_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  var IMG_MAX_MB = 10;
  function processImage(file, maxDim) {
    return new Promise(function (resolve, reject) {
      if (!file) return reject(new Error("Nenhum arquivo selecionado."));
      if (IMG_TYPES.indexOf(file.type) < 0) return reject(new Error("Formato não suportado. Use JPG, PNG, WEBP ou GIF."));
      if (file.size > IMG_MAX_MB * 1048576) return reject(new Error("Imagem maior que " + IMG_MAX_MB + " MB. Escolha um arquivo menor."));
      var fr = new FileReader();
      fr.onerror = function () { reject(new Error("Não foi possível ler o arquivo.")); };
      fr.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error("O arquivo não parece ser uma imagem válida.")); };
        img.onload = function () {
          var s = Math.min(1, (maxDim || 1400) / Math.max(img.width, img.height));
          var c = document.createElement("canvas");
          c.width = Math.max(1, Math.round(img.width * s)); c.height = Math.max(1, Math.round(img.height * s));
          var g = c.getContext("2d"); g.fillStyle = "#15121D"; g.fillRect(0, 0, c.width, c.height);
          g.drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/jpeg", 0.8));
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  /* ======================= esquemas ======================= */
  var ICON_OPTS = function () { return NLX.iconNames.map(function (n) { return [n, n]; }); };
  var SECTION_OPTS = [["", "(nenhuma)"], ["formacao", "Nossa formação"], ["jornada", "Jornada"], ["pratica", "Gestão na prática"], ["simulador", "Simulador"], ["projetos", "Projetos"], ["palestras", "Palestras"], ["experiencias", "Experiências"], ["mercado", "Mercado"], ["inscricao", "Inscrição"], ["formulario", "Formulário"], ["sobre", "Sobre"]];
  var SCHEMAS = {
    areas: { singular: "área de conhecimento", title: function (i) { return i.name; }, sub: function (i) { return i.description; }, thumb: function (i) { return i.image; }, ic: function (i) { return i.icon; },
      fields: [
        { k: "name", label: "Nome", type: "text", required: true, full: true },
        { k: "icon", label: "Ícone", type: "select", options: ICON_OPTS },
        { k: "image", label: "Imagem (opcional, substitui o ícone)", type: "image", max: 600 },
        { k: "description", label: "Descrição", type: "textarea", required: true, full: true },
        { k: "practice", label: "Aplicação prática", type: "textarea", full: true },
        { k: "market", label: "Exemplo de utilização no mercado", type: "textarea", full: true }
      ] },
    journey: { singular: "etapa", title: function (i) { return (i.year === "2" ? "2º ano · " : "1º ano · ") + i.title; }, sub: function (i) { return i.text; }, ic: function () { return "flow"; },
      fields: [
        { k: "year", label: "Ano", type: "select", options: [["1", "Primeiro ano"], ["2", "Segundo ano"]], required: true },
        { k: "title", label: "Título da etapa", type: "text", required: true },
        { k: "text", label: "Descrição", type: "textarea", required: true, full: true }
      ] },
    practice: { singular: "situação", title: function (i) { return i.title; }, sub: function (i) { return i.concept; }, ic: function (i) { return i.icon; },
      fields: [
        { k: "title", label: "Título", type: "text", required: true },
        { k: "icon", label: "Ícone", type: "select", options: ICON_OPTS },
        { k: "concept", label: "Conceito de gestão", type: "text" },
        { k: "steps", label: "Passo a passo (um por linha, até 5)", type: "lines", full: true, required: true },
        { k: "example", label: "Exemplo da vida real", type: "textarea", full: true }
      ] },
    projects: { singular: "projeto", title: function (i) { return i.name; }, sub: function (i) { return (i.category || "Sem categoria") + " · " + (i.members || "Integrantes não informados"); }, thumb: function (i) { return i.cover; }, ic: function () { return "layers"; },
      fields: [
        { k: "name", label: "Nome do projeto", type: "text", required: true, full: true },
        { k: "category", label: "Categoria", type: "select", options: function () { return db.categories.map(function (c) { return [c, c]; }); }, required: true },
        { k: "members", label: "Integrantes", type: "text", help: "Separe os nomes por vírgula." },
        { k: "cover", label: "Imagem de capa", type: "image", max: 1400, full: true },
        { k: "description", label: "Descrição", type: "textarea", required: true, full: true },
        { k: "objective", label: "Objetivo", type: "textarea" },
        { k: "problem", label: "Problema identificado", type: "textarea" },
        { k: "solution", label: "Solução proposta", type: "textarea" },
        { k: "knowledge", label: "Conhecimentos aplicados", type: "textarea" },
        { k: "link", label: "Link ou demonstração (opcional)", type: "url", full: true },
        { k: "images", label: "Galeria de imagens do projeto", type: "images", max: 1200, full: true },
        { k: "demo", label: "Ocultar do site (rascunho)", type: "bool", full: true }
      ] },
    talks: { singular: "palestra", title: function (i) { return i.title; }, sub: function (i) { return [i.date && i.date.split("-").reverse().join("/"), i.start, i.speaker, i.place].filter(Boolean).join(" · "); }, thumb: function (i) { return i.photo; }, ic: function () { return "mic"; },
      sort: function (a, b) { return ((a.date || "9") + (a.start || "")).localeCompare((b.date || "9") + (b.start || "")); },
      fields: [
        { k: "title", label: "Nome da palestra / atividade", type: "text", required: true, full: true },
        { k: "speaker", label: "Palestrante", type: "text" },
        { k: "theme", label: "Tema", type: "text" },
        { k: "date", label: "Data", type: "date", required: true },
        { k: "start", label: "Horário de início", type: "time", required: true },
        { k: "duration", label: "Duração (minutos)", type: "number", min: 5, max: 600 },
        { k: "place", label: "Local", type: "text" },
        { k: "photo", label: "Foto do palestrante", type: "image", max: 500, full: true },
        { k: "description", label: "Descrição", type: "textarea", full: true }
      ] },
    gallery: { singular: "foto", title: function (i) { return i.caption || "Foto sem legenda"; }, sub: function () { return "Galeria"; }, thumb: function (i) { return i.image; }, ic: function () { return "image"; },
      fields: [
        { k: "image", label: "Imagem", type: "image", max: 1600, required: true, full: true },
        { k: "caption", label: "Legenda", type: "text", full: true }
      ] },
    quiz: { singular: "pergunta", title: function (i) { return i.question; }, sub: function (i) { return (i.topic || "") + " · resposta: " + ((i.options || [])[+i.correct] || "?"); }, ic: function () { return "bulb"; },
      fields: [
        { k: "question", label: "Pergunta", type: "textarea", required: true, full: true },
        { k: "topic", label: "Tema", type: "text" },
        { k: "correct", label: "Número da alternativa correta", type: "number", min: 1, max: 6, required: true, help: "1 = primeira linha, 2 = segunda...", offset: 1 },
        { k: "options", label: "Alternativas (uma por linha, de 2 a 6)", type: "lines", required: true, full: true },
        { k: "explain", label: "Explicação mostrada após a resposta", type: "textarea", full: true }
      ],
      validate: function (d) {
        if (d.options.length < 2 || d.options.length > 6) return "Cadastre de 2 a 6 alternativas.";
        if (!(+d.correct >= 0 && +d.correct < d.options.length)) return "A alternativa correta precisa estar entre 1 e " + d.options.length + ".";
      } },
    challenges: { singular: "desafio", title: function (i) { return i.title; }, sub: function (i) { return i.situation; }, ic: function () { return "branch"; },
      fields: [
        { k: "title", label: "Título", type: "text", required: true },
        { k: "situation", label: "Situação", type: "textarea", required: true, full: true },
        { k: "options", label: "Alternativas e consequências", type: "subitems", full: true, min: 2, max: 4,
          fields: [
            { k: "text", label: "Alternativa", type: "text", required: true, full: true },
            { k: "score", label: "Pontos", type: "select", options: [["0", "0 — decisão ruim"], ["1", "1 — razoável"], ["2", "2 — melhor decisão"]] },
            { k: "outcome", label: "Consequência", type: "textarea", required: true, full: true }
          ], blank: function () { return { text: "", score: 1, outcome: "" }; } }
      ] },
    profiles: { singular: "perfil", title: function (i) { return i.name; }, sub: function (i) { return "código: " + i.key; }, ic: function (i) { return i.icon; },
      fields: [
        { k: "key", label: "Código interno (sem espaços)", type: "text", required: true, help: "Usado para ligar as respostas ao perfil." },
        { k: "name", label: "Nome", type: "text", required: true },
        { k: "icon", label: "Ícone", type: "select", options: ICON_OPTS },
        { k: "description", label: "Descrição", type: "textarea", required: true, full: true },
        { k: "areas", label: "Áreas para explorar", type: "text", full: true }
      ] },
    profileQuestions: { singular: "pergunta de perfil", title: function (i) { return i.question; }, sub: function (i) { return (i.options || []).length + " alternativas"; }, ic: function () { return "star"; },
      fields: [
        { k: "question", label: "Pergunta", type: "text", required: true, full: true },
        { k: "options", label: "Alternativas", type: "subitems", full: true, min: 2, max: 6,
          fields: [
            { k: "text", label: "Alternativa", type: "text", required: true },
            { k: "profile", label: "Soma ponto para o perfil", type: "select", options: function () { return db.profiles.map(function (p) { return [p.key, p.name]; }); } }
          ], blank: function () { return { text: "", profile: (db.profiles[0] || {}).key || "" }; } }
      ] },
    careers: { singular: "possibilidade profissional", title: function (i) { return i.title; }, sub: function (i) { return i.description; }, ic: function (i) { return i.icon; },
      fields: [
        { k: "title", label: "Função", type: "text", required: true },
        { k: "icon", label: "Ícone", type: "select", options: ICON_OPTS },
        { k: "description", label: "Descrição breve", type: "textarea", required: true, full: true }
      ] },
    studies: { singular: "caminho de estudo", title: function (i) { return i.title; }, sub: function (i) { return i.description; }, ic: function () { return "compass"; },
      fields: [
        { k: "title", label: "Título", type: "text", required: true },
        { k: "description", label: "Descrição", type: "textarea", required: true, full: true }
      ] },
    nex: { singular: "resposta do NEX", title: function (i) { return i.keywords; }, sub: function (i) { return i.answer; }, ic: function () { return "chat"; },
      fields: [
        { k: "keywords", label: "Palavras-chave (separadas por vírgula, sem acento)", type: "text", required: true, full: true },
        { k: "answer", label: "Resposta", type: "textarea", required: true, full: true, help: "Marcadores automáticos: {projects}, {talks}, {form}." },
        { k: "target", label: "Botão leva para a seção", type: "select", options: SECTION_OPTS }
      ] },
    links: { singular: "link", title: function (i) { return i.label; }, sub: function (i) { return i.url; }, ic: function () { return "link"; },
      fields: [
        { k: "label", label: "Texto do link", type: "text", required: true },
        { k: "url", label: "Endereço (https://...)", type: "url", required: true }
      ] }
  };

  /* ======================= campos ======================= */
  function optList(f) { return typeof f.options === "function" ? f.options() : f.options; }
  function fieldHTML(f, draft, base) {
    var path = (base ? base + "." : "") + f.k, v = getPath(draft, path), id = "f-" + path.replace(/\./g, "-");
    var lbl = '<label for="' + id + '">' + esc(f.label) + (f.required ? ' <span class="req">*</span>' : "") + "</label>";
    var help = f.help ? '<span class="help">' + esc(f.help) + "</span>" : "";
    var wrap = function (inner, noLabel) { return '<div class="f' + (f.full ? " full" : "") + '" data-field="' + esc(path) + '">' + (noLabel ? "" : lbl) + inner + help + "</div>"; };
    var attr = ' id="' + id + '" data-path="' + esc(path) + '" data-type="' + f.type + '"' + (f.required ? " required" : "");
    switch (f.type) {
      case "textarea": return wrap("<textarea" + attr + ">" + esc(v) + "</textarea>");
      case "lines": return wrap("<textarea" + attr + ' rows="5">' + esc((v || []).join("\n")) + "</textarea>");
      case "number": return wrap('<input type="number"' + attr + (f.min != null ? ' min="' + f.min + '"' : "") + (f.max != null ? ' max="' + f.max + '"' : "") + ' value="' + esc(v == null || v === "" ? "" : (+v + (f.offset || 0))) + '">');
      case "select":
        var opts = optList(f), cur = v == null ? "" : String(v);
        if (cur && !opts.some(function (o) { return String(o[0]) === cur; })) opts = opts.concat([[cur, cur]]);
        return wrap("<select" + attr + ">" + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === cur ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select>");
      case "bool": return wrap('<label class="check"><input type="checkbox"' + attr + (v ? " checked" : "") + "> " + esc(f.label) + "</label>", true);
      case "image":
        var src = safeUrl(v);
        return wrap('<div class="img-field"><div class="img-prev">' + (src ? '<img src="' + esc(src) + '" alt="Prévia">' : "Sem imagem") + "</div>" +
          '<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden data-img="' + esc(path) + '" data-max="' + (f.max || 1400) + '" id="' + id + '">' +
          '<button class="btn ghost sm" type="button" data-pick="' + id + '">' + (src ? "Substituir" : "Selecionar imagem") + "</button>" +
          (src ? '<button class="btn danger sm" type="button" data-img-remove="' + esc(path) + '">Remover</button>' : "") + "</div>" +
          '<span class="help">JPG, PNG, WEBP ou GIF até ' + IMG_MAX_MB + " MB. A imagem é otimizada automaticamente.</span>");
      case "images":
        var arr = v || [];
        return wrap('<div class="imgs-list">' + arr.map(function (s, i) {
          return '<div class="img-prev"><img src="' + esc(safeUrl(s)) + '" alt="Imagem ' + (i + 1) + '"><button type="button" data-imgs-remove="' + esc(path) + '" data-i="' + i + '" aria-label="Remover imagem ' + (i + 1) + '">✕</button></div>';
        }).join("") + "</div>" +
          '<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden data-imgs="' + esc(path) + '" data-max="' + (f.max || 1200) + '" id="' + id + '">' +
          '<div><button class="btn ghost sm" type="button" data-pick="' + id + '">Adicionar imagens</button></div>');
      case "subitems":
        var items = v || [];
        return wrap('<div class="sub">' + items.map(function (it, i) {
          return '<div class="sub-row"><div class="form-grid">' + f.fields.map(function (sf) { return fieldHTML(sf, draft, path + "." + i); }).join("") + "</div>" +
            '<button class="icon-btn del" type="button" data-sub-remove="' + esc(path) + '" data-i="' + i + '" aria-label="Remover alternativa"' + (items.length <= (f.min || 0) ? " disabled" : "") + ">✕</button></div>";
        }).join("") + (items.length < (f.max || 10) ? '<div><button class="btn ghost sm" type="button" data-sub-add="' + esc(path) + '">+ Adicionar alternativa</button></div>' : "") + "</div>", false);
      default:
        return wrap('<input type="' + (f.type === "url" ? "url" : f.type === "date" ? "date" : f.type === "time" ? "time" : "text") + '"' + attr + ' value="' + esc(v) + '"' + (f.type === "url" ? ' placeholder="https://"' : "") + ">");
    }
  }
  function readInput(el, draft, schemaFields) {
    var p = el.getAttribute("data-path"), t = el.getAttribute("data-type");
    var f = findField(schemaFields, p);
    var v;
    if (t === "bool") v = el.checked;
    else if (t === "lines") v = el.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    else if (t === "number") v = el.value === "" ? "" : +el.value - ((f && f.offset) || 0);
    else if (t === "select" && f && f.k === "score") v = +el.value;
    else v = el.value;
    setPath(draft, p, v);
  }
  function findField(fields, path) {
    var parts = path.split(".").filter(function (x) { return !/^\d+$/.test(x); });
    var list = fields, f = null;
    parts.forEach(function (k) { f = (list || []).find(function (x) { return x.k === k; }); list = f && f.fields; });
    return f;
  }
  function validateDraft(fields, draft, base, errors) {
    fields.forEach(function (f) {
      var path = (base ? base + "." : "") + f.k, v = getPath(draft, path);
      if (f.type === "subitems") {
        (v || []).forEach(function (_, i) { validateDraft(f.fields, draft, path + "." + i, errors); });
        if ((v || []).length < (f.min || 0)) errors.push([path, "Mínimo de " + f.min + " itens."]);
        return;
      }
      var empty = v == null || v === "" || (Array.isArray(v) && !v.length);
      if (f.required && empty) errors.push([path, "Campo obrigatório."]);
      else if (f.type === "url" && !empty && !/^https?:\/\/[^\s]+\.[^\s]+/i.test(v)) errors.push([path, "Informe um endereço completo, começando com https://"]);
      else if (f.type === "number" && !empty && ((f.min != null && v + (f.offset || 0) < f.min) || (f.max != null && v + (f.offset || 0) > f.max))) errors.push([path, "Valor entre " + f.min + " e " + f.max + "."]);
    });
    return errors;
  }

  /* ======================= gaveta de edição ======================= */
  var ed = null; // { path, index, draft, schema, title }
  function openEditor(colPath, index) {
    var schema = SCHEMAS[colPath.split(".").pop() === "social" || colPath === "links.extra" ? "links" : colPath];
    var list = getPath(db, colPath);
    var draft = index == null ? blankItem(schema) : Store.clone(list[index]);
    ed = { path: colPath, index: index, draft: draft, schema: schema };
    $("#drawer-title").textContent = (index == null ? "Cadastrar " : "Editar ") + schema.singular;
    renderEditor();
    $("#drawer").classList.add("open");
    setTimeout(function () { var first = $("#drawer-body input:not([type=file]), #drawer-body textarea, #drawer-body select"); if (first) first.focus(); }, 50);
  }
  function blankItem(schema) {
    var o = { id: Store.uid("i") };
    schema.fields.forEach(function (f) {
      if (f.type === "images" || f.type === "lines") o[f.k] = [];
      else if (f.type === "subitems") { o[f.k] = []; for (var i = 0; i < (f.min || 0); i++) o[f.k].push(f.blank()); }
      else if (f.type === "bool") o[f.k] = false;
      else if (f.type === "select") { var op = optList(f); o[f.k] = op.length ? op[0][0] : ""; }
      else o[f.k] = "";
    });
    if (schema === SCHEMAS.quiz) { o.options = ["", ""]; o.correct = 0; }
    if (schema === SCHEMAS.talks) o.duration = 30;
    return o;
  }
  function renderEditor() {
    var body = $("#drawer-body"), scroll = body.scrollTop;
    body.innerHTML = '<div class="form-grid">' + ed.schema.fields.map(function (f) { return fieldHTML(f, ed.draft, ""); }).join("") + "</div>" +
      '<p class="hint" style="margin-top:16px">Campos com <span style="color:var(--neon)">*</span> são obrigatórios.</p>';
    body.scrollTop = scroll;
  }
  function closeEditor() { $("#drawer").classList.remove("open"); ed = null; }
  function saveEditor(e) {
    e.preventDefault();
    $$("#drawer-body [data-path]").forEach(function (el) { readInput(el, ed.draft, ed.schema.fields); });
    $$("#drawer-body .f.invalid").forEach(function (el) { el.classList.remove("invalid"); var x = $(".err", el); if (x) x.remove(); });
    var errors = validateDraft(ed.schema.fields, ed.draft, "", []);
    if (!errors.length && ed.schema.validate) { var m = ed.schema.validate(ed.draft); if (m) errors.push(["", m]); }
    if (ed.schema === SCHEMAS.profiles && !/^[a-z0-9_-]+$/i.test(ed.draft.key)) errors.push(["key", "Use apenas letras, números, - ou _."]);
    if (errors.length) {
      errors.forEach(function (er) {
        var box = er[0] && $('#drawer-body [data-field="' + er[0] + '"]');
        if (box) { box.classList.add("invalid"); box.insertAdjacentHTML("beforeend", '<span class="err">' + esc(er[1]) + "</span>"); }
      });
      var firstBad = $("#drawer-body .f.invalid");
      if (firstBad) firstBad.scrollIntoView({ block: "center" });
      toast(errors[0][1], "err"); return;
    }
    var name = ed.schema.title(ed.draft) || ed.schema.singular, path = ed.path, idx = ed.index, draft = ed.draft;
    var ok = commit(function () {
      var list = getPath(db, path);
      if (idx == null) list.push(draft); else list[idx] = draft;
      if (ed.schema.sort) list.sort(ed.schema.sort);
    }, (idx == null ? "Cadastrado: " : "Atualizado: ") + String(name).slice(0, 60));
    if (ok) { closeEditor(); renderPage(); }
  }
  function editorEvents() {
    var body = $("#drawer-body");
    body.addEventListener("input", function (e) { if (e.target.hasAttribute("data-path")) readInput(e.target, ed.draft, ed.schema.fields); });
    body.addEventListener("change", function (e) {
      var t = e.target;
      if (t.hasAttribute("data-path")) readInput(t, ed.draft, ed.schema.fields);
      if (t.hasAttribute("data-img") && t.files[0]) {
        var p = t.getAttribute("data-img");
        processImage(t.files[0], +t.getAttribute("data-max")).then(function (url) { syncInputs(); setPath(ed.draft, p, url); renderEditor(); toast("Imagem carregada. Clique em Salvar para confirmar."); })
          .catch(function (er) { toast(er.message, "err"); t.value = ""; });
      }
      if (t.hasAttribute("data-imgs") && t.files.length) {
        var pp = t.getAttribute("data-imgs"), files = Array.prototype.slice.call(t.files);
        Promise.all(files.map(function (f) { return processImage(f, +t.getAttribute("data-max")).catch(function (er) { toast(f.name + ": " + er.message, "err"); return null; }); }))
          .then(function (urls) { syncInputs(); var arr = getPath(ed.draft, pp) || []; urls.filter(Boolean).forEach(function (u) { arr.push(u); }); setPath(ed.draft, pp, arr); renderEditor(); });
      }
    });
    body.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.hasAttribute("data-pick")) { document.getElementById(t.getAttribute("data-pick")).click(); return; }
      syncInputs();
      if (t.hasAttribute("data-img-remove")) { setPath(ed.draft, t.getAttribute("data-img-remove"), ""); renderEditor(); }
      if (t.hasAttribute("data-imgs-remove")) { getPath(ed.draft, t.getAttribute("data-imgs-remove")).splice(+t.getAttribute("data-i"), 1); renderEditor(); }
      if (t.hasAttribute("data-sub-add")) {
        var sp = t.getAttribute("data-sub-add"), sf = findField(ed.schema.fields, sp);
        var arr = getPath(ed.draft, sp) || []; arr.push(sf.blank()); setPath(ed.draft, sp, arr); renderEditor();
      }
      if (t.hasAttribute("data-sub-remove")) { getPath(ed.draft, t.getAttribute("data-sub-remove")).splice(+t.getAttribute("data-i"), 1); renderEditor(); }
    });
    function syncInputs() { $$("#drawer-body [data-path]").forEach(function (el) { readInput(el, ed.draft, ed.schema.fields); }); }
    $("#drawer-form").addEventListener("submit", saveEditor);
    $$("[data-drawer-close]").forEach(function (b) { b.addEventListener("click", closeEditor); });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if ($("#confirm").classList.contains("open")) { $("#confirm-no").click(); return; }
      if ($("#drawer").classList.contains("open")) closeEditor();
    });
  }

  /* ======================= lista de coleção ======================= */
  function listBlock(path, title, desc, opts) {
    opts = opts || {};
    var schemaKey = path === "links.extra" || path === "site.social" ? "links" : path;
    var schema = SCHEMAS[schemaKey], list = getPath(db, path) || [];
    var rows = list.map(function (it, i) {
      var th = schema.thumb ? safeUrl(schema.thumb(it)) : "";
      return '<div class="item"><div class="thumb">' + (th ? '<img src="' + esc(th) + '" alt="">' : icon(schema.ic ? schema.ic(it) : "spark")) + "</div>" +
        '<div class="txt"><b>' + esc(schema.title(it) || "(sem título)") + (it.demo ? '<span class="tag">OCULTO</span>' : "") + "</b><small>" + esc(schema.sub ? schema.sub(it) : "") + "</small></div>" +
        '<div class="acts">' + (schema.sort ? "" : '<button class="icon-btn" type="button" data-move="' + path + '" data-i="' + i + '" data-d="-1" aria-label="Mover para cima"' + (i === 0 ? " disabled" : "") + '>↑</button><button class="icon-btn" type="button" data-move="' + path + '" data-i="' + i + '" data-d="1" aria-label="Mover para baixo"' + (i === list.length - 1 ? " disabled" : "") + ">↓</button>") +
        '<button class="btn ghost sm" type="button" data-edit="' + path + '" data-i="' + i + '">Editar</button>' +
        '<button class="icon-btn del" type="button" data-del="' + path + '" data-i="' + i + '" aria-label="Excluir">🗑</button></div></div>';
    }).join("");
    return '<div class="section-block" id="blk-' + path.replace(/\./g, "-") + '"><div class="block-head"><div><h2>' + esc(title) + " <span class=\"hint\">(" + list.length + ")</span></h2>" + (desc ? '<p class="hint">' + desc + "</p>" : "") + "</div>" +
      '<button class="btn primary" type="button" data-add="' + path + '">+ ' + esc(opts.addLabel || ("Cadastrar " + schema.singular)) + "</button></div>" +
      '<div class="items">' + (rows || '<div class="empty-list">Nenhum item cadastrado ainda.</div>') + "</div></div>";
  }

  /* ======================= formulários simples (objeto) ======================= */
  function objectForm(id, title, desc, base, fields, saveLabel) {
    var draft = {}; setPath(draft, "x", Store.clone(getPath(db, base)));
    return '<form novalidate class="card section-block" data-objform="' + id + '" data-base="' + base + '"><h2>' + esc(title) + "</h2>" + (desc ? '<p class="hint">' + desc + "</p>" : "") +
      '<div class="form-grid" style="margin-top:14px">' + fields.map(function (f) { return fieldHTML(f, draft, "x"); }).join("") + "</div>" +
      '<div class="actions-row"><button class="btn primary" type="submit">' + esc(saveLabel || "Salvar alterações") + "</button></div></form>";
  }
  var OBJFORMS = {};
  function registerObjForm(id, fields, after) { OBJFORMS[id] = { fields: fields, after: after }; }

  /* ======================= páginas ======================= */
  var TEXT_GROUPS = [
    ["Abertura", [["heroKicker", "Selo acima do título"], ["heroTitle", "Título principal", 1], ["heroSubtitle", "Texto complementar", 1], ["ctaPrimary", "Botão 1"], ["ctaSecondary", "Botão 2"]]],
    ["Nossa formação", [["formacaoTitle", "Título"], ["formacaoLead", "Introdução", 1], ["formacaoNote", "Observação sobre a grade", 1]]],
    ["Jornada", [["jornadaTitle", "Título"], ["jornadaLead", "Introdução", 1]]],
    ["Gestão na prática", [["praticaTitle", "Título"], ["praticaLead", "Introdução", 1]]],
    ["Simulador", [["simTitle", "Título"], ["simLead", "Introdução", 1], ["simDisclaimer", "Aviso de simulação educativa", 1]]],
    ["Projetos", [["projetosTitle", "Título"], ["projetosLead", "Introdução", 1]]],
    ["Palestras", [["palestrasTitle", "Título"], ["palestrasLead", "Introdução", 1], ["palestrasEmpty", "Mensagem sem programação", 1]]],
    ["Experiências", [["expTitle", "Título"], ["expLead", "Introdução", 1]]],
    ["Mercado de trabalho", [["mercadoTitle", "Título"], ["mercadoLead", "Introdução", 1], ["mercadoDisclaimer", "Aviso", 1]]],
    ["Inscrição", [["inscricaoTitle", "Título"], ["inscricaoText", "Texto", 1], ["inscricaoButton", "Texto do botão"], ["inscricaoEmpty", "Texto quando não há link"]]],
    ["Formulário", [["formTitle", "Título"], ["formText", "Texto", 1], ["formEmpty", "Mensagem sem link", 1]]],
    ["Sobre o projeto", [["sobreTitle", "Título"], ["sobreText", "Texto", 1], ["galeriaTitle", "Título da galeria"], ["galeriaEmpty", "Mensagem de galeria vazia", 1]]],
    ["Encerramento", [["closingTitle", "Título", 1], ["closingText", "Texto", 1], ["closingThanks", "Agradecimento"]]]
  ];
  var SITE_FIELDS = [
    { k: "name", label: "Nome do projeto", type: "text", required: true },
    { k: "slogan", label: "Slogan", type: "text", full: true },
    { k: "institution", label: "Instituição", type: "text" },
    { k: "course", label: "Curso", type: "text" },
    { k: "classGroup", label: "Turma", type: "text" },
    { k: "eventDate", label: "Data da apresentação (texto livre)", type: "text", help: "Ex.: 25 de novembro de 2026, às 19h" },
    { k: "eventPlace", label: "Local da apresentação", type: "text" },
    { k: "contact", label: "Contato (e-mail ou telefone)", type: "text" }
  ];

  var PAGES = [
    ["dashboard", "Dashboard", "chart"],
    ["identidade", "Identidade e textos", "spark"],
    ["formacao", "Formação", "compass"],
    ["jornada", "Jornada dos 2 anos", "flow"],
    ["pratica", "Gestão na prática", "building"],
    ["projetos", "Projetos", "layers"],
    ["palestras", "Palestras", "mic"],
    ["galeria", "Imagens e galeria", "image"],
    ["experiencias", "Experiências", "bulb"],
    ["mercado", "Mercado de trabalho", "briefcase"],
    ["links", "Inscrição, Forms e links", "qr"],
    ["backup", "Backup e publicação", "copy"],
    ["seguranca", "Segurança", "lock"]
  ];
  var expTab = "simulador";

  function page(id) {
    var P = {
      dashboard: function () {
        var real = db.projects.filter(function (p) { return !p.demo; }).length, demo = db.projects.length - real;
        var content = db.areas.length + db.journey.length + db.practice.length + db.quiz.length + db.challenges.length + db.profileQuestions.length + db.careers.length + db.studies.length + db.nex.length + db.gallery.length;
        var form = !!safeUrl(db.links.googleForm), links = (db.links.extra || []).length + (db.site.social || []).length;
        var srcTxt = { local: "Conteúdo salvo neste navegador", published: "Conteúdo publicado (data/content.js)", "default": "Conteúdo demonstrativo padrão" }[source];
        return '<div class="grid stats">' +
          '<div class="card stat' + (real ? " ok" : " warn") + '"><b>' + real + "</b><span>projetos no site" + (demo ? " · " + demo + " oculto(s)" : "") + "</span></div>" +
          '<div class="card stat' + (db.talks.length ? " ok" : " warn") + '"><b>' + db.talks.length + "</b><span>palestras cadastradas</span></div>" +
          '<div class="card stat"><b>' + content + "</b><span>conteúdos cadastrados</span></div>" +
          '<div class="card stat' + (form ? " ok" : " warn") + '"><b>' + (form ? "OK" : "—") + "</b><span>Google Forms " + (form ? "configurado" : "não configurado") + "</span></div>" +
          '<div class="card stat"><b>' + links + "</b><span>links extras e redes</span></div>" +
          '<div class="card stat"><b>' + kb(Store.usageBytes()) + "</b><span>armazenamento usado</span></div></div>" +
          '<div class="card section-block"><h2>Atalhos</h2><div class="shortcuts">' +
          '<button class="btn primary sm" data-go="projetos" data-then-add="projects">+ Novo projeto</button><button class="btn primary sm" data-go="palestras" data-then-add="talks">+ Nova palestra</button>' +
          '<button class="btn ghost sm" data-go="links">Configurar Google Forms</button><button class="btn ghost sm" data-go="identidade">Editar textos</button><button class="btn ghost sm" data-go="backup">Fazer backup</button>' +
          '<a class="btn ghost sm" href="../index.html#apresentacao" target="_blank" rel="noopener">Abrir no modo apresentação ↗</a></div></div>' +
          '<div class="card section-block"><h2>Pendências</h2><ul class="hint" style="margin:8px 0 0;padding-left:18px">' +
          [!form && "Cadastrar o link do Google Forms.", !safeUrl(db.links.signup) && "Cadastrar o link de inscrição (sem ele, o botão usa o link do Google Forms).", !real && "Cadastrar os projetos reais da turma.", demo && demo + " projeto(s) oculto(s) do site (rascunho).", !db.talks.length && "Cadastrar a programação de palestras.",
 !db.site.institution && "Informar o nome da instituição.", !db.site.eventDate && "Informar data e local da apresentação."]
            .filter(Boolean).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>" +
          '<div class="card section-block"><h2>Últimas alterações</h2><p class="hint">Origem atual: ' + srcTxt + "</p>" +
          ((db.meta.log || []).length ? '<ul class="log">' + db.meta.log.slice(0, 10).map(function (l) { return "<li><span>" + esc(l.action) + "</span><time>" + fmtTime(l.at) + "</time></li>"; }).join("") + "</ul>" : '<p class="hint" style="margin-top:8px">Nenhuma alteração feita ainda.</p>') + "</div>";
      },
      identidade: function () {
        registerObjForm("site", SITE_FIELDS);
        var html = objectForm("site", "Identidade e informações institucionais", "Aparecem no topo, no rodapé e na seção Sobre. Campos vazios não são exibidos.", "site", SITE_FIELDS);
        TEXT_GROUPS.forEach(function (g, gi) {
          var fields = g[1].map(function (t) { return { k: t[0], label: t[1], type: t[2] ? "textarea" : "text", full: !!t[2] || true }; });
          registerObjForm("texts" + gi, fields);
          html += objectForm("texts" + gi, "Textos · " + g[0], "", "texts", fields);
        });
        return html + listBlock("site.social", "Redes sociais", "Exibidas no rodapé, quando cadastradas.", { addLabel: "Adicionar rede social" });
      },
      formacao: function () {
        return '<p class="hint">Áreas apresentadas na seção “Do conhecimento à prática”. Não afirme que fazem parte da grade oficial sem confirmação — ajuste a observação em Identidade e textos.</p>' +
          listBlock("areas", "Áreas de conhecimento", "Toque em Editar para mudar descrição, aplicação prática, exemplo, ícone ou imagem.");
      },
      jornada: function () {
        var f = [{ k: "year1", label: "Resumo do primeiro ano", type: "textarea", full: true }, { k: "year2", label: "Resumo do segundo ano", type: "textarea", full: true }];
        registerObjForm("jintro", f);
        return objectForm("jintro", "Resumo de cada ano", "", "journeyIntro", f) +
          listBlock("journey", "Etapas da linha do tempo", "Etapas exibidas na linha do tempo de cada ano.");
      },
      pratica: function () { return listBlock("practice", "Situações de gestão", "Cada situação mostra um passo a passo animado e um exemplo da vida real."); },
      projetos: function () {
        var f = [{ k: "categories", label: "Categorias (uma por linha)", type: "lines", full: true }];
        return listBlock("projects", "Projetos dos estudantes", "Projetos marcados como OCULTO não aparecem no site.") +
          '<form novalidate class="card section-block" data-catform><h2>Categorias</h2><div class="form-grid" style="margin-top:12px">' + fieldHTML(f[0], { x: db }, "x") + '</div><div class="actions-row"><button class="btn primary" type="submit">Salvar categorias</button></div></form>';
      },
      palestras: function () { return listBlock("talks", "Programação", "Ordenada automaticamente por data e horário. A próxima atividade ganha destaque no site."); },
      galeria: function () {
        var used = Store.usageBytes(), cap = 5 * 1048576, pct = Math.min(100, Math.round((used / cap) * 100));
        return '<div class="card"><h2>Armazenamento de imagens</h2><p class="hint">As imagens ficam salvas neste navegador e são reduzidas automaticamente. O limite típico é de cerca de 5 MB.</p>' +
          '<div class="meter"><i style="width:' + pct + '%"></i></div><p class="hint">' + kb(used) + " usados (aprox. " + pct + "%)" + (pct > 80 ? " · <b style=\"color:var(--warn)\">Quase cheio: remova imagens que não usa.</b>" : "") + "</p></div>" +
          listBlock("gallery", "Galeria multimídia", "Fotos exibidas na seção Sobre o projeto.") +
          '<div class="card section-block"><h2>Outras imagens</h2><p class="hint">Capas e fotos de projetos, palestrantes e áreas são gerenciadas dentro de cada cadastro (botões Selecionar, Substituir e Remover).</p></div>';
      },
      experiencias: function () {
        var tabs = [["simulador", "Simulador"], ["quiz", "Quiz"], ["challenges", "Desafio empresarial"], ["profiles", "Perfis"], ["profileQuestions", "Perguntas de perfil"], ["nex", "Assistente NEX"]];
        var h = '<div class="tabs">' + tabs.map(function (t) { return '<button type="button" data-exptab="' + t[0] + '" class="' + (expTab === t[0] ? "on" : "") + '">' + t[1] + "</button>"; }).join("") + "</div>";
        if (expTab === "simulador") {
          var f = [{ k: "company", label: "Nome da empresa fictícia", type: "text", required: true }, { k: "startCash", label: "Caixa inicial (R$)", type: "number", min: 1000, max: 10000000 }, { k: "intro", label: "Apresentação da situação", type: "textarea", full: true }];
          registerObjForm("sim", f);
          return h + objectForm("sim", "Simulador “Você é o gestor”", "", "simulator", f) +
            '<form novalidate class="card section-block" data-simjson><h2>Rodadas (editor avançado)</h2><p class="hint">Formato JSON. Cada rodada tem title, situation e options (2 a 4). Cada opção: text, cash (R$), effects ({clientes, equipe, processos, marca} de -30 a 30), concept e feedback. Em caso de erro, nada é salvo.</p>' +
            '<textarea class="code" id="sim-json" spellcheck="false">' + esc(JSON.stringify(db.simulator.rounds, null, 2)) + '</textarea><div class="actions-row"><button class="btn primary" type="submit">Validar e salvar rodadas</button></div></form>';
        }
        var titles = { quiz: "Perguntas do quiz", challenges: "Desafios empresariais", profiles: "Perfis", profileQuestions: "Perguntas do Descubra seu Perfil", nex: "Respostas do assistente NEX" };
        return h + listBlock(expTab, titles[expTab], expTab === "profiles" ? "Se alterar o código de um perfil, revise as perguntas que apontam para ele." : "");
      },
      mercado: function () { return listBlock("careers", "Possibilidades profissionais", "Não prometa emprego ou salário: descreva apenas as funções.") + listBlock("studies", "Continuidade dos estudos", ""); },
      links: function () {
        var url = safeUrl(db.links.googleForm), qr = "";
        try { qr = url ? NLX.QR.svg(url) : ""; } catch (e) { qr = ""; }
        var isForm = /^https:\/\/(docs\.google\.com\/forms|forms\.gle\/)/i.test(url);
        return '<form novalidate class="card" data-gform><h2>Formulário do Google (obrigatório)</h2><p class="hint">Cole o link de compartilhamento do Google Forms (botão Enviar → ícone de link). O QR Code é gerado automaticamente.</p>' +
          '<div class="form-grid" style="margin-top:14px"><div class="f full" data-field="gform"><label for="gform">Link do formulário</label><input id="gform" type="url" placeholder="https://forms.gle/..." value="' + esc(db.links.googleForm) + '"></div></div>' +
          '<div class="actions-row"><button class="btn primary" type="submit">Salvar link</button>' + (url ? '<a class="btn ghost" href="' + esc(url) + '" target="_blank" rel="noopener">Testar link ↗</a><button class="btn danger" type="button" data-gform-clear>Remover link</button>' : "") + "</div>" +
          (url ? '<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin-top:18px"><div class="qr-mini">' + qr + '</div><div class="hint" style="max-width:420px">' + (isForm ? "" : '<p style="color:var(--warn)">Atenção: este endereço não parece ser do Google Forms. Confira se é o link correto.</p>') +
            "<p>Teste antes do evento: aponte a câmera de um celular para este QR Code e confirme que o formulário abre.</p><button class=\"btn ghost sm\" type=\"button\" data-qr-png>Baixar QR Code em PNG</button></div></div>" : "") + "</form>" +
          '<form novalidate class="card section-block" data-signup><h2>Botão de inscrição</h2><p class="hint">Link aberto pelo botão da seção Inscrição. Se ficar vazio, o botão usa o link do Google Forms acima.</p>' +
          '<div class="form-grid" style="margin-top:14px"><div class="f full" data-field="signup"><label for="signup">Link de inscrição</label><input id="signup" type="url" placeholder="https://forms.gle/..." value="' + esc(db.links.signup || "") + '"></div></div>' +
          '<div class="actions-row"><button class="btn primary" type="submit">Salvar link de inscrição</button>' + (safeUrl(db.links.signup) ? '<a class="btn ghost" href="' + esc(safeUrl(db.links.signup)) + '" target="_blank" rel="noopener">Testar link ↗</a>' : "") + "</div></form>" +
          listBlock("links.extra", "Links externos", "Aparecem na seção Sobre o projeto.", { addLabel: "Adicionar link" });
      },
      backup: function () {
        return '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">' +
          '<div class="card"><h2>Exportar backup</h2><p class="hint">Baixa um arquivo .json com todo o conteúdo, inclusive imagens. Faça isso sempre depois de cadastrar conteúdos importantes.</p><div class="actions-row"><button class="btn primary" data-act="export">Exportar backup JSON</button></div></div>' +
          '<div class="card"><h2>Importar backup</h2><p class="hint">Substitui todo o conteúdo deste navegador pelo conteúdo do arquivo. Útil para levar o conteúdo para outro computador.</p><div class="actions-row"><button class="btn ghost" data-act="import">Importar backup JSON</button></div></div>' +
          '<div class="card"><h2>Publicar para todos os visitantes</h2><p class="hint">O conteúdo do painel fica salvo só neste navegador. Para que outros computadores e a hospedagem vejam as alterações, gere o arquivo <b>content.js</b> e substitua o arquivo <code>data/content.js</code> do projeto por ele.</p><div class="actions-row"><button class="btn primary" data-act="publish">Gerar arquivo de publicação</button></div></div>' +
          '<div class="card"><h2>Restaurar dados demonstrativos</h2><p class="hint">Apaga o conteúdo salvo neste navegador e volta ao conteúdo de exemplo. Faça um backup antes.</p><div class="actions-row"><button class="btn danger" data-act="restore">Restaurar demonstração</button></div></div></div>';
      },
      seguranca: function () {
        var hasCrypto = cryptoOK();
        return '<div class="card"><h2>Como funciona a proteção deste painel</h2><div class="hint" style="margin-top:8px;display:grid;gap:8px">' +
          "<p>• A senha é transformada em um resumo criptográfico (PBKDF2 com SHA-256 e sal aleatório) e nunca é guardada em texto puro.</p>" +
          "<p>• <b style=\"color:#fff\">Limitação importante:</b> este é um site estático, sem servidor. A senha impede o acesso casual de visitantes, mas não é uma autenticação segura: qualquer pessoa com acesso técnico ao navegador ou aos arquivos pode alterar o conteúdo salvo.</p>" +
          "<p>• Os visitantes nunca alteram o site publicado: as edições do painel ficam neste navegador até você gerar e publicar o arquivo content.js.</p>" +
          "<p>• Para autenticação real (vários administradores, acesso de qualquer lugar), será preciso um backend — veja a seção Hospedagem no README.</p></div></div>" +
          (hasCrypto ? '<form novalidate class="card section-block" data-pass><h2>Alterar senha</h2><div class="form-grid" style="margin-top:12px"><div class="f"><label for="np1">Nova senha (mínimo 6 caracteres)</label><input id="np1" type="password" minlength="6" autocomplete="new-password"></div><div class="f"><label for="np2">Confirme</label><input id="np2" type="password" minlength="6" autocomplete="new-password"></div></div><div class="actions-row"><button class="btn primary" type="submit">Alterar senha</button></div></form>'
            : '<div class="card section-block"><p class="hint" style="color:var(--warn)">Este navegador não oferece criptografia neste modo de abertura, então a senha está desativada. Abra o painel pelo arquivo INICIAR-SITE.bat (endereço http://localhost) no Chrome ou Edge.</p></div>');
      }
    };
    return P[id]();
  }

  function renderNav() {
    $("#side-nav").innerHTML = PAGES.map(function (p) { return '<button type="button" data-page="' + p[0] + '" class="' + (currentPage === p[0] ? "active" : "") + '">' + icon(p[2]) + esc(p[1]) + "</button>"; }).join("");
  }
  function renderPage() {
    renderNav();
    var p = PAGES.find(function (x) { return x[0] === currentPage; });
    $("#page-title").textContent = p[1];
    $("#page").innerHTML = page(currentPage);
  }
  function go(id) { currentPage = id; renderPage(); $("#side").classList.remove("open"); window.scrollTo(0, 0); try { history.replaceState(null, "", "#" + id); } catch (e) {} }

  /* ======================= ações da página ======================= */
  function pageEvents() {
    $("#side-nav").addEventListener("click", function (e) { var b = e.target.closest("[data-page]"); if (b) go(b.getAttribute("data-page")); });
    $("#side-toggle").addEventListener("click", function () { $("#side").classList.toggle("open"); });
    var pg = $("#page");
    pg.addEventListener("click", function (e) {
      var b = e.target.closest("button, a"); if (!b) return;
      var a;
      if ((a = b.getAttribute("data-go"))) { go(a); var then = b.getAttribute("data-then-add"); if (then) openEditor(then, null); return; }
      if ((a = b.getAttribute("data-add"))) { openEditor(a, null); return; }
      if ((a = b.getAttribute("data-edit"))) { openEditor(a, +b.getAttribute("data-i")); return; }
      if ((a = b.getAttribute("data-exptab"))) { expTab = a; renderPage(); return; }
      if ((a = b.getAttribute("data-move"))) {
        var i = +b.getAttribute("data-i"), d = +b.getAttribute("data-d"), list = getPath(db, a);
        commit(function () { var t = list[i]; list[i] = list[i + d]; list[i + d] = t; }, "Ordem alterada");
        renderPage(); return;
      }
      if ((a = b.getAttribute("data-del"))) {
        var idx = +b.getAttribute("data-i"), path = a, item = getPath(db, path)[idx];
        var schema = SCHEMAS[path === "links.extra" || path === "site.social" ? "links" : path];
        confirmBox("Excluir “" + (schema.title(item) || "item") + "”? Esta ação não pode ser desfeita (a não ser por um backup).", "Excluir").then(function (ok) {
          if (!ok) return;
          commit(function () { getPath(db, path).splice(idx, 1); }, "Excluído: " + String(schema.title(item) || schema.singular).slice(0, 60));
          renderPage();
        });
        return;
      }
      if (b.hasAttribute("data-gform-clear")) {
        confirmBox("Remover o link do formulário? O site voltará a exibir a mensagem informativa.", "Remover").then(function (ok) {
          if (ok) { commit(function () { db.links.googleForm = ""; }, "Link do formulário removido"); renderPage(); }
        });
        return;
      }
      if (b.hasAttribute("data-qr-png")) {
        var u = safeUrl(db.links.googleForm); if (!u) return;
        var link = document.createElement("a"); link.href = NLX.QR.png(u, 1200); link.download = "qrcode-formulario.png"; document.body.appendChild(link); link.click(); link.remove();
        return;
      }
      var act = b.getAttribute("data-act");
      if (act === "export") {
        download("next-level-backup-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(db, null, 2));
        toast("Backup exportado ✓");
      }
      if (act === "import") $("#file-json").click();
      if (act === "publish") {
        var pub = Store.clone(db); pub.meta.updatedAt = Date.now();
        download("content.js", "/* Conteúdo publicado pelo painel em " + new Date().toLocaleString("pt-BR") + " */\nwindow.NLX_PUBLISHED = " + JSON.stringify(pub) + ";\n", "text/javascript");
        toast("Arquivo content.js gerado. Substitua data/content.js por ele ✓");
      }
      if (act === "restore") {
        confirmBox("Restaurar o conteúdo demonstrativo? Tudo o que foi cadastrado neste navegador será apagado.", "Restaurar").then(function (ok) {
          if (!ok) return;
          commit(function () { db = Store.clone(window.NLX_DEFAULTS); db.meta = { updatedAt: 0, log: [] }; }, "Dados demonstrativos restaurados");
          source = "local"; renderPage();
        });
      }
    });
    pg.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target;
      if (f.hasAttribute("data-objform")) {
        var id = f.getAttribute("data-objform"), base = f.getAttribute("data-base"), cfg = OBJFORMS[id];
        var draft = { x: Store.clone(getPath(db, base)) };
        $$("[data-path]", f).forEach(function (el) { readInput(el, draft, [{ k: "x", fields: cfg.fields }]); });
        $$(".f.invalid", f).forEach(function (el) { el.classList.remove("invalid"); var x = $(".err", el); if (x) x.remove(); });
        var errs = validateDraft(cfg.fields, draft, "x", []);
        if (errs.length) { errs.forEach(function (er) { var bx = $('[data-field="' + er[0] + '"]', f); if (bx) { bx.classList.add("invalid"); bx.insertAdjacentHTML("beforeend", '<span class="err">' + esc(er[1]) + "</span>"); } }); toast(errs[0][1], "err"); return; }
        commit(function () { setPath(db, base, draft.x); }, "Salvo: " + $("h2", f).textContent);
        return;
      }
      if (f.hasAttribute("data-catform")) {
        var cats = $("textarea", f).value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
        if (!cats.length) { toast("Cadastre pelo menos uma categoria.", "err"); return; }
        commit(function () { db.categories = cats; }, "Categorias atualizadas"); return;
      }
      if (f.hasAttribute("data-gform")) {
        var v = $("#gform").value.trim().replace(/^(forms\.gle\/|docs\.google\.com\/)/i, "https://$1"), box = $('[data-field="gform"]', f);
        box.classList.remove("invalid"); var old = $(".err", box); if (old) old.remove();
        if (v && !/^https:\/\/[^\s]+\.[^\s]+/i.test(v)) { box.classList.add("invalid"); box.insertAdjacentHTML("beforeend", '<span class="err">Use o endereço completo, começando com https://</span>'); toast("Endereço inválido.", "err"); return; }
        if (v) { try { NLX.QR.encode(v); } catch (er) { toast("Link longo demais para QR Code. Use o link curto (forms.gle).", "err"); return; } }
        commit(function () { db.links.googleForm = v; }, v ? "Link do Google Forms salvo" : "Link do formulário removido");
        renderPage(); return;
      }
      if (f.hasAttribute("data-signup")) {
        var sv = $("#signup").value.trim().replace(/^(forms\.gle\/|docs\.google\.com\/)/i, "https://$1"), sb = $('[data-field="signup"]', f);
        sb.classList.remove("invalid"); var so = $(".err", sb); if (so) so.remove();
        if (sv && !/^https:\/\/[^\s]+\.[^\s]+/i.test(sv)) { sb.classList.add("invalid"); sb.insertAdjacentHTML("beforeend", '<span class="err">Use o endereço completo, começando com https://</span>'); toast("Endereço inválido.", "err"); return; }
        commit(function () { db.links.signup = sv; }, sv ? "Link de inscrição salvo" : "Link de inscrição removido");
        renderPage(); return;
      }
      if (f.hasAttribute("data-simjson")) {
        var rounds;
        try { rounds = JSON.parse($("#sim-json").value); } catch (er) { toast("JSON inválido: " + er.message, "err"); return; }
        var msg = validateRounds(rounds); if (msg) { toast(msg, "err"); return; }
        commit(function () { db.simulator.rounds = rounds; }, "Rodadas do simulador atualizadas"); return;
      }
      if (f.hasAttribute("data-pass")) {
        var p1 = $("#np1").value, p2 = $("#np2").value;
        if (p1.length < 6) { toast("A senha precisa ter pelo menos 6 caracteres.", "err"); return; }
        if (p1 !== p2) { toast("As senhas não conferem.", "err"); return; }
        setPassword(p1).then(function () { toast("Senha alterada ✓"); f.reset(); });
      }
    });
    $("#file-json").addEventListener("change", function () {
      var file = this.files[0]; this.value = ""; if (!file) return;
      var fr = new FileReader();
      fr.onload = function () {
        var obj; try { obj = JSON.parse(fr.result); } catch (e) { toast("Arquivo inválido: não é um JSON.", "err"); return; }
        var m = Store.validate(obj); if (m) { toast(m, "err"); return; }
        confirmBox("Importar este backup? O conteúdo atual deste navegador será substituído.", "Importar").then(function (ok) {
          if (!ok) return;
          var def = Store.clone(window.NLX_DEFAULTS);
          commit(function () { Object.keys(def).forEach(function (k) { if (!(k in obj)) obj[k] = def[k]; }); db = obj; db.meta = db.meta || { log: [] }; }, "Backup importado");
          source = "local"; renderPage();
        });
      };
      fr.readAsText(file);
    });
  }
  function validateRounds(r) {
    if (!Array.isArray(r) || !r.length) return "As rodadas precisam ser uma lista com pelo menos 1 item.";
    for (var i = 0; i < r.length; i++) {
      var x = r[i], n = "Rodada " + (i + 1) + ": ";
      if (!x || !x.title || !x.situation) return n + "faltam title ou situation.";
      if (!Array.isArray(x.options) || x.options.length < 2 || x.options.length > 4) return n + "use de 2 a 4 opções.";
      for (var j = 0; j < x.options.length; j++) {
        var o = x.options[j];
        if (!o || !o.text) return n + "a opção " + (j + 1) + " precisa de text.";
        if (o.cash != null && typeof o.cash !== "number") return n + "cash da opção " + (j + 1) + " precisa ser um número.";
        if (o.effects && typeof o.effects !== "object") return n + "effects da opção " + (j + 1) + " é inválido.";
      }
    }
    return "";
  }

  /* ======================= acesso (senha) ======================= */
  function cryptoOK() { return !!(window.crypto && crypto.subtle && window.isSecureContext !== false); }
  function b64(buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))); }
  function unb64(s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); }
  function derive(pass, salt, iter) {
    return crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveBits"])
      .then(function (k) { return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt, iterations: iter }, k, 256); })
      .then(b64);
  }
  function setPassword(pass) {
    var salt = crypto.getRandomValues(new Uint8Array(16)), iter = 150000;
    return derive(pass, salt, iter).then(function (h) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ v: 1, salt: b64(salt), iter: iter, hash: h }));
      sessionStorage.setItem(SESSION_KEY, "1");
    });
  }
  function getAuth() { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch (e) { return null; } }
  function gate() {
    if (!cryptoOK()) { start(true); return; }
    if (sessionStorage.getItem(SESSION_KEY) === "1" && getAuth()) { start(false); return; }
    var auth = getAuth(), setup = !auth;
    $("#gate").hidden = false;
    $("#gate-title").textContent = setup ? "Primeiro acesso" : "Painel administrativo";
    $("#gate-desc").textContent = setup ? "Crie uma senha para proteger o painel neste navegador (mínimo de 6 caracteres)." : "Digite a senha para continuar.";
    $("#gate-confirm-wrap").hidden = !setup;
    $("#gate-submit").textContent = setup ? "Criar senha e entrar" : "Entrar";
    $("#gate-pass").setAttribute("autocomplete", setup ? "new-password" : "current-password");
    $("#gate-pass").focus();
    $("#gate-form").onsubmit = function (e) {
      e.preventDefault();
      var p = $("#gate-pass").value, err = $("#gate-error"); err.textContent = "";
      if (p.length < 6) { err.textContent = "A senha precisa ter pelo menos 6 caracteres."; return; }
      if (setup) {
        if (p !== $("#gate-pass2").value) { err.textContent = "As senhas não conferem."; return; }
        setPassword(p).then(function () { $("#gate").hidden = true; start(false); });
      } else {
        $("#gate-submit").disabled = true;
        derive(p, unb64(auth.salt), auth.iter).then(function (h) {
          $("#gate-submit").disabled = false;
          if (h === auth.hash) { sessionStorage.setItem(SESSION_KEY, "1"); $("#gate").hidden = true; start(false); }
          else { err.textContent = "Senha incorreta."; $("#gate-pass").select(); }
        });
      }
    };
  }

  /* ======================= início ======================= */
  var started = false;
  function start(noCrypto) {
    if (started) return; started = true;
    var r = Store.load(); db = r.data; source = r.source;
    $("#app").hidden = false;
    var banner = $("#env-banner"), msgs = [];
    if (noCrypto) msgs.push("Senha desativada: este navegador não oferece criptografia ao abrir o arquivo diretamente. Use o INICIAR-SITE.bat (http://localhost) no Chrome ou Edge para proteger o painel.");
    if (source === "published" && Store.hasLocal()) msgs.push("O conteúdo publicado (data/content.js) é mais recente que o deste navegador e está sendo exibido. Ao salvar, ele passa a ser a sua cópia de trabalho.");
    if (msgs.length) { banner.hidden = false; banner.innerHTML = msgs.map(esc).join("<br>"); }
    setSaveState();
    if (!db.meta.updatedAt) $("#save-state").textContent = "Usando conteúdo demonstrativo · ainda sem alterações";
    var h = (location.hash || "").slice(1);
    if (PAGES.some(function (p) { return p[0] === h; })) currentPage = h;
    renderPage(); pageEvents(); editorEvents();
    $("#logout").addEventListener("click", function () { sessionStorage.removeItem(SESSION_KEY); location.reload(); });
    window.addEventListener("storage", function (e) { if (e.key === Store.KEY && !ed) { db = Store.load().data; renderPage(); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", gate); else gate();
})();
