// ==UserScript==
// @name               PicKit
// @name:zh-CN         拾字
// @namespace          https://github.com/CodebyGPT/PicKit
// @version            2026.01.05
// @description        Reduce the number of mouse clicks for users
// @description:zh-CN  帮你少点一次鼠标
// @author             CodebyGPT
// @license            GPL-3.0
// @license            https://www.gnu.org/licenses/gpl-3.0.txt
// @match              *://*/*
// @icon               data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjx0aXRsZSB4bWxucz0iIj50b3VjaC10cmlwbGU8L3RpdGxlPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0ibTE3Ljk3NSAzLjRsMS0xLjc1cTEuMTc1LjY1IDEuODUgMS44MjVUMjEuNSA2cTAgLjY3NS0uMTc1IDEuMzEzdC0uNSAxLjE4N2wtMS43MjUtMXEuMi0uMzUuMy0uNzEyVDE5LjUgNnEwLS44LS40MTItMS41dC0xLjExMy0xLjFtLTQgMGwxLTEuNzVxMS4xNzUuNjUgMS44NSAxLjgyNVQxNy41IDZxMCAuNjc1LS4xNzUgMS4zMTN0LS41IDEuMTg3bC0xLjcyNS0xcS4yLS4zNS4zLS43MTJUMTUuNSA2cTAtLjgtLjQxMy0xLjV0LTEuMTEyLTEuMW0tMy41IDE4LjZxLS43IDAtMS4zMTItLjN0LTEuMDM4LS44NWwtNS40NS02LjkyNWwuNDc1LS41cS41LS41MjUgMS4yLS42MjV0MS4zLjI3NUw3LjUgMTQuMlY2cTAtLjQyNS4yODgtLjcxMlQ4LjUgNXQuNzI1LjI4OHQuMy43MTJ2NUgxN3ExLjI1IDAgMi4xMjUuODc1VDIwIDE0djRxMCAxLjY1LTEuMTc1IDIuODI1VDE2IDIyem0tNi4zLTEzLjVxLS4zMjUtLjU1LS41LTEuMTg3VDMuNSA2cTAtMi4wNzUgMS40NjMtMy41MzdUOC41IDF0My41MzggMS40NjNUMTMuNSA2cTAgLjY3NS0uMTc1IDEuMzEzdC0uNSAxLjE4N2wtMS43MjUtMXEuMi0uMzUuMy0uNzEyVDExLjUgNnEwLTEuMjUtLjg3NS0yLjEyNVQ4LjUgM3QtMi4xMjUuODc1VDUuNSA2cTAgLjQyNS4xLjc4OHQuMy43MTJ6Ii8+PC9zdmc+
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_openInTab
// @grant              GM_addStyle
// @grant              GM_setClipboard
// @sandbox            DOM
// @inject-into        content
// @run-at             document-start
// @supportURL         https://github.com/CodebyGPT/PicKit/issues
// @downloadURL https://update.greasyfork.org/scripts/558720/PicKit.user.js
// @updateURL https://update.greasyfork.org/scripts/558720/PicKit.meta.js
// ==/UserScript==

/*
 * 非原创内容声明：
 * 1. Icon 来自 allsvgicons.com 提供的 Material Symbols 图标库。
 * 2. 脚本大部分代码参考或直接使用了 Gemini 3 Pro Preview、ChatGPT、Kimi K2、Qwen3-Max 等 LLM 的输出结果。
 * 3. 快速粘贴网盘提取码功能参考了 greasyfork.org/zh-CN/scripts/445489-网盘链接识别、greasyfork.org/zh-CN/scripts/439266-网盘有效性检查、github.com/Magiclyan/panAI（forked from syhyz1990/panAI）等脚本。
 * 4. 中文文本校正功能的部分语法规则参考了 github.com/sparanoid/chinese-copywriting-guidelines 中的内容。
 * 
 * Non-original content disclaimer:
 * 1. The icon is sourced from the Material Symbols icon library provided by allsvgicons.com.
 * 2. The script primarily references or directly utilizes the output results from large language models (LLMs) such as Gemini 3 Pro Preview, ChatGPT, Kimi K2, and Qwen3-Max.
 * 3. The quick paste function for cloud storage extraction codes draws inspiration from scripts such as greasyfork.org/zh-CN/scripts/445489-网盘链接识别, greasyfork.org/zh-CN/scripts/439266-网盘有效性检查, and github.com/Magiclyan/panAI (forked from syhyz1990/panAI).
 * 4. The grammatical rules for the Chinese text correction feature are partially referenced from the content on github.com/sparanoid/chinese-copywriting-guidelines.
 * 
 * Заявление о неоригинальном контенте:
 * 1. Иконка взята из библиотеки Material Symbols, предоставленной сайтом allsvgicons.com.
 * 2. Большая часть кода скрипта заимствована или использована напрямую из Gemini 3 Pro Preview, ChatGPT и Kimi.
 * 3. Функция быстрого вставления кода извлечения облачного хранилища вдохновлена скриптами, такими как greasyfork.org/zh-CN/scripts/445489-网盘链接识别, greasyfork.org/zh-CN/scripts/439266-网盘有效性检查, github.com/Magiclyan/panAI (forked from syhyz1990/panAI).
 * 4. Некоторые грамматические правила функции коррекции китайского текста частично основаны на материале с github.com/sparanoid/chinese-copywriting-guidelines.
 */

(function () {
    'use strict';
    // 0. 异步兼容层 (Async Compatibility Layer)
    // 优先使用 GM.getValue (标准异步)，降级使用 GM_getValue (Tampermonkey同步)
    const safeGetValue = (key, def) => {
        if (typeof GM !== 'undefined' && GM.getValue) {
            return GM.getValue(key, def);
        } else {
            return Promise.resolve(GM_getValue(key, def));
        }
    };

    const safeSetValue = (key, val) => {
        if (typeof GM !== 'undefined' && GM.setValue) {
            return GM.setValue(key, val);
        } else {
            return Promise.resolve(GM_setValue(key, val));
        }
    };
const safeOpenTab = (url, options) => {
    if (typeof GM !== 'undefined' && GM.openInTab) {
        // 现代异步标准 (GM.openInTab)
        GM.openInTab(url, options);
    } else {
        // 旧版同步标准 (GM_openInTab)
        GM_openInTab(url, options);
    }
};

    // =========================================================================
    // 1. 配置与状态管理 (Configuration & State)
    // =========================================================================

    const DEFAULT_CONFIG = {
        language: 'auto', // 'auto'（默认） | 'zh-CN' | 'en' | 'ru'
        positionMode: 'endchar', // 'endchar' | 'mouse'
        offset: 12, // px
        timeout: 2400, // ms, 0 = infinite
        buttonStyle: 'row', // 'row' (capsule) | 'col' (rounded rect)
        forceWhiteBlack: true, // true = force white bg/black text
        searchEngine: 'baidu', // key or custom url
        enableToast: true,
        enableCache: true,
        unlockHotkey: 'ControlLeft',
        enablePaste: true,
        inputRecoveryMode: 'off', // 'off' | 'loose' (default, ignore tracking params) | 'strict'
        enableDragPreview: false,
        scrollRepaintMode: 'always',
    };

    const SCROLL_REPAINT_MODE = {
    ALWAYS: 'always',      // 1. 始终重绘（默认）
    VIEWPORT: 'viewport',  // 2. 锚点在视口内才重绘
    HIDE: 'hide'           // 3. 滚动即隐藏，不重绘
};

    const PASTE_MODE_THREE_BTNS = 'copy-search-paste';   // 闪电粘贴三按钮模式标记

    const SEARCH_ENGINES = {
        google: { name: 'Google', url: 'https://www.google.com/search?q=%s' },
        baidu: { name: 'Baidu', url: 'https://www.baidu.com/s?wd=%s' },
        bing: { name: 'Bing', url: 'https://www.bing.com/search?q=%s' },
        brave: { name: 'Brave', url: 'https://search.brave.com/search?q=%s' },
    };

    // [新增] 网盘域名匹配规则 (用于闪电粘贴密码提取)
    const PAN_DOMAINS = [
        'pan.baidu.com', 'lanzou', 'weiyun.com', 'cloud.189.cn',
        'aliyundrive.com', 'alipan.com', '123pan.com', 'pan.quark.cn',
        'pan.xunlei.com', '115.com', 'drive.uc.cn', 'fast.uc.cn', 'ctfile.com'
    ];
    // [新增] 网盘密码提取正则
    const PAN_CODE_REGEX = /(?:提取码|密码|访问码|分享码|口令)\s*[:：]?\s*([a-zA-Z0-9]{4})(?![a-zA-Z0-9])/;
    
    // [新增] 仅在当前Tab有效的网盘密码缓存（用于新标签页接收）
    let sessionPanCode = null;

    // 运行时状态
    let cachedSelection = { text: '', html: '' };
    let uiTimer = null;
    let toastTimer = null;
    let isScrolling = false;
    let scrollTimeout = null;
    let shadowRoot = null;
    let hostElement = null;

    // 获取配置
// 1. 配置缓存对象 (初始化为默认值)
    let configCache = { ...DEFAULT_CONFIG };

    // 新的同步读取 (直接读内存，速度最快，不阻塞UI)
    const getConfig = (key) => {
        return configCache[key];
    };

    // 新的异步写入 (更新内存 + 保存到存储)
    const setConfig = async (key, val) => {
        configCache[key] = val; // 立即更新内存，保证交互响应
        await safeSetValue(key, val); // 异步写入持久化存储
    };

    // 多语言支持系统 (I18N System)
    const I18N = {
        'zh-CN': {
            lang_name: '简体中文',
            menu_lang: '🌐 语言/Language',
            menu_pos: '📍 定位模式',
            val_endchar: '字符末尾',
            val_mouse: '鼠标位置',
            menu_offset: '📏 弹出偏移量',
            prompt_offset: '请输入按钮距离选区的偏移量 (px):',
            menu_timeout: '⏱️ 停留时长',
            val_infinite: '不消失',
            prompt_timeout: '请输入停留时长 (ms, 0表示不自动消失):',
            menu_style: '🎨 按钮布局',
            val_row: '横排胶囊',
            val_col: '纵排矩形',
            menu_theme: '🌓 配色方案',
            val_light: '强制浅色',
            val_auto: '自动反色',
            menu_search: '🔍 搜索引擎',
            prompt_search: '请输入搜索引擎代码 (google, baidu, bing, brave) 或完整URL (%s 代替关键词):',
            err_search: '无效输入。自定义URL需包含 %s',
            menu_cache: '💾 选中即缓存',
            val_on: '开启',
            val_off: '关闭',
            menu_toast: '🔔 复制反馈',
            menu_hotkey: '🔑 超级划词键',
            val_disabled: '已禁用',
            prompt_hotkey: '请按下快捷键 (如 Ctrl, Alt, Shift) 或输入 "NONE" 禁用:',
            menu_paste: '⚡ 闪电粘贴',
            menu_block: '🚫 屏蔽页面自带划词条',
            menu_clear: '🗑️ 清除当前域名屏蔽规则',
            confirm_clear: '确定要清除 %s 下所有屏蔽规则吗？',
            alert_cleared: '规则已清除，请刷新。',
            alert_no_rules: '当前域名无已保存规则。',
            menu_reset: '⚙️ 重置所有设置',
            confirm_reset: '确定要重置所有设置吗？',
            toast_unlock: '🔓 超级划词已激活',
            toast_copied: '已复制',
            toast_pasted: '已粘贴',
            toast_paste_compat: '已粘贴 (兼容模式)',
            toast_paste_fail: '粘贴失败',
            picker_active: '进入拾取模式；按 ESC 退出',
            picker_cant_block_self: '不能屏蔽脚本自身的按钮！',
            picker_confirm: '确定屏蔽该元素吗？(按Esc退出)\n\n选择器: %s',
            picker_saved: '元素已屏蔽并保存规则',
            picker_exit: '已退出拾取模式',
            btn_copy: '复制',
            btn_search: '搜索',
            btn_paste: '粘贴',
            festival_cny: '🏮已复制🏮',
            festival_xmas: '🎄已复制🎄',
            btn_open_link: '打开链接',
            toast_password_pasted: '已粘贴提取码',
            menu_drag_preview: '🔗 拖拽预览',
            btn_cut: '剪切',
            menu_edit: '✏️ 编辑网页',
            menu_exit_edit: '已退出编辑',
            btn_delete: '删除',
            btn_bold: '加粗',
            btn_highlight: '标记',
            disclaimer_text: '此网页内容已经过 <SCRIPT_NAME> 编辑，仅出于简化网页便于浏览之目的，不作他用。',
            scroll_repaint: '📜 UI 重绘',
scroll_always: '始终重绘',
scroll_viewport: '锚点在视口内重绘',
scroll_hide: '始终不重绘',
        },
        'en': {
            lang_name: 'English',
            menu_lang: '🌐 Language',
            menu_pos: '📍 Position',
            val_endchar: 'End of Text',
            val_mouse: 'Mouse Cursor',
            menu_offset: '📏 Offset',
            prompt_offset: 'Enter offset distance (px):',
            menu_timeout: '⏱️ Timeout',
            val_infinite: 'Infinite',
            prompt_timeout: 'Enter timeout (ms, 0 = infinite):',
            menu_style: '🎨 Layout',
            val_row: 'Row (Capsule)',
            val_col: 'Column (Rect)',
            menu_theme: '🌓 Theme',
            val_light: 'Force Light',
            val_auto: 'Auto Contrast',
            menu_search: '🔍 Engine',
            prompt_search: 'Enter engine code (google, bing...) or URL with %s:',
            err_search: 'Invalid input. Custom URL must contain %s',
            menu_cache: '💾 Cache Selection',
            val_on: 'On',
            val_off: 'Off',
            menu_toast: '🔔 Toast Notification',
            menu_hotkey: '🔑 Unlock Hotkey',
            val_disabled: 'Disabled',
            prompt_hotkey: 'Press a key (Ctrl, Alt...) or type "NONE" to disable:',
            menu_paste: '⚡ Smart Paste',
            menu_block: '🚫 Block Page Element',
            menu_clear: '🗑️ Clear Block Rules',
            confirm_clear: 'Clear all rules for %s?',
            alert_cleared: 'Rules cleared. Please refresh.',
            alert_no_rules: 'No rules found for this domain.',
            menu_reset: '⚙️ Reset Settings',
            confirm_reset: 'Reset all settings?',
            toast_unlock: '🔓 Unlock Mode Active',
            toast_copied: 'Copied',
            toast_pasted: 'Pasted',
            toast_paste_compat: 'Pasted (Compat)',
            toast_paste_fail: 'Paste Failed',
            picker_active: 'Picker Mode Active (ESC to exit)',
            picker_cant_block_self: 'Cannot block script UI!',
            picker_confirm: 'Block this element? (ESC to cancel)\n\nSelector: %s',
            picker_saved: 'Element blocked & saved.',
            picker_exit: 'Picker Mode Exited',
            btn_copy: 'Copy',
            btn_search: 'Search',
            btn_paste: 'Paste',
            festival_cny: '🏮 Copied 🏮',
            festival_xmas: '🎄 Copied 🎄',
            btn_open_link: 'Open Link',
            toast_password_pasted: 'Code Pasted',
            menu_drag_preview: '🔗 Drag Link Preview',
            btn_cut: 'Cut',
            menu_edit: '✏️ Edit Page',
            menu_exit_edit: 'Exit Edit Mode',
            btn_delete: 'Delete',
            btn_bold: 'Bold',
            btn_highlight: 'Highlight',
            disclaimer_text: 'Content edited by <SCRIPT_NAME> for simplification purposes only.',
            scroll_repaint: '📜 UI redrawing',
scroll_always: 'Always redraw',
scroll_viewport: 'Redraw anchor points within the viewport',
scroll_hide: 'Never redraw',
        },
        'ru': {
            lang_name: 'Русский',
            menu_lang: '🌐 Язык/Language',
            menu_pos: '📍 Позиция',
            val_endchar: 'Конец текста',
            val_mouse: 'Курсор мыши',
            menu_offset: '📏 Отступ',
            prompt_offset: 'Введите отступ (px):',
            menu_timeout: '⏱️ Задержка',
            val_infinite: 'Бесконечно',
            prompt_timeout: 'Введите задержку (мс, 0 = бесконечно):',
            menu_style: '🎨 Стиль кнопок',
            val_row: 'Строка',
            val_col: 'Колонка',
            menu_theme: '🌓 Тема',
            val_light: 'Светлая',
            val_auto: 'Авто',
            menu_search: '🔍 Поисковик',
            prompt_search: 'Код (google, yandex...) или URL с %s:',
            err_search: 'Ошибка. URL должен содержать %s',
            menu_cache: '💾 Кэш выделения',
            val_on: 'Вкл',
            val_off: 'Выкл',
            menu_toast: '🔔 Уведомления',
            menu_hotkey: '🔑 Горячая клавиша',
            val_disabled: 'Откл',
            prompt_hotkey: 'Нажмите клавишу (Ctrl, Alt...) или "NONE":',
            menu_paste: '⚡ Быстрая вставка',
            menu_block: '🚫 Блокировка элементов',
            menu_clear: '🗑️ Сброс блокировок',
            confirm_clear: 'Удалить правила для %s?',
            alert_cleared: 'Правила удалены. Обновите страницу.',
            alert_no_rules: 'Нет правил для этого домена.',
            menu_reset: '⚙️ Сброс настроек',
            confirm_reset: 'Сбросить все настройки?',
            toast_unlock: '🔓 Режим разблокировки',
            toast_copied: 'Скопировано',
            toast_pasted: 'Вставлено',
            toast_paste_compat: 'Вставлено (совм.)',
            toast_paste_fail: 'Ошибка вставки',
            picker_active: 'Режим выбора (ESC для выхода)',
            picker_cant_block_self: 'Нельзя блокировать кнопки скрипта!',
            picker_confirm: 'Блокировать элемент? (ESC - отмена)\n\nСелектор: %s',
            picker_saved: 'Заблокировано и сохранено.',
            picker_exit: 'Режим выбора отключен',
            btn_copy: 'Копировать',
            btn_search: 'Поиск',
            btn_paste: 'Вставить',
            festival_cny: '🏮 Скопировано 🏮',
            festival_xmas: '🎄 Скопировано 🎄',
            btn_open_link: 'Открыть ссылку',
            toast_password_pasted: 'Код вставлен',
            menu_drag_preview: '🔗 Предпросмотр ссылки',
            btn_cut: 'Вырезать',
            menu_edit: '✏️ Редактировать',
            menu_exit_edit: 'Выход из редактора',
            btn_delete: 'Удалить',
            btn_bold: 'Жирный',
            btn_highlight: 'Маркер',
            disclaimer_text: 'Контент отредактирован <SCRIPT_NAME> только для упрощения просмотра.',
            scroll_repaint: '📜 Перерисовка интерфейса',
scroll_always: 'Всегда перерисовывать',
scroll_viewport: 'Анкор перерисовывается внутри окна просмотра',
scroll_hide: 'Всегда не перерисовывать',
        }
    };

    const t = (key, ...args) => {
        let lang = getConfig('language');
        if (lang === 'auto') {
            const nav = navigator.language.toLowerCase();
            if (nav.startsWith('zh')) lang = 'zh-CN';
            else if (nav.startsWith('ru')) lang = 'ru';
            else lang = 'en';
        }
        const dict = I18N[lang] || I18N['en'];
        let str = dict[key] || key;
        args.forEach(arg => str = str.replace('%s', arg));
        return str;
    };

    // --- 新增：编辑模式与合规声明状态 ---
    let isEditMode = false;
    let hasEditSessionStarted = false; // 标记本次会话是否启用过编辑模式
    let complianceObserver = null;
    let currentBannerId = null;

    // 生成随机ID (防拦截)
    const generateRandomId = () => 'tm-sc-' + Math.random().toString(36).slice(2, 9);

    // 创建/重建合规声明
    function ensureComplianceBanner() {
        if (!hasEditSessionStarted) return; // 如果从未启动过编辑模式，不生成

        // 1. 检查是否已存在
        const existing = currentBannerId ? document.getElementById(currentBannerId) : null;
        if (existing && existing.offsetParent !== null) return;// 如果存在且看起来正常（display不是none），则跳过
        if (existing) existing.remove();// 如果存在但被隐藏了，或者不存在，则继续重建逻辑

        // 2. 如果之前有Observer，先断开，避免重新插入时死循环
        if (complianceObserver) {
            complianceObserver.disconnect();
        }

        // 3. 创建元素
        const scriptName = GM_info.script.name;
        const banner = document.createElement('div');
        currentBannerId = generateRandomId();
        banner.id = currentBannerId;

        banner.setAttribute('data-tm-policy', 'protected'); // [关键] 添加特殊策略标记，用于 CSS 排除
        banner.setAttribute('contenteditable', 'false'); 
        
        // 样式：高层级、半透明白底、浅灰字、底部居中、禁止选中、穿透点击(防Picker)
        banner.style.cssText = `
            position: fixed !important;
            bottom: 50px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 2147483647 !important;
            background: rgba(255, 255, 255, 0.85) !important;
            padding: 6px 14px !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08) !important;
            pointer-events: none !important; /* 让鼠标穿透，既不影响浏览，也防止被拾取器选中 */
            user-select: none !important;
            -webkit-user-select: none !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: auto !important;
            height: auto !important;
            border: 1px solid rgba(0,0,0,0.05) !important;
        `;

        // SVG 图标 (Info)
        const iconContainer = document.createElement('div');
        iconContainer.style.cssText = 'display:flex;align-items:center;color:#888;pointer-events:none;';
        iconContainer.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        banner.appendChild(iconContainer);
        
        // 2. 文本 (使用 Canvas 绘制，防篡改)
        const textStr = t('disclaimer_text').replace('<SCRIPT_NAME>', scriptName);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const fontSize = 12;
        const fontFamily = 'sans-serif';
        
        // 测量文本宽度
        ctx.font = `${fontSize}px ${fontFamily}`;
        const metrics = ctx.measureText(textStr);
        const textWidth = Math.ceil(metrics.width);
        const textHeight = Math.ceil(fontSize * 1.2); // 留一点行高

        // 设置 Canvas 尺寸 (考虑高分屏清晰度，使用 2x 缩放)
        const dpr = window.devicePixelRatio || 1;
        canvas.width = textWidth * dpr;
        canvas.height = textHeight * dpr;
        canvas.style.width = `${textWidth}px`;
        canvas.style.height = `${textHeight}px`;
        canvas.style.pointerEvents = 'none';

        // 绘制
        ctx.scale(dpr, dpr);
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = '#999';
        ctx.textBaseline = 'middle';
        ctx.fillText(textStr, 0, textHeight / 2 + 1); // +1 微调垂直居中

        banner.appendChild(canvas);
        document.body.appendChild(banner);

        // 4. 启动被动监视 (MutationObserver)
        complianceObserver = new MutationObserver((mutations) => {
            let needsRebuild = false;
            mutations.forEach(m => {
                // 如果节点被移除
                if (m.removedNodes.length) {
                    m.removedNodes.forEach(node => {
                        if (node.id === currentBannerId) needsRebuild = true;
                    });
                }
                // 如果属性被篡改 (如 style set to none)
                if (m.target.id === currentBannerId) {
                     needsRebuild = true;
                }
                // 子节点变化 (例如 Canvas 被删除了)
                if (m.target.id === currentBannerId && m.type === 'childList') needsRebuild = true;
            });

            if (needsRebuild) { // 异步重建防止死锁
                // 只要检测到针对Banner的任何改动，立即销毁旧的并重建
                setTimeout(() => { // 使用 setTimeout 避免在Observer回调中同步操作DOM
                const old = document.getElementById(currentBannerId); // 销毁旧的引用（如果还在DOM里但被改了）
                if (old) old.remove();
                // 立即重建
                ensureComplianceBanner();
                }, 0);
            }
        });

        complianceObserver.observe(document.body, { childList: true, subtree: false }); // 监控 body 子节点删除
        // 监视 banner 自身的属性变化 (防止通过 style="display:none" 隐藏)
        setTimeout(() => { // 注意：这里需要再次获取最新的 banner 引用
            const b = document.getElementById(currentBannerId);
            if(b && complianceObserver) {
                 complianceObserver.observe(b, { attributes: true, attributeFilter: ['style', 'class', 'hidden', 'id', 'data-tm-policy', 'contenteditable'], childList: true, subtree: true });
            }
        }, 0);
    }

    // 切换编辑模式
    function toggleEditMode(enable) {
        if (isEditMode === enable) return;
        isEditMode = enable;

        if (isEditMode) {
            hasEditSessionStarted = true; // 标记会话已开始，此后 Banner 即使退出编辑模式也会常驻
            document.designMode = 'on';
            ensureComplianceBanner();
            showToast(t('menu_edit') + ': ' + t('val_on'));
        } else {
            document.designMode = 'off';
            showToast(t('menu_exit_edit'));
            hideUI(); // 隐藏可能残留的按钮

            ensureComplianceBanner();  // 确保 Banner 依然存在 (防止在切换瞬间被误删)
        }
    }

    // ===============
    // 2. 菜单系统 (GM Menu System)
    // ===============
// 启动时一次性加载所有配置
    async function initConfiguration() {
        configCache['scrollRepaintMode'] = await safeGetValue('scrollRepaintMode', 'always');  // 在 getConfig 读取处也加一行（initConfiguration 里）
        const keys = Object.keys(DEFAULT_CONFIG);
        // 并行读取所有配置，提高速度
        const values = await Promise.all(
            keys.map(key => safeGetValue(key, DEFAULT_CONFIG[key]))
        );
        
        // 将读取到的值写入缓存
        keys.forEach((key, index) => {
            configCache[key] = values[index];
        });
        
        // 额外加载屏蔽规则 (blocked_elements)
        const blockedRules = await safeGetValue('blocked_elements', {});
        
        // 专门处理 blocked_elements 的缓存
        configCache['blocked_elements'] = blockedRules;
    }
    function registerMenus() {
        // 这种做法在某些管理器中可能需要刷新页面才能更新菜单文字，但在现代Tampermonkey中通常有效
        // 为保证响应性，点击后我们弹窗提示或重刷菜单
        // 1. 语言设置 (Language)
        const curLang = getConfig('language');
        const langLabel = curLang === 'auto' ? 'Auto' : (I18N[curLang] ? I18N[curLang].lang_name : curLang);
        GM_registerMenuCommand(`${t('menu_lang')}: ${langLabel}`, () => {
            const nextMap = { 'auto': 'zh-CN', 'zh-CN': 'en', 'en': 'ru', 'ru': 'auto' };
            setConfig('language', nextMap[curLang] || 'auto');
            location.reload();
        });
        
        // 2.1 定位模式
        const posMode = getConfig('positionMode');
        GM_registerMenuCommand(`${t('menu_pos')}: ${posMode === 'endchar' ? t('val_endchar') : t('val_mouse')}`, () => {
            setConfig('positionMode', posMode === 'endchar' ? 'mouse' : 'endchar');
            location.reload(); // 刷新以更新菜单状态
        });

        // 2.2 偏移量
        GM_registerMenuCommand(`${t('menu_offset')}: ${getConfig('offset')}px`, () => {
            const val = prompt(t('prompt_offset'), getConfig('offset'));
            if (val !== null && !isNaN(val)) {
                setConfig('offset', parseInt(val, 10));
                location.reload();
            }
        });

//按钮重绘策略
        const scrollMode = getConfig('scrollRepaintMode');
const modeText = {
  always: t('scroll_always'),
  viewport: t('scroll_viewport'),
  hide: t('scroll_hide')
};
GM_registerMenuCommand(`${t('scroll_repaint')}: ${modeText[scrollMode]}`, () => {
  const nextMap = { always: 'viewport', viewport: 'hide', hide: 'always' };
  setConfig('scrollRepaintMode', nextMap[scrollMode] || 'always');
  location.reload();
});

        // 2.3 停留时长
        const timeout = getConfig('timeout');
        GM_registerMenuCommand(`${t('menu_timeout')}: ${timeout === 0 ? t('val_infinite') : timeout + 'ms'}`, () => {
            const val = prompt(t('prompt_timeout'), timeout);
            if (val !== null && !isNaN(val)) {
                setConfig('timeout', parseInt(val, 10));
                location.reload();
            }
        });

        // 2.4 按钮样式
        const btnStyle = getConfig('buttonStyle');
        GM_registerMenuCommand(`${t('menu_style')}: ${btnStyle === 'row' ? t('val_row') : t('val_col')}`, () => {
            setConfig('buttonStyle', btnStyle === 'row' ? 'col' : 'row');
            location.reload();
        });

        // 2.5 配色方案
        const forceWB = getConfig('forceWhiteBlack');
        GM_registerMenuCommand(`${t('menu_theme')}: ${forceWB ? t('val_light') : t('val_auto')}`, () => {
            setConfig('forceWhiteBlack', !forceWB);
            location.reload();
        });

        // 2.6 搜索引擎
        const currentEngineKey = getConfig('searchEngine');
        const engineName = SEARCH_ENGINES[currentEngineKey] ? SEARCH_ENGINES[currentEngineKey].name : 'Custom';
        GM_registerMenuCommand(`${t('menu_search')}: ${engineName}`, () => {
            const choice = prompt(t('prompt_search'), currentEngineKey);
            if (choice) {
                if (SEARCH_ENGINES[choice] || choice.includes('%s')) {
                    setConfig('searchEngine', choice);
                    location.reload();
                } else {
                    alert(t('err_search'));
                }
            }
        });

        // 2.7 缓存功能
        GM_registerMenuCommand(`${t('menu_cache')}: ${getConfig('enableCache') ? t('val_on') : t('val_off')}`, () => {
            setConfig('enableCache', !getConfig('enableCache'));
            location.reload();
        });

        // 2.8 Toast通知
        GM_registerMenuCommand(`${t('menu_toast')}: ${getConfig('enableToast') ? t('val_on') : t('val_off')}`, () => {
            setConfig('enableToast', !getConfig('enableToast'));
            location.reload();
        });

        // 2.9 超级划词模式快捷键
        const currentKey = getConfig('unlockHotkey');
        GM_registerMenuCommand(`${t('menu_hotkey')}: ${currentKey || t('val_disabled')}`, () => {
            const val = prompt(t('prompt_hotkey'));
            if (val === null) return;
            
            // 简单的输入清洗，如果用户按了键，浏览器事件可以捕获，但在prompt里只能输入
            // 这里我们让用户手动输入，或者输入简单的 'ctrl' 映射一下
            let finalKey = val.trim();
            
            // 简单映射常用键
            if (finalKey.toLowerCase() === 'ctrl') finalKey = 'ControlLeft';
            if (finalKey.toLowerCase() === 'alt') finalKey = 'AltLeft';
            if (finalKey.toLowerCase() === 'shift') finalKey = 'ShiftLeft';
            if (finalKey === '' || finalKey.toUpperCase() === 'NONE') finalKey = '';

            setConfig('unlockHotkey', finalKey);
            location.reload();
        });

        // 2.10 闪电粘贴
        GM_registerMenuCommand(`${t('menu_paste')}: ${getConfig('enablePaste') ? t('val_on') : t('val_off')}`, () => {
            setConfig('enablePaste', !getConfig('enablePaste'));
            location.reload();
        });

        // [新增] 拖拽预览开关
        GM_registerMenuCommand(`${t('menu_drag_preview')}: ${getConfig('enableDragPreview') ? t('val_on') : t('val_off')}`, () => {
            setConfig('enableDragPreview', !getConfig('enableDragPreview'));
            location.reload();
        });

        // 2.11 码字防丢设置（功能不稳定目前不对用户展示，暂时注释掉菜单选项）
        const recMode = getConfig('inputRecoveryMode');
        const recModeText = { 'off': '已关闭', 'loose': '宽松 (默认)', 'strict': '严格 (完全匹配URL)' };
        //GM_registerMenuCommand(`🛡️ 码字防丢: ${recModeText[recMode] || '宽松'}`, () => {
        //    const map = ['off', 'loose', 'strict'];
        //    const next = map[(map.indexOf(recMode) + 1) % map.length];
        //    setConfig('inputRecoveryMode', next);
        //    alert(`码字防丢模式已切换为：${recModeText[next]}\n\n说明：\n宽松：忽略 ?utm_source 等跟踪参数 (推荐)\n严格：必须 URL 完全一致才恢复\n关闭：不缓存输入内容`);
        //    location.reload();
        //});

        // 2.12 屏蔽元素工具
        GM_registerMenuCommand(t('menu_block'), () => {
            activateElementPicker();
        });

        GM_registerMenuCommand(t('menu_clear'),  async () => {
            const domain = location.hostname;
            if (confirm(t('confirm_clear', domain))) {
                const rules = await safeGetValue('blocked_elements', {});
                if (rules[domain]) {delete rules[domain];
                await safeSetValue('blocked_elements', rules);if (typeof configCache !== 'undefined') {configCache['blocked_elements'] = rules;}
                alert(t('alert_cleared'));
                location.reload();} else {alert(t('alert_no_rules'));
            }
        }});

                // 新增：编辑网页
        GM_registerMenuCommand(t('menu_edit'), () => {
            toggleEditMode(!isEditMode);
        });

        // 2.13 重置
        GM_registerMenuCommand(t('menu_reset'), async () => {
            if (confirm(t('confirm_reset'))) {
                const keys = Object.keys(DEFAULT_CONFIG);await Promise.all(keys.map(k => setConfig(k, DEFAULT_CONFIG[k])));
                location.reload();
            }
        });
    }

    // =======================
    // 3. 核心逻辑 (Core Logic)
    // =======================

// [新增] 智能链接提取器
    function extractLinkFromText(rawText) {
        // 1. 快速预筛选 (性能优化)
        if (!rawText || (!rawText.includes('.') && !rawText.includes('://'))) return null;

        // 2. 清洗中文混淆 (处理 "pa删n.baid中u.co文m" 这种情况)
        // 仅移除中文字符，保留其他所有字符以便正则匹配
        const cleanText = rawText.replace(/[\u4e00-\u9fa5]/g, '');

        // 3. 正则提取
        // 匹配协议头(可选) + 域名/IP + 路径/参数
        // 排除末尾的标点符号： ) ] 】 ） 以及常见的句号逗号
        const urlPattern = /((?:https?:\/\/)?(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/[^\s\u4e00-\u9fa5)\]】）]*)?)/gi;
        
        const matches = cleanText.match(urlPattern);
        
        // 4. 必须有且仅有一个完整的链接
        if (!matches || matches.length !== 1) return null;
        
        let url = matches[0];

        // 5. 特殊清洗：如果URL末尾包含了非URL字符（如被正则误吸入的符号），做Trim
        // 由于上面正则排除了特定结束符，这里主要处理可能遗漏的边缘情况
        url = url.replace(/[.,;:]+$/, '');

        // 6. 域名/IP 规则校验
        // 提取Host部分
        let host = url.replace(/^https?:\/\//, '').split('/')[0];
        
        // 6.1 排除以纯IP 10. 或 172. 开头的
        if (/^10\./.test(host) || /^172\./.test(host)) return null;

        // 6.2 必须包含顶级域名分隔符 '.' (regex已保证，但防止demo/这种情况被误判，虽regex也处理了)
        if (!host.includes('.')) return null;

        // 7. 补全协议 (用于 safeOpenTab)
        let fullUrl = url;
        if (!url.startsWith('http')) {
            fullUrl = 'http://' + url;
        }

        return { display: url, url: fullUrl, host: host };
    }

    // [新增] 网盘密码提取器
    function extractPanCode(text) {
        if (!getConfig('enablePaste')) return null;
        const match = text.match(PAN_CODE_REGEX);
        return match ? match[1] : null;
    }

// [修改] 高效智能选区定位计算器 (三级降级策略：智能Rect -> 整体包围盒 -> 鼠标位置)
function getSmartSelectionState(selection, mouseEvent) {
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    // 1. 尝试获取精细的矩形列表 (可能为空，特别是在 Input/Textarea 或 框架更新DOM时)
    let rects = range.getClientRects();
    
    let targetRect = null;
    let isBackward = false;
    let isVertical = false;

    // --- 阶段 A: 智能精确定位 (Smart Directional) ---
    if (rects.length > 0) {
        const anchor = selection.anchorNode;
        const focus = selection.focusNode;

        // 判定选区方向
        if (anchor === focus) {
            isBackward = selection.anchorOffset > selection.focusOffset;
        } else {
            // 使用位掩码判定节点位置
            const pos = anchor.compareDocumentPosition(focus);
            if (pos & Node.DOCUMENT_POSITION_PRECEDING) isBackward = true;
        }

        // 判定垂直排版 (仅检查 focusNode)
        let focusEl = focus.nodeType === 1 ? focus : focus.parentElement;
        if (focusEl) {
            const style = window.getComputedStyle(focusEl);
            const writingMode = style.writingMode || 'horizontal-tb';
            isVertical = writingMode.startsWith('vertical');
        }

        // 根据方向获取头或尾的 Rect
        // 注意：如果是 detached 节点，这里虽然有 rects 但可能全是 0，下一阶段会检测
        targetRect = isBackward ? rects[0] : rects[rects.length - 1];
    }

    // 辅助函数：检测 Rect 是否无效 (0x0 且位于 0,0 通常意味着节点已脱离文档流)
    const isInvalidRect = (r) => {
        return !r || (r.width === 0 && r.height === 0 && r.top === 0 && r.left === 0);
    };

    // --- 阶段 B: 经典包围盒兜底 (Classic Bounding Box) ---
    // 如果没有 rects，或者获取到的 rect 是无效的 (0x0)
    if (isInvalidRect(targetRect)) {
        const bounding = range.getBoundingClientRect();
        // 只有当 bounding 也是有效的时候才使用
        if (!isInvalidRect(bounding)) {
            targetRect = bounding;
            // 包围盒丢失了方向细节，默认视为正向水平
            isBackward = false; 
            isVertical = false;
        }
    }

    // --- 阶段 C: 鼠标坐标兜底 (Mouse Position Fallback) ---
    // 如果连包围盒都是 0x0 (常见于 Vue 销毁了节点但选区对象还在内存中)，直接使用鼠标位置模拟一个 Rect
    if (isInvalidRect(targetRect) && mouseEvent) {
        const size = 20; // 模拟一个光标高度
        targetRect = {
            // 构造一个符合 DOMRect 接口的对象
            top: mouseEvent.clientY - size,
            bottom: mouseEvent.clientY,
            left: mouseEvent.clientX,
            right: mouseEvent.clientX,
            width: 0,
            height: size,
            x: mouseEvent.clientX,
            y: mouseEvent.clientY - size
        };
        isBackward = false;
        isVertical = false;
    }

    // 如果所有尝试都失败（极罕见），返回 null 让外部处理
    if (isInvalidRect(targetRect)) return null;

    return {
        rect: targetRect,
        isBackward: isBackward,
        isVertical: isVertical
    };
}
    // [修改] 初始化 Shadow DOM 容器 (针对 SPA/AJAX 优化)
    function initContainer() {
        // 1. 检查 hostElement 是否存在且仍然连接在文档中 (isConnected)
        if (hostElement && hostElement.isConnected) return;

        // 2. 如果 hostElement 存在但已从 DOM 脱落（被网页脚本清除），清理旧引用
        if (hostElement) {
            hostElement = null;
            shadowRoot = null;
        }

        // 3. 重新创建容器
        hostElement = document.createElement('div');
        hostElement.id = 'tm-smart-copy-host';
        hostElement.style.all = 'initial';
        hostElement.style.position = 'fixed';
        hostElement.style.zIndex = '2147483647'; // Max Z-Index
        hostElement.style.top = '0';
        hostElement.style.left = '0';
        hostElement.style.width = '0';
        hostElement.style.height = '0';
        hostElement.style.overflow = 'visible';
        hostElement.style.pointerEvents = 'none'; 
        
        // [重要修改] 挂载到 documentElement (html) 而不是 body
        // 这样即使 body 被 SPA 框架重写，挂在 html 上的元素通常能幸存，或者至少能保证层级正确
        // 如果必须确保层级，挂载前再次检查
        (document.documentElement || document.body).appendChild(hostElement);
        
        shadowRoot = hostElement.attachShadow({ mode: 'open' });
        
        // 重新注入样式
        const style = document.createElement('style');
        style.textContent = getStyles();
        shadowRoot.appendChild(style);
    }

    // 获取样式表字符串
    function getStyles() {
        const isCol = getConfig('buttonStyle') === 'col';
        const padRow  = '10px 13.1415926px';   // 胶囊：上下略小，左右略大
        const padCol  = '10px';       // 纵向：正方形，四边一致
        return `
            :host { all: initial; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .sc-container {
                position: fixed;
                display: flex;
                flex-direction: ${isCol ? 'column' : 'row'};
                background: rgba(255, 255, 255, 0.15); /* 调整背景透明度 */
                border: 1px solid transparent; /* 透明边框 */
                box-shadow:
                    /* 发光边框效果 */
                    0 0 0 1px rgba(255, 255, 255, 0.3),
                    0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06),
                    0 0 10px rgba(255, 255, 255, 0.1); /* 发光效果 */
                color: #000;
                border-radius: ${isCol ? '12px' : '20px'};
                font-size: 16px;
                z-index: 9999;
                cursor: pointer;
                user-select: none;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                opacity: 0;
                transform: scale(0.95);
                transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; /* 添加box-shadow过渡 */
                pointer-events: auto;
                overflow: hidden;
                white-space: nowrap;
            }
            .sc-container.visible {
                opacity: 1;
                transform: scale(1);
            }
            .sc-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s, transform 0.1s;
                color: #000;
                /* 方向不同，padding 不同 */
                padding: ${isCol ? padCol : padRow};
            }
            .sc-container[data-btn-count="1"] .sc-btn {
            padding: 10px;
            aspect-ratio: 1 / 1;
            }
            .sc-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.03);
            }
            .sc-btn:active {
                transform: scale(0.98);
                background: rgba(255, 255, 255, 0.2);
            }
            /* 深色模式覆盖 */
            .theme-dark-ui {
                /* --- 深色模式背景样式 --- */
                background: rgba(30, 30, 30, 0.3); /* 调整深色模式背景透明度 */
                border: 1px solid transparent; /* 深色模式也需要透明边框 */
                box-shadow:
                    /* 发光边框效果 (深色模式专属颜色) */
                    0 0 0 1px rgba(255, 255, 255, 0.15),
                    0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06),
                    0 0 10px rgba(0, 0, 0, 0.1); /* 深色模式下用较暗的发光 */
                color: #fff;
            }
            .theme-dark-ui .sc-btn {
                color: #fff;
            }
            .theme-dark-ui .sc-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }
            .theme-dark-ui .sc-btn:active {
                background: rgba(255, 255, 255, 0.1);
            }
            /* 分割线 */
            .divider {
                background: rgba(255, 255, 255, 0.25);
            }
            .theme-dark-ui .divider {
                background: rgba(255, 255, 255, 0.12);
            }
            .divider-v { width: 1px; height: 1.6em; align-self: center; }
            .divider-h { height: 1px; width: 100%; }
            /* Toast 通知 */
            .sc-toast {
                position: fixed;
                left: 50%;
                bottom: 20px;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.6);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 13px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
                z-index: 10000;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .sc-toast.show { opacity: 1; }
            /* ===== Liquid Glass + HDR Glow ===== */

/* 以下均为额外增强玻璃质感补丁，全部删除也不会影响正常显示：涉及模拟玻璃扭曲（使用多层 background、微弱的 background-blend-mode、低透明度彩色噪声）、轮廓边缘反光（利用 box-shadow 叠加 1~3 层白色/彩色外发光）、HDR hover glow（在 hover 时提亮、加入更强的外扩光、加一点 scale） */
.sc-container {
    position: fixed;
    display: flex;
    backdrop-filter: blur(14px) saturate(180%);
    -webkit-backdrop-filter: blur(14px) saturate(180%);
    background:
        /* 轻微彩色折射层 */
        linear-gradient(135deg, rgba(255,255,255,0.20), rgba(255,255,255,0.05)),
        /* 噪声纹理模拟扭曲 */
        url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>\
<filter id='n'>\
<feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/>\
<feColorMatrix type='saturate' values='0'/>\
<feComponentTransfer><feFuncA type='linear' slope='0.08'/></feComponentTransfer>\
</filter>\
<rect width='40' height='40' filter='url(#n)'/>\
</svg>"),
        rgba(255,255,255,0.10);

    background-blend-mode: overlay;

    /* 轮廓反光效果（外圈） */
    box-shadow:
        0 0 0 1px rgba(255,255,255,0.35),
        0 0 12px rgba(255,255,255,0.15),
        0 8px 30px rgba(0,0,0,0.22);

    transition: 
        box-shadow .25s ease,
        transform .25s ease,
        opacity .2s ease;
}

/* 鼠标悬停按钮 HDR 高亮 */
.sc-btn:hover {
    background: rgba(255,255,255,0.28);
    transform: scale(1.05);

    box-shadow:
        0 0 6px rgba(255,255,255,0.8),
        0 0 16px rgba(255,255,255,0.6),
        0 0 26px rgba(255,255,255,0.4);
    
    filter: brightness(1.25); /* HDR 感 */
}

/* 深色模式增强 */
.theme-dark-ui {
    background:
        linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
        url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>\
<filter id='n'>\
<feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/>\
<feColorMatrix type='saturate' values='0'/>\
<feComponentTransfer><feFuncA type='linear' slope='0.06'/></feComponentTransfer>\
</filter>\
<rect width='40' height='40' filter='url(#n)'/>\
</svg>"),
        rgba(0,0,0,0.25);

    background-blend-mode: soft-light;

    box-shadow:
        0 0 0 1px rgba(255,255,255,0.18),
        0 0 12px rgba(255,255,255,0.06),
        0 8px 26px rgba(0,0,0,0.32);
}

/* 深色模式 hover 发光更亮 */
.theme-dark-ui .sc-btn:hover {
    background: rgba(255,255,255,0.12);
    filter: brightness(1.35);
    box-shadow:
        0 0 6px rgba(255,255,255,0.5),
        0 0 22px rgba(255,255,255,0.25),
        0 0 36px rgba(255,255,255,0.15);
}
/* =============================
   浅色按钮（theme-light-ui）左上角 + 右下角出现 黑色反光边模拟透明玻璃的折射深边，深色按钮（theme-dark-ui）左上角 + 右下角出现 白色反光边模拟深色玻璃的折射亮边
   ============================= */

/* 浅色按钮（白底黑字）玻璃边：黑色内阴影 */
.theme-light-ui.sc-container {
    /* 提高整体透明度：背景更透、阴影更亮 */
    background:
        linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08)),
        url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>\
<filter id='n'>\
<feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/>\
<feColorMatrix type='saturate' values='0'/>\
<feComponentTransfer><feFuncA type='linear' slope='0.06'/></feComponentTransfer>\
</filter>\
<rect width='40' height='40' filter='url(#n)'/>\
</svg>"),
        rgba(255,255,255,0.18);

    background-blend-mode: overlay;
    /* 不改变原本背景，仅增加内侧反光 */
    box-shadow:
        inset 2px 2px 3px rgba(0,0,0,0.20),     /* 左上角黑色内反光 */
        inset -2px -2px 3px rgba(0,0,0,0.18),  /* 右下角黑色内反光 */
        0 0 0 1px rgba(255,255,255,0.45),
        0 0 12px rgba(255,255,255,0.25),
        0 8px 30px rgba(0,0,0,0.18);
    /* 分割线改为黑色，透明度 0.18 */
    --divider-color: rgba(0,0,0,0.18);
}

/* 浅色模式 hover 更亮 */
.theme-light-ui .sc-btn:hover {
    background: rgba(255,255,255,0.35);
    filter: brightness(1.3);
    box-shadow:
        0 0 6px rgba(255,255,255,0.9),
        0 0 16px rgba(255,255,255,0.7),
        0 0 26px rgba(255,255,255,0.5);
}

/* 统一分割线颜色（浅色模式黑色，深色模式白色） */
.divider {
    background: var(--divider-color, rgba(255,255,255,0.25));
}

/* 深色按钮（黑底白字）玻璃边：白色内反光 */
.theme-dark-ui.sc-container {
    box-shadow:
        inset 2px 2px 3px rgba(255,255,255,0.32),    /* 左上角亮边 */
        inset -2px -2px 3px rgba(255,255,255,0.28),  /* 右下角亮边 */
        0 0 0 1px rgba(255,255,255,0.18),
        0 0 12px rgba(255,255,255,0.06),
        0 8px 26px rgba(0,0,0,0.32);
}
        `;
    }
    
// =======================
    // [新增] 拖拽链接预览子系统 (Drag Preview Subsystem)
    // =======================

    let dragStartData = null; // 临时存储拖拽起点数据
    const PREVIEW_WIN_NAME = 'PicKitPreviewWindow';

    // 1. 处理拖拽开始
    function handleLinkDragStart(e) {
        if (!getConfig('enableDragPreview')) return;

        // 精确判断：必须是左键拖拽，且目标是超链接（或在超链接内部）
        // closest 向上查找，避免拖拽链接内的文字或图片时不触发
        const link = e.target.closest('a[href]');
        
        // 排除无效链接（如 javascript:void(0) 或锚点）
        if (!link || !link.href || link.href.startsWith('javascript:') || link.href.startsWith('#')) {
            dragStartData = null;
            return;
        }

        dragStartData = {
            url: link.href,
            x: e.clientX,
            y: e.clientY,
            timestamp: Date.now()
        };
    }

    // 2. 处理拖拽结束
    function handleLinkDragEnd(e) {
    if (!dragStartData) return;

    const { x: startX, y: startY, url } = dragStartData;
    const endX = e.clientX;
    const endY = e.clientY;

    /* ---------- 1. 视口外松开直接放弃 ---------- */
    if (
        endX < 0 || endY < 0 ||
        endX > window.innerWidth || endY > window.innerHeight
    ) {
        dragStartData = null;
        return;
    }

    /* ---------- 2. 输入区 / 富文本 / 拖放容器 过滤 ---------- */
    const target = document.elementFromPoint(endX, endY); // 松手时最顶层的元素
    if (target) {
        // 2-1 输入框
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            dragStartData = null;
            return;
        }
        // 2-2 富文本编辑
        if (target.closest('[contenteditable="true"]')) {
            dragStartData = null;
            return;
        }
        // 2-3 具有 dragover / drop 事件的容器
        const dropZone = target.closest('[ondragover],[ondrop]');
        if (dropZone) {
            dragStartData = null;
            return;
        }
    }

    /* ---------- 3. 距离阈值判断 ---------- */
    const dist = Math.hypot(endX - startX, endY - startY);
    if (dist > 30) openPreviewWindow(url); // 距离阈值：30px (防止点击时的微小抖动被误判为拖拽)
    // 清理数据
    dragStartData = null;
    }

    // 3. 打开预览窗口
    async function openPreviewWindow(url) {
        const screen = window.screen;
        // 获取屏幕可用区域尺寸
        const screenW = screen.availWidth;
        const screenH = screen.availHeight;
        
        // 兼容多显示器坐标 (如果有 availLeft 则使用，否则默认为 0)
        const screenLeft = screen.availLeft || 0;
        const screenTop = screen.availTop || 0;

        // 黄金分割比
        const GOLDEN_RATIO = 0.618;

        // 计算目标尺寸：保持屏幕宽高比，长宽缩放至 61.8%
        const width = Math.round(screenW * GOLDEN_RATIO);
        const height = Math.round(screenH * GOLDEN_RATIO);

        // 计算居中位置
        const left = screenLeft + (screenW - width) / 2;
        const top = screenTop + (screenH - height) / 2;

        const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
        window.open(url, PREVIEW_WIN_NAME, features);
    }

// =======================
    // [新增] 强效解锁模式 (Unlock Mode)
    // ===================

    let isUnlockMode = false;
    let unlockStyleEl = null;
    let startPos = { x: 0, y: 0 };

    // 1. 动态CSS：强制文本可选，屏蔽拖拽，屏蔽指针事件限制等
    function getUnlockCSS() {
        return `
            /* --- 1. 全局强制可选 (排除受保护元素) --- */
            /* 权重: 0,1,1 (html/body) 或 0,1,0 (*:not) */
            html, body, *:not([data-tm-policy="protected"]), [unselectable] {
                user-select: text !important;
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                cursor: text !important;
            }
            /* 强制高亮颜色 */
            ::selection {background-color: #3390FF !important;color: #ffffff !important;text-shadow: none !important;}
            ::-moz-selection {background-color: #3390FF !important;color: #ffffff !important;text-shadow: none !important;}
            /* 让链接看起来像普通文本，且禁止图片/链接被拖拽（干扰划词） */
            a:not([data-tm-policy="protected"]), 
            a *:not([data-tm-policy="protected"]), 
            img:not([data-tm-policy="protected"]){
                pointer-events: auto !important; /* 必须允许点击才能触发我们的拦截逻辑，否则无法划词 */
                user-drag: none !important;
                -webkit-user-drag: none !important;
                text-decoration: none !important; /* 视觉上更像文本 */
            }
            /* 禁用常见的透明遮罩层交互，让鼠标穿透到下方文字 */
            /* 注意：这不会影响文字本身，因为文字会继承通配符的 pointer-events: auto */
            div[style*="z-index"][style*="fixed"]:not([data-tm-policy="protected"]), 
            div[style*="z-index"][style*="absolute"]:not([data-tm-policy="protected"]) {pointer-events: none !important;}
            
            /* 重新把文字元素的交互打开，防止被上面的规则误杀 */
            /* 权重计算: div(1) + [style](10) + :not(10) = 21 */
            div[style*="z-index"] *:not([data-tm-policy="protected"]), 
            p:not([data-tm-policy="protected"]), 
            span:not([data-tm-policy="protected"]), 
            h1:not([data-tm-policy="protected"]), h2:not([data-tm-policy="protected"]), 
            h3:not([data-tm-policy="protected"]), h4:not([data-tm-policy="protected"]), 
            h5:not([data-tm-policy="protected"]), h6:not([data-tm-policy="protected"]), 
            em:not([data-tm-policy="protected"]), strong:not([data-tm-policy="protected"]), 
            i:not([data-tm-policy="protected"]), b:not([data-tm-policy="protected"]), 
            td:not([data-tm-policy="protected"]), li:not([data-tm-policy="protected"]), 
            code:not([data-tm-policy="protected"]), pre:not([data-tm-policy="protected"]) {
                pointer-events: auto !important;
            }
            /* 针对被截断文本展开后的样式：隐藏滚动条但保留滚动功能 */
            .tm-sc-expanded {
                scrollbar-width: none !important; /* Firefox */
                -ms-overflow-style: none !important; /* IE或Edge */
            }
            .tm-sc-expanded::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
            }
        /* [新增补丁] 某些网页为了实现"卡片整体可点击"，使用了绝对定位的透明链接层覆盖在文本上方，导致鼠标事件被拦截无法穿透，以下补丁专门针对覆盖文本的透明链接层（如 Tailwind 的 absolute inset-0） */
        a.absolute, a[style*="position: absolute"] { pointer-events: none !important; }
        
            /* 放在最后，确保权重覆盖所有上方规则 */
            /* 
               技巧：重复属性选择器三次，权重叠加。
               权重计算: [attr](10) * 3 = 30。
               30 > 21 (Rule 5)。
               这将彻底覆盖上方任何针对其子元素的 pointer-events: auto 设置。
            */
            [data-tm-policy="protected"][data-tm-policy="protected"][data-tm-policy="protected"],
            [data-tm-policy="protected"][data-tm-policy="protected"][data-tm-policy="protected"] * {
                user-select: none !important;
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                pointer-events: none !important; /* 强制穿透，不给鼠标任何机会 */
                cursor: default !important;
                z-index: 2147483647 !important;
            }
        `;
    }

    // 检查是否为受保护元素
    function isProtectedElement(target) {
        return target && target.closest && target.closest('[data-tm-policy="protected"]');
    }

    function handleCaptureSelectStart(e) {
    if (!isUnlockMode) return;
        // 如果目标是合规声明，立即阻止一切操作
        if (isProtectedElement(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return;
        }
    // 阻止网页脚本获知“选区开始”事件，从而无法取消它
    // 注意：不要 preventDefault，否则浏览器自己也不会开始选区了
    // 我们只阻止冒泡给网页代码
    e.stopPropagation(); 
    e.stopImmediatePropagation();
}
// 2. 拦截点击事件：如果是拖拽操作或点击链接，则阻止
    function handleCaptureClick(e) {
        if (!isUnlockMode) return;

        // 针对合规声明的拦截
        if (isProtectedElement(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return;
        }

        const dx = Math.abs(e.clientX - startPos.x);
        const dy = Math.abs(e.clientY - startPos.y);
        const isDrag = dx > 3 || dy > 3; // 位移超过3px视为拖拽
        
        // 判断是否点击了链接（向上查找a标签）
        let target = e.target;
        let isLink = false;
        while (target && target !== document) {
            if (target.tagName === 'A') {
                isLink = true;
                break;
            }
            target = target.parentNode;
        }

        // 如果是拖拽选区操作，或者点击的是链接，则拦截
        if (isDrag || isLink) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            // console.log('Blocked click by Smart Copy');
        }
    }

// 鼠标按下时按需处理当前元素
    function handleCaptureMouseDown(e) {
        if (!isUnlockMode) return;
        // 针对合规声明的拦截
        if (isProtectedElement(e.target)) {
            e.preventDefault(); // 阻止聚焦和放置光标
            e.stopPropagation();
            e.stopImmediatePropagation();
            return;
        }
        // 1. 处理被点击的元素 (懒加载逻辑)
        const el = e.target;
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
            try {
                // 处理 Password -> Text
                if (el.type === 'password') {
                    el.dataset.scOriginalType = 'password';
                    el.type = 'text';
                    modifiedElements.add(el); // 加入待恢复列表
                }

                // 处理 Disabled / ReadOnly
                if (el.disabled) { 
                    el.disabled = false; 
                    el.dataset.scWasDisabled = 'true'; 
                    modifiedElements.add(el); 
                }
                if (el.readOnly) { 
                    el.readOnly = false; 
                    el.dataset.scWasReadOnly = 'true'; 
                    modifiedElements.add(el); 
                }
            } catch (err) {
                // 忽略跨域或受保护元素的错误
            }
        }

        // 2. 阻止网页在这个位置触发自定义逻辑
        startPos = { x: e.clientX, y: e.clientY };
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    function handleCaptureDragStart(e) {
        if (!isUnlockMode) return;
        // 禁止原生拖拽，保证划词顺畅
        e.preventDefault();
        e.stopPropagation();
    }
    
    function handleCaptureCopy(e) {
        if (!isUnlockMode) return;
        // 允许复制，但阻止网页监听（防止网页通过监听copy事件来篡改剪贴板或弹出付费提示）
        // 注意：这不会阻止 navigator.clipboard.write，但会阻止 document.execCommand('copy') 触发的网页脚本
        e.stopImmediatePropagation();
    }

    // 新增：防止网页通过 selectionchange 监听器清空选区
// 注意：这个事件在 document 上触发频率很高，需要轻量处理
function handleCaptureSelectionChange(e) {
    if (!isUnlockMode) return;
    // 同样，阻止网页感知到选区变化
    e.stopPropagation();
    e.stopImmediatePropagation();
}

function cleanInlineEvents() {
    // 仅处理 document.body 和 document.documentElement，极低消耗
    // 只有当用户确实遇到极难缠的页面时，才需要遍历更多元素，但通常 body 足够了
    const targets = [document.documentElement, document.body];
    const events = ['onselectstart', 'onmousedown', 'oncontextmenu', 'oncopy'];
    
    targets.forEach(el => {
        if (!el) return;
        events.forEach(evt => {
            if (el.hasAttribute(evt)) {
                el.removeAttribute(evt);
            }
            // 同时也置空 DOM 属性
            if (el[evt]) {
                el[evt] = null;
            }
        });
    });
}

    const modifiedElements = new Set(); //追踪受影响元素的集合
// 鼠标悬停时智能展开截断文本
    function handleExpandHover(e) {
        if (!isUnlockMode) return;
        let target = e.target;
        
        // 优化性能：忽略已处理元素或非元素节点
        if (target.nodeType !== 1 || target.classList.contains('tm-sc-expanded')) return;

        // 获取计算样式
        const style = window.getComputedStyle(target);
        
        // 检测单行截断 (text-overflow: ellipsis)
        const isEllipsis = style.textOverflow === 'ellipsis';
        
        // 检测多行截断 (-webkit-line-clamp)
        // 注意：getComputedStyle 获取的 webkitLineClamp 可能是 'none' 或数字字符串
        const isLineClamp = style.webkitLineClamp && style.webkitLineClamp !== 'none';

        if (isEllipsis || isLineClamp) {
            // 1. 锁定当前尺寸，防止布局抖动 (Reflow)
            const rect = target.getBoundingClientRect();
            // 必须使用 important 覆盖原有样式
            target.style.setProperty('height', rect.height + 'px', 'important');
            target.style.setProperty('width', rect.width + 'px', 'important');
            
            // 2. 标记已处理
            target.classList.add('tm-sc-expanded');

            // 3. 应用展开策略
            if (isLineClamp) {
                // 多行截断处理策略：
                // 保持高度不变，移除行数限制，允许垂直滚动
                target.style.setProperty('-webkit-line-clamp', 'none', 'important');
                target.style.setProperty('overflow-y', 'auto', 'important');
                // 某些使用 -webkit-box 的布局在移除 clamp 后行为不可控，
                // 如果需要更激进的显示，可能需要 display: block，但这里为了兼容性优先只动 overflow
            } else {
                // 单行截断处理策略：
                // 保持不换行，移除省略号，允许水平滚动
                target.style.setProperty('text-overflow', 'clip', 'important');
                target.style.setProperty('overflow-x', 'auto', 'important');
                // 强制不换行 (防止某些 flex 布局在 overflow 变动后尝试换行)
                target.style.setProperty('white-space', 'nowrap', 'important'); 
            }
        }
    }

    // 退出模式时清理所有展开的元素
    function cleanupExpandedElements() {
        const elements = document.querySelectorAll('.tm-sc-expanded');
        elements.forEach(el => {
            // 在恢复样式前，强制滚动回顶部和最左侧,使内容停留在起始位置，视觉上与操作前完全一致
            el.scrollTop = 0;
            el.scrollLeft = 0;
            
            el.classList.remove('tm-sc-expanded');
            // 移除我们注入的内联样式，恢复网页原貌
            // 注意：这会移除所有同名内联样式。如果网页本身就有内联 height，这里可能会误伤。
            // 但考虑到这只是个临时交互，且针对的是截断文本（通常由 CSS 类控制），直接 removeProperty 风险可控。
            el.style.removeProperty('height');
            el.style.removeProperty('width');
            el.style.removeProperty('-webkit-line-clamp');
            el.style.removeProperty('overflow-y');
            el.style.removeProperty('overflow-x');
            el.style.removeProperty('text-overflow');
            el.style.removeProperty('white-space');
        });
    }

    // 3. 开启/关闭模式
    function toggleUnlockMode(active) {
        if (active === isUnlockMode) return;
        isUnlockMode = active;

        if (active) {
            // 注入CSS
            if (!unlockStyleEl) {
                unlockStyleEl = document.createElement('style');
                unlockStyleEl.textContent = getUnlockCSS();
                unlockStyleEl.id = 'tm-smart-copy-unlock-style';
            }
            (document.documentElement || document.body).appendChild(unlockStyleEl);

            // 清理内联事件 (只做一次，极低开销)
            cleanInlineEvents();

            // 挂载拦截监听器 (使用Capture模式优先拦截)
            // 优先级：最高 (Capture + StopImmediatePropagation)
            window.addEventListener('selectstart', handleCaptureSelectStart, true);
            window.addEventListener('click', handleCaptureClick, true);
            window.addEventListener('mousedown', handleCaptureMouseDown, true);
            window.addEventListener('dragstart', handleCaptureDragStart, true);
            window.addEventListener('copy', handleCaptureCopy, true);
            window.addEventListener('contextmenu', handleCaptureCopy, true); // 顺便解右键
            // selectionchange 通常在 document 上触发
            document.addEventListener('selectionchange', handleCaptureSelectionChange, true);
            document.addEventListener('mouseover', handleExpandHover, true); // [新增] 挂载文本展开监听器 (使用 mouseover 即可，性能优于 mousemove)

            showToast(t('toast_unlock'));
        } else {
            // 移除CSS
            if (unlockStyleEl && unlockStyleEl.parentNode) {
                unlockStyleEl.parentNode.removeChild(unlockStyleEl);
            }

            // >>>>>> 遍历恢复 <<<<<<
            modifiedElements.forEach(el => {
                try {
                    // 恢复 Password
                    if (el.dataset.scOriginalType === 'password') {
                        el.type = 'password';
                        delete el.dataset.scOriginalType;
                    }
                    // 恢复 Disabled / ReadOnly
                    if (el.dataset.scWasDisabled === 'true') { el.disabled = true; delete el.dataset.scWasDisabled; }
                    if (el.dataset.scWasReadOnly === 'true') { el.readOnly = true; delete el.dataset.scWasReadOnly; }

                } catch(e) {}// 即使某个属性恢复失败，也不应中断循环
            });

            modifiedElements.clear(); // 清空集合

            // 移除监听器
            window.removeEventListener('selectstart', handleCaptureSelectStart, true);
            window.removeEventListener('mousedown', handleCaptureMouseDown, true);
            window.removeEventListener('click', handleCaptureClick, true);
            window.removeEventListener('dragstart', handleCaptureDragStart, true);
            window.removeEventListener('copy', handleCaptureCopy, true);
            window.removeEventListener('contextmenu', handleCaptureCopy, true);
            document.removeEventListener('selectionchange', handleCaptureSelectionChange, true);

            // 移除文本展开监听器 并 还原DOM
            document.removeEventListener('mouseover', handleExpandHover, true);
            cleanupExpandedElements();
            
            // 清除当前选区的高亮
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                sel.removeAllRanges();          // 彻底清掉选区
                //sel.collapseToStart();       // 把选区折叠到起点，强制浏览器立即重绘使高亮消失（两种方法二选一）
            }
            // 移除Toast (如果不希望提示“已关闭”可以删掉下面这行)
            // showToast('🔒 超级划词已关闭'); 
            // 为了用户体验，松开按键时让Toast自然消失即可，不必特意提示关闭
             const toast = shadowRoot && shadowRoot.querySelector('.sc-toast');
             if(toast) toast.classList.remove('show');
        }
    }

    // 4. 键盘监听
    document.addEventListener('keydown', (e) => {
        // 新增：ESC 退出编辑模式
        if (e.key === 'Escape' && isEditMode) {
            toggleEditMode(false);
            return;
        }
        const hotkey = getConfig('unlockHotkey');
        if (!hotkey) return;
        // e.code 对应物理按键位置，如 ControlLeft, AltLeft, KeyA
        // e.key 对应字符，如 Control, Alt, a
        if (e.code === hotkey || e.key === hotkey) {
            if (!isUnlockMode) toggleUnlockMode(true);
        }
    });

    document.addEventListener('keyup', (e) => {
        const hotkey = getConfig('unlockHotkey');
        if (!hotkey) return;
        if (e.code === hotkey || e.key === hotkey) {
            if (isUnlockMode) toggleUnlockMode(false);
        }
    });
    window.addEventListener('blur', () => {if (isUnlockMode) toggleUnlockMode(false);});// 窗口失焦时自动关闭，防止卡在开启状态

    // 4. 文本处理与复制
    async function copyToClipboard(text, html) {
        try {
            // 优先尝试构建 ClipboardItem 以保留样式 (如果不是纯文本)
            if (html && typeof ClipboardItem !== 'undefined') {
                // 简单的HTML包装
                const htmlBlob = new Blob([html], { type: 'text/html' });
                const textBlob = new Blob([text], { type: 'text/plain' });
                const data = [new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob })];
                await navigator.clipboard.write(data);
            } else {
                // 回退到纯文本
                await navigator.clipboard.writeText(text);
            }
        } catch (e) {
        // 有些网页 JS 会执行 delete navigator.clipboard 或类似操作，或者抢夺焦点导致浏览器判定当前没有 User Activation，从而引发标准异步剪贴板 API（Clipboard API）failed，此时降级使用 GM 特权 API_GM_setClipboard
        // GM_setClipboard 虽然在某些脚本管理器中一次只支持多种类型，但这里为了兼容更多脚本管理器一次只使用单个参数指定 mimetype
        if (typeof GM_setClipboard === 'function') {
            if (text) {
                // 尝试写入纯文本（稳定）
                GM_setClipboard(text, 'text');
            } else {
                GM_setClipboard(html, 'html');
            }
        } 
        }
    }

    // 显示 Toast
    function showToast(msg) {
        if (!getConfig('enableToast')) return;
        
        let toast = shadowRoot.querySelector('.sc-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'sc-toast';
            shadowRoot.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 1200);
    }
// 智能获取网页背景亮度，返回 'light' 或 'dark' 以决定 UI 主题
    // 逻辑：网页背景深 -> 返回 'light' (浅色UI)；网页背景浅 -> 返回 'dark' (深色UI)
    function getBestContrastTheme() {
        const getBgColor = (el) => {
            if (!el) return null;
            const style = window.getComputedStyle(el);
            return style.backgroundColor; 
        };

        const getBrightness = (colorStr) => {
            // 处理无效值或完全透明
            if (!colorStr || colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') return null;
            
            // 提取 RGB
            const match = colorStr.match(/(\d+),\s*(\d+),\s*(\d+)/);
            if (!match) return null;
            
            const [r, g, b] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
            
            // 计算亮度 (YIQ公式)
            // 结果 0~255，越小越暗
            return (r * 299 + g * 587 + b * 114) / 1000;
        };

        // 1. 优先检测 body 背景
        let brightness = getBrightness(getBgColor(document.body));

        // 2. 如果 body 透明，检测 html (documentElement) 背景
        if (brightness === null) {
            brightness = getBrightness(getBgColor(document.documentElement));
        }

        // 3. 如果 html 也透明，这通常意味着网页使用浏览器默认背景（通常是白色，但在深色模式插件下可能是黑色）
        // 这里作为一个兜底，如果实在读不到背景色，则回退到读取系统/浏览器原本的深色模式偏好
        if (brightness === null) {
            const sysIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            // 系统暗 -> 网页可能暗 -> 用浅色UI
            return sysIsDark ? 'theme-light-ui' : 'theme-dark-ui';
        }

        // 4. 根据亮度判断：亮度 < 128 (深色背景) -> 用 'theme-light-ui' (浅色按钮)
        //    否则 -> 用 'theme-dark-ui' (深色按钮)
        return brightness < 128 ? 'theme-light-ui' : 'theme-dark-ui';
    }

// 渲染按钮 (支持 Copy/Search 模式 和 Paste 模式)
    function renderButton(rect, mouseX, mouseY, text, html, mode = 'default', targetInput = null, isEditable = false) {
        // 清理旧的
        const oldBtn = shadowRoot.querySelector('.sc-container');
        if (oldBtn) oldBtn.remove();

        const container = document.createElement('div');
        container.className = 'sc-container';

        // 智能背景色检测与主题应用
        const forceWB = getConfig('forceWhiteBlack');
        
        if (forceWB) {
            // 如果用户强制开启"强制浅色"，则无视网页背景，始终应用浅色 UI
            container.classList.add('theme-light-ui');
        } else {
            // 否则，根据网页实际背景色，自动应用高对比度的主题
            const contrastTheme = getBestContrastTheme();
            container.classList.add(contrastTheme);
        }

        const isCol = getConfig('buttonStyle') === 'col';

        // ================
        // 模式: 编辑模式 (Edit Mode)
        // ================
        if (isEditMode) {
            // 1. 删除按钮
            const delBtn = document.createElement('div');
            delBtn.className = 'sc-btn';
            delBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
            delBtn.title = t('btn_delete');
            delBtn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); };
            delBtn.onclick = (e) => {
                e.stopPropagation();
                document.execCommand('delete');
                hideUI();
            };
            container.appendChild(delBtn);

            // 分割线
            const div1 = document.createElement('div');
            div1.className = isCol ? 'divider divider-h' : 'divider divider-v';
            container.appendChild(div1);

            // 2. 加粗按钮
            const boldBtn = document.createElement('div');
            boldBtn.className = 'sc-btn';
            boldBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>`;
            boldBtn.title = t('btn_bold');
            boldBtn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); };
            boldBtn.onclick = (e) => {
                e.stopPropagation();
                document.execCommand('bold');
                // 加粗通常想保留选区继续操作，这里不立即隐藏，或者延迟隐藏
                // hideUI(); 
            };
            container.appendChild(boldBtn);

            // 分割线
            const div2 = document.createElement('div');
            div2.className = isCol ? 'divider divider-h' : 'divider divider-v';
            container.appendChild(div2);

            // 3. 标记按钮 (黄色背景)
            const highlightBtn = document.createElement('div');
            highlightBtn.className = 'sc-btn';
            highlightBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M15 3a3 3 0 0 1 3 3v6h-1"></path><path d="M10 6l4-3a3 3 0 1 1 3 3L7.5 15.5 6 18l2.5-1.5L18 7"></path></svg>`;
            highlightBtn.title = t('btn_highlight');
            highlightBtn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); };
            highlightBtn.onclick = (e) => {
                e.stopPropagation();
                // 使用 hiliteColor (部分浏览器用 backColor)
                if (!document.execCommand('hiliteColor', false, 'yellow')) {
                    document.execCommand('backColor', false, 'yellow');
                }
                hideUI();
            };
            container.appendChild(highlightBtn);
        }
        else 
        // ================
        // 模式 A: 默认模式 
        // ================
        if (mode === 'default' || mode === PASTE_MODE_THREE_BTNS) {
            // 1. 创建复制按钮
            const copyBtn = document.createElement('div');
            copyBtn.className = 'sc-btn';
            copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
            copyBtn.title = t('btn_copy');
            copyBtn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); };
            copyBtn.onclick = async (e) => {
                e.stopPropagation();
                triggerSpringFestivalEffect(e.clientX, e.clientY, shadowRoot); // 触发春节特效 (传入鼠标点击坐标和shadowRoot)
                const contentToCopy = getConfig('enableCache') ? (cachedSelection.text || text) : text;
                const htmlToCopy = getConfig('enableCache') ? (cachedSelection.html || html) : html;
                
                await copyToClipboard(contentToCopy, htmlToCopy);
                
                // [新增] 写入闪电粘贴缓存 (8秒有效)
                if (getConfig('enablePaste')) {
        // 这里用 await 确保写入完成
        await safeSetValue('smart_paste_cache', {
                        text: contentToCopy,
                        timestamp: Date.now()
                    });
                }

                showToast(getSpringFestivalToastText());
                // 延迟50ms消失，人为增加视觉残影，避免立即消失让用户以为没有点到
                setTimeout(hideUI, 50);
            };
            container.appendChild(copyBtn);
const isInInput = targetInput !== null;   // 已由调用方传进来
            // 2. 创建剪切按钮 (仅在编辑区显示)
        if (isInInput && !isEditMode) {
            const div = document.createElement('div');
            div.className = isCol ? 'divider divider-h' : 'divider divider-v';
            container.appendChild(div);

            const cutBtn = document.createElement('div');
            cutBtn.className = 'sc-btn';
            // 剪刀 SVG 图标
            cutBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>`;
            cutBtn.title = t('btn_cut'); 
            cutBtn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); };
            cutBtn.onclick = async (e) => {
                e.stopPropagation();
                triggerSpringFestivalEffect(e.clientX, e.clientY, shadowRoot); 
                const contentToCopy = getConfig('enableCache') ? (cachedSelection.text || text) : text;
                const htmlToCopy = getConfig('enableCache') ? (cachedSelection.html || html) : html;

                // 尝试执行原生剪切，这样可以保留浏览器的撤销(Ctrl+Z)历史
                try {
                    const success = document.execCommand('cut');
                    if (!success) {
                        throw new Error('execCommand failed');
                    }
                } catch (err) {
                    // 如果原生剪切失败（极少见），则回退到：复制 -> 删除选区
                    await copyToClipboard(contentToCopy, htmlToCopy);
                    // 删除选区内容
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        selection.getRangeAt(0).deleteContents();
                    }
                }
                // 写入闪电粘贴缓存
                if (getConfig('enablePaste')) {
                    await safeSetValue('smart_paste_cache', {
                        text: contentToCopy,
                        timestamp: Date.now()
                    });
                }
                setTimeout(hideUI, 35);
            };
            container.appendChild(cutBtn);
        } 
        // 搜索按钮 (仅在非编辑区且字数较少时显示)
        else if (!isInInput && !isEditMode && text.trim().length <= 32) {
            const div = document.createElement('div');
            div.className = isCol ? 'divider divider-h' : 'divider divider-v';
            container.appendChild(div);

            const searchBtn = document.createElement('div');
            searchBtn.className = 'sc-btn';
            searchBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
            searchBtn.title = t('btn_search');
            searchBtn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); };
            searchBtn.onclick = (e) => {
                e.stopPropagation();
                const query = getConfig('enableCache') ? (cachedSelection.text || text) : text;
                let engine = getConfig('searchEngine');
                let url = SEARCH_ENGINES[engine] ? SEARCH_ENGINES[engine].url : (engine.includes('%s') ? engine : SEARCH_ENGINES['google'].url);
                safeOpenTab(url.replace('%s', encodeURIComponent(query.trim())), { active: true });
                setTimeout(hideUI, 50);
            };
            container.appendChild(searchBtn);
        }

        //锁链按钮逻辑
            // 判定当前是否处于编辑状态 (输入框、文本域、富文本)
            const activeEl = document.activeElement;
            const isUserEditing = activeEl && (
                (['INPUT', 'TEXTAREA'].includes(activeEl.tagName) && !activeEl.readOnly) ||
                activeEl.isContentEditable ||
                document.designMode === 'on'
            );
            // 只有在非输入框环境下才进行链接检测
            if (!isUserEditing && !targetInput && mode !== PASTE_MODE_THREE_BTNS) {
                const linkData = extractLinkFromText(text);
                
                if (linkData) {
                    const div = document.createElement('div');
                    div.className = isCol ? 'divider divider-h' : 'divider divider-v';
                    container.appendChild(div);

                    const chainBtn = document.createElement('div');
                    chainBtn.className = 'sc-btn';
                    // CSS绘制锁链图标 (SVG Path)
                    chainBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
                    chainBtn.title = t('btn_open_link');
                    chainBtn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); };
                    
                    chainBtn.onclick = async (e) => {
                        e.stopPropagation();
                        
                        // 网盘密码逻辑
                        let panPassword = null;
                        if (getConfig('enablePaste')) {
                            // 使用上一轮提供的 PAN_DOMAINS
                            const isPan = PAN_DOMAINS.some(d => linkData.host.includes(d));
                            if (isPan) {
                                panPassword = extractPanCode(text);
                            }
                        }

                        if (panPassword) {
                            // 存储交接数据，5秒内打开新页面有效
                            await safeSetValue('pan_paste_handover', {
                                url: linkData.url,
                                code: panPassword,
                                timestamp: Date.now()
                            });
                            showToast(`Password: ${panPassword}`); // 提示用户已提取到密码
                        }

                        safeOpenTab(linkData.url, { active: true });
                        hideUI();
                    };
                    container.appendChild(chainBtn);
                }
            }

            // 检测是否需要显示“校正”按钮
            // 检查当前语言是否为中文
            const curLang = getConfig('language');
            const isChineseEnv = curLang === 'zh-CN' || (curLang === 'auto' && navigator.language.startsWith('zh'));
            
            // 检查是否有目标输入框
            if (isChineseEnv && targetInput) {
                // 预计算是否需要校正 (避免显示无效按钮)
                const isInputType = targetInput.tagName === 'INPUT';
                if (smartCorrectText(text, isInputType) !== null) {
                    
                    const div = document.createElement('div');
                    div.className = isCol ? 'divider divider-h' : 'divider divider-v';
                    container.appendChild(div);

                    const correctBtn = document.createElement('div');
                    correctBtn.className = 'sc-btn';
                    // 使用 SVG 绘制
                    correctBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15l2 2 4-4"></path></svg>`;
                    correctBtn.title = "校正"; // 由于校正功能只面向中文用户，所以这里直接硬编码title
                    correctBtn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); };
                    correctBtn.onclick = (e) => {
                        e.stopPropagation();
                        handleTextCorrection(targetInput, text);
                    };
                    container.appendChild(correctBtn);
                }
            }

    // 3. 若处于闪电粘贴三按钮模式，则再在复制和剪切按钮旁追加一个粘贴按钮
    if (mode === PASTE_MODE_THREE_BTNS) {
        const div = document.createElement('div');
        div.className = isCol ? 'divider divider-h' : 'divider divider-v';
        container.appendChild(div);
        const pasteBtn = document.createElement('div');
        pasteBtn.className = 'sc-btn';
        pasteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`;
        pasteBtn.title = t('btn_paste');
        pasteBtn.onmousedown = e => { e.preventDefault(); e.stopPropagation(); };
        pasteBtn.onclick = async (e) => {
            e.stopPropagation();
            // [修改] 异步再次读取（防止缓存刚过期）或者直接传参
            // 为了稳妥，重新读一次
            const cache = await safeGetValue('smart_paste_cache', null);
            if (cache && cache.text) {
                // 由于划词时焦点仍在输入框，这里把 target 设成 document.activeElement 即可
                performPaste(document.activeElement, cache.text);
                await safeSetValue('smart_paste_cache', null);// 这样下次点击输入框就不会再出现粘贴按钮，直到你再次通过脚本复制新内容
            }
            hideUI();
        };
        container.appendChild(pasteBtn);
    }
        } 
        // ===============
        // 模式 B: 粘贴模式 (闪电粘贴)
        // ===============
        else if (mode === 'paste') {
            const pasteBtn = document.createElement('div');
            pasteBtn.className = 'sc-btn';
            // 使用相同风格的粘贴图标
            pasteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`;
            pasteBtn.title = t('btn_paste');
            pasteBtn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); };
            pasteBtn.onclick = async (e) => {
                e.stopPropagation();
                // [新增] 优先粘贴网盘密码
                if (typeof sessionPanCode !== 'undefined' && sessionPanCode) {
                    performPaste(targetInput || document.activeElement, sessionPanCode);
                    showToast(t('toast_password_pasted'));
                    // 粘贴后是否销毁？需求说"缓存仅在当前标签页有效"，未明确说粘贴一次就废弃
                    // 但为了体验，通常保留直到刷新，或者手动不销毁。
                    // 需求："即使销毁缓存的密码" -> 意味着粘贴一次后销毁？
                    // "点击即可将提取到的...并且即使销毁缓存的密码" -> 应该是即时销毁
                    sessionPanCode = null; 
                    hideUI();
                    return;
                }
                // 执行粘贴逻辑
                performPaste(targetInput, text); // 这里的 text 参数其实已经是传进来的 cache.text 了，可以直接用
                // 粘贴后异步清除缓存，防止重复出现粘贴按钮
                await safeSetValue('smart_paste_cache', null);
                hideUI();
            };
            container.appendChild(pasteBtn);
        }

        const btnCount = container.children.length;
        container.setAttribute('data-btn-count', btnCount);

        shadowRoot.appendChild(container);

        // 计算位置 (通用逻辑)
        container.style.left = '-9999px';
        
        requestAnimationFrame(() => {
            const btnRect = container.getBoundingClientRect();
            const btnW = btnRect.width;
            const btnH = btnRect.height;
            const offset = getConfig('offset');
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            let targetX, targetY;

            // 如果有 rect (Endchar模式 或 ContentEditable光标)，优先跟随 rect
            if (rect) { 
                // 如果 rect 对象包含了我们注入的方向信息 (来自 getSmartSelectionState)
                const isBackward = rect.isBackward || false;
                const isVertical = rect.isVertical || false;
                if (isVertical) {
                    // === 垂直排版处理 (vertical-rl / vertical-lr) ===
                    // 简单处理：正向(下/左)放左侧，反向(上/右)放右侧
                    if (isBackward) {
                        targetX = rect.right + offset;
                        targetY = rect.top; 
                } else {
                    targetX = rect.left - btnW - offset;
                    targetY = rect.bottom - btnH; 
                }
            } else {
                // === 水平排版处理 (默认) ===
                if (isBackward) {
                    // 反向选区 (光标在左/上)：按钮显示在 Rect 的【正上方】
                    targetX = rect.left - (btnW / 2); 
                    targetY = rect.top - btnH - offset;
                } else {
                    // 正向选区 (光标在右/下)：按钮显示在 Rect 的【正下方】
                    targetX = rect.right - (btnW / 2);
                    // 智能避让：如果底部空间不足，自动放到上方 (仅针对正向)
                    const spaceBelow = viewportH - rect.bottom;
                            if (spaceBelow < (btnH + offset + 20)) {
                                targetY = rect.top - btnH - offset;
                            } else {
                                targetY = rect.bottom + offset;
                            }
                        }
                    }
                } else {
                        // Mouse 模式 或 Input 无 Rect 时的兜底
    
    // [修改] 纵向逻辑: 锚点位于视口纵向中线之下，按钮显示在上方；否则显示在下方
    if (mouseY > viewportH / 2) {
        targetY = mouseY - btnH - offset;
    } else {
        targetY = mouseY + offset;
    }

    // [新增] 横向逻辑: 锚点位于视口横向中线右侧，按钮显示在左侧；否则(左侧或重合)显示在右侧
    if (mouseX > viewportW / 2) {
        targetX = mouseX - btnW - offset;
    } else {
        targetX = mouseX + offset;
    }
                }

            // 边缘检测
            const margin = 10;
            targetX = Math.max(margin, Math.min(targetX, viewportW - btnW - margin));
            targetY = Math.max(margin, Math.min(targetY, viewportH - btnH - margin));

            container.style.left = `${targetX}px`;
            container.style.top = `${targetY}px`;
            container.classList.add('visible');

            // 设置自动消失
            const timeout = getConfig('timeout');
            if (timeout > 0) {
                if (uiTimer) clearTimeout(uiTimer);
                uiTimer = setTimeout(hideUI, timeout);
            }
        });
    }

    function hideUI() {
        const btn = shadowRoot && shadowRoot.querySelector('.sc-container');
        if (btn) {
            btn.classList.remove('visible');
            setTimeout(() => {
                if (btn && btn.parentNode) btn.remove();
            }, 200);
        }
        cachedSelection = { text: '', html: '' };
    }

    // ===========
    // 6. 事件监听 (Event Listeners)
    // ===========
function handleSelectionMouseUp(e) {
    if (hostElement && e.composedPath().includes(hostElement)) {return;} //如果点击的是脚本自身的UI内部，直接忽略，以防点击按钮时全局mouseup事件再次触发按钮重绘
    if (!hostElement) initContainer();
    if (isScrolling) return;
    setTimeout(async () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            hideUI();
            return;
        }
        const text = selection.toString();
        if (!text || text.trim().length === 0) {
                hideUI();
            return;
        }
        const range = selection.getRangeAt(0);
        if (getConfig('enableCache')) {
            const container = document.createElement('div');
            container.appendChild(range.cloneContents());
            cachedSelection = {
                text: text,
                html: container.innerHTML
            };
        }
        let rect = null;
        if (getConfig('positionMode') === 'endchar') {
            const smartState = getSmartSelectionState(selection, e);// 使用新算法获取智能 Rect，传入 e (MouseEvent) 以便在框架销毁DOM节点时进行第三级降级定位
            if (smartState) {
                rect = smartState.rect;
                // 将方向信息挂载到 rect 对象上，传递给 renderButton
                // 这样做是为了避免修改 renderButton 的参数签名，保持兼容
                if (rect) {
                    rect.isBackward = smartState.isBackward;
                    rect.isVertical = smartState.isVertical;
                }
            }
        }
        
        initContainer();
        let cache = null;
        if (getConfig('enablePaste')) {
            cache = await safeGetValue('smart_paste_cache', null);
        }
        const cacheValid = cache && (Date.now() - cache.timestamp < 8000);
        const target = document.activeElement;
        const isInput = target && (
            (['INPUT', 'TEXTAREA'].includes(target.tagName) && !target.disabled && !target.readOnly) ||
            target.isContentEditable
        );
        const mode = (cacheValid && isInput) ? PASTE_MODE_THREE_BTNS : 'default';
        renderButton(rect, e.clientX, e.clientY, text, cachedSelection.html || '', mode, isInput ? target : null, isInput);
    }, 10);
}
    // 监听 mousedown，如果点击非按钮区域，取消UI的timeout（准备隐藏）
    function handleGlobalMouseDown(e) {
        if (hostElement && e.composedPath().includes(hostElement)) {
            // 点击了按钮内部，保持
        } else {
            // 点击了页面其他位置，虽然mouseup会触发hideUI，
            // 但这里可以做一个预判，或者清空timer让其立即生效
            const btn = shadowRoot && shadowRoot.querySelector('.sc-container');
            if (btn) btn.classList.remove('visible'); // 视觉上立即消失
        }
    }

    // 滚动与调整大小处理
const handleResizeOrScroll = () => {
    if (!hostElement) return;
    const mode = getConfig('scrollRepaintMode');
    const btn = shadowRoot.querySelector('.sc-container');
    if (!btn) return;

    if (mode === SCROLL_REPAINT_MODE.HIDE) {
        hideUI();
        return;
    }

    if (mode === SCROLL_REPAINT_MODE.VIEWPORT) {
        const selection = window.getSelection();
        if (!selection.rangeCount) { hideUI(); return; }
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        const inViewport = rect.top >= 0 && rect.left >= 0 &&
                           rect.bottom <= window.innerHeight &&
                           rect.right <= window.innerWidth;
        if (!inViewport) { hideUI(); return; }
        // 仍在视口，继续走重绘逻辑
    }

    // 以下为重绘逻辑
    btn.classList.remove('visible');
    isScrolling = true;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
            const range = selection.getRangeAt(0);
            const rects = range.getClientRects();
            if (rects.length > 0) {
                const rect = rects[rects.length - 1];
                renderButton(rect, rect.right, rect.top,
                    selection.toString(),
                    getConfig('enableCache') ? cachedSelection.html : '');
            }
        }
    }, 300);  // debounce 300ms
};

    function handleContextMenu(e) {
    hideUI(); // 右键立即清除按钮
    
    // 右键清除缓存
    if (getConfig('enablePaste')) {
        // 清除本地缓存
        safeSetValue('smart_paste_cache', null);
        // 清除网盘密码缓存
        sessionPanCode = null;
        // 清除网盘密码交接缓存
        safeSetValue('pan_paste_handover', null);
        
        // 可选：显示提示（可根据需要决定是否显示）
        // showToast('粘贴缓存已清除');
    }
}

    function handleKeydownHideUI(e) {if (isUnlockMode) return;hideUI();} // 任意键按下立即无条件隐藏按钮，但超级划词模式下不隐藏按钮

// [新增] 智能文本校正核心算法
    function smartCorrectText(text, isInputType) {
        // 0. 基础判定
        const hasHanzi = /[\u4e00-\u9fa5]/.test(text);
        const hasCNPunct = /[，。：；？！“”‘’（）【】《》]/.test(text);
        const hasNum = /\d/.test(text);

        // 判定生效条件
        let activeRules = {
            basic: hasHanzi, // 规范 1, 2, 5, 9 (依赖汉字)
            punct: hasHanzi || hasCNPunct, // 规范 3, 8
            unit: hasHanzi || hasCNPunct || hasNum, // 规范 4, 7
            pureCN: hasHanzi && !/[a-zA-Z]/.test(text.replace(/[a-zA-Z]+(?=[%℃$])/, '')) // 规范 6 (排除单位后无英文字母)
        };

        if (!activeRules.basic && !activeRules.punct && !activeRules.unit) return null;

        // 辅助：正则替换，跳过引号内的内容 ("..." 或 “...”)
        // 使用 split 分割法：偶数索引为引号外，奇数索引为引号内
        const applyRule = (txt, regex, replacement) => {
            const parts = txt.split(/(".*?"|“.*?”)/g);
            return parts.map((part, i) => {
                if (i % 2 === 1) return part; // 引号内，保持原样
                return part.replace(regex, replacement);
            }).join('');
        };

        let result = text;

        // --- 规范 9: 换行/删空判定 (优先级最高，先处理结构) ---
        // 模式：汉字/句号 + 2空格 + 汉字/数字
        if (activeRules.basic) {
            const rule9Regex = /([\u4e00-\u9fa5。])(\s{2,})(?=[\u4e00-\u9fa5]|\d{1,3}(?:[、.]|\s))/g;
            result = applyRule(result, rule9Regex, (match, p1, p2) => {
                return p1 + (isInputType ? '' : '\n'); // Input删空格，Textarea换行
            });
        }

        // --- 规范 6: 纯中文环境下的英文标点转中文 ---
        if (activeRules.pureCN) {
            // 句号特殊处理
            const parts = result.split(/(".*?"|“.*?”)/g);
            result = parts.map((part, i) => {
                if (i % 2 === 1) return part;
                let p = part;
                // 3个及以上点 -> ……
                p = p.replace(/\.{3,}/g, '……');
                // 2个点 -> 。
                p = p.replace(/\.{2}/g, '。');
                // 单个点：两边是数字不改，否则改
                p = p.replace(/(?<!\d)\.(?!\d)|(?<=\d)\.(?!\d)|(?<!\d)\.(?=\d)/g, '。');
                
                // 其他标点映射
                const map = {',':'，', '?':'？', '!':'！', ':':'：', ';':'；', '(':'（', ')':'）'};
                p = p.replace(/[,?!:;()]/g, m => map[m]);
                // 引号简单的成对替换逻辑比较复杂，这里仅处理明显情况，复杂情况交由后续规范
                return p;
            }).join('');
        }

        // --- 规范 1: 中英之间加空格 ---
        if (activeRules.basic) {
            result = applyRule(result, /([\u4e00-\u9fa5])([a-zA-Z])/g, '$1 $2');
            result = applyRule(result, /([a-zA-Z])([\u4e00-\u9fa5])/g, '$1 $2');
        }

        // --- 规范 2: 中文与数字(含运算)加空格 ---
        // 只有当选区包含明确的数学运算符 (+, *, /, =) 或 "等于" 时，才将 "-" 视为减号并加空格；否则将其视为连词符，不加空格。
        if (activeRules.basic) {
            // 1. 检查是否存在数学语境
            const isMathContext = /[+*/=]|等于/.test(text);
            
            // 2. 构建字符集
            // 如果是数学语境，匹配 [\d+\-*/=] (注意 - 需要转义)
            // 如果非数学语境，仅匹配 [\d] (数字)
            const charSet = isMathContext ? '[\\d+\\-*/=]' : '[\\d]';

            // 构造正则：中文前看/后看
            // 解释：new RegExp 需要双重转义 \\
            const regex1 = new RegExp(`([\\u4e00-\\u9fa5])(?=${charSet})`, 'g'); // 中文 + [数字/符号]
            const regex2 = new RegExp(`(${charSet})(?=[\\u4e00-\\u9fa5])`, 'g'); // [数字/符号] + 中文

            result = applyRule(result, regex1, '$1 ');
            result = applyRule(result, regex2, '$1 ');
        }

        // --- 规范 3: 字符/数字与后方标点去空格 ---
        if (activeRules.punct) {
            result = applyRule(result, /([a-zA-Z0-9\u4e00-\u9fa5])\s+([,.:;?!，。：；？！、\])}（）】【《》[({“^”‘^’"'])/g, '$1$2');
        }

        // --- 规范 4: 数字/字符与单位 (%, ℃, $) ---
        if (activeRules.unit) {
            // 数字 + 空格 + 单位 -> 去空格
            result = applyRule(result, /(\d)\s+([%℃$])/g, '$1$2');
            // 非空非数字 + 无空格 + 单位 -> 加空格
            result = applyRule(result, /([^\s\d])([%℃$])/g, '$1 $2');
        }

        // --- 规范 5: 中文句号去重 ---
        if (activeRules.basic) {
            const parts = result.split(/(".*?"|“.*?”)/g);
            result = parts.map((part, i) => {
                if (i % 2 === 1) return part;
                // >8个: 不改 (忽略)
                // 3-8个: ……
                part = part.replace(/。{3,8}/g, '……');
                // 2个: 。
                part = part.replace(/。{2}/g, '。');
                return part;
            }).join('');
        }

        // --- 规范 7: 数字间中文冒号转英文 ---
        if (activeRules.unit) {
            result = applyRule(result, /(\d)\s*：\s*(\d)/g, '$1:$2');
        }

        // --- 规范 8: 双引号修正 (仅当只有一对时) ---
        if (activeRules.punct) {
            const quoteCount = (result.match(/[“”]/g) || []).length;
            if (quoteCount === 2) {
                let qIndex = 0;
                result = result.replace(/[“”]/g, () => {
                    qIndex++;
                    return qIndex === 1 ? '“' : '”';
                });
            }
        }

        return result === text ? null : result;
    }

    // [新增] 执行校正操作
    async function handleTextCorrection(target, originalText) {
        const isInput = target.tagName === 'INPUT';
        const newText = smartCorrectText(originalText, isInput);
        
        if (!newText) {
            showToast('无需校正');
            return;
        }

        // 尝试写入
        if (document.execCommand && typeof document.execCommand === 'function') {
            try {
                target.focus();
                // 选中当前选区 (因为点击按钮可能丢失了部分焦点状态，或者需要全选替换选中部分)
                // 实际上 PicKit 的逻辑是基于 selection 的，这里直接执行 insertText 会替换选区
                document.execCommand('insertText', false, newText);
            } catch (e) {
                performPaste(target, newText); // 降级使用 paste 逻辑
            }
        } else {
            performPaste(target, newText);
        }
        
        showToast('文本已校正');
        hideUI();
    }

    // [新增] 执行粘贴的核心逻辑
    function performPaste(target, text) {
        if (!target) return;
        target.focus();

        // 策略 1: document.execCommand (保留撤销能力，最稳妥)
        try {
            const success = document.execCommand('insertText', false, text);
            if (success) {
                showToast(t('toast_pasted'));
                return;
            }
        } catch (e) {

        // 策略 2: 直接赋值 + 触发事件 (兼容 Vue/React)
        try {
            // 针对 ContentEditable
            if (target.isContentEditable) {
                // 简单的 HTML 插入或 Text 插入
                const sel = window.getSelection();
                if (sel.rangeCount > 0) {
                    const range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(text));
                    range.collapse(false); // 光标后移
                } else {
                    target.innerText += text;
                }
            } else {
                // 针对 Input / Textarea
                // 拼接字符串 (防止覆盖原有内容)
                const start = target.selectionStart || 0;
                const end = target.selectionEnd || 0;
                const oldVal = target.value;
                const newVal = oldVal.slice(0, start) + text + oldVal.slice(end);
                
                // 获取 Prototype Setter
                // 必须区分 Input 和 TextArea
                let proto = window.HTMLInputElement.prototype;
                if (target.tagName === 'TEXTAREA') {
                    proto = window.HTMLTextAreaElement.prototype;
                }

                const nativeValueSetter = Object.getOwnPropertyDescriptor(proto, "value").set;
                
                // 执行赋值
                if (nativeValueSetter && nativeValueSetter.call) {
                     nativeValueSetter.call(target, newVal);
                } else {
                    target.value = newVal;
                }
                
                // 触发事件通知框架
                target.dispatchEvent(new Event('input', { bubbles: true }));
                target.dispatchEvent(new Event('change', { bubbles: true }));
                
                // 恢复光标(移动到粘贴内容之后)
                const newCursorPos = start + text.length;
                target.setSelectionRange(newCursorPos, newCursorPos);
            }
            showToast(t('toast_paste_compat'));
        } catch (e) {
            // console.error('Paste failed', e);
            showToast(t('toast_paste_fail'));
            }
        }
    }

function handleInputPasteMouseUp(e) {
    if (!getConfig('enablePaste')) return;
    const target = e.target;
    const isInput = (['INPUT', 'TEXTAREA'].includes(target.tagName) && !target.disabled && !target.readOnly) || target.isContentEditable;
    if (!isInput) return;
    setTimeout(async () => { // 延迟执行，确保在 handleSelectionMouseUp 之后运行 (后者通常延迟10ms，我们用20ms覆盖它)
        // 如果有网盘提取的密码 (优先级高于普通缓存)
        if (sessionPanCode) {
            initContainer(); // 确保容器存在
            // 计算输入框位置
            const rect = target.getBoundingClientRect();
            // 渲染特殊的粘贴按钮
            renderButton(rect, e.clientX, e.clientY, '', '', 'paste'); 
            
            // 劫持该按钮的点击事件 (通过修改 renderButton 里的逻辑比较复杂，
            // 建议在这里通过 DOM 操作覆盖 onclick，或者在 renderButton 的 'paste' 模式里处理)
            // 更简单的做法是：让 renderButton 的 paste 模式优先读取 sessionPanCode
            return;
        }
        // 1. 获取剪贴板缓存
        const cache = await safeGetValue('smart_paste_cache', null);
        if (!cache || !cache.text) return; // 如果没有有效缓存，通常不做处理（交由主划词逻辑），但由于主逻辑对 input 支持不佳，这里可以不做任何操作，或者仅仅依靠缓存存在才触发
        if (Date.now() - cache.timestamp > 8000) { // 缓存过期检查 (8秒)
            await safeSetValue('smart_paste_cache', null);
            return;
        }
    // 2. 核心修正：检测输入框内是否真正选中了文本
    let selectedText = ''; 
    let hasSelection = false;
    if (['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        const start = target.selectionStart;
        const end = target.selectionEnd;
        if (typeof start === 'number' && typeof end === 'number' && start !== end) {
            selectedText = target.value.substring(start, end);
            hasSelection = true;
        }
    } else if (target.isContentEditable) {
        // 对于 contentEditable，window.getSelection 通常有效
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
            selectedText = sel.toString();
            hasSelection = true;
        }
    }

    // 3. 决定模式
    // 有选区，如果选中了无意义字符（单个空格或中文逗号），视作用户想要“替换”该字符，仍使用单按钮粘贴模式，否则使用三按钮模式 (复制当前选区文本 + 搜索当前选区文本 + 粘贴缓存文本)
    // 无选区 (仅仅是点击)则直接使用单按钮模式 (粘贴缓存文本)
    const isReplaceIntent = selectedText === ' ' || selectedText === '，';
    const mode = (hasSelection && !isReplaceIntent) ? PASTE_MODE_THREE_BTNS : 'paste';

    // 4. 准备参数
    // renderButton 的 text 参数：
    // - 在 'paste' 模式下，它代表"要粘贴的内容" (即 cache.text)
    // - 在 'copy-search-paste' 模式下，它代表"要复制/搜索的内容" (即 selectedText)
    const textArg = (mode === 'paste') ? cache.text : selectedText;

    // 5. 计算位置 (输入框内通常无法获取精确光标 Rect，降级使用鼠标位置)
        let rect = null;
        if (target.isContentEditable && hasSelection) {
            const sel = window.getSelection();
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const rects = range.getClientRects();
                if (rects.length > 0) {
                    rect = rects[rects.length - 1];
                }
            }
        }
        if (!hostElement) initContainer();
        renderButton(rect, e.clientX, e.clientY, textArg, '', mode, target);
    }, 20);
}

// ====================
    // 7. 元素屏蔽子系统 (Element Blocker Subsystem)
    // ================

    let pickerOverlay = null;
    let pickerHandler = null;
    let pickerClickHandler = null;
    let pickerEscHandler = null;
    let pickerRightClickHandler = null;

    // 自动应用已保存的规则
    function applySavedBlockingRules() {
        const rules = configCache['blocked_elements'] || {}; 
        const domain = location.hostname;
        if (rules[domain] && Array.isArray(rules[domain])) {
            // 将选择器合并为一条CSS规则
            const cssText = rules[domain].join(', ') + ' { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }';
            GM_addStyle(cssText);
            // console.log('Smart Copy: Applied blocking rules for', rules[domain]);
        }
    }

    // 激活拾取模式
    function activateElementPicker() {
        // 如果已经在运行，先清理
        if (pickerOverlay) disablePicker();

        showToast(t('picker_active'));

        // 创建高亮遮罩
        pickerOverlay = document.createElement('div');
        pickerOverlay.style.all = 'initial';
        pickerOverlay.style.position = 'fixed';
        pickerOverlay.style.pointerEvents = 'none';
        pickerOverlay.style.border = '2px solid #ff0000';
        pickerOverlay.style.background = 'rgba(255, 0, 0, 0.1)';
        pickerOverlay.style.zIndex = '2147483646'; // 略低于脚本主容器
        pickerOverlay.style.transition = 'all 0.1s ease';
        pickerOverlay.style.display = 'none';
        document.body.appendChild(pickerOverlay);

        // 鼠标移动处理
        pickerHandler = (e) => {
            const target = e.target;
            // 忽略脚本自身UI 和 遮罩本身
            if (target === hostElement || hostElement.contains(target) || target === pickerOverlay) return;

            const rect = target.getBoundingClientRect();
            pickerOverlay.style.display = 'block';
            pickerOverlay.style.top = rect.top + 'px';
            pickerOverlay.style.left = rect.left + 'px';
            pickerOverlay.style.width = rect.width + 'px';
            pickerOverlay.style.height = rect.height + 'px';
        };

        // 点击处理
        pickerClickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const target = e.target;
            // 防自杀
            if (target === hostElement || hostElement.contains(target)) {
                showToast(t('picker_cant_block_self'));
                return;
            }

            const selector = generateCssSelector(target);
            if (confirm(t('picker_confirm', selector) + `\n(Domain: ${location.hostname})`)) {
                saveBlockRule(selector);
                // 立即隐藏
                target.style.display = 'none';
                showToast(t('picker_saved'));
                disablePicker();
            }
        };

        // ESC 退出
        pickerEscHandler = (e) => {
            if (e.key === 'Escape') {
                disablePicker();
                showToast(t('picker_exit'));
            }
        };

        // 右键 取消
        pickerRightClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        disablePicker();
        };

        document.addEventListener('contextmenu', pickerRightClickHandler, true);
        document.addEventListener('mousemove', pickerHandler, true);
        document.addEventListener('click', pickerClickHandler, true);
        document.addEventListener('keydown', pickerEscHandler, true);
    }

    // 退出拾取模式
    function disablePicker() {
        if (pickerOverlay) {
            pickerOverlay.remove();
            pickerOverlay = null;
        }
        document.removeEventListener('mousemove', pickerHandler, true);
        document.removeEventListener('click', pickerClickHandler, true);
        document.removeEventListener('keydown', pickerEscHandler, true);
        document.removeEventListener('contextmenu', pickerRightClickHandler, true);
        pickerRightClickHandler = null;

    }

    // 生成尽可能短且唯一的 CSS 选择器
    function generateCssSelector(el) {
        if (el.id) return '#' + CSS.escape(el.id);
        
        const tagName = el.tagName.toLowerCase();
        let selector = tagName;
        
        // 尝试使用 class
        if (el.className && typeof el.className === 'string' && el.className.trim().length > 0) {
            // 过滤掉可能动态变化的随机类名（简单启发式：过长的通常是乱码，这里暂不过滤，全取）
            const classes = el.className.trim().split(/\s+/);
            // 拼接前两个类名通常够用了，避免选择器太长
            classes.slice(0, 3).forEach(c => {
                selector += '.' + CSS.escape(c);
            });
        }
        
        // 如果没有ID也没有Class，或者只有TagName，为了避免误伤全站标签，尝试加父级
        if (selector === tagName) {
            if (el.parentElement && el.parentElement !== document.body) {
                return generateCssSelector(el.parentElement) + ' > ' + tagName;
            }
        }

        return selector;
    }

    // 保存规则到 GM 存储
    function saveBlockRule(selector) {
        const rules = configCache['blocked_elements'] || {};
        const domain = location.hostname;
        
        if (!rules[domain]) rules[domain] = [];
        if (!rules[domain].includes(selector)) {
            rules[domain].push(selector);
            // 更新缓存
            configCache['blocked_elements'] = rules;
            // 异步保存
            safeSetValue('blocked_elements', rules);
        }
    }

    // 启动时应用规则
    applySavedBlockingRules();
    // ===============
    // 烟花粒子特效模块
    // ===============
// 春节/圣诞 彩蛋逻辑判断
    function getFestivalType() {
        const now = new Date();
        // 1. 尝试检测农历 (Chinese Lunar)
        try {
            const formatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", { month: "numeric", day: "numeric" });
            // 关键：检查浏览器是否真的支持并使用了农历，否则 Intl 会静默回退到公历
            if (formatter.resolvedOptions().calendar === 'chinese') {
                const parts = formatter.formatToParts(now);
                const monthPart = parts.find(p => p.type === 'month').value;
                const dayPart = parts.find(p => p.type === 'day').value;

                // 宽松解析月份：兼容 "正月"、"1月"、"1"
                const isLunarJan = monthPart.includes('正') || monthPart.replace(/[^\d]/g, '') === '1';
                // 解析日期
                const day = parseInt(dayPart.replace(/[^\d]/g, ''));

                // 如果能读到农历，则规则为：仅在农历正月初一生效
                if (isLunarJan && day === 1) return 'CNY'; 
                return 'NONE'; // 既然支持农历但不是初一，则强制不生效（不回退到圣诞判断）
            }
        } catch (e) {
            // 忽略错误，进入下方回退逻辑
        }

        // 2. 回退逻辑：如果不支持农历，则判断是否为公历 12月25日
        if (now.getMonth() === 11 && now.getDate() === 25) {
            return 'XMAS';
        }
        
        return 'NONE';
    }

    // 触发烟花特效
    function triggerSpringFestivalEffect(x, y, shadowRoot) {
        const festival = getFestivalType();
        if (festival === 'NONE') return;

        // 根据节日配置颜色
        let colors = [];
        if (festival === 'CNY') {
            // 春节：红、金、橙、紫红
            colors = ['#FF0000', '#FFD700', '#FF4500', '#DC143C', '#FFFF00'];
        } else if (festival === 'XMAS') {
            // 圣诞：红、绿、金、白
            colors = ['#FF0000', '#228B22', '#FFD700', '#FFFFFF', '#006400'];
        }

        const activeColors = [];
        for (let i = 0; i < 3; i++) {
            activeColors.push(colors[Math.floor(Math.random() * colors.length)]);
        }

        const particleCount = 20 + Math.floor(Math.random() * 21);
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            const size = 4 + Math.random() * 3;
            const color = activeColors[Math.floor(Math.random() * activeColors.length)];
            
            p.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 2147483647;
                box-shadow: 0 0 6px ${color};
                will-change: transform, opacity;
            `;

            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            let vx = Math.cos(angle) * speed;
            let vy = Math.sin(angle) * speed;
            let opacity = 1.0;
            const gravity = 0.2 + Math.random() * 0.1;
            const friction = 0.96; 
            const decay = 0.01 + Math.random() * 0.02;

            let posX = x;
            let posY = y;

            const animate = () => {
                if (opacity <= 0) {
                    p.remove();
                    return;
                }
                vx *= friction;
                vy *= friction;
                vy += gravity;
                posX += vx;
                posY += vy;
                opacity -= decay;

                p.style.transform = `translate(${posX - x}px, ${posY - y}px)`;
                p.style.opacity = opacity;
                requestAnimationFrame(animate);
            };

            fragment.appendChild(p);
            requestAnimationFrame(animate);
        }
        shadowRoot.appendChild(fragment);
    }

    // 获取 Toast 提示文案
    function getSpringFestivalToastText() {
        const festival = getFestivalType();
        if (festival === 'CNY') {
            return t('festival_cny');
        } else if (festival === 'XMAS') {
            return t('festival_xmas');
        }
        return t('toast_copied');
    }
    // 9. 码字防丢子系统 (Input Recovery Subsystem)
    let inputDebounceTimer = null;

    // 获取用于缓存的 URL Key
    function getRecoveryUrlKey() {
        const mode = getConfig('inputRecoveryMode');
        // 禁用功能
        if (mode === 'off') return null;

        // 启用为严格模式：整段 URL 完全匹配
        if (mode === 'strict') return location.href;

        // 启用为宽松模式：只要出现 ? 就把后面的内容全部扔掉（粗略地剔除跟踪参数）
        const raw = location.href;
        const qMark = raw.indexOf('?');
        return qMark === -1 ? raw : raw.slice(0, qMark);
    }

    // 生成元素的唯一标识符 (这是复用或简化版本)
    function getRecoverySelector(el) {
        if (el.id) return '#' + CSS.escape(el.id);
        if (el.name) return el.tagName.toLowerCase() + `[name="${CSS.escape(el.name)}"]`;
        
        // 生成基于路径的简易选择器
        let path = [];
        let curr = el;
        while (curr && curr !== document.body && curr !== document.documentElement) {
            let tag = curr.tagName.toLowerCase();
            let index = 1;
            let sibling = curr.previousElementSibling;
            while (sibling) {
                if (sibling.tagName === curr.tagName) index++;
                sibling = sibling.previousElementSibling;
            }
            path.unshift(`${tag}:nth-of-type(${index})`);
            curr = curr.parentElement;
        }
        return path.join(' > ');
    }

    // 执行保存逻辑
    async function handleInputSave(e) {
        const target = e.target;
        if (target.dataset.tmScRestoring === 'true') return;// [新增] 如果该元素正在被脚本恢复数据，则忽略此次 Input 事件，避免将刚恢复的文本再次存入缓存
        const mode = getConfig('inputRecoveryMode');
        if (mode === 'off') return;

        // 仅针对文本类输入框
        if (!['TEXTAREA', 'INPUT'].includes(target.tagName)) return;
        if (target.tagName === 'INPUT' && !['text', 'search', 'email', 'url', 'tel', 'number'].includes(target.type)) return;
        
        // 这里的 value 是用户当前的输入
        const val = target.value;
        const selector = getRecoverySelector(target);
        const urlKey = getRecoveryUrlKey();

        if (!urlKey) return;

        if (inputDebounceTimer) clearTimeout(inputDebounceTimer);
        
        inputDebounceTimer = setTimeout(async () => {
            const cache = await safeGetValue('tm_input_recovery_cache', {});
            
            if (!cache[urlKey]) cache[urlKey] = {};
            
            if (!val || val.trim() === '') {
                // 如果值为空（用户主动删除或JS清空），则从缓存移除
                delete cache[urlKey][selector];
                // 如果该URL下没数据了，清理URL Key
                if (Object.keys(cache[urlKey]).length === 0) delete cache[urlKey];
            } else {
                // 更新缓存
                cache[urlKey][selector] = {
                    text: val,
                    ts: Date.now()
                };
            }
            
            // 写入存储
            await safeSetValue('tm_input_recovery_cache', cache);
        }, 500); // 500ms 防抖
    }

    // 表单提交时主动清除缓存
    async function handleFormSubmit(e) {
        const mode = getConfig('inputRecoveryMode');
        if (mode === 'off') return;
        
        // 尝试找到被提交表单内的所有输入框并清除其缓存
        const form = e.target;
        if (!form || form.tagName !== 'FORM') return;

        const inputs = form.querySelectorAll('input, textarea');
        if (inputs.length === 0) return;

        const cache = await safeGetValue('tm_input_recovery_cache', {});
        const urlKey = getRecoveryUrlKey();
        
        if (!cache[urlKey]) return;

        let modified = false;
        inputs.forEach(el => {
            const sel = getRecoverySelector(el);
            if (cache[urlKey][sel]) {
                delete cache[urlKey][sel];
                modified = true;
            }
        });

        if (modified) {
            if (Object.keys(cache[urlKey]).length === 0) delete cache[urlKey];
            await safeSetValue('tm_input_recovery_cache', cache);
        }
    }

    // 恢复文本逻辑
    async function restoreInputData() {
        const mode = getConfig('inputRecoveryMode');
        if (mode === 'off') return;

        const urlKey = getRecoveryUrlKey();
        const cache = await safeGetValue('tm_input_recovery_cache', {});
        const pageData = cache[urlKey];

        if (!pageData) return;

        // 遍历缓存的选择器
        Object.keys(pageData).forEach(selector => {
            const entry = pageData[selector];
            // 缓存有效期 24小时，超过则忽略
            if (Date.now() - entry.ts > 24 * 60 * 60 * 1000) return;

            const el = document.querySelector(selector);
            // 只有当元素存在，且当前值为空（防止覆盖用户刚输入的内容或浏览器自带填充）时才恢复
            if (el && (!el.value || el.value.trim() === '')) {
                // 模拟 React/Vue 的原生 Setter 逻辑 (复用 performPaste 的一部分逻辑)
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 
                    "value"
                ).set;
                const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLTextAreaElement.prototype, 
                    "value"
                ).set;

                const setter = el.tagName === 'INPUT' ? nativeInputValueSetter : nativeTextAreaValueSetter;

                if (setter && setter.call) {
                    setter.call(el, entry.text);
                } else {
                    el.value = entry.text;
                }

                // 触发事件以通知框架
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                
                // 视觉反馈（可选：背景微闪一下表示已恢复）
                const originalBg = el.style.backgroundColor;
                el.style.transition = 'background-color 0.5s';
                el.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                setTimeout(() => {
                    el.style.backgroundColor = originalBg;
                }, 1000);
            }
        });
    }
    // ============
    // 8. 启动引导 (Bootstrap)
    // ============

    (async function main() {
        try {
            // 1. 等待配置加载
            await initConfiguration();
            
            // 2. 配置加载完后，再注册菜单 (这样菜单里的 getConfig 才能读到正确的值)
            registerMenus();
            
            // 3. 应用屏蔽规则
            applySavedBlockingRules();

            // 4. unlock mode 下，智能拦截 Ctrl+滚轮
            const handleWheelZoom = (e) => {
                // 核心优化：
                // 只有当 e.ctrlKey 为真（按下了Ctrl） 且 脚本判定已进入解锁模式（isUnlockMode为true，即按下了指定的 ControlLeft/Right）时才拦截
                // 如果你按的是另一侧的 Ctrl，isUnlockMode 会是 false，代码将在此处 return，从而保留原生缩放功能
                if (!e.ctrlKey || !isUnlockMode) return;

                const hotkey = getConfig('unlockHotkey') || '';
                // 双重校验：确保当前配置的解锁键确实是 Control 系列 (防止配置为 Alt 时误拦截 Ctrl 滚轮)
                const isCtrlConfigured = hotkey.includes('Control') || hotkey.toLowerCase() === 'ctrl';

                if (isCtrlConfigured) {
                    // 阻止原生缩放
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 手动执行垂直滚动
                    window.scrollBy({
                        top: e.deltaY,
                        behavior: 'auto'
                    });
                }
            };
            // 必须设置 passive: false 才能阻止默认行为，capture: true 保证最先捕获
            window.addEventListener('wheel', handleWheelZoom, { passive: false, capture: true });

            // 5. 统一注册所有事件监听器 (防止配置没读完就触发划词)
        document.addEventListener('mouseup', handleSelectionMouseUp, false);
        document.addEventListener('mouseup', handleInputPasteMouseUp, true); // capture 阶段
        document.addEventListener('mousedown', handleGlobalMouseDown, false);
        document.addEventListener('contextmenu', handleContextMenu, true);
        window.addEventListener('scroll', handleResizeOrScroll, { passive: true });
        window.addEventListener('resize', handleResizeOrScroll, { passive: true });
        document.addEventListener('keydown', handleKeydownHideUI, true);
        // 6.拖拽预览事件监听
            // 仅在主窗口生效，防止预览弹窗内部递归触发
            if (window.name !== PREVIEW_WIN_NAME) {
                document.addEventListener('dragstart', handleLinkDragStart, false);
                document.addEventListener('dragend', handleLinkDragEnd, false); 
            }
        // 7.启动码字防丢监听
            document.addEventListener('input', handleInputSave, true);
            document.addEventListener('submit', handleFormSubmit, true); // 监听表单提交
            
            // 延迟一点时间恢复数据，确保页面框架（如Vue/React）已挂载 DOM
            if (document.readyState === 'complete') {
                setTimeout(restoreInputData, 500);
            } else {
                window.addEventListener('load', () => setTimeout(restoreInputData, 500));
            }
        
        // 8.检查是否有来自网盘链接的密码交接
            // 放在 main 函数的 try-catch 块内部靠后的位置，或者 restoreInputData 附近
            const checkPanHandover = async () => {
                if (!getConfig('enablePaste')) return;
                
                const handover = await safeGetValue('pan_paste_handover', null);
                if (handover && handover.code) {
                    // 检查时间戳（15秒内有效，防止旧数据干扰）
                    if (Date.now() - handover.timestamp < 15000) {
                        // 简单的URL匹配：如果当前URL包含了提取时的URL关键部分
                        // 由于跳转等原因，只比对 host 或部分 path
                        // 这里做宽松匹配：如果当前页面的URL包含 handover.url 的 host 部分
                        try {
                            const currentUrl = window.location.href;
                            const targetUrlObj = new URL(handover.url); // 如果 handover.url 不规范可能会报错，try-catch捕获
                            
                            if (currentUrl.includes(targetUrlObj.host)) {
                                sessionPanCode = handover.code;
                                // 销毁存储中的密码，保证一次性使用且不污染剪贴板
                                safeSetValue('pan_paste_handover', null);
                                // 显示提示
                                showToast(`${t('btn_paste') || 'Paste'} Code: ${sessionPanCode}`);
                            }
                        } catch(e) {}
                    }
                }
            };
            // 页面加载完成后稍微延迟执行检查
            setTimeout(checkPanHandover, 300);

            // 注意：原本你的代码里事件监听是散落在各处的。
            // 为了安全起见，你可以把原本的 document.addEventListener('mouseup', ...) 
            // 包裹在一个 function startEventListeners() {} 中，然后在这里调用它。
            
        } catch (e) {
            //console.error('Smart Copy 启动失败:', e);
        }
    })();
})();