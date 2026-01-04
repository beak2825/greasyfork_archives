// ==UserScript==
// @name         4-正确率查询-表格
// @namespace    http://tampermonkey.net/
// @version      3.2.2
// @description  【猫厂专用】在题目详情列表中显示正确率
// @author       大生
// @match        https://tyca.codemao.cn/weekly-test/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @icon         https://tyca.codemao.cn/favicon.ico
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/551147/4-%E6%AD%A3%E7%A1%AE%E7%8E%87%E6%9F%A5%E8%AF%A2-%E8%A1%A8%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/551147/4-%E6%AD%A3%E7%A1%AE%E7%8E%87%E6%9F%A5%E8%AF%A2-%E8%A1%A8%E6%A0%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentPaperId = null; // 用于跟踪当前的paperId，避免重复执行
    let observer = null; // MutationObserver 实例
    let isProcessing = false; // 防止重复处理

    // 定义核心逻辑函数，用于获取数据并更新UI
    function runScriptIfPaperIdExists() {
        const urlParams = new URLSearchParams(window.location.search);
        const newPaperId = urlParams.get('paperId');

        // 1. 检查URL是否包含paperId
        if (!newPaperId) {
            console.log("[正确率查询] URL中不包含paperId参数，脚本不执行正确率显示功能。");
            // 如果之前有paperId，现在没有了，需要清理observer
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            currentPaperId = null; // 重置paperId
            isProcessing = false;
            return;
        }

        // 2. 如果paperId没有变化，则不重复执行
        if (newPaperId === currentPaperId && isProcessing) {
            console.log("[正确率查询] paperId未改变且正在处理中，跳过");
            return;
        }

        currentPaperId = newPaperId; // 更新当前的paperId
        console.log(`[正确率查询] 检测到paperId: ${currentPaperId}，开始执行脚本`);

        // 3. 如果存在旧的观察器，先断开
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        const paperInfoUrl = `https://codecamp-teaching-system.codemao.cn/paper/${currentPaperId}`;

        // 定义处理表格的函数
        function processTable() {
            if (isProcessing) {
                console.log("[正确率查询] 已在处理中，跳过");
                return true; // 返回true防止重复创建observer
            }

            const tableHeader = document.querySelector('.ant-table-thead');
            if (!tableHeader) {
                return false;
            }

            // 修改表头，将"题目语音"改为"正确率"
            const headers = tableHeader.querySelectorAll('.ant-table-cell');
            let foundHeader = false;
            headers.forEach(header => {
                if (header.textContent.includes('题目语音')) {
                    header.textContent = '正确率';
                    foundHeader = true;
                }
            });

            // 只有成功修改了表头才去获取数据
            if (foundHeader) {
                isProcessing = true;
                console.log("[正确率查询] 找到题目语音表头，开始获取正确率数据...");
                fetchPaperInfo(paperInfoUrl);
                return true;
            } else {
                console.log("[正确率查询] 未找到预期的表格表头（题目语音）");
                return false;
            }
        }

        // 4. 先尝试直接处理（如果表格已经存在）
        if (processTable()) {
            console.log("[正确率查询] 表格已存在，直接处理");
            return;
        }

        // 5. 如果表格不存在，创建 MutationObserver 等待表格加载
        console.log("[正确率查询] 表格未找到，开始观察DOM变化...");
        observer = new MutationObserver(() => {
            if (processTable()) {
                // 处理成功后停止观察
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
                console.log("[正确率查询] 通过Observer找到表格并处理完成");
            }
        });

        // 开始观察body元素的变化
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 获取试卷详细信息和题目正确率的函数
    function fetchPaperInfo(url) {
        console.log(`[正确率查询] 开始获取试卷信息: ${url}`);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const paperData = JSON.parse(response.responseText);
                        if (paperData.code === 200 && paperData.success && paperData.data && paperData.data.questions) {
                            const questions = paperData.data.questions;
                            console.log(`[正确率查询] 获取到${questions.length}个题目，开始获取正确率`);
                            
                            const questionPromises = questions.map(question => {
                                const questionId = question.questionId;
                                if (questionId) {
                                    const questionAccuracyUrl = `https://codecamp-teaching-system.codemao.cn/general-question/list?questionId=${questionId}`;
                                    return new Promise((resolve) => {
                                        GM_xmlhttpRequest({
                                            method: "GET",
                                            url: questionAccuracyUrl,
                                            onload: function (qResponse) {
                                                if (qResponse.status >= 200 && qResponse.status < 300) {
                                                    try {
                                                        const qData = JSON.parse(qResponse.responseText);
                                                        if (qData.code === 200 && qData.success && qData.data && qData.data.items && qData.data.items.length > 0 && qData.data.items[0].stat) {
                                                            const accuracy = qData.data.items[0].stat.accuracy;
                                                            console.log(`[正确率查询] 题目${questionId}正确率: ${(accuracy * 100).toFixed(0)}%`);
                                                            resolve({ questionId, accuracy });
                                                        } else {
                                                            resolve({ questionId, accuracy: 'N/A' });
                                                        }
                                                    } catch (e) {
                                                        console.error(`[正确率查询] 解析题目 ${questionId} 响应失败:`, e);
                                                        resolve({ questionId, accuracy: 'N/A' });
                                                    }
                                                } else {
                                                    console.error(`[正确率查询] 获取题目 ${questionId} 信息失败，状态码: ${qResponse.status}`);
                                                    resolve({ questionId, accuracy: 'N/A' });
                                                }
                                            },
                                            onerror: function (error) {
                                                console.error(`[正确率查询] 请求题目 ${questionId} 时发生错误:`, error);
                                                resolve({ questionId, accuracy: 'N/A' });
                                            }
                                        });
                                    });
                                } else {
                                    return Promise.resolve({ questionId: null, accuracy: 'N/A' });
                                }
                            });

                            Promise.all(questionPromises).then(accuracies => {
                                console.log("[正确率查询] 所有题目正确率获取完成，开始更新表格");
                                updateTableWithAccuracies(accuracies);
                            });

                        } else {
                            console.warn("[正确率查询] 获取试卷信息成功，但数据结构不符合预期或无题目信息");
                            isProcessing = false;
                        }
                    } catch (e) {
                        console.error("[正确率查询] 解析试卷信息JSON响应失败：", e);
                        isProcessing = false;
                    }
                } else {
                    console.error(`[正确率查询] 获取试卷信息失败，状态码：${response.status}`);
                    isProcessing = false;
                }
            },
            onerror: function (error) {
                console.error("[正确率查询] 请求试卷信息失败：", error);
                isProcessing = false;
            }
        });
    }

    // 更新表格UI的函数
    function updateTableWithAccuracies(accuracies) {
        const accuracyMap = new Map(accuracies.map(item => [item.questionId, item.accuracy]));

        const tableBody = document.querySelector('.ant-table-tbody');
        if (!tableBody) {
            console.warn("[正确率查询] 未找到表格tbody元素");
            isProcessing = false;
            return;
        }

        const rows = tableBody.querySelectorAll('tr.ant-table-row');
        console.log(`[正确率查询] 找到${rows.length}行数据，开始更新`);
        
        let updatedCount = 0;
        rows.forEach(row => {
            const questionId = row.dataset.rowKey;
            if (questionId) {
                const accuracy = accuracyMap.get(parseInt(questionId));

                const cells = row.querySelectorAll('.ant-table-cell');
                if (cells.length > 4) {
                    const voiceCell = cells[4]; // 第5个单元格（索引从0开始），对应题目语音/正确率

                    if (accuracy !== undefined) {
                        if (accuracy === 'N/A') {
                            voiceCell.textContent = '无法获取';
                            voiceCell.style.color = '#888'; // 灰色
                        } else {
                            // 将正确率转换为整数百分比
                            const accuracyInt = Math.round(accuracy * 100);
                            voiceCell.textContent = `${accuracyInt}%`;
                            // 根据正确率值设置样式
                            if (accuracy < 0.6) {
                                voiceCell.style.color = 'red';
                            } else if (accuracy < 0.8) {
                                voiceCell.style.color = 'orange';
                            } else {
                                voiceCell.style.color = 'green';
                            }
                        }
                        updatedCount++;
                    } else {
                        voiceCell.textContent = '未找到';
                        voiceCell.style.color = '#888'; // 灰色
                    }
                }

                // 修改"查看试题"按钮的链接
                const actionCell = cells[cells.length - 1]; // 最后一个单元格是操作列
                const button = actionCell.querySelector('button.ant-btn-link');
                if (button && button.textContent.includes('查看试题')) {
                    // 移除原有的点击事件
                    button.onclick = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const newUrl = `https://tyca.codemao.cn/weekly-test/topic/detail?questionId=${questionId}`;
                        window.open(newUrl, '_blank');
                    };
                }
            }
        });

        console.log(`[正确率查询] 表格更新完成，共更新${updatedCount}行`);
        isProcessing = false;
    }

    // --- 监听 URL 变化，确保脚本在 URL 变化时重新运行 ---

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            isProcessing = false; // 重置处理状态
            runScriptIfPaperIdExists(); // URL 变化时，重新运行逻辑
        }
    }).observe(document, { subtree: true, childList: true });

    // 针对单页应用 (SPA) 路由变化的监听
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(history, arguments);
        isProcessing = false;
        runScriptIfPaperIdExists();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(history, arguments);
        isProcessing = false;
        runScriptIfPaperIdExists();
    };

    window.addEventListener('popstate', () => {
        isProcessing = false;
        runScriptIfPaperIdExists();
    });

    // 首次加载页面时执行脚本
    console.log("[正确率查询] 脚本已加载，开始初始化");
    runScriptIfPaperIdExists();

})();
