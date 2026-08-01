// ===== SYSDIAGNOSE — extracción y análisis 100% en el navegador =====
// Sin librerías externas: DecompressionStream (nativo) para el gzip,
// un lector de TAR propio (abajo) para navegar el archivo sin cargar
// los ~2000 archivos que trae un sysdiagnose completo — solo materializamos
// el contenido de los que nos interesan.

// ---------- lector de TAR mínimo ----------
function readOctalTar(bytes, offset, length) {
  let str = ""
  for (let i = 0; i < length; i++) {
    let c = bytes[offset + i]
    if (c === 0 || c === 32) break
    str += String.fromCharCode(c)
  }
  return str.trim() ? parseInt(str.trim(), 8) : 0
}
function readStringTar(bytes, offset, length) {
  let end = offset
  while (end < offset + length && bytes[end] !== 0) end++
  return new TextDecoder("utf-8").decode(bytes.slice(offset, end))
}
function parseTar(bytes, keepFn) {
  let results = []
  let offset = 0
  let longName = null
  while (offset + 512 <= bytes.length) {
    let allZero = true
    for (let i = 0; i < 512; i++) { if (bytes[offset + i] !== 0) { allZero = false; break } }
    if (allZero) { offset += 512; continue }

    let name = readStringTar(bytes, offset, 100)
    let size = readOctalTar(bytes, offset + 124, 12)
    let typeFlag = String.fromCharCode(bytes[offset + 156] || 0)
    let prefix = readStringTar(bytes, offset + 345, 155)
    let fullName = longName || (prefix ? prefix + "/" + name : name)
    longName = null

    let dataStart = offset + 512
    let paddedSize = Math.ceil(size / 512) * 512

    if (typeFlag === "L") {
      longName = readStringTar(bytes, dataStart, size)
    } else if (typeFlag === "0" || typeFlag === "\0" || typeFlag === "") {
      if (keepFn(fullName)) results.push({ path: fullName, content: bytes.slice(dataStart, dataStart + size) })
    }
    offset = dataStart + paddedSize
  }
  return results
}

function isJunkPath(path) {
  let base = path.split("/").pop()
  return base.startsWith("._") || base === ".DS_Store"
}
function wantedSysdiagPath(path) {
  if (isJunkPath(path)) return false
  return path.includes("remotectl_dumpstate.txt") ||
         path.includes("logs/MobileInstallation/mobile_installation.log") ||
         path.includes("logs/MobileInstallation/mobile_installation_helper.log") ||
         (path.includes("crashes_and_spins/") && path.endsWith(".ips") && !path.includes("/Retired/")) ||
         path.includes("SystemVersion/SystemVersion.plist")
}

// ---------- descompresión gzip nativa (DecompressionStream, sin librerías) ----------
async function gunzipFile(file) {
  let ds = new DecompressionStream("gzip")
  let stream = file.stream().pipeThrough(ds)
  let reader = stream.getReader()
  let chunks = []
  let total = 0
  while (true) {
    let { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    total += value.length
  }
  let out = new Uint8Array(total)
  let off = 0
  for (let c of chunks) { out.set(c, off); off += c.length }
  return out
}

// ---------- parser del log de instalación (texto plano) ----------
function parseInstallLog(text) {
  let events = []
  let lines = text.split("\n")
  const RE_INSTALLING = /^(\w+ \w+ \d+ [\d:]+ \d{4}).*-\[MIInstaller _installInstallable:.*?\]: (Installing|Staging) <MIInstallableBundle ID=([^;]+);.*?Version=([^,]*), ShortVersion=([^>]*)>/
  const RE_SUCCESS = /^(\w+ \w+ \d+ [\d:]+ \d{4}).*-\[MIInstaller _logOperationCompletionWithStartTime:distributorID:\]: (?:Install successful for|Staging update successful for) \([^:]+:([^)]+)\) \[Distributor: ([^\]]*)\]/
  const RE_UNINSTALL = /^(\w+ \w+ \d+ [\d:]+ \d{4}).*-\[MIUninstaller _uninstallBundleWithIdentity:.*?\]: Uninstalling identifier (\S+)/
  const RE_SIG_FAIL = /^(\w+ \w+ \d+ [\d:]+ \d{4}).*Failed to verify code signature of (\S+) : .*?\((.*?)\)/
  for (let line of lines) {
    let m
    if ((m = line.match(RE_INSTALLING))) events.push({ ts: m[1], type: m[2] === "Installing" ? "install" : "stage", bundleId: m[3], version: m[5] || m[4] })
    else if ((m = line.match(RE_SUCCESS))) events.push({ ts: m[1], type: "success", bundleId: m[2], distributor: m[3] })
    else if ((m = line.match(RE_UNINSTALL))) events.push({ ts: m[1], type: "uninstall", bundleId: m[2] })
    else if ((m = line.match(RE_SIG_FAIL))) events.push({ ts: m[1], type: "sigfail", path: m[2], reason: m[3] })
  }
  return events
}

// ---------- análisis principal ----------
async function analyzeSysdiagnose(file, onProgress) {
  const emit = (pct, note) => { if (onProgress) onProgress(pct, note) }

  emit(5, "Descomprimiendo archivo (puede tardar, es grande)")
  let bytes = await gunzipFile(file)

  emit(35, "Recorriendo el archivo TAR")
  let extracted = parseTar(bytes, wantedSysdiagPath)
  bytes = null // liberar memoria del buffer descomprimido completo cuanto antes

  emit(55, "Extrayendo identidad del dispositivo")
  let deviceIdentity = { serial: null, udid: null }
  let remote = extracted.find(e => e.path.includes("remotectl_dumpstate.txt"))
  if (remote) {
    let text = new TextDecoder("utf-8").decode(remote.content)
    let serial = text.match(/SerialNumber\s*=>\s*(\S+)/)
    let udid = text.match(/UniqueDeviceID\s*=>\s*(\S+)/)
    deviceIdentity.serial = serial ? serial[1] : null
    deviceIdentity.udid = udid ? udid[1] : null
  }

  emit(65, "Analizando historial de instalación")
  let installEvents = []
  for (let e of extracted) {
    if (e.path.includes("mobile_installation.log")) {
      let text = new TextDecoder("utf-8").decode(e.content)
      installEvents.push(...parseInstallLog(text))
    }
  }
  installEvents.sort((a, b) => new Date(a.ts) - new Date(b.ts))

  // agrupar por bundle ID: última info de éxito/distribuidor + eventos install/uninstall
  let byBundle = new Map()
  for (let ev of installEvents) {
    if (!ev.bundleId) continue
    let nb = normBundle(ev.bundleId)
    if (!byBundle.has(nb)) byBundle.set(nb, { bundleId: ev.bundleId, events: [], distributor: null })
    let entry = byBundle.get(nb)
    entry.events.push(ev)
    if (ev.type === "success") entry.distributor = ev.distributor
  }

  let installFindings = []
  const FF_LEGIT_BUNDLES_SYS = new Set(["com.dts.freefireth", "com.dts.freefiremax"])
  for (let [nb, entry] of byBundle) {
    let isSideload = entry.distributor && entry.distributor !== "com.apple.AppStore"
    let cheatMatch = CHEAT_APPS_CI.get(nb) || null
    let keywordMatch = !cheatMatch && bundleKeywordMatch(nb)
    let isDtsImpersonation = !FF_LEGIT_BUNDLES_SYS.has(nb) && nb.startsWith("com.dts.")
    if (isDtsImpersonation && !cheatMatch) cheatMatch = "Suplanta el prefijo del desarrollador de Free Fire (com.dts.*) con un producto distinto — posible app camuflada"
    if (isSideload || cheatMatch || keywordMatch) {
      installFindings.push({
        bundleId: entry.bundleId,
        distributor: entry.distributor,
        isSideload,
        cheatMatch,
        keywordMatch,
        firstTs: entry.events[0] ? entry.events[0].ts : null,
        lastTs: entry.events[entry.events.length - 1] ? entry.events[entry.events.length - 1].ts : null,
        hadUninstall: entry.events.some(e => e.type === "uninstall"),
        hadSigFail: false,
      })
    }
  }
  // marcar fallos de firma que compartan timestamp cercano (informativo, no exacto)
  let sigFails = installEvents.filter(e => e.type === "sigfail")

  emit(80, "Revisando reportes de fallas")
  let crashFiles = extracted
    .filter(e => e.path.includes("crashes_and_spins/") && e.path.endsWith(".ips"))
    .map(e => e.path.split("/").pop())

  emit(90, "Cruzando con blacklist comunitaria")
  let deviceBlacklistMatch = null
  if (COMMUNITY_BLACKLIST && COMMUNITY_BLACKLIST.deviceIds) {
    for (let entry of COMMUNITY_BLACKLIST.deviceIds) {
      if ((deviceIdentity.serial && entry.serial === deviceIdentity.serial) ||
          (deviceIdentity.udid && entry.udid === deviceIdentity.udid)) {
        deviceBlacklistMatch = entry
        break
      }
    }
  }

  emit(97, "Preparando resultados")
  return { deviceIdentity, installFindings, sigFails, crashFiles, deviceBlacklistMatch, totalFilesInArchive: extracted.length }
}
