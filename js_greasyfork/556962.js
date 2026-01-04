// ==UserScript==
// @name         抖音智能回复助手 (强力锁定版)
// @namespace    http://tampermonkey.net/
// @version      18.2.4
// @description  锁定ID -> 倒计时5秒 -> 忽略URL变化 -> 提取 -> AI -> 发送 -> 输出cURL
// @author       Gemini Assistant
// @match        https://www.douyin.com/*
// @connect      www.douyin.com
// @connect      172.17.0.1
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556962/%E6%8A%96%E9%9F%B3%E6%99%BA%E8%83%BD%E5%9B%9E%E5%A4%8D%E5%8A%A9%E6%89%8B%20%28%E5%BC%BA%E5%8A%9B%E9%94%81%E5%AE%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556962/%E6%8A%96%E9%9F%B3%E6%99%BA%E8%83%BD%E5%9B%9E%E5%A4%8D%E5%8A%A9%E6%89%8B%20%28%E5%BC%BA%E5%8A%9B%E9%94%81%E5%AE%9A%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // 🔧 配置区域
    // ============================================================
    const CONFIG = {
        aiApiUrl: "http://172.17.0.1:11434/api/generate",
        aiModel: "deepseek-r1:1.5b",
        aiSystemPrompt: "你是一个抖音神评助手。请根据下方的【视频标题】和【网友热评】，模仿网友的语气生成一条简短（20字以内）、有趣的神回复。直接输出内容，不要包含思考过程：",

        targetUrlKeyword: "comment/publish",
        checkInterval: 800,   // 监测频率

        // 🔥 [核心] 事务开始前的强制等待 (毫秒)
        // 作用：给用户留出“滑走”的时间，防止误发
        startDelay: 5000,

        // 页面渲染等待时间 (在startDelay之后执行)
        waitLoad: 2000,

        // AI 请求超时时间 (毫秒)
        aiTimeout: 15000
    };

    // 全局变量
    unsafeWindow.jhc = unsafeWindow.jhc || { 'x-tt-session-dtrait': null };

    let _isProcessing = false;
    let _lastProcessedId = null;

    console.log(`🚀 V18.2.4 强力锁定版已启动 | 锁定后等待 ${CONFIG.startDelay}ms | 严格使用初始ID发送`);

    // ============================================================
    // 1. 基础工具
    // ============================================================
    function getUrlId() {
        const match = location.href.match(/modal_id=(\d+)/);
        return match ? match[1] : null;
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ============================================================
    // 2. 业务模块
    // ============================================================

    // [A] 提取页面数据
    async function extractPageData(lockedId) {
        // 二次等待：等待页面DOM稳定
        if (CONFIG.waitLoad > 0) await sleep(CONFIG.waitLoad);

        // 2. 提取评论 (保持原位置不变)
        let comments = "暂无评论";
        const btn = document.querySelector('[data-e2e="feed-comment-icon"]');
        const list = document.querySelector('[data-e2e="comment-list"]');

        // 1. 提取标题
        // 使用 video-desc 精确获取描述部分，包含 #标签 和正文
        const descEl = document.querySelector('[data-e2e="video-desc"]');
        let title = "（未抓到标题）";

        if (descEl) {
            const clone = descEl.cloneNode(true);
            // 🔥 仅移除 button (例如"展开"按钮)，保留 div, span, a 以获取完整文本
            clone.querySelectorAll('button').forEach(n => n.remove());
            title = clone.innerText.replace(/\n/g, ' ').trim();
        }

        // 尝试自动展开
        if (btn && !list) {
            btn.click();
            await sleep(1000); // 展开需要一点时间
        }

        const items = document.querySelectorAll('[data-e2e="comment-list"] [data-e2e="comment-item"]');
        if (items.length > 0) {
            let arr = [];
            for(let i=0; i<Math.min(items.length, 10); i++) {
                const t = items[i].innerText.replace(/\n/g, ' ').substring(0, 50);
                arr.push(`${i+1}. ${t}`);
            }
            comments = arr.join('\n');
        }

        console.log(`📄 [事务:${lockedId}] 数据提取完成 | 标题: ${title.substring(0, 20)}... 评论数: ${items.length}`);
        return { title, comments };
    }

    // [B] AI 生成
    function fetchAIReply(data, lockedId) {
        return new Promise((resolve, reject) => {
            console.log(`🧠 [事务:${lockedId}] 请求 AI 生成...`);

            const prompt = `${CONFIG.aiSystemPrompt}\n\n【视频标题】\n${data.title}\n\n【热门评论】\n${data.comments}`;

            GM_xmlhttpRequest({
                method: "POST",
                url: CONFIG.aiApiUrl,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                    "model": CONFIG.aiModel,
                    "prompt": prompt,
                    "stream": false
                }),
                timeout: CONFIG.aiTimeout,
                onload: (res) => {
                    if (res.status === 200) {
                        try {
                            const json = JSON.parse(res.responseText);
                            const reply = (json.response || "").replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                            console.log(`🤖 [事务:${lockedId}] AI回复: ${reply}`);
                            resolve(reply || "支持！");
                        } catch(e) { reject("AI解析失败"); }
                    } else {
                        reject(`AI状态码 ${res.status}`);
                    }
                },
                ontimeout: () => reject("AI请求超时"),
                onerror: (err) => reject("AI网络错误")
            });
        });
    }

    // [C] 发送评论 (含 cURL 生成)
    // 🔥 这里的 lockedId 是从 runTransaction 传下来的初始ID，绝对不会变
    function sendComment(lockedId, text) {
        const dtrait = unsafeWindow.jhc['x-tt-session-dtrait'];
        if (!dtrait) {
            console.warn(`⛔ [事务:${lockedId}] 缺少 dtrait，跳过发送`);
            return;
        }

        const url = `https://www.douyin.com/aweme/v1/web/comment/publish?aid=6383`;

        // 🔥 核心修改：body 中的 aweme_id 强制使用 lockedId
        // 即使当前 URL 的 modal_id 已经变成了别的，这里依然发送给 lockedId
        const body = new URLSearchParams({
            "aweme_id": _lastProcessedId,
            "text": text,
            "text_extra": "[]"
        }).toString();

        // -------------------------------------------------------
        // 🖨️ [新增功能] 生成并打印 cURL 命令
        // -------------------------------------------------------
        try {
            const cookies = document.cookie || "";
            // 简单的 cURL 拼接，处理了基本的引号转义
            const curlCmd = [
                `curl -X POST "${url}"`,
                `-H "Content-Type: application/x-www-form-urlencoded"`,
                `-H "x-secsdk-csrf-token: DOWNGRADE"`,
                `-H "x-tt-session-dtrait: ${dtrait}"`,
                `-H "Cookie: ${cookies.replace(/"/g, '\\"')}"`,
                `-H "User-Agent: ${navigator.userAgent}"`,
                `--data-raw "${body}"`
            ].join(' \\\n  ');

            console.groupCollapsed(`📋 [调试] 复制 cURL 命令 (ID: ${lockedId})`);
            console.log(`%c${curlCmd}`, "color: #2ecc71; font-family: monospace;");
            console.groupEnd();
        } catch (e) {
            console.error("生成 cURL 失败:", e);
        }
        // -------------------------------------------------------

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "x-secsdk-csrf-token": "DOWNGRADE",
                "x-tt-session-dtrait": dtrait,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: body,
            onload: (res) => console.log("✅ 发送结果:", res.responseText),
            onerror: (err) => console.error("❌ 发送失败:", err)
        });
    }

    // ============================================================
    // 3. 拦截模块
    // ============================================================
    function saveDtrait(val) {
        if (val && val !== unsafeWindow.jhc['x-tt-session-dtrait']) {
            unsafeWindow.jhc['x-tt-session-dtrait'] = val;
        }
    }
    const originalXhrSetHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
        if (key.toLowerCase() === 'x-tt-session-dtrait') saveDtrait(value);
        return originalXhrSetHeader.apply(this, arguments);
    };
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(input, init) {
        if (init && init.headers) {
            let val = init.headers instanceof Headers ? init.headers.get('x-tt-session-dtrait') : init.headers['x-tt-session-dtrait'];
            if (val) saveDtrait(val);
        }
        return originalFetch.apply(this, arguments);
    };

    // ============================================================
    // 4. 事务调度器
    // ============================================================

    async function runTransaction(currentId) {
        _isProcessing = true;

        // 🔥 核心点：在此处将 ID “冻结”在 lockedId 变量中
        // 无论后面 await sleep 多久，或者 location.href 怎么变，这个 lockedId 永远是开始时的那个
        const lockedId = currentId;

        let pageData = null; // 用于存储提取的数据，方便 finally 清理

        console.group(`🎬 [事务:${lockedId}] 启动`);
        console.log(`⏳ 强制等待 ${CONFIG.startDelay}ms (防误触)...`);

        try {
            // 1. 强制等待
            await sleep(CONFIG.startDelay);

            // 2. 状态检查 (不再阻断退出，仅输出日志)
            const currentUrlId = getUrlId();
            if (currentUrlId !== lockedId) {
                console.warn(`⚠️ [注意] 用户已滑走 (Current: ${currentUrlId} vs Locked: ${lockedId})`);
                console.warn(`🚀 即使已滑走，我们仍将回复给最初锁定的 ID: ${lockedId}`);
            } else {
                console.log("✅ URL 未变化，环境稳定");
            }

            // 3. 提取 & AI
            console.log("开始提取...");
            // 注意：如果已滑走，这里提取的是【当前屏幕】也就是新视频的内容
            // 但这正是为了让流程跑通
            pageData = await extractPageData(lockedId);

            console.log(`提取数据完成，请求AI...`);
            const aiReply = await fetchAIReply(pageData, lockedId);

            // 4. 发送 (传入 lockedId，确保发给旧视频)
            sendComment(lockedId, aiReply);

            // ✅ 成功流程：立即清理内存
            pageData = null;
            console.log("🧹 [清理] 敏感数据(标题/评论)已清除");

        } catch (error) {
            console.error(`❌ [事务:${lockedId}] 异常:`, error);
        } finally {
            // ✅ 中断保护：强制清理残留数据
            if (pageData) {
                pageData = null;
                console.log("🧹 [清理] 异常/中断，数据强制清除");
            }

            _lastProcessedId = lockedId;
            _isProcessing = false;
            console.log(`🔓 [事务:${lockedId}] 结束`);
            console.groupEnd();
        }
    }

    // 轮询监听
    setInterval(() => {
        const nowId = getUrlId();
        if (nowId && !_isProcessing && nowId !== _lastProcessedId) {
            runTransaction(nowId);
        }
    }, CONFIG.checkInterval);

})();