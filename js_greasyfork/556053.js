// ==UserScript==
// @name         Bypass Delta + zen
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  zen n delta
// @author       nytralis
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556053/Bypass%20Delta%20%2B%20zen.user.js
// @updateURL https://update.greasyfork.org/scripts/556053/Bypass%20Delta%20%2B%20zen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isIzen = location.hostname.includes('izen.lol');
    const currentUrl = window.location.href;
    const lowerUrl = currentUrl.toLowerCase();
    const keywords = ['auth', 'plato', 'boost', 'bstshrt'];

    // --- PARTIE CAPTURE URL : capture si window.name vide (sur tous sites sauf izen pour éviter overwrite) ---
    if (!isIzen && (!window.name || window.name.trim() === '')) {
        try {
            window.name = currentUrl; // capture complète
            console.log('[Universal Capture] URL complète stockée :', window.name);
        } catch (e) {
            console.error('[Universal Capture] Erreur stockage window.name', e);
        }
    }

    // --- PARTIE AUTO-REDIRECT + COPY si mots-clés (uniquement si pas sur izen) ---
    function copyAndRedirect() {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(currentUrl);
            console.log('[Redirect] URL copiée via GM_setClipboard');
        } else if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(currentUrl).catch(console.error);
            console.log('[Redirect] URL copiée via navigator.clipboard');
        }
        window.location.replace('https://izen.lol/');
    }

    if (!isIzen && keywords.some(k => lowerUrl.includes(k))) {
        copyAndRedirect();
    }

    // --- BOUTON DISCRET (uniquement si pas sur izen) ---
    if (!isIzen) {
        const btn = document.createElement('div');
        btn.innerHTML = '🔗';
        btn.title = 'Copier URL + rediriger vers izen.lol';

        btn.style.cssText = `
            position: fixed !important;
            top: 12px !important;
            left: 12px !important;
            z-index: 999999 !important;
            width: 42px !important;
            height: 42px !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            font-size: 20px !important;
            cursor: pointer !important;

            backdrop-filter: blur(10px) !important;
            background: rgba(255, 255, 255, 0.15) !important;
            border-radius: 12px !important;
            border: 1px solid rgba(255,255,255,0.25) !important;

            color: #fff !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;

            transition: all 0.25s ease !important;
            user-select: none !important;
        `;

        // Effet hover moderne
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.12)';
            btn.style.background = 'rgba(255,255,255,0.25)';
            btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.background = 'rgba(255,255,255,0.15)';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });

        // Clic
        btn.addEventListener('click', copyAndRedirect);

        // Injection
        function inject() {
            if (document.body) document.body.appendChild(btn);
            else requestAnimationFrame(inject);
        }
        inject();
    }

    // --- PARTIE IZEN.LOL : récupère URL et remplit les champs ---
    if (isIzen) {
        const getTargetURL = () => {
            if (window.name && window.name.trim()) return window.name.trim();
            const params = new URLSearchParams(window.location.search);
            const u = params.get('url');
            if (u) return u;
            if (document.referrer) return document.referrer;
            return 'https://www.google.com/';
        };

        const targetURL = getTargetURL();

        let correctedURL = targetURL;
        try {
            const u = new URL(targetURL);
            if (!u.pathname || u.pathname === '/') {
                if (!correctedURL.endsWith('/')) correctedURL += '/';
            }
        } catch (e) {
            correctedURL = 'https://www.youtube.com/';
        }

        console.log('[Izen.lol] URL à utiliser :', correctedURL);

        const fillFields = () => {
            const inputs = document.querySelectorAll('input[type="text"], input[type="url"], input:not([type]), textarea');
            let filled = 0;
            inputs.forEach(input => {
                if (!input.disabled && !input.readOnly && input.type !== 'password' && input.type !== 'hidden') {
                    try {
                        const nativeSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
                        if (nativeSetter) nativeSetter.call(input, correctedURL);
                        else input.value = correctedURL;
                        ['input', 'change'].forEach(ev => input.dispatchEvent(new Event(ev, { bubbles: true })));
                        filled++;
                    } catch (e) { console.warn('Erreur remplissage input', e, input); }
                }
            });
            return filled;
        };

        const triggerSubmitByEnter = () => {
            const inputs = document.querySelectorAll('input[type="text"], input[type="url"]');
            inputs.forEach(input => {
                if (input.value.trim() === correctedURL.trim()) {
                    try {
                        input.focus();
                        const enterDown = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', which: 13, keyCode: 13, bubbles: true });
                        input.dispatchEvent(enterDown);
                        const enterPress = new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', which: 13, keyCode: 13, bubbles: true });
                        input.dispatchEvent(enterPress);
                        const enterUp = new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', which: 13, keyCode: 13, bubbles: true });
                        input.dispatchEvent(enterUp);
                        console.log('[Izen.lol] Enter simulé sur input !');
                    } catch (e) {
                        console.warn('Erreur simulation Enter', e, input);
                    }
                }
            });
        };

        const clickSubmitButton = () => {
            const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'));
            buttons.forEach(btn => {
                const text = (btn.textContent || btn.value || '').trim().toLowerCase();
                if (['submit', 'bypass', 'go'].some(word => text.includes(word)) && !btn.disabled) {
                    btn.click();
                    console.log('[Izen.lol] Bouton Submit/Bypass cliqué !');
                }
            });
        };

        const performSubmit = () => {
            triggerSubmitByEnter();
            clickSubmitButton();
        };

        const clickCopy = () => {
            const copyButtons = Array.from(document.querySelectorAll('button, input[type="button"], a'))
                .filter(el => (el.textContent || el.value || '').trim().toLowerCase().includes('copy'));
            copyButtons.forEach(btn => {
                try { btn.click(); console.log('[Izen.lol] Copy cliqué !'); } catch(e){}
            });
        };

        let initialSubmitDone = false;
        let spamInterval;
        let copyDetected = false;

        const monitorCopyButton = () => {
            const copyButtons = Array.from(document.querySelectorAll('button, input[type="button"], a'))
                .filter(el => (el.textContent || el.value || '').trim().toLowerCase().includes('copy'));
            if (copyButtons.length > 0 && !copyDetected) {
                copyDetected = true;
                if (spamInterval) clearInterval(spamInterval); // Arrête le spam submit
                console.log('[Izen.lol] Bouton Copy détecté, arrêt du spam submit.');
                clickCopy(); // Clique une fois
                setTimeout(clickCopy, 500); // Clique une seconde fois après 0.5s
            }
        };

        const run = () => {
            const filled = fillFields();
            if (filled > 0 && !initialSubmitDone) {
                setTimeout(performSubmit, 500); // Soumission initiale
                initialSubmitDone = true;
                // Démarrer le spam toutes les 5 secondes après l'initial
                spamInterval = setInterval(performSubmit, 5000);
            }
            monitorCopyButton(); // Vérifie le bouton copy à chaque run
            if (!copyDetected) {
                setTimeout(clickCopy, 1500); // Essaye copy si pas encore détecté
            }
        };

        // Exécution initiale et toutes les 2 secondes pour fill, submit initial, spam, et monitor
        setInterval(run, 2000);
        setTimeout(run, 1000);

        try { window.name = ''; } catch(e){}

        const panel = document.createElement('div');
        panel.style.cssText = 'position:fixed;bottom:10px;left:10px;z-index:99999;background:#000;color:#0f0;padding:10px;border-radius:8px;font-family:monospace;font-size:12px;';
        panel.innerHTML = `<strong>IZEN.LOL OK</strong><br>URL: ${correctedURL.substring(0,50)}...`;
        document.body.appendChild(panel);
    }
})();