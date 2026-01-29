// ==UserScript==
// @name         Google AI Studio 汉化脚本
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  将 Google AI Studio (aistudio.google.com) 页面的主要 UI 元素翻译为中文，已更新Gemini3等
// @match        https://aistudio.google.com/*
// @grant        none
// @author       Betsy
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549999/Google%20AI%20Studio%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549999/Google%20AI%20Studio%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(() => {
  'use strict';

  // microtask 兜底
  if (typeof window.queueMicrotask !== 'function') {
    window.queueMicrotask = (cb) => (typeof Promise === 'function'
      ? Promise.resolve().then(cb).catch(e => setTimeout(() => { throw e; }))
      : setTimeout(cb, 0));
  }
  // —— 静态与模糊词典 ——
  const EXACT = new Map([
    // 顶部栏与通用
    ['Block high probability of being harmful', '高概率有害，予以拦截'],
    ['Harassment', '骚扰'],['Hate', '憎恨'],['Sexually Explicit', '色情'],
    ['Block medium or high probability of being harmful', '阻止可能有害的内容'],
    ['+ New app', '+ 新建应用'],['Build AI apps', '构建 AI 应用'],['Chat with models', '与模型对话'],['Monitor API usage', '监控 API 使用情况'],
    ['Block low, medium and high probability of being harmful', '阻止低、中、高风险的有害内容'],['The fastest path from prompt to production with Gemini', '使用 Gemini 从提示到生产的最快路径'],
    ['You have no Paid Project. Please view the Projects Page to choose a Project and Upgrade.', '您没有付费项目。请访问项目页面以选择项目并进行升级。'],['Upload files', '上传文件'],
    ['Always show regardless of probability of being harmful', '无论有害的可能性如何，始终表现出来'],['Share', '分享'],['Rename', '重命名'],['Choose a paid API key', '选择付费 API 密钥'],
    ['Start building with Gemini', '开始使用 Gemini 进行构建'],
    ['Our top picks including Gemini 3 Pro and Nano Banana Pro.', '我们的精选推荐，包括 Gemini 3 Pro 和 Nano Banana Pro。'],
    ['Chat and Reasoning', '聊天与推理'],
    ['Build chatbots, agents, and code with Gemini 3 Pro and Gemini 3 Flash.', '使用 Gemini 3 Pro 和 Gemini 3 Flash 构建聊天机器人、智能体和代码。'],
    ['Image Generation', '图像生成'],
    ['Create and edit images with Nano Banana and Imagen.', '使用 Nano Banana 和 Imagen 创建和编辑图像。'],
    ['Video Generation', '视频生成'],
    ['Generate videos with Veo models, our state of the art video generation models.', '使用 Veo 模型（我们最先进的视频生成模型）生成视频。'],
    ['Text to Speech', '文字转语音'],
    ['Convert text to speech with likelike realism using Gemini TTS.', '使用 Gemini TTS 将文本转换为具有逼真效果的语音。'],
    ['Real-time', '实时'],
    ['Real-time voice and video with Gemini Live.', '通过 Gemini Live 实现实时语音和视频。'],
    ['Get API key', '获取 API 密钥'], ['Help', '帮助'], ['Settings', '设置'], ['Create new', '新建'],['Build your ideas with Gemini', '与Gemini一起构建您的想法'],['Send prompt (Ctrl + Enter)', '发送提示 (Ctrl + Enter)'],
    ['Switch to a paid API key to unlock higher quota and more features.', '切换到付费API密钥以解锁更高配额和更多功能。'],['Stream, Imagen and Veo have moved to the model picker in chat!', 'Stream、Imagen和Veo都有移动到这里的实验区聊天！'],
    ['Model', '模型'], ['Run', '运行'], ['Run settings', '运行设置'], ['Untitled prompt', '无标题提示'],['Set the thinking level', '设置思考等级'],['Let it snow', '下雪特效'],[' Remove Code execution', '移除代码执行'],
    ['This model is not stable and may not be suitable for production use.', '该模型不稳定，可能不适合生产环境使用。'],['Thinking level', '思考等级'],['High', '高'],['Remove Grounding with Google Search', '移除 Google 搜索基座'],['Stop editing', '停止编辑'],
    ['Off', '关闭'],['Block none', '无屏蔽'],['Block few', '屏蔽少数'],['Block some', '屏蔽一些'],['Block most', '屏蔽大部分'],['View status', '查看状态'],['Submit prompt key', '发送消息'],[' Remove URL context', '移除网址上下文'],['Go to Projects Page', '前往项目页面'],
    ['Enter a prompt here', '在此处输入提示'], ['Add an example', '添加示例'], ['Input', '输入'], ['Output', '输出'],['Do not run safety filters', '不运行安全过滤器'],['Home', '主页'],['Copied to clipboard', '已复制到剪贴板'],['Delete prompt', '删除对话'],
    ['Get code', '获取代码'], ['Save', '保存'], ['Chat', '聊天'], ['Stream', '流式'], ['Generate media', '生成媒体'],['Run prompt', '输入提示'],['Reset defaults', '恢复默认设置'],['Insert images, videos, audio, or files', '插入图像、视频、音频，或文件'],
    ['Build', '构建'], ['History', '历史记录'], ['Dashboard', '仪表盘'], ['Documentation', '文档'],['Generate structured output', '生成结构化输出'],['Dangerous Content', '危险内容'],['Type', '类型'],['Developer docs', '开发者文档'],['Speech to text', '语音转文本'],
    ['Total API Requests per Day', '每天的 API 请求总数'],['Total API Errors per Day', '每天的 API 错误总数'],['Studio', '实验室'],['My history', '我的对话历史'],['Open in Drive', '在云端硬盘打开'],['Description', '描述'],[' Remove Structured outputs', '移除结构化输出'],
    ['Temperature', '温度'], ['Top-K', 'Top‑K'], ['Top-P', 'Top‑P'], ['Advanced settings', '高级设置'],['Lets Gemini use code to solve complex tasks', '让 Gemini 使用代码来解决复杂的任务'],['No Data Available', '没有可用数据'],[' Remove Function calling', '移除函数调用'],
    ['Safety settings', '安全设置'], ['Edit', '编辑'], ['Stop sequences', '停止序列'], ['Add stop sequence', '添加停止序列'],['Probability threshold for top-p sampling', 'top-p 采样概率阈值'],['Cancel generation', '取消生成'],['Updated','更新'],
    ['Output length', '输出长度'], ['Tools', '工具'], ['URL context', 'URL 上下文'], ['Structured output', '结构化输出'],['Maximum number of tokens in response', '响应中的最大令牌数'],['Ready to chat!', '准备好聊天了！'],['Ready to chat','准备好聊天了！'],
    ['Code execution', '代码执行'], ['Function calling', '函数调用'], ['Grounding with Google Search', '启用 Google 搜索基座'],['Usage & Billing', '使用情况和计费'],['Low', '低'],['Medium', '中'],['Saved to Drive', '保存至云端硬盘'],['Link a paid API key here.', '在此处链接付费API密钥。'],
    ['Source:', '来源：'], ['Source: Google Search', '来源：Google 搜索'],['Creativity allowed in the responses', '回复内容允许创意发挥'],['Changelog', '更新日志'],['API keys', 'API密钥'],['Start typing a prompt', '开始输入提示词'],['Get started with Gemini', '开始使用 Gemini'],
    ['Generate content', '生成内容'], ['Media resolution', '媒体分辨率'], ['Default', '默认'], ['Thinking', '思考'], ['Thinking mode', '思考模式'],['Truncate response including and after string', '截断包含字符串及其之后的内容的响应'],['Good response', '回复得好'],['Bad response', '回复不好'],
    ['Set thinking budget', '设置思考预算'], ['Close?', '关闭？'], ['Cancel', '取消'], ['Continue', '继续'],['Browse the url context', '浏览网址上下文'],['Lets you define functions that Gemini can call', '此工具与当前活动工具不兼容。'],['User','用户'],['Are you sure?', '你确定？'],
    ['Model selection', '模型选择'], ['All', '全部'], ['Featured', '精选'], ['Images', '图像'], ['New', '新'],['Adjust harmful response settings', '调整有害内容设置'],['Run safety settings', '运行安全设置'],['Rerun', '重试'],['Delete', '删除'],['Google Search Suggestions', 'Google搜索建议'],
    ['Temporary chat', '临时聊天'], ['Reset default settings', '恢复默认设置'],['Higher resolutions may provide better understanding but use more tokens.', '更高的分辨率可能提供更好的理解，但会消耗更多 token。'],['Share prompt', '分享对话'],['Name', '名称'],
    ['You need to create and run a prompt in order to share it', '您需要创建并运行一个提示才能分享它。'],['More options', '更多选项'],['New chat', '开启新对话'],['Project', '项目'],['Generate structured outputs', '生成结构化输出'],['Structured outputs', '结构化输出'],
    ['System instructions', '系统指令'], ['Chat prompt', '聊天提示'], ['Compare mode', '对比模式'],['Let the model decide how many thinking tokens to use or choose your own value', '让模型决定使用多少思考令牌，或自行选择值'],['Make a copy', '备份'],['Time Range', '时间范围'],
    ['Already in a new chat', '已处于新聊天'], ['Save the prompt before sharing it', '分享前请先保存提示'],['Use Google Search', '使用谷歌搜索'],['Expand prompts history', '展开对话历史'],['Create generative media', '创作生成式媒体'],['No changes to save', '没有更改需要保存'],
    ['View more actions', '更多操作'], ['Show conversation without markdown formatting', '以纯文本展示对话（不含 Markdown 格式）'],['Edit title and description', '编辑标题和描述'],['Collapse prompts history', '折叠对话历史'],['experimental', '实验性的'],['Thoughts', '思考'],
    ['Get SDK code to chat with Gemini', '获取与 Gemini 聊天的 SDK 代码'],['Unable to disable thinking mode for this model.', '无法为此模型禁用思考模式。'],['Enable or disable thinking for responses', '启用或禁用响应思考'],['Download', '下载'],['Copy to clipboard', '复制到剪贴板'],
    ['Adjust how likely you are to see responses that could be harmful. Content is blocked based on the probability that it is harmful.', '调整您看到可能有害的回复的可能性。根据内容有害的可能性被屏蔽。'],['Stop', '停止'],['Auto', '自动'],['Expand to view model thoughts', '展开以查看模型想法'],
    ['You are responsible for ensuring that safety settings for your intended use case comply with the Terms and Use Policy. Learn more.', '您有责任确保预期用例的安全设置符合条款和使用政策。了解详情。'],['Or try some examples', '或者尝试一些例子'],['Overview', '概述'],['Start', '开始'],
    ['Try Nano Banana', '尝试 Nano Banana'],['Theme', '主题'],['System', '系统'],['Dark', '暗黑'],['Light', '明亮'],['Terms of service', '服务条款'],['Privacy policy', '隐私政策'],['Send feedback', '发送反馈'],['Billing Support', '账单支持'],['Collapse code snippet', '折叠代码片段'],
    ['Showcase', '展示'],['Your apps', '你的应用'],['Recent apps', '最近的应用'],['FAQ', '常见问题'],['No apps created yet. Build your first app now.', '尚未创建任何应用。立即构建您的第一个应用程序。'],['Need some inspiration? See examples in', '需要一些灵感吗？请参阅以下示例：'],['Gallery', '画廊'],
    ['Usage information displayed is for the API and does not reflect AI Studio usage, which is offered free of charge.', '显示的使用信息适用于 API，并不反映免费提供的 AI Studio 使用情况。'],['Input Tokens per Day', '每天输入的令牌数'],['Requests per Day', '每天的请求数'],['Audio', '音频'],['Video', '视频'],
    ['Sample Media', '示例媒体'],['Branch from here', '从这里分支'],['Copy as text', '复制为文本'],['Copy as markdown', '复制为 Markdown'],['Rerun this turn', '重新运行本消息'],['View all history', '查看所有历史记录'],['The fastest way from prompt to production with Gemini', '从提示到生产，使用 Gemini 实现最快路径'],
    ['Display of Search Suggestions is required when using Grounding with Google Search. ', '使用 Google 搜索的 Grounding 功能时，必须显示搜索建议'],['Learn more', '了解详情'],['Sources', '来源'],['My Drive', '我的Google云盘'],['Upload File', '上传文件'],['Record Audio', '录制音频'],
    ['Select or upload a file on Google Drive to include in your prompt', '在 Google 云端硬盘中选择或上传文件以包含在您的提示中'],['Upload a file to Google Drive to include in your prompt', '将文件上传到 Google 云端硬盘以包含在您的提示中'],['Camera', '相机'],['YouTobe Video', 'YouTobe 视频'],
    ['Build apps with Gemini', '使用 Gemini 构建应用'],['Start from a template', '从模板开始'],['Dynamic text game using Gemini', '使用 Gemini 的动态文本游戏'],['Gemini powered code review tool', 'Gemini 驱动的代码审查工具'],['Add files', '添加文件'],['Usage', '使用情况'],['Billing', '计费'],
    ['Gemini speech generation', 'Gemini 语音生成'],['Lyria RealTime', 'Lyria 实时'],['Talk to Gemini live', '与 Gemini 即时交流'],['Talk', '讲话'],['Webcam', '使用摄像头'],['Share Screen', '共享屏幕'],['Insert assets such as images, videos, folders, files, or audio', '插入图片、视频、文件夹、文件或音频等资源'],
    ['All context lengths', '所有上下文长度'], ['Text', '文本'],['Switch model?', '切换模型？'],['Switching to this model will start a new chat.', '切换这个模型将会在新聊天中对话'],['Do you want to continue?', '您要继续吗?'],['Switching to this model will remove the images from your prompt', '切换到此模型将从提示中删除图像'],

    // Gemini 3 系列 / Nano Banana
    ['Gemini 3 Pro Preview', 'Gemini 3 Pro 预览版'],
    ['Gemini 3 Flash Preview', 'Gemini 3 Flash 预览版'],
    ['gemini-3-pro-preview', 'gemini-3-pro-preview'],
    ['Nano Banana', 'Nano Banana'],
    ['gemini-2.5-flash-image', 'gemini-2.5-flash-image'],
    ['Gemini 2.5 Pro', 'Gemini 2.5 Pro'],
    ['Gemini Flash Latest', 'Gemini Flash 最新版'],
    ['State-of-the-art image generation and editing model.', '最先进的图像生成和编辑模型。'],
    ['(aka Gemini 2.5 Flash Image) State-of-the-art image generation and editing model.', '（又名 Gemini 2.5 Flash Image）最先进的图像生成和编辑模型。'],
    ['gemini-2.5-flash-image-preview', 'Gemini-2.5-flash-image-preview'],

    // Playground & Imagen 4
    ['Playground', '实验区'],
    ['Our latest image generation model, with significantly better text rendering and better overall image quality.', '我们最新的图像生成模型，具有显著提升的文本渲染效果和更佳的整体图像质量。'],
    ['Unknown', '未知'],

    // Gemini 2.0 / TTS / Veo / Robotics
    ['Gemini 2.0 Flash', 'Gemini 2.0 Flash'],
    ['Our most balanced multimodal model with great performance across all tasks.', '我们最均衡的多模态模型，在所有任务中都表现出色。'],
    ['Gemini 2.0 Flash-Lite', 'Gemini 2.0 Flash-Lite'],
    ['Gemini 2.5 Flash Native Audio Preview 09-2025', 'Gemini 2.5 Flash 原生音频预览版 09-2025'],
    ['Our native audio models optimized for higher quality audio outputs with better pacing, voice naturalness, verbosity, and mood.', '我们的原生音频模型经过优化，可提供更高质量的音频输出，具有更好的节奏、声音自然度、详细程度和情绪。'],
    ['Gemini 2.5 Pro Preview TTS', 'Gemini 2.5 Pro 预览版 TTS'],
    ['Our 2.5 Pro text-to-speech audio model optimized for powerful, low-latency speech generation for more natural outputs and easier to steer prompts.', '我们的 2.5 Pro 文本转语音音频模型为强大、低延迟的语音生成进行了优化，以实现更自然的输出和更容易引导的提示。'],
    ['Gemini 2.5 Flash Preview TTS', 'Gemini 2.5 Flash 预览版 TTS'],
    ['Our 2.5 Flash text-to-speech audio model optimized for price-performant, low-latency, controllable speech generation.', '我们的 2.5 Flash 文本转语音音频模型为高性价比、低延迟、可控的语音生成进行了优化。'],
    ['Veo 2', 'Veo 2'],
    ['Our state-of-the-art video generation model, available to developers on the paid tier of the Gemini API.', '我们最先进的视频生成模型，可通过 Gemini API 的付费层级提供给开发者使用。'],
    ['Gemini Robotics-ER 1.5 Preview', 'Gemini Robotics-ER 1.5 预览版'],
    ['Gemini Robotics-ER, short for Gemini Robotics-Embodied Reasoning, is a thinking model that enhances robots\' abilities to understand and interact with the physical world.', 'Gemini Robotics-ER，即 Gemini 机器人具身推理的缩写，是一种思维模型，可增强机器人理解物理世界并与之互动的能力。'],

    // --- 图片 1: Veo 3.1 系列 ---
    ['Veo 3.1', 'Veo 3.1'],
    ['Veo 3.1 fast', 'Veo 3.1 fast'],
    ['Our latest video generation model, available to developers on the paid tier of the Gemini API.', '我们最新的视频生成模型，可通过 Gemini API 的付费层级提供给开发者使用。'],
    ['A faster, more accessible version of Veo 3.1, optimized for speed and business use cases. Available to developers on the paid tier of the Gemini API.', 'Veo 3.1 的更快、更易用的版本，针对速度和业务用例进行了优化。可通过 Gemini API 的付费层级提供给开发者使用。'],

    // --- 图片 2: Gemini 2.5 Flash Native Audio ---
    ['Gemini 2.5 Flash Native Audio Preview 12-2025', 'Gemini 2.5 Flash 原生音频预览版 12-2025'],
    ['Our native audio model optimized for higher quality audio outputs with better pacing, voice naturalness, verbosity, and mood.', '我们的原生音频模型，经过优化可提供更高质量的音频输出，具有更好的节奏、语音自然度、详细程度和情绪。'],
    ['Audio/Video', '音频/视频'],

    // —— 语音 (TTS) 与音频 ——
    ['Style instructions', '风格指令'],
    ['Single-speaker audio', '单人语音'],
    ['Multi-speaker audio', '多人语音'],
    ['Model settings', '模型设置'],
    ['Voice', '音色'],
    ['Voice settings', '音色设置'],
    ['Raw structure', '原始结构'],
    ['Script builder', '脚本构建器'],
    ['Add dialog', '添加对话'],
    ['Start writing or paste text here to generate speech', '在此输入或粘贴文本以生成语音'],
    ['The below reflects how to structure your script in your API request.', '下图展示了如何在 API 请求中构建脚本结构。'],
    ['Read aloud in a warm and friendly tone:', '以温暖友好的语气朗读：'],
    ['Read aloud in a warm, welcoming tone', '以温暖、欢迎的语气朗读'],
    // 底部示例 Chips
    ['Use Gemini to read a disclaimer, really fast', '让 Gemini 快速朗读免责声明'],
    ['Campfire story', '篝火故事'],
    ['Use Gemini to greet you', '让 Gemini 向你问好'],
    ['Podcast transcript', '播客文字稿'],
    ['Audio voice assistant', '语音助手'],
    ['Movie scene script', '电影场景剧本'],

    // —— Veo (视频生成) ——
    ['Generate videos with Veo', '使用 Veo 生成视频'],
    ['Number of results', '结果数量'],
    ['Aspect ratio', '画面比例'],
    ['Video duration', '视频时长'],
    ['Frame rate', '帧率'],
    ['Output resolution', '输出分辨率'],
    ['Negative prompt', '负面提示词'],
    ['Describe your video', '描述您的视频'],
    ['Content from previous turns is not referenced in new requests', '新请求不会引用上一轮的内容'],
    // —— 构建页面 (Build) ——
    ['Recently viewed', '最近查看'],
    ['Created by you', '由你创建'],
    ['Created by others', '由他人创建'],
    ['Explore the gallery', '探索图库'],
    ['Create a new app', '创建新应用'],
    ['Search for an app', '搜索应用'],
    ['No apps yet. As you build and view apps, they\'ll appear here.', '尚无应用。您构建和查看的应用将显示在此处。'],
    ['Back to start', '返回首页'],
    ['Code assistant', '代码助手'],
    ['Preview', '预览'],
    ['Code', '代码'],
    ['Fullscreen', '全屏'],
    ['Device', '设备'],
    ['Delete app', '删除应用'],
    ['Copy app', '复制应用'],
    ['Download app', '下载应用'],
    ['Share app', '分享应用'],
    ['Select device preview', '选择设备预览'],
    ['Open version history', '查看历史版本'],
    ['Switch to API Key for your app', '为您的APP切换API Key'],
    [' Edit app name and description', '编辑项目名称与概述'],
    // —— Build (构建应用) 模板卡片 ——
    ['Supercharge your apps with AI', '用 AI 为您的应用赋能'],
    ['Nano banana powered app', 'Nano Banana 驱动的应用'],
    ['Add powerful photo editing to your app. Allow users to add objects, remove backgrounds, or change a photo\'s style just by typing.', '为您的应用添加强大的照片编辑功能。允许用户仅通过打字即可添加对象、移除背景或更改照片风格。'],
    ['Create conversational voice apps', '创建对话式语音应用'],
    ['Use the Gemini Live API to give your app a voice and make your own conversational experiences.', '使用 Gemini Live API 为您的应用赋予语音能力，打造您自己的对话体验。'],
    ['Animate images with Veo', '使用 Veo 制作图像动画'],
    ['Bring images to life with Veo 3. Let users upload a product photo and turn it into a dynamic video ad, or animate a character\'s portrait.', '使用 Veo 3 让图像栩栩如生。让用户上传产品照片并将其转化为动态视频广告，或让角色肖像动起来。'],
    ['Use Google Search data', '使用 Google 搜索数据'],
    ['Connect your app to real-time Google Search results. Build an agent that can discuss current events, cite recent news, or fact-check information.', '将应用连接到实时 Google 搜索结果。构建一个可以讨论时事、引用最近新闻或核查信息的智能体。'],

    // —— App Gallery (应用创意图库) ——
    ['Discover and remix app ideas', '发现并改编应用创意'],
    ['Browse the app gallery', '浏览应用图库'],
    ['Flash UI', 'Flash UI 界面生成'],
    ['Put Gemini 3 Flash\'s creativity and coding abilities to the test. Rapidly generate UI, explore variations, and export code.', '测试 Gemini 3 Flash 的创造力和编程能力。快速生成 UI、探索变体并导出代码。'],
    ['Voxel Toy Box', '体素玩具箱'],
    ['Create, visualize, and rebuild sculptures using the same set of blocks.', '使用同一套积木创建、可视化和重建雕塑。'],
    ['Shader Pilot', 'Shader Pilot (着色器向导)'],
    ['Navigate a complex 3d world with customizable interactions.', '浏览具有可定制交互的复杂 3D 世界。'],
    ['Research Visualization', '研究可视化'],
    ['Research paper reimagined as an elegant, interactive narrative site.', '将研究论文重构为优雅、互动的叙事网站。'],
  ]);

  const PARTIAL = [
    { pattern: /^\s*Google\s+AI\s+models\s*$/i, replace: 'Google AI 模型' },
    { pattern: /^\s*may\s+make\s+mistakes[\s\S]*?double-check\s+outputs\.?\s*$/i, replace: '可能出错，请务必复核输出。' },
    { pattern: /^Design a custom birthday card.*$/i, replace: '设计一张定制生日贺卡' },
    { pattern: /^Try\s+(.+)$/i, replace: '试试 $1' },
    { pattern: /^Closing the chat will lose the data\. Do you want to continue\?$/i, replace: '关闭此聊天将丢失数据，是否继续？' },
    { pattern: /\bText\b\s*[:：]\s*/i, replace: '文本：' },
    { pattern: /\bImage\b\s*\(\*?Output per image\)\s*[:：]\s*/i, replace: '图像（每张输出）：' },
    { pattern: /\bKnowledge cut ?off\b\s*[:：]\s*/i, replace: '知识截止：' },
    { pattern: /\bInput\b\s*[:：]\s*/i, replace: '输入：' },
    { pattern: /\bOutput\b\s*[:：]\s*/i, replace: '输出：' },
    { pattern: /\bWhat'?s new\b/i, replace: '最新动态' },
    { pattern: /\bTry an example app\b/i, replace: '试用示例应用' },
    { pattern: /^Add stop\b.*$/i, replace: '添加停止序列…' },
    { pattern: /\bOutput tokens?\b.*$/i, replace: '输出长度' },
    { pattern: /\bTop\s*P\b/i, replace: 'Top‑P' },
    { pattern: /\bTop\s*K\b/i, replace: 'Top‑K' },
    { pattern: /^Selected[:\s]+(.+?)$/i, replace: '已选择 $1' },
    { pattern: /\bURL context tool\b/i, replace: 'URL 上下文工具' },
    { pattern: /\bNative speech generation\b/i, replace: '原生语音生成' },
    { pattern: /\bLive audio-to-audio dialog\b/i, replace: '实时语音对话' },
    { pattern: /Google AI models may make mistakes.*double-check outputs\.?/i, replace: 'Google AI 模型可能出错，请务必复核输出。' },
    { pattern: /This model has limited free quota for testing\.?/i, replace: '此模型的免费配额仅用于测试' },
    { pattern: /Stop\s+generation\s+before\s+creating\s+a\s+new\s+chat/i, replace: '创建新对话前请停止生成' },
    { pattern: /To generate images beyond the limit or use the model in your projects, use the Gemini API\.?/i, replace: '若需超限生成或在项目中使用，请使用 Gemini API' },
    { pattern: /^Speaker\s+(?<num>\d+)(?<suffix>\s+settings)?$/i, replace: ({ groups }) => `演讲者 ${groups.num}${groups.suffix ? ' 设置' : ''}`},
    // 处理指向文本
    { pattern: /^Points to\s+(.+)$/i, replace: '指向 $1' },
    { pattern: /\bAudio\/Video\b/i, replace: '音频/视频' },
    { pattern: /\bInput\b/i, replace: '输入' },
    { pattern: /\bOutput\b/i, replace: '输出' },
  ];

  // —— 动态数字解析 ——
  function compactToNumber(str) {
    const m = String(str).replace(/[, ]/g, '').match(/^([\d.]+)\s*([kKmMbBtT])?$/);
    if (!m) return Number(str) || NaN;
    const n = parseFloat(m[1]);
    const s = (m[2] || '').toUpperCase();
    const factor = s === 'K' ? 1e3 : s === 'M' ? 1e6 : s === 'B' ? 1e9 : s === 'T' ? 1e12 : 1;
    return n * factor;
  }
  function formatCnShort(n) {
    if (!isFinite(n)) return '';
    if (n >= 1e12) return (n / 1e12).toFixed(n % 1e12 ? 1 : 0).replace(/\.0$/, '') + '万亿';
    if (n >= 1e8) return (n / 1e8 ).toFixed(n % 1e8 ? 1 : 0).replace(/\.0$/, '') + '亿';
    if (n >= 1e4) return (n / 1e4 ).toFixed(n % 1e4 ? 1 : 0).replace(/\.0$/, '') + '万';
    return String(Math.round(n));
  }

  // —— 动态句式（命名捕获 + 回调） ——
  const DYNAMIC = [
    // 模型卡：Gemini 3 Pro 复杂描述
    {
      pattern: /Our\s+most\s+intelligent\s+model\s+with\s+SOTA\s+reasoning\s+and\s+multimodal\s+understanding,?\s+and\s+powerful\s+agentic\s+and\s+vibe\s+coding\s+capabilities\.?/i,
      replace: '我们最智能的模型，具备 SOTA 推理和多模态理解能力，以及强大的智能体和 Vibe 编程能力。'
    },
    // Gemini 3 Flash
    {
      pattern: /Our\s+most\s+intelligent\s+model\s+built\s+for\s+speed,\s+combining\s+frontier\s+intelligence\s+with\s+superior\s+search\s+and\s+grounding\.?/i,
      replace: '我们最智能的模型专精速度，结合前沿情报具有卓越的搜索和嵌入能力。'
    },
    // 模型卡：混合推理 + 上下文 + 思考预算
    {
      pattern: /Our\s+hybrid\s+reasoning\s+model,\s+with\s+(?:up\s+to\s+)?(?:an?\s+)?(?<num>[\d.,]+(?:\s*[kKmMbBtT])?)\s+token\s+context\s+window(?:\s+and\s+thinking\s+budgets)?\.?/i,
      replace: ({ groups }) => {
        const n = compactToNumber(groups?.num || '');
        const cn = isFinite(n) ? `${formatCnShort(n)} token` : `${groups?.num || ''} token`;
        return `混合推理模型，拥有 ${cn} 上下文窗口，并支持思考预算。`;
      }
    },
    // 模型卡：最强推理 (旧版)
    {
      pattern: /Our\s+most\s+powerful\s+reasoning\s+model,?\s+which\s+excels\s+at\s+coding\s+and\s+complex\s+reasoning\s+tasks\.?/i,
      replace: () => '最强推理模型，擅长编程与复杂推理任务。'
    },
    // 模型卡：高级推理 (Gemini 2.5 Pro)
    {
      pattern: /Our\s+advanced\s+reasoning\s+model,?\s+which\s+excels\s+at\s+coding\s+and\s+complex\s+reasoning\s+tasks\.?/i,
      replace: () => '我们的高级推理模型，擅长编程和复杂推理任务。'
    },
    // 模型卡：最小高性价比
    {
      pattern: /Our\s+smallest\s+and\s+most\s+cost\s+effective\s+model,?\s+built\s+for\s+at\s+scale\s+usage\.?/i,
      replace: () => '体量最小且高性价比的模型，适用于大规模使用。'
    },
    // “知识截止：”前缀
    {
      pattern: /\bKnowledge cut ?off\b\s*:\s*(?<rest>.+)$/i,
      replace: ({ groups }) => `知识截止：${groups?.rest || ''}`
    },

    // —— 输入框动态示例（通用指令句） ——
    {
      pattern: /^Plot\s+(?<expr>.+?)\s+from\s+(?<a>.+?)\s+to\s+(?<b>.+?)\.\s*Generate\s+the\s+resulting\s+graph\s+image\.?$/i,
      replace: ({ groups }) => `绘制 ${groups?.expr || ''} 在区间 ${groups?.a || ''} 到 ${groups?.b || ''} 的曲线。生成对应的图像。`
    },
    {
      pattern: /^Explain\s+the\s+probability\s+of\s+(?<topic>.+?)\.?$/i,
      replace: ({ groups }) => `解释 ${groups?.topic || ''} 的概率。`
    },
    {
      pattern: /^Generate\s+Python\s+code\s+for\s+(?<task>.+?)\.?$/i,
      replace: ({ groups }) => `生成用于 ${groups?.task || ''} 的 Python 代码。`
    },
    {
      pattern: /^(?:Create|Design)\s+(?:a|an)\s+(?<thing>.+?)\.?$/i,
      replace: ({ groups }) => `创建/设计 ${groups?.thing || ''}。`
    },
    {
      pattern: /^Translate\s+(?<src>.+?)\s+to\s+(?<dst>.+?)\.?$/i,
      replace: ({ groups }) => `将 ${groups?.src || ''} 翻译为 ${groups?.dst || ''}。`
    }
  ];

  // —— 属性与排除配置 ——
  const ATTRS = [
    'title','placeholder','alt',
    'aria-label','aria-description','aria-placeholder','aria-valuetext','aria-roledescription',
    'data-tooltip','data-title','aria-modal'
  ];
  const EXCLUDE_TAGS = new Set(['SCRIPT','STYLE','TEXTAREA','CODE','PRE']);
  const MARK = 'data-i18n-zh';
  const DIALOG_SELECTORS = [
    'dialog','[role="dialog"]','[role="alertdialog"]','[aria-modal="true"]',
    '.MuiModal-root','.MuiDialog-root','.MuiPopover-root','.MuiMenu-root','.MuiTooltip-popper',
    '.MuiSnackbar-root', '.MuiAlert-root', '[role="status"]'
  ].join(',');

  // —— 翻译器（精确 → 模糊 → 动态） ——
  function translateText(text) {
    if (!text) return null;
    const original = String(text);
    const trimmed = original.trim();
    if (!trimmed) return null;

    if (EXACT.has(trimmed)) return original.replace(trimmed, EXACT.get(trimmed));
    for (let i = 0; i < PARTIAL.length; i += 1) {
      const { pattern, replace } = PARTIAL[i];
      if (pattern.test(original)) return original.replace(pattern, replace);
    }
    for (let i = 0; i < DYNAMIC.length; i += 1) {
      const { pattern, replace } = DYNAMIC[i];
      if (pattern.test(original)) {
        return original.replace(pattern, (...args) => {
          const last = args[args.length - 1];
          const groups = last && typeof last === 'object' ? last : undefined;
          return typeof replace === 'function' ? replace({ groups }) : replace;
        });
      }
    }
    return null;
  }

  function translateTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const nv = translateText(node.nodeValue);
    if (nv && nv !== node.nodeValue) {
      node.nodeValue = nv;
      if (node.parentElement) node.parentElement.setAttribute(MARK, '1');
    }
  }

  function translateAttributes(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
    let changed = false;
    for (let i = 0; i < ATTRS.length; i += 1) {
      const attr = ATTRS[i];
      if (el.hasAttribute(attr)) {
        const v = el.getAttribute(attr);
        const nv = translateText(v);
        if (nv && nv !== v) { el.setAttribute(attr, nv); changed = true; }
      }
    }
    if (changed) el.setAttribute(MARK, '1');
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.ELEMENT_NODE && EXCLUDE_TAGS.has(root.tagName)) return;
    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);

    let walker;
    try {
      walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          const v = n && n.nodeValue;
          if (!v || !String(v).trim()) return NodeFilter.FILTER_REJECT;
          const p = n.parentElement;
          if (!p) return NodeFilter.FILTER_ACCEPT;
          if (EXCLUDE_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
          if (p.isContentEditable) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
    } catch { return; }

    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
    if (root.shadowRoot) walk(root.shadowRoot);
  }

  function observe(target) {
    if (!target) return;
    const obs = new MutationObserver((list) => {
      for (let i = 0; i < list.length; i += 1) {
        const m = list[i];
        if (m.type === 'childList') {
          for (let j = 0; j < m.addedNodes.length; j += 1) {
            const n = m.addedNodes[j];
            if (n.nodeType === Node.ELEMENT_NODE) {
              walk(n);
              if (n.matches && n.matches(DIALOG_SELECTORS)) walk(n);
              if (n.querySelector) n.querySelectorAll(DIALOG_SELECTORS).forEach(d => walk(d));
              if (n.tagName === 'IFRAME') handleIframe(n);
            } else if (n.nodeType === Node.TEXT_NODE) {
              translateTextNode(n);
            }
          }
        } else if (m.type === 'characterData') {
          translateTextNode(m.target);
        } else if (m.type === 'attributes') {
          translateAttributes(m.target);
          if (m.target.matches && m.target.matches(DIALOG_SELECTORS)) walk(m.target);
        }
      }
    });
    obs.observe(target, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
  }

  // 同源 iframe
  function handleIframe(ifr) {
    try {
      const doc = ifr.contentDocument;
      if (doc && doc.documentElement) { walk(doc.documentElement); observe(doc.documentElement); }
    } catch (e) { /* 跨源受限 */ }
  }
  function scanIframes() { document.querySelectorAll('iframe').forEach(handleIframe); }

  // SPA 路由监听
  let lastURL = location.href;
  function scheduleFullScan() {
    queueMicrotask(() => {
      lastURL = location.href;
      walk(document.documentElement);
      scanIframes();
      document.querySelectorAll(DIALOG_SELECTORS).forEach(walk);
    });
  }
  function onUrlMaybeChanged() { if (location.href !== lastURL) scheduleFullScan(); }
  const _ps = history.pushState;
  history.pushState = function (s,t,u){ const r = _ps.apply(this, arguments); onUrlMaybeChanged(); return r; };
  const _rs = history.replaceState;
  history.replaceState = function (s,t,u){ const r = _rs.apply(this, arguments); onUrlMaybeChanged(); return r; };
  window.addEventListener('popstate', onUrlMaybeChanged);
  window.addEventListener('hashchange', onUrlMaybeChanged);

  // Shadow DOM
  const _attachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (options) {
    const root = _attachShadow.call(this, options);
    if (options && options.mode === 'open') queueMicrotask(() => { walk(root); observe(root); });
    return root;
  };

  // 对话框聚焦时补扫
  window.addEventListener('focusin', (e) => {
    const el = e.target;
    if (!el || !el.closest) return;
    const dlg = el.closest(DIALOG_SELECTORS);
    if (dlg) walk(dlg);
  });

  // 启动
  function start() {
    walk(document.documentElement);
    observe(document.documentElement);
    scanIframes();
    document.querySelectorAll(DIALOG_SELECTORS).forEach(walk);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();