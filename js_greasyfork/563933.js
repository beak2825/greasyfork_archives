// ==UserScript==
// @name         Eagle 图片裁剪工具
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  支持保存到本地和发送给 Eagle。配合"图片全载Next"脚本使用。
// @author       Your Name
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563933/Eagle%20%E5%9B%BE%E7%89%87%E8%A3%81%E5%89%AA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/563933/Eagle%20%E5%9B%BE%E7%89%87%E8%A3%81%E5%89%AA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[Eagle Cropper] 脚本已加载 v2.0');

    // ==================== 设置界面 ====================
    function openSettings() {
        const { defaultRule, siteRules } = loadRules();

        const modal = document.createElement('div');
        modal.id = 'eagle-settings-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8);
            z-index: 2147483647; display: flex; align-items: center; justify-content: center;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: #1a1a1a; border-radius: 8px; width: 90%; max-width: 800px; max-height: 90vh;
            overflow-y: auto; padding: 20px; color: white;
        `;

        panel.innerHTML = `
            <h2 style="margin-top: 0;">Eagle Cropper 规则设置</h2>
            <div style="background: #2a2a2a; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <h3 style="margin-top: 0;">全网默认设置</h3>
                <div id="default-rule-editor"></div>
            </div>
            <div style="background: #2a2a2a; padding: 15px; border-radius: 6px;">
                <h3 style="margin-top: 0; display: inline-block;">站点规则</h3>
                <button id="add-rule-btn" style="float: right; padding: 5px 15px; border-radius: 4px; border: none; background: #4CAF50; color: white; cursor: pointer;">+ 添加规则</button>
                <div id="site-rules-list" style="clear: both; margin-top: 15px;"></div>
            </div>
            <div style="margin-top: 20px; text-align: right;">
                <button id="save-settings-btn" style="padding: 10px 30px; border-radius: 4px; border: none; background: #4CAF50; color: white; cursor: pointer; margin-right: 10px;">保存</button>
                <button id="cancel-settings-btn" style="padding: 10px 30px; border-radius: 4px; border: none; background: #666; color: white; cursor: pointer;">取消</button>
            </div>
        `;

        modal.appendChild(panel);
        document.body.appendChild(modal);

        // 渲染规则编辑器
        function renderRuleEditor(rule, container) {
            container.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #aaa;">标题 (Name)</label>
                    <select class="rule-name-source" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; margin-bottom: 5px;">
                        <option value="page-title" ${rule.name.source === 'page-title' ? 'selected' : ''}>网页名</option>
                        <option value="filename" ${rule.name.source === 'filename' ? 'selected' : ''}>文件名</option>
                        <option value="url" ${rule.name.source === 'url' ? 'selected' : ''}>网址</option>
                        <option value="custom" ${rule.name.source === 'custom' ? 'selected' : ''}>自定义</option>
                    </select>
                    <input type="text" class="rule-name-custom" placeholder="自定义文本 (支持 {title} {filename} {url} {domain} {date} {time})" value="${rule.name.customText}" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; margin-bottom: 5px; ${rule.name.source !== 'custom' ? 'display: none;' : ''}">
                    <input type="text" class="rule-name-regex" placeholder="正则表达式(可选,提取第一个捕获组)" value="${rule.name.regex}" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #aaa;">注释 (Annotation)</label>
                    <select class="rule-annotation-source" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; margin-bottom: 5px;">
                        <option value="page-title" ${rule.annotation.source === 'page-title' ? 'selected' : ''}>网页名</option>
                        <option value="filename" ${rule.annotation.source === 'filename' ? 'selected' : ''}>文件名</option>
                        <option value="url" ${rule.annotation.source === 'url' ? 'selected' : ''}>网址</option>
                        <option value="custom" ${rule.annotation.source === 'custom' ? 'selected' : ''}>自定义</option>
                    </select>
                    <input type="text" class="rule-annotation-custom" placeholder="自定义文本" value="${rule.annotation.customText}" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; margin-bottom: 5px; ${rule.annotation.source !== 'custom' ? 'display: none;' : ''}">
                    <input type="text" class="rule-annotation-regex" placeholder="正则表达式(可选)" value="${rule.annotation.regex}" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #aaa;">网址 (Website)</label>
                    <select class="rule-website-source" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; margin-bottom: 5px;">
                        <option value="page-title" ${rule.website.source === 'page-title' ? 'selected' : ''}>网页名</option>
                        <option value="filename" ${rule.website.source === 'filename' ? 'selected' : ''}>文件名</option>
                        <option value="url" ${rule.website.source === 'url' ? 'selected' : ''}>网址</option>
                        <option value="custom" ${rule.website.source === 'custom' ? 'selected' : ''}>自定义</option>
                    </select>
                    <input type="text" class="rule-website-custom" placeholder="自定义文本" value="${rule.website.customText}" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; margin-bottom: 5px; ${rule.website.source !== 'custom' ? 'display: none;' : ''}">
                    <input type="text" class="rule-website-regex" placeholder="正则表达式(可选)" value="${rule.website.regex}" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #aaa;">标签 (逗号分隔)</label>
                    <input type="text" class="rule-tags" placeholder="标签1, 标签2" value="${(rule.tags || []).join(', ')}" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                </div>
            `;

            // 切换自定义文本框显示
            ['name', 'annotation', 'website'].forEach(field => {
                const select = container.querySelector(`.rule-${field}-source`);
                const customInput = container.querySelector(`.rule-${field}-custom`);
                select.addEventListener('change', () => {
                    customInput.style.display = select.value === 'custom' ? 'block' : 'none';
                });
            });
        }

        // 渲染默认规则编辑器
        renderRuleEditor(defaultRule, panel.querySelector('#default-rule-editor'));

        // 渲染站点规则列表
        function renderSiteRulesList() {
            const list = panel.querySelector('#site-rules-list');
            list.innerHTML = '';
            siteRules.forEach((rule, index) => {
                const ruleDiv = document.createElement('div');
                ruleDiv.style.cssText = 'background: #333; padding: 15px; border-radius: 6px; margin-bottom: 10px;';
                ruleDiv.innerHTML = `
                    <div style="margin-bottom: 10px;">
                        <label style="color: #aaa;">URL 模式 (支持通配符 *)</label>
                        <input type="text" class="rule-url-pattern" value="${rule.urlPattern}" style="width: 100%; padding: 8px; background: #222; color: white; border: 1px solid #555; border-radius: 4px; margin-top: 5px;">
                    </div>
                    <div class="rule-editor-${index}"></div>
                    <div style="margin-top: 10px;">
                        <button class="delete-rule-btn" data-index="${index}" style="padding: 5px 15px; border-radius: 4px; border: none; background: #f44336; color: white; cursor: pointer;">删除</button>
                    </div>
                `;
                list.appendChild(ruleDiv);
                renderRuleEditor(rule, ruleDiv.querySelector(`.rule-editor-${index}`));
            });

            // 删除按钮事件
            list.querySelectorAll('.delete-rule-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    siteRules.splice(index, 1);
                    renderSiteRulesList();
                });
            });
        }

        renderSiteRulesList();

        // 添加规则按钮
        panel.querySelector('#add-rule-btn').addEventListener('click', () => {
            siteRules.push(JSON.parse(JSON.stringify(DEFAULT_RULE)));
            renderSiteRulesList();
        });

        // 保存按钮
        panel.querySelector('#save-settings-btn').addEventListener('click', () => {
            // 读取默认规则
            const defaultEditor = panel.querySelector('#default-rule-editor');
            const newDefaultRule = {
                urlPattern: '*',
                name: {
                    source: defaultEditor.querySelector('.rule-name-source').value,
                    customText: defaultEditor.querySelector('.rule-name-custom').value,
                    regex: defaultEditor.querySelector('.rule-name-regex').value
                },
                annotation: {
                    source: defaultEditor.querySelector('.rule-annotation-source').value,
                    customText: defaultEditor.querySelector('.rule-annotation-custom').value,
                    regex: defaultEditor.querySelector('.rule-annotation-regex').value
                },
                website: {
                    source: defaultEditor.querySelector('.rule-website-source').value,
                    customText: defaultEditor.querySelector('.rule-website-custom').value,
                    regex: defaultEditor.querySelector('.rule-website-regex').value
                },
                tags: defaultEditor.querySelector('.rule-tags').value.split(',').map(t => t.trim()).filter(t => t)
            };

            // 读取站点规则
            const newSiteRules = [];
            panel.querySelectorAll('#site-rules-list > div').forEach((ruleDiv, index) => {
                newSiteRules.push({
                    urlPattern: ruleDiv.querySelector('.rule-url-pattern').value,
                    name: {
                        source: ruleDiv.querySelector('.rule-name-source').value,
                        customText: ruleDiv.querySelector('.rule-name-custom').value,
                        regex: ruleDiv.querySelector('.rule-name-regex').value
                    },
                    annotation: {
                        source: ruleDiv.querySelector('.rule-annotation-source').value,
                        customText: ruleDiv.querySelector('.rule-annotation-custom').value,
                        regex: ruleDiv.querySelector('.rule-annotation-regex').value
                    },
                    website: {
                        source: ruleDiv.querySelector('.rule-website-source').value,
                        customText: ruleDiv.querySelector('.rule-website-custom').value,
                        regex: ruleDiv.querySelector('.rule-website-regex').value
                    },
                    tags: ruleDiv.querySelector('.rule-tags').value.split(',').map(t => t.trim()).filter(t => t)
                });
            });

            saveRules(newDefaultRule, newSiteRules);
            alert('规则已保存!');
            modal.remove();
        });

        // 取消按钮
        panel.querySelector('#cancel-settings-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    // ==================== 初始化 ====================
    const CONFIG = {
        eagleApiUrl: 'http://localhost:41595'
    };

    let cropperInstance = null;

    // ==================== 规则配置 ====================
    const DEFAULT_RULE = {
        urlPattern: '*',
        name: { source: 'page-title', customText: '', regex: '' },
        annotation: { source: 'custom', customText: '', regex: '' },
        website: { source: 'url', customText: '', regex: '' },
        tags: ['裁剪', '漫画']
    };

    // 加载规则配置
    function loadRules() {
        const defaultRule = GM_getValue('eagle_default_rule', DEFAULT_RULE);
        const siteRules = GM_getValue('eagle_site_rules', []);
        return { defaultRule, siteRules };
    }

    // 保存规则配置
    function saveRules(defaultRule, siteRules) {
        GM_setValue('eagle_default_rule', defaultRule);
        GM_setValue('eagle_site_rules', siteRules);
    }

    // URL 模式匹配 (支持通配符)
    function matchUrlPattern(pattern, url) {
        if (pattern === '*') return true;

        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');

        const regex = new RegExp('^' + regexPattern + '$', 'i');
        return regex.test(url);
    }

    // 查找匹配当前URL的规则
    function findMatchingRule(url) {
        const { defaultRule, siteRules } = loadRules();

        for (const rule of siteRules) {
            if (matchUrlPattern(rule.urlPattern, url)) {
                console.log('[Eagle Cropper] 匹配规则:', rule.urlPattern);
                return rule;
            }
        }

        console.log('[Eagle Cropper] 使用默认规则');
        return defaultRule;
    }

    // 变量替换
    function replaceVariables(text, context) {
        return text
            .replace(/\{title\}/g, context.title || '')
            .replace(/\{filename\}/g, context.filename || '')
            .replace(/\{url\}/g, context.url || '')
            .replace(/\{domain\}/g, context.domain || '')
            .replace(/\{date\}/g, new Date().toISOString().split('T')[0])
            .replace(/\{time\}/g, new Date().toTimeString().split(' ')[0]);
    }

    // 正则提取
    function extractByRegex(text, regex) {
        if (!regex) return text;
        try {
            const match = text.match(new RegExp(regex));
            return match && match[1] ? match[1] : text;
        } catch (e) {
            console.error('[Eagle Cropper] 正则表达式错误:', e);
            return text;
        }
    }

    // 生成元数据
    function generateMetadata(imageUrl, rule) {
        const context = {
            title: document.title,
            filename: imageUrl.split('/').pop().split('?')[0],
            url: location.href,
            domain: location.hostname
        };

        const getValue = (config) => {
            let value = '';
            switch (config.source) {
                case 'page-title':
                    value = context.title;
                    break;
                case 'filename':
                    value = context.filename;
                    break;
                case 'url':
                    value = context.url;
                    break;
                case 'custom':
                    value = replaceVariables(config.customText, context);
                    break;
            }

            if (config.regex) {
                value = extractByRegex(value, config.regex);
            }

            return value;
        };

        return {
            name: getValue(rule.name),
            annotation: getValue(rule.annotation),
            website: getValue(rule.website),
            tags: rule.tags || []
        };
    }

    // ==================== Cropper CSS ====================
    const cropperCSS = `
        .cropper-container { direction: ltr; font-size: 0; line-height: 0; position: relative; touch-action: none; user-select: none; }
        .cropper-container img { display: block; height: 100%; max-height: none !important; max-width: none !important; min-height: 0 !important; min-width: 0 !important; width: 100%; }
        .cropper-wrap-box, .cropper-canvas, .cropper-drag-box, .cropper-crop-box, .cropper-modal { bottom: 0; left: 0; position: absolute; right: 0; top: 0; }
        .cropper-wrap-box, .cropper-canvas { overflow: hidden; }
        .cropper-drag-box { background-color: #fff; opacity: 0; }
        .cropper-modal { background-color: #000; opacity: 0.5; }
        .cropper-view-box { display: block; height: 100%; outline: 1px solid #39f; overflow: hidden; width: 100%; }
        .cropper-dashed { border: 0 dashed #eee; display: block; opacity: 0.5; position: absolute; }
        .cropper-dashed.dashed-h { border-bottom-width: 1px; border-top-width: 1px; height: calc(100% / 3); left: 0; top: calc(100% / 3); width: 100%; }
        .cropper-dashed.dashed-v { border-left-width: 1px; border-right-width: 1px; height: 100%; left: calc(100% / 3); top: 0; width: calc(100% / 3); }
        .cropper-center { display: block; height: 0; left: 50%; opacity: 0.75; position: absolute; top: 50%; width: 0; }
        .cropper-center::before, .cropper-center::after { background-color: #eee; content: ' '; display: block; position: absolute; }
        .cropper-center::before { height: 1px; left: -3px; top: 0; width: 7px; }
        .cropper-center::after { height: 7px; left: 0; top: -3px; width: 1px; }
        .cropper-face, .cropper-line, .cropper-point { display: block; height: 100%; opacity: 0.1; position: absolute; width: 100%; }
        .cropper-face { background-color: #fff; left: 0; top: 0; }
        .cropper-line { background-color: #39f; }
        .cropper-line.line-e { cursor: ew-resize; right: -3px; top: 0; width: 5px; }
        .cropper-line.line-n { cursor: ns-resize; height: 5px; left: 0; top: -3px; }
        .cropper-line.line-w { cursor: ew-resize; left: -3px; top: 0; width: 5px; }
        .cropper-line.line-s { bottom: -3px; cursor: ns-resize; height: 5px; left: 0; }
        .cropper-point { background-color: #39f; height: 5px; opacity: 0.75; width: 5px; }
        .cropper-point.point-e { cursor: ew-resize; margin-top: -3px; right: -3px; top: 50%; }
        .cropper-point.point-n { cursor: ns-resize; left: 50%; margin-left: -3px; top: -3px; }
        .cropper-point.point-w { cursor: ew-resize; left: -3px; margin-top: -3px; top: 50%; }
        .cropper-point.point-s { bottom: -3px; cursor: s-resize; left: 50%; margin-left: -3px; }
        .cropper-point.point-ne { cursor: nesw-resize; right: -3px; top: -3px; }
        .cropper-point.point-nw { cursor: nwse-resize; left: -3px; top: -3px; }
        .cropper-point.point-sw { bottom: -3px; cursor: nesw-resize; left: -3px; }
        .cropper-point.point-se { bottom: -3px; cursor: nwse-resize; height: 20px; opacity: 1; right: -3px; width: 20px; }
        
        /* 确保 Cropper 元素可见 */
        #eagle-cropper-overlay .cropper-container,
        #eagle-cropper-overlay .cropper-crop-box,
        #eagle-cropper-overlay .cropper-view-box,
        #eagle-cropper-overlay .cropper-face,
        #eagle-cropper-overlay .cropper-line,
        #eagle-cropper-overlay .cropper-point {
            z-index: auto !important;
            pointer-events: auto !important;
        }
    `;

    function injectCropperCSS() {
        if (!document.getElementById('eagle-cropper-css')) {
            const style = document.createElement('style');
            style.id = 'eagle-cropper-css';
            style.textContent = cropperCSS;
            document.head.appendChild(style);
        }
    }

    // ==================== 工具函数 ====================
    function downloadImage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`下载失败: ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    function saveToEagle(base64Data, imageUrl) {
        return new Promise((resolve, reject) => {
            // Eagle API 使用 addFromURL 端点,支持 data URL
            const apiUrl = `${CONFIG.eagleApiUrl}/api/item/addFromURL`;

            console.log('[Eagle Cropper] 正在保存到 Eagle...');
            console.log('[Eagle Cropper] API URL:', apiUrl);

            // 使用规则生成元数据
            const rule = findMatchingRule(location.href);
            const metadata = generateMetadata(imageUrl, rule);

            console.log('[Eagle Cropper] 使用元数据:', metadata);

            // 使用 GM_xmlhttpRequest 绕过 CORS
            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    url: base64Data,  // Eagle 支持 data:image/png;base64,... 格式
                    name: metadata.name,
                    website: metadata.website,
                    annotation: metadata.annotation,
                    tags: metadata.tags
                }),
                onload: (response) => {
                    console.log('[Eagle Cropper] Eagle API 响应状态:', response.status);
                    console.log('[Eagle Cropper] 响应内容:', response.responseText);

                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = JSON.parse(response.responseText);
                            resolve(result);
                        } catch (e) {
                            resolve({ status: 'success' });
                        }
                    } else if (response.status === 404) {
                        reject(new Error('Eagle API 端点不存在\n请确保:\n1. Eagle 应用正在运行\n2. 已在 Eagle 设置中启用 API\n3. Eagle 版本 ≥ 3.0'));
                    } else {
                        reject(new Error(`Eagle API 错误: ${response.status}\n${response.responseText}`));
                    }
                },
                onerror: (error) => {
                    console.error('[Eagle Cropper] Eagle API 连接失败:', error);
                    reject(new Error('无法连接到 Eagle (http://localhost:41595)\n\n请确保:\n1. Eagle 应用正在运行\n2. 已在 Eagle 设置 → 实验室 中启用 API\n3. API 端口为 41595'));
                },
                ontimeout: () => {
                    reject(new Error('Eagle API 请求超时'));
                }
            });
        });
    }

    // ==================== 裁剪界面 ====================
    function createCropperUI(imageUrl) {
        const overlay = document.createElement('div');
        overlay.id = 'eagle-cropper-overlay';
        overlay.setAttribute('data-eagle-cropper', 'true');
        overlay.setAttribute('data-extension-element', 'true');
        overlay.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.95) !important;
            z-index: 999999 !important;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden !important;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            width: 90%; max-width: 1200px; height: 85%;
            background: #1a1a1a; border-radius: 8px; padding: 20px;
            display: flex; flex-direction: column;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; color: white;';
        header.innerHTML = `
            <h3 style="margin: 0;">裁剪图片到 Eagle</h3>
            <div style="display: flex; align-items: center; gap: 10px;">
                <label style="font-size: 14px; color: #aaa;">缩放:</label>
                <input type="range" id="eagle-zoom-slider" min="0.1" max="3" step="0.1" value="1" style="width: 150px;">
                <span id="eagle-zoom-value" style="font-size: 14px; color: #aaa; min-width: 40px;">100%</span>
            </div>
        `;

        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            flex: 1; 
            width: 100%;
            max-height: 80vh;
            background: #000; 
            border-radius: 4px; 
            pointer-events: auto;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
        `;
        const img = document.createElement('img');
        img.id = 'eagle-cropper-image';
        img.style.cssText = `
            max-width: 100%; 
            max-height: 100%; 
            display: block; 
            pointer-events: auto;
        `;
        imageContainer.appendChild(img);

        const buttonBar = document.createElement('div');
        buttonBar.style.cssText = 'display: flex; justify-content: center; gap: 15px; margin-top: 20px;';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存到 Eagle';
        saveBtn.style.cssText = 'padding: 10px 30px; border-radius: 4px; border: none; cursor: pointer; background: #4CAF50; color: white; font-size: 14px;';

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '保存到本地';
        downloadBtn.style.cssText = 'padding: 10px 30px; border-radius: 4px; border: none; cursor: pointer; background: #2196F3; color: white; font-size: 14px;';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = 'padding: 10px 30px; border-radius: 4px; border: none; cursor: pointer; background: #666; color: white; font-size: 14px;';

        const statusDiv = document.createElement('div');
        statusDiv.id = 'eagle-cropper-status';
        statusDiv.style.cssText = 'text-align: center; margin-top: 10px; color: white;';

        saveBtn.onclick = async () => {
            try {
                statusDiv.textContent = '正在保存...';
                saveBtn.disabled = true;
                const canvas = cropperInstance.getCroppedCanvas();
                const base64 = canvas.toDataURL('image/png');

                // 传入图片URL用于元数据生成
                const imageUrl = document.getElementById('eagle-cropper-image').dataset.originalUrl || '';
                await saveToEagle(base64, imageUrl);

                statusDiv.textContent = '✓ 保存成功!';
                statusDiv.style.color = '#4CAF50';
                setTimeout(() => overlay.remove(), 1500);
            } catch (error) {
                console.error('[Eagle Cropper] 保存失败:', error);
                statusDiv.textContent = '✗ 保存失败: ' + error.message;
                statusDiv.style.color = '#f44336';
                saveBtn.disabled = false;
            }
        };

        downloadBtn.onclick = async () => {
            try {
                statusDiv.textContent = '正在准备下载...';
                downloadBtn.disabled = true;

                const canvas = cropperInstance.getCroppedCanvas();

                // 使用规则生成文件名
                const imageUrl = document.getElementById('eagle-cropper-image').dataset.originalUrl || '';
                const rule = findMatchingRule(location.href);
                const metadata = generateMetadata(imageUrl, rule);

                // 清理文件名中的非法字符
                const filename = (metadata.name || 'cropped-image')
                    .replace(/[\\/:*?"<>|]/g, '_')
                    .substring(0, 200) + '.png';

                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(url);

                    statusDiv.textContent = '✓ 已下载到本地!';
                    statusDiv.style.color = '#4CAF50';
                    setTimeout(() => {
                        downloadBtn.disabled = false;
                        statusDiv.textContent = '调整裁剪区域后点击保存';
                        statusDiv.style.color = 'white';
                    }, 1500);
                });
            } catch (error) {
                console.error('[Eagle Cropper] 下载失败:', error);
                statusDiv.textContent = '✗ 下载失败: ' + error.message;
                statusDiv.style.color = '#f44336';
                downloadBtn.disabled = false;
            }
        };

        cancelBtn.onclick = () => {
            if (cropperInstance) {
                cropperInstance.destroy();
                cropperInstance = null;
            }
            overlay.remove();
        };

        buttonBar.appendChild(saveBtn);
        buttonBar.appendChild(downloadBtn);
        buttonBar.appendChild(cancelBtn);
        container.appendChild(header);
        container.appendChild(imageContainer);
        container.appendChild(buttonBar);
        container.appendChild(statusDiv);
        overlay.appendChild(container);

        return { overlay, img, statusDiv };
    }

    async function openCropperUI(imageUrl, fancyboxContainer) {
        try {
            console.log('[Eagle Cropper] 开始裁剪:', imageUrl);

            injectCropperCSS();

            const { overlay, img, statusDiv } = createCropperUI(imageUrl);
            fancyboxContainer.appendChild(overlay);

            statusDiv.textContent = '正在加载图片...';

            const blob = await downloadImage(imageUrl);
            const objectUrl = URL.createObjectURL(blob);
            img.src = objectUrl;
            img.dataset.originalUrl = imageUrl;  // 存储原始URL用于元数据生成

            img.onload = () => {
                console.log('[Eagle Cropper] 图片已加载,准备初始化 Cropper');
                console.log('[Eagle Cropper] 图片尺寸:', img.width, 'x', img.height);
                console.log('[Eagle Cropper] 图片父容器:', img.parentElement);
                console.log('[Eagle Cropper] Cropper 是否可用:', typeof Cropper !== 'undefined');

                statusDiv.textContent = '使用鼠标调整裁剪区域';

                try {
                    cropperInstance = new Cropper(img, {
                        aspectRatio: NaN,
                        viewMode: 1,
                        dragMode: 'move',
                        autoCropArea: 0.8,
                        restore: false,
                        guides: true,
                        center: true,
                        highlight: true,
                        cropBoxMovable: true,
                        cropBoxResizable: true,
                        ready() {
                            console.log('[Eagle Cropper] ✓ Cropper 初始化完成并就绪!');

                            // 隐藏原始图片(Cropper 会创建副本)
                            img.style.opacity = '0';
                            img.style.position = 'absolute';

                            // 添加缩放滑条控制
                            const zoomSlider = document.getElementById('eagle-zoom-slider');
                            const zoomValue = document.getElementById('eagle-zoom-value');

                            zoomSlider.addEventListener('input', (e) => {
                                const zoom = parseFloat(e.target.value);
                                cropperInstance.zoomTo(zoom);
                                zoomValue.textContent = Math.round(zoom * 100) + '%';
                            });

                            // 强制设置裁剪框样式
                            setTimeout(() => {
                                const cropBox = document.querySelector('.cropper-crop-box');
                                const viewBox = document.querySelector('.cropper-view-box');
                                const container = document.querySelector('.cropper-container');

                                if (cropBox) {
                                    cropBox.style.cssText += `
                                        display: block !important;
                                        visibility: visible !important;
                                        opacity: 1 !important;
                                        z-index: 9999 !important;
                                        pointer-events: auto !important;
                                    `;
                                    console.log('[Eagle Cropper] ✓ 裁剪框已设置为可见');
                                }

                                if (viewBox) {
                                    viewBox.style.cssText += `
                                        outline: 1px solid #39f !important;
                                    `;
                                }

                                if (container) {
                                    // 阻止容器上的滚轮事件
                                    container.addEventListener('wheel', (e) => {
                                        e.stopPropagation();
                                        e.stopImmediatePropagation();
                                    }, { passive: false, capture: true });

                                    console.log('[Eagle Cropper] Container 尺寸:', container.getBoundingClientRect());
                                }

                                statusDiv.textContent = '调整裁剪区域后点击保存';
                            }, 500);
                        }
                    });
                    console.log('[Eagle Cropper] Cropper 实例已创建:', cropperInstance);
                } catch (err) {
                    console.error('[Eagle Cropper] Cropper 初始化失败:', err);
                    statusDiv.textContent = '裁剪工具加载失败: ' + err.message;
                    statusDiv.style.color = '#f44336';
                }
            };

            img.onerror = (err) => {
                console.error('[Eagle Cropper] 图片加载失败:', err);
                statusDiv.textContent = '图片加载失败';
                statusDiv.style.color = '#f44336';
            };

        } catch (error) {
            console.error('[Eagle Cropper] 错误:', error);
            alert('加载图片失败: ' + error.message);
        }
    }

    // ==================== 按钮注入 ====================
    function addCropButton() {
        const toolbar = document.querySelector('.f-carousel__toolbar .is-middle, .f-carousel__toolbar__column.is-middle');

        if (toolbar && !toolbar.querySelector('.eagle-crop-button')) {
            console.log('[Eagle Cropper] 添加裁剪按钮');

            const button = document.createElement('button');
            button.className = 'f-button eagle-crop-button';
            button.title = '裁剪到 Eagle';
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path>
                    <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>
                </svg>
            `;

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 全面的图片URL获取策略
                let imageUrl = null;

                // 方法1: 当前选中的幻灯片
                const selectors = [
                    '.f-carousel__slide.is-selected img',
                    '.fancybox__slide.is-selected img',
                    '.fancybox__slide.has-image img',
                    '.f-carousel__slide.has-image img'
                ];

                for (const selector of selectors) {
                    const img = document.querySelector(selector);
                    if (img) {
                        imageUrl = img.src || img.dataset.src || img.dataset.lazySrc;
                        if (imageUrl) {
                            console.log('[Eagle Cropper] 通过选择器找到图片:', selector);
                            break;
                        }
                    }
                }

                // 方法2: 任意 Fancybox 内的图片
                if (!imageUrl) {
                    const fancyboxImgs = document.querySelectorAll('.fancybox__container img, .f-carousel img');
                    for (const img of fancyboxImgs) {
                        const url = img.src || img.dataset.src || img.dataset.lazySrc;
                        if (url && !url.includes('data:image')) {
                            imageUrl = url;
                            console.log('[Eagle Cropper] 通过容器找到图片');
                            break;
                        }
                    }
                }

                // 方法3: 检查 Fancybox API (如果可用)
                if (!imageUrl && window.Fancybox) {
                    try {
                        const instance = window.Fancybox.getInstance();
                        if (instance && instance.getSlide) {
                            const slide = instance.getSlide();
                            imageUrl = slide?.src || slide?.thumb;
                            if (imageUrl) {
                                console.log('[Eagle Cropper] 通过 Fancybox API 找到图片');
                            }
                        }
                    } catch (err) {
                        console.log('[Eagle Cropper] Fancybox API 不可用');
                    }
                }

                if (!imageUrl) {
                    console.error('[Eagle Cropper] 无法获取图片URL,请检查页面结构');
                    alert('无法获取图片URL\n请在控制台查看详细信息');
                    // 输出调试信息
                    console.log('[Eagle Cropper] 调试信息:');
                    console.log('- Fancybox容器:', document.querySelector('.fancybox__container'));
                    console.log('- 所有图片:', document.querySelectorAll('.fancybox__container img'));
                    return;
                }

                console.log('[Eagle Cropper] 最终图片URL:', imageUrl);

                // 获取 Fancybox 容器
                const fancyboxContainer = document.querySelector('.fancybox__container');
                if (!fancyboxContainer) {
                    alert('未找到 Fancybox 容器');
                    return;
                }

                openCropperUI(imageUrl, fancyboxContainer);
            });

            toolbar.appendChild(button);
            console.log('[Eagle Cropper] 按钮已添加');
        }
    }

    // ==================== 监听 DOM ====================
    const observer = new MutationObserver(() => {
        const hasFancybox = document.querySelector('.fancybox__container, .f-carousel__toolbar');
        const hasButton = document.querySelector('.eagle-crop-button');

        if (hasFancybox && !hasButton) {
            setTimeout(addCropButton, 100);
            setTimeout(addCropButton, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(addCropButton, 1000);
    console.log('[Eagle Cropper] 监听器已启动');

    // 注册菜单命令
    GM_registerMenuCommand('Eagle Cropper 设置', openSettings);

})();
