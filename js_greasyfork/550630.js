// ==UserScript==
// @name        晚风知到答题小助手
// @namespace    晚风
// @version      1.0
// @description  智慧树章节测试自动答题
// @author       晚风
// @match        *://*.zhihuishu.com/stuExamWeb*
// @connect      fengtingwanli.cn
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @antifeature  ads
// @resource     css https://unpkg.com/element-ui/lib/theme-chalk/index.css
// @downloadURL https://update.greasyfork.org/scripts/550630/%E6%99%9A%E9%A3%8E%E7%9F%A5%E5%88%B0%E7%AD%94%E9%A2%98%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550630/%E6%99%9A%E9%A3%8E%E7%9F%A5%E5%88%B0%E7%AD%94%E9%A2%98%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
const logMessages = [];
let isCollapsed = false;
let windowState = {
    width: 500,
    height: 450,
    left: 20,
    top: 20,
    collapsed: false
};

function loadWindowState() {
    try {
        const savedState = GM_getValue('windowState', null);
        if (savedState) {
            windowState = JSON.parse(savedState);
            isCollapsed = windowState.collapsed;
        }
    } catch (e) {
        logMessage('加载窗口状态失败: ' + e.message, 'warning');
    }
}

function saveWindowState() {
    try {
        const floatingWindow = document.getElementById('floating-window');
        if (floatingWindow) {
            windowState.left = parseInt(floatingWindow.style.left);
            windowState.top = parseInt(floatingWindow.style.top);
            windowState.collapsed = isCollapsed;
            GM_setValue('windowState', JSON.stringify(windowState));
        }
    } catch (e) {
        logMessage('保存窗口状态失败: ' + e.message, 'warning');
    }
}

function logMessage(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    logMessages.push({ timestamp, message, type });
    if (logMessages.length > 30) logMessages.shift();
    updateLogDisplay();
}
function showTip(message, type = 'info', duration = 2000) {
    const tipEl = document.createElement('div');
    tipEl.textContent = message;
    tipEl.style.position = 'relative';
    tipEl.style.display = 'inline-block';
    tipEl.style.marginTop = '8px';
    tipEl.style.padding = '6px 12px';
    tipEl.style.borderRadius = '4px';
    tipEl.style.color = 'white';
    tipEl.style.fontSize = '13px';
    tipEl.style.fontWeight = '500';
    tipEl.style.zIndex = '1000';
    tipEl.style.opacity = '0';
    tipEl.style.transition = 'opacity 0.3s';


    switch(type) {
        case 'success': tipEl.style.backgroundColor = '#67c23a'; break;
        case 'warning': tipEl.style.backgroundColor = '#e6a23c'; break;
        case 'error': tipEl.style.backgroundColor = '#f56c6c'; break;
        default: tipEl.style.backgroundColor = '#909399';
    }

    const apiContainer = document.getElementById('save-api-key-btn').parentElement;
    apiContainer.appendChild(tipEl);

    requestAnimationFrame(() => tipEl.style.opacity = '1');

    setTimeout(() => {
        tipEl.style.opacity = '0';
        setTimeout(() => tipEl.remove(), 300);
    }, duration);
}

function makeElementResizableDraggable(el) {
    loadWindowState();

    el.style.position = 'absolute';
    el.style.left = `${windowState.left}px`;
    el.style.top = `${windowState.top}px`;

    if (isCollapsed) {
        const floatingWindow = document.getElementById('floating-window');
        const collapseBtnIcon = document.querySelector('#collapse-btn i');

        if (!floatingWindow.dataset.originalHeight) {
            floatingWindow.dataset.originalHeight = `${floatingWindow.offsetHeight}px`;
        }

        floatingWindow.style.height = '40px';
        floatingWindow.style.overflow = 'hidden';

        if (collapseBtnIcon) collapseBtnIcon.className = 'el-icon-plus';
    }

    const header = el.querySelector('.el-dialog__header');
    header.style.cursor = 'move';

    header.onmousedown = function (event) {
        if (event.target.id === 'collapse-btn' || event.target.parentElement.id === 'collapse-btn') {
            return;
        }

        let shiftX = event.clientX - el.getBoundingClientRect().left;
        let shiftY = event.clientY - el.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            el.style.left = pageX - shiftX + 'px';
            el.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        el.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            el.onmouseup = null;
            saveWindowState();
        };
    };

    el.ondragstart = function () {
        return false;
    };
}

function toggleCollapse() {
    isCollapsed = !isCollapsed;

    const collapseBtn = document.querySelector('#collapse-btn i');
    const floatingWindow = document.getElementById('floating-window');

    if (isCollapsed) {
        if (!floatingWindow.dataset.originalHeight) {
            floatingWindow.dataset.originalHeight = `${floatingWindow.offsetHeight}px`;
        }


        floatingWindow.style.height = '40px';
        floatingWindow.style.overflow = 'hidden';


        if (collapseBtn) collapseBtn.className = 'el-icon-plus';
    } else {

        floatingWindow.style.height = floatingWindow.dataset.originalHeight || '';
        floatingWindow.style.overflow = '';

        if (collapseBtn) collapseBtn.className = 'el-icon-minus';
    }


    saveWindowState();
}

//=============================================

enableWebpackHook();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const config = {
    awaitTime: 5000,
    stopTimer: false,
    questionCount: 0,
    finishCount: 0,
    questionType: {
        '判断题': 10,
        '单选题': 20,
        '多选题': 25,
        '填空题': 30,
        '问答题': 40,
    },
    apiKey: GM_getValue('apiKey', '')
};


function updateLogDisplay() {
    const logContainer = document.getElementById('log-container');
    if (!logContainer) return;

    logContainer.innerHTML = '';

    logMessages.forEach(entry => {
        const logItem = document.createElement('div');
        logItem.className = `log-item log-${entry.type}`;
        logItem.innerHTML = `
            <span class="log-timestamp">${entry.timestamp}</span>
            <span class="log-content">${entry.message}</span>
        `;
        logContainer.appendChild(logItem);
    });

    logContainer.scrollTop = logContainer.scrollHeight;
}

function answerQuestion(questionBody, questionIndex) {
    // 获取题目
    const questionTitle = questionBody.querySelector('.subject_describe div,.smallStem_describe p')
        .__Ivue__._data.shadowDom.textContent
        .replace(/%C2%A0/g, '%20')
        .replace(/\s+/g, ' ');

    console.log(`第 ${questionIndex} 题:`, questionTitle);

    // 获取选项
    const options = questionBody.querySelectorAll(".node_detail");
    if (options.length) {
        options.forEach((option, idx) => {
            console.log(`选项 ${idx + 1}:`, option.innerText.trim());
        });
    } else {
        console.log('未检测到选项');
    }

    appendToTable(questionTitle, "", questionIndex);
    logMessage(`正在处理第 ${questionIndex} 题: ${questionTitle.substring(0, 30)}...`);

    const questionType = questionBody.querySelector(".subject_type").innerText.match(/【(.+)】|$/)[1];
    let type = config.questionType[questionType];
    type = type !== undefined ? type : -1;

const apiurl = `https://www.fengtingwanli.cn/answer.php?question=${encodeURIComponent(questionTitle)}${config.apiKey ? `&key=${config.apiKey}` : ''}`;
console.log(apiurl)
GM_xmlhttpRequest({
    method: "GET",
    url: apiurl,
    onload: xhr => {
        try {
            const res = JSON.parse(xhr.responseText);
            const msg = res.msg;
            const answerString = res.answer;

            const questionTypeText = questionBody.querySelector(".subject_type").innerText.match(/【(.+)】|$/)[1];
            let type = config.questionType[questionTypeText];
            type = type !== undefined ? type : -1;

            if (msg === "暂无答案") {
                updateAnswerInTable(questionIndex, "暂无答案", false);
                logMessage(`第 ${questionIndex} 题: 暂无答案`, 'warning');
            } else if (msg === "无效的API，请检查后重试") {
                updateAnswerInTable(questionIndex, "API Key无效，请检查后重试", false);
                logMessage(`第 ${questionIndex} 题: API Key无效`, 'error');
            } else {
                updateAnswerInTable(questionIndex, answerString, true);
                logMessage(`第 ${questionIndex} 题: 已获取答案`, 'success');

                // **这里添加调用选择答案**
                const selected = chooseAnswer(type, questionBody, answerString);
                if (!selected) {
                    logMessage(`第 ${questionIndex} 题: 未匹配到网页选项，需要手动选择`, 'warning');
                }
            }

            // 自动切换下一题
            document.querySelectorAll('.switch-btn-box > button')[1]?.click();
        } catch (error) {
            logMessage(`第 ${questionIndex} 题: 解析答案出错 - ${error.message}`, 'error');
        }
    }
});
}
function chooseAnswer(questionType, questionBody, answerString) {
    let isSelect = false;
    const answers = answerString.split(/[\u0001,#=;=-|；、,]+/).map(a => a.trim()).filter(Boolean);

    if (!questionBody) return isSelect;

    switch (questionType) {
        case 10: // 判断题
            return handleJudgment(questionBody, answers);
        case 20: // 单选题
            return handleSingleChoice(questionBody, answers);
        case 25: // 多选题
            return handleMultipleChoice(questionBody, answers);
        case 30: // 填空题
            return handleFillInBlank(questionBody, answers);
        case 40: // 问答题
            return handleEssay(questionBody, answerString);
        default:
            return isSelect;
    }
}

// 判断题
function handleJudgment(questionBody, answers) {
    const firstOption = questionBody.querySelector(".nodeLab");
    const secondOption = questionBody.querySelectorAll(".nodeLab")[1];
    if (!firstOption || !secondOption) return false;

    const optionText = questionBody.querySelector(".node_detail")?.innerText || "";
    const givenAnswer = answers[0]?.toLowerCase();

    const isCorrectAnswer = /正确|是|对|√|t|true/i.test(givenAnswer);
    const isOptionCorrect = /正确|是|对|√|t|true/i.test(optionText);

    if (isCorrectAnswer === isOptionCorrect) {
        firstOption.click();
    } else if (!isOptionCorrect && !isCorrectAnswer) {
        firstOption.click();
    } else if (isCorrectAnswer !== isOptionCorrect) {
        secondOption.click();
    } else {
        return false;
    }

    return true;
}

function handleSingleChoice(questionBody, answers) {
    const options = questionBody.querySelectorAll(".node_detail");
    if (!options.length) return false;

    const targetAnswer = answers[0];
    if (!targetAnswer) return false;

    for (let i = 0; i < options.length; i++) {
        const optionText = options[i].innerText.trim();
        if (optionText === targetAnswer){
            clickOption(i, questionBody);
            return true;
        }
    }

    return false; 
}

function handleMultipleChoice(questionBody, answers) {
    const options = questionBody.querySelectorAll(".node_detail");
    if (!options.length || !answers.length) return false;

    let matched = false;
    const selectedOptions = new Set();

    answers.forEach(answer => {
        for (let i = 0; i < options.length; i++) {
            if (selectedOptions.has(i)) continue;
            const optionText = options[i].innerText.trim();
            if (optionText === answer) {
                clickOption(i, questionBody);
                selectedOptions.add(i);
                matched = true;
                break;
            }
        }
    });

    return matched;
}

function handleFillInBlank(questionBody, answers) {
    const blanks = questionBody.querySelectorAll(".blankInput");
    if (!blanks.length) return false;

    for (let i = 0; i < blanks.length; i++) {
        const blank = blanks[i];
        if (i < answers.length) {
            blank.value = answers[i];
        } else {

            blank.value = answers[0] || "";
        }
    }
    return blanks.length > 0;
}

function handleEssay(questionBody, answerString) {
    const answerArea = questionBody.querySelector("textarea");
    if (answerArea) {
        answerArea.value = answerString;
        return true;
    }
    return false;
}

function clickOption(index, questionBody) {
    const optionLabel = questionBody.querySelectorAll(".nodeLab")[index];
    if (optionLabel) optionLabel.click();
}

function appendToTable(questionTitle, answerString, questionIndex) {
    const table = document.querySelector("#record-table tbody");
    table.innerHTML += `<tr><td>${questionIndex}</td><td>${questionTitle}</td><td id="answer${questionIndex}">正在搜索...</td></tr>`;
}

function changeAnswerInTable(answerString, questionIndex, isSelect) {
    const answerCell = document.querySelector(`#answer${questionIndex}`);
    answerCell.innerHTML = answerString;
    if (answerString === "暂无答案") {
        answerCell.insertAdjacentHTML('beforeend', `<p style="color:red"><i class="el-icon-error"></i> 暂无答案</p>`);
    }
    if (!isSelect) {
        answerCell.insertAdjacentHTML('beforeend', `<p style="color:red"><i class="el-icon-warning"></i> 未匹配答案，请根据搜索结果手动选择答案</p>`);
    }
}

function enableWebpackHook() {
    const originCall = Function.prototype.call;
    Function.prototype.call = function (...args) {
        const result = originCall.apply(this, args);
        if (args[2]?.default?.version === '2.5.2') {
            args[2]?.default?.mixin({
                mounted: function () {
                    this.$el['__Ivue__'] = this;
                }
            });
        }
        return result;
    }
}

function updateAnswerInTable(questionIndex, msg, isSelect = true) {
    const answerCell = document.querySelector(`#answer${questionIndex}`);
    if (!answerCell) return;

    answerCell.innerHTML = '';
    const mainMsg = document.createElement('div');
    mainMsg.textContent = msg;
    answerCell.appendChild(mainMsg);

    if (!isSelect) {
        const warn = document.createElement('p');
        warn.style.color = 'red';
        warn.innerHTML = '<i class="el-icon-warning"></i> 未匹配答案，请根据搜索结果手动选择';
        answerCell.appendChild(warn);
        logMessage(`第 ${questionIndex} 题: 未匹配答案，请根据搜索结果手动选择`, 'warning');
    }


    const tbody = answerCell.closest('tbody');
    if (tbody) tbody.scrollTop = tbody.scrollHeight;
}



function saveApiKey() {
    const apiKeyInput = document.getElementById('api-key-input');
    const newApiKey = apiKeyInput.value.trim();
    if (newApiKey) {
        GM_setValue('apiKey', newApiKey);
        config.apiKey = newApiKey;
        logMessage('API Key 保存成功', 'success');
        showTip('API Key 保存成功', 'success');
    } else {
        logMessage('API Key 不能为空', 'warning');
        showTip('API Key 不能为空', 'warning');
    }
}

function clearApiKey() {
    GM_setValue('apiKey', '');
    config.apiKey = '';
    document.getElementById('api-key-input').value = '';
    showTip('API Key 已清除', 'info');
}

unsafeWindow.onload = (() => (async () => {

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://unpkg.com/element-ui/lib/theme-chalk/index.css';
document.head.appendChild(link);

    // ================== CSS  ==================
        GM_addStyle(`
#collapse-btn {cursor: pointer;}
.el-dialog {
    width: 500px;
    height: 400px;
    border-radius: 10px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);

}
.el-dialog__header {
    background: linear-gradient(90deg, #409EFF, #66b1ff)!important;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    cursor: move;
}

.nav-bar {
    display: flex;
    background-color: #ea96aa;
    border-bottom: 1px solid #dcdfe6;
}
.nav-bar button {
    flex: 1;
    border: none;
    background: transparent;
    padding: 10px 0;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}
.nav-bar button:hover { background-color: #e6f0ff; }
.nav-bar button.active {
    background-color: #409EFF;
    color: white;
    border-radius: 4px 4px 0 0;
}

.page {
    display: none;
    height: calc(100% - 100px);
    overflow-y: auto;
    box-sizing: border-box;
}

.page.active {
    display: block;
}

#record-table {
    width: 100%;
    table-layout: auto;
    border-collapse: collapse;
}
#record-table th, #record-table td {
    padding: 10px;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #ebeef5;
    white-space: normal;
}
#record-table th:nth-child(1),
#record-table td:nth-child(1) { width: 10%; }
#record-table th:nth-child(2),
#record-table td:nth-child(2) { width: 60%; }
#record-table th:nth-child(3),
#record-table td:nth-child(3) { width: 30%; }

.el-card {
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    margin: 0;
    background-color: #d4dbca!important;
}

.el-card__header {
    background-color: #f5f7fa;
    font-weight: 500;
    display: flex;
    align-items: center;
}

.el-card__header i {
    margin: 0;
    color: #409EFF;
}

.el-card__body {
    padding: 0;
    box-sizing: border-box;
}


.el-table {
    border-radius: 6px;
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;  /* 内容撑开列宽 */
}

.el-table th, .el-table td {
    padding: 10px 12px;
    font-size: 14px;
    border-bottom: 1px solid #ebeef5;
    text-align: center;
    vertical-align: middle;
    white-space: normal;
}

.el-table th {
    background-color: #f5f7fa;
    font-weight: 600;
}



#log-container {
    font-size: 13px;
    overflow-y: auto;
    background: #f9fafc;
    padding: 0;
    line-height: 1.5;
}
.log-item { margin-bottom: 5px; }
.log-info { color: #909399; }
.log-success { color: #67c23a; }
.log-warning { color: #e6a23c; }
.log-error { color: #f56c6c; }

/* 输入框和按钮 */
.el-input__inner {
    height: 36px;
    line-height: 36px;
    border-radius: 6px;
    box-sizing: border-box;
}
.el-button--medium { padding: 6px 12px; font-size: 13px; border-radius: 4px; }
.el-button--primary { background-color: #409EFF; border-color: #409EFF; }
.el-button--primary:hover { background-color: #66b1ff; border-color: #66b1ff; }
.el-button--danger { background-color: #f56c6c; border-color: #f56c6c; }
.el-button--danger:hover { background-color: #f78989; }

/* 二维码卡片居中显示 */
.qr-code-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
.qr-code-container img {
    width: auto;
    max-width: 200px;
    height: auto;
    margin: 0 auto;
    border-radius: 6px;
    border: 1px solid #ebeef5;
}
.qr-code-container p {
    font-size: 12px;
    color: #606266;
    margin-top: 8px;
}
    `);

    const dialogStyle = `
    <div id="floating-window" class="el-dialog">
        <div class="el-dialog__header">
            <span class="el-dialog__title">
                <i class="el-icon-lightning" style="color: #ffd700;"></i> 智慧树小助手
            </span>
            <span id="collapse-btn"><i class="el-icon-minus"></i></span>
        </div>

        <div class="nav-bar">
            <button class="nav-btn active" data-page="log-page">首页</button>
            <button class="nav-btn" data-page="qa-page">答题</button>
            <button class="nav-btn" data-page="api-page">API</button>
            <button class="nav-btn" data-page="qr-page">联系我</button>
        </div>

        <div class="page active" id="log-page">
            <div class="el-card">
                <div class="el-card__header"><i class="el-icon-document"></i> 操作日志</div>
                <div class="el-card__body"><div id="log-container"></div></div>
            </div>
        </div>

        <div class="page" id="qa-page">
            <div class="el-card">
                <div class="el-card__header"><i class="el-icon-document"></i> 答题记录</div>
                <div class="el-card__body">
                    <div class="el-table__body-wrapper">
                        <table id="record-table" class="el-table__body">
                            <thead>
                                <tr class="el-table__header">
                                    <th><div class="cell">序号</div></th>
                                    <th><div class="cell">题目</div></th>
                                    <th><div class="cell">答案</div></th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="page" id="api-page">
            <div class="el-card">
                <div class="el-card__header"><i class="el-icon-key"></i> API设置</div>
                <div class="el-card__body">
                    <div class="el-input el-input--medium">
                        <input id="api-key-input" type="text" placeholder="请输入API Key" class="el-input__inner" value="${config.apiKey}">
                    </div>
                    <div style="margin-top: 8px;">
                        <button id="save-api-key-btn" class="el-button el-button--primary el-button--medium"><i class="el-icon-check"></i> 保存</button>
                        <button id="clear-api-key-btn" class="el-button el-button--danger el-button--medium" style="margin-left:10px"><i class="el-icon-delete"></i> 清除</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="page" id="qr-page">
            <div class="el-card qr-code-container">
                <div class="el-card__header"><i class="el-icon-mobile-phone"></i> 扫码联系我更新题库</div>
                <div class="el-card__body">
                    <img src="https://www.fengtingwanli.cn/wp-content/uploads/2024/10/1730359368-4bbfc02656cc0da1a6b2d0481a89ff7.jpg" alt="联系我">
                    <p>联系我更新题库</p>
                </div>
            </div>
        </div>
    </div>
    `;

document.body.insertAdjacentHTML('beforeend', dialogStyle);

makeElementResizableDraggable(document.getElementById('floating-window'));

document.querySelectorAll('.nav-btn').forEach(btn => {
btn.addEventListener('click', () => {
document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
btn.classList.add('active');
document.getElementById(btn.dataset.page).classList.add('active');
});
});


    document.getElementById('collapse-btn').addEventListener('click', toggleCollapse);
    document.getElementById('save-api-key-btn').addEventListener('click', saveApiKey);
    document.getElementById('clear-api-key-btn').addEventListener('click', clearApiKey);


    logMessage('智慧树小助手已启动', 'info');
    logMessage('填写API后即可开始答题', 'info');
    await sleep(config.awaitTime);

    const questionBodyAll = document.querySelectorAll(".examPaper_subject.mt20");
    if (questionBodyAll.length === 0) {
        logMessage('未检测到题目', 'warning');
        return;
    }

    config.questionCount = questionBodyAll.length;
    logMessage(`共检测到 ${config.questionCount} 道题目`, 'info');

    answerQuestion(questionBodyAll[0], 1);
    let finishCount = 1;
    const interval = setInterval(() => {
        if (finishCount < questionBodyAll.length) {
            answerQuestion(questionBodyAll[finishCount], finishCount + 1);
            finishCount += 1;
        } else {
            clearInterval(interval);
            logMessage("所有题目已处理完成！", 'success');
        }
    }, 3000);
}))();
