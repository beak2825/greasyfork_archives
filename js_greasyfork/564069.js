// ==UserScript==
// @name         小红书评论区助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动展开评论（防风控、可配置、可中断）、导出评论（JSON格式、支持过滤）
// @author       Claude Code
// @match        https://www.xiaohongshu.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564069/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/564069/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // Config Module - Settings with GM_getValue/setValue persistence
    // ============================================================
    const Config = {
        _cache: {},

        _define(name, defaultVal, key) {
            Object.defineProperty(this, name, {
                get() {
                    if (!(key in this._cache)) {
                        this._cache[key] = GM_getValue(key, defaultVal);
                    }
                    return this._cache[key];
                },
                set(val) {
                    this._cache[key] = val;
                    GM_setValue(key, val);
                }
            });
        },

        init() {
            this._define('maxExpand', 20, 'max_expand');
            this._define('delayMin', 800, 'delay_min');
            this._define('delayMax', 3000, 'delay_max');
            this._define('minLikes', 0, 'min_likes');
            this._define('buttonPos', { x: null, y: 80 }, 'button_pos');
            this._define('shortcutsEnabled', true, 'shortcuts_enabled');
        }
    };
    Config.init();

    // ============================================================
    // Selectors - Centralized CSS selectors with fallbacks
    // ============================================================
    const Selectors = {
        expandBtn: ['.show-more', '.loading.active', '[class*="show-more"]'],
        parentComment: ['.parent-comment', '.comment-item-wrap'],
        replyContainer: ['.reply-container .comment-item', '.sub-comment-list .comment-item'],
        userName: ['.name', '.user-name', '[class*="name"]'],
        content: ['.content', '.comment-content', '[class*="content"]'],
        date: ['.date', '.time', '[class*="date"]'],
        location: ['.location', '[class*="location"]'],
        likes: ['.like-wrapper .count', '.like .count', '[class*="like"] .count'],
        title: ['#detail-title', '.title', '[class*="title"]'],
        author: ['.author-wrapper .name .username', '.author .name', '[class*="author"] .name'],
        desc: ['#detail-desc', '.desc', '[class*="desc"]'],

        query(selectorList, context = document) {
            for (const sel of selectorList) {
                const el = context.querySelector(sel);
                if (el) return el;
            }
            return null;
        },

        queryAll(selectorList, context = document) {
            for (const sel of selectorList) {
                const els = context.querySelectorAll(sel);
                if (els.length > 0) return Array.from(els);
            }
            return [];
        }
    };

    // ============================================================
    // Toast - Notification system
    // ============================================================
    const Toast = {
        container: null,
        queue: [],

        init() {
            this.container = document.createElement('div');
            this.container.className = 'xhs-toast-container';
            document.body.appendChild(this.container);
        },

        show(message, type = 'info', duration = 3000) {
            const toast = document.createElement('div');
            toast.className = `xhs-toast xhs-toast-${type}`;
            toast.textContent = message;
            this.container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.classList.add('xhs-toast-visible');
            });

            setTimeout(() => {
                toast.classList.remove('xhs-toast-visible');
                setTimeout(() => toast.remove(), 200);
            }, duration);
        },

        success(msg, duration) { this.show(msg, 'success', duration); },
        error(msg, duration) { this.show(msg, 'error', duration); },
        info(msg, duration) { this.show(msg, 'info', duration); }
    };

    // ============================================================
    // Modal - Settings dialog
    // ============================================================
    const Modal = {
        overlay: null,
        isOpen: false,

        init() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'xhs-modal-overlay';
            this.overlay.innerHTML = `
                <div class="xhs-modal">
                    <div class="xhs-modal-header">
                        <h3>设置</h3>
                        <button class="xhs-modal-close" aria-label="关闭">&times;</button>
                    </div>
                    <div class="xhs-modal-body">
                        <div class="xhs-form-group">
                            <label for="xhs-max-expand">最大展开数量</label>
                            <input type="number" id="xhs-max-expand" min="1" max="500">
                            <span class="xhs-form-hint">防止风控建议不要过大</span>
                        </div>
                        <div class="xhs-form-group">
                            <label for="xhs-delay-min">最小延迟 (ms)</label>
                            <input type="number" id="xhs-delay-min" min="100" max="10000">
                        </div>
                        <div class="xhs-form-group">
                            <label for="xhs-delay-max">最大延迟 (ms)</label>
                            <input type="number" id="xhs-delay-max" min="100" max="10000">
                        </div>
                        <div class="xhs-form-group">
                            <label for="xhs-min-likes">导出最低点赞数</label>
                            <input type="number" id="xhs-min-likes" min="0">
                            <span class="xhs-form-hint">0 表示导出所有评论</span>
                        </div>
                        <div class="xhs-form-group xhs-form-checkbox">
                            <label>
                                <input type="checkbox" id="xhs-shortcuts-enabled">
                                <span>启用键盘快捷键</span>
                            </label>
                            <span class="xhs-form-hint">Alt+E 展开, Alt+X 导出, Alt+S 设置</span>
                        </div>
                    </div>
                    <div class="xhs-modal-footer">
                        <button class="xhs-btn xhs-btn-secondary" data-action="cancel">取消</button>
                        <button class="xhs-btn xhs-btn-primary" data-action="save">保存</button>
                    </div>
                </div>
            `;
            document.body.appendChild(this.overlay);

            // Event listeners
            this.overlay.querySelector('.xhs-modal-close').addEventListener('click', () => this.close());
            this.overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => this.close());
            this.overlay.querySelector('[data-action="save"]').addEventListener('click', () => this.save());
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });
        },

        open() {
            // Populate with current values
            this.overlay.querySelector('#xhs-max-expand').value = Config.maxExpand;
            this.overlay.querySelector('#xhs-delay-min').value = Config.delayMin;
            this.overlay.querySelector('#xhs-delay-max').value = Config.delayMax;
            this.overlay.querySelector('#xhs-min-likes').value = Config.minLikes;
            this.overlay.querySelector('#xhs-shortcuts-enabled').checked = Config.shortcutsEnabled;

            this.overlay.classList.add('xhs-modal-visible');
            this.isOpen = true;
        },

        close() {
            this.overlay.classList.remove('xhs-modal-visible');
            this.isOpen = false;
        },

        save() {
            const maxExpand = parseInt(this.overlay.querySelector('#xhs-max-expand').value, 10);
            const delayMin = parseInt(this.overlay.querySelector('#xhs-delay-min').value, 10);
            const delayMax = parseInt(this.overlay.querySelector('#xhs-delay-max').value, 10);
            const minLikes = parseInt(this.overlay.querySelector('#xhs-min-likes').value, 10);
            const shortcutsEnabled = this.overlay.querySelector('#xhs-shortcuts-enabled').checked;

            // Validation
            if (isNaN(maxExpand) || maxExpand < 1) {
                Toast.error('最大展开数量必须大于 0');
                return;
            }
            if (isNaN(delayMin) || isNaN(delayMax) || delayMin < 100 || delayMax < delayMin) {
                Toast.error('延迟设置无效');
                return;
            }

            Config.maxExpand = maxExpand;
            Config.delayMin = delayMin;
            Config.delayMax = delayMax;
            Config.minLikes = isNaN(minLikes) ? 0 : minLikes;
            Config.shortcutsEnabled = shortcutsEnabled;

            Toast.success('设置已保存');
            this.close();
        }
    };

    // ============================================================
    // Router - SPA navigation via MutationObserver
    // ============================================================
    const Router = {
        lastUrl: '',
        callbacks: [],

        init() {
            this.lastUrl = location.href;

            // MutationObserver for SPA navigation detection
            const observer = new MutationObserver(() => {
                if (location.href !== this.lastUrl) {
                    this.lastUrl = location.href;
                    this.notify();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            // History API interception as backup
            const originalPushState = history.pushState;
            history.pushState = (...args) => {
                originalPushState.apply(history, args);
                this.checkUrl();
            };

            const originalReplaceState = history.replaceState;
            history.replaceState = (...args) => {
                originalReplaceState.apply(history, args);
                this.checkUrl();
            };

            window.addEventListener('popstate', () => this.checkUrl());

            // Initial check
            this.checkUrl();
        },

        checkUrl() {
            if (location.href !== this.lastUrl) {
                this.lastUrl = location.href;
                this.notify();
            } else {
                this.notify();
            }
        },

        notify() {
            this.callbacks.forEach(cb => cb(location.pathname));
        },

        onChange(callback) {
            this.callbacks.push(callback);
            callback(location.pathname); // Initial call
        },

        isDetailPage() {
            return /^\/explore\/[^/]+/.test(location.pathname);
        }
    };

    // ============================================================
    // Expander - Comment expansion with AbortController
    // ============================================================
    const Expander = {
        abortController: null,
        isRunning: false,

        async start(onProgress, onComplete) {
            if (this.isRunning) return;

            this.abortController = new AbortController();
            this.isRunning = true;

            const limit = Config.maxExpand;
            let clickCount = 0;

            try {
                while (clickCount < limit) {
                    if (this.abortController.signal.aborted) {
                        throw new DOMException('Aborted', 'AbortError');
                    }

                    const expandBtns = Selectors.queryAll(Selectors.expandBtn);
                    const actionableButtons = expandBtns.filter(btn =>
                        btn.offsetParent !== null && !btn.classList.contains('xhs-helper-clicked')
                    );

                    if (actionableButtons.length === 0) {
                        break;
                    }

                    const btn = actionableButtons[0];
                    btn.click();
                    btn.classList.add('xhs-helper-clicked');
                    clickCount++;

                    onProgress(clickCount, limit);

                    await this.randomSleep(Config.delayMin, Config.delayMax);
                }

                onComplete(clickCount >= limit ? 'limit' : 'done', clickCount);
            } catch (error) {
                if (error.name === 'AbortError') {
                    onComplete('aborted', clickCount);
                } else {
                    console.error('[XHS Helper] Error:', error);
                    onComplete('error', clickCount);
                }
            } finally {
                this.isRunning = false;
                this.abortController = null;
            }
        },

        stop() {
            if (this.abortController) {
                this.abortController.abort();
            }
        },

        randomSleep(min, max) {
            const signal = this.abortController?.signal;
            return new Promise((resolve, reject) => {
                const delay = Math.floor(Math.random() * (max - min + 1)) + min;
                const timeout = setTimeout(resolve, delay);

                if (signal) {
                    signal.addEventListener('abort', () => {
                        clearTimeout(timeout);
                        reject(new DOMException('Aborted', 'AbortError'));
                    }, { once: true });
                }
            });
        }
    };

    // ============================================================
    // Exporter - Extraction with filtering
    // ============================================================
    const Exporter = {
        export(minLikes = Config.minLikes) {
            const meta = {
                url: window.location.href,
                title: Selectors.query(Selectors.title)?.textContent.trim() || '未命名标题',
                author: Selectors.query(Selectors.author)?.textContent.trim() || '未知作者',
                desc: Selectors.query(Selectors.desc)?.textContent.trim() || '',
                exportDate: new Date().toISOString(),
                filter: { minLikes }
            };

            const commentList = [];
            const parentComments = Selectors.queryAll(Selectors.parentComment);

            let totalCount = 0;
            let filteredCount = 0;

            parentComments.forEach((el, index) => {
                const main = this.extractCommentInfo(el);
                totalCount++;

                const mainLikes = this.parseLikes(main.likes);
                if (mainLikes < minLikes) {
                    filteredCount++;
                    return;
                }

                const commentObj = {
                    floor: index + 1,
                    user: main.userName,
                    likes: main.likes,
                    likesNum: mainLikes,
                    time: main.time,
                    location: main.location,
                    content: main.content,
                    replies: []
                };

                const replies = Selectors.queryAll(Selectors.replyContainer, el);
                replies.forEach(replyEl => {
                    const rep = this.extractCommentInfo(replyEl);
                    const repLikes = this.parseLikes(rep.likes);

                    if (repLikes >= minLikes) {
                        commentObj.replies.push({
                            user: rep.userName,
                            likes: rep.likes,
                            likesNum: repLikes,
                            content: rep.content,
                            time: rep.time,
                            location: rep.location
                        });
                    }
                });

                commentList.push(commentObj);
            });

            const exportData = {
                meta,
                stats: {
                    totalComments: totalCount,
                    exportedComments: commentList.length,
                    filteredOut: filteredCount
                },
                comments: commentList
            };

            return exportData;
        },

        extractCommentInfo(element) {
            const userEl = Selectors.query(Selectors.userName, element);
            const contentEl = Selectors.query(Selectors.content, element);
            const dateEl = Selectors.query(Selectors.date, element);
            const locEl = Selectors.query(Selectors.location, element);
            const likeEl = Selectors.query(Selectors.likes, element);

            return {
                userName: userEl?.textContent.trim().replace(/回复.*$/, '').trim() || '未知',
                content: contentEl?.textContent.trim() || '',
                time: dateEl?.textContent.trim() || '',
                location: locEl?.textContent.trim() || '',
                likes: likeEl?.textContent.trim() || '0'
            };
        },

        parseLikes(likesStr) {
            if (!likesStr || likesStr === '') return 0;
            const str = likesStr.toString().trim();
            if (str.includes('万')) {
                return parseFloat(str) * 10000;
            }
            return parseInt(str, 10) || 0;
        },

        download(data, filename) {
            const safeName = filename.replace(/[\\/:*?"<>|]/g, '_').substring(0, 100);
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = safeName;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        }
    };

    // ============================================================
    // UI - Draggable button container
    // ============================================================
    const UI = {
        container: null,
        expandBtn: null,
        exportBtn: null,
        settingsBtn: null,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },

        init() {
            this.container = document.createElement('div');
            this.container.className = 'xhs-helper-btn-container';
            this.container.style.display = 'none';

            // Drag handle
            const dragHandle = document.createElement('div');
            dragHandle.className = 'xhs-drag-handle';
            dragHandle.innerHTML = '&#x2630;';
            dragHandle.setAttribute('aria-label', '拖动移动位置');
            this.container.appendChild(dragHandle);

            // Expand button
            this.expandBtn = document.createElement('button');
            this.expandBtn.className = 'xhs-helper-btn';
            this.expandBtn.innerHTML = '<span class="xhs-btn-icon">&#x25B6;</span> 自动展开';
            this.expandBtn.setAttribute('aria-label', '自动展开评论 (Alt+E)');
            this.expandBtn.setAttribute('data-tooltip', `展开前 ${Config.maxExpand} 条`);
            this.container.appendChild(this.expandBtn);

            // Export button
            this.exportBtn = document.createElement('button');
            this.exportBtn.className = 'xhs-helper-btn';
            this.exportBtn.innerHTML = '<span class="xhs-btn-icon">&#x21E9;</span> 导出评论';
            this.exportBtn.setAttribute('aria-label', '导出评论为JSON (Alt+X)');
            this.exportBtn.setAttribute('data-tooltip', '导出JSON格式');
            this.container.appendChild(this.exportBtn);

            // Settings button
            this.settingsBtn = document.createElement('button');
            this.settingsBtn.className = 'xhs-helper-btn xhs-helper-btn-settings';
            this.settingsBtn.innerHTML = '&#x2699;';
            this.settingsBtn.setAttribute('aria-label', '打开设置 (Alt+S)');
            this.settingsBtn.setAttribute('data-tooltip', '设置');
            this.container.appendChild(this.settingsBtn);

            document.body.appendChild(this.container);

            // Restore position
            this.restorePosition();

            // Drag handlers
            this.initDrag(dragHandle);

            // Button handlers
            this.expandBtn.addEventListener('click', () => this.handleExpand());
            this.exportBtn.addEventListener('click', () => this.handleExport());
            this.settingsBtn.addEventListener('click', () => Modal.open());
        },

        initDrag(handle) {
            handle.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                const rect = this.container.getBoundingClientRect();
                this.dragOffset.x = e.clientX - rect.left;
                this.dragOffset.y = e.clientY - rect.top;
                this.container.classList.add('xhs-dragging');
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;

                let x = e.clientX - this.dragOffset.x;
                let y = e.clientY - this.dragOffset.y;

                // Keep within viewport
                const rect = this.container.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                x = Math.max(0, Math.min(x, maxX));
                y = Math.max(0, Math.min(y, maxY));

                this.container.style.left = x + 'px';
                this.container.style.top = y + 'px';
                this.container.style.right = 'auto';
                this.container.style.bottom = 'auto';
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.container.classList.remove('xhs-dragging');
                    this.savePosition();
                }
            });
        },

        savePosition() {
            const rect = this.container.getBoundingClientRect();
            Config.buttonPos = { x: rect.left, y: rect.top };
        },

        restorePosition() {
            const pos = Config.buttonPos;
            if (pos.x !== null) {
                this.container.style.left = pos.x + 'px';
                this.container.style.top = pos.y + 'px';
                this.container.style.right = 'auto';
                this.container.style.bottom = 'auto';
            }
        },

        show() {
            this.container.style.display = 'flex';
        },

        hide() {
            this.container.style.display = 'none';
        },

        handleExpand() {
            if (Expander.isRunning) {
                Expander.stop();
                return;
            }

            this.expandBtn.innerHTML = '<span class="xhs-btn-icon">&#x25A0;</span> 停止';
            this.expandBtn.classList.add('xhs-btn-active');

            Expander.start(
                (current, total) => {
                    this.expandBtn.innerHTML = `<span class="xhs-btn-icon">&#x25A0;</span> ${current}/${total}`;
                },
                (status, count) => {
                    this.expandBtn.classList.remove('xhs-btn-active');

                    const messages = {
                        'limit': `已达上限 (${count})`,
                        'done': `展开完毕 (${count})`,
                        'aborted': `已停止 (${count})`,
                        'error': '发生错误'
                    };

                    Toast.info(messages[status] || '完成');
                    this.expandBtn.innerHTML = messages[status] || '完成';

                    setTimeout(() => {
                        this.expandBtn.innerHTML = '<span class="xhs-btn-icon">&#x25B6;</span> 自动展开';
                    }, 2000);
                }
            );
        },

        handleExport() {
            this.exportBtn.disabled = true;
            this.exportBtn.innerHTML = '<span class="xhs-btn-icon">&#x21BB;</span> 处理中...';

            try {
                const data = Exporter.export();
                const filename = `${data.meta.title}_评论导出.json`;
                Exporter.download(data, filename);

                Toast.success(`导出成功: ${data.stats.exportedComments} 条评论`);
                this.exportBtn.innerHTML = '<span class="xhs-btn-icon">&#x2714;</span> 导出完成';
            } catch (e) {
                console.error('[XHS Helper] Export error:', e);
                Toast.error('导出失败');
                this.exportBtn.innerHTML = '<span class="xhs-btn-icon">&#x2718;</span> 导出失败';
            }

            setTimeout(() => {
                this.exportBtn.disabled = false;
                this.exportBtn.innerHTML = '<span class="xhs-btn-icon">&#x21E9;</span> 导出评论';
            }, 2000);
        }
    };

    // ============================================================
    // Shortcuts - Keyboard bindings
    // ============================================================
    const Shortcuts = {
        init() {
            document.addEventListener('keydown', (e) => {
                if (!Config.shortcutsEnabled) return;
                if (!Router.isDetailPage()) return;

                // Ignore when typing in inputs
                const tag = e.target.tagName.toLowerCase();
                if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
                    return;
                }

                // ESC - close modal or abort expansion
                if (e.key === 'Escape') {
                    if (Modal.isOpen) {
                        Modal.close();
                    } else if (Expander.isRunning) {
                        Expander.stop();
                    }
                    return;
                }

                if (!e.altKey) return;

                switch (e.key.toLowerCase()) {
                    case 'e':
                        e.preventDefault();
                        UI.handleExpand();
                        break;
                    case 'x':
                        e.preventDefault();
                        UI.handleExport();
                        break;
                    case 's':
                        e.preventDefault();
                        Modal.open();
                        break;
                }
            });
        }
    };

    // ============================================================
    // Styles
    // ============================================================
    GM_addStyle(`
        :root {
            --xhs-primary: #ff2442;
            --xhs-primary-hover: #e61e3c;
            --xhs-bg: rgba(255, 255, 255, 0.98);
            --xhs-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            --xhs-radius: 12px;
        }

        /* Toast Container */
        .xhs-toast-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100000;
            display: flex;
            flex-direction: column;
            gap: 8px;
            pointer-events: none;
        }

        .xhs-toast {
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: var(--xhs-shadow);
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.2s ease;
            pointer-events: auto;
        }

        .xhs-toast-visible {
            opacity: 1;
            transform: translateY(0);
        }

        .xhs-toast-success {
            background: #10b981;
            color: white;
        }

        .xhs-toast-error {
            background: #ef4444;
            color: white;
        }

        .xhs-toast-info {
            background: #3b82f6;
            color: white;
        }

        /* Modal Overlay */
        .xhs-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
        }

        .xhs-modal-overlay.xhs-modal-visible {
            opacity: 1;
            visibility: visible;
        }

        .xhs-modal {
            background: var(--xhs-bg);
            border-radius: var(--xhs-radius);
            box-shadow: var(--xhs-shadow);
            width: 400px;
            max-width: 90vw;
            transform: scale(0.95);
            transition: transform 0.2s ease;
        }

        .xhs-modal-visible .xhs-modal {
            transform: scale(1);
        }

        .xhs-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid #eee;
        }

        .xhs-modal-header h3 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }

        .xhs-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            padding: 0;
            line-height: 1;
        }

        .xhs-modal-close:hover {
            color: #333;
        }

        .xhs-modal-body {
            padding: 20px;
        }

        .xhs-form-group {
            margin-bottom: 16px;
        }

        .xhs-form-group label {
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 500;
            color: #333;
        }

        .xhs-form-group input[type="number"] {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s ease;
        }

        .xhs-form-group input[type="number"]:focus {
            outline: none;
            border-color: var(--xhs-primary);
        }

        .xhs-form-hint {
            display: block;
            margin-top: 4px;
            font-size: 12px;
            color: #999;
        }

        .xhs-form-checkbox label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }

        .xhs-form-checkbox input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--xhs-primary);
        }

        .xhs-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 16px 20px;
            border-top: 1px solid #eee;
        }

        .xhs-btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }

        .xhs-btn-primary {
            background: var(--xhs-primary);
            color: white;
        }

        .xhs-btn-primary:hover {
            background: var(--xhs-primary-hover);
        }

        .xhs-btn-secondary {
            background: #f5f5f5;
            color: #666;
        }

        .xhs-btn-secondary:hover {
            background: #eee;
        }

        /* Button Container */
        .xhs-helper-btn-container {
            position: fixed;
            right: 20px;
            bottom: 80px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: flex-end;
            user-select: none;
        }

        .xhs-helper-btn-container.xhs-dragging {
            opacity: 0.8;
        }

        .xhs-drag-handle {
            width: 100%;
            text-align: center;
            padding: 4px 0;
            cursor: move;
            color: #999;
            font-size: 14px;
            border-radius: 8px 8px 0 0;
            background: rgba(0, 0, 0, 0.05);
            margin-bottom: -4px;
        }

        .xhs-drag-handle:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        .xhs-helper-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 10px 18px;
            background: var(--xhs-primary);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            box-shadow: var(--xhs-shadow);
            transition: all 0.2s ease;
            min-width: 110px;
            position: relative;
        }

        .xhs-helper-btn:hover {
            background: var(--xhs-primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 36, 66, 0.3);
        }

        .xhs-helper-btn:disabled {
            background: #ccc;
            color: #999;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .xhs-helper-btn:active:not(:disabled) {
            transform: scale(0.98);
        }

        .xhs-helper-btn.xhs-btn-active {
            background: #e61e3c;
            animation: xhs-pulse 1s infinite;
        }

        .xhs-helper-btn-settings {
            min-width: auto;
            padding: 10px 12px;
            font-size: 16px;
        }

        .xhs-btn-icon {
            font-size: 12px;
        }

        /* Tooltip */
        .xhs-helper-btn::after {
            content: attr(data-tooltip);
            position: absolute;
            right: 110%;
            top: 50%;
            transform: translateY(-50%) translateX(10px);
            background: rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: normal;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
            transition: all 0.2s ease;
        }

        .xhs-helper-btn:hover::after {
            opacity: 1;
            visibility: visible;
            transform: translateY(-50%) translateX(0);
        }

        @keyframes xhs-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255, 36, 66, 0.4); }
            50% { box-shadow: 0 0 0 8px rgba(255, 36, 66, 0); }
        }

        /* Focus visible for accessibility */
        .xhs-helper-btn:focus-visible,
        .xhs-btn:focus-visible,
        .xhs-modal-close:focus-visible {
            outline: 2px solid var(--xhs-primary);
            outline-offset: 2px;
        }
    `);

    // ============================================================
    // Initialize
    // ============================================================
    Toast.init();
    Modal.init();
    UI.init();
    Shortcuts.init();
    Router.init();

    Router.onChange((pathname) => {
        if (Router.isDetailPage()) {
            UI.show();
        } else {
            UI.hide();
        }
    });

    console.log('[XHS Helper] Initialized v1.0.0');

})();
