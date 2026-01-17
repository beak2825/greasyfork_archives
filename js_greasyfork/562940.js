// ==UserScript==
// @name MP fix (Hopefully the last one)
// @namespace tampermonkey.net
// @version 2.1
// @description Does what it says.
// @author I did this. :3
// @match ://.mangapark.org/*
// @match ://.mangapark.net/*
// @match ://.mangapark.to/*
// @match ://.mangapark.io/*
// @match ://.comicpark.org/*
// @match ://.comicpark.to/*
// @match ://.readpark.org/*
// @match ://.readpark.net/*
// @match ://.mpark.to/*
// @match ://.fto.to/*
// @match ://.jto.to/*
// @grant none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/562940/MP%20fix%20%28Hopefully%20the%20last%20one%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562940/MP%20fix%20%28Hopefully%20the%20last%20one%29.meta.js
// ==/UserScript==
(function() {
'use strict';
const host = window.location.protocol + "//" + window.location.host;
const imgs = document.getElementsByTagName("img");

for (let i = 0; i < imgs.length; i++) {
    let s = imgs[i].getAttribute("src");
    if (!s) continue;

    if (s.indexOf("//s") !== -1 && s.indexOf(".") !== -1) {
        let p = s.split("//")[1];
        p = p.substring(p.indexOf("/"));
        imgs[i].src = host + p;
    }
}
})();