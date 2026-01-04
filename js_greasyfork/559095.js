// ==UserScript==
// @name        longcat css
// @description a
// @match       https://longcat.chat/*
// @run-at      document-start
// @version 0.0.1.20251216140424
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/559095/longcat%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/559095/longcat%20css.meta.js
// ==/UserScript==

(function () {

    const css = `
    :root {
            color-scheme: light dark !important;
        }

html, body {
    background: revert !important;
}

div#app > div.v-app-container > div.slider-menus {
    background: none !important;
}

* {
    color: revert !important;
    background: revert !important;
}

symbol#icon-phone path {
    fill: currentColor !important;
}

div:not(div.active) {
    border-color: revert !important;
}

symbol path {
    fill: currentColor !important;
}

#icon-new-fill {
    display: none !important;
}

div.download-btn {
    display: none !important;
}

div.platform-icon {
    display: none !important;
}

div.chat-home-title img.longcat-text {
    display: none !important;
}

span.custom-avatar {
    /* display: none !important; */
}

div.user-text {
    background-color: red !important;
    color: black !important;
}

svg path {
    fill: currentColor !important;
}

pre.code-block-wrapper {
    border: 1px solid red !important;
}

div.chat-input-wrap {
    background-color: black !important;
}

div.to-bottom-icon {
    display: none !important;
}
        `;

    const style = document.createElement('style');
    style.id = 'longcatCssStyleId';
    style.textContent = css;
    document.head.appendChild(style);
})();