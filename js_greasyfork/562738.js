// ==UserScript==
// @name         Langfuse 内容提取器
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  从API响应中提取评测详情并显示在表格中
// @author       You
// @include      /^https?:\/\/langfusetest\..*/
// @include      /^https?:\/\/[^/]*\.langfuse\..*/
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562738/Langfuse%20%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562738/Langfuse%20%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 存储API数据
    let runItemsData = new Map();
    // 存储已处理的行
    let processedRows = new Set();

    console.log('[Langfuse提取器] 脚本已加载 v4.3 - 直接填充模式');

    /**
     * 拦截 fetch 请求，捕获 API 响应数据
     */
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);

        try {
            const url = args[0]?.toString() || '';
            // 匹配 datasets.runItemsByRunId 接口
            if (url.includes('datasets.runItemsByRunId')) {
                const clonedResponse = response.clone();
                const data = await clonedResponse.json();

                if (data?.result?.data?.json?.runItems) {
                    const runItems = data.result.data.json.runItems;
                    console.log(
                        `[Langfuse提取器] 捕获到 ${runItems.length} 条数据`
                    );

                    runItems.forEach((item, index) => {
                        // 使用 datasetItemId 作为 key
                        runItemsData.set(item.datasetItemId, item);
                    });

                    // 清除已处理标记，重新渲染
                    processedRows.clear();

                    // 延迟渲染，等待 DOM 更新
                    setTimeout(() => renderAllComments(), 500);
                    setTimeout(() => renderAllComments(), 1500);
                }
            }
        } catch (e) {
            // 忽略解析错误
        }

        return response;
    };

    /**
     * 从 scores 中提取所有有评论的内容，返回 Map<scoreName, comment>
     */
    function extractCommentsMap(scores) {
        if (!scores) return null;

        const commentsMap = new Map();

        for (const [key, value] of Object.entries(scores)) {
            if (value?.comment && value.comment.trim()) {
                commentsMap.set(key, {
                    comment: value.comment,
                    average: value.average,
                    type: value.type,
                });
            }
        }

        return commentsMap.size > 0 ? commentsMap : null;
    }

    /**
     * 添加滚动条样式
     */
    function addScrollbarStyles() {
        const styleId = 'lf-scrollbar-style';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .lf-comment-box::-webkit-scrollbar {
                width: 8px;
            }
            .lf-comment-box::-webkit-scrollbar-track {
                background: #e2e8f0;
                border-radius: 4px;
            }
            .lf-comment-box::-webkit-scrollbar-thumb {
                background: #94a3b8;
                border-radius: 4px;
            }
            .lf-comment-box::-webkit-scrollbar-thumb:hover {
                background: #64748b;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 将表格中的 URL 文本转换为可点击链接
     */
    function linkifyTableUrls() {
        const table = document.querySelector('table');
        if (!table) return;

        // 查找所有包含 URL 的 span 元素
        const spans = table.querySelectorAll('tbody td span');

        spans.forEach((span) => {
            // 跳过已处理的
            if (span.dataset.lfLinkified) return;

            const text = span.textContent?.trim() || '';
            // 检查是否是 URL
            if (text.match(/^https?:\/\//i)) {
                // 标记为已处理
                span.dataset.lfLinkified = 'true';

                // 创建可点击链接
                const link = document.createElement('a');
                link.href = text;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = text;
                link.style.cssText = `
                    color: #2563eb;
                    text-decoration: underline;
                    word-break: break-all;
                    cursor: pointer;
                `;
                link.onmouseover = () => {
                    link.style.color = '#1d4ed8';
                };
                link.onmouseout = () => {
                    link.style.color = '#2563eb';
                };

                // 阻止事件冒泡，避免触发其他操作
                link.onclick = (e) => {
                    e.stopPropagation();
                };

                // 清空 span 并添加链接
                span.textContent = '';
                span.appendChild(link);

                console.log(
                    '[Langfuse提取器] 链接化 URL:',
                    text.substring(0, 50) + '...'
                );
            }
        });
    }

    /**
     * 渲染所有评论到表格
     */
    function renderAllComments() {
        const table = document.querySelector('table');
        if (!table) return;

        addScrollbarStyles();

        // 先处理 URL 链接化
        linkifyTableUrls();

        // 获取表头，建立列名到索引的映射
        const headers = table.querySelectorAll('thead th');
        const columnIndexMap = new Map(); // scoreName -> columnIndex

        headers.forEach((th, index) => {
            // 获取表头文本，尝试多种方式
            let headerText = th.textContent?.trim() || '';
            // 清理表头文本中的特殊字符
            headerText = headerText.replace(
                /^[#@©®™℗℠•·▪▫●○◆◇■□▲△▼▽★☆♠♣♥♦]+\s*/,
                ''
            );

            if (headerText) {
                columnIndexMap.set(headerText, index);
                // 同时存储一个简化版本（去掉 (api) 后缀）
                const simplified = headerText.replace(/\s*\(api\)\s*$/i, '');
                if (simplified !== headerText) {
                    columnIndexMap.set(simplified, index);
                }
            }
        });

        console.log(
            `[Langfuse提取器] 表头列映射:`,
            Array.from(columnIndexMap.keys())
        );

        const rows = table.querySelectorAll('tbody tr');
        if (rows.length === 0) return;

        let successCount = 0;

        rows.forEach((row, rowIndex) => {
            // 获取行的 itemId
            const firstTd = row.querySelector('td:first-child a');
            if (!firstTd) return;

            const itemId =
                firstTd.getAttribute('title') || firstTd.textContent?.trim();
            if (!itemId) return;

            // 检查是否已处理
            const rowKey = `${itemId}-${rowIndex}`;
            if (processedRows.has(rowKey)) return;

            const itemData = runItemsData.get(itemId);
            if (!itemData) return;

            const commentsMap = extractCommentsMap(itemData.scores);
            if (!commentsMap) return;

            // 获取该行的所有单元格
            const cells = row.querySelectorAll('td');
            let rendered = false;

            // 遍历 commentsMap，尝试找到对应的列
            commentsMap.forEach((commentData, scoreName) => {
                // 尝试多种方式匹配列
                // 1. 直接匹配 scoreName (如 "Planner_ToolCall验证-API-NUMERIC")
                // 2. 匹配清理后的名称 (如 "Planner_ToolCall验证")
                const cleanedName = scoreName
                    .replace(/-API-NUMERIC$/i, '')
                    .replace(/-API-CATEGORICAL$/i, '')
                    .replace(/-NUMERIC$/i, '')
                    .replace(/-CATEGORICAL$/i, '');

                // 尝试查找匹配的列
                let targetColumnIndex = -1;

                // 遍历 columnIndexMap 查找匹配
                for (const [headerName, colIndex] of columnIndexMap.entries()) {
                    // 标准化比较
                    const normalizedHeader = headerName
                        .toLowerCase()
                        .replace(/[_\s-]/g, '');
                    const normalizedScore = cleanedName
                        .toLowerCase()
                        .replace(/[_\s-]/g, '');

                    if (
                        normalizedHeader.includes(normalizedScore) ||
                        normalizedScore.includes(normalizedHeader) ||
                        headerName.includes(cleanedName) ||
                        cleanedName.includes(headerName)
                    ) {
                        targetColumnIndex = colIndex;
                        break;
                    }
                }

                if (
                    targetColumnIndex >= 0 &&
                    targetColumnIndex < cells.length
                ) {
                    const targetCell = cells[targetColumnIndex];

                    // 检查是否已经有我们添加的内容
                    if (targetCell.querySelector('.lf-comment-box')) return;

                    // 在单元格内追加内容
                    const container = createCommentBox(
                        commentData,
                        cleanedName
                    );

                    // 找到单元格内的 div 容器
                    const innerDiv = targetCell.querySelector('div');
                    if (innerDiv) {
                        innerDiv.appendChild(container);
                    } else {
                        targetCell.appendChild(container);
                    }

                    rendered = true;
                    console.log(
                        `[Langfuse提取器] 填充 "${cleanedName}" 到第 ${
                            targetColumnIndex + 1
                        } 列`
                    );
                }
            });

            if (rendered) {
                processedRows.add(rowKey);
                successCount++;
            }
        });

        if (successCount > 0) {
            console.log(`[Langfuse提取器] 成功渲染 ${successCount} 行`);
        }
    }

    /**
     * 创建评论内容盒子
     */
    function createCommentBox(commentData, name) {
        const container = document.createElement('div');
        container.className = 'lf-comment-box';

        // 根据评分确定样式
        let bgColor = '#f0fdf4';
        let borderColor = '#86efac';
        let textColor = '#166534';
        let icon = '📝';

        if (
            commentData.type === 'NUMERIC' &&
            typeof commentData.average === 'number'
        ) {
            if (commentData.average >= 3) {
                // 3-5分 = 绿色（良好/满分）
                bgColor = '#f0fdf4';
                borderColor = '#86efac';
                textColor = '#166534';
                icon = '✅';
            } else if (commentData.average >= 1) {
                // 1-2分 = 黄色（中等）
                bgColor = '#fefce8';
                borderColor = '#fde047';
                textColor = '#854d0e';
                icon = '⚠️';
            } else {
                // 0分 = 红色（最差）
                bgColor = '#fef2f2';
                borderColor = '#fca5a5';
                textColor = '#991b1b';
                icon = '❌';
            }
        } else if (
            name.includes('链接') ||
            name.includes('Trace') ||
            name.includes('Id')
        ) {
            icon = '🔗';
        }

        container.style.cssText = `
            margin-top: 8px;
            padding: 10px 12px;
            background: ${bgColor};
            border: 1px solid ${borderColor};
            border-radius: 6px;
            font-size: 13px;
            line-height: 1.6;
            color: ${textColor};
            max-height: 200px;
            overflow-y: auto;
            overflow-x: hidden;
            white-space: pre-wrap;
            word-break: break-word;
            scrollbar-width: thin;
            scrollbar-color: ${borderColor} ${bgColor};
        `;

        // 标题
        const header = document.createElement('div');
        header.style.cssText = `
            font-weight: 600;
            font-size: 12px;
            margin-bottom: 6px;
            padding-bottom: 4px;
            border-bottom: 1px dashed ${borderColor};
        `;
        header.textContent = `${icon} 详情 (评分: ${
            commentData.average ?? 'N/A'
        })`;
        container.appendChild(header);

        // 内容
        const content = document.createElement('div');

        // 检查内容是否包含 URL，如果是则创建可点击链接
        const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
        const urls = commentData.comment.match(urlPattern);

        if (urls && urls.length > 0) {
            // 内容包含 URL，进行链接化处理
            let remainingText = commentData.comment;
            urls.forEach((url) => {
                const urlIndex = remainingText.indexOf(url);
                if (urlIndex > 0) {
                    // URL 前的文本
                    content.appendChild(
                        document.createTextNode(
                            remainingText.substring(0, urlIndex)
                        )
                    );
                }

                // 创建可点击的链接
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = url;
                link.style.cssText = `
                    color: #2563eb;
                    text-decoration: underline;
                    word-break: break-all;
                    cursor: pointer;
                `;
                link.onmouseover = () => {
                    link.style.color = '#1d4ed8';
                };
                link.onmouseout = () => {
                    link.style.color = '#2563eb';
                };
                content.appendChild(link);

                remainingText = remainingText.substring(urlIndex + url.length);
            });

            // URL 后剩余的文本
            if (remainingText) {
                content.appendChild(document.createTextNode(remainingText));
            }
        } else {
            content.textContent = commentData.comment;
        }

        container.appendChild(content);

        return container;
    }

    /**
     * 添加控制按钮（可收起展开的小圆形按钮）
     */
    function addButtons() {
        if (document.getElementById('lf-extractor-buttons')) return;

        let isExpanded = false;

        const container = document.createElement('div');
        container.id = 'lf-extractor-buttons';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
        `;

        // 主按钮（小圆形）
        const mainBtn = document.createElement('button');
        mainBtn.innerHTML = '📊';
        mainBtn.title = '展开 Langfuse 提取器';
        mainBtn.style.cssText = `
            width: 42px;
            height: 42px;
            padding: 0;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            box-shadow: 0 2px 12px rgba(99, 102, 241, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        mainBtn.onmouseover = () => {
            mainBtn.style.transform = 'scale(1.1)';
            mainBtn.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.5)';
        };
        mainBtn.onmouseout = () => {
            mainBtn.style.transform = '';
            mainBtn.style.boxShadow = '0 2px 12px rgba(99, 102, 241, 0.4)';
        };

        // 展开面板
        const panel = document.createElement('div');
        panel.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 8px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            min-width: 160px;
        `;

        // 刷新按钮
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '🔄 刷新提取';
        refreshBtn.style.cssText = `
            padding: 10px 16px;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
            transition: all 0.2s;
        `;
        refreshBtn.onmouseover = () => {
            refreshBtn.style.transform = 'translateY(-1px)';
        };
        refreshBtn.onmouseout = () => {
            refreshBtn.style.transform = '';
        };
        refreshBtn.onclick = () => {
            processedRows.clear();
            renderAllComments();
            refreshBtn.textContent = '✅ 已刷新';
            setTimeout(() => {
                refreshBtn.textContent = '🔄 刷新提取';
            }, 1500);
        };

        // 清除按钮
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🗑️ 清除';
        clearBtn.style.cssText = `
            padding: 10px 16px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
            transition: all 0.2s;
        `;
        clearBtn.onmouseover = () => {
            clearBtn.style.transform = 'translateY(-1px)';
        };
        clearBtn.onmouseout = () => {
            clearBtn.style.transform = '';
        };
        clearBtn.onclick = () => {
            document
                .querySelectorAll('.lf-comment-box')
                .forEach((el) => el.remove());
            processedRows.clear();
            clearBtn.textContent = '✅ 已清除';
            setTimeout(() => {
                clearBtn.textContent = '🗑️ 清除';
            }, 1500);
        };

        // 数据量显示
        const stats = document.createElement('div');
        stats.id = 'lf-stats';
        stats.style.cssText = `
            padding: 8px 12px;
            background: #f1f5f9;
            border-radius: 6px;
            font-size: 12px;
            color: #475569;
            text-align: center;
        `;
        stats.textContent = `缓存: ${runItemsData.size} 条`;

        // 定时更新统计
        setInterval(() => {
            stats.textContent = `缓存: ${runItemsData.size} 条 | 已填充: ${processedRows.size}`;
        }, 2000);

        // 展开/收起切换
        mainBtn.onclick = () => {
            isExpanded = !isExpanded;
            if (isExpanded) {
                panel.style.display = 'flex';
                mainBtn.innerHTML = '✕';
                mainBtn.title = '收起';
                mainBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                mainBtn.style.boxShadow = '0 2px 12px rgba(239, 68, 68, 0.4)';
            } else {
                panel.style.display = 'none';
                mainBtn.innerHTML = '📊';
                mainBtn.title = '展开 Langfuse 提取器';
                mainBtn.style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
                mainBtn.style.boxShadow = '0 2px 12px rgba(99, 102, 241, 0.4)';
            }
        };

        // 点击外部区域关闭面板
        document.addEventListener('click', (e) => {
            if (isExpanded && !container.contains(e.target)) {
                isExpanded = false;
                panel.style.display = 'none';
                mainBtn.innerHTML = '📊';
                mainBtn.title = '展开 Langfuse 提取器';
                mainBtn.style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
                mainBtn.style.boxShadow = '0 2px 12px rgba(99, 102, 241, 0.4)';
            }
        });

        panel.appendChild(refreshBtn);
        panel.appendChild(clearBtn);
        panel.appendChild(stats);
        container.appendChild(mainBtn);
        container.appendChild(panel);
        document.body.appendChild(container);

        console.log('[Langfuse提取器] 按钮已添加');
    }

    /**
     * 初始化
     */
    function init() {
        addButtons();

        // 监听 URL 变化（SPA 应用）
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                processedRows.clear();
                console.log('[Langfuse提取器] URL 变化，重置');
            }
        }).observe(document, { subtree: true, childList: true });

        // 定期尝试渲染（处理延迟加载）
        setInterval(() => {
            if (runItemsData.size > 0) {
                renderAllComments();
            }
        }, 2000);
    }

    // 等待 DOM 加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () =>
            setTimeout(init, 1000)
        );
    } else {
        setTimeout(init, 1000);
    }
})();
