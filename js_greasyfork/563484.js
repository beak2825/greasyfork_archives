// ==UserScript==
// @name         FZOJ排行榜显示名字
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RT
// @author       You
// @match        *://noj.fzoi.top/d/dx2026/contest/*/scoreboard$
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-4.0.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/563484/FZOJ%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%98%BE%E7%A4%BA%E5%90%8D%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/563484/FZOJ%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%98%BE%E7%A4%BA%E5%90%8D%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //while(!document.querySelector("#panel > div.main > div > div > div > div:nth-child(2) > div > div"));
    const s=document.querySelectorAll('[class^="uname--"]');
    for(let x of s)
    {
        if(x.parentElement.className!='user-profile-name'){
            continue;
        }
        let t=x.textContent;
        t=t.trim();
        if(!GM_getValue('FZOJ'+t)){
            $.get(x.parentElement.href,function(res){
                for(let i=res.length-11;~i;i--)
                {
                    if(res.substr(i,7)=="uname--"){
                        while(res[i]!='>')
                        {
                            i++;
                        }
                        let j=i;
                        while(res[j]!=')')
                        {
                            j++;
                        }
                        let s=res.substr(i+1,j-(i+1)).trim();
                        j=0;
                        while(s[j]!='(')
                        {
                            j++;
                        }
                        let uid=s.substr(0,j-1).trim();
                        let nam=s.substr(j+1,s.length-j-1).trim();
                        GM_setValue('FZOJ'+uid,nam);
                        t=t+' ('+nam+')';
                        x.textContent=t;
                        break;
                    }
                }
            }).fail(function () {
                console.log('failed to catch data');
            });
        }
        else{
            let s=GM_getValue('FZOJ'+t);
            t=t+' ('+s+')';
            x.textContent=t;
        }
    }
})();