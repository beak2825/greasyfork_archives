// ==UserScript==
// @name         NodeSeek Enhance
// @namespace    http://www.nodeseek.com/
// @version      1.3
// @description  【NodeSeek增强脚本】全面增强 NodeSeek/DeepFlood 论坛体验。核心功能：自动签到（支持随机/固定鸡腿）、无缝翻页（帖子列表和评论自动加载）、快捷回复（浮动编辑器）、代码高亮（支持亮色/暗色主题）、图片滑动查看。内容管理：屏蔽用户/帖子/分类（支持关键词和正则）、帖子排序（按回复数/查看数/已访问置底）、隐藏元素（页脚/分类标签/帖子信息/推荐轮播/用户统计面板）。界面优化：紧凑模式（1-4列多栏布局，自定义间距/字体/头像大小）、自定义背景图（支持URL/本地上传）、Header/Frame透明度（支持模糊和饱和度）、字体排版自定义（标题/Tag/元数据/内容）、已访问链接标记（可隐藏/置底）、默认头像替换（自动识别系统头像）。增强功能：用户卡片扩展（显示@我/私信/回复通知）、等级标签显示（楼主等级和统计信息）、浏览历史记录（下拉菜单快速访问）、键盘快捷键（左右箭头翻页、Ctrl+Enter提交）、强制新标签页打开帖子、自动跳转外部链接、平滑滚动、即时页面预加载。设置管理：可视化设置面板（集成到导航栏）、设置导入导出、一键恢复默认样式。支持深色模式自动适配。
// @author       bbb
// @match        *://www.nodeseek.com/*
// @match        *://www.deepflood.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACz0lEQVR4Ae3B32tVdQAA8M85u7aVHObmzJVD0+ssiphstLEM62CBlCBEIAYhUoGGD/kiRUo+9CIEElFZgZJFSApBVhCUX2WFrVQKf5Qy26SgdK4pN7eZu+cbtyfJ/gLx83HD9SAhlEyXupiPhUSTeonRfNw1ws2aRJeN5jHcolFhJJ9M8Zj99piDTnv12SjzfzIb9dmrC7Pttt8ykjDVLsu8ZZ1GH1oqeDofJLtJh4fMEw3Y72jlCuEO2+W+sNJFr3vOZ1YIi8NIGA29hDWhGgZDJ2Rt2ZvZSBazmMUsZsPZ1qwVQmcYDNWwhtAbRsNIWJx6WLPDfgxNVkm9nR8hm+XduLba7F9RtcXztmUzyY/YJrUqNPvBYc0eSS3CwXxMl4WG7CarsyEuvU2HOkRNujSw3PosxR6DFurKxx3E/akFohPo0aDfEO61os5LdrtLVWG1TzxokifdiSH9GnTjuGhBqsWE39GOo3kVi8wsmeVW00SJ200zA9r0kFcdQzv+MKElVW/S+L5EE86pmUth3BV/SzCOCUjMVXMWzfsSYybVl1SlSlESkagpuOI1nzshFX1gyAF1UKhJEKOkJFVNXVBv+pJoBK1qBkh86z1/SaR+9o5zEgoDaloxsiSart6F1Bkl83ESHWEKvvEbqZJETaokgSH9hCk6cBLtSs6kDqEb/cZ0K+MnO0X/VdhRGUBZjzH9uA+HUl+a0BvmO+J7bVZSKWz1kehqhfe9oWalNoccDmW9JnyV+toxsy3PK3aY9Gx4gMp567ziV4WawpCXra+MEhZ5xqTtecVycxzXlxA22OK4ZYbt9LjvrM5PkNUp6zVPdNpBv1QKwt126Paxp8zwqXu8kG8pYZdHlT2Rvxo2aVG2ObyYn65UnXLKVULZZrP02ZRfCms1OmAXCSHRYqrLzuZFaDFV6s/8omuERs0Kl/LzITVTvTHDeXTD9eAftAsSYhXYOWUAAAAASUVORK5CYII=
// @require      https://s4.zstatic.net/ajax/libs/layui/2.9.9/layui.min.js
// @resource     highlightStyle https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css
// @resource     highlightStyle_dark https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_getResourceURL
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/555408/NodeSeek%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/555408/NodeSeek%20Enhance.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const { version, author, name, icon } = GM_info.script;

    const BASE_URL = location.origin;

    const SITE_MAP = {
        "www.nodeseek.com": { code: "ns", name: "NodeSeek", url: "https://www.nodeseek.com/" },
        "www.deepflood.com": { code: "df", name: "DeepFlood", url: "https://www.deepflood.com/" }
    };

    const DEFAULT_COMPACT_MODE = Object.freeze({
        enabled: true,
        columns: 1,
        padding: "6px 10px",
        avatarSize: 26,
        titleFontSize: 13,
        infoFontSize: 10,
        marginBottom: 2
    });

    const COMPACT_MODE_STYLE_ID = 'nsx-compact-mode-style';
    const CUSTOM_BACKGROUND_STYLE_ID = 'nsx-custom-background-style';
    const VISITED_LINK_STYLE_ID = 'nsx-visited-links-style';
    const HEADER_OPACITY_STYLE_ID = 'nsx-header-opacity-style';
    const FRAME_OPACITY_STYLE_ID = 'nsx-frame-opacity-style';
    const TYPOGRAPHY_STYLE_IDS = {
        title: 'nsx-typography-title-style',
        tag: 'nsx-typography-tag-style',
        meta: 'nsx-typography-meta-style',
        content: 'nsx-typography-content-style'
    };

    const escapeCssValue = (value = '') => `${value}`.replace(/"/g, '\\"');

    const INITIAL_OVERLAY_CLASS = 'nsx-initial-hide';
    const INITIAL_OVERLAY_DURATION_DEFAULT = 1200;
    let initialOverlayTimer = null;

    const toggleRootClass = (className, enabled = true) => {
        const root = document.documentElement;
        root.classList.toggle(className, enabled);
        const body = document.body;
        if (body) {
            body.classList.toggle(className, enabled);
            return;
        }
        if (!enabled) return;
        const applyToBody = () => {
            if (document.body) {
                document.body.classList.toggle(className, enabled);
                return true;
            }
            return false;
        };
        if (typeof MutationObserver === 'function') {
            const observer = new MutationObserver((mutations, obs) => {
                if (applyToBody()) {
                    obs.disconnect();
                }
            });
            observer.observe(root, { childList: true });
        } else {
            const onReady = () => {
                applyToBody();
                document.removeEventListener('DOMContentLoaded', onReady);
            };
            document.addEventListener('DOMContentLoaded', onReady, { once: true });
        }
    };

    const addCompactPendingClass = () => {
        const apply = () => {
            document.documentElement.classList.add('nsx-compact-mode-pending');
            document.documentElement.classList.add('nsx-body-hidden');
            document.body?.classList.add('nsx-compact-mode-pending');
            document.body?.classList.add('nsx-body-hidden');
        };
        if (document.body) {
            apply();
        } else {
            document.addEventListener('DOMContentLoaded', apply, { once: true });
        }
    };

    const removeCompactPendingClass = () => {
        document.documentElement.classList.remove('nsx-compact-mode-pending');
        document.documentElement.classList.remove('nsx-body-hidden');
        document.body?.classList.remove('nsx-compact-mode-pending');
        document.body?.classList.remove('nsx-body-hidden');
    };

    const getOverlayStoredSettings = () => {
        const stored = getStoredSettings();
        const overlay = stored && stored.loading_overlay ? stored.loading_overlay : {};
        return {
            enabled: overlay.enabled !== false,
            duration: parseInt(overlay.duration, 10) || INITIAL_OVERLAY_DURATION_DEFAULT
        };
    };

    const createInitialOverlay = (() => {
        let cssInjected = false;
        return (_forceDuration = null, forceEnabled = null) => {
            const storedSettings = getOverlayStoredSettings();
            const enabled = forceEnabled !== null ? forceEnabled : storedSettings.enabled;
            if (!enabled) return;
            if (!cssInjected) {
                GM_addStyle(`
                    html.${INITIAL_OVERLAY_CLASS} body {
                        opacity: 0 !important;
                        transition: opacity 0.4s ease;
                    }
                `);
                cssInjected = true;
            }
            document.documentElement.classList.add(INITIAL_OVERLAY_CLASS);
        };
    })();

    const removeInitialOverlay = () => {
        document.documentElement.classList.remove(INITIAL_OVERLAY_CLASS);
        initialOverlayTimer && clearTimeout(initialOverlayTimer);
    };

    const scheduleRemoveInitialOverlay = (() => {
        let loadHandlerRegistered = false;
        let pendingDuration = INITIAL_OVERLAY_DURATION_DEFAULT;
        let overlayEnabled = true;

        const reveal = () => {
            removeInitialOverlay();
            removeCompactPendingClass();
        };

        const runRemoval = () => {
            initialOverlayTimer && clearTimeout(initialOverlayTimer);
            if (!overlayEnabled) {
                reveal();
                return;
            }
            initialOverlayTimer = setTimeout(() => {
                if (typeof requestAnimationFrame === 'function') {
                    requestAnimationFrame(reveal);
                } else {
                    reveal();
                }
            }, pendingDuration);
        };

        return (duration = INITIAL_OVERLAY_DURATION_DEFAULT, enabled = true) => {
            const delay = Number.isFinite(duration) ? duration : parseInt(duration, 10);
            pendingDuration = Number.isFinite(delay) && delay >= 0 ? delay : INITIAL_OVERLAY_DURATION_DEFAULT;
            overlayEnabled = enabled !== false;

            if (!overlayEnabled) {
                reveal();
                return;
            }

            if (document.readyState === 'complete') {
                runRemoval();
                return;
            }

            if (!loadHandlerRegistered) {
                loadHandlerRegistered = true;
                window.addEventListener('load', runRemoval, { once: true });
            }
        };
    })();

    const ensureStyleElement = (id) => {
        let style = document.getElementById(id);
        if (!style) {
            style = document.createElement('style');
            style.id = id;
            (document.head || document.documentElement).appendChild(style);
        }
        return style;
    };

    const applyCustomBackgroundStyle = (config) => {
        if (!config) {
            const existing = document.getElementById(CUSTOM_BACKGROUND_STYLE_ID);
            if (existing) existing.remove();
            return;
        }
        const style = ensureStyleElement(CUSTOM_BACKGROUND_STYLE_ID);
        style.textContent = `
            body {
                background-image: url("${escapeCssValue(config.url)}") !important;
                background-repeat: ${config.repeat} !important;
                background-position: ${config.position} !important;
                background-size: ${config.size} !important;
                background-attachment: ${config.attachment} !important;
            }
        `;
    };

    const applyVisitedLinkStyle = (config) => {
        if (!config) {
            const existing = document.getElementById(VISITED_LINK_STYLE_ID);
            if (existing) existing.remove();
            return;
        }
        const { lightLink, lightVisited, darkLink, darkVisited } = config;
        const style = ensureStyleElement(VISITED_LINK_STYLE_ID);
        const lightVars = [];
        if (lightLink) lightVars.push(`    --link-color: ${lightLink};`);
        lightVars.push(`    --link-visited-color: ${lightVisited};`);
        const darkVars = [];
        if (darkLink) darkVars.push(`    --link-color: ${darkLink};`);
        darkVars.push(`    --link-visited-color: ${darkVisited};`);
        style.textContent = `
:root {
${lightVars.join('\n')}
}
body.dark-layout {
${darkVars.join('\n')}
}
.post-list .post-title a:visited {
    color: var(--link-visited-color);
}
`;
    };

    const applyHeaderOpacityCSS = (config) => {
        const style = ensureStyleElement(HEADER_OPACITY_STYLE_ID);
        if (!config) {
            style.textContent = '';
            return;
        }
        const clamped = Math.min(1, Math.max(0, config.value ?? 0.92));
        const darkValue = Math.min(1, Math.max(0, clamped - 0.1));
        const blurEnabled = config.blur_enabled !== false;
        const saturateEnabled = config.saturate_enabled !== false;
        const blur = blurEnabled ? Math.max(0, parseFloat(config.blur) || 0) : 0;
        const saturate = saturateEnabled ? Math.max(0, parseFloat(config.saturate) || 0) : 0;
        const blurCSS = blurEnabled ? ` blur(${blur}px)` : '';
        const saturateCSS = saturateEnabled ? ` saturate(${saturate}%)` : '';
        const effectCSS = (blurEnabled || saturateEnabled)
            ? `    backdrop-filter:${saturateCSS || ''}${blurCSS || ''};
    -webkit-backdrop-filter:${saturateCSS || ''}${blurCSS || ''};
`
            : '';
        style.textContent = `
html.nsx-header-opacity body > header,
html.nsx-header-opacity body > header #nsk-head {
    background-color: rgba(255,255,255, ${clamped}) !important;
${effectCSS}}
html.nsx-header-opacity body.dark-layout > header,
html.nsx-header-opacity body.dark-layout > header #nsk-head {
    background-color: rgba(20,20,20, ${darkValue}) !important;
${effectCSS}}
`;
    };
const applyFrameOpacityCSS = (config) => {
        const style = ensureStyleElement(FRAME_OPACITY_STYLE_ID);
        if (!config) {
            style.textContent = '';
            return;
        }
        const clamped = Math.min(1, Math.max(0, config.value ?? 0.95));
        const darkValue = Math.min(1, Math.max(0, clamped - 0.1));
        const blurEnabled = config.blur_enabled !== false;
        const saturateEnabled = config.saturate_enabled !== false;
        const blur = blurEnabled ? Math.max(0, parseFloat(config.blur) || 0) : 0;
        const saturate = saturateEnabled ? Math.max(0, parseFloat(config.saturate) || 0) : 0;
        const blurCSS = blurEnabled ? ` blur(${blur}px)` : '';
        const saturateCSS = saturateEnabled ? ` saturate(${saturate}%)` : '';
        const effectCSS = (blurEnabled || saturateEnabled)
            ? `    backdrop-filter:${saturateCSS || ''}${blurCSS || ''};
    -webkit-backdrop-filter:${saturateCSS || ''}${blurCSS || ''};
`
            : '';
        style.textContent = `
html.nsx-frame-opacity #nsk-body,
html.nsx-frame-opacity .nsk-body,
html.nsx-frame-opacity #nsk-frame,
html.nsx-frame-opacity .nsk-frame {
    background-color: rgba(255,255,255, ${clamped}) !important;
${effectCSS}}
html.nsx-frame-opacity body.dark-layout #nsk-body,
html.nsx-frame-opacity body.dark-layout .nsk-body,
html.nsx-frame-opacity body.dark-layout #nsk-frame,
html.nsx-frame-opacity body.dark-layout .nsk-frame {
    background-color: rgba(20,20,20, ${darkValue}) !important;
${effectCSS}}
`;
    };
        const buildTypographyCSS = (type, config) => {
            const selectors = {
                title: '.post-list .post-title a, .post-title a',
                tag: '.post-list .post-category, .post-category, .post-list .nsk-badge',
                meta: '.post-list .post-info, .post-info, .post-meta-info, .content-info',
                content: '.post-content, .post-content *:not(svg):not(path)'
            };
            const selector = selectors[type];
            if (!selector) return '';
            const declarations = [];
            const normalize = (val) => typeof val === 'string' ? val.trim() : '';
            const fontFamily = normalize(config.fontFamily);
            const fontSize = normalize(config.fontSize);
            const color = normalize(config.color);
            const fontStyle = normalize(config.fontStyle);
            const letterSpacing = normalize(config.letterSpacing);
            const ligatures = normalize(config.ligatures);
            if (fontFamily) declarations.push(`font-family: ${fontFamily} !important;`);
            if (fontSize) declarations.push(`font-size: ${fontSize} !important;`);
            if (color) declarations.push(`color: ${color} !important;`);
            if (fontStyle) declarations.push(`font-style: ${fontStyle} !important;`);
            if (letterSpacing) declarations.push(`letter-spacing: ${letterSpacing} !important;`);
            if (ligatures) declarations.push(`font-variant-ligatures: ${ligatures} !important;`);
            if (declarations.length === 0) return '';
            return `
${selector} {
    ${declarations.join('\n    ')}
}
`;
        };
const applyTypographyStyle = (type, config) => {
        const styleId = TYPOGRAPHY_STYLE_IDS[type];
        if (!styleId) return;
        if (!config || config.enabled === false) {
            const existing = document.getElementById(styleId);
            if (existing) existing.remove();
            return;
        }
        const css = buildTypographyCSS(type, config);
        if (!css.trim()) {
            document.getElementById(styleId)?.remove();
            return;
        }
        const style = ensureStyleElement(styleId);
        style.textContent = css;
    };

    const normalizeCompactConfig = (config = {}) => ({
        enabled: config.enabled !== false,
        columns: parseInt(config.columns, 10) || DEFAULT_COMPACT_MODE.columns,
        padding: config.padding || DEFAULT_COMPACT_MODE.padding,
        avatarSize: parseInt(config.avatarSize, 10) || DEFAULT_COMPACT_MODE.avatarSize,
        titleFontSize: parseInt(config.titleFontSize, 10) || DEFAULT_COMPACT_MODE.titleFontSize,
        infoFontSize: parseInt(config.infoFontSize, 10) || DEFAULT_COMPACT_MODE.infoFontSize,
        marginBottom: parseInt(config.marginBottom, 10) || DEFAULT_COMPACT_MODE.marginBottom
    });

    const buildCompactModeCSS = (config) => {
        const normalized = normalizeCompactConfig(config);
        const columns = normalized.columns;
        const padding = normalized.padding;
        const avatarSize = normalized.avatarSize;
        const titleFontSize = normalized.titleFontSize;
        const infoFontSize = normalized.infoFontSize;
        const marginBottom = normalized.marginBottom;
        const containerWidth = columns > 1 ? `${1080 + (columns - 1) * 400}px` : '1080px';
        const containerWidthNum = columns > 1 ? 1080 + (columns - 1) * 400 : 1080;
        const gridGapX = Math.max(8, marginBottom * 2);
        const iconSize = Math.max(12, infoFontSize - 2);

        return `
            /* 紧凑模式 - 多列布局 */
            html.nsx-compact-mode .nsk-container {
                width: ${containerWidth} !important;
                max-width: 98% !important;
            }
            html.nsx-compact-mode #nsk-body-left {
                flex: 1 !important;
                min-width: 0 !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list {
                display: grid !important;
                grid-template-columns: repeat(${columns}, 1fr) !important;
                gap: ${marginBottom}px ${gridGapX}px !important;
                padding: 4px 0 !important;
            }
            html.nsx-compact-mode #nsk-head {
                position: relative !important;
            }
            html.nsx-compact-mode #nsk-head .search-box {
                position: absolute !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                margin-left: 0 !important;
                flex: 0 1 170px !important;
                max-width: 290px !important;
                z-index: 2 !important;
                pointer-events: auto !important;
                transition: none !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item {
                padding: ${padding} !important;
                margin-bottom: ${marginBottom}px !important;
                border-bottom: 1px solid rgba(0,0,0,.05) !important;
                display: flex !important;
                flex-direction: row !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .post-title {
                font-size: ${titleFontSize}px !important;
                line-height: 1.35 !important;
                margin-bottom: 3px !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .post-title a {
                font-size: inherit !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .post-info {
                font-size: ${infoFontSize}px !important;
                line-height: 1.25 !important;
                margin-top: 2px !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .avatar-wrapper,
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .avatar-normal {
                width: ${avatarSize}px !important;
                height: ${avatarSize}px !important;
                margin-right: 6px !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .post-list-content {
                margin-left: 6px !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .nsk-badge,
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .role-tag {
                font-size: ${infoFontSize}px !important;
                padding: 1px 4px !important;
                margin: 0 2px !important;
                line-height: 1.1 !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .content-info,
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .post-meta-info {
                margin-top: 1px !important;
                gap: 3px !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .content-info > span,
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .post-meta-info > span {
                margin-right: 4px !important;
            }
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item svg,
            html.nsx-compact-mode #nsk-body-left .post-list .post-list-item .iconpark-icon {
                width: ${iconSize}px !important;
                height: ${iconSize}px !important;
            }
            html.nsx-compact-mode .nsx-user-stats {
                font-size: ${infoFontSize - 1}px !important;
                margin-top: 1px !important;
                gap: 3px !important;
            }
            html.nsx-compact-mode .nsx-user-stats span {
                font-size: inherit !important;
            }
            @media screen and (max-width: 1400px) {
                html.nsx-compact-mode .nsk-container {
                    width: auto !important;
                    max-width: 98% !important;
                }
                html.nsx-compact-mode #nsk-body-left .post-list {
                    grid-template-columns: repeat(${Math.min(columns, 3)}, 1fr) !important;
                }
            }
            @media screen and (max-width: 1200px) {
                html.nsx-compact-mode #nsk-body-left .post-list {
                    grid-template-columns: repeat(${Math.min(columns, 2)}, 1fr) !important;
                }
            }
            @media screen and (max-width: 800px) {
                html.nsx-compact-mode #nsk-body-left .post-list {
                    grid-template-columns: 1fr !important;
                }
                html.nsx-compact-mode #nsk-head .search-box {
                    position: static !important;
                    transform: none !important;
                    left: auto !important;
                    margin-left: auto !important;
                    flex: 0 1 auto !important;
                    transition: none !important;
                }
            }
            html.nsx-compact-mode #nsk-body-left .post-list .blocked-post,
            html.nsx-compact-mode #nsk-body-left .post-list-item.blocked-post {
                display: none !important;
            }
            
            /* 紧凑模式下调整快速导航按钮位置，根据容器宽度动态计算 */
            html.nsx-compact-mode #fast-nav-button-group {
                right: calc(50% - ${Math.floor(containerWidthNum / 2)}px + 20px) !important;
            }
            
            /* 响应式调整 */
            @media screen and (max-width: 1400px) {
                html.nsx-compact-mode #fast-nav-button-group {
                    right: calc(50% - ${Math.floor(Math.min(containerWidthNum, 1480) / 2)}px + 20px) !important;
                }
            }
            @media screen and (max-width: 1200px) {
                html.nsx-compact-mode #fast-nav-button-group {
                    right: calc(50% - ${Math.floor(Math.min(containerWidthNum, 1280) / 2)}px + 20px) !important;
                }
            }
            @media screen and (max-width: 800px) {
                html.nsx-compact-mode #fast-nav-button-group {
                    right: 30px !important;
                }
            }
        `;
    };

    const applyCompactModeStyleFromConfig = (config, options = {}) => {
        const { delayReveal = false } = options;
        if (!config) {
            const existing = document.getElementById(COMPACT_MODE_STYLE_ID);
            if (existing) existing.remove();
            removeCompactPendingClass();
            return;
        }
        const style = ensureStyleElement(COMPACT_MODE_STYLE_ID);
        style.textContent = buildCompactModeCSS(config);
        if (!delayReveal) {
            requestAnimationFrame(removeCompactPendingClass);
        }
    };

    const injectBaseUtilityStyles = (() => {
        let injected = false;
        return () => {
            if (injected) return;
            injected = true;
            GM_addStyle(`
                html.nsx-hide-footer footer {
                    display: none !important;
                }
                html.nsx-hide-post-category .post-category,
                html.nsx-hide-post-category a.info-item.post-category {
                    display: none !important;
                }
                html.nsx-hide-post-info .post-info {
                    display: none !important;
                }
                html.nsx-hide-topic-carousel .topic-carousel-wrapper {
                    display: none !important;
                }
                html.nsx-body-hidden,
                body.nsx-body-hidden {
                    visibility: hidden !important;
                }
                .nsx-right-panel-highlight {
                    background-color: #ffeb3b !important;
                    color: #000 !important;
                    padding: 1px 2px !important;
                    border-radius: 2px !important;
                    font-weight: inherit !important;
                    text-decoration: inherit !important;
                    display: inline !important;
                }
                body.dark-layout .nsx-right-panel-highlight {
                    background-color: #f57f17 !important;
                    color: #fff !important;
                }
                /* 确保在链接中也能正确显示 */
                a .nsx-right-panel-highlight,
                .post-title .nsx-right-panel-highlight,
                .post-title a .nsx-right-panel-highlight,
                mark.nsx-right-panel-highlight {
                    background-color: #ffeb3b !important;
                    color: #000 !important;
                    padding: 1px 2px !important;
                    border-radius: 2px !important;
                    display: inline !important;
                }
                body.dark-layout a .nsx-right-panel-highlight,
                body.dark-layout .post-title .nsx-right-panel-highlight,
                body.dark-layout .post-title a .nsx-right-panel-highlight,
                body.dark-layout mark.nsx-right-panel-highlight {
                    background-color: #f57f17 !important;
                    color: #fff !important;
                }
                .nsx-highlight-input-panel textarea {
                    font-family: inherit;
                    width: 100%;
                    box-sizing: border-box;
                }
                .nsx-highlight-input-panel label {
                    user-select: none;
                }
                .nsx-highlight-input-panel code {
                    background-color: rgba(0, 0, 0, 0.05);
                    border-radius: 3px;
                    padding: 2px 4px;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                    font-size: 11px;
                    color: #e83e8c;
                }
                body.dark-layout .nsx-highlight-input-panel code {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: #ff6b9d;
                }
            `);
        };
    })();

    // 早期注入紧凑模式样式，避免页面闪烁
    // 在脚本最开始就读取配置并注入样式
    const getStoredSettings = () => {
        try {
            const stored = GM_getValue('settings');
            return stored || null;
        } catch (e) {
            return null;
        }
    };

    const getCompactModeConfig = () => {
        const stored = getStoredSettings();
        if (!stored) return normalizeCompactConfig({ ...DEFAULT_COMPACT_MODE });
        const compactMode = stored.compact_mode ?? {};
        if (compactMode.enabled === false) return null;
        return normalizeCompactConfig({ ...DEFAULT_COMPACT_MODE, ...compactMode });
    };

    const getVisitedLinksStoredConfig = () => {
        const stored = getStoredSettings();
        if (!stored) return null;
        const cfg = stored.visited_links || {};
        if (cfg.enabled === false) return null;
        return {
            lightLink: (cfg.link_color || '').trim(),
            lightVisited: (cfg.visited_color || '').trim() || '#afb9c1',
            darkLink: (cfg.dark_link_color || '').trim(),
            darkVisited: (cfg.dark_visited_color || '').trim() || cfg.visited_color || '#393f4e'
        };
    };

    const getCustomBackgroundStoredConfig = () => {
        const stored = getStoredSettings();
        if (!stored) return null;
        const cfg = stored.custom_background || {};
        if (cfg.enabled === false || !cfg.url) return null;
        return {
            url: cfg.url,
            repeat: cfg.repeat || 'repeat',
            position: cfg.position || 'center',
            size: cfg.size || 'cover',
            attachment: cfg.attachment || 'scroll'
        };
    };

    const getHeaderOpacityStoredConfig = () => {
        const stored = getStoredSettings();
        if (!stored) return null;
        return stored.header_opacity || null;
    };

    const getFrameOpacityStoredConfig = () => {
        const stored = getStoredSettings();
        if (!stored) return null;
        return stored.frame_opacity || null;
    };

    const applyEarlyVisibilityClasses = () => {
        const stored = getStoredSettings();
        if (!stored) return;
        if (stored.hide_footer?.enabled) toggleRootClass('nsx-hide-footer', true);
        if (stored.hide_post_category?.enabled) toggleRootClass('nsx-hide-post-category', true);
        if (stored.hide_post_info?.enabled) toggleRootClass('nsx-hide-post-info', true);
        if (stored.hide_topic_carousel?.enabled) toggleRootClass('nsx-hide-topic-carousel', true);
        if (stored.remove_promotions?.enabled) toggleRootClass('nsx-remove-promotions', true);
        if (stored.visited_links?.hide_visited) toggleRootClass('nsx-hide-visited', true);
    };

    const applyEarlyVisitedLinksStyle = () => {
        const config = getVisitedLinksStoredConfig();
        if (!config) return;
        applyVisitedLinkStyle(config);
    };

    const applyEarlyCustomBackgroundStyle = () => {
        const config = getCustomBackgroundStoredConfig();
        if (!config) return;
        applyCustomBackgroundStyle(config);
    };

    const applyEarlyHeaderOpacityStyle = () => {
        const config = getHeaderOpacityStoredConfig();
        if (!config || config.enabled !== true) return;
        toggleRootClass('nsx-header-opacity', true);
        applyHeaderOpacityCSS(config);
    };

    const applyEarlyFrameOpacityStyle = () => {
        const config = getFrameOpacityStoredConfig();
        if (!config || config.enabled !== true) return;
        toggleRootClass('nsx-frame-opacity', true);
        applyFrameOpacityCSS(config);
    };

    // 立即注入早期样式
    injectBaseUtilityStyles();

    const injectEarlyCompactModeStyle = () => {
        const overlaySettings = getOverlayStoredSettings();
        const overlayEnabled = overlaySettings.enabled;
        if (overlayEnabled) {
            createInitialOverlay(null, true);
        } else {
            removeInitialOverlay();
        }
        const config = getCompactModeConfig();
        if (!config) {
            removeCompactPendingClass();
            return;
        }
        addCompactPendingClass();
        toggleRootClass('nsx-compact-mode', true);
        applyCompactModeStyleFromConfig(config, { delayReveal: overlayEnabled });
        if (overlayEnabled) {
            scheduleRemoveInitialOverlay(overlaySettings.duration, true);
        }
    };

    // 立即执行
    injectEarlyCompactModeStyle();
    applyEarlyVisibilityClasses();
    applyEarlyVisitedLinksStyle();
    applyEarlyCustomBackgroundStyle();
    applyEarlyHeaderOpacityStyle();
    applyEarlyFrameOpacityStyle();

    const onDocumentReady = (fn) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    };

    class BroadcastManager {
        static instances = new Map();

        constructor(channelName = "nsx_channel") {
            if (BroadcastManager.instances.has(channelName)) {
                return BroadcastManager.instances.get(channelName);
            }

            this.channelName = channelName;
            this.myId = `${Date.now()}-${Math.random()}`;
            this.receivers = [];
            this.ch = new BroadcastChannel(channelName);
            this.KEY = `only_last_tab_${channelName}`;

            // 广播接收
            this.ch.onmessage = e => this.receivers.forEach(fn => fn(e.data));

            // 主控权管理
            localStorage.setItem(this.KEY, this.myId);
            this.updateActive();

            // 事件监听
            addEventListener("storage", e => {
                if (e.key === this.KEY) {
                    e.newValue || localStorage.setItem(this.KEY, this.myId);
                    this.updateActive();
                }
            });

            addEventListener("beforeunload", () => {
                this.active && localStorage.removeItem(this.KEY);
            });

            BroadcastManager.instances.set(channelName, this);
        }

        updateActive() {
            this.active = localStorage.getItem(this.KEY) === this.myId;
        }

        registerReceiver(fn) {
            this.receivers.push(fn);
        }

        broadcast(data) {
            const message = { sender: this.myId, data };
            this.ch.postMessage(message);
            this.receivers.forEach(fn => fn(message));
        }

        startTask(taskFn, interval) {
            setInterval(async () => {
                if (this.active) {
                    try {
                        this.broadcast(await taskFn());
                    } catch (err) {
                        // console.error(`[Tab ${this.myId}] 任务出错:`, err);
                    }
                }
            }, interval);
        }
    }

    const util = {
        clog:(c) => {
            // console.group(`%c %c [${name}]-v${version} by ${author}`, `background:url(${icon}) center/12px no-repeat;padding:3px`, "");
            // console.log(c);
            // console.groupEnd();
        },
        getValue: (name, defaultValue) => GM_getValue(name, defaultValue),
        setValue: (name, value) => GM_setValue(name, value),
        sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.head.querySelector(`#${id}`);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.head.appendChild(style);
        },
        removeStyle(id,tag){
            tag = tag || 'style';
            let doc = document, styleDom = doc.head.querySelector(`#${id}`);
            if (styleDom) { doc.head.removeChild(styleDom) };
        },
        getAttrsByPrefix(element, prefix) {
            return Array.from(element.attributes).reduce((acc, { name, value }) => {
                if (name.startsWith(prefix)) acc[name] = value;
                return acc;
            }, {});
        },
        data(element, key, value) {
            if (arguments.length < 2) return undefined;
            if (value !== undefined) element.dataset[key] = value;
            return element.dataset[key];
        },
        async post(url, data, headers, responseType = 'json') {
            return this.fetchData(url, 'POST', data, headers, responseType);
        },
        async get(url, headers, responseType = 'json') {
            return this.fetchData(url, 'GET', null, headers, responseType);
        },
        async fetchData(url, method='GET', data=null, headers={}, responseType='json') {
            const options = {
                method,
                headers: { 'Content-Type':'application/json',...headers},
                body: data ? JSON.stringify(data) : undefined
            };
            const response = await fetch(url.startsWith("http") ? url : BASE_URL + url, options);
            const result = await response[responseType]().catch(() => null);
            return response.ok ? result : Promise.reject(result);
        },
        getCurrentDate() {
            const localTimezoneOffset = (new Date()).getTimezoneOffset();
            const beijingOffset = 8 * 60;
            const beijingTime = new Date(Date.now() + (localTimezoneOffset + beijingOffset) * 60 * 1000);
            const timeNow = `${beijingTime.getFullYear()}/${(beijingTime.getMonth() + 1)}/${beijingTime.getDate()}`;
            return timeNow;
        },
        createElement(tagName, options = {}, childrens = [], doc = document, namespace = null) {
            if (Array.isArray(options)) {
                if (childrens.length !== 0) {
                    throw new Error("If options is an array, childrens should not be provided.");
                }
                childrens = options;
                options = {};
            }

            const { staticClass = '', dynamicClass = '', attrs = {}, on = {} } = options;

            const ele = namespace ? doc.createElementNS(namespace, tagName) : doc.createElement(tagName);

            if (staticClass) {
                staticClass.split(' ').forEach(cls => ele.classList.add(cls.trim()));
            }
            if (dynamicClass) {
                dynamicClass.split(' ').forEach(cls => ele.classList.add(cls.trim()));
            }

            Object.entries(attrs).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.entries(value).forEach(([styleKey, styleValue]) => {
                        ele.style[styleKey] = styleValue;
                    });
                } else {
                    if (value !== undefined) ele.setAttribute(key, value);
                }
            });

            Object.entries(on).forEach(([event, handler]) => {
                ele.addEventListener(event, handler);
            });

            childrens.forEach(child => {
                if (typeof child === 'string') {
                    child = doc.createTextNode(child);
                }
                ele.appendChild(child);
            });

            return ele;
        },
        b64DecodeUnicode(str) {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(atob(str).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
    };

    const opts = {
        curSite : SITE_MAP[location.host] || null,
        post: {
            pathPattern: /^\/(categories\/|page|award|search|$)/,
            scrollThreshold: 1500,
            nextPagerSelector: '.nsk-pager a.pager-next',
            postListSelector: 'ul.post-list:not(.topic-carousel-panel)',
            topPagerSelector: 'div.nsk-pager.pager-top',
            bottomPagerSelector: 'div.nsk-pager.pager-bottom',
        },
        comment: {
            pathPattern: /^\/post-/,
            scrollThreshold: 690,
            nextPagerSelector: '.nsk-pager a.pager-next',
            postListSelector: 'ul.comments',
            topPagerSelector: 'div.nsk-pager.post-top-pager',
            bottomPagerSelector: 'div.nsk-pager.post-bottom-pager',
        },
        settings:{
            "version": version,
            "sign_in": {"ns":{ "enabled": false, "method": 0, "last_date": "", "ignore_date": "" },"df":{ "enabled": false, "method": 0, "last_date": "", "ignore_date": "" }},
            "signin_tips": { "enabled": true },
            "re_signin": { "enabled": true },
            "auto_jump_external_links": { "enabled": true },
            "loading_post": { "enabled": true },
            "loading_comment": { "enabled": true },
            "quick_comment": { "enabled": true },
            "open_post_in_new_tab": { "enabled": false },
            "block_members": { "enabled": true },
            "block_posts": { "enabled": true,"keywords":[] },
            "block_categories": { "enabled": false, "categories": [] },
            "level_tag": { "enabled": true, "low_lv_alarm":false, "low_lv_max_days":30 },
            "show_all_users_stats": { "enabled": false, "position": "below" },
            "code_highlight": { "enabled": true },
            "image_slide":{ "enabled":true },
            "visited_links":{ "enabled": true, "link_color":"","visited_color":"","dark_link_color":"","dark_visited_color":"", "hide_visited": false },
            "user_card_ext": { "enabled":true },
            "compact_mode": {
                ...DEFAULT_COMPACT_MODE
            },
            "custom_background": {
                "enabled": false,
                "url": "",
                "repeat": "repeat",
                "position": "center",
                "size": "cover",
                "attachment": "scroll"
            },
            "merge_category_to_nav": {
                "enabled": false
            },
            "remove_promotions": {
                "enabled": false
            },
            "header_opacity": {
                "enabled": false,
                "value": 0.92,
                "effect": true,
                "blur": 16,
                "saturate": 180
            },
            "frame_opacity": {
                "enabled": false,
                "value": 0.95,
                "blur_enabled": true,
                "saturate_enabled": true,
                "blur": 12,
                "saturate": 180
            },
            "default_avatar": {
                "enabled": false,
                "url": "",
                "auto_detect": true
            },
            "loading_overlay": {
                "enabled": true,
                "duration": INITIAL_OVERLAY_DURATION_DEFAULT
            },
            "typography": {
                "title": {
                    "enabled": false,
                    "fontFamily": "",
                    "fontSize": "",
                    "color": "",
                    "fontStyle": "",
                    "letterSpacing": "",
                    "ligatures": ""
                },
                "tag": {
                    "enabled": false,
                    "fontFamily": "",
                    "fontSize": "",
                    "color": "",
                    "fontStyle": "",
                    "letterSpacing": "",
                    "ligatures": ""
                },
                "meta": {
                    "enabled": false,
                    "fontFamily": "",
                    "fontSize": "",
                    "color": "",
                    "fontStyle": "",
                    "letterSpacing": "",
                    "ligatures": ""
                },
                "content": {
                    "enabled": false,
                    "fontFamily": "",
                    "fontSize": "",
                    "color": "",
                    "fontStyle": "",
                    "letterSpacing": "",
                    "ligatures": ""
                }
            },
            "hide_user_stats_panel": {
                "enabled": false
            },
            "hide_footer": {
                "enabled": false
            },
            "hide_post_category": {
                "enabled": false
            },
            "hide_post_info": {
                "enabled": false
            },
            "hide_topic_carousel": {
                "enabled": false
            },
            "post_sort": {
                "enabled": false,
                "mode": "none",
                "visited_to_bottom": false
            },
            "right_panel_highlight": {
                "enabled": false,
                "keywords": []
            }
        }
    };
    onDocumentReady(() => {
        layui.use(function () {
        const layer = layui.layer;
        const dropdown = layui.dropdown;
        const message = {
            info: (text) => message.__msg(text, { "background-color": "#4D82D6" }),
            success: (text) => message.__msg(text, { "background-color": "#57BF57" }),
            warning: (text) => message.__msg(text, { "background-color": "#D6A14D" }),
            error: (text) => message.__msg(text, { "background-color": "#E1715B" }),
            __msg: (text, style) => { let index = layer.msg(text, { offset: 't', area: ['100%', 'auto'], anim: 'slideDown' }); layer.style(index, Object.assign({ opacity: 0.9 }, style)); }
        };

        const Config = {
            // 初始化配置数据
            initializeConfig() {
                const defaultConfig = opts.settings;
                if (!util.getValue('settings')) {
                    util.setValue('settings', defaultConfig);
                    return;
                }
                if(this.getConfig('version')===version) return;
                // 从存储中获取当前配置
                let storedConfig = util.getValue('settings');

                // 递归地删除不在默认配置中的项
                const cleanDefaults = (stored, defaults) => {
                    Object.keys(stored).forEach(key => {
                        if (defaults[key] === undefined) {
                            delete stored[key]; // 如果默认配置中没有这个键，删除它
                        } else if (typeof stored[key] === 'object' && stored[key] !== null && !(stored[key] instanceof Array)) {
                            cleanDefaults(stored[key], defaults[key]); // 递归检查
                        }
                    });
                };

                // 递归地将默认配置中的新项合并到存储的配置中
                const mergeDefaults = (stored, defaults) => {
                    Object.keys(defaults).forEach(key => {
                        if (typeof defaults[key] === 'object' && defaults[key] !== null && !(defaults[key] instanceof Array)) {
                            if (!stored[key]) stored[key] = {};
                            mergeDefaults(stored[key], defaults[key]);
                        } else {
                            if (stored[key] === undefined) {
                                stored[key] = defaults[key];
                            }
                        }
                    });
                };

                mergeDefaults(storedConfig, defaultConfig);
                //...这里将旧设置项的值迁移到新设置项
                cleanDefaults(storedConfig, defaultConfig);
                storedConfig.version = version;
                util.setValue('settings',storedConfig);
            },updateConfig(path, value) {
                let config = util.getValue('settings');
                if (!config) {
                    config = opts.settings;
                    util.setValue('settings', config);
                }
                let keys = path.split('.');
                let lastKey = keys.pop();
                let lastObj = keys.reduce((obj, key) => {
                    if (!obj[key]) {
                        obj[key] = {};
                    }
                    return obj[key];
                }, config);
                lastObj[lastKey] = value;
                util.setValue('settings', config);
            },            getConfig(path) {
                let config = GM_getValue('settings');
                if (!config) return undefined;
                let keys = path.split('.');
                let result = keys.reduce((obj, key) => {
                    if (obj === null || obj === undefined) return undefined;
                    return obj[key];
                }, config);
                return result;
            }
        };

        const getRuntimeOverlaySettings = () => ({
            enabled: Config.getConfig('loading_overlay.enabled') !== false,
            duration: parseInt(Config.getConfig('loading_overlay.duration'), 10) || INITIAL_OVERLAY_DURATION_DEFAULT
        });

        const FeatureFlags={
            isEnabled(featureName) {
                if (Config.getConfig(featureName)) {
                    return Config.getConfig(`${featureName}.enabled`);
                } else {
                    // console.error(`Feature '${featureName}' does not exist.`);
                    return false;
                }
            }
        };

        const main = {
            loginStatus: false,
            blockKeywordRules: [],
            blockedCategorySet: new Set(),
            rightPanelHighlightRules: [],
            rightPanelHighlightObserver: null,
            avatarObserver: null,
            avatarDefaultCache: new Map(),
            //检查是否登陆
            checkLogin() {
                if (unsafeWindow.__config__ && unsafeWindow.__config__.user) {
                    this.loginStatus = true;
                    util.clog(`当前登录用户 ${unsafeWindow.__config__.user.member_name} (ID ${unsafeWindow.__config__.user.member_id})`);
                }
            },
            // 自动签到
            autoSignIn(rand) {
                if(!FeatureFlags.isEnabled(`sign_in.${opts.curSite.code}`)) return;

                if (!this.loginStatus) return
                if (Config.getConfig(`sign_in.${opts.curSite.code}.enabled`) !== true) return;

                rand = rand || (Config.getConfig(`sign_in.${opts.curSite.code}.method`) === 1);

                let timeNow = util.getCurrentDate(),
                    timeOld = Config.getConfig(`sign_in.${opts.curSite.code}.last_date`);
                if (!timeOld || timeOld != timeNow) { // 是新的一天
                    Config.updateConfig(`sign_in.${opts.curSite.code}.last_date`, timeNow);
                    this.signInRequest(rand);
                }
            },
            // 重新签到
            reSignIn() {
                if (!this.loginStatus) return;
                if (Config.getConfig(`sign_in.${opts.curSite.code}.enabled`) !== true) {
                    unsafeWindow.mscAlert('提示', '自动签到已关闭，不支持重新签到！');
                    return;
                }

                Config.updateConfig(`sign_in.${opts.curSite.code}.last_date`, '1753/1/1');
                location.reload();
            },
            addSignTips() {
                if(!FeatureFlags.isEnabled('signin_tips')) return;

                if (!this.loginStatus) return
                if (Config.getConfig(`sign_in.${opts.curSite.code}.enabled`) === true) return;

                const timeNow = util.getCurrentDate();
                const timeIgnore = Config.getConfig(`sign_in.${opts.curSite.code}.ignore_date`);
                const timeOld = Config.getConfig(`sign_in.${opts.curSite.code}.last_date`);

                if (timeNow === timeIgnore || timeNow === timeOld) return;

                const _this = this;
                let tip = util.createElement("div", { staticClass: 'nsplus-tip' });
                let tip_p = util.createElement('p');
                tip_p.innerHTML = '今天你还没有签到哦！&emsp;【<a class="sign_in_btn" data-rand="true" href="javascript:;">随机抽个鸡腿</a>】&emsp;【<a class="sign_in_btn" data-rand="false" href="javascript:;">只要5个鸡腿</a>】&emsp;【<a id="sign_in_ignore" href="javascript:;">今天不再提示</a>】';
                tip.appendChild(tip_p);
                tip.querySelectorAll('.sign_in_btn').forEach(function (item) {
                    item.addEventListener("click", function (e) {
                        const rand = util.data(this, 'rand');
                        _this.signInRequest(rand);
                        tip.remove();
                        Config.updateConfig(`sign_in.${opts.curSite.code}.last_date`, timeNow);
                    })
                });
                tip.querySelector('#sign_in_ignore').addEventListener("click", function (e) {
                    tip.remove();
                    Config.updateConfig(`sign_in.${opts.curSite.code}.ignore_date`, timeNow);
                });

                document.querySelector('header').append(tip);
            },
            async signInRequest(rand) {
                await util.post('/api/attendance?random=' + (rand || false), {}, { "Content-Type": "application/json" }).then(json => {
                    if (json.success) {
                        message.success(`签到成功！今天午饭+${json.gain}个鸡腿; 积攒了${json.current}个鸡腿了`);
                    }
                    else {
                        message.info(json.message);
                    }
                }).catch(error => {
                    message.info(error.message || "发生未知错误");
                    util.clog(error);
                });
                util.clog(`[${name}] 签到完成`);
            },
            is_show_quick_comment: false,
            quickComment() {
                if (!this.loginStatus || !opts.comment.pathPattern.test(location.pathname)) return;
                if (Config.getConfig('loading_comment.enabled') === false) return;

                const _this = this;


                const onClick = (e) => {
                    if (_this.is_show_quick_comment) {
                        return;
                    }
                    e.preventDefault();

                    const mdEditor = document.querySelector('.md-editor');
                    const clientHeight = document.documentElement.clientHeight, clientWidth = document.documentElement.clientWidth;
                    const mdHeight = mdEditor.clientHeight, mdWidth = mdEditor.clientWidth;
                    const top = (clientHeight / 2) - (mdHeight / 2), left = (clientWidth / 2) - (mdWidth / 2);
                    mdEditor.style.cssText = `position: fixed; top: ${top}px; left: ${left}px; margin: 30px 0px; width: 100%; max-width: ${mdWidth}px; z-index: 999;`;
                    const moveEl = mdEditor.querySelector('.tab-select.window_header');
                    moveEl.style.cursor = "move";
                    moveEl.addEventListener('mousedown', startDrag);
                    addEditorCloseButton();
                    _this.is_show_quick_comment = true;
                };
                const commentDiv = document.querySelector('#fast-nav-button-group #back-to-parent').cloneNode(true);
                commentDiv.id = 'back-to-comment';
                commentDiv.innerHTML = '<svg class="iconpark-icon" style="width: 24px; height: 24px;"><use href="#comments"></use></svg>';
                commentDiv.addEventListener("click", onClick);
                document.querySelector('#back-to-parent').before(commentDiv);
                document.querySelectorAll('.nsk-post .comment-menu,.comment-container .comments').forEach(x=>x.addEventListener("click",(event) =>{ if(!["引用", "回复", "编辑"].includes(event.target.textContent)) return; onClick(event);},true));//使用冒泡法给按钮引用、回复添加事件

                function addEditorCloseButton() {
                    const fullScreenToolbar = document.querySelector('#editor-body .window_header > :last-child');
                    const cloneToolbar = fullScreenToolbar.cloneNode(true);
                    cloneToolbar.setAttribute('title', '关闭');
                    cloneToolbar.querySelector('span').classList.replace('i-icon-full-screen-one', 'i-icon-close');
                    cloneToolbar.querySelector('span').innerHTML = '<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M8 8L40 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 40L40 8" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
                    cloneToolbar.addEventListener("click", function (e) {
                        const mdEditor = document.querySelector('.md-editor');
                        mdEditor.style = "";
                        const moveEl = mdEditor.querySelector('.tab-select.window_header');
                        moveEl.style.cursor = "";
                        moveEl.removeEventListener('mousedown', startDrag);

                        this.remove();
                        _this.is_show_quick_comment = false;
                    });
                    fullScreenToolbar.after(cloneToolbar);
                }
                function startDrag(event) {
                    if (event.button !== 0) return;

                    const draggableElement = document.querySelector('.md-editor');
                    const parentMarginTop = parseInt(window.getComputedStyle(draggableElement).marginTop);
                    const initialX = event.clientX - draggableElement.offsetLeft;
                    const initialY = event.clientY - draggableElement.offsetTop + parentMarginTop;
                    document.onmousemove = function (event) {
                        const newX = event.clientX - initialX;
                        const newY = event.clientY - initialY;
                        draggableElement.style.left = newX + 'px';
                        draggableElement.style.top = newY + 'px';
                    };
                    document.onmouseup = function () {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                }
            },
            // 切换官方打开链接设置
            async switchOpenPostInNewTab(stateName, states){
                try {
                    unsafeWindow.indexedDB.open('ns-preference-db').onsuccess = e => {
                        const db = e.target.result;
                        const store = db.transaction('ns-preference-store', 'readwrite').objectStore('ns-preference-store');
                        store.get('configuration').onsuccess = e => {
                            const cfg = e.target.result || { openPostInNewPage: false };
                            cfg.openPostInNewPage = !cfg.openPostInNewPage;
                            store.put(cfg, 'configuration');
                            Config.updateConfig(`${stateName}.enabled`, cfg.openPostInNewPage);
                            unsafeWindow.mscAlert(`已${cfg.openPostInNewPage?'开启':'关闭'}新标签页打开链接`);
                        };
                    };
                } catch (error) {
                    // console.error(error);
                }
            },
            // 强制新标签页打开帖子链接
            enforceNewTabForPosts() {
                // 使用事件委托监听所有链接点击
                const clickHandler = function(e) {
                    // 检查配置是否启用（每次检查以确保实时性，但只在启用时才进行后续处理）
                    if (!Config.getConfig('open_post_in_new_tab.enabled')) return;

                    const link = e.target.closest('a');
                    if (!link || !link.href) return;

                    // 检查是否是帖子链接
                    const href = link.href;
                    const isPostLink = /\/post-\d+/.test(href) && href.startsWith(BASE_URL);

                    // 排除特殊链接（如跳转链接、锚点、已有target的链接等）
                    if (link.hasAttribute('data-no-instant') ||
                        link.href.includes('/jump?to=') ||
                        link.href.startsWith('#') ||
                        link.target === '_blank') {
                        return;
                    }

                    // 如果是帖子链接，强制在新标签页打开
                    if (isPostLink) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(link.href, '_blank');
                    }
                };
                document.addEventListener('click', clickHandler, true); // 使用捕获阶段确保优先执行
            },
            //自动点击跳转页链接
            autoJump() {
                document.querySelectorAll('a[href*="/jump?to="]').forEach(link => {
                    try {
                        const urlObj = new URL(link.href);
                        const encodedUrl = urlObj.searchParams.get('to');
                        if (encodedUrl) {
                            const decodedUrl = decodeURIComponent(encodedUrl);
                            link.href = decodedUrl;
                        }
                    } catch (e) {
                        // console.error('处理链接时出错:', e);
                    }
                });
                if (!/^\/jump/.test(location.pathname)) return;
                document.querySelector('.btn').click();
            },
            refreshBlockKeywordRules() {
                const stored = Config.getConfig('block_posts.keywords');
                const list = Array.isArray(stored) ? stored : [];
                this.blockKeywordRules = list.map(rule => {
                    if (!rule) return null;
                    if (typeof rule === 'string') {
                        const value = rule.trim();
                        if (!value) return null;
                        return { type: 'text', value, lower: value.toLowerCase() };
                    }
                    const type = rule.type || 'text';
                    if (type === 'regex') {
                        const pattern = rule.value || rule.pattern || '';
                        if (!pattern) return null;
                        const flags = rule.flags || '';
                        try {
                            const regex = new RegExp(pattern, flags || 'i');
                            return { type: 'regex', regex, value: pattern, flags };
                        } catch (err) {
                            // console.warn('[NodeSeek X] 无效的正则规则：', pattern, err);
                            return null;
                        }
                    }
                    const value = (rule.value || '').trim();
                    if (!value) return null;
                    return { type: 'text', value, lower: value.toLowerCase() };
                }).filter(Boolean);
            },
            getBlockKeywordInputValue() {
                const stored = Config.getConfig('block_posts.keywords');
                if (!Array.isArray(stored) || stored.length === 0) return '';
                return stored.map(rule => {
                    if (!rule) return '';
                    if (typeof rule === 'string') return rule;
                    if (rule.type === 'regex') {
                        const flags = rule.flags || '';
                        return `/${rule.value || ''}/${flags}`;
                    }
                    return rule.value || '';
                }).filter(Boolean).join('\n');
            },
            parseBlockKeywordInput(inputValue) {
                if (!inputValue) return [];
                return inputValue.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
                    if (line.startsWith('/') && line.lastIndexOf('/') > 0) {
                        const lastSlash = line.lastIndexOf('/');
                        const pattern = line.slice(1, lastSlash);
                        const flags = line.slice(lastSlash + 1);
                        try {
                            new RegExp(pattern, flags || 'i');
                            return { type: 'regex', value: pattern, flags };
                        } catch (err) {
                            // console.warn('[NodeSeek X] 忽略无效正则：', line, err);
                            return null;
                        }
                    }
                    return { type: 'text', value: line };
                }).filter(Boolean);
            },
            shouldBlockTitle(title) {
                if (!this.blockKeywordRules || this.blockKeywordRules.length === 0) return false;
                const lowerTitle = title.toLowerCase();
                return this.blockKeywordRules.some(rule => {
                    if (rule.type === 'regex') {
                        try {
                            return rule.regex.test(title);
                        } catch (err) {
                            // console.warn('[NodeSeek X] 正则匹配失败：', rule, err);
                            return false;
                        }
                    }
                    return lowerTitle.includes(rule.lower);
                });
            },
            blockPost(ele) {
                if (Config.getConfig('block_posts.enabled') === false) return;
                if (!this.blockKeywordRules || this.blockKeywordRules.length === 0) return;
                ele = ele || document;
                ele.querySelectorAll('.post-title a[href], .post-list-item a.post-title').forEach(item => {
                    const title = (item.textContent || '').trim();
                    if (!title || !this.shouldBlockTitle(title)) return;
                    const li = item.closest('.post-list-item');
                    if (li) {
                        li.classList.add('blocked-post');
                    } else {
                        const fallback = item.closest('li, article, .post-card, .post-item, .post, .post-list-content') || item.parentElement;
                        fallback?.classList.add('blocked-post');
                    }
                });
            },
            refreshBlockedCategories() {
                const stored = Config.getConfig('block_categories.categories');
                const list = Array.isArray(stored) ? stored : [];
                this.blockedCategorySet = new Set(list.map(item => (item || '').trim().toLowerCase()).filter(Boolean));
            },
            getBlockedCategoryInputValue() {
                const stored = Config.getConfig('block_categories.categories');
                if (!Array.isArray(stored) || stored.length === 0) return '';
                return stored.join('\n');
            },
            parseBlockedCategoryInput(inputValue) {
                if (!inputValue) return [];
                return inputValue.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
            },
            blockPostsByCategory(ele) {
                if (Config.getConfig('block_categories.enabled') === false) return;
                if (!this.blockedCategorySet || this.blockedCategorySet.size === 0) return;
                ele = ele || document;
                ele.querySelectorAll('.post-list-item').forEach(item => {
                    if (item.classList.contains('blocked-post')) return;
                    const categoryAnchor = item.querySelector('.post-category');
                    if (!categoryAnchor) return;
                    const text = (categoryAnchor.textContent || '').trim().toLowerCase();
                    if (this.blockedCategorySet.has(text)) {
                        item.classList.add('blocked-post');
                    }
                });
            },
            togglePromotions() {
                const enabled = Config.getConfig('remove_promotions.enabled') === true;
                toggleRootClass('nsx-remove-promotions', enabled);
            },
            async isDefaultAvatar(img) {
                const config = Config.getConfig('default_avatar');
                if (!config || config.auto_detect === false) return true;
                const src = img.currentSrc || img.src;
                if (this.avatarDefaultCache.has(src)) {
                    return this.avatarDefaultCache.get(src);
                }
                try {
                    const response = await fetch(src, { credentials: 'include', headers: { 'Accept': 'text/html' } });
                    if (!response.ok) throw new Error(response.status);
                    const text = await response.text();
                    const isDefault = /vue-color-avatar/i.test(text);
                    this.avatarDefaultCache.set(src, isDefault);
                    return isDefault;
                } catch (err) {
                    // console.warn('[NodeSeek X] avatar detect failed', err);
                    this.avatarDefaultCache.set(src, false);
                    return false;
                }
            },
            replaceDefaultAvatars(target = document) {
                const config = Config.getConfig('default_avatar');
                if (!config || config.enabled !== true) {
                    target.querySelectorAll('img.avatar-normal[data-nsx-original-avatar]').forEach(img => {
                        img.src = img.dataset.nsxOriginalAvatar;
                        delete img.dataset.nsxOriginalAvatar;
                        delete img.dataset.nsxAvatarProcessed;
                    });
                    return;
                }
                const fallbackUrl = (config.url || '').trim();
                if (!fallbackUrl) return;
                const autoDetect = config.auto_detect !== false;
                const process = (img) => {
                    if (img.dataset.nsxAvatarProcessed) return;
                    const finalize = (shouldReplace) => {
                        if (shouldReplace) {
                            if (!img.dataset.nsxOriginalAvatar) {
                                img.dataset.nsxOriginalAvatar = img.src;
                            }
                            img.src = fallbackUrl;
                            img.dataset.nsxAvatarProcessed = '1';
                        } else {
                            img.dataset.nsxAvatarProcessed = 'checked';
                        }
                    };
                    const runDetect = () => {
                        if (!autoDetect) {
                            finalize(true);
                            return;
                        }
                        this.isDefaultAvatar(img).then(isDefault => finalize(isDefault));
                    };
                    if (img.complete && img.naturalWidth) {
                        runDetect();
                    } else {
                        img.addEventListener('load', runDetect, { once: true });
                    }
                };
                target.querySelectorAll('img.avatar-normal').forEach(process);
            },
            startAvatarObserver() {
                if (this.avatarObserver) this.avatarObserver.disconnect();
                if (!document.body) return;
                this.avatarObserver = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return;
                            if (node.matches && node.matches('img.avatar-normal')) {
                                this.replaceDefaultAvatars(node);
                            } else if (node.querySelector) {
                                this.replaceDefaultAvatars(node);
                            }
                        });
                    });
                });
                this.avatarObserver.observe(document.body, { childList: true, subtree: true });
            },
            updateHeaderOpacityStyle() {
                const config = Config.getConfig('header_opacity');
                if (!config || config.enabled !== true) {
                    toggleRootClass('nsx-header-opacity', false);
                    document.getElementById(HEADER_OPACITY_STYLE_ID)?.remove();
                    return;
                }
                toggleRootClass('nsx-header-opacity', true);
                applyHeaderOpacityCSS(config);
            },
            updateFrameOpacityStyle() {
                const config = Config.getConfig('frame_opacity');
                if (!config || config.enabled !== true) {
                    toggleRootClass('nsx-frame-opacity', false);
                    document.getElementById(FRAME_OPACITY_STYLE_ID)?.remove();
                    return;
                }
                toggleRootClass('nsx-frame-opacity', true);
                applyFrameOpacityCSS(config);
            },
            blockPostsByViewLevel(ele) {
                ele = ele || document;
                let level=0;
                if (this.loginStatus) level = unsafeWindow.__config__.user.rank;
                [...ele.querySelectorAll('.post-list-item use[href="#lock"]')].forEach(el => {
                    const n = +el.closest('span')?.textContent.match(/\d+/)?.[0] || 0;
                    if (n > level) el.closest('.post-list-item')?.classList.add('blocked-post');
                });
            },
            //屏蔽用户
            blockMemberDOMInsert() {
                if (!this.loginStatus) return;

                const _this = this;
                
                // 调整用户卡片位置，确保不会超出页面底部
                const adjustUserCardPosition = (userCard) => {
                    if (!userCard) return;
                    const rect = userCard.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const cardBottom = rect.bottom;
                    
                    // 如果卡片底部超出视口，调整位置
                    if (cardBottom > viewportHeight - 20) {
                        const currentTop = parseInt(userCard.style.top) || rect.top;
                        const cardHeight = rect.height;
                        const newTop = viewportHeight - cardHeight - 20;
                        
                        // 确保新位置不会太高（至少距离顶部100px）
                        if (newTop < 100) {
                            userCard.style.top = '100px';
                            userCard.style.maxHeight = `${viewportHeight - 120}px`;
                            userCard.style.overflowY = 'auto';
                        } else {
                            userCard.style.top = `${newTop}px`;
                        }
                    }
                };
                
                Array.from(document.querySelectorAll(".post-list .post-list-item,.content-item")).forEach((function (t, n) {
                    const r = t.querySelector('.avatar-normal');
                    if (!r) return;
                    r.addEventListener("click", (function (n) {
                        n.preventDefault();
                        let intervalId = setInterval(() => {
                            const userCard = document.querySelector('div.user-card.hover-user-card');
                            const pmButton = document.querySelector('div.user-card.hover-user-card a.btn');
                            if (userCard && pmButton) {
                                clearInterval(intervalId);
                                
                                // 调整用户卡片位置
                                adjustUserCardPosition(userCard);
                                
                                // 监听窗口大小变化和滚动，动态调整位置
                                const adjustHandler = () => adjustUserCardPosition(userCard);
                                window.addEventListener('resize', adjustHandler);
                                window.addEventListener('scroll', adjustHandler);
                                
                                // 当用户卡片消失时，移除监听器
                                const observer = new MutationObserver(() => {
                                    if (!document.contains(userCard)) {
                                        window.removeEventListener('resize', adjustHandler);
                                        window.removeEventListener('scroll', adjustHandler);
                                        observer.disconnect();
                                    }
                                });
                                observer.observe(document.body, { childList: true, subtree: true });
                                
                                const dataVAttrs = util.getAttrsByPrefix(userCard, 'data-v');
                                const userName = userCard.querySelector('a.Username').textContent;
                                dataVAttrs.style = "float:left; background-color:rgba(0,0,0,.3)";
                                const blockBtn = util.createElement("a", {
                                    staticClass: "btn", attrs: dataVAttrs, on: {
                                        click: function (e) {
                                            e.preventDefault();
                                            unsafeWindow.mscConfirm(`确定要屏蔽"${userName}"吗？`, '你可以在本站的 设置=>屏蔽用户 中解除屏蔽', function () { blockMember(userName); })
                                        }
                                    }
                                }, ["屏蔽"]);
                                pmButton.after(blockBtn);
                                
                                // 添加屏蔽按钮后，再次调整位置（因为按钮可能增加了卡片高度）
                                setTimeout(() => adjustUserCardPosition(userCard), 100);
                            }
                        }, 50);
                        // 添加超时保护，5秒后自动清理
                        setTimeout(() => clearInterval(intervalId), 5000);
                    }))
                }))
                function blockMember(userName) {
                    util.post("/api/block-list/add", { "block_member_name": userName }, { "Content-Type": "application/json" }).then(function (data) {
                        if (data.success) {
                            let msg = '屏蔽用户【' + userName + '】成功！';
                            unsafeWindow.mscAlert(msg);
                            util.clog(msg);
                        } else {
                            let msg = '屏蔽用户【' + userName + '】失败！' + data.message;
                            unsafeWindow.mscAlert(msg);
                            util.clog(msg);
                        }
                    }).catch(function (err) {
                        util.clog(err);
                    });
                }
            },
            addImageSlide() {
                if (!opts.comment.pathPattern.test(location.pathname)) return;

                const posts = document.querySelectorAll('article.post-content');
                posts.forEach(function (post, i) {
                    const images = post.querySelectorAll('img:not(.sticker)');
                    if (images.length === 0) return;

                    images.forEach(function (image, i) {
                        const newImg = image.cloneNode(true);
                        image.parentNode.replaceChild(newImg, image);
                        newImg.addEventListener('click', function (e) {
                            e.preventDefault();
                            const imgArr = Array.from(post.querySelectorAll('img:not(.sticker)'));
                            const clickedIndex = imgArr.indexOf(this);
                            const photoData = imgArr.map((img, i) => ({ alt: img.alt, pid: i + 1, src: img.src }));
                            layer.photos({ photos: { "title": "图片预览", "start": clickedIndex, "data": photoData } });
                        }, true);
                    });
                });
            },
            addLevelTag() {//添加等级标签
                if (!this.loginStatus) return;
                if (!opts.comment.pathPattern.test(location.pathname)) return;
                let _this=this;
                this.getUserInfo(unsafeWindow.__config__.postData.op.uid).then((user) => {
                    let warningInfo = '';
                    const daysDiff = Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24));
                    if (daysDiff < 30) {
                        warningInfo = `⚠️`;
                    }
                    // console.log(user);
                    let rank = _this.getRankByCoin(user.coin);
                    const span = util.createElement("span", { staticClass: `nsk-badge role-tag user-level user-lv${rank}` }, [util.createElement("span", [`${warningInfo}Lv ${rank}`])]);

                    const authorLink = document.querySelector('#nsk-body .nsk-post .nsk-content-meta-info .author-info>a');
                    if (authorLink != null) {
                        authorLink.after(span);
                    }

                    // 在 content-info 中添加用户统计信息
                    const contentInfo = document.querySelector('#nsk-body .nsk-post .nsk-content-meta-info .content-info');
                    const mainPost = document.querySelector('#nsk-body .nsk-post');
                    if (contentInfo) {
                        // 检查是否已添加过统计信息，避免重复
                        if (contentInfo.querySelector('.nsx-user-stats')) return;

                        // 获取位置设置
                        const position = Config.getConfig('show_all_users_stats.position') || 'below';

                        // 创建统计信息容器
                        const statsContainer = util.createElement("div", {
                            staticClass: "nsx-user-stats",
                            attrs: { 
                                style: position === 'right' 
                                    ? "display: inline-flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 0.9em; margin-left: 8px;" 
                                    : "margin-top: 4px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 0.9em;" 
                            }
                        }, [
                            util.createElement("span", { attrs: { title: "注册天数", style: "color: #2ea44f;" } }, [`📅 注册 ${daysDiff} 天`]),
                            util.createElement("span", { attrs: { style: "color: var(--text-tertiary-color, #ccc);" } }, ["·"]),
                            util.createElement("span", { attrs: { title: "鸡腿数量", style: "color: #ff9800;" } }, [`🍗 ${user.coin || 0}`]),
                            util.createElement("span", { attrs: { style: "color: var(--text-tertiary-color, #ccc);" } }, ["·"]),
                            util.createElement("span", { attrs: { title: "帖子数", style: "color: #2196f3;" } }, [`📝 帖子 ${user.nPost || 0}`]),
                            util.createElement("span", { attrs: { style: "color: var(--text-tertiary-color, #ccc);" } }, ["·"]),
                            util.createElement("span", { attrs: { title: "评论数", style: "color: #9c27b0;" } }, [`💬 评论 ${user.nComment || 0}`])
                        ]);

                        // 根据位置设置插入
                        if (position === 'right' && mainPost) {
                            // 插入到作者名字右边
                            const authorLink = mainPost.querySelector('.nsk-content-meta-info .author-info a');
                            if (authorLink) {
                                authorLink.after(statsContainer);
                            } else {
                                // 如果找不到作者链接，回退到下方
                                contentInfo.appendChild(statsContainer);
                            }
                        } else {
                            // 默认插入到下方
                            contentInfo.appendChild(statsContainer);
                        }
                    }
                });
            },
            getUserInfo(uid) {
                return new Promise((resolve, reject) => {
                    util.get(`/api/account/getInfo/${uid}`, {}, 'json').then((data) => {
                        if (!data.success) {
                            util.clog(data);
                            return;
                        }
                        resolve(data.detail);
                    }).catch((err) => reject(err));
                })
            },
            // 为所有用户显示统计信息
            showAllUsersStats() {
                if (!this.loginStatus) return;
                
                const _this = this;
                // 缓存用户数据，避免重复请求（Map<uid, userData>）
                if (!_this.userDataCache) {
                    _this.userDataCache = new Map();
                }
                // 记录正在请求的 UID，避免重复请求（Set<uid>）
                if (!_this.pendingUserRequests) {
                    _this.pendingUserRequests = new Set();
                }
                // 记录等待用户数据的楼层（Map<uid, Array<contentInfo>>）
                if (!_this.pendingContentItems) {
                    _this.pendingContentItems = new Map();
                }
                
                // 创建用户统计信息的辅助函数
                const createUserStats = (user, contentInfo, item) => {
                    if (!user || !contentInfo) return;
                    
                    // 获取位置设置
                    const position = Config.getConfig('show_all_users_stats.position') || 'below';
                    
                    // 检查是否已添加过统计信息
                    const existingStats = contentInfo.querySelector('.nsx-user-stats');
                    if (existingStats) {
                        // 如果位置设置改变，需要移除旧的并重新添加
                        existingStats.remove();
                    }
                    
                    // 计算注册天数
                    let daysDiff = 0;
                    if (user.created_at) {
                        const registerDate = new Date(user.created_at);
                        const now = new Date();
                        if (!isNaN(registerDate.getTime())) {
                            daysDiff = Math.floor((now - registerDate) / (1000 * 60 * 60 * 24));
                        }
                    }
                    // 如果计算失败，显示为 0 天
                    if (isNaN(daysDiff) || daysDiff < 0) {
                        daysDiff = 0;
                    }
                    
                    // 创建统计信息容器
                    const statsContainer = util.createElement("div", {
                        staticClass: "nsx-user-stats",
                        attrs: { 
                            style: position === 'right' 
                                ? "display: inline-flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 0.9em; margin-left: 8px;" 
                                : "margin-top: 4px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 0.9em;" 
                        }
                    }, [
                        util.createElement("span", { attrs: { title: "注册天数", style: "color: #2ea44f;" } }, [`📅 注册 ${daysDiff} 天`]),
                        util.createElement("span", { attrs: { style: "color: var(--text-tertiary-color, #ccc);" } }, ["·"]),
                        util.createElement("span", { attrs: { title: "鸡腿数量", style: "color: #ff9800;" } }, [`🍗 ${user.coin || 0}`]),
                        util.createElement("span", { attrs: { style: "color: var(--text-tertiary-color, #ccc);" } }, ["·"]),
                        util.createElement("span", { attrs: { title: "帖子数", style: "color: #2196f3;" } }, [`📝 帖子 ${user.nPost || 0}`]),
                        util.createElement("span", { attrs: { style: "color: var(--text-tertiary-color, #ccc);" } }, ["·"]),
                        util.createElement("span", { attrs: { title: "评论数", style: "color: #9c27b0;" } }, [`💬 评论 ${user.nComment || 0}`])
                    ]);
                    
                    // 根据位置设置插入
                    if (position === 'right' && item) {
                        // 插入到作者名字右边
                        const authorLink = item.querySelector('.nsk-content-meta-info .author-info a');
                        if (authorLink) {
                            authorLink.after(statsContainer);
                        } else {
                            // 如果找不到作者链接，回退到下方
                            contentInfo.appendChild(statsContainer);
                        }
                    } else {
                        // 默认插入到下方
                        contentInfo.appendChild(statsContainer);
                    }
                };
                
                // 处理单个内容项（帖子或评论）
                const processContentItem = (item) => {
                    // 排除主帖，主帖的统计信息由 addLevelTag 处理
                    // 检查 item 是否在主帖内（#nsk-body .nsk-post）
                    const mainPost = document.querySelector('#nsk-body .nsk-post');
                    if (mainPost && mainPost.contains(item)) {
                        return;
                    }
                    
                    // 查找 content-info 元素
                    const contentInfo = item.querySelector('.nsk-content-meta-info .content-info');
                    if (!contentInfo) return;
                    
                    // 如果已经有统计信息，跳过
                    if (contentInfo.querySelector('.nsx-user-stats')) return;
                    
                    // 尝试从头像获取 UID
                    const avatar = item.querySelector('.avatar-normal');
                    let uid = null;
                    
                    if (avatar) {
                        // 尝试从 data-uid 属性获取
                        uid = avatar.getAttribute('data-uid');
                        // 如果没找到，尝试从头像 URL 提取（/avatar/12345.png）
                        if (!uid && avatar.src) {
                            const match = avatar.src.match(/\/avatar\/(\d+)\.png/);
                            if (match) {
                                uid = match[1];
                            }
                        }
                    }
                    
                    // 如果还是没找到，尝试从作者链接获取
                    if (!uid) {
                        const authorLink = item.querySelector('.nsk-content-meta-info .author-info a');
                        if (authorLink && authorLink.href) {
                            const match = authorLink.href.match(/\/space\/(\d+)/);
                            if (match) {
                                uid = match[1];
                            }
                        }
                    }
                    
                    if (!uid) return;
                    
                    // 如果用户数据已经在缓存中，直接使用
                    if (_this.userDataCache.has(uid)) {
                        const user = _this.userDataCache.get(uid);
                        createUserStats(user, contentInfo, item);
                        return;
                    }
                    
                    // 如果正在请求该用户的数据，将当前楼层加入等待列表
                    if (_this.pendingUserRequests.has(uid)) {
                        if (!_this.pendingContentItems.has(uid)) {
                            _this.pendingContentItems.set(uid, []);
                        }
                        _this.pendingContentItems.get(uid).push({ contentInfo, item });
                        return;
                    }
                    
                    // 标记为正在请求
                    _this.pendingUserRequests.add(uid);
                    
                    // 获取用户信息
                    _this.getUserInfo(uid).then((user) => {
                        // 缓存用户数据
                        _this.userDataCache.set(uid, user);
                        
                        // 为当前楼层显示统计信息
                        createUserStats(user, contentInfo, item);
                        
                        // 为所有等待该用户数据的楼层显示统计信息
                        if (_this.pendingContentItems.has(uid)) {
                            const pendingItems = _this.pendingContentItems.get(uid);
                            pendingItems.forEach(({ contentInfo: pendingContentInfo, item: pendingItem }) => {
                                createUserStats(user, pendingContentInfo, pendingItem);
                            });
                            _this.pendingContentItems.delete(uid);
                        }
                        
                        // 移除请求标记
                        _this.pendingUserRequests.delete(uid);
                    }).catch((err) => {
                        // 忽略错误，移除请求标记
                        _this.pendingUserRequests.delete(uid);
                        _this.pendingContentItems.delete(uid);
                    });
                };
                
                // 处理所有内容项
                const processAllItems = () => {
                    // 处理所有评论（包括主帖，但主帖的统计信息由 addLevelTag 处理，这里会跳过）
                    const contentItems = document.querySelectorAll('.content-item');
                    contentItems.forEach(item => {
                        processContentItem(item);
                    });
                };
                
                // 初始处理
                processAllItems();
                
                // 监听动态加载的内容
                if (!_this.allUsersStatsObserver) {
                    _this.allUsersStatsObserver = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) { // Element node
                                    // 检查是否是新的内容项
                                    if (node.matches && node.matches('.content-item')) {
                                        processContentItem(node);
                                    }
                                    // 检查子元素中是否有新的内容项
                                    const newItems = node.querySelectorAll ? node.querySelectorAll('.content-item') : [];
                                    newItems.forEach(item => processContentItem(item));
                                }
                            });
                        });
                    });
                    
                    const commentsContainer = document.querySelector('.comments, .comment-container');
                    if (commentsContainer) {
                        _this.allUsersStatsObserver.observe(commentsContainer, {
                            childList: true,
                            subtree: true
                        });
                    }
                }
            },
            // 隐藏所有用户统计信息
            hideAllUsersStats() {
                // 移除所有用户统计信息（除了楼主的，因为那是 level_tag 功能的一部分）
                document.querySelectorAll('.nsx-user-stats').forEach(stats => {
                    // 只移除非楼主区域的统计信息
                    const isMainPost = stats.closest('#nsk-body .nsk-post');
                    if (!isMainPost) {
                        stats.remove();
                    }
                });
                
                // 断开观察器
                if (this.allUsersStatsObserver) {
                    this.allUsersStatsObserver.disconnect();
                    this.allUsersStatsObserver = null;
                }
            },
            getRankByCoin(coin){
                // 处理无效值：负数、NaN、undefined 都返回 0
                if (!coin || coin < 0) {
                    return 0;
                }
                // 计算等级：使用平方根公式，最大等级为6
                const level = Math.floor(Math.sqrt(coin) / 10);
                return Math.min(6, level);
            },
            fakeLevel(){
                let coin = unsafeWindow.__config__.user.coin;
                if(coin < 4900) return;//不足7级直接返回
                let rank = this.getRankByCoin(coin);
                const userCard = document.querySelector(".user-card .user-stat");
                userCard.querySelector('use[href="#level"]').closest('svg').nextElementSibling.innerText='等级 Lv '+ rank;
            },
            userCardEx() {
                if (!this.loginStatus) return;
                if (!(opts.post.pathPattern.test(location.pathname)|| opts.comment.pathPattern.test(location.pathname))) return;

                const bn = new BroadcastManager("notification_sync");

                const updateNotificationElement = (element, href, iconHref, text, count) => {
                    element.querySelector("a").setAttribute("href", `${href}`);
                    element.querySelector("a > svg > use").setAttribute("href", `${iconHref}`);
                    element.querySelector("a > :nth-child(2)").textContent = `${text} `;
                    element.querySelector("a > :last-child").textContent = count;
                    const countEl = element.querySelector("a > :last-child");
                    countEl.classList.toggle("notify-count", count > 0);

                    // 通知（只在主控标签页且有新消息时发送）
                    if (count > 0 && bn.active) {
                        GM_notification({
                            text: `你有 ${count} 条新 ${text === '我' ? '@' : text}，点击查看`,
                            tag: 'notice_count',
                            onclick: e => (e.preventDefault(), GM_openInTab(`${BASE_URL}${href}`, {active: true}))
                        });
                    }

                    return element;
                };

                const userCard = document.querySelector(".user-card .user-stat");
                const lastElement = userCard.querySelector(".stat-block:first-child > :last-child");

                const atMeElement = lastElement.cloneNode(true);
                const msgElement = lastElement.cloneNode(true);

                lastElement.after(atMeElement);
                userCard.querySelector(".stat-block:last-child").append(msgElement);

                // 初始化通知显示
                const updateAllCounts = (counts) => {
                    updateNotificationElement(atMeElement, "/notification#/atMe", "#at-sign", "我", counts.atMe);
                    updateNotificationElement(msgElement, "/notification#/message?mode=list", "#envelope-one", "私信", counts.message);
                    updateNotificationElement(lastElement, "/notification#/reply", "#remind-6nce9p47", "回复", counts.reply);
                };

                // 注册数据接收器
                bn.registerReceiver(({ sender, data }) => {
                    if (data.type === 'unreadCount' && data.counts) {
                        // console.log(`接收到来自 ${sender} 的广播数据：${JSON.stringify(data.counts)}`, new Date(data.timestamp).toLocaleString());
                        updateAllCounts(data.counts);
                    }
                });

                // 首次加载
                bn.broadcast({ type: 'unreadCount', counts: unsafeWindow.__config__.user.unViewedCount, timestamp: Date.now() });

                let interval = 5000;
                // 启动定时任务（只在主控标签页执行）
                bn.startTask(async () => {
                    const response = await fetch("/api/notification/unread-count", { credentials: "include" });

                    if (!response.ok) throw new Error(response.status);

                    const data = await response.json();
                    if (data.success && data.unreadCount) {
                        // console.log(`${bn.myId} 发送一条广播数据：${JSON.stringify(data.unreadCount)}`);
                        return {
                            type: 'unreadCount',
                            counts: data.unreadCount,
                            timestamp: Date.now()
                        };
                    }
                    throw new Error('Invalid response');
                }, interval);
            },
            // 自动翻页
            autoLoading() {
                if (Config.getConfig('loading_post.enabled') === false && Config.getConfig('loading_comment.enabled') === false) return;
                let opt = {};
                if (opts.post.pathPattern.test(location.pathname)) { opt = opts.post; }
                else if (opts.comment.pathPattern.test(location.pathname)) { opt = opts.comment; }
                else { return; }
                let is_requesting = false;
                let _this = this;
                this.windowScroll(function (direction, e) {
                    if (direction === 'down') { // 下滑才准备翻页
                        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                        if (document.documentElement.scrollHeight <= document.documentElement.clientHeight + scrollTop + opt.scrollThreshold && !is_requesting) {
                            if (!document.querySelector(opt.nextPagerSelector)) return;
                            let nextUrl = document.querySelector(opt.nextPagerSelector).attributes.href.value;
                            is_requesting = true;

                            // 显示加载遮罩（无缝翻页时）
                            const overlay = document.getElementById('nsx-loading-overlay');
                            if (overlay) overlay.classList.add('show');

                            util.get(nextUrl, {}, 'text').then(function (data) {
                                let doc = new DOMParser().parseFromString(data, "text/html");
                                _this.blockPost(doc);//过滤帖子
                                _this.blockPostsByViewLevel(doc);
                                _this.blockPostsByCategory(doc);
                                if (opts.comment.pathPattern.test(location.pathname)){
                                    // 取加载页的评论数据追加到原评论数据
                                    let el = doc.getElementById('temp-script')
                                    let jsonText = el.textContent;
                                    if (jsonText) {
                                        let conf = JSON.parse(util.b64DecodeUnicode(jsonText))
                                        unsafeWindow.__config__.postData.comments.push(...conf.postData.comments);
                                    }
                                }
                                if (name === 'block_posts') {
                                    const keywordsBox = layero[0].querySelector('#block_post_keywords_box');
                                    if (keywordsBox) keywordsBox.style.display = data.elem.checked ? '' : 'none';
                                    if (data.elem.checked) {
                                        _this.refreshBlockKeywordRules();
                                        _this.blockPost();
                                    }
                                }
                                document.querySelector(opt.postListSelector).append(...doc.querySelector(opt.postListSelector).childNodes);
                                document.querySelector(opt.topPagerSelector).innerHTML = doc.querySelector(opt.topPagerSelector).innerHTML;
                                document.querySelector(opt.bottomPagerSelector).innerHTML = doc.querySelector(opt.bottomPagerSelector).innerHTML;
                                history.pushState(null, null, nextUrl);
                                _this.replaceDefaultAvatars(doc);

                                // 确保新加载的内容也应用紧凑模式样式
                                if (Config.getConfig('compact_mode.enabled') !== false) {
                                    _this.updateCompactModeStyle();
                                }

                                // 确保新加载的内容也应用隐藏设置
                                _this.togglePostCategory();
                                _this.togglePostInfo();

                                // 应用关键词高亮
                                if (Config.getConfig('right_panel_highlight.enabled') === true) {
                                    _this.applyRightPanelHighlight();
                                }

                                // 应用排序
                                _this.sortPostList();

                                // 如果启用了显示所有用户统计，为新加载的内容添加统计信息
                                if (Config.getConfig('show_all_users_stats.enabled') === true) {
                                    setTimeout(() => {
                                        _this.showAllUsersStats();
                                    }, 300);
                                }

                                // 隐藏加载遮罩
                                const overlay = document.getElementById('nsx-loading-overlay');
                                if (overlay) overlay.classList.remove('show');

                                // 评论菜单条
                                if (opts.comment.pathPattern.test(location.pathname)){
                                    const vue = document.querySelector('.comment-menu').__vue__;
                                    Array.from(document.querySelectorAll(".content-item")).forEach(function (t,e) {
                                        const n = t.querySelector(".comment-menu-mount");
                                        if(!n) return;
                                        const o = new vue.$root.constructor(vue.$options);
                                        o.setIndex(e);
                                        o.$mount(n);
                                    });
                                    
                                    // 如果启用了显示所有用户统计，为新加载的评论添加统计信息
                                    if (Config.getConfig('show_all_users_stats.enabled') === true) {
                                        setTimeout(() => {
                                            _this.showAllUsersStats();
                                        }, 500);
                                    }
                                }
                                is_requesting = false;
                            }).catch(function (err) {
                                // 出错时也隐藏遮罩
                                const overlay = document.getElementById('nsx-loading-overlay');
                                if (overlay) overlay.classList.remove('show');
                                is_requesting = false;
                                util.clog(err);
                            });
                        }
                    }
                });
            },
            // 滚动条事件
            windowScroll(fn1) {
                let beforeScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                    fn = fn1 || function () { };
                setTimeout(function () { // 延时执行，避免刚载入到页面就触发翻页事件
                    window.addEventListener('scroll', function (e) {
                        const afterScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                              delta = afterScrollTop - beforeScrollTop;
                        if (delta == 0) return false;
                        fn(delta > 0 ? 'down' : 'up', e);
                        beforeScrollTop = afterScrollTop;
                    }, false);
                }, 1000)
            },
            // 平滑滚动
            smoothScroll(){
                const scroll = (selector, top = 0) => {
                    const btn = document.querySelector(selector);
                    if (btn) {
                        // 移除现有事件监听器
                        btn.onclick = null;
                        btn.removeAttribute('onclick');
                        // 添加新的事件处理器
                        btn.addEventListener('click', e => {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            if(e.target.querySelector('use[href="#down"]')){
                                top = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                            }
                            window.scrollTo({ top, behavior: 'smooth' });
                        }, true);
                    }
                };
                scroll('#back-to-top', 0);
                scroll('#back-to-bottom', Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
            },
            history: ()=>{
                const STORAGE_KEY = 'nsx_browsing_history';
                const PAGE_SIZE = 10;
                let saveLimit = 'all';
                let sortedCache = null; // 缓存排序后的数据

                const POST_URL_PATTERN = /\/post-(\d+)-\d+.*$/;
                const getCurrentTime = () => layui.util.toDateString(new Date(),"yyyy-MM-ddTHH:mm:ss.SSS");

                const getBrowsingHistory = () => {
                    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                };

                const saveBrowsingHistory = (history) => {
                    if (saveLimit !== 'all') {
                        history = history.slice(-saveLimit);
                    }
                    // 保存时排序，并清除缓存
                    sortedCache = null;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
                };

                const addOrUpdateHistory = (url, title) => {
                    const match = url.match(POST_URL_PATTERN);
                    if (!match) return; // 只保存匹配的帖子记录

                    const normalizedUrl = `/post-${match[1]}-1`; // 只判断第1页，即不区分页码
                    const history = getBrowsingHistory();
                    const index = history.findIndex(item => item.url === normalizedUrl);
                    const entry = { url: normalizedUrl, title, time: getCurrentTime() };
                    if (index > -1) {
                        history[index] = entry;
                    }
                    else {
                        history.push(entry);
                    }
                    saveBrowsingHistory(history);
                };

                const getHistory = (page = 1) => {
                    // 使用缓存或重新排序
                    if (!sortedCache) {
                    const history = getBrowsingHistory();
                        sortedCache = history.sort((a, b) => new Date(b.time) - new Date(a.time));
                    }
                    if(page===0) return sortedCache;
                    return sortedCache.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
                };

                const showHistory = (page = 1) => {
                    const history = getBrowsingHistory();
                    const totalPages = Math.ceil(history.length / PAGE_SIZE);
                    const pageHistory = getHistory(page);
                    // console.clear();
                    // console.log(`浏览历史 - 第 ${page} 页，共 ${totalPages} 页`);
                    pageHistory.forEach((item, i) => {
                        // console.log(`${(page - 1) * PAGE_SIZE + i + 1}. [${item.time}] ${item.title} - ${item.url}`);
                    });
                    if (page < totalPages) {
                        // console.log(`输入 showHistory(${page + 1}) 查看下一页`);
                    }
                };

                const setSaveLimit = (limit) => {
                    if (typeof limit === 'number' && limit > 0 || limit === 'all') {
                        saveLimit = limit;
                        // console.log(`保存限制已设置为：${limit === 'all' ? '全部' : `最近 ${limit} 条`}`);
                    }
                    else {
                        // console.error('无效的保存限制。请输入正整数或 "all"');
                    }
                };

                const injectDom=()=>{
                    const svg = util.createElement("svg", { staticClass: "iconpark-icon", attrs: { "style": "width: 17px;height: 17px;" }},[ util.createElement("use",{ attrs: { "href": "#history"} }, [], document, "http://www.w3.org/2000/svg") ], document, "http://www.w3.org/2000/svg");
                    const originalSwitcher = document.querySelector('#nsk-head .color-theme-switcher');
                    if (originalSwitcher) {
                        const svgWrap = originalSwitcher.cloneNode();
                        svgWrap.classList.replace('color-theme-switcher', 'history-dropdown-on');
                        svgWrap.setAttribute('lay-options', '{trigger:"hover"}');

                        // 判断是否为移动端（li 元素）并移除 SVG 的 style 属性
                        if (originalSwitcher.tagName.toLowerCase() === 'li') {
                            svg.removeAttribute('style');
                        }

                        svgWrap.appendChild(svg);
                        originalSwitcher.insertAdjacentElement('beforebegin', svgWrap);
                    }

                    const history=getHistory(0);
                    const maxLength=20;
                    // 按天分组
                    const grouped = history.reduce((result, item, i) => {
                        const date = item.time.split("T")[0];
                        if (!result[date]) {
                            result[date] = [];
                        }
                        const truncatedTitle = item.title.length > maxLength
                        ? item.title.slice(0, maxLength) + "..."
                        : item.title;
                        result[date].push({
                            id: 1000+i+1,
                            title: `${truncatedTitle}(${layui.util.toDateString(item.time,'HH:mm')})`,
                            href: item.url,
                            time: item.time
                        });
                        return result;
                    }, {});

                    // 转换为目标结构
                    const result = Object.entries(grouped).map(([day, items], index) => ({
                        id: index + 1,
                        title: day,
                        type: "group",
                        child: items // 将子项包裹在数组中
                    }));

                    // console.log(result);

                    dropdown.render({
                        elem: '.history-dropdown-on',
                        // trigger: 'click' // trigger 已配置在元素 `lay-options` 属性上
                        data: result,
                        style: 'width: 370px; height: 200px;'
                    });
                };

                addOrUpdateHistory(window.location.href, document.title);
                injectDom();
            },
            initInstantPage:() => {
                const prefetchedUrls = new Set(); // 用于存储已经尝试预加载的 URL
                let prefetcher = document.createElement('link');
                prefetcher.rel = 'prefetch';

                document.body.addEventListener('mouseover', (event) => {
                    const target = event.target.closest('a');

                    if (!target || !target.href || target.hasAttribute('data-no-instant')) {
                        return;
                    }

                    const href = target.href;

                    if (!href.startsWith(`${BASE_URL}/post-`)) {
                        return;
                    }

                    if (prefetchedUrls.has(href)) {
                        // console.log('跳过已预加载链接：', href);
                        return;
                    }

                    setTimeout(() => {
                        if (target.matches(':hover')) {
                            prefetcher.href = href;
                            document.head.appendChild(prefetcher);
                            prefetchedUrls.add(href);
                            // console.log('预加载链接已启动：', href);
                        }
                    }, 65); // 65毫秒延迟
                });
            },
            // 在导航栏添加设置按钮
            addSettingsButton() {
                const header = document.querySelector('#nsk-head');
                if (!header) return;

                const colorSwitcher = header.querySelector('.color-theme-switcher');
                if (!colorSwitcher) return;

                // 检查是否已存在设置按钮
                if (header.querySelector('.nsx-settings-btn')) return;

                const settingsBtn = colorSwitcher.cloneNode(true);
                settingsBtn.classList.remove('color-theme-switcher');
                settingsBtn.classList.add('nsx-settings-btn');
                settingsBtn.setAttribute('title', 'NodeSeek X 设置');
                settingsBtn.querySelector('use').setAttribute('href', '#setting');
                settingsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.advancedSettings();
                });

                colorSwitcher.insertAdjacentElement('beforebegin', settingsBtn);
            },
            moveSearchBoxToCenter() {
                // 搜索框定位逻辑已提前通过紧凑模式样式处理，避免运行时闪烁
            },
            advancedSettings() {
                const _this = this;
                const layerWidth = layui.device().mobile ? '100%' : '700px';
                const siteCode = opts.curSite ? opts.curSite.code : 'ns';

                // 生成设置内容
            const generateSettingsContent = () => {
                const blockPostsEnabled = (Config.getConfig('block_posts.enabled') ?? true) !== false;
                const blockCategoriesEnabled = Config.getConfig('block_categories.enabled') === true;
                const blockPostKeywordsValue = (_this.getBlockKeywordInputValue() || '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                const blockCategoriesValue = (_this.getBlockedCategoryInputValue() || '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                const signInMethod = Config.getConfig(`sign_in.${siteCode}.method`) ?? 0;
                const signInEnabled = Config.getConfig(`sign_in.${siteCode}.enabled`) === true;
                const typographyTitle = Config.getConfig('typography.title') || {};
                const typographyTag = Config.getConfig('typography.tag') || {};
                const typographyMeta = Config.getConfig('typography.meta') || {};
                const typographyContent = Config.getConfig('typography.content') || {};
                const escape = (val) => (val || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

                return `
<div class="layui-row" style="display:flex;height:100%">
  <div class="layui-panel layui-col-xs3 layui-col-sm3 layui-col-md3" id="nsx-settings-menu">
    <ul class="layui-menu" lay-filter="nsx-settings-menu">
      <li class="layui-menu-item-checked"><div class="layui-menu-body-title"><a href="javascript:void(0)" data-target="basic">基本设置</a></div></li>
      <li><div class="layui-menu-body-title"><a href="javascript:void(0)" data-target="enhance">增强功能</a></div></li>
      <li><div class="layui-menu-body-title"><a href="javascript:void(0)" data-target="display">显示设置</a></div></li>
      <li><div class="layui-menu-body-title"><a href="javascript:void(0)" data-target="config">配置</a></div></li>
    </ul>
  </div>
  <div class="layui-col-xs9 layui-col-sm9 layui-col-md9" style="overflow-y: auto; padding: 15px;" id="nsx-settings-content">
    <fieldset id="basic" class="layui-elem-field layui-field-title">
      <legend>基本设置</legend>
    </fieldset>
    <div class="layui-form" lay-filter="nsx-settings-form" style="padding: 20px 0;">
      <div class="layui-form-item">
        <label class="layui-form-label">自动签到</label>
        <div class="layui-input-block">
          <input type="radio" name="sign_in_method" value="0" title="关闭" lay-filter="sign_in_method" ${signInEnabled !== true ? 'checked' : ''}>
          <input type="radio" name="sign_in_method" value="1" title="随机🍗" lay-filter="sign_in_method" ${signInEnabled && signInMethod === 1 ? 'checked' : ''}>
          <input type="radio" name="sign_in_method" value="2" title="5个🍗" lay-filter="sign_in_method" ${signInEnabled && (signInMethod === 0 || signInMethod === undefined) ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">移除推广</label>
        <div class="layui-input-block">
          <input type="checkbox" name="remove_promotions" lay-skin="switch" lay-filter="remove_promotions" lay-text="开启|关闭" ${Config.getConfig('remove_promotions.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">隐藏页面中的推广位（.promotation-item）。</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">默认头像</label>
        <div class="layui-input-block">
          <input type="checkbox" name="default_avatar" lay-skin="switch" lay-filter="default_avatar" lay-text="开启|关闭" ${Config.getConfig('default_avatar.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">识别系统随机头像并替换为自定义图片。</div>
        </div>
      </div>
      <div class="layui-form-item" id="default_avatar_box" style="${Config.getConfig('default_avatar.enabled') === true ? '' : 'display: none;'}">
        <label class="layui-form-label">头像设置</label>
        <div class="layui-input-block">
          <input type="text" name="default_avatar_url" value="${escape(Config.getConfig('default_avatar.url') || '')}" placeholder="替换用的头像 URL" class="layui-input" style="margin-bottom: 8px;">
          <div style="margin-bottom: 6px;">
            <input type="checkbox" name="default_avatar_auto" lay-skin="primary" lay-filter="default_avatar_auto" title="自动识别默认头像" ${Config.getConfig('default_avatar.auto_detect') === false ? '' : 'checked'}>
          </div>
          <div class="layui-form-mid layui-word-aux">若禁用自动识别则所有未自定义头像的用户都会替换为上面的 URL。</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">加载遮罩</label>
        <div class="layui-input-block">
          <input type="checkbox" name="loading_overlay" lay-skin="switch" lay-filter="loading_overlay" lay-text="开启|关闭" ${(Config.getConfig('loading_overlay.enabled') ?? true) !== false ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">控制开屏时的模糊加载页。</div>
        </div>
      </div>
      <div class="layui-form-item" id="loading_overlay_box" style="${(Config.getConfig('loading_overlay.enabled') ?? true) !== false ? '' : 'display:none;'}">
        <label class="layui-form-label">显示时长</label>
        <div class="layui-input-block">
          <input type="range" name="loading_overlay_duration" min="300" max="3000" step="100" value="${Config.getConfig('loading_overlay.duration') ?? INITIAL_OVERLAY_DURATION_DEFAULT}" style="width:200px;">
          <span class="layui-form-mid" id="loading_overlay_duration_display">${(Config.getConfig('loading_overlay.duration') ?? INITIAL_OVERLAY_DURATION_DEFAULT)}ms</span>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">签到提示</label>
        <div class="layui-input-block">
          <input type="checkbox" name="signin_tips" lay-skin="switch" lay-filter="signin_tips" lay-text="开启|关闭" ${(Config.getConfig('signin_tips.enabled') ?? true) !== false ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">自动跳转外部链接</label>
        <div class="layui-input-block">
          <input type="checkbox" name="auto_jump_external_links" lay-skin="switch" lay-filter="auto_jump_external_links" lay-text="开启|关闭" ${(Config.getConfig('auto_jump_external_links.enabled') ?? true) !== false ? 'checked' : ''}>
        </div>
      </div>
    </div>

    <fieldset id="enhance" class="layui-elem-field layui-field-title">
      <legend>增强功能</legend>
    </fieldset>
    <div class="layui-form" lay-filter="nsx-settings-form" style="padding: 20px 0;">
      <div class="layui-form-item">
        <label class="layui-form-label">下拉加载翻页</label>
        <div class="layui-input-block">
          <input type="checkbox" name="loading_post" lay-skin="switch" lay-filter="loading_post" lay-text="开启|关闭" ${(Config.getConfig('loading_post.enabled') ?? true) !== false ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">自动加载帖子和评论</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">新标签页打开帖子</label>
        <div class="layui-input-block">
          <input type="checkbox" name="open_post_in_new_tab" lay-skin="switch" lay-filter="open_post_in_new_tab" lay-text="开启|关闭" ${Config.getConfig('open_post_in_new_tab.enabled') === true ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">快捷评论</label>
        <div class="layui-input-block">
          <input type="checkbox" name="quick_comment" lay-skin="switch" lay-filter="quick_comment" lay-text="开启|关闭" ${(Config.getConfig('quick_comment.enabled') ?? true) !== false ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">屏蔽用户</label>
        <div class="layui-input-block">
          <input type="checkbox" name="block_members" lay-skin="switch" lay-filter="block_members" lay-text="开启|关闭" ${(Config.getConfig('block_members.enabled') ?? true) !== false ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">屏蔽帖子</label>
        <div class="layui-input-block">
          <input type="checkbox" name="block_posts" lay-skin="switch" lay-filter="block_posts" lay-text="开启|关闭" ${blockPostsEnabled ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item" id="block_post_keywords_box" style="${blockPostsEnabled ? '' : 'display: none;'}">
        <label class="layui-form-label">标题关键词</label>
        <div class="layui-input-block">
          <textarea name="block_post_keywords" class="layui-textarea" placeholder="一行一个关键词；使用 /正则/flags 形式可启用正则匹配">${blockPostKeywordsValue}</textarea>
          <div class="layui-form-mid layui-word-aux">示例：<code>羊了个羊</code>、<code>/^\\[广告\\]/i</code>。匹配命中时会直接隐藏该帖子。</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">屏蔽分类</label>
        <div class="layui-input-block">
          <input type="checkbox" name="block_categories" lay-skin="switch" lay-filter="block_categories" lay-text="开启|关闭" ${blockCategoriesEnabled ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item" id="block_categories_box" style="${blockCategoriesEnabled ? '' : 'display: none;'}">
        <label class="layui-form-label">分类列表</label>
        <div class="layui-input-block">
          <textarea name="block_categories_list" class="layui-textarea" placeholder="一行一个分类名称，如：日常、技术、交易">${blockCategoriesValue}</textarea>
          <div class="layui-form-mid layui-word-aux">与帖子上显示的分类文字一致即可，例如“日常”“技术”“情报”“测评”等。</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">用户卡片扩展</label>
        <div class="layui-input-block">
          <input type="checkbox" name="user_card_ext" lay-skin="switch" lay-filter="user_card_ext" lay-text="开启|关闭" ${(Config.getConfig('user_card_ext.enabled') ?? true) !== false ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">显示所有用户统计</label>
        <div class="layui-input-block">
          <input type="checkbox" name="show_all_users_stats" lay-skin="switch" lay-filter="show_all_users_stats" lay-text="开启|关闭" ${Config.getConfig('show_all_users_stats.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">在帖子内所有用户（包括评论者）的元数据区域显示注册天数、鸡腿数量、帖子数、评论数等统计信息</div>
        </div>
      </div>
      <div class="layui-form-item" id="show_all_users_stats_position_box" style="${Config.getConfig('show_all_users_stats.enabled') === true ? '' : 'display: none;'}">
        <label class="layui-form-label">显示位置</label>
        <div class="layui-input-block">
          <input type="radio" name="show_all_users_stats_position" value="below" title="下方" lay-filter="show_all_users_stats_position" ${(Config.getConfig('show_all_users_stats.position') || 'below') === 'below' ? 'checked' : ''}>
          <input type="radio" name="show_all_users_stats_position" value="right" title="作者名字右边" lay-filter="show_all_users_stats_position" ${Config.getConfig('show_all_users_stats.position') === 'right' ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">选择统计信息的显示位置</div>
        </div>
      </div>
    </div>

    <fieldset id="display" class="layui-elem-field layui-field-title">
      <legend>显示设置</legend>
    </fieldset>
    <div class="layui-form" lay-filter="nsx-settings-form" style="padding: 20px 0;">
      <div class="layui-form-item">
        <label class="layui-form-label">等级标签</label>
        <div class="layui-input-block">
          <input type="checkbox" name="level_tag" lay-skin="switch" lay-filter="level_tag" lay-text="开启|关闭" ${(Config.getConfig('level_tag.enabled') ?? true) !== false ? 'checked' : ''}>
  </div>
</div>
      <div class="layui-form-item">
        <label class="layui-form-label">代码高亮</label>
        <div class="layui-input-block">
          <input type="checkbox" name="code_highlight" lay-skin="switch" lay-filter="code_highlight" lay-text="开启|关闭" ${(Config.getConfig('code_highlight.enabled') ?? true) !== false ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">图片滑动查看</label>
        <div class="layui-input-block">
          <input type="checkbox" name="image_slide" lay-skin="switch" lay-filter="image_slide" lay-text="开启|关闭" ${(Config.getConfig('image_slide.enabled') ?? true) !== false ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">已访问链接标记</label>
        <div class="layui-input-block">
          <input type="checkbox" name="visited_links" lay-skin="switch" lay-filter="visited_links" lay-text="开启|关闭" ${(Config.getConfig('visited_links.enabled') ?? true) !== false ? 'checked' : ''}>
        </div>
        <div class="layui-input-block" style="margin-top: 10px;">
          <input type="checkbox" name="hide_visited_links" lay-skin="primary" lay-filter="hide_visited_links" title="隐藏已访问帖子" ${Config.getConfig('visited_links.hide_visited') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">启用后，点击过的帖子会直接在列表中隐藏。</div>
        </div>
        <div class="layui-input-block" style="margin-top: 10px;">
          <input type="checkbox" name="visited_to_bottom" lay-skin="primary" lay-filter="visited_to_bottom" title="已访问帖子置底" ${Config.getConfig('post_sort.visited_to_bottom') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">启用后，已访问的帖子会排在列表最后。</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">帖子排序</label>
        <div class="layui-input-block">
          <input type="radio" name="post_sort_mode" value="none" title="不排序" lay-filter="post_sort_mode" ${(Config.getConfig('post_sort.mode') || 'none') === 'none' ? 'checked' : ''}>
          <input type="radio" name="post_sort_mode" value="comments" title="按回复数" lay-filter="post_sort_mode" ${Config.getConfig('post_sort.mode') === 'comments' ? 'checked' : ''}>
          <input type="radio" name="post_sort_mode" value="views" title="按查看数" lay-filter="post_sort_mode" ${Config.getConfig('post_sort.mode') === 'views' ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">对帖子列表进行排序，按回复数或查看数从高到低排列</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">紧凑模式</label>
        <div class="layui-input-block">
          <input type="checkbox" name="compact_mode" lay-skin="switch" lay-filter="compact_mode" lay-text="开启|关闭" ${(Config.getConfig('compact_mode.enabled') ?? true) !== false ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">增大信息密度，一页显示更多帖子</div>
        </div>
      </div>
      <div class="layui-form-item" id="compact_mode_options" style="${(Config.getConfig('compact_mode.enabled') ?? true) !== false ? '' : 'display: none;'}">
        <label class="layui-form-label">列数</label>
        <div class="layui-input-block">
          <input type="radio" name="compact_columns" value="1" title="1列" lay-filter="compact_columns" ${(Config.getConfig('compact_mode.columns') ?? 1) === 1 ? 'checked' : ''}>
          <input type="radio" name="compact_columns" value="2" title="2列" lay-filter="compact_columns" ${(Config.getConfig('compact_mode.columns') ?? 1) === 2 ? 'checked' : ''}>
          <input type="radio" name="compact_columns" value="3" title="3列" lay-filter="compact_columns" ${(Config.getConfig('compact_mode.columns') ?? 1) === 3 ? 'checked' : ''}>
          <input type="radio" name="compact_columns" value="4" title="4列" lay-filter="compact_columns" ${(Config.getConfig('compact_mode.columns') ?? 1) === 4 ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item" id="compact_mode_custom_options" style="${(Config.getConfig('compact_mode.enabled') ?? true) !== false ? '' : 'display: none;'}">
        <label class="layui-form-label">自定义设置</label>
        <div class="layui-input-block">
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">内边距 (px):</label>
            <input type="text" name="compact_padding" value="${Config.getConfig('compact_mode.padding') || '6px 10px'}" placeholder="如: 6px 10px" style="width: 150px; display: inline-block;">
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">头像大小 (px):</label>
            <input type="number" name="compact_avatarSize" value="${Config.getConfig('compact_mode.avatarSize') || 26}" min="16" max="40" style="width: 150px; display: inline-block;">
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">标题字体 (px):</label>
            <input type="number" name="compact_titleFontSize" value="${Config.getConfig('compact_mode.titleFontSize') || 13}" min="10" max="16" style="width: 150px; display: inline-block;">
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">信息字体 (px):</label>
            <input type="number" name="compact_infoFontSize" value="${Config.getConfig('compact_mode.infoFontSize') || 10}" min="8" max="12" style="width: 150px; display: inline-block;">
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">间距 (px):</label>
            <input type="number" name="compact_marginBottom" value="${Config.getConfig('compact_mode.marginBottom') || 2}" min="0" max="10" style="width: 150px; display: inline-block;">
          </div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">自定义背景图</label>
        <div class="layui-input-block">
          <input type="checkbox" name="custom_background" lay-skin="switch" lay-filter="custom_background" lay-text="开启|关闭" ${Config.getConfig('custom_background.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">自定义页面背景图片</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">Header透明</label>
        <div class="layui-input-block">
          <input type="checkbox" name="header_opacity" lay-skin="switch" lay-filter="header_opacity" lay-text="开启|关闭" ${Config.getConfig('header_opacity.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">调节顶栏透明度，美化视觉。</div>
        </div>
      </div>
      <div class="layui-form-item" id="header_opacity_box" style="${Config.getConfig('header_opacity.enabled') === true ? '' : 'display: none;'}">
        <label class="layui-form-label">透明度</label>
        <div class="layui-input-block">
          <input type="range" name="header_opacity_value" min="0" max="1" step="0.01" value="${Config.getConfig('header_opacity.value') ?? 0.92}" style="width: 200px;">
          <span class="layui-form-mid" id="header_opacity_value_display">${(Config.getConfig('header_opacity.value') ?? 0.92).toFixed(2)}</span>
        </div>
        <div class="layui-input-block" style="margin-top:10px;">
          <input type="checkbox" name="header_opacity_blur_toggle" lay-skin="primary" lay-filter="header_opacity_blur_toggle" title="开启模糊" ${(Config.getConfig('header_opacity.blur_enabled') ?? true) !== false ? 'checked' : ''}>
          <input type="number" name="header_opacity_blur" class="layui-input" style="width:100px;display:inline-block;margin-left:10px;" placeholder="blur(px)" value="${Config.getConfig('header_opacity.blur') ?? 16}">
        </div>
        <div class="layui-input-block" style="margin-top:10px;">
          <input type="checkbox" name="header_opacity_saturate_toggle" lay-skin="primary" lay-filter="header_opacity_saturate_toggle" title="开启饱和度" ${(Config.getConfig('header_opacity.saturate_enabled') ?? true) !== false ? 'checked' : ''}>
          <input type="number" name="header_opacity_saturate" class="layui-input" style="width:120px;display:inline-block;margin-left:10px;" placeholder="saturate(%)" value="${Config.getConfig('header_opacity.saturate') ?? 180}">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">框体透明</label>
        <div class="layui-input-block">
          <input type="checkbox" name="frame_opacity" lay-skin="switch" lay-filter="frame_opacity" lay-text="开启|关闭" ${Config.getConfig('frame_opacity.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">调节 #nsk-frame 等主体容器透明度。</div>
        </div>
      </div>
      <div class="layui-form-item" id="frame_opacity_box" style="${Config.getConfig('frame_opacity.enabled') === true ? '' : 'display: none;'}">
        <label class="layui-form-label">透明度</label>
        <div class="layui-input-block">
          <input type="range" name="frame_opacity_value" min="0" max="1" step="0.01" value="${Config.getConfig('frame_opacity.value') ?? 0.95}" style="width: 200px;">
          <span class="layui-form-mid" id="frame_opacity_value_display">${(Config.getConfig('frame_opacity.value') ?? 0.95).toFixed(2)}</span>
        </div>
        <div class="layui-input-block" style="margin-top:10px;">
          <input type="checkbox" name="frame_opacity_blur_toggle" lay-skin="primary" lay-filter="frame_opacity_blur_toggle" title="开启模糊" ${(Config.getConfig('frame_opacity.blur_enabled') ?? true) !== false ? 'checked' : ''}>
          <input type="number" name="frame_opacity_blur" class="layui-input" style="width:100px;display:inline-block;margin-left:10px;" placeholder="blur(px)" value="${Config.getConfig('frame_opacity.blur') ?? 12}">
        </div>
        <div class="layui-input-block" style="margin-top:10px;">
          <input type="checkbox" name="frame_opacity_saturate_toggle" lay-skin="primary" lay-filter="frame_opacity_saturate_toggle" title="开启饱和度" ${(Config.getConfig('frame_opacity.saturate_enabled') ?? true) !== false ? 'checked' : ''}>
          <input type="number" name="frame_opacity_saturate" class="layui-input" style="width:120px;display:inline-block;margin-left:10px;" placeholder="saturate(%)" value="${Config.getConfig('frame_opacity.saturate') ?? 180}">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">标题字体</label>
        <div class="layui-input-block">
          <input type="checkbox" name="typography_title" lay-skin="switch" lay-filter="typography_title" lay-text="开启|关闭" ${typographyTitle.enabled ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item" id="typography_title_box">
        <label class="layui-form-label">设置</label>
        <div class="layui-input-block">
          <input type="text" name="typography_title_fontFamily" placeholder="font-family" value="${escape(typographyTitle.fontFamily)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_title_fontSize" placeholder="font-size (如 16px)" value="${escape(typographyTitle.fontSize)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_title_color" placeholder="color (如 #333)" value="${escape(typographyTitle.color)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_title_fontStyle" placeholder="font-style" value="${escape(typographyTitle.fontStyle)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_title_letterSpacing" placeholder="letter-spacing" value="${escape(typographyTitle.letterSpacing)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_title_ligatures" placeholder="font-variant-ligatures" value="${escape(typographyTitle.ligatures)}" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">Tag 字体</label>
        <div class="layui-input-block">
          <input type="checkbox" name="typography_tag" lay-skin="switch" lay-filter="typography_tag" lay-text="开启|关闭" ${typographyTag.enabled ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item" id="typography_tag_box">
        <label class="layui-form-label">设置</label>
        <div class="layui-input-block">
          <input type="text" name="typography_tag_fontFamily" placeholder="font-family" value="${escape(typographyTag.fontFamily)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_tag_fontSize" placeholder="font-size" value="${escape(typographyTag.fontSize)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_tag_color" placeholder="color" value="${escape(typographyTag.color)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_tag_fontStyle" placeholder="font-style" value="${escape(typographyTag.fontStyle)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_tag_letterSpacing" placeholder="letter-spacing" value="${escape(typographyTag.letterSpacing)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_tag_ligatures" placeholder="font-variant-ligatures" value="${escape(typographyTag.ligatures)}" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">Meta 字体</label>
        <div class="layui-input-block">
          <input type="checkbox" name="typography_meta" lay-skin="switch" lay-filter="typography_meta" lay-text="开启|关闭" ${typographyMeta.enabled ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item" id="typography_meta_box">
        <label class="layui-form-label">设置</label>
        <div class="layui-input-block">
          <input type="text" name="typography_meta_fontFamily" placeholder="font-family" value="${escape(typographyMeta.fontFamily)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_meta_fontSize" placeholder="font-size" value="${escape(typographyMeta.fontSize)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_meta_color" placeholder="color" value="${escape(typographyMeta.color)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_meta_fontStyle" placeholder="font-style" value="${escape(typographyMeta.fontStyle)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_meta_letterSpacing" placeholder="letter-spacing" value="${escape(typographyMeta.letterSpacing)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_meta_ligatures" placeholder="font-variant-ligatures" value="${escape(typographyMeta.ligatures)}" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">内容字体</label>
        <div class="layui-input-block">
          <input type="checkbox" name="typography_content" lay-skin="switch" lay-filter="typography_content" lay-text="开启|关闭" ${typographyContent.enabled ? 'checked' : ''}>
        </div>
      </div>
      <div class="layui-form-item" id="typography_content_box">
        <label class="layui-form-label">设置</label>
        <div class="layui-input-block">
          <input type="text" name="typography_content_fontFamily" placeholder="font-family" value="${escape(typographyContent.fontFamily)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_content_fontSize" placeholder="font-size" value="${escape(typographyContent.fontSize)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_content_color" placeholder="color" value="${escape(typographyContent.color)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_content_fontStyle" placeholder="font-style" value="${escape(typographyContent.fontStyle)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_content_letterSpacing" placeholder="letter-spacing" value="${escape(typographyContent.letterSpacing)}" class="layui-input" style="margin-bottom:6px;">
          <input type="text" name="typography_content_ligatures" placeholder="font-variant-ligatures" value="${escape(typographyContent.ligatures)}" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item" id="custom_background_options" style="${Config.getConfig('custom_background.enabled') === true ? '' : 'display: none;'}">
        <label class="layui-form-label">背景图设置</label>
        <div class="layui-input-block">
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">上传图片:</label>
            <input type="file" id="custom_bg_upload" accept="image/*" style="display: none;">
            <button type="button" id="custom_bg_upload_btn" class="layui-btn layui-btn-sm" style="margin-right: 10px;">选择图片</button>
            <button type="button" id="custom_bg_clear_btn" class="layui-btn layui-btn-sm layui-btn-danger" style="display: ${Config.getConfig('custom_background.url') ? 'inline-block' : 'none'};">清除图片</button>
            <div id="custom_bg_preview" style="margin-top: 10px; ${Config.getConfig('custom_background.url') && Config.getConfig('custom_background.url').startsWith('data:') ? '' : 'display: none;'}">
              <img id="custom_bg_preview_img" src="${Config.getConfig('custom_background.url') || ''}" style="max-width: 300px; max-height: 200px; border: 1px solid #ddd; border-radius: 4px; display: block;">
            </div>
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">或输入URL:</label>
            <input type="text" name="custom_bg_url" value="${Config.getConfig('custom_background.url') && !Config.getConfig('custom_background.url').startsWith('data:') ? Config.getConfig('custom_background.url') : ''}" placeholder="输入图片URL" style="width: 400px; display: inline-block;">
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">重复方式:</label>
            <select name="custom_bg_repeat" style="width: 150px; display: inline-block;">
              <option value="repeat" ${(Config.getConfig('custom_background.repeat') || 'repeat') === 'repeat' ? 'selected' : ''}>重复</option>
              <option value="no-repeat" ${Config.getConfig('custom_background.repeat') === 'no-repeat' ? 'selected' : ''}>不重复</option>
              <option value="repeat-x" ${Config.getConfig('custom_background.repeat') === 'repeat-x' ? 'selected' : ''}>横向重复</option>
              <option value="repeat-y" ${Config.getConfig('custom_background.repeat') === 'repeat-y' ? 'selected' : ''}>纵向重复</option>
            </select>
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">位置:</label>
            <input type="text" name="custom_bg_position" value="${Config.getConfig('custom_background.position') || 'center'}" placeholder="如: center, top left, 50% 50%" style="width: 200px; display: inline-block;">
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">大小:</label>
            <input type="text" name="custom_bg_size" value="${Config.getConfig('custom_background.size') || 'cover'}" placeholder="如: auto, cover, contain, 100% 100%" style="width: 200px; display: inline-block;">
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: inline-block; width: 120px;">滚动方式:</label>
            <select name="custom_bg_attachment" style="width: 150px; display: inline-block;">
              <option value="scroll" ${(Config.getConfig('custom_background.attachment') || 'scroll') === 'scroll' ? 'selected' : ''}>随页面滚动</option>
              <option value="fixed" ${Config.getConfig('custom_background.attachment') === 'fixed' ? 'selected' : ''}>固定背景</option>
            </select>
          </div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">合并分类到导航栏</label>
        <div class="layui-input-block">
          <input type="checkbox" name="merge_category_to_nav" lay-skin="switch" lay-filter="merge_category_to_nav" lay-text="开启|关闭" ${Config.getConfig('merge_category_to_nav.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">将分类面板合并到导航栏，节省空间。多列模式下自动启用</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">隐藏用户统计面板</label>
        <div class="layui-input-block">
          <input type="checkbox" name="hide_user_stats_panel" lay-skin="switch" lay-filter="hide_user_stats_panel" lay-text="开启|关闭" ${Config.getConfig('hide_user_stats_panel.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">隐藏右侧面板中的"用户数目"和"欢迎新用户"面板</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">隐藏页脚</label>
        <div class="layui-input-block">
          <input type="checkbox" name="hide_footer" lay-skin="switch" lay-filter="hide_footer" lay-text="开启|关闭" ${Config.getConfig('hide_footer.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">隐藏页面底部的 footer 区域</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">隐藏分类标签</label>
        <div class="layui-input-block">
          <input type="checkbox" name="hide_post_category" lay-skin="switch" lay-filter="hide_post_category" lay-text="开启|关闭" ${Config.getConfig('hide_post_category.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">隐藏帖子列表中的分类标签（如"日常"、"技术"等）</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">隐藏帖子信息</label>
        <div class="layui-input-block">
          <input type="checkbox" name="hide_post_info" lay-skin="switch" lay-filter="hide_post_info" lay-text="开启|关闭" ${Config.getConfig('hide_post_info.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">隐藏帖子列表中的作者、浏览量、评论数等信息</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">隐藏推荐轮播</label>
        <div class="layui-input-block">
          <input type="checkbox" name="hide_topic_carousel" lay-skin="switch" lay-filter="hide_topic_carousel" lay-text="开启|关闭" ${Config.getConfig('hide_topic_carousel.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">隐藏页面顶部的推荐帖子轮播图</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">右侧面板关键词高亮</label>
        <div class="layui-input-block">
          <input type="checkbox" name="right_panel_highlight" lay-skin="switch" lay-filter="right_panel_highlight" lay-text="开启|关闭" ${Config.getConfig('right_panel_highlight.enabled') === true ? 'checked' : ''}>
          <div class="layui-form-mid layui-word-aux">在右侧面板显示关键词输入框，可在帖子标题和右侧面板中高亮显示关键词</div>
        </div>
      </div>
    </div>

    <fieldset id="config" class="layui-elem-field layui-field-title">
      <legend>配置</legend>
    </fieldset>
    <div style="padding: 20px 0;">
      <div class="layui-form-item">
        <label class="layui-form-label">导出设置</label>
        <div class="layui-input-block">
          <button type="button" class="layui-btn layui-btn-sm" id="nsx-export-settings">导出到剪贴板</button>
          <div class="layui-form-mid layui-word-aux">复制当前全部设置，方便备份或同步。</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">导入设置</label>
        <div class="layui-input-block">
          <textarea id="nsx-import-settings" class="layui-textarea" placeholder="粘贴之前导出的配置 JSON"></textarea>
          <div class="layui-form-mid layui-word-aux">导入前会自动校验格式，并覆盖现有设置。</div>
          <button type="button" class="layui-btn layui-btn-danger layui-btn-sm" id="nsx-import-apply" style="margin-top:10px;">导入并应用</button>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">默认样式</label>
        <div class="layui-input-block">
          <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="nsx-reset-to-default">一键设置默认样式</button>
          <div class="layui-form-mid layui-word-aux">将设置恢复为推荐的默认样式配置（不会覆盖version字段）。</div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">键盘快捷键</label>
        <div class="layui-input-block">
          <div style="background-color: var(--bg-sub-color, #f5f5f5); border-radius: 4px; padding: 15px; margin-top: 10px;">
            <div style="font-weight: bold; margin-bottom: 12px; color: var(--text-color, #333);">当前可用的快捷键：</div>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr style="border-bottom: 1px solid rgba(0,0,0,.1);">
                  <td style="padding: 8px 12px; font-weight: 500; color: var(--text-color, #333); width: 40%;">
                    <kbd style="background-color: var(--bg-main-color, #fff); border: 1px solid rgba(0,0,0,.2); border-radius: 3px; box-shadow: 0 1px 0 rgba(0,0,0,.2); padding: 3px 8px; font-family: monospace; font-size: 12px; color: var(--text-color, #333);">←</kbd>
                    <span style="margin-left: 5px;">或</span>
                    <kbd style="background-color: var(--bg-main-color, #fff); border: 1px solid rgba(0,0,0,.2); border-radius: 3px; box-shadow: 0 1px 0 rgba(0,0,0,.2); padding: 3px 8px; font-family: monospace; font-size: 12px; color: var(--text-color, #333);">ArrowLeft</kbd>
                  </td>
                  <td style="padding: 8px 12px; color: var(--text-color, #666);">跳转到上一页</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(0,0,0,.1);">
                  <td style="padding: 8px 12px; font-weight: 500; color: var(--text-color, #333);">
                    <kbd style="background-color: var(--bg-main-color, #fff); border: 1px solid rgba(0,0,0,.2); border-radius: 3px; box-shadow: 0 1px 0 rgba(0,0,0,.2); padding: 3px 8px; font-family: monospace; font-size: 12px; color: var(--text-color, #333);">→</kbd>
                    <span style="margin-left: 5px;">或</span>
                    <kbd style="background-color: var(--bg-main-color, #fff); border: 1px solid rgba(0,0,0,.2); border-radius: 3px; box-shadow: 0 1px 0 rgba(0,0,0,.2); padding: 3px 8px; font-family: monospace; font-size: 12px; color: var(--text-color, #333);">ArrowRight</kbd>
                  </td>
                  <td style="padding: 8px 12px; color: var(--text-color, #666);">跳转到下一页</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; font-weight: 500; color: var(--text-color, #333);">
                    <kbd style="background-color: var(--bg-main-color, #fff); border: 1px solid rgba(0,0,0,.2); border-radius: 3px; box-shadow: 0 1px 0 rgba(0,0,0,.2); padding: 3px 8px; font-family: monospace; font-size: 12px; color: var(--text-color, #333);">Ctrl</kbd>
                    <span style="margin: 0 3px;">+</span>
                    <kbd style="background-color: var(--bg-main-color, #fff); border: 1px solid rgba(0,0,0,.2); border-radius: 3px; box-shadow: 0 1px 0 rgba(0,0,0,.2); padding: 3px 8px; font-family: monospace; font-size: 12px; color: var(--text-color, #333);">Enter</kbd>
                  </td>
                  <td style="padding: 8px 12px; color: var(--text-color, #666);">提交回复（在回复编辑器中）</td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top: 12px; font-size: 12px; color: var(--text-color, #999); line-height: 1.6;">
              <div>💡 <strong>提示：</strong></div>
              <div style="margin-left: 20px; margin-top: 4px;">
                • 翻页快捷键仅在非输入框状态下生效<br>
                • 提交快捷键仅在回复编辑器中生效<br>
                • 快捷键不会与网站原有功能冲突
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
                };

                layer.open({
                    type: 1,
                    offset: 'r',
                    anim: 'slideLeft',
                    area: [layerWidth, '100%'],
                    scrollbar: false,
                    shade: 0.1,
                    shadeClose: true,
                    btn: ["保存设置", "取消"],
                    btnAlign: 'r',
                    title: '<i class="layui-icon layui-icon-set"></i> NodeSeek X 设置',
                    id: 'nsx-settings-layer',
                    content: generateSettingsContent(),
                    success: function(layero, index) {
                        // 初始化表单
                        layui.form.render();

                        // 菜单导航事件处理
                        const menuLinks = layero[0].querySelectorAll('#nsx-settings-menu a');
                        menuLinks.forEach(function(link) {
                            link.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                e.stopImmediatePropagation();
                                const targetId = this.getAttribute('data-target');
                                const target = layero[0].querySelector('#' + targetId);
                                if (target) {
                                    layero[0].querySelectorAll('#nsx-settings-menu li').forEach(li => li.classList.remove('layui-menu-item-checked'));
                                    this.closest('li').classList.add('layui-menu-item-checked');
                                    const contentArea = layero[0].querySelector('#nsx-settings-content');
                                    if (contentArea) {
                                        contentArea.scrollTo({
                                            top: target.offsetTop - 20,
                                            behavior: 'smooth'
                                        });
                                    }
                                }
                                return false;
                            });
                        });

                        // 滚动时高亮菜单
                        const docContent = layero[0].querySelector('#nsx-settings-content');
                        if (docContent) {
                            docContent.addEventListener('scroll', function() {
                                const scrollPos = docContent.scrollTop;
                                layero[0].querySelectorAll('#nsx-settings-content fieldset').forEach(function(el) {
                                    const topPos = el.offsetTop - 30;
      if (scrollPos >= topPos) {
                                        const id = el.getAttribute('id');
                                        layero[0].querySelectorAll('#nsx-settings-menu li').forEach(li => li.classList.remove('layui-menu-item-checked'));
                                        const navItem = layero[0].querySelector('#nsx-settings-menu a[data-target="' + id + '"]');
                                        if (navItem) {
                                            navItem.closest('li').classList.add('layui-menu-item-checked');
                                        }
                                    }
                                });
                            });
                        }

                        // 处理签到方式切换
                        layui.form.on('radio(sign_in_method)', function(data) {
                            const value = parseInt(data.value, 10);
                            if (value === 0) {
                                Config.updateConfig(`sign_in.${siteCode}.enabled`, false);
                                return;
                            }
                            Config.updateConfig(`sign_in.${siteCode}.enabled`, true);
                            if (value === 1) {
                                // 随机抽鸡腿
                                Config.updateConfig(`sign_in.${siteCode}.method`, 1);
                            } else if (value === 2) {
                                // 固定 5 个鸡腿
                                Config.updateConfig(`sign_in.${siteCode}.method`, 0);
                            }
                        });

                        // 处理所有开关
                        const switchNames = [
                            'signin_tips', 'auto_jump_external_links', 'loading_post',
                            'open_post_in_new_tab', 'quick_comment', 'block_members',
                            'block_posts', 'block_categories', 'remove_promotions', 'default_avatar', 'user_card_ext', 'level_tag', 'code_highlight',
                            'image_slide', 'visited_links', 'compact_mode', 'custom_background', 'header_opacity', 'frame_opacity',
                            'typography_title', 'typography_tag', 'typography_meta', 'typography_content',
                            'loading_overlay',
                            'merge_category_to_nav', 'hide_user_stats_panel', 'hide_footer',
                            'hide_post_category', 'hide_post_info', 'hide_topic_carousel', 'right_panel_highlight', 'show_all_users_stats'
                        ];

                        switchNames.forEach(name => {
                            layui.form.on('switch(' + name + ')', function(data) {
                                Config.updateConfig(`${name}.enabled`, data.elem.checked);
                                // 紧凑模式实时切换，无需刷新
                                if (name === 'compact_mode') {
                                    const optionsDiv = layero[0].querySelector('#compact_mode_options');
                                    const customDiv = layero[0].querySelector('#compact_mode_custom_options');
                                    if (optionsDiv) optionsDiv.style.display = data.elem.checked ? '' : 'none';
                                    if (customDiv) customDiv.style.display = data.elem.checked ? '' : 'none';
                                    _this.updateCompactModeStyle();
                                }
                                if (name === 'block_posts') {
                                    const keywordsBox = layero[0].querySelector('#block_post_keywords_box');
                                    if (keywordsBox) keywordsBox.style.display = data.elem.checked ? '' : 'none';
                                    if (data.elem.checked) {
                                        _this.refreshBlockKeywordRules();
                                        _this.blockPost();
                                    }
                                }
                                if (name === 'block_categories') {
                                    const categoriesBox = layero[0].querySelector('#block_categories_box');
                                    if (categoriesBox) categoriesBox.style.display = data.elem.checked ? '' : 'none';
                                    if (data.elem.checked) {
                                        _this.refreshBlockedCategories();
                                        _this.blockPostsByCategory();
                                    }
                                }
                                if (name === 'remove_promotions') {
                                    _this.togglePromotions();
                                }
                                if (name === 'default_avatar') {
                                    const box = layero[0].querySelector('#default_avatar_box');
                                    if (box) box.style.display = data.elem.checked ? '' : 'none';
                                    _this.replaceDefaultAvatars();
                                }
                                if (name === 'loading_overlay') {
                                    const box = layero[0].querySelector('#loading_overlay_box');
                                    if (box) box.style.display = data.elem.checked ? '' : 'none';
                                    if (!data.elem.checked) {
                                        removeInitialOverlay();
                                    }
                                }
                                if (name === 'header_opacity') {
                                    const box = layero[0].querySelector('#header_opacity_box');
                                    if (box) box.style.display = data.elem.checked ? '' : 'none';
                                    _this.updateHeaderOpacityStyle();
                                }
                                if (name === 'frame_opacity') {
                                    const box = layero[0].querySelector('#frame_opacity_box');
                                    if (box) box.style.display = data.elem.checked ? '' : 'none';
                                    _this.updateFrameOpacityStyle();
                                }
                                if (name === 'typography_title' || name === 'typography_tag' || name === 'typography_meta' || name === 'typography_content') {
                                    const type = name.split('_')[1];
                                    Config.updateConfig(`typography.${type}.enabled`, data.elem.checked);
                                    _this.updateTypography(type);
                                }
                                // 自定义背景图实时切换
                                if (name === 'custom_background') {
                                    const optionsDiv = layero[0].querySelector('#custom_background_options');
                                    if (data.elem.checked) {
                                        if (optionsDiv) optionsDiv.style.display = '';
                                        _this.updateCustomBackground();
                                    } else {
                                        if (optionsDiv) optionsDiv.style.display = 'none';
                                        _this.updateCustomBackground();
                                    }
                                }
                                if (name === 'visited_links') {
                                    _this.updateVisitedLinkStyle();
                                }
                                if (name === 'show_all_users_stats') {
                                    const positionBox = document.getElementById('show_all_users_stats_position_box');
                                    if (positionBox) {
                                        positionBox.style.display = data.elem.checked ? '' : 'none';
                                    }
                                    if (data.elem.checked) {
                                        _this.showAllUsersStats();
                                    } else {
                                        _this.hideAllUsersStats();
                                    }
                                }
                                // 合并分类到导航栏实时切换
                                if (name === 'merge_category_to_nav') {
                                    _this.mergeCategoryToNav();
                                }
                                // 隐藏用户统计面板实时切换
                                if (name === 'hide_user_stats_panel') {
                                    _this.toggleUserStatsPanel();
                                }
                                // 隐藏页脚实时切换
                                if (name === 'hide_footer') {
                                    _this.toggleFooter();
                                }
                                // 隐藏分类标签实时切换
                                if (name === 'hide_post_category') {
                                    _this.togglePostCategory();
                                }
                                // 隐藏帖子信息实时切换
                                if (name === 'hide_post_info') {
                                    _this.togglePostInfo();
                                }
                                // 隐藏推荐轮播实时切换
                                if (name === 'hide_topic_carousel') {
                                    _this.toggleTopicCarousel();
                                }
                                // 右侧面板关键词高亮实时切换
                                if (name === 'right_panel_highlight') {
                                    if (data.elem.checked) {
                                        // 显示右侧面板输入框
                                        _this.addRightPanelHighlightInput();
                                        _this.applyRightPanelHighlight();
                                        _this.startRightPanelHighlightObserver();
                                    } else {
                                        // 隐藏右侧面板输入框并移除高亮
                                        const inputPanel = document.querySelector('.nsx-highlight-input-panel');
                                        if (inputPanel) {
                                            inputPanel.remove();
                                        }
                                        _this.applyRightPanelHighlight(); // 移除高亮
                                        if (_this.rightPanelHighlightObserver) {
                                            _this.rightPanelHighlightObserver.disconnect();
                                            _this.rightPanelHighlightObserver = null;
                                        }
                                    }
                                }
                            });
                        });

                        const blockKeywordTextarea = layero[0].querySelector('textarea[name="block_post_keywords"]');
                        if (blockKeywordTextarea) {
                            let keywordTimer = null;
                            const persistKeywords = () => {
                                const parsed = _this.parseBlockKeywordInput(blockKeywordTextarea.value);
                                Config.updateConfig('block_posts.keywords', parsed);
                                _this.refreshBlockKeywordRules();
                                _this.blockPost();
                            };
                            const schedulePersist = () => {
                                clearTimeout(keywordTimer);
                                keywordTimer = setTimeout(persistKeywords, 400);
                            };
                            blockKeywordTextarea.addEventListener('input', schedulePersist);
                            blockKeywordTextarea.addEventListener('blur', schedulePersist);
                        }

                        const blockCategoriesTextarea = layero[0].querySelector('textarea[name="block_categories_list"]');
                        if (blockCategoriesTextarea) {
                            let categoryTimer = null;
                            const persistCategories = () => {
                                const parsed = _this.parseBlockedCategoryInput(blockCategoriesTextarea.value);
                                Config.updateConfig('block_categories.categories', parsed);
                                _this.refreshBlockedCategories();
                                _this.blockPostsByCategory();
                            };
                            const scheduleCategoriesPersist = () => {
                                clearTimeout(categoryTimer);
                                categoryTimer = setTimeout(persistCategories, 400);
                            };
                            blockCategoriesTextarea.addEventListener('input', scheduleCategoriesPersist);
                            blockCategoriesTextarea.addEventListener('blur', scheduleCategoriesPersist);
                        }

                        const headerOpacityRange = layero[0].querySelector('input[name="header_opacity_value"]');
                        if (headerOpacityRange) {
                            headerOpacityRange.addEventListener('input', function() {
                                const parsed = parseFloat(this.value);
                                const value = Number.isNaN(parsed) ? 0.92 : parsed;
                                const display = layero[0].querySelector('#header_opacity_value_display');
                                if (display) display.textContent = value.toFixed(2);
                                Config.updateConfig('header_opacity.value', value);
                                _this.updateHeaderOpacityStyle();
                            });
                        }

                        layui.form.on('checkbox(header_opacity_blur_toggle)', function(data) {
                            Config.updateConfig('header_opacity.blur_enabled', data.elem.checked);
                            _this.updateHeaderOpacityStyle();
                        });

                        const headerBlurInput = layero[0].querySelector('input[name="header_opacity_blur"]');
                        if (headerBlurInput) {
                            const handler = () => {
                                Config.updateConfig('header_opacity.blur', headerBlurInput.value);
                                _this.updateHeaderOpacityStyle();
                            };
                            headerBlurInput.addEventListener('input', handler);
                            headerBlurInput.addEventListener('blur', handler);
                        }

                        const headerSaturateInput = layero[0].querySelector('input[name="header_opacity_saturate"]');
                        if (headerSaturateInput) {
                            const handler = () => {
                                Config.updateConfig('header_opacity.saturate', headerSaturateInput.value);
                                _this.updateHeaderOpacityStyle();
                            };
                            headerSaturateInput.addEventListener('input', handler);
                            headerSaturateInput.addEventListener('blur', handler);
                        }

                        const frameOpacityRange = layero[0].querySelector('input[name="frame_opacity_value"]');
                        if (frameOpacityRange) {
                            frameOpacityRange.addEventListener('input', function() {
                                const parsed = parseFloat(this.value);
                                const value = Number.isNaN(parsed) ? 0.95 : parsed;
                                const display = layero[0].querySelector('#frame_opacity_value_display');
                                if (display) display.textContent = value.toFixed(2);
                                Config.updateConfig('frame_opacity.value', value);
                                _this.updateFrameOpacityStyle();
                            });
                        }

                        layui.form.on('checkbox(frame_opacity_blur_toggle)', function(data) {
                            Config.updateConfig('frame_opacity.blur_enabled', data.elem.checked);
                            _this.updateFrameOpacityStyle();
                        });

                        layui.form.on('checkbox(header_opacity_saturate_toggle)', function(data) {
                            Config.updateConfig('header_opacity.saturate_enabled', data.elem.checked);
                            _this.updateHeaderOpacityStyle();
                        });

                        layui.form.on('checkbox(frame_opacity_saturate_toggle)', function(data) {
                            Config.updateConfig('frame_opacity.saturate_enabled', data.elem.checked);
                            _this.updateFrameOpacityStyle();
                        });

                        const frameBlurInput = layero[0].querySelector('input[name="frame_opacity_blur"]');
                        if (frameBlurInput) {
                            const handler = () => {
                                Config.updateConfig('frame_opacity.blur', frameBlurInput.value);
                                _this.updateFrameOpacityStyle();
                            };
                            frameBlurInput.addEventListener('input', handler);
                            frameBlurInput.addEventListener('blur', handler);
                        }

                        const frameSaturateInput = layero[0].querySelector('input[name="frame_opacity_saturate"]');
                        if (frameSaturateInput) {
                            const handler = () => {
                                Config.updateConfig('frame_opacity.saturate', frameSaturateInput.value);
                                _this.updateFrameOpacityStyle();
                            };
                            frameSaturateInput.addEventListener('input', handler);
                            frameSaturateInput.addEventListener('blur', handler);
                        }

                        const loadingOverlayRange = layero[0].querySelector('input[name="loading_overlay_duration"]');
                        if (loadingOverlayRange) {
                            const handler = () => {
                                const value = parseInt(loadingOverlayRange.value, 10) || INITIAL_OVERLAY_DURATION_DEFAULT;
                                const display = layero[0].querySelector('#loading_overlay_duration_display');
                                if (display) display.textContent = `${value}ms`;
                                Config.updateConfig('loading_overlay.duration', value);
                            };
                            loadingOverlayRange.addEventListener('input', handler);
                            loadingOverlayRange.addEventListener('blur', handler);
                        }

                        const defaultAvatarUrlInput = layero[0].querySelector('input[name="default_avatar_url"]');
                        if (defaultAvatarUrlInput) {
                            const handler = () => {
                                Config.updateConfig('default_avatar.url', defaultAvatarUrlInput.value.trim());
                                _this.replaceDefaultAvatars();
                            };
                            defaultAvatarUrlInput.addEventListener('input', handler);
                            defaultAvatarUrlInput.addEventListener('blur', handler);
                        }
                        layui.form.on('checkbox(default_avatar_auto)', function(data) {
                            Config.updateConfig('default_avatar.auto_detect', data.elem.checked);
                            _this.replaceDefaultAvatars();
                        });

                        const exportBtn = layero[0].querySelector('#nsx-export-settings');
                        if (exportBtn) {
                            exportBtn.addEventListener('click', () => {
                                const settings = util.getValue('settings') || {};
                                const json = JSON.stringify(settings, null, 2);
                                navigator.clipboard.writeText(json).then(() => {
                                    message.success('设置已复制到剪贴板');
                                }).catch(err => {
                                    // console.error(err);
                                    message.error('复制失败，请手动复制文本域内容');
                                });
                            });
                        }

                        const importBtn = layero[0].querySelector('#nsx-import-apply');
                        const importTextarea = layero[0].querySelector('#nsx-import-settings');
                        if (importBtn && importTextarea) {
                            importBtn.addEventListener('click', () => {
                                const text = importTextarea.value.trim();
                                if (!text) {
                                    message.warning('请先粘贴配置 JSON');
                                    return;
                                }
                                try {
                                    const parsed = JSON.parse(text);
                                    // 合并默认配置，确保所有配置项都存在
                                    const defaultConfig = opts.settings;
                                    const mergeDefaults = (stored, defaults) => {
                                        Object.keys(defaults).forEach(key => {
                                            if (typeof defaults[key] === 'object' && defaults[key] !== null && !(defaults[key] instanceof Array)) {
                                                if (!stored[key]) stored[key] = {};
                                                mergeDefaults(stored[key], defaults[key]);
                                            } else {
                                                if (stored[key] === undefined) {
                                                    stored[key] = defaults[key];
                                                }
                                            }
                                        });
                                    };
                                    mergeDefaults(parsed, defaultConfig);
                                    // 保留version字段
                                    const currentSettings = util.getValue('settings') || {};
                                    parsed.version = currentSettings.version || version;
                                    util.setValue('settings', parsed);
                                    message.success('配置导入成功，正在刷新...');
                                    setTimeout(() => location.reload(), 800);
                                } catch (err) {
                                    // console.error(err);
                                    message.error('导入失败：JSON 格式不正确');
                                }
                            });
                        }

                        // 一键设置默认样式
                        const resetToDefaultBtn = layero[0].querySelector('#nsx-reset-to-default');
                        if (resetToDefaultBtn) {
                            resetToDefaultBtn.addEventListener('click', () => {
                                const defaultConfig = {
                                    "sign_in": {
                                        "ns": {
                                            "enabled": true,
                                            "method": 0,
                                            "last_date": "",
                                            "ignore_date": ""
                                        },
                                        "df": {
                                            "enabled": true,
                                            "method": 0,
                                            "last_date": "",
                                            "ignore_date": ""
                                        }
                                    },
                                    "signin_tips": {
                                        "enabled": true
                                    },
                                    "re_signin": {
                                        "enabled": true
                                    },
                                    "auto_jump_external_links": {
                                        "enabled": true
                                    },
                                    "loading_post": {
                                        "enabled": false
                                    },
                                    "loading_comment": {
                                        "enabled": false
                                    },
                                    "quick_comment": {
                                        "enabled": true
                                    },
                                    "open_post_in_new_tab": {
                                        "enabled": false
                                    },
                                    "block_members": {
                                        "enabled": true
                                    },
                                    "block_posts": {
                                        "enabled": true,
                                        "keywords": []
                                    },
                                    "block_categories": {
                                        "enabled": false,
                                        "categories": []
                                    },
                                    "level_tag": {
                                        "enabled": true,
                                        "low_lv_alarm": false,
                                        "low_lv_max_days": 30
                                    },
                                    "code_highlight": {
                                        "enabled": true
                                    },
                                    "image_slide": {
                                        "enabled": true
                                    },
                                    "visited_links": {
                                        "enabled": true,
                                        "link_color": "",
                                        "visited_color": "",
                                        "dark_link_color": "",
                                        "dark_visited_color": "",
                                        "hide_visited": false
                                    },
                                    "user_card_ext": {
                                        "enabled": true
                                    },
                                    "compact_mode": {
                                        "enabled": true,
                                        "columns": 4,
                                        "padding": "6px 10px",
                                        "avatarSize": 26,
                                        "titleFontSize": 13,
                                        "infoFontSize": 10,
                                        "marginBottom": 2
                                    },
                                    "custom_background": {
                                        "enabled": false,
                                        "url": "",
                                        "repeat": "repeat",
                                        "position": "center",
                                        "size": "cover",
                                        "attachment": "scroll"
                                    },
                                    "merge_category_to_nav": {
                                        "enabled": true
                                    },
                                    "remove_promotions": {
                                        "enabled": true
                                    },
                                    "header_opacity": {
                                        "enabled": true,
                                        "value": 0.18,
                                        "effect": true,
                                        "blur": 16,
                                        "saturate": 180,
                                        "blur_enabled": false,
                                        "saturate_enabled": false
                                    },
                                    "frame_opacity": {
                                        "enabled": false,
                                        "value": 1,
                                        "blur_enabled": false,
                                        "saturate_enabled": false,
                                        "blur": 12,
                                        "saturate": 180
                                    },
                                    "default_avatar": {
                                        "enabled": true,
                                        "url": "/avatar/14049.png",
                                        "auto_detect": true
                                    },
                                    "loading_overlay": {
                                        "enabled": false,
                                        "duration": 300
                                    },
                                    "typography": {
                                        "title": {
                                            "enabled": false,
                                            "fontFamily": "",
                                            "fontSize": "",
                                            "color": "",
                                            "fontStyle": "",
                                            "letterSpacing": "",
                                            "ligatures": ""
                                        },
                                        "tag": {
                                            "enabled": false,
                                            "fontFamily": "",
                                            "fontSize": "",
                                            "color": "",
                                            "fontStyle": "",
                                            "letterSpacing": "",
                                            "ligatures": ""
                                        },
                                        "meta": {
                                            "enabled": false,
                                            "fontFamily": "",
                                            "fontSize": "",
                                            "color": "",
                                            "fontStyle": "",
                                            "letterSpacing": "",
                                            "ligatures": ""
                                        },
                                        "content": {
                                            "enabled": false,
                                            "fontFamily": "",
                                            "fontSize": "",
                                            "color": "",
                                            "fontStyle": "",
                                            "letterSpacing": "",
                                            "ligatures": ""
                                        }
                                    },
                                    "hide_user_stats_panel": {
                                        "enabled": true
                                    },
                                    "hide_footer": {
                                        "enabled": true
                                    },
                                    "hide_post_category": {
                                        "enabled": true
                                    },
                                    "hide_post_info": {
                                        "enabled": false
                                    },
                                    "hide_topic_carousel": {
                                        "enabled": true
                                    },
                                    "post_sort": {
                                        "enabled": false,
                                        "mode": "none",
                                        "visited_to_bottom": true
                                    },
                                    "show_all_users_stats": {
                                        "enabled": false,
                                        "position": "below"
                                    },
                                    "right_panel_highlight": {
                                        "enabled": false,
                                        "keywords": []
                                    }
                                };

                                // 保留当前的version
                                const currentSettings = util.getValue('settings') || {};
                                defaultConfig.version = currentSettings.version || version;

                                // 确认对话框
                                unsafeWindow.mscConfirm('确定要恢复默认样式吗？', '这将覆盖您当前的所有设置（除了版本号），是否继续？', function() {
                                    util.setValue('settings', defaultConfig);
                                    message.success('默认样式已应用，正在刷新页面...');
                                    setTimeout(() => location.reload(), 800);
                                });
                            });
                        }

                        const typographyFields = ['fontFamily','fontSize','color','fontStyle','letterSpacing','ligatures'];
                        const typographyTypes = ['title','tag','meta','content'];
                        typographyTypes.forEach(type => {
                            typographyFields.forEach(field => {
                                const input = layero[0].querySelector(`input[name="typography_${type}_${field}"]`);
                                if (input) {
                                    const handler = () => {
                                        Config.updateConfig(`typography.${type}.${field}`, input.value);
                                        _this.updateTypography(type);
                                    };
                                    input.addEventListener('input', handler);
                                    input.addEventListener('blur', handler);
                                }
                            });
                        });

                        // 紧凑模式列数切换
                        layui.form.on('radio(compact_columns)', function(data) {
                            const columns = parseInt(data.value);
                            Config.updateConfig('compact_mode.columns', columns);
                            _this.updateCompactModeStyle();
                            // 如果列数 >= 2，自动启用合并分类到导航栏
                            if (columns >= 2) {
                                Config.updateConfig('merge_category_to_nav.enabled', true);
                                // 更新开关状态
                                const switchElem = layero[0].querySelector('input[name="merge_category_to_nav"]');
                                if (switchElem && !switchElem.checked) {
                                    switchElem.checked = true;
                                    layui.form.render('checkbox');
                                }
                                _this.mergeCategoryToNav();
                            }
                        });

                        // 帖子排序模式切换
                        layui.form.on('radio(post_sort_mode)', function(data) {
                            const mode = data.value;
                            Config.updateConfig('post_sort.mode', mode);
                            Config.updateConfig('post_sort.enabled', mode !== 'none');
                            _this.sortPostList();
                        });

                        // 用户统计信息位置切换
                        layui.form.on('radio(show_all_users_stats_position)', function(data) {
                            const position = data.value;
                            Config.updateConfig('show_all_users_stats.position', position);
                            // 如果功能已启用，重新渲染所有统计信息
                            if (Config.getConfig('show_all_users_stats.enabled') === true) {
                                _this.hideAllUsersStats();
                                setTimeout(() => {
                                    _this.showAllUsersStats();
                                }, 100);
                            }
                        });

                        // 已访问帖子置底切换
                        layui.form.on('checkbox(visited_to_bottom)', function(data) {
                            Config.updateConfig('post_sort.visited_to_bottom', data.elem.checked);
                            _this.sortPostList();
                        });

                        // 紧凑模式自定义数值变化
                        const compactInputs = ['compact_padding', 'compact_avatarSize', 'compact_titleFontSize', 'compact_infoFontSize', 'compact_marginBottom'];
                        compactInputs.forEach(inputName => {
                            const input = layero[0].querySelector(`input[name="${inputName}"]`);
                            if (input) {
                                input.addEventListener('input', function() {
                                    let value = this.value;
                                    if (inputName === 'compact_padding') {
                                        Config.updateConfig('compact_mode.padding', value);
                                    } else if (inputName === 'compact_avatarSize') {
                                        Config.updateConfig('compact_mode.avatarSize', parseInt(value));
                                    } else if (inputName === 'compact_titleFontSize') {
                                        Config.updateConfig('compact_mode.titleFontSize', parseInt(value));
                                    } else if (inputName === 'compact_infoFontSize') {
                                        Config.updateConfig('compact_mode.infoFontSize', parseInt(value));
                                    } else if (inputName === 'compact_marginBottom') {
                                        Config.updateConfig('compact_mode.marginBottom', parseInt(value));
                                    }
                                    _this.updateCompactModeStyle();
                                });
                            }
                        });

                        // 自定义背景图文件上传
                        const uploadBtn = layero[0].querySelector('#custom_bg_upload_btn');
                        const fileInput = layero[0].querySelector('#custom_bg_upload');
                        const clearBtn = layero[0].querySelector('#custom_bg_clear_btn');
                        const previewDiv = layero[0].querySelector('#custom_bg_preview');
                        const previewImg = layero[0].querySelector('#custom_bg_preview_img');
                        const urlInput = layero[0].querySelector('input[name="custom_bg_url"]');

                        if (uploadBtn && fileInput) {
                            uploadBtn.addEventListener('click', () => {
                                fileInput.click();
                            });

                            fileInput.addEventListener('change', function(e) {
                                const file = e.target.files[0];
                                if (!file) return;

                                // 检查文件类型
                                if (!file.type.startsWith('image/')) {
                                    message.warning('请选择图片文件');
                                    return;
                                }

                                // 提示：大图片可能会因为GM存储限制而保存失败
                                if (file.size > 5 * 1024 * 1024) {
                                    const proceed = confirm(`图片较大（${(file.size / 1024 / 1024).toFixed(2)}MB），转换为base64后可能超过GM存储限制（通常5-10MB），是否继续？\n\n建议：使用小于3MB的图片以获得最佳体验。`);
                                    if (!proceed) {
                                        fileInput.value = '';
                                        return;
                                    }
                                }

                                const reader = new FileReader();
                                reader.onload = function(e) {
                                    const base64 = e.target.result;

                                    // 尝试保存，如果失败会抛出错误
                                    try {
                                        Config.updateConfig('custom_background.url', base64);
                                    } catch (err) {
                                        message.error('图片数据过大，无法保存。请使用较小的图片（建议小于3MB）。');
                                        fileInput.value = '';
                                        return;
                                    }

                                    // 更新预览
                                    if (previewImg) {
                                        previewImg.src = base64;
                                    }
                                    if (previewDiv) {
                                        previewDiv.style.display = 'block';
                                    }
                                    if (clearBtn) {
                                        clearBtn.style.display = 'inline-block';
                                    }
                                    if (urlInput) {
                                        urlInput.value = '';
                                    }

                                    // 立即应用
                                    if (Config.getConfig('custom_background.enabled')) {
                                        _this.updateCustomBackground();
                                    }

                                    message.success('图片上传成功');
                                };
                                reader.onerror = function() {
                                    message.error('图片读取失败');
                                };
                                reader.readAsDataURL(file);
                            });
                        }

                        // 清除图片
                        if (clearBtn) {
                            clearBtn.addEventListener('click', function() {
                                Config.updateConfig('custom_background.url', '');
                                if (previewDiv) {
                                    previewDiv.style.display = 'none';
                                }
                                if (previewImg) {
                                    previewImg.src = '';
                                }
                                if (fileInput) {
                                    fileInput.value = '';
                                }
                                if (urlInput) {
                                    urlInput.value = '';
                                }
                                this.style.display = 'none';

                                if (Config.getConfig('custom_background.enabled')) {
                                    _this.updateCustomBackground();
                                }

                                message.success('图片已清除');
                            });
                        }

                        // 自定义背景图设置变化
                        const bgInputs = ['custom_bg_url', 'custom_bg_position', 'custom_bg_size'];
                        bgInputs.forEach(inputName => {
                            const input = layero[0].querySelector(`input[name="${inputName}"]`);
                            if (input) {
                                input.addEventListener('input', function() {
                                    let value = this.value;
                                    if (inputName === 'custom_bg_url') {
                                        // 如果输入了URL，清除base64预览
                                        if (value && !value.startsWith('data:')) {
                                            Config.updateConfig('custom_background.url', value);
                                            if (previewDiv) {
                                                previewDiv.style.display = 'none';
                                            }
                                            if (clearBtn) {
                                                clearBtn.style.display = 'inline-block';
                                            }
                                        }
                                    } else if (inputName === 'custom_bg_position') {
                                        Config.updateConfig('custom_background.position', value);
                                    } else if (inputName === 'custom_bg_size') {
                                        Config.updateConfig('custom_background.size', value);
                                    }
                                    if (Config.getConfig('custom_background.enabled')) {
                                        _this.updateCustomBackground();
                                    }
                                });
                            }
                        });

                        // 自定义背景图下拉框变化
                        const bgSelects = ['custom_bg_repeat', 'custom_bg_attachment'];
                        bgSelects.forEach(selectName => {
                            const select = layero[0].querySelector(`select[name="${selectName}"]`);
                            if (select) {
                                select.addEventListener('change', function() {
                                    let value = this.value;
                                    if (selectName === 'custom_bg_repeat') {
                                        Config.updateConfig('custom_background.repeat', value);
                                    } else if (selectName === 'custom_bg_attachment') {
                                        Config.updateConfig('custom_background.attachment', value);
                                    }
                                    if (Config.getConfig('custom_background.enabled')) {
                                        _this.updateCustomBackground();
                                    }
                                });
                            }
                        });
                    },
                    yes: function(index, layero) {
                        // 同步下拉加载设置
                        const loadingPost = layero.find('input[name="loading_post"]').prop('checked');
                        Config.updateConfig('loading_post.enabled', loadingPost);
                        Config.updateConfig('loading_comment.enabled', loadingPost);

                        // 保存紧凑模式设置
                        const compactColumns = layero.find('input[name="compact_columns"]:checked').val();
                        if (compactColumns) {
                            Config.updateConfig('compact_mode.columns', parseInt(compactColumns));
                        }
                        const compactPadding = layero.find('input[name="compact_padding"]').val();
                        if (compactPadding) {
                            Config.updateConfig('compact_mode.padding', compactPadding);
                        }
                        const compactAvatarSize = layero.find('input[name="compact_avatarSize"]').val();
                        if (compactAvatarSize) {
                            Config.updateConfig('compact_mode.avatarSize', parseInt(compactAvatarSize));
                        }
                        const compactTitleFontSize = layero.find('input[name="compact_titleFontSize"]').val();
                        if (compactTitleFontSize) {
                            Config.updateConfig('compact_mode.titleFontSize', parseInt(compactTitleFontSize));
                        }
                        const compactInfoFontSize = layero.find('input[name="compact_infoFontSize"]').val();
                        if (compactInfoFontSize) {
                            Config.updateConfig('compact_mode.infoFontSize', parseInt(compactInfoFontSize));
                        }
                        const compactMarginBottom = layero.find('input[name="compact_marginBottom"]').val();
                        if (compactMarginBottom) {
                            Config.updateConfig('compact_mode.marginBottom', parseInt(compactMarginBottom));
                        }

                        // 保存自定义背景图设置
                        const customBgUrl = layero.find('input[name="custom_bg_url"]').val();
                        // 如果URL输入框有值，使用输入框的值；否则保留已保存的base64数据
                        if (customBgUrl && customBgUrl.trim() !== '') {
                            Config.updateConfig('custom_background.url', customBgUrl.trim());
                        } else {
                            // 如果URL输入框为空，检查是否已有base64数据，如果有则保留
                            const currentUrl = Config.getConfig('custom_background.url');
                            if (currentUrl && currentUrl.startsWith('data:')) {
                                // 保留已上传的base64数据，不做任何操作
                            } else if (customBgUrl === '') {
                                // 如果用户清空了URL输入框，且没有base64数据，则清空配置
                                Config.updateConfig('custom_background.url', '');
                            }
                        }
                        const customBgRepeat = layero.find('select[name="custom_bg_repeat"]').val();
                        if (customBgRepeat) {
                            Config.updateConfig('custom_background.repeat', customBgRepeat);
                        }
                        const customBgPosition = layero.find('input[name="custom_bg_position"]').val();
                        if (customBgPosition !== undefined) {
                            Config.updateConfig('custom_background.position', customBgPosition);
                        }
                        const customBgSize = layero.find('input[name="custom_bg_size"]').val();
                        if (customBgSize !== undefined) {
                            Config.updateConfig('custom_background.size', customBgSize);
                        }
                        const customBgAttachment = layero.find('select[name="custom_bg_attachment"]').val();
                        if (customBgAttachment) {
                            Config.updateConfig('custom_background.attachment', customBgAttachment);
                        }

                        // 更新紧凑模式样式
                        main.updateCompactModeStyle();

                        // 更新自定义背景图
                        main.updateCustomBackground();

                        // 同步新标签页设置到 IndexedDB
                        const openInNewTab = layero.find('input[name="open_post_in_new_tab"]').prop('checked');
                        if (openInNewTab !== Config.getConfig('open_post_in_new_tab.enabled')) {
                            _this.switchOpenPostInNewTab('open_post_in_new_tab', []);
                        }

                        // 保存用户统计信息位置设置
                        const statsPosition = layero.find('input[name="show_all_users_stats_position"]:checked').val();
                        if (statsPosition) {
                            Config.updateConfig('show_all_users_stats.position', statsPosition);
                        }

                        message.success('设置已保存');
                        layer.close(index);
                    }
                });
            },
            addCodeHighlight() {
                const codes = document.querySelectorAll(".post-content pre code");
                if (codes) {
                    codes.forEach(function (code) {
                        const copyBtn = util.createElement("span", { staticClass: "copy-code", attrs: { title: "复制代码" }, on: { click: copyCode } }, [util.createElement("svg", { staticClass: 'iconpark-icon' }, [util.createElement("use", { attrs: { href: "#copy" } }, [], document, "http://www.w3.org/2000/svg")], document, "http://www.w3.org/2000/svg")]);
                        code.after(copyBtn);
                    });
                }
                function copyCode(e) {
                    const pre = this.closest('pre');
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(pre.querySelector("code"));
                    selection.removeAllRanges();
                    selection.addRange(range);
                    document.execCommand('copy');
                    selection.removeAllRanges();
                    updateCopyButton(this);
                    layer.tips(`复制成功`, this, { tips: 4, time: 1000 })
                }
                function updateCopyButton(ele) {
                    ele.querySelector("use").setAttribute("href", "#check");
                    util.sleep(1000).then(() => ele.querySelector("use").setAttribute("href", "#copy"));
                }
            },

            updateCompactModeStyle() {
                const enabled = Config.getConfig('compact_mode.enabled');
                if (enabled === false) {
                toggleRootClass('nsx-compact-mode', false);
                applyCompactModeStyleFromConfig(null);
                removeCompactPendingClass();
                removeInitialOverlay();
                // 禁用紧凑模式时，也需要更新分类合并
                this.mergeCategoryToNav();
                return;
            }
            const config = normalizeCompactConfig({
                columns: Config.getConfig('compact_mode.columns'),
                padding: Config.getConfig('compact_mode.padding'),
                avatarSize: Config.getConfig('compact_mode.avatarSize'),
                titleFontSize: Config.getConfig('compact_mode.titleFontSize'),
                infoFontSize: Config.getConfig('compact_mode.infoFontSize'),
                marginBottom: Config.getConfig('compact_mode.marginBottom')
            });
            // 先添加类名，再调用 mergeCategoryToNav，确保能正确判断状态
            toggleRootClass('nsx-compact-mode', true);
            if (config.columns >= 2 && !Config.getConfig('merge_category_to_nav.enabled')) {
                Config.updateConfig('merge_category_to_nav.enabled', true);
            }
            // 更新分类合并（需要知道当前的紧凑模式状态）
            this.mergeCategoryToNav();
            applyCompactModeStyleFromConfig(config);
            const overlaySettings = getRuntimeOverlaySettings();
            scheduleRemoveInitialOverlay(overlaySettings.duration, overlaySettings.enabled);
            },

            updateCustomBackground() {
                const config = Config.getConfig('custom_background');
                if (!config || config.enabled === false || !config.url) {
                    applyCustomBackgroundStyle(null);
                    return;
                }
                applyCustomBackgroundStyle({
                    url: config.url,
                    repeat: config.repeat || 'repeat',
                    position: config.position || 'center',
                    size: config.size || 'cover',
                    attachment: config.attachment || 'scroll'
                });
            },
            updateVisitedLinkStyle() {
                const cfg = Config.getConfig('visited_links');
                if (!cfg || cfg.enabled === false) {
                    applyVisitedLinkStyle(null);
                    toggleRootClass('nsx-hide-visited', false);
                    return;
                }
                const normalized = {
                    lightLink: (cfg.link_color || '').trim(),
                    lightVisited: (cfg.visited_color || '').trim() || '#afb9c1',
                    darkLink: (cfg.dark_link_color || '').trim(),
                    darkVisited: (cfg.dark_visited_color || '').trim() || cfg.visited_color || '#393f4e'
                };
                applyVisitedLinkStyle(normalized);
                toggleRootClass('nsx-hide-visited', cfg.hide_visited === true);
            },
            updateTypography(type) {
                const cfg = Config.getConfig(`typography.${type}`);
                applyTypographyStyle(type, cfg);
            },
            updateAllTypography() {
                ['title', 'tag', 'meta', 'content'].forEach(type => this.updateTypography(type));
            },
            toggleUserStatsPanel() {
                const enabled = Config.getConfig('hide_user_stats_panel.enabled');
                const rightPanel = document.querySelector('#nsk-right-panel-container');

                if (!rightPanel) return;

                // 查找包含"用户数目"或"欢迎新用户"的面板
                const panels = rightPanel.querySelectorAll('.nsk-panel');
                panels.forEach(panel => {
                    const h4 = panel.querySelector('h4');
                    if (h4) {
                        const text = h4.textContent || '';
                        // 检查是否包含"用户数目"或"欢迎新用户"
                        if (text.includes('用户数目') || text.includes('欢迎新用户') || text.includes('📈') || text.includes('🎉')) {
                            panel.style.display = enabled ? 'none' : '';
                        }
                    }
                });
            },
            // 在右侧面板添加关键词高亮输入框
            addRightPanelHighlightInput() {
                const enabled = Config.getConfig('right_panel_highlight.enabled');
                if (enabled !== true) {
                    // 如果开关关闭，移除输入框
                    const existingPanel = document.querySelector('.nsx-highlight-input-panel');
                    if (existingPanel) {
                        existingPanel.remove();
                    }
                    return;
                }

                const rightPanel = document.querySelector('#nsk-right-panel-container');
                if (!rightPanel) return;

                // 检查是否已存在
                if (rightPanel.querySelector('.nsx-highlight-input-panel')) return;

                // 创建面板
                const panel = document.createElement('div');
                panel.className = 'nsk-panel nsx-highlight-input-panel';
                panel.innerHTML = `
                    <h4 aria-level="2">
                        <span style="font-weight: bold;">🔍 关键词高亮</span>
                    </h4>
                    <div style="margin-top: 8px;">
                        <textarea 
                            id="nsx-right-panel-keywords-input" 
                            class="layui-textarea" 
                            style="min-height: 60px; font-size: 12px; resize: vertical;"
                            placeholder="一行一个关键词，支持正则表达式（使用 /正则/flags 格式）&#10;例如：VPS、服务器、/\\d+GB/i"
                        ></textarea>
                        <div id="nsx-highlight-help-text" style="margin-top: 5px; font-size: 11px; color: #888; display: block;">
                            <div style="margin-bottom: 4px;"><strong>使用说明：</strong></div>
                            <div style="margin-left: 8px; line-height: 1.6;">
                                • 每行输入一个关键词，使用<strong>换行符</strong>分隔<br>
                                • 支持普通文本匹配（不区分大小写）<br>
                                • 支持正则表达式：使用 <code>/正则/flags</code> 格式<br>
                                • 示例：<code>VPS</code>、<code>服务器</code>、<code>/\\d+GB/i</code>
                            </div>
                        </div>
                        <div id="nsx-highlight-status-text" style="margin-top: 5px; font-size: 11px; color: #888; display: none;">
                            输入关键词后会自动保存并高亮显示（需在设置中启用）
                        </div>
                    </div>
                `;

                // 插入到右侧面板顶部
                const firstPanel = rightPanel.querySelector('.nsk-panel');
                if (firstPanel) {
                    rightPanel.insertBefore(panel, firstPanel);
                } else {
                    rightPanel.appendChild(panel);
                }

                // 获取元素
                const textarea = panel.querySelector('#nsx-right-panel-keywords-input');
                const helpText = panel.querySelector('#nsx-highlight-help-text');
                const statusText = panel.querySelector('#nsx-highlight-status-text');

                // 加载当前配置
                const currentKeywords = this.getRightPanelHighlightKeywords();
                if (textarea) textarea.value = currentKeywords;
                
                // 根据输入框内容显示/隐藏帮助文本
                const updateHelpVisibility = () => {
                    if (!textarea || !helpText || !statusText) return;
                    const hasContent = textarea.value.trim().length > 0;
                    helpText.style.display = hasContent ? 'none' : 'block';
                    statusText.style.display = hasContent ? 'block' : 'none';
                };
                
                // 初始状态
                updateHelpVisibility();

                // 输入框事件处理
                if (textarea) {
                    let timer = null;
                    const saveKeywords = () => {
                        const value = textarea.value.trim();
                        updateHelpVisibility(); // 更新帮助文本显示状态
                        const parsed = this.parseRightPanelHighlightKeywords(value);
                        // console.log('[NodeSeek X] 解析的关键词：', parsed);
                        Config.updateConfig('right_panel_highlight.keywords', parsed);
                        this.refreshRightPanelHighlightRules();
                        // console.log('[NodeSeek X] 刷新后的规则：', this.rightPanelHighlightRules);
                        // 如果功能已启用，立即应用高亮
                        if (Config.getConfig('right_panel_highlight.enabled') === true) {
                            // console.log('[NodeSeek X] 关键词已保存，规则数量：', this.rightPanelHighlightRules.length);
                            this.applyRightPanelHighlight();
                        }
                    };
                    textarea.addEventListener('input', () => {
                        updateHelpVisibility(); // 实时更新帮助文本显示状态
                        clearTimeout(timer);
                        timer = setTimeout(saveKeywords, 500);
                    });
                    textarea.addEventListener('blur', saveKeywords);
                }
            },
            toggleFooter() {
                const enabled = Config.getConfig('hide_footer.enabled');
                toggleRootClass('nsx-hide-footer', enabled === true);
            },
            togglePostCategory() {
                const enabled = Config.getConfig('hide_post_category.enabled');
                toggleRootClass('nsx-hide-post-category', enabled === true);
            },
            togglePostInfo() {
                const enabled = Config.getConfig('hide_post_info.enabled');
                toggleRootClass('nsx-hide-post-info', enabled === true);
            },
            toggleTopicCarousel() {
                const enabled = Config.getConfig('hide_topic_carousel.enabled');
                toggleRootClass('nsx-hide-topic-carousel', enabled === true);
            },
            // 获取右侧面板高亮关键词输入值
            getRightPanelHighlightKeywords() {
                const stored = Config.getConfig('right_panel_highlight.keywords');
                if (!Array.isArray(stored) || stored.length === 0) return '';
                return stored.map(rule => {
                    if (!rule) return '';
                    if (typeof rule === 'string') return rule;
                    if (rule.type === 'regex') {
                        const flags = rule.flags || '';
                        return `/${rule.value || ''}/${flags}`;
                    }
                    return rule.value || '';
                }).filter(Boolean).join('\n');
            },
            // 解析右侧面板高亮关键词输入
            parseRightPanelHighlightKeywords(inputValue) {
                if (!inputValue) return [];
                return inputValue.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
                    if (line.startsWith('/') && line.lastIndexOf('/') > 0) {
                        const lastSlash = line.lastIndexOf('/');
                        const pattern = line.slice(1, lastSlash);
                        const flags = line.slice(lastSlash + 1);
                        try {
                            new RegExp(pattern, flags || 'i');
                            return { type: 'regex', value: pattern, flags };
                        } catch (err) {
                            // console.warn('[NodeSeek X] 忽略无效正则：', line, err);
                            return null;
                        }
                    }
                    return { type: 'text', value: line };
                }).filter(Boolean);
            },
            // 刷新右侧面板高亮关键词规则
            refreshRightPanelHighlightRules() {
                const stored = Config.getConfig('right_panel_highlight.keywords');
                const list = Array.isArray(stored) ? stored : [];
                this.rightPanelHighlightRules = list.map(rule => {
                    if (!rule) return null;
                    if (typeof rule === 'string') {
                        const value = rule.trim();
                        if (!value) return null;
                        return { type: 'text', value, lower: value.toLowerCase() };
                    }
                    const type = rule.type || 'text';
                    if (type === 'regex') {
                        const pattern = rule.value || rule.pattern || '';
                        if (!pattern) return null;
                        const flags = rule.flags || '';
                        try {
                            const regex = new RegExp(pattern, flags || 'i');
                            return { type: 'regex', regex, value: pattern, flags };
                        } catch (err) {
                            // console.warn('[NodeSeek X] 无效的正则规则：', pattern, err);
                            return null;
                        }
                    }
                    const value = (rule.value || '').trim();
                    if (!value) return null;
                    return { type: 'text', value, lower: value.toLowerCase() };
                }).filter(Boolean);
            },
            // 高亮文本节点中的关键词
            highlightTextNode(textNode, rules) {
                if (!rules || rules.length === 0) return;
                if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
                
                const text = textNode.textContent;
                if (!text || text.trim().length === 0) return;
                
                // 检查是否已经高亮过（避免重复处理）
                // 如果父元素已经包含高亮标记，说明已经处理过
                if (textNode.parentElement && textNode.parentElement.querySelector('.nsx-right-panel-highlight')) {
                    return;
                }
                
                const fragments = [];
                let lastIndex = 0;
                
                // 收集所有匹配位置
                const matches = [];
                rules.forEach(rule => {
                    if (rule.type === 'regex') {
                        try {
                            const regex = new RegExp(rule.regex.source, rule.regex.flags + 'g');
                            let match;
                            while ((match = regex.exec(text)) !== null) {
                                matches.push({
                                    start: match.index,
                                    end: match.index + match[0].length,
                                    text: match[0]
                                });
                            }
                        } catch (err) {
                            // console.warn('[NodeSeek X] 正则匹配失败：', rule, err);
                        }
                    } else {
                        // 普通文本匹配（不区分大小写）
                        const lowerText = text.toLowerCase();
                        const lowerKeyword = rule.lower;
                        if (!lowerKeyword) return;
                        
                        let index = 0;
                        while ((index = lowerText.indexOf(lowerKeyword, index)) !== -1) {
                            matches.push({
                                start: index,
                                end: index + rule.value.length,
                                text: text.substring(index, index + rule.value.length)
                            });
                            index += rule.value.length;
                        }
                    }
                });
                
                // 按位置排序并合并重叠
                matches.sort((a, b) => a.start - b.start);
                const mergedMatches = [];
                matches.forEach(match => {
                    if (mergedMatches.length === 0) {
                        mergedMatches.push(match);
                    } else {
                        const last = mergedMatches[mergedMatches.length - 1];
                        if (match.start <= last.end) {
                            // 重叠，合并
                            last.end = Math.max(last.end, match.end);
                            last.text = text.substring(last.start, last.end);
                        } else {
                            mergedMatches.push(match);
                        }
                    }
                });
                
                if (mergedMatches.length === 0) return;
                
                // 创建高亮片段
                mergedMatches.forEach(match => {
                    // 添加匹配前的文本
                    if (match.start > lastIndex) {
                        fragments.push(document.createTextNode(text.substring(lastIndex, match.start)));
                    }
                    // 添加高亮的文本
                    const mark = document.createElement('mark');
                    mark.className = 'nsx-right-panel-highlight';
                    mark.textContent = match.text;
                    fragments.push(mark);
                    lastIndex = match.end;
                });
                
                // 添加剩余的文本
                if (lastIndex < text.length) {
                    fragments.push(document.createTextNode(text.substring(lastIndex)));
                }
                
                if (fragments.length > 1) {
                    // 替换文本节点
                    const parent = textNode.parentNode;
                    const markCount = fragments.filter(f => f.tagName === 'MARK').length;
                    fragments.forEach(fragment => {
                        parent.insertBefore(fragment, textNode);
                    });
                    parent.removeChild(textNode);
                    if (markCount > 0) {
                        // console.log('[NodeSeek X] 已高亮文本节点，创建了', markCount, '个高亮标记，文本：', text.substring(0, 50), '匹配的关键词：', mergedMatches.map(m => m.text).join(', '));
                    }
                }
            },
            // 应用右侧面板关键词高亮
            applyRightPanelHighlight() {
                const enabled = Config.getConfig('right_panel_highlight.enabled');
                if (enabled !== true) {
                    // 移除所有高亮
                    this.removeAllHighlights();
                    return;
                }
                
                this.refreshRightPanelHighlightRules();
                // console.log('[NodeSeek X] 应用高亮，规则数量：', this.rightPanelHighlightRules ? this.rightPanelHighlightRules.length : 0);
                
                if (!this.rightPanelHighlightRules || this.rightPanelHighlightRules.length === 0) {
                    this.removeAllHighlights();
                    return;
                }
                
                // 先移除已存在的高亮标记（避免重复）
                this.removeAllHighlights();
                
                // 处理右侧面板
                const rightPanel = document.querySelector('#nsk-right-panel-container');
                if (rightPanel) {
                    // console.log('[NodeSeek X] 处理右侧面板');
                    this.highlightInContainer(rightPanel);
                }
                
                // 处理帖子列表 - 使用配置的选择器
                let postList = document.querySelector(opts.post.postListSelector);
                if (!postList) {
                    // 备用选择器
                    postList = document.querySelector('#nsk-body-left .post-list');
                }
                if (!postList) {
                    postList = document.querySelector('.post-list:not(.topic-carousel-panel)');
                }
                if (!postList) {
                    postList = document.querySelector('#nsk-body-left');
                }
                if (postList) {
                    // console.log('[NodeSeek X] 处理帖子列表，容器：', postList.className || postList.id || postList.tagName, '选择器：', opts.post.postListSelector);
                    this.highlightInContainer(postList);
                } else {
                    // console.warn('[NodeSeek X] 未找到帖子列表容器，尝试的选择器：', opts.post.postListSelector, '#nsk-body-left .post-list', '.post-list:not(.topic-carousel-panel)');
                }
            },
            // 移除所有高亮标记
            removeAllHighlights() {
                const containers = [
                    document.querySelector('#nsk-right-panel-container'),
                    document.querySelector(opts.post.postListSelector),
                    document.querySelector('#nsk-body-left .post-list'),
                    document.querySelector('.post-list:not(.topic-carousel-panel)')
                ].filter(Boolean);
                
                containers.forEach(container => {
                    if (!container) return;
                    container.querySelectorAll('.nsx-right-panel-highlight').forEach(mark => {
                        const parent = mark.parentNode;
                        parent.replaceChild(document.createTextNode(mark.textContent), mark);
                        parent.normalize();
                    });
                    container.querySelectorAll('.nsx-highlight-processed').forEach(el => {
                        el.classList.remove('nsx-highlight-processed');
                    });
                });
            },
            // 在指定容器中应用高亮
            highlightInContainer(container) {
                if (!container) {
                    // console.warn('[NodeSeek X] highlightInContainer: 容器为空');
                    return;
                }
                
                // console.log('[NodeSeek X] highlightInContainer: 开始处理容器', container.tagName, container.className || container.id);
                
                // 遍历所有文本节点
                const walker = document.createTreeWalker(
                    container,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode: (node) => {
                            // 排除已处理的节点和某些特殊元素
                            if (node.parentElement && (
                                node.parentElement.tagName === 'SCRIPT' ||
                                node.parentElement.tagName === 'STYLE' ||
                                node.parentElement.classList.contains('nsx-highlight-input-panel')
                            )) {
                                return NodeFilter.FILTER_REJECT;
                            }
                            // 如果父元素已经包含高亮标记，跳过（避免重复处理）
                            // 注意：这里检查的是父元素是否包含高亮标记，而不是当前节点
                            const parent = node.parentElement;
                            if (parent && parent.querySelector && parent.querySelector('.nsx-right-panel-highlight')) {
                                // 如果父元素已经包含高亮标记，说明已经处理过，跳过
                                return NodeFilter.FILTER_REJECT;
                            }
                            // 特别处理帖子标题：确保处理 .post-title 内的文本节点
                            const isInPostTitle = parent && (
                                parent.classList.contains('post-title') ||
                                parent.closest('.post-title')
                            );
                            if (isInPostTitle && node.textContent.trim()) {
                                // console.log('[NodeSeek X] 找到帖子标题文本节点：', node.textContent.substring(0, 50), '父元素：', parent.tagName, parent.className);
                            }
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }
                );
                
                const textNodes = [];
                let node;
                while (node = walker.nextNode()) {
                    textNodes.push(node);
                }
                
                // console.log('[NodeSeek X] 找到文本节点数量：', textNodes.length, '规则数量：', this.rightPanelHighlightRules.length);
                
                if (textNodes.length === 0) {
                    // console.warn('[NodeSeek X] highlightInContainer: 未找到任何文本节点');
                    return;
                }
                
                // 处理文本节点（从后往前，避免位置偏移）
                let processedCount = 0;
                for (let i = textNodes.length - 1; i >= 0; i--) {
                    const beforeLength = textNodes[i].textContent.length;
                    this.highlightTextNode(textNodes[i], this.rightPanelHighlightRules);
                    // 检查是否被处理了（如果被处理，文本节点会被替换）
                    if (textNodes[i].parentNode && textNodes[i].parentNode.querySelector('.nsx-right-panel-highlight')) {
                        processedCount++;
                    }
                }
                // console.log('[NodeSeek X] 处理完成，处理了', processedCount, '个文本节点');
            },
            // 启动右侧面板高亮观察器
            startRightPanelHighlightObserver() {
                const enabled = Config.getConfig('right_panel_highlight.enabled');
                if (enabled !== true) {
                    if (this.rightPanelHighlightObserver) {
                        this.rightPanelHighlightObserver.disconnect();
                        this.rightPanelHighlightObserver = null;
                    }
                    return;
                }
                
                if (this.rightPanelHighlightObserver) {
                    this.rightPanelHighlightObserver.disconnect();
                }
                
                const _this = this;
                const containers = [
                    document.querySelector('#nsk-right-panel-container'),
                    document.querySelector('#nsk-body-left .post-list')
                ].filter(Boolean);
                
                if (containers.length === 0) return;
                
                this.rightPanelHighlightObserver = new MutationObserver(() => {
                    // 延迟应用高亮，避免频繁触发
                    setTimeout(() => {
                        _this.applyRightPanelHighlight();
                    }, 100);
                });
                
                // 观察所有容器
                containers.forEach(container => {
                    this.rightPanelHighlightObserver.observe(container, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                });
            },
            mergeCategoryToNav() {
                const enabled = Config.getConfig('merge_category_to_nav.enabled');
                const navMenu = document.querySelector('#nsk-head .nav-menu');
                const categoryPanel = document.querySelector('#nsk-right-panel-container .category-list');
                const leftCategoryPanel = document.querySelector('#nsk-left-panel-container .category-list');

                if (!navMenu) return;

                // 移除旧的合并样式
                const oldStyle = document.getElementById('nsx-merge-category-style');
                if (oldStyle) oldStyle.remove();

                // 移除已存在的合并分类列表（可能在 nav-menu 中，也可能在 header 中）
                const existingMerged = document.querySelector('#nsk-head .nsx-merged-categories, header ~ .nsx-merged-categories-wrapper');
                if (existingMerged) {
                    existingMerged.remove();
                }

                if (!enabled) {
                    // 恢复右侧面板显示
                    if (categoryPanel) {
                        categoryPanel.style.display = '';
                    }
                    if (leftCategoryPanel) {
                        leftCategoryPanel.style.display = '';
                    }
                    return;
                }

                // 隐藏右侧和左侧的分类面板
                if (categoryPanel) {
                    categoryPanel.style.display = 'none';
                }
                if (leftCategoryPanel) {
                    leftCategoryPanel.style.display = 'none';
                }

                // 获取分类列表（优先使用右侧面板）
                const categoryList = categoryPanel || leftCategoryPanel;
                if (!categoryList) return;

                const categoryItems = categoryList.querySelectorAll('ul li');
                if (categoryItems.length === 0) return;

                // 获取导航栏中已有的链接URL集合（用于去重）
                const existingNavLinks = new Set();
                navMenu.querySelectorAll('li a').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href) {
                        // 标准化URL，移除查询参数和锚点
                        const normalizedHref = href.split('?')[0].split('#')[0];
                        existingNavLinks.add(normalizedHref);
                    }
                });
                // 也检查已存在的合并分类链接
                const header = document.querySelector('#nsk-head');
                if (header) {
                    const existingMerged = header.querySelector('.nsx-merged-categories');
                    if (existingMerged) {
                        existingMerged.querySelectorAll('a').forEach(link => {
                            const href = link.getAttribute('href');
                            if (href) {
                                const normalizedHref = href.split('?')[0].split('#')[0];
                                existingNavLinks.add(normalizedHref);
                            }
                        });
                    }
                }

                // 创建合并后的分类菜单
                const mergedCategories = document.createElement('div');
                mergedCategories.className = 'nsx-merged-categories';
                // 检查是否是紧凑模式，如果不是，设置 flex-wrap: nowrap 防止换行
                const isCompactMode = document.documentElement.classList.contains('nsx-compact-mode');
                const compactColumns = Config.getConfig('compact_mode.columns') || 1;
                // 只有在紧凑模式且列数>=2时才允许换行，否则单行显示
                if (isCompactMode && compactColumns >= 2) {
                    // 紧凑模式多列：允许换行
                    mergedCategories.style.cssText = 'display: flex; align-items: center; margin-left: 10px; gap: 5px; flex-wrap: wrap;';
                } else {
                    // 单列模式或紧凑模式单列：不换行，隐藏超出部分
                    mergedCategories.style.cssText = 'display: flex; align-items: center; margin-left: 10px; gap: 5px; flex-wrap: nowrap; overflow: hidden;';
                }

                categoryItems.forEach((item) => {
                    const link = item.querySelector('a');
                    if (!link) return;

                    // 检查是否已存在于导航栏中
                    const href = link.getAttribute('href');
                    if (href) {
                        const normalizedHref = href.split('?')[0].split('#')[0];
                        if (existingNavLinks.has(normalizedHref)) {
                            // 如果导航栏中已有此链接，跳过（保留导航栏中的带图标版本）
                            return;
                        }
                    }

                    const clonedLink = link.cloneNode(true);
                    clonedLink.style.cssText = 'display: flex; align-items: center; padding: 4px 8px; border-radius: 4px; transition: background-color 0.2s, color 0.2s; white-space: nowrap;';

                    // 保持当前分类的样式
                    if (item.classList.contains('current-category')) {
                        clonedLink.style.backgroundColor = '#f1f3f5';
                        clonedLink.style.color = '#0dbc79';
                    }

                    // 添加悬停效果
                    clonedLink.addEventListener('mouseenter', function() {
                        if (!item.classList.contains('current-category')) {
                            this.style.backgroundColor = '#f1f3f5';
                            this.style.color = '#0dbc79';
                        }
                    });
                    clonedLink.addEventListener('mouseleave', function() {
                        if (!item.classList.contains('current-category')) {
                            this.style.backgroundColor = '';
                            this.style.color = '';
                        }
                    });

                    mergedCategories.appendChild(clonedLink);
                });

                // 只有当有新的分类链接时才添加到导航栏
                if (mergedCategories.children.length > 0) {
                    // 将合并的分类链接添加到 header 中，搜索框之后
                    const header = document.querySelector('#nsk-head');
                    const searchBox = header ? header.querySelector('.search-box') : null;
                    if (searchBox && searchBox.nextSibling) {
                        header.insertBefore(mergedCategories, searchBox.nextSibling);
                    } else if (searchBox) {
                        searchBox.insertAdjacentElement('afterend', mergedCategories);
                    } else {
                        // 如果没有搜索框，添加到 nav-menu 后面
                        navMenu.insertAdjacentElement('afterend', mergedCategories);
                    }
                }

                // 添加样式
                const style = document.createElement('style');
                style.id = 'nsx-merge-category-style';
                style.textContent = `
                    /* 增加导航栏宽度，确保能容纳所有内容 */
                    #nsk-head {
                        max-width: 100% !important;
                        width: 100% !important;
                        overflow: visible !important;
                    }
                    /* 导航栏内的分类链接 */
                    #nsk-head .nsx-merged-categories {
                        display: flex;
                        align-items: center;
                        flex-wrap: nowrap;
                        gap: 5px;
                        margin-left: 10px;
                        flex-shrink: 0;
                        overflow: hidden;
                    }
                    /* 单列模式下，分类链接从搜索框右边开始，限制最大宽度避免覆盖设置按钮 */
                    html:not(.nsx-compact-mode) #nsk-head .nsx-merged-categories {
                        position: absolute;
                        left: calc(50% + 180px);
                        right: 120px;
                        top: 50%;
                        transform: translateY(-50%);
                        max-width: calc(50% - 300px);
                        z-index: 0;
                    }
                    /* 紧凑模式多列：分类链接在搜索框右侧 */
                    html.nsx-compact-mode #nsk-head .nsx-merged-categories {
                        position: absolute;
                        left: calc(50% + 150px);
                        top: 50%;
                        transform: translateY(-50%);
                        max-width: calc(50% - 150px);
                        z-index: 0;
                    }
                    @media screen and (max-width: 1200px) {
                        html:not(.nsx-compact-mode) #nsk-head .nsx-merged-categories {
                            left: calc(50% + 150px) !important;
                            right: 120px !important;
                            max-width: calc(50% - 270px) !important;
                        }
                        html.nsx-compact-mode #nsk-head .nsx-merged-categories {
                            left: calc(50% + 150px) !important;
                            right: 120px !important;
                            max-width: calc(50% - 270px) !important;
                        }
                    }
                    @media screen and (max-width: 800px) {
                        #nsk-head .nsx-merged-categories {
                            position: static !important;
                            transform: none !important;
                            left: auto !important;
                            right: auto !important;
                            max-width: 100% !important;
                            margin-left: 0 !important;
                            margin-top: 5px !important;
                        }
                    }
                    .nsx-merged-categories a {
                        font-size: 13px;
                        text-decoration: none;
                        color: var(--link-color);
                        display: flex;
                        align-items: center;
                        padding: 4px 8px;
                        border-radius: 4px;
                        transition: background-color 0.2s, color 0.2s;
                        white-space: nowrap;
                        flex-shrink: 0;
                    }
                    .nsx-merged-categories a:hover {
                        color: var(--link-hover-color);
                    }
                    .nsx-merged-categories .iconpark-icon {
                        width: 14px;
                        height: 14px;
                        margin-right: 4px;
                    }
                `;
                document.head.appendChild(style);
            },
            addPluginStyle() {
                let style = `
            .nsplus-tip { background-color: rgba(255, 217, 0, 0.8); border: 0px solid black;  padding: 3px; text-align: center;animation: blink 5s cubic-bezier(.68,.05,.46,.96) infinite;}
            /* @keyframes blink{ 0%{background-color: red;} 25%{background-color: yellow;} 50%{background-color: blue;} 75%{background-color: green;} 100%{background-color: red;} } */
            .nsplus-tip p,.nsplus-tip p a { color: #f00 }
            .nsplus-tip p a:hover {color: #0ff}
            #back-to-comment{display:flex;}
            #fast-nav-button-group .nav-item-btn:nth-last-child(4){bottom:120px;}

            header div.history-dropdown-on { color: var(--link-hover-color); cursor: pointer; padding: 0 5px; position: absolute; right: 50px}
            header div.nsx-settings-btn { 
                color: var(--link-hover-color); 
                cursor: pointer; 
                padding: 0 5px; 
                position: absolute; 
                right: 70px; 
                transition: color 0.3s;
                z-index: 10 !important;
                pointer-events: auto !important;
            }
            header div.nsx-settings-btn:hover { color: var(--link-color);}

            /* 导航栏链接美化 - 添加悬浮效果 */
            #nsk-head .nav-menu a {
                padding: 4px 8px;
                border-radius: 4px;
                transition: background-color 0.2s, color 0.2s;
                text-decoration: none;
            }
            #nsk-head .nav-menu a:hover {
                color: var(--link-hover-color);
                background-color: rgba(0, 0, 0, 0.05);
            }
            body.dark-layout #nsk-head .nav-menu a:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .user-card .close,
            .hover-user-card .close,
            .closeBtn,
            .closeBtn * {
                cursor: pointer !important;
            }
            /* 单列模式下，确保用户卡片不会超出页面底部 */
            html:not(.nsx-compact-mode) .hover-user-card,
            html.nsx-compact-mode[data-compact-columns="1"] .hover-user-card {
                max-height: calc(100vh - 100px) !important;
                overflow-y: auto !important;
                max-width: calc(100vw - 40px) !important;
            }
            /* 如果用户卡片底部超出视口，调整位置 */
            html:not(.nsx-compact-mode) .hover-user-card[style*="top"] {
                max-height: calc(100vh - 100px) !important;
            }
            html.nsx-compact-mode[data-compact-columns="1"] .hover-user-card[style*="top"] {
                max-height: calc(100vh - 100px) !important;
            }

            .blocked-post { display: none !important; }
            html.nsx-remove-promotions .promotation-item {
                display: none !important;
            }

            /* 紧凑模式样式由 updateCompactModeStyle() 动态生成 */

            /* 设置面板快捷键列表样式 */
            #nsx-settings-layer .layui-form-item table kbd {
                background-color: var(--bg-main-color, #fff) !important;
                border: 1px solid rgba(0,0,0,.2) !important;
                border-radius: 3px !important;
                box-shadow: 0 1px 0 rgba(0,0,0,.2) !important;
                padding: 3px 8px !important;
                font-family: monospace !important;
                font-size: 12px !important;
                color: var(--text-color, #333) !important;
                display: inline-block !important;
                margin: 0 2px !important;
            }
            body.dark-layout #nsx-settings-layer .layui-form-item table kbd {
                background-color: var(--bg-sub-color, #3b3b3b) !important;
                border-color: rgba(255,255,255,.2) !important;
                color: var(--text-color, #aaa) !important;
            }
            #nsx-settings-layer .layui-form-item table td {
                color: var(--text-color, #333) !important;
            }
            body.dark-layout #nsx-settings-layer .layui-form-item table td {
                color: var(--text-color, #aaa) !important;
            }
            #nsx-settings-layer .layui-form-item table {
                background-color: transparent !important;
            }

            /* 用户统计信息颜色样式 - 鲜艳配色 */
            .nsx-user-stats span {
                font-weight: 500;
            }
            .nsx-user-stats span[title="注册天数"] {
                color: #2ea44f !important;
            }
            .nsx-user-stats span[title="鸡腿数量"] {
                color: #ff9800 !important;
            }
            .nsx-user-stats span[title="帖子数"] {
                color: #2196f3 !important;
            }
            .nsx-user-stats span[title="评论数"] {
                color: #9c27b0 !important;
            }
            /* 深色模式下的鲜艳配色 */
            body.dark-layout .nsx-user-stats span[title="注册天数"] {
                color: #45ca6b !important;
            }
            body.dark-layout .nsx-user-stats span[title="鸡腿数量"] {
                color: #ffb74d !important;
            }
            body.dark-layout .nsx-user-stats span[title="帖子数"] {
                color: #64b5f6 !important;
            }
            body.dark-layout .nsx-user-stats span[title="评论数"] {
                color: #ba68c8 !important;
            }

            /* Lv0 - Lv2: 灰到橙 */
            .role-tag.user-level.user-lv0 {background-color: #c7c2c2; border: 1px solid #c7c2c2; color: #fafafa;}
            .role-tag.user-level.user-lv1 {background-color: #ffb74d; border: 1px solid #ffb74d; color: #fafafa;}
            .role-tag.user-level.user-lv2 {background-color: #ff9400; border: 1px solid #ff9400; color: #fafafa;}
            /* Lv3 - Lv4: 红到深红 */
            .role-tag.user-level.user-lv3 {background-color: #ff5252; border: 1px solid #ff5252; color: #fafafa;}
            .role-tag.user-level.user-lv4 {background-color: #e53935; border: 1px solid #e53935; color: #fafafa;}
            /* Lv5 - Lv6: 紫到深紫 */
            .role-tag.user-level.user-lv5 {background-color: #ab47bc; border: 1px solid #ab47bc; color: #fafafa;}
            .role-tag.user-level.user-lv6 {background-color: #8e24aa; border: 1px solid #8e24aa; color: #fafafa;}
            /* Lv7 - Lv8: 蓝到深蓝 */
            .role-tag.user-level.user-lv7 {background-color: #42a5f5; border: 1px solid #42a5f5; color: #fafafa;}
            .role-tag.user-level.user-lv8 {background-color: #1e88e5; border: 1px solid #1e88e5; color: #fafafa;}
            /* Lv9 - Lv10: 绿到深绿 */
            .role-tag.user-level.user-lv9 {background-color: #66bb6a; border: 1px solid #66bb6a; color: #fafafa;}
            .role-tag.user-level.user-lv10 {background-color: #2e7d32; border: 1px solid #2e7d32; color: #fafafa;}
            /* Lv11 - Lv12: 金橙到深金橙 */
            .role-tag.user-level.user-lv11 {background-color: #ffca28; border: 1px solid #ffca28; color: #fafafa;}
            .role-tag.user-level.user-lv12 {background-color: #ffb300; border: 1px solid #ffb300; color: #fafafa;}
            /* Lv13 - Lv14: 紫金到深紫金 */
            .role-tag.user-level.user-lv13 {background-color: #b388ff; border: 1px solid #b388ff; color: #fafafa;}
            .role-tag.user-level.user-lv14 {background-color: #7c4dff; border: 1px solid #7c4dff; color: #fafafa;}
            /* Lv15: 黑金至尊 */
            .role-tag.user-level.user-lv15 {background-color: #000000; border: 1px solid #000000; color: #ffd700;}

            .post-content pre { position: relative; }
            .post-content pre span.copy-code { position: absolute; right: .5em; top: .5em; cursor: pointer;color: #c1c7cd;  }
            .post-content pre .iconpark-icon {width:16px;height:16px;margin:3px;}
            .post-content pre .iconpark-icon:hover {color:var(--link-hover-color)}
            .dark-layout .post-content pre code.hljs { padding: 1em !important; }

            html.nsx-hide-visited .post-list .post-title a:visited,
            html.nsx-hide-visited .post-list-item .post-title a:visited {
                display: none !important;
            }
`;
                if (document.head) {
                    util.addStyle('nsplus-style', 'style', style);
                    util.addStyle('layui-style', 'link', 'https://s.cfn.pp.ua/layui/2.9.9/css/layui.css');
                    util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle"));
                }
            },
            addPluginScript() {
                GM_addElement(document.body, 'script', {
                    src: 'https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/highlight.min.js'
                });
                GM_addElement(document.body, 'script', {
                    textContent: 'window.onload = function(){hljs.highlightAll();}'
                });
                GM_addElement(document.body, "script", { textContent: `!function(e){var t,n,d,o,i,a,r='<svg><symbol id="envelope-one" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M36 16V8H4v24h8" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-width="4" stroke="currentColor" d="M12 40h32V16H12v24Z" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="m12 16 16 12 16-12" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M32 16H12v15" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M44 31V16H24" data-follow-stroke="currentColor"/></symbol><symbol id="at-sign" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M44 24c0-11.046-8.954-20-20-20S4 12.954 4 24s8.954 20 20 20v0c4.989 0 9.55-1.827 13.054-4.847" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-width="4" stroke="currentColor" d="M24 32a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M32 24a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6m-12 1v-9" data-follow-stroke="currentColor"/></symbol><symbol id="copy" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M13 12.432v-4.62A2.813 2.813 0 0 1 15.813 5h24.374A2.813 2.813 0 0 1 43 7.813v24.375A2.813 2.813 0 0 1 40.187 35h-4.67" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-width="4" stroke="currentColor" d="M32.188 13H7.811A2.813 2.813 0 0 0 5 15.813v24.374A2.813 2.813 0 0 0 7.813 43h24.375A2.813 2.813 0 0 0 35 40.187V15.814A2.813 2.813 0 0 0 32.187 13Z" data-follow-stroke="currentColor"/></symbol><symbol id="history" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M5.818 6.727V14h7.273" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M4 24c0 11.046 8.954 20 20 20v0c11.046 0 20-8.954 20-20S35.046 4 24 4c-7.402 0-13.865 4.021-17.323 9.998" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="m24.005 12-.001 12.009 8.48 8.48" data-follow-stroke="currentColor"/></symbol><symbol id="setting" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M36.34 14.34L38.86 12 34 7.14l-2.34 2.52c-.8-.3-1.66-.52-2.56-.66L28 6H20l-1.1 3.2c-.9.14-1.76.36-2.56.66L14 7.14 9.14 12l2.52 2.34c-.3.8-.52 1.66-.66 2.56L6 20v8l3.2 1.1c.14.9.36 1.76.66 2.56L7.14 34 12 38.86l2.34-2.52c.8.3 1.66.52 2.56.66L20 42h8l1.1-3.2c.9-.14 1.76-.36 2.56-.66L34 38.86 38.86 34l-2.52-2.34c.3-.8.52-1.66.66-2.56L42 28v-8l-3.2-1.1c-.14-.9-.36-1.76-.66-2.56ZM24 32a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" data-follow-stroke="currentColor"/></symbol></svg>';function c(){i||(i=!0,d())}t=function(){var e,t,n;(n=document.createElement("div")).innerHTML=r,r=null,(t=n.getElementsByTagName("svg")[0])&&(t.setAttribute("aria-hidden","true"),t.style.position="absolute",t.style.width=0,t.style.height=0,t.style.overflow="hidden",e=t,(n=document.body).firstChild?(t=n.firstChild).parentNode.insertBefore(e,t):n.appendChild(e))},document.addEventListener?["complete","loaded","interactive"].indexOf(document.readyState)>-1?setTimeout(t,0):(n=function(){document.removeEventListener("DOMContentLoaded",n,!1),t()},document.addEventListener("DOMContentLoaded",n,!1)):document.attachEvent&&(d=t,o=e.document,i=!1,(a=function(){try{o.documentElement.doScroll("left")}catch(e){return void setTimeout(a,50)}c()})(),o.onreadystatechange=function(){"complete"==o.readyState&&(o.onreadystatechange=null,c())})}(window);` });
            },
            darkMode(){
                // 选择要监视的目标元素（body元素）
                const targetNode = document.querySelector('body');
                // 进入页面时判断是否是深色模式
                if(targetNode.classList.contains('dark-layout')){
                    util.addStyle('layuicss-theme-dark','link','https://s.cfn.pp.ua/layui/theme-dark/2.9.7/css/layui-theme-dark.css');
                    util.removeStyle('hightlight-style');
                    util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle_dark"));
                }

                // 配置MutationObserver的选项
                const observerConfig = {
                    attributes: true, // 监视属性变化
                    attributeFilter: ['class'], // 只监视类属性
                };

                // 创建一个新的MutationObserver，并指定触发变化时的回调函数
                const observer = new MutationObserver((mutationsList, observer) => {
                    for(let mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            if(targetNode.classList.contains('dark-layout')){
                                util.addStyle('layuicss-theme-dark','link','https://s.cfn.pp.ua/layui/theme-dark/2.9.7/css/layui-theme-dark.css');
                                util.removeStyle('hightlight-style');
                                util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle_dark"));
                            }else{
                                util.removeStyle('layuicss-theme-dark');
                                util.removeStyle('hightlight-style');
                                util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle"));
                            }
                        }
                    }
                });

                // 使用给定的配置选项开始观察目标节点
                observer.observe(targetNode, observerConfig);
            },
            // 键盘快捷键翻页
            initKeyboardNavigation() {
                document.addEventListener('keydown', (e) => {
                    // 如果用户在输入框中（input, textarea, contenteditable），不触发快捷键
                    const activeElement = document.activeElement;
                    const isInputFocused = activeElement && (
                        activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA' ||
                        activeElement.isContentEditable ||
                        activeElement.closest('.CodeMirror') // CodeMirror 编辑器
                    );

                    if (isInputFocused) return;

                    // 左箭头键：前一页
                    if (e.key === 'ArrowLeft' || e.key === '←') {
                        e.preventDefault();
                        this.navigateToPage('prev');
                    }
                    // 右箭头键：后一页
                    else if (e.key === 'ArrowRight' || e.key === '→') {
                        e.preventDefault();
                        this.navigateToPage('next');
                    }
                });
            },
            // 导航到上一页或下一页
            navigateToPage(direction) {
                // 查找所有分页器（可能有顶部和底部两个）
                const pagers = document.querySelectorAll('div[role="navigation"][aria-label="pagination"]');

                if (pagers.length === 0) return;

                // 优先使用第一个可见的分页器
                let targetPager = null;
                for (const pager of pagers) {
                    const rect = pager.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        targetPager = pager;
                        break;
                    }
                }

                if (!targetPager) targetPager = pagers[0];

                let targetLink = null;

                if (direction === 'prev') {
                    // 查找前一页按钮
                    const prevBtn = targetPager.querySelector('.pager-prev');
                    if (prevBtn) {
                        // 检查是否可用（不是 disabled）
                        const isDisabled = prevBtn.getAttribute('aria-disabled') === 'true' ||
                                          prevBtn.classList.contains('disabled') ||
                                          prevBtn.hasAttribute('disabled');

                        if (!isDisabled) {
                            // 如果按钮本身是链接
                            if (prevBtn.tagName === 'A' && prevBtn.href) {
                                targetLink = prevBtn;
                            } else {
                                // 尝试查找内部的链接或父级链接
                                const link = prevBtn.querySelector('a') || prevBtn.closest('a');
                                if (link && link.href) {
                                    targetLink = link;
                                }
                            }
                        }
                    }
                } else if (direction === 'next') {
                    // 查找后一页按钮
                    const nextBtn = targetPager.querySelector('.pager-next');
                    if (nextBtn) {
                        // 检查是否可用（不是 disabled）
                        const isDisabled = nextBtn.getAttribute('aria-disabled') === 'true' ||
                                          nextBtn.classList.contains('disabled') ||
                                          nextBtn.hasAttribute('disabled');

                        if (!isDisabled) {
                            // 如果按钮本身是链接
                            if (nextBtn.tagName === 'A' && nextBtn.href) {
                                targetLink = nextBtn;
                            } else {
                                // 尝试查找内部的链接或父级链接
                                const link = nextBtn.querySelector('a') || nextBtn.closest('a');
                                if (link && link.href) {
                                    targetLink = link;
                                }
                            }
                        }
                    }
                }

                if (targetLink && targetLink.href) {
                    // 显示加载遮罩
                    const overlay = document.getElementById('nsx-loading-overlay');
                    if (overlay) overlay.classList.add('show');

                    window.location.href = targetLink.href;
                }
            },
            // 排序帖子列表
            sortPostList() {
                const postList = document.querySelector(opts.post.postListSelector);
                if (!postList) return;

                const sortMode = Config.getConfig('post_sort.mode') || 'none';
                const visitedToBottom = Config.getConfig('post_sort.visited_to_bottom') === true;

                // 如果没有启用排序且不需要置底，直接返回
                if (sortMode === 'none' && !visitedToBottom) return;

                const items = Array.from(postList.querySelectorAll('.post-list-item'));
                if (items.length === 0) return;

                // 获取已访问的链接集合（从 localStorage）
                const visitedLinks = new Set();
                if (visitedToBottom) {
                    try {
                        const visited = localStorage.getItem('nsx_visited_posts');
                        if (visited) {
                            const visitedArray = JSON.parse(visited);
                            visitedArray.forEach(url => visitedLinks.add(url));
                        }
                    } catch (e) {
                        // console.warn('[NodeSeek X] 读取访问记录失败:', e);
                    }
                }

                // 提取数据并排序
                const itemsWithData = items.map(item => {
                    const titleLink = item.querySelector('.post-title a');
                    const href = titleLink ? titleLink.href : '';
                    // 检查是否已访问：优先使用 localStorage，其次使用 :visited 伪类
                    let isVisited = false;
                    if (visitedToBottom && href) {
                        // 标准化 URL（移除查询参数和锚点）
                        const normalizedUrl = href.split('?')[0].split('#')[0];
                        isVisited = visitedLinks.has(normalizedUrl);
                    }
                    // 如果 localStorage 中没有，尝试使用 :visited 伪类（作为后备）
                    if (!isVisited && titleLink) {
                        try {
                            // 注意：浏览器安全限制，无法直接读取 :visited 状态
                            // 但可以通过计算样式来检测（虽然不总是可靠）
                            const computedStyle = window.getComputedStyle(titleLink);
                            // 如果链接颜色与未访问链接不同，可能是已访问
                            // 这里我们主要依赖 localStorage
                        } catch (e) {
                            // 忽略错误
                        }
                    }

                    // 提取回复数
                    let comments = 0;
                    const commentsEl = item.querySelector('.info-comments-count span[title]');
                    if (commentsEl) {
                        const title = commentsEl.getAttribute('title') || '';
                        const match = title.match(/(\d+)\s*comments?/i);
                        if (match) {
                            comments = parseInt(match[1], 10) || 0;
                        } else {
                            // 如果没有title，尝试从文本内容提取
                            const text = commentsEl.textContent.trim();
                            const numMatch = text.match(/\d+/);
                            if (numMatch) {
                                comments = parseInt(numMatch[0], 10) || 0;
                            }
                        }
                    }

                    // 提取查看数
                    let views = 0;
                    const viewsEl = item.querySelector('.info-views span[title]');
                    if (viewsEl) {
                        const title = viewsEl.getAttribute('title') || '';
                        const match = title.match(/(\d+)\s*views?/i);
                        if (match) {
                            views = parseInt(match[1], 10) || 0;
                        } else {
                            // 如果没有title，尝试从文本内容提取
                            const text = viewsEl.textContent.trim();
                            const numMatch = text.match(/\d+/);
                            if (numMatch) {
                                views = parseInt(numMatch[0], 10) || 0;
                            }
                        }
                    }

                    return {
                        item,
                        href,
                        isVisited,
                        comments,
                        views
                    };
                });

                // 排序
                itemsWithData.sort((a, b) => {
                    // 如果启用已访问置底，先按访问状态排序
                    if (visitedToBottom) {
                        if (a.isVisited && !b.isVisited) return 1;
                        if (!a.isVisited && b.isVisited) return -1;
                    }

                    // 然后按排序模式排序
                    if (sortMode === 'comments') {
                        return b.comments - a.comments;
                    } else if (sortMode === 'views') {
                        return b.views - a.views;
                    }

                    // 如果只是置底，保持原有顺序（在已访问置底后）
                    return 0;
                });

                // 重新插入排序后的元素
                itemsWithData.forEach(({ item }) => {
                    postList.appendChild(item);
                });
            },
            // 记录帖子访问
            recordPostVisit(url) {
                if (!url) return;
                try {
                    const normalizedUrl = url.split('?')[0].split('#')[0];
                    const visited = localStorage.getItem('nsx_visited_posts');
                    let visitedArray = visited ? JSON.parse(visited) : [];

                    // 如果不存在，添加到数组
                    if (!visitedArray.includes(normalizedUrl)) {
                        visitedArray.push(normalizedUrl);
                        // 限制数组大小，避免占用过多存储空间（保留最近1000条）
                        if (visitedArray.length > 1000) {
                            visitedArray = visitedArray.slice(-1000);
                        }
                        localStorage.setItem('nsx_visited_posts', JSON.stringify(visitedArray));
                    }
                } catch (e) {
                    // console.warn('[NodeSeek X] 记录访问失败:', e);
                }
            },
            // 初始化帖子访问监听，用于自动重新排序
            initPostVisitListener() {
                const visitedToBottom = Config.getConfig('post_sort.visited_to_bottom') === true;
                if (!visitedToBottom) return;

                const _this = this;

                // 监听帖子链接点击
                document.addEventListener('click', (e) => {
                    const link = e.target.closest('a');
                    if (!link || !link.href) return;

                    // 检查是否是帖子链接
                    const href = link.href;
                    const isPostLink = /\/post-\d+/.test(href) && href.startsWith(BASE_URL);

                    if (isPostLink) {
                        // 立即记录访问
                        _this.recordPostVisit(href);
                        // 延迟重新排序，确保记录已保存
                        setTimeout(() => {
                            _this.sortPostList();
                        }, 50);
                    }
                }, true);

                // 监听页面可见性变化（从新标签页返回时重新排序）
                document.addEventListener('visibilitychange', () => {
                    if (!document.hidden) {
                        // 页面重新可见时，延迟重新排序
                        setTimeout(() => {
                            _this.sortPostList();
                        }, 200);
                    }
                });

                // 监听焦点变化（切换标签页返回时）
                window.addEventListener('focus', () => {
                    setTimeout(() => {
                        _this.sortPostList();
                    }, 200);
                });
            },
            init() {
                Config.initializeConfig();
                this.addPluginStyle();
                this.checkLogin();
                this.refreshBlockKeywordRules();
                this.refreshBlockedCategories();
                this.refreshRightPanelHighlightRules();
                // 应用紧凑模式（类名已在早期添加，这里只需要更新样式）
                this.updateCompactModeStyle();
                const codeMirrorElement = document.querySelector('.CodeMirror');
                if (codeMirrorElement) {
                    const codeMirrorInstance = codeMirrorElement.CodeMirror;
                    if (codeMirrorInstance) {
                        let btnSubmit = document.querySelector('.md-editor button.submit.btn.focus-visible');
                        btnSubmit.innerText=btnSubmit.innerText+'(Ctrl+Enter)';
                        codeMirrorInstance.addKeyMap({"Ctrl-Enter":function(cm){ btnSubmit.click();}});
                    }
                }
                this.autoSignIn();//自动签到
                this.addSignTips();//签到提示
                this.enforceNewTabForPosts();//强制新标签页打开帖子
                this.autoJump();//自动点击跳转页
                this.autoLoading();//无缝加载帖子和评论
                this.blockMemberDOMInsert();//屏蔽用户
                this.blockPost();//屏蔽帖子
                this.blockPostsByCategory();
                this.blockPostsByViewLevel();
                this.quickComment();//快捷评论
                this.addLevelTag();//添加等级标签
                this.userCardEx();//用户卡片扩展
                //this.fakeLevel();
                this.addPluginScript();
                this.addCodeHighlight();
                this.addImageSlide();
                this.darkMode();
                this.history();
                this.initInstantPage();
                this.smoothScroll();
                this.addSettingsButton();
                this.updateCustomBackground();
                this.updateVisitedLinkStyle();
                this.updateAllTypography();
                this.togglePromotions();
                this.updateHeaderOpacityStyle();
                this.updateFrameOpacityStyle();
                this.replaceDefaultAvatars();
                this.startAvatarObserver();
                this.moveSearchBoxToCenter();
                this.mergeCategoryToNav();
                this.toggleUserStatsPanel();
                this.toggleFooter(); // 应用页脚隐藏设置
                this.togglePostCategory(); // 应用分类标签隐藏设置
                this.togglePostInfo(); // 应用帖子信息隐藏设置
                this.toggleTopicCarousel(); // 应用推荐轮播隐藏设置
                this.addRightPanelHighlightInput(); // 在右侧面板添加关键词输入框
                // 延迟应用高亮，确保DOM完全加载
                setTimeout(() => {
                    this.applyRightPanelHighlight();
                }, 200);
                this.startRightPanelHighlightObserver(); // 启动右侧面板高亮观察器
                this.initKeyboardNavigation(); // 初始化键盘快捷键
                this.initPostVisitListener(); // 初始化访问监听，用于自动重新排序

                // 延迟执行排序，确保DOM完全加载
                // 使用多种方式确保排序能执行
                setTimeout(() => {
                    this.sortPostList();
                    // 同时重新应用高亮
                    this.applyRightPanelHighlight();
                }, 100);

                // 如果页面还在加载，等待load事件
                if (document.readyState === 'loading') {
                    window.addEventListener('load', () => {
                        setTimeout(() => {
                            this.sortPostList();
                            // 同时重新应用高亮
                            this.applyRightPanelHighlight();
                        }, 200);
                    }, { once: true });
                }

                // 使用MutationObserver监听帖子列表的出现
                const postListObserver = new MutationObserver(() => {
                    const postList = document.querySelector(opts.post.postListSelector);
                    if (postList && postList.children.length > 0) {
                        setTimeout(() => {
                            this.sortPostList();
                            // 同时重新应用高亮
                            this.applyRightPanelHighlight();
                        }, 100);
                        postListObserver.disconnect();
                    }
                });

                // 如果帖子列表还不存在，开始观察
                const postList = document.querySelector(opts.post.postListSelector);
                if (!postList || postList.children.length === 0) {
                    if (document.body) {
                        postListObserver.observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                        // 5秒后自动停止观察
                        setTimeout(() => postListObserver.disconnect(), 5000);
                    }
                } else {
                    // 如果帖子列表已经存在，立即应用高亮
                    setTimeout(() => {
                        this.applyRightPanelHighlight();
                    }, 300);
                }

                // 如果启用了显示所有用户统计，则执行
                if (Config.getConfig('show_all_users_stats.enabled') === true) {
                    setTimeout(() => {
                        this.showAllUsersStats();
                    }, 500);
                }
            }
        };
        main.init();
        });
    });
})();
                        layui.form.on('checkbox(hide_visited_links)', function(data) {
                            Config.updateConfig('visited_links.hide_visited', data.elem.checked);
                            _this.updateVisitedLinkStyle();
                        });
