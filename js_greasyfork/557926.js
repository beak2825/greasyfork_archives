// ==UserScript==
// @name         Grok Prompt Manager
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  自定义Grok常用prompts管理工具
// @author       chibimiku@TSDM.net
// @match        https://grok.com/
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/557926/Grok%20Prompt%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/557926/Grok%20Prompt%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // 默认的prompts数据
    const DEFAULT_PROMPTS = [
        { title: "代码解释", content: "请详细解释以下代码的功能、逻辑和可能的优化点：" },
        { title: "技术文档", content: "请根据以下内容撰写一份技术文档，包含概述、功能说明和使用示例：" },
        { title: "问题分析", content: "请分析以下问题，提供根本原因和解决方案：" },
        { title: "图片标注", content: "用英文尽可能详细地描述这张图片，包括但不限于艺术风格，构图、人物和人物之间的关系、动作，人物的发色、眼睛颜色。如果原图中存在，则进行描述：衣装（上装与下装，或连衣裙），衣装上的绘画图案、鞋子、袜子的类型和颜色，装饰品，环境，以及光照、角度，不要使用模棱两可的语言，不要描述图片里出现的文字。最多300词。如果这张图片的艺术风格是照片(photo)，请改为插画(illustration)，并变更其他领域的描述。描述女性角色用girl。给它起一个有诗意的使用复杂汉字的日文标题，不超过20个字，再翻译成中文。还要输出12个日文标签，能够准确描述画面内容，这些标签适用于画图网站pixiv的标签，如 女の子 ，用于投稿时进行标注分类，标签至少要包括描述图片中的人物发色、眼睛颜色、衣着、鞋袜、表情，背景。输出若存在'lolita'字样则更换为'rococo'，也不要输出'cleavage'、'nude'之类性相关的词。注意输出英文描述而不是画图。"}
    ];

    class PromptManager {
        constructor() {
            this.prompts = [];
            this.currentPrompt = null;
            this.init();
        }

        // 初始化管理器
        init() {
            this.loadPrompts();
            this.waitForInputElement().then(() => {
                this.createUI();
                this.bindEvents();
            });
            console.log("Grok Prompt Manager inited.");
        }

        // 等待输入元素加载完成（改为p标签）
        waitForInputElement() {
            return new Promise((resolve) => {
                const checkInput = () => {
                    this.inputElement = document.querySelector('p[data-placeholder="What do you want to know?"]');
                    if (this.inputElement) {
                        resolve();
                    } else {
                        setTimeout(checkInput, 500);
                    }
                };
                checkInput();
            });
        }

        // 从存储中加载prompts
        loadPrompts() {
            const savedPrompts = GM_getValue('grok_prompts');
            if (savedPrompts && savedPrompts.length > 0) {
                this.prompts = savedPrompts;
            } else {
                this.prompts = DEFAULT_PROMPTS;
                this.savePrompts();
            }
        }

        // 保存prompts到存储
        savePrompts() {
            GM_setValue('grok_prompts', this.prompts);
        }

        // 添加黑夜模式样式
        addDarkModeStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .grok-prompt-container {
                    position: fixed;
                    bottom: 120px;
                    right: -150px;
                    transform: translateX(-50%);
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    z-index: 10000;
                    min-width: 300px;
                    max-width: 500px;
                    transition: all 0.3s ease;
                }

                .grok-prompt-container label {
                    font-weight: bold;
                    margin-right: 10px;
                    color: #333;
                }

                .grok-prompt-select {
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    width: 200px;
                    background: white;
                    color: #333;
                }

                .grok-prompt-button {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                    font-size: 12px;
                    transition: opacity 0.2s ease;
                }

                .grok-prompt-button:hover {
                    opacity: 0.9;
                }

                .grok-prompt-button-blue { background-color: #007bff; }
                .grok-prompt-button-green { background-color: #28a745; }
                .grok-prompt-button-orange { background-color: #ffc107; color: #333; }
                .grok-prompt-button-red { background-color: #dc3545; }
                .grok-prompt-button-gray { background-color: #6c757d; }

                .grok-button-container {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .grok-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10001;
                }

                .grok-modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 400px;
                    max-width: 90%;
                }

                .grok-modal-content h3 {
                    margin-top: 0;
                    color: #333;
                }

                .grok-modal-input {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                    background: white;
                    color: #333;
                }

                .grok-modal-textarea {
                    width: 100%;
                    height: 150px;
                    padding: 8px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                    resize: vertical;
                    background: white;
                    color: #333;
                }

                .grok-modal-buttons {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }

                /* 黑夜模式样式 */
                @media (prefers-color-scheme: dark) {
                    .grok-prompt-container {
                        background: #1e1e1e;
                        border-color: #444;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    }

                    .grok-prompt-container label {
                        color: #e0e0e0;
                    }

                    .grok-prompt-select {
                        background: #2d2d2d;
                        border-color: #555;
                        color: #e0e0e0;
                    }

                    .grok-modal-content {
                        background: #1e1e1e;
                        border: 1px solid #444;
                    }

                    .grok-modal-content h3 {
                        color: #e0e0e0;
                    }

                    .grok-modal-input,
                    .grok-modal-textarea {
                        background: #2d2d2d;
                        border-color: #555;
                        color: #e0e0e0;
                    }

                    .grok-modal-input::placeholder,
                    .grok-modal-textarea::placeholder {
                        color: #888;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // 创建用户界面
        createUI() {
            // 先添加样式
            this.addDarkModeStyles();

            // 创建主容器
            this.container = document.createElement('div');
            this.container.className = 'grok-prompt-container';

            // 创建下拉选择框
            this.createSelectBox();

            // 创建按钮容器
            this.createButtonGroup();

            document.body.appendChild(this.container);
            console.log("createUI done");
        }

        // 创建下拉选择框
        createSelectBox() {
            const selectContainer = document.createElement('div');
            selectContainer.style.marginBottom = '10px';

            const label = document.createElement('label');
            label.textContent = '常用Prompts: ';

            this.select = document.createElement('select');
            this.select.className = 'grok-prompt-select';

            // 添加选项
            this.updateSelectOptions();

            selectContainer.appendChild(label);
            selectContainer.appendChild(this.select);
            this.container.appendChild(selectContainer);
        }

        // 更新下拉选项
        updateSelectOptions() {
            this.select.innerHTML = '';

            // 添加默认选项
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- 选择或新建Prompt --';
            this.select.appendChild(defaultOption);

            // 添加所有prompts选项
            this.prompts.forEach((prompt, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = prompt.title;
                this.select.appendChild(option);
            });
        }

        // 创建按钮组
        createButtonGroup() {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'grok-button-container';

            // 应用按钮
            this.applyBtn = this.createButton('应用', 'blue', () => this.applyPrompt());

            // 新建按钮
            this.newBtn = this.createButton('新建', 'green', () => this.showEditModal());

            // 编辑按钮
            this.editBtn = this.createButton('编辑', 'orange', () => this.editPrompt());

            // 删除按钮
            this.deleteBtn = this.createButton('删除', 'red', () => this.deletePrompt());

            buttonContainer.appendChild(this.applyBtn);
            buttonContainer.appendChild(this.newBtn);
            buttonContainer.appendChild(this.editBtn);
            buttonContainer.appendChild(this.deleteBtn);

            this.container.appendChild(buttonContainer);
        }

        // 创建按钮的辅助方法
        createButton(text, color, onClick) {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = `grok-prompt-button grok-prompt-button-${color}`;
            button.addEventListener('click', onClick);
            return button;
        }

        // 绑定事件
        bindEvents() {
            this.select.addEventListener('change', (e) => {
                const index = e.target.value;
                if (index !== '') {
                    this.currentPrompt = this.prompts[index];
                } else {
                    this.currentPrompt = null;
                }
            });
        }

        // 应用选中的prompt
        applyPrompt() {
            if (!this.currentPrompt) {
                alert('请先选择一个prompt');
                return;
            }

            if (this.inputElement) {
                console.log("Set Prompt:" + this.currentPrompt.content);

                // 修改p标签的内容而不是value
                let xxEl = document.querySelector('p[data-placeholder="What do you want to know?"]');
                xxEl.textContent = this.currentPrompt.content;
                xxEl.focus();

                // 触发input事件以确保Grok能检测到内容变化
                const event = new Event('input', { bubbles: true });
                xxEl.dispatchEvent(event);

                // 同时触发其他可能的事件
                const changeEvent = new Event('change', { bubbles: true });
                xxEl.dispatchEvent(changeEvent);
            } else {
                console.log("ERR: input element Not found");
            }

        }

        // 显示编辑模态框
        showEditModal(prompt = null) {
            const isEdit = !!prompt;
            const modal = document.createElement('div');
            modal.className = 'grok-modal-overlay';

            const modalContent = document.createElement('div');
            modalContent.className = 'grok-modal-content';

            const title = document.createElement('h3');
            title.textContent = isEdit ? '编辑Prompt' : '新建Prompt';

            const form = document.createElement('div');

            // 标题输入
            const titleLabel = document.createElement('label');
            titleLabel.textContent = '标题:';
            titleLabel.style.display = 'block';
            titleLabel.style.marginBottom = '5px';

            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.className = 'grok-modal-input';
            titleInput.placeholder = '输入prompt标题';
            titleInput.value = isEdit ? prompt.title : '';

            // 内容输入
            const contentLabel = document.createElement('label');
            contentLabel.textContent = '内容:';
            contentLabel.style.display = 'block';
            contentLabel.style.marginBottom = '5px';

            const contentInput = document.createElement('textarea');
            contentInput.className = 'grok-modal-textarea';
            contentInput.placeholder = '输入prompt内容';
            contentInput.value = isEdit ? prompt.content : '';

            // 按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'grok-modal-buttons';

            const saveBtn = this.createButton('保存', 'green', () => {
                const newTitle = titleInput.value.trim();
                const newContent = contentInput.value.trim();

                if (!newTitle || !newContent) {
                    alert('标题和内容都不能为空');
                    return;
                }

                if (isEdit) {
                    // 更新现有prompt
                    prompt.title = newTitle;
                    prompt.content = newContent;
                } else {
                    // 添加新prompt
                    this.prompts.push({
                        title: newTitle,
                        content: newContent
                    });
                }

                this.savePrompts();
                this.updateSelectOptions();
                document.body.removeChild(modal);
            });

            const cancelBtn = this.createButton('取消', 'gray', () => {
                document.body.removeChild(modal);
            });

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(saveBtn);

            // 组装表单
            form.appendChild(titleLabel);
            form.appendChild(titleInput);
            form.appendChild(contentLabel);
            form.appendChild(contentInput);
            form.appendChild(buttonContainer);

            modalContent.appendChild(title);
            modalContent.appendChild(form);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // 点击模态框背景关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });

            titleInput.focus();
        }

        // 编辑当前选中的prompt
        editPrompt() {
            if (!this.currentPrompt) {
                alert('请先选择一个要编辑的prompt');
                return;
            }
            this.showEditModal(this.currentPrompt);
        }

        // 删除当前选中的prompt
        deletePrompt() {
            if (!this.currentPrompt) {
                alert('请先选择一个要删除的prompt');
                return;
            }

            if (confirm(`确定要删除 "${this.currentPrompt.title}" 吗？`)) {
                const index = this.prompts.findIndex(p => p === this.currentPrompt);
                if (index !== -1) {
                    this.prompts.splice(index, 1);
                    this.savePrompts();
                    this.updateSelectOptions();
                    this.currentPrompt = null;
                    this.select.value = '';
                }
            }
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new PromptManager();
        });
    } else {
        new PromptManager();
    }
})();