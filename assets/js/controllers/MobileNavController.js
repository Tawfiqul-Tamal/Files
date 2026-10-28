/**
 * Mobile navigation — loads synchronously right after header.
 */
(function () {
   'use strict'

   var menu = document.getElementById('nav-menu')
   var toggle = document.getElementById('nav-toggle')
   var closeBtn = document.getElementById('nav-close')
   var MOBILE_MAX = 1023

   if (!menu || !toggle) return

   function isMobileNav() {
      return window.innerWidth <= MOBILE_MAX
   }

   function setNavOpen(isOpen) {
      menu.classList.toggle('show-menu', isOpen)
      document.body.classList.toggle('nav-open', isOpen)
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu')

      if (!isMobileNav()) return

      if (isOpen) {
         menu.removeAttribute('inert')
         menu.removeAttribute('aria-hidden')
      } else {
         menu.setAttribute('inert', '')
         menu.setAttribute('aria-hidden', 'true')
      }
   }

   function syncNavAccessibility() {
      if (isMobileNav()) {
         if (!menu.classList.contains('show-menu')) {
            menu.setAttribute('inert', '')
            menu.setAttribute('aria-hidden', 'true')
         }
      } else {
         menu.removeAttribute('inert')
         menu.removeAttribute('aria-hidden')

         if (menu.classList.contains('show-menu')) {
            menu.classList.remove('show-menu')
            document.body.classList.remove('nav-open')
            toggle.setAttribute('aria-expanded', 'false')
         }
      }
   }

   window.portfolioCloseNavMenu = function () {
      if (isMobileNav()) {
         setNavOpen(false)
      }
   }

   syncNavAccessibility()

   toggle.addEventListener('click', function (event) {
      if (!isMobileNav()) return

      event.preventDefault()
      event.stopPropagation()
      setNavOpen(!menu.classList.contains('show-menu'))
   })

   if (closeBtn) {
      closeBtn.addEventListener('click', function (event) {
         event.preventDefault()
         setNavOpen(false)
      })
   }

   menu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
         if (isMobileNav()) {
            setNavOpen(false)
         }
      })
   })

   document.addEventListener('click', function (event) {
      if (!isMobileNav() || !menu.classList.contains('show-menu')) return
      if (menu.contains(event.target) || toggle.contains(event.target)) return
      setNavOpen(false)
   })

   document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('show-menu')) {
         setNavOpen(false)
      }
   })

   window.addEventListener('resize', syncNavAccessibility)
})()
