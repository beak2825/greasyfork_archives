// ==UserScript==
// @name         YouTube 旋转修复（Firefox Android｜状态机版）
// @namespace    http://tampermonkey.net/
// @version      4.0
// @license      MIT
// @description  修复 Firefox Android 上 m.youtube.com 因状态错乱导致的强制横屏问题。大概吧
// @author       粥
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560111/YouTube%20%E6%97%8B%E8%BD%AC%E4%BF%AE%E5%A4%8D%EF%BC%88Firefox%20Android%EF%BD%9C%E7%8A%B6%E6%80%81%E6%9C%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560111/YouTube%20%E6%97%8B%E8%BD%AC%E4%BF%AE%E5%A4%8D%EF%BC%88Firefox%20Android%EF%BD%9C%E7%8A%B6%E6%80%81%E6%9C%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       日志系统（可审计）
    ========================= */

    const LOG = [];
    const MAX = 600;

    function snapshot() {
        return {
            orientation: screen.orientation?.type || null,
            angle: screen.orientation?.angle ?? null,
            fullscreen: !!document.fullscreenElement,
            visibility: document.visibilityState,
            viewport: `${innerWidth}x${innerHeight}`
        };
    }

    function log(tag, msg, data = {}) {
        const entry = {
            t: performance.now().toFixed(2),
            tag,
            msg,
            env: snapshot(),
            data,
            stack: (new Error().stack || '')
                .split('\n')
                .slice(2, 6)
                .join('\n')
        };
        LOG.push(entry);
        if (LOG.length > MAX) LOG.shift();

        console.groupCollapsed(
            `%c[YT-${tag}] %c${msg} %c@${entry.t}ms`,
            "color:#ff5252;font-weight:bold",
            "color:#fff",
            "color:#888"
        );
        console.log(entry.env);
        if (Object.keys(data).length) console.log(data);
        console.log(entry.stack);
        console.groupEnd();
    }

    window.__YT_ROTATION_EXPORT__ = () =>
        LOG.map((l, i) =>
            `#${i + 1} [${l.tag}] ${l.t}ms\n${l.msg}\nENV=${JSON.stringify(l.env)}\n${l.stack}\n`
        ).join('\n');

    /* =========================
       状态机（关键）
    ========================= */

    const STATE = {
        fullscreen: false,
        stablePortrait: true
    };

    document.addEventListener('fullscreenchange', () => {
        STATE.fullscreen = !!document.fullscreenElement;
        log('STATE', 'fullscreenchange', { fullscreen: STATE.fullscreen });

        if (!STATE.fullscreen) {
            // 明确结束播放器主导权
            screen.orientation?.lock('portrait').then(() => {
                STATE.stablePortrait = true;
                log('FIX', '退出全屏，强制回归竖屏');
            }).catch(() => {});
        }
    }, true);

    /* =========================
       lock 拦截（核心）
    ========================= */

    if (screen.orientation?.lock) {
        const raw = screen.orientation.lock;
        screen.orientation.lock = function (type) {
            log('CALL', 'orientation.lock', { type });

            // 非全屏禁止横屏
            if (!STATE.fullscreen && type?.includes('landscape')) {
                log('BLOCK', '非全屏横屏请求已拦截');
                return Promise.resolve();
            }

            return raw.apply(this, arguments)
                .then(() => log('PASS', 'orientation.lock 成功'))
                .catch(e => log('ERR', 'orientation.lock 失败', { e }));
        };
    }

    /* =========================
       orientationchange 隔离
    ========================= */

    window.addEventListener('orientationchange', e => {
        log('EVENT', 'orientationchange');

        if (!STATE.fullscreen) {
            e.stopImmediatePropagation();
            log('BLOCK', '阻断非全屏 orientationchange');
        }
    }, true);

    /* =========================
       visibility 修复
    ========================= */

    document.addEventListener('visibilitychange', () => {
        log('EVENT', 'visibilitychange');
        if (document.visibilityState === 'visible' && !STATE.fullscreen) {
            screen.orientation?.lock('portrait').then(() =>
                log('FIX', '页面返回，确认竖屏状态')
            ).catch(() => {});
        }
    });

    log('INIT', 'YouTube 旋转状态机已启动');
})();