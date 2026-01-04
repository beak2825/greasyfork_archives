// ==UserScript==
// @name         Poki Always Fullscreen Button 
// @namespace    https://poki.com/
// @version      1.1
// @description  Voeg fullscreen-knop toe bij Poki-games die hem missen (robustere versie). 🕹️
// @match        *://poki.com/*
// @match        *://www.poki.com/*
// @match        *://poki.com/nl/g/*
// @match        *://www.poki.com/nl/*
// @run-at       document-end
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/555753/Poki%20Always%20Fullscreen%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/555753/Poki%20Always%20Fullscreen%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createFullscreenButtonHtml() {
        return `
        <button type="button" id="fullscreen-button" class="HPn_GzeLxs8_4nNebuj1 phlaiC_iad_lookW5__d" aria-label="Volledig scherm">
            <div class="tqh57qBcKxMV9EdZQoAb">
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="AUcJqk5uLaoXL0jqRGuH">
                    <use href="#enterFullscreenIcon"></use>
                </svg>
            </div>
            <div class="aAJE6r6D5rwwQuTmZqYG">
                <span class="L6WSODmebiIqJJOEi46E Vlw13G6cUIC6W9LiGC_X"></span>
                <span class="L6WSODmebiIqJJOEi46E tz2DEu5qBC9Yd6hJGjoW">Volledig scherm</span>
            </div>
        </button>`;
    }

    function addFullscreenButtonIfMissing() {
        try {
            // zoek de header-container van het spel (gebaseerd op jouw voorbeelden)
            const gameHeader = document.querySelector('.J91n1ymJasoch_FZq89b');
            if (!gameHeader) return false;

            // stop als knop al bestaat
            if (gameHeader.querySelector('#fullscreen-button')) return true;

            // zoek het element waar we vóór willen invoegen (de "we zijn terug..." div in jouw snippets)
            const insertBeforeEl = gameHeader.querySelector('.gCaHtnVxpqX6wzDLyVYL');

            // als niet gevonden, fallback: voeg aan het einde van header toe
            if (insertBeforeEl) {
                insertBeforeEl.insertAdjacentHTML('beforebegin', createFullscreenButtonHtml());
            } else {
                gameHeader.insertAdjacentHTML('beforeend', createFullscreenButtonHtml());
            }

            const btn = gameHeader.querySelector('#fullscreen-button');
            if (!btn) return false;

            // functionaliteit: probeer echte Fullscreen API, anders "nep" fullscreen via CSS
            btn.addEventListener('click', () => {
                // prefer een iframe binnen het speelvlak; probeer een paar plausibele selectors
                const iframeCandidates = Array.from(document.querySelectorAll('iframe'));
                const iframe = iframeCandidates.find(f => f.offsetWidth > 100) || iframeCandidates[0];

                if (iframe) {
                    // als browser Fullscreen API toestaat
                    const requestFull = iframe.requestFullscreen || iframe.webkitRequestFullscreen || iframe.mozRequestFullScreen || iframe.msRequestFullscreen;
                    if (requestFull) {
                        try { requestFull.call(iframe); }
                        catch (e) {
                            // fallback to CSS if API errors
                            applyFakeFullscreen(iframe);
                        }
                    } else {
                        applyFakeFullscreen(iframe);
                    }
                } else {
                    console.warn('[Poki Userscript] Geen iframe gevonden om fullscreen te maken.');
                }
            });

            console.log('[Poki Userscript] Fullscreen-knop toegevoegd ✅');
            return true;
        } catch (err) {
            console.error('[Poki Userscript] Fout bij toevoegen fullscreen-knop:', err);
            return false;
        }
    }

    function applyFakeFullscreen(el) {
        el.style.position = 'fixed';
        el.style.top = '0';
        el.style.left = '0';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.zIndex = '2147483647';
        el.style.background = '#000';
    }

    // Observeer DOM — Poki laadt dynamisch, dus we blijven proberen tot het succeed
    const observer = new MutationObserver(() => {
        // probeer toevoegen; als succesvol, kunnen we blijven (maar we laten observer lopen in geval van SPA-navigatie)
        addFullscreenButtonIfMissing();
    });

    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // ook 1x proberen direct
    setTimeout(addFullscreenButtonIfMissing, 800);
})();
