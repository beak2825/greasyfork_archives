// ==UserScript==
// @name         Google 图片关键词审核工具
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  修复了Google原生搜索框消失的问题。新增任务进行时自动锁定搜索框功能，防止误操作。
// @author       helloshisheng
// @match        *://*.google.com/search*tbm=isch*
// @match        *://*.google.com/search*udm=2*
// @match        *://images.google.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/553844/Google%20%E5%9B%BE%E7%89%87%E5%85%B3%E9%94%AE%E8%AF%8D%E5%AE%A1%E6%A0%B8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/553844/Google%20%E5%9B%BE%E7%89%87%E5%85%B3%E9%94%AE%E8%AF%8D%E5%AE%A1%E6%A0%B8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function () {
    'use strict';

    /**
     * 状态变量 (State variables)
     * - allKeywords: 从上传文件解析得到的原始关键词数组（按文件中顺序保留）
     * - keptKeywords: 用户标记为“保留”的关键词集合（用于导出/统计）
     * - deletedKeywords: 用户标记为“删除”的关键词集合（用于导出/统计）
     * - currentIndex: 当前正在审核的关键词在 allKeywords 中的索引，-1 表示尚未开始
     * - isMinimized: 面板是否被最小化（UI 状态，用于恢复时保持面板状态）
     */
    let allKeywords = [];
    let keptKeywords = [];
    let deletedKeywords = [];
    let currentIndex = -1;
    let isMinimized = false;

    /**
     * UI 元素引用（在 createUI 时创建）
     * - panel: 侧边/悬浮的控制面板 DOM 节点
     * - ball: 屏幕右上角的小悬浮球（快速显示进度/切换最小化）
     */
    let panel, ball;

    /**
     * 从上传的文件数据智能解析关键词列表
     * (Smart parse keywords from uploaded spreadsheet/CSV data)
     *
     * 功能：
     * - 尝试在第一张表中查找表头为 "Keyword" 的列（不区分大小写），并从该列的下一行开始读取数据；
     * - 如果找不到表头，会回退到以第一列为关键词列的策略，并跳过空白行；
     * - 忽略空值，确保返回的数组仅包含非空字符串关键词；
     *
     * 参数：
     * @param {ArrayBuffer} data - FileReader.readAsArrayBuffer 读取到的文件二进制数据，支持 xlsx/csv 等（由 xlsx 库解析）
     *
     * 返回值：
     * @returns {string[]} 解析得到的关键词数组（按文件顺序）
     *
     * 错误/边界：
     * - 若未解析出任何有效关键词，会抛出 Error，调用方应捕获并提示用户；
     */
    function parseKeywordsSmartly(data) {
        const workbook = XLSX.read(data, {
            type: "array"
        });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: ""
        });
        let keywordColIndex = -1;
        let dataStartIndex = -1;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row || !Array.isArray(row)) continue;
            const foundIndex = row.findIndex(header => typeof header === "string" && header.trim().toLowerCase() === "keyword");
            if (foundIndex !== -1) {
                keywordColIndex = foundIndex;
                dataStartIndex = i + 1;
                break
            }
        }
        if (keywordColIndex === -1) {
            console.warn("找不到 'Keyword' 列, 将默认读取第一列。");
            dataStartIndex = 0;
            while (rows[dataStartIndex] && (!rows[dataStartIndex][0] || rows[dataStartIndex][0].trim() === "")) {
                dataStartIndex++
            }
            keywordColIndex = 0
        }
        const keywords = rows.slice(dataStartIndex).map(row => row ? row[keywordColIndex] : "").filter(kw => kw && typeof kw === "string" && kw.trim() !== "");
        if (keywords.length === 0) {
            throw new Error("未能从文件中解析出任何有效的关键词。请检查文件格式和内容。")
        }
        return keywords
    }

    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                allKeywords = parseKeywordsSmartly(event.target.result);
                startReview()
            } catch (error) {
                alert("解析文件失败: " + error.message);
                console.error(error)
            }
        };
        reader.readAsArrayBuffer(file)
    }

    function startReview() {
        currentIndex = 0;
        keptKeywords = [...allKeywords];
        deletedKeywords = [];
        isMinimized = false;
        saveState();
        searchForCurrentKeyword()
    }

    function loadState() {
        allKeywords = JSON.parse(GM_getValue("reviewer_allKeywords", "[]"));
        keptKeywords = JSON.parse(GM_getValue("reviewer_keptKeywords", "[]"));
        deletedKeywords = JSON.parse(GM_getValue("reviewer_deletedKeywords", "[]"));
        currentIndex = parseInt(GM_getValue("reviewer_currentIndex", "-1"), 10);
        isMinimized = JSON.parse(GM_getValue("reviewer_isMinimized", "false"));
        if (allKeywords.length > 0 && currentIndex > -1) {
            console.log("检测到正在进行的任务，已加载状态。")
        }
        updateUI()
    }

    function saveState() {
        GM_setValue("reviewer_allKeywords", JSON.stringify(allKeywords));
        GM_setValue("reviewer_keptKeywords", JSON.stringify(keptKeywords));
        GM_setValue("reviewer_deletedKeywords", JSON.stringify(deletedKeywords));
        GM_setValue("reviewer_currentIndex", currentIndex.toString());
        GM_setValue("reviewer_isMinimized", JSON.stringify(isMinimized))
    }

    function resetState() {
        if (confirm("确定要开始新的任务吗？这将清除所有当前进度。")) {
            GM_deleteValue("reviewer_allKeywords");
            GM_deleteValue("reviewer_keptKeywords");
            GM_deleteValue("reviewer_deletedKeywords");
            GM_deleteValue("reviewer_currentIndex");
            GM_deleteValue("reviewer_isMinimized");
            window.location.href = "https://images.google.com/"
        }
    }

    function searchForCurrentKeyword() {
        if (currentIndex < 0 || currentIndex >= allKeywords.length) return;
        const keyword = allKeywords[currentIndex];
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&udm=2`
    }

    function performKeepAndNext() {
        if (currentIndex < 0 || currentIndex >= allKeywords.length) return;
        const keyword = allKeywords[currentIndex];
        if (!keptKeywords.includes(keyword)) keptKeywords.push(keyword);
        const delIdx = deletedKeywords.indexOf(keyword);
        if (delIdx > -1) deletedKeywords.splice(delIdx, 1);
        if (currentIndex < allKeywords.length - 1) {
            currentIndex++;
            saveState();
            searchForCurrentKeyword()
        } else {
            alert("已是最后一个关键词。");
            saveState();
            updateUI()
        }
    }

    function performDeleteAndNext() {
        if (currentIndex < 0 || currentIndex >= allKeywords.length) return;
        const keyword = allKeywords[currentIndex];
        if (!deletedKeywords.includes(keyword)) deletedKeywords.push(keyword);
        const keepIdx = keptKeywords.indexOf(keyword);
        if (keepIdx > -1) keptKeywords.splice(keepIdx, 1);
        if (currentIndex < allKeywords.length - 1) {
            currentIndex++;
            saveState();
            searchForCurrentKeyword()
        } else {
            alert("已是最后一个关键词。");
            saveState();
            updateUI()
        }
    }

    function navigateToPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            saveState();
            searchForCurrentKeyword()
        } else {
            alert("已是第一个关键词。")
        }
    }

    function navigateToNext() {
        if (currentIndex < allKeywords.length - 1) {
            currentIndex++;
            saveState();
            searchForCurrentKeyword()
        } else {
            alert("已是最后一个关键词。")
        }
    }

    function exportKeywords(keywords, baseFilename) {
        if (keywords.length === 0) {
            alert("没有关键词可以导出。");
            return
        }
        const now = new Date();
        const pad = (num) => num.toString().padStart(2, "0");
        const timestamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        const filename = `${baseFilename}_${timestamp}.txt`;
        const text = keywords.join("\n");
        const blob = new Blob([text], {
            type: "text/plain"
        });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href)
    }

    function toggleMinimize() {
        isMinimized = !isMinimized;
        if (panel && ball) {
            panel.classList.toggle("minimized", isMinimized);
            ball.classList.toggle("hidden", !isMinimized)
        }
        saveState()
    }

    function handleJumpToIndex() {
        const total = allKeywords.length;
        const currentNum = currentIndex + 1;
        const input = prompt(`跳转到第几个关键词? (1 - ${total})`, currentNum);
        if (input === null) return;
        const targetNum = parseInt(input, 10);
        if (isNaN(targetNum)) {
            alert("请输入有效的数字！");
            return
        }
        if (targetNum < 1 || targetNum > total) {
            alert(`请输入 1 到 ${total} 之间的数字！`);
            return
        }
        if (targetNum === currentNum) return;
        currentIndex = targetNum - 1;
        saveState();
        searchForCurrentKeyword()
    }

    /**
     * 更新 UI 并根据审核任务状态锁定或解锁 Google 搜索框
     * (Update the UI and lock/unlock the Google search input based on review state)
     *
     * 主要职责：
     * - 根据 currentIndex 与 allKeywords 决定面板显示哪一部分（上传/操作/导出/重置）；
     * - 更新悬浮球的进度显示；
     * - 当任务进行中时，将页面上的原生搜索输入框置为只读并添加视觉样式以防误操作；
     * - 在任务结束或未开始时恢复搜索框的可编辑状态；
     * - 更新导出按钮的计数文本并同步面板最小化状态。
     *
     * 注意事项/边界：
     * - 在没有创建面板（panel 为 null）时，直接返回以避免错误；
     * - 仅尝试查找 name="q" 的 textarea 并对其进行只读控制，避免影响页面上其他输入域。
     */
    function updateUI() {
        if (!panel) return;
        const statusDiv = document.getElementById('reviewer-status');
        const actionsDiv = document.getElementById('reviewer-actions');
        const uploadDiv = document.getElementById('reviewer-upload');
        const exportDiv = document.getElementById('reviewer-export');
        const resetBtn = document.getElementById('reset-btn');

        // 更新悬浮球
        if (allKeywords.length > 0) {
            const progress = currentIndex < allKeywords.length ? currentIndex + 1 : allKeywords.length;
            ball.innerText = `${progress}/${allKeywords.length}`;
        } else {
            ball.innerText = '...';
        }

        // 查找Google的原生搜索框
        const searchInput = document.querySelector('textarea[name="q"]');

        // 根据任务状态更新面板和锁定搜索框
        if (currentIndex > -1 && allKeywords.length > 0) {
            uploadDiv.style.display = 'none';
            actionsDiv.style.display = 'block';
            exportDiv.style.display = 'block';
            resetBtn.style.display = 'inline-block';
            const currentKeyword = allKeywords[currentIndex];
            const isKept = keptKeywords.includes(currentKeyword);
            const statusIndicator = isKept ?
                `<span class="status-indicator kept">保留中</span>` :
                `<span class="status-indicator deleted">已删除</span>`;
            const progressDisplay = `<strong id="progress-indicator" title="点击跳转">${currentIndex + 1}</strong>`;
            statusDiv.innerHTML = `
                <p>进度: ${progressDisplay} / ${allKeywords.length} ${statusIndicator}</p>
                <p>当前关键词: <strong style="color: #1a73e8; font-size: 1.2em;">${currentKeyword}</strong></p>
            `;
            if (searchInput) {
                searchInput.readOnly = true;
                searchInput.classList.add('locked-search-bar');
                searchInput.title = '关键词审核任务进行中，禁止手动搜索。';
            }
        } else { // 任务未开始或已结束
            statusDiv.innerHTML = '<p>请上传一个关键词文件开始审核。</p><p style="font-size: 0.8em; color: #5f6368;">将自动寻找 "Keyword" 列。</p>';
            uploadDiv.style.display = 'block';
            actionsDiv.style.display = 'none';
            exportDiv.style.display = 'none';
            resetBtn.style.display = 'none';
            if (searchInput) {
                searchInput.readOnly = false;
                searchInput.classList.remove('locked-search-bar');
                searchInput.title = '';
            }
        }
        document.getElementById('export-kept-btn').innerText = `导出保留的 (${keptKeywords.length})`;
        document.getElementById('export-deleted-btn').innerText = `导出删除的 (${deletedKeywords.length})`;
        panel.classList.toggle('minimized', isMinimized);
        ball.classList.toggle('hidden', !isMinimized);
    }

    function createUI() {
        panel = document.createElement("div");
        panel.id = "keyword-reviewer-panel";
        panel.innerHTML = ` <div class="panel-header"> <h2>关键词审核工具</h2> <div class="header-buttons"> <span id="help-btn" title="帮助">?</span> <span id="minimize-btn" title="最小化/展开">－</span> </div></div> <div id="help-tooltip"> <strong>导航 (Navigation):</strong><br> - <strong> ctrl + , </strong>: 查看上一个关键词<br> - <strong>ctrl + . </strong>: 查看下一个关键词<br> - <strong>点击进度数字</strong>: 跳转到指定词<br><br> <strong>操作 (Actions):</strong><br> - <strong>Ctrl + S</strong>: 保留当前词 & 前进<br> - <strong>Ctrl + D</strong>: 删除当前词 & 前进 </div> <div class="panel-content"> <div id="reviewer-status"></div> <div id="reviewer-upload"> <label for="keyword-file-input" class="custom-file-upload">选择关键词文件</label> <input type="file" id="keyword-file-input" accept=".csv,.xlsx,.tsv" style="display: none;"> </div> <div id="reviewer-actions" style="display: none;"> <button id="keep-btn" class="reviewer-btn keep">保留 & 前进</button> <button id="delete-btn" class="reviewer-btn delete">删除 & 前进</button> </div> <div id="reviewer-export" style="display: none;"> <button id="export-kept-btn" class="reviewer-btn export">导出保留的 (0)</button> <button id="export-deleted-btn" class="reviewer-btn export">导出删除的 (0)</button> </div> <div id="reviewer-reset"> <button id="reset-btn" class="reviewer-btn reset">开始新任务</button> </div> </div> `;
        ball = document.createElement("div");
        ball.id = "keyword-reviewer-ball";
        ball.className = "hidden";
        document.body.appendChild(panel);
        document.body.appendChild(ball);
        const helpBtn = document.getElementById("help-btn");
        const tooltip = document.getElementById("help-tooltip");
        helpBtn.addEventListener("mouseenter", () => tooltip.style.display = "block");
        helpBtn.addEventListener("mouseleave", () => tooltip.style.display = "none");
        const statusDiv = document.getElementById("reviewer-status");
        statusDiv.addEventListener("click", (e) => {
            if (e.target.id === "progress-indicator") {
                handleJumpToIndex()
            }
        });
        document.getElementById("keyword-file-input").addEventListener("change", handleFileUpload);
        document.getElementById("keep-btn").addEventListener("click", performKeepAndNext);
        document.getElementById("delete-btn").addEventListener("click", performDeleteAndNext);
        document.getElementById("export-kept-btn").addEventListener("click", () => exportKeywords(keptKeywords, "kept_keywords"));
        document.getElementById("export-deleted-btn").addEventListener("click", () => exportKeywords(deletedKeywords, "deleted_keywords"));
        document.getElementById("reset-btn").addEventListener("click", resetState);
        document.getElementById("minimize-btn").addEventListener("click", toggleMinimize);
        ball.addEventListener("click", toggleMinimize);
        document.querySelector(".custom-file-upload").addEventListener("click", () => {
            document.getElementById("keyword-file-input").click()
        })
    }

    /**
     * 【更新】添加CSS样式
     */
    function addStyles() {
        GM_addStyle(`
            /* ... [大部分样式不变] ... */
            #keyword-reviewer-panel { position: fixed; top: 80px; right: 20px; width: 300px; background-color: #f8f9fa; border: 1px solid #dadce0; border-radius: 8px; padding: 0; z-index: 9999; box-shadow: 0 4px 6px rgba(32,33,36,0.28); font-family: Arial, sans-serif; color: #202124; overflow: visible; transition: all 0.3s ease-in-out; }
            #keyword-reviewer-panel.minimized { width: 0; height: 0; padding: 0; border: 0; opacity: 0; pointer-events: none; overflow: hidden; }
            .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-bottom: 1px solid #dadce0; }
            #keyword-reviewer-panel h2 { margin: 0; font-size: 18px; }
            .header-buttons { display: flex; align-items: center; gap: 8px; }
            #minimize-btn, #help-btn { font-weight: bold; cursor: pointer; color: #5f6368; user-select: none; transition: color 0.2s; }
            #minimize-btn { font-size: 24px; padding: 0 8px; line-height: 1; }
            #help-btn { font-size: 16px; width: 22px; height: 22px; border: 2px solid #5f6368; border-radius: 50%; display: flex; justify-content: center; align-items: center; }
            #minimize-btn:hover, #help-btn:hover { color: #202124; }
            #help-btn:hover { border-color: #202124; }
            #help-tooltip { display: none; position: absolute; top: 45px; right: 10px; width: 240px; background-color: #333; color: white; border-radius: 6px; padding: 10px; font-size: 13px; box-shadow: 0 2px 5px rgba(0,0,0,0.5); z-index: 10001; line-height: 1.5; }
            #help-tooltip strong { color: #fbbc05; }
            .panel-content { padding: 16px; }
            #keyword-reviewer-panel p { margin: 8px 0; }
            #progress-indicator { cursor: pointer; text-decoration: underline; color: #1a73e8; }
            .status-indicator { font-size: 0.8em; padding: 2px 6px; border-radius: 4px; color: white; font-weight: bold; margin-left: 8px; }
            .status-indicator.kept { background-color: #34a853; }
            .status-indicator.deleted { background-color: #ea4335; }
            #keyword-reviewer-ball { position: fixed; top: 80px; right: 20px; width: 60px; height: 60px; background-color: #1a73e8; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 14px; font-weight: bold; cursor: pointer; z-index: 10000; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: all 0.3s ease-in-out; user-select: none; }
            #keyword-reviewer-ball.hidden { transform: scale(0); opacity: 0; pointer-events: none; }
            .reviewer-btn, .custom-file-upload { display: inline-block; width: calc(50% - 10px); padding: 10px; margin: 5px; border: none; border-radius: 4px; font-size: 14px; font-weight: bold; text-align: center; cursor: pointer; transition: background-color 0.2s; }
            .custom-file-upload { background-color: #1a73e8; color: white; width: calc(100% - 10px); }
            .custom-file-upload:hover { background-color: #2b7de9; }
            #reviewer-actions, #reviewer-export, #reviewer-reset { display: flex; flex-wrap: wrap; justify-content: center; margin-top: 10px; }
            #keep-btn { background-color: #34a853; color: white; }
            #keep-btn:hover { background-color: #2e8c47; }
            #delete-btn { background-color: #ea4335; color: white; }
            #delete-btn:hover { background-color: #c5372b; }
            #export-kept-btn, #export-deleted-btn { background-color: #fbbc05; color: #202124; }
            #export-kept-btn:hover, #export-deleted-btn:hover { background-color: #f9ab00; }
            #reset-btn { background-color: #e8eaed; color: #202124; width: calc(100% - 10px); }
            #reset-btn:hover { background-color: #dadce0; }

            /* 新增：锁定搜索框的样式 */
            .locked-search-bar {
                background-color: #f1f3f4 !important; /* 使用Google的灰色背景色 */
                cursor: not-allowed !important;
                color: #70757a !important;
            }
        `);
    }

    function handleKeyPress(e) {
        if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
        if (currentIndex === -1) return;
        if (e.ctrlKey) {
            const key = e.key.toLowerCase();
            if (key === "s") {
                e.preventDefault();
                performKeepAndNext()
            } else if (key === "d") {
                e.preventDefault();
                performDeleteAndNext()
            } else if (e.key === ",") {
                e.preventDefault();
                navigateToPrevious()
            } else if (e.key === ".") {
                e.preventDefault();
                navigateToNext()
            }
            return
        }

    }

    function init() {
        const oldPanel = document.getElementById("keyword-reviewer-panel");
        if (oldPanel) oldPanel.remove();
        const oldBall = document.getElementById("keyword-reviewer-ball");
        if (oldBall) oldBall.remove();
        addStyles();
        createUI();
        loadState();
    }
    window.addEventListener('load', init);
    document.addEventListener('keydown', handleKeyPress);
})();