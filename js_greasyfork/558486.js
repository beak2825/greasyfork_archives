// ==UserScript==
// @name         自动答题助手（采集+AI+自动答题 一体版）
// @license MIT
// @namespace    https://examtx.chinaedu.net/
// @version      1.0.0
// @description  专门为nwujxjy.sccchina.net(西北大学 继续教育学院设计)调用智谱 AI 生成答案，缓存后一键自动答题（支持单选、多选、判断）
// @match        https://examtx.chinaedu.net/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      open.bigmodel.cn
// @downloadURL https://update.greasyfork.org/scripts/558486/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%EF%BC%88%E9%87%87%E9%9B%86%2BAI%2B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%20%E4%B8%80%E4%BD%93%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558486/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%EF%BC%88%E9%87%87%E9%9B%86%2BAI%2B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%20%E4%B8%80%E4%BD%93%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /**************  请在这里填入你的 ZhipuAI API Key  **************/
    const ZHIPU_API_KEY = "填你自己的API"; // 例如： "98d6....."
    const ZHIPU_MODEL   = "glm-4"; // 模型名，可按自己账号情况调整

    // 本地缓存键名
    const KEY_SOURCE   = "examtx_source";   // 原始题库
    const KEY_ANSWERED = "examtx_answered"; // 带答案题库

    // 全局 AI 进度状态
    window.examtxAI = {
        total: 0,
        done: 0,
        results: []
    };

    /*********************  入口：等待页面加载完毕  *********************/
    function waitReady() {
        const timer = setInterval(() => {
            // 题目区域出现就算加载完
            const anyQuestion = document.querySelector("dl.questionItem");
            if (anyQuestion) {
                clearInterval(timer);
                createUI(); // 创建悬浮窗
            }
        }, 500);
    }

    /*********************  悬浮窗 UI  *********************/
    function createUI() {
        // 主容器
        const box = document.createElement("div");
        box.id = "examtx-box";
        box.style.cssText = `
            position: fixed;
            left: 20px;
            top: 60px;
            width: 260px;
            background: #111;
            color: #fff;
            z-index: 999999;
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0,0,0,.35);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            user-select: none;
        `;

        // 标题栏（可拖动）
        const header = document.createElement("div");
        header.style.cssText = `
            padding: 8px 10px;
            background: #222;
            border-radius: 10px 10px 0 0;
            cursor: move;
            display: flex;
            align-items: center;
            font-size: 14px;
        `;
        header.innerHTML = `
            <span style="width:9px;height:9px;border-radius:50%;background:#09f;margin-right:6px;"></span>
            <span><b>examtx</b> 自动答题助手</span>
        `;
        box.appendChild(header);

        // 内容区域
        const content = document.createElement("div");
        content.style.cssText = `
            padding: 8px 10px 10px;
        `;

        // 按钮：导出并缓存题库（立即AI处理）
        const btnExport = document.createElement("button");
        btnExport.id = "btnExport";
        btnExport.textContent = "📘 导出并缓存题库（立即AI处理）";
        btnExport.style.cssText = buttonStyle("#1abc9c");
        content.appendChild(btnExport);

        // 按钮：自动答题
        const btnAuto = document.createElement("button");
        btnAuto.id = "btnAuto";
        btnAuto.textContent = "📝 自动答题（无需上传）";
        btnAuto.style.cssText = buttonStyle("#3498db");
        content.appendChild(btnAuto);

        // 进度条
        const progress = document.createElement("div");
        progress.id = "examtx-progress";
        progress.style.cssText = `
            margin-top: 6px;
            padding: 6px 8px;
            background: rgba(0,0,0,.45);
            border-radius: 6px;
            font-size: 13px;
        `;
        progress.textContent = "AI 进度：0 / 0（0%）";
        content.appendChild(progress);

        box.appendChild(content);
        document.body.appendChild(box);

        // 绑定按钮事件
        btnExport.onclick = onExportAndAI;
        btnAuto.onclick   = onAutoAnswer;

        // 启用拖动
        enableDrag(box, header);
    }

    function buttonStyle(color) {
        return `
            width: 100%;
            margin-top: 6px;
            padding: 8px 10px;
            background: ${color};
            border: none;
            border-radius: 6px;
            color: #fff;
            font-size: 13px;
            cursor: pointer;
            text-align: center;
        `;
    }

    /*********************  拖动逻辑  *********************/
    function enableDrag(box, handle) {
        let offsetX = 0, offsetY = 0, dragging = false;

        handle.addEventListener("mousedown", e => {
            dragging = true;
            offsetX = e.clientX - box.offsetLeft;
            offsetY = e.clientY - box.offsetTop;
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        });

        function move(e) {
            if (!dragging) return;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            x = Math.max(0, Math.min(window.innerWidth - box.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - box.offsetHeight, y));
            box.style.left = x + "px";
            box.style.top  = y + "px";
        }

        function up() {
            dragging = false;
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", up);
        }
    }

    /*********************  按钮：导出并 AI 生成答案  *********************/
    async function onExportAndAI() {
        if (!ZHIPU_API_KEY || ZHIPU_API_KEY.includes("在这里")) {
            alert("❗ 请先在脚本顶部填写你的 ZhipuAI API Key 再使用。");
            return;
        }

        // 清空旧缓存
        localStorage.removeItem(KEY_SOURCE);
        localStorage.removeItem(KEY_ANSWERED);
        window.examtxAI = { total: 0, done: 0, results: [] };
        updateProgressUI();

        const questions = collectQuestions();
        if (!questions.length) {
            alert("未在页面上找到题目，请确认已进入答题页面。");
            return;
        }

        localStorage.setItem(KEY_SOURCE, JSON.stringify(questions));
        // alert("题库采集成功，共 " + questions.length + " 题，将开始调用 AI 生成答案。");

        await startAIGeneration(questions);

        // 全部处理完毕后，保存 & 下载
        const sorted = (window.examtxAI.results || []).slice().sort((a, b) => a.id - b.id);
        localStorage.setItem(KEY_ANSWERED, JSON.stringify(sorted));

        try {
            GM_download({
                url: "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sorted, null, 2)),
                name: "examtx_题库_带答案.json"
            });
        } catch (e) {
            console.log("GM_download 失败，可忽略：", e);
        }

        // alert("🎉 AI 已全部生成完毕！题库和答案已缓存，可点击『自动答题』使用。");
    }

    /*********************  按钮：自动答题（使用缓存的答案）  *********************/
    function onAutoAnswer() {
        const text = localStorage.getItem(KEY_ANSWERED);
        if (!text) {
            alert("还没有缓存的带答案题库，请先点击『导出并缓存题库（立即AI处理）』。");
            return;
        }
        let db;
        try {
            db = JSON.parse(text);
        } catch (e) {
            alert("解析本地缓存失败，请重新导出一次题库。");
            return;
        }

        autoAnswer(db);
    }

    /*********************  采集题库（单选、多选、判断）  *********************/
    function collectQuestions() {
        const result = [];
        let currentCategory = "未分类";

        // 大题标题：例如「一、单选题」「二、多选题」「三、判断题」
        const titles = document.querySelectorAll("span.f18.c_2d4.fb");

        titles.forEach(titleNode => {
            currentCategory = titleNode.innerText.trim();
            const section = titleNode.closest("div.test-part") || titleNode.parentElement.parentElement;

            if (!section) return;

            // 所有 questionItem（单选、多选、判断在不同容器里，但 class 中一般都有 questionItem）
            const items = section.querySelectorAll("dl.questionItem");

            items.forEach((item) => {
                // 题干
                const titleText = getTitleFromDL(item);

                if (!titleText) return;

                // 猜题目类型
                let qType = "single";
                if (/多选题/.test(currentCategory)) qType = "multi";
                if (/判断题/.test(currentCategory) ||
                    /判断/.test(currentCategory) ||
                    /判断题/.test(item.className)) {
                    qType = "judge";
                }

                let options = [];

                if (qType === "judge") {
                    // 判断题选项一般就是 正确 / 错误
                    options = ["正确", "错误"];
                } else {
                    item.querySelectorAll("dd").forEach(dd => {
                        const txt = dd.innerText.replace(/\s+/g, " ").trim();
                        if (txt) options.push(txt);
                    });
                }

                result.push({
                    id: result.length + 1,
                    category: currentCategory,
                    type: qType,
                    question: titleText,
                    options: options
                });
            });
        });

        return result;
    }

    // 从 dl.questionItem 中抽取题干文本（适配 examtx 结构）
    function getTitleFromDL(dl) {
        // 单选多选等
        const dt = dl.querySelector("dt.queStemC") || dl.querySelector("dt");
        if (!dt) return "";

        const dins = dt.querySelectorAll("div.din");
        if (dins.length >= 2) {
            // 一般第二个 din 才是真正题干
            return dins[1].innerText.trim();
        } else {
            return dt.innerText.trim();
        }
    }

    /*********************  AI 并发生成答案  *********************/
    async function startAIGeneration(questions) {
        window.examtxAI.total = questions.length;
        window.examtxAI.done = 0;
        window.examtxAI.results = [];
        updateProgressUI();

        const concurrency = 3; // 并发数
        let pool = [];
        let idx = 0;

        async function runTask(q) {
            const res = await generateAnswerForOne(q);
            if (res) {
                window.examtxAI.results.push(res);
            }
            window.examtxAI.done++;
            updateProgressUI();
        }

        while (idx < questions.length) {
            while (pool.length < concurrency && idx < questions.length) {
                const p = runTask(questions[idx]);
                pool.push(p);
                // 完成后把自己从池子里移除
                p.finally(() => {
                    pool = pool.filter(x => x !== p);
                });
                idx++;
            }
            await Promise.race(pool);
        }

        await Promise.all(pool);
    }

    // 更新进度显示
    function updateProgressUI() {
        const bar = document.getElementById("examtx-progress");
        if (!bar) return;
        const done = window.examtxAI.done || 0;
        const total = window.examtxAI.total || 1;
        const percent = ((done / total) * 100).toFixed(1);
        bar.innerText = `AI 进度：${done} / ${total}（${percent}%）`;
    }

    /*********************  单题调用 AI 生成答案  *********************/
    async function generateAnswerForOne(q) {
        const { id, category, question, options, type } = q;

        // 构建 prompt
        let prompt = "";
        if (type === "judge") {
            prompt += "请帮我回答这道判断题，只需要返回“正确”或“错误”，不要添加任何其它文字或解释。\n\n";
            prompt += `题目：${question}\n`;
        } else if (type === "multi") {
            prompt += "请帮我回答这道多选题，只需要返回所有正确选项的字母（例如：A,B,C），不要添加任何解释。\n\n";
            prompt += `题目：${question}\n\n选项：\n`;
            options.forEach(opt => prompt += opt + "\n");
        } else {
            prompt += "请帮我回答这道单选题，只需要返回一个选项字母（例如：A），不要添加任何解释。\n\n";
            prompt += `题目：${question}\n\n选项：\n`;
            options.forEach(opt => prompt += opt + "\n");
        }

        let answer = "";
        try {
            const raw = await callZhipuAI(prompt);
            if (!raw) return null;
            let txt = raw.trim();
            console.log(`第${id}题 AI 原始返回：`, txt);

            if (type === "judge") {
                if (/正确|对|T|true|是/.test(txt)) {
                    answer = "正确";
                } else if (/错误|错|F|false|否/.test(txt)) {
                    answer = "错误";
                } else {
                    answer = "";
                }
            } else {
                // 抽取 A/B/C/D 字母
                const letters = [];
                for (const ch of txt) {
                    if (/[A-D]/.test(ch) && !letters.includes(ch)) {
                        letters.push(ch);
                    }
                }
                if (type === "multi") {
                    answer = letters.join(",");
                } else {
                    answer = letters[0] || "";
                }
            }

            console.log(`第${id}题 最终解析答案：`, answer);

            return {
                id,
                category,
                question,
                options,
                type,
                answer
            };
        } catch (e) {
            console.error(`生成第${id}题答案失败：`, e);
            return {
                id,
                category,
                question,
                options,
                type,
                answer: "",
                error: String(e)
            };
        }
    }

    /*********************  调用 ZhipuAI HTTP 接口  *********************/
    function callZhipuAI(prompt) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + ZHIPU_API_KEY
                },
                data: JSON.stringify({
                    model: ZHIPU_MODEL,
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.1
                }),
                onload: function (res) {
                    try {
                        const json = JSON.parse(res.responseText);
                        const content = json.choices?.[0]?.message?.content || "";
                        resolve(content);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (err) {
                    reject(err);
                },
                timeout: 60000
            });
        });
    }

    /*********************  自动答题（使用本地答案 DB）  *********************/
    function autoAnswer(db) {
        if (!Array.isArray(db) || !db.length) {
            alert("本地题库为空，请先重新导出。");
            return;
        }

        const list = document.querySelectorAll("dl.questionItem");

        list.forEach(dl => {
            const title = getTitleFromDL(dl);
            const cleanTitle = cleanQuestion(title);

            if (!cleanTitle) return;

            // 完全匹配
            let match = db.find(item => cleanQuestion(item.question) === cleanTitle);

            // 安全模糊匹配
            if (!match) {
                match = db.find(item => {
                    const cq = cleanQuestion(item.question);
                    return cq && cleanTitle.includes(cq) && cq.length >= 6;
                });
            }

            if (!match || !match.answer) return;

            if (match.type === "judge") {
                answerJudge(dl, match.answer);
            } else {
                answerChoice(dl, match.answer);
            }
        });

        //  alert("自动答题完成（已根据本地 AI 答案进行选择）！");
    }

    // 多选 + 单选
    function answerChoice(dl, answerStr) {
        const answers = String(answerStr).split(",").map(s => s.trim()).filter(Boolean);
        if (!answers.length) return;

        const options = dl.querySelectorAll("dd.clearfix, dd.clearfix.cur");
        options.forEach(dd => {
            const span = dd.querySelector("span.duplexCheck, span.singleCheck, span.xuan");
            if (!span) return;
            const raw = span.innerText.trim();
            const letter = (raw.match(/[A-D]/) || [])[0];
            if (!letter) return;

            if (answers.includes(letter)) {
                if (!dd.classList.contains("cur")) {
                    dd.click(); // 调用页面原本的事件
                }
            }
        });
    }

    // 判断题：点击“正确 / 错误”按钮
    function answerJudge(dl, answer) {
        const target = /正确/.test(answer) ? "正确" : "错误";
        const btns = dl.querySelectorAll("input[type='button'][value='正确'], input[type='button'][value='错误']");
        if (!btns.length) return;

        const btn = Array.from(btns).find(b => b.value === target);
        if (btn) btn.click();
    }

    /*********************  工具：清洗题干  *********************/
    function cleanQuestion(t) {
        return (t || "")
            .replace(/\s+/g, "")
            .replace(/[。，“”、：:；;（）()【】\[\]]/g, "")
            .replace(/^下列|的是?|指出|下列诗句中出自?|以下说法/g, "")
            .trim();
    }

    /*********************  启动  *********************/
    waitReady();

})();
