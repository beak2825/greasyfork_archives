// ==UserScript==
// @name         腾讯文档周报下载器
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  一键展开和下载腾讯文档中的周报内容
// @author       You
// @match        https://doc.weixin.qq.com/forms/j/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552547/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E5%91%A8%E6%8A%A5%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552547/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E5%91%A8%E6%8A%A5%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置项
    const CONFIG = {
        // 需要用户提供的选择器（待填充）
        selectors: {
            weeklyReportItem: '[data-group-index][class*="StatGroupHeader_statHeaderWrapper"]', // 周报项选择器
            expandDelay: 500, // 展开动画延迟时间（毫秒）
            expandButton: '[class*="ExpandToggle_button__"]',     // 展开按钮选择器
            isExpandedButton: '[class*="ExpandToggle_isExpand"]', // 已展开状态选择器
            reportContent: '',    // 周报内容选择器
            dateRange: '',        // 日期范围选择器
            submissionInfo: ''    // 提交信息选择器
        }
    };

    // 获取默认日期范围（过去一周）
    function getDefaultDateRange() {
        const today = new Date();

        // 获取今天是本周的第几天 (0: 周日, 1: 周一, ..., 6: 周六)
        const dayOfWeek = today.getDay();

        // 计算上一个周一的日期
        const lastMonday = new Date(today);
        // 如果今天是周日(0)，需要减去6天；否则减去 (dayOfWeek + 6) 天
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek + 6;
        lastMonday.setDate(today.getDate() - daysToSubtract);

        // 计算上一个周日的日期（就是上周日）
        const lastSunday = new Date(lastMonday);
        lastSunday.setDate(lastMonday.getDate() + 6);

        return {
            startDate: lastMonday.toISOString().split('T')[0], // 上一个周一
            endDate: lastSunday.toISOString().split('T')[0]    // 上一个周日
        };
    }


    // 创建可折叠的悬浮控制面板
    function createControlPanel() {
        const container = document.createElement('div');
        container.id = 'weekly-report-controller';

        // 获取默认日期
        const defaultDates = getDefaultDateRange();

        // 创建完整的面板HTML
        container.innerHTML = `
            <!-- 圆形小图标 (默认显示) -->
            <div id="floatingIcon" style="
                position: fixed;
                top: 150px;
                right: 20px;
                width: 38px;
                height: 38px;
                background: linear-gradient(135deg, #00c853, #4caf50);
                border-radius: 50%;
                cursor: pointer;
                z-index: 10001;
                box-shadow: 0 4px 12px rgba(0,200,83,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                border: 2px solid #ffffff;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                <span style="color: white; font-size: 14px; font-weight: bold;">周报</span>
            </div>
            
            <!-- 完整控制面板 (默认隐藏) -->
            <div id="fullPanel" style="
                position: fixed;
                top: 150px;
                right: 20px;
                width: 200px;
                background: #ffffff;
                border: 2px solid #00c853;
                border-radius: 12px;
                padding: 15px;
                z-index: 10000;
                box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                font-family: Arial, sans-serif;
                display: none;
                animation: slideIn 0.3s ease;
            ">
                <!-- 关闭按钮 -->
                                <button id="closeBtn" style="
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 28px;
                    height: 28px;
                    background: linear-gradient(135deg, #ff5252, #f44336);
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    cursor: pointer;
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(255,82,82,0.3);
                    transition: all 0.2s ease;
                    z-index: 10001;
                " onmouseover="
                    this.style.transform='scale(1.1)'; 
                    this.style.boxShadow='0 4px 12px rgba(255,82,82,0.4)';
                    this.style.background='linear-gradient(135deg, #f44336, #d32f2f)';
                " onmouseout="
                    this.style.transform='scale(1)'; 
                    this.style.boxShadow='0 2px 8px rgba(255,82,82,0.3)';
                    this.style.background='linear-gradient(135deg, #ff5252, #f44336)';
                ">×</button>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 10px; font-weight: bold;">开始日期:</label>
                    <input type="date" id="startDate" value="${defaultDates.startDate}" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 6px; font-size: 12px;">
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 10px; font-weight: bold;">结束日期:</label>
                    <input type="date" id="endDate" value="${defaultDates.endDate}" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 6px; font-size: 12px;">
                </div>
                
                <button id="expandAllBtn" style="
                    width: 100%; 
                    padding: 8px; 
                    margin-bottom: 8px; 
                    background: linear-gradient(135deg, #00c853, #4caf50); 
                    color: white; 
                    border: none; 
                    border-radius: 6px; 
                    cursor: pointer; 
                    font-size: 13px;
                    transition: all 0.2s ease;
                " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,200,83,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    📂 一键展开
                </button>
                
                <button id="downloadAllBtn" style="
                    width: 100%; 
                    padding: 8px; 
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, #2196f3, #42a5f5); 
                    color: white; 
                    border: none; 
                    border-radius: 6px; 
                    cursor: pointer; 
                    font-size: 13px;
                    transition: all 0.2s ease;
                " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(33,150,243,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    💾 一键下载
                </button>
                
                <div id="statusInfo" style="
                    margin-top: 8px; 
                    font-size: 11px; 
                    color: #666; 
                    text-align: center;
                    padding: 4px 8px;
                    background: #f8f9fa;
                    border-radius: 4px;
                    border-left: 3px solid #00c853;
                ">
                    就绪
                </div>
            </div>
        `;

        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(20px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
            }
            
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateX(20px) scale(0.9);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(container);

        // 绑定展开/收起事件
        bindPanelEvents();

        // 绑定功能事件
        bindEvents();
    }

    // 绑定面板展开/收起事件
    function bindPanelEvents() {
        const floatingIcon = document.getElementById('floatingIcon');
        const fullPanel = document.getElementById('fullPanel');
        const closeBtn = document.getElementById('closeBtn');

        // 点击圆形图标展开面板
        floatingIcon.addEventListener('click', () => {
            floatingIcon.style.display = 'none';
            fullPanel.style.display = 'block';
            fullPanel.style.animation = 'slideIn 0.3s ease';
        });

        // 点击关闭按钮收起面板
        closeBtn.addEventListener('click', () => {
            fullPanel.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                fullPanel.style.display = 'none';
                floatingIcon.style.display = 'flex';
            }, 300);
        });
    }

    // 绑定事件处理
    function bindEvents() {
        const expandBtn = document.getElementById('expandAllBtn');
        const collapseBtn = document.getElementById('collapseAllBtn');
        const downloadBtn = document.getElementById('downloadAllBtn');

        expandBtn.addEventListener('click', expandAllReports);
        downloadBtn.addEventListener('click', downloadAllReports);
        collapseBtn.addEventListener('click', collapseAllReports);
    }

    // 解析日期文本，提取开始和结束日期
    function parseDateRange(dateText) {
        // 匹配格式：9月29日 - 10月5日
        const datePattern = /(\d+)月(\d+)日\s*-\s*(\d+)月(\d+)日/;
        const match = dateText.match(datePattern);

        if (!match) return null;

        const [, startMonth, startDay, endMonth, endDay] = match;
        const currentYear = new Date().getFullYear();

        // 构造日期对象
        const startDate = new Date(currentYear, parseInt(startMonth) - 1, parseInt(startDay));
        const endDate = new Date(currentYear, parseInt(endMonth) - 1, parseInt(endDay));

        // 处理跨年情况（如12月到1月）
        if (endDate < startDate) {
            endDate.setFullYear(currentYear + 1);
        }

        return { startDate, endDate };
    }
    // 检查日期是否在指定范围内
    function isDateInRange(targetStart, targetEnd, filterStart, filterEnd) {
        // 检查两个日期区间是否有重叠
        return targetStart <= filterEnd && targetEnd >= filterStart;
    }

    // 获取所有周报条目
    function getAllReportItems() {
        const allItems = document.querySelectorAll(CONFIG.selectors.weeklyReportItem);

        // 获取用户选择的日期范围
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (!startDateInput || !endDateInput || !startDateInput.value || !endDateInput.value) {
            console.log('日期输入框未找到或未设置，返回所有周报条目');
            return allItems;
        }

        const filterStartDate = new Date(startDateInput.value);
        const filterEndDate = new Date(endDateInput.value);

        console.log(`筛选日期范围: ${filterStartDate.toLocaleDateString()} 到 ${filterEndDate.toLocaleDateString()}`);

        // 筛选符合日期范围的条目
        const filteredItems = Array.from(allItems).filter(item => {
            const dateText = item.textContent.trim();
            console.log(`检查周报条目: ${dateText}`);

            const parsedDates = parseDateRange(dateText);
            if (!parsedDates) {
                console.log(`无法解析日期: ${dateText}`);
                return false;
            }

            const { startDate: itemStart, endDate: itemEnd } = parsedDates;
            const isInRange = isDateInRange(itemStart, itemEnd, filterStartDate, filterEndDate);

            console.log(`周报日期: ${itemStart.toLocaleDateString()} - ${itemEnd.toLocaleDateString()}, 是否在范围内: ${isInRange}`);

            return isInRange;
        });

        return filteredItems;
    }

    // 检查元素是否已展开
    function isExpanded(element) {
        const expandElement = element && element.querySelector(CONFIG.selectors.isExpandedButton);
        return expandElement !== null && expandElement !== undefined;
    }

    // 点击展开单个周报条目
    async function clickReportItem(item, action = 'expand') {
        return new Promise(async (resolve) => {
            console.log(`开始处理周报项: ${item.textContent.trim().substring(0, 50)}...`);

            // 点击日期项，弹出周报提交信息
            const expandButton = item.querySelector(CONFIG.selectors.expandButton);
            if (!expandButton) {
                console.log('未找到展开按钮');
                resolve(false);
                return;
            }

            if (action === 'expand') {
                // 第一步：展开主周报项
                const isMainExpanded = item.querySelector(CONFIG.selectors.isExpandedButton) !== null;
                console.log(`主项展开状态: ${isMainExpanded}`);

                if (!isMainExpanded) {
                    console.log('点击主展开按钮');
                    expandButton.click();

                    // 等待DOM更新
                    await new Promise(resolve => setTimeout(resolve, CONFIG.selectors.expandDelay));
                }

                // 第二步：查找并展开子项（提交日期）
                // 重新查找nextElementSibling，确保DOM已更新
                let subItem = item.nextElementSibling;
                let attempts = 0;
                const maxAttempts = 5;

                // 等待子项出现
                while (!subItem && attempts < maxAttempts) {
                    console.log(`等待子项出现，尝试 ${attempts + 1}/${maxAttempts}`);
                    await new Promise(resolve => setTimeout(resolve, 200));
                    subItem = item.nextElementSibling;
                    attempts++;
                }

                if (subItem) {
                    const isSubExpanded = subItem.querySelector(CONFIG.selectors.isExpandedButton) !== null;
                    console.log(`子项展开状态: ${isSubExpanded}`);

                    if (!isSubExpanded) {
                        const subExpandButton = subItem.querySelector(CONFIG.selectors.expandButton);
                        if (subExpandButton) {
                            console.log('点击子展开按钮');
                            subExpandButton.click();

                            // 等待子项展开完成
                            await new Promise(resolve => setTimeout(resolve, CONFIG.selectors.expandDelay));
                        } else {
                            console.log('未找到子展开按钮');
                        }
                    }
                } else {
                    console.log('未找到子项');
                }

            } else {
                // 收起操作
                expandButton.click();
                await new Promise(resolve => setTimeout(resolve, CONFIG.selectors.expandDelay));
            }

            console.log('周报项处理完成');
            resolve(true);
        });
    }

    // 全局变量存储收集到的周报内容 (Map结构: key=日期, value=周报内容)
    let collectedReports = new Map();

    // 展开所有周报并同时收集内容
    async function expandAllReports() {
        // 不再清空，保留之前收集的内容

        // 获取筛选后的周报条目
        const reportItems = getAllReportItems();
        console.log(`找到 ${reportItems.length} 个符合条件的周报条目`);

        if (reportItems.length === 0) {
            updateStatus('未找到符合条件的周报');
            setTimeout(() => updateStatus('就绪'), 3000);
            return;
        }

        let processedCount = 0;

        // 逐个展开并收集内容，应对列表虚拟化
        for (let i = 0; i < reportItems.length; i++) {
            const item = reportItems[i];
            updateStatus(`处理第 ${i + 1}/${reportItems.length} 个周报`);

            try {
                // 展开周报项
                const wasExpanded = await clickReportItem(item, 'expand');

                if (wasExpanded) {
                    // 等待内容加载
                    await new Promise(resolve => setTimeout(resolve, 800));

                    // 立即提取内容
                    const reportData = extractReportContent(item);

                    // 使用日期作为key检查是否已存在
                    const dateKey = reportData.date || reportData.title;

                    if (reportData.content.length > 0) {
                        if (collectedReports.has(dateKey)) {
                            console.log(`📋 周报已存在，跳过: ${dateKey}`);
                        } else {
                            collectedReports.set(dateKey, reportData);
                            console.log(`✅ 新收集周报: ${dateKey}`, reportData);
                            processedCount++;
                        }
                    } else {
                        console.log(`⚠️ 未找到周报内容: ${dateKey || '未知'}`);
                    }
                }

                // 短暂延迟，确保页面稳定
                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (error) {
                console.error(`处理第 ${i + 1} 个周报时出错:`, error);
            }
        }

        updateStatus(`处理完成 (${processedCount}/${reportItems.length})`);
        console.log(`总共收集到 ${collectedReports.size} 份周报内容`);

        // 3秒后清除状态
        setTimeout(() => {
            updateStatus('就绪');
        }, 3000);

        return collectedReports;
    }

    // 收起所有周报
    async function collapseAllReports() {
        updateStatus('正在收起所有周报...');
    }

    // 将HTML富文本转换为格式化文本
    function convertRichTextToFormattedText(element) {
        if (!element) return '';

        // 克隆元素避免修改原DOM
        const clonedElement = element.cloneNode(true);

        // 处理各种HTML标签，转换为文本格式
        const processElement = (el) => {
            // 处理换行标签
            el.querySelectorAll('br').forEach(br => {
                br.replaceWith('\n');
            });

            // 处理段落标签
            el.querySelectorAll('p').forEach(p => {
                if (p.textContent.trim()) {
                    p.insertAdjacentText('afterend', '\n\n');
                }
            });

            // 处理div标签（通常表示段落）
            el.querySelectorAll('div').forEach(div => {
                // 如果div有实际内容且不是容器div
                if (div.textContent.trim() && !div.querySelector('div, p')) {
                    div.insertAdjacentText('afterend', '\n');
                }
            });

            // 处理有序列表
            el.querySelectorAll('ol').forEach(ol => {
                ol.insertAdjacentText('beforebegin', '\n');
                ol.insertAdjacentText('afterend', '\n');
            });

            // 处理无序列表
            el.querySelectorAll('ul').forEach(ul => {
                ul.insertAdjacentText('beforebegin', '\n');
                ul.insertAdjacentText('afterend', '\n');
            });

            // 处理列表项
            el.querySelectorAll('li').forEach((li, index) => {
                const parent = li.parentElement;
                const prefix = parent.tagName === 'OL' ? `${index + 1}. ` : '• ';
                li.insertAdjacentText('afterbegin', prefix);
                li.insertAdjacentText('afterend', '\n');
            });

            // 处理标题标签
            el.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                const prefix = '#'.repeat(level) + ' ';
                heading.insertAdjacentText('afterbegin', prefix);
                heading.insertAdjacentText('afterend', '\n\n');
            });

            // 处理强调标签
            el.querySelectorAll('strong, b').forEach(strong => {
                const text = strong.textContent;
                strong.textContent = `**${text}**`;
            });

            // 处理斜体标签
            el.querySelectorAll('em, i').forEach(em => {
                const text = em.textContent;
                em.textContent = `*${text}*`;
            });

            return el.textContent;
        };

        const formattedText = processElement(clonedElement);

        // 清理多余的空行
        return formattedText
            .replace(/\n{3,}/g, '\n\n')  // 多个连续换行替换为两个
            .replace(/^\n+/, '')         // 去掉开头的换行
            .replace(/\n+$/, '')         // 去掉结尾的换行
            .trim();
    }

    // 修改提取周报内容函数
    function extractReportContent(item) {
        const reportData = {
            title: '',
            date: '',
            content: [],
            submitters: []
        };

        // 获取周报标题和日期
        const dateText = item.textContent.trim();
        const dateMatch = dateText.match(/(\d+月\d+日\s*-\s*\d+月\d+日)/);
        if (dateMatch) {
            reportData.title = dateMatch[1];
            reportData.date = dateMatch[1];
        }

        // 获取提交信息（汇报对象）
        const nextSibling = item.nextElementSibling;

        if (nextSibling) {
            const submissionText = nextSibling.textContent;
            const submitterMatch = submissionText.match(/汇报给：(.+?)(?:\s|$)/);
            if (submitterMatch) {
                reportData.submitters = submitterMatch[1].split(/[、，,]/).map(s => s.trim());
            }
        }

        const contentSelector = '.question-content';
        const contentElements = nextSibling.querySelectorAll(contentSelector);

        // 处理每个富文本内容
        contentElements.forEach((element, index) => {
            const formattedContent = convertRichTextToFormattedText(element);

            if (formattedContent && formattedContent.length > 20) { // 过滤掉太短的内容
                reportData.content.push({
                    index: index + 1,
                    text: formattedContent,
                    originalHtml: element.innerHTML // 保留原始HTML用于调试
                });

                console.log(`提取到内容 ${index + 1}:`, formattedContent.substring(0, 100) + '...');
            }
        });

        return reportData;
    }

    // 修改格式化函数以支持富文本
    function formatReportsAsText(reports) {
        let formattedText = `周报汇总\n生成时间: ${new Date().toLocaleString()}\n`;
        formattedText += `共收集 ${reports.length} 份周报\n`;
        formattedText += '='.repeat(80) + '\n\n';

        reports.forEach((report, index) => {
            formattedText += `【周报 ${index + 1}】\n`;
            formattedText += `时间范围: ${report.title}\n`;
            formattedText += `汇报对象: ${report.submitters.join(', ')}\n`;
            formattedText += '-'.repeat(60) + '\n\n';

            if (report.content.length > 0) {
                report.content.forEach((contentItem, contentIndex) => {
                    if (report.content.length > 1) {
                        formattedText += `内容部分 ${contentItem.index}:\n`;
                    }
                    formattedText += contentItem.text + '\n\n';
                });
            } else {
                formattedText += '(未找到周报内容)\n\n';
            }

            formattedText += '='.repeat(80) + '\n\n';
        });

        return formattedText;
    }

    // 获取已收集的周报内容，支持日期范围过滤
    function collectAllReportContents(startDate = null, endDate = null) {
        console.log(`当前Map中共有 ${collectedReports.size} 份周报内容`);

        // 将Map转换为数组
        const allReports = Array.from(collectedReports.values());

        // 如果没有指定日期范围，返回所有内容
        if (!startDate || !endDate) {
            console.log(`返回所有 ${allReports.length} 份周报内容`);
            return allReports;
        }

        // 根据日期范围过滤
        const filteredReports = allReports.filter(report => {
            const parsedDates = parseDateRange(report.date || report.title);
            if (!parsedDates) return false;

            const { startDate: reportStart, endDate: reportEnd } = parsedDates;

            // 检查日期区间是否有重叠
            return isDateInRange(reportStart, reportEnd, startDate, endDate);
        });

        console.log(`根据日期范围过滤后返回 ${filteredReports.length} 份周报内容`);
        return filteredReports;
    }

    // 下载所有周报
    async function downloadAllReports() {
        updateStatus('开始处理周报下载...');

        // 获取用户设置的日期范围
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (!startDateInput?.value || !endDateInput?.value) {
            updateStatus('请先设置日期范围');
            return;
        }

        const targetStartDate = new Date(startDateInput.value);
        const targetEndDate = new Date(endDateInput.value);

        console.log(`下载日期范围: ${targetStartDate.toLocaleDateString()} 到 ${targetEndDate.toLocaleDateString()}`);

        // 检查是否已有收集的内容
        if (collectedReports.size === 0) {
            updateStatus('先点击"一键展开"');
            setTimeout(() => updateStatus('就绪'), 3000);
            return;
        }

        // 直接使用已收集的内容，按日期范围过滤
        updateStatus('准备下载文件...');
        const reports = collectAllReportContents(targetStartDate, targetEndDate);

        // 格式化内容
        const formattedText = formatReportsAsText(reports);

        // 先在控制台打印
        console.log('=== 收集到的周报内容 ===');
        console.log(formattedText);

        // 生成文件名
        const startStr = targetStartDate.toISOString().split('T')[0];
        const endStr = targetEndDate.toISOString().split('T')[0];
        const filename = `周报汇总_${startStr}_到_${endStr}.txt`;

        // 下载文件
        updateStatus('生成下载文件...');
        downloadAsFile(formattedText, filename);

        updateStatus(`下载完成 (${reports.length}份周报)`);

        // 3秒后清除状态
        setTimeout(() => {
            updateStatus('就绪');
        }, 3000);
    }

    // 下载内容为文件
    function downloadAsFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`✅ 文件已下载: ${filename}`);
    }

    // 更新状态信息
    function updateStatus(message) {
        const statusElement = document.getElementById('statusInfo');
        if (statusElement) {
            statusElement.textContent = message;
        }

        // 更新圆形图标的显示
        updateFloatingIcon();

        console.log('状态:', message);
    }

    // 更新悬浮图标状态
    function updateFloatingIcon() {
        const floatingIcon = document.getElementById('floatingIcon');
        if (!floatingIcon) return;

        const iconContent = floatingIcon.querySelector('span');
        if (!iconContent) return;

        const collectedCount = collectedReports.size;

        if (collectedCount > 0) {
            // 显示收集数量
            iconContent.innerHTML = `<div style="text-align: center; line-height: 1;">
                <div style="font-size: 14px; margin-top: -2px;">${collectedCount}</div>
            </div>`;
        } else {
            // 默认状态
            iconContent.textContent = '📊';
            floatingIcon.style.background = 'linear-gradient(135deg, #00c853, #4caf50)';
        }
    }

    // 等待页面加载完成后初始化
    function init() {
        console.log('=== 腾讯文档周报下载器脚本开始执行 ===');

        // 延迟创建面板，确保页面完全加载
        setTimeout(() => {

            createControlPanel();
            console.log('腾讯文档周报下载器已加载');
            // 输出调试信息
            const reportItems = getAllReportItems();
            console.log(`检测到 ${reportItems.length} 个周报条目:`, reportItems);
        }, 2000);
    }

    // 启动脚本
    init();
})();