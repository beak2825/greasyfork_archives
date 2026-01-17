// ==UserScript==
// @name         Chrome Native AI Translator (Public Edition)
// @namespace    http://tampermonkey.net/
// @version      3
// @description  内置 AI 实现光速翻译 (附带环境自检功能)
// @author       Peter h
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/563026/Chrome%20Native%20AI%20Translator%20%28Public%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563026/Chrome%20Native%20AI%20Translator%20%28Public%20Edition%29.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // --- 1. 常量定义 ---
    const LANG_MAP = {
        'en': { name: 'English', regex: /^[a-zA-Z\s.,?!'"\-()]+$/ },
        'zh': { name: '中文', regex: /[\u4e00-\u9fa5]/ },
        'ja': { name: '日本語', regex: /[\u3040-\u309f\u30a0-\u30ff]/ },
        'ko': { name: '한국어', regex: /[\uac00-\ud7af]/ },
        'ru': { name: 'Русский', regex: /[\u0400-\u04FF]/ },
        'es': { name: 'Español', regex: null },
        'fr': { name: 'Français', regex: null },
        'de': { name: 'Deutsch', regex: null }
    };

    // 缓存池 (Key: "en_zh")
    const translators = new Map();
    
    let icon, bar;
    let selectedText = "";

    // --- 2. 核心逻辑 ---

    // ★ 关键修复：每次翻译时实时读取配置，解决多标签页不同步
    function getCurrentConfig() {
        return {
            defaultTarget: GM_getValue('defaultTarget', 'zh'), // 默认目标
            secondTarget: GM_getValue('secondTarget', 'en')    // 备用目标
        };
    }

    function detectLanguage(text) {
        if (LANG_MAP['zh'].regex.test(text)) return 'zh';
        if (LANG_MAP['ja'].regex.test(text)) return 'ja';
        if (LANG_MAP['ko'].regex.test(text)) return 'ko';
        if (LANG_MAP['ru'].regex.test(text)) return 'ru';
        if (/[a-zA-Z]/.test(text)) return 'en';
        return 'auto';
    }

    // 获取翻译器 (带智能逻辑)
    async function getSmartTranslator(text) {
        const config = getCurrentConfig(); // 获取最新配置
        const detected = detectLanguage(text);
        
        let source = 'en';
        let target = config.defaultTarget;

        // 智能路由逻辑
        if (detected !== 'auto') {
            source = detected;
            // 如果原文就是目标语言（例如选中了中文），切换到备用语言
            if (source === config.defaultTarget) {
                target = config.secondTarget;
            }
        }

        // ★ 关键修复：防止 en->en 这种同语言翻译导致的报错
        if (source === target) {
            console.warn(`检测到同语言翻译 (${source}->${target})，强制切换为备用目标`);
            target = (source === 'zh') ? 'en' : 'zh';
        }

        // 更新 UI 下拉框状态
        updateSelects(source, target);

        const key = `${source}_${target}`;

        // 1. 尝试从缓存获取
        if (translators.has(key)) {
            return { translator: translators.get(key), source, target, key };
        }

        // 2. 创建新实例
        const api = window.Translator || (window.translation ? window.translation : null);
        if (!api) throw new Error("API 未开启");

        try {
            const translator = await api.create({
                sourceLanguage: source,
                targetLanguage: target
            });
            translators.set(key, translator);
            return { translator, source, target, key };
        } catch (e) {
            throw new Error(`无法创建翻译器 (${source}->${target}): ${e.message}`);
        }
    }

    // --- 3. UI 构建 ---
    GM_addStyle(`
        #ai-trans-icon {
            position: absolute; width: 30px; height: 30px; background: #fff;
            border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: pointer; z-index: 2147483647; display: none;
            align-items: center; justify-content: center; font-size: 16px; border: 1px solid #ddd;
        }
        #ai-trans-icon:hover { transform: scale(1.1); background: #f0f0f0; }
        
        #ai-trans-bar {
            position: absolute; display: none; z-index: 2147483647;
            background: #fff; border: 1px solid #ccc;
            border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,0.25);
            font-family: system-ui, -apple-system, sans-serif;
            width: 380px; animation: aiFadeIn 0.15s ease-out;
        }
        @keyframes aiFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        .ai-head { display: flex; justify-content: space-between; padding: 6px 10px; background: #f5f5f5; border-bottom: 1px solid #eee; border-radius: 8px 8px 0 0; }
        .ai-sel-group { display: flex; align-items: center; gap: 4px; }
        .ai-select { border: none; background: transparent; font-size: 12px; font-weight: bold; cursor: pointer; outline: none; max-width: 80px; }
        .ai-select:hover { background: #e0e0e0; border-radius: 4px; }
        
        .ai-btns { display: flex; gap: 8px; align-items: center; }
        .ai-btn { cursor: pointer; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #555; }
        .ai-btn:hover { background: #ddd; color: #000; }

        .ai-body { padding: 10px 12px; max-height: 200px; overflow-y: auto; font-size: 14px; line-height: 1.5; color: #222; }
        .ai-info { color: #888; font-style: italic; font-size: 13px; }
        .ai-err { color: #d32f2f; font-weight: 500; }
    `);

    function mk(tag, cls, txt) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (txt) el.innerText = txt;
        return el;
    }

    function createUI() {
        if (document.getElementById('ai-trans-icon')) return;

        icon = mk('div', '', '🌐');
        icon.id = 'ai-trans-icon';
        icon.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); runTranslation(); };
        document.body.appendChild(icon);

        bar = mk('div');
        bar.id = 'ai-trans-bar';
        bar.onmousedown = (e) => e.stopPropagation();

        const head = mk('div', 'ai-head');
        const selGroup = mk('div', 'ai-sel-group');
        
        const sSrc = mk('select', 'ai-select'); sSrc.id = 'ai-src'; sSrc.disabled = true;
        const sTgt = mk('select', 'ai-select'); sTgt.id = 'ai-tgt';
        
        for (let [k, v] of Object.entries(LANG_MAP)) {
            sSrc.add(new Option(v.name, k));
            sTgt.add(new Option(v.name, k));
        }
        
        // ★ 每次修改，立即保存配置
        sTgt.onchange = () => {
            GM_setValue('defaultTarget', sTgt.value);
            runTranslation();
        };

        selGroup.append(sSrc, mk('span', 'ai-arrow', '➔'), sTgt);

        const btns = mk('div', 'ai-btns');
        const bSpk = mk('span', 'ai-btn', '🔊'); bSpk.onclick = speakResult;
        const bCls = mk('span', 'ai-btn', '✕'); bCls.onclick = hideUI;
        btns.append(bSpk, bCls);

        head.append(selGroup, btns);
        const body = mk('div', 'ai-body');
        body.id = 'ai-content';
        bar.append(head, body);
        document.body.appendChild(bar);
    }

    function updateSelects(src, tgt) {
        const sSrc = document.getElementById('ai-src');
        const sTgt = document.getElementById('ai-tgt');
        if (sSrc) sSrc.value = src;
        if (sTgt) sTgt.value = tgt;
    }

    // --- 4. 运行逻辑 (含自愈机制) ---
    
    async function runTranslation() {
        if (!bar) createUI();
        
        const rect = icon.getBoundingClientRect();
        bar.style.display = 'block';
        bar.style.top = (rect.bottom + window.scrollY + 8) + 'px';
        bar.style.left = (rect.left + window.scrollX) + 'px';
        
        const content = document.getElementById('ai-content');
        content.className = "ai-body ai-info";
        content.innerText = "正在翻译...";
        
        let currentKey = null;

        try {
            const { translator, target, key } = await getSmartTranslator(selectedText);
            currentKey = key;

            // 尝试翻译
            let result = await translator.translate(selectedText);

            // 空白结果重试
            if (!result || !result.trim()) {
                await new Promise(r => setTimeout(r, 600));
                result = await translator.translate(selectedText);
            }

            content.className = "ai-body";
            content.innerText = result;
            
            window.currentAiResult = result;
            window.currentAiLang = target;

        } catch (err) {
            console.error(err);
            
            // ★ 关键修复：Generic Failure 自动修复逻辑
            if (err.message.includes('generic failures') || err.message.includes('destroyed')) {
                content.innerText = "连接中断，正在自动修复...";
                
                // 1. 销毁坏掉的实例
                if (currentKey && translators.has(currentKey)) {
                    const badTranslator = translators.get(currentKey);
                    // 尝试释放资源 (如果 API 支持 destroy)
                    if (badTranslator.destroy) badTranslator.destroy(); 
                    translators.delete(currentKey);
                }

                // 2. 强制重试
                setTimeout(() => retryTranslation(content), 800);
            } else {
                content.className = "ai-body ai-err";
                content.innerText = "错误: " + err.message;
            }
        }
    }

    // 强制重试逻辑
    async function retryTranslation(contentEl) {
        try {
            contentEl.innerText = "正在重试...";
            // 此时缓存已被清空，会强制创建新实例
            const { translator, target } = await getSmartTranslator(selectedText);
            const result = await translator.translate(selectedText);
            
            contentEl.className = "ai-body";
            contentEl.innerText = result;
            window.currentAiResult = result;
            window.currentAiLang = target;
        } catch (e) {
            contentEl.className = "ai-body ai-err";
            contentEl.innerText = "修复失败: " + e.message;
        }
    }

    function speakResult() {
        if (window.currentAiResult) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(window.currentAiResult);
            u.lang = window.currentAiLang || 'zh';
            window.speechSynthesis.speak(u);
        }
    }

    function hideUI() {
        if (icon) icon.style.display = 'none';
        if (bar) bar.style.display = 'none';
        selectedText = "";
    }

    document.addEventListener('mouseup', (e) => {
        setTimeout(() => {
            const sel = window.getSelection();
            const text = sel.toString().trim();
            if (text && text !== selectedText) {
                selectedText = text;
                if (!icon) createUI();
                icon.style.display = 'flex';
                icon.style.top = (e.pageY - 40) + 'px';
                icon.style.left = (e.pageX + 5) + 'px';
                if (bar) bar.style.display = 'none';
            }
        }, 10);
    });

    document.addEventListener('mousedown', (e) => {
        if (icon && icon.contains(e.target)) return;
        if (bar && bar.contains(e.target)) return;
        hideUI();
    });

})();
