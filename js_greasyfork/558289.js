// ==UserScript==
// @name         POE网页市集侧边栏
// @namespace    http://tampermonkey.net/
// @version      S28-POE12-20251224
// @description  POE网页市集
// @author       You
// @license      MIT
// @match        https://poe.game.qq.com/trade*
// @match        https://poe.game.qq.com/trade2/*
// @match        https://www.pathofexile.com/trade*
// @match        https://www.pathofexile.com/trade2/*
// @exclude      https://poe.game.qq.com/trade/history
// @exclude      https://poe.game.qq.com/trade/history/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/558289/POE%E7%BD%91%E9%A1%B5%E5%B8%82%E9%9B%86%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/558289/POE%E7%BD%91%E9%A1%B5%E5%B8%82%E9%9B%86%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

(() => {
    'use strict';

    if (window.location.pathname.includes('/trade/history')) return;

    // 获取当前网站的标识符
    const getWebsiteKey = () => {
        const url = window.location.href;
        if (url.includes('poe.game.qq.com/trade2')) return 'qq_trade2';
        if (url.includes('poe.game.qq.com/trade')) return 'qq_trade';
        if (url.includes('pathofexile.com/trade2')) return 'ggg_trade2';
        if (url.includes('pathofexile.com/trade')) return 'ggg_trade1';
        return 'default';
    };

    const websiteKey = getWebsiteKey();

    // 根据网站获取对应的存储键名
    const getStorageKey = (baseKey) => {
        return `${baseKey}_${websiteKey}`;
    };

    let bookmarks = JSON.parse(GM_getValue(getStorageKey('poe_bookmarks'), '[]'));
    let folders = JSON.parse(GM_getValue(getStorageKey('poe_folders'), '["常用"]'));
    let priceHistory = JSON.parse(GM_getValue(getStorageKey('poe_price_history'), '{}'));
    let collapsedFolders = JSON.parse(GM_getValue(getStorageKey('poe_collapsed_folders'), '[]'));
    let lastTitle = '';

    GM_addStyle(`
        body { margin-right: 300px !important; }

        /* 侧边栏 - 加宽以适应大字体 */
        #poe-sidebar {
            position: fixed; right: 0; top: 0; width: 300px; height: 100vh;
            background: #151820; color: #b0b8c8; z-index: 1000;
            overflow-y: auto; border-left: 1px solid #252830;
            font-size: 13px; font-family: 'Microsoft YaHei', sans-serif;
        }

        /* 头部 */
        .sidebar-header {
            padding: 8px 10px; background: #101520;
            border-bottom: 1px solid #252830;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .sidebar-header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        /* DC比例控制 */
        .dc-ratio-control {
            display: flex;
            gap: 4px;
            align-items: center;
        }

        #dc-ratio-input {
            flex: 1;
            padding: 4px 6px;
            background: #252830;
            border: 1px solid #353840;
            color: #ccc;
            font-size: 12px;
            border-radius: 2px;
            text-align: center;
        }

        #dc-ratio-save {
            background: #353840;
            color: #8ca0b3;
            border: 1px solid #454850;
            padding: 0 8px;
            cursor: pointer;
            border-radius: 2px;
            font-size: 12px;
            height: 26px;
        }

        #dc-ratio-save:hover {
            background: #454850;
            color: #a0b4c3;
        }

        /* 跳转按钮 */
        .jump-buttons {
            display: flex;
            gap: 4px;
            margin: 4px 0;
        }

        .jump-btn {
            flex: 1;
            padding: 5px;
            background: #252830;
            border: none;
            color: #8ca0b3;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
            text-align: center;
        }

        .jump-btn:hover {
            background: #353840;
            color: #a0b4c3;
        }

        .sidebar-title {
            font-size: 15px; font-weight: 600; margin-bottom: 6px;
            color: #5d9cec; text-align: center;
        }

        .sidebar-actions {
            display: flex; gap: 4px; margin-bottom: 6px;
        }

        .action-btn {
            flex: 1; padding: 5px;
            background: #252830; border: none;
            color: #8ca0b3; border-radius: 2px; cursor: pointer;
            font-size: 12px; text-align: center;
        }

        .action-btn:hover { background: #353840; color: #a0b4c3; }

        /* 右下角固定按钮容器 */
        .fixed-bottom-right {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 5px;
            background: rgba(21, 24, 32, 0.9);
            border: 1px solid #252830;
            border-radius: 4px;
            padding: 8px;
            backdrop-filter: blur(5px);
        }

        .fixed-bottom-right .jump-buttons {
            display: flex;
            gap: 4px;
            margin: 0;
        }

        .fixed-bottom-right .sidebar-actions {
            display: flex;
            gap: 4px;
            margin: 0;
        }

        .fixed-bottom-right .jump-btn,
        .fixed-bottom-right .action-btn {
            flex: 1;
            padding: 6px 8px;
            background: #252830;
            border: none;
            color: #8ca0b3;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            text-align: center;
            min-width: 50px;
        }

        .fixed-bottom-right .jump-btn:hover,
        .fixed-bottom-right .action-btn:hover {
            background: #353840;
            color: #a0b4c3;
        }

        /* 新建文件夹 */
        .new-folder { display: flex; gap: 4px; }
        #folder-input {
            flex: 1; padding: 5px 6px; background: #252830;
            border: 1px solid #353840; color: #ccc; font-size: 12px;
            border-radius: 2px;
        }

        #create-btn {
            background: #353840; color: #8ca0b3; border: 1px solid #454850;
            padding: 0 8px; cursor: pointer; border-radius: 2px; font-size: 12px;
        }

        #create-btn:hover { background: #454850; color: #a0b4c3; }

        .global-save {
            margin-top: 8px;
        }

        .global-save-btn {
            width: 100%; padding: 8px 10px; background: #2d3748;
            color: #90cdf4; border: 1px solid #4a5568; border-radius: 4px;
            cursor: pointer; font-size: 13px; font-weight: 600;
            transition: all 0.2s;
        }
        .global-save-btn:hover {
            background: #4a5568; border-color: #63b3ed; color: #bee3f8;
        }

        /* 悬浮保存按钮 - 贴靠侧边栏 */
        .floating-save-btn {
            position: fixed;
            right: 300px; /* 贴靠侧边栏左侧 */
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #5d9cec, #4a89dc);
            border: 2px solid #6ba4f0;
            border-radius: 50%;
            color: white;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(93, 156, 236, 0.4);
            z-index: 1001;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .floating-save-btn:hover {
            background: linear-gradient(135deg, #4a89dc, #3a79cc);
            border-color: #5d9cec;
            box-shadow: 0 6px 16px rgba(93, 156, 236, 0.6);
            transform: translateY(-50%) scale(1.1);
        }

        .floating-save-btn:active {
            transform: translateY(-50%) scale(0.95);
        }

        /* 文件夹 */
        .folder-section {
            padding: 8px 10px;
            border-bottom: 1px solid #252830;
        }

        .folder-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 6px; cursor: pointer; padding: 2px 0;
        }

        .folder-title {
            font-weight: 600; font-size: 14px; color: #8ca0b3;
            display: flex; align-items: center; gap: 5px;
        }

        .folder-toggle { width: 12px; color: #6a707a; font-size: 12px; }
        .drag-handle {
            cursor: grab; color: #6a707a; font-size: 14px; margin-right: 4px;
            user-select: none; -webkit-user-select: none;
        }
        .drag-handle:hover { color: #8ca0b3; }
        .folder-section.dragging { opacity: 0.5; background: #353840; }
        .folder-section.drag-over { border: 1px dashed #5d9cec; }
        .folder-btns { display: flex; gap: 3px; }

        .folder-btn {
            padding: 3px 6px; cursor: pointer; border-radius: 2px;
            font-size: 11px; border: none; background: #252830; color: #8ca0b3;
            line-height: 14px; white-space: nowrap;
        }

        .save-btn { min-width: 45px; }
        .yellow-btn { background: #d6c160; color: #000; min-width: 20px; }
        .yellow-btn:hover { background: #e6d170; }
        .red-btn { background: #ff3333; color: #fff; min-width: 20px; }
        .red-btn:hover { background: #ff4444; }
        .folder-btn:hover { background: #353840; }

        /* 书签项 - 大字体设计 */
        .bookmark-item {
            margin: 4px 0; padding: 6px;
            background: #252830;
            border-radius: 3px;
            border: 1px solid #353840;
            cursor: default;
            transition: all 0.1s;
            height: 44px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
        }

        .bookmark-name-row {
            /* 书签名称行 - 第一行 */
            display: flex;
            align-items: center;
            height: 24px;
            overflow: hidden;
            gap: 8px;
        }

        .bookmark-price-row {
            /* 书签价格行 - 第二行 */
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 20px;
            gap: 2px;
            cursor: pointer;
            border-radius: 3px;
            padding: 0 2px;
            transition: background-color 0.2s;
        }

        .bookmark-price-row:hover {
            background-color: rgba(255, 215, 0, 0.1);
        }

        .bookmark-item:hover {
            background: #353840;
            border-color: #454850;
        }

        /* 书签内容容器 */
        .bookmark-content {
            display: flex;
            align-items: center;
            width: 100%;
            gap: 6px;
            overflow: hidden;
        }

        /* 物品名称 - 统一字体大小 */
        .bookmark-name {
            font-weight: 600; color: #fff; font-size: 14px;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            cursor: pointer;
            flex: 1;
            min-width: 0;
        }

        .bookmark-name:hover { color: #5d9cec; text-decoration: underline; }

        /* 价格标签组 - 用于两行布局 */
        .price-tags-compact {
            display: flex;
            gap: 2px;
            position: relative;
        }

        /* 紧凑价格标签 - 小字体 */
        .price-tag-compact {
            padding: 0px 4px; font-size: 12px;
            font-weight: 500;
            height: 16px; line-height: 16px;
            border-radius: 0;
        }

        .price-tag-compact:first-child { border-radius: 2px 0 0 2px; }
        .price-tag-compact:last-child { border-radius: 0 2px 2px 0; }

        /* 彩色价格 */
        .price-c { background: rgba(121, 182, 114, 0.3); color: #79b672; }
        .price-d { background: rgba(214, 193, 96, 0.3); color: #d6c160; }
        .price-ex { background: rgba(220, 140, 180, 0.3); color: #dc8cb4; }
        .price-other { background: rgba(100, 150, 200, 0.3); color: #6496c8; }

        /* 复制按钮 - 价格行内 */
        .copy-btn-right {
            background: #2a6b2a;
            border: 1px solid #3a7b3a;
            color: #9fcf8a;
            padding: 1px 6px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            height: 20px;
            line-height: 20px;
            white-space: nowrap;
        }

        .copy-btn-right:hover { background: #3a7b3a; color: #b6e7a1; }

        /* 时间 - 价格行内 */
        .bookmark-time {
            color: #6a707a; font-size: 12px;
            white-space: nowrap;
        }

        /* 操作按钮组 - 价格行内 */
        .action-buttons {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        /* 重命名按钮 */
        .rename-btn {
            width: 24px; height: 20px;
            border-radius: 3px;
            border: 1px solid #454850;
            background: transparent;
            color: #6a707a;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .rename-btn:hover {
            background: #454850;
            color: #ffcc80;
            border-color: #ff9900;
        }

        /* 删除按钮 */
        .delete-btn-small {
            width: 20px; height: 20px; border-radius: 3px;
            border: 1px solid #454850;
            background: transparent;
            color: #6a707a;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .delete-btn-small:hover {
            background: #454850;
            color: #ff8a80;
            border-color: #ff3333;
        }

        /* 空文件夹 */
        .empty-folder {
            text-align: center; padding: 8px; color: #6a707a;
            font-size: 13px; font-style: italic;
            background: #252830; border-radius: 3px; margin: 4px 0;
        }

        /* 底部信息栏 - 加大字体，支持价格曲线 */
        #price-bar {
            position: fixed; bottom: 0; left: 0; right: 300px;
            background: rgba(16, 21, 32, 0.95);
            border-top: 1px solid rgba(37, 40, 48, 0.9);
            padding: 10px 12px; z-index: 999;
            backdrop-filter: blur(8px);
            height: 100px;
            width: 300px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        /* 第一行：物品名称和O.价格 */
        .price-item-line {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            height: 24px;
        }

        .price-item-name {
            font-size: 16px; color: #5d9cec; font-weight: 500;
            cursor: pointer;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            flex: 1;
        }

        .price-item-name:hover {
            color: #7bb4f7;
            text-decoration: underline;
        }

        /* 第二行：完整价格历史带时间 */
        .price-history-line {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            height: 24px;
            overflow-y: hidden;
            overflow-x: auto;
        }

        .history-tag-with-time {
            background: rgba(37, 40, 48, 0.6);
            color: #9fcf8a; padding: 2px 8px;
            border-radius: 3px; font-size: 14px; white-space: nowrap;
            height: 22px; line-height: 22px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .history-tag-with-time.current {
            background: rgba(58, 107, 58, 0.7);
            color: #c6f7a9;
        }

        .price-time-small {
            color: #8ca0b3; font-size: 12px;
            opacity: 0.8;
        }



        /* 价格历史行 - 调整高度以适应曲线图 */
        .price-history-line {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            height: 28px;
            overflow-y: hidden;
            overflow-x: auto;
            align-items: center;
        }

        /* 底部按钮 */
        .sidebar-footer {
            padding: 10px 12px; border-top: 1px solid #252830;
            background: #101520; position: sticky; bottom: 0;
        }

        #copy-current-btn {
            width: 100%; padding: 8px; background: #2a6b2a;
            border: 1px solid #3a7b3a; color: #9fcf8a;
            border-radius: 3px; cursor: pointer; font-size: 14px;
            text-align: left; overflow: hidden; white-space: nowrap;
            text-overflow: ellipsis;
            height: 28px; line-height: 14px;
        }

        #copy-current-btn:hover {
            background: #3a7b3a; color: #b6e7a1;
        }

        /* 复制提示 */
        .copy-toast {
            position: fixed; top: 12px; right: 12px;
            background: rgba(50, 100, 50, 0.9); color: #c6f7a9;
            padding: 8px 12px; border-radius: 3px; z-index: 2001;
            font-size: 14px; font-weight: 500; border: 1px solid #3a7b3a;
        }

        /* 美化信息框样式 */
        .custom-alert {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(25, 30, 40, 0.95); backdrop-filter: blur(10px);
            border: 1px solid rgba(90, 100, 120, 0.6); border-radius: 8px;
            padding: 20px; min-width: 300px; max-width: 400px; z-index: 9999;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            color: #e0e8ff; font-family: 'Microsoft YaHei', sans-serif;
            text-align: center;
        }

        .custom-alert-title {
            font-size: 16px; font-weight: 600; margin-bottom: 15px;
            color: #5d9cec; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .custom-alert-content {
            font-size: 14px; line-height: 1.5; margin-bottom: 20px;
            color: #b0b8c8;
        }

        .custom-alert-buttons {
            display: flex; gap: 10px; justify-content: center;
        }

        .custom-alert-btn {
            padding: 8px 16px; border: none; border-radius: 4px;
            font-size: 14px; font-weight: 500; cursor: pointer;
            transition: all 0.2s ease; min-width: 80px;
        }

        .custom-alert-btn.confirm {
            background: rgba(93, 156, 236, 0.8); color: white;
            border: 1px solid rgba(93, 156, 236, 0.6);
        }

        .custom-alert-btn.confirm:hover {
            background: rgba(93, 156, 236, 1);
            box-shadow: 0 2px 8px rgba(93, 156, 236, 0.3);
        }

        .custom-alert-btn.cancel {
            background: rgba(100, 110, 130, 0.6); color: #b0b8c8;
            border: 1px solid rgba(120, 130, 150, 0.4);
        }

        .custom-alert-btn.cancel:hover {
            background: rgba(120, 130, 150, 0.8);
            color: #e0e8ff;
        }

        .custom-alert-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(2px);
            z-index: 9998;
        }

        #file-input { display: none; }
    `);

    // 自定义美化信息框
    const customAlert = (message, title = '提示') => {
        return new Promise((resolve) => {
            const overlay = $('<div class="custom-alert-overlay"></div>');
            const alertBox = $(`
                <div class="custom-alert">
                    <div class="custom-alert-title">${title}</div>
                    <div class="custom-alert-content">${message}</div>
                    <div class="custom-alert-buttons">
                        <button class="custom-alert-btn confirm">确定</button>
                    </div>
                </div>
            `);

            $('body').append(overlay).append(alertBox);

            alertBox.find('.custom-alert-btn').click(() => {
                overlay.remove();
                alertBox.remove();
                resolve(true);
            });
        });
    };

    const customConfirm = (message, title = '确认') => {
        return new Promise((resolve) => {
            const overlay = $('<div class="custom-alert-overlay"></div>');
            const confirmBox = $(`
                <div class="custom-alert">
                    <div class="custom-alert-title">${title}</div>
                    <div class="custom-alert-content">${message}</div>
                    <div class="custom-alert-buttons">
                        <button class="custom-alert-btn cancel">取消</button>
                        <button class="custom-alert-btn confirm">确定</button>
                    </div>
                </div>
            `);

            $('body').append(overlay).append(confirmBox);

            confirmBox.find('.custom-alert-btn.confirm').click(() => {
                overlay.remove();
                confirmBox.remove();
                resolve(true);
            });

            confirmBox.find('.custom-alert-btn.cancel').click(() => {
                overlay.remove();
                confirmBox.remove();
                resolve(false);
            });
        });
    };

    // 获取价格
    const getPrice = () => {
        const priceEl = $(".textCurrency.itemNote");
        if (priceEl.length) {
            const text = priceEl.text().trim();
            const match = text.match(/~b\/o\s+([\d.]+)\s+(\w+)/);
            if (match) {
                let [_, amount, currency] = match;
                currency = currency.toLowerCase();

                if (currency.includes('chaos') || currency === 'c') return `${amount}c`;
                if (currency.includes('divine') || currency === 'div' || currency === 'd') return `${amount}d`;
                if (currency.includes('exalted') || currency === 'ex') return `${amount}ex`;
                return `${amount} ${currency.substring(0,2)}`;
            }
        }
        return null;
    };

    // 价格格式化
    const getPriceForCopy = (price) => {
        if (!price) return '';

        const match = price.match(/^([\d.]+)([cd]|ex|div|chaos|divine|exalted)?$/i);
        if (match) {
            let [_, amount, currency] = match;
            currency = (currency || '').toLowerCase();

            if (currency.includes('c') || currency.includes('chaos')) return `O.${amount}.C`;
            if (currency.includes('d') || currency.includes('div') || currency.includes('divine')) return `O.${amount}.D`;
            if (currency.includes('ex') || currency.includes('exalted')) return `O.${amount}.ex`;
            return `O.${amount}`;
        }

        return `O.${price}`;
    };

    // 提取物品名称
    const extractItemName = () => {
        const searchVal = $("[placeholder='查找物品...']").val()?.trim();
        if (searchVal) return searchVal.replace(/请选择/g, '').trim();

        const selectText = $(".multiselect__single").text().trim();
        if (selectText && selectText !== '请选择') return selectText;

        const tagsText = $(".multiselect__tags").text().trim();
        if (tagsText && tagsText !== '请选择') return tagsText.replace(/请选择/g, '').trim();

        return '';
    };

    // 复制书签
    const copyBookmarkInfo = (index) => {
        const bookmark = bookmarks[index];
        if (!bookmark) return;

        const itemName = extractItemName() || bookmark.title;
        const priceForCopy = getPriceForCopy(bookmark.price);
        const copyText = itemName + (priceForCopy ? ` ${priceForCopy}` : '');

        navigator.clipboard.writeText(copyText).then(() => {
            showCopySuccess(copyText);
        }).catch(err => {
            const textArea = document.createElement('textarea');
            textArea.value = copyText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopySuccess(copyText);
        });
    };

    // 复制底部信息栏
    const copyPriceBarItem = async () => {
        const itemName = extractItemName();
        if (!itemName) {
            await customAlert('请输入物品名称');
            return;
        }

        const currentPrice = getPrice();
        if (!currentPrice) {
            await customAlert('无价格信息');
            return;
        }

        const copyText = `${itemName} ${getPriceForCopy(currentPrice)}`;
        navigator.clipboard.writeText(copyText).then(() => {
            showCopySuccess(copyText);
        }).catch(err => {
            const textArea = document.createElement('textarea');
            textArea.value = copyText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopySuccess(copyText);
        });
    };

    // 显示复制提示
    const showCopySuccess = (text) => {
        $('.copy-toast').remove();
        const toast = $(`<div class="copy-toast">已复制: ${text.substring(0, 40)}</div>`);
        $('body').append(toast);
        setTimeout(() => toast.remove(), 1500);
    };

    // 更新底部按钮
    const updateCopyButtonText = () => {
        const itemName = extractItemName();
        const price = getPrice();

        let buttonText = '📋 复制当前';
        if (itemName) {
            buttonText = `📋 ${itemName}`;
            if (price) {
                const priceForCopy = getPriceForCopy(price);
                buttonText += ` ${priceForCopy}`;
            }
        }

        $('#copy-current-btn').text(buttonText.substring(0, 40) + (buttonText.length > 40 ? '...' : ''));

        // 更新悬浮按钮显示实时价格
        updateFloatingButtonText();
    };

    // 更新悬浮按钮显示实时价格
    const updateFloatingButtonText = () => {
        const price = getPrice();

        if (price) {
            // 只显示价格
            const priceForCopy = getPriceForCopy(price);
            $('#floating-save-btn').text(priceForCopy);
        } else {
            // 默认显示
            $('#floating-save-btn').text('复制');
        }
    };

    // 复制当前物品
    const copyCurrentItem = async () => {
        const itemName = extractItemName();
        if (!itemName) {
            await customAlert('请输入物品名称');
            return;
        }

        const currentPrice = getPrice();
        if (!currentPrice) {
            await customAlert('无价格信息');
            return;
        }

        const copyText = `${itemName} ${getPriceForCopy(currentPrice)}`;
        navigator.clipboard.writeText(copyText).then(() => {
            showCopySuccess(copyText);
        }).catch(err => {
            const textArea = document.createElement('textarea');
            textArea.value = copyText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopySuccess(copyText);
        });
    };

    // 导出数据
    const exportData = () => {
        const allWebsiteKeys = ['qq_trade', 'qq_trade2', 'ggg_trade1', 'ggg_trade2'];
        const allData = {};

        // 收集所有4个网址的数据
        allWebsiteKeys.forEach(key => {
            const bookmarksKey = `poe_bookmarks_${key}`;
            const foldersKey = `poe_folders_${key}`;
            const priceHistoryKey = `poe_price_history_${key}`;
            const collapsedFoldersKey = `poe_collapsed_folders_${key}`;

            allData[key] = {
                bookmarks: JSON.parse(GM_getValue(bookmarksKey, '[]')),
                folders: JSON.parse(GM_getValue(foldersKey, '["常用"]')),
                priceHistory: JSON.parse(GM_getValue(priceHistoryKey, '{}')),
                collapsedFolders: JSON.parse(GM_getValue(collapsedFoldersKey, '[]'))
            };
        });

        const data = {
            allData: allData,
            exportTime: new Date().toISOString()
        };

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `poe_all_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    // 导入数据
    const importData = () => {
        // 移除之前的事件监听器
        $('#file-input').off('change').remove();

        const fileInput = $(`<input type="file" id="file-input" accept=".json" style="display:none;">`);
        $('body').append(fileInput);

        // 触发文件选择对话框
        fileInput[0].click();

        // 一次性事件监听器
        fileInput.one('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    let confirmed = false;
                    let importCount = 0;

                    // 检查是否为新的导出格式（包含所有网址数据）
                    if (data.allData) {
                        // 计算所有网址的书签总数
                        importCount = Object.values(data.allData).reduce((total, websiteData) => {
                            return total + (websiteData.bookmarks?.length || 0);
                        }, 0);

                        confirmed = await customConfirm(`导入 ${importCount} 个书签（来自所有4个网址）？`, '导入确认');

                        if (confirmed) {
                            // 导入所有网址的数据
                            Object.entries(data.allData).forEach(([key, websiteData]) => {
                                const bookmarksKey = `poe_bookmarks_${key}`;
                                const foldersKey = `poe_folders_${key}`;
                                const priceHistoryKey = `poe_price_history_${key}`;
                                const collapsedFoldersKey = `poe_collapsed_folders_${key}`;

                                GM_setValue(bookmarksKey, JSON.stringify(websiteData.bookmarks || []));
                                GM_setValue(foldersKey, JSON.stringify(websiteData.folders || ['常用']));
                                GM_setValue(priceHistoryKey, JSON.stringify(websiteData.priceHistory || {}));
                                GM_setValue(collapsedFoldersKey, JSON.stringify(websiteData.collapsedFolders || []));

                                // 如果是当前网址，更新本地变量
                                if (key === websiteKey) {
                                    bookmarks = websiteData.bookmarks || [];
                                    folders = websiteData.folders || ['常用'];
                                    priceHistory = websiteData.priceHistory || {};
                                    collapsedFolders = websiteData.collapsedFolders || [];
                                }
                            });
                        }
                    } else {
                        // 旧格式（仅当前网址数据）
                        importCount = data.bookmarks?.length || 0;
                        confirmed = await customConfirm(`导入 ${importCount} 个书签？`, '导入确认');

                        if (confirmed) {
                            bookmarks = data.bookmarks || [];
                            folders = data.folders || ['常用'];
                            priceHistory = data.priceHistory || {};
                            collapsedFolders = data.collapsedFolders || [];

                            GM_setValue(getStorageKey('poe_bookmarks'), JSON.stringify(bookmarks));
                            GM_setValue(getStorageKey('poe_folders'), JSON.stringify(folders));
                            GM_setValue(getStorageKey('poe_price_history'), JSON.stringify(priceHistory));
                            GM_setValue(getStorageKey('poe_collapsed_folders'), JSON.stringify(collapsedFolders));
                        }
                    }

                    if (confirmed) {
                        renderSidebar();
                        renderPriceHistory();
                    }
                } catch (error) {
                    customAlert('导入失败：文件格式错误', '导入失败');
                }
                fileInput.val('');
            };
            reader.readAsText(file);
        });
    };

    // 更新标题
    const updateTitle = () => {
        const name = $("[placeholder='查找物品...']").val()?.trim() || $(".multiselect__single").text().trim() || '';
        const cleanName = name.replace(/请选择/g, '').trim();
        if (cleanName !== lastTitle) {
            lastTitle = cleanName;
            document.title = cleanName;
            updateCopyButtonText();
        }
    };

    // 获取当前信息
    const getCurrentInfo = (folder) => {
        // 尝试多种方式获取物品名称
        let name = '';

        // 方法1: 搜索框输入值
        const searchInput = $("[placeholder='查找物品...']");
        if (searchInput.length) {
            name = searchInput.val()?.trim() || '';
        }

        // 方法2: 多选组件文本
        if (!name) {
            const selectText = $(".multiselect__single").text().trim();
            if (selectText && selectText !== '请选择') {
                name = selectText;
            }
        }

        // 方法3: 多选标签文本
        if (!name) {
            const tagsText = $(".multiselect__tags").text().trim();
            if (tagsText && tagsText !== '请选择') {
                name = tagsText.replace(/请选择/g, '').trim();
            }
        }

        // 方法4: 页面标题（作为备用）
        if (!name) {
            const pageTitle = document.title.trim();
            if (pageTitle && !pageTitle.includes('POE交易')) {
                name = pageTitle;
            }
        }

        return {
            title: name.replace(/请选择/g, '').trim() || '未命名书签',
            url: window.location.href,
            folder: folder || folders[0],
            price: getPrice(),
            timestamp: new Date().toISOString()
        };
    };

    // 记录价格历史
    const recordPriceHistory = (title, price) => {
        if (!title || !price) return;

        if (!priceHistory[title]) priceHistory[title] = [];

        const now = new Date();
        const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

        const recentSamePrice = priceHistory[title].some(record => {
            return record.price === price && new Date(record.timestamp) > twoMinutesAgo;
        });

        if (!recentSamePrice) {
            priceHistory[title].push({
                price: price,
                time: now.toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'}),
                timestamp: now.toISOString()
            });

            if (priceHistory[title].length > 15) priceHistory[title] = priceHistory[title].slice(-15);
            GM_setValue(getStorageKey('poe_price_history'), JSON.stringify(priceHistory));
        }
    };

    // 保存书签
    const saveBookmark = (folder) => {
        const info = getCurrentInfo(folder);
        if (!info.title || info.title === '未命名书签') return;

        const existingIndex = bookmarks.findIndex(b => b.url === info.url && b.folder === folder);

        if (existingIndex >= 0) {
            bookmarks[existingIndex].price = info.price || bookmarks[existingIndex].price;
            bookmarks[existingIndex].timestamp = info.timestamp;
        } else {
            bookmarks.push(info);
        }

        if (info.price) {
            const savedTitle = existingIndex >= 0 ? bookmarks[existingIndex].title : info.title;
            recordPriceHistory(savedTitle, info.price);
        }

        GM_setValue(getStorageKey('poe_bookmarks'), JSON.stringify(bookmarks));
        renderSidebar();
        renderPriceHistory();
    };

    // 全局保存书签（根据网址更新或保存到常用文件夹）
    const saveBookmarkGlobal = () => {
        const info = getCurrentInfo();
        if (!info.title || info.title === '未命名书签') {
            customAlert('请输入物品名称', '保存失败');
            return;
        }

        // 查找所有文件夹中是否有相同网址的书签
        const existingIndex = bookmarks.findIndex(b => b.url === info.url);

        if (existingIndex >= 0) {
            // 更新现有书签（保持原有书名不变，只更新价格和时间戳）
            bookmarks[existingIndex].price = info.price || bookmarks[existingIndex].price;
            bookmarks[existingIndex].timestamp = info.timestamp;
            // 去掉成功提示
        } else {
            // 新书签保存到常用文件夹
            info.folder = '常用';
            bookmarks.push(info);
            // 去掉成功提示
        }

        if (info.price) {
            const savedTitle = existingIndex >= 0 ? bookmarks[existingIndex].title : info.title;
            recordPriceHistory(savedTitle, info.price);
        }

        GM_setValue(getStorageKey('poe_bookmarks'), JSON.stringify(bookmarks));
        renderSidebar();
        renderPriceHistory();
    };

    // 文件夹操作
    const newFolder = () => {
        const name = $('#folder-input').val().trim();
        if (name && !folders.includes(name)) {
            folders.push(name);
            GM_setValue(getStorageKey('poe_folders'), JSON.stringify(folders));
            $('#folder-input').val('');
            renderSidebar();
        }
    };

    const renameFolder = (index) => {
        const newName = prompt('新文件夹名：', folders[index]);
        if (newName && newName !== folders[index]) {
            const oldName = folders[index];
            folders[index] = newName;
            bookmarks.forEach(b => { if (b.folder === oldName) b.folder = newName; });
            GM_setValue(getStorageKey('poe_folders'), JSON.stringify(folders));
            GM_setValue(getStorageKey('poe_bookmarks'), JSON.stringify(bookmarks));
            renderSidebar();
        }
    };

    const deleteFolder = (index) => {
        const folderName = folders[index];
        bookmarks = bookmarks.filter(b => b.folder !== folderName);
        folders.splice(index, 1);

        const collapsedIndex = collapsedFolders.indexOf(folderName);
        if (collapsedIndex !== -1) collapsedFolders.splice(collapsedIndex, 1);

        GM_setValue(getStorageKey('poe_bookmarks'), JSON.stringify(bookmarks));
        GM_setValue(getStorageKey('poe_folders'), JSON.stringify(folders));
        GM_setValue(getStorageKey('poe_collapsed_folders'), JSON.stringify(collapsedFolders));
        renderSidebar();
    };

    // 书签操作
    const renameBookmark = (index) => {
        const newName = prompt('新书签名：', bookmarks[index].title);
        if (newName) {
            bookmarks[index].title = newName;
            GM_setValue(getStorageKey('poe_bookmarks'), JSON.stringify(bookmarks));
            renderSidebar();
        }
    };

    const deleteBookmark = (index) => {
        bookmarks.splice(index, 1);
        GM_setValue(getStorageKey('poe_bookmarks'), JSON.stringify(bookmarks));
        renderSidebar();
    };

    // 计算相对时间
    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const savedTime = new Date(timestamp);
        const diffMs = now - savedTime;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return '1分钟前';
        if (diffMins < 60) return `${diffMins}分钟前`;
        if (diffHours < 24) return `${diffHours}小时前`;
        if (diffDays < 7) return `${diffDays}天前`;

        return '很久以前';
    };

    // 切换文件夹折叠
    const toggleFolder = (folderName) => {
        const index = collapsedFolders.indexOf(folderName);
        if (index === -1) {
            collapsedFolders.push(folderName);
        } else {
            collapsedFolders.splice(index, 1);
        }
        GM_setValue(getStorageKey('poe_collapsed_folders'), JSON.stringify(collapsedFolders));
        renderSidebar();
    };

    // 拖动排序文件夹
    const setupFolderDragAndDrop = () => {
        const folderSections = $('.folder-section');

        folderSections.each(function() {
            const $folder = $(this);

            // 拖动开始
            $folder.on('dragstart', function(e) {
                e.originalEvent.dataTransfer.setData('text/plain', $folder.data('index'));
                $folder.addClass('dragging');
            });

            // 拖动结束
            $folder.on('dragend', function() {
                $folder.removeClass('dragging');
                $('.folder-section').removeClass('drag-over');
            });

            // 拖动经过
            $folder.on('dragover', function(e) {
                e.preventDefault();
                e.originalEvent.dataTransfer.dropEffect = 'move';
                $folder.addClass('drag-over');
            });

            // 拖动离开
            $folder.on('dragleave', function() {
                $folder.removeClass('drag-over');
            });

            // 放置
            $folder.on('drop', function(e) {
                e.preventDefault();
                const fromIndex = parseInt(e.originalEvent.dataTransfer.getData('text/plain'));
                const toIndex = $folder.data('index');

                if (fromIndex !== toIndex) {
                    // 移动文件夹
                    const folderToMove = folders[fromIndex];
                    folders.splice(fromIndex, 1);
                    folders.splice(toIndex, 0, folderToMove);

                    // 保存到本地存储
                    GM_setValue(getStorageKey('poe_folders'), JSON.stringify(folders));

                    // 重新渲染侧边栏
                    renderSidebar();
                }

                $folder.removeClass('drag-over');
            });
        });
    };

    // 书签价格排序功能（支持DC比例）
    const setupBookmarkPriceSorting = () => {
        // 为每个书签项添加价格排序功能
        $('.bookmark-price-row').each(function() {
            const $priceRow = $(this);
            const $bookmarkItem = $priceRow.closest('.bookmark-item');

            // 添加点击价格排序功能
            $priceRow.off('click').on('click', function(e) {
                e.stopPropagation();

                const index = $bookmarkItem.data('index');
                const bookmark = bookmarks[index];

                if (!bookmark.price) return;

                // 获取当前文件夹
                const folder = bookmark.folder;

                // 重新构建整个书签数组，保持文件夹顺序
                const sortedBookmarks = [];

                folders.forEach(currentFolder => {
                    const folderBookmarks = bookmarks.filter(b => b.folder === currentFolder);

                    if (currentFolder === folder) {
                        // 对当前文件夹内的书签按价格排序（支持DC比例）
                        folderBookmarks.sort((a, b) => {
                            const priceA = extractPriceValueWithDCRatio(a.price);
                            const priceB = extractPriceValueWithDCRatio(b.price);
                            return priceB - priceA; // 降序排列
                        });
                    }

                    sortedBookmarks.push(...folderBookmarks);
                });

                // 更新书签数组
                bookmarks = sortedBookmarks;

                // 保存并重新渲染
                GM_setValue(getStorageKey('poe_bookmarks'), JSON.stringify(bookmarks));
                renderSidebar();
            });

            // 添加鼠标悬停效果
            $priceRow.css('cursor', 'pointer').attr('title', '点击按价格排序（支持DC比例）');
        });
    };

    // 提取价格数值（用于排序）
    const extractPriceValue = (priceStr) => {
        if (!priceStr) return 0;

        // 处理各种价格格式
        let value = 0;

        // 神圣石 (divine)
        if (priceStr.includes('divine') || priceStr.includes('神圣')) {
            const match = priceStr.match(/(\d+(?:\.\d+)?)/);
            value = match ? parseFloat(match[1]) * 100 : 0;
        }
        // 混沌石 (chaos)
        else if (priceStr.includes('chaos') || priceStr.includes('混沌') || priceStr.includes('c')) {
            const match = priceStr.match(/(\d+(?:\.\d+)?)/);
            value = match ? parseFloat(match[1]) : 0;
        }
        // 崇高石 (exalted)
        else if (priceStr.includes('exalted') || priceStr.includes('崇高') || priceStr.includes('ex')) {
            const match = priceStr.match(/(\d+(?:\.\d+)?)/);
            value = match ? parseFloat(match[1]) * 50 : 0;
        }
        // 默认处理数字
        else {
            const match = priceStr.match(/(\d+(?:\.\d+)?)/);
            value = match ? parseFloat(match[1]) : 0;
        }

        return value;
    };

    // 提取价格数值（支持DC比例）
    const extractPriceValueWithDCRatio = (priceStr) => {
        if (!priceStr) return 0;

        // 获取DC比例（神圣石与混沌石的比例），默认100
        const dcRatio = GM_getValue('dc_ratio', 100);

        // 处理各种价格格式
        let value = 0;

        // 神圣石 (divine) - 使用DC比例转换
        if (priceStr.includes('divine') || priceStr.includes('神圣') || priceStr.includes('d')) {
            const match = priceStr.match(/(\d+(?:\.\d+)?)/);
            value = match ? parseFloat(match[1]) * dcRatio : 0;
        }
        // 混沌石 (chaos)
        else if (priceStr.includes('chaos') || priceStr.includes('混沌') || priceStr.includes('c')) {
            const match = priceStr.match(/(\d+(?:\.\d+)?)/);
            value = match ? parseFloat(match[1]) : 0;
        }
        // 崇高石 (exalted) - 使用固定比例50（与混沌石的比例）
        else if (priceStr.includes('exalted') || priceStr.includes('崇高') || priceStr.includes('ex')) {
            const match = priceStr.match(/(\d+(?:\.\d+)?)/);
            value = match ? parseFloat(match[1]) * 50 : 0;
        }
        // 默认处理数字
        else {
            const match = priceStr.match(/(\d+(?:\.\d+)?)/);
            value = match ? parseFloat(match[1]) : 0;
        }

        return value;
    };

    // 渲染书签紧凑价格
    const renderBookmarkCompactPrice = (bookmark) => {
        const history = priceHistory[bookmark.title] || [];
        if (history.length === 0) return '';

        const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const filteredHistory = [];
        let lastPrice = null;

        for (const record of sortedHistory) {
            if (record.price !== lastPrice) {
                filteredHistory.push(record);
                lastPrice = record.price;
            }
        }

        const recentHistory = filteredHistory.slice(0, 5);

        return recentHistory.map(record => {
            const price = record.price;
            let colorClass = 'price-other';

            if (price.includes('c') || price.includes('C')) colorClass = 'price-c';
            else if (price.includes('d') || price.includes('D')) colorClass = 'price-d';
            else if (price.includes('ex') || price.includes('EX')) colorClass = 'price-ex';

            return `<span class="price-tag-compact ${colorClass}">${record.price}</span>`;
        }).join('');
    };

    // 渲染价格历史
    const renderPriceHistory = () => {
        const name = $("[placeholder='查找物品...']").val()?.trim() || '';
        const cleanName = name.replace(/请选择/g, '').trim();

        if (!cleanName) {
            $('#price-item-name').html('<div style="color:#6a707a;font-size:12px;">输入物品名称</div>');
            $('#price-history-list').html('');
            $('#price-chart-info').text('价格曲线');
            return;
        }

        const history = priceHistory[cleanName] || [];
        const currentPrice = getPrice();

        if (currentPrice) {
            recordPriceHistory(cleanName, currentPrice);
        }

        const priceForCopy = currentPrice ? getPriceForCopy(currentPrice) : '';
        const itemNameHtml = cleanName + (priceForCopy ? ` ${priceForCopy}` : '');

        $('#price-item-name').html(`
            <span class="price-item-name" title="点击复制">${itemNameHtml}</span>
        `);

        $('#price-item-name .price-item-name').off('click').on('click', copyPriceBarItem);

        if (history.length === 0) {
            $('#price-history-list').html(`<div style="color:#6a707a;font-size:12px;">"${cleanName.substring(0, 10)}"无价格历史</div>`);
            $('#price-chart-info').text('无数据');
            return;
        }

        const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const filteredHistory = [];
        let lastPrice = null;

        for (const record of sortedHistory) {
            if (record.price !== lastPrice) {
                filteredHistory.push(record);
                lastPrice = record.price;
            }
        }

        const recentHistory = filteredHistory.slice(0, 10);
        const html = recentHistory.map((record, i) => `
            <div class="history-tag-with-time ${i === 0 ? 'current' : ''}">
                ${record.price} <span class="price-time-small">(${record.time})</span>
            </div>
        `).join('');

        $('#price-history-list').html(html);


    };



    // 渲染侧边栏
    const renderSidebar = () => {
        const content = $('#sidebar-content');
        if (!content.length) return;

        let html = '';

        folders.forEach((folder, i) => {
            const folderBookmarks = bookmarks.filter(b => b.folder === folder);
            const isCollapsed = collapsedFolders.includes(folder);
            const toggleIcon = isCollapsed ? '▶' : '▼';

            html += `
                <div class="folder-section" draggable="true" data-index="${i}">
                    <div class="folder-header" data-folder="${folder}">
                        <div class="folder-title">
                            <span class="folder-toggle">${toggleIcon}</span>
                            <span class="drag-handle" title="拖动排序">≡</span>
                            ${folder} (${folderBookmarks.length})
                        </div>
                        <div class="folder-btns">
                            ${folder === '野兽' ? `
                            <button class="folder-btn yellow-btn" data-index="${i}" title="黄">黄</button>
                            <button class="folder-btn red-btn" data-index="${i}" title="红">红</button>
                            ` : ''}
                            <button class="folder-btn save-btn" data-folder="${folder}" title="保存到当前文件夹">保存到当前</button>
                            <button class="folder-btn rename-btn" data-index="${i}">改名</button>
                            <button class="folder-btn delete-btn" data-index="${i}">删除</button>
                        </div>
                    </div>
                    <div class="folder-bookmarks" style="${isCollapsed ? 'display:none;' : ''}">
            `;

            if (folderBookmarks.length === 0) {
                html += '<div class="empty-folder">暂无书签</div>';
            } else {
                // 自动按价格排序（支持DC比例）
                const sortedBookmarks = [...folderBookmarks].sort((a, b) => {
                    const priceA = extractPriceValueWithDCRatio(a.price);
                    const priceB = extractPriceValueWithDCRatio(b.price);
                    return priceB - priceA; // 降序排列
                });

                sortedBookmarks.forEach((bm) => {
                    const index = bookmarks.findIndex(b => b === bm);
                    const priceHtml = renderBookmarkCompactPrice(bm);
                    const relativeTime = getRelativeTime(bm.timestamp);

                    html += `
                        <div class="bookmark-item" data-index="${index}">
                            <div class="bookmark-name-row">
                                <a href="${bm.url}" class="bookmark-name" title="${bm.title}" data-index="${index}">${bm.title}</a>
                                <span class="bookmark-time">${relativeTime}</span>
                                <button class="copy-btn-right" title="复制物品和价格" data-index="${index}">复制</button>
                                <div class="action-buttons">
                                    <button class="rename-btn" title="重命名" data-index="${index}">✏️</button>
                                    <button class="delete-btn-small delete-btn" title="删除" data-index="${index}">🗑️</button>
                                </div>
                            </div>
                            <div class="bookmark-price-row">
                                ${priceHtml ? `<div class="price-tags-compact">${priceHtml}</div>` : ''}
                            </div>
                        </div>
                    `;
                });
            }

            html += `</div></div>`;
        });

        content.html(html);

        // 绑定事件
        $('.folder-header').off('click').on('click', function(e) {
            if (!$(e.target).hasClass('folder-btn')) toggleFolder($(this).attr('data-folder'));
        });

        $('.save-btn').off('click').on('click', e => {
            e.stopPropagation();
            saveBookmark($(e.target).attr('data-folder'));
        });

        $('.rename-btn.folder-btn').off('click').on('click', e => {
            e.stopPropagation();
            renameFolder($(e.target).data('index'));
        });

        $('.delete-btn.folder-btn').off('click').on('click', e => {
            e.stopPropagation();
            deleteFolder($(e.target).data('index'));
        });

        // 红色按钮功能：复制野兽名称列表
        $('.red-btn').off('click').on('click', e => {
            e.stopPropagation();
            const beastList = '(暗夜混毒|深海奇美拉|母兽|头狼|活性哨兵|活性匿者|黑羽)';

            // 复制到剪贴板
            navigator.clipboard.writeText(beastList).then(() => {
                console.log('野兽名称列表已复制到剪贴板:', beastList);
                // 添加视觉反馈
                const $btn = $(e.target);
                const originalText = $btn.text();
                $btn.text('已复制');
                setTimeout(() => {
                    $btn.text(originalText);
                }, 1000);
            }).catch(err => {
                console.error('复制失败:', err);
                // 备用方案：使用document.execCommand
                const textArea = document.createElement('textarea');
                textArea.value = beastList;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                console.log('使用备用方法复制成功');
            });
        });

        // 黄色按钮功能：复制野兽名称正则表达式
        $('.yellow-btn').off('click').on('click', e => {
            e.stopPropagation();
            const beastRegex = '(?!海奇|夜混)(海|始|地|空|夜|纺)(烈|冰|利|纱|蜘|鸟|熔|针|反|恐|凶|毒|奇|眼|黑|守|野|石|酋|深|巨|墨|羊|吞|女|秃|收|异|附|喷|囊|寄|混|裂)';

            // 复制到剪贴板
            navigator.clipboard.writeText(beastRegex).then(() => {
                console.log('野兽名称正则表达式已复制到剪贴板:', beastRegex);
                // 添加视觉反馈
                const $btn = $(e.target);
                const originalText = $btn.text();
                $btn.text('已复制');
                setTimeout(() => {
                    $btn.text(originalText);
                }, 1000);
            }).catch(err => {
                console.error('复制失败:', err);
                // 备用方案：使用document.execCommand
                const textArea = document.createElement('textarea');
                textArea.value = beastRegex;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                console.log('使用备用方法复制成功');
            });
        });

        $('.copy-btn-right').off('click').on('click', function(e) {
            e.stopPropagation();
            copyBookmarkInfo($(this).data('index'));
        });

        $('.rename-btn').off('click').on('click', function(e) {
            e.stopPropagation();
            renameBookmark($(this).data('index'));
        });

        $('.delete-btn-small').off('click').on('click', function(e) {
            e.stopPropagation();
            deleteBookmark($(this).data('index'));
        });

        $('.bookmark-name').off('click').on('click', function(e) {
            e.preventDefault();
            const index = $(this).data('index');
            const bookmarkUrl = bookmarks[index].url;

            // 在跳转前保存当前书签信息到sessionStorage
            const bookmarkInfo = {
                url: bookmarkUrl,
                title: bookmarks[index].title,
                timestamp: new Date().toISOString()
            };
            sessionStorage.setItem('poe_auto_save_bookmark', JSON.stringify(bookmarkInfo));

            // 跳转到书签网址
            window.location.href = bookmarkUrl;
        });

        // 设置文件夹拖动排序
        setupFolderDragAndDrop();

        // 设置书签价格排序
        setupBookmarkPriceSorting();
    };

    // 创建界面
    const createUI = () => {
        $('#poe-sidebar, #price-bar').remove();

        const sidebar = $(`
            <div id="poe-sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-header-top">
                        <div class="sidebar-title">DC比</div>
                        <div class="dc-ratio-control">
                            <input type="number" id="dc-ratio-input" value="${GM_getValue('dc_ratio', 100)}" min="1" max="1000" title="神圣石与混沌石的比例">
                            <button id="dc-ratio-save">保存</button>
                        </div>
                    </div>
                    <div class="new-folder">
                        <input id="folder-input" placeholder="文件夹名">
                        <button id="create-btn">新建</button>
                    </div>
                    <div class="global-save">
                        <button class="global-save-btn" id="global-save-btn" title="保存或更新书签（根据网址）">💾 保存</button>
                    </div>
                </div>
                <div id="sidebar-content"></div>
                <div class="sidebar-footer">
                    <button id="copy-current-btn" title="点击复制物品和价格">📋 复制当前</button>
                </div>
                <button class="floating-save-btn" id="floating-save-btn" title="快速复制物品和价格">O.1.C</button>
            </div>
        `);

        // 创建右下角固定按钮容器
        const fixedButtons = $(`
            <div class="fixed-bottom-right">
                <div class="jump-buttons">
                    <button class="jump-btn" id="jump-poe1" title="腾讯服POE1">POE1</button>
                    <button class="jump-btn" id="jump-poe2" title="腾讯服POE2">POE2</button>
                    <button class="jump-btn" id="jump-ggg1" title="国际服POE1">国际服1</button>
                    <button class="jump-btn" id="jump-ggg2" title="国际服POE2">国际服2</button>
                </div>
                <div class="sidebar-actions">
                    <button class="action-btn" id="export-btn">导出</button>
                    <button class="action-btn" id="import-btn">导入</button>
                </div>
            </div>
        `);

        const priceBar = $(`
            <div id="price-bar">
                <div class="price-item-line">
                    <div id="price-item-name"></div>
                </div>
                <div class="price-history-line" id="price-history-list"></div>
            </div>
        `);

        $('body').append(sidebar, priceBar, fixedButtons);

        // 绑定事件 - 使用事件委托确保所有按钮都能正常工作
        $(document).on('click', '#create-btn', newFolder);
        $('#folder-input').keypress(e => e.which === 13 && newFolder());
        $(document).on('click', '#export-btn', exportData);

        // DC比例保存功能
        $(document).on('click', '#dc-ratio-save', () => {
            const dcRatio = parseInt($('#dc-ratio-input').val());
            if (dcRatio >= 1 && dcRatio <= 1000) {
                GM_setValue('dc_ratio', dcRatio);
                console.log('DC比例已设置为:', dcRatio);

                // 添加视觉反馈
                const $btn = $('#dc-ratio-save');
                const originalText = $btn.text();
                $btn.text('已保存');
                setTimeout(() => {
                    $btn.text(originalText);
                }, 1000);
            } else {
                alert('请输入1-1000之间的有效比例值');
            }
        });

        $('#dc-ratio-input').keypress(e => {
            if (e.which === 13) {
                $('#dc-ratio-save').click();
            }
        });
        $(document).on('click', '#import-btn', importData);
        $(document).on('click', '#copy-current-btn', copyCurrentItem);
        $(document).on('click', '#global-save-btn', saveBookmarkGlobal);
        $(document).on('click', '#floating-save-btn', copyCurrentItem);

        // 跳转按钮事件
        $(document).on('click', '#jump-poe1', () => {
            window.location.href = 'https://poe.game.qq.com/trade/';
        });

        $(document).on('click', '#jump-poe2', () => {
            window.location.href = 'https://poe.game.qq.com/trade2/';
        });

        $(document).on('click', '#jump-ggg1', () => {
            window.location.href = 'https://www.pathofexile.com/trade/';
        });

        $(document).on('click', '#jump-ggg2', () => {
            window.location.href = 'https://www.pathofexile.com/trade2/';
        });

        renderSidebar();
        renderPriceHistory();
        updateCopyButtonText();
    };

    // 初始化
    const init = () => {
        updateTitle();
        createUI();

        // 检查是否需要自动保存（从书签跳转过来）
        const autoSaveBookmark = sessionStorage.getItem('poe_auto_save_bookmark');
        if (autoSaveBookmark) {
            const bookmarkInfo = JSON.parse(autoSaveBookmark);

            // 延迟执行保存，确保页面完全加载
            setTimeout(() => {
                // 多次尝试获取页面信息
                let attempts = 0;
                const maxAttempts = 15;

                const trySave = () => {
                    attempts++;
                    const currentInfo = getCurrentInfo();
                    console.log('尝试获取页面信息:', currentInfo.title, '尝试次数:', attempts);

                    // 检查页面是否已加载完成（有物品名称且不是默认值）
                    if (currentInfo.title && currentInfo.title !== '未命名书签' && currentInfo.title !== 'POE交易') {
                        // 查找所有文件夹中是否有相同网址的书签
                        const existingIndex = bookmarks.findIndex(b => b.url === bookmarkInfo.url);

                        if (existingIndex >= 0) {
                            // 网址相同，只更新价格和时间戳，不修改标签名
                            const originalTitle = bookmarks[existingIndex].title;
                            const oldPrice = bookmarks[existingIndex].price;
                            bookmarks[existingIndex].price = currentInfo.price || bookmarks[existingIndex].price;
                            bookmarks[existingIndex].timestamp = currentInfo.timestamp;

                            // 确保标签名保持不变
                            bookmarks[existingIndex].title = originalTitle;

                            if (currentInfo.price) {
                                recordPriceHistory(originalTitle, currentInfo.price);
                            }

                            GM_setValue(getStorageKey('poe_bookmarks'), JSON.stringify(bookmarks));
                            renderSidebar();
                            renderPriceHistory();

                            // 更新悬浮按钮显示最新价格
                            updateFloatingButtonText();

                            console.log('自动更新价格和时间戳成功，标签名保持不变');
                        } else {
                            // 新书签，使用当前页面信息保存
                            saveBookmarkGlobal();
                            console.log('自动保存新书签成功');
                        }

                        // 清除sessionStorage
                        sessionStorage.removeItem('poe_auto_save_bookmark');
                    } else if (attempts < maxAttempts) {
                        // 如果没获取到有效信息，等待后重试
                        setTimeout(trySave, 800);
                    } else {
                        console.log('无法获取有效页面信息，跳过自动保存');
                        sessionStorage.removeItem('poe_auto_save_bookmark');
                    }
                };

                trySave();
            }, 1500);
        }

        $(document).on('click input', () => {
            updateTitle();
            updateCopyButtonText();
        });

        new MutationObserver(() => {
            updateTitle();
            renderPriceHistory();
            updateCopyButtonText();
        }).observe(document.body, {subtree: true});

        setInterval(() => {
            renderPriceHistory();
            updateFloatingButtonText(); // 直接更新悬浮按钮
            updateCopyButtonText();
        }, 2000);


    };

    // 路由处理
    history.pushState = new Proxy(history.pushState, {
        apply: function(target, thisArg, argumentsList) {
            target.apply(thisArg, argumentsList);
            setTimeout(() => {
                updateTitle();
                renderBookmarks();
                renderPriceHistory();
                updateCopyButtonText();
            }, 100);
        }
    });

    history.replaceState = new Proxy(history.replaceState, {
        apply: function(target, thisArg, argumentsList) {
            target.apply(thisArg, argumentsList);
            setTimeout(() => {
                updateTitle();
                renderBookmarks();
                renderPriceHistory();
                updateCopyButtonText();
            }, 100);
        }
    });

    // 启动 - 使用一次性初始化
    let initialized = false;
    const initializeOnce = () => {
        if (initialized) return;
        initialized = true;
        init();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOnce);
    } else {
        setTimeout(initializeOnce, 500);
    }

    // 页面导航时只更新内容，不重新绑定事件
    window.addEventListener('popstate', () => {
        updateTitle();
        renderBookmarks();
        renderPriceHistory();
        updateCopyButtonText();
    });
})();