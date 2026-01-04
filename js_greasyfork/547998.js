// ==UserScript==
// @name         阿里巴巴产品360分析数据采集
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  采集阿里巴巴产品360分析关键词数据
// @author       树洞先生
// @license      MIT
// @match        https://data.alibaba.com/product/overview*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/547998/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E4%BA%A7%E5%93%81360%E5%88%86%E6%9E%90%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/547998/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E4%BA%A7%E5%93%81360%E5%88%86%E6%9E%90%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从cookie中提取ctoken
    function extractCtokenFromCookie() {
        const match = document.cookie.match(/ctoken=([^;&]+)/);
        return match ? match[1] : 'axky2vnha4zf';
    }

    // 生成动态callback
    function generateCallback() {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 90000) + 10000;
        return `jsonp_${timestamp}_${randomNum}`;
    }

    // 计算当前月份和周数（使用ISO标准）
    function getCurrentTimeInfo() {
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // getMonth()返回0-11
        const currentYear = now.getFullYear();
        
        // 使用ISO标准计算当前是第几周
        const startOfYear = new Date(currentYear, 0, 1);
        const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        
        return { currentMonth, currentYear, currentWeek: weekNum };
    }

    // 计算目标时间段
    function calculateTimePeriod(statisticsType, selected) {
        const { currentMonth, currentYear, currentWeek } = getCurrentTimeInfo();
        const now = new Date();
        
        if (statisticsType === "month") {
            // 月份计算逻辑
            let targetMonth;
            if (now.getDate() <= 5) {
                // 北京时间低于5号，时间段为当前月份减2
                targetMonth = currentMonth - 2;
            } else {
                // 超过5号，时间段为当前月份减1
                targetMonth = currentMonth - 1;
            }
            
            let targetYear = currentYear;
            if (targetMonth <= 0) {
                targetMonth += 12;
                targetYear = currentYear - 1;
            }
            
            return `${targetYear}-${targetMonth.toString().padStart(2, '0')}`;
        } else {
            // 周数计算逻辑（ISO标准）
            let targetWeek;
            if (now.getDay() === 1) { // 周一
                // 使用ISO标准是周一，时间段为当前周次减3
                targetWeek = currentWeek - 3;
            } else {
                // 使用ISO标准不是周一，时间段为当前周次减2
                targetWeek = currentWeek - 2;
            }
            
            let targetYear = currentYear;
            if (targetWeek <= 0) {
                targetWeek += 52; // 假设一年52周
                targetYear = currentYear - 1;
            }
            
            return `${targetYear}-W${targetWeek.toString().padStart(2, '0')}`;
        }
    }

    // 创建用户界面
    function createUI() {
        // 等待产品详情区域加载
        waitForElement('.area-title', function(productDetailArea) {
            if (productDetailArea) {
                console.log('找到产品详情区域，创建按钮');
                createButtonInArea(productDetailArea);
            } else {
                console.log('未找到产品详情区域，使用默认位置');
                createDefaultUI();
            }
        });
    }

    // 等待元素出现的函数
    function waitForElement(selector, callback, maxAttempts = 30) {
        let attempts = 0;
        
        function checkElement() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkElement, 1000); // 每秒检查一次
            } else {
                console.log(`等待元素 ${selector} 超时，使用默认位置`);
                callback(null);
            }
        }
        
        checkElement();
    }

    // 在产品详情区域创建按钮
    function createButtonInArea(productDetailArea) {
        // 找到 area-title 下所有 span
        const spans = productDetailArea.querySelectorAll('span');
        // 取第三个（下标2），如果没有则兜底用最后一个
        let targetSpan = spans[2] || spans[spans.length - 1] || productDetailArea;
    
        // 创建按钮
        const triggerBtn = document.createElement('button');
        triggerBtn.textContent = '产品360分析';
        triggerBtn.style.cssText = `
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 12px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        targetSpan.insertAdjacentElement('afterend', triggerBtn);
    
        const panel = createPanel();
        document.body.appendChild(panel);
        bindPanelEvents(triggerBtn);
    }

    // 创建弹窗HTML内容
    function createPanelHTML() {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #007bff;">产品360分析数据采集</h3>
                <button id="closePanel" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #666;">×</button>
            </div>
            <div style="margin-bottom: 10px;">
                <label>产品ID(可批量):</label>
                <textarea id="prodId" rows="4" placeholder="每行一个产品ID" style="width: 100%; margin-top: 5px; resize: vertical;"></textarea>
            </div>
            <div style="margin-bottom: 10px;">
                <label>终端类型:</label>
                <select id="terminalType" style="width: 100%; margin-top: 5px;">
                    <option value="TOTAL">TOTAL</option>
                    <option value="PC">PC</option>
                    <option value="APP">APP</option>
                    <option value="WAP">WAP</option>
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <label>统计类型:</label>
                <select id="statisticsType" style="width: 100%; margin-top: 5px;">
                    <option value="week">week</option>
                    <option value="month">month</option>
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <label>时间段选择:</label>
                <input type="number" id="selected" value="1" min="1" style="width: 100%; margin-top: 5px;">
                <small style="color: #666;">1=最近一周/月，2=上两周/月，依此类推</small>
            </div>
            <div style="margin-bottom: 15px;">
                <button id="startCollect" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; width: 100%;">
                    开始采集
                </button>
            </div>
            <div id="status" style="font-size: 12px; color: #666;"></div>
        `;
    }

    // 创建弹窗容器
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'product360Panel';
        panel.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            background: white;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            min-width: 300px;
            display: none;
        `;
        panel.innerHTML = createPanelHTML();
        return panel;
    }

    // 绑定弹窗事件
    function bindPanelEvents(triggerBtn) {
        triggerBtn.addEventListener('click', function() {
            const panel = document.getElementById('product360Panel');
            if (panel.style.display === 'none' || panel.style.display === '') {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        });

        document.getElementById('closePanel').addEventListener('click', function() {
            document.getElementById('product360Panel').style.display = 'none';
        });

        document.getElementById('startCollect').addEventListener('click', startCollection);
    }

    // 创建默认UI（当找不到产品详情区域时使用）
    function createDefaultUI() {
        // 创建触发按钮
        const triggerBtn = document.createElement('button');
        triggerBtn.textContent = '产品360分析';
        triggerBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        const panel = createPanel();
        document.body.appendChild(triggerBtn);
        document.body.appendChild(panel);
        bindPanelEvents(triggerBtn);
    }

    // 并发池实现
    function createLimit(max) {
        let running = 0, queue = [];
        function next() {
            if (queue.length && running < max) {
                running++;
                queue.shift()().finally(() => {
                    running--;
                    next();
                });
            }
        }
        return fn => new Promise((resolve, reject) => {
            queue.push(() => fn().then(resolve, reject));
            next();
        });
    }

    // 开始采集
    async function startCollection() {
        const prodIdRaw = document.getElementById('prodId').value;
        const terminalType = document.getElementById('terminalType').value;
        const statisticsType = document.getElementById('statisticsType').value;
        const selected = document.getElementById('selected').value;
        const statusDiv = document.getElementById('status');

        // 处理批量ID
        let prodIds = prodIdRaw.split(/\r?\n/).map(x => x.trim()).filter(x => x);
        prodIds = Array.from(new Set(prodIds)); // 去重
        if (prodIds.length === 0) {
            statusDiv.innerHTML = '请至少输入一个产品ID';
            return;
        }

        statusDiv.innerHTML = '正在采集数据...';
        try {
            const ctoken = extractCtokenFromCookie();
            const callback = generateCallback();
            const timePeriod = calculateTimePeriod(statisticsType, selected);
            const { currentMonth, currentYear, currentWeek } = getCurrentTimeInfo();

            let wb = XLSX.utils.book_new();
            let totalCount = 0;
            let finished = 0;
            const limit = createLimit(5); // 最多5个并发

            async function collectOneProduct(prodId, idx) {
                let page = 1;
                let allRecords = [];
                while (true) {
                    const params = {
                        action: 'OneAction',
                        iName: 'vip/product/360/wordAnalysis/content',
                        isVip: 'true',
                        terminalType: terminalType,
                        statisticType: 'os',
                        selected: selected,
                        statisticsType: statisticsType,
                        prodId: prodId,
                        pageCount: page.toString(),
                        ctoken: ctoken,
                        callback: callback,
                        _: Date.now().toString()
                    };
                    const response = await fetchData(params);
                    if (!response.success) {
                        statusDiv.innerHTML = `产品ID:${prodId} 第${page}页请求失败: ${response.error}`;
                        break;
                    }
                    if (response.data.length === 0) {
                        break;
                    }
                    // 处理数据
                    const processedRecords = response.data.map(record => {
                        if (record.p4pState) {
                            Object.keys(record.p4pState).forEach(key => {
                                record[`p4pState_${key}`] = record.p4pState[key];
                            });
                            delete record.p4pState;
                        }
                        // 添加用户输入参数
                        record.产品ID = prodId;
                        record.终端类型 = terminalType;
                        record.统计类型 = statisticsType;
                        record.时间段 = timePeriod;
                        return record;
                    });
                    allRecords.push(...processedRecords);
                    page++;
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                // 字段映射
                const fieldMap = {
                    searchKeyword: '关键词',
                    searchImps: '搜索曝光次数',
                    searchClicks: '搜索点击次数',
                    p4pExposureCnt: '直通车曝光次数',
                    p4pClickCnt: '直通车点击次数',
                    detailUv: '商品详情页访问人数',
                    fbUv: '店内询盘人数',
                    tmUv: '店内TM咨询人数',
                    crtOrdUv: '店内订单买家人数',
                    uvAbRate: '商机转化率',
                    p4pState_isAllowAdded: '是否允许添加到直通车',
                    p4pState_isP4pKeyword: '是否为直通车关键词',
                    产品ID: '产品ID',
                    终端类型: '终端类型',
                    统计类型: '统计类型',
                    时间段: '时间段'
                };
                // 处理数据
                const processedData = allRecords.map(record => {
                    const newRecord = {};
                    Object.keys(fieldMap).forEach(key => {
                        if (record[key] !== undefined) {
                            newRecord[fieldMap[key]] = record[key];
                        }
                    });
                    // 商机转化率转为百分号格式
                    if (newRecord['商机转化率'] !== undefined) {
                        newRecord['商机转化率'] = (newRecord['商机转化率'] * 100).toFixed(2) + '%';
                    }
                    return newRecord;
                });
                totalCount += processedData.length;
                const ws = XLSX.utils.json_to_sheet(processedData);
                XLSX.utils.book_append_sheet(wb, ws, prodId);
                finished++;
                statusDiv.innerHTML = `已完成${finished}/${prodIds.length}个产品ID采集...`;
            }

            await Promise.all(
                prodIds.map((prodId, idx) => limit(() => collectOneProduct(prodId, idx)))
            );

            // 文件名逻辑
            let filename = '';
            if (prodIds.length === 1) {
                filename = `${prodIds[0]}_360分析关键词信息.xlsx`;
            } else {
                filename = `多个产品ID_360分析关键词信息.xlsx`;
            }
            XLSX.writeFile(wb, filename);
            statusDiv.innerHTML = `采集完成！共${totalCount}条数据，已保存到 ${filename}`;
        } catch (error) {
            statusDiv.innerHTML = `采集失败: ${error.message}`;
            console.error('采集错误:', error);
        }
    }

    // 获取数据
    function fetchData(params) {
        return new Promise((resolve) => {
            const queryString = Object.keys(params)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://hz-mydata.alibaba.com/self/.json?${queryString}`,
                headers: {
                    'Accept': '*/*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6',
                    'Referer': 'https://data.alibaba.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
                },
                onload: function(response) {
                    try {
                        const match = response.responseText.match(/jsonp_\d+_\d+\((.*)\)/);
                        if (match) {
                            const data = JSON.parse(match[1]);
                            resolve({
                                success: true,
                                data: data.data || []
                            });
                        } else {
                            resolve({
                                success: false,
                                error: '无法解析响应数据'
                            });
                        }
                    } catch (error) {
                        resolve({
                            success: false,
                            error: `解析错误: ${error.message}`
                        });
                    }
                },
                onerror: function(error) {
                    resolve({
                        success: false,
                        error: `请求失败: ${error.message}`
                    });
                }
            });
        });
    }

    // 初始化
    createUI();
})();