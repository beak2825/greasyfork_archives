// ==UserScript==
// @name           imgur to Filmot
// @description    Replaces all imgur links on reddit with Filmot links
// @include        http://*.reddit.com/*
// @include        http://reddit.com/*
// @include        https://*.reddit.com/*
// @include        https://reddit.com/*
// @version 0.0.1.20141029132227
// @namespace https://greasyfork.org/users/6425
// @downloadURL https://update.greasyfork.org/scripts/6121/imgur%20to%20Filmot.user.js
// @updateURL https://update.greasyfork.org/scripts/6121/imgur%20to%20Filmot.meta.js
// ==/UserScript==


var a = document.getElementsByTagName('a');
for (i=0;i<a.length;i++) {
    p = /imgur\.com\/([A-Za-z0-9]+)/;
    res = p.exec(a[i]);

    if (res!=null) {
        a[i].href = 'http://filmot.com/' + res[1];
    }
}