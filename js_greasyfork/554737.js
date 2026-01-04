// ==UserScript==
// @name         Fix white cursor in docs
// @namespace    PlanetXX2
// @version      2025-11-04
// @description  Fix the annoying white cursor in Google Docs
// @license      MIT
// @author       PlanetXX2
// @match        https://docs.google.com/document/d/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554737/Fix%20white%20cursor%20in%20docs.user.js
// @updateURL https://update.greasyfork.org/scripts/554737/Fix%20white%20cursor%20in%20docs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const icon_url = "data:image/vnd.microsoft.icon;base64,AAACAAEAICACAA8AEAAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAgAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHvAAABEQAAAe8AAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAHvAAABEQAAAe8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///////////////////////////////////////hD///4A///+AP///8f////H////x////8f////H////x////8f////H////x////8f////H////x////gD///4A///+EP//////////////////////////////////////8="
    GM_addStyle(`
            .kix-appview-editor {
               cursor: url('${icon_url}'), text !important;
            }
        `);
})();