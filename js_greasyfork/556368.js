// ==UserScript==
// @name         小米路由器增强脚本
// @namespace    XziXmn
// @version      0.7
// @description  集成 AI 厂商分类、批量静态 IP 管理、实时流量监控悬浮窗，支持分块并发分析 OUI 数据库，具备进度条、中断功能
// @author       XziXmn
// @match        *://*/cgi-bin/luci/;stok=*/*
// @connect      standards-oui.ieee.org
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/556368/%E5%B0%8F%E7%B1%B3%E8%B7%AF%E7%94%B1%E5%99%A8%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/556368/%E5%B0%8F%E7%B1%B3%E8%B7%AF%E7%94%B1%E5%99%A8%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== A. 配置与常量 ====================

    // 配置存储键
    const AI_API_KEY_KEY = 'ai_api_key'; // Bearer Token
    const AI_API_URL_KEY = 'ai_api_url'; // 完整的 API URL
    const AI_MODEL_ID_KEY = 'ai_model_id'; // 模型名称
    const AI_FEATURE_ENABLED_KEY = 'ai_feature_enabled';
    const AI_CONCURRENCY_KEY = 'ai_concurrency'; // 并发线程数

    const RAW_DB_KEY = 'offline_mac_db_raw'; // 原始 OUI 厂商数据库
    const AI_DB_KEY = 'offline_mac_db_ai'; // AI 分析后的分类数据库
    const DEVICE_NOTES_KEY = 'device_notes'; // 设备备注存储

    const MAX_PROMPT_CHARS = 80000; // 单个任务块中厂商列表的最大字符数 (保守值)

    const OUI_SOURCES = [
        { url: 'https://standards-oui.ieee.org/oui/oui.txt', type: 'MA-L', len: 6 },
        { url: 'https://standards-oui.ieee.org/oui28/mam.txt', type: 'MA-M', len: 7 },
        { url: 'https://standards-oui.ieee.org/oui36/oui36.txt', type: 'MA-S', len: 9 }
    ];

    // 全局状态
    let analysisAborted = false; // 新增：用于中断 AI 分析任务的标志

    // 全局函数
    const getToken = () => /;stok=([\da-f]{32})/.exec(location.href)?.[1] || '';
    const getApiKey = () => GM_getValue(AI_API_KEY_KEY, '');

    // 文件下载工具
    function downloadFile(content, fileName, mimeType) {
        const a = document.createElement('a');
        const blob = new Blob([content], { type: mimeType });
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    // 设备备注管理
    const DeviceNotes = {
        get: function(mac) {
            const notes = JSON.parse(GM_getValue(DEVICE_NOTES_KEY, '{}'));
            return notes[mac.toUpperCase()] || '';
        },
        set: function(mac, note) {
            const notes = JSON.parse(GM_getValue(DEVICE_NOTES_KEY, '{}'));
            notes[mac.toUpperCase()] = note;
            GM_setValue(DEVICE_NOTES_KEY, JSON.stringify(notes));
        },
        delete: function(mac) {
            const notes = JSON.parse(GM_getValue(DEVICE_NOTES_KEY, '{}'));
            delete notes[mac.toUpperCase()];
            GM_setValue(DEVICE_NOTES_KEY, JSON.stringify(notes));
        },
        getAll: function() {
            return JSON.parse(GM_getValue(DEVICE_NOTES_KEY, '{}'));
        }
    };


    // ==================== B. AI 工具与数据库模块 (MacDB) ====================

    const MacDB = (function() {

        // --- 1. 原始数据下载与解析 (保持一致) ---

        function parseIEEE(text) {
            const map = {};
            const regex = /^([0-9A-F-]{8,})[\s\t]+\(hex\)[\s\t]+(.+)$/gim;
            let match;
            while ((match = regex.exec(text)) !== null) {
                let rawPrefix = match[1].replace(/-/g, '').toUpperCase();
                let vendor = match[2].trim().replace(/[\r\n]+/g, '').trim();
                if (rawPrefix && vendor) {
                    map[rawPrefix] = vendor;
                }
            }
            return map;
        }

        function download(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    timeout: 60000,
                    onload: (res) => {
                        if (res.status === 200) resolve(res.responseText);
                        else reject(new Error(`下载失败：HTTP ${res.status} for ${url}`));
                    },
                    onerror: reject,
                    ontimeout: () => reject(new Error(`下载超时: ${url}`)),
                });
            });
        }

        async function updateRawDB() {
            console.log('MacDB: 正在从 IEEE 下载原始 MAC 数据库...');
            alert('开始下载 OUI 原始数据库，请稍候... (这可能需要 30-60 秒)');
            let totalData = {};

            try {
                const results = await Promise.all(OUI_SOURCES.map(src =>
                    download(src.url).then(text => ({ ...src, text }))
                ));

                for (const res of results) {
                    const partMap = parseIEEE(res.text);
                    Object.assign(totalData, partMap);
                }

                const db = {
                    timestamp: Date.now(),
                    data: totalData
                };

                GM_setValue(RAW_DB_KEY, JSON.stringify(db));
                console.log(`MacDB: 原始数据库更新完成！共 ${Object.keys(totalData).length} 条记录。`);
                alert(`原始数据库下载完成！共 ${Object.keys(totalData).length} 条记录。`);
                return totalData;

            } catch (e) {
                console.error('MacDB: 原始数据库更新失败:', e.message);
                alert(`原始数据库下载失败: ${e.message}`);
                throw e;
            }
        }

        // --- 2. AI 分析核心逻辑 (分块并发 + 实时保存 + 中断) ---

        /**
         * 原子性地读取、合并并保存 AI 分类数据库。
         * @param {Object} newResults - 新的分析结果对象，键为厂商名。
         * @returns {number} 合并后的总记录数。
         */
        function updateAiDB(newResults) {
            const aiStr = GM_getValue(AI_DB_KEY);
            const aiDB = aiStr ? JSON.parse(aiStr) : { timestamp: 0, data: {} };

            Object.assign(aiDB.data, newResults);
            aiDB.timestamp = Date.now();

            GM_setValue(AI_DB_KEY, JSON.stringify(aiDB));
            return Object.keys(aiDB.data).length;
        }

        function callAiAnalysis(promptContent, apiKey) {
            return new Promise((resolve, reject) => {
                const apiUrl = GM_getValue(AI_API_URL_KEY, 'https://api.openai.com/v1/chat/completions');
                const modelId = GM_getValue(AI_MODEL_ID_KEY, 'gpt-3.5-turbo');
                if (!apiUrl || !modelId) { return reject(new Error("API URL 或模型 ID 未设置，请检查配置。")); }

                const requestBody = {
                    model: modelId,
                    messages: [
                        { role: "system", content: promptContent.system },
                        { role: "user", content: promptContent.user }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.1
                };

                GM_xmlhttpRequest({
                    method: "POST",
                    url: apiUrl,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    data: JSON.stringify(requestBody),
                    timeout: 90000,
                    onload: (res) => {
                        try {
                            const json = JSON.parse(res.responseText);
                            if (json.error) {
                                return reject(new Error(`AI API 错误: ${json.error.message}`));
                            }
                            const textContent = json.choices?.[0]?.message?.content;
                            if (textContent) {
                                const result = JSON.parse(textContent);
                                resolve(result);
                            } else {
                                reject(new Error("AI 响应格式错误或内容为空。"));
                            }
                        } catch (e) {
                            reject(new Error(`AI 响应解析失败: ${e.message}\n原始响应: ${res.responseText.substring(0, 300)}`));
                        }
                    },
                    onerror: reject,
                    ontimeout: () => reject(new Error("AI 调用超时。")),
                });
            });
        }

/**
         * 执行分块并发 AI 分析（支持增量更新，自动跳过已分析厂商）
         */
        async function runAiAnalysis(updateStatusCallback, checkAbort) {
            const apiKey = getApiKey();
            if (!apiKey) {
                throw new Error("API Key (Bearer Token) 未设置。");
            }

            const concurrency = Math.max(1, parseInt(GM_getValue(AI_CONCURRENCY_KEY, 3)) || 3);

            // 获取 Prompt 模板和“所有”原始厂商列表
            const { system, uniqueVendors: allVendors } = getAiPromptParts();

            if (allVendors.length === 0) {
                throw new Error("OUI 原始数据库中未找到任何厂商名称，请先更新 OUI 原始库。");
            }

            // ==================== 【新增逻辑开始】 ====================
            // 读取本地已有的 AI 数据
            const aiStr = GM_getValue(AI_DB_KEY);
            const existingAiData = aiStr ? JSON.parse(aiStr).data : {};

            // 过滤：只保留 AI 库中不存在的厂商 (待处理列表)
            const pendingVendors = allVendors.filter(vendor => !existingAiData[vendor]);

            const totalRaw = allVendors.length;
            const skippedCount = totalRaw - pendingVendors.length;

            console.log(`MacDB: 增量分析检查 - 总数: ${totalRaw}, 已存在: ${skippedCount}, 待分析: ${pendingVendors.length}`);

            // 如果所有厂商都已分析过
            if (pendingVendors.length === 0) {
                const currentCount = Object.keys(existingAiData).length;
                updateStatusCallback(0, 0, currentCount, "无需更新");
                alert(`太棒了！所有 ${totalRaw} 个厂商均已完成分析，无需重复执行。`);
                return currentCount;
            }

            // 只有当有新任务时，才提示用户
            if (skippedCount > 0) {
                // 这里的日志会在控制台显示，UI上虽然不能直接弹窗（会阻断），但用户会在进度条看到任务变少了
                console.log(`已跳过 ${skippedCount} 个已分析的厂商，仅处理剩下的 ${pendingVendors.length} 个。`);
            }
            // ==================== 【新增逻辑结束】 ====================

            // --- 1. Chunking Logic (使用 pendingVendors 进行分块) ---
            const CHUNK_SIZE = 20;
            let chunks = [];
            // 注意：这里循环的是 pendingVendors，不是 allVendors
            for (let i = 0; i < pendingVendors.length; i += CHUNK_SIZE) {
                chunks.push(pendingVendors.slice(i, i + CHUNK_SIZE));
            }

            console.log(`MacDB: 实际执行任务块 ${chunks.length} 个 (并发: ${concurrency})`);

            let executedTasks = 0;
            let activeTasks = 0;
            let taskIndex = 0;

            const executeTask = async (chunkIndex, chunk) => {
                if (checkAbort()) {
                    console.log(`[任务 ${chunkIndex + 1}] 已放弃（用户中断）`);
                    return;
                }

                const userPrompt = `请分析以下厂商名称列表（任务 ${chunkIndex + 1} / ${chunks.length}）：${chunk.join(', ')}`;

                try {
                    const result = await callAiAnalysis({ system, user: userPrompt }, apiKey);

                    if (checkAbort()) return;

                    const totalCount = updateAiDB(result);
                    executedTasks++;
                    updateStatusCallback(executedTasks, chunks.length, totalCount, null);

                    const logArea = document.getElementById('analysis-log');
                    if (logArea) {
                        // 优化日志显示：显示具体的增量进度
                        logArea.value += `\n\n[增量任务 ${chunkIndex + 1}/${chunks.length}] 成功存入 ${Object.keys(result).length} 条:\n${JSON.stringify(result, null, 2)}`;
                        logArea.scrollTop = logArea.scrollHeight;
                    }
                } catch (e) {
                    executedTasks++;
                    updateStatusCallback(executedTasks, chunks.length, null, e.message);
                    console.error(`[任务 ${chunkIndex + 1} 失败]`, e.message);

                    const logArea = document.getElementById('analysis-log');
                    if (logArea) {
                        logArea.value += `\n\n[增量任务 ${chunkIndex + 1}/${chunks.length}] 失败: ${e.message}`;
                        logArea.scrollTop = logArea.scrollHeight;
                    }
                } finally {
                    activeTasks--;
                }
            };

            // --- 2. 调度器 (保持不变) ---
            const scheduler = async () => {
                while (taskIndex < chunks.length) {
                    if (checkAbort()) break;
                    while (activeTasks < concurrency && taskIndex < chunks.length) {
                        const idx = taskIndex++;
                        const chunk = chunks[idx];
                        activeTasks++;
                        executeTask(idx, chunk).finally(() => {
                            if (!checkAbort() && taskIndex < chunks.length) {
                                scheduler();
                            }
                        });
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            };

            await scheduler();

            while (activeTasks > 0) {
                if (checkAbort()) break;
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // --- 3. 结果和通知 ---
            // 注意：这里重新读取一次最终总数
            const finalCount = Object.keys(JSON.parse(GM_getValue(AI_DB_KEY, '{}')).data || {}).length;

            if (checkAbort()) {
                updateStatusCallback(executedTasks, chunks.length, finalCount, "任务已中断");
                alert(`任务已中断。本次会话共处理了 ${executedTasks} 个新任务块。`);
            } else if (executedTasks > 0 && finalCount === Object.keys(existingAiData).length) {
                // 这种情况比较少见：执行了任务但总数没变（可能是API返回空或全失败）
                throw new Error("所有新任务看似已执行，但数据库记录数未增加，请检查 API 日志。");
            } else {
                updateStatusCallback(executedTasks, chunks.length, finalCount, null);
                alert(`增量分析完成！\n- 跳过已有：${skippedCount} 条\n- 新增分析：${pendingVendors.length} 条\n- 当前库总计：${finalCount} 条`);
            }

            return finalCount;
        }

        // --- 3. 数据库操作接口 (保持一致) ---
        // ... (exportRawDB, importAiDB, getAiPromptParts, lookup functions remain the same)

        function exportRawDB() {
            const rawStr = GM_getValue(RAW_DB_KEY);
            if (!rawStr) {
                alert("OUI 原始数据库缺失，请先点击更新 OUI 库。");
                return;
            }
            const rawDB = JSON.parse(rawStr);
            const content = JSON.stringify(rawDB.data, null, 2);
            downloadFile(content, `oui_raw_db_${new Date(rawDB.timestamp).getTime()}.json`, 'application/json');
        }

        async function importAiDB(file) {
             return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const text = e.target.result;
                        let data;
                        try {
                            data = JSON.parse(text);
                        } catch (jsonError) {
                            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
                            if (jsonMatch && jsonMatch[1]) {
                                data = JSON.parse(jsonMatch[1]);
                            } else {
                                throw new Error("文件内容无法解析为有效的 JSON 格式。");
                            }
                        }

                        let validCount = 0;
                        for (const key in data) {
                            if (data[key] && typeof data[key] === 'object' && data[key].category && data[key].description_cn) {
                                validCount++;
                            }
                        }

                        if (validCount === 0) {
                            throw new Error("解析成功但未找到符合预期的厂商分类结构，请检查格式是否为 {'厂商名称': {'category': '...', 'description_cn': '...'}}");
                        }

                        const aiDB = {
                            timestamp: Date.now(),
                            data: data
                        };
                        GM_setValue(AI_DB_KEY, JSON.stringify(aiDB));
                        resolve(validCount);
                    } catch (e) {
                        reject(e);
                    }
                };
                reader.onerror = reject;
                reader.readAsText(file);
            });
        }

        function getAiPromptParts() {
            const rawStr = GM_getValue(RAW_DB_KEY);
            const rawDB = rawStr ? JSON.parse(rawStr).data : {};
            const allVendors = Object.values(rawDB);
            const uniqueVendors = Array.from(new Set(allVendors));

            const systemPrompt = `你是一个专业的网络设备厂商分类专家。请根据以下提供的原始 MAC 地址 OUI 厂商名称列表，对每个厂商进行精确的行业分类，并提供简短的中文描述。

分类标签（category）必须严格从以下枚举中选择：MOBILE/PC/IOT/NETWORK/VM/OTHER。

请严格以 JSON 格式返回结果，不包含任何额外说明或Markdown包裹。
JSON 结构必须是：
{
    "厂商名称": {
        "category": "分类标签 (MOBILE/PC/IOT/NETWORK/VM/OTHER)",
        "description_cn": "简短的中文描述"
    }
}`;

            return {
                system: systemPrompt,
                uniqueVendors: uniqueVendors,
                totalVendors: Object.keys(rawDB).length
            };
        }

        function lookup(mac) {
            const cleanMac = mac.replace(/[:\-\.]/g, '').toUpperCase();
            if (cleanMac.length < 6) return { vendor: '未知厂商', aiCategory: null };

            const rawStr = GM_getValue(RAW_DB_KEY);
            if (!rawStr) return { vendor: '未知厂商 (OUI库缺失)', aiCategory: null };

            const rawDB = JSON.parse(rawStr).data;
            const aiStr = GM_getValue(AI_DB_KEY);
            const aiDB = aiStr ? JSON.parse(aiStr).data : {};

            let vendorName = null;

            const prefixes = [
                cleanMac.substring(0, 9),
                cleanMac.substring(0, 7),
                cleanMac.substring(0, 6)
            ];

            for (const prefix of prefixes) {
                if (rawDB[prefix]) {
                    vendorName = rawDB[prefix];
                    break;
                }
            }

            if (!vendorName) return { vendor: '未知厂商 (DB)', aiCategory: null };

            const aiEnabled = GM_getValue(AI_FEATURE_ENABLED_KEY, false);
            const aiResult = aiEnabled ? aiDB[vendorName] : null;

            return {
                vendor: vendorName + ' (DB)',
                aiCategory: aiResult
            };
        }

        async function init() {
            // 保持空白，只在用户手动点击时启动分析
        }

        init();

        return { lookup, updateRawDB, runAiAnalysis, exportRawDB, importAiDB, getAiPromptParts };
    })();

    // ==================== C. 设备分类配置与逻辑 (保持一致) ====================
    // ... (CATEGORY_MAP, MANUAL_KEYWORDS, getCategory, identifyDevice functions remain the same)

    const CATEGORY_MAP = {
        'MOBILE': { label: '手机/平板', color: '#10b981', sort: 30 },
        'PC': { label: '个人电脑', color: '#0ea5e9', sort: 20 },
        'NETWORK': { label: '网络设备', color: '#f59e0b', sort: 40 },
        'IOT': { label: '智能家居', color: '#f97316', sort: 50 },
        'VM': { label: '虚拟机', color: '#8b5cf6', sort: 10 },
        'REPO': { label: '仓库/服务器', color: '#06b6d4', sort: 60 },
        'OTHER': { label: '其他', color: '#9ca3af', sort: 99 }
    };

    const MANUAL_KEYWORDS = {
        'VM': /VMWARE|VIRTUALBOX|XENSOURCE|HYPER-V|MICROSOFT CORP/,
        'PC': /^(YM-|YM|YMAE|YMGOODS)|WIN-|DESKTOP-|PC-|LAPTOP-|MINIP/
    };

    function getCategory(type) {
        return CATEGORY_MAP[type] || CATEGORY_MAP['OTHER'];
    }

    function identifyDevice(item) {
        const name = (item.name || '').toUpperCase();
        const vendor = (item.vendor || '').toUpperCase().replace(' (DB)', '');
        const { aiCategory } = MacDB.lookup(item.mac);

        if (aiCategory && CATEGORY_MAP[aiCategory.category]) {
            const type = aiCategory.category;
            const category = getCategory(type);
            return {
                type: type,
                label: category.label,
                color: category.color,
                sort: category.sort,
                aiDescription: aiCategory.description_cn
            };
        }

        for (const [type, regex] of Object.entries(MANUAL_KEYWORDS)) {
            if (regex.test(vendor) || regex.test(name)) {
                return { type: type, ...getCategory(type), aiDescription: null };
            }
        }

        if (name.startsWith('CK')) return { type: 'REPO', ...getCategory('REPO'), aiDescription: null };
        if (/IPHONE|ANDROID|OPPO|VIVO|HUAWEI|XIAOMI|REDMI|MI|SAMSUNG|IPAD|TABLET|WATCH/.test(name))
            return { type: 'MOBILE', ...getCategory('MOBILE'), aiDescription: null };
        if (/CAM|PLUG|LIGHT|BOX|TV|MIOT|TUYA|ESP|ROUTER|AP|PRINTER|NAS/.test(name))
            return { type: 'IOT', ...getCategory('IOT'), aiDescription: null };

        return { type: 'OTHER', ...getCategory('OTHER'), aiDescription: null };
    }

    // ==================== D. 样式和 UI 渲染 (新增进度条样式) ====================

    const fix = document.createElement('style');
    fix.textContent = `html, body, #doc, #bd, .inner, .mod-set-nav { overflow: visible !important; height: auto !important; }`;
    document.head.appendChild(fix);

    const style = document.createElement('style');
    style.textContent = `
        /* --- 流量监控：列表内样式优化 --- */
        .device-speed { float: right; }
        .up-speed, .down-speed {
            display: inline-flex; align-items: center; justify-content: center;
            width: 90px; height: 20px;
            margin-left: 6px; padding-left: 0;
            border: 1px solid; border-radius: 4px;
            font-size: 11px; font-family: 'Menlo', 'Monaco', monospace; font-weight: bold;
            position: relative; overflow: hidden; background: #fff;
        }
        .up-speed { color: #f97316; border-color: #ffedd5; }
        .down-speed { color: #0ea5e9; border-color: #e0f2fe; }

        .up-speed:before, .down-speed:before {
            content: ''; position: absolute; left: 0; top: 0; bottom: 0;
            opacity: 0.2; width: var(--percentage); z-index: 0; transition: width 0.3s;
        }
        .up-speed:before { background-color: #f97316; }
        .down-speed:before { background-color: #0ea5e9; }

        .up-speed span, .down-speed span { position: relative; z-index: 1; display:flex; align-items:center; gap:2px;}
        .up-speed i, .down-speed i { font-style: normal; font-size: 9px; opacity: 0.7; }

        /* --- 流量监控：全局精美悬浮窗 --- */
        .traffic-float-window {
            position: fixed; bottom: 100px; left: 20px; width: 200px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.6);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border-radius: 12px; padding: 14px;
            z-index: 9998; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            user-select: none;
        }
        .traffic-float-window:hover {
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .traffic-float-header {
            display: flex; justify-content: space-between; align-items: center;
            padding-bottom: 8px; margin-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.05);
            cursor: pointer;
        }
        .traffic-float-title { font-size: 13px; color: #4b5563; font-weight: 700; display: flex; align-items: center; gap: 6px; }
        .traffic-float-title:before { content:''; display:block; width:6px; height:6px; background:#10b981; border-radius:50%; }
        .traffic-float-controls { display: flex; gap: 8px; }
        .traffic-float-btn { cursor: pointer; color: #9ca3af; font-size: 14px; transition: color 0.2s; line-height: 1; }
        .traffic-float-btn:hover { color: #4b5563; }

        .traffic-overview { display: flex; flex-direction: column; gap: 6px; cursor: pointer;}
        .traffic-row { display: flex; justify-content: space-between; align-items: baseline; }
        .traffic-label { font-size: 12px; color: #6b7280; }
        .traffic-val { font-size: 15px; font-weight: 700; font-family: 'Menlo', monospace; letter-spacing: -0.5px; }
        .traffic-val.down { color: #0ea5e9; }
        .traffic-val.up { color: #f97316; }

        /* 展开的详细列表 */
        .traffic-details {
            max-height: 0; overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
            opacity: 0; margin-top: 0;
        }
        .traffic-float-window.expanded .traffic-details {
            max-height: 300px; opacity: 1; margin-top: 10px;
            overflow-y: auto; padding-right: 2px;
        }
        /* 自定义滚动条 */
        .traffic-details::-webkit-scrollbar { width: 4px; }
        .traffic-details::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
        .traffic-details::-webkit-scrollbar-track { background: transparent; }

        .traffic-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 6px 0; border-bottom: 1px dashed rgba(0,0,0,0.05);
            font-size: 11px;
        }
        .traffic-item:last-child { border-bottom: none; }
        .traffic-item-name { width: 80px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #374151; font-weight: 500; }
        .traffic-item-speed { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
        .t-down { color: #0ea5e9; }
        .t-up { color: #f97316; opacity: 0.8; font-size: 10px; }

        /* 最小化状态 */
        .traffic-float-window.minimized {
            width: 48px; height: 48px; padding: 0; border-radius: 50%;
            background: #ffffff; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .traffic-float-window.minimized .traffic-content { display: none; }
        .traffic-float-window.minimized:after { content: '⚡'; font-size: 24px; color: #0ea5e9; }

        .static-ip-fab {
            position: fixed; right: 20px; bottom: 20px; z-index: 9999;
            font-family: system-ui, -apple-system, sans-serif; display:flex; flex-direction:column; align-items:flex-end;
        }
        .static-ip-btn, .static-ip-fab-btn-settings {
            display: flex; align-items: center; justify-content: center;
            height: 48px; margin-top: 12px; border-radius: 24px;
            font-size: 15px; font-weight: 600; color: white; cursor: pointer;
            box-shadow: 0 0 12px rgba(0,0,0,0.1); transition: transform 0.2s; user-select: none;
        }
        .static-ip-fab-btn-settings {
            background: #4b5563;
            width: 48px;
            border-radius: 50%;
            font-size: 20px;
        }
        .static-ip-fab-btn-settings:active { transform: scale(0.95); }
        .static-ip-btn { width: 120px; }
        .static-ip-btn:active { transform: scale(0.95); }
        .static-ip-add { background: linear-gradient(135deg, #ff9500, #ff5e00); }
        .static-ip-list { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .static-ip-del { background: linear-gradient(135deg, #ff4d4f, #f5222d); }

        .static-ip-modal {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6); z-index: 2000;
            display: none; align-items: center; justify-content: center;
        }
        .static-ip-panel {
            width: 90%; max-width: 650px; height: 85vh; background: #fff;
            border-radius: 12px; display: flex; flex-direction: column; overflow: hidden;
            box-shadow: 0 12px 48px rgba(0,0,0,0.2); animation: popIn 0.2s ease-out;
        }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        .static-ip-header { padding: 16px 24px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
        .static-ip-title { font-size: 18px; font-weight: 700; color: #111827; }
        .static-ip-close { font-size: 28px; color: #9ca3af; cursor: pointer; line-height: 1; }

        /* Settings Panel specific styles */
        .settings-panel-body { flex: 1; overflow-y: auto; padding: 24px; background: #fff; }
        .settings-content-group { margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .settings-content-group h4 { margin-top: 0; margin-bottom: 12px; font-size: 16px; color: #1f2937; font-weight: 600; }
        .settings-content-group input[type="text"], .settings-content-group textarea {
            width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;
            box-sizing: border-box; font-family: monospace;
        }
        .settings-content-group input[type="number"] {
             width: 80px; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;
        }
        .settings-content-group label { display: flex; align-items: center; font-size: 14px; margin-bottom: 8px; cursor: pointer; }
        .settings-content-group input[type="checkbox"] { margin-right: 10px; accent-color: #ff6600; }
        .settings-content-group button {
            background: #f97316; color: white; padding: 10px 15px; border: none; border-radius: 4px;
            cursor: pointer; font-size: 14px; margin-top: 10px; font-weight: 600;
        }
        .settings-content-group button:disabled { background: #9ca3af; cursor: not-allowed; }
        .settings-status-indicator { margin-top: 10px; font-size: 12px; color: #6b7280; }

        /* Progress Bar Styles */
        .analysis-progress-container {
            width: 100%; height: 20px; background: #e5e7eb; border-radius: 4px; overflow: hidden; margin-top: 10px;
        }
        .analysis-progress-bar {
            height: 100%; width: 0%; background: #22c55e; transition: width 0.3s;
            display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;
        }
        .btn-stop { background: #ef4444 !important; } /* 中断按钮颜色 */

        /* 新增日志框样式 */
        #analysis-log {
            width: 100%; height: 150px; margin-top: 10px; padding: 10px; border: 1px solid #d1d5db;
            border-radius: 4px; font-family: monospace; font-size: 12px; overflow-y: auto; background: #f9fafb;
            white-space: pre-wrap; word-wrap: break-word;
        }

        /* List styles (remaining styles are unchanged) */
        .static-ip-body { flex: 1; overflow-y: auto; background: #fff; }
        .static-ip-group-header {
            padding: 12px 24px; background: #f3f4f6; color: #4b5563; font-size: 13px; font-weight: 600;
            border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 10;
            display: flex; justify-content: space-between;
        }
        .device-list-container { background: #fff; }
        .static-ip-item { display: flex; align-items: center; padding: 12px 24px; border-bottom: 1px solid #f3f4f6; cursor: pointer; background: #fff; border: 1px solid transparent; transition: all 0.2s ease; }
        .static-ip-item:hover { background: #fff; border: 1px solid #d1d5db; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .static-ip-item:has(input:checked) { background: #fff; border: 1px solid #8b5cf6; box-shadow: 0 1px 3px rgba(139,92,246,0.1); }
        .static-ip-panel.static-ip-list .static-ip-item:has(input:checked) { background: #fff; border: 1px solid #ef4444; box-shadow: 0 1px 3px rgba(239,68,68,0.1); }
        .static-ip-checkbox { width: 20px; height: 20px; margin-right: 16px; flex-shrink: 0; accent-color: #ff6600; cursor: pointer; }

        .item-content { flex: 1; min-width: 0; }
        .item-header { display: flex; align-items: center; margin-bottom: 4px; gap: 8px; }
        .item-name { font-size: 15px; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-tag { font-size: 11px; padding: 1px 6px; border-radius: 4px; color: #fff; font-weight: normal; flex-shrink: 0; }
        .item-vendor { font-size: 12px; color: #6b7280; background: #f3f4f6; padding: 1px 6px; border-radius: 4px; }

        .item-details { display: flex; gap: 12px; font-family: Menlo, Monaco, monospace; font-size: 13px; color: #6b7280; }
        .item-ip { color: #ea580c; background: #ffedd5; padding: 0 4px; border-radius: 2px; }
        .item-ai-desc { font-size: 12px; color: #4b5563; margin-left: auto; font-family: system-ui; font-style: italic; max-width: 40%; text-align: right;}
        .item-note { font-size: 12px; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 4px; font-family: system-ui; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .item-note:empty { display: none; }
        .edit-note-btn { cursor: pointer; color: #6b7280; font-size: 16px; margin-left: 8px; transition: color 0.2s; flex-shrink: 0; }
        .edit-note-btn:hover { color: #059669; }

        .static-ip-footer { padding: 16px 24px; border-top: 1px solid #e5e7eb; background: #fff; display: flex; justify-content: space-between; align-items: center; }
        .action-btn { padding: 10px 28px; border-radius: 24px; border: none; color: #fff; font-weight: 600; cursor: pointer; font-size: 14px; }
        .btn-add { background: #f97316; }
        .btn-del { background: #ef4444; }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #9ca3af; }
        .static-ip-textarea { display: block; width: calc(100% - 48px); margin: 16px 24px; height: 100px; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-family: monospace; }
        .loading-tip { text-align: center; padding: 60px 0; color: #9ca3af; background: #fff; }

        /* 备注编辑弹窗 */
        .note-edit-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: none; align-items: center; justify-content: center; }
        .note-edit-panel { background: #fff; border-radius: 12px; padding: 24px; width: 90%; max-width: 450px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .note-edit-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px; }
        .note-edit-device { font-size: 13px; color: #6b7280; margin-bottom: 12px; padding: 8px 12px; background: #f3f4f6; border-radius: 6px; }
        .note-edit-input { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; box-sizing: border-box; resize: vertical; min-height: 80px; font-family: system-ui; }
        .note-edit-input:focus { outline: none; border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1); }
        .note-edit-footer { display: flex; gap: 12px; margin-top: 16px; justify-content: flex-end; }
        .note-btn { padding: 8px 20px; border-radius: 6px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .note-btn-save { background: #059669; color: white; }
        .note-btn-save:hover { background: #047857; }
        .note-btn-cancel { background: #e5e7eb; color: #374151; }
        .note-btn-cancel:hover { background: #d1d5db; }
        .note-btn-delete { background: #ef4444; color: white; }
        .note-btn-delete:hover { background: #dc2626; }
    `;
    document.head.appendChild(style);

    // ==================== E. 渲染与提交逻辑 ====================

    function processList(rawList) {
        return rawList.map(item => {
            const processed = {
                mac: item.mac.toUpperCase(),
                ip: item.ip,
                name: item.name || item.origin_name || '未知设备'
            };

            const lookupResult = MacDB.lookup(processed.mac);
            processed.vendor = lookupResult.vendor;
            processed.note = DeviceNotes.get(processed.mac); // 获取备注

            const category = identifyDevice({ ...processed, aiCategory: lookupResult.aiCategory });

            return { ...processed, ...category };
        }).sort((a, b) => (a.sort - b.sort) || a.name.localeCompare(b.name));
    }

    // --- 1. 设备管理 Modal (添加 - 保持一致) ---
    function renderAddModal() {
        const modal = document.createElement('div');
        modal.className = 'static-ip-modal';
        modal.innerHTML = `
            <div class="static-ip-panel static-ip-add">
                <div class="static-ip-header">
                    <div class="static-ip-title">添加静态IP绑定</div>
                    <div class="static-ip-close">×</div>
                </div>
                <div class="static-ip-body">
                    <div class="static-ip-group-header">
                        <span>未绑定设备</span>
                        <span id="status-add" style="font-weight:normal;font-size:12px">读取中...</span>
                    </div>
                    <div class="device-list-container" id="list-add"></div>
                    <textarea class="static-ip-textarea" id="textarea-add" placeholder="手动输入（每行一个）：MAC IP 备注\n例如: 00:1A:2B:3C:4D:5E 192.168.31.200 我的电脑"></textarea>
                </div>
                <div class="static-ip-footer">
                    <label style="cursor:pointer;display:flex;align-items:center;font-size:14px">
                        <input type="checkbox" id="select-all-add" style="margin-right:8px"> 全选
                    </label>
                    <button class="action-btn btn-add" id="submit-add">确认添加</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const ui = {
            modal, list: modal.querySelector('#list-add'), status: modal.querySelector('#status-add'),
            close: modal.querySelector('.static-ip-close'), submit: modal.querySelector('#submit-add'),
            selectAll: modal.querySelector('#select-all-add'), textarea: modal.querySelector('#textarea-add')
        };

        ui.close.onclick = () => modal.style.display = 'none';
        modal.onclick = e => { if(e.target === modal) modal.style.display = 'none'; };

        const renderItem = (item) => {
            const vendorHtml = `<span class="item-vendor">${item.vendor}</span>`;
            const aiDescHtml = item.aiDescription ? `<span class="item-ai-desc">${item.aiDescription}</span>` : '';
            return `
                <label class="static-ip-item">
                    <input type="checkbox" class="static-ip-checkbox" value='${JSON.stringify({mac:item.mac, ip:item.ip, name:item.name})}'>
                    <div class="item-content">
                        <div class="item-header">
                            <span class="item-name">${item.name}</span>
                            <span class="item-tag" style="background:${item.color}">${item.label}</span>
                        </div>
                        <div class="item-details">
                            <span class="item-mac">${item.mac}</span>
                            <span>→</span>
                            <span class="item-ip">${item.ip}</span>
                            ${vendorHtml}
                            ${aiDescHtml}
                        </div>
                    </div>
                </label>
            `;
        };

        ui.load = async () => {
            ui.list.innerHTML = '<div class="loading-tip">加载数据中...</div>';
            try {
                const r = await fetch(`/cgi-bin/luci/;stok=${getToken()}/api/xqnetwork/macbind_info`);
                const data = await r.json();
                let items = (data.devicelist || []).filter(d => d.tag !== 2);
                items = processList(items);
                ui.status.innerText = `共 ${items.length} 台`;
                ui.list.innerHTML = items.length ? items.map(renderItem).join('') : '<div class="loading-tip">无数据</div>';
            } catch(e) {
                ui.list.innerHTML = '<div class="loading-tip">数据加载失败</div>';
            }
            ui.selectAll.checked = false;
            ui.selectAll.onchange = () => {
                ui.list.querySelectorAll('.static-ip-checkbox').forEach(cb => cb.checked = ui.selectAll.checked);
            };
        };

        ui.submit.onclick = async () => {
            const checked = [...ui.list.querySelectorAll('.static-ip-checkbox:checked')].map(c => JSON.parse(c.value));
            let items = checked;
            if (ui.textarea && ui.textarea.value.trim()) {
                const manual = ui.textarea.value.split('\n').map(l => {
                    const parts = l.trim().split(/\s+/);
                    if (parts.length < 2) return null;
                    const mac = parts[0].match(/([0-9A-F]{2}[:-]){5}([0-9A-F]{2})/i)?.[0];
                    const ip = parts[1].match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)?.[0];
                    const name = parts.slice(2).join(' ') || '手动添加';
                    return (mac && ip) ? {mac: mac.toUpperCase(), ip: ip, name: name} : null;
                }).filter(Boolean);
                items = [...items, ...manual];
            }
            if (!items.length) return alert('请至少选择或输入一项');
            ui.submit.disabled = true; ui.submit.innerText = '执行中...';
            const stok = getToken();
            for (const item of items) {
                await fetch(`/cgi-bin/luci/;stok=${stok}/api/xqnetwork/mac_bind`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: `data=${encodeURIComponent(JSON.stringify([item]))}`
                }).catch(e => console.error(`API 错误 for ${item.mac}:`, e));
            }
            alert('操作完成！页面即将刷新');
            location.reload();
        };
        return ui;
    }

    // --- 2. 绑定列表 Modal (查看/编辑备注/批量删除) ---
    function renderBindListModal() {
        const modal = document.createElement('div');
        modal.className = 'static-ip-modal';
        modal.innerHTML = `
            <div class="static-ip-panel static-ip-list">
                <div class="static-ip-header">
                    <div class="static-ip-title">📋 已绑定设备列表</div>
                    <div class="static-ip-close">×</div>
                </div>
                <div class="static-ip-body">
                    <div class="static-ip-group-header">
                        <span>已绑定设备</span>
                        <span id="status-list" style="font-weight:normal;font-size:12px">读取中...</span>
                    </div>
                    <div class="device-list-container" id="list-bound"></div>
                </div>
                <div class="static-ip-footer">
                    <label style="cursor:pointer;display:flex;align-items:center;font-size:14px">
                        <input type="checkbox" id="select-all-list" style="margin-right:8px"> 全选
                    </label>
                    <button class="action-btn btn-del" id="submit-del-list">删除所选</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const ui = {
            modal,
            list: modal.querySelector('#list-bound'),
            status: modal.querySelector('#status-list'),
            close: modal.querySelector('.static-ip-close'),
            selectAll: modal.querySelector('#select-all-list'),
            submit: modal.querySelector('#submit-del-list')
        };

        ui.close.onclick = () => modal.style.display = 'none';
        modal.onclick = e => { if(e.target === modal) modal.style.display = 'none'; };

        const renderItem = (item) => {
            const vendorHtml = `<span class="item-vendor">${item.vendor}</span>`;
            const aiDescHtml = item.aiDescription ? `<span class="item-ai-desc">${item.aiDescription}</span>` : '';
            const noteHtml = item.note ? `<span class="item-note" title="${item.note}">${item.note}</span>` : '';
            return `
                <label class="static-ip-item">
                    <input type="checkbox" class="static-ip-checkbox" value='${JSON.stringify({mac:item.mac, ip:item.ip, name:item.name})}'>
                    <div class="item-content">
                        <div class="item-header">
                            <span class="item-name">${item.name}</span>
                            <span class="item-tag" style="background:${item.color}">${item.label}</span>
                            ${noteHtml}
                            <span class="edit-note-btn" data-mac="${item.mac}" data-name="${item.name}" data-ip="${item.ip}" title="编辑备注">📝</span>
                        </div>
                        <div class="item-details">
                            <span class="item-mac">${item.mac}</span>
                            <span>→</span>
                            <span class="item-ip">${item.ip}</span>
                            ${vendorHtml}
                            ${aiDescHtml}
                        </div>
                    </div>
                </label>
            `;
        };

        ui.load = async () => {
            ui.list.innerHTML = '<div class="loading-tip">加载数据中...</div>';
            try {
                const r = await fetch(`/cgi-bin/luci/;stok=${getToken()}/api/xqnetwork/macbind_info`);
                const data = await r.json();
                let items = data.list || [];
                items = processList(items);
                ui.status.innerText = `共 ${items.length} 台`;
                ui.list.innerHTML = items.length ? items.map(renderItem).join('') : '<div class="loading-tip">无绑定设备</div>';

                // 绑定编辑备注按钮事件
                ui.list.querySelectorAll('.edit-note-btn').forEach(btn => {
                    btn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const mac = btn.dataset.mac;
                        const name = btn.dataset.name;
                        const ip = btn.dataset.ip;
                        showNoteEditModal(mac, name, ip, () => ui.load());
                    };
                });
            } catch(e) {
                ui.list.innerHTML = '<div class="loading-tip">数据加载失败</div>';
            }

            ui.selectAll.checked = false;
            ui.selectAll.onchange = () => {
                ui.list.querySelectorAll('.static-ip-checkbox').forEach(cb => cb.checked = ui.selectAll.checked);
            };
        };

        // 批量删除功能
        ui.submit.onclick = async () => {
            const checked = [...ui.list.querySelectorAll('.static-ip-checkbox:checked')].map(c => JSON.parse(c.value));
            if (!checked.length) return alert('请至少选择一项');
            if (!confirm(`确定要删除 ${checked.length} 个设备的静态IP绑定吗？`)) return;

            ui.submit.disabled = true;
            ui.submit.innerText = '删除中...';
            const stok = getToken();

            for (const item of checked) {
                await fetch(`/cgi-bin/luci/;stok=${stok}/api/xqnetwork/mac_unbind`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: `mac=${item.mac}`
                }).catch(e => console.error(`删除错误 for ${item.mac}:`, e));
            }

            alert('操作完成！页面即将刷新');
            location.reload();
        };

        return ui;
    }

    // 备注编辑弹窗
    function showNoteEditModal(mac, deviceName, deviceIp, onSaveCallback) {
        // 检查是否已存在弹窗，存在则删除
        const existingModal = document.getElementById('note-edit-modal');
        if (existingModal) existingModal.remove();

        const currentNote = DeviceNotes.get(mac);
        
        const modal = document.createElement('div');
        modal.id = 'note-edit-modal';
        modal.className = 'note-edit-modal';
        modal.innerHTML = `
            <div class="note-edit-panel">
                <div class="note-edit-title">📝 编辑设备备注</div>
                <div class="note-edit-device">
                    <div><strong>${deviceName}</strong></div>
                    <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">MAC: ${mac} | IP: ${deviceIp}</div>
                </div>
                <textarea class="note-edit-input" placeholder="输入备注信息..." maxlength="200">${currentNote}</textarea>
                <div class="note-edit-footer">
                    ${currentNote ? '<button class="note-btn note-btn-delete">删除备注</button>' : ''}
                    <button class="note-btn note-btn-cancel">取消</button>
                    <button class="note-btn note-btn-save">保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const input = modal.querySelector('.note-edit-input');
        const saveBtn = modal.querySelector('.note-btn-save');
        const cancelBtn = modal.querySelector('.note-btn-cancel');
        const deleteBtn = modal.querySelector('.note-btn-delete');

        // 显示弹窗并聚焦输入框
        modal.style.display = 'flex';
        setTimeout(() => input.focus(), 100);

        // 保存备注
        saveBtn.onclick = () => {
            const note = input.value.trim();
            if (note) {
                DeviceNotes.set(mac, note);
            } else {
                DeviceNotes.delete(mac);
            }
            modal.style.display = 'none';
            modal.remove();
            if (onSaveCallback) onSaveCallback();
        };

        // 取消
        cancelBtn.onclick = () => {
            modal.style.display = 'none';
            modal.remove();
        };

        // 删除备注
        if (deleteBtn) {
            deleteBtn.onclick = () => {
                if (confirm('确定删除此设备的备注吗？')) {
                    DeviceNotes.delete(mac);
                    modal.style.display = 'none';
                    modal.remove();
                    if (onSaveCallback) onSaveCallback();
                }
            };
        }

        // 点击背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                modal.remove();
            }
        };

        // ESC 键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }


    // --- 2. 设置 Modal (AI 配置) ---

    function renderSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'static-ip-modal';
        modal.id = 'settings-modal';
        modal.innerHTML = `
            <div class="static-ip-panel static-ip-settings">
                <div class="static-ip-header">
                    <div class="static-ip-title">⚙️ AI 厂商分类通用设置 (${GM_info.script.version})</div>
                    <div class="static-ip-close">×</div>
                </div>
                <div class="static-ip-body settings-panel-body">
                    <div class="settings-content-group">
                        <h4>AI 功能开关</h4>
                        <label>
                            <input type="checkbox" id="ai-enabled-toggle"> 启用 AI 厂商分类 (不启用则跳过所有 AI 调用)
                        </label>
                        <div class="settings-status-indicator">启用后，脚本将使用 AI 分析 OUI 厂商并进行更精确的中文分类。</div>
                    </div>

                    <div class="settings-content-group">
                        <h4>并发线程数</h4>
                        <input type="number" id="concurrency-input" min="1" max="10" placeholder="例如: 3" value="${GM_getValue(AI_CONCURRENCY_KEY, 3)}">
                        <div class="settings-status-indicator">同时向 AI 服务发送的请求数量（默认 3）。过高可能导致 API 速率限制。</div>
                    </div>

                    <div class="settings-content-group">
                        <h4>API Key (Bearer Token)</h4>
                        <input type="text" id="api-key-input" placeholder="输入您的 OpenAI/通用 API Key (通常以 sk- 或类似前缀开头)">
                        <div class="settings-status-indicator" id="key-status-indicator"></div>
                    </div>

                    <div class="settings-content-group">
                        <h4>OpenAI 兼容 API URL</h4>
                        <input type="text" id="api-url-input" placeholder="例如: https://api.openai.com/v1/chat/completions">
                        <div class="settings-status-indicator">必须是完整的 Chat Completions API 地址。</div>
                    </div>

                    <div class="settings-content-group">
                        <h4>模型 ID (Model ID)</h4>
                        <input type="text" id="model-id-input" placeholder="例如: gpt-3.5-turbo 或 llama-3-8b-chat">
                        <div class="settings-status-indicator">用于指定您要使用的 AI 模型。</div>
                    </div>

                    <div class="settings-content-group">
                        <h4>AI 分析提示词 (Prompt)</h4>
                        <textarea id="ai-prompt-display" rows="8" readonly style="resize:vertical; font-size:12px; height: 120px;"></textarea>
                        <button id="copy-prompt-btn" style="margin-top: 5px; background: #6366f1;">复制提示词到剪贴板</button>
                        <div class="settings-status-indicator" style="margin-top: 5px;">本提示词仅包含**系统指令**和**厂商样本**，您可以将其复制到外部 AI 工具中运行，然后将结果上传。</div>
                    </div>

                    <div class="settings-content-group">
                        <h4>数据库状态与操作</h4>
                        <div class="settings-status-indicator" id="db-raw-status"></div>
                        <div class="settings-status-indicator" id="db-ai-status"></div>

                        <div class="analysis-progress-container" id="analysis-progress-container" style="display:none;">
                            <div class="analysis-progress-bar" id="analysis-progress-bar">0%</div>
                        </div>

                        <div style="display:flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                            <button id="update-oui-btn" style="background: #3b82f6; flex-grow: 1;">立即检查并更新 OUI 原始库</button>
                            <button id="download-oui-btn" style="background: #0ea5e9; flex-grow: 1;">下载 OUI 原始库 (JSON)</button>
                        </div>

                        <button id="download-ai-db-btn" style="margin-top: 10px; width: 100%; background: #8b5cf6;">下载 AI 分类数据库 (JSON)</button>

                        <button id="run-ai-analysis-btn" style="margin-top: 10px; width: 100%;">保存配置并执行 AI 厂商分块并发分析</button>
                        <div class="settings-status-indicator">（此操作需要有效的 API 配置。分块并发执行，实时保存结果。）</div>

                        <!-- 新增临时日志框 -->
                        <textarea id="analysis-log" readonly placeholder="API 返回日志将显示在这里..."></textarea>
                    </div>

                    <div class="settings-content-group">
                        <h4>上传 AI 分类结果 (跳过分析)</h4>
                        <input type="file" id="ai-db-upload-input" accept=".json,.txt" style="margin-bottom: 10px; padding: 5px 0;">
                        <button id="upload-ai-db-btn" disabled style="background: #059669;">上传并应用</button>
                        <div class="settings-status-indicator">支持 JSON 或包含 JSON 代码块的 TXT 文件。上传后分类结果会立即生效。</div>
                    </div>

                </div>
                <div class="static-ip-footer">
                    <button class="action-btn" id="save-settings-btn" style="background:#0ea5e9">仅保存配置</button>
                    <button class="action-btn" style="background:#4b5563" onclick="document.getElementById('settings-modal').style.display='none'">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const ui = {
            modal, close: modal.querySelector('.static-ip-close'), saveBtn: modal.querySelector('#save-settings-btn'),
            apiKeyInput: modal.querySelector('#api-key-input'), aiToggle: modal.querySelector('#ai-enabled-toggle'),
            apiUrlInput: modal.querySelector('#api-url-input'), modelIdInput: modal.querySelector('#model-id-input'),
            concurrencyInput: modal.querySelector('#concurrency-input'),
            keyStatus: modal.querySelector('#key-status-indicator'), dbRawStatus: modal.querySelector('#db-raw-status'),
            dbAiStatus: modal.querySelector('#db-ai-status'), runAiBtn: modal.querySelector('#run-ai-analysis-btn'),
            aiPromptDisplay: modal.querySelector('#ai-prompt-display'), copyPromptBtn: modal.querySelector('#copy-prompt-btn'),
            downloadOuiBtn: modal.querySelector('#download-oui-btn'), updateOuiBtn: modal.querySelector('#update-oui-btn'),
            aiDbUploadInput: modal.querySelector('#ai-db-upload-input'), uploadAiDbBtn: modal.querySelector('#upload-ai-db-btn'),
            // NEW Progress Bar elements
            progressContainer: modal.querySelector('#analysis-progress-container'),
            progressBar: modal.querySelector('#analysis-progress-bar'),
            downloadAiDbBtn: modal.querySelector('#download-ai-db-btn')
        };

        // Function to refresh database status display
        const refreshStatus = () => {
            const currentKey = GM_getValue(AI_API_KEY_KEY, '');
            const currentUrl = GM_getValue(AI_API_URL_KEY, 'https://api.openai.com/v1/chat/completions');
            const currentModel = GM_getValue(AI_MODEL_ID_KEY, 'gpt-3.5-turbo');
            const currentConcurrency = GM_getValue(AI_CONCURRENCY_KEY, 3);
            const enabled = GM_getValue(AI_FEATURE_ENABLED_KEY, false);

            ui.apiKeyInput.value = currentKey;
            ui.apiUrlInput.value = currentUrl;
            ui.modelIdInput.value = currentModel;
            ui.aiToggle.checked = enabled;
            ui.concurrencyInput.value = currentConcurrency;

            const rawDB = JSON.parse(GM_getValue(RAW_DB_KEY, '{}'));
            const aiDB = JSON.parse(GM_getValue(AI_DB_KEY, '{}'));
            const rawCount = Object.keys(rawDB.data || {}).length;
            const aiCount = Object.keys(aiDB.data || {}).length;
            const modelText = currentModel || '（未设置）';

            ui.keyStatus.textContent = currentKey ? `当前 Key 已保存 (${currentKey.substring(0, 5)}...)` : 'Key 未设置。';
            ui.dbRawStatus.textContent = rawCount > 0 ? `OUI 原始库：${rawCount} 条记录 (${new Date(rawDB.timestamp).toLocaleDateString()})` : 'OUI 原始库：未下载/缺失。';
            ui.dbAiStatus.textContent = aiCount > 0 ? `AI 分类库：${aiCount} 条记录 (模型: ${modelText}, ${new Date(aiDB.timestamp).toLocaleDateString()})` : `AI 分类库：未分析 (模型: ${modelText})。`;

            // AI Prompt
            const promptContent = MacDB.getAiPromptParts();
            const sampleVendors = promptContent.uniqueVendors.slice(0, 300);
            const promptText = `--- System Prompt ---
${promptContent.system}

--- User Prompt (前 300 样本) ---
请分析以下厂商名称列表（总计 ${promptContent.uniqueVendors.length} 个唯一厂商）：
${sampleVendors.join(', ')}

(提示: 复制后，您可能需要手动分块以适应外部工具的上下文限制)`;
            ui.aiPromptDisplay.value = promptText;

            // Button states
            const canRunAi = currentKey && enabled && currentUrl && currentModel && rawCount > 0 && currentConcurrency > 0;
            ui.runAiBtn.disabled = !canRunAi;
            ui.downloadOuiBtn.disabled = rawCount === 0;

            const file = ui.aiDbUploadInput.files[0];
            ui.uploadAiDbBtn.disabled = !file;

            // Reset UI for progress bar
            ui.progressContainer.style.display = 'none';
            ui.runAiBtn.classList.remove('btn-stop');
            ui.runAiBtn.disabled = !canRunAi;
            ui.updateOuiBtn.disabled = false;
            ui.downloadOuiBtn.disabled = rawCount === 0;
            ui.saveBtn.disabled = false;

            ui.downloadAiDbBtn.disabled = aiCount === 0;
            ui.downloadAiDbBtn.textContent = aiCount > 0
                ? `下载 AI 分类数据库 (JSON) - ${aiCount} 条`
                : `下载 AI 分类数据库 (JSON) - 暂无数据`;
        };

        // Function to save all settings
        const saveSettings = () => {
            const newKey = ui.apiKeyInput.value.trim();
            const newUrl = ui.apiUrlInput.value.trim();
            const newModel = ui.modelIdInput.value.trim();
            const newEnabled = ui.aiToggle.checked;
            const newConcurrency = Math.max(1, Math.min(10, parseInt(ui.concurrencyInput.value.trim()) || 3));

            GM_setValue(AI_API_KEY_KEY, newKey);
            GM_setValue(AI_API_URL_KEY, newUrl);
            GM_setValue(AI_MODEL_ID_KEY, newModel);
            GM_setValue(AI_FEATURE_ENABLED_KEY, newEnabled);
            GM_setValue(AI_CONCURRENCY_KEY, newConcurrency);

            refreshStatus();
            return { newKey, newUrl, newModel, newEnabled, newConcurrency };
        };

        // --- Event Handlers ---

        ui.aiDbUploadInput.onchange = refreshStatus;

        ui.close.onclick = () => modal.style.display = 'none';
        ui.modal.onclick = e => { if(e.target === modal) modal.style.display = 'none'; };
        ui.saveBtn.onclick = () => { saveSettings(); alert('配置已保存！'); };
        ui.downloadOuiBtn.onclick = () => MacDB.exportRawDB();

        ui.copyPromptBtn.onclick = () => {
            navigator.clipboard.writeText(ui.aiPromptDisplay.value).then(() => {
                ui.copyPromptBtn.textContent = '已复制！';
                setTimeout(() => ui.copyPromptBtn.textContent = '复制提示词到剪贴板', 2000);
            }, () => {
                alert('复制失败，请手动选择复制文本框内容。');
            });
        };

        ui.updateOuiBtn.onclick = async () => {
            ui.updateOuiBtn.disabled = true;
            ui.updateOuiBtn.textContent = '下载中...';
            try {
                await MacDB.updateRawDB();
            } catch (e) {
                // error alert handled inside updateRawDB
            } finally {
                refreshStatus();
                ui.updateOuiBtn.textContent = '立即检查并更新 OUI 原始库';
                ui.updateOuiBtn.disabled = false;
            }
        };

        ui.runAiBtn.onclick = async () => {
            const originalText = ui.runAiBtn.textContent;
            saveSettings();

            if (ui.runAiBtn.disabled) {
                alert("无法执行分析：请检查 Key/API URL/Model ID/并发数 是否填写完整，以及 AI 功能是否启用！");
                return;
            }

            // 1. Setup UI for analysis (变为中断按钮)
            analysisAborted = false; // 重置中断标志
            ui.runAiBtn.disabled = false;
            ui.runAiBtn.classList.add('btn-stop');
            ui.runAiBtn.textContent = '❌ 中断任务';
            ui.progressContainer.style.display = 'block';
            ui.progressBar.style.width = '0%';
            ui.progressBar.textContent = '0%';

            // 新增：清空日志框
            const logArea = document.getElementById('analysis-log');
            if (logArea) logArea.value = '';

            // 禁用其他操作按钮
            ui.updateOuiBtn.disabled = true;
            ui.downloadOuiBtn.disabled = true;
            ui.uploadAiDbBtn.disabled = true;
            ui.saveBtn.disabled = true;

            // 中断逻辑：点击按钮设置中断标志
            const stopHandler = () => {
                analysisAborted = true;
                ui.runAiBtn.disabled = true;
                ui.runAiBtn.textContent = '正在等待任务中断...';
                ui.runAiBtn.removeEventListener('click', stopHandler);
            };
            ui.runAiBtn.addEventListener('click', stopHandler);

            // 2. Real-time status update function
            const updateStatus = (current, total, savedCount, errorMessage) => {
                 const percentage = Math.round((current / total) * 100);
                 const statusText = `(${current}/${total}) - 已保存 ${savedCount} 条`;

                 ui.progressBar.style.width = `${percentage}%`;
                 ui.progressBar.textContent = `${percentage}% ${statusText}`;

                 if (errorMessage === "任务已中断") {
                    ui.dbAiStatus.textContent = `AI 分类库：已中断。已保存 ${savedCount} 条记录。`;
                 } else if (errorMessage) {
                    ui.dbAiStatus.textContent = `AI 分类库：任务 [${current}/${total}] 失败 (错误)。已保存 ${savedCount} 条记录。`;
                 } else {
                    ui.dbAiStatus.textContent = `AI 分类库：正在分析... [${current}/${total}]，已保存 ${savedCount} 条记录。`;
                 }
            };

            try {
                // 确保原始库已下载
                const rawStr = GM_getValue(RAW_DB_KEY);
                let rawDBData = rawStr ? JSON.parse(rawStr).data : null;
                if (!rawDBData || Object.keys(rawDBData).length === 0) {
                    rawDBData = await MacDB.updateRawDB().catch(() => null);
                    if (!rawDBData || Object.keys(rawDBData).length === 0) throw new Error("下载 OUI 原始库失败，无法进行 AI 分析。");
                }

                await MacDB.runAiAnalysis(updateStatus, () => analysisAborted);

            } catch (e) {
                console.error('AI 分析失败 (来自 UI 触发):', e);
                alert(`AI 分析失败: ${e.message}`);
            } finally {
                // 3. Reset UI state
                ui.runAiBtn.removeEventListener('click', stopHandler);

                // 刷新状态，这会处理所有按钮的恢复和进度条的隐藏
                refreshStatus();
            }
        };

        ui.uploadAiDbBtn.onclick = async () => {
            const file = ui.aiDbUploadInput.files[0];
            if (!file) return alert('请先选择要上传的文件！');

            ui.uploadAiDbBtn.disabled = true;
            ui.uploadAiDbBtn.textContent = '上传中...';

            try {
                const count = await MacDB.importAiDB(file);
                alert(`AI 分类数据库上传成功！已导入 ${count} 条分类结果。页面即将刷新。`);
                location.reload();
            } catch (e) {
                alert(`AI 分类数据库上传失败: ${e.message}`);
                console.error('AI DB Import Error:', e);
            } finally {
                ui.uploadAiDbBtn.disabled = false;
                ui.uploadAiDbBtn.textContent = '上传并应用';
            }
        };

        ui.downloadAiDbBtn.onclick = () => {
            const aiStr = GM_getValue(AI_DB_KEY);
            if (!aiStr) {
                alert("AI 分类数据库为空，请先完成 AI 分析或上传数据库");
                return;
            }
            const aiDB = JSON.parse(aiStr);
            if (!aiDB.data || Object.keys(aiDB.data).length === 0) {
                alert("AI 分类数据库为空");
                return;
            }
            const content = JSON.stringify(aiDB.data, null, 2);
            const timestamp = aiDB.timestamp ? new Date(aiDB.timestamp).getTime() : Date.now();
            downloadFile(content, `xiaomi_ai_vendor_db_${timestamp}.json`, 'application/json');
            alert(`AI 分类数据库下载完成！共 ${Object.keys(aiDB.data).length} 条记录`);
        };

        // Initial Load
        refreshStatus();

        return modal;
    }

    // ==================== F. 流量监控模块 ====================

    function initTrafficMonitor() {
        console.log("TrafficMonitor: 初始化中...");

        const util = {
            byteFormat: function(number, precision) {
                const val = parseFloat(number);
                if (isNaN(val)) return '0KB';
                if (val > 1024 * 1024 * 1024) return (val / 1024 / 1024 / 1024).toFixed(2) + 'GB';
                if (val > 1024 * 1024) return (val / 1024 / 1024).toFixed(2) + 'MB';
                return (val / 1024).toFixed(2) + 'KB';
            },
            secondToDate: function(second) {
                let time = parseFloat(second);
                if (isNaN(time)) return '';
                if (time > 60 && time < 3600) return parseInt(time / 60) + '分' + parseInt(time % 60) + '秒';
                if (time >= 3600 && time < 86400) return parseInt(time / 3600) + '小时' + parseInt((time % 3600) / 60) + '分';
                if (time >= 86400) return parseInt(time / 86400) + '天 ' + parseInt((time % 86400) / 3600) + '小时';
                return parseInt(time) + '秒';
            }
        };

        // 1. 初始化悬浮窗
        function initFloatWindow() {
            if (document.getElementById('traffic-float-win')) return;
            const div = document.createElement('div');
            div.id = 'traffic-float-win';
            div.className = 'traffic-float-window';
            div.innerHTML = `
                <div class="traffic-content">
                    <div class="traffic-float-header">
                        <div class="traffic-float-title">实时流量监控</div>
                        <div class="traffic-float-controls">
                            <span class="traffic-float-btn" id="traffic-min-btn">－</span>
                        </div>
                    </div>
                    <div class="traffic-overview">
                        <div class="traffic-row">
                            <span class="traffic-label">下载总计</span>
                            <span class="traffic-val down" id="float-total-down">--</span>
                        </div>
                        <div class="traffic-row">
                            <span class="traffic-label">上传总计</span>
                            <span class="traffic-val up" id="float-total-up">--</span>
                        </div>
                    </div>
                    <div class="traffic-details" id="traffic-details-list">
                        </div>
                </div>
            `;
            document.body.appendChild(div);

            const header = div.querySelector('.traffic-float-header');
            const overview = div.querySelector('.traffic-overview');
            const minBtn = div.querySelector('#traffic-min-btn');

            // 切换展开/收起 (点击Header或Overview)
            const toggleExpand = () => {
                if(div.classList.contains('minimized')) return;
                div.classList.toggle('expanded');
            };
            header.onclick = toggleExpand;
            overview.onclick = toggleExpand;

            // 最小化
            minBtn.onclick = (e) => {
                e.stopPropagation();
                div.classList.remove('expanded');
                div.classList.add('minimized');
            }

            // 还原 (点击最小化后的图标)
            div.onclick = (e) => {
                if(div.classList.contains('minimized')) {
                    div.classList.remove('minimized');
                }
            };

            // 拖拽逻辑
            let isDragging = false;
            let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

            const dragStart = (e) => {
                // 仅允许在非内容区域拖拽
                if (e.target.closest('.traffic-details')) return;
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
            }
            const dragEnd = () => {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            }
            const drag = (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    div.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                }
            }

            div.addEventListener("mousedown", dragStart);
            document.addEventListener("mouseup", dragEnd);
            document.addEventListener("mousemove", drag);
        }

        initFloatWindow();

        // 2. 替换页面模板 (仅在首页设备列表页生效)
        const checkTemplate = setInterval(() => {
            let devicesItemTmpl = document.querySelector("#tmpldevicesitem");
            if (devicesItemTmpl) {
                clearInterval(checkTemplate);
                devicesItemTmpl.innerHTML = `
                <tr class="device-item" data-mac="{$mac}">
                    <td>
                        <img class="dev-icon" width="60" src="{$devices_icon}" onerror="this.src='/img/device_list_error.png'">
                        <div class="dev-info">
                            <div class="name">{$name} &nbsp;&nbsp;{if($isself)}<span class="muted">|&nbsp;本机</span>{/if}</div>
                            <ul class="devnetinfo clearfix">
                                <li><span class="k">已连接:</span> <span class="v online-time">{$online}</span></li>
                                <li>{for(var i=0, len=$ip.length; i<len; i++)}<p data-ip="{$ip[i]}"><span class="k">IP地址:</span> <span class="v">{$ip[i]}</span></p>{/for}</li>
                                <li><span class="k">MAC地址:</span> <span class="v">{$mac}</span></li>
                            </ul>
                        </div>
                    </td>
                    {if($d_is_ap != 8)}<td class="option">{$option}</td>{/if}
                    {if($d_is_ap == 8)}<td class="option_d01"></td>{/if}
                    {if($hasDisk)}<td class="option2">{$option2}</td>{/if}
                </tr>`;
            }
        }, 100);

        // 3. 劫持 jQuery 以监听 Ajax
        let lock = false;
        let uw = unsafeWindow;

        // 定义刷新逻辑
        function showSpeed(list) {
            let totalUpload = 0, totalDownload = 0;
            let activeDevices = [];

            if (!list) return;

            // 1. 数据处理与汇总
            list.forEach(item => {
                if (item.statistics) {
                    const dSpeed = parseFloat(item.statistics.downspeed);
                    const uSpeed = parseFloat(item.statistics.upspeed);
                    totalDownload += dSpeed;
                    totalUpload += uSpeed;

                    // 只要有流量就加入列表
                    if (dSpeed > 0 || uSpeed > 0) {
                        activeDevices.push({
                            name: item.name || item.mac,
                            down: dSpeed,
                            up: uSpeed
                        });
                    }
                }
            });

            // 2. 更新悬浮窗
            const floatWin = document.getElementById('traffic-float-win');
            if (floatWin) {
                // 更新总数
                floatWin.querySelector('#float-total-down').innerText = util.byteFormat(totalDownload, 100) + "/S";
                floatWin.querySelector('#float-total-up').innerText = util.byteFormat(totalUpload, 100) + "/S";

                // 更新详细列表 (如果展开)
                if (floatWin.classList.contains('expanded')) {
                    // 按下载速度排序
                    activeDevices.sort((a, b) => b.down - a.down);

                    const detailsList = floatWin.querySelector('#traffic-details-list');
                    if (activeDevices.length === 0) {
                        detailsList.innerHTML = '<div style="text-align:center; padding:10px; color:#999; font-size:12px;">暂无流量活动</div>';
                    } else {
                        const html = activeDevices.map(d => `
                            <div class="traffic-item">
                                <span class="traffic-item-name" title="${d.name}">${d.name}</span>
                                <div class="traffic-item-speed">
                                    <span class="t-down">↓ ${util.byteFormat(d.down, 10)}/s</span>
                                    <span class="t-up">↑ ${util.byteFormat(d.up, 10)}/s</span>
                                </div>
                            </div>
                        `).join('');
                        detailsList.innerHTML = html;
                    }
                }
            }

            // 3. 更新主界面列表 (仅在当前是设备列表页时)
            if (location.hash === "#devices" || /\/web\/home/.test(location.pathname)) {
                list.forEach(item => {
                    if (item.statistics) {
                        let mac = item.mac;
                        let tr = document.querySelector(`tr.device-item[data-mac='${mac}']`);
                        if (!tr) return;

                        let title = tr.querySelector("div.name");
                        let upspeed = util.byteFormat(+item.statistics.upspeed, 100) + "/S";
                        let downspeed = util.byteFormat(+item.statistics.downspeed, 100) + "/S";
                        let online = util.secondToDate(+item.statistics.online);

                        const pu = totalUpload ? Math.round((+item.statistics.upspeed * 10000) / totalUpload) / 100 : 0;
                        const pd = totalDownload ? Math.round((+item.statistics.downspeed * 10000) / totalDownload) / 100 : 0;

                        let ups = title.querySelector(".up-speed");
                        let downs = title.querySelector(".down-speed");

                        if (ups) {
                            ups.innerHTML = `<span><i>↑</i>${upspeed}</span>`;
                            ups.style.setProperty("--percentage", pu + "%");
                            downs.innerHTML = `<span><i>↓</i>${downspeed}</span>`;
                            downs.style.setProperty("--percentage", pd + "%");
                        } else {
                            let sub = document.createElement('sub');
                            sub.className = 'device-speed';
                            sub.innerHTML = `
                                <span class='up-speed' style="--percentage: ${pu}%;"><span><i>↑</i>${upspeed}</span></span>
                                <span class='down-speed' style="--percentage: ${pd}%;"><span><i>↓</i>${downspeed}</span></span>
                            `;
                            title.appendChild(sub);
                        }
                        let timeSpan = tr.querySelector(".online-time");
                        if(timeSpan) timeSpan.innerHTML = online;
                    }
                });
            }

            setTimeout(refreshSpeed, 2000);
        }

        function refreshSpeed() {
            if (lock) return;
            lock = true;
            const api = `/cgi-bin/luci/;stok=${getToken()}/api/misystem/devicelist?mlo=1`;
            fetch(api).then(r => r.json()).then(data => {
                if (data.code === 0) showSpeed(data.list);
            }).catch(e => {
                console.error("TrafficMonitor: API Error", e);
                setTimeout(refreshSpeed, 2000);
            }).finally(() => {
                lock = false;
            });
        }

        const hookJQuery = setInterval(() => {
            if (uw.jQuery) {
                clearInterval(hookJQuery);
                uw.jQuery(document).ajaxComplete(function (e, xhr, setting) {
                    if (/misystem\/devicelist/.test(setting.url)) {
                        let data;
                        try { data = JSON.parse(xhr.responseText); } catch (e) { return; }
                        showSpeed(data.list);
                    }
                });
                refreshSpeed();
            }
        }, 500);
    }

    // ==================== G. 启动 ====================
    function initButtons() {
        let fab = document.querySelector('.static-ip-fab');
        if (!fab) { fab = document.createElement('div'); fab.className = 'static-ip-fab'; document.body.appendChild(fab); }

        // 1. Settings Button
        if (!document.getElementById('btn-settings')) {
            const btn = document.createElement('div');
            btn.id = 'btn-settings';
            btn.className = 'static-ip-fab-btn-settings';
            btn.innerHTML = '⚙️';
            fab.appendChild(btn);

            const settingsModal = renderSettingsModal();
            btn.onclick = () => settingsModal.style.display = 'flex';
        }

        // 2. Add Button
        if (!document.getElementById('btn-add-ip')) {
            const btn = document.createElement('div');
            btn.id = 'btn-add-ip'; btn.className = 'static-ip-btn static-ip-add'; btn.innerHTML = '➕ 添加绑定';
            fab.appendChild(btn);
            const ui = renderAddModal();
            btn.onclick = () => { ui.modal.style.display = 'flex'; ui.load(); };
        }

        // 3. Bind List Button (替换原删除按钮)
        if (!document.getElementById('btn-list-ip')) {
            const btn = document.createElement('div');
            btn.id = 'btn-list-ip'; btn.className = 'static-ip-btn static-ip-list'; btn.innerHTML = '📋 绑定列表';
            fab.appendChild(btn);
            const ui = renderBindListModal();
            btn.onclick = () => { ui.modal.style.display = 'flex'; ui.load(); };
        }
    }

    initTrafficMonitor();
    setTimeout(initButtons, 1500);
})();
