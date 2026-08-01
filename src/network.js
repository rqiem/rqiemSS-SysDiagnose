// ===== NETWORK: todo con timeout duro — nada puede colgar la UI =====
// A diferencia de Scriptable, el navegador aplica CORS y bloquea contenido
// mixto (http:// desde una página https://). Por eso cada llamada de red es
// "best effort": si falla o tarda de más, se corta sola y el análisis sigue
// con lo que ya tiene (heurísticas por dominio/TLD/keyword, que no dependen
// de la red).
const NET_TIMEOUT_MS = 4000

function fetchWithTimeout(url, options) {
  let controller = new AbortController()
  let timer = setTimeout(() => controller.abort(), NET_TIMEOUT_MS)
  return fetch(url, Object.assign({}, options, { signal: controller.signal }))
    .finally(() => clearTimeout(timer))
}

let netLookupUnavailable = false // se marca true en el primer fallo, para no reintentar de más

async function lookupBatchSafe(targets) {
  if (netLookupUnavailable) return []
  try {
    let resp = await fetchWithTimeout(`http://ip-api.com/batch?fields=${FIELDS}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(targets),
    })
    if (!resp.ok) throw new Error("HTTP " + resp.status)
    let results = await resp.json()
    if (!Array.isArray(results)) return []
    return results
  } catch(e) {
    console.error("lookupBatchSafe: no disponible en este navegador — " + e)
    netLookupUnavailable = true
    return []
  }
}

function isIPv4(s) { return /^(\d{1,3}\.){3}\d{1,3}$/.test(s) }
function isIPv6(s) { return s.includes(":") && !s.includes(".") }
function isIP(s) { return isIPv4(s) || isIPv6(s) }

function classifyIP(info, domain) {
  if (!info) return { severity: null, reasons: [] }
  let reasons = []
  let severity = null
  let tldFlag = false

  let domLow = (domain || "").toLowerCase()
  for (let tld of SUSPICIOUS_TLDS) {
    if (domLow.endsWith(tld) || domLow.includes(tld + "/")) {
      severity = "HIGH"
      tldFlag = true
      reasons.push(`TLD sospechoso: "${tld}" — patrón común en cheats/proxies`)
      break
    }
  }
  if (!tldFlag) {
    let parts = domLow.split(".")[0]
    for (let word of SUSPICIOUS_DOMAIN_WORDS) {
      if (parts.includes(word) || domLow.includes(word + ".")) {
        severity = "HIGH"
        tldFlag = true
        reasons.push(`Palabra sospechosa en el dominio: "${word}"`)
        break
      }
    }
  }

  if (info.hosting) { severity = "HIGH"; reasons.push(`VPS/HOSTING — ISP: ${info.isp}`) }
  if (info.proxy)   { severity = "HIGH"; reasons.push("PROXY / VPN detectado") }

  let asn = (info.as || "").split(" ")[0].toUpperCase()
  if (CHEAT_PROXY_ASN[asn]) {
    let isCloudflare = asn === "AS13335"
    if (isCloudflare) {
      let domainIsIP = /^[\d.:]+$/.test(domain || "")
      if (domainIsIP) {
        severity = "HIGH"
        reasons.push(`Cloudflare accedido por IP directa — patrón de proxy cheat (${asn})`)
      }
    } else {
      severity = "HIGH"
      reasons.push(`ASN de proxy cheat conocido: ${asn} — ${CHEAT_PROXY_ASN[asn]}`)
    }
  }

  let rdns = (info.reverse || "").toLowerCase()
  if (rdns) {
    for (let pattern of RDNS_HOSTING_PATTERNS) {
      if (rdns.includes(pattern)) { severity = severity || "HIGH"; reasons.push(`rDNS de servidor: ${info.reverse}`); break }
    }
    if (rdns.match(/^srv\d+\.hstgr\.cloud$/)) {
      severity = "HIGH"
      reasons.push(`Hostinger VPS (patrón proxy cheat BR): ${info.reverse}`)
    }
  } else if (info.hosting) {
    reasons.push("Sin rDNS (PTR) — típico de VPS usado como proxy")
  }

  let orgLower = ((info.org || "") + " " + (info.isp || "") + " " + (info.as || "")).toLowerCase()
  for (let kw of VPS_HOSTING_KEYWORDS) {
    if (orgLower.includes(kw)) { severity = severity || "MEDIUM"; reasons.push(`Org/ISP asociado a hosting/proxy cheat: ${kw}`); break }
  }

  return { severity, reasons }
}

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
