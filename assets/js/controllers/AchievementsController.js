/**

 * Achievements section — category tabs filter card grid (click again to hide)

 */

(function () {

   'use strict'



   function init() {

      const tabs = document.querySelectorAll('.achievements__tab')

      const cards = document.querySelectorAll('.achievements__card')

      const grid = document.getElementById('achievements-grid')

      if (!tabs.length || !cards.length) return



      let activeTab = null



      function setActiveTab(tab) {

         activeTab = tab



         tabs.forEach((item) => {

            const isActive = item === tab

            item.classList.toggle('achievements__tab-active', isActive)

            item.setAttribute('aria-selected', isActive ? 'true' : 'false')

         })

      }



      function hideAll() {

         cards.forEach((card) => {

            card.classList.add('achievements__card-hidden')

         })



         if (grid) {

            grid.classList.add('achievements__grid-idle')

            grid.classList.remove('achievements__grid-empty')

         }

      }



      function filterCards(category) {

         let visibleCount = 0



         cards.forEach((card) => {

            const match = card.dataset.category === category

            card.classList.toggle('achievements__card-hidden', !match)

            if (match) visibleCount++

         })



         if (grid) {

            grid.classList.toggle('achievements__grid-idle', visibleCount === 0)

            grid.classList.toggle('achievements__grid-empty', visibleCount === 0)

         }

      }



      tabs.forEach((tab) => {

         tab.addEventListener('click', () => {

            if (activeTab === tab) {

               setActiveTab(null)

               hideAll()

               return

            }



            setActiveTab(tab)

            filterCards(tab.dataset.filter)

         })

      })



      hideAll()

   }



   if (document.readyState === 'loading') {

      document.addEventListener('DOMContentLoaded', init)

   } else {

      init()

   }

})()

