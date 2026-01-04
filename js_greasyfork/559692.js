// ==UserScript==
// @name          自动点击666
// @description   尝试自动点击页面上指定的元素
// @version       1.3
// @match         *://*/*?target=*
// @match         *://www.bilibili.com/*
// @match         *://*/*?backurl=*
// @match       *://*/*?url=*
// @match      *://*/?target=
// @namespace https://greasyfork.org/users/982160
// @downloadURL https://update.greasyfork.org/scripts/559692/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB666.user.js
// @updateURL https://update.greasyfork.org/scripts/559692/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB666.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const s=[
      '[class="bpx-player-ctrl-btn bpx-player-ctrl-wide"]',//bilibili宽屏
      'html body div.wrapper div.actions a.button',//知乎
      'html body div.wrap-box div.page-list div.link a',
      'html body div.warning_wrap.clearfix div.warning_info p.btns a.btn.btn-next',//贴吧
      'html body div#app div.middle-page div.content button.btn',//掘金
      'html body div.wrap-box div.page-list div.link a.link-instanted',//中关村
      'html#html body div#root div.page__link__wrapper div.page__link div.btn__wrapper button.btn',//少数派
    ];
    const c=new Set();
    const f=()=>s.forEach(n=>document.querySelectorAll(n).forEach(e=>{if(!c.has(e)){e.click();c.add(e)}}));
    setInterval(f,1000);
    f();
})();