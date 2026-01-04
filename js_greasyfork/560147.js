// ==UserScript==
// @name         北理工-自动评教脚本
// @namespace    http://tampermonkey.net/
// @version      2025-12-25
// @description  自动好评机，如果你不想给某个老师好评，关掉脚本进评教，评完不想好评的之后再开启脚本
// @author       zjcOvO
// @match        https://pj.bit.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bit.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560147/%E5%8C%97%E7%90%86%E5%B7%A5-%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/560147/%E5%8C%97%E7%90%86%E5%B7%A5-%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let list=document.getElementsByClassName("icon-eye-close");
    if(list.length>0){
        list[0].click();
    }
    for(let i=1;i<=100;i++){
        let obj = document.getElementById("pjnr_"+String(i)+"_1");
        if(!obj) break;
        obj.click();
    }
    let obj=document.getElementById("pjjy");
    if(obj){
        obj.innerText="无";
        savePjxx('1');// 不需要自动保存则去掉这行和下三行
        setTimeout(()=>{
            $(".modal-footer")[0].firstElementChild.click(); // 不需要自动保存则去掉这三行和上面那一行
        },100);
    }else{
        if($('#table_report tbody')[0].childElementCount == 10){
            top.jzts();
            if(document.forms[0]){
                let url = document.forms[0].getAttribute("action");
                if(url.indexOf('?')>-1){url += "&currentPage=";}
                else{url += "?currentPage=";}
                url = url +  "1&showCount=100";
                document.forms[0].action = url;
                document.forms[0].submit();
            }
        }
    }
})();
