// ==UserScript==
// @name         deepseek-question-list
// @namespace    https://github.com/firesahc/deepseek-question-list
// @version      1.7.3
// @description  展示网页版deepseek当前对话的所有提问
// @author       firesahc
// @match        https://chat.deepseek.com/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/555503/deepseek-question-list.user.js
// @updateURL https://update.greasyfork.org/scripts/555503/deepseek-question-list.meta.js
// ==/UserScript==

let observer = null;
let isObserving = false;
let debounceTimer = null;

function createParserInit() {
    const existingList = document.getElementById('xpath-parser-list');
    if (existingList) existingList.remove();

    const listContainer = document.createElement('div');
    listContainer.id = 'xpath-parser-list';
    listContainer.style.cssText = `
        top: 10px;
        right: 50px;
        gap: 8px;
        overflow-y: auto;
        z-index: 1000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        display: flex;
        flex-direction: column;
    `;

    const topButtonBar = document.createElement('div');
    topButtonBar.style.cssText = `
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    `;

    const contentArea = document.createElement('div');
    contentArea.id = 'xpath-list-content';
    contentArea.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 4px;
    `;
    
    addTopButtons(topButtonBar, listContainer, contentArea);
    
    listContainer.appendChild(topButtonBar);
    listContainer.appendChild(contentArea);
    
    // 延迟启动观察器
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        addQuestionCollapseButtons();

        // 将列表框添加到 class="c3ecdb44" 的元素内部
        const targetContainer = document.querySelector('.c3ecdb44');
        if (targetContainer) {
            targetContainer.appendChild(listContainer);
        }
    }, 350)
}

function startObservation(contentArea) {
    if (isObserving) return true;

    observer = new MutationObserver((mutations) => {
        let shouldParse = false;
        for (const mutation of mutations) {
            // 检查目标元素的类名
            const targetClass = mutation.target.className;
            
            // 情况1: 直接检测到 dad65929 的变化
            if (mutation.type === 'childList' &&
                typeof targetClass === 'string' &&
                targetClass.includes('dad65929')) {
                shouldParse = true;
                break;
            }
            
            // 情况2: 检测到滚动区域的变化，且涉及 dad65929 节点
            if (mutation.type === 'childList' &&
                typeof targetClass === 'string' &&
                targetClass.includes('_0f72b0b') &&
                targetClass.includes('ds-scroll-area')) {
                // 检查添加的节点
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            node.classList &&
                            node.classList.contains('dad65929')) {
                            shouldParse = true;
                            break;
                        }
                    }
                }
                // 检查移除的节点
                else if (mutation.removedNodes.length > 0) {
                    for (const node of mutation.removedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            node.classList &&
                            node.classList.contains('dad65929')) {
                            shouldParse = true;
                            break;
                        }
                    }
                }
                if (shouldParse) break;
            }

            // 情况3: 检测到class属性移除了"_3111eee"
            if (mutation.type === 'attributes' &&
                typeof mutation.oldValue === 'string' &&
                mutation.oldValue.includes('_9663006') &&
                mutation.oldValue.includes('_3111eee')) {
                if (!targetClass.includes('_3111eee')) {
                    shouldParse = true;
                    break;
                }
            }
        }

        if (shouldParse) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const messageElements = parseElements(contentArea);
                contentArea.innerHTML = '';
                addListMessages(contentArea, messageElements);

                // 为每个目标元素添加收起按钮（仅当内容较长时）
                addElementCollapseButtons(messageElements);
            }, 300);
        }
    });

    // 获取目标元素
    const targetElement = document.querySelector('._0f72b0b.ds-scroll-area');
    if (!targetElement) {
        return false;
    }
    
    try {
        // 开始观察目标元素
        observer.observe(targetElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true,
            characterData: false
        });
        isObserving = true;
        return true;
    } catch (error) {
        isObserving = false;
        return false;
    }
}

function stopObservation() {
    if (observer) {
        observer.disconnect();
        observer = null;
        isObserving = false;
        clearTimeout(debounceTimer);
    }
}

function parseElements(contentArea) {
    try {
        contentArea.innerHTML = '';
        const targetElements = document.querySelectorAll('.fbb737a4');
        if (targetElements.length === 0) {
            return;
        }

        const messageElements = [];
        targetElements.forEach(element => {
            messageElements.push({
                targetElement: element
            });
        });
        if (messageElements.length === 0) {
            return;
        }
        else{
            return messageElements;
        }
    } catch (error) {
        return;
    }
}

function addElementCollapseButtons(messageElements) {
    messageElements.forEach((item, index) => {
        const element = item.targetElement;
        
        // 检查是否已经添加过按钮
        if (element.hasAttribute('data-collapse-button-added')) {
            return;
        }

        // 如果内容高度不超过400px，不需要添加收起按钮
        if (element.scrollHeight <= 400) {
            return;
        }

        // 标记已添加按钮
        element.setAttribute('data-collapse-button-added', 'true');

        // 确保元素有相对定位，以便按钮可以绝对定位
        const originalPosition = element.style.position;
        if (!originalPosition || originalPosition === 'static') {
            element.style.position = 'relative';
        }

        // 创建收起按钮
        const collapseButton = document.createElement('button');
        collapseButton.textContent = '收起';
        collapseButton.style.cssText = `
            position: absolute;
            top: 5px;
            left: 5px;
            z-index: 1000;
            background: rgba(100, 100, 100, 0.8);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        `;

        // 存储原始高度和溢出状态
        const originalHeight = element.style.height;
        const originalOverflow = element.style.overflow;
        let isCollapsed = false;

        collapseButton.addEventListener('mouseenter', () => {
            collapseButton.style.opacity = '1';
        });

        collapseButton.addEventListener('mouseleave', () => {
            collapseButton.style.opacity = '0.8';
        });

        collapseButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isCollapsed) {
                // 展开
                element.style.height = originalHeight || '';
                element.style.overflow = originalOverflow || '';
                collapseButton.textContent = '收起';
                isCollapsed = false;
            } else {
                // 收起
                element.style.height = '110px';
                element.style.overflow = 'hidden';
                collapseButton.textContent = '展开';
                isCollapsed = true;
            }
        });

        // 添加按钮到元素
        element.appendChild(collapseButton);
    });
}

function addQuestionCollapseButtons(){
    // 尝试查找目标元素
    const questionElement = document.querySelector('._871cbca');
    if (!questionElement) {
        return;
    }
    
    const toggleButton = document.createElement('button');
    // 获取目标容器元素
    const containerElement = document.querySelector('._7780f2e');
    if (!containerElement) {
        return;
    } else {
        toggleButton.textContent = '▼';
        // 设置容器元素为相对定位，以便按钮可以相对于它定位
        containerElement.style.position = 'relative';
        // 将按钮添加到容器元素内部
        containerElement.appendChild(toggleButton);
        // 设置按钮样式 - 在容器元素内部居中
        toggleButton.style.cssText = `
            position: absolute;
            bottom: 0; 
            left: 50%; /* 水平居中定位 */
            transform: translateX(-50%); /* 水平居中调整 */
            z-index: 1000;
            padding: 8px 20px;
            background-color: rgba(255, 255, 255, 0.3);
            color: #000;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-bottom: none;
            border-radius: 8px 8px 0 0;
            cursor: pointer;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            font-size: 10px;
            font-weight: bold;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        `;
    }

    // 添加点击事件
    toggleButton.addEventListener('click', function () {
        if (questionElement.style.display === 'none') {
            questionElement.style.display = 'block';
            toggleButton.textContent = '▼';
        } else {
            questionElement.style.display = 'none';
            toggleButton.textContent = '▲';
        };
    });
}

function addListMessages(contentArea, messageElements) {
    const list = document.createElement('ul');
    list.style.cssText = `
        list-style: none;
        margin: 0;
        padding: 0;
    `;

    messageElements.forEach((item, index) => {
        const listItem = createListItem(item, index);
        list.appendChild(listItem);
    });

    contentArea.appendChild(list);
}

function createListItem(item, index) {
    const listItem = document.createElement('li');
    listItem.style.cssText = `
        margin-bottom: 4px;
        padding: 4px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        background: #fafafa;
        cursor: pointer;
        transition: all 0.2s ease;
    `;

    listItem.addEventListener('mouseenter', () => {
        listItem.style.background = '#f0f8ff';
        listItem.style.borderColor = '#4CAF50';
    });

    listItem.addEventListener('mouseleave', () => {
        listItem.style.background = '#fafafa';
        listItem.style.borderColor = '#e0e0e0';
    });

    const indexInfo = document.createElement('div');
    indexInfo.style.cssText = `
        font-weight: bold;
        color: #2196F3;
        font-size: 14px;
    `;
    indexInfo.textContent = `问题 ${index + 1}`;

    const contentPreview = document.createElement('div');
    contentPreview.style.cssText = `
        color: #333;
        font-size: 13px;
        line-height: 1.4;
        background: white;
        padding: 4px;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
    `;
    
    const textContent = item.targetElement.textContent?.trim() || '';
    contentPreview.textContent = textContent ?
        (textContent.length > 120 ? 
             textContent.substring(0, 120) + '...' : 
             textContent
        ) :
        '[空内容]';

    listItem.appendChild(indexInfo);
    listItem.appendChild(contentPreview);

    //点击跳转到问题起始
    listItem.addEventListener('click', () => {
        item.targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return listItem;
}

function addTopButtons(buttonContainer, listContainer, contentArea) {
    const buttonStyle = `
        padding: 6px 6px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        transition: all 0.2s ease;
        flex: 1;
        min-width: 30px;
    `;

    // 从油猴存储中读取 isContentVisible 的值，默认值为 true（显示状态）
    let isContentVisible = GM_getValue('isContentVisible', true);

    // 根据存储的值初始化内容区域的显示状态
    contentArea.style.display = isContentVisible ? 'block' : 'none';
    listContainer.style.padding = isContentVisible ? '6px' : '0px';
    listContainer.style.border = isContentVisible ? '2px solid #f5f5f5' : '';
    listContainer.style.position =isContentVisible ? '':' fixed';
    listContainer.style.width=isContentVisible ? '240px':' 100px';

    const parseButton = createButton(isObserving? '停止解析':'开始解析', '#2196F3', '#1976D2', () => {
        if (isObserving) {
            // 停止解析
            stopObservation();
            parseButton.textContent = '开始解析';
        } else {
            // 开始解析
            const success = startObservation(contentArea);
            if (success) {
                parseButton.textContent = '停止解析';
                // 立即执行一次解析
                const messageElements = parseElements(contentArea);
                contentArea.innerHTML = '';
                addListMessages(contentArea, messageElements);

                // 为每个目标元素添加收起按钮（仅当内容较长时）
                addElementCollapseButtons(messageElements);
            }
        }
    });

    const toggleButton = createButton(isContentVisible ? '隐藏列表' : '显示列表', '#FF9800', '#F57C00', () => {
        isContentVisible = !isContentVisible;
        toggleButton.textContent = isContentVisible ? '隐藏列表' : '显示列表';
        contentArea.style.display = isContentVisible ? 'block' : 'none';
        listContainer.style.padding = isContentVisible ? '6px' : '0px';
        listContainer.style.border = isContentVisible ? '2px solid #f5f5f5' : '';
        listContainer.style.position =isContentVisible ? '':' fixed';
        listContainer.style.width=isContentVisible ? '240px':' 100px';
        // 将新的 isContentVisible 值保存到油猴存储中
        GM_setValue('isContentVisible', isContentVisible);
    });

    buttonContainer.appendChild(parseButton);
    buttonContainer.appendChild(toggleButton);
}

function createButton(text, bgColor, hoverColor, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
        padding: 6px 6px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        transition: all 0.2s ease;
        flex: 1;
        min-width: 30px;
        background: ${bgColor};
        color: white;
    `;

    button.addEventListener('mouseenter', () => {
        button.style.background = hoverColor;
    });

    button.addEventListener('mouseleave', () => {
        button.style.background = bgColor;
    });

    button.addEventListener('click', clickHandler);
    return button;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createParserInit);
} else {
    createParserInit();
}

window.createParser = createParserInit;
window.parseTarget = function() {
    const contentArea = document.getElementById('xpath-list-content');
    if (contentArea) {
        const messageElements = parseElements(contentArea);
        contentArea.innerHTML = '';
        addListMessages(contentArea, messageElements);

        // 为每个目标元素添加收起按钮（仅当内容较长时）
        addElementCollapseButtons(messageElements);
    }
};
