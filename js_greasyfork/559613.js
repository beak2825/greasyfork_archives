// ==UserScript==
// @name         高砖积木清单提取
// @namespace    http://tampermonkey.net/
// @version      2.4.1
// @description  以Material Design 3风格，提取高砖网站可购零件数据，显示在悬浮弹窗中，支持乐高编码映射。目前存在代码冗余和乐高编码可能错误的问题
// @author       大生
// @match        https://gobricks.cn/batch*
// @connect      gobricks.cn
// @grant        GM_xmlhttpRequest
// @icon         https://gobricks.cn/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559613/%E9%AB%98%E7%A0%96%E7%A7%AF%E6%9C%A8%E6%B8%85%E5%8D%95%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/559613/%E9%AB%98%E7%A0%96%E7%A7%AF%E6%9C%A8%E6%B8%85%E5%8D%95%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建悬浮按钮 (Google Material Design 3 风格)
    function createFloatingButton() {
        const button = document.createElement('div');
        button.id = 'brick-extractor-btn';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            提取数据
        `;
        button.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            height: 48px;
            padding: 0 16px;
            background: #fff;
            color: #1f1f1f;
            border: 1px solid #e0e0e0;
            border-radius: 16px;
            cursor: pointer;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 500;
            font-family: "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1), 0 2px 6px 2px rgba(0,0,0,0.05);
            transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
            user-select: none;
            letter-spacing: 0.25px;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 2px 4px -1px rgba(0,0,0,0.1), 0 4px 8px 0 rgba(0,0,0,0.08)';
            button.style.background = '#f8f9fa';
        });

        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.1), 0 2px 6px 2px rgba(0,0,0,0.05)';
            button.style.background = '#fff';
        });

        button.addEventListener('click', showBrickModal);
        document.body.appendChild(button);
    }

    // 本地映射数据库（备用方案）
    const LOCAL_MAPPING_DATABASE = {
        // 这里将存储完整的映射关系
        // 格式: "原始ID": { gdsCode: "GDS-xxx-yyy", legoCode: "xxxxx" }
        // 可以通过批量API调用来生成这个数据库
        
        // 示例数据（实际使用时会包含完整映射）
        "3001": { gdsCode: "GDS-1011-15", legoCode: "24119" },
        "3002": { gdsCode: "GDS-923-15", legoCode: "32054" },
        "3003": { gdsCode: "GDS-664-15", legoCode: "32316" },
        // ... 更多映射数据将在这里
    };

    // 生成完整本地映射数据库的函数（开发时使用）
    async function generateLocalMappingDatabase() {
        try {
            console.log('🔄 开始生成完整的本地映射数据库...');
            
            // 这个函数用于开发时生成完整的映射数据
            // 可以通过批量调用API来获取所有可能的映射关系
            
            const commonDesignIds = [];
            
            // 生成常见的设计ID范围（可以根据实际情况调整）
            for (let i = 1; i <= 10000; i++) {
                commonDesignIds.push(i.toString());
            }
            
            const batchSize = 100; // 每批处理100个
            const allMappings = {};
            
            for (let i = 0; i < commonDesignIds.length; i += batchSize) {
                const batch = commonDesignIds.slice(i, i + batchSize);
                console.log(`处理批次 ${Math.floor(i/batchSize) + 1}/${Math.ceil(commonDesignIds.length/batchSize)}`);
                
                try {
                    const testList = batch.map(id => ({
                        designid: id,
                        quantity: 1,
                        colorid: "15",
                        color_type: "ldr"
                    }));

                    const response = await fetch('/frontend/v1/community/lego2ItemList', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'platform': 'pc'
                        },
                        body: JSON.stringify({ testList })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.itemList) {
                            data.itemList.forEach(item => {
                                if (item.info && item.info.designid && item.info.id) {
                                    allMappings[item.info.id] = {
                                        gdsCode: item.info.designid,
                                        legoCode: item.info.legoCode || item.info.blItemNo || ''
                                    };
                                }
                            });
                        }
                    }
                    
                    // 避免请求过于频繁
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.warn(`批次 ${Math.floor(i/batchSize) + 1} 处理失败:`, error);
                }
            }
            
            console.log('✅ 生成的映射数据库:', allMappings);
            console.log('📊 总映射数量:', Object.keys(allMappings).length);
            
            // 输出可以直接复制到代码中的格式
            const codeFormat = JSON.stringify(allMappings, null, 8).replace(/"/g, '"');
            console.log('📋 可复制的代码格式:');
            console.log(`const LOCAL_MAPPING_DATABASE = ${codeFormat};`);
            
            return allMappings;
        } catch (error) {
            console.error('❌ 生成本地映射数据库失败:', error);
            return {};
        }
    }
    // 从本地映射数据库获取编码
    function getCodeFromLocalDatabase(originalId) {
        const mapping = LOCAL_MAPPING_DATABASE[originalId];
        if (mapping) {
            return {
                gdsCode: mapping.gdsCode,
                legoCode: mapping.legoCode,
                shortGdsCode: extractShortGdsCode(mapping.gdsCode)
            };
        }
        return null;
    }

    async function getLegoCodeFromCSV() {
        try {
            console.log('开始从CSV获取乐高编码映射...');
            
            // 查找页面中的CSV文件名
            let fileName = null;
            
            // 策略：寻找"格式转换列表（零件编号已转为高砖零件编号）"标题对应的文件
            const titleElements = document.querySelectorAll('.min_title');
            let targetContainer = null;
            
            console.log('开始扫描页面元素寻找目标CSV...');
            
            for (const el of titleElements) {
                if (el.textContent.includes('格式转换列表（零件编号已转为高砖零件编号）')) {
                    console.log('找到目标标题元素:', el.textContent);
                    // 向上查找 .file_cont 容器
                    targetContainer = el.closest('.file_cont');
                    if (targetContainer) {
                        break;
                    }
                }
            }

            if (targetContainer) {
                const titleSpan = targetContainer.querySelector('.upfileTitle.showListTitle');
                if (titleSpan) {
                    // title 属性通常包含完整文件名
                    fileName = titleSpan.getAttribute('title') || titleSpan.textContent.trim();
                    console.log('✅ 找到目标CSV文件名:', fileName);
                } else {
                    console.warn('❌ 在目标容器中未找到文件名元素');
                }
            } else {
                // 后备策略：如果找不到特定容器，尝试全局搜索包含"格式转换列表"的文件
                console.warn('⚠️ 未找到特定标题容器，尝试全局搜索...');
                const allElements = document.querySelectorAll('.upfileTitle.showListTitle');
                for (const element of allElements) {
                    const text = element.textContent || '';
                    if (text.includes('格式转换列表') && text.includes('.csv')) {
                        fileName = element.getAttribute('title') || text.trim();
                        console.log('✅ 全局搜索找到备选CSV:', fileName);
                        break;
                    }
                }
            }
            
            if (!fileName) {
                console.warn('❌ 未找到CSV文件名');
                return {};
            }
            
            // 检查文件名长度，如果太长使用POST请求
            const encodedFileName = encodeURIComponent(fileName);
            console.log('编码后的文件名长度:', encodedFileName.length);
            
            // 使用 GM_xmlhttpRequest 下载 CSV，避免 403 错误
            return await downloadCSVWithGM(fileName);
        } catch (error) {
            console.error('❌ 从CSV获取乐高编码失败:', error);
            return {};
        }
    }

    // 尝试使用页面内部的 Nuxt Axios 下载 (绕过 Token 问题)
    function downloadCSVWithNuxt(fileName) {
        return new Promise((resolve, reject) => {
            if (typeof unsafeWindow === 'undefined') {
                reject(new Error('unsafeWindow 不可用'));
                return;
            }

            const axios = unsafeWindow.$nuxt?.$axios || unsafeWindow.$nuxt?.context?.$axios;
            
            if (!axios) {
                reject(new Error('未找到页面 Nuxt Axios 实例'));
                return;
            }

            console.log('🚀 尝试使用页面内置 Axios 下载 CSV (自动处理Token)...');
            const baseUrl = window.location.origin;
            const url = `/frontend/v1/community/downloadConversionList`; // Axios 通常会自动处理 baseURL，但这里用相对路径更稳

            axios.post(url, { fileName: fileName }, {
                responseType: 'text', // 期望文本响应
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'platform': 'pc'
                }
            }).then(response => {
                 console.log('✅ 页面 Axios 下载 CSV 成功');
                 resolve(response.data);
            }).catch(error => {
                 console.error('❌ 页面 Axios 下载失败:', error);
                 reject(error);
            });
        });
    }

    // 使用 GM_xmlhttpRequest 下载 CSV
    async function downloadCSVWithGM(fileName) {
        // 策略 1: 优先尝试使用页面内置 Axios (最稳，自动带Token)
        try {
            const csvText = await downloadCSVWithNuxt(fileName);
            if (csvText) {
                return parseCSVForLegoCode(csvText);
            }
        } catch (e) {
            console.warn('⚠️ 页面内置 Axios 下载失败，降级使用 GM_xmlhttpRequest', e);
        }

        // 策略 2: 使用 GM_xmlhttpRequest (需要手动找 Token)
        return new Promise((resolve, reject) => {
            console.log('使用 GM_xmlhttpRequest 下载 CSV:', fileName);
            const encodedFileName = encodeURIComponent(fileName);
            // 必须使用绝对URL
            const baseUrl = window.location.origin;
            const url = `${baseUrl}/frontend/v1/community/downloadConversionList?fileName=${encodedFileName}`;
            
            // --- Token 查找逻辑 ---
            let token = '';

            // 1. 尝试常见 Storage Key
            const possibleKeys = ['token', 'access_token', 'Authorization', 'auth_token', 'gobricks_token'];
            for (const key of possibleKeys) {
                token = localStorage.getItem(key) || sessionStorage.getItem(key);
                if (token) {
                    console.log(`✅ 在 Storage [${key}] 中找到 Token`);
                    break;
                }
            }

            // 2. 遍历 Storage 查找疑似 Token
            if (!token) {
                const searchStorage = (storage, name) => {
                    for (let i = 0; i < storage.length; i++) {
                        const key = storage.key(i);
                        if (key.toLowerCase().includes('token')) {
                            const val = storage.getItem(key);
                            if (val && val.length > 20) { // 简单的长度过滤
                                console.log(`✅ 在 ${name} [${key}] 中模糊匹配到 Token`);
                                return val;
                            }
                        }
                    }
                    return null;
                };
                token = searchStorage(localStorage, 'localStorage') || searchStorage(sessionStorage, 'sessionStorage');
            }

            // 3. 尝试从 Cookie 解析
            if (!token && document.cookie) {
                const match = document.cookie.match(/token=([^;]+)/) || document.cookie.match(/auth=([^;]+)/);
                if (match) {
                    token = match[1];
                    console.log('✅ 从 Cookie 中解析到 Token');
                }
            }
            
            // 4. 尝试 Nuxt 状态
            if (!token) {
                try {
                    const nuxt = window.__NUXT__ || window.$nuxt;
                    if (nuxt) {
                         // 路径可能是 state.token, state.auth.token, state.user.token 等
                         token = nuxt.state?.token || nuxt.state?.auth?.token || nuxt.state?.user?.token;
                         if (token) console.log('✅ 从 Nuxt State 中找到 Token');
                    }
                } catch (e) { console.warn('Nuxt 状态检查出错', e); }
            }

            if (!token) {
                console.warn('⚠️ 未找到任何 Token，请求可能失败');
            } else {
                // 简单的 Bearer 清理 (如果 token 已经包含 Bearer 前缀，就不要重复添加)
                if (token.startsWith('Bearer ')) token = token.replace('Bearer ', '');
            }
            
            // --- End Token 查找 ---

            // 构造完整的 Header
            const headers = {
                'platform': 'pc',
                'Content-Type': 'application/json;charset=UTF-8',
                'Referer': window.location.href,
                'Origin': window.location.origin,
                'X-Requested-With': 'XMLHttpRequest'
            };

            if (token) {
                headers['Authorization'] = 'Bearer ' + token;
                headers['token'] = token; //有些后端可能用这个自定义头
            }
            
            console.log('GM GET 请求 Headers:', headers);

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: headers,
                withCredentials: true,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const csvText = response.responseText;
                        console.log('GM CSV文件下载成功，文件大小:', csvText.length);
                        if (!csvText.trim()) {
                            resolve({});
                        } else {
                            resolve(parseCSVForLegoCode(csvText));
                        }
                    } else {
                        console.error('GM CSV下载失败:', response.status, response.statusText);
                        // 尝试 POST 方法
                        downloadCSVWithGMPost(fileName).then(resolve).catch(reject);
                    }
                },
                onerror: function(error) {
                    // 详细记录错误信息
                    console.error('GM CSV网络错误 (GET):', JSON.stringify(error, null, 2));
                    // 尝试查看 responseText 是否包含错误详情
                    if (error.responseText) {
                        console.error('错误响应内容:', error.responseText);
                    }
                    reject(error);
                }
            });
        });
    }

    // 使用 GM_xmlhttpRequest POST 下载 CSV
    function downloadCSVWithGMPost(fileName) {
        return new Promise((resolve, reject) => {
            console.log('尝试 GM_xmlhttpRequest POST 下载...');
            
            const baseUrl = window.location.origin;
            const url = `${baseUrl}/frontend/v1/community/downloadConversionList`;

            // --- Token 查找逻辑 (复用 GET 方法的逻辑，简化写) ---
            let token = '';
            const possibleKeys = ['token', 'access_token', 'Authorization', 'auth_token', 'gobricks_token'];
            for (const key of possibleKeys) {
                token = localStorage.getItem(key) || sessionStorage.getItem(key);
                if (token) break;
            }
            if (!token && document.cookie) {
                 const match = document.cookie.match(/token=([^;]+)/) || document.cookie.match(/auth=([^;]+)/);
                 if (match) token = match[1];
            }
            if (!token) {
                try {
                    const nuxt = window.__NUXT__ || window.$nuxt;
                    if (nuxt) token = nuxt.state?.token || nuxt.state?.auth?.token || nuxt.state?.user?.token;
                } catch (e) {}
            }
            if (token && token.startsWith('Bearer ')) token = token.replace('Bearer ', '');
            
            const headers = {
                'Content-Type': 'application/json;charset=UTF-8',
                'platform': 'pc',
                'Referer': window.location.href,
                'Origin': window.location.origin,
                'X-Requested-With': 'XMLHttpRequest'
            };

            if (token) {
                headers['Authorization'] = 'Bearer ' + token;
                headers['token'] = token;
            }

            console.log('GM POST 请求 Headers:', headers);

            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                data: JSON.stringify({ fileName: fileName }),
                headers: headers,
                withCredentials: true,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const csvText = response.responseText;
                        console.log('GM POST CSV文件下载成功');
                        resolve(parseCSVForLegoCode(csvText));
                    } else {
                        reject(new Error(`GM POST下载失败: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    console.error('GM CSV网络错误 (POST):', JSON.stringify(error, null, 2));
                    reject(error);
                }
            });
        });
    }

    // (已废弃) 使用GET请求下载CSV
    async function downloadCSVLegacy(fileName) {
        const encodedFileName = encodeURIComponent(fileName);
        // ... (保留旧代码作为参考或删除)
        // 为保持代码整洁，这里直接替换掉原有的 downloadCSVWithPost 调用逻辑
    }

    // 解析CSV文件获取乐高编码映射
    function parseCSVForLegoCode(csvText) {
        try {
            console.log('开始解析CSV文件获取乐高编码...');
            const lines = csvText.split('\n').filter(line => line.trim());
            console.log('CSV总行数:', lines.length);
            
            if (lines.length < 2) {
                console.warn('CSV文件行数不足');
                return {};
            }

            // CSV解析函数
            function parseCSVLine(line) {
                const result = [];
                let current = '';
                let inQuotes = false;
                
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        result.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }
                result.push(current.trim());
                return result;
            }

            const headers = parseCSVLine(lines[0]);
            console.log('CSV表头:', headers);
            
            const blItemNoIndex = headers.findIndex(h => h && h.trim() === 'BLItemNo');
            const ldrawIdIndex = headers.findIndex(h => h && h.trim() === 'LdrawId');
            const gobrickPartIndex = headers.findIndex(h => h && h.trim() === 'Gobrick Part');

            console.log('CSV解析 - 找到列索引:', { blItemNoIndex, ldrawIdIndex, gobrickPartIndex });

            if (gobrickPartIndex === -1) {
                console.warn('❌ CSV文件中未找到 Gobrick Part 列');
                console.log('可用的列名:', headers);
                return {};
            }

            const mapping = {};
            let successCount = 0;
            
            for (let i = 1; i < lines.length; i++) {
                const columns = parseCSVLine(lines[i]);
                
                // 确保行有足够的数据
                if (columns.length > gobrickPartIndex) {
                    const gobrickPart = columns[gobrickPartIndex]?.trim();
                    
                    // 获取乐高编码：优先 LdrawId，其次 BLItemNo
                    let legoCode = '';
                    if (ldrawIdIndex !== -1) {
                        legoCode = columns[ldrawIdIndex]?.trim();
                    }
                    if (!legoCode && blItemNoIndex !== -1) {
                        legoCode = columns[blItemNoIndex]?.trim();
                    }
                    
                    if (gobrickPart && gobrickPart.startsWith('GDS-') && legoCode) {
                        // 清理乐高编码 (例如去除 '32123a' 中的 'a' 如果需要，但用户似乎想要原始值，这里保持原样)
                        // 注意：有些用户可能偏好纯数字，但LDraw ID常带字母后缀
                        
                        mapping[gobrickPart] = legoCode;
                        
                        // 同时映射精简版GDS码 (例如 GDS-616)
                        const shortGds = extractShortGdsCode(gobrickPart);
                        if (shortGds && shortGds !== gobrickPart) {
                             // 如果短码还没被占用，或者当前是更优的映射，可以考虑映射
                             // 这里简单起见，如果还没映射才添加
                             if (!mapping[shortGds]) {
                                 mapping[shortGds] = legoCode;
                             }
                        }

                        successCount++;
                        if (i <= 5) { // 只显示前5行的详细日志
                            console.log(`✅ 添加映射: ${gobrickPart} -> ${legoCode}`);
                        }
                    }
                }
            }

            console.log(`✅ CSV解析完成，成功创建${successCount}个乐高编码映射`);
            return mapping;
        } catch (error) {
            console.error('❌ 解析CSV文件失败:', error);
            return {};
        }
    }

    // 通过API获取高德斯编码映射
    async function getGobricksCodeFromAPI(items) {
        try {
            console.log('开始通过API获取高德斯编码...');
            
            const testList = items.map(item => ({
                designid: item.originalId || item.designid || item.product_id,
                quantity: item.quantity || item.inventory || 1,
                colorid: item.color_id || "15",
                color_type: "ldr"
            }));

            console.log('API请求数据:', testList.slice(0, 3)); // 显示前3个

            const response = await fetch('/frontend/v1/community/lego2ItemList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'platform': 'pc'
                },
                body: JSON.stringify({ testList })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            console.log('API响应数据:', data);
            
            const gobricksMapping = {};
            const legoMapping = {};

            // 辅助函数：处理单个列表项
            const processItems = (list) => {
                if (!list || !Array.isArray(list)) return;
                list.forEach(item => {
                    if (item.info && item.info.id) {
                         // Mapping: Original ID (from request) -> GDS Code
                         if (item.designid) {
                             gobricksMapping[item.designid] = item.info.id;
                         }

                         // Mapping: GDS Code -> LEGO Code
                         if (item.info.designid) {
                             legoMapping[item.info.id] = item.info.designid;
                             // 关键修复：同时建立 原始ID -> 乐高编码 的映射
                             // 防止因颜色/库存变动导致 GDS ID 变更（如 GDS-xxx-090 -> GDS-xxx-010）而无法查到乐高编码
                             if (item.designid) {
                                 legoMapping[item.designid] = item.info.designid;
                             }
                         }
                    }
                });
            };

            // 处理所有可能的返回列表
            processItems(data.itemList);
            processItems(data.colorDeficiency);
            processItems(data.inventoryDeficiency);
            // missList 通常不包含 info，所以可能无法提取映射，但可以尝试
            if (data.missList) {
                 data.missList.forEach(item => {
                     // 如果 missList 中有 designid 且是 GDS 格式，可能需要保留原样或其他处理
                 });
            }

            console.log(`✅ API获取高德斯编码成功，获得${Object.keys(gobricksMapping).length}个高砖映射，${Object.keys(legoMapping).length}个乐高映射`);
            return { gobricksMapping, legoMapping };
        } catch (error) {
            console.error('❌ 从API获取高德斯编码失败:', error);
            return { gobricksMapping: {}, legoMapping: {} };
        }
    }

    // 提取精简的高德斯编码（去除颜色编码）
    function extractShortGdsCode(fullCode) {
        if (!fullCode || fullCode === '无编码') return '';
        // 匹配 GDS-xxx 格式，去除后面的颜色编码
        const match = fullCode.match(/GDS-\d+/i);
        return match ? match[0] : '';
    }

    // 提取当前页面的积木数据
    function extractCurrentPageBricks(remark = '') {
        const bricks = [];
        if (window.__NUXT__?.data?.[0]?.items) {
            const items = window.__NUXT__.data[0].items;
            items.forEach(item => {
                bricks.push({
                    name: item.caption || '未知名称',
                    quantity: item.inventory || 0,
                    originalId: item.product_id || item.designid || '无编码', // 原始ID，用于API查询
                    color_id: item.color_id || '15',
                    gdsCode: '', // 将通过API获取
                    shortGdsCode: '', // 将从gdsCode提取
                    legoCode: '', // 将从CSV获取
                    image: item.picture || '',
                    remark: remark
                });
            });
        } else {
            const brickElements = document.querySelectorAll('[data-v-c26449d4] .item');
            brickElements.forEach(element => {
                const nameEl = element.querySelector('.serialSize');
                const codeEl = element.querySelector('.serial');
                const quantityEl = element.querySelector('.replace_quantity');
                const imageEl = element.querySelector('img');

                if (nameEl && codeEl) {
                    bricks.push({
                        name: nameEl.textContent.trim(),
                        quantity: quantityEl ? quantityEl.textContent.replace('x ', '').trim() : '1',
                        originalId: codeEl.textContent.trim(),
                        color_id: '15', // DOM模式暂默认黑色
                        gdsCode: '', // 将通过API获取
                        shortGdsCode: '', // 将从gdsCode提取
                        legoCode: '', // 将从CSV获取
                        image: imageEl ? imageEl.src : '',
                        remark: remark
                    });
                }
            });
        }
        return bricks;
    }

    // 提取积木数据的主函数
    async function extractBrickData() {
        try {
            let allBricks = [];
            const switchContainer = document.querySelector('[data-v-6f6f0294].switch_part_type');

            if (!switchContainer) {
                allBricks = extractCurrentPageBricks('');
            } else {
                const availableButton = Array.from(switchContainer.querySelectorAll('.itemSelectBtn')).find(btn => btn.textContent.includes('可购'));
                const shortageButton = Array.from(switchContainer.querySelectorAll('.itemSelectBtn')).find(btn => btn.textContent.includes('缺货'));

                if (!availableButton || !shortageButton) {
                    allBricks = extractCurrentPageBricks('');
                } else {
                    const isInitiallyOnShortage = shortageButton.classList.contains('itemSelect');
                    const originalActiveButton = isInitiallyOnShortage ? shortageButton : availableButton;
                    const otherButton = isInitiallyOnShortage ? availableButton : shortageButton;

                    const currentRemark = isInitiallyOnShortage ? '缺货' : '';
                    allBricks = allBricks.concat(extractCurrentPageBricks(currentRemark));

                    const otherRemark = isInitiallyOnShortage ? '' : '缺货';
                    const otherCountMatch = otherButton.textContent.match(/\d+/);
                    const otherHasItems = otherCountMatch && parseInt(otherCountMatch[0], 10) > 0;

                    if (otherHasItems) {
                        otherButton.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        allBricks = allBricks.concat(extractCurrentPageBricks(otherRemark));
                    }

                    if (originalActiveButton.isConnected && !originalActiveButton.classList.contains('itemSelect')) {
                         originalActiveButton.click();
                         await new Promise(resolve => setTimeout(resolve, 150));
                    }
                }
            }

            console.log('提取到的原始积木数据:', allBricks.length, '个');

            // 1. 获取高德斯编码和乐高编码映射（从API）
            let gobricksCodeMapping = {};
            let apiLegoCodeMapping = {};
            
            // 使用提取到的积木数据进行API查询，不再依赖 window.__NUXT__
            if (allBricks.length > 0) {
                const apiResult = await getGobricksCodeFromAPI(allBricks);
                gobricksCodeMapping = apiResult.gobricksMapping;
                apiLegoCodeMapping = apiResult.legoMapping;
            }
            console.log('获取到的高德斯编码映射数量:', Object.keys(gobricksCodeMapping).length);
            console.log('获取到的API乐高编码映射数量:', Object.keys(apiLegoCodeMapping).length);

            // 2. 获取CSV乐高编码映射（作为重要的数据补充）
            let csvLegoCodeMapping = {};
            // 始终尝试获取CSV，因为API数据可能不准确（如 GDS-616, GDS-1103 等情况）
            try {
                csvLegoCodeMapping = await getLegoCodeFromCSV();
                console.log('获取到的CSV乐高编码映射数量:', Object.keys(csvLegoCodeMapping).length);
            } catch (error) {
                console.warn('CSV获取失败:', error.message);
            }

            // 3. 统计本地数据库可用数据
            const localDatabaseSize = Object.keys(LOCAL_MAPPING_DATABASE).length;
            console.log('本地数据库映射数量:', localDatabaseSize);

            // 4. 为每个积木添加完整的编码信息
            allBricks = allBricks.map(brick => {
                let gdsCode = '';
                let legoCode = '';
                let shortGdsCode = '';
                let dataSource = '';

                // 步骤A: 确定高德斯编码 (优先API)
                if (Object.keys(gobricksCodeMapping).length > 0) {
                    gdsCode = gobricksCodeMapping[brick.originalId] || '';
                }
                if (!gdsCode) gdsCode = brick.originalId;
                
                // 提取精简编码
                shortGdsCode = extractShortGdsCode(gdsCode);

                // 步骤B: 确定乐高编码
                // 策略：CSV优先于API，因为CSV通常包含人工校对的准确映射
                
                // 1. 尝试从 CSV 获取 (匹配 GDS全码 或 精简码)
                if (Object.keys(csvLegoCodeMapping).length > 0) {
                    legoCode = csvLegoCodeMapping[gdsCode] || csvLegoCodeMapping[shortGdsCode] || '';
                    if (legoCode) dataSource = 'CSV';
                }

                // 2. 如果CSV没找到，尝试从 API 获取
                if (!legoCode && Object.keys(apiLegoCodeMapping).length > 0) {
                    // 先尝试用 GDS 码查
                    legoCode = apiLegoCodeMapping[gdsCode] || apiLegoCodeMapping[shortGdsCode];
                    // 如果没查到，尝试用原始 ID 查 (修复 GDS ID 变更问题)
                    if (!legoCode) {
                        legoCode = apiLegoCodeMapping[brick.originalId];
                    }
                    if (legoCode) dataSource = 'API';
                }

                // 3. 最后尝试本地数据库
                if (!legoCode) {
                    const localData = getCodeFromLocalDatabase(brick.originalId);
                    if (localData && localData.legoCode) {
                        legoCode = localData.legoCode;
                        dataSource = '本地';
                    }
                }

                // 最后的备用处理
                if (!gdsCode) gdsCode = brick.originalId || '无编码';
                if (!shortGdsCode) shortGdsCode = extractShortGdsCode(gdsCode);
                if (!dataSource) dataSource = '无数据';

                console.log(`积木映射: ${brick.name} | 原始ID: ${brick.originalId} | 高德斯: ${gdsCode} | 精简: ${shortGdsCode} | 乐高: ${legoCode || '未找到'} | 来源: ${dataSource}`);

                return {
                    ...brick,
                    gdsCode: gdsCode,
                    shortGdsCode: shortGdsCode,
                    legoCode: legoCode
                };
            });

            return allBricks;

        } catch (error) {
            console.error('提取数据时出错:', error);
            try {
                const availableButton = document.querySelector('[data-v-6f6f0294].switch_part_type .itemSelectBtn:not(.itemSelect)');
                if(availableButton) availableButton.click();
            } catch (restoreError) {
                console.error('恢复视图失败:', restoreError);
            }
            return [];
        }
    }

    // 创建弹窗 (Google Material Design 3 风格)
    async function showBrickModal() {
        if (document.getElementById('brick-modal')) return;

        showNotification('🔄 正在提取积木数据...', 'info');
        const bricks = await extractBrickData();
        
        const existingNotification = document.querySelector('.brick-notification');
        if (existingNotification) existingNotification.remove();

        if (bricks.length === 0) {
            showNotification('ℹ️ 未找到积木数据，或页面未完全加载', 'warning');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'brick-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.3); z-index: 10001; display: flex;
            align-items: center; justify-content: center; backdrop-filter: blur(4px);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #fff; border-radius: 28px; width: 90%; max-width: 1200px;
            height: 85%; display: flex; flex-direction: column;
            box-shadow: 0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3);
            overflow: hidden;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 16px 24px; border-bottom: 1px solid #e0e0e0; position: relative;
            flex-shrink: 0;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&#x2715;';
        closeBtn.style.cssText = `
            position: absolute; top: 16px; right: 16px; width: 40px; height: 40px;
            background: transparent; color: #5f6368; border: none; border-radius: 50%;
            cursor: pointer; font-size: 20px; transition: background-color 0.2s;
            display: flex; align-items: center; justify-content: center;
        `;
        closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = 'rgba(0,0,0,0.08)'; });
        closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = 'transparent'; });
        closeBtn.addEventListener('click', () => modal.remove());

        const title = document.createElement('h2');
        title.textContent = '积木零件数据';
        title.style.cssText = `
            margin: 0; font-size: 24px; font-weight: 500;
            font-family: "Google Sans", Roboto, sans-serif; color: #1f1f1f; padding-right: 50px;
        `;

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制表格';
        copyBtn.style.cssText = `
            margin-top: 16px; padding: 8px 24px; background: transparent; color: #1a73e8;
            border: 1px solid #dadce0; border-radius: 20px; cursor: pointer; font-size: 14px;
            font-weight: 500; transition: all 0.2s; font-family: "Google Sans", Roboto, sans-serif;
        `;
        copyBtn.addEventListener('mouseenter', () => { copyBtn.style.background = 'rgba(26, 115, 232, 0.05)'; });
        copyBtn.addEventListener('mouseleave', () => { copyBtn.style.background = 'transparent'; });
        copyBtn.addEventListener('click', () => copyTableData(bricks));

        header.appendChild(title);
        header.appendChild(copyBtn);
        header.appendChild(closeBtn);

        const tableContainer = document.createElement('div');
        tableContainer.style.cssText = 'flex: 1; overflow: auto;';
        const table = document.createElement('table');
        table.style.cssText = 'width: 100%; border-collapse: collapse; font-size: 14px;';
        const thead = document.createElement('thead');
        thead.style.cssText = 'position: sticky; top: 0; background: #fff; z-index: 1;';
        thead.innerHTML = `
            <tr style="border-bottom: 1px solid #e0e0e0;">
                <th style="padding: 12px; font-weight: 500; color: #5f6368; text-align: left;">#</th>
                <th style="padding: 12px; font-weight: 500; color: #5f6368; text-align: left;">积木名称</th>
                <th style="padding: 12px; font-weight: 500; color: #5f6368; text-align: center;">数量</th>
                <th style="padding: 12px; font-weight: 500; color: #5f6368; text-align: left;">高德斯编码</th>
                <th style="padding: 12px; font-weight: 500; color: #5f6368; text-align: left;">精简编码</th>
                <th style="padding: 12px; font-weight: 500; color: #5f6368; text-align: left;">乐高编码</th>
                <th style="padding: 12px; font-weight: 500; color: #5f6368; text-align: center;">图片</th>
                <th style="padding: 12px; font-weight: 500; color: #5f6368; text-align: center;">备注</th>
            </tr>
        `;
        const tbody = document.createElement('tbody');
        bricks.forEach((brick, index) => {
            const row = document.createElement('tr');
            const isShortage = brick.remark === '缺货';
            row.style.cssText = `border-bottom: 1px solid #f0f0f0; transition: background-color 0.2s;`;
            if (isShortage) row.style.background = '#fce8e6';
            row.addEventListener('mouseenter', () => { if (!isShortage) row.style.background = '#f1f3f4'; });
            row.addEventListener('mouseleave', () => { if (!isShortage) row.style.background = 'transparent'; });
            row.innerHTML = `
                <td style="padding: 12px; color: #5f6368;">${index + 1}</td>
                <td style="padding: 12px; color: #202124;">${brick.name}</td>
                <td style="padding: 12px; color: #202124; text-align: center;">${brick.quantity}</td>
                <td style="padding: 12px; color: #3c4043; font-family: 'Roboto Mono', monospace;">${brick.gdsCode}</td>
                <td style="padding: 12px; color: #3c4043; font-family: 'Roboto Mono', monospace;">${brick.shortGdsCode}</td>
                <td style="padding: 12px; color: #1a73e8; font-family: 'Roboto Mono', monospace; font-weight: 500;">${brick.legoCode || '-'}</td>
                <td style="padding: 12px; text-align: center;">
                    ${brick.image ? `<img src="${brick.image}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px;" >` : '-'}
                </td>
                <td style="padding: 12px; text-align: center; color: ${isShortage ? '#d93025' : '#202124'}; font-weight: ${isShortage ? '500' : '400'};">${brick.remark || '-'}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        modalContent.appendChild(header);
        modalContent.appendChild(tableContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // 复制表格数据（富文本HTML，可粘贴至Excel）
    function copyTableData(bricks) {
        // 1. 创建HTML表格字符串
        let htmlTable = `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; font-size: 14px;">
                            <thead>
                                <tr style="background: #f2f2f2; font-weight: bold;">
                                    <th style="padding: 8px;">积木名称</th>
                                    <th style="padding: 8px;">数量</th>
                                    <th style="padding: 8px;">高德斯编码</th>
                                    <th style="padding: 8px;">精简编码</th>
                                    <th style="padding: 8px;">乐高编码</th>
                                    <th style="padding: 8px;">图片</th>
                                    <th style="padding: 8px;">备注</th>
                                </tr>
                            </thead>
                            <tbody>`;
        bricks.forEach((brick) => {
            const isShortage = brick.remark === '缺货';
            htmlTable += `
                <tr style="${isShortage ? 'background-color: #fce8e6;' : ''}">
                    <td style="padding: 8px; border: 1px solid #e0e0e0;">${brick.name}</td>
                    <td style="padding: 8px; border: 1px solid #e0e0e0; text-align: center;">${brick.quantity}</td>
                    <td style="padding: 8px; border: 1px solid #e0e0e0; font-family: monospace;">${brick.gdsCode}</td>
                    <td style="padding: 8px; border: 1px solid #e0e0e0; font-family: monospace;">${brick.shortGdsCode}</td>
                    <td style="padding: 8px; border: 1px solid #e0e0e0; font-family: monospace; color: #1a73e8; font-weight: 500;">${brick.legoCode || '-'}</td>
                    <td style="padding: 8px; border: 1px solid #e0e0e0; text-align: center;">
                        ${brick.image ? `<img src="${brick.image}" width="50" height="50" style="object-fit: contain;">` : '-'}
                    </td>
                    <td style="padding: 8px; border: 1px solid #e0e0e0; text-align: center; ${isShortage ? 'color: #d93025; font-weight: 500;' : ''}">${brick.remark || '-'}</td>
                </tr>`;
        });
        htmlTable += `</tbody></table>`;

        // 2. 创建纯文本备用格式
        let textData = '积木名称\t数量\t高德斯编码\t精简编码\t乐高编码\t图片\t备注\n';
        bricks.forEach((brick) => {
            textData += `${brick.name}\t${brick.quantity}\t${brick.gdsCode}\t${brick.shortGdsCode}\t${brick.legoCode || '-'}\t${brick.image}\t${brick.remark || '-'}\n`;
        });

        // 3. 尝试使用现代Clipboard API复制HTML和文本
        if (navigator.clipboard && window.isSecureContext) {
            const item = new ClipboardItem({
                'text/html': new Blob([htmlTable], { type: 'text/html' }),
                'text/plain': new Blob([textData], { type: 'text/plain' })
            });
            navigator.clipboard.write([item]).then(() => {
                showNotification('✅ 已复制富文本表格，可粘贴到Excel', 'success');
            }).catch(err => {
                console.error('富文本复制失败, 尝试纯文本:', err);
                fallbackCopy(textData);
            });
        } else {
            fallbackCopy(textData);
        }
    }

    // 备用复制方法
    function fallbackCopy(textData) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textData).then(() => {
                showNotification('✅ 已复制纯文本数据', 'success');
            }).catch(err => {
                console.error('现代API复制失败，使用传统方法:', err);
                legacyCopy(textData);
            });
        } else {
            legacyCopy(textData);
        }
    }

    // 传统复制方法（兼容旧浏览器）
    function legacyCopy(textData) {
        const textArea = document.createElement('textarea');
        textArea.value = textData;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('✅ 已复制纯文本数据 (兼容模式)', 'success');
            } else {
                showNotification('❌ 复制失败，请手动操作', 'error');
            }
        } catch (err) {
            console.error('传统复制方法失败:', err);
            showNotification('❌ 复制失败，请手动操作', 'error');
        }
        document.body.removeChild(textArea);
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.brick-notification');
        if(existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'brick-notification';
        const colors = {
            info: '#2196F3', success: '#4CAF50', error: '#F44336', warning: '#FF9800'
        };
        notification.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: ${colors[type]}; color: white; padding: 12px 24px;
            border-radius: 8px; z-index: 10002; font-size: 14px; font-weight: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2); opacity: 0; transition: all 0.3s;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => { notification.style.opacity = '1'; }, 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // 开发者工具：在控制台中调用此函数来生成本地映射数据库
    window.generateMappingDatabase = generateLocalMappingDatabase;
    
    // 开发者工具：手动添加映射到本地数据库
    window.addToLocalDatabase = function(originalId, gdsCode, legoCode) {
        LOCAL_MAPPING_DATABASE[originalId] = {
            gdsCode: gdsCode,
            legoCode: legoCode
        };
        console.log(`✅ 已添加映射: ${originalId} -> ${gdsCode} -> ${legoCode}`);
        console.log('当前本地数据库大小:', Object.keys(LOCAL_MAPPING_DATABASE).length);
    };

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createFloatingButton);
        } else {
            createFloatingButton();
        }
    }

    init();
})();