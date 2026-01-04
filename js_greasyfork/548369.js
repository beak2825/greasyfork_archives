// ==UserScript==
// @name         免登录复制代码块内容
// @description  为含代码的pre标签添加复制按钮，无需登录即可复制
// @version      0.4
// @author       WJ
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/548369/%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E5%9D%97%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/548369/%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E5%9D%97%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(() => {
  'use strict';
  let WJbtn = null
  document.addEventListener('click', (e) => {
    const pre = e.target.closest('pre');
    if (!pre) return WJbtn?.remove(), WJbtn = null;

    let wrapper = pre.closest('.WJ-wrapper');
    if (!wrapper) {
      wrapper = Object.assign(document.createElement('div'), {
        className: 'WJ-wrapper', style: 'position:relative;display:block'
      });
      pre.parentNode.insertBefore(wrapper,pre),wrapper.append(pre);
    }

    if (WJbtn?.parentElement === wrapper) return;WJbtn?.remove();
    WJbtn = Object.assign(document.createElement('button'), {
      className: 'WJ-btn', textContent: '复制',
      style: `position:absolute;top:6px;right:6px;padding:4px 20px;font-size:15px;
            background:#06c;color:#fff;border-radius:4px;z-index:999;border:none`
    });
    wrapper.append(WJbtn);

    WJbtn.onclick = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText((pre.querySelector('code')||pre).innerText);
      WJbtn.textContent = '已复制';
      setTimeout(() => (WJbtn.remove(), WJbtn = null), 1000);
    };
  });
})();