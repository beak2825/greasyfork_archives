// ==UserScript==
// @name         精炼UploadAPI 工具
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  UploadAPI 相关功能的 Tampermonkey 脚本，功能待定
// @author       You
// @match        https://www.milkywayidle.com/game?characterId=550034
// @match        https://*.milkywayidlecn.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/558999/%E7%B2%BE%E7%82%BCUploadAPI%20%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/558999/%E7%B2%BE%E7%82%BCUploadAPI%20%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 这里是脚本的主要代码区域

    // 从localStorage读取数据并上传到Gitee
    function uploadNetWorthToGitee() {
        // 从localStorage获取数据
        const netWorthData = localStorage.getItem('MYAPI');

        if (!netWorthData) {
            console.error('未找到MWITools_marketAPI_json数据');
            return;
        }

        // Gitee API配置
        const repo = "https://gitee.com/deric1312/myapi1.git";
        const path = "api.json";
        const token = "18aeb3bc2084c2d9006fac9d17bfefdc";

        // 提取仓库所有者和仓库名
        const repoMatch = repo.match(/gitee\.com\/([^\/]+)\/([^\/]+)\.git/);
        if (!repoMatch) {
            console.error('无效的Gitee仓库URL');
            return;
        }

        const owner = repoMatch[1];
        const repoName = repoMatch[2].replace('.git', '');

        // 构建Gitee API URL
        const apiUrl = `https://gitee.com/api/v5/repos/${owner}/${repoName}/contents/${path}`;

        // 准备请求数据
        const data = {
            access_token: token,
            message: 'Update net worth data',
            content: btoa(netWorthData), // 转换为base64
        };

        // 先获取文件的SHA值，以便更新文件
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${apiUrl}?access_token=${token}`,
            headers: {
                'Accept': 'application/json'
            },
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const fileData = JSON.parse(response.responseText);
                        data.sha = fileData.sha;

                        // 上传更新的数据
                        GM_xmlhttpRequest({
                            method: 'PUT',
                            url: apiUrl,
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            data: JSON.stringify(data),
                            onload: function(response) {
                                if (response.status === 200) {
                                    console.log('数据上传成功');
                                } else {
                                    console.error('数据上传失败:', response.status, response.responseText);
                                }
                            },
                            onerror: function(error) {
                                console.error('请求错误:', error);
                            }
                        });
                    } catch (e) {
                        console.error('解析文件数据失败:', e);
                    }
                } else if (response.status === 404) {
                    // 文件不存在，创建新文件
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: apiUrl,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        data: JSON.stringify(data),
                        onload: function(response) {
                            if (response.status === 201) {
                                console.log('文件创建并上传成功');
                            } else {
                                console.error('文件创建失败:', response.status, response.responseText);
                            }
                        },
                        onerror: function(error) {
                            console.error('请求错误:', error);
                        }
                    });
                } else {
                    console.error('获取文件信息失败:', response.status, response.responseText);
                }
            },
            onerror: function(error) {
                console.error('请求错误:', error);
            }
        });
    }

    // 添加调用示例
    // 可以根据需要在适当的时机调用此函数
    // 例如，添加一个按钮来触发上传
    function addUploadButton() {
        const button = document.createElement('button');
        button.textContent = '上传资产数据';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.addEventListener('click', uploadNetWorthToGitee);
        document.body.appendChild(button);
    }

    // 立即添加上传按钮，不再等待DOMContentLoaded
    addUploadButton();

    console.log('UploadAPI 工具脚本已加载');
    // 从Gitee读取api.json并保存到localStorage
    function fetchApiFromGiteeAndSaveToLocalStorage() {
        // Gitee API配置
        const repo = "https://gitee.com/deric1312/myapi1.git";
        const path = "api.json";
        const token = "18aeb3bc2084c2d9006fac9d17bfefdc";

        // 提取仓库所有者和仓库名
        const repoMatch = repo.match(/gitee\.com\/([^\/]+)\/([^\/]+)\.git/);
        if (!repoMatch) {
            console.error('无效的Gitee仓库URL');
            return;
        }

        const owner = repoMatch[1];
        const repoName = repoMatch[2].replace('.git', '');

        // 构建Gitee API URL
        const apiUrl = `https://gitee.com/api/v5/repos/${owner}/${repoName}/contents/${path}`;

        // 发送请求获取文件内容
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${apiUrl}?access_token=${token}`,
            headers: {
                'Accept': 'application/json'
            },
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const fileData = JSON.parse(response.responseText);
                        // 解码base64内容
                        const content = atob(fileData.content);
                        // 保存到localStorage
                        localStorage.setItem('MYAPI', content);
                        console.log('API数据已成功保存到localStorage');
                    } catch (error) {
                        console.error('解析文件内容失败:', error);
                    }
                } else {
                    console.error('获取文件失败:', response.status, response.responseText);
                }
            },
            onerror: function(error) {
                console.error('请求错误:', error);
            }
        });
    }

    // 添加获取数据按钮
    function addFetchButton() {
        const button = document.createElement('button');
        button.textContent = '获取API数据';
        button.style.position = 'fixed';
        button.style.top = '40px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.addEventListener('click', fetchApiFromGiteeAndSaveToLocalStorage);
        document.body.appendChild(button);
    }

    // 立即添加获取数据按钮，不再等待DOMContentLoaded
    addFetchButton();

    // 自动上传API数据，每隔五分钟执行一次
    function startAutoUpload() {
        // 避免重复启动定时器
        if (window.autoUploadInterval) {
            console.log('自动上传已经在运行中');
            return;
        }

        // 设置定时器，每隔30秒(30000毫秒)执行一次上传和时间戳检查
        window.autoUploadInterval = setInterval(() => {
            console.log('执行自动上传API数据');
            
            // 检查localStorage.MYAPI的时间戳
            try {
                const myApiData = localStorage.getItem('MYAPI');
                if (myApiData) {
                    const parsedData = JSON.parse(myApiData);
                    if (parsedData.timestamp) {
                        const now = Math.floor(Date.now() / 1000); // 当前时间（秒）
                        const timestamp = parsedData.timestamp;
                        const timeDiff = now - timestamp;
                        
                        console.log(`当前时间: ${now}, 数据时间戳: ${timestamp}, 时间差: ${timeDiff}秒`);
                        
                        // 如果数据时间戳比本地时间早3分钟（180秒）以上（即数据过时），刷新网页
                        if (now - timestamp > 180) {
                            console.log('数据时间戳比本地时间早3分钟以上（数据过时），刷新网页');
                            location.reload();
                            return; // 防止继续执行上传操作
                        }
                    }
                }
            } catch (error) {
                console.error('检查时间戳时发生错误:', error);
            }
            
            uploadNetWorthToGitee();
        }, 30000);

        console.log('自动上传功能已启动，每30秒上传一次');
    }

    // 立即启动自动上传，不再等待DOMContentLoaded
    startAutoUpload();
    
    // 在打开网页后自动执行一次获取API数据操作
    console.log('在网页打开后自动执行获取API数据操作');
    fetchApiFromGiteeAndSaveToLocalStorage();

    // 监听特定SVG元素的href属性变化
    function checkSvgHrefPeriodically() {
        const targetSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7> div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_infoContainer__2mCnh > div > div > div > div > div.Item_iconContainer__5z7j4 > svg > use';
        // 定义要读取的两个元素的选择器
        const selectorA = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > span';
        const selectorB = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > span';

        let lastHrefValue = null;
        let elementFound = false;

        function checkHref() {
            const targetElement = document.querySelector(targetSelector);

            if (!targetElement) {
                if (!elementFound) {
                    console.log('[SVG轮询] 目标SVG元素尚未加载...');
                }
                return;
            }

            if (!elementFound) {
                console.log('[SVG轮询] 已找到目标SVG元素，开始每0.5秒检查href变化...');
                elementFound = true;
            }

            const href = targetElement.getAttribute('href');
            let hrefChanged = false;
            let hashValue = null;

            if (href && href.includes('#')) {
                hashValue = href.split('#')[1];
                hrefChanged = hashValue !== lastHrefValue;
            } else {
                hrefChanged = href !== lastHrefValue;
            }

            if (hrefChanged) {
                // 输出href变化信息
                if (hashValue) {
                    console.log('SVG href变化，#后的值为:', hashValue);
                } else {
                    console.log('[SVG轮询] href不包含#符号:', href);
                }

                // 读取并输出元素A和B的内容
                try {
                    const elementA = document.querySelector(selectorA);
                    const a = elementA ? elementA.textContent.trim() : null;

                    const elementB = document.querySelector(selectorB);
                    const b = elementB ? elementB.textContent.trim() : null;



                    if (a && b) {
                        // 转换a和b的值
                        const convertedA = convertNumber(a);
                        const convertedB = convertNumber(b);

                        console.log('元素A的内容:', a, ' (转换后:', convertedA, ')');
                        console.log('元素B的内容:', b, ' (转换后:', convertedB, ')');

                        // 保存到localStorage.MYAPI
                        if (hashValue) {
                            try {
                                // 获取当前时间戳
                                const timestamp = Math.floor(Date.now() / 1000);

                                // 构建数据结构
                                const itemPath = `/items/${hashValue}`;
                                const newData = {
                                    timestamp: timestamp,
                                    marketData: {
                                    }
                                };
                                newData.marketData[itemPath] = {
                                    "0": {
                                        a: convertedA,
                                        b: convertedB
                                    }
                                };

                                // 尝试获取现有数据
                                let existingData = localStorage.getItem('MYAPI');
                                if (existingData) {
                                    try {
                                        existingData = JSON.parse(existingData);
                                        // 更新现有数据
                                        existingData.timestamp = timestamp;
                                        if (!existingData.marketData) {
                                            existingData.marketData = {};
                                        }
                                        existingData.marketData[itemPath] = newData.marketData[itemPath];
                                    } catch (e) {
                                        console.error('解析现有MYAPI数据失败，将创建新数据:', e);
                                        existingData = newData;
                                    }
                                } else {
                                    existingData = newData;
                                }

                                // 保存回localStorage
                                        localStorage.setItem('MYAPI', JSON.stringify(existingData));
                                        // 设置flag_click为
                                        localStorage.setItem('flag_click', '1');
                                        console.log('数据已成功保存到localStorage.MYAPI，flag_click已设置为1');
                            } catch (e) {
                                console.error('保存数据到localStorage失败:', e);
                            }
                        }
                    } else {
                            // 当元素A或B未找到时，读取表格行元素内容
                            console.log('元素A或B未找到，尝试读取表格行元素内容:');
                            const baseSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_itemSummary__29rdY > div.MarketplacePanel_itemSummaryTableContainer__34kmu > table > tbody';
                            const tbody = document.querySelector(baseSelector);
                            if (tbody) {
                                // 获取tr元素数量
                                const trCount = tbody.querySelectorAll('tr').length;
                                console.log(`表格中共有 ${trCount} 行数据`);

                                // 创建临时对象存储所有行数据
                                const allRowsData = {};
                                const timestamp = Math.floor(Date.now() / 1000);
                                const itemPath = hashValue ? `/items/${hashValue}` : '';

                                // 遍历第1到第20行tr元素
                                for (let i = 1; i <= Math.min(trCount, 20); i++) {
                                    // 读取elev值
                                    const elevSelector = `${baseSelector} > tr:nth-child(${i}) > td.MarketplacePanel_item__1kPF5 > div > div > div > div.Item_enhancementLevel__19g-e`;
                                    const elevElement = document.querySelector(elevSelector);
                                    const elev = elevElement ? elevElement.textContent.trim().replace(/[^0-9]/g, '') : '0';
                                    const elevKey = elev || '0'; // 确保elev有值

                                    // 读取a值
                                    const aSelector = `${baseSelector} > tr:nth-child(${i}) > td.MarketplacePanel_bestAskPrice__1pZ3G > div > div.MarketplacePanel_price__hIzrY > span`;
                                    const aElement = document.querySelector(aSelector);
                                    const a = aElement ? aElement.textContent.trim() : "-1";
                                    if (!aElement) {
                                        console.log(`行 ${i}: 未找到a元素，设置为-1`);
                                    }

                                    // 读取b值
                                    const bSelector = `${baseSelector} > tr:nth-child(${i}) > td.MarketplacePanel_bestBidPrice__6q3Oh > div > div.MarketplacePanel_price__hIzrY > span`;
                                    const bElement = document.querySelector(bSelector);
                                    const b = bElement ? bElement.textContent.trim() : "-1";
                                    if (!bElement) {
                                        console.log(`行 ${i}: 未找到b元素，设置为-1`);
                                    }

                                    // 转换a和b的值
                                    const convertedA = convertNumber(a);
                                    const convertedB = convertNumber(b);

                                    // 输出结果
                                    console.log(`行 ${i}:`);
                                    console.log(`  elev: ${elev}`);
                                    console.log(`  a: ${a} (转换后: ${convertedA})`);
                                    console.log(`  b: ${b} (转换后: ${convertedB})`);

                                    // 将数据添加到临时对象
                                    if (hashValue) {
                                        if (!allRowsData[itemPath]) {
                                            allRowsData[itemPath] = {};
                                        }
                                        allRowsData[itemPath][elevKey] = {
                                            a: convertedA,
                                            b: convertedB
                                        };
                                    }
                                }

                                // 读取完所有行后，统一保存到localStorage
                                if (hashValue && Object.keys(allRowsData).length > 0) {
                                    try {
                                        // 尝试获取现有数据
                                        let existingData = localStorage.getItem('MYAPI');
                                        if (existingData) {
                                            try {
                                                existingData = JSON.parse(existingData);
                                                // 更新现有数据
                                                existingData.timestamp = timestamp;
                                                if (!existingData.marketData) {
                                                    existingData.marketData = {};
                                                }

                                                // 合并所有行数据前，先删除该物品的所有elev字段
                                                Object.keys(allRowsData).forEach(path => {
                                                    // 先删除该物品的所有现有elev字段
                                                    if (existingData.marketData[path]) {
                                                        existingData.marketData[path] = {};
                                                        console.log(`已删除物品 ${path} 的所有elev字段`);
                                                    }
                                                    // 然后添加新数据
                                                    if (!existingData.marketData[path]) {
                                                        existingData.marketData[path] = {};
                                                    }
                                                    Object.assign(existingData.marketData[path], allRowsData[path]);
                                                });
                                            } catch (e) {
                                                console.error('解析现有MYAPI数据失败，将创建新数据:', e);
                                                existingData = {
                                                    timestamp: timestamp,
                                                    marketData: allRowsData
                                                };
                                            }
                                        } else {
                                            existingData = {
                                                timestamp: timestamp,
                                                marketData: allRowsData
                                            };
                                        }

                                        // 保存回localStorage
                                        localStorage.setItem('MYAPI', JSON.stringify(existingData));
                                        // 设置flag_click为1
                                        localStorage.setItem('flag_click', '1');
                                        console.log(`所有表格数据已成功保存到localStorage.MYAPI: #后字符=${hashValue}，flag_click已设置为1`);

                                        // 等待flag_click变为0
                                        async function waitForFlagClick() {
                                            while (localStorage.getItem('flag_click') === '1') {
                                                await new Promise(resolve => setTimeout(resolve, 500));
                                            }
                                            console.log('flag_click已变为0，继续执行');
                                        }
                                        waitForFlagClick();
                                    } catch (e) {
                                        console.error('保存数据到localStorage失败:', e);
                                    }
                                }
                            } else {
                                console.log('表格tbody元素未找到');
                            }
                        }
                } catch (error) {
                    console.error('读取元素内容时出错:', error);
                }

                // 更新lastHrefValue
                lastHrefValue = hashValue || href;
            }
        }

        // 立即检查一次
        checkHref();

        // 每0.5秒检查一次
        setInterval(checkHref, 500);
    }

    // 立即启动轮询，不再等待window.load事件
    setTimeout(checkSvgHrefPeriodically, 100);

    // 添加数字转换函数（移到外部以提高性能）
    function convertNumber(numStr) {
        // 移除所有非数字、非字母和非负号字符
        numStr = numStr.replace(/[^-0-9kmb.]/gi, '');

        // 检查后缀
        if (numStr.toLowerCase().includes('k')) {
            return parseFloat(numStr) * 1000;
        } else if (numStr.toLowerCase().includes('m')) {
            return parseFloat(numStr) * 1000000;
        } else if (numStr.toLowerCase().includes('b')) {
            return parseFloat(numStr) * 1000000000;
        } else {
            return parseFloat(numStr) || -1; // 确保无法解析时返回-1
        }
    }

})();