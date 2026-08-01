// ============================================================
// CONFIGURACIÓN — editá esto con tus propios datos
// ============================================================

// Tus redes/links — poné acá tus URLs reales.
const SOCIAL_LINKS = {
  discord:   "https://discord.gg/tu-invite",
  instagram: "https://instagram.com/tu-usuario",
  portfolio: "https://tu-biolink-o-portfolio.com",
}

// Blacklist comunitaria — bundle IDs y dominios que ustedes confirmaron a mano
// (no incluidos todavía en las listas incorporadas del scanner). Se cruza
// automáticamente contra cada análisis y se muestra en una sección aparte.
//
// ⚠ Nota técnica: el App Privacy Report de iOS NO expone el HWID real del
// dispositivo (Apple no lo permite), así que esto no es una blacklist de
// hardware — es de bundle ID de apps y de dominios confirmados.
const COMMUNITY_BLACKLIST = {
  bundleIds: [
    // { id: "com.ejemplo.cheatapp", reason: "Reportado por la comunidad — panel de aimbot" },
  ],
  domains: [
    // { domain: "panel-ejemplo.com", reason: "Servidor de cheat confirmado por un caso anterior" },
  ],
  // Dispositivos confirmados (del sysdiagnose — serial y/o UDID, lo que tengan
  // cargado en el caso; con que coincida uno de los dos alcanza).
  deviceIds: [
    // { serial: "F17DK53T0DY3", udid: null, reason: "Baneado en torneo anterior — cheat confirmado" },
  ],
}
