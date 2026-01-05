// ==UserScript==
// @name         行业翻译及检查
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  监控网站推广数据并在页面添加检查按钮，避免重复翻译
// @author       sheire
// @match        https://feature-goodspi-10467.goodspi-aso-test.umlife.com/websitePromote*
// @match        https://feature-goodspi-10467.goodspi-aso-test.umlife.com/shopFlow*
// @match        https://app.goodsfox.com/websitePromote*
// @match        https://app.goodsfox.com/shopFlow*
// @grant        GM_xmlhttpRequest
// @connect      dashscope.aliyuncs.com
// @downloadURL https://update.greasyfork.org/scripts/558614/%E8%A1%8C%E4%B8%9A%E7%BF%BB%E8%AF%91%E5%8F%8A%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/558614/%E8%A1%8C%E4%B8%9A%E7%BF%BB%E8%AF%91%E5%8F%8A%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储提取的数据
    let shopData = [];

    // 翻译缓存 - 存储已翻译的内容
    let translationCache = new Map();

    // 提取缓存 - 存储已提取的内容
    let extractCache = new Map();

    // 缓存键生成函数
    function generateCacheKey(item) {
        return `${item.name}|${item.description}`;
    }

    // 创建弹窗元素
    function createModal() {
        // 如果模态框已存在，直接返回
        if (document.getElementById('shopDataModal')) {
            return {
                modal: document.getElementById('shopDataModal'),
                tbody: document.getElementById('shopDataModal').querySelector('tbody')
            };
        }

        const modal = document.createElement('div');
        modal.id = 'shopDataModal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 9999;
            left: 10%;
            top: 10%;
            width: 80%;
            height: 80%;
            background-color: rgba(0,0,0,0.4);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: #fefefe;
            margin: 0;
            padding: 20px;
            border: 1px solid #888;
            width: 100%;
            height: 100%;
            overflow: auto;
            display: flex;
            flex-direction: column;
        `;

        const tableContainer = document.createElement('div');
        tableContainer.style.cssText = `
            flex: 1;
            overflow: auto;
        `;

        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
        `;

        const header = table.createTHead();
        const headerRow = header.insertRow();

        const headers = ['host', 'website', 'translate', 'category'];
        const widths = ['10%', '35%', '35%', '10%'];

        headers.forEach((text, index) => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.cssText = `
                border: 1px solid #ddd;
                padding: 8px;
                width: ${widths[index]};
                text-align: left;
            `;
            headerRow.appendChild(th);
        });

        const tbody = document.createElement('tbody');
        tbody.id = 'shop-data-tbody';
        table.appendChild(tbody);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            text-align: center;
            padding: 10px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            background-color: #aaa;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-right: 10px;
        `;
        closeBtn.onclick = () => modal.style.display = 'none';

        // 添加关闭所有小窗口按钮
        const closeAllWindowsBtn = document.createElement('button');
        closeAllWindowsBtn.textContent = '关闭全部小窗口';
        closeAllWindowsBtn.style.cssText = `
            background-color: #dc3545;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        `;
        closeAllWindowsBtn.onclick = closeAllPopupWindows;

        buttonContainer.appendChild(closeBtn);
        buttonContainer.appendChild(closeAllWindowsBtn);

        tableContainer.appendChild(table);
        modalContent.appendChild(tableContainer);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // 点击模态框外部关闭
        modal.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        return { modal, tbody };
    }

    // 通用函数处理API响应
    function processApiResponse(response, emptyResultMessage) {
        let result = emptyResultMessage;

        // 尝试不同的响应结构
        if (response.output?.text) {
            result = response.output.text;
        } else if (response.output?.choices?.[0]?.message?.content) {
            result = response.output.choices[0].message.content;
        } else if (response.data?.choices?.[0]?.message?.content) {
            result = response.data.choices[0].message.content;
        } else if (response.choices?.[0]?.message?.content) {
            result = response.choices[0].message.content;
        } else if (response.result) {
            result = response.result;
        } else if (response.data?.text) {
            result = response.data.text;
        } else if (response.message) {
            result = response.message;
        } else if (typeof response === 'string') {
            result = response;
        }

        // 如果仍然为空，记录完整的响应内容以便调试
        // 只在调试时启用详细日志
        // if (result === emptyResultMessage) {
        //     console.warn(`未能从响应中提取结果，完整响应:`, JSON.stringify(response, null, 2));
        // }

        return result;
    }

    // 调用百炼应用API进行翻译
    async function translateWithQwen(text, category) {
        // 检查缓存中是否已有翻译结果
        const cacheKey = `translate_${text}_${category}`;
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        try {
            const API_KEY = 'sk-6bb814169b684d8eace5dd6337874be8'; // 替换为您的实际 API Key
            const APP_ID = '9f0056741d4d455d9ae00935b564b764'; // 新的应用ID

            // 使用 GM_xmlhttpRequest 解决跨域问题
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://dashscope.aliyuncs.com/api/v1/apps/${APP_ID}/completion`,
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        input: {
                            prompt: `你是翻译员，请将以下内容翻译成简体中文: ${text}`,
                            category: category
                        },
                        parameters: {},
                        debug: {}
                    }),
                    onload: function(res) {
                        try {
                            const data = JSON.parse(res.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(new Error(`解析响应失败: ${e.message}, 响应内容: ${res.responseText}`));
                        }
                    },
                    onerror: function(err) {
                        // 减少错误日志输出
                        // console.error('网络请求失败详情:', err);
                        reject(new Error(`网络请求失败: ${err.status} - ${err.statusText}`));
                    }
                });
            });

            // 处理响应数据
            const result = processApiResponse(response, '翻译结果为空');

            // 将翻译结果存入缓存
            translationCache.set(cacheKey, result);
            return result;
        } catch (error) {
            // 减少错误日志输出
            // console.error('翻译失败:', error);
            return '翻译失败: ' + error.message;
        }
    }

    // 调用百炼应用API进行内容提取
    async function extractWithApp(websiteContent, websiteId) {
        // 检查缓存中是否已有提取结果
        const cacheKey = `${websiteId}_${generateCacheKey({name: '', description: websiteContent})}`;
        if (extractCache.has(cacheKey)) {
            return extractCache.get(cacheKey);
        }

        try {
            const API_KEY = 'sk-6bb814169b684d8eace5dd6337874be8'; // 使用与翻译相同的 API Key
            const APP_ID = 'b16d5fe969d34b6480a6b6261fa7c858';
            const prompt = websiteContent;

            // 使用 GM_xmlhttpRequest 解决跨域问题
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://dashscope.aliyuncs.com/api/v1/apps/${APP_ID}/completion`,
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        input: {
                            prompt: prompt
                        },
                        parameters: {},
                        debug: {}
                    }),
                    onload: function(res) {
                        try {
                            const data = JSON.parse(res.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(new Error(`解析响应失败: ${e.message}, 响应内容: ${res.responseText}`));
                        }
                    },
                    onerror: function(err) {
                        // 减少错误日志输出
                        // console.error('提取请求失败详情:', err);
                        reject(new Error(`网络请求失败: ${err.status} - ${err.statusText}`));
                    }
                });
            });

            // 处理响应数据
            const result = processApiResponse(response, '提取结果为空');

            // 将提取结果存入缓存
            extractCache.set(cacheKey, result);
            return result;
        } catch (error) {
            // 减少错误日志输出
            // console.error('提取失败:', error);
            return '提取失败: ' + error.message;
        }
    }

    // 更新表格内容
    async function updateTable(tbody) {
        // 清空现有内容
        tbody.innerHTML = '';

        // 添加新数据
        for (const item of shopData) {
            const row = tbody.insertRow();

            const hostCell = row.insertCell();
            hostCell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';

            // 创建容器
            const hostContainer = document.createElement('div');

            // 原有链接保持不变
            const hostLink = document.createElement('a');
            hostLink.textContent = item.host;
            hostLink.href = `https://ydcms.umlife.com/#/os_website?page=1&keyword=${item.host}`;
            hostLink.target = '_blank';
            hostLink.addEventListener('click', (e) => {
                e.preventDefault();
                openWindowWithPosition(hostLink.href);
            });

            // 新增跳转按钮
            const jumpButton = document.createElement('button');
            jumpButton.textContent = '🔗跳转';
            jumpButton.style.cssText = `
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 3px 6px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 5px;
            `;
            jumpButton.addEventListener('click', () => {
                window.open(`https://${item.host}`, '_blank');
            });

            // 新增素材按钮
            const materialButton = document.createElement('button');
            materialButton.textContent = '🤣素材';
            materialButton.style.cssText = `
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 3px 6px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 5px;
                margin-left: 5px;
            `;
            materialButton.addEventListener('click', () => {
                window.open(`https://app.goodsfox.com/website/${item.id}/material`, '_blank');
            });

            // 组装元素
            hostContainer.appendChild(hostLink);
            hostContainer.appendChild(document.createElement('br'));
            hostContainer.appendChild(jumpButton);
            hostContainer.appendChild(materialButton);
            hostCell.appendChild(hostContainer);

            const websiteCell = row.insertCell();

            // 创建网站内容容器
            const websiteContainer = document.createElement('div');

            // 网站内容
            const websiteContent = document.createElement('div');
            websiteContent.innerHTML = `<strong>${item.name}</strong><br>${item.description}`;

            // 提取按钮
            const extractButton = document.createElement('button');
            extractButton.textContent = '提取';
            extractButton.style.cssText = `
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 3px 6px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 5px;
            `;

            // 提取按钮点击事件
            extractButton.addEventListener('click', async () => {
                // 获取网站内容
                const content = `${item.name} ${item.description}`;

                // 调用提取API
                const result = await extractWithApp(content, item.id);

                // 显示结果在气泡中
                // 创建或获取全局tooltip元素
                let tooltip = document.getElementById('extract-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.id = 'extract-tooltip';
                    tooltip.style.cssText = `
                        display: none;
                        position: fixed;
                        background-color: #333;
                        color: white;
                        padding: 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        max-width: 300px;
                        z-index: 10000;
                        word-wrap: break-word;
                        white-space: pre-wrap; /* 保留空白符和换行符 */
                    `;
                    document.body.appendChild(tooltip);
                }

                // 使用 innerHTML 并替换换行符为 <br> 标签以正确显示换行
                tooltip.innerHTML = result.replace(/\n/g, '<br>');
                tooltip.style.display = 'block';

                // 定位气泡在按钮附近
                const rect = extractButton.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

                // 点击其他地方隐藏气泡
                const hideTooltip = (e) => {
                    if (!tooltip.contains(e.target) && e.target !== extractButton) {
                        tooltip.style.display = 'none';
                        document.removeEventListener('click', hideTooltip);
                    }
                };

                // 延迟添加事件监听器，避免立即触发
                setTimeout(() => {
                    document.addEventListener('click', hideTooltip);
                }, 100);
            });

            // 组装元素
            websiteContainer.appendChild(websiteContent);
            websiteContainer.appendChild(document.createElement('br'));
            websiteContainer.appendChild(extractButton);
            websiteCell.appendChild(websiteContainer);

            websiteCell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';

            const translateCell = row.insertCell();
            translateCell.textContent = '翻译中...';
            translateCell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';

            const categoryCell = row.insertCell();
            categoryCell.textContent = item.categoryName;
            categoryCell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';

            // 调用翻译API
            const textToTranslate = `${item.name} ${item.description}`;
            const category = item.categoryName;

            // 检查缓存
            const translateCacheKey = `translate_${textToTranslate}_${category}`;
            if (translationCache.has(translateCacheKey)) {
                const cachedTranslation = translationCache.get(translateCacheKey);
                // 使用 innerHTML 并替换换行符为 <br> 标签以正确显示换行
                translateCell.innerHTML = cachedTranslation.replace(/\n/g, '<br>');

                // 检查是否包含"错误"关键字并进行标红加粗处理
                if (cachedTranslation.includes('错误')) {
                    translateCell.innerHTML = translateCell.innerHTML.replace(/错误/g, '<span style="color: red; font-weight: bold;">错误</span>');
                }
            } else {
                try {
                    const translation = await translateWithQwen(textToTranslate, category);
                    // 使用 innerHTML 并替换换行符为 <br> 标签以正确显示换行
                    translateCell.innerHTML = translation.replace(/\n/g, '<br>');

                    // 检查是否包含"错误"关键字并进行标红加粗处理
                    if (translation.includes('错误')) {
                        translateCell.innerHTML = translateCell.innerHTML.replace(/错误/g, '<span style="color: red; font-weight: bold;">错误</span>');
                    }
                } catch (error) {
                    translateCell.textContent = `翻译失败: ${error.message}`;
                }
            }

        }

    }

    // 在浏览器右下角打开新窗口
    function openWindowWithPosition(url) {
        // 计算窗口尺寸（浏览器窗口的60%）
        const windowWidth = Math.floor(window.outerWidth * 0.6);
        const windowHeight = Math.floor(window.outerHeight * 0.6);

        // 计算窗口位置（右下角）
        const windowLeft = window.screenLeft + window.outerWidth - windowWidth;
        const windowTop = window.screenTop + window.outerHeight - windowHeight;

        // 打开新窗口
        const newWindow = window.open(url, '_blank',
            `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop},resizable=yes,scrollbars=yes`
        );

        // 将新窗口添加到窗口数组中
        if (!window.popupWindows) {
            window.popupWindows = [];
        }
        window.popupWindows.push(newWindow);
    }

    // 关闭所有小窗口
    function closeAllPopupWindows() {
        if (window.popupWindows && window.popupWindows.length > 0) {
            window.popupWindows.forEach(win => {
                if (win && !win.closed) {
                    try {
                        win.close();
                    } catch (e) {
                        console.warn('无法关闭窗口:', e);
                    }
                }
            });
            // 清空窗口数组
            window.popupWindows = [];
        }
    }

    // 创建检查按钮
    function createCheckButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
        `;

        const button = document.createElement('button');
        button.textContent = '🔍检查数据';
        button.id = 'checker-button'; // 添加ID便于调试
        button.style.cssText = `
            background-color: #ff6600;
            color: white;
            font-size: 14px;
            font-weight: bold;
            padding: 8px 15px;
            border: 2px solid #cc5500;
            border-radius: 5px;
            cursor: pointer;
            vertical-align: middle;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        // 添加鼠标悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#ff8833';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#ff6600';
        });

        button.addEventListener('click', async () => {
            const modal = document.getElementById('shopDataModal');
            if (modal) {
                modal.style.display = 'block';
                // 更新表格内容
                const tbody = modal.querySelector('tbody');
                await updateTable(tbody);
            }
        });

        buttonContainer.appendChild(button);
        return buttonContainer;
    }

    // 尝试添加按钮到页面
    function tryAddButton() {
        // 检查按钮是否已经存在
        const existingCheckerButton = document.querySelector('#checker-button');
        if (existingCheckerButton) {
            // 按钮已存在，停止检查
            return true;
        }

        // 针对不同页面使用不同的选择器
        let targetElement = null;

        // websitePromote页面的选择器
        if (window.location.pathname.includes('/websitePromote')) {
            targetElement = document.querySelector('.result-count.m-l-8') ||
                          document.querySelector('.result-count');
        }
        // shopFlow页面的选择器
        else if (window.location.pathname.includes('/shopFlow')) {
            targetElement = document.querySelector('.result-count');
        }

        // 只在找到目标元素时添加按钮，不在其他地方生成
        if (targetElement) {
            const checkButton = createCheckButton();
            checkButton.className = 'check-button-container';
            targetElement.parentNode.insertBefore(checkButton, targetElement.nextSibling);
            return true;
        }

        return false;
    }

    // 处理shopFlow数据
    function processShopFlowData(data) {
        // 提取数据
        shopData = data.data.shopFlowList.data.map(item => ({
            host: item.shop.host,
            id: item.shop.id,
            name: item.shop.name,
            description: item.shop.description,
            categoryName: item.shop.category.map(cat => cat.name).join(', ')
        }));

        // 尝试添加按钮，但只尝试一次
        tryAddButton();
    }

    // 处理shopPromote数据
    function processShopPromoteData(data) {
        // 提取数据
        shopData = data.data.shopPromoteList.data.map(item => ({
            host: item.shop.host,
            id: item.shop.id,
            name: item.shop.name,
            description: item.shop.description,
            categoryName: item.shop.category.map(cat => cat.name).join(', ')
        }));

        // 尝试添加按钮，但只尝试一次
        tryAddButton();
    }

    // 修改指定链接的href属性，添加/material后缀
    function modifyLinks() {
        // 查找所有符合要求的a标签
        const links = document.querySelectorAll('a.el-tooltip.gp-table-shop__name');

        links.forEach(link => {
            const href = link.getAttribute('href');
            // 检查href是否存在且不以/material结尾
            if (href && !href.endsWith('/material')) {
                // 修改href属性，添加/material后缀
                link.setAttribute('href', href + '/material');
            }
        });
    }

    // 监听 XMLHttpRequest 请求
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (this._url && this._url.includes('/graphql')) {
            const originalOnload = this.onload;

            this.onload = function() {
                if (originalOnload) originalOnload.apply(this, arguments);

                try {
                    const response = JSON.parse(this.responseText);

                    // 检查是否包含shopPromoteList数据
                    if (response?.data?.shopPromoteList?.data) {
                        // 减少日志输出
                        // console.log('📦 收到shopPromoteList数据');
                        processShopPromoteData(response);
                    }
                    // 检查是否包含shopFlowList数据
                    else if (response?.data?.shopFlowList?.data) {
                        // 减少日志输出
                        // console.log('📦 收到shopFlowList数据');
                        processShopFlowData(response);
                    }

                    // 修改链接
                    modifyLinks();
                } catch (err) {
                    // 减少错误日志输出
                    // console.error('解析XMLHttpRequest响应数据时出错:', err);
                }
            };
        }

        return originalXHRSend.apply(this, arguments);
    };

    // 监听 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        const init = args[1];

        // 检查是否为目标GraphQL接口 (使用更宽松的匹配)
        if (typeof url === 'string' && url.includes('/graphql')) {
            return originalFetch.apply(this, args).then(response => {
                // 检查响应状态
                if (!response.ok) {
                    // 减少警告日志输出
                    // console.warn('GraphQL请求失败:', response.status, response.statusText);
                    return response;
                }

                // 克隆响应以便可以多次读取
                const clonedResponse = response.clone();

                clonedResponse.text().then(text => {
                    try {
                        const data = JSON.parse(text);

                        // 检查是否包含shopPromoteList数据
                        if (data?.data?.shopPromoteList?.data) {
                            // 减少日志输出
                            // console.log('📦 收到shopPromoteList数据 (fetch)');
                            processShopPromoteData(data);
                        }
                        // 检查是否包含shopFlowList数据
                        else if (data?.data?.shopFlowList?.data) {
                            // 减少日志输出
                            // console.log('📦 收到shopFlowList数据 (fetch)');
                            processShopFlowData(data);
                        }

                        // 修改链接
                        modifyLinks();
                    } catch (err) {
                        // 减少错误日志输出
                        // console.error('解析fetch响应数据时出错:', err);
                    }
                }).catch(err => {
                    // 减少错误日志输出
                    // console.error('读取响应文本时出错:', err)
                });

                return response;
            }).catch(error => {
                // 减少错误日志输出
                // console.error('网络请求出错:', error);
                throw error;
            });
        }

        return originalFetch.apply(this, args);
    };

    // 页面加载完成后执行
    function init() {
        // 创建弹窗
        const { modal, tbody } = createModal();

        // 尝试添加按钮
        let buttonAdded = tryAddButton();

        // 如果按钮未添加成功，设置定时器继续尝试
        if (!buttonAdded) {
            const interval = setInterval(() => {
                if (tryAddButton()) {
                    // 按钮添加成功后清除定时器
                    clearInterval(interval);
                }
            }, 1000);

            // 10秒后停止尝试
            setTimeout(() => {
                clearInterval(interval);
            }, 10000);
        }

        // 添加MutationObserver来监听DOM变化并修改链接
        const observer = new MutationObserver((mutations) => {
            // 检查按钮是否已经存在
            if (!document.querySelector('#checker-button')) {
                // 只有在有实际DOM变化时才尝试添加按钮
                let shouldTryAddButton = false;
                for (let mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        shouldTryAddButton = true;
                        break;
                    }
                }

                if (shouldTryAddButton) {
                    tryAddButton();
                }
            }
            modifyLinks();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();