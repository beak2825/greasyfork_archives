// ==UserScript==
// @name         魔兽世界英雄榜跳转
// @namespace    https://greasyfork.org/zh-CN/users/1502715
// @version      1.5.1
// @description  在魔兽世界英雄榜、Raider.IO、Warcraft Logs、Raidbots 页面通过油猴菜单快速互相跳转
// @author       电视卫士
// @license      MIT
// @match        https://wow.blizzard.cn/character/*
// @match        https://worldofwarcraft.blizzard.com/*/character/*
// @match        https://worldofwarcraft.blizzard.com/character/*
// @match        https://raider.io/characters/*/*/*
// @match        https://raider.io/*/characters/*/*/*
// @match        https://*.warcraftlogs.com/character/*/*/*
// @match        https://www.raidbots.com/simbot/quick*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549586/%E9%AD%94%E5%85%BD%E4%B8%96%E7%95%8C%E8%8B%B1%E9%9B%84%E6%A6%9C%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549586/%E9%AD%94%E5%85%BD%E4%B8%96%E7%95%8C%E8%8B%B1%E9%9B%84%E6%A6%9C%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseCN() {
        const hash = location.hash || '';
        const cleaned = hash.replace(/^#\/?/, '');
        const parts = cleaned.split('/').filter(Boolean);
        if (parts.length < 2) return null;
        const realm = decodeURIComponent(parts[0]);
        const name = decodeURIComponent(parts[1]);
        return { serverRegion: 'cn', realm, name, pageLang: 'cn' };
    }

    function parseIntl() {
        const segs = location.pathname.split('/').filter(Boolean);
        const idx = segs.indexOf('character');
        if (idx === -1) return null;
        if (segs.length <= idx + 3) return null;
        const serverRegion = segs[idx + 1];
        const realm = decodeURIComponent(segs[idx + 2]);
        const name = decodeURIComponent(segs[idx + 3]);
        const pageLang = (segs[0] && segs[0] !== 'character') ? segs[0] : 'en-us'; // 默认 en-us
        return { serverRegion, realm, name, pageLang };
    }

    function parseRIO() {
        const segs = location.pathname.split('/').filter(Boolean);
        const idx = segs.indexOf('characters');
        if (idx === -1) return null;
        if (segs.length <= idx + 3) return null;
        const serverRegion = segs[idx + 1];
        const realm = decodeURIComponent(segs[idx + 2]);
        const name = decodeURIComponent(segs[idx + 3]);
        const pageLang = (idx > 0) ? segs[0] : '';
        return { serverRegion, realm, name, pageLang };
    }

    function parseWCL() {
        const segs = location.pathname.split('/').filter(Boolean);
        const idx = segs.indexOf('character');
        if (idx === -1) return null;
        if (segs.length <= idx + 3) return null;
        const serverRegion = segs[idx + 1];
        const realm = decodeURIComponent(segs[idx + 2]);
        const name = decodeURIComponent(segs[idx + 3]);
        const hostParts = location.hostname.split('.');
        let pageLang = '';
        if (hostParts.length === 3) {
            pageLang = hostParts[0];
            if (pageLang === 'www') pageLang = '';
        }
        return { serverRegion, realm, name, pageLang };
    }

    function parseRaidbots() {
        const url = new URL(location.href);
        const serverRegion = url.searchParams.get('region');
        const realm = url.searchParams.get('realm');
        const name = url.searchParams.get('name');
        if (!serverRegion || !realm || !name) return null;
        return { serverRegion, realm, name, pageLang: '' };
    }

    function parseCurrent() {
        const host = location.host.toLowerCase();
        if (host.includes('wow.blizzard.cn')) return parseCN();
        if (host.includes('worldofwarcraft.blizzard.com')) return parseIntl();
        if (host.includes('raider.io')) return parseRIO();
        if (host.includes('warcraftlogs.com')) return parseWCL();
        if (host.includes('raidbots.com')) return parseRaidbots();
        return null;
    }

    function makeUrls(info) {
        const { serverRegion, realm, name } = info;
        const rio = `https://raider.io/cn/characters/${encodeURIComponent(serverRegion)}/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`;
        const wcl = `https://cn.warcraftlogs.com/character/${encodeURIComponent(serverRegion)}/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`;
        const rb = `https://www.raidbots.com/simbot/quick?region=${encodeURIComponent(serverRegion)}&realm=${encodeURIComponent(realm)}&name=${encodeURIComponent(name)}`;
        let hb;
        if (serverRegion === 'cn') {
            hb = `https://wow.blizzard.cn/character/#/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`;
        } else {
            hb = `https://worldofwarcraft.blizzard.com/en-us/character/${encodeURIComponent(serverRegion)}/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`;
        }
        return { rio, wcl, rb, hb };
    }

    function openUrl(url) {
        try {
            GM_openInTab(url, { active: true, insert: true });
        } catch (e) {
            window.open(url, '_blank');
        }
    }

    function safeRegister(label, builder) {
        return GM_registerMenuCommand(label, () => {
            const info = parseCurrent();
            if (!info) return;
            const urls = makeUrls(info);
            openUrl(builder(urls));
        });
    }

    function main() {
        const host = location.host.toLowerCase();
        if (host.includes('wow.blizzard.cn') || host.includes('worldofwarcraft.blizzard.com')) {
            safeRegister('跳转至 Raider.IO', u => u.rio);
            safeRegister('跳转至 Warcraft Logs', u => u.wcl);
            safeRegister('跳转至 Raidbots', u => u.rb);
        } else if (host.includes('raider.io')) {
            safeRegister('跳转至 英雄榜', u => u.hb);
            safeRegister('跳转至 Warcraft Logs', u => u.wcl);
            safeRegister('跳转至 Raidbots', u => u.rb);
        } else if (host.includes('warcraftlogs.com')) {
            safeRegister('跳转至 英雄榜', u => u.hb);
            safeRegister('跳转至 Raider.IO', u => u.rio);
            safeRegister('跳转至 Raidbots', u => u.rb);
        } else if (host.includes('raidbots.com')) {
            safeRegister('跳转至 英雄榜', u => u.hb);
            safeRegister('跳转至 Raider.IO', u => u.rio);
            safeRegister('跳转至 Warcraft Logs', u => u.wcl);
        }
    }

    main();
})();