// ==UserScript==
// @name         头像生成脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.17
// @description  仅头像生成按钮的脚本
// @match        https://fishpi.cn/*
// @match        https://fishpi.cn/cr
// @icon         https://fishpi.cn/images/favicon.png
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// @author       ZeroDream
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556761/%E5%A4%B4%E5%83%8F%E7%94%9F%E6%88%90%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/556761/%E5%A4%B4%E5%83%8F%E7%94%9F%E6%88%90%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    version_us = '1.0.17';
    // 预设的颜色组合
    const presetColorCombinations = [
        { name: '优雅紫色', backgroundColor: 'ffffff,E8D5FF', fontColor: '9933CC,ffffff' },
        { name: '清新蓝色', backgroundColor: 'E8F4FF,ffffff', fontColor: '3366CC,ffffff' },
        { name: '自然绿色', backgroundColor: 'F0FFF4,D1FAE5', fontColor: '34D399,ffffff' },
        { name: '温柔粉色', backgroundColor: 'FFF0F6,FFADD6', fontColor: 'BE185D,ffffff' },
        { name: '明亮黄色', backgroundColor: 'FFFBEB,FEF3C7', fontColor: 'F59E0B,ffffff' },
        { name: '简约黑白', backgroundColor: 'FFFFFF,F3F4F6', fontColor: '6B7280,ffffff' },
        { name: '活力橙色', backgroundColor: 'FFF7ED,FFEDD5', fontColor: 'F97316,ffffff' },
        { name: '梦幻紫粉', backgroundColor: 'F9F0FF,FFD6E7', fontColor: '92400E,ffffff' },
        { name: '宁静青色', backgroundColor: 'E6FFFB,B5E8DF', fontColor: '0D9488,ffffff' },
        { name: '浪漫紫罗兰', backgroundColor: 'F5F3FF,D8B4FE', fontColor: '7C3AED,ffffff' },
        { name: '典雅金色', backgroundColor: 'FFFBEB,FDE68A', fontColor: 'D97706,ffffff' },
        { name: '深海蓝色', backgroundColor: 'EFF6FF,DBEAFE', fontColor: '2563EB,ffffff' },
        { name: '紫蓝渐变', backgroundColor: 'F3E8FF,E0E7FF', fontColor: '8B5CF6,4F46E5' },
        { name: '橙红渐变', backgroundColor: 'FFF7ED,FFEFEF', fontColor: 'FB923C,F87171' },
        { name: '绿青渐变', backgroundColor: 'ECFDF5,E0F2FE', fontColor: '10B981,0EA5E9' },
        { name: '粉紫渐变', backgroundColor: 'FCE7F3,EDE9FE', fontColor: 'EC4899,8B5CF6' },
        { name: '蓝青渐变', backgroundColor: 'E0F2FE,ECFEFF', fontColor: '3B82F6,0EA5E9' },
        { name: '黄橙渐变', backgroundColor: 'FEF9C3,FDE68A', fontColor: 'FACC15,F97316' },
        { name: '淡紫渐变', backgroundColor: 'F5F3FF,E9D5FF', fontColor: 'A855F7,ffffff' },
        { name: '薄荷绿', backgroundColor: 'DCFCE7,BBF7D0', fontColor: '22C55E,ffffff' },
        { name: '珊瑚粉', backgroundColor: 'FFECF0,FFD1DA', fontColor: 'EC4899,ffffff' },
        { name: '天蓝渐变', backgroundColor: 'EFF6FF,DBEAFE', fontColor: '60A5FA,ffffff' },
        { name: '薰衣草紫', backgroundColor: 'F8FAFC,E2E8F0', fontColor: '818CF8,ffffff' },
        { name: '抹茶绿', backgroundColor: 'F0FDF4,D9F99D', fontColor: '4ADE80,ffffff' },
        { name: '暖橙色', backgroundColor: 'FFFAF0,FFEDCC', fontColor: 'F59E0B,ffffff' },
        { name: '海洋蓝', backgroundColor: 'EFF6FF,DBEAFE', fontColor: '3B82F6,ffffff' },
        { name: '阳光黄', backgroundColor: 'FEF9C3,FDE68A', fontColor: 'FACC15,ffffff' },
        { name: '高级灰', backgroundColor: 'F8FAFC,E2E8F0', fontColor: '6B7280,ffffff' },
        { name: '紫蓝混色', backgroundColor: 'EDE9FE,DBEAFE', fontColor: '8B5CF6,60A5FA' },
        { name: '樱花粉', backgroundColor: 'FCE7F3,FFD1DA', fontColor: 'EC4899,ffffff' },
        { name: '薄荷青', backgroundColor: 'DCFCE7,DBEAFE', fontColor: '10B981,3B82F6' },
        { name: '蜜黄色', backgroundColor: 'FEF9C3,FDE68A', fontColor: 'FBBF24,ffffff' },
        { name: '橙蓝撞色', backgroundColor: 'FFEDCC,DBEAFE', fontColor: 'F97316,3B82F6' },
        { name: '黄粉渐变', backgroundColor: 'FEF9C3,FCE7F3', fontColor: 'FACC15,EC4899' },
        { name: '淡雅灰', backgroundColor: 'F8FAFC,E5E7EB', fontColor: '9CA3AF,ffffff' },
        { name: '橙紫渐变', backgroundColor: 'FFEDCC,EDE9FE', fontColor: 'FB923C,8B5CF6' },
        { name: '梦幻粉紫', backgroundColor: 'FCE7F3,EDE9FE', fontColor: 'EC4899,8B5CF6' },
        { name: '清新紫绿', backgroundColor: 'EDE9FE,D1FAE5', fontColor: '8B5CF6,34D399' },
        { name: '绿橙渐变', backgroundColor: 'D1FAE5,FFEDCC', fontColor: '34D399,FB923C' },
        { name: '金色渐变', backgroundColor: 'FEF9C3,FDE68A', fontColor: 'F59E0B,ffffff' }
    ];
    
    // 从localStorage加载配置，如果没有则使用默认配置
    function loadConfig() {
        const savedConfig = localStorage.getItem('avatarGeneratorConfig');
        const defaultConfig = {
            defaultText: '不想桀桀桀',
            generateApiUrl: 'https://fishpi.cn/gen?ver=0.1&scale=1.5',
            backgroundColor: 'ffffff,E8D5FF',
            fontColor: '9933CC,ffffff',
            baseImageUrl: '',
            scale: 0.79, // 默认缩放比例
            testMode: true // 默认启用测试模式
        };
        
        if (savedConfig) {
            try {
                const parsedConfig = JSON.parse(savedConfig);
                // 确保testMode属性存在，合并配置
                return {
                    ...defaultConfig,
                    ...parsedConfig
                };
            } catch (e) {
                console.error('解析保存的配置失败:', e);
            }
        }
        // 返回默认配置
        return defaultConfig;
    }
    
    // 保存配置到localStorage
    function saveConfig(config) {
        localStorage.setItem('avatarGeneratorConfig', JSON.stringify(config));
    }
    
    // 获取用户鱼排头像URL
    function getUserAvatarUrl() {
        try {
            // 尝试多种选择器来获取头像元素
            const selectors = [
                "#aPersonListPanel > span",  // 用户提供的选择器
                ".avatar-small",             // 直接查找avatar-small类
                "/html/body/div[2]/div[2]/a[6]/span" // 用户提供的XPath选择器对应的CSS选择器
            ];
            
            let avatarElement = null;
            // 尝试每个选择器直到找到头像元素
            for (const selector of selectors) {
                avatarElement = document.querySelector(selector);
                if (avatarElement && avatarElement.style.backgroundImage) {
                    break;
                }
            }
            
            // 如果找到了有backgroundImage的元素
            if (avatarElement && avatarElement.style.backgroundImage) {
                // 从backgroundImage中提取URL
                const backgroundImage = avatarElement.style.backgroundImage;
                // 匹配URL部分，考虑单引号和双引号
                const urlMatch = backgroundImage.match(/url\(['"](.+?)['"]\)/);
                if (urlMatch && urlMatch[1]) {
                    // 移除可能的参数部分，保留原始图片URL
                    let cleanUrl = urlMatch[1];
                    // 如果URL包含imageView2参数，则移除
                    const paramIndex = cleanUrl.indexOf('?imageView2');
                    if (paramIndex !== -1) {
                        cleanUrl = cleanUrl.substring(0, paramIndex);
                    }
                    console.log('成功获取头像URL:', cleanUrl);
                    return cleanUrl;
                }
            } else {
                console.log('未找到带有backgroundImage的头像元素');
                // 输出所有找到的元素进行调试
                selectors.forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) {
                        console.log(`找到元素 ${selector}:`, el, 'backgroundImage:', el.style.backgroundImage);
                    } else {
                        console.log(`未找到元素 ${selector}`);
                    }
                });
            }
        } catch (e) {
            console.error('获取用户头像URL失败:', e);
        }
        return null;
    }
    
    // 头像生成配置
    let avatarConfig = loadConfig();
    
    // 按钮位置存储键名
    const BUTTON_POSITION_KEY = 'avatar_script_button_position';
    
    // 应用保存的位置
    function applySavedPosition(element) {
        try {
            const savedPos = localStorage.getItem(BUTTON_POSITION_KEY);
            if (savedPos) {
                const pos = JSON.parse(savedPos);
                element.style.position = 'absolute';
                element.style.left = pos.left + 'px';
                element.style.top = pos.top + 'px';
                element.style.zIndex = '1000';
                return true;
            }
        } catch (e) {
            console.error('应用保存的位置失败:', e);
        }
        return false;
    }
    
    // 保存按钮位置
    function saveButtonPosition(element) {
        try {
            const rect = element.getBoundingClientRect();
            const position = {
                left: rect.left,
                top: rect.top
            };
            localStorage.setItem(BUTTON_POSITION_KEY, JSON.stringify(position));
        } catch (e) {
            console.error('保存按钮位置失败:', e);
        }
    }
    
    // 设置拖动事件，支持点击取消拖动
    function setupDragEventsWithClickCancel(element) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let clickStartTime = 0;
        let isClickCanceled = false;
        let originalPosition = element.style.position;
        let originalMargin = element.style.marginBottom;
        
        // 添加点击事件监听器，阻止拖动后的点击触发
        element.addEventListener('click', function(e) {
            if (isClickCanceled) {
                e.stopPropagation(); // 阻止事件冒泡
                e.preventDefault();  // 阻止默认行为
                // 延迟重置标志，确保下一次点击正常工作
                setTimeout(() => {
                    isClickCanceled = false;
                }, 100);
            }
        });
        
        element.addEventListener('mousedown', function(e) {
            // 记录点击开始时间
            clickStartTime = Date.now();
            isClickCanceled = false;
            
            // 计算偏移量
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // 临时切换为absolute定位
            element.style.position = 'absolute';
            element.style.zIndex = '1000';
            
            // 添加鼠标移动和释放事件
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            
            // 阻止默认事件以避免文本选择
            e.preventDefault();
        });
        
        function onMouseMove(e) {
            isDragging = true;
            
            // 计算新位置
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;
            
            // 应用新位置
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
        }
        
        function onMouseUp() {
            if (isDragging) {
                // 拖动结束，保存位置
                saveButtonPosition(element);
                isClickCanceled = true;
            } else {
                // 如果没有拖动，检查是否是短时间点击
                const clickDuration = Date.now() - clickStartTime;
                if (clickDuration < 200) {
                    // 短时间点击，认为是普通点击，恢复原来的定位
                    const hasSavedPosition = applySavedPosition(element);
                    if (!hasSavedPosition) {
                        element.style.position = originalPosition;
                        element.style.marginBottom = originalMargin;
                        element.style.left = '';
                        element.style.top = '';
                        element.style.zIndex = '';
                    }
                }
            }
            
            // 清理事件监听器
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
            // 重置状态
            isDragging = false;
        }
    }

    // 发送消息的API函数
    function sendMsgApi(msg) {
        var msgData = {
            "content": msg,
            "client": "Web/小梦的魔法" + version_us
        };
        $.ajax({
            url: "https://fishpi.cn/chat-room/send",
            type: "POST",
            async: false,
            data: JSON.stringify(msgData),
            success: function (e) {
                // 成功回调
            },
            error: function (e) {
                console.error('发送消息失败:', e);
            }
        });
    }

    // 创建按钮区域和按钮
    function createButtons() {
        try {
            // 获取列表
            var x = document.getElementsByClassName('reply')[0];
            if (!x) {
                setTimeout(createButtons, 1000);
                return;
            }

            // 创建 div 图层
            var elve = document.getElementById("elves");
            if (!elve) {
                elve = document.createElement("div");
                elve.id = "elves";
                elve.align = "right";
                elve.style.marginBottom = '10px';
                elve.style.position = 'relative';
                
                // 添加拖动功能
                setupDragEventsWithClickCancel(elve);
                
                x.appendChild(elve);
                
                // 应用保存的位置
                applySavedPosition(elve);
            } else {
                // 确保已添加拖动功能
                if (!elve.hasDragEvents) {
                    elve.hasDragEvents = true;
                    setupDragEventsWithClickCancel(elve);
                    applySavedPosition(elve);
                }
            }
            
            // // 创建冰冰按钮
            // var bingbingButton = document.createElement('button');
            // bingbingButton.id = 'bingbing-button';
            // bingbingButton.textContent = '打劫';
            // bingbingButton.className = 'red';
            // bingbingButton.setAttribute('style', 'margin-right:5px');
            // bingbingButton.onclick = function() {
            //     sendMsgApi('冰冰 去打劫');
            // };
            
            // // 创建鸽按钮
            // var geButton = document.createElement('button');
            // geButton.id = 'ge-button';
            // geButton.textContent = '鸽';
            // geButton.className = 'red';
            // geButton.setAttribute('style', 'margin-right:5px');
            // geButton.onclick = function() {
            //     sendMsgApi('鸽 行行好吧');
            // };
            //FishFishFish https://file.fishpi.cn/2025/08/faebd5a59a694b23bceef58d6a12fee4-3457696f.gif
            //![](https://fishpi.cn/gen?ver=0.1&scale=0.79&txt=%E7%88%B1%E8%80%8C%E4%B8%8D%E5%BE%97%20%2D%20%E6%AD%A2%E4%BA%8E%E5%94%87%E9%BD%BF%EF%BC%8C%E6%8E%A9%E4%BA%8E%E5%B2%81%E6%9C%88&url=https://file.fishpi.cn/2025/10/aj1-6b5eb828.gif&backcolor=F5DC78,C8B4FF,ffffff&shadow=0.8&anime=3&way=right&fontway=right&fontcolor=ffffff,F5DC78 "爱而不得 - 止于唇齿，掩于岁月")
            //![](https://fishpi.cn/gen?ver=0.1&scale=0.79&txt=%E7%88%B1%E8%80%8C%E4%B8%8D%E5%BE%97&url=https://file.fishpi.cn/2025/10/aj1-6b5eb828.gif&backcolor=F5DC78,C8B4FF,ffffff&shadow=0.8&anime=3&way=right&fontway=right&fontcolor=ffffff,F5DC78 "爱而不得")
            //![](https://fishpi.cn/gen?ver=0.1&scale=0.79&txt=%E5%9B%9B%E5%AD%A3%E6%9C%89%E4%BD%A0&url=https://file.fishpi.cn/2024/12/0009-4d0c6287.png&backcolor=4daffe&fontcolor=ffffff "四季有你")
            // ![图片表情](https://fishpi.cn/gen?ver=0.1&scale=0.79&txt=Azi%F0%9F%92%9C%F0%9F%92%9C%F0%9F%92%9C&url=https://file.fishpi.cn/2025/07/%E7%B4%AB%E8%89%B2%E5%B0%8F%E4%BB%93%E9%BC%A0GIF%E8%A1%A8%E6%83%859%E7%88%B1%E7%BB%99%E7%BD%91aigeicom-2781678a.gif&backcolor=ffffff,E8D5FF&fontcolor=9933CC,ffffff)
            //![图片表情](https://fishpi.cn/gen?ver=0.1&scale=0.79&txt=%E7%93%A6%E8%BE%BE%E8%A5%BF%E7%93%A6%E6%B3%A1%E6%B3%A1%E8%8C%B6&url=https://file.fishpi.cn/2025/10/17605791587999f873c31-507bde29.gif&backcolor=E8F4FF,ffffff&fontcolor=3366CC,ffffff)
            // 创建头像生成按钮
            var avatarGenButton = document.createElement('button');
            avatarGenButton.id = 'avatar-gen-button';
            avatarGenButton.textContent = '头像';
            avatarGenButton.className = 'red';
            avatarGenButton.setAttribute('style', 'margin-right:5px');
            avatarGenButton.onclick = function() {
                try {
                    const customText = prompt("请输入头像上显示的文字：", avatarConfig.defaultText);
                    const textToUse = customText === null || customText.trim() === '' ? avatarConfig.defaultText : customText.trim();
                    const encodedText = encodeURIComponent(textToUse)+"%20";
                    // 确保头像URL被正确编码
                    const encodedBaseImageUrl = encodeURIComponent(avatarConfig.baseImageUrl);
                    // 构建头像生成URL，使用配置中的缩放比例
                    const avatarUrl = `https://fishpi.cn/gen?ver=0.1&scale=${avatarConfig.scale}&txt=${encodedText}&url=${encodedBaseImageUrl}&backcolor=${avatarConfig.backgroundColor}&fontcolor=${avatarConfig.fontColor}`;
                    console.log('生成的头像URL:', avatarUrl);
                    
                    // 可选：添加简单的URL验证
                    if (avatarUrl.length > 2000) {
                        alert('警告：生成的URL过长，可能会导致问题');
                    }
                    
                    const messageToSend = `![图片表情](${avatarUrl})`;
                    
                    // 检查是否处于测试模式
                    if (avatarConfig.testMode) {
                        console.log('=== 开始输出所有颜色组合 ===');
                        // 遍历所有预设颜色组合
                        presetColorCombinations.forEach((combination, index) => {
                            // 为每个颜色组合生成头像URL
                            const comboAvatarUrl = `https://fishpi.cn/gen?ver=0.1&scale=${avatarConfig.scale}&txt=${encodedText}&url=${encodedBaseImageUrl}&backcolor=${combination.backgroundColor}&fontcolor=${combination.fontColor}`;
                            // 生成markdown格式的消息
                            const comboMessage = `![图片表情](${comboAvatarUrl})`;
                            // 输出到控制台
                            console.log(`组合 ${index + 1}: ${combination.name}`);
                            console.log(comboMessage);
                        });
                        console.log('=== 所有颜色组合输出完成 ===');
                        alert('测试模式已启用，所有颜色组合已输出到控制台');
                    } else {
                        // 正常模式下发送消息
                        sendMsgApi(messageToSend);
                    }
                } catch (e) {
                    console.error('生成头像时出错:', e);
                    alert('生成头像时出错，请查看控制台日志');
                }
            };
            
            // // 创建冰冰来个红包按钮
            // var bingbingHongbaoButton = document.createElement('button');
            // bingbingHongbaoButton.id = 'bingbing-hongbao-button';
            // bingbingHongbaoButton.textContent = '红包';
            // bingbingHongbaoButton.className = 'red';
            // bingbingHongbaoButton.setAttribute('style', 'margin-right:5px');
            // bingbingHongbaoButton.onclick = function() {
            //     sendMsgApi('冰冰 来个红包');
            // };
            
            // // 创建雷公助我按钮
            // var lightningButton = document.createElement('button');
            // lightningButton.id = 'lightning-button';
            // lightningButton.textContent = '雷';
            // lightningButton.className = 'red';
            // lightningButton.setAttribute('style', 'margin-right:5px');
            // lightningButton.onclick = function() {
            //     sendMsgApi('小斗士 雷公助我');
            // };
            
            // // 创建火烧连营按钮
            // var fireButton = document.createElement('button');
            // fireButton.id = 'fire-button';
            // fireButton.textContent = '火';
            // fireButton.className = 'red';
            // fireButton.setAttribute('style', 'margin-right:5px');
            // fireButton.onclick = function() {
            //     sendMsgApi('小斗士 火烧连营');
            // };
            
            // 添加按钮到图层，避免重复添加
            // if (!document.getElementById('bingbing-button')) elve.appendChild(bingbingButton);
            // if (!document.getElementById('ge-button')) elve.appendChild(geButton);
            // if (!document.getElementById('bingbing-hongbao-button')) elve.appendChild(bingbingHongbaoButton);
            // if (!document.getElementById('lightning-button')) elve.appendChild(lightningButton);
            // if (!document.getElementById('fire-button')) elve.appendChild(fireButton);
            if (!document.getElementById('avatar-gen-button')) elve.appendChild(avatarGenButton);
        } catch (e) {
            console.error('创建按钮失败:', e);
            setTimeout(createButtons, 2000);
        }
    }

    // 初始化函数
    function init() {
        // 尝试获取用户的鱼排头像URL
        const userAvatarUrl = getUserAvatarUrl();
        if (userAvatarUrl) {
            // 如果成功获取头像URL，则更新配置
            avatarConfig.baseImageUrl = userAvatarUrl;
            saveConfig(avatarConfig);
            console.log('已从用户头像更新baseImageUrl:', userAvatarUrl);
        } else {
            console.log('未能获取用户头像URL，使用现有配置');
        }
        
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

    // 创建颜色选择面板
    function createColorSelectionPanel() {
        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'avatarColorPanel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            z-index: 9999;
            width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
        `;
        
        // 面板标题
        const title = document.createElement('h3');
        title.textContent = '选择头像颜色组合';
        title.style.marginTop = '0';
        title.style.textAlign = 'center';
        panel.appendChild(title);
        
        // 预设颜色列表
        const colorList = document.createElement('div');
        colorList.style.maxHeight = '300px';
        colorList.style.overflowY = 'auto';
        colorList.style.marginBottom = '15px';
        panel.appendChild(colorList);
        
        // 添加预设颜色选项
        presetColorCombinations.forEach(combo => {
            const option = document.createElement('div');
            option.style.cssText = `
                display: flex;
                align-items: center;
                padding: 10px;
                margin-bottom: 8px;
                border: 1px solid #eee;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            `;
            
            option.onmouseover = () => option.style.backgroundColor = '#f5f5f5';
            option.onmouseout = () => option.style.backgroundColor = 'white';
            
            // 颜色预览
            const preview = document.createElement('div');
            const gradientStyle = `linear-gradient(45deg, #${combo.backgroundColor.split(',')[0]}, #${combo.backgroundColor.split(',')[1]})`;
            preview.style.cssText = `
                width: 60px;
                height: 30px;
                margin-right: 10px;
                background: ${gradientStyle};
                border-radius: 4px;
                position: relative;
            `;
            
            // 文字颜色预览
            const textPreview = document.createElement('div');
            textPreview.textContent = 'Aa';
            textPreview.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-weight: bold;
                background: linear-gradient(45deg, #${combo.fontColor.split(',')[0]}, #${combo.fontColor.split(',')[1]});
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            `;
            
            preview.appendChild(textPreview);
            option.appendChild(preview);
            
            // 颜色名称
            const nameSpan = document.createElement('span');
            nameSpan.textContent = combo.name;
            nameSpan.style.flex = 1;
            option.appendChild(nameSpan);
            
            // 点击选择
            option.onclick = () => {
                avatarConfig.backgroundColor = combo.backgroundColor;
                avatarConfig.fontColor = combo.fontColor;
                // 移除可能存在的gradient属性以保持一致性
                delete avatarConfig.gradient;
                saveConfig(avatarConfig);
                alert(`已选择${combo.name}颜色组合！`);
                document.body.removeChild(panel);
            };
            
            colorList.appendChild(option);
        });
        
        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            width: 100%;
            padding: 8px;
            background: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        closeBtn.onclick = () => document.body.removeChild(panel);
        panel.appendChild(closeBtn);
        
        // 添加到页面
        document.body.appendChild(panel);
    }
    
    // 打开头像URL设置对话框
    function setAvatarUrl() {
        const newUrl = prompt('请输入新的头像背景图片URL：', avatarConfig.baseImageUrl);
        if (newUrl !== null && newUrl.trim() !== '') {
            avatarConfig.baseImageUrl = newUrl.trim();
            saveConfig(avatarConfig);
            alert('头像背景图片URL已更新！');
        }
    }
    
    // 设置头像缩放比例
    function setAvatarScale() {
        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'avatarScalePanel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0;
            background: white;
            border: 1px solid #e8e8e8;
            border-radius: 8px;
            padding: 24px;
            z-index: 9999;
            width: 320px;
            box-shadow: 0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        `;
        
        // 面板标题
        const title = document.createElement('h3');
        title.textContent = '设置头像大小';
        title.style.marginTop = '0';
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';
        title.style.fontSize = '18px';
        title.style.fontWeight = '600';
        title.style.color = 'rgba(0, 0, 0, 0.85)';
        panel.appendChild(title);
        
        // 创建滑块容器
        const sliderContainer = document.createElement('div');
        sliderContainer.style.marginBottom = '24px';
        panel.appendChild(sliderContainer);
        
        // 滑块范围标签
        const rangeLabel = document.createElement('div');
        rangeLabel.style.display = 'flex';
        rangeLabel.style.justifyContent = 'space-between';
        rangeLabel.style.marginBottom = '8px';
        rangeLabel.style.fontSize = '12px';
        rangeLabel.style.color = 'rgba(0, 0, 0, 0.5)';
        rangeLabel.innerHTML = '<span>0.5</span><span>5.0</span>';
        sliderContainer.appendChild(rangeLabel);
        
        // 创建滑块
        const scaleSlider = document.createElement('input');
        scaleSlider.type = 'range';
        scaleSlider.min = '5';
        scaleSlider.max = '50';
        scaleSlider.step = '1';
        scaleSlider.value = Math.round(avatarConfig.scale * 10); // 乘以10转换为整数，以便于0.1步长控制
        scaleSlider.style.cssText = `
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #f0f0f0;
            outline: none;
            -webkit-appearance: none;
            margin-bottom: 12px;
        `;
        
        // 美化滑块（WebKit浏览器）
        scaleSlider.style.WebkitAppearance = 'none';
        scaleSlider.style.background = 'linear-gradient(to right, #1890ff 0%, #1890ff ' + 
            ((scaleSlider.value - scaleSlider.min) / (scaleSlider.max - scaleSlider.min) * 100) + '%, #f0f0f0 ' + 
            ((scaleSlider.value - scaleSlider.min) / (scaleSlider.max - scaleSlider.min) * 100) + '%, #f0f0f0 100%)';
        
        sliderContainer.appendChild(scaleSlider);
        
        // 创建当前值显示
        const valueDisplay = document.createElement('div');
        valueDisplay.style.textAlign = 'center';
        valueDisplay.style.fontSize = '16px';
        valueDisplay.style.fontWeight = '600';
        valueDisplay.style.color = '#1890ff';
        valueDisplay.textContent = (scaleSlider.value / 10).toFixed(1);
        sliderContainer.appendChild(valueDisplay);
        
        // 添加缩放预览
        const previewContainer = document.createElement('div');
        previewContainer.style.textAlign = 'center';
        previewContainer.style.marginBottom = '24px';
        panel.appendChild(previewContainer);
        
        const previewLabel = document.createElement('p');
        previewLabel.textContent = '预览效果';
        previewLabel.style.marginBottom = '12px';
        previewLabel.style.fontSize = '14px';
        previewLabel.style.color = 'rgba(0, 0, 0, 0.65)';
        previewContainer.appendChild(previewLabel);
        
        const previewBox = document.createElement('div');
        previewBox.style.display = 'flex';
        previewBox.style.justifyContent = 'center';
        previewBox.style.alignItems = 'center';
        previewContainer.appendChild(previewBox);
        
        // 创建可动态更新的预览点
        const dynamicDot = document.createElement('div');
        const initialSize = 12 * (scaleSlider.value / 10) + 'px';
        dynamicDot.style.cssText = `
            width: ${initialSize};
            height: ${initialSize};
            border-radius: 50%;
            background: #1890ff;
            transition: all 0.1s ease;
        `;
        previewBox.appendChild(dynamicDot);
        
        // 滑块变化事件
        scaleSlider.addEventListener('input', function() {
            const currentScale = (this.value / 10).toFixed(1);
            valueDisplay.textContent = currentScale;
            
            // 更新滑块背景渐变
            const percent = ((this.value - this.min) / (this.max - this.min) * 100);
            this.style.background = 'linear-gradient(to right, #1890ff 0%, #1890ff ' + 
                percent + '%, #f0f0f0 ' + percent + '%, #f0f0f0 100%)';
            
            // 更新预览点大小
            const dotSize = 12 * (this.value / 10) + 'px';
            dynamicDot.style.width = dotSize;
            dynamicDot.style.height = dotSize;
        });
        
        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '8px';
        panel.appendChild(buttonContainer);
        
        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = `
            padding: 6px 16px;
            background: white;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        cancelBtn.onclick = function() {
            panel.style.transform = 'translate(-50%, -50%) scale(0.9)';
            panel.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(panel);
            }, 300);
        };
        
        cancelBtn.onmouseover = function() {
            cancelBtn.style.borderColor = '#40a9ff';
            cancelBtn.style.color = '#40a9ff';
        };
        
        cancelBtn.onmouseout = function() {
            cancelBtn.style.borderColor = '#d9d9d9';
            cancelBtn.style.color = 'rgba(0, 0, 0, 0.65)';
        };
        
        buttonContainer.appendChild(cancelBtn);
        
        // 确认按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确认';
        confirmBtn.style.cssText = `
            padding: 6px 16px;
            background: #1890ff;
            border: 1px solid #1890ff;
            border-radius: 6px;
            color: white;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        confirmBtn.onclick = function() {
            const selectedScale = parseFloat((scaleSlider.value / 10).toFixed(1));
            if (!isNaN(selectedScale)) {
                avatarConfig.scale = selectedScale;
                saveConfig(avatarConfig);
                
                // 显示成功提示
                const successMsg = document.createElement('div');
                successMsg.textContent = `头像大小已设置为 ${selectedScale}`;
                successMsg.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #52c41a;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    z-index: 10000;
                    font-size: 14px;
                    opacity: 0;
                    transition: opacity 0.3s;
                `;
                document.body.appendChild(successMsg);
                
                setTimeout(() => {
                    successMsg.style.opacity = '1';
                }, 10);
                
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(successMsg);
                    }, 300);
                }, 2000);
            }
            
            // 关闭面板
            panel.style.transform = 'translate(-50%, -50%) scale(0.9)';
            panel.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(panel);
            }, 300);
        };
        
        confirmBtn.onmouseover = function() {
            confirmBtn.style.background = '#40a9ff';
            confirmBtn.style.borderColor = '#40a9ff';
        };
        
        confirmBtn.onmouseout = function() {
            confirmBtn.style.background = '#1890ff';
            confirmBtn.style.borderColor = '#1890ff';
        };
        
        buttonContainer.appendChild(confirmBtn);
        
        // 添加到页面
        document.body.appendChild(panel);
        
        // 添加显示动画
        setTimeout(() => {
            panel.style.transform = 'translate(-50%, -50%) scale(1)';
            panel.style.opacity = '1';
        }, 10);
    }
    
    // 重置为用户自己的头像
    function resetToUserAvatar() {
        try {
            const userAvatarUrl = getUserAvatarUrl();
            if (userAvatarUrl) {
                avatarConfig.baseImageUrl = userAvatarUrl;
                saveConfig(avatarConfig);
                alert('已成功重置为您的鱼排头像！');
            } else {
                alert('未能获取您的鱼排头像，请稍后再试！');
            }
        } catch (e) {
            console.error('重置头像时出错:', e);
            alert('重置头像时出错，请查看控制台日志');
        }
    }
    
    // 切换测试模式
    function toggleTestMode() {
        avatarConfig.testMode = !avatarConfig.testMode;
        saveConfig(avatarConfig);
        const modeText = avatarConfig.testMode ? '已启用' : '已禁用';
        alert(`测试模式${modeText}！${avatarConfig.testMode ? 'Test按钮的消息将只输出到控制台' : 'Test按钮的消息将正常发送'}`);
    }
    
    // 注册油猴菜单
    GM_registerMenuCommand('设置头像背景URL', setAvatarUrl);
    GM_registerMenuCommand('选择头像颜色组合', createColorSelectionPanel);
    GM_registerMenuCommand('设置头像大小', setAvatarScale);
    GM_registerMenuCommand('重置为我的鱼排头像', resetToUserAvatar);
    GM_registerMenuCommand('切换测试模式', toggleTestMode);
    
    // 当页面加载完成时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();