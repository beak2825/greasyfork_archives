// ==UserScript==
// @name         SCP ZH redirect
// @description  redirect lang
// @namespace    scp_wiki_wikidot
// @author       Covenant
// @version      0.9
// @license      GPL
// @homepage
// @match        https://scp-wiki.wikidot.com/*
// @match        http://scp-zh-tr.wikidot.com/*
// @match        https://scp-wiki-cn.wikidot.com/*
// @match        http://scp-jp.wikidot.com/*
// @icon         https://www.google.com/s2/favicons?domain=scp-wiki.wikidot.com&sz=128
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/557529/SCP%20ZH%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/557529/SCP%20ZH%20redirect.meta.js
// ==/UserScript==
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
(function(){
    'use strict';
    let url=fn_url(document.location);
    if(url[0].host.search(new RegExp("scp-zh-tr.wikidot.com", "i"))==0){
        let u_404NotFound_=document.querySelectorAll('#u-404NotFound_');//font fallbacks
        if(u_404NotFound_.length>0){window.location.replace(url[0].toString().replace("http://scp-zh-tr.wikidot.com", "https://scp-wiki-cn.wikidot.com"));}
        let a_newpage=document.querySelectorAll('a.newpage');
        a_newpage.forEach((a_fe_newpage,i) =>{
            a_fe_newpage.href=a_fe_newpage.href.replace("http://scp-zh-tr.wikidot.com", "https://scp-wiki-cn.wikidot.com");
        });
    }else if(url[0].host.search(new RegExp("scp-wiki-cn.wikidot.com", "i"))==0){
        let toc0=document.querySelectorAll('#toc0');//to en
        if(toc0.length>0){
            if(toc0[0].innerText=="此页面不存在！")window.location.replace(url[0].toString().replace("https://scp-wiki-cn.wikidot.com", "https://scp-wiki.wikidot.com"));
        }
        let div_list_pages_item=document.querySelectorAll('#page-content>div.list-pages-box>div.list-pages-item>p')//231
        if(div_list_pages_item.length==1){
            let a_adult=div_list_pages_item[0].querySelectorAll('a');
            if(a_adult.length==1){window.location.replace(url[0].toString().replace("https://scp-wiki-cn.wikidot.com", "http://scp-zh-tr.wikidot.com"));}
        }
    }else if(url[0].host.search(new RegExp("scp-jp.wikidot.com", "i"))==0){
        let toc0=document.querySelectorAll('#toc0');//to en
        if(toc0.length>0){
            if(toc0[0].innerText=="このページはまだ存在しません。")window.location.replace(url[0].toString().replace("http://scp-jp.wikidot.com", "https://scp-wiki.wikidot.com"));
        }
    }else if(url[0].host.search(new RegExp("scp-wiki.wikidot.com", "i"))==0){
        GM_registerMenuCommand("ZH", () => {
            GM_openInTab("http://"+url[0].host.replace("scp-wiki.wikidot.com", "scp-zh-tr.wikidot.com")+url[0].pathname+url[0].search);
        });
        GM_registerMenuCommand("JA", () => {
            GM_openInTab("http://"+url[0].host.replace("scp-wiki.wikidot.com", "scp-jp.wikidot.com")+url[0].pathname+url[0].search);
        });
    }//https://archive.today/https://scp-wiki.wikidot.com/the-things-dr-bright-is-not-allowed-to-do-at-the-foundation
})();