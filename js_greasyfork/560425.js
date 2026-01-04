// ==UserScript==
// @name         NGA帖子AI总结助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动抓取NGA帖子内容并调用LLM进行总结
// @author       legendoflink with Gemini 3 pro
// @match        *://bbs.nga.cn/read.php?*
// @match        *://ngabbs.com/read.php?*
// @match        *://nga.178.com/read.php?*
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560425/NGA%E5%B8%96%E5%AD%90AI%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560425/NGA%E5%B8%96%E5%AD%90AI%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("NGA AI Summary Script Loaded");

    // --- 配置 ---
    const CONFIG = {
        apiKey: GM_getValue('apiKey', ''),
        apiEndpoint: GM_getValue('apiEndpoint', 'https://api.openai.com/v1/chat/completions'),
        model: GM_getValue('model', 'gpt-3.5-turbo'),        temperature: GM_getValue('temperature', 1.0),
        thinkingMode: GM_getValue('thinkingMode', false),        promptTemplate: GM_getValue('promptTemplate', '以下记录了一个帖子中每一楼层的全部发言，按用户名区分、分析每个发言者表达的意见。总结、归类合并相似意见，给出一份报告内容为帖子内每种意见的人数和占比，并对整个帖子的整体讨论内容做出符合正常价值观的合理评论：\n\n{{content}}'),
        melonPromptTemplate: GM_getValue('melonPromptTemplate', '以下记录了一个帖子中每一楼层的全部发言，其中包含了一个“瓜”即社区争议事件，梳理出事件的起因、经过和结果。重点关注：\n1. 楼主的核心观点或遭遇。\n2. 主要的争议点是什么？\n3. 关键的“神回复”或反转楼层。\n4. 网友们的主要阵营和观点分布。\n请用逻辑严密的语言输出一份“瓜条”，内容应当包含事件发生的完整时间轴。\n\n{{content}}'),
        maxPages: 9999,
        delay: 1500
    };

    // --- UI 注入 ---
    function initUI() {
        // 尝试多个注入点
        const targets = [
            document.getElementById('postsubject0'), // 1楼标题
            document.querySelector('#m_pbtntop .right_'), // 顶部发帖按钮旁
            document.querySelector('.nav_link') // 导航栏
        ];

        let target = null;
        for (let t of targets) {
            if (t) {
                target = t;
                break;
            }
        }

        if (!target) {
            console.warn("NGA AI Summary: 找不到注入点，稍后重试...");
            setTimeout(initUI, 1000);
            return;
        }

        if (document.getElementById('nga-ai-summary-btn')) return; // 防止重复注入

        const btn = document.createElement('button');
        btn.id = 'nga-ai-summary-btn';
        btn.textContent = '🤖 AI 总结';
        btn.style.cssText = 'margin-left: 10px; padding: 5px 10px; background: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 3px; font-size: 12px; vertical-align: middle;';
        btn.onclick = () => startSummaryProcess('normal');
        target.appendChild(btn);

        const melonBtn = document.createElement('button');
        melonBtn.id = 'nga-ai-melon-btn';
        melonBtn.textContent = '🍉 切瓜模式';
        melonBtn.style.cssText = 'margin-left: 5px; padding: 5px 10px; background: #FF9800; color: white; border: none; cursor: pointer; border-radius: 3px; font-size: 12px; vertical-align: middle;';
        melonBtn.onclick = () => startSummaryProcess('melon');
        target.appendChild(melonBtn);

        const exportBtn = document.createElement('button');
        exportBtn.id = 'nga-ai-export-btn';
        exportBtn.textContent = '📊 导出表格';
        exportBtn.style.cssText = 'margin-left: 5px; padding: 5px 10px; background: #2196F3; color: white; border: none; cursor: pointer; border-radius: 3px; font-size: 12px; vertical-align: middle;';
        exportBtn.onclick = () => startSummaryProcess('export');
        target.appendChild(exportBtn);

        console.log("NGA AI Summary: 按钮注入成功");

        GM_registerMenuCommand("配置 API Key", configureSettings);
    }

    function configureSettings() {
        showSettingsModal();
    }

    function showSettingsModal() {
        // 预设配置
        const presets = {
            'pollinations': {
                endpoint: 'https://text.pollinations.ai/openai',
                model: 'gpt-4o-mini',
                key: 'dummy-key' // Pollinations 不需要 key
            },
            'deepseek': {
                endpoint: 'https://api.deepseek.com/chat/completions',
                model: 'deepseek-chat',
                key: ''
            },
            'siliconflow': {
                endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
                model: 'deepseek-ai/DeepSeek-V3.2',
                key: ''
            },
            'moonshot': {
                endpoint: 'https://api.moonshot.cn/v1/chat/completions',
                model: 'moonshot-v1-8k',
                key: ''
            }
        };

        const bindEvents = () => {
            const presetSelect = document.getElementById('cfg-preset');
            if (presetSelect) {
                // 移除旧的监听器（虽然直接赋值 onchange 会覆盖，但为了清晰）
                presetSelect.onchange = (e) => {
                    const val = e.target.value;
                    if (presets[val]) {
                        document.getElementById('cfg-endpoint').value = presets[val].endpoint;
                        document.getElementById('cfg-model').value = presets[val].model;
                        if (presets[val].key) {
                            document.getElementById('cfg-key').value = presets[val].key;
                        } else {
                            document.getElementById('cfg-key').value = '';
                            document.getElementById('cfg-key').placeholder = '请输入您的 API Key';
                        }
                    }
                };
            }
            
            document.getElementById('cfg-cancel').onclick = () => document.getElementById('nga-ai-settings-modal').style.display = 'none';
            
            document.getElementById('cfg-save').onclick = () => {
                const endpoint = document.getElementById('cfg-endpoint').value.trim();
                const model = document.getElementById('cfg-model').value.trim();
                const key = document.getElementById('cfg-key').value.trim();
                const prompt = document.getElementById('cfg-prompt').value.trim();
                const melonPrompt = document.getElementById('cfg-melon-prompt').value.trim();
                const temperature = parseFloat(document.getElementById('cfg-temperature').value);
                const thinkingMode = document.getElementById('cfg-thinking').checked;

                if (!endpoint || !model) {
                    alert("请填写 Endpoint 和 Model");
                    return;
                }

                CONFIG.apiEndpoint = endpoint;
                CONFIG.model = model;
                CONFIG.apiKey = key;
                CONFIG.promptTemplate = prompt;
                CONFIG.melonPromptTemplate = melonPrompt;
                CONFIG.temperature = temperature;
                CONFIG.thinkingMode = thinkingMode;

                GM_setValue('apiEndpoint', endpoint);
                GM_setValue('model', model);
                GM_setValue('apiKey', key);
                GM_setValue('promptTemplate', prompt);
                GM_setValue('melonPromptTemplate', melonPrompt);
                GM_setValue('temperature', temperature);
                GM_setValue('thinkingMode', thinkingMode);

                alert("配置已保存！");
                document.getElementById('nga-ai-settings-modal').style.display = 'none';
            };
            
            // 温度滑块显示数值
            const tempSlider = document.getElementById('cfg-temperature');
            const tempVal = document.getElementById('cfg-temperature-val');
            if (tempSlider && tempVal) {
                tempSlider.oninput = (e) => tempVal.textContent = e.target.value;
            }
        };

        let modal = document.getElementById('nga-ai-settings-modal');
        if (modal) {
            modal.style.display = 'block';
            // 更新输入框的值
            document.getElementById('cfg-endpoint').value = CONFIG.apiEndpoint;
            document.getElementById('cfg-model').value = CONFIG.model;
            document.getElementById('cfg-key').value = CONFIG.apiKey;
            document.getElementById('cfg-prompt').value = CONFIG.promptTemplate;
            document.getElementById('cfg-melon-prompt').value = CONFIG.melonPromptTemplate;
            document.getElementById('cfg-temperature').value = CONFIG.temperature;
            document.getElementById('cfg-temperature-val').textContent = CONFIG.temperature;
            document.getElementById('cfg-thinking').checked = CONFIG.thinkingMode;
            
            // 重新绑定事件以防万一
            bindEvents();
            return;
        }

        modal = document.createElement('div');
        modal.id = 'nga-ai-settings-modal';
        modal.style.cssText = 'position: fixed; top: 10%; left: 50%; transform: translateX(-50%); width: 500px; max-height: 80vh; overflow-y: auto; background: white; border: 1px solid #ccc; box-shadow: 0 0 15px rgba(0,0,0,0.5); z-index: 10000; padding: 20px; border-radius: 8px; font-family: sans-serif; font-size: 14px; color: #333;';
        
        const formHtml = `
            <h3 style="margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; color: #333;">AI 总结配置</h3>
            
            <div style="margin-bottom: 15px; background: #e8f5e9; padding: 10px; border-radius: 4px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">快速预设 (Presets)</label>
                <select id="cfg-preset" style="width: 100%; padding: 8px; border: 1px solid #4CAF50; border-radius: 4px;">
                    <option value="custom">自定义 (Custom)</option>
                    <option value="pollinations">Pollinations.ai (免费/无需Key/国内直连)</option>
                    <option value="deepseek">DeepSeek (推荐/需Key/价格低)</option>
                    <option value="siliconflow">SiliconFlow (需Key/部分免费)</option>
                    <option value="moonshot">Kimi/Moonshot (需Key)</option>
                </select>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">* 选择预设会自动填充下方配置，"无需Key"的服务可能不稳定。</div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">API Endpoint (Base URL)</label>
                <input type="text" id="cfg-endpoint" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px;" placeholder="https://api.openai.com/v1/chat/completions" value="${CONFIG.apiEndpoint}">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">模型名称 (Model)</label>
                <input type="text" id="cfg-model" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px;" placeholder="gpt-3.5-turbo" value="${CONFIG.model}">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">API Key</label>
                <input type="password" id="cfg-key" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px;" placeholder="sk-..." value="${CONFIG.apiKey}">
            </div>

            <div style="margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between;">
                <div style="flex: 1; margin-right: 20px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 5px;">温度 (Temperature): <span id="cfg-temperature-val">${CONFIG.temperature}</span></label>
                    <input type="range" id="cfg-temperature" min="0" max="2" step="0.1" value="${CONFIG.temperature}" style="width: 100%;">
                    <div style="font-size: 12px; color: #666;">范围 0-2。0=精确, 1=标准, >1=高随机性 (建议 0.5-1.0)</div>
                </div>
                <div>
                    <label style="display: block; font-weight: bold; margin-bottom: 5px;">Thinking 模式</label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="cfg-thinking" ${CONFIG.thinkingMode ? 'checked' : ''} style="margin-right: 5px;">
                        启用思维链显示
                    </label>
                    <div style="font-size: 12px; color: #666;">适用于 DeepSeek R1 等模型</div>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">常规总结提示词 (Prompt)</label>
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">使用 {{content}} 代表帖子内容</div>
                <textarea id="cfg-prompt" style="width: 100%; height: 100px; padding: 8px; box-sizing: border-box; resize: vertical; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;">${CONFIG.promptTemplate}</textarea>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">🍉 切瓜模式提示词 (Melon Prompt)</label>
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">用于“切瓜模式”的专用提示词</div>
                <textarea id="cfg-melon-prompt" style="width: 100%; height: 100px; padding: 8px; box-sizing: border-box; resize: vertical; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;">${CONFIG.melonPromptTemplate}</textarea>
            </div>

            <div style="text-align: right; border-top: 1px solid #eee; padding-top: 15px;">
                <button id="cfg-cancel" style="padding: 8px 15px; margin-right: 10px; cursor: pointer; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; color: #333;">取消</button>
                <button id="cfg-save" style="padding: 8px 15px; cursor: pointer; background: #4CAF50; color: white; border: none; border-radius: 4px;">保存配置</button>
            </div>
        `;
        
        modal.innerHTML = formHtml;
        document.body.appendChild(modal);

        bindEvents();
    }

    // --- 抓取逻辑 ---
    async function startSummaryProcess(mode = 'normal') {
        if (mode !== 'export' && !CONFIG.apiKey) {
            alert("请先在脚本菜单中配置 API Key");
            configureSettings();
            return;
        }

        if (mode !== 'export') {
            showModal();
            updateStatus("正在初始化...");
        } else {
            // 导出模式使用简单的 loading 提示或直接利用 modal
            showModal();
            updateStatus("正在抓取数据以导出...");
            document.getElementById('nga-ai-content').innerText = "正在抓取全楼数据，请稍候...";
        }

        const tid = getUrlParam('tid');
        if (!tid) {
            updateStatus("错误: 无法获取 TID");
            return;
        }

        let totalPages = 1;
        
        // 1. 优先尝试从 NGA 的全局变量 __PAGE 中获取精确的分页信息
        // 格式通常为: var __PAGE = {0:'/read.php?tid=...', 1:总楼层数, 2:当前页, 3:每页显示数};
        const scripts = document.querySelectorAll('script');
        let foundPageVar = false;
        
        for (let script of scripts) {
            if (script.textContent.includes('var __PAGE')) {
                const match = script.textContent.match(/var\s+__PAGE\s*=\s*(\{.*?\})/);
                if (match) {
                    try {
                        const pageDataStr = match[1];
                        // 提取 key 1 (总数) 和 key 3 (每页数)
                        const totalMatch = pageDataStr.match(/1\s*:\s*(\d+)/);
                        const perPageMatch = pageDataStr.match(/3\s*:\s*(\d+)/);
                        
                        if (totalMatch && perPageMatch) {
                            const totalItems = parseInt(totalMatch[1]);
                            const perPage = parseInt(perPageMatch[1]);
                            
                            if (totalItems > 0 && perPage > 0) {
                                totalPages = Math.ceil(totalItems / perPage);
                                console.log(`NGA AI Summary: 从 __PAGE 变量解析: 总楼层 ${totalItems}, 每页 ${perPage}, 总页数 ${totalPages}`);
                                foundPageVar = true;
                            }
                        }
                    } catch (e) {
                        console.error("NGA AI Summary: 解析 __PAGE 变量失败", e);
                    }
                }
                if (foundPageVar) break;
            }
        }

        // 2. 如果无法从变量获取，回退到通过 DOM 链接推断
        if (!foundPageVar) {
            console.log("NGA AI Summary: 未找到 __PAGE 变量，尝试通过页面链接推断页数");
            const pageLinks = document.querySelectorAll("a[href*='page=']");
            pageLinks.forEach(link => {
                const match = link.href.match(/page=(\d+)/);
                if (match) {
                    const p = parseInt(match[1]);
                    if (p > totalPages) totalPages = p;
                }
            });
        }
        
        console.log(`NGA AI Summary: 最终确认总页数 ${totalPages}`);

        const targetPages = Math.min(totalPages, CONFIG.maxPages);
        let allContent = [];

        for (let i = 1; i <= targetPages; i++) {
            updateStatus(`正在抓取第 ${i}/${targetPages} 页...`);
            updateProgress(((i - 1) / targetPages) * 100); // 进度条
            
            try {
                const html = await fetchPage(tid, i);
                const posts = parsePage(html);
                allContent = allContent.concat(posts);
                console.log(`NGA AI Summary: 第 ${i} 页抓取到 ${posts.length} 条回复`);
                
                await new Promise(r => setTimeout(r, CONFIG.delay + Math.random() * 1000));
            } catch (e) {
                updateStatus(`抓取第 ${i} 页失败: ${e.message}`);
                console.error(e);
            }
        }
        
        updateProgress(100);
        
        if (mode === 'export') {
            updateStatus(`抓取完成，共 ${allContent.length} 条回复。正在导出...`);
            exportToExcel(allContent);
            updateStatus("导出完成！");
            document.getElementById('nga-ai-content').innerText = `已导出 ${allContent.length} 条数据到 CSV 文件。`;
            return;
        }

        updateStatus(`抓取完成，共 ${allContent.length} 条回复。正在发送给 AI 分析...`);
        
        const promptText = buildPrompt(allContent, mode);
        
        try {
            let fullText = "";
            let fullThinking = "";
            
            await callLLM(promptText, (chunk, thinking) => {
                // 处理思考内容
                if (thinking) {
                    fullThinking += thinking;
                    const thinkingDiv = document.getElementById('nga-ai-thinking');
                    if (thinkingDiv) {
                        thinkingDiv.style.display = 'block';
                        thinkingDiv.textContent = fullThinking;
                        // 自动滚动思考区
                        thinkingDiv.scrollTop = thinkingDiv.scrollHeight;
                    }
                }
                
                // 处理正文内容
                if (chunk) {
                    fullText += chunk;
                    // 实时渲染 Markdown
                    if (typeof marked !== 'undefined') {
                        document.getElementById('nga-ai-content').innerHTML = marked.parse(fullText);
                    } else {
                        document.getElementById('nga-ai-content').innerText = fullText;
                    }
                    // 滚动到底部
                    const contentDiv = document.getElementById('nga-ai-content');
                    contentDiv.scrollTop = contentDiv.scrollHeight;
                }
            });
            updateStatus("分析完成");
        } catch (e) {
            updateStatus(`AI 分析失败: ${e.message}`);
            console.error(e);
        }
    }

    function getUrlParam(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    function fetchPage(tid, page) {
        return new Promise((resolve, reject) => {
            const url = `/read.php?tid=${tid}&page=${page}`;
            console.log(`NGA AI Summary: Fetching ${url}`);
            
            fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const decoder = new TextDecoder('gbk');
                const text = decoder.decode(buffer);
                resolve(text);
            })
            .catch(reject);
        });
    }

    function parsePage(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const posts = [];
        
        let uidMap = {};
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
            const content = script.textContent;
            if (content.includes('commonui.userInfo.setAll')) {
                // 尝试更稳健地提取 JSON
                try {
                    const startToken = 'commonui.userInfo.setAll(';
                    const startIndex = content.indexOf(startToken);
                    if (startIndex !== -1) {
                        let jsonStr = content.substring(startIndex + startToken.length).trim();
                        
                        // 使用括号计数法提取 JSON，避免 lastIndexOf 包含后续代码
                        let braceCount = 0;
                        let inString = false;
                        let escape = false;
                        let endIndex = -1;

                        if (jsonStr.startsWith('{')) {
                            for (let i = 0; i < jsonStr.length; i++) {
                                const char = jsonStr[i];
                                if (escape) { escape = false; continue; }
                                if (char === '\\') { escape = true; continue; }
                                if (char === '"') { inString = !inString; continue; }
                                
                                if (!inString) {
                                    if (char === '{') {
                                        braceCount++;
                                    } else if (char === '}') {
                                        braceCount--;
                                        if (braceCount === 0) {
                                            endIndex = i;
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        if (endIndex !== -1) {
                            jsonStr = jsonStr.substring(0, endIndex + 1);
                            const userData = JSON.parse(jsonStr);
                            for (const uid in userData) {
                                if (userData[uid].username) {
                                    uidMap[uid] = userData[uid].username;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.warn("NGA AI Summary: JSON解析用户信息失败，尝试正则回退", e);
                    // 正则回退
                    const match = content.match(/commonui\.userInfo\.setAll\s*\(\s*({[\s\S]*?})\s*\)/);
                    if (match) {
                        const userBlocks = match[1].match(/"-?\d+":\{.*?\}/g);
                        if (userBlocks) {
                            userBlocks.forEach(block => {
                                const uidMatch = block.match(/"(-?\d+)":/);
                                const nameMatch = block.match(/"username":"(.*?)"/);
                                if (uidMatch && nameMatch) {
                                    uidMap[uidMatch[1]] = nameMatch[1];
                                }
                            });
                        }
                    }
                }
            }
        });

        const rows = doc.querySelectorAll('tr[id^="post1strow"]');
        rows.forEach(row => {
            try {
                const floorMatch = row.id.match(/post1strow(\d+)/);
                const floor = floorMatch ? floorMatch[1] : "?";

                const contentDiv = row.querySelector('span[id^="postcontent"]');
                if (!contentDiv) return;

                const clone = contentDiv.cloneNode(true);
                
                // 移除引用 (HTML)
                const quotes = clone.querySelectorAll('.quote, blockquote');
                quotes.forEach(q => q.remove());
                
                let text = clone.innerText.trim();
                
                // 移除 UBB 引用
                text = text.replace(/\[quote\].*?\[\/quote\]/gs, '');
                text = text.replace(/\[b\]Reply to.*?\[\/b\]/gs, '');
                
                let username = "未知用户";
                
                // 1. 尝试从 DOM 获取 (.author)
                const authorElem = row.querySelector('.author');
                if (authorElem) {
                    const name = authorElem.innerText.trim();
                    if (name) username = name;
                }

                // 2. 尝试从 Script 获取 UID 并查表 (更准确，覆盖匿名)
                let table = row.closest('table');
                let nextScript = table ? table.nextElementSibling : null;
                if (nextScript && nextScript.tagName === 'SCRIPT') {
                    const uidMatch = nextScript.textContent.match(/null,'(-?\d+)',\d+/);
                    if (uidMatch) {
                        const rawUid = uidMatch[1];
                        if (uidMap[rawUid]) {
                            username = uidMap[rawUid];
                        }
                        
                        // 处理匿名
                        if (username.startsWith('#anony_')) {
                            username = `匿名(${username.replace('#anony_', '').substring(0, 6)})`;
                        }
                    }
                }
                
                // 获取时间
                let time = "未知时间";
                if (table) {
                    const dateSpan = table.querySelector("span[id^='postdate']");
                    if (dateSpan) {
                        time = dateSpan.innerText.trim();
                    }
                }

                if (text.length > 0) {
                    posts.push({ floor, uid: username, content: text, time: time });
                }
            } catch (e) { console.error("解析楼层失败", e); }
        });

        return posts;
    }

    function exportToExcel(posts) {
        // 添加 BOM 以便 Excel 正确识别 UTF-8
        let csvContent = "\uFEFF";
        csvContent += "楼层,时间,用户名,内容\n";

        posts.forEach(p => {
            let content = p.content.replace(/"/g, '""'); // 转义双引号
            // 移除换行符或将其替换为空格，以免破坏 CSV 结构，或者保留但必须在引号内
            // 这里选择保留换行符，因为 Excel 支持引号内的换行
            content = `"${content}"`;
            
            let time = p.time || "未知时间";
            let username = p.uid || "未知用户";
            let floor = p.floor || "?";
            
            // 处理用户名中的逗号
            if (username.includes(',')) username = `"${username}"`;
            
            csvContent += `${floor},${time},${username},${content}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        const tid = getUrlParam('tid');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        link.setAttribute("download", `nga_tid_${tid}_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function buildPrompt(posts, mode = 'normal') {
        let postContent = "";
        posts.forEach(p => {
            const cleanContent = p.content.length > 200 ? p.content.substring(0, 200) + "..." : p.content;
            postContent += `[${p.floor}楼 ${p.uid}]: ${cleanContent}\n`;
        });

        let template;
        if (mode === 'melon') {
            template = CONFIG.melonPromptTemplate || "你是一个专业的吃瓜群众和逻辑清晰的吃瓜总结员。请阅读以下帖子内容（包含楼层和用户名），梳理出事件的起因、经过和结果。重点关注：\n1. 楼主的核心观点或遭遇。\n2. 主要的争议点是什么？\n3. 关键的“神回复”或反转楼层。\n4. 网友们的主要阵营和观点分布。\n请用幽默风趣但逻辑严密的语言输出一份“吃瓜日报”。\n\n{{content}}";
        } else {
            template = CONFIG.promptTemplate || "以下记录了一个帖子中每一楼层的全部发言，按用户名区分、分析每个发言者表达的意见。总结、归类合并相似意见，给出一份报告内容为帖子内每种意见的人数和占比，并对整个帖子的整体讨论内容做出符合正常价值观的合理评论：\n\n{{content}}";
        }
        
        if (template.includes('{{content}}')) {
            return template.replace('{{content}}', postContent);
        } else {
            return template + "\n\n" + postContent;
        }
    }

    async function callLLM(prompt, onChunk) {
        // 1. 尝试使用原生 Fetch API (支持更好的流式处理)
        try {
            console.log("[LLM Debug] Attempting Fetch API...");
            const response = await fetch(CONFIG.apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.model,
                    temperature: Number(CONFIG.temperature),
                    messages: [
                        { role: "system", content: "你是一个乐于助人的论坛助手，擅长总结长帖子的讨论内容。请使用 Markdown 格式输出。" },
                        { role: "user", content: prompt }
                    ],
                    stream: true
                })
            });

            if (response.ok) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // 保留最后一行可能不完整的内容
                    
                    for (let line of lines) {
                        line = line.trim();
                        if (line.startsWith('data: ')) {
                            const dataStr = line.substring(6);
                            if (dataStr === '[DONE]') continue;
                            try {
                                const data = JSON.parse(dataStr);
                                const delta = data.choices[0].delta;
                                
                                const thinking = delta.reasoning_content || delta.reasoning;
                                if (CONFIG.thinkingMode && thinking) onChunk(null, thinking);
                                
                                if (delta.content) onChunk(delta.content, null);
                            } catch (e) { }
                        }
                    }
                }
                console.log("[LLM Debug] Fetch API completed.");
                return;
            } else {
                console.warn(`[LLM Debug] Fetch API returned status ${response.status}. Falling back to GM_xmlhttpRequest.`);
            }
        } catch (e) {
            console.warn("[LLM Debug] Fetch API failed (likely CORS). Falling back to GM_xmlhttpRequest.", e);
        }

        // 2. Fallback: 使用 GM_xmlhttpRequest (兼容性更好，但流式支持可能受限)
        return new Promise((resolve, reject) => {
            let lastIndex = 0;
            console.log("[LLM Debug] Starting GM_xmlhttpRequest...");
            
            const handleResponse = (response) => {
                if (response.readyState === 3 || response.readyState === 4) {
                    if (response.responseText) {
                        const newText = response.responseText.substring(lastIndex);
                        const lastNewlineIndex = newText.lastIndexOf('\n');
                        
                        if (lastNewlineIndex !== -1) {
                            const chunkToProcess = newText.substring(0, lastNewlineIndex);
                            lastIndex += (lastNewlineIndex + 1);
                            
                            const lines = chunkToProcess.split('\n');
                            for (let line of lines) {
                                line = line.trim();
                                if (line.startsWith('data: ')) {
                                    const dataStr = line.substring(6);
                                    if (dataStr === '[DONE]') continue;
                                    try {
                                        const data = JSON.parse(dataStr);
                                        const delta = data.choices[0].delta;
                                        
                                        const thinking = delta.reasoning_content || delta.reasoning;
                                        if (CONFIG.thinkingMode && thinking) onChunk(null, thinking);
                                        
                                        if (delta.content) onChunk(delta.content, null);
                                    } catch (e) { }
                                }
                            }
                        }
                    }
                }
                
                if (response.readyState === 4) {
                    console.log("[LLM Debug] GM_xmlhttpRequest finished");
                    // 处理剩余内容
                    if (response.responseText && response.responseText.length > lastIndex) {
                         const remainingText = response.responseText.substring(lastIndex);
                         const lines = remainingText.split('\n');
                         for (let line of lines) {
                            line = line.trim();
                            if (line.startsWith('data: ')) {
                                const dataStr = line.substring(6);
                                if (dataStr === '[DONE]') continue;
                                try {
                                    const data = JSON.parse(dataStr);
                                    const delta = data.choices[0].delta;
                                    const thinking = delta.reasoning_content || delta.reasoning;
                                    if (CONFIG.thinkingMode && thinking) onChunk(null, thinking);
                                    if (delta.content) onChunk(delta.content, null);
                                } catch (e) { }
                            }
                         }
                    }

                    if (response.status === 200) {
                        resolve();
                    } else {
                        // 非流式回退尝试
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.choices && data.choices[0].message) {
                                onChunk(data.choices[0].message.content, null);
                                resolve();
                            }
                        } catch(e) {
                            if (lastIndex > 0) resolve();
                            else reject(new Error(`API Error: ${response.status}`));
                        }
                    }
                }
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: CONFIG.apiEndpoint,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${CONFIG.apiKey}`
                },
                data: JSON.stringify({
                    model: CONFIG.model,
                    temperature: Number(CONFIG.temperature),
                    messages: [
                        { role: "system", content: "你是一个乐于助人的论坛助手，擅长总结长帖子的讨论内容。请使用 Markdown 格式输出。" },
                        { role: "user", content: prompt }
                    ],
                    stream: true
                }),
                onreadystatechange: handleResponse,
                onprogress: handleResponse,
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    // --- 模态框 UI ---
    function showModal() {
        let modal = document.getElementById('nga-ai-modal');
        if (modal) {
            modal.style.display = 'block';
            // 重置状态
            updateStatus("准备中...");
            updateProgress(0);
            document.getElementById('nga-ai-content').innerHTML = '';
            const thinkingDiv = document.getElementById('nga-ai-thinking');
            if (thinkingDiv) {
                thinkingDiv.innerHTML = '';
                thinkingDiv.style.display = 'none';
            }
            return;
        }

        modal = document.createElement('div');
        modal.id = 'nga-ai-modal';
        // 增加 box-sizing, max-width, 调整 flex 布局
        modal.style.cssText = 'position: fixed; top: 10%; left: 50%; transform: translateX(-50%); width: 700px; max-width: 90%; background: white; border: 1px solid #ccc; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 9999; padding: 20px; border-radius: 8px; font-family: sans-serif; display: flex; flex-direction: column; max-height: 80vh; box-sizing: border-box;';
        
        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; flex-shrink: 0;">
                <h3 style="margin: 0; color: #333;">AI 总结报告</h3>
                <button id="nga-ai-close" style="padding: 5px 10px; cursor: pointer; background: transparent; border: 1px solid #ccc; border-radius: 4px;">关闭</button>
            </div>
            
            <div id="nga-ai-status" style="color: #666; margin-bottom: 5px; font-size: 14px; flex-shrink: 0;">准备中...</div>
            
            <div style="width: 100%; background-color: #f0f0f0; border-radius: 4px; height: 8px; margin-bottom: 15px; overflow: hidden; flex-shrink: 0;">
                <div id="nga-ai-progress-fill" style="width: 0%; height: 100%; background-color: #4CAF50; transition: width 0.3s ease;"></div>
            </div>

            <div id="nga-ai-result-container" style="flex: 1; overflow-y: auto; border: 1px solid #eee; padding: 15px; background: #f9f9f9; border-radius: 4px; line-height: 1.6; font-size: 14px; word-wrap: break-word; min-height: 0;">
                <div id="nga-ai-thinking" style="display: none; margin-bottom: 15px; padding: 10px; background: #f0f0f0; border-left: 4px solid #999; color: #666; font-size: 12px; white-space: pre-wrap;"></div>
                <div id="nga-ai-content"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('nga-ai-close').onclick = () => modal.style.display = 'none';
    }

    function updateStatus(text) {
        const el = document.getElementById('nga-ai-status');
        if (el) el.textContent = text;
    }

    function updateProgress(percent) {
        const el = document.getElementById('nga-ai-progress-fill');
        if (el) el.style.width = `${percent}%`;
    }

    function showResult(html) {
        updateStatus("分析完成");
        updateProgress(100);
        const el = document.getElementById('nga-ai-content');
        if (el) el.innerHTML = html;
    }

    // 延迟启动，等待页面加载
    setTimeout(initUI, 1000);

})();
