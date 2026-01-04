// ==UserScript==
// @name         高砖积木清单提取
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  以Materia Design 3风格，提取高砖网站可购零件数据，显示在悬浮弹窗中
// @author       大生
// @match        https://gobricks.cn/batch*
// @match        https://gobricks.cn/parts*
// @grant        none
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

    // 提取积木数据 (已修复起始页面判断BUG)
    async function extractBrickData() {
        try {
            let allBricks = [];
            const switchContainer = document.querySelector('[data-v-6f6f0294].switch_part_type');

            if (!switchContainer) {
                return extractCurrentPageBricks('');
            }

            const availableButton = Array.from(switchContainer.querySelectorAll('.itemSelectBtn')).find(btn => btn.textContent.includes('可购'));
            const shortageButton = Array.from(switchContainer.querySelectorAll('.itemSelectBtn')).find(btn => btn.textContent.includes('缺货'));

            if (!availableButton || !shortageButton) {
                return extractCurrentPageBricks('');
            }

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

    // 提取当前页面的积木数据
    function extractCurrentPageBricks(remark = '') {
        const bricks = [];
        if (window.__NUXT__?.data?.[0]?.items) {
            const items = window.__NUXT__.data[0].items;
            items.forEach(item => {
                const fullGdsCode = item.new_alias || item.product_id || '无编码';
                bricks.push({
                    name: item.caption || '未知名称',
                    quantity: item.inventory || 0,
                    gdsCode: fullGdsCode,
                    shortGdsCode: extractShortGdsCode(fullGdsCode),
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
                    const fullGdsCode = codeEl.textContent.trim();
                    bricks.push({
                        name: nameEl.textContent.trim(),
                        quantity: quantityEl ? quantityEl.textContent.replace('x ', '').trim() : '1',
                        gdsCode: fullGdsCode,
                        shortGdsCode: extractShortGdsCode(fullGdsCode),
                        image: imageEl ? imageEl.src : '',
                        remark: remark
                    });
                }
            });
        }
        return bricks;
    }

    // 提取精简的高德斯编码
    function extractShortGdsCode(fullCode) {
        if (!fullCode || fullCode === '无编码') return '';
        const match = fullCode.match(/GDS-\d+/i);
        return match ? match[0] : '';
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
                    <td style="padding: 8px; border: 1px solid #e0e0e0; text-align: center;">
                        ${brick.image ? `<img src="${brick.image}" width="50" height="50" style="object-fit: contain;">` : '-'}
                    </td>
                    <td style="padding: 8px; border: 1px solid #e0e0e0; text-align: center; ${isShortage ? 'color: #d93025; font-weight: 500;' : ''}">${brick.remark || '-'}</td>
                </tr>`;
        });
        htmlTable += `</tbody></table>`;

        // 2. 创建纯文本备用格式
        let textData = '积木名称\t数量\t高德斯编码\t精简编码\t图片\t备注\n';
        bricks.forEach((brick) => {
            textData += `${brick.name}\t${brick.quantity}\t${brick.gdsCode}\t${brick.shortGdsCode}\t${brick.image}\t${brick.remark || '-'}\n`;
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
                fallbackCopy(textData); // 使用备用方法
            });
        } else {
            fallbackCopy(textData); // 使用备用方法
        }
    }

    // 备用复制方法
    function fallbackCopy(textData) {
        const textArea = document.createElement('textarea');
        textArea.value = textData;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('✅ 已复制纯文本数据 (备用模式)', 'success');
        } catch (err) {
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

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createFloatingButton);
        } else {
            createFloatingButton();
        }
    }

    init();
})();
