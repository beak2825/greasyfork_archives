// ==UserScript==
// @name         Nodeloc抽奖帖子排序器
// @namespace    http://www.nodeloc.com/
// @version      1.0.0
// @description  为nodeloc.com论坛的抽奖帖子添加参与者排序功能，按照奖券数量排序
// @author       Assistant
// @match        https://www.nodeloc.com/t/topic/*
// @match        https://nodeloc.cc/t/topic/*
// @license      MIT
// @icon         https://www.nodeloc.com/uploads/default/original/1X/8ab9e33c8eed4135d9f2b8af6e6b7cc16ec4228e.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550755/Nodeloc%E6%8A%BD%E5%A5%96%E5%B8%96%E5%AD%90%E6%8E%92%E5%BA%8F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550755/Nodeloc%E6%8A%BD%E5%A5%96%E5%B8%96%E5%AD%90%E6%8E%92%E5%BA%8F%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isSorted = false;
    let originalOrder = [];

    // 检查是否为抽奖帖子
    function isLotteryPost() {
        const lotteryContainer = document.querySelector('#post_1 > div.post__row.row > div.post__body.topic-body.clearfix > div.post__regular.regular.post__contents.contents > div > div.lottery-container');
        return !!lotteryContainer;
    }

    // 获取参与者列表容器
    function getParticipantContainer() {
        return document.querySelector('#post_1 > div.post__row.row > div.post__body.topic-body.clearfix > div.post__regular.regular.post__contents.contents > div > div.lottery-container > div.lottery-participants > div');
    }

    // 创建查看排序按钮
    function createSortButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px; vertical-align: middle;">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            查看排行榜
        `;
        button.id = 'lottery-sort-button';
        button.style.cssText = `
            padding: 8px 16px;
            font-size: 12px;
            font-weight: 600;
            color: #ffffff;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.35);
            display: inline-flex;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            user-select: none;
            margin-left: 10px;
            margin-top: 5px;
        `;

        // 悬停效果
        button.onmouseover = function() {
            this.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)';
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.45)';
        };
        button.onmouseout = function() {
            this.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.35)';
        };

        // 点击效果
        button.onmousedown = function() {
            this.style.transform = 'scale(0.95)';
        };
        button.onmouseup = function() {
            this.style.transform = 'scale(1.05)';
        };

        return button;
    }

    // 提取参与者信息
    function extractParticipantInfo(participantElement) {
        const titleAttr = participantElement.getAttribute('title');
        if (!titleAttr) return null;

        // 匹配格式：用户名（数字 奖券）
        const match = titleAttr.match(/^(.+?)（(\d+)\s*奖券\)$/);
        if (!match) return null;

        // 获取头像
        const img = participantElement.querySelector('img');
        const avatar = img ? img.getAttribute('src') : '';
        const userUrl = participantElement.getAttribute('href') || '';

        return {
            username: match[1],
            tickets: parseInt(match[2]),
            avatar: avatar,
            userUrl: userUrl,
            element: participantElement
        };
    }

    // 获取所有参与者
    function getAllParticipants(container) {
        const participantLinks = container.querySelectorAll('a[title*="奖券"]');
        const participants = [];

        participantLinks.forEach(link => {
            const info = extractParticipantInfo(link);
            if (info) {
                participants.push(info);
            }
        });

        return participants;
    }

    // 排序参与者（按奖券数量从大到小）
    function sortParticipants(participants) {
        return participants.sort((a, b) => b.tickets - a.tickets);
    }

    // 创建排行榜对话框
    function createRankingDialog(participants) {
        // 创建背景遮罩
        const overlay = document.createElement('div');
        overlay.id = 'lottery-ranking-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
        `;

        // 创建对话框
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            max-height: 80vh;
            width: 90%;
            overflow: hidden;
            position: relative;
        `;

        // 创建标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 20px 24px;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>🏆 抽奖排行榜 (共 ${participants.length} 人参与)</span>
            <button id="close-ranking-dialog" style="
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s;
            " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='none'">×</button>
        `;

        // 创建内容区域
        const content = document.createElement('div');
        content.style.cssText = `
            max-height: 500px;
            overflow-y: auto;
            padding: 0;
        `;

        // 创建表格
        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        `;

        // 创建表头
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; width: 60px;">排名</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; width: 60px;">头像</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151;">用户名</th>
                <th style="padding: 12px 16px; text-align: center; font-weight: 600; color: #374151; width: 100px;">奖券数</th>
            </tr>
        `;
        table.appendChild(thead);

        // 创建表体
        const tbody = document.createElement('tbody');
        participants.forEach((participant, index) => {
            const row = document.createElement('tr');
            row.style.cssText = `
                border-bottom: 1px solid #e2e8f0;
                transition: background 0.2s;
            `;
            row.onmouseover = function() { this.style.background = '#f8fafc'; };
            row.onmouseout = function() { this.style.background = 'white'; };

            // 排名徽章样式
            let rankBadge = `<span style="
                background: #e2e8f0;
                color: #64748b;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            ">${index + 1}</span>`;

            if (index === 0) {
                rankBadge = `<span style="
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                ">🥇 ${index + 1}</span>`;
            } else if (index === 1) {
                rankBadge = `<span style="
                    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                ">🥈 ${index + 1}</span>`;
            } else if (index === 2) {
                rankBadge = `<span style="
                    background: linear-gradient(135deg, #cd7c0f 0%, #92400e 100%);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                ">🥉 ${index + 1}</span>`;
            }

            row.innerHTML = `
                <td style="padding: 12px 16px; text-align: left;">${rankBadge}</td>
                <td style="padding: 12px 16px; text-align: left;">
                    <img src="${participant.avatar}" style="
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        border: 2px solid #e2e8f0;
                    " onerror="this.style.display='none'">
                </td>
                <td style="padding: 12px 16px; text-align: left;">
                    <a href="${participant.userUrl}" target="_blank" style="
                        color: #3b82f6;
                        text-decoration: none;
                        font-weight: 500;
                    " onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                        ${participant.username}
                    </a>
                </td>
                <td style="padding: 12px 16px; text-align: center;">
                    <span style="
                        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                        color: white;
                        padding: 4px 12px;
                        border-radius: 16px;
                        font-size: 12px;
                        font-weight: 600;
                    ">${participant.tickets} 张</span>
                </td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        content.appendChild(table);

        dialog.appendChild(header);
        dialog.appendChild(content);
        overlay.appendChild(dialog);

        // 关闭对话框事件
        const closeButton = header.querySelector('#close-ranking-dialog');
        const closeDialog = () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
            }, 200);
        };

        closeButton.addEventListener('click', closeDialog);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeDialog();
            }
        });

        // 显示动画
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.2s ease-out';
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);

        return overlay;
    }

    // 显示成功提示
    function showToast(message, type = 'success') {
        // 移除已存在的提示
        const existingToast = document.getElementById('lottery-sort-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'lottery-sort-toast';
        
        const bgColor = type === 'success' 
            ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        
        const icon = type === 'success'
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

        toast.innerHTML = `
            <div style="display: flex; align-items: center;">
                ${icon}
                <span style="color: #ffffff; font-weight: 500; margin-left: 8px;">${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            font-size: 14px;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    // 处理查看排行榜点击
    function handleRankingClick() {
        const container = getParticipantContainer();
        if (!container) {
            showToast('未找到参与者列表', 'error');
            return;
        }

        // 获取参与者信息
        const participants = getAllParticipants(container);
        
        if (participants.length === 0) {
            showToast('未找到参与者信息', 'error');
            return;
        }

        // 排序
        const sortedParticipants = sortParticipants(participants);

        // 显示排行榜对话框
        createRankingDialog(sortedParticipants);
    }

    // 初始化脚本
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 检查是否为抽奖帖子
        if (!isLotteryPost()) {
            console.log('当前不是抽奖帖子');
            return;
        }

        // 查找参与者容器
        const container = getParticipantContainer();
        if (!container) {
            console.log('未找到参与者列表容器');
            return;
        }

        // 检查是否已经添加了排序按钮
        if (document.getElementById('lottery-sort-button')) {
            return;
        }

        // 创建并添加查看排行榜按钮
        const sortButton = createSortButton();
        sortButton.addEventListener('click', handleRankingClick);

        // 将按钮添加到参与者容器后面
        container.parentNode.insertBefore(sortButton, container.nextSibling);

        console.log('抽奖排序按钮已添加');
    }

    // 监听页面变化（处理SPA导航）
    function observePageChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // 检查是否有新的内容加载
                    setTimeout(init, 1000); // 延迟执行，确保内容完全加载
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动脚本
    init();
    observePageChanges();

})();