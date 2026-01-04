// ==UserScript==
// @name         Lolz Custom Mascotic
// @namespace    http://tampermonkey.net/
// @version      4.21
// @author       MARYXANAX
// @license      MIT
// @description  Custom mascot for lolz
// @match        *://lolz.live/*
// @match        *://zelenka.guru/*
// @match        *://lzt.market/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560535/Lolz%20Custom%20Mascotic.user.js
// @updateURL https://update.greasyfork.org/scripts/560535/Lolz%20Custom%20Mascotic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE = {
        chat: 'mascot_chat_v40',
        proxy: 'mascot_proxy_v40',
        e404: 'mascot_404_v40',
        tech: 'mascot_tech_v40',
        pos: 'mascot_pos_v40'
    };

    const LINKS = {
        proxy: 'https://lolz.live/proxy.php?link=https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        e404: 'https://lolz.live/page-not-found-test-mascot'
    };

    const repositionMenu = () => {
        const btn = document.getElementById('mascot-gui-btn');
        const menu = document.getElementById('m-dropdown');
        if (!btn || !menu) return;
        const rect = btn.getBoundingClientRect();
        menu.style.top = (rect.bottom + 5) + 'px';
        menu.style.left = rect.left + 'px';
    };

    window.addEventListener('resize', repositionMenu);

    const applyMascots = () => {
        const chatImg = localStorage.getItem(STORAGE.chat);
        const proxyImg = localStorage.getItem(STORAGE.proxy);
        const e404Img = localStorage.getItem(STORAGE.e404);
        const techImg = localStorage.getItem(STORAGE.tech);

        let styleTag = document.getElementById('mascot-custom-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'mascot-custom-styles';
            document.documentElement.appendChild(styleTag);
        }

        let css = '';
        if (chatImg) css += `.conversationCapImage, img[src*="conversation-cap"] { content: url("${chatImg}") !important; max-width: 250px !important; }`;
        if (proxyImg) css += `.mascot_image, .redirectBlock img { content: url("${proxyImg}") !important; max-width: 300px !important; height: auto !important; }`;

        const pageStyles = `
            max-width: 256px !important;
            max-height: 256px !important;
            width: auto !important;
            height: auto !important;
            object-fit: contain !important;
            border-radius: 8px !important;
        `;

        if (e404Img) css += `.error-container img, img[src*="error"], .errorBlock img, .mainContainer img[src*="404"] { content: url("${e404Img}") !important; ${pageStyles} }`;
        if (techImg) css += `.banPageInfo img, .banPageContainer img { content: url("${techImg}") !important; ${pageStyles} }`;

        styleTag.innerHTML = css;
    };
    applyMascots();

    const createMenu = () => {
        if (!window.location.href.includes('/conversations/')) return;
        if (document.getElementById('mascot-gui-btn')) return;

        let posData = JSON.parse(localStorage.getItem(STORAGE.pos) || '{"top":56,"right":150}');
        const btn = document.createElement('div');
        btn.id = 'mascot-gui-btn';
        btn.style = `position: fixed; top: ${posData.top}px; right: ${posData.right}px; z-index: 999999; display: flex; align-items: center; background: rgb(42, 42, 42); border: 1px solid rgb(61, 61, 61); padding: 4px 10px; border-radius: 4px; cursor: move; user-select: none; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 8px; height: 28px;`;
        btn.innerHTML = `<img src="https://i.gifer.com/Vp3R.gif" style="width: 14px; height: 14px; margin-right: 6px;"><span style="color: #fff; font-weight: bold; font-size: 10px; font-family: sans-serif; letter-spacing: 0.5px;">MASCOT</span>`;

        let dragging = false;
        document.addEventListener('mousemove', (e) => {
            if (dragging && e.altKey) {
                btn.style.top = (e.clientY - 14) + 'px';
                btn.style.right = (window.innerWidth - e.clientX - 45) + 'px';
                repositionMenu();
            }
        });

        btn.onmousedown = (e) => { if (e.altKey) dragging = true; };
        window.addEventListener('mouseup', () => {
            if (dragging) {
                dragging = false;
                localStorage.setItem(STORAGE.pos, JSON.stringify({top: parseInt(btn.style.top), right: parseInt(btn.style.right)}));
            }
        });

        btn.onclick = (e) => {
            if (e.altKey) return;
            const openMenu = document.getElementById('m-dropdown');
            if (openMenu) { openMenu.remove(); return; }

            const menu = document.createElement('div');
            menu.id = 'm-dropdown';
            document.body.appendChild(menu);
            menu.style = `position: fixed; background: #1a1a1a; border: 1px solid #3d3d3d; border-radius: 8px; padding: 6px; z-index: 1000000; display: flex; flex-direction: column; min-width: 190px; box-shadow: 0 8px 24px rgba(0,0,0,0.8); font-family: sans-serif;`;
            repositionMenu();

            const addSection = (name, key, isDev = false) => {
                const wrapper = document.createElement('div');
                wrapper.style = 'border-bottom: 1px solid #2a2a2a; margin-bottom: 2px;';
                const title = document.createElement('div');
                title.style = 'color: #fff; font-size: 11px; font-weight: bold; padding: 10px; cursor: pointer; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;';
                title.innerHTML = `<span>${name}</span><span style="font-size: 9px; color: #777;">▼</span>`;
                const box = document.createElement('div');
                box.style = 'display: none; flex-direction: column; padding: 4px 0 8px 0;';
                box.className = 'menu-section-content';
                title.onclick = () => {
                    const active = box.style.display === 'flex';
                    menu.querySelectorAll('.menu-section-content').forEach(s => s.style.display = 'none');
                    box.style.display = active ? 'none' : 'flex';
                };

                const rowStyle = 'padding: 8px 12px; cursor: pointer; font-size: 11px; border-radius: 4px; display: flex; align-items: center; gap: 10px; transition: 0.15s;';

                if (isDev) {
                    const devText = document.createElement('div');
                    devText.innerText = '— в разработке*';
                    devText.style = 'padding: 8px 12px; color: #777; font-size: 10px; font-style: italic;';
                    box.append(devText);
                } else {
                    const addBtn = document.createElement('div');
                    addBtn.innerHTML = `<span style="font-size: 14px;">➕</span> Добавить`;
                    addBtn.style = rowStyle + 'color: #fff; font-weight: bold;';
                    addBtn.onclick = () => {
                        const input = document.createElement('input');
                        input.type = 'file'; input.accept = 'image/*';
                        input.onchange = ev => {
                            const file = ev.target.files[0];
                            const reader = new FileReader();
                            reader.onload = r => { localStorage.setItem(key, r.target.result); location.reload(); };
                            reader.readAsDataURL(file);
                        };
                        input.click();
                    };
                    const delBtn = document.createElement('div');
                    delBtn.innerHTML = `<span style="font-size: 14px;">🗑️</span> Удалить`;
                    delBtn.style = rowStyle + 'color: #ff4d4d; font-weight: bold;';
                    delBtn.onclick = () => { if(confirm('Удалить?')) { localStorage.removeItem(key); location.reload(); } };
                    box.append(addBtn, delBtn);

                    const checkLink = name === 'ПЕРЕХОДНИК' ? LINKS.proxy : (name === '404 СТРАНИЦА' ? LINKS.e404 : null);
                    if (checkLink) {
                        const checkBtn = document.createElement('div');
                        checkBtn.innerHTML = `<span style="font-size: 14px;">👁️</span> Проверить вид`;
                        checkBtn.style = rowStyle + 'color: #3498db; font-weight: bold;';
                        checkBtn.onclick = () => window.open(checkLink, '_blank');
                        box.append(checkBtn);
                    }
                }
                wrapper.append(title, box);
                return wrapper;
            };

            menu.append(addSection('ЧАТ', STORAGE.chat));
            menu.append(addSection('ПЕРЕХОДНИК', STORAGE.proxy));
            menu.append(addSection('404 СТРАНИЦА', STORAGE.e404));
            menu.append(addSection('ТЕХ.РАБОТЫ', STORAGE.tech));
            menu.append(addSection('БАН', null, true));
            const divider = document.createElement('div');
            divider.style = 'height: 4px; background: #3d3d3d; margin: 4px 0; border-radius: 2px;';
            menu.append(divider);
            menu.append(addSection('ШАБЛОНЫ', null, true));

            const autoClose = (ev) => { if (!menu.contains(ev.target) && ev.target !== btn) { menu.remove(); document.removeEventListener('mousedown', autoClose); } };
            setTimeout(() => document.addEventListener('mousedown', autoClose), 10);
        };
        document.body.appendChild(btn);
    };

    setInterval(() => {
        createMenu();
        applyMascots();
        repositionMenu();
    }, 100);
})();