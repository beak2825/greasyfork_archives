// ==UserScript==
// @name Lolz Classic Mentions
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Классический вид упоминаний
// @author MeloniuM
// @match https://lolz.live/*
// @match https://zelenka.guru/*
// @grant none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551946/Lolz%20Classic%20Mentions.user.js
// @updateURL https://update.greasyfork.org/scripts/551946/Lolz%20Classic%20Mentions.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement('style');
    style.textContent =`
.username.mention > span:before {
    content: "";
}
.username .avatar {
    display: none;
}
a.mention {
    background-color: transparent !important;
}
.mention .uniqUsernameIcon--custom {
    display:none;
}
`;
    document.head.appendChild(style);
})();