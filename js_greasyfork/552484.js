// ==UserScript==
// @name        bilibili自动设置网页全屏
// @namespace   bilibili自动设置网页全屏
// @match       https://www.bilibili.com/video/*
// @grant       none
// @version     1.0
// @author      gongsunink
// @description 10/13/2025, 10:33:10 PM
// @downloadURL https://update.greasyfork.org/scripts/552484/bilibili%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/552484/bilibili%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

window.addEventListener('load', (event) => {

  fullscreen = setInterval(()=>{
      if (document.getElementsByClassName("bpx-player-ctrl-btn bpx-player-ctrl-web").length > 0){
          console.log('已自动设置网页全屏')
          document.getElementsByClassName("bpx-player-ctrl-btn bpx-player-ctrl-web")[0].lastElementChild.click()
          clearInterval(fullscreen)
      }
  },500)

})

