// ===== ARRANQUE — splash puramente decorativo, sin control de acceso =====
// (la página es gratis y pública, así que se sacó el gate de códigos.
// Si en algún momento vuelven a necesitar acceso restringido, la versión
// anterior con ACCESS_CODES + sha256 queda en el historial de git.)
const BOOT_TAGLINES = ["Inicializando…", "Cargando reglas de detección…", "Conectando con la red…"]

function showApp(){
  let boot = document.getElementById("bootOverlay")
  boot.classList.add("leaving")
  setTimeout(() => { boot.style.display = "none" }, 500)
  document.getElementById("appRoot").style.display = ""
}

function playBootSequence(){
  let tagEl = document.getElementById("bootTagline")
  let i = 0
  tagEl.textContent = BOOT_TAGLINES[0]
  let interval = setInterval(() => {
    i++
    if (i >= BOOT_TAGLINES.length){
      clearInterval(interval)
      showApp()
      return
    }
    tagEl.style.opacity = 0
    setTimeout(() => { tagEl.textContent = BOOT_TAGLINES[i]; tagEl.style.opacity = 1 }, 200)
  }, 650)
}

function checkAuthOnLoad(){
  playBootSequence()
}
