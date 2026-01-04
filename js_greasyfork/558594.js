// ==UserScript==
// @name         Form Save&Refill(Document Uploader) / 通用表单助手 (大文件加强版)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  利用 IndexedDB 支持大文件(图片/PDF)的保存与恢复。支持导出包含文件的 JSON 备份。
// @author       LantoXia
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/558594/Form%20SaveRefill%28Document%20Uploader%29%20%20%E9%80%9A%E7%94%A8%E8%A1%A8%E5%8D%95%E5%8A%A9%E6%89%8B%20%28%E5%A4%A7%E6%96%87%E4%BB%B6%E5%8A%A0%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558594/Form%20SaveRefill%28Document%20Uploader%29%20%20%E9%80%9A%E7%94%A8%E8%A1%A8%E5%8D%95%E5%8A%A9%E6%89%8B%20%28%E5%A4%A7%E6%96%87%E4%BB%B6%E5%8A%A0%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    // 单个文件最大限制 (字节)。建议设为 50MB (50 * 1024 * 1024)。
    // 注意：过大的文件在 JSON 序列化/反序列化时可能会导致浏览器卡顿。
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    const PAGE_KEY = `form_saver_v4_${window.location.host}${window.location.pathname}`;
    const DB_NAME = 'TM_FormSaver_DB';
    const STORE_NAME = 'page_data';

    // --- 1. 注册菜单 ---
    GM_registerMenuCommand("💾 保存表单 (支持大文件)", saveAction);
    GM_registerMenuCommand("♻️ 恢复表单", loadAction);
    GM_registerMenuCommand("⬇️ 导出备份 (含文件)", exportAction);
    GM_registerMenuCommand("📂 导入备份", importAction);


    // --- 2. IndexedDB 简易封装 (用于替代 LocalStorage) ---
    const dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME); // 简单的 key-value 存储
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e);
    });

    async function dbSet(key, val) {
        const db = await dbPromise;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.put(val, key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    async function dbGet(key) {
        const db = await dbPromise;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }


    // --- 3. 文件处理核心 ---

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // 转换为 Base64
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function base64ToFile(dataurl, filename) {
        if (!dataurl || !dataurl.startsWith('data:')) return null;
        try {
            const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while(n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type: mime});
        } catch(e) {
            console.error("文件解码失败:", e);
            return null;
        }
    }


    // --- 4. 业务逻辑 ---

    // 获取表单数据
    async function getFormData() {
        const formData = {};
        const inputs = document.querySelectorAll('input, select, textarea');
        let count = 0;
        let fileCount = 0;
        let skippedCount = 0;
        const promises = [];

        for (const el of inputs) {
            if (el.type === 'hidden' || el.type === 'submit' || el.disabled) continue;
            const key = el.name || el.id;
            if (!key) continue;

            if (el.type === 'file') {
                if (el.files && el.files.length > 0) {
                    const file = el.files[0];
                    if (file.size <= MAX_FILE_SIZE) {
                        // 异步读取文件
                        const p = fileToBase64(file).then(base64 => {
                            formData[key] = {
                                type: 'file_blob',
                                name: file.name,
                                content: base64,
                                size: file.size
                            };
                            fileCount++;
                            count++;
                        }).catch(err => console.error("读取文件失败", file.name, err));
                        promises.push(p);
                    } else {
                        // 超大文件只存名字
                        formData[key + '_filename_memo'] = file.name;
                        skippedCount++;
                        count++;
                    }
                }
            } else if (el.type === 'checkbox' || el.type === 'radio') {
                if (el.checked) {
                    formData[key] = el.value;
                    count++;
                }
            } else {
                if (el.value) {
                    formData[key] = el.value;
                    count++;
                }
            }
        }

        await Promise.all(promises);
        return { data: formData, count, fileCount, skippedCount };
    }

    // 恢复表单数据
    function restoreFormData(formData) {
        if (!formData) return { success: 0, files: [] };

        const inputs = document.querySelectorAll('input, select, textarea');
        let successCount = 0;
        let manualFiles = [];

        inputs.forEach(el => {
            const key = el.name || el.id;
            if (!key) return;

            // 1. 尝试恢复文件
            if (el.type === 'file') {
                if (formData[key] && formData[key].type === 'file_blob') {
                    // 完整恢复
                    try {
                        const f = formData[key];
                        const fileObj = base64ToFile(f.content, f.name);
                        if (fileObj) {
                            const dt = new DataTransfer();
                            dt.items.add(fileObj);
                            el.files = dt.files;
                            triggerEvent(el);
                            el.style.outline = "2px solid #2ecc71"; // 绿色成功
                            successCount++;
                            return;
                        }
                    } catch (e) {
                        console.error("恢复文件实体失败", e);
                    }
                }
                
                // 退路：大文件或旧数据提示
                const memoName = formData[key + '_filename_memo'];
                if (memoName) {
                    el.style.outline = "2px dashed #e74c3c"; // 红色警告
                    el.title = `请手动上传: ${memoName}`;
                    manualFiles.push(memoName);
                }
                return;
            }

            // 2. 恢复普通字段
            if (formData[key] !== undefined && typeof formData[key] !== 'object') {
                if (el.type === 'radio' || el.type === 'checkbox') {
                    if (el.value === formData[key]) {
                        el.checked = true;
                        triggerEvent(el);
                        successCount++;
                    }
                } else {
                    el.value = formData[key];
                    triggerEvent(el);
                    successCount++;
                }
            }
        });

        return { success: successCount, manualFiles };
    }


    // --- 5. 交互动作 ---

    async function saveAction() {
        showToast("⏳ 正在处理数据(含文件)...");
        try {
            const res = await getFormData();
            if (res.count === 0) {
                showToast("⚠️ 页面无数据");
                return;
            }
            // 存入 IndexedDB
            await dbSet(PAGE_KEY, res.data);
            
            let msg = `✅ 已保存 ${res.count} 项 (含 ${res.fileCount} 个文件)`;
            if (res.skippedCount > 0) msg += `\n⚠️ 跳过 ${res.skippedCount} 个超大文件(>50MB)`;
            showToast(msg);
        } catch (e) {
            console.error(e);
            showToast("❌ 保存失败: " + e.message);
        }
    }

    async function loadAction() {
        try {
            const data = await dbGet(PAGE_KEY);
            if (!data) {
                showToast("❌ 没有找到存档");
                return;
            }
            const res = restoreFormData(data);
            let msg = `♻️ 恢复 ${res.success} 项`;
            if (res.manualFiles.length > 0) {
                alert(`${msg}\n\n⚠️ 以下超大文件需手动上传：\n${res.manualFiles.join('\n')}`);
            } else {
                showToast(msg);
            }
        } catch (e) {
            showToast("❌ 读取失败");
        }
    }

    async function exportAction() {
        showToast("⏳ 正在打包文件，请稍候...");
        // 即使没有点过“保存”，直接导出也是实时的
        const res = await getFormData();
        if (res.count === 0) {
            showToast("⚠️ 无数据可导出");
            return;
        }

        const jsonStr = JSON.stringify(res.data);
        const blob = new Blob([jsonStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const sizeMB = (blob.size / 1024 / 1024).toFixed(2);
        a.download = `FullBackup_${window.location.hostname}_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showToast(`⬇️ 导出成功 (${sizeMB} MB)`);
    }

    function importAction() {
        let input = document.getElementById('tm_fs_import');
        if (!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.id = 'tm_fs_import';
            input.accept = '.json';
            input.style.display = 'none';
            input.addEventListener('change', async function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                showToast("⏳ 正在解析大文件...");
                const reader = new FileReader();
                reader.onload = function(evt) {
                    try {
                        const data = JSON.parse(evt.target.result);
                        const res = restoreFormData(data);
                        showToast(`✅ 导入成功: 恢复 ${res.success} 项`);
                    } catch (err) {
                        alert("JSON 解析失败: 文件可能已损坏或格式错误");
                    }
                };
                reader.readAsText(file);
                this.value = '';
            });
            document.body.appendChild(input);
        }
        input.click();
    }

    // --- 工具 ---
    function triggerEvent(el) {
        ['input', 'change', 'blur'].forEach(evt => {
            el.dispatchEvent(new Event(evt, { bubbles: true }));
        });
    }

    function showToast(text) {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 100000;
            background: rgba(0,0,0,0.85); color: #fff; padding: 15px 25px;
            border-radius: 8px; font-size: 15px; font-family: sans-serif;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3); max-width: 80%;
        `;
        div.innerText = text;
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '0';
            div.style.transition = 'opacity 0.5s';
            setTimeout(() => div.remove(), 500);
        }, 3500);
    }
})();