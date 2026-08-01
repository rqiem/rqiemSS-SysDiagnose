// ===== FONDO ANIMADO — red de nodos + partículas flotantes =====
;(function(){
  let canvas = document.getElementById("bgCanvas")
  let ctx = canvas.getContext("2d")
  let w, h, nodes = [], particles = []
  let reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  const LINK_DIST = 130
  const COLOR_NODE = "108,140,255"
  const COLOR_LINK = "108,140,255"
  const COLOR_PARTICLE_A = "51,214,176"   // teal
  const COLOR_PARTICLE_B = "108,140,255" // índigo

  function resize(){
    w = window.innerWidth; h = window.innerHeight
    canvas.width = w * DPR; canvas.height = h * DPR
    canvas.style.width = w + "px"; canvas.style.height = h + "px"
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

    let count = Math.round((w * h) / 22000)
    count = Math.max(18, Math.min(70, count))
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: 1 + Math.random() * 1.4,
    }))

    let pCount = Math.max(14, Math.min(46, Math.round((w * h) / 32000)))
    particles = Array.from({ length: pCount }, () => spawnParticle(Math.random()*h))
  }

  function spawnParticle(startY){
    return {
      x: Math.random() * w,
      y: startY !== undefined ? startY : h + 10,
      vy: -(0.12 + Math.random() * 0.22),
      vx: (Math.random() - 0.5) * 0.08,
      r: 0.6 + Math.random() * 1.6,
      baseAlpha: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() < 0.55 ? COLOR_PARTICLE_A : COLOR_PARTICLE_B,
    }
  }

  function step(t){
    ctx.clearRect(0, 0, w, h)

    // red de nodos
    for (let n of nodes){
      n.x += n.vx; n.y += n.vy
      if (n.x < 0 || n.x > w) n.vx *= -1
      if (n.y < 0 || n.y > h) n.vy *= -1
    }
    for (let i = 0; i < nodes.length; i++){
      for (let j = i+1; j < nodes.length; j++){
        let a = nodes[i], b = nodes[j]
        let dx = a.x-b.x, dy = a.y-b.y
        let dist = Math.sqrt(dx*dx + dy*dy)
        if (dist < LINK_DIST){
          ctx.strokeStyle = `rgba(${COLOR_LINK},${0.13 * (1 - dist/LINK_DIST)})`
          ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke()
        }
      }
    }
    for (let n of nodes){
      ctx.fillStyle = `rgba(${COLOR_NODE},0.45)`
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2); ctx.fill()
    }

    // partículas flotantes (embers subiendo despacio, con parpadeo suave)
    for (let p of particles){
      p.y += p.vy; p.x += p.vx
      p.phase += 0.02
      let twinkle = 0.65 + 0.35 * Math.sin(p.phase)
      ctx.fillStyle = `rgba(${p.color},${p.baseAlpha * twinkle})`
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill()
      if (p.y < -10){ Object.assign(p, spawnParticle()) }
      if (p.x < -10) p.x = w + 10
      if (p.x > w + 10) p.x = -10
    }

    if (!reduceMotion) requestAnimationFrame(step)
  }

  window.addEventListener("resize", resize)
  resize()
  step() // dibuja siempre al menos un frame; si hay reduced-motion, queda estático
})()
