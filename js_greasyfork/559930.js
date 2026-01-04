// ==UserScript==
// @name         知乎全能助手-知乎文章下载/复制
// @namespace    Zhihuback
// @version      3.6.2
// @description  知乎全能助手--文章下载/复制，支持单篇内容一键复制为Markdown格式，批量下载/导出回答/文章/想法/收藏夹为HTML/JSON（带精选评论）；修复个人主页想法抓取失败问题，优化想法标题为「日期+内容摘要」，导出HTML自带清晰目录与美观排版。
// @author       AI & waterhuo
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559930/%E7%9F%A5%E4%B9%8E%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B-%E7%9F%A5%E4%B9%8E%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/559930/%E7%9F%A5%E4%B9%8E%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B-%E7%9F%A5%E4%B9%8E%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 配置区域
    // ==========================================
    const CONFIG = {
        commentLimit: 15,
        requestDelay: 1000
    };

    const STATE = {
        isRunning: false,
        items: [],
        currentType: '',
        id: '',
        pageTitle: '',
        cancel: false
    };

    const UI = {
        panel: null,
        logArea: null,
        progressBar: null,
        statusDiv: null
    };

    // ==========================================
    // 模块一：文件名生成器
    // ==========================================
    function getFormattedDate() {
        const now = new Date();
        const y = now.getFullYear();
        const m = (now.getMonth() + 1).toString().padStart(2, '0');
        const d = now.getDate().toString().padStart(2, '0');
        const h = now.getHours().toString().padStart(2, '0');
        const min = now.getMinutes().toString().padStart(2, '0');
        const s = now.getSeconds().toString().padStart(2, '0');
        return `${y}${m}${d}`;
    }

    function generateFilename(extension) {
        const typeMap = { 'collection': '收藏夹', 'people_answers': '用户回答', 'people_articles': '用户文章', 'people_activities': '用户动态', 'people_pins': '用户想法' };
        const typeStr = `[${typeMap[STATE.currentType] || '批量导出'}]`;
        let rawTitle = STATE.pageTitle || document.title || '';
        rawTitle = rawTitle.replace(/^[\(（][\d\s\u4e00-\u9fa5\/_\-]+[\)）]\s*/, '').replace(' - 知乎', '').trim();
        let nameStr = rawTitle || STATE.id || '未知目标';
        nameStr = sanitizeFileName(nameStr);
        const timeStr = getFormattedDate();
        const countStr = `(共${STATE.items.length}条)`;
        return `${typeStr} ${nameStr}_${timeStr} ${countStr}.${extension}`;
    }

    // ==========================================
    // 模块二：高级 DOM 解析器
    // ==========================================
    const cleanLink = (link) => {
        if (!link) return '';
        try {
            const url = new URL(link);
            if (url.hostname === "link.zhihu.com") {
                const target = url.searchParams.get("target");
                return target ? decodeURIComponent(target) : link;
            }
        } catch (e) {}
        return link;
    };

    function parseContentToMarkdown(htmlString) {
        if (!htmlString) return '';
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        return walkNodes(doc.body).trim();
    }

    function walkNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\u200B/g, '');
        if (node.nodeType !== Node.ELEMENT_NODE) return '';
        const tagName = node.tagName.toLowerCase();
        let childrenText = '';
        node.childNodes.forEach(child => childrenText += walkNodes(child));

        switch (tagName) {
            case 'h1': return `\n# ${childrenText}\n\n`;
            case 'h2': return `\n## ${childrenText}\n\n`;
            case 'h3': return `\n### ${childrenText}\n\n`;
            case 'h4': return `\n#### ${childrenText}\n\n`;
            case 'p': return node.classList.contains('ztext-empty-paragraph') ? '' : `${childrenText}\n\n`;
            case 'br': return '  \n';
            case 'b': case 'strong': return ` **${childrenText}** `;
            case 'i': case 'em': return ` *${childrenText}* `;
            case 'blockquote': return `\n> ${childrenText.replace(/\n/g, '\n> ')}\n\n`;
            case 'a': return `[${childrenText}](${cleanLink(node.getAttribute('href'))})`;
            case 'img':{
                const src = node.getAttribute('data-actualsrc') || node.getAttribute('data-original') || node.getAttribute('src');
                if (!src) return '';
                if (node.classList.contains('ztext-math') || src.includes('equation?tex=')) {
                    const tex = node.getAttribute('data-tex') || node.getAttribute('alt');
                    return tex ? ` $${tex}$ ` : '';
                }
                return `\n![](${src})\n`;
            }
            case 'span': return node.classList.contains('ztext-math') ? ` $${node.getAttribute('data-tex')}$ ` : childrenText;
            case 'div':
                if (node.classList.contains('highlight')) {
                    const code = node.textContent;
                    const lang = node.querySelector('pre > code')?.className.match(/language-(\w+)/)?.[1] || '';
                    return `\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
                }
                return childrenText;
            case 'li': return `- ${childrenText}\n`;
            case 'ul': case 'ol': return `\n${childrenText}\n`;
            case 'hr': return '\n---\n';
            default: return childrenText;
        }
    }

    // ==========================================
    // 模块三：单篇复制按钮
    // ==========================================
    function injectCopyButtons() {
        const items = document.querySelectorAll('.ContentItem, .Post-content, .SearchResult-Card, .PinItem');
        items.forEach(item => {
            if (item.getAttribute('data-md-btn-added')) return;
            item.setAttribute('data-md-btn-added', 'true');
            let targetArea = item.querySelector('.ContentItem-meta') || (item.classList.contains('Post-content') ? document.querySelector('.Post-Header') : null) || item.querySelector('.ContentItem-actions') || item.querySelector('.QuestionHeader-title') || (item.classList.contains('PinItem') ? item.querySelector('.PinItem-content') : null);

            if (targetArea) {
                const btn = document.createElement('span');
                btn.className = 'zbc-copy-btn';
                btn.style.cssText = `margin-left:2px; margin-top:8px; display:inline-flex; align-items:center; cursor:pointer; background-color:#f0f2f5; color:#374151; font-size:13px; line-height:1.4; padding:2px 8px; border-radius:4px; transition:all 0.2s ease;`;
                if (targetArea.className && targetArea.className.includes('ContentItem-actions')) { btn.style.marginTop = '0px'; btn.style.order = '99'; } else if (item.classList.contains('PinItem')) { btn.style.marginBottom = '10px'; btn.style.display = 'inline-block'; }

                btn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" style="margin-right:4px; fill:currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> 复制为Markdown`;
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = `<span style="color:#1772f6">解析中...</span>`;
                    try {
                        let contentHtml = '', url = '', title = '';
                        const richText = item.querySelector('.RichContent-inner') || item.querySelector('.Post-RichText') || item.querySelector('.RichText') || item.querySelector('.PinItem-content');
                        if (richText) contentHtml = richText.innerHTML;
                        const titleEl = item.querySelector('.ContentItem-title') || document.querySelector('.QuestionHeader-title') || document.querySelector('.Post-Title') || item.querySelector('h1') || item.querySelector('h2');
                        title = item.classList.contains('PinItem') ? "想法" : (titleEl ? titleEl.innerText : '无标题');
                        const metaUrl = item.querySelector('meta[itemprop="url"]');
                        url = metaUrl ? metaUrl.content : window.location.href;
                        if (!contentHtml) { const expandBtn = item.querySelector('.ContentItem-expandButton'); if(expandBtn) { expandBtn.click(); throw new Error('需展开'); } throw new Error('无内容'); }
                        let markdown = `# ${title}\n\n` + parseContentToMarkdown(contentHtml) + `\n\n> 来源: [${url}](${url})`;
                        GM_setClipboard(markdown);
                        btn.innerHTML = `<span style="color:#00a65e">✔ 成功</span>`; setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
                    } catch (err) { console.error(err); btn.innerHTML = `<span style="color:red">失败</span>`; setTimeout(() => { btn.innerHTML = originalHTML; }, 2000); }
                };
                if (item.classList.contains('PinItem')) targetArea.parentNode.insertBefore(btn, targetArea); else targetArea.appendChild(btn);
            }
        });
    }

    // ==========================================
    // 模块四：批量导出核心
    // ==========================================
    function initPanelUI() {
        const style = document.createElement('style');
        style.textContent = `#zbc-panel { position: fixed; top: 100px; right: 20px; width: 340px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; z-index: 9999; font-family: sans-serif; border: 1px solid #ebebeb; display: none; font-size: 14px; } #zbc-header { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; background: #f6f6f6; border-radius: 8px 8px 0 0; font-weight: bold; color: #1772f6; display: flex; justify-content: space-between; align-items: center; } #zbc-body { padding: 16px; } .zbc-btn { display: block; width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #1772f6; color: #1772f6; background: #fff; border-radius: 4px; cursor: pointer; text-align: center; transition: 0.2s; font-size: 13px; } .zbc-btn:hover { background: #eef6ff; } .zbc-btn:disabled { border-color: #ccc; color: #ccc; cursor: not-allowed; background: #f9f9f9;} .zbc-btn.primary { background: #1772f6; color: #fff; } .zbc-btn.primary:hover { background: #1062d6; } #zbc-log { height: 160px; overflow-y: auto; background: #f9f9f9; border: 1px solid #eee; padding: 8px; font-size: 12px; margin-bottom: 10px; color: #666; line-height: 1.4; } .zbc-progress { height: 4px; background: #eee; width: 100%; margin-bottom: 10px; } .zbc-progress-bar { height: 100%; background: #1772f6; width: 0%; transition: width 0.3s; } .zbc-close { cursor: pointer; color: #999; font-size: 18px; line-height: 1; }`;
        document.head.appendChild(style);
        const panel = document.createElement('div'); panel.id = 'zbc-panel';
        panel.innerHTML = `<div id="zbc-header"><span>知乎全能抓取Pro</span><span class="zbc-close" onclick="document.getElementById('zbc-panel').style.display='none'">×</span></div><div id="zbc-body"><div id="zbc-status" style="margin-bottom:5px;font-weight:bold;">等待操作</div><div style="font-size:12px;color:#999;margin-bottom:10px">策略：强制回源(防空) + 想法标题优化</div><div class="zbc-progress"><div class="zbc-progress-bar" id="zbc-bar"></div></div><div id="zbc-log"></div><div style="display:flex; gap:5px;"><button id="zbc-start" class="zbc-btn primary">开始抓取</button><button id="zbc-stop" class="zbc-btn" disabled>停止</button></div><hr style="border:0; border-top:1px solid #eee; margin: 10px 0;"><button id="zbc-export-html" class="zbc-btn" disabled>💾 导出 HTML (带评论)</button><button id="zbc-export-json" class="zbc-btn" disabled>⚙️ 导出 JSON</button></div>`;
        document.body.appendChild(panel);
        UI.panel = panel; UI.logArea = document.getElementById('zbc-log'); UI.progressBar = document.getElementById('zbc-bar'); UI.statusDiv = document.getElementById('zbc-status');
        document.getElementById('zbc-start').onclick = startScraping; document.getElementById('zbc-stop').onclick = () => { STATE.cancel = true; log('正在停止...'); }; document.getElementById('zbc-export-html').onclick = () => exportSingleHTML(); document.getElementById('zbc-export-json').onclick = () => exportJSON();
        const toggleBtn = document.createElement('div'); toggleBtn.innerText = '📂'; toggleBtn.title = '打开批量导出面板'; toggleBtn.style.cssText = 'position:fixed; bottom:80px; right:20px; width:40px; height:40px; background:#1772f6; color:#fff; border-radius:50%; text-align:center; line-height:40px; cursor:pointer; z-index:9998; box-shadow:0 2px 10px rgba(0,0,0,0.2); font-size:20px;'; toggleBtn.onclick = () => { panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; detectPage(); }; document.body.appendChild(toggleBtn);
    }

    function log(msg) { const p = document.createElement('div'); p.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`; UI.logArea.prepend(p); }

    function detectPage() {
        const url = window.location.href;
        STATE.pageTitle = document.title;
        if (url.includes('/collection/')) { const match = url.match(/collection\/(\d+)/); if(match) return updateStatus('collection', match[1], '收藏夹'); }
        else if (url.includes('/people/')) { const match = url.match(/people\/([^/]+)/); if(match) { if(url.includes('/answers')) return updateStatus('people_answers', match[1], '用户回答'); if(url.includes('/posts')||url.includes('/articles')) return updateStatus('people_articles', match[1], '用户文章'); if(url.includes('/pins')) return updateStatus('people_pins', match[1], '用户想法'); return updateStatus('people_activities', match[1], '用户动态(全能)'); } }
        UI.statusDiv.innerText = '请进入用户主页或收藏夹'; return null;
    }

    function updateStatus(type, id, label) { STATE.currentType = type; STATE.id = id; UI.statusDiv.innerText = `当前：${label}`; return { type, id }; }

    async function startScraping() {
        const pageInfo = detectPage();
        if (!pageInfo) { alert('无法识别当前页面'); return; }
        STATE.isRunning = true; STATE.cancel = false; STATE.items = [];
        document.getElementById('zbc-start').disabled = true; document.getElementById('zbc-stop').disabled = false; toggleExportBtns(false); UI.logArea.innerHTML = '';

        let nextUrl = '';
        if (pageInfo.type === 'collection') nextUrl = `https://www.zhihu.com/api/v4/collections/${pageInfo.id}/items?offset=0&limit=20`;
        else if (pageInfo.type === 'people_answers') nextUrl = `https://www.zhihu.com/api/v4/members/${pageInfo.id}/answers?offset=0&limit=20&sort_by=created`;
        else if (pageInfo.type === 'people_articles') nextUrl = `https://www.zhihu.com/api/v4/members/${pageInfo.id}/articles?offset=0&limit=20&sort_by=created`;
        else if (pageInfo.type === 'people_pins') nextUrl = `https://www.zhihu.com/api/v4/members/${pageInfo.id}/pins?offset=0&limit=20`;
        else if (pageInfo.type === 'people_activities') nextUrl = `https://www.zhihu.com/api/v4/members/${pageInfo.id}/activities?limit=20&desktop=true`;

        try {
            let count = 0;
            while (nextUrl && !STATE.cancel) {
                log(`请求列表中...`);
                const data = await fetchAPI(nextUrl);
                if (data.data && data.data.length > 0) {
                    for (const item of data.data) {
                        if (STATE.cancel) break;
                        let targetItem = item;

                        // --- 【核心修复】提取逻辑 ---
                        if (pageInfo.type === 'people_activities') {
                            if (['ANSWER_CREATE', 'ARTICLE_CREATE', 'PIN_CREATE', 'MEMBER_CREATE_PIN'].includes(item.verb)) {
                                targetItem = item.target;
                            } else continue;
                        }
                        else if (pageInfo.type === 'collection') {
                            if (item.content) targetItem = item.content; // 收藏夹有包裹
                        }

                        if (!targetItem || !targetItem.id) continue;

                        count++;
                        const idxStr = `[第${count}条]`;
                        let processed = null;

                        // 1. 提取显示标题 (此处仅用于日志，最终标题在 processItem 中生成)
                        let displayTitle = targetItem.title;
                        if (!displayTitle && targetItem.question) displayTitle = targetItem.question.title;
                        if (!displayTitle && (targetItem.type === 'pin' || targetItem.type === 'moment')) {
                            // 想法没有标题，尝试截取内容
                            let pinContent = targetItem.excerpt || (Array.isArray(targetItem.content) ? targetItem.content[0]?.content : '');
                            displayTitle = pinContent ? `想法: ${pinContent.slice(0,10)}...` : '想法动态';
                        }
                        if (!displayTitle) displayTitle = '无标题';

                        log(`${idxStr} 正在抓取: ${displayTitle}...`);

                        // 2. 强制回源抓取
                        try { const fullData = await fetchDetail(targetItem.id, targetItem.type); processed = processItem(fullData || targetItem); }
                        catch(e) { processed = processItem(targetItem); }

                        // 3. 评论抓取
                        if (processed.comment_count > 0) { try { processed.comments = await fetchComments(processed.id, processed.type); } catch(e) { processed.comments = []; } } else { processed.comments = []; }

                        STATE.items.push(processed);
                        await sleep(CONFIG.requestDelay);
                    }
                    if (!data.paging || data.paging.is_end || !data.paging.next) { nextUrl = null; } else { nextUrl = data.paging.next; UI.progressBar.style.width = '50%'; }
                } else { nextUrl = null; }
            }
        } catch (e) { log('错误: ' + e.message); console.error(e); }
        STATE.isRunning = false; document.getElementById('zbc-start').disabled = false; document.getElementById('zbc-stop').disabled = true; UI.progressBar.style.width = '100%';
        if (STATE.items.length > 0) { log(`抓取完成，共 ${STATE.items.length} 条`); toggleExportBtns(true); } else { log('未找到有效内容'); }
    }

    function fetchDetail(id, type) {
        return new Promise((resolve) => {
            let url = '';
            if (type === 'answer') url = `https://www.zhihu.com/api/v4/answers/${id}?include=content,voteup_count,comment_count,created_time,author,updated_time,question.title`;
            else if (type === 'article') url = `https://www.zhihu.com/api/v4/articles/${id}?include=content,voteup_count,comment_count,created_time,author`;
            else if (type === 'pin' || type === 'moment') url = `https://www.zhihu.com/api/v4/pins/${id}?include=content,origin_pin,content_html,created_time,author`;
            if(!url) return resolve(null);
            GM_xmlhttpRequest({ method: "GET", url: url, onload: (res) => { if (res.status === 200) try { resolve(JSON.parse(res.responseText)); } catch (e) { resolve(null); } else resolve(null); }, onerror: () => resolve(null) });
        });
    }

    function fetchComments(id, type) {
        return new Promise((resolve) => {
            let resourceType = 'answers'; if (type === 'article') resourceType = 'articles'; if (type === 'pin' || type === 'moment') resourceType = 'pins';
            const url = `https://www.zhihu.com/api/v4/${resourceType}/${id}/root_comments?order=normal&limit=${CONFIG.commentLimit}&offset=0&status=open`;
            GM_xmlhttpRequest({ method: "GET", url: url, onload: (res) => { if (res.status === 200) { try { const data = JSON.parse(res.responseText).data; resolve(data.map(c => ({ author: c.author.member.name, content: c.content, vote_count: c.vote_count, created_time: new Date(c.created_time * 1000).toLocaleString() }))); } catch(e) { resolve([]); } } else { resolve([]); } }, onerror: () => resolve([]) });
        });
    }

    function fetchAPI(url) { return new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: "GET", url: url, onload: (res) => { if (res.status === 200) try { resolve(JSON.parse(res.responseText)); } catch (e) { reject(e); } else reject(new Error(res.status)); }, onerror: (err) => reject(err) }); }); }

    function processItem(item) {
        let content = '', title = '', type = item.type;
        // --- 想法的标题提取逻辑 (核心修改) ---
        if (type === 'pin' || type === 'moment') {
            // 1. 生成时间字符串 (增强容错)
            let dateStr = '未知日期';
            if (item.created_time) {
                try { dateStr = new Date(item.created_time * 1000).toLocaleString(); } catch(e) {}
            }

            // 2. 尝试提取摘要作为标题
            let summary = '';
            // 尝试获取 excerpt_title
            if (item.excerpt_title) summary = item.excerpt_title;
            // 尝试从 content_html 中提取纯文本
            else if (item.content_html) summary = item.content_html.replace(/<[^>]+>/g, "");
            // 尝试从 content 数组中提取文本
            else if (Array.isArray(item.content)) {
                summary = item.content.filter(c => c.type === 'text').map(c => c.content).join('');
            }

            if (summary) {
                // 如果有摘要，使用摘要前20个字 + ...
                title = `想法: ${summary.slice(0, 20).replace(/[\r\n]/g, ' ')}...`;
            } else {
                // 如果实在没内容，使用日期兜底
                title = `想法 ${dateStr}`;
            }

            // 3. 内容拼接
            if (item.content_html) content = item.content_html;
            else if (Array.isArray(item.content)) { item.content.forEach(c => { if (c.type === 'text') content += `<p>${c.content}</p>`; if (c.type === 'image') content += `<img src="${c.url}" style="max-width:100%;margin:10px 0;display:block;" />`; }); }
            if (item.origin_pin) {
                let originContent = item.origin_pin.content_html || '';
                if (!originContent && Array.isArray(item.origin_pin.content)) { item.origin_pin.content.forEach(c => { if (c.type === 'text') originContent += `<p>${c.content}</p>`; if (c.type === 'image') originContent += `<img src="${c.url}" style="max-width:100%;"/>`; }); }
                content += `<blockquote style="background:#f6f6f6;padding:10px;margin-top:10px;border-left:3px solid #ccc;"><strong>转发自 ${item.origin_pin.author.name}:</strong><br/>${originContent}</blockquote>`;
            }
        } else {
            content = item.content || item.excerpt || '';
            content = content.replace(/<img [^>]*data-actualsrc="([^"]+)"[^>]*>/g, '<img src="$1">').replace(/<img [^>]*data-original="([^"]+)"[^>]*>/g, '<img src="$1">');
            title = item.title; if (!title && item.question) title = item.question.title;
            if (!title) title = "无标题";
        }
        return {
            id: item.id, type: type, title: title,
            author: item.author ? item.author.name : '匿名',
            content: content,
            voteup_count: item.voteup_count || item.likes_count || 0,
            comment_count: item.comment_count || 0,
            created_time: new Date((item.created_time||Date.now()/1000) * 1000).toLocaleString(),
            url: item.url ? item.url.replace("api.zhihu.com", "www.zhihu.com") : `https://www.zhihu.com/pin/${item.id}`,
            comments: []
        };
    }

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function sanitizeFileName(name) { return name.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ").trim(); }
    function toggleExportBtns(enable) { document.getElementById('zbc-export-html').disabled = !enable; document.getElementById('zbc-export-json').disabled = !enable; }

    function exportSingleHTML() {
        log('生成HTML...');
        const filename = generateFilename('html');
        let tocHtml = STATE.items.map((item, index) => `<li><a href="#item-${index}">${index + 1}. [${item.type}] ${item.title}</a></li>`).join('');
        let contentHtml = STATE.items.map((item, index) => {
            let commentsHtml = '';
            if (item.comments && item.comments.length > 0) {
                const cList = item.comments.map(c => `<div class="comment-item"><div class="comment-meta"><span class="comment-author">${c.author}</span><span class="comment-time">${c.created_time}</span><span class="comment-vote">👍 ${c.vote_count}</span></div><div class="comment-content">${c.content}</div></div>`).join('');
                commentsHtml = `<div class="comments-section"><div class="comments-title">精选评论 (${item.comments.length})</div>${cList}</div>`;
            } else { commentsHtml = `<div class="comments-section" style="text-align:center;color:#ccc;font-size:12px;">暂无评论</div>`; }
            return `<div class="article-item" id="item-${index}"><div class="article-header"><h2><a href="${item.url}" target="_blank">${item.title}</a></h2><div class="meta"><span class="tag">${item.type}</span><span>${item.author}</span><span>${item.created_time}</span><span>👍 ${item.voteup_count}</span></div></div><div class="article-content">${item.content}</div>${commentsHtml}<div class="back-to-top"><a href="#toc">↑ 回到目录</a></div><hr class="separator"></div>`;
        }).join('');
        const finalHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;max-width:900px;margin:0 auto;padding:20px;line-height:1.7;color:#121212;background-color:#f6f6f6}.container{background:#fff;padding:40px;border-radius:8px;box-shadow:0 1px 3px rgba(26,26,26,.1)}h1.main-title{text-align:center;margin-bottom:30px;color:#1772f6}#toc{background:#f9f9f9;padding:20px;border-radius:6px;margin-bottom:40px;border:1px solid #eee;max-height:400px;overflow-y:auto}#toc ul{list-style:none;padding:0}#toc li{margin-bottom:8px;border-bottom:1px dashed #eee;padding-bottom:4px}#toc a{text-decoration:none;color:#333;font-size:14px}#toc a:hover{color:#1772f6}.article-item{margin-bottom:60px}.article-header h2{margin-bottom:10px;font-size:22px}.article-header a{text-decoration:none;color:#121212}.article-header a:hover{color:#1772f6}.meta{font-size:13px;color:#8590a6;margin-bottom:20px;display:flex;gap:10px}.meta .tag{background:#e5f2ff;color:#0084ff;padding:2px 6px;border-radius:3px}.article-content img{max-width:100%;height:auto;display:block;margin:10px auto;border-radius:4px;cursor:zoom-in}.article-content blockquote{border-left:3px solid #dfe3eb;color:#646464;padding-left:15px;margin:1em 0;background:#f8f8fa;padding:10px}.article-content p{margin-bottom:1.2em;text-align:justify}.comments-section{margin-top:30px;background:#f9f9fa;padding:15px;border-radius:4px;border:1px solid #f0f0f0}.comments-title{font-weight:bold;margin-bottom:15px;font-size:14px;color:#444;border-bottom:2px solid #1772f6;display:inline-block;padding-bottom:4px}.comment-item{padding:12px 0;border-bottom:1px solid #eee}.comment-item:last-child{border-bottom:none}.comment-meta{font-size:12px;color:#999;margin-bottom:6px;display:flex;justify-content:space-between}.comment-author{color:#444;font-weight:600}.comment-vote{color:#1772f6}.comment-content{font-size:13px;color:#333;line-height:1.5}.comment-content img{max-width:100px;display:block;margin-top:5px}.separator{border:0;height:1px;background:#ebebeb;margin:40px 0}.back-to-top{text-align:right;margin-top:10px}.back-to-top a{color:#8590a6;font-size:12px;text-decoration:none}</style></head><body><div class="container"><h1 class="main-title">${filename}</h1><div id="toc"><h3>目录 (共 ${STATE.items.length} 条)</h3><ul>${tocHtml}</ul></div><div id="main-content">${contentHtml}</div></div></body></html>`;
        saveAs(new Blob([finalHtml], { type: "text/html;charset=utf-8" }), filename);
        log(`HTML 已导出: ${filename}`);
    }

    function exportJSON() {
        const filename = generateFilename('json');
        saveAs(new Blob([JSON.stringify(STATE.items, null, 2)], { type: "application/json;charset=utf-8" }), filename);
        log(`JSON 已导出: ${filename}`);
    }

    const observer = new MutationObserver(() => { setTimeout(injectCopyButtons, 500); });
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(injectCopyButtons, 2000);
    injectCopyButtons();
    initPanelUI();

})();