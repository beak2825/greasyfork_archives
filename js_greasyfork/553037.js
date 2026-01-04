// ==UserScript==
// @name         测试脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  根据星期几自动匹配关键字并执行右键点击操作
// @author       You
// @match        http://47.108.79.7:5244/%E7%99%BE%E5%BA%A6%E4%BA%91*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553037/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553037/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心功能：计算当天的关键字
    function getTodayKeyword() {
        const today = new Date().getDay(); // 0是星期日，1-6是星期一到星期六

        switch(today) {
            case 4: // 星期四
                return "完美世界";
            case 6: // 星期六
                return "斗破苍穹";
            case 0: // 星期日
                return "仙逆";
            default:
                return null; // 其他日子不进行操作
        }
    }

    // 核心功能：模糊匹配函数
    function fuzzyMatch(text, keyword) {
        if (!text || !keyword) return false;
        return text.includes(keyword);
    }

    // 核心功能：模拟真实鼠标右键点击操作
    function simulateRightClick(element) {
        if (!element) {
            console.log('元素不存在，无法执行右键点击');
            return;
        }

        console.log(`执行真实鼠标右键点击操作，元素: ${element.tagName}${element.id ? `#${element.id}` : ''}`);

        // 计算元素中心点坐标（更接近真实用户点击行为）
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        console.log(`计算的点击坐标: (${x.toFixed(2)}, ${y.toFixed(2)})`);

        // 确保元素在视图中
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 强制元素可点击
        element.style.pointerEvents = 'auto';

        // 真实鼠标操作序列：mouseover -> mousemove -> mousedown -> mouseup -> contextmenu

        // 1. 鼠标悬停事件
        console.log('步骤1: 模拟鼠标悬停');
        const mouseOverEvent = new MouseEvent('mouseover', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            buttons: 0
        });
        element.dispatchEvent(mouseOverEvent);

        // 2. 鼠标移动事件
        setTimeout(() => {
            console.log('步骤2: 模拟鼠标移动');
            const mouseMoveEvent = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y,
                buttons: 0
            });
            element.dispatchEvent(mouseMoveEvent);

            // 3. 鼠标按下事件
            setTimeout(() => {
                console.log('步骤3: 模拟鼠标按下(右键)');
                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 2, // 右键
                    buttons: 2,
                    clientX: x,
                    clientY: y
                });
                element.dispatchEvent(mouseDownEvent);

                // 4. 鼠标释放事件
                setTimeout(() => {
                    console.log('步骤4: 模拟鼠标释放');
                    const mouseUpEvent = new MouseEvent('mouseup', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        button: 2,
                        buttons: 0,
                        clientX: x,
                        clientY: y
                    });
                    element.dispatchEvent(mouseUpEvent);

                    // 5. 右键菜单事件 - 使用标准方法
                    setTimeout(() => {
                        console.log('步骤5: 触发右键菜单事件');
                        const contextMenuEvent = new MouseEvent('contextmenu', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            button: 2,
                            buttons: 0,
                            clientX: x,
                            clientY: y,
                            composed: true
                        });
                        const result = element.dispatchEvent(contextMenuEvent);
                        console.log(`右键菜单事件触发${result ? '成功' : '被阻止'}`);

                        // 备用方法：使用createEvent（兼容旧网站）
                        if (!result) {
                            console.log('尝试备用方法：createEvent创建右键菜单事件');
                            try {
                                const oldEvent = document.createEvent('MouseEvent');
                                oldEvent.initMouseEvent(
                                    'contextmenu',
                                    true,  // bubbles
                                    true,  // cancelable
                                    window,
                                    null,
                                    0, 0, x, y,  // screenX, screenY, clientX, clientY
                                    false, false, false, false,  // ctrl, alt, shift, meta
                                    2,  // button
                                    null
                                );
                                element.dispatchEvent(oldEvent);
                                console.log('备用方法执行完成');
                            } catch (e) {
                                console.log('备用方法执行失败:', e);
                            }
                        }

                        // 详细日志
                        console.log('右键点击操作序列完成');
                        console.log(`元素位置: 左=${rect.left.toFixed(2)}, 上=${rect.top.toFixed(2)}, 宽=${rect.width.toFixed(2)}, 高=${rect.height.toFixed(2)}`);
                        console.log(`元素可交互状态: 可见=${!element.hidden && rect.height > 0 && rect.width > 0}`);

                    }, 50); // 右键按下和释放之间的延迟
                }, 100); // 鼠标移动和按下之间的延迟
            }, 50); // 鼠标悬停和移动之间的延迟
        }, 50); // 开始执行鼠标操作的初始延迟
    }

    // 主函数 - 严格按照要求实现：计算关键字 -> 从第一行开始循环 -> 模糊匹配 -> 找到匹配后右键点击并结束
    function main() {
        // 步骤1: 计算当天的关键字
        const keyword = getTodayKeyword();

        // 如果当天没有对应的关键字，不执行操作
        if (!keyword) {
            console.log('今天没有需要匹配的关键字');
            return;
        }

        console.log(`今天的关键字是: ${keyword}`);

        // 步骤2: 从第一行开始循环，根据用户提供的XPath，第一行索引为2
        let currentRowIndex = 2; // 从用户指定的第一行元素开始
        const maxRowsToCheck = 100; // 设置合理的最大行数，防止意外的无限循环

        // 核心循环：遍历每一行直到找到匹配项或达到最大行数
        while (currentRowIndex <= maxRowsToCheck + 1) { // +1 因为起始索引是2
            // 使用用户提供的正确行元素XPath格式
            const rowXPath = `//*[@id="root"]/div[2]/div/div/div/div[${currentRowIndex}]`;
            const rowElement = document.evaluate(rowXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            // 如果找不到当前行元素，说明没有更多行了
                if (!rowElement) {
                    console.log(`没有找到索引为${currentRowIndex}的行元素，结束搜索`);
                    break;
                }

            // 构建文件名元素的XPath，基于正确的行元素路径
            const fileNameXPath = `//*[@id="root"]/div[2]/div/div/div/div[${currentRowIndex}]/div/div/a/p`;
            const fileNameElement = document.evaluate(fileNameXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (fileNameElement) {
                const fileName = fileNameElement.textContent.trim();
                console.log(`检查索引为${currentRowIndex}的行: ${fileName}`);

                // 步骤3: 进行模糊匹配
                if (fuzzyMatch(fileName, keyword)) {
                    console.log(`匹配成功! 文件名: ${fileName} 包含关键字: ${keyword}`);

                    // 步骤4: 找到匹配项后，右键点击该行，然后结束循环
                      simulateRightClick(rowElement);
                      console.log('找到匹配项，已执行右键点击操作，结束搜索');

                      // 立即结束循环，不继续检查下一行
                      return;
                }
            }

            // 如果没有匹配，继续检查下一行
            currentRowIndex++;
        }
    }

    // 当页面加载完成后执行主函数
    window.addEventListener('load', function() {
        // 添加一个小延迟确保所有DOM元素都已加载完成
        setTimeout(main, 2000);
    });

    console.log('油猴脚本已加载002111000000');

})();