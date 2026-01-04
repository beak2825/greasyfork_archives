// ==UserScript==
// @name         YouTube Customizer
// @namespace    https://greasyfork.org/users/ton-nom
// @version      1.0
// @description  Personnalise l'apparence de YouTube (couleurs, éléments cachés, etc.)
// @author       TonNom
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/5a8c2c6f/img/favicon_32x32.png
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 🎨 Thème personnalisé
    GM_addStyle(`
        body {
            background-color: #0f0f0f !important;
            color: #eee !important;
        }
        #masthead {
            background-color: #202020 !important;
        }
        a, ytd-thumbnail, ytd-video-renderer {
            border-radius: 10px !important;
        }
    `);

    // 🚫 Cacher les shorts
    function hideShorts() {
        const shorts = document.querySelectorAll('ytd-rich-section-renderer, ytd-reel-shelf-renderer');
        shorts.forEach(el => el.style.display = 'none');
    }

    // 👁️ Ajouter un bouton pour activer/désactiver le mode minimaliste
    function addMinimalButton() {
        if (document.querySelector('#minimalButton')) return;

        const btn = document.createElement('button');
        btn.id = 'minimalButton';
        btn.innerText = '🧘 Mode minimaliste';
        Object.assign(btn.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: '9999',
            background: '#ff0000',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
        });

        let active = false;
        btn.onclick = () => {
            active = !active;
            document.querySelector('#secondary')?.style.setProperty('display', active ? 'none' : '');
            document.querySelector('#comments')?.style.setProperty('display', active ? 'none' : '');
            btn.style.background = active ? '#22bb33' : '#ff0000';
        };

        document.body.appendChild(btn);
    }

    // Exécution
    const observer = new MutationObserver(() => {
        hideShorts();
        addMinimalButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
