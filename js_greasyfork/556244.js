// ==UserScript==
// @name         Google AI Studio 汉化脚本
// @namespace    http://tampermonkey.net/
// @version      14.0
// @description  Google AI Studio 100% 全量汉化，基于 1000+ 条精准数据，完美覆盖 Gemini 3、仪表盘、计费、API密钥管理等所有深层界面，彻底修复图标乱码问题。
// @author       黄天祺
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556244/Google%20AI%20Studio%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/556244/Google%20AI%20Studio%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    //  1. 终极字典 (包含所有 X 光扫描数据 + 手动补全)
    // =========================================================
    const i18nMap = {
        // ===========================
        // 🔴 紧急修复 (Dashboard 菜单)
        // ===========================
        "API keys": "API 密钥",
        "Projects": "项目管理",
        "Usage and Billing": "用量与计费",
        "Logs and Datasets": "日志与数据集",
        "Changelog": "更新日志",
        "Billing Support": "计费支持",
        "Project filter": "项目筛选",
        "Import projects": "导入项目",
        "Create a new project": "创建新项目",
        "Search for a project": "搜索项目",
        "Only imported projects appear here. If you don't see your projects, you can import projects from Google Cloud on this page.": "仅显示已导入的项目。如果没看到你的项目，可以在此页面从 Google Cloud 导入。",

        // ===========================
        // 🆕 v14.0 新增补充数据
        // ===========================
        "+ Create new instruction": "+ 新建指令",
        "Add stop...": "添加停止符...",
        "Choose a paid API key": "选择付费 API 密钥",
        "Delete system instruction": "删除系统指令",
        "Design a REST API for a social media platform.": "设计社交媒体平台的 REST API。",
        "Explain the probability of rolling two dice and getting 7": "解释掷两个骰子得到 7 的概率",
        "Generate Python code for a simple calculator app": "生成简单计算器应用的 Python 代码",
        "Go to Projects Page": "前往项目页面",
        "Google AI Studio logo": "Google AI Studio 图标",
        "Instructions are saved in local storage.": "指令已保存到本地存储。",
        "Learn more about how Google uses cookies. Opens in a new tab.": "了解有关 Google 如何使用 Cookie 的更多信息（在新标签页中打开）。",
        "Nano Banana Pro": "Nano Banana Pro",
        "Saved": "已保存",
        "SiliconFlow API: Batch Size & Threads": "SiliconFlow API: 批处理大小与线程",
        "Teach me a lesson on quadratic equations. Assume I know absolutely nothing about it": "教我一元二次方程。假设我对此一无所知",
        "Temporary chat toggle": "临时对话开关",
        "Title": "标题",
        "You have no Paid Project. Please view the Projects Page to choose a Project and Upgrade.": "您没有付费项目。请前往项目页面选择项目并升级。",
        "data use policy": "数据使用政策",
        "'Item: Apple, Price: $1'. Extract name, price to JSON.": "'商品: Apple, 价格: $1'。提取名称和价格为 JSON。",
        "Gemini 3 Pro Image Preview": "Gemini 3 Pro 图像预览版",
        "End Tokens": "结束 Token",
        "API pricing per 1M tokens.": "每百万 Token API 定价。",

        // 模型与工具描述补充
        "Our 2.5 Flash text-to-speech audio model optimized for price-performant, low-latency, controllable speech generation.": "我们的 2.5 Flash 语音模型，针对高性价比、低延迟和可控语音生成进行了优化。",
        "Our 2.5 Pro text-to-speech audio model optimized for powerful, low-latency speech generation for more natural outputs and easier to steer prompts.": "我们的 2.5 Pro 语音模型，优化了强大的低延迟生成能力，输出更自然，更易引导。",
        "Our latest image generation model, with significantly better text rendering and better overall image quality.": "最新的图像生成模型，具有显著更好的文本渲染和整体图像质量。",
        "Our most balanced multimodal model with great performance across all tasks.": "最均衡的多模态模型，在各项任务中表现优异。",
        "Our native audio models optimized for higher quality audio outputs with better pacing, voice naturalness, verbosity, and mood.": "原生音频模型，优化了音质、节奏、自然度、详细程度和情绪。",
        "Our smallest and most cost effective model, built for at scale usage.": "最小且最具性价比的模型，专为大规模使用打造。",
        "Our state-of-the-art video generation model, available to developers on the paid tier of the Gemini API.": "最先进的视频生成模型 (仅限 Gemini API 付费层级开发者)。",
        
        // 复杂提示与Cookie
        "Google AI Studio uses cookies to deliver and enhance the quality of its services and to analyze traffic. If you agree, cookies are also used to serve advertising and to personalize the content and advertisements that you see.": "Google AI Studio 使用 Cookie 来交付并提高其服务质量，并分析流量。如果您同意，Cookie 也将用于提供广告以及个性化您看到的内容和广告。",
        "Lets you define functions that Gemini can call\n\n This tool is not compatible with the current active tools.": "允许定义 Gemini 可调用的函数\n\n此工具与当前激活的工具不兼容。",
        "Optional tone and style instructions for the model": "设置模型的语气和风格（可选）",
        "Press space for more information.": "按空格键查看更多信息。",
        "Submit: Ctrl + Enter\nNewline: Enter": "发送: Ctrl + Enter\n换行: Enter",
        "Submit: Enter\nNewline: Shift + Enter": "发送: Enter\n换行: Shift + Enter",
        
        // ===========================
        // 🟡 X 光扫描全量数据 (A-Z)
        // ===========================
        "(Recommended) Maximizes reasoning depth": "(推荐) 最大化推理深度",
        "1 Day": "1 天",
        "7 Days": "7 天",
        "28 Days": "28 天",
        "90 Days": "90 天",
        "Add a context-aware chatbot to your app. Give your users a support agent that remembers the conversation, perfect for multi-step bookings or troubleshooting.": "添加具有上下文感知能力的聊天机器人。为用户提供能记住对话的客服代理，非常适合多步预订或故障排除。",
        "Add a feature to provide live, real-time transcription of any audio feed for your users.": "添加实时音频转录功能。",
        "Add files": "添加文件",
        "Add input": "添加输入",
        "Add lightning-fast, real-time responses to your app using 2.5 Flash-Lite. Perfect for instant auto-completes, or conversational agents that feel alive.": "使用 2.5 Flash-Lite 添加极速实时响应。非常适合即时自动完成或栩栩如生的对话代理。",
        "Add output": "添加输出",
        "Add powerful photo editing to your app. Allow users to add objects, remove backgrounds, or change a photo's style just by typing.": "添加强大的照片编辑功能。允许用户通过打字来添加对象、移除背景或更改照片风格。",
        "Add stop sequence": "添加停止符",
        "Add stop token": "添加停止符",
        "Add video generation to your creative app. Let users turn their blog posts, scripts, or product descriptions into short video clips.": "添加视频生成功能。让用户将博客文章、脚本或产品描述转化为短视频。",
        "Adjust harmful response settings": "调整有害内容响应设置",
        "Advanced settings": "高级设置",
        "Agree": "同意",
        "All": "全部",
        "All Models": "所有模型",
        "All apps": "所有应用",
        "All context lengths": "所有上下文长度",
        "All datasets": "所有数据集",
        "All models": "所有模型",
        "All projects": "所有项目",
        "All time": "全部时间",
        "Already in a new chat": "已处于新对话中",
        "An empty app": "空白应用",
        "Analyze images": "图像分析",
        "Animate images with Veo": "使用 Veo 让图像动起来",
        "Append to prompt and run (Ctrl + Enter)": "添加到提示词并运行 (Ctrl + Enter)",
        "Audio": "音频",
        "Auto-Hunter": "自动猎人 (Auto-Hunter)",
        "Average Latency": "平均延迟",
        "Back": "返回",
        "Bad response": "回答得差",
        "Billing": "计费",
        "Bring images to life with Veo 3. Let users upload a product photo and turn it into a dynamic video ad, or animate a character's portrait.": "使用 Veo 3 让图像动起来。上传产品照片生成动态视频广告，或让角色肖像动起来。",
        "Browse the app gallery": "浏览应用库",
        "Browse the url context": "浏览 URL 上下文",
        "Build": "构建",
        "Build apps with Gemini": "使用 Gemini 构建应用",
        "Build your ideas with Gemini": "用 Gemini 构建你的创意",
        "Camera": "相机",
        "Cancel": "取消",
        "Category": "分类",
        "Charts": "图表",
        "Chat": "对话",
        "Chat prompt": "对话提示词",
        "Chat with models": "与模型对话",
        "Clear": "清空",
        "Clear search query": "清空搜索",
        "Close": "关闭",
        "Close panel": "关闭面板",
        "Close run settings panel": "关闭运行设置面板",
        "Code execution": "代码执行 (Python)",
        "Code gen": "代码生成",
        "Collapse": "收起",
        "Collapse code snippet": "折叠代码片段",
        "Collapse prompts history": "折叠历史记录",
        "Compare mode": "对比模式",
        "Confirm": "确认",
        "Connect your app to real-time Google Maps data. Build an agent that can pull information about places, routes, or directions.": "连接实时 Google 地图数据。构建能获取地点、路线或方向信息的代理。",
        "Connect your app to real-time Google Search results. Build an agent that can discuss current events, cite recent news, or fact-check information.": "连接实时 Google 搜索结果。构建能讨论时事、引用新闻或核查事实的代理。",
        "Conversation turn navigation": "对话轮次导航",
        "Copied": "已复制",
        "Copy": "复制",
        "Copy API key": "复制 API 密钥",
        "Copy project ID": "复制项目 ID",
        "Copy to clipboard": "复制到剪贴板",
        "Create API key": "创建 API 密钥",
        "Create a new app": "创建新应用",
        "Create conversational voice apps": "创建对话式语音应用",
        "Create dataset": "创建数据集",
        "Create new": "新建",
        "Create new dataset": "创建新数据集",
        "Create voxel art scenes inspired by any image.": "根据图像创作体素艺术场景。",
        "Create your first app": "创建你的第一个应用",
        "Create, visualize, and rebuild sculptures using the same set of blocks.": "使用同一套积木创建、可视化和重建雕塑。",
        "Created": "已创建",
        "Created by others": "他人创建",
        "Created by you": "由你创建",
        "Created on": "创建于",
        "Creativity": "创意工具",
        "Dark": "深色模式",
        "Dashboard": "仪表盘",
        "Dataset": "数据集",
        "Datasets": "数据集",
        "Date created": "创建日期",
        "Date modified": "修改日期",
        "Default": "默认",
        "Delete": "删除",
        "Describe an object, icon, or scene, and we'll render it as vector art.": "描述物体、图标或场景，我们将渲染为矢量艺术。",
        "Describe your idea": "描述你的想法",
        "Design and Typography": "设计与排版",
        "Design and typography": "设计与排版",
        "Developer docs": "开发者文档",
        "Developer quickstarts": "开发者快速入门",
        "Discover and remix app ideas": "发现并改编应用创意",
        "Dismiss": "忽略",
        "Documentation": "文档",
        "Done": "完成",
        "Download": "下载",
        "Edit": "编辑",
        "Edit JSON schema": "编辑 JSON 架构",
        "Edit function declarations": "编辑函数声明",
        "Edit prompt title and description": "编辑标题和描述",
        "Edit safety settings": "编辑安全设置",
        "Edit title and description": "编辑标题和描述",
        "Education": "教育学习",
        "Embed Gemini in your app to complete all sorts of tasks - analyze content, make edits, and more": "将 Gemini 嵌入应用以完成各种任务——分析内容、编辑等等",
        "Enable logging": "启用日志",
        "Enable your app to see and understand images. Allow users to upload a photo of a receipt, a menu, or a chart to get instant data extraction, translations, or summaries.": "让应用能看懂图像。允许用户上传收据、菜单或图表，即时提取数据、翻译或摘要。",
        "Enter a prompt to generate an app": "输入提示词以生成应用",
        "Error Rate": "错误率",
        "Expand": "展开",
        "Expand or collapse advanced settings": "展开/折叠高级设置",
        "Expand or collapse tools": "展开/折叠工具",
        "Expand prompts history": "展开历史记录",
        "Expand to view model thoughts": "展开查看模型思考",
        "Explore docs": "浏览文档",
        "Explore the gallery": "探索应用库",
        "Export to code": "导出代码",
        "FAQ": "常见问题",
        "Fast AI responses": "快速 AI 响应",
        "Featured": "精选推荐",
        "Few Shot": "少样本 (Few Shot)",
        "Filter by": "筛选方式",
        "Filter by dataset": "按数据集筛选",
        "Filter by model": "按模型筛选",
        "Filter by rating": "按评分筛选",
        "Filter by status": "按状态筛选",
        "Filter by time range": "按时间范围筛选",
        "Filter by tools": "按工具筛选",
        "Filter the list of my apps": "筛选我的应用列表",
        "For Gemini 3, best results at default 1.0. Lower values may impact reasoning.": "对于 Gemini 3，默认为 1.0 效果最佳。较低值可能影响推理。",
        "Free tier": "免费层级",
        "Function calling": "函数调用",
        "Gallery": "应用库",
        "Games": "游戏",
        "Games and Visualizations": "游戏与可视化",
        "Gemini": "Gemini",
        "Gemini 2.0 Flash": "Gemini 2.0 Flash",
        "Gemini 2.0 Flash-Lite": "Gemini 2.0 Flash-Lite",
        "Gemini 2.5 Flash": "Gemini 2.5 Flash",
        "Gemini 2.5 Flash Image": "Gemini 2.5 Flash 图像版",
        "Gemini 2.5 Flash Native Audio Preview 09-2025": "Gemini 2.5 Flash 原生音频预览版",
        "Gemini 2.5 Flash Preview TTS": "Gemini 2.5 Flash TTS 预览版",
        "Gemini 2.5 Flash-Lite": "Gemini 2.5 Flash-Lite",
        "Gemini 2.5 Pro": "Gemini 2.5 Pro",
        "Gemini 2.5 Pro Preview TTS": "Gemini 2.5 Pro TTS 预览版",
        "Gemini 2.5 Pro TTS": "Gemini 2.5 Pro TTS",
        "Gemini 3 Pro": "Gemini 3 Pro",
        "Gemini 3 Pro Preview": "Gemini 3 Pro 预览版",
        "Gemini 3 is here": "Gemini 3 已发布",
        "Gemini 3: Our most intelligent model to date.": "Gemini 3: 我们迄今为止最智能的模型。",
        "Gemini API": "Gemini API",
        "Gemini API Billing": "Gemini API 计费",
        "Gemini API Logs and Datasets": "Gemini API 日志与数据集",
        "Gemini API Rate Limit": "Gemini API 速率限制",
        "Gemini API Usage": "Gemini API 用量",
        "Gemini Flash Latest": "Gemini Flash 最新版",
        "Gemini Flash Latest / 2.5 Flash": "Gemini Flash 最新 / 2.5 Flash",
        "Gemini Flash-Lite Latest": "Gemini Flash-Lite 最新版",
        "Gemini Robotics-ER 1.5 Preview": "Gemini 机器人具身推理 1.5 预览版",
        "Gemini Runner": "Gemini 跑酷",
        "Gemini intelligence in your app": "应用中的 Gemini 智能",
        "GenMedia": "媒体生成",
        "Generate": "生成",
        "Generate a Docker script to create a simple linux machine.": "生成创建简单 Linux 机器的 Docker 脚本。",
        "Generate a high school revision guide on quantum computing": "生成量子计算的高中复习指南",
        "Generate a scavenger hunt for street food around the city of Seoul, Korea": "生成首尔街头美食寻宝游戏",
        "Generate content": "生成内容",
        "Generate high quality text to speech with Gemini": "用 Gemini 生成高质量语音",
        "Generate high-quality images from a text prompt. Create blog post heroes, concept art, or unique assets in your application.": "从文本生成高质量图像。创建博客配图、概念艺术或独特素材。",
        "Generate images with a prompt": "通过提示词生成图像",
        "Generate media": "生成媒体",
        "Generate speech": "生成语音",
        "Generate structured outputs": "生成结构化输出",
        "Generative Language API Key": "生成式语言 API 密钥",
        "Get API key": "获取 API 密钥",
        "Get SDK code to chat with Gemini": "获取 SDK 代码",
        "Get code": "获取代码",
        "Get started with Gemini": "开始使用 Gemini",
        "Give your app a voice. Add text-to-speech to read articles aloud, provide audio navigation, or create voice-based assistants for your users.": "给应用装上嘴巴。添加文字转语音来朗读文章、提供语音导航或创建语音助手。",
        "Give your app's AI time to think. Enable 'Thinking Mode' to handle your users' most complex queries.": "给 AI 思考时间。启用“思考模式”处理复杂查询。",
        "Good response": "回答得好",
        "Google AI Studio": "Google AI Studio",
        "Google Cloud Console": "Google Cloud 控制台",
        "Google Search": "Google 搜索",
        "Grounding with Google Search": "关联 Google 搜索",
        "Group by": "分组方式",
        "Hello, How Can I Help?": "你好，有什么可以帮忙？",
        "Help": "帮助",
        "Help users find the key moments in long videos. Add a feature to analyze video content to instantly generate summaries, flashcards, or marketing highlights.": "帮助用户发现视频关键时刻。添加视频分析功能，生成摘要、抽认卡或营销集锦。",
        "High": "高 (深入思考)",
        "Higher resolutions may provide better understanding but use more tokens.": "更高分辨率理解力更好，但消耗更多 Token。",
        "History": "历史记录",
        "Home": "首页",
        "Human Eval": "人工评估",
        "I'm feeling lucky": "手气不错",
        "Image (*Output per image)": "图像 (每张)",
        "Image to Voxel Art": "图像转体素艺术",
        "Imagen 3": "Imagen 3",
        "Imagen 4": "Imagen 4",
        "Imagen 4 Fast": "Imagen 4 Fast",
        "Imagen 4 Ultra": "Imagen 4 Ultra",
        "Imagen Requests per day": "每日 Imagen 请求数",
        "Images": "图像",
        "Immersive Games & 3D Worlds": "沉浸式游戏与 3D 世界",
        "Immersive event landing page with interactive scroll effects.": "具有交互式滚动效果的沉浸式活动落地页。",
        "Import projects": "导入项目",
        "Input": "输入",
        "Input Tokens per day": "每日输入 Token",
        "Insert": "插入",
        "Insert a PDF to add it to your prompt.": "插入 PDF 到提示词。",
        "Insert a text file to add it to your prompt.": "插入文本文件到提示词。",
        "Insert an image to add it to your prompt.": "插入图像到提示词。",
        "Insert assets such as images, videos, files, or audio": "插入图片、视频、文件或音频",
        "Insert assets such as images, videos, folders, files, or audio": "插入图片、视频、文件夹、文件或音频",
        "Insert media such as images": "插入媒体（如图像）",
        "Instructions": "指令",
        "Internet favorites": "网络收藏",
        "JSON": "JSON",
        "JavaScript": "JavaScript",
        "Key": "密钥",
        "Keys": "密钥",
        "Kinetic Shapes": "动态形状",
        "Last 24 hours": "过去 24 小时",
        "Last 30 days": "过去 30 天",
        "Last 7 days": "过去 7 天",
        "Last Hour": "过去 1 小时",
        "Last viewed:": "最近查看：",
        "Learn more": "了解更多",
        "Lets Gemini use code to solve complex tasks": "允许 Gemini 运行代码来解决复杂任务",
        "Light": "浅色模式",
        "Live": "实时",
        "Logs containing videos or PDFs are currently not supported.": "目前不支持包含视频或 PDF 的日志。",
        "Low": "低 (快速响应)",
        "Lumina Festival": "Lumina 音乐节",
        "Manage a virtual metropolis and fulfill tasks provided by Gemini.": "管理虚拟大都市并完成 Gemini 提供的任务。",
        "Maximum number of tokens in response": "响应中的最大 Token 数",
        "Maximum output tokens": "最大输出 Token 数",
        "Media resolution": "多媒体分辨率",
        "Median Latency": "中位数延迟",
        "Medium": "中等",
        "Menu": "菜单",
        "Model": "模型",
        "Model carousel": "模型轮播",
        "Model selection": "模型选择",
        "Monitor usage and projects": "监控用量与项目",
        "More options": "更多选项",
        "Multimodal understanding": "多模态理解",
        "My Drive": "我的云端硬盘",
        "My Library": "我的资料库",
        "Name": "名称",
        "Nano Banana": "Nano Banana",
        "Nano banana powered app": "Nano Banana 驱动的应用",
        "Navigate a complex 3d world with customizable interactions.": "在可自定义交互的复杂 3D 世界中导航。",
        "New": "新",
        "New app": "新应用",
        "New chat": "新对话",
        "Next page": "下一页",
        "No API Key": "无 API Key",
        "No API key selected": "未选择 API Key",
        "No Data Available": "暂无数据",
        "No thanks": "不，谢谢",
        "One Shot": "单样本",
        "Only imported projects appear here. If you don't see your projects, you can import projects from Google Cloud on this page.": "仅显示已导入的项目。如果没看到，请在此页面从 Google Cloud 导入。",
        "Open options": "打开选项",
        "Optimizes for latency": "优化延迟 (速度优先)",
        "Output": "输出",
        "Output Tokens per day": "每日输出 Token",
        "Output length": "输出长度",
        "Overview": "概览",
        "Owner": "所有者",
        "Pay-as-you-go": "按需付费",
        "Peak input tokens per minute (TPM)": "每分钟 Token 峰值 (TPM)",
        "Peak requests per day (RPD)": "每天请求峰值 (RPD)",
        "Peak requests per minute (RPM)": "每分钟请求峰值 (RPM)",
        "Physics Simulation": "物理模拟",
        "Physics sandbox for simulating variable gravity and collision dynamics.": "用于模拟可变重力和碰撞动力学的物理沙盒。",
        "Pin app": "置顶应用",
        "Playground": "工作台",
        "Previous page": "上一页",
        "Privacy policy": "隐私政策",
        "Probability threshold for top-p sampling": "Top-P 采样的概率阈值",
        "Productivity": "生产力工具",
        "Project": "项目",
        "Project filter": "项目筛选",
        "Projects": "项目列表",
        "Prompt based video generation": "基于提示词的视频生成",
        "Prompts": "提示词库",
        "Python": "Python",
        "Quota tier": "配额等级",
        "Quotas": "配额",
        "RPD": "RPD (日请求量)",
        "RPM": "RPM (分请求量)",
        "Race through a stunning synthwave cosmos at breakneck speeds in this retro-futuristic runner.": "在这个复古未来主义跑酷游戏中，以极快速度穿越令人惊叹的合成波宇宙。",
        "Rate Limit": "速率限制",
        "Rate limits": "速率限制",
        "Rate limits breakdown": "速率限制详情",
        "Rate limits by model": "按模型查看速率限制",
        "Rating": "评分",
        "Reached limit": "已达上限",
        "Recent": "最近使用",
        "Recently viewed": "最近查看",
        "Record Audio": "录制音频",
        "Remove": "移除",
        "Remove app": "移除应用",
        "Requests per day": "每日请求数",
        "Rerun": "重新运行",
        "Rerun this turn": "重试此轮",
        "Research Visualization": "研究可视化",
        "Research paper reimagined as an elegant, interactive narrative site.": "重构为优雅、交互式叙事网站的研究论文。",
        "Reset default settings": "恢复默认设置",
        "Response ready.": "响应已就绪。",
        "Run": "运行",
        "Run settings": "运行配置",
        "SVG Generator": "SVG 生成器",
        "Safety settings": "安全设置",
        "Sample Media": "示例媒体",
        "Save": "保存",
        "Scroll left": "向左滚动",
        "Scroll right": "向右滚动",
        "Search": "搜索",
        "Search for a model": "搜索模型",
        "Search for a project": "搜索项目",
        "Search for an app": "搜索应用",
        "Select or upload a file on Google Drive to include in your prompt": "从云端硬盘选择文件",
        "Select the audio source for the speech-to-text feature": "选择语音转文字的音频源",
        "Send feedback": "发送反馈",
        "Session page navigation": "会话页面导航",
        "Set": "设置",
        "Set the thinking level": "设置思考深度",
        "Set up billing": "设置计费",
        "Set up billing to enable Gemini API logging": "设置计费以启用日志",
        "Settings": "设置",
        "Shader Pilot": "着色器飞行员",
        "Share": "分享",
        "Share prompt": "分享提示词",
        "Show conversation without markdown formatting": "显示无 Markdown 格式的对话",
        "Sign in": "登录",
        "Sign out": "登出",
        "Skip to main content": "跳转到主要内容",
        "Sky Metropolis": "天空大都市",
        "Sort": "排序",
        "Sort by": "排序方式",
        "Source:": "来源：",
        "Speech to text": "语音转文字",
        "Start": "开始",
        "Start from a template": "从模板开始",
        "Start typing a prompt": "在此输入提示词...",
        "Status": "状态",
        "Stop": "停止",
        "Stop sequences": "停止符",
        "Structured outputs": "结构化输出 (JSON)",
        "Submit prompt key": "发送快捷键",
        "Supercharge your apps with AI": "用 AI 为你的应用充能",
        "Switch to a paid API key to unlock higher quota and more features.": "切换到付费 API Key 以解锁更高配额和更多功能。",
        "Synthwave Space": "合成波太空",
        "System": "系统",
        "System default": "跟随系统",
        "System instructions": "系统指令",
        "TPM": "TPM (分 Token 量)",
        "Take a photo": "拍照",
        "Temperature": "随机性 (Temperature)",
        "Tempo Strike": "Tempo Strike (游戏)",
        "Terms of service": "服务条款",
        "Test your prompt": "测试提示词",
        "Text": "文本",
        "Text to speech with Gemini": "Gemini 语音合成 (TTS)",
        "The fastest way from prompt to production with Gemini": "使用 Gemini 从提示词到生产环境的最快路径",
        "Theme": "主题",
        "There is no billing currently set up for this project": "此项目未设置计费",
        "Think more when needed": "需要时深入思考",
        "Thinking Level": "思考深度",
        "Thinking level": "思考深度",
        "Thoughts": "思考过程",
        "Time Range": "时间范围",
        "Time range": "时间范围",
        "Toggle logging status": "切换日志状态",
        "Toggle navigation menu": "切换导航菜单",
        "Toggle view all models": "切换显示所有模型",
        "Token count": "Token 统计",
        "Tool calling": "工具调用",
        "Tools": "扩展工具",
        "Tools and MCP": "工具与 MCP",
        "Top K": "多样性 (Top K)",
        "Top P": "概率阈值 (Top P)",
        "Total API Errors": "API 错误总数",
        "Total API Errors per day": "每日 API 错误总数",
        "Total API Requests": "API 请求总数",
        "Total API Requests per day": "每日 API 请求总数",
        "Transcribe audio": "音频转录",
        "Truncate response including and after string": "截断包含及之后的字符串",
        "Try Gemini 3": "试用 Gemini 3",
        "Try Nano Banana": "试用 Nano Banana",
        "Try it": "立即试用",
        "Type something or tab to choose an example prompt": "输入内容或按 Tab 选择示例",
        "Type something...": "输入内容...",
        "URL context": "URL 上下文",
        "Understanding projects": "了解项目",
        "Untitled": "未命名",
        "Untitled prompt": "未命名提示词",
        "Upgrade": "升级",
        "Upload File": "上传文件",
        "Upload a file to Google Drive to include in your prompt": "上传文件到云端硬盘",
        "Upload an image of a board game, floor layout, or anything you can think of to turn it into an interactive experience.": "上传桌游、平面图等图像，将其转化为交互式体验。",
        "Usage": "用量",
        "Usage and Billing": "用量与计费",
        "Usage in AI Studio UI is free of charge": "在 AI Studio 界面中使用完全免费",
        "Usage is only reflective of GenerateContent requests. Other request types are not yet supported.": "用量仅反映 GenerateContent 请求。",
        "Usage is only reflective of Imagen and Veo requests. Other request types are not yet supported.": "用量仅反映 Imagen 和 Veo 请求。",
        "Usage is reflective of all request types to the Gemini API.": "用量反映 Gemini API 的所有请求类型。",
        "Use Arrow Up and Arrow Down to select a turn, Enter to jump to it, and Escape to return to the chat.": "使用上下箭头选择，回车跳转，Esc 返回。",
        "Use Google Maps data": "使用 Google 地图数据",
        "Use Google Search": "使用 Google 搜索",
        "Use Google Search data": "使用 Google 搜索数据",
        "Use the Gemini Live API to give your app a voice and make your own conversational experiences.": "使用 Gemini Live API 为应用添加语音。",
        "Use your webcam to track hand movements and slash Sparks to the beat.": "使用摄像头追踪手部动作，按节奏切开 Spark。",
        "Utilities": "实用工具",
        "Veo 2": "Veo 2",
        "Veo 3.1": "Veo 3.1",
        "Veo Requests per day": "每日 Veo 请求数",
        "Vibe code GenAI apps": "编写生成式 AI 应用",
        "Video": "视频",
        "Video understanding": "视频理解",
        "View AI Studio and Gemini status page": "查看 AI Studio 和 Gemini 状态页",
        "View API keys": "查看 API 密钥",
        "View all history": "查看所有历史",
        "View billing": "查看计费",
        "View code": "查看代码",
        "View details": "查看详情",
        "View in charts": "在图表中查看",
        "View more actions": "查看更多操作",
        "View rate limits documentation": "查看速率限制文档",
        "View status": "服务状态",
        "View usage": "查看用量",
        "Voxel Toy Box": "体素玩具箱",
        "Wait": "稍等",
        "What's new": "最新动态",
        "You can then view your Gemini API history and create datasets.": "你可以查看 API 历史并创建数据集。",
        "You have reached a rate limit. Set up billing to increase your limits and unblock your work.": "已达速率限制。设置计费以增加限额。",
        "You need an active billing account to enable logging.": "需要有效的计费账户以启用日志。",
        "You need to create and run a prompt in order to share it": "你需要创建并运行提示词才能分享。",
        "YouTube Video": "YouTube 视频",
        "Your apps": "你的应用",
        "Your conversations won’t be saved. However, any files you upload will be saved to your Google Drive. Logging policy still apply even in Temporary chat.": "对话不会保存，但上传的文件会保存到云端硬盘。日志策略仍适用。",
        "Your conversations won’t be saved. However, any files you upload will be saved to your Google Drive. Logging policy still apply even in Temporary chat. See": "您的对话不会保存。但上传的文件会存入 Google 云端硬盘。日志策略在临时对话中仍然适用。查看",
    };

    // =========================================================
    //  2. 图标防火墙 (绝对严防死守，不许图标乱码)
    // =========================================================
    const ICON_BLACKLIST = new Set([
        "menu", "menu_open", "home", "search", "close", "add", "add_circle",
        "arrow_back", "arrow_forward", "arrow_outward", "chevron_left", "chevron_right",
        "expand_less", "expand_more", "more_vert", "more_horiz",
        "chat", "chat_spark", "photo_spark", "video_spark", "audio_spark", "spark",
        "edit", "delete", "share", "content_copy", "file_copy",
        "info", "help", "settings", "history", "schedule", "visibility",
        "check", "flag", "warning", "error", "lock", "key", "key_off",
        "thumb_up", "thumb_down", "star", "favorite", "stars",
        "play_arrow", "pause", "stop", "fiber_manual_record", "mic", "videocam",
        "upload", "download", "cloud_upload", "cloud_download",
        "code", "terminal", "integration_instructions", "data_object",
        "light_mode", "dark_mode", "palette", "speed", "bolt",
        "photo_camera", "video_camera_front", "video_library", "movie",
        "dashboard", "build", "description", "calendar_today", "bar_chart", "pie_chart",
        "design_services", "developer_guide", "topic", "filter_list", "sort",
        "grid_view", "list", "refresh", "fullscreen", "fullscreen_exit",
        "arrow_circle_up", "arrow_upward_alt", "aspect_ratio", "assignment", "attach_money",
        "audio_magic_eraser", "cloud_download", "compare_arrows", "console", "data_info_alert",
        "deselect", "document_scanner", "drive", "google", "google_pin", "image_edit_auto",
        "incognito", "keyboard_return", "keyboard_tab", "money_bag", "network_intelligence",
        "network_intelligence_history", "shield_person", "speech_to_text", "text_fields",
        "tune", "verified", "verified_user", "widgets", "workspaces", "reset_settings", "trending_flat"
    ]);

    function isIcon(node) {
        const text = node.nodeValue.trim();
        // 1. 黑名单直查
        if (ICON_BLACKLIST.has(text)) return true;
        // 2. Snake_Case 格式检查 (如 video_spark)
        if (/^[a-z]+(_[a-z0-9]+)+$/.test(text)) return true;
        
        // 3. 父级检查
        const parent = node.parentNode;
        if (!parent) return false;
        
        // 检查常见图标标签
        if (['MAT-ICON', 'I', 'SPAN', 'GOOGLE-ICON', 'G-ICON'].includes(parent.tagName)) {
             if (ICON_BLACKLIST.has(text) || /^[a-z_]+$/.test(text)) return true;
             const cls = (parent.className && typeof parent.className === 'string') ? parent.className : '';
             if (cls.includes('material-symbols') || 
                 cls.includes('google-symbols') || 
                 cls.includes('icon')) {
                 return true;
             }
        }
        return false;
    }

    // =========================================================
    //  3. 智能正则 (修复长难句与动态文本)
    // =========================================================
    const regexRules = [
        // 仪表盘动态数据
        { pattern: /^Total requests:\s*([\d,]+)$/i, replace: '总请求数：$1' },
        { pattern: /^Total errors:\s*([\d,]+)$/i, replace: '总错误数：$1' },
        { pattern: /^Avg latency:\s*([\d,.]+)\s*ms$/i, replace: '平均延迟：$1 ms' },
        
        // 核心长句描述 (忽略换行符)
        { pattern: /Our\s+most\s+intelligent\s+model\s+to\s+date\.?/i, replace: '我们迄今为止最智能的模型。' },
        { pattern: /State-of-the-art\s+image\s+generation\s+and\s+editing\.?/i, replace: '最先进的图像生成与编辑。' },
        { pattern: /Our\s+best\s+video\s+generation\s+model,\s+now\s+with\s+sound\s+effects\.?/i, replace: '我们最强的视频生成模型，现已支持音效。' },
        { pattern: /Our\s+most\s+intelligent\s+model\s+with\s+SOTA\s+reasoning\s+and\s+multimodal\s+understanding[\s\S]*?capabilities/i, replace: '我们最智能的模型，具备 SOTA 级推理、多模态理解以及强大的智能体和编程能力' },
        { pattern: /Our\s+advanced\s+reasoning\s+model,\s+which\s+excels\s+at\s+coding\s+and\s+complex\s+reasoning\s+tasks/i, replace: '我们的高级推理模型，擅长编程和复杂推理任务' },
        { pattern: /Our\s+hybrid\s+reasoning\s+model,\s+with\s+a\s+1M\s+token\s+context\s+window\s+and\s+thinking\s+budgets\.?/i, replace: '混合推理模型，拥有 100万 Token 上下文窗口并支持思考预算。' },
        { pattern: /Gemini\s+Robotics-ER,\s+short\s+for[\s\S]*?physical\s+world\.?/i, replace: 'Gemini Robotics-ER (具身推理) 旨在增强机器人理解物理世界的能力。' },
        
        // 计费与提示 (包含新旧两种定价格式的兼容)
        { pattern: /Image\s+output\s+is\s+priced\s+at\s+\$30\s+per\s+1,000,000\s+tokens[\s\S]*?free\s+of\s+charge/i, replace: '图片输出价格为 $30/百万Token。在 AI Studio 界面中使用免费。' },
        // 🆕 新增：针对 $120 定价的正则
        { pattern: /Image\s+output\s+is\s+priced\s+at\s+\$120\s+per\s+1,000,000\s+tokens[\s\S]*?per\s+image\./i, replace: '图像输出价格为 $120/百万Token。1024x1024px 图像消耗 1120 Token (约 $0.134/张)。' },
        { pattern: /API\s+pricing\s+per\s+1M\s+tokens\.\s+Usage\s+in\s+AI\s+Studio\s+UI\s+is\s+free\s+of\s+charge/i, replace: 'API 定价(每百万Token)。在 AI Studio 界面中使用完全免费。' },
        { pattern: /Usage\s+information\s+displayed\s+is\s+for\s+the\s+API\s+and\s+does\s+not\s+reflect\s+AI\s+Studio\s+usage/i, replace: '显示的是 API 用量信息，不反映 AI Studio 的免费使用情况。' },
        { pattern: /Google\s+AI\s+models\s+may\s+make\s+mistakes,\s+so\s+double-check\s+outputs\.?/i, replace: 'Google AI 模型可能会犯错，请务必核查输出。' },
        { pattern: /This\s+chart\s+is\s+described\s+by\s+one\s+or\s+more\s+grids/i, replace: '此图表由一个或多个网格描述。' },

        // 动态短语
        { pattern: /^Points to\s+(.+)$/i, replace: '指向 $1' },
        { pattern: /^Try\s+(.+)$/i, replace: '试用 $1' },
        { pattern: /\bInput\b\s*[:：]\s*/i, replace: '输入：' },
        { pattern: /\bOutput\b\s*[:：]\s*/i, replace: '输出：' },
        { pattern: /\bKnowledge cut ?off\b\s*[:：]\s*/i, replace: '知识截止：' },
        { pattern: /^Selected[:\s]+(.+?)$/i, replace: '已选择：$1' },
        { pattern: /^Model:\s*(.+)$/i, replace: '模型：$1' }
    ];

    // =========================================================
    //  4. 翻译核心
    // =========================================================
    function getTrans(text) {
        if (!text) return null;
        const trimText = text.trim();
        if (!trimText) return null;

        // 1. 精准匹配
        if (i18nMap[trimText]) return i18nMap[trimText];

        // 2. 正则匹配
        for (let i = 0; i < regexRules.length; i++) {
            const rule = regexRules[i];
            if (rule.pattern.test(trimText)) {
                return trimText.replace(rule.pattern, rule.replace);
            }
        }
        return null;
    }

    function processNode(node) {
        // A. 文本节点
        if (node.nodeType === 3) { 
            if (isIcon(node)) return; // 核心防御
            const val = node.nodeValue;
            const trans = getTrans(val);
            if (trans && val.trim() !== trans) {
                node.nodeValue = val.replace(val.trim(), trans);
            }
            return;
        }

        // B. 元素节点
        if (node.nodeType === 1) {
            if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA'].includes(node.tagName)) return;
            if (node.isContentEditable) return; 
            if (node.classList && node.classList.contains('monaco-editor')) return;

            // 属性
            ['aria-label', 'title', 'placeholder', 'data-tooltip', 'label'].forEach(attr => {
                const val = node.getAttribute(attr);
                if (val) {
                    const trans = getTrans(val);
                    if (trans && trans !== val) node.setAttribute(attr, trans);
                }
            });

            // Shadow DOM
            if (node.shadowRoot) traverse(node.shadowRoot);
        }

        // C. 递归
        let child = node.firstChild;
        while (child) {
            processNode(child);
            child = child.nextSibling;
        }
    }

    function traverse(root) {
        if (!root) return;
        Array.from(root.childNodes).forEach(processNode);
    }

    // =========================================================
    //  5. 启动
    // =========================================================
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => processNode(node));
            if (mutation.type === 'attributes') processNode(mutation.target);
        });
    });

    observer.observe(document.body, {
        childList: true, subtree: true, attributes: true,
        attributeFilter: ['aria-label', 'title', 'placeholder', 'data-tooltip']
    });

    setInterval(() => { traverse(document.body); }, 1500);

    console.log("%c Google AI Studio 汉化脚本 v14.0 (黄天祺定制版) 已启动 ", "background: #d32f2f; color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
    traverse(document.body);

})();