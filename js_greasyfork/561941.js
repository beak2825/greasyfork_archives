// ==UserScript==
// @name         stable diffusion webui提示词分组器
// @namespace    http://tampermonkey.net/
// @version      2026-1-11.1.8
// @description  用来在sdwebui上附加N个提示词输入框，方便分别输入提示词（如风景、人物、衣服）同时可以将提示词保存为json文件，方便读取
// @author       ragnaDolphin
// @match        *://127.0.0.1:7860/*
// @match        *://localhost:7860/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/561941/stable%20diffusion%20webui%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%88%86%E7%BB%84%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561941/stable%20diffusion%20webui%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%88%86%E7%BB%84%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hasUnsavedChanges = false;

    window.addEventListener('beforeunload', function(e) {
        // 只有在有未保存更改时才显示提示
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '您有未保存的更改，确定要离开此页面吗？';
            return '您有未保存的更改，确定要离开此页面吗？';
        }
    });

    // 目标输入框的选择器（针对txt2img提示框；如果img2img，改为 '#img2img_prompt textarea'）
    const targetInputSelector = '#txt2img_prompt_row';

    // 默认输入框标题
    const defaultTitles = ['合并', '镜头', '环境', '人物', '身体特征', '动作'];

    // 使用MutationObserver监视DOM变化
    const observer = new MutationObserver(function(mutations) {
        const targetInput = document.querySelector(targetInputSelector);
        if (targetInput && !targetInput.nextSibling?.textContent?.includes('添加输入框')) {  // 避免重复添加
            // 创建主容器，包含所有输入框和按钮
            const mainContainer = document.createElement('div');
            mainContainer.id = 'prompt-group-container';
            mainContainer.style.position = 'relative';
            mainContainer.style.marginTop = '10px';
            mainContainer.style.padding = '15px';
            mainContainer.style.backgroundColor = '#2a2a2a';
            mainContainer.style.border = '1px solid #444';
            mainContainer.style.borderRadius = '8px';
            mainContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

            // 创建内容容器，用于包裹所有输入框和按钮
            const contentContainer = document.createElement('div');
            contentContainer.id = 'content-container';
            contentContainer.style.display = 'block';

            // 创建按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.marginBottom = '15px';
            buttonContainer.style.alignItems = 'center';
            buttonContainer.style.position = 'relative'; // 确保按钮容器有定位上下文
            buttonContainer.style.zIndex = '10'; // 按钮容器在折叠区域之上
            buttonContainer.style.width = 'fit-content';


            // 创建标题输入框（小输入框）
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.id = 'title-input';
            titleInput.placeholder = '输入新输入框标题';
            titleInput.style.width = '150px';
            titleInput.style.padding = '5px';
            titleInput.style.backgroundColor = '#333';
            titleInput.style.color = '#fff';
            titleInput.style.border = '1px solid #555';
            titleInput.style.borderRadius = '3px';

            // 创建"添加输入框"按钮
            const addButton = document.createElement('button');
            addButton.textContent = '添加输入框';
            addButton.style.border = '1px solid #ccc';
            addButton.style.padding = '5px 10px';
            addButton.style.backgroundColor = '#555';
            addButton.style.color = '#fff';
            addButton.style.borderRadius = '3px';
            addButton.style.cursor = 'pointer';

            // 创建"合并文本"按钮
            const mergeButton = document.createElement('button');
            mergeButton.id = 'merge-input-button';
            mergeButton.textContent = '合并文本';
            mergeButton.style.border = '1px solid #ccc';
            mergeButton.style.padding = '5px 10px';
            mergeButton.style.backgroundColor = '#f0ae33ff';
            mergeButton.style.color = '#fff';
            mergeButton.style.borderRadius = '3px';
            mergeButton.style.cursor = 'pointer';

            // 创建"保存文本"按钮
            const saveButton = document.createElement('button');
            saveButton.textContent = '保存文本';
            saveButton.title = '保存所有文本框内容为JSON文件';
            saveButton.style.border = '1px solid #ccc';
            saveButton.style.padding = '5px 10px';
            saveButton.style.backgroundColor = '#4CAF50';
            saveButton.style.color = '#fff';
            saveButton.style.borderRadius = '3px';
            saveButton.style.cursor = 'pointer';

            // 创建文件名输入框
            const fileNameInput = document.createElement('input');
            fileNameInput.type = 'text';
            fileNameInput.id = 'file-name-input';
            fileNameInput.placeholder = '文件名（不含扩展名）';
            fileNameInput.style.width = '180px';
            fileNameInput.style.padding = '5px';
            fileNameInput.style.backgroundColor = '#333';
            fileNameInput.style.color = '#fff';
            fileNameInput.style.border = '1px solid #555';
            fileNameInput.style.borderRadius = '3px';

            // 创建"读取文本"按钮
            const loadButton = document.createElement('button');
            loadButton.textContent = '读取文本';
            loadButton.title = '从JSON文件读取并还原文本框';
            loadButton.style.border = '1px solid #ccc';
            loadButton.style.padding = '5px 10px';
            loadButton.style.backgroundColor = '#2196F3';
            loadButton.style.color = '#fff';
            loadButton.style.cursor = 'pointer';
            loadButton.style.borderRadius = '3px';

            // 折叠状态变量
            let isCollapsed = false;

            // 创建顶部空白区域用于折叠/展开
            const topArea = document.createElement('div');
            topArea.id = 'top-collapse-area';
            topArea.style.position = 'absolute';
            topArea.style.top = '0';
            topArea.style.left = '0';
            topArea.style.right = '0';
            topArea.style.height = '60px';
            topArea.style.cursor = 'pointer';
            topArea.style.zIndex = '1'; // 降低层级，在按钮之下
            topArea.style.borderRadius = '8px 8px 0 0';
            topArea.style.backgroundColor = 'transparent'; // 透明背景
            topArea.title = '点击折叠/展开';

            // 添加折叠/展开指示器
            const collapseIndicator = document.createElement('div');
            collapseIndicator.id = 'collapse-indicator';
            collapseIndicator.style.position = 'absolute';
            collapseIndicator.style.top = '8px';
            collapseIndicator.style.right = '15px';
            collapseIndicator.style.width = '20px';
            collapseIndicator.style.height = '20px';
            collapseIndicator.style.display = 'flex';
            collapseIndicator.style.alignItems = 'center';
            collapseIndicator.style.justifyContent = 'center';
            collapseIndicator.style.color = '#888';
            collapseIndicator.style.fontSize = '16px';
            collapseIndicator.style.fontWeight = 'bold';
            collapseIndicator.style.userSelect = 'none';
            collapseIndicator.style.zIndex = '2'; // 指示器在顶部区域之上
            collapseIndicator.textContent = '▼'; // 向下箭头表示可折叠

            // 折叠/展开功能
            function toggleCollapse() {
                if (contentContainer) {
                    if (isCollapsed) {
                        // 展开
                        contentContainer.style.display = 'block';
                        isCollapsed = false;
                        collapseIndicator.textContent = '▼'; // 向下箭头
                        collapseIndicator.title = '点击折叠';
                        // 移除全屏点击展开功能
                        mainContainer.style.cursor = 'default';
                        mainContainer.removeEventListener('click', expandOnClick);
                    } else {
                        // 折叠
                        contentContainer.style.display = 'none';
                        isCollapsed = true;
                        collapseIndicator.textContent = '▲'; // 向上箭头
                        collapseIndicator.title = '点击展开';
                        // 添加全屏点击展开功能
                        mainContainer.style.cursor = 'pointer';
                        mainContainer.addEventListener('click', expandOnClick);
                    }
                }
            }

            // 全屏点击展开功能
            function expandOnClick(e) {
                // 如果点击的是顶部折叠区域本身，不处理（避免冲突）
                if (e.target === topArea || e.target === collapseIndicator) return;

                if (contentContainer && isCollapsed) {
                    contentContainer.style.display = 'block';
                    isCollapsed = false;
                    collapseIndicator.textContent = '▼';
                    collapseIndicator.title = '点击折叠';
                    // 移除全屏点击展开功能
                    mainContainer.style.cursor = 'default';
                    mainContainer.removeEventListener('click', expandOnClick);
                }
            }

            // 顶部区域点击事件
            topArea.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                toggleCollapse();
            });

            // 将折叠指示器添加到顶部区域
            topArea.appendChild(collapseIndicator);

            // 将顶部区域添加到主容器
            mainContainer.appendChild(topArea);

            // 将按钮添加到按钮容器
            buttonContainer.appendChild(titleInput);
            buttonContainer.appendChild(addButton);
            buttonContainer.appendChild(mergeButton);
            buttonContainer.appendChild(fileNameInput);
            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(loadButton);

            // 创建输入框容器，用于存放所有可拖拽输入框
            const inputsContainer = document.createElement('div');
            inputsContainer.id = 'inputs-container';
            inputsContainer.style.marginTop = '10px';

            // 将按钮容器和输入框容器添加到内容容器
            contentContainer.appendChild(buttonContainer);
            contentContainer.appendChild(inputsContainer);

            // 将内容容器添加到主容器
            mainContainer.appendChild(contentContainer);

            // 在目标输入框下方插入主容器
            targetInput.parentNode.insertBefore(mainContainer, targetInput.nextSibling);

            // 创建可拖拽拉伸的输入框
            function createResizableInput(titleText) {
                // 创建容器div，用于包裹输入框和拖拽手柄
                const inputContainer = document.createElement('div');
                inputContainer.className = 'resizable-input-container';
                inputContainer.style.position = 'relative';
                inputContainer.style.marginTop = '10px';
                inputContainer.style.width = '100%';
                inputContainer.style.border = '1px solid #444';
                inputContainer.style.borderRadius = '5px';
                inputContainer.style.padding = '10px';
                inputContainer.style.backgroundColor = '#2a2a2a';

                // 创建标题元素（左上显示）- 改为可编辑
                const titleLabel = document.createElement('span');
                titleLabel.textContent = titleText;
                titleLabel.style.display = 'block';
                titleLabel.style.marginBottom = '5px';
                titleLabel.style.fontWeight = 'bold';
                titleLabel.style.color = '#ddd';
                titleLabel.style.cursor = 'text';
                titleLabel.style.padding = '2px 5px';
                titleLabel.style.borderRadius = '3px';
                titleLabel.style.userSelect = 'text';
                titleLabel.title = '双击编辑标题';

                // 单击折叠功能
                titleLabel.addEventListener('click', function() {
                    const container = inputContainer;
                    const content = container.querySelector('.new-input');
                    const isCollapsed = container.classList.contains('collapsed');
                    if (isCollapsed) {
                        container.classList.remove('collapsed');
                        content.style.display = 'block';
                    } else {
                        container.classList.add('collapsed');
                        content.style.display = 'none';
                    }
                });

                // 双击编辑标题功能
                titleLabel.addEventListener('dblclick', function() {
                    const currentText = titleLabel.textContent;
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = currentText;
                    input.style.width = '100%';
                    input.style.padding = '2px 5px';
                    input.style.backgroundColor = '#333';
                    input.style.color = '#fff';
                    input.style.border = '1px solid #555';
                    input.style.borderRadius = '3px';
                    input.style.fontWeight = 'bold';
                    input.style.fontSize = 'inherit';

                    // 替换标题为输入框
                    titleLabel.style.display = 'none';
                    titleLabel.parentNode.insertBefore(input, titleLabel);
                    input.focus();
                    input.select();

                    // 保存编辑
                    function saveEdit() {
                        const newText = input.value.trim() || '无标题';
                        titleLabel.textContent = newText;
                        titleLabel.style.display = 'block';
                        input.remove();
                    }

                    // 回车保存
                    input.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter') {
                            saveEdit();
                        } else if (e.key === 'Escape') {
                            titleLabel.style.display = 'block';
                            input.remove();
                        }
                    });

                    // 失去焦点保存
                    input.addEventListener('blur', saveEdit);
                });

                // 创建向上移动按钮
                const moveUpButton = document.createElement('button');
                moveUpButton.textContent = '↑';
                moveUpButton.title = '向上移动';
                moveUpButton.style.position = 'absolute';
                moveUpButton.style.top = '5px';
                moveUpButton.style.right = '55px';
                moveUpButton.style.width = '20px';
                moveUpButton.style.height = '20px';
                moveUpButton.style.border = '1px solid #666';
                moveUpButton.style.backgroundColor = '#444';
                moveUpButton.style.color = '#fff';
                moveUpButton.style.cursor = 'pointer';
                moveUpButton.style.borderRadius = '3px';
                moveUpButton.style.display = 'flex';
                moveUpButton.style.alignItems = 'center';
                moveUpButton.style.justifyContent = 'center';
                moveUpButton.style.fontSize = '12px';
                moveUpButton.style.lineHeight = '1';
                moveUpButton.style.padding = '0';
                moveUpButton.style.zIndex = '20';

                // 创建向下移动按钮
                const moveDownButton = document.createElement('button');
                moveDownButton.textContent = '↓';
                moveDownButton.title = '向下移动';
                moveDownButton.style.position = 'absolute';
                moveDownButton.style.top = '5px';
                moveDownButton.style.right = '30px';
                moveDownButton.style.width = '20px';
                moveDownButton.style.height = '20px';
                moveDownButton.style.border = '1px solid #666';
                moveDownButton.style.backgroundColor = '#444';
                moveDownButton.style.color = '#fff';
                moveDownButton.style.cursor = 'pointer';
                moveDownButton.style.borderRadius = '3px';
                moveDownButton.style.display = 'flex';
                moveDownButton.style.alignItems = 'center';
                moveDownButton.style.justifyContent = 'center';
                moveDownButton.style.fontSize = '12px';
                moveDownButton.style.lineHeight = '1';
                moveDownButton.style.padding = '0';
                moveDownButton.style.zIndex = '20';

                // 创建删除按钮（右上角）
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '×';
                deleteButton.title = '删除此输入框';
                deleteButton.style.position = 'absolute';
                deleteButton.style.top = '5px';
                deleteButton.style.right = '5px';
                deleteButton.style.width = '20px';
                deleteButton.style.height = '20px';
                deleteButton.style.border = '1px solid #666';
                deleteButton.style.backgroundColor = '#444';
                deleteButton.style.color = '#fff';
                deleteButton.style.cursor = 'pointer';
                deleteButton.style.borderRadius = '50%';
                deleteButton.style.display = 'flex';
                deleteButton.style.alignItems = 'center';
                deleteButton.style.justifyContent = 'center';
                deleteButton.style.fontSize = '16px';
                deleteButton.style.lineHeight = '1';
                deleteButton.style.padding = '0';
                deleteButton.style.zIndex = '20';

                // 移动按钮悬停效果
                moveUpButton.addEventListener('mouseenter', function() {
                    moveUpButton.style.backgroundColor = '#666';
                    moveUpButton.style.borderColor = '#888';
                });
                moveUpButton.addEventListener('mouseleave', function() {
                    moveUpButton.style.backgroundColor = '#444';
                    moveUpButton.style.borderColor = '#666';
                });

                moveDownButton.addEventListener('mouseenter', function() {
                    moveDownButton.style.backgroundColor = '#666';
                    moveDownButton.style.borderColor = '#888';
                });
                moveDownButton.addEventListener('mouseleave', function() {
                    moveDownButton.style.backgroundColor = '#444';
                    moveDownButton.style.borderColor = '#666';
                });

                // 删除按钮悬停效果
                deleteButton.addEventListener('mouseenter', function() {
                    deleteButton.style.backgroundColor = '#ff4444';
                    deleteButton.style.borderColor = '#ff6666';
                });
                deleteButton.addEventListener('mouseleave', function() {
                    deleteButton.style.backgroundColor = '#444';
                    deleteButton.style.borderColor = '#666';
                });

                // 向上移动按钮点击事件
                moveUpButton.addEventListener('click', function() {
                    const containers = Array.from(document.querySelectorAll('.resizable-input-container'));
                    const currentIndex = containers.indexOf(inputContainer);
                    if (currentIndex > 0) {
                        const prevContainer = containers[currentIndex - 1];
                        inputContainer.parentNode.insertBefore(inputContainer, prevContainer);
                    }
                });

                // 向下移动按钮点击事件
                moveDownButton.addEventListener('click', function() {
                    const containers = Array.from(document.querySelectorAll('.resizable-input-container'));
                    const currentIndex = containers.indexOf(inputContainer);
                    if (currentIndex < containers.length - 1) {
                        const nextContainer = containers[currentIndex + 1];
                        inputContainer.parentNode.insertBefore(nextContainer, inputContainer);
                    }
                });

                // 删除按钮点击事件
                deleteButton.addEventListener('click', function() {
                    if (confirm(`确定要删除"${titleText}"输入框吗？`)) {
                        inputContainer.remove();
                    }
                });

                // 创建文本输入框
                const newInput = document.createElement('textarea');
                newInput.addEventListener('input', function() {
                    hasUnsavedChanges = true;
                });
                newInput.className = 'new-input';
                newInput.placeholder = '输入提示词...';
                newInput.style.backgroundColor = '#333';
                newInput.style.color = '#fff';
                if(titleText == '合并'){
                    newInput.className = 'merged-input';
                    // 设置为只读，不能手动编辑
                    newInput.readOnly = true;
                    newInput.style.color = '#8b8b8bff';
                    newInput.style.backgroundColor = '#2a2a2a';
                    newInput.style.cursor = 'default';
                    newInput.placeholder = '此输入框为只读，只能通过"合并文本"按钮更新内容';
                }
                newInput.style.display = 'block';
                newInput.style.width = '100%';
                newInput.style.height = '80px';
                newInput.style.minHeight = '50px';
                newInput.style.minWidth = '200px';
                newInput.style.border = '1px solid #555';
                newInput.style.padding = '8px';
                newInput.style.resize = 'none';
                newInput.style.boxSizing = 'border-box';
                newInput.style.borderRadius = '3px';

                // 创建拖拽手柄（右下角）
                const dragHandle = document.createElement('div');
                dragHandle.className = 'drag-handle';
                dragHandle.style.position = 'absolute';
                dragHandle.style.right = '5px';
                dragHandle.style.bottom = '5px';
                dragHandle.style.width = '15px';
                dragHandle.style.height = '15px';
                dragHandle.style.backgroundColor = '#666';
                dragHandle.style.border = '1px solid #888';
                dragHandle.style.cursor = 'nwse-resize';
                dragHandle.style.zIndex = '10';
                dragHandle.style.opacity = '0.7';
                dragHandle.style.borderRadius = '2px';

                // 鼠标悬停时显示手柄
                newInput.addEventListener('mouseenter', function() {
                    dragHandle.style.opacity = '1';
                });
                newInput.addEventListener('mouseleave', function() {
                    dragHandle.style.opacity = '0.7';
                });

                // 拖拽功能实现
                let isDragging = false;
                let startY, startHeight;

                dragHandle.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    isDragging = true;
                    startY = e.clientY;
                    startHeight = parseInt(getComputedStyle(newInput).height, 10);

                    // 添加全局鼠标事件监听
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                });

                function handleMouseMove(e) {
                    if (!isDragging) return;

                    const deltaY = e.clientY - startY;

                    // 计算新的宽度和高度
                    let newHeight = startHeight + deltaY;

                    // 应用最小尺寸限制
                    newHeight = Math.max(newHeight, 50);

                    // 更新输入框尺寸
                    newInput.style.height = newHeight + 'px';
                }

                function handleMouseUp() {
                    isDragging = false;
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                }

                // 组装元素
                inputContainer.appendChild(titleLabel);
                inputContainer.appendChild(moveUpButton);
                inputContainer.appendChild(moveDownButton);
                inputContainer.appendChild(deleteButton);
                inputContainer.appendChild(newInput);
                inputContainer.appendChild(dragHandle);

                return {
                    container: inputContainer,
                    input: newInput,
                    title: titleLabel,
                    moveUpButton: moveUpButton,
                    moveDownButton: moveDownButton,
                    deleteButton: deleteButton,
                    dragHandle: dragHandle
                };
            }

            // 按钮点击事件：添加新的输入框
            addButton.addEventListener('click', function() {
                const titleText = titleInput.value.trim() || '无标题';

                const resizableInput = createResizableInput(titleText);

                // 在输入框容器中插入新输入框
                inputsContainer.appendChild(resizableInput.container);

                // 清空标题输入框
                titleInput.value = '';
            });

            // "合并文本"按钮点击事件：收集所有新输入框文本，合并并设置到原输入框
            mergeButton.addEventListener('click', function() {
                const newInputs = document.querySelectorAll('.new-input');
                const mergedInput = document.querySelector('.merged-input');
                const texts = Array.from(newInputs).map(input => input.value.trim()).filter(text => text !== '');
                if (texts.length > 0) {
                    const mergedText = texts.join('\n').replace(/^\s*\/\/.*$/gm, '')
                    mergedInput.value = mergedText;
                    // copyToClipboard(mergedText);
                    mergedInput.dispatchEvent(new Event('input'));

                    // 将合并后的文本赋值给SD WebUI的原生提示词输入框
                    // 尝试多种选择器以确保能找到正确的输入框
                    const selectors = [
                        '#txt2img_prompt > label > textarea',
                        '#txt2img_prompt textarea',
                        '#txt2img_prompt_row textarea',
                        '#txt2img_prompt textarea[data-testid="textbox"]',
                        '#txt2img_prompt textarea[placeholder*="Prompt"]',
                        '#txt2img_prompt textarea[placeholder*="提示"]',
                        '#txt2img_prompt .prompt textarea',
                        '#txt2img_prompt .prompt-row textarea'
                    ];

                    let targetTextarea = null;
                    for (const selector of selectors) {
                        targetTextarea = document.querySelector(selector);
                        if (targetTextarea) {
                            console.log(`找到提示词输入框: ${selector}`);
                            break;
                        }
                    }

                    if (targetTextarea) {
                        targetTextarea.value = mergedText;
                        // 触发输入事件以确保UI更新
                        targetTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                        targetTextarea.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log('已成功将合并文本设置到SD WebUI提示词输入框');
                    } else {
                        console.warn('未找到SD WebUI提示词输入框，尝试的选择器:', selectors);
                        // 可以添加一个提示，但不要用alert干扰用户体验
                    }
                }
            });

            // 复制文本到剪贴板的函数
            function copyToClipboard(text) {
                // 方法1: 使用现代 Clipboard API
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text)
                        .then(() => {
                            // alert('文本已复制到剪贴板！');
                        })
                        .catch(err => {
                            console.error('复制失败:', err);
                            fallbackCopy(text);
                        });
                } else {
                    // 方法2: 使用传统方法作为备选
                    fallbackCopy(text);
                }
            }

            // 传统复制方法
            function fallbackCopy(text) {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        // alert('文本已复制到剪贴板！');
                    } else {
                        alert('复制失败，请手动复制');
                    }
                } catch (err) {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制');
                } finally {
                    document.body.removeChild(textArea);
                }
            }

            saveButton


            // "保存文本"按钮点击事件：保存所有文本框内容为JSON文件
            saveButton.addEventListener('click', function() {
                const containers = document.querySelectorAll('.resizable-input-container');
                const data = [];

                containers.forEach(container => {
                    const titleElement = container.querySelector('span');
                    const inputElement = container.querySelector('.new-input');

                    // 跳过合并输入框（标题为"合并"的输入框）
                    if (titleElement && inputElement && titleElement.textContent !== '合并') {
                        data.push({
                            title: titleElement.textContent,
                            content: inputElement.value
                        });
                    }
                });

                if (data.length === 0) {
                    alert('没有可保存的文本框内容！');
                    return;
                }

                const jsonData = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                // 使用自定义文件名或默认文件名
                const fileName = fileNameInput.value.trim() || `prompt_groups_${new Date().toISOString().slice(0, 10)}`;
                a.download = `${fileName}.json`;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                hasUnsavedChanges = false;

                // alert(`已保存 ${data.length} 个文本框内容到JSON文件！`);
            });

            // 在创建主容器后，添加拖拽功能
            // 在 mainContainer 创建后，添加以下代码：

            // 调整文本框高度的函数
            function adjustTextareaHeight(textInput) {
                // 重置高度为auto，以便计算正确的高度
                textInput.style.height = 'auto';
                // 设置高度为滚动高度（内容实际高度）
                textInput.style.height = textInput.scrollHeight + 'px';
            }

            // 添加拖拽功能
            mainContainer.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
                mainContainer.style.border = '2px dashed #4CAF50';
                mainContainer.style.backgroundColor = '#2d2d2d';
            });

            mainContainer.addEventListener('dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
                mainContainer.style.border = '1px solid #444';
                mainContainer.style.backgroundColor = '#2a2a2a';
            });

            mainContainer.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // 恢复容器样式
                mainContainer.style.border = '1px solid #444';
                mainContainer.style.backgroundColor = '#2a2a2a';

                // 获取拖拽的文件
                const files = e.dataTransfer.files;
                if (files.length === 0) return;

                const file = files[0];
                const fileName = file.name;

                // 检查文件类型
                if (!fileName.toLowerCase().endsWith('.json')) {
                    alert('请拖拽JSON文件！');
                    return;
                }

                // 使用现有的读取文件逻辑
                const reader = new FileReader();
                reader.onload = loadFile;

                reader.readAsText(file);
            });

            function loadFile(event,fileName) {
                try {
                    const data = JSON.parse(event.target.result);

                    if (!Array.isArray(data)) {
                        throw new Error('JSON格式不正确，应为数组格式');
                    }

                    // 清空现有文本框（除了合并输入框）
                    const containers = document.querySelectorAll('.resizable-input-container');
                    containers.forEach(container => {
                        const titleElement = container.querySelector('span');
                        if (titleElement && titleElement.textContent !== '合并') {
                            container.remove();
                        }
                    });

                    // 创建新的文本框
                    data.forEach(item => {
                        if (item.title && item.content !== undefined) {
                            const resizableInput = createResizableInput(item.title);
                            resizableInput.input.value = item.content;
                            inputsContainer.appendChild(resizableInput.container);
                            adjustTextareaHeight(resizableInput.input);
                        }
                    });

                    fileNameInput.value = fileName.replace('.json', '');
                    // alert(`已成功加载 ${data.length} 个文本框！`);
                } catch (error) {
                    alert('读取文件失败：' + error.message);
                }
            };

            // // 添加拖拽提示文本
            // const dragHint = document.createElement('div');
            // dragHint.textContent = '拖拽JSON文件到此处可快速加载';
            // dragHint.style.fontSize = '12px';
            // dragHint.style.color = '#888';
            // dragHint.style.marginTop = '5px';
            // dragHint.style.textAlign = 'center';
            // dragHint.style.padding = '5px';
            // dragHint.style.borderTop = '1px solid #444';

            // // 将拖拽提示添加到主容器
            // mainContainer.appendChild(dragHint);

            // "读取文本"按钮点击事件：从JSON文件读取并还原文本框
            loadButton.addEventListener('click', function() {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.json';
                fileInput.style.display = 'none';

                fileInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    const fileName = file.name;
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        loadFile(event, fileName);
                    };

                    reader.readAsText(file);
                });

                document.body.appendChild(fileInput);
                fileInput.click();
                document.body.removeChild(fileInput);
            });

            // 页面加载后自动添加默认输入框
            setTimeout(() => {
                defaultTitles.forEach(title => {
                    const resizableInput = createResizableInput(title);
                    inputsContainer.appendChild(resizableInput.container);
                });
            }, 1000);

            // 添加后可停止观察，或继续监视
            observer.disconnect();
        }
    });

    // 开始观察body下的子节点变化
    observer.observe(document.body, { childList: true, subtree: true });
})();
