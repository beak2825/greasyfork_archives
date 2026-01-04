// ==UserScript==
// @name         知乎AI总结助手
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  使用AI总结知乎问题和回答，支持收起展开功能
// @author       AI Assistant
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @connect      *
// @license      MIT
// @homepage     https://greasyfork.org/
// @supportURL   https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/560947/%E7%9F%A5%E4%B9%8EAI%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560947/%E7%9F%A5%E4%B9%8EAI%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var CONFIG = {
        API_BASE: GM_getValue('apiBase', 'https://api.openai.com/v1'),
        API_KEY: GM_getValue('apiKey', ''),
        MODEL: GM_getValue('model', 'gpt-3.5-turbo'),
        PROMPT: '请用简洁的语言总结以下内容的要点，使用markdown格式输出：\n\n'
    };

    // 添加全局样式
    GM_addStyle(`
        .zhihu-ai-wrapper {
            margin: 0 0 12px 0 !important;
            padding: 0 !important;
            display: block !important;
            clear: both !important;
        }
        
        .zhihu-ai-question-wrapper {
            margin: 0 0 16px 0 !important;
        }
        
        .zhihu-ai-btn {
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            padding: 4px 12px !important;
            margin: 0 !important;
            border: 1px solid #1772f6 !important;
            border-radius: 14px !important;
            background: white !important;
            color: #1772f6 !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            box-sizing: border-box !important;
        }
        
        .zhihu-ai-btn:hover {
            background: #EBF5FF !important;
            border-color: #1456B8 !important;
            color: #1456B8 !important;
        }
        
        .zhihu-ai-btn:disabled {
            opacity: 0.6 !important;
            cursor: not-allowed !important;
        }
        
        .zhihu-ai-summary-container {
            margin: 12px 0 16px 0 !important;
            padding: 14px 16px !important;
            background: linear-gradient(135deg, #f0f7ff 0%, #f6f6f6 100%) !important;
            border-radius: 10px !important;
            border-left: 3px solid #1772f6 !important;
            font-size: 14px !important;
            line-height: 1.7 !important;
            box-sizing: border-box !important;
            animation: fadeIn 0.3s ease !important;
        }
        
        .zhihu-ai-summary-container.hidden {
            display: none !important;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .zhihu-ai-summary-container h3,
        .zhihu-ai-summary-container h4 {
            margin: 8px 0 !important;
            color: #1772f6 !important;
        }
        
        .zhihu-ai-summary-container strong {
            font-weight: 600 !important;
        }
        
        .zhihu-ai-summary-container li {
            margin: 4px 0 !important;
            list-style-position: inside !important;
        }
    `);

    GM_registerMenuCommand('⚙️ 设置API', showSettingsDialog);

    function showSettingsDialog() {
        var existing = document.getElementById('zhihu-ai-dialog');
        if (existing) existing.remove();
        var dialog = document.createElement('div');
        dialog.id = 'zhihu-ai-dialog';
        dialog.innerHTML = '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;"><div style="background:white;padding:24px;border-radius:12px;width:400px;max-width:90vw;"><h3 style="margin:0 0 16px;font-size:18px;">🤖 AI总结设置</h3><div style="margin-bottom:12px;"><label style="display:block;margin-bottom:4px;font-weight:500;">API Base URL</label><input id="zhihu-ai-base" type="text" value="' + CONFIG.API_BASE + '" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;"></div><div style="margin-bottom:12px;"><label style="display:block;margin-bottom:4px;font-weight:500;">API Key</label><input id="zhihu-ai-key" type="password" value="' + CONFIG.API_KEY + '" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;"></div><div style="margin-bottom:16px;"><label style="display:block;margin-bottom:4px;font-weight:500;">模型</label><input id="zhihu-ai-model" type="text" value="' + CONFIG.MODEL + '" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;"></div><div style="display:flex;gap:8px;justify-content:flex-end;"><button id="zhihu-ai-cancel" style="padding:8px 16px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;">取消</button><button id="zhihu-ai-save" style="padding:8px 16px;border:none;border-radius:6px;background:#1772f6;color:white;cursor:pointer;">保存</button></div></div></div>';
        document.body.appendChild(dialog);
        document.getElementById('zhihu-ai-cancel').onclick = function() { dialog.remove(); };
        document.getElementById('zhihu-ai-save').onclick = function() {
            CONFIG.API_BASE = document.getElementById('zhihu-ai-base').value.trim();
            CONFIG.API_KEY = document.getElementById('zhihu-ai-key').value.trim();
            CONFIG.MODEL = document.getElementById('zhihu-ai-model').value.trim();
            GM_setValue('apiBase', CONFIG.API_BASE);
            GM_setValue('apiKey', CONFIG.API_KEY);
            GM_setValue('model', CONFIG.MODEL);
            dialog.remove();
            alert('✅ 设置已保存！');
        };
    }

    function createSummaryButton(text) {
        var btn = document.createElement('button');
        btn.innerHTML = text || '总结';
        btn.className = 'zhihu-ai-btn';
        btn.type = 'button';
        return btn;
    }

    function createSummaryContainer() {
        var container = document.createElement('div');
        container.className = 'zhihu-ai-summary-container';
        return container;
    }

    function callAI(content, callback) {
        if (!CONFIG.API_KEY) { 
            callback('❌ 请先点击油猴插件图标，选择"⚙️ 设置API"配置您的API密钥'); 
            return; 
        }
        GM_xmlhttpRequest({
            method: 'POST',
            url: CONFIG.API_BASE.replace(/\/$/, '') + '/chat/completions',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + CONFIG.API_KEY 
            },
            data: JSON.stringify({ 
                model: CONFIG.MODEL, 
                messages: [
                    { role: 'system', content: '你是一个专业的内容总结助手，擅长提炼文章要点。' }, 
                    { role: 'user', content: CONFIG.PROMPT + content }
                ], 
                temperature: 0.7, 
                max_tokens: 1000 
            }),
            onload: function(r) { 
                try { 
                    var d = JSON.parse(r.responseText); 
                    callback(d.choices && d.choices[0] ? d.choices[0].message.content : '❌ ' + (d.error ? d.error.message : '未知错误')); 
                } catch(e) { 
                    callback('❌ 解析错误: ' + e.message); 
                } 
            },
            onerror: function(e) { 
                callback('❌ 网络请求失败，请检查网络连接'); 
            }
        });
    }

    function renderMarkdown(t) {
        return t
            .replace(/^### (.+)$/gm, '<h4>$1</h4>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/\n/g, '<br>');
    }

    function handleSummary(btn, content, wrapper, label) {
        var container = wrapper.querySelector('.zhihu-ai-summary-container');
        
        // 如果已经生成过总结，实现收起/展开功能
        if (container && container.dataset.generated === 'true') {
            var isHidden = container.classList.contains('hidden');
            if (isHidden) {
                container.classList.remove('hidden');
                btn.innerHTML = '收起';
            } else {
                container.classList.add('hidden');
                btn.innerHTML = '展开总结';
            }
            return;
        }
        
        // 如果正在生成中，不处理
        if (btn.dataset.loading === 'true') return;
        
        if (!content || content.length < 20) { 
            alert('⚠️ 内容太短，无法生成总结'); 
            return; 
        }
        
        if (!container) { 
            container = createSummaryContainer(); 
            wrapper.appendChild(container); 
        }
        
        container.innerHTML = '<div style="color:#666;">⏳ 正在生成总结...</div>';
        container.classList.remove('hidden');
        container.dataset.generated = 'false';
        
        btn.disabled = true;
        btn.dataset.loading = 'true';
        var origHTML = btn.innerHTML; 
        btn.innerHTML = '⏳ 生成中...';
        
        callAI(content.substring(0, 4000), function(result) {
            container.innerHTML = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span style="font-size:16px;">🤖</span><strong style="color:#1772f6;">' + label + '</strong></div><div style="color:#333;line-height:1.8;">' + renderMarkdown(result) + '</div>';
            container.dataset.generated = 'true';
            
            btn.disabled = false;
            btn.dataset.loading = 'false';
            btn.innerHTML = '收起';
        });
    }

    var questionProcessed = false;

    function processQuestion() {
        if (questionProcessed) return;
        
        var questionDetail = document.querySelector('.QuestionRichText');
        if (!questionDetail || questionDetail.closest('.AppHeader')) return;
        if (questionDetail.parentNode.querySelector('.zhihu-ai-question-btn')) return;
        
        var wrapper = document.createElement('div');
        wrapper.className = 'zhihu-ai-wrapper zhihu-ai-question-wrapper';
        
        var btn = createSummaryButton('分析问题');
        btn.className += ' zhihu-ai-question-btn';
        wrapper.appendChild(btn);
        
        // 插入到问题描述之前
        questionDetail.parentNode.insertBefore(wrapper, questionDetail);
        questionProcessed = true;
        
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            var title = document.querySelector('.QuestionHeader-title');
            var detail = document.querySelector('.QuestionRichText');
            handleSummary(
                btn, 
                '问题标题：' + (title ? title.innerText : '') + '\n\n问题描述：' + (detail ? detail.innerText : ''), 
                wrapper, 
                '问题分析'
            );
        };
    }

    function processAnswerItem(item) {
        if (item.querySelector('.zhihu-ai-answer-btn')) return;
        
        var richContent = item.querySelector('.RichContent');
        if (!richContent) return;
        
        var contentInner = richContent.querySelector('.RichContent-inner');
        if (!contentInner) return;
        
        var wrapper = document.createElement('div');
        wrapper.className = 'zhihu-ai-wrapper';
        
        var btn = createSummaryButton('总结回答');
        btn.className += ' zhihu-ai-answer-btn';
        wrapper.appendChild(btn);
        
        // 插入到内容开头
        if (contentInner.firstChild) {
            contentInner.insertBefore(wrapper, contentInner.firstChild);
        } else {
            contentInner.appendChild(wrapper);
        }
        
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            var textContent = contentInner.innerText || '';
            handleSummary(btn, textContent, wrapper, '回答总结');
        };
    }

    function init() {
        if (location.pathname.startsWith('/question/')) {
            // 延迟处理问题，确保DOM加载完成
            setTimeout(processQuestion, 1500);
            
            // 监听回答列表变化
            var debounceTimer = null;
            var obs = new MutationObserver(function() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function() {
                    processQuestion(); // 再次尝试处理问题
                    document.querySelectorAll('.AnswerItem, .List-item').forEach(processAnswerItem);
                }, 300);
            });
            
            obs.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
            
            // 初始处理已存在的回答
            document.querySelectorAll('.AnswerItem, .List-item').forEach(processAnswerItem);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();
