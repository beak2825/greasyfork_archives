// ==UserScript==
// @name        爱壹帆去广告&模拟VIP&网页全屏 (合并版)
// @description 去广告+长久VIP+网页全屏工具 (基于原版修改合并)
// @match       https://*.iyf.tv/*
// @match       https://*.yifan.tv/*
// @match       https://*.yfsp.tv/*
// @match       https://*.aiyifan.tv/*
// @grant       none
// @license     MIT
// @version     9.9.10
// @author      Me & immwind
// @compatible  Chrome ViolentMonkey
// @run-at      document-start
// @namespace moe.jixun.dn-noad
// @downloadURL https://update.greasyfork.org/scripts/562174/%E7%88%B1%E5%A3%B9%E5%B8%86%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%A8%A1%E6%8B%9FVIP%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%20%28%E5%90%88%E5%B9%B6%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562174/%E7%88%B1%E5%A3%B9%E5%B8%86%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%A8%A1%E6%8B%9FVIP%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%20%28%E5%90%88%E5%B9%B6%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //// Part 1: 爱壹帆去广告&模拟VIP ////
    //// Injection Parameter ////
    const __DEBUG__ = false;
    const id = "jixun: have fun :D";

    const M = {
        InitUser: "T1Vy",
        PermissionManager: "xMFu",
        StoreState: "AytR",
        Utility: "3My9",
        LegacyRouteLoader: "tyNb",
        RxJS: "lJxs",
        RequestHelper: "tWDZ",
    };

    const moduleLoadList = new Set(Object.values(M));
    //// Injection Parameter ////

    const ArrProto = Array.prototype;
    const call = Function.prototype.call;
    const each = call.bind(ArrProto.forEach);

    // 合并了两个脚本的CSS样式
    const injectStyle = () => {
        const s = document.createElement("style");
        s.textContent = `
            /* --- 原去广告样式 --- */
            .cloppe { display: block !important; }
            .video-player { height: unset!important; }
            .playPageTop { min-height: unset!important; }
            .danmu-center { min-height: 1005px !important; max-width: 300px !important; }
            app-dn-user-menu-item.top-item,
            .nav-link-ctn > li:has(a[target="_blank"]),
            .dn-slider-main-container > .dn-slider-image-placeholder[target="_blank"],
            vg-pause-ads,
            .bl.ng-star-inserted,
            .ng-star-inserted.bb,
            app-gg-block, app-gg-block.d-block, .overlay-logo
            { display: none !important; }

            /* --- 新增全屏工具样式 --- */
            .web-fullscreen {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 999999 !important;
                background: #000 !important;
            }
            .web-fullscreen video {
                width: 100% !important;
                height: 100% !important;
                object-fit: contain !important;
            }
            .web-fs-btn {
                cursor: pointer;
                padding: 0 8px;
                color: #fff;
                display: flex;
                align-items: center;
            }
            .web-fs-btn:hover { color: #00a1d6; }
        `.replace(/\s+/g, " ");
        
        // 确保添加到 head 或 html 中
        (document.head || document.documentElement).appendChild(s);
    };

    const defaultAvatar = "https://static.{Host}/upload/up/20170815000037.jpg";
    const fakeIp = Array.from(new Array(4), () => (Math.random() * 255) | 0).join(".");
    const fakeGid = 9527;
    const gidRegex = new RegExp(`gid=${fakeGid}(&|$)`);

    const always = (v) => ({
        get: () => v,
        set: () => {},
    });

    const hideCurrentModule = () => {
        const idx = webpackJsonp.findIndex((module) => module[1][id]);
        webpackJsonp.splice(idx, 1);
    };

    const myHooks = [
        [],
        {
            [id]: function (module, exports, require) {
                injectStyle(); // 注入样式（包含去广告和全屏样式）
                hideCurrentModule();

                const requireDefault = (name) => require(name).a;

                const PermissionManager = requireDefault(M.PermissionManager);
                const StoreState = requireDefault(M.StoreState);
                const RequestHelper = requireDefault(M.RequestHelper);
                const Utility = requireDefault(M.Utility);
                const InitUser = requireDefault(M.InitUser);

                PermissionManager.prototype.isValid = () => true;

                Object.defineProperty(StoreState, "allVip", always(true));
                Object.defineProperty(StoreState, "hideAds", always(true));
                Object.defineProperty(StoreState, "disableNotify", always(true));

                const utils = new Utility(window.document);

                const appendUserInfo = RequestHelper.prototype.appendUserInfo;
                RequestHelper.prototype.appendUserInfo = function (url) {
                    const data = appendUserInfo.call(this, url);
                    for (const [k, v] of Object.entries(data)) {
                        data[k] = v.replace(gidRegex, "gid=0$1");
                    }
                    return data;
                };

                function updateUser(user) {
                    if (!user) return;
                    Object.defineProperty(user, "userName", always("某用户"));
                    Object.defineProperty(user, "nickName", always("某用户"));
                    Object.defineProperty(user, "endDays", always(1));

                    Object.defineProperty(user, "vipImage", always("jixun:normal-vip.png"));
                    Object.defineProperty(user, "sex", always(9));
                    Object.defineProperty(user, "nickName", always(""));
                    Object.defineProperty(user, "experience", always(0));
                    Object.defineProperty(user, "gold", always(0));
                    Object.defineProperty(user, "nextLevel", always(99));
                    Object.defineProperty(user, "gid", always(99));

                    Object.defineProperty(user, "lastIP", always(fakeIp));
                    Object.defineProperty(user, "from", always("地球"));
                    Object.defineProperty(user, "headImage", always(utils.GetHost(defaultAvatar)));
                }

                function fixUser(user) {
                    Object.defineProperty(user, "daysOfMembership", always(1));
                    if (!user.token.gid) {
                        user.token.gid = fakeGid;
                    }
                    return user;
                }

                const { fromValidateToken, fromGetAuthorizedUserInfo } = InitUser.prototype;

                InitUser.prototype.fromValidateToken = function (user) {
                    updateUser(user);
                    return fixUser(fromValidateToken.apply(this, arguments));
                };

                InitUser.prototype.fromGetAuthorizedUserInfo = function (user) {
                    updateUser(user);
                    return fixUser(fromGetAuthorizedUserInfo.apply(this, arguments));
                };

                if (__DEBUG__) {
                    window.__require__ = require;
                }
            },
        },
    ];

    const webpackJsonp = (window.webpackJsonp = window.webpackJsonp || []);
    let prevPush = webpackJsonp.push;
    function webpackPushFilter(args) {
        if (moduleLoadList.size === 0) return;
        const [nextModuleId, modules] = args;

        for (const key in modules) {
            moduleLoadList.delete(key);
        }

        if (moduleLoadList.size == 0) {
            prevPush.call(webpackJsonp, [...myHooks, [[id, nextModuleId]]]);
            window.webpackJsonp.push = prevPush;
        }
    }
    const myPush = function () {
        each(arguments, webpackPushFilter);
        return prevPush.apply(webpackJsonp, arguments);
    }.bind(webpackJsonp);
    if (Object.hasOwnProperty.call(webpackJsonp, "push")) {
        webpackJsonp.push = myPush;
    } else {
        let prevSlice = webpackJsonp.slice;
        webpackJsonp.slice = function () {
            prevPush = webpackJsonp.push;
            webpackJsonp.push = myPush;
            delete window.webpackJsonp.slice;
            return prevSlice.apply(webpackJsonp, arguments);
        }.bind(webpackJsonp);
    }

    window.webpackJsonp.forEach(webpackPushFilter);

    try {
        Object.defineProperty(window, "isAdsBlocked", always(false));
    } catch (err) {
        delete window.isAdsBlocked;
    }


    //// Part 2: 爱壹帆全屏工具 (逻辑部分) ////
    // 这里的逻辑会在页面加载过程中执行，使用 Observer 监听播放器出现
    (function () {
        // 全屏图标
        const expandIcon = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M3 3h6v2H5v4H3V3zm12 0h6v6h-2V5h-4V3zM3 15h2v4h4v2H3v-6zm16 0h2v6h-6v-2h4v-4z"/>
        </svg>`;

        // 退出全屏图标
        const compressIcon = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M9 9H3V7h4V3h2v6zm6-6h2v4h4v2h-6V3zm-6 12v6H7v-4H3v-2h6zm6 0h6v2h-4v4h-2v-6z"/>
        </svg>`;

        // CSS 样式已移至 injectStyle 函数中，此处仅保留逻辑

        function initFullscreenTool() {
            const player = document.querySelector('vg-player');
            const fullscreenBtn = document.querySelector('vg-fullscreen');

            if (!player || !fullscreenBtn || document.querySelector('.web-fs-btn')) return;

            const btn = document.createElement('div');
            btn.className = 'control-item web-fs-btn';
            btn.innerHTML = expandIcon;
            btn.title = "网页全屏";

            btn.onclick = () => {
                player.classList.toggle('web-fullscreen');
                btn.innerHTML = player.classList.contains('web-fullscreen') ? compressIcon : expandIcon;
            };

            fullscreenBtn.parentNode.insertBefore(btn, fullscreenBtn);

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && player.classList.contains('web-fullscreen')) {
                    player.classList.remove('web-fullscreen');
                    btn.innerHTML = expandIcon;
                }
            });
        }

        // 等待播放器加载 (由于脚本运行在 document-start，需要确保 body 存在后再监听)
        const startObserver = () => {
            const target = document.body || document.documentElement;
            const observer = new MutationObserver(() => {
                if (document.querySelector('vg-player')) {
                    initFullscreenTool();
                }
            });
            observer.observe(target, { childList: true, subtree: true });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startObserver);
        } else {
            startObserver();
        }
    })();

})();