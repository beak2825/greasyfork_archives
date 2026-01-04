// ==UserScript==
// @name NodeSeek编辑器增强（兼容DeepFlood）重构版
// @namespace http://tampermonkey.net/
// @version 1.1
// @description 在 NodeSeek 支持点击、拖拽和粘贴上传图片，并插入 Markdown 格式到编辑器。
// @author NRN
// @match https://www.nodeseek.com/*
// @match https://www.deepflood.com/*
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_deleteValue
// @connect *
// @connect *.nodeimage.com
// @connect nodeseek.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556733/NodeSeek%E7%BC%96%E8%BE%91%E5%99%A8%E5%A2%9E%E5%BC%BA%EF%BC%88%E5%85%BC%E5%AE%B9DeepFlood%EF%BC%89%E9%87%8D%E6%9E%84%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556733/NodeSeek%E7%BC%96%E8%BE%91%E5%99%A8%E5%A2%9E%E5%BC%BA%EF%BC%88%E5%85%BC%E5%AE%B9DeepFlood%EF%BC%89%E9%87%8D%E6%9E%84%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== Emoji Picker 集成 =====
    const EMOJI_PREFIX = 'emoji-';
    const EMOJI_CONFIG = {
        EMOJI_PICKER_URL: 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js',
        PICKER_WIDTH: 380,
        PICKER_HEIGHT: 420,
        ANIMATION_DELAY: 10,
        CHECK_INTERVAL: 100
    };

    function emoji_createElement(tag, attributes = {}, styles = {}) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => element[key] = value);
        Object.entries(styles).forEach(([key, value]) => element.style[key] = value);
        return element;
    }

    function emoji_calculatePosition(targetElement, popupWidth, popupHeight) {
        const rect = targetElement.getBoundingClientRect();
        let left = window.scrollX + rect.left;
        let top = window.scrollY + rect.bottom + 6;
        if (left + popupWidth > window.innerWidth) {
            left = window.innerWidth - (popupWidth + 20);
        }
        if (top + popupHeight > window.innerHeight + window.scrollY) {
            top = window.innerHeight + window.scrollY - (popupHeight + 10);
        }
        return { top, left };
    }

    class EmojiPicker {
        constructor() {
            this.picker = null;
            this.initStyles();
        }
        static async injectScript() {
            if (window.customElements.get('emoji-picker')) return;
            const script = emoji_createElement('script', {
                type: 'module',
                src: EMOJI_CONFIG.EMOJI_PICKER_URL
            });
            document.head.appendChild(script);
            return new Promise(resolve => {
                const checkLoaded = setInterval(() => {
                    if (window.customElements.get('emoji-picker')) {
                        clearInterval(checkLoaded);
                        resolve();
                    }
                }, EMOJI_CONFIG.CHECK_INTERVAL);
            });
        }
        initStyles() {
            const styles = `
                .${EMOJI_PREFIX}picker-popup {
                    animation: ${EMOJI_PREFIX}fadein 0.18s;
                    z-index: 10001 !important;
                }
                @keyframes ${EMOJI_PREFIX}fadein {
                    0% { opacity:0; transform: translateY(18px); }
                    100% { opacity:1; transform: translateY(0); }
                }
                .${EMOJI_PREFIX}btn:hover {
                    background: #f2f2f2;
                    border-radius: 4px;
                }
                @media (prefers-color-scheme: dark) {
                    .${EMOJI_PREFIX}picker-popup {
                        --emoji-bg: #232323;
                        color: #eee;
                        border-color: #444;
                    }
                    .${EMOJI_PREFIX}btn:hover {
                        background: #333;
                    }
                }
            `;
            if (!document.getElementById(EMOJI_PREFIX + 'style')) {
                const styleElement = emoji_createElement('style', { id: EMOJI_PREFIX + 'style', innerHTML: styles });
                document.head.appendChild(styleElement);
            }
        }
        createButton() {
            return emoji_createElement('span', {
                title: 'Emoji',
                innerHTML: '😊',
                className: `toolbar-item ${EMOJI_PREFIX}btn`,
                onclick: (e) => this.toggle(e)
            }, {
                cursor: 'pointer',
                fontSize: '18px',
                marginLeft: '8px'
            });
        }
        async createPicker(event) {
            const { top, left } = emoji_calculatePosition(
                event.target,
                EMOJI_CONFIG.PICKER_WIDTH,
                EMOJI_CONFIG.PICKER_HEIGHT
            );
            this.picker = emoji_createElement('div', {
                className: `${EMOJI_PREFIX}picker-popup`
            }, {
                position: 'absolute',
                background: 'var(--emoji-bg,#fff)',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                padding: '0',
                zIndex: '10001',
                width: `${EMOJI_CONFIG.PICKER_WIDTH}px`,
                height: `${EMOJI_CONFIG.PICKER_HEIGHT}px`,
                display: 'flex',
                flexDirection: 'column',
                top: `${top}px`,
                left: `${left}px`
            });
            this.picker.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            await EmojiPicker.injectScript();
            const pickerElement = emoji_createElement('emoji-picker', {
                style: 'width: 100%; height: 100%;'
            });
            pickerElement.addEventListener('emoji-click', (e) => {
                this.handleEmojiSelect(e, event.target);
            });
            this.picker.appendChild(pickerElement);
            document.body.appendChild(this.picker);
            setTimeout(() => {
                const handleOutsideClick = (e) => {
                    if (this.picker && !this.picker.contains(e.target) && e.target !== event.target) {
                        this.close();
                        document.removeEventListener('click', handleOutsideClick);
                    }
                };
                document.addEventListener('click', handleOutsideClick);
            }, EMOJI_CONFIG.ANIMATION_DELAY);
        }
        toggle(event) {
            if (this.picker) {
                this.close();
            } else {
                this.createPicker(event);
                event.stopPropagation();
            }
        }
        close() {
            if (this.picker) {
                this.picker.remove();
                this.picker = null;
            }
        }
        handleEmojiSelect(event, targetButton) {
            const emoji = event.detail.unicode;
            this.insertEmoji(emoji, targetButton);
            this.close();
        }
        insertEmoji(emoji, targetButton) {
            const editor = this.findNearestEditor(targetButton);
            if (!editor) {
                alert('未找到CodeMirror编辑器');
                return;
            }
            editor.focus();
            const doc = editor.getDoc();
            const cursor = doc.getCursor();
            doc.replaceRange(emoji, cursor);
            setTimeout(() => editor.focus(), 0);
        }
        findNearestEditor(targetButton) {
            const editors = document.querySelectorAll('.CodeMirror');
            if (editors.length === 0) return null;
            if (editors.length === 1) return editors[0].CodeMirror;
            return Array.from(editors).reduce((nearest, current) => {
                const currentRect = current.getBoundingClientRect();
                const targetRect = targetButton.getBoundingClientRect();
                const distance = Math.hypot(
                    currentRect.top - targetRect.top,
                    currentRect.left - targetRect.left
                );
                if (!nearest || distance < nearest.distance) {
                    return { editor: current.CodeMirror, distance };
                }
                return nearest;
            }, null).editor;
        }
    }

    function emoji_init() {
        const emojiPicker = new EmojiPicker();
        const observer = new MutationObserver(() => {
            document.querySelectorAll('.mde-toolbar').forEach(toolbar => {
                if (!toolbar.querySelector(`.${EMOJI_PREFIX}btn`)) {
                    toolbar.appendChild(emojiPicker.createButton());
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        document.querySelectorAll('.mde-toolbar').forEach(toolbar => {
            if (!toolbar.querySelector(`.${EMOJI_PREFIX}btn`)) {
                toolbar.appendChild(emojiPicker.createButton());
            }
        });
    }
    emoji_init();

    // 快捷键触发“发布评论/帖子”按钮功能
    function triggerSubmitOnCtrlEnter(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            // 查找所有 class="submit btn focus-visible" 且文本为“发布评论”或“发布帖子”的按钮
            const submitButtons = Array.from(document.querySelectorAll('button.submit.btn.focus-visible'));
            for (const btn of submitButtons) {
                const text = btn.textContent.trim();
                if (text === '发布评论' || text === '发布帖子') {
                    if (!btn.disabled && btn.offsetParent !== null) {
                        btn.click();
                        return;
                    }
                }
            }
            // 查找所有 class="btn" 且文本为“发送”的按钮
            const sendButtons = Array.from(document.querySelectorAll('button.btn'));
            for (const btn of sendButtons) {
                const text = btn.textContent.trim();
                if (text === '发送') {
                    if (!btn.disabled && btn.offsetParent !== null) {
                        btn.click();
                        return;
                    }
                }
            }
        }
    }
    document.addEventListener('keydown', triggerSubmitOnCtrlEnter, true);

    // 默认图床相关常量
    const SIXTEEN_API_TOKEN_KEY = 'sixteenToken';
    const IMAGE_HOST_KEY = 'imageHost';

    // NodeImage 相关配置
    const NODEIMAGE = {
        API_KEY_KEY: 'nodeimage_apiKey',
        UPLOAD_URL: 'https://api.nodeimage.com/api/upload',
        API_KEY_FETCH_URL: 'https://api.nodeimage.com/api/user/api-key',
        SITE_URL: 'https://www.nodeimage.com',
        STORAGE_KEYS: {
            LOGIN_STATUS: 'nodeimage_login_status',
            LOGOUT: 'nodeimage_logout',
            LOGIN_CHECK: 'nodeimage_login_check'
        },
        RECENT_LOGIN_GRACE_PERIOD: 30000, // 30秒内检查近期登录
        LOGIN_CHECK_INTERVAL: 3000, // 轮询登录状态的间隔
        LOGIN_CHECK_TIMEOUT: 300000, // 轮询登录状态的总超时
        LOGIN_SUCCESS_CLOSE_DELAY: 1000 // 登录成功后关闭窗口的延迟
    };

    let nodeImageApiKey = GM_getValue(NODEIMAGE.API_KEY_KEY, '');

    // 只在首次未设置时设为 NodeImage 图床
    (function initDefaultImageHost() {
        if (!GM_getValue(IMAGE_HOST_KEY)) {
            GM_setValue(IMAGE_HOST_KEY, 'nodeimage');
        }
    })();

    // Cloudflare ImgBed 新增常量
    const CFBED_API_TOKEN_KEY = 'cloudflareImgbedAuthToken';
    const CFBED_AUTH_TYPE_KEY = 'cloudflareImgbedAuthType'; // 'query' (for authCode) or 'header' (for Authorization)


    GM_addStyle(`
        #image-host-select {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        #image-host-select:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        #image-host-select:focus {
            border-color: #4CAF50;
            outline: none;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
        }
        .nodeimage-api-key-display {
            background-color: #e9e9e9;
            padding: 8px;
            border-radius: 6px;
            font-family: monospace;
            word-break: break-all;
            margin-bottom: 10px;
            font-size: 13px;
            color: #555;
            border: 1px solid #dcdcdc;
        }
        .nodeimage-login-button {
            background: linear-gradient(90deg, #2196F3, #1976D2);
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.3s, transform 0.1s;
            text-align: center;
            display: block;
            width: fit-content;
            margin-top: 10px;
        }
        .nodeimage-login-button:hover {
            background: linear-gradient(90deg, #1976D2, #2196F3);
            transform: translateY(-1px);
        }
        .nodeimage-login-button:active {
            transform: translateY(0);
        }
    `);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    const editorWrapper = document.querySelector('#cm-editor-wrapper');
    const codeMirror = document.querySelector('.CodeMirror.cm-s-default.cm-s-nsk.CodeMirror-wrap.CodeMirror-overlayscroll');
    const cmInstance = document.querySelector('.CodeMirror')?.CodeMirror;

    function addUploadHint(container) {
        if (!container) return;
        const existingHint = container.querySelector('.upload-hint-text');
        if (existingHint) return;
        const hint = document.createElement('div');
        hint.className = 'upload-hint-text';
        hint.textContent = '支持拖拽或粘贴上传图片';
        hint.style.position = 'absolute';
        hint.style.bottom = '5px';
        hint.style.right = '5px';
        hint.style.color = '#888';
        hint.style.fontSize = '12px';
        hint.style.zIndex = '10';
        hint.style.pointerEvents = 'none';
        container.style.position = 'relative';
        container.appendChild(hint);
    }

    if (editorWrapper) {
        addUploadHint(editorWrapper);
    } else if (codeMirror) {
        addUploadHint(codeMirror);
    }

    function showUploadHint(container, fileCount) {
        if (!container) return;
        const existingHints = document.querySelectorAll('[id^="upload-hint-"]');
        existingHints.forEach(hint => hint.remove());
        const uploadHint = document.createElement('div');
        uploadHint.textContent = `正在上传 ${fileCount} 张图片，请稍等`;
        uploadHint.style.position = 'absolute';
        uploadHint.style.top = '50%';
        uploadHint.style.left = '50%';
        uploadHint.style.transform = 'translate(-50%, -50%)';
        uploadHint.style.color = '#666';
        uploadHint.style.fontSize = '14px';
        uploadHint.style.background = 'rgba(0, 0, 0, 0.1)';
        uploadHint.style.padding = '5px 10px';
        uploadHint.style.borderRadius = '3px';
        uploadHint.style.zIndex = '20';
        uploadHint.style.maxWidth = '80%';
        uploadHint.style.whiteSpace = 'nowrap';
        uploadHint.style.overflow = 'hidden';
        uploadHint.style.textOverflow = 'ellipsis';
        uploadHint.id = 'upload-hint-' + (container === editorWrapper ? 'wrapper' : 'codemirror');
        container.appendChild(uploadHint);
    }

    function removeUploadHint(container) {
        const uploadHint = document.getElementById('upload-hint-' + (container === editorWrapper ? 'wrapper' : 'codemirror'));
        if (uploadHint) uploadHint.remove();
    }

    function addSettingsIcon() {
        const uploadIcon = document.querySelector('span.toolbar-item.i-icon.i-icon-pic');
        if (!uploadIcon) return;
        const existingSettingsIcon = uploadIcon.parentNode.querySelector('.settings-icon');
        if (existingSettingsIcon) return;

        const settingsIcon = document.createElement('span');
        settingsIcon.className = 'toolbar-item i-icon settings-icon';
        settingsIcon.style.cursor = 'pointer';
        settingsIcon.style.marginLeft = '5px';
        settingsIcon.style.display = 'inline-block';
        settingsIcon.style.verticalAlign = 'middle';
        settingsIcon.style.width = '16px';
        settingsIcon.style.height = '16px';
        settingsIcon.title = '选择图床';
        settingsIcon.innerHTML = `
            <svg style="width: 100%; height: 100%; fill: currentColor;">
                <use data-v-0f04b1f4="" href="#setting-two"></use>
            </svg>
        `;
        uploadIcon.parentNode.insertBefore(settingsIcon, uploadIcon.nextSibling);

        const deleteIcon = document.createElement('span');
        deleteIcon.className = 'toolbar-item i-icon delete-icon';
        deleteIcon.style.cursor = 'pointer';
        deleteIcon.style.marginLeft = '5px';
        deleteIcon.style.display = 'none'; // 默认隐藏
        deleteIcon.style.verticalAlign = 'middle';
        deleteIcon.style.width = '16px';
        deleteIcon.style.height = '16px';
        deleteIcon.title = '删除官方图床图片';
        deleteIcon.innerHTML = `
            <svg style="width: 100%; height: 100%; fill: currentColor;" viewBox="0 0 48 48">
                <path d="M18 12h12v-4h-12v4zm20 0v-4h-18v4h-6v28c0 2.2 1.8 4 4 4h20c2.2 0 4-1.8 4-4v-28h-6zm-32-4v4h-4v4h4v24c0 4.418 3.582 8 8 8h20c4.418 0 8-3.582 8-8v-24h-4v-4h-4v-4h-8v-4h-8v4h-8zm16 8h-4v16h4v-16zm8 0h-4v16h4v-16z"/>
            </svg>
        `; // 简单的垃圾桶 SVG 图标
        uploadIcon.parentNode.insertBefore(deleteIcon, settingsIcon.nextSibling); // 放在设置图标后面

        settingsIcon.addEventListener('click', () => {
            showSettingsModal();
        });

        // 添加删除图标的点击事件
        deleteIcon.addEventListener('click', () => {
            showDeleteImageModal();
        });

        // 初始化时根据当前选择的图床来决定是否显示删除图标
        const currentHost = GM_getValue('imageHost', 'nodeimage');
        if (currentHost === 'nodeimage') {
            deleteIcon.style.display = 'inline-block';
        }
    }

    function observeToolbar() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const uploadIcon = document.querySelector('span.toolbar-item.i-icon.i-icon-pic');
                    if (uploadIcon) {
                        addSettingsIcon();
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        addSettingsIcon();
    }

    observeToolbar();

    function showSettingsModal() {
        const existingModal = document.querySelector('#image-host-settings-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'image-host-settings-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = 'linear-gradient(135deg, #ffffff, #f0f4f8)';
        modal.style.padding = '25px';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        modal.style.zIndex = '1000';
        modal.style.width = '370px';
        modal.style.fontFamily = "'Segoe UI', Arial, sans-serif";
        modal.style.color = '#333';

        const currentHost = GM_getValue('imageHost', 'nodeimage');
        let currentSixteenToken = GM_getValue('sixteenToken', '');
        const currentLankongToken = GM_getValue('lankongCustomToken', '');
        const currentLankongApi = GM_getValue('lankongCustomApi', '');

        // **修复 1: 确保变量在显示前被初始化为非 undefined 的空字符串**
        const currentCloudflareImgbedApi = GM_getValue('cloudflareImgbedApi', '') || '';
        const currentCFBedToken = GM_getValue(CFBED_API_TOKEN_KEY, '') || '';
        const currentCFBedAuthType = GM_getValue(CFBED_AUTH_TYPE_KEY, 'header_bearer');
        const currentCloudflareImgbedCompress = GM_getValue('cloudflareImgbedCompress', true);

        const currentSimpleImgbedApi = GM_getValue('simpleImgbedApi', 'http://127.0.0.1/api/index.php');
        const currentSimpleImgbedToken = GM_getValue('simpleImgbedToken', '');

        // Re-fetch nodeImageApiKey to ensure it's up-to-date
        nodeImageApiKey = GM_getValue(NODEIMAGE.API_KEY_KEY, '');

        modal.innerHTML = `
            <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #2c3e50;">图床设置</h3>
            <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">选择图床：</label>
            <select id="image-host-select" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                <option value="nodeimage" ${currentHost === 'nodeimage' ? 'selected' : ''}>官方图床（推荐）</option>
                <option value="sixteen" ${currentHost === 'sixteen' ? 'selected' : ''}>16 图床</option>
                <option value="simple-imgbed" ${currentHost === 'simple-imgbed' ? 'selected' : ''}>简单图床（自建）</option>
                <option value="lankong-custom" ${currentHost === 'lankong-custom' ? 'selected' : ''}>兰空图床（自建）</option>
                <option value="cloudflare-imgbed" ${currentHost === 'cloudflare-imgbed' ? 'selected' : ''}>Cloudflare ImgBed</option>
            </select>

            <div id="nodeimage-section" style="display: ${currentHost === 'nodeimage' ? 'block' : 'none'};">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">NodeImage API Key：</label>
                <div id="nodeimage-api-key-display" class="nodeimage-api-key-display">${nodeImageApiKey || '未设置 API Key'}</div>
                <button id="nodeimage-login-button" class="nodeimage-login-button" style="display: ${nodeImageApiKey ? 'none' : 'block'};">点击登录 NodeImage 获取 API Key</button>
            </div>

            <div id="sixteen-token-section" style="display: ${currentHost === 'sixteen' ? 'block' : 'none'};">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">16 图床 Auth-Token：</label>
                <input type="text" id="sixteen-token-input" value="${currentSixteenToken}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="请手动填写">
                <div style="font-size:12px;color:#888;margin-top:2px;">如需token请访问 <a href="https://111666.best/" target="_blank">16图床官网</a></div>
            </div>

            <div id="simple-imgbed-section" style="display: ${currentHost === 'simple-imgbed' ? 'block' : 'none'};">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">简单图床 API 地址：</label>
                <input type="text" id="simple-imgbed-api-input" value="${currentSimpleImgbedApi}" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333;" placeholder="如：http://127.0.0.1/api/index.php">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">简单图床 Token：</label>
                <input type="text" id="simple-imgbed-token-input" value="${currentSimpleImgbedToken}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333;" placeholder="请输入 Token">
                <div style="font-size:12px;color:#888;margin-top:2px;">请在简单图床 设置-API设置-Token API 管理 中查找</div>
            </div>

            <div id="lankong-token-section" style="display: ${currentHost === 'lankong-custom' ? 'block' : 'none'};">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">兰空图床 API 端点：</label>
                <input type="text" id="lankong-api-input" value="${currentLankongApi}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="https://example.com/api/v1/upload">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">兰空图床 Token：</label>
                <input type="text" id="lankong-token-input" value="${currentLankongToken}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="请输入 Token">
            </div>

            <div id="cloudflare-imgbed-section" style="display: ${currentHost === 'cloudflare-imgbed' ? 'block' : 'none'};">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">Cloudflare ImgBed 域名：</label>
                <input type="text" id="cloudflare-imgbed-api-input" value="${currentCloudflareImgbedApi}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="https://img.yourdomain.link (仅域名/根路径)">

                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">认证方式：</label>
                <select id="cloudflare-imgbed-auth-type" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                    <option value="header_bearer" ${currentCFBedAuthType === 'header_bearer' ? 'selected' : ''}>Authorization: Bearer Token (推荐)</option>
                    <option value="header_plain" ${currentCFBedAuthType === 'header_plain' ? 'selected' : ''}>Authorization: Token</option>
                    <option value="query_authcode" ${currentCFBedAuthType === 'query_authcode' ? 'selected' : ''}>Query参数: authCode</option>
                </select>

                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">Cloudflare ImgBed Token/Auth Code：</label>
                <input type="text" id="cloudflare-imgbed-token-input" value="${currentCFBedToken}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="请输入 Token 或 Auth Code">

                <div style="margin-bottom: 15px; display: flex; align-items: center;">
                    <input type="checkbox" id="cloudflare-imgbed-compress-checkbox" ${currentCloudflareImgbedCompress ? 'checked' : ''} style="margin-right: 8px;">
                    <label for="cloudflare-imgbed-compress-checkbox" style="font-size: 14px; color: #34495e; cursor: pointer;">开启服务端压缩</label>
                </div>
            </div>

            <div style="text-align: right;">
                <button id="save-settings-btn" style="background: linear-gradient(90deg, #4CAF50, #45a049); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s;">保存</button>
                <button id="close-settings-btn" style="background: linear-gradient(90deg, #f44336, #e53935); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; margin-left: 10px; transition: background 0.3s;">关闭</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.4)';
        overlay.style.zIndex = '999';

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        const hostSelect = document.querySelector('#image-host-select');
        const nodeimageSection = document.querySelector('#nodeimage-section');
        const lankongTokenSection = document.querySelector('#lankong-token-section');
        const sixteenTokenSection = document.querySelector('#sixteen-token-section');
        const cloudflareImgbedSection = document.querySelector('#cloudflare-imgbed-section');
        const simpleImgbedSection = document.querySelector('#simple-imgbed-section');
        const nodeimageApiKeyDisplay = document.querySelector('#nodeimage-api-key-display');
        const nodeimageLoginButton = document.querySelector('#nodeimage-login-button');

        const updateNodeImageDisplay = () => {
            nodeImageApiKey = GM_getValue(NODEIMAGE.API_KEY_KEY, '');
            nodeimageApiKeyDisplay.textContent = nodeImageApiKey || '未设置 API Key';
            nodeimageLoginButton.style.display = nodeImageApiKey ? 'none' : 'block';
        };

        hostSelect.addEventListener('change', () => {
            const selectedHost = hostSelect.value;
            nodeimageSection.style.display = selectedHost === 'nodeimage' ? 'block' : 'none';
            lankongTokenSection.style.display = selectedHost === 'lankong-custom' ? 'block' : 'none';
            sixteenTokenSection.style.display = selectedHost === 'sixteen' ? 'block' : 'none';
            cloudflareImgbedSection.style.display = selectedHost === 'cloudflare-imgbed' ? 'block' : 'none';
            simpleImgbedSection.style.display = selectedHost === 'simple-imgbed' ? 'block' : 'none';

            // 控制删除图标的显示
            const deleteIcon = document.querySelector('.delete-icon');
            if (deleteIcon) {
                deleteIcon.style.display = selectedHost === 'nodeimage' ? 'inline-block' : 'none';
            }
        });

        nodeimageLoginButton.addEventListener('click', async () => {
            localStorage.setItem(NODEIMAGE.STORAGE_KEYS.LOGIN_STATUS, 'login_pending');
            window.open(NODEIMAGE.SITE_URL, '_blank');
            // Start polling for API key
            const pollInterval = setInterval(async () => {
                await fetchNodeImageApiKey();
                if (nodeImageApiKey) {
                    clearInterval(pollInterval);
                    updateNodeImageDisplay();
                    localStorage.removeItem(NODEIMAGE.STORAGE_KEYS.LOGIN_STATUS);
                }
            }, 1000);
            setTimeout(() => {
                clearInterval(pollInterval);
                if (!nodeImageApiKey) {
                    alert('获取 API Key 超时，请手动登录 NodeImage 官网并重试。');
                }
            }, NODEIMAGE.LOGIN_CHECK_TIMEOUT);
        });

        document.querySelector('#save-settings-btn').addEventListener('click', () => {
            const selectedHost = hostSelect.value;
            GM_setValue('imageHost', selectedHost);

            // No specific save action for nodeimage here, as API key is auto-fetched
            // but we ensure it's up-to-date in case it was fetched while modal was open
            if (selectedHost === 'nodeimage') {
                GM_setValue(NODEIMAGE.API_KEY_KEY, nodeImageApiKey);
            } else if (selectedHost === 'sixteen') {
                const sixteenTokenInput = document.querySelector('#sixteen-token-input').value;
                GM_setValue('sixteenToken', sixteenTokenInput);
            } else if (selectedHost === 'simple-imgbed') {
                const simpleImgbedApiInput = document.querySelector('#simple-imgbed-api-input').value;
                const simpleImgbedTokenInput = document.querySelector('#simple-imgbed-token-input').value;
                GM_setValue('simpleImgbedApi', simpleImgbedApiInput);
                GM_setValue('simpleImgbedToken', simpleImgbedTokenInput);
            } else if (selectedHost === 'lankong-custom') {
                const lankongTokenInput = document.querySelector('#lankong-token-input').value;
                const lankongApiInput = document.querySelector('#lankong-api-input').value;
                GM_setValue('lankongCustomToken', lankongTokenInput);
                GM_setValue('lankongCustomApi', lankongApiInput);
            } else if (selectedHost === 'cloudflare-imgbed') {
                const cloudflareImgbedApiInput = document.querySelector('#cloudflare-imgbed-api-input').value;
                const cloudflareImgbedTokenInput = document.querySelector('#cloudflare-imgbed-token-input').value;
                const cloudflareImgbedAuthType = document.querySelector('#cloudflare-imgbed-auth-type').value;
                const cloudflareImgbedCompressCheckbox = document.querySelector('#cloudflare-imgbed-compress-checkbox').checked;

                GM_setValue('cloudflareImgbedApi', cloudflareImgbedApiInput);
                GM_setValue(CFBED_API_TOKEN_KEY, cloudflareImgbedTokenInput); // 统一存储为 Token
                GM_setValue(CFBED_AUTH_TYPE_KEY, cloudflareImgbedAuthType); // 存储认证类型
                GM_setValue('cloudflareImgbedCompress', cloudflareImgbedCompressCheckbox);
            }

            modal.remove();
            overlay.remove();
        });

        document.querySelector('#close-settings-btn').addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });

        const saveBtn = document.querySelector('#save-settings-btn');
        const closeBtn = document.querySelector('#close-settings-btn');
        saveBtn.addEventListener('mouseover', () => {
            saveBtn.style.background = 'linear-gradient(90deg, #45a049, #4CAF50)';
        });
        saveBtn.addEventListener('mouseout', () => {
            saveBtn.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
        });
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.background = 'linear-gradient(90deg, #e53935, #f44336)';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.background = 'linear-gradient(90deg, #f44336, #e53935)';
        });

        // Initial display update for NodeImage section
        updateNodeImageDisplay();
    }

    // 新增：显示删除图片模态框
    function showDeleteImageModal() {
        const existingModal = document.querySelector('#delete-image-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'delete-image-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = 'linear-gradient(135deg, #ffffff, #f0f4f8)';
        modal.style.padding = '25px';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        modal.style.zIndex = '1001'; // 比设置模态框高
        modal.style.width = '350px';
        modal.style.fontFamily = "'Segoe UI', Arial, sans-serif";
        modal.style.color = '#333';

        modal.innerHTML = `
            <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #2c3e50;">删除官方图床图片</h3>
            <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">请输入图片 ID：</label>
            <input type="text" id="image-id-input" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="例如: abc123def456">
            <div style="text-align: right;">
                <button id="confirm-delete-btn" style="background: linear-gradient(90deg, #f44336, #e53935); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s;">删除</button>
                <button id="cancel-delete-btn" style="background: linear-gradient(90deg, #6c757d, #5a6268); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; margin-left: 10px; transition: background 0.3s;">取消</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.4)';
        overlay.style.zIndex = '1000';

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        document.querySelector('#confirm-delete-btn').addEventListener('click', async () => {
            const imageId = document.querySelector('#image-id-input').value.trim();
            if (imageId) {
                await deleteNodeImage(imageId);
            } else {
                alert('请输入图片 ID。');
            }
            modal.remove();
            overlay.remove();
        });

        document.querySelector('#cancel-delete-btn').addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });

        // 添加按钮 hover 效果
        const confirmBtn = document.querySelector('#confirm-delete-btn');
        const cancelBtn = document.querySelector('#cancel-delete-btn');

        confirmBtn.addEventListener('mouseover', () => { confirmBtn.style.background = 'linear-gradient(90deg, #e53935, #f44336)'; });
        confirmBtn.addEventListener('mouseout', () => { confirmBtn.style.background = 'linear-gradient(90deg, #f44336, #e53935)'; });
        cancelBtn.addEventListener('mouseover', () => { cancelBtn.style.background = 'linear-gradient(90deg, #5a6268, #6c757d)'; });
        cancelBtn.addEventListener('mouseout', () => { cancelBtn.style.background = 'linear-gradient(90deg, #6c757d, #5a6268)'; });
    }

    // 新增：删除 NodeImage 图片的函数
    async function deleteNodeImage(imageId) {
        const apiKey = GM_getValue(NODEIMAGE.API_KEY_KEY, '');
        if (!apiKey) {
            alert('未设置 NodeImage API Key，无法删除图片。');
            return;
        }

        const deleteUrl = `${NODEIMAGE.UPLOAD_URL.replace('/api/upload', `/api/images/${imageId}`)}`;

        try {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'DELETE',
                    url: deleteUrl,
                    headers: {
                        'X-API-Key': apiKey,
                        'Accept': 'application/json'
                    },
                    responseType: 'json', // 确保接收 JSON 响应
                    timeout: 10000,
                    onload: (response) => {
                        try {
                            const jsonResponse = response.response; // 直接使用解析后的对象
                            if (response.status === 200 && jsonResponse && jsonResponse.success) {
                                alert(`图片 ID: ${imageId} 删除成功！`);
                                console.log(`图片 ID: ${imageId} 删除成功:`, jsonResponse);
                                resolve();
                            } else {
                                const errorMessage = jsonResponse ? jsonResponse.message || jsonResponse.error : response.responseText || '未知错误';
                                alert(`删除图片失败: ${errorMessage} (状态码: ${response.status})`);
                                console.error(`删除图片失败，响应:`, jsonResponse || response.responseText);
                                reject(new Error(`删除失败: ${errorMessage}`));
                            }
                        } catch (error) {
                            alert(`解析删除响应失败: ${error.message}`);
                            console.error('解析删除响应错误:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => {
                        alert(`删除图片请求失败: ${error.statusText || error.message}`);
                        console.error('删除图片请求错误:', error);
                        reject(error);
                    },
                    ontimeout: () => {
                        alert('删除图片请求超时。');
                        console.error('删除图片请求超时');
                        reject(new Error('Timeout'));
                    }
                });
            });
        } catch (error) {
            console.error('执行删除操作时发生错误:', error);
        }
    }


    let isUploading = false;

    document.addEventListener('click', function(e) {
        const target = e.target.closest('span.toolbar-item.i-icon.i-icon-pic');
        if (target && !isUploading) {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        }
    }, true);

    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files.length > 0 && !isUploading) {
            isUploading = true;
            const files = Array.from(e.target.files);
            uploadMultipleFiles(files, editorWrapper || codeMirror).finally(() => {
                isUploading = false;
                fileInput.value = '';
            });
        }
    });

    if (editorWrapper) {
        editorWrapper.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isUploading) editorWrapper.style.border = '2px dashed #000';
        });
        editorWrapper.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            editorWrapper.style.border = '';
        });
        editorWrapper.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            editorWrapper.style.border = '';
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isUploading) {
                isUploading = true;
                const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                if (files.length > 0) {
                    uploadMultipleFiles(files, editorWrapper).finally(() => isUploading = false);
                } else {
                    isUploading = false;
                }
            }
        });
    }

    if (editorWrapper) {
        editorWrapper.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            const imageFiles = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) imageFiles.push(file);
                }
            }
            if (imageFiles.length > 0 && !isUploading) {
                e.preventDefault();
                isUploading = true;
                uploadMultipleFiles(imageFiles, editorWrapper).finally(() => isUploading = false);
            }
        });
    } else if (codeMirror) {
        codeMirror.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            const imageFiles = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) imageFiles.push(file);
                }
            }
            if (imageFiles.length > 0 && !isUploading) {
                e.preventDefault();
                isUploading = true;
                uploadMultipleFiles(imageFiles, codeMirror).finally(() => isUploading = false);
            }
        });
    }

    if (codeMirror) {
        codeMirror.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isUploading) codeMirror.style.border = '2px dashed #000';
        });
        codeMirror.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            codeMirror.style.border = '';
        });
        codeMirror.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            codeMirror.style.border = '';
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isUploading) {
                isUploading = true;
                const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                if (files.length > 0) {
                    uploadMultipleFiles(files, codeMirror).finally(() => isUploading = false);
                } else {
                    isUploading = false;
                }
            }
        });
    }

    async function uploadMultipleFiles(files, container) {
        if (files.length === 0) return;
        showUploadHint(container, files.length);
        const selectedHost = GM_getValue('imageHost', 'nodeimage');
        const uploadPromises = files.map(file => {
            const formData = new FormData();
            formData.append(selectedHost === 'cloudflare-imgbed' ? 'file' : 'image', file, file.name);
            return uploadToImageHost(formData, file.name, selectedHost);
        });
        try {
            await Promise.all(uploadPromises);
        } catch (error) {
            console.error('批量上传失败:', error);
            alert('部分或全部图片上传失败，请查看控制台了解详情。');
        } finally {
            removeUploadHint(container);
        }
    }

    async function fetchNodeImageApiKey() {
        try {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: NODEIMAGE.API_KEY_FETCH_URL,
                    responseType: 'json',
                    onload: (response) => {
                        if (response.status === 200 && response.response && response.response.api_key) {
                            nodeImageApiKey = response.response.api_key;
                            GM_setValue(NODEIMAGE.API_KEY_KEY, nodeImageApiKey);
                            resolve(true);
                        } else {
                            nodeImageApiKey = '';
                            GM_deleteValue(NODEIMAGE.API_KEY_KEY);
                            console.error('Failed to get NodeImage API Key:', response.response);
                            resolve(false);
                        }
                    },
                    onerror: (error) => {
                        nodeImageApiKey = '';
                        GM_deleteValue(NODEIMAGE.API_KEY_KEY);
                        console.error('NodeImage API Key request failed:', error);
                        reject(error);
                    },
                    ontimeout: () => {
                        nodeImageApiKey = '';
                        GM_deleteValue(NODEIMAGE.API_KEY_KEY);
                        console.error('NodeImage API Key request timed out');
                        reject(new Error('Timeout'));
                    },
                    timeout: 10000
                });
            });
        } catch (error) {
            nodeImageApiKey = '';
            GM_deleteValue(NODEIMAGE.API_KEY_KEY);
            console.error('Error in fetchNodeImageApiKey:', error);
            return false;
        }
    }


    function uploadToImageHost(formData, fileName, host) {
        return new Promise(async (resolve, reject) => {
            const selectedHost = host;
            let apiUrl, headers = {};

            if (selectedHost === 'nodeimage') {
                if (!nodeImageApiKey) {
                    const fetched = await fetchNodeImageApiKey();
                    if (!fetched) {
                        alert('请登录 NodeImage 获取 API Key！');
                        reject(new Error('NodeImage API Key not available.'));
                        return;
                    }
                }
                apiUrl = NODEIMAGE.UPLOAD_URL;
                headers = { 'X-API-Key': nodeImageApiKey, 'Accept': 'application/json' };
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiUrl,
                    headers: headers,
                    data: formData,
                    responseType: 'json', // 统一使用 responseType
                    timeout: 30000,
                    onload: (response) => {
                        try {
                            const jsonResponse = response.response; // 直接使用解析后的对象
                            if (response.status === 200 && jsonResponse && jsonResponse.success && jsonResponse.links && jsonResponse.links.markdown) {
                                const markdownImage = jsonResponse.links.markdown;
                                console.log('NodeImage 上传成功，Markdown:', markdownImage);
                                insertToEditor(markdownImage);
                                resolve();
                            } else {
                                console.error('NodeImage 上传成功但未获取到有效链接或返回错误:', jsonResponse);
                                if (response.status === 401 || response.status === 403) {
                                    alert('NodeImage API Key 无效或已过期，请重新登录获取。');
                                    GM_deleteValue(NODEIMAGE.API_KEY_KEY);
                                    nodeImageApiKey = '';
                                }
                                reject(new Error(jsonResponse ? jsonResponse.error || 'Invalid response from NodeImage' : 'Invalid response from NodeImage'));
                            }
                        } catch (error) {
                            console.error('解析 NodeImage 响应错误:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => {
                        console.error('NodeImage 上传错误详情:', error);
                        reject(error);
                    },
                    ontimeout: () => {
                        console.error('NodeImage 请求超时');
                        reject(new Error('Timeout'));
                    }
                });
            } else if (selectedHost === 'sixteen') {
                apiUrl = 'https://i.111666.best/image';
                const token = GM_getValue('sixteenToken', '').trim();
                if (!token) { console.error('16 图床需要设置 Auth-Token'); reject(new Error('16 图床需要设置 Auth-Token')); return; }
                headers = { 'Auth-Token': token };
                GM_xmlhttpRequest({
                    method: 'POST', url: apiUrl, headers: headers, data: formData, timeout: 10000,
                    responseType: 'json', // 统一使用 responseType
                    onload: (response) => {
                        try {
                            const jsonResponse = response.response; // 直接使用解析后的对象
                            if (response.status === 200 && jsonResponse && jsonResponse.ok && jsonResponse.src) {
                                const imageUrl = `https://i.111666.best${jsonResponse.src}`;
                                const markdownImage = `![${fileName.split('.').slice(0, -1).join('.')}](${imageUrl})`;
                                console.log('16 图床上传成功，Markdown:', markdownImage);
                                insertToEditor(markdownImage);
                                resolve();
                            } else {
                                console.error('16 图床返回的响应无效:', jsonResponse);
                                reject(new Error(jsonResponse ? jsonResponse.message || 'Invalid response from 16 图床' : `Upload failed on 16 图床: ${response.status} ${response.statusText}`));
                            }
                        } catch (error) {
                            console.error('解析 16 图床响应错误:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => { console.error('16 图床上传错误详情:', error); reject(error); },
                    ontimeout: () => { console.error('16 图床请求超时'); reject(new Error('Timeout')); }
                });
            } else if (selectedHost === 'simple-imgbed') {
                apiUrl = GM_getValue('simpleImgbedApi', '').trim();
                const token = GM_getValue('simpleImgbedToken', '').trim();
                if (!apiUrl) {
                    console.error('简单图床需要设置 API 地址');
                    reject(new Error('简单图床需要设置 API 地址'));
                    return;
                }
                if (!token) {
                    console.error('简单图床需要设置 Token');
                    reject(new Error('简单图床需要设置 Token'));
                    return;
                }
                formData.append('token', token);
                headers = {};
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiUrl,
                    headers: headers,
                    data: formData,
                    responseType: 'json', // 统一使用 responseType
                    timeout: 10000,
                    onload: (response) => {
                        try {
                            const jsonResponse = response.response; // 直接使用解析后的对象
                            if (response.status === 200 && jsonResponse && jsonResponse.result === 'success' && jsonResponse.url) {
                                const imageUrl = jsonResponse.url;
                                const markdownImage = `![${fileName.split('.').slice(0, -1).join('.')}](${imageUrl})`;
                                console.log('简单图床上传成功，Markdown:', markdownImage);
                                insertToEditor(markdownImage);
                                resolve();
                            } else {
                                console.error('简单图床上传成功但未获取到有效链接:', jsonResponse);
                                reject(new Error(jsonResponse ? jsonResponse.msg || 'Invalid response from 简单图床' : 'Invalid response from 简单图床'));
                            }
                        } catch (error) {
                            console.error('解析简单图床响应错误:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => { console.error('简单图床上传错误详情:', error); reject(error); },
                    ontimeout: () => { console.error('简单图床请求超时'); reject(new Error('Timeout')); }
                });
            }
            else if (selectedHost === 'lankong-custom') {
                const api = GM_getValue('lankongCustomApi', '').trim();
                const token = GM_getValue('lankongCustomToken', '').trim();
                if (!api) { console.error('兰空图床需要设置 API 端点'); reject(new Error('兰空图床需要设置 API 端点')); return; }
                if (!token) { console.error('兰空图床需要设置 Token'); reject(new Error('兰空图床需要设置 Token')); return; }
                apiUrl = api;
                headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
                GM_xmlhttpRequest({
                    method: 'POST', url: apiUrl, headers: headers, data: formData, timeout: 10000,
                    responseType: 'json', // 统一使用 responseType
                    onload: (response) => {
                        try {
                            const jsonResponse = response.response; // 直接使用解析后的对象
                            if (response.status === 200 && jsonResponse && jsonResponse.data && jsonResponse.data.links && jsonResponse.data.links.url) {
                                const imageUrl = jsonResponse.data.links.url;
                                const markdownImage = `![${fileName.split('.').slice(0, -1).join('.')}](${imageUrl})`;
                                console.log('兰空图床上传成功，Markdown:', markdownImage);
                                insertToEditor(markdownImage);
                                resolve();
                            } else {
                                console.error('兰空图床上传成功但未获取到有效链接:', jsonResponse);
                                reject(new Error(jsonResponse ? jsonResponse.message || 'Invalid response from 兰空图床' : 'Invalid response from 兰空图床'));
                            }
                        } catch (error) {
                            console.error('解析兰空图床响应错误:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => { console.error('兰空图床上传错误详情:', error); reject(error); },
                    ontimeout: () => { console.error('兰空图床请求超时'); reject(new Error('Timeout')); }
                });
            } else if (selectedHost === 'cloudflare-imgbed') {
                const baseApiUrl = GM_getValue('cloudflareImgbedApi', '').trim();
                const authToken = GM_getValue(CFBED_API_TOKEN_KEY, '').trim();
                const authType = GM_getValue(CFBED_AUTH_TYPE_KEY, 'header_bearer');
                const enableCompress = GM_getValue('cloudflareImgbedCompress', true);

                // ** 修复 2: 检查 baseApiUrl 是否为空，并给出清晰提示 **
                if (!baseApiUrl) {
                    console.error('Cloudflare ImgBed 需要设置域名');
                    alert('Cloudflare ImgBed 域名未设置。请在图床设置中填写。');
                    reject(new Error('Cloudflare ImgBed 域名未设置。'));
                    return;
                }
                if (!authToken) {
                    console.error('Cloudflare ImgBed 需要设置 Token/Auth Code');
                    reject(new Error('Cloudflare ImgBed 需要设置 Token/Auth Code'));
                    return;
                }

                // ** 步骤 1: 构造 API URL (端点：/upload) **
                let cleanedBaseUrl = baseApiUrl.endsWith('/') ? baseApiUrl.slice(0, -1) : baseApiUrl;
                let urlQuery = [];

                // 强制构造上传 API URL：域名/upload
                let apiUrl = `${cleanedBaseUrl}/upload`;

                // 添加服务端压缩参数 (Query)
                urlQuery.push(`serverCompress=${enableCompress}`);

                // ** 步骤 2: 构造认证头或 Query 参数 **
                if (authType === 'query_authcode') {
                    // 使用 authCode 作为 Query 参数
                    urlQuery.push(`authCode=${encodeURIComponent(authToken)}`);
                    headers = {}; // 无 Authorization Header
                } else {
                    // 使用 Authorization Header (Bearer 或 Plain)
                    let authPrefix = authType === 'header_bearer' ? 'Bearer ' : '';
                    headers = {
                        'Authorization': `${authPrefix}${authToken}`
                    };
                }

                // 拼接最终 URL
                if (urlQuery.length > 0) {
                    apiUrl += '?' + urlQuery.join('&');
                }

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiUrl,
                    headers: headers,
                    data: formData,
                    responseType: 'json',
                    timeout: 30000,
                    onload: (response) => {
                        const jsonResponse = response.response; // 可能是 undefined/null

                        // 优先处理 HTTP 错误状态码 (捕获 405)
                        if (response.status < 200 || response.status >= 300) {
                            console.error('Cloudflare-ImgBed 上传请求失败。状态码:', response.status, '响应:', jsonResponse || response.responseText);
                            const statusText = response.statusText || '未知 HTTP 错误';

                            // 尝试从 JSON 响应中获取错误信息
                            const errorDetail = jsonResponse && (jsonResponse.message || jsonResponse.error || (jsonResponse[0] && jsonResponse[0].message) || JSON.stringify(jsonResponse));

                            reject(new Error(`上传失败：服务器返回错误 (${response.status} ${statusText}): ${errorDetail || response.responseText || '无详细错误信息'}`));
                            return;
                        }

                        // 处理成功的 2xx 状态码
                        try {
                            // 检查上传是否成功并返回了有效链接
                            // 响应格式：数组，其中第一个元素包含 src 属性
                            if (Array.isArray(jsonResponse) && jsonResponse.length > 0 && jsonResponse[0].src) {
                                // 链接拼接，使用 cleanedBaseUrl + src
                                const imageUrl = cleanedBaseUrl + jsonResponse[0].src;
                                const markdownImage = `![${fileName.split('.').slice(0, -1).join('.')}](${imageUrl})`;
                                console.log('Cloudflare-ImgBed 上传成功，Markdown:', markdownImage);
                                insertToEditor(markdownImage);
                                resolve();
                            }
                            else {
                                // 2xx 状态码但返回数据格式不符合预期
                                console.error('Cloudflare-ImgBed 上传成功但返回格式无效或失败:', jsonResponse);
                                const errorMessage = jsonResponse && (jsonResponse.message || jsonResponse.error || JSON.stringify(jsonResponse));
                                reject(new Error(`上传失败：服务器返回无效响应或错误 (${response.status}): ${errorMessage || '返回数据格式不正确'}`));
                            }
                        } catch (error) {
                            console.error('解析 Cloudflare-ImgBed 响应错误:', error);
                            reject(new Error(`解析服务器响应失败: ${error.message}`));
                        }
                    },
                    onerror: (error) => {
                        console.error('Cloudflare-ImgBed 上传错误详情:', error);
                        reject(new Error(`上传请求失败: ${error.statusText || error.message || JSON.stringify(error)}`));
                    },
                    ontimeout: () => {
                        console.error('Cloudflare-ImgBed 请求超时');
                        reject(new Error('上传请求超时'));
                    },
                    timeout: 30000
                });

            } else {
                console.error(`未知的图床选项: ${selectedHost}`);
                reject(new Error(`未知的图床选项: ${selectedHost}`));
            }
        });
    }

    function insertToEditor(markdown) {
        if (cmInstance) {
            const cursor = cmInstance.getCursor();
            cmInstance.replaceRange(markdown + '\n', cursor);
            console.log('已插入 Markdown 到编辑器');
        } else {
            const editable = document.querySelector('.CodeMirror textarea') || document.querySelector('textarea');
            if (editable) {
                const start = editable.selectionStart;
                const end = editable.selectionEnd;
                editable.value = editable.value.substring(0, start) + markdown + '\n' + editable.value.substring(end);
                editable.selectionStart = editable.selectionEnd = start + markdown.length + 1;
                console.log('已插入 Markdown 到 textarea');
                const event = new Event('input', { bubbles: true });
                editable.dispatchEvent(event);
            } else {
                console.error('未找到可编辑的 CodeMirror 实例或 textarea');
            }
        }
    }

    // NodeImage site specific logic for API key retrieval and login status sync
    function isNodeImageSite() {
        return /^(.*\.)?nodeimage\.com$/.test(window.location.hostname);
    }

    async function checkLoginAndGetKeyForNodeImageSite() {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: NODEIMAGE.API_KEY_FETCH_URL,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (err) => reject(err),
                    ontimeout: () => reject(new Error('Timeout'))
                });
            });

            if (response.status === 200 && response.response && response.response.api_key) {
                nodeImageApiKey = response.response.api_key;
                GM_setValue(NODEIMAGE.API_KEY_KEY, nodeImageApiKey);
                return true;
            } else {
                nodeImageApiKey = '';
                GM_deleteValue(NODEIMAGE.API_KEY_KEY);
                return false;
            }
        } catch (error) {
            nodeImageApiKey = '';
            GM_deleteValue(NODEIMAGE.API_KEY_KEY);
            return false;
        }
    }

    function handleNodeImageSiteSpecificLogic() {
        if (['/login', '/register', '/'].includes(window.location.pathname)) {
            const loginForm = document.querySelector('form');
            if (loginForm) {
                loginForm.addEventListener('submit', () => {
                    localStorage.setItem(NODEIMAGE.STORAGE_KEYS.LOGIN_STATUS, 'login_pending');
                });
            }

            const checkLoginInterval = setInterval(async () => {
                const isLoggedIn = await checkLoginAndGetKeyForNodeImageSite();
                if (isLoggedIn) {
                    clearInterval(checkLoginInterval);
                    localStorage.removeItem(NODEIMAGE.STORAGE_KEYS.LOGIN_STATUS);
                    localStorage.setItem(NODEIMAGE.STORAGE_KEYS.LOGIN_STATUS, 'login_success');
                    localStorage.setItem(NODEIMAGE.STORAGE_KEYS.LOGIN_CHECK, Date.now().toString());
                    setTimeout(() => window.close(), NODEIMAGE.LOGIN_SUCCESS_CLOSE_DELAY);
                }
            }, NODEIMAGE.LOGIN_CHECK_INTERVAL);

            setTimeout(() => clearInterval(checkLoginInterval), NODEIMAGE.LOGIN_CHECK_TIMEOUT);

        } else if (localStorage.getItem(NODEIMAGE.STORAGE_KEYS.LOGIN_STATUS) === 'login_pending') {
            checkLoginAndGetKeyForNodeImageSite();
        }

        document.addEventListener('click', e => {
            const logoutButton = e.target.closest('#logoutBtn, .logout-btn');
            if (logoutButton || e.target.textContent?.match(/登出|注销|退出|logout|sign out/i)) {
                localStorage.setItem(NODEIMAGE.STORAGE_KEYS.LOGOUT, 'true');
            }
        });
    }

    // Main initialization for NodeSeek site
    async function initNodeSeekScript() {
        // Handle cross-tab/window login/logout sync
        window.addEventListener('storage', event => {
            if (event.key === NODEIMAGE.STORAGE_KEYS.LOGIN_STATUS && event.newValue === 'login_success') {
                fetchNodeImageApiKey();
                localStorage.removeItem(NODEIMAGE.STORAGE_KEYS.LOGIN_STATUS);
            } else if (event.key === NODEIMAGE.STORAGE_KEYS.LOGOUT && event.newValue === 'true') {
                GM_deleteValue(NODEIMAGE.API_KEY_KEY);
                nodeImageApiKey = '';
                localStorage.removeItem(NODEIMAGE.STORAGE_KEYS.LOGOUT);
            }
        });

        // Check for recent login from other tabs
        const lastLoginCheck = localStorage.getItem(NODEIMAGE.STORAGE_KEYS.LOGIN_CHECK);
        if (lastLoginCheck && (Date.now() - parseInt(lastLoginCheck) < NODEIMAGE.RECENT_LOGIN_GRACE_PERIOD)) {
            await fetchNodeImageApiKey();
            localStorage.removeItem(NODEIMAGE.STORAGE_KEYS.LOGIN_CHECK);
        }
    }

    if (isNodeImageSite()) {
        handleNodeImageSiteSpecificLogic();
    } else {
        initNodeSeekScript();
    }

})();