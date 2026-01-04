// ==UserScript==
// @name         洛谷保存站扩展插件
// @namespace    luogu-saver
// @version      2025-11-08_2
// @description  为洛谷添加洛谷保存站相关功能支持
// @author       Federico2903
// @match        https://www.luogu.com.cn/*
// @match        https://www.luogu.com/*
// @icon         https://www.luogu.me/static/self/img/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @connect      www.luogu.me
// @connect      www.luogu.com.cn
// @connect      www.luogu.com
// @license      GPL-v3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/555178/%E6%B4%9B%E8%B0%B7%E4%BF%9D%E5%AD%98%E7%AB%99%E6%89%A9%E5%B1%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/555178/%E6%B4%9B%E8%B0%B7%E4%BF%9D%E5%AD%98%E7%AB%99%E6%89%A9%E5%B1%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    console.log(`
  _      ____  ____     _ __     __ _____  ____
 | |    / ___|/ ___|   / \\\\ \\   / /| ____||  _ \\
 | |   | |  _ \\___ \\  / _ \\\\ \\ / / |  _|  | |_) |
 | |___| |_| | ___) |/ ___ \\\\ V /  | |___ |  _ <
 |_____|\\____||____//_/   \\_\\\\_/   |_____||_| \\_\\

 `);

    const isDomestic = location.href.startsWith('https://www.luogu.com.cn');

    const defaultSettings = {
        auto_replace_abroad: true,
        auto_replace_domestic: false,
        auto_redirect: false,
        show_save_btn: false,
        auto_save: true,
        saver_token: ''
    };

    const settings = {
        auto_replace_abroad: await GM.getValue('auto_replace_abroad', defaultSettings.auto_replace_abroad),
        auto_replace_domestic: await GM.getValue('auto_replace_domestic', defaultSettings.auto_replace_domestic),
        auto_redirect: await GM.getValue('auto_redirect', defaultSettings.auto_redirect),
        show_save_btn: await GM.getValue('show_save_btn', defaultSettings.show_save_btn),
        auto_save: await GM.getValue('auto_save', defaultSettings.auto_save),
        saver_token: await GM.getValue('saver_token', defaultSettings.saver_token)
    };

    async function sendXmlRequest(url, options) {
        const response = await GM.xmlHttpRequest({
            url,
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        });
        return JSON.parse(response.responseText);
    }

    function createMenu() {
        GM.registerMenuCommand("⚡ 欢迎使用洛谷保存站扩展插件");
        GM.registerMenuCommand(
            getInputMenuText(
                "saver_token",
                "🔑 保存站 Token（%val%）",
                (optionKey) => (settings[optionKey] ? settings[optionKey].slice(0, 6) + "..." : "未设置")
            ),
            () => inputOption("saver_token", "输入保存站 Token（留空或取消则清空）", true)
        );
        GM.registerMenuCommand(getMenuText("auto_redirect", "自动重定向"), () => toggleOption("auto_redirect"));
        GM.registerMenuCommand(getMenuText("show_save_btn", "展示保存按钮（不可用）")/*, () => toggleOption("show_save_btn")*/);
        GM.registerMenuCommand(getMenuText("auto_save", "自动保存文章"), () => toggleOption("auto_save"));
        GM.registerMenuCommand(getMenuText("auto_replace_abroad", "替换国际站链接"), () => toggleOption("auto_replace_abroad"));
        GM.registerMenuCommand(getMenuText("auto_replace_domestic", "替换国内站链接"), () => toggleOption("auto_replace_domestic"));
    }

    function getMenuText(optionKey, description) {
        const status = settings[optionKey] ? "✅" : "❌";
        return `${status} ${description}`;
    }

    async function toggleOption(optionKey) {
        settings[optionKey] = !settings[optionKey];
        await GM.setValue(optionKey, settings[optionKey]);
        location.reload();
    }

    function getInputMenuText(optionKey, description, func = (optionKey) => settings[optionKey]) {
        return description.replaceAll("%val%", func(optionKey));
    }

    async function inputOption(optionKey, msg, str = false) {
        const val = prompt("请输入 " + msg + " 的新值：");
        settings[optionKey] = str ? val : (parseInt(val) | 0);
        await GM.setValue(optionKey, settings[optionKey]);
        if (optionKey === "nav_logo" && val && settings.remove_logo) {
            toggleOption("remove_logo");
        }
        location.reload();
    }

    function parseUrl(url) {
        const userMatch = url.match(/\/user\/(\d+)$/);
        if (userMatch) {
            return { type: 'user', id: userMatch[1] };
        }

        if (url.length < 14) throw new Error("非法链接，请检查输入。");
        const tail = url.slice(-14);
        const tailMatch = tail.match(/^(paste|ticle)\/([a-zA-Z0-9]{8})$/);
        if (!tailMatch) throw new Error("非法链接，请检查输入。");

        const type = tailMatch[1] === "ticle" ? "article" : "paste";
        const id = tailMatch[2];
        if (type !== "article" && type !== "paste") throw new Error("非法链接，请检查输入。");

        return { type, id };
    }

    function wrapper(func) {
        let lst = -1;
        const iId = setInterval(() => {
            const res = func();
            if (res === lst) {
                clearInterval(iId);
                return;
            }
            lst = res;
        }, 10);
    }

    createMenu();

    async function readStorage(key, def) { return await GM.getValue(`lgs_config_${key}`, def); }
    async function writeStorage(key, value) { await GM.setValue(`lgs_config_${key}`, value); }

    function doReplace() {
        let result = 0;
        if (settings.auto_replace_abroad) {
            const cont = document.querySelector('#url');
            if (cont) cont.innerHTML = cont.innerHTML.replaceAll('luogu.com/', 'luogu.me/');
            const links = document.querySelectorAll('a[href^="https://www.luogu.com/"]');
            for (const link of links) link.setAttribute('href', link.href.replaceAll('luogu.com/', 'luogu.me/'))
            result += (!!cont) + links.length;
        }
        if (settings.auto_replace_domestic) {
            const links = document.querySelectorAll('a[href^="https://www.luogu.com.cn/"]');
            for (const link of links) link.setAttribute('href', link.href.replaceAll('luogu.com.cn/', 'luogu.me/'))
            result += links.length;
        }
        return result;
    }

    function doRedirect() {
        if (!settings.auto_redirect) return;
        const link = document.querySelector('#go').parentElement;
        if (!link) return 0;
        location.href = link.href.replaceAll('luogu.com/', 'luogu.me/');
        return 1;
    }

    wrapper(doReplace);
    wrapper(doRedirect);

    async function doSave() {
        if (!settings.auto_save) return;
        try {
            const { type, id } = parseUrl(location.pathname);
            const now = Date.now();
            if (now - (await readStorage('last_save')) < 3000) console.log('Save too fast, skipping...');
            const data = await sendXmlRequest(`https://www.luogu.me/${type}/save/${id}`, { method: 'GET' });
            await writeStorage('last_save', now);
        } catch(ignore) {}
    }

    doSave();

})();