/*=============== COPY EMAIL (CONTACT) ===============*/
(function () {
   'use strict'

   let resetTimer = null

   function writeClipboard(text) {
      if (window.isSecureContext && navigator.clipboard?.writeText) {
         return navigator.clipboard.writeText(text).then(() => true).catch(() => legacyCopy(text))
      }

      return Promise.resolve(legacyCopy(text))
   }

   function legacyCopy(text) {
      function onCopy(event) {
         event.clipboardData.setData('text/plain', text)
         event.preventDefault()
         document.removeEventListener('copy', onCopy)
      }

      document.addEventListener('copy', onCopy)

      let copied = false

      try {
         copied = document.execCommand('copy')
      } catch (_) {
         copied = false
      }

      document.removeEventListener('copy', onCopy)

      if (copied) {
         return true
      }

      try {
         const textarea = document.createElement('textarea')
         textarea.value = text
         textarea.setAttribute('readonly', '')
         textarea.style.cssText = 'position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;opacity:0;'
         document.body.appendChild(textarea)
         textarea.focus({ preventScroll: true })
         textarea.select()
         textarea.setSelectionRange(0, text.length)
         copied = document.execCommand('copy')
         document.body.removeChild(textarea)
      } catch (_) {
         copied = false
      }

      return copied
   }

   function selectEmailInCard(email) {
      const addresses = document.querySelectorAll('.contact__address')

      for (const el of addresses) {
         if (el.textContent.trim() !== email) {
            continue
         }

         const range = document.createRange()
         range.selectNodeContents(el)
         const selection = window.getSelection()
         selection?.removeAllRanges()
         selection?.addRange(range)
         return true
      }

      return false
   }

   function setCopyFeedback(button, success, email) {
      const statusEl = document.getElementById('copy-email-status')
      const labelEl = button.querySelector('.contact__button-text')
      const defaultLabel = button.getAttribute('data-default-label') || 'Copy email'

      window.clearTimeout(resetTimer)
      button.classList.toggle('contact__button--copied', success)
      button.setAttribute('aria-pressed', success ? 'true' : 'false')

      if (success) {
         if (labelEl) {
            labelEl.textContent = 'Copied!'
         }

         if (statusEl) {
            statusEl.textContent = 'Email copied to clipboard.'
            statusEl.classList.add('is-visible')
            statusEl.classList.remove('is-error')
         }
      } else {
         const selected = selectEmailInCard(email)

         if (statusEl) {
            statusEl.textContent = selected
               ? 'Email highlighted below. Press Ctrl+C to copy.'
               : 'Could not copy. Use the email shown in the Email card.'
            statusEl.classList.add('is-visible', 'is-error')
         }
      }

      resetTimer = window.setTimeout(() => {
         button.classList.remove('contact__button--copied')
         button.setAttribute('aria-pressed', 'false')

         if (labelEl) {
            labelEl.textContent = defaultLabel
         }

         if (statusEl) {
            statusEl.textContent = ''
            statusEl.classList.remove('is-visible', 'is-error')
         }
      }, success ? 2400 : 3600)
   }

   async function handleCopyClick(event) {
      const button = event.target.closest('#copy-email')
      if (!button) {
         return
      }

      event.preventDefault()

      const email = button.getAttribute('data-email') || ''
      if (!email) {
         return
      }

      const copied = await writeClipboard(email)
      setCopyFeedback(button, copied, email)
   }

   function init() {
      const contactSection = document.getElementById('contact')
      if (!contactSection) {
         return
      }

      contactSection.addEventListener('click', handleCopyClick)
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
   } else {
      init()
   }
})()
