// ==UserScript==
// @name         Lolz Custom Mascotic
// @namespace    http://tampermonkey.net/
// @description  Custom mascot for lolz
// @version      4.25
// @author       taskill
// @license      MIT
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
        overlayError: 'mascot_overlay_error_v40',
        pos: 'mascot_pos_v40',
        templates: 'mascot_templates_v40',
        activeTemplate: 'mascot_active_tpl_name_v40'
    };

    const LINKS = {
        proxy: 'https://lolz.live/proxy.php?link=https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        e404: 'https://lolz.live/page-not-found-test-mascot'
    };

    const clearCurrentMascots = () => {
        [STORAGE.chat, STORAGE.proxy, STORAGE.e404, STORAGE.tech, STORAGE.ban, STORAGE.overlayError, STORAGE.activeTemplate].forEach(key => {
            localStorage.removeItem(key);
        });
    };

    const applyMascots = () => {
        const chatImg = localStorage.getItem(STORAGE.chat);
        const proxyImg = localStorage.getItem(STORAGE.proxy);
        const e404Img = localStorage.getItem(STORAGE.e404);
        const techImg = localStorage.getItem(STORAGE.tech);
        const banImg = localStorage.getItem(STORAGE.ban);
        const overErrImg = localStorage.getItem(STORAGE.overlayError);

        let styleTag = document.getElementById('mascot-custom-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'mascot-custom-styles';
            document.documentElement.appendChild(styleTag);
        }

        let css = `
            #m-dropdown { animation: mascotFadeIn 0.15s ease-out; }
            @keyframes mascotFadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
            .mascot-row:hover { background: #2d2d2d !important; }
            .mascot-section-title { transition: color 0.2s, background 0.2s; }
            .mascot-section-title:hover { background: #2d2d2d !important; }
            .mascot-active-title { color: #00ba78 !important; background: #262626 !important; }
            .mascot-active-title span:last-child { transform: rotate(180deg); opacity: 1 !important; color: #00ba78; }
            .tpl-dot { width: 6px; height: 6px; border-radius: 50%; background: #444; display: inline-block; margin-right: 8px; transition: 0.3s; }
            .tpl-active { color: #00ba78 !important; font-weight: bold; }
            .tpl-active .tpl-dot { background: #00ba78; box-shadow: 0 0 5px #00ba78; }
        `;
        const pageStyles = `max-width:256px!important;max-height:256px!important;width:auto!important;height:auto!important;object-fit:contain!important;border-radius:8px!important;display:block!important;margin:0 auto!important;`;

        if (chatImg) css += `.conversationCapImage, img[src*="conversation-cap"] { content: url("${chatImg}") !important; max-width: 250px !important; }`;
        if (proxyImg) css += `.mascot_image, .redirectBlock img { content: url("${proxyImg}") !important; max-width: 300px !important; }`;
        if (e404Img) css += `.error-container img:not(.avatar):not([class*="avatar"]), .errorBlock img:not(.avatar), .mainContainer img[src*="404"]:not(.avatar) { content: url("${e404Img}") !important; ${pageStyles} }`;

        const commonPageSelectors = '.banPageInfo img:not(.avatar):not([class*="avatar"]), .banPageContainer img:not(.avatar):not([class*="avatar"]), img[alt*="lzt_ban_page"]';
        if (techImg) css += `${commonPageSelectors} { content: url("${techImg}") !important; ${pageStyles} }`;
        if (banImg) css += `${commonPageSelectors} { content: url("${banImg}") !important; ${pageStyles} }`;
        if (overErrImg) css += `.errCapImage, .errorOverlay img { content: url("${overErrImg}") !important; max-width: 166px !important; height: auto !important; margin: 0 auto; display: block; }`;

        styleTag.innerHTML = css;
    };

    const createTemplateModal = () => {
        const modal = document.createElement('div');
        modal.style = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#222;border:1px solid #3d3d3d;padding:25px;z-index:1000001;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-family:inherit;min-width:320px;color:#efefef;`;
        let templateData = { name: '', chat: '', proxy: '', e404: '', tech: '', ban: '', overlayError: '' };

        const row = (label, key) => {
            const div = document.createElement('div');
            div.style = 'margin-bottom:15px;display:flex;flex-direction:column;gap:6px;';
            div.innerHTML = `<span style="font-size:12px;color:#999;font-weight:600;">${label}</span>`;
            const input = document.createElement('input');
            input.type = (key === 'name') ? 'text' : 'file';
            input.style = (key === 'name') ? 'background:#1a1a1a;border:1px solid #3d3d3d;padding:8px 12px;border-radius:6px;color:#fff;outline:none;' : 'font-size:12px;';
            if(key !== 'name') input.accept = 'image/*';
            input.onchange = (e) => {
                if(key === 'name') { templateData.name = e.target.value; return; }
                const reader = new FileReader();
                reader.onload = r => templateData[key] = r.target.result;
                reader.readAsDataURL(e.target.files[0]);
            };
            div.append(input); return div;
        };

        modal.innerHTML = '<h3 style="margin:0 0 20px 0;font-size:16px;font-weight:700;color:#00ba78;text-align:center;">Создание шаблона</h3>';
        modal.append(row('Название шаблона', 'name'), row('Чат', 'chat'), row('Переходник', 'proxy'), row('404 Страница', 'e404'), row('Тех. работы', 'tech'), row('Бан', 'ban'), row('Окно ошибки', 'overlayError'));

        const btnWrap = document.createElement('div'); btnWrap.style = 'display:flex;gap:12px;margin-top:20px;';
        const save = document.createElement('button'); save.innerText = 'Сохранить'; save.style = 'flex:1;background:#00ba78;border:none;color:#fff;padding:10px;border-radius:6px;cursor:pointer;font-weight:700;';
        save.onclick = () => {
            if(!templateData.name) return alert('Введите название!');
            let list = JSON.parse(localStorage.getItem(STORAGE.templates) || '[]');
            list.push(templateData);
            localStorage.setItem(STORAGE.templates, JSON.stringify(list));
            modal.remove(); location.reload();
        };
        const cancel = document.createElement('button'); cancel.innerText = 'Отмена'; cancel.style = 'flex:1;background:#3d3d3d;border:none;color:#ccc;padding:10px;border-radius:6px;cursor:pointer;';
        cancel.onclick = () => modal.remove();
        btnWrap.append(save, cancel); modal.append(btnWrap); document.body.appendChild(modal);
    };

    const createMenu = () => {
        if (!window.location.href.includes('/conversations/')) return;
        if (document.getElementById('mascot-gui-btn')) return;

        let posData = JSON.parse(localStorage.getItem(STORAGE.pos) || '{"top":56,"right":150}');
        const btn = document.createElement('div');
        btn.id = 'mascot-gui-btn';
        btn.style = `position:fixed;top:${posData.top}px;right:${posData.right}px;z-index:999999;display:flex;align-items:center;background:#222;border:1px solid #3d3d3d;padding:0 12px;border-radius:6px;cursor:move;user-select:none;height:32px;box-shadow:0 4px 12px rgba(0,0,0,0.3);`;
        btn.innerHTML = `<img src="https://i.gifer.com/Vp3R.gif" style="width:16px;height:16px;margin-right:8px;"><span style="color:#efefef;font-weight:700;font-size:11px;">MASCOT</span>`;

        let dragging = false;
        document.addEventListener('mousemove', (e) => { if (dragging && e.altKey) { btn.style.top = (e.clientY - 16) + 'px'; btn.style.right = (window.innerWidth - e.clientX - 60) + 'px'; } });
        btn.onmousedown = (e) => { if (e.altKey) dragging = true; };
        window.addEventListener('mouseup', () => { if (dragging) { dragging = false; localStorage.setItem(STORAGE.pos, JSON.stringify({top:parseInt(btn.style.top), right:parseInt(btn.style.right)})); } });

        btn.onclick = (e) => {
            if (e.altKey) return;
            if (document.getElementById('m-dropdown')) { document.getElementById('m-dropdown').remove(); return; }

            const menu = document.createElement('div');
            menu.id = 'm-dropdown';
            document.body.appendChild(menu);
            const rect = btn.getBoundingClientRect();
            menu.style = `position:fixed;top:${rect.bottom + 8}px;left:${rect.left}px;background:#222;border:1px solid #3d3d3d;border-radius:8px;padding:4px;z-index:1000000;display:flex;flex-direction:column;min-width:210px;box-shadow: 0 10px 25px rgba(0,0,0,0.5);`;

            const addSection = (name, key) => {
                const wrapper = document.createElement('div');
                wrapper.style = 'border-bottom:1px solid #2d2d2d;margin-bottom:2px;overflow:hidden;';
                if (name === 'ШАБЛОНЫ') wrapper.style.borderBottom = 'none';

                const title = document.createElement('div');
                title.className = 'mascot-section-title';
                title.style = 'color:#eee;font-size:11px;font-weight:700;padding:12px 14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;border-radius:6px;';
                title.innerHTML = `<span>${name}</span><span style="font-size:10px;opacity:0.4;">▼</span>`;

                const box = document.createElement('div');
                box.className = 'mascot-section-content';
                box.style = 'display:none;flex-direction:column;padding:2px 4px 8px 4px;';

                title.onclick = () => {
                    const isOpen = box.style.display === 'flex';
                    menu.querySelectorAll('.mascot-section-content').forEach(c => c.style.display = 'none');
                    menu.querySelectorAll('.mascot-section-title').forEach(t => t.classList.remove('mascot-active-title'));
                    if (!isOpen) { box.style.display = 'flex'; title.classList.add('mascot-active-title'); }
                };

                if (name === 'ШАБЛОНЫ') {
                    const addBtn = document.createElement('div');
                    addBtn.className = 'mascot-row';
                    addBtn.style = 'padding:10px 12px;cursor:pointer;font-size:11px;color:#00ba78;font-weight:700;border-radius:4px;';
                    addBtn.innerHTML = '📂 Создать новый шаблон'; addBtn.onclick = createTemplateModal; box.append(addBtn);

                    const templates = JSON.parse(localStorage.getItem(STORAGE.templates) || '[]');
                    const activeTplName = localStorage.getItem(STORAGE.activeTemplate);

                    templates.forEach((t, index) => {
                        const tRow = document.createElement('div');
                        tRow.className = 'mascot-row' + (activeTplName === t.name ? ' tpl-active' : '');
                        tRow.style = 'padding:10px 12px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-size:11px;color:#ddd;border-radius:4px;';

                        const leftSide = document.createElement('div');
                        leftSide.style = 'display:flex;align-items:center;';
                        const dot = document.createElement('span');
                        dot.className = 'tpl-dot';
                        leftSide.append(dot, document.createTextNode(t.name));

                        const delBtn = document.createElement('span');
                        delBtn.style = 'color:#ff4d4d;font-size:12px;opacity:0.6;padding: 2px 6px;';
                        delBtn.innerText = '✕';

                        tRow.append(leftSide, delBtn);

                        tRow.onclick = (ev) => {
                            if(ev.target === delBtn) {
                                if(confirm(`Удалить шаблон "${t.name}"?`)) {
                                    if (activeTplName === t.name) {
                                        clearCurrentMascots();
                                    }
                                    templates.splice(index, 1);
                                    localStorage.setItem(STORAGE.templates, JSON.stringify(templates));
                                    location.reload();
                                }
                                return;
                            }

                            if (activeTplName === t.name) {
                                clearCurrentMascots();
                            } else {
                                localStorage.setItem(STORAGE.activeTemplate, t.name);
                                if(t.chat) localStorage.setItem(STORAGE.chat, t.chat); else localStorage.removeItem(STORAGE.chat);
                                if(t.proxy) localStorage.setItem(STORAGE.proxy, t.proxy); else localStorage.removeItem(STORAGE.proxy);
                                if(t.e404) localStorage.setItem(STORAGE.e404, t.e404); else localStorage.removeItem(STORAGE.e404);
                                if(t.tech) localStorage.setItem(STORAGE.tech, t.tech); else localStorage.removeItem(STORAGE.tech);
                                if(t.ban) localStorage.setItem(STORAGE.ban, t.ban); else localStorage.removeItem(STORAGE.ban);
                                if(t.overlayError) localStorage.setItem(STORAGE.overlayError, t.overlayError); else localStorage.removeItem(STORAGE.overlayError);
                            }
                            location.reload();
                        };
                        box.append(tRow);
                    });
                } else if (key) {
                    const row = (t, c, fn) => {
                        const d = document.createElement('div');
                        d.className = 'mascot-row';
                        d.style = `padding:10px 12px;cursor:pointer;font-size:11px;color:${c};font-weight:700;border-radius:4px;`;
                        d.innerHTML = t; d.onclick = fn; box.append(d);
                    };
                    row('+ Добавить', '#eee', () => {
                        const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*';
                        i.onchange = ev => { const r = new FileReader(); r.onload = x => {
                            localStorage.setItem(key, x.target.result);
                            localStorage.removeItem(STORAGE.activeTemplate);
                            location.reload();
                        }; r.readAsDataURL(ev.target.files[0]); };
                        i.click();
                    });
                    row('✕ Удалить', '#ff4d4d', () => { if(confirm('Удалить?')) {
                        localStorage.removeItem(key);
                        localStorage.removeItem(STORAGE.activeTemplate);
                        location.reload();
                    } });
                    if(LINKS[key === STORAGE.proxy ? 'proxy' : (key === STORAGE.e404 ? 'e404' : '')]) {
                        row('👁 Проверить вид', '#3498db', () => window.open(LINKS[key === STORAGE.proxy ? 'proxy' : 'e404'], '_blank'));
                    }
                }
                wrapper.append(title, box); return wrapper;
            };

            menu.append(addSection('ЧАТ', STORAGE.chat));
            menu.append(addSection('ПЕРЕХОДНИК', STORAGE.proxy));
            menu.append(addSection('404 СТРАНИЦА', STORAGE.e404));
            menu.append(addSection('ТЕХ. РАБОТЫ', STORAGE.tech));
            menu.append(addSection('БАН СТРАНИЦА', STORAGE.ban));
            menu.append(addSection('ОКНО ОШИБКИ', STORAGE.overlayError));

            const sep = document.createElement('div'); sep.style = 'height:1px;background:#3d3d3d;margin:6px 14px;'; menu.append(sep);
            menu.append(addSection('ШАБЛОНЫ', null));

            const autoClose = (ev) => { if (!menu.contains(ev.target) && ev.target !== btn) { menu.remove(); document.removeEventListener('mousedown', autoClose); } };
            setTimeout(() => document.addEventListener('mousedown', autoClose), 10);
        };
        document.body.appendChild(btn);
    };

    applyMascots();
    setInterval(() => { if(!document.getElementById('mascot-gui-btn')) createMenu(); applyMascots(); }, 100);
})();