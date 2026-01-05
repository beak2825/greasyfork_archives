// ==UserScript==
// @name         nhentai preloader
// @description  Preload images on nhentai for faster loading
// @version      0.1.1
// @author       blazeu
// @namespace    https://greasyfork.org/users/11422
// @match        http://nhentai.net/g/*/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9927/nhentai%20preloader.user.js
// @updateURL https://update.greasyfork.org/scripts/9927/nhentai%20preloader.meta.js
// ==/UserScript==

/* global Image, media_id, current_page, num_pages */

(function () {
  function load (url, callback) {
    var img = new Image()
    img.onload = img.onerror = function () {
      callback()
    }
    img.src = url
  }

  function mediaUrl (media, page) {
    return '//i.nhentai.net/galleries/'.replace(/^https?:/, '') + media + '/' + page
  }

  function preload (media, start, end) {
    var url = mediaUrl(media, start)
    load(url, function () {
      if (++start > end) return
      preload(media, start, end)
    })
  }

  preload(media_id, +current_page + 1, num_pages)
})()
