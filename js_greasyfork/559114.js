// ==UserScript==
// @name Google AI Studio 增强&美化 (Markdown优化/对话目录/侧边栏重排)
// @namespace github.com/Duoduo23333333
// @version 1.0.5
// @description 1. 明确区分User/Model背景；2. 对话内目录，快速跳转到前某句；3. Markdown 全面优化（解决了原版排版/可读性差的问题：间距、字重、颜色调整；代码块内应用编程字体）；4. 右侧边栏重构，常用功能卡片化并置顶；5. 输入框空置时默认只占单行，节省空间。
// @author Duoduo23333333
// @homepageURL https://github.com/Duoduo23333333/Google-AI-Studio-Enhanced
// @supportURL https://github.com/Duoduo23333333/Google-AI-Studio-Enhanced/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://aistudio.google.com/prompts*
// @match https://aistudio.google.com/app/prompts*
// @downloadURL https://update.greasyfork.org/scripts/559114/Google%20AI%20Studio%20%E5%A2%9E%E5%BC%BA%E7%BE%8E%E5%8C%96%20%28Markdown%E4%BC%98%E5%8C%96%E5%AF%B9%E8%AF%9D%E7%9B%AE%E5%BD%95%E4%BE%A7%E8%BE%B9%E6%A0%8F%E9%87%8D%E6%8E%92%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559114/Google%20AI%20Studio%20%E5%A2%9E%E5%BC%BA%E7%BE%8E%E5%8C%96%20%28Markdown%E4%BC%98%E5%8C%96%E5%AF%B9%E8%AF%9D%E7%9B%AE%E5%BD%95%E4%BE%A7%E8%BE%B9%E6%A0%8F%E9%87%8D%E6%8E%92%29.meta.js
// ==/UserScript==

(function() {
let css = `


    /* ==========================================================================
       0. 核心变量定义: Markdown、UI 颜色等
       ========================================================================== */
    
    /* 默认情况 & 深色模式 */
    body, 
    body.dark-theme {
        /* Markdown 颜色 */
        --my-text-main: #d1d1d1;           /* 正文 颜色浅一些 */
        --my-text-bold: #ffffffe0;         /* 加粗正文 颜色深一些 */
        --my-hr-center: #444444;           /* 分割线中间色 */
        --my-hr-side:   #ffffff08;         /* 分割线边缘色 */
        --my-code-bg:   #333333;           /* 代码块背景 */
        --my-code-text: #e6e6e6;           /* 代码块文字 */
        
        /* 对话框与目录颜色 */
        --my-user-bg: #1F4042;         
        --my-user-code-bg: #112C28; 
        --my-text-color: #FFFFFF; 
        --my-unpressed-item-bg: #191919; 
        --my-pressed-item-bg: #2c6360; 
        --my-hover-item-bg: #285250; 
        --my-border-color: #ffffff30;

        /* 右侧边栏卡片颜色 */
        --my-card-bg: #222222;
        --my-side-border-color: #262626; 
    }

    /* 浅色模式 */
    body.light-theme {
        /* Markdown 颜色 */
        --my-text-main: #373737;         /* 正文 颜色浅一些 */
        --my-text-bold: #000000;        /* 加粗正文 颜色深一些 */
        --my-hr-center: #d0d0d0;        
        --my-hr-side:   #00000005;      
        --my-code-bg:   #f0f2f4;        
        --my-code-text: #1f1f1f;        

        /* 对话框与目录颜色 */
        --my-user-bg: #eff4fb;          
        --my-user-code-bg: #f3f5fb;      
        --my-text-color: #000; 
        --my-unpressed-item-bg: #F3F3F3; 
        --my-pressed-item-bg: #e6edf7; 
        --my-hover-item-bg: #e8ebf8; 
        --my-border-color: #0000001c;

        /* 右侧边栏卡片颜色 */
        --my-card-bg: #F8F8F7;
        --my-side-border-color: #eeeeec;
    }


    /* ==========================================================================
       模块一：Markdown 正文优化
       ========================================================================== */

    /* 1. 正文基础 & 颜色分层 */
    ms-text-chunk, 
    .markdown-content {
        color: var(--my-text-main) !important;
    }

    /* 段落优化：只动行距和段距，不动字号 */
    ms-text-chunk p, 
    .markdown-content p {
        line-height: 1.65 !important;      /* 行距 */
        margin-bottom: 1.2em !important;   /* 段距 */
        color: var(--my-text-main) !important;
    }

    /* 2. 视觉层级：加粗强化 */
    /* 解决字体加粗可能不明显的问题：通过拉大亮度对比度来区分 */
    ms-text-chunk strong,
    ms-text-chunk b,
    .markdown-content strong,
    .markdown-content b {
        color: var(--my-text-bold) !important; 
        font-weight: 700 !important;        /* 确保最大字重 */
    }

    /* 3. 把刺眼的纯白分割线换成渐变 */
    ms-text-chunk hr, 
    .markdown-content hr {
        height: 1px !important;
        background-image: linear-gradient(to right, var(--my-hr-side), var(--my-hr-center), transparent) !important;
        background-color: transparent !important;
        border: none !important;
        margin: 32px 0 !important; /* 上下间距拉大，视觉上会协调很多 */
        opacity: 0.8;
    }

    /* 4. 有序列表嵌无序列表的时候 互相之间行距差别的微调 */
    ms-text-chunk ul, 
    ms-text-chunk ol {
        margin-bottom: 1em !important;
        margin-top: 1em !important;
        padding-left: 30px !important;
    }

    ms-text-chunk li,
    .markdown-content li {
        margin-bottom: 4px !important; /* 列表项之间保持紧凑 */
        line-height: 1.6 !important;
        color: var(--my-text-main) !important;
    }
	

    /* 修复列表内嵌套P标签导致的双倍间距 */
    /* 强行将列表内的段落设为行内元素，消除块级margin */
    ms-text-chunk li p {
        display: inline !important; 
        margin: 0 !important;
    }

    /* 5. 代码块 */
	/*字体选用主流编程字体*/
    code, pre {
        font-family: 
            'Fira Code', 
            'JetBrains Mono', 
            'Source Code Pro', 
            'Hack',
            'ui-monospace', 
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            'Liberation Mono',
            'Courier New',
            monospace !important;
        font-size: 0.95em !important; /* 稍微调小一点点，不过编程字体好像通常本来也比正文字体显大 */
    }

    /* 行内代码样式，微调 */
    ms-text-chunk :not(pre) > code {
        background-color: var(--my-code-bg) !important;
        color: var(--my-code-text) !important;
        padding: 2px 5px !important;
        border-radius: 4px !important;
    }


    /* ==========================================================================
       模块二：对话区布局调整，给 user / modal 对话样式做出明显区分
       ========================================================================== */

    /* 给user内容指定颜色，便于区分 */
    .chat-turn-container.user {
        background-color: var(--my-user-bg) !important;
    }
    
    /* user里的代码块 也需要单独指定颜色 */
    .chat-turn-container.user mat-expansion-panel {
        background-color: var(--my-user-code-bg) !important;
    }
    .chat-turn-container.user mat-expansion-panel-header {
        background-color: var(--my-user-code-bg) !important;
    }

	/* 整个对话宽度变窄且偏左，给右边腾出空位，放跳转目录导览    */
		.chat-view-container{
		padding-right: 240px !important;
		overflow-y: hidden !important; 
		overflow-x: hidden !important; 	/* 在少数情况下，比如输入框中行数非常多，输入框height非常大，把上面的部分挤上去了，与此同时，最底部的那个:after元素如果文字较多height较高从而底边出界，就会导致.chat-view-container出现一个滚动范围非常小的滚动条。这个bug不知道怎么搞掉，但考虑到即使出现滚动条，滚动范围也非常小，所以干脆直接禁止这里滚动，观感上也没差。 */
	}

    /* 整个右侧边栏变窄，少占点空间 */
    .settings-items-wrapper {
        width: 210px !important;
    }
    ms-right-side-panel:has(*) {
        width: 210px !important; /* 用has来判断一下 用户有没有手动关掉了这个右侧边栏 */
    }


    /* 2025.12.16 可用的旧版标签名 */
    /* 对话框样式微调，宽度减小，增加易读性，同时也能防止鼠标误触右侧目录 */
    ms-prompt-input-wrapper > div {
        max-width: 790px !important;
    }
    ms-prompt-input-wrapper {
        border-top : 1px solid var(--color-v3-outline-var) !important;
    }
    /* 2025.12.16 可用的旧版标签名 */


    /* 2025.12.17 Ai Studio 官方更新了对话框样式 并更换了标签名 */
    /*对话框调整为只占用单行，按钮居右，width增大，视觉上更和谐 */
    .button-row-left{
        display:none !important; /* 去掉输入框里的 API 钥匙图标 */
    }
    .prompt-box-container{
        flex-direction: row !important;
    }
    .text-wrapper{
        align-items : center !important;
    }
    ms-prompt-box {
        max-width: 1790px !important;
        width: 97.5% !important;
    }
    /* 对话框上面的渐变遮罩的z-index保证最大，让进度条尾端和目录按钮也都能被渐变覆盖 */
    ms-chat-bottom-overlay{
        z-index: 999999999 !important;
    }
    /* 2025.12.17 Ai Studio 官方更新了对话框样式 并更换了标签名 */


	/* 右上角 Get code 和 reset 按钮位置复原：两种方式，防止又换class名或换结构 */
	.overlay-header {
        justify-content: flex-start !important;
    }
        .overlay-header > .right {
        margin-left: 0px !important;
    }
        /* 把“Run settings”标题去掉 剩下的图标调整一下留白和对齐 */
        .overlay-header > h2 {
        display: none !important;
    }
        ms-get-code-button{
            margin-left: -8% !important; 
            margin-right: 30% !important; 
        }





    /* ==========================================================================
       模块三：右侧边栏 功能重排 美化
       ========================================================================== */
    
    /* 1. 隐藏不常用模块 */
    ms-right-side-panel ms-paid-api-key,
    ms-right-side-panel ms-model-selector .subtitle,
    ms-right-side-panel #mediaResolution,
    ms-right-side-panel mat-divider { 
        display: none !important;
    }

    /* 2. 字体微调*/
    ms-right-side-panel span, 
    ms-right-side-panel h3 {
        font-size: 13px !important;
        margin-bottom: 0px !important;
    }

    /* 3. 排序逻辑 */
    /* 确保容器 Flex */
    .scrollable-area {
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important; 
    }

    /* --- 排序 --- */
    /* 1. 模型选择 */
    .settings-item.settings-model-selector { order: 1 !important; }
    /* 2. System instruction */
    ms-system-instructions-panel           { order: 2 !important; }
    /* 3. Gemini 3.0 pro 可选的思考程度 */
    ms-thinking-level-setting              { order: 3 !important; }
    /* 4. Media resolution */
    .settings-item[data-test-id="mediaResolution"] { order: 4 !important; }
    /* 5. Temperature 滑块 */
    .settings-item-column[data-test-id="temperatureSliderContainer"] { order: 5 !important; }
    /* 6. URL 浏览 开关 */
    ms-browse-as-a-tool                    { order: 6 !important; }
    /* 7. 谷歌搜索 开关 */
    .settings-item.settings-tool[data-test-id="searchAsAToolTooltip"] { order: 7 !important; }

    /* --- 次要元素沉底 --- */
    .settings-item.settings-group-header   { order: 101 !important; }
    .settings-item.settings-tool:not([data-test-id="searchAsAToolTooltip"]) { order: 102 !important; }
    .advanced-settings, 
    .settings-item.safety-settings, 
    .settings-item.output-length { order: 103 !important; }

    /* 4. 卡片化样式 UI美化 */
    .settings-item-column[data-test-id="temperatureSliderContainer"],
    .settings-item.settings-tool[data-test-id="searchAsAToolTooltip"],
    ms-browse-as-a-tool .settings-item {
        background: var(--my-card-bg) !important;
        border: 1px solid var(--my-side-border-color) !important;
        border-radius: 8px !important;
        padding: 12px !important;
        margin-bottom: 8px !important;
    }

    /* 单独修改一下温度滑块的内边距 */
    .settings-item-column[data-test-id="temperatureSliderContainer"] {
        padding-top: 6px !important;
        padding-bottom: 0 !important;
    }
    .settings-item-column[data-test-id="temperatureSliderContainer"] .item-input {
        padding-left: 3px !important;
    }

    /* 5. 文本替换 */

    /* URL 访问*/
    /* 隐藏原文本 */
    ms-browse-as-a-tool h3 {
        font-size: 0 !important;        
        display: flex !important;       
        align-items: center !important; 
        min-height: 20px !important;    
        line-height: 0 !important;
    }
    /* 插入新文本: "链接访问" */
    ms-browse-as-a-tool h3::before {
        content: "URL 浏览" !important;
        white-space: pre-wrap !important; 
        font-size: 13px !important;     
        line-height: 1.4 !important;
        text-align: left !important;
        display: block !important;
    }

    /* 谷歌搜索 */
    /* 隐藏原文本，开启纵向 Flex */
    .settings-item.settings-tool[data-test-id="searchAsAToolTooltip"] h3 {
        font-size: 0 !important;     
        display: flex !important;   
        flex-direction: column !important; 
        align-items: flex-start !important;
        justify-content: center !important;
        min-height: 30px !important;  
        line-height: 0 !important;
    }

    .settings-item.settings-tool[data-test-id="searchAsAToolTooltip"] h3::before {
        content: "Google 搜索" !important;
        font-size: 13px !important;      
        line-height: 2.7 !important;
        color: inherit !important;  
        display: block !important;
    }

/* 	本来只是想提醒用完记得关 但越看越觉得碍眼 姑且注掉了 
    .settings-item.settings-tool[data-test-id="searchAsAToolTooltip"] h3::after {
        content: "用完记得关掉" !important;
        font-size: 11px !important; 
        opacity: 0.6 !important; 
        margin-top: 2px !important;
        line-height: 1.2 !important;
        display: block !important;
        font-weight: normal !important;
    }
*/


    /* ==========================================================================
       模块四：右侧可跳转目录
       ========================================================================== */

/* 1. 把容器变宽 以便显示文本 */
    ms-prompt-scrollbar {
        /* 解除所有渲染限制 */
        overflow: visible !important;
        contain: none !important;
        clip: auto !important;
        
        width: 400px !important; 
        
        /* 布局修正 */
        margin-left: -350px !important; 
        padding-left: 372px !important; 
        box-sizing: border-box !important;
        
        /* 把容器设置成鼠标可穿透且视觉透明 */
        pointer-events: none !important;
        background: transparent !important;
        box-shadow: none !important;

        /* 确保层级最高 */
        z-index: 9999 !important;
    }
	
	
/* 2. 当初没注释 现在已经忘了这里是要干嘛了 
		删了之后也好像没影响 但还是留着吧
		以后出问题了记得看过来这里  */
    .scrollbar-track {
        overflow: visible !important;
        width: 100% !important;
        pointer-events: none !important; /* 继承穿透属性 */
    }

	
/* 3. 按钮容器改造 */
    .prompt-scrollbar-item {
        overflow: visible !important;
        pointer-events: none !important; /* 继承穿透属性 */
        position: absolute !important; 
        right: 0 !important; 
        width: 100% !important;
    }
	

/* 4. 按钮本体恢复：在整个容器中，唯独让按钮变成实体，可以被点击 */

    .prompt-scrollbar-item button {
        /* 复活点击事件 */
        pointer-events: auto !important;
        cursor: pointer !important;
        
        /* 确保按钮贴在最右边 (原位置) */
        position: absolute !important;
        right: 0px !important; /* 根据实际情况微调距离右边的距离 */
        top: 0 !important;
        
        /* 确保按钮层级 必须高于一切 */
        z-index: 10000 !important;
    }

    /*  ==========================================================================
			5.显示文字：基于aria-label，实现无DOM的纯css目录方案
       ========================================================================== */

    .prompt-scrollbar-item button[aria-label]::after {
        content: attr(aria-label);
        position: absolute;
        right: -190px;
        top: 50%;
        transform: translateY(-50%);
        width: 165px; 
        background-color: var(--my-unpressed-item-bg);
        color: var(--my-text-color);
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        line-height: 1.4;
        text-align: left;
        white-space: normal; /* 允许换行 */
        border: 1px solid var(--my-border-color);

        /* 交互：让文字块本身也可以等同于button来进行点击交互 */
        pointer-events: auto !important;
        /* hover 时候变手，提示可点击 */
        cursor: pointer !important;
        
        /* 显示保障 */
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 999990 !important;
    }

    /* 悬停高亮优化 */
    .prompt-scrollbar-item button:hover::after {
        background-color: var(--my-hover-item-bg);
        z-index: 999990 !important;
    }

    /* 6. 给当前所处位置的小框 用不同的颜色标出来 (判断标准为aria-pressed="true")  */

    .prompt-scrollbar-item button[aria-pressed="true"]::after {
        background-color: var(--my-pressed-item-bg) !important; 
        border: 0px !important;
        /* 确保它在最上层 防止被其他那些未选中的遮住 */
        z-index: 999991 !important;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
