// ==UserScript==
// @name        My Script
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Test script
// @author      You
// @match       https://www.example.com/*  // 这里添加匹配规则（至少一个）
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/550752/My%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/550752/My%20Script.meta.js
// ==/UserScript==
(function (m, e, t, r, i, k, a) {
        m[i] =
          m[i] ||
          function () {
            ;(m[i].a = m[i].a || []).push(arguments)
          }
        m[i].l = 1 * new Date()
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) {
            return
          }
        }
        ;(k = e.createElement(t)),
          (a = e.getElementsByTagName(t)[0]),
          (k.async = 1),
          (k.src = r),
          a.parentNode.insertBefore(k, a)
      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

      ym(98148921, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true
      })