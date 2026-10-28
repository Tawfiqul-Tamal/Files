/**
 * Contact form — EmailJS (preferred) or FormSubmit fallback for hosted sites.
 */
(function () {
   'use strict'

   function init() {
      const contactForm = document.getElementById('contact-form')
      const contactFormStatus = document.getElementById('contact-form-status')
      const contactSubmit = document.getElementById('contact-submit')

      if (!contactForm || !contactSubmit) return

      const recipient = contactForm.dataset.recipient || ''
      const publicKey = contactForm.dataset.emailjsPublicKey || ''
      const serviceId = contactForm.dataset.emailjsServiceId || ''
      const templateId = contactForm.dataset.emailjsTemplateId || ''
      const formsubmitEnabled = contactForm.dataset.formsubmitEnabled !== 'false'
      const siteUrl = window.location.origin + window.location.pathname
      const defaultLabel = contactSubmit.dataset.defaultLabel || contactSubmit.textContent.trim()
      const isLocalFile = window.location.protocol === 'file:'

      const fields = {
         name: contactForm.elements.namedItem('name'),
         email: contactForm.elements.namedItem('email'),
         message: contactForm.elements.namedItem('message'),
      }

      const fieldErrors = {
         name: document.getElementById('contact-name-error'),
         email: document.getElementById('contact-email-error'),
         message: document.getElementById('contact-message-error'),
      }

      const messages = {
         name: 'Please enter your name.',
         email: 'Please enter your email address.',
         emailInvalid: 'Please enter a valid email address.',
         message: 'Please enter your message.',
         notConfigured:
            'Contact form is not configured yet. Please use Copy email or the Email card.',
         localFile:
            'Form cannot send from a saved HTML file. Open via http://localhost or the live website.',
         sendFailed: 'Could not send your message. Please try again or email directly.',
         success: 'Message sent successfully. Thank you!',
         activation:
            `The form owner must activate this form. Check ${recipient} (including Spam) for the latest FormSubmit activation email; the sender email entered above will not receive it. If the latest link is invalid, contact FormSubmit support.`,
      }

      function isValidEmail(value) {
         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      }

      function hasEmailJsCredentials() {
         return Boolean(publicKey && serviceId && templateId)
      }

      function isEmailJsReady() {
         return hasEmailJsCredentials() && typeof emailjs !== 'undefined'
      }

      function resolveProvider() {
         if (isEmailJsReady()) return 'emailjs'
         if (recipient && formsubmitEnabled) return 'formsubmit'
         return ''
      }

      function setFieldInvalid(fieldKey, invalid, message = '') {
         const field = fields[fieldKey]
         const errorEl = fieldErrors[fieldKey]

         if (field) {
            field.classList.toggle('is-invalid', invalid)
            field.setAttribute('aria-invalid', invalid ? 'true' : 'false')
         }

         if (errorEl) {
            errorEl.textContent = invalid ? message : ''
         }
      }

      function clearFieldStates() {
         Object.keys(fields).forEach((key) => setFieldInvalid(key, false))
      }

      function setStatus(message, type = '') {
         if (!contactFormStatus) return
         contactFormStatus.textContent = message
         contactFormStatus.classList.remove('is-error', 'is-success', 'is-loading', 'is-info')
         if (type) contactFormStatus.classList.add(type)
      }

      function setLoading(loading) {
         contactSubmit.disabled = loading
         contactSubmit.classList.toggle('is-loading', loading)
         contactSubmit.textContent = loading ? 'Sending...' : defaultLabel
         contactForm.setAttribute('aria-busy', loading ? 'true' : 'false')

         if (loading) {
            setStatus('Sending your message...', 'is-loading')
         }
      }

      function initEmailJs() {
         if (!isEmailJsReady()) return
         emailjs.init({ publicKey })
      }

      initEmailJs()

      function validateForm() {
         clearFieldStates()

         const name = fields.name?.value.trim() || ''
         const email = fields.email?.value.trim() || ''
         const message = fields.message?.value.trim() || ''

         const invalid = {
            name: false,
            email: false,
            message: false,
         }

         if (!name) {
            invalid.name = true
            setFieldInvalid('name', true, messages.name)
         }

         if (!email) {
            invalid.email = true
            setFieldInvalid('email', true, messages.email)
         } else if (!isValidEmail(email)) {
            invalid.email = true
            setFieldInvalid('email', true, messages.emailInvalid)
         }

         if (!message) {
            invalid.message = true
            setFieldInvalid('message', true, messages.message)
         }

         if (invalid.name || invalid.email || invalid.message) {
            setStatus('Please correct the highlighted fields.', 'is-error')

            if (invalid.name) fields.name?.focus()
            else if (invalid.email) fields.email?.focus()
            else if (invalid.message) fields.message?.focus()

            return null
         }

         return { name, email, message }
      }

      function parseFormSubmitResponse(response, data) {
         const responseMessage = typeof data?.message === 'string' ? data.message.trim() : ''
         const needsActivation = /needs?\s+activat|requires?\s+activat|not\s+activat|activate\s+form|activation\s+link|confirmation\s+link|confirm\s+your\s+form/i.test(responseMessage)

         if (needsActivation) return { needsActivation: true }

         const successValue = data?.success
         if (!response.ok || (successValue !== true && successValue !== 'true')) {
            throw new Error('send-failed')
         }

         return { needsActivation: false }
      }

      async function sendViaEmailJs(payload) {
         initEmailJs()

         if (!isEmailJsReady()) {
            throw new Error('not-configured')
         }

         await emailjs.send(serviceId, templateId, {
            from_name: payload.name,
            from_email: payload.email,
            reply_to: payload.email,
            message: payload.message,
            subject: `Portfolio contact from ${payload.name}`,
            to_email: recipient,
         })
      }

      async function sendViaFormSubmit(payload) {
         if (isLocalFile) {
            throw new Error(messages.localFile)
         }

         const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
            },
            body: JSON.stringify({
               name: payload.name,
               email: payload.email,
               message: payload.message,
               _subject: `Portfolio contact from ${payload.name}`,
               _template: 'table',
               _captcha: 'false',
               _url: siteUrl,
            }),
         })

         const data = await response.json().catch(() => null)
         return parseFormSubmitResponse(response, data)
      }

      async function sendMessage(payload) {
         const provider = resolveProvider()

         if (!provider) {
            throw new Error('not-configured')
         }

         if (provider === 'emailjs') {
            await sendViaEmailJs(payload)
            return { needsActivation: false }
         }

         return sendViaFormSubmit(payload)
      }

      contactForm.addEventListener('submit', async (event) => {
         event.preventDefault()

         const payload = validateForm()
         if (!payload) return

         if (!resolveProvider()) {
            setStatus(messages.notConfigured, 'is-error')
            return
         }

         if (isLocalFile && !isEmailJsReady()) {
            setStatus(messages.localFile, 'is-error')
            return
         }

         setLoading(true)

         try {
            const result = await sendMessage(payload)

            if (result?.needsActivation) {
               setStatus(messages.activation, 'is-info')
               return
            }

            contactForm.reset()
            clearFieldStates()
            setStatus(messages.success, 'is-success')
         } catch (error) {
            if (error?.message === 'not-configured') {
               setStatus(messages.notConfigured, 'is-error')
            } else {
               setStatus(error?.message === messages.localFile ? messages.localFile : messages.sendFailed, 'is-error')
            }
         } finally {
            setLoading(false)
         }
      })

      Object.entries(fields).forEach(([key, field]) => {
         field?.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) {
               setFieldInvalid(key, false)
            }

            if (contactFormStatus?.classList.contains('is-error')) {
               setStatus('')
            }
         })

         field?.addEventListener('blur', () => {
            const value = field.value.trim()

            if (key === 'name' && !value) return

            if (key === 'email') {
               if (!value) return
               setFieldInvalid('email', !isValidEmail(value), isValidEmail(value) ? '' : messages.emailInvalid)
               return
            }

            if (key === 'message' && !value) return
         })
      })
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
   } else {
      init()
   }
})()
