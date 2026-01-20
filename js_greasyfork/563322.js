// ==UserScript==
// @name         unicodeToUTF - for emojirepo
// @namespace    http://leizingyiu.net/
// @version      2026-01-20
// @description  将 Unicode 码点 转换为 UTF-16 编码格式
// @author       leizingyiu
// @match        https://emojirepo.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=emojirepo.org
// @grant        none
// @license     GNU AGPLv3 
// @downloadURL https://update.greasyfork.org/scripts/563322/unicodeToUTF%20-%20for%20emojirepo.user.js
// @updateURL https://update.greasyfork.org/scripts/563322/unicodeToUTF%20-%20for%20emojirepo.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const mark = 'yiu_unicodeToUTF_for_emojirepo';
    function convertCodepointToUTF16(codepointStr) {
        const hexValue = codepointStr.replace("U+", "");
        const char = String.fromCodePoint(parseInt(hexValue, 16));
        const utf16Code = char.charCodeAt(0);
        return utf16Code.toString(16).toLowerCase().padStart(4, "0");
    }

    function main(){
        document.querySelectorAll("#technical > div > div > div:nth-child(3) > div > code").forEach((i,idx,arr)=>{
            if(i.parentElement.hasAttribute(mark) && i.parentElement.getAttribute(mark) == i.parentElement.querySelectorAll('['+mark+']').length){
                return i
            }else{
                i.parentElement.setAttribute(mark,arr.length);
            }
            var o = document.createElement('code');
            o.innerText = convertCodepointToUTF16(i.innerText);
            i.parentElement.appendChild(o);
            o.setAttribute('class',i.getAttribute('class'));
            o.setAttribute(mark,true);
         })
    }

     if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    document.addEventListener('click', function (e) {
        main();
    });
})();
