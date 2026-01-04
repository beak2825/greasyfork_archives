// ==UserScript==
// @name         Dub.co 汉化脚本(船仓完美版)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  汉化 Dub.co 界面
// @author       zscc.in
// @match        https://app.dub.co/*
// @match        https://dub.co/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557623/Dubco%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC%28%E8%88%B9%E4%BB%93%E5%AE%8C%E7%BE%8E%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557623/Dubco%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC%28%E8%88%B9%E4%BB%93%E5%AE%8C%E7%BE%8E%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 汉化字典
    const i18n = {
        // 导航与通用
        "Dashboard": "仪表盘",
        "Links": "链接",
        "link": "链接",
        "Workspace": "工作区",
        "Analytics": "分析",
        "Free Plan": "免费计划",
        "Events": "事件",
        "Current billing cycle: ": "当前计费周期：",
        "clicks": "点击",
        "0 remaining of 1,000": "0 剩余 1,000",
        "Settings": "设置",
        "new links/mo": "新链接/月",
        "Links created per month": "月度创建链接",
        "total tracked events/mo": "月度追踪事件",
        "Help": "帮助",
        "Yearly (2 months free)": "年付（前两个月免费）",
        "Monthly": "月付",
        "Increases": "增加",
        "Feedback": "反馈",
        "Docs": "文档",
        "View all plans": "查看所有计划",
        "Changelog": "更新日志",
        "Logout": "退出",
        "Sign Out": "退出登录",
        "Login": "登录",
        "Add": "添加",
        "Create tag": "创建标签",
        "tags": "标签",
        "Link Cloaking": "链接伪装",
        "Search Engine Indexing": "搜索引擎索引",
        "Domains": "域名",
        "domains": "域名",
        "Refer a friend": "推荐好友",
        "Activate your referral link to share the word about Dub and earn cash rewards": "激活您的推荐链接以分享 Dub 的信息并获得现金奖励",
        "Coming soon": "即将上线",
        "Referrals": "推荐",
        "Learn how to use tags to organize your links and retrieve analytics for them.": "学习如何使用标签来组织您的链接并获取它们的分析数据",
        "You can only add up to 5 tags on the Free plan. Upgrade to add more tags": "您只能在 Free 计划中添加 5 个标签。升级以添加更多标签",
        "Connect a domain you own": "连接您拥有的域名",
        "Search folders...": "搜索文件夹...",
        "Search domains...": "搜索域名...",
        "No archived domains found": "未找到归档域名",
        "Search...": "搜索...",
        "Invite your teammates": "邀请您的队友",
        "Dismiss forever": "永远不再显示",
        "Set up your custom domain": "设置自定义域名",
        "Create your first short link": "创建您的第一个短链接",
        "Get familiar with Dub by completing the tour": "通过完成导览熟悉 Dub",
        "following tasks": "完成以下任务",
        "Domains": "域名",
        "Advanced Settings": "高级设置",
        "Created by": "创建者",
        "Conversion tracking is only available on Business plans and above.": "转换追踪仅在 Business 计划及以上可用。",
        "links": "链接",
        "Set a custom QR code design to improve click-through rates.": "设置自定义二维码设计以提高点击率。",
        "Viewing": "查看",
        "Transfer": "移动",
        "Use comments to add context to your short links – for you and your team.": "使用评论为您的短链接添加上下文 – 对您和您的团队。",
        "Use folders to organize and manage access to your links.": "使用文件夹组织和管理您的链接访问权限。",
        "Copy link": "复制链接",
        "Customize how your links look when shared on social media to improve click-through rates. When enabled, the preview settings below will be shown publicly (instead of the URL's original metatags).": "自定义您的链接在社交媒体上分享时的外观以提高点击率。启用时，以下预览设置将公开显示（而不是 URL 的原始元标签）。",
        "Create new folder": "创建新文件夹",
        "The URL your users will get redirected to when they visit your short link.": "用户访问短链接时将被重定向到的 URL。",
        "Claim a free .link domain, free for 1 year.": "领取免费 .link 域名，首年免费。",
        "View analytics on conversions from your short links.": "查看您的短链接的转换分析。",
        "Messages": "消息",
        "Tags are used to organize your links in your Dub dashboard.": "标签用于在 Dub 仪表盘中组织您的链接。",
        "All Partners": "所有合作伙伴",
        "Learn more.": "了解更多。",
        "Import Links": "导入链接",
        "Import from Bitly": "从 Bitly 导入",
        "Import from Rebrandly": "从 Rebrandly 导入",
        "Import from Short.io": "从 Short.io 导入",
        "Import from CSV": "从 CSV 导入",
        "Export Links": "导出链接",
        "Export to CSV": "导出到 CSV",
        "Copy Link ID": "复制链接 ID",
        "Notifications": "通知",
        "Start for free": "免费开始",
        "Upgrade": "升级",
        "Pricing": "价格",
        "Usage": "用量",
        "Library": "库",
        "Insights": "洞察",
        "Folders": "文件夹",
        "Tags": "标签",
        "UTM Templates": "UTM 模板",
        "Customers": "客户",
        "Getting Started": "新手入门",
        "complete": "完成", // for "33% complete"
        "Stats Locked": "统计数据已锁定",
        "Upgrade plan": "升级套餐",
        "Workspaces": "工作区",
        "Create workspace": "创建工作区",
        "Invite members": "邀请成员",
        "free": "免费",
        "2 members": "2 位成员", // Dynamic? handled by regex better if generic

        // 顶部横幅 (被链接打断的句子)
        "You've hit the ": "您已达到",
        "You’ve hit the": "您已达到", // Smart quote
        "monthly usage limit": "每月使用限额",
        " on your current plan. Upgrade to keep using Dub.": "（当前套餐）。请升级以继续使用 Dub。",
        "on your current plan": "（当前套餐）", // Split span 1
        ". Upgrade to keep using Dub.": "。请升级以继续使用 Dub。", // Split span 2

        // 链接管理
        "Create Link": "创建链接",
        "Create link": "创建链接", // Case variation
        "New Link": "新建链接",
        "Search links...": "搜索链接...",
        "Search by short link or URL": "搜索短链接或 URL",
        "Add a description...": "添加描述...",
        "Add a title...": "添加标题...",
        "New link": "新建链接",
        "Draft saved": "草稿已保存",
        "Enter a URL to generate a key using Al.": "输入 URL 生成密钥",
        "Generate a random key": "生成随机短链",
        "Upgrade to Business": "升级到 Business",
        "Filter": "筛选",
        "Sort by": "排序",
        "Date Created": "创建日期",
        "Date created": "创建日期",
        "Clicks": "点击数",
        "Last Clicked": "最后点击",
        "Last clicked": "最后点击",
        "Edit": "编辑",
        "Duplicate": "复制",
        "Archive": "归档",
        "Delete": "删除",
        "Copy": "复制",
        "Copy to clipboard": "复制到剪贴板",
        "QR Code": "二维码",
        "Share": "分享",
        "Display": "显示",
        "Cards": "卡片",
        "Rows": "列表",
        "Ordering": "排序",
        "Show archived": "显示归档",
        "Show archived links": "显示归档链接",
        "Total clicks": "总点击数",
        "Total sales": "总销售额",
        "DISPLAY PROPERTIES": "显示属性",
        "Display Properties": "显示属性",
        "Short link": "短链接",
        "Short Link": "短链接",
        "Description": "描述",
        "Created Date": "创建日期",
        "Creator": "创建者",
        "Destination URL": "目标 URL",
        "Title": "标题",
        "Domain": "域名",
        "Tag": "标签",

        // 创建链接模态框
        "Drafts": "草稿",
        "(optional)": "(可选)",
        "Claim a free .link domain, free for 1 year.": "领取免费 .link 域名，首年免费。",
        "Learn more": "了解更多",
        "Claim Domain": "领取域名",
        "Manage": "管理",
        "Select tags...": "选择标签...",
        "Comments": "评论",
        "Add comments": "添加评论",
        "Conversion Tracking": "转化追踪",
        "Folder": "文件夹",
        "Enter a short link to generate a QR code": "输入短链接以生成二维码",
        "Custom Link Preview": "自定义链接预览",
        "Default": "默认",
        "X/Twitter": "X/Twitter",
        "LinkedIn": "LinkedIn",
        "Facebook": "Facebook",
        "Enter a link to generate a preview": "输入链接以生成预览",
        "UTM": "UTM",
        "Targeting": "定位",
        "A/B Test": "A/B 测试",
        "Password": "密码",
        "Expiration": "过期时间",
        "Upgrade to Pro": "升级到 Pro",
        "Import": "导入",
        "Bulk Create": "批量创建",
        "Random": "随机",
        "Custom": "自定义",
        "Android": "Android",
        "iOS": "iOS",
        "Geo": "地理位置",
        "Language": "语言",
        "Device": "设备",
        "Browser": "浏览器",
        "OS": "操作系统",

        // 设置 - 常规
        "Workspace Name": "工作区名称",
        "Customer Insights": "客户洞察",
        "Want to see more details about your customers' LTV, country breakdown etc.? Upgrade to our Business Plan to get deeper, real-time customer insights. ": "想要查看关于您客户的 LTV、国家/地区分布等更多详细信息吗？升级到我们的 Business 计划以获取更深入的实时客户洞察。 ",
        "Learn more ↗": "了解更多 ↗",
        "This is the name of your workspace on Dub.": "这是您在 Dub 上的工作区名称。",
        "Max 32 characters.": "最多 32 个字符。",
        "Save Changes": "保存更改",
        "Workspace Slug": "工作区 Slug",
        "This is your workspace's unique slug on Dub.": "这是您在 Dub 上的唯一工作区标识。",
        "Only lowercase letters, numbers, and dashes. Max 48 characters.": "仅限小写字母、数字和短划线。最多 48 个字符。",
        "Workspace Logo": "工作区 Logo",
        "This is your workspace's logo on Dub.": "这是您在 Dub 上的工作区 Logo。",
        "Square image recommended. Accepted file types: .png, .jpg. Max file size: 2MB.": "建议使用正方形图片。支持格式：.png, .jpg。最大文件大小：2MB。",
        "Delete Workspace": "删除工作区",
        "Permanently delete your workspace, custom domain, and all associated links + their stats. This action cannot be undone - please proceed with caution.": "永久删除您的工作区、自定义域名以及所有关联链接和统计数据。此操作无法撤销 - 请谨慎操作。",
        // "Delete Workspace": "删除工作区", // Button - duplicate key, handled by the first one

        // 设置 - 账单/用量
        "Free Plan": "免费套餐",
        "Current billing cycle": "当前计费周期",
        "Events tracked": "追踪的事件",
        "Links created": "创建的链接",
        "remaining of": "剩余 (总计", // Partial match strategy might be needed or regex
        "View invoices": "查看发票",
        "Unsorted": "未分类",
        "Teammates": "团队成员",
        "Partners": "合作伙伴",
        "Partner Groups": "合作伙伴组",
        "Partner payouts": "合作伙伴支出",
        "Payout fees": "支出费用",

        // 设置 - 域名
        "Custom domains": "自定义域名",
        "Default domains": "默认域名",
        "Active": "活跃",
        "Archived": "已归档",
        "Add custom domain": "添加自定义域名",
        "No custom domains found": "未找到自定义域名",
        "Use custom domains for better brand recognition and click-through rates": "使用自定义域名以获得更好的品牌识别度和点击率",
        "Add Domain": "添加域名",

        // 设置 - 安全/审计
        "SAML Single Sign-On": "SAML 单点登录",
        "Set up SAML Single Sign-On (SSO) to allow your team to sign in to Dub with your identity provider.": "设置 SAML 单点登录 (SSO)，允许您的团队使用身份提供商登录 Dub。",
        "Choose an identity provider to get started.": "选择一个身份提供商以开始。",
        "Configure": "配置",
        "Require workspace members to login with SAML to access this workspace": "要求工作区成员使用 SAML 登录以访问此工作区",
        "Directory Sync": "目录同步",
        "Automatically provision and deprovision users from your identity provider.": "自动从您的身份提供商配置和取消配置用户。",
        "Audit Logs": "审计日志",
        "Workspace partner and payout history": "工作区合作伙伴和支出历史记录",
        "Last 12 months": "过去 12 个月",
        "Export CSV": "导出 CSV",
        "Audit logs are available on the Enterprise Plan": "审计日志仅在企业版套餐中可用",

        // 设置 - 通知
        "Workspace Notifications": "工作区通知",
        "Adjust your personal notification preferences and choose which updates you want to receive. These settings will only be applied to your personal account.": "调整您的个人通知偏好并选择您希望接收的更新。这些设置仅适用于您的个人帐户。",
        "Domain configuration updates": "域名配置更新",
        "Updates to your custom domain configuration.": "您的自定义域名配置的更新。",
        "Monthly links usage summary": "每月链接用量摘要",
        "Monthly summary email of your top 5 links by usage & total links created.": "包含您用量前 5 名链接及创建链接总数的每月摘要邮件。",
        "New partner application": "新合作伙伴申请",
        "Alert when a new partner application is made in your partner program.": "当您的合作伙伴计划中有新的合作伙伴申请时发出提醒。",
        "New partner sale": "新合作伙伴销售",
        "Alert when a new sale is made in your partner program.": "当您的合作伙伴计划中有新的销售时发出提醒。",
        "New bounty submitted": "新赏金提交",
        "Alert when a new bounty is submitted in your partner program.": "当您的合作伙伴计划中有新的赏金提交时发出提醒。",
        "New message from partner": "来自合作伙伴的新消息",
        "Alert when a new message is received from a partner in your partner program.": "当收到合作伙伴计划中合作伙伴的新消息时发出提醒。",
        "Daily Fraud events summary": "每日欺诈事件摘要",
        "Daily summary email of unresolved fraud events detected in your partner program.": "在您的合作伙伴计划中检测到的未解决欺诈事件的每日摘要邮件。",

        // 合作伙伴计划 (Partner Program)
        "Partner Program": "合作伙伴计划",
        "Overview": "概览",
        "Payouts": "支出",
        "Groups": "群组",
        "Applications": "申请",
        "Commissions": "佣金",
        "Fraud Detection": "欺诈检测",
        "Bounties": "赏金",
        "Email Campaigns": "邮件营销",
        "Resources": "资源",
        "Rewards": "奖励",
        "Branding": "品牌",
        "Engagement": "互动",
        "Configuration": "配置",
        "Kickstart viral product-led growth with powerful, branded referral and affiliate programs.": "通过强大的品牌推荐和联盟计划，启动病毒式产品驱动增长。",
        "Learn more": "了解更多",

        // 侧边栏菜单
        "API Keys": "API 密钥",
        "OAuth Apps": "OAuth 应用",
        "Webhooks": "Webhooks",
        "Account": "账户",

        // 首页/营销页
        "Why Dub?": "为什么选择 Dub?",
        "The Open-Source Link Management Infrastructure": "开源链接管理基础设施",
        "Short Links": "短链接",
        "Custom Domains": "自定义域名",
        "QR Codes": "二维码",
        "API": "API",
        "Self-Hosting": "自托管",
        "Create short links in seconds": "几秒钟内创建短链接",
        "Track your link performance": "追踪链接表现",
        "Use your own custom domains": "使用自定义域名",
        "Generate QR codes for your links": "生成链接二维码",
        "Open Source": "开源",
        "Terms": "条款",
        "Privacy": "隐私",
        "Security": "安全",
        "GitHub": "GitHub",
        "Twitter": "Twitter",

        // 设置相关
        "General": "常规",
        "Domains": "域名",
        "Members": "成员",
        "Billing": "账单",
        "Integrations": "集成",
        "Developer": "开发者",
        "Profile": "个人资料",
        "Appearance": "外观",
        "Notifications": "通知",

        // 按钮与动作
        "Save": "保存",
        "Cancel": "取消",
        "Confirm": "确认",
        "Back": "返回",
        "Next": "下一步",
        "Previous": "上一步",
        "Submit": "提交",
        "Close": "关闭",
        "Apply": "应用",
        "Reset": "重置",
        "Loading...": "加载中...",
        "No links found": "未找到链接",
    };

    // 正则表达式替换规则
    const regexReplacements = [
        { regex: /^Viewing (\d+)-(\d+) of (\d+) links$/, replacement: "正在查看 $1-$2 / $3 个链接" },
        { regex: /^You've hit the monthly usage limit on your current plan\. Upgrade to keep using Dub\.$/, replacement: "您当前的套餐已达到每月使用限额。请升级以继续使用 Dub。" },
        { regex: /^Usage will reset (.+)$/, replacement: "用量将于 $1 重置" },
        { regex: /^(\d+)% complete$/, replacement: "完成 $1%" },
        { regex: /^(\d+) clicks$/, replacement: "$1 次点击" },
        { regex: /^Your workspace has exceeded your monthly events limit\. We're still collecting data on your links, but you need to upgrade to view them\.$/, replacement: "您的工作区已超过每月事件限制。我们仍在收集您的链接数据，但您需要升级才能查看它们。" },
        { regex: /^You can only use Link Folders on a Pro plan and above\. Upgrade to Pro to continue\.$/, replacement: "您只能在 Pro 计划及以上版本中使用链接文件夹。升级到 Pro 以继续。" },
    ];

    // 规范化文本：去除首尾空格，合并多余空白
    function normalizeText(text) {
        return text.trim().replace(/\s+/g, ' ');
    }

    // 翻译节点
    function translateNode(node) {
        // 处理文本节点
        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = normalizeText(node.nodeValue);

            // 1. 字典精确匹配
            if (i18n[originalText]) {
                node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), i18n[originalText]);
                return;
            }

            // 2. 正则匹配
            for (const { regex, replacement } of regexReplacements) {
                if (regex.test(originalText)) {
                    node.nodeValue = originalText.replace(regex, replacement);
                    return;
                }
            }
            return;
        }

        // 处理元素节点
        if (node.nodeType === Node.ELEMENT_NODE) {
            // 忽略脚本和样式标签
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'NOSCRIPT') {
                return;
            }

            // 处理 placeholder
            if (node.placeholder) {
                const originalPlaceholder = normalizeText(node.placeholder);
                if (i18n[originalPlaceholder]) {
                    node.placeholder = i18n[originalPlaceholder];
                }
            }

            // 处理 title
            if (node.title) {
                const originalTitle = normalizeText(node.title);
                if (i18n[originalTitle]) {
                    node.title = i18n[originalTitle];
                }
            }

            // 处理 aria-label
            if (node.hasAttribute('aria-label')) {
                const originalLabel = normalizeText(node.getAttribute('aria-label'));
                if (i18n[originalLabel]) {
                    node.setAttribute('aria-label', i18n[originalLabel]);
                }
            }

            // 递归处理子节点
            node.childNodes.forEach(translateNode);
        }
    }

    // 遍历整个文档
    function traverse() {
        translateNode(document.body);
    }

    // 观察 DOM 变化
    const observerConfig = {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['placeholder', 'title', 'aria-label']
    };

    const observer = new MutationObserver((mutations) => {
        // 暂停观察，防止无限循环（翻译本身也是一种变动）
        observer.disconnect();

        try {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        translateNode(node);
                    });
                } else if (mutation.type === 'characterData') {
                    translateNode(mutation.target);
                } else if (mutation.type === 'attributes') {
                    translateNode(mutation.target);
                }
            });
        } catch (e) {
            console.error('Dub.co 汉化脚本出错:', e);
        } finally {
            // 恢复观察
            observer.observe(document.body, observerConfig);
        }
    });

    // 启动
    function init() {
        console.log('Dub.co 汉化脚本已启动');

        // 初始全量翻译
        // 同样需要暂停观察，虽然此时 observer 可能还没 attach，但为了保险
        translateNode(document.body);

        // 开启观察
        observer.observe(document.body, observerConfig);
    }

    // 确保页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();