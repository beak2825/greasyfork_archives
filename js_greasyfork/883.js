// ==UserScript==
// @name        Pixiv Image Size Fitting
// @namespace   http://userscripts.org/users/121129
// @description pixiv の原寸画像が表示領域に収まるように画像サイズを変更
// @include     *://www.pixiv.net/*
// @version     12
// @grant       none
// @license     MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/883/Pixiv%20Image%20Size%20Fitting.user.js
// @updateURL https://update.greasyfork.org/scripts/883/Pixiv%20Image%20Size%20Fitting.meta.js
// ==/UserScript==

;(function() {
  'use strict'
  function hasModifiersKey(event) {
    return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
  }
  function addStyle() {
    const style = document.createElement('style')
    style.id = 'PixivImageSizeFittingStyle'
    style.textContent = `
      body > [role="presentation"] > div > div {
        overflow: hidden;
      }
      body > [role="presentation"] img {
        max-height: 100vh;
        max-width: 100vw;
      }
    `
    document.head.appendChild(style)
  }
  function keydown(e) {
    if (hasModifiersKey(e)) return
    if (!['x', 'i'].includes(e.key)) return
    const style = document.getElementById('PixivImageSizeFittingStyle')
    if (style) {
      style.remove()
    } else {
      addStyle()
    }
  }
  function main() {
    addStyle()
    window.addEventListener('keydown', keydown)
  }
  main()
})()
