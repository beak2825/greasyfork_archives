// ==UserScript==
// @name         Player Flutuante para 4chan (Floating Video Player)
// @namespace    https://4chan.org/
// @version      1.0
// @author       fumantezinho
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8OXLv8AAAD/w5cu/wAAAP8AAAAAAAAAAAAAAP/Dly7/AAAA/8OXLv8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAP/Dly7/w5cu/8OXLv8AAAD/AAAAAAAAAAAAAAD/w5cu/8OXLv/Dly7/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAD/w5cu/8OXLv/Dly7/AAAA/wAAAAAAAAAAAAAA/8OXLv/Dly7/w5cu/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Dly7/w5cu/wAAAP8AAAAAAAAAAAAAAP/Dly7/w5cu/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAP/Dly7/w5cu/8OXLv/Dly7/AAAA/wAAAAAAAAAAAAAA/8OXLv/Dly7/w5cu/8OXLv8AAAD/AAAAAAAAAAAAAAAAAAAA/8OXLv/Dly7/w5cu/wAAAP8AAAAAAAAAAAAAAP/Dly7/w5cu/8OXLv8AAAD/AAAAAAAAAAAAAAAAAAAA/8OXLv/Dly7/w5cu/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAA/8OXLv/Dly7/w5cu/wAAAP8AAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAOvXAADBgwAAwYMAAMGDAADhhwAA888AAP//AAD//wAAw8MAAIGBAADBgwAAg8EAAMfj/////////////w==
// @description  Player flutuante para 4chan
// @match        https://boards.4chan.org/*
// @match        https://boards.4channel.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558778/Player%20Flutuante%20para%204chan%20%28Floating%20Video%20Player%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558778/Player%20Flutuante%20para%204chan%20%28Floating%20Video%20Player%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* = Personalize os formatos para criar o embed = */

    const VIDEO_EXTENSIONS = ['webm', 'mp4', 'mkv', 'mov'];

    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        bottom: 16px;
        right: 16px;
        width: 380px;
        background: #000;
        z-index: 999999;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(0,0,0,.7);
        display: none;
        user-select: none;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        height: 28px;
        background: rgba(20,20,20,.9);
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px;
        color: #fff;
        font-size: 13px;
    `;
    header.textContent = 'Player';

    const close = document.createElement('span');
    close.textContent = '✕';
    close.style.cursor = 'pointer';
    close.style.fontSize = '16px';

    header.appendChild(close);

    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.width = '100%';

    close.onclick = () => {
        video.pause();
        video.src = '';
        container.style.display = 'none';
    };

    container.append(header, video);
    document.body.appendChild(container);

    /* ============ DRAG ============ */

    let drag = false, offsetX = 0, offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        drag = true;
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!drag) return;
        container.style.left = `${e.clientX - offsetX}px`;
        container.style.top = `${e.clientY - offsetY}px`;
        container.style.right = 'auto';
        container.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => drag = false);

    /* = Bloquear comportamento = */

    function overrideVideoLinks(root = document) {
        root.querySelectorAll('.file a').forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;

            const ext = href.split('.').pop().toLowerCase();
            if (!VIDEO_EXTENSIONS.includes(ext)) return;

            if (a.dataset.videoBlocked) return;

            a.dataset.videoUrl = a.href;
            a.dataset.videoBlocked = '1';

            a.removeAttribute('href');
            a.style.cursor = 'pointer';

            a.onclick = null;
            a.onmousedown = null;
        });
    }

    overrideVideoLinks();

    new MutationObserver(m => {
        m.forEach(mu => {
            mu.addedNodes.forEach(n => {
                if (n.nodeType === 1) overrideVideoLinks(n);
            });
        });
    }).observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;

        const link = e.target.closest('.file a[data-video-url]');
        if (!link) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const url = link.dataset.videoUrl;

        if (video.src !== url) {
            video.src = url;
            video.load();
        }

        container.style.display = 'block';

    }, true);
})();
