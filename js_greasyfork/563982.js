// ==UserScript==
// @name         象视平台后台换肤助手
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  为象视平台后台管理系统提供多款皮肤切换（包括 Dracula 暗色主题），支持 iframe 内部样式同步，新增 macOS 风格 UI 优化及高级动效光影，修复侧边栏立体感、表格像素级对齐及单行显示优化，智能调整列宽及居中排版，支持多业务列表自适应，新增弹窗及上传组件样式适配

// @author       Jhih he
// @license      MIT
// @match        https://vr.xhj.com/houseadmin/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563982/%E8%B1%A1%E8%A7%86%E5%B9%B3%E5%8F%B0%E5%90%8E%E5%8F%B0%E6%8D%A2%E8%82%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563982/%E8%B1%A1%E8%A7%86%E5%B9%B3%E5%8F%B0%E5%90%8E%E5%8F%B0%E6%8D%A2%E8%82%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'xhj_skin_theme';
    const STYLE_ID = 'xhj-custom-skin-style';

    // 定义主题配置
    const themes = {
        'default': {
            name: '默认 (Default)',
            vars: {} // 空对象表示移除样式
        },
        'dracula': {
            name: 'Dracula',
            vars: {
                '--xhj-bg': '#282a36',
                '--xhj-fg': '#f8f8f2',
                '--xhj-header-bg': '#44475a',
                '--xhj-side-bg': '#21222c',
                '--xhj-active-bg': '#bd93f9',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': '#6272a4',
                '--xhj-hover-bg': '#6272a4',
                '--xhj-input-bg': '#44475a',
                '--xhj-table-head': '#44475a'
            }
        },
        'solarized-dark': {
            name: 'Solarized Dark',
            vars: {
                '--xhj-bg': '#002b36',
                '--xhj-fg': '#839496',
                '--xhj-header-bg': '#073642',
                '--xhj-side-bg': '#00212b',
                '--xhj-active-bg': '#268bd2',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': '#586e75',
                '--xhj-hover-bg': '#586e75',
                '--xhj-input-bg': '#073642',
                '--xhj-table-head': '#073642'
            }
        },
        'monokai': {
            name: 'Monokai',
            vars: {
                '--xhj-bg': '#272822',
                '--xhj-fg': '#f8f8f2',
                '--xhj-header-bg': '#3e3d32',
                '--xhj-side-bg': '#1e1f1c',
                '--xhj-active-bg': '#a6e22e',
                '--xhj-active-fg': '#272822',
                '--xhj-border': '#75715e',
                '--xhj-hover-bg': '#49483e',
                '--xhj-input-bg': '#3e3d32',
                '--xhj-table-head': '#3e3d32'
            }
        },
        'github-dark': {
            name: 'GitHub Dark',
            vars: {
                '--xhj-bg': '#0d1117',
                '--xhj-fg': '#c9d1d9',
                '--xhj-header-bg': '#161b22',
                '--xhj-side-bg': '#010409',
                '--xhj-active-bg': '#1f6feb',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': '#30363d',
                '--xhj-hover-bg': '#21262d',
                '--xhj-input-bg': '#0d1117',
                '--xhj-table-head': '#161b22'
            }
        }
    };

    // 通用 CSS 模板 (Layui 覆盖)
    // 注意：需要使用 !important 来确保覆盖原有的 Layui 样式
    const getCssTemplate = (vars) => {
        if (Object.keys(vars).length === 0) return '';

        // 将变量转换为 CSS 变量声明
        const varDeclarations = Object.entries(vars)
            .map(([k, v]) => `${k}: ${v};`)
            .join('\n');

        return `
            :root {
                ${varDeclarations}
                --xhj-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                --xhj-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.3);
                --xhj-radius: 8px;
                --xhj-btn-gradient: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(0,0,0,0));
                --xhj-sidebar-bg: rgba(33, 34, 44, 0.95); /* 半透明背景 */
                --xhj-glow: 0 0 10px rgba(189, 147, 249, 0.4);
                --xhj-glass-border: 1px solid rgba(255, 255, 255, 0.1);
            }

            /* --- 全局 macOS 风格优化 --- */
            
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
                100% { transform: translateY(0px); }
            }

            body {
                -webkit-font-smoothing: antialiased;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }

            /* 全局背景和文字 */
            body, .layui-body, .layui-layout-admin {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
            }

            /* 过渡动画 - 让界面更丝滑 */
            .layui-btn, .layui-input, .layui-nav-item a, .layui-table-cell, .layui-tab-title li {
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            }

            /* --- 侧边栏 macOS 风格 (毛玻璃 + 圆角菜单) --- */
            
            .layui-side, .layui-side-scroll, .layui-bg-black {
                background-color: var(--xhj-side-bg) !important;
                border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
                box-shadow: 5px 0 15px rgba(0,0,0,0.2);
                backdrop-filter: blur(10px); /* 毛玻璃效果 */
            }
            
            /* 侧边栏菜单项 */
            .layui-nav-tree .layui-nav-item a {
                color: var(--xhj-fg) !important;
                margin: 4px 8px !important;
                border-radius: 6px !important;
                width: auto !important;
            }
            .layui-nav-tree .layui-nav-item a:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
                transform: translateX(4px); /* 增加位移 */
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            /* 侧边栏激活项 - macOS 悬浮胶囊风格 (修复扁平问题) */
            .layui-nav-tree .layui-this {
                background-color: transparent !important; /* 容器透明，避免双层背景 */
            }
            .layui-nav-tree .layui-this > a {
                background-color: var(--xhj-active-bg) !important;
                background-image: linear-gradient(135deg, var(--xhj-active-bg), rgba(189, 147, 249, 0.8)) !important;
                color: white !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important; /* 悬浮投影 */
                border-radius: 10px !important; /* 全圆角 */
                margin: 0 10px !important; /* 左右内缩，形成胶囊感 */
                width: auto !important;
                transform: translateY(-1px) scale(1.02) !important; /* 微微上浮放大 */
                text-shadow: none !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
            }
            .layui-nav-tree .layui-this > a::after {
                display: none !important;
            }

            /* --- 顶部 Header & Tabs (修复白色背景) --- */
            
            .layui-layout-admin .layui-header {
                background-color: var(--xhj-header-bg) !important;
                border-bottom: 1px solid var(--xhj-border);
                box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                z-index: 1000;
            }
            
            /* Tab 选项卡 - 修复白色背景 */
            .layui-tab {
                background-color: transparent !important;
            }
            .layui-tab-title {
                border-bottom-color: var(--xhj-border) !important;
                background-color: transparent !important; /* 移除可能的白色背景 */
            }
            .layui-tab-title li {
                color: var(--xhj-fg) !important;
                background-color: rgba(255, 255, 255, 0.05) !important; /* 未选中项稍微亮一点 */
                border-color: transparent !important;
                margin-right: 2px;
                border-radius: 4px 4px 0 0;
            }
            .layui-tab-title .layui-this {
                color: var(--xhj-active-bg) !important;
                background-color: var(--xhj-header-bg) !important;
                border-color: var(--xhj-border) !important;
                border-bottom-color: var(--xhj-header-bg) !important; /* 与内容区融合 */
            }
            .layui-tab-title .layui-this:after {
                border: none !important;
            }

            /* 分页栏 - 修复白色背景 */
            .layui-table-page {
                background-color: transparent !important;
                border-top: 1px solid var(--xhj-border) !important;
            }
            .layui-laypage a, .layui-laypage span {
                color: var(--xhj-fg) !important;
                background-color: transparent !important;
                border-color: var(--xhj-border) !important;
            }
            .layui-laypage a:hover {
                color: var(--xhj-active-bg) !important;
                border-color: var(--xhj-active-bg) !important;
            }
            .layui-laypage .layui-laypage-curr .layui-laypage-em {
                background-color: var(--xhj-active-bg) !important;
            }
            .layui-laypage input, .layui-laypage button, .layui-laypage select {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
            }
            .layui-laypage select {
                padding: 0 5px;
            }

            /* 修复控制面板白色标签及背景问题 */
            .layui-form-label {
                background-color: transparent !important;
                color: var(--xhj-fg) !important;
                border: none !important;
            }
            .layui-input-block, .layui-form-item {
                background-color: transparent !important;
            }
            .layui-form-pane .layui-form-label {
                background-color: rgba(255,255,255,0.05) !important; /* 针对可能的方框标签 */
                color: var(--xhj-fg) !important;
                border-color: var(--xhj-border) !important;
            }

            /* --- 内容区域立体化 --- */

            /* 卡片 - 磨砂玻璃质感 */
            .layui-card {
                background-color: rgba(68, 71, 90, 0.95) !important; /* 稍微透明 */
                color: var(--xhj-fg) !important;
                border: var(--xhj-glass-border) !important;
                border-radius: 12px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
                backdrop-filter: blur(8px);
            }
            .layui-card-header {
                border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                color: var(--xhj-fg) !important;
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }
            
            /* 按钮 macOS 风格 + 霓虹光效 */
            .layui-btn {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                border-radius: 6px !important;
                border: none !important;
                box-shadow: 0 4px 6px rgba(0,0,0,0.2) !important;
                background-image: var(--xhj-btn-gradient) !important;
                position: relative;
                overflow: hidden;
            }
            .layui-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 15px var(--xhj-active-bg), 0 0 5px var(--xhj-active-bg) !important; /* Neon glow */
                opacity: 1;
            }
            .layui-btn:active {
                transform: scale(0.95);
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.3) !important;
            }
            /* 按钮点击波纹效果 (伪元素) */
            .layui-btn::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 5px;
                height: 5px;
                background: rgba(255, 255, 255, 0.5);
                opacity: 0;
                border-radius: 100%;
                transform: scale(1, 1) translate(-50%);
                transform-origin: 50% 50%;
            }
            .layui-btn:active::after {
                animation: ripple 0.6s ease-out;
            }
            @keyframes ripple {
                0% { transform: scale(0, 0); opacity: 0.5; }
                100% { transform: scale(40, 40); opacity: 0; }
            }

            .layui-btn-primary {
                background-color: transparent !important;
                border: 1px solid var(--xhj-border) !important;
                color: var(--xhj-fg) !important;
                box-shadow: none !important;
            }
            .layui-btn-primary:hover {
                border-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 8px var(--xhj-active-bg) !important; /* Glow */
            }

            /* 表单输入框 - 聚焦光环 */
            .layui-input, .layui-select, .layui-textarea {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
                border-radius: 6px !important;
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.1) !important;
            }
            .layui-input:focus, .layui-select:focus, .layui-textarea:focus {
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 0 3px rgba(189, 147, 249, 0.2), 0 0 15px rgba(189, 147, 249, 0.1) !important; /* Stronger Glow */
            }

            /* --- 表格与列表 (核心优化) --- */
            
            .layui-table, .layui-table-view {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
                border-radius: 8px;
                border: none !important; /* 移除外边框，用卡片阴影替代 */
            }
            
            /* 修复选中行/悬浮行白色背景问题 */
            .layui-table-hover, 
            .layui-table-click, 
            .layui-table tbody tr:hover, 
            .layui-table-hover > td, 
            .layui-table-click > td, 
            .layui-table tbody tr:hover > td {
                background-color: rgba(98, 114, 164, 0.2) !important; /* 透出的背景色 */
                backdrop-filter: blur(4px);
            }

            /* 表头 */
            .layui-table thead tr, .layui-table-header {
                background-color: var(--xhj-table-head) !important;
                color: var(--xhj-fg) !important;
                font-weight: 600;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            /* 单元格代码框样式 (极致对齐与单行显示) */
            .layui-table td {
                padding: 0 !important; /* 移除 td 默认内边距，完全由内部盒子控制 */
                border: none !important;
                border-bottom: 1px solid rgba(255,255,255,0.05) !important;
            }
            
            .layui-table-cell {
                font-family: 'SF Mono', 'Consolas', 'Monaco', monospace !important;
                background-color: var(--xhj-input-bg) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-radius: 4px !important;
                
                /* 核心对齐参数 */
                margin: 3px 2px !important;  /* 左右边距 2px */
                padding: 6px 8px !important; /* 增加内边距 */
                /* 文本起始位置 = Margin(2) + Border(1) + Padding(8) = 11px */
                
                height: auto !important; /* 允许高度自适应 */
                
                /* 单行显示核心策略：强制最小宽度 + 禁止换行 */
                white-space: nowrap !important; /* 禁止换行，保持单行 */
                min-width: 160px !important; /* 强制拉宽所有列，确保长文本能放下 */
                overflow: visible !important; /* 超出部分可见（或使用 auto 显示滚动条，但 visible 更符合代码框直觉） */
                text-overflow: clip !important; /* 禁用省略号 */
                text-align: center !important; /* 文字居中排版 */
                
                line-height: 24px !important; /* 舒适行高 */
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                display: block !important;
            }
            
            /* 特定列宽度调整：根据字段最大字数智能适配 */
            
            /* ================= 房勘列表 (Survey) / 默认列表 ================= */
            /* 恢复 v1.12 的全局样式作为默认值，确保房勘列表样式一致 */
            
            /* 1. 订单状态 (3字) - 紧凑 */
            .layui-table tr td:nth-child(1) .layui-table-cell,
            .layui-table th:nth-child(1) .layui-table-cell {
                min-width: 90px !important;
            }

            /* 3. 楼盘名称 - 宽敞 */
            .layui-table tr td:nth-child(3) .layui-table-cell,
            .layui-table th:nth-child(3) .layui-table-cell {
                min-width: 220px !important; 
            }

            /* 4. 申请人 (4字) */
            .layui-table tr td:nth-child(4) .layui-table-cell,
            .layui-table th:nth-child(4) .layui-table-cell {
                min-width: 100px !important; 
            }

            /* 5. 申请门店 - 超宽 */
            .layui-table tr td:nth-child(5) .layui-table-cell,
            .layui-table th:nth-child(5) .layui-table-cell {
                min-width: 260px !important; 
            }

            /* 6 & 7. 时间列 */
            .layui-table tr td:nth-child(6) .layui-table-cell,
            .layui-table th:nth-child(6) .layui-table-cell,
            .layui-table tr td:nth-child(7) .layui-table-cell,
            .layui-table th:nth-child(7) .layui-table-cell {
                min-width: 200px !important; 
            }

            /* 8. 钥匙 (2字) - 极窄 */
            .layui-table tr td:nth-child(8) .layui-table-cell,
            .layui-table th:nth-child(8) .layui-table-cell {
                min-width: 70px !important; 
            }

            /* 9. 摄影师 (4字) */
            .layui-table tr td:nth-child(9) .layui-table-cell,
            .layui-table th:nth-child(9) .layui-table-cell {
                min-width: 100px !important; 
            }

            /* 10. 上传人 (4字) */
            .layui-table tr td:nth-child(10) .layui-table-cell,
            .layui-table th:nth-child(10) .layui-table-cell {
                min-width: 100px !important; 
            }
            
            /* 12. 房堪状态 (4字) */
            .layui-table tr td:nth-child(12) .layui-table-cell,
            .layui-table th:nth-child(12) .layui-table-cell {
                min-width: 100px !important; 
            }
            
            /* --- 弹窗适配 (新增房堪图等) --- */
            
            /* 弹窗内容区域背景 */
            .layui-layer-page .layui-layer-content {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
            }
            
            /* 上传组件适配 */
            .layui-upload-drag {
                background-color: rgba(255, 255, 255, 0.05) !important;
                border: 2px dashed var(--xhj-border) !important;
                border-radius: 8px !important;
            }
            .layui-upload-drag:hover {
                border-color: var(--xhj-active-bg) !important;
                background-color: rgba(255, 255, 255, 0.08) !important;
            }
            .layui-upload-drag .layui-icon {
                color: var(--xhj-active-bg) !important;
            }
            .layui-upload-drag p {
                color: var(--xhj-fg) !important;
            }
            
            /* 弹窗底部按钮栏 (如果存在) */
            .layui-layer-btn {
                background-color: var(--xhj-header-bg) !important;
                border-top: 1px solid var(--xhj-border) !important;
                padding: 10px !important;
            }
            .layui-layer-btn a {
                background-color: transparent !important;
                border: 1px solid var(--xhj-border) !important;
                color: var(--xhj-fg) !important;
                border-radius: 4px !important;
            }
            .layui-layer-btn .layui-layer-btn0 {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                border-color: var(--xhj-active-bg) !important;
            }
            
            /* 弹窗内的表单项适配 */
            .layui-layer-content .layui-form-label {
                color: var(--xhj-fg) !important;
            }
            
            /* 修复弹窗内可能存在的白色背景容器 */
            .layui-layer-content .layui-card,
            .layui-layer-content .admin-main {
                background-color: transparent !important;
                box-shadow: none !important;
                border: none !important;
            }

            /* ================= 售房全景 (Sales) 专属覆盖 ================= */
            
            /* 1. 城市 (2-4字) -> 沿用默认 90px */
            
            /* 2. 楼盘名称 (长) - 覆盖默认 */
            body.xhj-table-sales .layui-table tr td:nth-child(2) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(2) .layui-table-cell {
                min-width: 220px !important;
            }
            
            /* 3. 房源编号 (中长) - 覆盖默认 220px */
            body.xhj-table-sales .layui-table tr td:nth-child(3) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(3) .layui-table-cell {
                min-width: 160px !important;
            }
            
            /* 4,5,6. 摄影师, 设计师, 上传人 (4字) - 覆盖默认 */
            body.xhj-table-sales .layui-table tr td:nth-child(4) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(4) .layui-table-cell,
            body.xhj-table-sales .layui-table tr td:nth-child(5) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(5) .layui-table-cell,
            body.xhj-table-sales .layui-table tr td:nth-child(6) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(6) .layui-table-cell {
                min-width: 100px !important;
            }
            
            /* 7. 全景状态 (3字) - 覆盖默认 */
            body.xhj-table-sales .layui-table tr td:nth-child(7) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(7) .layui-table-cell {
                min-width: 100px !important;
            }

            /* 修复双重文字框：全景状态列（Col 7）包含按钮/Badge，移除外层代码框样式 */
            body.xhj-table-sales .layui-table tr td:nth-child(7) .layui-table-cell {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important; /* 避免内边距叠加 */
            }
            
            /* 8. 户型图 (2字) - 覆盖默认 */
            body.xhj-table-sales .layui-table tr td:nth-child(8) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(8) .layui-table-cell {
                min-width: 80px !important;
            }

            /* 修复双重文字框：户型图列（Col 8）包含按钮，移除外层代码框样式 */
            body.xhj-table-sales .layui-table tr td:nth-child(8) .layui-table-cell {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
            }
            
            /* 9. 朝向 (2-4字) - 覆盖默认 */
            body.xhj-table-sales .layui-table tr td:nth-child(9) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(9) .layui-table-cell {
                min-width: 90px !important;
            }
            
            /* 10. 卧室 (1-2字) - 覆盖默认 */
            body.xhj-table-sales .layui-table tr td:nth-child(10) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(10) .layui-table-cell {
                min-width: 70px !important;
            }
            
            /* 11, 12. 时间列 (长) - 覆盖默认 */
            body.xhj-table-sales .layui-table tr td:nth-child(11) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(11) .layui-table-cell,
            body.xhj-table-sales .layui-table tr td:nth-child(12) .layui-table-cell,
            body.xhj-table-sales .layui-table th:nth-child(12) .layui-table-cell {
                min-width: 180px !important;
            }

            /* 12. 操作列 (Col 13?) 注意：售房全景最后一列可能是操作列 */
            /* 如果有第13列，需要额外处理，这里先按用户反馈的1-12列处理 */


            /* 操作列特殊处理（通常需要更宽） */
            .layui-table tr td:last-child .layui-table-cell,
            .layui-table th:last-child .layui-table-cell {
                min-width: 260px !important; /* 给予操作列足够空间 */
            }
            
            /* 列表头部单元格样式 */
            .layui-table th .layui-table-cell {
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
                font-size: 13px;
                color: var(--xhj-fg);
                opacity: 0.9;
                font-weight: bold;
                
                /* 表头对齐修正 */
                padding: 8px 11px !important; /* 左内边距 11px，与下方内容(11px)完美对齐 */
                
                /* 同步 Body 策略 */
                white-space: nowrap !important;
                min-width: 160px !important; /* 保持与 Body 一致的最小宽度，确保对齐 */
                text-align: center !important; /* 表头居中 */
                
                height: auto !important;
                display: block !important;
            }

            /* 选中行时，单元格边框高亮，增强反馈 */
            .layui-table tr:hover .layui-table-cell {
                border-color: var(--xhj-active-bg) !important;
                transform: scale(1.02);
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                z-index: 1;
                position: relative;
            }

            /* 各字段显示不同颜色 (Dracula Palette) - 使用 inset shadow 代替 border 以修复对齐 */
            .layui-table tr td:nth-child(1) .layui-table-cell { color: #ff79c6 !important; box-shadow: inset 3px 0 0 #ff79c6, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(2) .layui-table-cell { color: #8be9fd !important; box-shadow: inset 3px 0 0 #8be9fd, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(3) .layui-table-cell { color: #50fa7b !important; box-shadow: inset 3px 0 0 #50fa7b, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(4) .layui-table-cell { color: #bd93f9 !important; box-shadow: inset 3px 0 0 #bd93f9, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(5) .layui-table-cell { color: #ffb86c !important; box-shadow: inset 3px 0 0 #ffb86c, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(6) .layui-table-cell { color: #f1fa8c !important; box-shadow: inset 3px 0 0 #f1fa8c, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(7) .layui-table-cell { color: #ff5555 !important; box-shadow: inset 3px 0 0 #ff5555, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(8) .layui-table-cell { color: #8be9fd !important; box-shadow: inset 3px 0 0 #8be9fd, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(9) .layui-table-cell { color: #50fa7b !important; box-shadow: inset 3px 0 0 #50fa7b, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(10) .layui-table-cell { color: #ff79c6 !important; box-shadow: inset 3px 0 0 #ff79c6, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(11) .layui-table-cell { color: #bd93f9 !important; box-shadow: inset 3px 0 0 #bd93f9, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(12) .layui-table-cell { color: #ffb86c !important; box-shadow: inset 3px 0 0 #ffb86c, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            
            /* 下拉框选项美化 */
            .layui-form-select dl {
                background-color: var(--xhj-header-bg) !important;
                border-color: var(--xhj-border) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            }
            .layui-form-select dl dd {
                font-family: monospace !important;
                color: var(--xhj-fg) !important;
            }
            .layui-form-select dl dd:hover {
                background-color: var(--xhj-hover-bg) !important;
            }
            .layui-form-select dl dd.layui-this {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
            }
            
            /* 弹窗 Layer 立体化 */
            .layui-layer {
                background-color: var(--xhj-header-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
                box-shadow: 0 20px 50px rgba(0,0,0,0.6) !important;
                border-radius: 12px !important;
                overflow: hidden;
                animation: layui-layer-zoomIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            }
            .layui-layer-title {
                background-color: var(--xhj-header-bg) !important; /* 保持一致背景 */
                color: var(--xhj-fg) !important;
                border-bottom: 1px solid var(--xhj-border) !important;
            }
            .layui-layer-content {
                color: var(--xhj-fg) !important;
            }
            
            /* 整体布局间距优化 */
            .layui-fluid {
                padding: 20px !important;
            }
            .layui-card {
                margin-bottom: 20px !important;
            }
            
            /* 按钮样式深度优化 */
            .layui-btn {
                border: none !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            }
            .layui-btn-primary {
                background-color: transparent !important;
                border: 1px solid var(--xhj-border) !important;
                color: var(--xhj-fg) !important;
            }
            .layui-btn-primary:hover {
                border-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-bg) !important;
            }
            
            /* 弹窗/Layer 深度修复 */
            .layui-layer, .layui-layer-title, .layui-layer-content, .layui-layer-btn, .layui-layer-dialog {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
                border-color: var(--xhj-border) !important;
            }
            .layui-layer-title {
                border-bottom: 1px solid var(--xhj-border) !important;
                background-color: var(--xhj-header-bg) !important;
            }
            .layui-layer-btn {
                background-color: var(--xhj-bg) !important;
                border-top: 1px solid var(--xhj-border) !important;
            }
            
            /* 下拉选择框修复 */
            .layui-form-select dl {
                background-color: var(--xhj-bg) !important;
                border-color: var(--xhj-border) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            }
            .layui-form-select dl dd {
                color: var(--xhj-fg) !important;
            }
            .layui-form-select dl dd.layui-this {
                background-color: var(--xhj-active-bg) !important;
                color: #fff !important;
            }
            .layui-form-select dl dd:hover {
                background-color: rgba(255,255,255,0.05) !important;
            }

            /* 强力覆盖可能的白底 */
            .layui-bg-white {
                background-color: transparent !important;
            }
            .admin-main {
                background-color: transparent !important;
            }

        `;
    };

    // 应用主题
    const applyTheme = (themeName) => {
        const theme = themes[themeName] || themes['default'];
        const css = getCssTemplate(theme.vars);
        
        // 移除旧样式
        const oldStyle = document.getElementById(STYLE_ID);
        if (oldStyle) {
            oldStyle.remove();
        }

        // 如果是默认主题（无 vars），则不添加新样式
        if (!css) return;

        // 添加新样式
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
        
        console.log(`[XHJSkin] Applied theme: ${themeName}`);
    };

    // 切换主题
    const switchTheme = (themeName) => {
        localStorage.setItem(STORAGE_KEY, themeName);
        applyTheme(themeName);
    };

    // 创建 UI
    const createUI = () => {
        // 只在顶层窗口显示 UI
        if (window.top !== window.self) return;

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            font-family: sans-serif;
        `;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '🎨';
        toggleBtn.style.cssText = `
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1AA094, #2F4056);
            color: white;
            border: 2px solid rgba(255,255,255,0.2);
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 100000;
        `;
        toggleBtn.onmouseover = () => {
            toggleBtn.style.transform = 'scale(1.1) rotate(15deg)';
            toggleBtn.style.boxShadow = '0 0 20px rgba(26, 160, 148, 0.6)';
        };
        toggleBtn.onmouseout = () => {
            toggleBtn.style.transform = 'scale(1) rotate(0deg)';
            toggleBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
        };

        const menu = document.createElement('div');
        menu.style.cssText = `
            position: absolute;
            bottom: 70px;
            right: 0;
            background: rgba(30, 30, 40, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: none;
            width: 160px;
            transform-origin: bottom right;
        `;

        const title = document.createElement('div');
        title.textContent = '选择皮肤';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
            color: #fff;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 8px;
            font-size: 14px;
        `;
        menu.appendChild(title);

        Object.keys(themes).forEach(key => {
            const btn = document.createElement('button');
            btn.textContent = themes[key].name;
            btn.style.cssText = `
                display: block;
                width: 100%;
                padding: 10px;
                margin-bottom: 6px;
                border: 1px solid rgba(255,255,255,0.05);
                background: rgba(255,255,255,0.05);
                cursor: pointer;
                text-align: left;
                border-radius: 6px;
                color: #ddd;
                transition: all 0.2s;
                font-size: 13px;
            `;
            btn.onmouseover = () => {
                btn.style.background = 'rgba(255,255,255,0.15)';
                btn.style.color = '#fff';
            };
            btn.onmouseout = () => {
                btn.style.background = 'rgba(255,255,255,0.05)';
                btn.style.color = '#ddd';
            };
            btn.onclick = () => {
                switchTheme(key);
                menu.style.display = 'none';
            };
            menu.appendChild(btn);
        });

        toggleBtn.onclick = () => {
            if (menu.style.display === 'none') {
                menu.style.display = 'block';
                menu.animate([
                    { opacity: 0, transform: 'scale(0.8) translateY(20px)' },
                    { opacity: 1, transform: 'scale(1) translateY(0)' }
                ], {
                    duration: 200,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                });
            } else {
                menu.style.display = 'none';
            }
        };

        container.appendChild(menu);
        container.appendChild(toggleBtn);
        document.body.appendChild(container);
    };

    // 初始化
    const init = () => {
        // 1. 初始加载主题 (默认 Dracula)
        const currentTheme = localStorage.getItem(STORAGE_KEY) || 'dracula';
        applyTheme(currentTheme);

        // 自动识别表格类型并添加 Class
        function identifyTableType() {
            const headers = document.querySelectorAll('.layui-table-header th');
            if (headers.length === 0) return;
            
            const headerTexts = Array.from(headers).map(th => th.textContent.trim());
            const body = document.body;
            
            // 特征识别
            // 房勘列表：通常包含 "申请门店" 和 "房勘状态"
            if (headerTexts.some(t => t.includes('申请门店')) && headerTexts.some(t => t.includes('房勘状态'))) {
                if (!body.classList.contains('xhj-table-survey')) {
                    body.classList.add('xhj-table-survey');
                    body.classList.remove('xhj-table-sales');
                    // console.log('Detected Survey Table');
                }
            } 
            // 售房全景：通常包含 "全景状态" 和 "户型图"
            else if (headerTexts.some(t => t.includes('全景状态')) && headerTexts.some(t => t.includes('户型图'))) {
                if (!body.classList.contains('xhj-table-sales')) {
                    body.classList.add('xhj-table-sales');
                    body.classList.remove('xhj-table-survey');
                    // console.log('Detected Sales Table');
                }
            }
        }

        // 启动监听 (Layui 表格是动态渲染的，需要轮询)
        setInterval(identifyTableType, 500);

        // 2. 监听 storage 事件（用于多窗口/iframe 同步）
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY) {
                applyTheme(e.newValue);
            }
        });

        // 3. 等待 DOM 加载完成后创建 UI (仅 Top Window)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }
    };

    init();

})();
