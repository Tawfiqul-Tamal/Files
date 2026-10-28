/**
 * Projects carousel with category filters — 2 slides per page (desktop), 1 on mobile
 */
(function () {
   'use strict'

   const DESKTOP_BREAKPOINT = 768
   const GAP = 16

   let carousel, track, viewport, allSlides, slides, dotsContainer, counterEl, filtersContainer
   let currentPage = 0
   let activeFilter = 'all'
   let touchStartX = 0

   function getPerView() {
      return window.innerWidth >= DESKTOP_BREAKPOINT ? 2 : 1
   }

   function refreshSlides() {
      slides = Array.from(allSlides).filter((slide) => !slide.classList.contains('projects__slide-hidden'))
   }

   function getTotalPages() {
      if (!slides.length) return 1
      return Math.ceil(slides.length / getPerView())
   }

   function getViewportWidth() {
      return viewport.clientWidth
   }

   function getSlideWidth() {
      const perView = getPerView()
      const vw = getViewportWidth()
      return Math.floor((vw - GAP * (perView - 1)) / perView)
   }

   function getPageWidth() {
      const perView = getPerView()
      return perView * (getSlideWidth() + GAP)
   }

   function setSlideSizes() {
      const slideWidth = getSlideWidth()
      allSlides.forEach((slide) => {
         slide.style.flex = `0 0 ${slideWidth}px`
         slide.style.width = `${slideWidth}px`
      })
      track.style.gap = `${GAP}px`
   }

   function buildDots() {
      dotsContainer.innerHTML = ''
      const pages = getTotalPages()
      for (let i = 0; i < pages; i++) {
         const dot = document.createElement('button')
         dot.type = 'button'
         dot.className = 'projects__dot' + (i === currentPage ? ' projects__dot-active' : '')
         dot.setAttribute('aria-label', `Projects page ${i + 1}`)
         dot.addEventListener('click', () => goToPage(i))
         dotsContainer.appendChild(dot)
      }
   }

   function updateCounter() {
      if (!counterEl) return

      if (!slides.length) {
         counterEl.textContent = '00 / 00'
         return
      }

      const perView = getPerView()
      const start = currentPage * perView + 1
      const end = Math.min(start + perView - 1, slides.length)
      const startStr = String(start).padStart(2, '0')
      const endStr = String(end).padStart(2, '0')
      const totalStr = String(slides.length).padStart(2, '0')
      counterEl.textContent =
         start === end ? `${startStr} / ${totalStr}` : `${startStr}-${endStr} / ${totalStr}`
   }

   function updateUI() {
      const maxPage = getTotalPages() - 1
      if (currentPage > maxPage) currentPage = maxPage
      if (currentPage < 0) currentPage = 0

      setSlideSizes()
      track.classList.add('is-sliding')
      track.style.transform = slides.length
         ? `translate3d(-${Math.round(currentPage * getPageWidth())}px, 0, 0)`
         : 'translate3d(0, 0, 0)'

      const dots = dotsContainer.querySelectorAll('.projects__dot')
      dots.forEach((dot, i) => {
         dot.classList.toggle('projects__dot-active', i === currentPage)
      })

      updateCounter()
   }

   function goToPage(page) {
      const maxPage = getTotalPages() - 1
      currentPage = Math.max(0, Math.min(page, maxPage))
      updateUI()
   }

   let isNavigating = false

   function nextPage() {
      if (isNavigating || !slides.length) return
      isNavigating = true
      goToPage(currentPage + 1)
      setTimeout(() => { isNavigating = false }, 400)
   }

   function prevPage() {
      if (isNavigating || !slides.length) return
      isNavigating = true
      goToPage(currentPage - 1)
      setTimeout(() => { isNavigating = false }, 400)
   }

   function setActiveFilterButton(filter) {
      filtersContainer?.querySelectorAll('.projects__filter').forEach((button) => {
         const isActive = button.dataset.filter === filter
         button.classList.toggle('projects__filter-active', isActive)
         button.setAttribute('aria-selected', isActive ? 'true' : 'false')
      })
   }

   function applyFilter(filter) {
      activeFilter = filter

      allSlides.forEach((slide) => {
         const category = slide.dataset.category || ''
         const show = filter === 'all' || category === filter
         slide.classList.toggle('projects__slide-hidden', !show)
         slide.setAttribute('aria-hidden', show ? 'false' : 'true')
      })

      refreshSlides()
      currentPage = 0
      setActiveFilterButton(filter)
      buildDots()
      updateUI()
   }

   function initFilters() {
      filtersContainer = document.getElementById('projects-filters')
      if (!filtersContainer) return

      filtersContainer.addEventListener('click', (event) => {
         const button = event.target.closest('.projects__filter')
         if (!button) return

         const filter = button.dataset.filter
         if (!filter || filter === activeFilter) return

         applyFilter(filter)
      })
   }

   function initProjectImages() {
      document.querySelectorAll('.projects__img').forEach((img) => {
         const fallback = img.dataset.fallback || ''

         function applyFallback() {
            if (!fallback || img.dataset.fallbackApplied === 'true') return

            img.dataset.fallbackApplied = 'true'
            img.src = fallback
            img.classList.remove('projects__img--screenshot', 'projects__img--cover')
            img.classList.add('projects__img--placeholder')
            markLoaded()
         }

         function markLoaded() {
            img.classList.remove('is-loading')
            img.classList.add('is-loaded')
         }

         img.classList.add('is-loading')

         if (img.complete) {
            if (img.naturalWidth > 0) {
               markLoaded()
            } else {
               applyFallback()
            }
         } else {
            img.addEventListener('load', markLoaded, { once: true })
            img.addEventListener('error', applyFallback, { once: true })
         }
      })
   }

   function init() {
      initProjectImages()

      carousel = document.getElementById('projects-carousel')
      track = document.getElementById('projects-track')
      viewport = document.getElementById('projects-viewport')
      allSlides = document.querySelectorAll('#projects-track .projects__slide')
      dotsContainer = document.getElementById('projects-dots')
      counterEl = document.getElementById('projects-counter')

      if (!carousel || !track || !viewport || !allSlides.length || !dotsContainer) {
         return
      }

      refreshSlides()
      initFilters()
      buildDots()
      updateUI()

      document.getElementById('projects-prev-btn')?.addEventListener('click', (e) => {
         e.preventDefault()
         e.stopPropagation()
         prevPage()
      })

      document.getElementById('projects-next-btn')?.addEventListener('click', (e) => {
         e.preventDefault()
         e.stopPropagation()
         nextPage()
      })

      carousel.addEventListener('touchstart', (e) => {
         touchStartX = e.changedTouches[0].screenX
      }, { passive: true })

      carousel.addEventListener('touchend', (e) => {
         const diff = touchStartX - e.changedTouches[0].screenX
         if (Math.abs(diff) > 50) {
            diff > 0 ? nextPage() : prevPage()
         }
      }, { passive: true })

      window.addEventListener('resize', () => {
         buildDots()
         updateUI()
      })

      track.addEventListener('transitionend', (event) => {
         if (event.propertyName === 'transform') {
            track.classList.remove('is-sliding')
         }
      })

      window.ProjectsCarousel = { next: nextPage, prev: prevPage, goToPage, applyFilter }
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
   } else {
      init()
   }
})()
