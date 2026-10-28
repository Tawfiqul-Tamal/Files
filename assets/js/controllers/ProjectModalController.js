/**
 * Project details modal — Features, Metrics, Technologies, Challenges
 */
(function () {
   'use strict'

   let modal, projectsMap, lastFocus = null
   let touchMoved = false
   let isClosing = false
   const MODAL_CLOSE_MS = 300

   function getProjectsMap() {
      const el = document.getElementById('projects-modal-data')
      if (!el) return {}

      try {
         const list = JSON.parse(el.textContent)
         return list.reduce((acc, project) => {
            acc[project.id] = project
            return acc
         }, {})
      } catch {
         return {}
      }
   }

   function fillList(container, items) {
      container.innerHTML = ''
      items.forEach((item) => {
         const li = document.createElement('li')
         li.textContent = item
         container.appendChild(li)
      })
   }

   function fillTags(container, tags) {
      container.innerHTML = ''
      tags.forEach((tag) => {
         const span = document.createElement('span')
         span.className = 'project-modal__tag'
         span.textContent = tag
         container.appendChild(span)
      })
   }

   function fillMetrics(container, metrics) {
      container.innerHTML = ''
      if (!metrics?.length) return

      metrics.forEach((metric) => {
         const card = document.createElement('div')
         card.className = 'project-modal__metric'

         const value = document.createElement('span')
         value.className = 'project-modal__metric-value'
         value.textContent = metric.value

         const label = document.createElement('span')
         label.className = 'project-modal__metric-label'
         label.textContent = metric.label

         card.append(value, label)
         container.appendChild(card)
      })
   }

   function getFocusableElements() {
      if (!modal) return []
      return Array.from(modal.querySelectorAll(
         'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ))
   }

   function trapFocus(event) {
      if (modal.hidden || event.key !== 'Tab') return

      const focusables = getFocusableElements()
      if (!focusables.length) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
         event.preventDefault()
         last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
         event.preventDefault()
         first.focus()
      }
   }

   function setProjectImage(project) {
      const img = document.getElementById('project-modal-img')
      if (!img) return

      const fallback = project.image_fallback || project.image || ''
      const source = project.image || fallback

      img.alt = project.image_alt || project.plain_title || ''
      img.dataset.fallback = fallback
      delete img.dataset.fallbackApplied
      img.classList.remove('project-modal__img--screenshot', 'project-modal__img--cover', 'project-modal__img--placeholder', 'is-loading', 'is-loaded')
      img.classList.add('is-loading')
      img.classList.toggle('project-modal__img--screenshot', Boolean(project.is_screenshot))
      img.classList.toggle('project-modal__img--cover', Boolean(project.is_cover))
      img.classList.toggle('project-modal__img--placeholder', !project.is_screenshot && !project.is_cover)

      function applyFallback() {
         if (!fallback || img.dataset.fallbackApplied === 'true') return

         img.dataset.fallbackApplied = 'true'
         img.src = fallback
         img.classList.remove('project-modal__img--screenshot', 'project-modal__img--cover')
         img.classList.add('project-modal__img--placeholder')
         img.classList.remove('is-loading')
         img.classList.add('is-loaded')
      }

      img.onload = () => {
         img.classList.remove('is-loading')
         img.classList.add('is-loaded')
      }

      img.onerror = applyFallback
      img.src = source

      if (img.complete) {
         if (img.naturalWidth > 0) {
            img.classList.remove('is-loading')
            img.classList.add('is-loaded')
         } else {
            applyFallback()
         }
      }
   }

   function openModal(projectId) {
      const project = projectsMap[projectId]
      if (!project || !modal) return

      lastFocus = document.activeElement

      setProjectImage(project)
      document.getElementById('project-modal-category').textContent = project.category
      document.getElementById('project-modal-title').textContent = project.plain_title

      fillList(document.getElementById('project-modal-features'), project.features)
      fillMetrics(document.getElementById('project-modal-metrics'), project.metrics)
      fillTags(document.getElementById('project-modal-tech'), project.tech_stack)
      fillList(document.getElementById('project-modal-challenges'), project.challenges)

      const footer = document.getElementById('project-modal-footer')
      const githubLink = document.getElementById('project-modal-github')
      const liveLink = document.getElementById('project-modal-live')
      if (footer && githubLink) {
         const hasGithub = Boolean(project.github_url)
         const hasLive = Boolean(project.live_url)
         githubLink.hidden = !hasGithub
         if (hasGithub) {
            githubLink.href = project.github_url
            document.getElementById('project-modal-github-text').textContent = project.link_text || 'View on GitHub'
         }
         if (liveLink) {
            liveLink.hidden = !hasLive
            if (hasLive) liveLink.href = project.live_url
         }
         footer.querySelectorAll('.project-modal__extra-link').forEach((node) => node.remove())
         const extraLinks = Array.isArray(project.extra_links) ? project.extra_links : []
         extraLinks.forEach((item) => {
            if (!item || !item.url) return
            const anchor = document.createElement('a')
            anchor.className = 'project-modal__github project-modal__extra-link'
            anchor.href = item.url
            anchor.target = '_blank'
            anchor.rel = 'noopener'
            const icon = document.createElement('i')
            icon.className = item.icon || 'ri-external-link-line'
            icon.setAttribute('aria-hidden', 'true')
            const text = document.createElement('span')
            text.textContent = item.label || 'Open link'
            anchor.append(icon, text)
            footer.appendChild(anchor)
         })
         footer.hidden = !(hasGithub || hasLive || extraLinks.length > 0)
      } else if (footer) {
         footer.hidden = true
      }

      modal.hidden = false
      modal.classList.remove('project-modal--closing')
      modal.querySelector('.project-modal__dialog')?.classList.remove('project-modal__dialog--closing')
      modal.setAttribute('aria-hidden', 'false')
      document.body.classList.add('project-modal-open')

      modal.querySelector('.project-modal__close')?.focus()
   }

   function closeModal() {
      if (!modal || modal.hidden || isClosing) return

      isClosing = true
      const dialog = modal.querySelector('.project-modal__dialog')
      modal.classList.add('project-modal--closing')
      dialog?.classList.add('project-modal__dialog--closing')

      window.setTimeout(() => {
         modal.hidden = true
         modal.classList.remove('project-modal--closing')
         dialog?.classList.remove('project-modal__dialog--closing')
         modal.setAttribute('aria-hidden', 'true')
         document.body.classList.remove('project-modal-open')
         isClosing = false

         if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus()
         }
      }, MODAL_CLOSE_MS)
   }

   function init() {
      modal = document.getElementById('project-modal')
      projectsMap = getProjectsMap()

      if (!modal || !Object.keys(projectsMap).length) return

      // Keep the fixed dialog relative to the viewport even when the projects
      // section uses content-visibility containment for page performance.
      document.body.appendChild(modal)

      document.querySelectorAll('.projects__slide--clickable').forEach((slide) => {
         slide.addEventListener('click', (event) => {
            if (touchMoved) {
               touchMoved = false
               return
            }
            if (event.target.closest('.projects__button')) return
            if (event.target.closest('.projects__github-link, .projects__live-link')) return

            const id = event.target.closest('[data-project-id]')?.dataset.projectId
               || slide.dataset.projectId
            if (id) openModal(id)
         })

         slide.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
               event.preventDefault()
               openModal(slide.dataset.projectId)
            }
         })
      })

      document.querySelectorAll('.projects__details-btn').forEach((btn) => {
         btn.addEventListener('click', (event) => {
            event.stopPropagation()
            openModal(btn.dataset.projectId)
         })
      })

      modal.querySelectorAll('[data-modal-close]').forEach((el) => {
         el.addEventListener('click', closeModal)
      })

      document.addEventListener('keydown', (event) => {
         if (event.key === 'Escape' && !modal.hidden) {
            closeModal()
            return
         }

         trapFocus(event)
      })

      const carousel = document.getElementById('projects-carousel')
      carousel?.addEventListener('touchstart', () => {
         touchMoved = false
      }, { passive: true })

      carousel?.addEventListener('touchmove', () => {
         touchMoved = true
      }, { passive: true })
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
   } else {
      init()
   }
})()
