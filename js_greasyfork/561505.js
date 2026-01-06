// ==UserScript==
// @name         RetroGameTalk - Toggle User Extras
// @namespace    https://retrogametalk.com/
// @version      1.0
// @description  Toggle dos detalhes do usuário com banners compactos quadrados e centralizados
// @match        https://retrogametalk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561505/RetroGameTalk%20-%20Toggle%20User%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/561505/RetroGameTalk%20-%20Toggle%20User%20Extras.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =======================
       CSS
        ======================= */
    const style = document.createElement('style');
    style.textContent = `
        /* Toggle */
        .tm-toggle {
            cursor: pointer;
            display: flex;
            justify-content: center;
            margin-bottom: 6px;
        }

        .tm-icon {
            width: 10px;
            height: 10px;
            border-right: 2px solid #fff;
            border-bottom: 2px solid #fff;
            transform: rotate(45deg);
            transition: transform 0.2s ease;
        }

        .tm-icon.open {
            transform: rotate(-135deg);
        }

        /* =======================
           COMPACT MODE
        ======================= */

        .tm-compact .userBanner::before {
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
}

        .tm-compact .message-userBanner {
            display: flex;
            gap: 6px;
            justify-content: center;
        }

        /* TODOS os userBanners */
        .tm-compact .userBanner {
            width: 28px;
            height: 28px;
            padding: 12px !important;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            left: auto !important;
        }

        /* centraliza qualquer SVG / ícone interno */
        .tm-compact .userBanner svg,
        .tm-compact .userBanner i {
            margin: 0 !important;
        }

        /* remove texto dos banners normais */
        .tm-compact .userBanner strong {
            display: none;
        }

/* =======================
   LEVEL (SÓ NÚMERO)
======================= */

/* LEVEL: mostrar apenas o número */
.tm-compact .userBanner[class*="userBanner--level"]::after {
    content: attr(data-level);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-weight: 700;
    font-size: 13px;
    line-height: 1;
    color: inherit;
}

/* remove QUALQUER ícone do level */
.tm-compact .userBanner[class*="userBanner--level"]::before,
.tm-compact .userBanner[class*="userBanner--level"] .userBanner-before {
    content: none !important;
    display: none !important;
}

/* remove todo o conteúdo interno */
.tm-compact .userBanner[class*="userBanner--level"] > * {
    display: none !important;
}

/* ===== FIX DE REFLUXO ===== */

/* container da coluna do usuário */
.message-user {
    min-width: 160px;   /* ajuste se quiser */
    max-width: 160px;
    flex-shrink: 0;
}

/* mantém largura mesmo no compacto */
.tm-compact.message-user {
    min-width: 160px;
    max-width: 160px;
}

/* mostra apenas o número do level */
.tm-compact .userBanner[class*="userBanner--level"]::after {
    content: attr(data-level);
    font-weight: 700;
    font-size: 13px;
    line-height: 1;
    position: static;
}
    `;
    document.head.appendChild(style);

    /* =======================
       extrair número do level
    ======================= */
    function prepareLevel(userBlock) {
        const level = userBlock.querySelector('.userBanner[class*="userBanner--level"]');
        if (!level) return;

        if (!level.dataset.level) {
            const match = level.textContent.match(/\b\d+\b/);
            if (match) {
                level.dataset.level = `★${match[0]}`;
            }
        }
    }

    /* =======================
       Init
    ======================= */
    function init() {
        document.querySelectorAll('.message-userExtras').forEach(extras => {
            if (extras.dataset.toggleApplied) return;
            extras.dataset.toggleApplied = 'true';

            const userBlock = extras.closest('.message-user');
            if (!userBlock) return;

            prepareLevel(userBlock);


            extras.style.display = 'none';
            userBlock.classList.add('tm-compact');

            const toggle = document.createElement('div');
            toggle.className = 'tm-toggle';

            const icon = document.createElement('span');
            icon.className = 'tm-icon';

            toggle.appendChild(icon);

            toggle.addEventListener('click', () => {
                const hidden = extras.style.display === 'none';

                extras.style.display = hidden ? '' : 'none';
                icon.classList.toggle('open', hidden);
                userBlock.classList.toggle('tm-compact', !hidden);
            });

            extras.parentNode.insertBefore(toggle, extras);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    new MutationObserver(init).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
