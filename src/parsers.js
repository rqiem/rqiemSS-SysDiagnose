// ===== PARSERS: lectura y validación de los archivos subidos =====
function parseNdjson(content) {
  let trimmed = content.trim()
  if (trimmed.startsWith("[")) {
    try { return JSON.parse(trimmed) } catch(e) { console.error("parseNdjson: array inválido — " + e); return null }
  }
  return trimmed
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .map(l => { try { return JSON.parse(l) } catch(e) { return null } })
    .filter(Boolean)
}

function parseIpsFile(content) {
  try {
    let trimmed = content.trim()
    let lines = trimmed.split("\n").map(l => l.trim()).filter(Boolean)
    let headerLine = lines.find(l => l.startsWith("{"))
    let dataLine   = lines.find(l => l.startsWith("["))
    let header = null
    try { header = headerLine ? JSON.parse(headerLine) : null } catch(e) { console.error("parseIpsFile: header inválido — " + e) }
    let entries = []
    try { entries = dataLine ? JSON.parse(dataLine) : [] } catch(e) { console.error("parseIpsFile: entries inválido — " + e) }
    return { header, entries }
  } catch(e) {
    return { header: null, entries: [] }
  }
}

function looksLikePrivacyReport(content) {
  let sample = content.trim().slice(0, 500)
  return sample.includes("networkActivity") || sample.includes("bundleID") || sample.includes("timeStamp")
}

function looksLikeUsageFile(content) {
  let sample = content.trim().slice(0, 300)
  return sample.includes("xp_amp_app_usage") || sample.includes("roots_installed") || sample.includes("usageClientId")
}

function validateReport(entries) {
  if (!entries || entries.length === 0)
    return { ok: false, reason: "Archivo vacío o sin entradas válidas." }

  let hasNet    = entries.some(e => e.type === "networkActivity")
  let hasAccess = entries.some(e => e.type === "access")
  let hasBundleID = entries.some(e => e.bundleID || (e.accessor && e.accessor.identifier))
  let hasTimestamp = entries.some(e => e.timeStamp)

  if (!hasNet && !hasAccess)
    return { ok: false, reason: "No se encontraron entradas de red o de acceso.\nEsto no parece ser un App Privacy Report válido." }
  if (!hasBundleID)
    return { ok: false, reason: "No se encontró ningún bundleID.\nEl archivo puede estar corrompido o modificado." }
  if (!hasTimestamp)
    return { ok: false, reason: "No se encontró ningún timestamp.\nEl archivo puede estar corrompido o modificado." }

  let timestamps = entries.map(e => e.timeStamp).filter(Boolean)
  let valid = timestamps.filter(t => {
    let y = parseInt(t.slice(0,4))
    return y >= 2020 && y <= 2030
  })
  if (valid.length < timestamps.length * 0.5)
    return { ok: false, reason: "Timestamps fuera del rango esperado.\nEl archivo puede haber sido adulterado." }

  let netEntries = entries.filter(e => e.type === "networkActivity")
  let validNet = netEntries.filter(e => e.domain && e.bundleID)
  if (netEntries.length > 0 && validNet.length < netEntries.length * 0.3)
    return { ok: false, reason: "Muchas entradas de red sin domain/bundleID.\nEl archivo puede haber sido manipulado." }

  return { ok: true }
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
