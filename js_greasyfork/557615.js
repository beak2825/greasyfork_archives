// ==UserScript==
// @name         You.com 汉化脚本(船仓完美版)
// @namespace    https://github.com/izscc
// @version      2.6
// @description  对 You.com 网站界面进行完美汉化，融合全量字典与高性能遍历逻辑。
// @author       zscc.in
// @match        https://you.com/*
// @match        https://www.you.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=you.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557615/Youcom%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC%28%E8%88%B9%E4%BB%93%E5%AE%8C%E7%BE%8E%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557615/Youcom%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC%28%E8%88%B9%E4%BB%93%E5%AE%8C%E7%BE%8E%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =================================================================
    // 1. 汉化字典 (Full Dictionary)
    // =================================================================
    const i18n = new Map([
        // --- 核心侧边栏 & 导航 (Core) ---
        ['Main menu', '主菜单'],
        ['Close Sidebar', '关闭侧边栏'],
        ['Search chats', '搜索对话'],
        ['New Chat', '新建对话'],
        ['Projects', '项目'],
        ['Add new Project', '新建项目'],
        ['Agents', '智能体'],
        ['Add new Agent', '新建智能体'],
        ['Attached Sources', '附加来源'],
        ['Manage', '管理'],
        ['Everything I need for my upcoming Tokyo trip – bookmarking must-see attractions, comparing neighborhood stays, and collecting local food recommendations.', '我即将前往东京所需的一切——标记必看景点、比较社区住宿，以及收集当地美食推荐。'],
        ['1 sources', '1 个来源'],
        ['2 sources', '2 个来源'],
        ['3 sources', '3 个来源'],
        ['4 sources', '4 个来源'],
        ['5 sources', '5 个来源'],
        ['6 sources', '6 个来源'],
        ['7 sources', '7 个来源'],
        ['8 sources', '8 个来源'],
        ['9 sources', '9 个来源'],
        ['Platform', '平台'],
        ['Favorites', '收藏'],
        ['History', '历史记录'],
        ['View chat thread actions', '查看对话操作'],
        ['Refer a friend', '推荐好友'],
        ['Give $10, get $10', '送$10，得$10'],
        ['Invite friends', '邀请朋友'],
        ['Get the app', '获取应用'],
        ['Web Search API', 'Web 搜索 API'],
        ['Enterprise Solutions', '企业解决方案'],
        ['More', '更多'],
        ['Delete all chats', '删除所有对话'],
        ['This will permanently delete all your chats, including favorites. This action cannot be undone.', '这将永久删除所有对话，包括收藏。此操作无法撤销。'],
        ['Cancel & Exit', '取消并退出'],
        ['Yes, clear history', '是，清空历史'],
        ['Confirm account deletion', '确认账户删除'],
        ['Before you delete your account, please take a moment to understand what will happen to your data:', '在删除账户之前，请花一点时间了解您的数据会发生什么：'],
        ['Your profile details, preferences, and settings will be removed.', '您的个人资料、偏好设置和设置将被删除。'],
        ['Your search history, threads, and any other content you\'ve shared will be deleted.', '您的搜索历史、对话记录以及您分享的任何其他内容都将被删除。'],
        ['All data will be permanently deleted 30 days after account deletion.', '所有数据将在账户删除后30天永久删除。'],
        ['If you have an active Pro subscription, please click', '如果您有有效的专业版订阅，请点击'],
        ['“Subscription”', '“订阅”'],
        ['“, then “', '，然后'],
        ['“Cancel”', '“取消”'],
        ['“ to cancel your subscription before deleting your account.“', '以在删除账户前取消您的订阅。'],
        ['Confirm', '确认'],
        ['Build your own custom Agent', '构建您自己的智能体'],
        ['Tailored to answer questions for your specific needs', '量身定制以回答您特定的问题'],
        ['Mobile App', '移动应用'],
        ['Default Extension', '默认扩展'],
        ['AI Agent Extension', 'AI 智能体扩展'],
        ['Auto', '自动'],
        ['User Profile', '用户资料'],
        ['Pro plan', 'Pro 计划'],
        ['Enhance your productivity with AI', '利用 AI 提升效率'],
        ['Log Out', '退出登录'],
        ['Log out of my account', '退出我的账户'],
        ['Sign In', '登录'],
        ['Sign Up', '注册'],

        // --- 聊天区域 (Chat Area) ---
        ['Ask a question', '有什么可以帮您？'],
        ['How can I help?', '我能为您做什么？'],
        ['Ask me anything...', '问我任何问题...'],
        ['Open web search settings', '打开网页搜索设置'],
        ['Open manage sources modal', '打开源管理'],
        ['Attach', '附件'],
        ['Start Dictation', '开始语音输入'],
        ['Explore our Agents or create your own', '探索智能体或创建您自己的'],
        ['See all', '查看全部'],
        ['Create new agent', '创建新智能体'],
        ['Research', '深度研究'],
        ['Deep research with industry-leading accuracy', '具有行业领先准确性的深度研究'],
        ['Analyze evolution of LLMs for work', '分析 LLM 在工作中的演变'],
        ['Review CRISPR medical impact', '回顾 CRISPR 的医学影响'],
        ['Map superhero VFX evolution', '绘制超级英雄特效演变图'],
        ['Compute', '计算'],
        ['Solve complex data and engineering challenges', '解决复杂的数据和工程挑战'],
        ['Assess carbon capture', '评估碳捕获'],
        ['by 2050', '到 2050 年'],
        ['Chart interest rate patterns', '绘制利率模式图'],
        ['Graph compound growth by sector', '按行业绘制复合增长图'],
        ['Create', '创作'],
        ['Transform ideas into polished images and visuals', '将想法转化为精美的图像和视觉效果'],
        ['Snowy Japanese Instagram coffee ad', '雪景日式 Instagram 咖啡广告'],
        ['Luxury apartment layout', '豪华公寓布局'],
        ['Modern pharmacy poster', '现代药房海报'],
        ['Regenerate', '重新生成'],
        ['Copy', '复制'],
        ['Connect custom agents to your external apps and workflows via our API', '通过 API 将智能体连接到您的外部应用和工作流'],
        ['Go to you.platform', '前往开发者平台'],

        // --- 更多菜单 (More Menu) ---
        ['Follow us on X', '在 X 上关注我们'],
        ['Connect on LinkedIn', '在 LinkedIn 上连接'],
        ['Join the community', '加入社区'],
        ['Careers', '招聘'],
        ['Share Feedback', '分享反馈'],
        ['About You.com', '关于 You.com'],
        ['Knowledge Base', '知识库'],
        ['Workflow', '工作流'],
        ['Thinking', '思考中'],
        ['Developing a plan', '正在制定计划'],
        ['Researching', '正在研究'],
        [' sources read', ' 个来源已阅读'],
        ['Reflecting', '正在反思'],
        ['Responding', '正在回复'],
        ['Export as CSV', '导出为 CSV'],
        ['Copy text', '复制文本'],
        ['Export', '导出'],
        ['Try again', '重试'],
        ['Images', '图片'],
        ['Videos', '视频'],
        ['News', '新闻'],
        ['View all ', '查看所有 '],
        [' sources', ' 个来源'],
        ['You may also want to ask', '您可能还想问'],
        ['Favorite', '收藏'],
        ['Share thread', '分享对话'],
        ['Add to Favorites', '添加到收藏'],
        ['Add to Project', '添加到项目'],
        ['This answer is helpful and/or accurate. Provide feedback on this result.', '这回答很有帮助且准确。请就这个结果提供反馈。'],
        ['This answer is not helpful, accurate, and/or safe. Provide feedback on this result.', '这回答没有帮助，准确或安全。请就这个结果提供反馈。'],
        ['Export as DOCX', '导出为 DOCX'],
        ['Export as RTF', '导出为 RTF'],
        ['Export as MD', '导出为 MD'],
        ['Copy Formatted', '复制格式化'],
        ['Copy Markdown', '复制 Markdown'],
        ['Ask a follow-up...', '问一个跟进问题...'],
        ['Choose a project', '选择一个项目'],
        ['No project', '没有项目'],
        ['Suggestions', '建议'],
        ['Create new project', '创建新项目'],
        ['No projects have been shared with you yet', '还没有项目被分享给你'],
        ['Key Takeaway', '关键要点'],
        ['Share transcript', '分享对话'],
        ['Copy', '复制'],
        ['Terms', '条款'],
        ['Privacy', '隐私'],
        ['Cookie Settings', 'Cookie 设置'],
        ['Help', '帮助'],

        // --- 设置 & 个人资料 (Settings) ---
        ['Settings', '设置'],
        ['Account Settings', '账户设置'],
        ['General', '通用'],
        ['Appearance', '外观'],
        ['Security & Privacy', '安全与隐私'],
        ['Subscription', '订阅管理'],
        ['Integrations', '集成'],
        ['User Preferences', '用户偏好'],
        ['Chat', '聊天'],
        ['Web Search', '网页搜索'],
        ['Team', '团队'],
        ['Set up Team', '设置团队'],
        ['Invites', '邀请'],
        ['Advanced', '高级'],
        ['Email', '邮箱'],
        ['Terminate your current session on this device', '终止此设备上的当前会话'],

        // --- 模态框与通用 UI (Modals & Common) ---
        ['Supported files:', '支持的文件：'],
        ['text', '文本'],
        ['data', '数据'],
        ['code', '代码'],
        ['images', '图片'],
        ['Upload Files', '上传文件'],
        ['Supported files: text, data, code, & images', '支持的文件：文本、数据、代码和图像'],
        ['Drop files here, or import from:', '将文件拖到此处，或从以下导入：'],
        ['My Computer', '我的电脑'],
        ['Add links', '添加链接'],
        ['Link URL', '链接地址'],
        ['To search an entire website, enter the domain address. To search a specific page or subdirectory, enter its URL.', '要搜索整个网站，请输入域名。要搜索特定页面或子目录，请输入其 URL。'],
        ['Search the web', '搜索网络'],
        ['You.com will search the web for additional sources', 'You.com 将搜索网络以获取更多来源'],
        ['Current selection', '当前选择'],
        ['Files & links', '文件与链接'],
        ['No files or links added', '未添加文件或链接'],
        ['Total size', '总大小'],
        ['Cancel', '取消'],
        ['Save & close', '保存并关闭'],
        ['Learn more about source management', '了解更多关于源管理的信息'],
        ['Search', '搜索'],
        ['Add', '添加'],
        ['On', '开启'],
        ['Off', '关闭'],
        ['Default', '默认'],
        ['Low', '低'],
        ['High', '高'],
        ['Auto', '自动'],
        ['Search your chats for...', '搜索你的对话'],
        ['Name', '名称'],
        ['You don’t have any invites at this time.', '你目前没有邀请。'],
        ['Search your chats to add them to "Prompt研究"', '搜索你的对话以添加到 Prompt研究'],
        ['Start a new chat in Prompt研究', '开始新的对话'],
        ['Change Project', '更改项目'],
        ['Remove from Favorites', '从收藏夹中移除'],
        ['Updated: ', '更新于：'],
        ['Add chats', '添加对话'],
        ['Chat threads', '对话线程'],
        ['Search Effort', '搜索力度'],
        ['Choose the right balance between speed and detail', '选择速度与细节之间的平衡'],
        ['Exclude specific web sources', '排除特定网页来源'],
        ['Enter URLs to exclude', '输入要排除的 URL'],
        ['Press Enter to add a URL', '按回车键添加 URL'],

        // --- 智能体与模型 (Agents & Models) ---
        ['Select AI mode', '选择AI模型'],
        ['Customize search settings', '自定义搜索设置'],
        ['Add new', '新增'],
        ['Experience the advanced capabilities of AI with Custom Agents', '体验自定义智能体的高级功能'],
        ['Models', '模型列表'],
        ['Explore leading AI models, enhanced by You.com AI', '探索 You.com 增强的领先 AI 模型'],
        ['New & Popular', '新模型 & 热门'],
        ['Search the web for relevant info', '联网搜索相关信息'],
        ['Advanced options', '高级选项'],
        ['Agent name is required', '智能体名称为必填项'],
        ['Let you.com suggest follow up queries', '允许 You.com 建议后续追问'],
        ['Enable your AI to personalize responses based on your personalization info', '根据您的个性化信息定制 AI 回答'],
        ['Enable you.com to research more sources and reason in multiple steps', '允许 You.com 进行多步深度研究与推理'],
        ['Use Agents to complete complex tasks or automate your workflows', '使用智能体完成复杂任务或自动化工作流'],
        ['Create new Agent', '创建智能体'],
        ['Agent name', '智能体名称'],
        ['Name your agent', '为您的智能体命名'],
        ['Description', '描述'],
        ['Explain what your custom agent can do', '解释您的自定义智能体能做什么'],
        ['Response model', '响应模型'],
        ['Sources', '来源'],
        ['Manage Sources', '管理来源'],
        ['Share access', '分享权限'],
        ['Choose who has access to this agent', '选择谁可以访问此智能体'],
        ['Manage share settings', '管理分享设置'],
        ['Attached sources, files, and instructions can be queried by the end user. Share responsibly.', '最终用户可查询附件和指令。请负责任地分享。'],
        ['Include follow up questions', '包含追问'],
        ['Include personalization, if enabled', '包含个性化(如启用)'],
        ['Enable advanced research & reasoning', '启用高级研究与推理'],
        ['Instructions', '指令'],
        ['See examples', '查看示例'],
        ['Enter your prompt here. Be creative, be bold, or just be straightforward. We\'ll handle it either way!', '在此输入提示词。发挥创意，或者直截了当。我们都能搞定！'],
        ['Delete my account', '注销账户'],
        ['Permanently delete your You.com account', '永久删除您的 You.com 账户'],

        // --- 项目 (Projects) ---
        ['Stay organized and productive by grouping your chats into Projects — with your team or just for you.', '通过项目分组管理对话，保持条理与高效。'],
        ['Your Projects', '您的项目'],
        ['Created by me', '我创建的'],
        ['Getting started with projects', '项目入门'],
        ['Want to group your market research by client? Or organize milestone deliverables? Projects are for you.', '想按客户分组市场研究？或管理里程碑交付物？项目功能正适合您。'],
        ['Create your first project', '创建第一个项目'],
        ['Sample Projects', '示例项目'],
        ['Travel Plan', '旅行计划'],
        ['Create project', '创建项目'],
        ['Share project', '分享项目'],
        ['Edit project', '编辑项目'],
        ['Delete project', '删除项目'],
        ['Remove from project', '从项目中移除'],

        // --- 时间 (Time) ---
        ['Today', '今天'],
        ['Yesterday', '昨天'],
        ['Previous 7 Days', '过去 7 天'],
        ['Previous 30 Days', '过去 30 天'],
        ['October', '十月'],
        ['November', '十一月'],
        ['December', '十二月'],
        ['January', '一月'],
        ['February', '二月'],
        ['March', '三月'],
        ['April', '四月'],
        ['May', '五月'],
        ['June', '六月'],
        ['July', '七月'],
        ['August', '八月'],
        ['September', '九月'],

        // --- 验证中发现的其他补充 ---
        ['Choose from 20+ AI models and agents', '从 20 多种 AI 模型和代理中进行选择'],
        ['Custom', '自定义'],
        ['Fast, reliable results for everyday tasks', '快速、可靠地完成日常任务'],
        ['Express', '快速'],
        ['AI that adapts—quick answers or advanced research and computation as needed', '可自适应的AI——根据需要提供快速答案或进行高级研究与计算'],
        ['All', '全部'],
        ['OFFICIAL', '官方'],
        ['By', '作者'],
        ['Filter Team Agents', '筛选团队智能体'],
        ['Open agent actions menu', '打开智能体菜单'],
        ['Open external app and extension links popover', '打开扩展链接'],
        ['Open Social, legal and resource links popover', '打开更多资源'],
        ['Recents', '最近访问'],
        ['Google Drive', 'Google 云端硬盘'],
        ['will', '将'],
        ['search the web for additional sources', '联网搜索更多来源'],
        ['Web search', '网页搜索'],
        ['Shared with me', '与我共享'],
        ['Team Agents', '团队智能体'],
        ['My Agents', '我的智能体'],
        ['Saved', '已保存'],
        ['By You.com', 'You.com 出品'],
        ['Finance', '金融'],
        ['Marketing', '营销'],
        ['Sales', '销售'],
        ['Engineering', '工程'],
        ['Product', '产品'],
        ['Data Analysis', '数据分析'],
        ['Consulting', '咨询'],
        ['Manage plan', '管理套餐'],
        ['ARI', 'ARI (智能助手)'],
        ['Agent for 10x deeper web research', '10倍深度的网络研究智能体'],
        ['Presentation Slide Generator', '演示幻灯片生成器'],
        ['Create tailored presentations, uncover target audience, develop outlines, draft content, apply voice and tone, get feedback, generate presentation content. Start with a greeting (\'hi\', \'hello\').', '创建定制演示文稿，发掘目标受众，制定大纲，起草内容，应用语调，获取反馈，生成演示内容。以问候语开头（如“你好”）。'],
        ['Strategic Report Generator', '战略报告生成器'],
        ['Create tailored reports, uncover target audience, develop outlines, draft content, apply voice and tone, get feedback, generate presentation or report content. Start with a greeting (\'hi\', \'hello\').', '创建定制报告，发掘目标受众，制定大纲，起草内容，应用语调，获取反馈，生成演示或报告内容。以问候语开头（如“你好”）。'],
        ['Porters 5 Forces', '波特五力分析'],
        ['Porter’s 5 Forces analysis evaluates competition, suppliers, buyers, new entrants, and substitutes, delivering actionable strategies in industries and markets. Start with a greeting (\'hi\', \'hello\').', '波特五力分析评估竞争、供应商、买家、新进入者和替代品，提供行业和市场的可操作策略。以问候语开头（如“你好”）。'],
        ['Counterpoint Agent', '反驳智能体'],
        ['Your AI thought partner that challenges assumptions, identifies blind spots, and tests reasoning in business documents to strengthen analysis. Start with a greeting (\'hi\', \'hello\').', '您的 AI 思维伙伴，挑战假设，识别盲点，并在商业文档中测试推理以加强分析。以问候语开头（如“你好”）。'],
        ['Expert Interview Summarizer', '专家访谈摘要'],
        ['Summarize expert interview transcripts. Extracts actionable insights, highlights key themes and provides recommendations. Start with a greeting (\'hi\', \'hello\').', '总结专家访谈记录。提取可操作的见解，突出关键主题并提供建议。以问候语开头（如“你好”）。'],

        // --- v2.2 新增智能体 ---
        ['Company Profiler', '公司概况'],
        ['Key information about a company', '公司关键信息'],
        ['Investment Memo', '投资备忘录'],
        ['Provide some background, upload any sources, and generate an investment memo.', '提供背景信息，上传来源，生成投资备忘录。'],
        ['Investment Assumptions Challenger', '投资假设挑战者'],
        ['Checks financial assumptions against actuals and industry benchmarks. Upload data to validate metrics, spot errors, and refine your growth logic.', '参照实际情况和行业基准检查财务假设。上传数据以验证指标，发现错误并完善增长逻辑。'],
        ['Earnings Call Summarizer', '财报电话会议摘要'],
        ['Enter the stock symbol or upload the earnings call transcript and this agent will summarize the call and provide additional insights.', '输入股票代码或上传财报电话会议记录，该智能体将总结会议并提供更多见解。'],
        ['Investor Update', '投资者更新'],
        ['Generates polished investor or LP reports. Upload your fund data, and it delivers summaries, key metrics, charts, and insights — ready to review, edit, and share.', '生成精美的投资者或 LP 报告。上传您的基金数据，即可提供摘要、关键指标、图表和见解——随时可供审阅、编辑和分享。'],
        ['Procurement Helper', '采购助手'],
        ['What products are you considering between?', '您在考虑哪些产品之间的选择？'],
        ['10-K Reader', '10-K 阅读器'],
        ['Upload and summarize a 10-K', '上传并总结 10-K 报告'],
        ['SEO Content Crafter', 'SEO 内容创作者'],
        ['What keyword are you trying to optimize?', '您想优化哪个关键词？'],
        ['Brand Voice', '品牌语调'],
        ['Write content aligned to your brand voice', '编写符合您品牌语调的内容'],
        ['Ghostwriter', '代笔'],
        ['Elevate your writing', '提升您的写作水平'],
        ['Sales Emailer', '销售邮件助手'],
        ['Gather key information about a company', '收集关于公司的关键信息'],
        ['Meeting Summarizer', '会议纪要'],
        ['Organize and structure your meeting notes', '整理和构建您的会议笔记'],
        ['LLM Answer Comparer', 'LLM 回答比较器'],
        ['Analyze and compare LLM responses', '分析并比较大模型回答'],
        ['Unit Test Creator', '单元测试生成器'],
        ['Create Python unit tests for functions and components', '为函数和组件创建 Python 单元测试'],
        ['Research Paper Pro', '论文研读专家'],
        ['Upload and summarize a research paper', '上传并总结研究论文'],
        ['Product Namer', '产品命名'],
        ['Brainstorm product names', '头脑风暴产品名称'],
        ['Product Strategist', '产品策略师'],
        ['Create a comprehensive product strategy', '制定全面的产品策略'],
        ['Agent Prompt Pro', '智能体提示词专家'],
        ['Generate effective Custom Agent prompts', '生成有效的自定义智能体提示词'],
        ['SQL Generator', 'SQL 生成器'],
        ['Write SQL from natural language', '从自然语言编写 SQL'],
        ['Python Functions', 'Python 函数'],
        ['Create python function code from natural language', '从自然语言创建 Python 函数代码'],
        ['SQL Optimizer', 'SQL 优化器'],
        ['Optimize SQL queries for MSSQL and PostgreSQL', '优化 MSSQL 和 PostgreSQL 的 SQL 查询'],

        // --- v2.3 智能体管理界面补全 ---
        ['Create Agent', '创建智能体'],
        ['Create Agents', '创建智能体'],
        ['Create and explore custom AI agents with tailored instructions and diverse skills.', '创建并探索具有定制指令和多样技能的自定义 AI 智能体。'],
        ['Search your custom agents', '搜索您的自定义智能体'],
        ['Agents created by the AI experts at you.com', '由 You.com 的 AI 专家创建的智能体'],
        ['Custom Agents created by you', '您创建的自定义智能体'],
        ['View Details', '查看详情'],
        ['Share Agent', '分享智能体'],
        ['Save Agent', '保存智能体'],
        ['Report Agent', '举报智能体'],
        ['Date created (newest first)', '创建日期 (从新到旧)'],
        ['You haven’t created any Agents yet', '您尚未创建任何智能体'],
        ['Create your own custom Agent tailored to answer questions for your specific needs.', '创建您自己的自定义智能体，专门用于回答您的特定需求。'],

        // --- v2.4 筛选、定价、团队 & 示例项目 ---
        // 筛选 (Filter)
        ['Filter Team Agents', '筛选团队智能体'],
        ['Close Team Agents Filter', '关闭团队智能体筛选'],
        ['Filter by agent access', '按智能体权限筛选'],
        ['Everyone', '全部人员'],
        ['Agents shared with everyone in your organization', '与组织内所有人共享的智能体'],
        ['My Teams', '我的团队'],
        ['Agents shared with any team you\'re a part of', '与您所在团队共享的智能体'],
        ['Select Team(s)', '选择团队'],
        ['Choose individual teams to filter agents', '选择特定团队以筛选智能体'],
        ['Enter a team name', '输入团队名称'],
        ['Clear Filters', '清除筛选'],
        ['Apply', '应用'],

        // 排序 (Sorting & Dropdowns)
        ['Alphabetical (a to z)', '按字母顺序 (A-Z)'],
        ['Alphabetical (z to a)', '按字母顺序 (Z-A)'],
        ['Date created (newest first)', '创建日期 (从新到旧)'],
        ['Date created (oldest first)', '创建日期 (从旧到新)'],
        ['Most recently used', '最近使用'],
        ['All Projects', '所有项目'],

        // 团队智能体 (Team Agents)
        ['Agents created and shared by members in your team', '由团队成员创建并共享的智能体'],
        ['You\'re not on a team yet', '您尚未加入任何团队'],
        ['Agents created and shared to your team will appear here.', '创建并分享给您团队的智能体将显示在这里。'],
        ['Upgrade', '升级'],

        // 升级套餐 (Billing/Pricing)
        ['Upgrade your plan', '升级您的计划'],
        ['Choose billing period', '选择计费周期'],
        ['Monthly', '月付'],
        ['Annually', '年付'],
        ['BEST VALUE', '超值推荐'],
        ['Free', '免费版'],
        ['Explore AI with basic Q&A', '利用基础问答探索 AI'],
        ['You\'re already Pro', '您已是 Pro 用户'],
        ['Limited basic queries', '有限的基础查询'],
        ['Real-time answers powered by live web search', '实时联网搜索回答'],
        ['Pro', '专业版'],
        ['Meet all your personal goals with expanded access to AI Agents', '利用扩展的 AI 智能体权限实现所有个人目标'],
        ['billed $180/year', '按年计费 $180'],
        ['Original Price: $20 billed monthly. Sale Price: $15 monthly. Billed at $180 per year.', '原价：$20/月。特惠价：$15/月。按年计费 $180。'],
        ['Current Plan', '当前计划'],
        ['Access to all AI models from OpenAI, Anthropic, DeepSeek, Google, and more', '访问 OpenAI, Anthropic, DeepSeek, Google 等所有顶级模型'],
        ['Unlock Research and custom agents', '解锁深度研究和自定义智能体'],
        ['Upload files & images to extract insights', '上传文件和图片以提取见解'],
        ['Access to ARI', '使用 ARI 助手'],
        ['Max', '旗舰版 (Max)'],
        ['Supercharge your productivity with the best of AI, including ARI access', '利用最强 AI (含 ARI 权限) 让生产力飞跃'],
        ['billed $2100/year', '按年计费 $2100'],
        ['Original Price: $200 billed monthly. Sale Price: $175 monthly. Billed at $2100 per year.', '原价：$200/月。特惠价：$175/月。按年计费 $2100。'],
        ['Get Max', '获取 Max 版'],
        ['Everything in Pro', '包含专业版所有权益'],
        ['Unlimited ARI Reports', '无限次 ARI 报告'],
        ['Increased file upload capacity for richer research and more complex tasks', '更大的文件上传容量，用于深度研究和复杂任务'],
        ['Zero data retention and no-training for models', '零数据保留，不用于模型训练'],
        ['Enterprise Plan', '企业版'],
        ['For companies looking to empower their workforce with AI', '适用于希望利用 AI 赋能员工的企业'],
        ['Contact Us', '联系我们'],
        ['billed per month', '按月计费'],

        // 示例项目 (Sample Projects)
        ['Sample projects', '示例项目'],
        ['Tokyo Trip', '东京旅行计划'],
        ['React Team Wiki', 'React 团队维基'],
        ['GTM Strategy', 'GTM 策略 (Go-To-Market)'],

        // --- v2.5 模型选择与权限管理 ---
        // 权限/分享 (Access)
        ['Who has access', '谁拥有访问权限'],
        ['Anyone with the link', '任何拥有链接的人'],
        ['No access', '无访问权限'],
        ['General access', '常规访问权限'],

        // 首页/着陆页 (Landing)
        ['Boost your productivity with AI', '利用 AI 提升效率'],
        ['Dive back into your projects', '返回您的项目'],
        ['No saved Agents', '没有已保存的智能体'],
        ['Agents made by others and saved by you will appear here.', '别人创建并由您保存的智能体将显示在这里。'],
        ['Discover Agents', '发现智能体'],
        ['Create new Custom Agent', '创建新的自定义智能体'],

        // 提示词/快速操作 (Quick Actions)
        ['Prompt研究', 'Prompt 提示词研究'], // 特殊处理用户已有的部分翻译
        ['Go to Create page', '前往创建页面'],

        // 模型名称/描述 (Models & Agents Selectors)
        // OpenAI
        ['GPT-5.1 Thinking', 'GPT-5.1 思考版 (Thinking)'],
        ['GPT-5.1 Instant', 'GPT-5.1 极速版 (Instant)'],
        ['GPT-5 mini', 'GPT-5 mini'],
        ['GPT-4.1', 'GPT-4.1'],
        ['GPT-4.1 mini', 'GPT-4.1 mini'],
        ['GPT-OSS 120B', 'GPT-OSS 120B'],
        ['o4 mini (High Effort)', 'o4 mini (深度模式)'],
        ['o3 Pro', 'o3 Pro'],
        ['o3 mini (High Effort)', 'o3 mini (深度模式)'],
        ['Fast results optimized for speed', '追求速度的快速结果'],

        // Anthropic (Claude)
        ['Claude Sonnet 4.5 (Extended)', 'Claude Sonnet 4.5 (扩展版)'],
        ['Claude Sonnet 4 (Extended)', 'Claude Sonnet 4 (扩展版)'],
        ['Claude Sonnet 3.7 (Extended)', 'Claude Sonnet 3.7 (扩展版)'],
        ['Claude Opus 4.5 (Extended)', 'Claude Opus 4.5 (扩展版)'],
        ['Claude Opus 4.1 (Extended)', 'Claude Opus 4.1 (扩展版)'],
        ['Claude Opus 4 (Extended)', 'Claude Opus 4 (扩展版)'],
        ['Claude Haiku 4.5', 'Claude Haiku 4.5'],
        ['Claude Haiku 3.5', 'Claude Haiku 3.5'],
        ['Go to Claude Opus 4.5 (Extended) page', '前往 Claude Opus 4.5 (扩展版) 页面'],
        ['Go to Claude Sonnet 4.5 (Extended) page', '前往 Claude Sonnet 4.5 (扩展版) 页面'],
        ['Go to GPT-4o page', '前往 GPT-4o 页面'],
        ['Go to Gemini 3 Pro page', '前往 Gemini 3 Pro 页面'],

        // Google (Gemini)
        ['Gemini 3 Pro', 'Gemini 3 Pro'],
        ['Gemini 2.5 Pro', 'Gemini 2.5 Pro'],
        ['Gemini 2.5 Flash', 'Gemini 2.5 Flash'],

        // xAI (Grok)
        ['Grok 4.1 Fast (Reasoning)', 'Grok 4.1 快速 (推理版)'],
        ['Grok 4.1 Fast', 'Grok 4.1 快速版'],
        ['Grok 3 Beta', 'Grok 3 Beta (测试版)'],
        ['Grok 3 Mini Beta (High Effort)', 'Grok 3 Mini Beta (深度模式)'],

        // Alibaba (Qwen) & Others
        ['Qwen3 235B', 'Qwen3 235B (通义千问)'],
        ['QwQ 32B', 'QwQ 32B'],
        ['Qwen2.5 72B', 'Qwen2.5 72B'],
        ['Qwen2.5 Coder 32B', 'Qwen2.5 Coder 32B'],
        ['DeepSeek-R1', 'DeepSeek-R1 (深度求索)'],
        ['DeepSeek-V3', 'DeepSeek-V3'],
        ['Llama 4 Maverick', 'Llama 4 Maverick'],
        ['Llama 4 Scout', 'Llama 4 Scout'],
        ['Mistral Large 2', 'Mistral Large 2'],

        // --- v2.6 设置、集成与地区 (Settings & Integrations) ---
        // 项目管理 (Projects)
        ['Files tab', '文件'],
        ['Links tab', '链接'],
        ['Web tab', '网页'],
        ['Edit Project', '编辑项目'],
        ['Close Edit Project Dialog', '关闭编辑项目对话框'],
        ['Projects offer a structured way to organize your chats and utilize source of truth to help you and your team do more.', '项目提供了一种结构化的方式来组织您的对话，并利用单一事实来源帮助您和您的团队完成更多工作。'],
        ['Example: Quarterly Planning & Research', '例如：季度规划与研究'],
        ['Choose who has access to view or contribute', '选择谁可以查看或贡献'],
        ['No public access', '无公开访问权限'],
        ['Can view', '可查看'],
        ['Anyone with the link can view', '任何拥有链接的人均可查看'],
        ['How sharing works', '分享如何运作'],
        ['Private', '私有'],
        ['Delete Project', '删除项目'],

        // 高级设置 (Advanced Settings)
        ['Enhance your AI experience with Advanced Settings', '使用高级设置增强您的 AI 体验'],
        ['Display context window usage for uploaded files', '显示上传文件的上下文窗口使用情况'],
        ['This will show what percentage of the model\'s context window your files will take up when you upload them, so that you can anticipate if you may run into the model\'s limit. Exceeding a model\'s token limit can sometimes, but not always, lead to non-ideal responses.', '这将显示您上传文件时占用的模型上下文窗口百分比，以便您预判是否会达到模型限制。超过模型 Token 限制有时（但不总是）会导致回复不理想。'],
        ['Create a Project', '创建项目'],
        ['Add files and websites', '添加文件和网站'],
        ['Select Al mode', '选择AI模型'],
        ['Create new Project', '创建新项目'],
        ['Files', '文件'],
        ['Links', '链接'],
        ['Web', '网页'],
        ['Enter URLs to exclude', '排除的URL'],
        ['Owner', '所有者'],
        ['This project is a collection of threads related to planning...', '该项目是与规划相关的主题合集…'],
        ['Safe Search', '安全搜索'],
        ['Strict', '严格'],
        ['Moderate', '中等'],
        ['Manage explicit content in web results', '管理网页结果中的露骨内容'],
        ['Region', '地区'], // context: Choose the region
        ['Choose the region for your web results', '选择网页结果的地区'],
        ['Recency', '时间范围'],
        ['Choose the recency of your web results', '选择网页结果的时间范围'],
        ['Any time', '任何时间'],
        ['Past 24 hrs', '过去 24 小时'],
        ['Past week', '过去一周'],
        ['Past month', '过去一个月'],
        ['Configure personalization', '配置个性化'],
        ['Share information for your chats to be catered to you', '分享信息以便为您定制对话'],
        ['Open links in new tab', '在新标签页中打开链接'],
        ['Nonpermanent mode', '非持久模式'],
        ['Your chats are temporary and will not appear in your chat history. We may keep a copy of uploaded documents for internal business needs such as product improvements and maintenance.', '您的对话是临时的，不会出现在历史记录中。我们会出于产品改进和维护等内部业务需求保留上传文档的副本。'],
        ['Clear chat history', '清除聊天记录'],
        ['Delete all messages and conversations permanently', '永久删除所有消息和对话'],

        // 集成 (Integrations)
        ['Connect you.com with your existing tools.', '将 You.com 连接到您现有的工具。'],
        ['Attach files from your Google Drive', '从您的 Google 云端硬盘附加文件'],
        ['Attach files from your OneDrive', '从您的 OneDrive 附加文件'],
        ['Connect', '连接'],

        // 推荐与奖励 (Referrals)
        ['Give $10, get $10 when you refer a coworker or friend', '推荐同事或朋友，送 $10 得 $10'],
        ['Give $10, Get $10', '送 $10，得 $10'], // Capitalized variant
        ['Refer a Friend', '推荐给朋友'], // Capitalized variant
        ['Share your unique referral link with coworkers and friends! Your coworkers and friends will receive $10 off their first payment, and you\'ll get a $10 discount off your next invoice.', '与同事和朋友分享您的专属推荐链接！您的同事和朋友首次付款可减免 $10，您的下一次账单也将获得 $10 折扣。'],
        ['your referral link', '您的推荐链接'],
        ['There was an error while retrieving your referral link', '获取您的推荐链接时出错'],
        ['Copy link', '复制链接'],
        ['You’ve saved', '您已节省'],
        ['Need help? Learn more at our', '需要帮助？了解更多请访问我们的'], // Handle split text if possible, or just fragment
        // ['FAQ', '常见问题'], // FAQ is generic, likely handled or ok as is

        // 订阅详情 (Subscription Details)
        ['Plan information', '套餐信息'],
        ['Manage your subscription via Stripe.', '通过 Stripe 管理您的订阅。'],
        ['Renewal:', '续期：'],
        ['Amount:', '金额：'],
        ['Your Pro plan includes:', '您的专业版套餐包括：'],
        ['Research and custom agents', '深度研究和自定义智能体'],
        ['Files & image uploads to extract insights', '上传文件和图片以提取见解'],
        ['Cancel subscription', '取消订阅'],
        ['Cancel your subscription via Stripe billing', '通过 Stripe 账单取消您的订阅'],

        // 团队 (Teams)
        ['You can set up a team to invite others to collaborate with.', '您可以建立团队邀请他人协作。'],
        ['Members in your team will be included as additional seats on your next invoice at $25/mo.', '团队成员将作为额外席位包含在您的下一份账单中，费用为 $25/月。'],
        ['Create a Team', '创建团队'],

        // 地区列表 (Regions)
        ['All regions', '所有地区'],
        ['Argentina', '阿根廷'],
        ['Australia', '澳大利亚'],
        ['Austria', '奥地利'],
        ['Belgium (nl)', '比利时 (荷语)'],
        ['Brazil', '巴西'],
        ['Canada (en)', '加拿大 (英语)'],
        ['Chile', '智利'],
        ['Denmark', '丹麦'],
        ['Finland', '芬兰'],
        ['France', '法国'],
        ['Germany', '德国'],
        ['Hong Kong SAR', '中国香港特别行政区'],
        ['India', '印度'],
        ['Indonesia', '印度尼西亚'],
        ['Italy', '意大利'],
        ['Japan', '日本'],
        ['Korea', '韩国'],
        ['Malaysia', '马来西亚'],
        ['Mexico', '墨西哥'],
        ['Netherlands', '荷兰'],
        ['New Zealand', '新西兰'],
        ['Norway', '挪威'],
        ['People\'s Republic of China', '中国'],
        ['Poland', '波兰'],
        ['Republic of the Philippines', '菲律宾共和国'],
        ['Russia', '俄罗斯'],
        ['South Africa', '南非'],
        ['Spain', '西班牙'],
        ['Sweden', '瑞典'],
        ['Switzerland (de)', '瑞士 (德语)'],
        ['Taiwan', '中国台湾'],
        ['Turkey', '土耳其'],
        ['United Kingdom', '英国'],
        ['United States (en)', '美国 (英语)'],

        ['Subscription', '订阅'],
        ['Downloads', '下载'],
        ['Notifications', '通知'],
        ['Delete', '删除'],
        ['Rename', '重命名'],
        ['Share', '分享'],
        ['Edit', '编辑']
    ]);

    // =================================================================
    // 2. 核心处理逻辑 (Core Logic)
    // =================================================================

    // 文本翻译辅助函数：去空匹配
    function translateText(text) {
        if (!text) return null;
        const trimmed = text.trim();
        if (i18n.has(trimmed)) {
            const translated = i18n.get(trimmed);
            // 简单尝试保留首尾空格
            return text.replace(trimmed, translated);
        }
        return null;
    }

    function handleNode(node) {
        // 1. 处理文本节点
        if (node.nodeType === Node.TEXT_NODE) {
            // 父级检查：避免翻译代码块或特定编辑器内容
            if (node.parentElement && ['STYLE', 'SCRIPT', 'CODE', 'PRE'].includes(node.parentElement.tagName)) return;

            const translation = translateText(node.textContent);
            if (translation) {
                node.textContent = translation;
            }
            return;
        }

        // 2. 处理元素节点
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName;
            // 跳过脚本样式
            if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'NOSCRIPT') return;

            // 处理 Input/Textarea 的 placeholder
            if ((tagName === 'INPUT' || tagName === 'TEXTAREA') && node.placeholder) {
                const translation = translateText(node.placeholder);
                if (translation) {
                    node.placeholder = translation;
                }
            }

            // 处理 aria-label (工具提示/无障碍标签)
            if (node.hasAttribute('aria-label')) {
                const label = node.getAttribute('aria-label');
                const translation = translateText(label);
                if (translation) {
                    node.setAttribute('aria-label', translation);
                }
            }

            // 处理 title 属性
            if (node.hasAttribute('title')) {
                const title = node.getAttribute('title');
                const translation = translateText(title);
                if (translation) {
                    node.setAttribute('title', translation);
                }
            }

            // 递归处理子节点
            // 使用 forEach + childNodes 是安全的同步递归
            if (node.childNodes.length > 0) {
                node.childNodes.forEach(handleNode);
            }
        }
    }

    // =================================================================
    // 3. 启动与监听 (Bootstrap & Observer)
    // =================================================================

    // 初始执行：处理当前页面已有的 DOM
    handleNode(document.body);

    // 持续监听：处理动态加载的内容 (React/SPA)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // 处理新增节点
            mutation.addedNodes.forEach(handleNode);

            // 处理文本变更 (characterData)
            // React 有时会直接更新文本节点的 data
            if (mutation.type === 'characterData') {
                handleNode(mutation.target);
            }

            // 监听属性变化 (如 placeholder 动态改变)
            if (mutation.type === 'attributes') {
                handleNode(mutation.target);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        // 仅监听可能涉及文案的属性，优化性能
        attributeFilter: ['placeholder', 'aria-label', 'title']
    });

    console.log('✅ You.com 汉化脚本(完美融合版) 已启动');

})();