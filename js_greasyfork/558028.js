// ==UserScript==
// @name         Linux.do 智能总结
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Linux.do 帖子总结与导出，支持多种UI风格切换，集成HTML离线导出和AI文本导出功能。
// @author       半杯无糖、WolfHolo、LD Export
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/original/4X/c/c/d/ccd8c210609d498cbeb3d5201d4c259348447562.png
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js#sha384-948ahk4ZmxYVYOc+rxN1H2gM1EJ2Duhp7uHtZ4WSLkV4Vtx5MUqnV+l7u9B+jFv+
// @require      https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js#sha384=80VlBZnyAwkkqtSfg5NhPyZff6nU4K/qniLBL8Jnm4KDv6jZhLiYtJbhglg/i9ww
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558028/Linuxdo%20%E6%99%BA%E8%83%BD%E6%80%BB%E7%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/558028/Linuxdo%20%E6%99%BA%E8%83%BD%E6%80%BB%E7%BB%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // 1. 配置区 (CONFIG)
    // =================================================================================
    const CONFIG = {
        defaultUI: 'style2', // 默认UI风格
        storageKey: 'ld_summary_ui_style', // 用于存储UI选择的键名
    };


    // =================================================================================
    // 2. 核心逻辑模块 (CORE LOGIC)
    //    这部分代码与UI完全解耦，处理数据获取和API请求等。
    // =================================================================================
    const Core = {
        getTopicId: () => window.location.href.match(/\/topic\/(\d+)/)?.[1],

        parseThinkingContent(text) {
            if (!text) return { thinking: '', content: '' };

            let thinkingParts = [];
            let mainContent = text;

            const thinkingPatterns = [
                /<think>([\s\S]*?)<\/think>/gi,
                /<thinking>([\s\S]*?)<\/thinking>/gi,
                /<reason>([\s\S]*?)<\/reason>/gi,
                /<reasoning>([\s\S]*?)<\/reasoning>/gi,
                /<reflection>([\s\S]*?)<\/reflection>/gi,
                /<inner_thought>([\s\S]*?)<\/inner_thought>/gi,
                /<think>([\s\S]*?)<\\think>/gi,
                /<thinking>([\s\S]*?)<\\thinking>/gi,
                /<\|think\|>([\s\S]*?)<\|\/think\|>/gi,
                /<\|thinking\|>([\s\S]*?)<\|\/thinking\|>/gi,
                /\[think\]([\s\S]*?)\[\/think\]/gi,
                /\[thinking\]([\s\S]*?)\[\/thinking\]/gi,
            ];

            for (const pattern of thinkingPatterns) {
                pattern.lastIndex = 0;
                let match;
                while ((match = pattern.exec(mainContent)) !== null) {
                    const thinkContent = match[1].trim();
                    if (thinkContent) {
                        thinkingParts.push(thinkContent);
                    }
                    mainContent = mainContent.replace(match[0], '');
                    pattern.lastIndex = 0;
                }
            }

            const unclosedPatterns = [
                { start: /<think>/i, end: /<\/think>|<\\think>/i, tag: '<think>' },
                { start: /<thinking>/i, end: /<\/thinking>|<\\thinking>/i, tag: '<thinking>' },
                { start: /<\|think\|>/i, end: /<\|\/think\|>/i, tag: '<|think|>' },
            ];

            for (const { start, end, tag } of unclosedPatterns) {
                const startMatch = mainContent.match(start);
                if (startMatch && !end.test(mainContent)) {
                    const startIdx = mainContent.indexOf(startMatch[0]);
                    const thinkContent = mainContent.slice(startIdx + startMatch[0].length).trim();
                    if (thinkContent) {
                        thinkingParts.push(thinkContent + ' ⏳');
                        mainContent = mainContent.slice(0, startIdx);
                    }
                    break;
                }
            }

            return {
                thinking: thinkingParts.join('\n\n'),
                content: mainContent.trim()
            };
        },

        getReplyCount: () => {
            const el = document.querySelector('.timeline-replies');
            if (!el) return 0;
            const txt = el.textContent.trim();
            return parseInt(txt.includes('/') ? txt.split('/')[1] : txt) || 0;
        },

        async fetchDialogues(building, start, end) {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
            const opts = { headers: { 'x-csrf-token': csrf, 'x-requested-with': 'XMLHttpRequest' } };

            const idRes = await fetch(`https://linux.do/t/${building}/post_ids.json?post_number=0&limit=99999`, opts);
            const idData = await idRes.json();
            let pIds = idData.post_ids.slice(Math.max(0, start - 1), end);

            if (start <= 1) {
                const mainRes = await fetch(`https://linux.do/t/${building}.json`, opts);
                const mainData = await mainRes.json();
                const firstId = mainData.post_stream.posts[0].id;
                if (!pIds.includes(firstId)) pIds.unshift(firstId);
            }

            let text = "";
            const postsMap = new Map();

            for (let i = 0; i < pIds.length; i += 200) {
                const chunk = pIds.slice(i, i + 200);
                const q = chunk.map(id => `post_ids[]=${id}`).join('&');
                const res = await fetch(`https://linux.do/t/${building}/posts.json?${q}&include_suggested=false`, opts);
                const data = await res.json();

                data.post_stream.posts.forEach(p => {
                    postsMap.set(p.post_number, {
                        name: p.name || p.username,
                        username: p.username,
                        replyTo: p.reply_to_post_number,
                        replyToUser: p.reply_to_user
                    });
                });

                text += data.post_stream.posts.map(p => {
                    let content = p.cooked;
                    content = content.replace(/<div class="lightbox-wrapper">\s*<a class="lightbox" href="([^"]+)"(?:\s+data-download-href="([^"]+)")?[^>]*title="([^"]*)"[^>]*>[\s\S]*?<\/a>\s*<\/div>/gi, (match, hrefUrl, downloadHref, title) => {
                        let imgUrl = hrefUrl || `https://linux.do${downloadHref || ''}`;
                        const filename = title || '图片';
                        return `\n[图片: ${filename}](${imgUrl})\n`;
                    });
                    content = content.replace(/<a class="attachment" href="([^"]+)"[^>]*>([^<]+)<\/a>/gi, (match, url, name) => `\n[附件: ${name.trim()}](${url})\n`);
                    content = content.replace(/<img[^>]+class="emoji[^>]*alt="([^"]*)"[^>]*>/gi, '$1 ');
                    content = content.replace(/<aside class="quote(?:-modified)?[^>]*>[\s\S]*?<blockquote>([\s\S]*?)<\/blockquote>[\s\S]*?<\/aside>/gi, (match, quoteInner) => {
                        let cleanQuote = quoteInner.replace(/<[^>]+>/g, '').trim();
                        return `\n[引用]\n${cleanQuote}\n[/引用]\n`;
                    });
                    content = content.replace(/<[^>]+>/g, '').trim();
                    const userName = p.name || p.username;
                    const userPart = `${userName}（${p.username}）`;
                    let replyPart = '';
                    if (p.reply_to_post_number && p.reply_to_user) {
                        const replyToName = p.reply_to_user.name || p.reply_to_user.username;
                        const replyToUsername = p.reply_to_user.username;
                        replyPart = `-回复[${p.reply_to_post_number}楼] ${replyToName}（${replyToUsername}）`;
                    }
                    return `[${p.post_number}楼] ${userPart}${replyPart}:\n${content}`;
                }).join('\n\n');
            }
            return text;
        },

        async streamChat(messages, onChunk, onDone, onError) {
            const key = GM_getValue('apiKey', '');
            const url = GM_getValue('apiUrl', 'https://api.openai.com/v1/chat/completions');
            const model = GM_getValue('model', 'deepseek-chat');
            const useStream = GM_getValue('useStream', true);

            if (!key) return onError("未配置 API Key，请先在设置中配置");

            try {
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                    body: JSON.stringify({ model, messages, stream: useStream })
                });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

                if (useStream) {
                    const reader = resp.body.getReader();
                    const decoder = new TextDecoder();
                    let contentStarted = false;
                    let thinkTagSent = false;

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const lines = decoder.decode(value, { stream: true }).split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                try {
                                    const json = JSON.parse(line.slice(6));
                                    const delta = json.choices?.[0]?.delta;
                                    if (delta?.reasoning_content) {
                                        if (!thinkTagSent) {
                                            onChunk('<think>');
                                            thinkTagSent = true;
                                        }
                                        onChunk(delta.reasoning_content);
                                    }
                                    if (delta?.content) {
                                        if (thinkTagSent && !contentStarted) {
                                            onChunk('</think>');
                                            contentStarted = true;
                                        }
                                        onChunk(delta.content);
                                    }
                                } catch(e){}
                            }
                        }
                    }
                    if (thinkTagSent && !contentStarted) {
                        onChunk('</think>');
                    }
                } else {
                    const data = await resp.json();
                    const message = data.choices?.[0]?.message;
                    let fullContent = '';
                    if (message?.reasoning_content) {
                        fullContent += `<think>${message.reasoning_content}</think>`;
                    }
                    if (message?.content) {
                        fullContent += message.content;
                    }
                    if (fullContent) onChunk(fullContent);
                }
                onDone();
            } catch (e) { onError(e.message); }
        },

        // ========== 导出功能相关工具函数 ==========

        // 辅助函数：绝对URL转换
        absoluteUrl(src) {
            if (!src) return "";
            if (src.startsWith("http://") || src.startsWith("https://")) return src;
            if (src.startsWith("//")) return window.location.protocol + src;
            if (src.startsWith("/")) return window.location.origin + src;
            return window.location.origin + "/" + src.replace(/^\.?\//, "");
        },

        // 辅助函数：HTML转义
        escapeHtml(s) {
            return (s ?? "").toString()
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&#039;");
        },

        // 辅助函数：解码HTML实体
        decodeEntities(str) {
            const el = document.createElement("textarea");
            el.innerHTML = str || "";
            return el.value;
        },

        // 下载文件（优先GM_download，失败则回退到<a download>）
        downloadFile(content, filename, type) {
            const blob = new Blob([content], { type });
            const url = URL.createObjectURL(blob);

            let usedGm = false;
            try {
                if (typeof GM_download === "function") {
                    usedGm = true;
                    GM_download({
                        url,
                        name: filename,
                        saveAs: false,
                        onerror: function (err) {
                            console.warn("GM_download 失败，回退到 <a download> 方式：", err);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        },
                    });
                }
            } catch (e) {
                console.warn("调用 GM_download 异常，将使用 <a download>：", e);
                usedGm = false;
            }

            if (!usedGm) {
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

            // 延迟释放URL
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        },

        // DOM转AI文本（用于AI文本导出）
        cookedToAiText(cookedHtml, opts) {
            const { includeImages, includeQuotes } = opts;
            const parser = new DOMParser();
            const doc = parser.parseFromString(cookedHtml || "", "text/html");
            const root = doc.body;

            function serialize(node, inPre = false) {
                if (!node) return "";
                if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || "";
                if (node.nodeType !== Node.ELEMENT_NODE) return "";

                const el = node;
                const tag = el.tagName.toLowerCase();

                if (tag === "br") return "\n";

                if (tag === "img") {
                    if (!includeImages) return "";
                    const src = el.getAttribute("src") || el.getAttribute("data-src") || "";
                    const full = Core.absoluteUrl(src);
                    if (!full) return "";
                    return `\n[图片] ${full}\n`;
                }

                if (tag === "a") {
                    const hasImg = el.querySelector("img");
                    const href = el.getAttribute("href") || "";
                    if (hasImg) {
                        return Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("");
                    }
                    const text = Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("").trim();
                    const link = Core.absoluteUrl(href);
                    if (!link) return text;
                    if (!text) return link;
                    if (text === link) return text;
                    return `${text}（${link}）`;
                }

                if (tag === "pre") {
                    const codeEl = el.querySelector("code");
                    const langClass = codeEl?.getAttribute("class") || "";
                    const lang = (langClass.match(/lang(?:uage)?-([a-z0-9_+-]+)/i) || [])[1] || "";
                    const code = (codeEl ? codeEl.textContent : el.textContent) || "";
                    return `\n\`\`\`${lang}\n${code.replace(/\n+$/g, "")}\n\`\`\`\n\n`;
                }

                if (tag === "code") {
                    if (inPre) return el.textContent || "";
                    const t = (el.textContent || "").replace(/\n/g, " ");
                    return t ? `\`${t}\`` : "";
                }

                if (tag === "blockquote") {
                    if (!includeQuotes) {
                        const inner = (el.textContent || "").trim();
                        return inner ? "\n(引用已省略)\n" : "";
                    }
                    const inner = Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("");
                    return `\n【引用开始】\n${inner.trim()}\n【引用结束】\n\n`;
                }

                if (/^h[1-6]$/.test(tag)) {
                    const inner = (el.textContent || "").trim();
                    return inner ? `\n${inner}\n\n` : "";
                }

                if (tag === "li") {
                    const inner = Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("").trim();
                    return inner ? `- ${inner}\n` : "";
                }

                if (tag === "ul" || tag === "ol") {
                    const inner = Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("");
                    return `\n${inner}\n`;
                }

                if (tag === "p") {
                    const inner = Array.from(el.childNodes).map((c) => serialize(c, inPre)).join("").trim();
                    return inner ? `${inner}\n\n` : "\n";
                }

                const nextInPre = inPre || tag === "pre";
                return Array.from(el.childNodes).map((c) => serialize(c, nextInPre)).join("");
            }

            let text = Array.from(root.childNodes).map((n) => serialize(n, false)).join("");
            text = Core.decodeEntities(text);
            text = text.replace(/\r\n/g, "\n");
            text = text.replace(/[ \t]+\n/g, "\n");
            text = text.replace(/\n{3,}/g, "\n\n").trim();
            return text;
        },

        // 检查帖子是否包含图片
        postHasImage(post) {
            const cooked = post?.cooked || "";
            return cooked.includes("<img");
        }
    };

    // =================================================================================
    // 3. UI 模块注册表 (UI REGISTRY)
    //    所有UI风格都在此注册。
    // =================================================================================
    const UIRegistry = {
        _styles: {},
        register(name, styleObject) {
            this._styles[name] = styleObject;
        },
        get(name) {
            return this._styles[name];
        },
        getAllNames() {
            return Object.keys(this._styles);
        }
    };

    // =================================================================================
    // 4. UI 风格模块 (UI STYLES)
    //    每个风格都是一个独立的对象，实现共同的接口。
    // =================================================================================

    // -------------------------------------------------
    // UI 风格 1: 现代风格
    // -------------------------------------------------
    UIRegistry.register('style1', {
        name: '橘色现代风格',

        //
        // 1. 初始化与销毁
        //
        init(uiManager) {
            this.uiManager = uiManager; // 保存UI管理器的引用

            // 初始化内部状态
            this.isOpen = false;
            this.btnPos = GM_getValue('style1_btnPos', { side: 'right', top: '50%' });
            this.side = this.btnPos.side;
            this.sidebarWidth = GM_getValue('style1_sidebarWidth', 420);
            this.isDarkTheme = GM_getValue('style1_isDarkTheme', false);
            this.chatHistory = [];
            this.postContent = '';
            this.lastSummary = '';
            this.isGenerating = false;
            this.currentTab = 'summary';
            this.userMessageCount = 0;
            this.userScrolledUp = false;
            this.isProgrammaticScroll = false;

            this.render();
            this.restoreState();
            this.bindEvents();
            this.bindKeyboardShortcuts();
        },

        destroy() {
            // 在这里可以添加清理逻辑，例如移除特定的事件监听器
            // 但由于UIManager会直接移除整个host，这里的清理不是必须的
        },

        //
        // 2. 样式与渲染
        //
        getStyles() {
            // 从原脚本 "Linux.do 智能总结-风格1.js" 复制的 STYLES 常量
            return `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        :host {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            --primary: #c96442; --primary-light: #e07d5c; --primary-dark: #a84d32;
            --primary-gradient: linear-gradient(135deg, #c96442 0%, #e08860 50%, #d4724e 100%);
            --primary-glow: rgba(201, 100, 66, 0.35);
            --success: #2d9d78; --success-light: #d1fae5; --danger: #dc4446; --danger-light: #fef2f2; --warning: #d4a054;
            --bg-base: #faf8f6; --bg-card: #ffffff; --bg-glass: rgba(255, 255, 255, 0.88);
            --bg-glass-dark: rgba(250, 248, 246, 0.96); --bg-hover: rgba(201, 100, 66, 0.08);
            --bg-active: rgba(201, 100, 66, 0.12); --bg-setting: #f5f2ef; --bg-input: #ffffff;
            --border-light: rgba(201, 100, 66, 0.12); --border-medium: rgba(201, 100, 66, 0.2);
            --shadow-sm: 0 1px 3px rgba(168, 77, 50, 0.06), 0 1px 2px rgba(168, 77, 50, 0.08);
            --shadow-md: 0 4px 12px -2px rgba(168, 77, 50, 0.12), 0 2px 6px -2px rgba(168, 77, 50, 0.08);
            --shadow-lg: 0 12px 40px -8px rgba(168, 77, 50, 0.18), 0 4px 12px -4px rgba(168, 77, 50, 0.08);
            --shadow-xl: 0 20px 50px -12px rgba(168, 77, 50, 0.25), 0 0 0 1px rgba(201, 100, 66, 0.05);
            --shadow-glow: 0 4px 20px var(--primary-glow), 0 0 0 1px rgba(201, 100, 66, 0.1);
            --text-main: #2d2520; --text-sec: #6b5d54; --text-muted: #9c8b80; --text-inverse: #ffffff;
            --sidebar-width: 420px; --btn-size: 52px; --radius-sm: 10px; --radius-md: 14px;
            --radius-lg: 18px; --radius-xl: 24px; --radius-full: 9999px;
            --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            --transition-slow: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        :host(.dark-theme) {
            --bg-base: #1a1614; --bg-card: #252220; --bg-glass: rgba(37, 34, 32, 0.92);
            --bg-glass-dark: rgba(26, 22, 20, 0.96); --bg-hover: rgba(224, 125, 92, 0.12);
            --bg-active: rgba(224, 125, 92, 0.18); --bg-setting: #1e1b19; --bg-input: #2d2926;
            --border-light: rgba(224, 125, 92, 0.15); --border-medium: rgba(224, 125, 92, 0.25);
            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2); --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.3);
            --shadow-lg: 0 12px 40px -8px rgba(0, 0, 0, 0.4); --shadow-xl: 0 20px 50px -12px rgba(0, 0, 0, 0.5);
            --text-main: #f5f0eb; --text-sec: #b8a99d; --text-muted: #7a6d64;
        }
        * { box-sizing: border-box; }
        .sidebar-panel { position: fixed; top: 0; bottom: 0; width: var(--sidebar-width); background: var(--bg-glass-dark); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%); box-shadow: var(--shadow-xl); z-index: 9998; display: flex; flex-direction: column; transition: transform var(--transition-slow); border: 1px solid var(--border-light); }
        .panel-left { left: 0; border-left: none; border-radius: 0 var(--radius-xl) var(--radius-xl) 0; transform: translateX(-100%); }
        .panel-left.open { transform: translateX(0); }
        .panel-right { right: 0; border-right: none; border-radius: var(--radius-xl) 0 0 var(--radius-xl); transform: translateX(100%); }
        .panel-right.open { transform: translateX(0); }
        #toggle-btn { position: fixed; width: var(--btn-size); height: var(--btn-size); background: var(--primary-gradient); color: white; box-shadow: var(--shadow-glow); z-index: 9999; cursor: grab; display: flex; align-items: center; justify-content: center; user-select: none; transition: all var(--transition-normal); border: 2px solid rgba(255, 255, 255, 0.2); outline: none; }
        #toggle-btn::before { content: ''; position: absolute; inset: -3px; border-radius: inherit; background: var(--primary-gradient); opacity: 0; z-index: -1; filter: blur(12px); transition: opacity var(--transition-normal); }
        #toggle-btn:hover { transform: scale(1.08); box-shadow: 0 8px 30px var(--primary-glow), 0 0 0 4px rgba(201, 100, 66, 0.15); }
        #toggle-btn:hover::before { opacity: 0.6; }
        #toggle-btn:active { cursor: grabbing; transform: scale(0.96); }
        #toggle-btn svg { width: 24px; height: 24px; fill: currentColor; transition: transform var(--transition-normal); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15)); }
        .btn-snap-left { border-radius: 0 var(--radius-lg) var(--radius-lg) 0; }
        .btn-snap-right { border-radius: var(--radius-lg) 0 0 var(--radius-lg); }
        .btn-floating { border-radius: var(--radius-lg); }
        #toggle-btn.arrow-flip svg { transform: rotate(180deg); }
        .resize-handle { position: absolute; top: 0; bottom: 0; width: 6px; cursor: col-resize; z-index: 10001; background: transparent; transition: background var(--transition-fast); }
        .resize-handle::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 3px; height: 40px; background: var(--primary); border-radius: 2px; opacity: 0; transition: opacity var(--transition-fast); }
        .resize-handle:hover::after { opacity: 0.5; }
        .handle-left { right: -3px; }
        .handle-right { left: -3px; }
        .header { padding: 20px 24px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(to bottom, var(--bg-card), transparent); flex-shrink: 0; }
        .header-title { font-size: 18px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 12px; letter-spacing: -0.02em; }
        .header-title-icon { width: 36px; height: 36px; background: var(--primary-gradient); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: var(--shadow-sm); }
        .header-actions { display: flex; gap: 6px; }
        .icon-btn { background: transparent; border: none; cursor: pointer; padding: 10px; border-radius: var(--radius-sm); color: var(--text-sec); transition: all var(--transition-fast); font-size: 16px; display: flex; align-items: center; justify-content: center; position: relative; }
        .icon-btn:hover { background: var(--bg-hover); color: var(--primary); transform: scale(1.05); }
        .icon-btn:active { transform: scale(0.95); }
        .icon-btn.active { background: var(--bg-active); color: var(--primary); }
        .icon-btn[data-tooltip]::after { content: attr(data-tooltip); position: absolute; bottom: -32px; left: 50%; transform: translateX(-50%) scale(0.9); background: var(--text-main); color: var(--text-inverse); padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 500; white-space: nowrap; opacity: 0; pointer-events: none; transition: all var(--transition-fast); z-index: 100; }
        .icon-btn[data-tooltip]:hover::after { opacity: 1; transform: translateX(-50%) scale(1); }
        .tab-bar { display: flex; padding: 12px 16px; gap: 6px; border-bottom: 1px solid var(--border-light); background: var(--bg-glass); flex-shrink: 0; }
        .tab-item { flex: 1; padding: 12px 16px; text-align: center; font-size: 13px; font-weight: 600; color: var(--text-sec); cursor: pointer; border-radius: var(--radius-sm); transition: all var(--transition-fast); display: flex; align-items: center; justify-content: center; gap: 8px; position: relative; overflow: hidden; }
        .tab-item::before { content: ''; position: absolute; inset: 0; background: var(--primary-gradient); opacity: 0; transition: opacity var(--transition-fast); }
        .tab-item:hover { color: var(--primary); background: var(--bg-hover); }
        .tab-item.active { color: var(--text-inverse); background: var(--primary-gradient); box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.2); }
        .tab-item.active::before { opacity: 1; }
        .tab-item span { position: relative; z-index: 1; }
        .content-area { flex: 1; overflow-y: auto; position: relative; background: var(--bg-base); }
        .view-page { padding: 24px; display: none; animation: fadeSlideIn 0.35s ease; }
        .view-page.active { display: block; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .form-group { margin-bottom: 24px; }
        .form-label { display: block; font-size: 11px; color: var(--text-sec); margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
        input, textarea, select { width: 100%; padding: 14px 18px; border: 2px solid var(--border-light); border-radius: var(--radius-md); font-size: 14px; font-family: inherit; background: var(--bg-input); box-sizing: border-box; transition: all var(--transition-fast); color: var(--text-main); }
        input:focus, textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px rgba(201, 100, 66, 0.12); background: var(--bg-card); }
        input::placeholder, textarea::placeholder { color: var(--text-muted); }
        textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
        .btn { width: 100%; padding: 16px 24px; border: none; border-radius: var(--radius-md); background: var(--primary-gradient); color: var(--text-inverse); font-weight: 600; font-size: 15px; font-family: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all var(--transition-normal); box-shadow: var(--shadow-glow); letter-spacing: 0.02em; position: relative; overflow: hidden; }
        .btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: left 0.5s; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px var(--primary-glow); }
        .btn:hover::before { left: 100%; }
        .btn:active { transform: translateY(0) scale(0.98); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-secondary { background: var(--bg-card); color: var(--text-main); box-shadow: var(--shadow-sm); border: 2px solid var(--border-light); }
        .btn-secondary:hover { background: var(--bg-hover); border-color: var(--primary); box-shadow: var(--shadow-md); }
        .btn-xs { padding: 8px 14px; font-size: 12px; font-family: inherit; background: var(--bg-card); color: var(--text-main); border-radius: var(--radius-sm); border: 1.5px solid var(--border-light); cursor: pointer; white-space: nowrap; font-weight: 600; transition: all var(--transition-fast); }
        .btn-xs:hover { background: var(--primary); color: var(--text-inverse); border-color: var(--primary); transform: translateY(-1px); }
        .result-box { margin-top: 20px; padding: 24px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-lg); font-size: 14px; line-height: 1.8; color: var(--text-main); min-height: 180px; max-height: calc(100vh - 380px); overflow-y: auto; word-break: break-word; box-shadow: var(--shadow-sm); position: relative; }
        .result-box.empty { display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 13px; text-align: center; background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-base) 100%); }
        .result-actions { position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; opacity: 0; transition: opacity var(--transition-fast); }
        .result-box:hover .result-actions { opacity: 1; }
        .result-action-btn { padding: 6px 12px; font-size: 11px; font-family: inherit; background: var(--bg-glass); color: var(--text-sec); border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all var(--transition-fast); backdrop-filter: blur(8px); }
        .result-action-btn:hover { background: var(--primary); color: var(--text-inverse); border-color: var(--primary); }
        .result-action-btn.copied { background: var(--success); color: var(--text-inverse); border-color: var(--success); }
        .result-box h1, .result-box h2, .result-box h3 { margin: 20px 0 12px; font-weight: 700; color: var(--text-main); letter-spacing: -0.02em; }
        .result-box h1 { font-size: 1.5em; }
        .result-box h2 { font-size: 1.25em; border-bottom: 2px solid var(--border-light); padding-bottom: 8px; }
        .result-box h3 { font-size: 1.1em; color: var(--primary); }
        .result-box p { margin-bottom: 14px; }
        .result-box ul, .result-box ol { padding-left: 24px; margin: 12px 0; }
        .result-box li { margin-bottom: 8px; }
        .result-box li::marker { color: var(--primary); }
        .result-box code { background: var(--bg-hover); padding: 3px 8px; border-radius: 6px; font-family: 'JetBrains Mono', 'SF Mono', monospace; color: var(--primary-dark); font-size: 0.88em; border: 1px solid var(--border-light); }
        .result-box pre { background: linear-gradient(135deg, #2d2520 0%, #3d332c 100%); padding: 18px; border-radius: var(--radius-md); overflow-x: auto; color: #f5f0eb; border: 1px solid rgba(255,255,255,0.1); }
        .result-box pre code { background: none; color: #f5f0eb; padding: 0; border: none; }
        .result-box blockquote { border-left: 4px solid var(--primary); margin: 16px 0; padding: 14px 20px; color: var(--text-sec); background: var(--bg-hover); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-style: italic; }
        .result-box a { color: var(--primary); text-decoration: none; border-bottom: 1px solid var(--primary-light); transition: all var(--transition-fast); }
        .result-box a:hover { color: var(--primary-dark); border-bottom-color: var(--primary-dark); }
        .result-box strong { color: var(--primary-dark); font-weight: 600; }
        .chat-container { display: flex; flex-direction: column; height: 100%; position: relative; }
        .chat-toolbar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; border-bottom: 1px solid var(--border-light); margin-bottom: 14px; }
        .chat-toolbar-title { font-size: 13px; color: var(--text-sec); font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .chat-toolbar-title .msg-count { background: var(--primary-gradient); color: var(--text-inverse); font-size: 11px; padding: 3px 10px; border-radius: var(--radius-full); font-weight: 700; box-shadow: var(--shadow-sm); }
        .btn-clear { padding: 8px 14px; font-size: 12px; font-family: inherit; background: var(--danger-light); color: var(--danger); border-radius: var(--radius-sm); border: 1px solid transparent; cursor: pointer; font-weight: 600; transition: all var(--transition-fast); display: flex; align-items: center; gap: 5px; }
        .btn-clear:hover { background: var(--danger); color: var(--text-inverse); transform: scale(1.02); }
        .chat-messages-wrapper { flex: 1; position: relative; overflow: hidden; }
        .chat-messages { height: 100%; overflow-y: auto; padding: 16px 0; }
        .chat-list { display: flex; flex-direction: column; gap: 18px; }
        .bubble { padding: 16px 20px; border-radius: var(--radius-lg); font-size: 14px; line-height: 1.75; max-width: 88%; word-break: break-word; box-shadow: var(--shadow-sm); animation: bubbleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); position: relative; }
        @keyframes bubbleIn { from { opacity: 0; transform: translateY(15px) scale(0.92); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .bubble-user { align-self: flex-end; background: var(--primary-gradient); color: var(--text-inverse); border-bottom-right-radius: 6px; box-shadow: var(--shadow-glow); }
        .bubble-ai { align-self: flex-start; background: var(--bg-card); border: 1px solid var(--border-light); color: var(--text-main); border-bottom-left-radius: 6px; }
        .bubble-ai h1, .bubble-ai h2, .bubble-ai h3 { margin: 12px 0 8px; }
        .bubble-ai p { margin-bottom: 10px; }
        .bubble-ai p:last-child { margin-bottom: 0; }
        .bubble-ai code { background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; }
        .bubble-ai .thinking-block { margin: -6px -8px 12px; border-radius: var(--radius-sm); }
        .bubble-ai .thinking-block:last-child { margin-bottom: -6px; }
        .bubble-ai .thinking-header { padding: 8px 12px; }
        .bubble-ai .thinking-preview { padding: 0 12px 10px; font-size: 11px; }
        .bubble-ai .thinking-content-inner { padding: 10px 12px 12px; font-size: 11px; max-height: 300px; }
        .scroll-buttons { position: absolute; right: 10px; display: flex; flex-direction: column; gap: 8px; z-index: 10; transition: all var(--transition-normal); }
        .scroll-buttons.top-area { top: 10px; }
        .scroll-buttons.bottom-area { bottom: 10px; }
        .scroll-btn { width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--bg-card); border: 1px solid var(--border-light); box-shadow: var(--shadow-md); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-sec); transition: all var(--transition-fast); opacity: 0; transform: scale(0.8); pointer-events: none; }
        .scroll-btn.visible { opacity: 1; transform: scale(1); pointer-events: auto; }
        .scroll-btn:hover { background: var(--primary); color: var(--text-inverse); border-color: var(--primary); box-shadow: var(--shadow-glow); transform: scale(1.1); }
        .scroll-btn.generating { background: var(--primary-gradient); color: var(--text-inverse); border-color: var(--primary); box-shadow: var(--shadow-glow); animation: pulse-btn 1.5s ease-in-out infinite; }
        .scroll-btn.generating::after { content: '新内容'; position: absolute; right: 42px; background: var(--primary-gradient); color: white; font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 12px; white-space: nowrap; box-shadow: var(--shadow-md); animation: fadeIn 0.3s ease; }
        @keyframes pulse-btn { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        .scroll-btn svg { width: 18px; height: 18px; fill: currentColor; }
        .chat-input-area { border-top: 1px solid var(--border-light); padding: 18px 0 0; flex-shrink: 0; background: linear-gradient(to top, var(--bg-base), transparent); }
        .chat-input-row { display: flex; gap: 14px; align-items: flex-end; }
        .chat-input { flex: 1; min-height: 52px; max-height: 140px; border-radius: var(--radius-xl); padding: 16px 22px; resize: none; border: 2px solid var(--border-light); font-size: 14px; line-height: 1.5; transition: all var(--transition-fast); }
        .chat-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(201, 100, 66, 0.12); }
        .chat-input:disabled { opacity: 0.6; cursor: not-allowed; background: var(--bg-setting); }
        .chat-input::placeholder { color: var(--text-muted); font-style: italic; }
        .thinking-block { margin-bottom: 16px; border-radius: var(--radius-md); overflow: hidden; background: linear-gradient(135deg, rgba(201, 100, 66, 0.05) 0%, rgba(201, 100, 66, 0.02) 100%); border: 1px solid rgba(201, 100, 66, 0.12); transition: all var(--transition-normal); }
        .thinking-block:hover { border-color: rgba(201, 100, 66, 0.22); box-shadow: 0 2px 12px rgba(201, 100, 66, 0.06); }
        .thinking-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; cursor: pointer; user-select: none; transition: background var(--transition-fast); }
        .thinking-header:hover { background: rgba(201, 100, 66, 0.05); }
        .thinking-header-left { display: flex; align-items: center; gap: 8px; }
        .thinking-icon { width: 24px; height: 24px; border-radius: 6px; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: var(--shadow-sm); flex-shrink: 0; }
        .thinking-title { font-size: 12px; font-weight: 600; color: var(--primary-dark); }
        .thinking-status { font-size: 10px; color: var(--text-muted); background: rgba(201, 100, 66, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 6px; }
        .thinking-block.streaming .thinking-status { background: var(--primary); color: white; animation: status-pulse 1.2s ease-in-out infinite; }
        @keyframes status-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .thinking-toggle { width: 22px; height: 22px; border-radius: 50%; background: rgba(201, 100, 66, 0.08); display: flex; align-items: center; justify-content: center; transition: all var(--transition-fast); flex-shrink: 0; }
        .thinking-toggle:hover { background: rgba(201, 100, 66, 0.15); }
        .thinking-toggle svg { width: 12px; height: 12px; fill: var(--primary); transition: transform var(--transition-normal); }
        .thinking-block.expanded .thinking-toggle svg { transform: rotate(180deg); }
        .thinking-preview { padding: 0 14px 12px; font-size: 12px; line-height: 1.5; color: var(--text-muted); max-height: 4.5em; overflow: hidden; position: relative; }
        .thinking-preview p { margin: 0 0 4px; font-size: 12px; }
        .thinking-preview p:last-child { margin-bottom: 0; }
        .thinking-preview::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 24px; background: linear-gradient(to bottom, transparent, rgba(253, 250, 247, 0.98)); pointer-events: none; }
        .thinking-block.expanded .thinking-preview { display: none; }
        .thinking-content { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .thinking-block.expanded .thinking-content { max-height: 5000px; }
        .thinking-content-inner { padding: 12px 14px 14px; font-size: 12px; line-height: 1.7; color: var(--text-sec); border-top: 1px dashed rgba(201, 100, 66, 0.12); max-height: 400px; overflow-y: auto; }
        .thinking-content-inner p { margin-bottom: 8px; font-size: 12px; }
        .thinking-content-inner p:last-child { margin-bottom: 0; }
        .thinking-content-inner h1, .thinking-content-inner h2, .thinking-content-inner h3 { font-size: 13px; margin: 10px 0 6px; color: var(--primary-dark); }
        .thinking-content-inner ul, .thinking-content-inner ol { padding-left: 18px; margin: 6px 0; }
        .thinking-content-inner li { margin-bottom: 4px; font-size: 12px; }
        .thinking-content-inner code { font-family: 'JetBrains Mono', monospace; font-size: 11px; background: rgba(201, 100, 66, 0.08); padding: 1px 5px; border-radius: 3px; }
        .thinking-content-inner pre { background: rgba(45, 37, 32, 0.9); padding: 10px; border-radius: 6px; overflow-x: auto; font-size: 11px; }
        .thinking-content-inner pre code { background: none; padding: 0; }
        .thinking-block.streaming .thinking-icon { animation: pulse-glow 1.5s ease-in-out infinite; }
        @keyframes pulse-glow { 0%, 100% { box-shadow: var(--shadow-sm); } 50% { box-shadow: 0 0 10px var(--primary-glow); } }
        :host(.dark-theme) .thinking-block { background: linear-gradient(135deg, rgba(224, 125, 92, 0.06) 0%, rgba(224, 125, 92, 0.02) 100%); border-color: rgba(224, 125, 92, 0.15); }
        :host(.dark-theme) .thinking-header:hover { background: rgba(224, 125, 92, 0.06); }
        :host(.dark-theme) .thinking-title { color: var(--primary-light); }
        :host(.dark-theme) .thinking-toggle { background: rgba(224, 125, 92, 0.12); }
        :host(.dark-theme) .thinking-content-inner { border-top-color: rgba(224, 125, 92, 0.15); }
        :host(.dark-theme) .thinking-preview::after { background: linear-gradient(to bottom, transparent, rgba(37, 34, 32, 0.98)); }
        :host(.dark-theme) .content-area::-webkit-scrollbar-track { background: rgba(224, 125, 92, 0.05); }
        :host(.dark-theme) .result-box::-webkit-scrollbar-thumb { background: rgba(184, 169, 157, 0.25); }
        :host(.dark-theme) .result-box::-webkit-scrollbar-thumb:hover { background: rgba(184, 169, 157, 0.4); }
        :host(.dark-theme) .chat-messages::-webkit-scrollbar-thumb { background: rgba(184, 169, 157, 0.2); }
        :host(.dark-theme) .chat-messages::-webkit-scrollbar-thumb:hover { background: rgba(184, 169, 157, 0.35); }
        :host(.dark-theme) .thinking-content-inner::-webkit-scrollbar-thumb { background: rgba(224, 125, 92, 0.2); }
        :host(.dark-theme) .thinking-content-inner::-webkit-scrollbar-thumb:hover { background: rgba(224, 125, 92, 0.35); }
        .result-box pre code, .bubble-ai pre code, .thinking-content-inner pre code { white-space: pre-wrap !important; word-break: break-word !important; overflow-wrap: break-word !important; }
        .result-box pre, .bubble-ai pre, .thinking-content-inner pre { white-space: pre-wrap !important; word-break: break-word !important; overflow-wrap: break-word !important; overflow-x: hidden !important; max-width: 100% !important; box-sizing: border-box !important; }
        .result-box, .bubble-ai, .thinking-content-inner, .result-box p, .bubble-ai p, .thinking-content-inner p { word-break: break-word !important; overflow-wrap: break-word !important; white-space: normal !important; hyphens: auto; overflow-x: hidden !important; max-width: 100% !important; }
        .result-box a, .bubble-ai a, .thinking-content-inner a { word-break: break-all !important; overflow-wrap: break-word !important; hyphens: auto; }
        .result-box, .bubble-ai, .thinking-content-inner { box-sizing: border-box !important; width: 100% !important; }
        .send-btn { width: 52px; height: 52px; border-radius: var(--radius-full); padding: 0; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--primary-gradient); border: none; cursor: pointer; transition: all var(--transition-normal); box-shadow: var(--shadow-glow); }
        .send-btn:hover { transform: scale(1.08) rotate(5deg); box-shadow: 0 8px 30px var(--primary-glow); }
        .send-btn:active { transform: scale(0.95); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .send-btn svg { width: 22px; height: 22px; fill: white; margin-left: 3px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2)); }
        .settings-page { background: var(--bg-setting); min-height: 100%; padding: 24px; box-sizing: border-box; }
        .settings-group { background: var(--bg-card); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); }
        .settings-group-title { font-size: 11px; color: var(--primary); text-transform: uppercase; padding: 20px 20px 10px; font-weight: 700; letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px; }
        .settings-group-title::before { content: ''; width: 4px; height: 14px; background: var(--primary-gradient); border-radius: 2px; }
        .setting-item { padding: 18px 20px; border-bottom: 1px solid var(--border-light); transition: background var(--transition-fast); }
        .setting-item:last-child { border-bottom: none; }
        .setting-item:hover { background: var(--bg-hover); }
        .setting-label { font-size: 14px; font-weight: 600; color: var(--text-main); margin-bottom: 6px; display: block; }
        .setting-desc { font-size: 12px; color: var(--text-sec); margin-bottom: 12px; line-height: 1.6; }
        .setting-item-row { display: flex; justify-content: space-between; align-items: center; }
        .setting-item-row .setting-info { flex: 1; margin-right: 16px; }
        .setting-item-row .setting-label { margin-bottom: 4px; }
        .setting-item-row .setting-desc { margin-bottom: 0; }
        .toggle-switch { position: relative; width: 52px; height: 28px; flex-shrink: 0; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
        .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: var(--border-medium); border-radius: var(--radius-full); transition: all var(--transition-normal); }
        .toggle-slider::before { content: ''; position: absolute; height: 22px; width: 22px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: all var(--transition-normal); box-shadow: var(--shadow-sm); }
        .toggle-switch input:checked + .toggle-slider { background: var(--primary-gradient); box-shadow: var(--shadow-glow); }
        .toggle-switch input:checked + .toggle-slider::before { transform: translateX(24px); }
        .toggle-switch input:focus + .toggle-slider { box-shadow: 0 0 0 3px rgba(201, 100, 66, 0.2); }
        .spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.25); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: none; }
        .btn.loading .spinner { display: inline-block; }
        .btn.loading .btn-text { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .thinking { display: flex; gap: 5px; padding: 8px 0; }
        .thinking-dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; animation: thinking 1.4s ease-in-out infinite; }
        .thinking-dot:nth-child(2) { animation-delay: 0.2s; }
        .thinking-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes thinking { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        .tip-text { text-align: center; color: var(--text-muted); font-size: 14px; padding: 50px 24px; line-height: 2; }
        .tip-text strong { color: var(--primary); }
        .tip-text .tip-icon { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.7; }
        .hidden { display: none !important; }
        .content-area::-webkit-scrollbar { width: 6px; }
        .content-area::-webkit-scrollbar-track { background: rgba(201, 100, 66, 0.05); border-radius: 3px; }
        .content-area::-webkit-scrollbar-thumb { background: linear-gradient(180deg, var(--primary-light), var(--primary)); border-radius: 3px; }
        .content-area::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, var(--primary), var(--primary-dark)); }
        .chat-messages::-webkit-scrollbar { width: 5px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(156, 139, 128, 0.25); border-radius: 3px; }
        .chat-messages::-webkit-scrollbar-thumb:hover { background: rgba(156, 139, 128, 0.45); }
        input[type="number"] { -moz-appearance: textfield; }
        input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .range-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .range-buttons { display: flex; gap: 8px; }
        .range-inputs { display: flex; gap: 14px; align-items: center; }
        .range-inputs input { flex: 1; }
        .range-separator { color: var(--text-muted); font-size: 18px; font-weight: 300; }
        .shortcut-hint { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text-muted); margin-top: 12px; }
        .kbd { display: inline-flex; padding: 3px 7px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 5px; font-family: 'JetBrains Mono', monospace; font-size: 10px; box-shadow: var(--shadow-sm); }
        .toast { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--text-main); color: var(--text-inverse); padding: 12px 20px; border-radius: var(--radius-md); font-size: 12px; font-weight: 500; box-shadow: var(--shadow-lg); z-index: 10000; opacity: 0; pointer-events: none; transition: all var(--transition-normal); display: flex; align-items: center; gap: 8px; max-width: 90%; text-align: center; }
        .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
        .toast.error { background: var(--danger); }
            `;
        },

        render() {
            const arrowLeft = `<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`;
            const sendIcon = `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
            const arrowUpIcon = `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`;
            const arrowDownIcon = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`;

            const html = `
                <!-- 悬浮按钮 -->
                <div id="toggle-btn" title="拖动改变位置，点击展开/关闭 (Ctrl+Shift+S)">${arrowLeft}</div>
                <!-- 侧边栏 -->
                <div class="sidebar-panel" id="sidebar">
                    <div class="resize-handle" id="resizer"></div>
                    <div class="toast" id="toast"></div>
                    <!-- Header -->
                    <div class="header">
                        <div class="header-title">
                            <div class="header-title-icon">🧠</div>
                            智能总结
                        </div>
                        <div class="header-actions">
                            <button class="icon-btn" id="btn-theme" data-tooltip="切换主题">🌙</button>
                            <button class="icon-btn" id="btn-close" data-tooltip="关闭">✕</button>
                        </div>
                    </div>
                    <!-- Tab 导航 -->
                    <div class="tab-bar">
                        <div class="tab-item active" data-tab="summary"><span>📝 总结</span></div>
                        <div class="tab-item" data-tab="chat"><span>💬 对话</span></div>
                        <div class="tab-item" data-tab="export"><span>📦 导出</span></div>
                        <div class="tab-item" data-tab="settings"><span>⚙️ 设置</span></div>
                    </div>
                    <!-- 内容区 -->
                    <div class="content-area">
                        <!-- 总结页面 -->
                        <div id="page-summary" class="view-page active">
                            <div class="form-group">
                                <div class="range-header">
                                    <label class="form-label" style="margin:0;">楼层范围</label>
                                    <div class="range-buttons">
                                        <button class="btn-xs" id="range-all">全部</button>
                                        <button class="btn-xs" id="range-recent">最近<span id="recent-count">50</span></button>
                                    </div>
                                </div>
                                <div class="range-inputs">
                                    <input type="number" id="inp-start" placeholder="起始楼层" min="1">
                                    <span class="range-separator">→</span>
                                    <input type="number" id="inp-end" placeholder="结束楼层" min="1">
                                </div>
                            </div>
                            <button class="btn" id="btn-summary">
                                <div class="spinner"></div>
                                <span class="btn-text">✨ 开始智能总结</span>
                            </button>
                            <div id="summary-result" class="result-box empty">
                                <div class="tip-text">
                                    <span class="tip-icon">🤖</span>
                                    点击「开始智能总结」后，<br>AI 将分析帖子内容并生成摘要<br><br>
                                    💡 总结完成后可切换到<strong>「对话」</strong>继续追问
                                </div>
                            </div>
                            <div class="shortcut-hint">
                                <span class="kbd">Ctrl</span>+<span class="kbd">Shift</span>+<span class="kbd">S</span> 快速打开
                            </div>
                        </div>
                        <!-- 对话页面 -->
                        <div id="page-chat" class="view-page">
                            <div class="chat-container">
                                <div class="chat-toolbar">
                                    <div class="chat-toolbar-title">
                                        对话记录
                                        <span class="msg-count" id="msg-count">0</span>
                                    </div>
                                    <button class="btn-clear" id="btn-clear-chat" title="清空对话">
                                        🗑️ 清空
                                    </button>
                                </div>
                                <div class="chat-messages-wrapper">
                                    <div class="scroll-buttons top-area">
                                        <button class="scroll-btn" id="btn-scroll-top" title="滚动到顶部">${arrowUpIcon}</button>
                                    </div>
                                    <div class="chat-messages" id="chat-messages">
                                        <div id="chat-list" class="chat-list"></div>
                                        <div id="chat-empty" class="tip-text">
                                            <span class="tip-icon">💬</span>
                                            请先在<strong>「总结」</strong>页面生成内容摘要，<br>然后即可基于上下文进行对话
                                        </div>
                                    </div>
                                    <div class="scroll-buttons bottom-area">
                                        <button class="scroll-btn" id="btn-scroll-bottom" title="滚动到底部">${arrowDownIcon}</button>
                                    </div>
                                </div>
                                <div class="chat-input-area">
                                    <div class="chat-input-row">
                                        <textarea id="chat-input" class="chat-input" placeholder="输入你的问题... (Enter 发送)" rows="1"></textarea>
                                        <button class="send-btn" id="btn-send" title="发送消息">${sendIcon}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 导出页面 -->
                        <div id="page-export" class="view-page">
                            <div class="form-group">
                                <label class="form-label">导出类型</label>
                                <select id="export-type">
                                    <option value="html">HTML 离线导出</option>
                                    <option value="ai-text">AI 文本导出</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <div class="range-header">
                                    <label class="form-label" style="margin:0;">导出范围</label>
                                    <div class="range-buttons">
                                        <button class="btn-xs" id="export-range-all">全部</button>
                                        <button class="btn-xs" id="export-range-recent">最近<span id="export-recent-count">50</span></button>
                                    </div>
                                </div>
                                <div class="range-inputs">
                                    <input type="number" id="export-start" placeholder="起始楼层" min="1">
                                    <span class="range-separator">→</span>
                                    <input type="number" id="export-end" placeholder="结束楼层" min="1">
                                </div>
                            </div>
                            <div id="html-export-options" class="form-group">
                                <label class="form-label">HTML 导出选项</label>
                                <div class="setting-item-row" style="margin-bottom:12px;">
                                    <div class="setting-info">
                                        <label class="setting-label" style="font-size:13px;">离线图片</label>
                                        <div class="setting-desc" style="font-size:11px;">将图片转为 base64 嵌入</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="export-offline-images" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <label class="setting-label" style="font-size:13px;margin-bottom:8px;">主题选择</label>
                                <select id="export-theme">
                                    <option value="light">浅色主题</option>
                                    <option value="dark">深色主题</option>
                                </select>
                            </div>
                            <div id="ai-text-options" class="form-group" style="display:none;">
                                <label class="form-label">AI 文本选项</label>
                                <div class="setting-item-row" style="margin-bottom:12px;">
                                    <div class="setting-info">
                                        <label class="setting-label" style="font-size:13px;">包含头部信息</label>
                                        <div class="setting-desc" style="font-size:11px;">标题、作者、时间等</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="export-ai-header" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="setting-item-row" style="margin-bottom:12px;">
                                    <div class="setting-info">
                                        <label class="setting-label" style="font-size:13px;">包含图片链接</label>
                                        <div class="setting-desc" style="font-size:11px;">保留图片 URL</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="export-ai-images" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="setting-item-row">
                                    <div class="setting-info">
                                        <label class="setting-label" style="font-size:13px;">包含引用块</label>
                                        <div class="setting-desc" style="font-size:11px;">保留引用内容</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="export-ai-quotes" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <button class="btn" id="btn-export">
                                <div class="spinner"></div>
                                <span class="btn-text">📦 开始导出</span>
                            </button>
                            <div id="export-status" class="result-box empty" style="margin-top:16px;min-height:100px;">
                                <div class="tip-text">
                                    <span class="tip-icon">📦</span>
                                    选择导出类型和范围后，<br>点击「开始导出」即可下载文件
                                </div>
                            </div>
                        </div>
                        <!-- 设置页面 -->
                        <div id="page-settings" class="view-page settings-page">
                            <div class="settings-group">
                                <div class="settings-group-title">API 配置</div>
                                <div class="setting-item">
                                    <label class="setting-label">API 地址</label>
                                    <input type="text" id="cfg-url" placeholder="https://api.deepseek.com/v1/chat/completions">
                                </div>
                                <div class="setting-item">
                                    <label class="setting-label">API Key</label>
                                    <input type="password" id="cfg-key" placeholder="sk-...">
                                </div>
                                <div class="setting-item">
                                    <label class="setting-label">模型名称</label>
                                    <input type="text" id="cfg-model" placeholder="deepseek-chat">
                                </div>
                            </div>
                            <div class="settings-group">
                                <div class="settings-group-title">提示词配置</div>
                                <div class="setting-item">
                                    <label class="setting-label">总结提示词</label>
                                    <div class="setting-desc">用于生成帖子摘要时的系统指令</div>
                                    <textarea id="cfg-prompt-sum" rows="4"></textarea>
                                </div>
                                <div class="setting-item">
                                    <label class="setting-label">对话提示词</label>
                                    <div class="setting-desc">用于后续追问时的系统指令</div>
                                    <textarea id="cfg-prompt-chat" rows="4"></textarea>
                                </div>
                            </div>
                            <div class="settings-group">
                                <div class="settings-group-title">高级设置</div>
                                <div class="setting-item setting-item-row">
                                    <div class="setting-info">
                                        <label class="setting-label">快捷楼层数</label>
                                        <div class="setting-desc">"最近N楼"按钮的楼层数量</div>
                                    </div>
                                    <input type="number" id="cfg-recent-floors" min="10" max="500" style="width:80px; text-align:center; padding:8px 12px;">
                                </div>
                                <div class="setting-item setting-item-row">
                                    <div class="setting-info">
                                        <label class="setting-label">流式输出</label>
                                        <div class="setting-desc">开启后内容会逐字显示，关闭则等待完成后一次性显示</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="cfg-stream" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="setting-item setting-item-row">
                                    <div class="setting-info">
                                        <label class="setting-label">自动滚动</label>
                                        <div class="setting-desc">生成内容时自动滚动到最新位置（正文和思考内容）</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="cfg-autoscroll" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <button class="btn" id="btn-save">💾 保存设置</button>
                        </div>
                    </div>
                </div>
            `;
            this.uiManager.shadow.innerHTML += html;
        },

        //
        // 3. 事件绑定与处理
        //
        bindEvents() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const btn = Q('#toggle-btn');

            this.uiManager.shadow.addEventListener('click', (e) => {
                const toggle = e.target.closest('[data-thinking-toggle]');
                if (toggle) {
                    const block = toggle.closest('[data-thinking-block]');
                    if (block) block.classList.toggle('expanded');
                }
            });

            let isDrag = false, hasMoved = false, startX, startY, startRect;
            btn.addEventListener('mousedown', (e) => {
                isDrag = true; hasMoved = false;
                startX = e.clientX; startY = e.clientY;
                startRect = btn.getBoundingClientRect();
                if (!this.isOpen) btn.style.transition = 'none';
                btn.style.cursor = 'grabbing';
                e.preventDefault();
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDrag) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;
                if (!this.isOpen && hasMoved) {
                    btn.style.left = `${startRect.left + dx}px`;
                    btn.style.top = `${startRect.top + dy}px`;
                    btn.style.right = 'auto';
                    btn.className = 'btn-floating';
                }
            });

            window.addEventListener('mouseup', (e) => {
                if (!isDrag) return;
                isDrag = false;
                btn.style.cursor = 'grab';
                btn.style.transition = '';

                if (hasMoved && !this.isOpen) {
                    const btnRect = btn.getBoundingClientRect();
                    this.side = (btnRect.left + btnRect.width / 2) < window.innerWidth / 2 ? 'left' : 'right';
                    let newTop = Math.max(10, Math.min(btnRect.top, window.innerHeight - 60));
                    this.btnPos = { side: this.side, top: `${newTop}px` };
                    GM_setValue('style1_btnPos', this.btnPos);
                    btn.style.top = `${newTop}px`;
                    this.applySideState();
                } else if (!hasMoved) {
                    this.toggleSidebar();
                }
            });

            Q('#btn-close').onclick = () => this.toggleSidebar();
            Q('#btn-theme').onclick = () => this.toggleTheme();

            Q('.tab-bar').addEventListener('click', (e) => {
                const tab = e.target.closest('.tab-item');
                if (tab) this.switchTab(tab.dataset.tab);
            });

            let isResizing = false;
            Q('#resizer').addEventListener('mousedown', (e) => {
                isResizing = true;
                document.body.style.cursor = 'col-resize';
                Q('#sidebar').style.transition = 'none';
                document.body.style.transition = 'none';
                e.preventDefault();
            });

            window.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                let newW = this.side === 'right' ? (window.innerWidth - e.clientX) : e.clientX;
                if (newW > 320 && newW < 700) {
                    this.sidebarWidth = newW;
                    this.uiManager.host.style.setProperty('--sidebar-width', `${newW}px`);
                    if (this.isOpen) {
                        this.squeezeBody(true);
                        this.updateButtonPosition(false);
                    }
                }
            });

            window.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.cursor = '';
                    Q('#sidebar').style.transition = '';
                    document.body.style.transition = 'margin 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
                    GM_setValue('style1_sidebarWidth', this.sidebarWidth);
                }
            });

            Q('#range-all').onclick = () => this.setRange('all');
            Q('#range-recent').onclick = () => this.setRange('recent');
            Q('#btn-summary').onclick = () => this.doSummary();
            Q('#btn-send').onclick = () => this.doChat();
            Q('#chat-input').onkeydown = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.doChat(); }
            };
            Q('#chat-input').addEventListener('input', (e) => {
                const el = e.target;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 140) + 'px';
            });
            Q('#btn-clear-chat').onclick = () => this.clearChat();
            Q('#btn-scroll-top').onclick = () => this.scrollToTop();
            Q('#btn-scroll-bottom').onclick = () => this.forceScrollToBottom();

            const chatMessages = Q('#chat-messages');
            let lastScrollTop = 0;
            chatMessages.addEventListener('scroll', () => {
                const currentScrollTop = chatMessages.scrollTop;
                const isNearBottom = (chatMessages.scrollHeight - currentScrollTop - chatMessages.clientHeight) < 80;
                if (this.isGenerating && !this.isProgrammaticScroll) {
                    this.userScrolledUp = currentScrollTop < lastScrollTop - 10 ? true : (isNearBottom ? false : this.userScrolledUp);
                }
                lastScrollTop = currentScrollTop;
                this.updateScrollButtons();
            });

            Q('#btn-save').onclick = () => {
                GM_setValue('apiUrl', Q('#cfg-url').value.trim());
                GM_setValue('apiKey', Q('#cfg-key').value.trim());
                GM_setValue('model', Q('#cfg-model').value.trim());
                GM_setValue('prompt_sum', Q('#cfg-prompt-sum').value);
                GM_setValue('prompt_chat', Q('#cfg-prompt-chat').value);
                const recentFloors = parseInt(Q('#cfg-recent-floors').value) || 50;
                GM_setValue('recentFloors', Math.max(10, Math.min(500, recentFloors)));
                Q('#recent-count').textContent = GM_getValue('recentFloors', 50);
                Q('#export-recent-count').textContent = recentFloors;
                GM_setValue('useStream', Q('#cfg-stream').checked);
                GM_setValue('autoScroll', Q('#cfg-autoscroll').checked);
                this.showToast('设置已保存', 'success');
                this.switchTab('summary');
            };

            // 导出功能事件绑定
            Q('#export-type').onchange = (e) => {
                const isHtml = e.target.value === 'html';
                Q('#html-export-options').style.display = isHtml ? 'block' : 'none';
                Q('#ai-text-options').style.display = isHtml ? 'none' : 'block';
            };
            Q('#export-range-all').onclick = () => this.setExportRange('all');
            Q('#export-range-recent').onclick = () => this.setExportRange('recent');
            Q('#btn-export').onclick = () => this.doExport();
        },

        bindKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') { e.preventDefault(); this.toggleSidebar(); }
                if (e.key === 'Escape' && this.isOpen) { this.toggleSidebar(); }
            });
        },

        //
        // 4. 状态与UI更新
        //
        restoreState() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            this.uiManager.host.style.setProperty('--sidebar-width', `${this.sidebarWidth}px`);
            const btn = Q('#toggle-btn');
            btn.style.top = this.btnPos.top;
            this.applySideState();
            if (this.isDarkTheme) {
                this.uiManager.host.classList.add('dark-theme');
                Q('#btn-theme').textContent = '☀️';
            }

            Q('#cfg-url').value = GM_getValue('apiUrl', 'https://api.deepseek.com/v1/chat/completions');
            Q('#cfg-key').value = GM_getValue('apiKey', '');
            Q('#cfg-model').value = GM_getValue('model', 'deepseek-chat');
            Q('#cfg-prompt-sum').value = GM_getValue('prompt_sum', '请总结以下论坛帖子内容。使用 Markdown 格式，条理清晰，重点突出主要观点、争议点和结论。适当使用标题、列表和引用来组织内容。');
            Q('#cfg-prompt-chat').value = GM_getValue('prompt_chat', '你是一个帖子阅读助手。基于上文中的帖子内容，回答用户的问题。回答要准确、简洁，必要时引用原文。');
            const recentFloors = GM_getValue('recentFloors', 50);
            Q('#cfg-recent-floors').value = recentFloors;
            Q('#recent-count').textContent = recentFloors;
            Q('#cfg-stream').checked = GM_getValue('useStream', true);
            Q('#cfg-autoscroll').checked = GM_getValue('autoScroll', true);
        },

        applySideState() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const btn = Q('#toggle-btn');
            const sidebar = Q('#sidebar');
            const resizer = Q('#resizer');
            const arrowLeft = `<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`;
            const arrowRight = `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>`;

            btn.style.left = ''; btn.style.right = '';

            if (this.side === 'left') {
                sidebar.className = 'sidebar-panel panel-left' + (this.isOpen ? ' open' : '');
                resizer.className = 'resize-handle handle-left';
                btn.className = 'btn-snap-left' + (this.isOpen ? ' arrow-flip' : '');
                btn.innerHTML = arrowRight;
            } else {
                sidebar.className = 'sidebar-panel panel-right' + (this.isOpen ? ' open' : '');
                resizer.className = 'resize-handle handle-right';
                btn.className = 'btn-snap-right' + (this.isOpen ? ' arrow-flip' : '');
                btn.innerHTML = arrowLeft;
            }
            this.updateButtonPosition();
        },

        updateButtonPosition(useTransition = true) {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const btn = Q('#toggle-btn');
            if (!useTransition) btn.style.transition = 'none'; else btn.style.transition = '';
            if (this.side === 'left') {
                btn.style.right = 'auto';
                btn.style.left = this.isOpen ? `${this.sidebarWidth}px` : '0';
            } else {
                btn.style.left = 'auto';
                btn.style.right = this.isOpen ? `${this.sidebarWidth}px` : '0';
            }
            if (!useTransition) {
                btn.offsetHeight;
                requestAnimationFrame(() => { btn.style.transition = ''; });
            }
        },

        toggleSidebar() {
            this.isOpen = !this.isOpen;
            const Q = this.uiManager.Q.bind(this.uiManager);
            Q('#sidebar').classList.toggle('open', this.isOpen);
            Q('#toggle-btn').classList.toggle('arrow-flip', this.isOpen);
            this.squeezeBody(this.isOpen);
            if (this.isOpen) this.initRangeInputs();
            this.updateButtonPosition();
        },

        squeezeBody(active) {
            const body = document.body;
            body.style.transition = 'margin 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
            if (!active) {
                body.style.marginLeft = ''; body.style.marginRight = '';
            } else {
                if (this.side === 'left') {
                    body.style.marginLeft = `${this.sidebarWidth}px`; body.style.marginRight = '';
                } else {
                    body.style.marginRight = `${this.sidebarWidth}px`; body.style.marginLeft = '';
                }
            }
        },

        switchTab(tabName) {
            const Q = this.uiManager.Q.bind(this.uiManager);
            Q('.tab-bar').querySelectorAll('.tab-item').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
            Q('.content-area').querySelectorAll('.view-page').forEach(p => p.classList.toggle('active', p.id === `page-${tabName}`));
            this.currentTab = tabName;
            if (tabName === 'chat') setTimeout(() => this.updateScrollButtons(), 100);
        },

        toggleTheme() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            this.isDarkTheme = !this.isDarkTheme;
            GM_setValue('style1_isDarkTheme', this.isDarkTheme);
            this.uiManager.host.classList.toggle('dark-theme', this.isDarkTheme);
            Q('#btn-theme').textContent = this.isDarkTheme ? '☀️' : '🌙';
        },

        setLoading(btnId, isLoading) {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const btn = Q(btnId);
            this.isGenerating = isLoading;
            btn.disabled = isLoading;
            btn.classList.toggle('loading', isLoading);
            if (btnId === '#btn-send') {
                const input = Q('#chat-input');
                if (input) {
                    input.disabled = isLoading;
                    input.placeholder = isLoading ? '正在生成回复...' : '输入你的问题... (Enter 发送)';
                }
            }
        },

        //
        // 5. 核心功能交互
        //
        async doSummary() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const tid = Core.getTopicId();
            const start = Q('#inp-start').value, end = Q('#inp-end').value;
            if (!tid) return this.showToast('未检测到帖子ID', 'error');
            if (!start || !end || parseInt(start) > parseInt(end)) return this.showToast('楼层范围无效', 'error');

            this.setLoading('#btn-summary', true);
            const resultBox = Q('#summary-result');
            resultBox.classList.remove('empty');
            resultBox.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><div class="thinking"><div class="thinking-dot"></div><div class="thinking-dot"></div><div class="thinking-dot"></div></div>正在获取帖子内容...</div>`;

            try {
                const text = await Core.fetchDialogues(tid, parseInt(start), parseInt(end));
                if (!text) throw new Error('未获取到内容');
                this.postContent = text;
                resultBox.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><div class="thinking"><div class="thinking-dot"></div><div class="thinking-dot"></div><div class="thinking-dot"></div></div>AI 正在分析中...</div>`;

                const messages = [
                    { role: 'system', content: GM_getValue('prompt_sum', '') },
                    { role: 'user', content: `帖子内容:\n${text}` }
                ];

                let aiText = '';
                await Core.streamChat(messages,
                    (chunk) => {
                        aiText += chunk;
                        this.updateResultBox(resultBox, aiText, true);
                    },
                    () => {
                        this.setLoading('#btn-summary', false);
                        this.updateResultBox(resultBox, aiText, false);
                        this.lastSummary = aiText;
                        this.chatHistory = [
                            { role: 'system', content: GM_getValue('prompt_chat', '') },
                            { role: 'user', content: `以下是帖子内容供你参考:\n${text}` },
                            { role: 'assistant', content: aiText }
                        ];
                        Q('#chat-list').innerHTML = '';
                        this.userMessageCount = 0;
                        this.updateMessageCount();
                        Q('#chat-empty').classList.remove('hidden');
                        Q('#chat-empty').innerHTML = '<span class="tip-icon">✅</span>总结已完成！<br>现在可以基于帖子内容进行对话';
                    },
                    (err) => {
                        resultBox.innerHTML = `<div style="color:var(--danger)">❌ 错误: ${err}</div>`;
                        this.setLoading('#btn-summary', false);
                        this.showToast('总结失败: ' + err, 'error');
                    }
                );
            } catch (e) {
                resultBox.innerHTML = `<div style="color:var(--danger)">❌ 错误: ${e.message}</div>`;
                this.setLoading('#btn-summary', false);
            }
        },

        async doChat() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            if (this.isGenerating) return;
            if (this.chatHistory.length === 0) return this.showToast('请先生成总结', 'error');

            const input = Q('#chat-input');
            const txt = input.value.trim();
            if (!txt) return;

            input.value = '';
            input.style.height = 'auto';
            Q('#chat-empty').classList.add('hidden');
            this.userScrolledUp = false;

            this.addBubble('user', txt);
            this.chatHistory.push({ role: 'user', content: txt });
            this.userMessageCount++;
            this.updateMessageCount();

            const msgDiv = this.addBubble('ai', '');
            msgDiv.innerHTML = `<div class="thinking"><div class="thinking-dot"></div><div class="thinking-dot"></div><div class="thinking-dot"></div></div>`;
            let aiText = '';

            this.setLoading('#btn-send', true);

            await Core.streamChat(this.chatHistory,
                (chunk) => {
                    aiText += chunk;
                    this.updateBubble(msgDiv, aiText, true);
                    this.scrollToBottom();
                },
                () => {
                    this.updateBubble(msgDiv, aiText, false);
                    this.chatHistory.push({ role: 'assistant', content: aiText });
                    this.setLoading('#btn-send', false);
                    this.userScrolledUp = false;
                    this.updateScrollButtons();
                },
                (err) => {
                    msgDiv.innerHTML += `<br><span style="color:var(--danger)">❌ ${err}</span>`;
                    this.setLoading('#btn-send', false);
                }
            );
        },

        //
        // 6. 辅助/工具方法
        //
        initRangeInputs() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const max = Core.getReplyCount();
            const start = Q('#inp-start'), end = Q('#inp-end');
            if (!start.value) start.value = 1;
            if (max && !end.value) end.value = max;
        },

        setRange(type) {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const max = Core.getReplyCount();
            if (!max) return;
            Q('#inp-end').value = max;
            const recentFloors = GM_getValue('recentFloors', 50);
            Q('#inp-start').value = type === 'all' ? 1 : Math.max(1, max - recentFloors + 1);
        },

        updateResultBox(resultBox, text, isStreaming) {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const currentBlock = resultBox.querySelector('[data-thinking-block]');
            const isExpanded = currentBlock?.classList.contains('expanded') || false;

            const contentHTML = this.renderWithThinking(text, isStreaming, isExpanded);
            resultBox.innerHTML = `
                <div class="result-actions">
                    <button class="result-action-btn" id="btn-copy-summary">📋 复制</button>
                </div>
            ` + contentHTML;

            const copyBtn = Q('#btn-copy-summary');
            if (copyBtn) {
                copyBtn.onclick = () => {
                    this.copyToClipboard(Core.parseThinkingContent(text).content);
                    copyBtn.classList.add('copied');
                    copyBtn.textContent = '✓ 已复制';
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.textContent = '📋 复制';
                    }, 2000);
                };
            }
            if (GM_getValue('autoScroll', true)) {
                setTimeout(() => {
                    resultBox.scrollTop = resultBox.scrollHeight;
                    const thinkingInner = resultBox.querySelector('.thinking-content-inner');
                    if (thinkingInner && isExpanded) {
                        thinkingInner.scrollTop = thinkingInner.scrollHeight;
                    }
                }, 0);
            }
        },

        updateBubble(bubbleDiv, text, isStreaming) {
            const currentBlock = bubbleDiv.querySelector('[data-thinking-block]');
            const isExpanded = currentBlock?.classList.contains('expanded') || false;
            bubbleDiv.innerHTML = this.renderWithThinking(text, isStreaming, isExpanded);
            if (GM_getValue('autoScroll', true) && isExpanded) {
                setTimeout(() => {
                    const thinkingInner = bubbleDiv.querySelector('.thinking-content-inner');
                    if (thinkingInner) thinkingInner.scrollTop = thinkingInner.scrollHeight;
                }, 0);
            }
        },

        addBubble(role, text) {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const div = document.createElement('div');
            div.className = `bubble bubble-${role}`;
            div.innerHTML = role === 'user' ? text : this.renderWithThinking(text);
            Q('#chat-list').appendChild(div);
            this.scrollToBottom();
            return div;
        },

        renderWithThinking(text, isStreaming = false, keepExpanded = false) {
            const { thinking, content } = Core.parseThinkingContent(text);
            const arrowIcon = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`;
            let html = '';
            if (thinking) {
                const charCount = thinking.length;
                const streamingClass = isStreaming ? ' streaming' : '';
                const expandedClass = keepExpanded ? ' expanded' : '';
                const statusText = isStreaming ? '思考中...' : `${charCount} 字`;
                const previewText = thinking.split('\n').filter(l => l.trim()).slice(-4).join('\n').slice(-150);
                const thinkingHtml = DOMPurify.sanitize(marked.parse(thinking));
                const previewHtml = DOMPurify.sanitize(marked.parse(previewText));
                html += `<div class="thinking-block${streamingClass}${expandedClass}" data-thinking-block>
                             <div class="thinking-header" data-thinking-toggle>
                                 <div class="thinking-header-left">
                                     <div class="thinking-icon">🧠</div><span class="thinking-title">思考过程</span>
                                     <span class="thinking-status">${statusText}</span>
                                 </div>
                                 <div class="thinking-toggle">${arrowIcon}</div>
                             </div>
                             <div class="thinking-preview">${previewHtml}</div>
                             <div class="thinking-content"><div class="thinking-content-inner">${thinkingHtml}</div></div>
                         </div>`;
            }
            if (content) {
                html += DOMPurify.sanitize(marked.parse(content));
            }
            return html;
        },

        showToast(message, type = '') {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const toast = Q('#toast');
            toast.textContent = message;
            toast.className = 'toast' + (type ? ` ${type}` : '');
            requestAnimationFrame(() => toast.classList.add('show'));
            setTimeout(() => toast.classList.remove('show'), 2500);
        },

        copyToClipboard(text) {
            GM_setClipboard(text, 'text');
            this.showToast('已复制到剪贴板');
        },

        updateScrollButtons() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const el = Q('#chat-messages');
            const showTop = el.scrollTop > 50;
            const showBottom = (el.scrollHeight - el.scrollTop - el.clientHeight) > 50;
            Q('#btn-scroll-top').classList.toggle('visible', showTop);
            Q('#btn-scroll-bottom').classList.toggle('visible', showBottom || (this.isGenerating && this.userScrolledUp));
            Q('#btn-scroll-bottom').classList.toggle('generating', this.isGenerating && this.userScrolledUp);
        },

        scrollToTop() { Q('#chat-messages').scrollTo({ top: 0, behavior: 'smooth' }); },

        scrollToBottom(force = false) {
            if (!force && (!GM_getValue('autoScroll', true) || this.userScrolledUp)) return this.updateScrollButtons();
            const el = this.uiManager.Q('#chat-messages');
            this.isProgrammaticScroll = true;
            setTimeout(() => {
                el.scrollTop = el.scrollHeight;
                setTimeout(() => { this.isProgrammaticScroll = false; this.updateScrollButtons(); }, 50);
            }, 0);
        },

        forceScrollToBottom() {
            this.userScrolledUp = false;
            this.scrollToBottom(true);
        },

        clearChat() {
            if (this.chatHistory.length === 0) return;
            if (confirm('确定要清空所有对话记录吗？\n（总结上下文将保留）')) {
                if (this.chatHistory.length > 3) this.chatHistory = this.chatHistory.slice(0, 3);
                this.uiManager.Q('#chat-list').innerHTML = '';
                this.userMessageCount = 0;
                this.updateMessageCount();
                const emptyDiv = this.uiManager.Q('#chat-empty');
                emptyDiv.classList.remove('hidden');
                emptyDiv.innerHTML = '<span class="tip-icon">💬</span>对话已清空<br>可以继续基于帖子内容提问';
                this.showToast('对话已清空');
            }
        },

        updateMessageCount() {
            this.uiManager.Q('#msg-count').textContent = this.userMessageCount;
        },

        // 导出功能相关方法
        setExportRange(type) {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const max = Core.getReplyCount();
            if (!max) return;
            Q('#export-end').value = max;
            const recentFloors = GM_getValue('recentFloors', 50);
            Q('#export-start').value = type === 'all' ? 1 : Math.max(1, max - recentFloors + 1);
        },

        async doExport() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const tid = Core.getTopicId();
            const exportType = Q('#export-type').value;
            const start = parseInt(Q('#export-start').value);
            const end = parseInt(Q('#export-end').value);

            if (!tid) return this.showToast('未检测到帖子ID', 'error');
            if (!start || !end || start > end) return this.showToast('楼层范围无效', 'error');

            this.setLoading('#btn-export', true);
            const statusBox = Q('#export-status');
            statusBox.classList.remove('empty');
            statusBox.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><div class="thinking"><div class="thinking-dot"></div><div class="thinking-dot"></div><div class="thinking-dot"></div></div>正在获取帖子数据...</div>`;

            try {
                // 获取帖子数据
                const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
                const opts = { headers: { 'x-csrf-token': csrf, 'x-requested-with': 'XMLHttpRequest' } };

                const topicRes = await fetch(`https://linux.do/t/${tid}.json`, opts);
                const topicData = await topicRes.json();

                const idRes = await fetch(`https://linux.do/t/${tid}/post_ids.json?post_number=0&limit=99999`, opts);
                const idData = await idRes.json();
                let pIds = idData.post_ids.slice(Math.max(0, start - 1), end);

                if (start <= 1) {
                    const firstId = topicData.post_stream.posts[0].id;
                    if (!pIds.includes(firstId)) pIds.unshift(firstId);
                }

                statusBox.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><div class="thinking"><div class="thinking-dot"></div><div class="thinking-dot"></div><div class="thinking-dot"></div></div>正在处理 ${pIds.length} 条回复...</div>`;

                let allPosts = [];
                for (let i = 0; i < pIds.length; i += 200) {
                    const chunk = pIds.slice(i, i + 200);
                    const q = chunk.map(id => `post_ids[]=${id}`).join('&');
                    const res = await fetch(`https://linux.do/t/${tid}/posts.json?${q}&include_suggested=false`, opts);
                    const data = await res.json();
                    allPosts.push(...data.post_stream.posts);
                }

                allPosts.sort((a, b) => a.post_number - b.post_number);

                if (exportType === 'html') {
                    await this.exportAsHtml(topicData, allPosts, statusBox);
                } else {
                    await this.exportAsAiText(topicData, allPosts, statusBox);
                }

                this.setLoading('#btn-export', false);
            } catch (e) {
                statusBox.innerHTML = `<div style="color:var(--danger)">❌ 导出失败: ${e.message}</div>`;
                this.setLoading('#btn-export', false);
                this.showToast('导出失败: ' + e.message, 'error');
            }
        },

        async exportAsHtml(topicData, posts, statusBox) {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const offlineImages = Q('#export-offline-images').checked;
            const theme = Q('#export-theme').value;

            statusBox.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><div class="thinking"><div class="thinking-dot"></div><div class="thinking-dot"></div><div class="thinking-dot"></div></div>正在生成 HTML...</div>`;

            const title = Core.escapeHtml(topicData.title);
            const author = Core.escapeHtml(topicData.details?.created_by?.username || '未知');
            const createTime = new Date(topicData.created_at).toLocaleString('zh-CN');

            let postsHtml = '';
            for (const post of posts) {
                const userName = Core.escapeHtml(post.name || post.username);
                const username = Core.escapeHtml(post.username);
                const postTime = new Date(post.created_at).toLocaleString('zh-CN');
                let content = post.cooked;

                // 处理图片
                if (offlineImages && Core.postHasImage(post)) {
                    statusBox.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><div class="thinking"><div class="thinking-dot"></div><div class="thinking-dot"></div><div class="thinking-dot"></div></div>正在处理第 ${post.post_number} 楼的图片...</div>`;

                    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
                    const matches = [...content.matchAll(imgRegex)];

                    for (const match of matches) {
                        try {
                            const imgUrl = Core.absoluteUrl(match[1]);
                            const response = await fetch(imgUrl);
                            const blob = await response.blob();
                            const base64 = await new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.readAsDataURL(blob);
                            });
                            content = content.replace(match[1], base64);
                        } catch (e) {
                            console.warn('图片转换失败:', match[1], e);
                        }
                    }
                }

                postsHtml += `
                    <div class="post" id="post-${post.post_number}">
                        <div class="post-header">
                            <div class="post-author">
                                <strong>${userName}</strong>
                                <span class="username">@${username}</span>
                            </div>
                            <div class="post-meta">
                                <span class="post-number">#${post.post_number}</span>
                                <span class="post-time">${postTime}</span>
                            </div>
                        </div>
                        <div class="post-content">${content}</div>
                    </div>
                `;
            }

            const themeColors = theme === 'dark' ? {
                bg: '#1a1a1a',
                card: '#2d2d2d',
                text: '#e0e0e0',
                textSec: '#b0b0b0',
                border: '#404040',
                primary: '#E3A043'
            } : {
                bg: '#f5f5f5',
                card: '#ffffff',
                text: '#333333',
                textSec: '#666666',
                border: '#e0e0e0',
                primary: '#E3A043'
            };

            const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Linux.do</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: ${themeColors.bg}; color: ${themeColors.text}; line-height: 1.6; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; }
        .header { background: ${themeColors.card}; padding: 30px; border-radius: 8px; margin-bottom: 20px; border: 1px solid ${themeColors.border}; }
        .header h1 { font-size: 28px; margin-bottom: 15px; color: ${themeColors.text}; }
        .header-meta { color: ${themeColors.textSec}; font-size: 14px; }
        .post { background: ${themeColors.card}; padding: 20px; border-radius: 8px; margin-bottom: 15px; border: 1px solid ${themeColors.border}; }
        .post-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid ${themeColors.border}; }
        .post-author strong { color: ${themeColors.text}; font-size: 16px; }
        .username { color: ${themeColors.textSec}; font-size: 14px; margin-left: 8px; }
        .post-meta { color: ${themeColors.textSec}; font-size: 13px; }
        .post-number { color: ${themeColors.primary}; font-weight: 600; margin-right: 10px; }
        .post-content { color: ${themeColors.text}; }
        .post-content img { max-width: 100%; height: auto; border-radius: 4px; margin: 10px 0; }
        .post-content pre { background: ${theme === 'dark' ? '#1e1e1e' : '#f5f5f5'}; padding: 15px; border-radius: 4px; overflow-x: auto; }
        .post-content code { font-family: 'Courier New', monospace; }
        .post-content blockquote { border-left: 3px solid ${themeColors.primary}; padding-left: 15px; margin: 10px 0; color: ${themeColors.textSec}; }
        .footer { text-align: center; color: ${themeColors.textSec}; margin-top: 30px; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <div class="header-meta">
                作者: ${author} | 创建时间: ${createTime} | 共 ${posts.length} 条回复
            </div>
        </div>
        ${postsHtml}
        <div class="footer">
            导出自 Linux.do | 导出时间: ${new Date().toLocaleString('zh-CN')}
        </div>
    </div>
</body>
</html>`;

            const filename = `${title.replace(/[<>:"/\\|?*]/g, '_')}_${posts[0].post_number}-${posts[posts.length-1].post_number}.html`;
            Core.downloadFile(html, filename, 'text/html');

            statusBox.innerHTML = `<div style="color:var(--success)">✅ HTML 文件已导出！<br><small>文件名: ${filename}</small></div>`;
            this.showToast('HTML 导出成功');
        },

        async exportAsAiText(topicData, posts, statusBox) {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const includeHeader = Q('#export-ai-header').checked;
            const includeImages = Q('#export-ai-images').checked;
            const includeQuotes = Q('#export-ai-quotes').checked;

            statusBox.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><div class="thinking"><div class="thinking-dot"></div><div class="thinking-dot"></div><div class="thinking-dot"></div></div>正在生成 AI 文本...</div>`;

            let text = '';

            if (includeHeader) {
                text += `标题: ${topicData.title}\n`;
                text += `作者: ${topicData.details?.created_by?.username || '未知'}\n`;
                text += `创建时间: ${new Date(topicData.created_at).toLocaleString('zh-CN')}\n`;
                text += `回复数: ${posts.length}\n`;
                text += `\n${'='.repeat(50)}\n\n`;
            }

            for (const post of posts) {
                const userName = post.name || post.username;
                const username = post.username;
                const postTime = new Date(post.created_at).toLocaleString('zh-CN');

                text += `[${post.post_number}楼] ${userName}（@${username}）\n`;
                text += `时间: ${postTime}\n\n`;

                const content = Core.cookedToAiText(post.cooked, { includeImages, includeQuotes });
                text += content + '\n\n';
                text += '-'.repeat(50) + '\n\n';
            }

            const filename = `${topicData.title.replace(/[<>:"/\\|?*]/g, '_')}_${posts[0].post_number}-${posts[posts.length-1].post_number}.txt`;
            Core.downloadFile(text, filename, 'text/plain');

            statusBox.innerHTML = `<div style="color:var(--success)">✅ AI 文本已导出！<br><small>文件名: ${filename}</small></div>`;
            this.showToast('AI 文本导出成功');
        }
    });

    // -------------------------------------------------
    // UI 风格 2: 原生风格
    // -------------------------------------------------
    UIRegistry.register('style2', {
        name: 'LinuxDO沉浸风格',
        ICONS: {
            brain: `<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm1 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-7a1 1 0 0 1 0 2 1 1 0 0 1 0-2zm-2 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-7a1 1 0 0 1 0 2 1 1 0 0 1 0-2z" fill="currentColor"/></svg>`,
            summary: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
            chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
            settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
            moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
            sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
            close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
            copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
            sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
            arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
            arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
            arrowUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
            arrowDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`,
            send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
            robot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>`,
            check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        },

        init(uiManager) {
            this.uiManager = uiManager;
            this.isOpen = false;
            this.btnPos = GM_getValue('style2_btnPos', { side: 'right', top: '50%' });
            this.side = this.btnPos.side;
            this.sidebarWidth = GM_getValue('style2_sidebarWidth', 420);
            this.isDarkTheme = GM_getValue('style2_isDarkTheme', false);
            this.chatHistory = [];
            this.postContent = '';
            this.lastSummary = '';
            this.isGenerating = false;
            this.currentTab = 'summary';
            this.userMessageCount = 0;
            this.userScrolledUp = false;
            this.isProgrammaticScroll = false;
            this.render();
            this.restoreState();
            this.bindEvents();
            this.bindKeyboardShortcuts();
        },

        destroy() {},

        getStyles() {
            return `
            :host { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; --brand-gold: #E3A043; --brand-gold-hover: #d48f35; --primary: #222222; --primary-hover: #000000; --primary-light: #f0f0f0; --success: #2d9d78; --success-light: #d1fae5; --danger: #d93025; --danger-light: #fef2f2; --warning: #f2c04d; --bg-base: #F9FAFB; --bg-card: #FFFFFF; --bg-glass: rgba(255, 255, 255, 0.95); --bg-glass-dark: rgba(255, 255, 255, 0.98); --bg-hover: #F2F2F2; --bg-active: #E5E7EB; --bg-setting: #F9FAFB; --bg-input: #FFFFFF; --border-light: #E5E7EB; --border-medium: #D1D5DB; --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05); --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04); --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04); --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); --shadow-glow: 0 0 0 1px rgba(0,0,0,0.05); --text-main: #111827; --text-sec: #4B5563; --text-muted: #9CA3AF; --text-inverse: #FFFFFF; --sidebar-width: 420px; --btn-size: 42px; --radius-sm: 4px; --radius-md: 6px; --radius-lg: 8px; --radius-xl: 12px; --radius-full: 9999px; --transition-fast: 0.15s ease; --transition-normal: 0.25s ease; --transition-slow: 0.35s ease; }
            :host(.dark-theme) { --primary: #E3A043; --primary-hover: #ffb85c; --primary-light: #2D2D2D; --bg-base: #111111; --bg-card: #1E1E1E; --bg-glass: rgba(30, 30, 30, 0.95); --bg-glass-dark: rgba(20, 20, 20, 0.98); --bg-hover: #2D2D2D; --bg-active: #374151; --bg-setting: #111111; --bg-input: #2D2D2D; --border-light: #374151; --border-medium: #4B5563; --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5); --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5); --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5); --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5); --text-main: #F3F4F6; --text-sec: #D1D5DB; --text-muted: #6B7280; --text-inverse: #111827; }
            * { box-sizing: border-box; }
            .sidebar-panel { position: fixed; top: 0; bottom: 0; width: var(--sidebar-width); background: var(--bg-card); box-shadow: var(--shadow-xl); z-index: 9998; display: flex; flex-direction: column; transition: transform var(--transition-slow); border: 1px solid var(--border-light); }
            .panel-left { left: 0; border-left: none; transform: translateX(-100%); }
            .panel-left.open { transform: translateX(0); }
            .panel-right { right: 0; border-right: none; transform: translateX(100%); }
            .panel-right.open { transform: translateX(0); }
            #toggle-btn { position: fixed; width: var(--btn-size); height: var(--btn-size); background: var(--bg-card); color: var(--text-sec); box-shadow: var(--shadow-md); z-index: 9999; cursor: grab; display: flex; align-items: center; justify-content: center; user-select: none; transition: all var(--transition-normal); border: 1px solid var(--border-light); outline: none; }
            #toggle-btn:hover { background: var(--bg-hover); color: var(--brand-gold); transform: scale(1.05); }
            #toggle-btn:active { cursor: grabbing; transform: scale(0.96); }
            #toggle-btn svg { width: 20px; height: 20px; fill: none; stroke: currentColor; }
            .btn-snap-left { border-radius: 0 var(--radius-md) var(--radius-md) 0; border-left: none; }
            .btn-snap-right { border-radius: var(--radius-md) 0 0 var(--radius-md); border-right: none; }
            .btn-floating { border-radius: 50%; box-shadow: var(--shadow-lg); }
            .resize-handle { position: absolute; top: 0; bottom: 0; width: 4px; cursor: col-resize; z-index: 10001; background: transparent; transition: background var(--transition-fast); }
            .resize-handle:hover { background: var(--brand-gold); }
            .handle-left { right: -2px; } .handle-right { left: -2px; }
            .header { padding: 16px 20px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); flex-shrink: 0; }
            .header-title { font-size: 16px; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 10px; }
            .header-title-icon { color: var(--brand-gold); display: flex; align-items: center; justify-content: center; }
            .header-title-icon svg { width: 22px; height: 22px; }
            .header-actions { display: flex; gap: 4px; }
            .icon-btn { background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: var(--radius-sm); color: var(--text-muted); transition: all var(--transition-fast); display: flex; align-items: center; justify-content: center; position: relative; }
            .icon-btn svg { width: 18px; height: 18px; }
            .icon-btn:hover { background: var(--bg-hover); color: var(--text-main); }
            .icon-btn[data-tooltip]::after { content: attr(data-tooltip); position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity var(--transition-fast); z-index: 100; }
            .icon-btn[data-tooltip]:hover::after { opacity: 1; }
            .tab-bar { display: flex; padding: 0 16px; gap: 24px; border-bottom: 1px solid var(--border-light); background: var(--bg-card); flex-shrink: 0; }
            .tab-item { padding: 14px 4px; text-align: center; font-size: 14px; font-weight: 500; color: var(--text-sec); cursor: pointer; border-bottom: 2px solid transparent; transition: all var(--transition-fast); display: flex; align-items: center; gap: 6px; }
            .tab-item svg { width: 16px; height: 16px; opacity: 0.8; }
            .tab-item:hover { color: var(--text-main); }
            .tab-item.active { color: var(--brand-gold); border-bottom-color: var(--brand-gold); font-weight: 600; }
            .tab-item.active svg { opacity: 1; stroke-width: 2.5; }
            .content-area { flex: 1; overflow-y: auto; position: relative; background: var(--bg-base); }
            .view-page { padding: 20px; display: none; animation: fadeIn 0.2s ease; }
            .view-page.active { display: block; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            .form-group { margin-bottom: 20px; }
            .form-label { display: block; font-size: 12px; color: var(--text-sec); margin-bottom: 8px; font-weight: 600; }
            input, textarea, select { width: 100%; padding: 10px 12px; border: 1px solid var(--border-medium); border-radius: var(--radius-md); font-size: 14px; font-family: inherit; background: var(--bg-input); color: var(--text-main); box-sizing: border-box; transition: all var(--transition-fast); }
            input:focus, textarea:focus { outline: none; border-color: var(--brand-gold); box-shadow: 0 0 0 2px rgba(227, 160, 67, 0.15); }
            input::placeholder, textarea::placeholder { color: var(--text-muted); }
            textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
            .btn { width: 100%; padding: 10px 16px; border: none; border-radius: var(--radius-md); background: var(--primary); color: var(--text-inverse); font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all var(--transition-normal); box-shadow: var(--shadow-sm); }
            .btn svg { width: 16px; height: 16px; }
            .btn:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: var(--shadow-md); }
            .btn:active { transform: translateY(0); }
            .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
            :host(.dark-theme) .btn { color: #111; }
            .btn-xs { padding: 4px 10px; font-size: 12px; background: var(--bg-card); color: var(--text-sec); border-radius: var(--radius-sm); border: 1px solid var(--border-medium); cursor: pointer; white-space: nowrap; transition: all var(--transition-fast); }
            .btn-xs:hover { color: var(--brand-gold); border-color: var(--brand-gold); }
            .result-box { margin-top: 16px; padding: 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-lg); font-size: 14px; line-height: 1.7; color: var(--text-main); min-height: 150px; max-height: calc(100vh - 350px); overflow-y: auto; overflow-x: hidden; word-break: break-word; overflow-wrap: break-word; white-space: normal; width: 100%; box-sizing: border-box; position: relative; }
            .result-box.empty { display: flex; align-items: center; justify-content: center; background: var(--bg-base); }
            .result-actions { position: absolute; top: 10px; right: 10px; opacity: 0; transition: opacity var(--transition-fast); }
            .result-box:hover .result-actions { opacity: 1; }
            .result-action-btn { padding: 4px 10px; font-size: 12px; background: var(--bg-card); color: var(--text-sec); border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; gap: 4px; box-shadow: var(--shadow-sm); }
            .result-action-btn:hover { border-color: var(--brand-gold); color: var(--brand-gold); }
            .result-action-btn.copied { border-color: var(--success); color: var(--success); }
            .result-action-btn svg { width: 12px; height: 12px; }
            .result-box h1, .result-box h2, .result-box h3 { margin: 16px 0 8px; font-weight: 600; color: var(--text-main); }
            .result-box h1 { font-size: 1.4em; }
            .result-box h2 { font-size: 1.2em; border-bottom: 1px solid var(--border-light); padding-bottom: 6px; }
            .result-box h3 { font-size: 1.1em; color: var(--text-sec); }
            .result-box p { margin-bottom: 10px; }
            .result-box ul, .result-box ol { padding-left: 20px; margin: 10px 0; }
            .result-box li { margin-bottom: 6px; }
            .result-box li::marker { color: var(--brand-gold); }
            .result-box code, .bubble-ai code, .thinking-content code, .result-box pre code, .bubble-ai pre code, .thinking-content pre code { font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace !important; font-size: 13px !important; line-height: 1.5 !important; font-variant-ligatures: none; letter-spacing: 0; }
            .result-box code, .bubble-ai code, .thinking-content code:not(pre code) { background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; color: var(--text-main); border: 1px solid var(--border-medium); word-break: break-all; overflow-wrap: break-word; max-width: 100%; display: inline-block; margin: 0 2px; }
            :host(.dark-theme) .result-box code, :host(.dark-theme) .bubble-ai code, :host(.dark-theme) .thinking-content code:not(pre code) { background: rgba(255,255,255,0.1); color: #e0e0e0; border-color: rgba(255,255,255,0.2); }
            .result-box pre, .bubble-ai pre, .thinking-content-inner pre { background: var(--bg-card); padding: 16px !important; margin: 12px 0 !important; border-radius: var(--radius-md); border: 1px solid var(--border-medium); overflow-x: auto; overflow-y: auto; color: var(--text-main); white-space: pre-wrap !important; word-break: break-all; word-wrap: break-word; tab-size: 4; max-width: 100%; box-sizing: border-box; font-size: 13px !important; line-height: 1.5 !important; }
            :host(.dark-theme) .result-box pre, :host(.dark-theme) .bubble-ai pre, :host(.dark-theme) .thinking-content-inner pre { background: #1e1e1e; color: #d4d4d4; border-color: #404040; }
            .result-box pre::-webkit-scrollbar, .bubble-ai pre::-webkit-scrollbar, .thinking-content-inner pre::-webkit-scrollbar { width: 8px; height: 8px; }
            .result-box pre::-webkit-scrollbar-track, .bubble-ai pre::-webkit-scrollbar-track, .thinking-content-inner pre::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 4px; }
            .result-box pre::-webkit-scrollbar-thumb, .bubble-ai pre::-webkit-scrollbar-thumb, .thinking-content-inner pre::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); border-radius: 4px; }
            :host(.dark-theme) .result-box pre::-webkit-scrollbar-thumb, :host(.dark-theme) .bubble-ai pre::-webkit-scrollbar-thumb, :host(.dark-theme) .thinking-content-inner pre::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); }
            .result-box pre code { background: none; color: inherit; padding: 0; border: none; }
            .result-box blockquote { border-left: 3px solid var(--brand-gold); margin: 12px 0; padding: 6px 16px; color: var(--text-sec); background: var(--bg-hover); font-style: italic; }
            .result-box a { color: var(--brand-gold); text-decoration: none; border-bottom: 1px solid transparent; }
            .result-box a:hover { border-bottom-color: var(--brand-gold); }
            .result-box strong { color: var(--text-main); font-weight: 600; }
            .chat-container { display: flex; flex-direction: column; height: 100%; position: relative; }
            .chat-toolbar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--border-light); margin-bottom: 12px; }
            .chat-toolbar-title { font-size: 13px; color: var(--text-sec); font-weight: 600; display: flex; align-items: center; gap: 8px; }
            .msg-count { background: var(--bg-active); color: var(--text-sec); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: normal; }
            .btn-clear { padding: 6px 12px; font-size: 12px; background: transparent; color: var(--danger); border-radius: var(--radius-sm); border: none; cursor: pointer; display: flex; align-items: center; gap: 5px; }
            .btn-clear:hover { background: var(--danger-light); }
            .btn-clear svg { width: 14px; height: 14px; }
            .chat-messages-wrapper { flex: 1; position: relative; overflow: hidden; }
            .chat-messages { height: 100%; overflow-y: auto; padding: 10px 0; }
            .chat-list { display: flex; flex-direction: column; gap: 16px; }
            .bubble { padding: 12px 16px; border-radius: var(--radius-lg); font-size: 14px; line-height: 1.6; max-width: 90%; word-break: break-word; overflow-wrap: break-word; white-space: normal; overflow-x: hidden; box-shadow: var(--shadow-sm); position: relative; box-sizing: border-box; }
            .bubble-user { align-self: flex-end; background: var(--primary); color: var(--text-inverse); border-bottom-right-radius: 2px; }
            :host(.dark-theme) .bubble-user { color: #111; }
            .bubble-ai { align-self: flex-start; background: var(--bg-card); border: 1px solid var(--border-light); color: var(--text-main); border-bottom-left-radius: 2px; }
            .bubble-ai h1, .bubble-ai h2 { font-size: 1.1em; margin: 8px 0; }
            .thinking-block { margin: 4px 0 10px; border-radius: var(--radius-md); background: var(--bg-setting); border: 1px solid var(--border-light); overflow: hidden; }
            .thinking-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; cursor: pointer; user-select: none; transition: background var(--transition-fast); }
            .thinking-header:hover { background: rgba(0,0,0,0.03); }
            .thinking-header-left { display: flex; align-items: center; gap: 8px; }
            .thinking-icon { width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
            .thinking-icon svg { width: 14px; height: 14px; }
            .thinking-title { font-size: 12px; font-weight: 600; color: var(--text-sec); }
            .thinking-status { font-size: 10px; color: var(--text-muted); background: rgba(0,0,0,0.05); padding: 1px 6px; border-radius: 4px; }
            .thinking-toggle { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
            .thinking-toggle svg { width: 12px; height: 12px; transition: transform 0.2s; }
            .thinking-block.expanded .thinking-toggle svg { transform: rotate(180deg); }
            .thinking-preview { padding: 0 12px 8px; font-size: 11px; color: var(--text-muted); line-height: 1.4; max-height: 3.5em; overflow: hidden; word-break: break-word; overflow-wrap: break-word; white-space: normal; }
            .thinking-content { max-height: 0; overflow: hidden; transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .thinking-block.expanded .thinking-content { max-height: 5000px; }
            .thinking-content-inner { padding: 10px 12px; font-size: 12px; color: var(--text-sec); border-top: 1px dashed var(--border-medium); background: var(--bg-card); word-break: break-word; overflow-wrap: break-word; white-space: normal; overflow-x: hidden; width: 100%; box-sizing: border-box; }
            .scroll-buttons { position: absolute; right: 10px; z-index: 10; }
            .scroll-buttons.top-area { top: 10px; }
            .scroll-buttons.bottom-area { bottom: 10px; }
            .scroll-btn { width: 32px; height: 32px; border-radius: 50%; background: var(--bg-card); border: 1px solid var(--border-light); box-shadow: var(--shadow-md); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-sec); opacity: 0; transform: scale(0.8); pointer-events: none; transition: all var(--transition-fast); }
            .scroll-btn.visible { opacity: 1; transform: scale(1); pointer-events: auto; }
            .scroll-btn:hover { color: var(--brand-gold); border-color: var(--brand-gold); }
            .scroll-btn svg { width: 16px; height: 16px; }
            .chat-input-area { border-top: 1px solid var(--border-light); padding: 16px 0 0; flex-shrink: 0; }
            .chat-input-row { display: flex; gap: 10px; align-items: flex-end; }
            .chat-input { flex: 1; min-height: 44px; max-height: 120px; border-radius: 22px; padding: 10px 18px; resize: none; border: 1px solid var(--border-medium); font-size: 14px; line-height: 1.5; }
            .chat-input:focus { border-color: var(--brand-gold); }
            .send-btn { width: 44px; height: 44px; border-radius: 50%; padding: 0; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--primary); border: none; cursor: pointer; transition: all var(--transition-fast); }
            .send-btn svg { width: 20px; height: 20px; fill: none; stroke: var(--text-inverse); }
            :host(.dark-theme) .send-btn svg { stroke: #111; }
            .send-btn:hover { transform: scale(1.05); }
            .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .settings-page { background: var(--bg-setting); min-height: 100%; padding: 20px; }
            .settings-group { background: var(--bg-card); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); }
            .settings-group-title { font-size: 11px; color: var(--text-muted); text-transform: uppercase; padding: 16px 20px 8px; font-weight: 700; letter-spacing: 0.05em; }
            .setting-item { padding: 14px 20px; border-bottom: 1px solid var(--border-light); }
            .setting-item:last-child { border-bottom: none; }
            .setting-label { font-size: 14px; font-weight: 500; color: var(--text-main); margin-bottom: 4px; display: block; }
            .setting-desc { font-size: 12px; color: var(--text-sec); margin-bottom: 10px; }
            .setting-item-row { display: flex; justify-content: space-between; align-items: center; }
            .setting-item-row .setting-info { flex: 1; margin-right: 16px; }
            .toggle-switch { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
            .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
            .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: var(--border-medium); border-radius: 24px; transition: .3s; }
            .toggle-slider::before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: .3s; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
            .toggle-switch input:checked + .toggle-slider { background: var(--brand-gold); }
            .toggle-switch input:checked + .toggle-slider::before { transform: translateX(20px); }
            .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; display: none; }
            .btn.loading .spinner { display: inline-block; }
            .btn.loading .btn-text { display: none; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .thinking { display: flex; gap: 4px; padding: 4px 0; }
            .thinking-dot { width: 6px; height: 6px; background: var(--text-muted); border-radius: 50%; animation: thinking 1.4s ease-in-out infinite; }
            .thinking-dot:nth-child(2) { animation-delay: 0.2s; }
            .thinking-dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes thinking { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
            .tip-text { text-align: center; color: var(--text-muted); font-size: 13px; padding: 40px 20px; line-height: 1.8; }
            .tip-text strong { color: var(--text-main); }
            .tip-icon { display: block; margin-bottom: 12px; color: var(--border-medium); }
            .tip-icon svg { width: 40px; height: 40px; }
            .hidden { display: none !important; }
            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
            :host(.dark-theme) ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
            input[type="number"] { -moz-appearance: textfield; }
            input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            .range-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .range-buttons { display: flex; gap: 6px; }
            .range-inputs { display: flex; gap: 10px; align-items: center; }
            .range-inputs input { flex: 1; text-align: center; }
            .range-separator { color: var(--text-muted); }
            .shortcut-hint { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 11px; color: var(--text-muted); margin-top: 16px; }
            .kbd { display: inline-flex; padding: 2px 5px; background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: 4px; font-family: ui-monospace, monospace; font-size: 10px; }
            .toast { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(10px); background: #333; color: white; padding: 8px 16px; border-radius: 4px; font-size: 13px; font-weight: 500; box-shadow: var(--shadow-lg); z-index: 10000; opacity: 0; pointer-events: none; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
            .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
            .toast.error { background: var(--danger); }
            `;
        },

        render() {
            const html = `
                <div id="toggle-btn" title="拖动改变位置，点击展开/关闭 (Ctrl+Shift+S)">${this.ICONS.arrowLeft}</div>
                <div class="sidebar-panel" id="sidebar">
                    <div class="resize-handle" id="resizer"></div>
                    <div class="toast" id="toast"></div>
                    <div class="header">
                        <div class="header-title">
                            <div class="header-title-icon">${this.ICONS.brain}</div>
                            智能总结
                        </div>
                        <div class="header-actions">
                            <button class="icon-btn" id="btn-theme" data-tooltip="切换主题">${this.ICONS.moon}</button>
                            <button class="icon-btn" id="btn-close" data-tooltip="关闭">${this.ICONS.close}</button>
                        </div>
                    </div>
                    <div class="tab-bar">
                        <div class="tab-item active" data-tab="summary">${this.ICONS.summary}<span>总结</span></div>
                        <div class="tab-item" data-tab="chat">${this.ICONS.chat}<span>对话</span></div>
                        <div class="tab-item" data-tab="export">📦<span>导出</span></div>
                        <div class="tab-item" data-tab="settings">${this.ICONS.settings}<span>设置</span></div>
                    </div>
                    <div class="content-area">
                        <div id="page-summary" class="view-page active">
                             <div class="form-group">
                                 <div class="range-header">
                                     <label class="form-label" style="margin:0;">楼层范围</label>
                                     <div class="range-buttons">
                                         <button class="btn-xs" id="range-all">全部</button>
                                         <button class="btn-xs" id="range-recent">最近<span id="recent-count">50</span></button>
                                     </div>
                                 </div>
                                 <div class="range-inputs">
                                     <input type="number" id="inp-start" placeholder="起始" min="1">
                                     <span class="range-separator">→</span>
                                     <input type="number" id="inp-end" placeholder="结束" min="1">
                                 </div>
                             </div>
                             <button class="btn" id="btn-summary">
                                 <div class="spinner"></div>
                                 <span class="btn-text" style="display:flex;align-items:center;gap:6px;">${this.ICONS.sparkles} 开始智能总结</span>
                             </button>
                             <div id="summary-result" class="result-box empty">
                                 <div class="tip-text">
                                     <span class="tip-icon">${this.ICONS.robot}</span>
                                     点击「开始智能总结」后，<br>AI 将分析帖子内容并生成摘要<br><br>
                                     💡 总结完成后可切换到<strong>「对话」</strong>继续追问
                                 </div>
                             </div>
                             <div class="shortcut-hint">
                                 <span class="kbd">Ctrl</span>+<span class="kbd">Shift</span>+<span class="kbd">S</span> 快速打开
                             </div>
                        </div>
                        <div id="page-chat" class="view-page">
                            <div class="chat-container">
                                 <div class="chat-toolbar">
                                     <div class="chat-toolbar-title">
                                         对话记录
                                         <span class="msg-count" id="msg-count">0</span>
                                     </div>
                                     <button class="btn-clear" id="btn-clear-chat" title="清空对话">
                                         ${this.ICONS.trash} 清空
                                     </button>
                                 </div>
                                 <div class="chat-messages-wrapper">
                                     <div class="scroll-buttons top-area"><button class="scroll-btn" id="btn-scroll-top" title="滚动到顶部">${this.ICONS.arrowUp}</button></div>
                                     <div class="chat-messages" id="chat-messages">
                                         <div id="chat-list" class="chat-list"></div>
                                         <div id="chat-empty" class="tip-text">
                                             <span class="tip-icon">${this.ICONS.chat}</span>
                                             请先在<strong>「总结」</strong>页面生成内容摘要，<br>然后即可基于上下文进行对话
                                         </div>
                                     </div>
                                     <div class="scroll-buttons bottom-area"><button class="scroll-btn" id="btn-scroll-bottom" title="滚动到底部">${this.ICONS.arrowDown}</button></div>
                                 </div>
                                 <div class="chat-input-area">
                                     <div class="chat-input-row">
                                         <textarea id="chat-input" class="chat-input" placeholder="输入你的问题... (Enter 发送)" rows="1"></textarea>
                                         <button class="send-btn" id="btn-send" title="发送消息">${this.ICONS.send}</button>
                                     </div>
                                 </div>
                            </div>
                        </div>
                        <!-- 导出页面 -->
                        <div id="page-export" class="view-page">
                            <div class="form-group">
                                <label class="form-label">导出类型</label>
                                <select id="export-type">
                                    <option value="html">HTML 离线导出</option>
                                    <option value="ai-text">AI 文本导出</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <div class="range-header">
                                    <label class="form-label" style="margin:0;">导出范围</label>
                                    <div class="range-buttons">
                                        <button class="btn-xs" id="export-range-all">全部</button>
                                        <button class="btn-xs" id="export-range-recent">最近<span id="export-recent-count">50</span></button>
                                    </div>
                                </div>
                                <div class="range-inputs">
                                    <input type="number" id="export-start" placeholder="起始" min="1">
                                    <span class="range-separator">→</span>
                                    <input type="number" id="export-end" placeholder="结束" min="1">
                                </div>
                            </div>
                            <div id="html-export-options" class="form-group">
                                <label class="form-label">HTML 导出选项</label>
                                <div class="setting-item-row" style="margin-bottom:12px;">
                                    <div class="setting-info">
                                        <label class="setting-label">离线图片</label>
                                        <div class="setting-desc">将图片转为 base64 嵌入</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="export-offline-images" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <label class="setting-label" style="margin-bottom:8px;">主题选择</label>
                                <select id="export-theme">
                                    <option value="light">浅色主题</option>
                                    <option value="dark">深色主题</option>
                                </select>
                            </div>
                            <div id="ai-text-options" class="form-group" style="display:none;">
                                <label class="form-label">AI 文本选项</label>
                                <div class="setting-item-row" style="margin-bottom:12px;">
                                    <div class="setting-info">
                                        <label class="setting-label">包含头部信息</label>
                                        <div class="setting-desc">标题、作者、时间等</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="export-ai-header" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="setting-item-row" style="margin-bottom:12px;">
                                    <div class="setting-info">
                                        <label class="setting-label">包含图片链接</label>
                                        <div class="setting-desc">保留图片 URL</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="export-ai-images" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="setting-item-row">
                                    <div class="setting-info">
                                        <label class="setting-label">包含引用块</label>
                                        <div class="setting-desc">保留引用内容</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="export-ai-quotes" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <button class="btn" id="btn-export">
                                <div class="spinner"></div>
                                <span class="btn-text">📦 开始导出</span>
                            </button>
                            <div id="export-status" class="result-box empty" style="margin-top:16px;min-height:100px;">
                                <div class="tip-text">
                                    <span class="tip-icon">📦</span>
                                    选择导出类型和范围后，<br>点击「开始导出」即可下载文件
                                </div>
                            </div>
                        </div>
                        <div id="page-settings" class="view-page settings-page">
                             <div class="settings-group">
                                 <div class="settings-group-title">API 配置</div>
                                 <div class="setting-item"><label class="setting-label">API 地址</label><input type="text" id="cfg-url" placeholder="https://api.openai.com/v1/chat/completions"></div>
                                 <div class="setting-item"><label class="setting-label">API Key</label><input type="password" id="cfg-key" placeholder="sk-..."></div>
                                 <div class="setting-item"><label class="setting-label">模型名称</label><input type="text" id="cfg-model" placeholder="deepseek-chat"></div>
                             </div>
                             <div class="settings-group">
                                 <div class="settings-group-title">提示词配置</div>
                                 <div class="setting-item"><label class="setting-label">总结提示词</label><div class="setting-desc">用于生成帖子摘要时的系统指令</div><textarea id="cfg-prompt-sum" rows="4"></textarea></div>
                                 <div class="setting-item"><label class="setting-label">对话提示词</label><div class="setting-desc">用于后续追问时的系统指令</div><textarea id="cfg-prompt-chat" rows="4"></textarea></div>
                             </div>
                             <div class="settings-group">
                                 <div class="settings-group-title">高级设置</div>
                                 <div class="setting-item setting-item-row">
                                     <div class="setting-info"><label class="setting-label">快捷楼层数</label><div class="setting-desc">"最近N楼"按钮的楼层数量</div></div>
                                     <input type="number" id="cfg-recent-floors" min="10" max="500" style="width:80px; text-align:center; padding:6px 10px;">
                                 </div>
                                 <div class="setting-item setting-item-row">
                                     <div class="setting-info"><label class="setting-label">流式输出</label><div class="setting-desc">开启后内容会逐字显示，关闭则等待完成后一次性显示</div></div>
                                     <label class="toggle-switch"><input type="checkbox" id="cfg-stream" checked><span class="toggle-slider"></span></label>
                                 </div>
                                 <div class="setting-item setting-item-row">
                                     <div class="setting-info"><label class="setting-label">自动滚动</label><div class="setting-desc">生成内容时自动滚动到最新位置</div></div>
                                     <label class="toggle-switch"><input type="checkbox" id="cfg-autoscroll" checked><span class="toggle-slider"></span></label>
                                 </div>
                             </div>
                             <button class="btn" id="btn-save">${this.ICONS.check} 保存设置</button>
                        </div>
                    </div>
                </div>`;
            this.uiManager.shadow.innerHTML += html;
        },

        bindEvents: UIRegistry.get('style1').bindEvents,
        bindKeyboardShortcuts: UIRegistry.get('style1').bindKeyboardShortcuts,
        restoreState() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            this.uiManager.host.style.setProperty('--sidebar-width', `${this.sidebarWidth}px`);
            const btn = Q('#toggle-btn');
            btn.style.top = this.btnPos.top;
            this.applySideState();
            if (this.isDarkTheme) {
                this.uiManager.host.classList.add('dark-theme');
                Q('#btn-theme').innerHTML = this.ICONS.sun;
            } else {
                Q('#btn-theme').innerHTML = this.ICONS.moon;
            }

            Q('#cfg-url').value = GM_getValue('apiUrl', 'https://api.deepseek.com/v1/chat/completions');
            Q('#cfg-key').value = GM_getValue('apiKey', '');
            Q('#cfg-model').value = GM_getValue('model', 'deepseek-chat');
            Q('#cfg-prompt-sum').value = GM_getValue('prompt_sum', '请总结以下论坛帖子内容。使用 Markdown 格式，条理清晰，重点突出主要观点、争议点和结论。适当使用标题、列表和引用来组织内容。');
            Q('#cfg-prompt-chat').value = GM_getValue('prompt_chat', '你是一个帖子阅读助手。基于上文中的帖子内容，回答用户的问题。回答要准确、简洁，必要时引用原文。');
            const recentFloors = GM_getValue('recentFloors', 50);
            Q('#cfg-recent-floors').value = recentFloors;
            Q('#recent-count').textContent = recentFloors;
            Q('#cfg-stream').checked = GM_getValue('useStream', true);
            Q('#cfg-autoscroll').checked = GM_getValue('autoScroll', true);
        },
        applySideState() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const btn = Q('#toggle-btn');
            const sidebar = Q('#sidebar');
            const resizer = Q('#resizer');
            btn.style.left = ''; btn.style.right = '';

            if (this.side === 'left') {
                sidebar.className = 'sidebar-panel panel-left' + (this.isOpen ? ' open' : '');
                resizer.className = 'resize-handle handle-left';
                btn.className = 'btn-snap-left' + (this.isOpen ? ' arrow-flip' : '');
                btn.innerHTML = this.ICONS.arrowRight;
            } else {
                sidebar.className = 'sidebar-panel panel-right' + (this.isOpen ? ' open' : '');
                resizer.className = 'resize-handle handle-right';
                btn.className = 'btn-snap-right' + (this.isOpen ? ' arrow-flip' : '');
                btn.innerHTML = this.ICONS.arrowLeft;
            }
            this.updateButtonPosition();
        },
        updateButtonPosition: UIRegistry.get('style1').updateButtonPosition,
        toggleSidebar: UIRegistry.get('style1').toggleSidebar,
        squeezeBody: UIRegistry.get('style1').squeezeBody,
        switchTab: UIRegistry.get('style1').switchTab,
        toggleTheme() {
            const Q = this.uiManager.Q.bind(this.uiManager);
            this.isDarkTheme = !this.isDarkTheme;
            GM_setValue('style2_isDarkTheme', this.isDarkTheme);
            this.uiManager.host.classList.toggle('dark-theme', this.isDarkTheme);
            Q('#btn-theme').innerHTML = this.isDarkTheme ? this.ICONS.sun : this.ICONS.moon;
        },
        setLoading: UIRegistry.get('style1').setLoading,
        doSummary: UIRegistry.get('style1').doSummary,
        doChat: UIRegistry.get('style1').doChat,
        initRangeInputs: UIRegistry.get('style1').initRangeInputs,
        setRange: UIRegistry.get('style1').setRange,
        updateResultBox(resultBox, text, isStreaming) {
            const Q = this.uiManager.Q.bind(this.uiManager);
            const currentBlock = resultBox.querySelector('[data-thinking-block]');
            const isExpanded = currentBlock?.classList.contains('expanded') || false;
            const contentHTML = this.renderWithThinking(text, isStreaming, isExpanded);
            resultBox.innerHTML = `
                <div class="result-actions">
                    <button class="result-action-btn" id="btn-copy-summary">${this.ICONS.copy} 复制</button>
                </div>
            ` + contentHTML;

            const copyBtn = Q('#btn-copy-summary');
            if (copyBtn) {
                copyBtn.onclick = () => {
                    this.copyToClipboard(Core.parseThinkingContent(text).content);
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = `${this.ICONS.check} 已复制`;
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = `${this.ICONS.copy} 复制`;
                    }, 2000);
                };
            }
            if (GM_getValue('autoScroll', true)) {
                setTimeout(() => {
                    resultBox.scrollTop = resultBox.scrollHeight;
                    const thinkingInner = resultBox.querySelector('.thinking-content-inner');
                    if (thinkingInner && isExpanded) {
                        thinkingInner.scrollTop = thinkingInner.scrollHeight;
                    }
                }, 0);
            }
        },
        updateBubble: UIRegistry.get('style1').updateBubble,
        addBubble: UIRegistry.get('style1').addBubble,
        renderWithThinking(text, isStreaming = false, keepExpanded = false) {
            const { thinking, content } = Core.parseThinkingContent(text);
            let html = '';
            if (thinking) {
                const charCount = thinking.length;
                const streamingClass = isStreaming ? ' streaming' : '';
                const expandedClass = keepExpanded ? ' expanded' : '';
                const statusText = isStreaming ? '思考中...' : `${charCount} 字符`;
                const previewText = thinking.split('\n').filter(l => l.trim()).slice(-4).join('\n').slice(-150);
                const thinkingHtml = DOMPurify.sanitize(marked.parse(thinking));
                const previewHtml = DOMPurify.sanitize(marked.parse(previewText));
                html += `<div class="thinking-block${streamingClass}${expandedClass}" data-thinking-block>
                             <div class="thinking-header" data-thinking-toggle>
                                 <div class="thinking-header-left">
                                     <div class="thinking-icon">${this.ICONS.brain}</div><span class="thinking-title">思考过程</span>
                                     <span class="thinking-status">${statusText}</span>
                                 </div>
                                 <div class="thinking-toggle">${this.ICONS.arrowDown}</div>
                             </div>
                             <div class="thinking-preview">${previewHtml}</div>
                             <div class="thinking-content"><div class="thinking-content-inner">${thinkingHtml}</div></div>
                         </div>`;
            }
            if (content) {
                html += DOMPurify.sanitize(marked.parse(content));
            }
            return html;
        },
        showToast: UIRegistry.get('style1').showToast,
        copyToClipboard: UIRegistry.get('style1').copyToClipboard,
        updateScrollButtons: UIRegistry.get('style1').updateScrollButtons,
        scrollToTop: UIRegistry.get('style1').scrollToTop,
        scrollToBottom: UIRegistry.get('style1').scrollToBottom,
        forceScrollToBottom: UIRegistry.get('style1').forceScrollToBottom,
        clearChat: UIRegistry.get('style1').clearChat,
        updateMessageCount: UIRegistry.get('style1').updateMessageCount,
        setExportRange: UIRegistry.get('style1').setExportRange,
        doExport: UIRegistry.get('style1').doExport,
        exportAsHtml: UIRegistry.get('style1').exportAsHtml,
        exportAsAiText: UIRegistry.get('style1').exportAsAiText
    });


    // =================================================================================
    // 5. UI 管理器 (UI MANAGER)
    //    负责处理UI切换、状态管理和与核心逻辑的交互。
    // =================================================================================
    class UIManager {
        constructor() {
            this.currentUI = null;
            this.host = null;
            this.shadow = null;
            this.init();
        }

        init() {
            // 从GM存储中读取用户选择，若无则使用默认
            const savedStyle = GM_getValue(CONFIG.storageKey, CONFIG.defaultUI);
            this.loadUI(savedStyle);
            this.registerMenuCommands();
        }

        loadUI(styleName) {
            if (this.currentUI && typeof this.currentUI.destroy === 'function') {
                this.currentUI.destroy();
            }
            if (this.host) {
                document.body.removeChild(this.host);
            }

            const uiObject = UIRegistry.get(styleName);
            if (!uiObject) {
                console.error(`UI Style "${styleName}" not found.`);
                return;
            }

            // 创建 Shadow DOM host
            this.host = document.createElement('div');
            this.host.id = `ld-summary-pro-${styleName}`;
            document.body.appendChild(this.host);
            this.shadow = this.host.attachShadow({ mode: 'open' });

            this.currentUI = uiObject;
            GM_setValue(CONFIG.storageKey, styleName);

            // 注入样式并初始化UI
            const styleEl = document.createElement('style');
            styleEl.textContent = this.currentUI.getStyles();
            this.shadow.appendChild(styleEl);

            // 将管理器实例传递给UI模块，以便UI可以调用管理器的公共方法
            this.currentUI.init(this);
        }

        registerMenuCommands() {
            const styles = UIRegistry.getAllNames();
            styles.forEach(styleName => {
                const styleObject = UIRegistry.get(styleName);
                GM_registerMenuCommand(`切换到 ${styleObject.name || styleName}`, () => {
                    this.loadUI(styleName);
                });
            });
        }

        // 公共方法，供UI模块调用
        Q(selector) {
            return this.shadow.querySelector(selector);
        }
    }


    // =================================================================================
    // 6. 主执行入口 (MAIN ENTRY POINT)
    // =================================================================================
    window.addEventListener('load', () => {
        new UIManager();
    });

})();