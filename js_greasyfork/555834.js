// ==UserScript==
// @name         巴哈姆特哈拉區顯示最近閱覽
// @namespace    https://greasyfork.org/zh-TW/users/1537796-meredith2u
// @version      1.3
// @description  右上角固定顯示最近閱覽，支援刪除與明/暗主題
// @author       meredith
// @match        https://forum.gamer.com.tw/*
// @exclude      https://forum.gamer.com.tw/A.php*
// @exclude      https://forum.gamer.com.tw/post*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555834/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E6%8B%89%E5%8D%80%E9%A1%AF%E7%A4%BA%E6%9C%80%E8%BF%91%E9%96%B1%E8%A6%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/555834/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E6%8B%89%E5%8D%80%E9%A1%AF%E7%A4%BA%E6%9C%80%E8%BF%91%E9%96%B1%E8%A6%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const THEME_COOKIE = 'custom_lastboard_theme';
    const LIST_COOKIE = 'ckBH_lastBoard';
    const PANEL_ID = 'custom-float-panel';
    const DEBOUNCE_DELAY = 100;

    const getCookie = name => {
        const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
        return match ? decodeURIComponent(match[1]) : null;
    };

    const setCookie = (name, value, days = 365) => {
        const date = new Date(Date.now() + days * 864e5);
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; domain=.gamer.com.tw`;
    };

    const loadList = () => {
        const raw = getCookie(LIST_COOKIE);
        if (!raw) return null;
        let data;
        try { data = JSON.parse(raw); } catch { return null; }
        if (!Array.isArray(data)) return null;
        return data.filter(item =>
            Array.isArray(item) &&
            item.length === 2 &&
            typeof item[0] === 'string' && item[0].trim() &&
            typeof item[1] === 'string' && item[1].trim()
        );
    };

    let list = loadList();
    if (!list || list.length === 0) return;

    let currentTheme = getCookie(THEME_COOKIE) || 'dark';

    const themes = {
        light: {
            bg: 'rgba(255,255,255,0.95)', border: '#e0e0e0', color: '#2d2d2d',
            title: '#1a1a1a', link: '#1a1a1a', hoverLink: '#0066cc',
            divider: '#d0d0d0', itemDiv: '#e5e5e5', hover: 'rgba(0,0,0,0.04)',
            delBg: 'rgba(255,102,102,0.15)', delBorder: 'rgba(255,102,102,0.3)',
            delColor: '#e63946', delHover: 'rgba(255,102,102,0.3)'
        },
        dark: {
            bg: 'rgba(15,15,15,0.92)', border: '#333', color: '#e0e0e0',
            title: '#ffffff', link: '#ffffff', hoverLink: '#ffffff',
            divider: '#444', itemDiv: '#333', hover: 'rgba(255,255,255,0.06)',
            delBg: 'rgba(255,68,68,0.15)', delBorder: 'rgba(255,68,68,0.3)',
            delColor: '#ff6b6b', delHover: 'rgba(255,68,68,0.3)'
        }
    };

    const createPanel = () => {
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style.cssText = `
            position:fixed;top:65px;right:20px;width:${location.pathname === '/' ? '280px' : '250px'};
            max-height:80vh;overflow-y:auto;border-radius:12px;padding:10px 14px;
            font:14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
            box-shadow:0 8px 24px rgba(0,0,0,0.6);z-index:30;transition:all .25s ease;
            backdrop-filter:blur(8px);user-select:none;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;';

        const title = document.createElement('h3');
        title.textContent = '最近閱覽';
        title.style.cssText = 'margin:0;font-size:16px;font-weight:600;';
        header.appendChild(title);

        const toggle = document.createElement('button');
        toggle.id = 'theme-toggle';
        toggle.style.cssText = `
            background:none;border:none;font-size:18px;cursor:pointer;padding:4px;
            border-radius:6px;width:32px;height:32px;display:flex;align-items:center;
            justify-content:center;transition:all .2s ease;
        `;
        header.appendChild(toggle);
        panel.appendChild(header);

        const topDiv = document.createElement('div');
        topDiv.id = 'top-divider';
        topDiv.style.cssText = 'height:1px;margin:4px 0;';
        panel.appendChild(topDiv);

        const container = document.createElement('div');
        container.addEventListener('click', handleContainerClick);
        container.addEventListener('mouseenter', handleMouseEnter, true);
        container.addEventListener('mouseleave', handleMouseLeave, true);
        panel.appendChild(container);

        toggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            setCookie(THEME_COOKIE, currentTheme);
            applyThemeToPanel();
            renderList();
        });

        return { panel, container, title, toggle, topDiv };
    };

    const { panel, container, title, toggle, topDiv } = createPanel();

    function handleContainerClick(e) {
        const delBtn = e.target.closest('.delete-btn');
        if (!delBtn) return;
        const item = delBtn.closest('.list-item');
        if (!item) return;
        const name = item.dataset.name;
        if (!name || !confirm(`確定要從最近閱覽中移除「${name}」嗎？`)) return;
        const id = item.dataset.id;
        list = list.filter(([bid]) => bid !== id);
        setCookie(LIST_COOKIE, list.length ? JSON.stringify(list) : '', 365);
        if (list.length === 0) { panel.remove(); return; }
        renderList();
    }

    function handleMouseEnter(e) {
        const item = e.target.closest('.list-item');
        if (!item) return;
        const del = item.querySelector('.delete-btn');
        if (del) {
            item.style.backgroundColor = themes[currentTheme].hover;
            del.style.opacity = '1';
            del.style.transform = 'translateX(0)';
        }
    }

    function handleMouseLeave(e) {
        const item = e.target.closest('.list-item');
        if (!item) return;
        const del = item.querySelector('.delete-btn');
        if (del) {
            item.style.backgroundColor = '';
            del.style.opacity = '0';
            del.style.transform = 'translateX(8px)';
        }
    }

    const renderList = () => {
        const frag = document.createDocumentFragment();
        const t = themes[currentTheme];

        list.forEach(([id, name]) => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.dataset.id = id;
            item.dataset.name = name;
            item.style.cssText = `
                margin:0 0 4px;display:flex;justify-content:space-between;align-items:center;
                padding:1px 3px;border-radius:3px;transition:background .2s;position:relative;
            `;

            const link = document.createElement('a');
            link.href = `B.php?bsn=${id}`;
            link.textContent = name;
            link.style.cssText = `
                flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                text-decoration:none;font-weight:500;font-size:15px;color:${t.link};
                transition:color .2s;
            `;
            link.addEventListener('mouseover', () => link.style.color = t.hoverLink);
            link.addEventListener('mouseout', () => link.style.color = t.link);
            item.appendChild(link);

            const del = document.createElement('button');
            del.className = 'delete-btn';
            del.textContent = '×';
            del.title = '刪除此項目';
            del.style.cssText = `
                width:26px;height:26px;border-radius:50%;font-size:16px;font-weight:bold;
                display:flex;align-items:center;justify-content:center;cursor:pointer;
                opacity:0;transform:translateX(8px);transition:all .22s;pointer-events:auto;
                background:${t.delBg};border:1px solid ${t.delBorder};color:${t.delColor};
            `;
            del.addEventListener('mouseenter', () => {
                del.style.background = t.delHover;
                del.style.transform = 'translateX(0) scale(1.1)';
            });
            del.addEventListener('mouseleave', () => {
                del.style.background = t.delBg;
                del.style.transform = 'translateX(0) scale(1)';
            });
            item.appendChild(del);

            const div = document.createElement('div');
            div.className = 'item-divider';
            div.style.cssText = `height:1px;margin:4px 0;background:${t.itemDiv};`;

            frag.appendChild(item);
            frag.appendChild(div);
        });

        if (frag.lastChild?.classList.contains('item-divider')) {
            frag.removeChild(frag.lastChild);
        }

        container.innerHTML = '';
        container.appendChild(frag);
        applyThemeToPanel();
    };

    const applyThemeToPanel = () => {
        const t = themes[currentTheme];
        const isLight = currentTheme === 'light';
        Object.assign(panel.style, {
            background: t.bg,
            border: `1px solid ${t.border}`,
            color: t.color,
            boxShadow: `0 8px 24px rgba(0,0,0,${isLight ? '0.08' : '0.6'})`
        });
        title.style.color = t.title;
        topDiv.style.background = `linear-gradient(to right, transparent, ${t.divider}, transparent)`;
        toggle.textContent = isLight ? '🌙' : '☀️';
        toggle.title = isLight ? '切換至黑暗模式' : '切換至明亮模式';
    };

    document.body.appendChild(panel);
    renderList();

    let rebuildTimeout;
    const scheduleRebuild = () => {
        clearTimeout(rebuildTimeout);
        rebuildTimeout = setTimeout(() => {
            const newList = loadList();
            if (newList && newList.length > 0 && !document.body.contains(panel)) {
                list = newList;
                document.body.appendChild(panel);
                renderList();
            }
        }, DEBOUNCE_DELAY);
    };

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.removedNodes.length && Array.from(m.removedNodes).some(n => n.contains?.(panel))) {
                scheduleRebuild();
                break;
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('unload', () => {
        observer.disconnect();
        clearTimeout(rebuildTimeout);
    });

})();