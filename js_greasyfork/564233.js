// ==UserScript==
// @name         Neopets Gallery Mobile Drag & Rank
// @version      1.0
// @description  Reorder Neopets Gallery items by dragging (Android-compatible)
// @namespace    cutiepie
// @match        https://www.neopets.com/gallery/index.phtml?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564233/Neopets%20Gallery%20Mobile%20Drag%20%20Rank.user.js
// @updateURL https://update.greasyfork.org/scripts/564233/Neopets%20Gallery%20Mobile%20Drag%20%20Rank.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =====================
       CSS
    ====================== */
    const css = `
    .card-groups {
        display: grid;
        grid-template-columns: repeat(4, minmax(0,1fr));
        gap: 6px;
        text-align: center;
    }

    .card-group {
        position: relative;
        padding: 8px;
        background: #eee;
        border: 1px solid #aaa;
        border-radius: 6px;
        user-select: none;
        touch-action: none;
    }

    .card-group.dragging {
        opacity: 0.7;
        z-index: 9999;
        position: fixed !important;
        pointer-events: none;
    }

    .card-group-qty {
        position: absolute;
        top: 6px;
        right: 6px;
        background: #2e7d32;
        color: #fff;
        padding: 3px 6px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
    }

    .card-group-rank {
        display: none;
    }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    /* =====================
       Build gallery cards
    ====================== */

    $("#gallery_form tr:nth-child(4n)").remove();

    let buf = [];
    const cards = [];

    [1,2,3,4].forEach((col, colIndex) => {
        $(`#gallery_form td:not([colspan]):nth-child(4n+${col})`).each((i, td) => {
            const html = td.innerHTML;
            const part = i % 3;

            if (part === 0) buf.push(`<div>${html}</div>`);
            if (part === 1) buf.push(`<div class="card-group-qty">${html.replace("Qty:", "x")}</div>`);
            if (part === 2) buf.push(`<div class="card-group-rank">${html}</div>`);

            if (buf.length === 3) {
                const row = Math.floor(i / 3);
                cards[colIndex + row * 4] =
                    `<div class="card-group">${buf.join("")}</div>`;
                buf = [];
            }
        });
    });

    $("#gallery_form tr:not(:last)").remove();

    const container = document.createElement('div');
    container.className = 'card-groups';
    $("#gallery_form table").before(container);
    container.innerHTML = cards.join("");

    /* =====================
       TOUCH DRAG LOGIC
    ====================== */

    let dragged = null;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let placeholder = null;

    container.querySelectorAll('.card-group').forEach(card => {
        card.addEventListener('touchstart', e => {
            const t = e.touches[0];
            dragged = card;

            const rect = card.getBoundingClientRect();
            offsetX = t.clientX - rect.left;
            offsetY = t.clientY - rect.top;

            startX = rect.left;
            startY = rect.top;

            placeholder = document.createElement('div');
            placeholder.style.width = rect.width + 'px';
            placeholder.style.height = rect.height + 'px';
            placeholder.style.visibility = 'hidden';

            card.after(placeholder);

            card.classList.add('dragging');
            card.style.left = startX + 'px';
            card.style.top  = startY + 'px';

            e.preventDefault();
        }, { passive: false });
    });

    document.addEventListener('touchmove', e => {
        if (!dragged) return;
        const t = e.touches[0];

        dragged.style.left = (t.clientX - offsetX) + 'px';
        dragged.style.top  = (t.clientY - offsetY) + 'px';

        const els = [...container.querySelectorAll('.card-group:not(.dragging)')];
        for (const el of els) {
            const box = el.getBoundingClientRect();
            if (
                t.clientX > box.left &&
                t.clientX < box.right &&
                t.clientY > box.top &&
                t.clientY < box.bottom
            ) {
                container.insertBefore(placeholder, el);
                break;
            }
        }

        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', () => {
        if (!dragged) return;

        dragged.classList.remove('dragging');
        dragged.style.left = '';
        dragged.style.top  = '';
        dragged.style.position = 'relative';

        placeholder.replaceWith(dragged);

        dragged = null;
        placeholder = null;

        updateRanks();
    });

    function updateRanks() {
        document.querySelectorAll('input.glry_rank').forEach((x, i) => {
            x.value = i + 1;
        });
    }

})();