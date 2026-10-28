/*=============== SCROLL TO TOP ON LOAD ===============*/
if ('scrollRestoration' in history) {
   history.scrollRestoration = 'manual'
}

function scrollPageToTop() {
   if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
   }
}

scrollPageToTop()

function getScrollOffset() {
   const header = document.getElementById('header')
   const buffer = 12
   return header ? header.offsetHeight + buffer : 72
}

function updateScrollOffsetVar() {
   document.documentElement.style.setProperty('--scroll-offset', `${getScrollOffset()}px`)
}

window.getScrollOffset = getScrollOffset
updateScrollOffsetVar()
window.addEventListener('resize', updateScrollOffsetVar, { passive: true })

window.addEventListener('load', () => {
   document.body.style.height = 'auto'
   document.documentElement.style.height = 'auto'
   scrollPageToTop()
})

/*=============== HOME SPLIT TEXT ===============*/
const homeSplit = document.getElementById('home-split')
if (homeSplit && typeof anime !== 'undefined') {
   const text = homeSplit.textContent
   homeSplit.innerHTML = text.split('').map((char) =>
      `<span class="home__split-char">${char === ' ' ? '&nbsp;' : char}</span>`
   ).join('')

   anime({
      targets: '.home__split-char',
      translateY: [40, 0],
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 1200,
      delay: anime.stagger(60)
   })
}

/*=============== MOBILE NAV (see MobileNavController.js) ===============*/

document.querySelectorAll('a[href^="#"]').forEach((link) => {
   link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return

      const target = document.querySelector(hash)
      if (!target) return

      event.preventDefault()
      window.portfolioCloseNavMenu?.()

      const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset()
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      window.scrollTo({
         top: Math.max(0, top),
         behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })

      if (hash !== window.location.hash) {
         history.pushState(null, '', hash)
      }

      window.setTimeout(scrollActive, prefersReducedMotion ? 0 : 350)
   })
})

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
const scrollProgressBar = document.getElementById('scroll-progress-bar')

function scrollActive() {
   const scrollY = window.pageYOffset
   const offset = getScrollOffset()
   let currentId = null

   // the active section is the last one whose top edge has been reached (avoids overlapping ranges)
   sections.forEach((section) => {
      if (scrollY + 2 >= section.offsetTop - offset) currentId = section.getAttribute('id')
   })

   sections.forEach((section) => {
      const sectionId = section.getAttribute('id')
      const link = document.querySelector(`.nav__link[href*="${sectionId}"]`)
      link?.classList.toggle('active-link', sectionId === currentId)
   })
}

/*=============== HEADER SCROLL ===============*/
function scrollHeader() {
   const header = document.getElementById('header')
   if (window.scrollY >= 50) {
      header?.classList.add('scroll-header')
   } else {
      header?.classList.remove('scroll-header')
   }
}

/*=============== SCROLL PERFORMANCE (RAF) ===============*/
let scrollFramePending = false

function runScrollTasks() {
   scrollActive()
   scrollHeader()

   if (scrollProgressBar) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      scrollProgressBar.style.width = `${Math.min(progress, 100)}%`
   }

   scrollFramePending = false
}

function queueScrollTasks() {
   if (scrollFramePending) return
   scrollFramePending = true
   requestAnimationFrame(runScrollTasks)
}

window.addEventListener('scroll', queueScrollTasks, { passive: true })
window.addEventListener('resize', queueScrollTasks, { passive: true })
window.addEventListener('load', queueScrollTasks)
queueScrollTasks()

/*=============== CUSTOM CURSOR ===============*/
const cursor = document.getElementById('cursor')
const cursorFollower = document.getElementById('cursor-follower')

if (cursor && cursorFollower && window.matchMedia('(pointer:fine)').matches) {
   let cursorFramePending = false
   let cursorX = 0
   let cursorY = 0

   document.addEventListener('mousemove', (event) => {
      cursorX = event.clientX
      cursorY = event.clientY
      if (!cursor.classList.contains('cursor-ready')) {
         cursor.classList.add('cursor-ready')
         cursorFollower.classList.add('cursor-ready')
      }

      if (cursorFramePending) return
      cursorFramePending = true

      requestAnimationFrame(() => {
         cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`
         cursorFollower.style.transform = `translate(${cursorX}px, ${cursorY}px)`
         cursorFramePending = false
      })
   }, { passive: true })

   document.querySelectorAll('a, button:not(#projects-prev-btn):not(#projects-next-btn), .about__skill--link').forEach((el) => {
      el.addEventListener('mouseenter', () => {
         cursor.classList.add('cursor-large')
         cursorFollower.classList.add('cursor-large')
      })
      el.addEventListener('mouseleave', () => {
         cursor.classList.remove('cursor-large')
         cursorFollower.classList.remove('cursor-large')
      })
   })
}

/*=============== SCROLL REVEAL ANIMATION ===============*/
if (typeof ScrollReveal !== 'undefined') {
   const sr = ScrollReveal({
      origin: 'bottom',
      distance: '48px',
      duration: 1400,
      delay: 150,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      reset: false
   })

   sr.reveal('.home__data', { origin: 'left', distance: '60px', duration: 1600 })
   sr.reveal('.home__image', { origin: 'right', distance: '60px', duration: 1600, delay: 200 })
   sr.reveal('.section__title', { delay: 100, distance: '36px' })
   sr.reveal('.about__description', { delay: 120, distance: '32px' })
   sr.reveal('.about__resume-actions', { delay: 180, distance: '32px' })
   sr.reveal('.about__skill', { interval: 100, distance: '40px' })
   sr.reveal('.projects__filters', { interval: 70, distance: '28px' })
   sr.reveal('#projects .section__title', { delay: 100, distance: '30px' })
   sr.reveal('.projects__slider', { delay: 200, distance: '36px' })
   sr.reveal('#journey .section__title', { delay: 100, distance: '30px' })
   sr.reveal('.journey__academic-progress', { delay: 120, distance: '32px' })
   sr.reveal('.journey__tab', { interval: 70, distance: '24px' })
   sr.reveal('.journey__hint', { delay: 160, distance: '20px' })
   sr.reveal('#work .section__title', { origin: 'left', distance: '40px' })
   sr.reveal('.work__card', { interval: 140, distance: '44px' })
   sr.reveal('#services .section__title', { delay: 100 })
   sr.reveal('.services__item', { interval: 120, distance: '40px' })
   sr.reveal('#technologies .section__title', { delay: 100, distance: '30px' })
   sr.reveal('.tech__stat', { interval: 80, distance: '32px' })
   sr.reveal('.tech__tab', { interval: 60, distance: '22px' })
   sr.reveal('.tech__panels', { delay: 160, distance: '28px' })
   sr.reveal('.achievements__stat-card', { interval: 90, distance: '36px' })
   sr.reveal('.achievements__hint', { delay: 160, distance: '20px' })
   sr.reveal('.contact__title-left', { origin: 'left', distance: '40px' })
   sr.reveal('.contact__description', { origin: 'left', distance: '32px', delay: 80 })
   sr.reveal('#copy-email', { origin: 'left', distance: '28px', delay: 140 })
   sr.reveal('.contact__form', { origin: 'right', distance: '40px', delay: 120 })
   sr.reveal('.contact__group', { interval: 100, distance: '32px' })
   sr.reveal('.contact__form-footer', { origin: 'right', distance: '28px', delay: 180 })

   document.body.style.height = 'auto'
   document.documentElement.style.height = 'auto'
   scrollPageToTop()
   requestAnimationFrame(scrollPageToTop)
}
