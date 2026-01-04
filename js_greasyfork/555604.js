// ==UserScript==
// @name         No Alert Plz
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Prevent browser alert from popping up
// @author       my
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjYzQxODE4IiBkPSJNMTIgMS42N2MuOTU1IDAgMS44NDUuNDY3IDIuMzkgMS4yNDdsLjEwNS4xNmw4LjExNCAxMy41NDhhMi45MTQgMi45MTQgMCAwIDEtMi4zMDcgNC4zNjNsLS4xOTUuMDA4SDMuODgyYTIuOTE0IDIuOTE0IDAgMCAxLTIuNTgyLTQuMmwuMDk5LS4xODVsOC4xMS0xMy41MzhBMi45MSAyLjkxIDAgMCAxIDEyIDEuNjdNMTIuMDEgMTVsLS4xMjcuMDA3YTEgMSAwIDAgMCAwIDEuOTg2TDEyIDE3bC4xMjctLjAwN2ExIDEgMCAwIDAgMC0xLjk4NnpNMTIgOGExIDEgMCAwIDAtLjk5My44ODNMMTEgOXY0bC4wMDcuMTE3YTEgMSAwIDAgMCAxLjk4NiAwTDEzIDEzVjlsLS4wMDctLjExN0ExIDEgMCAwIDAgMTIgOCIvPjwvc3ZnPg==
// @grant        none
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555604/No%20Alert%20Plz.user.js
// @updateURL https://update.greasyfork.org/scripts/555604/No%20Alert%20Plz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🔔 No Alert Plz')

    window.alert = function(message) {
        console.warn('🚫 Alert 被阻止, Msg: ', message);
        return undefined;
    };
})();