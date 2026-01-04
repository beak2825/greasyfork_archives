// ==UserScript==
// @name         Kaspersky TI AI Analyst
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Adds an "AI Deep Interpretation" button to Kaspersky Threat Intelligence Portal to analyze IOCs by scraping all page data.
// @author       ste
// @match        https://tip.kaspersky.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/552439/Kaspersky%20TI%20AI%20Analyst.user.js
// @updateURL https://update.greasyfork.org/scripts/552439/Kaspersky%20TI%20AI%20Analyst.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Polyfill for GM_addStyle ---
    if (typeof GM_addStyle === 'undefined') {
        window.GM_addStyle = (css) => {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        };
    }

    GM_addStyle(`
        .ai-deep-interpretation-btn {
            background-color: #007bff; /* Blue */
            border: none;
            color: white;
            padding: 4px 12px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 8px;
            transition: background-color 0.2s ease-in-out;
        }
        .ai-deep-interpretation-btn:hover {
            background-color: #0056b3;
        }
        #ai-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }
        #ai-modal-content {
            background-color: #fefefe;
            margin: 5% auto; /* Reduced margin for more vertical space */
            padding: 20px;
            border: 1px solid #888;
            width: 70%; /* Increased width */
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            max-width: 1200px; /* Increased max-width */
        }
        #ai-modal-content h2 {
            margin-top: 0;
            color: #333;
        }
        #log-input {
            width: 100%;
            height: 150px; /* Adjusted height */
            margin-bottom: 15px;
            padding: 10px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        #ai-analysis-result {
            margin-top: 15px;
            padding: 15px 20px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
            min-height: 200px;
            max-height: calc(100vh - 450px); /* Dynamic max height */
            white-space: normal;
            overflow-y: auto;
            color: #333;
            border-radius: 5px;
        }
        #ai-analysis-result h3 {
            font-size: 1.15em;
            font-weight: 600;
            color: #0056b3;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 8px;
            margin-top: 1.5em;
            margin-bottom: 1em;
        }
         #ai-analysis-result h3:first-child {
            margin-top: 0;
        }
        #ai-analysis-result p {
            margin-bottom: 1em;
            line-height: 1.6;
        }
        #ai-analysis-result ul {
            padding-left: 20px;
            margin-bottom: 1em;
        }
        #ai-analysis-result li {
            margin-bottom: 0.5em;
        }
        #ai-analysis-result strong {
            font-weight: 600;
            color: #000;
        }
        .close-btn {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }
        .close-btn:hover,
        .close-btn:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
        #analyze-btn-container {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        #loading-indicator {
            display: none;
            margin: 10px 0;
            color: #007bff;
        }
    `);

    function addAiButton() {
        const targetElementSelector = '.infra-ui-tabs-nav-list';
        const targetElement = document.querySelector(targetElementSelector);

        if (targetElement && !document.querySelector('.ai-deep-interpretation-btn-container')) {
            const listItem = document.createElement('div');
            listItem.className = 'infra-ui-tabs-tab ai-deep-interpretation-btn-container';
            listItem.style.marginLeft = '4px';

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'infra-ui-tabs-tab-btn';
            listItem.appendChild(buttonContainer);

            const button = document.createElement('button');
            button.innerText = 'AI深度解读';
            button.className = 'ai-deep-interpretation-btn';
            button.onclick = showAiModal;

            buttonContainer.appendChild(button);
            targetElement.appendChild(listItem);
        }
    }

    function showAiModal() {
        let modal = document.getElementById('ai-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'ai-modal';
            modal.innerHTML = `
                <div id="ai-modal-content">
                    <span class="close-btn">&times;</span>
                    <h2>AI 深度解读</h2>
                    <p>请输入您的日志内容:</p>
                    <textarea id="log-input" placeholder="在此处粘贴日志..."></textarea>
                    <div id="analyze-btn-container">
                         <button id="download-intel-btn" class="ai-deep-interpretation-btn" style="background-color: #6c757d;">下载情报 (JSON)</button>
                        <button id="analyze-btn" class="ai-deep-interpretation-btn">开始分析</button>
                    </div>
                    <div id="loading-indicator"></div>
                    <h3>分析结果:</h3>
                    <div id="ai-analysis-result"></div>
                    <div id="export-btn-container" style="display: flex; justify-content: flex-end; margin-top: 10px; display: none;">
                        <button id="export-btn" class="ai-deep-interpretation-btn">导出为 .txt</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.close-btn').onclick = () => {
                modal.style.display = 'none';
            };
            modal.querySelector('#analyze-btn').onclick = analyzeLogs;
            modal.querySelector('#download-intel-btn').onclick = downloadIntelForDebug;
            modal.querySelector('#export-btn').onclick = exportToTxt;
        }
        modal.style.display = 'block';
    }

     function downloadIntelForDebug() {
        const loadingIndicator = document.getElementById('loading-indicator');
        loadingIndicator.style.display = 'block';
        loadingIndicator.style.color = '#6c757d';
        loadingIndicator.textContent = "正在提取页面情报...";

        // 使用async/await处理异步函数
        (async () => {
            try {
                const pageThreatIntel = await extractThreatIntelFromPage();
                const dataStr = JSON.stringify(pageThreatIntel, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const mainIdentifier = document.querySelector('[data-testid="status-block-request"]')?.textContent.trim() ||
                                       'debug_data';
                a.download = `kaspersky_intel_${mainIdentifier}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                loadingIndicator.textContent = "情报数据已开始下载。";
                setTimeout(() => {
                    if (loadingIndicator.textContent === "情报数据已开始下载。") {
                        loadingIndicator.style.display = 'none';
                    }
                }, 2000);
            } catch (error) {
                loadingIndicator.textContent = `提取数据时出错: ${error.message}`;
                loadingIndicator.style.color = 'red';
                console.error(error);
            }
        })();
    }


    function exportToTxt() {
        const resultDiv = document.getElementById('ai-analysis-result');
        const textToExport = resultDiv.innerText;
        if (!textToExport) {
            console.log("No content to export.");
            return;
        }

        const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const mainIdentifier = document.querySelector('[data-testid="status-block-request"]')?.textContent.trim() ||
                               document.querySelector('[data-testid="FileGeneralInfo-row-Md5"] [data-testid="value"]')?.textContent.trim() ||
                               document.querySelector('.Ip_ipValue_b87452d3')?.textContent.trim() ||
                               'report';
        a.download = `ai_analysis_${mainIdentifier}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async function analyzeLogs() {
        const logInput = document.getElementById('log-input').value;
        const resultDiv = document.getElementById('ai-analysis-result');
        const loadingIndicator = document.getElementById('loading-indicator');
        resultDiv.innerHTML = '';
        document.getElementById('export-btn-container').style.display = 'none';
        loadingIndicator.style.display = 'block';
        loadingIndicator.style.color = '#007bff';

        const updateStatus = (message) => {
            loadingIndicator.textContent = message;
            console.log(message);
        };

        try {
            updateStatus('1. 获取原始日志...');
            const userIocs = extractIocsFromText(logInput);
            updateStatus('1. 获取原始日志... 完成');

            updateStatus('2. 从页面提取威胁情报...');
            const pageThreatIntel = await extractThreatIntelFromPage();
            updateStatus('2. 从页面提取威胁情报... 完成');

            const prompt = `
                请扮演一名高级安全分析师。请对以下安全日志以及从卡巴斯基威胁情报门户网站抓取的关联威胁情报数据进行深入分析。

                您的分析应涵盖以下几点:
                1.  **日志分析**: 用户提供的日志中发生了什么？观察到的直接威胁或行为是什么？
                2.  **情报关联**: 威胁情报数据（WHOIS、DNS解析、关联文件、TTPs等）如何丰富日志的上下文？请将日志中的IOC与页面数据关联起来。
                3.  **综合威胁评估**: 根据所有可用数据，潜在的威胁是什么？是否与恶意软件、网络钓鱼、C2通信等有关？
                4.  **处置建议**: 为安全操作员提供清晰、可行的调查和缓解此威胁的步骤。

                ---
                **用户提供的日志:**
                ---
                ${logInput || "未提供日志。"}
                ---

                **从页面提取的威胁情报数据:**
                ---
                ${JSON.stringify(pageThreatIntel, null, 2)}
                ---

                请以结构化、易于阅读的简体中文格式提供您的分析，并使用Markdown语法进行格式化。请使用 '###' 作为一级标题, '**' 用于加粗重点内容, 使用 '*' 创建无序列表。
            `;

            updateStatus('3. 深度分析 (调用AI)...');
            callOpenAiApi(prompt, updateStatus);
        } catch(error) {
             updateStatus(`分析过程中出错: ${error.message}`);
             loadingIndicator.style.color = 'red';
             console.error(error);
        }
    }


    async function extractThreatIntelFromPage() {
        const intel = {};

        // --- Report Type Detection ---
        if (document.querySelector('[data-testid="FileGeneralInfo-row-Md5"]')) {
            intel.report_type = "MD5 Hash Report";
            Object.assign(intel, scrapeHashReport());
        } else if (document.querySelector('.Ip_ipValue_b87452d3')) {
            intel.report_type = "IP Address Report";
            Object.assign(intel, scrapeIpReport());
        } else if (document.querySelector('[data-testid="status-block-request"]')) {
            intel.report_type = "Domain Report";
            Object.assign(intel, scrapeDomainReport());
        } else {
            intel.report_type = "Unknown";
            intel.error = "Could not determine report type.";
        }

        // --- Timeline Data Extraction (只对域名和IP报告提取时间线) ---
        if (intel.report_type === "Domain Report" || intel.report_type === "IP Address Report") {
            try {
                console.log('Attempting to extract timeline data...');
                const timelineData = await extractTimelineData();
                if (timelineData && timelineData.length > 0) {
                    intel.timeline_events = timelineData;
                    console.log(`Successfully extracted ${timelineData.length} timeline events`);
                } else {
                    console.log('No timeline data found, continuing with other data extraction');
                    intel.timeline_status = 'No timeline data available';
                }
            } catch (error) {
                console.warn('Timeline extraction failed, continuing with other data:', error);
                intel.timeline_status = 'Timeline extraction failed';
                // 不将时间线错误作为致命错误，继续提取其他数据
            }
        } else {
            console.log('Timeline extraction skipped for this report type (only available for Domain and IP reports)');
            intel.timeline_status = 'Timeline not available for this report type';
        }

        return intel;
    }

    // 添加时间线数据提取函数
    async function extractTimelineData() {
        const timelineEvents = [];

        console.log('Starting timeline data extraction...');

        // 查找时间线容器 - 使用更广泛的选择器
        let timelineContainer = null;
        const containerSelectors = [
            '.Timeline_timeline_b6b8b5b8',
            '[class*="Timeline"]',
            '[class*="timeline"]',
            '.timeline-container',
            'svg[class*="timeline"]',
            'svg[class*="Timeline"]',
            '[data-testid*="timeline"]',
            '[data-testid*="Timeline"]'
        ];

        for (const selector of containerSelectors) {
            timelineContainer = document.querySelector(selector);
            if (timelineContainer) {
                console.log(`Timeline container found with selector: ${selector}`);
                break;
            }
        }

        if (!timelineContainer) {
            timelineContainer = document.body;
            console.log('No specific timeline container found, using document.body');
        }

        // 查找所有可能的红色块 - 使用更全面的选择器
        let redBlocks = [];

        // 方法1: 查找SVG rect元素（时间线通常使用SVG）
        const svgRects = timelineContainer.querySelectorAll('rect');
        console.log(`Found ${svgRects.length} SVG rect elements`);

        svgRects.forEach((rect, index) => {
            const fill = rect.getAttribute('fill') || rect.style.fill;
            const color = rect.getAttribute('color') || rect.style.color;
            const computedStyle = window.getComputedStyle(rect);
            const computedFill = computedStyle.fill;

            console.log(`  Rect ${index}: fill="${fill}", color="${color}", computedFill="${computedFill}"`);

            // 检查是否为目标红色 - 特别匹配 rgba(255, 231, 217, 1)
            const isTargetColor = (value) => {
                if (!value) return false;
                return value.includes('rgba(255, 231, 217, 1)') ||
                       value.includes('rgba(255, 231, 217)') ||
                       value.includes('rgb(255, 231, 217)') ||
                       value.includes('255, 231, 217');
            };

            // 扩展的红色匹配条件
            const isRedFill = fill && (
                isTargetColor(fill) ||
                fill.includes('#ff') ||
                fill.includes('#FF') ||
                fill.includes('rgb(255') ||
                fill.includes('rgba(255') ||
                fill.includes('red') ||
                fill.includes('Red') ||
                fill.includes('#e74c3c') ||
                fill.includes('#dc3545') ||
                fill.includes('#f44336')
            );

            const isRedColor = color && (
                isTargetColor(color) ||
                color.includes('rgb(255') ||
                color.includes('rgba(255') ||
                color.includes('red')
            );

            const isRedComputed = computedFill && (
                isTargetColor(computedFill) ||
                computedFill.includes('rgb(255') ||
                computedFill.includes('rgba(255') ||
                computedFill.includes('red') ||
                (computedFill !== 'rgba(0, 0, 0, 0)' && computedFill !== 'none')
            );

            if (isRedFill) {
                redBlocks.push(rect);
                console.log(`Found red rect with fill: ${fill}`);
            } else if (isRedColor) {
                redBlocks.push(rect);
                console.log(`Found red rect with color: ${color}`);
            } else if (isRedComputed) {
                redBlocks.push(rect);
                console.log(`Found red rect with computed fill: ${computedFill}`);
            }

            // 如果没有找到红色，但rect有宽度和高度，也可能是威胁块
            const width = rect.getAttribute('width') || rect.getBBox().width;
            const height = rect.getAttribute('height') || rect.getBBox().height;
            if (width > 0 && height > 0 && !isRedFill && !isRedColor && !isRedComputed) {
                // 检查是否在威胁相关的父容器中
                const parentClasses = rect.closest('g')?.getAttribute('class') || '';
                if (parentClasses.includes('threat') || parentClasses.includes('attack') ||
                    parentClasses.includes('malicious') || parentClasses.includes('danger')) {
                    redBlocks.push(rect);
                    console.log(`Found potential threat rect by context: width=${width}, height=${height}, parent=${parentClasses}`);
                }
            }
        });

        // 方法2: 通过背景色查找div元素
        const colorSelectors = [
            '[style*="rgba(255, 231, 217"]',
            '[style*="rgb(255, 231, 217)"]',
            '[style*="background-color: rgba(255, 231, 217"]',
            '[style*="background: rgba(255, 231, 217"]',
            '[style*="#ff"]',
            '[style*="red"]'
        ];

        colorSelectors.forEach(selector => {
            const elements = timelineContainer.querySelectorAll(selector);
            elements.forEach(el => {
                if (!redBlocks.includes(el)) {
                    redBlocks.push(el);
                    console.log(`Found element with color selector: ${selector}`);
                }
            });
        });

        // 方法3: 通过类名查找
        const classSelectors = [
            '[class*="red"]',
            '[class*="Red"]',
            '[class*="danger"]',
            '[class*="Danger"]',
            '[class*="threat"]',
            '[class*="Threat"]',
            '[class*="attack"]',
            '[class*="Attack"]',
            '[class*="malicious"]',
            '[class*="Malicious"]'
        ];

        classSelectors.forEach(selector => {
            const elements = timelineContainer.querySelectorAll(selector);
            elements.forEach(el => {
                if (!redBlocks.includes(el)) {
                    redBlocks.push(el);
                    console.log(`Found element with class selector: ${selector}, class: ${el.className}`);
                }
            });
        });

        // 方法4: 通过计算样式查找红色块
        const allElements = timelineContainer.querySelectorAll('*');
        console.log(`Scanning ${allElements.length} elements for red colors...`);

        let scannedCount = 0;
        allElements.forEach(el => {
            if (scannedCount < 200) { // 增加扫描数量
                const computedStyle = window.getComputedStyle(el);
                const bgColor = computedStyle.backgroundColor;
                const fill = computedStyle.fill;
                const color = computedStyle.color;
                const borderColor = computedStyle.borderColor;

                // 检查是否为目标红色 - 特别匹配 rgba(255, 231, 217, 1)
                const isTargetColor = (value) => {
                    if (!value) return false;
                    return value.includes('rgba(255, 231, 217, 1)') ||
                           value.includes('rgba(255, 231, 217)') ||
                           value.includes('rgb(255, 231, 217)') ||
                           value.includes('255, 231, 217');
                };

                // 更全面的红色检测
                const isRedBackground = bgColor && (
                    isTargetColor(bgColor) ||
                    bgColor.includes('rgb(255') ||
                    bgColor.includes('rgba(255') ||
                    bgColor.includes('red') ||
                    bgColor.includes('#ff') ||
                    bgColor.includes('#FF') ||
                    bgColor.includes('#e74c3c') ||
                    bgColor.includes('#dc3545') ||
                    bgColor.includes('#f44336')
                );

                const isRedFill = fill && (
                    isTargetColor(fill) ||
                    fill.includes('rgb(255') ||
                    fill.includes('rgba(255') ||
                    fill.includes('red') ||
                    fill.includes('#ff') ||
                    fill.includes('#FF')
                );

                const isRedBorder = borderColor && (
                    isTargetColor(borderColor) ||
                    borderColor.includes('rgb(255') ||
                    borderColor.includes('red') ||
                    borderColor.includes('#ff')
                );

                if (isRedBackground || isRedFill || isRedBorder) {
                    if (!redBlocks.includes(el)) {
                        redBlocks.push(el);
                        console.log(`Found red element: ${el.tagName}, bg: ${bgColor}, fill: ${fill}, border: ${borderColor}`);
                    }
                }

                // 特殊检查：如果是rect元素且有任何非透明颜色
                if (el.tagName.toLowerCase() === 'rect') {
                    const hasColor = (fill && fill !== 'none' && fill !== 'rgba(0, 0, 0, 0)') ||
                                   (bgColor && bgColor !== 'rgba(0, 0, 0, 0)');
                    if (hasColor && !redBlocks.includes(el)) {
                        redBlocks.push(el);
                        console.log(`Found colored rect: ${el.tagName}, fill: ${fill}, bg: ${bgColor}`);
                    }
                }

                scannedCount++;
            }
        });

        console.log(`Total red blocks found: ${redBlocks.length}`);

        if (redBlocks.length === 0) {
            console.log('No red blocks found. Trying to find any interactive timeline elements...');

            // 备用方法：查找所有可能的时间线块元素
            const potentialSelectors = [
                'rect[width]',
                'div[style*="width"]',
                '[class*="block"]',
                '[class*="Block"]',
                '[class*="item"]',
                '[class*="Item"]',
                '[data-testid]',
                '[data-tooltip]',
                '[title]'
            ];

            potentialSelectors.forEach(selector => {
                const elements = timelineContainer.querySelectorAll(selector);
                console.log(`Found ${elements.length} elements with selector: ${selector}`);

                // 检查前5个元素
                for (let i = 0; i < Math.min(5, elements.length); i++) {
                    const el = elements[i];
                    const style = window.getComputedStyle(el);
                    console.log(`  Element ${i}: ${el.tagName}, bg: ${style.backgroundColor}, classes: ${el.className}`);
                }
            });

            return timelineEvents;
        }

        console.log(`Processing ${redBlocks.length} red blocks...`);

        // 遍历每个红色块
        for (let i = 0; i < redBlocks.length; i++) {
            const block = redBlocks[i];

            try {
                console.log(`Processing block ${i + 1}/${redBlocks.length}`);

                // 确保元素可见
                block.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(resolve => setTimeout(resolve, 200));

                // 模拟鼠标悬停
                const rect = block.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const mouseEvents = [
                    new MouseEvent('mouseenter', {
                        bubbles: true,
                        cancelable: true,
                        clientX: centerX,
                        clientY: centerY
                    }),
                    new MouseEvent('mouseover', {
                        bubbles: true,
                        cancelable: true,
                        clientX: centerX,
                        clientY: centerY
                    }),
                    new MouseEvent('mousemove', {
                        bubbles: true,
                        cancelable: true,
                        clientX: centerX,
                        clientY: centerY
                    })
                ];

                // 触发所有悬停事件
                mouseEvents.forEach(event => block.dispatchEvent(event));

                // 等待tooltip出现
                await new Promise(resolve => setTimeout(resolve, 500));

                // 查找tooltip - 使用更全面的选择器
                const tooltipSelectors = [
                    '.TimelineTooltip_tooltipContent_f956d4de',
                    '[class*="TimelineTooltip"]',
                    '[class*="tooltip"]',
                    '[class*="Tooltip"]',
                    '.tooltip',
                    '[role="tooltip"]'
                ];

                let tooltip = null;
                for (const selector of tooltipSelectors) {
                    tooltip = document.querySelector(selector);
                    if (tooltip) break;
                }

                if (tooltip) {
                    console.log('Tooltip found, extracting data...');

                    // 提取时间信息
                    const timeSelectors = [
                        '.TimelineTooltip_tooltipContentDate_5843ec05',
                        '[class*="tooltipContentDate"]',
                        '[class*="date"]',
                        '[class*="time"]'
                    ];

                    let time = null;
                    for (const selector of timeSelectors) {
                        const timeElement = tooltip.querySelector(selector);
                        if (timeElement) {
                            time = timeElement.textContent.trim();
                            break;
                        }
                    }

                    // 提取攻击类型
                    const categorySelectors = [
                        '.TimelineTooltip_tags_bcc24f11',
                        '[class*="tags"]',
                        '[class*="categories"]'
                    ];

                    const attackTypes = [];

                    for (const selector of categorySelectors) {
                        const categoryContainer = tooltip.querySelector(selector);
                        if (categoryContainer) {
                            const tags = categoryContainer.querySelectorAll('span');
                            tags.forEach(tag => {
                                const attackType = tag.textContent.trim();
                                if (attackType &&
                                    attackType !== '类别' &&
                                    attackType !== 'Category' &&
                                    !attackTypes.includes(attackType)) {
                                    attackTypes.push(attackType);
                                }
                            });
                            break;
                        }
                    }

                    // 如果找到了有效数据，添加到结果中
                    if (time && attackTypes.length > 0) {
                        timelineEvents.push({
                            timestamp: time,
                            attack_types: attackTypes,
                            block_index: i
                        });
                        console.log(`✓ Extracted event ${i + 1}: ${time} - ${attackTypes.join(', ')}`);
                    } else {
                        console.log(`✗ Block ${i + 1}: No valid data found (time: ${time}, types: ${attackTypes.length})`);
                    }
                } else {
                    console.log(`✗ Block ${i + 1}: No tooltip found`);
                }

                // 移除悬停状态
                const mouseLeaveEvent = new MouseEvent('mouseleave', {
                    bubbles: true,
                    cancelable: true
                });
                block.dispatchEvent(mouseLeaveEvent);

                // 短暂延迟避免过快操作
                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (error) {
                console.warn(`Error processing block ${i}:`, error);
            }
        }

        console.log(`Timeline extraction completed. Found ${timelineEvents.length} events out of ${redBlocks.length} blocks.`);
        return timelineEvents;
    }
    const getText = (selector, parent = document) => {
        const element = parent.querySelector(selector);
        const text = element ? element.textContent.trim() : null;
        return (text === '—' || text === '') ? null : text;
    };

    // Helper for parsing simple key-value blocks
    const parseKeyValueBlock = (containerSelector) => {
        const container = document.querySelector(containerSelector);
        if (!container) return null;
        const data = {};
        const rows = container.querySelectorAll('.sc-iqseJM, .infra-ui-key-value-row');
        rows.forEach(row => {
            const keyEl = row.querySelector('[data-testid="key"], .infra-ui-key-value-key');
            const valueEl = row.querySelector('[data-testid="value"], .infra-ui-key-value-value');
            if (keyEl && valueEl) {
                let key = keyEl.textContent.trim().replace(/\s+/g, '_').toLowerCase();
                let value = valueEl.textContent.trim();
                if (value !== '—' && value !== '') {
                    data[key] = value;
                }
            }
        });
        return Object.keys(data).length > 0 ? data : null;
    };

    // Helper for parsing generic tables
    const parseTable = (tableSelector, columnMappings) => {
        const table = document.querySelector(tableSelector);
        if (!table) return [];
        const tableBody = table.querySelector('.ant-table-tbody');
        if (!tableBody) return [];
        const items = [];
        const rows = tableBody.querySelectorAll('tr.ant-table-row');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const item = {};
            let hasData = false;
            columnMappings.forEach((mapping, index) => {
                if (cells[index]) {
                    const text = cells[index].textContent.trim();
                    if (text !== '—' && text !== '') {
                        item[mapping.key] = text.replace(/\s+/g, ' '); // Normalize whitespace
                        hasData = true;
                    }
                }
            });
            if (hasData) {
                items.push(item);
            }
        });
        return items;
    };


    function scrapeDomainReport() {
        const data = {};

        // 概览信息
        data.overview = parseKeyValueBlock('[data-testid="OverviewBlock"]');

        // 统计信息
        const statsBlock = parseKeyValueBlock('[data-testid="StatisticsBlock"]');
        if (statsBlock) data.statistics = statsBlock;

        // WHOIS信息
        const whoisData = parseKeyValueBlock('[data-testid="lookup-hostWhoIsInfo_table"]');
        const whoisContacts = parseTable('[data-testid="lookup-hostWhoIsInfo_table"]', [
            { key: 'type' }, { key: 'name' }, { key: 'organization' }, { key: 'address' }, { key: 'phone_fax' }, { key: 'email' }
        ]);
        if(whoisData || whoisContacts.length > 0) data.whois = {...whoisData, contacts: whoisContacts};

        // DNS解析
        const dnsResolutions = parseTable('[data-testid="lookup-hostPdnsIps_table"]', [
            { key: 'status' }, { key: 'threat_score' }, { key: 'hits' }, { key: 'ip' },
            { key: 'first_seen' }, { key: 'last_seen' }, { key: 'peak_date' }, { key: 'daily_peak' }
        ]);
        if(dnsResolutions.length > 0) data.dns_resolutions = dnsResolutions;

        // 从所请求域名下载的文件
        const downloadedFiles = parseTable('[data-testid="lookup-hostFiles_table"]', [
            { key: 'status' }, { key: 'threat_score' }, { key: 'md5' },
            { key: 'first_seen' }, { key: 'last_seen' }, { key: 'detections' }, { key: 'hits' }
        ]);
        if(downloadedFiles.length > 0) data.downloaded_files = downloadedFiles;

        // 访问了所请求域名的文件
        const visitingFiles = parseTable('[data-testid="lookup-hostDownloaders_table"]', [
            { key: 'status' }, { key: 'hits' }, { key: 'md5' },
            { key: 'first_seen' }, { key: 'last_seen' }, { key: 'detections' }
        ]);
        if(visitingFiles.length > 0) data.visiting_files = visitingFiles;

        // 子域名
        const subDomains = parseTable('[data-testid="lookup-hostSubDomains_table"]', [
            { key: 'status' }, { key: 'subdomain' }
        ]);
        if(subDomains.length > 0) data.subdomains = subDomains;

        // 对域名的引用
        const referredBy = parseTable('[data-testid="lookup-hostReferredBy_table"]', [
            { key: 'status' }, { key: 'url' }
        ]);
        if(referredBy.length > 0) data.referred_by = referredBy;

        // 域名引用的以下网址
        const referredTo = parseTable('[data-testid="lookup-hostReferredTo_table"]', [
            { key: 'status' }, { key: 'url' }
        ]);
        if(referredTo.length > 0) data.referred_to = referredTo;

        // 网址掩码
        const urlMasks = parseTable('[data-testid="lookup-hostFeedMasks_table"]', [
            { key: 'status' }, { key: 'mask' }, { key: 'feed' }, { key: 'context' }
        ]);
        if(urlMasks.length > 0) data.url_masks = urlMasks;

        // 相似域名
        const similarDomains = parseTable('[data-testid="lookup-hostSimilarDomains_table"]', [
            { key: 'status' }, { key: 'domain' }, { key: 'registered' }, { key: 'expires' }, { key: 'port_status' }
        ]);
        if(similarDomains.length > 0) data.similar_domains = similarDomains;

        // 垃圾邮件攻击
        const spamAttacks = parseTable('[data-testid="lookup-hostSpamAttacks_table"]', [
            { key: 'status' }, { key: 'attack_type' }, { key: 'first_seen' }, { key: 'last_seen' }, { key: 'hits' }
        ]);
        if(spamAttacks.length > 0) data.spam_attacks = spamAttacks;

        // 垃圾邮件攻击统计
        const spamStats = parseKeyValueBlock('[data-testid="SpamStatisticsBlock"]');
        if (spamStats) data.spam_statistics = spamStats;

        // 钓鱼攻击
        const phishingAttacks = parseTable('[data-testid="lookup-hostPhishingAttacks_table"]', [
            { key: 'status' }, { key: 'attack_type' }, { key: 'first_seen' }, { key: 'last_seen' }, { key: 'hits' }
        ]);
        if(phishingAttacks.length > 0) data.phishing_attacks = phishingAttacks;

        // 钓鱼攻击统计
        const phishingStats = parseKeyValueBlock('[data-testid="PhishingStatisticsBlock"]');
        if (phishingStats) data.phishing_statistics = phishingStats;

        return data;
    }

    function scrapeIpReport() {
        const data = {};

        // 概览信息
        data.overview = parseKeyValueBlock('[data-testid="OverviewBlock"]');

        // 统计信息
        const statsBlock = parseKeyValueBlock('[data-testid="StatisticsBlock"]');
        if (statsBlock) data.statistics = statsBlock;

        // WHOIS信息
        const whoisData = parseKeyValueBlock('[data-testid="lookup-ipWhoIsInfo_table"]');
        const whoisContacts = parseTable('[data-testid="lookup-ipWhoIsInfo_table"]', [
            { key: 'type' }, { key: 'name' }, { key: 'organization' }, { key: 'address' }, { key: 'phone_fax' }, { key: 'email' }
        ]);
        if(whoisData || whoisContacts.length > 0) data.whois = {...whoisData, contacts: whoisContacts};

        // IP地址的DNS解析
        const dnsResolutions = parseTable('[data-testid="lookup-ipPdns_table"]', [
            { key: 'status' }, { key: 'domain' }, { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(dnsResolutions.length > 0) data.dns_resolutions = dnsResolutions;

        // 与IP地址相关的文件
        const relatedFiles = parseTable('[data-testid="lookup-ipFiles_table"]', [
            { key: 'status' }, { key: 'threat_score' }, { key: 'md5' },
            { key: 'first_seen' }, { key: 'last_seen' }, { key: 'detections' }, { key: 'hits' }
        ]);
        if(relatedFiles.length > 0) data.related_files = relatedFiles;

        // 托管的网址
        const hostedUrls = parseTable('[data-testid="lookup-ipUrls_table"]', [
            { key: 'status' }, { key: 'url' }, { key: 'first_seen' }, { key: 'last_seen' }, { key: 'hits' }
        ]);
        if(hostedUrls.length > 0) data.hosted_urls = hostedUrls;

        // 网址掩码
        const urlMasks = parseTable('[data-testid="lookup-ipFeedMasks_table"]', [
            { key: 'status' }, { key: 'mask' }, { key: 'feed' }, { key: 'context' }
        ]);
        if(urlMasks.length > 0) data.url_masks = urlMasks;

        // 垃圾邮件攻击
        const spamAttacks = parseTable('[data-testid="lookup-ipSpamAttacks_table"]', [
            { key: 'status' }, { key: 'attack_type' }, { key: 'first_seen' }, { key: 'last_seen' }, { key: 'hits' }
        ]);
        if(spamAttacks.length > 0) data.spam_attacks = spamAttacks;

        // 垃圾邮件攻击统计
        const spamStats = parseKeyValueBlock('[data-testid="SpamStatisticsBlock"]');
        if (spamStats) data.spam_statistics = spamStats;

        // 钓鱼攻击
        const phishingAttacks = parseTable('[data-testid="lookup-ipPhishingAttacks_table"]', [
            { key: 'status' }, { key: 'attack_type' }, { key: 'first_seen' }, { key: 'last_seen' }, { key: 'hits' }
        ]);
        if(phishingAttacks.length > 0) data.phishing_attacks = phishingAttacks;

        // 钓鱼攻击统计
        const phishingStats = parseKeyValueBlock('[data-testid="PhishingStatisticsBlock"]');
        if (phishingStats) data.phishing_statistics = phishingStats;

        return data;
    }

    function scrapeHashReport(){
        const data = {};

        // 概览信息
        const generalInfoBlock = document.querySelector('[data-testid="FileGeneralInfo-row-Md5"]')?.closest('.TipCard_card_53d37aad');
        if (generalInfoBlock) {
           data.overview = parseKeyValueBlock('[data-testid="FileGeneralInfo-row-Md5"]');
        }

        // 统计信息
        const statsBlock = parseKeyValueBlock('[data-testid="StatisticsBlock"]');
        if (statsBlock) data.statistics = statsBlock;

        // 被利用的漏洞
        const vulnerabilities = parseTable('[data-testid="lookup-fileVulnerabilities_table"]', [
            { key: 'status' }, { key: 'cve_id' }, { key: 'severity' }, { key: 'description' },
            { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(vulnerabilities.length > 0) data.exploited_vulnerabilities = vulnerabilities;

        // 检测名称
        const detections = parseTable('[data-testid="lookup-fileDetections_table"]', [
            { key: 'status' }, { key: 'detection_name' }, { key: 'type' },
            { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(detections.length > 0) data.detection_names = detections;

        // TTP详情
        const ttpDetails = parseTable('[data-testid="lookup-fileTtps_table"]', [
            { key: 'status' }, { key: 'technique_id' }, { key: 'technique_name' },
            { key: 'tactic' }, { key: 'description' }
        ]);
        if(ttpDetails.length > 0) data.ttp_details = ttpDetails;

        // 文件签名和证书
        const fileSignatures = parseKeyValueBlock('[data-testid="FileSignatureBlock"]');
        if (fileSignatures) data.file_signatures_and_certificates = fileSignatures;

        // 容器签名和证书
        const containerSignatures = parseKeyValueBlock('[data-testid="ContainerSignatureBlock"]');
        if (containerSignatures) data.container_signatures_and_certificates = containerSignatures;

        // 文件名
        const filenames = parseTable('[data-testid="lookup-fileNames_table"]', [
            { key: 'status' }, { key: 'filename' }, { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(filenames.length > 0) data.filenames = filenames;

        // 文件路径
        const filePaths = parseTable('[data-testid="lookup-filePaths_table"]', [
            { key: 'status' }, { key: 'path' }, { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(filePaths.length > 0) data.file_paths = filePaths;

        // 文件下载自的网址和域名
        const downloadedFrom = parseTable('[data-testid="lookup-fileOrigins_table"]', [
            { key: 'status' }, { key: 'url' }, { key: 'first_seen' }, { key: 'last_seen' }, { key: 'hits' }
        ]);
        if(downloadedFrom.length > 0) data.downloaded_from_urls_and_domains = downloadedFrom;

        // 文件下载了以下对象
        const downloads = parseTable('[data-testid="lookup-fileDropped_table"]', [
            { key: 'md5' }, { key: 'filename' }, { key: 'size' }, { key: 'detections' }
        ]);
        if(downloads.length > 0) data.file_downloaded_objects = downloads;

        // 文件访问了以下网址
        const contactedUrls = parseTable('[data-testid="lookup-fileCnc_table"]', [
            { key: 'status' }, { key: 'url' }, { key: 'ip' }, { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(contactedUrls.length > 0) data.file_accessed_urls = contactedUrls;

        // 文件启动了以下对象
        const launchedObjects = parseTable('[data-testid="lookup-fileLaunched_table"]', [
            { key: 'status' }, { key: 'md5' }, { key: 'filename' }, { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(launchedObjects.length > 0) data.file_launched_objects = launchedObjects;

        // 文件被以下对象启动
        const launchedBy = parseTable('[data-testid="lookup-fileLaunchedBy_table"]', [
            { key: 'status' }, { key: 'md5' }, { key: 'filename' }, { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(launchedBy.length > 0) data.file_launched_by_objects = launchedBy;

        // 文件被以下对象下载
        const downloadedBy = parseTable('[data-testid="lookup-fileDownloadedBy_table"]', [
            { key: 'status' }, { key: 'md5' }, { key: 'filename' }, { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(downloadedBy.length > 0) data.file_downloaded_by_objects = downloadedBy;

        // 文件从以下对象中解包
        const unpackedFrom = parseTable('[data-testid="lookup-fileUnpackedFrom_table"]', [
            { key: 'status' }, { key: 'md5' }, { key: 'filename' }, { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(unpackedFrom.length > 0) data.file_unpacked_from_objects = unpackedFrom;

        // 文件包含以下对象
        const containsObjects = parseTable('[data-testid="lookup-fileContains_table"]', [
            { key: 'status' }, { key: 'md5' }, { key: 'filename' }, { key: 'size' }, { key: 'detections' }
        ]);
        if(containsObjects.length > 0) data.file_contains_objects = containsObjects;

        // 文件已附加到电子邮件
        const emailAttachments = parseTable('[data-testid="lookup-fileEmailAttachments_table"]', [
            { key: 'status' }, { key: 'email_subject' }, { key: 'sender' }, { key: 'first_seen' }, { key: 'last_seen' }
        ]);
        if(emailAttachments.length > 0) data.file_attached_to_emails = emailAttachments;

        // 相似文件
        const similarFiles = parseTable('[data-testid="lookup-fileSimilar_table"]', [
            { key: 'status' }, { key: 'md5' }, { key: 'similarity_score' }, { key: 'detections' }
        ]);
        if(similarFiles.length > 0) data.similar_files = similarFiles;

        return data;
    }

    function extractIocsFromText(text) {
        if(!text) return {};
        const iocs = {
            ipv4: [],
            domain: [],
            hash_md5: [],
            hash_sha1: [],
            hash_sha256: [],
            url: []
        };
        const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
        const domainRegex = /\b([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/g;
        const md5Regex = /\b[a-fA-F0-9]{32}\b/g;
        const sha1Regex = /\b[a-fA-F0-9]{40}\b/g;
        const sha256Regex = /\b[a-fA-F0-9]{64}\b/g;
        const urlRegex = /https?:\/\/[^\s]+/g;

        iocs.ipv4 = [...new Set(text.match(ipRegex) || [])];
        iocs.domain = [...new Set(text.match(domainRegex) || [])].filter(d => !/^\d+\.\d+$/.test(d) && d.includes('.'));
        iocs.hash_md5 = [...new Set(text.match(md5Regex) || [])];
        iocs.hash_sha1 = [...new Set(text.match(sha1Regex) || [])];
        iocs.hash_sha256 = [...new Set(text.match(sha256Regex) || [])];
        iocs.url = [...new Set(text.match(urlRegex) || [])];

        return iocs;
    }

    function renderMarkdown(text) {
        let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const lines = html.split('\n');
        let inList = false;
        let processedHtml = '';

        lines.forEach(line => {
            if (line.startsWith('### ')) {
                if (inList) { processedHtml += '</ul>\n'; inList = false; }
                processedHtml += `<h3>${line.substring(4)}</h3>\n`;
                return;
            }
            if (line.startsWith('* ')) {
                if (!inList) { processedHtml += '<ul>\n'; inList = true; }
                let listItem = line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                processedHtml += `<li>${listItem}</li>\n`;
                return;
            }
            if (inList) { processedHtml += '</ul>\n'; inList = false; }
            if (line.trim() !== '') {
                let paragraph = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                processedHtml += `<p>${paragraph}</p>\n`;
            }
        });
        if (inList) { processedHtml += '</ul>\n'; }
        return processedHtml;
    }

    function callOpenAiApi(prompt, updateStatus) {
        updateStatus('4. 生成结果...');
        const resultDiv = document.getElementById('ai-analysis-result');
        const loadingIndicator = document.getElementById('loading-indicator');

        const API_URL = "http://124.221.92.110:30011/proxy/cerebras/v1/chat/completions";
        const API_KEY = "Cn@31415926";
        const MODEL_NAME = "qwen-3-235b-a22b-instruct-2507";

        if (!API_KEY || API_KEY === "在这里填入你的API_KEY") {
            resultDiv.textContent = '错误：API密钥未设置。请在脚本中编辑并添加您的 API 密钥。';
            loadingIndicator.style.display = 'none';
            return;
        }

        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            data: JSON.stringify({
                "model": MODEL_NAME,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful security analyst."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }),
            onload: function(response) {
                updateStatus('5. 生成完毕');
                setTimeout(() => { loadingIndicator.style.display = 'none'; }, 2000);

                try {
                    const data = JSON.parse(response.responseText);

                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        const text = data.choices[0].message.content;
                        resultDiv.innerHTML = renderMarkdown(text);
                        document.getElementById('export-btn-container').style.display = 'flex';
                        resultDiv.style.color = '#333';
                    }
                    else if (data.code === "UPSTREAM_ERROR" && data.message) {
                         try {
                            const upstreamErrors = JSON.parse(data.message);
                            const upstreamError = upstreamErrors[0];
                            if (upstreamError && upstreamError.error && upstreamError.error.message) {
                                 throw new Error(`上游 API 错误: ${upstreamError.error.message}`);
                            } else {
                                 throw new Error(`收到一个无法解析的上游 API 错误: ${data.message}`);
                            }
                        } catch (innerError) {
                            throw new Error(`处理上游 API 错误时失败: ${data.message}`);
                        }
                    }
                    else if (data.error) {
                       throw new Error(`API 返回错误: ${data.error.message || JSON.stringify(data.error)}`);
                    }
                    else {
                        throw new Error('收到了来自 API 的未知响应格式。');
                    }
                } catch (e) {
                    console.error('解析或处理 AI 响应时出错:', e);
                    console.error('原始响应:', response.responseText);
                    resultDiv.innerHTML = `<p style="color: red;">解析或处理 AI 响应时出错: <br>${e.message}<br><br>请检查浏览器控制台获取更详细的原始响应。</p>`;
                }
            },
            onerror: function(error) {
                loadingIndicator.style.display = 'none';
                console.error('调用AI API时出错:', error);
                resultDiv.innerHTML = '<p style="color: red;">调用AI API时出错。请检查网络连接、API配置或浏览器控制台获取更多信息。</p>';
            }
        });
    }

    const observer = new MutationObserver((mutations, obs) => {
        const lookupTab = document.querySelector('[data-node-key="lookup"][class*="infra-ui-tabs-tab-active"]');
        if (lookupTab) {
            addAiButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
