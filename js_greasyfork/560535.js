// ==UserScript==
// @name         Lolz Custom Mascotic
// @namespace    http://tampermonkey.net/
// @version      4.22
// @author       taskill
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
        ban: 'mascot_ban_v40',
        pos: 'mascot_pos_v40',
        templates: 'mascot_templates_v40'
    };

    const LINKS = {
        proxy: 'https://lolz.live/proxy.php?link=https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        e404: 'https://lolz.live/page-not-found-test-mascot'
    };

    const clearCurrentMascots = () => {
        [STORAGE.chat, STORAGE.proxy, STORAGE.e404, STORAGE.tech, STORAGE.ban].forEach(key => {
            localStorage.removeItem(key);
        });
    };

    const repositionMenu = () => {
        const btn = document.getElementById('mascot-gui-btn');
        const menu = document.getElementById('m-dropdown');
        if (!btn || !menu) return;
        const rect = btn.getBoundingClientRect();
        menu.style.top = (rect.bottom + 5) + 'px';
        menu.style.left = rect.left + 'px';
    };

    const applyMascots = () => {
        const chatImg = localStorage.getItem(STORAGE.chat);
        const proxyImg = localStorage.getItem(STORAGE.proxy);
        const e404Img = localStorage.getItem(STORAGE.e404);
        const techImg = localStorage.getItem(STORAGE.tech);
        const banImg = localStorage.getItem(STORAGE.ban);

        let styleTag = document.getElementById('mascot-custom-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'mascot-custom-styles';
            document.documentElement.appendChild(styleTag);
        }

        let css = '';
        const pageStyles = `max-width:256px!important;max-height:256px!important;width:auto!important;height:auto!important;object-fit:contain!important;border-radius:8px!important;display:block!important;margin:0 auto!important;`;

        if (chatImg) css += `.conversationCapImage, img[src*="conversation-cap"] { content: url("${chatImg}") !important; max-width: 250px !important; }`;
        if (proxyImg) css += `.mascot_image, .redirectBlock img { content: url("${proxyImg}") !important; max-width: 300px !important; }`;
        if (e404Img) css += `.error-container img, img[src*="error"], .errorBlock img, .mainContainer img[src*="404"] { content: url("${e404Img}") !important; ${pageStyles} }`;
        if (techImg) css += `.banPageInfo img:not([src*="avatar"]), .banPageContainer img:not([src*="avatar"]) { content: url("${techImg}") !important; ${pageStyles} }`;
        if (banImg) css += `.banPageContainer img:not([src*="avatar"]), .banPageInfo img:not([src*="avatar"]) { content: url("${banImg}") !important; ${pageStyles} }`;

        styleTag.innerHTML = css;
    };

    const createTemplateModal = () => {
        const modal = document.createElement('div');
        modal.style = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a1a;border:1px solid #3d3d3d;padding:20px;z-index:1000001;border-radius:12px;box-shadow:0 0 40px rgba(0,0,0,0.9);font-family:sans-serif;min-width:300px;color:#fff;`;

        let templateData = { name: '', chat: '', proxy: '', e404: '', tech: '', ban: '' };

        const row = (label, key) => {
            const div = document.createElement('div');
            div.style = 'margin-bottom:12px;display:flex;flex-direction:column;gap:5px;';
            div.innerHTML = `<span style="font-size:11px;color:#777;">${label}</span>`;
            const input = document.createElement('input');
            input.type = (key === 'name') ? 'text' : 'file';
            input.style = (key === 'name') ? 'background:#2a2a2a;border:1px solid #3d3d3d;padding:6px;border-radius:4px;color:#fff;' : '';
            if(key !== 'name') input.accept = 'image/*';

            input.onchange = (e) => {
                if(key === 'name') { templateData.name = e.target.value; return; }
                const reader = new FileReader();
                reader.onload = r => templateData[key] = r.target.result;
                reader.readAsDataURL(e.target.files[0]);
            };
            div.append(input);
            return div;
        };

        modal.innerHTML = '<h3 style="margin:0 0 15px 0;font-size:14px;">Создать шаблон</h3>';
        modal.append(row('НАЗВАНИЕ ШАБЛОНА', 'name'), row('ЧАТ', 'chat'), row('ПЕРЕХОДНИК', 'proxy'), row('404 СТРАНИЦА', 'e404'), row('ТЕХ.РАБОТЫ', 'tech'), row('БАН', 'ban'));

        const btnWrap = document.createElement('div');
        btnWrap.style = 'display:flex;gap:10px;margin-top:15px;';

        const save = document.createElement('button');
        save.innerText = 'Сохранить';
        save.style = 'flex:1;background:#00ba78;border:none;color:#fff;padding:8px;border-radius:4px;cursor:pointer;font-weight:bold;';
        save.onclick = () => {
            if(!templateData.name) return alert('Введите название!');
            let list = JSON.parse(localStorage.getItem(STORAGE.templates) || '[]');
            list.push(templateData);
            localStorage.setItem(STORAGE.templates, JSON.stringify(list));
            modal.remove();
            location.reload();
        };

        const cancel = document.createElement('button');
        cancel.innerText = 'Отмена';
        cancel.style = 'flex:1;background:#3d3d3d;border:none;color:#fff;padding:8px;border-radius:4px;cursor:pointer;';
        cancel.onclick = () => modal.remove();

        btnWrap.append(save, cancel);
        modal.append(btnWrap);
        document.body.appendChild(modal);
    };

    const createMenu = () => {
        if (!window.location.href.includes('/conversations/')) return;
        if (document.getElementById('mascot-gui-btn')) return;

        let posData = JSON.parse(localStorage.getItem(STORAGE.pos) || '{"top":56,"right":150}');
        const btn = document.createElement('div');
        btn.id = 'mascot-gui-btn';
        btn.style = `position:fixed;top:${posData.top}px;right:${posData.right}px;z-index:999999;display:flex;align-items:center;background:#2a2a2a;border:1px solid #3d3d3d;padding:4px 10px;border-radius:4px;cursor:move;user-select:none;height:28px;`;
        btn.innerHTML = `<img src="https://i.gifer.com/Vp3R.gif" style="width:14px;height:14px;margin-right:6px;"><span style="color:#fff;font-weight:bold;font-size:10px;font-family:sans-serif;">MASCOT</span>`;

        let dragging = false;
        document.addEventListener('mousemove', (e) => { if (dragging && e.altKey) { btn.style.top = (e.clientY - 14) + 'px'; btn.style.right = (window.innerWidth - e.clientX - 45) + 'px'; repositionMenu(); } });
        btn.onmousedown = (e) => { if (e.altKey) dragging = true; };
        window.addEventListener('mouseup', () => { if (dragging) { dragging = false; localStorage.setItem(STORAGE.pos, JSON.stringify({top:parseInt(btn.style.top), right:parseInt(btn.style.right)})); } });

        btn.onclick = (e) => {
            if (e.altKey) return;
            if (document.getElementById('m-dropdown')) { document.getElementById('m-dropdown').remove(); return; }

            const menu = document.createElement('div');
            menu.id = 'm-dropdown';
            document.body.appendChild(menu);
            menu.style = `position:fixed;background:#1a1a1a;border:1px solid #3d3d3d;border-radius:8px;padding:6px;z-index:1000000;display:flex;flex-direction:column;min-width:190px;font-family:sans-serif;`;
            repositionMenu();

            const addSection = (name, key) => {
                const wrapper = document.createElement('div');
                wrapper.style = 'border-bottom:1px solid #2a2a2a;margin-bottom:2px;';
                const title = document.createElement('div');
                title.style = 'color:#fff;font-size:11px;font-weight:bold;padding:10px;cursor:pointer;display:flex;justify-content:space-between;';
                title.innerHTML = `<span>${name}</span><span style="font-size:9px;color:#777;">▼</span>`;
                const box = document.createElement('div');
                box.style = 'display:none;flex-direction:column;padding:4px 0 8px 0;';
                title.onclick = () => { const active = box.style.display === 'flex'; menu.querySelectorAll('.menu-section-content').forEach(s => s.style.display = 'none'); box.style.display = active ? 'none' : 'flex'; };
                box.className = 'menu-section-content';

                if (name === 'ШАБЛОНЫ') {
                    const addBtn = document.createElement('div');
                    addBtn.style = 'padding:8px 12px;cursor:pointer;font-size:11px;color:#00ba78;font-weight:bold;';
                    addBtn.innerHTML = '➕ Создать шаблон';
                    addBtn.onclick = createTemplateModal;
                    box.append(addBtn);

                    const templates = JSON.parse(localStorage.getItem(STORAGE.templates) || '[]');
                    templates.forEach((t, index) => {
                        const tRow = document.createElement('div');
                        tRow.style = 'padding:8px 12px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-size:11px;color:#fff;';
                        tRow.innerHTML = `<span>${t.name}</span><span style="color:#ff4d4d;font-size:14px;padding: 2px 5px;">🗑️</span>`;
                        tRow.onclick = (ev) => {
                            if(ev.target.innerText === '🗑️') {

                                if(confirm(`Удалить шаблон "${t.name}"?\n(Это действие сбросит маскота до стандартного)`)) {
                                    templates.splice(index, 1);
                                    localStorage.setItem(STORAGE.templates, JSON.stringify(templates));
                                    clearCurrentMascots();
                                    location.reload();
                                }
                                return;
                            }
                            if(t.chat) localStorage.setItem(STORAGE.chat, t.chat);
                            if(t.proxy) localStorage.setItem(STORAGE.proxy, t.proxy);
                            if(t.e404) localStorage.setItem(STORAGE.e404, t.e404);
                            if(t.tech) localStorage.setItem(STORAGE.tech, t.tech);
                            if(t.ban) localStorage.setItem(STORAGE.ban, t.ban);
                            location.reload();
                        };
                        box.append(tRow);
                    });
                } else {
                    const row = (t, c, fn) => {
                        const d = document.createElement('div'); d.style = `padding:8px 12px;cursor:pointer;font-size:11px;color:${c};font-weight:bold;`;
                        d.innerHTML = t; d.onclick = fn; box.append(d);
                    };
                    row('➕ Добавить', '#fff', () => {
                        const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*';
                        i.onchange = ev => { const r = new FileReader(); r.onload = x => { localStorage.setItem(key, x.target.result); location.reload(); }; r.readAsDataURL(ev.target.files[0]); };
                        i.click();
                    });
                    row('🗑️ Удалить', '#ff4d4d', () => { if(confirm('Удалить текущую картинку?')) { localStorage.removeItem(key); location.reload(); } });
                    if(LINKS[key === STORAGE.proxy ? 'proxy' : (key === STORAGE.e404 ? 'e404' : '')]) {
                        row('👁️ Проверить', '#3498db', () => window.open(LINKS[key === STORAGE.proxy ? 'proxy' : 'e404'], '_blank'));
                    }
                }
                wrapper.append(title, box); return wrapper;
            };

            menu.append(addSection('ЧАТ', STORAGE.chat), addSection('ПЕРЕХОДНИК', STORAGE.proxy), addSection('404 СТРАНИЦА', STORAGE.e404), addSection('ТЕХ.РАБОТЫ', STORAGE.tech), addSection('БАН', STORAGE.ban));
            const div = document.createElement('div'); div.style = 'height:4px;background:#3d3d3d;margin:4px 0;border-radius:2px;'; menu.append(div);
            menu.append(addSection('ШАБЛОНЫ', null));

            const autoClose = (ev) => { if (!menu.contains(ev.target) && ev.target !== btn) { menu.remove(); document.removeEventListener('mousedown', autoClose); } };
            setTimeout(() => document.addEventListener('mousedown', autoClose), 10);
        };
        document.body.appendChild(btn);
    };

    applyMascots();
    setInterval(() => { createMenu(); applyMascots(); repositionMenu(); }, 100);
})();