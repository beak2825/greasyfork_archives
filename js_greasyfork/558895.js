// ==UserScript==
// @name         OMNI GitHub
// @namespace    http://tampermonkey.net/
// @version      7.9
// @description  集成了GitHub知识库剪报、阅读模式、新闻速递。新增：全局字体设置（包含苹果字体预设）、字体阴影控制。支持面板拖拽排序。
// @author       moodHappy & You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558895/OMNI%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/558895/OMNI%20GitHub.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================================================
    // [配置区域]
    // ========================================================================
    const CONFIG = {
        // --- GitHub 配置 ---
        GITHUB_USERNAME: "moodHappy", // 替换你的 GitHub 用户名
        GITHUB_REPO: "HelloWorld",    // 替换你的仓库名
        PATH_NEWS_DIR: "Notes/News",  // 存储目录
        PATH_ARTICLE: "Notes/B1.md",
        PATH_WORD: "Notes/Excluded.txt",
        STORAGE_KEY: "savedPages",
        STORAGE_KEY_LAYOUT: "tm_dashboard_layout",
        
        // --- 新闻速递 配置 ---
        NEWS_API_KEY: 'dac6abc0634b4de08429b2580628dba8',
        NEWS_API_URL: 'https://newsapi.org/v2/top-headlines?country=us'
    };

    // ========================================================================
    // [模块 1] 样式系统 (UI Dashboard)
    // ========================================================================
    GM_addStyle(`
        #tm-dashboard {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 90%; max-width: 420px; max-height: 90vh;
            background: #fff; border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.25);
            z-index: 99999; display: flex; flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            opacity: 0; pointer-events: none; transition: opacity 0.2s;
        }
        #tm-dashboard.open { opacity: 1; pointer-events: auto; }
        .tm-header { padding: 15px; border-bottom: 1px solid #eee; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; border-radius: 16px 16px 0 0; }
        .tm-title { font-weight: 700; font-size: 16px; color: #333; }
        .tm-close { cursor: pointer; padding: 5px 10px; font-size: 20px; color: #666; }
        .tm-back { cursor: pointer; padding: 5px 10px; font-size: 18px; color: #007bff; display: none; }
        .tm-body { flex: 1; overflow-y: auto; padding: 15px; background: #fff; border-radius: 0 0 16px 16px; }
        
        /* Grid 布局 */
        .tm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; user-select: none; }
        
        /* 卡片样式 */
        .tm-card {
            background: #f1f3f5; border-radius: 10px; padding: 12px;
            text-align: center; cursor: pointer; transition: transform 0.1s, background 0.2s;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            height: 80px; 
            touch-action: none;
        }
        .tm-card:active { transform: scale(0.95); }
        .tm-card-icon { font-size: 22px; margin-bottom: 6px; pointer-events: none; }
        .tm-card-text { font-size: 13px; font-weight: 500; color: #495057; pointer-events: none; line-height: 1.2; }
        .tm-card.primary { background: #e7f5ff; color: #004085; }
        .tm-card.full { grid-column: span 2; }
        
        /* 拖拽时的样式 */
        .sortable-ghost { opacity: 0.4; background: #cce5ff; border: 2px dashed #007bff; }
        .sortable-drag { cursor: grabbing; opacity: 1; background: #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transform: scale(1.05); }

        .tm-list-item { padding: 10px; border-bottom: 1px solid #eee; position: relative; }
        .tm-list-title { font-weight: 600; font-size: 14px; color: #007bff; text-decoration: none; display:block; padding-right: 30px; }
        .tm-list-meta { font-size: 11px; color: #999; margin-top: 2px; }
        .tm-list-del { position: absolute; right: 5px; top: 10px; cursor: pointer; color: #dc3545; font-size: 16px; padding: 0 5px; opacity: 0.6; }
        .tm-list-del:hover { opacity: 1; }

        .tm-btn { width: 100%; padding: 10px; border: none; border-radius: 8px; background: #007bff; color: white; margin-top: 10px; cursor: pointer; transition: background 0.2s; }
        .tm-btn:hover { background: #0056b3; }
        .tm-input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px; box-sizing: border-box; }
        .tm-select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px; background: #fff; }
        .tm-range-group { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .tm-range { flex: 1; margin: 0 10px; }
        .tm-label { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 5px; display: block; }
        
        .tm-footer { padding: 8px; font-size: 10px; color: #adb5bd; text-align: center; border-top: 1px solid #eee; }
        #tm-toast {
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.85); color: white; padding: 10px 20px;
            border-radius: 20px; font-size: 13px; z-index: 100000;
            opacity: 0; pointer-events: none; transition: opacity 0.3s; white-space: nowrap;
        }
        
        /* 日历样式 */
        .tm-cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .tm-cal-nav { cursor: pointer; user-select: none; padding: 5px 12px; background: #f1f3f5; border-radius: 6px; font-weight: bold; color:#555; }
        .tm-cal-controls { display: flex; gap: 5px; }
        .tm-cal-select { border: 1px solid #eee; background: #fff; font-size: 14px; padding: 4px; border-radius: 4px; font-weight: 500; color: #333; }
        .tm-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .tm-cal-head { text-align: center; font-size: 11px; color: #999; padding-bottom: 5px; }
        .tm-cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: 1px solid #eee; border-radius: 6px; font-size: 12px; position: relative; background: #fff; }
        .tm-cal-cell.has { background: #e7f5ff; border-color: #d0ebff; font-weight: bold; cursor: pointer; color: #004085; }
        .tm-cal-badge { position: absolute; bottom: 1px; right: 2px; font-size: 8px; color: #007bff; opacity: 0.8; }
    `);

    // ========================================================================
    // [模块 2] MD 引擎
    // ========================================================================
    const MDHelper = {
        toMD: (items) => {
            if (!items || items.length === 0) return "";
            return items.map(item => {
                let block = `### [${item.newsTitle.replace(/\[|\]/g, '')}](${item.url})\n` +
                            `- **Date**: ${item.timestamp}\n` +
                            `- **ID**: ${item.id}\n`;
                if (item.content && item.content.trim() !== "") {
                    const safeContent = item.content.replace(/\n/g, "  \n").replace(/---/g, "===");
                    block += `\n> ${safeContent}\n`;
                }
                block += `\n---\n`;
                return block;
            }).join("\n");
        },
        fromMD: (mdText) => {
            if (!mdText) return [];
            const text = mdText.replace(/\r\n/g, '\n');
            const chunks = text.split(/\n-{3,}\n/);
            const items = [];
            chunks.forEach(chunk => {
                if (!chunk.trim()) return;
                const titleMatch = chunk.match(/### \[(.*?)\]\((.*?)\)/);
                const dateMatch = chunk.match(/- \*\*Date\*\*: (.*?)\n/);
                const idMatch = chunk.match(/- \*\*ID\*\*: (\d+)/);
                const contentMatch = chunk.match(/> ([\s\S]*?)$/);
                if (idMatch && titleMatch) {
                    items.push({
                        newsTitle: titleMatch[1],
                        url: titleMatch[2],
                        timestamp: dateMatch ? dateMatch[1].trim() : '',
                        id: parseInt(idMatch[1]),
                        content: contentMatch ? contentMatch[1].trim().replace(/===/g, "---") : "",
                        domain: new URL(titleMatch[2]).hostname || ""
                    });
                }
            });
            return items;
        }
    };

    const Extractor = {
        run: () => {
            const pageTitle = document.title.trim();
            const texts = [];
            if (pageTitle) texts.push(`<p><strong>${Extractor.escape(pageTitle)}</strong></p>`);
            const contentSelectors = ['article p', 'main p', '.content p', '.post p', '#content p', '.article-content p'];
            let found = false, extractedSet = new Set();
            for (let sel of contentSelectors) {
                const paragraphs = document.querySelectorAll(sel);
                if (paragraphs.length > 0) {
                    let validCount = 0;
                    paragraphs.forEach(p => {
                        const t = p.innerText.trim();
                        if (Extractor.isValid(t) && !extractedSet.has(t)) {
                            extractedSet.add(t); texts.push(`<p>${Extractor.escape(t)}</p>`); validCount++;
                        }
                    });
                    if (validCount > 0) { found = true; break; }
                }
            }
            if (!found) {
                const bodyText = Extractor.clean(document.body);
                const paras = bodyText.split(/\n\s*\n/).filter(p => Extractor.isValid(p)).slice(0, 30);
                paras.forEach(p => texts.push(`<p>${Extractor.escape(p)}</p>`));
            }
            return texts.length > 1 ? texts.join('\n') : null;
        },
        isValid: (t) => t && t.length > 20 && !/^(home|share|prev|next|date)/i.test(t),
        clean: (el) => {
            const clone = el.cloneNode(true);
            ['nav', 'header', 'footer', 'script', 'style'].forEach(s => clone.querySelectorAll(s).forEach(e => e.remove()));
            return clone.innerText.trim();
        },
        escape: (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    };

    // ========================================================================
    // [模块 3] 新闻英语增强 & 速递
    // ========================================================================
    const NewsModule = {
        enhanceReadability: () => {
            const hostname = window.location.hostname;
            const isLevelsSite = hostname.includes('daysinlevels.com') || hostname.includes('newsinlevels.com');
            const isBreakingNewsSite = hostname.includes('breakingnewsenglish.com');

            if (isLevelsSite) {
                const applyStyle = () => {
                    const selectors = [
                        'body', 'p', 'li', 'span', 'div', 'section', 'article', 'main', 'a',
                        '.content-area', '.entry-content',
                        '.td-post-content', '.td-post-content p', '.td-post-content li', '.td-post-content span', 
                        '.td_block_inner div', '.td-post-title'
                    ];
                    selectors.forEach(sel => {
                        document.querySelectorAll(sel).forEach(el => {
                            if (el.offsetWidth > 0 || el.offsetHeight > 0) {
                                el.style.setProperty('font-size', '1.75rem', 'important');
                                el.style.setProperty('line-height', '1.9', 'important');
                                el.style.setProperty('word-break', 'break-word', 'important');
                            }
                        });
                    });
                    ['h1', 'h2', 'h3'].forEach(sel => {
                        document.querySelectorAll(sel).forEach(h => {
                            if (parseFloat(window.getComputedStyle(h).fontSize) < 36) {
                                h.style.setProperty('font-size', '28px', 'important');
                                h.style.setProperty('line-height', '1.3', 'important');
                            }
                        });
                    });
                };
                
                applyStyle();
                const observer = new MutationObserver((mutations) => {
                    let added = false;
                    mutations.forEach(m => {
                        if (m.addedNodes.length) added = true;
                    });
                    if (added) applyStyle();
                });
                observer.observe(document.body, { childList: true, subtree: true });
                window.addEventListener('resize', applyStyle);

            } else if (isBreakingNewsSite) {
                GM_addStyle(`
                    .article-body, .content-body, #content, .article-text, p, li {
                        font-size: 20px !important;
                        line-height: 1.8 !important;
                    }
                `);
            }
        },

        translateText: async (text, sourceLang, targetLang) => {
            if (!text) return '';
            const encodedText = encodeURIComponent(text);
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedText}`;
            try {
                const response = await fetch(url);
                if (!response.ok) return 'Translation failed.';
                const data = await response.json();
                return data[0][0][0];
            } catch (error) {
                console.error("Translation Error:", error);
                return 'Translation failed.';
            }
        },

        fetchAndDisplay: () => {
            UI.toast("📰 正在获取全球新闻...", 5000);
            GM_xmlhttpRequest({
                method: "GET",
                url: `${CONFIG.NEWS_API_URL}&apiKey=${CONFIG.NEWS_API_KEY}`,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data.articles && data.articles.length > 0) {
                            UI.toast("🔄 正在翻译标题...", 5000);
                            
                            const translatePromises = data.articles.map(async (article) => {
                                const translatedTitle = await NewsModule.translateText(article.title, 'en', 'zh-CN');
                                const translatedDescription = article.description ? await NewsModule.translateText(article.description, 'en', 'zh-CN') : '暂无简介';
                                return { ...article, translatedTitle, translatedDescription };
                            });

                            Promise.all(translatePromises).then((translatedArticles) => {
                                let newsContent = `
                                  <!DOCTYPE html>
                                  <html lang="zh-CN">
                                  <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>全球新闻速递</title>
                                    <style>
                                      body { font-family: -apple-system, sans-serif; margin: 20px; line-height: 1.6; color: #333; background: #f4f4f9; }
                                      h1 { text-align: center; color: #2c3e50; }
                                      ul { list-style: none; padding: 0; max-width: 800px; margin: 0 auto; }
                                      li { background:#fff; border: 1px solid #eee; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                                      li:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: 0.2s; }
                                      a { text-decoration: none; font-weight: bold; color: #007bff; font-size: 1.1em; }
                                      .translation { color: #28a745; font-weight: 500; margin-top: 5px; background: #e8f5e9; padding: 5px 10px; border-radius: 4px; display:inline-block;}
                                      .meta { font-size: 0.8em; color: #999; margin-top: 10px; }
                                    </style>
                                  </head>
                                  <body>
                                  <h1>Latest Headlines (US) & 中文译文</h1>
                                  <ul>
                                `;
                                translatedArticles.forEach(article => {
                                    newsContent += `
                                      <li>
                                        <a href="${article.url}" target="_blank">${article.title}</a>
                                        <br><div class="translation">${article.translatedTitle}</div>
                                        <p style="color:#666; font-size:0.9em; margin-top:10px;">${article.description || ''}</p>
                                        <div class="translation" style="font-size:0.9em; color:#555; background:#f1f1f1;">${article.translatedDescription}</div>
                                        <div class="meta">Source: ${article.source.name}</div>
                                      </li>
                                    `;
                                });
                                newsContent += `</ul></body></html>`;
                                GM_openInTab(`data:text/html;charset=utf-8,${encodeURIComponent(newsContent)}`, { active: true });
                                UI.toast("✅ 新闻页面已打开");
                            });
                        } else {
                            UI.toast('⚠️ 未找到新闻');
                        }
                    } else {
                        UI.toast('❌ 获取新闻失败: ' + response.status);
                    }
                },
                onerror: function(error) {
                    console.error("News Fetch Error:", error);
                    UI.toast('❌ 网络错误');
                }
            });
        }
    };

    // ========================================================================
    // [模块 4] 自定义样式管理 (字体/阴影)
    // ========================================================================
    const FONT_PRESETS = [
        { name: "默认字体 (Default)", value: "" },
        { name: "苹果系统 (Apple System)", value: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif' },
        { name: "苹果黑体 (PingFang SC)", value: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' },
        { name: "经典衬线 (Georgia)", value: 'Georgia, "Times New Roman", "Songti SC", serif' },
        { name: "微软雅黑 (YaHei)", value: '"Microsoft YaHei", "Segoe UI", sans-serif' },
        { name: "代码风格 (Monospace)", value: 'Menlo, Monaco, Consolas, "Courier New", monospace' }
    ];

    const StyleManager = {
        init: () => {
            StyleManager.apply();
        },
        apply: () => {
            const font = GM_getValue('cfg_font_family', '');
            const shadow = GM_getValue('cfg_font_shadow', 0);
            
            let css = '';
            if (font) {
                // 排除 icon 元素防止乱码
                css += `
                    body, p, h1, h2, h3, h4, h5, h6, li, span, a, div:not([class*="icon"]):not([class*="fa"]) {
                        font-family: ${font} !important;
                    }
                `;
            }
            if (shadow > 0) {
                // 添加轻微文字阴影增强对比度
                css += `
                    body, p, h1, h2, h3, li, article {
                        text-shadow: 0 0 ${shadow}px rgba(0,0,0,0.5) !important;
                    }
                `;
            }

            const id = 'tm-custom-font-style';
            let el = document.getElementById(id);
            if (!el) {
                el = document.createElement('style');
                el.id = id;
                document.head.appendChild(el);
            }
            el.innerHTML = css;
        }
    };

    // ========================================================================
    // [模块 5] GitHub 核心逻辑
    // ========================================================================
    const STATE = {
        selection: '', 
        currentView: 'home',
        ghToken: GM_getValue('gh_token', ''),
        data: JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '[]'),
        calYear: new Date().getFullYear(),
        calMonth: new Date().getMonth()
    };

    const UI = {
        toast: (msg, time = 2000) => {
            const el = document.getElementById('tm-toast') || document.createElement('div');
            el.id = 'tm-toast';
            el.innerHTML = msg;
            if(!el.parentNode) document.body.appendChild(el);
            el.style.opacity = 1;
            setTimeout(() => { el.style.opacity = 0; }, time);
        },
        refreshData: () => STATE.data = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '[]'),
        getMonthStr: (ts) => {
            const d = new Date(ts.replace(/年|月/g,'/').replace(/日/g,'').replace(/-/g, '/'));
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        },
        parseDate: (str) => new Date(str.replace(/年|月/g,'/').replace(/日/g,'').replace(/-/g, '/'))
    };

    class GitHubAPI {
        static async request(method, path, data = null, sha = null) {
            if (!STATE.ghToken) throw new Error("请先配置 Token");
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method,
                    url: `https://api.github.com/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/contents/${path}`,
                    headers: { "Authorization": `Bearer ${STATE.ghToken}`, "Accept": "application/vnd.github.v3+json" },
                    data: data ? JSON.stringify({
                        message: "Update from Tampermonkey",
                        content: btoa(unescape(encodeURIComponent(data))),
                        sha: sha
                    }) : null,
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) resolve(JSON.parse(res.responseText));
                        else if (res.status === 404) resolve(null);
                        else reject(res.responseText);
                    },
                    onerror: reject
                });
            });
        }
    }

    const Actions = {
        savePage: async () => {
            const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
            const info = {
                id: Date.now(),
                title: document.title,
                newsTitle: document.querySelector('h1')?.innerText || document.title,
                url: window.location.href,
                timestamp: nowStr,
                content: "" 
            };
            
            UI.refreshData();
            STATE.data.unshift(info);
            if (STATE.data.length > 200) STATE.data = STATE.data.slice(0, 200);
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(STATE.data));
            UI.toast("✅ 已保存书签");

            if(!STATE.ghToken) return;

            try {
                const monthStr = UI.getMonthStr(nowStr);
                const path = `${CONFIG.PATH_NEWS_DIR}/${monthStr}.md`;
                UI.toast(`☁️ 同步至 ${monthStr}.md...`);

                const file = await GitHubAPI.request("GET", path);
                let remoteContent = file ? decodeURIComponent(escape(atob(file.content))) : "";
                if(remoteContent && !remoteContent.endsWith('\n')) remoteContent += '\n';
                
                const newMD = MDHelper.toMD([info]);
                const finalContent = newMD + remoteContent;

                await GitHubAPI.request("PUT", path, finalContent, file?.sha);
                UI.toast("🎉 云端同步完成");
            } catch(e) { UI.toast("❌ 云端同步失败: " + e); }
        },

        deleteItem: async (id) => {
            const item = STATE.data.find(i => i.id === id);
            if(!item) return UI.toast("⚠️ 本地未找到该记录");
            if(!confirm("确定要删除这条剪报吗？")) return;

            STATE.data = STATE.data.filter(i => i.id !== id);
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(STATE.data));
            UI.toast("🗑️ 本地已删，处理云端...");
            if(STATE.currentView === 'list') Dashboard.renderList(STATE.currentFilterDate);

            if (!STATE.ghToken) return;
            try {
                const monthStr = UI.getMonthStr(item.timestamp);
                const path = `${CONFIG.PATH_NEWS_DIR}/${monthStr}.md`;
                const file = await GitHubAPI.request("GET", path);
                if(!file) return UI.toast("⚠️ 云端文件不存在");

                let rawText = decodeURIComponent(escape(atob(file.content)));
                rawText = rawText.replace(/\r\n/g, '\n');
                const separator = '\n---\n';
                const parts = rawText.split(separator);
                const idString = `- **ID**: ${id}`;
                const newParts = parts.filter(part => !part.includes(idString));

                if (newParts.length === parts.length) {
                    UI.toast("⚠️ 云端未找到该 ID");
                } else {
                    let newContent = newParts.join(separator);
                    if(newContent.trim() && !newContent.endsWith(separator)) newContent += separator;
                    await GitHubAPI.request("PUT", path, newContent, file.sha);
                    UI.toast("☁️ 云端删除成功");
                }
            } catch(e) { console.error(e); UI.toast("❌ 云端操作失败: " + e); }
        },

        sync: async () => {
            if (!STATE.ghToken) return UI.toast("请先配置 Token");
            try {
                UI.toast("🔄 扫描云端...");
                const dirData = await GitHubAPI.request("GET", CONFIG.PATH_NEWS_DIR);
                if (!dirData || !Array.isArray(dirData) || dirData.length === 0) return UI.toast("☁️ 云端目录为空");

                const files = dirData.filter(f => f.name.endsWith('.md'));
                UI.toast(`📥 拉取 ${files.length} 个文件...`);

                let allItems = [];
                for (let f of files) {
                    const fileRes = await GitHubAPI.request("GET", f.path);
                    const content = decodeURIComponent(escape(atob(fileRes.content)));
                    allItems = allItems.concat(MDHelper.fromMD(content));
                }
                const map = new Map();
                [...allItems, ...STATE.data].forEach(i => { if (!map.has(i.id)) map.set(i.id, i); });
                const merged = Array.from(map.values()).sort((a,b) => b.id - a.id);
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(merged));
                STATE.data = merged;
                UI.toast(`🎉 同步完成，共 ${merged.length} 条`);
                if(STATE.currentView.startsWith('list')) Dashboard.renderList();
                if(STATE.currentView === 'cal') Dashboard.renderCal();
            } catch (e) { console.error(e); UI.toast("❌ 同步失败: " + e); }
        },

        pushSelection: async (type) => { 
            if (!STATE.selection) return UI.toast("⚠️ 请先选中文本");
            const isArt = type === 'article';
            const path = isArt ? CONFIG.PATH_ARTICLE : CONFIG.PATH_WORD;
            try {
                UI.toast("⏳ 获取文件中...");
                const file = await GitHubAPI.request("GET", path);
                const old = file ? decodeURIComponent(escape(atob(file.content))) : "";
                let content = isArt ? 
                    `[Source: ${document.title}](${window.location.href})\n\n` + STATE.selection.split('\n').map(l=>l.trim()&&`<p>${l}</p>`).join('\n') :
                    STATE.selection + (old ? "\n\n" + old.trim() : "");
                await GitHubAPI.request("PUT", path, content, file?.sha);
                UI.toast("✅ 推送成功!");
            } catch (e) { UI.toast("❌ 失败: " + e); }
        },

        autoPushArticle: async () => {
            if (!STATE.ghToken) return UI.toast("请先配置 Token");
            UI.toast("🕵️ 正在智能分析...");
            const htmlContent = Extractor.run();
            if (!htmlContent) return UI.toast("❌ 无法提取正文", 3000);
            try {
                const file = await GitHubAPI.request("GET", CONFIG.PATH_ARTICLE);
                await GitHubAPI.request("PUT", CONFIG.PATH_ARTICLE, htmlContent, file?.sha);
                UI.toast("✅ 推送成功!", 3000);
            } catch (e) { UI.toast("❌ 出错: " + e); }
        }
    };

    // ========================================================================
    // [模块 6] 控制台 UI (Dashboard)
    // ========================================================================
    const Dashboard = {
        el: null,
        init: () => {
            if (Dashboard.el) return;
            const div = document.createElement('div');
            div.id = 'tm-dashboard';
            div.innerHTML = `
                <div class="tm-header">
                    <span class="tm-back">◀</span><span class="tm-title">助手面板</span><span class="tm-close">×</span>
                </div>
                <div class="tm-body" id="tm-content"></div>
                <div class="tm-footer" id="tm-status"></div>
            `;
            document.body.appendChild(div);
            Dashboard.el = div;
            div.querySelector('.tm-close').onclick = Dashboard.close;
            div.querySelector('.tm-back').onclick = Dashboard.renderHome;
        },
        open: () => {
            Dashboard.init();
            STATE.selection = window.getSelection().toString().trim();
            Dashboard.el.classList.add('open');
            Dashboard.renderHome();
        },
        close: () => Dashboard.el.classList.remove('open'),

        renderHome: () => {
            STATE.currentView = 'home';
            Dashboard.el.querySelector('.tm-back').style.display = 'none';
            Dashboard.el.querySelector('.tm-title').innerText = '全能助手 v7.6';
            const selInfo = STATE.selection ? `<span style="color:#28a745">已选中 ${STATE.selection.length} 字</span>` : '<span style="color:#999">未选中文本</span>';

            const defaultCards = [
                { id: 'btn-auto-push', icon: '🤖', text: '智能抓取并推送文章', action: Actions.autoPushArticle, class: 'primary full' },
                { id: 'btn-save', icon: '💾', text: '保存剪报', action: Actions.savePage, class: '' },
                { id: 'btn-read', icon: '👁️', text: '阅读模式', action: Reader.toggle, class: '' },
                { id: 'btn-push-art', icon: '📄', text: `推送文章<br><span style="font-size:10px">${selInfo}</span>`, action: () => Actions.pushSelection('article'), class: '' },
                { id: 'btn-push-word', icon: '🔤', text: `推送单词<br><span style="font-size:10px">${selInfo}</span>`, action: () => Actions.pushSelection('word'), class: '' },
                { id: 'btn-list', icon: '📋', text: '剪报列表', action: () => Dashboard.renderList(), class: '' },
                { id: 'btn-cal', icon: '📅', text: '日历归档', action: () => {
                    const now = new Date(); STATE.calYear = now.getFullYear(); STATE.calMonth = now.getMonth(); Dashboard.renderCal();
                }, class: '' },
                { id: 'btn-news', icon: '📰', text: '双语新闻', action: NewsModule.fetchAndDisplay, class: '', style: 'background:#e3f2fd;color:#0d47a1' },
                { id: 'btn-set', icon: '⚙️', text: '设置 & 样式', action: Dashboard.renderSet, class: '' }
            ];

            let savedOrder = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY_LAYOUT) || '[]');
            let itemsToRender = [];
            if (savedOrder.length > 0) {
                savedOrder.forEach(id => {
                    const card = defaultCards.find(c => c.id === id);
                    if (card) itemsToRender.push(card);
                });
                defaultCards.forEach(c => {
                    if (!savedOrder.includes(c.id)) itemsToRender.push(c);
                });
            } else {
                itemsToRender = defaultCards;
            }

            let gridHtml = `<div class="tm-grid" id="tm-grid-container">`;
            itemsToRender.forEach(item => {
                const styleAttr = item.style ? `style="${item.style}"` : '';
                gridHtml += `
                    <div class="tm-card ${item.class}" id="${item.id}" ${styleAttr} data-id="${item.id}">
                        <div class="tm-card-icon">${item.icon}</div>
                        <div class="tm-card-text">${item.text}</div>
                    </div>`;
            });
            gridHtml += `</div>
                <div style="text-align:center;margin-top:15px;">
                    <button id="btn-pull" style="background:#6c757d;color:white;border:none;padding:8px 15px;border-radius:20px;font-size:12px;cursor:pointer;">📥 强制拉取 GitHub 数据</button>
                </div>`;
            
            const contentDiv = Dashboard.el.querySelector('#tm-content');
            contentDiv.innerHTML = gridHtml;

            itemsToRender.forEach(item => {
                const btn = document.getElementById(item.id);
                if(btn) btn.onclick = item.action;
            });
            document.getElementById('btn-pull').onclick = Actions.sync;

            const gridEl = document.getElementById('tm-grid-container');
            if(window.Sortable) {
                new Sortable(gridEl, {
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    onEnd: function (evt) {
                        const newOrder = Array.from(gridEl.children).map(el => el.getAttribute('data-id'));
                        localStorage.setItem(CONFIG.STORAGE_KEY_LAYOUT, JSON.stringify(newOrder));
                    }
                });
            }

            Dashboard.updateFooter();
        },

        renderList: (filterDay = null) => {
            STATE.currentView = 'list';
            STATE.currentFilterDate = filterDay;
            Dashboard.el.querySelector('.tm-back').style.display = 'block';
            let title = '全部剪报', listData = STATE.data;
            if (filterDay) {
                const targetY = STATE.calYear, targetM = STATE.calMonth;
                title = `${targetY}/${targetM + 1}/${filterDay} 剪报`;
                listData = listData.filter(i => {
                    const d = UI.parseDate(i.timestamp);
                    return d.getFullYear() === targetY && d.getMonth() === targetM && d.getDate() === parseInt(filterDay);
                });
            }
            Dashboard.el.querySelector('.tm-title').innerText = title;
            const html = listData.length ? listData.map(i => `
                <div class="tm-list-item">
                    <a href="${i.url}" target="_blank" class="tm-list-title">${i.newsTitle}</a>
                    <div class="tm-list-meta">${i.timestamp}</div>
                    <span class="tm-list-del" data-id="${i.id}">🗑️</span>
                </div>`).join('') : '<div style="padding:20px;text-align:center;color:#999">暂无数据</div>';
            const contentEl = Dashboard.el.querySelector('#tm-content');
            contentEl.innerHTML = html;
            contentEl.querySelectorAll('.tm-list-del').forEach(btn => {
                btn.onclick = (e) => { e.stopPropagation(); Actions.deleteItem(parseInt(btn.getAttribute('data-id'))); };
            });
        },

        renderCal: () => {
            STATE.currentView = 'cal';
            Dashboard.el.querySelector('.tm-back').style.display = 'block';
            Dashboard.el.querySelector('.tm-title').innerText = '日历归档';
            UI.refreshData();
            const y = STATE.calYear, m = STATE.calMonth;
            const daysInMonth = new Date(y, m+1, 0).getDate();
            const firstDayOfWeek = new Date(y, m, 1).getDay();
            const currYear = new Date().getFullYear();
            let yearOpts = '';
            for(let i = currYear - 5; i <= currYear + 30; i++) yearOpts += `<option value="${i}" ${i === y ? 'selected' : ''}>${i}年</option>`;
            let monthOpts = '';
            for(let i = 0; i < 12; i++) monthOpts += `<option value="${i}" ${i === m ? 'selected' : ''}>${i+1}月</option>`;

            let grid = `
                <div class="tm-cal-header">
                    <div class="tm-cal-nav" id="tm-cal-prev">◀</div>
                    <div class="tm-cal-controls"><select id="tm-year-sel" class="tm-cal-select">${yearOpts}</select><select id="tm-month-sel" class="tm-cal-select">${monthOpts}</select></div>
                    <div class="tm-cal-nav" id="tm-cal-next">▶</div>
                </div>
                <div class="tm-cal-grid">
                    <div class="tm-cal-head">日</div><div class="tm-cal-head">一</div><div class="tm-cal-head">二</div><div class="tm-cal-head">三</div><div class="tm-cal-head">四</div><div class="tm-cal-head">五</div><div class="tm-cal-head">六</div>`;
            const countMap = {};
            STATE.data.forEach(d => {
                const dateObj = UI.parseDate(d.timestamp);
                if (dateObj.getFullYear() === y && dateObj.getMonth() === m) {
                    const day = dateObj.getDate(); countMap[day] = (countMap[day]||0)+1;
                }
            });
            for(let i=0; i<firstDayOfWeek; i++) grid+=`<div></div>`;
            for(let d=1; d<=daysInMonth; d++) {
                const has = countMap[d];
                grid += `<div ${has ? `data-date="${d}" class="tm-cal-cell has"` : `class="tm-cal-cell"`}>${d}${has?`<span class="tm-cal-badge">${has}</span>`:''}</div>`;
            }
            grid += '</div>';
            const contentEl = Dashboard.el.querySelector('#tm-content');
            contentEl.innerHTML = grid;
            contentEl.querySelectorAll('.tm-cal-cell.has').forEach(cell => cell.onclick = () => Dashboard.renderList(cell.getAttribute('data-date')));
            contentEl.querySelector('#tm-cal-prev').onclick = () => { STATE.calMonth--; if(STATE.calMonth<0){STATE.calMonth=11;STATE.calYear--;} Dashboard.renderCal(); };
            contentEl.querySelector('#tm-cal-next').onclick = () => { STATE.calMonth++; if(STATE.calMonth>11){STATE.calMonth=0;STATE.calYear++;} Dashboard.renderCal(); };
            contentEl.querySelector('#tm-year-sel').onchange = (e) => { STATE.calYear = parseInt(e.target.value); Dashboard.renderCal(); };
            contentEl.querySelector('#tm-month-sel').onchange = (e) => { STATE.calMonth = parseInt(e.target.value); Dashboard.renderCal(); };
        },

        renderSet: () => {
            Dashboard.el.querySelector('.tm-back').style.display = 'block';
            Dashboard.el.querySelector('.tm-title').innerText = '设置 & 样式';
            
            const currentFont = GM_getValue('cfg_font_family', '');
            const currentShadow = GM_getValue('cfg_font_shadow', 0);

            // 生成字体选项
            let fontOpts = '';
            FONT_PRESETS.forEach(p => {
                fontOpts += `<option value='${p.value}' ${currentFont === p.value ? 'selected' : ''}>${p.name}</option>`;
            });

            Dashboard.el.querySelector('#tm-content').innerHTML = `
                <div style="padding:5px">
                    <p style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:5px; font-weight:bold; color:#007bff;">🎨 样式偏好</p>
                    
                    <label class="tm-label">全局字体:</label>
                    <select id="inp-font" class="tm-select">
                        ${fontOpts}
                    </select>

                    <label class="tm-label">字体阴影深度 (增强对比): <span id="val-shadow" style="color:#007bff">${currentShadow}</span>px</label>
                    <div class="tm-range-group">
                        <span style="font-size:10px;color:#999">无</span>
                        <input type="range" id="inp-shadow" class="tm-range" min="0" max="3" step="0.1" value="${currentShadow}">
                        <span style="font-size:10px;color:#999">深</span>
                    </div>

                    <p style="margin-top:20px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:5px; font-weight:bold; color:#007bff;">🔑 账号配置</p>
                    <label class="tm-label">GitHub Token:</label>
                    <input class="tm-input" id="inp-tok" type="password" value="${STATE.ghToken}" placeholder="ghp_xxxx...">
                    
                    <button class="tm-btn" id="btn-save-set">保存并应用</button>
                    <p style="font-size:10px; color:#999; margin-top:10px;">注：字体设置将应用到所有网站，刷新页面后依然有效。</p>
                </div>`;

            // 绑定事件
            const shadowInp = document.getElementById('inp-shadow');
            const shadowVal = document.getElementById('val-shadow');
            shadowInp.oninput = (e) => shadowVal.innerText = e.target.value;

            Dashboard.el.querySelector('#btn-save-set').onclick = () => {
                const token = document.getElementById('inp-tok').value.trim();
                const font = document.getElementById('inp-font').value;
                const shadow = parseFloat(document.getElementById('inp-shadow').value);

                GM_setValue('gh_token', token); 
                STATE.ghToken = token;
                
                GM_setValue('cfg_font_family', font);
                GM_setValue('cfg_font_shadow', shadow);
                
                StyleManager.apply(); // 立即应用样式
                
                UI.toast("✅ 设置已保存并生效"); 
                // 不自动跳回主页，方便用户反复调整
            };
        },
        updateFooter: () => {
            const f = Dashboard.el.querySelector('#tm-status');
            f.innerHTML = STATE.ghToken ? `<span style="color:green">● 已连接 GitHub</span>` : `<span style="color:red">● 未配置 Token</span>`;
        }
    };

    const Reader = {
        on: false,
        toggle: () => {
            Reader.on = !Reader.on;
            let s = document.getElementById('tm-read-css');
            if(Reader.on) {
                Dashboard.close();
                if(!s) {
                    s = document.createElement('style'); s.id='tm-read-css';
                    s.innerText = `body{background:#cce8cf!important;color:#333!important}div:not(#tm-dashboard *):not(#tm-toast){background:none!important}p{font-size:18px!important;line-height:1.8!important;max-width:800px;margin:0 auto}`;
                    document.head.appendChild(s);
                }
                UI.toast("🌿 阅读模式开启");
            } else {
                if(s) s.remove();
                UI.toast("已恢复默认");
            }
        }
    };

    // ========================================================================
    // [初始化]
    // ========================================================================
    StyleManager.init(); // 初始化样式
    NewsModule.enhanceReadability();
    GM_registerMenuCommand("⚙️ 设置", Dashboard.open);
    if (!STATE.data.length && STATE.ghToken) setTimeout(Actions.sync, 1500);

})();
