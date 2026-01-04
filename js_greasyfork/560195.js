// ==UserScript==
// @name         美丽加SAAS工具包
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一个集成的工具脚本，包含批量新增次数卡、批量合并财务账单等功能。
// @author       Claude Code & Cika
// @match        https://console.mljia.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/560195/%E7%BE%8E%E4%B8%BD%E5%8A%A0SAAS%E5%B7%A5%E5%85%B7%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/560195/%E7%BE%8E%E4%B8%BD%E5%8A%A0SAAS%E5%B7%A5%E5%85%B7%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局共享变量和配置 ---
    let ACCESS_TOKEN = null;
    let SHOP_SID = null;

    // --- 共享辅助函数 ---
    const log = (message) => {
        const logArea = document.querySelector('.custom-log-area-toolbox');
        if (logArea) {
            logArea.value += `[${new Date().toLocaleTimeString()}] ${message}\n`;
            logArea.scrollTop = logArea.scrollHeight;
        }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const generateRandomId = (length = 13) => {
        return Array.from({ length }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
    };

    // --- 共享核心: 令牌和店铺ID嗅探器 ---
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string' && url.includes('access_token=')) {
            const tokenMatch = url.match(/access_token=([^&]+)/);
            if (tokenMatch && tokenMatch[1] && ACCESS_TOKEN !== tokenMatch[1]) {
                ACCESS_TOKEN = tokenMatch[1];
                log(`成功捕获/更新Token: ${ACCESS_TOKEN.substring(0, 8)}...`);
            }
            const shopSidMatch = url.match(/shop_sid=([^&]+)/);
            if (shopSidMatch && shopSidMatch[1] && SHOP_SID !== shopSidMatch[1]) {
                SHOP_SID = shopSidMatch[1];
                log(`成功捕获/更新Shop SID: ${SHOP_SID}`);
            }
        }
        return originalOpen.apply(this, arguments);
    };

    // --- 共享API请求封装 ---
    function apiRequest(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                timeout: 15000,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            // 尝试解析JSON，如果失败则返回原始文本
                            resolve(JSON.parse(response.responseText));
                        } catch (e) {
                            resolve(response.responseText);
                        }
                    } else {
                        reject(new Error(`HTTP错误: ${response.status}. 响应: ${response.responseText.substring(0, 200)}`));
                    }
                },
                onerror: () => reject(new Error('网络请求失败')),
                ontimeout: () => reject(new Error('请求超时'))
            });
        });
    }

    // --- 工具1: 批量新增次数卡 ---
    const cicardTool = {
        projectDataCache: null,
        DEFAULT_PAYLOAD: {
            shop_sid: null, uuid: "", card_type_id: null, card_type: 0, card_name: "", card_price: 0, min_price: "", max_price: "",
            recommend_agent_type_id: "", recommend_agent_type_name: "全部", is_show: 0, if_sell: 1, is_top: 0, is_recommend: 0,
            card_image: "", activate_type: 0, card_content: "", show_tag: false, buy_card_flag: 0, sms_price: 0, re_deduct_flag: 0,
            re_deduct_num: 0, deduct_flag: 0, deduct_num: 0,
            mul_setting: [{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1}],
            mul_recharge_setting: [{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1}],
            wb_re_deduct_flag: 0, wb_re_deduct_num: 0, wb_deduct_flag: 0, wb_deduct_num: 0,
            wb_mul_setting: [{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1}],
            wb_mul_recharge_setting: [{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1},{"deduct_value":0,"deduct_flag":1}],
            massage_list: [], product_list: [], card_preferential_exs: [], store_money: "", form: true, access_token: null, shopSid: null
        },

        async fetchCardTypeId() {
            const url = `https://saas.mljia.cn/material/card/id?sid=${SHOP_SID}&access_token=${ACCESS_TOKEN}&shop_sid=${SHOP_SID}&shopSid=${SHOP_SID}&randomid=${generateRandomId()}`;
            log('正在动态获取次卡类型ID...');
            try {
                const data = await apiRequest({ method: "GET", url });
                if (data && data.content) {
                    log(`成功获取到次卡类型ID: ${data.content}`);
                    return data.content;
                }
                throw new Error('响应中未找到有效的 "content" 字段。');
            } catch (error) {
                log(`获取次卡类型ID失败: ${error.message}`);
                throw error;
            }
        },

        async fetchAndCacheProjectData() {
            if (this.projectDataCache) return this.projectDataCache;
            const apiUrl = `https://saas.mljia.cn/material/massage/type/tree?shop_sid=${SHOP_SID}&flg=0&proId=0&access_token=${ACCESS_TOKEN}&shopSid=${SHOP_SID}&randomid=${generateRandomId()}`;
            try {
                log('正在获取项目数据...');
                const outerResponse = await apiRequest({ method: "GET", url: apiUrl });
                if (outerResponse && typeof outerResponse.content === 'string') {
                    const decodedContent = decodeURIComponent(atob(outerResponse.content).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                    const projectList = JSON.parse(decodedContent);
                    if (Array.isArray(projectList)) {
                        this.projectDataCache = projectList;
                        log('项目数据获取并缓存成功。');
                        return this.projectDataCache;
                    }
                }
                if (Array.isArray(outerResponse)) {
                   this.projectDataCache = outerResponse;
                   log('项目数据获取并缓存成功 (直接数组)。');
                   return this.projectDataCache;
                }
                throw new Error('解析后的项目数据格式不正确。');
            } catch (error) {
                log(`获取项目数据失败: ${error.message}`);
                alert('获取项目数据失败，请检查网络或API，然后刷新重试。');
                throw error;
            }
        },

        findProjectByName(name, nodes) {
            for (const node of nodes) {
                if (node.massage_type_name === name) return { ...node, type_flag: 0 };
                if (node.massage_list) {
                    for (const item of node.massage_list) {
                        if (item.massage_name === name) return { ...item, type_flag: 1 };
                    }
                }
                if (node.massage_type_list) {
                    const found = this.findProjectByName(name, node.massage_type_list);
                    if (found) return found;
                }
            }
            return null;
        },

        async addCicard(payload) {
            const url = `https://saas.mljia.cn/material/card/add/cicard?access_token=${ACCESS_TOKEN}&shop_sid=${SHOP_SID}&shopSid=${SHOP_SID}`;
            const formData = new URLSearchParams();
            for (const key in payload) {
                formData.append(key, typeof payload[key] === 'object' && payload[key] !== null ? JSON.stringify(payload[key]) : payload[key]);
            }
            return await apiRequest({ method: "POST", url, data: formData.toString(), headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" } });
        },

        async main() {
            const container = document.querySelector('.custom-toolbox-container');
            const startButton = container.querySelector('.custom-start-button');
            const fileInput = container.querySelector('.custom-file-input');
            startButton.disabled = true;
            startButton.innerText = '正在处理...';
            const successReport = [];
            const failureReport = [];

            try {
                if (!ACCESS_TOKEN || !SHOP_SID) throw new Error('未能自动获取Token或Shop SID。');
                await this.fetchAndCacheProjectData();
                const file = fileInput.files[0];
                if (!file) throw new Error('请先选择一个Excel文件。');

                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data);
                const sheetName = workbook.SheetNames[0];
                const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                log(`成功解析Excel，共 ${excelData.length} 条数据。`);

                log('开始进行项目预校验...');
                const notFoundProjects = new Set();
                for (const row of excelData) {
                    const projectInfo = row['项目信息'] || '';
                    const giftInfo = row['赠送项目'] || '';
                    for (const item of [...projectInfo.split('|'), ...giftInfo.split('|')]) {
                        if (!item) continue;
                        const [name] = item.split('*').map(s => s.trim());
                        if (name && !this.findProjectByName(name, this.projectDataCache)) {
                            notFoundProjects.add(name);
                        }
                    }
                }
                if (notFoundProjects.size > 0) throw new Error(`预校验失败！以下项目/分类不存在: ${Array.from(notFoundProjects).join(', ')}。`);
                log('项目预校验通过。');

                for (const [index, row] of excelData.entries()) {
                    const cardName = row['次卡名称'];
                    log(`--- 开始处理第 ${index + 1}/${excelData.length} 条: ${cardName || '无卡名'} ---`);
                    try {
                        const dynamicCardTypeId = await this.fetchCardTypeId();
                        if (!dynamicCardTypeId) throw new Error('未能获取到次卡类型ID');

                        const cardPrice = row['次卡价格'];
                        const projectInfo = row['项目信息'];
                        if (!cardName || cardPrice === undefined || !projectInfo) throw new Error('缺少次卡名称/价格/项目信息');

                        const finalPayload = JSON.parse(JSON.stringify(this.DEFAULT_PAYLOAD));
                        Object.assign(finalPayload, { card_type_id: dynamicCardTypeId, card_name: cardName, card_price: cardPrice, uuid: generateRandomId(32), massage_list: [], card_preferential_exs: [], shop_sid: SHOP_SID, access_token: ACCESS_TOKEN, shopSid: SHOP_SID });

                        const giftInfo = row['赠送项目'] || '';
                        if (projectInfo) {
                            const projectParts = projectInfo.split('|').map(p => p.trim());
                            for (const part of projectParts) {
                                const [name, numStr] = part.split('*').map(s => s.trim());
                                const num = parseInt(numStr, 10);
                                if (!name || isNaN(num) || num <= 0) continue;
                                const project = this.findProjectByName(name, this.projectDataCache);
                                if (!project) continue;

                                if (project.type_flag === 1) { // 具体项目
                                    finalPayload.massage_list.push({ massage_discount: 10, massage_num: num, massage_or_type_id: project.massage_id, massage_or_type_name: project.massage_name, massage_time: -1, original_price: project.massage_price, price: project.massage_price, total_price: project.massage_price * num, type_flag: 1 });
                                    log(`已添加项目: ${name} x ${num}`);
                                } else if (project.type_flag === 0) { // 项目分类
                                    finalPayload.massage_list.push({ massage_discount: 10, massage_num: num, massage_or_type_id: project.massage_type_id, massage_or_type_name: project.massage_type_name, massage_time: -1, original_price: 0, price: 0, total_price: 0, type_flag: 0 });
                                    log(`已添加分类: ${name} x ${num}`);
                                }
                            }
                        }
                        if (giftInfo) {
                            const giftParts = giftInfo.split('|').map(p => p.trim());
                            for (const part of giftParts) {
                                const [name, numStr] = part.split('*').map(s => s.trim());
                                const num = parseInt(numStr, 10);
                                if (!name || isNaN(num) || num <= 0) continue;
                                const project = this.findProjectByName(name, this.projectDataCache);
                                if (!project) continue;

                                if (project.type_flag === 1) { // 赠送具体项目
                                    finalPayload.card_preferential_exs.push({ info: project.massage_name, massage_id: project.massage_id, massage_left: num, massage_type_id: 0, original_price: project.massage_price, price: 0, total_price: 0, time: -1 });
                                    log(`已添加赠送项目: ${name} x ${num}`);
                                } else if (project.type_flag === 0) { // 赠送分类
                                    finalPayload.card_preferential_exs.push({ info: project.massage_type_name, massage_id: 0, massage_left: num, massage_type_id: project.massage_type_id, original_price: 0, price: 0, total_price: 0, time: -1 });
                                    log(`已添加赠送分类: ${name} x ${num}`);
                                }
                            }
                        }

                        if (finalPayload.massage_list.length === 0) throw new Error('未能成功添加任何有效项目');

                        log(`正在为 "${cardName}" 创建次卡...`);
                        const response = await this.addCicard(finalPayload);
                        if (response.status === 200) {
                            log(`次卡 "${cardName}" 创建成功！`);
                            successReport.push(cardName);
                        } else {
                            throw new Error(`API返回失败: ${response.errorMessage || JSON.stringify(response)}`);
                        }
                    } catch (e) {
                        log(`[失败] 处理卡 "${cardName}" 时出错: ${e.message}`);
                        failureReport.push({ name: cardName || `第 ${index + 1} 行`, reason: e.message });
                    }
                    await delay(500);
                }
            } catch (error) {
                log(`发生严重错误: ${error.stack || error.message}`);
            } finally {
                log('\n--- 操作总结 ---');
                if (successReport.length > 0) log(`成功创建 ${successReport.length} 张卡: ${successReport.join(', ')}`);
                if (failureReport.length > 0) {
                    log(`创建失败 ${failureReport.length} 张卡:`);
                    failureReport.forEach(fail => log(`  - 卡名: ${fail.name}, 原因: ${fail.reason}`));
                }
                log('--- 总结结束 ---');
                startButton.disabled = false;
                startButton.innerText = '上传表格并开始创建';
            }
        }
    };

    // --- 工具2: 财务账单批量合并 ---
    const mergeBillsTool = {
        ORDER_ID_COLUMN: 'party_order_id',
        BATCH_SIZE: 10,
        API_DELAY: 500,
        BATCH_DELAY: 1000,

        async getFinanceBillId(partyOrderId) {
            const url = `https://saas.mljia.cn/finance/bill/v1/${SHOP_SID}/supplement?party_order_id=${partyOrderId}&page=1&rows=8&access_token=${ACCESS_TOKEN}&shop_sid=${SHOP_SID}&shopSid=${SHOP_SID}&randomid=${generateRandomId()}`;
            const data = await apiRequest({ method: "GET", url });
            if (data.content) {
                const decoded = atob(data.content);
                const contentData = JSON.parse(decoded);
                if (Array.isArray(contentData) && contentData.length > 0) {
                    return contentData[0].finance_bill_id;
                }
            }
            return null;
        },

        async getTransactionId() {
            const url = `https://saas.mljia.cn/finance/bill/v1/id?shopId[flag]=0&access_token=${ACCESS_TOKEN}&shop_sid=${SHOP_SID}&shopSid=${SHOP_SID}&randomid=${generateRandomId()}`;
            const data = await apiRequest({ method: "GET", url });
            if (data.content) {
                const decoded = atob(data.content);
                const contentData = JSON.parse(decoded);
                return contentData.finance_bill_id;
            }
            throw new Error("获取事务ID失败。");
        },

        async mergeFinanceBills(transactionId, billIds) {
            const url = `https://saas.mljia.cn/finance/bill/v1/${SHOP_SID}/${transactionId}/merge?access_token=${ACCESS_TOKEN}&shop_sid=${SHOP_SID}&shopSid=${SHOP_SID}`;
            const payload = { finance_bill_ids: billIds, access_token: ACCESS_TOKEN, shop_sid: SHOP_SID, shopSid: SHOP_SID };
            return await apiRequest({ method: "POST", url, data: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
        },

        parseExcelFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        if (jsonData.length === 0) return reject(new Error("表格文件为空或第一页没有数据。"));
                        const headers = Object.keys(jsonData[0]);
                        if (!headers.includes(this.ORDER_ID_COLUMN)) return reject(new Error(`表格缺少必需的列: '${this.ORDER_ID_COLUMN}'。`));
                        const ids = jsonData.map(row => row[this.ORDER_ID_COLUMN]).filter(id => id != null).map(id => id.toString().trim()).filter(Boolean);
                        if (ids.length === 0) return reject(new Error(`在'${this.ORDER_ID_COLUMN}'列中未找到任何有效的订单编号。`));
                        resolve(ids);
                    } catch (error) {
                        reject(new Error(`解析表格文件时发生错误: ${error.message}`));
                    }
                };
                reader.onerror = () => reject(new Error("读取文件失败。"));
                reader.readAsArrayBuffer(file);
            });
        },

        async main() {
            const container = document.querySelector('.custom-toolbox-container');
            const startButton = container.querySelector('.custom-start-button');
            const fileInput = container.querySelector('.custom-file-input');
            startButton.disabled = true;
            startButton.innerText = '正在处理...';
            try {
                log('开始处理...');
                if (!ACCESS_TOKEN || !SHOP_SID) throw new Error('未能自动获取Token或Shop SID。');
                const file = fileInput.files[0];
                if (!file) throw new Error('请先选择一个表格文件。');
                const orderIds = await this.parseExcelFile(file);
                log(`成功解析 ${orderIds.length} 个订单编号。`);
                log("开始将订单号转换为财务账单ID...");
                const financeBillIds = [];
                let notFoundCount = 0;
                for (const [index, orderId] of orderIds.entries()) {
                    await delay(this.API_DELAY);
                    log(`  (${index + 1}/${orderIds.length}) 查询订单 ${orderId}...`);
                    const billId = await this.getFinanceBillId(orderId);
                    if (billId) {
                        log(`    -> 成功, 账单ID: ${billId}`);
                        financeBillIds.push(billId);
                    } else {
                        log(`    -> 警告: 未找到账单ID，已跳过。`);
                        notFoundCount++;
                    }
                }
                log(`转换完成。成功: ${financeBillIds.length}, 失败/跳过: ${notFoundCount}。`);
                if (financeBillIds.length === 0) throw new Error("没有可供合并的有效账单ID。");
                log(`开始分批合并，每批 ${this.BATCH_SIZE} 个...`);
                const totalBatches = Math.ceil(financeBillIds.length / this.BATCH_SIZE);
                for (let i = 0; i < financeBillIds.length; i += this.BATCH_SIZE) {
                    const batch = financeBillIds.slice(i, i + this.BATCH_SIZE);
                    const batchNum = (i / this.BATCH_SIZE) + 1;
                    log(`\n--- 处理第 ${batchNum}/${totalBatches} 批 (共 ${batch.length} 个) ---`);
                    await delay(this.BATCH_DELAY);
                    try {
                        log("  步骤 1/2: 获取事务ID...");
                        const transactionId = await this.getTransactionId();
                        log(`    -> 成功: ${transactionId}`);
                        log("  步骤 2/2: 执行合并...");
                        const result = await this.mergeFinanceBills(transactionId, batch);
                        log(`    -> 合并成功！服务器响应: ${JSON.stringify(result)}`);
                    } catch (batchError) {
                         log(`  处理第 ${batchNum} 批时出错: ${batchError.message}`);
                    }
                }
                log('\n--- 所有批次处理完毕 ---');
            } catch (error) {
                log(`错误: \n${error.stack || error.message}`);
            } finally {
                startButton.disabled = false;
                startButton.innerText = '上传表格并开始合并';
            }
        }
    };


    // --- 主UI框架 ---
    function createMainUI() {
        if (document.getElementById('custom-toolbox-toggle-button')) return;

        GM_addStyle(`
            /* 主容器和切换按钮样式 */
            .custom-toolbox-container { position: fixed; top: 100px; right: 20px; width: 380px; background-color: #f0f8ff; border: 1px solid #add8e6; border-radius: 8px; z-index: 10000; padding: 20px; box-shadow: 0 6px 12px rgba(0,0,0,0.15); font-family: sans-serif; display: none; }
            #custom-toolbox-toggle-button { position: fixed; top: 160px; right: 0; z-index: 9999; background-color: #2c3e50; color: white; padding: 12px 18px; border: none; border-top-left-radius: 8px; border-bottom-left-radius: 8px; cursor: pointer; box-shadow: -2px 2px 5px rgba(0,0,0,0.2); font-size: 16px; writing-mode: vertical-rl; text-orientation: mixed; }
            #custom-toolbox-toggle-button:hover { background-color: #34495e; }

            /* 通用UI元素 */
            .custom-toolbox-container .custom-toolbox-close-button { position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #7f8c8d; }
            .custom-toolbox-container .custom-toolbox-close-button:hover { color: #2c3e50; }
            .custom-toolbox-container h3 { margin-top: 0; border-bottom: 2px solid #bdc3c7; padding-bottom: 12px; font-size: 18px; color: #2c3e50; }
            .custom-toolbox-container .tool-selection-view button { width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #3498db; background-color: #ffffff; color: #3498db; border-radius: 5px; cursor: pointer; font-size: 15px; transition: all 0.3s; }
            .custom-toolbox-container .tool-selection-view button:hover { background-color: #3498db; color: white; }
            .custom-toolbox-container .custom-file-input { margin-bottom: 10px; border: 1px solid #ccc; padding: 8px; width: calc(100% - 18px); border-radius: 4px; }
            .custom-toolbox-container .custom-start-button { width: 100%; padding: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; transition: background-color 0.3s; }
            .custom-toolbox-container .custom-start-button:disabled { background-color: #bdc3c7; }
            .custom-toolbox-container .custom-back-button { margin-top: 15px; background: none; border: none; color: #3498db; cursor: pointer; font-size: 14px; }
            .custom-toolbox-container .custom-log-area-toolbox { width: calc(100% - 12px); height: 300px; margin-top: 15px; border: 1px solid #ccc; padding: 5px; overflow-y: scroll; background-color: #fff; font-size: 12px; line-height: 1.5; color: #333; white-space: pre-wrap; border-radius: 4px; }

            /* 特定工具的颜色 */
            .cicard-tool-view .custom-start-button { background-color: #007bff; }
            .cicard-tool-view .custom-start-button:hover { background-color: #0056b3; }
            .merge-bills-tool-view .custom-start-button { background-color: #28a745; }
            .merge-bills-tool-view .custom-start-button:hover { background-color: #218838; }
        `);

        const container = document.createElement('div');
        container.className = 'custom-toolbox-container';
        document.body.appendChild(container);

        const toggleButton = document.createElement('button');
        toggleButton.id = 'custom-toolbox-toggle-button';
        toggleButton.textContent = '工具包';
        document.body.appendChild(toggleButton);

        toggleButton.addEventListener('click', () => {
            container.style.display = (container.style.display === 'none' || !container.style.display) ? 'block' : 'none';
        });

        const renderToolSelection = () => {
            container.innerHTML = `
                <button class="custom-toolbox-close-button">&times;</button>
                <h3>美丽加工具包 v1.0</h3>
                <div class="tool-selection-view">
                    <button id="select-cicard-tool">批量新增次数卡 (v0.6)</button>
                    <button id="select-merge-bills-tool">财务账单批量合并 (v1.3)</button>
                </div>
                <textarea class="custom-log-area-toolbox" readonly></textarea>
            `;
            container.querySelector('.custom-toolbox-close-button').addEventListener('click', () => container.style.display = 'none');
            document.getElementById('select-cicard-tool').addEventListener('click', renderCicardToolUI);
            document.getElementById('select-merge-bills-tool').addEventListener('click', renderMergeBillsToolUI);
            log('脚本已加载。请进行一次任意的后台操作以捕获Token和Shop SID。');
        };

        const renderCicardToolUI = () => {
             container.innerHTML = `
                <button class="custom-toolbox-close-button">&times;</button>
                <h3>批量新增次数卡工具 v0.6</h3>
                <div class="cicard-tool-view">
                    <p>格式说明: 项目和赠送项目均为 "名称*数量", 多个用 "|" 分隔。</p>
                    <input type="file" class="custom-file-input" accept=".xlsx, .xls">
                    <button class="custom-start-button">上传表格并开始创建</button>
                    <textarea class="custom-log-area-toolbox" readonly></textarea>
                    <button class="custom-back-button">返回工具列表</button>
                </div>
            `;
            container.querySelector('.custom-toolbox-close-button').addEventListener('click', () => container.style.display = 'none');
            container.querySelector('.custom-start-button').addEventListener('click', cicardTool.main.bind(cicardTool));
            container.querySelector('.custom-back-button').addEventListener('click', renderToolSelection);
        };

        const renderMergeBillsToolUI = () => {
             container.innerHTML = `
                <button class="custom-toolbox-close-button">&times;</button>
                <h3>财务账单批量合并工具 v1.3</h3>
                 <div class="merge-bills-tool-view">
                    <p>请上传包含'party_order_id'列的Excel文件。</p>
                    <input type="file" class="custom-file-input" accept=".xlsx, .xls">
                    <button class="custom-start-button">上传表格并开始合并</button>
                    <textarea class="custom-log-area-toolbox" readonly></textarea>
                    <button class="custom-back-button">返回工具列表</button>
                </div>
            `;
            container.querySelector('.custom-toolbox-close-button').addEventListener('click', () => container.style.display = 'none');
            container.querySelector('.custom-start-button').addEventListener('click', mergeBillsTool.main.bind(mergeBillsTool));
            container.querySelector('.custom-back-button').addEventListener('click', renderToolSelection);
        };

        renderToolSelection(); // 初始渲染工具选择界面
    }

    // --- 脚本入口 ---
    window.addEventListener('load', () => {
        // 使用MutationObserver确保UI在SPA路由切换后依然存在
        const observer = new MutationObserver(() => {
            if (!document.getElementById('custom-toolbox-toggle-button')) {
                createMainUI();
            }
        });
        createMainUI();
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();

// --- 占位符区域 ---
// cicardTool 对象的函数将在这里被定义
// mergeBillsTool 对象的函数将在这里被定义
// 为了简洁，具体实现已在内部逻辑中处理，这里仅作结构展示
