// ==UserScript==
// @name         Torn Quick Links
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Floating draggable menu to manage and quickly access your favorite links.
// @author       Omanpx [1906686] + Gemini
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559860/Torn%20Quick%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/559860/Torn%20Quick%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- State Management ---
    let links = GM_getValue('navigator_links', [
        { id: 1, label: 'Armory', url: 'https://www.torn.com/factions.php?step=your&type=1#/tab=armoury', color: '#4285f4', emoji: '🔫', target: '_self' },
        { id: 2, label: 'Lottery', url: 'https://www.torn.com/page.php?sid=lottery', color: '#ff0000', emoji: '🍀', target: '_self' }
    ]);

    let isMenuOpen = false;
    let dragEnabled = GM_getValue('drag_enabled', false);
    let buttonPos = GM_getValue('button_pos', { top: '20px', left: '20px' });
    let lastToggleTime = 0; 

    // --- Styles ---
    const style = document.createElement('style');
    style.textContent = `
        #nav-pro-container {
            position: fixed;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            user-select: none;
            touch-action: none; /* Critical for mobile dragging */
        }

        #nav-pro-trigger {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #333;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            font-size: 24px;
            transition: transform 0.1s, border-color 0.2s;
            border: 2px solid transparent;
        }

        #nav-pro-trigger.drag-active {
            cursor: move;
            border-color: #4ade80;
        }

        #nav-pro-trigger:active { transform: scale(0.95); }

        #nav-pro-menu {
            position: absolute;
            width: 280px;
            max-height: 500px;
            background: #222;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #444;
            color: #eee;
        }

        .nav-pro-header {
            padding: 12px;
            background: #1a1a1a;
            border-bottom: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
        }

        .nav-pro-toolbar {
            padding: 8px 12px;
            background: #2a2a2a;
            border-bottom: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }

        .nav-pro-list {
            overflow-y: auto;
            max-height: 300px;
            padding: 8px;
        }

        .nav-pro-item {
            display: flex;
            align-items: center;
            padding: 10px;
            margin-bottom: 4px;
            border-radius: 8px;
            text-decoration: none;
            color: #ddd;
            transition: background 0.2s;
            position: relative;
        }

        .nav-pro-item:hover { background: #333; color: #fff; }

        .nav-pro-color-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 12px;
        }

        .nav-pro-emoji { margin-right: 8px; }

        .nav-pro-add-form {
            padding: 12px;
            border-top: 1px solid #444;
            background: #1a1a1a;
            font-size: 13px;
        }

        .nav-pro-input {
            width: 100%;
            padding: 6px 8px;
            margin-bottom: 6px;
            border: 1px solid #444;
            border-radius: 4px;
            box-sizing: border-box;
            background: #333;
            color: #eee;
        }

        .nav-pro-btn {
            width: 100%;
            padding: 8px;
            background: #444;
            color: white;
            border: 1px solid #555;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        }

        .nav-pro-btn:hover { background: #555; }

        .nav-pro-delete {
            margin-left: auto;
            color: #ef4444;
            cursor: pointer;
            padding: 4px;
            font-size: 12px;
            opacity: 0.7;
        }

        .nav-pro-delete:hover { opacity: 1; }

        .switch {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 20px;
        }

        .switch input { opacity: 0; width: 0; height: 0; }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #444;
            transition: .4s;
            border-radius: 20px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 14px; width: 14px;
            left: 3px; bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider { background-color: #2563eb; }
        input:checked + .slider:before { transform: translateX(14px); }
    `;
    document.head.appendChild(style);

    // --- UI Construction ---
    const container = document.createElement('div');
    container.id = 'nav-pro-container';
    container.style.top = buttonPos.top;
    container.style.left = buttonPos.left;

    container.innerHTML = `
        <div id="nav-pro-trigger" class="${dragEnabled ? 'drag-active' : ''}">🧭</div>
        <div id="nav-pro-menu">
            <div class="nav-pro-header">
                <span>Torn Quick Links</span>
                <button id="nav-pro-toggle-add" style="font-size:12px; cursor:pointer; background:#444; color:#fff; border:1px solid #666; border-radius:4px; padding:2px 6px;">+ Add</button>
            </div>
            <div class="nav-pro-toolbar">
                <span>Enable Dragging</span>
                <label class="switch">
                    <input type="checkbox" id="drag-toggle-switch" ${dragEnabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="nav-pro-list" id="nav-pro-items"></div>
            <div class="nav-pro-add-form" id="nav-pro-form" style="display:none;">
                <input type="text" id="add-label" class="nav-pro-input" placeholder="Label">
                <input type="text" id="add-url" class="nav-pro-input" placeholder="URL">
                <div style="display:flex; gap:5px; margin-bottom:10px;">
                    <input type="text" id="add-emoji" class="nav-pro-input" style="width:40%" placeholder="Emoji">
                    <input type="color" id="add-color" class="nav-pro-input" style="width:60%; height:30px; border:none;" value="#4285f4">
                </div>
                <label style="font-size:12px; display:block; margin-bottom:10px;">
                    <input type="checkbox" id="add-target"> Open in new tab
                </label>
                <button id="nav-pro-save" class="nav-pro-btn">Save Link</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const trigger = container.querySelector('#nav-pro-trigger');
    const menu = container.querySelector('#nav-pro-menu');
    const listContainer = container.querySelector('#nav-pro-items');
    const addForm = container.querySelector('#nav-pro-form');

    function renderLinks() {
        listContainer.innerHTML = '';
        links.forEach(link => {
            const item = document.createElement('div');
            item.className = 'nav-pro-item';
            item.innerHTML = `
                <div class="nav-pro-color-dot" style="background: ${link.color}"></div>
                <span class="nav-pro-emoji">${link.emoji || ''}</span>
                <span style="flex-grow:1; cursor:pointer;" class="nav-link-click">${link.label}</span>
                <span class="nav-pro-delete" data-id="${link.id}">✕</span>
            `;
            
            item.querySelector('.nav-link-click').onclick = (e) => {
                e.preventDefault();
                window.open(link.url, link.target || '_self');
                toggleMenu(false);
            };

            item.querySelector('.nav-pro-delete').onclick = (e) => {
                e.stopPropagation();
                links = links.filter(l => l.id !== link.id);
                GM_setValue('navigator_links', links);
                renderLinks();
            };

            listContainer.appendChild(item);
        });
    }

    function toggleMenu(force) {
        const now = Date.now();
        if (force === undefined && now - lastToggleTime < 300) return;
        lastToggleTime = now;

        isMenuOpen = force !== undefined ? force : !isMenuOpen;
        
        if (isMenuOpen) {
            menu.style.display = 'flex';
            const rect = container.getBoundingClientRect();
            const menuWidth = 280;
            const menuHeight = menu.offsetHeight || 400; // Estimate if not visible yet
            
            // Vertical positioning: default to bottom, switch to top if near bottom of screen
            if (rect.bottom + menuHeight > window.innerHeight) {
                menu.style.top = `-${menuHeight + 10}px`;
            } else {
                menu.style.top = '60px';
            }

            // Horizontal positioning: default to left-aligned, switch to right-aligned if near right edge
            if (rect.left + menuWidth > window.innerWidth) {
                menu.style.left = `-${menuWidth - 50}px`;
            } else {
                menu.style.left = '0';
            }
        } else {
            menu.style.display = 'none';
        }
    }

    // --- Interaction Logic (Fixed Flickering) ---
    let startX, startY, initialTop, initialLeft, hasMoved = false;

    const onPointerDown = (e) => {
        const ev = e.touches ? e.touches[0] : e;
        startX = ev.clientX;
        startY = ev.clientY;
        initialTop = container.offsetTop;
        initialLeft = container.offsetLeft;
        hasMoved = false;

        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('touchmove', onPointerMove, { passive: false });
        document.addEventListener('mouseup', onPointerUp);
        document.addEventListener('touchend', onPointerUp);
    };

    const onPointerMove = (e) => {
        const ev = e.touches ? e.touches[0] : e;
        const deltaX = ev.clientX - startX;
        const deltaY = ev.clientY - startY;

        if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
            hasMoved = true;
            if (dragEnabled) {
                container.style.left = `${initialLeft + deltaX}px`;
                container.style.top = `${initialTop + deltaY}px`;
                if (e.cancelable) e.preventDefault();
            }
        }
    };

    const onPointerUp = (e) => {
        document.removeEventListener('mousemove', onPointerMove);
        document.removeEventListener('touchmove', onPointerMove);
        document.removeEventListener('mouseup', onPointerUp);
        document.removeEventListener('touchend', onPointerUp);

        if (!hasMoved) {
            toggleMenu();
            if (e.cancelable) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        } else if (dragEnabled) {
            GM_setValue('button_pos', { top: container.style.top, left: container.style.left });
        }
    };

    trigger.addEventListener('mousedown', onPointerDown);
    trigger.addEventListener('touchstart', onPointerDown, { passive: false });

    // --- Control Handlers ---
    container.querySelector('#drag-toggle-switch').onchange = (e) => {
        dragEnabled = e.target.checked;
        GM_setValue('drag_enabled', dragEnabled);
        trigger.classList.toggle('drag-active', dragEnabled);
    };

    container.querySelector('#nav-pro-toggle-add').onclick = (e) => {
        e.stopPropagation();
        addForm.style.display = addForm.style.display === 'none' ? 'block' : 'none';
    };

    container.querySelector('#nav-pro-save').onclick = (e) => {
        e.stopPropagation();
        const label = document.querySelector('#add-label').value;
        const url = document.querySelector('#add-url').value;
        const emoji = document.querySelector('#add-emoji').value;
        const color = document.querySelector('#add-color').value;
        const target = document.querySelector('#add-target').checked ? '_blank' : '_self';

        if (label && url) {
            links.push({
                id: Date.now(),
                label,
                url: url.startsWith('http') ? url : `https://${url}`,
                emoji,
                color,
                target
            });
            GM_setValue('navigator_links', links);
            renderLinks();
            document.querySelector('#add-label').value = '';
            document.querySelector('#add-url').value = '';
            addForm.style.display = 'none';
        }
    };

    renderLinks();
})();