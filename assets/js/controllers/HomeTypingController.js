/**
 * Hero typing effect — cycles through role titles with type/erase animation
 */
(function () {
   'use strict'

   const typingEl = document.getElementById('home-typing')
   const cursorEl = document.getElementById('home-typing-cursor')

   if (!typingEl) return

   let words = []

   try {
      words = JSON.parse(typingEl.dataset.words || '[]')
   } catch {
      words = []
   }

   if (!words.length) return

   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

   if (prefersReducedMotion) {
      typingEl.textContent = words[0]
      cursorEl?.classList.add('home__typing-cursor-static')
      return
   }

   let wordIndex = 0
   let charIndex = 0
   let isDeleting = false
   let timerId = null

   const TYPE_SPEED = 72
   const DELETE_SPEED = 38
   const PAUSE_AFTER_TYPE = 2400
   const PAUSE_AFTER_DELETE = 420

   function getDelay(char, deleting) {
      if (deleting) {
         return char === ' ' ? DELETE_SPEED + 12 : DELETE_SPEED
      }

      if (char === ' ') return TYPE_SPEED + 40
      if (char === '&') return TYPE_SPEED + 28
      if (char === ',') return TYPE_SPEED + 60
      return TYPE_SPEED
   }

   function schedule(nextDelay) {
      window.clearTimeout(timerId)
      timerId = window.setTimeout(tick, nextDelay)
   }

   function tick() {
      const currentWord = words[wordIndex]
      let delay = TYPE_SPEED

      if (isDeleting) {
         typingEl.textContent = currentWord.substring(0, charIndex - 1)
         charIndex -= 1
         delay = getDelay(currentWord.charAt(charIndex), true)

         if (charIndex === 0) {
            isDeleting = false
            wordIndex = (wordIndex + 1) % words.length
            delay = PAUSE_AFTER_DELETE
         }
      } else {
         typingEl.textContent = currentWord.substring(0, charIndex + 1)
         delay = getDelay(currentWord.charAt(charIndex), false)
         charIndex += 1

         if (charIndex === currentWord.length) {
            isDeleting = true
            delay = PAUSE_AFTER_TYPE
         }
      }

      schedule(delay)
   }

   document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
         window.clearTimeout(timerId)
         timerId = null
         return
      }

      schedule(PAUSE_AFTER_DELETE)
   })

   tick()
})()
