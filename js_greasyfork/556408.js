// ==UserScript==
// @name         网站数据清除工具 Website Data Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  自动识别系统语言，一键清除当前网站各类数据（支持中英文界面）
// @description:zh-CN 自动识别系统语言，一键清除当前网站各类数据（localStorage/Cookie/数据库等）
// @author       ChiamZhang
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556408/%E7%BD%91%E7%AB%99%E6%95%B0%E6%8D%AE%E6%B8%85%E9%99%A4%E5%B7%A5%E5%85%B7%20Website%20Data%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/556408/%E7%BD%91%E7%AB%99%E6%95%B0%E6%8D%AE%E6%B8%85%E9%99%A4%E5%B7%A5%E5%85%B7%20Website%20Data%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 1. 语言包配置（统一管理中英文文本）=================
    const LANG_PACK = {
        // 中文配置
        zh: {
            menu: {
                clearAll: '🗑️ 清除当前网站所有数据',
                clearBasic: '📦 仅清除 localStorage + SessionStorage',
                clearCookie: '🍪 仅清除当前网站Cookie',
                clearDB: '🗄️ 仅清除 IndexedDB + Web SQL',
                feedback: 'Github 主页',
            },
            confirm: {
                clearAll: '⚠️ 确认清除当前网站所有数据？\n包含：localStorage、SessionStorage、Cookie、IndexedDB、Web SQL\n清除后不可恢复，登录状态会失效！',
                clearBasic: '确认清除当前网站的localStorage和SessionStorage？\n这会清除网站保存的本地设置和临时数据！',
                clearCookie: '确认清除当前网站的所有Cookie？\n这会导致登录状态失效，需要重新登录！',
                clearDB: '确认清除当前网站的IndexedDB和Web SQL数据库？\n这会清除网站保存的离线数据和缓存内容！'
            },
            notification: {
                clearAllSuccess: '✅ 当前网站所有数据清除成功！',
                clearAllPartial: '部分数据清除成功，部分数据可能未清除（详见控制台）',
                clearBasicSuccess: '✅ 基础存储数据清除成功！',
                clearCookieSuccess: '✅ Cookie清除成功！',
                clearDBSuccess: '✅ 数据库数据清除成功！',
                feedbackOpen: '已打开反馈页面，感谢你的建议！',
                error: '❌ 数据清除过程中发生错误',
                switchEnable: '%s已启用',
                switchDisable: '%s已禁用'
            },
            console: {
                init: '【网站数据清除工具】菜单已加载完成，可在油猴菜单中操作',
                clearLocalStorage: '[数据清除] localStorage 清除成功',
                clearSessionStorage: '[数据清除] sessionStorage 清除成功',
                clearCookie: '[数据清除] Cookie 清除成功（共%s个）',
                clearCookieFail: '[数据清除] Cookie 清除失败：%s',
                clearIndexedDB: '[数据清除] IndexedDB 清除完成（共%s个数据库）',
                clearIndexedDBBlocked: '[数据清除] IndexedDB %s 被占用（可能有其他标签页打开）',
                clearWebSQL: '[数据清除] Web SQL 清除完成（处理%s个匹配模式）',
                clearFail: '[数据清除%s] %s'
            }
        },
        // 英文配置
        en: {
            menu: {
                clearAll: '🗑️ Clear All Data of Current Website',
                clearBasic: '📦 Clear Only localStorage + SessionStorage',
                clearCookie: '🍪 Clear Only Current Website Cookies',
                clearDB: '🗄️ Clear Only IndexedDB + Web SQL',
                feedback: 'Project Link:Github Link',
            },
            confirm: {
                clearAll: '⚠️ Confirm to clear all data of current website?\nIncluded: localStorage, SessionStorage, Cookies, IndexedDB, Web SQL\nIrreversible, login status will be lost!',
                clearBasic: 'Confirm to clear localStorage and SessionStorage of current website?\nThis will delete local settings and temporary data saved by the website!',
                clearCookie: 'Confirm to clear all cookies of current website?\nLogin status will be lost, need to re-login!',
                clearDB: 'Confirm to clear IndexedDB and Web SQL of current website?\nThis will delete offline data and cache content saved by the website!'
            },
            notification: {
                clearAllSuccess: '✅ All data of current website cleared successfully!',
                clearAllPartial: 'Partial data cleared successfully, some data may not be deleted (see console for details)',
                clearBasicSuccess: '✅ Basic storage data cleared successfully!',
                clearCookieSuccess: '✅ Cookies cleared successfully!',
                clearDBSuccess: '✅ Database data cleared successfully!',
                feedbackOpen: 'Feedback page opened, thank you for your suggestion!',
                error: '❌ Error occurred during data cleaning',
                switchEnable: '%s enabled',
                switchDisable: '%s disabled'
            },
            console: {
                init: '[Website Data Cleaner] Menu loaded successfully, operate via Tampermonkey menu',
                clearLocalStorage: '[Data Cleanup] localStorage cleared successfully',
                clearSessionStorage: '[Data Cleanup] sessionStorage cleared successfully',
                clearCookie: '[Data Cleanup] Cookies cleared successfully (total %s)',
                clearCookieFail: '[Data Cleanup] Cookie cleanup failed: %s',
                clearIndexedDB: '[Data Cleanup] IndexedDB cleaned up (total %s databases)',
                clearIndexedDBBlocked: '[Data Cleanup] IndexedDB %s is occupied (other tabs may be open)',
                clearWebSQL: '[Data Cleanup] Web SQL cleaned up (processed %s patterns)',
                clearFail: '[Data Cleanup%s] %s'
            }
        }
    };

    // ================= 2. 自动检测系统语言 =================
    let currentLang = 'en'; // 默认英文
    const userLang = navigator.language || navigator.userLanguage; // 获取浏览器/系统语言

    // 判断是否为中文环境（支持 zh-CN、zh-TW、zh-HK 等）
    if (userLang.toLowerCase().startsWith('zh')) {
        currentLang = 'zh';
    }

    // 获取当前语言对应的文本（简化调用）
    const t = (path) => {
        const keys = path.split('.');
        return keys.reduce((obj, key) => obj?.[key] || path, LANG_PACK[currentLang]);
    };

    // ================= 3. 全局变量 =================
    const menuId = []; // 存储菜单ID，用于后续注销
    // 菜单配置（关联语言包中的菜单名称）
    const menuAll = [
        ['menu_clearAll', t('menu.clearAll'), 'clearAllData', false],
        ['menu_clearBasic', t('menu.clearBasic'), 'clearBasicData', false],
        ['menu_clearCookie', t('menu.clearCookie'), 'clearOnlyCookie', false],
        ['menu_clearDB', t('menu.clearDB'), 'clearOnlyDB', false],
        ['menu_feedback', t('menu.feedback'), 'openFeedback', false]
    ];

    // ================= 4. 核心清除函数 =================
    /**
     * 清除localStorage
     */
    function clearLocalStorage() {
        try {
            localStorage.clear();
            console.log(t('console.clearLocalStorage'));
            return true;
        } catch (e) {
            console.error(t('console.clearCookieFail'), e);
            return false;
        }
    }

    /**
     * 清除sessionStorage
     */
    function clearSessionStorage() {
        try {
            sessionStorage.clear();
            console.log(t('console.clearSessionStorage'));
            return true;
        } catch (e) {
            console.error(t('console.clearCookieFail'), e);
            return false;
        }
    }

    /**
     * 清除当前网站的Cookie
     */
    function clearCookies() {
        try {
            const cookies = document.cookie.split(';').filter(c => c.trim());
            const domain = window.location.hostname;

            // 兼容不同子域名和路径的Cookie清除
            cookies.forEach(cookie => {
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

                // 多场景清除确保生效
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}; SameSite=None; Secure`;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}; SameSite=None; Secure`;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`;
            });

            console.log(t('console.clearCookie'), cookies.length);
            return true;
        } catch (e) {
            console.error(t('console.clearCookieFail'), e);
            return false;
        }
    }

    /**
     * 清除IndexedDB
     */
    async function clearIndexedDB() {
        try {
            if (!window.indexedDB) return true;

            const databases = await indexedDB.databases();
            if (databases.length === 0) return true;

            for (const db of databases) {
                await new Promise((resolve) => {
                    const request = indexedDB.deleteDatabase(db.name);
                    request.onsuccess = () => resolve(true);
                    request.onerror = (err) => {
                        console.warn(t('console.clearIndexedDBBlocked'), db.name, err);
                        resolve(false);
                    };
                    request.onblocked = () => {
                        console.warn(t('console.clearIndexedDBBlocked'), db.name);
                        resolve(false);
                    };
                });
            }

            console.log(t('console.clearIndexedDB'), databases.length);
            return true;
        } catch (e) {
            console.error(t('console.clearCookieFail'), e);
            return false;
        }
    }

    /**
     * 清除Web SQL
     */
    function clearWebSQL() {
        try {
            if (!window.openDatabase) return true;

            // 遍历常见的Web SQL数据库名称模式
            const dbNamePatterns = ['web sql', 'site_', 'app_', 'local_', 'data_', 'db_'];
            let clearedCount = 0;

            dbNamePatterns.forEach(pattern => {
                try {
                    const db = openDatabase(`temp_${pattern}`, '1.0', 'Temporary DB for deletion', 1024 * 1024);
                    db.transaction(tx => {
                        tx.executeSql('DROP TABLE IF EXISTS main');
                        clearedCount++;
                    });
                } catch (e) {}
            });

            console.log(t('console.clearWebSQL'), clearedCount);
            return true;
        } catch (e) {
            console.error(t('console.clearCookieFail'), e);
            return true;
        }
    }

    // ================= 5. 功能入口函数 =================
    /**
     * 显示操作结果通知
     * @param {string} messageKey 语言包中的消息键名
     * @param {boolean} success 是否成功
     * @param {Array} args 消息格式化参数（可选）
     */
    function showResult(messageKey, success = true, args = []) {
        let message = t(`notification.${messageKey}`);
        // 格式化消息（支持占位符 %s）
        if (args.length > 0) {
            args.forEach(arg => {
                message = message.replace(/%s/, arg);
            });
        }

        // 优先使用浏览器通知API
        if (Notification.permission === 'granted') {
            new Notification(
                currentLang === 'zh' ? '网站数据清除工具' : 'Website Data Cleaner',
                { body: message }
            );
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(perm => {
                if (perm === 'granted') {
                    new Notification(
                        currentLang === 'zh' ? '网站数据清除工具' : 'Website Data Cleaner',
                        { body: message }
                    );
                }
            });
        }

        // 控制台打印详细信息
        console.log(t('console.clearFail'), success ? 'Success' : 'Fail', message);

        // 页面顶部临时提示
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 4px;
            background: ${success ? '#4CAF50' : '#f44336'};
            color: white;
            font-size: 14px;
            z-index: 999999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    /**
     * 清除所有数据（完整模式）
     */
    async function clearAllData() {
        if (!confirm(t('confirm.clearAll'))) {
            return;
        }

        try {
            const results = [
                clearLocalStorage(),
                clearSessionStorage(),
                clearCookies(),
                await clearIndexedDB(),
                clearWebSQL()
            ];

            const hasFailure = results.some(res => !res);
            if (hasFailure) {
                showResult('clearAllPartial', false);
            } else {
                showResult('clearAllSuccess', true);
                // 可选：清除后刷新页面（取消注释启用）
                // if (confirm(currentLang === 'zh' ? '是否刷新页面使清除生效？' : 'Refresh page to take effect?')) location.reload();
            }
        } catch (e) {
            showResult('error', false);
            console.error(t('console.clearFail'), 'Error', e);
        }
    }

    /**
     * 仅清除基础存储（localStorage + SessionStorage）
     */
    function clearBasicData() {
        if (!confirm(t('confirm.clearBasic'))) {
            return;
        }

        const res1 = clearLocalStorage();
        const res2 = clearSessionStorage();

        if (res1 && res2) {
            showResult('clearBasicSuccess', true);
        } else {
            showResult('error', false);
        }
    }

    /**
     * 仅清除Cookie
     */
    function clearOnlyCookie() {
        if (!confirm(t('confirm.clearCookie'))) {
            return;
        }

        const res = clearCookies();
        if (res) {
            showResult('clearCookieSuccess', true);
        } else {
            showResult('error', false);
        }
    }

    /**
     * 仅清除数据库（IndexedDB + Web SQL）
     */
    async function clearOnlyDB() {
        if (!confirm(t('confirm.clearDB'))) {
            return;
        }

        const res1 = await clearIndexedDB();
        const res2 = clearWebSQL();

        if (res1 && res2) {
            showResult('clearDBSuccess', true);
        } else {
            showResult('clearAllPartial', false);
        }
    }

    /**
     * 反馈功能
     */
    function openFeedback() {
        GM_openInTab('https://github.com/ChiamZhang/WebsiteDataCleaner', {
            active: true,
            insert: true,
            setParent: true
        });
        showResult('feedbackOpen', true);
    }

    // ================= 6. 菜单注册函数 =================
    /**
     * 注册油猴菜单（根据当前语言显示对应名称）
     */
    function registerMenuCommand() {
        // 先注销已存在的菜单，避免重复
        if (menuId.length > 0) {
            menuId.forEach(id => {
                try { GM_unregisterMenuCommand(id); } catch (e) {}
            });
            menuId.length = 0; // 清空数组
        }

        // 循环注册菜单
        for (let i = 0; i < menuAll.length; i++) {
            const [menuKey, menuName, funcName, menuState] = menuAll[i];

            // 从存储中读取菜单状态（如果有）
            menuAll[i][3] = GM_getValue(menuKey, menuState);

            // 绑定对应的功能函数
            const funcMap = {
                clearAllData,
                clearBasicData,
                clearOnlyCookie,
                clearOnlyDB,
                openFeedback
            };
            const targetFunc = funcMap[funcName] || (() => {});

            // 注册菜单
            menuId[i] = GM_registerMenuCommand(menuName, targetFunc);
        }


    }

    /**
     * 菜单开关状态切换（预留功能）
     * @param {boolean} currentState 当前状态
     * @param {string} menuKey 菜单ID
     * @param {string} menuDesc 菜单描述
     */
    function menuSwitch(currentState, menuKey, menuDesc) {
        const newState = !currentState;
        GM_setValue(menuKey, newState);
        showResult(newState ? 'switchEnable' : 'switchDisable', true, [menuDesc]);
        registerMenuCommand(); // 重新注册菜单更新状态显示
    }

    // ================= 7. 初始化 =================
    // 检查通知权限（可选，提升用户体验）
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        console.log(currentLang === 'zh'
            ? '[数据清除工具] 可在浏览器设置中开启通知权限，获取清除结果提醒'
            : '[Website Data Cleaner] Enable notification permission in browser settings for cleanup result alerts'
        );
    }

    // 注册菜单
    if (menuId.length < 4) {
        registerMenuCommand();
    }

    // 控制台初始化提示
    console.log(t('console.init'));
})();