// ==UserScript==
// @name         18直達 18comic
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  直達18comic車牌
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551873/18%E7%9B%B4%E9%81%94%2018comic.user.js
// @updateURL https://update.greasyfork.org/scripts/551873/18%E7%9B%B4%E9%81%94%2018comic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.__18comic_menu_registered__) return;
    window.__18comic_menu_registered__ = true;
    if (window.top !== window.self) return;

    // ✅ 網址
    const BASE_URL = 'https://18comic.ink/album';

    const getBlacklist = () => GM_getValue('blacklist', []);
    const saveBlacklist = list => GM_setValue('blacklist', list);
    const isInBlacklist = num => getBlacklist().includes(num);
    const addToBlacklist = num => {
        const list = getBlacklist();
        if (!list.includes(num)) {
            list.push(num);
            saveBlacklist(list);
            return true;
        }
        return false;
    };

    GM_registerMenuCommand('直達', () => {
        if (window.__18comic_busy__) return;
        window.__18comic_busy__ = true;

        setTimeout(() => {
            const userInput = prompt('請輸入內容（支援數字）：');
            window.__18comic_busy__ = false;
            if (userInput === null) return;

            const numbersOnly = userInput.replace(/\D/g, '');
            if (numbersOnly && isInBlacklist(numbersOnly)) {
                alert(`你輸入的 ${numbersOnly} 在黑名單中，已停止跳轉`);
                return;
            }

            const targetUrl = numbersOnly
                ? `${BASE_URL}/${numbersOnly}/`
                : BASE_URL.replace(/\/album$/, '');

            try {
                GM_openInTab(targetUrl, { active: false, insert: true, setParent: true });
            } catch {
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
            }
        }, 0);
    });

    GM_registerMenuCommand('新增黑名單', () => {
        setTimeout(() => {
            const userInput = prompt('請輸入要加入黑名單的內容（支援數字）：');
            if (userInput === null) return;
            const numbersOnly = userInput.replace(/\D/g, '');
            if (!numbersOnly) return alert('沒有有效的數字');
            alert(addToBlacklist(numbersOnly)
                ? `已將 ${numbersOnly} 加入黑名單`
                : `${numbersOnly} 已存在於黑名單`);
        }, 0);
    });

    GM_registerMenuCommand('查看黑名單', () => {
        setTimeout(() => {
            const list = getBlacklist();
            alert(list.length ? `黑名單內容：\n${list.join('\n')}` : '黑名單是空的');
        }, 0);
    });

    GM_registerMenuCommand('清空黑名單', () => {
        setTimeout(() => {
            if (confirm('確定要清空所有黑名單嗎？')) {
                saveBlacklist([]);
                alert('黑名單已清空');
            }
        }, 0);
    });

})();
