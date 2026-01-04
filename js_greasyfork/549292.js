// ==UserScript==
// @name         ufret - 広告ブロック
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-06-23
// @description  ・。・
// @author       ぐらんぴ
// @match        https://www.ufret.jp/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549292/ufret%20-%20%E5%BA%83%E5%91%8A%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/549292/ufret%20-%20%E5%BA%83%E5%91%8A%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

const log = console.log;
const $S = el => document.querySelector(el), $SA = el => document.querySelectorAll(el)

const sites = {
    "ufret": { domain: "www.ufret.jp", adb: true, scroll: true},
};

function getSiteConfigByDomain(domain){ return Object.values(sites).find(site => site.domain === domain) };

function adBlock(){
    const origAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(...args){
        try{
            let site = getSiteConfigByDomain(location.host);
            const el = args[0];
            if(site.adb){// ufret
                if(el.localName === "span" && el.id) args = ""
                if(el.localName === "script" && el.src?.includes("ads")) args = ""
            }
        }catch(e){//log(e)
        };
        return origAppendChild.apply(this, args);
    };
}adBlock()

function scrollToTarget(){
    let site = getSiteConfigByDomain(location.host);
    if(site.scroll){// ufret
        $S('#my-chord-data').scrollIntoView({ behavior: 'smooth' });
    }
}

function enableRclick(){
    const events = ['contextmenu', 'selectstart', 'copy', 'cut', 'mousedown', 'mouseup'];
    events.forEach(evt => {
        window.addEventListener(evt, e => e.stopPropagation(), true);
        document.addEventListener(evt, e => e.stopPropagation(), true);
    });
}enableRclick()

window.onload = () => { try{ scrollToTarget(); }catch{} };

GM_addStyle(`
/* ufret */
#full-screen-ad { display : none; }
tonefuse-ad { display : none; }
polygon { display : none; }
`)