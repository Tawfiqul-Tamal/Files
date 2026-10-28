/**
 * Technologies & Tools — stat cards, expand panels, category tabs
 */
(function () {
   'use strict'

   function init() {
      const tabs = document.querySelectorAll('.tech__tab')
      const panels = document.querySelectorAll('.tech__panel')
      const panelsWrap = document.getElementById('tech-panels')
      const expandWrap = document.getElementById('tech-expand')
      const expandPanels = document.querySelectorAll('.tech__expand-panel')
      const statButtons = document.querySelectorAll('.tech__stat-btn')
      const tabsWrap = document.getElementById('tech-tabs-wrap')

      if (!tabs.length || !panels.length) return

      let activeTab = null
      let activeExpand = null
      let isAnimating = false

      function flashHighlight(element) {
         if (!element) return
         element.classList.remove('tech__flash-highlight')
         void element.offsetWidth
         element.classList.add('tech__flash-highlight')
         window.setTimeout(() => element.classList.remove('tech__flash-highlight'), 1400)
      }

      function scrollToTarget(element) {
         if (!element) return
         const top = element.getBoundingClientRect().top + window.scrollY - (window.getScrollOffset?.() ?? 72)
         window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
      }

      function setActiveTab(tab) {
         activeTab = tab
         tabs.forEach((item) => {
            const isActive = item === tab
            item.classList.toggle('tech__tab-active', isActive)
            item.setAttribute('aria-selected', isActive ? 'true' : 'false')
         })
      }

      function resetToggleStatButtons() {
         statButtons.forEach((btn) => {
            if (!btn.dataset.toggleLabel) return

            btn.classList.remove('tech__stat-btn--open')
            const valueEl = btn.querySelector('.tech__stat-value')
            const labelEl = btn.querySelector('.tech__stat-label')
            if (valueEl) valueEl.textContent = btn.dataset.defaultValue || valueEl.textContent
            if (labelEl) labelEl.textContent = btn.dataset.defaultLabel || labelEl.textContent
         })
      }

      function setToggleStatOpen(btn, open) {
         if (!btn?.dataset.toggleLabel) return

         const valueEl = btn.querySelector('.tech__stat-value')
         const labelEl = btn.querySelector('.tech__stat-label')

         if (open) {
            btn.classList.add('tech__stat-btn--open')
            if (valueEl) valueEl.textContent = '▲'
            if (labelEl) labelEl.textContent = btn.dataset.toggleLabel
            return
         }

         btn.classList.remove('tech__stat-btn--open')
         if (valueEl) valueEl.textContent = btn.dataset.defaultValue
         if (labelEl) labelEl.textContent = btn.dataset.defaultLabel
      }

      function hideCategoryPanels() {
         panels.forEach((panel) => {
            panel.hidden = true
            panel.classList.remove('tech__panel--active', 'tech__panel--leaving')
         })
         setActiveTab(null)
         panelsWrap?.classList.add('tech__panels-idle')
      }

      function hideExpandPanels() {
         expandPanels.forEach((panel) => {
            panel.hidden = true
            panel.classList.remove('tech__expand-panel--active', 'tech__expand-panel--leaving')
         })
         activeExpand = null
         expandWrap?.classList.add('tech__expand-idle')
         resetToggleStatButtons()
      }

      function hideAllPanels() {
         hideCategoryPanels()
         hideExpandPanels()
      }

      function showExpandPanel(type) {
         const nextPanel = document.getElementById(`tech-expand-${type}`)
         const currentPanel = expandWrap?.querySelector('.tech__expand-panel--active')
         const statBtn = document.querySelector(`.tech__stat-btn[data-action="${type}"]`)

         if (!nextPanel || isAnimating) return

         if (activeExpand === type) {
            hideExpandPanels()
            statButtons.forEach((item) => item.classList.remove('tech__stat-btn--active'))
            return
         }

         isAnimating = true
         hideCategoryPanels()
         hideExpandPanels()
         activeExpand = type
         expandWrap?.classList.remove('tech__expand-idle')

         if (currentPanel && currentPanel !== nextPanel) {
            currentPanel.classList.remove('tech__expand-panel--active')
            currentPanel.classList.add('tech__expand-panel--leaving')
            window.setTimeout(() => {
               currentPanel.hidden = true
               currentPanel.classList.remove('tech__expand-panel--leaving')
            }, 220)
         }

         nextPanel.hidden = false
         requestAnimationFrame(() => nextPanel.classList.add('tech__expand-panel--active'))
         setToggleStatOpen(statBtn, true)

         window.setTimeout(() => {
            isAnimating = false
         }, 280)
      }

      function showCategoryPanel(category) {
         const nextPanel = document.getElementById(`tech-panel-${category}`)
         const currentPanel = panelsWrap?.querySelector('.tech__panel--active')

         if (!nextPanel || isAnimating) return

         isAnimating = true
         hideExpandPanels()
         panelsWrap?.classList.remove('tech__panels-idle')

         if (currentPanel) {
            currentPanel.classList.remove('tech__panel--active')
            currentPanel.classList.add('tech__panel--leaving')
            window.setTimeout(() => {
               currentPanel.hidden = true
               currentPanel.classList.remove('tech__panel--leaving')
            }, 220)
         }

         panels.forEach((panel) => {
            if (panel !== nextPanel) {
               panel.hidden = true
               panel.classList.remove('tech__panel--active', 'tech__panel--leaving')
            }
         })

         nextPanel.hidden = false
         requestAnimationFrame(() => nextPanel.classList.add('tech__panel--active'))

         window.setTimeout(() => {
            isAnimating = false
         }, 280)
      }

      statButtons.forEach((btn) => {
         const valueEl = btn.querySelector('.tech__stat-value')
         const labelEl = btn.querySelector('.tech__stat-label')
         if (valueEl) btn.dataset.defaultValue = valueEl.textContent.trim()
         if (labelEl) btn.dataset.defaultLabel = labelEl.textContent.trim()

         btn.addEventListener('click', () => {
            const action = btn.dataset.action

            statButtons.forEach((item) => item.classList.remove('tech__stat-btn--active'))
            btn.classList.add('tech__stat-btn--active')

            if (action === 'categories') {
               hideExpandPanels()
               scrollToTarget(tabsWrap)
               window.setTimeout(() => flashHighlight(tabsWrap), 350)
               window.setTimeout(() => btn.classList.remove('tech__stat-btn--active'), 1400)
               return
            }

            if (action === 'all-tech') {
               showExpandPanel('all-tech')
               return
            }

            if (action === 'tools') {
               showExpandPanel('tools')
               return
            }

            if (action === 'journey') {
               hideExpandPanels()
               hideCategoryPanels()
               const journey = document.getElementById('journey')
               scrollToTarget(journey)
               window.setTimeout(() => flashHighlight(journey), 350)
               window.setTimeout(() => btn.classList.remove('tech__stat-btn--active'), 1400)
            }
         })
      })

      tabs.forEach((tab) => {
         tab.addEventListener('click', () => {
            if (activeTab === tab) {
               hideCategoryPanels()
               return
            }

            hideExpandPanels()
            statButtons.forEach((item) => item.classList.remove('tech__stat-btn--active'))
            setActiveTab(tab)
            showCategoryPanel(tab.dataset.category)
         })
      })

      hideAllPanels()
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
   } else {
      init()
   }
})()
