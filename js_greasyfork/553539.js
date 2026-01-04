// ==UserScript==
// @name         Storage 复制工具
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在任何网页上复制和粘贴 localStorage 和 sessionStorage
// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_getClipboard
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-idle
// License: MIT
// @downloadURL https://update.greasyfork.org/scripts/553539/Storage%20%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/553539/Storage%20%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/**
 * ====================================
 * Storage 复制工具 - 使用说明
 * ====================================
 * 
 * 📖 功能介绍:
 * 这个脚本可以帮你在不同的网页之间复制和粘贴浏览器的存储数据（localStorage 和 sessionStorage）
 * 适用于开发调试、迁移登录状态、快速配置测试环境等场景
 * 
 * 🎯 使用方法:
 * 
 * 方法一：通过 Tampermonkey 菜单（推荐新手使用）
 * ├─ 点击浏览器右上角的 Tampermonkey 图标
 * ├─ 在弹出菜单中选择对应功能：
 * │  ├─ 📋 复制 Storage - 将当前页面的 Storage 复制到剪贴板
 * │  ├─ 📥 粘贴 Storage - 将之前复制的 Storage 粘贴到当前页面
 * │  ├─ 👀 查看 Storage - 在控制台查看当前页面的 Storage 内容
 * │  └─ 🗑️ 清空 Storage - 清空当前页面的 Storage（会二次确认）
 * 
 * 方法二：通过浏览器控制台（推荐开发者使用）
 * ├─ 按 F12 打开开发者工具，切换到 Console 标签
 * ├─ 直接输入以下命令：
 * │  ├─ copyStorage()    - 复制当前页面 Storage
 * │  ├─ pasteStorage()   - 粘贴 Storage
 * │  ├─ viewStorage()    - 查看当前 Storage
 * │  └─ clearStorage()   - 清空当前 Storage
 * 
 * 💡 典型使用场景:
 * 
 * 场景1：将生产环境的登录状态复制到测试环境
 * ├─ 1. 在生产环境页面 (https://prod.example.com)
 * │     执行 copyStorage() 或点击菜单"复制 Storage"
 * ├─ 2. 打开测试环境页面 (https://test.example.com)
 * │     执行 pasteStorage() 或点击菜单"粘贴 Storage"
 * └─ 3. 刷新页面，即可使用相同的登录状态
 * 
 * 场景2：备份当前页面的配置数据
 * ├─ 执行 copyStorage() 复制数据
 * ├─ 将剪贴板内容保存到文本文件
 * └─ 需要恢复时，复制文本内容并执行 pasteStorage()
 * 
 * 场景3：查看网站存储了哪些数据
 * └─ 执行 viewStorage() 在控制台以表格形式查看
 * 
 * ⚙️ 高级用法（通过 storageTools 对象）:
 * 
 * // 只复制 localStorage，不复制 sessionStorage
 * storageTools.copy({ 
 *   includeLocalStorage: true, 
 *   includeSessionStorage: false 
 * });
 * 
 * // 合并模式粘贴（不清空现有数据，只添加/覆盖）
 * storageTools.paste(data, { 
 *   merge: true,        // true: 合并模式, false: 清空后粘贴
 *   overwrite: true     // true: 覆盖相同key, false: 保留已存在的key
 * });
 * 
 * // 只清空 localStorage
 * storageTools.clear({ 
 *   clearLocalStorage: true, 
 *   clearSessionStorage: false 
 * });
 * 
 * ⚠️ 注意事项:
 * ├─ 1. 复制的数据仅在当前浏览器会话有效（关闭浏览器后剪贴板会被清空）
 * ├─ 2. sessionStorage 只在当前标签页有效，关闭标签页后会丢失
 * ├─ 3. 默认粘贴模式会清空目标页面的现有 Storage，请谨慎使用
 * ├─ 4. 某些网站可能对 Storage 有特殊验证，粘贴后可能需要刷新页面
 * └─ 5. 跨域限制：Storage 数据是按域名隔离的，但此工具可以跨域复制粘贴
 * 
 * 🔧 技术细节:
 * ├─ 使用 GM_setClipboard API 进行剪贴板操作（更可靠）
 * ├─ 提供多层备用方案确保兼容性
 * ├─ 数据以 JSON 格式存储和传输
 * └─ 支持所有网站
 * 
 * 📝 版本信息:
 * Version: 1.0.0
 * Author: Full-Stack Developer
 * License: MIT
 * 
 * ====================================
 */

(function() {
    'use strict';

    // 等待页面加载完成后再挂载全局函数
    function initStorageTools() {

    /**
     * 复制当前页面的 Storage 到剪贴板
     * 
     * @param {Object} options - 配置选项
     * @param {boolean} options.includeLocalStorage - 是否包含 localStorage，默认 true
     * @param {boolean} options.includeSessionStorage - 是否包含 sessionStorage，默认 true
     * 
     * @example
     * // 复制所有 Storage（默认行为）
     * copyStorage();
     * 
     * @example
     * // 只复制 localStorage
     * copyStorage({ includeLocalStorage: true, includeSessionStorage: false });
     * 
     * @example
     * // 只复制 sessionStorage
     * copyStorage({ includeLocalStorage: false, includeSessionStorage: true });
     */
    function copyStorage(options = {}) {
        const {
            includeLocalStorage = true,
            includeSessionStorage = true
        } = options;

        const data = {};

        try {
            // 复制 localStorage
            if (includeLocalStorage) {
                data.localStorage = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    data.localStorage[key] = localStorage.getItem(key);
                }
            }

            // 复制 sessionStorage
            if (includeSessionStorage) {
                data.sessionStorage = {};
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    data.sessionStorage[key] = sessionStorage.getItem(key);
                }
            }

            // 生成可执行的代码
            const code = `pasteStorage(${JSON.stringify(data, null, 2)})`;

            // 使用 Tampermonkey 的 GM_setClipboard API
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(code);
                console.log('✅ Storage 已复制到剪贴板（Tampermonkey）！');
                console.log(`📦 localStorage 项目: ${Object.keys(data.localStorage || {}).length}`);
                console.log(`📦 sessionStorage 项目: ${Object.keys(data.sessionStorage || {}).length}`);
                console.log('💡 在目标页面的 console 中执行 pasteStorage() 或直接粘贴即可');
                console.log('✅ Storage 已复制到剪贴板！\n\n可以在其他页面使用了。');
                return;
            }

            // 备用方案
            useFallbackCopy(code, data);

        } catch (error) {
            console.error('❌ 读取 Storage 失败:', error);
            console.log('❌ 读取 Storage 失败: ' + error.message);
        }
    }

    /**
     * 备用复制方案 - 使用传统的 document.execCommand
     * 当 GM_setClipboard 不可用时自动调用
     * 
     * @param {string} code - 要复制的代码字符串
     * @param {Object} data - Storage 数据对象
     * @private
     */
    function useFallbackCopy(code, data) {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.log('✅ Storage 已复制到剪贴板（兼容模式）！');
                console.log(`📦 localStorage 项目: ${Object.keys(data.localStorage || {}).length}`);
                console.log(`📦 sessionStorage 项目: ${Object.keys(data.sessionStorage || {}).length}`);
                console.log('✅ Storage 已复制到剪贴板！');
            } else {
                showManualCopy(code, data);
            }
        } catch (err) {
            showManualCopy(code, data);
        } finally {
            document.body.removeChild(textarea);
        }
    }

    /**
     * 显示手动复制提示
     * 当所有自动复制方案都失败时调用
     * 
     * @param {string} code - 要复制的代码字符串
     * @param {Object} data - Storage 数据对象
     * @private
     */
    function showManualCopy(code, data) {
        console.log('%c⚠️  自动复制失败，请手动复制以下代码:', 'color: orange; font-weight: bold');
        console.log(`📦 localStorage 项目: ${Object.keys(data.localStorage || {}).length}`);
        console.log(`📦 sessionStorage 项目: ${Object.keys(data.sessionStorage || {}).length}`);
        console.log('%c📋 点击下方代码，Ctrl+A 全选，Ctrl+C 复制:', 'color: #4CAF50; font-weight: bold');
        console.log(code);

        window.__storageCode = code;
        console.log('%c💡 提示: 代码已保存到 window.__storageCode，可以直接复制', 'color: #2196F3');
        console.log('⚠️ 自动复制失败\n\n请打开控制台查看代码并手动复制');
    }


    /**
     * 将 Storage 数据粘贴到当前页面
     * 
     * @param {Object} data - Storage 数据对象
     * @param {Object} data.localStorage - localStorage 数据
     * @param {Object} data.sessionStorage - sessionStorage 数据
     * @param {Object} options - 配置选项
     * @param {boolean} options.merge - 是否合并模式（不清空现有数据），默认 false
     * @param {boolean} options.overwrite - 是否覆盖已存在的 key，默认 true
     * 
     * @example
     * // 通过菜单粘贴（会提示输入）
     * pasteStorage();
     * 
     * @example
     * // 直接传入数据对象粘贴（清空现有数据）
     * const data = {
     *   localStorage: { token: 'xxx', userId: '123' },
     *   sessionStorage: { tempData: 'yyy' }
     * };
     * pasteStorage(data);
     * 
     * @example
     * // 合并模式粘贴（保留现有数据，只添加/更新）
     * pasteStorage(data, { merge: true });
     * 
     * @example
     * // 合并模式且不覆盖已存在的 key
     * pasteStorage(data, { merge: true, overwrite: false });
     */
    function pasteStorage(data, options = {}) {
        const {
            merge = false,
            overwrite = true
        } = options;

        try {
            let localCount = 0;
            let sessionCount = 0;

            // 恢复 localStorage
            if (data.localStorage) {
                if (!merge) {
                    localStorage.clear();
                }

                for (const [key, value] of Object.entries(data.localStorage)) {
                    if (overwrite || !localStorage.getItem(key)) {
                        localStorage.setItem(key, value);
                        localCount++;
                    }
                }
            }

            // 恢复 sessionStorage
            if (data.sessionStorage) {
                if (!merge) {
                    sessionStorage.clear();
                }

                for (const [key, value] of Object.entries(data.sessionStorage)) {
                    if (overwrite || !sessionStorage.getItem(key)) {
                        sessionStorage.setItem(key, value);
                        sessionCount++;
                    }
                }
            }

            console.log('✅ Storage 已恢复！');
            console.log(`📦 localStorage 写入: ${localCount} 项`);
            console.log(`📦 sessionStorage 写入: ${sessionCount} 项`);
            console.log(`✅ Storage 已恢复！\n\nlocalStorage: ${localCount} 项\nsessionStorage: ${sessionCount} 项`);

        } catch (error) {
            console.error('❌ 恢复 Storage 失败:', error);
            console.log('❌ 恢复 Storage 失败: ' + error.message);
        }
    }


    /**
     * 清空当前页面的 Storage
     * 
     * @param {Object} options - 配置选项
     * @param {boolean} options.clearLocalStorage - 是否清空 localStorage，默认 true
     * @param {boolean} options.clearSessionStorage - 是否清空 sessionStorage，默认 true
     * 
     * @example
     * // 清空所有 Storage（默认行为）
     * clearStorage();
     * 
     * @example
     * // 只清空 localStorage
     * clearStorage({ clearLocalStorage: true, clearSessionStorage: false });
     * 
     * @example
     * // 只清空 sessionStorage
     * clearStorage({ clearLocalStorage: false, clearSessionStorage: true });
     */
    function clearStorage(options = {}) {
        const {
            clearLocalStorage = true,
            clearSessionStorage = true
        } = options;

        if (clearLocalStorage) {
            localStorage.clear();
            console.log('🗑️  localStorage 已清空');
        }

        if (clearSessionStorage) {
            sessionStorage.clear();
            console.log('🗑️  sessionStorage 已清空');
        }

        console.log('🗑️ Storage 已清空');
    }


    /**
     * 在控制台以表格形式查看当前页面的 Storage 内容
     * 
     * @example
     * // 查看所有 Storage
     * viewStorage();
     * 
     * 输出示例:
     * ┌─────────┬──────────────────┐
     * │ (index) │      Values      │
     * ├─────────┼──────────────────┤
     * │  token  │ 'eyJhbGc...'     │
     * │ userId  │ '12345'          │
     * └─────────┴──────────────────┘
     */
    function viewStorage() {
        console.log('📦 localStorage:');
        console.table(Object.fromEntries(
            Array.from({ length: localStorage.length }, (_, i) => {
                const key = localStorage.key(i);
                return [key, localStorage.getItem(key)];
            })
        ));

        console.log('📦 sessionStorage:');
        console.table(Object.fromEntries(
            Array.from({ length: sessionStorage.length }, (_, i) => {
                const key = sessionStorage.key(i);
                return [key, sessionStorage.getItem(key)];
            })
        ));

        console.log('📦 Storage 内容已输出到控制台');
    }


    // ========== 注册菜单命令 ==========
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('📋 复制 Storage', () => {
            copyStorage();
        });

        GM_registerMenuCommand('📥 粘贴 Storage', () => {
            const input = prompt('请粘贴之前复制的 Storage 数据:\n(格式: pasteStorage({...}) 或直接粘贴 JSON 对象)');
            if (input) {
                try {
                    // 尝试提取 JSON 数据
                    let data;
                    
                    // 匹配 pasteStorage({...}) 格式
                    const match = input.match(/pasteStorage\s*\(\s*(\{[\s\S]*\})\s*\)/);
                    if (match) {
                        data = JSON.parse(match[
  1
]);
                    } else {
                        // 直接解析为 JSON
                        data = JSON.parse(input);
                    }
                    
                    // 执行粘贴
                    pasteStorage(data);
                } catch (error) {
                    console.error('解析失败:', error);
                    console.log('❌ 数据格式错误\n\n请确保粘贴的是有效的 JSON 数据或 pasteStorage() 调用代码');
                }
            }
        });

        GM_registerMenuCommand('👀 查看 Storage', () => {
            viewStorage();
        });

        GM_registerMenuCommand('🗑️ 清空 Storage', () => {
            if (confirm('确定要清空当前页面的 Storage 吗？')) {
                clearStorage();
            }
        });
    }


    // ========== 挂载到全局对象 ==========
    window.storageTools = {
        copy: copyStorage,
        paste: pasteStorage,
        clear: clearStorage,
        view: viewStorage
    };

    // 单独挂载常用函数
    window.copyStorage = copyStorage;
    window.pasteStorage = pasteStorage;
    window.viewStorage = viewStorage;
    window.clearStorage = clearStorage;

    // 确保函数可以在控制台访问
    unsafeWindow.storageTools = window.storageTools;
    unsafeWindow.copyStorage = copyStorage;
    unsafeWindow.pasteStorage = pasteStorage;
    unsafeWindow.viewStorage = viewStorage;
    unsafeWindow.clearStorage = clearStorage;


    // ========== 初始化提示 ==========
    console.log(`
%c📦 Storage 复制工具已加载！

🎯 使用方法:

1️⃣  控制台命令:
   copyStorage()    - 复制当前页面 Storage
   pasteStorage()   - 粘贴 Storage（需要先复制）
   viewStorage()    - 查看当前 Storage
   clearStorage()   - 清空当前 Storage

2️⃣  右键菜单:
   点击 Tampermonkey 图标 → 选择对应功能

3️⃣  高级用法:
   storageTools.copy({ includeLocalStorage: true, includeSessionStorage: false })
   storageTools.paste(data, { merge: true, overwrite: false })

`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    }

    // 立即初始化
    initStorageTools();

    // 如果页面还未加载完成，在 DOMContentLoaded 时再次确保挂载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStorageTools);
    }

})();