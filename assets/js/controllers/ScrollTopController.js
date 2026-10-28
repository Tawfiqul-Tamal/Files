/*=============== SCROLL TO TOP (progress ring) ===============*/
(() => {
   const button = document.getElementById('scroll-top')
   const progress = document.getElementById('scroll-top-progress')
   const label = document.getElementById('scroll-top-label')
   if (!button || !progress) return

   const radius = Number(progress.getAttribute('r')) || 21
   const circumference = 2 * Math.PI * radius
   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
   progress.style.strokeDasharray = String(circumference)
   progress.style.strokeDashoffset = String(circumference)

   let ticking = false

   const update = () => {
      ticking = false
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      progress.style.strokeDashoffset = String(circumference * (1 - ratio))
      if (label) label.textContent = `Back to top · ${Math.round(ratio * 100)}%`
      button.classList.toggle('is-visible', window.scrollY > 400)
   }

   const requestUpdate = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
   }

   button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' })
      button.blur()
   })

   window.addEventListener('scroll', requestUpdate, { passive: true })
   window.addEventListener('resize', requestUpdate)
   update()
})()
