// ==UserScript==
// @name         星露谷wiki助手
// @namespace    stardewvalleywiki
// @version      1.0
// @description  星露谷wiki 小助手
// @author       Gari
// @match        *://stardewvalleywiki.com/*
// @match        *://*.stardewvalleywiki.com/*
// @icon         https://stardewvalleywiki.com/mediawiki/extensions/StardewValley/images/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560780/%E6%98%9F%E9%9C%B2%E8%B0%B7wiki%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560780/%E6%98%9F%E9%9C%B2%E8%B0%B7wiki%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("星露谷wiki助手 启动!");

    const style = document.createElement('style');
    style.type = 'text/css';
    const css = `
  .qbzkbtn {
  display:inline-block;
  background:#03A007;
  padding:4px 12px;
  text-align: center;
  border-color: #007448;
  box-shadow: 0px 1px rgba(0, 0, 0, 0.3);
  color: white;
  text-shadow: 1px 1px #1e8e64;
  cursor:pointer;
  position: fixed;
  right: 18px;
  bottom: 107px;
  }
`;
    if (style.styleSheet) { // 针对 IE
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.head.appendChild(style);


    const qbzkbtn = document.createElement('span');
    qbzkbtn.classList.add('qbzkbtn');
    qbzkbtn.innerText = '展开';

    function toolCheck() {
        const zkbtntext = document.querySelector('.mw-collapsible-toggle .mw-collapsible-text');
        if (zkbtntext && zkbtntext.innerText.trim().length > 0) {
            qbzkbtn.addEventListener('click', function(){
                if (qbzkbtn.innerText == '展开') {
                    const zkbtns = document.querySelectorAll('.mw-collapsible-toggle.mw-collapsible-toggle-collapsed .mw-collapsible-text');
                    zkbtns.forEach(function(zkbtn){zkbtn.click()})
                    qbzkbtn.innerText = '折叠';
                } else {
                    const zkbtns = document.querySelectorAll('.mw-collapsible-toggle.mw-collapsible-toggle-expanded .mw-collapsible-text');
                    zkbtns.forEach(function(zkbtn){zkbtn.click()})
                    qbzkbtn.innerText = '展开';
                }

            })
            document.body.appendChild(qbzkbtn);
        } else {
            setTimeout(toolCheck, 500);
        }
    }
    toolCheck();

})();