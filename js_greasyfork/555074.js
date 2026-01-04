// ==UserScript==
// @name         Better Claude UI
// @namespace    https://greasyfork.org/en/users/795282-daijro
// @version      1.0
// @description  Dark oceanic theme, remove ugly fonts, & other fixes
// @author       daijro
// @match        https://claude.ai/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555074/Better%20Claude%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/555074/Better%20Claude%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // override ctrl+shift+i to open devtools
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.stopImmediatePropagation();
        }
    }, true);

    // fix pasting not having newlines (remove text/html data)
    document.addEventListener('paste', function(e) {
        const clipboardData = e.clipboardData || window.clipboardData;

        const hasPlainText = clipboardData.types.includes('text/plain');
        const hasHtml = clipboardData.types.includes('text/html');

        if (hasPlainText && hasHtml) {
            e.preventDefault();
            e.stopImmediatePropagation();

            const plainText = clipboardData.getData('text/plain');

            // create a new ClipboardEvent with only plain text
            const newClipboardData = new DataTransfer();
            newClipboardData.setData('text/plain', plainText.trimLeft());

            const newEvent = new ClipboardEvent('paste', {
                clipboardData: newClipboardData,
                bubbles: true,
                cancelable: true
            });

            // send
            e.target.dispatchEvent(newEvent);
        }
    }, true);

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        /* replace serif fonts with sans fonts */
        :root {
          --font-anthropic-serif: var(--font-anthropic-sans) !important;
          --font-ui-serif: var(--font-ui) !important;
          --tw-bg-opacity !important;
        }
        
        /* oceanic dark theme */
        [data-theme=claude][data-mode=dark] {
            --accent-brand: 195 63.1% 52.6%;
            --accent-main-000: 195 54.2% 44.2%;
            --accent-main-100: 195 63.1% 52.6%;
            --accent-main-200: 195 63.1% 52.6%;
            --accent-main-900: 0 0% 0%;
            --accent-pro-000: 71 84.6% 67.5%;
            --accent-pro-100: 71 40.2% 47.1%;
            --accent-pro-200: 71 40% 38.1%;
            --accent-pro-900: 70 25.3% 12.4%;
            --accent-secondary-000: 30 65.5% 60.1%;
            --accent-secondary-100: 30 70.9% 44.6%;
            --accent-secondary-200: 30 70.9% 44.6%;
            --accent-secondary-900: 30 55.9% 17.6%;
            --bg-000: 240 8% 11.4%;
            --bg-100: 240 8% 7.5%;
            --bg-200: 210 8% 4.8%;
            --bg-300: var(--bg-000);
            --bg-400: var(--bg-000);
            --bg-500: 0 0% 0%;
            --border-100: 231 16.5% 77.5%;
            --border-200: 231 16.5% 77.5%;
            --border-300: 231 16.5% 77.5%;
            --border-400: 231 16.5% 77.5%;
            --danger-000: 180 98.4% 68.1%;
            --danger-100: 180 67% 52.6%;
            --danger-200: 180 67% 52.6%;
            --danger-900: 180 46.5% 20.8%;
            --oncolor-100: 0 0% 93%;
            --oncolor-200: 240 6.7% 90.1%;
            --oncolor-300: 240 6.7% 90.1%;
            --pictogram-100: 228 3.4% 22.2%;
            --pictogram-200: 240 2.5% 16.3%;
            --pictogram-300: 240 2.1% 11.4%;
            --pictogram-400: 240 2.7% 7.5%;
            --success-000: 277 59.1% 39.1%;
            --success-100: 277 75% 25.9%;
            --success-200: 277 75% 25.9%;
            --success-900: 307 100% 6.9%;
            --text-000: 228 33.3% 90.1%;
            --text-100: 228 33.3% 90.1%;
            --text-200: 230 9% 66.7%;
            --text-300: 230 9% 66.7%;
            --text-400: 228 4.8% 52.2%;
            --text-500: 228 4.8% 52.2%;
        }
        *, *:after, *:before {
            --tw-gradient-from-position: none !important;
        }
        /* fix scrollbar coloring */
        * {
          scrollbar-color: hsla(var(--bg-300)/50%) transparent !important;
        }
        /* fix menu button coloring */
        div.rounded-lg:not([role=menuitem]) {
          background-color: #151519 !important;
        }
    `;
    document.head.appendChild(style);
})();