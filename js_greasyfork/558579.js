// ==UserScript==
// @name         多报表整合推送管理-时间分割与自动填写工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  多报表整合推送管理中,可输入时间时间并填写到指定控件
// @author       Coralfox
// @match        https://jf.chinaunicom.cn:9528/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558579/%E5%A4%9A%E6%8A%A5%E8%A1%A8%E6%95%B4%E5%90%88%E6%8E%A8%E9%80%81%E7%AE%A1%E7%90%86-%E6%97%B6%E9%97%B4%E5%88%86%E5%89%B2%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/558579/%E5%A4%9A%E6%8A%A5%E8%A1%A8%E6%95%B4%E5%90%88%E6%8E%A8%E9%80%81%E7%AE%A1%E7%90%86-%E6%97%B6%E9%97%B4%E5%88%86%E5%89%B2%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    function createButton() {
        console.log('[时间分割工具] 开始创建浮动按钮');
        const button = document.createElement('button');
        button.textContent = '时间分割工具';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        button.addEventListener('click', showDialog);
        document.body.appendChild(button);
        console.log('[时间分割工具] 浮动按钮创建完成');
    }

    // 显示对话框
    function showDialog() {
        console.log('[时间分割工具] 开始显示时间分割对话框');
        // 创建对话框容器
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 40%;
            left: 70%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            width: 400px;
        `;

        // 创建表单
        const form = document.createElement('form');
        form.innerHTML = `
            <h3>时间分割工具</h3>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">开始时间：</label>
                <input type="time" id="startTime" style="width: 100%; padding: 8px; box-sizing: border-box;" required>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">结束时间：</label>
                <input type="time" id="endTime" style="width: 100%; padding: 8px; box-sizing: border-box;" required>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <button type="button" id="cancelBtn" style="padding: 8px 16px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
                <button type="submit" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">分割并填写</button>
            </div>
        `;

        // 表单提交事件
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const startTime = document.getElementById('startTime').value;
            const endTime = document.getElementById('endTime').value;
            console.log('[时间分割工具] 表单提交，开始时间:', startTime, '结束时间:', endTime);
            const timeSegments = splitTime(startTime, endTime);
            await fillTimeInputs(timeSegments);
            dialog.remove();
            console.log('[时间分割工具] 对话框已关闭');
        });

        // 添加到对话框
        dialog.appendChild(form);
        document.body.appendChild(dialog);
        
        // 取消按钮事件 - 现在表单已添加到DOM，可以获取元素
        document.getElementById('cancelBtn').addEventListener('click', function() {
            dialog.remove();
        });
    }

    // 分割时间函数
    function splitTime(startStr, endStr) {
        console.log('[时间分割工具] 开始分割时间，输入:', startStr, '至', endStr);
        // 创建基于当前日期的时间对象，仅用于处理时间部分
        const baseDate = new Date();
        baseDate.setHours(0, 0, 0, 0);
        
        // 解析开始时间和结束时间
        const [startHours, startMinutes] = startStr.split(':').map(Number);
        const [endHours, endMinutes] = endStr.split(':').map(Number);
        console.log('[时间分割工具] 解析时间，开始:', startHours, ':', startMinutes, '结束:', endHours, ':', endMinutes);
        
        // 创建开始和结束时间对象
        const start = new Date(baseDate);
        start.setHours(startHours, startMinutes, 0, 0);
        
        const end = new Date(baseDate);
        end.setHours(endHours, endMinutes, 0, 0);
        
        // 处理跨天情况
        if (end <= start) {
            end.setDate(end.getDate() + 1);
            console.log('[时间分割工具] 处理跨天情况，结束时间已调整为次日');
        }
        
        console.log('[时间分割工具] 实际处理的时间范围:', formatTime(start), '至', formatTime(end));
        const segments = [];
        let current = start;
        
        // 第一个时间段例外处理，保证整点或30分被包含在区间内，但开始和结束时间不等于整点或30分
        console.log('[时间分割工具] 开始第一个时间段的例外处理');
        
        // 确保开始时间不是整点或30分
        let adjustedStart = new Date(current);
        const adjustedStartMinutes = adjustedStart.getMinutes();
        if (adjustedStartMinutes === 0 || adjustedStartMinutes === 30) {
            adjustedStart.setMinutes(adjustedStartMinutes + 1);
            console.log('[时间分割工具] 调整开始时间，从', formatTime(current), '到', formatTime(adjustedStart), '（避免整点或30分）');
        }
        
        // 计算结束时间，确保区间内包含整点或30分
        let firstSegmentEnd = new Date(adjustedStart.getTime() + 30 * 60 * 1000);
        let actualFirstEnd = firstSegmentEnd > end ? end : firstSegmentEnd;
        
        // 确保结束时间不是整点或30分
        const adjustedEndMinutes = actualFirstEnd.getMinutes();
        if (adjustedEndMinutes === 0 || adjustedEndMinutes === 30) {
            actualFirstEnd.setMinutes(adjustedEndMinutes - 1);
            console.log('[时间分割工具] 调整结束时间，从', formatTime(firstSegmentEnd), '到', formatTime(actualFirstEnd), '（避免整点或30分）');
        }
        
        // 确保区间内包含至少一个整点或30分
        if (!hasHourOrHalfHour(adjustedStart, actualFirstEnd)) {
            // 如果区间内没有整点或30分，扩展结束时间
            const nextHour = new Date(actualFirstEnd);
            nextHour.setMinutes(0, 0, 0);
            nextHour.setHours(nextHour.getHours() + 1);
            actualFirstEnd = nextHour > end ? end : nextHour;
            actualFirstEnd.setMinutes(actualFirstEnd.getMinutes() - 1);
            console.log('[时间分割工具] 扩展结束时间，确保区间内包含整点或30分，新结束时间:', formatTime(actualFirstEnd));
        }
        
        const firstSegment = {
            start: formatTime(adjustedStart),
            end: formatTime(actualFirstEnd)
        };
        segments.push(firstSegment);
        console.log('[时间分割工具] 添加第一个例外时间段:', firstSegment.start, '至', firstSegment.end);
        
        // 移动到下一个时间段的开始
        current = new Date(actualFirstEnd.getTime() + 1 * 60 * 1000);
        console.log('[时间分割工具] 第一个时间段处理完成，移动到下一个开始时间:', formatTime(current));
        
        // 对于剩余时间段，使用正常的分割逻辑
        if (current < end) {
            console.log('[时间分割工具] 开始处理剩余时间段');
            // 找到第一个有效的开始时间（01或31分）
            current = findValidStartTime(current);
            console.log('[时间分割工具] 剩余时间段的第一个有效开始时间:', formatTime(current));
            
            while (current < end) {
                // 计算结束时间
                const segmentEnd = calculateSegmentEnd(current);
                console.log('[时间分割工具] 计算结束时间，当前:', formatTime(current), '结束:', formatTime(segmentEnd));
                
                // 如果结束时间超过总结束时间，退出循环
                if (segmentEnd > end) {
                    console.log('[时间分割工具] 结束时间', formatTime(segmentEnd), '超过总结束时间', formatTime(end), '，退出循环');
                    break;
                }
                
                // 添加时间段到结果中
                const segment = {
                    start: formatTime(current),
                    end: formatTime(segmentEnd)
                };
                segments.push(segment);
                console.log('[时间分割工具] 添加时间段:', segment.start, '至', segment.end);
                
                // 移动到下一个时间段的开始（当前结束时间+2分钟）
                current = new Date(segmentEnd.getTime() + 2 * 60 * 1000);
                console.log('[时间分割工具] 移动到下一个开始时间:', formatTime(current));
            }
        }

        console.log('[时间分割工具] 时间分割完成，共生成', segments.length, '个时间段');
        segments.forEach((segment, index) => {
            console.log(`[时间分割工具] 时间段 ${index + 1}: ${segment.start} 至 ${segment.end}`);
        });
        return segments;
    }
    
    // 找到有效的开始时间（01或31分）
    function findValidStartTime(time) {
        const adjusted = new Date(time);
        const minutes = adjusted.getMinutes();
        
        if (minutes < 1) {
            // 当前时间在00分，调整到01分
            adjusted.setMinutes(1);
            console.log('[时间分割工具] 调整开始时间，当前分钟为', minutes, '调整到01分');
        } else if (minutes > 1 && minutes < 31) {
            // 当前时间在02-30分，调整到31分
            adjusted.setMinutes(31);
            console.log('[时间分割工具] 调整开始时间，当前分钟为', minutes, '调整到31分');
        } else if (minutes > 31 && minutes <= 59) {
            // 当前时间在32-59分，调整到下一小时的01分
            adjusted.setHours(adjusted.getHours() + 1, 1, 0, 0);
            console.log('[时间分割工具] 调整开始时间，当前分钟为', minutes, '调整到下一小时的01分');
        }
        // 如果当前时间已经是01或31分，保持不变
        
        return adjusted;
    }
    
    // 计算时间段结束时间
    function calculateSegmentEnd(startTime) {
        const end = new Date(startTime);
        const minutes = end.getMinutes();
        
        if (minutes === 1) {
            // 从01分开始，结束时间为29分
            end.setMinutes(29);
        } else if (minutes === 31) {
            // 从31分开始，结束时间为59分
            end.setMinutes(59);
        }
        
        return end;
    }
    
    // 检查时间段内是否包含整点或30分
    function hasHourOrHalfHour(start, end) {
        let checkTime = new Date(start);
        
        // 每分钟检查一次
        while (checkTime < end) {
            const minutes = checkTime.getMinutes();
            if (minutes === 0 || minutes === 30) {
                return true;
            }
            // 增加1分钟
            checkTime.setMinutes(checkTime.getMinutes() + 1);
        }
        
        return false;
    }
    
    // 调整开始时间，确保不是整点或30分
    function adjustStartTime(time) {
        const minutes = time.getMinutes();
        let adjusted = new Date(time);
        
        // 如果当前是整点或30分，调整到下一分钟
        if (minutes === 0 || minutes === 30) {
            adjusted.setMinutes(minutes + 1);
            console.log('[时间分割工具] 开始时间调整，当前分钟为', minutes, '调整到', adjusted.getMinutes());
        }
        
        return adjusted;
    }
    
    // 调整结束时间，确保不超过29分钟且不包含整点或30分
    function adjustEndTime(end, start) {
        let adjusted = new Date(end);
        
        // 检查结束时间是否是整点或30分
        while (adjusted > start) {
            const minutes = adjusted.getMinutes();
            if (minutes !== 0 && minutes !== 30) {
                break;
            }
            // 如果是，调整到前一分钟
            const beforeAdjust = new Date(adjusted);
            adjusted.setMinutes(minutes - 1);
            console.log('[时间分割工具] 结束时间调整，从', formatTime(beforeAdjust), '到', formatTime(adjusted));
        }
        
        return adjusted;
    }

    // 检查时间段是否包含整点或30分
    function hasInvalidTime(start, end) {
        console.log('[时间分割工具] 检查时间段是否包含无效时间，从', formatTime(start), '到', formatTime(end));
        let checkTime = new Date(start);
        
        // 每分钟检查一次
        while (checkTime < end) {
            const minutes = checkTime.getMinutes();
            if (minutes === 0 || minutes === 30) {
                console.log('[时间分割工具] 时间段包含无效时间', formatTime(checkTime));
                return true;
            }
            // 增加1分钟
            checkTime.setMinutes(checkTime.getMinutes() + 1);
        }
        
        console.log('[时间分割工具] 时间段有效，不包含无效时间');
        return false;
    }

    // 格式化时间为HH:mm:ss格式（24小时制）
    function formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        const formatted = `${hours}:${minutes}:${seconds}`;
        // console.log('[时间分割工具] 格式化时间，输入:', date, '输出:', formatted); // 可选，频繁调用可能导致日志过多
        return formatted;
    }

    // 查找并填写时间控件
    async function fillTimeInputs(timeSegments) {
        console.log('[时间分割工具] 开始填写时间到控件，时间段数量:', timeSegments.length);
        
        // 调整控件数量
        await adjustInputCount(timeSegments.length);
        
        // 查找所有符合条件的控件
        const inputs = document.querySelectorAll('.el-range-input');
        console.log('[时间分割工具] 调整后，找到 .el-range-input 控件数量:', inputs.length);
        
        const startInputs = [];
        const endInputs = [];
        
        // 分类开始时间和结束时间控件
        inputs.forEach(input => {
            if (input.placeholder === '开始时间') {
                startInputs.push(input);
            } else if (input.placeholder === '结束时间') {
                endInputs.push(input);
            }
        });
        
        console.log('[时间分割工具] 分类后，开始时间控件数量:', startInputs.length, '结束时间控件数量:', endInputs.length);
        
        // 第一步：先点击所有开始时间控件进行初始化
        console.log('[时间分割工具] 开始点击所有开始时间控件进行初始化');
        for (let index = 0; index < timeSegments.length; index++) {
            if (startInputs[index]) {
                // 点击开始时间控件初始化（同时也会初始化结束时间控件）
                startInputs[index].click();
                console.log('[时间分割工具] 点击开始时间控件', index + 1, '初始化（同时初始化结束时间控件）');
                
                // 等待一下，确保初始化完成
                await wait(200);
                
                // 关闭弹出的时间框
                await closeTimePanel();
            }
        }
        
        // 第二步：处理所有输入值
        console.log('[时间分割工具] 开始处理所有输入值');
        for (let index = 0; index < timeSegments.length; index++) {
            const segment = timeSegments[index];
            if (startInputs[index] && endInputs[index]) {
                // 设置开始时间值
                setInputValue(startInputs[index], segment.start);
                console.log('[时间分割工具] 填写开始时间控件', index + 1, '值:', segment.start);
                
                // 设置结束时间值
                setInputValue(endInputs[index], segment.end);
                console.log('[时间分割工具] 填写结束时间控件', index + 1, '值:', segment.end);
            }
        }
        
        // 第三步：确保所有时间框都已关闭
        console.log('[时间分割工具] 确保所有时间框都已关闭');
        await closeTimePanel();
        console.log('[时间分割工具] 时间填写完成');
    }
    
    // 调整时间输入框数量
    async function adjustInputCount(targetCount) {
        console.log('[时间分割工具] 开始调整输入框数量，目标数量:', targetCount);
        
        while (true) {
            // 查找当前的开始时间控件数量
            const currentStartInputs = document.querySelectorAll('.el-range-input[placeholder="开始时间"]');
            const currentCount = currentStartInputs.length;
            console.log('[时间分割工具] 当前开始时间控件数量:', currentCount);
            
            if (currentCount === targetCount) {
                // 数量匹配，退出循环
                console.log('[时间分割工具] 输入框数量已匹配目标数量');
                break;
            } else if (currentCount < targetCount) {
                // 数量不足，添加控件
                console.log('[时间分割工具] 输入框数量不足，需要添加', targetCount - currentCount, '个');
                const addButton = document.querySelector('.el-icon-circle-plus-outline');
                if (addButton) {
                    addButton.click();
                    console.log('[时间分割工具] 点击添加按钮');
                    // 等待一下，确保控件添加完成
                    await wait(200);
                } else {
                    console.error('[时间分割工具] 未找到添加按钮');
                    break;
                }
            } else {
                // 数量过多，删除控件
                console.log('[时间分割工具] 输入框数量过多，需要删除', currentCount - targetCount, '个');
                const removeButtons = document.querySelectorAll('.el-icon-remove-outline');
                if (removeButtons.length > 0) {
                    // 点击最后一个删除按钮
                    const lastRemoveButton = removeButtons[removeButtons.length - 1];
                    lastRemoveButton.click();
                    console.log('[时间分割工具] 点击删除按钮');
                    // 等待一下，确保控件删除完成
                    await wait(200);
                } else {
                    console.error('[时间分割工具] 未找到删除按钮');
                    break;
                }
            }
        }
    }
    
    // 等待指定毫秒数
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 关闭时间面板
    async function closeTimePanel() {
        console.log('[时间分割工具] 开始关闭弹出的时间框');
        const cancelButtons = document.querySelectorAll('.el-time-panel__btn.cancel');
        if (cancelButtons.length > 0) {
            cancelButtons.forEach(button => {
                button.click();
                console.log('[时间分割工具] 点击了关闭时间框按钮');
            });
            // 等待一下，确保关闭完成
            await wait(100);
        } else {
            console.log('[时间分割工具] 未找到关闭时间框按钮');
        }
    }
    
    // 设置input值并触发相关事件
    function setInputValue(input, value) {
        // 修改value属性
        input.value = value;
        
        // 触发input事件
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        input.dispatchEvent(inputEvent);
        console.log('[时间分割工具] 触发了input事件');
        
        // 触发change事件
        const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        input.dispatchEvent(changeEvent);
        console.log('[时间分割工具] 触发了change事件');
        
        // 触发blur事件
        const blurEvent = new Event('blur', {
            bubbles: true,
            cancelable: true
        });
        input.dispatchEvent(blurEvent);
        console.log('[时间分割工具] 触发了blur事件');
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        console.log('[时间分割工具] 页面加载完成，开始初始化');
        createButton();
        console.log('[时间分割工具] 初始化完成');
    });
})();