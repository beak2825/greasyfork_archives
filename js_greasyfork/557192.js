// ==UserScript==
// @name         あいもげサイドバー 機能拡張版
// @namespace    http://tampermonkey.net/
// @version      1.9.9
// @description  公式サイドバーを機能拡張
// @author       nrrr
// @match        https://nijiurachan.net/*/catalog*
// @match        https://nijiurachan.net/pc/catalog.php*
// @match        https://nijiurachan.net/pc/index.php*
// @match        https://nijiurachan.net/pc/thread.php*
// @match        https://nijiurachan.net/pc/archive.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557192/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%B5%E3%82%A4%E3%83%89%E3%83%90%E3%83%BC%20%E6%A9%9F%E8%83%BD%E6%8B%A1%E5%BC%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/557192/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%B5%E3%82%A4%E3%83%89%E3%83%90%E3%83%BC%20%E6%A9%9F%E8%83%BD%E6%8B%A1%E5%BC%B5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 設定・定数
    // ==========================================
    const CONFIG = {
        maxCache: 15,
        sidebarWidth: GM_getValue('sidebarWidth', 400),
        position: GM_getValue('sidebarPos', 'right'),
        tabSize: GM_getValue('tabSize', 'medium'),
        apiBase: 'https://nijiurachan.net/api/v1',
        siteBase: 'https://nijiurachan.net',
        apiWaitMs: 200,
        debounceMs: 300,
    };

    // 共通CSS
    const COMMON_CSS = `
        :root {
            --nc-sidebar-width: ${CONFIG.sidebarWidth}px;
            --nc-bg: #ffffff; --nc-bg-header: #f8f9fa; --nc-text: #333;
            --nc-border: #ccc; --nc-hover: #eef;
            --nc-active-bg: #dde; --nc-active-text: #000;
            --nc-accent: #800000; --nc-badge: #ff6b6b;
            --nc-viewer-bg: #FFFFEE; --nc-drag-over: #b3d4fc;
            --nc-btn-bg: #ffffff; --nc-btn-text: #333;
            --nc-close-bg: rgba(0,0,0,0.1); --nc-close-hover: #d00;
            --nc-sort-active: #ff4500;
        }
        #nc-root.nc-theme-dark {
            --nc-bg: #222; --nc-bg-header: #333; --nc-text: #eee;
            --nc-border: #444; --nc-hover: #555;
            --nc-active-bg: #445; --nc-active-text: #fff;
            --nc-accent: #5599ff; --nc-badge: #ff5252;
            --nc-viewer-bg: #212529; --nc-drag-over: #0d6efd;
            --nc-btn-bg: #333; --nc-btn-text: #eee;
            --nc-close-bg: rgba(255,255,255,0.2); --nc-close-hover: #ff5555;
            --nc-sort-active: #ff4500;
        }

        html, body { height: 100%; margin: 0; overflow: hidden; }
        body.nc-pos-right { margin-right: var(--nc-sidebar-width) !important; margin-left: 0 !important; }
        body.nc-pos-left { margin-left: var(--nc-sidebar-width) !important; margin-right: 0 !important; }

        #nc-site-content { display: none !important; }
        #aimg-overlay { display: block; }

        #nc-root { position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 10000; pointer-events: none; font-family: 'Meiryo', 'Yu Gothic', sans-serif; background: var(--nc-viewer-bg); }

        #nc-sidebar, #nc-thread-viewer, #nc-catalog-viewer { pointer-events: auto; }

        #nc-sidebar {
            position: absolute; top: 0; bottom: 0;
            width: var(--nc-sidebar-width);
            background: var(--nc-bg);
            display: flex; flex-direction: column;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            color: var(--nc-text);
            z-index: 200;
            overscroll-behavior: none;
            touch-action: pan-y;
        }
        body.nc-pos-right #nc-sidebar { right: 0; left: auto; border-left: 1px solid var(--nc-border); }
        body.nc-pos-left #nc-sidebar { left: 0; right: auto; border-right: 1px solid var(--nc-border); }

        #nc-thread-viewer, #nc-catalog-viewer { position: absolute; top: 0; bottom: 0; width: calc(100vw - var(--nc-sidebar-width)); background: var(--nc-viewer-bg); z-index: 100; overflow: hidden; }
        body.nc-pos-right #nc-thread-viewer, body.nc-pos-right #nc-catalog-viewer { left: 0; border-right: 1px solid var(--nc-border); }
        body.nc-pos-left #nc-thread-viewer, body.nc-pos-left #nc-catalog-viewer { right: 0; border-left: 1px solid var(--nc-border); }

        #nc-thread-viewer.hidden, #nc-catalog-viewer.hidden { pointer-events: none; z-index: -1; visibility: hidden; }

        .nc-iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; background: var(--nc-viewer-bg); visibility: hidden; }
        .nc-iframe.active { visibility: visible; }

        .nc-header, .nc-footer { padding: 6px; background: var(--nc-bg-header); display: flex; gap: 4px; flex-shrink: 0; }
        .nc-header { flex-direction: column; border-bottom: 1px solid var(--nc-border); }
        .nc-footer { border-top: 1px solid var(--nc-border); }
        .nc-row { display: flex; gap: 4px; }
        .nc-btn { flex: 1; padding: 4px; font-size: 11px; cursor: pointer; border: 1px solid var(--nc-border); background: var(--nc-btn-bg); color: var(--nc-btn-text); border-radius: 3px; text-align: center; user-select: none; transition: background 0.2s; }
        .nc-btn:hover { background: var(--nc-hover); }
        .nc-btn:disabled { opacity: 0.6; cursor: wait; }
        .nc-btn.active-sort { background: var(--nc-sort-active); color: white; border-color: var(--nc-sort-active); font-weight: bold; }
        #btn-close-all:hover { background: #8b0000; color: white; }
        .nc-resizer { position: absolute; top: 0; bottom: 0; width: 10px; cursor: col-resize; z-index: 1000; }
        body.nc-pos-right .nc-resizer { left: -5px; }
        body.nc-pos-left .nc-resizer { right: -5px; }

        #nc-tab-list { flex: 1; overflow-y: auto; scrollbar-width: thin; position: relative; overscroll-behavior: none; }
        .nc-tab { padding: 4px 5px; border-bottom: 1px solid var(--nc-border); cursor: pointer; display: flex; gap: 8px; position: relative; box-sizing: border-box; background: var(--nc-bg); transition: background 0.2s; border-left: 4px solid transparent; user-select: none; }
        .nc-tab:hover { background: var(--nc-hover); }
        .nc-tab.active { background: var(--nc-active-bg); color: var(--nc-active-text); border-left: 4px solid var(--nc-accent); }
        .nc-tab.nc-dragging { position: fixed; z-index: 999999; box-shadow: 0 5px 15px rgba(0,0,0,0.3); opacity: 0.9; pointer-events: none; background: var(--nc-bg); border: 1px solid var(--nc-accent); transform: scale(1.02); cursor: grabbing; }
        .nc-placeholder { background: rgba(0,0,0,0.03); border: 2px dashed var(--nc-border); box-sizing: border-box; margin-bottom: -1px; }
        .nc-tab-close { position: absolute; top: 2px; right: 2px; width: 24px; height: 24px; line-height: 24px; text-align: center; font-size: 18px; font-weight: bold; color: var(--nc-text); background: var(--nc-close-bg); cursor: pointer; border-radius: 4px; z-index: 10; opacity: 0; pointer-events: none; transition: opacity 0.2s, background 0.2s, color 0.2s; }
        .nc-tab:hover .nc-tab-close { opacity: 1; pointer-events: auto; }
        .nc-tab-close:hover { background: var(--nc-close-hover); color: white; }
        .nc-tab.nc-large { height: 80px; }
        .nc-tab.nc-medium { height: 60px; }
        .nc-tab.nc-small { height: 45px; padding: 4px 5px; }
        .nc-tab.nc-small .nc-tab-info { justify-content: center; }
        .nc-tab-thumb { height: 100%; aspect-ratio: 1; object-fit: cover; flex-shrink: 0; background: #ccc; display: block; border-radius: 2px; }
        .nc-tab-info { flex: 1; display: flex; flex-direction: column; min-width: 0; justify-content: space-between; }
        .nc-tab-title { font-family: 'Meiryo', 'Yu Gothic UI', sans-serif; font-weight: 500; font-size: 13.5px; line-height: 1.2; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; -webkit-font-smoothing: antialiased; margin-right: 26px; }
        .nc-tab.nc-small .nc-tab-title { font-size: 12px; -webkit-line-clamp: 1; line-height: 1.5; margin-bottom: 1px; }
        .nc-tab-meta { display: flex; justify-content: flex-end; align-items: center; gap: 6px; font-size: 11px; color: #888; }
        .nc-badge { background: var(--nc-badge); color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; }

        .nc-iframe-content header, .nc-iframe-content footer, .nc-iframe-content #sidebar, .nc-iframe-content .sidebar, .nc-iframe-content #menu, .nc-iframe-content .menu, .nc-iframe-content nav { display: none !important; }
        .nc-iframe-content body { margin: 0 !important; padding: 10px !important; overflow-x: hidden; overflow-y: auto !important; }
        .nc-iframe-content #main, .nc-iframe-content .main { margin: 0 !important; width: 100% !important; max-width: none !important; }
    `;

    GM_addStyle(COMMON_CSS);

    const Utils = {
        debounce: (func, delay) => {
            let timeoutId;
            return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func(...args), delay); };
        },
        decodeStr: (str) => {
            if (!str) return '';
            const txt = document.createElement('textarea');
            txt.innerHTML = str;
            return txt.value;
        },
        postMsg: (type, data) => window.parent.postMessage({ type, ...data }, '*'),
        fetchJson: (url) => new Promise(r => GM_xmlhttpRequest({
            method: 'GET', url, responseType: 'json',
            onload: x => {
                const response = x.response || {};
                if ((x.status >= 200 && x.status < 300) && (response.ok !== false)) r(response);
                else r({ ok: false, status: x.status, ...response });
            },
            onerror: () => r({ok:false, status: 0})
        }))
    };

    const initIframeCommon = () => {
        document.documentElement.classList.add('nc-iframe-content');
        const style = document.createElement('style');
        style.textContent = `
            html { overflow-y: scroll !important; overflow-x: hidden !important; height: 100% !important; overscroll-behavior: none !important; }
            body { overflow: visible !important; height: auto !important; position: static !important; }
        `;
        document.head.appendChild(style);
        window.addEventListener('DOMContentLoaded', () => {
            const removeTargets = document.querySelectorAll('header, footer, #sidebar, .sidebar, #menu, nav, .ad, iframe[src*="ad"]');
            removeTargets.forEach(el => el.remove());
        });

        window.addEventListener('mouseup', (e) => {
            if (e.button === 3) {
                e.preventDefault(); e.stopPropagation();
                Utils.postMsg('NC_NAV_REQ', { dir: 'back' });
            } else if (e.button === 4) {
                e.preventDefault(); e.stopPropagation();
                Utils.postMsg('NC_NAV_REQ', { dir: 'forward' });
            }
        }, true);
    };

    const initThreadIframe = () => {
        initIframeCommon();
        let threadId = null;
        const match = location.search.match(/id=(\d+)/);
        if (match) threadId = parseInt(match[1]);
        else {
            const input = document.querySelector('input[name="thread_id"]');
            if (input) threadId = parseInt(input.value);
            if (!threadId) {
                 const resMatch = location.href.match(/\/res\/(\d+)\.htm/);
                 if (resMatch) threadId = parseInt(resMatch[1]);
            }
        }
        if (!threadId) return;

        const notifyScroll = Utils.debounce(() => Utils.postMsg('NC_SCROLL', { threadId, scrollY: window.scrollY }), CONFIG.debounceMs);
        let countOffset = 0;

        const getReplyCount = () => {
            let count = document.querySelectorAll('.rtd').length;
            if (count > 0) return count;

            const checks = document.querySelectorAll('input[type="checkbox"][value="delete"]');
            if (checks.length > 0) return Math.max(0, checks.length - 1);

            const tds = document.querySelectorAll('td.rtd');
            if (tds.length > 0) return tds.length;

            return 0;
        };

        const notifyCount = Utils.debounce(() => {
            const domCount = getReplyCount();
            Utils.postMsg('NC_UPDATE_COUNT', { threadId, count: domCount + countOffset });
        }, 500);

        window.addEventListener('message', (e) => {
            if (e.data.type === 'NC_SYNC_BASE_COUNT') {
                countOffset = e.data.count - getReplyCount();
                notifyCount();
            }
            if (e.data.type === 'NC_RESTORE_SCROLL') {
                const y = e.data.scrollY;
                if (y && y > 0) {
                    const fs = () => window.scrollTo(0, y);
                    fs(); requestAnimationFrame(fs); setTimeout(fs, 200);
                }
            }
        });

        const checkDeadStatus = () => {
            const bodyText = document.body.innerText;
            if (
                bodyText.includes('このスレッドは落ちています') ||
                bodyText.includes('過去ログとして保存') ||
                bodyText.includes('書き込み・そうだね・delはできません') ||
                bodyText.includes('スレッドがありません') ||
                document.title.includes('404 Not Found')
            ) {
                Utils.postMsg('NC_THREAD_DEAD', { threadId });
            }
        };

        window.addEventListener('load', () => {
            checkDeadStatus();
            Utils.postMsg('NC_IFRAME_LOADED', { threadId, sync: true });
            notifyCount();
        });
        window.addEventListener('scroll', notifyScroll);
        const observer = new MutationObserver(() => notifyCount());
        const target = document.getElementById('main') || document.body;
        if (target) observer.observe(target, { childList: true, subtree: true });
    };

    const initCatalogIframe = () => {
        initIframeCommon();
        window.addEventListener('load', () => { Utils.postMsg('NC_CATALOG_LOADED', {}); });
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            const href = link.href;
            if (href.includes('catalog.php') || href.match(/\/catalog\/?(\?.*)?$/)) return;
            if (href.includes('thread.php') || href.includes('/res/')) {
                e.preventDefault(); e.stopPropagation();

                let thumbUrl = null;
                const img = link.querySelector('img');
                if (img) {
                    thumbUrl = img.src || img.dataset.src;
                }

                let titleText = null;
                let replyCount = 0;
                const cell = link.closest('td');
                if (cell) {
                    const small = cell.querySelector('small');
                    if (small) titleText = small.textContent.trim();

                    const font = cell.querySelector('font');
                    if (font) {
                        const num = parseInt(font.textContent, 10);
                        if (!isNaN(num)) replyCount = num;
                    }
                }

                Utils.postMsg('NC_OPEN_THREAD', {
                    url: href,
                    thumb: thumbUrl,
                    title: titleText,
                    count: replyCount
                });
            }
        }, true);
    };

    function initParentLogic() {
        let ui = null;
        const savedTabs = GM_getValue('nc_saved_tabs', []);
        const state = { tabs: savedTabs, activeThreadId: null, isCatalogView: true, isSortActive: false, isRefreshing: false };

        class ViewManager {
            static initWrapper() {
                if (document.getElementById('nc-site-content')) return;
                const style = document.createElement('style');
                style.textContent = `html, body { height: 100%; margin: 0; overflow: hidden !important; }`;
                document.head.appendChild(style);
                const wrapper = document.createElement('div');
                wrapper.id = 'nc-site-content';
                const excludedIds = ['nc-root', 'thread-form-container', 'aimg-overlay'];
                const children = Array.from(document.body.childNodes);
                children.forEach(node => {
                    if (node.nodeType === 1 && (excludedIds.includes(node.id) || node.tagName === 'SCRIPT' || node.tagName === 'STYLE')) return;
                    wrapper.appendChild(node);
                });
                document.body.appendChild(wrapper);
                const root = document.getElementById('nc-root');
                if (root) document.body.appendChild(root);
                const form = document.getElementById('thread-form-container');
                if (form) document.body.appendChild(form);
            }
            static showCatalog() {
                state.isCatalogView = true;
                document.getElementById('nc-thread-viewer').classList.add('hidden');
                document.getElementById('nc-catalog-viewer').classList.remove('hidden');
                document.body.classList.remove('nc-view-mode');
                if (ui) { ui.renderTabs(); ui.updateViewButton(); }
            }
            static showThreadView() {
                state.isCatalogView = false;
                document.getElementById('nc-thread-viewer').classList.remove('hidden');
                document.getElementById('nc-catalog-viewer').classList.add('hidden');
                document.body.classList.add('nc-view-mode');
                if (ui) ui.updateViewButton();
            }
            static navigateCatalog(targetUrl) {
                const iframe = document.getElementById('nc-catalog-iframe');
                if (iframe) {
                    const u = new URL(targetUrl);
                    u.searchParams.set('_t', Date.now());
                    iframe.contentWindow.location.replace(u.toString());
                }
                this.showCatalog();
                ThreadManager.refreshAll(true);
            }
            static reloadCatalogFrame() {
                const iframe = document.getElementById('nc-catalog-iframe');
                if (iframe && iframe.contentWindow) {
                    try {
                        const doc = iframe.contentDocument;
                        if (doc) {
                            const imgs = doc.querySelectorAll('img[data-src]');
                            imgs.forEach(img => {
                                if (img.dataset.src) {
                                    img.src = img.dataset.src;
                                    img.removeAttribute('data-src');
                                }
                            });
                        }
                    } catch(e) {}
                    iframe.contentWindow.location.reload();
                }
            }
        }

        const DragManager = {
            dragEl: null, placeholder: null, startX: 0, startY: 0, isDragging: false, listEl: null,
            init(el, e) {
                if (e.button !== 0) return;
                this.dragEl = el;
                this.listEl = document.getElementById('nc-tab-list');
                this.startX = e.clientX; this.startY = e.clientY;
                window.addEventListener('mousemove', this.onMove, true);
                window.addEventListener('mouseup', this.onUp, true);
            },
            onMove: (e) => {
                const dm = DragManager;
                if (!dm.dragEl) return;
                if (!dm.isDragging) {
                    if (Math.hypot(e.clientX - dm.startX, e.clientY - dm.startY) < 5) return;
                    dm.startDrag();
                }
                dm.dragEl.style.transform = `translate(0px, ${e.clientY - dm.startY}px)`;
                const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.nc-tab');
                if (target && target !== dm.dragEl && target.parentNode === dm.listEl) {
                    const rect = target.getBoundingClientRect();
                    if (e.clientY < rect.top + rect.height / 2) dm.listEl.insertBefore(dm.placeholder, target);
                    else dm.listEl.insertBefore(dm.placeholder, target.nextSibling);
                }
            },
            startDrag() {
                this.isDragging = true;
                const rect = this.dragEl.getBoundingClientRect();
                this.placeholder = document.createElement('div');
                this.placeholder.className = 'nc-placeholder';
                this.placeholder.style.height = rect.height + 'px';
                this.dragEl.parentNode.insertBefore(this.placeholder, this.dragEl);
                this.dragEl.classList.add('nc-dragging');
                this.dragEl.style.width = rect.width + 'px';
                this.dragEl.style.height = rect.height + 'px';
                this.dragEl.style.top = rect.top + 'px';
                this.dragEl.style.left = rect.left + 'px';
                this.dragEl.style.margin = '0';
                document.getElementById('nc-root').appendChild(this.dragEl);
            },
            onUp: (e) => {
                const dm = DragManager;
                window.removeEventListener('mousemove', dm.onMove, true);
                window.removeEventListener('mouseup', dm.onUp, true);
                if (!dm.isDragging) { dm.dragEl = null; return; }
                e.preventDefault(); e.stopPropagation();
                const el = dm.dragEl;
                el.classList.remove('nc-dragging');
                el.style = '';
                if (dm.placeholder.parentNode) dm.placeholder.parentNode.replaceChild(el, dm.placeholder);
                else dm.listEl.appendChild(el);

                const newTabs = [];
                Array.from(dm.listEl.querySelectorAll('.nc-tab')).forEach(dom => {
                    const idx = parseInt(dom.dataset.index, 10);
                    if (!isNaN(idx) && state.tabs[idx]) newTabs.push(state.tabs[idx]);
                });
                if (newTabs.length === state.tabs.length) {
                    state.tabs = newTabs;
                    ThreadManager.saveTabs();
                    if (ui) ui.renderTabs();
                }
                dm.dragEl = null; dm.placeholder = null; dm.isDragging = false;
            }
        };

        class ThreadManager {
            static saveTabs() {
                const dataToSave = state.tabs.map(t => ({
                    id: t.id, url: t.url, title: t.title, thumb: t.thumb,
                    replyCount: t.replyCount, lastResId: t.lastResId,
                    unreadCount: t.unreadCount, lastScroll: t.lastScroll || 0,
                    isDead: t.isDead || false,
                    isFutaba: t.isFutaba || false
                }));
                GM_setValue('nc_saved_tabs', dataToSave);
            }

            static handleLinkClick(e) {
                const link = e.target.closest('a'); if (!link) return;
                const href = link.href;
                if (href.includes('catalog.php') || href.match(/\/catalog\/?(\?.*)?$/)) {
                    e.preventDefault();
                    ViewManager.navigateCatalog(href);
                    return;
                }
                if (href.includes('thread.php') || href.includes('/res/')) {
                    let id = null;
                    try {
                        const urlObj = new URL(href, window.location.origin);
                        id = urlObj.searchParams.get('id');
                        if (!id) { const match = href.match(/\/res\/(\d+)/); if (match) id = match[1]; }
                    } catch(e) { console.error(e); }
                    if (id) {
                        e.preventDefault(); e.stopPropagation();

                        let title = null;
                        let replyCount = 0;

                        // ★ 修正: link.closestが関数かチェック
                        if (typeof link.closest === 'function') {
                            const cell = link.closest('td');
                            if (cell) {
                                const small = cell.querySelector('small');
                                if (small) title = small.textContent.trim();

                                const font = cell.querySelector('font');
                                if (font) {
                                    const num = parseInt(font.textContent, 10);
                                    if (!isNaN(num)) replyCount = num;
                                }
                            }
                        }

                        this.openThread(parseInt(id, 10), href, null, title, replyCount);
                    }
                }
            }

            static openThread(id, url, initialThumb = null, initialTitle = null, initialCount = 0) {
                let tab = state.tabs.find(t => t.id === id);
                if (tab) {
                    if (!state.isSortActive) { state.tabs = state.tabs.filter(t => t.id !== id); state.tabs.unshift(tab); }
                    tab.unreadCount = 0;
                } else {
                    const isFutaba = url.includes('2chan.net');
                    tab = {
                        id, url, isFutaba,
                        title: initialTitle || '読み込み中...',
                        thumb: initialThumb,
                        replyCount: initialCount || 0,
                        iframe: null, lastResId: id,
                        unreadCount: 0, lastScroll: 0, isDead: false
                    };
                    state.tabs.unshift(tab);
                    if (state.tabs.length > CONFIG.maxCache) {
                        const removed = state.tabs.pop();
                        if (removed.iframe) removed.iframe.remove();
                    }
                    this.fetchMetadata(tab);
                }
                this.saveTabs(); if(ui) ui.renderTabs(); this.activateThread(id);
            }

            static updateDeadStatus(tab) {
                if (!tab.isDead) return;
                const prefix = "[スレ落ち]";
                if (!tab.title.startsWith(prefix)) {
                    let cleanTitle = tab.title.replace(/^(\[(落ち|スレ落ち|404)\]\s*)+/, '');
                    tab.title = `${prefix} ${cleanTitle}`;
                }
            }

            static async fetchMetadata(tab) {
                if (tab.isDead || tab.isFutaba) return; // FutabaはAPI取得しない
                try {
                    const res = await Utils.fetchJson(`${CONFIG.apiBase}/thread/${tab.id}`);
                    if(res.ok && res.data) {
                        this.applyThreadData(tab, res.data);
                        this.saveTabs(); if(ui) ui.renderTabs();
                    }
                } catch(e) {}
            }

            static applyThreadData(tab, data) {
                const t = data.thread;
                let titleText = '';

                if (t.body) {
                    let raw = t.body.replace(/<[^>]*>/g, ' ').trim();
                    titleText = Utils.decodeStr(raw).replace(/\s+/g, ' ').substring(0, 30);
                }

                if (!titleText || titleText.length === 0) titleText = "本文なし";

                tab.title = Utils.decodeStr(titleText);
                if (tab.isDead) this.updateDeadStatus(tab);

                if (t.thumb) tab.thumb = t.thumb; else if (t.image) tab.thumb = t.image;

                if (data.reply_count !== undefined) tab.replyCount = data.reply_count;
                else if (data.replies) tab.replyCount = data.replies.length;

                if (data.replies && data.replies.length > 0) {
                    tab.lastResId = data.replies[data.replies.length - 1].id;
                }
            }

            static async syncThreadFromApi(threadId) {
                const tab = state.tabs.find(t => t.id === threadId);
                if (!tab || tab.isDead || tab.isFutaba) return; // Futabaはスキップ
                try {
                    const res = await Utils.fetchJson(`${CONFIG.apiBase}/thread/${tab.id}`);
                    if (res.ok && res.data) {
                        const newCount = res.data.thread.reply_count || 0;
                        const oldCount = tab.replyCount || 0;
                        if (newCount !== oldCount) {
                            tab.replyCount = newCount;
                            if (state.activeThreadId !== threadId && newCount > oldCount) {
                                tab.unreadCount += (newCount - oldCount);
                            }
                            if (res.data.replies && res.data.replies.length > 0) {
                                tab.lastResId = res.data.replies[res.data.replies.length - 1].id;
                            }
                            this.saveTabs(); if(ui) ui.renderTabs();
                        }
                        if (tab.iframe && tab.iframe.contentWindow) {
                            tab.iframe.contentWindow.postMessage({ type: 'NC_SYNC_BASE_COUNT', count: tab.replyCount }, '*');
                        }
                    } else if (res.status === 404 || !res.ok) {
                        this.markAsDead(threadId);
                    }
                } catch(e) { console.error(e); }
            }

            static markAsDead(threadId) {
                const tab = state.tabs.find(t => t.id === threadId);
                if (tab) {
                    tab.isDead = true;
                    this.updateDeadStatus(tab);
                    this.saveTabs(); if(ui) ui.renderTabs();
                }
            }

            static updateReplyCount(threadId, count) {
                const tab = state.tabs.find(t => t.id === threadId);
                if (tab && count > (tab.replyCount || 0)) {
                    tab.replyCount = count;
                    if (state.activeThreadId === threadId) tab.unreadCount = 0;
                    this.saveTabs(); if(ui) ui.renderTabs();
                }
            }

            static updateScroll(threadId, scrollY) {
                const tab = state.tabs.find(t => t.id === threadId);
                if (tab) { tab.lastScroll = scrollY; this.saveTabs(); }
            }

            static onIframeLoaded(threadId, shouldSync) {
                const tab = state.tabs.find(t => t.id === threadId);
                if (tab) {
                    if (tab.lastScroll > 0 && tab.iframe && tab.iframe.contentWindow) {
                        tab.iframe.contentWindow.postMessage({ type: 'NC_RESTORE_SCROLL', scrollY: tab.lastScroll }, '*');
                    }
                    if (shouldSync) this.syncThreadFromApi(threadId);
                }
            }

            static activateThread(id) {
                state.activeThreadId = id;
                const tab = state.tabs.find(t => t.id === id);
                if (!tab) return;
                if (tab.unreadCount > 0) { tab.unreadCount = 0; this.saveTabs(); }
                state.tabs.forEach(t => {
                    if (t.iframe) {
                        if (t.id === id) t.iframe.classList.add('active');
                        else t.iframe.classList.remove('active');
                    }
                });
                ViewManager.showThreadView();
                if(ui) ui.renderTabs();
                if (!tab.iframe) {
                    const iframe = document.createElement('iframe');
                    iframe.className = 'nc-iframe active';
                    iframe.id = `nc-thread-iframe-${id}`;
                    iframe.src = tab.url;
                    tab.iframe = iframe;
                    document.getElementById('nc-thread-viewer').appendChild(iframe);
                }
            }

            static toggleView() {
                if (state.isCatalogView) {
                    if (state.activeThreadId) this.activateThread(state.activeThreadId);
                    else ViewManager.showCatalog();
                } else {
                    ViewManager.showCatalog();
                }
            }

            static async refreshAll(skipFrameReload = false) {
                if (state.isRefreshing) return;
                state.isRefreshing = true;
                const btn = document.getElementById('btn-refresh');
                const txt = btn ? btn.innerText : '...';
                if(btn) { btn.innerText = '...'; btn.disabled = true; }

                try {
                    if (state.isCatalogView && !skipFrameReload) ViewManager.reloadCatalogFrame();

                    let activeThreadsMap = null;
                    try {
                        const catRes = await Utils.fetchJson(`${CONFIG.apiBase}/catalog?limit=200`);
                        if (catRes.ok && catRes.data && catRes.data.threads) {
                            activeThreadsMap = new Map();
                            catRes.data.threads.forEach(t => activeThreadsMap.set(t.id, t.reply_count));
                        }
                    } catch(e) { activeThreadsMap = null; }

                    let anyUpdate = false;
                    for (let tab of state.tabs) {
                        if (!tab.lastResId || tab.isDead || tab.isFutaba) continue; // FutabaはAPI更新対象外

                        if (activeThreadsMap !== null) {
                            const remoteCount = activeThreadsMap.get(tab.id);
                            if (remoteCount === undefined) continue;

                            if (remoteCount > (tab.replyCount || 0)) {
                                const diff = remoteCount - (tab.replyCount || 0);
                                tab.replyCount = remoteCount;
                                if (tab.id !== state.activeThreadId) {
                                    tab.unreadCount += diff;
                                }
                                anyUpdate = true;
                            }
                        }
                    }

                    if (anyUpdate) {
                        this.saveTabs();
                        if(ui) ui.renderTabs();
                    }

                } catch(err) { console.error(err); }
                finally {
                    if(btn) { btn.innerText = txt; btn.disabled = false; }
                    state.isRefreshing = false;
                }
            }

            static reorderTabs(fromIdx, toIdx) {
                const item = state.tabs[fromIdx];
                state.tabs.splice(fromIdx, 1);
                state.tabs.splice(toIdx, 0, item);
                this.saveTabs(); if(ui) ui.renderTabs();
            }
            static toggleSort() {
                state.isSortActive = !state.isSortActive;
                if(ui) { ui.updateSortButton(); ui.renderTabs(); }
            }
            static markAllRead() { state.tabs.forEach(t => t.unreadCount = 0); this.saveTabs(); if(ui) ui.renderTabs(); }
            static closeThread(id) {
                const tab = state.tabs.find(t => t.id === id);
                const iframe = document.getElementById(`nc-thread-iframe-${id}`);
                if (iframe) iframe.remove();
                state.tabs = state.tabs.filter(t => t.id !== id);
                if (state.activeThreadId === id) {
                    state.activeThreadId = null; ViewManager.showCatalog();
                } else {
                    this.saveTabs(); if(ui) { ui.renderTabs(); ui.updateViewButton(); }
                }
            }
            static closeAll() {
                if(!confirm('履歴を全部削除しますか？')) return;
                const viewer = document.getElementById('nc-thread-viewer');
                if(viewer) viewer.innerHTML = '';
                state.tabs = []; state.activeThreadId = null;
                ViewManager.showCatalog(); this.saveTabs(); if(ui) ui.renderTabs();
            }
        }

        class SidebarUI {
            constructor() {
                ViewManager.initWrapper();

                const style = document.createElement('style');
                style.textContent = `html, body { height: 100%; margin: 0; overflow: hidden; }`;
                document.head.appendChild(style);

                this.root = document.createElement('div');
                this.root.id = 'nc-root';
                this.sidebar = document.createElement('div');
                this.sidebar.id = 'nc-sidebar';

                this.tViewer = document.createElement('div');
                this.tViewer.id = 'nc-thread-viewer';
                this.tViewer.classList.add('hidden');

                this.cViewer = document.createElement('div');
                this.cViewer.id = 'nc-catalog-viewer';
                const cIframe = document.createElement('iframe');
                cIframe.id = 'nc-catalog-iframe';
                cIframe.className = 'nc-iframe active';
                cIframe.src = location.href.includes('catalog') ? location.href : `${CONFIG.siteBase}/pc/catalog.php`;
                this.cViewer.appendChild(cIframe);

                this.root.append(this.tViewer, this.cViewer, this.sidebar);
                document.body.appendChild(this.root);

                this.renderLayout();
                this.attachEvents();
                this.applyPositionClass();
                this.startThemeObserver();

                if (location.href.includes('thread.php')) {
                    ThreadManager.handleLinkClick({
                        target: { closest: () => ({ href: location.href }) },
                        preventDefault: ()=>{}, stopPropagation: ()=>{}
                    });
                }

                window.addEventListener('message', (e) => {
                    if (!e.data) return;
                    switch(e.data.type) {
                        case 'NC_NAV_REQ':
                            if (e.data.dir === 'back') ViewManager.showCatalog();
                            else if (e.data.dir === 'forward' && state.activeThreadId) ThreadManager.activateThread(state.activeThreadId);
                            break;
                        case 'NC_UPDATE_COUNT': ThreadManager.updateReplyCount(e.data.threadId, e.data.count); break;
                        case 'NC_SCROLL': ThreadManager.updateScroll(e.data.threadId, e.data.scrollY); break;
                        case 'NC_IFRAME_LOADED': ThreadManager.onIframeLoaded(e.data.threadId, e.data.sync); break;
                        case 'NC_THREAD_DEAD': ThreadManager.markAsDead(e.data.threadId); break;
                        case 'NC_CATALOG_LOADED': ThreadManager.refreshAll(true); break;
                        case 'NC_OPEN_THREAD':
                            if (e.data.url) {
                                let tid = null;
                                try {
                                    const u = new URL(e.data.url, window.location.origin);
                                    tid = u.searchParams.get('id');
                                    if (!tid) { const m = e.data.url.match(/\/res\/(\d+)/); if(m) tid = m[1]; }
                                } catch(e){}
                                if (tid) ThreadManager.openThread(parseInt(tid, 10), e.data.url, e.data.thumb, e.data.title, e.data.count);
                            }
                            break;
                    }
                });

                const preventReload = (e) => e.stopPropagation();
                this.sidebar.addEventListener('wheel', preventReload, { passive: false });
                this.sidebar.addEventListener('touchmove', preventReload, { passive: false });
                this.sidebar.addEventListener('touchstart', preventReload, { passive: false });

                window.addEventListener('mouseup', (e) => {
                    if (e.button === 3) {
                        e.preventDefault(); e.stopPropagation();
                        ViewManager.showCatalog();
                    } else if (e.button === 4) {
                        e.preventDefault(); e.stopPropagation();
                        if (state.activeThreadId) ThreadManager.activateThread(state.activeThreadId);
                    }
                }, true);
            }

            renderLayout() {
                this.sidebar.innerHTML = '';

                const resizer = document.createElement('div');
                resizer.className = 'nc-resizer';

                const header = document.createElement('div');
                header.className = 'nc-header';
                header.innerHTML = `
                    <div class="nc-row">
                        <button id="btn-read" class="nc-btn" title="全ての未読バッジを消去">既読</button>
                        <button id="btn-refresh" class="nc-btn" title="APIで新着を確認">更新</button>
                        <button id="btn-sort" class="nc-btn">新着ソート</button>
                    </div>
                    <div class="nc-row"><button id="btn-toggle-view" class="nc-btn">カタログに戻る</button></div>
                `;

                const list = document.createElement('div');
                list.id = 'nc-tab-list';

                const footer = document.createElement('div');
                footer.className = 'nc-footer';
                footer.innerHTML = `
                    <button id="btn-size" class="nc-btn">サイズ変更</button>
                    <button id="btn-close-all" class="nc-btn">全削除</button>
                    <button id="btn-pos" class="nc-btn">${CONFIG.position === 'right' ? '◀' : '▶'}</button>
                `;

                this.sidebar.append(resizer, header, list, footer);

                this.updateSizeBtnLabel();
                this.renderTabs();
                this.updateViewButton();
            }

            updateSizeBtnLabel() {
                const btn = this.sidebar.querySelector('#btn-size');
                if(btn) btn.innerText = `サイズ: ${{ 'large': '大', 'medium': '中', 'small': '小' }[CONFIG.tabSize]}`;
            }

            attachEvents() {
                const byId = (id) => this.sidebar.querySelector(`#${id}`);
                byId('btn-read').addEventListener('click', () => ThreadManager.markAllRead());
                byId('btn-refresh').addEventListener('click', () => ThreadManager.refreshAll());
                byId('btn-sort').addEventListener('click', () => ThreadManager.toggleSort());
                byId('btn-toggle-view').addEventListener('click', () => ThreadManager.toggleView());
                byId('btn-close-all').addEventListener('click', () => ThreadManager.closeAll());
                byId('btn-pos').addEventListener('click', () => this.togglePosition());
                byId('btn-size').addEventListener('click', () => this.toggleTabSize());

                const resizer = this.sidebar.querySelector('.nc-resizer');
                let isResizing = false, rAF = null;
                resizer.addEventListener('mousedown', (e) => { isResizing = true; document.body.style.cursor = 'col-resize'; e.preventDefault(); });
                window.addEventListener('mousemove', (e) => {
                    if (!isResizing || rAF) return;
                    rAF = requestAnimationFrame(() => {
                        let w = CONFIG.position === 'right' ? window.innerWidth - e.clientX : e.clientX;
                        if (w > 200 && w < window.innerWidth * 0.8) { CONFIG.sidebarWidth = w; document.documentElement.style.setProperty('--nc-sidebar-width', w + 'px'); }
                        rAF = null;
                    });
                });
                window.addEventListener('mouseup', () => { if(isResizing) { isResizing = false; document.body.style.cursor = 'default'; GM_setValue('sidebarWidth', CONFIG.sidebarWidth); } });
            }

            applyPositionClass() {
                document.body.classList.remove('nc-pos-right', 'nc-pos-left'); document.body.classList.add(`nc-pos-${CONFIG.position}`);
                const btn = this.sidebar.querySelector('#btn-pos'); if(btn) btn.innerText = CONFIG.position === 'right' ? '◀' : '▶';
            }

            togglePosition() { CONFIG.position = CONFIG.position === 'right' ? 'left' : 'right'; GM_setValue('sidebarPos', CONFIG.position); this.applyPositionClass(); }

            toggleTabSize() {
                const sizes = ['large', 'medium', 'small']; CONFIG.tabSize = sizes[(sizes.indexOf(CONFIG.tabSize) + 1) % sizes.length];
                GM_setValue('tabSize', CONFIG.tabSize); this.updateSizeBtnLabel(); this.renderTabs();
            }

            startThemeObserver() {
                const check = () => {
                    const rgb = window.getComputedStyle(document.body).backgroundColor.match(/\d+/g);
                    if (rgb && (parseInt(rgb[0])*299 + parseInt(rgb[1])*587 + parseInt(rgb[2])*114)/1000 < 128) this.root.classList.add('nc-theme-dark');
                    else this.root.classList.remove('nc-theme-dark');
                };
                check(); new MutationObserver(check).observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
            }

            updateViewButton() {
                const btn = this.sidebar.querySelector('#btn-toggle-view'); if (!btn) return;
                btn.innerText = (state.isCatalogView && state.activeThreadId) ? 'スレに戻る' : 'カタログに戻る';
            }

            renderTabs() {
                const list = document.getElementById('nc-tab-list'); if(!list) return;

                // DOM差分更新
                let displayTabs = state.tabs;
                if (state.isSortActive) displayTabs = [...state.tabs].sort((a, b) => (b.unreadCount - a.unreadCount) || (b.lastResId - a.lastResId));

                const currentElements = Array.from(list.children);
                const currentIds = currentElements.map(el => parseInt(el.dataset.id));
                const newIds = displayTabs.map(t => t.id);

                const needRebuild = currentIds.length !== newIds.length || currentIds.some((id, i) => id !== newIds[i]);

                if (needRebuild) {
                    list.innerHTML = '';
                    displayTabs.forEach(this.createTabElement);
                } else {
                    displayTabs.forEach((tab, i) => {
                        this.updateTabElement(currentElements[i], tab);
                    });
                }
            }

            createTabElement(tab) {
                const list = document.getElementById('nc-tab-list');
                const div = document.createElement('div');
                div.className = `nc-tab ${state.activeThreadId === tab.id ? 'active' : ''} nc-${CONFIG.tabSize}`;
                if (tab.isDead) div.style.opacity = '0.5';
                div.dataset.id = tab.id;
                div.dataset.index = state.tabs.indexOf(tab);

                if (!state.isSortActive) div.addEventListener('mousedown', (e) => DragManager.init(div, e));

                const closeBtn = document.createElement('div');
                closeBtn.className = 'nc-tab-close';
                closeBtn.textContent = '×';
                closeBtn.addEventListener('mousedown', (e) => e.stopPropagation());
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); ThreadManager.closeThread(tab.id);
                });
                div.appendChild(closeBtn);

                let thumbEl;
                if (tab.thumb) {
                    thumbEl = document.createElement('img');
                    let src = tab.thumb;
                    if (!src.startsWith('http')) src = CONFIG.siteBase + (src.startsWith('/') ? '' : '/') + src;
                    thumbEl.src = src;
                    thumbEl.className = 'nc-tab-thumb';
                } else {
                    thumbEl = document.createElement('div');
                    thumbEl.className = 'nc-tab-thumb';
                    thumbEl.style.cssText = "display:flex;align-items:center;justify-content:center;color:#888;font-size:10px;";
                    thumbEl.textContent = "No Img";
                }
                div.appendChild(thumbEl);

                const infoDiv = document.createElement('div');
                infoDiv.className = 'nc-tab-info';

                const titleDiv = document.createElement('div');
                titleDiv.className = 'nc-tab-title';
                titleDiv.textContent = tab.title;

                const metaDiv = document.createElement('div');
                metaDiv.className = 'nc-tab-meta';

                const badge = document.createElement('span');
                badge.className = 'nc-badge';
                if (tab.unreadCount > 0) badge.textContent = tab.unreadCount;
                else badge.style.display = 'none';
                metaDiv.appendChild(badge);

                const countSpan = document.createElement('span');
                countSpan.className = 'nc-count';
                countSpan.textContent = tab.isFutaba ? (tab.replyCount||0) : (tab.replyCount||0) + 1;
                metaDiv.appendChild(countSpan);

                infoDiv.append(titleDiv, metaDiv);
                div.appendChild(infoDiv);

                div.addEventListener('click', (e) => {
                    if (!DragManager.isDragging) ThreadManager.activateThread(tab.id);
                });
                div.addEventListener('mouseup', (e) => {
                    if (e.button === 1) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(tab.url, '_blank');
                    }
                });
                div.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    if(confirm('このタブを閉じますか？')) ThreadManager.closeThread(tab.id);
                });
                list.appendChild(div);
            }

            updateTabElement(div, tab) {
                if (tab.id === state.activeThreadId) div.classList.add('active');
                else div.classList.remove('active');

                div.style.opacity = tab.isDead ? '0.5' : '1';

                const titleEl = div.querySelector('.nc-tab-title');
                if (titleEl && titleEl.textContent !== tab.title) titleEl.textContent = tab.title;

                const thumbEl = div.querySelector('.nc-tab-thumb');
                if (thumbEl) {
                    let newSrc = tab.thumb;
                    if (newSrc) {
                        if (!newSrc.startsWith('http')) newSrc = CONFIG.siteBase + (newSrc.startsWith('/') ? '' : '/') + newSrc;
                        if (thumbEl.tagName === 'IMG') {
                            if (thumbEl.getAttribute('src') !== newSrc) thumbEl.src = newSrc;
                        } else {
                            const newThumb = document.createElement('img');
                            newThumb.src = newSrc;
                            newThumb.className = 'nc-tab-thumb';
                            thumbEl.parentNode.replaceChild(newThumb, thumbEl);
                        }
                    }
                }

                const badgeEl = div.querySelector('.nc-badge');
                if (badgeEl) {
                    if (tab.unreadCount > 0) {
                        badgeEl.textContent = tab.unreadCount;
                        badgeEl.style.display = '';
                    } else {
                        badgeEl.style.display = 'none';
                    }
                }

                const countEl = div.querySelector('.nc-count');
                const newCount = tab.isFutaba ? (tab.replyCount||0) : (tab.replyCount||0) + 1;
                if (countEl.textContent != newCount) countEl.textContent = newCount;
            }

            updateSortButton() {
                const btn = document.getElementById('btn-sort');
                if (state.isSortActive) {
                    btn.classList.add('active-sort');
                    btn.textContent = '▼ 新着';
                } else {
                    btn.classList.remove('active-sort');
                    btn.textContent = '新着ソート';
                }
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            ui = new SidebarUI();
        });

        document.addEventListener('click', (e) => { const root = document.getElementById('nc-root'); if (root && root.contains(e.target)) return; ThreadManager.handleLinkClick(e); }, true);
    }

    const start = () => {
        if (window.self !== window.top) {
            if (location.href.includes('thread.php') || location.href.includes('/res/')) {
                initThreadIframe();
            } else {
                initCatalogIframe();
            }
        } else {
            initParentLogic();
        }
    };

    if (document.body) start();
    else new MutationObserver((m, o) => { if(document.body){ o.disconnect(); start(); } }).observe(document.documentElement, {childList: true});

})();