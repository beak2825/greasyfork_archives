// ==UserScript==
// @name         Twitch - Stop Auto-play on Homepage
// @namespace    https://greasyfork.org/users/1002054-igorskyflyer
// @version      v1.0.1
// @description  🛑 Prevents intrusive videos from auto-playing on the Twitch.tv homepage. 📺
// @author       igorskyflyer
// @date         2026-01-29
// @match        https://www.twitch.tv/
// @match        https://twitch.tv/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-idle
// @grant        none
// @license      GPL-3.0-or-later
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @homepageURL  https://github.com/igorskyflyer/userscript-twitch-stop-autoplay
// @supportURL   https://greasyfork.org/users/1002054-igorskyflyer
// @downloadURL https://update.greasyfork.org/scripts/564377/Twitch%20-%20Stop%20Auto-play%20on%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/564377/Twitch%20-%20Stop%20Auto-play%20on%20Homepage.meta.js
// ==/UserScript==

// @ts-nocheck

;(() => {
  const MAX_ATTEMPTS = 5
  const POLL_INTERVAL = 2000

  let attemptsLeft = MAX_ATTEMPTS
  let foundPlayer = false

  window.addEventListener('load', () => {
    function findPlayer() {
      const player = document.querySelector('video[playsinline]')

      if (!player) {
        return
      }

      player.addEventListener('playing', function handler() {
        player.pause()
        // remove the handler immediately,
        // so we are not stuck in a pausing loop
        player.removeEventListener('playing', handler)
      })

      foundPlayer = true
    }

    const timer = setInterval(() => {
      findPlayer()
      attemptsLeft--

      if (foundPlayer || attemptsLeft <= 0) {
        clearInterval(timer)

        if (!foundPlayer) {
          // biome-ignore lint/suspicious/noConsole: Needed for debug purposes.
          console.error(
            'Could not find the player. Please visit https://greasyfork.org/users/1002054-igorskyflyer and report the issue.'
          )
        }
      }
    }, POLL_INTERVAL)
  })
})()
