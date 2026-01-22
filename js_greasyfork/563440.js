// ==UserScript==
// @name         Google AI Studio | 优化工具 - Dae
// @name:zh-CN   Google AI Studio | 优化工具 - Dae
// @name:en      Google AI Studio | Enhancement tool - Dae
// @namespace    https://space.bilibili.com/261168982
// @version      1.0.4
// @description  Google AI Studio 增强插件。集成一键清空聊天、自动选择提示词、长文本转文件、滚动导航及引用文本等人性化功能。
// @description:en  Enhancement tool for Google AI Studio. Features one-click chat clearing, auto-applying system instructions, long text-to-file conversion, scroll navigation, and selection quotes. Fully customizable via a gear-icon settings panel.
// @author       Dae & Gemini
// @license      MIT
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563440/Google%20AI%20Studio%20%7C%20%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7%20-%20Dae.user.js
// @updateURL https://update.greasyfork.org/scripts/563440/Google%20AI%20Studio%20%7C%20%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7%20-%20Dae.meta.js
// ==/UserScript==

(function() {
'use strict';
    // 全局状态：存储当前挂起的引用
    let pendingQuoteState = null;
    // 定义一个全局变量，用于在外部触发滚动按钮重新定位
    let updateScrollNavLayout = null;
    
    // 菜单 ID 存储数组
    let registeredMenuIds = []; 

    // 改为 let，允许运行时修改
    let CURRENT_LANG = GM_getValue('language', 'zh'); 

    // --- 全局实时配置对象 ---
    const activeSettings = {
        // === 1. 界面与视觉 (UI & Visual) ===
        chatFontSize: GM_getValue('chatFontSize', 14), // 聊天气泡字体大小 (px)
        enableMarkdownEnhancement: GM_getValue('enableMarkdownEnhancement', false), // Markdown 基础排版与行间距优化

        enableUserColorDifference: GM_getValue('enableUserColorDifference', false), // 为用户增加底色 (蓝色风格)
        // 用户底色
        userBgColorLight: GM_getValue('userBgColorLight', 'rgba(0, 120, 212, 0.15)'),
        userBgColorDark: GM_getValue('userBgColorDark', 'rgba(0, 120, 212, 0.15)'),

        enableModelColorDifference: GM_getValue('enableModelColorDifference', false), // 为模型增加底色 (绿色风格)
        // 模型底色
        modelBgColorLight: GM_getValue('modelBgColorLight', 'rgba(0, 168, 107, 0.15)'),
        modelBgColorDark: GM_getValue('modelBgColorDark', 'rgba(0, 168, 107, 0.15)'),

        enableBoldSpacingFix: GM_getValue('enableBoldSpacingFix', true), // 粗体“空格隔离法则”与标点修复
        hideFeedbackButtons: GM_getValue('hideFeedbackButtons', false), // 隐藏评价手势
        hideDisclaimer: GM_getValue('hideDisclaimer', false), // 隐藏底部的“生成内容可能不准确”声明
        hideApiKeyInput: GM_getValue('hideApiKeyInput', false), // 隐藏输入框左侧的 API 推广按钮
        hideApiKeySettings: GM_getValue('hideApiKeySettings', false), // 隐藏运行设置中的 API 推广卡片
        
        // === 主题设置===
        // 不再存储单一的 themeSelection，而是分别存储 Light 和 Dark 偏好
        themePreferenceLight: GM_getValue('themePreferenceLight', 'default'),
        themePreferenceDark:  GM_getValue('themePreferenceDark', 'default'),

        // === 2. 增强功能 (Enhancements) ===
        // 自动配置系统指令
        autoSystemInstructionName: GM_getValue('autoSystemInstructionName', '__DISABLED__'),
    
        // 2. 存储抓取到的指令列表 (默认空数组)
        savedSystemInstructions: GM_getValue('savedSystemInstructions', []),
        enableQuote: GM_getValue('enableQuote', true), 
        enableAutoFilePaste: GM_getValue('enableAutoFilePaste', true), // 超长文本粘贴自动转 .txt 文件
        enableCodePaste: GM_getValue('enableCodePaste', true), // Alt+V 智能代码块包裹粘贴
        enableDeleteAssociated: GM_getValue('enableDeleteAssociated', true), // 红色“删除关联回合”按钮功能
        enableSearchSuffix: GM_getValue('enableSearchSuffix', false), // 发送时自动追加联网搜索声明后缀
        showSearchSuffixBtn: GM_getValue('showSearchSuffixBtn', true), // 在 Google 搜索工具旁显示切换按钮

        // === 3. 导航与快捷操作 (Nav & Shortcuts) ===
        enableClearBtn: GM_getValue('enableClearBtn', true), // 顶部工具栏“清空聊天”按钮
        enableScrollNav: GM_getValue('enableScrollNav', true), // 页面右侧/居中的快速翻页导航按钮
        scrollNavCentered: GM_getValue('scrollNavCentered', false), // 导航按钮位置由右侧切换为居中
        enableFreezeShortcut: GM_getValue('enableFreezeShortcut', true), // Alt+F8 页面断点冻结快捷键

        // 默认主题下的自定义背景色
        // 浅色默认: #ffffff (即 rgb(252, 252, 252))
        customLightBg: GM_getValue('customLightBg', 'rgb(255, 255, 255)'), 
        // 深色默认: #141313
        customDarkBg: GM_getValue('customDarkBg', '#141313'),
    };

    // --- 国际化 (i18n) 配置表 ---
    // 格式: key: [ '中文', 'English' ]
    // 这样排列可以直观地对照修改双语，无需在两个大对象间来回翻阅。
    const I18N_DEFS = {
        // === 面板基础 (Panel Base) ===
        settings_title:             ['Dae 优化工具设置', 'Dae Enhancement Settings'],
        settings_tooltip:           ['Dae优化工具设置', 'Dae Tool Settings'],
        settings_save:              ['保存并关闭', 'Save & Close'],
        settings_cancel:            ['取消', 'Cancel'],

        // === 分组标题 (Group Headers) ===
        settings_group_ui:          ['界面相关', 'UI Related'],
        settings_group_func:        ['功能增强', 'Enhancements'],
        settings_group_nav:         ['经典功能', 'Classic Features'],

        // === 1. 界面选项 (UI Options) ===
        lbl_font_size:              ['聊天字体大小', 'Chat Font Size'],
        tip_reset:                  ['恢复默认', 'Reset to Default'],

        lbl_md_enhance:             ['Markdown & 阅读体验优化', 'Markdown & Reading Optimization'],
        tip_md_enhance:             ['优化行间距、字重、分割线，并使用编程专用字体渲染代码块。', 'Optimize spacing, font weight, and use monospaced fonts for code blocks.'],

        lbl_user_color:             ['为用户增加底色', 'Add Background for User'],
        lbl_model_color:            ['为模型增加底色', 'Add Background for Model'],

        lbl_bold_fix:               ['修复粗体Markdown', 'Fix Bold Markdown'],
        tip_bold_fix:               ['在视觉上修复“**”粗体Markdown与引号等符号连用时的粗体失效问题。', 'Visually fix bold failure when "**" bold Markdown is used with quotation marks and other symbols.'],

        lbl_hide_feedback:          ['隐藏点赞/点踩按钮', 'Hide Feedback Buttons'],
        lbl_disclaimer:             ['隐藏底部的免责声明', 'Hide Hallucination Disclaimer'],

        lbl_hide_api_key_input:     ['隐藏输入框底部 API 按钮', 'Hide API Button (Input)'],
        lbl_hide_api_key_settings:  ['隐藏设置面板中 API 卡片', 'Hide API Card (Sidebar)'],
        
        // === 主题相关 ===
        lbl_theme_select:           ['界面主题选择', 'Interface Theme'],
        tip_theme_select:           ['当前模式下的配色方案。\n支持“滚轮切换”，自动记忆深/浅色模式偏好。', 'Color scheme for current mode.\nSupports "Scroll Switch", remembers preference for Dark/Light mode.'],
        
        theme_default:              ['默认（Google）', 'Default (Google)'],
        theme_warm:                 ['暖黄护眼', 'Warm Yellow (Light)'],
        
        // 键名从 theme_mint 改为 theme_mintLight，以匹配逻辑
        theme_mintLight:            ['薄荷清爽', 'Mint Light (Light)'],
        
        // 更加信达雅的深色主题汉化
        theme_atom:                 ['Atom 极客紫', 'Atom One Dark (Dark)'],
        theme_monokai:              ['Monokai 经典', 'Monokai (Dark)'],
        theme_dracula:              ['Dracula 吸血鬼', 'Dracula (Dark)'],

        // === 2. 功能选项 (Enhancements) ===
        val_disabled:               ['[未启用]', '[Disabled]'],
        
        // 下拉菜单里的“关闭”选项
        val_off:                    ['关闭', 'Off'],
        val_empty_list:             ['列表为空，请创建一个系统指令\n(初次请手动打开一次提示词面板以读取)', 'List empty, please create an instruction\n(Please manually dropdown the instruction list once to load it on first use.)'],
        lbl_auto_instruction_mode:  ['自动应用系统指令', 'Auto-Apply System Instruction'],        tip_auto_instruction_mode:  ['选择在新建聊天时自动应用的指令。', 'Select the instruction to auto-apply.'],

        lbl_quote:                  ['启用“划词引用”功能', 'Enable Text Selection Quote'],
        tip_quote:                  ['选中文本后显示“引用”浮窗，点击可将内容及作者格式化后插入输入框。', 'Show a floating button upon text selection to insert formatted quotes.'],

        lbl_file_paste:             ['启用大文本自动转文件', 'Auto File Paste'],
        tip_file_paste:             ['粘贴超长文本(>1.5万字符)时自动转为文件。支持选中文字后按 Ctrl+B 手动转换。', 'Convert long text (>15k chars) to files. Use Ctrl+B to convert selected text manually.'],

        lbl_code_paste:             ['启用智能代码粘贴', 'Smart Code Paste'],
        tip_code_paste:             ['快捷键 Alt+V：无选中时粘贴剪贴板并包裹代码块；有选中时直接包裹选区。', 'Alt+V: Paste as code block or wrap current selection.'],

        lbl_show_suffix_btn:        ['显示“搜索后缀”切换按钮', 'Show Search Suffix Toggle'],
        tip_search_suffix:          ['在 Google 搜索工具旁添加按钮，发送时自动追加“结合联网搜索”声明。', 'Adds a button next to Google Search to append a "(Combined with web search)" suffix.'],

        lbl_delete_associated:      ['启用“进阶删除”功能', 'Enable Advanced Delete'],
        tip_delete_associated:      ['在消息菜单中增加红色高级删除按钮：\n 删除本组：删除当前问答对。\n 删除及下方：删除当前位置及之后的所有对话。', 'Add advanced delete buttons in menu:\n Delete Group: Delete current pair.\n Delete & Below: Delete current and all following turns.'],
        
        // 按钮文本
        btn_delete_group:           ['删除本组对话', 'Delete This Group'],
        btn_delete_below:           ['删除及下方所有', 'Delete & Below'],

        // === 3. 导航选项 (Navigation) ===
        lbl_clear_btn:              ['启用“清空聊天”按钮', 'Enable Clear Chat Button'],
        lbl_scroll_nav:             ['滚动导航按钮', 'Enable Scroll Navigation'],
        tip_scroll_nav:             ['在长对话中显示“回到顶部/底部”的悬浮按钮。', 'Show floating buttons to jump to top or bottom in long chats.'],
        lbl_scroll_center:          ['按钮位置改为居中', 'Center Navigation Buttons'],

        // === 4. 交互与弹窗 (Interaction & Dialogs) ===
        btn_suffix:                 ['尾部追加', 'Suffix'],
        clear_tooltip:              ['清空聊天', 'Clear chat'],
        quote_btn_text:             ['引用', 'Quote'],
        quote_card_label:           ['已引用内容', 'Quoted content'],
        quote_card_author_user:     ['用户', 'User'],
        quote_author_context:       ['上下文', 'Context'],
        quote_inject_header:        ['引用：', 'Quote:'],

        confirm_title:              ['确认清空所有对话？', 'Clear all conversations?'],
        confirm_hint:               ['这将清除当前聊天中的所有对话内容。', 'This will remove all message history in the current chat.'],
        confirm_btn_cancel:         ['取消', 'Cancel'],
        confirm_btn_confirm:        ['确认', 'Confirm'],

        // === 调色板 (Color Palette) ===
        palette_light_mode:         ['浅色模式', 'Light Mode'],
        palette_dark_mode:          ['深色模式', 'Dark Mode'],
        palette_light_mode2:         ['浅色模式', 'Light'],
        palette_dark_mode2:          ['深色模式', 'Dark'],
        palette_alpha:              ['透明度', 'Opacity'],
        palette_reset:              ['恢复默认', 'Reset'],
        palette_confirm:            ['确认', 'Confirm'],
        palette_color:              ['颜色', 'Color'],
        palette_main_color:         ['主背景色', 'Main Background'],
        palette_user_bg:            ['用户底色', 'User Background'],
        palette_model_bg:           ['模型底色', 'Model Background'],

        // === 5. 脚本菜单 (Tampermonkey Menu) ===
        menu_lang:                  ['🌐 语言/Language: 中文 (点击切换)', '🌐 Language/语言: English (Switch)'],
        menu_freeze_on:             ['✅ 已启用冻结快捷键 (Alt+F8)', '✅ Freeze Shortcut Enabled (Alt+F8)'],
        menu_freeze_off:            ['❌ 已禁用冻结快捷键 (Alt+F8)', '❌ Freeze Shortcut Disabled (Alt+F8)']
    };

    // [自动构建] 将上述配置表转换为脚本所需的标准对象 {zh:{...}, en:{...}}
    const TRANSLATIONS = { zh: {}, en: {} };
    for (const key in I18N_DEFS) {
        TRANSLATIONS.zh[key] = I18N_DEFS[key][0];
        TRANSLATIONS.en[key] = I18N_DEFS[key][1];
    }

    // 获取翻译的辅助函数
    function t(key) {
        // 增加兜底判断，如果语言未加载或 key 不存在，返回 key 本身或中文
        const langMap = TRANSLATIONS[CURRENT_LANG] || TRANSLATIONS.zh;
        return langMap[key] || key;
    }

    // 文本防御函数：在每个字符间插入零宽空格，物理隔绝翻译脚本的匹配
    // 仅在非中文模式下生效，因为中文模式下本来就是中文，不怕被误伤
    function protect(text) {
        if (!text) return text;
        if (CURRENT_LANG === 'zh') return text;
        return text.split('').join('\u200B');
    }

    // 界面文本热更新函数 (核心)
    function updateAllInterfaceText() {
        // 1. 查找所有带有 data-i18n-key 属性的元素
        const elements = document.querySelectorAll('[data-i18n-key]');
        
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            if (key) {
                // 重新获取翻译并应用防御
                el.textContent = protect(t(key));
            }
        });

        // 2. 特殊处理：自定义下拉菜单的当前值 (如果面板打开)
        // 因为下拉菜单的值是动态的，不能简单用 key 覆盖
        if (document.querySelector('.dae-settings-panel')) {
            // 简单粗暴但有效的方法：如果面板开着，关闭再重新打开以刷新动态内容
            // 或者：仅刷新静态文本（上面已经做了），动态文本等用户下次操作自动刷新
            // 这里我们选择保留面板，仅刷新上面的静态文本，这已经覆盖了 90% 的内容
        }
        
        console.log(`[Gemini 优化] 界面语言已切换为: ${CURRENT_LANG}`);
    }

    // 动态更新根节点变量 (用于自定义背景色)
    const ROOT_VAR_STYLE_ID = 'dae-root-vars-style';
    
    function updateRootThemeVariables() {
        let styleEl = document.getElementById(ROOT_VAR_STYLE_ID);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = ROOT_VAR_STYLE_ID;
            document.head.appendChild(styleEl);
        }
        
        // 这里的 !important 确保覆盖原来的 CSS 定义
        styleEl.textContent = `
            :root {
                --gc-eye-protect-bg: ${activeSettings.customLightBg} !important;
                --gc-native-dark-bg: ${activeSettings.customDarkBg} !important;
            }
        `;
    }

    // 初始化日志
    console.log('[Gemini 对话清除器] 脚本已加载并启动...');
    console.log('[Gemini 对话清除器] 当前网址:', window.location.href);

    // 配置 - 所有可能需要更改的设置、选择器和值
    const CHAT_TURN_OPTIONS_SELECTOR = 'ms-chat-turn-options button[iconname="more_vert"]';
    const DELETE_BUTTON_MENU_SELECTOR = 'button.mat-mdc-menu-item'; // 扩大选择范围到所有菜单项
    const DELETE_ICON_NAME = "delete"; // 通过图标名识别，不受中英文影响
    const INCOGNITO_INDICATOR_SELECTOR = 'ms-incognito-mode-indicator';
    const COMPARE_BUTTON_SELECTOR = 'button[data-test-compare]';
    const RAW_MODE_BUTTON_SELECTOR = 'button[data-test-raw-mode]';
    const MORE_BUTTON_SELECTOR = 'button[iconname="more_vert"]';
    const TOOLBAR_RIGHT_SELECTOR = '.toolbar-right';
    // --- 免责声明隐藏功能配置 ---
    const DISCLAIMER_SELECTOR = 'ms-hallucinations-disclaimer';
    const STYLE_ID = 'gemini-cleaner-hide-disclaimer-style';

    // 更新免责声明显示状态的函数
    function updateDisclaimerVisibility() {
        // 读取 activeSettings
        const shouldHide = activeSettings.hideDisclaimer;
        let styleEl = document.getElementById(STYLE_ID);

        if (shouldHide) {
            if (!styleEl) {
                const style = document.createElement('style');
                style.id = STYLE_ID;
                style.textContent = `${DISCLAIMER_SELECTOR} { display: none !important; }`;
                document.head.appendChild(style);
            }
        } else {
            if (styleEl) styleEl.remove();
        }
    }

    // --- Markdown 优化功能配置 ---
    const MARKDOWN_BASE_ID = 'dae-markdown-base';
    const MARKDOWN_COLOR_ID = 'dae-markdown-color';
    
    // 1. 基础排版 CSS (字体、间距、分割线)
    const MARKDOWN_BASE_CSS = `
        /* ==================== 0. 核心变量 (仅基础) ==================== */
        body, body.dark-theme {
            --my-text-main: #d1d1d1;
            --my-text-bold: #ffffffe0;
            --my-hr-center: #444444;
            --my-hr-side:   #ffffff08;
            --my-code-bg:   #333333;
            --my-code-text: #e6e6e6;
        }
        body.light-theme {
            --my-text-main: #373737;
            --my-text-bold: #000000;
            --my-hr-center: #d0d0d0;        
            --my-hr-side:   #00000005;      
            --my-code-bg:   #f0f2f4;        
            --my-code-text: #1f1f1f;        
        }

        /* ==================== 1. 正文优化 ==================== */
        ms-text-chunk, .markdown-content { color: var(--my-text-main) !important; }
        
        /* 段落行距与段距 (配合后续的 font-size 控制) */
        ms-text-chunk p, .markdown-content p {
            margin-bottom: 1.2em !important;
            color: var(--my-text-main) !important;
        }

        /* 移除最后一个元素的下边距，防止撑大底部空白 */
        ms-text-chunk ms-cmark-node > :last-child,
        .markdown-content > :last-child {
            margin-bottom: 0 !important;
        }

        /* 加粗强化 */
        ms-text-chunk strong, ms-text-chunk b,
        .markdown-content strong, .markdown-content b {
            color: var(--my-text-bold) !important; 
            font-weight: 700 !important;
        }

        /* 分割线渐变 */
        ms-text-chunk hr, .markdown-content hr {
            height: 1px !important;
            background-image: linear-gradient(to right, var(--my-hr-side), var(--my-hr-center), transparent) !important;
            background-color: transparent !important;
            border: none !important;
            margin: 32px 0 !important;
            opacity: 0.8;
        }

        /* 列表优化 */
        ms-text-chunk ul, ms-text-chunk ol {
            margin-bottom: 1em !important;
            margin-top: 1em !important;
            padding-left: 30px !important;
        }
        ms-text-chunk li, .markdown-content li {
            margin-bottom: 4px !important;
            color: var(--my-text-main) !important;
        }
        ms-text-chunk li p { display: inline !important; margin: 0 !important; }

        /* ==================== 2. 代码块字体 ==================== */
        code, pre {
            font-family: 'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'Hack', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace !important;
            font-size: 0.95em !important;
        }
        ms-text-chunk :not(pre) > code {
            background-color: var(--my-code-bg) !important;
            color: var(--my-code-text) !important;
            padding: 2px 5px !important;
            border-radius: 4px !important;
        }
    `;

    // 粗体修复专用 CSS (独立 ID)
    const BOLD_FIX_ID = 'dae-bold-fix-style';
    const BOLD_FIX_CSS = `
        .md-bold-fix {
            color: var(--my-text-bold, inherit) !important;
            font-weight: 700 !important;
        }
        :root { --my-text-bold: inherit; } 
        body.dark-theme { --my-text-bold: #ffffffe0; }
        body.light-theme { --my-text-bold: #000000; }
    `;

    // --- 字体大小控制 ---
    const FONT_SIZE_STYLE_ID = 'dae-font-size-style';

    function updateFontSize() {
        const size = activeSettings.chatFontSize;
        let styleEl = document.getElementById(FONT_SIZE_STYLE_ID);

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = FONT_SIZE_STYLE_ID;
            document.head.appendChild(styleEl);
        }

        // 增加 line-height 控制，实现同比例缩放
        styleEl.textContent = `
            ms-text-chunk, 
            .markdown-content,
            ms-text-chunk p, 
            .markdown-content p,
            ms-text-chunk li, 
            .markdown-content li,
            .turn-content {
                font-size: ${size}px !important;
                line-height: 1.6 !important; 
            }
        `;
    }

    // 1. 基础排版控制器
    function updateBaseMarkdownStyle() {
        let el = document.getElementById(MARKDOWN_BASE_ID);
        if (activeSettings.enableMarkdownEnhancement) {
            if (!el) {
                el = document.createElement('style');
                el.id = MARKDOWN_BASE_ID;
                el.textContent = MARKDOWN_BASE_CSS;
                document.head.appendChild(el);
            }
        } else {
            if (el) el.remove();
        }
    }

    // 全局样式更新入口
    function updateAllMarkdownStyles() {
        updateRootThemeVariables();
        updateBaseMarkdownStyle();
        updateChatBackgroundStyles();
        updateBoldFixState();
    }

    // 隐藏评价按钮控制器
    const FEEDBACK_BTN_STYLE_ID = 'dae-hide-feedback-style';

    function updateFeedbackButtonsVisibility() {
        const shouldHide = activeSettings.hideFeedbackButtons;
        let styleEl = document.getElementById(FEEDBACK_BTN_STYLE_ID);

        if (shouldHide) {
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = FEEDBACK_BTN_STYLE_ID;
                // 使用 iconname 属性和类名双重匹配，确保精准隐藏
                styleEl.textContent = `
                    .response-feedback-button,
                    button[iconname="thumb_up"],
                    button[iconname="thumb_down"] { 
                        display: none !important; 
                    }
                `;
                document.head.appendChild(styleEl);
            }
        } else {
            if (styleEl) styleEl.remove();
        }
    }

    // 聊天背景色美化控制器 (集成 Chat Interface Optimizer 逻辑)
    // 包含：用户蓝色背景、模型绿色背景、隐藏分界线、内边距优化
    const CHAT_BG_STYLE_ID = 'dae-chat-bg-style';

    function updateChatBackgroundStyles() {
        // 确保自定义根变量（如主背景色）先更新
        updateRootThemeVariables();
        
        const enableUser = activeSettings.enableUserColorDifference;
        const enableModel = activeSettings.enableModelColorDifference;

        // 根据当前实时的深/浅色模式，从 activeSettings 中提取对应的记忆颜色
        const isDark = isCurrentDarkMode();
        const userColor = isDark ? activeSettings.userBgColorDark : activeSettings.userBgColorLight;
        const modelColor = isDark ? activeSettings.modelBgColorDark : activeSettings.modelBgColorLight;
        
        const uC = parseRgbaColor(userColor);
        const mC = parseRgbaColor(modelColor);
        
        // 计算边框色（通常比底色深一倍）
        const userBorder = hexToRgbaStr(uC.hex, Math.min(uC.alpha * 2, 1));
        const modelBorder = hexToRgbaStr(mC.hex, Math.min(mC.alpha * 2, 1));

        let styleEl = document.getElementById(CHAT_BG_STYLE_ID);

        if (!enableUser && !enableModel) {
            if (styleEl) styleEl.remove();
            return;
        }

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = CHAT_BG_STYLE_ID;
            document.head.appendChild(styleEl);
        }

        let css = '';

        // --- 1. 用户 (User) 样式 ---
        if (enableUser) {
            css += `
                .turn-separator { display: none !important; }
                .chat-turn-container.user {
                    background-color: ${userColor} !important;
                    border: 1px solid ${userBorder} !important;
                    border-radius: 8px !important;
                }
                .chat-turn-container.user mat-expansion-panel,
                .chat-turn-container.user mat-expansion-panel-header {
                    background-color: transparent !important;
                }
            `;
        }

        // --- 2. 模型 (Model) 样式 ---
        if (enableModel) {
            css += `
                .chat-turn-container.model {
                    background-color: ${modelColor} !important;
                    border: 1px solid ${modelBorder} !important;
                    border-radius: 8px !important;
                }
                .chat-turn-container.model .turn-footer {
                    background-color: transparent !important;
                }
                .chat-turn-container.model .turn-footer button {
                    background-color: light-dark(#ffffff, rgb(45, 45, 45)) !important;
                    border-radius: 50% !important;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
                    transition: transform 0.1s ease !important;
                }
                .chat-turn-container.model .turn-footer button:hover {
                    transform: scale(1.1) !important;
                    background-color: light-dark(#f5f5f5, rgb(60, 60, 60)) !important;
                }
            `;
        }

        styleEl.textContent = css;
    }

    // 3. 粗体修复控制器 (CSS + 逻辑触发)
    function updateBoldFixState() {
        let el = document.getElementById(BOLD_FIX_ID);
        
        if (activeSettings.enableBoldSpacingFix) {
            // A. 注入必要的 CSS
            if (!el) {
                el = document.createElement('style');
                el.id = BOLD_FIX_ID;
                el.textContent = BOLD_FIX_CSS;
                document.head.appendChild(el);
            }
            // B. 立即执行一次优化
            optimizeMarkdownText();
        } else {
            // A. 移除 CSS
            if (el) el.remove();
            // B. 立即执行还原
            restoreMarkdownText();
        }
    }

    // 4. 统一入口 (用于 Reset 按钮)
    function updateAllMarkdownStyles() {
        updateBaseMarkdownStyle();
        updateChatBackgroundStyles(); // 调用新的背景色函数
        updateBoldFixState();
    }

    // --- API Key 推广隐藏功能配置 ---
    const API_KEY_STYLE_ID = 'gemini-cleaner-hide-apikey-style';

    function updateApiKeyVisibility() {
        // 独立读取两个开关
        const hideInput = activeSettings.hideApiKeyInput;
        const hideSettings = activeSettings.hideApiKeySettings;
        
        let styleEl = document.getElementById(API_KEY_STYLE_ID);

        // 如果两个都关闭，且样式元素存在，则移除
        if (!hideInput && !hideSettings) {
            if (styleEl) styleEl.remove();
            return;
        }

        // 只要有一个开启，就创建或更新样式
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = API_KEY_STYLE_ID;
            document.head.appendChild(styleEl);
        }

        // 动态构建 CSS
        let cssContent = '';
        if (hideInput) {
            cssContent += `
                ms-paid-api-key-button,
                .button-row-left ms-paid-api-key-button { display: none !important; }
            `;
        }
        if (hideSettings) {
            cssContent += `
                ms-paid-api-key,
                button.paid-api-key-card { display: none !important; }
            `;
        }
        
        styleEl.textContent = cssContent;
    }

    // 移植自汉化脚本的通知组件
    function showNotification(message, duration = 1500) {
        const STYLE_ID = 'dae-opt-notification-style';
        
        // 1. 注入自适应样式 (如果尚未注入)
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `
                :root {
                    /* 定义自适应颜色变量 */
                    --dae-notif-bg: light-dark(rgb(252, 252, 252), rgb(31, 31, 31));
                    --dae-notif-text: light-dark(#333333, #F2F2F2);
                    --dae-notif-border: light-dark(#e0e0e0, rgb(39, 39, 39));
                }
                .dae-opt-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    
                    background-color: var(--dae-notif-bg) !important;
                    color: var(--dae-notif-text) !important;
                    border: 1px solid var(--dae-notif-border) !important;
                    
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    font-family: "Google Sans", Roboto, sans-serif;
                    z-index: 999999;
                    
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    
                    animation: slideIn 0.3s ease-out;
                    pointer-events: none;
                    white-space: nowrap;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // 2. 确定前缀 (根据当前语言变量)
        // 假设 CURRENT_LANG 是全局定义的 'zh' 或 'en'
        const prefix = (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'en') 
            ? '[Enhancement tool] ' 
            : '[优化工具] ';

        // 3. 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'dae-opt-notification';
        // 将前缀拼接到消息前面
        notification.textContent = prefix + message;

        // 4. 挂载与销毁
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // 注册右键菜单命令 (更新版：支持排序和语言切换)
    function registerMenuCommands() {
        // 1. 清除所有已注册的菜单
        registeredMenuIds.forEach(id => GM_unregisterMenuCommand(id));
        registeredMenuIds = [];

        // 2. 注册 "冻结模式" 开关
        const isFreezeEnabled = activeSettings.enableFreezeShortcut;
        const freezeText = isFreezeEnabled ? t('menu_freeze_on') : t('menu_freeze_off');
        
        const freezeMenuId = GM_registerMenuCommand(freezeText, () => {
            // A. 切换状态
            activeSettings.enableFreezeShortcut = !activeSettings.enableFreezeShortcut;
            GM_setValue('enableFreezeShortcut', activeSettings.enableFreezeShortcut);
            
            // B. 刷新菜单显示
            registerMenuCommands();
            
            // C. 显示通知
            const notifMsg = activeSettings.enableFreezeShortcut 
                ? (CURRENT_LANG === 'zh' ? '✅ 已启用冻结快捷键 (Alt+F8)' : '✅ Freeze Shortcut Enabled')
                : (CURRENT_LANG === 'zh' ? '❌ 已禁用冻结快捷键' : '❌ Freeze Shortcut Disabled');
            showNotification(notifMsg);
            
            console.log(`[Gemini 优化] 冻结快捷键已${activeSettings.enableFreezeShortcut ? '启用' : '禁用'}`);
        });
        registeredMenuIds.push(freezeMenuId);

        // 3. 语言切换
        const langText = t('menu_lang'); 
        
        registeredMenuIds.push(GM_registerMenuCommand(langText, () => {
            // A. 切换变量
            CURRENT_LANG = CURRENT_LANG === 'zh' ? 'en' : 'zh';
            GM_setValue('language', CURRENT_LANG);
            
            // B. 刷新所有可见文本 (热更新)
            updateAllInterfaceText();
            
            // C. 刷新菜单本身的文字
            registerMenuCommands();

            // D. 显示通知
            const notifMsg = CURRENT_LANG === 'zh' 
                ? '🌐 语言已切换为：中文' 
                : '🌐 Language switched to: English';
            showNotification(notifMsg);
        }));
    }

    // 样式 - 统一颜色管理、护眼模式及组件样式
    GM_addStyle(`
        /* ==========================================================================
           1. 全局基准颜色定义 (Single Source of Truth)
           ========================================================================== */
        :root {
            /*
             * [护眼模式基准色]
             * 在这里修改一次，页面背景、Tooltip、引用卡片都会同步改变
             */
            /* --gc-eye-protect-bg: rgb(252, 252, 252); */

            /* Google 原生深色基准 (保持原样) */
            /* --gc-native-dark-bg: #141313; */
        }

        /* ==========================================================================
           2. 护眼模式强制覆盖 (Google 原生界面)
           ========================================================================== */
        /* 使用 body 选择器提高权重，确保覆盖原生样式 */
        :root, body {
            /*
             * 浅色模式：统一引用 var(--gc-eye-protect-bg)
             * 深色模式：保持 var(--gc-native-dark-bg)
             */
            --mat-sys-background: light-dark(var(--gc-eye-protect-bg), var(--gc-native-dark-bg)) !important;
            --mat-sys-surface: light-dark(var(--gc-eye-protect-bg), var(--gc-native-dark-bg)) !important;
            --mat-sys-surface-container: light-dark(var(--gc-eye-protect-bg), #1f1f1f) !important;
            --mat-app-background-color: light-dark(var(--gc-eye-protect-bg), #303030) !important;
            --color-v3-surface: light-dark(var(--gc-eye-protect-bg), #191919) !important;

            /* 输入框背景：避免一片死白 */
            --color-prompt-input-background: light-dark(rgb(248, 248, 247), rgba(255,255,255,0.07)) !important;
        }

        /* ==========================================================================
           3. 脚本组件颜色定义 (复用上面的变量)
           ========================================================================== */
        :root {
            /* --- Tooltip 颜色 --- */
            /* 浅色：复用护眼色 (252) | 深色：脚本专用深灰 (31,31,31) */
            --gc-tooltip-bg: light-dark(var(--gc-eye-protect-bg), rgb(31, 31, 31));

            /* --- 引用卡片颜色 --- */
            /* 浅色：复用护眼色 (252) | 深色：脚本专用深灰 (31,31,31) */
            --gc-card-bg: light-dark(var(--gc-eye-protect-bg), rgb(31, 31, 31));

            /* --- 其他组件配色 --- */
            --gc-tooltip-text: light-dark(#333333, #F2F2F2);
            --gc-tooltip-border: light-dark(#e0e0e0, rgb(39, 39, 39));

            /* 按钮悬停：浅色下比 252 稍微深一点点(235)，否则看不出悬停效果 */
            --gc-btn-hover: light-dark(rgb(235, 235, 235), rgb(66, 66, 66));

            --gc-card-border: light-dark(#e0e0e0, rgb(39, 39, 39));
            --gc-card-text-primary: light-dark(#1f1f1f, #d0d0d0);
            --gc-card-text-secondary: light-dark(#5f6368, #aaa);
            --gc-card-close-hover: light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.1));
            --gc-card-close-icon: light-dark(#5f6368, #888);
        }

        /* ==========================================================================
           4. 组件具体样式 (Structure)
           ========================================================================== */

        #gemini-cleaner-confirm {
            position: fixed;
            z-index: 9999;
            min-width: 280px;
            max-width: 420px;
        }

        /* --- 按钮交互样式 --- */
        #gemini-cleaner-toolbar-btn {
            border-radius: 50% !important;
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;
            padding: 0 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: background-color 200ms cubic-bezier(0.2, 0, 0, 1) !important;
        }

        #gemini-cleaner-toolbar-btn:hover:not([disabled]),
        #gemini-cleaner-toolbar-btn:active:not([disabled]) {
            background-color: var(--gc-btn-hover) !important;
        }

        /* --- Tooltip --- */
        .gemini-custom-tooltip {
            position: fixed;
            z-index: 10000;
            background-color: var(--gc-tooltip-bg) !important;
            border: 1px solid var(--gc-tooltip-border) !important;
            color: var(--gc-tooltip-text) !important;
            padding: 8px 12px !important;
            border-radius: 14px !important;
            font-family: "Google Sans", Roboto, Arial, sans-serif;
            font-size: 12px;
            font-weight: 500;
            line-height: 1.5 !important;
            pointer-events: none;
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.1s ease, transform 0.05s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            
            /* 宽度限制 */
            max-width: 220px !important; 
            white-space: pre-wrap !important; 
            word-wrap: break-word !important;
            text-align: left !important;
        }
        .gemini-custom-tooltip.visible {
            opacity: 1;
            transform: scale(1);
        }

        /* --- 划词引用按钮 --- */
        .gemini-quote-btn {
            position: fixed;
            z-index: 10000;
            background-color: var(--gc-tooltip-bg);
            border: 1px solid var(--gc-tooltip-border);
            color: var(--gc-card-text-primary);
            padding: 6px 12px;
            border-radius: 8px;
            font-family: "Google Sans", Roboto, Arial, sans-serif;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            opacity: 0;
            transform: translateY(5px);
            transition: opacity 0.15s ease, transform 0.15s ease, background-color 0.1s;
            pointer-events: none;
        }
        .gemini-quote-btn.visible {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        .gemini-quote-btn:hover {
            background-color: var(--gc-btn-hover);
        }
        /* 1. 向上翻转：优雅的缓动动画 */
        .gemini-quote-btn.smooth-flip-up {
            transition: top 0.2s cubic-bezier(0.2, 0, 0, 1), left 0.2s cubic-bezier(0.2, 0, 0, 1) !important;
        }

        /* 2. 回归下方：快速、线性的平移动画 */
        .gemini-quote-btn.smooth-flip-down {
            transition: top 0.05s linear, left 0.05s linear !important;
        }
        /* 用于在与输入框重叠时临时隐藏按钮，保留状态 */
        .gemini-quote-btn.temporarily-hidden {
            opacity: 0;
            pointer-events: none;
            /* 改为 0s linear，实现瞬间隐藏，不再有 0.1s 拖泥带水 */
            transition: opacity 0s linear !important;
        }

        /* --- 引用预览卡片 --- */
        #gemini-quote-card-container {
            margin-bottom: 8px;
            margin-left: 10px;
            margin-right: 10px;
            animation: slideDown 0.2s ease-out;
        }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .gemini-quote-card {
            display: flex;
            flex-direction: column;
            background-color: var(--mat-sys-background);
            border: 1px solid var(--gc-card-border);
            border-left: 4px solid #4b8bf5;
            border-radius: 8px;
            padding: 10px 14px;
            position: relative;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .gemini-quote-header {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            font-size: 12px;
            color: var(--gc-card-text-secondary);
            font-weight: 500;
        }

        .gemini-quote-author {
            color: var(--gc-card-text-primary);
            margin-right: 6px;
            font-weight: 600;
        }

        .gemini-quote-content {
            font-size: 13px;
            line-height: 1.4;
            color: var(--gc-card-text-primary);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            white-space: pre-wrap;
        }

        .gemini-quote-close {
            position: absolute;
            top: 6px;
            right: 6px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: none;
            background: transparent;
            color: var(--gc-card-close-icon);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            line-height: 1;
        }
        .gemini-quote-close:hover {
            background-color: var(--gc-card-close-hover);
            color: var(--gc-card-text-primary);
        }
        /* --- 移动端引用按钮适配样式 --- */
        .gemini-quote-btn.mobile-view {
            position: fixed;
            top: auto !important;
            /* 移除 !important，交由 JS 动态计算 bottom */
            bottom: 130px; 
            left: 50% !important;
            right: auto !important;
            /* 居中变换 */
            transform: translateX(-50%); 
            padding: 8px 16px; 
            font-size: 14px;
            
            /* 优化阴影：浅色模式下更柔和(0.15)，深色模式下加深(0.3)以保证对比度 */
            box-shadow: 0 4px 12px light-dark(rgba(0,0,0,0.15), rgba(0,0,0,0.3));
            
            z-index: 10001;
        }

        .gemini-quote-btn.mobile-view.visible {
            opacity: 1;
            /* 激活时保持水平居中 */
            transform: translateX(-50%);
        }

        /* --- 滚动导航按钮样式 --- */
        .gemini-scroll-btn {
            position: fixed;
            z-index: 999;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            
            /* 1. 基础样式 (无任何高亮) */
            background-color: var(--mat-sys-background);
            border: 1px solid var(--gc-card-border);
            color: var(--gc-card-text-primary);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            
            /* 2. 彻底禁用系统默认高亮 */
            -webkit-tap-highlight-color: transparent !important;
            -webkit-touch-callout: none;
            user-select: none;
            outline: none !important;
            
            transition: opacity 0.2s ease, background-color 0.1s, transform 0.1s;
            
            bottom: 130px; 
            
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 18px;
            font-weight: 800;
            line-height: 1;
        }

        /* 移动端：按钮缩小约 5% (36px -> 34px)，字号微调 */
        @media (max-width: 768px) {
            .gemini-scroll-btn {
                width: 34px;
                height: 34px;
                font-size: 17px;
            }
        }

        /* --- 交互隔离区 --- */

        /* 规则A：只有检测到"精细指针"(鼠标)设备，才允许 CSS 触发 Hover */
        /* 触摸屏根本进不来这个判断，所以永远不会有 CSS 级的高亮残留 */
        @media (hover: hover) and (pointer: fine) {
            .gemini-scroll-btn:hover {
                background-color: var(--gc-btn-hover);
            }
            /* 已移除 PC 端鼠标按下时的缩放与变色效果 (.gemini-scroll-btn:active) */
        }

        /* 规则B：移动端唯一允许的高亮方式 —— JS添加类名 */
        /* 优先级最高，无视任何浏览器默认行为 */
        .gemini-scroll-btn.js-mobile-press {
            background-color: var(--gc-btn-hover) !important;
            transform: scale(0.95);
        }

        .gemini-scroll-btn.visible {
            opacity: 1;
            pointer-events: auto;
        }

        /* ==========================================================================
           5. 设置面板与开关样式 (高密度紧凑版 - 最终优化)
           ========================================================================== */
        
        /* 遮罩层 */
        .dae-settings-backdrop {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.4); /* 保持这个暗色背景 */
            z-index: 10002;
            animation: fadeIn 0.2s ease;
            /* backdrop-filter: blur(3px);  <-- 删除或注释掉这行代码即可去除模糊 */
        }

        /* 面板容器 - 改为 Flex 布局以支持内部滚动 */
        .dae-settings-panel {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 500px; /* 稍微加宽以容纳更多文字 */
            max-width: 90vw;
            max-height: 85vh;
            background-color: var(--gc-card-bg);
            border-radius: 16px; /* 减小圆角，显得更干练专业 */
            box-shadow: 0 12px 24px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1);
            z-index: 10003;
            padding: 20px; /* 减小内边距 */
            color: var(--gc-card-text-primary);
            font-family: "Google Sans", Roboto, sans-serif;
            animation: popIn 0.2s cubic-bezier(0,0,0.2,1);
            
            /* 关键：使用 Flex 列布局，确保只有列表区域滚动，标题和按钮固定 */
            display: flex;
            flex-direction: column;
        }

        /* 标题区域 */
        .dae-settings-title {
            font-size: 18px; /* 缩小标题字号 (22->18) */
            font-weight: 500;
            margin-bottom: 0;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--gc-card-border); /* 增加分割线 */
            color: var(--gc-card-text-primary);
            flex-shrink: 0; /* 防止标题被压缩 */
        }

        /* 列表区域 - 高密度核心 */
        .dae-settings-list {
            display: flex;
            flex-direction: column;
            gap: 4px; /* 极小的间距 (24->4)，实现高密度 */
            padding-top: 12px;
            flex-grow: 1; /* 占据剩余空间 */
            overflow-y: auto; /* 内容过多时只在这里滚动 */
            padding-right: 4px; /* 为滚动条留空 */
        }
        
        /* 列表滚动条美化 */
        .dae-settings-list::-webkit-scrollbar { width: 4px; }
        .dae-settings-list::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 3px; }

        /* 分组标题样式 */
        .dae-settings-group-header {
            font-size: 13px;
            font-weight: 700;
            color: var(--gc-card-text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 12px;
            margin-bottom: 4px;
            padding-left: 8px;
            flex-shrink: 0;
        }
        /* 第一组不需要顶部间距 */
        .dae-settings-group-header:first-child { margin-top: 0; }

        /* 选项行样式 */
        .dae-setting-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px; /* 缩小选项字号 (16->14) */
            font-weight: 400;
            color: var(--gc-card-text-primary);
            padding: 8px 12px; /* 紧凑的内边距 */
            border-radius: 8px;
            transition: background-color 0.1s;
            min-height: 36px; /* 确保最小点击高度 */
            flex-shrink: 0;
        }
        
        /* 悬停高亮，增加交互感 */
        .dae-setting-item:hover {
            background-color: light-dark(rgba(0,0,0,0.04), rgba(255,255,255,0.04));
        }

        /* 子选项缩进样式 (用于“居中”选项) */
        .dae-setting-item.is-sub-item {
            padding-left: 24px;
            position: relative;
        }
        .dae-setting-item.is-sub-item::before {
            content: "↳";
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gc-card-text-secondary);
            opacity: 0.6;
            font-size: 12px;
        }

        /* --- Switch 开关组件 (缩小适配版) --- */
        .dae-md3-switch {
            position: relative;
            display: inline-block;
            width: 36px;  /* 宽度缩小: 42 -> 36 */
            height: 22px; /* 高度缩小: 26 -> 22 */
            flex-shrink: 0;
            margin-left: 12px;
        }
        .dae-md3-switch input { opacity: 0; width: 0; height: 0; }

        /* 1. 轨道 */
        .dae-md3-track {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: transparent;
            border: 2px solid light-dark(#747775, #858585);
            border-radius: 100px;
            transition: .2s cubic-bezier(0.2, 0.0, 0, 1);
        }

        /* 2. 滑块 */
        .dae-md3-thumb {
            position: absolute;
            height: 10px; width: 10px; /* 直径缩小: 12 -> 10 */
            left: 4px; bottom: 4px;    /* 居中计算: (22-4-10)/2 = 4 */
            background-color: light-dark(#747775, #858585);
            border-radius: 50%;
            transition: transform .2s, background-color .2s, width .2s, height .2s;
        }

        /* Hover 效果 */
        .dae-md3-switch:hover .dae-md3-thumb { background-color: light-dark(#5e5e5e, #a8a8a8); }
        .dae-md3-switch:hover .dae-md3-track { border-color: light-dark(#5e5e5e, #a8a8a8); }

        /* 选中状态 (ON) */
        input:checked + .dae-md3-track {
            background-color: light-dark(#303030, #E3E3E3) !important;
            border-color: light-dark(#303030, #E3E3E3) !important;
        }

        input:checked + .dae-md3-track .dae-md3-thumb {
            background-color: light-dark(#FFFFFF, #303030) !important;
            /* 移动距离: 36(宽) - 4(左) - 4(右) - 10(球) + 修正 = 14px */
            transform: translateX(14px); 
            width: 14px; height: 14px; /* 激活时稍微变大一点点 */
            left: 2px; bottom: 2px;
        }

        /* 底部按钮区域 */
        .dae-settings-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 16px; /* 减小间距 */
            padding-top: 12px;
            border-top: 1px solid var(--gc-card-border); /* 增加分割线 */
            flex-shrink: 0;
        }
        
        /* 动画定义 */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: translate(-50%, -48%) scale(0.9); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }

        /* 移动端适配 */
        @media (max-width: 600px) {
            .dae-settings-panel {
                width: 92% !important;  /* 移动端稍微宽一点 */
                max-height: 80vh !important;
                padding: 16px !important;
                border-radius: 20px !important;
            }
            .dae-settings-title { font-size: 17px !important; }
            .dae-setting-item { 
                font-size: 15px !important; /* 移动端字号不宜过小 */
                padding: 10px 8px !important; /* 增加点击区域 */
            }
            .dae-settings-group-header { margin-top: 16px; }
            .dae-select-trigger { width: 140px; } /* 移动端适当缩小 */
        }

        /* [重要] 强制隐藏类 & 动画同步修正 (保留原逻辑) */
        .gemini-scroll-btn.force-hidden,
        .gemini-quote-btn.force-hidden {
            opacity: 0 !important;
            pointer-events: none !important;
            transition: all 0.1s ease !important; 
        }

        .gemini-scroll-btn,
        .gemini-quote-btn {
            transition: opacity 0.1s ease, transform 0.1s ease, background-color 0.1s !important;
        }

        .gemini-quote-btn.mobile-view {
            transition: opacity 0.1s ease, transform 0.1s ease !important;
        }

        /* ==========================================================================
           6. Tooltip 增强样式 (Icon 版)
           ========================================================================== */
        
        /* 信息图标样式 */
        .dae-info-icon {
            font-size: 16px; /* 稍微比文字大一点点，便于点击 */
            width: 16px; height: 16px;
            margin-left: 6px;
            color: var(--gc-card-text-secondary);
            cursor: pointer;
            vertical-align: middle;
            opacity: 0.6;
            transition: opacity 0.2s, color 0.2s;
            user-select: none;
            display: inline-flex; /* 确保图标对齐 */
            align-items: center;
            justify-content: center;
        }

        /* 悬停或激活状态 */
        .dae-info-icon:hover,
        .dae-info-icon.active {
            opacity: 1;
            color: #4b8bf5; /* 激活时变为蓝色 */
        }

        /* 悬浮说明框 (保持不变) */
        .dae-setting-popup-tooltip {
            position: fixed;
            background-color: var(--gc-tooltip-bg);
            color: var(--gc-tooltip-text);
            border: 1px solid var(--gc-tooltip-border);
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 13px;
            line-height: 1.5;
            z-index: 10005;
            box-shadow: 0 4px 16px rgba(0,0,0,0.18);
            max-width: 260px;
            pointer-events: none;
            opacity: 0;
            transform: translateY(5px) scale(0.98);
            transition: opacity 0.15s cubic-bezier(0.2, 0, 0, 1), transform 0.15s cubic-bezier(0.2, 0, 0, 1);
            white-space: pre-wrap;
            text-align: left;
        }
        
        .dae-setting-popup-tooltip.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
        }


        /* 嵌入式搜索后缀开关按钮 */
        .dae-suffix-toggle-btn {
            font-family: "Google Sans", Roboto, Arial, sans-serif;
            font-size: 12px;
            font-weight: 500;
            padding: 4px 10px;
            margin-right: 12px;
            border-radius: 6px;
            cursor: pointer;
            border: 1px solid;
            transition: all 0.2s ease;
            line-height: 1.5;
            user-select: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        /* 状态颜色 */
        .dae-suffix-toggle-btn {
            /* 
               未开启: 
               浅色: 底白(#fff) 
               深色: 底 rgb(20, 20, 20) 
            */
            background-color: light-dark(#ffffff, rgb(20, 20, 20));
            color: light-dark(#000000, #ffffff);
            border-color: light-dark(#e0e0e0, #555);
        }
        
        .dae-suffix-toggle-btn.active {
            /* 
               已开启: 
               浅色: 底黑(#000) 
               深色: 底 rgb(256, 256, 256) 
            */
            background-color: light-dark(#000000, rgb(256, 256, 256)) !important;
            
            /* 
               文字颜色适配:
               浅色(底黑) -> 字白
               深色(底灰) -> 字黑 (在 127 中灰色背景上，黑色文字对比度更高更清晰)
            */
            color: light-dark(#ffffff, #000000) !important;
            border-color: light-dark(#000000, rgb(127, 127, 127)) !important;
            font-weight: 700;
        }
        .dae-suffix-toggle-btn:hover {
            opacity: 0.8;
        }

        /* 移动端强制隐藏该按钮 (CSS 级屏蔽) */
        @media (max-width: 768px) {
            .dae-suffix-toggle-btn {
                display: none !important;
            }
        }

        /* --- 设置面板滑块样式 (已重构) --- */
        .dae-slider-container {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
            margin-left: auto;
            height: 22px;
        }
        
        .dae-slider-value {
            font-size: 13px;
            font-variant-numeric: tabular-nums; 
            min-width: 34px;
            text-align: right;
            color: var(--gc-card-text-secondary);
            line-height: 1;
        }

        /* ==================== 1. 通用滑块样式 (同步交互逻辑) ==================== */

        /* 滑块输入框本体 (共享) */
        .dae-slider-input,
        .dae-alpha-slider {
            -webkit-appearance: none;
            background: transparent;
            outline: none;
            margin: 0;
            padding: 0;
            vertical-align: middle;
            height: 14px;
            cursor: pointer;
        }

        /* 滑轨 (共享) */
        .dae-slider-input::-webkit-slider-runnable-track,
        .dae-alpha-slider::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            background: var(--gc-card-border);
            border-radius: 2px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        /* 滑块拖拽球 (共享基础样式与交互逻辑) */
        .dae-slider-input::-webkit-slider-thumb,
        .dae-alpha-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            margin-top: -5px; /* 居中核心：(4-14)/2 */
            width: 14px;
            height: 14px;
            border-radius: 50%;
            cursor: pointer;
            /* 关键：统一动画过渡时间 */
            transition: transform 0.1s cubic-bezier(0.2, 0, 0, 1), background-color 0.1s ease;
            background: light-dark(#747775, #a8a8a8); /* 统一默认颜色 */
        }

        /* [核心增强] 统一交互逻辑：悬停时两者的滑块都会缩放并变蓝 */
        .dae-slider-input::-webkit-slider-thumb:hover,
        .dae-alpha-slider::-webkit-slider-thumb:hover {
            transform: scale(1.25); /* 稍微加大一点点，回馈感更强 */
            background: #4b8bf5 !important; /* 悬停统一变蓝 */
        }
        
        /* 激活态（点击时）保持蓝色 */
        .dae-slider-input:active::-webkit-slider-thumb,
        .dae-alpha-slider:active::-webkit-slider-thumb {
            background: #4b8bf5 !important;
            transform: scale(1.15); /* 按住时回弹一点点，模拟物理手感 */
        }

        /* ==================== 2. [重构] 差异化样式 (仅保留布局差异) ==================== */
        
        /* 字体大小滑块：固定宽度 */
        .dae-slider-input {
            width: 90px;
        }

        /* 透明度滑块：通栏宽度 */
        .dae-alpha-slider {
            width: 100%;
        }
        
        /* 
           删掉了原有的 .dae-alpha-slider::-webkit-slider-thumb { background: #4b8bf5; }
           这样它就会自动继承通用样式里的灰色。
        */

        /* ==================== 3. 重置按钮 (保持不变) ==================== */

        .dae-slider-reset {
            background: transparent;
            border: none;
            cursor: pointer;
            color: var(--gc-card-text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 22px; 
            height: 22px;
            padding: 0;
            border-radius: 50%;
            transition: background 0.2s, color 0.2s;
        }
        .dae-slider-reset:hover {
            background: light-dark(rgba(0,0,0,0.05), rgba(255,255,255,0.1));
            color: var(--gc-card-text-primary);
        }
        .dae-slider-reset span {
            font-size: 16px;
            line-height: 1;
        }

        /* 自动删除时的“隐身模式”样式 */
        /* 作用：当后台在慢慢点删除时，强制隐藏弹出的菜单，彻底伪装成“无事发生” */
        html body.dae-deleting-mode .cdk-overlay-container,
        html body.dae-deleting-mode .cdk-overlay-backdrop {
            opacity: 0 !important;
            transition: none !important;
            background: transparent !important;
        }


        /* --- 颜色菜单按钮 --- */
        .dae-color-menu-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            color: var(--gc-card-text-secondary);
            
            /* 使用 inline-flex 确保垂直居中对齐 */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            
            /* 尺寸控制：稍微比 16px 大一点点以便点击，但视觉重心保持 16px */
            width: 20px;
            height: 20px;
            
            /* 间距与 Info 图标一致 */
            margin-left: 6px;
            padding: 0;
            
            border-radius: 50%;
            transition: background 0.2s, color 0.2s, transform 0.1s;
            vertical-align: middle; /* 关键：确保与文字同行对齐 */
        }
        
        .dae-color-menu-btn:hover {
            background-color: var(--gc-btn-hover);
        }
        /* 激活(打开)状态：文字变蓝，但背景强制透明 */
        .dae-color-menu-btn.active {
            color: #4b8bf5 !important;
            background-color: transparent !important; 
            transform: scale(1.05); /* 可选：稍微放大一点点作为反馈 */
        }
        
        /* 强制图标字体大小为 16px，与 Info 图标完全一致 */
        .dae-color-menu-btn span {
            font-size: 16px !important;
            line-height: 1;
            font-weight: normal; /* 防止被粗体影响 */
        }

        /* --- 悬浮调色板 --- */
        .dae-color-palette-panel {
            position: fixed;
            z-index: 10005; /* 比设置面板高 */
            background-color: var(--gc-card-bg);
            border: 1px solid var(--gc-card-border);
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            padding: 16px;
            width: 240px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            animation: fadeIn 0.15s ease-out;
            color: var(--gc-card-text-primary);
        }
        .dae-palette-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
        }
        .dae-palette-close {
            cursor: pointer;
            padding: 4px;
            border-radius: 50%;
            display: flex;
            background: transparent; border: none;
            color: var(--gc-card-text-secondary);
        }
        .dae-palette-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
        }

        /* 插入到这里 */
        .alpha-value {
            font-size: 13px;
            font-variant-numeric: tabular-nums;
            color: var(--gc-card-text-secondary);
        }
        
        /* 颜色输入控件美化 */
        input[type="color"].dae-color-input {
            -webkit-appearance: none;
            border: none;
            width: 40px;
            height: 28px;
            padding: 0;
            background: none;
            cursor: pointer;
        }
        input[type="color"].dae-color-input::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"].dae-color-input::-webkit-color-swatch { 
            border: 1px solid var(--gc-card-border); 
            border-radius: 4px; 
        }
        
        /* 文本输入框 */
        input[type="text"].dae-hex-input {
            width: 80px;
            padding: 4px 8px;
            border: 1px solid var(--gc-card-border);
            border-radius: 4px;
            background-color: transparent;
            color: var(--gc-card-text-primary);
            font-family: monospace;
            text-transform: uppercase;
        }

        .dae-palette-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 4px;
        }
        .dae-palette-btn {
            background: transparent;
            border: 1px solid var(--gc-card-border);
            color: var(--gc-card-text-secondary);
            border-radius: 14px;
            padding: 4px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .dae-palette-btn:hover {
            background-color: var(--gc-btn-hover);
            color: var(--gc-card-text-primary);
        }
        .dae-palette-btn.confirm-btn {
            margin-left: auto;
        }

        /* 双模式调色板分区样式 */
        .dae-palette-mode-section {
            padding: 12px 0;
            border-bottom: 1px solid var(--gc-card-border);
        }
        .dae-palette-mode-section:last-of-type {
            border-bottom: none;
        }
        .dae-palette-mode-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--gc-card-text-primary);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }


        /* ==================== 自定义下拉菜单美化 (Custom Select) ==================== */
        
        /* 1. 触发器按钮 (看起来像下拉框的部分) */
        .dae-select-trigger {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: light-dark(rgba(0,0,0,0.05), rgba(255,255,255,0.08));
            border: 1px solid transparent;
            border-radius: 8px;
            padding: 6px 12px;
            font-size: 13px;
            color: var(--gc-card-text-primary);
            cursor: pointer;
            /* 将 min-width 改为固定 width，确保宽度始终一致 */
            width: 150px; 
            transition: all 0.2s;
            user-select: none;
            position: relative;
        }
        
        .dae-select-trigger:hover {
            background-color: light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.12));
            border-color: var(--gc-card-border);
        }
        
        .dae-select-trigger.active {
            background-color: var(--gc-card-bg);
            border-color: #4b8bf5; /* 激活时高亮边框 */
            box-shadow: 0 0 0 2px rgba(75, 139, 245, 0.2);
        }

        .dae-select-value {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 8px;
            flex-grow: 1;
            text-align: left;
        }

        .dae-select-arrow {
            font-size: 18px;
            color: var(--gc-card-text-secondary);
            transition: transform 0.2s;
            display: flex;
            align-items: center;
        }
        
        .dae-select-trigger.active .dae-select-arrow {
            transform: rotate(180deg);
            color: #4b8bf5;
        }

        /* 2. 下拉菜单面板 (悬浮层) */
        .dae-select-dropdown {
            position: fixed; /* 全局定位，防止被父容器裁剪 */
            z-index: 10006;  /* 比设置面板(10003)高 */
            background-color: var(--gc-card-bg);
            border: 1px solid var(--gc-card-border);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 4px;
            min-width: 160px;
            /* 强制高度约束：6行完整高度 */
            max-height: 234px !important; 
            overflow-y: auto;
            opacity: 0;
            transform: scale(0.95) translateY(-5px);
            pointer-events: none;
            transition: opacity 0.15s cubic-bezier(0,0,0.2,1), transform 0.15s cubic-bezier(0,0,0.2,1);
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .dae-select-dropdown.visible {
            opacity: 1;
            transform: scale(1) translateY(0);
            pointer-events: auto;
        }

        /* 滚动条美化 */
        .dae-select-dropdown::-webkit-scrollbar { width: 4px; }
        .dae-select-dropdown::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 2px; }

        /* 3. 选项样式 */
        .dae-select-option {
            padding: 8px 12px;
            font-size: 13px;
            color: var(--gc-card-text-primary);
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.1s;
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            white-space: pre-wrap !important; 
            line-height: 1.4 !important; 
            text-align: left !important; 
            word-break: break-all !important; 
        }

        .dae-select-option:hover {
            background-color: var(--gc-btn-hover);
        }

        .dae-select-option.selected {
            color: #4b8bf5;
            font-weight: 500;
            background-color: light-dark(rgba(75, 139, 245, 0.08), rgba(75, 139, 245, 0.15));
        }

        /* 文本输入框样式 */
        .dae-setting-text-input {
            background: transparent;
            border: 1px solid var(--gc-card-border);
            color: var(--gc-card-text-primary);
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 13px;
            width: 160px;
            outline: none;
            transition: border-color 0.2s;
        }
        .dae-setting-text-input:focus {
            border-color: #4b8bf5;
        }

        /* 自定义下拉菜单 - 禁用/占位选项样式 */
        .dae-select-option.disabled-option {
            cursor: default;     /* 鼠标变回默认箭头 */
            opacity: 0.5;        /* 半透明 */
            font-style: italic;  /* 斜体提示 */
            pointer-events: none; /* [核心] 禁止一切鼠标交互(包括hover和click) */
        }
    `);

    // --- 主题定义 ---
    const ThemeFactory = (function() {
        const _m = (parts) => parts.map(p => p.trim().replace(/\n\s*/g, '')).join('');

        return {
            build: (type, ...cssModules) => ({
                type: type, // 'light' | 'dark' | 'both'
                css: _m(cssModules)
            })
        };
    })();

    const THEME_DEFS = {
        // 默认主题 (遵循 Google 原生)
        default: ThemeFactory.build('both'),

        // === 浅色系 (Light Themes) ===
        
        // 1. 暖黄护眼 (Warm Yellow)
        warm: ThemeFactory.build('light', 
            // [Base Variables]
            `body.warm-yellow-theme{color-scheme:light !important;--mat-sys-primary:#f8f0d9 !important;--mat-sys-on-primary:#5D4037 !important;--mat-sys-primary-container:#FAEFE0 !important;--mat-sys-on-primary-container:#5D4037 !important;--mat-sys-secondary:#A1887F !important;--mat-sys-on-secondary:#fff !important;--mat-sys-secondary-container:#EFEBE9 !important;--mat-sys-on-secondary-container:#5D4037 !important;--mat-sys-tertiary:#689F38 !important;--mat-sys-on-tertiary:#fff !important;--mat-sys-error:#C62828 !important;--mat-sys-on-error:#fff !important;--mat-sys-error-container:#fce8e6 !important;--mat-sys-on-error-container:#791a1a !important;--color-v3-error-container:var(--mat-sys-error-container) !important;--color-v3-error-text:#791a1a !important;--mat-sys-background:#FDF6E3 !important;--mat-sys-surface:#FDF6E3 !important;--mat-sys-surface-bright:#FEFBF3 !important;--mat-sys-surface-container:#F8f0d9 !important;--mat-sys-surface-container-high:#F3EADF !important;--mat-sys-surface-container-highest:#EDE4D5 !important;--mat-sys-surface-container-low:#FEFBF3 !important;--mat-sys-surface-container-lowest:#fff !important;--color-v3-surface:var(--mat-sys-surface) !important;--color-v3-surface-container:var(--mat-sys-surface-container) !important;--color-v3-surface-container-high:var(--mat-sys-surface-container-high) !important;--color-v3-surface-container-highest:var(--mat-sys-surface-container-highest) !important;--mat-app-background-color:var(--mat-sys-background) !important;--color-canvas-background:var(--mat-sys-background) !important;--color-v3-surface-left-nav:#f8f0d9 !important;--mat-sys-on-background:#4F4A45 !important;--mat-sys-on-surface:#4F4A45 !important;--mat-sys-on-surface-variant:#655F5A !important;--color-v3-text:var(--mat-sys-on-surface) !important;--color-v3-text-var:var(--mat-sys-on-surface-variant) !important;--color-v3-text-on-button:var(--mat-sys-on-primary) !important;--color-v3-text-link:#B7410E !important;--mat-app-text-color:var(--mat-sys-on-surface) !important;--mat-sys-outline:#DCD5C9 !important;--mat-sys-outline-variant:#CEC8BD !important;--color-v3-outline:var(--mat-sys-outline) !important;--color-v3-outline-var:var(--mat-sys-outline-variant) !important;--color-v3-button-container:var(--mat-sys-primary) !important;--color-v3-button-container-high:#f3e7c4 !important;--color-v3-button-container-highest:#f3e7c4 !important;--color-v3-hover:#F8F0D9 !important;background-color:var(--mat-sys-background) !important;color:var(--mat-sys-on-background) !important}`,
            // [UI Overrides]
            `.warm-yellow-theme ms-right-side-panel,.warm-yellow-theme .mat-mdc-row:hover,.warm-yellow-theme .prompt-input-wrapper{background:#f8f0d9 !important}`,
            `.warm-yellow-theme .run-button,.warm-yellow-theme mat-expansion-panel-header:hover{background:#f3e7c4 !important}`,
            `.warm-yellow-theme .mat-mdc-row a{color:#777 !important}`,
            // [Code Syntax]
            `.warm-yellow-theme .hljs{background:#F8F0D9 !important;color:#4F4A45 !important}`,
            `.warm-yellow-theme .hljs-comment,.warm-yellow-theme .hljs-quote{color:#A08C7D !important}`,
            `.warm-yellow-theme .hljs-variable,.warm-yellow-theme .hljs-template-variable,.warm-yellow-theme .hljs-attr,.warm-yellow-theme .hljs-selector-id,.warm-yellow-theme .hljs-selector-class,.warm-yellow-theme .hljs-regexp,.warm-yellow-theme .hljs-deletion{color:#B7410E !important}`,
            `.warm-yellow-theme .hljs-number,.warm-yellow-theme .hljs-built_in,.warm-yellow-theme .hljs-literal,.warm-yellow-theme .hljs-type,.warm-yellow-theme .hljs-params,.warm-yellow-theme .hljs-meta,.warm-yellow-theme .hljs-link{color:#856b3d !important}`,
            `.warm-yellow-theme .hljs-keyword,.warm-yellow-theme .hljs-selector-tag{color:#C77800 !important}`,
            `.warm-yellow-theme .hljs-string,.warm-yellow-theme .hljs-symbol,.warm-yellow-theme .hljs-bullet,.warm-yellow-theme .hljs-addition{color:#556B2F !important}`,
            `.warm-yellow-theme .hljs-title,.warm-yellow-theme .hljs-title.function_,.warm-yellow-theme .hljs-section{color:#A67B5B !important}`,
            `.warm-yellow-theme .hljs-emphasis{font-style:italic !important}`,
            `.warm-yellow-theme .hljs-strong{font-weight:700 !important}`
        ),

        // 2. 薄荷清爽 (Mint Light)
        mintLight: ThemeFactory.build('light',
            // [Base Variables]
            `body.mint-light-theme{color-scheme:light !important;--mat-sys-primary:#eaf4f4 !important;--mat-sys-on-primary:#3b413c !important;--mat-sys-primary-container:#daf0ee !important;--mat-sys-on-primary-container:#3b413c !important;--mat-sys-secondary:#cce3de !important;--mat-sys-on-secondary:#3b413c !important;--mat-sys-secondary-container:#eaf4f4 !important;--mat-sys-on-secondary-container:#3b413c !important;--mat-sys-tertiary:#a4c3b2 !important;--mat-sys-on-tertiary:#3b413c !important;--mat-sys-error:#ff686b !important;--mat-sys-on-error:#fff !important;--mat-sys-background:#f6fff8 !important;--mat-sys-surface:#f6fff8 !important;--mat-sys-surface-bright:#f6fff8 !important;--mat-sys-surface-container:#eaf4f4 !important;--mat-sys-surface-container-high:#daf0ee !important;--mat-sys-surface-container-highest:#cce3de !important;--mat-sys-surface-container-low:#f6fff8 !important;--mat-sys-surface-container-lowest:#f6fff8 !important;--color-v3-surface:var(--mat-sys-background) !important;--mat-app-background-color:var(--mat-sys-background) !important;--color-canvas-background:var(--mat-sys-background) !important;--color-v3-surface-left-nav:#eaf4f4 !important;--mat-sys-on-background:#3b413c !important;--mat-sys-on-surface:#3b413c !important;--mat-sys-on-surface-variant:#a4c3b2 !important;--color-v3-text-link:#6b9080 !important;--mat-sys-outline:#cce3de !important;--mat-sys-outline-variant:#a4c3b2 !important;--color-v3-hover:#cce3de !important;background-color:var(--mat-sys-background) !important;color:var(--mat-sys-on-background) !important}`,
            // [UI Overrides]
            `.mint-light-theme ms-right-side-panel,.mint-light-theme .mat-mdc-row:hover,.mint-light-theme .prompt-input-wrapper{background:#eaf4f4 !important}`,
            `.mint-light-theme .run-button{background:#cce3de !important}`,
            `.mint-light-theme .mat-mdc-row a{color:#3b413c !important}`,
            // [Code Syntax]
            `.mint-light-theme .hljs{background:#eaf4f4 !important;color:#3b413c !important}`,
            `.mint-light-theme .hljs-comment,.mint-light-theme .hljs-quote{color:#aaaaaa !important;font-style:italic}`,
            `.mint-light-theme .hljs-variable,.mint-light-theme .hljs-template-variable,.mint-light-theme .hljs-attr,.mint-light-theme .hljs-selector-id,.mint-light-theme .hljs-selector-class,.mint-light-theme .hljs-regexp,.mint-light-theme .hljs-deletion{color:#3a506b !important}`,
            `.mint-light-theme .hljs-number,.mint-light-theme .hljs-built_in,.mint-light-theme .hljs-literal,.mint-light-theme .hljs-type,.mint-light-theme .hljs-params,.mint-light-theme .hljs-meta,.mint-light-theme .hljs-link{color:#ee6352 !important}`,
            `.mint-light-theme .hljs-keyword,.mint-light-theme .hljs-selector-tag{color:#0b132b !important}`,
            `.mint-light-theme .hljs-string,.mint-light-theme .hljs-symbol,.mint-light-theme .hljs-bullet,.mint-light-theme .hljs-addition{color:#448c27 !important}`,
            `.mint-light-theme .hljs-title,.mint-light-theme .hljs-title.function_,.mint-light-theme .hljs-section{color:#ed6a5e !important;font-weight:700}`,
            `.mint-light-theme .hljs-emphasis{font-style:italic !important}`,
            `.mint-light-theme .hljs-strong{font-weight:700 !important}`
        ),

        // === 深色系 (Dark Themes) ===

        // 3. Atom 极客紫 (Atom One Dark)
        atom: ThemeFactory.build('dark',
            // [Base Variables]
            `body.atom-one-dark-theme{color-scheme:dark !important;--mat-sys-primary:#528bff !important;--mat-sys-on-primary:#fff !important;--mat-sys-primary-container:#2a3a5c !important;--mat-sys-on-primary-container:#a6c8ff !important;--mat-sys-secondary:#c679dd !important;--mat-sys-on-secondary:#fff !important;--mat-sys-secondary-container:#4a2c58 !important;--mat-sys-on-secondary-container:#e0aaff !important;--mat-sys-tertiary:#97c378 !important;--mat-sys-on-tertiary:#1a2b1f !important;--mat-sys-error:#df6a73 !important;--mat-sys-on-error:#fff !important;--mat-sys-background:#282c34 !important;--mat-sys-surface:#282c34 !important;--mat-sys-surface-bright:#3d4350 !important;--mat-sys-surface-container:#21252b !important;--mat-sys-surface-container-high:#3d4350 !important;--mat-sys-surface-container-highest:#4a5160 !important;--mat-sys-surface-container-low:#292d35 !important;--mat-sys-surface-container-lowest:#272b33 !important;--color-v3-surface:var(--mat-sys-background) !important;--mat-app-background-color:var(--mat-sys-background) !important;--color-canvas-background:var(--mat-sys-background) !important;--color-v3-surface-left-nav:#21252b !important;--mat-sys-on-background:#9da5b4 !important;--mat-sys-on-surface:#9da5b4 !important;--mat-sys-on-surface-variant:#5c6370 !important;--color-v3-text-link:#528bff !important;--mat-sys-outline:#3d4350 !important;--mat-sys-outline-variant:#636e84 !important;--color-v3-hover:#3a4049 !important;background-color:var(--mat-sys-background) !important;color:var(--mat-sys-on-background) !important}`,
            // [UI Overrides]
            `.atom-one-dark-theme ms-right-side-panel,.atom-one-dark-theme .mat-mdc-row:hover,.atom-one-dark-theme .prompt-input-wrapper,.atom-one-dark-theme .hljs{background:#21252b !important}`,
            `.atom-one-dark-theme .run-button{background:#3a4049 !important}`,
            `.atom-one-dark-theme .mat-mdc-row a,.atom-one-dark-theme .hljs{color:#9da5b4 !important}`,
            // [Code Syntax]
            `.atom-one-dark-theme .hljs-comment,.atom-one-dark-theme .hljs-quote{color:#5c6370 !important}`,
            `.atom-one-dark-theme .hljs-variable,.atom-one-dark-theme .hljs-template-variable,.atom-one-dark-theme .hljs-attr,.atom-one-dark-theme .hljs-selector-id,.atom-one-dark-theme .hljs-selector-class,.atom-one-dark-theme .hljs-regexp,.atom-one-dark-theme .hljs-deletion{color:#e06c75 !important}`,
            `.atom-one-dark-theme .hljs-number,.atom-one-dark-theme .hljs-built_in,.atom-one-dark-theme .hljs-literal,.atom-one-dark-theme .hljs-type,.atom-one-dark-theme .hljs-params,.atom-one-dark-theme .hljs-meta,.atom-one-dark-theme .hljs-link{color:#d19a66 !important}`,
            `.atom-one-dark-theme .hljs-keyword,.atom-one-dark-theme .hljs-selector-tag{color:#c678dd !important}`,
            `.atom-one-dark-theme .hljs-string,.atom-one-dark-theme .hljs-symbol,.atom-one-dark-theme .hljs-bullet,.atom-one-dark-theme .hljs-addition{color:#98c379 !important}`,
            `.atom-one-dark-theme .hljs-title,.atom-one-dark-theme .hljs-title.function_,.atom-one-dark-theme .hljs-section{color:#61afef !important}`
        ),

        // 4. Monokai 经典 (Monokai)
        monokai: ThemeFactory.build('dark',
            // [Base Variables]
            `body.monokai-dark-theme{color-scheme:dark !important;--mat-sys-primary:#AE81FF !important;--mat-sys-on-primary:#272822 !important;--mat-sys-primary-container:#3D3063 !important;--mat-sys-on-primary-container:#E0CFFD !important;--mat-sys-secondary:#F92672 !important;--mat-sys-on-secondary:#fff !important;--mat-sys-secondary-container:#5D1D38 !important;--mat-sys-on-secondary-container:#F92672 !important;--mat-sys-tertiary:#A6E22E !important;--mat-sys-on-tertiary:#272822 !important;--mat-sys-error:#F92672 !important;--mat-sys-on-error:#fff !important;--mat-sys-background:#2F2F2A !important;--mat-sys-surface:#2F2F2A !important;--mat-sys-surface-bright:#49483E !important;--mat-sys-surface-container:#272822 !important;--mat-sys-surface-container-high:#49483E !important;--mat-sys-surface-container-highest:#5A5953 !important;--mat-sys-surface-container-low:#2E2F29 !important;--mat-sys-surface-container-lowest:#272822 !important;--color-v3-surface:var(--mat-sys-background) !important;--mat-app-background-color:var(--mat-sys-background) !important;--color-canvas-background:var(--mat-sys-background) !important;--color-v3-surface-left-nav:#272822 !important;--mat-sys-on-background:#afaea3 !important;--mat-sys-on-surface:#C5C8C6 !important;--mat-sys-on-surface-variant:#75715E !important;--color-v3-text-link:#66D9EF !important;--mat-sys-outline:#49483E !important;--mat-sys-outline-variant:#75715E !important;--color-v3-hover:#3E3D32 !important;background-color:var(--mat-sys-background) !important;color:var(--mat-sys-on-background) !important}`,
            // [UI Overrides]
            `.monokai-dark-theme ms-right-side-panel,.monokai-dark-theme .mat-mdc-row:hover,.monokai-dark-theme .prompt-input-wrapper,.monokai-dark-theme .hljs{background:#272822 !important}`,
            `.monokai-dark-theme .run-button{background:#3E3D32 !important}`,
            `.monokai-dark-theme .mat-mdc-row a,.monokai-dark-theme .hljs{color:#C5C8C6 !important}`,
            // [Code Syntax]
            `.monokai-dark-theme .hljs-comment,.monokai-dark-theme .hljs-quote{color:#75715e !important}`,
            `.monokai-dark-theme .hljs-variable,.monokai-dark-theme .hljs-template-variable,.monokai-dark-theme .hljs-attr,.monokai-dark-theme .hljs-selector-id,.monokai-dark-theme .hljs-selector-class,.monokai-dark-theme .hljs-regexp,.monokai-dark-theme .hljs-deletion{color:#a6e22e !important}`,
            `.monokai-dark-theme .hljs-number,.monokai-dark-theme .hljs-built_in,.monokai-dark-theme .hljs-literal,.monokai-dark-theme .hljs-type,.monokai-dark-theme .hljs-params,.monokai-dark-theme .hljs-meta,.monokai-dark-theme .hljs-link{color:#ae81ff !important}`,
            `.monokai-dark-theme .hljs-keyword,.monokai-dark-theme .hljs-selector-tag{color:#f92672 !important}`,
            `.monokai-dark-theme .hljs-string,.monokai-dark-theme .hljs-symbol,.monokai-dark-theme .hljs-bullet,.monokai-dark-theme .hljs-addition{color:#e6db74 !important}`,
            `.monokai-dark-theme .hljs-title,.monokai-dark-theme .hljs-title.function_,.monokai-dark-theme .hljs-section{color:#66d9ef !important}`
        ),

        // 5. Dracula 吸血鬼 (Dracula)
        dracula: ThemeFactory.build('dark',
            // [Base Variables]
            `body.dracula-dark-theme{color-scheme:dark !important;--mat-sys-primary:#bd93f9 !important;--mat-sys-on-primary:#282a36 !important;--mat-sys-primary-container:#4c396e !important;--mat-sys-on-primary-container:#e0b3ff !important;--mat-sys-secondary:#8be9fd !important;--mat-sys-on-secondary:#282a36 !important;--mat-sys-secondary-container:#2a505c !important;--mat-sys-on-secondary-container:#b5ffff !important;--mat-sys-tertiary:#50fa7b !important;--mat-sys-on-tertiary:#282a36 !important;--mat-sys-error:#ff5555 !important;--mat-sys-on-error:#fff !important;--mat-sys-background:#353746 !important;--mat-sys-surface:#353746 !important;--mat-sys-surface-bright:#44475a !important;--mat-sys-surface-container:#282a36 !important;--mat-sys-surface-container-high:#535870 !important;--mat-sys-surface-container-highest:#6272a4 !important;--mat-sys-surface-container-low:#353746 !important;--mat-sys-surface-container-lowest:#282a36 !important;--color-v3-surface:var(--mat-sys-background) !important;--mat-app-background-color:var(--mat-sys-background) !important;--color-canvas-background:var(--mat-sys-background) !important;--color-v3-surface-left-nav:#282a36 !important;--mat-sys-on-background:#BFC2D9 !important;--mat-sys-on-surface:#BFC2D9 !important;--mat-sys-on-surface-variant:#6272a4 !important;--color-v3-text-link:#8be9fd !important;--mat-sys-outline:#44475a !important;--mat-sys-outline-variant:#6272a4 !important;--color-v3-hover:#6272a4 !important;background-color:var(--mat-sys-background) !important;color:var(--mat-sys-on-background) !important}`,
            // [UI Overrides]
            `.dracula-dark-theme ms-right-side-panel,.dracula-dark-theme .mat-mdc-row:hover,.dracula-dark-theme .prompt-input-wrapper,.dracula-dark-theme .hljs{background:#282a36 !important}`,
            `.dracula-dark-theme .run-button{background:#6272a4 !important}`,
            `.dracula-dark-theme .mat-mdc-row a,.dracula-dark-theme .hljs{color:#BFC2D9 !important}`,
            // [Code Syntax]
            `.dracula-dark-theme .hljs-comment,.dracula-dark-theme .hljs-quote{color:#6272a4 !important}`,
            `.dracula-dark-theme .hljs-variable,.dracula-dark-theme .hljs-template-variable,.dracula-dark-theme .hljs-attr,.dracula-dark-theme .hljs-selector-id,.dracula-dark-theme .hljs-selector-class,.dracula-dark-theme .hljs-regexp,.dracula-dark-theme .hljs-deletion{color:#ffb86c !important}`,
            `.dracula-dark-theme .hljs-number,.dracula-dark-theme .hljs-built_in,.dracula-dark-theme .hljs-literal,.dracula-dark-theme .hljs-type,.dracula-dark-theme .hljs-params,.dracula-dark-theme .hljs-meta,.dracula-dark-theme .hljs-link{color:#bd93f9 !important}`,
            `.dracula-dark-theme .hljs-keyword,.dracula-dark-theme .hljs-selector-tag{color:#ff79c6 !important}`,
            `.dracula-dark-theme .hljs-string,.dracula-dark-theme .hljs-symbol,.dracula-dark-theme .hljs-bullet,.dracula-dark-theme .hljs-addition{color:#f1fa8c !important}`,
            `.dracula-dark-theme .hljs-title,.dracula-dark-theme .hljs-title.function_,.dracula-dark-theme .hljs-section{color:#50fa7b !important}`
        )
    };

    // 辅助函数 - 可复用的工具函数

    // 在窄屏临时聊天模式下，将清除按钮插入"更多工具"菜单
    // （目前无用）
    function insertButtonAfterCompareInMenu() {
        // 先移除所有已存在的按钮
        removeAllClearButtons();

        // 寻找在菜单中的"比较模式"按钮
        const compareButtonInMenu = document.querySelector('.mat-mdc-menu-content button[data-test-compare]');

        if (compareButtonInMenu) {
            const menuContent = compareButtonInMenu.closest('.mat-mdc-menu-content');
            if (!menuContent) {
                console.warn('[Gemini 对话清除器] 找到了菜单中的比较按钮，但无法找到其父菜单容器。');
                return;
            }

            const newButton = createMenuItemButton();

            // 插入到"比较模式"按钮之后
            if (compareButtonInMenu.nextSibling) {
                menuContent.insertBefore(newButton, compareButtonInMenu.nextSibling);
            } else {
                menuContent.appendChild(newButton);
            }

            updateClearButtonState(newButton);
            console.log('[Gemini 对话清除器] 已在"更多工具"菜单中插入清除按钮。');
        }
    }

    // 点击所有匹配给定 CSS 选择器的元素
    function clickAllElements(selector) {
        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                console.warn(`[Gemini 对话清除器] 未找到选择器对应的元素: ${selector}`);
                return;
            }
            elements.forEach(element => {
                element.click();
            });
            console.log(`[Gemini 对话清除器] 为选择器 ${selector} 点击了 ${elements.length} 个元素`);
        } catch (error) {
            console.error(`[Gemini 对话清除器] 为选择器 ${selector} 点击元素时出错:`, error);
        }
    }

    // 判定函数：通过图标识别删除按钮
    function clickDeleteButtonsInMenu() {
        try {
            const menuItems = document.querySelectorAll(DELETE_BUTTON_MENU_SELECTOR);
            menuItems.forEach(item => {
                const icon = item.querySelector('.material-symbols-outlined');
                // 通过图标内容 'delete' 识别，不受“删除/Delete”文字影响
                if (icon && icon.textContent.trim() === DELETE_ICON_NAME) {
                    item.click();
                    console.log('[Gemini 对话清除器] 已点击删除按钮');
                }
            });
        } catch (error) {
            console.error('[Gemini 对话清除器] 识别菜单按钮失败:', error);
        }
    }

    // 检查当前是否处于临时聊天状态
    function isIncognitoMode() {
        return document.querySelector(INCOGNITO_INDICATOR_SELECTOR) !== null;
    }

    // 根据是否存在对话回合，更新按钮的启用/禁用状态
    function updateClearButtonState(button) {
        if (!button) return;

        const saveButton = document.querySelector('button[data-test-manual-save]');
        let isSaving = false;

        if (saveButton) {
            const saveButtonText = saveButton.textContent;
            isSaving = saveButtonText.includes('正在保存') || saveButtonText.includes('Saving to Drive');
        }

        const hasChatTurns = document.querySelector(CHAT_TURN_OPTIONS_SELECTOR) !== null;

        // 更新按钮状态
        if (!hasChatTurns || isSaving) {
            button.disabled = true;
            button.setAttribute('aria-disabled', 'true');
        } else {
            button.disabled = false;
            button.setAttribute('aria-disabled', 'false');
        }
    }

    // 辅助函数：向上查找，直到找到指定容器的直接子元素
    function findDirectChild(container, node) {
        if (!container || !node) return null;
        let current = node;
        while (current && current.parentElement !== container) {
            current = current.parentElement;
        }
        return current; // 如果找到了直接子元素，返回它；否则返回 null
    }

    // --- 主题引擎逻辑 ---
    
    // --- 智能主题引擎 ---

    // 预先缓存所有自定义主题的类名，避免重复正则匹配
    const ALL_THEME_CLASSES = [];
    for (const key in THEME_DEFS) {
        if (THEME_DEFS[key].css) {
            const match = THEME_DEFS[key].css.match(/body\.([a-zA-Z0-9-]+)/);
            if (match) ALL_THEME_CLASSES.push(match[1]);
        }
    }
    
    // 判断当前页面是否处于深色模式
    function isCurrentDarkMode() {
        // Google AI Studio 通常在 body 上使用 class="dark-theme"
        if (document.body.classList.contains('dark-theme')) return true;
        if (document.body.classList.contains('light-theme')) return false;
        
        // 如果没有类名，则检测系统偏好
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 1. 初始化 CSS 注入与监听
    function initThemeSystem() {
        // 注入基础过渡动画
        GM_addStyle(`body, .mat-app-background { transition: background-color 0.3s ease, color 0.3s ease !important; }`);
        
        // 注入所有主题的 CSS
        let fullCSS = "";
        for (const key in THEME_DEFS) {
            if (THEME_DEFS[key].css) fullCSS += THEME_DEFS[key].css;
        }
        GM_addStyle(fullCSS);
        
        // 立即应用
        applyTheme();

        // 监听系统/页面变动 (防抖保护)
        let timeout;
        const safeApply = () => {
            if (timeout) cancelAnimationFrame(timeout);
            timeout = requestAnimationFrame(() => applyTheme());
        };

        // 1. 监听 class 变化 (跟随 Google 原生切换)
        const observer = new MutationObserver((mutations) => {
            // 过滤：只有当 class 属性真的变了才触发
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    safeApply();
                    break; 
                }
            }
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // 2. 监听系统深色模式切换
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', safeApply);
    }

    // 2. 应用主题
    function applyTheme() {
        const isDark = isCurrentDarkMode();
        const selection = isDark ? activeSettings.themePreferenceDark : activeSettings.themePreferenceLight;
        
        // 计算目标类名
        let targetClass = null;
        if (selection !== 'default' && THEME_DEFS[selection]) {
            const def = THEME_DEFS[selection];
            const match = def.css.match(/body\.([a-zA-Z0-9-]+)/);
            if (match) targetClass = match[1];
        }

        let hasChange = false;

        // A. 移除不该存在的类名
        ALL_THEME_CLASSES.forEach(cls => {
            if (cls !== targetClass && document.body.classList.contains(cls)) {
                document.body.classList.remove(cls);
                hasChange = true;
            }
        });

        // B. 添加应该存在的类名
        if (targetClass && !document.body.classList.contains(targetClass)) {
            document.body.classList.add(targetClass);
            hasChange = true;
        }

        // 无论类名是否变化，只要执行了 applyTheme，就说明模式可能发生了变化
        // 强制更新一次聊天气泡底色，以适配当前的 isCurrentDarkMode() 状态
        updateChatBackgroundStyles();
    }

    // --- Markdown 文本节点优化与还原 ---
    
    // 1. 正向优化函数：执行空格隔离法则
    function optimizeMarkdownText() {
        if (!activeSettings.enableBoldSpacingFix) return;

        // 内部常量定义，防止污染全局
        const TARGET_TAG = 'ms-text-chunk';
        const PROCESSED_FLAG = 'data-md-refined'; // 换个标记名
        const FIX_CLASS = 'md-bold-fix';

        document.querySelectorAll(TARGET_TAG).forEach(container => {
            // 状态检查
            if (container.hasAttribute(PROCESSED_FLAG)) {
                // 如果内容没变且已经处理过，跳过
                if (!container.textContent.includes('**')) return;
            }
            
            container.setAttribute(PROCESSED_FLAG, 'true');

            const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
            let textNode;
            const tasks = [];

            // 1. 扫描阶段
            while (textNode = walker.nextNode()) {
                // 过滤代码区域
                if (textNode.parentElement?.closest('code, pre, .inline-code')) continue;
                
                const content = textNode.nodeValue;
                if (content.includes('**')) {
                    tasks.push(textNode);
                }
            }

            // 2. 变换阶段 (从后往前替换，保证节点索引安全)
            tasks.forEach(node => {
                const rawText = node.nodeValue;
                // 核心正则：匹配加粗语法
                const regex = /\*\*([\s\S]+?)\*\*/g;
                
                let hasMatch = false;
                const fragment = document.createDocumentFragment();
                let lastIdx = 0;
                let match;

                while ((match = regex.exec(rawText)) !== null) {
                    hasMatch = true;
                    // 放入匹配前的纯文本
                    fragment.appendChild(document.createTextNode(rawText.substring(lastIdx, match.index)));

                    const boldContent = match[1].trim();
                    const beforeChar = rawText[match.index - 1] || '';
                    const afterChar = rawText[regex.lastIndex] || '';

                    // 判定法则：如果前后紧邻的是非空字符且不是标点，则补空格
                    // 正则说明：[^\s\p{P}\p{S}] 表示非空格且非标点符号
                    const needSpaceBefore = /[^\s\p{P}\p{S}]/u.test(beforeChar);
                    const needSpaceAfter = /[^\s\p{P}\p{S}]/u.test(afterChar);

                    if (needSpaceBefore) fragment.appendChild(document.createTextNode(' '));
                    
                    const strong = document.createElement('strong');
                    strong.className = FIX_CLASS;
                    strong.textContent = boldContent;
                    fragment.appendChild(strong);

                    if (needSpaceAfter) fragment.appendChild(document.createTextNode(' '));

                    lastIdx = regex.lastIndex;
                }

                if (hasMatch) {
                    fragment.appendChild(document.createTextNode(rawText.substring(lastIdx)));
                    node.replaceWith(fragment);
                }
            });

            container.normalize();
        });
    }

    // [重构] 还原逻辑
    function restoreMarkdownText() {
        console.log('[Gemini 优化] 正在重置文本格式...');
        
        // 寻找我们的新类名
        document.querySelectorAll('strong.md-bold-fix').forEach(el => {
            el.replaceWith(document.createTextNode(`**${el.textContent}**`));
        });

        // 移除新标记
        document.querySelectorAll('ms-text-chunk[data-md-refined]').forEach(chunk => {
            chunk.removeAttribute('data-md-refined');
            chunk.normalize();
        });
    }

    // --- 创建并插入设置按钮 ---
    function insertSettingsButton() {
        // 1. 检查按钮是否已在 DOM 中且显示正常
        const existingBtn = document.getElementById('dae-settings-btn');
        if (existingBtn && document.body.contains(existingBtn)) return;
        if (existingBtn) existingBtn.remove(); // 如果是游离节点，移除它

        // 2. 定位容器和参照物
        // Google 新结构： .right > ms-get-code-button > button#getCodeBtn
        const getCodeBtnInner = document.getElementById('getCodeBtn');
        const resetBtnInner = document.getElementById('resetSettingsBtn');
        
        // 如果面板没打开，这些 ID 是找不到的
        if (!getCodeBtnInner && !resetBtnInner) return;

        // 尝试找到容器 .right
        // 我们从找到的按钮向上找，找到 class 包含 'right' 的 div
        const refBtn = getCodeBtnInner || resetBtnInner;
        const container = refBtn.closest('.right');

        if (!container) return;

        // 3. 创建按钮 (保持原有样式)
        const btn = document.createElement('button');
        btn.id = 'dae-settings-btn';
        btn.setAttribute('ms-button', '');
        btn.setAttribute('variant', 'icon-borderless');
        btn.setAttribute('size', 'small'); 
        btn.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon ms-button-small';
        btn.style.marginRight = '4px';

        const icon = document.createElement('span');
        icon.className = 'material-symbols-outlined notranslate ms-button-icon-symbol ng-star-inserted';
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('data-no-translate', '1');
        icon.textContent = 'settings'; 
        btn.appendChild(icon);

        // Tooltip 逻辑
        let tooltipEl = null;
        let showTimeout = null;
        const showTooltip = () => {
            if (tooltipEl) return;
            tooltipEl = document.createElement('div');
            tooltipEl.className = 'gemini-custom-tooltip notranslate';
            tooltipEl.setAttribute('data-no-translate', '1');
            tooltipEl.textContent = protect(t('settings_tooltip'));
            document.body.appendChild(tooltipEl);
            const rect = btn.getBoundingClientRect();
            const tooltipRect = tooltipEl.getBoundingClientRect();
            const top = rect.bottom + 8;
            const left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            tooltipEl.style.top = `${top}px`;
            tooltipEl.style.left = `${left}px`;
            requestAnimationFrame(() => { if(tooltipEl) tooltipEl.classList.add('visible'); });
        };
        const hideTooltip = () => {
            clearTimeout(showTimeout);
            if (tooltipEl) { tooltipEl.remove(); tooltipEl = null; }
        };
        btn.addEventListener('mouseenter', () => { showTimeout = setTimeout(showTooltip, 100); });
        btn.addEventListener('mouseleave', hideTooltip);
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideTooltip();
            openSettingsPanel();
        });

        // 4. 寻找正确的插入点
        // 我们想插在 "获取代码" 之前。如果没获取代码，就插在 "重置" 之前。
        // 关键是：我们要找到 container 的直接子元素。
        let targetNode = null;
        if (getCodeBtnInner) {
            targetNode = findDirectChild(container, getCodeBtnInner);
        } else if (resetBtnInner) {
            targetNode = findDirectChild(container, resetBtnInner);
        }

        // 执行插入
        if (targetNode) {
            container.insertBefore(btn, targetNode);
        } else {
            // 如果实在找不到参照点，插在最前面
            container.prepend(btn);
        }
        
        console.log('[Gemini 优化] 设置按钮已成功插入');
    }

    // 创建工具栏按钮
    function createToolbarButton() {
        const button = document.createElement('button');
        button.id = 'gemini-cleaner-toolbar-btn';

        // --- 1:1 复刻原生属性 ---
        button.setAttribute('ms-button', '');
        button.setAttribute('variant', 'icon-borderless'); // 关键：决定了无边框样式
        // 关键类名：ms-button-borderless 和 ms-button-icon 决定了尺寸和交互行为
        button.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon ng-star-inserted';
        button.setAttribute('aria-label', 'Clear chat');
        button.setAttribute('aria-disabled', 'false');
        // 移除左边距，保持原生间距
        button.style.marginLeft = '0';

        // --- 图标结构 ---
        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined notranslate ms-button-icon-symbol ng-star-inserted';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.setAttribute('data-no-translate', '1');
        iconSpan.textContent = 'refresh'; // 或 'delete'

        button.appendChild(iconSpan);

        // --- 事件监听 ---
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            hideTooltip();
            main(event);
        });

        // --- Tooltip 逻辑 (保持不变，用于复刻原生视觉) ---
        let tooltipEl = null;
        let showTimeout = null;

        const showTooltip = () => {
            if (tooltipEl) return;
            tooltipEl = document.createElement('div');
            tooltipEl.className = 'gemini-custom-tooltip';
            tooltipEl.textContent = protect(t('clear_tooltip'));
            document.body.appendChild(tooltipEl);

            const rect = button.getBoundingClientRect();
            const tooltipRect = tooltipEl.getBoundingClientRect();

            // 4. 位置调整 (Vertical Gap)
            // rect.bottom 是按钮底部位置
            // + 4 表示向下偏移 8px。想离得远一点就改大，近一点就改小
            const top = rect.bottom + 8;

            const left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

            tooltipEl.style.top = `${top}px`;
            tooltipEl.style.left = `${left}px`;

            requestAnimationFrame(() => {
                if(tooltipEl) tooltipEl.classList.add('visible');
            });
        };

        const hideTooltip = () => {
            clearTimeout(showTimeout);
            if (tooltipEl) {
                tooltipEl.remove();
                tooltipEl = null;
            }
        };

        button.addEventListener('mouseenter', () => {
            showTimeout = setTimeout(showTooltip, 100); // 300ms 延迟模拟原生
        });
        button.addEventListener('mouseleave', hideTooltip);

        return button;
    }

    // 如果不存在 overlay container，创建一个
    function createOverlayContainer() {
        let container = document.querySelector('.cdk-overlay-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'cdk-overlay-container';
            document.body.appendChild(container);
        }
        return container;
    }

    // 创建菜单项按钮
    function createMenuItemButton() {
        // 创建按钮元素并设置属性
        const button = document.createElement('button');
        button.id = 'gemini-cleaner-menu-item';
        button.setAttribute('mat-menu-item', '');
        button.className = 'mat-mdc-menu-item mat-focus-indicator icon-text-button ng-star-inserted';
        button.setAttribute('role', 'menuitem');
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            main(event);
        });

        // 创建文本容器和图标
        const itemTextSpan = document.createElement('span');
        itemTextSpan.className = 'mat-mdc-menu-item-text';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined notranslate';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.textContent = 'refresh';

        const textNode = document.createTextNode('Clear chat');

        // 组装元素结构
        itemTextSpan.appendChild(iconSpan);
        itemTextSpan.appendChild(textNode);
        button.appendChild(itemTextSpan);

        // 添加涟漪效果
        const rippleDiv = document.createElement('div');
        rippleDiv.className = 'mat-ripple mat-mdc-menu-ripple';
        rippleDiv.setAttribute('matripple', '');
        button.appendChild(rippleDiv);

        return button;
    }

    // 移除所有清除按钮(工具栏和菜单)
    function removeAllClearButtons() {
        const toolbarBtn = document.getElementById('gemini-cleaner-toolbar-btn');
        const menuBtn = document.getElementById('gemini-cleaner-menu-item');

        if (toolbarBtn) {
            toolbarBtn.remove();
            console.log('[Gemini 对话清除器] 已移除工具栏按钮');
        }
        if (menuBtn) {
            menuBtn.remove();
            console.log('[Gemini 对话清除器] 已移除菜单按钮');
        }
    }

    // 在工具栏上插入清除按钮
    function insertToolbarButton() {
        // 先移除所有已存在的按钮
        removeAllClearButtons();

        const toolbar = document.querySelector(TOOLBAR_RIGHT_SELECTOR);
        if (!toolbar) {
            // [调试] 暂时不报错，因为加载初期可能确实没有
            return;
        }

        const newButton = createToolbarButton();

        // 优先寻找 "更多" 按钮 (iconname="more_vert")
        const moreButton = toolbar.querySelector('button[iconname="more_vert"]');
        
        // 其次寻找 "添加/新聊天" 按钮 (iconname="add") - 你的 HTML 片段里有这个
        const addButton = toolbar.querySelector('button[iconname="add"]');

        // 决定插入位置：更多 > 添加 > 比较 > 分享 > 末尾
        if (moreButton) {
            toolbar.insertBefore(newButton, moreButton);
        } else if (addButton) {
            // 如果只有添加按钮，插在添加按钮前面会比较符合直觉
            toolbar.insertBefore(newButton, addButton);
        } else {
            // 否则直接追加到末尾
            toolbar.appendChild(newButton);
        }
        
        console.log('[Gemini 对话清除器] 工具栏按钮已重新插入');

        updateClearButtonState(newButton);
    }

    // 在菜单中插入清除按钮
    // （目前无用）
    function insertMenuButton() {
        // 先移除所有已存在的按钮
        removeAllClearButtons();

        const saveButton = document.querySelector('.mat-mdc-menu-content button[data-test-manual-save]');
        if (!saveButton) {
            return;
        }

        const menuContent = saveButton.closest('.mat-mdc-menu-content');
        if (!menuContent) {
            return;
        }

        const newButton = createMenuItemButton();

        // 插入到保存按钮之后
        if (saveButton.nextSibling) {
            menuContent.insertBefore(newButton, saveButton.nextSibling);
        } else {
            menuContent.appendChild(newButton);
        }

        updateClearButtonState(newButton);
        console.log('[Gemini 对话清除器] 菜单按钮已插入');
    }

    // --- 打开设置面板 ---
    function openSettingsPanel() {
        // 获取当前是否为移动端
        const isMobile = window.innerWidth < 768;

        const backdrop = document.createElement('div');
        backdrop.className = 'dae-settings-backdrop';
        
        const panel = document.createElement('div');
        panel.className = 'dae-settings-panel notranslate';
        panel.setAttribute('translate', 'no');
        panel.setAttribute('data-no-translate', '1');
        
        const title = document.createElement('div');
        title.className = 'dae-settings-title';
        // 添加标记
        title.setAttribute('data-i18n-key', 'settings_title');
        title.textContent = protect(t('settings_title'));
        
        const list = document.createElement('div');
        list.className = 'dae-settings-list';

        // 移动端滚动时自动清除 Tooltip 和 图标高亮
        list.addEventListener('scroll', () => {
            // 1. 隐藏悬浮提示框 (调用已有的 hideTooltip 函数)
            hideTooltip();

            // 2. 找到所有激活状态的 info 图标，取消激活样式
            const activeIcons = list.querySelectorAll('.dae-info-icon.active');
            activeIcons.forEach(icon => {
                icon.classList.remove('active');
            });
        }, { passive: true }); // 使用 passive 提升滚动性能

        // ================= [Step C 插入开始] =================
        
        // --- 调色板管理逻辑 ---
        let currentPalette = null;
        let activeMenuBtn = null; // 记录当前哪个按钮激活了调色板

        // 关闭调色板函数
        const closePalette = () => {
            if (currentPalette) {
                currentPalette.remove();
                currentPalette = null;
            }
            if (activeMenuBtn) {
                activeMenuBtn.classList.remove('active'); // 移除按钮的高亮状态
                activeMenuBtn = null;
            }
        };

        // 切换调色板函数
        const toggleColorPicker = (settingKey, defaultVal, triggerBtn, paletteTitle, showAlphaSlider, onUpdateCallback) => {
            // 注入补丁样式 (仅执行一次)
            const PATCH_STYLE_ID = 'dae-palette-ui-patch';
            if (!document.getElementById(PATCH_STYLE_ID)) {
                const s = document.createElement('style');
                s.id = PATCH_STYLE_ID;
                s.textContent = `
                    .dae-palette-mode-title { display: flex; justify-content: space-between; align-items: center; }
                    .dae-mini-reset-btn {
                        font-size: 12px !important;
                        font-weight: 400; 
                        line-height: 1;
                        color: var(--gc-card-text-secondary);
                        background: transparent;
                        border: 1px solid var(--gc-card-border);
                        border-radius: 10px; 
                        padding: 2px 8px; /* 同时也调小内边距，让按钮更精致 */
                        cursor: pointer; 
                        transition: all 0.2s;
                    }
                    .dae-mini-reset-btn:hover {
                        background-color: var(--gc-btn-hover);
                        color: var(--gc-card-text-primary);
                    }
                `;
                document.head.appendChild(s);
            }

            // 1. 如果点击的是当前已打开的按钮，则关闭
            if (activeMenuBtn === triggerBtn && currentPalette) {
                closePalette();
                return;
            }
            
            // 2. 如果已打开其他按钮的调色板，先关闭旧的
            closePalette();

            // 3. 标记当前按钮为激活状态
            activeMenuBtn = triggerBtn;
            triggerBtn.classList.add('active');

            // 4. 创建调色板 DOM
            const palette = document.createElement('div');
            palette.className = 'dae-color-palette-panel notranslate';
            palette.setAttribute('data-no-translate', '1');
            
            // 判断是否为"底色"类型的调色板
            const isBgColorPicker = settingKey.includes('BgColor');
            
            if (isBgColorPicker) {
                // 双模式调色板布局 (分离恢复按钮 + 去除底部线条)
                const isUserBg = settingKey.includes('user');
                const lightKey = isUserBg ? 'userBgColorLight' : 'modelBgColorLight';
                const darkKey = isUserBg ? 'userBgColorDark' : 'modelBgColorDark';
                const lightDefault = isUserBg ? 'rgba(0, 120, 212, 0.15)' : 'rgba(0, 168, 107, 0.15)';
                const darkDefault = isUserBg ? 'rgba(0, 120, 212, 0.15)' : 'rgba(0, 168, 107, 0.15)';
                
                const lightColor = parseRgbaColor(activeSettings[lightKey] || lightDefault);
                const darkColor = parseRgbaColor(activeSettings[darkKey] || darkDefault);
                
                palette.innerHTML = `
                    <div class="dae-palette-header">
                        <span>${protect(t(paletteTitle))}</span>
                    </div>
                    
                    <!-- 浅色模式区 -->
                    <div class="dae-palette-mode-section">
                        <div class="dae-palette-mode-title">
                            <span>${protect(t('palette_light_mode'))}</span>
                            <button class="dae-mini-reset-btn light-reset-btn" title="${protect(t('tip_reset'))}">${protect(t('palette_reset'))}</button>
                        </div>
                        <div class="dae-palette-row">
                            <span>${protect(t('palette_color'))}</span>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <input type="text" class="dae-hex-input light-hex" value="${lightColor.hex}">
                                <input type="color" class="dae-color-input light-color" value="${lightColor.hex}">
                            </div>
                        </div>
                        <div class="dae-palette-row" style="flex-direction:column;align-items:flex-start;gap:8px; margin-top:8px;">
                            <div style="display:flex;justify-content:space-between;width:100%">
                                <span>${protect(t('palette_alpha'))}</span>
                                <span class="alpha-value light-alpha">${Math.round(lightColor.alpha * 100)}%</span>
                            </div>
                            <input type="range" class="dae-alpha-slider light-slider" min="0" max="1" step="0.01" value="${lightColor.alpha}">
                        </div>
                    </div>
                    
                    <!-- 深色模式区 (强制去除底部边框) -->
                    <div class="dae-palette-mode-section" style="border-bottom: none !important;">
                        <div class="dae-palette-mode-title">
                            <span>${protect(t('palette_dark_mode'))}</span>
                            <button class="dae-mini-reset-btn dark-reset-btn" title="${protect(t('tip_reset'))}">${protect(t('palette_reset'))}</button>
                        </div>
                        <div class="dae-palette-row">
                            <span>${protect(t('palette_color'))}</span>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <input type="text" class="dae-hex-input dark-hex" value="${darkColor.hex}">
                                <input type="color" class="dae-color-input dark-color" value="${darkColor.hex}">
                            </div>
                        </div>
                        <div class="dae-palette-row" style="flex-direction:column;align-items:flex-start;gap:8px; margin-top:8px;">
                            <div style="display:flex;justify-content:space-between;width:100%">
                                <span>${protect(t('palette_alpha'))}</span>
                                <span class="alpha-value dark-alpha">${Math.round(darkColor.alpha * 100)}%</span>
                            </div>
                            <input type="range" class="dae-alpha-slider dark-slider" min="0" max="1" step="0.01" value="${darkColor.alpha}">
                        </div>
                    </div>

                    <div class="dae-palette-actions">
                        <!-- 这里的全局恢复默认按钮已移除 -->
                        <button class="dae-palette-btn confirm-btn" style="margin-left: auto;">${protect(t('palette_confirm'))}</button>
                    </div>
                `;
            } else {
                // [保持] 单模式调色板逻辑 (用于主题背景色)
                const currentRgba = activeSettings[settingKey] || defaultVal;
                const parsed = parseRgbaColor(currentRgba);
                
                const alphaRowHtml = showAlphaSlider !== false ? `
                    <div class="dae-palette-row" style="flex-direction:column;align-items:flex-start;gap:8px; margin-top:8px;">
                        <div style="display:flex;justify-content:space-between;width:100%">
                            <span>${protect(t('palette_alpha'))}</span>
                            <span class="alpha-value">${Math.round(parsed.alpha * 100)}%</span>
                        </div>
                        <input type="range" class="dae-alpha-slider" min="0" max="1" step="0.01" value="${parsed.alpha}">
                    </div>
                ` : '';
                
                palette.innerHTML = `
                    <div class="dae-palette-header">
                        <span>${protect(t(paletteTitle))}</span>
                    </div>
                    
                    <div class="dae-palette-row">
                        <span>${protect(t('palette_color'))}</span>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <input type="text" class="dae-hex-input" value="${parsed.hex}">
                            <input type="color" class="dae-color-input" value="${parsed.hex}">
                        </div>
                    </div>
                    
                    ${alphaRowHtml}

                    <div class="dae-palette-actions">
                        <button class="dae-palette-btn reset-btn">${protect(t('palette_reset'))}</button>
                        <button class="dae-palette-btn confirm-btn">${protect(t('palette_confirm'))}</button>
                    </div>
                `;
            }

            document.body.appendChild(palette);
            currentPalette = palette;

            // 5. 定位逻辑
            if (window.innerWidth < 768) {
                // === 移动端逻辑 ===
                palette.style.position = 'fixed';
                palette.style.top = '50%';
                palette.style.left = '50%';
                palette.style.transform = 'translate(-50%, -50%)';
                // 确保 z-index 高于设置面板(10003)
                palette.style.zIndex = '10006'; 
                // 防止宽度溢出屏幕
                palette.style.maxWidth = '90vw'; 
            } else {
                // === 电脑端逻辑 (保持原样) ===
                const panel = document.querySelector('.dae-settings-panel');
                const settingsRect = panel ? panel.getBoundingClientRect() : { right: 0, left: 0 }; 
                const paletteRect = palette.getBoundingClientRect();
                
                let left = settingsRect.right + 12;
                let top = triggerBtn.getBoundingClientRect().top - 20;

                // 边界检测
                if (left + paletteRect.width > window.innerWidth) {
                    left = settingsRect.left - paletteRect.width - 12;
                }
                if (top + paletteRect.height > window.innerHeight) {
                    top = window.innerHeight - paletteRect.height - 20;
                }

                palette.style.left = `${left}px`;
                palette.style.top = `${top}px`;
            }

            // 6. 绑定交互事件
            if (isBgColorPicker) {
                // === 双模式调色板事件处理 ===
                const isUserBg = settingKey.includes('user');
                const lightKey = isUserBg ? 'userBgColorLight' : 'modelBgColorLight';
                const darkKey = isUserBg ? 'userBgColorDark' : 'modelBgColorDark';
                const lightDefault = isUserBg ? 'rgba(0, 120, 212, 0.15)' : 'rgba(0, 168, 107, 0.15)';
                const darkDefault = isUserBg ? 'rgba(0, 120, 212, 0.15)' : 'rgba(0, 168, 107, 0.15)';
                
                // 控件引用
                const lightColorInput = palette.querySelector('.light-color');
                const lightHexInput = palette.querySelector('.light-hex');
                const lightSlider = palette.querySelector('.light-slider');
                const lightAlpha = palette.querySelector('.light-alpha');
                
                const darkColorInput = palette.querySelector('.dark-color');
                const darkHexInput = palette.querySelector('.dark-hex');
                const darkSlider = palette.querySelector('.dark-slider');
                const darkAlpha = palette.querySelector('.dark-alpha');
                
                // 更新函数
                const updateLight = () => {
                    const hex = lightColorInput.value;
                    const alpha = lightSlider.value;
                    const newRgba = hexToRgbaStr(hex, alpha);
                    activeSettings[lightKey] = newRgba;
                    updateChatBackgroundStyles();
                    lightHexInput.value = hex;
                    lightAlpha.textContent = Math.round(alpha * 100) + '%';
                };
                
                const updateDark = () => {
                    const hex = darkColorInput.value;
                    const alpha = darkSlider.value;
                    const newRgba = hexToRgbaStr(hex, alpha);
                    activeSettings[darkKey] = newRgba;
                    updateChatBackgroundStyles();
                    darkHexInput.value = hex;
                    darkAlpha.textContent = Math.round(alpha * 100) + '%';
                };
                
                // 绑定输入事件
                lightColorInput.addEventListener('input', updateLight);
                lightSlider.addEventListener('input', updateLight);
                lightHexInput.addEventListener('change', () => {
                    let val = lightHexInput.value;
                    if (!val.startsWith('#')) val = '#' + val;
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                        lightColorInput.value = val;
                        updateLight();
                    }
                });
                
                darkColorInput.addEventListener('input', updateDark);
                darkSlider.addEventListener('input', updateDark);
                darkHexInput.addEventListener('change', () => {
                    let val = darkHexInput.value;
                    if (!val.startsWith('#')) val = '#' + val;
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                        darkColorInput.value = val;
                        updateDark();
                    }
                });
                
                // 独立的恢复默认按钮逻辑
                const lightResetBtn = palette.querySelector('.light-reset-btn');
                lightResetBtn.addEventListener('click', () => {
                    const lightDef = parseRgbaColor(lightDefault);
                    lightColorInput.value = lightDef.hex;
                    lightSlider.value = lightDef.alpha;
                    updateLight();
                });

                const darkResetBtn = palette.querySelector('.dark-reset-btn');
                darkResetBtn.addEventListener('click', () => {
                    const darkDef = parseRgbaColor(darkDefault);
                    darkColorInput.value = darkDef.hex;
                    darkSlider.value = darkDef.alpha;
                    updateDark();
                });
            } else {
                // === 单模式调色板事件处理 ===
                const colorInput = palette.querySelector('.dae-color-input');
                const hexInput = palette.querySelector('.dae-hex-input');
                const alphaSlider = palette.querySelector('.dae-alpha-slider');
                const alphaDisplay = palette.querySelector('.alpha-value');
                
                const updateColor = () => {
                    const hex = colorInput.value;
                    const alpha = alphaSlider ? alphaSlider.value : 1;
                    const newRgba = hexToRgbaStr(hex, alpha);
                    activeSettings[settingKey] = newRgba;
                    if (onUpdateCallback) onUpdateCallback();
                    else updateChatBackgroundStyles();
                    
                    hexInput.value = hex;
                    if (alphaDisplay) alphaDisplay.textContent = Math.round(alpha * 100) + '%';
                };

                colorInput.addEventListener('input', updateColor);
                if (alphaSlider) alphaSlider.addEventListener('input', updateColor);
                
                hexInput.addEventListener('change', () => {
                    let val = hexInput.value;
                    if (!val.startsWith('#')) val = '#' + val;
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                        colorInput.value = val;
                        updateColor();
                    }
                });

                const resetBtn = palette.querySelector('.reset-btn');
                resetBtn.addEventListener('click', () => {
                    const def = parseRgbaColor(defaultVal);
                    colorInput.value = def.hex;
                    if (alphaSlider) alphaSlider.value = def.alpha;
                    updateColor();
                });
            }
            
            // 确认按钮 (关闭调色板)
            const confirmBtn = palette.querySelector('.confirm-btn');
            confirmBtn.addEventListener('click', closePalette);
        };
        // ================= [Step C 插入结束] =================


        // --- Tooltip 管理逻辑 ---
        let currentTooltip = null;

        const showTooltip = (targetEl, text) => {
            if (currentTooltip) currentTooltip.remove();

            const tooltip = document.createElement('div');
            tooltip.className = 'dae-setting-popup-tooltip notranslate';
            tooltip.setAttribute('data-no-translate', '1');
            tooltip.textContent = text;
            document.body.appendChild(tooltip);

            const rect = targetEl.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            // 优先显示在上方
            let top = rect.top - tooltip.offsetHeight - 8;
            // 居中对齐图标
            let left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2);
            
            // 边界检测
            if (top < 10) top = rect.bottom + 10;
            if (left < 10) left = 10;
            if (left + tooltip.offsetWidth > window.innerWidth - 10) {
                left = window.innerWidth - tooltip.offsetWidth - 10;
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;

            requestAnimationFrame(() => tooltip.classList.add('visible'));
            currentTooltip = tooltip;
        };

        const hideTooltip = () => {
            if (currentTooltip) {
                currentTooltip.classList.remove('visible');
                const el = currentTooltip;
                setTimeout(() => el.remove(), 150);
                currentTooltip = null;
            }
            // 移除所有图标的高亮状态
            document.querySelectorAll('.dae-info-icon.active').forEach(el => el.classList.remove('active'));
        };

        const toggleSubOption = (parentKey, childKey, show) => {
            const childRow = document.getElementById(`dae-row-${childKey}`);
            if (childRow) {
                childRow.style.display = show ? 'flex' : 'none';
            }
        };

        // 根据当前模式，动态计算下拉框选项和绑定Key
        const isDarkNow = isCurrentDarkMode();
        
        // 1. 动态构建选项列表 (只显示符合当前模式的主题)
        let dynamicThemeOptions = [
            { val: 'default', label: 'theme_default' } // 默认选项永远存在
        ];
        
        for (const key in THEME_DEFS) {
            if (key === 'default') continue;
            const def = THEME_DEFS[key];
            // 如果是深色模式且主题也是深色，或者浅色模式且主题也是浅色，则加入列表
            if ((isDarkNow && def.type === 'dark') || (!isDarkNow && def.type === 'light')) {
                dynamicThemeOptions.push({ val: key, label: 'theme_' + key });
            }
        }
        
        // 2. 动态绑定存储 Key (深色模式读写 themePreferenceDark，浅色读写 themePreferenceLight)
        const dynamicThemeKey = isDarkNow ? 'themePreferenceDark' : 'themePreferenceLight';

        // --- 配置项 ---
        const settingsConfig = [
            { type: 'header', label: 'settings_group_ui' },
        
            // === 智能主题选择器 (动态 Key + 动态 Options) ===
            { 
                key: dynamicThemeKey, 
                label: 'lbl_theme_select', 
                tooltip: 'tip_theme_select',
                type: 'select', 
                options: dynamicThemeOptions, 
                // [标记] 告诉渲染器我们要在这里加自定义按钮
                hasRootBgPicker: true, 
                action: () => {
                    GM_setValue(dynamicThemeKey, activeSettings[dynamicThemeKey]);
                    applyTheme();
                    // 切换主题时，控制按钮的显示/隐藏
                    const row = document.getElementById(`dae-row-${dynamicThemeKey}`);
                    const customBtn = row ? row.querySelector('.dae-root-bg-btn') : null;
                    if (customBtn) {
                        // 只有 Default 主题才显示此按钮
                        customBtn.style.display = activeSettings[dynamicThemeKey] === 'default' ? 'inline-flex' : 'none';
                    }
                }
            },
        
            // [字体] 保留了 tip_font_size
            { key: 'chatFontSize', label: 'lbl_font_size',
              type: 'slider', min: 12, max: 16, defaultValue: 14, step: 0.5,
              action: () => updateFontSize() },
            
            // [Markdown] 保留了 tip_md_enhance
            { key: 'enableMarkdownEnhancement', label: 'lbl_md_enhance', tooltip: 'tip_md_enhance',
              action: () => updateBaseMarkdownStyle() },

            // 用户底色 (触发 updateChatBackgroundStyles)
            { key: 'enableUserColorDifference', label: 'lbl_user_color',
              action: () => updateChatBackgroundStyles(),
              hasColorPicker: true,
              colorKey: 'userBgColor'
            },

            // 模型底色
            { key: 'enableModelColorDifference', label: 'lbl_model_color',
              action: () => updateChatBackgroundStyles(),
              hasColorPicker: true,
              colorKey: 'modelBgColor'
            },

            // 保留了 tip_bold_fix
            { key: 'enableBoldSpacingFix', label: 'lbl_bold_fix', tooltip: 'tip_bold_fix',
              action: () => updateBoldFixState() },

            // 隐藏评价按钮
            { key: 'hideFeedbackButtons', label: 'lbl_hide_feedback',
              action: () => updateFeedbackButtonsVisibility() },

            // [免责声明] 移除了 tooltip
            { key: 'hideDisclaimer', label: 'lbl_disclaimer', 
              action: () => updateDisclaimerVisibility() },
            
            // [API 隐藏] 移除了 tooltip: 'tip_hide_api' 属性
            // 这样界面上就不会出现那个显示 broken key 的图标了
            { key: 'hideApiKeyInput', label: 'lbl_hide_api_key_input',
              action: () => updateApiKeyVisibility() },
            { key: 'hideApiKeySettings', label: 'lbl_hide_api_key_settings',
              action: () => updateApiKeyVisibility() },

            { type: 'header', label: 'settings_group_func' },
            
            // === 自动指令配置 (下拉菜单版) ===
            { 
                key: 'autoSystemInstructionName', 
                label: 'lbl_auto_instruction_mode', 
                tooltip: 'tip_auto_instruction_mode',
                type: 'select',
                // 显式禁用滚轮切换功能
                disableWheel: true, 
                options: () => {
                    // 情况 A：有存档指令
                    if (activeSettings.savedSystemInstructions && activeSettings.savedSystemInstructions.length) {
                        const list = [];
                        
                        // 动态判断：只有当前不是“未启用”状态时，才显示“关闭”选项
                        if (activeSettings.autoSystemInstructionName !== '__DISABLED__') {
                            list.push({ val: '__DISABLED__', label: 'val_off' });
                        }

                        activeSettings.savedSystemInstructions.forEach(name => {
                            list.push({ val: name, label: name }); 
                        });
                        return list;
                    } 
                    
                    // 情况 B：列表为空
                    return [{ 
                        val: '', 
                        label: 'val_empty_list', 
                        isDisabled: true 
                    }];
                },
            },
            
            // [引用] 保留 tip_quote
            { key: 'enableQuote', label: 'lbl_quote', tooltip: 'tip_quote',
              action: () => { if(!activeSettings.enableQuote) hideQuoteBtn(); } },
              
            // [转文件] 保留 tip_file_paste
            { key: 'enableAutoFilePaste', label: 'lbl_file_paste', tooltip: 'tip_file_paste' }, 
            
            // [代码粘贴] 保留 tip_code_paste
            { key: 'enableCodePaste', label: 'lbl_code_paste', tooltip: 'tip_code_paste' },
            
            // [搜索后缀] 保留 tip_search_suffix
            { key: 'showSearchSuffixBtn', label: 'lbl_show_suffix_btn', tooltip: 'tip_search_suffix',
              isHidden: isMobile, 
              action: () => {
                  if (activeSettings.showSearchSuffixBtn) {
                      injectSuffixToggle();
                  } else {
                      const btn = document.getElementById('dae-suffix-toggle-btn');
                      if (btn) btn.remove();
                      const tips = document.querySelectorAll('.gemini-custom-tooltip');
                      tips.forEach(t => t.remove());
                  }
              }
            },
            
            // [关联删除] 保留 tip_delete_associated
            { key: 'enableDeleteAssociated', label: 'lbl_delete_associated', tooltip: 'tip_delete_associated' },

            { type: 'header', label: 'settings_group_nav' },
            
            // [清空按钮] 移除了 tooltip
            { key: 'enableClearBtn', label: 'lbl_clear_btn', 
              action: () => activeSettings.enableClearBtn ? ensureCorrectButtonPlacement() : removeAllClearButtons() },
            
            // [滚动导航] 保留 tip_scroll_nav
            { key: 'enableScrollNav', label: 'lbl_scroll_nav', tooltip: 'tip_scroll_nav',
              action: () => { 
                  applyScrollNavState();
                  toggleSubOption('enableScrollNav', 'scrollNavCentered', activeSettings.enableScrollNav);
              } },
            
            // [居中] 子选项，无 tooltip
            { key: 'scrollNavCentered', label: 'lbl_scroll_center', isSub: true,
              isHidden: isMobile, 
              action: () => { if(updateScrollNavLayout) updateScrollNavLayout(); } }
        ];

        const initialSnapshot = { ...activeSettings };

        // --- 渲染循环 ---
        settingsConfig.forEach(cfg => {
            // 如果配置了 isHidden 且为 true，则跳过渲染
            if (cfg.isHidden) return;

            if (cfg.type === 'header') {
                const header = document.createElement('div');
                header.className = 'dae-settings-group-header';
                // 添加标记
                header.setAttribute('data-i18n-key', cfg.label); 
                header.textContent = protect(t(cfg.label));
                list.appendChild(header);
                return;
            }
            
            const row = document.createElement('div');
            row.className = 'dae-setting-item';
            if (cfg.isSub) row.classList.add('is-sub-item');
            row.id = `dae-row-${cfg.key}`;

            if (cfg.key === 'scrollNavCentered' && !activeSettings.enableScrollNav) {
                row.style.display = 'none';
            }

            // 左侧容器：包含文本 + 图标
            const leftWrapper = document.createElement('div');
            leftWrapper.style.display = 'flex';
            leftWrapper.style.alignItems = 'center';
            leftWrapper.style.flexGrow = '1'; // 关键：撑开剩余空间
            leftWrapper.style.marginRight = '10px';

            // 1. 文本
            const labelText = document.createElement('span');
            labelText.className = 'notranslate';
            labelText.setAttribute('data-no-translate', '1');
            // 添加标记
            labelText.setAttribute('data-i18n-key', cfg.label);
            labelText.textContent = protect(t(cfg.label));
            leftWrapper.appendChild(labelText);

            // 2. 图标 (如果有 tooltip)
            if (cfg.tooltip) {
                const icon = document.createElement('span');
                icon.className = 'material-symbols-outlined notranslate dae-info-icon';
                icon.setAttribute('aria-hidden', 'true');
                icon.setAttribute('data-no-translate', '1');
                icon.textContent = 'info';
                
                const tipText = protect(t(cfg.tooltip));
                icon.addEventListener('mouseenter', () => showTooltip(icon, tipText));
                icon.addEventListener('mouseleave', () => {
                    if (!icon.classList.contains('active')) hideTooltip();
                });
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (window.innerWidth >= 768) return;
                    const isActive = icon.classList.contains('active');
                    hideTooltip();
                    if (!isActive) {
                        icon.classList.add('active');
                        showTooltip(icon, tipText);
                    }
                });
                leftWrapper.appendChild(icon);
            }

            // [原有逻辑] 气泡颜色选择器 (保持在左侧，紧跟文字/图标)
            if (cfg.hasColorPicker) {
                const menuBtn = document.createElement('button');
                menuBtn.className = 'dae-color-menu-btn';
                menuBtn.innerHTML = '<span class="material-symbols-outlined notranslate ms-button-icon-symbol" aria-hidden="true" data-no-translate="1">menu</span>';
                menuBtn.title = protect(t('palette_color')); 
                        menuBtn.addEventListener('click', (e) => {
                            e.stopPropagation(); 
                            const titleKey = cfg.colorKey === 'userBgColor' ? 'palette_user_bg' : 'palette_model_bg';
                            toggleColorPicker(cfg.colorKey, cfg.defaultColor, menuBtn, titleKey, true, null);
                        });
                leftWrapper.appendChild(menuBtn);
            }

            // [关键步骤 1] 先将左侧容器加入行内
            // leftWrapper 具有 flex-grow: 1，它会自动占据中间所有空白，将后续元素推向最右侧
            row.appendChild(leftWrapper); 

            // ================= 插入开始 =================
            // 编辑指令名称按钮 (移至此处，位于左侧文字容器和右侧开关之间)
            if (cfg.hasEditBtn) {
                const editBtn = document.createElement('button');
                editBtn.className = 'dae-color-menu-btn'; // 复用圆形按钮样式
                editBtn.innerHTML = '<span class="material-symbols-outlined notranslate ms-button-icon-symbol" aria-hidden="true" data-no-translate="1">edit</span>';
                
                // 绑定悬停提示
                const editTip = protect(t('tip_select_instruction'));
                editBtn.addEventListener('mouseenter', () => showTooltip(editBtn, editTip));
                editBtn.addEventListener('mouseleave', () => {
                    if (!editBtn.classList.contains('active')) hideTooltip();
                });

                // 绑定点击事件
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    hideTooltip();
                    
                    const oldVal = activeSettings.autoSystemInstructionName || '';
                    const newVal = window.prompt(t('lbl_instruction_name'), oldVal);
                    
                    if (newVal !== null) {
                        const trimmed = newVal.trim();
                        activeSettings.autoSystemInstructionName = trimmed;
                        GM_setValue('autoSystemInstructionName', trimmed);
                    }
                });
                
                // 直接添加到 row 中，它会紧贴在右侧控件的左边
                row.appendChild(editBtn);
            }
            // ================= 插入结束 =================

            // [关键步骤 2] 主题背景色自定义按钮 (保持在 editBtn 之后)
            if (cfg.hasRootBgPicker) {
                const isDefaultTheme = activeSettings[cfg.key] === 'default';
                const rootBtn = document.createElement('button');
                rootBtn.className = 'dae-color-menu-btn dae-root-bg-btn'; 
                rootBtn.innerHTML = '<span class="material-symbols-outlined notranslate ms-button-icon-symbol" aria-hidden="true" data-no-translate="1">menu</span>';
                rootBtn.title = protect(t('palette_main_color'));
                rootBtn.style.display = isDefaultTheme ? 'inline-flex' : 'none';
                
                // 样式微调：为了不让它紧贴着下拉框，加一点右边距
                rootBtn.style.marginRight = '8px';

                rootBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isDark = isCurrentDarkMode();
                    const targetKey = isDark ? 'customDarkBg' : 'customLightBg';
                    // 使用修正后的默认值 (Hex 格式)
                    const targetDef = isDark ? '#141313' : 'rgb(255, 255, 255)'; 
                    
                    // 根据当前模式动态拼接标题后缀: "主背景色 [深色模式]"
                    const modeSuffix = isDark ? t('palette_dark_mode2') : t('palette_light_mode2');
                    const dynamicTitle = `${t('palette_main_color')} [${modeSuffix}]`;
                    
                    toggleColorPicker(
                        targetKey, 
                        targetDef, 
                        rootBtn, 
                        dynamicTitle,
                        false,
                        () => updateRootThemeVariables() 
                    );
                });

                // 挂载到 row 上，位置在 leftWrapper 和右侧控件之间
                row.appendChild(rootBtn); 
            }

            // 右侧控件生成逻辑：区分 Switch 和 Slider
            if (cfg.type === 'slider') {
                // === Slider 渲染逻辑 ===
                const sliderContainer = document.createElement('div');
                sliderContainer.className = 'dae-slider-container';

                const valueDisplay = document.createElement('span');
                valueDisplay.className = 'dae-slider-value';
                valueDisplay.textContent = activeSettings[cfg.key] + 'px';

                const rangeInput = document.createElement('input');
                rangeInput.type = 'range';
                rangeInput.className = 'dae-slider-input';
                rangeInput.min = cfg.min;
                rangeInput.max = cfg.max;
                rangeInput.step = cfg.step || 1; 
                rangeInput.value = activeSettings[cfg.key];

                const resetBtn = document.createElement('button');
                resetBtn.className = 'dae-slider-reset';
                resetBtn.innerHTML = '<span class="material-symbols-outlined">refresh</span>';

                const resetTipText = protect(t('tip_reset'));
                resetBtn.addEventListener('mouseenter', () => showTooltip(resetBtn, resetTipText));
                resetBtn.addEventListener('mouseleave', () => hideTooltip());

                rangeInput.addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value); 
                    activeSettings[cfg.key] = val;
                    valueDisplay.textContent = val + 'px';
                    if (cfg.action) cfg.action();
                });

                resetBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    hideTooltip();
                    const def = cfg.defaultValue || 14;
                    activeSettings[cfg.key] = def;
                    rangeInput.value = def;
                    valueDisplay.textContent = def + 'px';
                    if (cfg.action) cfg.action();
                });

                sliderContainer.appendChild(valueDisplay);
                sliderContainer.appendChild(rangeInput);
                sliderContainer.appendChild(resetBtn);
                
                row.appendChild(sliderContainer);

            } else if (cfg.type === 'select') {
                // === 自定义美化下拉菜单 (动态刷新版) ===
                
                // 辅助函数：获取实时选项列表
                // 如果 options 是函数就执行它，否则直接使用
                const getRealtimeOptions = () => {
                    return typeof cfg.options === 'function' ? cfg.options() : cfg.options;
                };

                // 1. 创建触发器按钮
                const triggerBtn = document.createElement('div');
                triggerBtn.className = 'dae-select-trigger';
                
                // 初始渲染时，也需要获取一次选项来计算 label
                const initialOptions = getRealtimeOptions();

                let displayLabel = '';
                
                // 逻辑修正：
                // 1. 优先检查“空列表”特殊状态
                if (initialOptions.length === 1 && initialOptions[0].isDisabled) {
                     displayLabel = 'val_disabled';
                }
                // 2. 检查当前值是否显式为 __DISABLED__
                else if (activeSettings[cfg.key] === '__DISABLED__') {
                    displayLabel = 'val_disabled';
                } 
                // 3. 正常查找对应选项的 label
                else {
                    const currentOpt = initialOptions.find(o => o.val === activeSettings[cfg.key]);
                    displayLabel = currentOpt ? currentOpt.label : initialOptions[0].label;
                }
                
                triggerBtn.innerHTML = `
                    <span class="dae-select-value">${protect(t(displayLabel))}</span>
                    <span class="material-symbols-outlined dae-select-arrow">keyboard_arrow_down</span>
                `;

                // 2. 创建下拉菜单容器 (Dropdown)
                let dropdownEl = null;

                const closeDropdown = () => {
                    if (dropdownEl) {
                        dropdownEl.classList.remove('visible');
                        triggerBtn.classList.remove('active');
                        setTimeout(() => {
                            if (dropdownEl && dropdownEl.parentNode) dropdownEl.remove();
                            dropdownEl = null;
                        }, 150);
                    }
                    document.removeEventListener('click', onClickOutside);
                };

                const onClickOutside = (e) => {
                    if (dropdownEl && !dropdownEl.contains(e.target) && !triggerBtn.contains(e.target)) {
                        closeDropdown();
                    }
                };

                const openDropdown = () => {
                    if (dropdownEl) {
                        closeDropdown();
                        return;
                    }
                    
                    // 每次打开时，重新获取最新的选项列表
                    const currentOptions = getRealtimeOptions();

                    dropdownEl = document.createElement('div');
                    dropdownEl.className = 'dae-select-dropdown notranslate';
                    dropdownEl.setAttribute('translate', 'no');
                    dropdownEl.setAttribute('data-no-translate', '1');
                    
                    currentOptions.forEach(opt => {
                        const optionEl = document.createElement('div');
                        optionEl.className = 'dae-select-option';
                        optionEl.textContent = protect(t(opt.label));

                        if (opt.isDisabled) {
                            optionEl.classList.add('disabled-option');
                        } else {
                            if (activeSettings[cfg.key] === opt.val) {
                                optionEl.classList.add('selected');
                            }
                            optionEl.addEventListener('click', (e) => {
                                e.stopPropagation();
                                activeSettings[cfg.key] = opt.val;
                                
                                // 点击更新 label 逻辑
                                let newLabel = opt.label;
                                if (opt.val === '__DISABLED__') {
                                    newLabel = 'val_disabled';
                                }
                                triggerBtn.querySelector('.dae-select-value').textContent = protect(t(newLabel));
                                
                                if (cfg.action) cfg.action();
                                closeDropdown();
                            });
                        }
                        dropdownEl.appendChild(optionEl);
                    });

                    document.body.appendChild(dropdownEl);

                    // 定位逻辑
                    const rect = triggerBtn.getBoundingClientRect();
                    let top = rect.bottom + 4;
                    let left = rect.left;
                    let width = rect.width;
                    // 预估高度算法，与 CSS 的 6 行限制保持同步
                    // 36px(高) + 2px(间距) = 38px，最后补足容器 Padding
                    const estimatedHeight = Math.min(currentOptions.length * 38 + 8, 234); 

                    if (top + estimatedHeight > window.innerHeight) {
                        top = rect.top - estimatedHeight - 4;
                        dropdownEl.style.transformOrigin = 'bottom center';
                    } else {
                        dropdownEl.style.transformOrigin = 'top center';
                    }

                    dropdownEl.style.top = `${top}px`;
                    dropdownEl.style.left = `${left}px`;
                    dropdownEl.style.minWidth = `${width}px`; 

                    triggerBtn.classList.add('active');
                    requestAnimationFrame(() => dropdownEl.classList.add('visible'));
                    setTimeout(() => document.addEventListener('click', onClickOutside), 0);
                };

                triggerBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openDropdown();
                });
                
                // === 滚轮切换逻辑适配 ===
                // 仅当配置中没有明确禁用滚轮时，才绑定该事件
                if (!cfg.disableWheel) {
                    triggerBtn.addEventListener('wheel', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (dropdownEl) closeDropdown();
                        
                        const currentOptions = getRealtimeOptions();
                        const validOptions = currentOptions.filter(o => !o.isDisabled);
                        if (validOptions.length === 0) return;

                        const delta = Math.sign(e.deltaY);
                        const currentIndex = validOptions.findIndex(o => o.val === activeSettings[cfg.key]);
                        
                        let nextIndex = currentIndex + (delta > 0 ? 1 : -1);
                        if (nextIndex < 0) nextIndex = 0;
                        if (nextIndex >= validOptions.length) nextIndex = validOptions.length - 1;
                        
                        if (nextIndex !== currentIndex) {
                            const targetOpt = validOptions[nextIndex];
                            activeSettings[cfg.key] = targetOpt.val;
                            
                            let newLabel = targetOpt.label;
                            if (targetOpt.val === '__DISABLED__') newLabel = 'val_disabled';
                            
                            triggerBtn.querySelector('.dae-select-value').textContent = protect(t(newLabel));
                            if (cfg.action) cfg.action();
                        }
                    });
                }

                if (!window._daeDropdownCleaners) window._daeDropdownCleaners = [];
                window._daeDropdownCleaners.push(closeDropdown);

                row.appendChild(triggerBtn);

            } else if (cfg.type === 'text') {
                // === 文本输入框渲染逻辑 ===
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'dae-setting-text-input';
                input.value = activeSettings[cfg.key];
                
                input.addEventListener('change', (e) => {
                    activeSettings[cfg.key] = e.target.value;
                    if (cfg.action) cfg.action();
                });
                
                // 阻止事件冒泡，防止触发其他点击
                input.addEventListener('click', (e) => e.stopPropagation());
                
                row.appendChild(input);

            } else {
                // === Switch 开关渲染逻辑 (原代码) ===
                const switchLabel = document.createElement('label');
                switchLabel.className = 'dae-md3-switch notranslate';
                switchLabel.setAttribute('data-no-translate', '1');
                
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = activeSettings[cfg.key];
                
                const track = document.createElement('span');
                track.className = 'dae-md3-track';
                
                const thumb = document.createElement('span');
                thumb.className = 'dae-md3-thumb';

                track.appendChild(thumb);

                input.addEventListener('change', () => {
                    activeSettings[cfg.key] = input.checked;
                    if (cfg.action) cfg.action();
                });

                switchLabel.appendChild(input);
                switchLabel.appendChild(track);
                row.appendChild(switchLabel);
            }
            
            list.appendChild(row);
        });

        // 按钮区域
        const actions = document.createElement('div');
        actions.className = 'dae-settings-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.setAttribute('ms-button', '');
        cancelBtn.setAttribute('variant', 'tonal');
        cancelBtn.setAttribute('data-no-translate', '1');
        // 添加标记
        cancelBtn.setAttribute('data-i18n-key', 'settings_cancel');
        cancelBtn.textContent = protect(t('settings_cancel'));
        Object.assign(cancelBtn.style, {
            cursor: 'pointer', border: 'none', background: 'transparent',
            color: 'var(--gc-card-text-primary)', fontWeight: '500', fontSize: '13px'
        });
        
        cancelBtn.addEventListener('click', () => {
            // 1. 回滚数据
            Object.assign(activeSettings, initialSnapshot);
            
            // 2. 恢复各模块状态
            ensureCorrectButtonPlacement();
            applyScrollNavState();
            
            // 强制重新计算滚动按钮的布局位置 (居中/居右)
            if (updateScrollNavLayout) updateScrollNavLayout();

            updateDisclaimerVisibility();
            updateFeedbackButtonsVisibility();
            updateApiKeyVisibility();
    
            // 回滚所有样式
            updateAllMarkdownStyles();
            
            // 回滚字体大小
            updateFontSize();
            if(!activeSettings.enableQuote) hideQuoteBtn();
            
            // 恢复后缀按钮状态
            if (activeSettings.showSearchSuffixBtn) {
                injectSuffixToggle();
            } else {
                const btn = document.getElementById('dae-suffix-toggle-btn');
                if (btn) btn.remove();
            }
            
            // 如果刚刚集成了主题系统，这里也需要回滚主题
            if (typeof applyTheme === 'function') applyTheme();
            
            closePanel();
        });

        
        const saveBtn = document.createElement('button');
        saveBtn.setAttribute('ms-button', '');
        saveBtn.setAttribute('variant', 'filled');
        saveBtn.setAttribute('data-no-translate', '1');
        saveBtn.className = 'mat-mdc-tooltip-trigger ms-button ms-button-filled';
            saveBtn.setAttribute('data-i18n-key', 'settings_save');
        saveBtn.textContent = protect(t('settings_save'));
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.height = '32px'; 
        saveBtn.style.fontSize = '13px';
        
        saveBtn.addEventListener('click', () => {
            for (const key in activeSettings) {
                GM_setValue(key, activeSettings[key]);
            }
            closePanel();
        });

        actions.appendChild(cancelBtn);
        actions.appendChild(saveBtn);

        panel.appendChild(title);
        panel.appendChild(list);
        panel.appendChild(actions);

        document.body.appendChild(backdrop);
        document.body.appendChild(panel);

        function closePanel() {
            hideTooltip();
            
            // 清理所有残留的下拉菜单
            if (window._daeDropdownCleaners) {
                window._daeDropdownCleaners.forEach(fn => fn());
                window._daeDropdownCleaners = [];
            }
            
            // 关闭设置面板时，必须强制关闭调色板 (保持原有)
            closePalette(); 
            
            backdrop.style.opacity = '0';
            panel.style.opacity = '0';
            panel.style.transform = 'translate(-50%, -48%) scale(0.9)';
            setTimeout(() => {
                backdrop.remove();
                panel.remove();
            }, 200);
        }

        backdrop.addEventListener('click', () => {
            cancelBtn.click();
        });

        // 全局点击关闭 Tooltip
        const onGlobalClick = (e) => {
            if (!e.target.closest('.dae-info-icon')) {
                hideTooltip();
            }
        };
        setTimeout(() => document.addEventListener('click', onGlobalClick), 50);

        const originalClose = closePanel;
        closePanel = function() {
            document.removeEventListener('click', onGlobalClick);
            originalClose();
        };
    }

    // 根据当前状态决定按钮位置
    function ensureCorrectButtonPlacement() {
        if (!activeSettings.enableClearBtn) {
            removeAllClearButtons();
            return;
        }

        const toolbar = document.querySelector('.toolbar-right');
        if (!toolbar) return; // 还没加载出来

        const existingBtn = document.getElementById('gemini-cleaner-toolbar-btn');
        // 检查按钮是否存在且真的是 toolbar 的子元素
        if (existingBtn && toolbar.contains(existingBtn)) {
            updateClearButtonState(existingBtn);
            return;
        }

        // 移除旧的/游离的按钮
        removeAllClearButtons();
        
        const newButton = createToolbarButton();

        // 应对 Google 的多层嵌套结构
        // 结构示例: .toolbar-right > .overflow-menu-wrapper > button[more_vert]
        
        // 1. 尝试找 "更多" 按钮
        const moreBtnIcon = toolbar.querySelector('button[iconname="more_vert"]');
        // 2. 尝试找 "添加" 按钮
        const addBtnIcon = toolbar.querySelector('button[iconname="add"]');
        
        let insertAnchor = null;

        if (moreBtnIcon) {
            // 找到包含这个按钮的、且是 toolbar 直接子元素的那个 div (wrapper)
            insertAnchor = findDirectChild(toolbar, moreBtnIcon);
        } 
        
        if (!insertAnchor && addBtnIcon) {
            // 如果找不到更多按钮的 wrapper，试试插在添加按钮前面
            insertAnchor = findDirectChild(toolbar, addBtnIcon);
        }

        // 执行插入
        if (insertAnchor) {
            toolbar.insertBefore(newButton, insertAnchor);
        } else {
            // 实在不行，追加到最后
            toolbar.appendChild(newButton);
        }
        
        updateClearButtonState(newButton);
        console.log('[Gemini 优化] 清空按钮已成功修正位置');
    }

    // 主执行逻辑 (增强版：带延迟补刀)
    function performClear(retryCount = 0) {
        console.log(`[Gemini 对话清除器] 执行清除 (第 ${retryCount + 1} 次尝试)`);

        // 第一阶段：立即执行
        // 现在 CHAT_TURN_OPTIONS_SELECTOR 更加权威，能精准点中按钮
        clickAllElements(CHAT_TURN_OPTIONS_SELECTOR);
        clickDeleteButtonsInMenu();

        // 第二阶段：残留检测
        if (retryCount < 5) {
            setTimeout(() => {
                const remaining = document.querySelectorAll(CHAT_TURN_OPTIONS_SELECTOR);
                if (remaining.length > 0) {
                    console.log(`[Gemini 对话清除器] 检测到 ${remaining.length} 个残留，正在补刀...`);
                    performClear(retryCount + 1);
                } else {
                    console.log('[Gemini 对话清除器] 清理完成');
                    const backdrop = document.querySelector('.cdk-overlay-backdrop');
                    if (backdrop) backdrop.click();
                }
            }, 800);
        }
    }

    function showConfirmAndRun(onConfirm, triggerBtn) {
        // 移除已存在的确认对话框
        const existed = document.getElementById('gemini-cleaner-confirm');
        if (existed) {
            existed.remove();
        }

        // 创建确认对话框容器
        const container = document.createElement('div');
        container.id = 'gemini-cleaner-confirm';
        container.className = 'mat-mdc-menu-panel ng-star-inserted';

        const panel = document.createElement('div');
        panel.className = 'mat-mdc-menu-content';

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '12px';
        wrapper.style.padding = '12px 16px';

        // 创建标题和提示文本
        const title = document.createElement('div');
        title.textContent = protect(t('confirm_title')); // 使用多语言
        title.style.fontWeight = '500';

        const hint = document.createElement('div');
        hint.textContent = protect(t('confirm_hint'));   // 使用多语言
        hint.style.opacity = '0.75';
        hint.style.fontSize = '12px';

        // 允许文本中的 \n 换行
        hint.style.whiteSpace = 'pre-wrap';

        // 创建操作按钮区域
        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '8px';
        actions.style.justifyContent = 'flex-end';

        // 创建取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.setAttribute('ms-button', '');
        cancelBtn.setAttribute('variant', 'tonal');
        cancelBtn.textContent = protect(t('confirm_btn_cancel')); // 使用多语言
        cancelBtn.addEventListener('click', () => container.remove());

        // 创建确认按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.setAttribute('ms-button', '');
        confirmBtn.setAttribute('variant', 'filled');
        confirmBtn.setAttribute('iconname', 'delete');
        confirmBtn.className = 'mat-mdc-tooltip-trigger ms-button ms-button-filled ng-star-inserted';
        confirmBtn.textContent = protect(t('confirm_btn_confirm')); // 使用多语言
        confirmBtn.addEventListener('click', () => {
            container.remove();
            onConfirm && onConfirm();

            const backdrop = document.querySelector('.cdk-overlay-backdrop');
            if (backdrop) {
                backdrop.click();
            }
        });

        // 组装按钮区域
        actions.appendChild(cancelBtn);
        actions.appendChild(confirmBtn);

        // 组装对话框结构
        wrapper.appendChild(title);
        wrapper.appendChild(hint);
        wrapper.appendChild(actions);
        panel.appendChild(wrapper);
        container.appendChild(panel);
        document.body.appendChild(container);

        // 根据触发按钮计算对话框位置
        if (triggerBtn) {
            const rect = triggerBtn.getBoundingClientRect();
            const top = rect.bottom - 2;
            const centerX = rect.left + (rect.width / 2);
            let left = Math.round(centerX - (container.offsetWidth / 2) - 2);
            left = Math.max(12, Math.min(left, window.innerWidth - 12 - container.offsetWidth));
            const clampedTop = Math.min(top, window.innerHeight - container.offsetHeight - 12);
            container.style.top = `${clampedTop}px`;
            container.style.left = `${left}px`;
        } else {
            container.style.bottom = '24px';
            container.style.right = '24px';
        }

        // 添加点击外部关闭功能
        const onOutsideClick = (ev) => {
            if (!container.contains(ev.target)) {
                container.remove();
                document.removeEventListener('mousedown', onOutsideClick, true);
            }
        };
        setTimeout(() => document.addEventListener('mousedown', onOutsideClick, true), 0);
    }

    // --- 大文本自动转文件粘贴功能 ---
    function setupPasteInterceptor() {
        const PASTE_THRESHOLD = 15000; // 触发阈值：15000字符

        document.addEventListener('paste', (event) => {
            // 0. 检查功能开关
            if (!activeSettings.enableAutoFilePaste) {
                return;
            }

            // 1. 确保目标是 prompt 输入框
            const target = event.target;
            if (!target || !target.matches || !target.matches('textarea[formcontrolname="promptText"]')) {
                return;
            }

            // 2. 获取剪贴板数据
            const clipboardData = event.clipboardData || window.clipboardData;
            if (!clipboardData) return;

            // 防止死循环：如果剪贴板里已经是文件了，忽略
            if (clipboardData.types.includes('Files')) {
                return;
            }

            // 3. 获取文本内容
            const text = clipboardData.getData('text');

            // 4. 判断长度
            if (text && text.length > PASTE_THRESHOLD) {
                console.log(`[Dae优化工具] 检测到大文本粘贴 (${text.length} 字符)，正在转换为临时文件...`);

                event.preventDefault();
                event.stopImmediatePropagation();

                try {
                    // 5. 格式化文件名：YYYY.MM.DD.HH:MM:SS.txt
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hour = String(now.getHours()).padStart(2, '0');
                    const minute = String(now.getMinutes()).padStart(2, '0');
                    const second = String(now.getSeconds()).padStart(2, '0');

                    const fileName = `${year}.${month}.${day}.${hour}:${minute}:${second}.txt`;

                    // 创建文件对象
                    const file = new File([text], fileName, { type: 'text/plain' });

                    // 6. 构造并分发新的 paste 事件
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);

                    const newEvent = new ClipboardEvent('paste', {
                        bubbles: true,
                        cancelable: true,
                        clipboardData: dataTransfer
                    });

                    target.dispatchEvent(newEvent);
                    console.log(`[Dae优化工具] 已将文本转换为文件: ${fileName}`);

                } catch (err) {
                    console.error('[Dae优化工具] 转换文件粘贴失败:', err);
                }
            }
        }, true); // useCapture = true

        console.log('[Dae优化工具] 大文本自动转文件监听器已启动');
    }

    // --- Ctrl+B 选中转文件功能 (大文本转文件的附属功能) ---
    function setupSelectionToFileHandler() {
        document.addEventListener('keydown', (event) => {
            // 0. 检查功能开关 (复用大文本转文件的开关)
            if (!activeSettings.enableAutoFilePaste) return;

            // 1. 检查快捷键 Ctrl+B (兼容 Mac Command+B)
            if (!((event.ctrlKey || event.metaKey) && (event.key === 'b' || event.code === 'KeyB'))) return;

            // 2. 检查目标元素
            const target = event.target;
            if (!target || !target.matches || !target.matches('textarea[formcontrolname="promptText"]')) {
                return;
            }

            // 3. 检查是否有选中文本
            const start = target.selectionStart;
            const end = target.selectionEnd;
            if (start === end) return; // 无选中则忽略

            // 阻止默认行为 (如加粗)
            event.preventDefault();
            event.stopImmediatePropagation();

            const selectedText = target.value.substring(start, end);

            try {
                // 4. 删除选中文本
                // 尝试使用 execCommand 'delete' 以保留撤销历史，失败则手动操作
                // if (!document.execCommand('delete')) {
                //     target.value = target.value.substring(0, start) + target.value.substring(end);
                //     target.selectionStart = target.selectionEnd = start;
                //     target.dispatchEvent(new Event('input', { bubbles: true })); // 通知 Angular 更新
                // }
                // 使用现代标准 API 删除选中文本，性能更佳
                target.setRangeText('', start, end, 'end');

                // 关键步骤：手动触发 input 事件，通知 Angular 等框架更新
                target.dispatchEvent(new Event('input', { bubbles: true }));

                console.log(`[Dae优化工具] Ctrl+B: 正在将选中内容 (${selectedText.length} 字符) 转换为文件...`);

                // 5. 构造文件对象
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const hour = String(now.getHours()).padStart(2, '0');
                const minute = String(now.getMinutes()).padStart(2, '0');
                const second = String(now.getSeconds()).padStart(2, '0');

                // 文件名前缀加个 selection 区分
                const fileName = `selection_${year}.${month}.${day}.${hour}:${minute}:${second}.txt`;
                const file = new File([selectedText], fileName, { type: 'text/plain' });

                // 6. 构造并分发 paste 事件 (带文件)
                // 注意：由于这里带了 Files，原有的 setupPasteInterceptor 会自动放行，不会死循环
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                const pasteEvent = new ClipboardEvent('paste', {
                    bubbles: true,
                    cancelable: true,
                    clipboardData: dataTransfer
                });

                target.dispatchEvent(pasteEvent);
                console.log(`[Dae优化工具] Ctrl+B: 已转换并粘贴为 ${fileName}`);

            } catch (err) {
                console.error('[Dae优化工具] Ctrl+B 转换失败:', err);
            }
        }, true); // useCapture

        console.log('[Dae优化工具] Ctrl+B 选中转文件监听器已启动');
    }

    // --- Alt+V 代码块粘贴功能 ---
    function setupCodePasteHandler() {
        document.addEventListener('keydown', async (event) => {
            // 0. 检查功能开关与快捷键 (Alt+V)
            if (!activeSettings.enableCodePaste) return;
            if (!(event.altKey && (event.key === 'v' || event.code === 'KeyV'))) return;

            // 1. 目标判定：主输入框 OR 历史记录编辑框
            const target = event.target;
            if (!target || !target.matches) return;
            const isTarget = target.matches('textarea[formcontrolname="promptText"]') ||
                           target.matches('ms-autosize-textarea textarea');
            if (!isTarget) return;

            // 2. 阻止默认行为
            event.preventDefault();
            event.stopImmediatePropagation();

            // 3. 获取光标位置和选区
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const hasSelection = start !== end;

            try {
                // ============================
                // 分支 A: 选中文本包裹模式
                // ============================
                if (hasSelection) {
                    console.log('[Dae优化工具] Alt+V: 检测到选中文本，执行代码块包裹...');
                    
                    // 获取选中的文本
                    const selectedText = target.value.substring(start, end);
                    
                    // 构造包裹后的文本 (前后换行以确保格式正确)
                    // 如果选中文本本身已经包含换行，通常不需要额外处理，直接包即可
                    const wrappedText = "```\n" + selectedText + "\n```";

                    // 执行替换
                    target.focus();
                    target.setRangeText(wrappedText, start, end, 'end');
                    
                    // 触发 input 通知 Angular 更新
                    target.dispatchEvent(new Event('input', { bubbles: true }));
                    return; // 结束，不执行后续的剪贴板粘贴
                }

                // ============================
                // 分支 B: 剪贴板智能粘贴模式 (原功能)
                // ============================
                
                // 获取剪贴板文本
                const text = await navigator.clipboard.readText();
                if (!text) return;

                // 智能换行检测
                // 检查光标所在行的前文是否有内容
                const textBefore = target.value.substring(0, start);
                const lastNewline = textBefore.lastIndexOf('\n');
                const lineContent = textBefore.substring(lastNewline + 1); // 获取当前行光标前的内容

                // 如果当前行已有非空内容，先补一个换行符
                const prefix = lineContent.trim().length > 0 ? "\n" : "";
                const codeBlock = prefix + "```\n" + text + "\n```";

                console.log('[Dae优化工具] Alt+V: 执行剪贴板代码粘贴...');

                // 插入文本
                target.focus();
                target.setRangeText(codeBlock, start, end, 'end');

                // 触发 input 通知 Angular
                target.dispatchEvent(new Event('input', { bubbles: true }));

            } catch (err) {
                console.error('[Dae优化工具] Alt+V 操作失败:', err);
            }
        }, true); // useCapture

        console.log('[Dae优化工具] Alt+V 监听已启动 (模式: 选中包裹 / 空选粘贴)');
    }

    // 启动冻结页面快捷键 (Alt+F8)
    function setupFreezeShortcut() {
        document.addEventListener('keydown', (event) => {
            // 0. 检查开关与快捷键 (Alt + F8)
            // 优先读取内存中的 activeSettings，实现无延迟响应
            const isEnabled = activeSettings.enableFreezeShortcut; 
            
            if (!isEnabled || !event.altKey || event.key !== 'F8') return;

            // 1. 阻止默认行为
            event.preventDefault();
            event.stopImmediatePropagation();

            // 2. 执行冻结逻辑
            console.log('[Dae优化工具] ❄️ 冻结指令已触发！\n>> 请确保开发者工具 (F12) 已打开。\n>> 解冻方法：在开发者工具中按 F8 或点击 Resume。');

            // 延迟 50ms 确保控制台日志已输出，随后触发断点
            setTimeout(() => {
                debugger;
            }, 50);

        }, true); // 使用捕获模式 (capture=true) 确保最高优先级

        console.log('[Dae优化工具] 冻结快捷键 (Alt+F8) 监听已启动');
    }

    // --- 全局变量用于控制跟随动画 ---
    let stickyRafId = null; // 动画帧ID
    let activeRange = null; // 当前锁定的选区

    // 用于平滑翻转的状态记录
    let lastPositionSide = 'bottom'; // 记录上一次是在'top'还是'bottom'
    let flipTimer = null;            // 动画计时器

    // --- 核心位置计算函数 (每帧都会调用) ---
    function updateQuoteBtnPosition(isInit = false) { // isInit 参数
        if (!quoteBtn || !activeRange) return;

        // 移动端处理
        if (window.innerWidth < 768) {
            quoteBtn.classList.add('mobile-view');
            const footer = document.querySelector('footer') || document.querySelector('ms-prompt-box');
            const promptBox = document.querySelector('.prompt-box-container');
            const gap = 10;
            const dynamicBottom = (footer ? footer.offsetHeight : 100) + gap;
            quoteBtn.style.bottom = `${dynamicBottom}px`;
            quoteBtn.style.top = '';
            // 基于输入框容器水平居中
            if (promptBox) {
                const promptRect = promptBox.getBoundingClientRect();
                quoteBtn.style.left = `${promptRect.left + (promptRect.width / 2)}px`;
            } else {
                quoteBtn.style.left = '';
            }
            return;
        }

        quoteBtn.classList.remove('mobile-view');
        quoteBtn.style.bottom = '';

        // --- TreeWalker 遍历获取精确选区边界 (保持不变) ---
        let minLeft = Infinity;
        let maxRight = -Infinity;
        let maxBottom = -Infinity;
        let minTop = Infinity;
        let foundText = false;

        const rootNode = activeRange.commonAncestorContainer.nodeType === 3
            ? activeRange.commonAncestorContainer.parentElement
            : activeRange.commonAncestorContainer;

        const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
        let currentNode;

        while (currentNode = walker.nextNode()) {
            if (activeRange.intersectsNode(currentNode)) {
                const tempRange = document.createRange();
                tempRange.selectNodeContents(currentNode);
                if (currentNode === activeRange.startContainer) tempRange.setStart(currentNode, activeRange.startOffset);
                if (currentNode === activeRange.endContainer) tempRange.setEnd(currentNode, activeRange.endOffset);

                const rects = tempRange.getClientRects();
                for (const r of rects) {
                    if (r.width < 1 || r.height < 1) continue;
                    if (r.left < minLeft) minLeft = r.left;
                    if (r.right > maxRight) maxRight = r.right;
                    if (r.top < minTop) minTop = r.top;
                    if (r.bottom > maxBottom) maxBottom = r.bottom;
                    foundText = true;
                }
            }
        }

        if (!foundText || minLeft === Infinity) {
            const rect = activeRange.getBoundingClientRect();
            minLeft = rect.left;
            maxRight = rect.right;
            minTop = rect.top;
            maxBottom = rect.bottom;
        }

        const btnWidth = quoteBtn.offsetWidth || 85;
        const btnHeight = quoteBtn.offsetHeight || 32;
        const spacing = 10;

        // [调整] 提前计算水平位置 (left)，以便用于碰撞检测
        const contentWidth = maxRight - minLeft;
        let left = minLeft + (contentWidth / 2) - (btnWidth / 2);
        if (left < 10) left = 10;
        else if (left + btnWidth > window.innerWidth - 10) left = window.innerWidth - btnWidth - 10;

        // 边界定义
        const footerEl = document.querySelector('footer') || document.querySelector('ms-prompt-box');
        const bottomBoundary = (footerEl ? footerEl.getBoundingClientRect().top : window.innerHeight) - 10;
        const topToolbarEl = document.querySelector('ms-chunk-editor ms-toolbar');
        const topBoundary = topToolbarEl ? topToolbarEl.getBoundingClientRect().bottom : 0; 

        // 候选位置
        const posBelow = maxBottom + spacing;
        const posAbove = minTop - btnHeight - spacing;

        let finalTop = posBelow;
        let currentSide = 'bottom';

        // 滚动按钮碰撞检测函数
        const checkScrollCollision = (targetLeft, targetTop, targetW, targetH) => {
            if (!activeSettings.enableScrollNav) return false;
            
            const upBtn = document.getElementById('gemini-scroll-up');
            const downBtn = document.getElementById('gemini-scroll-down');
            const btns = [upBtn, downBtn];

            for (const btn of btns) {
                // 只检测当前可见且显示的按钮
                if (btn && btn.classList.contains('visible') && btn.style.display !== 'none') {
                    const r = btn.getBoundingClientRect();
                    // 矩形重叠检测
                    if (targetLeft < r.right &&
                        targetLeft + targetW > r.left &&
                        targetTop < r.bottom &&
                        targetTop + targetH > r.top) {
                        return true;
                    }
                }
            }
            return false;
        };

        // 判定翻转条件：1. 碰到底部输入框 OR 2. 碰到滚动按钮
        if ((finalTop + btnHeight > bottomBoundary) || checkScrollCollision(left, finalTop, btnWidth, btnHeight)) {
            finalTop = posAbove;
            currentSide = 'top';
        }

        // --- 最终可见性与动画逻辑 (保持不变) ---
        const shouldHide = (finalTop < topBoundary) || (finalTop + btnHeight > bottomBoundary) || (finalTop < 0);
        quoteBtn.classList.toggle('temporarily-hidden', shouldHide);

        if (isInit) {
            lastPositionSide = currentSide;
            quoteBtn.classList.remove('smooth-flip-up');
            quoteBtn.classList.remove('smooth-flip-down');
        } else {
            if (currentSide !== lastPositionSide) {
                if (flipTimer) clearTimeout(flipTimer);

                if (currentSide === 'top') {
                    quoteBtn.classList.remove('smooth-flip-down');
                    quoteBtn.classList.add('smooth-flip-up');
                    flipTimer = setTimeout(() => {
                        quoteBtn.classList.remove('smooth-flip-up');
                        flipTimer = null;
                    }, 200);
                } else {
                    quoteBtn.classList.remove('smooth-flip-up');
                    quoteBtn.classList.add('smooth-flip-down');
                    flipTimer = setTimeout(() => {
                        quoteBtn.classList.remove('smooth-flip-down');
                        flipTimer = null;
                    }, 50);
                }
            }
            lastPositionSide = currentSide;
        }

        // 应用坐标
        quoteBtn.style.top = `${finalTop}px`;
        quoteBtn.style.left = `${left}px`;
    }

    // --- 启动跟随循环 ---
    function startStickyLoop() {
        if (stickyRafId) cancelAnimationFrame(stickyRafId);

        const loop = () => {
            // 只要按钮是显示状态，就一直更新位置
            if (quoteBtn.classList.contains('visible')) {
                updateQuoteBtnPosition();
                stickyRafId = requestAnimationFrame(loop);
            }
        };
        loop();
    }

    // --- 划词引用功能 ---

    let quoteBtn = null;

    function setupQuoteHandler() {
        if (!quoteBtn) {
            quoteBtn = document.createElement('div');
            quoteBtn.className = 'gemini-quote-btn';
            // 结构化构建，以便添加属性
            // 注意：这里我们使用 innerHTML 的方式稍作调整，或者直接替换 text node
            // 为了方便热更新，我们把 "Quote" 文字包裹在一个 span 里
            
            const icon = `<span aria-hidden="true" class="material-symbols-outlined notranslate" style="font-size: 18px; line-height: 1;" data-no-translate="1">arrow_split</span>`;
            
            // 创建一个专门放文字的 span，并加上 key
            const textSpan = `<span data-i18n-key="quote_btn_text">${protect(t('quote_btn_text'))}</span>`;
            
            quoteBtn.innerHTML = `
                <span style="display:flex;align-items:center;gap:6px;">
                    ${icon}
                    ${textSpan}
                </span>`;
            
            document.body.appendChild(quoteBtn);
            
            // 绑定按钮点击事件
            const triggerAction = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (activeSettings.enableQuote) {
                    performQuote();
                }
            };
            quoteBtn.addEventListener('mousedown', triggerAction);
            quoteBtn.addEventListener('touchstart', triggerAction);
        }

        // ============================================================
        // 逻辑分支 A: 电脑端 (PC)
        // ============================================================
        const onPCSelectionEnd = (e) => {
            if (!activeSettings.enableQuote) return;
            if (window.innerWidth < 768) return;
            if (quoteBtn && quoteBtn.contains(e.target)) return;
            setTimeout(() => {
                handleSelectionCheck();
            }, 10);
        };

        document.addEventListener('mouseup', onPCSelectionEnd);
        document.addEventListener('keyup', (e) => {
            if (e.shiftKey || e.key.startsWith('Arrow')) {
                onPCSelectionEnd(e);
            }
        });

        // ============================================================
        // 逻辑分支 B: 移动端 (Mobile)
        // ============================================================
        let selectionTimer = null;
        document.addEventListener('selectionchange', () => {
            if (!activeSettings.enableQuote) return;

            // 如果是电脑端，忽略 selectionchange (交给 mouseup 处理)
            if (window.innerWidth >= 768) return;

            if (selectionTimer) clearTimeout(selectionTimer);
            selectionTimer = setTimeout(() => {
                handleSelectionCheck(); 
            }, 150);
        });

        // ============================================================
        // 通用隐藏逻辑 (点击空白处隐藏)
        // ============================================================
        
        // 移除了 scroll 监听，允许在滚动时保留按钮 (依靠 stickyLoop 跟随)
        
        const onInteractionStart = (e) => {
            if (quoteBtn && quoteBtn.contains(e.target)) return;

            // 如果点击的是“设置按钮”(Dae或原生)，不要立即触发隐藏
            // 而是把隐藏的任务交给 Observer，从而确保和导航按钮一起通过 force-hidden 动画消失
            if (e.target.closest('#dae-settings-btn') || 
                e.target.closest('ms-run-settings-button') || 
                e.target.closest('.dae-settings-panel')) {
                return;
            }

            hideQuoteBtn();
        };

        // 仅保留 mousedown (PC点击空白处隐藏)
        // 移除了 touchstart，防止手机上滑动屏幕(Scroll)时误触隐藏
        // 手机上点击空白处会清除选区，从而触发 selectionchange 自动隐藏，所以不需要 touchstart
        document.addEventListener('mousedown', onInteractionStart);
    }

    // 滚动导航副作用管理器
    function applyScrollNavState() {
        const upBtn = document.getElementById('gemini-scroll-up');
        const downBtn = document.getElementById('gemini-scroll-down');
        
        if (activeSettings.enableScrollNav) {
            // 如果开启，但还没创建按钮，则执行初始化
            if (!upBtn) {
                setupScrollNav(); // 调用原来的初始化函数
            } else {
                // 如果按钮已存在（可能被 display:none 隐藏了），确保它们显示
                // (目前的 setupScrollNav 逻辑是创建后由 scroll 事件控制 visible 类，
                // 只要不销毁元素，它会自动工作。这里可以不做额外操作)
                upBtn.style.display = '';
                downBtn.style.display = '';
            }
        } else {
            // 如果关闭，直接隐藏或移除
            if (upBtn) upBtn.style.display = 'none';
            if (downBtn) downBtn.style.display = 'none';
        }
    }

    // --- 滚动导航功能 (适配内部滚动容器 + 文字图标) ---
    function setupScrollNav() {
        const upBtn = document.createElement('div');
        upBtn.id = 'gemini-scroll-up';
        upBtn.className = 'gemini-scroll-btn';
        // 使用更短鳍的 SVG 图标 (向上箭头)
        // 原路径宽度跨度 16px，新路径跨度 10px，看起来更紧凑
        upBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M12 5l-5 5 1.41 1.41L11 8.83V20h2V8.83l2.59 2.58L17 10l-5-5z"/></svg>';
        
        const downBtn = document.createElement('div');
        downBtn.id = 'gemini-scroll-down';
        downBtn.className = 'gemini-scroll-btn';
        // 使用更短鳍的 SVG 图标 (向下箭头)
        downBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M12 19l-5-5 1.41-1.41L11 15.17V4h2v11.17l2.59-2.58L17 14l-5 5z"/></svg>';

        document.body.appendChild(upBtn);
        document.body.appendChild(downBtn);

        // 移动端触摸反馈
        const setupMobileFeedback = (btn) => {
            btn.addEventListener('touchstart', () => {
                btn.classList.add('js-mobile-press');
            }, { passive: true });
            const clear = () => {
                setTimeout(() => {
                    btn.classList.remove('js-mobile-press');
                    btn.blur();
                }, 8);
            };
            btn.addEventListener('touchend', clear, { passive: true });
            btn.addEventListener('touchcancel', clear, { passive: true });
        };
        setupMobileFeedback(upBtn);
        setupMobileFeedback(downBtn);

        let scrollContainer = null;
        let resizeObserver = null;
        let footerObserver = null;

        const syncButtonHeight = () => {
            const footer = document.querySelector('footer') || document.querySelector('ms-prompt-box');
            if (!footer) return;
            const gap = 8;
            const newBottom = footer.offsetHeight + gap;
            upBtn.style.bottom = `${newBottom}px`;
            downBtn.style.bottom = `${newBottom}px`;
        };

        const getAllUserTurns = () => {
            const navButtons = document.querySelectorAll('ms-prompt-scrollbar button[aria-controls]');
            const turns = [];
            navButtons.forEach(btn => {
                const turnId = btn.getAttribute('aria-controls');
                if (turnId) {
                    const turnEl = document.getElementById(turnId);
                    if (turnEl) turns.push(turnEl);
                }
            });
            return turns;
        };

        // --- 位置计算逻辑 ---
        const repositionButtons = () => {
            if (!scrollContainer) return;
            const rect = scrollContainer.getBoundingClientRect();
            if (rect.width === 0) return;
            
            const isMobile = window.innerWidth < 768;
            const btnSize = isMobile ? 34 : 36;
            const gap = isMobile ? 9 : 10;
            let upBtnLeft, downBtnLeft;

            // 判定条件：基于输入框容器居中
            const promptBox = document.querySelector('.prompt-box-container');
            if (promptBox && !isMobile && activeSettings.scrollNavCentered) {
                // 居中布局：基于输入框容器的水平中垂线
                const promptRect = promptBox.getBoundingClientRect();
                const promptCenterX = promptRect.left + (promptRect.width / 2);
                upBtnLeft = promptCenterX - (gap / 2) - btnSize;
                downBtnLeft = promptCenterX + (gap / 2);
            } else {
                // 居右布局 (移动端强制走这里，或者PC端未开启居中)
                const rightMargin = isMobile ? 20 : 35;
                downBtnLeft = rect.right - rightMargin - btnSize; 
                upBtnLeft = downBtnLeft - gap - btnSize;
            }

            downBtn.style.left = `${downBtnLeft}px`;
            upBtn.style.left = `${upBtnLeft}px`;
        };

        // 将重定位函数暴露给全局，以便设置面板调用
        updateScrollNavLayout = repositionButtons;

        const updateState = () => {
            if (!scrollContainer) return;
            const scrollTop = scrollContainer.scrollTop;
            const clientHeight = scrollContainer.clientHeight;
            const scrollHeight = scrollContainer.scrollHeight;

            if (scrollHeight <= clientHeight + 50) {
                upBtn.classList.remove('visible');
                downBtn.classList.remove('visible');
                return;
            }

            const threshold = 50;
            const isAtTop = scrollTop < threshold;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold;

            if (isAtTop) {
                upBtn.classList.remove('visible');
                downBtn.classList.add('visible');
            } else if (isAtBottom) {
                upBtn.classList.add('visible');
                downBtn.classList.remove('visible');
            } else {
                upBtn.classList.add('visible');
                downBtn.classList.add('visible');
            }
            repositionButtons();
        };

        // ... 点击事件保持不变 (省略以节省篇幅，请保留原代码中的 click 逻辑) ...
        upBtn.addEventListener('click', () => { /* 原代码内容 */ 
            hideQuoteBtn(); // 点击即隐藏引用按钮
            
            if (!scrollContainer) return;
            const header = document.querySelector('ms-toolbar') || document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 64;
            const isMobile = window.innerWidth < 768;
            const topPadding = isMobile ? -65 : -55; 
            const userTurns = getAllUserTurns();
            const currentScrollTop = scrollContainer.scrollTop;
            let targetPos = 0;
            for (let i = userTurns.length - 1; i >= 0; i--) {
                const turn = userTurns[i];
                const idealPos = turn.offsetTop - headerHeight - topPadding;
                if (idealPos < currentScrollTop - 5) {
                    if (i === 0) targetPos = 0;
                    else targetPos = idealPos;
                    break; 
                }
            }
            scrollContainer.scrollTo({ top: Math.max(0, targetPos), behavior: 'smooth' });
        });

        downBtn.addEventListener('click', () => { /* 原代码内容 */ 
            hideQuoteBtn(); // 点击即隐藏引用按钮
            
            if (!scrollContainer) return;
            const footer = document.querySelector('footer') || document.querySelector('ms-prompt-box');
            const footerOffset = -55; 
            const footerHeight = (footer ? footer.offsetHeight : 120) + footerOffset;
            const containerHeight = scrollContainer.clientHeight;
            const currentScrollTop = scrollContainer.scrollTop;
            const userTurns = getAllUserTurns();
            const allTurns = scrollContainer.querySelectorAll('ms-chat-turn');
            const lastTurn = allTurns.length > 0 ? allTurns[allTurns.length - 1] : null;
            let targetScrollTop = -1;
            for (let i = 0; i < userTurns.length; i++) {
                const userTurn = userTurns[i];
                const prevTurn = userTurn.previousElementSibling;
                if (prevTurn && prevTurn.tagName.toLowerCase() === 'ms-chat-turn') {
                    const elementBottom = prevTurn.offsetTop + prevTurn.offsetHeight;
                    const potentialScrollTop = elementBottom - (containerHeight - footerHeight);
                    if (potentialScrollTop > currentScrollTop + 5) {
                        targetScrollTop = potentialScrollTop;
                        break;
                    }
                }
            }
            if (targetScrollTop === -1 && lastTurn) {
                const isLastUser = userTurns.length > 0 && userTurns[userTurns.length - 1] === lastTurn;
                if (!isLastUser) {
                    const disclaimer = scrollContainer.querySelector('ms-hallucinations-disclaimer');
                    const disclaimerHeight = (disclaimer && disclaimer.offsetParent !== null) ? (disclaimer.offsetHeight + 30) : 0;
                    const elementBottom = lastTurn.offsetTop + lastTurn.offsetHeight + disclaimerHeight;
                    const potentialScrollTop = elementBottom - (containerHeight - footerHeight);
                    if (potentialScrollTop > currentScrollTop + 5) targetScrollTop = potentialScrollTop;
                }
            }
            if (targetScrollTop === -1) targetScrollTop = scrollContainer.scrollHeight - containerHeight;
            scrollContainer.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
        });

        const initScrollListener = () => {
            const possibleContainer = document.querySelector('ms-autoscroll-container');

            // 1. 健康检查：如果手里拿着的容器已经“死”了（被从 DOM 移除），立即撒手
            if (scrollContainer && !scrollContainer.isConnected) {
                console.log('[Gemini 优化] 检测到滚动容器失效 (清空/重置)，正在重新挂载...');
                scrollContainer = null;
                // 立即隐藏按钮，防止残留
                upBtn.classList.remove('visible');
                downBtn.classList.remove('visible');
                // 断开旧的观察器，防止内存泄漏
                if (resizeObserver) resizeObserver.disconnect();
            }

            // 2. 绑定逻辑：只有当手里没有容器，且页面上有新容器时才执行
            if (!scrollContainer && possibleContainer && possibleContainer.clientHeight > 0) {
                scrollContainer = possibleContainer;
                console.log('[Gemini 优化] 滚动导航已连接 (New Container)');

                // 重新绑定滚动事件
                scrollContainer.addEventListener('scroll', () => {
                    if (window._scrollTimer) return;
                    window._scrollTimer = requestAnimationFrame(() => {
                        updateState();
                        window._scrollTimer = null;
                    });
                }, { passive: true });

                // 重新绑定尺寸观察器
                if (resizeObserver) resizeObserver.disconnect();
                resizeObserver = new ResizeObserver(() => {
                    repositionButtons();
                    updateState();
                });
                resizeObserver.observe(scrollContainer);
                resizeObserver.observe(document.body);

                // 重新绑定底部高度同步
                const footer = document.querySelector('footer') || document.querySelector('ms-prompt-box');
                if (footer) {
                    if (footerObserver) footerObserver.disconnect();
                    footerObserver = new ResizeObserver(syncButtonHeight);
                    footerObserver.observe(footer);
                    syncButtonHeight();
                }

                updateState();
                repositionButtons();
                
                // 永远不要清除定时器！
                // 只有保持定时器运行，才能在"清空聊天"后自动发现新容器
                // if (window._findScrollInterval) clearInterval(window._findScrollInterval);
            }
        };

        // 启动心跳检测（保持每秒检查一次容器健康状态）
        if (window._findScrollInterval) clearInterval(window._findScrollInterval);
        window._findScrollInterval = setInterval(initScrollListener, 1000);
        window.addEventListener('locationchange', () => {
            scrollContainer = null;
            upBtn.classList.remove('visible');
            downBtn.classList.remove('visible');
            if (window._findScrollInterval) clearInterval(window._findScrollInterval);
            window._findScrollInterval = setInterval(initScrollListener, 1000);
        });
        window.addEventListener('resize', repositionButtons);
    }

    function hideQuoteBtn() {
        if (quoteBtn) {
            quoteBtn.classList.remove('visible');
            // 移除所有可能的动画类
            quoteBtn.classList.remove('smooth-flip-up');
            quoteBtn.classList.remove('smooth-flip-down');

            if (stickyRafId) {
                cancelAnimationFrame(stickyRafId);
                stickyRafId = null;
            }
            if (flipTimer) {
                clearTimeout(flipTimer);
                flipTimer = null;
            }
            activeRange = null;
            lastPositionSide = 'bottom';
        }
    }

    function handleSelectionCheck(e) {
        const selection = window.getSelection();

        // 1. 检查选区是否为空
        if (selection.isCollapsed || selection.toString().trim().length === 0) {
            hideQuoteBtn();
            return;
        }

        const anchorNode = selection.anchorNode;
        // 防御性检查：anchorNode 可能为 null
        if (!anchorNode) return;

        const targetElement = anchorNode.nodeType === 3 ? anchorNode.parentElement : anchorNode;

        // 2. 黑名单区域检测
        const invalidSelectors = [
            '.author-label',
            '.top-panel-title',
            '.thought-collapsed-text',
            'mat-panel-title',
            '.search-entry-container'
        ].join(', ');

        if (targetElement.closest(invalidSelectors)) {
            hideQuoteBtn();
            return;
        }

        // 3. 检查选区是否在对话内容 (.turn-content) 内部
        if (!targetElement.closest('.turn-content')) {
            hideQuoteBtn();
            return;
        }

        // --- 位置计算逻辑 (区分手机/电脑) ---

        // 简单判断是否为移动端视口
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // 手机模式：应用特殊类名，样式由 CSS 控制 (底部居中)
            quoteBtn.classList.add('mobile-view');
            // 清除内联样式对位置的干扰
            quoteBtn.style.top = '';
            quoteBtn.style.left = '';
        } else {
            // 电脑模式
            quoteBtn.classList.remove('mobile-view');

            const range = selection.getRangeAt(0);

            // --- 初始化边界 ---
            let minLeft = Infinity;
            let maxRight = -Infinity;
            let maxBottom = -Infinity;
            let minTop = Infinity;
            let foundText = false;

            // --- 核心逻辑：遍历选区内的所有文本节点 ---
            // 这样可以避开"整行选择"时包含的右侧空白区域，只计算文字的实际墨迹范围

            // 确定遍历的根节点 (如果选区在一个文本节点内，取其父元素)
            const rootNode = range.commonAncestorContainer.nodeType === 3
                ? range.commonAncestorContainer.parentElement
                : range.commonAncestorContainer;

            const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
            let currentNode;

            while (currentNode = walker.nextNode()) {
                // 判断该文本节点是否被选区包含（或部分包含）
                if (range.intersectsNode(currentNode)) {
                    // 创建一个临时 Range 只测量这个文本节点
                    const tempRange = document.createRange();
                    tempRange.selectNodeContents(currentNode);

                    // 精确处理选区的开头和结尾（只测量被选中的那部分文字）
                    if (currentNode === range.startContainer) {
                        tempRange.setStart(currentNode, range.startOffset);
                    }
                    if (currentNode === range.endContainer) {
                        tempRange.setEnd(currentNode, range.endOffset);
                    }

                    // 获取该段文字的矩形
                    const rects = tempRange.getClientRects();
                    for (const r of rects) {
                        if (r.width < 1 || r.height < 1) continue; // 忽略不可见字符

                        if (r.left < minLeft) minLeft = r.left;
                        if (r.right > maxRight) maxRight = r.right;
                        if (r.top < minTop) minTop = r.top;
                        if (r.bottom > maxBottom) maxBottom = r.bottom;
                        foundText = true;
                    }
                }
            }

            // --- 兜底逻辑 ---
            // 如果没找到文本（比如只选中了图片），回退到粗略计算
            if (!foundText || minLeft === Infinity) {
                const rect = range.getBoundingClientRect();
                minLeft = rect.left;
                maxRight = rect.right;
                minTop = rect.top;
                maxBottom = rect.bottom;
            }

            // --- 坐标计算 ---
            const btnWidth = quoteBtn.offsetWidth || 85;
            const btnHeight = quoteBtn.offsetHeight || 32;
            const spacing = 10;

            // 1. 垂直位置：放在最底部的文字下方
            let top = maxBottom + spacing;
            if (top + btnHeight > window.innerHeight) {
                top = minTop - btnHeight - spacing;
            }

            // 2. 水平位置：(最左侧文字 + 最长行文字的右边缘) / 2
            // 这样就完全排除了右侧空白区域的干扰
            const contentWidth = maxRight - minLeft;
            let left = minLeft + (contentWidth / 2) - (btnWidth / 2);

            // 边界检查
            if (left < 10) left = 10;
            else if (left + btnWidth > window.innerWidth - 10) left = window.innerWidth - btnWidth - 10;

            quoteBtn.style.top = `${top}px`;
            quoteBtn.style.left = `${left}px`;
        }

        // --- 核心变更 ---
        // 1.  锁定当前选区 Range 对象
        activeRange = selection.getRangeAt(0).cloneRange();

        // 先计算位置 (传入 true 表示初始化)，此时按钮不可见，位置会直接瞬移到位
        updateQuoteBtnPosition(true);

        // 再显示按钮 (此时 top 已经是正确值，fade-in 动画会在正确位置播放)
        quoteBtn.classList.add('visible');

        // 3. 启动“死死粘着”循环
        startStickyLoop();
    }

    // 执行引用逻辑
    function performQuote() {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (!text) return;

        // --- 使用翻译后的默认值 ---
        let authorName = protect(t('quote_author_context'));

        // 1. 先定位到当前选区所在的 ms-chat-turn
        let currentTurn = selection.anchorNode.nodeType === 3
            ? selection.anchorNode.parentElement.closest('ms-chat-turn')
            : selection.anchorNode.closest('ms-chat-turn');

        // 2. 循环查找：如果当前回合找不到 .author-label，就找上一个兄弟节点
        while (currentTurn) {
            // 尝试在当前回合找标签
            const labelEl = currentTurn.querySelector('.author-label');

            if (labelEl && labelEl.textContent.trim()) {
                authorName = labelEl.textContent.trim();
                // 找到了，直接结束循环
                break;
            }

            // 没找到？把 currentTurn 指针移到上一个兄弟元素 (previousElementSibling)
            const prev = currentTurn.previousElementSibling;

            // 只有当上一个兄弟依然是 ms-chat-turn 时才继续，否则说明到了列表顶端或结构变了
            if (prev && prev.tagName.toLowerCase() === 'ms-chat-turn') {
                currentTurn = prev;
            } else {
                // 确实找不到了，保持默认的 "上下文"
                break;
            }
        }
        // ------------------------------------------

        // 2. 获取输入框
        const textarea = document.querySelector('textarea[formcontrolname="promptText"]');
        if (!textarea) return;

        // 3. 存储状态
        pendingQuoteState = {
            author: authorName,
            text: text
        };

        // 4. 显示“引用预览卡片”
        createQuotePreview(textarea, authorName, text);

        // 清除选区并隐藏按钮
        selection.removeAllRanges();
        hideQuoteBtn();

        textarea.focus();
    }

    // 创建输入框顶部的引用预览区域
    function createQuotePreview(textarea, author, text) {
        const wrapper = textarea.parentElement;
        const container = wrapper ? wrapper.parentElement : null;
        if (!container) return;

        // 移除旧卡片
        const oldCard = document.getElementById('gemini-quote-card-container');
        if (oldCard) oldCard.remove();

        // 创建容器
        const cardContainer = document.createElement('div');
        cardContainer.id = 'gemini-quote-card-container';

        // 创建卡片
        const card = document.createElement('div');
        card.className = 'gemini-quote-card';
        if (author !== '用户' && author !== 'User') {
            card.style.borderLeftColor = '#f4944aff';
        }

        // 头部
        const header = document.createElement('div');
        header.className = 'gemini-quote-header';

        const authorSpan = document.createElement('span');
        authorSpan.className = 'gemini-quote-author';

        // [逻辑优化] 统一处理 User 和 Model 的多语言与防御
        let finalAuthor = author;

        // 1. 如果抓取到的是用户
        if (author === '用户' || author === 'User') {
            finalAuthor = t('quote_card_author_user'); 
        } 
        // 2. 如果抓取到的是模型
        else if (author === '模型' || author === 'Model') {
            // 根据当前优化工具的语言设置显示对应文本
            // (注意：这里直接判断 CURRENT_LANG，避免你去修改庞大的配置表)
            finalAuthor = (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'en') ? 'Model' : '模型';
        }

        // 加上 protect() 保护，物理隔绝汉化脚本
        authorSpan.textContent = protect(finalAuthor);

        const labelSpan = document.createElement('span');
        labelSpan.textContent = protect(t('quote_card_label')); // "已引用内容" or "Quoted content"

        header.appendChild(authorSpan);
        header.appendChild(labelSpan);

        // 内容
        const content = document.createElement('div');
        content.className = 'gemini-quote-content';
        content.textContent = text;

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'gemini-quote-close';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => {
            // 1. 移除视觉卡片
            cardContainer.remove();
            // 2. 清除挂起状态
            pendingQuoteState = null;
        });

        card.appendChild(header);
        card.appendChild(content);
        card.appendChild(closeBtn);
        cardContainer.appendChild(card);

        container.insertBefore(cardContainer, container.firstChild);
    }

    // --- 注入搜索后缀开关按钮 (Run Settings 面板) ---
    function injectSuffixToggle() {
        if (window.innerWidth < 768) return;
        if (!activeSettings.showSearchSuffixBtn) return;
        if (document.getElementById('dae-suffix-toggle-btn')) return;

        // 使用 data-test-id 精准定位 "Google 搜索" 行
        const searchRow = document.querySelector('[data-test-id="searchAsAToolTooltip"]');
        if (!searchRow) return;

        // 寻找开关容器
        const toggleContainer = searchRow.querySelector('.item-input-toggle');
        if (!toggleContainer) return;

        // 创建按钮
        const btn = document.createElement('div');
        btn.id = 'dae-suffix-toggle-btn';
        btn.className = 'dae-suffix-toggle-btn';
        // 添加标记
        btn.setAttribute('data-i18n-key', 'btn_suffix');
        btn.textContent = protect(t('btn_suffix'));
        
        // Tooltip
        const tipText = protect(t('tip_search_suffix'));
        let tooltipEl = null;
        btn.addEventListener('mouseenter', () => {
            if (tooltipEl) return;
            tooltipEl = document.createElement('div');
            tooltipEl.className = 'gemini-custom-tooltip';
            tooltipEl.textContent = tipText;
            document.body.appendChild(tooltipEl);
            requestAnimationFrame(() => {
                if (!tooltipEl) return;
                const btnRect = btn.getBoundingClientRect();
                const tipRect = tooltipEl.getBoundingClientRect();
                
                // 将 8 改为 14，增加垂直距离，防止视觉遮挡
                // 如果上方空间不够，代码通常没有自动翻转逻辑，但在 Run Settings 区域上方通常有空间
                const top = btnRect.top - tipRect.height - 24; 
                
                let left = btnRect.left + (btnRect.width / 2) - (tipRect.width / 2);
                if (left < 10) left = 10;
                tooltipEl.style.top = `${top}px`;
                tooltipEl.style.left = `${left}px`;
                tooltipEl.classList.add('visible');
            });
        });
        btn.addEventListener('mouseleave', () => {
            if (tooltipEl) { tooltipEl.remove(); tooltipEl = null; }
        });

        // 辅助函数：根据当前配置更新按钮样式
        const updateState = () => {
            if (activeSettings.enableSearchSuffix) btn.classList.add('active');
            else btn.classList.remove('active');
        };
        updateState();

        // --- Click 事件：正确的切换逻辑 ---
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            
            // 1. 切换布尔值状态
            activeSettings.enableSearchSuffix = !activeSettings.enableSearchSuffix;
            
            // 2. 保存设置到 GM 存储
            GM_setValue('enableSearchSuffix', activeSettings.enableSearchSuffix);
            
            // 3. 更新按钮视觉状态
            updateState();
            
            // 4. (可选) 点击后立即移除 Tooltip，优化体验
            if (tooltipEl) { tooltipEl.remove(); tooltipEl = null; }
        });

        toggleContainer.prepend(btn);
    }

    // --- 发送拦截器：在发送瞬间注入引用 ---
    function setupSendInterceptor() {
        // [辅助函数] 检测 Google 搜索工具并返回对应的后缀文本 (粗体)
        const getSearchToolSuffix = () => {
            const toolNames = document.querySelectorAll('.enabled-tool .tool-name');
            for (const el of toolNames) {
                const text = el.textContent.trim();
                
                // 1. 中文界面
                if (text === 'Google 搜索') {
                    return '\n\n---\n**（结合联网搜索）**';
                }
                
                // 2. 英文界面
                if (text === 'Grounding with Google Search' || text === 'Google Search') {
                    return '\n\n---\n**(Combined with web search)**';
                }
            }
            return null;
        };

        // 核心注入逻辑
        const handleInjection = () => {
            const textarea = document.querySelector('textarea[formcontrolname="promptText"]');
            if (!textarea) return;

            // 只有当输入框有内容时才触发
            // 防止发送空白消息时意外注入后缀
            if (!textarea.value.trim()) return;

            let prefix = '';
            let suffix = '';
            let hasChange = false;

            // 1. 处理引用 (Quote)
            if (activeSettings.enableQuote && pendingQuoteState) {
                prefix = `${t('quote_inject_header')}\n\n> ${pendingQuoteState.author}: ${pendingQuoteState.text}\n\n---\n`;
                pendingQuoteState = null;
                const card = document.getElementById('gemini-quote-card-container');
                if (card) card.remove();
                hasChange = true;
            }

            // 2. 处理搜索后缀 (Search Suffix)
            if (activeSettings.enableSearchSuffix) {
                const suffixText = getSearchToolSuffix();
                if (suffixText) {
                    // 防止重复添加
                    if (!textarea.value.endsWith(suffixText)) {
                        suffix = suffixText;
                        hasChange = true;
                    }
                }
            }

            // 3. 应用更改
            if (hasChange) {
                textarea.value = prefix + textarea.value + suffix;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                
                if (prefix) console.log('[Gemini 优化] 已注入引用内容');
                if (suffix) console.log('[Gemini 优化] 已注入搜索后缀');
            }
        };

        // 监听回车键
        document.addEventListener('keydown', (e) => {
            const target = e.target;
            if (!target || !target.matches || !target.matches('textarea[formcontrolname="promptText"]')) return;
            if (e.key === 'Enter' && (e.ctrlKey || e.altKey || e.metaKey)) {
                handleInjection();
            }
        }, true);

        // 监听发送按钮点击
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button[aria-label="发送"]') || e.target.closest('ms-run-button');
            if (btn) handleInjection();
        }, true); 
    }

    // --- 系统指令列表抓取器 ---
    const instructionScraper = (function() {

        // 核心抓取逻辑 (保持不变)
        function saveList(rawOptions) {
            try {
                if (!rawOptions || rawOptions.length === 0) return;

                const allTexts = Array.from(rawOptions).map(opt => {
                    const textEl = opt.querySelector('.mdc-list-item__primary-text');
                    return textEl ? textEl.textContent.trim() : opt.textContent.trim();
                });

                // 特征校验 & 过滤
                let isSystemInstructionMenu = false;
                let cleanList = allTexts;

                if (rawOptions.length > 0) {
                    const firstEl = rawOptions[0];
                    const plusIcon = firstEl.querySelector('.mdc-list-item__primary-text span[aria-hidden="true"]');
                    const hasPlusSymbol = plusIcon && plusIcon.textContent.trim() === '+';
                    const firstText = allTexts[0];

                    if (hasPlusSymbol || firstText.startsWith('+')) {
                        isSystemInstructionMenu = true;
                        cleanList = allTexts.slice(1); 
                    }
                    else if (activeSettings.savedSystemInstructions.some(saved => allTexts.includes(saved))) {
                        isSystemInstructionMenu = true;
                    }
                }

                if (!isSystemInstructionMenu) return;

                cleanList = cleanList.filter(t => t);
                
                if (cleanList.length >= 0) {
                    const oldListJSON = JSON.stringify(activeSettings.savedSystemInstructions);
                    const newListJSON = JSON.stringify(cleanList);

                    if (oldListJSON !== newListJSON) {
                        console.log(`[Gemini 优化] 💾 列表已更新 (${cleanList.length}个)`);
                        activeSettings.savedSystemInstructions = cleanList;
                        GM_setValue('savedSystemInstructions', cleanList);
                    }
                }
            } catch (e) {
                console.error('[Gemini 优化] 指令解析失败:', e);
            }
        }

        // 移除了所有主动监听逻辑
        // 现在的存档触发完全依赖于 autoConfigLogic 在“关闭面板”时调用的 performBackgroundScan
        function init() {
            // 已清空：防止手动操作下拉菜单时触发冗余存档
        }

        return { init, saveList };
    })();

    // --- 自动系统指令配置逻辑 (移植自 Auto-Config) ---
    const autoConfigLogic = (function() {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        
        const wait = (sel, timeout = 5000) => new Promise(resolve => {
            if (document.querySelector(sel)) return resolve(document.querySelector(sel));
            const obs = new MutationObserver(() => {
                const el = document.querySelector(sel);
                if (el) { obs.disconnect(); resolve(el); }
            });
            obs.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
        });

        // 状态锁
        let hasConfiguredSession = false;
        let isRunning = false;

        // 隐身模式样式控制器
        const STEALTH_STYLE_ID = 'dae-auto-config-stealth';
        function toggleStealth(enabled) {
            const existing = document.getElementById(STEALTH_STYLE_ID);
            if (enabled) {
                if (!existing) {
                    const style = document.createElement('style');
                    style.id = STEALTH_STYLE_ID;
                    
                    // 移动端判定
                    const isMobile = window.innerWidth < 768;
                    
                    // 移动端额外隐藏规则：侧边栏本栏 + 侧边栏遮罩层
                    // 加上 .sidebar-overlay 即可隐藏那个变暗的背景
                    const mobileSidebarCSS = isMobile ? `
                        ms-right-side-panel,
                        .sidebar-overlay { 
                            opacity: 0 !important;
                            visibility: hidden !important;
                            position: absolute !important; 
                            z-index: -9999 !important;
                            pointer-events: none !important;
                        }
                    ` : '';

                    style.textContent = `
                        .cdk-overlay-container, 
                        .cdk-overlay-backdrop,
                        .mat-mdc-dialog-container,
                        .mat-mdc-select-panel {
                            opacity: 0 !important;
                            visibility: hidden !important;
                            transition: none !important;
                            animation: none !important;
                        }
                        ${mobileSidebarCSS}
                    `;
                    document.head.appendChild(style);
                }
            } else {
                if (existing) existing.remove();
            }
        }

        function reset() {
            hasConfiguredSession = false;
            // console.log('[Gemini 优化] 🔄 状态锁已重置');
        }

        // --- 专门的后台扫描函数 ---
        async function performBackgroundScan() {
            if (isRunning) return;

            // ================= [Step 0: 智能打开面板逻辑] =================
            // 尝试获取系统指令入口
            let openBtn = document.querySelector('ms-system-instructions-panel > button');

            // 如果当前找不到入口（面板未打开），尝试通过工具栏 Tune 按钮打开
            if (!openBtn) {
                // 匹配用户提供的 HTML 结构
                const tuneBtn = document.querySelector('.runsettings-toggle-button') || 
                                document.querySelector('button[iconname="tune"]');
                
                if (tuneBtn) {
                    const isMobile = window.innerWidth < 768;
                    
                    // 【移动端】立即开启隐身，实现“后台隐藏打开”
                    if (isMobile) toggleStealth(true);
                    
                    // 【PC端】不开启隐身，符合“打开后不隐藏运行设置面板”的需求
                    // (toggleStealth 主要隐藏的是弹窗层，不会影响 PC 端嵌入式的侧边栏显示)

                    console.log('[Gemini 优化] 未找到指令入口，尝试打开运行设置面板...');
                    tuneBtn.click();

                    // 等待指令按钮渲染出来 (最多等 2 秒)
                    openBtn = await wait('ms-system-instructions-panel > button', 2000);
                }
            }
            // ============================================================

            if (!openBtn) return; // 如果经过尝试后还是找不到，放弃执行

            isRunning = true;
            console.log('[Gemini 优化] 🕵️‍♂️ 触发系统指令后台同步...');

            try {
                // 1. 开启隐身 (隐藏接下来的下拉菜单操作)
                // 注意：这会隐藏 Overlay 层（弹窗/下拉框），但不会隐藏 PC 端的侧边栏
                toggleStealth(true);

                // 2. 点击展开系统指令详情
                openBtn.click();

                // 3. 打开下拉菜单
                const dropdown = await wait('mat-dialog-content mat-select', 2000);
                if (dropdown) {
                    dropdown.click();
                    
                    // 4. 等待选项并抓取
                    await wait('.cdk-overlay-pane mat-option', 2000);
                    const allOptions = document.querySelectorAll('.cdk-overlay-pane mat-option');
                    if (allOptions.length > 0) {
                        instructionScraper.saveList(allOptions);
                    }
                    
                    // 5. 关闭下拉菜单 (点击遮罩)
                    await sleep(100);
                    const backdrop = document.querySelector('.cdk-overlay-backdrop');
                    if (backdrop) backdrop.click();
                }

                // 6. 关闭指令详情面板 (点击关闭按钮或遮罩)
                // 注意：这里关的是“指令详情”这个小弹窗，而不是“运行设置”侧边栏
                await sleep(100);
                const closePanelBtn = document.querySelector('mat-dialog-container button[iconname="close"]');
                if (closePanelBtn) {
                    closePanelBtn.click();
                } else {
                    const backdrop2 = document.querySelector('.cdk-overlay-backdrop');
                    if (backdrop2) backdrop2.click();
                }

            } catch (e) {
                console.debug('[Gemini 优化] Background Scan Error:', e);
            } finally {
                // 清理 Toast 通知
                const toasts = document.querySelectorAll('ms-toast');
                toasts.forEach(toast => {
                    const msgEl = toast.querySelector('.message');
                    if (msgEl) {
                        const text = msgEl.textContent.trim();
                        if (text.includes('系统指令已删除') || text.includes('System instruction deleted')) {
                            const closeBtn = toast.querySelector('button[iconname="close"]');
                            if (closeBtn) closeBtn.click();
                        }
                    }
                });

                // 恢复显示
                setTimeout(() => toggleStealth(false), 750);
                isRunning = false;
            }
        }

        // --- 原有的自动配置函数 ---
        async function execute() {
            if (activeSettings.autoSystemInstructionName === '__DISABLED__') return;
            
            // 缓冲等待：页面跳转/DOM销毁需要时间，稍作等待以获取准确的 DOM 状态
            // await sleep(500);

            if (!location.href.includes('prompts/new_chat')) {
                hasConfiguredSession = false;
                return;
            }

            const turnCount = document.querySelectorAll('ms-chat-turn').length;
            if (turnCount > 0) {
                hasConfiguredSession = false;
                return;
            }

            const titleEl = document.querySelector('h1.mode-title');
            if (titleEl) {
                const title = titleEl.textContent.trim();
                if (title !== 'Untitled prompt' && title !== 'Chat prompt' && title !== '聊天' && title !== 'New chat') {
                    return;
                }
            }

            if (hasConfiguredSession) return;
            if (isRunning) return;
            
            isRunning = true;
            const targetName = activeSettings.autoSystemInstructionName;
            console.log(`[Gemini 优化] 🆕 开始自动配置: "${targetName}"`);

            try {
                // ================= [Step 0: 智能打开面板逻辑] =================
                let openBtn = document.querySelector('ms-system-instructions-panel > button');

                if (!openBtn) {
                    const tuneBtn = document.querySelector('.runsettings-toggle-button') || 
                                    document.querySelector('button[iconname="tune"]');
                    
                    if (tuneBtn) {
                        console.log('[Gemini 优化] 运行设置面板未打开，尝试自动展开...');
                        
                        // [关键] 移动端必须先开启隐身 (此时隐身函数已包含隐藏侧边栏的逻辑)
                        // PC 端则不开启，让侧边栏正常滑出
                        if (window.innerWidth < 768) toggleStealth(true);

                        tuneBtn.click();
                        openBtn = await wait('ms-system-instructions-panel > button', 2000);
                    }
                }
                // ============================================================

                if (!openBtn) {
                    console.log('[Gemini 优化] ❌ 无法找到指令入口，终止配置');
                    return;
                }
                
                if (openBtn.textContent.trim().includes(targetName)) {
                    console.log('[Gemini 优化] 指令已匹配，标记为完成');
                    hasConfiguredSession = true;
                    return;
                }

                // 确保隐身开启 (覆盖上面只针对移动端的逻辑，这里所有端都要隐身弹窗)
                toggleStealth(true);
                
                openBtn.click();

                const dropdown = await wait('mat-dialog-content mat-select');
                if (!dropdown) return;
                dropdown.click();

                await wait('.cdk-overlay-pane mat-option');
                const allOptions = document.querySelectorAll('.cdk-overlay-pane mat-option');
                
                instructionScraper.saveList(allOptions);

                const targetOption = Array.from(allOptions).find(opt => 
                    opt.textContent.trim() === targetName
                );

                if (targetOption) {
                    await sleep(100); 
                    targetOption.click();
                    console.log(`[Gemini 优化] ✅ 指令已应用: ${targetName}`);
                    hasConfiguredSession = true; 
                }

                await sleep(200); 
                const backdrop = document.querySelector('.cdk-overlay-backdrop');
                if (backdrop) backdrop.click();
                
                const input = await wait('ms-prompt-renderer ms-prompt-box textarea');
                if (input) input.focus();

            } catch (e) {
                console.debug('[Gemini 优化] AutoConfig Error:', e);
            } finally {
                setTimeout(() => toggleStealth(false), 750);
                isRunning = false;
            }
        }

        function initListener() {
            document.addEventListener('click', (e) => {
                const target = e.target;

                // 1. 监听新建聊天 (重置锁)
                const link = target.closest('a[href*="/prompts/new_chat"]');
                if (link) {
                    reset();
                    setTimeout(execute, 200);
                }

                // 2. 监听关闭按钮 -> 触发后台隐身更新
                const closeBtn = target.closest('button[iconname="close"]') || target.closest('button[aria-label="关闭面板"]');
                
                if (closeBtn) {
                    // 排除“关闭运行设置面板”按钮
                    // 如果点击的是侧边栏的关闭按钮，绝对不要触发扫描，否则会陷入“关闭->扫描->重开”的死循环
                    const label = closeBtn.getAttribute('aria-label') || '';
                    if (label.includes('关闭运行设置') || label.includes('Close run settings')) {
                        return; 
                    }

                    // 只有非侧边栏的关闭操作（即 dialog 弹窗关闭）才触发扫描
                    if (!isRunning) {
                        setTimeout(() => performBackgroundScan(), 300);
                    }
                }

                // 3. 监听点击外部遮罩 (cdk-overlay-backdrop)
                if (target.classList.contains('cdk-overlay-backdrop')) {
                    if (isRunning) return;

                    const isDropdownOpen = !!document.querySelector('.mat-mdc-select-panel');
                    if (isDropdownOpen) return;

                    if (document.querySelector('ms-system-instructions')) {
                        setTimeout(performBackgroundScan, 400);
                    }
                }
            }, true);
        }

        return { 
            execute, 
            initListener,
            // [新增] 暴露后台扫描函数，用于强制更新列表
            forceUpdateList: performBackgroundScan 
        };
    })();

    // --- 监听编辑完成/更新按钮 ---
    function setupEditCompleteObserver() {
        document.addEventListener('click', (e) => {
            if (!activeSettings.enableBoldSpacingFix) return;

            const target = e.target;
            const btn = target.closest('button');
            if (!btn) return;

            const icon = btn.querySelector('.material-symbols-outlined');
            const iconText = icon ? icon.textContent.trim() : '';
            
            // 特征匹配：done_all 图标，或特定的类名/标签
            const isTargetBtn = 
                (iconText === 'done_all') || 
                (btn.classList.contains('toggle-edit-button')) ||
                (btn.getAttribute('aria-label') === '停止编辑') ||
                (btn.textContent.includes('Update') || btn.textContent.includes('更新'));

            if (isTargetBtn) {
                console.log('[Gemini 优化] 停止编辑，准备强制重排...');
                
                setTimeout(() => {
                    // 1. 再次确认开关
                    if (!activeSettings.enableBoldSpacingFix) return;

                    // 2. [关键步骤] 强制撕掉所有“已优化”的标签
                    // 这会迫使 optimizeMarkdownText 重新扫描所有文本块
                    // 从而解决组件复用导致的“视而不见”问题
                    const allChunks = document.querySelectorAll('ms-text-chunk[data-dae-optimized]');
                    allChunks.forEach(chunk => chunk.removeAttribute('data-dae-optimized'));
                    
                    console.log(`[Gemini 优化] 已重置 ${allChunks.length} 个文本块状态，开始执行重排...`);

                    // 3. 执行优化
                    optimizeMarkdownText();

                }, 500); // 延迟 500ms 等待 Angular 渲染完毕
            }
        }, true);
    }

    // --- 关联对话删除功能 (动态索引稳健版) ---

    let lastTriggeredTurn = null; 
    let isDeleting = false;       

    function setupAssociationDeleter() {
        document.addEventListener('mousedown', (e) => {
            if (!activeSettings.enableDeleteAssociated) return;
            // [锁] 如果正在执行删除，直接拦截一切点击，防止干扰
            if (isDeleting) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            const btn = e.target.closest('ms-chat-turn-options button');
            if (btn) {
                lastTriggeredTurn = btn.closest('ms-chat-turn');
                checkForMenuAndInject();
            }
        }, true);
    }

    // 轮询检测菜单是否弹出 (逻辑保持不变，但检测标记变了)
    function checkForMenuAndInject() {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (attempts > 50) { clearInterval(interval); return; }

            const menuContent = document.querySelector('.mat-mdc-menu-content');
            if (!menuContent) return; 

            // 如果已经注入过进阶按钮，就停止
            if (menuContent.querySelector('.dae-advanced-delete-group')) {
                clearInterval(interval);
                return;
            }

            const items = Array.from(menuContent.querySelectorAll('button[mat-menu-item]'));
            const deleteBtn = items.find(btn => {
                const icon = btn.querySelector('.material-symbols-outlined');
                return icon && icon.textContent.trim() === 'delete';
            });

            if (deleteBtn) {
                injectAdvancedDeleteButtons(deleteBtn); // 调用新的注入函数
                clearInterval(interval);
            }
        }, 20);
    }

    // [重构] 注入进阶删除按钮组 (同时插入两个按钮)
    function injectAdvancedDeleteButtons(originalDeleteBtn) {
        // --- 辅助函数：创建克隆按钮 ---
        // 增加了 color 参数
        const createBtn = (cls, textKey, iconName, color, clickHandler) => {
            const newBtn = originalDeleteBtn.cloneNode(true);
            newBtn.classList.add(cls); 
            
            // 修改文字
            const textSpan = newBtn.querySelector('.mat-mdc-menu-item-text span:last-child');
            if (textSpan) textSpan.textContent = protect(t(textKey)); 

            // 修改图标颜色和内容
            const iconSpan = newBtn.querySelector('.material-symbols-outlined');
            if (iconSpan) {
                iconSpan.style.color = color; // 应用传入的颜色
                iconSpan.textContent = iconName;
            }

            // 绑定事件
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const backdrop = document.querySelector('.cdk-overlay-backdrop');
                if (backdrop) backdrop.click();
                clickHandler();
            });
            
            return newBtn;
        };

        // 1. 创建“删除本组”按钮 -> 蓝色 (#1a73e8)
        const btnGroup = createBtn(
            'dae-advanced-delete-group', 
            'btn_delete_group', 
            'delete', 
            '#1a73e8', // Google 蓝
            () => handleBatchDelete('group')
        );

        // 2. 创建“删除及下方”按钮 -> 红色 (#d93025)
        const btnBelow = createBtn(
            'dae-advanced-delete-below', 
            'btn_delete_below', 
            'delete', 
            '#d93025', // 警示红
            () => handleBatchDelete('below')
        );

        // 插入到原生删除按钮之后 (反序插入: 先插下面的，再插上面的)
        originalDeleteBtn.after(btnBelow);
        originalDeleteBtn.after(btnGroup);
    }

    // 隐身模式：不再禁用 body 交互，只隐藏 Overlay
    function toggleStealthMode(enabled) {
        const STYLE_ID = 'dae-super-stealth-style';
        const existing = document.getElementById(STYLE_ID);

        if (enabled) {
            if (!existing) {
                const style = document.createElement('style');
                style.id = STYLE_ID;
                style.textContent = `
                    .cdk-overlay-container,
                    .cdk-overlay-backdrop,
                    .cdk-global-overlay-wrapper,
                    .mat-mdc-menu-panel {
                        opacity: 0 !important;
                        visibility: hidden !important; 
                        pointer-events: none !important;
                        transition: none !important;
                        animation: none !important;
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            if (existing) existing.remove();
        }
    }

    function isUserTurn(turnElement) {
        if (!turnElement) return false;
        if (turnElement.querySelector('.chat-turn-container.user')) return true;
        if (turnElement.querySelector('[data-turn-role="User"]')) return true;
        if (turnElement.classList.contains('user')) return true;
        return false;
    }

    // [重构] 核心批量删除处理器
    async function handleBatchDelete(mode) {
        if (!lastTriggeredTurn) return;

        const allTurns = Array.from(document.querySelectorAll('ms-chat-turn'));
        const currentIndex = allTurns.indexOf(lastTriggeredTurn);
        if (currentIndex === -1) return;

        let targetIndices = [];

        // === 分支逻辑：计算要删除的索引 ===
        if (mode === 'group') {
            // --- 逻辑 A: 删除本组 (保持原有逻辑) ---
            const isUser = isUserTurn(lastTriggeredTurn);
            
            if (isUser) {
                // 如果点的是用户：向上找同组(极为罕见)，向下找回复
                let i = currentIndex;
                while (i >= 0 && isUserTurn(allTurns[i])) { targetIndices.unshift(i); i--; }
                i = currentIndex + 1;
                while (i < allTurns.length && isUserTurn(allTurns[i])) { targetIndices.push(i); i++; } // 连发提问
                while (i < allTurns.length && !isUserTurn(allTurns[i])) { targetIndices.push(i); i++; } // 模型回答
            } else {
                // 如果点的是模型：删除自己，并向上找对应的用户提问
                let i = currentIndex;
                while (i < allTurns.length && !isUserTurn(allTurns[i])) { 
                    if (!targetIndices.includes(i)) targetIndices.push(i); 
                    i++; 
                }
                i = currentIndex - 1;
                // 向上找非用户(上下文?)
                while (i >= 0 && !isUserTurn(allTurns[i])) { 
                    if (!targetIndices.includes(i)) targetIndices.unshift(i); 
                    i--; 
                }
                // 向上找用户(提问者)
                while (i >= 0 && isUserTurn(allTurns[i])) { targetIndices.unshift(i); i--; }
            }
        } else if (mode === 'below') {
            // --- 逻辑 B: 删除及下方 (新功能) ---
            // 简单粗暴：从当前索引开始，直到最后
            for (let i = currentIndex; i < allTurns.length; i++) {
                targetIndices.push(i);
            }
        }

        // 去重并排序
        targetIndices = [...new Set(targetIndices)].sort((a, b) => a - b);
        if (targetIndices.length === 0) return;

        console.log(`[Dae] 进阶删除模式: ${mode}, 目标索引: ${targetIndices.join(', ')}`);
        
        // === 执行删除 (复用原有逻辑) ===
        isDeleting = true;

        try {
            toggleStealthMode(true); // 开启隐身模式 (隐藏菜单)

            // 1. 初始视觉隐藏 (立刻给用户反馈)
            targetIndices.forEach(idx => {
                if (allTurns[idx]) allTurns[idx].style.cssText = 'display: none !important;';
            });

            // 2. 倒序删除 (从下往上删，防止索引塌陷虽然我们是重新抓取DOM，但倒序更稳)
            targetIndices.reverse();

            for (const idx of targetIndices) {
                // [关键] 每次重抓 DOM，确保拿到最新的元素引用
                const currentDomTurns = document.querySelectorAll('ms-chat-turn');
                const turn = currentDomTurns[idx];

                if (!turn) continue;

                // 视觉销毁
                turn.style.cssText = `
                    display: block !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    z-index: -9999 !important;
                `;

                // 执行点击
                await deleteSingleTurnActionFast(turn);
                
                // 再次隐藏
                turn.style.display = 'none';
                
                // 间隔
                await new Promise(r => setTimeout(r, 100));
            }

        } catch (err) {
            console.error('[Dae] 删除流程异常:', err);
        } finally {
            // 清理残局
            const backdrops = document.querySelectorAll('.cdk-overlay-backdrop');
            backdrops.forEach(el => el.remove());

            setTimeout(() => {
                toggleStealthMode(false);
                isDeleting = false;
                console.log('[Dae] 批量删除结束');
            }, 200);
        }
    }

    // 极速点击动作
    async function deleteSingleTurnActionFast(turnElement) {
        return new Promise(resolve => {
            const moreBtn = turnElement.querySelector('ms-chat-turn-options button');
            // 如果找不到按钮，可能是特殊回合？尝试找任意 button
            if (!moreBtn) { 
                console.warn('[Dae] 找不到更多按钮，跳过');
                resolve(); 
                return; 
            }

            // 强制点击
            moreBtn.click();

            let attempts = 0;
            // 极速轮询：10ms 一次
            const timer = setInterval(() => {
                attempts++;
                const menuContent = document.querySelector('.mat-mdc-menu-content');
                let targetBtn = null;

                if (menuContent) {
                    const btns = menuContent.querySelectorAll('button[mat-menu-item]');
                    for (const btn of btns) {
                        if (btn.classList.contains('dae-delete-associated')) continue;
                        const icon = btn.querySelector('.material-symbols-outlined');
                        // 宽松匹配：只要图标是 delete
                        if (icon && icon.textContent.trim() === 'delete') {
                            targetBtn = btn;
                            break;
                        }
                    }
                }

                if (targetBtn) {
                    clearInterval(timer);
                    targetBtn.click();
                    resolve(); 
                } else if (attempts > 50) { // 500ms 超时
                    clearInterval(timer);
                    const backdrop = document.querySelector('.cdk-overlay-backdrop');
                    if (backdrop) backdrop.click();
                    resolve(); 
                }
            }, 10);
        });
    }

    // 辅助函数：解析 rgba 字符串为 hex 和 alpha
    function parseRgbaColor(colorStr) {
        // 1. 默认兜底值 (如果不合法则返回这个)
        const defaultResult = { hex: '#000000', alpha: 1 };
        
        if (!colorStr) return defaultResult;

        // 2. 如果是 Hex 格式 (例如 #141313)
        if (colorStr.startsWith('#')) {
            // 补全简写 (例如 #fff -> #ffffff)
            let hex = colorStr;
            if (hex.length === 4) {
                hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
            }
            return { hex: hex, alpha: 1 };
        }

        // 3. 如果是 RGB / RGBA 格式
        const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            const a = match[4] !== undefined ? parseFloat(match[4]) : 1; // 如果没有alpha，默认为1

            // 将 RGB 转为 Hex
            const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            return { hex, alpha: a };
        }

        return defaultResult;
    }

    // 辅助函数：Hex + Alpha 转 rgba 字符串
    function hexToRgbaStr(hex, alpha) {
        let c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
        }
        return 'rgba(0,0,0,0.1)'; // 失败兜底
    }

    function main(event) {
        console.log('[Gemini 对话清除器] 清除按钮已触发');
        const triggerBtn = event ? event.currentTarget : null;
        showConfirmAndRun(performClear, triggerBtn);
    }

    function init() {
        console.log('[Gemini 对话清除器] 正在初始化...');
        // 启动主题系统
        initThemeSystem();

        // 1. 应用各类视觉设置
        updateDisclaimerVisibility();
        updateFeedbackButtonsVisibility(); // 初始化调用
        updateApiKeyVisibility();
        
        // 应用 Markdown 优化
        updateAllMarkdownStyles();
        
        // 初始化根主题变量
        updateRootThemeVariables();
        
        // 字体大小
        updateFontSize();
        
        // 2. 注册菜单
        registerMenuCommands();

        // 3. 按钮位置
        ensureCorrectButtonPlacement();
        startToolbarObserver();
        installLocationChangeHook();

        // 4. 启动各项功能 (内部不再读 GM_getValue，而是读 activeSettings)
        setupPasteInterceptor();
        setupSelectionToFileHandler();
        setupCodePasteHandler();
        setupFreezeShortcut();
        setupQuoteHandler();
        setupSendInterceptor();
        // 启动关联删除功能
        setupAssociationDeleter();
        
        // 启动编辑按钮监听
        setupEditCompleteObserver(); 
        
        // 5. 滚动导航 (现在由 applyScrollNavState 管理)
        applyScrollNavState();

        // 6. 插入设置按钮
        insertSettingsButton(); 
        
        // 启动指令抓取器
        instructionScraper.init();

        // 7. 初始化自动配置监听器
        autoConfigLogic.initListener();

        // 尝试执行自动配置 (仅针对 /prompts/new_chat 有效，内部有判断)
        // 给予多次尝试机会，应对 DOM 延迟
        setTimeout(() => autoConfigLogic.execute(), 1000);
        setTimeout(() => autoConfigLogic.execute(), 3000);

        // B. 强制更新列表 (针对所有页面，包括旧聊天)
        // 无论当前在哪个页面，加载 1.5 秒后都强制后台扫描一次列表
        // 这样可以确保用户刷新旧聊天页面时，也能获取到最新的系统指令
        setTimeout(() => {
            console.log('[Gemini 优化] 🔄 页面加载完成，执行列表同步...');
            autoConfigLogic.forceUpdateList();
        }, 1500);
    }

    let toolbarObserver = null;

    let specificToolbarObserver = null;

    function startToolbarObserver() {
        if (toolbarObserver) return;
        
        // 核心逻辑：只要 DOM 变了，就尝试去修补 UI
        const checkAndInject = () => {
            // 1. 尝试插入清空按钮
            ensureCorrectButtonPlacement();
            
            // 2. 尝试插入设置按钮 (如果面板打开)
            insertSettingsButton();
            
            // 3. 尝试插入后缀开关 (如果面板打开)
            injectSuffixToggle();

            // 检查独立开关
            if (activeSettings.enableBoldSpacingFix) {
                optimizeMarkdownText();
            }

            // 4. 处理移动端/面板遮挡逻辑 (引用按钮/导航按钮隐藏)
            const isMobile = window.innerWidth < 768;
            // 只要能找到 overlay-header 或者 dae 面板，就认为有遮挡
            const hasOverlay = document.querySelector('.overlay-header') || document.querySelector('.dae-settings-panel');
            
            const shouldHide = isMobile && hasOverlay;
            
            const upBtn = document.getElementById('gemini-scroll-up');
            const downBtn = document.getElementById('gemini-scroll-down');
            if (upBtn) upBtn.classList.toggle('force-hidden', !!shouldHide);
            if (downBtn) downBtn.classList.toggle('force-hidden', !!shouldHide);
            if (typeof quoteBtn !== 'undefined' && quoteBtn) {
                quoteBtn.classList.toggle('force-hidden', !!shouldHide);
            }
        };

        // 使用 MutationObserver 监听 body 变化
        toolbarObserver = new MutationObserver((mutations) => {
            // 简单防抖，一帧内只执行一次
            requestAnimationFrame(checkAndInject);
            
            // 特殊处理：检测设置面板关闭，以恢复引用按钮
            let panelJustClosed = false;
            for (const mutation of mutations) {
                if (mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach(node => {
                        // 检测 overlay-header 被移除
                        if (node.nodeType === 1 && 
                           (node.classList?.contains('overlay-header') || node.querySelector?.('.overlay-header'))) {
                            panelJustClosed = true;
                        }
                    });
                }
            }
            if (panelJustClosed && activeSettings.enableQuote) {
                setTimeout(() => handleSelectionCheck(), 50);
            }
        });

        toolbarObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 立即执行一次
        checkAndInject();
        
        console.log('[Gemini 优化] 增强版 DOM 观察器已启动');
    }

    // 专门监听工具栏区域的变化，实时调整清空按钮位置
    function startSpecificToolbarObserver() {
        // 查找工具栏容器的辅助函数
        const findToolbarContainer = () => {
            // 通过比较按钮或原始模式按钮找到工具栏容器
            const compareBtn = document.querySelector(COMPARE_BUTTON_SELECTOR);
            const rawModeBtn = document.querySelector(RAW_MODE_BUTTON_SELECTOR);
            const referenceBtn = compareBtn || rawModeBtn;

            if (referenceBtn) {
                return referenceBtn.parentNode;
            }
            return null;
        };

        // 设置观察器的主要函数
        const setupObserver = () => {
            const toolbarContainer = findToolbarContainer();

            if (toolbarContainer) {
                // 如果已有观察器，先断开
                if (specificToolbarObserver) {
                    specificToolbarObserver.disconnect();
                }

                // 创建专门的工具栏观察器
                specificToolbarObserver = new MutationObserver((mutations) => {
                    // 检查是否有按钮添加或移除
                    let shouldReposition = false;

                    for (const mutation of mutations) {
                        if (mutation.type === 'childList') {
                            // 检查添加的节点
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === 1) { // 元素节点
                                    if (node.matches && (node.matches(COMPARE_BUTTON_SELECTOR) || node.matches(RAW_MODE_BUTTON_SELECTOR))) {
                                        shouldReposition = true;
                                        console.log('[Gemini 对话清除器] 检测到工具栏按钮添加:', node);
                                    }
                                }
                            });

                            // 检查移除的节点
                            mutation.removedNodes.forEach(node => {
                                if (node.nodeType === 1) {
                                    if (node.matches && (node.matches(COMPARE_BUTTON_SELECTOR) || node.matches(RAW_MODE_BUTTON_SELECTOR))) {
                                        shouldReposition = true;
                                        console.log('[Gemini 对话清除器] 检测到工具栏按钮移除:', node);
                                    }
                                }
                            });
                        }
                    }

                    // 如果检测到变化且当前是临时聊天模式，重新定位按钮
                    if (shouldReposition && isIncognitoMode()) {
                        console.log('[Gemini 对话清除器] 工具栏结构变化，重新定位清空按钮');
                        // 延迟一点以确保 DOM 完全更新
                        setTimeout(() => {
                            const toolbarBtn = document.getElementById('gemini-cleaner-toolbar-btn');
                            if (toolbarBtn) {
                                toolbarBtn.remove();
                            }
                            insertToolbarButton();
                        }, 50);
                    }
                });

                // 开始观察工具栏容器
                specificToolbarObserver.observe(toolbarContainer, {
                    childList: true,
                    subtree: false // 只监听直接子节点变化
                });

                console.log('[Gemini 对话清除器] 工具栏专用观察器已启动');
            } else {
                // 如果暂时找不到工具栏，稍后重试
                setTimeout(setupObserver, 1000);
            }
        };

        setupObserver();
    }

    function installLocationChangeHook() {
        if (window.__geminiCleanerLocationHookInstalled) return;
        window.__geminiCleanerLocationHookInstalled = true;

        // 包装history方法以触发自定义事件
        const wrap = (type) => {
            const orig = history[type];
            return function() {
                const ret = orig.apply(this, arguments);
                window.dispatchEvent(new Event('locationchange'));
                return ret;
            };
        };

        // 监听前进后退按钮
        history.pushState = wrap('pushState');
        history.replaceState = wrap('replaceState');
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));

        // 监听位置变化事件，重新定位按钮
        window.addEventListener('locationchange', () => {
            // 1. 基础 UI 修复 (按钮位置、Markdown渲染)
            setTimeout(() => {
                ensureCorrectButtonPlacement();
                if (activeSettings.enableBoldSpacingFix) {
                    optimizeMarkdownText();
                }
            }, 500);

            // 2. 尝试自动应用指令 (如果是进入新聊天)
            setTimeout(() => autoConfigLogic.execute(), 500);

            // 3. 空列表自动补救机制
            // 如果检测到列表为空，且切换了页面，则强制扫描一次
            setTimeout(() => {
                const currentList = activeSettings.savedSystemInstructions;
                if (!currentList || currentList.length === 0) {
                    console.log('[Gemini 优化] ⚠️ 检测到指令列表为空，正在尝试获取...');
                    autoConfigLogic.forceUpdateList();
                }
            }, 2500); // 稍微延迟一点，等待页面加载稳态
        });
    }

    // 根据DOM加载状态决定初始化时机
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[Gemini 对话清除器] DOMContentLoaded 事件已触发');
            init();
        });
    } else {
        console.log('[Gemini 对话清除器] DOM 已加载，立即进行初始化');
        init();
    }

})();