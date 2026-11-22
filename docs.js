// Documentación interactiva de Prisma UI.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const raiz = document.documentElement;

// ---------- color: OKLCH → sRGB y contraste WCAG ----------
const ACENTO = [[50, .97, .02], [100, .93, .04], [200, .87, .08], [300, .79, .12], [400, .70, .15],
  [500, .61, .17], [600, .53, .17], [700, .45, .15], [800, .37, .12], [900, .29, .09]];
const NEUTRO = [[50, .985, .003], [100, .96, .005], [200, .92, .007], [300, .86, .009], [400, .72, .012],
  [500, .58, .014], [600, .47, .014], [700, .37, .013], [800, .26, .011], [900, .18, .009]];

function oklchARgb(L, C, H) {
  const h = (H * Math.PI) / 180, a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
  return lin.map((c) => {
    c = Math.min(1, Math.max(0, c));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  });
}
const hex = (rgb) => "#" + rgb.map((c) => Math.round(c * 255).toString(16).padStart(2, "0")).join("");
function luminancia(rgb) {
  const [r, g, b] = rgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contraste = (a, b) => { const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const nivel = (r) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA grande" : "—");

function muestra(nombre, rgb, varCss) {
  const blanco = contraste(rgb, [1, 1, 1]), negro = contraste(rgb, [0, 0, 0]);
  const texto = blanco >= negro ? "#fff" : "#000";
  const mejor = Math.max(blanco, negro);
  return `<button class="muestra" data-copiar="${varCss}" aria-label="${nombre} ${hex(rgb)}, contraste ${mejor.toFixed(1)}. Copiar variable">
    <div class="color" style="background:var(${varCss});color:${texto}">${nivel(mejor)}</div>
    <div class="datos"><b>${nombre}</b><br>${hex(rgb)}<br>⬜ ${blanco.toFixed(1)} · ⬛ ${negro.toFixed(1)}</div></button>`;
}

function pintarColores() {
  const tono = +$("#tono").value;
  $("#escala-acento").innerHTML = ACENTO.map(([p, L, C]) => muestra(p, oklchARgb(L, C, tono), `--pr-acento-${p}`)).join("");
  $("#escala-neutro").innerHTML = NEUTRO.map(([p, L, C]) => muestra(p, oklchARgb(L, C, tono), `--pr-neutro-${p}`)).join("");
  $("#semanticos").innerHTML = [["Éxito", .52, .13, 150, "--pr-exito"], ["Aviso", .62, .14, 70, "--pr-aviso"],
    ["Error", .55, .19, 27, "--pr-error"], ["Info", .53, .17, tono, "--pr-info"]]
    .map(([n, L, C, H, v]) => muestra(n, oklchARgb(L, C, H), v)).join("");
}

// ---------- tipografía y espaciado ----------
function pintarTipos() {
  const pasos = [["Display", 3.052, 700], ["H1", 2.441, 700], ["H2", 1.953, 600], ["H3", 1.563, 600], ["Grande", 1.25, 400], ["Cuerpo", 1, 400], ["Pequeño", 0.8, 400]];
  $("#tipos").innerHTML = pasos.map(([n, e, w]) =>
    `<div class="tipo"><code>${n} · ${Math.round(e * 16)}px</code><span style="font-size:${e}rem;font-weight:${w}">El sistema que crece contigo</span></div>`).join("");
  $("#espacios").innerHTML = [1, 2, 3, 4, 6, 8, 12, 16].map((n) =>
    `<div class="espacio"><span>--pr-${n}</span><span>${n * 4}px</span><i style="width:${n * 4 * 2}px"></i></div>`).join("");
}

// ---------- tema ----------
function aplicarTono() {
  const t = $("#tono").value;
  raiz.style.setProperty("--pr-tono", t);
  $("#tono-valor").textContent = `${t}°`;
  pintarColores();
  guardar();
}
function aplicarRadio() {
  const r = $("#radio").value;
  raiz.style.setProperty("--pr-radio", `${r}px`);
  $("#radio-valor").textContent = `${r}px`;
  guardar();
}
function aplicarTema(tema) {
  raiz.dataset.tema = tema;
  $$(".pr-segmentado button").forEach((b) => b.setAttribute("aria-checked", b.dataset.tema === tema));
  guardar();
}
function guardar() {
  try { localStorage.setItem("prisma", JSON.stringify({ tono: $("#tono").value, radio: $("#radio").value, tema: raiz.dataset.tema })); } catch {}
}
function cargar() {
  let p = null;
  try { p = JSON.parse(localStorage.getItem("prisma")); } catch {}
  const tema = p?.tema || (matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro");
  if (p) { $("#tono").value = p.tono; $("#radio").value = p.radio; }
  aplicarTema(tema); aplicarTono(); aplicarRadio();
}

// ---------- utilidades de la documentación ----------
function toast(texto) {
  const t = $("#toast");
  t.textContent = texto;
  t.classList.add("visible");
  clearTimeout(toast.id);
  toast.id = setTimeout(() => t.classList.remove("visible"), 1800);
}
async function copiar(texto, aviso) {
  try { await navigator.clipboard.writeText(texto); toast(aviso); } catch { toast("No se pudo copiar"); }
}

function botonesCopiar() {
  $$(".demo[data-codigo]").forEach((d) => {
    const b = document.createElement("button");
    b.className = "pr-btn pr-btn--secundario pr-btn--sm copiar";
    b.textContent = "Copiar código";
    b.addEventListener("click", () => copiar(d.dataset.codigo, "Código copiado"));
    d.append(b);
  });
  document.addEventListener("click", (e) => {
    const m = e.target.closest("[data-copiar]");
    if (m) copiar(`var(${m.dataset.copiar})`, `var(${m.dataset.copiar}) copiado`);
  });
}

// ---------- componentes de ejemplo ----------
function formulario() {
  const f = $("#form-demo");
  const reglas = {
    "f-nombre": (v) => (v.trim().length >= 3 ? "" : "Escribe al menos 3 caracteres."),
    "f-email": (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Escribe un correo válido, por ejemplo ana@correo.com."),
  };
  const ayuda = { "f-nombre": "Como aparece en tu documento.", "f-email": "Te enviaremos la factura aquí." };
  function validar(input, mostrarOk = false) {
    const error = reglas[input.id](input.value);
    const msg = $(`#${input.id}-msg`);
    input.setAttribute("aria-invalid", !!error);
    msg.className = "pr-ayuda" + (error ? " error" : mostrarOk ? " ok" : "");
    msg.textContent = error || (mostrarOk ? "✓ Correcto" : ayuda[input.id]);
    return !error;
  }
  Object.keys(reglas).forEach((id) => $(`#${id}`).addEventListener("blur", (e) => e.target.value && validar(e.target, true)));
  $("#f-nota").addEventListener("input", (e) => ($("#f-nota-msg").textContent = `${e.target.value.length} / 140`));
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const campos = Object.keys(reglas).map((id) => $(`#${id}`));
    const ok = campos.map((c) => validar(c, true)).every(Boolean);
    if (!ok) campos.find((c) => c.getAttribute("aria-invalid") === "true").focus();
    toast(ok ? "Formulario válido" : "Revisa los campos marcados");
  });
}

function pestanas() {
  const tabs = $$("#tabs-demo [role=tab]");
  const activar = (i) => tabs.forEach((t, j) => {
    t.setAttribute("aria-selected", i === j);
    t.tabIndex = i === j ? 0 : -1;
    $(`#${t.getAttribute("aria-controls")}`).hidden = i !== j;
  });
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => activar(i));
    t.addEventListener("keydown", (e) => {
      const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (n === undefined) return;
      e.preventDefault();
      const j = (n + tabs.length) % tabs.length;
      tabs[j].focus(); activar(j);
    });
  });
}

function dialogo() {
  const d = $("#dialogo");
  $("#abrir-dialogo").addEventListener("click", () => d.showModal());
  d.addEventListener("close", () => d.returnValue === "si" && toast("Proyecto eliminado (demostración)"));
  $("#btn-carga").addEventListener("click", (e) => {
    const b = e.currentTarget, sp = $(".pr-spinner", b), txt = b.lastElementChild;
    b.disabled = true; sp.hidden = false; txt.textContent = "Guardando…";
    setTimeout(() => { b.disabled = false; sp.hidden = true; txt.textContent = "Probar carga"; toast("Guardado"); }, 1400);
  });
}

function tabla() {
  const filas = [
    { cliente: "Café Altura", fecha: "2026-11-02", monto: 1240, estado: "Pagada" },
    { cliente: "Estudio Mar", fecha: "2026-10-18", monto: 860.5, estado: "Pendiente" },
    { cliente: "Logística Istmo", fecha: "2026-09-30", monto: 4320, estado: "Vencida" },
    { cliente: "Panadería Sol", fecha: "2026-11-10", monto: 315.75, estado: "Pagada" },
    { cliente: "Clínica Norte", fecha: "2026-10-05", monto: 2050, estado: "Pagada" },
  ];
  const insignia = { Pagada: "exito", Pendiente: "aviso", Vencida: "error" };
  let orden = { clave: "fecha", dir: -1 };
  function pintar() {
    filas.sort((a, b) => (a[orden.clave] > b[orden.clave] ? 1 : -1) * orden.dir);
    $("#tabla tbody").innerHTML = filas.map((f) => `<tr><td>${f.cliente}</td><td>${new Date(f.fecha + "T12:00").toLocaleDateString("es-PA", { day: "numeric", month: "short", year: "numeric" })}</td>
      <td class="num">$${f.monto.toLocaleString("es-PA", { minimumFractionDigits: 2 })}</td>
      <td><span class="pr-insignia pr-insignia--${insignia[f.estado]}">● ${f.estado}</span></td></tr>`).join("");
    $$("#tabla th").forEach((th) => {
      const b = $("button", th);
      if (!b) return;
      th.setAttribute("aria-sort", b.dataset.orden === orden.clave ? (orden.dir === 1 ? "ascending" : "descending") : "none");
    });
  }
  $$("#tabla th button").forEach((b) => b.addEventListener("click", () => {
    orden = { clave: b.dataset.orden, dir: orden.clave === b.dataset.orden ? -orden.dir : 1 };
    pintar();
  }));
  pintar();
}

function navegacion() {
  const enlaces = $$(".lateral nav a");
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) enlaces.forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === `#${e.target.id}`));
  }), { rootMargin: "-30% 0px -60% 0px" });
  $$("main section[id]").forEach((s) => io.observe(s));
  const lateral = $("#lateral"), menu = $("#menu");
  menu.addEventListener("click", () => {
    const abierta = lateral.classList.toggle("abierta");
    menu.setAttribute("aria-expanded", abierta);
  });
  enlaces.forEach((a) => a.addEventListener("click", () => { lateral.classList.remove("abierta"); menu.setAttribute("aria-expanded", false); }));
}

$("#tono").addEventListener("input", aplicarTono);
$("#radio").addEventListener("input", aplicarRadio);
$$(".pr-segmentado button").forEach((b) => b.addEventListener("click", () => aplicarTema(b.dataset.tema)));
pintarTipos();
cargar();
botonesCopiar();
formulario();
pestanas();
dialogo();
tabla();
navegacion();
