// ==UserScript==
// @name         资源避难所-优化
// @namespace    http://tampermonkey.net/
// @version      2025-05-23
// @description  让下载地址直接显示方便别的脚本那啥
// @author       Ifover
// @match        https://www.flysheep6.com/archives/*
// @icon         https://images.weserv.nl/?url=https://r534.com/flysheep/i/2023/02/25/5fgq.jpg
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553089/%E8%B5%84%E6%BA%90%E9%81%BF%E9%9A%BE%E6%89%80-%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/553089/%E8%B5%84%E6%BA%90%E9%81%BF%E9%9A%BE%E6%89%80-%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const fStyle = `
       body .is-layout-flex{
         flex-direction:column;
         align-items:normal;
      }

      .navbar-default .has-no-menu-description .navbar-nav > li > a{
         padding: 23px 10px 24px;
      }
    `

    GM_addStyle(fStyle)
    let links = document.querySelectorAll('.wp-block-button a')
    let arr = []
    links.forEach(n=>{
        arr.push({
            url :n.getAttribute('href'),
            text:n.innerText.replace('- 点击下载','')
        })
    })
    if(arr.length)  document.querySelector('.wp-block-buttons').innerText = ''
    arr.forEach(h=>{
        let node_div = document.createElement('div')
        node_div.style.marginBottom = '10px';

        let node_p = document.createElement('p')
        node_p.innerText = h.text;
        node_p.style.marginBottom = 0;

        let node_a = document.createElement('a')
        node_a.href = h.url
        node_a.innerText = h.url

        node_div.append(node_p)
        node_div.append(node_a)
        document.querySelector('.wp-block-buttons').append(node_div)
    })

})();