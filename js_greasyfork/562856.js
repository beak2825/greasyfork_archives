// ==UserScript==
// @name         修改 Yandex 搜索引擎的 cookie
// @namespace    https://scriptcat.org/zh-CN/users/157252
// @author        Aloazny && Gemini
// @version      1.4.0
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAO8SURBVGiBzZo9aBxHFMd/tiMsIRO2VGHQKoEoTcI2dgxutnY+7kjlctUJ2STbRO2dS3dqQiDGsJVLs+Ai6nSqEpFCCw5BBiVaoUbG2DdnSLjCZl3MrrS3H9Luztyd/vC4u7l57/3f7Myb2Zm5hB58CnwF3AJuxt+L8Ecsf8af/2ry3whXgRXgORA1lOeAA8xMkvg88CNwpEA8K0fAD7HtseEasA680kg8K6+An2JfWvElEI6ReFYOgGVd5L8G/p8g+UQGwHeq5O8B76ZAPpF3yPHWCO4UiWfFrUv+W+D9BSCeyHugXZX8MvDfBSCdFUHBwL6U+f0xsAN8Xhad4zgsLi6OlG1vb9Pr9c5slSwsy6LVao2UHR4e4nneWWp7yFn+bVmFLue0hOu6URZbW1u1W9TzvJwd13Wr6HbLyH8GDM8zYBhGJITIObdtuzJ50zRz+kKIyDCMKvpD4HpC+nIqgDXk+uZMCCHY2NjIlbtu9UThOE6uzPM8hBBV1K8C97OFBjUmK8Mwci0YRVFkmmYl3X6/30g3Ja+BuXQAqzWUS/uw53nn6jmOk9Pzfb9JVlpNBxDUNVDUj6u0ZBiGSuMnJUFCfqGBculT6Ha7pfXb7XaufhAEjXzHsgByhmtkwLbtHKF+v1+aTXq9Xq6+4zgqAbQBHioYKCRVlM+LulwYhirko5g7mypGirrFwcGBcnerKJsA+4pGCgdmumuUpd2KE9dZsg9wrBpAUWrc3d09+b/b7eb+r5JyK8gxVFg+NH0KSXosWnrUnLjKZPgRmuB5Hp1OZ6Ss0+kQBAHtdn4pH4ahLtcINDyBskWeZVk6Wrq0C11BTsmGaisMh0NmZ2exbXukfG5uDt/3Vc2X4SUoptG0NF1eKMjmFeAL4LaO5hBCsLS0hGVZI+WDwaD2G1tFPAW4i8ZWKXoKRRObJmkDmLoN+74/qcG8cBm5ZfhX9ad2PoIgyJWZpqnTBUjOx8kr5WPd1rPIjgsN+BlO34k94I1uD2NEH3gCpwEI4NHU6NTHr8R7Q+ldiV+mw6URTrimAzgEHkyeS208QHIFRgMAuev1YqJ06uFvMjtz2QAAWsg9oouGAfB9tjC7uZvgG+BZU0+maebyfhiGqkvoO8BvdRQu0gHHWpOIQR7vTPuI6V5T8gnuIHPupMm/jX1rwTLy6HNS5PeQ2/1acQ15CD3ug+51xnDQncZ87ER5OyYlR8jxNtarBlnMIC9qqF72WEHhskfZPFAXnyCv2tyIP2+V1NsBfkdet9kB/lF1/AHARK9LUX9T5wAAAABJRU5ErkJggg==
// @description  自用脚本，为 Yandex 搜索选择性地注入 Cookie。
// @match       http*://*.yandex.*/*
// @match       http*://online.yandex.by/*
// @match       http*://online.yandex.com.by/*
// @match       http*://online.yandex.com.eu/*
// @match       http*://online.yandex.com.fr/*
// @match       http*://online.yandex.com.kz/*
// @match       http*://online.yandex.com.lv/*
// @match       http*://online.yandex.com.net/*
// @match       http*://online.yandex.com.ru/*
// @match       http*://online.yandex.com.tr/*
// @match       http*://online.yandex.com.ua/*
// @match       http*://online.yandex.com.uz/*
// @match       http*://online.yandex.com/*
// @match       http*://online.yandex.eu/*
// @match       http*://online.yandex.fr/*
// @match       http*://online.yandex.kz/*
// @match       http*://online.yandex.lv/*
// @match       http*://online.yandex.net/*
// @match       http*://online.yandex.ru/*
// @match       http*://online.yandex.tr/*
// @match       http*://online.yandex.ua/*
// @match       http*://online.yandex.uz/*
// @match       http*://ya.ru/*
// @match       http*://yandex.*.*/*
// @match       http*://yandex.*/*
// @match       http*://yandex.by/*
// @match       http*://yandex.com.by/*
// @match       http*://yandex.com.eu/*
// @match       http*://yandex.com.fr/*
// @match       http*://yandex.com.kz/*
// @match       http*://yandex.com.lv/*
// @match       http*://yandex.com.net/*
// @match       http*://yandex.com.ru/*
// @match       http*://yandex.com.tr/*
// @match       http*://yandex.com.ua/*
// @match       http*://yandex.com.uz/*
// @match       http*://yandex.com/*
// @match       http*://yandex.eu/*
// @match       http*://yandex.fr/*
// @match       http*://yandex.kz/*
// @match       http*://yandex.lv/*
// @match       http*://yandex.net/*
// @match       http*://yandex.ru/*
// @match       http*://yandex.tr/*
// @match       http*://yandex.ua/*
// @match       http*://yandex.uz/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562856/%E4%BF%AE%E6%94%B9%20Yandex%20%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E7%9A%84%20cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/562856/%E4%BF%AE%E6%94%B9%20Yandex%20%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E7%9A%84%20cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COOKIE_ENTRIES = {
        'receive-cookie-deprecation': '1',
        'gpb': 'yandex_gid.90#ygo.84%3A90#ygu.0',
        'yandex_gid': '90',
        'KIykI': '1',
        'my': 'YycCAAMrAVoA',
        'is_gdpr': '0',
        'is_gdpr_b': 'CI2uORC1sQIoAg==',
        'yp': '1791962047.dafs.24-3#1763356501.dlp.1#2077928979.pcs.0#1794104599.sp.family%3A0%3Ashst%3A1#1794104979.swntab.0#1775618089.sz.904x407x3#1762914389.szm.3%3A904x407%3A407x822:0#1762741476.ygo.21320%3A90#1765160676.ygu.0'
    };

    const EXPIRY_DAYS = 3650;
    const COOKIE_DEBUG = true;
    const cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

    function getDomain() {
        const host = window.location.hostname;
        const parts = host.split('.');
        const idx = parts.findIndex(p => p === 'yandex' || p === 'ya');
        return idx !== -1 ? '.' + parts.slice(idx).join('.') : (parts.length <= 2 ? '.' + host : '.' + parts.slice(-2).join('.'));
    }

    function setCookieInternal(name, value, domain) {
        const expires = new Date(Date.now() + EXPIRY_DAYS * 86400000).toUTCString();
        const isSec = window.location.protocol === 'https:';
        const str = `${name}=${value}; domain=${domain}; path=/; expires=${expires}; ${isSec ? 'SameSite=None; secure' : 'SameSite=Lax'}`;
        try {
            if (cookieDesc && cookieDesc.set) {
                cookieDesc.set.call(document, str);
            } else {
                document.cookie = str;
            }
            return true;
        } catch (e) {
            if (COOKIE_DEBUG) console.error(`Set ${name} failed:`, e);
            return false;
        }
    }

    function init() {
        const domain = getDomain();
        const current = Object.fromEntries(document.cookie.split(';').map(c => c.trim().split('=')).filter(p => COOKIE_ENTRIES.hasOwnProperty(p[0])));

        let count = 0;
        for (const [k, v] of Object.entries(COOKIE_ENTRIES)) {
            if (current[k] !== v && setCookieInternal(k, v, domain)) {
                count++;
            }
        }
        if (cookieDesc && cookieDesc.configurable) {
            Object.defineProperty(document, 'cookie', {
                get: () => cookieDesc.get.call(document),
                set: (val) => {
                    const name = val.split('=')[0].trim();
                    if (COOKIE_ENTRIES.hasOwnProperty(name)) {
                        if (COOKIE_DEBUG) console.log(`[Lock] Blocked attempt to modify: ${name}`);
                        return;
                    }
                    cookieDesc.set.call(document, val);
                },
                configurable: true
            });
        }
        if (COOKIE_DEBUG && count > 0) console.log(`[Cookie脚本] Updated ${count} items on ${domain}`);
    }

    try { init(); } catch (e) { if (COOKIE_DEBUG) console.error(e); }
})();
