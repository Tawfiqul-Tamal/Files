/*=============== NAV: sliding active indicator (desktop) ===============*/
(() => {
   const list = document.querySelector('.nav__list')
   if (!list) return

   const indicator = document.createElement('span')
   indicator.className = 'nav__indicator'
   indicator.setAttribute('aria-hidden', 'true')
   list.prepend(indicator)

   const desktop = window.matchMedia('(min-width: 1024px)')

   const place = () => {
      const active = list.querySelector('.nav__link.active-link')
      if (!desktop.matches || !active) {
         indicator.style.opacity = '0'
         return
      }
      const listBox = list.getBoundingClientRect()
      const linkBox = active.getBoundingClientRect()
      indicator.style.width = `${linkBox.width}px`
      indicator.style.transform = `translateX(${linkBox.left - listBox.left}px)`
      indicator.style.opacity = '1'
   }

   new MutationObserver(place).observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] })
   window.addEventListener('resize', place)
   if (document.fonts && document.fonts.ready) document.fonts.ready.then(place)
   window.addEventListener('load', place)
   window.setTimeout(place, 400)
   place()

   // in-capsule scroll progress
   const fill = document.getElementById('nav-progress-fill')
   let ticking = false
   const updateProgress = () => {
      ticking = false
      if (!fill) return
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      fill.style.transform = `scaleX(${ratio})`
   }
   window.addEventListener('scroll', () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(updateProgress)
   }, { passive: true })
   updateProgress()
})()
