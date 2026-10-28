/**
 * Dark / Light theme toggle with localStorage persistence
 */
(function () {
   'use strict'

   const THEME_KEY = 'tamal-portfolio-theme'
   const toggle = document.getElementById('theme-toggle')

   function getPreferredTheme() {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'light' || stored === 'dark') {
         return stored
      }

      return 'dark'
   }

   function updateToggleLabel(theme) {
      if (!toggle) return
      toggle.setAttribute(
         'aria-label',
         theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      )
   }

   function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem(THEME_KEY, theme)
      updateToggleLabel(theme)
   }

   applyTheme(getPreferredTheme())

   toggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark'
      applyTheme(current === 'dark' ? 'light' : 'dark')
   })
})()
