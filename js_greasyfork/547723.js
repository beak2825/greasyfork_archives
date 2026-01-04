// ==UserScript==
// @name         Nexus Game Blocker
// @namespace    http://violentmonkey.net/
// @version      1.0
// @description  Block Unwanted Games
// @author       SAMURAI
// @match        https://www.nexusmods.com/*
// @grant        none
// @license      
// @downloadURL https://update.greasyfork.org/scripts/547723/Nexus%20Game%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/547723/Nexus%20Game%20Blocker.meta.js
// ==/UserScript==

/*
Copyright (c) 2025 (my own)

Permission is granted to view and modify this script for personal use only.
Redistribution, publication, or reposting of this script or any modified versions is prohibited without explicit permission from the author.

ADD ME ON DISCORD IF YOU WANT TO UPLOAD ONE: lr0a

You may:
- Modify it for personal use

You may NOT:
- Publish or redistribute the script or any modified versions publicly
*/

(function () {
    'use strict';

    let blockedGames = JSON.parse(localStorage.getItem('blockedGamesList') || '[]');

    function saveBlockedGames() {
        localStorage.setItem('blockedGamesList', JSON.stringify(blockedGames));
    }

    function isBlocked(gameName) {
        const entry = blockedGames.find(g => g.name === gameName);
        return entry?.blocked;
    }

    function hideBlockedMods() {
        const tiles = document.querySelectorAll('[data-e2eid="mod-tile"], [data-e2eid="mod-tile-teaser"]');
        tiles.forEach(tile => {
            const gameLink = tile.querySelector('a[href*="/games/"]');
            if (gameLink) {
                const gameName = gameLink.textContent.trim();
                tile.style.display = isBlocked(gameName) ? 'none' : '';
            }
        });
    }

    function observeMods() {
        const target = document.querySelector('body');
        if (target) {
            const observer = new MutationObserver(() => {
                hideBlockedMods();
            });
            observer.observe(target, { childList: true, subtree: true });
        }
    }

    function createUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '1rem';
        container.style.right = '1rem';
        container.style.zIndex = '99999';
        container.style.background = '#222';
        container.style.padding = '12px';
        container.style.borderRadius = '10px';
        container.style.color = '#fff';
        container.style.fontSize = '14px';
        container.style.fontFamily = 'sans-serif';
        container.style.minWidth = '220px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.6)';
        container.style.cursor = 'default';
        container.style.userSelect = 'none';

        container.innerHTML = `
            <details open>
                <summary id="drag-handle" style="cursor: move; font-weight:bold; user-select: none;">🛑 Blocked Games</summary>
                <div style="margin-top: 10px;">
                    <ul id="block-list" style="margin: 0 0 10px; padding: 0; list-style: none; max-height: 240px; overflow-y: auto;"></ul>
                    <input type="text" id="block-input" placeholder="Add game..." style="width: 100%; padding: 4px; margin-bottom: 5px; border-radius: 4px; border: none;">
                    <button id="block-add-btn" style="width: 100%; padding: 6px; border: none; border-radius: 4px; background: #555; color: white; cursor: pointer;">Add Game</button>
                    <p style="margin-top: 10px; text-align: center; font-size: 11px; color: #aaa;">MADE WITH ❤️ BY SAMURAI</p>
                </div>
            </details>
        `;

        document.body.appendChild(container);

        // DRAGGING LOGIC
        let isDragging = false;
        let offsetX, offsetY;
        const dragHandle = container.querySelector('#drag-handle');

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            e.preventDefault(); // prevents collapsing <details>
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
                container.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        const list = container.querySelector('#block-list');
        const input = container.querySelector('#block-input');
        const addBtn = container.querySelector('#block-add-btn');

        function refreshList() {
            list.innerHTML = '';
            blockedGames.forEach((game, index) => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.style.marginBottom = '6px';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = game.blocked;
                checkbox.style.marginRight = '8px';

                const label = document.createElement('span');
                label.textContent = game.name;
                label.style.flexGrow = '1';
                label.style.whiteSpace = 'nowrap';
                label.style.overflow = 'hidden';
                label.style.textOverflow = 'ellipsis';

                const removeBtn = document.createElement('button');
                removeBtn.textContent = '✕';
                removeBtn.style.background = '#c00';
                removeBtn.style.color = 'white';
                removeBtn.style.border = 'none';
                removeBtn.style.borderRadius = '4px';
                removeBtn.style.padding = '2px 6px';
                removeBtn.style.cursor = 'pointer';
                removeBtn.title = 'Remove game from list';

                removeBtn.addEventListener('click', () => {
                    blockedGames.splice(index, 1);
                    saveBlockedGames();
                    refreshList();
                    hideBlockedMods();
                });

                checkbox.addEventListener('change', () => {
                    blockedGames[index].blocked = checkbox.checked;
                    saveBlockedGames();
                    hideBlockedMods();
                });

                li.appendChild(checkbox);
                li.appendChild(label);
                li.appendChild(removeBtn);
                list.appendChild(li);
            });
        }

        addBtn.addEventListener('click', () => {
            const newGame = input.value.trim();
            if (newGame && !blockedGames.some(g => g.name.toLowerCase() === newGame.toLowerCase())) {
                blockedGames.push({ name: newGame, blocked: true });
                saveBlockedGames();
                refreshList();
                hideBlockedMods();
                input.value = '';
            }
        });

        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });

        refreshList();
    }

    // Init
    hideBlockedMods();
    observeMods();
    createUI();
})();
