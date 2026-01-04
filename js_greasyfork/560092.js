// ==UserScript==
// @name         Restore Right Click & Remove Protection
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  恢复右键另存为
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560092/Restore%20Right%20Click%20%20Remove%20Protection.user.js
// @updateURL https://update.greasyfork.org/scripts/560092/Restore%20Right%20Click%20%20Remove%20Protection.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 解除 document 层面的右键限制
  document.addEventListener('contextmenu', function (e) {
    e.stopPropagation();
  }, true);

  // 移除元素上的 oncontextmenu
  const removeContextMenu = () => {
    document.querySelectorAll('*').forEach(el => {
      if (typeof el.oncontextmenu === 'function') {
        el.oncontextmenu = null;
      }
    });
  };

  // 移除透明遮罩层
  const removeOverlays = () => {
    const overlays = Array.from(document.querySelectorAll('div, section, span'))
      .filter(el => {
        const style = getComputedStyle(el);
        return (
          style.zIndex > 1000 &&
          style.position === 'absolute' &&
          parseFloat(style.opacity) < 0.1 &&
          style.pointerEvents !== 'none'
        );
      });

    overlays.forEach(el => el.remove());
  };

  // 删除版权遮罩
  const removeCopyrightProtection = () => {
    document.querySelectorAll('.view-protection').forEach(el => {
      if (el.innerText.includes('著作権保護のため画像を非表示にしています')) {
        console.log('移除版权遮罩');
        el.remove();
      }
    });

    document.querySelectorAll('img.blank-img').forEach(img => {
      if (img.src.startsWith('data:image/gif;base64,R0lGODlhAQABAIA')) {
        console.log('移除透明占位图');
        img.remove();
      }
    });
  };


  // 定期执行清除任务
  setInterval(() => {
    removeContextMenu();
    removeOverlays();
    removeCopyrightProtection();
  }, 1000);

})();
