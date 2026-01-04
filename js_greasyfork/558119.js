// ==UserScript==
// @name         SimpCity Forums 汉化
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  自动汉化SimpCity论坛文本，支持日期转换、12小时制转24小时制、星期时间转具体日期（如Tuesday at 3:44 AM→2025-12-10 03:44），适配所有含simpcity字符的域名
// @author       qgdyyg
// @match        *://*simpcity*/*
// @match        *://simp6.selti-delivery.ru/*
// @grant        none
// @license      MIT
// @supportURL   https://greasyfork.org/zh-CN/scripts/558119-simpcity-forums-%E6%B1%89%E5%8C%96/feedback
// @downloadURL https://update.greasyfork.org/scripts/558119/SimpCity%20Forums%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558119/SimpCity%20Forums%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------- 基础配置 --------------------------
    const monthMap = {
        Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
    };
    const weekdayMap = {
        Sunday: 0, Sun: 0,
        Monday: 1, Mon: 1,
        Tuesday: 2, Tue: 2,
        Wednesday: 3, Wed: 3,
        Thursday: 4, Thu: 4,
        Friday: 5, Fri: 5,
        Saturday: 6, Sat: 6
    };
    const dateRegExp = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})\b/g;
    const todayTimeRegExp = /Today at (\d{1,2}):(\d{2}) (AM|PM)/gi;
    const weekdayTimeRegExp = /\b(Sunday|Sun|Monday|Mon|Tuesday|Tue|Wednesday|Wed|Thursday|Thu|Friday|Fri|Saturday|Sat) at (\d{1,2}):(\d{2}) (AM|PM)\b/gi;

    // -------------------------- 自定义汉化映射表 --------------------------
    const translations = {
        // 通用文本
        "SimpCity Forums": "SimpCity论坛",
        "New Posts": "最新帖子",
        "Post Thread…": "发布主题…",
        "Threads": "主题",
        "Posts": "帖子",
        "Simps": "用户",
        "Latest Simp": "最新用户",
        "Loading…": "加载中…",
        "Close": "关闭",
        "Attach files": "上传文件",
        "Rich text box": "富文本框",
        "JavaScript is disabled. For a better experience, please enable JavaScript in your browser before proceeding.": "JavaScript已禁用。为获得更好的体验，请在继续之前启用浏览器的JavaScript。",
        "You are using an out of date browser. It may not display this or other websites correctly.<br />You should upgrade or use an <a href=\"https://www.google.com/chrome/\" target=\"_blank\" rel=\"noopener\">alternative browser</a>.": "您正在使用过时的浏览器。它可能无法正确显示此网站或其他网站。<br />您应该升级浏览器或使用<a href=\"https://www.google.com/chrome/\" target=\"_blank\" rel=\"noopener\">替代浏览器</a>。",
        "Contact us": "联系我们",
        "Terms of Service": "服务条款",
        "Forum Rules": "论坛规则",
        "Privacy policy": "隐私政策",
        "Help": "帮助",
        "Home": "首页",
        "Dark": "深色模式",
        "Light": "白天模式",
        "System": "跟随系统",
        "English (US)": "英语(美国)",
        "Language chooser": "切换语言",
        "Verified": "已认证",
        "Watch": "关注",
        "Latest updates": "最新更新",
        "Popular": "热门",
        "Newest": "最新",
        "Unanswered": "未回复",
        "Unsolved ": "未解决",
        "Your questions ": "你的问题",
        "Your answers": "你的回答",
        "Post question": "发布问题",
        "Answers": "回答",
        "Copyright": "版权所有",
        "Tags": "标签",
        "Popular tags": "热门标签",
        "Current Visitors": "当前访客",
        "Prev": "上一页",

        // 核心导航与功能文本
        "Forums": "论坛",
        "Trending": "热门",
        "What's New": "最新动态",
        "Find Threads": "查找主题",
        "Watched": "已关注",
        "Watched Forums": "已关注板块",
        "Watched Threads": "已关注主题",
        "Unanswered Threads": "未回复主题",
        "Threads With Your Posts": "包含你的帖子的主题",
        "Your Threads": "你的主题",
        "Search Forums": "搜索帖子",
        "Mark Forums Read": "标记订阅版块内容为已读",
        "Your Tickets": "你的反馈",
        "Style variation": "切换模式",
        "Português BR": "葡萄牙语（巴西）",
        "Mirroring Policy": "镜像政策",
        "Support Guidelines": "支持指南",
        "Ideas and Suggestions": "创意与建议",
        "FAQ": "常见问题",
        "Ranking Up Guide": "等级提升指南",
        "Noob Guide": "新手教程",
        "Create ticket in…": "在……中创建工单",
        "Revenge Porn": "报复性色情内容",
        "Underage Content / CP": "未成年人内容/儿童色情",
        "Verified Model applications": "认证模特申请",
        "Bookmark tools": "收藏工具",
        "Fakes / AI / Deepfakes category": "P图/AI/换脸分类",
        "Megathreads category": "综合主题分类",
        "Brazilian Trans section": "巴西跨性别板块",
        "Política De Espelhamento": "镜像政策",
        "Português-BR": "巴西葡萄牙语版",

        // 权限与提示文本
        "You have insufficient privileges to post threads here.": "你没有在此板块发布主题的权限。",
        "You have insufficient privileges to reply here.": "你没有在此处回复的权限。",
        "To be able to reply to threads in this category you will need to be in the Simp usergroup, more information can be found in our FAQ.": "要在该分类下回复主题，你需要加入Simp用户组，更多信息可在常见问题中查看。",
        "Oops! We ran into some problems.": "哎呀！我们遇到了一些问题。",
        "Oops! We ran into some problems. Please try again later. More error details may be in the browser console.": "哎呀！我们遇到了一些问题。请稍后再试。更多错误详情可能在浏览器控制台中。",
        "Are you sure you want to unwatch this forum?": "你确定要取消关注该论坛吗？",
        "Made with lots of ❤️ © SimpCity.su, 2025": "饱含爱意制作 ❤️ © SimpCity.su, 2025",
        "You have no new alerts.": "你没有新通知。",
        "You have no recent conversations.": "你没有近期私信。",
        "You are not currently following any simps.": "你当前没有关注任何用户。",
        "You are not currently ignoring any simps.": "你当前没有屏蔽任何用户。",
        "You are not watching any forums.": "你当前没有关注任何论坛。",
        "Entering a password is required.": "必须输入密码。",
        "For security reasons, you must verify your existing password before you may set a new password.": "出于安全考虑，设置新密码前必须验证你的当前密码。",
        "Passkeys are a secure replacement for passwords, allowing you to use biometric or device-based authentication to access your account.": "安全密钥是密码的安全替代方案，允许你使用生物识别或设备认证登录账户。",
        "Connected accounts allow you to log in to this site more easily by using an account you already hold at one of the sites below.": "关联账户允许你使用已有的以下平台账户，更便捷地登录本网站。",
        "Any notices you have previously dismissed will be restored to view if you check this option.": "勾选此选项后，你之前关闭的所有通知将恢复显示。",
        "The search order to use for quick searches, searching by thread, and the default value when loading the search form.": "快速搜索、按主题搜索时使用的排序方式，以及加载搜索表单时的默认值。",
        "You may find additional email options under Preferences.": "你可以在偏好设置中找到更多邮件选项。",
        "This will allow other people to see when you are online.": "这将允许他人查看你是否在线。",
        "This will allow other people to see what page you are currently viewing.": "这将允许他人查看你当前浏览的页面。",
        "This will allow people to see your age.": "这将允许他人查看你的年龄。",
        "We recently launched a new Mirroring Policy with the aim of improving the reliability of forum posts, by allowing users to re-post content which was previously shared only on certain unreliable file hosts.": "我们最近推出了新的镜像政策，旨在提高论坛帖子的可靠性，允许用户重新发布之前仅在部分不可靠文件托管平台分享的内容。",
        "Recentemente, lançamos uma nova Política de Espelhamento com o objetivo de melhorar a confiabilidade das publicações no fórum, permitindo que os usuários republiquem conteúdo que antes era compartilhado apenas em determinados hosts de arquivos não confiáveis.": "我们最近推出了新的镜像政策，旨在提高论坛帖子的可靠性，允许用户重新发布之前仅在部分不可靠文件托管平台分享的内容。",
        "You can read all about it here:": "你可以在此处了解详细信息：",
        "Você pode ler tudo sobre isso aqui:": "你可以在此处了解详细信息：",
        "Follow our Telegram to be in the loop in case of domain disruption/swap. Follow": "关注我们的Telegram频道，以便在域名变更/切换时及时获取通知。关注",
        "Follow our Telegram to be in the loop in case of domain disruption/swap.": "关注我们的Telegram频道，以便在域名变更/切换时及时获取通知。",
        "If you have connectivity issues, you can choose any of our other domains available at simp.city": "如果遇到连接问题，你可以选择我们在simp.city提供的其他域名。",
        "If you have connectivity issues, you can choose any of our other domains available at": "如果遇到连接问题，你可以选择我们在……提供的其他域名。",
        "Traffic from India is temporarily redirected to SimpTown due to spam attacks with malicious gofile links, please don't contribute to the spam by creating support threads, etc. Thanks for the understanding!": "由于遭遇恶意gofile链接的垃圾邮件攻击，来自印度的流量暂时被重定向至SimpTown，请不要通过创建支持主题等方式增加垃圾内容。感谢你的理解！",
        "Before starting a new thread for an issue, please use the search bar to see if a topic already exists.": "在为某个问题创建新主题前，请使用搜索栏确认相关主题是否已存在。",
        "Please ensure you include as much detail as possible when reporting any issues. (Include error, pictures, etc. What have you tried/not tried.)": "报告问题时，请确保提供尽可能详细的信息（包括错误信息、截图等。你已尝试/未尝试过哪些操作）。",
        "For further information about using this section: Support Guidelines": "有关本板块的使用详情：支持指南",
        "To submit and vote on ideas for new features: Ideas and Suggestions": "提交新功能建议并投票：创意与建议",
        "For answers to our Frequently Asked Questions: FAQ": "常见问题解答：常见问题",
        "For our Ranking Up Guide": "等级提升指南：",
        "For a guide on how to level up: Noob Guide": "新手升级指南：新手教程",
        "Message removed from multi-quote.": "已从多引用中移除该消息。",
        "Please use the correct name in the title of the thread, any special characters just makes everything a mess for everyone and don't help": "请在主题标题中使用正确名称，任何特殊字符只会给所有人带来麻烦，毫无帮助。",
        "New threads in the request section must include social profile links and at least 1 photo/video of the model, this way it's easier for people to find or recognize the model and help you.": "求助区的新主题必须包含社交账号链接以及至少1张模特的照片/视频，这样人们更容易找到或识别该模特并帮助你。",
        "Make sure to use the search first before creating a Request thread to avoid duplicates.": "创建求助主题前请务必先使用搜索功能，避免重复发布。",
        "Please include some kind of identification with censored sensitive information: you either need to be a person who represents a client (with the proper documents) or the exact person in question. Tickets without the proper documents will be instantly closed.": "请提供包含经过打码处理的敏感信息的身份证明：你需是客户代表（需提供相应文件）或当事人本人。未提供有效文件的工单将立即关闭。",
        "Please note the following definition of revenge porn:": "请注意报复性色情内容的以下定义：",
        "Revenge Porn: The perpetrator is a former partner who has chosen to share sexual images, which were initially consensually provided in good faith during a relationship or non-consensual pornography distributed by hackers or by individuals seeking profit or notoriety.": "报复性色情内容：肇事者为前任伴侣，其故意分享在恋爱期间双方自愿善意提供的性相关图片，或由黑客、逐利者或求名者传播的非自愿色情内容。",
        "Please include as much information as possible such as any evidence, court documents etc.": "请提供尽可能详细的信息，如相关证据、法庭文件等。",
        "Please include as much information as possible such as proof of age and proof of when the content was taken.": "请提供尽可能详细的信息，如年龄证明和内容拍摄时间证明等。",
        "!!! Please make sure to read our FAQ before making a ticket !!!": "!!! 提交工单前请务必阅读我们的常见问题 !!!",
        "We do NOT delete accounts. Change your password to something random, logout and don't log back in again.": "我们不提供账户删除服务。请将密码修改为随机字符，退出登录后不再登录即可。",
        "Please include as much information as possible when making a ticket.": "提交工单时请提供尽可能详细的信息。",
        "You do not have any recent alerts.": "你没有近期通知。",
        "Unfortunately, none of your content has received any reactions yet. You'll need to keep posting!": "很遗憾，你的内容尚未收到任何点赞。请继续发帖！",
        "Please enter a single tag.": "请输入单个标签。",
        "You may find additional email options under": "你可以在以下位置找到更多邮件选项：",
        "Tags will also be searched in content where tags are supported": "标签也会在支持标签的内容中进行搜索",
        "You may enter multiple names here.": "你可以在此处输入多个名称。",
        "These filters will be used by default whenever you return.": "下次访问时将默认使用这些筛选条件。",
        "For a guide on how to level up": "关于升级指南",
        "For our": "关于我们的",
        "Page could not be loaded": "页面无法加载",
        "The requested page could not be loaded.": "所请求的页面无法被加载",
        "Check your internet connection and try again.": "请检查您的互联网连接，然后刷新页面",
        "Certain browser extensions, such as ad blockers, may block pages unexpectedly. Disable these and try again.": "某些浏览器扩展程序（如广告拦截器）可能会意外导致页面无法加载。请禁用这些扩展程序，然后刷新页面。",
        "SimpCity may be temporarily unavailable. Please check back later.": "SimpCity可能暂时无法使用，请稍后再访问。",
        "Reload": "刷新页面",
        "For answers to our Frequently Asked Questions": "关于常见问题的解答",
        "To submit and vote on ideas for new features": "提交新功能建议并投票",
        "For further information about using this section": "关于本板块的使用详情",
        "Welcome to the Animated section! This is your home for all illustrations, animations, and exotic fantasies that the real stuff just can't fulfil!": "欢迎来到动漫板块！这里是所有插画、动画以及现实无法满足的奇幻幻想的专属家园！",
        "Keep in mind that our Community Rules still apply to the material here, in addition to additional category specific guidelines stickied within each section. Please familiarise yourself with these before posting. Have fun!": "请谨记，除了各子板块置顶的分类专属规则外，我们的社区规则同样适用于此处内容。发帖前请务必熟悉这些规则。祝您玩得愉快！",
        "Keep in mind that our still apply to the material here, in addition to additional category specific guidelines stickied within each section. Please familiarise yourself with these before posting. Have fun!": "请谨记，除了各子板块置顶的分类专属规则外，我们的社区规则同样适用于此处内容。发帖前请务必熟悉这些规则。祝您玩得愉快！",
        "To be able to reply to threads in this category you will need to be in the Simp usergroup.": "要在该分类下回复主题，你需要加入Simp用户组。",
        "If you have any suggestions on other sites we could have a thread for, please ask ask in": "如果你对我们可以开设主题的其他网站有任何建议，请在……中提出。",
        "To be able to reply to threads in this category you will need to be in the Simp usergroup, more information can be found in our": "要在该分类下回复主题，你需要加入Simp用户组，更多信息可在我们的……中查看。",
        "When posting AI generated content please include prompts used where possible.": "发布AI生成内容时，请尽可能附上所使用的提示词。",
        "Welcome to the Fakes / AI / Deepfakes category": "欢迎来到P图/AI/换脸分类",
        "Welcome to the Megathreads category, please remember to follow the when posting.": "欢迎来到综合主题分类，发帖时请记得遵守相关规则。",
        "All new posts must include a social link or thread link and some content.": "所有新帖子必须包含社交链接或主题链接以及相关内容。",
        "'Who is this?' requests go in one of the 'Who is this?' threads:": "‘这是谁？’类求助请发布至专门的‘这是谁？’主题中：",
        "Please note posts in this category do not count towards your post count.": "请注意，该分类下的帖子不计入你的发帖数。",
        "Brazilian TGirls can be found in the Brazilian Trans section of the forum.": "巴西跨性别女孩相关内容可在论坛的巴西跨性别板块中查找。",
        "A partir de agora, o fórum possui as opções traduzidas para o Português do Brasil.": "即日起，论坛新增巴西葡萄牙语翻译选项。",
        "Para mudar o idioma do site, CLIQUE AQUI e selecione Português ou role a página até o fim e escolha a opção de troca de idiomas.": "如需更改网站语言，点击此处选择葡萄牙语，或滚动至页面底部选择切换语言选项。",
        "Para entender melhor, fizemos um tópico: SimpCity em Português-BR": "为方便理解，我们创建了相关主题：SimpCity 巴西葡萄牙语版",
        "Para mudar o idioma do site,": "如需切换网站语言，",
        "e selecione Português ou role a página até o fim e escolha a opção de troca de idiomas.": "选择葡萄牙语，或滚动至页面底部切换语言选项",
        "Para entender melhor, fizemos um tópico: SimpCity em": "为帮助大家更好地理解，我们特别开设了SimCity",
        "New threads in the request section must include social profile links and at least 1 photo/video of the model,": "求片版块发帖须知：​必须附上模特社交账号链接",
        "this way it's easier for people to find or recognize the model and help you. ": "至少包含1张模特清晰照片/视频​，此举可有效提升信息可信度，方便用户快速识别并协助您获取精准反馈。",

        // 筛选排序文本
        "Filters": "筛选",
        "Filter": "筛选",
        "Show only:": "仅显示：",
        "Featured threads": "精选主题",
        "Prefix:": "前缀：",
        "Prefixes…": "前缀选择…",
        "Started by:": "发布者：",
        "Last updated:": "最后更新：",
        "Sort by:": "排序方式：",
        "Sort order": "排序规则",
        "Sort direction": "排序方向",
        "Sort by date": "按日期排序",
        "Sort by reaction score": "按点赞数排序",
        "Last message": "最后消息",
        "Descending": "降序",
        "Most recent": "最新优先",
        "Relevance": "相关度优先",
        "Jump to new": "跳至最新",
        "Replies": "回复数",
        "Views": "浏览量",
        "Next": "下一页",
        "Keywords": "关键词",
        "Posted by": "发布者",
        "Newer than": "晚于",
        "Older than": "早于",
        "Minimum number of replies": "最少回复数",
        "Prefixes": "前缀",
        "Order by": "排序依据",
        "Search in forums": "在板块中搜索",
        "Search sub-forums as well": "同时搜索子板块",
        "Search titles and first posts only": "仅搜索标题和首帖",
        "Date": "日期",
        "Display results as threads": "结果显示为主题",
        "Display results as conversations": "结果显示为私信",
        "Most replies": "最多回复数",
        "First message": "首帖",
        "Ascending": "升序",
        "First message reaction score": "首帖点赞数",
        "Unread threads": "未读主题",
        "Watched content": "已关注内容",
        "Threads in which you've participated": "你参与过的主题",
        "Threads you've started": "你发布的主题",
        "Unsolved Your questions": "你的未解决问题",
        "Any time": "任何时间",
        "7 days": "7天内",
        "14 days": "14天内",
        "30 days": "30天内",
        "2 months": "2个月内",
        "3 months": "3个月内",
        "6 months": "6个月内",
        "1 year": "1年内",
        "Title": "标题",
        "titles and first messages only": "仅标题和首帖",

        // 板块描述与功能说明文本
        "A place to share LORAs, Models + Workflows to help others with their AI/fake creations.": "此处用于分享LoRAs、模型和工作流，帮助他人进行AI/换脸创作。",

        // 操作按钮文本
        "Mark Read": "标记已读",
        "Unwatch": "取消关注",
        "Unwatch forum": "取消关注版块",
        "Like": "点赞",
        "Report": "举报",
        "Share:": "分享：",
        "Save": "保存",
        "Add passkey": "添加安全密钥",
        "Change": "修改",
        "Show": "显示",
        "Select all": "全选",
        "With selected…": "对选中项操作…",
        "Enable email notification": "开启邮件通知",
        "Disable email notification": "关闭邮件通知",
        "Manage watched threads": "管理已关注主题",
        "Last edited by a moderator:": "最后由版主编辑：",
        "Log Out": "退出登录",
        "Show All": "显示全部",
        "Advanced search…": "高级搜索…",
        "Quote": "引用",
        "Reply": "回复",
        "Toggle multi-quote": "切换多引用",
        "Reply, quoting this message": "回复并引用此消息",
        "Post reply": "发布回复",
        "Upload images": "上传图片",
        "Upload videos": "上传视频",
        "Search Everything": "搜索全部",
        "Search Threads": "搜索主题",
        "Search Conversations": "搜索私信",
        "Search tickets": "搜索工单",
        "Search tags": "搜索标签",
        "​Search": "搜索", // 保留原文可能存在的零宽空格，确保匹配准确性
        "Edit": "编辑",
        "Delete": "删除",
        "Copy link": "复制链接",
        "Save as default": "保存为默认",
        "Post Thread": "发布主题",
        "CLIQUE AQUI": "点击此处",

        // 账户设置文本
        "Your Account": "你的账户",
        "Your Profile": "你的资料",
        "Your Content": "你的内容",
        "Account Details": "账户详情",
        "Password And Security": "密码与安全",
        "Preferences": "偏好设置",
        "Connected Accounts": "关联账户",
        "Following": "已关注",
        "Ignoring": "已屏蔽",
        "Bookmarks": "收藏",
        "Settings": "设置",
        "Alerts": "通知",
        "Reactions Received": "收到的点赞",
        "Reaction score": "点赞数",
        "Conversations": "私信",
        "Time zone": "时区",
        "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi": "(UTC+08:00) 北京、重庆、香港、乌鲁木齐",
        "Email options": "邮件选项",
        "Receive news and update emails": "接收新闻和更新邮件",
        "Receive email when a new conversation is received": "收到新私信时发送邮件通知",
        "Content options": "内容选项",
        "Automatically watch content you create…": "自动关注你创建的内容…",
        "Automatically watch content you interact with…": "自动关注你互动过的内容…",
        "and receive email notifications": "并接收邮件通知",
        "Show people's signatures with their messages": "显示用户消息中的签名",
        "Privacy options": "隐私选项",
        "Show your online status": "显示你的在线状态",
        "Show your current activity": "显示你的当前活动",
        "Restore dismissed notices": "恢复已关闭的通知",
        "Search Options": "搜索选项",
        "Default Search Order": "默认搜索排序",
        "Alert Preferences": "通知偏好",
        "Alerting preferences": "通知设置",
        "No alerts": "无通知",
        "Use defaults": "使用默认",
        "Use custom": "自定义",
        "Username": "用户名",
        "Email": "邮箱",
        "Date of birth": "出生日期",
        "Show day and month of birth": "显示出生日和月",
        "Show year of birth": "显示出生年",
        "Location": "所在地",
        "Website": "个人网站",
        "About you": "关于你",
        "Your passkeys": "你的安全密钥",
        "Two-step verification": "两步验证",
        "Disabled": "已禁用",
        "Your existing password": "你的当前密码",
        "New password": "新密码",
        "Confirm new password": "确认新密码",
        "Mark Read Preferences": "标记已读偏好",
        "Allow users to": "允许用户",
        "View your details on your profile page": "查看你个人资料页上的详情",
        "All visitors": "所有访客",
        "Start conversation with you": "与你发起私信",
        "Simps only": "仅Simp用户组",
        "View your identities": "查看你的身份信息",
        "Nobody": "不允许任何人",
        "People you follow": "仅关注的",
        "has not posted any content recently.": "最近没发帖",
        "has not provided any additional information.": "没有提供任何额外的信息。",
        "Last seen": "最后一次在线",
        "Joined": "注册时间",
        "Find content": "查找内容",
        "Find all threads by": "查找发起的所有帖子",
        "Find all content by": "查找由发布的所有评论",

        // 服务条款/隐私政策等长文本（已修复双引号转义）
        "The providers (\"we\", \"us\", \"our\") of the service provided by this web site (\"Service\") are not responsible for any user-generated content and accounts. Content submitted express the views of their author only.": "本网站所提供的服务由我们负责提供。对于用户自行创建的内容及账户，我们不承担任何责任。用户提交的内容仅代表其作者的个人观点。",
        "This Service is only available to users who are at least 18 years old. If you are younger than this, please do not register for this Service. If you register for this Service, you represent that you are this age or older.": "本服务仅适用于年满18岁的用户。如果您未达到这一年龄，请不要注册使用本服务。如果您注册使用了本服务，即表示您已年满18岁或以上。",
        "All content you submit, upload, or otherwise make available to the Service (\"Content\") may be reviewed by staff members. All Content you submit or upload may be sent to third-party verification services (including, but not limited to, spam prevention services). Do not submit any Content that you consider to be private or confidential.": "您提交、上传或以其他方式提供给本服务的所有内容（以下简称“内容”），都可能由我们的工作人员进行审核。您提交或上传的所有内容还可能被发送给第三方验证机构进行核查（这些机构包括但不限于反垃圾邮件服务）。请不要提交任何您认为属于私人或机密性质的内容。",
        "You agree to not use the Service to submit or link to any Content which is defamatory, abusive, hateful, threatening, spam or spam-like, likely to offend, contains adult or objectionable content, contains personal information of others, risks copyright infringement, encourages unlawful activity, or otherwise violates any laws. You are entirely responsible for the content of, and any harm resulting from, that Content or your conduct.": "您同意不得利用本服务来提交或链接任何具有诽谤性、侮辱性、仇恨言论、威胁性、垃圾邮件性质的内容，或任何可能引起他人反感的内容；也不得提交包含成人内容或令人不适的内容，或包含他人个人信息的内容；更不得提交可能侵犯版权、鼓励非法活动或违反任何法律的内容。您需对您提交的内容及其可能造成的任何后果承担全部责任。",
        "We may remove or modify any Content submitted at any time, with or without cause, with or without notice. Requests for Content to be removed or modified will be undertaken only at our discretion. We may terminate your access to all or any part of the Service at any time, with or without cause, with or without notice.": "我们可以在任何时间、无需任何理由、也不必事先通知，删除或修改您提交的任何内容。是否删除或修改某些内容，完全由我们自行决定。我们也可以在任何时间、无需任何理由、也不必事先通知，终止您对全部或部分服务的访问权限。",
        "You are granting us with a non-exclusive, permanent, irrevocable, unlimited license to use, publish, or re-publish your Content in connection with the Service. You retain copyright over the Content.": "您授予我们一项非独占的、永久的、不可撤销的、无限制的许可，允许我们使用、发布或重新发布您与本服务相关联的内容。您仍保留对这些内容的版权。",
        "These terms may be changed at any time without notice.": "这些条款可以在任何时间未经通知的情况下进行修改。",
        "If you do not agree with these terms, please do not register or use the Service. Use of the Service constitutes acceptance of these terms.": "如果您不同意这些条款，请不要注册或使用本服务。使用本服务即表示您接受了这些条款。",
        "Cookie usage": "Cookie的使用情况",
        "BB codes": "BB代码",
        "Smilies": "表情包",
        "Forum Emotes": "论坛表情包。",
        "This shows a full list of the smilies you can insert when posting a message.": "这里列出了您在发布消息时可以使用的所有表情包。 ",
        "The list of BB codes you can use to spice up the look of your messages. This page shows a list of all BB codes that are available.": "这里提供了各种可用于美化消息外观的BB代码，列出了所有可用的BB代码。",
        "This page explains how this site uses cookies.": "本页面解释了该网站如何使用Cookie。",
        "You must agree to these terms and rules before using the site.": "在使用本网站之前，您必须同意这些条款和规则。",
        "You must accept this policy before using the site.": "在使用本网站之前，您必须接受这一隐私政策。",

        // 搜索相关文本
        "Search": "搜索",
        "Search…": "搜索…",
        "Everywhere": "全部范围",
        "Search titles only": "仅搜索标题",
        "Member": "用户",
        "This thread": "当前主题",
        "This forum": "当前论坛",

        // 板块名称及描述
        "Info and Links": "信息与链接",
        "SimpCity News, Rules and FAQ": "SimpCity新闻、规则与常见问题",
        "News Updates": "新闻更新",
        "Promotion Section": "推广区",
        "Verified Models": "认证模特",
        "The sexiest models verified by the staff of SimpCity.": "由SimpCity工作人员认证的最性感模特。",
        "Requests": "求助区",
        "Home of the heroes. Something you want? Request it in here!": "加里奥之家。有想要的东西？在这里求助！",
        "Premium Site Requests": "会员网站内容求助",
        "Premium Fan Sites": "高级粉丝网站",
        "Home of the spicy links 🌶️ - the biggest collection of its kind on the web.": "辣妹资源库🌶️——全网最骚福利合集。",
        "The high rollers of the cosplay world live here. Want hot girls dressed as your favourite character? Drop by!": "cos圈顶流聚集地-想看人气Coser还原你最爱的角色？速来围观！",
        "A lot of vids... many of them, in fact! The highest quality content from the hottest MV Stars around.": "海量视频库-汇聚顶尖ManyVids红人，呈现行业标杆级内容。",
        "Social Media": "社交媒体",
        "Celebrities": "明星",
        "TV binge? Singer on repeat? Watched a bit too much of a celebrity trial? Well, stop by here for all their hottest leaks!": "刷剧上头？单曲循环？明星八卦看不够？速来解锁全网最劲爆的独家内幕！",
        "The hottest Instagram models, without the motivational quotes, food pictures, or posts on your feed from that cousin you hate.": "最火辣的Instagram模特阵容，没有鸡汤语录、美食照片，也没有你讨厌的表亲刷屏的日常动态。",
        "Just like Reddit but without the desperate chit-chat, and with content from Gone Wild alumni that won't disappear.": "与Reddit相似，但没有无意义的闲聊，且汇聚Gone Wild元老的优质内容永不退场。",
        "When the algorithm hasn't quite given you what you want, you'll find the hottest TikTok have to offer in here.": "当算法没给你想要的，你会在这里找到TikTok上最热门的内容。",
        "TikTok T H I C C Ebony Lia Aesthetic | liaaesthetic__": "TikTok 丰腴黑人Lia风格 | liaaesthetic__",
        "The real home of the simps. And something that involves hot tubs? Once you enter, there's no going back.": "舔狗天堂，温泉局圣地-一旦踏入，别想回头！",
        "YouTube’s Community Guidelines does not approve.": "YouTube社区准则在这里不适用。",
        "Professional Sites": "专业片商",
        "Professional Modelling Sites": "专业模特网站",
        "Lights, Camera, Action! All studio quality professional modelling without the sticky magazine pages.": "灯光、相机、开拍！所有工作室级别的专业模特内容，无需翻阅粘手的杂志。",
        "Suicide Girls": "Suicide Girls",
        "Tats, tits, piercings, and pin-ups. Drop by here for your alt girl fix!": "纹身、胸部、穿孔和海报女郎。来这里满足你对另类女孩的喜爱！",
        "When the production value matters to you; you stop by here for the best professional porn has to offer.": "当制作水准对你很重要时，来这里获取最棒的专业色情内容。",
        "Specialised Interests": "特殊兴趣",
        "Asians": "亚洲人",
        "Pixelated privates and Google translate open in the other tab; the home for the best of Asia!": "朦胧美体 - 谷歌翻译开分屏，亚洲精选盛宴！",
        "Premium Asians": "高级亚洲内容",
        "Hey how you doin' lil mama? lemme whisper in your ear.": "哈喽宝贝～来，给你耳边说点悄悄话",
        "Cam Girls": "主播",
        "The girls that regret not starting a Twitch channel instead.": "那些后悔没有开Twitch频道的女孩们。",
        "Fakes / AI / Deepfakes": "P图/AI/换脸",
        "Decades of development on image manipulation techniques, driven by the titties.": "图像处理技术数十年的发展，其驱动力源于对完美身形的追求。",
        "Fake Requests": "换脸求助",
        "Software, Guides + Discussion": "软件、指南与讨论",
        "LoRAs, Models + Workflows": "LoRAs、模型和工作流",
        "Hotwives + QoS": "人妻福利绿帽",
        "Get off on the idea of your wife with others? Well, live the fantasy through the content in here until you meet a woman yourself!": "沉迷于妻子和别人在一起的想法？好吧，在你遇到自己的女人之前，通过这里的内容实现幻想吧！",
        "Other": "其他",
        "Got something that tickles your fancy and doesn't fit elsewhere? Drop it in here.": "有什么喜欢但不符合其他板块的内容？放在这里。",
        "Megathreads": "综合主题",
        "Transgender": "跨性别",
        "The best of both worlds!": "两全其美！",
        "Trans General Discussion": "跨性别综合讨论",
        "Trans Model Discussion": "跨性别模特讨论",
        "Trans Requests": "跨性别求片",
        "Trans Reviews": "跨性别评论",
        "Brasileiras": "巴西人",
        "Brasileiras | Brazilian Girls": "巴西人 | 巴西女孩",
        "South America's Sexiest! The exclusive home for all Brazilian models.": "南美最性感！所有巴西模特的专属家园。",
        "Close Friends": "亲密好友",
        "Cosplayers": "Coser",
        "Onlyfans & Patreon": "Onlyfans和Patreon",
        "Privacy": "隐私",
        "Ensaios fotográficos": "摄影作品",
        "Outros conteúdos pagos": "其他付费内容",
        "Famosas": "名人",
        "Youtubers & Streamers": "YouTube博主和主播",
        "VIP  Trans": "VIP跨性别",
        "Pedidos": "求助区",
        "Bate-papo | Tutoriais | Ajuda": "聊天 | 教程 | 帮助",
        "Animated": "动漫",
        "It's an art project.": "这是一个艺术项目。",
        "Animated Requests": "动漫求助区",
        "3D": "3D内容",
        "Games": "游戏",
        "Hentai": "hentai",
        "Community": "社区",
        "General Discussion": "综合讨论",
        "A place to chit-chat and connect with the community, share some memes, create a list, or drop your most random thoughts.": "热聊天地 · 同好社区 · 趣味图文分享 · 脑洞大开专区。",
        "Model Discussion": "模特讨论",
        "Simps assemble! Come talk conspiracies, desires, and voice your cry-baby antics for all your favourite creators.": "Simp们集合！来讨论阴谋论、欲望，为你最喜欢的创作者应援吧。",
        "Reviews": "评论",
        "Were they scammy or simp worthy? Share your honest reviews of content creators in here.": "是坑钱大师还是舔狗认证？速来评评这些创作者值不值得你打call！",
        "Helping the Community": "资助社区",
        "Share tools, tips, and advice to help out your fellow simps.": "分享工具、技巧和建议，帮助你的simp网友。",
        "Help | Support | Suggestions": "帮助 | 支持 | 建议",
        "Need help? Have suggestions to improve the site? Post in here!": "需要帮助？有改进网站的建议？在这里发帖！",
        "Simps Online": "在线用户",
        "Latest Posts": "最新帖子",
        "Forum Statistics": "论坛统计"
    };

    // -------------------------- 性能优化：预处理翻译表 --------------------------
    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const sortedOriginalTexts = Object.keys(translations).sort((a, b) => b.length - a.length);
    const translationRegExp = new RegExp(`(${sortedOriginalTexts.map(escapeRegExp).join('|')})`, 'g');
    const translationMap = new Map(Object.entries(translations));

    // -------------------------- 核心：星期+时间转换函数 --------------------------
    function convertWeekdayTimeToDate(text) {
        return text.replace(weekdayTimeRegExp, (match, weekday, hour, minute, period) => {
            const today = new Date();
            const todayWeekday = today.getDay();
            const targetWeekday = weekdayMap[weekday];
            let dayDiff = targetWeekday - todayWeekday;
            if (dayDiff > 0) dayDiff -= 7;

            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + dayDiff);

            let hour24 = parseInt(hour, 10);
            if (period.toUpperCase() === 'PM' && hour24 < 12) hour24 += 12;
            if (period.toUpperCase() === 'AM' && hour24 === 12) hour24 = 0;
            const formattedHour = hour24.toString().padStart(2, '0');
            const formattedMinute = minute.padStart(2, '0');

            const year = targetDate.getFullYear();
            const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
            const day = targetDate.getDate().toString().padStart(2, '0');

            return `${year}-${month}-${day} ${formattedHour}:${formattedMinute}`;
        });
    }

    // -------------------------- 12小时制转24小时制函数 --------------------------
    function convertTo24HourFormat(text) {
        const textWithWeekday = convertWeekdayTimeToDate(text);
        return textWithWeekday.replace(todayTimeRegExp, (match, hour, minute, period) => {
            let hour24 = parseInt(hour, 10);
            if (period.toUpperCase() === 'PM' && hour24 < 12) hour24 += 12;
            if (period.toUpperCase() === 'AM' && hour24 === 12) hour24 = 0;
            const formattedHour = hour24.toString().padStart(2, '0');
            return `${formattedHour}:${minute}`;
        });
    }

    // -------------------------- 日期格式转换函数 --------------------------
    function convertDateFormat(text) {
        const textWith24Hour = convertTo24HourFormat(text);
        return textWith24Hour.replace(dateRegExp, (match, monthAbbr, day, year) => {
            const month = monthMap[monthAbbr];
            return `${year}-${month}-${parseInt(day, 10)}`;
        });
    }

    // -------------------------- 性能优化：强化节点过滤 --------------------------
    function getAllTextNodes(root = document.body) {
        const textNodes = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, (node) => {
            // 新增：先检查节点是否存在
            if (!node || !node.parentElement) return NodeFilter.FILTER_SKIP;

            const parent = node.parentElement;
            const parentTag = parent.tagName.toLowerCase();
            const skipTags = ['script', 'style', 'textarea', 'input', 'meta', 'link', 'noscript'];
            if (skipTags.includes(parentTag)) return NodeFilter.FILTER_SKIP;

            const computedStyle = window.getComputedStyle(parent);
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                return NodeFilter.FILTER_SKIP;
            }

            if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_SKIP;

            return NodeFilter.FILTER_ACCEPT;
        });

        let node;
        while ((node = walker.nextNode())) {
            // 新增：二次校验节点有效性，避免空节点混入
            if (node && node.nodeType === Node.TEXT_NODE && node.textContent) {
                textNodes.push(node);
            }
        }
        return textNodes;
    }

    // -------------------------- 核心汉化逻辑（关键修复） --------------------------
    function translateTextNode(node) {
        // 修复核心：先校验node是否存在、是否为有效文本节点
        if (!node || node.nodeType !== Node.TEXT_NODE || !node.textContent) {
            return; // 无效节点直接跳过
        }
        // 修复：使用可选链操作符?.，避免dataset不存在时报错
        if (node.dataset?.translated) {
            return;
        }

        let originalText = node.textContent;
        const textWithConvertedDate = convertDateFormat(originalText);
        const translatedText = textWithConvertedDate.replace(translationRegExp, (match) => translationMap.get(match) || match);

        if (translatedText !== originalText) {
            node.textContent = translatedText;
            // 修复：确保dataset存在时再赋值
            if (node.dataset) {
                node.dataset.translated = 'true';
            }
        }
    }

    function translateAllTextNodes(root = document.body) {
        getAllTextNodes(root).forEach(translateTextNode);
    }

    function translateAttributes(root = document.body) {
        root.querySelectorAll('[placeholder]').forEach(el => {
            if (!el) return; // 新增：校验元素有效性
            const placeholder = el.getAttribute('placeholder');
            const convertedDatePlaceholder = convertDateFormat(placeholder);
            const translated = translationMap.get(convertedDatePlaceholder) || convertedDatePlaceholder;
            if (translated !== placeholder) {
                el.setAttribute('placeholder', translated);
            }
        });

        root.querySelectorAll('img[alt]').forEach(el => {
            if (!el) return; // 新增：校验元素有效性
            const alt = el.getAttribute('alt');
            const convertedDateAlt = convertDateFormat(alt);
            const translated = translationMap.get(convertedDateAlt) || convertedDateAlt;
            if (translated !== alt) {
                el.setAttribute('alt', translated);
            }
        });
    }

    function translate(root = document.body) {
        if (!root) return; // 新增：校验根节点有效性
        translateAllTextNodes(root);
        translateAttributes(root);
    }

    // -------------------------- 动态内容观察器 --------------------------
    let debounceTimer;
    const observer = new MutationObserver((mutations) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const addedNodes = [];
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // 新增：只处理有效元素节点
                    if (node && node.nodeType === Node.ELEMENT_NODE) {
                        addedNodes.push(node);
                    }
                });
            });
            addedNodes.forEach(node => translate(node));
        }, 50);
    });

    // -------------------------- 初始化 --------------------------
    function init() {
        translate();
        const nodeCount = getAllTextNodes().length;
        console.log(`✅ SimpCity汉化完成（v3.1 修复节点校验），处理文本节点数：${nodeCount}`);
        console.log(`✅ 支持格式：Today at 3:44 PM→15:44；Tuesday at 3:44 AM→YYYY-MM-DD 03:44`);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 延迟初始化，不阻塞页面加载
    if (window.requestIdleCallback) {
        requestIdleCallback(init, { timeout: 1000 });
    } else {
        if (document.readyState === 'complete') {
            setTimeout(init, 0);
        } else {
            window.addEventListener('load', () => setTimeout(init, 0));
        }
    }
})();