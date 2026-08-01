// ===== ICONOS (SVG inline, set mínimo y consistente — reemplaza emojis) =====
const ICON = {
  shieldCheck: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  alert: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3l10 18H2L12 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 10v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="0.9" fill="currentColor"/></svg>`,
  network: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="2.3" stroke="currentColor" stroke-width="1.8"/><circle cx="5" cy="19" r="2.3" stroke="currentColor" stroke-width="1.8"/><circle cx="19" cy="19" r="2.3" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.3V13m0 0l-5.5 4M12 13l5.5 4" stroke="currentColor" stroke-width="1.8"/></svg>`,
  info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 11v5.5M12 8v.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  miniCheck: `<svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  file: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
}

// ===== I18N (se mantienen los 3 idiomas, sin recortar) =====
const T = {
  es: {
    subtitle:"Network Intelligence", dropMain:"Arrastrá tus archivos, o tocá para elegir",
    dropSub:"App_Privacy_Report.ndjson o sysdiagnose_*.tar.gz (al menos uno) + Datos de análisis .ips (opcional)",
    run:"Analizar", secApps:"Apps proxy / cheat / jailbreak", secFF:"Accesos sospechosos — Free Fire",
    secInfra:"Infraestructura de cheat conocida", secIPs:"IPs / dominios sospechosos", secBL:"Blacklist comunitaria", secSys:"Sysdiagnose — instalaciones",
    footer:"rqiemSS — análisis 100% local en tu navegador. Nada se sube a internet, salvo la consulta opcional de hosting/ASN a ip-api.com (si el navegador la permite).",
    verdictClean:"Sin señales de trampa", verdictSuspect:"Señales de riesgo detectadas",
    none:"Nada detectado en esta categoría", needNdjson:"Subí al menos el App_Privacy_Report.ndjson o un sysdiagnose_*.tar.gz.",
    invalidFile:"no parece ser un archivo válido de rqiemSS.",
    netUnavailable:"No se pudo consultar hosting/ASN vía ip-api.com desde este navegador (común si la página corre en HTTPS o hay bloqueo CORS). El análisis por dominio/TLD sospechoso siguió funcionando igual.",
    reason:"Motivo", usedBy:"Usado por", hits:"conexiones",
    matchTime:"Hora de fin de la partida (opcional)", matchTimeHint:"Si la cargás, marcamos automáticamente cualquier apertura posterior",
    staleTitle:"Archivo posiblemente antiguo", staleBody:h => `Último registro hace ${h}. Puede indicar un archivo generado fuera del período real para ocultar actividad.`,
    appStoreTitle:"App Store abierta", ffTitle:"Sesiones de Free Fire",
    ffSessionsCount:n => `${n} inicialización(es) registrada(s) en el período`,
    lastOpen:"Última apertura", woHint:"Si la última apertura fue después de la partida → aplicá el W.O.",
    woBadge:"🚩 Después de la partida — aplicar W.O.", afterMatch:"después de la partida",
    statApps:"Apps", statFF:"F.Fire", statInfra:"Infra", statIPs:"IPs",
    stCritical:"CRÍTICO", stMedium:"SOSPECHOSO",
    loadStates:["Inicializando","Analizando red","Verificando proxies","Cargando reglas","Construyendo reporte","Finalizando"],
    tutorialTitle:"Cómo conseguir los archivos",
    tutorialSteps:[
      { title:"Paso 1 de 2 — Reporte de privacidad", body:"Ir a:\nAjustes → Privacidad y Seguridad → Reporte de privacidad de apps\n\nBajá hasta el final y tocá \"Activar el reporte de privacidad de apps\".\n\nDespués tocá \"Exportar Reporte de privacidad de apps\" y guardá el archivo .ndjson (Archivos, iCloud, etc.)." },
      { title:"Paso 2 de 2 — Datos de análisis (opcional)", body:"Ir a:\nAjustes → Privacidad y Seguridad → Análisis y mejoras\n\nActivá:\n• Compartir análisis (iPhone)\n• Compartir análisis (iCloud)\n• Compartir con desarrolladores\n\nVolvé y tocá \"Datos de análisis\". Bajá hasta el final y seleccioná el archivo más reciente que empieza con xp_amp_app_usage_dnu.\n\nTocá el archivo → ícono de compartir → Guardalo en Archivos." },
    ],
  },
  en: {
    subtitle:"Network Intelligence", dropMain:"Drop your files, or tap to choose",
    dropSub:"App_Privacy_Report.ndjson (required) + Analytics Data .ips (optional)",
    run:"Analyze", secApps:"Proxy / cheat / jailbreak apps", secFF:"Suspicious access — Free Fire",
    secInfra:"Known cheat infrastructure", secIPs:"Suspicious IPs / domains", secBL:"Community blacklist", secSys:"Sysdiagnose — installs",
    footer:"rqiemSS — 100% local analysis in your browser. Nothing is uploaded, except the optional hosting/ASN lookup to ip-api.com (if the browser allows it).",
    verdictClean:"No cheat signals found", verdictSuspect:"Risk signals detected",
    none:"Nothing detected in this category", needNdjson:"Upload at least the App_Privacy_Report.ndjson or a sysdiagnose_*.tar.gz.",
    invalidFile:"doesn't look like a valid rqiemSS file.",
    netUnavailable:"Could not query hosting/ASN via ip-api.com from this browser (common on HTTPS pages or CORS-blocked). Domain/TLD-based analysis still ran normally.",
    reason:"Reason", usedBy:"Used by", hits:"connections",
    matchTime:"Match end time (optional)", matchTimeHint:"If you set it, we'll auto-flag any app opened after that",
    staleTitle:"Possibly old file", staleBody:h => `Last record was ${h} ago. May indicate a file generated outside the real time window to hide activity.`,
    appStoreTitle:"App Store opened", ffTitle:"Free Fire sessions",
    ffSessionsCount:n => `${n} startup(s) recorded in the period`,
    lastOpen:"Last opened", woHint:"If the last opening was after the match → apply a walkover.",
    woBadge:"🚩 After the match — apply W.O.", afterMatch:"after the match",
    statApps:"Apps", statFF:"F.Fire", statInfra:"Infra", statIPs:"IPs",
    stCritical:"CRITICAL", stMedium:"SUSPICIOUS",
    loadStates:["Initializing","Analyzing network","Checking proxies","Loading rules","Building report","Finalizing"],
    tutorialTitle:"How to get the files",
    tutorialSteps:[
      { title:"Step 1 of 2 — Privacy Report", body:"Go to:\nSettings → Privacy & Security → App Privacy Report\n\nScroll down and tap \"Turn On App Privacy Report\".\n\nThen tap \"Export App Privacy Report\" and save the .ndjson file (Files, iCloud, etc.)." },
      { title:"Step 2 of 2 — Analytics Data (optional)", body:"Go to:\nSettings → Privacy & Security → Analytics & Improvements\n\nEnable:\n• Share iPhone Analytics\n• Share iCloud Analytics\n• Share With App Developers\n\nGo back and tap \"Analytics Data\". Scroll to the bottom and pick the most recent file starting with xp_amp_app_usage_dnu.\n\nTap the file → share icon → Save to Files." },
    ],
  },
  pt: {
    subtitle:"Network Intelligence", dropMain:"Arraste seus arquivos, ou toque para escolher",
    dropSub:"App_Privacy_Report.ndjson (obrigatório) + Dados de Análise .ips (opcional)",
    run:"Analisar", secApps:"Apps proxy / cheat / jailbreak", secFF:"Acessos suspeitos — Free Fire",
    secInfra:"Infraestrutura de cheat conhecida", secIPs:"IPs / domínios suspeitos", secBL:"Blacklist da comunidade", secSys:"Sysdiagnose — instalações",
    footer:"rqiemSS — análise 100% local no navegador. Nada é enviado, exceto a consulta opcional de hosting/ASN ao ip-api.com (se o navegador permitir).",
    verdictClean:"Nenhum sinal de cheat", verdictSuspect:"Sinais de risco detectados",
    none:"Nada detectado nesta categoria", needNdjson:"Envie pelo menos o App_Privacy_Report.ndjson ou um sysdiagnose_*.tar.gz.",
    invalidFile:"não parece ser um arquivo válido do rqiemSS.",
    netUnavailable:"Não foi possível consultar hosting/ASN via ip-api.com neste navegador (comum em páginas HTTPS ou bloqueio CORS). A análise por domínio/TLD suspeito continuou normalmente.",
    reason:"Motivo", usedBy:"Usado por", hits:"conexões",
    matchTime:"Hora de fim da partida (opcional)", matchTimeHint:"Se preencher, marcamos automaticamente qualquer abertura posterior",
    staleTitle:"Arquivo possivelmente antigo", staleBody:h => `Último registro há ${h}. Pode indicar um arquivo gerado fora do período real para esconder atividade.`,
    appStoreTitle:"App Store aberta", ffTitle:"Sessões do Free Fire",
    ffSessionsCount:n => `${n} inicialização(ões) registrada(s) no período`,
    lastOpen:"Última abertura", woHint:"Se a última abertura foi após a partida → aplique o W.O.",
    woBadge:"🚩 Após a partida — aplicar W.O.", afterMatch:"após a partida",
    statApps:"Apps", statFF:"F.Fire", statInfra:"Infra", statIPs:"IPs",
    stCritical:"CRÍTICO", stMedium:"SUSPEITO",
    loadStates:["Inicializando","Analisando rede","Verificando proxies","Carregando regras","Construindo relatório","Finalizando"],
    tutorialTitle:"Como conseguir os arquivos",
    tutorialSteps:[
      { title:"Passo 1 de 2 — Relatório de privacidade", body:"Vá em:\nAjustes → Privacidade e Segurança → Relatório de privacidade de apps\n\nDesça até o final e toque em \"Ativar relatório de privacidade de apps\".\n\nDepois toque em \"Exportar relatório de privacidade de apps\" e salve o arquivo .ndjson (Arquivos, iCloud, etc.)." },
      { title:"Passo 2 de 2 — Dados de análise (opcional)", body:"Vá em:\nAjustes → Privacidade e Segurança → Análise e melhorias\n\nAtive:\n• Compartilhar análise (iPhone)\n• Compartilhar análise (iCloud)\n• Compartilhar com desenvolvedores\n\nVolte e toque em \"Dados de análise\". Desça até o final e escolha o arquivo mais recente que começa com xp_amp_app_usage_dnu.\n\nToque no arquivo → ícone de compartilhar → Salvar em Arquivos." },
    ],
  },
}
let currentLang = (navigator.language || "es").slice(0,2)
if (!T[currentLang]) currentLang = "es"

function applyLang(){
  let t = T[currentLang]
  document.getElementById("tSubtitle").textContent = t.subtitle
  document.getElementById("tDropMain").textContent = t.dropMain
  document.getElementById("tDropSub").textContent = t.dropSub
  document.getElementById("runBtnLabel").textContent = t.run
  document.getElementById("tSecApps").textContent = t.secApps
  document.getElementById("tSecFF").textContent = t.secFF
  document.getElementById("tSecInfra").textContent = t.secInfra
  document.getElementById("tSecIPs").textContent = t.secIPs
  document.getElementById("tSecBL").textContent = t.secBL
  document.getElementById("tSecSys").textContent = t.secSys
  document.getElementById("tFooter").textContent = t.footer
  document.getElementById("tMatchTime").textContent = t.matchTime
  document.getElementById("tMatchTimeHint").textContent = t.matchTimeHint
  document.getElementById("tTutorialTitle").textContent = t.tutorialTitle
  renderTutorial()
  document.querySelectorAll("#langbar button").forEach(b => b.classList.toggle("active", b.dataset.lang === currentLang))
}

function renderTutorial(){
  let box = document.getElementById("tutorialBody")
  box.innerHTML = ""
  T[currentLang].tutorialSteps.forEach((s, i) => {
    let step = el("div","tutorial-step")
    step.innerHTML = `<div class="num">${i+1}</div><div class="content"><h3>${s.title}</h3><p>${s.body}</p></div>`
    box.appendChild(step)
  })
}

// ---------- historial de análisis (localStorage, queda solo en este navegador) ----------
const HISTORY_KEY = "rqiemss_history"
const HISTORY_MAX = 20

function saveToHistory(data, ipsFindings, fileName){
  let { findings, cheatAppFindings, knownCheatFindings, proxyLoginFindings } = data
  let critical = (ipsFindings||[]).filter(x=>x.category==="critical").length + cheatAppFindings.length + knownCheatFindings.length + proxyLoginFindings.length
  let score = computeScore(critical, findings.length)
  let entry = { ts: Date.now(), fileName, score, critical, suspect: findings.length }
  let list = []
  try { list = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") } catch(e) { list = [] }
  list.unshift(entry)
  list = list.slice(0, HISTORY_MAX)
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)) } catch(e) { console.error("No se pudo guardar el historial:", e) }
}

function getHistory(){
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") } catch(e) { return [] }
}

function renderHistory(){
  let box = document.getElementById("historyBody")
  let list = getHistory()
  box.innerHTML = ""
  if (!list.length){
    box.innerHTML = `<div class="history-empty">Todavía no analizaste ningún archivo en este navegador.</div>`
    return
  }
  list.forEach(h => {
    let color = h.critical > 0 ? "#FF5C6C" : (h.score < 100 ? "#FFB84D" : "#33D6B0")
    let item = el("div","history-item")
    item.innerHTML = `
      <div class="h-left">
        <div class="h-name">${h.fileName || "?"}</div>
        <div class="h-meta">${fmtDt(new Date(h.ts))} · ${h.critical} crítico(s) · ${h.suspect} sospechoso(s)</div>
      </div>
      <div class="h-score" style="color:${color}">${h.score}</div>
    `
    box.appendChild(item)
  })
}

function openHistory(){ renderHistory(); document.getElementById("historyOverlay").classList.add("show") }
function closeHistory(){ document.getElementById("historyOverlay").classList.remove("show") }
function clearHistory(){ localStorage.removeItem(HISTORY_KEY); renderHistory() }

function openTutorial(){ document.getElementById("tutorialOverlay").classList.add("show") }
function closeTutorial(){ document.getElementById("tutorialOverlay").classList.remove("show") }

// ===== ESTADO =====
let uploadedFiles = []

function classifyContent(content, name){
  if (looksLikePrivacyReport(content)) return "ndjson"
  if (looksLikeUsageFile(content)) return "ips"
  let n = (name || "").toLowerCase()
  if (n.endsWith(".ndjson") || n.includes("privacy")) return "ndjson"
  if (n.endsWith(".ips") || n.includes("xp_amp")) return "ips"
  return "unknown"
}
function looksLikeSysdiagnoseName(name){
  let n = (name || "").toLowerCase()
  return n.endsWith(".tar.gz") || n.endsWith(".tgz") || n.startsWith("sysdiagnose")
}
async function isGzipFile(file){
  try {
    let head = new Uint8Array(await file.slice(0, 2).arrayBuffer())
    return head[0] === 0x1f && head[1] === 0x8b
  } catch(e){ return false }
}

// ---------- componentes reutilizables ----------
function el(tag, cls, html){ let d = document.createElement(tag); if (cls) d.className = cls; if (html !== undefined) d.innerHTML = html; return d }

function fileChip(f, idx){
  let statusDot = f.kind === "unknown" ? "warn" : "ok"
  let pillTxt = f.kind === "ndjson" ? "PRIVACY REPORT" : f.kind === "ips" ? "DATOS DE ANÁLISIS" : f.kind === "sysdiagnose" ? "SYSDIAGNOSE" : "SIN RECONOCER"
  let subTxt = f.kind === "ndjson" ? "Reconocido — listo para analizar"
    : f.kind === "ips" ? "Reconocido — datos de análisis opcionales"
    : f.kind === "sysdiagnose" ? "Puede tardar unos minutos — archivo grande, se procesa 100% en tu navegador"
    : "No coincide con ningún formato esperado"
  let sizeTxt = f.file && f.file.size ? formatBytes(f.file.size) : ""
  let chip = el("div", "filechip glass")
  chip.style.animationDelay = (idx*0.05)+"s"
  chip.innerHTML = `
    <div class="left">
      <span class="status-dot ${statusDot}"></span>
      <div class="file-icon">${ICON.file}</div>
      <div class="file-body">
        <div class="file-top"><span class="name">${f.name}</span><span class="pill ${statusDot}">${pillTxt}</span></div>
        <div class="sub">${subTxt}${sizeTxt ? " · "+sizeTxt : ""}</div>
      </div>
    </div>`
  let rm = el("button","remove","✕")
  rm.onclick = () => { uploadedFiles.splice(idx,1); renderFileList(); updateRunBtn() }
  chip.appendChild(rm)
  return chip
}
function formatBytes(n){
  if (n < 1024) return n + " B"
  if (n < 1024*1024) return (n/1024).toFixed(1) + " KB"
  return (n/(1024*1024)).toFixed(1) + " MB"
}

function renderFileList(){
  let box = document.getElementById("fileList")
  box.innerHTML = ""
  uploadedFiles.forEach((f, idx) => box.appendChild(fileChip(f, idx)))
}

function updateRunBtn(){
  document.getElementById("runBtn").disabled = !uploadedFiles.some(f => f.kind === "ndjson" || f.kind === "sysdiagnose")
}

async function handleFiles(fileListObj){
  let files = Array.from(fileListObj)
  for (let file of files){
    try{
      if (looksLikeSysdiagnoseName(file.name) || await isGzipFile(file)){
        uploadedFiles.push({ file, name:file.name, kind:"sysdiagnose", content:null })
        continue
      }
      let content = await readFileAsText(file)
      uploadedFiles.push({ file, name:file.name, kind:classifyContent(content,file.name), content })
    } catch(e){ showToast(`${file.name}: ${e.message}`) }
  }
  renderFileList(); updateRunBtn()
}

// ---------- toast ----------
let toastTimer = null
function showToast(msg){
  let box = document.getElementById("toast")
  box.textContent = msg
  box.classList.add("show")
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => box.classList.remove("show"), 6000)
}

// ---------- loading (estados con nombre, en vez de "Cargando...") ----------
const RING_CIRC_SMALL = 2 * Math.PI * 41
let phaseListInited = false
function renderPhaseList(){
  let box = document.getElementById("phaseList")
  box.innerHTML = ""
  T[currentLang].loadStates.forEach((label, i) => {
    let item = el("div", "phase-item")
    item.dataset.idx = i
    item.innerHTML = `<span class="dot">${ICON.miniCheck}</span><span class="lbl">${label}</span>`
    box.appendChild(item)
  })
  phaseListInited = true
}
function setProgress(pct, note){
  let t = T[currentLang]
  if (!phaseListInited) renderPhaseList()
  document.getElementById("ringPct").textContent = pct + "%"
  document.getElementById("ringFill").style.strokeDashoffset = RING_CIRC_SMALL * (1 - pct/100)
  let stateIdx = Math.min(t.loadStates.length - 1, Math.floor((pct/100) * t.loadStates.length))
  document.getElementById("loadingStatus").textContent = t.loadStates[stateIdx]
  if (note) document.getElementById("loadingNote").textContent = note

  document.querySelectorAll("#phaseList .phase-item").forEach(item => {
    let idx = +item.dataset.idx
    item.classList.remove("active","done")
    if (idx < stateIdx) item.classList.add("done")
    else if (idx === stateIdx) item.classList.add("active")
  })
  if (pct >= 100){
    document.querySelectorAll("#phaseList .phase-item").forEach(item => { item.classList.remove("active"); item.classList.add("done") })
  }
}

// ---------- score ring ----------
function computeScore(critical, suspect){
  let penalty = Math.min(100, critical*22 + suspect*7)
  return Math.max(0, 100 - penalty)
}
const RING_CIRC_BIG = 2 * Math.PI * 57
function paintScore(score, critical){
  let isFullyClean = score >= 100 && critical === 0
  let cleanEl = document.getElementById("cleanCheck")
  cleanEl.classList.remove("show")
  void cleanEl.offsetWidth // fuerza reflow para poder reiniciar la animación si se vuelve a analizar
  cleanEl.classList.toggle("show", isFullyClean)
  document.getElementById("scoreRingWrap").classList.toggle("hide", isFullyClean)

  if (!isFullyClean){
    let ring = document.getElementById("scoreRing")
    ring.style.strokeDashoffset = RING_CIRC_BIG * (1 - score/100)
    let a = document.getElementById("scoreGradA"), b = document.getElementById("scoreGradB")
    let color1, color2
    if (score >= 85){ color1="#33D6B0"; color2="#6C8CFF" }
    else if (score >= 60){ color1="#FFB84D"; color2="#33D6B0" }
    else { color1="#FF5C6C"; color2="#FFB84D" }
    a.setAttribute("stop-color", color1); b.setAttribute("stop-color", color2)
    document.getElementById("scoreNum").textContent = score
    document.getElementById("scoreNum").style.color = color1
  }

  document.getElementById("scoreVerdict").textContent = critical > 0 || score < 100 ? T[currentLang].verdictSuspect : T[currentLang].verdictClean
  document.getElementById("scoreVerdict").style.color = critical > 0 ? "#FF5C6C" : (score < 100 ? "#FFB84D" : "#33D6B0")
}

function statPill(n, label){ return el("div","stat-pill glass", `<div class="n">${n}</div><div class="l">${label}</div>`) }

function sevInfo(sev){
  if (sev === "critical" || sev === "HIGH") return { cls:"critical", label:T[currentLang].stCritical }
  return { cls:"medium", label:T[currentLang].stMedium }
}

function findingCard(cls, iconSvg, name, desc, chips, idx){
  let card = el("div", "finding-card glass "+"")
  card.style.animationDelay = (idx*0.04)+"s"
  let sev = sevInfo(cls)
  card.innerHTML = `
    <div class="row">
      <span class="name">${name}</span>
      <span class="badge ${sev.cls}">${iconSvg}${sev.label}</span>
    </div>
    ${desc ? `<div class="desc">${desc}</div>` : ""}
    ${chips && chips.length ? `<div class="chips">${chips.map(c=>`<span class="chip">${c}</span>`).join("")}</div>` : ""}
  `
  return card
}

function renderSection(containerId, items, renderFn){
  let box = document.getElementById(containerId)
  box.innerHTML = ""
  if (!items || items.length === 0){
    box.appendChild(el("div","empty-note glass", `${ICON.shieldCheck}<span>${T[currentLang].none}</span>`))
    return
  }
  items.forEach((it, idx) => box.appendChild(renderFn(it, idx)))
}

function fmtDt(d){
  if (!d) return "?"
  let locale = currentLang === "es" ? "es-AR" : currentLang === "pt" ? "pt-BR" : "en-US"
  return d.toLocaleString(locale, { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" })
}
function fmtUptime(ms){
  if (ms == null) return "?"
  let min = Math.floor(ms/60000), h = Math.floor(min/60), d = Math.floor(h/24)
  let remH = h%24, remMin = min%60
  if (d > 0) return `${d}d ${remH}h ${remMin}min`
  if (h > 0) return `${h}h ${remMin}min`
  return `${min} min`
}
function renderSessionCard(sessionInfo, ipsMeta){
  let s = sessionInfo || {}
  let box = document.getElementById("sessionCard")
  box.innerHTML = `
    <div class="session-grid">
      <div class="session-item"><div class="l">Inicio</div><div class="v">${fmtDt(s.firstTs)}</div></div>
      <div class="session-item"><div class="l">Último registro</div><div class="v">${fmtDt(s.lastTs)}</div></div>
      <div class="session-item"><div class="l">Dominios únicos</div><div class="v accent">${s.uniqueDomainsTotal ?? "?"}</div></div>
      <div class="session-item"><div class="l">Conexiones totales</div><div class="v">${s.totalConnections ?? "?"}</div></div>
      <div class="session-item"><div class="l">Tiempo de monitoreo</div><div class="v">${fmtUptime(s.uptimeMs)}</div></div>
      ${ipsMeta && ipsMeta.iosVersion ? `<div class="session-item"><div class="l">Versión iOS</div><div class="v accent">${ipsMeta.iosVersion}</div></div>` : ""}
    </div>
    ${ipsMeta && ipsMeta.rootsInstalled > 0 ? `<div class="session-warn">${ICON.alert}<span>${ipsMeta.rootsInstalled} certificado${ipsMeta.rootsInstalled>1?"s":""} raíz instalado${ipsMeta.rootsInstalled>1?"s":""}</span></div>` : ""}
  `
}

function fmtAgo(min){
  if (min >= 1440) return `${Math.floor(min/1440)}d ${Math.floor((min%1440)/60)}h`
  if (min >= 60) return `${Math.floor(min/60)}h ${min%60}min`
  return `${min} min`
}
function loginColor(type){
  if (type.includes("Facebook")) return "#1877f2"
  if (type.includes("Twitter")) return "#1da1f2"
  if (type.includes("Gmail")) return "#ea4335"
  if (type.includes("VK")) return "#4a76a8"
  return "#8a93a6"
}
function getMatchTime(){
  let v = document.getElementById("matchTimeInput").value
  return v ? new Date(v) : null
}

function renderAnalystSignals(sig){
  let t = T[currentLang]
  let box = document.getElementById("analystSignals")
  box.innerHTML = ""
  if (!sig) return
  let matchTime = getMatchTime()

  if (sig.staleWarning){
    box.appendChild(cardEl2("signal-card glass", `
      <div class="sig-row">
        <span class="sig-icon badge medium" style="padding:6px">${ICON.alert}</span>
        <div>
          <div class="sig-title">${t.staleTitle}</div>
          <div class="sig-body">${t.staleBody(fmtAgo(sig.staleMinutes))}</div>
        </div>
      </div>
    `))
  }

  if (sig.appStoreLastTs){
    let after = matchTime && sig.appStoreLastTs > matchTime
    box.appendChild(cardEl2("signal-card glass" + (after ? " wo" : ""), `
      <div class="sig-row">
        <span class="sig-icon badge ${after ? "critical" : "info"}" style="padding:6px">${ICON.alert}</span>
        <div style="flex:1">
          <div class="sig-title">${t.appStoreTitle}</div>
          <div class="sig-body">${fmtDt(sig.appStoreLastTs)}</div>
          ${after ? `<div class="wo-badge">${t.woBadge}</div>` : ""}
        </div>
      </div>
    `))
  }

  if (sig.ffSessions && sig.ffSessions.length){
    let anyAfter = matchTime && sig.ffSessions.some(s => s.tsDate > matchTime)
    let rows = sig.ffSessions.map((s, i) => {
      let after = matchTime && s.tsDate > matchTime
      let label = i === 0 ? t.lastOpen : `+${i+1}`
      let col = loginColor(s.loginType)
      return `<div class="ff-session-row${after ? " after-match" : ""}">
        <span>${label} — <span class="ts">${fmtDt(s.tsDate)}</span>${after ? " ⚠️" : ""}</span>
        <span class="login-badge" style="background:${col}22; color:${col}">${s.loginType}</span>
      </div>`
    }).join("")
    box.appendChild(cardEl2("signal-card glass" + (anyAfter ? " wo" : ""), `
      <div class="sig-row">
        <span class="sig-icon badge ${anyAfter ? "critical" : "info"}" style="padding:6px">${ICON.network}</span>
        <div style="flex:1">
          <div class="sig-title">${sig.ffVersion || t.ffTitle}</div>
          <div class="sig-body">${t.ffSessionsCount(sig.ffSessionCount)}</div>
          ${rows}
          ${anyAfter ? `<div class="wo-badge">${t.woBadge}</div>` : `<div class="sig-body" style="margin-top:6px">${t.woHint}</div>`}
        </div>
      </div>
    `))
  }
}
function cardEl2(cls, html){ let d = document.createElement("div"); d.className = cls; d.innerHTML = html; return d }

// ---------- copiar resumen (texto plano, para pegar en un ticket/caso) ----------
let lastResultForCopy = null
function buildSummaryText(data, ipsFindings, ipsMeta, fileName){
  let { findings, cheatAppFindings, knownCheatFindings, proxyLoginFindings, sessionInfo, analystSignals } = data
  let critical = (ipsFindings||[]).filter(x=>x.category==="critical").length + cheatAppFindings.length + knownCheatFindings.length + proxyLoginFindings.length
  let score = computeScore(critical, findings.length)
  let matchTime = getMatchTime()
  let woFlag = false
  if (analystSignals){
    if (matchTime && analystSignals.appStoreLastTs && analystSignals.appStoreLastTs > matchTime) woFlag = true
    if (matchTime && analystSignals.ffSessions && analystSignals.ffSessions.some(s => s.tsDate > matchTime)) woFlag = true
  }

  let lines = []
  lines.push(`rqiemSS — Resumen de análisis`)
  lines.push(`Archivo: ${fileName || "?"}`)
  lines.push(`Fecha del análisis: ${fmtDt(new Date())}`)
  lines.push(``)
  lines.push(`Score: ${score}/100 — ${critical>0 || score<100 ? "SOSPECHOSO" : "LIMPIO"}`)
  lines.push(`Hallazgos críticos: ${critical}`)
  lines.push(`IPs/dominios sospechosos: ${findings.length}`)
  if (sessionInfo){
    lines.push(``)
    lines.push(`Inicio: ${fmtDt(sessionInfo.firstTs)}`)
    lines.push(`Último registro: ${fmtDt(sessionInfo.lastTs)}`)
    lines.push(`Conexiones totales: ${sessionInfo.totalConnections}`)
  }
  if (ipsMeta && ipsMeta.iosVersion) lines.push(`Versión iOS: ${ipsMeta.iosVersion}`)

  if (cheatAppFindings.length || (ipsFindings||[]).length){
    lines.push(``); lines.push(`Apps detectadas:`)
    cheatAppFindings.forEach(a => lines.push(`  - ${a.bundleID} (${a.desc})`))
    ;(ipsFindings||[]).forEach(a => lines.push(`  - ${a.bundleId} (${a.reason})`))
  }
  if (proxyLoginFindings.length){
    lines.push(``); lines.push(`Accesos sospechosos — Free Fire:`)
    proxyLoginFindings.forEach(p => lines.push(`  - ${p.domain} (usado por: ${p.bundles.join(", ")})`))
  }
  if (analystSignals){
    lines.push(``); lines.push(`Señales para analistas:`)
    if (analystSignals.staleWarning) lines.push(`  - Archivo posiblemente antiguo (último registro hace ${fmtAgo(analystSignals.staleMinutes)})`)
    if (analystSignals.appStoreLastTs) lines.push(`  - App Store abierta: ${fmtDt(analystSignals.appStoreLastTs)}`)
    if (analystSignals.ffSessions && analystSignals.ffSessions.length){
      lines.push(`  - ${analystSignals.ffVersion || "Free Fire"}: última apertura ${fmtDt(analystSignals.ffSessions[0].tsDate)} (${analystSignals.ffSessions[0].loginType})`)
    }
    lines.push(`  - ¿Aplicar W.O.?: ${woFlag ? "SÍ — hubo actividad después de la hora de partida cargada" : matchTime ? "No" : "No se cargó hora de partida"}`)
  }
  return lines.join("\n")
}
function copySummary(){
  if (!lastResultForCopy) return
  let text = buildSummaryText(lastResultForCopy.data, lastResultForCopy.ipsFindings, lastResultForCopy.ipsMeta, lastResultForCopy.fileName)
  navigator.clipboard.writeText(text).then(() => {
    let btn = document.getElementById("copySummaryBtn")
    btn.classList.add("copied")
    let span = document.getElementById("tCopySummary")
    let prev = span.textContent
    span.textContent = "¡Copiado!"
    setTimeout(() => { btn.classList.remove("copied"); span.textContent = prev }, 1800)
  }).catch(() => showToast("No se pudo copiar (el navegador bloqueó el portapapeles)."))
}

function renderSysdiagnoseSection(sysResult){
  let sysSection = document.getElementById("sysSection")
  if (!sysResult){ sysSection.style.display = "none"; return }
  sysSection.style.display = ""

  let devBox = document.getElementById("deviceCard")
  let bl = sysResult.deviceBlacklistMatch
  devBox.className = "device-card glass" + (bl ? " blacklisted" : "")
  devBox.innerHTML = `
    <div class="d-row"><span class="l">Serial</span><span class="v">${sysResult.deviceIdentity.serial || "?"}</span></div>
    <div class="d-row"><span class="l">UDID</span><span class="v">${sysResult.deviceIdentity.udid || "?"}</span></div>
    ${bl ? `<div class="wo-badge" style="margin-top:8px">🚩 En blacklist comunitaria — ${bl.reason || "sin motivo especificado"}</div>` : ""}
  `

  let items = sysResult.installFindings.map(f => ({
    sev: f.cheatMatch ? "critical" : (f.isSideload ? "medium" : "medium"),
    name: f.bundleId,
    desc: f.cheatMatch ? f.cheatMatch : (f.keywordMatch ? `Posible app de riesgo — palabra clave: "${f.keywordMatch}"` : `Instalada fuera de la App Store (distribuidor: ${f.distributor || "desconocido"})`),
    chips: [
      f.distributor ? `distribuidor: ${f.distributor}` : null,
      f.firstTs ? `primera vez: ${f.firstTs}` : null,
      f.hadUninstall ? "desinstalada durante el período" : null,
    ].filter(Boolean),
  }))
  document.getElementById("cntSys").textContent = items.length
  renderSection("listSys", items, (a,i) => findingCard(a.sev, ICON.alert, a.name, a.desc, a.chips, i))

  let note = document.getElementById("sysCrashNote")
  if (sysResult.crashFiles.length){
    note.textContent = `${sysResult.crashFiles.length} reporte(s) de fallas/uso encontrados en el sysdiagnose (informativo, no se listan todos acá).`
  } else {
    note.textContent = ""
  }
}

function renderResults(data, ipsFindings, ipsMeta, fileName, sysResult){
  lastResultForCopy = { data, ipsFindings, ipsMeta, fileName, sysResult }
  let t = T[currentLang]
  let findings = [], cheatAppFindings = [], knownCheatFindings = [], proxyLoginFindings = [], networkAvailable = true, sessionInfo = null, analystSignals = null, blacklistFindings = []
  if (data) ({ findings, cheatAppFindings, knownCheatFindings, proxyLoginFindings, networkAvailable, sessionInfo, analystSignals, blacklistFindings } = data)

  if (data){
    renderSessionCard(sessionInfo, ipsMeta)
    document.getElementById("sessionCard").style.display = ""
  } else {
    document.getElementById("sessionCard").style.display = "none"
  }
  renderAnalystSignals(analystSignals)

  let blSection = document.getElementById("blSection")
  if (blacklistFindings && blacklistFindings.length){
    blSection.style.display = ""
    document.getElementById("cntBL").textContent = blacklistFindings.length
    renderSection("listBL", blacklistFindings, (b,i) => findingCard("critical", ICON.alert, b.value, b.reason, [b.type === "bundle" ? "bundle ID" : "dominio"], i))
  } else {
    blSection.style.display = "none"
  }

  let sysCriticalCount = 0
  if (sysResult){
    sysCriticalCount = sysResult.installFindings.filter(f => f.cheatMatch || f.isSideload).length + (sysResult.deviceBlacklistMatch ? 1 : 0)
  }
  let criticalCount = (ipsFindings||[]).filter(x=>x.category==="critical").length + cheatAppFindings.length + knownCheatFindings.length + proxyLoginFindings.length + sysCriticalCount
  let suspectCount = findings.length
  let score = computeScore(criticalCount, suspectCount)
  paintScore(score, criticalCount)
  document.getElementById("scoreMeta").textContent =
    `${criticalCount} crítico(s) · ${suspectCount} sospechoso(s)`

  let statRow = document.getElementById("statRow")
  statRow.innerHTML = ""
  let appCount = cheatAppFindings.length + (ipsFindings||[]).length
  statRow.appendChild(statPill(appCount, t.statApps))
  statRow.appendChild(statPill(proxyLoginFindings.length, t.statFF))
  statRow.appendChild(statPill(knownCheatFindings.length, t.statInfra))
  statRow.appendChild(statPill(findings.length, t.statIPs))

  let appItems = []
  cheatAppFindings.forEach(a => appItems.push({ sev: a.possible ? "medium" : "critical", name:a.bundleID, desc:a.desc, chips:[`${a.hits} ${t.hits}`, ...(a.domains||[]).slice(0,2)] }))
  ;(ipsFindings||[]).forEach(a => appItems.push({ sev:a.category, name:a.bundleId, desc:a.reason, chips:a.count?[`${a.count} ${t.hits}`]:[] }))
  document.getElementById("cntApps").textContent = appItems.length
  renderSection("listApps", appItems, (a,i) => findingCard(a.sev, ICON.alert, a.name, a.desc, a.chips, i))

  document.getElementById("cntFF").textContent = proxyLoginFindings.length
  renderSection("listFF", proxyLoginFindings, (p,i) => findingCard("critical", ICON.alert, p.domain, `${t.usedBy}: ${p.bundles.join(", ")}`, [`${p.hits} ${t.hits}`], i))

  document.getElementById("cntInfra").textContent = knownCheatFindings.length
  renderSection("listInfra", knownCheatFindings, (k,i) => findingCard("critical", ICON.network, k.indicator, k.desc, [`${k.hits} ${t.hits}`, ...(k.bundles||[])], i))

  document.getElementById("cntIPs").textContent = findings.length
  renderSection("listIPs", findings, (f,i) => findingCard(f.severity, ICON.network, f.domain,
    `${f.ip}${f.country!=="?" ? " — "+f.country : ""}${f.isp!=="?" ? " · "+f.isp : ""}<br>${t.reason}: ${f.reasons.join("; ")}`,
    [], i))

  let netNote = document.getElementById("netNote")
  if (data && !networkAvailable){ netNote.style.display = "flex"; netNote.innerHTML = ICON.info + `<span>${t.netUnavailable}</span>` }
  else netNote.style.display = "none"

  renderSysdiagnoseSection(sysResult)

  document.getElementById("results").classList.add("show")
  document.getElementById("loadingCard").classList.remove("show")
  document.getElementById("results").scrollIntoView({ behavior:"smooth", block:"start" })
}

// ===== FLUJO PRINCIPAL =====
async function runAnalysis(){
  let t = T[currentLang]
  let ndjsonFile = uploadedFiles.find(f => f.kind === "ndjson")
  let ipsFile = uploadedFiles.find(f => f.kind === "ips")
  let sysdiagFile = uploadedFiles.find(f => f.kind === "sysdiagnose")
  let unknownFile = uploadedFiles.find(f => f.kind === "unknown")

  if (!ndjsonFile && !sysdiagFile){ showToast(t.needNdjson); return }
  if (unknownFile){ showToast(`"${unknownFile.name}" ${t.invalidFile}`); return }

  let entries = null
  if (ndjsonFile){
    entries = parseNdjson(ndjsonFile.content)
    let validation = validateReport(entries)
    if (!validation.ok){ showToast(validation.reason); return }
  }

  document.getElementById("runBtn").disabled = true
  document.getElementById("results").classList.remove("show")
  document.getElementById("loadingCard").classList.add("show")
  renderPhaseList()
  setProgress(2, "")

  let ipsFindings = []
  let ipsMeta = { iosVersion: null, rootsInstalled: 0 }
  if (ipsFile){
    let parsed = parseIpsFile(ipsFile.content)
    ipsFindings = analyzeIps(parsed)
    if (parsed.header){
      let osMatch = (parsed.header.os_version || "").match(/iPhone OS ([\d.]+)/)
      ipsMeta.iosVersion = osMatch ? osMatch[1] : (parsed.header.os_version || null)
      ipsMeta.rootsInstalled = parsed.header.roots_installed || 0
    }
  }

  // si hay ambos, el reporte principal ocupa 0-55% y el sysdiagnose 55-100%;
  // si hay uno solo, ese ocupa el 0-100% completo
  let hasBoth = !!(entries && sysdiagFile)
  let mainRange = hasBoth ? [0, 55] : [0, 100]
  let sysRange  = hasBoth ? [55, 100] : [0, 100]
  function scaled(range, pct){ return Math.round(range[0] + (pct/100) * (range[1]-range[0])) }

  try{
    let result = null
    if (entries){
      result = await analyze(entries, (pct, note) => setProgress(scaled(mainRange, pct), note))
    }
    let sysResult = null
    if (sysdiagFile){
      sysResult = await analyzeSysdiagnose(sysdiagFile.file, (pct, note) => setProgress(scaled(sysRange, pct), note))
    }
    setProgress(100, "")
    renderResults(result, ipsFindings, ipsMeta, ndjsonFile ? ndjsonFile.name : null, sysResult)
    if (result) saveToHistory(result, ipsFindings, ndjsonFile.name)
  } catch(e){
    console.error(e)
    showToast("Error: " + e.message + " (ver consola)")
    document.getElementById("loadingCard").classList.remove("show")
  } finally {
    document.getElementById("runBtn").disabled = false
  }
}

// ===== EVENTOS =====
window.addEventListener("DOMContentLoaded", () => {
  checkAuthOnLoad()

  applyLang()
  document.querySelectorAll("#langbar button").forEach(b => b.addEventListener("click", () => { currentLang = b.dataset.lang; applyLang() }))

  let dz = document.getElementById("dropzone")
  let input = document.getElementById("fileInput")
  dz.addEventListener("click", () => input.click())
  input.addEventListener("change", () => handleFiles(input.files))
  ;["dragover","dragenter"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add("drag") }))
  ;["dragleave","drop"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove("drag") }))
  dz.addEventListener("drop", e => { if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files) })

  document.getElementById("runBtn").addEventListener("click", runAnalysis)
  document.getElementById("copySummaryBtn").addEventListener("click", copySummary)

  document.getElementById("tutorialBtn").addEventListener("click", openTutorial)
  document.getElementById("tutorialClose").addEventListener("click", closeTutorial)
  document.getElementById("tutorialOverlay").addEventListener("click", e => { if (e.target.id === "tutorialOverlay") closeTutorial() })

  document.getElementById("historyBtn").addEventListener("click", openHistory)
  document.getElementById("historyClose").addEventListener("click", closeHistory)
  document.getElementById("historyOverlay").addEventListener("click", e => { if (e.target.id === "historyOverlay") closeHistory() })
  document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory)

  document.getElementById("socialDiscord").href = SOCIAL_LINKS.discord
  document.getElementById("socialInstagram").href = SOCIAL_LINKS.instagram
  document.getElementById("socialLink").href = SOCIAL_LINKS.portfolio
})
