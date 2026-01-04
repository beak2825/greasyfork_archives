// ==UserScript==
// @name         AmbAssist - Torn Hospital Timer
// @namespace    namespace
// @version      1
// @description  Show travel status and hospital time and sort by hospital time on war page.
// @author       AMBiSCA
// @license      MIT
// @match        https://www.torn.com/factions.php*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/552194/AmbAssist%20-%20Torn%20Hospital%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/552194/AmbAssist%20-%20Torn%20Hospital%20Timer.meta.js
// ==/UserScript==


const APIKEY = 'INSERT LIMITED KEY'
const sort_enemies = true

GM_addStyle(`
.warstuff_highlight {
  background-color: #afa5 !important;
}
`)

// NOTE: Reduced interval to 1 second for accurate countdown display.
// This increases API usage.
setInterval(() => {
  const warDIV = document.querySelector('DIV.faction-war')
  if (warDIV) replaceEnemyInfo(warDIV)
}, 1000)


const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.classList && node.classList.contains('faction-war')) {
        replaceEnemyInfo(node)
      }
    }
  }
})

const wrapper = document.body//.querySelector('#mainContainer')
observer.observe(wrapper, { subtree: true, childList: true })

/**
 * Converts total seconds into HH:MM:SS format for countdown display.
 * @param {number} totalSeconds - The time remaining in seconds.
 * @returns {string} The formatted time string.
 */
function secondsToHms(totalSeconds) {
    // Basic comments for future developers
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    return [h, m, s]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
}

async function replaceEnemyInfo(node) {
  const enemy_LIs = node.querySelectorAll('LI.enemy')
  const enemy_faction_id = enemy_LIs[0].querySelector(`A[href^='/factions.php']`).href.split('ID=')[1]
  const enemy_basic = await fetch(`https://api.torn.com/faction/${enemy_faction_id}?selections=basic&key=${APIKEY}`).then(r => r.json()).catch(console.error)
  enemy_LIs.forEach((li) => {
    const status_DIV = li.querySelector('DIV.status')
    const enemy_id = li.querySelector(`A[href^='/profiles.php']`).href.split('ID=')[1]
    const enemy_status = enemy_basic.members[enemy_id].status
    li.setAttribute('data-until', enemy_status.until)
    enemy_status.description = enemy_status.description.replace('South Africa', 'SA').replace('Cayman Islands', 'CI').replace('United Kingdom', 'UK').replace('Argentina', 'Arg').replace('Switzerland', 'Switz')
    switch(enemy_status.state) {
      case 'Abroad':
      case 'Traveling':
        if (enemy_status.description.includes('Traveling to ')) {
          li.setAttribute('data-sortA', '4')
          status_DIV.innerText = '► ' + enemy_status.description.split('Traveling to ')[1]
        }
        else if (enemy_status.description.includes('In ')) {
          li.setAttribute('data-sortA', '3')
          status_DIV.innerText = enemy_status.description.split('In ')[1]
        }
        else if (enemy_status.description.includes('Returning')) {
          li.setAttribute('data-sortA', '2')
          status_DIV.innerText = '◄ ' + enemy_status.description.split('Returning to Torn from ')[1]
        }
        else if (enemy_status.description.includes('Traveling')) {
          li.setAttribute('data-sortA', '5')
          status_DIV.innerText = 'Traveling'
        }
        break
      case 'Hospital': { // Block scope added to fix SyntaxError
        li.setAttribute('data-sortA', '1')
        // Calculate remaining time in seconds
        const hosp_time_remaining = Math.round(enemy_status.until - (new Date().getTime() / 1000))

        // Display the countdown (remaining time) instead of the clock time (absolute time)
        const countdown_string = secondsToHms(hosp_time_remaining)
        status_DIV.innerText = countdown_string

        li.classList.remove('warstuff_highlight')
        //li.style.backgroundColor = 'transparent'
        if (hosp_time_remaining < 300) {
          //status_DIV.innerText = time_string//hosp_time_remaining + 's'
          li.classList.add('warstuff_highlight')
        }
        break
      }
      default:
        li.setAttribute('data-sortA', '0')
        break
    }
  })
  if (sort_enemies) {
    const enemy_UL = document.querySelector('LI.enemy').closest('UL.members-list')
    Array.from(enemy_LIs).sort((a, b) => {
      return a.getAttribute('data-sortA') - b.getAttribute('data-sortA') || a.getAttribute('data-until') - b.getAttribute('data-until')
    }).forEach(li => enemy_UL.appendChild(li))
  }
}