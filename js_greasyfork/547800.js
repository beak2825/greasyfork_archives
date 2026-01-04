// ==UserScript==
// @name        swingvy 報賬貼上剪貼簿
// @namespace   Violentmonkey Scripts
// @match       https://secure.swingvy.com/main.html*
// @grant       none
// @version     1.0
// @author      
// @description 2025/8/30 上午11:19:00
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547800/swingvy%20%E5%A0%B1%E8%B3%AC%E8%B2%BC%E4%B8%8A%E5%89%AA%E8%B2%BC%E7%B0%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/547800/swingvy%20%E5%A0%B1%E8%B3%AC%E8%B2%BC%E4%B8%8A%E5%89%AA%E8%B2%BC%E7%B0%BF.meta.js
// ==/UserScript==
const temporallyPaste = document.createElement('div')
document.addEventListener('paste', e => {
  const items = e.clipboardData && e.clipboardData.items
  if (!items) return;
  const dialog = document.querySelector('dialog')
  dialog.appendChild(temporallyPaste)
  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      const reader = new FileReader();
      reader.onload = e => {
        const image = new Image();
        image.src = e.target.result;
        image.onclick = () => temporallyPaste.removeChild(image)
        image.setAttribute('title', 'click to remove')
        image.style = 'cursor: pointer;';
        temporallyPaste.appendChild(image)
      }
      reader.readAsDataURL(item.getAsFile())
    }
  }
})

temporallyPaste.style = 'position: absolute; top: 2rem; left: 2rem;'
document.body.appendChild(temporallyPaste)