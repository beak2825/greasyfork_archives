// ==UserScript==
// @name         腾讯会议-录制批量导出
// @description  腾讯会议录制批量导出文档视频
// @namespace    http://tampermonkey.net/
// @version      2024-04-01
// @description  try to take over the world!
// @author       ss
// @license      MIT
// @match        https://meeting.tencent.com/user-center/meeting-record
// @icon         http://javatt.top:9000/musi/x.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552870/%E8%85%BE%E8%AE%AF%E4%BC%9A%E8%AE%AE-%E5%BD%95%E5%88%B6%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552870/%E8%85%BE%E8%AE%AF%E4%BC%9A%E8%AE%AE-%E5%BD%95%E5%88%B6%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置区域 ====================
    // 目标元素选择器
    const TARGET_SELECTOR = 'li';

    // 目标元素文本内容
    const TARGET_TEXT = '导出';

    // 检查间隔隔（毫秒）
    const CHECK_INTERVAL = 1000;

    // 触发动作类型：'click'（点击）, 'dblclick'（双击）, 'hover'（悬停）
    const ACTION_TYPE = 'click';

    // 是否在控制台显示日志
    const SHOW_LOGS = true;
    // ==================================================

    // 全局变量
    let foundAndClicked = false;

    /**
     * 弹出Element UI风格的消息
     * @param msg 消息内容
     * @param type 消息类型：success, warning, error, info
     * @param time 显示时长(毫秒)
     */
    function msg(msg, type, time) {
        console.log(msg);

        // 消息类型配置
        const typeConfig = {
            success: {
                backgroundColor: '#f0f9eb',
                borderColor: '#e1f3d8',
                textColor: '#67c23a',
                icon: '✓'
            },
            warning: {
                backgroundColor: '#fdf6ec',
                borderColor: '#faecd8',
                textColor: '#e6a23c',
                icon: '⚠'
            },
            error: {
                backgroundColor: '#fef0f0',
                borderColor: '#fde2e2',
                textColor: '#f56c6c',
                icon: '✗'
            },
            info: {
                backgroundColor: '#f4f4f5',
                borderColor: '#ebeef5',
                textColor: '#909399',
                icon: 'i'
            }
        };

        // 默认为信息类型
        const config = typeConfig[type] || typeConfig.info;

        // 创建消息容器
        let messageContainer = document.createElement("div");
        messageContainer.className = "el-message";
        messageContainer.innerHTML = `
      <i class="el-message__icon">${config.icon}</i>
      <div class="el-message__content">${msg}</div>
    `;

        // 设置样式
        Object.assign(messageContainer.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 16px',
            backgroundColor: config.backgroundColor,
            border: `1px solid ${config.borderColor}`,
            borderRadius: '4px',
            color: config.textColor,
            fontSize: '14px',
            zIndex: '9999',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '280px',
            maxWidth: '50%',
            transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
            opacity: '0',
            marginTop: '-10px',
            boxSizing: 'border-box',
            textAlign: 'center'
        });

        // 设置图标样式
        const icon = messageContainer.querySelector('.el-message__icon');
        if (icon) {
            Object.assign(icon.style, {
                marginRight: '8px',
                fontSize: '16px',
                fontWeight: 'bold'
            });
        }

        time = time || 3000;

        // 将所有现有消息向下移动
        const existingMessages = document.querySelectorAll('.el-message');
        const messageHeight = 50; // 每条消息的高度（包括边距）

        existingMessages.forEach((msg, index) => {
            const currentTop = parseFloat(msg.style.top) || 20;
            msg.style.top = (currentTop + messageHeight) + 'px';
        });

        // 添加到页面
        document.body.appendChild(messageContainer);

        // 触发动画
        setTimeout(() => {
            messageContainer.style.opacity = '1';
            messageContainer.style.marginTop = '0';
        }, 10);

        // 消息自动消失
        setTimeout(() => {
            // 淡出效果
            messageContainer.style.opacity = '0';
            messageContainer.style.marginTop = '-10px';

            // 等待淡出动画完成后移除元素
            setTimeout(() => {
                if (document.body.contains(messageContainer)) {
                    document.body.removeChild(messageContainer);
                }

                // 重新调整剩余消息的位置
                const remainingMessages = document.querySelectorAll('.el-message');
                remainingMessages.forEach((msg, index) => {
                    msg.style.top = (20 + index * messageHeight) + 'px';
                });
            }, 30);
        }, time);
    }


    // 初始化函数
    function init() {
        msg('批量导出脚本已经加载');
        addPanel('批量导出脚本');
        appendButtonToPanel('开始导出', findSelected)
    }

    function addPanel(title) {
        const panel = document.createElement('div');
        panel.id = 'myPanel';

        panel.style.cssText = `
            position: fixed;
            top: 30%;
            right: 30%;
            z-index: 9999;
            padding: 5px;
            background-color: aqua;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        `;
        panel.innerHTML = `
            <h2  id="myPanelTitle" style="margin: 0;">${title}</h2>
            <div id="myPanelContent" style="background: aqua"></div>
        `;


        // 可拖拽
        // 拖拽功能
        let isDragging = false;
        let offsetX, offsetY;

        panel.addEventListener('mousedown', function (e) {
            if (e.target === panel || e.target.id === 'myPanelTitle') {
                isDragging = true;
                offsetX = e.clientX - panel.getBoundingClientRect().left;
                offsetY = e.clientY - panel.getBoundingClientRect().top;
                panel.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // 限制在可视区域内
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));

            panel.style.left = boundedX + 'px';
            panel.style.top = boundedY + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                panel.style.cursor = 'move';
            }
        });


        document.body.appendChild(panel);
    }

    /**
     *  追加按钮 到面板
     * @param text
     * @param callback
     */
    function appendButtonToPanel(text, callback) {
        const button = document.createElement('button');
        button.textContent = text || '导出';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#4CAF50';


        // 追加到面板内容中
        document.getElementById('myPanelContent').appendChild(button);


        button.addEventListener('click', callback);

    }


    async function findSelected() {
        try {
            // 获取选中的行
            const selectedRows = document.querySelectorAll('.RecordListTable_recordListRow__ysjYr.is-selected');

            if (selectedRows.length === 0) {
                msg('请选择一个数据','warning');
                return;
            }

            msg(`已选择 ${selectedRows.length} 条数据，开始处理...`);


            await sleep(2000);

            // 处理每条选中的数据
            for (let i = 0; i < selectedRows.length; i++) {
                const row = selectedRows[i];
                const rowIndex = i + 1;

                try {
                    msg(`开始处理第 ${rowIndex} 个数据`);
                    // 在当前行内查找复制图标，避免全局查找
                    const icon = row.querySelector('.met-icon-more--outlined');


                    // 在当前行内查找复制图标，避免全局查找
                    if (!icon) {
                        msg('未查询到icon','warning');
                    }
                    // 执行悬停操作
                    performAction(icon, 'hover');

                    // 等待下拉菜单显示
                    await sleep(600);

                    // 查找并点击导出选项
                    checkAndClickElement('li', "导出", 'click');

                    performAction(icon, 'leave');
                    // 等待下一个操作
                    await sleep(700);

                } catch (error) {
                    msg(`第 ${rowIndex} 个数据：处理出错 - ${error.message}`,'error');
                    // 继续处理下一个数据
                }
            }

            msg('所有选中数据处理完成');

        } catch (error) {
            msg(`处理过程中发生错误：${error.message}`);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 检查并点击元素
     * @param target_select 目标 选择器
     * @param target_text   目标 文本
     * @param action_type   操作类型
     */
    function checkAndClickElement(target_select, target_text, action_type) {
        try {
            // 如果已经找到并点击过，不再检查
            if (foundAndClicked) return;

            // 使用选择器查找元素
            const elements = document.querySelectorAll(target_select);

            if (elements.length === 0) {
                log('未找到匹配选择器的元素: ' + target_select);
                return;
            }

            // 遍历元素查找包含目标文本的元素
            let foundElement = null;

            elements.forEach(element => {
                if (element.textContent.trim() === target_text) {
                    foundElement = element;
                }
            });

            if (foundElement) {
                log('找到目标元素: ' + target_select + ' 文本: ' + target_text);

                // 执行指定的动作
                performAction(foundElement, action_type);


                // 标记为已找到并点击，防止重复操作
                foundAndClicked = false;

                // 可以选择停止监听或继续
                // stopListening();
            } else {
                log('找到 ' + elements.length + ' 个匹配选择器的元素，但未找到包含文本 "' + target_text + '" 的元素');
            }
        } catch (error) {
            log('检查元素时发生错误: ' + error.message, 'error');
        }
    }

    /**
     * 执行动作
     * @param element 目标元素
     * @param actionType 动作类型 click | dblclick | hover
     */
    function performAction(element, actionType) {
        switch (actionType) {
            case 'click':
                element.click();
                break;
            case 'dblclick':
                element.dispatchEvent(new Event('dblclick'));
                break;
            case 'hover':
                const event = new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                element.dispatchEvent(event);
                break;
            // 移走
            case 'leave':
                const leaveEvent = new MouseEvent('mouseout', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
                element.dispatchEvent(leaveEvent);
        }
    }

    // 日志函数
    function log(message, type = 'info') {
        if (!SHOW_LOGS) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString();

        let prefix = '[自动点击工具]';
        let consoleMethod = console.log;

        if (type === 'error') {
            consoleMethod = console.error;
            prefix = '[自动点击工具-错误]';
        } else if (type === 'warning') {
            consoleMethod = console.warn;
            prefix = '[自动点击工具-警告]';
        }

        consoleMethod(`%c${prefix} [${timeString}] ${message}`, 'color: #4285F4; font-weight: bold;');
    }


    // 页面加载完成后初始化
    window.addEventListener('load', function () {
        init();
    });


})();
