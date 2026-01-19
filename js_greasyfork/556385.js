// ==UserScript==
// @name         按钮管理面板
// @namespace    http://tampermonkey.net/
// @version      1.0.21
// @description  管理聊天按钮的添加、编辑、删除和保存
// @author       ZeroDream
// @match        https://fishpi.cn/cr
// @icon         https://fishpi.cn/images/favicon.png
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/556385/%E6%8C%89%E9%92%AE%E7%AE%A1%E7%90%86%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/556385/%E6%8C%89%E9%92%AE%E7%AE%A1%E7%90%86%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==
//ZeroDream 2026-1-19 添加multiMessage属性 用于判断是否发送多条消息
//ZeroDream 2026-1-20 add 红包功能参考muli
(function () {
    'use strict';
    const version_us = "v1.0.21";
    // 按钮数据结构：{id, textContent, message, className, count, hidden, multiMessage, actionType, redPacketConfig}
    // actionType: 'message' (发送消息) | 'redPacket' (发送红包)
    // redPacketConfig: {type, money, count, msg, recivers, gesture} (仅红包类型使用)
    let buttonsConfig = [];
    const STORAGE_KEY = 'customButtonsConfig';
    const DEFAULT_BUTTONS = [
        { id: 'default-bingbing', textContent: '打劫', message: '冰冰 去打劫', className: 'red', count: 0, hidden: false },
        { id: 'default-ge', textContent: '鸽', message: '鸽 行行好吧', className: 'red', count: 0, hidden: false }
    ];
    
    // 颜色选项 - 全局常量
    const colorOptions = [
        { value: 'red', text: '红色' },
        { value: 'blue', text: '蓝色' },
        { value: 'green', text: '绿色' },
        { value: 'gray', text: '灰色' },
        { value: 'orange', text: '橙色' }
    ];
    
    // 动作类型选项
    const actionTypeOptions = [
        { value: 'message', text: '发送消息' },
        { value: 'redPacket', text: '发送红包' }
    ];
    
    // 红包类型选项
    const redPacketTypes = [
        { value: '拼手气红包', text: '拼手气红包' },
        { value: '普通红包', text: '普通红包' },
        { value: '专属红包', text: '专属红包' },
        { value: '心跳红包', text: '心跳红包' },
        { value: '猜拳红包', text: '猜拳红包' }
    ];
    
    // 猜拳手势选项
    const gestureOptions = [
        { value: '无', text: '无（提示选择）' },
        { value: '石头', text: '石头' },
        { value: '剪刀', text: '剪刀' },
        { value: '布', text: '布' }
    ];
    
    // 更新按钮列表的函数 - 全局函数
    window.updateButtonsList = function() {
        const listContainer = document.getElementById('buttons-list');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        
        if (buttonsConfig.length === 0) {
            const emptyText = document.createElement('div');
            emptyText.textContent = '暂无按钮，请添加新按钮';
            emptyText.style.textAlign = 'center';
            emptyText.style.color = '#999';
            emptyText.style.padding = '20px';
            listContainer.appendChild(emptyText);
            return;
        }
        
        buttonsConfig.forEach((button, index) => {
            const buttonItem = document.createElement('div');
            buttonItem.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 15px;
                background: #fff;
                border: 1px solid #e8e8e8;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
            `;
            
            // 添加悬停效果
            buttonItem.addEventListener('mouseenter', () => {
                buttonItem.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                buttonItem.style.borderColor = '#d9d9d9';
            });
            
            buttonItem.addEventListener('mouseleave', () => {
                buttonItem.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                buttonItem.style.borderColor = '#e8e8e8';
            });
            
            // 按钮信息
            const buttonInfo = document.createElement('div');
            buttonInfo.style.flex = '1';
            buttonInfo.style.minWidth = '0'; // 确保flex项可以收缩
            buttonInfo.style.marginRight = '15px';
            buttonInfo.style.overflow = 'hidden';
            
            const buttonText = document.createElement('div');
            buttonText.style.fontWeight = '500';
            buttonText.style.marginBottom = '6px';
            buttonText.style.color = '#262626';
            buttonText.style.fontSize = '14px';
            buttonText.style.whiteSpace = 'nowrap';
            buttonText.style.overflow = 'hidden';
            buttonText.style.textOverflow = 'ellipsis';
            buttonText.title = button.textContent; // 添加tooltip显示完整文本
            buttonText.textContent = button.textContent;
            
            const buttonMsg = document.createElement('div');
            buttonMsg.style.fontSize = '12px';
            buttonMsg.style.color = '#8c8c8c';
            buttonMsg.style.lineHeight = '1.4';
            buttonMsg.style.whiteSpace = 'nowrap';
            buttonMsg.style.overflow = 'hidden';
            buttonMsg.style.textOverflow = 'ellipsis';
            buttonMsg.title = '消息: ' + button.message; // 添加tooltip显示完整文本
            buttonMsg.textContent = '消息: ' + button.message;
            
            buttonInfo.appendChild(buttonText);
            
            // 点击次数显示
            const buttonCount = document.createElement('div');
            buttonCount.style.fontSize = '12px';
            buttonCount.style.color = '#1890ff';
            buttonCount.style.marginBottom = '4px';
            buttonCount.textContent = '点击次数: ' + button.count;
            buttonInfo.appendChild(buttonCount);
            
            // 隐藏状态显示
            const buttonStatus = document.createElement('div');
            buttonStatus.style.fontSize = '12px';
            buttonStatus.style.color = button.hidden ? '#ff4d4f' : '#52c41a';
            buttonStatus.style.marginBottom = '4px';
            buttonStatus.textContent = '状态: ' + (button.hidden ? '隐藏' : '显示');
            buttonInfo.appendChild(buttonStatus);
            
            // 发送类型显示
            const actionTypeStatus = document.createElement('div');
            actionTypeStatus.style.fontSize = '12px';
            actionTypeStatus.style.color = button.actionType === 'redPacket' ? '#eb2f96' : '#1890ff';
            actionTypeStatus.style.marginBottom = '4px';
            actionTypeStatus.textContent = '类型: ' + (button.actionType === 'redPacket' ? '红包' : '消息');
            buttonInfo.appendChild(actionTypeStatus);
            
            // 多条消息状态显示
            const multiMessageStatus = document.createElement('div');
            multiMessageStatus.style.fontSize = '12px';
            multiMessageStatus.style.color = button.multiMessage ? '#1890ff' : '#8c8c8c';
            multiMessageStatus.style.marginBottom = '4px';
            multiMessageStatus.textContent = '发送: ' + (button.multiMessage ? '多条' : '单条');
            buttonInfo.appendChild(multiMessageStatus);
            
            buttonInfo.appendChild(buttonMsg);
            
            // 操作按钮容器
            const actionsDiv = document.createElement('div');
            actionsDiv.style.display = 'flex';
            actionsDiv.style.gap = '8px';
            
            // 编辑按钮
            const editBtn = document.createElement('button');
            editBtn.textContent = '编辑';
            editBtn.style.cssText = `
                padding: 6px 12px;
                background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(250, 173, 20, 0.2);
            `;
            
            editBtn.addEventListener('mouseenter', () => {
                editBtn.style.background = 'linear-gradient(135deg, #ffc53d 0%, #faad14 100%)';
                editBtn.style.boxShadow = '0 4px 12px rgba(250, 173, 20, 0.3)';
                editBtn.style.transform = 'translateY(-1px)';
            });
            
            editBtn.addEventListener('mouseleave', () => {
                editBtn.style.background = 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)';
                editBtn.style.boxShadow = '0 2px 4px rgba(250, 173, 20, 0.2)';
                editBtn.style.transform = 'translateY(0)';
            });
            
            editBtn.onclick = function() {
                window.editButton(index);
            };
            
            // 删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.style.cssText = `
                padding: 6px 12px;
                background: linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(245, 34, 45, 0.2);
            `;
            
            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.background = 'linear-gradient(135deg, #ff4d4f 0%, #f5222d 100%)';
                deleteBtn.style.boxShadow = '0 4px 12px rgba(245, 34, 45, 0.3)';
                deleteBtn.style.transform = 'translateY(-1px)';
            });
            
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.background = 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)';
                deleteBtn.style.boxShadow = '0 2px 4px rgba(245, 34, 45, 0.2)';
                deleteBtn.style.transform = 'translateY(0)';
            });
            
            deleteBtn.onclick = function() {
                if (confirm('确定要删除按钮「' + button.textContent + '」吗？')) {
                    // 从配置中删除
                    buttonsConfig.splice(index, 1);
                    saveButtonsConfig();
                    
                    // 重新创建按钮
                    createButtons();
                    
                    // 更新管理面板
                    updateButtonsList();
                    
                    // 显示成功提示
                    showNotification('按钮删除成功！');
                }
            };
            
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            
            buttonItem.appendChild(buttonInfo);
            buttonItem.appendChild(actionsDiv);
            
            listContainer.appendChild(buttonItem);
        });
    }
    
    // 编辑按钮的函数 - 全局函数
window.editButton = function(index) {
        const button = buttonsConfig[index];
        
        // 创建编辑对话框
        const editDialog = document.createElement('div');
        editDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
        `;
        
        // 对话框标题
        const dialogTitle = document.createElement('h4');
        dialogTitle.textContent = '编辑按钮';
        dialogTitle.style.marginTop = '0';
        dialogTitle.style.textAlign = 'center';
        dialogTitle.style.marginBottom = '15px';
        editDialog.appendChild(dialogTitle);
        
        // 按钮文本输入
        const textInputDiv = document.createElement('div');
        textInputDiv.style.marginBottom = '10px';
        const textLabel = document.createElement('label');
        textLabel.textContent = '按钮文本: ';
        textLabel.style.display = 'inline-block';
        textLabel.style.width = '80px';
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = button.textContent;
        textInput.style.width = 'calc(100% - 90px)';
        textInput.style.padding = '5px';
        textInputDiv.appendChild(textLabel);
        textInputDiv.appendChild(textInput);
        editDialog.appendChild(textInputDiv);
        
        // 按钮消息输入
        const msgInputDiv = document.createElement('div');
        msgInputDiv.style.marginBottom = '10px';
        msgInputDiv.style.display = 'flex';
        msgInputDiv.style.flexDirection = 'column';
        const msgLabel = document.createElement('label');
        msgLabel.textContent = '触发消息: ';
        msgLabel.style.marginBottom = '5px';
        const msgInput = document.createElement('textarea');
        msgInput.value = button.message;
        msgInput.rows = 4;
        msgInput.style.width = '100%';
        msgInput.style.padding = '5px';
        msgInput.style.resize = 'vertical';
        msgInputDiv.appendChild(msgLabel);
        msgInputDiv.appendChild(msgInput);
        editDialog.appendChild(msgInputDiv);
        
        // 按钮颜色选择
        const colorSelectDiv = document.createElement('div');
        colorSelectDiv.style.marginBottom = '15px';
        const colorLabel = document.createElement('label');
        colorLabel.textContent = '按钮颜色: ';
        colorLabel.style.display = 'inline-block';
        colorLabel.style.width = '80px';
        const colorSelect = document.createElement('select');
        colorSelect.style.width = 'calc(100% - 90px)';
        colorSelect.style.padding = '5px';
        
        colorOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            if (option.value === button.className) {
                opt.selected = true;
            }
            colorSelect.appendChild(opt);
        });
        
        colorSelectDiv.appendChild(colorLabel);
        colorSelectDiv.appendChild(colorSelect);
        editDialog.appendChild(colorSelectDiv);
        
        // 隐藏选项
        const hiddenSelectDiv = document.createElement('div');
        hiddenSelectDiv.style.marginBottom = '15px';
        const hiddenLabel = document.createElement('label');
        hiddenLabel.textContent = '隐藏按钮: ';
        hiddenLabel.style.display = 'inline-block';
        hiddenLabel.style.width = '80px';
        const hiddenCheckbox = document.createElement('input');
        hiddenCheckbox.type = 'checkbox';
        hiddenCheckbox.checked = button.hidden || false;
        hiddenCheckbox.style.marginTop = '5px';
        hiddenSelectDiv.appendChild(hiddenLabel);
        hiddenSelectDiv.appendChild(hiddenCheckbox);
        editDialog.appendChild(hiddenSelectDiv);
        
        // 多条消息选项
        const multiMessageDiv = document.createElement('div');
        multiMessageDiv.style.marginBottom = '15px';
        const multiMessageLabel = document.createElement('label');
        multiMessageLabel.textContent = '多条消息: ';
        multiMessageLabel.style.display = 'inline-block';
        multiMessageLabel.style.width = '80px';
        const multiMessageCheckbox = document.createElement('input');
        multiMessageCheckbox.type = 'checkbox';
        multiMessageCheckbox.checked = button.multiMessage || false;
        multiMessageCheckbox.style.marginTop = '5px';
        multiMessageDiv.appendChild(multiMessageLabel);
        multiMessageDiv.appendChild(multiMessageCheckbox);
        editDialog.appendChild(multiMessageDiv);
        
        // 动作类型选择
        const actionTypeDiv = document.createElement('div');
        actionTypeDiv.style.marginBottom = '15px';
        const actionTypeLabel = document.createElement('label');
        actionTypeLabel.textContent = '动作类型: ';
        actionTypeLabel.style.display = 'inline-block';
        actionTypeLabel.style.width = '80px';
        const actionTypeSelect = document.createElement('select');
        actionTypeSelect.style.width = 'calc(100% - 90px)';
        actionTypeSelect.style.padding = '5px';
        
        actionTypeOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            if ((option.value === 'redPacket') === (button.actionType === 'redPacket')) {
                opt.selected = true;
            }
            actionTypeSelect.appendChild(opt);
        });
        
        actionTypeDiv.appendChild(actionTypeLabel);
        actionTypeDiv.appendChild(actionTypeSelect);
        editDialog.appendChild(actionTypeDiv);
        
        // 红包配置区域
        const redPacketConfigDiv = document.createElement('div');
        redPacketConfigDiv.id = 'red-packet-config';
        redPacketConfigDiv.style.marginBottom = '15px';
        redPacketConfigDiv.style.padding = '10px';
        redPacketConfigDiv.style.border = '1px solid #d9d9d9';
        redPacketConfigDiv.style.borderRadius = '6px';
        redPacketConfigDiv.style.display = button.actionType === 'redPacket' ? 'block' : 'none';
        
        // 红包类型选择
        const typeLabel = document.createElement('label');
        typeLabel.textContent = '红包类型: ';
        typeLabel.style.display = 'block';
        typeLabel.style.marginBottom = '5px';
        typeLabel.style.marginTop = '5px';
        const typeSelect = document.createElement('select');
        typeSelect.id = 'red-packet-type';
        typeSelect.style.width = '100%';
        typeSelect.style.padding = '5px';
        typeSelect.style.marginBottom = '10px';
        
        redPacketTypes.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            if (option.value === (button.redPacketConfig && button.redPacketConfig.type)) {
                opt.selected = true;
            }
            typeSelect.appendChild(opt);
        });
        redPacketConfigDiv.appendChild(typeLabel);
        redPacketConfigDiv.appendChild(typeSelect);
        
        // 金额输入
        const moneyLabel = document.createElement('label');
        moneyLabel.textContent = '红包金额: ';
        moneyLabel.style.display = 'block';
        moneyLabel.style.marginBottom = '5px';
        const moneyInput = document.createElement('input');
        moneyInput.type = 'text';
        moneyInput.id = 'red-packet-money';
        moneyInput.value = button.redPacketConfig && button.redPacketConfig.money ? button.redPacketConfig.money : '';
        moneyInput.style.width = '100%';
        moneyInput.style.padding = '5px';
        moneyInput.style.marginBottom = '10px';
        moneyInput.placeholder = '留空则提示输入';
        redPacketConfigDiv.appendChild(moneyLabel);
        redPacketConfigDiv.appendChild(moneyInput);
        
        // 数量输入
        const countLabel = document.createElement('label');
        countLabel.textContent = '红包数量: ';
        countLabel.style.display = 'block';
        countLabel.style.marginBottom = '5px';
        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.id = 'red-packet-count';
        countInput.value = button.redPacketConfig && button.redPacketConfig.count ? button.redPacketConfig.count : '1';
        countInput.style.width = '100%';
        countInput.style.padding = '5px';
        countInput.style.marginBottom = '10px';
        redPacketConfigDiv.appendChild(countLabel);
        redPacketConfigDiv.appendChild(countInput);
        
        // 红包消息输入
        const redPacketMsgLabel = document.createElement('label');
        redPacketMsgLabel.textContent = '红包消息: ';
        redPacketMsgLabel.style.display = 'block';
        redPacketMsgLabel.style.marginBottom = '5px';
        const redPacketMsgInput = document.createElement('input');
        redPacketMsgInput.type = 'text';
        redPacketMsgInput.id = 'red-packet-msg';
        redPacketMsgInput.value = button.redPacketConfig && button.redPacketConfig.msg ? button.redPacketConfig.msg : '';
        redPacketMsgInput.style.width = '100%';
        redPacketMsgInput.style.padding = '5px';
        redPacketMsgInput.style.marginBottom = '10px';
        redPacketMsgInput.placeholder = '留空则使用默认消息';
        redPacketConfigDiv.appendChild(redPacketMsgLabel);
        redPacketConfigDiv.appendChild(redPacketMsgInput);
        
        // 专属用户输入（仅当选择专属红包时显示）
        const reciversDiv = document.createElement('div');
        reciversDiv.id = 'red-packet-recivers-div';
        reciversDiv.style.marginBottom = '10px';
        reciversDiv.style.display = (button.redPacketConfig && button.redPacketConfig.type) === '专属红包' ? 'block' : 'none';
        const reciversLabel = document.createElement('label');
        reciversLabel.textContent = '专属用户: ';
        reciversLabel.style.display = 'block';
        reciversLabel.style.marginBottom = '5px';
        const reciversInput = document.createElement('input');
        reciversInput.type = 'text';
        reciversInput.id = 'red-packet-recivers';
        reciversInput.value = button.redPacketConfig && button.redPacketConfig.recivers && button.redPacketConfig.recivers[0] ? button.redPacketConfig.recivers[0] : '';
        reciversInput.style.width = '100%';
        reciversInput.style.padding = '5px';
        reciversInput.placeholder = '留空则提示输入';
        reciversDiv.appendChild(reciversLabel);
        reciversDiv.appendChild(reciversInput);
        redPacketConfigDiv.appendChild(reciversDiv);
        
        // 手势选择（仅当选择猜拳红包时显示）
        const gestureDiv = document.createElement('div');
        gestureDiv.id = 'red-packet-gesture-div';
        gestureDiv.style.marginBottom = '10px';
        gestureDiv.style.display = (button.redPacketConfig && button.redPacketConfig.type) === '猜拳红包' ? 'block' : 'none';
        const gestureLabel = document.createElement('label');
        gestureLabel.textContent = '猜拳手势: ';
        gestureLabel.style.display = 'block';
        gestureLabel.style.marginBottom = '5px';
        const gestureSelect = document.createElement('select');
        gestureSelect.id = 'red-packet-gesture';
        gestureSelect.style.width = '100%';
        gestureSelect.style.padding = '5px';
        
        gestureOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            if (option.value === (button.redPacketConfig && button.redPacketConfig.gesture)) {
                opt.selected = true;
            }
            gestureSelect.appendChild(opt);
        });
        gestureDiv.appendChild(gestureLabel);
        gestureDiv.appendChild(gestureSelect);
        redPacketConfigDiv.appendChild(gestureDiv);
        
        editDialog.appendChild(redPacketConfigDiv);
        
        // 监听动作类型变化
        actionTypeSelect.addEventListener('change', function() {
            redPacketConfigDiv.style.display = this.value === 'redPacket' ? 'block' : 'none';
        });
        
        // 监听红包类型变化
        typeSelect.addEventListener('change', function() {
            reciversDiv.style.display = this.value === '专属红包' ? 'block' : 'none';
            gestureDiv.style.display = this.value === '猜拳红包' ? 'block' : 'none';
        });
        
        // 按钮容器
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.gap = '10px';
        buttonsDiv.style.justifyContent = 'flex-end';
        
        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = `
            padding: 6px 12px;
            background: #f0f0f0;
            color: #333;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        
        cancelBtn.onclick = function() {
            document.body.removeChild(editDialog);
        };
        
        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.style.cssText = `
            padding: 6px 12px;
            background: #52c41a;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        
        saveBtn.onclick = function() {
            const buttonText = textInput.value.trim();
            const buttonMsg = msgInput.value.trim();
            const isHidden = hiddenCheckbox.checked;
            const selectedActionType = actionTypeSelect.value;
            
            if (!buttonText) {
                alert('请填写按钮文本');
                return;
            }
            
            if (selectedActionType === 'message' && !buttonMsg) {
                alert('请填写触发消息');
                return;
            }
            
            // 构建配置对象
            const newConfig = {
                id: button.id,
                textContent: buttonText,
                className: colorSelect.value,
                count: button.count || 0,
                hidden: isHidden,
                multiMessage: multiMessageCheckbox.checked,
                actionType: selectedActionType
            };
            
            // 如果是消息类型，保存消息内容
            if (selectedActionType === 'message') {
                newConfig.message = buttonMsg;
                newConfig.redPacketConfig = null;
            } else {
                // 如果是红包类型，保存红包配置
                newConfig.message = '';
                newConfig.redPacketConfig = {
                    type: typeSelect.value,
                    money: moneyInput.value.trim(),
                    count: countInput.value,
                    msg: msgInput.value.trim(),
                    recivers: reciversInput.value.trim() ? [reciversInput.value.trim()] : [""],
                    gesture: gestureSelect.value
                };
            }
            
            // 更新按钮配置
            buttonsConfig[index] = newConfig;
            
            saveButtonsConfig();
            
            // 重新创建按钮
            createButtons();
            
            // 更新管理面板 - 使用全局函数
            window.updateButtonsList();
            
            // 关闭编辑对话框
            document.body.removeChild(editDialog);
            
            // 显示成功提示
            showNotification('按钮更新成功！');
        };
        
        buttonsDiv.appendChild(cancelBtn);
        buttonsDiv.appendChild(saveBtn);
        editDialog.appendChild(buttonsDiv);
        
        // 添加到页面
        document.body.appendChild(editDialog);
    }
    
    // 冷却系统
    function startCooldown(btn, seconds) {
        const originalText = btn.textContent;
        let remaining = seconds;
        
        // 添加冷却样式
        btn.classList.add('cooldown');
        
        // 保存原始文本
        btn.dataset.originalText = originalText;
        
        // 开始冷却
        btn.textContent = `${originalText} (${remaining}s)`;
        
        const timer = setInterval(() => {
            remaining--;
            btn.textContent = `${originalText} (${remaining}s)`;
            
            if (remaining <= 0) {
                clearInterval(timer);
                // 恢复原始状态
                btn.textContent = originalText;
                btn.classList.remove('cooldown');
                delete btn.dataset.originalText;
            }
        }, 1000);
    }

    // 按钮工厂 - 用于创建按钮
    const buttonFactory = {
        create: (config) => {
            const btn = document.createElement('button');
            btn.id = config.id;
            btn.textContent = config.textContent;
            btn.className = config.className || 'red';
            btn.setAttribute('style', 'margin-right:5px; margin-bottom:5px; padding:4px 8px; border-radius: 4px;');
            
            btn.onclick = function() {
                // 根据 actionType 决定发送类型
                if (config.actionType === 'redPacket') {
                    // 发送红包
                    if (config.redPacketConfig) {
                        sendRedPacketMsg(config.redPacketConfig);
                        config.count++;
                        saveButtonsConfig();
                    }
                } else {
                    // 普通消息发送
                    if (config.multiMessage) {
                        const messages = config.message.split('\n').filter(msg => msg.trim() !== '');
                        
                        if (messages.length > 0) {
                            sendMessagesApi(messages)
                                .then(() => {
                                    config.count++;
                                    saveButtonsConfig();
                                })
                                .catch(error => {
                                    console.error('发送消息失败:', error);
                                    showNotification('发送消息失败，请稍后重试', 'error');
                                });
                        }
                    } else {
                        sendMsgApi(config.message)
                            .then(() => {
                                config.count++;
                                saveButtonsConfig();
                            })
                            .catch(error => {
                                console.error('发送消息失败:', error);
                                showNotification('发送消息失败，请稍后重试', 'error');
                            });
                    }
                }
            };
            
            return btn;
        }
    };

    // 发送单条消息的API函数
    function sendMsgApi(msg) {
        return new Promise((resolve, reject) => {
            var msgData = {
                "content": msg,
                "client": "Web/小梦的魔法" + version_us
            };
            $.ajax({
                url: "https://fishpi.cn/chat-room/send",
                type: "POST",
                data: JSON.stringify(msgData),
                dataType: "json",
                contentType: "application/json",
                success: (response) => {
                    console.log('消息发送成功:', response);
                    resolve(response);
                },
                error: (xhr, status, error) => {
                    console.error('发送消息失败:', error);
                    console.error('错误详情:', xhr.responseText);
                    reject(new Error(`发送消息失败: ${error}`));
                }
            });
        });
    }
    
    // 发送多条消息的API函数，支持逐条发送
    function sendMessagesApi(messages, delay = 1000) {
        return new Promise((resolve, reject) => {
            let index = 0;
            
            function sendNext() {
                if (index >= messages.length) {
                    resolve();
                    return;
                }
                
                const message = messages[index];
                index++;
                
                sendMsgApi(message)
                    .then(() => {
                        setTimeout(sendNext, delay);
                    })
                    .catch(reject);
            }
            
            sendNext();
        });
    }
    
    // 发送红包函数
    function sendRedPacketMsg(data) {
        let msg = JSON.parse(JSON.stringify(data));
        
        // 格式化红包类型
        if (msg.type) {
            if (msg.type == '拼手气红包') {
                msg.type = 'random';
            } else if (msg.type == '普通红包') {
                msg.type = 'average';
            } else if (msg.type == '专属红包') {
                msg.type = 'specify';
            } else if (msg.type == '心跳红包') {
                msg.type = 'heartbeat';
            } else if (msg.type == '猜拳红包') {
                msg.type = 'rockPaperScissors';
            }
        }
        
        // 处理猜拳手势 - 总是提示用户输入
        if (msg.type == 'rockPaperScissors') {
            let input = prompt('请选择：石头（0）、剪刀（1）、布（2）', '0');
            if (input === null) {
                showNotification("已取消发送", "warning");
                return;
            }
            msg.gesture = input;
            // 转换中文手势为数字
            if (msg.gesture == '石头') {
                msg.gesture = '0';
            } else if (msg.gesture == '剪刀') {
                msg.gesture = '1';
            } else if (msg.gesture == '布') {
                msg.gesture = '2';
            }
        } else if (msg.gesture && msg.gesture !== '无') {
            // 非猜拳红包但配置了手势，只转换不提示
            if (msg.gesture == '石头') {
                msg.gesture = '0';
            } else if (msg.gesture == '剪刀') {
                msg.gesture = '1';
            } else if (msg.gesture == '布') {
                msg.gesture = '2';
            }
        }
        
        // 默认红包消息
        if (!msg.msg) {
            msg.msg = '恭喜发财！';
        }
        
        // 默认红包金额
        if (!msg.money) {
            let input = prompt('请输入红包金额：', '256');
            if (input === null) {
                showNotification("金额不能为空哦~", "error");
                return;
            }
            msg.money = input;
        }
        
        // 默认红包数量
        if (!msg.count) {
            msg.count = 1;
        }
        
        // 专属红包接收者 - 总是提示用户输入
        if (msg.type == 'specify') {
            let input = prompt('请输入专属用户名：', '');
            if (input === null) {
                showNotification("已取消发送", "warning");
                return;
            }
            msg.recivers = [input];
        }
        
        // 构建请求内容
        let content;
        if (msg.type !== "rockPaperScissors") {
            content = {
                type: msg.type,
                money: msg.money,
                count: msg.count,
                msg: msg.msg,
                recivers: msg.recivers
            }
        } else {
            content = {
                type: msg.type,
                money: msg.money,
                count: msg.count,
                msg: msg.msg,
                recivers: msg.recivers,
                gesture: msg.gesture
            }
        }
        
        let requestJSONObject = {
            content: "[redpacket]" + JSON.stringify(msg) + "[/redpacket]",
            client: "Web/小梦的魔法" + version_us
        }
        
        $.ajax({
            url: "https://fishpi.cn/chat-room/send",
            type: 'POST',
            cache: false,
            data: JSON.stringify(requestJSONObject),
            success: function (result) {
                if (0 !== result.code) {
                    showNotification('发送失败: ' + result.msg, 'error');
                } else {
                    showNotification('红包发送成功！', 'success');
                }
            },
            error: function (result) {
                showNotification('发送失败: ' + result.statusText, 'error');
            }
        });
    }
    
    // 从localStorage加载按钮配置
    function loadButtonsConfig() {
        try {
            const savedConfig = localStorage.getItem(STORAGE_KEY);
            if (savedConfig) {
                buttonsConfig = JSON.parse(savedConfig);
                // 确保每个按钮都有count和hidden属性
                buttonsConfig.forEach(button => {
                    if (!button.hasOwnProperty('count')) {
                        button.count = 0;
                    }
                    if (!button.hasOwnProperty('hidden')) {
                        button.hidden = false;
                    }
                });
                console.log('已加载保存的按钮配置:', buttonsConfig);
            } else {
                // 使用默认按钮配置
                buttonsConfig = DEFAULT_BUTTONS;
                saveButtonsConfig();
                console.log('使用默认按钮配置');
            }
        } catch (e) {
            console.error('加载按钮配置失败:', e);
            buttonsConfig = DEFAULT_BUTTONS;
        }
    }
    
    // 保存按钮配置到localStorage
    function saveButtonsConfig() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(buttonsConfig));
            console.log('按钮配置已保存');
        } catch (e) {
            console.error('保存按钮配置失败:', e);
            alert('保存按钮配置失败，请重试');
        }
    }
    
    // 创建按钮到界面
    function createButtons() {
        try {
            // 获取回复区域
            var x = document.getElementsByClassName('reply')[0];
            if (!x) {
                console.log('未找到回复区域，稍后重试');
                setTimeout(createButtons, 1000);
                return;
            }

            // 创建按钮容器
            var buttonContainer = document.getElementById("custom-buttons-container");
            if (!buttonContainer) {
                buttonContainer = document.createElement("div");
                buttonContainer.id = "custom-buttons-container";
                buttonContainer.align = "right";
                buttonContainer.style.marginBottom = "10px";
                x.appendChild(buttonContainer);
            } else {
                // 清空现有按钮，避免重复添加
                buttonContainer.innerHTML = '';
            }
            
            // 创建每个按钮（仅显示未隐藏的按钮）
            buttonsConfig.forEach(button => {
                if (!button.hidden) {
                    const btn = buttonFactory.create(button);
                    buttonContainer.appendChild(btn);
                }
            });
            
            // 添加管理按钮
            var manageButton = document.createElement('button');
            manageButton.id = 'button-manager-button';
            manageButton.textContent = '管理';
            manageButton.className = 'blue';
            manageButton.setAttribute('style', 'margin-right:5px; margin-bottom:5px; padding:4px 8px;');
            manageButton.onclick = openButtonManagerPanel;
            buttonContainer.appendChild(manageButton);
            
            // 添加清除私信按钮
            var clearMsgButton = document.createElement('button');
            clearMsgButton.id = 'clear-messages-button';
            clearMsgButton.textContent = '清空私信';
            clearMsgButton.className = 'blue';
            clearMsgButton.setAttribute('style', 'margin-right:5px; margin-bottom:5px; padding:4px 8px; border-radius: 4px;');
            clearMsgButton.onclick = clearPrivateMessages;
            buttonContainer.appendChild(clearMsgButton);
            
        } catch (e) {
            console.error('创建按钮失败:', e);
            setTimeout(createButtons, 2000);
        }
    }
    
    // 生成唯一ID
    function generateUniqueId() {
        return 'custom-button-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    // 清除私信功能
    function clearPrivateMessages() {
        return Promise.all([
            fetchPrivate("/chat/mark-all-as-read"),
            fetchPrivate("/notifications/all-read")
        ]).then(() => {
            showNotification('私信已清空！', 'success');
        }).catch(err => {
            console.error('清空私信失败:', err);
            showNotification('清空私信失败，请稍后重试', 'error');
        });
    }
    
    // 提取消息的HTML内容（包括嵌套引用）
    function extractMessageHTML(chatContent) {
        const vditorReset = chatContent.querySelector('.vditor-reset');
        if (!vditorReset) return null;
        
        // 返回内部的HTML，包括嵌套的引用
        return vditorReset.innerHTML;
    }
    
    // 解析消息，将HTML转换为Markdown格式的引用
    function htmlToMarkdownQuote(html, currentLevel = 0) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        function processElement(element, level) {
            let markdown = '';
            const indent = '>'.repeat(level) + (level > 0 ? ' ' : '');

            for (let node of element.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    // 文本节点
                    const text = node.textContent.trim();
                    if (text) {
                        markdown += indent + text + '\n';
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // 元素节点
                    const tagName = node.tagName.toLowerCase();

                    if (tagName === 'p') {
                        // 段落
                        const pContent = node.textContent.trim();
                        if (pContent) {
                            markdown += indent + pContent + '\n';
                        } else if(node.childNodes[0] && node.childNodes[0].tagName.toLowerCase() === 'img') {
                            // 处理图片，转换为Markdown格式
                            const imgTag = node.childNodes[0];
                            const src = imgTag.getAttribute('src') || '';
                            const alt = imgTag.getAttribute('alt') || '';
                            markdown += indent + `![${alt}](${src})` + '\n';
                        }
                    } else if (tagName === 'h5') {
                        // 引用标题 - 提取用户名和链接
                        const userLink = node.querySelector('a[href*="/member/"]');
                        const backLink = node.querySelector('a[href*="cr#"]');

                        let userText = '';
                        if (userLink) {
                            const ariaLabel = userLink.getAttribute('aria-label');
                            userText = ariaLabel || userLink.textContent;
                        }

                        let linkText = '';
                        if (backLink) {
                            const href = backLink.getAttribute('href');
                            const title = backLink.getAttribute('title') || '跳转至原消息';
                            linkText = `[↩](${href} "${title}")`;
                        }

                        markdown += indent + `##### 引用 @${userText} ${linkText}\n`;
                    } else if (tagName === 'blockquote') {
                        // 引用块 - 递归处理，增加层级
                        const blockquoteContent = processElement(node, level + 1);
                        markdown += blockquoteContent;
                    } else if (tagName === 'img') {
                        // 图片标签，转换为Markdown格式
                        const src = node.getAttribute('src') || '';
                        const alt = node.getAttribute('alt') || '';
                        markdown += indent + `![${alt}](${src})` + '\n';
                    } else if (tagName === 'a' && node.closest('h5') === null) {
                        // 链接（不在h5中的）
                        const href = node.getAttribute('href');
                        const text = node.textContent;
                        markdown += indent + `[${text}](${href})`;
                    } else {
                        // 其他元素，递归处理
                        markdown += processElement(node, level);
                    }
                }
            }

            if (level === 0 && markdown) {
                markdown += '\n';
            }

            return markdown;
        }

        return processElement(tempDiv, currentLevel);
    }

    // 私信接口
    function fetchPrivate(endpoint) {
        return fetch(`${location.origin}${endpoint}?apiKey=${Label.node.apiKey}`);
    }
    
    // 导入按钮配置
    function importButtonsConfig() {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    try {
                        const importData = JSON.parse(event.target.result);
                        
                        if (!importData.buttons || !Array.isArray(importData.buttons)) {
                            showNotification('无效的导入文件格式', 'error');
                            return;
                        }
                        
                        // 验证按钮数据结构
                        const isValid = importData.buttons.every(button => 
                            button.id && button.textContent && button.message && button.className
                        );
                        
                        if (!isValid) {
                            showNotification('导入文件数据不完整', 'error');
                            return;
                        }
                        
                        // 更新按钮配置
                        buttonsConfig = importData.buttons;
                        
                        // 确保每个按钮都有count和hidden属性
                        buttonsConfig.forEach(button => {
                            if (!button.hasOwnProperty('count')) {
                                button.count = 0;
                            }
                            if (!button.hasOwnProperty('hidden')) {
                                button.hidden = false;
                            }
                        });
                        
                        // 保存并更新UI
                        saveButtonsConfig();
                        createButtons();
                        // 如果管理面板已打开，更新列表
                        if (document.getElementById('buttons-manager-panel')) {
                            updateButtonsList();
                        }
                        
                        showNotification('配置导入成功！', 'success');
                    } catch (parseError) {
                        console.error('解析导入文件失败:', parseError);
                        showNotification('解析导入文件失败', 'error');
                    }
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        } catch (e) {
            console.error('导入配置失败:', e);
            showNotification('配置导入失败', 'error');
        }
    }
    
    // 导出按钮配置为JSON文件
    function exportButtonsConfig() {
        try {
            const exportData = {
                version: version_us,
                exportDate: new Date().toISOString(),
                buttons: buttonsConfig
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'tail-button-config.json';
            link.click();
            
            URL.revokeObjectURL(url);
            showNotification('配置导出成功！', 'success');
        } catch (e) {
            console.error('导出配置失败:', e);
            showNotification('配置导出失败', 'error');
        }
    }
    
    // 打开按钮管理面板
    function openButtonManagerPanel() {
        // 检查是否已存在面板
        const existingPanel = document.getElementById('button-manager-panel');
        if (existingPanel) {
            document.body.removeChild(existingPanel);
        }
        
        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'button-manager-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            border: 1px solid #e8e8e8;
            border-radius: 16px;
            padding: 0;
            z-index: 9999;
            width: 550px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        // 添加面板悬停效果
        panel.addEventListener('mouseenter', () => {
            panel.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
        });
        
        // 创建可拖动的标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 20px;
            border-radius: 12px 12px 0 0;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        // 面板标题
        const title = document.createElement('h3');
        title.textContent = '按钮管理面板';
        title.style.margin = '0';
        title.style.fontSize = '18px';
        title.style.fontWeight = '600';
        titleBar.appendChild(title);
        
        // 标题栏关闭按钮
        const titleCloseBtn = document.createElement('button');
        titleCloseBtn.innerHTML = '×';
        titleCloseBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
        `;
        
        titleCloseBtn.onclick = function() {
            document.body.removeChild(panel);
        };
        
        titleCloseBtn.addEventListener('mouseenter', () => {
            titleCloseBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        
        titleCloseBtn.addEventListener('mouseleave', () => {
            titleCloseBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        titleBar.appendChild(titleCloseBtn);
        panel.appendChild(titleBar);
        
        // 创建内容容器
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            padding: 20px;
            flex: 1;
            overflow-y: auto;
        `;
        panel.appendChild(contentContainer);
        
        // 添加新按钮区域
        const addButtonSection = document.createElement('div');
        addButtonSection.style.cssText = `
            background: #fafafa;
            border: 2px dashed #e1e5e9;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        `;
        
        addButtonSection.addEventListener('mouseenter', () => {
            addButtonSection.style.borderColor = '#667eea';
            addButtonSection.style.background = '#f0f2ff';
        });
        
        addButtonSection.addEventListener('mouseleave', () => {
            addButtonSection.style.borderColor = '#e1e5e9';
            addButtonSection.style.background = '#fafafa';
        });
        
        const addTitle = document.createElement('h4');
        addTitle.textContent = '添加新按钮';
        addTitle.style.marginTop = '0';
        addTitle.style.marginBottom = '20px';
        addTitle.style.color = '#333';
        addTitle.style.fontSize = '16px';
        addButtonSection.appendChild(addTitle);
        
        // 按钮文本输入
        const textLabel = document.createElement('div');
        textLabel.textContent = '按钮文本';
        textLabel.style.marginBottom = '8px';
        textLabel.style.fontWeight = '500';
        textLabel.style.color = '#555';
        addButtonSection.appendChild(textLabel);
        
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = '按钮显示的文本';
        textInput.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            margin-bottom: 20px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
            transition: all 0.3s ease;
            outline: none;
        `;
        
        textInput.addEventListener('focus', () => {
            textInput.style.borderColor = '#667eea';
            textInput.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.1)';
        });
        
        textInput.addEventListener('blur', () => {
            textInput.style.borderColor = '#d9d9d9';
            textInput.style.boxShadow = 'none';
        });
        
        addButtonSection.appendChild(textInput);
        
        // 触发消息输入
        const msgLabel = document.createElement('div');
        msgLabel.textContent = '触发消息';
        msgLabel.style.marginBottom = '8px';
        msgLabel.style.fontWeight = '500';
        msgLabel.style.color = '#555';
        addButtonSection.appendChild(msgLabel);
        
        const msgInput = document.createElement('textarea');
        msgInput.placeholder = '点击按钮发送的消息（多行消息请用换行分隔）';
        msgInput.rows = 4;
        msgInput.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            margin-bottom: 20px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
            resize: vertical;
            transition: all 0.3s ease;
            outline: none;
        `;
        
        msgInput.addEventListener('focus', () => {
            msgInput.style.borderColor = '#667eea';
            msgInput.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.1)';
        });
        
        msgInput.addEventListener('blur', () => {
            msgInput.style.borderColor = '#d9d9d9';
            msgInput.style.boxShadow = 'none';
        });
        
        addButtonSection.appendChild(msgInput);
        
        // 按钮颜色选择
        const colorLabel = document.createElement('div');
        colorLabel.textContent = '按钮颜色';
        colorLabel.style.marginBottom = '8px';
        colorLabel.style.fontWeight = '500';
        colorLabel.style.color = '#555';
        addButtonSection.appendChild(colorLabel);
        
        const colorSelect = document.createElement('select');
        colorSelect.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            margin-bottom: 20px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
            background-color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            outline: none;
        `;
        
        colorSelect.addEventListener('focus', () => {
            colorSelect.style.borderColor = '#667eea';
            colorSelect.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.1)';
        });
        
        colorSelect.addEventListener('blur', () => {
            colorSelect.style.borderColor = '#d9d9d9';
            colorSelect.style.boxShadow = 'none';
        });
        
        colorOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            colorSelect.appendChild(opt);
        });
        
        addButtonSection.appendChild(colorSelect);
        
        // 隐藏选项
        const hiddenLabel = document.createElement('div');
        hiddenLabel.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            cursor: pointer;
        `;
        
        const hiddenCheckbox = document.createElement('input');
        hiddenCheckbox.type = 'checkbox';
        hiddenCheckbox.id = 'hidden-checkbox';
        hiddenCheckbox.style.cssText = `
            margin-right: 10px;
            cursor: pointer;
        `;
        
        const hiddenText = document.createElement('span');
        hiddenText.textContent = '隐藏此按钮';
        hiddenText.style.cssText = `
            font-size: 14px;
            color: #555;
            cursor: pointer;
        `;
        
        hiddenLabel.appendChild(hiddenCheckbox);
        hiddenLabel.appendChild(hiddenText);
        addButtonSection.appendChild(hiddenLabel);
        
        // 动作类型选择
        const addActionTypeDiv = document.createElement('div');
        addActionTypeDiv.style.marginBottom = '15px';
        const addActionTypeLabel = document.createElement('div');
        addActionTypeLabel.textContent = '动作类型';
        addActionTypeLabel.style.marginBottom = '8px';
        addActionTypeLabel.style.fontWeight = '500';
        addActionTypeLabel.style.color = '#555';
        addActionTypeDiv.appendChild(addActionTypeLabel);
        
        const addActionTypeSelect = document.createElement('select');
        addActionTypeSelect.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            margin-bottom: 15px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
            background-color: white;
        `;
        
        actionTypeOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            addActionTypeSelect.appendChild(opt);
        });
        addActionTypeDiv.appendChild(addActionTypeSelect);
        addButtonSection.appendChild(addActionTypeDiv);
        
        // 红包配置区域
        const addRedPacketConfigDiv = document.createElement('div');
        addRedPacketConfigDiv.id = 'add-red-packet-config';
        addRedPacketConfigDiv.style.marginBottom = '15px';
        addRedPacketConfigDiv.style.padding = '10px';
        addRedPacketConfigDiv.style.border = '1px solid #d9d9d9';
        addRedPacketConfigDiv.style.borderRadius = '6px';
        addRedPacketConfigDiv.style.display = 'none';
        
        // 红包类型选择
        const addTypeLabel = document.createElement('div');
        addTypeLabel.textContent = '红包类型';
        addTypeLabel.style.marginBottom = '8px';
        addTypeLabel.style.fontWeight = '500';
        addTypeLabel.style.color = '#555';
        addRedPacketConfigDiv.appendChild(addTypeLabel);
        
        const addTypeSelect = document.createElement('select');
        addTypeSelect.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            margin-bottom: 15px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
            background-color: white;
        `;
        
        redPacketTypes.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            addTypeSelect.appendChild(opt);
        });
        addRedPacketConfigDiv.appendChild(addTypeSelect);
        
        // 金额输入
        const addMoneyLabel = document.createElement('div');
        addMoneyLabel.textContent = '红包金额';
        addMoneyLabel.style.marginBottom = '8px';
        addMoneyLabel.style.fontWeight = '500';
        addMoneyLabel.style.color = '#555';
        addRedPacketConfigDiv.appendChild(addMoneyLabel);
        
        const addMoneyInput = document.createElement('input');
        addMoneyInput.type = 'text';
        addMoneyInput.placeholder = '留空则提示输入';
        addMoneyInput.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            margin-bottom: 15px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
        `;
        addRedPacketConfigDiv.appendChild(addMoneyInput);
        
        // 数量输入
        const addCountLabel = document.createElement('div');
        addCountLabel.textContent = '红包数量';
        addCountLabel.style.marginBottom = '8px';
        addCountLabel.style.fontWeight = '500';
        addCountLabel.style.color = '#555';
        addRedPacketConfigDiv.appendChild(addCountLabel);
        
        const addCountInput = document.createElement('input');
        addCountInput.type = 'number';
        addCountInput.value = '1';
        addCountInput.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            margin-bottom: 15px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
        `;
        addRedPacketConfigDiv.appendChild(addCountInput);
        
        // 消息输入
        const addMsgLabel = document.createElement('div');
        addMsgLabel.textContent = '红包消息';
        addMsgLabel.style.marginBottom = '8px';
        addMsgLabel.style.fontWeight = '500';
        addMsgLabel.style.color = '#555';
        addRedPacketConfigDiv.appendChild(addMsgLabel);
        
        const addMsgInput = document.createElement('input');
        addMsgInput.type = 'text';
        addMsgInput.placeholder = '留空则使用默认消息';
        addMsgInput.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            margin-bottom: 15px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
        `;
        addRedPacketConfigDiv.appendChild(addMsgInput);
        
        // 专属用户输入
        const addReciversDiv = document.createElement('div');
        addReciversDiv.id = 'add-red-packet-recivers-div';
        addReciversDiv.style.marginBottom = '10px';
        addReciversDiv.style.display = 'none';
        const addReciversLabel = document.createElement('div');
        addReciversLabel.textContent = '专属用户';
        addReciversLabel.style.marginBottom = '8px';
        addReciversLabel.style.fontWeight = '500';
        addReciversLabel.style.color = '#555';
        addReciversDiv.appendChild(addReciversLabel);
        
        const addReciversInput = document.createElement('input');
        addReciversInput.type = 'text';
        addReciversInput.placeholder = '留空则提示输入';
        addReciversInput.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            margin-bottom: 10px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
        `;
        addReciversDiv.appendChild(addReciversInput);
        addRedPacketConfigDiv.appendChild(addReciversDiv);
        
        // 手势选择
        const addGestureDiv = document.createElement('div');
        addGestureDiv.id = 'add-red-packet-gesture-div';
        addGestureDiv.style.marginBottom = '10px';
        addGestureDiv.style.display = 'none';
        const addGestureLabel = document.createElement('div');
        addGestureLabel.textContent = '猜拳手势';
        addGestureLabel.style.marginBottom = '8px';
        addGestureLabel.style.fontWeight = '500';
        addGestureLabel.style.color = '#555';
        addGestureDiv.appendChild(addGestureLabel);
        
        const addGestureSelect = document.createElement('select');
        addGestureSelect.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            margin-bottom: 10px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
            background-color: white;
        `;
        
        gestureOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            addGestureSelect.appendChild(opt);
        });
        addGestureDiv.appendChild(addGestureSelect);
        addRedPacketConfigDiv.appendChild(addGestureDiv);
        
        addButtonSection.appendChild(addRedPacketConfigDiv);
        
        // 监听动作类型变化
        addActionTypeSelect.addEventListener('change', function() {
            addRedPacketConfigDiv.style.display = this.value === 'redPacket' ? 'block' : 'none';
        });
        
        // 监听红包类型变化
        addTypeSelect.addEventListener('change', function() {
            addReciversDiv.style.display = this.value === '专属红包' ? 'block' : 'none';
            addGestureDiv.style.display = this.value === '猜拳红包' ? 'block' : 'none';
        });
        
        // 多条消息选项
        const addMultiMessageDiv = document.createElement('div');
        addMultiMessageDiv.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            cursor: pointer;
        `;
        
        const addMultiMessageCheckbox = document.createElement('input');
        addMultiMessageCheckbox.type = 'checkbox';
        addMultiMessageCheckbox.id = 'add-multi-message';
        addMultiMessageCheckbox.style.marginRight = '10px';
        addMultiMessageCheckbox.style.cursor = 'pointer';
        
        const addMultiMessageText = document.createElement('span');
        addMultiMessageText.textContent = '多条消息（按换行符分割发送）';
        addMultiMessageText.style.cssText = `
            font-size: 14px;
            color: #555;
            cursor: pointer;
        `;
        
        addMultiMessageDiv.appendChild(addMultiMessageCheckbox);
        addMultiMessageDiv.appendChild(addMultiMessageText);
        addButtonSection.appendChild(addMultiMessageDiv);
        
        // 添加按钮
        const addBtn = document.createElement('button');
        addBtn.textContent = '添加按钮';
        addBtn.style.cssText = `
            width: 100%;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        `;
        
        addBtn.addEventListener('mouseenter', () => {
            addBtn.style.transform = 'translateY(-2px)';
            addBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        });
        
        addBtn.addEventListener('mouseleave', () => {
            addBtn.style.transform = 'translateY(0)';
            addBtn.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
        });
        
        addBtn.addEventListener('click', function() {
            const buttonText = textInput.value.trim();
            const buttonMsg = msgInput.value.trim();
            const isHidden = hiddenCheckbox.checked;
            const selectedActionType = addActionTypeSelect.value;
            
            if (!buttonText) {
                showNotification('请填写按钮文本', 'error');
                return;
            }
            
            if (selectedActionType === 'message' && !buttonMsg) {
                showNotification('请填写触发消息', 'error');
                return;
            }
            
            // 创建新按钮配置
            const newButton = {
                id: generateUniqueId(),
                textContent: buttonText,
                className: colorSelect.value,
                count: 0,
                hidden: isHidden,
                multiMessage: addMultiMessageCheckbox.checked,
                actionType: selectedActionType
            };
            
            // 如果是消息类型，保存消息内容
            if (selectedActionType === 'message') {
                newButton.message = buttonMsg;
                newButton.redPacketConfig = null;
            } else {
                // 如果是红包类型，保存红包配置
                newButton.message = '';
                newButton.redPacketConfig = {
                    type: addTypeSelect.value,
                    money: addMoneyInput.value.trim(),
                    count: addCountInput.value,
                    msg: addMsgInput.value.trim(),
                    recivers: addReciversInput.value.trim() ? [addReciversInput.value.trim()] : [""],
                    gesture: addGestureSelect.value
                };
            }
            
            // 添加到配置并保存
            buttonsConfig.push(newButton);
            saveButtonsConfig();
            
            // 重新创建按钮
            createButtons();
            
            // 更新管理面板
            updateButtonsList();
            
            // 清空输入框
            textInput.value = '';
            msgInput.value = '';
            hiddenCheckbox.checked = false;
            addActionTypeSelect.value = 'message';
            addMultiMessageCheckbox.checked = false;
            addRedPacketConfigDiv.style.display = 'none';
            addMoneyInput.value = '';
            addCountInput.value = '1';
            addMsgInput.value = '';
            addReciversInput.value = '';
            addGestureSelect.value = '无';
            
            // 显示成功提示
            showNotification('按钮添加成功！', 'success');
        });
        
        addButtonSection.appendChild(addBtn);
        contentContainer.appendChild(addButtonSection);
        
        // 按钮列表区域
        const buttonsListSection = document.createElement('div');
        buttonsListSection.id = 'buttons-list-section';
        buttonsListSection.style.cssText = `
            background: #fafafa;
            border-radius: 10px;
            padding: 20px;
        `;
        
        const listTitle = document.createElement('h4');
        listTitle.textContent = '已添加的按钮';
        listTitle.style.marginTop = '0';
        listTitle.style.marginBottom = '20px';
        listTitle.style.color = '#333';
        listTitle.style.fontSize = '16px';
        buttonsListSection.appendChild(listTitle);
        
        // 按钮列表容器
        const buttonsList = document.createElement('div');
        buttonsList.id = 'buttons-list';
        buttonsList.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 12px;
        `;
        buttonsListSection.appendChild(buttonsList);
        contentContainer.appendChild(buttonsListSection);
        
        // 导入导出按钮区域
        const importExportSection = document.createElement('div');
        importExportSection.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 20px;
        `;
        
        // 导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.textContent = '导出配置';
        exportBtn.style.cssText = `
            flex: 1;
            padding: 10px 20px;
            background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
        `;
        
        exportBtn.addEventListener('mouseenter', () => {
            exportBtn.style.transform = 'translateY(-2px)';
            exportBtn.style.boxShadow = '0 4px 12px rgba(82, 196, 26, 0.4)';
        });
        
        exportBtn.addEventListener('mouseleave', () => {
            exportBtn.style.transform = 'translateY(0)';
            exportBtn.style.boxShadow = '0 2px 8px rgba(82, 196, 26, 0.3)';
        });
        
        exportBtn.onclick = exportButtonsConfig;
        importExportSection.appendChild(exportBtn);
        
        // 导入按钮
        const importBtn = document.createElement('button');
        importBtn.textContent = '导入配置';
        importBtn.style.cssText = `
            flex: 1;
            padding: 10px 20px;
            background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
        `;
        
        importBtn.addEventListener('mouseenter', () => {
            importBtn.style.transform = 'translateY(-2px)';
            importBtn.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
        });
        
        importBtn.addEventListener('mouseleave', () => {
            importBtn.style.transform = 'translateY(0)';
            importBtn.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.3)';
        });
        
        importBtn.onclick = importButtonsConfig;
        importExportSection.appendChild(importBtn);
        
        contentContainer.appendChild(importExportSection);
        
        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            margin-top: 20px;
            width: 100%;
            padding: 10px 20px;
            background: #f5f5f5;
            color: #595959;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#e8e8e8';
            closeBtn.style.borderColor = '#d9d9d9';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = '#f5f5f5';
            closeBtn.style.borderColor = '#d9d9d9';
        });
        
        closeBtn.onclick = function() {
            document.body.removeChild(panel);
        };
        
        contentContainer.appendChild(closeBtn);
        
        // 添加到页面
        document.body.appendChild(panel);
        
        // 更新按钮列表
        updateButtonsList();
        
        // 实现面板拖动功能
        let isDragging = false;
        let startX, startY, initialTop, initialLeft;
        
        titleBar.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialTop = panel.offsetTop;
            initialLeft = panel.offsetLeft;
            
            // 添加拖动时的样式
            panel.style.cursor = 'grabbing';
            panel.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.25)';
            
            // 阻止默认文本选择
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // 设置面板新位置
            panel.style.top = (initialTop + deltaY) + 'px';
            panel.style.left = (initialLeft + deltaX) + 'px';
            panel.style.transform = 'none'; // 移除居中变换
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                // 恢复正常样式
                panel.style.cursor = 'default';
                panel.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            }
        });
        

    }
    
    // 显示通知
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        
        // 根据类型设置不同的背景色
        let bgColor = '#52c41a';
        if (type === 'error') {
            bgColor = '#f5222d';
        } else if (type === 'warning') {
            bgColor = '#faad14';
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10001;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // 3秒后隐藏通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 初始化函数
    function init() {
        // 加载按钮配置
        loadButtonsConfig();
        
        // 创建按钮
        createButtons();
        
        // 等待WebSocket连接建立后重试
        let retryCount = 0;
        const maxRetries = 30;
        const retryInterval = 1000;
        
        const retryTimer = setInterval(() => {
            if (retryCount < maxRetries) {
                createButtons();
                retryCount++;
            } else {
                clearInterval(retryTimer);
            }
        }, retryInterval);
    }
    
    // 注册油猴菜单
    GM_registerMenuCommand('按钮管理面板', openButtonManagerPanel);
    
    // 提取消息信息
    function extractMessageInfo(chatContent) {
        const chatItem = chatContent.closest('.chats__item');
        if (!chatItem) return null;
        
        // 获取消息ID
        const messageId = chatItem.id;
        
        return { messageId };
    }
    
    // 双击消息内容复读功能
    document.addEventListener('dblclick', function(event) {
        // 检查是否双击了消息内容区域
        const chatContent = event.target.closest('.chats__content');
        if (!chatContent) return;
        
        // 阻止默认行为
        event.preventDefault();
        event.stopPropagation();
        
        // 检查是否为红包消息
        if (chatContent.querySelector('.hongbao__item')) {
            showNotification('善良的小鱼油，别复读红包🧧哦！！！！！', 'warning');
            return;
        }
        
        // 检查是否为音乐消息
        if (chatContent.querySelector('.music-player')) {
            showNotification('善良的小鱼油，别复读音乐🎵哦！！！！！', 'warning');
            return;
        }
        
        // 提取消息信息
        const messageInfo = extractMessageInfo(chatContent);
        if (!messageInfo || !messageInfo.messageId) {
            console.error('无法提取消息信息');
            showNotification('无法提取消息信息', 'error');
            return;
        }
        
        // 检查消息ID格式并调用鱼排自带的复读函数
        if (messageInfo.messageId.startsWith('chatroom')) {
            const chatId = messageInfo.messageId.slice(8);
            try {
                ChatRoom.repeat(chatId);
                showNotification('消息已复读', 'success');
            } catch (error) {
                console.error('复读消息失败:', error);
                showNotification('复读消息失败，请稍后重试', 'error');
            }
        } else {
            showNotification('不支持的消息类型', 'error');
        }
    });
    
    // 当页面加载完成时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// 添加按钮颜色样式
GM_addStyle(`
  .red {
    color: #f5222d;
    border: 1px solid #d9d9d9;
  }
  
  .blue {
    color: #096dd9;
    border: 1px solid #d9d9d9;
  }
  
  .green {
    color: #389e0d;
    border: 1px solid #d9d9d9;
  }
  
  .gray {
    color: #595959;
    border: 1px solid #d9d9d9;
  }
  
  .orange {
    color: #d46b08;
    border: 1px solid #d9d9d9;
  }
`);