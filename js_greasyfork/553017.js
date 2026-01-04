// ==UserScript==
// @name         xxxxx520\switch520自动识别百度网盘链接，并自动填写密码，并自动点击提交
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Everyday Is Precious.
// @author       JewelShiny
// @match        https://pan.baidu.com/share/*
// @match        https://like.gamer520.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553017/xxxxx520%5Cswitch520%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%EF%BC%8C%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81%EF%BC%8C%E5%B9%B6%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/553017/xxxxx520%5Cswitch520%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%EF%BC%8C%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81%EF%BC%8C%E5%B9%B6%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(document.domain)
    if(document.domain == 'like.gamer520.com'){
        var target = document.querySelector(".entry-content.u-text-format.u-clearfix");
        var allhtml = target.innerHTML;

        var ym = document.documentElement.innerText;
        ym = ym.replace(/\n/g," ");
        console.log(ym);

        var patt = /(https:\/\/pan\.baidu\.com\/s\/1([a-zA-Z0-9_-]+)).{1,10}([a-z0-9]{4})[^a-zA-Z0-9-_]/g;
        var res;
        console.log('aaa');

        while((res = patt.exec(ym)) !== null){
            console.log(res);
            if(res[2] && res[3]){
                var button = '<a style="color:yellow;border-color:yellow;border-style:solid;margin-left:5px;" href="https://pan.baidu.com/share/init?surl='
                + res[2] + '&pw=' + res[3] + '" target="_blank">打开链接</a>';

                var linkPattern = new RegExp(
                    '(<a[^>]*href=["\']https://pan\\.baidu\\.com/s/1' + res[2] + '["\'][^>]*>.*?<\\/a>)',
                    'g'
                );
                allhtml = allhtml.replace(linkPattern, '$1' + button);

                console.log('链接', res[2], '密码', res[3]);
                console.log('https://pan.baidu.com/share/init?surl=' + res[2] + '&pw=' + res[3]);
            }
        }

        target.innerHTML = allhtml;
    }else if(document.domain == 'pan.baidu.com'){
        var url = window.location.href
        console.log(url)
        var patt_pw = /pw=([a-z0-9]{4})/
        var res_pw = patt_pw.exec(url)
        //var patt = /([a-zA-Z0-9_]{10,})/
        //var res = patt.exec(url)
        console.log(res_pw)
        if(res_pw && res_pw[1]){
            document.getElementsByTagName('input')[0].value = res_pw[1]
            document.getElementById('submitBtn').click()
        }
    }

})();