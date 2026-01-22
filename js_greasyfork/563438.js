// ==UserScript==
// @name         Google AI Studio | 界面汉化 - Dae
// @name:zh-CN   Google AI Studio | 界面汉化 - Dae
// @name:en      Google AI Studio | Chinese Interface - Dae
// @namespace    https://space.bilibili.com/261168982
// @version      1.0.1
// @description  Google AI Studio 界面全汉化，提供更符合中文用户习惯的操作体验。
// @description:en  Full Chinese localization for Google AI Studio interface, providing a more user-friendly experience for Chinese users. Shortcut key (Alt+A) toggles the localization on/off.
// @author       Dae & Gemini
// @license      MIT
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563438/Google%20AI%20Studio%20%7C%20%E7%95%8C%E9%9D%A2%E6%B1%89%E5%8C%96%20-%20Dae.user.js
// @updateURL https://update.greasyfork.org/scripts/563438/Google%20AI%20Studio%20%7C%20%E7%95%8C%E9%9D%A2%E6%B1%89%E5%8C%96%20-%20Dae.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ========= 菜单 ID 存储数组=========
    let registeredMenuIds = [];

    // =========================================================================
    // 配置与常量定义
    // =========================================================================

    // --- 选择器常量 ---
    const SELECTORS = {
        TURN: 'ms-chat-turn',
        EDIT_BUTTON: '.toggle-edit-button',
        NO_TRANSLATE: '[data-no-translate], [notranslate], [contenteditable="true"], .monaco-editor, .message-text, .chat-content, .message, .material-symbols-outlined, .tooltip-overflow, .dae-settings-panel',
        HISTORY_LINK: 'td.cdk-column-name a.name-btn'
    };

    // --- 正则表达式常量 ---
    const REGEX_PATTERNS = {
        kiloTokens: /(\d+)(K tokens)/g,
        dynamicText: /^(.*?)(\s[\d\.]+[s%])$/,
        asciiWord: /^[A-Za-z0-9][A-Za-z0-9\s\-]*[A-Za-z0-9]$/
    };

    // --- 翻译属性集合 ---
    const TRANSLATE_ATTRIBUTES = new Set([
        'title', 'aria-label', 'mattooltip', 'matTooltip',
        'data-tooltip', 'data-title', 'data-mdc-tooltip',
        'data-balloon', 'data-original-title', 'placeholder'
    ]);

    // --- 翻译字典 ---
    const translations = {
        "OK, got it": "好的，知道了",
        "Skip to main content": "跳转到主要内容",
        "Get API key": "获取 API 密钥",
        "Copy API key": "复制 API 密钥",
        "Copy project ID": "复制项目 ID",
        "New chat": "新建聊天",
        "Stream": "实时对话",
        "Generate media": "生成媒体",
        "Build": "构建",
        "History": "聊天列表",
        // "Studio": "工作室",
        "Dashboard": "信息中心",
        "Documentation": "文档",
        "API Keys": "API 密钥",
        "Scroll left": "向左滚动",
        "Scroll right": "向右滚动",
        "Only API Keys for imported projects appear here. If you don't see your API keys, you can import projects on the": "此处仅显示已导入项目的 API 密钥，如果您未看到自己的 API 密钥，可以在",
        "projects page.": "项目页面\u00A0",
        "Learn more.": "了解详情",
        "No projects imported yet": "尚未导入任何项目",
        "Import your projects": "导入项目",
        "Search for Cloud Project by Project Name or Project ID": "按项目名称或项目 ID 搜索 Cloud 项目",
        "No API keys yet": "暂无 API 密钥",
        "Type to search your projects": "输入以搜索您的项目",
        "Gemini API Usage & Billing": "Gemini API 用量&结算",
        "No Google Cloud projects found.": "未找到任何 Google Cloud 项目。",
        "Create an API Key": "创建 API 密钥",
        "to get started.": "\u00A0即可开始。",
        "Project details": "项目详情",
        "Project id": "项目 ID",
        "Remove": "移除",
        "Remove project": "移除项目",
        "Copy name": "复制名称",
        "Usage & Billing": "用量和结算",
        "Changelog": "更新日志",
        "Disclaimer": "免责声明",
        "Settings": "设置",
        "Expand or collapse navigation menu": "展开/收起导航菜单",
        "Open navigation menu": "打开导航菜单",
        "Show run settings": "显示运行设置",
        "Open settings menu": "打开设置菜单",
        "Chat prompt": "null",
        "Untitled prompt": "null",
        "Edit title and description": "编辑标题和描述",
        "System instructions": "系统指令",
        "Get code": "获取代码",
        "Get SDK code to chat with Gemini": "获取与 Gemini 聊天的 SDK 代码",
        "Get SDK code to interact with Gemini Live": "获取与 Gemini 实时对话的 SDK 代码",
        "Get SDK code to generate an image": "获取生成图像的 SDK 代码",
        "Get SDK code to generate speech": "获取生成语音的 SDK 代码",
        "Share prompt": "分享聊天",
        "Share Screen": "共享屏幕",
        "You need to create and run a prompt in order to share it": "您需要创建并运行一个聊天才能分享它",
        "Save prompt": "保存聊天",
        "Saving to Drive": "正在保存",
        "Saving": "保存中",
        "No changes to save": "没有要保存的更改",
        "Saved to Drive": "已保存",
        "Make a copy": "创建副本",
        "User": "用户",
        "Model": "模型",
        "Copying": "正在复制",
        "Copying prompt...": "正在复制聊天...",
        "Model changed": "模型已切换",
        "Stop generation before creating a new chat": "请在创建新聊天前停止生成",
        "The desired model is no longer available so a new model was selected": "所选模型不可用，已自动切换为新模型。",
        "Delete prompt": "删除聊天",
        "Deleting prompt...": "删除中...",
        "Delete": "删除",
        "Deleted": "已删除",
        "Deleting": "删除中",
        "Canceled": "已取消",
        "Branch from here": "从此处创建分支",
        "See original conversation": "查看原始对话:\u00A0",
        "See branched conversations": "查看分支对话:\u00A0",
        "Copy as text": "复制文本",
        "Copy as markdown": "复制 Markdown",
        "More options": "更多",
        "Cancel generation": "取消生成",
        "Share": "分享",
        "Rename": "重命名",
        "Sharing prompt...": "正在分享聊天...",
        "No changes to save": "无需保存",
        "Prompt": "提示词",
        "Prompt name": "聊天名称",
        "Description": "描述",
        "Good response": "回复不错",
        "Bad response": "回复不佳",
        "View full image": "查看完整图像",
        "Large view": "查看完整图像",
        "Large view of this image": "查看此图像的大图",
        "download this image": "下载此图像",
        "copy this image": "复制此图像",
        "Export to Drive": "导出到 Google Drive",
        "Export this image to Google Drive": "将此图像导出至 Google 云端硬盘",
        "Generated Image": "生成的图像",
        "Exporting image to Drive": "正在将图像导出到 Google Drive",
        "File uploaded successfully": "文件上传成功",
        "View in Drive": "在 Google Drive 中查看",
        "Prompt to image alignment": "图像与提示词不符",
        "Too many images have been blocked": "生成的图片被屏蔽的过多",
        "Inappropriate content": "内容不当",
        "Image quality is low": "图像质量不佳",
        "The input Image conflicts with our safety policies. Please try again with a different Image.": "输入的图像不符合我们的安全策略。请尝试使用其他图像。",
        "The input image conflicts with our safety policies. Please try again with a different image.": "输入的图像不符合我们的安全策略。请尝试使用其他图像。",
        "Cancel": "取消",
        "Save": "保存",
        "Are you sure?": "你确定吗?",
        "Submit feedback": "提交反馈",
        "Your response is Feedback under the \\skip\\, and may be used to improve our services subject to our \\skip\\. Do not submit personal, sensitive, or confidential information.": "您的回复属于 \\skip\\ 中定义的“反馈”，并可能用于改进我们的服务，具体遵循我们的 \\skip\\。请勿提交个人、敏感或机密信息。",
        "Messages": "对话内容",
        "Parameters": "参数",
        "Response": "回复",
        "OK": "确认",
        "Confirm": "确认",
        "Compare mode": "比较模式",
        "Clear chat": "清空聊天",
        "Quote": "引用",
        "Quoted content": "已引用内容",
        "Quote:": "引用：",
        "Confirm to clear all conversations?": "确认清除所有对话？",
        "This will clear all conversation content in the current chat.": "将清除当前聊天的所有对话内容。",
        "Cancel": "取消",
        "Confirm": "确认",
        "View more actions": "查看更多操作",
        "File upload failed: Jsloader error (code #1): Timeout reached for loading script https://apis.google.com/js/api.js": "文件上传失败：加载所需脚本 (api.js) 超时 (Jsloader 错误 #1)。",
        "File upload failed: [object Object]": "文件上传失败：发生未知错误。",
        "Unsupported file": "不支持的文件",
        "tokens": "令牌数",
        "0K tokens": "万令牌数",
        "Token Usage:": "令牌用量:",
        "Input tokens:": "输入令牌数:",
        "Output tokens:": "输出令牌数:",
        "Total tokens:": "总令牌数:",
        "Cost Estimation": "费用估算",
        "Input token cost:": "输入令牌费用",
        "Output token cost:": "输出令牌费用",
        "Total cost:": "总费用",
        "*: This is an estimated cost if you make the same request via API. Usage on AI Studio is free.": "*：此为通过 API 发出相同请求时的估算费用，在 AI Studio 中的使用是免费的。",
        "See details on our \\skip\\.": "更多详情请参阅我们的 \\skip\\",
        "pricing page": "定价页面",
        "Welcome to AI Studio": "欢迎使用 AI Studio",
        "Type something or tab to choose an example prompt": "输入内容，或按 Tab 键选择示例提示",
        "Insert assets such as images, videos, files, or audio": "插入图片、视频、文件或音频等资源",
        "Insert assets such as images, videos, folders, files, or audio": "插入图片、视频、文件夹、文件或音频等资源",
        "My Drive": "Google Drive",
        "Select or upload a file on Google Drive to include in your prompt": "从 Google 云端硬盘中选择或上传一个文件以包含在您的聊天中",
        "Select or Upload a file on Google Drive to send to the model": "从 Google 云端硬盘中选择或上传一个文件以发送给模型",
        "Send a file to the model": "向模型发送文件",
        "Upload File": "上传文件",
        "Remove file": "移除文件",
        "Inline media": "嵌入至输入框",
        "Remove audio": "移除音频",
        "Upload a file to Google Drive to include in your prompt": "上传一个文件至 Google 云端硬盘以包含在您的聊天中",
        "Record Audio": "录制音频",
        "Camera": "相机",
        "Unsaved Changes": "未保存的更改",
        "Please wait for the content to finish loading": "等待内容加载完成",
        "Unsaved": "未保存",
        "You have unsaved changes. If you leave without saving, your changes will be lost.": "您有未保存的更改。如果现在离开，所作修改将会丢失。",
        "You have unsaved changes. Are you sure you want to leave this page?": "您有未保存的更改。确定要离开此页面吗？",
        "Your changes are now saved.": "您的更改现已保存。",
        "Generated image": "生成的图像",
        "Leave": "离开",
        "YouTube Video": "YouTube 视频",
        "Sample Media": "示例媒体",
        "Select video Sherlock Jr. (1924) - Full Movie": "选择视频《福尔摩斯二世 (1924) - 完整电影》",
        "Sherlock Jr. (1924) - Full Movie": "《福尔摩斯二世 (1924) - 完整电影》",
        "Select video Sherlock Jr. (1924) - 10 Min Clip": "选择视频《福尔摩斯二世 (1924) - 10 分钟片段》",
        "Sherlock Jr. (1924) - 10 Min Clip": "《福尔摩斯二世 (1924) - 10 分钟片段》",
        "Select video American Museum of Natural History Tour - 30 Min": "选择视频《美国自然历史博物馆之旅 - 30 分钟》",
        "American Museum of Natural History Tour - 30 Min": "《美国自然历史博物馆之旅 - 30 分钟》",
        "Select video American Museum of Natural History Tour - 10 Min": "选择视频《美国自然历史博物馆之旅 - 10 分钟》",
        "American Museum of Natural History Tour - 10 Min": "《美国自然历史博物馆之旅 - 10 分钟》",
        "Select video American Museum of Natural History Tour - 5 Min": "选择视频《美国自然历史博物馆之旅 - 5 分钟》",
        "American Museum of Natural History Tour - 5 Min": "《美国自然历史博物馆之旅 - 5 分钟》",
        "Run prompt": "生成对话",
        "Append to prompt & run": "生成对话",
        "Run the prompt": "生成对话",
        "Please finish editing to run": "请完成编辑后再生成",
        "My history": "聊天列表",
        "Shared with me": "与我分享的",
        "Open in Drive": "在 Drive 中查看",
        "Search": "搜索",
        "Updated": "更新时间",
        "Just now": "刚刚",
        "A minute ago": "1 分钟前",
        "minutes ago": "分钟前",
        "hour ago": "小时前",
        "hours ago": "小时前",
        "Day": "天",
        "Yesterday": "昨天",
        "days ago": "天前",
        "week ago": "周前",
        "weeks ago": "周前",
        "month ago": "个月前",
        "months ago": "个月前",
        "year ago": "年前",
        "years ago": "年前",
        "Type": "类型",
        "Name": "名称",
        "Owner": "所有者",
        "me": "我",
        "Search Google Cloud projects": "搜索 Google Cloud 项目",
        "View status": "查看状态",
        "Content blocked": "内容被拦截",
        "Show details": "查看详情", 
        "Content not permitted.": "内容不符合规范。",
        "Edit safety settings": "编辑安全设置",
        "Submit prompt key": "“发送”快捷键",
        "Enter": "↩",
        "Submit: Ctrl + Enter": "↩ 换行\nAlt + ↩ 仅发送 (不运行)",
        "Newline: Enter": "Ctrl + ↩ 发送并运行",
        "Submit: Enter": "Shift + ↩ 换行\nAlt + ↩ 仅发送 (不运行)",
        "Newline: Shift + Enter": "↩ 发送并运行",
        "Content of your current prompt will be deleted, this action cannot be undone.": "您当前聊天的内容将被删除，此操作无法撤销。",
        "Discard and continue": "放弃并继续",
        "You don't have any prompts yet.": "您还没有任何聊天",
        "New chat prompt": "创建新聊天",
        "No prompts match your search": "没有与您的搜索匹配的聊天",
        "Run": "发送",
        "Rerun": "重新生成",
        "Rerun this turn": "重新生成",
        "What's new": "新功能",
        "URL context tool": "URL 内容提取工具",
        "Try the URL context tool": "URL 内容提取工具",
        "Fetch information from web links": "从网页链接中获取信息",
        "Native speech generation": "原生语音生成",
        "Text to speech with Gemini": "文本转语音",
        "Generate high quality text to speech with Gemini": "使用 Gemini 生成高质量文本转语音",
        "Live audio-to-audio dialog": "实时音频对话",
        "Try Gemini's natural, real-time dialog with audio and video inputs": "体验 Gemini 带有音频和视频输入的自然、实时对话",
        "Veo 3 Fast": "null",
        "Veo 2": "null",
        "Imagen 4 Ultra": "null",
        "Lyria RealTime": "null",
        "Native image generation": "原生图像生成",
        "Interleaved text-and-image generation with the new Gemini 2.0 Flash": "使用新的 Gemini Flash 进行文图交错生成",
        "Open in Colab": "在 Colab 中打开",
        "API Docs": "API 文档",
        "View All Libraries": "查看所有库",
        "Save the prompt before sharing it": "分享前请先保存聊天",
        "Run settings - Left": "运行设置 - 左侧",
        "Run settings - Right": "运行设置 - 右侧",
        "Sync": "同步",
        "Sync system instructions on both sides": "同步两侧的系统指令",
        "Reset settings": "恢复默认设置",
        "Closing the chat will lose the data. Do you want to continue?": "关闭聊天将丢失数据。要继续吗？",
        "Input/Output API Pricing": "输入/输出 API 定价",
        "Input": "输入",
        "Output": "输出",
        "Output:": "输出:",
        "API pricing per 1M tokens, UI remains free of charge": "API 定价按每 100 万个令牌计算，AI Studio为免费使用",
        "Best for": "最适用于",
        "Use case": "用例",
        "Rate limits": "速率限制",
        "Knowledge cutoff": "知识截止日期",
        "Knowledge cut off:": "知识截止日期:\u00A0",
        "Latency": "延迟",
        "Run settings": "运行设置",
        "Continue": "继续",
        "Close": "关闭",
        "Close chat": "关闭聊天",
        "Download": "下载",
        "Expand code snippet": "展开代码",
        "Collapse code snippet": "收起代码",
        "Start typing a prompt": "询问任何问题",
        "Reset default settings": "恢复默认设置",
        "Close run settings panel": "关闭运行设置面板",
        "Token count": "令牌计数",
        "Temperature": "温度",
        "Creativity allowed in the responses": "调整模型的温度\n\n较低值更严谨，较高值更多样",
        "For Gemini 3, best results at default 1.0. Lower values may impact reasoning.": "对于 Gemini 3，默认值 1.0 效果最佳。较低的值可能会影响推理能力。",
        "Media resolution": "媒体分辨率",
        "Minimal": "极速",
        "Low": "低",
        "Medium": "中",
        "High": "高",
        "Higher resolutions may provide better understanding but use more tokens.": "更高分辨率有助于提升理解效果，但会消耗更多令牌数",
        "Default": "默认",
        "Default model": "默认模型",
        "Star model": "收藏",
        "Unstar model": "取消收藏",
        "Starred": "已收藏",
        "Unstarred": "已取消收藏",
        "Thinking budget": "思考预算",
        "Thinking": "深度思考",
        "Thoughts": "深度思考\u00A0",
        // "(experimental)": "(实验性)",
        "(experimental)": "\u00A0",
        "Thinking mode": "深度思考",
        "Auto": "自动",
        "Manual:": "手动:",
        "Toggle thinking mode": "使用深度思考",
        "Enable or disable thinking for responses": "启用或禁用深度思考",
        "Enable saving": "启用保存",
        "Unable to disable thinking mode for this model.": "此模型无法禁用深度思考",
        "Set thinking budget": "设定思考预算",
        "Expand to view model thoughts": "展开思考",
        "Collapse to hide model thoughts": "收起思考",
        "Let the model decide how many thinking tokens to use or choose your own value": "可让模型自行决定思考预算，或由您手动指定",
        "Set how much the model should think, with 32768 being as much as possible": "设定模型的思考预算\n\n最大值为 32768",
        "Toggle thinking budget between auto and manual": "在自动和手动之间切换思考预算",
        "Tools": "工具",
        "Structured output": "结构化输出",
        "Generate structured output": "以 JSON 格式输出",
        "Enter an OpenAPI schema object to constrain the model output. See the API documentation for examples.": "输入 OpenAPI 架构对象以约束模型输出。示例请参阅 API 文档。",
        "Code Editor": "代码编辑器",
        "Visual Editor": "可视化编辑器",
        "Enter an \\skip\\ to constrain the model output. See the \\skip\\ for examples.": "输入 \\skip\\ 以约束模型输出。示例请参阅 \\skip\\",
        "OpenAPI schema object": "OpenAPI 架构对象",
        "API documentation": "API 文档",
        "Press Tab to use an example:": "按 Tab 键使用示例：",
        "Add property": "添加属性",
        "Property": "属性",
        "Type of the property": "属性类型",
        "string": "string (字符串)",
        "number": "number (数字)",
        "integer": "integer (整数)",
        "boolean": "boolean (布尔值)",
        "object": "object (对象)",
        "enum": "enum (枚举)",
        "Make property an array": "设为数组",
        "Mark property as optional": "设为可选",
        "Mark property as required": "设为必填",
        "Make property a single value": "设为单值",
        "Delete property": "删除属性",
        "Function declarations": "函数声明",
        "Enter a list of function declarations for the model to call upon. See the \\skip\\ for examples.": "输入供模型调用的函数声明列表。示例请参阅 \\skip\\",
        "Add function declaration": "添加函数声明",
        "Add parameters": "添加参数",
        "Remove parameters": "移除参数",
        "\" must be specified": "\" 必须指定",
        "Name of the function": "函数名称",
        "Description of the function": "函数描述",
        "Delete function declaration": "删除函数声明",
        "This tool is not compatible with the current active tools.": "此工具与当前启用的工具不兼容",
        "Loading...": "加载中...",
        "Stop editing": "停止编辑",
        "Edit": "编辑",
        "Edited": "已编辑",
        "Edit video options": "编辑视频选项",
        "Invalid start time format. Use hours, minutes, and seconds (e.g., \"1h1m10s\" or \"70s\").": "开始时间格式无效。请使用时、分、秒（例如 “1h1m10s” 或 “70s”）。",
        "Invalid end time format. Use hours, minutes, and seconds (e.g., \"1h1m10s\" or \"70s\").": "结束时间格式无效。请使用时、分、秒（例如 “1h1m10s” 或 “70s”）。",
        "FPS must be a positive number with max value 24.": "FPS 必须是正数，且最大值为 24。",
        "Code execution": "代码执行",
        "Model Run Stats": "模型运行统计",
        "Time to first token:": "首个令牌时间:",
        "Tokens per second:": "每秒令牌数：",
        "Lets Gemini use code to solve complex tasks": "让 Gemini 使用代码解决复杂任务",
        "Enable Function calling to edit": "启用函数调用以编辑",
        "Enable Structured outputs to edit": "启用结构化输出以编辑",
        "Remove URL context": "移除 URL 内容提取",
        "Remove Grounding with Google Search": "移除 Google 搜索",
        "Function calling": "函数调用",
        "Lets you define functions that Gemini can call": "允许您定义可供 Gemini 调用的函数",
        "Google Search Suggestions": "Google 搜索建议",
        "Display of Search Suggestions is required when using Grounding with Google Search.": "当使用 “基于 Google 搜索” 功能时，显示搜索建议。",
        "Sources are provided when a significant portion of the model response comes from a particular source.": "当模型的很大一部分响应内容来自某一特定来源时，系统会提供该来源信息。",
        "Sources are provided when a significant portion of the model response comes from a particular source": "当模型的很大一部分响应内容来自某一特定来源时，系统会提供该来源信息。",
        "Sources": "来源",
        // "Grounding with Google Search": "基于 Google 搜索",
        "Grounding with Google Search": "Google 搜索",
        "Use Google Search": "使用 Google 搜索",
        "Source:": "来源:",
        "Google Search": "Google 搜索",
        "URL context": "URL 内容提取",
        "Browse the url context": "浏览 URL 内容",
        "Advanced settings": "高级设置",
        "Safety settings": "安全设置",
        "Adjust harmful response settings": "调整安全过滤设置",
        "Run safety settings": "运行安全设置",
        "Adjust how likely you are to see responses that could be harmful. Content is blocked based on the probability that it is harmful.": "调整安全过滤的严格程度，系统会根据内容有害的概率进行拦截",
        "You are responsible for ensuring that safety settings for your intended use case comply with the \\skip\\ and \\skip\\. \\skip\\.": "您有责任确保您预期用途的安全设置符合 \\skip\\ 和 \\skip\\。\\skip\\",

        // "You are responsible for ensuring that safety settings for your intended use case comply with the": "您有责任确保您预期用途的安全设置符合",
        "Harassment": "骚扰",
        "Hate": "仇恨",
        "Sexually Explicit": "色情露骨",
        "Dangerous Content": "危险内容",
        "Do not run safety filters": "不运行安全过滤器",
        "Off": "关闭",
        "Always show regardless of probability of being harmful": "无论有害概率多高，始终显示",
        "Block none": "不拦截",
        "Block high probability of being harmful": "拦截高概率有害内容",
        "Block few": "拦截少量",
        "Block medium or high probability of being harmful": "拦截中或高概率有害内容",
        "Block some": "拦截部分",
        "Block low, medium and high probability of being harmful": "拦截低、中和高概率有害内容",
        "Block most": "拦截多数",
        "Reset defaults": "恢复默认",
        "Add stop sequence": "添加停止序列",
        "Truncate response including and after string": "当模型生成此内容时，停止并截断输出",
        "Add stop...": "添加停止序列...",
        "Output length": "输出长度",
        "Maximum number of tokens in response": "单次响应中的最大令牌数",
        "Top P": "Top-P",
        "Top K": "Top-K",
        "Probability threshold for top-p sampling": "Top-P 采样的概率阈值",
        "Prompt gallery": "提示库",
        "Extracting": "提取中",
        "Which response do you prefer?": "您更偏好哪个回复？",
        "about how your feedback is used to improve Google services.": "：您的反馈将如何用于改进 Google 服务",
        "Skip": "跳过",
        "Submit": "提交",
        "Stop": "停止",
        "Chat": "聊天",
        "Theme": "主题",
        "Light": "浅色",
        "Dark": "深色",
        "System": "跟随系统",
        "Terms of service": "服务条款",
        "Terms of Service": "服务条款",
        "Privacy policy": "隐私政策",
        "Privacy Policy": "隐私政策",
        "Send feedback": "发送反馈",
        "Billing Support": "账单支持",
        "Terms": "服务条款",
        " and ": " & ",
        "Use Policy": "使用政策",
        "\\skip\\ about how your feedback is used to improve Google services.": "了解您的反馈将如何用于改进 Google 服务：\\skip\\",
        "Learn more": "了解详情",
        "Gemini API Usage": "Gemini API 用量",
        "Usage": "用量",
        "Billing": "结算",
        "My First Project": "null",
        "Project": "项目",
        "Time Range": "时间范围",
        "Days": "天",
        "days": "天",
        "Today": "今天",
        "Overview": "概览",
        "Usage is reflective of all request types to the Gemini API.": "用量反映了对 Gemini API 的所有请求类型",
        "Usage is only reflective of GenerateContent requests. Other request types are not yet supported.": "用量仅反映 GenerateContent 请求。尚不支持其他请求类型",
        "Look up API Key for project": "查找项目的 API 密钥",
        "Total API Requests per day": "每日 API 请求总数",
        "Total API Errors per day": "每日 API 错误总数",
        "No Data Available": "无可用数据",
        "Generate content": "生成内容",
        "Input Tokens per day": "每日输入令牌数",
        "Requests per day": "每日请求数",
        "Usage information displayed is for the API and does not reflect AI Studio usage, which is offered free of charge.": "显示的用量信息适用于 API，不反映 AI Studio 的用量（免费使用）",
        "Open in Cloud Console": "在 Cloud Console 中打开",
        "Gemini API Billing": "Gemini API 结算",
        "There is no billing currently set up for this project": "这个项目当前未设置结算:",
        "Set up billing": "设置结算",
        "Google AI models may make mistakes, so double-check outputs.": "Google AI 模型可能会犯错，请仔细核对输出内容",
        "Google AI models": "Google AI 模型",
        "may make mistakes, so double-check outputs.": "可能会犯错，请仔细核对输出内容。",
        "Imagen makes mistakes, so double-check it.": "Imagen 可能会犯错，请仔细核对输出内容",
        "This model is not stable and may not be suitable for production use.": "此模型尚不稳定，可能不适合用于生产环境",
        "Try Nano Banana": "使用 Nano Banana 生成图片",
        "Gemini 2.5 Flash Image, state of the art image generation and editing": "又称 Gemini 2.5 Flash Image，最先进的图像生成和编辑模型",
        "Gemini 2.5 Flash Image, state-of-the-art image generation and editing": "又称 Gemini 2.5 Flash Image，最先进的图像生成和编辑模型",
        "Fetch information with URL context": "通过 URL 获取网页信息",
        "Fetch real-time information from web links": "从网页链接获取实时信息",
        "Generate native speech with Gemini": "使用 Gemini 生成原生语音",
        "Try Gemini's natural, real-time dialog experience, with audio and video inputs": "体验 Gemini 自然、实时的对话，支持音频和视频输入",
        "Try Gemini's natural, real-time dialogue experience, with audio and video inputs": "体验 Gemini 自然、实时的对话，支持音频和视频输入",
        "Optional": "(可选)",
        "Optional tone and style instructions for the model": "在此为模型指定语气和风格",
        "Your conversations won’t be saved. However, any files you upload will be saved to your Google Drive. Logging policy still applies even in Temporary chat. See \\skip\\.": "您的对话将不会被保存。不过，您上传的所有文件都将保存至您的 Google 云端硬盘。在临时聊天模式下，日志记录政策依然生效。请参阅 \\skip\\",
        "data use policy": "数据使用政策",
        "Temporary chat": "临时聊天",
        "Your conversation won’t be saved": "您的聊天将不会被保存",
        "Raw Mode": "显示模式",
        "Show conversation without markdown formatting": "以纯文本显示",
        "Show conversation with markdown formatting": "以 Markdown 显示",
        "Create a new chat": "创建新聊天",
        "Saving in progress. Dialog will close automatically when completed.": "正在保存，对话框将在完成后自动关闭。",
        "Go back": "返回",
        "Already in a new chat": "当前已是新对话",
        "Expand prompts history": "展开",
        "Collapse prompts history": "收起",
        "Points to gemini-2.5-flash-preview-09-2025": "指向 gemini-2.5-flash-preview-09-2025",
        "Points to gemini-2.5-flash-lite-preview-09-2025": "指向 gemini-2.5-flash-lite-preview-09-2025",
        "Our most powerful reasoning model, which excels at coding and complex reasoning tasks.": "我们最强大的推理模型，擅长编程和复杂的推理任务。",
        "Our hybrid reasoning model, with a 1M token context window and thinking budgets.": "我们的混合推理模型，拥有 100 万的上下文窗口和“思考”额度。",
        "All context lengths": "所有上下文长度",
        "Our smallest and most cost effective model, built for at scale usage.": "我们最小且最具成本效益的模型，专为大规模使用而构建。",
        "Our previous generation advanced reasoning model, which excels at coding and complex reasoning tasks": "我们上一代高级推理模型，擅长编码和复杂推理任务。",
        "An alias to our latest Flash model which changes over time.": "我们最新 Flash 模型的别名，会随时间变化。",
        "An alias to our latest Flash-Lite model which changes over time.": "我们最新 Flash-Lite 模型的别名，会随时间变化。",
        "Our second generation multimodal model with great performance across all tasks.": "我们第二代多模态模型，在所有任务中都表现出色。",
        "Our second generation small & cost effective model, built for at scale usage.": "我们第二代小型且高性价比模型，专为大规模使用而构建。",
        "Our state-of-the-art image generation and editing model.": "我们最先进的图像生成与编辑模型。",
        "API pricing per 1M tokens. Usage in AI Studio UI is free of charge": "API 定价按每 100 万个令牌计算，在 AI Studio 界面中免费使用。",
        "(aka Gemini 2.5 Flash Image) State-of-the-art image generation and editing model.": "又称 Gemini 2.5 Flash Image，最先进的图像生成和编辑模型。",
        "aka Gemini 2.5 Flash Image": "又称 Gemini 2.5 Flash Image",
        "State-of-the-art image generation and editing model.": "最先进的图像生成和编辑模型",
        "State-of-the-art image generation & editing": "最先进的图像生成和编辑模型",
        "Image (*Output per image)": "图像 (*按单张图片)",
        "Image output is priced at $30 per 1,000,000 tokens. Output images up to 1024x1024px consume 1290 tokens and are equivalent to $0.039 per image. Usage in AI Studio UI is free of charge": "图像输出定价为每 100 万个令牌 30 美元。分辨率在 1024x1024 像素以内的输出图像会消耗 1290 个令牌，相当于每张图片 0.039 美元。在 AI Studio 界面中免费使用。",
        "Copy to clipboard": "复制到剪贴板",
        "Developer docs": "开发者文档",
        "Model selection": "模型选择",
        "All": "全部",
        "Featured": "精选",
        "New": "\u00A0新\u00A0",
        "New app": "构建新应用",
        "Google AI Studio and the Gemini API Status": "Google AI Studio 和 Gemini API 状态",
        "All Systems Operational": "所有系统运行正常",
        "Multimodal Live API": "多模态实时 API",
        "Full outage": "全面中断",
        "Related": "相关",
        "AI Studio may not load for some users.": "部分用户可能无法加载 AI Studio。",
        "ListModels requests fail for all users. Investigation is underway.": "所有用户的 ListModels 请求均失败。正在进行调查。",
        "API key requests may fail for some users. Investigation is underway.": "部分用户的 API 密钥请求可能失败。正在进行调查。",
        "Partial outage": "部分中断",
        "Video Understanding is unavailable for some users. Investigation is underway.": "部分用户无法使用视频理解功能。正在进行调查。",
        "A bug in the billing system is causing erroneous charges on 'Gemini 2.5 Flash Native Image Generation' for some users. All such charges will be refunded.": "结算系统中的一个错误导致部分用户的“Gemini 2.5 Flash 原生图像生成”功能被错误收费。所有此类费用都将退还。",
        "No issues recorded on this day": "当日无问题记录",
        "Past Incidents": "历史事件",
        "Jan": "1 月",
        "Feb": "2 月",
        "Mar": "3 月",
        "Apr": "4 月",
        "May": "5 月",
        "Jun": "6 月",
        "Jul": "7 月",
        "Aug": "8 月",
        "Sep": "9 月",
        "Oct": "10 月",
        "Nov": "11 月",
        "Dec": "12 月",
        "Resolved": "已修复",
        "Detected": "已发现",
        "Mitigated": "已缓解",
        "Identified": "已识别",
        "Individual customer availability may vary depending on billing status and surface used: free tier, billed tier, as well as the chosen model and API features in use.": "个别用户的可用性可能会有所不同，具体取决于结算状态、所用平台（免费版、付费版）以及所选用的模型和正在使用的 API 功能。",
        "Developer forum": "开发者论坛",
        "Copied to clipboard": "已复制到剪贴板",
        "Cannot be empty or contain only spaces.": "内容不能为空",
        "Error querying Drive.": "查询云端硬盘时出错",
        "Generate Python code for a simple calculator app": "为简易计算器应用生成 Python 代码",
        "'Item: Apple, Price: $1'. Extract name, price to JSON.": "将 “Item: Apple, Price: $1” 中的名称、价格提取为JSON格式",
        "Generate a scavenger hunt for street food around the city of Seoul, Korea": "创建一个关于韩国首尔街头美食的寻宝游戏",
        "Explain the probability of rolling two dice and getting 7": "解释掷两个骰子得到 7 的概率",
        "Generate a high school revision guide on quantum computing": "编写一份关于量子计算的高中复习指南",
        "Teach me a lesson on quadratic equations. Assume I know absolutely nothing about it": "给我讲讲一元二次方程，假设我对此一无所知",
        "Design a REST API for a social media platform.": "为社交媒体平台设计一个 REST API",
        "Generate a Docker script to create a simple linux machine.": "生成一个用于创建简易 Linux 机器的 Docker 脚本",
        "Generate a confusion matrix in Python": "用 Python 生成混淆矩阵",
        "Solve geometry problems with an image": "通过图片解决几何问题",
        "Design a social media platform API": "为社交媒体平台设计 API",
        "Write a quantum computing guide for students": "为学生编写一份量子计算指南",
        "Add unit tests for a Python function": "为一个 Python 函数添加单元测试",
        "Find the next shape in a sequence": "找出序列中的下一个图形",
        "Analyze the sentiment of texts": "分析文本的情感",
        "Solve different quadratic equations.": "求解不同的一元二次方程",
        "Craft a blog post with an image": "撰写一篇图文并茂的博客文章",
        "Identify and care for your plants": "识别并养护你的植物",
        "Analyze a research paper": "分析一篇研究论文",
        "Identify elements in a hurricane chart": "识别飓风图中的各项要素",
        "Convert unorganized text into structured tables": "将杂乱的文本转换为结构化表格",
        "Image to a JSON structured recipe": "将图片内容提取为 JSON 格式的食谱",
        "Ask questions about key details in a video": "询问视频中的关键细节",
        "Create a scavenger hunt.": "创建一个寻宝游戏",
        "Test if AI knows which number is bigger": "问问 AI 哪个数字更大",
        "Calculate and explain a probability problem": "计算并解释一道概率题",
        "Create a Python calculator app": "创建 Python 计算器应用",
        "Create regex from text input": "为文本生成正则表达式",
        "Adjust writing tone": "调整写作语气",
        "Write a Docker set up script": "编写 Docker 配置脚本",
        "Get recipe ideas based on an image of ingredients": "根据食材图片获取食谱灵感",
        "Extract price from a string and format it as JSON": "将字符串中的价格提取为 JSON 格式",
        "Find and update time complexity": "分析并更新时间复杂度",
        "Edit an image": "编辑图片",
        "Create a custom birthday card": "生成一张定制的生日贺卡",
        "Create custom product images": "生成定制的产品图片",
        "Combine images of flowers": "组合花卉图片",
        "Generate a story with images": "生成图文并茂的故事",
        "Generate logo and swag ideas for a brand": "为品牌生成Logo和周边创意",
        "Plot a trigonometric graph": "绘制三角函数图像",
        "Link a paid API key here.": "在此关联付费 API 密钥",
        "Ready to chat!": "准备好了，开始聊天吧！",
        "Paid": "付费",
        "Selected": "已选择",
        "Auto-save is now enabled by default.": "自动保存功能现已默认开启。",
        "We heard your feedback—no more lost work! All conversations are now automatically saved so you can easily find them in your History and Google Drive folder.": "我们听取了你们的反馈——再也不用担心聊天内容丢失了！现在，所有对话都将自动保存，方便您在“聊天列表”和 Google 云端硬盘中轻松查找。",
        "For users who still prefer to not save conversations, we’ve introduced Temporary chat, just click the": "对于仍希望不保存对话的用户，我们推出了“临时聊天”功能，只需点击",
        "button and proceed.": "按钮即可开始。",
        "Got it": "我已知晓",
        "Please tell us more about the reason for your feedback (optional)": "请详细说明您的反馈原因（可选）",
        "Not factually correct": "事实不正确",
        "Not helpful": "没有帮助",
        "Not following instructions": "未遵循指令",
        "Harmful or offensive": "有害或冒犯性",
        "Answer took too long": "回答耗时过长",
        "What's wrong? How can the response be improved?": "哪里出错了？如何改进这个回复？",
        "Photo will be added to your prompt": "照片将添加至聊天",
        "Screenshot": "截屏",
        "Screencast": "录屏",
        "Change camera": "翻转摄像头",
        "Take photo": "拍摄",
        "Re-take photo": "重新拍摄",
        "Screenshot will be added to your prompt": "屏幕截图将添加至聊天",
        "Take screenshot": "截取屏幕",
        "Photo": "照片",
        "Video": "视频",
        "Video will be added to your prompt": "视频将添加至聊天",
        "Select or upload a file": "选择或上传文件",
        "Record new audio": "录制新音频",
        "Audio recording will be added to your prompt": "录音将添加至聊天",
        "Re-record": "重新录制",
        "Add to prompt": "添加至聊天",
        "Video settings": "视频设置",
        "YouTube URL": "YouTube 网址",
        "Start Time (e.g., 1m10s)": "开始时间 (例如: 1m10s)",
        "End Time (e.g., 2m30s)": "结束时间 (例如: 2m30s)",
        "FPS (frames per second)": "帧率 (每秒帧数)",
        "Defaults to 1 FPS": "默认为 1 FPS",
        "Videos": "视频",
        "Animal": "动物",
        "Architecture": "建筑",
        "Nature": "自然",
        "Flower": "花卉",
        "Food": "食物",
        "Objects": "物体",
        "Transportation": "交通",
        "Space": "太空",
        "Select an image or video to add to the prompt": "选择要添加至聊天的图片或视频",
        "Take a photo": "拍摄照片",
        "No recording devices available.": "无可用录制设备。",
        "Re-take screenshot": "重新截取",
        "Camera image": "相机照片",
        "Remove image": "移除图片",
        "Select an image to add to the prompt": "选择要添加至聊天的图片",
        "Group by": "分组依据",
        "API Key": "API 密钥",
        "API keys": "API 密钥",
        "Project": "项目",
        "Projects": "项目",
        "View billing": "查看结算",
        "View usage": "查看用量",
        "Items per page:": "每页条目数:",
        "Generative Language": "生成式语言模型",
        // 实时对话页面
        "Stream realtime": "null",
        "Talk to Gemini live": "与 Gemini 实时对话",
        "Talk": "语音",
        "Webcam": "摄像头",
        "Connection failed": "连接失败",
        "Start recording": "开始录制",
        "Stop recording": "停止录制",
        "Start stream to record": "开始实时对话以录制",
        "Stop stream to record": "停止录制并结束对话",
        "Stream is live": "正在实时对话中",
        "Disconnect": "断开连接",
        "tokens / image": "令牌/张",
        "Start new stream": "开始新的实时对话",
        "Connecting to server...": "正在连接服务器...",
        "Resume stream": "继续实时对话",
        "Model used to generate response": "用于生成回复的模型",
        "Clear the chat to start a new stream": "清空对话以开始新的实时对话",
        "Enable function calling to get automatically generated responses for your function calls.": "启用后，模型将为您模拟生成函数调用的返回内容。",
        "Automatic Function Response": "自动生成函数响应",
        "Ground responses with Google Search.": "使用 Google 搜索为回复提供事实依据。",
        "Lets Gemini send audio and video when speech is not detected": "允许 Gemini 在未检测到语音时发送音频和视频",
        "Turn coverage": "对话回合保障",
        "Let Gemini adapt its response style to the input expression and tone": "允许 Gemini 根据输入内容的表情和语气调整回应风格",
        "Affective dialog": "情感对话",
        "This feature enables the model to choose to not respond to audio that's not relevant to the ongoing conversation": "此功能允许模型选择不回应与当前对话无关的音频。",
        "Proactive audio": "主动式音频",
        "This feature enables the model to choose to not respond to audio that’s not relevant to the ongoing conversation": "此功能允许模型选择不回应与当前对话无关的音频。",
        "Enable a sliding context window to automatically shorten chat history by removing the oldest turns.": "启用上下文长度管理，通过自动遗忘最旧的对话来为新内容腾出空间。",
        "Session Context": "上下文管理",
        "Number of tokens accumulated before sliding the context window": "触发自动遗忘的令牌数上限",
        "Max context size": "最大记忆长度",
        "Number of tokens kept in context after sliding the context window": "自动遗忘后，希望保留的最近对话令牌数",
        "Target context size": "保留记忆长度",
        "Select the model voice": "选择模型语音",
        "Voice": "语音",
        "Select media resolution": "选择媒体分辨率",
        "To change this setting, disconnect the stream first": "请先断开实时对话，才能更改此设置",
        "Bright": "明亮",
        "Upbeat": "欢快",
        "Informative": "知识渊博",
        "Firm": "坚定",
        "Excitable": "热情",
        "Youthful": "年轻",
        "Breezy": "轻松",
        "Easy-going": "随和",
        "Breathy": "气泡音",
        "Smooth": "平滑",
        "Gravelly": "沙哑",
        "Soft": "轻柔",
        "Even": "平稳",
        "Mature": "成熟",
        "Forward": "外放",
        "Friendly": "友好",
        "Casual": "休闲",
        "Gentle": "温柔",
        "Lively": "活泼",
        "Knowledgeable": "博学",
        "Warm": "温暖",
        "Higher pitch": "较高音调",
        "Middle pitch": "中等音调",
        "Lower middle pitch": "中低音调",
        "Lower pitch": "较低音调",
        // 生成媒体页面
        "Image": "图像",
        "image": "图像",
        "video": "视频",
        "audio": "音频",
        "text": "文本",
        "application/pdf": "PDF 文档",
        "Gemini 2.5 Flash Image": "Gemini 2.5 Flash Image",
        "gemini-2.5-flash-image": "null",
        "gemini-3-pro-image-preview": "null",
        "Gemini 3 Pro Image Preview": "Gemini 3 Pro Image Preview",
        "Gemini 2.5 Flash Native Audio Preview 12-2025": "Gemini 2.5 Flash Native Audio Preview 12-2025",
        "Our native audio model optimized for higher quality audio outputs with better pacing, voice naturalness, verbosity, and mood.": "我们的原生音频模型针对更高质量的音频输出进行了优化，具有更好的节奏把控、语音自然度、表达丰富度和情绪传递能力。",
        "Mute": "静音",
        "Unmute": "取消静音",
        "Explore models": "探索模型",
        "Our best image generation model yet, engineered for creativity": "迄今最强大的图像生成模型，专为创意而生",
        "Interactively create, control, and perform music in the moment": "即时进行交互式的音乐创作、控制与演奏",
        "Create clips & animate images using generative video": "运用生成式视频技术，创作视频、生成动画",

        "Or try some examples": "或尝试以下示例",
        "Branch out from one generation to the next with multimodal workflows": "多模态工作流，让创意层层递进",
        "Explore Past Forward": "探索“时光穿梭”",
        "Turn the panda into an adventurer archaeologist in a lush Mayan jungle.": "“将熊猫变为一位在玛雅雨林中冒险的考古学家...”",
        "Gemini speech generation": "Gemini 语音生成",
        "Multiple speaker audio": "多人语音",
        "Single speaker audio": "单人语音",
        "Gemini image generation": "Gemini 图像生成",
        "“Generate a sequence of images to produce a step...”": "“生成步骤分解图...”",
        "“Draw an intricate, picturesque pencil sketch of Du...”": "“绘制一幅杜罗河谷风景如画的铅笔素描...”",
        "Live mix musical prompts with a MIDI controller": "使用 MIDI 控制器实时混合音乐指令",
        "Control real time music with text prompts": "通过文本指令实时控制音乐",
        "“Generate a hyper-realistic, studio-quality product ad...”": "“生成一则超逼真、影棚级的商品广告...”",
        "The building's primary structure mimics a colossal, ancient banyan tree, with a ...": "该建筑的主要结构模仿一棵巨大而古老的榕树...",
        "A vintage-style poster advertising a local coffee.": "一张为本地咖啡设计的复古风格广告海报。",
        "Photorealistic long exposure photograph of a subway platform, straight-on view.": "一张地铁站台的超写实长曝光照片，正面视角。",
        "“Create a video showing some hands first sprinkling salt into a pan of stir-fried vegetables...“": "“创建一个视频，展示一只手先将盐撒入一锅翻炒的蔬菜中...”",
        "Animate an image": "为图片生成动画",
        "Create an image of rolling countryside landscape...": "生成一幅连绵起伏的乡村风景图...",
        "An evocative image of an English afternoon tea table with newspaper headline of 'Gemini 2.5' ...": "生成一张英式下午茶的图片，桌上的报纸头条为‘Gemini 2.5’...",
        "Create a Macro photog...": "生成一张微距摄影作品...",
        "Create a horizontally oriented rectangular stamp that features the Mission District's vibrant culture...": "设计一枚横版矩形邮票，展现旧金山米慎区充满活力的文化...",
        "“Create a vintage movie ... ”": "创作一张复古电影海报...",
        "“Create a close-up of a dew-covered spider web ...”": "创作一张挂满露珠的蜘蛛网的特写...",
        "Running": "生成中",
        "View older generations": "查看历史版本",
        "Back to prompt": "返回聊天",

        "Image generation with Imagen in AI Studio has limited free quota for testing. To generate images beyond this limit or integrate Imagen into your projects, please use the Gemini API.": "在 AI Studio 中，使用 Imagen 进行图像生成有免费的测试额度。如需超出此额度，或将 Imagen 集成至您的项目，请使用 Gemini API。",
        "Get started": "开始使用",
        "Generate images with Imagen": "使用 Imagen 生成图像",
        "Add a new line": "换行",
        "Number of images to be returned": "单次生成的图像数量",
        "Number of results": "生成数量",
        "The ratio of width to height of the generated image": "生成图像的宽高比例",
        "Aspect ratio": "宽高比",
        "Aspect ratio of the generated images": "生成图像的宽高比",
        "The output resolution of the generated media": "生成媒体的输出分辨率",
        "Output resolution": "输出分辨率",
        "Create generative media": "生成媒体",
        "Describe your image": "请描述您想要的画面",

        "Plot sin(x) from 0 to 2*pi. Generate the resulting graph image.": "绘制 sin(x) 从 0 到 2π 的函数图像，并生成结果图片",
        "Design a custom birthday card.": "设计一张定制的生日贺卡",
        "Show me different logos and brand swag ideas for my startup called Avurna": "为我的初创公司 Avurna 设计几款 Logo，并提供一些品牌周边的创意",

        "Speech": "语音",
        "Raw structure": "原始结构",
        "The below reflects how to structure your script in your API request.": "以下内容展示了如何在您的 API 请求中构建脚本",
        "Script builder": "脚本构建器",
        "Style instructions": "风格指令",
        "No speakers detected. Please ensure your script's speaker names are also set in the right sidebar.": "未检测到说话人。请确认您脚本中的说话人名称，与右侧边栏的设置保持一致。",
        // "Speaker": "说话人",
        "Use a single voice with advanced tone and emotion controls or simulate a two-voice\n            dialogue": "使用具有高级音调和情感控制的单人语音，或模拟双人对话",
        "Speaker 1 settings": "说话人 1 设置",
        "Speaker 2 settings": "说话人 2 设置",
        "Add dialog": "添加对话",
        "Mode": "模式",
        "Model settings": "模型设置",
        "Voice settings": "语音设置",
        "Multi-speaker audio": "多人语音",
        "Single-speaker audio": "单人语音",
        "Audio voice assistant": "语音助手",
        "Podcast transcript": "播客文稿",
        "Movie scene script": "电影场景脚本",
        "Start typing dialog here...": "在此输入对话内容...",
        "Delete speaker dialog": "删除此段对话",
        "Speaker names must be consistent with speakers used in your prompt": "发言人名称必须与您聊天中使用的发言人保持一致",
        "Voice used to generate audio output.": "用于生成音频输出的语音。",
        "Append text without running": "发送聊天但不生成",
        "Copy prompt to clipboard": "将聊天内容复制到剪贴板",
        "Text": "文本",
        "Start writing or paste text here to generate speech": "在此输入或粘贴文本以生成语音",
        "Describe the style of your dialog, e.g. \"Read this in a dramatic whisper\"": "描述您对话的风格，例如：“请用富有戏剧性的耳语朗读:”",
        "Campfire story": "篝火故事",
        "Use Gemini to read a disclaimer, really fast": "让 Gemini 快速朗读免责声明",
        "Use Gemini to greet you": "让 Gemini 向您问好",

        //Build相关界面
        "Back to start": "返回起始页",
        "Code assistant": "代码助手",
        "Code Assistant": "代码助手",
        "Show Code Assistant": "显示代码助手",
        "Hide Code Assistant": "隐藏代码助手",
        "Running for": "运行中",
        "Ran for": "运行了",
        "Thought for": "已思考",
        "seconds": "秒",
        "Suggestions": "建议",
        "Checkpoint": "版本快照",
        "View diff": "查看差异",
        "See changes in version history": "查看版本历史中的更改",
        "Restore checkpoint": "恢复版本快照",
        "Restore code from this checkpoint": "从此版本快照恢复代码",
        "Allow this app to request access to:": "允许此应用请求访问：",
        "Disallow app from accessing Microphone": "禁止应用访问麦克风",
        "Microphone": "麦克风",
        "Allow": "允许",
        "The app may not work properly without these permissions.": "如果没有这些权限，应用可能无法正常运行。",
        "Restore": "恢复",
        "Previous prompts": "历史提示词",
        "Add AI features": "添加 AI 功能",
        "AI Features": "AI 功能",
        "Remove feature": "移除功能",
        "error running the code": "个代码运行错误",
        "errors running the code": "个代码运行错误",
        "Auto-fix": "自动修复",
        "Dismiss all": "全部忽略",
        "Analyzing": "正在分析",
        "error...": "个错误...",
        "errors...": "个错误...",
        "Analyzed errors for": "错误分析用时",
        "Submitting this feedback report will send the following information to Google:": "提交此反馈报告会将以下信息发送给 Google：",
        "The entire contents of all of the files of your app": "您应用中所有文件的全部内容",
        "The entire contents of earlier versions of the files of your app if they changed in this session": "您应用中，在本会話內被修改过的文件的所有历史版本内容",
        "The entire contents of your chat history with the Code Assistant": "您与“代码助手”的完整聊天记录",
        "Code Assistant messages": "代码助手消息",
        "What did you like about the response?": "您喜欢此回复的哪些方面？",
        "Send": "发送",
        "Thanks for your feedback!": "感谢您的反馈！",
        "Last modified:": "最后修改时间:",
        "Delete app": "删除应用",
        "Prompt cannot be accessed.": "无法访问此聊天",
        "The requested prompt does not exist or you do not have access. If you believe the request is correct, make sure you have first allowed AI Studio access to your Google Drive, and then ask the owner to share the prompt with you.": "您请求的聊天不存在，或您没有访问权限。如果您确认该请求无误，请先确保已授权 AI Studio 访问您的 Google 云端硬盘，然后再请所有者与您分享此聊天。",
        "Page not found": "页面未找到",
        "Check that the URL was entered correctly and try again": "请检查您输入的网址是否正确，然后重试",
        "Go to Build": "前往“构建”页面",
        "Reset the conversation": "重置对话",
        "Preview": "预览",
        "Preview unavailable": "预览不可用",
        "Hide preview": "隐藏预览",
        "Code": "代码",
        "Show code editor": "显示代码编辑器",
        "Full screen": "全屏",
        "Make the app fullscreen": "应用全屏显示",
        "Leave full screen": "退出全屏",
        "Leave fullscreen": "退出全屏",
        "Fullscreen": "全屏",
        "Switch to API Key for your app": "为您的应用切换至 API 密钥",
        "Choose a paid key for ": "选择付费密钥：",
        "Create a new key": "创建新密钥",
        "Make a new copy": "创建新副本",
        "Launch!": "启动！",
        "Default to fullscreen": "默认全屏",
        "Edit app name and description": "编辑应用名称和描述",
        "Add new features or easily modify this app with a prompt or the suggestions below": "通过聊天或以下建议，为此应用添加新功能或进行修改",
        "MIDI Learn Mode": "MIDI 学习模式",
        "Visual Feedback for MIDI": "MIDI 视觉反馈",
        "Visual Feedback for MIDI Input": "MIDI 输入视觉反馈",
        "Save/Load Presets": "保存/加载预设",
        "Global MIDI CC for Play/Pause": "全局 MIDI CC 控制播放/暂停",
        "Clear Filtered Prompts": "清除已过滤的聊天",
        "Make changes, add new features, ask for anything": "进行更改、添加新功能，随心提问",
        "Add files": "添加文件",
        "Copy app": "复制应用",
        "Copy": "复制",
        "Send prompt": "发送聊天",
        "Download app": "下载应用",
        "Share app": "分享应用",
        "Publish your app": "公开您的应用",
        "Advanced share permissions": "高级分享权限",
        "When you share an app with another user, they will be able to see all of its source code. Ensure that your code does not contain any sensitive information, such as API keys.": "当您与其他用户分享应用时，他们将能够看到其所有源代码。请确保您的代码不包含任何敏感信息，例如 API 密钥。",
        "This app is from another developer": "此应用来自其他开发者",
        "This app was developed by another user. Be cautious and only continue with apps you trust. Don’t share personal or sensitive information, such as passwords or payment details. Anyone with this public link can access and edit shared data.": "此应用由其他用户开发。请保持谨慎，仅继续使用您信任的应用。请勿分享个人或敏感信息，例如密码或支付详情。任何拥有此公开链接的人都可以访问和编辑共享数据。",
        "Report legal issue": "举报法律问题",
        "Continue to the app": "继续访问该应用",
        "This app was developed by another user. It may be inaccurate or unsafe.": "此应用由其他用户开发，其内容可能不准确或不安全。",
        "Delete folder": "删除文件夹",
        "Delete file": "删除文件",
        "folder": "文件夹",
        "file": "文件",
        "Are you sure you want to delete": "您确定要删除",
        "and its children": "及其所有内容",
        "? This cannot be undone.": "\u00A0吗？此操作无法撤销。",
        "Switch to API key": "切换到 API 密钥",
        "Device": "设备",
        "Select device preview": "选择设备预览",
        "Reload the app": "重新加载应用",
        "Upload Image": "上传图片",
        "Insert an image to add it to your prompt.": "插入一张图片以添加到您的聊天中。",
        "Upload text file": "上传文本文件",
        "Insert a text file to add it to your prompt.": "插入一个文本文件以添加到您的聊天中。",
        "Upload PDF": "上传 PDF",
        "Insert a PDF to add it to your prompt.": "插入一个 PDF 以添加到您的聊天中。",
        "Add new features or easily modify this app with a prompt": "通过聊天为此应用添加新功能或进行修改",
        "File explorer": "文件浏览器",
        "Go to Definition": "转到定义",
        "Go to References": "转到引用",
        "Go to Symbol...": "转到符号...",
        "Peek": "预览",
        "Rename Symbol": "重命名符号",
        "Change All Occurrences": "更改所有匹配项",
        "Format Document": "格式化文档",
        "Cut": "剪切",
        "Paste": "粘贴",
        "Command Palette": "命令面板",
        "Peek Definition": "预览定义",
        "Peek References": "预览引用",
        "Hide code editor": "隐藏代码编辑器",
        "Show preview": "显示预览",
        "Current screen size": "当前屏幕尺寸",
        "Mobile": "移动设备",
        "Tablet": "平板电脑",
        "Rotate": "旋转",
        "Rotate device": "旋转设备",
        "Make a new copy in Drive": "在 Google Drive 中创建新副本",
        "You can change the display name and description of your app.": "您可以更改应用的显示名称和描述。",
        "Copied link to clipboard": "链接已复制到剪贴板",
        "In order to use GitHub for this app, we need you to create your own copy first. Click \"Save\" below to get started.": "要将此应用与 GitHub 配合使用，您需要先创建自己的副本。点击下方的“保存”即可开始。",
        "Deploy app on Google Cloud": "在 Google Cloud 上部署应用",
        "Deploy your app as a Cloud Run Service. The app will be accessible via a public URL. Your API key will not be exposed in the app, but will be used by the application.": "将您的应用部署为 Google Cloud Run 服务。该应用将可通过公共网址访问。您的 API 密钥不会在应用中公开，但会由应用后端使用。",
        "Select a Google Cloud project to proceed:": "选择一个 Google Cloud 项目以继续：",
        "Select a Cloud Project": "选择一个 Cloud 项目",
        "No Cloud Projects Available": "无可用 Cloud 项目",
        "Rename app": "重命名应用",
        "Deploy app": "部署应用",
        "You must select a project to proceed": "您必须选择一个项目才能继续",
        "Import project": "导入项目",
        "Create project": "创建项目",
        "Choose a key": "选择密钥",
        "Select a key below to use with your applet": "从下方选择一个密钥以用于您的应用",
        "You don't have any projects with a paid quota tier. If you want to use the paid tier,": "您没有任何付费配额等级的项目。如需使用付费等级，请",
        "create an API key.": "创建 API 密钥",
        "You do not need to set an API key to use the free tier.": "您无需设置 API 密钥即可使用免费层级。",
        "Loading your API keys": "正在加载您的 API 密钥",
        "If you would like to use an existing API key, enter it here.": "如需使用现有的 API 密钥，请在此处输入。",
        "Reset": "重置",
        "Done": "完成",
        "Search in files": "在文件中搜索",
        "Add items to file explorer": "向文件浏览器添加项目",
        "Upload files": "上传文件",
        "Create new file": "新建文件",
        "Create new folder": "新建文件夹",
        "Show in editor": "在编辑器中显示",
        "Move": "移动",
        "Open editor settings": "打开编辑器设置",
        "Editor settings": "编辑器设置",
        "The following settings are available for your code editor.": "以下是您的代码编辑器的可用设置。",
        "Text wrapping": "自动换行",
        "The text wraps around the edges of the editor.": "文本将在编辑器边缘自动换行。",
        "Font ligatures": "字体连字",
        "Render the text with font ligatures.": "使用字体连字渲染文本。",
        "Minimap": "代码缩略图",
        "Render the minimap with the file overview.": "渲染带有文件概览的代码缩略图。",
        "Folding": "代码折叠",
        "Enable folding to collapse code blocks.": "启用代码折叠以收起代码块。",
        "Line numbers": "行号",
        "Render the line numbers for each line of code.": "为每行代码渲染行号。",
        "Sticky scroll": "粘性滚动",
        "Enable sticky scroll to show the nested code blocks.": "启用粘性滚动以在顶部显示当前代码范围。",
        "Render indentation guides": "渲染缩进参考线",
        "Render indentation guides for each line of code.": "为代码渲染缩进参考线。",
        "Instructions": "指令",
        "Our current state of the art model": "我们目前最先进的模型",
        "Model selection is currently not available": "当前无法选择模型",
        "Write my own instructions": "自行编写指令",
        "Add custom instructions for your project to control style, models used, add specific knowledge, and more.": "为您的项目添加自定义指令，即可控制其代码风格、所用模型、特定知识等等。",
        "Upload an instructions file": "上传指令文件",
        "// An example instruction set for a model": "// 模型指令集示例",
        "You will always:": "请始终遵循：",
        "* Use emojis instead of SVG icons": "* 使用表情符号 (emoji) 替代 SVG 图标",
        "* Do not change model strings found in code": "* 不要更改代码中出现的模型字符串",
        "* Avoid using gradients": "* 避免使用渐变效果",
        "Add file": "添加文件",
        "Save changes": "保存更改",
        "Reset to default": "重置为默认",
        "System instructions template": "系统指令模板",
        "The configuration is for working with Angular + TypeScript application. The Code Assistant is instructed to work with Angular components, services, and modules. It follows strict guidelines for using the Gemini API.": "此配置适用于 Angular + TypeScript 应用。代码助手已被配置为使用 Angular 的组件、服务和模块，并将严格遵循 Gemini API 的使用准则。",
        "The configuration is for working with React + TypeScript application. Assumes a basic structure with index.html and index.tsx. Code Assistant follows strict guidelines for using the Gemini API.": "此配置适用于 React + TypeScript 应用，并假定项目具有包含 index.html 和 index.tsx 的基本结构。代码助手将严格遵循 Gemini API 的使用准则。",
        "No devices found": "未找到设备",
        "Learn": "学习",
        "Build apps with Gemini": "使用 Gemini 构建应用",
        "Start building with Gemini, try “Build me an AI photo editing app using Nano Banana”": "开始使用 Gemini 构建，试试: “帮我用 Nano Banana 构建一个 AI 图片编辑应用”",
        "Choose a system instructions configuration to use with the applet": "为应用选择一个要使用的系统指令配置",
        "Start from a template": "从模板开始",
        "Choose a template": "选择模板",
        "Empty": "空模板",
        "An empty app": "一个空的应用",
        "Prompt": "提示词示例",
        "Prompt Gemini in this simple example": "一个与 Gemini 进行交互的简单示例。",
        "Live": "实时对话",
        "Create a live agent using bidirectional streaming": "使用双向流式传输创建一个实时代理。",
        "Veo": "null",
        "Sample from Veo models to generate videos": "调用 Veo 模型生成视频的示例。",
        "Imagen": "Imagen 图像生成",
        "Sample from Imagen models to generate images": "调用 Imagen 模型生成图像的示例。",
        "Chat example": "聊天示例",
        "Example chat app built with Gemini": "一个使用 Gemini 构建的聊天应用示例。",
        "Count tokens": "令牌计数",
        "Count how many tokens are in a piece of text": "计算一段文本中所包含的令牌数量。",
        "Embeddings": "文本嵌入",
        "Calculate text embeddings for use in RAG": "计算文本嵌入，以用于 RAG (检索增强生成)。",
        "Streaming": "流式传输",
        "Stream responses containing both images and text": "流式传输包含图像和文本的响应。",
        "Code execution": "代码执行",
        "Let Gemini execute Python code in a sandbox": "让 Gemini 在沙盒环境中执行 Python 代码。",
        "Provide Gemini with functions it can use to create responses": "为 Gemini 提供可用于创建响应的函数。",
        "React example": "React 示例",
        "Example React app using Gemini": "一个使用 Gemini 的 React 应用示例。",
        "Angular Example": "Angular 示例",
        "Example Angular app using Gemini": "一个使用 Gemini 的 Angular 应用示例。",
        "OpenAI SDK compatibility": "OpenAI SDK 兼容模式",
        "Access Gemini models with the OpenAI SDK": "使用 OpenAI SDK 访问 Gemini 模型。",
        "Ask the Manual": "询问手册",
        "Explore the power of FileSearch,the simplest integrated RAG solution. Just upload any text file, from product manuals to dense reports, and ask away. FileSearch takes care of the rest, instantly digging through the content to find the precise answers you need.": "探索 FileSearch 的强大功能，这是最简单的集成 RAG 解决方案。只需上传任何文本文件，从产品手册到密集报告，然后提出问题。FileSearch 会处理其余部分，即时深入内容查找您需要的精确答案。",
        "80s Mall Photo": "80年代商场照片",
        "Strike a pose for a Gemini-powered 80s photo, then animate it instantly with Veo.": "摆出姿势拍摄一张由 Gemini 驱动的 80 年代风格照片，然后使用 Veo 立即为其制作动画。",
        "Maps Styling": "地图风格",
        "Give your Google Map a new personality to match your brand, your mood, or the spirit of your favorite holiday": "为您的 Google 地图赋予全新个性，以匹配您的品牌、心情或是您最喜欢的节日气氛。",
        "Chat with Maps Live": "地图实时对话",
        "Experience Gemini and Grounding with Google Maps' ability to engage in real-time, voice-driven conversations for trip planning using natural language.": "体验 Gemini 与“基于 Google 地图”功能的结合，通过自然语言进行语音对话，实时规划您的行程。",
        "Veo Studio": "Veo 工作室",
        "Describe any scene and get a stunning video in seconds. An effortless video generator powered by Veo.": "描述任何场景，数秒内即可获得精彩视频。一款由 Veo 驱动的轻松视频生成器。",
        "An arcade cricket game which uses the Gemini Live API to dynamically generate commentary on the game": "一款街机风格的板球游戏，使用 Gemini Live API 为比赛动态生成解说。",
        "Build your own Native Audio Function Call app! An interactive sandbox for experimenting with native audio streaming and function calling using the Gemini API.": "构建您自己的原生音频函数调用应用！一个用于实验原生音频流和函数调用的交互式沙盒，使用 Gemini API。",
        "Upload a photo of yourself and an outfit to see how it looks on you. A virtual fitting room powered by Nano Banana.": "上传您自己和一套服装的照片，看看穿在您身上的效果。一个由 Nano Banana 驱动的虚拟试衣间。",
        "Create and simulate generative media with the latest Veo 3 Fast and GenMedia models using tldraw canvas to explore different workfflows": "使用最新的 Veo 3 Fast 和 GenMedia 模型，并利用 tldraw 画布创建和模拟生成式媒体，探索不同的工作流。",

        "Dynamic text game using Gemini": "Gemini 动态文本冒险游戏",
        "Gemini powered code review tool": "Gemini 驱动的代码审查工具",
        "Recipe generator using Gemini": "Gemini 食谱生成器",
        "Your apps": "您的应用",
        "Are you sure you want to delete this app?": "您确定要删除此应用吗？",
        "Recent apps": "最近的应用",
        "Save app": "保存应用",
        "Filter": "筛选",
        "No apps created yet. Build your first app now.": "您还没有创建任何应用。立即构建您的第一个应用吧！",
        "Need some inspiration? See examples in \\skip\\.": "需要灵感吗？请在 \\skip\\ 中查看",
        "Showcase": "示例应用",
        "Reload recent apps": "刷新最近应用",
        "Last opened": "上次打开",
        "First opened": "首次打开",
        "Remove app from recent apps list": "从最近应用列表中移除",
        "FAQ": "常见问题",
        "What is Build in AI Studio?": "AI Studio 中的“构建”是什么？",
        "An environment for building with the Gemini SDK. Go from prompt to working project. Transition to code for deeper refinement and customization. Explore and fork demos showcasing the API's full potential.": "一个使用 Gemini SDK 的构建环境。您可以从一个想法（Prompt）出发，构建出可运行的项目，再深入代码进行优化和定制。探索并复刻（fork）那些能够充分展示 API 潜力的演示项目。",
        "How do apps run?": "应用如何运行？",
        "Apps run in your browser in a sandboxed iframe. There is no server-side component. To run an app that requires additional services such as a backend, consider using \\skip\\.": "应用在您浏览器的沙盒化 iframe 中运行，不含任何服务器端组件。如需运行需要后端等额外服务的应用，请考虑使用 \\skip\\",
        "Google Cloud Run": "null",
        "Is my API key exposed when sharing apps?": "分享应用时，我的 API 密钥会泄露吗？",
        "Don't use a real API key in your app. Use a placeholder value instead. \\skip\\ is set to a placeholder value that you can use. When another user uses your app, AI Studio proxies the calls to the Gemini API, replacing the placeholder value with \\skip\\ (not your) API key. Do not use a real API key in your app, as the code is visible to anyone who can view your app.": "请勿在应用中使用真实的 API 密钥，应使用占位符替代。\\skip\\ 是一个可供您使用的占位符。当其他用户使用您的应用时，AI Studio 会代理对 Gemini API 的调用，并将占位符替换为 \\skip\\ （而非您的）API 密钥。请勿在应用中使用真实的 API 密钥，因为其代码对所有可查看您应用的用户都是可见的。",
        "the user's": "该用户的",
        "Who can see my apps?": "谁可以查看我的应用？",
        "AI Studio uses Google Drive to store apps, and inherits \\skip\\. By default your app is private. You can share your app with other users to let them use it. Users you share your app with can see its code and fork it for their own purposes. If you share your app with edit permission, the other users can edit the code of your app.": "AI Studio 使用 Google Drive 存储应用，因此会继承 \\skip\\。默认情况下，您的应用是私有的。您可以与其他用户分享您的应用，以供他们使用。获得分享的用户可以查看其代码，并为了自己的目的进行复刻（fork）。如果您授予了编辑权限，其他用户便能够编辑您应用的代码。",
        "its permissions model": "其权限模型 ",
        "Can I run apps outside of AI Studio?": "我可以在 AI Studio 之外运行应用吗？",
        "You can deploy your app to \\skip\\ from AI Studio, which will give your app a public URL. It's deployed along with a proxy server that will keep your API key private, however the deployed app will use your API key for all users' Gemini API calls. You can also download your app as a zip file. If you replace the placeholder value with a real API key, it should still work. But you \\skip\\ deploy your app like this, as any user will be able to see the API key. To make an app run securely outside of AI Studio requires \\skip\\, so the API key is no longer exposed.": "您可以将应用部署到 \\skip\\ ，这会为您的应用提供一个公共网址。它会与一个代理服务器一同部署以确保您 API 密钥的私密性，但请注意，部署后的应用将使用您的 API 密钥处理所有用户的 Gemini API 调用。您也可以将应用下载为 zip 文件。如果用真实的 API 密钥替换占位符，应用理论上仍能工作。但您 \\skip\\ 这样部署应用，因为任何用户都将能够看到 API 密钥。为了让应用能在 AI Studio 之外安全运行，需要 \\skip\\ ，这样 API 密钥就不会再被暴露。",
        "Cloud Run": "Google Cloud Run",
        "should not": "不应该",
        "moving some logic server-side": "将部分逻辑移至服务器端",
        "Can I develop apps locally with my own tools and then share them here?": "我可以使用自己的工具在本地开发应用，然后在这里分享吗？",
        "This functionality is not yet available. We're excited to support more use-cases for apps in the future. Please consider \\skip\\ if you have anything specific in mind.": "此功能尚不可用。我们期待未来能支持更多的应用场景。请考虑 \\skip\\ ，如果您有任何具体的想法。",
        "giving us feedback": "向我们提供反馈",
        "Can I use Next.js, Svelte, Vue or Astro?": "我可以使用 Next.js、Svelte、Vue 或 Astro 吗？",
        "At the moment these libraries are not supported, because of limited support for compiler plug-ins.": "目前尚不支持这些库，因为对编译器插件的支持有限。",
        "How can I use GitHub with my apps?": "如何将 GitHub 与我的应用配合使用？",
        "AI Studio's GitHub integration allows you to create a repository for your work and commit your latest changes. We do not currently support pulling remote changes.": "AI Studio 的 GitHub 集成功能可让您为自己的工作创建仓库，并提交最新更改。目前尚不支持拉取远程更改。",
        "How can I manage npm packages and their versions?": "如何管理 npm 包及其版本？",
        "The \\skip\\ in index.html instead of a package.json file to manage code packages. Our CDN, aistudiocdn.com, automatically finds and serves these packages for you using \\skip\\, which \\skip\\. Note that some older packages not designed as ES modules (ESM) may not work correctly.": "我们通过 index.html 中的 \\skip\\ 而非 package.json 文件来管理代码包。我们的 CDN (aistudiocdn.com) 会通过 \\skip\\ 自动为您查找并提供这些包，该服务负责处理 \\skip\\。请注意，某些未被设计为 ES 模块 (ESM) 的旧版软件包可能无法正常工作。",
        "What terms apply to apps in the app gallery in AI Studio?": "AI Studio 中的应用库适用哪些条款？",
        "Gemini API Additional Terms of Service": "Gemini API 附加服务条款",
        "The \\skip\\ apply to use of apps featured in the app gallery in AI Studio, unless otherwise noted.": "\\skip\\ 适用于 AI Studio 应用库中的应用，除非另有说明。",
        "import map": "null",
        "esm.sh": "null",
        "handles versioning and dependencies": "版本控制和依赖关系",
        "How can I access the microphone, webcam, and other \\skip\\?": "如何访问麦克风、网络摄像头和其他 \\skip\\ ？",
        "Navigator APIs": "null",
        "To ensure that viewers are aware of an app’s usage of their webcam or other devices, we require an extra acknowledgement before the app can access these \\skip\\. App creators can add these permission requests to their app’s \\skip\\ file. For example,": "为确保应用的观看者知晓其对网络摄像头或其他设备的使用情况，我们要求应用在访问这些 \\skip\\ 之前，必须获得一项额外的确认。应用创建者可以将这些权限请求添加到其应用的 \\skip\\ 文件中。例如：",
        "metadata.json": "null",
        "Supported values for \\skip\\ are a subset of the standard \\skip\\.": "\\skip\\ 支持的值是标准 \\skip\\ 的一个子集。",
        "requestFramePermissions": "null",
        "policy-controlled features": "策略控制功能",
        "What terms apply to the Showcase apps featured in AI Studio?": "AI Studio 中的“示例应用”适用哪些条款？",
        "The \\skip\\ apply to use of apps featured on the Showcase tab in AI Studio, unless otherwise noted.": "\\skip\\ 适用于 AI Studio“示例应用”选项卡中的应用，除非另有说明。",
        "Gemini API Additional Terms of Service": "Gemini API 附加服务条款",
        // 2025.10.20新增
        "View all history": "查看所有聊天",
        "Create new instruction": "创建新指令",
        "Title": "标题",
        "Delete system instruction": "删除系统指令",
        "Delete system instruction?": "删除系统指令？",
        "This action cannot be undone.": "此操作无法撤销。",
        "System instruction deleted": "系统指令已删除",
        "Saved": "已保存",
        "Instructions are saved in local storage.": "指令已保存至本地存储。",
        "Stream, Imagen and Veo have moved to the model picker in chat!": "实时对话、Imagen 和 Veo 现已整合至聊天页面的模型选择器！",
        "Stream, Imagen and Veo have moved into these categories!": "实时对话、Imagen 和 Veo 现已移入这些类别！",
        "The fastest way from prompt to production with Gemini": "使用 Gemini : 从创意到产品的最快途径",
        "The fastest path from prompt to production with Gemini": "使用 Gemini : 从创意到产品的最快途径",
        "Chat with models in the Playground": "在 AI Studio 中与模型对话",
        "Vibe code GenAI enabled apps in Build": "在“构建”页面，轻松开发 GenAI 应用",
        "Monitor usage and more in the Dashboard": "在信息中心监控用量及更多信息",
        "Our best video generation model, now with sound effects.": "我们最出色的视频生成模型，现已支持音效",
        "Get started with Gemini": "开始使用 Gemini",
        "View API keys": "查看 API 密钥",
        "Explore docs": "浏览文档",
        "Toggle navigation menu": "切换导航菜单",
        "Explore all of our models": "探索所有模型",
        "Sign up and get started": "注册并开始使用",
        "Discover": "探索",
        "Pricing": "定价",
        "Explore documentation": "浏览文档",
        "Case studies": "案例研究",
        "Start creating with media in Google AI Studio": "在 Google AI Studio 中使用媒体进行创作",
        "Acknowledge": "我已知晓",
        "Unknown": "未知",
        "Search for a model": "搜索模型",
        "Gemini Batch API outages.": "Gemini 批量 API 中断。",
        "Gemini API and AI Studio outage.": "Gemini API 和 AI Studio 中断。",
        "Gemini API and AI Studio File Service / Veo outages.": "Gemini API、AI Studio 文件服务及 Veo 中断。",
        "AI Studio Realtime and Gemini Live API outage.": "AI Studio Realtime 和 Gemini Live API 中断。",
        "AI Studio Code Assistant outage.": "AI Studio 代码助手中断。",
        "Our latest image generation model, with significantly better text rendering and better overall image quality.": "我们最新的图像生成模型，文本渲染效果显著提升，且整体图像质量更佳。",
        "By using this feature, you confirm that you have the necessary rights to any content that you upload. Do not generate content that infringes on others intellectual property or privacy rights. Your use of this generative AI service is subject to our \\skip\\.": "使用此功能即表示您确认，您对所上传的任何内容均拥有必要的权利。请勿生成侵犯他人知识产权或隐私权的内容。您对此生成式 AI 服务的使用，须遵守我们的 \\skip\\。",
        "Prohibited Use Policy": "禁止使用政策",

        "Our most balanced multimodal model with great performance across all tasks.": "我们最均衡的多模态模型，在各项任务中都表现出色。",
        "Our open model built for efficient performance on everyday devices like mobile phones, laptops, and tablets.": "我们的开源模型，专为在手机、笔记本电脑和平板电脑等日常设备上实现高效性能而构建。",
        "Open model built for handling text-only tasks with low latency.": "可低延迟处理纯文本任务的开源模型。",
        "Open model that can handle visual and text input with low latency.": "可低延迟处理视觉和文本输入的开源模型。",
        "Open model that can handle complex tasks with visual and text input.": "可结合视觉和文本输入处理复杂任务的开源模型。",
        "Our native audio models optimized for higher quality audio outputs with better pacing, voice naturalness, verbosity, and mood.": "我们的原生音频模型，专为更高质量的音频输出而优化，在节奏、声音自然度、话语风格和情绪上均有提升。",
        "Our 2.5 Pro text-to-speech audio model optimized for powerful, low-latency speech generation for more natural outputs and easier to steer prompts.": "我们的 2.5 Pro 文本转语音模型，专为强大、低延迟的语音生成而优化，可实现更自然的输出和更易于引导的指令。",
        "Our 2.5 Flash text-to-speech audio model optimized for price-performant, low-latency, controllable speech generation.": "我们的 2.5 Flash 文本转语音模型，专为高性价比、低延迟、可控的语音生成而优化。",
        "Our state-of-the-art image generation model, available to developers on the paid tier of the Gemini API.": "我们最先进的图像生成模型，面向使用 Gemini API 付费层级的开发者提供。",
        "Our state-of-the-art video generation model, available to developers on the paid tier of the Gemini API.": "我们最先进的视频生成模型，面向使用 Gemini API 付费层级的开发者提供。",
        "Our state-of-the-art video generation model": "我们最先进的视频生成模型。",
        "Gemini Robotics-ER, short for Gemini Robotics-Embodied Reasoning, is a thinking model that enhances robots' abilities to understand and interact with the physical world.": "Gemini Robotics-ER，即 Gemini Robotics-Embodied Reasoning (具身推理) 的缩写，是一个“思考”模型，旨在增强机器人理解物理世界并与之互动的能力。",

        "Switch model?": "切换模型？",
        "Switching to this model will remove the system instructions from your prompt": "切换模型将移除您当前聊天中的系统指令。",
        "Switching to this model will start a new chat. Content in current chat will be lost.": "切换到此模型将开启新的聊天，当前聊天内容将会丢失。",
        "Do you want to continue?": "要继续吗？",

        "Open in Kaggle": "在 Kaggle 中打开",
        "Open in Vertex AI": "在 Vertex AI 中打开",
        "Deploy to Google Cloud Run": "部署到 Google Cloud Run",
        "Deploy Gemma 3 on Google Cloud Run": "将 Gemma 3 部署到 Google Cloud Run",
        "We will deploy Gemma 3 as a Google Cloud Run Service in your GCP project. The endpoint will be accessible via a public URL. Update your SDK to point to the Google Cloud Run endpoint.": "我们会将 Gemma 3 作为 Google Cloud Run 服务部署在您的 GCP 项目中。该端点将可通过公共网址访问。请更新您的 SDK，使其指向此 Google Cloud Run 端点。",
        "Deploy to Google Cloud": "部署到 Google Cloud",
        "Home": "主页",

        "Chat with models": "与模型对话",
        "Vibe code": "轻松开发",
        "Monitor usage": "监控用量",
        "Monitor usage and projects": "监控用量与项目",
        "Explore all of Google’s AI models in one place": "一站式探索 Google 所有 AI 模型",
        "One easy playground for you to test your prompts with any of our models": "在统一的实验平台，轻松测试所有模型",
        "Start building with the API today": "立即开始使用 API 构建",
        "Operate": "管理与运维",
        "Stay on top of your resource usage": "轻松掌握资源用量",
        "Manage your keys, billing, and projects in one space": "集中管理您的密钥、结算与项目",
        "Go from idea to app with the power of Gemini": "借助 Gemini，将想法变为应用",
        "Start with a prompt, easily vibe code AI-powered apps, and share with the world": "从一个想法开始，轻松开发 AI 应用，并与世界分享",
        "Our best image generation model yet, engineered for creativity. Bring your imagination to life faster than ever before.": "我们迄今最强大的图像生成模型，专为创意而生。以前所未有的速度，将您的想象变为现实。",
        "Our state of the art models, excellent at coding, reasoning, creative writing, and multimodal capabilities.": "我们最先进的模型，擅长编程、推理、创意写作，并具备强大的多模态能力。",
        "Build directly with the SDK": "直接使用 SDK 进行构建",
        "Cookbooks, API references, and model capabilities in our docs": "实用指南、API 参考和模型功能介绍，尽在我们的文档中。",
        "Developer quickstart": "开发者快速入门",
        "Set up your environment and make your first API request in minutes": "只需几分钟，即可完成环境设置并发起您的第一个 API 请求。",
        "Transform text input into single speaker or multi-speaker audio using native, controllable text-to-speech.": "通过原生、可控的文本转语音功能，将文本输入转换为单人或多人语音。",
        "Our latest video generation model, available to developers on the paid tier of the Gemini API.": "我们最新的视频生成模型，面向使用 Gemini API 付费层级的开发者提供。",
        "A faster, more accessible version of Veo 3.1, optimized for speed and business use cases. Available to developers on the paid tier of the Gemini API.": "Veo 3.1 的更快、更易用版本，针对速度和商业场景进行了优化。面向使用 Gemini API 付费层级的开发者提供。",
        "Hyper realistic audio generation, supporting a wide variety of voices.": "超逼真的音频生成，支持丰富多样的声音选择。",
        "Lightweight, state-of-the-art open models built from the same technology that powers our Gemini models.": "轻量级、先进的开源模型，与强大的 Gemini 模型采用同源技术构建。",
        "Start exploring and building with Google’s latest AI models": "开始使用 Google 最新的 AI 模型进行探索与构建。",
        "Privacy": "隐私政策",
        "Vibecode": "轻松构建",

        "Gemini API Rate Limit": "Gemini API 速率限制",
        "Rate Limit": "速率限制",
        "Rate limit": "速率限制",
        "Last Hour": "过去 1 小时",
        "Rate limits by model": "各模型速率限制",
        "time series": "个时间序列",
        "Peak usage per model compared to its limit over the last ": "各模型在过去 ",
        " day": " 天的峰值用量与限制对比",
        " days": " 天的峰值用量与限制对比",
        "View all models": "查看所有模型",
        "Rate limits breakdown": "速率限制明细",
        "Category": "类别",
        "RPM": "RPM",
        "TPM": "TPM",
        "RPD": "RPD",
        "Charts": "图表",
        "Peak requests per minute (RPM)": "每分钟峰值请求数 (RPM)",
        "Peak input tokens per minute (TPM)": "每分钟峰值输入令牌数 (TPM)",
        "Peak requests per day (RPD)": "每日峰值请求数 (RPD)",
        "Usage data may take up to 15 minutes to update.": "用量数据更新可能存在最多 15 分钟的延迟。",
        "Google AI Studio does not show all your Cloud Project. To import them, search by name or project ID.": "Google AI Studio 未显示您的所有 Cloud 项目。如需导入，请按名称或项目 ID 进行搜索。",
        "Search for a project": "搜索项目",
        "Only limited number of projects listed above, search your project if you don't see it here.": "上方仅列出部分项目，如果未找到您的项目，请直接搜索。",
        "Saved conversations can't be switched to Temporary chat": "已保存的对话无法切换为临时聊天",
        "Text-out models": "文本生成模型",
        "Multi-modal generative models": "多模态生成模型",
        "Other models": "其他模型",
        "Live API": "实时 API",
        "View in charts": "查看图表",
        "N/A": "不适用",

        "Nano banana powered app": "由 Nano Banana 驱动的图片应用",
        "Add powerful photo editing to your app. Allow users to add objects, remove backgrounds, or change a photo's style just by typing.": "为您的应用添加强大的图片编辑功能。只需输入文字，即可让用户添加对象、移除背景或更改照片风格。",
        "Create conversational voice apps": "创建语音对话应用",
        "Use the Gemini Live API to give your app a voice and make your own conversational experiences.": "使用 Gemini Live API 为您的应用赋予声音，打造专属的对话体验。",
        "Animate images with Veo": "使用 Veo 为图片生成动画",
        "Bring images to life with Veo 3. Let users upload a product photo and turn it into a dynamic video ad, or animate a character's portrait.": "使用 Veo 3 让图片栩栩如生。用户可上传产品照片并将其转化为动态视频广告，或为角色肖像制作动画。",
        "Use Google Search data": "使用 Google 搜索数据",
        "Connect your app to real-time Google Search results. Build an agent that can discuss current events, cite recent news, or fact-check information.": "将您的应用连接至实时的 Google 搜索结果。构建一个能够讨论时事、引用最新新闻或核查信息的代理。",
        "Use Google Maps data": "使用 Google 地图数据",
        "Connect your app to real-time Google Maps data. Build an agent that can pull information about places, routes, or directions.": "将您的应用连接至实时的 Google 地图数据。构建一个能够获取地点、路线或方向信息的代理。",
        "Generate images with a prompt": "通过指令生成图片",
        "Generate high-quality images from a text prompt. Create blog post heroes, concept art, or unique assets in your application.": "通过文本指令生成高质量图片。在您的应用中创建博客文章配图、概念艺术或独特的素材。",
        "Gemini intelligence in your app": "在应用中集成 Gemini 智能",
        "Embed Gemini in your app to complete all sorts of tasks - analyze content, make edits, and more": "在您的应用中嵌入 Gemini，以完成内容分析、编辑等各类任务。",
        "AI powered chatbot": "AI 聊天机器人",
        "Add a context-aware chatbot to your app. Give your users a support agent that remembers the conversation, perfect for multi-step bookings or troubleshooting.": "为您的应用添加具备上下文感知能力的聊天机器人。为用户提供能记住对话的支持代理，非常适合多步骤预订或故障排查等场景。",
        "Prompt based video generation": "基于指令的视频生成",
        "Add video generation to your creative app. Let users turn their blog posts, scripts, or product descriptions into short video clips.": "为您的创意应用添加视频生成功能。让用户能将他们的博客文章、脚本或产品描述转化为短视频片段。",
        "Control image aspect ratios": "控制图片宽高比",
        "Control the exact shape of your generated images. Build an app that creates perfect-fit images for vertical phone wallpapers or horizontal web banners.": "精确控制您生成图片的形状。构建一个能为竖屏手机壁纸或横屏网页横幅创建完美适配图片的应用。",
        "Analyze images": "分析图片",
        "Enable your app to see and understand images. Allow users to upload a photo of a receipt, a menu, or a chart to get instant data extraction, translations, or summaries.": "让您的应用能够识别和理解图片。允许用户上传收据、菜单或图表的照片，以即时提取数据、进行翻译或生成摘要。",
        "Fast AI responses": "快速 AI 响应",
        "Add lightning-fast, real-time responses to your app using 2.5 Flash-Lite. Perfect for instant auto-completes, or conversational agents that feel alive.": "使用 2.5 Flash-Lite 为您的应用添加闪电般的实时响应。非常适合即时自动补全或打造生动逼真的对话代理。",
        "Video understanding": "视频理解",
        "Help users find the key moments in long videos. Add a feature to analyze video content to instantly generate summaries, flashcards, or marketing highlights.": "帮助用户在长视频中找到关键时刻。添加视频内容分析功能，以即时生成摘要、抽认卡或营销亮点。",
        "Transcribe audio": "转录音频",
        "Add a feature to provide live, real-time transcription of any audio feed for your users.": "添加一项功能，为您的用户提供任何音频源的实时转录。",
        "Think more when needed": "在需要时进行更深度的思考",
        "Give your app's AI time to think. Enable 'Thinking Mode' to handle your users' most complex queries.": "给您应用的 AI 留出思考时间。启用“深度思考”模式，以处理用户最复杂的查询。",
        "Generate speech": "生成语音",
        "Give your app a voice. Add text-to-speech to read articles aloud, provide audio navigation, or create voice-based assistants for your users.": "为您的应用赋予声音。添加文本转语音功能，以朗读文章、提供语音导航或为用户创建语音助手。",
        "All apps": "所有应用",
        "Games and Visualizations": "游戏与可视化",
        "GenMedia": "生成媒体",
        "Multimodal understanding": "多模态理解",
        "Developer quickstarts": "开发者快速入门",
        "Code gen": "代码生成",
        "Audio and music": "音频与音乐",
        "Tools and MCP": "工具与 MCP",
        "Flash Lite": "Flash Lite",
        "Recently viewed": "最近查看",
        "Created by you": "由您创建",
        "Created by others": "由他人创建",
        "Explore the gallery": "探索示例应用",
        "Create a new app": "创建新应用",
        "Pin": "固定",
        "Pin app": "固定应用",
        "Pinned": "已固定",
        "Unpin app": "取消固定应用",
        "Unpin": "取消固定",
        "Search for an app": "搜索应用",
        "Last viewed": "上次查看",
        "Remove app": "移除应用",

        "Gemini API Logs and Datasets": "Gemini API 日志与数据集",
        "设置结算信息": "设置结算",
        "免费层级": "免费层级",
        "Dataset": "数据集",
        "Filter by dataset": "按数据集筛选",
        "All datasets": "所有数据集",
        "Filter by model": "按模型筛选",
        "All models": "所有模型",
        "Filter by time range": "按时间范围筛选",
        "All time": "所有时间",
        "Filter by status": "按状态筛选",
        "Status": "状态",
        "Filter by tools": "按工具筛选",
        "Filter by rating": "按评分筛选",
        "Rating": "评分",
        "Set up billing to enable Gemini API logging": "设置结算以启用 Gemini API 日志记录",
        "You can then view your Gemini API history and create datasets.": "之后您便可以查看 Gemini API 历史记录并创建数据集。",
        "No model matches your search.": "未找到匹配的模型",
        "Clear search": "清除搜索",

        // --- 2025.11.19 新增片段
        "API key information": "API 密钥信息",
        "Unlink or switch API key here.": "在此取消关联或切换 API 密钥",
        "Choose a paid API key": "选择付费 API 密钥",
        "You have no Paid Project. Please view the Projects Page to choose a Project and Upgrade.": "您没有付费项目。请前往“项目”页面选择项目并进行升级。",
        "Go to Projects Page": "前往“项目”页面",
        "Gemini 3 Pro Preview": "Gemini 3 Pro Preview",
        "Our most intelligent model with SOTA reasoning & multimodal understanding, & powerful agentic & vibe coding capabilities": "我们最智能的模型，具备最先进的推理和多模态理解能力，并拥有强大的代理及轻松开发能力。",
        "No API Key": "无 API 密钥",
        "Switch to a paid API key to unlock higher quota and more features.": "切换到付费 API 密钥以解锁更高配额和更多功能。",
        "Thinking level": "思考等级",
        "Set the thinking level": "设置深度思考的等级",
        "Optimized for fastest response & lowest cost": "针对最快响应速度和最低成本进行优化",
        "A balanced choice for general purpose use & solid quality": "兼顾通用场景与可靠质量的平衡之选",
        "Optimizes for latency": "尽可能缩短延迟时间并降低费用",
        "(Recommended) Maximizes reasoning depth": "(默认) 最大限度地提高推理深度",
        "Generate structured outputs": "生成结构化输出",
        "Structured outputs": "结构化输出",
        "Our advanced reasoning model, which excels at coding & complex reasoning tasks": "我们的高级推理模型，擅长编程和复杂推理任务",
        "Previewing generated HTML or SVG could leak the contents of this chat via outbound network requests. Do NOT do this if this chat is sensitive.": "预览生成的 HTML 或 SVG 可能会通过外部网络请求泄露此聊天的内容。如果此聊天包含敏感信息，请勿执行此操作。",
        "Accept risk": "接受风险",
        "Reject risk": "拒绝风险",
        "Gemini 3: Our most intelligent model to date.": "Gemini 3：我们迄今为止最智能的模型",
        "Try it": "试试 !",
        "Try Gemini 3": "试用 Gemini 3",
        "Our most intelligent model to date.": "我们迄今为止最智能的模型",
        "Error querying Drive.": "查询云端硬盘时出错",
        "The current model doesn't support files of this type.": "当前模型不支持该文件类型",
        "An internal error has occurred.": "发生内部错误。",
        "Failed to generate content. Please try again.": "内容生成失败，请重试。",
        "Failed to generate content, quota exceeded. Please try again later.": "内容生成失败，已超出配额，请稍后重试。",
        "Failed to generate content: user has exceeded quota. Please try again later.": "内容生成失败：已超出配额，请稍后重试。",
        "You are out of free generations.": "您的免费生成次数已用尽。",
        "You can continue by using your own paid API key.": "您可以使用自己的付费 API 密钥继续。",
        "Failed to generate content: permission denied. Please try again.": "生成内容失败：权限被拒绝。请重试。",
        "Failed to count tokens: permission denied. Please try again.": "令牌计数失败：权限不足，请重试。",
        "Failed to count tokens. Please try again.": "令牌计数失败，请重试。",
        "Token count failed": "令牌计数失败",
        "Count tokens failed": "令牌计数失败",
        "Failed to load Application from Drive. Please try again.": "从云端硬盘加载应用失败，请重试。",
        "Failed to list models. Please try again.": "获取模型列表失败，请重试。",
        "Failed to list models: permission denied. Please try again.": "获取模型列表失败：权限被拒绝。请重试。",
        "Failed to save prompt. Internal error encountered.": "保存聊天失败，遇到内部错误。",
        "Internal error encountered.": "遇到内部错误。",
        "Error counting tokens.": "令牌计数出错。",
        "System instruction deleted": "系统指令已删除。",
        "Failed to generate content: service is unavailable. Please try again later.": "内容生成失败：服务当前不可用，请稍后重试。",
        "Fetching prompt details. Please wait...": "正在获取聊天详情，请稍候...",
        "Model isn't available right now. Please wait a minute and try again.": "模型当前不可用，请稍等片刻后重试。",
        "Failed to save prompt. Rpc failed due to xhr error. uri: https://alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/UpdatePrompt, error code: 6, error: [0]": "保存聊天失败。RPC 调用因 XHR 错误失败 (错误代码: 6)。",
        "Failed to save prompt. Rpc failed due to xhr error. uri:  https://alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/UpdatePrompt,  error code: 6, error: [0]": "保存聊天失败。RPC 调用因 XHR 错误失败 (错误代码: 6)。",
        "Failed to create project, The project creation succeeded but enabling Generative Language API is failed. Please try to enable the API in Google Cloud Console again.": "创建项目失败。项目已成功创建，但启用“生成式语言模型 API”失败。请稍后在 Google Cloud Console 中重试启用该 API。",
        "Failed to load history list": "加载聊天列表失败",
        "Failed to upload file to Drive.": "上传文件到云端硬盘失败。",
        "Failed to save prompt. Region not supported.": "保存聊天失败。不支持的地区。",
        "You've reached your rate limit. Please try again later.": "您的请求频率过高，请稍后重试。",
        "Failed to generate image, quota exceeded: Imagen is available with limited free generations per day for testing. To continue generating images, please use the Gemini API.": "图片生成失败，已超出配额：Imagen 每日提供有限的免费生成次数用于测试。如需继续生成，请使用 Gemini API。",
        "Failed to call the Gemini API, quota exceeded: you have reached the daily limit of requests for this model. Please select a different model, or try again tomorrow.": "调用 Gemini API 失败，已超出配额：您已达到此模型的每日请求上限。请选择其他模型，或明天再试。",

        // --- 2025.11.23 新增：Nano Banana Pro 引导页与示例 ---
        "Link a paid API key to access Nano Banana Pro": "关联付费 API 密钥以使用 Nano Banana Pro",
        "Nano Banana Pro is only available for paid tier users. Link a paid API key to access higher rate limits, advanced features, & more.": "Nano Banana Pro 仅向付费层级用户开放。关联付费 API 密钥以获取更高的速率限制、高级功能及更多权益。",
        "Link API key": "关联 API 密钥",
        "No API key selected": "未选择 API 密钥",
        "Verify AI generated content with": "验证 AI 生成的内容，请使用",
        "Resolution": "分辨率",
        "Resolution of the generated images": "生成图像的分辨率",
        "Create a fashion product collage on a brown corkboard based on this outfit.": "基于这套服装，在棕色软木板上创建一个时尚产品拼贴画。",
        "Create an orthographic blueprint that describes this building in plan.": "创建一个描述该建筑平面图的正投影蓝图。",
        "Create an illustrated explainer, detailing the physics of the fluid dynamics.": "创建一个图解说明，详细解释流体动力学的物理原理。",

        "Drop files here": "拖放文件到此处",
        "Insert images, videos, audio, or files": "插入图片、视频、音频或文件",
        "Upload a file": "上传文件",
        "Drive": "云端硬盘",
        "Allow Google AI Studio to access Drive to view shared prompts": "允许 Google AI Studio 访问云端硬盘以查看共享的提示",
        "Allow Drive access": "允许访问云端硬盘",
        "Remove media": "移除媒体",
        "Citation": "引用",


        // --- 2025.12.19 更新与修正 ---
        "Gemini 3 Flash Preview": "null",
        "Our most intelligent model built for speed, combining frontier intelligence with superior search & grounding.": "我们最智能的模型，专为速度而打造，将前沿智能与卓越的搜索及基准功能相结合。",
        "API pricing per 1M tokens.": "API 定价按每 100 万个令牌计算。",
        "API pricing per 1M tokens. Usage in AI Studio UI is free of charge when no API key is selected": "API 定价按每 100 万个令牌计算，未选择 API 密钥时，在 AI Studio 界面内免费使用。",
        "Image output is priced at $30 per 1,000,000 tokens. Output images up to 1024x1024px consume 1290 tokens and are equivalent to $0.039 per image. Usage in AI Studio UI is free of charge when no API key is selected": "图像输出定价为每 100 万个令牌 30 美元。分辨率在 1024x1024 像素以内的输出图像消耗 1290 个令牌，相当于每张图片 0.039 美元。未选择 API 密钥时，在 AI Studio 界面内免费使用。",
        "Image output is priced at $120 per 1,000,000 tokens. Output images up to 1024x1024px consume 1120 tokens and are equivalent to $0.134 per image.": "图像输出定价为每 100 万个令牌 120 美元。分辨率在 1024x1024 像素以内的输出图像消耗 1120 个令牌，相当于每张图片 0.134 美元。",
        "Finish editing previous turns to rerun.": "请先完成前面回合的编辑，然后再重新运行。",
        "Error counting tokens.": "令牌计数出错。",

        "Explore Nano Banana Pro": "探索 Nano Banana Pro",
        "Create with Veo 3.1": "使用 Veo 3.1",
        "Turn text into audio with Gemini": "使用 Gemini 将文本转为音频",
        "Monitor API usage": "监控 API 用量",
        "Build AI apps": "构建 AI 应用",

        "We have updated our": "我们已更新我们的",
        "Dismiss": "忽略",
        "Let it snow": "下雪吧",
        "No prompts yet": "暂无聊天",
    };

    // ========= 翻译状态管理 =========
    let isTranslationEnabled = true; // 默认启用翻译
    const STORAGE_KEY = 'gemini_translation_enabled';

    // 从本地存储读取状态
    function loadTranslationState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        isTranslationEnabled = saved !== null ? saved === 'true' : true;
        console.log(`[Gemini 汉化增强] 翻译状态已加载: ${isTranslationEnabled ? '启用' : '禁用'}`);
    }

    // 保存状态到本地存储
    function saveTranslationState() {
        localStorage.setItem(STORAGE_KEY, String(isTranslationEnabled));
    }

    // 切换翻译状态
    function toggleTranslation() {
        isTranslationEnabled = !isTranslationEnabled;
        saveTranslationState();

        // 立即刷新油猴菜单文本状态
        registerMenuCommands();

        if (isTranslationEnabled) {
            // 启用翻译：直接翻译页面，无需刷新
            showNotification('✅ 翻译已启用', 1500);
            console.log('[Gemini 汉化增强] 翻译状态: 启用，正在翻译页面...');

            // 清除所有已翻译标记，重新翻译
            document.querySelectorAll('*').forEach(el => delete el[TRANSLATED_MARK]);
            // 稍微延迟以确保通知先显示
            setTimeout(() => domTranslator.walkAndTranslate(document.body), 100);

        } else {
            // 禁用翻译：刷新页面恢复原文
            showNotification('❌ 翻译已禁用，正在刷新...', 800);
            console.log('[Gemini 汉化增强] 翻译状态: 禁用，即将刷新页面');
            setTimeout(() => location.reload(), 500);
        }
    }

    // ========= 油猴菜单管理 (仿照优化工具逻辑) =========
    function registerMenuCommands() {
        // 只在顶层窗口注册菜单，防止 iframe 重复注册导致菜单项重叠或无法清除
        if (window.self !== window.top) return;

        // 1. 清除所有已注册的菜单
        registeredMenuIds.forEach(id => GM_unregisterMenuCommand(id));
        registeredMenuIds = [];

        // 2. 根据当前状态确定文本
        const menuText = isTranslationEnabled 
            ? '✅ 汉化已启用 (点击禁用)' 
            : '❌ 汉化已禁用 (点击启用)';

        // 3. 注册新菜单
        const menuId = GM_registerMenuCommand(menuText, () => {
            toggleTranslation();
        });
        
        // 4. 保存 ID
        registeredMenuIds.push(menuId);
    }

    // 显示状态通知 (优化版：跟随系统深色/浅色模式)
    function showNotification(message, duration = 1500) {
        const STYLE_ID = 'gemini-hanhua-notification-style';
        
        // 1. 注入自适应样式 (如果尚未注入)
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `
                :root {
                    /* 定义自适应颜色变量 (复刻优化工具的配色) */
                    /* 浅色: 纯白微灰 / 深色: 深灰 */
                    --gh-notif-bg: light-dark(rgb(252, 252, 252), rgb(31, 31, 31));
                    /* 浅色: 深黑字 / 深色: 浅灰字 */
                    --gh-notif-text: light-dark(#333333, #F2F2F2);
                    /* 边框颜色 */
                    --gh-notif-border: light-dark(#e0e0e0, rgb(39, 39, 39));
                }
                .gemini-hanhua-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    
                    /* 应用自适应颜色 */
                    background-color: var(--gh-notif-bg) !important;
                    color: var(--gh-notif-text) !important;
                    border: 1px solid var(--gh-notif-border) !important;
                    
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    font-family: "Google Sans", Roboto, sans-serif;
                    z-index: 999999;
                    
                    /* 优化阴影 */
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    
                    animation: slideIn 0.3s ease-out;
                    pointer-events: none; /* 防止遮挡点击 */
                    white-space: nowrap;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // 2. 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'gemini-hanhua-notification';
        notification.textContent = message;

        // 3. 挂载与销毁
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // 已翻译标记
    const TRANSLATED_MARK = '__gemini_translated__';


    const inputContentTranslations = {
        "What are the top 3 recent announcements from the Gemini API? For each of these changes, explain why it is important and suggest a use case for each of the changes. Here is the URL for your research: https://ai.google.dev/gemini-api/docs/changelog": "Gemini API 最近最重要的 3 项更新是什么？请解释每一项更新的重要性，并各举一个用例。研究时请参考此网址：https://ai.google.dev/gemini-api/docs/changelog",
        "Explain the probability of rolling two dice and getting 7": "解释掷两个骰子得到 7 的概率",
        "Insert assets such as images, videos, files, or audio": "插入图片、视频、文件或音频等资源",
        "Generate Python code for a simple calculator app": "为简易计算器应用生成 Python 代码",
        "Plot sin(x) from 0 to 2*pi. Generate the resulting graph image.": "绘制 sin(x) 从 0 到 2π 的函数图像，并生成结果图片",
        "Design a custom birthday card.": "设计一张定制的生日贺卡",
        "Show me different logos and brand swag ideas for my startup called Avurna": "为我的初创公司 Avurna 设计几款 Logo，并提供一些品牌周边的创意",
        "'Item: Apple, Price: $1'. Extract name, price to JSON.": "将 “Item: Apple, Price: $1” 中的名称、价格提取为JSON格式",
        "Generate a scavenger hunt for street food around the city of Seoul, Korea": "创建一个关于韩国首尔街头美食的寻宝游戏",
        "Generate a high school revision guide on quantum computing": "编写一份关于量子计算的高中复习指南",
        "Teach me a lesson on quadratic equations. Assume I know absolutely nothing about it": "给我讲讲一元二次方程，假设我对此一无所知",
        "Design a REST API for a social media platform.": "为社交媒体平台设计一个 REST API",
        "Generate a Docker script to create a simple linux machine.": "生成一个用于创建简易 Linux 机器的 Docker 脚本",
        "Read aloud in a warm, welcoming tone": "以温暖、热情的语调朗读",
        "Hello! We're excited to show you our native speech capabilities": "您好！我们很高兴向您展示我们的原生语音功能",
        "Where you can direct a voice, create realistic dialog, and so much more. Edit these placeholders to get started.": "在这里您可以引导声音、创建逼真的对话等等。编辑这些占位符即可开始。",
        "Build a dynamic text adventure game using Gemini": "使用 Gemini 构建一款动态文字冒险游戏",
        "Build an automated code review tool that uses Gemini to review code and provide feedback": "使用 Gemini 构建一款自动化代码审查工具，用于分析代码并提供反馈",
        "Create an app that generates recipes based on the ingredients I have available using Gemini": "使用 Gemini 创建一款应用，可根据您现有的食材生成食谱",
        "Generate an image of a banana wearing a costume.": "生成一张穿着服装的香蕉的图片",
        "Control real time music with a MIDI controller.": "使用 MIDI 控制器实时控制音乐",
        "A rolling countryside landscape knitted from yarn fields of green yellow and brown yarn stretch across undulating hills textured stitches like seed stitch or moss stitch create the appearance of crops and meadows low stone walls crocheted from grey yarn divide the fields patches of darker green yarn represent small wooded areas sheep knitted from fluffy white boucle yarn graze contentedly a winding country lane knitted in light brown yarn meanders through the scene perhaps with a tiny knitted tractor chugging along a farmhouse knitted in red yarn with a grey roof sits nestled among the hills smoke puffs made of white wispy yarn curl from its chimney the sky is a clear bright blue knit with a few fluffy white clouds the scene portrays idyllic rural life with the inherent warmth and charm of knitted materials making thecountryside feel inviting cozy and touchable": "一幅由毛线编织而成的连绵起伏的乡村风景画：绿色、黄色和棕色的毛线田野在波浪起伏的山丘上延伸，带有纹理的针法（如颗粒针或苔藓针）营造出庄稼和草地的外观。由灰色毛线钩针编织而成的低矮石墙分隔着田野，深绿色的毛线块代表着小片林区。由蓬松的白色圈圈纱编织而成的绵羊在悠闲地吃草。一条用浅棕色毛线编织的乡间小路蜿蜒穿过场景，或许还有一辆小小的编织拖拉机在突突地行驶。一座用红色毛线编织、带有灰色屋顶的农舍坐落在山丘之间，烟囱里冒出由白色轻柔毛线制成的袅袅炊烟。天空是清澈明亮的蓝色编织而成，点缀着几朵蓬松的白云。整个场景描绘了田园诗般的乡村生活，毛线材质固有的温暖和魅力让乡村风光显得温馨舒适、引人亲近且充满质感。",
        "An evocative image of an English afternoon tea table in a period drama setting, specifically reminiscent of the Queen Elizabeth I era. The table is adorned with a newspaper, prominently displaying the headline 'Gemini 2.5 in 2025'. Ensure the scene is rich in historical detail and atmosphere, but devoid of any human presence. Focus on the intricate details of the tea set, the newspaper's texture, and the ambient lighting typical of that period.": "一张充满怀旧气息的英式下午茶桌，背景设定在时代剧中，特别是让人联想到伊丽莎白一世女王时代的风格。桌上放着一份报纸，头条醒目地写着‘Gemini 2.5 in 2025’。请确保场景充满丰富的历史细节和氛围，但没有任何人物出现。重点在于茶具的精致细节、报纸的纹理质感以及那个时代特有的环境光线。",
        "Create an extreme macro photograph capturing the breathtaking iridescence of a Blue Morpho butterfly wing, emphasizing abstract beauty and intricate structural marvel. Very shallow depth of field isolates a mesmerizing pattern of overlapping scales, creating a painterly effect. Soft yet distinctly directional lighting, angled precisely, maximizes the shimmering structural color; watch vibrant blues shift dramatically to electric cyan and hints of deep violet along the delicately serrated scale edges, revealing the physics of light at play. The background is a smoothly blurred gradient of soft greens and muted browns, expertly rendered bokeh suggesting distant, out-of-focus foliage, pushing the wing forward. Composition strongly highlights the precise diagonal rows of tiny, intricate scales, forming an almost geometric, deeply textural artistic pattern that fills the frame. Textures are paramount: the slightly powdery yet precisely structured surface of each scale rendered with hyperrealistic clarity, contrasting with the utter smoothness of the bokeh. The color palette is dominated by intense, shifting metallic blues, strongly contrasted against the muted background, enhancing visual depth and the wing's ethereal, almost liquid luminous quality. A captivating study in natural pattern, microscopic architecture, and the phenomena of light itself.": "创作一张极致的微距摄影照片，捕捉蓝色大闪蝶翅膀那令人惊叹的虹彩效果，强调其抽象之美与精巧的结构奇迹。极浅的景深将重叠鳞片构成的迷人图案独立出来，营造出绘画般的效果。柔和而又方向明确的光线，以精确的角度照射，最大限度地展现了闪亮的结构色；观察那鲜艳的蓝色如何戏剧性地转变为亮青色，并在鳞片精细的锯齿边缘带上一丝深紫色，揭示了光学的物理原理。背景是平滑模糊的柔和绿色与暗棕色渐变，精美的焦外虚化效果暗示着远处的失焦植物，将翅膀主体推向前景。构图着重凸显了微小而复杂鳞片的精确斜向排列，形成一种近乎几何学、充满深度纹理的艺术图案，布满整个画面。质感至上：每个鳞片表面略带粉末感却又结构分明的质地，以超写实的清晰度呈现，与焦外的极致平滑形成对比。色调以强烈多变的金属蓝色为主，与柔和的背景形成鲜明对比，增强了视觉深度和翅膀那空灵、近乎流光溢彩的发光质感。这是一幅关于自然图案、微观构造以及光现象本身的迷人研究。",
        "A horizontally oriented rectangular stamp features the Mission District's vibrant culture, portrayed in shades of blue using an etching style. The scene might depict a sun-drenched street like Valencia or Mission Street, lined with a mix of Victorian buildings and newer structures. A large, colorful mural (translated into monochrome orange using varied etching patterns and textures) adorns the side of a building, perhaps depicting Latino cultural themes. Palm trees line the sidewalk, etched with feathery fronds. A taco truck or fruit cart could be etched on the street corner, adding local flavor. Figures representing the diverse community walk by, suggested by simple etched outlines. The denomination \"$1.50\" is etched onto an awning over a shop. Along the bottom, \"SAN FRANCISCO - THE MISSION\" is etched in a lively, slightly decorative font. Below, \"CALIFORNIA - USA\" is etched in smaller letters. The etching conveys the neighborhood's artistic energy, cultural heritage, and sunny climate through texture and pattern. The edges of the stamp are perforated. The stamp is on black background.": "一枚横向的矩形邮票，采用蚀刻版画风格，以不同色调的蓝色描绘了旧金山米慎区（Mission District）充满活力的文化。场景可能描绘了像瓦伦西亚街（Valencia）或米慎街（Mission Street）那样阳光普照的街道，两旁混合着维多利亚式建筑和较新的楼房。一幅巨大的彩色壁画（使用蚀刻版画中多样的图案和纹理，以单色橙色来呈现）装饰着一栋建筑的侧面，或许描绘了拉丁文化主题。棕榈树排列在人行道旁，蚀刻出羽毛般的叶子。街角可能蚀刻着一辆墨西哥卷饼餐车或水果摊，增添了当地风情。代表多元化社区的人物走过，以简单的蚀刻轮廓示意。面值“$1.50”蚀刻在一家商店的遮阳篷上。邮票底部，“SAN FRANCISCO - THE MISSION”以活泼且略带装饰性的字体蚀刻而成。其下方则是用更小的字母蚀刻的“CALIFORNIA - USA”。蚀刻画通过纹理和图案传达了该社区的艺术活力、文化遗产和阳光明媚的气候。邮票边缘有齿孔。邮票置于黑色背景之上。",
        "A vintage movie poster for a sci-fi film titled 'Galactic Odyssey: The Last Starfall'. The title should be clearly visible in a futuristic font, with a tagline 'Witness the End of an Era' beneath it. The poster features a distant nebula and a lone spaceship.": "一张为科幻电影《银河奥德赛：最后的星陨》设计的复古海报。标题应以未来主义风格的字体清晰可见，下方附有宣传语‘见证一个时代的终结’。海报上有一片遥远的星云和一艘孤独的宇宙飞船。",
        "Close-up of a dew-covered spiderweb at sunrise, with individual water droplets clearly visible and refracting light. The spiderweb should be intricate and delicate, with a shallow depth of field.": "日出时分挂满露珠的蜘蛛网的特写，每颗水珠都清晰可见并折射着光线。蜘蛛网应精巧而脆弱，并采用浅景深拍摄。",

        "Create and simulate generative media with the latest Veo 3 Fast and GenMedia models using tldraw canvas to explore different workfflows": "使用最新的 Veo 3 Fast 和 GenMedia 模型，并利用 tldraw 画布创建和模拟生成式媒体，探索不同工作流。",
        "Upload your photo and travel through time! This app uses AI to generate polaroid-style images of you reimagined in the iconic styles of different decades.": "上传您的照片，穿越时空！此应用使用 AI，将您的形象重塑为不同年代的标志性风格，生成宝丽来式图片。",

        "Read aloud this conversation between friends in a cafe discussing travel to Paris.": "朗读这段朋友在咖啡馆讨论巴黎旅行的对话。",
        "Chloe, look at this! The Eiffel Tower lights up every hour at night! We have to see it from the Trocadéro, and then race to a bateau-mouche for the river view! It's going to be epic!": "克洛伊，快看这个！埃菲尔铁塔每晚整点都会亮灯！我们一定要从特罗卡德罗广场看，然后冲去坐塞纳河游船看河景！那一定会很壮观！",
        "I saw that, Liam. It does sound spectacular, a real Parisian icon, known for its dazzling beauty and romantic atmosphere.": "我看到了，利亚姆。听起来确实很壮观，一个真正的巴黎地标，以其耀眼的美丽和浪漫的氛围而闻名。",
        "Wow! I wish we could teleport there right now! Imagine, zipping from museum to museum, hitting all the patisseries, and seeing every single arrondissement!": "哇！我真希望我们现在就能传送过去！想象一下，飞快地逛完一座又一座博物馆，吃遍所有法式糕点店，看遍每一个区！",
        "It certainly has its appeal, rushing to see everything, but there are also benefits to a more relaxed pace, you know? We could just wander through Le Marais, discover little cafes, and really soak in the city.": "匆忙地看遍一切当然很有吸引力，但你知道吗，慢节奏也有好处。我们可以只是漫步在玛莱区，发现一些小咖啡馆，真正沉浸在这座城市里。",
        "But wouldn't you ever want the thrill of a packed itinerary? To conquer all the major sights and feel like we've truly done Paris?": "但是你难道不想体验一下排满行程的刺激吗？攻克所有主要景点，感觉我们真的“玩转了”巴黎？",
        "Perhaps for a day, my friend. But for the most part, I'm looking forward to savoring the moments. And who knows, maybe I'll discover the best croissant in a tiny, hidden bakery while you're scaling the Arc de Triomphe.": "也许有一天吧，我的朋友。但大部分时间，我更期待细细品味那些瞬间。谁知道呢，也许你在攀登凯旋门的时候，我会在一家隐藏的小面包店里发现最棒的可颂面包。",
        "Maybe you will, Chloe! And maybe I'll bring you back a macaron from the top of Montmartre!": "也许你会发现，克洛伊！而我或许会从蒙马特高地给你带回一个马卡龙！",
        "That sounds like a delicious peace offering. Until then, enjoy your meticulous planning, Liam.": "听起来像是美味的和解。那在此之前，尽情享受你一丝不苟的计划吧，利亚姆。",
        "I will, Chloe! Thanks for dreaming with me!": "我会的，克洛伊！谢谢你和我一起做梦！",

        "Please read aloud the following:": "请朗读以下内容：",
        "Hey Assistant, how tall is the Empire State Building?": "嘿，小助手，帝国大厦有多高？",
        "The Empire State Building is 1,454 feet, or about 443 meters tall.": "帝国大厦高 1,454 英尺，也就是大约 443 米。",

        "Please read aloud the following in a podcast interview style:": "请以播客访谈的风格朗读以下内容：",
        "We're seeing a noticeable shift in consumer preferences across several sectors. What seems to be driving this change?": "我们看到，现在很多行业的消费偏好都出现了明显转变。您觉得是什么在推动这个变化呢？",
        "It appears to be a combination of factors, including greater awareness of sustainability issues and a growing demand for personalized experiences.": "这背后有好几个原因。一方面是大家对环保、可持续问题的关注度更高了，另一方面，人们也越来越追求个性化的体验。",

        "Read aloud in a warm and friendly tone:": "请用温暖友好的语气朗读:",
        "Tell the following story in a playful, scary style as if you are talking to a group of campers at a campsite.": "请以在露营地对一群露营者讲鬼故事的风格，用一种既调皮又恐怖的语气讲述以下故事:",
        "Alright, so, gather 'round close... this one, this one's a bit… spooky. It was last summer, just over that ridge, a group, just like us, you know? They heard it first, a sort of... a scraping sound, slow, real slow, from deep in the trees. And then, um, then the whispering started, couldn't make out words, just... just sibilant, like. One of them, he, uh, he pointed his flashlight out there, towards the sound. Nothing. Just... just blackness, but the whispering, it got louder, almost... personal, you know? He swore, swore he saw eyes, just for a second, reflecting the beam back, low to the ground, too low. They, uh, they packed up fast, real fast, didn't even douse the fire properly, just ran. And the whole time, that scraping, that whispering, it seemed to be... to be following them. So, uh, if you hear anything tonight... maybe, just maybe, keep your flashlights off": "好了，都凑过来点……这个故事嘛，有点……吓人哦。就是去年夏天，在那道山脊后面，有一队人，就跟咱们一样，懂吧？他们最先听到的，是一种……摩擦声，很慢，特别慢，从林子深处传来的。然后，嗯……然后就开始有窃窃私语，听不清说的啥，就是……就是那种嘶嘶的声音。他们中有一个人，他……呃……他就拿手电筒朝声音那边照过去。什么都没有。就是……一片漆黑。但那私语声，变得更响了，几乎……就像在贴着你耳朵说一样，知道吗？他发誓，他发誓他看到眼睛了，就一瞬间，反着光，离地很低，低得不正常。他们……呃……他们赶紧收拾东西，特别快，连火都没好好扑灭，就跑了。而且自始至终，那种摩擦声，那种私语声，好像……好像就一直跟着他们。所以……呃……今晚你们要是听见什么声音……最好，最好别开手电筒。",
        "Read this disclaimer in as fast a voice as possible while remaining intelligible:": "请用尽可能快且能听清的语速朗读以下免责声明:",
        "Availability and terms may vary. Check our website or your local store for complete details and restrictions.": "具体供应情况与条款可能随时变更。详情及限制条款请查询官网或咨询当地门店。",
        "Greet the user in a warm and welcoming voice:": "请用热情友好的声音向用户问好:",
        "Good morning! Ready to start your day?": "早上好！准备好开启新的一天了吗？",


        "Generate a hyper-realistic, studio-quality product advertisement photograph for a fictional luxury soda called \"Ember Fizz,\" a sparkling blood orange and ginger soda. The centerpiece is an elegant, vintage-inspired glass bottle, its surface gleaming with delicate, realistic condensation, indicating it's ice-cold. The bottle has the name of the product embossed on the front along with one simplistic orange tree symbol outline. No other words are present in the image. The soda inside is a vibrant, translucent crimson color, with tiny, effervescent bubbles visibly rising to the surface. The bottle is positioned slightly off-center on a dark, slate serving platter, which has a subtle, wet sheen. Next to it sits a lowball, crystal-cut glass filled with the soda and a single, perfectly clear, oversized square ice cube. A sophisticated garnish of a charred orange peel twist rests on the rim of the glass. The background is dark and moody, with a softly focused hint of warm, ambient light from a cocktail bar setting. The key lighting is a dramatic, high-contrast \"rim light\" from behind and to the side, which brilliantly illuminates the edges of the bottle and glass, highlights the carbonation, and makes the condensation droplets sparkle. Rendered with extreme photorealistic detail as if shot on a professional DSLR with a macro lens, this image must capture a sense of sophisticated indulgence, bold flavor, and refreshing crispness, making the product look incredibly desirable.": "超写实、影棚级产品广告摄影。一款名为 “Ember Fizz” 的虚构高档苏打水（血橙姜味）。视觉中心：一个优雅的复古风格玻璃瓶，瓶身带有精致逼真的冷凝水珠。瓶身正面有压印的产品名 “Ember Fizz” 和一个简洁的橙树符号轮廓，画面中无其他任何文字。瓶内苏打水是鲜艳的半透明深红色，有微小气泡上升。瓶子微偏离中心，放在一个有湿润光泽的深色石板托盘上。旁边是一个水晶切割的矮款玻璃杯，装有苏打水和一块超大的方形透明冰块，杯沿上有一片烤焦的橙皮卷作为装饰。背景：黑暗有情调，有来自鸡尾酒吧的柔焦暖色环境光。关键照明：戏剧性的高对比度“轮廓光”（Rim Light），从后侧方打来，照亮瓶子和杯子的边缘，凸显气泡和闪亮的水珠。风格：极致的真实感，专业单反微距镜头效果，精致奢华，风味大胆，清爽提神，极具吸引力。",
        "The building's primary structure mimics a colossal, ancient banyan tree, with a massive central \"trunk\" that blossoms into a complex, interwoven canopy. This canopy is composed of hundreds of parametrically designed, warm-toned glulam (glued laminated timber) beams that spiral outwards and support the roof. Living, mature trees and cascading hanging gardens are woven directly into the building's fabric, emerging from balconies and spiraling up the central core. The facade features vast, undulating panels of curved glass, blurring the line between inside and out. The late afternoon 'magic hour' light filters through the complex timber lattice, creating a dynamic, dappled 'forest floor' pattern of light and shadow on the polished, light-gray concrete floors below. People are scattered throughout, reading in sunlit nooks and walking along spiraling ramps detailed with hand-finished bronze railings. The atmosphere is serene and contemplative. Shot on a Hasselblad X2D 100C with a wide 21mm lens from a low angle to emphasize the monumental scale, hyper-detailed, cinematic lighting.": "一座巨大古老的榕树形态建筑，巨大的中央“树干”向上绽放成复杂交织的华盖。华盖由数百根参数化设计的暖色调胶合层压木梁构成，螺旋式向外延伸支撑屋顶。成熟的树木与层叠的空中花园从阳台伸出，盘旋上升。立面是巨大的波浪形曲面玻璃。午后“魔幻时刻”的光线穿过木格栅，在抛光的浅灰色混凝土地板上形成斑驳的“林地”光影。人们散布其间，或在阳光下阅读，或在带有青铜扶手的螺旋坡道上行走，氛围宁静。摄影参数：使用哈苏X2D 100C相机，21mm广角镜头，低角度拍摄以强调宏伟规模。风格：超高细节，电影感光效，氛围宁静。",
        "A vintage-style poster advertising a local coffee shop. The text, 'Brew Haven: Your Daily Escape,' should be rendered in a stylized, hand-painted font, incorporated seamlessly into the image. The poster should feature a charming illustration of a steaming coffee cup with intricate latte art. The colors should be warm and inviting, evoking a cozy atmosphere. Style: Vintage poster, Hand-painted typography, Cozy atmosphere, High-quality text rendering": "为本地咖啡店设计的复古风格广告海报。海报上应有手绘风格的文字“Brew Haven: Your Daily Escape”，并与图像无缝融合。画面主体是一杯热气腾腾、带有精致拉花的咖啡，色彩温暖诱人，营造出舒适的氛围。风格：复古海报，手绘字体，舒适氛围，高品质文字渲染。",
        "Photorealistic long exposure photograph of a subway platform, straight-on view. The main subject is a large pavement mosaic sign reading \"Google AI Studio\" in white tiles on a black tile background. The wall is made of glossy white square subway tiles with dark grout. Below the sign is a modern, backless, metallic silver bench with horizontal slats. A woman in blue jeans and a dark jacket is walking past, captured with significant motion blur from a slow shutter speed, while the background remains perfectly sharp. Bright, even fluorescent lighting. Minimalist color palette of black, white, and silver. Urban, clean, graphic aesthetic.": "超写实长曝光摄影，地铁站台，正面视角。视觉焦点是墙上的大型马赛克标牌，内容为“Google AI Studio”，白色瓷砖字，黑色瓷砖背景。墙壁是带有深色勾缝的光滑白色方形地铁瓷砖。标牌下方是一张现代、无靠背的金属银色长凳，水平板条设计。一名女子（深色夹克，蓝色牛仔裤）走过，因慢速快门而产生明显的动态模糊，背景则保持绝对清晰。明亮均匀的荧光灯照明。风格：极简主义色调（黑、白、银），都市感，干净，图形化美学。",

        "Generate a sequence of images to produce a step-by-step visual guide to making homemade Ramen dish, using the provided image of ingredients. Clearly illustrate each cooking step with brief instructions, from preparation to the finished dish": "使用提供的食材图片，生成一份制作家庭式拉面的分步视觉指南。通过简要说明，清晰地展示从准备到成品过程中的每一个烹饪步骤。",
        "**Step 1: Gather Your Ingredients**\n\nWe have all the fresh ingredients laid out on a speckled countertop: a block of dried ramen noodles, sheets of dark green nori seaweed, several slices of raw pork belly with visible layers of fat and lean meat, three brown chicken eggs, a small white bowl filled with dark soy sauce, and a bunch of vibrant green scallions with white bulbs.": "**步骤一：准备食材**\n\n我们将所有新鲜食材展示在斑点纹理的台面上：一块干拉面、几片深绿色海苔、数片带有可见肥瘦层次的生五花肉、三个褐壳鸡蛋、一小碗深色酱油，以及一束鲜绿色的葱。",
        "**Step 2: Cook the Pork Belly**\n\nPlace the slices of raw pork belly in a hot pan. The fat will render and the pork will become golden brown and crispy.": "**步骤二：煎五花肉**\n\n将生五花肉片放入热锅中。油脂会析出，五花肉会变得金黄酥脆。",
        "**Step 3: Boil the Eggs**\n\nGently place the brown eggs into a pot of boiling water. Cook for your desired level of doneness, typically 6-7 minutes for a soft-boiled egg.": "**步骤三：煮鸡蛋**\n\n将褐壳鸡蛋轻轻放入一锅沸水中。根据您想要的熟度进行烹煮，通常溏心蛋需要煮6-7分钟。",
        "**Step 4: Cook the Ramen Noodles**\n\nIn a separate pot, bring water to a boil and add the block of dried ramen noodles. Cook according to package instructions until tender.": "**步骤四：煮拉面**\n\n在另一个锅中，将水烧开，然后放入干拉面。根据包装上的说明煮至柔软。",
        "**Step 5: Assemble the Ramen**\n\nPour hot broth into a bowl (not pictured, but imagine a rich, flavorful broth). Add the cooked ramen noodles to the broth.": "**步骤五：组合拉面**\n\n将热汤倒入碗中（图中未显示，但请想象一下浓郁美味的汤底）。然后将煮好的拉面放入汤中。",
        "**Step 6: Add Toppings**\n\nArrange the cooked pork belly slices, halved boiled egg, and chopped green scallions on top of the noodles in the broth. Add a sheet of nori to the side. Drizzle with soy sauce to taste.": "**步骤六：添加配菜**\n\n将煎好的五花肉片、对半切开的煮鸡蛋和切碎的葱花摆放在汤面之上。在旁边放上一片海苔。根据口味淋上酱油。",
        "**Step 7: Enjoy Your Homemade Ramen!**\n\nThe finished bowl of ramen is a comforting and delicious meal, with rich broth, tender noodles, savory pork, creamy egg, and fresh scallions.": "**步骤七：享用您的家庭式拉面！**\n\n这碗完成的拉面是一道舒适又美味的餐点，拥有浓郁的汤底、筋道的面条、咸香的五花肉、绵密的鸡蛋和清新的葱花。",

        "Generate an image of a panda as an adventurer archaeologist in a lush Mayan jungle.": "生成一张图片：一位熊猫冒险考古学家，置身于繁茂的玛雅丛林。",

        "Upload a photo of yourself and an outfit to see how it looks on you. A virtual fitting room powered by Nano Banana.": "上传您自己和一套服装的照片，看看穿在您身上的效果。一个由 Nano Banana 驱动的虚拟试衣间。",
    };

    const BuildPageTranslations = {
        "Run Chase": "追逐跑分",
        "An arcade cricket game where Gemini is your personal, live sports commentator.": "一款街机风格的板球游戏，由 Gemini 为您进行实时体育解说。",
        "Native Audio Function Call Sandbox": "原生音频函数调用沙盒",
        "An interactive sandbox for Gemini's native audio and function calling.": "一个用于实验 Gemini 原生音频和函数调用的交互式沙盒。",
        "ENHANCE!": "无限放大！",
        "Infinitely zoom into any image with this creative enhancer. See if you can find the easter egg.": "使用这款创意增强工具，无限放大任何图片。看看您能否找到其中的彩蛋。",
        "Fit Check": "虚拟试衣",
        "Upload a photo of yourself and an outfit to see how it looks on you, powered by Nano Banana.": "上传您自己和一套服装的照片，看看穿在您身上的效果。由 Nano Banana 提供技术支持。",
        "MediaSim": "MediaSim",
        "Create and combine AI media, blending Veo and Imagen on a single canvas.": "在同一画布上融合 Veo 和 Imagen，创作并组合 AI 媒体内容。",
        "Bananimate": "Bananimate",
        "Create animated GIFs with Nano Banana from your images and prompts": "使用 Nano Banana，根据您的图片和提示创建动画 GIF。",
        "Paint A Place": "描绘此景",
        "Transform any Google Maps location into a stunning watercolor painting with Nano Banana.": "使用 Nano Banana，将任意 Google 地图位置变为一幅令人惊叹的水彩画。",
        "Past Forward": "时光穿梭",
        "Your personal time machine. Gemini reimagines you in past decades with character consistency.": "您的私人时光机。Gemini 利用角色一致性技术，为您重塑过去几十年的经典形象。",
        "GemBooth": "GemBooth",
        "Try native image model effects with your webcam.": "通过您的网络摄像头，体验原生图像模型的效果。",
        "Home Canvas": "家居画布",
        "Drag, drop, and visualize any product in your personal space.": "在您的个人空间中，拖放并可视化任何产品。",
        "Pixshop": "Pixshop",
        "Gemini brings professional, prompt-based photo editing to your fingertips.": "Gemini 为您带来专业的、基于指令的图片编辑体验，一切尽在指尖。",
        "Gemini Co-Drawing": "Gemini 协同绘画",
        "Sketch and prompt, Gemini brings your drawings to life! Co-create collaboratively with AI by sketching and prompting.": "随心勾勒、输入提示，Gemini 将为您的画作注入生命！通过绘画和提示与 AI 协同创作。",
        "Get Started with Gemini 2.5 Flash Image": "Gemini 2.5 Flash Image 入门",
        "Discover how to use the Gemini 2.5 image model (aka nano banana) using the Gemini JS SDK in an interactive way. No need to create an API key or set up your environment.": "以交互式的方式，探索如何使用 Gemini JS SDK 来操作 Gemini 2.5 图像模型（又名 nano banana）。无需创建 API 密钥或配置您的开发环境。",
        "Chat with Docs": "文档问答",
        "See the URL Context tool in action. Chat with Gemini to explore API documentation.": "查看“URL 内容提取”工具的实际应用。与 Gemini 对话，轻松探索 API 文档。",
        "VibeCheck": "VibeCheck",
        "Quickly batch test prompts with visual outputs.": "通过可视化输出，快速批量测试提示。",
        "Infinite Wiki": "无限维基",
        "Explore an infinite wiki where every word is a hyperlink to descriptions generated in real-time.": "探索一个无限的维基百科，其中每个词都是一个超链接，指向实时生成的描述。",
        "Veo 3 Gallery": "Veo 3 展廊",
        "Explore a gallery of stunning Veo videos and remix their prompts to create your own.": "探索一个展示着精彩 Veo 视频的展廊，并混合利用它们的提示来创作您自己的作品。",
        "Robotics Spatial Understanding": "机器人空间理解",
        "An interactive demo of how Gemini provides robots with critical spatial understanding.": "一个交互式演示，展示 Gemini 如何为机器人提供关键的空间理解能力。",
        "Gemini OS": "Gemini OS",
        "Simulate a computer with a UI that is generated dynamically from user interactions.": "模拟一台计算机，其用户界面会根据用户的交互动态生成。",
        "Audio Avatars": "音频化身",
        "Unleash Gemini's creative TTS voices and see their characters come to life with Imagen.": "释放 Gemini 富有创意的文本转语音功能，并使用 Imagen 让这些声音的角色活灵活现。",
        "Audio Orb": "音频星球",
        "Speak, and the orb responds. An interactive experience powered by the Live Audio API.": "您一开口，星球便会回应。一个由实时音频 API 驱动的互动体验。",
        "PromptDJ": "PromptDJ",
        "Steer a continuous stream of music with text prompts": "通过文本提示，引导连续的音乐流。",
        "PromptDJ MIDI": "PromptDJ MIDI",
        "Control real time music with a MIDI controller.": "使用 MIDI 控制器实时控制音乐。",
        "Thinking Space": "思考空间",
        "Search a custom set of images using natural language.": "使用自然语言搜索一组自定义的图片。",
        "MCP Maps 3D": "MCP 地图 3D",
        "Build Photoreal 3D maps with natural language using a Gemini-powered Agent and MCP tool.": "使用由 Gemini 驱动的代理和 MCP 工具，通过自然语言构建照片般真实的 3D 地图。",
        "ChatterBots": "ChatterBots",
        "Build and banter with your own AI characters using the Live API.": "使用实时 API 构建您自己的 AI 角色，并与之互动。",
        "Dictation App": "听写应用",
        "Let Gemini turn your messy audio recordings into clean, perfectly structured notes.": "让 Gemini 将您杂乱的录音转化为条理清晰、结构完美的笔记。",
        "Video to Learning App": "视频转学习应用",
        "Instantly convert any YouTube video into an interactive learning app, coded by Gemini.": "将任何 YouTube 视频即时转换为交互式学习应用，由 Gemini 编码实现。",
        "Gemini 95": "Gemini 95",
        "Explore a retro OS that brings back nostalgic memories with an AI twist.": "探索一个复古操作系统，通过 AI 的点缀，带回怀旧的记忆。",
        "MCP Maps Basic": "MCP 地图基础版",
        "Query the globe and get answers instantly visualized, with Gemini grounded by MCP.": "向全球提问，答案即时可视化，由 Gemini 在 MCP 的支持下完成。",
        "Maps Planner": "地图规划器",
        "Let Gemini plan your perfect day trip and instantly visualize it on Google Maps.": "让 Gemini 为您规划完美的日间旅行，并即时在 Google 地图上进行可视化。",
        "p5js playground": "p5.js 游乐场",
        "Generate, edit, and preview interactive p5.js art and games simply by chatting with Gemini.": "只需与 Gemini 对话，即可生成、编辑和预览交互式的 p5.js 艺术与游戏。",
        "Flashcard Maker": "抽认卡制作工具",
        "Effortless flashcards on any subject. Just name a topic, and Gemini creates your study deck.": "轻松制作任何主题的抽认卡。只需说出主题，Gemini 就能为您创建学习卡片组。",
        "Video Analyzer": "视频分析器",
        "Chat with any video to instantly summarize, find objects, or extract text with Gemini.": "与任何视频进行对话，即可通过 Gemini 即时生成摘要、查找对象或提取文本。",
        "Spatial Understanding": "空间理解",
        "Detect the precise 2D/3D location of objects in any image or live screenshare.": "在任何图像或实时屏幕共享中，精确检测对象的 2D/3D 位置。",
        "Maps Explorer": "地图浏览器",
        "Ask Gemini to find any place on Earth and explore it instantly on Google Maps.": "让 Gemini 为您寻找地球上的任何地方，并即时在 Google 地图上进行探索。",
        "Image to Code": "图像转代码",
        "Let Gemini transform your images into living, interactive p5.js sketches, coded on the fly.": "让 Gemini 将您的图像转化为生动、可交互的 p5.js 草图，并即时生成代码。",
        "Get Started with the Gemini JS SDK": "Gemini JS SDK 入门",
        "Discover how to take your first steps with the Gemini JS SDK in an interactive way. No need to create an API key or set up your environment.": "以交互式的方式，探索如何迈出使用 Gemini JS SDK 的第一步。无需创建 API 密钥或配置您的开发环境。",


        "Character consistency": "角色一致性",
        "Character Consistency": "角色一致性",
        "Image Enhancement": "图像增强",
        "Image Editing": "图像编辑",
        "Live API": "实时 API",
        "Native Audio": "原生音频",
        "Function Calling": "函数调用",
        "Google Maps": "Google 地图",
        "Google Maps API": "Google 地图 API",
        "Code generation": "代码生成",
        "URL Context": "URL 内容提取",
        "Audio-Video Generation": "音视频生成",
        "Generative UI": "生成式 UI",
        "Music generation": "音乐生成",
        "Visual understanding": "视觉理解",
        "Video understanding": "视频理解",
        "object consistency": "对象一致性",
        "Audio transcription": "音频转录",
        "Text generation": "文本生成",
        "Native image gen": "原生图像生成",

        "Describe your idea": "描述您的创意",
        "Build your ideas with Gemini": "使用 Gemini 构建您的创意",
        "Select model for the code assistant:": "为代码助手选择模型：",
        "Select the model for the code assistant": "为代码助手选择模型",
        "The model will be used by the code assistant to generate code.": "代码助手将使用此模型生成代码。",
        "Microphone selector": "选择麦克风",
        "Select the audio source for the speech-to-text feature": "为“语音转文本”功能选择音频源",
        "Select the audio source for the speech-to-text feature.": "为“语音转文本”功能选择音频源。",
        "Supercharge your apps with AI": "AI 赋能，让您的应用更强大",
        "Start": "开始",
        "Gallery": "展廊",
        "App gallery": "示例应用",
        "Remix & explore the gallery": "探索示例，二次创作",
        "I'm feeling lucky": "给我灵感",
        "Speech to text": "语音转文本",
        "Annotate app": "标注应用",
        "Add annotations to visually iterate on your app": "为您的应用添加标注以进行可视化迭代",
        "Draw & write directly on your app's preview to instantly communicate your vision to Gemini. Highlight components, sketch new ideas, or add precise feedback right where it matters. Simply pass your visual prompts to Gemini, & watch your app update live.": "直接在应用预览上绘制和书写，立即向 Gemini 传达您的想法。突出显示组件、勾勒新想法，或在关键位置添加精确反馈。只需将您的视觉提示传递给 Gemini，即可实时观看应用更新。",
        "Add comment": "添加注释",
        "Add arrow": "添加箭头",
        "Add rectangle": "添加矩形",
        "Add text": "添加文本",
        "Start sketching": "开始涂鸦",
        "Select color": "选择颜色",
        "Undo": "撤销",
        "Clear": "清除",
        "No changes to undo": "没有可撤销的更改",
        "No changes to clear": "没有可清除的更改",
        "Add to chat": "添加到聊天",


        "Discover and remix app ideas": "发现并二次创作应用创意",
        "Browse the app gallery": "浏览应用库",
        "Generate images with Nano Banana Pro": "使用 Nano Banana Pro 生成图像",
        "Upload Files": "上传文件",
        "Insert files (text, images, audio, video) into your prompt.": "在提示词中插入文件（文本、图像、音频、视频）。",

        "Gemini 3 Flash is here": "Gemini 3 Flash 现已推出",
        "See the speed & intelligence of Gemini 3 Flash in action.": "见证 Gemini 3 Flash 的速度与智能。",
        "Create your first app": "创建您的第一个应用",
        "Lightning fast generation": "闪电般的生成速度",
        "Beautiful landing pages": "精美的落地页",
        "Studio-quality image generation & editing": "影棚级图像生成与编辑",
        "Immersive Games & 3D Worlds": "沉浸式游戏与 3D 世界",
        "Internet favorites": "热门精选",

        // --- 应用卡片：Flash UI ---
        "Flash UI": "Flash UI",
        "Put Gemini 3 Flash's creativity & coding abilities to the test. Rapidly generate UI, explore variations, & export code.": "测试 Gemini 3 Flash 的创意与编程能力。快速生成 UI、探索变体并导出代码。",

        // --- 应用卡片：Voxel Toy Box ---
        "Voxel Toy Box": "体素玩具箱",
        "Create, visualize, & rebuild sculptures using the same set of blocks.": "使用同一组方块进行创作、可视化并重建雕塑。",

        // --- 应用卡片：Shader Pilot ---
        "Shader Pilot": "Shader 领航员",
        "Navigate a complex 3d world with customizable interactions.": "在具有可定制交互的复杂 3D 世界中导航。",

        // --- 应用卡片：Research Visualization ---
        "Research Visualization": "研究可视化",
        "Research paper reimagined as an elegant, interactive narrative site.": "将研究论文重塑为一个优雅且具互动性的叙事网站。",
    };

    // 合并 BuildPageTranslations 到主字典
    Object.assign(translations, BuildPageTranslations);

    // --- 全局状态跟踪 ---
    const globalState = {
        // 鼠标悬停状态
        isHoveringScrollbar: false,
        isHoveringHistoryItem: false,
        isHoveringBuildFileRow: false,
        isHoveringThinkingIndicator: false,

        // 悬停状态延迟计时器
        scrollbarLeaveTimer: null,
        historyItemLeaveTimer: null,
        buildFileRowLeaveTimer: null,
        thinkingIndicatorLeaveTimer: null,

        // 自动刷新状态
        autoRefresh: {
            isWatching: false,
            hasRefreshedThisSession: false
        },

        // 性能优化状态
        mutationQueue: new Set(),
        pendingMutations: false
    };

    // --- UI刷新配置 ---
    const REFRESH_CONFIG = {
        clickDelay: 25,
        processDelay: 25,
        initialWait: 150,
        scrollWait: 75
    };

    // =========================================================================
    // 工具函数
    // =========================================================================

    const utils = {
        // 延迟函数
        sleep: (ms) => new Promise(r => setTimeout(r, ms)),

        // 转义正则表达式特殊字符
        escapeRegExp: (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),

        // 规范化文本
        normalize: (s) => s.replace(/[\u00A0\s]+/g, ' ')
                           .replace(/[\u3002\.]+$/, '')
                           .trim(),

        // 查找可滚动祖先元素
        findScrollableAncestor: (start) => {
            let node = start?.parentElement;
            while (node && node !== document.body) {
                const style = getComputedStyle(node);
                if ((style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                    node.scrollHeight > node.clientHeight + 8) {
                    return node;
                }
                node = node.parentElement;
            }
            return null;
        }
    };

    // =========================================================================
    // 翻译引擎核心
    // =========================================================================

    const translationEngine = (function() {
        // 预计算与缓存翻译键
        const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);
        const longerKeyMap = new Map();
        const normalizedKeyMap = new Map();

        // 预计算长短键关系及规范化键
        function precomputeKeys() {
            for (let i = 0; i < sortedKeys.length; i++) {
                const ki = sortedKeys[i];
                if (!ki) continue;

                const normalizedKi = utils.normalize(ki);
                if (!normalizedKeyMap.has(normalizedKi)) {
                    normalizedKeyMap.set(normalizedKi, ki);
                }

                for (let j = 0; j < i; j++) {
                    const kj = sortedKeys[j];
                    if (kj.includes(ki)) {
                        if (!longerKeyMap.has(ki)) longerKeyMap.set(ki, []);
                        longerKeyMap.get(ki).push(kj);
                    }
                }
            }
        }

        // 处理千令牌数转换
        function handleKiloTokens(raw) {
            if (REGEX_PATTERNS.kiloTokens.test(raw)) {
                return raw.replace(REGEX_PATTERNS.kiloTokens, (match, numberStr) => {
                    const number = parseInt(numberStr, 10);
                    const translatedNumber = !isNaN(number) ? (number / 10) : numberStr;
                    return `${translatedNumber}\u00A0万令牌数`;
                });
            }
            return raw;
        }

        // 精确匹配翻译
        function exactMatch(trimmed, raw) {
            const normTrimmed = utils.normalize(trimmed);
            const normMatchKey = normalizedKeyMap.get(normTrimmed);

            if (normMatchKey && translations[normMatchKey]) {
                const v = translations[normMatchKey];
                if (v === "null") return raw;
                if (!raw.includes(v)) return raw.replace(trimmed, v);
            }

            if (translations[trimmed]) {
                const v = translations[trimmed];
                if (v === "null") return raw;
                if (!raw.includes(v)) return raw.replace(trimmed, v);
            }

            return null;
        }

        // 子串替换翻译
        function substringReplace(out) {
            for (const k of sortedKeys) {
                if (!k || !out.includes(k)) continue;
                const v = translations[k];
                if (v === "null" || out.includes(v)) continue;

                const potentialLongers = longerKeyMap.get(k);
                if (potentialLongers && potentialLongers.some((lk) => out.includes(lk))) continue;

                const isAsciiWord = REGEX_PATTERNS.asciiWord.test(k);
                if (isAsciiWord) {
                    const re = new RegExp(`(^|[^A-Za-z0-9])(${utils.escapeRegExp(k)})(?![A-Za-z0-9])`, 'g');
                    out = out.replace(re, `$1${v}`);
                } else {
                    out = out.split(k).join(v);
                }
            }
            return out;
        }

        // 主翻译函数
        function translateString(input) {
            if (!input) return input;
            let raw = String(input);
            const trimmed = raw.trim();
            if (!trimmed) return raw;

            // 1. 拦截 "Selected 模型名" -> 翻译为中文
            const selectedMatch = trimmed.match(/^Selected\s+(.+)$/);
            if (selectedMatch) {
                return `已选择 ${selectedMatch[1]}`;
            }

            // 2. 拦截 "已选择 模型名" -> 防止二次翻译
            // 如果文本已经是 "已选择" 开头，说明是第一轮翻译的结果，直接原样返回，保护后面的英文不被再次汉化
            if (trimmed.startsWith('已选择 ')) {
                return raw;
            }

            // 3. 拦截 "Copied ... to clipboard"
            const copyMatch = trimmed.match(/^Copied\s+(.+)\s+to\s+clipboard$/);
            if (copyMatch) {
                return `已将 ${copyMatch[1]} 复制到剪贴板`;
            }

            // 4. 拦截 "已将 ... 复制到剪贴板" -> 防止二次翻译
            if (trimmed.startsWith('已将 ') && trimmed.endsWith(' 复制到剪贴板')) {
                return raw;
            }

            // 阶段 0: 特殊正则模式处理
            raw = handleKiloTokens(raw);
            let out = raw;

            // 阶段 1: 精确匹配
            const exactResult = exactMatch(trimmed, raw);
            if (exactResult !== null) return exactResult;

            // 阶段 2: 子串替换
            out = substringReplace(out);
            return out;
        }

        // 初始化
        precomputeKeys();

        return { translateString };
    })();

    // =========================================================================
    // 原生函数劫持
    // =========================================================================

    const nativePatches = (function() {
        const FAST_CHECK_PREFIXES = [
            'Expand', 'Collapse', 'Show', 'Hide', 'Stop', 'Run',
            'Cancel', 'Close', 'Thinking', 'Copy', 'Delete', 'Edit',
            'Regenerate', 'Pause', 'Resume', 'Back',
            'Go',       // Go to Definition
            'Peek',     // Peek
            'Rename',   // Rename Symbol
            'Change',   // Change All Occurrences
            'Format',   // Format Document
            'Cut',      // Cut
            'Paste',    // Paste
            'Command',  // Command Palette
            'Select',   // Select All (预防性添加)
            'Find'      // Find (预防性添加)
        ];

        function isHoveringRestrictedArea() {
            if (typeof globalState === 'undefined') return false;
            return globalState.isHoveringScrollbar ||
                   globalState.isHoveringHistoryItem ||
                   globalState.isHoveringBuildFileRow ||
                   globalState.isHoveringThinkingIndicator;
        }

        function shouldTranslateSync(text) {
            if (!text || typeof text !== 'string') return false;
            if (text.startsWith('Copy of ')) return false; // 特例保护
            if (isHoveringRestrictedArea()) return false;
            if (text.length > 60) return false;
            const trimmed = text.trim();
            if (!trimmed) return false;
            return FAST_CHECK_PREFIXES.some(prefix => trimmed.startsWith(prefix));
        }

        // 增强保护列表：增加 .prompt-link-wrapper
        function isProtectedNode(node) {
            const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
            if (!element || !element.closest) return false;

            // 1. [最高优先级] 绝对禁止翻译 Dae 设置面板内的任何内容
            if (element.closest('.dae-settings-panel')) {
                return true;
            }

            // 2. [原有逻辑] 其他保护区域
            return !!(
                element.closest('.mode-title') ||
                element.closest('.prompt-link') ||
                element.closest('.prompt-link-wrapper') ||
                element.closest('.name-btn') ||
                element.closest('.page-title') ||
                element.closest('td.cdk-column-name') ||
                element.closest('.tooltip-overflow') ||
                element.closest('ms-cmark-node') ||
                element.closest('.chat-content') ||
                element.closest('.message') ||
                // 文件描述保护
                element.closest('.file-description') 
            );
        }

        function patchSetAttribute() {
            try {
                const origSetAttribute = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name, value) {
                    let valueToSet = value;

                    // 强制保护历史记录相关的 title 和 mattooltip
                    if ((name === 'title' || name === 'mattooltip') &&
                        this.matches && (this.matches(SELECTORS.HISTORY_LINK) || isProtectedNode(this))) {
                        return origSetAttribute.call(this, name, value);
                    }

                    else if (name === 'placeholder' && typeof value === 'string' &&
                             value.startsWith('Press Tab to use an example:')) {
                        const originalPrefix = 'Press Tab to use an example:';
                        const translatedPrefix = translationEngine.translateString(originalPrefix);
                        if (translatedPrefix !== originalPrefix) {
                            valueToSet = value.replace(originalPrefix, translatedPrefix);
                        }
                        if (this.closest && (this.closest('ms-edit-function-declarations-dialog') ||
                                            this.closest('ms-edit-schema-dialog'))) {
                            if (!this.hasAttribute('data-no-translate')) {
                                this.setAttribute('data-no-translate', '1');
                            }
                        }
                    }
                    else if (typeof value === 'string' && TRANSLATE_ATTRIBUTES.has(name)) {
                        const trimmed = value.trim();
                        // 增加 !isProtectedNode(this) 检查
                        if (shouldTranslateSync(trimmed) && !isProtectedNode(this)) {
                             valueToSet = translationEngine.translateString(value);
                        } else if (!this.closest(SELECTORS.NO_TRANSLATE) && !isProtectedNode(this)) {
                             valueToSet = translationEngine.translateString(value);
                        }
                    }
                    return origSetAttribute.call(this, name, valueToSet);
                };
            } catch (_) {}
        }

        function patchTitleProperty() {
            try {
                const titleDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'title');
                if (titleDesc && titleDesc.set && titleDesc.configurable) {
                    Object.defineProperty(HTMLElement.prototype, 'title', {
                        ...titleDesc,
                        set(v) {
                            // 增加保护
                            if (this.matches && (this.matches(SELECTORS.HISTORY_LINK) || isProtectedNode(this))) {
                                return titleDesc.set.call(this, v);
                            }

                            let valueToSet = v;
                            if (typeof v === 'string') {
                                if (shouldTranslateSync(v)) {
                                    valueToSet = translationEngine.translateString(v);
                                } else if (!this.closest(SELECTORS.NO_TRANSLATE)) {
                                    valueToSet = translationEngine.translateString(v);
                                }
                            }
                            return titleDesc.set.call(this, valueToSet);
                        }
                    });
                }
            } catch (_) {}
        }

        function patchCreateTextNode() {
            try {
                const origCreateTextNode = Document.prototype.createTextNode;
                Document.prototype.createTextNode = function(data) {
                    let newData = data;
                    if (isTranslationEnabled && typeof data === 'string' && shouldTranslateSync(data)) {
                        newData = translationEngine.translateString(data);
                    }
                    return origCreateTextNode.call(this, newData);
                };
            } catch (_) {}
        }

        function patchNodeValue() {
            try {
                const nodeValueDesc = Object.getOwnPropertyDescriptor(Node.prototype, 'nodeValue');
                if (!nodeValueDesc || !nodeValueDesc.set || !nodeValueDesc.configurable) return;

                Object.defineProperty(Node.prototype, 'nodeValue', {
                    ...nodeValueDesc,
                    set(v) {
                        let valueToSet = v;
                        if (isTranslationEnabled && this.nodeType === Node.TEXT_NODE && typeof v === 'string') {
                            if (!isProtectedNode(this) && shouldTranslateSync(v)) {
                                valueToSet = translationEngine.translateString(v);
                            }
                        }
                        return nodeValueDesc.set.call(this, valueToSet);
                    }
                });
            } catch (_) {}
        }

        function patchTextContent() {
            try {
                const textContentDesc = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
                if (!textContentDesc || !textContentDesc.set || !textContentDesc.configurable) return;

                Object.defineProperty(Node.prototype, 'textContent', {
                    ...textContentDesc,
                    set(v) {
                        let valueToSet = v;
                        if (isTranslationEnabled && typeof v === 'string') {
                            if (!isProtectedNode(this) && shouldTranslateSync(v)) {
                                valueToSet = translationEngine.translateString(v);
                            }
                        }
                        return textContentDesc.set.call(this, valueToSet);
                    }
                });
            } catch (_) {}
        }

        function patchInnerText() {
            try {
                const innerTextDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');
                if (!innerTextDesc || !innerTextDesc.set || !innerTextDesc.configurable) return;

                Object.defineProperty(HTMLElement.prototype, 'innerText', {
                    ...innerTextDesc,
                    set(v) {
                        let valueToSet = v;
                        if (isTranslationEnabled && typeof v === 'string') {
                            if (!isProtectedNode(this) && shouldTranslateSync(v)) {
                                valueToSet = translationEngine.translateString(v);
                            }
                        }
                        return innerTextDesc.set.call(this, valueToSet);
                    }
                });
            } catch (_) {}
        }

        function patchTextareaValue() {
            try {
                const valueDesc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
                if (!valueDesc || !valueDesc.set || !valueDesc.configurable) return;

                Object.defineProperty(HTMLTextAreaElement.prototype, 'value', {
                    ...valueDesc,
                    set(v) {
                        let valueToSet = v;
                        const isInCodeEditor = this.closest && this.closest('.monaco-editor, .code-editor, ms-console-editor');
                        if (typeof v === 'string' && inputContentTranslations[v.trim()] && !isInCodeEditor) {
                            valueToSet = inputContentTranslations[v.trim()];
                            const result = valueDesc.set.call(this, valueToSet);
                            if (!isInCodeEditor) {
                                this.dispatchEvent(new Event('input', { bubbles: true }));
                                this.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                            return result;
                        }
                        return valueDesc.set.call(this, valueToSet);
                    }
                });
            } catch (_) {}
        }

        function applyAllPatches() {
            patchSetAttribute();
            patchTitleProperty();
            patchCreateTextNode();
            patchNodeValue();
            patchTextContent();
            patchInnerText();
            patchTextareaValue();
        }

        return { applyAllPatches };
    })();

    // =========================================================================
    // DOM 翻译与节点处理
    // =========================================================================

    const domTranslator = (function() {
        // --- 固定按钮 Tooltip 特殊处理 ---
        function translatePinTooltip(node) {
            const parent = node.parentElement;
            if (!parent) return false;

            const tooltipSurface = parent.closest('.mat-mdc-tooltip-surface');
            if (!tooltipSurface || !tooltipSurface.hasAttribute('data-pin-tooltip')) {
                return false;
            }

            const text = node.nodeValue;
            if (!text) return false;

            // 只翻译开头的 "Pin " 或 "Unpin "
            let translated = false;
            if (text.startsWith('Pin ')) {
                node.nodeValue = text.replace(/^Pin /, '固定 ');
                translated = true;
            } else if (text.startsWith('Unpin ')) {
                node.nodeValue = text.replace(/^Unpin /, '取消固定 ');
                translated = true;
            }

            // 翻译完成后，标记整个 tooltip 不再翻译其他内容
            if (translated) {
                tooltipSurface.setAttribute('data-no-translate', '1');
            }

            return translated;
        }

        // --- 节点过滤与判断 ---
        function shouldSkipNode(node) {
            if (!node) return false;
            const parentElement = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
            if (!parentElement) return false;

            // 获取文本内容进行判断
            const nodeText = (node.nodeType === Node.TEXT_NODE ? node.nodeValue : node.textContent)?.trim();
            const isSystemDataType = ["string", "number", "integer", "boolean", "object", "enum"].includes(nodeText);

            // ============================================================
            // 0.0 [最高优先级屏蔽]：Dae 设置面板及其内部所有元素
            // ============================================================
            if (parentElement.closest('.dae-settings-panel')) {
                return true;
            }
            // ============================================================

            // 0. [绝对屏蔽]：图标字体和代码编辑器绝对不翻译，优先级高于白名单
            if (parentElement.matches('.material-symbols-outlined') ||
                parentElement.closest('.material-symbols-outlined') ||
                parentElement.closest('.monaco-editor')) {
                return true;
            }

            // 1. [强制白名单]
            if (parentElement.closest('[data-test-id="features-button"]') ||
                parentElement.closest('ms-toast') ||
                // 即使处于 .message 中，如果是系统提示框(callout)，则强制允许翻译
                parentElement.closest('[callout-content-text]') ||
                parentElement.querySelector && parentElement.querySelector('[callout-content-text]') ||
                // Quote 内容强制允许翻译
                parentElement.closest('.gemini-quote-content')) {
                return false;
            }

            // 如果文本是标准数据类型，且位于下拉框或触发器内，强制允许翻译
            if (isSystemDataType && (parentElement.closest('mat-option') || parentElement.closest('mat-select-trigger'))) {
                return false;
            }

            // 1.5. [黑名单屏蔽]：拦截显式标记不翻译的区域
            // 检查当前元素或其任何祖先是否匹配 SELECTORS.NO_TRANSLATE (包含 .message-text 和 data-no-translate)
            const blockedParent = parentElement.closest(SELECTORS.NO_TRANSLATE);
            if (blockedParent) {
                // 特例放行 1: 预览区域的警告文本
                if (parentElement.closest('.preview.warning')) return false;

                // 特例放行 2: 文件树标题
                if (parentElement.id === 'file-tree-header-title' || parentElement.classList.contains('tree-header-title')) {
                    return false;
                }

                // 特例放行 3: 再次确认 callout 结构 (防止漏网之鱼)
                if (blockedParent.classList.contains('message') && blockedParent.querySelector('[callout-content-text]')) {
                    return false;
                }

                // [同步增强] 豁免逻辑：如果是临时聊天提示，允许引擎进入
                const text = blockedParent.textContent || "";
                const isSystemNotice = blockedParent.querySelector('[callout-content-text]') || 
                                    /Temporary chat|临时聊天|Your conversations won’t be saved|您的对话将不会被保存/.test(text);

                if (blockedParent.classList.contains('message') && isSystemNotice) {
                    return false; // 允许翻译引擎进入处理
                }

                return true; // 其他常规 message 依然屏蔽
            }

            // 2. [动态屏蔽]：构建页面 (Build) 思考时暂不翻译进度描述
            // 仅在 URL 包含 /app/apps 且标题内有加载器时屏蔽，防止翻译 "Refining..." 等过程文字
            if (window.location.pathname.includes('/app/apps')) {
                const buildTitle = parentElement.closest('.title');
                if (buildTitle && buildTitle.querySelector('ms-gradient-spinner')) {
                    return true;
                }
            }

            // 4. [其他逻辑]：跳过链接和 Overlay
            if (parentElement.matches('ms-prompt-link') || parentElement.closest('ms-prompt-link')) {
                return true;
            }

            const overlayPane = parentElement.closest('.cdk-overlay-pane');
            if (overlayPane) {
                const isMenu = overlayPane.querySelector('[role="menu"]') ||
                               overlayPane.querySelector('.mat-mdc-menu-panel') ||
                               parentElement.closest('.mat-mdc-menu-item');
                if (isMenu) return false;

                const isTooltip = overlayPane.querySelector('[role="tooltip"]') ||
                                  overlayPane.querySelector('.mat-mdc-tooltip-panel');
                if (isTooltip) {
                    if (globalState.isHoveringScrollbar ||
                        globalState.isHoveringHistoryItem ||
                        globalState.isHoveringBuildFileRow ||
                        globalState.isHoveringThinkingIndicator) {
                        return true;
                    }
                }
            }

            return false;
        }

        function isLikelyThoughtText(text) {
            if (!text) return false;
            const t = String(text).trim();
            if (t.length < 20) return false;

            const titleLike = /(Locating\s+and\s+contextualizing|Integrating\s+user\s+context|Offering\s+a\s+Chinese\s+Greeting|Formulating\s+the\s+Response)/i;
            if (titleLike.test(t)) return true;

            const hasThoughtKeywords = /\b(I'm|I am|I've|I have|I will|I'll|geographical|culturally|cite the sources|holiday|event detection|contextualizing|integrating|structuring)\b/i.test(t);
            const hasUIKeywords = /\b(Click|Button|Menu|Settings|Tokens?|API|Billing)\b/i.test(t);
            if (t.length >= 40 && hasThoughtKeywords && !hasUIKeywords) {
                return true;
            }

            return false;
        }

        // --- 区域标记 ---
        function tagNoTranslateAreas(ctx) {
            try {
                const root = ctx || document;

                const unconditionalSelectors = [
                    '.message:not(ms-toast .message)', // 禁止翻译控制台消息
                    '.message-text',
                    '.chat-content',
                    '.expanded-thoughts',
                    '.model-name',
                    '.model-title-text',
                    '.image-panel-content-image',
                    '.loaded-image.ng-star-inserted',
                    'pre.ascii-art-container',
                    '.material-symbols-outlined',
                    'a.prompt-link',
                    'td.cdk-column-name a.name-btn',
                    'td.cdk-column-name a.recent-row',
                    'td.cdk-column-description',
                    'ms-prompt-history a.prompt-link',
                    '.project-display-name',
                    '.project-id-text',
                    '.incident-title',
                    '.incident-update-description',
                    '.chips',
                    'span.type.build',
                    '.expanded-thoughts, .collapsed-thoughts',
                    'div.turn ms-cmark-node',
                    'ms-thought-chunk .mat-expansion-panel-body',
                    'ms-prompt-chunk > ms-text-chunk',
                    'pre', 'code', 'samp',
                    'textarea[aria-label*="JSON schema"]',
                    '.structured-output-editor',
                    'ms-structured-output-editor',
                    'td.cdk-column-lastModified a.recent-row',
                    'td.cdk-column-lastModified div.description',

                    // 屏蔽文件列表中的文件名
                    '.content-container .name',

                    // // 确保这些区域被主动打上 data-no-translate 标记
                    // '.prompt-type',
                    '.tooltip-overflow',
                    'ms-cmark-node',
                    '.user-input',
                    
                    // 【在这里添加】禁止翻译文件描述
                    '.file-description', 
                    
                    '.dae-settings-panel'
                ];

                unconditionalSelectors.forEach(selector => {
                    root.querySelectorAll(selector).forEach(el => {
                        // [增强版识别]：同时检测中英文关键字，确保无论翻译前后都能豁免
                        const text = el.textContent || "";
                        const isSystemNotice = el.querySelector('[callout-content-text]') || 
                                            /Temporary chat|临时聊天|Your conversations won’t be saved|您的对话将不会被保存/.test(text);

                        // 如果命中了“临时聊天”提示，强制解除屏蔽
                        if (el.classList.contains('message') && isSystemNotice) {
                            if (el.hasAttribute('data-no-translate')) {
                                el.removeAttribute('data-no-translate');
                            }
                            // 确保内部的所有子元素也不受标记干扰
                            el.querySelectorAll('*').forEach(child => child.removeAttribute('data-no-translate'));
                            return;
                        }

                        // 正常的屏蔽逻辑
                        if (!el.hasAttribute('data-no-translate')) {
                            el.setAttribute('data-no-translate', '1');
                        }
                    });
                });

                // URL检查规则配置
                const path = window.location.pathname;
                const isChatPage = () => path.startsWith('/app/prompts/') || path.startsWith('/prompts');
                const isLivePage = () => path.startsWith('/app/live') || path.startsWith('/live');
                const isExcludedPage = () => path.startsWith('/apps/drive') || path.startsWith('/apps/bundled');

                if (!isChatPage() && !isLivePage() && !isExcludedPage()) {
                    root.querySelectorAll('.chips-container button').forEach(el => {
                        if (!el.hasAttribute('data-no-translate')) {
                            el.setAttribute('data-no-translate', '1');
                        }
                    });
                }

                // 2. 条件性标记规则
                applyConditionalTaggingRules(root);

                // 强制修复被误伤的 app-card 标题
                root.querySelectorAll('.app-card .name[data-no-translate]').forEach(el => {
                    el.removeAttribute('data-no-translate');
                });

            } catch (_) {} // 函数结束
        }

        function applyConditionalTaggingRules(root) {
            // 规则 A: 智能处理 .page-title 容器
            root.querySelectorAll('.page-title').forEach((pageTitleEl) => {
                const breadcrumb = pageTitleEl.querySelector('.breadcrumb-button');
                const modeTitleEl = pageTitleEl.querySelector('.mode-title');
                const incognitoIndicator = pageTitleEl.querySelector('ms-incognito-mode-indicator');

                if (incognitoIndicator) return;

                // 检查标题内容
                const titleText = modeTitleEl ? modeTitleEl.textContent.trim() : '';
                const isTargetTitle = ['Chat prompt', 'Playground'].includes(titleText);

                // 如果是默认标题（如 Playground），必须强制移除父级屏蔽，否则脚本无法进入内部进行替换
                if (isTargetTitle) {
                    if (pageTitleEl.hasAttribute('data-no-translate')) {
                        pageTitleEl.removeAttribute('data-no-translate');
                    }
                    return; // 直接跳过后续屏蔽逻辑
                }

                // 原有逻辑：保护用户自定义的标题
                if (breadcrumb && modeTitleEl && !modeTitleEl.hasAttribute('data-no-translate')) {
                    modeTitleEl.setAttribute('data-no-translate', '1');
                } else if (!breadcrumb && !pageTitleEl.hasAttribute('data-no-translate')) {
                    pageTitleEl.setAttribute('data-no-translate', '1');
                }
            });

            // 规则 B: 仅屏蔽反馈弹窗中的对话原文
            const dialogRoot = root.matches('ms-model-feedback-dialog') ? root :
                             root.querySelector('ms-model-feedback-dialog');
            if (dialogRoot) {
                dialogRoot.querySelectorAll('div.v3-font-label, .response-content').forEach(el => {
                    if (!el.hasAttribute('data-no-translate')) {
                        el.setAttribute('data-no-translate', '1');
                    }
                });
            }

            // 规则 C: 屏蔽默认的对话标题
            root.querySelectorAll('.mode-title').forEach(el => {
                const text = el.textContent.trim();
                // 定义允许处理的默认标题列表
                const isDefaultTitle = ['Chat prompt', 'Playground'].includes(text);

                if (!isDefaultTitle) {
                    // 如果不是默认标题，打上不翻译标记
                    if (!el.hasAttribute('data-no-translate')) {
                        el.setAttribute('data-no-translate', '1');
                    }
                } else {
                    // 如果变成了默认标题（如 Playground），必须移除标记，否则 handleSpecialCases 无法生效
                    if (el.hasAttribute('data-no-translate')) {
                        el.removeAttribute('data-no-translate');
                    }
                }
            });

            // 规则 D: 条件性地标记 .applet-tag
            root.querySelectorAll('.applet-tag').forEach(tag => {
                const text = tag.textContent.trim();
                if (!BuildPageTranslations.hasOwnProperty(text) && !tag.hasAttribute('data-no-translate')) {
                    tag.setAttribute('data-no-translate', '1');
                }
            });

            // 规则 E: 条件性地标记 mat-select-trigger
            const safeToTranslateTriggers = ["Write my own instructions"];
            root.querySelectorAll('mat-select-trigger').forEach(trigger => {
                const text = trigger.textContent.trim();
                if (!safeToTranslateTriggers.includes(text) && !trigger.hasAttribute('data-no-translate')) {
                    trigger.setAttribute('data-no-translate', '1');
                }
            });

            // 规则 F: 强制不翻译所有 "Get Code" 面板的完整标题
            root.querySelectorAll('mat-panel-title').forEach(panelTitle => {
                const icon = panelTitle.querySelector('.title-icon');
                if (icon && icon.textContent.trim() === 'code' && !panelTitle.hasAttribute('data-no-translate')) {
                    panelTitle.setAttribute('data-no-translate', '1');
                }
            });

            // 规则 G: 条件性地标记模型类别筛选按钮
            // 1. 将 '已收藏' 加入白名单
            // 2. 使用非破坏性的 TextNode 修改方式，防止破坏 DOM 结构导致 '全部' 状态无法切回
            const safeToTranslateChips = new Set(['精选', 'Featured', '全部', 'All', 'Starred', '收藏', 'Saved', '已保存', '已收藏']);
            root.querySelectorAll('button[variant="filter-chip"][data-test-category-button]').forEach(chip => {
                const text = chip.textContent.trim();
                
                // 1. 白名单放行逻辑
                if (safeToTranslateChips.has(text) && chip.hasAttribute('data-no-translate')) {
                    chip.removeAttribute('data-no-translate');
                } else if (!safeToTranslateChips.has(text) && !chip.hasAttribute('data-no-translate')) {
                    chip.setAttribute('data-no-translate', '1');
                }
                
                // 2. 特殊文本修正：
                // 如果文本是 "Starred" (原文) 或 "已收藏" (主字典翻译结果)
                // 统一强制修改为短语 "收藏"
                if (text === 'Starred' || text === '已收藏') {
                    // 定义递归查找并修改函数
                    const walkAndReplace = (node) => {
                        node.childNodes.forEach(child => {
                            if (child.nodeType === Node.TEXT_NODE) {
                                const val = child.nodeValue.trim();
                                // 精确匹配并修改值，保留节点引用
                                if (val === 'Starred' || val === '已收藏') {
                                    child.nodeValue = '收藏';
                                }
                            } else if (child.nodeType === Node.ELEMENT_NODE) {
                                walkAndReplace(child);
                            }
                        });
                    };
                    // 执行非破坏性替换
                    walkAndReplace(chip);
                }
            });
            // 规则 H: 屏蔽模型选择卡片中的标题 (如 Gemini 2.5 Pro Preview TTS)
            root.querySelectorAll('span.title').forEach(el => {
                const text = el.textContent.trim();
                // 如果标题包含 "Gemini"，则视为模型名称，不翻译
                if ((text.includes('Gemini') || text.includes('Nano')) && !el.hasAttribute('data-no-translate')) {
                    el.setAttribute('data-no-translate', '1');
                }
            });
            // =========== [更新版] 规则 I & J: 智能屏蔽文件名，但放行系统关键词 ===========

            // 定义白名单：这些词即使出现在无标签区域，也允许翻译
            // 注意："+ Create new instruction" 中间可能有 &nbsp;，所以我们主要匹配关键词
            const ALLOWED_SYSTEM_TEXTS = [
                "Create new instruction",
                "string", "number", "integer", "boolean", "object", "enum" // 标准数据类型
            ];

            // 辅助函数：检查文本是否包含白名单关键词
            const isSystemText = (element) => {
                const text = element.textContent || "";
                // 只要包含关键词（忽略前后的 + 号或空格），就视为系统文本
                return ALLOWED_SYSTEM_TEXTS.some(key => text.includes(key));
            };

            // 规则 I (更新): 智能屏蔽顶部文件名输入框
            root.querySelectorAll('.mdc-text-field--no-label').forEach(wrapper => {
                const select = wrapper.querySelector('mat-select');
                // 逻辑：
                // 1. 必须是 mat-select
                // 2. 没有 aria-label (如果有 label，如分辨率，本来就允许翻译)
                // 3. 内容不包含系统关键词 (如 Create new instruction)
                // 满足以上 3 点，才认为是“用户自定义文件名”，进行屏蔽
                if (select && !select.hasAttribute('aria-label') && !isSystemText(select)) {
                    if (!wrapper.hasAttribute('data-no-translate')) {
                        wrapper.setAttribute('data-no-translate', '1');
                    }
                }
            });

            // 规则 J (更新): 智能屏蔽无标签的下拉菜单选项
            root.querySelectorAll('.mat-mdc-option').forEach(option => {
                const panel = option.closest('[role="listbox"]');
                // 逻辑同上：无 label 且 不是系统关键词 -> 屏蔽
                if (panel && !panel.hasAttribute('aria-label') && !isSystemText(option)) {
                    const textSpan = option.querySelector('.mdc-list-item__primary-text');
                    if (textSpan && !textSpan.hasAttribute('data-no-translate')) {
                        textSpan.setAttribute('data-no-translate', '1');
                    }
                }
            });

            // 规则 K: 智能屏蔽文件预览弹窗的标题 (防止文件名被翻译)
            // 逻辑：如果弹窗头部包含下载按钮，说明这是文件预览窗口，其标题通常是文件名，应屏蔽。
            root.querySelectorAll('header.shared-dialog-header').forEach(header => {
                if (header.querySelector('button[iconname="download"]') || header.querySelector('.download-button')) {
                    const textEl = header.querySelector('.text');
                    if (textEl && !textEl.hasAttribute('data-no-translate')) {
                        textEl.setAttribute('data-no-translate', '1');
                    }
                }
            });
        }

        // --- 文本节点翻译 ---
        function translateTextContent(node) {
            if (!isTranslationEnabled) return;

            const parent = node.parentElement;

            // 优先处理固定按钮 tooltip
            if (translatePinTooltip(node)) {
                return;
            }

            if (parent && parent.matches('p.thought-collapsed-text')) {
                handleThoughtCollapsedText(node);
                return;
            }

            if (shouldSkipNode(node) || isLikelyThoughtText(node.nodeValue)) return;

            const before = node.nodeValue;
            const match = before.match(REGEX_PATTERNS.dynamicText);
            if (match && parent) {
                handleDynamicText(node, match, parent);
                return;
            }

            if (handleSpecialCases(node, parent, before)) return;

            const after = translationEngine.translateString(before);
            if (after !== before) {
                node.nodeValue = after;
            }
        }

        function handleThoughtCollapsedText(node) {
            const text = node.nodeValue.trim();
            let newText = null;
            if (text === "Expand to view model thoughts") {
                newText = "\u00A0\u00A0展开";
            } else if (text === "Collapse to hide model thoughts") {
                newText = "\u00A0\u00A0收起";
            }
            if (newText && node.nodeValue !== newText) {
                node.nodeValue = newText;
            }
        }

        function handleDynamicText(node, match, parent) {
            const staticPart = match[1];
            const dynamicPart = match[2];
            const translatedStaticPart = translationEngine.translateString(staticPart);

            if (translatedStaticPart !== staticPart) {
                node.nodeValue = translatedStaticPart + dynamicPart;
                parent.dataset.dynamicTranslated = 'true';
                parent.dataset.translatedPrefix = translatedStaticPart;
            }
        }

        function handleSpecialCases(node, parent, before) {
            const trimmedBefore = before.trim();

            // === 针对 .prompt-type 的特定翻译逻辑 ===
            if (parent && parent.matches('.prompt-type')) {
                const typeMap = {
                    "Chat prompt": "文本",
                    "Imagen prompt": "图像",
                    "Unknown prompt": "未知"
                };
                
                if (typeMap[trimmedBefore]) {
                    node.nodeValue = typeMap[trimmedBefore];
                }
                
                // 无论是否匹配到，都返回 true。
                // 这会告诉脚本：“这个节点我已经处理完了（或者决定不处理），不要再用主字典去匹配它了”。
                return true; 
            }

            // 处理动态复制提示 (如: Copied models/xxx to clipboard)
            const copyMatch = trimmedBefore.match(/^Copied\s+(.+)\s+to\s+clipboard$/);
            if (copyMatch) {
                // copyMatch[1] 捕获的是模型名称
                node.nodeValue = `已将 ${copyMatch[1]} 复制到剪贴板`;
                return true;
            }

            // ================== 【在此处添加以下代码】 ==================
            // 处理模型选择提示 (如: Selected Gemini 2.5 Pro Preview TTS)
            // 逻辑：捕获 Selected 后面的所有内容作为模型名，强制不翻译模型名
            const selectedMatch = trimmedBefore.match(/^Selected\s+(.+)$/);
            if (selectedMatch) {
                // selectedMatch[1] 是模型名称
                // 结果： "已选择 Gemini 2.5 Pro Preview TTS"
                node.nodeValue = `已选择 ${selectedMatch[1]}`;
                return true; // 返回 true 阻止后续翻译引擎处理
            }
            // ==========================================================

            if (parent && parent.matches('a.playground-link') &&
                trimmedBefore === 'Playground') {
                node.nodeValue = '聊天';
                return true;
            }

            if (parent && parent.matches('h1.mode-title') &&
                trimmedBefore === 'Playground') {
                // node.nodeValue = 'Chat prompt';
                node.nodeValue = '聊天';
                return true;
            }

            if (parent && parent.matches('h3.thinking-group-title') &&
                (trimmedBefore === 'Thinking' || trimmedBefore === '深度思考')) {
                node.nodeValue = '思考';
                return true;
            }

            if (trimmedBefore.startsWith("Google AI Studio uses cookies")) {
                node.nodeValue = "Google AI Studio 使用 Google 的 Cookie 来提供和增强其服务质量，并分析流量。";
                return true;
            }

            if (parent && parent.matches('.model-carousel-row-detail')) {
                const mixedRegex = /(\d{1,2})月\s+(\d{4})/;
                const mixedMatch = trimmedBefore.match(mixedRegex);
                if (mixedMatch) {
                    node.nodeValue = trimmedBefore.replace(mixedRegex, `${mixedMatch[2]} 年 ${mixedMatch[1]} 月`);
                    return true;
                }

                const enRegex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b/i;
                const enMatch = trimmedBefore.match(enRegex);
                if (enMatch) {
                    const monthMap = {
                        'Jan': '1', 'Feb': '2', 'Mar': '3', 'Apr': '4', 'May': '5', 'Jun': '6',
                        'Jul': '7', 'Aug': '8', 'Sep': '9', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                    };
                    const monthKey = enMatch[1].substring(0, 3);
                    const monthNum = monthMap[monthKey] || enMatch[1];
                    node.nodeValue = trimmedBefore.replace(enRegex, `${enMatch[2]} 年 ${monthNum} 月`);
                    return true;
                }
            }
            return false;
        }

        // --- 元素属性翻译 ---
        function translateElementAttributes(element) {
            if (shouldSkipNode(element)) return;

            for (const attr of element.attributes) {
                const attrName = attr.name;
                const before = attr.value;

                // 只翻译白名单内的属性 (如 title, aria-label, placeholder 等)
                // 防止翻译 class, style, accept, data-test-* 等功能性属性
                if (!TRANSLATE_ATTRIBUTES.has(attrName)) {
                    continue;
                }

                if (!before ||
                    (attrName === 'src' && before.startsWith('data:image/')) ||
                    (element.tagName === 'INPUT' && attrName === 'type')) {
                    continue;
                }

                const after = translationEngine.translateString(before);
                if (after !== before) {
                    element.setAttribute(attrName, after);
                }
            }

            const describedById = element.getAttribute('aria-describedby');
            if (describedById) {
                const tipEl = document.getElementById(describedById);
                if (tipEl) walkAndTranslate(tipEl);
            }
        }

        // --- 初始输入框翻译 ---
        function createInitialInputTranslator() {
            let delay = 0;
            const delayIncrement = 30;

            return (element) => {
                if (element.tagName !== 'TEXTAREA' || !element.value) return;

                const originalValue = element.value;
                const trimmedValue = originalValue.trim();

                if (inputContentTranslations[trimmedValue]) {
                    const translatedValue = inputContentTranslations[trimmedValue];
                    if (originalValue !== translatedValue) {
                        setTimeout(() => {
                            element.value = translatedValue;
                            element.dispatchEvent(new Event('input', { bubbles: true }));
                            element.dispatchEvent(new Event('change', { bubbles: true }));
                        }, delay);
                        delay += delayIncrement;
                    }
                }
            };
        }

        const translateInitialInputValueStaggered = createInitialInputTranslator();

        // --- 处理复杂节点翻译 ---
        function translateComplexNode(element) {
            if (element.matches('p.thought-collapsed-text')) return false;

            if (!['P', 'DIV', 'SPAN', 'A', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
                return false;
            }

            const HARD_BREAK_TAGS = new Set(['MS-CODE-BLOCK', 'DIV', 'PRE', 'UL', 'OL', 'P', 'H1', 'H2', 'H3']);
            let keyParts = [];
            let textNodes = [];
            let translatedSomething = false;

            const processGroup = () => {
                if (textNodes.length === 0) return;

                const generatedKey = keyParts.join('').replace(/\s+/g, ' ').trim();
                const translationValue = translations[generatedKey];

                if (translationValue === "null") {
                    translatedSomething = true;
                    return;
                }

                if (translationValue) {
                    const translationParts = translationValue.split('\\skip\\');
                    if (translationParts.length === textNodes.length) {
                        for (let i = 0; i < textNodes.length; i++) {
                            if (textNodes[i].nodeValue !== translationParts[i]) {
                                textNodes[i].nodeValue = translationParts[i];
                            }
                        }
                        translatedSomething = true;
                    }
                }
                keyParts = [];
                textNodes = [];
            };

            for (const child of element.childNodes) {
                if (child.nodeType === Node.ELEMENT_NODE && HARD_BREAK_TAGS.has(child.tagName)) {
                    processGroup();
                    continue;
                }

                if (child.nodeType === Node.TEXT_NODE) {
                    const text = child.nodeValue.trim();
                    if (text) {
                        keyParts.push(child.nodeValue);
                        textNodes.push(child);
                    }
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    if (keyParts.length > 0 && keyParts[keyParts.length - 1] !== '\\skip\\') {
                        keyParts.push('\\skip\\');
                    }
                }
            }

            processGroup();
            return translatedSomething;
        }

        // --- 主遍历函数 ---
        function walkAndTranslate(rootNode) {
            if (!isTranslationEnabled) return;

            // 严格检查：如果是 Overlay Pane，但不是菜单，且处于悬停干扰状态，则退出
            // 注意：这里我们允许 Overlay Pane 进入后续的 shouldSkipNode 详细检查
            // 只有当它是 Tooltip 且被干扰时，shouldSkipNode 才会返回 true

            if (!rootNode || shouldSkipNode(rootNode)) {
                return;
            }

            tagNoTranslateAreas(rootNode);

            const walker = document.createTreeWalker(
                rootNode,
                NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
                null,
                false
            );
            let node;

            while (node = walker.nextNode()) {
                if (shouldSkipNode(node)) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        let sibling = node.lastChild;
                        if (sibling) walker.currentNode = sibling;
                    }
                    continue;
                }

                if (node.nodeType === Node.ELEMENT_NODE) {
                    const complexTranslated = translateComplexNode(node);
                    if (complexTranslated) {
                        let sibling = node.lastChild;
                        if (sibling) walker.currentNode = sibling;
                        continue;
                    }

                    translateElementAttributes(node);
                    translateInitialInputValueStaggered(node);
                } else if (node.nodeType === Node.TEXT_NODE) {
                    translateTextContent(node);
                }
            }
        }

        return {
            walkAndTranslate,
            translateElementAttributes,
            translateTextContent,
            translateComplexNode,
            translatePinTooltip
        };
    })();

    // =========================================================================
    // 补丁函数
    // =========================================================================

    const patches = (function() {
        function patchCodeBlockTitles(rootNode) {
            const panelTitles = rootNode.querySelectorAll('mat-panel-title');
            for (const panelTitle of panelTitles) {
                const icon = panelTitle.querySelector('.title-icon');
                if (!icon || icon.textContent.trim() !== 'code') continue;

                const textSpan = panelTitle.querySelector('span:not(.title-icon)');
                if (textSpan && textSpan.textContent.trim() === 'Bash') {
                    textSpan.textContent = '命令行';
                    if (panelTitle.hasAttribute('data-no-translate')) {
                        panelTitle.removeAttribute('data-no-translate');
                    }
                }
            }
        }

        function forceTranslateSearchSuggestions(rootNode) {
            rootNode.querySelectorAll('ms-search-entry-point').forEach(moduleEl => {
                const titleEl = moduleEl.querySelector('h5.search-entry-container-title');
                if (titleEl && titleEl.firstChild && titleEl.firstChild.nodeType === Node.TEXT_NODE) {
                    const textNode = titleEl.firstChild;
                    const before = textNode.nodeValue;
                    const after = translationEngine.translateString(before);
                    if (before !== after) {
                        textNode.nodeValue = after;
                    }
                }

                const descEl = moduleEl.querySelector('div.search-entry-container-description');
                if (descEl) {
                    descEl.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) {
                            const before = child.nodeValue;
                            const after = translationEngine.translateString(before);
                            if (before !== after) {
                                child.nodeValue = after;
                            }
                        } else if (child.nodeName === 'A' && child.firstChild &&
                                   child.firstChild.nodeType === Node.TEXT_NODE) {
                            const linkTextNode = child.firstChild;
                            const before = linkTextNode.nodeValue;
                            const after = translationEngine.translateString(before);
                            if (before !== after) {
                                linkTextNode.nodeValue = after;
                            }
                        }
                    });
                }
            });

            rootNode.querySelectorAll('.search-sources-title').forEach(titleEl => {
                const textNode = titleEl.firstChild;
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                    const before = textNode.nodeValue;
                    const after = translationEngine.translateString(before);
                    if (before !== after) {
                        textNode.nodeValue = after;
                    }
                }
            });
        }

        function applyTranslationPatches(rootNode) {
            if (rootNode.nodeType !== Node.ELEMENT_NODE) return;

            patchCodeBlockTitles(rootNode);
            forceTranslateSearchSuggestions(rootNode);
        }

        return { applyTranslationPatches };
    })();

    // =========================================================================
    // 页面交互与UI增强
    // =========================================================================

    const uiEnhancer = (function() {
        // --- 对话回合UI刷新 ---
        async function refreshAllTurnsUI() {
            console.log('[Gemini 汉化增强] 开始刷新所有对话回合...');

            const firstTurn = document.querySelector(SELECTORS.TURN);
            if (!firstTurn) {
                console.log('[Gemini 汉化增强] 未找到任何对话回合，操作取消。');
                return;
            }

            const originalY = window.scrollY || 0;
            const scrollContainer = utils.findScrollableAncestor(firstTurn) || document.documentElement;

            // 1. 滚动到顶部
            scrollContainer.scrollTop = 0;
            window.scrollTo({ top: 0, behavior: 'auto' });
            await utils.sleep(REFRESH_CONFIG.initialWait);

            // 2. 逐屏滚动并处理
            let lastScrollTop = -1;
            while (lastScrollTop < scrollContainer.scrollTop) {
                lastScrollTop = scrollContainer.scrollTop;
                await processVisibleTurns();
                scrollContainer.scrollTop += (scrollContainer.clientHeight * 0.9);
                await utils.sleep(REFRESH_CONFIG.scrollWait);
                if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 10) {
                    break;
                }
            }

            // 3. 处理最后一屏
            await processVisibleTurns();

            // 4. 恢复原始滚动位置
            window.scrollTo({ top: originalY, behavior: 'auto' });
            console.log('[Gemini 汉化增强] 全量刷新完成。');
        }

        async function processVisibleTurns() {
            const turns = document.querySelectorAll(SELECTORS.TURN);
            for (const turn of turns) {
                try {
                    const editButton = turn.querySelector('.toggle-edit-button');
                    const isEditable = editButton?.querySelector('span.material-symbols-outlined')?.textContent.trim() === 'edit';
                    if (isEditable) {
                        editButton.click();
                        await utils.sleep(REFRESH_CONFIG.clickDelay);
                        turn.querySelector('.toggle-edit-button')?.click();
                        await utils.sleep(REFRESH_CONFIG.processDelay);
                    }
                } catch (error) {
                    console.error('[Gemini 汉化增强] 处理单个回合时出错:', error);
                }
            }
        }

        // --- UI 按钮管理 ---
        function ensureRefreshButtonExists() {
            return; // [临时搁置] 移除此行可恢复按钮显示

            if (document.getElementById('gemini-ui-refresher-button')) return;
            const toolbarRight = document.querySelector('ms-toolbar .toolbar-right');
            if (!toolbarRight) return;

            console.log('[Gemini 汉化增强] 检测到工具栏，创建刷新UI按钮...');
            const button = document.createElement('button');
            button.id = 'gemini-ui-refresher-button';
            button.title = '刷新对话UI以应用对话回合的翻译';
            button.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon ng-star-inserted';
            button.setAttribute('aria-label', '刷新所有对话回合的UI');
            button.addEventListener('click', refreshAllTurnsUI);

            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-symbols-outlined notranslate ms-button-icon-symbol ng-star-inserted';
            iconSpan.setAttribute('aria-hidden', 'true');
            iconSpan.textContent = 'edit';
            button.appendChild(iconSpan);

            toolbarRight.insertBefore(button, toolbarRight.firstChild);
        }

        // --- 样式注入 ---
        function injectGlobalStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .mat-mdc-tooltip-surface {
                    text-align: left !important;
                    white-space: pre-line !important;
                }

                /* 移动端徽章样式优化：减小字号并禁止换行 */
                @media (max-width: 768px) {
                    ms-model-carousel .badge {
                        font-size: 11px !important;     /* 调小字号 */
                        white-space: nowrap !important; /* 禁止换行 */
                    }
                }
            `;
            document.head.appendChild(style);
        }

        return {
            refreshAllTurnsUI,
            ensureRefreshButtonExists,
            injectGlobalStyles
        };
    })();

    // =========================================================================
    // 动态内容监听与处理
    // =========================================================================

    const contentMonitor = (function() {
        // --- Mutation 处理 ---
        function processMutations() {
            globalState.pendingMutations = false;
            const nodesToProcess = Array.from(globalState.mutationQueue);
            globalState.mutationQueue.clear();

            for (const node of nodesToProcess) {
                if (document.body.contains(node)) {
                    domTranslator.walkAndTranslate(node);
                    patches.applyTranslationPatches(node);
                }
            }
        }

        function handleDynamicNode(node) {
            const parent = node.parentElement;
            if (!parent) return;

            const prefix = parent.dataset.translatedPrefix;
            const currentValue = node.nodeValue;
            if (!prefix || currentValue.startsWith(prefix)) return;

            const match = currentValue.match(REGEX_PATTERNS.dynamicText);
            if (match) {
                const dynamicPart = match[2];
                const newValue = prefix + dynamicPart;
                if (node.nodeValue !== newValue) node.nodeValue = newValue;
            }
        }

        // 创建DOM变化观察器
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // 1. 动态文本变化处理
                if (mutation.type === 'characterData' &&
                    mutation.target.parentElement?.dataset.dynamicTranslated === 'true') {
                    handleDynamicNode(mutation.target);
                    continue;
                }

                // 2. 节点添加处理 (childList)
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            
                            // ============================================================
                            // 弹窗自动切换至 "收藏" 标签 (无视 Alt+A 开关)
                            // ============================================================
                            // 检测是否是对话框层 (覆盖 mat-dialog-container 或 cdk-overlay-pane)
                            if (node.matches('.cdk-overlay-pane') || node.querySelector('mat-dialog-container')) {
                                // 延时执行，确保弹窗内部 DOM (如按钮) 已完全渲染
                                setTimeout(() => {
                                    const container = node.matches('.cdk-overlay-pane') ? node : node; // 确保在当前容器内查找
                                    
                                    // 查找目标按钮：属性为 filter-chip 且文本符合要求
                                    const starButton = Array.from(container.querySelectorAll('button[variant="filter-chip"]'))
                                        .find(btn => {
                                            const t = btn.textContent.trim();
                                            return t === 'Starred' || t === '已收藏' || t === '收藏';
                                        });

                                    if (starButton) {
                                        // 检查当前是否已经是激活状态
                                        // Google 使用 'ms-button-active' 类或 'aria-selected="true"'
                                        const isActive = starButton.classList.contains('ms-button-active') || 
                                                         starButton.getAttribute('aria-selected') === 'true';
                                        
                                        if (!isActive) {
                                            console.log('[Gemini 增强] 检测到模型弹窗，自动切换至“收藏”标签');
                                            starButton.click();
                                        }
                                    }
                                }, 20); // 20ms 延时通常足够等待渲染
                            }
                            // ============================================================

                            // 原有的 Tooltip 标记逻辑
                            if (node.matches('.cdk-overlay-pane .mat-mdc-tooltip-panel') ||
                                node.querySelector('.mat-mdc-tooltip-panel')) {
                                if (globalState.isHoveringScrollbar ||
                                    globalState.isHoveringHistoryItem ||
                                    (globalState.isHoveringHistoryItem && node.classList.contains('mat-mdc-tooltip-panel-right')) ||
                                    globalState.isHoveringBuildFileRow ||
                                    globalState.isHoveringThinkingIndicator) {
                                    const panel = node.matches('.mat-mdc-tooltip-panel') ? node : node.querySelector('.mat-mdc-tooltip-panel');
                                    if (panel) {
                                        panel.setAttribute('data-no-translate', '1');
                                        panel.querySelector('.mat-mdc-tooltip-surface')?.setAttribute('data-no-translate', '1');
                                    }
                                }
                            }
                        }
                    }
                }

                // 3. 将变动加入汉化队列
                let targetElement = null;
                switch (mutation.type) {
                    case 'childList': targetElement = mutation.target; break;
                    case 'attributes': targetElement = mutation.target; break;
                    case 'characterData': targetElement = mutation.target.parentElement; break;
                }

                if (targetElement && document.body.contains(targetElement)) {
                    globalState.mutationQueue.add(targetElement);
                }
            }
            
            // 4. 触发批量处理
            if (globalState.mutationQueue.size > 0 && !globalState.pendingMutations) {
                globalState.pendingMutations = true;
                requestAnimationFrame(() => {
                    processMutations();
                    uiEnhancer.ensureRefreshButtonExists();
                });
            } else {
                uiEnhancer.ensureRefreshButtonExists();
            }
        });

        function startMonitoring() {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });
        }

        return { startMonitoring };
    })();

    // =========================================================================
    // SPA 路由与事件处理
    // =========================================================================

    const spaHandler = (function() {
        // --- 鼠标事件处理 ---
        function setupMouseEventHandlers() {
            // 扩展检测范围
            const scrollbarSelectors = [
                'ms-prompt-scrollbar',
                'ms-prompt-scrollbar button.mat-mdc-tooltip-trigger',
                'ms-prompt-scrollbar .prompt-scrollbar-item'
            ].join(', ');

            document.addEventListener('mouseover', (e) => {
                // 1. 滚动条悬停检测
                if (e.target.closest('ms-prompt-scrollbar')) {
                    if (globalState.scrollbarLeaveTimer) clearTimeout(globalState.scrollbarLeaveTimer);
                    globalState.isHoveringScrollbar = true;
                    markActiveTooltipIfNeeded();
                }

                // 2. 历史记录项（排除内部功能按钮）
                // 增加对 .prompt-link-wrapper 的检测
                if ((e.target.closest('ms-prompt-history li.mat-mdc-tooltip-trigger') ||
                     e.target.closest('.prompt-link-wrapper')) &&
                    !e.target.closest('button[variant="icon-borderless"]')) {
                    if (globalState.historyItemLeaveTimer) clearTimeout(globalState.historyItemLeaveTimer);
                    globalState.isHoveringHistoryItem = true;
                }

                // 3. Build 文件行
                if (e.target.closest('ms-console-generation-table-row, .generation-table-row')) {
                    if (globalState.buildFileRowLeaveTimer) clearTimeout(globalState.buildFileRowLeaveTimer);
                    globalState.isHoveringBuildFileRow = true;
                }

                // 4. 思考指示器 (增强版：同时检测 .thinking 类和内部包含 spinner 的加载状态)
                // 增加 trigger.querySelector('mat-spinner') 以覆盖"正在分析..."等构建状态
                const thinkingTrigger = e.target.closest('.mat-mdc-tooltip-trigger');
                if (thinkingTrigger && (thinkingTrigger.classList.contains('thinking') || thinkingTrigger.querySelector('mat-spinner'))) {
                    if (globalState.thinkingIndicatorLeaveTimer) clearTimeout(globalState.thinkingIndicatorLeaveTimer);
                    globalState.isHoveringThinkingIndicator = true;
                    markActiveTooltipIfNeeded(); // [关键] 立即执行标记，防止气泡弹出瞬间被翻译
                }
            });

            document.addEventListener('mouseout', (e) => {
                if (e.target.closest('ms-prompt-scrollbar')) {
                    globalState.isHoveringScrollbar = false;
                }

                // 增加对 .prompt-link-wrapper 的检测
                if (e.target.closest('ms-prompt-history li.mat-mdc-tooltip-trigger') ||
                    e.target.closest('.prompt-link-wrapper')) {
                    globalState.isHoveringHistoryItem = false;
                }

                if (e.target.closest('ms-console-generation-table-row, .generation-table-row')) {
                    globalState.isHoveringBuildFileRow = false;
                }

                if (e.target.closest('.mat-mdc-tooltip-trigger.thinking')) {
                    globalState.isHoveringThinkingIndicator = false;
                }
            });

            // 强制状态重置机制
            // 解决点击"清空"或发送消息后，因DOM元素被移除导致 mouseout 无法触发，
            // 进而导致 tooltip 翻译锁死的问题。
            const resetHoverStates = () => {
                globalState.isHoveringScrollbar = false;
                globalState.isHoveringHistoryItem = false;
                globalState.isHoveringBuildFileRow = false;
                globalState.isHoveringThinkingIndicator = false;
            };

            // 监听点击事件 (捕获阶段，确保在 stopPropagation 之前触发)
            document.addEventListener('click', () => {
                setTimeout(resetHoverStates, 200);
            }, true);

            // 监听回车键 (处理发送消息的情况)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    setTimeout(resetHoverStates, 200);
                }
            }, true);
        }

        // === 主动标记当前激活的 tooltip ===
        function markActiveTooltipIfNeeded() {
            if (!globalState.isHoveringScrollbar &&
                !globalState.isHoveringHistoryItem &&
                !globalState.isHoveringBuildFileRow &&
                !globalState.isHoveringThinkingIndicator) {
                return;
            }

            // 查找当前可见的 tooltip panel（Material 使用 .mat-mdc-tooltip-panel）
            const activeTooltip = document.querySelector('.cdk-overlay-pane .mat-mdc-tooltip-panel');
            if (activeTooltip && !activeTooltip.hasAttribute('data-no-translate')) {
                activeTooltip.setAttribute('data-no-translate', '1');
                // 同时标记内部 surface，防止后续遍历
                activeTooltip.querySelector('.mat-mdc-tooltip-surface')?.setAttribute('data-no-translate', '1');
            }
        }

        // --- SPA 路由处理 ---
        function installLocationChangeHook() {
            if (window.__hanhuaLocationHookInstalled) return;
            window.__hanhuaLocationHookInstalled = true;

            const waitForPageReadyAndRefresh = () => {
                if (globalState.autoRefresh.isWatching) return;
                globalState.autoRefresh.isWatching = true;

                let attempts = 0;
                const maxAttempts = 50;
                const interval = setInterval(() => {
                    const isReady = !document.querySelector('ms-progress-bar') && document.querySelector(SELECTORS.TURN);
                    if (isReady) {
                        clearInterval(interval);
                        globalState.autoRefresh.isWatching = false;
                        globalState.autoRefresh.hasRefreshedThisSession = true;
                        console.log('[Gemini 汉化增强] 页面已就绪，自动刷新UI...');
                        uiEnhancer.refreshAllTurnsUI();
                    } else if (++attempts > maxAttempts) {
                        clearInterval(interval);
                        globalState.autoRefresh.isWatching = false;
                        console.log('[Gemini 汉化增强] 自动刷新等待超时。');
                    }
                }, 200);
            };

            const handleLocationChange = () => {
                setTimeout(() => {
                    const specificPromptPaths = [
                        '/prompts/panda-to-archaeologist',
                        '/prompts/ramen-recipe-instructions',
                    ];
                    const isOnSpecificPage = specificPromptPaths.includes(window.location.pathname);

                    if (isOnSpecificPage && !globalState.autoRefresh.hasRefreshedThisSession) {
                        console.log('[Gemini 汉化增强] 进入特定对话页面，准备自动刷新...');
                        waitForPageReadyAndRefresh();
                    } else if (!isOnSpecificPage) {
                        globalState.autoRefresh.hasRefreshedThisSession = false;
                    }

                    domTranslator.walkAndTranslate(document.body);
                    uiEnhancer.ensureRefreshButtonExists();
                }, 100);
            };

            const wrap = (type) => {
                const orig = history[type];
                return function() {
                    const ret = orig.apply(this, arguments);
                    handleLocationChange();
                    return ret;
                };
            };
            history.pushState = wrap('pushState');
            history.replaceState = wrap('replaceState');
            window.addEventListener('popstate', handleLocationChange);
        }

        function initialize() {
            setupMouseEventHandlers();
            installLocationChangeHook();
        }

        return { initialize };
    })();

    // =========================================================================
    // 初始化
    // =========================================================================

    function initialize() {
        console.log('[Gemini 汉化增强] 脚本启动，开始首次全页翻译...');
        loadTranslationState(); // 加载保存的状态
        
        // 初始化油猴菜单
        registerMenuCommands(); 

        // 应用原生函数补丁
        nativePatches.applyAllPatches();

        // 初始翻译
        domTranslator.walkAndTranslate(document.body);
        uiEnhancer.ensureRefreshButtonExists();

        // 启动观察器
        contentMonitor.startMonitoring();

        // 安装各种钩子
        spaHandler.initialize();
        uiEnhancer.injectGlobalStyles();

        // 延迟扫描处理SPA加载问题
        setTimeout(() => {
            console.log('[Gemini 汉化增强] 执行第二次延迟扫描，修正SPA加载问题...');
            domTranslator.walkAndTranslate(document.body);
        }, 10);
        setTimeout(() => {
            console.log('[Gemini 汉化增强] 执行第三次延迟扫描，修正SPA加载问题...');
            walkAndTranslate(document.body);
        }, 500);
        setTimeout(() => {
            console.log('[Gemini 汉化增强] 执行第四次延迟扫描，修正SPA加载问题...');
            walkAndTranslate(document.body);
        }, 1200);
    }

    // 注册快捷键 Alt+A
    document.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            toggleTranslation();
        }
    });

    // 启动脚本
    initialize(); // 瞬间启动，无延迟
    setTimeout(initialize, 500); // 延迟0.5秒再次检查状态

})();