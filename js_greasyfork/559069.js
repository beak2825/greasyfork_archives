// ==UserScript==
// @name         TTG 一键购买并使用道具（50%/30%/Freeleech）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在种子详情页添加三个按钮，分别对应50%下载（2000积分）、30%下载（5000积分）、Freeleech（10000积分）。如果有可用道具会优先使用，如果已使用过会提示。
// @author       江畔
// @match        https://totheglory.im/t/*
// @match        https://totheglory.im/details.php?id=*
// @icon         https://totheglory.im/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      totheglory.im
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559069/TTG%20%E4%B8%80%E9%94%AE%E8%B4%AD%E4%B9%B0%E5%B9%B6%E4%BD%BF%E7%94%A8%E9%81%93%E5%85%B7%EF%BC%8850%2530%25Freeleech%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559069/TTG%20%E4%B8%80%E9%94%AE%E8%B4%AD%E4%B9%B0%E5%B9%B6%E4%BD%BF%E7%94%A8%E9%81%93%E5%85%B7%EF%BC%8850%2530%25Freeleech%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 道具配置
    const TOOLS = [
        {mid: 1, name: '50%下载', price: 2000, label: '50%下载 (2000)'},
        {mid: 2, name: '30%下载', price: 5000, label: '30%下载 (5000)'},
        {mid: 3, name: 'Freeleech', price: 10000, label: 'Freeleech (10000)'}
    ];

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 获取当前种子ID
        const torrentId = getTorrentId();
        if (!torrentId) {
            console.log('无法获取种子ID');
            return;
        }

        // 添加按钮
        addToolButtons(torrentId);
    }

    /**
     * 从URL中提取种子ID
     * 支持两种URL格式：
     * 1. https://totheglory.im/t/776377
     * 2. https://totheglory.im/details.php?id=776377
     */
    function getTorrentId() {
        // 尝试从短链接格式提取 /t/123456
        let match = window.location.pathname.match(/\/t\/(\d+)/);
        if (match) {
            return match[1];
        }
        
        // 尝试从完整链接格式提取 details.php?id=123456
        match = window.location.search.match(/[?&]id=(\d+)/);
        if (match) {
            return match[1];
        }
        
        return null;
    }

    /**
     * 检查道具使用状态
     * @returns {Object} {hasUsed: boolean, availableTools: Array<number>} availableTools是可用道具的mid数组
     */
    function checkToolStatus() {
        const seedTable = document.querySelector('table[width="750"]');
        if (!seedTable) {
            return {hasUsed: false, availableTools: []};
        }

        const tbody = seedTable.querySelector('tbody') || seedTable;
        const rows = tbody.querySelectorAll('tr');
        
        let hasUsed = false;
        const availableTools = [];

        // 查找"使用道具"行
        for (let row of rows) {
            const headingCell = row.querySelector('td.heading');
            if (headingCell && headingCell.textContent.includes('使用道具')) {
                const contentCell = row.querySelector('td[align="left"]');
                if (contentCell) {
                    const contentText = contentCell.textContent || '';
                    
                    // 检查是否已经使用过道具
                    if (contentText.includes('您已对本种子使用过道具') || 
                        contentText.includes('已使用过道具')) {
                        hasUsed = true;
                    }
                    
                    // 检查每个道具是否有可用的链接
                    TOOLS.forEach(tool => {
                        const toolLinks = contentCell.querySelectorAll('a.torrent_tool[mid="' + tool.mid + '"]');
                        if (toolLinks.length > 0) {
                            availableTools.push(tool.mid);
                        }
                    });
                }
                break;
            }
        }

        return {hasUsed, availableTools};
    }

    /**
     * 添加三个道具按钮
     */
    function addToolButtons(torrentId) {
        // 检查道具状态
        const status = checkToolStatus();
        
        // 如果已经使用过道具，不添加按钮
        if (status.hasUsed) {
            console.log('该种子已使用过道具，不添加按钮');
            return;
        }

        // 找到种子信息表格
        const seedTable = document.querySelector('table[width="750"]');
        if (!seedTable) {
            console.log('未找到种子信息表格');
            return;
        }

        const tbody = seedTable.querySelector('tbody') || seedTable;
        const rows = tbody.querySelectorAll('tr');
        
        let targetRow = null;
        let insertAfterRow = null;

        // 优先查找"使用道具"行
        for (let row of rows) {
            const headingCell = row.querySelector('td.heading');
            if (headingCell && headingCell.textContent.includes('使用道具')) {
                targetRow = row;
                break;
            }
        }

        // 如果没找到"使用道具"行，尝试在"加入收藏"行之后插入
        if (!targetRow) {
            for (let row of rows) {
                const headingCell = row.querySelector('td.heading');
                if (headingCell && headingCell.textContent.includes('加入收藏')) {
                    insertAfterRow = row;
                    break;
                }
            }
        }

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin-top: 10px; padding: 10px; border: 2px solid #FF8000; background-color: #FFF8DC; border-radius: 5px;';

        // 创建按钮组
        const buttonGroup = document.createElement('div');
        buttonGroup.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;';

        // 为每个道具创建按钮
        TOOLS.forEach(tool => {
            const hasAvailable = status.availableTools.includes(tool.mid);
            const button = createToolButton(tool, hasAvailable, torrentId);
            buttonGroup.appendChild(button);
        });

        buttonContainer.appendChild(buttonGroup);

        // 创建说明文字
        const description = document.createElement('p');
        description.style.cssText = 'margin: 0; font-size: 12px; color: #666;';
        description.innerHTML = '<b>说明：</b>点击按钮将自动购买并使用对应道具。如果已有可用道具，将直接使用，无需购买。';

        buttonContainer.appendChild(description);

        // 如果找到了"使用道具"行，直接添加到该行的内容单元格
        if (targetRow) {
            const contentCell = targetRow.querySelector('td[align="left"]');
            if (contentCell) {
                contentCell.appendChild(buttonContainer);
                return;
            }
        }

        // 如果没找到"使用道具"行，创建新行
        const newRow = document.createElement('tr');
        const headingCell = document.createElement('td');
        headingCell.className = 'heading';
        headingCell.setAttribute('valign', 'top');
        headingCell.setAttribute('align', 'right');
        headingCell.setAttribute('nowrap', '');
        headingCell.textContent = '使用道具';

        const contentCell = document.createElement('td');
        contentCell.setAttribute('valign', 'top');
        contentCell.setAttribute('align', 'left');
        contentCell.appendChild(buttonContainer);

        newRow.appendChild(headingCell);
        newRow.appendChild(contentCell);

        // 在合适的位置插入新行
        if (insertAfterRow && insertAfterRow.nextSibling) {
            insertAfterRow.parentNode.insertBefore(newRow, insertAfterRow.nextSibling);
        } else if (insertAfterRow) {
            insertAfterRow.parentNode.appendChild(newRow);
        } else {
            // 如果都没找到，就插入到表格末尾
            tbody.appendChild(newRow);
        }
    }

    /**
     * 创建道具按钮
     * @param {Object} tool 道具配置对象
     * @param {boolean} hasAvailable 是否有可用道具
     * @param {string} torrentId 种子ID
     * @returns {HTMLElement} 按钮元素
     */
    function createToolButton(tool, hasAvailable, torrentId) {
        const button = document.createElement('button');
        
        // 根据是否有可用道具，显示不同的按钮文字和样式
        if (hasAvailable) {
            button.textContent = tool.label + ' (已有)';
            button.style.cssText = 'padding: 8px 16px; font-size: 14px; font-weight: bold; color: white; background-color: #28a745; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s; flex: 1; min-width: 150px;';
        } else {
            button.textContent = tool.label;
            button.style.cssText = 'padding: 8px 16px; font-size: 14px; font-weight: bold; color: white; background-color: #FF8000; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s; flex: 1; min-width: 150px;';
        }
        
        // 鼠标悬停效果
        button.onmouseover = function() {
            if (hasAvailable) {
                this.style.backgroundColor = '#218838';
            } else {
                this.style.backgroundColor = '#FF6000';
            }
        };
        button.onmouseout = function() {
            if (hasAvailable) {
                this.style.backgroundColor = '#28a745';
            } else {
                this.style.backgroundColor = '#FF8000';
            }
        };

        // 点击事件
        button.onclick = function() {
            useTool(torrentId, tool, button, hasAvailable);
        };

        return button;
    }

    /**
     * 使用道具（自动购买或直接使用）
     * @param {string} torrentId 种子ID
     * @param {Object} tool 道具配置对象
     * @param {HTMLElement} button 按钮元素
     * @param {boolean} hasAvailable 是否有可用道具
     */
    function useTool(torrentId, tool, button, hasAvailable) {
        // 再次检查状态，防止状态变化
        const status = checkToolStatus();
        
        // 如果已经使用过道具，提示用户
        if (status.hasUsed) {
            alert('⚠️ 提示\n\n该种子已经使用过道具，无法重复使用。');
            return;
        }

        // 检查是否有可用道具（状态可能已更新）
        const currentlyAvailable = status.availableTools.includes(tool.mid);

        // 如果有可用道具，直接使用，不购买
        if (hasAvailable || currentlyAvailable) {
            // 确认使用已有道具
            if (!confirm('检测到您已有未使用的 ' + tool.name + ' 道具，是否直接使用？')) {
                return;
            }

            // 禁用按钮，防止重复点击
            button.disabled = true;
            button.textContent = '⏳ 正在使用道具...';
            button.style.cursor = 'not-allowed';
            button.style.backgroundColor = '#999';

            // 直接使用道具
            useToolItem(torrentId, tool.mid, function(success, message) {
                if (success) {
                    button.textContent = '✅ 完成！';
                    button.style.backgroundColor = '#28a745';
                    alert('✅ 操作成功！\n\n已成功使用 ' + tool.name + ' 道具。\n请刷新页面查看效果。');
                    
                    // 3秒后刷新页面
                    setTimeout(function() {
                        location.reload();
                    }, 3000);
                } else {
                    button.textContent = '❌ 使用失败';
                    button.style.backgroundColor = '#dc3545';
                    button.disabled = false;
                    button.style.cursor = 'pointer';
                    alert('❌ 使用道具失败：\n\n' + message + '\n\n请刷新页面后重试。');
                }
            });
            return;
        }

        // 如果没有可用道具，需要先购买
        // 确认操作
        if (!confirm('确认要花费 ' + tool.price + ' 积分购买并使用 ' + tool.name + ' 道具吗？\n\n此操作不可撤销，请确保您有足够的积分。')) {
            return;
        }

        // 禁用按钮，防止重复点击
        button.disabled = true;
        button.textContent = '⏳ 正在购买...';
        button.style.cursor = 'not-allowed';
        button.style.backgroundColor = '#999';

        // 第一步：购买道具
        buyTool(tool.mid, tool.price, function(success, message) {
            if (success) {
                button.textContent = '⏳ 购买成功，等待道具生效...';
                
                // 等待1秒确保购买操作完全完成，然后再使用道具
                setTimeout(function() {
                    button.textContent = '⏳ 正在使用道具...';
                    
                    // 第二步：使用道具
                    useToolItem(torrentId, tool.mid, function(success, message) {
                        if (success) {
                            button.textContent = '✅ 完成！';
                            button.style.backgroundColor = '#28a745';
                            alert('✅ 操作成功！\n\n已成功购买并使用 ' + tool.name + ' 道具。\n请刷新页面查看效果。');
                            
                            // 3秒后刷新页面
                            setTimeout(function() {
                                location.reload();
                            }, 3000);
                        } else {
                            button.textContent = '❌ 使用失败';
                            button.style.backgroundColor = '#dc3545';
                            button.disabled = false;
                            button.style.cursor = 'pointer';
                            alert('❌ 使用道具失败：\n\n' + message + '\n\n可能是道具尚未生效，请稍后手动使用，或刷新页面查看。');
                        }
                    });
                }, 1000);
            } else {
                button.textContent = '❌ 购买失败';
                button.style.backgroundColor = '#dc3545';
                button.disabled = false;
                button.style.cursor = 'pointer';
                alert('❌ 购买失败：\n\n' + message + '\n\n请检查您的积分是否足够（需要' + tool.price + '积分），或稍后重试。');
            }
        });
    }

    /**
     * 购买道具
     * @param {number} mid 道具ID
     * @param {number} price 道具价格
     * @param {Function} callback 回调函数
     */
    function buyTool(mid, price, callback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://totheglory.im/mall.php?action=exchange',
            data: 'mid=' + mid + '&quantity=1',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function(response) {
                console.log('购买响应状态:', response.status);
                console.log('购买响应URL:', response.finalUrl || response.responseURL);
                console.log('购买响应内容长度:', response.responseText ? response.responseText.length : 0);
                
                // 检查响应
                if (response.status === 200) {
                    const text = response.responseText || '';
                    const finalUrl = response.finalUrl || response.responseURL || '';
                    
                    // 检查是否购买成功
                    // 成功标志：跳转到商城页面、包含"我的商品"、包含道具名称且状态为"未使用"
                    if (finalUrl.includes('mall.php') || 
                        text.includes('我的商品') || 
                        text.includes('积分商城')) {
                        callback(true, '购买成功');
                    } 
                    // 检查失败情况
                    else if (text.includes('积分不足') || text.includes('不够') || text.includes('积分不够')) {
                        callback(false, '积分不足，请检查您的积分是否足够' + price + '分');
                    } else if (text.includes('权限') || text.includes('级别')) {
                        callback(false, '权限不足，您的级别可能不够');
                    } else if (text.includes('未上架') || text.includes('不存在')) {
                        callback(false, '商品不存在或未上架');
                    } else if (text.includes('错误') || text.includes('失败')) {
                        callback(false, '购买失败：' + (text.match(/错误[：:](.+)/) || text.match(/失败[：:](.+)/) || ['未知错误'])[0]);
                    } else {
                        // 如果响应包含HTML内容且没有明确的错误信息，假设成功
                        // 因为购买成功后通常会返回HTML页面
                        if (text.length > 1000 || text.includes('</html>') || text.includes('</body>')) {
                            callback(true, '购买请求已发送，正在处理...');
                        } else {
                            callback(false, '无法确定购买结果，请手动检查');
                        }
                    }
                } else {
                    callback(false, '服务器返回错误: ' + response.status);
                }
            },
            onerror: function(error) {
                console.error('购买失败:', error);
                callback(false, '网络请求失败，请检查网络连接');
            }
        });
    }

    /**
     * 使用道具
     * @param {string} torrentId 种子ID
     * @param {number} mid 道具ID
     * @param {Function} callback 回调函数
     */
    function useToolItem(torrentId, mid, callback) {
        // 构造使用道具的参数
        const params = 'c=torrents&tid=' + torrentId + '&mid=' + mid;

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://totheglory.im/usemall.php',
            data: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function(response) {
                console.log('使用道具响应:', response.responseText);
                
                // 检查响应
                if (response.status === 200) {
                    const text = response.responseText;
                    if (text.includes('成功')) {
                        callback(true, '使用成功');
                    } else if (text.includes('没有') || text.includes('不足')) {
                        callback(false, '没有可用的道具');
                    } else if (text.includes('已使用')) {
                        callback(false, '该种子已使用过道具');
                    } else {
                        // 如果响应不为空，假设成功
                        callback(true, text || '使用请求已发送');
                    }
                } else {
                    callback(false, '服务器返回错误: ' + response.status);
                }
            },
            onerror: function(error) {
                console.error('使用道具失败:', error);
                callback(false, '网络请求失败');
            }
        });
    }

    console.log('TTG 一键道具脚本已加载');
})();
