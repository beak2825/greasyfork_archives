// ==UserScript==
// @name         CYCANI 竖排胶囊工具条
// @namespace    https://cycani.org/
// @version      2.0
// @description  网页全屏 + 刷新 + 上下集，竖排胶囊形工具条
// @author       wakaba
// @match        https://www.cycani.org/*
// @grant        none
// @icon         https://www.cycani.org/upload/site/20240319-1/25e700991446a527804c82a744731b60.png
// @downloadURL https://update.greasyfork.org/scripts/555434/CYCANI%20%E7%AB%96%E6%8E%92%E8%83%B6%E5%9B%8A%E5%B7%A5%E5%85%B7%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/555434/CYCANI%20%E7%AB%96%E6%8E%92%E8%83%B6%E5%9B%8A%E5%B7%A5%E5%85%B7%E6%9D%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const container = document.querySelector('.MacPlayer');
    const header = document.querySelector('.head');
    const sidebarSwitch = document.querySelector('.player-switch');
    if (!container) return;

    const STORAGE_POS = 'cycani_toolBar_pos';
    const STORAGE_FULLSCREEN = 'cycani_fullscreen_mode';

    const mask = document.createElement('div');
    mask.id = 'cycaniMask';
    mask.style.position = 'fixed';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.width = '100vw';
    mask.style.height = '100vh';
    mask.style.backgroundColor = 'black';
    mask.style.opacity = '0.8';
    mask.style.zIndex = '999999';
    mask.style.display = 'none';
    document.body.appendChild(mask);

    const toolBar = document.createElement('div');
    toolBar.id = 'cycaniToolBar';
    toolBar.style.display = 'none';
    document.body.appendChild(toolBar);

    function createButton(text, title) {
        const btn = document.createElement('div');
        btn.className = 'tool-btn';
        btn.innerText = text;
        btn.title = title;
        return btn;
    }

    function createDivider() {
        const div = document.createElement('div');
        div.className = 'tool-divider';
        return div;
    }

    const btnFullscreen = createButton('⛶', '网页全屏切换');
    const btnRefresh = createButton('↺', '刷新页面');
    const btnPrev = createButton('⏮', '上一集');
    const btnNext = createButton('⏭', '下一集');

    toolBar.append(
        btnFullscreen,
        createDivider(),
        btnRefresh,
        createDivider(),
        btnPrev,
        createDivider(),
        btnNext
    );

    const style = document.createElement('style');
    style.textContent = `
    #cycaniToolBar {
        position: fixed;
        width: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 4px;
        border-radius: 24px;
        background-color: #ed5d64;
        box-shadow: 0 0 6px rgba(0,0,0,0.3);
        z-index: 999998;
        user-select: none;
        cursor: grab;
    }
    #cycaniToolBar.fullscreen-mode {
        background-color: black !important;
        box-shadow: 0 0 6px 2px rgba(255,255,255,0.4);
    }
    .tool-btn {
        width: 38px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: white;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.2s ease;
        border-radius: 8px;
    }
    .tool-btn:hover {
        transform: scale(1.05);
    }
    .tool-divider {
        width: 36px;
        height: 1px;
        background-color: rgba(255,255,255,0.6);
        margin: 1px 0;
        border-radius: 1px;
    }
    .tool-btn.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none !important;
    }
    #cycaniMask {
        transition: opacity 0.3s ease;
    }
    `;
    document.head.appendChild(style);

    const savedPos = localStorage.getItem(STORAGE_POS);
    if (savedPos) {
        const { x, y } = JSON.parse(savedPos);
        toolBar.style.left = x + 'px';
        toolBar.style.top = y + 'px';
    } else {
        toolBar.style.right = '20px';
        toolBar.style.bottom = '20px';
    }

    let isDragging = false, offsetX = 0, offsetY = 0;
    toolBar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('tool-btn')) return;
        isDragging = true;
        offsetX = e.clientX - toolBar.offsetLeft;
        offsetY = e.clientY - toolBar.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        const maxX = window.innerWidth - toolBar.offsetWidth;
        const maxY = window.innerHeight - toolBar.offsetHeight;
        newX = Math.min(Math.max(0, newX), maxX);
        newY = Math.min(Math.max(0, newY), maxY);
        toolBar.style.left = newX + 'px';
        toolBar.style.top = newY + 'px';
        toolBar.style.right = 'auto';
        toolBar.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        localStorage.setItem(STORAGE_POS, JSON.stringify({
            x: toolBar.offsetLeft,
            y: toolBar.offsetTop
        }));
    });

    function toggleFullscreen() {
        const isFull = document.body.classList.contains('web-fullscreen-mode');
        if (isFull) {
            container.style = '';
            document.body.style.overflow = '';
            document.body.classList.remove('web-fullscreen-mode');
            if (header) header.style.display = '';
            if (sidebarSwitch) sidebarSwitch.style.display = '';
            toolBar.classList.remove('fullscreen-mode');
            localStorage.setItem(STORAGE_FULLSCREEN, '0');
        } else {
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100vw';
            container.style.height = '100vh';
            container.style.zIndex = '99998';
            document.body.style.overflow = 'hidden';
            document.body.classList.add('web-fullscreen-mode');
            if (header) header.style.display = 'none';
            if (sidebarSwitch) sidebarSwitch.style.display = 'none';
            toolBar.classList.add('fullscreen-mode');
            localStorage.setItem(STORAGE_FULLSCREEN, '1');
        }
    }
    btnFullscreen.addEventListener('click', toggleFullscreen);

    function showMask() { mask.style.display = 'block'; }
    function hideMask() { mask.style.display = 'none'; }

    function getEpisodes() {
        const episodeLinks = document.querySelectorAll('#play2 .anthology-list-play li a');
        return Array.from(episodeLinks);
    }
    function getCurrentEpisode(episodes) {
        const currentLi = document.querySelector('#play2 .anthology-list-play li.on a');
        if (!currentLi) return 1;
        return Number(currentLi.href.split('/').pop().replace('.html',''));
    }
    function updateEpisodeButtons() {
        const episodes = getEpisodes();
        const total = episodes.length;
        const current = getCurrentEpisode(episodes);
        if (current <= 1) btnPrev.classList.add('disabled'); else btnPrev.classList.remove('disabled');
        if (current >= total) btnNext.classList.add('disabled'); else btnNext.classList.remove('disabled');
    }

    btnRefresh.addEventListener('click', () => {
        showMask();
        location.reload();
    });
    btnPrev.addEventListener('click', () => {
        const episodes = getEpisodes();
        const current = getCurrentEpisode(episodes);
        if (current > 1) {
            showMask();
            window.location.href = episodes[current-2].href;
        }
    });
    btnNext.addEventListener('click', () => {
        const episodes = getEpisodes();
        const current = getCurrentEpisode(episodes);
        const total = episodes.length;
        if (current < total) {
            showMask();
            window.location.href = episodes[current].href;
        }
    });

    window.addEventListener('load', () => {
        if (localStorage.getItem(STORAGE_FULLSCREEN) === '1') {
            toggleFullscreen();
        }
        toolBar.style.display = 'flex';
        updateEpisodeButtons();
        hideMask();
    });

    const observer = new MutationObserver(() => {
        updateEpisodeButtons();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

})();
