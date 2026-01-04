// ==UserScript==
// @name         微博全平台-GM菜单复制链接（兼容 Base62 转换）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在微博详情页添加“复制原链接”菜单，自动将短链接（Base62）转换为完整的长数字微博 ID（MID）。
// @description:en Adds a "Copy Original Link" menu command to Weibo detail pages, automatically converting Base62 short links to the full 10-digit Weibo ID (MID) link. Optimized with a responsive Toast notification.
// @author       YFTree
// @homepage     https://github.com/YFTree
// @match        *weibo.c*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557051/%E5%BE%AE%E5%8D%9A%E5%85%A8%E5%B9%B3%E5%8F%B0-GM%E8%8F%9C%E5%8D%95%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%EF%BC%88%E5%85%BC%E5%AE%B9%20Base62%20%E8%BD%AC%E6%8D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557051/%E5%BE%AE%E5%8D%9A%E5%85%A8%E5%B9%B3%E5%8F%B0-GM%E8%8F%9C%E5%8D%95%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%EF%BC%88%E5%85%BC%E5%AE%B9%20Base62%20%E8%BD%AC%E6%8D%A2%EF%BC%89.meta.js
// ==/UserScript==
/* jshint esversion: 9 */

(function() {
    'use strict';

    // Base62 编码字符集
    const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const DICT = {};

    /**
     * 初始化 Base62 字典，将字符映射到对应数值
     * 确保字典仅在首次使用时初始化一次
     */
    function get_dict() {
        if (Object.keys(DICT).length === 0) {
            for (let index = 0; index < ALPHABET.length; index++) {
                DICT[ALPHABET[index]] = index;
            }
        }
    }

    /**
     * 将 4 位 Base62 字符串转换为十进制数值
     * @param {string} str_62 - 4位 Base62 字符串
     * @returns {number} 转换后的十进制数值
     */
    function key62_to_key10(str_62) {
        let value = 0;
        for (let i = 0; i < str_62.length; i++) {
            value = value * 62 + DICT[str_62[i]];
        }
        return value;
    }

    /**
     * 将 Base62 格式的短 MID (murl) 转换为长数字 MID
     * @param {string} murl - Base62 格式的微博 ID (如 "Fx64lD1")
     * @returns {string} 完整的长数字 MID
     */
    function murl_to_mid(murl) {
        if (!murl || murl.length === 0) return '';
        
        get_dict(); // 在转换前确保字典初始化

        let final_mid = '';
        let current_index = murl.length;

        // 从后往前每 4 位进行 Base62 转换
        while (current_index > 0) {
            const start = Math.max(0, current_index - 4);
            const end = current_index;
            const str_62 = murl.substring(start, end);
            
            const value = key62_to_key10(str_62);
            let str_value = String(value);

            const is_leftmost_group = (start === 0);

            // 除了最左边的一组，其余组必须补齐 7 位数字
            if (!is_leftmost_group && str_62.length === 4) {
                str_value = str_value.padStart(7, '0');
            }
            
            final_mid = str_value + final_mid;
            current_index -= 4;
        }
        return final_mid;
    }

    /**
     * 在屏幕底部固定位置显示 Toast 提示
     * @param {string} message - 提示信息内容
     * @param {boolean} isError - 是否为错误提示 (影响颜色)
     */
    function showToast(message, isError = false) {
        const toastId = 'weibo-mid-copy-toast';
        let toast = document.getElementById(toastId);

        if (!toast) {
            // 1. 创建 Toast DOM 元素
            toast = document.createElement('div');
            toast.id = toastId;
            toast.style.cssText = `
                position: fixed;
                padding: 10px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                color: white;
                font-size: 14px;
                z-index: 999999;
                opacity: 0;
                transition: opacity 0.3s, transform 0.3s;
                text-align: center;
                white-space: pre-wrap; /* 允许换行 */
                word-break: break-all;
                box-sizing: border-box;
                left: 50%;
                bottom: 15%; /* 固定在视口底部 15% 的位置 */
                transform: translate(-50%, 100px); /* 初始位置：隐藏在下方 */
                pointer-events: none; /* 不阻挡鼠标/触控事件 */
            `;
            
            // 2. 注入样式 (用于宽度和横竖屏适配)
            const style = document.createElement('style');
            style.textContent = `
                /* 默认/竖屏样式：占据 80% 宽度 */
                #${toastId} {
                    width: 80vw;
                    max-width: 400px;
                }

                /* 横屏样式：宽度减小，避免过宽 */
                @media (min-aspect-ratio: 1/1) {
                    #${toastId} {
                        width: 50vw;
                        max-width: 500px;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(toast);
        }

        // 3. 更新内容和颜色
        toast.textContent = message;
        toast.style.backgroundColor = isError ? '#E53935' : '#4CAF50';
        
        // 4. 显示 Toast (动画移动到可见位置)
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, 0)';

        // 5. 自动隐藏 Toast
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 100px)'; // 动画移回隐藏位置
        }, 3000);
    }

    /**
     * 从当前页面 URL 或页面数据中提取 UID 和长 MID
     * @returns {{uid: string, mid: string} | null} 微博信息对象
     */
    function extractWeiboInfo() {
        let uid = null;
        let mid = null;
        let shortMidFromUrl = null;
        const scripts = document.querySelectorAll('script');

        // 策略 1: 从 URL 获取 (如 /1234567890/Fx64lD1)
        const path = window.location.pathname;
        const urlMatch = path.match(/\/(\d+)\/(\w+)$/);

        if (urlMatch) {
            uid = urlMatch[1]; 
            shortMidFromUrl = urlMatch[2]; 
            // 如果 URL 中的 ID 已经是长数字 (MID)，则直接使用
            if (shortMidFromUrl.length > 10 && /^\d+$/.test(shortMidFromUrl)) {
                 mid = shortMidFromUrl;
            }
        }
        
        // 策略 2: 从移动版 $render_data 中获取长 MID
        if (window.location.hostname === 'm.weibo.cn' && !mid) {
            for (const script of scripts) {
                const scriptText = script.textContent;
                // 匹配移动端渲染数据
                const match = scriptText.match(/\$render_data = \[(.*?)\]\[0\]/s); 
                if (match && match[1]) {
                    try {
                        const renderData = JSON.parse(match[1]);
                        if (renderData && renderData.status && renderData.status.user) {
                            uid = renderData.status.user.id; 
                            mid = renderData.status.mid;
                            if (uid && mid) { return { uid: uid, mid: mid }; }
                        }
                    } catch (e) {
                        // console.error('微博脚本 (移动版): 解析 $render_data JSON 失败', e);
                    }
                }
            }
        }
        
        // 策略 3: Base62 转换 (将短 MID 转换为长 MID)
        if (!mid && shortMidFromUrl && shortMidFromUrl.length < 11 && /^[0-9a-zA-Z]+$/.test(shortMidFromUrl)) {
            const calculatedMid = murl_to_mid(shortMidFromUrl);
            if (calculatedMid.length > 10) {
                 mid = calculatedMid;
            }
        }
        
        // 补充 UID (如果 MID 已获取但 UID 缺失，从全局配置中尝试获取)
        if (mid && !uid && window.$CONFIG && window.$CONFIG.user && window.$CONFIG.user.id) {
            uid = window.$CONFIG.user.id;
        }

        // 最终校验：必须同时有 UID 和长 MID
        if (uid && mid && mid.length > 10) {
            return { uid: uid, mid: mid };
        }
        return null;
    }

    /**
     * 核心功能：复制微博原链接
     */
    function copyWeiboLink() {
        const info = extractWeiboInfo();

        if (info) {
            const weiboLink = `https://www.weibo.com/${info.uid}/${info.mid}`;
            GM_setClipboard(weiboLink);
            showToast(`操作成功！\n已复制微博原链接：\n${weiboLink}`, false);
        } else {
            showToast('操作失败。\n未能找到有效的微博长 MID 或 UID。请确保当前页面是微博详情页。', true);
        }
    }

    /**
     * 注册油猴菜单命令
     */
    function registerGMCommand() {
        GM_registerMenuCommand(`🔗 复制微博原链接 (长MID)`, copyWeiboLink, 'c');
    }

    // 启动脚本
    registerGMCommand();

})();