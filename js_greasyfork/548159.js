// ==UserScript==
// @name         двигаем туда-сюда (для lolzteam)
// @namespace    https://lolz.live/
// @version      0
// @description  lolzteam
// @author       lolzteam
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://lolz.live/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548159/%D0%B4%D0%B2%D0%B8%D0%B3%D0%B0%D0%B5%D0%BC%20%D1%82%D1%83%D0%B4%D0%B0-%D1%81%D1%8E%D0%B4%D0%B0%20%28%D0%B4%D0%BB%D1%8F%20lolzteam%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548159/%D0%B4%D0%B2%D0%B8%D0%B3%D0%B0%D0%B5%D0%BC%20%D1%82%D1%83%D0%B4%D0%B0-%D1%81%D1%8E%D0%B4%D0%B0%20%28%D0%B4%D0%BB%D1%8F%20lolzteam%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'manageItemsOrder';

    function initDragAndDrop(container) {
        const items = Array.from(container.querySelectorAll('.manageItem'));
        items.forEach(item => {
            item.draggable = true;
            item.style.cursor = 'grab';
        });

        let dragSrcEl = null;

        function handleDragStart(e) {
            dragSrcEl = this;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.outerHTML);
            this.classList.add('dragging');
        }

        function handleDragOver(e) {
            if (e.preventDefault) e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            return false;
        }

        function handleDrop(e) {
            if (e.stopPropagation) e.stopPropagation();
            if (dragSrcEl !== this) {
                dragSrcEl.outerHTML = this.outerHTML;
                this.outerHTML = e.dataTransfer.getData('text/html');
                saveOrder();
            }
            return false;
        }

        function handleDragEnd() {
            this.classList.remove('dragging');
        }

        items.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);
        });
    }

    function saveOrder() {
        const container = document.querySelector('.manageItems');
        if (!container) return;
        const order = Array.from(container.querySelectorAll('.manageItem')).map(el => el.href);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    }

    function loadOrder() {
        const container = document.querySelector('.manageItems');
        if (!container) return;
        const savedOrder = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (savedOrder.length === 0) return;

        const items = Array.from(container.querySelectorAll('.manageItem'));
        const itemsMap = {};
        items.forEach(item => {
            itemsMap[item.href] = item;
        });

        container.innerHTML = '';
        savedOrder.forEach(href => {
            if (itemsMap[href]) container.appendChild(itemsMap[href]);
        });

        // Добавляем те, которых нет в сохраненном списке
        items.forEach(item => {
            if (!savedOrder.includes(item.href)) {
                container.appendChild(item);
            }
        });
    }

    function init() {
        const container = document.querySelector('.manageItems');
        if (!container) return;
        loadOrder();
        initDragAndDrop(container);
    }

    // Ждем загрузки DOM
    const observer = new MutationObserver(() => {
        const container = document.querySelector('.manageItems');
        if (container && container.querySelectorAll('.manageItem').length > 0) {
            init();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
