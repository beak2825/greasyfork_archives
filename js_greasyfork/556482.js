/**
 * 脚本逻辑概述：
 * 1. 定义常量与模板：包含样式、下拉框配置、DOM 选择器等基础参数。
 * 2. 初始化自定义提示下拉框与暗色模式样式，使 UI 贴合 ChatGPT 页面。
 * 3. 定时检查输入框容器，准备就绪后插入自定义提示下拉框并绑定事件。
 * 4. 选择自定义提示时将内容写入 ChatGPT 输入区域并自适应高度。
 * 5. 提供添加 / 删除自定义提示功能，通过 GM_setValue 与 GM_getValue 持久化存储，并同步更新下拉框选项。
 */
// ==UserScript==
// @name         🤖ChatGPT - Prompt提示选择器精简版
// @namespace    https://greasyfork.org/
// @version      1.0.9
// @description  一个帮助用户在ChatGPT原生网页快速填写自定义提示"Prompt"的脚本。
// @author       OpenAI - ChatGPT
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.4.min.js
// @match        https://chat.openai.com/
// @match        https://chat.openai.com/c/*
// @match        https://chat.openai.com/?*
// @match        https://chatgpt.com/*
// @match        https://chatgpt.com/
// @match        https://chat.github-free.com/
// @match        https://chat.github-free.com/c/*
// @match        https://chat.github-free.com/?*
// @match        https://chat.zhile.io/
// @match        https://chat.zhile.io/c/*
// @match        https://chat.zhile.io/?*

// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3

// @downloadURL https://update.greasyfork.org/scripts/556482/%F0%9F%A4%96ChatGPT%20-%20Prompt%E6%8F%90%E7%A4%BA%E9%80%89%E6%8B%A9%E5%99%A8%E7%B2%BE%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556482/%F0%9F%A4%96ChatGPT%20-%20Prompt%E6%8F%90%E7%A4%BA%E9%80%89%E6%8B%A9%E5%99%A8%E7%B2%BE%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const $ = window.jQuery;
    const DARK_MODE_STYLE = `
    .dark-mode-compatible {
      background-color: white;
      color: black;
    }
    .dark .dark-mode-compatible {
      background-color: #343540;
      color: white;
    }

    select {
      font-size: 16px;
      border-radius: 4px;
    }

    select option {
      font-size: 16px;
      padding: 8px;
    }

  `;

    const CUSTOM_PROMPT_DROPDOWN_ID = "customPromptDropdown";
    const CUSTOM_PROMPT_DROPDOWN_PLACEHOLDER = "[自定义提示]";
    const CUSTOM_PROMPT_DROPDOWN_WIDTH = 180;
    const DEFAULT_ENTRY_HEIGHT = 20;

    const CHECK_MARKUP_INTERVAL = 500;
    const ENTRY_HEIGHT_RESET_DELAY = 500;

    const CONTAINER_SELECTOR = "div.absolute.bottom-full"; /*在chatgpt聊天框的上面一行*/
    const ENTRY_SELECTOR = "#prompt-textarea > p";

    const OPTION_TAG_TEMPLATE =
        '<option value="{{value}}" title="{{titleMark}}">{{title}}</option>';

    const NEW_LINE = "\r\n";

    let customUIInjected = false;
    let checkTimerId = null;

    function placeholder(name) {
        return "{{" + name + "}}";
    }

    function getCustomPromptDropdown() {
        return $("#" + CUSTOM_PROMPT_DROPDOWN_ID);
    }

    function handleCustomPromptChange() {
        const customPrompt = $(this).val();
        const entry = $(ENTRY_SELECTOR);
        const button = entry.next();

        entry.text(customPrompt);

        // 计算所选自定义提示的高度，并将其应用于输入框
        const parts = customPrompt.split(NEW_LINE);
        const heightInPixels = DEFAULT_ENTRY_HEIGHT * parts.length + 1;
        entry.height(heightInPixels);

        button.prop("disabled", false);
        button.click(() => {
            setTimeout(() => {
                entry.height(DEFAULT_ENTRY_HEIGHT);
            }, ENTRY_HEIGHT_RESET_DELAY);
        });
    }

    function activateCheckTimer() {
        if (checkTimerId !== null) return;
        checkTimerId = setInterval(checkMarkup, CHECK_MARKUP_INTERVAL);
    }

    function getContainer() {
        return $(CONTAINER_SELECTOR);
    }

    /**
     * 定期检查聊天输入容器：
     * - 若已插入自定义提示 UI 或视口过窄则跳过；
     * - 否则在聊天框上方注入自定义提示下拉框并绑定交互按钮。
     */
    function checkMarkup() {
        if (customUIInjected) return;

        const container = getContainer();

        if (container.length === 0) return;
        if (window.innerWidth <= 480) return;

        const customPromptDropdown = createCustomPromptDropdown();
        customPromptDropdown.change(handleCustomPromptChange);
        addCustomPromptButton();

        customUIInjected = true;

        if (checkTimerId !== null) {
            clearInterval(checkTimerId);
            checkTimerId = null;
        }
    }

    // 添加自定义提示：收集用户输入并立即刷新下拉框
    function addCustomPrompt() {
        // 弹出输入框让用户填写标题
        const title = prompt("请输入提示的标题：");
        // 未填写标题则直接返回
        if (!title) return;
        // 读取已有自定义提示列表
        const customPrompts = JSON.parse(GM_getValue("customPrompts", "[]"));
        // 检查标题是否重复，若重复提示用户
        if (customPrompts.find((item) => item.title === title)) {
            // 标题已存在时弹窗提示
            alert("该标题已经存在，请输入一个新的标题。");
            // 阻止继续添加
            return;
        }

        // 收集用户输入的提示内容
        const content = prompt("请输入提示的内容：");
        // 未输入内容则中止
        if (!content) return;

        // 将新提示对象追加到数组中
        customPrompts.push({
            title,
            mark: content
        });
        // 持久化存储最新的自定义提示列表
        GM_setValue("customPrompts", JSON.stringify(customPrompts));

        // 获取自定义提示下拉框
        const customPromptDropdown = getCustomPromptDropdown();
        // 构造 option 字符串并插入下拉框
        customPromptDropdown.append(
            OPTION_TAG_TEMPLATE.replace(placeholder("value"), content)
            .replace(placeholder("title"), title)
            .replace(placeholder("titleMark"), content)
        );
        // 设置当前下拉框选中新添加的提示
        customPromptDropdown.val(content);
        // 触发 change 以复用既有逻辑
        customPromptDropdown.trigger("change");
        // 确保下拉框可见
        customPromptDropdown.show();
    }

    function removeCustomPrompt(mark) {
        let customPrompts = JSON.parse(GM_getValue("customPrompts", "[]"));
        customPrompts = customPrompts.filter((item) => item.mark !== mark);
        GM_setValue("customPrompts", JSON.stringify(customPrompts));
    }

    function addCustomPromptButton() {
        let addButton, removeButton;

        const container = getContainer();
        addButton = $(
            '<button class="dark-mode-compatible btn relative btn-neutral border-0 md:border" type="button">添加</button>'
        );
        addButton.click(addCustomPrompt);
        removeButton = $(
            '<button class="dark-mode-compatible btn relative btn-neutral border-0 md:border" type="button">删除</button>'
        );
        removeButton.click(() => {
            const customPromptDropdown = getCustomPromptDropdown();
            const mark = customPromptDropdown.val();
            if (!mark) return;
            customPromptDropdown.find(`option[value="${mark}"]`).remove();
            removeCustomPrompt(mark);
            if (customPromptDropdown.children().length <= 1) {
                customPromptDropdown.hide();
                removeButton.hide();
                addButton.show(); // 显示添加按钮
            }

            // 清空输入框
            const entry = $(ENTRY_SELECTOR);
            entry.text("");
            entry.height(DEFAULT_ENTRY_HEIGHT);
        });
        removeButton.hide();
        getCustomPromptDropdown().after(removeButton);
        getCustomPromptDropdown().after(addButton);

        const customPromptDropdown = getCustomPromptDropdown();
        if (customPromptDropdown.children().length <= 1) {
            removeButton.hide();
            addButton.show(); // 显示添加按钮
        }

        // 根据是否选中提示切换按钮显隐，并实时同步输入框内容
        customPromptDropdown.on("change", () => {
            if (customPromptDropdown.val()) {
                removeButton.show();
                addButton.hide(); // 隐藏添加按钮
            } else {
                removeButton.hide();
                addButton.show(); // 显示添加按钮
            }
            const selectedPrompt = $("#customPromptDropdown").val();
            if (selectedPrompt) {
                const entry = $(ENTRY_SELECTOR);
                entry.text(selectedPrompt);
            }
        });
    }




    function createCustomPromptDropdown() {
        debugger
        console.log("createCustomPromptDropdown");
        // 方便调试下拉框是否成功挂载
        const container = getContainer();
        const customPrompts = JSON.parse(GM_getValue("customPrompts", "[]"));
        const customPromptDropdown = $(
            `<select id="${CUSTOM_PROMPT_DROPDOWN_ID}" class="dark-mode-compatible" style="width: ${CUSTOM_PROMPT_DROPDOWN_WIDTH}px"></select>`
        );

        customPromptDropdown.append(
            `<option value="">${CUSTOM_PROMPT_DROPDOWN_PLACEHOLDER}</option>`
        );

        for (const customPrompt of customPrompts) {
            customPromptDropdown.append(
                `<option value="${customPrompt.mark}" title="${customPrompt.mark}">${customPrompt.title}</option>`
            );
        }

        if (customPrompts.length === 0) {
            customPromptDropdown.hide();
        } else {
            customPromptDropdown.show();
        }

        container.append(customPromptDropdown);

        return customPromptDropdown;
    }

    function addDarkModeStyles() {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = DARK_MODE_STYLE;
        document.head.appendChild(styleTag);
    }

    // 初始化流程：
    // 1. 注入暗色模式样式，确保按钮与下拉框在不同主题下可读；
    // 2. 启动定时检测，一旦聊天输入容器准备好便注入自定义提示 UI。
    function init() {
        addDarkModeStyles();
        activateCheckTimer();
        checkMarkup();
    }

    // 延迟 5 秒执行初始化，确保 ChatGPT DOM 结构稳定后再挂载 UI
    setTimeout(() => {
        init();
    }, 5000);
})();
