// ==UserScript==
// @name         自动打工&签到
// @namespace    http://tampermonkey.net/
// @version      2024.05.01
// @description  天使动漫自动打工&签到
// @author       shadows
// @match        https://tsdm39.com/plugin.php?id=np_cliworkdz:work
// @icon         https://tsdm39.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551815/%E8%87%AA%E5%8A%A8%E6%89%93%E5%B7%A5%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/551815/%E8%87%AA%E5%8A%A8%E6%89%93%E5%B7%A5%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const formhash=new URL(document.querySelector('a[href^="https://tsdm39.com/member.php"]').href).searchParams.get('formhash');
    await fetch("https://tsdm39.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
            "content-type": "application/x-www-form-urlencoded",
        },
        "referrer": "https://tsdm39.com/plugin.php?id=dsu_paulsign:sign",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `formhash=${formhash}&qdxq=fd&qdmode=3&todaysay=&fastreply=1`,
        "method": "POST",
        "mode": "no-cors",
        "credentials": "include"
    });
    for(let i=0;i<6;i++){
        await fetch("https://tsdm39.com/plugin.php?id=np_cliworkdz:work", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://tsdm39.com/plugin.php?id=np_cliworkdz:work",
            "body": "act=clickad",
            "method": "POST",
            "mode": "cors",
        });
    }
    document.getcre.submit();
})();