// ==UserScript==
// @name        MOLE Speedrun Page
// @license     MIT
// @namespace   Violentmonkey Scripts
// @match       https://mmatt-ugh.itch.io/mole*
// @match       https://html-classic.itch.zone/html/3949815/moleGameV1/index.html*
// @grant       none
// @version     1.21
// @author      Knspio
// @description Removes unnecessary elements from the page, fits the game to the screen, supports a configurable hotkey for resets, and automatically focuses the game. Use 100% zoom in fullscreen.
// @downloadURL https://update.greasyfork.org/scripts/548097/MOLE%20Speedrun%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/548097/MOLE%20Speedrun%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

/*
   ==============================
   CONFIGURABLE HOTKEY FOR RESETS
   ==============================

  Common key values:
  -----------------
  Letter keys: 'a', 'b', ... 'z'
  Number keys: '0', '1', ... '9'
  Arrow keys: 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
  Spacebar: ' '
  Enter: 'Enter'
  Escape: 'Escape'
  Function keys: 'F1', 'F2', ... 'F12'
  Tab: 'Tab'

  How to find any key's value:
  1. Open your browser console (F12 → Console).
  2. Paste: window.addEventListener('keydown', e => console.log(e.key));
  3. Press the key you want to use; the console will log the exact value.
  4. Use that value in HOTKEY.key.
*/
    const HOTKEY = {
        key: 'ArrowUp',   // The key to press (case-insensitive)
        ctrl: false,      // Require Ctrl key?
        shift: false,     // Require Shift key?
        alt: false        // Require Alt key?
    };

    function isHotkey(e) {
        return e.key.toLowerCase() === HOTKEY.key.toLowerCase()
            && (!!HOTKEY.ctrl === e.ctrlKey)
            && (!!HOTKEY.shift === e.shiftKey)
            && (!!HOTKEY.alt === e.altKey);
    }

    // ===========================
    // Detect which page we're on
    // ===========================
    const host = window.location.hostname;

    // ---------------- Parent page ----------------
    if (host === 'mmatt-ugh.itch.io') {

        function removeSiblings(el) {
            if (!el || el.tagName.toLowerCase() === 'body') return;
            const parent = el.parentElement;
            if (!parent) return;
            Array.from(parent.children).forEach(child => {
                if (child !== el) child.remove();
            });
            removeSiblings(parent);
        }

        function focusIframe(iframe) {
            if (!iframe) return;
            iframe.focus();
            try { iframe.contentWindow.focus(); } catch (_) {}
        }

        function ensureFocus(iframe) {
            focusIframe(iframe);
            setTimeout(() => focusIframe(iframe), 100);
            setTimeout(() => focusIframe(iframe), 300);
        }

        function reloadIframe(iframe) {
            const src = iframe.getAttribute('src') || '';
            const url = new URL(src, location.href);
            url.searchParams.set('reload', Date.now().toString());
            iframe.src = url.toString();
        }

        window.addEventListener('load', () => {
            const iframe = document.querySelector('iframe#game_drop');
            if (!iframe) return;

            // Remove unnecessary siblings
            removeSiblings(iframe);

            // Remove bottom padding from inner column
            const inner = document.querySelector('#inner_column');
            if (inner) inner.style.paddingBottom = '0';

            // Style fixes
            const style = document.createElement('style');
            style.textContent = `
              .view_game_page.view_html_game_page .embed_wrapper {
                  margin-top: 0px !important;
                  margin-bottom: 0px !important;
              }
              .game_frame {
                  width: 954px !important;
                  height: 954px !important;
              }`;
            document.head.appendChild(style);

            // Focus immediately
            ensureFocus(iframe);

            // Focus after iframe loads
            iframe.addEventListener('load', () => ensureFocus(iframe));

            // Ctrl+R (or configurable hotkey) reload
            document.addEventListener('keydown', (e) => {
                if (isHotkey(e)) {
                    e.preventDefault();
                    reloadIframe(iframe);
                    iframe.addEventListener('load', () => ensureFocus(iframe), { once: true });
                }
            });

            // Listen for reload requests from iframe
            window.addEventListener('message', (ev) => {
                if (ev.data && ev.data.type === 'reload-iframe') {
                    reloadIframe(iframe);
                    iframe.addEventListener('load', () => ensureFocus(iframe), { once: true });
                }
            });
        });
    }

    // ---------------- Iframe page ----------------
    if (host === 'html-classic.itch.zone') {
        window.addEventListener('load', () => {
            const style = document.createElement('style');
            style.textContent = `
              #canvas {
                  height: 954px !important;
                  width: 954px !important;
              }`;
            document.head.appendChild(style);

            // Hotkey inside iframe to trigger parent reload
            function iframeHotkeyHandler(e) {
                if (isHotkey(e)) {
                    e.preventDefault();
                    try { parent.postMessage({ type: 'reload-iframe' }, '*'); } catch (_) {}
                }
            }

            window.addEventListener('keydown', iframeHotkeyHandler, true);
            document.addEventListener('keydown', iframeHotkeyHandler, true);
        });
    }

})();
