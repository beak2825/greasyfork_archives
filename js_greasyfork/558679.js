// ==UserScript==
// @name         AIDP 基础检测（Receive版）
// @namespace    http://tampermonkey.net/
// @version      20251213
// @description  通过调用 Receive 接口对 Chrome MCP 标注轨迹进行数据驱动的自动检查（干预正文、英文、MCP数量、截图链路等），在页面右下角生成可拖拽工具入口与美观面板
// @author       You
// @match        https://aidp-lite.bytedance.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bytedance.net
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558679/AIDP%20%E5%9F%BA%E7%A1%80%E6%A3%80%E6%B5%8B%EF%BC%88Receive%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558679/AIDP%20%E5%9F%BA%E7%A1%80%E6%A3%80%E6%B5%8B%EF%BC%88Receive%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const ACTION_KEYWORDS = ['调整','修改','优化','修复','增加','删除','对齐','布局','样式','颜色','按钮','交互','测试','验证'];
    const LANGUAGE_KEYWORDS = ['你','我我','用户'];
    let lastReportText = '';
    let panelEl = null;
    let btnEl = null;
    let refreshBtnEl = null;
    let isLoading = false;
    let currentData = null;
    let latestReceiveData = null;
    let capturedMsToken = '';
    let capturedABogus = '';
    let capturedPayload = '';
    let stepToElementMap = {}; // Step编号到页面元素的映射
    let renderVersionData = null; // get_render_version接口数据

    function normalizeText(text) {
        return (text || '').replace(/\s+/g, ' ').trim();
    }

    function hasChinese(text) {
        return /[\u4e00-\u9fa5]/.test(text || '');
    }

    function hasEnglishLetter(text) {
        return /[A-Za-z]/.test(text || '');
    }

    function escapeHtml(str) {
        return (str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Step链接生成函数 - 添加定位和修改图标（使用线性图标）
    function linkStep(stepNum, showIcons = false) {
        const iconMapPin = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
        const iconEdit = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';

        let html = `<span style="display:inline-flex;align-items:center;gap:6px">`;
        html += `<a href="javascript:void(0)" class="neeko-step-link" data-step="${stepNum}" style="color:#1677ff;text-decoration:none;cursor:pointer;font-weight:600;font-size:13px">Step ${stepNum}</a>`;
        if (showIcons) {
            html += `<span class="neeko-step-icon" data-action="locate" data-step="${stepNum}" style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:5px;background:#e0f2fe;color:#0369a1;cursor:pointer;transition:all 0.2s ease;border:1px solid #bae6fd" title="定位到Step">${iconMapPin}</span>`;
            html += `<span class="neeko-step-icon" data-action="edit" data-step="${stepNum}" style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:5px;background:#fef3c7;color:#d97706;cursor:pointer;transition:all 0.2s ease;border:1px solid #fde68a" title="修改思考过程">${iconEdit}</span>`;
        }
        html += `</span>`;
        return html;
    }

    // 点击修改按钮，定位到Step并点击修改思考过程按钮
    function clickEditStep(stepNum, buttonType = 'modify') {
        buildStepElementMap(); // 确保映射是最新的

        // 新增：先关闭所有已打开的编辑框 (全局搜索取消按钮)
        let closedCount = 0;

        // 1. 查找所有可能是“取消”的按钮
        const allButtons = Array.from(document.querySelectorAll('button, [role="button"], div, span'));
        const cancelButtons = allButtons.filter(el => {
            // 必须可见
            if (el.offsetParent === null) return false;
            // 文本必须包含“取消”
            const text = (el.textContent || '').trim();
            if (text !== '取消') return false;

            // 进一步验证是否像按钮
            const style = window.getComputedStyle(el);
            const isPointer = style.cursor === 'pointer';
            const hasBtnClass = (el.className || '').includes('btn');
            const isTagBtn = el.tagName === 'BUTTON';

            return isTagBtn || hasBtnClass || isPointer;
        });

        cancelButtons.forEach(btn => {
            try {
                btn.click();
                closedCount++;
            } catch (_) {}
        });

        if (closedCount > 0) {
            showToast(`已自动取消 ${closedCount} 个未保存的编辑状态`);
        }

        // 如果有关闭操作，延迟一下再执行打开操作，等待UI刷新
        const delay = closedCount > 0 ? 800 : 0;

        setTimeout(() => {
            scrollToStep(stepNum);
            setTimeout(() => {
                // 查找对应Step的修改思考过程按钮
                const stepElement = stepToElementMap[stepNum];
                if (stepElement) {
                    // 1. 尝试通过文本查找 "修改思考过程" (modify) 或 "重新生成" (regenerate)
                    // 遍历所有元素，找到包含该文本的最小元素（通常是span或div）
                    const allElements = stepElement.querySelectorAll('*');
                    let targetBtn = null;

                    const targetText = buttonType === 'regenerate' ? '重新生成' : '修改思考过程';

                    // 优先找明确的按钮或包含特定文本的元素
                    for (const el of allElements) {
                         // 跳过隐藏元素
                         if (el.offsetParent === null) continue;

                         const text = normalizeText(el.textContent || '');
                         if (text.includes(targetText) || (buttonType === 'modify' && (text.includes('修改') || (text.includes('思考') && text.includes('过程'))))) {
                             // 找到最内层的包含该文本的元素
                             // 向上查找是否是按钮或可点击元素
                             let current = el;
                             let isClickable = false;
                             // 向上查3层
                             for(let i=0; i<3; i++) {
                                 if (!current) break;
                                 const tag = current.tagName;
                                 const role = current.getAttribute('role');
                                 const cls = current.className || '';
                                 const style = window.getComputedStyle(current);

                                 if (tag === 'BUTTON' || role === 'button' || (typeof cls === 'string' && cls.includes('btn')) || style.cursor === 'pointer') {
                                     targetBtn = current;
                                     isClickable = true;
                                     break;
                                 }
                                 current = current.parentElement;
                             }
                             if (isClickable) break;

                             // 如果没找到明显的点击特征，就默认是这个包含文本的元素
                             if (!targetBtn) targetBtn = el;
                         }
                    }

                    // 2. 如果没找到特定文本，尝试找第N个看起来像按钮的元素 (Fallback)
                    if (!targetBtn) {
                        // 假设按钮在底部，且是蓝色背景（根据截图）
                        // 这里尝试找第一个 button 标签或者 class 包含 btn 的元素
                        const potentialBtns = Array.from(stepElement.querySelectorAll('button, [class*="btn"], [role="button"]'))
                            .filter(btn => btn.offsetParent !== null);

                        // modify -> 第1个按钮 (index 0)
                        // regenerate -> 第3个按钮 (index 2)
                        const btnIndex = buttonType === 'regenerate' ? 2 : 0;
                        if (potentialBtns.length > btnIndex) {
                            targetBtn = potentialBtns[btnIndex];
                        } else if (potentialBtns.length > 0) {
                            // 如果不够，默认点第一个
                            targetBtn = potentialBtns[0];
                        }
                    }

                    if (targetBtn) {
                        targetBtn.click();
                        const actionName = buttonType === 'regenerate' ? '重新生成' : '修改面板';
                        showToast(`已定位到 Step ${stepNum} 并打开${actionName}`);
                    } else {
                        showToast(`已定位到 Step ${stepNum}，但未找到${buttonType === 'regenerate' ? '重新生成' : '修改'}按钮`);
                    }
                } else {
                    showToast(`未找到 Step ${stepNum} 的页面元素`);
                }
            }, 800);
        }, delay);
    }

    // 定位到Step元素
    function scrollToStep(stepNum) {
        // 先尝试点击左侧菜单
        const menuKey = 'Step' + stepNum;
        const menuContainer = document.querySelector('.neeko-container.menu_container');
        if (menuContainer) {
            const buttons = menuContainer.querySelectorAll('span.neeko-text.agent-step-view-button');
            for (const btn of buttons) {
                const txt = normalizeText(btn.textContent || '');
                if (txt === menuKey) {
                    btn.click();
                    break;
                }
            }
        }

        // 然后滚动到对应元素
        const element = stepToElementMap[stepNum];
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // 高亮显示
                const originalBg = element.style.backgroundColor;
                element.style.backgroundColor = '#fff3cd';
                element.style.transition = 'background-color 0.3s';
                setTimeout(() => {
                    element.style.backgroundColor = originalBg || '';
                }, 2000);
            }, 300);
        }
    }

    // 建立Step到页面元素的映射
    function buildStepElementMap() {
        stepToElementMap = {};
        // 策略：通过 StepX 类名定位 Card
        // HTML结构: Card > HeaderWrapper(class="neeko-container StepX")
        const elements = document.querySelectorAll('.neeko-container[class*="Step"]');
        elements.forEach(el => {
            const match = el.className.match(/Step(\d+)/);
            if (match) {
                const stepNum = parseInt(match[1], 10);
                // 向上查找 Card 容器 (具有 border 样式的 neeko-container)
                let current = el.parentElement;
                while (current) {
                    if (current.classList.contains('neeko-container')) {
                         const style = current.style;
                         // 检查是否有边框，通常 Card 会有边框
                         if (style.borderWidth === '1px' || style.borderStyle === 'solid') {
                             stepToElementMap[stepNum] = current;
                             break;
                         }
                    }
                    current = current.parentElement;
                    // 限制查找深度，避免向上查找到顶层
                    if (!current || current.tagName === 'BODY' || current.classList.contains('agent-step-container')) {
                         // 如果没找到边框容器，但找到了 agent-step-container 的直接子元素，那可能就是它
                         if (current && current.classList.contains('agent-step-container')) {
                             // 回退到上一个节点 (即 agent-step-container 的子节点)
                             // 但我们在 while 循环里，current 已经是 parent 了
                             // 实际上，如果 header 的 parent 就是 card，那么第一次循环就应该命中了
                             // 如果 header 被包了一层，可能需要多几层
                             // 这里做一个 fallback: 如果 header 的 parent 是 neeko-container 且 display block，可能就是它
                         }
                         break;
                    }
                }

                // 如果上面没找到，尝试直接用 parent (兼容旧结构)
                if (!stepToElementMap[stepNum] && el.parentElement) {
                    stepToElementMap[stepNum] = el.parentElement;
                }
            }
        });

        // 如果映射为空，尝试旧逻辑
        if (Object.keys(stepToElementMap).length === 0) {
            const stepCards = document.querySelectorAll('.neeko-container .agent-step-container > div > div, .neeko-container[style*="background-color: rgb(255, 255, 255)"]');
            stepCards.forEach(card => {
                const spans = card.querySelectorAll('span.neeko-text');
                for (const span of spans) {
                    const txt = normalizeText(span.textContent || '');
                    const match = txt.match(/^Step\s*(\d+)/i);
                    if (match) {
                        const stepNum = parseInt(match[1], 10);
                        stepToElementMap[stepNum] = card;
                        break;
                    }
                }
            });
        }
    }

    function safeParseJSON(str) {
        if (typeof str !== 'string') return null;
        try { return JSON.parse(str); } catch (_) { return null; }
    }

    function deepGet(obj, pathArr, defaultValue) {
        let cur = obj;
        for (const k of pathArr) {
            if (!cur || typeof cur !== 'object') return defaultValue;
            cur = cur[k];
        }
        return cur == null ? defaultValue : cur;
    }

    function cleanPrompt(s) {
        if (!s) return '';
        let t = String(s);
        t = t.replace(/\\u003csystem-reminder\\u003e[\s\S]*$/i, '');
        t = t.replace(/<system-reminder>[\s\S]*$/i, '');
        return t.trim();
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : '';
    }

    function getParams() {
        const sp = new URLSearchParams(location.search || '');
        const storedMs = localStorage.getItem('neeko_msToken') || '';
        const storedAB = localStorage.getItem('neeko_aBogus') || '';
        const fromQS_ms = sp.get('msToken') || '';
        const fromQS_ab = sp.get('a_bogus') || '';
        const fromCookie_ms = getCookie('msToken') || '';
        const fromWin_ms = typeof window.msToken === 'string' ? window.msToken : '';
        const fromWin_ab = typeof window.a_bogus === 'string' ? window.a_bogus : '';
        const msToken = capturedMsToken || storedMs || fromQS_ms || fromCookie_ms || fromWin_ms || '';
        const aBogus = capturedABogus || storedAB || fromQS_ab || fromWin_ab || '';
        return { msToken, aBogus };
    }

    function hookNetworkCapture() {
        try {
            const origFetch = window.fetch;
            window.fetch = function(...args) {
                let capture = false;
                try {
                    const req = args[0];
                    const url = typeof req === 'string' ? req : (req && req.url) || '';
                    if (url && url.includes('/api/dispatch/Receive')) {
                        capture = true;
                        const u = new URL(url, location.origin);
                        const msToken = u.searchParams.get('msToken');
                        const aBogus = u.searchParams.get('a_bogus');
                        if (msToken) { localStorage.setItem('neeko_msToken', msToken); capturedMsToken = msToken; }
                        if (aBogus) { localStorage.setItem('neeko_aBogus', aBogus); capturedABogus = aBogus; }
                        try {
                            if (req instanceof Request) {
                                req.clone().text().then(t => { capturedPayload = t || ''; localStorage.setItem('neeko_receive_payload', capturedPayload); }).catch(() => {});
                            } else if (args[1] && args[1].body !== undefined) {
                                const b = args[1].body;
                                let t = '';
                                if (typeof b === 'string') t = b;
                                else if (b && typeof b === 'object') { try { t = JSON.stringify(b); } catch (_) {} }
                                capturedPayload = t || '';
                                localStorage.setItem('neeko_receive_payload', capturedPayload);
                            }
                        } catch (_) {}
                    }
                } catch (_) {}
                const p = origFetch.apply(this, args);
                if (capture) {
                    return p.then(resp => {
                        try {
                            const clone = resp.clone();
                            clone.json().then(json => {
                                latestReceiveData = json;
                                try { localStorage.setItem('neeko_latest_receive', JSON.stringify(json)); } catch (_) {}
                            }).catch(() => {});
                        } catch (_) {}
                        return resp;
                    });
                }
                return p;
            };
        } catch (_) {}
        try {
            const OrigXHR = window.XMLHttpRequest;
            const open = OrigXHR.prototype.open;
            const send = OrigXHR.prototype.send;
            OrigXHR.prototype.open = function(method, url, ...rest) {
                try {
                    if (typeof url === 'string' && url.includes('/api/dispatch/Receive')) {
                        const u = new URL(url, location.origin);
                        const msToken = u.searchParams.get('msToken');
                        const aBogus = u.searchParams.get('a_bogus');
                        if (msToken) { localStorage.setItem('neeko_msToken', msToken); capturedMsToken = msToken; }
                        if (aBogus) { localStorage.setItem('neeko_aBogus', aBogus); capturedABogus = aBogus; }
                        this.__neeko_is_receive = true;
                        this.addEventListener('load', () => {
                            try {
                                const txt = this.responseText;
                                const json = JSON.parse(txt);
                                latestReceiveData = json;
                                try { localStorage.setItem('neeko_latest_receive', txt); } catch (_) {}
                            } catch (_) {}
                        });
                    } else {
                        this.__neeko_is_receive = false;
                    }
                } catch (_) {}
                return open.call(this, method, url, ...rest);
            };
            OrigXHR.prototype.send = function(data) {
                try {
                    if (this.__neeko_is_receive) {
                        let t = '';
                        if (typeof data === 'string') t = data;
                        else if (data && typeof data === 'object') { try { t = JSON.stringify(data); } catch (_) {} }
                        capturedPayload = t || '';
                        localStorage.setItem('neeko_receive_payload', capturedPayload);
                    }
                } catch (_) {}
                return send.call(this, data);
            };
        } catch (_) {}
    }

    async function fetchReceive(opts = {}) {
        const refresh = !!opts.refresh;
        if (!refresh) {
            if (latestReceiveData) return latestReceiveData;
            try {
                const cached = localStorage.getItem('neeko_latest_receive');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    latestReceiveData = parsed;
                    return parsed;
                }
            } catch (_) {}
        }
        const { msToken, aBogus } = getParams();
        let url = '/api/dispatch/Receive?';
        const qs = [];
        qs.push('msToken=' + encodeURIComponent(msToken || ''));
        if (aBogus) qs.push('a_bogus=' + encodeURIComponent(aBogus));
        url += qs.join('&');
        let bodyText = capturedPayload || '';
        if (!bodyText) {
            try { bodyText = localStorage.getItem('neeko_receive_payload') || ''; } catch (_) {}
        }
        const requestOpts = bodyText
            ? { method: 'POST', credentials: 'include', headers: { 'accept': 'application/json', 'content-type': 'application/json' }, body: bodyText }
            : { method: 'GET', credentials: 'include', headers: { 'accept': 'application/json' } };
        const resp = await fetch(url, requestOpts);
        const data = await resp.json();
        latestReceiveData = data;
        try { localStorage.setItem('neeko_latest_receive', JSON.stringify(data)); } catch (_) {}
        return data;
    }

    // 获取get_render_version接口数据
    async function fetchRenderVersion() {
        if (renderVersionData) return renderVersionData;
        try {
            const cached = localStorage.getItem('neeko_render_version');
            if (cached) {
                renderVersionData = JSON.parse(cached);
                return renderVersionData;
            }
        } catch (_) {}
        try {
            const { msToken, aBogus } = getParams();
            let url = '/api/neeko/api/template/get_render_version?';
            const qs = [];
            qs.push('msToken=' + encodeURIComponent(msToken || ''));
            if (aBogus) qs.push('a_bogus=' + encodeURIComponent(aBogus));
            url += qs.join('&');
            const resp = await fetch(url, { method: 'GET', credentials: 'include', headers: { 'accept': 'application/json' } });
            const data = await resp.json();
            renderVersionData = data;
            try { localStorage.setItem('neeko_render_version', JSON.stringify(data)); } catch (_) {}
            return data;
        } catch (err) {
            console.warn('获取render_version失败:', err);
            return null;
        }
    }

    // 新增：核心解析逻辑，提取 agent_steps 和 model_hints
    function parseReceiveData(receiveJson) {
        const items = Array.isArray(receiveJson?.Items) ? receiveJson.Items : [];
        const first = items[0] || {};

        // TempAnswer.Content 在不同环境下可能是「字符串 JSON」或者已经解析好的对象，这里两种情况都兼容
        const rawContent = first?.TempAnswer?.Content;
        let contentObj = {};
        if (typeof rawContent === 'string') {
            contentObj = safeParseJSON(rawContent) || {};
        } else if (rawContent && typeof rawContent === 'object') {
            contentObj = rawContent;
        }

        const coreData = contentObj.data || {};
        const itemMeta = contentObj.item || {};

        // 修复prompt显示：从item.problem_statement中提取\n\n\n<system-reminder>前面的部分
        const rawProblemStatement = itemMeta.problem_statement || coreData.prompt || coreData.problem_statement || '';
        let problemStatement = rawProblemStatement;
        // 提取\n\n\n<system-reminder>前面的部分
        const systemReminderIndex = rawProblemStatement.indexOf('\n\n\n<system-reminder>');
        if (systemReminderIndex !== -1) {
            problemStatement = rawProblemStatement.substring(0, systemReminderIndex).trim();
        } else {
            // 如果没有找到，尝试查找<system-reminder>
            const altIndex = rawProblemStatement.indexOf('<system-reminder>');
            if (altIndex !== -1) {
                problemStatement = rawProblemStatement.substring(0, altIndex).trim();
            }
        }
        problemStatement = cleanPrompt(problemStatement);

        return {
            // 核心 step 数据
            agent_steps: Array.isArray(coreData.agent_steps) ? coreData.agent_steps : [],
            model_hints: Array.isArray(coreData.model_hints) ? coreData.model_hints : [],

            // 题目基础信息
            problem_statement: problemStatement || '-',
            taskId: first?.Item?.TaskID || '-',
            itemId: first?.Item?.ItemID || '-',
            conversationId: coreData.conversation_id || coreData.conversationId || '-'
        };
    }

    // 基础检查：干预、英文、MCP数量、多段
    function computeFoundationChecks(parsedData) {
        const { agent_steps, model_hints } = parsedData;
        const interventions = [];
        const englishFindings = [];
        const multiParagraphIssues = []; // 移到基础检查
        let mcpCount = 0;

        // 构造 step map 方便查找
        const stepMap = {};
        agent_steps.forEach(s => {
            if (s && s.step) stepMap[s.step] = s;
        });

        // 1. 干预检查 (Model Hints)
        // model_hints[0] 对应 step 1
        model_hints.forEach((hint, idx) => {
            if (!hint) return; // hint 为空字符串则不算干预
            const stepNum = idx + 1;
            const stepObj = stepMap[stepNum];
            const content = stepObj?.data?.content || '';
            const hasBody = !!normalizeText(content);
            interventions.push({
                step: stepNum,
                hintFull: hint,
                hintSnippet: hint.slice(0, 20) + (hint.length > 20 ? '...' : ''),
                hasBody: hasBody,
                pass: hasBody // 有干预必须有正文
            });
        });

        // 2. 英文与 MCP 统计 与 多段检测
        agent_steps.forEach(s => {
            const d = s.data || {};
            const stepNum = s.step;
            const content = normalizeText(d.content);
            const reasoning = normalizeText(d.reasoning_content);

            // 英文检测
            const bodyEng = hasEnglishLetter(content) && !hasChinese(content);
            const thinkEng = hasEnglishLetter(reasoning) && !hasChinese(reasoning);
            if (bodyEng || thinkEng) {
                englishFindings.push({ step: stepNum, body: bodyEng, thinking: thinkEng });
            }

            // 多段描述：检查content中的换行数，>2段显示
            const rawContent = d.content || '';
            const lineBreaks = (rawContent.match(/\n/g) || []).length;
            const paragraphs = rawContent.split('\n').filter(l => l.trim()).length;
            if (paragraphs > 2) {
                multiParagraphIssues.push({ step: stepNum, lines: paragraphs, lineBreaks, content: content });
            }

            // MCP 调用统计：只统计 _functionName 中包含 “Chrome-MCP” 的工具调用
            const tools = Array.isArray(d.tool_calls) ? d.tool_calls : [];
            tools.forEach(t => {
                const names = Array.isArray(t._functionName) ? t._functionName : [];
                const isChromeMcp = names.some(name =>
                    String(name || '').toLowerCase().includes('chrome-mcp')
                );
                if (isChromeMcp) {
                    mcpCount += 1;
                }
            });
        });

        return { interventions, englishFindings, mcpCount, multiParagraphIssues };
    }

    // 辅助检查：Error、截图链路、语言
    function computeAuxChecks(parsedData) {
        const { agent_steps } = parsedData;
        const errorSteps = [];
        const screenshotChains = [];
        const languageIssues = [];

        // 排序 steps
        const sortedSteps = [...agent_steps].sort((a, b) => a.step - b.step);

        sortedSteps.forEach((s, idx) => {
            const d = s.data || {};
            const stepNum = s.step;

            // 1. Error 检测：检查function_result.content中是否有error
            const toolCalls = Array.isArray(d.tool_calls) ? d.tool_calls : [];
            toolCalls.forEach(t => {
                const resultContent = t?.function_result?.content || '';
                if (resultContent && /error/i.test(resultContent)) {
                    const normalized = normalizeText(resultContent);
                    const snippet = normalized.slice(0, 60);
                    errorSteps.push({ step: stepNum, snippet, fullContent: normalized, toolName: t?.function?.name || 'Unknown' });
                }
            });

                // 2. 语言检测
            const bodyHits = LANGUAGE_KEYWORDS.filter(k => (d.content || '').includes(k));
            const thinkHits = LANGUAGE_KEYWORDS.filter(k => (d.reasoning_content || '').includes(k));
            if (bodyHits.length > 0 || thinkHits.length > 0) {
                languageIssues.push({ step: stepNum, bodyHits, thinkingHits: thinkHits });
            }

            // 3. 截图链路 (原逻辑保持不变)
            const tools = Array.isArray(d.tool_calls) ? d.tool_calls : [];
            const hasScreenshot = tools.some(t => {
                const name = t?.function?.name || '';
                return name.toLowerCase().includes('take_screenshot');
            });

            if (hasScreenshot) {
                const nextStep = sortedSteps[idx + 1];
                const curContent = normalizeText(d.content);
                const curHasBody = !!curContent;
                const nextContent = nextStep ? normalizeText(nextStep.data?.content) : '';
                const nextHasBody = !!nextContent;
                const nextActionHits = ACTION_KEYWORDS.filter(k => nextContent.includes(k));

                screenshotChains.push({
                    step: stepNum,
                    nextStep: nextStep ? nextStep.step : null,
                    curHasBody,
                    curContent: curContent.slice(0, 100),
                    curFullContent: curContent,
                    nextHasBody,
                    nextContent: nextContent.slice(0, 100),
                    nextFullContent: nextContent,
                    nextActionHits
                });
            }
        });

        return { errorSteps, screenshotChains, languageIssues };
    }

    // 全局变量用于导出功能
    let parsedData = null;
    let foundation = null;
    let aux = null;
    let errorCount = 0;
    let warningCount = 0;

    function renderPanel(data) {
        parsedData = data;
        const { itemId, taskId, problemStatement, conversationId, agent_steps } = data;
        foundation = computeFoundationChecks(data);
        aux = computeAuxChecks(data);

        // 统计摘要
        const totalSteps = agent_steps.length;
        errorCount = foundation.interventions.filter(i => !i.pass).length +
                          foundation.englishFindings.length +
                          (foundation.mcpCount === 0 ? 1 : 0) +
                          foundation.multiParagraphIssues.length;
        warningCount = aux.errorSteps.length +
                            aux.screenshotChains.filter(p => {
                                const warns = [];
                                if (!p.curHasBody) warns.push('当前Step缺正文');
                                if (!p.nextStep) warns.push('无后续Step');
                                else {
                                    if (!p.nextHasBody) warns.push('后续Step缺正文');
                                    if (p.nextHasBody && p.nextActionHits.length === 0) warns.push('后续无行动关键词');
                                }
                                return warns.length > 0;
                            }).length +
                            aux.languageIssues.length;

        // 线性图标SVG定义（使用内联SVG）
        const iconSearch = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>';
        const iconSettings = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        const iconTools = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>';
        const iconWrench = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>';
        const iconFile = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
        const iconCheck = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        const iconMapPin = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
        const iconEdit = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
        const iconCopy = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        const iconRefresh = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>';
        const iconX = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        const iconList = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>';

        // 定义Footer HTML（提交与参考资料）
        const footerHtml = `
        <div style="margin-top:20px;padding-top:20px;border-top:2px solid #e5e7eb;background:linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);border-radius:12px;padding:16px;margin-bottom:20px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
                <span style="font-size:16px">ℹ️</span>
                <div style="font-weight:700;font-size:13px;color:#0f172a">提交与参考资料</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;font-size:12px;color:#475569;line-height:1.7">
                <div style="display:flex;align-items:start;gap:8px">
                    <span style="color:#1677ff;font-weight:700;flex-shrink:0">1）</span>
                    <span>完成上述检测与修改后，请在下方表单中提交代码链接与录屏：<a href="https://bytedance.larkoffice.com/share/base/form/shrcndtbhDSEuMQzWVPMaeFZEPb" target="_blank" style="color:#1677ff;text-decoration:none;font-weight:600;border-bottom:1px solid #1677ff;transition:all 0.2s">标注表单链接</a></span>
                </div>
                <div style="display:flex;align-items:start;gap:8px">
                    <span style="color:#1677ff;font-weight:700;flex-shrink:0">2）</span>
                    <span>如有任何优化建议或疑问，欢迎随时联系：<a href="https://www.larkoffice.com/invitation/page/add_contact/?token=a2bk2ffd-c7f1-4920-bdfa-c99e45a4ea29&unique_id=5Pt7tb7NhCe2TBKOKJlgrw==" target="_blank" style="color:#1677ff;text-decoration:none;font-weight:600;border-bottom:1px solid #1677ff">@韩旭</a></span>
                </div>
                <div style="display:flex;align-items:start;gap:8px">
                    <span style="color:#1677ff;font-weight:700;flex-shrink:0">3）</span>
                    <span>更多详细质检规则与项目背景，可以参考：<a href="https://bytedance.larkoffice.com/wiki/OIi0wYi6jix8GvkHc8mc5J4Vn6b?from=from_copylink" target="_blank" style="color:#1677ff;text-decoration:none;font-weight:600;border-bottom:1px solid #1677ff">Chrome MCP 项目交互式标注流程</a></span>
                </div>
                <div style="display:flex;align-items:start;gap:8px">
                    <span style="color:#1677ff;font-weight:700;flex-shrink:0">3）</span>
                    <span>更新插件，可以点击这里获取最新版本：<a href="https://update.greasyfork.org/scripts/558679/mcp%20%E5%9F%BA%E7%A1%80%E6%A3%80%E6%B5%8B%EF%BC%88Receive%E7%89%88%EF%BC%89.user.js" target="_blank" style="color:#1677ff;text-decoration:none;font-weight:600;border-bottom:1px solid #1677ff">安装脚本</a></span>
                </div>
                <div style="display:flex;align-items:start;gap:8px">
                    <span style="color:#1677ff;font-weight:700;flex-shrink:0">3）</span>
                    <span>代码完全开源，可以登陆Greasy Fork，获取源码。欢迎大家一起迭代。：<a href="https://greasyfork.org/zh-CN/scripts/558679" target="_blank" style="color:#1677ff;text-decoration:none;font-weight:600;border-bottom:1px solid #1677ff">源码库</a></span>
                </div>
                <div style="padding:10px;background:rgba(22,119,255,0.05);border-radius:8px;border-left:3px solid #1677ff;margin-top:4px">
                    <div style="display:flex;align-items:start;gap:8px">
                        <span style="color:#1677ff;font-weight:700;flex-shrink:0">💡</span>
                        <span style="color:#475569">双击右下角"MCP 基础检测"按钮可以快速关闭/打开本面板。本工具只做基础规则扫描，最终是否合格仍以你的专业判断为准。</span>
                    </div>
                </div>
            </div>
        </div>`;

        let html = '';
        html += '<div style="display:flex;flex-direction:column;gap:0;height:100%">';

        // 固定区域：基础信息（可折叠） + Tab按钮
        const iconChevronDown = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        const iconChevronUp = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';

        html += `<div style="position:sticky;top:0;z-index:20;background:#ffffff;border-bottom:1px solid #e5e7eb;padding:12px 20px;margin:0 -20px 0 -20px">`;
        
        // 基础信息：可折叠的自查清单（去掉了Prompt）
        html += `<div id="neeko-base-info-container" style="margin-bottom:12px">`;

        // 自查清单 - 可折叠
        html += `<div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">`;
        html += `<div id="neeko-checklist-toggle" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;cursor:pointer;transition:background 0.2s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#16a34a">${iconCheck}</span>`;
        html += `<div style="font-weight:600;color:#0f172a;font-size:13px">自查清单</div>`;
        html += `</div>`;
        html += `<span id="neeko-checklist-chevron" style="display:inline-flex;align-items:center;color:#94a3b8;transition:transform 0.2s ease">${iconChevronDown}</span>`;
        html += `</div>`;
        html += `<div id="neeko-checklist-content" style="display:none;padding:12px;background:#f8fafc;border-top:1px solid #e2e8f0;max-height:150px;overflow-y:auto">`;
        html += `<div style="display:flex;flex-direction:column;gap:8px;font-size:12px;color:#334155;line-height:1.5">`;
        html += `<div style="padding:8px;background:#f0f9ff;border-left:3px solid #1677ff;border-radius:6px">`;
        html += `<div style="font-weight:600;color:#0f172a;margin-bottom:3px;font-size:12px">1. 页面美观与交互检查</div>`;
        html += `<div style="color:#475569;font-size:11px">请自查页面是否美观，布局合理，并且不过度使用紫色。确保图片能够正常展示，核心链接可以跳转，按钮都有基本交互效果（hover、active、transition等）。</div>`;
        html += `</div>`;
        html += `<div style="padding:8px;background:#f0f9ff;border-left:3px solid #1677ff;border-radius:6px">`;
        html += `<div style="font-weight:600;color:#0f172a;margin-bottom:3px;font-size:12px">2. 轨迹连贯性检查</div>`;
        html += `<div style="color:#475569;font-size:11px">请自查并确保轨迹连贯，顺序合理。每个Step之间的逻辑关系清晰，操作步骤符合预期流程，没有跳跃或遗漏关键步骤。确保工具调用的顺序和结果判断符合实际需求。</div>`;
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;

        // Tab 按钮
        html += `<div style="display:flex;gap:4px;background:#f8fafc;padding:4px;border-radius:10px;border:1px solid #e5e7eb">`;
        html += `<button data-tab="base" class="neeko-tab-btn active" style="flex:1;padding:10px 16px;border-radius:8px;background:#1677ff;color:#fff;border:none;cursor:pointer;font-weight:600;font-size:13px;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;gap:6px">`;
        html += `<span style="display:inline-flex;align-items:center;width:16px;height:16px">${iconSearch}</span><span>基础检测</span>`;
        if (errorCount > 0) html += `<span style="background:rgba(255,255,255,0.25);border-radius:10px;padding:2px 6px;font-size:10px;font-weight:700">${errorCount}</span>`;
        html += `</button>`;
        html += `<button data-tab="assist" class="neeko-tab-btn" style="flex:1;padding:10px 16px;border-radius:8px;background:#ffffff;color:#475569;border:1px solid #e2e8f0;cursor:pointer;font-weight:600;font-size:13px;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;gap:6px">`;
        html += `<span style="display:inline-flex;align-items:center;width:16px;height:16px">${iconSettings}</span><span>辅助检测</span>`;
        if (warningCount > 0) html += `<span style="background:#fef3c7;color:#f59e0b;border-radius:10px;padding:2px 6px;font-size:10px;font-weight:700">${warningCount}</span>`;
        html += `</button>`;
        html += `<button data-tab="tools" class="neeko-tab-btn" style="flex:1;padding:10px 16px;border-radius:8px;background:#ffffff;color:#475569;border:1px solid #e2e8f0;cursor:pointer;font-weight:600;font-size:13px;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;gap:6px">`;
        html += `<span style="display:inline-flex;align-items:center;width:16px;height:16px">${iconTools}</span><span>标注工具</span>`;
        html += `</button>`;
        html += `<button data-tab="platform" class="neeko-tab-btn" style="flex:1;padding:10px 16px;border-radius:8px;background:#ffffff;color:#475569;border:1px solid #e2e8f0;cursor:pointer;font-weight:600;font-size:13px;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;gap:6px">`;
        html += `<span style="display:inline-flex;align-items:center;width:16px;height:16px">${iconWrench}</span><span>平台问题</span>`;
        html += `</button>`;
        html += `</div>`;
        html += `</div>`;

        // Tab内容区域 - 每个tab独立滚动
        html += `<div style="flex:1;overflow:hidden;display:flex;flex-direction:column">`;

        // Tab: 基础检测
        const iconAlertCircle = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        const iconGlobe = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
        const iconZap = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
        const iconAlertTriangle = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        const iconFileX = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="9"></line></svg>';
        const iconMessageSquare = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';

        html += `<div id="neeko-tab-base" class="neeko-tab" style="display:flex;flex-direction:column;flex:1;overflow-y:auto;overflow-x:hidden;margin-top:0;padding-right:4px">`;

        // 1. 干预 Step 检查
        html += `<div class="neeko-card" style="margin-bottom:16px;animation:neeko-slideIn 0.3s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconAlertCircle}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">干预 Step 正文检查</div>`;
        html += `</div>`;
        if (foundation.interventions.length === 0) {
            html += `<div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;color:#64748b;text-align:center">未检测到有效干预（model_hints 为空）</div>`;
        } else {
            const fails = foundation.interventions.filter(i => !i.pass);
            if (fails.length > 0) {
                 html += `<div style="padding:12px;background:linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);border:1px solid #fecaca;border-radius:8px;margin-bottom:12px;border-left:4px solid #dc2626">`;
                 html += `<div style="font-size:13px;font-weight:600;color:#dc2626;display:flex;align-items:center;gap:6px">`;
                 html += `<span>❌</span><span>发现 ${fails.length} 个干预 Step 缺失正文！</span>`;
                 html += `</div></div>`;
                 // 自动定位到第一个失败的Step并点击修改按钮
                 setTimeout(() => {
                     if (fails.length > 0) {
                         clickEditStep(fails[0].step);
                     }
                 }, 1000);
            }
            html += `<div style="display:flex;flex-direction:column;gap:8px">`;
            html += foundation.interventions.map(it => {
                const status = it.pass
                    ? '<span style="color:#16a34a;font-weight:600;font-size:12px;display:inline-flex;align-items:center;gap:4px"><span>✅</span>通过</span>'
                    : '<span style="color:#dc2626;font-weight:700;font-size:12px;display:inline-flex;align-items:center;gap:4px"><span>❌</span>缺失正文</span>';

                const hintSnippet = escapeHtml(it.hintSnippet || '');
                const hintFull = escapeHtml(it.hintFull || '');
                const safeHint = hintFull.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

                return `<div style="padding:12px;background:${it.pass ? '#f0fdf4' : '#fef2f2'};border:1px solid ${it.pass ? '#bbf7d0' : '#fecaca'};border-radius:8px;font-size:12px;border-left:3px solid ${it.pass ? '#16a34a' : '#dc2626'};margin-bottom:8px;transition:all 0.2s ease">` +
                       `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">` +
                       `  <div style="font-weight:700;color:#0f172a;font-size:13px;display:flex;align-items:center;gap:8px">` +
                       `    <span style="font-family:Menlo,Monaco,Consolas,monospace;color:#334155;background:rgba(255,255,255,0.5);padding:2px 6px;border-radius:4px">Step ${it.step}</span>` +
                       `    ${status}` +
                       `  </div>` +
                       `  <div style="display:flex;gap:2px">` +
                       `    <button class="neeko-action-btn" data-action="locate" data-step="${it.step}" title="定位到 Step ${it.step}" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconMapPin}</button>` +
                       `    <button class="neeko-action-btn" data-action="edit" data-step="${it.step}" title="修改思考过程" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconEdit}</button>` +
                       `    <button class="neeko-action-btn" data-action="copy" data-text="${safeHint}" title="复制内容" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconCopy}</button>` +
                       `  </div>` +
                       `</div>` +
                       `<div style="background:rgba(255,255,255,0.6);padding:8px;border-radius:6px;color:#334155;font-family:Menlo,Monaco,Consolas,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:help" title="${safeHint}">` +
                       `  ${hintSnippet || '<span style="color:#94a3b8;font-style:italic">无内容</span>'}` +
                       `</div>` +
                       `</div>`;
            }).join('');
            html += `</div>`;
        }
        html += `</div>`;

        // 2. 英文检测
        html += `<div class="neeko-card" style="margin-bottom:16px;animation:neeko-slideIn 0.4s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconGlobe}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">英文检测（正文 / 思考过程）</div>`;
        html += `</div>`;
        if (foundation.englishFindings.length === 0) {
             html += `<div style="padding:12px;background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#16a34a;text-align:center;border-left:4px solid #16a34a">`;
             html += `<span style="font-weight:600">✅ 未检测到纯英文段落</span>`;
             html += `</div>`;
        } else {
            html += `<div style="padding:12px;background:linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);border:1px solid #fecaca;border-radius:8px;margin-bottom:12px;border-left:4px solid #dc2626">`;
            html += `<div style="font-size:13px;font-weight:600;color:#dc2626;display:flex;align-items:center;gap:6px">`;
            html += `<span>❌</span><span>发现 ${foundation.englishFindings.length} 处纯英文内容</span>`;
            html += `</div></div>`;
            html += `<div style="display:flex;flex-direction:column;gap:8px">`;
            html += foundation.englishFindings.map(it => {
                const parts = [];
                if (it.body) parts.push('正文');
                if (it.thinking) parts.push('思考过程');
                const label = parts.join(' & ');

                // 获取对应的内容片段
                let contentSnippet = '';
                const stepData = parsedData.agent_steps.find(s => s.step === it.step)?.data || {};
                if (it.body) contentSnippet = stepData.content || '';
                else if (it.thinking) contentSnippet = stepData.reasoning_content || '';
                contentSnippet = escapeHtml(normalizeText(contentSnippet));
                const safeContent = contentSnippet.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

                return `<div style="padding:12px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;font-size:12px;border-left:3px solid #dc2626;margin-bottom:8px;transition:all 0.2s ease">` +
                       `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">` +
                       `  <div style="font-weight:700;color:#0f172a;font-size:13px;display:flex;align-items:center;gap:8px">` +
                       `    <span style="font-family:Menlo,Monaco,Consolas,monospace;color:#334155;background:rgba(255,255,255,0.5);padding:2px 6px;border-radius:4px">Step ${it.step}</span>` +
                       `    <span style="color:#dc2626">[${label}]</span>` +
                       `  </div>` +
                       `  <div style="display:flex;gap:2px">` +
                       `    <button class="neeko-action-btn" data-action="locate" data-step="${it.step}" title="定位到 Step ${it.step}" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconMapPin}</button>` +
                       `    <button class="neeko-action-btn" data-action="edit" data-step="${it.step}" title="修改思考过程" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconEdit}</button>` +
                       `    <button class="neeko-action-btn" data-action="copy" data-text="${safeContent}" title="复制内容" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconCopy}</button>` +
                       `  </div>` +
                       `</div>` +
                       `<div style="background:rgba(255,255,255,0.6);padding:8px;border-radius:6px;color:#334155;font-family:Menlo,Monaco,Consolas,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:help" title="${safeContent}">` +
                       `  ${contentSnippet || '<span style="color:#94a3b8;font-style:italic">无内容</span>'}` +
                       `</div>` +
                       `</div>`;
            }).join('');
            html += `</div>`;
        }
        html += `</div>`;

        // 3. 多段
        html += `<div class="neeko-card" style="margin-bottom:16px;animation:neeko-slideIn 0.6s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconList}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">正文多段落检测 (>2段)</div>`;
        html += `</div>`;
        html += `<div style="padding:12px;background:linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);border:1px solid #fed7aa;border-radius:8px;margin-bottom:12px;border-left:4px solid #f59e0b">`;
        html += `<div style="font-size:12px;color:#92400e;display:flex;align-items:start;gap:8px">`;
        html += `<span style="font-size:16px;flex-shrink:0">❓</span>`;
        html += `<span>当前统计"正文描述区域"中的段落数（按换行分割）。段落数>2可能表示模型在同一个 Step 中拆了多段描述或重复表达。需要你手动判断，这些多段描述是否是合理分段，还是在重复说同一件事、或语义被拆得不自然。若存在重复描述请删除多余的部分。</span>`;
        html += `</div></div>`;
        if (foundation.multiParagraphIssues.length === 0) {
            html += `<div style="padding:12px;background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#16a34a;text-align:center;border-left:4px solid #16a34a">`;
            html += `<span style="font-weight:600">✅ 当前未在正文区域检测到段落数大于 2 的 Step</span>`;
            html += `</div>`;
        } else {
            html += `<div style="display:flex;flex-direction:column;gap:8px">`;
            html += foundation.multiParagraphIssues.map(m => {
                const safeContent = (m.content || '').replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                return `<div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;border-left:3px solid #94a3b8;transition:all 0.2s ease">` +
                `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">` +
                `  <div style="font-weight:700;color:#0f172a;font-size:13px;display:flex;align-items:center;gap:8px">` +
                `    <span style="font-family:Menlo,Monaco,Consolas,monospace;color:#334155;background:rgba(255,255,255,0.5);padding:2px 6px;border-radius:4px">Step ${m.step}</span>` +
                `  </div>` +
                `  <div style="display:flex;gap:2px">` +
                `    <button class="neeko-action-btn" data-action="locate" data-step="${m.step}" title="定位到 Step ${m.step}" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconMapPin}</button>` +
                `    <button class="neeko-action-btn" data-action="edit" data-step="${m.step}" title="修改思考过程" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconEdit}</button>` +
                `    <button class="neeko-action-btn" data-action="copy" data-text="${safeContent}" title="复制内容" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconCopy}</button>` +
                `  </div>` +
                `</div>` +
                `<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">` +
                `<div style="display:flex;gap:12px;font-size:11px;color:#64748b">` +
                `<span>段落数：<span style="font-weight:600;color:#475569">${m.lines}</span></span>` +
                `<span>换行数：<span style="font-weight:600;color:#475569">${m.lineBreaks || 0}</span></span>` +
                `</div>` +
                `</div></div>`;
            }).join('');
            html += `</div>`;
        }
        html += `</div>`;

        // 4. MCP 调用
        html += `<div id="neeko-mcp-stats-card" class="neeko-card" style="margin-bottom:16px;animation:neeko-slideIn 0.5s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconZap}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">MCP 工具调用统计</div>`;
        html += `</div>`;
        html += `<div style="padding:16px;background:${foundation.mcpCount > 0 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'};border:1px solid ${foundation.mcpCount > 0 ? '#bbf7d0' : '#fecaca'};border-radius:12px;border-left:4px solid ${foundation.mcpCount > 0 ? '#16a34a' : '#dc2626'}">`;
        html += `<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:12px">`;
        html += `<div style="font-size:13px;color:#475569;font-weight:500">Chrome-MCP 调用次数：</div>`;
        html += `<div style="font-size:24px;font-weight:800;color:${foundation.mcpCount > 0 ? '#16a34a' : '#dc2626'}">${foundation.mcpCount}</div>`;
        html += `</div>`;
        if (foundation.mcpCount === 0) {
            html += `<div style="padding:10px;background:rgba(220,38,38,0.1);border-radius:8px;color:#dc2626;font-size:12px;font-weight:500;display:flex;align-items:center;gap:6px">`;
            html += `<span>⚠️</span><span>未检测到任何 Chrome-MCP 工具调用。建议在开发阶段和交付阶段各引导模型使用一次 MCP 工具链。</span>`;
            html += `</div>`;
        } else if (foundation.mcpCount < 10) {
            html += `<div style="padding:10px;background:rgba(245,158,11,0.1);border-radius:8px;color:#f59e0b;font-size:12px;font-weight:500;display:flex;align-items:center;gap:6px">`;
            html += `<span>💡</span><span>调用数量建议在 10～20 条之间，更重要的是调用要"有目的、有判断"。</span>`;
            html += `</div>`;
        } else {
            html += `<div style="padding:10px;background:rgba(22,163,74,0.1);border-radius:8px;color:#16a34a;font-size:12px;font-weight:500;display:flex;align-items:center;gap:6px">`;
            html += `<span>✅</span><span>调用数量合理，请确保调用有目的性且根据输出进行了判断。</span>`;
            html += `</div>`;
        }
        html += `</div>`;
        html += `</div>`;
        html += footerHtml; // Append Footer
        html += `</div>`; // End Base Tab

        // Tab: 辅助检测
        html += `<div id="neeko-tab-assist" class="neeko-tab" style="display:none;flex-direction:column;flex:1;overflow-y:auto;overflow-x:hidden;margin-top:0;padding-right:4px">`;

        // 1. Error
        html += `<div class="neeko-card" style="margin-bottom:16px;animation:neeko-slideIn 0.3s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconAlertTriangle}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">Error 文本检测</div>`;
        html += `</div>`;
        html += `<div style="padding:12px;background:linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);border:1px solid #fed7aa;border-radius:8px;margin-bottom:12px;border-left:4px solid #f59e0b">`;
        html += `<div style="font-size:12px;color:#92400e;display:flex;align-items:start;gap:8px">`;
        html += `<span style="font-size:16px;flex-shrink:0">❓</span>`;
        html += `<span>这里只根据文本中的 "error" 做提示，是否需要修改或重跑工具调用仍需你结合上下文自行判断。</span>`;
        html += `</div></div>`;
        if (aux.errorSteps.length === 0) {
            html += `<div style="padding:12px;background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#16a34a;text-align:center;border-left:4px solid #16a34a">`;
            html += `<span style="font-weight:600">✅ 当前未在各 Step 中发现包含 "error" 的文本</span>`;
            html += `</div>`;
        } else {
            html += `<div style="display:flex;flex-direction:column;gap:8px">`;
            html += aux.errorSteps.map(e => {
                const safeContent = (e.fullContent || e.snippet || '').replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                return `<div style="padding:12px;background:linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);border:1px solid #fed7aa;border-radius:8px;font-size:12px;border-left:3px solid #f59e0b;transition:all 0.2s ease">` +
                `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">` +
                `<div style="display:flex;align-items:center;gap:8px">` +
                `${linkStep(e.step)} <span style="color:#64748b;font-size:11px">(${escapeHtml(e.toolName)})</span>` +
                `</div>` +
                `<div style="display:flex;gap:2px">` +
                `<button class="neeko-action-btn" data-action="locate" data-step="${e.step}" title="定位到 Step ${e.step}" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconMapPin}</button>` +
                `<button class="neeko-action-btn" data-action="regenerate" data-step="${e.step}" title="重新生成" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconEdit}</button>` +
                `<button class="neeko-action-btn" data-action="copy" data-text="${safeContent}" title="复制Error内容" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconCopy}</button>` +
                `</div>` +
                `</div>` +
                `<div style="margin-top:6px;padding:8px;background:rgba(255,255,255,0.6);border-radius:6px;font-size:11px;color:#92400e;font-family:Menlo,Monaco,Consolas,monospace">"${escapeHtml(e.snippet)}"</div>` +
                `</div>`;
            }).join('');
            html += `</div>`;
        }
        html += `</div>`;

        // 2. 截图链路
        const iconCamera = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>';
        html += `<div id="neeko-screenshot-card" class="neeko-card" style="margin-bottom:16px;animation:neeko-slideIn 0.4s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconCamera}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">截图链路 (take_screenshot)</div>`;
        html += `</div>`;
        html += `<div style="padding:12px;background:linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);border:1px solid #fed7aa;border-radius:8px;margin-bottom:12px;border-left:4px solid #f59e0b">`;
        html += `<div style="font-size:12px;color:#92400e;display:flex;align-items:start;gap:8px">`;
        html += `<span style="font-size:16px;flex-shrink:0">❓</span>`;
        html += `<span>这里只能检测到 take_screenshot 调用与后一 Step 是否有正文，是否真正"根据截图调整页面"仍需你结合具体内容判断。要求：1）截图所在 Step 和下一步都要有正文描述；2）下一步需要根据截图结果，对布局、美观或功能做明确调整。</span>`;
        html += `</div></div>`;
        if (aux.screenshotChains.length === 0) {
            html += `<div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;color:#64748b;text-align:center">未检测到包含 take_screenshot 的 Step。如果题目期望使用截图工具，请在合适的阶段引导模型调用，并根据截图结果调整页面。</div>`;
        } else {
            html += `<div style="display:flex;flex-direction:column;gap:12px">`;
            html += aux.screenshotChains.map(p => {
                const warns = [];
                if (!p.curHasBody) warns.push('当前Step缺正文');
                if (!p.nextStep) warns.push('无后续Step');
                else {
                    if (!p.nextHasBody) warns.push('后续Step缺正文');
                    if (p.nextHasBody && p.nextActionHits.length === 0) warns.push('后续无行动关键词');
                }
                const isPass = warns.length === 0;
                const bgGradient = isPass ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
                const borderColor = isPass ? '#16a34a' : '#f59e0b';
                const icon = isPass ? '✅' : '⚠️';
                return `<div style="padding:16px;background:${bgGradient};border:1px solid ${isPass ? '#bbf7d0' : '#fed7aa'};border-radius:12px;border-left:4px solid ${borderColor};transition:all 0.2s ease">` +
                       `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;flex-wrap:wrap">` +
                       `<div style="display:flex;align-items:center;gap:8px">` +
                       `<span style="font-size:18px">${icon}</span>` +
                       `<div style="font-weight:700;font-size:13px;color:#0f172a">${linkStep(p.step)} → ${p.nextStep ? linkStep(p.nextStep) : '<span style="color:#64748b">End</span>'}</div>` +
                       `</div>` +
                       `<div style="display:flex;gap:2px">` +
                       `<button class="neeko-action-btn" data-action="locate" data-step="${p.step}" title="定位到 Step ${p.step}" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconMapPin}</button>` +
                       `<button class="neeko-action-btn" data-action="edit" data-step="${p.step}" title="修改思考过程" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconEdit}</button>` +
                       `<button class="neeko-action-btn" data-action="copy" data-text="${(p.curFullContent || '').replace(/'/g, "&apos;").replace(/"/g, "&quot;")}" title="复制Step内容" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconCopy}</button>` +
                       `</div>` +
                       `</div>` +
                       `<div style="padding:10px;background:rgba(255,255,255,0.6);border-radius:8px;margin-bottom:8px">` +
                       `<div style="font-size:11px;color:#64748b;margin-bottom:4px;font-weight:500">截图Step正文：</div>` +
                       `<div style="font-size:12px;color:#334155;font-family:-apple-system,sans-serif">${p.curHasBody ? escapeHtml(p.curContent || '') : '<span style="color:#dc2626;font-weight:600">❌ 缺失</span>'}</div>` +
                       `</div>` +
                       (p.nextStep ? `<div style="padding:10px;background:rgba(255,255,255,0.6);border-radius:8px;margin-bottom:8px">` +
                       `<div style="font-size:11px;color:#64748b;margin-bottom:4px;font-weight:500">下一Step正文：</div>` +
                       `<div style="font-size:12px;color:#334155;font-family:-apple-system,sans-serif">${p.nextHasBody ? escapeHtml(p.nextContent || '') : '<span style="color:#dc2626;font-weight:600">❌ 缺失</span>'}</div>` +
                       `</div>` : '') +
                       (isPass
                           ? `<div style="padding:8px;background:rgba(22,163,74,0.1);border-radius:6px;color:#16a34a;font-size:12px;font-weight:600">✅ 通过：链路完整${p.nextActionHits.length > 0 ? `（包含行动关键词：${p.nextActionHits.join('，')}）` : ''}</div>`
                           : `<div style="padding:8px;background:rgba(245,158,11,0.1);border-radius:6px;color:#f59e0b;font-size:12px;font-weight:600">⚠️ 问题：${warns.join('；')}</div>`) +
                       `</div>`;
            }).join('');
            html += `</div>`;
        }
        html += `</div>`;

        // 3. 语言检测
        html += `<div class="neeko-card" style="margin-bottom:16px;animation:neeko-slideIn 0.5s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconMessageSquare}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">第一人称/称谓检测</div>`;
        html += `</div>`;
        html += `<div style="padding:12px;background:linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);border:1px solid #fed7aa;border-radius:8px;margin-bottom:12px;border-left:4px solid #f59e0b">`;
        html += `<div style="font-size:12px;color:#92400e;display:flex;align-items:start;gap:8px">`;
        html += `<span style="font-size:16px;flex-shrink:0">❓</span>`;
        html += `<span>这里只根据关键字（你 / 我我 / 用户）做粗略扫描，请结合模型语气和 prompt 要求判断是否需要改写为第一人称、自然语言。</span>`;
        html += `</div></div>`;
        if (aux.languageIssues.length === 0) {
            html += `<div style="padding:12px;background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#16a34a;text-align:center;border-left:4px solid #16a34a">`;
            html += `<span style="font-weight:600">✅ 当前未发现明显使用"你 / 我我 / 用户"等高频关键字的正文或思考内容</span>`;
            html += `</div>`;
        } else {
            html += `<div style="display:flex;flex-direction:column;gap:8px">`;
            html += aux.languageIssues.map(l => {
                const allHits = [...new Set([...l.bodyHits, ...l.thinkingHits])];
                const parts = [];
                if (l.bodyHits.length > 0) parts.push('正文');
                if (l.thinkingHits.length > 0) parts.push('思考过程');

                // 获取对应内容
                let contentSnippet = '';
                const stepData = parsedData.agent_steps.find(s => s.step === l.step)?.data || {};
                if (l.bodyHits.length > 0) contentSnippet = stepData.content || '';
                else if (l.thinkingHits.length > 0) contentSnippet = stepData.reasoning_content || '';
                contentSnippet = escapeHtml(normalizeText(contentSnippet));
                const safeContent = contentSnippet.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

                return `<div style="padding:12px;background:#fffbeb;border:1px solid #fed7aa;border-radius:8px;font-size:12px;border-left:3px solid #f59e0b;transition:all 0.2s ease">` +
                       `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">` +
                       `<div style="flex:1;display:flex;align-items:center;gap:12px;min-width:0">` +
                       `  <div style="flex-shrink:0">${linkStep(l.step)}</div>` +
                       `  <div style="flex-shrink:0;color:#92400e;font-weight:600">[${parts.join('&')}]</div>` +
                       `  <div style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#475569;font-family:Menlo,Monaco,Consolas,monospace;background:rgba(255,255,255,0.6);padding:4px 8px;border-radius:4px;cursor:help" title="${safeContent}">${contentSnippet}</div>` +
                       `</div>` +
                       `<div style="flex-shrink:0;display:flex;align-items:center;gap:8px">` +
                       `  <span style="color:#d97706;font-size:11px">命中: ${allHits.join(',')}</span>` +
                       `  <button class="neeko-action-btn" data-action="locate" data-step="${l.step}" title="定位到 Step ${l.step}" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconMapPin}</button>` +
                       `  <button class="neeko-action-btn" data-action="edit" data-step="${l.step}" title="修改思考过程" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconEdit}</button>` +
                       `  <button class="neeko-action-btn" data-action="copy" data-text="${safeContent}" title="复制内容" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s">${iconCopy}</button>` +
                       `</div>` +
                       `</div></div>`;
            }).join('');
            html += `</div>`;
        }
        html += `</div>`;



        html += footerHtml; // Append Footer
        html += `</div>`; // End Assist Tab

        // Tab: 工具
        const iconFileText = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>';
        const iconCode = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>';
        const iconUnlock = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
        const iconSparkles = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>';
        const iconPencil = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
        const iconRocket = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>';

        html += `<div id="neeko-tab-tools" class="neeko-tab" style="display:none;flex-direction:column;flex:1;overflow-y:auto;overflow-x:hidden;margin-top:0;padding-right:4px">`;
        html += `<div class="neeko-card" style="margin-bottom:16px;animation:neeko-slideIn 0.3s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconTools}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">工具选择</div>`;
        html += `</div>`;
        html += `<select id="neeko-tool-selector" style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;background:#fff;cursor:pointer;font-weight:500;transition:all 0.2s ease;outline:none">`;
        html += `<option value="write" selected>Write入参生成工具</option>`;
        html += `<option value="serialize">序列化工具（代码转\\n格式）</option>`;
        html += `<option value="deserialize">反序列化工具（\\n转代码）</option>`;
        html += `<option value="format-json">JSON格式化工具（多行）</option>`;
        html += `<option value="minify-json">JSON单行化工具</option>`;
        html += `<option value="prompt-memo">提示词备忘录</option>`;
        html += `</select>`;
        html += `</div>`;

        // Write入参生成工具
        html += `<div id="neeko-tool-write" class="neeko-tool-panel">`;
        html += `<div class="neeko-card" style="animation:neeko-slideIn 0.4s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconPencil}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">Write入参生成工具</div>`;
        html += `</div>`;
        html += `<div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:16px;font-size:12px;color:#64748b">填写文件路径和内容，生成Write工具的JSON格式参数。</div>`;
        html += `<div style="margin-bottom:16px">`;
        html += `<label style="font-weight:600;font-size:12px;color:#0f172a;display:block;margin-bottom:8px">文件路径 <span style="color:#dc2626">*</span></label>`;
        html += `<input type="text" id="neeko-write-file-path" placeholder="请输入文件绝对路径" style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;box-sizing:border-box;transition:all 0.2s ease;outline:none">`;
        html += `</div>`;
        html += `<div style="margin-bottom:16px">`;
        html += `<label style="font-weight:600;font-size:12px;color:#0f172a;display:block;margin-bottom:8px">文件内容 <span style="color:#dc2626">*</span></label>`;
        html += `<textarea id="neeko-write-content" placeholder="请输入文件内容" style="width:100%;height:140px;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace;font-size:13px;resize:vertical;box-sizing:border-box;transition:all 0.2s ease;outline:none;line-height:1.6"></textarea>`;
        html += `</div>`;
        html += `<button id="neeko-write-generate" class="neeko-btn neeko-btn-primary" style="width:100%;padding:14px;font-size:14px;display:flex;align-items:center;justify-content:center;gap:6px">${iconRocket} 生成并复制</button>`;
        html += `<div id="neeko-write-feedback" style="margin-top:12px;padding:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#16a34a;font-weight:600;display:none;text-align:center;animation:neeko-fadeIn 0.3s ease"></div>`;
        html += `</div>`;
        html += `</div>`;

        // 序列化工具
        html += `<div id="neeko-tool-serialize" class="neeko-tool-panel" style="display:none">`;
        html += `<div class="neeko-card" style="animation:neeko-slideIn 0.4s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconCode}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">序列化工具（代码转\\n格式）</div>`;
        html += `</div>`;
        html += `<div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;font-size:12px;color:#64748b">将多行代码转换为JSON可存储的单行字符串（换行符转为\\n）。</div>`;
        html += `<textarea id="neeko-serialize-input" placeholder="在此粘贴代码..." style="width:100%;height:160px;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace;font-size:13px;resize:vertical;box-sizing:border-box;transition:all 0.2s ease;outline:none;line-height:1.6"></textarea>`;
        html += `<button id="neeko-serialize-btn" class="neeko-btn neeko-btn-primary" style="width:100%;margin-top:14px;padding:12px;display:flex;align-items:center;justify-content:center;gap:6px">${iconCopy} 序列化并复制</button>`;
        html += `<div id="neeko-serialize-feedback" style="margin-top:12px;padding:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#16a34a;font-weight:600;display:none;text-align:center;animation:neeko-fadeIn 0.3s ease">✅ 已复制到剪贴板</div>`;
        html += `</div>`;
        html += `</div>`;

        // 反序列化工具
        html += `<div id="neeko-tool-deserialize" class="neeko-tool-panel" style="display:none">`;
        html += `<div class="neeko-card" style="animation:neeko-slideIn 0.4s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconUnlock}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">反序列化工具（\\n转代码）</div>`;
        html += `</div>`;
        html += `<div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;font-size:12px;color:#64748b">将包含\\n格式的字符串转换为正常的多行代码。</div>`;
        html += `<textarea id="neeko-deserialize-input" placeholder="在此粘贴包含\\n的字符串..." style="width:100%;height:160px;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace;font-size:13px;resize:vertical;box-sizing:border-box;transition:all 0.2s ease;outline:none;line-height:1.6"></textarea>`;
        html += `<button id="neeko-deserialize-btn" class="neeko-btn neeko-btn-primary" style="width:100%;margin-top:14px;padding:12px;display:flex;align-items:center;justify-content:center;gap:6px">${iconCopy} 反序列化并复制</button>`;
        html += `<div id="neeko-deserialize-feedback" style="margin-top:12px;padding:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#16a34a;font-weight:600;display:none;text-align:center;animation:neeko-fadeIn 0.3s ease">✅ 已复制到剪贴板</div>`;
        html += `</div>`;
        html += `</div>`;

        // JSON格式化工具
        html += `<div id="neeko-tool-format-json" class="neeko-tool-panel" style="display:none">`;
        html += `<div class="neeko-card" style="animation:neeko-slideIn 0.4s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconSparkles}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">JSON格式化工具</div>`;
        html += `</div>`;
        html += `<div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;font-size:12px;color:#64748b">格式化JSON字符串，使其更易读（多行）。</div>`;
        html += `<textarea id="neeko-format-json-input" placeholder="在此粘贴JSON字符串..." style="width:100%;height:160px;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace;font-size:13px;resize:vertical;box-sizing:border-box;transition:all 0.2s ease;outline:none;line-height:1.6"></textarea>`;
        html += `<button id="neeko-format-json-btn" class="neeko-btn neeko-btn-primary" style="width:100%;margin-top:14px;padding:12px;display:flex;align-items:center;justify-content:center;gap:6px">${iconCopy} 格式化并复制</button>`;
        html += `<div id="neeko-format-json-feedback" style="margin-top:12px;padding:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#16a34a;font-weight:600;display:none;text-align:center;animation:neeko-fadeIn 0.3s ease">✅ 已复制到剪贴板</div>`;
        html += `</div>`;
        html += `</div>`;

        // JSON单行化工具 (New)
        html += `<div id="neeko-tool-minify-json" class="neeko-tool-panel" style="display:none">`;
        html += `<div class="neeko-card" style="animation:neeko-slideIn 0.4s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconFileText}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">JSON单行化工具</div>`;
        html += `</div>`;
        html += `<div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;font-size:12px;color:#64748b">将JSON字符串压缩为单行，去除空格和换行。</div>`;
        html += `<textarea id="neeko-minify-json-input" placeholder="在此粘贴JSON字符串..." style="width:100%;height:160px;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace;font-size:13px;resize:vertical;box-sizing:border-box;transition:all 0.2s ease;outline:none;line-height:1.6"></textarea>`;
        html += `<button id="neeko-minify-json-btn" class="neeko-btn neeko-btn-primary" style="width:100%;margin-top:14px;padding:12px;display:flex;align-items:center;justify-content:center;gap:6px">${iconCopy} 压缩并复制</button>`;
        html += `<div id="neeko-minify-json-feedback" style="margin-top:12px;padding:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#16a34a;font-weight:600;display:none;text-align:center;animation:neeko-fadeIn 0.3s ease">✅ 已复制到剪贴板</div>`;
        html += `</div>`;
        html += `</div>`;

        // Write入参生成工具 (Simplified removed, replaced by Prompt Memo logic below)

        // Write入参生成工具 (Restored)
        const writeGenerateBtn = panelEl.querySelector('#neeko-write-generate');
        if (writeGenerateBtn) {
            writeGenerateBtn.addEventListener('click', async () => {
                const filePath = panelEl.querySelector('#neeko-write-file-path')?.value || '';
                const content = panelEl.querySelector('#neeko-write-content')?.value || '';
                if (!filePath || !content) {
                    showFeedback('neeko-write-feedback', '❌ 请填写文件路径和内容');
                    return;
                }
                try {
                    const result = {
                        file_path: filePath,
                        content: content
                    };
                    const jsonStr = JSON.stringify(result, null, 2);
                    if (typeof GM_setClipboard === 'function') {
                        GM_setClipboard(jsonStr);
                    } else if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(jsonStr);
                    }
                    showFeedback('neeko-write-feedback', '✅ 已生成并复制到剪贴板');
                } catch (err) {
                    showFeedback('neeko-write-feedback', '❌ 生成失败: ' + err.message);
                }
            });
        }

        // Write入参生成工具 (was serializeBtn, renamed to avoid conflict)
        const serializeBtnNew = panelEl.querySelector('#neeko-serialize-btn');
        if (serializeBtnNew) {
            serializeBtnNew.addEventListener('click', async () => {
                const input = panelEl.querySelector('#neeko-serialize-input')?.value || '';
                if (!input) return;
                try {
                    // 将换行符转换为 \n
                    const result = input.replace(/\r\n/g, '\n').replace(/\n/g, '\\n').replace(/"/g, '\\"');
                    if (typeof GM_setClipboard === 'function') {
                        GM_setClipboard(result);
                    } else if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(result);
                    }
                    // Show success feedback
                    const btn = serializeBtnNew;
                    const originalText = btn.innerHTML;
                    btn.innerHTML = `${iconCheck} 已复制`;
                    btn.style.background = '#22c55e';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                    }, 1500);
                } catch (err) {
                    console.error(err);
                }
            });
        }

        // 提示词备忘录
        html += `<div id="neeko-tool-prompt-memo" class="neeko-tool-panel" style="display:none">`;
        html += `<div class="neeko-card" style="animation:neeko-slideIn 0.4s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;justify-content:space-between">`;
        html += `<div style="display:flex;align-items:center;gap:8px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconFile}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">提示词备忘录</div>`;
        html += `</div>`;
        html += `<button id="neeko-memo-add-btn" class="neeko-btn neeko-btn-primary" style="padding:4px 8px;font-size:12px;display:flex;align-items:center;gap:4px"><span>+</span> 新增</button>`;
        html += `</div>`;
        html += `<div id="neeko-memo-list" style="display:flex;flex-direction:column;gap:10px"></div>`;
        html += `</div>`;
        html += `</div>`;

        html += footerHtml; // Append Footer
        html += `</div>`; // Close neeko-tab-tools

        // Tab: 平台问题
        html += `<div id="neeko-tab-platform" class="neeko-tab" style="display:none;flex-direction:column;flex:1;overflow-y:auto;overflow-x:hidden;margin-top:0;padding-right:4px">`;
        html += `<div class="neeko-card" style="margin-bottom:16px;animation:neeko-slideIn 0.3s ease">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">`;
        html += `<span style="display:inline-flex;align-items:center;color:#64748b">${iconWrench}</span>`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a">平台问题排查</div>`;
        html += `</div>`;
        html += `<div style="padding:14px;background:#fffbeb;border:1px solid #fed7aa;border-radius:10px;margin-bottom:16px;border-left:4px solid #f59e0b">`;
        html += `<div style="font-size:13px;color:#92400e;font-weight:600;margin-bottom:12px">若平台出现问题，请尝试以下操作：</div>`;
        html += `<div style="display:flex;flex-direction:column;gap:12px;font-size:12px;color:#92400e;line-height:1.7">`;
        html += `<div style="padding:12px;background:rgba(255,255,255,0.7);border-radius:8px;border:1px solid #fed7aa">`;
        html += `<div style="font-weight:600;color:#0f172a;margin-bottom:4px">1. 资源加载失败</div>`;
        html += `<div style="color:#78350f">请刷新页面。或者点击重试按钮重新加载</div>`;
        html += `</div>`;
        html += `<div id="neeko-platform-error-2" style="padding:12px;background:rgba(255,255,255,0.7);border-radius:8px;border:1px solid #fed7aa">`;
        html += `<div style="font-weight:600;color:#0f172a;margin-bottom:4px">2. 接口报错</div>`;
        html += `<div style="color:#78350f">请检查 Request Header 是否包含 <span style="font-family:Menlo,monospace;background:rgba(0,0,0,0.05);padding:0 4px;border-radius:4px">x-use-ppe: 1、x-tt-env：ppe_aidp_chrome_mcp</span>。如果不包含，请添加小流量头，然后刷新页面。或者点击重试按钮重新加载。</div>`;
        html += `</div>`;
        html += `<div style="padding:12px;background:rgba(255,255,255,0.7);border-radius:8px;border:1px solid #fed7aa">`;
        html += `<div style="font-weight:600;color:#0f172a">3. 如果以上都无法解决，请点击下方按钮复制基本信息并发起 Oncall。</div>`;
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;
        html += `<div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:12px">`;
        html += `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">`;
        html += `<div style="font-weight:700;font-size:13px;color:#0f172a">基本信息</div>`;
        const copyIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        html += `<button id="neeko-copy-platform-info" class="neeko-btn neeko-btn-primary" style="padding:8px 14px;font-size:12px;display:flex;align-items:center;gap:6px">${copyIcon} 复制</button>`;
        html += `</div>`;
        html += `<div style="display:flex;flex-direction:column;gap:10px;font-size:12px;color:#475569">`;
        html += `<div style="padding:10px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0">`;
        html += `<div style="font-weight:600;color:#0f172a;margin-bottom:4px">题目ID</div>`;
        html += `<div style="font-family:Menlo,Monaco,Consolas,monospace;color:#334155;word-break:break-all">${escapeHtml(itemId)}</div>`;
        html += `</div>`;
        html += `<div style="padding:10px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0">`;
        html += `<div style="font-weight:600;color:#0f172a;margin-bottom:4px">队列ID</div>`;
        html += `<div style="font-family:Menlo,Monaco,Consolas,monospace;color:#334155;word-break:break-all">${escapeHtml(taskId)}</div>`;
        html += `</div>`;
        html += `<div style="padding:10px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0">`;
        html += `<div style="font-weight:600;color:#0f172a;margin-bottom:4px">会话ID</div>`;
        html += `<div style="font-family:Menlo,Monaco,Consolas,monospace;color:#334155;word-break:break-all">${escapeHtml(conversationId)}</div>`;
        html += `</div>`;
        html += `</div>`;
        html += footerHtml; // Append Footer
        html += `</div>`;

        html += `</div>`; // 结束Tab内容区域

        const body = panelEl.querySelector('#neeko-panel-body');
        body.innerHTML = html;
        body.style.minHeight = '340px';

        // Apply View Filter after render
        if (panelEl._applyViewFilter) {
            panelEl._applyViewFilter();
        }

        lastReportText = body.textContent || '';
        bindTabEvents();
        bindStepLinks();
        bindCollapseEvents(); // 绑定折叠事件
        // 延迟绑定工具事件，确保按钮已渲染
        setTimeout(() => bindToolEvents(), 50);
        panelEl.style.display = 'flex';
        syncPanelPositionWithButton();
        finishLoading();
    }

    // 绑定折叠/展开事件
    function bindCollapseEvents() {
        const iconChevronDown = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        const iconChevronUp = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';

        // 自查清单折叠
        const checklistToggle = panelEl.querySelector('#neeko-checklist-toggle');
        const checklistContent = panelEl.querySelector('#neeko-checklist-content');
        const checklistChevron = panelEl.querySelector('#neeko-checklist-chevron');
        if (checklistToggle && checklistContent && checklistChevron) {
            checklistToggle.addEventListener('click', () => {
                const isHidden = checklistContent.style.display === 'none';
                checklistContent.style.display = isHidden ? 'block' : 'none';
                checklistChevron.innerHTML = isHidden ? iconChevronUp : iconChevronDown;
                checklistChevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
                checklistToggle.style.background = isHidden ? '#f8fafc' : 'transparent';
            });
            checklistToggle.addEventListener('mouseenter', () => {
                if (checklistContent.style.display === 'none') {
                    checklistToggle.style.background = '#f8fafc';
                }
            });
            checklistToggle.addEventListener('mouseleave', () => {
                if (checklistContent.style.display === 'none') {
                    checklistToggle.style.background = 'transparent';
                }
            });
        }
    }

    // 绑定Step链接点击事件
    function bindStepLinks() {
        buildStepElementMap(); // 重新建立映射
        const links = panelEl.querySelectorAll('.neeko-step-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const stepNum = parseInt(link.getAttribute('data-step'), 10);
                if (stepNum) {
                    scrollToStep(stepNum);
                    showToast(`正在定位到 Step ${stepNum}...`);
                }
            });
        });

        // 绑定新的操作按钮点击事件
        const actionBtns = panelEl.querySelectorAll('.neeko-action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                const stepNum = parseInt(btn.getAttribute('data-step'), 10);

                if (action === 'locate') {
                    if (stepNum) {
                        scrollToStep(stepNum);
                        showToast(`正在定位到 Step ${stepNum}...`);
                    }
                } else if (action === 'edit') {
                    if (stepNum) {
                        clickEditStep(stepNum, 'modify');
                    }
                } else if (action === 'regenerate') {
                    if (stepNum) {
                        clickEditStep(stepNum, 'regenerate');
                    }
                } else if (action === 'copy') {
                    const text = btn.getAttribute('data-text');
                    if (text) {
                        try {
                            // 简单的HTML实体解码
                            const decoded = text
                                .replace(/&apos;/g, "'")
                                .replace(/&quot;/g, '"')
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&amp;/g, '&');

                            if (typeof GM_setClipboard === 'function') {
                                GM_setClipboard(decoded);
                            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(decoded);
                            }
                            showToast('✅ 内容已复制到剪贴板');
                        } catch (err) {
                            showToast('❌ 复制失败');
                        }
                    }
                }
            });

            // 按钮 hover 效果 (通过CSS实现，此处仅添加点击反馈)
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'scale(0.95)';
            });
            btn.addEventListener('mouseup', () => {
                btn.style.transform = 'scale(1)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });

        // 绑定定位图标点击事件 (保留兼容性)
        const locateIcons = panelEl.querySelectorAll('.neeko-step-icon[data-action="locate"]');
        locateIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const stepNum = parseInt(icon.getAttribute('data-step'), 10);
                if (stepNum) {
                    scrollToStep(stepNum);
                    showToast(`正在定位到 Step ${stepNum}...`);
                }
            });
            icon.addEventListener('mouseenter', () => {
                icon.style.background = '#bae6fd';
                icon.style.transform = 'scale(1.1)';
            });
            icon.addEventListener('mouseleave', () => {
                icon.style.background = '#e0f2fe';
                icon.style.transform = 'scale(1)';
            });
        });

        // 绑定修改图标点击事件 (保留兼容性)
        const editIcons = panelEl.querySelectorAll('.neeko-step-icon[data-action="edit"]');
        editIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const stepNum = parseInt(icon.getAttribute('data-step'), 10);
                if (stepNum) {
                    clickEditStep(stepNum);
                    showToast(`正在打开 Step ${stepNum} 修改窗口...`);
                }
            });
            icon.addEventListener('mouseenter', () => {
                icon.style.background = '#fde68a';
                icon.style.transform = 'scale(1.1)';
            });
            icon.addEventListener('mouseleave', () => {
                icon.style.background = '#fef3c7';
                icon.style.transform = 'scale(1)';
            });
        });
    }

    // 显示Toast提示 - 美化设计（顶部居中）
    function showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.innerHTML = `<div style="display:flex;align-items:center;gap:8px"><span>✨</span><span>${escapeHtml(message)}</span></div>`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
            color: #fff;
            padding: 10px 24px;
            border-radius: 24px;
            font-size: 13px;
            font-weight: 600;
            z-index: 2147483648;
            box-shadow: 0 4px 12px rgba(22,119,255,0.4), 0 2px 4px rgba(0,0,0,0.1);
            animation: neeko-slideDown 0.3s ease;
            max-width: 80%;
            white-space: nowrap;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            pointer-events: none;
            .neeko-dropdown-menu {
                opacity: 0;
                transform: translateY(-8px) scale(0.98);
                pointer-events: none;
                visibility: hidden;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .neeko-dropdown-menu.active {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: auto;
                visibility: visible;
            }
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'neeko-slideUp 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    function showLoading() {
        if (!panelEl) return;
        const body = panelEl.querySelector('#neeko-panel-body');
        if (body) {
            body.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;height:100%;min-height:400px;color:#0f172a">' +
                '<div style="position:relative;width:64px;height:64px">' +
                '<div style="position:absolute;inset:0;border:4px solid #e0e7ff;border-top-color:#1677ff;border-radius:50%;animation:neeko-spin 0.8s linear infinite"></div>' +
                '<div style="position:absolute;inset:8px;border:3px solid #dbeafe;border-top-color:#3b82f6;border-radius:50%;animation:neeko-spin 1.2s linear infinite reverse"></div>' +
                '</div>' +
                '<div style="font-size:14px;font-weight:600;color:#475569">正在加载数据...</div>' +
                '<div style="font-size:12px;color:#94a3b8">请稍候</div>' +
                '</div>';
        }
        panelEl.style.display = 'flex';
        syncPanelPositionWithButton();
        isLoading = true;
        try {
            btnEl.disabled = true;
            btnEl.style.cursor = 'not-allowed';
            btnEl.style.opacity = '0.7';
            if (refreshBtnEl) {
                refreshBtnEl.style.pointerEvents = 'none';
                refreshBtnEl.style.opacity = '0.6';
                refreshBtnEl.textContent = '刷新中...';
            }
        } catch (_) {}
    }

    function finishLoading() {
        isLoading = false;
        try {
            btnEl.disabled = false;
            btnEl.style.cursor = 'grab';
            btnEl.style.opacity = '1';
            if (refreshBtnEl) {
                refreshBtnEl.style.pointerEvents = 'auto';
                refreshBtnEl.style.opacity = '1';
                refreshBtnEl.textContent = '刷新';
            }
        } catch (_) {}
    }

    function bindTabEvents() {
        const btns = panelEl.querySelectorAll('.neeko-tab-btn');
        const tabs = panelEl.querySelectorAll('.neeko-tab');
        btns.forEach(b => {
            b.addEventListener('click', () => {
                const tab = b.getAttribute('data-tab');
                tabs.forEach(t => {
                    t.style.display = 'none';
                });
                const targetTab = panelEl.querySelector(`#neeko-tab-${tab}`);
                if (targetTab) {
                    targetTab.style.display = 'flex'; // 使用flex确保滚动
                    targetTab.style.animation = 'neeko-fadeIn 0.3s ease';
                }
                btns.forEach(x => {
                    x.classList.remove('active');
                    x.style.background = '#ffffff';
                    x.style.color = '#475569';
                    x.style.border = '1px solid #e2e8f0';
                    x.style.boxShadow = 'none';
                });
                b.classList.add('active');
                b.style.background = '#1677ff';
                b.style.color = '#fff';
                b.style.border = 'none';
                b.style.boxShadow = '0 2px 8px rgba(22,119,255,0.3)';
            });
        });
    }

    function bindToolEvents() {
        // 工具选择器切换
        const toolSelector = panelEl.querySelector('#neeko-tool-selector');
        if (toolSelector) {
            toolSelector.addEventListener('change', (e) => {
                const value = e.target.value;
                const panels = panelEl.querySelectorAll('.neeko-tool-panel');
                panels.forEach(p => p.style.display = 'none');
                const targetPanel = panelEl.querySelector(`#neeko-tool-${value}`);
                if (targetPanel) {
                    targetPanel.style.display = 'block';
                }
            });
        }

        const showFeedback = (id, msg) => {
            const feedback = panelEl.querySelector(`#${id}`);
            if (feedback) {
                feedback.textContent = msg || '✅ 已复制到剪贴板';
                feedback.style.display = 'block';
                setTimeout(() => { if (feedback) feedback.style.display = 'none'; }, 2000);
            }
        };

        // Write入参生成工具
        const writeGenerateBtn = panelEl.querySelector('#neeko-write-generate');
        if (writeGenerateBtn) {
            writeGenerateBtn.addEventListener('click', async () => {
                const filePath = panelEl.querySelector('#neeko-write-file-path')?.value || '';
                const content = panelEl.querySelector('#neeko-write-content')?.value || '';
                if (!filePath || !content) {
                    showFeedback('neeko-write-feedback', '❌ 请填写文件路径和内容');
                    return;
                }
                try {
                    const result = {
                        file_path: filePath,
                        content: content
                    };
                    const jsonStr = JSON.stringify(result, null, 2);
                    if (typeof GM_setClipboard === 'function') {
                        GM_setClipboard(jsonStr);
                    } else if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(jsonStr);
                    }
                    showFeedback('neeko-write-feedback', '✅ 已生成并复制到剪贴板');
                } catch (err) {
                    showFeedback('neeko-write-feedback', '❌ 生成失败: ' + err.message);
                }
            });
        }

        // 序列化工具 (代码 -> \n)
        const serializeBtn = panelEl.querySelector('#neeko-serialize-btn');
        if (serializeBtn) {
            serializeBtn.addEventListener('click', async () => {
                const input = panelEl.querySelector('#neeko-serialize-input')?.value || '';
                if (!input) return;
                try {
                    // 将换行符转换为 \n，双引号转义
                    const result = input.replace(/\r\n/g, '\n').replace(/\n/g, '\\n').replace(/"/g, '\\"');
                    if (typeof GM_setClipboard === 'function') {
                        GM_setClipboard(result);
                    } else if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(result);
                    }
                    showFeedback('neeko-serialize-feedback');
                } catch (err) {
                    showFeedback('neeko-serialize-feedback', '❌ 序列化失败: ' + err.message);
                }
            });
        }

        // 反序列化工具 (\n -> 代码)
        const deserializeBtn = panelEl.querySelector('#neeko-deserialize-btn');
        if (deserializeBtn) {
            deserializeBtn.addEventListener('click', async () => {
                const input = panelEl.querySelector('#neeko-deserialize-input')?.value || '';
                if (!input) return;
                try {
                    // 尝试通过JSON解析来处理转义字符
                    // 如果输入是纯字符串内容（不带引号），我们加上引号让它成为合法的JSON字符串
                    let jsonStr = input.trim();
                    if (!jsonStr.startsWith('"')) {
                        jsonStr = '"' + jsonStr + '"';
                    }
                    const result = JSON.parse(jsonStr);

                    if (typeof GM_setClipboard === 'function') {
                        GM_setClipboard(result);
                    } else if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(result);
                    }
                    showFeedback('neeko-deserialize-feedback');
                } catch (err) {
                    // 如果JSON解析失败，尝试简单的替换
                    try {
                        const simpleResult = input.replace(/\\n/g, '\n').replace(/\\"/g, '"');
                        if (typeof GM_setClipboard === 'function') {
                            GM_setClipboard(simpleResult);
                        } else if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(simpleResult);
                        }
                        showFeedback('neeko-deserialize-feedback');
                    } catch (e) {
                        showFeedback('neeko-deserialize-feedback', '❌ 反序列化失败: ' + err.message);
                    }
                }
            });
        }

        // JSON格式化工具
        const formatJsonBtn = panelEl.querySelector('#neeko-format-json-btn');
        if (formatJsonBtn) {
            formatJsonBtn.addEventListener('click', async () => {
                const input = panelEl.querySelector('#neeko-format-json-input')?.value || '';
                if (!input) return;
                try {
                    const jsonObj = JSON.parse(input);
                    const result = JSON.stringify(jsonObj, null, 2);
                    if (typeof GM_setClipboard === 'function') {
                        GM_setClipboard(result);
                    } else if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(result);
                    }
                    showFeedback('neeko-format-json-feedback');
                } catch (err) {
                    showFeedback('neeko-format-json-feedback', '❌ 格式化失败: ' + err.message);
                }
            });
        }

        // JSON单行化工具
        const minifyJsonBtn = panelEl.querySelector('#neeko-minify-json-btn');
        if (minifyJsonBtn) {
            minifyJsonBtn.addEventListener('click', async () => {
                const input = panelEl.querySelector('#neeko-minify-json-input')?.value || '';
                if (!input) return;
                try {
                    const jsonObj = JSON.parse(input);
                    const result = JSON.stringify(jsonObj);
                    if (typeof GM_setClipboard === 'function') {
                        GM_setClipboard(result);
                    } else if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(result);
                    }
                    showFeedback('neeko-minify-json-feedback');
                } catch (err) {
                    showFeedback('neeko-minify-json-feedback', '❌ 压缩失败: ' + err.message);
                }
            });
        }


        // 提示词备忘录
        initPromptMemoTool();

        // 平台问题模块复制功能
        const copyPlatformInfoBtn = panelEl.querySelector('#neeko-copy-platform-info');
        if (copyPlatformInfoBtn) {
            copyPlatformInfoBtn.addEventListener('click', async () => {
                const info = `题目ID：${parsedData?.itemId || '-'}\n队列ID：${parsedData?.taskId || '-'}\n会话ID：${parsedData?.conversationId || '-'}`;
                try {
                    if (typeof GM_setClipboard === 'function') {
                        GM_setClipboard(info);
                    } else if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(info);
                    }
                    showToast('✅ 基本信息已复制到剪贴板');
                } catch (err) {
                    showToast('❌ 复制失败');
                }
            });
        }
    }

    // 初始化提示词备忘录工具
    function initPromptMemoTool() {
        const memoListEl = panelEl.querySelector('#neeko-memo-list');
        const addBtn = panelEl.querySelector('#neeko-memo-add-btn');
        if (!memoListEl || !addBtn) return;

        const STORAGE_KEY = 'neeko_prompt_memos';
        const DEFAULT_MEMO = `1. 创建项目基础结构和配置文件
2. 实现前端：复杂功能只实现基础部分就行，并且要注意页面不可以用紫色
3. 实现后端：后端数据用模拟的形式即可。
4. 启动前后端项目：并且保证前后端项目是启动状态，不要停止除非代码出现问题，需要重新启动，除此之外不要关闭页面
5. 代码测试：创建Playwright测试代码基本功能正常，并且不需要运行，不需要安装相关依赖
6. 工具测试：保持项目启动并调用工具进行开发阶段测试，保证页面美观，工具调用正常。前后端交互合理。测试工具要求如下：
  - 当页面包含表单时，你要使用 fill_form 批量填写输入项，或者使用 fill 分别填写，验证表单的交互逻辑是否正常。
  -  当实现包含 JavaScript 行为时，可以调用 evaluate_script 执行相关脚本，确认代码逻辑、事件绑定或数据处理是否按照预期运行。
  - 涉及交互的按钮、链接或菜单时，可以使用 click 或 hover 检查交互元素是否能够触发、跳转或显示期望的内容。
  - 如果怀疑样式错乱、元素重叠或渲染不全，你应该使用 take_screenshot 查看实际渲染效果，确认布局的正确性。
  - - 在页面内容复杂或动画较多的情况下，可以调用 performance_start_trace 和 performance_stop_trace 进行性能分析，观察页面是否存在加载慢、卡顿等问题。
  - 为了确保 DOM 结构完整，应调用 take_snapshot 检查元素树，验证所有关键组件是否存在并呈现。
  - 对最终功能流程，需要使用 click、fill 或 fill_form 再次验证是否可正常执行，例如按钮是否可点击、表单是否能提交、跳转是否正常。
  - 在交付前，你应查看 list_console_messages 的输出，确认控制台中没有出现 error 或 warn 等运行时错误。
  - 如果项目涉及接口数据，你可以查看 list_network_requests 或 get_network_request，确认请求的发送、响应以及渲染过程是否正常。
  - 多页面项目或带路由跳转的应用，应该通过 navigate_page 模拟刷新、前进、后退，确保整个跳转流程没有问题。`;

        let memos = [];
        try {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
                memos = JSON.parse(cached);
            } else {
                // 默认第一条
                memos = [{ id: Date.now(), content: DEFAULT_MEMO, expanded: false }];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
            }
        } catch (_) {
            memos = [];
        }

        const renderMemos = () => {
            memoListEl.innerHTML = '';
            if (memos.length === 0) {
                memoListEl.innerHTML = '<div style="text-align:center;color:#94a3b8;font-size:12px;padding:20px">暂无备忘录，点击右上角新增</div>';
                return;
            }

            memos.forEach((memo, idx) => {
                const item = document.createElement('div');
                item.className = 'neeko-memo-item';
                item.style.cssText = 'background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;transition:all 0.2s ease';

                const header = document.createElement('div');
                header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:6px';

                const title = document.createElement('div');
                title.style.cssText = 'font-weight:600;font-size:13px;color:#334155;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:8px';
                // 标题取前20个字
                title.textContent = memo.content.slice(0, 20).replace(/\n/g, ' ') + (memo.content.length > 20 ? '...' : '');

                const actions = document.createElement('div');
                actions.style.cssText = 'display:flex;gap:4px';

                const btnStyle = 'border:none;background:transparent;cursor:pointer;padding:4px;border-radius:4px;color:#64748b;display:flex;align-items:center;transition:all 0.2s';

                const expandBtn = document.createElement('button');
                expandBtn.innerHTML = memo.expanded ?
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>' :
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
                expandBtn.style.cssText = btnStyle;
                expandBtn.title = memo.expanded ? '收起' : '展开';
                expandBtn.onclick = () => {
                    memo.expanded = !memo.expanded;
                    saveAndRender();
                };

                const copyBtn = document.createElement('button');
                copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                copyBtn.style.cssText = btnStyle;
                copyBtn.title = '复制';
                copyBtn.onclick = async () => {
                    try {
                         if (typeof GM_setClipboard === 'function') {
                            GM_setClipboard(memo.content);
                        } else if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(memo.content);
                        }
                        showToast('✅ 已复制');
                    } catch (_) { showToast('❌ 复制失败'); }
                };

                const editBtn = document.createElement('button');
                if (memo.isEditing) {
                    editBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    editBtn.title = '保存';
                    editBtn.style.color = '#16a34a';
                } else {
                    editBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
                    editBtn.title = '编辑';
                    editBtn.style.color = '#64748b';
                }
                editBtn.style.cssText = btnStyle;
                editBtn.onclick = () => {
                    if (memo.isEditing) {
                        // Save action
                        const textarea = item.querySelector('textarea');
                        if (textarea) {
                            memo.content = textarea.value;
                            memo.isEditing = false;
                            saveAndRender();
                        }
                    } else {
                        // Edit action
                        memo.isEditing = true;
                        memo.expanded = true; // Auto expand
                        renderMemos();
                    }
                };

                const delBtn = document.createElement('button');
                delBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                delBtn.style.cssText = btnStyle;
                delBtn.style.color = '#ef4444';
                delBtn.title = '删除';
                delBtn.onclick = () => {
                    if (confirm('确定删除该条备忘录吗？')) {
                        memos.splice(idx, 1);
                        saveAndRender();
                    }
                };

                actions.appendChild(copyBtn);
                actions.appendChild(editBtn);
                actions.appendChild(delBtn);
                actions.appendChild(expandBtn);

                header.appendChild(title);
                header.appendChild(actions);
                item.appendChild(header);

                if (memo.expanded) {
                    if (memo.isEditing) {
                        const textarea = document.createElement('textarea');
                        textarea.style.cssText = 'width:100%;height:200px;padding:8px;border:1px solid #1677ff;border-radius:6px;font-family:Menlo,Monaco,Consolas,monospace;font-size:12px;color:#334155;line-height:1.5;outline:none;resize:vertical;box-sizing:border-box';
                        textarea.value = memo.content;
                        item.appendChild(textarea);
                    } else {
                        const content = document.createElement('div');
                        content.style.cssText = 'font-size:12px;color:#475569;white-space:pre-wrap;background:#fff;padding:8px;border-radius:6px;border:1px solid #f1f5f9;line-height:1.5;max-height:300px;overflow-y:auto;font-family:Menlo,Monaco,Consolas,monospace';
                        content.textContent = memo.content;
                        item.appendChild(content);
                    }
                }

                memoListEl.appendChild(item);
            });
        };

        const saveAndRender = () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
            renderMemos();
        };

        addBtn.onclick = () => {
            // 默认添加一个空备忘录或带模板
            const content = prompt('请输入提示词内容：', '');
            if (content) {
                memos.unshift({ id: Date.now(), content, expanded: true });
                saveAndRender();
            }
        };

        renderMemos();
    }

    // 初始化编辑修改工具 (已废弃，保留函数防止报错，但不再调用)
    async function initEditTool() {
        return;
    }

    // 解析render_version工具数据
    function parseRenderVersionTools(data) {
        // 根据实际数据结构解析，这里提供一个通用解析逻辑
        const tools = [];
        try {
            // 尝试多种可能的数据结构
            let toolList = data?.tools || data?.data?.tools || data?.result?.tools || [];
            if (!Array.isArray(toolList) && typeof toolList === 'object') {
                // 如果是对象，尝试转换为数组
                toolList = Object.entries(toolList).map(([key, value]) => ({ ...value, key }));
            }

            toolList.forEach(tool => {
                if (tool && tool.name) {
                    const category = tool.category || tool.group || '其他';
                    const name = tool.name;
                    const parameters = tool.parameters || tool.params || tool.inputs || {};

                    tools.push({
                        category,
                        name,
                        parameters
                    });
                }
            });

            // 如果没有找到，尝试默认工具（文件操作/Write）
            if (tools.length === 0) {
                tools.push({
                    category: '文件操作',
                    name: 'Write',
                    parameters: {
                        file_path: { type: 'string', required: true, description: '文件绝对路径（必填）' },
                        content: { type: 'string', required: true, description: '文件内容（必填）' }
                    }
                });
            }
        } catch (err) {
            console.warn('解析工具数据失败:', err);
            // 返回默认工具
            return [{
                category: '文件操作',
                name: 'Write',
                parameters: {
                    file_path: { type: 'string', required: true, description: '文件绝对路径（必填）' },
                    content: { type: 'string', required: true, description: '文件内容（必填）' }
                }
            }];
        }
        return tools;
    }

    // 渲染工具输入框 - 美化设计
    function renderEditToolInputs(tool, container) {
        if (!container || !tool) return;

        let html = '<div style="margin-bottom:16px">';
        html += `<div style="padding:14px;background:linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px">`;
        html += `<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">`;
        html += `<div style="font-weight:700;font-size:14px;color:#0f172a;display:flex;align-items:center;gap:8px">`;
        html += `<span>${escapeHtml(tool.category)}</span>`;
        html += `<span style="color:#cbd5e1">/</span>`;
        html += `<span style="color:#1677ff">${escapeHtml(tool.name)}</span>`;
        html += `</div>`;
        html += `<span style="position:relative;cursor:help;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:rgba(22,119,255,0.1);border-radius:6px;transition:all 0.2s ease">`;
        html += `<span style="color:#1677ff;font-size:16px;font-weight:700">?</span>`;
        html += `<div style="position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);padding:12px;background:#1f2933;color:#fff;border-radius:8px;font-size:11px;white-space:pre-wrap;max-width:320px;z-index:1000;display:none;box-shadow:0 8px 24px rgba(0,0,0,0.4);font-family:Menlo,Monaco,Consolas,monospace;line-height:1.6">`;
        html += JSON.stringify(tool.parameters, null, 2);
        html += `<div style="position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #1f2933"></div>`;
        html += `</div>`;
        html += `</span>`;
        html += `</div></div>`;

        const params = tool.parameters || {};
        Object.entries(params).forEach(([key, param]) => {
            const paramInfo = typeof param === 'object' ? param : { type: 'string', description: String(param) };
            const isRequired = paramInfo.required !== false;
            const label = paramInfo.description || key;
            const inputType = paramInfo.type === 'number' ? 'number' : 'text';

            html += `<div style="margin-bottom:16px">`;
            html += `<label style="font-weight:600;font-size:12px;color:#0f172a;display:block;margin-bottom:8px">`;
            html += `${escapeHtml(label)}${isRequired ? '<span style="color:#dc2626;margin-left:4px">*</span>' : ''}`;
            html += `</label>`;
            if (key === 'content') {
                html += `<textarea id="neeko-edit-${key}" placeholder="请输入${escapeHtml(label)}" style="width:100%;height:140px;border:2px solid #e2e8f0;border-radius:10px;padding:12px;font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace;font-size:13px;resize:vertical;box-sizing:border-box;transition:all 0.2s ease;outline:none;line-height:1.6"></textarea>`;
            } else {
                html += `<input type="${inputType}" id="neeko-edit-${key}" placeholder="请输入${escapeHtml(label)}" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:13px;box-sizing:border-box;transition:all 0.2s ease;outline:none">`;
            }
            html += `</div>`;
        });

        html += '</div>';
        container.innerHTML = html;

        // 绑定问号图标悬浮显示和输入框focus效果
        const helpIcon = container.querySelector('span[style*="cursor:help"]');
        if (helpIcon) {
            const tooltip = helpIcon.querySelector('div');
            helpIcon.addEventListener('mouseenter', () => {
                if (tooltip) {
                    tooltip.style.display = 'block';
                    helpIcon.style.background = 'rgba(22,119,255,0.2)';
                    helpIcon.style.transform = 'scale(1.1)';
                }
            });
            helpIcon.addEventListener('mouseleave', () => {
                if (tooltip) {
                    tooltip.style.display = 'none';
                    helpIcon.style.background = 'rgba(22,119,255,0.1)';
                    helpIcon.style.transform = 'scale(1)';
                }
            });
        }

        // 输入框focus效果
        container.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                this.style.borderColor = '#1677ff';
                this.style.boxShadow = '0 0 0 3px rgba(22,119,255,0.1)';
            });
            input.addEventListener('blur', function() {
                this.style.borderColor = '#e2e8f0';
                this.style.boxShadow = 'none';
            });
        });
    }

    // 生成编辑工具数据
    function generateEditToolData() {
        const toolSelect = panelEl.querySelector('#neeko-edit-tool-select');
        if (!toolSelect) return null;

        const toolIdx = parseInt(toolSelect.value, 10);
        const data = renderVersionData;
        if (!data) return null;

        const toolList = parseRenderVersionTools(data);
        const tool = toolList[toolIdx];
        if (!tool) return null;

        const result = {};
        const params = tool.parameters || {};
        Object.keys(params).forEach(key => {
            const input = panelEl.querySelector(`#neeko-edit-${key}`);
            if (input) {
                const value = input.value || '';
                const paramInfo = typeof params[key] === 'object' ? params[key] : {};
                if (paramInfo.type === 'number') {
                    result[key] = value ? parseFloat(value) : '';
                } else {
                    result[key] = value;
                }
            }
        });

        return result;
    }

    // 注入全局样式
    function injectGlobalStyles() {
        if (document.getElementById('neeko-global-styles')) return;
        const style = document.createElement('style');
        style.id = 'neeko-global-styles';
        style.textContent = `
            @keyframes neeko-spin { to { transform: rotate(360deg); } }
            @keyframes neeko-fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes neeko-fadeOut { to { opacity: 0; transform: translateY(-10px); } }
            @keyframes neeko-slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes neeko-slideUp { to { opacity: 0; transform: translate(-50%, -20px); } }
            .neeko-action-btn:hover { background-color: rgba(0,0,0,0.05) !important; color: #1677ff !important; }
            @keyframes neeko-slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes neeko-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
            @keyframes neeko-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

            .neeko-step-link {
                color: #1677ff !important;
                text-decoration: none !important;
                font-weight: 700 !important;
                cursor: pointer !important;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
                padding: 4px 8px !important;
                border-radius: 6px !important;
                display: inline-block !important;
                position: relative !important;
            }
            .neeko-step-link:hover {
                background: linear-gradient(135deg, #e6f4ff 0%, #d0e7ff 100%) !important;
                color: #0958d9 !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 2px 8px rgba(22,119,255,0.2) !important;
            }
            .neeko-step-link:active {
                transform: translateY(0) !important;
            }

            .neeko-card {
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                transition: all 0.3s ease;
            }
            .neeko-card:hover {
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                transform: translateY(-2px);
            }

            .neeko-btn {
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                border: none;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .neeko-btn-primary {
                background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
                color: #fff;
                box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3);
            }
            .neeko-btn-primary:hover {
                background: linear-gradient(135deg, #0958d9 0%, #003eb3 100%);
                box-shadow: 0 4px 16px rgba(22, 119, 255, 0.5);
                transform: translateY(-2px) scale(1.02);
            }
            .neeko-btn-primary:active {
                transform: translateY(0) scale(0.98);
            }
            .neeko-btn-primary:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }

            .neeko-badge {
                display: inline-flex;
                align-items: center;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
            }
            .neeko-badge-error {
                background: #fef2f2;
                color: #dc2626;
            }
            .neeko-badge-warning {
                background: #fffbeb;
                color: #f59e0b;
            }
            .neeko-dropdown-menu {
                opacity: 0;
                transform: translateY(-8px) scale(0.98);
                pointer-events: none;
                visibility: hidden;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .neeko-dropdown-menu.active {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: auto;
                visibility: visible;
            }
        `;
        document.head.appendChild(style);
    }

    function createUI() {
        if (btnEl && panelEl) return;

        injectGlobalStyles();

        btnEl = document.createElement('button');
        btnEl.id = 'neeko-receive-check-btn';
        btnEl.innerHTML = '<span style="margin-right:6px">🔍</span>AIDP 标注工具';
        btnEl.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 2147483647;
            padding: 12px 20px;
            background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
            color: #fff;
            border: none;
            border-radius: 24px;
            cursor: grab;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(22, 119, 255, 0.35), 0 2px 8px rgba(0,0,0,0.1);
            user-select: none;
            touch-action: none;
            display: flex;
            align-items: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
        `;
        btnEl.disabled = true;
        btnEl.style.cursor = 'not-allowed';
        btnEl.style.opacity = '0.6';
        btnEl.style.filter = 'grayscale(0.3)';

        // Hover效果
        btnEl.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px) scale(1.02)';
                this.style.boxShadow = '0 12px 32px rgba(22, 119, 255, 0.45), 0 4px 12px rgba(0,0,0,0.15)';
            }
        });
        btnEl.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 8px 24px rgba(22, 119, 255, 0.35), 0 2px 8px rgba(0,0,0,0.1)';
            }
        });

        panelEl = document.createElement('div');
        panelEl.id = 'neeko-receive-panel';

        // 弹窗尺寸设置
        const savedSize = (() => {
            try {
                const saved = localStorage.getItem('neeko-panel-size');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.width && parsed.height) return parsed;
                }
            } catch (_) {}
            return { width: 800, height: 650 };
        })();

        panelEl.style.cssText = `
            position: fixed;
            z-index: 2147483646;
            width: ${savedSize.width}px;
            height: ${savedSize.height}px;
            max-width: min(92vw, 1000px);
            min-width: 600px;
            min-height: 450px;
            max-height: 90vh;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
            font-size: 13px;
            color: #1f2933;
            display: none;
            flex-direction: column;
            overflow: hidden;
            resize: both;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            animation: neeko-fadeIn 0.3s ease;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 16px 20px;
            background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
            color: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 16px 16px 0 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
        `;

        // 创建自定义 Dropdown
        const dropdownTrigger = document.createElement('div');
        dropdownTrigger.id = 'neeko-view-trigger';
        dropdownTrigger.innerHTML = `
            <span id="neeko-view-label" style="font-weight:700;font-size:15px;letter-spacing:0.3px">Chrome MCP 标注基础检测</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-left:6px;opacity:0.8"><polyline points="6 9 12 15 18 9"></polyline></svg>
        `;
        dropdownTrigger.style.cssText = `
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 6px 10px;
            border-radius: 8px;
            transition: background 0.2s ease;
            user-select: none;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
        `;
        dropdownTrigger.addEventListener('mouseenter', () => {
            dropdownTrigger.style.background = 'rgba(255,255,255,0.2)';
        });
        dropdownTrigger.addEventListener('mouseleave', () => {
            if (!dropdownMenu.classList.contains('active')) {
                dropdownTrigger.style.background = 'rgba(255,255,255,0.1)';
            }
        });

        const dropdownMenu = document.createElement('div');
        dropdownMenu.id = 'neeko-view-dropdown';
        dropdownMenu.className = 'neeko-dropdown-menu';
        dropdownMenu.style.cssText = `
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            padding: 6px;
            min-width: 260px;
            z-index: 100;
            border: 1px solid #e2e8f0;
            transform-origin: top left;
        `;

        const options = [
            { value: 'chrome_mcp', label: 'Chrome MCP 标注基础检测' },
            { value: 'aesthetic_01_02', label: '美观度01、02 标注基础检测' }
        ];

        let currentView = localStorage.getItem('neeko-view-select') || 'chrome_mcp';
        // 强制默认 mcp 如果没有值或者值不对（虽然上面 || 'chrome_mcp' 已经处理了默认，这里确保逻辑严密）
        if (!options.find(o => o.value === currentView)) {
            currentView = 'chrome_mcp';
        }

        const renderDropdownItems = () => {
            dropdownMenu.innerHTML = '';
            options.forEach(opt => {
                const item = document.createElement('div');
                const isSelected = opt.value === currentView;
                item.style.cssText = `
                    padding: 10px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    color: ${isSelected ? '#1677ff' : '#334155'};
                    background: ${isSelected ? '#eff6ff' : 'transparent'};
                    font-weight: ${isSelected ? '600' : '500'};
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                    margin-bottom: 2px;
                `;
                item.innerHTML = `
                    <span style="display:flex;align-items:center;justify-content:center;width:16px;height:16px;visibility:${isSelected ? 'visible' : 'hidden'}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                    <span>${opt.label}</span>
                `;
                
                item.addEventListener('mouseenter', () => {
                    if (!isSelected) item.style.background = '#f8fafc';
                });
                item.addEventListener('mouseleave', () => {
                    if (!isSelected) item.style.background = 'transparent';
                });

                item.addEventListener('click', () => {
                    updateViewSelection(opt.value);
                    dropdownMenu.classList.remove('active');
                });
                dropdownMenu.appendChild(item);
            });
        };

        const updateViewSelection = (val) => {
            currentView = val;
            const opt = options.find(o => o.value === val);
            if (opt) {
                title.querySelector('#neeko-view-label').textContent = opt.label;
            }
            localStorage.setItem('neeko-view-select', val);
            renderDropdownItems(); // Re-render to update selection style
            applyViewFilter(); // Trigger view update
        };

        // 初始设置 label
        const initialOpt = options.find(o => o.value === currentView);
        if (initialOpt) {
            dropdownTrigger.querySelector('#neeko-view-label').textContent = initialOpt.label;
        }

        // Toggle dropdown
        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = dropdownMenu.classList.contains('active');
            if (isActive) {
                dropdownMenu.classList.remove('active');
            } else {
                dropdownMenu.classList.add('active');
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!title.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });

        title.appendChild(dropdownTrigger);
        title.appendChild(dropdownMenu);

        const applyViewFilter = () => {
            const val = currentView;
            
            // 查找并控制 body 内的元素
            const body = panelEl.querySelector('#neeko-panel-body');
            if (!body) return;
            
            const mcpCard = body.querySelector('#neeko-mcp-stats-card');
            const screenshotCard = body.querySelector('#neeko-screenshot-card');
            const errorItem = body.querySelector('#neeko-platform-error-2');
            
            const displayStyle = val === 'chrome_mcp' ? '' : 'none';
            
            if (mcpCard) mcpCard.style.display = displayStyle;
            if (screenshotCard) screenshotCard.style.display = displayStyle;
            if (errorItem) errorItem.style.display = displayStyle;
        };

        // 暴露给外部或者挂载到 panelEl 上以便 renderPanel 调用
        panelEl._applyViewFilter = applyViewFilter;
        
        // Initial render items
        renderDropdownItems();

        const headerRight = document.createElement('div');
        headerRight.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const configBtn = document.createElement('span');
        configBtn.textContent = '⚙️ 设置';
        configBtn.style.cssText = `
            cursor: pointer;
            font-size: 12px;
            padding: 6px 12px;
            background: rgba(255,255,255,0.15);
            border-radius: 8px;
            transition: all 0.2s ease;
            border: 1px solid rgba(255,255,255,0.2);
            font-weight: 500;
        `;
        configBtn.addEventListener('mouseenter', () => {
            configBtn.style.background = 'rgba(255,255,255,0.25)';
            configBtn.style.transform = 'scale(1.05)';
        });
        configBtn.addEventListener('mouseleave', () => {
            configBtn.style.background = 'rgba(255,255,255,0.15)';
            configBtn.style.transform = 'scale(1)';
        });
        configBtn.onclick = () => {
            try {
                const curMs = localStorage.getItem('neeko_msToken') || '';
                const ms = prompt('输入 msToken（将保存为 neeko_msToken）', curMs || '');
                if (ms != null) localStorage.setItem('neeko_msToken', ms);
                const curAb = localStorage.getItem('neeko_aBogus') || '';
                const ab = prompt('输入 a_bogus（可留空，将保存为 neeko_aBogus）', curAb || '');
                if (ab != null) localStorage.setItem('neeko_aBogus', ab);
            } catch (_) {}
        };

        const copyBtn = document.createElement('span');
        copyBtn.textContent = '📋 复制';
        copyBtn.style.cssText = `
            cursor: pointer;
            font-size: 12px;
            padding: 6px 12px;
            background: rgba(255,255,255,0.15);
            border-radius: 8px;
            transition: all 0.2s ease;
            border: 1px solid rgba(255,255,255,0.2);
            font-weight: 500;
        `;
        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.background = 'rgba(255,255,255,0.25)';
            copyBtn.style.transform = 'scale(1.05)';
        });
        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.background = 'rgba(255,255,255,0.15)';
            copyBtn.style.transform = 'scale(1)';
        });
        copyBtn.onclick = async () => {
            try { if (typeof GM_setClipboard === 'function') GM_setClipboard(lastReportText); else await navigator.clipboard.writeText(lastReportText); } catch (_) {}
        };

        const closeBtn = document.createElement('span');
        const closeIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        closeBtn.innerHTML = closeIcon;
        closeBtn.style.cssText = `
            cursor: pointer;
            font-weight: 600;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.2s ease;
            background: rgba(255,255,255,0.1);
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.25)';
            closeBtn.style.transform = 'rotate(90deg)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.1)';
            closeBtn.style.transform = 'rotate(0deg)';
        });
        closeBtn.onclick = () => { panelEl.style.display = 'none'; };

        const refreshBtn = document.createElement('span');
        const refreshIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>';
        refreshBtn.innerHTML = `<span style="display:inline-flex;align-items:center;transition:transform 0.3s">${refreshIcon}</span> 刷新`;
        refreshBtn.style.cssText = `
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            padding: 6px 14px;
            background: rgba(255,255,255,0.2);
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        refreshBtn.addEventListener('mouseenter', () => {
            refreshBtn.style.background = 'rgba(255,255,255,0.35)';
            refreshBtn.style.transform = 'scale(1.05)';
            const icon = refreshBtn.querySelector('span');
            if (icon) icon.style.transform = 'rotate(180deg)';
        });
        refreshBtn.addEventListener('mouseleave', () => {
            refreshBtn.style.background = 'rgba(255,255,255,0.2)';
            refreshBtn.style.transform = 'scale(1)';
            const icon = refreshBtn.querySelector('span');
            if (icon) icon.style.transform = 'rotate(0deg)';
        });
        refreshBtn.onclick = async () => {
            if (isLoading) return;
            try {
                showLoading();
                const data = await fetchReceive({ refresh: true });
                currentData = data;
                const parsed = parseReceiveData(data);
                if (!parsed.agent_steps || parsed.agent_steps.length === 0) {
                    const body = panelEl.querySelector('#neeko-panel-body');
                    if (body) {
                        body.innerHTML = '<div style="padding:20px;text-align:center;color:#ef4444">' +
                            '<div style="font-size:14px;font-weight:600;margin-bottom:8px">⚠️ 数据解析失败</div>' +
                            '<div style="font-size:12px;color:#666">未找到有效的 agent_steps 数据。</div>' +
                            '</div>';
                        body.style.minHeight = '340px';
                    }
                    finishLoading();
                    return;
                }
                renderPanel(parsed);
            } catch (err) {
                finishLoading();
                const body = panelEl.querySelector('#neeko-panel-body');
                if (body) {
                    body.innerHTML = '<div style="padding:20px;text-align:center;color:#ef4444">' +
                        '<div style="font-size:14px;font-weight:600;margin-bottom:8px">❌ 刷新失败</div>' +
                        '<div style="font-size:12px;color:#666">' + escapeHtml(String(err)) + '</div>' +
                        '</div>';
                    body.style.minHeight = '340px';
                }
            }
        };
        refreshBtnEl = refreshBtn;

        headerRight.appendChild(refreshBtn);
        headerRight.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(headerRight);

        const body = document.createElement('div');
        body.id = 'neeko-panel-body';
        body.style.cssText = `
            padding: 20px;
            overflow: hidden;
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            color: #1f2933;
            background: #fafbfc;
        `;

        // 监听弹窗大小变化
        let resizeObserver = null;
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => {
                try {
                    const width = panelEl.offsetWidth;
                    const height = panelEl.offsetHeight;
                    localStorage.setItem('neeko-panel-size', JSON.stringify({ width, height }));
                } catch (_) {}
            });
            resizeObserver.observe(panelEl);
        }

        panelEl.appendChild(header);
        panelEl.appendChild(body);

        document.body.appendChild(btnEl);
        document.body.appendChild(panelEl);

        const storageKey = 'neeko-receive-btn-pos';
        const applySavedPos = () => {
            try {
                const raw = localStorage.getItem(storageKey);
                if (!raw) return;
                const pos = JSON.parse(raw);
                const maxLeft = window.innerWidth - 20;
                const maxTop = window.innerHeight - 20;
                if (typeof pos.left === 'number' && typeof pos.top === 'number' && pos.left >= 0 && pos.left < maxLeft && pos.top >= 0 && pos.top < maxTop) {
                    btnEl.style.left = pos.left + 'px';
                    btnEl.style.top = pos.top + 'px';
                    btnEl.style.right = 'auto';
                    btnEl.style.bottom = 'auto';
                }
            } catch (_) {}
        };
        applySavedPos();

        let dragging = false;
        let startX = 0, startY = 0, startLeft = 0, startTop = 0;
        let suppressNextClick = false;
        const onPointerMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let left = startLeft + dx;
            let top = startTop + dy;
            const maxLeft = window.innerWidth - btnEl.offsetWidth - 4;
            const maxTop = window.innerHeight - btnEl.offsetHeight - 4;
            if (left < 4) left = 4;
            if (top < 4) top = 4;
            if (left > maxLeft) left = maxLeft;
            if (top > maxTop) top = maxTop;
            btnEl.style.left = left + 'px';
            btnEl.style.top = top + 'px';
            btnEl.style.right = 'auto';
            btnEl.style.bottom = 'auto';
            syncPanelPositionWithButton();
        };
        const onPointerUp = (e) => {
            if (!dragging) return;
            dragging = false;
            btnEl.style.cursor = 'grab';
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            try {
                const left = parseFloat(btnEl.style.left) || 0;
                const top = parseFloat(btnEl.style.top) || 0;
                localStorage.setItem(storageKey, JSON.stringify({ left, top }));
            } catch (_) {}
            const moved = Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY);
            if (moved > 5) suppressNextClick = true;
        };
        const onPointerDown = (e) => {
            const rect = btnEl.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            startX = e.clientX;
            startY = e.clientY;
            btnEl.style.cursor = 'grabbing';
            dragging = true;
            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
        };
        btnEl.addEventListener('pointerdown', onPointerDown);

        btnEl.addEventListener('click', async function() {
            if (suppressNextClick) { suppressNextClick = false; return; }
            if (btnEl.disabled || isLoading) {
                showToast('正在加载数据，请稍候...', 1500);
                return;
            }
            if (panelEl.style.display === 'flex') {
                panelEl.style.display = 'none';
                showToast('面板已关闭', 1000);
                return;
            }
            showLoading();
            showToast('正在获取数据...', 1500);
            try {
                const data = await fetchReceive({ refresh: true });
                currentData = data;
                const parsed = parseReceiveData(data);
                if (!parsed.agent_steps || parsed.agent_steps.length === 0) {
                    const body = panelEl.querySelector('#neeko-panel-body');
                    if (body) {
                        body.innerHTML = '<div style="padding:20px;text-align:center;color:#ef4444">' +
                            '<div style="font-size:14px;font-weight:600;margin-bottom:8px">⚠️ 数据解析失败</div>' +
                            '<div style="font-size:12px;color:#666">未找到有效的 agent_steps 数据，请确认当前页面已加载完整的标注数据。</div>' +
                            '</div>';
                        body.style.minHeight = '340px';
                    }
                    finishLoading();
                    return;
                }
                renderPanel(parsed);
            } catch (err) {
                finishLoading();
                const body = panelEl.querySelector('#neeko-panel-body');
                if (body) {
                    body.innerHTML = '<div style="padding:20px;text-align:center;color:#ef4444">' +
                        '<div style="font-size:14px;font-weight:600;margin-bottom:8px">❌ 加载失败</div>' +
                        '<div style="font-size:12px;color:#666;margin-bottom:12px">无法获取 Receive 接口数据，请检查网络连接或刷新页面重试。</div>' +
                        '<div style="font-size:11px;color:#999;font-family:monospace;background:#f9fafb;padding:8px;border-radius:4px;text-align:left">' +
                        escapeHtml(String(err)) +
                        '</div>' +
                        '</div>';
                    body.style.minHeight = '340px';
                }
            }
        });

        btnEl.addEventListener('dblclick', function (e) {
            e.stopPropagation();
            if (!panelEl) return;
            panelEl.style.display = (panelEl.style.display === 'none' || panelEl.style.display === '') ? 'flex' : 'none';
            syncPanelPositionWithButton();
        });
    }

    function ensureButtonPresence() {
        try {
            const present = document.getElementById('neeko-receive-check-btn');
            if (!present) {
                createUI();
            }
        } catch (_) {}
    }

    function syncPanelPositionWithButton() {
        if (!btnEl || !panelEl || panelEl.style.display === 'none') return;
        const rect = btnEl.getBoundingClientRect();
        const desiredLeft = Math.min(rect.left, window.innerWidth - panelEl.offsetWidth - 8);
        const desiredTop = Math.max(8, rect.top - panelEl.offsetHeight - 8);
        panelEl.style.left = desiredLeft + 'px';
        panelEl.style.top = desiredTop + 'px';
        panelEl.style.right = 'auto';
        panelEl.style.bottom = 'auto';
    }

    function init() {
        hookNetworkCapture();
        createUI();
        // 监听Receive接口数据，数据加载后启用按钮
        const checkDataAndEnableButton = () => {
            if (latestReceiveData || localStorage.getItem('neeko_latest_receive')) {
                if (btnEl) {
                    btnEl.disabled = false;
                    btnEl.style.cursor = 'grab';
                    btnEl.style.opacity = '1';
                }
            } else {
                // 延迟检查
                setTimeout(checkDataAndEnableButton, 1000);
            }
        };
        checkDataAndEnableButton();
        try {
            setInterval(ensureButtonPresence, 3000);
        } catch (_) {}
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

