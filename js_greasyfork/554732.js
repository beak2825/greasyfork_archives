// ==UserScript==
// @name:en      YouTube Bulk Remove Videos from Playlists (including Watch Later & Liked Videos)
// @name         YouTube 批量移除播放列表内视频（包括稍后再看、点赞过的视频）
// @namespace   http://tampermonkey.net/
// @version      1.0.0
// @description:en  Clear videos from Watch Later or Liked Videos playlists (note: may require multiple runs)
// @description  清除稍后再看、点赞过的视频列表的视频（注：可能得重复开启尝试）
// @match        https://www.youtube.com/playlist?*
// @match        https://www.youtube.com/watch?*&list*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @author kaesinol
// @downloadURL https://update.greasyfork.org/scripts/554732/YouTube%20%E6%89%B9%E9%87%8F%E7%A7%BB%E9%99%A4%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E5%86%85%E8%A7%86%E9%A2%91%EF%BC%88%E5%8C%85%E6%8B%AC%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E3%80%81%E7%82%B9%E8%B5%9E%E8%BF%87%E7%9A%84%E8%A7%86%E9%A2%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554732/YouTube%20%E6%89%B9%E9%87%8F%E7%A7%BB%E9%99%A4%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E5%86%85%E8%A7%86%E9%A2%91%EF%BC%88%E5%8C%85%E6%8B%AC%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E3%80%81%E7%82%B9%E8%B5%9E%E8%BF%87%E7%9A%84%E8%A7%86%E9%A2%91%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- i18n ----------
    const lang = (() => {
        try {
            const l = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
            return l.startsWith('zh') ? 'zh' : 'en';
        } catch (e) {
            return 'en';
        }
    })();

    const I18N = {
        en: {
            defaultText: 'Remove from playlist',
            menuRun: 'Run: Remove from playlist (manual)',
            menuSetText: 'Set: match text',
            menuSetDelay1: 'Set: delay before find (ms)',
            menuSetDelay2: 'Set: delay after click (ms)',
            promptSetText: 'Enter the menu text to match (partial text allowed):',
            promptDelay1: 'Milliseconds to wait after clicking menu before searching for listbox:',
            promptDelay2: 'Milliseconds to wait after clicking the remove item:',
            alertSaved: 'Saved.',
            alertNoItems: 'No menu buttons found. Page may not be loaded or structure changed.',
            alertCompleted: 'Operation completed.',
            alertCancelled: 'Cancelled.',
        },
        zh: {
            defaultText: '从播放列表中移除',
            menuRun: 'Run：从播放列表中移除（手动）',
            menuSetText: '设置：匹配文字',
            menuSetDelay1: '设置：点击后查找延迟（毫秒）',
            menuSetDelay2: '设置：点击后等待（毫秒）',
            promptSetText: '请输入要匹配的菜单文字（可部分匹配）：',
            promptDelay1: '点击菜单后，等待多少毫秒再查找 listbox（建议 600-1500）:',
            promptDelay2: '点击“移除”后等待多少毫秒（用于让请求/动画完成）:',
            alertSaved: '已保存。',
            alertNoItems: '未找到菜单按钮。页面可能未加载或结构已变更。',
            alertCompleted: '操作完成。',
            alertCancelled: '已取消。',
        }
    };

    const t = I18N[lang];

    // ---------- keys & defaults ----------
    const KEY_TEXT = 'yt_remove_menu_text';
    const KEY_DELAY1 = 'yt_delay_before_find';
    const KEY_DELAY2 = 'yt_delay_after_click';
    const DEFAULT_TEXT = t.defaultText;
    const DEFAULT_DELAY1 = 600;
    const DEFAULT_DELAY2 = 800;

    // ---------- utilities ----------
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const getSetting = (key, def) => {
        try {
            const v = GM_getValue(key);
            return v === undefined ? def : v;
        } catch (e) {
            return def;
        }
    };

    const setSetting = (key, val) => {
        try { GM_setValue(key, val); } catch (e) { /* noop */ }
    };

    // ---------- menu registration helpers ----------
    let registeredIds = [];

    function unregisterAll() {
        if (!registeredIds || !registeredIds.length) return;
        try {
            if (typeof GM_unregisterMenuCommand === 'function') {
                for (const id of registeredIds) {
                    try { GM_unregisterMenuCommand(id); } catch (e) { /* ignore individual errors */ }
                }
            }
        } catch (e) {
            // ignore
        } finally {
            registeredIds = [];
        }
    }

    function registerMenus(processFn) {
        unregisterAll();
        try {
            const curText = getSetting(KEY_TEXT, DEFAULT_TEXT);
            const idRun = GM_registerMenuCommand(t.menuRun, processFn);
            const idSetText = GM_registerMenuCommand(`${t.menuSetText} (current: "${curText}")`, () => {
                const cur = getSetting(KEY_TEXT, DEFAULT_TEXT);
                const v = prompt(t.promptSetText, cur);
                if (v === null) { alert(t.alertCancelled); return; }
                setSetting(KEY_TEXT, v.trim());
                alert(t.alertSaved);
                // re-register menus so labels refresh
                registerMenus(processFn);
            });
            const idDelay1 = GM_registerMenuCommand(`${t.menuSetDelay1} (current: ${getSetting(KEY_DELAY1, DEFAULT_DELAY1)})`, () => {
                const cur = String(getSetting(KEY_DELAY1, DEFAULT_DELAY1));
                const v = prompt(t.promptDelay1, cur);
                if (v === null) { alert(t.alertCancelled); return; }
                const n = Math.max(0, parseInt(v) || 0);
                setSetting(KEY_DELAY1, n);
                alert(t.alertSaved);
                registerMenus(processFn);
            });
            const idDelay2 = GM_registerMenuCommand(`${t.menuSetDelay2} (current: ${getSetting(KEY_DELAY2, DEFAULT_DELAY2)})`, () => {
                const cur = String(getSetting(KEY_DELAY2, DEFAULT_DELAY2));
                const v = prompt(t.promptDelay2, cur);
                if (v === null) { alert(t.alertCancelled); return; }
                const n = Math.max(0, parseInt(v) || 0);
                setSetting(KEY_DELAY2, n);
                alert(t.alertSaved);
                registerMenus(processFn);
            });

            // store IDs if provided by manager
            registeredIds = [idRun, idSetText, idDelay1, idDelay2].filter(Boolean);
        } catch (e) {
            // GM_registerMenuCommand may be unavailable; fallback will be handled by caller
            registeredIds = [];
        }
    }

    // ---------- core worker ----------
    async function processAll() {
        const menuText = getSetting(KEY_TEXT, DEFAULT_TEXT);
        const delay1 = Number(getSetting(KEY_DELAY1, DEFAULT_DELAY1)) || DEFAULT_DELAY1;
        const delay2 = Number(getSetting(KEY_DELAY2, DEFAULT_DELAY2)) || DEFAULT_DELAY2;

        // strict selector (no fallback)
        const items = Array.from(document.querySelectorAll('#items ytd-menu-renderer button'));

        if (!items.length) {
            try { alert(t.alertNoItems); } catch (e) { }
            return;
        }

        for (const el of items) {
            try {
                // scroll element into view and focus it before clicking
                try {
                    el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
                    el.focus && el.focus();
                } catch (e) {
                    // ignore scroll errors
                }
                // small extra wait to ensure visibility/render
                await sleep(150);

                // click the menu button (el is expected to be a <button>)
                el.click();
                await sleep(delay1);

                const boxes = Array.from(document.querySelectorAll('tp-yt-paper-listbox'));
                const box = boxes.find(b => b.innerText && b.innerText.includes(menuText));
                if (!box) {
                    continue;
                }

                const target = Array.from(box.querySelectorAll('*')).find(n => n.innerText && n.innerText.includes(menuText));
                if (!target) continue;

                // ensure the target is visible as well
                try { target.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' }); } catch (e) { }
                target.click();
                await sleep(delay2);
            } catch (e) {
                // swallow errors silently
            }
        }

        try { alert(t.alertCompleted); } catch (e) { }
    }

    // ---------- init: register menus or expose fallback ----------
    try {
        registerMenus(processAll);
    } catch (e) {
        // in case menu registration fails, expose run for manual use from console
        try { window.YTRemoveAssistant = { run: processAll }; } catch (err) { /* noop */ }
    }

    // do not auto-run
})();
