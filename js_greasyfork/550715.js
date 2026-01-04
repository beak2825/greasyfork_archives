// ==UserScript==
// @name         阿里数据地域分布采集--树洞先生
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  采集阿里巴巴数据概览的地域分布数据，支持自定义参数配置
// @author       树洞先生
// @license      MIT
// @match        https://data.alibaba.com/*
// @match        https://mydata.alibaba.com/*
// @grant        none
// @require      https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/550715/%E9%98%BF%E9%87%8C%E6%95%B0%E6%8D%AE%E5%9C%B0%E5%9F%9F%E5%88%86%E5%B8%83%E9%87%87%E9%9B%86--%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/550715/%E9%98%BF%E9%87%8C%E6%95%B0%E6%8D%AE%E5%9C%B0%E5%9F%9F%E5%88%86%E5%B8%83%E9%87%87%E9%9B%86--%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let collectedData = {};
    let userConfig = {
        statisticsType: 'month',
        terminalType: 'total',
        selected: '1'
    };

    // 创建启动按钮
    function createStartButton() {
        // 移除已存在的启动按钮
        const existingButton = document.getElementById('aliDataCollectorStartBtn');
        if (existingButton) {
            existingButton.remove();
        }

        // 寻找"数据总览"文本的父容器
        const titleSpan = document.querySelector('.dataportal-base-area-title');
        if (!titleSpan || !titleSpan.textContent.includes('数据总览')) {
            console.log('未找到数据总览元素，使用默认位置');
            createStartButtonDefault();
            return;
        }

        // 找到包含"数据总览"的容器div
        const titleContainer = titleSpan.parentElement;
        if (!titleContainer) {
            console.log('未找到标题容器，使用默认位置');
            createStartButtonDefault();
            return;
        }

        const startButton = document.createElement('div');
        startButton.id = 'aliDataCollectorStartBtn';
        startButton.style.cssText = `
            position: relative !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 80px !important;
            height: 28px !important;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%) !important;
            border: none !important;
            border-radius: 14px !important;
            box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3) !important;
            cursor: pointer !important;
            font-size: 12px !important;
            color: white !important;
            font-weight: bold !important;
            transition: all 0.3s ease !important;
            user-select: none !important;
            margin-left: 8px !important;
            vertical-align: middle !important;
            z-index: 999 !important;
        `;

        startButton.innerHTML = `
            <span style="font-size: 11px; line-height: 1;">📊 数据采集</span>
        `;

        startButton.title = '点击打开阿里数据地域分布采集面板';

        // 悬停效果
        startButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 3px 10px rgba(76, 175, 80, 0.5)';
        });

        startButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 6px rgba(76, 175, 80, 0.3)';
        });

        // 点击事件
        startButton.addEventListener('click', function() {
            createControlPanel();
            this.style.display = 'none'; // 隐藏启动按钮
        });

        // 确保容器支持flex布局
        if (titleContainer.style.display !== 'flex' && titleContainer.style.display !== 'inline-flex') {
            titleContainer.style.display = 'inline-flex';
            titleContainer.style.alignItems = 'center';
        }
        
        // 将按钮添加到"数据总览"旁边
        titleContainer.appendChild(startButton);
        
        console.log('阿里数据采集启动按钮已创建在"数据总览"旁边');
    }

    // 创建默认位置的启动按钮（备用方案）
    function createStartButtonDefault() {
        const startButton = document.createElement('div');
        startButton.id = 'aliDataCollectorStartBtn';
        startButton.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 60px !important;
            height: 60px !important;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%) !important;
            border: none !important;
            border-radius: 50% !important;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4) !important;
            z-index: 999999 !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important;
            color: white !important;
            font-weight: bold !important;
            transition: all 0.3s ease !important;
            user-select: none !important;
        `;

        startButton.innerHTML = `
            <span style="font-size: 16px; line-height: 1;">数据</span>
        `;

        startButton.title = '点击打开阿里数据地域分布采集面板';

        // 悬停效果
        startButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.6)';
        });

        startButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)';
        });

        // 点击事件
        startButton.addEventListener('click', function() {
            createControlPanel();
            this.style.display = 'none'; // 隐藏启动按钮
        });

        document.body.appendChild(startButton);
        console.log('阿里数据采集启动按钮已创建（默认位置）');
    }

    // 创建控制面板
    function createControlPanel() {
        // 移除已存在的面板
        const existingPanel = document.getElementById('aliDataCollectorPanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'aliDataCollectorPanel';
        panel.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 350px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
            border-radius: 15px !important;
            padding: 20px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
            z-index: 999999 !important;
            font-family: 'Microsoft YaHei', sans-serif !important;
            color: white !important;
            backdrop-filter: blur(10px) !important;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 15px; text-align: center;">
                <h3 style="margin: 0; color: white; font-size: 18px; font-weight: bold;">阿里数据地域分布采集</h3>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">统计类型:</label>
                <select id="statisticsType" style="width: 100%; padding: 8px; border: none; border-radius: 5px; font-size: 14px;">
                    <option value="month">月度统计</option>
                    <option value="week">周度统计</option>
                    <option value="day">日度统计</option>
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">终端类型:</label>
                <select id="terminalType" style="width: 100%; padding: 8px; border: none; border-radius: 5px; font-size: 14px;">
                    <option value="total">全部终端</option>
                    <option value="PC">PC端</option>
                    <option value="web">Web端</option>
                    <option value="APP">移动APP</option>
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">时间选择:</label>
                <input type="number" id="selected" value="1" min="1" max="12" 
                       style="width: 100%; padding: 8px; border: none; border-radius: 5px; font-size: 14px; box-sizing: border-box;" 
                       placeholder="输入时间范围数字">
                <small style="color: #e0e0e0; font-size: 12px;">月度:1-12个月，周度:1-52周，日度:1-365天</small>
            </div>
            
            <div style="margin-bottom: 15px;">
                <button id="startCollecting" style="width: 100%; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.3s;">
                    开始采集数据
                </button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <button id="exportExcel" style="width: 100%; padding: 12px; background: #2196F3; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.3s;" disabled>
                    导出Excel文件
                </button>
            </div>
            
            <div id="status" style="margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 5px; font-size: 14px; min-height: 20px;">
                等待开始采集...
            </div>
            
            <div style="margin-top: 10px; text-align: center;">
                <button id="closePanel" style="background: #f44336; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer; font-size: 12px;">
                    关闭面板
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('startCollecting').addEventListener('click', startDataCollection);
        document.getElementById('exportExcel').addEventListener('click', exportToExcel);
        document.getElementById('closePanel').addEventListener('click', () => {
            panel.style.display = 'none';
            // 重新显示启动按钮
            const startButton = document.getElementById('aliDataCollectorStartBtn');
            if (startButton) {
                startButton.style.display = 'inline-flex';
            } else {
                // 延迟重新创建按钮，等待DOM更新
                setTimeout(() => {
                    createStartButton();
                }, 100);
            }
        });

        // 按钮悬停效果
        const buttons = panel.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            });
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });

        updateStatus('控制面板已加载，请配置参数后开始采集');
        
        // 隐藏启动按钮
        const startButton = document.getElementById('aliDataCollectorStartBtn');
        if (startButton) {
            startButton.style.display = 'none';
        }
    }

    // 更新状态显示
    function updateStatus(message) {
        const statusDiv = document.getElementById('status');
        if (statusDiv) {
            statusDiv.textContent = message;
            console.log(`[阿里数据采集] ${message}`);
        }
    }

    // 获取用户配置
    function getUserConfig() {
        try {
            userConfig.statisticsType = document.getElementById('statisticsType').value;
            userConfig.terminalType = document.getElementById('terminalType').value;
            userConfig.selected = document.getElementById('selected').value;
            
            // 验证输入
            if (!userConfig.selected || isNaN(userConfig.selected) || parseInt(userConfig.selected) <= 0) {
                userConfig.selected = '1';
                document.getElementById('selected').value = '1';
            }
            
            updateStatus(`配置: ${userConfig.statisticsType}, ${userConfig.terminalType}, 最近${userConfig.selected}`);
            console.log('用户配置:', userConfig);
        } catch (error) {
            console.error('获取用户配置失败:', error);
            updateStatus('配置获取失败，使用默认配置');
        }
    }

    // 从cookie中提取ctoken
    function extractCtokenFromCookie() {
        const cookies = document.cookie;
        const xmanUsMatch = cookies.match(/xman_us_t=([^;]+)/);
        if (xmanUsMatch) {
            const xmanUsValue = xmanUsMatch[1];
            const ctokenMatch = xmanUsValue.match(/ctoken=([^&]+)/);
            if (ctokenMatch) {
                return ctokenMatch[1];
            }
        }
        return 'lolr_y68znle'; // 默认值
    }

    // 发送API请求
    async function sendAPIRequest() {
        const ctoken = extractCtokenFromCookie();
        const params = new URLSearchParams({
            action: 'OneAction',
            iName: 'vip/home/custom/getShopRegionAnalysis',
            statisticsType: userConfig.statisticsType,
            selected: userConfig.selected,
            terminalType: userConfig.terminalType,
            isMyselfUpgraded: 'true',
            cateId: '711002',
            statisticType: 'os',
            region: 'os',
            seperateByCate: 'false',
            isVip: 'true',
            ctoken: ctoken
        });

        const url = `https://mydata.alibaba.com/self/.json?${params.toString()}`;
        
        try {
            updateStatus('正在发送API请求...');
            console.log('API请求URL:', url);
            console.log('API请求参数:', Object.fromEntries(params));
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                    'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site'
                },
                credentials: 'include'
            });

            console.log('API响应状态:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API响应数据:', data);
            updateStatus('API请求成功，正在处理数据...');
            return data;
        } catch (error) {
            console.error('API请求错误详情:', error);
            updateStatus(`API请求失败: ${error.message}`);
            return null;
        }
    }

    // 计算统计周期
    function calculateStatisticsPeriod(statisticsType, selected) {
        const now = new Date();
        const selectedNum = parseInt(selected);
        
        if (statisticsType === 'month') {
            // 月度统计：计算前 N 个月
            const targetMonth = new Date(now.getFullYear(), now.getMonth() - selectedNum, 1);
            return `${targetMonth.getFullYear()}年${targetMonth.getMonth() + 1}月`;
        } else if (statisticsType === 'week') {
            // 周度统计：计算前 N 周的开始和结束日期
            const daysToSubtract = selectedNum * 7;
            const targetDate = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
            
            // 计算该周的开始日期（周一）
            const startOfWeek = new Date(targetDate);
            const dayOfWeek = startOfWeek.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 周日为0，调整为周一开始
            startOfWeek.setDate(targetDate.getDate() - daysToMonday);
            
            // 计算该周的结束日期（周日）
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            return `${startOfWeek.getMonth() + 1}月${startOfWeek.getDate()}日-${endOfWeek.getMonth() + 1}月${endOfWeek.getDate()}日`;
        } else {
            // day 保持原有逻辑，使用原始数据中的statDate
            return '';
        }
    }

    // 解析国家详情数据
    function parseCountryDetail(countryDetailStr, targetCn, originalItem) {
        const countries = [];
        
        try {
            const countryEntries = countryDetailStr.trim().replace(/;$/, '').split(';');
            
            // 计算统计周期
            const calculatedPeriod = calculateStatisticsPeriod(userConfig.statisticsType, userConfig.selected);
            const finalPeriod = calculatedPeriod || originalItem.statDate || '';
            
            countryEntries.forEach(entry => {
                if (entry.includes('#')) {
                    const parts = entry.split('#');
                    
                    let countryName, numericValue, percentageValue;
                    
                    if (parts.length >= 3) {
                        countryName = parts[0].trim();
                        numericValue = parts[1].trim();
                        percentageValue = parts[2].trim();
                    } else if (parts.length === 2) {
                        countryName = parts[0].trim();
                        const dataPart = parts[1].trim();
                        
                        // 简化的数据解析
                        const zeroDotPos = dataPart.indexOf('0.');
                        if (zeroDotPos > 0) {
                            numericValue = dataPart.substring(0, zeroDotPos);
                            percentageValue = dataPart.substring(zeroDotPos);
                        } else {
                            numericValue = dataPart;
                            percentageValue = '0';
                        }
                    } else {
                        return; // 跳过无效数据
                    }
                    
                    // 确保数据不为空
                    if (!numericValue) numericValue = '0';
                    if (!percentageValue) percentageValue = '0';
                    
                    countries.push({
                        地域: targetCn,
                        国家: countryName,
                        数值: numericValue,
                        占比: percentageValue,
                        终端类型: userConfig.terminalType,
                        统计周期: finalPeriod
                    });
                }
            });
        } catch (error) {
            console.error('解析国家详情时出错:', error, '原始数据:', countryDetailStr);
        }
        
        return countries;
    }

    // 处理响应数据
    function processResponseData(data) {
        try {
            console.log('开始处理响应数据:', data);
            
            if (!data) {
                updateStatus('响应数据为空');
                return null;
            }
            
            if (!data.data) {
                updateStatus('响应中没有找到 data 字段');
                console.log('响应结构:', Object.keys(data));
                return null;
            }
            
            if (!data.data.returnValue) {
                updateStatus('响应中没有找到 returnValue 字段');
                console.log('data结构:', Object.keys(data.data));
                return null;
            }

            const returnValue = data.data.returnValue;
            console.log('returnValue 数据:', returnValue);
            
            const groupedData = {};
            const countryDetails = {};

            if (Array.isArray(returnValue)) {
                console.log(`开始处理 ${returnValue.length} 条数据`);
                
                returnValue.forEach((item, index) => {
                    if (item && typeof item === 'object' && item.targetCn) {
                        const targetCn = item.targetCn;
                        console.log(`处理项目 ${index + 1}: ${targetCn}`);
                        
                        if (!groupedData[targetCn]) {
                            groupedData[targetCn] = [];
                        }
                        groupedData[targetCn].push(item);

                        // 处理countryDetail数据
                        if (item.countryDetail) {
                            console.log(`${targetCn} 的 countryDetail:`, item.countryDetail);
                            const countries = parseCountryDetail(item.countryDetail, targetCn, item);
                            if (!countryDetails[targetCn]) {
                                countryDetails[targetCn] = [];
                            }
                            countryDetails[targetCn].push(...countries);
                            console.log(`${targetCn} 解析出 ${countries.length} 个国家`);
                        } else {
                            console.log(`${targetCn} 没有 countryDetail 数据`);
                        }
                    } else {
                        console.warn(`项目 ${index + 1} 格式不正确:`, item);
                    }
                });
            } else {
                updateStatus('returnValue 不是数组格式');
                console.log('returnValue 类型:', typeof returnValue);
                return null;
            }

            updateStatus(`找到 ${Object.keys(groupedData).length} 个地域分组`);
            console.log('分组数据:', groupedData);
            console.log('国家详情:', countryDetails);

            return { groupedData, countryDetails };
        } catch (error) {
            updateStatus(`处理数据时出错: ${error.message}`);
            console.error('数据处理错误:', error);
            return null;
        }
    }

    // 开始数据采集
    async function startDataCollection() {
        getUserConfig();
        
        const startButton = document.getElementById('startCollecting');
        const exportButton = document.getElementById('exportExcel');
        
        startButton.disabled = true;
        startButton.textContent = '采集中...';
        
        try {
            const responseData = await sendAPIRequest();
            if (responseData) {
                const result = processResponseData(responseData);
                if (result) {
                    collectedData = result;
                    updateStatus(`数据采集完成！共 ${Object.keys(result.countryDetails).length} 个地域`);
                    exportButton.disabled = false;
                } else {
                    updateStatus('数据处理失败');
                }
            }
        } catch (error) {
            updateStatus(`采集失败: ${error.message}`);
        } finally {
            startButton.disabled = false;
            startButton.textContent = '开始采集数据';
        }
    }

    // 导出Excel文件
    function exportToExcel() {
        if (!collectedData || !collectedData.countryDetails) {
            updateStatus('没有数据可以导出');
            return;
        }

        try {
            updateStatus('正在生成Excel文件...');
            
            // 检查XLSX库是否加载
            if (typeof XLSX === 'undefined') {
                updateStatus('XLSX库未加载，请刷新页面重试');
                return;
            }
            
            console.log('XLSX库版本:', XLSX.version || '未知');

            // 字段名称映射
            const fieldNameMapping = {
                '最近排除联盟的搜索item和p4p商品相关点击次数': '最近商品点击次数',
                '最近排除联盟的搜索item和p4p商品曝光量': '最近商品曝光次数'
            };

            // 工作表顺序
            const sheetOrder = [
                '最近商品曝光次数',  // 曝光量
                '最近商品点击次数',  // 点击量
                '最近店铺访客数',    // 访客数
                '最近店铺访问次数',  // 访问次数
                '最近询盘数',        // 询盘数
                '最近询盘客户数',    // 询盘客户数
                '最近TM咨询客户数',  // TM咨询客户数
                '半托管品首页曝光'    // 半托管首页曝光
            ];

            function mapFieldName(originalName) {
                return originalName ? (fieldNameMapping[originalName] || originalName) : "未知分类";
            }

            const workbook = XLSX.utils.book_new();

            // 1. 创建汇总统计表
            const summaryData = [];
            Object.entries(collectedData.countryDetails).forEach(([region, countries]) => {
                const mappedRegionName = mapFieldName(region);
                summaryData.push({
                    '地域': mappedRegionName,
                    '国家数量': countries.length,
                    '终端类型': userConfig.terminalType,
                    '统计周期': countries.length > 0 ? countries[0].统计周期 : ''
                });
            });

            if (summaryData.length > 0) {
                const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
                XLSX.utils.book_append_sheet(workbook, summaryWorksheet, '汇总统计');
            }

            // 2. 按指定顺序创建地域工作表
            const sortedRegions = [];
            
            // 按指定顺序添加地域
            sheetOrder.forEach(orderRegion => {
                Object.keys(collectedData.countryDetails).forEach(region => {
                    const mappedRegionName = mapFieldName(region);
                    if (mappedRegionName === orderRegion && !sortedRegions.includes(region)) {
                        sortedRegions.push(region);
                    }
                });
            });

            // 添加剩余的地域
            Object.keys(collectedData.countryDetails).forEach(region => {
                if (!sortedRegions.includes(region)) {
                    sortedRegions.push(region);
                }
            });

            // 为每个地域创建工作表
            sortedRegions.forEach(region => {
                const countries = collectedData.countryDetails[region];
                if (countries && countries.length > 0) {
                    const mappedRegionName = mapFieldName(region);
                    
                    // 创建简化的国家数据记录
                    const simplifiedCountries = countries.map(country => ({
                        '地域': mappedRegionName,
                        '国家': country.国家,
                        '数值': country.数值,
                        '占比': country.占比,
                        '终端类型': country.终端类型,
                        '统计周期': country.统计周期
                    }));

                    // 按国家排序
                    simplifiedCountries.sort((a, b) => a.国家.localeCompare(b.国家));

                    // 安全的工作表名称
                    const safeSheetName = mappedRegionName.length <= 30 ? 
                        mappedRegionName : mappedRegionName.substring(0, 27) + "...";

                    const worksheet = XLSX.utils.json_to_sheet(simplifiedCountries);
                    XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
                }
            });

            // 生成文件名
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '').replace(/\..+/, '');
            const filename = `阿里数据地域分布_${timestamp}.xlsx`;

            // 处理空工作簿预防
            if (workbook.SheetNames.length === 0) {
                // 创建使用说明页面防止空工作簿错误
                const instructionData = [{
                    '说明': '暂无数据，请检查API响应或配置参数',
                    '配置': `统计类型: ${userConfig.statisticsType}, 终端类型: ${userConfig.terminalType}, 时间选择: ${userConfig.selected}`,
                    '时间': new Date().toLocaleString('zh-CN')
                }];
                const instructionWorksheet = XLSX.utils.json_to_sheet(instructionData);
                XLSX.utils.book_append_sheet(workbook, instructionWorksheet, '使用说明');
            }

            // 下载文件
            try {
                XLSX.writeFile(workbook, filename);
                updateStatus(`Excel文件已生成: ${filename}`);
            } catch (writeError) {
                console.error('Excel写入错误:', writeError);
                // 备用方案：使用下载方式
                try {
                    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                    const blob = new Blob([wbout], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    updateStatus(`Excel文件已生成: ${filename}`);
                } catch (backupError) {
                    updateStatus(`Excel导出失败: ${backupError.message}`);
                    console.error('备用下载方案也失败:', backupError);
                }
            }

        } catch (error) {
            updateStatus(`Excel导出失败: ${error.message}`);
            console.error('Excel导出错误:', error);
        }
    }

    // 监听API响应（可选功能，用于自动捕获）
    function interceptFetchRequests() {
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);
            
            // 检查是否是目标API
            if (args[0] && args[0].includes('mydata.alibaba.com/self') && args[0].includes('.json')) {
                console.log('检测到地域分布API请求:', args[0]);
                
                // 克隆响应以避免消费原始响应
                const clonedResponse = response.clone();
                try {
                    const data = await clonedResponse.json();
                    if (data && data.data && data.data.returnValue) {
                        console.log('自动捕获到地域分布数据');
                        const result = processResponseData(data);
                        if (result) {
                            collectedData = result;
                            updateStatus('自动捕获数据成功！');
                            const exportButton = document.getElementById('exportExcel');
                            if (exportButton) {
                                exportButton.disabled = false;
                            }
                        }
                    }
                } catch (error) {
                    console.error('处理捕获的数据时出错:', error);
                }
            }
            
            return response;
        };
    }

    // 初始化脚本
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createStartButton, 1000);
            });
        } else {
            setTimeout(createStartButton, 1000);
        }

        // 启用API拦截
        interceptFetchRequests();

        // 监听页面变化，确保启动按钮始终可用
        const observer = new MutationObserver(() => {
            const hasButton = document.getElementById('aliDataCollectorStartBtn');
            const hasPanel = document.getElementById('aliDataCollectorPanel');
            const hasTargetElement = document.querySelector('.dataportal-base-area-title');
            
            // 如果没有按钮和面板，且存在目标元素，则创建按钮
            if (!hasButton && !hasPanel && hasTargetElement) {
                setTimeout(createStartButton, 500);
            }
            // 如果目标元素不存在但没有按钮和面板，则使用默认位置
            else if (!hasButton && !hasPanel && !hasTargetElement) {
                setTimeout(createStartButtonDefault, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('阿里数据地域分布采集脚本已启动');
    }

    // 启动脚本
    init();

})();