// ==UserScript==
// @name         Gloss - 智能词汇标注
// @namespace    https://github.com/yunpiao/gloss
// @version      9.0
// @description  AI 驱动的网页词汇标注工具。支持中英互译、词汇本管理、已掌握词跳过、缓存、黑名单、导入导出
// @author       yunpiao
// @homepage     https://github.com/yunpiao/gloss
// @supportURL   https://github.com/yunpiao/gloss/issues
// @license      MIT
// @match        *://*/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557609/Gloss%20-%20%E6%99%BA%E8%83%BD%E8%AF%8D%E6%B1%87%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557609/Gloss%20-%20%E6%99%BA%E8%83%BD%E8%AF%8D%E6%B1%87%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置管理 ====================
    const config = {
        get url() { return GM_getValue('gloss_url', 'https://api.openai.com/v1/chat/completions'); },
        set url(v) { GM_setValue('gloss_url', v); },
        get key() { return GM_getValue('gloss_key', ''); },
        set key(v) { GM_setValue('gloss_key', v); },
        get model() { return GM_getValue('gloss_model', 'gpt-4o-mini'); },
        set model(v) { GM_setValue('gloss_model', v); },
        get wordCount() { return GM_getValue('gloss_word_count', 30); },
        set wordCount(v) { GM_setValue('gloss_word_count', v); },
        get showByDefault() { return GM_getValue('gloss_show_default', false); },
        set showByDefault(v) { GM_setValue('gloss_show_default', v); },
        get autoAnnotateZh() { return GM_getValue('gloss_auto_zh', false); },
        set autoAnnotateZh(v) { GM_setValue('gloss_auto_zh', v); },
        get autoAnnotateEn() { return GM_getValue('gloss_auto_en', false); },
        set autoAnnotateEn(v) { GM_setValue('gloss_auto_en', v); },
        get showBar() { return GM_getValue('gloss_show_bar', true); },
        set showBar(v) { GM_setValue('gloss_show_bar', v); },
        get blacklist() { return GM_getValue('gloss_blacklist', ''); },
        set blacklist(v) { GM_setValue('gloss_blacklist', v); },
        get minWordCount() { return GM_getValue('gloss_min_words', 50); },
        set minWordCount(v) { GM_setValue('gloss_min_words', v); }
    };

    // ==================== 词汇本管理 ====================
    // 获取全局词汇本 { word: { translation, mastered, addedAt, source } }
    function getVocabulary() {
        return GM_getValue('gloss_vocabulary', {});
    }

    function saveVocabulary(vocab) {
        GM_setValue('gloss_vocabulary', vocab);
    }

    // 添加词汇到词汇本
    function addToVocabulary(word, translation, source = location.hostname) {
        const vocab = getVocabulary();
        const key = word.toLowerCase();
        if (!vocab[key]) {
            vocab[key] = {
                word: word,
                translation: translation,
                mastered: false,
                addedAt: Date.now(),
                source: source
            };
            saveVocabulary(vocab);
        }
    }

    // 批量添加词汇
    function addDictToVocabulary(dict) {
        const vocab = getVocabulary();
        const source = location.hostname;
        Object.entries(dict).forEach(([word, translation]) => {
            const key = word.toLowerCase();
            if (!vocab[key]) {
                vocab[key] = {
                    word: word,
                    translation: translation,
                    mastered: false,
                    addedAt: Date.now(),
                    source: source
                };
            }
        });
        saveVocabulary(vocab);
    }

    // 标记词汇为已掌握/未掌握
    function toggleMastered(word) {
        const vocab = getVocabulary();
        const key = word.toLowerCase();
        if (vocab[key]) {
            vocab[key].mastered = !vocab[key].mastered;
            saveVocabulary(vocab);
        }
        return vocab[key]?.mastered;
    }

    // 获取已掌握的词汇列表
    function getMasteredWords() {
        const vocab = getVocabulary();
        return Object.values(vocab).filter(v => v.mastered).map(v => v.word.toLowerCase());
    }

    // 分词并统计词汇数量
    function countWords(text) {
        // 使用 Intl.Segmenter 进行分词（支持中英文）
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            try {
                // 检测语言来选择分词器
                const zhSegmenter = new Intl.Segmenter('zh', { granularity: 'word' });
                const segments = [...zhSegmenter.segment(text)];
                // 过滤掉空白和标点
                return segments.filter(s => s.segment.trim() && /[\u4e00-\u9fff\w]/.test(s.segment)).length;
            } catch (e) {
                console.warn('Intl.Segmenter 分词失败，回退到简单统计:', e);
            }
        }
        // 回退方案：中文按字算，英文按空格分割
        const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
        const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
        return chineseChars + englishWords;
    }

    function isHostBlacklisted() {
        const list = config.blacklist.split('\n').map(s => s.trim().toLowerCase()).filter(Boolean);
        const host = location.hostname.toLowerCase();
        return list.some(pattern => {
            if (pattern.startsWith('*.')) {
                // 通配符匹配，如 *.example.com
                const suffix = pattern.slice(2);
                return host === suffix || host.endsWith('.' + suffix);
            }
            return host === pattern;
        });
    }

    // ==================== 样式注入 ====================
    GM_addStyle(`
        /* Ruby 标注样式 */
        ruby.gloss-term {
            ruby-position: over;
            cursor: help;
            border-bottom: 1px dashed #93c5fd;
            margin: 0 1px;
            padding: 0 2px;
            border-radius: 2px;
            transition: background-color 0.2s ease;
        }
        ruby.gloss-term:hover {
            background-color: rgba(37, 99, 235, 0.1);
        }

        ruby.gloss-term rt {
            font-size: 0.65em;
            color: #2563eb;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.2s ease;
            user-select: none;
            letter-spacing: 0.5px;
        }

        ruby.gloss-term:hover rt {
            opacity: 1 !important;
        }

        body.gloss-show-all ruby.gloss-term rt {
            opacity: 1;
        }

        /* 悬浮控制栏 */
        #gloss-bar {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            padding: 8px 14px;
            border-radius: 50px;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: all 0.3s ease;
            user-select: none;
        }
        #gloss-bar:hover {
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
            transform: translateY(-2px);
        }

        .gloss-logo {
            font-weight: 700;
            font-size: 14px;
            color: #1e40af;
            letter-spacing: -0.5px;
        }

        .gloss-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #cbd5e1;
            transition: all 0.3s ease;
        }
        .gloss-dot.idle { background: #cbd5e1; }
        .gloss-dot.processing {
            background: #f59e0b;
            animation: gloss-pulse 1s infinite;
        }
        .gloss-dot.success { background: #10b981; }
        .gloss-dot.error { background: #ef4444; }

        @keyframes gloss-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.2); }
        }

        .gloss-count {
            font-size: 12px;
            color: #64748b;
            min-width: 30px;
            text-align: center;
        }

        .gloss-btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .gloss-btn:hover { background: #1d4ed8; }
        .gloss-btn:disabled { background: #94a3b8; cursor: not-allowed; }
        .gloss-btn.secondary { background: #f1f5f9; color: #475569; }
        .gloss-btn.secondary:hover { background: #e2e8f0; }

        /* 下拉菜单 */
        .gloss-dropdown {
            position: relative;
            display: inline-block;
        }
        .gloss-dropdown-btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 6px 8px;
            border-radius: 0 20px 20px 0;
            font-size: 12px;
            cursor: pointer;
            margin-left: -4px;
            border-left: 1px solid rgba(255,255,255,0.3);
        }
        .gloss-dropdown-btn:hover { background: #1d4ed8; }
        .gloss-dropdown-menu {
            display: none;
            position: absolute;
            bottom: 100%;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 120px;
            margin-bottom: 6px;
            overflow: hidden;
        }
        .gloss-dropdown-menu.show { display: block; }
        .gloss-dropdown-item {
            display: block;
            width: 100%;
            padding: 10px 14px;
            border: none;
            background: none;
            text-align: left;
            font-size: 13px;
            cursor: pointer;
            color: #374151;
        }
        .gloss-dropdown-item:hover { background: #f3f4f6; }
        .gloss-main-btn { border-radius: 20px 0 0 20px; }
        .gloss-main-btn.solo { border-radius: 20px; }

        /* 设置弹窗 */
        #gloss-modal-overlay {
            position: fixed !important;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        #gloss-modal-overlay.visible {
            opacity: 1;
            visibility: visible;
        }

        #gloss-modal {
            position: fixed !important;
            top: 50%;
            left: 50%;
            background: white;
            border-radius: 16px;
            padding: 24px;
            width: 420px;
            max-width: 90vw;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transform: translate(-50%, -50%) scale(0.9);
            transition: transform 0.3s ease;
        }
        #gloss-modal-overlay.visible #gloss-modal { transform: translate(-50%, -50%) scale(1); }

        .gloss-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e2e8f0;
        }
        .gloss-modal-title { font-size: 20px; font-weight: 700; color: #1e293b; }
        .gloss-modal-close {
            background: none; border: none;
            font-size: 24px; color: #94a3b8;
            cursor: pointer; padding: 4px; line-height: 1;
        }
        .gloss-modal-close:hover { color: #475569; }

        .gloss-form-group { margin-bottom: 16px; }
        .gloss-form-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
            margin-bottom: 6px;
        }
        .gloss-form-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s ease;
            box-sizing: border-box;
        }
        .gloss-form-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .gloss-form-hint { font-size: 11px; color: #94a3b8; margin-top: 4px; }

        .gloss-checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }
        .gloss-checkbox { width: 18px; height: 18px; cursor: pointer; }
        .gloss-checkbox-label { font-size: 14px; color: #475569; cursor: pointer; }

        .gloss-modal-footer {
            display: flex;
            gap: 10px;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
        }
        .gloss-modal-footer .gloss-btn { flex: 1; padding: 10px 16px; }

        /* 词汇本表格样式 */
        .gloss-vocab-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        .gloss-vocab-table th,
        .gloss-vocab-table td {
            padding: 8px 10px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        .gloss-vocab-table th {
            background: #f8fafc;
            font-weight: 600;
            color: #475569;
            position: sticky;
            top: 0;
        }
        .gloss-vocab-table tr:hover { background: #f1f5f9; }
        .gloss-vocab-table .mastered { opacity: 0.5; text-decoration: line-through; }
        .gloss-vocab-btn {
            padding: 4px 8px;
            font-size: 11px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .gloss-vocab-btn.master { background: #10b981; color: white; }
        .gloss-vocab-btn.master.done { background: #94a3b8; }
        .gloss-vocab-btn.delete { background: #ef4444; color: white; margin-left: 4px; }
        .gloss-vocab-stats {
            display: flex;
            gap: 16px;
            margin-bottom: 12px;
            font-size: 13px;
            color: #64748b;
        }
        .gloss-vocab-filter {
            margin-bottom: 12px;
            display: flex;
            gap: 8px;
        }
        .gloss-vocab-filter select,
        .gloss-vocab-filter input {
            padding: 6px 10px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 13px;
        }
        .gloss-vocab-container {
            max-height: 400px;
            overflow-y: auto;
        }
    `);

    // ==================== 状态管理 ====================
    let state = { status: 'idle', wordCount: 0, dictionary: {}, isApplied: false, lang: 'en', forceRefresh: false };

    // ==================== UI 组件 ====================
    function createControlBar() {
        const bar = document.createElement('div');
        bar.id = 'gloss-bar';

        bar.innerHTML = `
            <span class="gloss-logo">Gloss</span>
            <span class="gloss-dot idle"></span>
            <span class="gloss-count">--</span>
            <button class="gloss-btn gloss-main-btn solo" id="gloss-start-btn">开始</button>
            <div class="gloss-dropdown" id="gloss-dropdown" style="display:none;">
                <button class="gloss-dropdown-btn" id="gloss-dropdown-toggle">▼</button>
                <div class="gloss-dropdown-menu" id="gloss-dropdown-menu">
                    <button class="gloss-dropdown-item" id="gloss-reanalyze">🔄 重新分析</button>
                </div>
            </div>
            <button class="gloss-btn secondary" id="gloss-settings-btn">⚙</button>
        `;

        const root = document.documentElement || document.body;
        root.appendChild(bar);
        document.getElementById('gloss-start-btn').addEventListener('click', handleMainBtnClick);
        document.getElementById('gloss-dropdown-toggle').addEventListener('click', toggleDropdown);
        document.getElementById('gloss-reanalyze').addEventListener('click', handleReanalyze);
        document.getElementById('gloss-settings-btn').addEventListener('click', showSettingsModal);
        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.gloss-dropdown')) {
                document.getElementById('gloss-dropdown-menu')?.classList.remove('show');
            }
        });
        return bar;
    }

    function handleMainBtnClick(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        if (state.isApplied) {
            // 已标注状态，点击还原
            clearAnnotations();
            updateBarStatus('idle');
            document.querySelector('#gloss-bar .gloss-count').textContent = '--';
        } else {
            // 未标注状态，点击开始
            handleStart(e);
        }
    }

    function toggleDropdown(e) {
        e.stopPropagation();
        document.getElementById('gloss-dropdown-menu')?.classList.toggle('show');
    }

    function handleReanalyze(e) {
        e.stopPropagation();
        document.getElementById('gloss-dropdown-menu')?.classList.remove('show');
        // 强制重新分析
        if (state.isApplied) clearAnnotations();
        state.forceRefresh = true; // 使用独立标志
        handleStart(e);
    }

    function updateBarStatus(status, count = null) {
        const dot = document.querySelector('#gloss-bar .gloss-dot');
        const countEl = document.querySelector('#gloss-bar .gloss-count');
        const btn = document.getElementById('gloss-start-btn');

        if (dot) {
            dot.className = 'gloss-dot ' + status;
        }
        if (countEl && count !== null) {
            countEl.textContent = count + ' 词';
        }

        if (!btn) return;

        const dropdown = document.getElementById('gloss-dropdown');
        
        switch(status) {
            case 'processing':
                btn.textContent = '处理中...';
                btn.disabled = true;
                btn.classList.add('solo');
                if (dropdown) dropdown.style.display = 'none';
                break;
            case 'success':
                btn.textContent = '还原';
                btn.disabled = false;
                btn.classList.remove('solo');
                if (dropdown) dropdown.style.display = '';
                break;
            case 'error':
                btn.textContent = '重试';
                btn.disabled = false;
                btn.classList.add('solo');
                if (dropdown) dropdown.style.display = 'none';
                break;
            default:
                btn.textContent = '开始';
                btn.disabled = false;
                btn.classList.add('solo');
                if (dropdown) dropdown.style.display = 'none';
        }
    }

    function createSettingsModal() {
        const overlay = document.createElement('div');
        overlay.id = 'gloss-modal-overlay';

        overlay.innerHTML = `
            <div id="gloss-modal">
                <div class="gloss-modal-header">
                    <span class="gloss-modal-title">Gloss 设置</span>
                    <button class="gloss-modal-close" id="gloss-modal-close">×</button>
                </div>

                <div class="gloss-form-group">
                    <label class="gloss-form-label">API 地址</label>
                    <input type="text" class="gloss-form-input" id="gloss-input-url"
                           placeholder="https://api.openai.com/v1/chat/completions">
                    <div class="gloss-form-hint">支持 OpenAI 兼容的 API 端点</div>
                </div>

                <div class="gloss-form-group">
                    <label class="gloss-form-label">API Key</label>
                    <input type="password" class="gloss-form-input" id="gloss-input-key" placeholder="sk-...">
                </div>

                <div class="gloss-form-group">
                    <label class="gloss-form-label">模型名称</label>
                    <input type="text" class="gloss-form-input" id="gloss-input-model" placeholder="gpt-4o-mini">
                    <div class="gloss-form-hint">推荐: gpt-4o-mini (便宜快速) 或 gpt-4o (更准确)</div>
                </div>

                <div class="gloss-form-group">
                    <label class="gloss-form-label">提取词汇数量</label>
                    <input type="number" class="gloss-form-input" id="gloss-input-count" min="10" max="100" placeholder="30">
                    <div class="gloss-form-hint">建议 20-50 个，太多会影响阅读体验</div>
                </div>

                <div class="gloss-form-group">
                    <label class="gloss-form-label">最少词汇数</label>
                    <input type="number" class="gloss-form-input" id="gloss-input-min-words" min="10" max="500" placeholder="50">
                    <div class="gloss-form-hint">页面词汇少于此数量时不自动标注（使用分词统计）</div>
                </div>

                <div class="gloss-checkbox-group">
                    <input type="checkbox" class="gloss-checkbox" id="gloss-input-show">
                    <label class="gloss-checkbox-label" for="gloss-input-show">默认显示翻译 (不勾选则需悬停查看)</label>
                </div>

                <div class="gloss-checkbox-group">
                    <input type="checkbox" class="gloss-checkbox" id="gloss-input-auto-zh">
                    <label class="gloss-checkbox-label" for="gloss-input-auto-zh">中文页面自动注解</label>
                </div>

                <div class="gloss-checkbox-group">
                    <input type="checkbox" class="gloss-checkbox" id="gloss-input-auto-en">
                    <label class="gloss-checkbox-label" for="gloss-input-auto-en">英文页面自动注解</label>
                </div>

                <div class="gloss-checkbox-group">
                    <input type="checkbox" class="gloss-checkbox" id="gloss-input-show-bar">
                    <label class="gloss-checkbox-label" for="gloss-input-show-bar">显示悬浮控制条</label>
                </div>

                <div class="gloss-form-group">
                    <label class="gloss-form-label">网站黑名单</label>
                    <textarea class="gloss-form-input" id="gloss-input-blacklist" rows="3" style="resize: vertical;" placeholder="example.com&#10;*.google.com"></textarea>
                    <div class="gloss-form-hint">每行一个域名，支持 *.example.com 通配符。黑名单内网站不会自动标注</div>
                    <button class="gloss-btn secondary" id="gloss-add-to-blacklist" style="width: 100%; margin-top: 6px;">🚫 将当前网站加入黑名单</button>
                </div>

                <div class="gloss-form-group" style="margin-top: 8px;">
                    <button class="gloss-btn secondary" id="gloss-clear-cache" style="width: 100%;">🗑️ 清除当前页缓存</button>
                    <div class="gloss-form-hint">清除后下次将重新请求 API</div>
                </div>

                <div class="gloss-form-group" style="margin-top: 8px;">
                    <button class="gloss-btn" id="gloss-open-vocab" style="width: 100%;">📖 打开词汇本</button>
                    <div class="gloss-form-hint">查看所有学过的词汇，标记已掌握</div>
                </div>

                <div class="gloss-modal-footer">
                    <button class="gloss-btn secondary" id="gloss-modal-cancel">取消</button>
                    <button class="gloss-btn" id="gloss-modal-save">保存设置</button>
                </div>
            </div>
        `;

        const root = document.documentElement || document.body;
        root.appendChild(overlay);
        document.getElementById('gloss-modal-close').addEventListener('click', hideSettingsModal);
        document.getElementById('gloss-modal-cancel').addEventListener('click', hideSettingsModal);
        document.getElementById('gloss-modal-save').addEventListener('click', saveSettings);
        document.getElementById('gloss-clear-cache').addEventListener('click', clearCurrentPageCache);
        document.getElementById('gloss-add-to-blacklist').addEventListener('click', addCurrentHostToBlacklist);
        document.getElementById('gloss-open-vocab').addEventListener('click', () => { hideSettingsModal(); showVocabularyModal(); });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) hideSettingsModal(); });
        return overlay;
    }

    // ==================== 词汇本弹窗 ====================
    function createVocabularyModal() {
        const overlay = document.createElement('div');
        overlay.id = 'gloss-vocab-overlay';
        overlay.className = 'gloss-modal-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:2147483647;display:flex;align-items:center;justify-content:center;';

        overlay.innerHTML = `
            <div id="gloss-vocab-modal" style="background:white;border-radius:16px;padding:24px;width:700px;max-width:95vw;max-height:85vh;overflow:hidden;display:flex;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                <div class="gloss-modal-header">
                    <span class="gloss-modal-title">📖 词汇本</span>
                    <button class="gloss-modal-close" id="gloss-vocab-close">×</button>
                </div>
                <div class="gloss-vocab-stats" id="gloss-vocab-stats"></div>
                <div class="gloss-vocab-filter">
                    <select id="gloss-vocab-filter-status">
                        <option value="all">全部</option>
                        <option value="learning">学习中</option>
                        <option value="mastered">已掌握</option>
                    </select>
                    <input type="text" id="gloss-vocab-search" placeholder="搜索词汇..." style="flex:1;">
                    <button class="gloss-btn secondary" id="gloss-vocab-export" style="padding:6px 12px;font-size:12px;">📤 导出</button>
                    <button class="gloss-btn secondary" id="gloss-vocab-import" style="padding:6px 12px;font-size:12px;">📥 导入</button>
                    <button class="gloss-btn secondary" id="gloss-vocab-clear" style="padding:6px 12px;font-size:12px;color:#ef4444;">🗑️ 清空</button>
                </div>
                <div class="gloss-vocab-container" id="gloss-vocab-container">
                    <table class="gloss-vocab-table">
                        <thead><tr><th>词汇</th><th>翻译</th><th>来源</th><th>操作</th></tr></thead>
                        <tbody id="gloss-vocab-tbody"></tbody>
                    </table>
                </div>
            </div>
        `;

        const root = document.documentElement || document.body;
        root.appendChild(overlay);
        document.getElementById('gloss-vocab-close').addEventListener('click', hideVocabularyModal);
        document.getElementById('gloss-vocab-filter-status').addEventListener('change', renderVocabularyTable);
        document.getElementById('gloss-vocab-search').addEventListener('input', renderVocabularyTable);
        document.getElementById('gloss-vocab-tbody').addEventListener('click', handleVocabTableClick);
        document.getElementById('gloss-vocab-export').addEventListener('click', exportVocabulary);
        document.getElementById('gloss-vocab-import').addEventListener('click', importVocabulary);
        document.getElementById('gloss-vocab-clear').addEventListener('click', clearVocabulary);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) hideVocabularyModal(); });
        return overlay;
    }

    // 清空词汇本
    function clearVocabulary() {
        const vocab = getVocabulary();
        const count = Object.keys(vocab).length;
        if (count === 0) {
            alert('词汇本已经是空的');
            return;
        }
        if (!confirm(`确定要清空全部 ${count} 个词汇吗？此操作不可撤销！`)) return;
        saveVocabulary({});
        renderVocabularyTable();
        if (state.isApplied) {
            clearAnnotations();
            updateBarStatus('idle');
        }
    }

    // 导出词汇本为 CSV 文件 (Excel 可直接打开)
    function exportVocabulary() {
        const vocab = getVocabulary();
        const entries = Object.values(vocab);
        
        // CSV 头部
        const headers = ['词汇', '翻译', '已掌握', '来源', '添加时间'];
        const rows = [headers.join(',')];
        
        // CSV 内容
        entries.forEach(v => {
            const row = [
                `"${(v.word || '').replace(/"/g, '""')}"`,
                `"${(v.translation || '').replace(/"/g, '""')}"`,
                v.mastered ? '是' : '否',
                `"${(v.source || '').replace(/"/g, '""')}"`,
                `"${new Date(v.addedAt || Date.now()).toLocaleString('zh-CN')}"`
            ];
            rows.push(row.join(','));
        });
        
        // 添加 BOM 以支持中文
        const bom = '\uFEFF';
        const csv = bom + rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gloss-vocabulary-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 导入词汇本 (支持 CSV)
    function importVocabulary() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const text = ev.target.result;
                    const lines = text.split('\n').filter(line => line.trim());
                    if (lines.length < 2) throw new Error('文件为空或格式错误');
                    
                    // 跳过表头
                    const vocab = getVocabulary();
                    let added = 0, updated = 0;
                    
                    for (let i = 1; i < lines.length; i++) {
                        const cols = parseCSVLine(lines[i]);
                        if (cols.length < 2) continue;
                        
                        const word = cols[0].trim();
                        const translation = cols[1].trim();
                        const mastered = cols[2] === '是' || cols[2] === 'true' || cols[2] === '1';
                        const source = cols[3]?.trim() || 'imported';
                        
                        if (!word) continue;
                        
                        const key = word.toLowerCase();
                        if (vocab[key]) {
                            vocab[key].translation = translation;
                            vocab[key].mastered = mastered;
                            updated++;
                        } else {
                            vocab[key] = {
                                word: word,
                                translation: translation,
                                mastered: mastered,
                                addedAt: Date.now(),
                                source: source
                            };
                            added++;
                        }
                    }
                    
                    saveVocabulary(vocab);
                    renderVocabularyTable();
                    alert(`导入成功！新增 ${added} 个，更新 ${updated} 个`);
                } catch (err) {
                    alert('导入失败：' + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // 解析 CSV 行（处理引号内的逗号）
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    function showVocabularyModal() {
        let overlay = document.getElementById('gloss-vocab-overlay');
        if (!overlay) overlay = createVocabularyModal();
        overlay.style.display = 'flex';
        renderVocabularyTable();
    }

    function hideVocabularyModal() {
        const overlay = document.getElementById('gloss-vocab-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    function renderVocabularyTable() {
        const vocab = getVocabulary();
        const entries = Object.values(vocab);
        const filter = document.getElementById('gloss-vocab-filter-status')?.value || 'all';
        const search = (document.getElementById('gloss-vocab-search')?.value || '').toLowerCase();

        // 统计
        const total = entries.length;
        const mastered = entries.filter(v => v.mastered).length;
        const learning = total - mastered;
        document.getElementById('gloss-vocab-stats').innerHTML = 
            `<span>总计: <b>${total}</b></span><span>学习中: <b>${learning}</b></span><span>已掌握: <b>${mastered}</b></span>`;

        // 过滤
        let filtered = entries;
        if (filter === 'learning') filtered = filtered.filter(v => !v.mastered);
        if (filter === 'mastered') filtered = filtered.filter(v => v.mastered);
        if (search) filtered = filtered.filter(v => 
            v.word.toLowerCase().includes(search) || v.translation.toLowerCase().includes(search)
        );

        // 排序：最新添加的在前
        filtered.sort((a, b) => b.addedAt - a.addedAt);

        // 渲染
        const tbody = document.getElementById('gloss-vocab-tbody');
        if (!tbody) return;
        tbody.innerHTML = filtered.map(v => `
            <tr class="${v.mastered ? 'mastered' : ''}" data-word="${v.word}">
                <td><b>${v.word}</b></td>
                <td>${v.translation}</td>
                <td style="color:#94a3b8;font-size:11px;">${v.source || '-'}</td>
                <td>
                    <button class="gloss-vocab-btn master ${v.mastered ? 'done' : ''}" data-action="master" data-word="${v.word}">
                        ${v.mastered ? '取消' : '✓ 掌握'}
                    </button>
                    <button class="gloss-vocab-btn delete" data-action="delete" data-word="${v.word}">删除</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:20px;">暂无词汇</td></tr>';
    }

    // 使用事件委托处理词汇本按钮点击
    function handleVocabTableClick(e) {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        
        const action = btn.dataset.action;
        const word = btn.dataset.word;
        
        if (action === 'master') {
            toggleMastered(word);
            renderVocabularyTable();
            if (state.isApplied) {
                clearAnnotations();
                applyDictionaryToPage(state.dictionary, state.lang);
                state.isApplied = true;
            }
        } else if (action === 'delete') {
            if (!confirm(`确定删除词汇 "${word}"？`)) return;
            const vocab = getVocabulary();
            delete vocab[word.toLowerCase()];
            saveVocabulary(vocab);
            renderVocabularyTable();
            if (state.isApplied) {
                clearAnnotations();
                applyDictionaryToPage(state.dictionary, state.lang);
                state.isApplied = true;
            }
        }
    }

    function addCurrentHostToBlacklist() {
        const host = location.hostname;
        const textarea = document.getElementById('gloss-input-blacklist');
        const currentList = textarea.value.trim();
        
        // 检查是否已在黑名单中
        const hosts = currentList.split('\n').map(s => s.trim().toLowerCase()).filter(Boolean);
        if (hosts.includes(host.toLowerCase())) {
            alert('当前网站已在黑名单中');
            return;
        }
        
        // 添加到黑名单
        textarea.value = currentList ? currentList + '\n' + host : host;
        
        // 立即保存
        config.blacklist = textarea.value;
        
        // 清除当前页注解
        clearAnnotations();
        updateBarStatus('idle');
        const countEl = document.querySelector('#gloss-bar .gloss-count');
        if (countEl) countEl.textContent = '--';
        
        alert(`已将 ${host} 加入黑名单`);
    }

    function showSettingsModal() {
        let overlay = document.getElementById('gloss-modal-overlay');
        if (!overlay) overlay = createSettingsModal();

        document.getElementById('gloss-input-url').value = config.url;
        document.getElementById('gloss-input-key').value = config.key;
        document.getElementById('gloss-input-model').value = config.model;
        document.getElementById('gloss-input-count').value = config.wordCount;
        document.getElementById('gloss-input-show').checked = config.showByDefault;
        document.getElementById('gloss-input-auto-zh').checked = config.autoAnnotateZh;
        document.getElementById('gloss-input-auto-en').checked = config.autoAnnotateEn;
        document.getElementById('gloss-input-show-bar').checked = config.showBar;
        document.getElementById('gloss-input-blacklist').value = config.blacklist;
        document.getElementById('gloss-input-min-words').value = config.minWordCount;
        overlay.classList.add('visible');
    }

    function hideSettingsModal() {
        const overlay = document.getElementById('gloss-modal-overlay');
        if (overlay) overlay.classList.remove('visible');
    }

    function saveSettings() {
        config.url = document.getElementById('gloss-input-url').value.trim();
        config.key = document.getElementById('gloss-input-key').value.trim();
        config.model = document.getElementById('gloss-input-model').value.trim();
        config.wordCount = parseInt(document.getElementById('gloss-input-count').value) || 30;
        config.minWordCount = parseInt(document.getElementById('gloss-input-min-words').value) || 50;
        config.showByDefault = document.getElementById('gloss-input-show').checked;
        config.autoAnnotateZh = document.getElementById('gloss-input-auto-zh').checked;
        config.autoAnnotateEn = document.getElementById('gloss-input-auto-en').checked;
        config.showBar = document.getElementById('gloss-input-show-bar').checked;
        config.blacklist = document.getElementById('gloss-input-blacklist').value;

        document.body.classList.toggle('gloss-show-all', config.showByDefault);
        let bar = document.getElementById('gloss-bar');
        if (config.showBar) {
            if (!bar) {
                bar = createControlBar();
            }
            if (bar) {
                bar.style.display = '';
                bar.classList.toggle('disabled', !config.enabled);
            }
        } else if (bar) {
            bar.style.display = 'none';
        }
        hideSettingsModal();
    }

    function clearCurrentPageCache() {
        const text = extractPageText();
        const lang = detectLanguage(text) === 'zh' ? 'zh' : 'en';
        const cacheKey = getDictionaryCacheKey(lang);
        try {
            GM_setValue(cacheKey, null);
            // 同时清除注解
            clearAnnotations();
            updateBarStatus('idle');
            document.querySelector('#gloss-bar .gloss-count').textContent = '--';
            alert('已清除当前页缓存');
        } catch (e) {
            alert('清除缓存失败: ' + e.message);
        }
    }

    // ==================== 核心功能 ====================
    function extractPageText() {
        const selectors = ['article', 'main', '.content', '.post-content', '.article-content', '.entry-content', '#content', '.markdown-body', '.prose'];
        let container = null;
        for (const selector of selectors) {
            container = document.querySelector(selector);
            if (container && container.textContent.trim().length > 200) break;
        }
        if (!container) container = document.body;

        const clone = container.cloneNode(true);
        clone.querySelectorAll('script, style, nav, header, footer, aside, .sidebar, .comments, .ad, [role="navigation"]').forEach(el => el.remove());
        return clone.textContent.replace(/\s+/g, ' ').trim().slice(0, 4000);
    }

    function detectLanguage(text) {
        const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
        if (htmlLang.includes('zh')) return 'zh';
        if (htmlLang.includes('en')) return 'en';

        const metaLangEl = document.querySelector('meta[http-equiv="Content-Language"], meta[name="language"], meta[name="lang"], meta[property="og:locale"]');
        if (metaLangEl && metaLangEl.content) {
            const metaLang = metaLangEl.content.toLowerCase();
            if (metaLang.includes('zh')) return 'zh';
            if (metaLang.includes('en')) return 'en';
        }

        const chineseMatches = text.match(/[\u4e00-\u9fff]/g) || [];
        const latinMatches = text.match(/[A-Za-z]/g) || [];
        const chineseCount = chineseMatches.length;
        const latinCount = latinMatches.length;
        if (chineseCount === 0 && latinCount === 0) return 'unknown';

        const total = chineseCount + latinCount;
        const chineseRatio = chineseCount / total;

        if (chineseRatio >= 0.35) return 'zh';
        if (chineseRatio <= 0.15) return 'en';

        const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if (navLang.startsWith('zh')) return 'zh';
        if (navLang.startsWith('en')) return 'en';

        return chineseCount >= latinCount ? 'zh' : 'en';
    }

    // ==================== 缓存管理 ====================
    function getDictionaryCacheKey(lang) {
        const path = location.hostname + location.pathname;
        return 'gloss_dict_' + lang + '_' + path + '_' + config.wordCount + '_' + config.model;
    }

    // ==================== JSON 解析（带容错）====================
    function parseDictionaryFromResponse(responseText) {
        const data = JSON.parse(responseText);
        let content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;

        if (typeof content === 'object' && content !== null) {
            return content.result || content.data || content.words || content;
        }

        if (typeof content !== 'string') {
            throw new Error('响应格式不正确');
        }

        let dict;
        try {
            dict = JSON.parse(content);
        } catch (parseError) {
            // 清理 markdown 代码块
            const cleaned = content
                .replace(/^\s*```(?:json)?\s*\n?/i, '')
                .replace(/\s*```\s*$/i, '')
                .trim();

            let jsonText = cleaned;
            const firstBrace = jsonText.indexOf('{');
            const lastBrace = jsonText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace > firstBrace) {
                jsonText = jsonText.slice(firstBrace, lastBrace + 1);
            }

            dict = JSON.parse(jsonText);
        }

        return dict.result || dict.data || dict.words || dict;
    }

    function fetchDictionary(text, lang, maxRetries = 3) {
        return new Promise((resolve, reject) => {
            if (!config.key) { reject(new Error('请先配置 API Key')); return; }

            const isChinese = lang === 'zh';
            
            // 获取已掌握词汇，让 AI 排除
            const masteredWords = getMasteredWords();
            const masteredHint = masteredWords.length > 0 
                ? `\n\nIMPORTANT: The user has already mastered these words, DO NOT include them:\n${masteredWords.slice(0, 100).join(', ')}`
                : '';

            const prompt = isChinese
                ? `You are a language learning assistant helping Chinese users learn English. Analyze the following Chinese text and identify ${config.wordCount} Chinese words or phrases that would be useful for learning their English equivalents.

CRITICAL RULES:
- ONLY extract Chinese words (words composed entirely of Chinese characters 汉字)
- DO NOT extract any English words, numbers, or punctuation that appear in the text
- DO NOT extract brand names, product names, or technical terms written in English/Latin letters
- Each key in the output MUST be pure Chinese characters only

Requirements:
1. Return a JSON object where keys are Chinese words/phrases (汉字 only, no English/numbers)
2. Values are concise English translations (1-4 words maximum)
3. Skip very common function words and particles (的、是、在、了、etc.)
4. Focus on: academic words, domain-specific terms, idioms, set phrases
5. Prioritize words that appear multiple times or are central to the text meaning

IMPORTANT: Return ONLY raw JSON. Do NOT wrap in markdown code blocks. Do NOT add any explanation or text before/after the JSON.

Output format:
{"中文词1": "english1", "中文词2": "english2", ...}

Text to analyze:
"""
${text}
"""${masteredHint}`
                : `You are a language learning assistant. Analyze the following English text and identify ${config.wordCount} difficult or important vocabulary words that a Chinese learner might not know.

Requirements:
1. Return a JSON object where keys are English words (lowercase, base form/stem)
2. Values are concise Chinese translations (2-4 characters maximum)
3. Skip very common words (the, is, are, have, etc.)
4. Focus on: academic words, domain-specific terms, idioms, phrasal verbs
5. Prioritize words that appear multiple times or are central to the text meaning

IMPORTANT: Return ONLY raw JSON. Do NOT wrap in markdown code blocks. Do NOT add any explanation or text before/after the JSON.

Output format:
{"word1": "翻译1", "word2": "翻译2", ...}

Text to analyze:
"""
${text}
"""${masteredHint}`;

            const requestData = JSON.stringify({
                model: config.model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1,
                response_format: { type: "json_object" }
            });

            const attemptRequest = (attempt) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: config.url,
                    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + config.key },
                    data: requestData,
                    timeout: 30000,  // 30秒超时
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                const dict = parseDictionaryFromResponse(response.responseText);
                                resolve(dict);
                            } catch (e) {
                                console.warn(`Gloss 解析失败 (尝试 ${attempt + 1}/${maxRetries}):`, e.message);
                                if (attempt < maxRetries - 1) {
                                    const delay = 500 * Math.pow(2, attempt);
                                    setTimeout(() => attemptRequest(attempt + 1), delay);
                                } else {
                                    reject(new Error('解析响应失败: ' + e.message));
                                }
                            }
                        } else if (response.status >= 400 && response.status < 500) {
                            // 4xx 客户端错误不重试（如 401 认证失败、403 权限不足）
                            const errorMsg = response.status === 401 ? 'API Key 无效或已过期'
                                : response.status === 403 ? '无权限访问该 API'
                                : response.status === 429 ? 'API 请求过于频繁，请稍后再试'
                                : `客户端错误: ${response.status}`;
                            reject(new Error(errorMsg));
                        } else {
                            // 5xx 服务端错误可重试
                            console.warn(`Gloss API 错误 (尝试 ${attempt + 1}/${maxRetries}): ${response.status}`);
                            if (attempt < maxRetries - 1) {
                                const delay = 500 * Math.pow(2, attempt);
                                setTimeout(() => attemptRequest(attempt + 1), delay);
                            } else {
                                reject(new Error('API 请求失败: ' + response.status));
                            }
                        }
                    },
                    onerror: () => {
                        console.warn(`Gloss 网络错误 (尝试 ${attempt + 1}/${maxRetries})`);
                        if (attempt < maxRetries - 1) {
                            const delay = 500 * Math.pow(2, attempt);
                            setTimeout(() => attemptRequest(attempt + 1), delay);
                        } else {
                            reject(new Error('网络错误'));
                        }
                    },
                    ontimeout: () => {
                        console.warn(`Gloss 请求超时 (尝试 ${attempt + 1}/${maxRetries})`);
                        if (attempt < maxRetries - 1) {
                            const delay = 500 * Math.pow(2, attempt);
                            setTimeout(() => attemptRequest(attempt + 1), delay);
                        } else {
                            reject(new Error('请求超时，请检查网络或稍后重试'));
                        }
                    }
                });
            };

            attemptRequest(0);
        });
    }

    function applyDictionaryToPage(dict, lang) {
        // 过滤掉已掌握的词汇
        const masteredWords = getMasteredWords();
        const filteredDict = {};
        Object.entries(dict).forEach(([word, translation]) => {
            if (!masteredWords.includes(word.toLowerCase())) {
                filteredDict[word] = translation;
            }
        });
        
        const words = Object.keys(filteredDict);
        if (words.length === 0) return 0;

        const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'));
        const patternStr = escapedWords.join('|');
        const isChinesePage = lang === 'zh';
        const regex = isChinesePage
            ? new RegExp(`(${patternStr})`, 'g')
            : new RegExp(`\\b(${patternStr})\\b`, 'gi');

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                const parent = node.parentNode;
                if (!parent) return NodeFilter.FILTER_REJECT;
                const tag = parent.tagName;
                if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'RUBY', 'RT', 'RP', 'CODE', 'PRE', 'KBD', 'SAMP'].includes(tag)) return NodeFilter.FILTER_REJECT;
                if (parent.classList && parent.classList.contains('gloss-term')) return NodeFilter.FILTER_REJECT;
                if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const nodesToProcess = [];
        while (walker.nextNode()) nodesToProcess.push(walker.currentNode);

        let replacedCount = 0;
        const replacedWords = new Set();

        nodesToProcess.forEach(node => {
            const text = node.nodeValue;
            if (!text || !regex.test(text)) return;
            regex.lastIndex = 0;

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let match;
            let hasReplacement = false;

            while ((match = regex.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                }

                const originalWord = match[0];
                const isChinesePage = lang === 'zh';
                const key = isChinesePage ? originalWord : originalWord.toLowerCase();

                let translation = filteredDict[key];
                if (!translation && !isChinesePage) {
                    const foundKey = Object.keys(filteredDict).find(k => k.toLowerCase() === key);
                    if (foundKey) translation = filteredDict[foundKey];
                }

                if (translation) {
                    const ruby = document.createElement('ruby');
                    ruby.className = 'gloss-term';
                    ruby.textContent = originalWord;
                    const rt = document.createElement('rt');
                    rt.textContent = translation;
                    ruby.appendChild(rt);
                    fragment.appendChild(ruby);
                    hasReplacement = true;
                    if (!replacedWords.has(key)) { replacedWords.add(key); replacedCount++; }
                } else {
                    fragment.appendChild(document.createTextNode(originalWord));
                }
                lastIndex = regex.lastIndex;
            }

            if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            if (hasReplacement && node.parentNode) node.parentNode.replaceChild(fragment, node);
        });

        return replacedCount;
    }

    function clearAnnotations() {
        document.querySelectorAll('ruby.gloss-term').forEach(ruby => {
            const text = ruby.childNodes[0].textContent;
            ruby.replaceWith(document.createTextNode(text));
        });
        state.isApplied = false;
    }

    async function handleStart(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!config.key) { showSettingsModal(); return; }
        if (state.isApplied) clearAnnotations();

        updateBarStatus('processing');

        try {
            const text = extractPageText();
            if (countWords(text) < config.minWordCount) throw new Error('页面词汇太少');

            const detectedLang = detectLanguage(text) === 'zh' ? 'zh' : 'en';
            state.lang = detectedLang;

            const cacheKey = getDictionaryCacheKey(detectedLang);
            const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;  // 7 天过期
            let cachedData = null;
            let cachedDict = null;
            try {
                cachedData = GM_getValue(cacheKey, null);
                // 兼容旧格式（直接存 dict）和新格式（{ dict, timestamp }）
                if (cachedData && typeof cachedData === 'object') {
                    if (cachedData.dict && cachedData.timestamp) {
                        // 新格式：检查是否过期
                        const isExpired = Date.now() - cachedData.timestamp > CACHE_EXPIRY_MS;
                        if (!isExpired) {
                            cachedDict = cachedData.dict;
                        }
                    } else {
                        // 旧格式：直接当作 dict 使用
                        cachedDict = cachedData;
                    }
                }
            } catch (e2) {
                console.warn('Gloss 缓存读取失败:', e2);
            }

            let dict;
            if (!cachedDict || typeof cachedDict !== 'object') {
                // 无缓存或已过期，直接请求
                dict = await fetchDictionary(text, detectedLang);
            } else if (state.forceRefresh) {
                // 用户点击"重新分析"，获取新词并合并旧词
                state.forceRefresh = false; // 重置标志
                const newDict = await fetchDictionary(text, detectedLang);
                dict = { ...cachedDict, ...newDict };  // 新词覆盖，旧词保留
            } else {
                // 首次加载，使用缓存
                dict = cachedDict;
            }

            state.dictionary = dict;
            
            // 将词汇添加到全局词汇本
            addDictToVocabulary(dict);
            
            try {
                GM_setValue(cacheKey, { dict, timestamp: Date.now() });
            } catch (e3) {
                console.warn('Gloss 缓存写入失败:', e3);
            }

            const count = applyDictionaryToPage(dict, detectedLang);
            state.wordCount = count;
            state.isApplied = true;

            if (config.showByDefault) document.body.classList.add('gloss-show-all');
            updateBarStatus('success', count);
        } catch (error) {
            console.error('Gloss Error:', error);
            updateBarStatus('error');
            alert('Gloss 错误: ' + error.message);
        }
    }

    // ==================== 初始化 ====================
    function autoStartIfNeeded() {
        if (!config.key || isHostBlacklisted()) return;
        try {
            const text = extractPageText();
            if (countWords(text) < config.minWordCount) return;
            const detectedLang = detectLanguage(text) === 'zh' ? 'zh' : 'en';
            const shouldAuto = (detectedLang === 'zh' && config.autoAnnotateZh) ||
                (detectedLang === 'en' && config.autoAnnotateEn);
            if (!shouldAuto) return;
            handleStart();
        } catch (e) {
            console.error('Gloss autoStart 错误:', e);
        }
    }

    function init() {
        // 如果在 iframe 中运行，跳过初始化，避免多个控制栏
        try {
            if (window.top !== window.self) return;
        } catch (e) {
            // 跨域 iframe 访问 window.top 会抛 SecurityError，直接跳过
            return;
        }

        if (config.showBar) {
            createControlBar();
        }
        GM_registerMenuCommand('Gloss 设置', showSettingsModal);
        GM_registerMenuCommand('开始分析', () => handleStart());
        if (config.showByDefault) document.body.classList.add('gloss-show-all');
        console.log('Gloss v8.0 已加载');
        autoStartIfNeeded();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();