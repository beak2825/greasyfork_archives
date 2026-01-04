// ==UserScript==
// @name         Twitter and X.com to www.sotwe.com
// @namespace    http://tampermonkey.net/
// @version      2024-05-29
// @description  Changes Twitter links from both twitter.com and x.com to www.sotwe.com links.
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561193/Twitter%20and%20Xcom%20to%20wwwsotwecom.user.js
// @updateURL https://update.greasyfork.org/scripts/561193/Twitter%20and%20Xcom%20to%20wwwsotwecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

const c=["https://twitter.com","https://x.com"],d=new RegExp(c.join("|"),"gi");let e;function f(){const g=new Map;document.querySelectorAll("a").forEach(a=>{c.some(b=>a.href.includes(b))&&g.set(a,{href:a.href,textContent:a.textContent})});g.forEach(({href:a,textContent:b},h)=>{h.href=a.replace(d,"https://www.sotwe.com");h.textContent=b.replace(d,"https://www.sotwe.com")})}(new MutationObserver(()=>{clearTimeout(e);e=setTimeout(f,1E3)})).observe(document,{attributes:!0,childList:!0,subtree:!0});f();

})();