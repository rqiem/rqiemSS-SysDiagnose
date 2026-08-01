// ===== ANÁLISIS: misma lógica de detección que la versión Scriptable =====
// (se sacó el "probe" de bajo nivel HTTP a dominios arbitrarios: en el navegador
// eso choca con CORS casi siempre y no aportaba nada confiable ahí)
//
// Endurecido contra evasión simple:
//  - normDomain()/normBundle() para que mayúsculas, espacios o un punto final
//    no rompan las comparaciones contra las listas.
//  - CHEAT_APPS_CI / IPS_CHEAT_EXACT_CI: versión case-insensitive de las listas
//    exactas, para no depender de que el bundle ID venga con el casing exacto.
//  - Fallback por palabra clave TAMBIÉN para apps vistas en el Privacy Report
//    (antes solo existía para el archivo .ips) — así una app de cheat nueva,
//    que todavía no está en la lista exacta, igual puede quedar marcada como
//    "posible" en vez de pasar 100% desapercibida.
function normDomain(d) { return (d || "").trim().toLowerCase().replace(/\.$/, "") }
function normBundle(b) { return (b || "").trim().toLowerCase() }

const CHEAT_APPS_CI = new Map(Object.entries(CHEAT_APPS).map(([k, v]) => [normBundle(k), v]))
const IPS_CHEAT_EXACT_CI = new Set([...IPS_CHEAT_EXACT].map(normBundle))
const IPS_CHEAT_CATEGORIES_CI = new Map(Object.entries(IPS_CHEAT_CATEGORIES).map(([k, v]) => [normBundle(k), v]))

function bundleKeywordMatch(bidLower) {
  for (let kw of IPS_CHEAT_KEYWORDS) {
    if (bidLower.includes(kw)) return kw
  }
  return null
}

function analyzeIps(parsed) {
  let entries = parsed.entries || parsed || []
  let results = []
  let seen = new Set()

  for (let e of entries) {
    let bidRaw = e.bundleId || ""
    let bid = normBundle(bidRaw)
    if (!bid || seen.has(bid)) continue
    seen.add(bid)

    let reason = null
    let category = "warning"

    if (IPS_CHEAT_EXACT_CI.has(bid)) {
      reason = CHEAT_APPS_CI.get(bid) || bidRaw
      category = IPS_CHEAT_CATEGORIES_CI.get(bid) || "warning"
    } else {
      let kw = bundleKeywordMatch(bid)
      if (kw) reason = `Palabra clave sospechosa: "${kw}" en el bundle ID`
    }

    if (!reason) {
      const FF_LEGIT = ["com.dts.freefireth", "com.dts.freefiremax"]
      if (!FF_LEGIT.includes(bid) && (bid.startsWith("com.dts.freefireth") || bid.startsWith("com.dts.freefiremax") || bid.includes("freefire"))) {
        reason = "Copia sospechosa de Free Fire — bundle ID modificado"
        category = "critical"
      }
    }

    if (reason) {
      results.push({ bundleId: bidRaw, version: e.shortAppVersion || "?", eventType: e.eventType || "?", count: e.count || 0, reason, category })
    }
  }
  return results
}

async function analyze(entries, onProgress) {
  const emit = (pct, note) => { if (onProgress) onProgress(pct, note) }

  let netEntries = entries.filter(e => e.type === "networkActivity")

  // ---- Resumen de sesión: mismo cálculo que tenía el reporte original ----
  let allTimestamps = netEntries.map(e => e.timeStamp).filter(Boolean).sort()
  let firstTs = allTimestamps.length ? new Date(allTimestamps[0]) : null
  let lastTs  = allTimestamps.length ? new Date(allTimestamps[allTimestamps.length - 1]) : null
  let uptimeMs = (firstTs && lastTs) ? (lastTs - firstTs) : null
  let uniqueDomainsTotal = new Set(netEntries.map(e => e.domain || "")).size
  let sessionInfo = { firstTs, lastTs, uptimeMs, totalConnections: netEntries.length, uniqueDomainsTotal }

  // ---- Señales para analistas: mismo cálculo que tenía el reporte original ----
  let staleWarning = false, staleMinutes = 0
  if (lastTs) {
    let diffFromNow = Math.floor((new Date() - lastTs) / 60000)
    staleMinutes = diffFromNow
    if (diffFromNow > 15) staleWarning = true
  }

  let appStoreEntries = netEntries
    .filter(e => e.bundleID === "com.apple.AppStore" && e.timeStamp)
    .sort((a, b) => b.timeStamp.localeCompare(a.timeStamp))
  let appStoreLastTs = appStoreEntries.length ? new Date(appStoreEntries[0].timeStamp) : null

  const FF_BUNDLES = ["com.dts.freefiremax", "com.dts.freefireth"]
  const FF_FB_LOGIN_DOMAIN = "m.facebook.com"
  const FF_SECONDARY_DOMAINS = {
    "twitter.com": "Login Twitter/X", "api.twitter.com": "Login Twitter/X",
    "oauth2.googleapis.com": "Login Gmail", "accounts.google.com": "Login Gmail", "apis.google.com": "Login Gmail",
    "api.vk.com": "Login VK", "login.vk.com": "Login VK",
  }
  let ffAll = netEntries
    .filter(e => FF_BUNDLES.includes(e.bundleID) && e.timeStamp)
    .sort((a, b) => a.timeStamp.localeCompare(b.timeStamp))

  let ffSessionGroups = []
  let _cur = []
  for (let e of ffAll) {
    if (_cur.length === 0) { _cur.push(e); continue }
    let gap = new Date(e.timeStamp) - new Date(_cur[_cur.length-1].timeStamp)
    if (gap > 2 * 60 * 1000) { ffSessionGroups.push(_cur); _cur = [e] }
    else _cur.push(e)
  }
  if (_cur.length > 0) ffSessionGroups.push(_cur)

  function resolveSession(group) {
    let domains = new Set(group.map(e => e.domain))
    let anchor = group[group.length - 1]
    if (domains.has(FF_FB_LOGIN_DOMAIN)) return { ts: anchor.timeStamp, loginType: "Login Facebook" }
    for (let d of domains) { if (FF_SECONDARY_DOMAINS[d]) return { ts: anchor.timeStamp, loginType: FF_SECONDARY_DOMAINS[d] } }
    return null
  }

  let ffSessions = ffSessionGroups
    .map(resolveSession)
    .filter(Boolean)
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 3)
    .map(s => ({ ...s, tsDate: new Date(s.ts) }))

  let ffVersion = ffAll.length > 0 ? (ffAll[0].bundleID === "com.dts.freefiremax" ? "Free Fire MAX" : "Free Fire") : null

  let analystSignals = {
    staleWarning, staleMinutes,
    appStoreLastTs,
    ffSessions, ffVersion, ffSessionCount: ffAll.length,
  }

  // ---- Blacklist comunitaria (bundle IDs / dominios agregados a mano) ----
  let blacklistFindings = []
  if (COMMUNITY_BLACKLIST && (COMMUNITY_BLACKLIST.bundleIds.length || COMMUNITY_BLACKLIST.domains.length)) {
    let blSeenBundles = new Set()
    for (let entry of COMMUNITY_BLACKLIST.bundleIds) {
      let nb = normBundle(entry.id)
      let hit = netEntries.find(e => normBundle(e.bundleID) === nb)
      if (hit && !blSeenBundles.has(nb)) {
        blSeenBundles.add(nb)
        blacklistFindings.push({ type: "bundle", value: entry.id, reason: entry.reason || "En la blacklist comunitaria" })
      }
    }
    let blSeenDomains = new Set()
    for (let entry of COMMUNITY_BLACKLIST.domains) {
      let nd = (entry.domain || "").toLowerCase()
      let hit = netEntries.find(e => (e.domain || "").toLowerCase() === nd || (e.domain || "").toLowerCase().endsWith("." + nd))
      if (hit && !blSeenDomains.has(nd)) {
        blSeenDomains.add(nd)
        blacklistFindings.push({ type: "domain", value: entry.domain, reason: entry.reason || "En la blacklist comunitaria" })
      }
    }
  }

  let domainHits = {}
  let domainBundles = {}
  for (let e of netEntries) {
    if (IGNORED_BUNDLES.has(e.bundleID)) continue
    let d = normDomain(e.domain)
    if (!d) continue
    domainHits[d] = (domainHits[d] || 0) + (e.hits || 1)
    if (!domainBundles[d]) domainBundles[d] = new Set()
    domainBundles[d].add(e.bundleID || "?")
  }

  let allDomains = Object.entries(domainHits).sort((a, b) => b[1] - a[1]).map(([d]) => d)
  emit(15, `${allDomains.length} dominios únicos detectados`)

  // allBundles: bundleID normalizado -> uno de los bundleID originales vistos (para mostrar)
  // Se arma con networkActivity Y con entradas "access" — una app puede estar
  // instalada y haber accedido a datos sin que quede una conexión de red
  // capturada en la ventana del reporte. Antes solo se miraba networkActivity,
  // así que un cheat "silencioso" en ese sentido pasaba 100% desapercibido.
  let allBundles = new Map()
  for (let e of netEntries) {
    if (!e.bundleID || IGNORED_BUNDLES.has(e.bundleID)) continue
    let nb = normBundle(e.bundleID)
    if (!allBundles.has(nb)) allBundles.set(nb, e.bundleID)
  }
  for (let e of entries) {
    if (e.type !== "access") continue
    let bidRaw = e.accessor && e.accessor.identifier
    if (!bidRaw || IGNORED_BUNDLES.has(bidRaw)) continue
    let nb = normBundle(bidRaw)
    if (!allBundles.has(nb)) allBundles.set(nb, bidRaw)
  }

  const FF_LEGIT_BUNDLES = new Set(["com.dts.freefireth", "com.dts.freefiremax"])
  let ffFakeFindings = []
  for (let [nb, bidRaw] of allBundles) {
    if (FF_LEGIT_BUNDLES.has(nb)) continue
    // clon con "freefire" en el nombre, O directamente suplantando el prefijo del
    // desarrollador real (com.dts.*) con un nombre de producto distinto — ambos son
    // señales de impersonación, la segunda es más engañosa todavía
    let isFFClone = nb.startsWith("com.dts.freefireth") || nb.startsWith("com.dts.freefiremax") ||
                    nb.includes("freefire") || nb.includes("freefir") || nb.startsWith("com.dts.")
    if (isFFClone) {
      let appEntries = netEntries.filter(e => normBundle(e.bundleID) === nb)
      let appHits = appEntries.reduce((s, e) => s + (e.hits || 1), 0)
      let appDomains = [...new Set(appEntries.map(e => e.domain).filter(Boolean))]
      ffFakeFindings.push({ bundleID: bidRaw, desc: "Copia sospechosa de Free Fire — bundle ID modificado", hits: appHits, domains: appDomains })
    }
  }

  let cheatAppFindings = []
  let matchedBundles = new Set()
  for (let [nb, desc] of CHEAT_APPS_CI) {
    if (allBundles.has(nb)) {
      matchedBundles.add(nb)
      let bidRaw = allBundles.get(nb)
      let appEntries = netEntries.filter(e => normBundle(e.bundleID) === nb)
      let appHits = appEntries.reduce((s, e) => s + (e.hits || 1), 0)
      let appDomains = [...new Set(appEntries.map(e => e.domain).filter(Boolean))]
      let fullDesc = appHits === 0 ? `${desc} (detectada por instalación/acceso — sin red capturada en la ventana del reporte)` : desc
      cheatAppFindings.push({ bundleID: bidRaw, desc: fullDesc, hits: appHits, domains: appDomains })
    }
  }

  // Apps que no están en la lista exacta pero el bundle ID tiene una palabra
  // clave de cheat/proxy/jailbreak — quedan marcadas como "posible" en vez de
  // pasar de largo. Esto es lo que antes solo se aplicaba al archivo .ips.
  let possibleAppFindings = []
  for (let [nb, bidRaw] of allBundles) {
    if (matchedBundles.has(nb) || FF_LEGIT_BUNDLES.has(nb)) continue
    let kw = bundleKeywordMatch(nb)
    if (kw) {
      let appEntries = netEntries.filter(e => normBundle(e.bundleID) === nb)
      let appHits = appEntries.reduce((s, e) => s + (e.hits || 1), 0)
      let appDomains = [...new Set(appEntries.map(e => e.domain).filter(Boolean))]
      possibleAppFindings.push({ bundleID: bidRaw, desc: `Posible app de riesgo — palabra clave sospechosa: "${kw}"`, hits: appHits, domains: appDomains, possible: true })
    }
  }

  cheatAppFindings = [...ffFakeFindings, ...cheatAppFindings, ...possibleAppFindings]

  let ffLegitDomainsSeen = new Set()
  for (let e of netEntries) {
    let d = normDomain(e.domain)
    let bid = normBundle(e.bundleID)
    if (FF_LEGIT_CALLERS.has(bid) && FF_PROXY_LOGIN_DOMAINS.has(d)) ffLegitDomainsSeen.add(d)
  }

  let proxyLoginFindings = []
  let proxyLoginSeen = {}
  for (let e of netEntries) {
    let d = normDomain(e.domain)
    let bidRaw = e.bundleID || ""
    let bid = normBundle(bidRaw)
    if (!bid) continue
    if (FF_LEGIT_CALLERS.has(bid)) continue
    if (IGNORED_BUNDLES.has(bidRaw) || IGNORED_BUNDLES.has(bid)) continue
    if (!FF_PROXY_LOGIN_DOMAINS.has(d)) continue
    if (ffLegitDomainsSeen.has(d)) continue
    if (!proxyLoginSeen[d]) proxyLoginSeen[d] = { domain: e.domain, bundles: new Set(), hits: 0 }
    proxyLoginSeen[d].bundles.add(bidRaw)
    proxyLoginSeen[d].hits += (e.hits || 1)
  }
  for (let [d, info] of Object.entries(proxyLoginSeen)) {
    proxyLoginFindings.push({ domain: info.domain, bundles: [...info.bundles], hits: info.hits })
  }

  let knownCheatFindings = []
  for (let e of netEntries) {
    let d = normDomain(e.domain)
    let bidRaw = e.bundleID || ""
    let bid = normBundle(bidRaw)
    if (FF_LEGIT_CALLERS.has(bid) && FF_PROXY_LOGIN_DOMAINS.has(d)) continue
    for (let [indicator, desc] of Object.entries(KNOWN_CHEAT_INFRA)) {
      let indLow = normDomain(indicator)
      if (d === indLow || d.endsWith("." + indLow)) {
        if (FF_PROXY_LOGIN_DOMAINS.has(indLow) && FF_LEGIT_CALLERS.has(bid)) continue
        let existing = knownCheatFindings.find(k => k.indicator === indicator)
        if (existing) { existing.hits += (e.hits || 1); if (bidRaw) existing.bundles.add(bidRaw) }
        else knownCheatFindings.push({ indicator, desc, hits: e.hits || 1, bundles: new Set(bidRaw ? [bidRaw] : []) })
      }
    }
  }
  knownCheatFindings = knownCheatFindings.map(k => ({ ...k, bundles: [...k.bundles] }))

  const CHUNK = 100
  let candidates = []
  let totalChunks = Math.max(1, Math.ceil(allDomains.length / CHUNK))

  for (let i = 0; i < allDomains.length; i += CHUNK) {
    let chunk = allDomains.slice(i, i + CHUNK)
    let chunkNum = Math.floor(i / CHUNK) + 1
    emit(20 + Math.round((chunkNum / totalChunks) * 55), `Consultando hosting/ASN — lote ${chunkNum}/${totalChunks}`)

    let results = await lookupBatchSafe(chunk)

    for (let j = 0; j < chunk.length; j++) {
      let info = results[j] || null
      let domain = chunk[j]
      let ip = (info && info.query) || domain

      if (FALSE_POSITIVE_IPS.has(ip) || FALSE_POSITIVE_IPS.has(domain)) continue

      let domLow2 = domain.toLowerCase()
      let alreadyKnownInfra = Object.keys(KNOWN_CHEAT_INFRA).some(k => domLow2 === k.toLowerCase() || domLow2.endsWith("." + k.toLowerCase()))
      if (alreadyKnownInfra) continue // ya aparece en la sección de infraestructura conocida, más específica

      let firstLabel = domLow2.split(".")[0]
      let matchedTld = SUSPICIOUS_TLDS.find(t => domLow2.endsWith(t))
      let matchedWord = SUSPICIOUS_DOMAIN_WORDS.find(w => firstLabel.includes(w))

      let severity = null, reasons = []
      if (info && info.status === "success") {
        let classified = classifyIP(info, domain)
        severity = classified.severity
        reasons  = classified.reasons
      }
      // Sin datos de red: el TLD es una señal razonablemente confiable por sí sola (HIGH).
      // Una palabra sola en el dominio (ej. "proxy", "relay") es más débil — términos como
      // "gateway" o "relay" también los usan CDNs/APIs legítimas (Instagram, Meta, Fastly,
      // etc.), así que sin confirmación de hosting/ASN se marca MEDIUM, no HIGH.
      if (!severity && matchedTld) {
        severity = "HIGH"
        reasons = [`TLD sospechoso: dominio termina en "${matchedTld}" — patrón común en servidores de cheat`]
      } else if (!severity && matchedWord) {
        severity = "MEDIUM"
        reasons = [`Palabra de riesgo "${matchedWord}" en el dominio — sin confirmar por falta de datos de hosting/ASN`]
      }
      if (!severity) continue
      let isTldSuspect = !!matchedTld

      candidates.push({
        severity, domain, ip,
        country: (info && info.country) || "?", city: (info && info.city) || "?",
        isp: (info && info.isp) || "?", org: (info && info.org) || "?", as: (info && info.as) || "?",
        hosting: (info && info.hosting) || false, proxy: (info && info.proxy) || false,
        reverse: (info && info.reverse) || "",
        hits: domainHits[domain], bundles: [...domainBundles[domain]].slice(0, 4),
        reasons, tldSuspect: isTldSuspect,
      })
    }
    // sin este chunk no hay más lotes que consultar, así que no esperamos de más
    if (i + CHUNK < allDomains.length && !netLookupUnavailable) await wait(1200)
  }

  emit(80, "Ordenando hallazgos")

  // Sin heurística que dependa de red: usamos directamente candidates como findings
  let findings = candidates.map(c => ({ ...c }))

  const ASN_SET = new Set(Object.keys(CHEAT_PROXY_ASN))
  function hasSuspiciousTLD(domain) {
    let d = (domain || "").toLowerCase()
    return SUSPICIOUS_TLDS.some(t => d.endsWith(t) || d.includes(t + "/")) ||
           SUSPICIOUS_DOMAIN_WORDS.some(w => d.split(".")[0].includes(w))
  }
  findings.sort((a, b) => {
    let aTld = hasSuspiciousTLD(a.domain) ? 0 : 1
    let bTld = hasSuspiciousTLD(b.domain) ? 0 : 1
    if (aTld !== bTld) return aTld - bTld
    let aAsn = (a.as || "").split(" ")[0].toUpperCase()
    let bAsn = (b.as || "").split(" ")[0].toUpperCase()
    let aKnown = ASN_SET.has(aAsn) ? 0 : 1
    let bKnown = ASN_SET.has(bAsn) ? 0 : 1
    if (aKnown !== bKnown) return aKnown - bKnown
    let sevOrder = { HIGH: 0, MEDIUM: 1 }
    if (a.severity !== b.severity) return sevOrder[a.severity] - sevOrder[b.severity]
    return b.hits - a.hits
  })

  let ghostAppFindings = []
  const GHOST_SUSPECT_DOMAINS = new Set(Object.keys(KNOWN_CHEAT_INFRA).map(normDomain))
  let suspectByBundle = {}
  for (let e of netEntries) {
    let bid = e.bundleID || ""
    let bidNorm = normBundle(bid)
    let dom = normDomain(e.domain)
    if (!bid) continue
    if (FF_LEGIT_CALLERS.has(bidNorm) && FF_PROXY_LOGIN_DOMAINS.has(dom)) continue
    let isKnown = GHOST_SUSPECT_DOMAINS.has(dom)
    let isTld = SUSPICIOUS_TLDS.some(t => dom.endsWith(t))
    if (isKnown || isTld) {
      if (!suspectByBundle[bid]) suspectByBundle[bid] = { domains: [], hits: 0 }
      suspectByBundle[bid].domains.push(e.domain)
      suspectByBundle[bid].hits += (e.hits || 1)
    }
  }
  for (let [bid, info] of Object.entries(suspectByBundle)) {
    ghostAppFindings.push({ bundleID: bid, domains: [...new Set(info.domains)], hits: info.hits })
  }

  emit(95, "Preparando resultados")
  return { findings, netEntries, cheatAppFindings, knownCheatFindings, ghostAppFindings, proxyLoginFindings, networkAvailable: !netLookupUnavailable, sessionInfo, analystSignals, blacklistFindings }
}
