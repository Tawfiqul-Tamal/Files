/**
 * Developer Journey — year tabs toggle (click again to hide)
 * About stat cards can scroll here and toggle journey content
 */
(function () {
   'use strict'

   let tabs, cards, grid, creditsHideBtn, semesterHideBtn, academicProgress
   let activeTab = null
   let activeMode = null
   let lastStatKey = null

   function setActiveTab(tab) {
      activeTab = tab

      tabs.forEach((item) => {
         const isActive = item === tab
         item.classList.toggle('journey__tab-active', isActive)
         item.setAttribute('aria-selected', isActive ? 'true' : 'false')
      })
   }

   function clearTabSelection() {
      activeTab = null
      tabs.forEach((item) => {
         item.classList.remove('journey__tab-active')
         item.setAttribute('aria-selected', 'false')
      })
   }

   function setCreditsHideVisible(visible) {
      if (!creditsHideBtn) return
      creditsHideBtn.hidden = !visible
   }

   function setSemesterHideVisible(visible) {
      if (!semesterHideBtn) return
      semesterHideBtn.hidden = !visible
   }

   function setAcademicProgressVisible(visible) {
      if (!academicProgress) return

      academicProgress.classList.toggle('journey__academic-progress--visible', visible)
      academicProgress.setAttribute('aria-hidden', visible ? 'false' : 'true')
   }

   function setCreditsExpanded(expanded) {
      grid?.classList.toggle('journey__grid--expanded', expanded)
   }

   function hideAll() {
      activeMode = null
      lastStatKey = null

      cards.forEach((card) => {
         card.classList.add('journey__card-hidden')
         card.classList.remove('journey__card--focused')
      })

      clearTabSelection()
      setCreditsHideVisible(false)
      setSemesterHideVisible(false)
      setAcademicProgressVisible(false)
      setCreditsExpanded(false)

      if (grid) {
         grid.classList.add('journey__grid-idle')
      }

      document.querySelectorAll('.about__stat-journey').forEach((el) => {
         el.classList.remove('about__skill--active')
      })
   }

   function updateGridIdle(visibleCount) {
      if (grid) {
         grid.classList.toggle('journey__grid-idle', visibleCount === 0)
      }
   }

   function filterByYear(year) {
      let visibleCount = 0

      activeMode = 'year'
      setCreditsHideVisible(false)
      setSemesterHideVisible(false)
      setAcademicProgressVisible(false)
      setCreditsExpanded(false)

      cards.forEach((card) => {
         const match = card.dataset.year === year
         card.classList.toggle('journey__card-hidden', !match)
         card.classList.remove('journey__card--focused')
         if (match) visibleCount++
      })

      updateGridIdle(visibleCount)
   }

   function showCreditsCards() {
      let visibleCount = 0

      activeMode = 'credits'
      clearTabSelection()
      setAcademicProgressVisible(true)
      setCreditsExpanded(true)

      cards.forEach((card) => {
         const isSchool = card.dataset.year === 'school'
         card.classList.toggle('journey__card-hidden', isSchool)
         card.classList.remove('journey__card--focused')
         if (!isSchool) visibleCount++
      })

      updateGridIdle(visibleCount)
      setCreditsHideVisible(true)
   }

   function focusCard(termSlug) {
      if (!termSlug) return

      const target = Array.from(cards).find(
         (card) => card.dataset.term === termSlug && !card.classList.contains('journey__card-hidden')
      )

      if (!target) return

      cards.forEach((card) => card.classList.remove('journey__card--focused'))
      target.classList.add('journey__card--focused')

      requestAnimationFrame(() => {
         target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
   }

   function scrollToJourney() {
      const target = academicProgress?.classList.contains('journey__academic-progress--visible')
         ? academicProgress
         : document.getElementById('journey')
      if (!target) return

      const top = target.getBoundingClientRect().top + window.scrollY - (window.getScrollOffset?.() ?? 72)
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
   }

   function scrollToAboutStats(statKey) {
      const target = statKey
         ? document.querySelector(`.about__stat-journey[data-stat-key="${statKey}"]`)
         : null
      const section = target || document.getElementById('about-stats') || document.getElementById('about')
      if (!section) return

      const top = section.getBoundingClientRect().top + window.scrollY - (window.getScrollOffset?.() ?? 72)
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
   }

   function matchesStatState(mode, year) {
      if (activeMode === null) return false
      if (mode === 'credits') return activeMode === 'credits'
      if (mode === 'all') return activeMode === 'all'
      return activeMode === 'year' && activeTab?.dataset.year === year
   }

   function activateFromStat(statEl) {
      const mode = statEl.dataset.journeyMode
      const year = statEl.dataset.journeyYear || ''
      const focus = statEl.dataset.journeyFocus || ''
      const statKey = statEl.dataset.statKey || ''

      if (lastStatKey === statKey && matchesStatState(mode, year)) {
         hideAll()
         if (mode === 'credits') {
            scrollToAboutStats('136')
         } else if (statKey === '12th') {
            scrollToAboutStats('12th')
         }
         return
      }

      lastStatKey = statKey

      document.querySelectorAll('.about__stat-journey').forEach((el) => {
         el.classList.toggle('about__skill--active', el === statEl)
      })

      scrollToJourney()

      if (mode === 'credits') {
         showCreditsCards()
         return
      }

      if (mode === 'all') {
         showCreditsCards()
         return
      }

      if (mode === 'year' && year) {
         const tab = Array.from(tabs).find((item) => item.dataset.year === year)
         if (tab) {
            setActiveTab(tab)
            filterByYear(year)
            if (statKey === '12th') {
               setSemesterHideVisible(true)
            }
            if (focus) {
               requestAnimationFrame(() => focusCard(focus))
            }
         }
      }
   }

   function init() {
      tabs = document.querySelectorAll('.journey__tab')
      cards = document.querySelectorAll('.journey__card')
      grid = document.getElementById('journey-grid')
      creditsHideBtn = document.getElementById('journey-credits-hide')
      semesterHideBtn = document.getElementById('journey-semester-hide')
      academicProgress = document.getElementById('journey-academic-progress')

      if (!tabs.length || !cards.length) return

      tabs.forEach((tab) => {
         tab.addEventListener('click', () => {
            if (activeTab === tab) {
               hideAll()
               return
            }

            lastStatKey = null
            document.querySelectorAll('.about__stat-journey').forEach((el) => {
               el.classList.remove('about__skill--active')
            })

            setActiveTab(tab)
            filterByYear(tab.dataset.year)
         })
      })

      document.querySelectorAll('.about__stat-journey').forEach((statEl) => {
         statEl.addEventListener('click', (event) => {
            event.preventDefault()
            activateFromStat(statEl)
         })
      })

      creditsHideBtn?.addEventListener('click', () => {
         hideAll()
         scrollToAboutStats('136')
      })

      semesterHideBtn?.addEventListener('click', () => {
         hideAll()
         scrollToAboutStats('12th')
      })

      hideAll()
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
   } else {
      init()
   }
})()
