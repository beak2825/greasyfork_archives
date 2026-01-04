// ==UserScript==
// @name         호감이모티콘
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  -
// @author       You
// @match        https://play.sooplive.co.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sooplive.co.kr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551099/%ED%98%B8%EA%B0%90%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/551099/%ED%98%B8%EA%B0%90%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const AREA_ID = 'dynamic_area';
    const TOGGLEBAR_ID = 'dynamic_toggle';
    const FAVORITE_KEY = 'fav_emoticons';
    const HEIGHT_KEY = 'dynamic_area_height';
    const DEFAULT_DYNAMIC_HEIGHT = 220;
    const MIN_HEIGHT = 50;
    const MAX_HEIGHT = 300;

    const container = document.querySelector('#emoticonContainer');
    if (container) {
        container.style.transition = 'none';
        container.style.animation = 'none';
        container.classList.remove(...container.classList);
        const head = container.querySelector('#emoticonBox > div.head');
        if (head) { head.innerHTML = ''; head.style.height = '10px'; head.style.padding = '0'; }
    }

    function hideEmoticonContainer() {
        const container = document.querySelector('#emoticonContainer');
        if (!container) return;
        container.style.transition = 'opacity 0.3s ease';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        container.addEventListener('transitionend', function handler() {
            container.style.display = 'none';
            container.removeEventListener('transitionend', handler);
        });
    }

    function showEmoticonContainer() {
        const container = document.querySelector('#emoticonContainer');
        if (!container) return;
        positionEmoticonContainer();
        container.style.display = 'block';
        container.style.opacity = '0';
        container.getBoundingClientRect();
        container.style.transition = 'opacity 0.3s ease';
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
    }

    const btnEmo = document.querySelector('#btn_emo');
    if (btnEmo) {
        btnEmo.addEventListener('click', () => {
            const container = document.querySelector('#emoticonContainer');
            if (!container) return;
            if (container.style.display === 'block') hideEmoticonContainer();
            else showEmoticonContainer();
        });
    }

    function positionEmoticonContainer() {
        const dynamicArea = document.querySelector('#dynamic_area');
        const container = document.querySelector('#emoticonContainer');
        if (!dynamicArea || !container) return;
        const rect = dynamicArea.getBoundingClientRect();
        const popupHeight = 300;
        container.style.position = 'fixed';
        container.style.top = `${rect.top - popupHeight - 10}px`;
        container.style.left = `${rect.left + rect.width / 2}px`;
        container.style.transform = 'translateX(-50%)';
        container.style.width = `${rect.width - 20}px`;
        container.style.height = `${popupHeight}px`;
        container.style.margin = '0';
    }

    document.addEventListener('click', (e) => {
        const container = document.querySelector('#emoticonContainer');
        if (!container || container.style.display !== 'block') return;
        if (e.target.closest('#emoticonContainer .item_list button')) return;
        const btnEmo = document.querySelector('#btn_emo');
        if (!container.contains(e.target) && e.target !== btnEmo) hideEmoticonContainer();
    });

    window.addEventListener('resize', positionEmoticonContainer);
    window.addEventListener('scroll', positionEmoticonContainer);

    function createDynamicArea() {
        const chatItemWrap = document.querySelector('#chatbox > div.chatting-item-wrap');
        const chatArea = document.querySelector('#chat_area');
        if (!chatItemWrap || !chatArea || document.getElementById(AREA_ID)) return;

        // --- #sarsa_btn 제거 ---
        const sarsaBtn = document.querySelector('#sarsa_btn');
        if (sarsaBtn) sarsaBtn.remove();

        const dynamicArea = document.createElement('div');
        dynamicArea.id = AREA_ID;
        dynamicArea.style.backgroundColor = '#1C1E22';
        dynamicArea.style.height = DEFAULT_DYNAMIC_HEIGHT + 'px';
        dynamicArea.style.overflow = 'hidden';
        dynamicArea.style.boxSizing = 'border-box';
        dynamicArea.style.marginTop = '10px';

        const toggleBar = document.createElement('div');
        toggleBar.id = TOGGLEBAR_ID;
        toggleBar.style.height = '20px';
        toggleBar.style.backgroundColor = '#232529';
        toggleBar.style.cursor = 'ns-resize';
        toggleBar.style.userSelect = 'none';
        toggleBar.style.display = 'flex';
        toggleBar.style.alignItems = 'center';
        toggleBar.style.justifyContent = 'center';
        dynamicArea.appendChild(toggleBar);

        const bar = document.createElement('div');
        bar.style.width = '40px';
        bar.style.height = '5px';
        bar.style.background = 'linear-gradient(145deg, #5c5f63, #1a1c1f)';
        bar.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.5)';
        bar.style.borderRadius = '2px';
        toggleBar.appendChild(bar);

        const content = document.createElement('div');
        content.style.height = 'calc(100% - 20px)';
        content.style.overflowY = 'auto';
        content.style.padding = '12px 5px';
        content.style.display = 'flex';
        content.style.flexWrap = 'wrap';
        content.style.justifyContent = 'center';
        content.style.alignContent = 'flex-start';
        content.style.rowGap = '10px';
        content.style.columnGap = '10px';
        dynamicArea.appendChild(content);

        chatItemWrap.appendChild(dynamicArea);

        let favEmoticons = JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]');

        function renderFavEmoticons() {
            content.innerHTML = '';
            favEmoticons.forEach((item, index) => {
                const img = document.createElement('img');
                img.src = item.src;
                img.title = item.title;
                img.style.width = '22px';
                img.style.height = '22px';
                img.style.cursor = 'pointer';
                img.draggable = true;
                img.dataset.index = index;

                img.addEventListener('click', e => {
                    if (e.ctrlKey || e.metaKey) {
                        favEmoticons.splice(index, 1);
                        localStorage.setItem(FAVORITE_KEY, JSON.stringify(favEmoticons));
                        renderFavEmoticons();
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }

                    syncContainerToDynamic(img.src);
                    const btn = document.querySelector(`#common_emoticon img[src="${item.src}"]`);
                    if (btn) btn.parentElement.click();
                });

                img.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', ''); img.classList.add('dragging'); });
                img.addEventListener('dragend', e => { img.classList.remove('dragging'); });

                content.appendChild(img);
            });

            content.addEventListener('dragover', e => e.preventDefault());
            content.addEventListener('drop', e => {
                e.preventDefault();
                const dragging = content.querySelector('.dragging');
                if (!dragging) return;
                const dragIndex = parseInt(dragging.dataset.index);
                const dropX = e.clientX;
                const dropY = e.clientY;

                const imgs = Array.from(content.querySelectorAll('img')).filter(img => img !== dragging);
                let closestIndex = favEmoticons.length - 1;
                let minDistance = Infinity;

                imgs.forEach(img => {
                    const rect = img.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dist = Math.hypot(dropX - cx, dropY - cy);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestIndex = parseInt(img.dataset.index);
                        if (dropY < cy) closestIndex -= 0.5;
                    }
                });

                const movedItem = favEmoticons.splice(dragIndex, 1)[0];
                if (closestIndex % 1 === 0.5) closestIndex = Math.floor(closestIndex);
                favEmoticons.splice(closestIndex, 0, movedItem);

                localStorage.setItem(FAVORITE_KEY, JSON.stringify(favEmoticons));
                renderFavEmoticons();
            });
        }

        renderFavEmoticons();

        function setDynamicHeight(newHeight) {
            const firstEmo = content.querySelector('img');
            const toggleHeight = toggleBar.offsetHeight;
            let minHeightDynamic = MIN_HEIGHT;
            if (firstEmo) minHeightDynamic = firstEmo.offsetHeight + toggleHeight + 29;
            newHeight = Math.max(minHeightDynamic, Math.min(newHeight, MAX_HEIGHT));
            dynamicArea.style.height = newHeight + 'px';
            chatArea.style.height = (chatItemWrap.offsetHeight - newHeight) + 'px';
            content.style.height = (newHeight <= toggleHeight) ? '0' : `calc(100% - ${toggleHeight}px)`;
            localStorage.setItem(HEIGHT_KEY, newHeight);
        }

        const cachedHeight = parseInt(localStorage.getItem(HEIGHT_KEY));
        if (!isNaN(cachedHeight)) setDynamicHeight(cachedHeight);
        else setDynamicHeight(DEFAULT_DYNAMIC_HEIGHT);

        let isDragging = false, startY, startHeight;
        toggleBar.addEventListener('mousedown', e => { isDragging = true; startY = e.clientY; startHeight = dynamicArea.offsetHeight; e.preventDefault(); });
        window.addEventListener('mousemove', e => { if (!isDragging) return; setDynamicHeight(startHeight + (startY - e.clientY)); });
        window.addEventListener('mouseup', () => { isDragging = false; });

        const resizeObserver = new ResizeObserver(() => { chatArea.style.height = (chatItemWrap.offsetHeight - dynamicArea.offsetHeight) + 'px'; });
        resizeObserver.observe(chatItemWrap);

        function syncContainerToDynamic(src) {
            if (!container) return;
            const allButtons = container.querySelectorAll('#emoticonBox .tab_area li');
            allButtons.forEach(btnLi => btnLi.classList.remove('on'));
            const matchBtn = Array.from(allButtons).find(btnLi => {
                const img = btnLi.querySelector('img');
                return img && src.includes(img.src.split('/').pop());
            });
            if (matchBtn) matchBtn.classList.add('on');
        }

        document.addEventListener('click', e => {
            const target = e.target.closest('#common_emoticon span a img');
            if (!target) return;
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const exists = favEmoticons.find(f => f.src === target.src);
                if (!exists) {
                    favEmoticons.push({src: target.src, title: target.title});
                    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favEmoticons));
                    renderFavEmoticons();
                }
            }
        }, true);
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('#chatbox > div.chatting-item-wrap') &&
            document.querySelector('#chat_area')) {
            createDynamicArea();
            obs.disconnect();
        }
    });

    const chatArea = document.querySelector('#chat_area');
    if (chatArea) chatArea.style.padding = '3px 18px';

    // --- 채팅 입력란 이미지 24px 미리보기 적용 ---
    (function() {
        const writeArea = document.querySelector('#write_area');
        if (!writeArea) return;
        const style = document.createElement('style');
        style.textContent = `#write_area img { width: 24px !important; height: auto !important; }`;
        document.head.appendChild(style);

        const chatObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IMG') {
                        node.style.width = '24px';
                        node.style.height = 'auto';
                    }
                });
            });
        });
        chatObserver.observe(writeArea, { childList: true });
    })();

    observer.observe(document.body, { childList: true, subtree: true });

})();
