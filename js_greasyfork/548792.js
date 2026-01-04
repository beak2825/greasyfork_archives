// ==UserScript==
// @name         bilibili自动发送直播弹幕
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动发送弹幕工具
// @author       Sieluna
// @license      MIT
// @match        *://live.bilibili.com/blanc/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/548792/bilibili%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/548792/bilibili%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 核心配置与状态 ---
    let config = { templates: {}, activeTemplate: '' };
    let isRunning = false;
    let timer = null;
    let editingTemplate = null; // 标记正在编辑的模板名称

    // --- 存储层 ---
    const Storage = {
        get: (key, defaultValue) => GM_getValue(key, defaultValue),
        set: (key, value) => GM_setValue(key, value),
    };

    // --- DOM操作 ---
    function getDoms() {
        let textarea = document.querySelector('#control-panel-ctnr-box textarea');
        let btn = document.querySelector('#control-panel-ctnr-box button.bl-button');

        return textarea && btn ? { textarea, btn } : null;
    }

    // --- 核心功能 ---
    function sendDanmaku() {
        const doms = getDoms();
        const currentTemplate = config.templates[config.activeTemplate];
        if (!doms || !currentTemplate?.danmakus?.length) {
            notify('错误: 未找到输入框或当前模板为空，任务停止。');
            return stop();
        }
        const danmaku = currentTemplate.danmakus[Math.floor(Math.random() * currentTemplate.danmakus.length)];
        doms.textarea.value = danmaku;
        // 模拟手动输入，以触发B站前端框架的事件监听
        doms.textarea.dispatchEvent(new Event('input', { bubbles: true }));
        doms.btn.click();
    }

    function start() {
        const currentTemplate = config.templates[config.activeTemplate];
        if (isRunning || !getDoms() || !currentTemplate?.danmakus?.length) {
            return notify('启动失败: 未找到弹幕输入框或模板为空。');
        }
        isRunning = true;
        sendDanmaku(); // 立即发送一次
        timer = setInterval(sendDanmaku, currentTemplate.interval * 1000);
        UI.update();
        notify(`自动弹幕已开启！模板: ${config.activeTemplate}`);
    }

    function stop() {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(timer);
        timer = null;
        UI.update();
        notify('自动弹幕已停止。');
    }

    // --- 模板与配置管理 ---
    function loadConfig() {
        config.templates = Storage.get('templates', {});
        config.activeTemplate = Storage.get('activeTemplate', '');

        // 如果没有任何模板，则创建一个默认模板
        if (Object.keys(config.templates).length === 0) {
            config.templates['默认'] = { danmakus: ['[吃瓜]', '[doge]', '666'], interval: 120 };
            config.activeTemplate = '默认';
            saveConfig();
        }
        // 如果当前激活的模板不存在，则自动切换到第一个
        if (!config.templates[config.activeTemplate]) {
            config.activeTemplate = Object.keys(config.templates)[0] || '';
            saveConfig();
        }
    }

    function saveConfig() {
        Storage.set('templates', config.templates);
        Storage.set('activeTemplate', config.activeTemplate);
    }

    function restartIfRunning() {
        if (isRunning) {
            stop();
            start();
        }
    }

    function notify(text, timeout = 2000) {
        GM_notification({ text, title: '弹幕助手', timeout });
    }

    // --- UI组件逻辑 ---
    const UI = {
        panel: null,
        elements: {},

        create() {
            if (document.getElementById('danmaku-helper-panel')) return;

            const styles = `
                #danmaku-helper-panel {
                    position: fixed; top: 150px; left: 20px; z-index: 99999; background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc; font-size: 13px;
                    & .header {
                        display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; cursor: move;
                        & .status-text { padding:2px 4px; color:white; border-radius:3px; }
                        & .close-btn { cursor:pointer; }
                    }
                    & .row {
                       display: flex; align-items: center; gap: 5px;
                       &.main-controls { margin-bottom: 10px; }
                       &.editor-actions { justify-content: flex-end; }
                       & .select { flex-grow: 1; }
                    }
                    & .editor {
                        margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;
                        & .editor-row {
                            display: grid; grid-template-columns: 50px 1fr; gap: 5px; align-items: center; margin-bottom: 5px;
                            & input, & textarea { width: 100%; box-sizing: border-box; }
                        }
                    }
                }
            `;
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);

            this.panel = document.createElement('div');
            this.panel.id = 'danmaku-helper-panel';
            this.panel.innerHTML = `
                <div id="dhp-header" class="header">
                    <span class="title">弹幕助手</span>
                    <span id="dhp-status-text" class="status-text"></span>
                    <span id="dhp-close" class="close-btn">✖</span>
                </div>
                <div class="row main-controls">
                    <button id="dhp-toggle"></button>
                    <select id="dhp-select"></select>
                    <button id="dhp-new">＋</button>
                    <button id="dhp-edit">✎</button>
                    <button id="dhp-delete">－</button>
                </div>
                <div id="dhp-editor" class="editor" style="display:none;">
                    <div class="editor-row"><label>名称:</label><input type="text" id="dhp-name-input"></div>
                    <div class="editor-row"><label>弹幕:</label><textarea id="dhp-danmakus-textarea" placeholder="用英文逗号分隔"></textarea></div>
                    <div class="editor-row"><label>间隔(s):</label><input type="number" id="dhp-interval-input" min="1"></div>
                    <div class="row editor-actions"><button id="dhp-save">保存</button><button id="dhp-cancel">取消</button></div>
                </div>
            `;
            document.body.appendChild(this.panel);

            const ids = ['toggle','select','new','edit','delete','close','header','status-text','editor','name-input','danmakus-textarea','interval-input','save','cancel'];
            ids.forEach(id => this.elements[id] = document.getElementById(`dhp-${id}`));

            this.bindEvents();
            this.update();
        },

        showEditor(isNew = false) {
            const controls = [this.elements.select, this.elements.new, this.elements.edit, this.elements.delete];
            controls.forEach(el => el.disabled = true);
            this.elements.editor.style.display = 'block';
            this.elements['name-input'].disabled = !isNew;

            const currentTemplate = config.templates[config.activeTemplate];
            if (isNew) {
                editingTemplate = null;
                this.elements['name-input'].value = '';
                this.elements['danmakus-textarea'].value = '';
                this.elements['interval-input'].value = currentTemplate?.interval ?? 120;
            } else {
                editingTemplate = config.activeTemplate;
                this.elements['name-input'].value = config.activeTemplate;
                this.elements['danmakus-textarea'].value = currentTemplate.danmakus.join(',');
                this.elements['interval-input'].value = currentTemplate.interval;
            }
        },

        hideEditor() {
            const controls = [this.elements.select, this.elements.new, this.elements.edit, this.elements.delete];
            controls.forEach(el => el.disabled = false);
            this.elements.editor.style.display = 'none';
            editingTemplate = null;
        },

        update() {
            if (!this.panel) return;
            this.elements['status-text'].textContent = isRunning ? '运行中' : '停止中';
            this.elements['status-text'].style.backgroundColor = isRunning ? '#28a745' : '#dc3545';
            this.elements.toggle.textContent = isRunning ? '■' : '▶';

            this.elements.select.innerHTML = Object.keys(config.templates).map(name =>
                `<option value="${name}" ${name === config.activeTemplate ? 'selected' : ''}>${name}</option>`
            ).join('');
        },

        bindEvents() {
            this.elements.toggle.onclick = () => isRunning ? stop() : start();
            this.elements.close.onclick = () => this.toggleVisibility();

            this.elements.select.onchange = (e) => {
                config.activeTemplate = e.target.value;
                saveConfig();
                restartIfRunning();
            };

            this.elements.new.onclick = () => this.showEditor(true);
            this.elements.edit.onclick = () => config.activeTemplate && this.showEditor(false);

            this.elements.delete.onclick = () => {
                const name = config.activeTemplate;
                if (!name) return notify('没有可删除的模板');
                if (Object.keys(config.templates).length <= 1) return notify('不能删除最后一个模板');
                if (confirm(`确定要删除模板 [${name}] 吗？`)) {
                    delete config.templates[name];
                    config.activeTemplate = Object.keys(config.templates)[0];
                    saveConfig();
                    this.update();
                    notify(`模板 [${name}] 已删除。`);
                    restartIfRunning();
                }
            };

            this.elements.save.onclick = () => {
                const name = this.elements['name-input'].value.trim();
                const danmakus = this.elements['danmakus-textarea'].value.split(',').map(s => s.trim()).filter(Boolean);
                const interval = parseInt(this.elements['interval-input'].value, 10);

                if (!name) return notify('模板名称不能为空。');
                if (danmakus.length === 0) return notify('弹幕内容不能为空。');
                if (isNaN(interval) || interval <= 0) return notify('间隔必须是大于0的数字。');
                if (!editingTemplate && config.templates[name]) return notify(`错误: 模板 [${name}] 已存在。`);

                config.templates[name] = { danmakus, interval };
                config.activeTemplate = name;
                saveConfig();
                this.hideEditor();
                this.update();
                notify(`模板 [${name}] 已保存。`);
                restartIfRunning();
            };

            this.elements.cancel.onclick = () => this.hideEditor();
            this.makeDraggable();
        },

        makeDraggable() {
            const header = this.elements.header;
            header.onmousedown = (e) => {
                e.preventDefault();
                // 计算鼠标在面板内的初始偏移量
                const offsetX = e.clientX - this.panel.offsetLeft;
                const offsetY = e.clientY - this.panel.offsetTop;

                const moveHandler = (e) => {
                    this.panel.style.left = (e.clientX - offsetX) + 'px';
                    this.panel.style.top = (e.clientY - offsetY) + 'px';
                };

                const upHandler = () => {
                    document.removeEventListener('mousemove', moveHandler);
                    document.removeEventListener('mouseup', upHandler);
                };

                document.addEventListener('mousemove', moveHandler);
                document.addEventListener('mouseup', upHandler);
            };
        },

        toggleVisibility() {
            if (!this.panel) this.create();
            const isVisible = this.panel.style.display !== 'none';
            this.panel.style.display = isVisible ? 'none' : 'block';
            if (isVisible) this.hideEditor(); // 关闭面板时，也关闭编辑框
        }
    };

    // --- 初始化与注册 ---
    function init() {
        loadConfig();
        setTimeout(() => UI.create(), 500);
        GM_registerMenuCommand('⚙️ 显示/隐藏 弹幕助手', () => UI.toggleVisibility());
        document.addEventListener('dblclick', stop);
        console.log('B站自动弹幕脚本已加载。');
    }

    init();
})()
