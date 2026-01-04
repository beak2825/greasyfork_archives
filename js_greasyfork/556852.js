// ==UserScript==
// @name         X Account Location Tagger (AboutAccountQuery)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在 X 推文时间戳旁显示按钮，鼠标悬停自动查询"账号所在地 / App Store 区域"，红色标注可能使用 VPN 的账号。
// @author       海空蒼
// @homepage     https://github.com/SkyBlue997/X-Account-Location-Tagger
// @source       https://github.com/SkyBlue997/X-Account-Location-Tagger
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556852/X%20Account%20Location%20Tagger%20%28AboutAccountQuery%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556852/X%20Account%20Location%20Tagger%20%28AboutAccountQuery%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*****************************************************************
     * 配置区
     *****************************************************************/

    const ABOUT_ENDPOINT =
        'https://x.com/i/api/graphql/zs_jFPFT78rBpXv9Z3U2YQ/AboutAccountQuery';

    const AUTH_BEARER =
        'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

    const DEBUG = true;

    /*****************************************************************
     * 工具函数
     *****************************************************************/

    function log(...args) {
        if (DEBUG) {
            console.log('[X-AccountLocation]', ...args);
        }
    }

    function getCsrfToken() {
        const m = document.cookie.match(/(?:^|;\s*)ct0=([^;]+)/);
        return m ? decodeURIComponent(m[1]) : '';
    }

    function extractLocationFromResponse(data) {
        if (!data || !data.data) return null;

        let result = null;

        // 结构 1：data.user_result.result
        if (data.data.user_result && data.data.user_result.result) {
            result = data.data.user_result.result;
        }
        // 结构 2：data.user.result
        else if (data.data.user && data.data.user.result) {
            result = data.data.user.result;
        }
        // 结构 3：data.user_result_by_screen_name.result（当前 AboutAccountQuery 返回）
        else if (data.data.user_result_by_screen_name && data.data.user_result_by_screen_name.result) {
            result = data.data.user_result_by_screen_name.result;
        }

        if (!result) {
            log('未知 GraphQL 顶层结构，data =', JSON.stringify(data, null, 2));
            return null;
        }

        // 新结构：result.about_profile
        const aboutProfile =
            result.about_profile ||
            result.aboutProfile ||
            (result.aboutModule && (result.aboutModule.about_profile || result.aboutModule.aboutProfile)) ||
            null;

        if (!aboutProfile) {
            log('未找到 about_profile 字段，打印 result 以供检查:', result);
            return null;
        }

        const country = aboutProfile.account_based_in || aboutProfile.accountBasedIn || null;
        // 目前返回里没有明显的 countryCode，可以留空，将来若有字段再补
        const countryCode = null;
        // about_profile.source 是类似 "Japan App Store" / "Turkey App Store" / "Canada Android App" 的字符串
        const appStoreRegion = aboutProfile.source || null;
        // location_accurate 为 false 表示可能使用了 VPN
        const locationAccurate = aboutProfile.location_accurate !== false; // 默认为 true

        if (!country && !appStoreRegion) {
            return null;
        }

        return {
            country,
            countryCode,
            appStoreRegion,
            locationAccurate,
        };
    }

    /*****************************************************************
     * 调用 GraphQL：AboutAccountQuery
     *****************************************************************/

    async function fetchAccountLocation(screenName) {
        const variables = { screenName };
        const url =
            ABOUT_ENDPOINT +
            '?variables=' + encodeURIComponent(JSON.stringify(variables));

        const csrf = getCsrfToken();

        log('请求 AboutAccountQuery:', screenName);

        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'authorization': AUTH_BEARER,
                'x-csrf-token': csrf,
                'x-twitter-active-user': 'yes',
                'x-twitter-auth-type': 'OAuth2Session',
                'x-twitter-client-language': document.documentElement.lang || 'zh-cn',
                'accept': '*/*',
                'content-type': 'application/json',
            },
        });

        if (!res.ok) {
            log('请求失败:', screenName, 'HTTP', res.status);
            if (res.status === 429) {
                log('遭遇 rate limit，请稍后再试');
            }
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const loc = extractLocationFromResponse(data);
        log('获得位置:', screenName, loc);
        return loc;
    }

    /*****************************************************************
     * DOM：按需查询归属地
     *****************************************************************/

    const locationCache = new Map();

    function addLocationButton(timeElement, screenName) {
        // 检查是否已经添加过按钮或标签
        const link = timeElement.closest('a');
        if (!link || link.dataset.xLocationTagged) return;

        // 如果已经有缓存，直接显示标签
        if (locationCache.has(screenName)) {
            const info = locationCache.get(screenName);
            if (info && (info.country || info.appStoreRegion)) {
                showLocationLabel(timeElement, info, screenName);
                return;
            }
        }

        // 创建查询按钮
        const button = document.createElement('button');
        button.textContent = '📍';
        button.title = '悬停显示归属地';
        button.style.marginLeft = '4px';
        button.style.fontSize = '12px';
        button.style.border = 'none';
        button.style.background = 'none';
        button.style.cursor = 'pointer';
        button.style.opacity = '0.6';
        button.style.padding = '0 2px';
        button.style.transition = 'opacity 0.2s';

        button.onmouseenter = async (e) => {
            button.style.opacity = '1';

            // 防止重复请求
            if (button.dataset.loading) return;
            button.dataset.loading = 'true';
            button.textContent = '⏳';
            button.disabled = true;

            try {
                const info = await fetchAccountLocation(screenName);
                locationCache.set(screenName, info || {});

                if (info && (info.country || info.appStoreRegion)) {
                    // 移除按钮，显示标签
                    button.remove();
                    showLocationLabel(timeElement, info, screenName);
                } else {
                    button.textContent = '❌';
                    button.title = '无归属地信息';
                    setTimeout(() => {
                        button.remove();
                    }, 2000);
                }
            } catch (e) {
                log('查询归属地失败:', screenName, e);
                button.textContent = '⚠️';
                button.title = '查询失败';
                button.disabled = false;
                delete button.dataset.loading;
            }
        };

        button.onmouseleave = () => {
            button.style.opacity = '0.6';
        };

        link.dataset.xLocationTagged = '1';
        timeElement.insertAdjacentElement('afterend', button);
    }

    function showLocationLabel(timeElement, info, screenName) {
        const link = timeElement.closest('a');
        if (!link) return;

        link.dataset.xLocationTagged = '1';

        const parts = [];
        if (info.country) parts.push(info.country);
        if (info.appStoreRegion) parts.push(info.appStoreRegion);
        const label = parts.join(' / ');
        if (!label) return;

        const tag = document.createElement('span');
        tag.textContent = ` [${label}]`;
        tag.style.marginLeft = '4px';
        tag.style.fontSize = '12px';
        tag.style.opacity = '0.7';

        // 根据 location_accurate 设置颜色
        // false 表示可能使用了 VPN，标记为红色
        if (info.locationAccurate === false) {
            tag.style.color = '#f91880'; // 红色 (Twitter 警告红)
            tag.title = '可能使用了 VPN';
        } else {
            tag.style.color = '#536471'; // Twitter 灰色
        }

        timeElement.insertAdjacentElement('afterend', tag);
    }

    function scanAndAddButtons() {
        const timeLinks = document.querySelectorAll('a[href*="/status/"]');

        timeLinks.forEach((link) => {
            // 跳过已处理的
            if (link.dataset.xLocationTagged) return;

            const href = link.getAttribute('href');
            const match = href?.match(/^\/([^\/]+)\/status\/\d+/);
            if (!match) return;

            const screenName = match[1];
            const timeElement = link.querySelector('time');
            if (!timeElement) return;

            addLocationButton(timeElement, screenName);
        });
    }

    /*****************************************************************
     * 启动
     *****************************************************************/

    function init() {
        log('脚本启动 - 鼠标悬停按钮自动查询归属地');

        // 初始扫描
        scanAndAddButtons();

        // 监听 DOM 变化
        const mo = new MutationObserver((mutations) => {
            let needRescan = false;
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length > 0) {
                    needRescan = true;
                    break;
                }
            }
            if (needRescan) {
                scanAndAddButtons();
            }
        });

        mo.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init, { once: true });
    }
})();