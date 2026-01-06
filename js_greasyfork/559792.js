// ==UserScript==
// @name         集采助手
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  物料录入、提交、类别选择、投标日期限制解除、验证码自动识别及比价表生成功能
// @author       tafe
// @match        http://zb.hnjgcg.com/*
// @match        https://zb.hnjgcg.com/*
// @match        http://ec.hnjgcg.com/*
// @match        https://ec.hnjgcg.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @connect      zb.hnjgcg.com
// @connect      ec.hnjgcg.com
// @connect      aip.baidubce.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559792/%E9%9B%86%E9%87%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559792/%E9%9B%86%E9%87%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在iframe中
    const isInIframe = window.top !== window.self;

    // ========== 日期限制解除模块 ==========
    const dateRestrictionRemover = {
        observer: null,
        intervalId: null,
        clickHandler: null,
        focusHandler: null,
        mousedownHandler: null,

        // 检查功能是否启用
        isEnabled() {
            return GM_getValue('dateRestrictionRemoverEnabled', false);
        },

        // 移除日期禁用状态的函数
        removeDateRestrictions() {
            if (!this.isEnabled()) return;

            const disabledDates = document.querySelectorAll('.mini-calendar-date.mini-calendar-disabled');

            disabledDates.forEach(dateElement => {
                dateElement.classList.remove('mini-calendar-disabled');

                if (dateElement.style.pointerEvents === 'none') {
                    dateElement.style.pointerEvents = '';
                }
                if (dateElement.style.opacity && parseFloat(dateElement.style.opacity) < 1) {
                    dateElement.style.opacity = '';
                }
                if (dateElement.style.cursor === 'not-allowed') {
                    dateElement.style.cursor = '';
                }

                dateElement.removeAttribute('disabled');
                dateElement.removeAttribute('aria-disabled');
                dateElement.style.pointerEvents = 'auto';
            });
        },

        // 使用 MutationObserver 监听 DOM 变化
        observeCalendarChanges() {
            if (this.observer) {
                this.observer.disconnect();
            }

            this.observer = new MutationObserver(() => {
                this.removeDateRestrictions();
            });

            this.observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        },

        // 启动功能
        start() {
            if (!this.isEnabled()) return;

            // 先停止已有的监听器，避免重复
            this.stop();

            // 立即执行一次
            this.removeDateRestrictions();
            this.observeCalendarChanges();

            // 定期检查
            this.intervalId = setInterval(() => this.removeDateRestrictions(), 2000);

            // 监听日历弹出事件
            this.clickHandler = (e) => {
                if (e.target.closest('.mini-calendar') || e.target.closest('.mini-datepicker')) {
                    setTimeout(() => this.removeDateRestrictions(), 150);
                }
            };
            document.addEventListener('click', this.clickHandler, true);

            // 监听焦点事件
            this.focusHandler = (e) => {
                if (e.target.closest('.mini-datepicker') || e.target.type === 'text') {
                    setTimeout(() => this.removeDateRestrictions(), 200);
                }
            };
            document.addEventListener('focusin', this.focusHandler, true);

            // 重写可能阻止点击的事件处理
            this.mousedownHandler = (e) => {
                const target = e.target;
                if (target && target.classList && target.classList.contains('mini-calendar-date')) {
                    if (target.classList.contains('mini-calendar-disabled')) {
                        target.classList.remove('mini-calendar-disabled');
                    }
                }
            };
            document.addEventListener('mousedown', this.mousedownHandler, true);

            console.log('日期限制移除功能已启动');
        },

        // 停止功能
        stop() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            if (this.clickHandler) {
                document.removeEventListener('click', this.clickHandler, true);
                this.clickHandler = null;
            }
            if (this.focusHandler) {
                document.removeEventListener('focusin', this.focusHandler, true);
                this.focusHandler = null;
            }
            if (this.mousedownHandler) {
                document.removeEventListener('mousedown', this.mousedownHandler, true);
                this.mousedownHandler = null;
            }
            console.log('日期限制移除功能已停止');
        },

        // 初始化
        init() {
            if (this.isEnabled()) {
                this.start();
            }
        }
    };
    // ========== 日期限制解除模块结束 ==========

    // ========== 验证码识别模块 ==========
    const captchaRecognizer = {
        isRecognizing: false,

        async getBaiduAccessToken() {
            const apiKey = GM_getValue('baiduOcrApiKey', '');
            const secretKey = GM_getValue('baiduOcrSecretKey', '');
            if (!apiKey || !secretKey) {
                throw new Error('请先在设置中配置百度OCR API密��');
            }
            const cachedToken = GM_getValue('baiduAccessToken', '');
            const tokenExpiry = GM_getValue('baiduTokenExpiry', 0);
            if (cachedToken && Date.now() < tokenExpiry) {
                return cachedToken;
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
                    method: 'GET',
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.access_token) {
                                GM_setValue('baiduAccessToken', data.access_token);
                                GM_setValue('baiduTokenExpiry', Date.now() + (data.expires_in - 300) * 1000);
                                resolve(data.access_token);
                            } else {
                                reject(new Error('获取百度API访问令牌失败'));
                            }
                        } catch (e) {
                            reject(new Error('解析令牌响应失败: ' + e.message));
                        }
                    },
                    onerror: () => reject(new Error('网络请求失败'))
                });
            });
        },

        async recognizeCaptcha(imageElement) {
            try {
                const accessToken = await this.getBaiduAccessToken();
                const imageBase64 = await this.getImageBase64(imageElement);
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        url: `https://aip.baidubce.com/rest/2.0/ocr/v1/numbers?access_token=${accessToken}`,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        data: `image=${encodeURIComponent(imageBase64)}`,
                        onload: (response) => {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.words_result && data.words_result.length > 0) {
                                    resolve(data.words_result.map(item => item.words).join('').replace(/\s+/g, ''));
                                } else {
                                    reject(new Error('识别结果为空'));
                                }
                            } catch (e) {
                                reject(new Error('解析识别响应失败: ' + e.message));
                            }
                        },
                        onerror: () => reject(new Error('网络请求失败'))
                    });
                });
            } catch (error) {
                console.error('验证码识别失败:', error);
                throw error;
            }
        },

        async getImageBase64(imageElement) {
            return new Promise((resolve, reject) => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = imageElement.naturalWidth || imageElement.width;
                    canvas.height = imageElement.naturalHeight || imageElement.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(imageElement, 0, 0);
                    const base64 = canvas.toDataURL('image/png').split(',')[1];
                    resolve(base64);
                } catch (error) {
                    reject(new Error('图片转换失败: ' + error.message));
                }
            });
        },

        async autoFillCaptcha() {
            if (this.isRecognizing) {
                console.log('验证码识别进行中，跳过重复调用');
                return;
            }

            const captchaImg = document.querySelector('#img_valid');
            const captchaInput = document.querySelector('#validatecode');
            if (!captchaImg || !captchaInput) return;

            this.isRecognizing = true;
            try {
                captchaInput.value = '识别中...';
                const result = await this.recognizeCaptcha(captchaImg);
                captchaInput.value = result;
                console.log('验证码识别成功:', result);
            } catch (error) {
                captchaInput.value = '';
                console.error('验证码识别失败:', error);
                if (error.message.includes('配置百度OCR')) {
                    alert(error.message);
                }
            } finally {
                this.isRecognizing = false;
            }
        }
    };
    // ========== 验证码识别模块结束 ==========

    // 配置
    const CURRENT_ORIGIN = (() => {
        try {
            const origin = window.location.origin;
            if (origin && origin.includes('hnjgcg.com')) {
                return origin.replace(/\/$/, '');
            }
        } catch (e) {
            // ignore
        }
        return 'https://zb.hnjgcg.com';
    })();

    const CONFIG = {
        MAX_SPECIFICATION_LENGTH: 300,
        API_BASE: CURRENT_ORIGIN,
        GET_MATERIAL_CODE_URL: '/gjc/base/material/nextcode.do',
        SAVE_MATERIAL_URL: '/gjc/core/simple/save.do',
        ENABLE_MATERIAL_URL: '/gjc/base/material/updmaterial.do',
        FIND_MATERIAL_URL: '/gjc/core/simple/findList.do',
        QUERY_CLASS_URL: '/gjc/base/materialclass/queryMaterialLeftTree.do',
    };

    const ensureXLSXReady = (() => {
        let loadingPromise = null;
        return () => {
            const existing = (typeof unsafeWindow !== 'undefined' && unsafeWindow.XLSX) ||
                (typeof window !== 'undefined' && window.XLSX);
            if (existing) return Promise.resolve(existing);

            if (!loadingPromise) {
                loadingPromise = new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
                    script.onload = () => {
                        const lib = (typeof unsafeWindow !== 'undefined' && unsafeWindow.XLSX) ||
                            (typeof window !== 'undefined' && window.XLSX);
                        if (lib) {
                            resolve(lib);
                        } else {
                            reject(new Error('XLSX 库仍不可用'));
                        }
                    };
                    script.onerror = () => reject(new Error('加载 XLSX 库失败'));
                    document.head.appendChild(script);
                });
            }
            return loadingPromise;
        };
    })();

    const historyManager = {
        STORAGE_KEY: 'materialSubmitHistory',
        MAX_ITEMS: 100,

        getHistory() {
            try {
                const raw = GM_getValue(this.STORAGE_KEY, '[]');
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                console.warn('读取提交历史失败:', error);
                return [];
            }
        },

        recordHistoryEntry(material = {}, status = 'success', message = '', extra = {}) {
            const entryMaterial = material ? { ...material } : {};
            historyManager.addEntry({
                status,
                message,
                source: extra.source || 'manual',
                materialname: entryMaterial.materialname || '',
                specification: entryMaterial.specification || '',
                unit: entryMaterial.unit || '',
                materialclasscode: entryMaterial.materialclasscode || '',
                materialclassid: entryMaterial.materialclassid || '',
                materialcode: entryMaterial.materialcode || '',
                gjcmaterialcode: extra.gjcmaterialcode || entryMaterial.gjcmaterialcode || '',
            });
            this.renderHistoryList();
        },

        renderHistoryList() {
            const listEl = document.getElementById('history-list');
            if (!listEl) return;

            const history = historyManager.getHistory();
            if (!history.length) {
                listEl.innerHTML = `<div style="text-align: center; color: #999; padding: 30px 0;">暂无提交记录</div>`;
                return;
            }

            const statusMap = {
                success: { label: '成功', color: '#155724', bg: '#d4edda' },
                duplicate: { label: '已存在', color: '#0c5460', bg: '#d1ecf1' },
                error: { label: '失败', color: '#721c24', bg: '#f8d7da' },
            };

            listEl.innerHTML = history.map(item => {
                const statusInfo = statusMap[item.status] || { label: item.status || '未知', color: '#495057', bg: '#e9ecef' };
                return `
                    <div style="border: 1px solid #eef2f7; border-left: 4px solid ${statusInfo.color}; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; background: #fff;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-weight: 600; color: #1f3a5f;">${item.materialname || '-'}</span>
                            <span style="padding: 2px 10px; border-radius: 999px; background: ${statusInfo.bg}; color: ${statusInfo.color}; font-size: 12px;">${statusInfo.label}</span>
                        </div>
                        <div style="font-size: 12px; color: #555; line-height: 1.5;">
                            <div>规格：${item.specification || '-'}</div>
                            <div>单位：${item.unit || '-'}</div>
                            <div>类别：${item.materialclasscode || '-'} / ${item.materialclassid || '-'}</div>
                            <div>编码：${item.gjcmaterialcode || item.materialcode || '-'}</div>
                            <div>时间：${utils.formatDateTime(item.timestamp)}</div>
                            ${item.message ? `<div>备注：${item.message}</div>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        },

        saveHistory(list) {
            try {
                const trimmed = Array.isArray(list) ? list.slice(0, this.MAX_ITEMS) : [];
                GM_setValue(this.STORAGE_KEY, JSON.stringify(trimmed));
            } catch (error) {
                console.warn('保存提交历史失败:', error);
            }
        },

        addEntry(entry) {
            if (!entry) return;
            const history = this.getHistory();
            history.unshift({
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                timestamp: Date.now(),
                ...entry,
            });
            this.saveHistory(history);
        },

        clearHistory() {
            this.saveHistory([]);
        }
    };

    // 工具函数
    const utils = {
        // 获取Cookie（只能拿到非 HttpOnly 的，主要用于日志）
        getCookies() {
            if (!document.cookie) return {};
            return document.cookie.split(';').reduce((acc, cookie) => {
                const separatorIndex = cookie.indexOf('=');
                if (separatorIndex === -1) return acc;
                const key = cookie.slice(0, separatorIndex).trim();
                const value = cookie.slice(separatorIndex + 1).trim();
                if (key && value) acc[key] = value;
                return acc;
            }, {});
        },

        async downloadTemplate() {
            try {
                // 优先使用脚本作用域中的 XLSX（@require 注入的）
                let XLSXLib = null;
                if (typeof XLSX !== 'undefined' && XLSX) {
                    XLSXLib = XLSX;
                } else if (typeof unsafeWindow !== 'undefined' && unsafeWindow.XLSX) {
                    XLSXLib = unsafeWindow.XLSX;
                } else if (typeof window !== 'undefined' && window.XLSX) {
                    XLSXLib = window.XLSX;
                }

                if (!XLSXLib) {
                    XLSXLib = await ensureXLSXReady();
                }

                // 详细验证 XLSX 库的完整性
                if (!XLSXLib) {
                    throw new Error('XLSX 库未找到');
                }
                if (!XLSXLib.utils) {
                    throw new Error('XLSX.utils 未找到');
                }
                if (typeof XLSXLib.utils.aoa_to_sheet !== 'function') {
                    throw new Error('XLSX.utils.aoa_to_sheet 方法不存在');
                }
                if (typeof XLSXLib.utils.book_new !== 'function') {
                    throw new Error('XLSX.utils.book_new 方法不存在');
                }
                if (typeof XLSXLib.utils.book_append_sheet !== 'function') {
                    throw new Error('XLSX.utils.book_append_sheet 方法不存在');
                }
                if (typeof XLSXLib.write !== 'function' && typeof XLSXLib.writeFile !== 'function') {
                    throw new Error('XLSX.write 和 XLSX.writeFile 方法都不存在');
                }

                const header = ['物料名称', '物料规格', '单位', '物料类别代码', '物料类别ID'];
                const sampleData = [
                    ['示例物料A', '规格示例A', '件', '0001', '1001'],
                    ['示例物料B', '规格示例B', '台', '0002', '1002'],
                ];

                const worksheetData = [header, ...sampleData];

                // 验证数据
                if (!Array.isArray(worksheetData) || worksheetData.length === 0) {
                    throw new Error('工作表数据无效');
                }

                const worksheet = XLSXLib.utils.aoa_to_sheet(worksheetData);
                if (!worksheet) {
                    throw new Error('创建工作表失败');
                }

                const workbook = XLSXLib.utils.book_new();
                if (!workbook) {
                    throw new Error('创建工作簿失败');
                }

                XLSXLib.utils.book_append_sheet(workbook, worksheet, '模板');

                const filename = `物料导入模板_${new Date().toISOString().slice(0,10)}.xlsx`;

                // 使用 write 方法生成 ArrayBuffer，然后手动下载
                try {
                    const wbout = XLSXLib.write(workbook, { bookType: 'xlsx', type: 'array' });
                    if (!wbout || !(wbout instanceof ArrayBuffer || wbout instanceof Uint8Array)) {
                        throw new Error('生成 Excel 文件数据失败');
                    }

                    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    this.showAlert('已下载 Excel 模板', 'success');
                } catch (writeError) {
                    // 如果 write 方法失败，尝试使用 writeFile
                    console.warn('使用 write 方法失败，尝试 writeFile:', writeError);
                    if (typeof XLSXLib.writeFile === 'function') {
                        XLSXLib.writeFile(workbook, filename);
                        this.showAlert('已下载 Excel 模板', 'success');
                    } else {
                        throw new Error('无法生成 Excel 文件：write 和 writeFile 方法都不可用');
                    }
                }
            } catch (error) {
                console.error('下载模板失败:', error);
                console.error('错误堆栈:', error.stack);
                this.showAlert('下载 Excel 模板失败：' + (error.message || '未知错误') + '，请检查控制台获取详细信息', 'error');
            }
        },

        // 清理特殊字符
        cleanSpecialChars(text) {
            if (typeof text !== 'string') return text;
            return text
                .replace(/\r\n/g, ' ')
                .replace(/\n/g, ' ')
                .replace(/\r/g, ' ')
                .replace(/\t/g, ' ')
                .replace(/ +/g, ' ')
                .trim();
        },

        normalizeCompareText(text) {
            if (text === null || text === undefined) return '';
            return String(text)
                .replace(/\s+/g, '')
                .replace(/[\u00A0\u3000]/g, '')
                .replace(/[·•。、，,；;“”"']/g, '')
                .toLowerCase()
                .trim();
        },

        areTextsSimilar(a, b) {
            const normA = this.normalizeCompareText(a);
            const normB = this.normalizeCompareText(b);
            if (!normA && !normB) return true;
            if (!normA || !normB) return false;
            return normA === normB;
        },

        formatDateTime(timestamp) {
            if (!timestamp) return '';
            try {
                const date = new Date(timestamp);
                return date.toLocaleString();
            } catch (error) {
                return '';
            }
        },

        // 显示提示
        showAlert(message, type = 'info', duration = 3000) {
            const alertDiv = document.createElement('div');
            alertDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
                color: white;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                max-width: 400px;
                font-size: 14px;
            `;
            alertDiv.textContent = message;
            document.body.appendChild(alertDiv);
            if (duration > 0) {
                setTimeout(() => alertDiv.remove(), duration);
            }
            return alertDiv;
        },

        // AJAX请求
        async request(url, options = {}) {
            const method = (options.method || 'GET').toUpperCase();

                // 构建完整URL
                const fullUrl = url.startsWith('http') ? url : CONFIG.API_BASE + url;

                // 如果是GET请求且有data，转换为查询参数
                let requestUrl = fullUrl;
            let requestBody = options.data;
            if (method === 'GET' && requestBody) {
                    const separator = requestUrl.includes('?') ? '&' : '?';
                requestUrl = fullUrl + separator + requestBody;
                requestBody = undefined;
            }

            const headers = {
                'Content-Type': method === 'POST' ? 'application/x-www-form-urlencoded; charset=UTF-8' : undefined,
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': CONFIG.API_BASE + '/gjc/base/material/material_edit.html',
                        'Origin': CONFIG.API_BASE,
                        ...options.headers
            };

            // 先尝试使用 fetch（同源请求更容易带上 Cookie）
            try {
                const fetchHeaders = new Headers();
                Object.entries(headers)
                    .filter(([, value]) => Boolean(value))
                    .forEach(([key, value]) => fetchHeaders.append(key, value));

                const fetchResponse = await fetch(requestUrl, {
                    method,
                    headers: fetchHeaders,
                    body: requestBody,
                    credentials: 'include',
                });
                const text = await fetchResponse.text();
                try {
                    const data = JSON.parse(text);
                    return { status: fetchResponse.status, data };
                } catch (e) {
                    return { status: fetchResponse.status, data: text };
                }
            } catch (fetchError) {
                console.warn('fetch 请求失败，改用 GM_xmlhttpRequest:', fetchError);
            }

            // 如果 fetch 失败再退回到 GM_xmlhttpRequest
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: requestUrl,
                    method,
                    headers,
                    anonymous: false, // 允许带上站点 Cookie（包括 HttpOnly）
                    data: requestBody,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve({ status: response.status, data });
                        } catch (e) {
                            resolve({ status: response.status, data: response.responseText });
                        }
                    },
                    onerror: reject
                });
            });
        }
    };

    // 物料服务
    const materialService = {
        // 获取物料编码
        async getMaterialCode(classCode) {
            const response = await utils.request(CONFIG.GET_MATERIAL_CODE_URL, {
                method: 'POST',
                data: `bvo.p.materialclasscode=${encodeURIComponent(classCode)}`
            });
            return response.data.trim();
        },

        // 提交物料
        async submitMaterial(material) {
            const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

            const createid = (material.createid || '').trim();
            const createname = (material.createname || '').trim();

            const payload = {
                materialname: material.materialname || '',
                materialcode: material.materialcode || '',
                specification: (material.specification || '').substring(0, CONFIG.MAX_SPECIFICATION_LENGTH),
                unit: material.unit || '',
                price: material.price || 0,
                remark: material.remark || '',
                gjcmaterialcode: material.materialcode || '',
                materialclassid: material.materialclassid || '',
                companyid: '1',
                createid,
                createname,
                insertdate: now,
                createdate: now,
                mstate: '0',
                materialclasscode: material.materialclasscode || '',
                source: 'add',
            };

            const response = await utils.request(CONFIG.SAVE_MATERIAL_URL, {
                method: 'POST',
                data: `data=${encodeURIComponent(JSON.stringify(payload))}&po=/gjc/db/po/material.po`
            });

            if (response.data && response.data.materialid) {
                // 自动启用物料
                setTimeout(() => {
                    this.enableMaterial(response.data.materialid);
                }, 1000);
                return { success: true, data: response.data };
            }
            return { success: false, message: response.data?.message || '提交失败' };
        },

        // 启用物料
        async enableMaterial(materialid) {
            const response = await utils.request(CONFIG.ENABLE_MATERIAL_URL, {
                method: 'POST',
                data: `subdata=${encodeURIComponent(JSON.stringify([{materialid}]))}&updvlaue=1`
            });
            return response.data;
        },

        // 查询物料类别（懒加载）
        async queryMaterialClasses(parentId = '-1') {
            const response = await utils.request(CONFIG.QUERY_CLASS_URL, {
                method: 'POST',
                data: `bvo.p.lazy=1&cached=false&pageIndex=0&pageSize=1000&bvo.p.companyid=$!companyid&bvo.p.lazy=1&bvo.rdtype=json&po=/gjc/base/material/getZTmaterialclass.sql&materialclassid=${parentId}&bvo.p.pid=${parentId}`
            });
            return Array.isArray(response.data) ? response.data : [];
        },

        // 判断物料是否重复
        async findDuplicateMaterials(material) {
            if (!material || !material.materialname || !material.specification || !material.materialcode) {
                return [];
            }

            const params = new URLSearchParams({
                'cached': 'false',
                'bvo.p.companyid': '1',
                'bvo.p.materialname': material.materialname,
                'bvo.p.specification': material.specification,
                'bvo.p.materialcode': material.materialcode,
                'bvo.po': '/gjc/base/material/material_zt_check.ds',
            });

                        const response = await utils.request(CONFIG.FIND_MATERIAL_URL, {
                            method: 'GET',
                data: params.toString()
                        });

            if (!response || !response.data) return [];

                        if (Array.isArray(response.data)) {
                return response.data;
            }
            if (Array.isArray(response.data.data)) {
                return response.data.data;
            }
            return [];
        },

        getExactDuplicateMatch(material, duplicates = []) {
            if (!material || !Array.isArray(duplicates) || duplicates.length === 0) {
                return null;
            }
            const targetClass = String(material.materialclasscode || '').trim();
            const targetCode = String(material.materialcode || '').trim();
            const targetName = utils.normalizeCompareText(material.materialname);
            const targetSpec = utils.normalizeCompareText(material.specification);
            const targetUnit = utils.normalizeCompareText(material.unit);

            if (!targetClass || !targetCode) return null;

            return duplicates.find(item => {
                const itemClass = String(item.materialclasscode || item.materialClassCode || '').trim();
                const itemCode = String(item.materialcode || item.materialCode || '').trim();
                if (itemClass !== targetClass || itemCode !== targetCode) return false;

                const itemName = utils.normalizeCompareText(item.materialname || item.materialName || '');
                const itemSpec = utils.normalizeCompareText(item.specification || item.spec || item.materialspec || '');
                const itemUnit = utils.normalizeCompareText(item.unit || item.unitname || item.unitName || '');

                const nameSimilar = utils.areTextsSimilar(targetName, itemName);
                const specSimilar = utils.areTextsSimilar(targetSpec, itemSpec);
                const unitSimilar = utils.areTextsSimilar(targetUnit, itemUnit);

                return nameSimilar && specSimilar && unitSimilar;
            }) || null;
        },

        // 检查节点是否有子节点
        hasChildren(node) {
            const isLeaf = node.isLeaf;
            if (typeof isLeaf === 'boolean') {
                return !isLeaf;
            }
            if (isLeaf === null || isLeaf === undefined) {
                return true; // 默认认为有子节点
            }
            const valueStr = String(isLeaf).trim().toLowerCase();
            return !['true', '1', 'y', 'yes'].includes(valueStr);
        }
    };

    // UI组件
    const UI = {
        // 创建右侧菜单
        createMenu() {
            const existingMenu = document.getElementById('helper-menu');
            if (existingMenu) {
                return existingMenu;
            }

            const menu = document.createElement('div');
            menu.id = 'helper-menu';
            menu.style.cssText = `
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 220px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                z-index: 9996;
                display: none;
                flex-direction: column;
                padding: 0;
                overflow: hidden;
            `;

            menu.innerHTML = `
                <div style="padding: 16px; font-weight: 600; color: #22588D; border-bottom: 1px solid #e9ecef; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
                    集采助手
                </div>
                <div style="padding: 8px;">
                    <button class="menu-item" data-action="material" style="width: 100%; padding: 14px 16px; text-align: left; border: none; background: #f8f9fa; border-radius: 8px; cursor: pointer; font-size: 14px; color: #495057; transition: all 0.2s; margin-bottom: 6px;">
                        📦 物料管理
                    </button>
                    <button class="menu-item" data-action="comparison" style="width: 100%; padding: 14px 16px; text-align: left; border: none; background: #f8f9fa; border-radius: 8px; cursor: pointer; font-size: 14px; color: #495057; transition: all 0.2s; margin-bottom: 6px;">
                        📊 比价表生成
                    </button>
                    <button class="menu-item" data-action="settings" style="width: 100%; padding: 14px 16px; text-align: left; border: none; background: #f8f9fa; border-radius: 8px; cursor: pointer; font-size: 14px; color: #495057; transition: all 0.2s;">
                        ⚙️ 更多设置
                    </button>
                </div>
            `;

            // 添加悬停效果
            menu.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.background = '#e3f2fd';
                    item.style.transform = 'translateX(-4px)';
                    item.style.color = '#22588D';
                    item.style.boxShadow = '0 2px 8px rgba(34, 88, 141, 0.15)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.background = '#f8f9fa';
                    item.style.transform = 'translateX(0)';
                    item.style.color = '#495057';
                    item.style.boxShadow = 'none';
                });
            });

            // 绑定菜单项点击事件
            menu.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const action = e.currentTarget.dataset.action;
                    // 先处理动作，再隐藏菜单
                    this.handleMenuAction(action);
                    // 立即隐藏菜单
                    this.hideMenu();
                });
            });

            // 点击外部区域关闭菜单
            document.addEventListener('click', (e) => {
                const menu = document.getElementById('helper-menu');
                const btn = document.getElementById('material-helper-btn');
                const overlay = document.getElementById('material-helper-overlay');
                // 如果点击的是菜单项，不处理（由菜单项自己的事件处理）
                if (menu && menu.contains(e.target)) {
                    return;
                }
                if (menu && menu.style.display === 'flex') {
                    if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                        this.hideMenu();
                    }
                }
            });

            document.body.appendChild(menu);
            return menu;
        },

        // 显示菜单
        showMenu() {
            try {
                const menu = this.createMenu();
                if (menu) {
                    menu.style.display = 'flex';
                }
            } catch (error) {
                console.error('显示菜单失败:', error);
            }
        },

        // 隐藏菜单
        hideMenu() {
            try {
                const menu = document.getElementById('helper-menu');
                if (menu) {
                    menu.style.display = 'none';
                }
            } catch (error) {
                console.error('隐藏菜单失败:', error);
            }
        },

        // 切换菜单显示/隐藏
        toggleMenu() {
            try {
                const menu = document.getElementById('helper-menu');
                if (menu && menu.style.display === 'flex') {
                    this.hideMenu();
                } else {
                    this.showMenu();
                }
            } catch (error) {
                console.error('切换菜单失败:', error);
                // 如果出错，尝试重新创建菜单
                try {
                    this.showMenu();
                } catch (e) {
                    console.error('重新创建菜单也失败:', e);
                }
            }
        },

        // 处理菜单项点击
        handleMenuAction(action) {
            switch (action) {
                case 'material':
                    this.openMaterialPanel();
                    break;
                case 'comparison':
                    this.openComparisonTool();
                    break;
                case 'settings':
                    this.openSettingsPanel();
                    break;
            }
        },

        // 打开设置面板
        openSettingsPanel() {
            const modal = document.createElement('div');
            modal.id = 'settings-modal';
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            const content = document.createElement('div');
            content.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 24px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            `;

            const isEnabled = GM_getValue('dateRestrictionRemoverEnabled', false);
            const captchaEnabled = GM_getValue('captchaAutoRecognizeEnabled', false);
            const apiKey = GM_getValue('baiduOcrApiKey', '');
            const secretKey = GM_getValue('baiduOcrSecretKey', '');

            content.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #22588D;">设置</h3>
                    <button id="settings-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6c757d;">×</button>
                </div>
                <div style="border-top: 1px solid #e9ecef; padding-top: 20px; max-height: 60vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                        <div>
                            <div style="font-weight: 500; color: #495057; margin-bottom: 4px;">投标日期限制解除</div>
                            <div style="font-size: 12px; color: #6c757d;">移除日期选择器的5天内禁用限制</div>
                        </div>
                        <label style="position: relative; display: inline-block; width: 48px; height: 24px;">
                            <input type="checkbox" id="date-restriction-toggle" ${isEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                            <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${isEnabled ? '#28a745' : '#ccc'}; transition: 0.3s; border-radius: 24px;"></span>
                            <span style="position: absolute; content: ''; height: 18px; width: 18px; left: ${isEnabled ? '27px' : '3px'}; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%;"></span>
                        </label>
                    </div>
                    <div style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div>
                                <div style="font-weight: 500; color: #495057; margin-bottom: 4px;">验证码自动识别</div>
                                <div style="font-size: 12px; color: #6c757d;">登录页面自动识别验证码(需配置百度OCR API)</div>
                            </div>
                            <label style="position: relative; display: inline-block; width: 48px; height: 24px;">
                                <input type="checkbox" id="captcha-toggle" ${captchaEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${captchaEnabled ? '#28a745' : '#ccc'}; transition: 0.3s; border-radius: 24px;"></span>
                                <span style="position: absolute; content: ''; height: 18px; width: 18px; left: ${captchaEnabled ? '27px' : '3px'}; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%;"></span>
                            </label>
                        </div>
                        <div style="margin-top: 12px;">
                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">百度OCR API Key:</label>
                            <input type="text" id="baidu-api-key" value="${apiKey}" placeholder="请输入API Key" style="width: 100%; padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; box-sizing: border-box;">
                        </div>
                        <div style="margin-top: 8px;">
                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">百度OCR Secret Key:</label>
                            <input type="password" id="baidu-secret-key" value="${secretKey}" placeholder="请输入Secret Key" style="width: 100%; padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; box-sizing: border-box;">
                        </div>
                        <button id="save-baidu-keys" style="margin-top: 8px; padding: 6px 12px; background: #22588D; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">保存密钥</button>
                    </div>
                </div>
            `;

            modal.appendChild(content);
            document.body.appendChild(modal);

            const closeModal = () => modal.remove();
            content.querySelector('#settings-close').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            const toggle = content.querySelector('#date-restriction-toggle');
            const toggleBg = content.querySelectorAll('span')[0];
            const toggleBtn = content.querySelectorAll('span')[1];

            toggle.addEventListener('change', () => {
                const enabled = toggle.checked;
                GM_setValue('dateRestrictionRemoverEnabled', enabled);
                toggleBg.style.backgroundColor = enabled ? '#28a745' : '#ccc';
                toggleBtn.style.left = enabled ? '27px' : '3px';

                if (enabled) {
                    dateRestrictionRemover.start();
                    utils.showAlert('日期限制解除功能已启用', 'success');
                } else {
                    dateRestrictionRemover.stop();
                    utils.showAlert('日期限制解除功能已关闭', 'info');
                }
            });

            const captchaToggle = content.querySelector('#captcha-toggle');
            const captchaToggleBg = content.querySelectorAll('span')[2];
            const captchaToggleBtn = content.querySelectorAll('span')[3];

            captchaToggle.addEventListener('change', () => {
                const enabled = captchaToggle.checked;
                GM_setValue('captchaAutoRecognizeEnabled', enabled);
                captchaToggleBg.style.backgroundColor = enabled ? '#28a745' : '#ccc';
                captchaToggleBtn.style.left = enabled ? '27px' : '3px';
                utils.showAlert(enabled ? '验证码自动识别已启用' : '验证码自动识别已关闭', enabled ? 'success' : 'info');
            });

            content.querySelector('#save-baidu-keys').addEventListener('click', () => {
                const apiKey = content.querySelector('#baidu-api-key').value.trim();
                const secretKey = content.querySelector('#baidu-secret-key').value.trim();
                if (!apiKey || !secretKey) {
                    utils.showAlert('请输入完整的API Key和Secret Key', 'error');
                    return;
                }
                GM_setValue('baiduOcrApiKey', apiKey);
                GM_setValue('baiduOcrSecretKey', secretKey);
                GM_setValue('baiduAccessToken', '');
                GM_setValue('baiduTokenExpiry', 0);
                utils.showAlert('百度OCR API密钥已保存', 'success');
            });
        },

        // 打开物料管理面板
        openMaterialPanel() {
            let overlay = document.getElementById('material-helper-overlay');
            if (!overlay) {
                // 创建面板（创建时会自动显示）
                this.createPanel(true);
                overlay = document.getElementById('material-helper-overlay');
            } else {
                // 如果面板已存在，直接显示
                overlay.style.display = 'flex';
            }
        },

        // 打开比价表生成工具
        openComparisonTool() {
            // 直接选择数据文件
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.xls,.xlsx';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.processComparisonFile(file);
                }
            };
            input.click();
        },

        // 处理比价表文件
        processComparisonFile(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, {type: 'array'});
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(sheet, {header: 1});

                    const result = generateComparisonData(jsonData);
                    downloadComparisonExcel(result);
                    alert(`生成成功！共导入 ${result.dataCount} 条数据，${result.supplierCount} 家供应商`);
                } catch (err) {
                    alert('处理失败: ' + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        },

        // 创建主面板
        createPanel(autoShow = false) {
            // 如果已经存在遮罩层，直接返回
            const existingOverlay = document.getElementById('material-helper-overlay');
            if (existingOverlay) {
                if (autoShow) {
                    existingOverlay.style.display = 'flex';
                }
                return { panel: existingOverlay.querySelector('#material-helper-panel'), overlay: existingOverlay };
            }

            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.id = 'material-helper-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9998;
                display: none;
                align-items: center;
                justify-content: center;
            `;

            const panel = document.createElement('div');
            panel.id = 'material-helper-panel';
            panel.style.cssText = `
                position: relative;
                width: 90%;
                max-width: 900px;
                max-height: 90vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                z-index: 9999;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            `;

            panel.innerHTML = `
                <div style="background: linear-gradient(135deg, #22588D 0%, #1B4370 100%); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 600;">集采助手</h3>
                    <button id="helper-close-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;">×</button>
                </div>
                <div style="padding: 24px; overflow-y: auto; flex: 1;">
                    <div id="helper-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e9ecef;">
                        <button class="tab-btn active" data-tab="entry" style="flex: 1; padding: 10px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px;">手动录入</button>
                        <button class="tab-btn" data-tab="batch" style="flex: 1; padding: 10px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px;">批量导入</button>
                        <button class="tab-btn" data-tab="history" style="flex: 1; padding: 10px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px;">提交历史</button>
                    </div>

                    <div id="tab-entry" class="tab-content">
                        <form id="material-entry-form">
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-size: 13px; color: #555;">物料名称 *</label>
                                <input type="text" id="input-materialname" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-size: 13px; color: #555;">规格 *（最多300字符）</label>
                                <div style="position: relative;">
                                    <input type="text" id="input-specification" required maxlength="300" style="width: 100%; padding: 8px 60px 8px 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                                    <span id="spec-count" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #999;">0/300</span>
                                </div>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-size: 13px; color: #555;">单位 *</label>
                                <input type="text" id="input-unit" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-size: 13px; color: #555;">物料类别代码 *</label>
                                <div style="display: flex; gap: 5px;">
                                    <input type="text" id="input-classcode" required style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                                    <button type="button" id="btn-select-class" style="padding: 8px 15px; background: #3C7AC4; color: white; border: none; border-radius: 4px; cursor: pointer;">选择</button>
                                </div>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-size: 13px; color: #555;">物料类别ID *</label>
                                <input type="text" id="input-classid" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button type="submit" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">提交物料</button>
                                <button type="button" id="btn-reset" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">重置</button>
                            </div>
                        </form>
                    </div>

                    <div id="tab-batch" class="tab-content" style="display: none;">
                        <div style="margin-bottom: 15px;">
                            <div style="display: flex; gap: 10px;">
                                <button id="btn-upload-excel" style="flex: 1; padding: 10px; background: #3C7AC4; color: white; border: none; border-radius: 4px; cursor: pointer;">上传Excel导入</button>
                                <button id="btn-download-template" style="flex: 1; padding: 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">下载导入模板</button>
                            </div>
                            <input type="file" id="batch-file-input" accept=".xlsx,.xls" style="display: none;">
                            <div style="margin-top: 8px; font-size: 12px; color: #666;">
                                <p style="margin: 5px 0;">Excel格式要求：</p>
                                <ul style="margin: 5px 0; padding-left: 20px;">
                                    <li>列名：物料名称、物料规格、单位、物料类别代码、物料类别ID</li>
                                    <li>规格最多300字符，超出会自动截断</li>
                                </ul>
                            </div>
                        </div>
                            </div>

                    <div id="tab-history" class="tab-content" style="display: none;">
                        <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                            <strong style="color: #22588D;">最近提交记录</strong>
                            <div style="display: flex; gap: 8px;">
                                <button id="btn-export-history" style="padding: 6px 12px; border: 1px solid #22588D; background: #22588D; color: white; border-radius: 4px; cursor: pointer; font-size: 12px;">导出历史</button>
                                <button id="btn-clear-history" style="padding: 6px 12px; border: 1px solid #e0e4ec; background: #fff; border-radius: 4px; cursor: pointer; font-size: 12px; color: #495057;">清空历史</button>
                        </div>
                        </div>
                        <div id="history-list" style="max-height: 500px; overflow-y: auto; border: 1px solid #e5e9f2; border-radius: 6px; padding: 10px; background: #fdfdfd;">
                            <div style="text-align: center; color: #999; padding: 30px 0;">暂无提交记录</div>
                        </div>
                    </div>

                    <div id="helper-status" style="margin-top: 15px; padding: 10px; border-radius: 4px; display: none;"></div>
                </div>
            `;

            overlay.appendChild(panel);
            // 先绑定事件，再插入 DOM，确保事件绑定完成
            this.bindEvents(panel, overlay);

            // 点击遮罩层关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closePanel();
                }
            });

            // 插入到 DOM
            document.body.appendChild(overlay);

            // 如果需要自动显示，立即显示
            if (autoShow) {
                // 使用 setTimeout(0) 确保 DOM 完全插入后再显示
                setTimeout(() => {
                    overlay.style.display = 'flex';
                }, 0);
            }

            return { panel, overlay };
        },

        // 显示弹窗
        showPanel() {
            const overlay = document.getElementById('material-helper-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }
        },

        // 关闭弹窗
        closePanel() {
            const overlay = document.getElementById('material-helper-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        },

        // 绑定事件
        bindEvents(panel, overlay) {
            // 关闭按钮
            panel.querySelector('#helper-close-btn').addEventListener('click', () => {
                this.closePanel();
            });

            // 标签切换
            panel.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    panel.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    panel.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
                    btn.classList.add('active');
                    document.getElementById(`tab-${btn.dataset.tab}`).style.display = 'block';
                    if (btn.dataset.tab === 'history') {
                        historyManager.renderHistoryList();
                    }
                });
            });

            // 规格字符计数
            const specInput = panel.querySelector('#input-specification');
            const specCount = panel.querySelector('#spec-count');
            if (specInput && specCount) {
                specInput.addEventListener('input', () => {
                    const len = specInput.value.length;
                    specCount.textContent = `${len}/300`;
                    specCount.style.color = len > 270 ? (len >= 300 ? '#dc3545' : '#ff9800') : '#999';
                });
            }

            // 表单提交
            panel.querySelector('#material-entry-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit();
            });

            // 重置按钮
            panel.querySelector('#btn-reset').addEventListener('click', () => {
                panel.querySelector('#material-entry-form').reset();
                specCount.textContent = '0/300';
            });

            // Excel文件上传
            const fileInput = panel.querySelector('#batch-file-input');
            const uploadButton = panel.querySelector('#btn-upload-excel');
            const downloadButton = panel.querySelector('#btn-download-template');

            uploadButton.addEventListener('click', () => {
                fileInput.click();
            });
            fileInput.addEventListener('change', async (e) => {
                await this.handleExcelUpload(e.target.files[0]);
            });
            downloadButton.addEventListener('click', async () => {
                await utils.downloadTemplate();
            });

            const clearHistoryBtn = panel.querySelector('#btn-clear-history');
            if (clearHistoryBtn) {
                clearHistoryBtn.addEventListener('click', () => {
                    historyManager.clearHistory();
                    historyManager.renderHistoryList();
                    utils.showAlert('提交历史已清空', 'success');
                });
            }

            const exportHistoryBtn = panel.querySelector('#btn-export-history');
            if (exportHistoryBtn) {
                exportHistoryBtn.addEventListener('click', () => {
                    this.exportHistory();
                });
            }

            // 类别选择
            panel.querySelector('#btn-select-class').addEventListener('click', () => {
                this.showClassPicker();
            });

            historyManager.renderHistoryList();
        },

        // 导出提交历史
        async exportHistory() {
            try {
                const history = historyManager.getHistory();
                if (!history || history.length === 0) {
                    utils.showAlert('没有可导出的历史记录', 'info');
                    return;
                }

                // 获取 XLSX 库
                let XLSXLib = (typeof XLSX !== 'undefined' && XLSX)
                    || (typeof unsafeWindow !== 'undefined' && unsafeWindow.XLSX)
                    || (typeof window !== 'undefined' && window.XLSX);

                if (!XLSXLib) {
                    XLSXLib = await ensureXLSXReady();
                }

                if (!XLSXLib || !XLSXLib.utils || typeof XLSXLib.utils.aoa_to_sheet !== 'function') {
                    throw new Error('XLSX 库尚未就绪，请刷新页面后重试');
                }

                // 准备表头和数据
                const header = ['提交时间', '状态', '物料名称', '规格', '单位', '类别代码', '类别ID', '物料编码', 'GJC编码', '来源', '备注'];
                const statusMap = {
                    success: '成功',
                    duplicate: '已存在',
                    error: '失败',
                };

                const rows = history.map(item => [
                    utils.formatDateTime(item.timestamp) || '-',
                    statusMap[item.status] || item.status || '-',
                    item.materialname || '-',
                    item.specification || '-',
                    item.unit || '-',
                    item.materialclasscode || '-',
                    item.materialclassid || '-',
                    item.materialcode || '-',
                    item.gjcmaterialcode || '-',
                    item.source === 'batch' ? '批量导入' : item.source === 'retry' ? '重试' : '手动录入',
                    item.message || '-',
                ]);

                const worksheetData = [header, ...rows];
                const worksheet = XLSXLib.utils.aoa_to_sheet(worksheetData);
                const workbook = XLSXLib.utils.book_new();
                XLSXLib.utils.book_append_sheet(workbook, worksheet, '提交历史');

                const filename = `物料提交历史_${new Date().toISOString().slice(0,10)}.xlsx`;

                // 使用 write 方法生成 ArrayBuffer，然后手动下载
                try {
                    const wbout = XLSXLib.write(workbook, { bookType: 'xlsx', type: 'array' });
                    if (!wbout || !(wbout instanceof ArrayBuffer || wbout instanceof Uint8Array)) {
                        throw new Error('生成 Excel 文件数据失败');
                    }

                    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    utils.showAlert(`已导出 ${history.length} 条历史记录`, 'success');
                } catch (writeError) {
                    // 如果 write 方法失败，尝试使用 writeFile
                    console.warn('使用 write 方法失败，尝试 writeFile:', writeError);
                    if (typeof XLSXLib.writeFile === 'function') {
                        XLSXLib.writeFile(workbook, filename);
                        utils.showAlert(`已导出 ${history.length} 条历史记录`, 'success');
                    } else {
                        throw new Error('无法生成 Excel 文件：write 和 writeFile 方法都不可用');
                    }
                }
            } catch (error) {
                console.error('导出历史失败:', error);
                utils.showAlert('导出历史失败：' + (error.message || '未知错误'), 'error');
            }
        },

        // 处理提交
        async handleSubmit() {
            const form = document.getElementById('material-entry-form');

            const formData = {
                materialname: utils.cleanSpecialChars(form.querySelector('#input-materialname').value.trim()),
                specification: utils.cleanSpecialChars(form.querySelector('#input-specification').value.trim()).substring(0, CONFIG.MAX_SPECIFICATION_LENGTH),
                unit: utils.cleanSpecialChars(form.querySelector('#input-unit').value.trim()),
                materialclasscode: form.querySelector('#input-classcode').value.trim(),
                materialclassid: form.querySelector('#input-classid').value.trim(),
            };

            if (!formData.materialname || !formData.specification || !formData.unit || !formData.materialclasscode || !formData.materialclassid) {
                utils.showAlert('请填写所有必填项', 'error');
                return;
            }

            try {
                // 获取物料编码
                formData.materialcode = await materialService.getMaterialCode(formData.materialclasscode);

                // 检查是否重复 - 重要：如果重复则不提交！
                const duplicates = await materialService.findDuplicateMaterials(formData);
                const exactMatch = materialService.getExactDuplicateMatch(formData, duplicates);
                if (exactMatch) {
                    const existingCode = exactMatch.gjcmaterialcode || exactMatch.materialcode || '';
                    const duplicateMessage = `⚠️ 检测到重复物料，已取消提交！\n\n物料已存在于系统中，物料编码：${existingCode}\n\n为避免重复数据，本次提交已自动取消。`;
                    historyManager.recordHistoryEntry(formData, 'duplicate', `物料已存在，编码：${existingCode}，已取消提交`, { source: 'manual', gjcmaterialcode: existingCode });
                    utils.showAlert(duplicateMessage, 'error');
                    // 显示更醒目的提示
                    const statusEl = document.getElementById('helper-status');
                    if (statusEl) {
                        statusEl.style.display = 'block';
                        statusEl.style.background = '#fff3cd';
                        statusEl.style.color = '#856404';
                        statusEl.style.border = '2px solid #ffc107';
                        statusEl.style.fontWeight = 'bold';
                        statusEl.innerHTML = `⚠️ <strong>重复物料检测</strong><br>物料已存在，编码：${existingCode}<br><span style="color: #dc3545;">已自动取消提交，不会重复创建！</span>`;
                    }
                    return; // 重要：直接返回，不继续提交
                }

                // 提交物料
                const result = await materialService.submitMaterial(formData);

                if (result.success) {
                    const newCode = result.data?.gjcmaterialcode || result.data?.materialcode || formData.materialcode;
                    historyManager.recordHistoryEntry(formData, 'success', '提交成功', { source: 'manual', gjcmaterialcode: newCode });
                    utils.showAlert('物料提交成功！', 'success');
                    form.reset();
                    document.querySelector('#spec-count').textContent = '0/300';
                } else {
                    historyManager.recordHistoryEntry(formData, 'error', result.message || '提交失败', { source: 'manual' });
                    utils.showAlert(result.message || '提交失败', 'error');
                }
            } catch (error) {
                historyManager.recordHistoryEntry(formData, 'error', error.message || '提交异常', { source: 'manual' });
                utils.showAlert('提交失败：' + error.message, 'error');
            }
        },

        // 处理Excel上传
        async handleExcelUpload(file) {
            if (!file) return;

            try {
                // 检查是否加载了xlsx库
                if (typeof XLSX === 'undefined') {
                    utils.showAlert('Excel解析库未加载，请刷新页面重试', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                        // 映射Excel列名到字段名
                        const columnMapping = {
                            '物料名称': 'materialname',
                            '物料规格': 'specification',
                            '规格': 'specification',
                            '单位': 'unit',
                            '物料类别代码': 'materialclasscode',
                            '类别代码': 'materialclasscode',
                            '物料类别ID': 'materialclassid',
                            '类别ID': 'materialclassid',
                        };

                        const materials = jsonData.map(row => {
                            const material = {};
                            for (const [excelCol, field] of Object.entries(columnMapping)) {
                                const value = row[excelCol];
                                if (value !== undefined && value !== null) {
                                    if (field === 'specification') {
                                        material[field] = String(value).substring(0, CONFIG.MAX_SPECIFICATION_LENGTH);
                                    } else {
                                        material[field] = utils.cleanSpecialChars(String(value));
                                    }
                                }
                            }
                            return material;
                        }).filter(m => m.materialname && m.specification && m.unit && m.materialclasscode && m.materialclassid);

                        if (materials.length === 0) {
                            utils.showAlert('Excel中没有有效的物料数据', 'error');
                            return;
                        }

                        // 显示预览
                        this.showBatchPreview(materials);
                    } catch (error) {
                        utils.showAlert('解析Excel失败：' + error.message, 'error');
                    }
                };
                reader.readAsArrayBuffer(file);
            } catch (error) {
                utils.showAlert('读取文件失败：' + error.message, 'error');
            }
        },

        // 检测Excel表格内部的重复（不调用API，仅检测名称、规格、单位）
        detectInternalDuplicates(materials) {
            const keyToIndices = new Map();
            materials.forEach((material, index) => {
                const name = utils.normalizeCompareText(material.materialname || '');
                const spec = utils.normalizeCompareText(material.specification || '');
                const unit = utils.normalizeCompareText(material.unit || '');
                const key = `${name}|${spec}|${unit}`;
                if (!key.trim()) return;
                if (!keyToIndices.has(key)) {
                    keyToIndices.set(key, []);
                }
                keyToIndices.get(key).push(index);
            });
            const duplicateGroups = [];
            keyToIndices.forEach(indices => {
                if (indices.length > 1) {
                    duplicateGroups.push([...indices]);
                }
            });
            return duplicateGroups;
        },

        buildInternalDuplicateMeta(materials) {
            const groups = this.detectInternalDuplicates(materials);
            const meta = new Map();
            groups.forEach((indices, groupIdx) => {
                const sorted = [...indices].sort((a, b) => a - b);
                const primaryIndex = sorted[0];
                const duplicates = sorted.filter(idx => idx !== primaryIndex);
                sorted.forEach(idx => {
                    meta.set(idx, {
                        groupId: groupIdx,
                        groupNumber: groupIdx + 1,
                        primaryIndex,
                        isPrimary: idx === primaryIndex,
                        duplicates
                    });
                });
            });
            return { groups, meta };
        },

        // 显示批量预览（弹窗确认）
        showBatchPreview(materials) {
            if (!materials || materials.length === 0) {
                utils.showAlert('没有可预览的物料数据', 'error');
                return;
            }

            const { meta, groups } = this.buildInternalDuplicateMeta(materials);
            this.internalDuplicateMeta = meta;
            this.internalDuplicateGroups = groups;

            this.batchMaterials = materials.map((material, index) => {
                const duplicateInfo = meta.get(index);
                if (duplicateInfo) {
                    if (duplicateInfo.isPrimary) {
                        return {
                            ...material,
                            _index: index,
                            _status: 'pending',
                            _message: `Excel重复组 #${duplicateInfo.groupNumber}，仅提交此条，其余 ${duplicateInfo.duplicates.length} 条将跳过`,
                            _internalGroupId: duplicateInfo.groupId,
                            _internalPrimary: true,
                            _internalPrimaryIndex: index
                        };
                    }
                    return {
                        ...material,
                        _index: index,
                        _status: 'internal-duplicate',
                        _message: `⚠️ Excel表格内重复，与第 ${duplicateInfo.primaryIndex + 1} 条相同，除非修改否则不会提交`,
                        _internalGroupId: duplicateInfo.groupId,
                        _internalPrimary: false,
                        _internalPrimaryIndex: duplicateInfo.primaryIndex
                    };
                }
                return {
                    ...material,
                    _index: index,
                    _status: 'pending',
                    _message: '',
                    _internalGroupId: null,
                    _internalPrimary: false,
                    _internalPrimaryIndex: null
                };
            });

            if (groups.length > 0) {
                const duplicateCount = this.batchMaterials.filter(m => m._status === 'internal-duplicate').length;
                utils.showAlert(
                    `检测到 Excel 表格内 ${groups.length} 组、共 ${duplicateCount} 条重复物料（名称 + 规格 + 单位相同）。系统将仅提交每组第一条，其余条目已标记为“Excel内重复”。如需提交，请修改后系统会自动重新检测。`,
                    'error'
                );
            }

            // 显示预览弹窗
            this.renderBatchPreviewModal();
        },

        recalculateInternalDuplicates() {
            if (!this.batchMaterials || this.batchMaterials.length === 0) return;
            const materialsSnapshot = this.batchMaterials.map(material => ({
                materialname: material.materialname,
                specification: material.specification,
                unit: material.unit
            }));
            const { meta, groups } = this.buildInternalDuplicateMeta(materialsSnapshot);
            this.internalDuplicateMeta = meta;
            this.internalDuplicateGroups = groups;

            this.batchMaterials.forEach((material, index) => {
                if (['success', 'error', 'duplicate', 'submitting'].includes(material._status)) {
                    return;
                }
                const duplicateInfo = meta.get(index);
                if (duplicateInfo) {
                    material._internalGroupId = duplicateInfo.groupId;
                    material._internalPrimary = duplicateInfo.isPrimary;
                    material._internalPrimaryIndex = duplicateInfo.primaryIndex;
                    if (duplicateInfo.isPrimary) {
                        this.updateBatchStatus(index, 'pending', `Excel重复组 #${duplicateInfo.groupNumber}，当前条目将作为代表提交`);
                    } else {
                        this.updateBatchStatus(index, 'internal-duplicate', `⚠️ Excel表格内重复，与第 ${duplicateInfo.primaryIndex + 1} 条相同，除非修改否则不会提交`);
                    }
                } else {
                    material._internalGroupId = null;
                    material._internalPrimary = false;
                    material._internalPrimaryIndex = null;
                    if (material._status === 'internal-duplicate') {
                        this.updateBatchStatus(index, 'pending', '已修改，可提交');
                    }
                }
            });
        },

        escapeHtml(text) {
            if (text === null || text === undefined) return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },

        renderBatchPreviewModal() {
            if (this.batchModal) {
                this.batchModal.remove();
            }

            const modal = document.createElement('div');
            modal.id = 'batch-preview-modal';
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.55);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            const content = document.createElement('div');
            content.style.cssText = `
                background: #fff;
                border-radius: 10px;
                padding: 20px;
                width: 80%;
                max-width: 900px;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 15px 40px rgba(0,0,0,0.2);
            `;

            content.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <h3 style="margin: 0; font-size: 18px; color: #1f3a5f;">批量导入预览（共 ${this.batchMaterials.length} 条）</h3>
                        <div style="font-size: 12px; color: #6c757d; margin-top: 4px;">
                            <span>请检查并修改数据，点击"确认提交"后将逐条检测服务器重复</span>
                        </div>
                    </div>
                    <button id="batch-modal-close" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #6c757d;">×</button>
                </div>
                <div style="flex: 1; overflow-y: auto; border: 1px solid #e5e9f2; border-radius: 8px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <thead>
                            <tr style="background: #f8fafc; color: #495057;">
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e9f2;">序号</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e9f2;">物料名称</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e9f2;">规格（可编辑）</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e9f2;">单位</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e9f2;">类别代码</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e9f2;">类别ID</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e9f2;">状态</th>
                            </tr>
                        </thead>
                        <tbody id="batch-modal-tbody"></tbody>
                    </table>
                </div>
                <div style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="batch-modal-cancel" style="padding: 8px 16px; border: 1px solid #ced4da; border-radius: 4px; background: white; cursor: pointer; color: #495057;">取消</button>
                    <button id="batch-modal-submit" style="padding: 8px 20px; border: none; border-radius: 4px; background: #22588D; color: white; cursor: pointer; font-weight: 500;">确认提交</button>
                </div>
            `;

            modal.appendChild(content);
            document.body.appendChild(modal);

            this.batchModal = modal;
            this.batchModalContent = content;
            this.renderBatchPreviewTable();
            this.bindBatchTableEvents();

            const closeModal = () => {
                if (this.isBatchSubmitting) return;
                this.closeBatchModal();
            };

            content.querySelector('#batch-modal-close').addEventListener('click', closeModal);
            content.querySelector('#batch-modal-cancel').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            content.querySelector('#batch-modal-submit').addEventListener('click', async () => {
                if (this.isBatchSubmitting) return;
                await this.handleBatchSubmit();
            });
        },

        renderBatchPreviewTable() {
            const tbody = document.getElementById('batch-modal-tbody');
            if (!tbody || !this.batchMaterials) return;

            tbody.innerHTML = this.batchMaterials.map((material, index) => `
                <tr id="batch-row-${index}" style="border-bottom: 1px solid #f1f3f5;">
                    <td style="padding: 8px;">${index + 1}</td>
                    <td style="padding: 8px;">
                        <input data-index="${index}" data-field="materialname" value="${this.escapeHtml(material.materialname || '')}" style="width: 100%; padding: 6px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box;">
                    </td>
                    <td style="padding: 8px;">
                        <textarea data-index="${index}" data-field="specification" rows="2" style="width: 100%; min-height: 48px; resize: vertical; padding: 6px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box;">${this.escapeHtml(material.specification || '')}</textarea>
                        <div class="spec-counter" data-index="${index}" style="text-align: right; font-size: 11px; color: #888;">${(material.specification || '').length}/${CONFIG.MAX_SPECIFICATION_LENGTH}</div>
                    </td>
                    <td style="padding: 8px;">
                        <input data-index="${index}" data-field="unit" value="${this.escapeHtml(material.unit || '')}" style="width: 100%; padding: 6px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box;">
                    </td>
                    <td style="padding: 8px;">
                        <input data-index="${index}" data-field="materialclasscode" value="${this.escapeHtml(material.materialclasscode || '')}" style="width: 100%; padding: 6px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box;">
                    </td>
                    <td style="padding: 8px;">
                        <input data-index="${index}" data-field="materialclassid" value="${this.escapeHtml(material.materialclassid || '')}" style="width: 100%; padding: 6px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box;">
                    </td>
                    <td class="status-cell" style="padding: 8px; min-width: 160px;">
                        ${this.getStatusBadge(material._status, material._message)}
                        ${material._status === 'error' ? `<button data-index="${index}" class="retry-btn" style="margin-top: 6px; padding: 4px 10px; border: 1px solid #dc3545; background: #fff; color: #dc3545; border-radius: 4px; cursor: pointer;">重试</button>` : ''}
                        ${material._status === 'duplicate' ? `<div style="margin-top: 4px; font-size: 11px; color: #856404; font-weight: bold;">⚠️ 服务器重复，已自动跳过提交</div>` : ''}
                        ${material._status === 'internal-duplicate' ? `<div style="margin-top: 4px; font-size: 11px; color: #856404; font-weight: bold;">⚠️ Excel表格内重复，提交前会再次检测服务器</div>` : ''}
                    </td>
                    </tr>
                `).join('');
        },

        getStatusBadge(status, message = '') {
            const statusMap = {
                pending: { label: '待提交', bg: '#eef2f7', color: '#5c6c83' },
                submitting: { label: '提交中', bg: '#fff3cd', color: '#856404' },
                success: { label: '成功', bg: '#d4edda', color: '#155724' },
                duplicate: { label: '⚠️ 重复', bg: '#fff3cd', color: '#856404' },
                'internal-duplicate': { label: '⚠️ Excel内重复', bg: '#ffeaa7', color: '#856404' },
                error: { label: '失败', bg: '#f8d7da', color: '#721c24' },
            };
            const info = statusMap[status] || statusMap.pending;
            const isDuplicate = status === 'duplicate' || status === 'internal-duplicate';
            return `
                <div style="display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span style="padding: 2px 10px; border-radius: 999px; font-size: 11px; background: ${info.bg}; color: ${info.color}; font-weight: ${isDuplicate ? 'bold' : 'normal'}; border: ${isDuplicate ? '1px solid #ffc107' : 'none'};">
                        ${info.label}
                    </span>
                    ${message ? `<span style="font-size: 11px; color: ${isDuplicate ? '#856404' : '#6c757d'}; font-weight: ${isDuplicate ? 'bold' : 'normal'};">${message}</span>` : ''}
                </div>
            `;
        },

        updateBatchStatus(index, status, message = '') {
            if (!this.batchMaterials || !this.batchMaterials[index]) return;
            this.batchMaterials[index]._status = status;
            this.batchMaterials[index]._message = message;

            const row = document.getElementById(`batch-row-${index}`);
            if (row) {
                const statusCell = row.querySelector('.status-cell');
                if (statusCell) {
                    statusCell.innerHTML = this.getStatusBadge(status, message);
                    if (status === 'error') {
                        statusCell.innerHTML += `<button data-index="${index}" class="retry-btn" style="margin-top: 6px; padding: 4px 10px; border: 1px solid #dc3545; background: #fff; color: #dc3545; border-radius: 4px; cursor: pointer;">重试</button>`;
                    }
                    if (status === 'duplicate') {
                        statusCell.innerHTML += `<div style="margin-top: 4px; font-size: 11px; color: #856404; font-weight: bold;">⚠️ 服务器重复，已自动跳过提交</div>`;
                    }
                    if (status === 'internal-duplicate') {
                        statusCell.innerHTML += `<div style="margin-top: 4px; font-size: 11px; color: #856404; font-weight: bold;">⚠️ Excel表格内重复，提交前会再次检测服务器</div>`;
                    }
                }
            }
        },

        setBatchModalSubmittingState(isSubmitting) {
            this.isBatchSubmitting = isSubmitting;
            const submitBtn = document.getElementById('batch-modal-submit');
            const closeBtn = document.getElementById('batch-modal-close');
            const cancelBtn = document.getElementById('batch-modal-cancel');

            if (submitBtn) {
                submitBtn.disabled = isSubmitting;
                submitBtn.textContent = isSubmitting ? '提交中...' : '确认提交';
                submitBtn.style.opacity = isSubmitting ? '0.7' : '1';
            }
            [closeBtn, cancelBtn].forEach(btn => {
                if (btn) {
                    btn.disabled = isSubmitting;
                    btn.style.opacity = isSubmitting ? '0.6' : '1';
                    btn.style.cursor = isSubmitting ? 'not-allowed' : 'pointer';
                }
            });
        },

        closeBatchModal() {
            if (this.batchModal) {
                this.batchModal.remove();
                this.batchModal = null;
            }
            if (this.batchModalContent) {
                const tbody = this.batchModalContent.querySelector('#batch-modal-tbody');
                if (tbody) {
                    if (this.batchInputHandler) {
                        tbody.removeEventListener('input', this.batchInputHandler);
                    }
                    if (this.batchClickHandler) {
                        tbody.removeEventListener('click', this.batchClickHandler);
                    }
                }
            }
            this.batchModalContent = null;
            this.batchInputHandler = null;
            this.batchClickHandler = null;
            this.batchMaterials = null;
            this.isBatchSubmitting = false;
        },

        bindBatchTableEvents() {
            const tbody = document.getElementById('batch-modal-tbody');
            if (!tbody) return;

            if (this.batchInputHandler) {
                tbody.removeEventListener('input', this.batchInputHandler);
            }
            this.batchInputHandler = (e) => {
                const target = e.target;
                const field = target.dataset.field;
                if (!field || !Object.prototype.hasOwnProperty.call(target.dataset, 'index')) return;
                const index = Number(target.dataset.index);
                if (Number.isNaN(index) || !this.batchMaterials || !this.batchMaterials[index]) return;

                let value = target.value;
                if (field === 'specification') {
                    value = value.substring(0, CONFIG.MAX_SPECIFICATION_LENGTH);
                    target.value = value;
                    const counter = tbody.querySelector(`.spec-counter[data-index="${index}"]`);
                    if (counter) {
                        counter.textContent = `${value.length}/${CONFIG.MAX_SPECIFICATION_LENGTH}`;
                    }
                }
                this.batchMaterials[index][field] = utils.cleanSpecialChars(value);

                if (this.batchMaterials[index]._status !== 'submitting') {
                    this.updateBatchStatus(index, 'pending', '已修改待提交');
                }
                this.recalculateInternalDuplicates();
            };
            tbody.addEventListener('input', this.batchInputHandler);

            if (this.batchClickHandler) {
                tbody.removeEventListener('click', this.batchClickHandler);
            }
            this.batchClickHandler = (e) => {
                const retryBtn = e.target.closest('.retry-btn');
                if (retryBtn) {
                    const index = Number(retryBtn.dataset.index);
                    if (!Number.isNaN(index)) {
                        this.retryBatchItem(index);
                    }
                }
            };
            tbody.addEventListener('click', this.batchClickHandler);
        },

        async retryBatchItem(index) {
            if (!this.batchMaterials || !this.batchMaterials[index]) {
                utils.showAlert('没有可重试的条目', 'error');
                return;
            }

            const material = this.batchMaterials[index];
            this.updateBatchStatus(index, 'submitting');
            try {
                material.materialcode = await materialService.getMaterialCode(material.materialclasscode);
                // 检查是否重复 - 重要：如果重复则不提交！
                const duplicates = await materialService.findDuplicateMaterials(material);
                const exactMatch = materialService.getExactDuplicateMatch(material, duplicates);
                if (exactMatch) {
                    const existingCode = exactMatch.gjcmaterialcode || exactMatch.materialcode || '';
                    // 标记为重复，不提交
                    this.updateBatchStatus(index, 'duplicate', `⚠️ 重复物料，已跳过提交。编码：${existingCode}`);
                    utils.showAlert(`第 ${index + 1} 条检测到重复物料，已跳过提交。编码：${existingCode}`, 'error');
                    historyManager.recordHistoryEntry(material, 'duplicate', `重复物料，已跳过提交。编码：${existingCode}`, { source: 'batch-retry', gjcmaterialcode: existingCode });
                    return; // 重要：直接返回，不继续提交
                }
                const result = await materialService.submitMaterial(material);
                if (result.success) {
                    this.updateBatchStatus(index, 'success', '提交成功');
                    utils.showAlert(`第 ${index + 1} 条重试成功`, 'success');
                    const newCode = result.data?.gjcmaterialcode || result.data?.materialcode || material.materialcode;
                    historyManager.recordHistoryEntry(material, 'success', '重试成功', { source: 'batch-retry', gjcmaterialcode: newCode });
                } else {
                    this.updateBatchStatus(index, 'error', result.message || '提交失败');
                    historyManager.recordHistoryEntry(material, 'error', result.message || '提交失败', { source: 'batch-retry' });
                }
            } catch (error) {
                console.error(`重试第 ${index + 1} 条失败:`, error);
                this.updateBatchStatus(index, 'error', error.message || '网络异常');
                historyManager.recordHistoryEntry(material, 'error', error.message || '网络异常', { source: 'batch-retry' });
            }
        },

        // 处理批量提交
        async handleBatchSubmit() {
            if (!this.batchMaterials || this.batchMaterials.length === 0) {
                utils.showAlert('没有可提交的物料数据', 'error');
                return;
            }

            let successCount = 0;
            let failCount = 0;
            let serverDuplicateCount = 0;
            let excelDuplicateCount = 0;
            const total = this.batchMaterials.length;

            this.setBatchModalSubmittingState(true);

            for (let i = 0; i < this.batchMaterials.length; i++) {
                const material = this.batchMaterials[i];

                if (material._status === 'internal-duplicate' && !material._internalPrimary) {
                    excelDuplicateCount++;
                    const message = material._internalPrimaryIndex !== null && material._internalPrimaryIndex !== undefined
                        ? `⚠️ Excel表格内重复，与第 ${material._internalPrimaryIndex + 1} 条相同，已跳过提交`
                        : '⚠️ Excel表格内重复，已跳过提交';
                    this.updateBatchStatus(i, 'internal-duplicate', message);
                    historyManager.recordHistoryEntry(material, 'duplicate', 'Excel表格内重复，未提交', { source: 'batch-excel-duplicate' });
                    continue;
                }

                this.updateBatchStatus(i, 'submitting');

                try {
                    // 获取物料编码（提交前必须获取）
                    material.materialcode = await materialService.getMaterialCode(material.materialclasscode);

                    // 提交前通过API检测是否与服务器上的物料重复
                    // 检测条件：名称、规格（相似度高）、单位、类别代码、类别ID都一样的
                    const duplicates = await materialService.findDuplicateMaterials(material);
                    const exactMatch = materialService.getExactDuplicateMatch(material, duplicates);

                    if (exactMatch) {
                        // 如果找到重复的，获取该重复物料的编码
                        const existingCode = exactMatch.gjcmaterialcode || exactMatch.materialcode || '';
                        serverDuplicateCount++;
                        // 重复物料不计入成功数，标记为重复状态
                        this.updateBatchStatus(i, 'duplicate', `⚠️ 服务器重复，已跳过提交。编码：${existingCode}`);
                        historyManager.recordHistoryEntry(material, 'duplicate', `服务器重复物料，已跳过提交。编码：${existingCode}`, { source: 'batch', gjcmaterialcode: existingCode });
                        continue; // 重要：跳过，不提交
                    }

                    // 如果没有重复，则新增提交
                    const result = await materialService.submitMaterial(material);
                    if (result.success) {
                        successCount++;
                        this.updateBatchStatus(i, 'success', '提交成功');
                        const newCode = result.data?.gjcmaterialcode || result.data?.materialcode || material.materialcode;
                        historyManager.recordHistoryEntry(material, 'success', '提交成功', { source: 'batch', gjcmaterialcode: newCode });
                    } else {
                        failCount++;
                        this.updateBatchStatus(i, 'error', result.message || '提交失败');
                        historyManager.recordHistoryEntry(material, 'error', result.message || '提交失败', { source: 'batch' });
                    }
                    await new Promise(resolve => setTimeout(resolve, 400)); // 延迟避免请求过快
                } catch (error) {
                    failCount++;
                    console.error(`提交第 ${i + 1} 条物料失败:`, error);
                    this.updateBatchStatus(i, 'error', error.message || '网络异常');
                    historyManager.recordHistoryEntry(material, 'error', error.message || '网络异常', { source: 'batch' });
                }
            }

            this.setBatchModalSubmittingState(false);

            let summaryMessage = `批量提交完成：成功 ${successCount} 条`;
            const duplicateSummaryParts = [];
            if (excelDuplicateCount > 0) {
                duplicateSummaryParts.push(`Excel重复 ${excelDuplicateCount} 条`);
            }
            if (serverDuplicateCount > 0) {
                duplicateSummaryParts.push(`服务器重复 ${serverDuplicateCount} 条`);
            }
            if (duplicateSummaryParts.length > 0) {
                summaryMessage += `，⚠️ ${duplicateSummaryParts.join('，')}（已自动跳过，未提交）`;
            }
            if (failCount > 0) {
                summaryMessage += `，失败 ${failCount} 条`;
            }

            // 如果有重复，使用警告样式
            const alertType = duplicateSummaryParts.length > 0 || failCount > 0 ? 'error' : (successCount > 0 ? 'success' : 'error');
            utils.showAlert(summaryMessage, alertType);

            const fileInput = document.getElementById('batch-file-input');
            if (fileInput) {
                fileInput.value = '';
            }

            if (successCount === total) {
                // 所有提交成功，可允许直接关闭
                this.isBatchSubmitting = false;
            }
        },

        // 显示类别选择器（懒加载树形结构）
        async showClassPicker() {
            try {
                // 创建类别选择弹窗
                const modal = document.createElement('div');
                modal.id = 'class-picker-modal';
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                const content = document.createElement('div');
                content.style.cssText = `
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow: hidden;
                    width: 90%;
                    display: flex;
                    flex-direction: column;
                `;

                content.innerHTML = `
                    <h3 style="margin: 0 0 15px 0;">选择物料类别</h3>
                    <div id="class-tree-container" style="flex: 1; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px; min-height: 300px;">
                        <div style="text-align: center; padding: 20px; color: #999;">正在加载...</div>
                    </div>
                    <button id="class-picker-close" style="margin-top: 15px; padding: 8px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; align-self: flex-end;">关闭</button>
                `;

                modal.appendChild(content);
                document.body.appendChild(modal);

                // 关闭按钮
                content.querySelector('#class-picker-close').addEventListener('click', () => {
                    modal.remove();
                });

                // 点击背景关闭
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });

                // 加载根类别
                await this.loadClassTree(content.querySelector('#class-tree-container'), '-1', 0);
            } catch (error) {
                utils.showAlert('加载类别失败：' + error.message, 'error');
            }
        },

        // 加载类别树（懒加载）
        async loadClassTree(container, parentId, level = 0) {
            try {
                const classes = await materialService.queryMaterialClasses(parentId);

                if (classes.length === 0) {
                    container.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">暂无类别</div>';
                    return;
                }

                let html = '';
                classes.forEach(cls => {
                    const code = cls.materialclasscode || cls.code || '';
                    const id = cls.materialclassid || cls.id || '';
                    const name = cls.materialclassname || cls.name || '';
                    const hasChildren = materialService.hasChildren(cls);
                    const indent = level * 20;
                    const nodeId = `class-node-${id || code || Math.random()}`;

                    if (code && id) {
                        html += `
                            <div class="class-tree-node" data-node-id="${nodeId}" data-class-id="${id}" data-class-code="${code}"
                                 style="padding: 8px; margin: 2px 0; border-radius: 4px; cursor: pointer; padding-left: ${indent + 8}px;"
                                 onmouseover="this.style.background='#f5f5f5'"
                                 onmouseout="this.style.background=''">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    ${hasChildren ? `
                                        <span class="expand-icon" data-expanded="false" data-parent-id="${id}"
                                              style="width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #ddd; border-radius: 2px; cursor: pointer; font-size: 12px; user-select: none;">
                                            ▶
                                        </span>
                                    ` : '<span style="width: 16px; display: inline-block;"></span>'}
                                    <span class="class-name" style="flex: 1; font-weight: ${level === 0 ? '600' : 'normal'};">
                                        ${name || code}
                                    </span>
                                    <small style="color: #999; font-size: 11px;">${code}</small>
                                </div>
                                ${hasChildren ? `<div class="class-children" data-parent-id="${id}" style="display: none; margin-top: 5px;"></div>` : ''}
                            </div>
                        `;
                    }
                });

                container.innerHTML = html;

                // 绑定点击事件
                container.querySelectorAll('.class-tree-node').forEach(node => {
                    const classId = node.dataset.classId;
                    const classCode = node.dataset.classCode;
                    const className = node.querySelector('.class-name').textContent;

                    // 点击节点选择
                    node.querySelector('.class-name').addEventListener('click', () => {
                        document.querySelector('#input-classcode').value = classCode;
                        document.querySelector('#input-classid').value = classId;
                        document.getElementById('class-picker-modal').remove();
                        utils.showAlert(`已选择：${className}`, 'success');
                    });

                    // 点击展开/折叠
                    const expandIcon = node.querySelector('.expand-icon');
                    if (expandIcon) {
                        expandIcon.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            const isExpanded = expandIcon.dataset.expanded === 'true';
                            const childrenContainer = node.querySelector('.class-children');

                            if (!isExpanded) {
                                // 展开：加载子节点
                                expandIcon.textContent = '▼';
                                expandIcon.dataset.expanded = 'true';
                                childrenContainer.style.display = 'block';
                                childrenContainer.innerHTML = '<div style="padding: 10px; color: #999; text-align: center;">加载中...</div>';

                                await this.loadClassTree(childrenContainer, classId, level + 1);
                            } else {
                                // 折叠：隐藏子节点
                                expandIcon.textContent = '▶';
                                expandIcon.dataset.expanded = 'false';
                                childrenContainer.style.display = 'none';
                            }
                        });
                    }
                });
            } catch (error) {
                container.innerHTML = `<div style="text-align: center; padding: 20px; color: #dc3545;">加载失败：${error.message}</div>`;
            }
        }
    };

    // 独立的比价表生成函数（不依赖UI对象）
    function generateComparisonData(data) {
        console.log('=== 开始生成比价表数据 ===');
        console.log('总行数:', data.length);
        console.log('第一行列数:', data[0].length);
        console.log('最后5行第一列内容:');
        for (let i = Math.max(0, data.length - 5); i < data.length; i++) {
            console.log(`第${i}行:`, data[i] ? data[i][0] : 'undefined');
        }

        const colCount = data[0].length;
        const isNewFormat = colCount === 40;

        let supplierCols, namCol, specCol, unitCol, qtyCol;
        if (isNewFormat) {
            supplierCols = [12, 21, 30];
            [namCol, specCol, unitCol, qtyCol] = [4, 5, 9, 11];
        } else {
            supplierCols = [11, 20, 29];
            [namCol, specCol, unitCol, qtyCol] = [2, 3, 4, 6];
        }

        const suppliers = supplierCols.map(col => data[0][col]).filter(s => s);

        // 从第3行提取税率信息（列R=17, AA=26, AJ=35）
        const taxRates = [];
        const taxRateCols = isNewFormat ? [17, 26, 35] : [16, 25, 34]; // 根据格式调整列位置

        if (data.length > 2) {
            const taxRow = data[2]; // 第3行（索引2）
            taxRateCols.forEach((col, idx) => {
                const taxInfo = taxRow[col] || '含税9%';
                taxRates.push(taxInfo);
                console.log(`供应商${idx+1}税率 (列${col}):`, taxInfo);
            });
        }
        console.log('提取的税率:', taxRates);

        const rows = [];

        for (let i = 2; i < data.length; i++) {
            const row = data[i];
            // 跳过备注行和合计行
            if (!row[0] || row[0].toString().includes('备注') || row[0].toString().includes('合计')) continue;

            const baseData = [row[0], row[namCol], row[specCol], row[unitCol], row[qtyCol]];
            supplierCols.forEach(col => {
                baseData.push(row[col + 2], row[col + 4]);
            });
            rows.push(baseData);
        }

        const headers = ['序号', '物料名称', '型号规格', '单位', '数量'];
        suppliers.forEach(s => headers.push(`${s}-单价`, `${s}-合价`));

        return {
            headers,
            rows,
            suppliers,
            taxRates: taxRates.length > 0 ? taxRates : suppliers.map(() => '含税9%'), // 如果没找到税率，使用默认值
            dataCount: rows.length,
            supplierCount: suppliers.length
        };
    }

    function downloadComparisonExcel(result) {
        // 构建表头：第一行是基础列+供应商名称（每个占2列）
        const headerRow1 = ['序号', '物料名称', '型号规格', '单位', '数量'];
        result.suppliers.forEach(supplier => {
            headerRow1.push(supplier, '');
        });

        // 第二行：基础列为空+每个供应商下的"单价"和"合价"
        const headerRow2 = ['', '', '', '', ''];
        result.suppliers.forEach(() => {
            headerRow2.push('单价', '合价');
        });

        // 备注行 - 使用从源数据提取的税率
        const remarksRow = ['备注', '', '', '', ''];
        result.suppliers.forEach((supplier, index) => {
            const taxRate = result.taxRates[index] || '含税9%';
            remarksRow.push(taxRate, '');
        });

        // 合计行 - 先用占位符，后面会替换为公式
        const dataStartRow = 5;
        const dataEndRow = 4 + result.rows.length;
        const totalRow = ['合计', '', '', '', ''];
        result.suppliers.forEach(() => {
            totalRow.push('', '__FORMULA__');
        });

        const ws_data = [
            ['工程招标比价表'],
            ['项目：金多多江门生产研发基地2#厂房5楼车间装修基配套工程项目部'],
            headerRow1,
            headerRow2,
            ...result.rows,
            remarksRow,
            totalRow
        ];

        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        // 设置合计行的公式
        const totalRowIndex = 4 + result.rows.length + 1; // 0-based
        result.suppliers.forEach((supplier, index) => {
            const colIndex = 5 + index * 2 + 1; // 合价列
            const excelCol = String.fromCharCode(65 + colIndex);
            const cellRef = XLSX.utils.encode_cell({r: totalRowIndex, c: colIndex});
            ws[cellRef] = {
                t: 'n',
                f: `SUM(${excelCol}${dataStartRow}:${excelCol}${dataEndRow})`
            };
        });

        // 添加边框样式
        const range = XLSX.utils.decode_range(ws['!ref']);
        const border = {
            top: {style: 'thin', color: {rgb: '000000'}},
            bottom: {style: 'thin', color: {rgb: '000000'}},
            left: {style: 'thin', color: {rgb: '000000'}},
            right: {style: 'thin', color: {rgb: '000000'}}
        };

        for (let R = range.s.r; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                const cellRef = XLSX.utils.encode_cell({r: R, c: C});
                if (!ws[cellRef]) ws[cellRef] = {t: 's', v: ''};
                if (!ws[cellRef].s) ws[cellRef].s = {};
                ws[cellRef].s.border = border;
            }
        }

        // 合并单元格
        const merges = [
            {s: {r: 0, c: 0}, e: {r: 0, c: headerRow1.length - 1}},
            {s: {r: 1, c: 0}, e: {r: 1, c: headerRow1.length - 1}}
        ];

        for (let i = 0; i < 5; i++) {
            merges.push({s: {r: 2, c: i}, e: {r: 3, c: i}});
        }

        for (let i = 0; i < result.suppliers.length; i++) {
            const col = 5 + i * 2;
            merges.push({s: {r: 2, c: col}, e: {r: 2, c: col + 1}});
        }

        ws['!merges'] = merges;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '比价表');

        const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary', cellStyles: true});

        const buf = new ArrayBuffer(wbout.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < wbout.length; i++) {
            view[i] = wbout.charCodeAt(i) & 0xFF;
        }

        const blob = new Blob([buf], {type: 'application/octet-stream'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '比价表_生成.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        if (document.getElementById('material-helper-btn')) {
            return;
        }

        const btn = document.createElement('button');
        btn.id = 'material-helper-btn';
        btn.innerHTML = '📦';
        btn.title = '集采助手';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #22588D 0%, #1B4370 100%);
            color: white;
            border: none;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(34, 88, 141, 0.3);
            z-index: 99999;
            transition: transform 0.2s, box-shadow 0.2s;
            pointer-events: auto;
        `;

        // 使用更直接的方式绑定点击事件
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('物料管理按钮被点击');
            try {
                // 直接使用UI对象
                if (typeof UI !== 'undefined' && UI && UI.toggleMenu) {
                    console.log('调用UI.toggleMenu');
                    UI.toggleMenu();
                } else {
                    console.error('UI对象未初始化，尝试延迟调用');
                    // 如果UI未初始化，尝试直接创建菜单
                    setTimeout(() => {
                        if (typeof UI !== 'undefined' && UI && UI.toggleMenu) {
                            console.log('延迟调用UI.toggleMenu');
                            UI.toggleMenu();
                        } else {
                            console.error('UI对象仍然未初始化');
                            // 尝试直接创建并显示菜单
                            if (typeof UI !== 'undefined' && UI && UI.showMenu) {
                                UI.showMenu();
                            }
                        }
                    }, 100);
                }
            } catch (error) {
                console.error('打开菜单失败:', error);
                console.error('错误堆栈:', error.stack);
            }
            return false;
        };

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.1)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });

        document.body.appendChild(btn);
        console.log('物料管理按钮已创建，ID:', btn.id);

        // 验证按钮是否真的可以点击
        setTimeout(() => {
            const testBtn = document.getElementById('material-helper-btn');
            if (testBtn) {
                console.log('按钮已添加到DOM，可以点击');
                // 测试点击事件
                testBtn.addEventListener('mousedown', () => {
                    console.log('按钮mousedown事件触发');
                });
            } else {
                console.error('按钮未找到！');
            }
        }, 100);
    }



    // 初始化
    function init() {
        // 初始化日期限制解除功能
        dateRestrictionRemover.init();

        // 初始化验证码自动识别功能
        const initCaptchaRecognition = () => {
            const captchaEnabled = GM_getValue('captchaAutoRecognizeEnabled', false);
            if (!captchaEnabled) return;

            const captchaImg = document.querySelector('#img_valid');
            const captchaInput = document.querySelector('#validatecode');

            if (captchaImg && captchaInput) {
                console.log('检测到登录页面验证码，准备自动识别');

                // 页面加载后自动识别
                setTimeout(() => captchaRecognizer.autoFillCaptcha(), 500);

                // 点击验证码图片刷新时，等待新图片加载完成后再识别
                let lastSrc = captchaImg.src;
                captchaImg.addEventListener('click', () => {
                    const checkNewImage = () => {
                        if (captchaImg.src !== lastSrc) {
                            lastSrc = captchaImg.src;
                            // 等待图片完全加载
                            if (captchaImg.complete) {
                                setTimeout(() => captchaRecognizer.autoFillCaptcha(), 200);
                            } else {
                                captchaImg.addEventListener('load', () => {
                                    setTimeout(() => captchaRecognizer.autoFillCaptcha(), 200);
                                }, { once: true });
                            }
                        } else {
                            // 如果src还没变化，继续等待
                            setTimeout(checkNewImage, 100);
                        }
                    };
                    setTimeout(checkNewImage, 50);
                });
            }
        };

        const initFunctions = () => {
            // 如果不在iframe中，创建悬浮按钮
            if (!isInIframe) {
                // 确保UI对象已定义
                if (typeof UI === 'undefined') {
                    console.error('UI对象未定义，延迟初始化');
                    setTimeout(initFunctions, 100);
                    return;
                }
                createFloatingButton();
            }

            // 初始化验证码识别
            initCaptchaRecognition();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initFunctions);
        } else {
            initFunctions();
        }
    }

    init();
    console.log('集采助手已加载（含日期限制解除、验证码自动识别及比价表生成功能）');
})();

