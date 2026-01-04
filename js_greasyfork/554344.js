// ==UserScript==
// @name         e621 框架汉化
// @namespace    Lecrp.com
// @version      2.0.1
// @description  汉化 e621 框架
// @author       jcjyids
// @match        https://e621.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554344/e621%20%E6%A1%86%E6%9E%B6%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/554344/e621%20%E6%A1%86%E6%9E%B6%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置区域 ==========
    const CONFIG = {
        debug: false, // 调试开关，控制一般等级日志输出
        maxDepth: 10, // 最大遍历深度
        throttleDelay: 200, // 节流延迟（毫秒）
        observerDelay: 200, // MutationObserver启动延迟（毫秒）

        //=======================================================================
        //                             文本替换配置
        //=======================================================================
        TextReplace: [
            {
                selector: "h2",
                mappings: [
                    { original: "We're performing some brief maintenance on e621. The site will be back online in a few minutes.", translated: "我们正在对 e621 进行一些短暂的维护。网站将在几分钟内恢复在线。" },
                    { original: "Pools", translated: "帖子" },
                ]
            },
            //主站
            {
                selector: "#a-home",
                mappings: [
                    { original: "Latest", translated: "最新" },
                    { original: "Popular", translated: "热门" },
                    { original: "Mascot by", translated: "吉祥物设计师 " },
                    { original: "Swap Mascot", translated: "切换吉祥物" },
                    { original: "Takedowns", translated: "下架" },
                    { original: "Contact Us", translated: "联系我们" },
                    { original: "Advertising", translated: "广告" },
                    { original: "Terms of Use", translated: "使用条款" },
                    { original: "Privacy", translated: "隐私" },
                    { original: "", translated: "" },
                ]
            },
            //左上角顶部左半
            {
                selector: "menu.nav-primary.desktop",
                mappings: [
                    { original: "Artists", translated: "艺术家" },
                    { original: "Posts", translated: "帖子" },
                    { original: "Pools", translated: "图库" },
                    { original: "Sets", translated: "合集" },
                    { original: "Tags", translated: "标签" },
                    { original: "Blips", translated: "动态" },
                    { original: "Comments", translated: "评论" },
                    { original: "Forum", translated: "论坛" },
                    { original: "", translated: "" },
                ]
            },
            //左上角顶部右半
            {
                selector: "menu.nav-help.desktop",
                mappings: [
                    { original: "Wiki", translated: "百科" },
                    { original: "Help", translated: "帮助" },
                    { original: "More", translated: "更多" },
                    { original: "", translated: "" },
                ]
            },
            //左上角次顶部多页不同按钮
            {
                selector: "menu.nav-secondary.desktop",
                mappings: [
                    { original: "Listing", translated: "全部" },
                    { original: "Upload", translated: "上传" },
                    { original: "Hot", translated: "热门" },
                    { original: "Popular", translated: "最受欢迎" },
                    { original: "Favorites", translated: "收藏夹" },
                    { original: "Changes", translated: "变化" },
                    { original: "Blacklist", translated: "黑名单" },
                    { original: "Help", translated: "帮助" },
                    { original: "Avoid Posting", translated: "避免发布" },
                    { original: "New", translated: "新建" },
                    { original: "Recent changes", translated: "最近更改" },
                    { original: "URLs", translated: "网址" },
                    { original: "Gallery", translated: "画廊" },
                    { original: "New", translated: "新建" },
                    { original: "List", translated: "列表" },
                    { original: "New", translated: "新建" },
                    { original: "Mine", translated: "我的" },
                    { original: "Invites", translated: "邀请" },
                    { original: "MetaSearch", translated: "元搜索" },
                    { original: "Aliases", translated: "别名" },
                    { original: "Implications", translated: "关联" },
                    { original: "Bulk updates", translated: "批量更新" },
                    { original: "Related tags", translated: "相关标签" },
                    { original: "Cheatsheet", translated: "速查表" },
                    { original: "Search", translated: "搜索" },
                    { original: "Request alias", translated: "请求别名" },
                    { original: "Request implication", translated: "请求关联" },
                    { original: "Request BUR", translated: "请求批量更新" },
                    { original: "Mark all as read", translated: "标记全部已读" },
                    { original: "Edit Tag Type", translated: "编辑标签类型" },
                    { original: "History", translated: "历史" },
                    { original: "Edit", translated: "编辑" },
                    { original: "Report", translated: "举报" },
                    { original: "Settings", translated: "设置" },
                    { original: "Profile", translated: "个人资料" },
                    { original: "Messages", translated: "消息" },
                    { original: "Sign out", translated: "退出登录" },
                    { original: "All", translated: "全部" },
                    { original: "Received", translated: "已收到" },
                    { original: "Sent", translated: "已发送" },
                    { original: "", translated: "" },
                ]
            },
            //针对手机版右上角菜单主题与设置按钮
            {
                selector: "menu.nav-tools.desktop",
                mappings: [
                    { original: "Themes", translated: "主题" },
                    { original: "Settings", translated: "设置" },
                ]
            },
            //顶部右上角按钮悬浮窗
            {
                selector: "menu.nav-controls.desktop > .simple-avatar-menu",
                mappings: [
                    { original: "Profile", translated: "个人资料" },
                    { original: "Messages", translated: "消息" },
                    { original: "Favorites", translated: "收藏" },
                    { original: "Sets", translated: "集合" },
                    { original: "Sign Out", translated: "退出登录" }
                ]
            },
            //某些页面的搜索
            {
                selector: "#search-form-show-link",
                mappings: [
                    { original: "Show Search Options", translated: "显示搜索选项" },
                ]
            },
            {
                selector: "#search-form-hide-link",
                mappings: [
                    { original: "Hide Search Options", translated: "隐藏搜索选项" },
                ]
            },
            //搜索选项内部
            {
                selector: "#searchform",
                mappings: [
                    { original: "Name", translated: "名称" },
                    { original: "Use * for wildcard", translated: "使用 * 作为通配符" },
                    { original: "Creator", translated: "创作者" },
                    { original: "Linked?", translated: "已链接账号？" },
                    { original: "Recently created", translated: "最近创建" },
                    { original: "Last updated", translated: "最后更新" },
                    { original: "Post count", translated: "帖子数量" },
                    { original: "Category", translated: "分类" },
                    { original: "General", translated: "通用" },
                    { original: "Artist", translated: "艺术家" },
                    { original: "Contributor", translated: "贡献者" },
                    { original: "Copyright", translated: "版权" },
                    { original: "Character", translated: "角色" },
                    { original: "Species", translated: "物种" },
                    { original: "Invalid", translated: "无效" },
                    { original: "Meta", translated: "媒体" },
                    { original: "Lore", translated: "背景设定" },
                    { original: "Order", translated: "排序" },
                    { original: "Count", translated: "数量" },
                    { original: "Newest", translated: "最新" },
                    { original: "Has wiki?", translated: "有Wiki页面?" },
                    { original: "Has artist?", translated: "有艺术家?" },
                    { original: "Hide empty?", translated: "隐藏空标签?" },
                    { original: "yes", translated: "是" },
                    { original: "no", translated: "否" },
                    { original: "", translated: "" },
                ]
            },
            //搜索框上
            {
                selector: ".post-index > .search > .post-search",
                mappings: [
                    { original: "Posts", translated: "帖子" },
                    { original: "Favorites", translated: "收藏夹" },
                    { original: "[search help]", translated: "[搜索帮助]" },
                    { original: "", translated: "" },
                ]
            },
            //搜索框旁设置内部
            {
                selector: ".post-index > .search > .search-settings-container",
                mappings: [
                    { original: "Layout Settings", translated: "布局设置" },
                    { original: "Image Crop", translated: "图片显示" },
                    { original: "Crop", translated: "铺满" },
                    { original: "Full", translated: "原始" },
                    { original: "Card Size", translated: "卡片尺寸" },
                    { original: "Small", translated: "小" },
                    { original: "Medium", translated: "中" },
                    { original: "Large", translated: "大" },
                    { original: "Hover Text", translated: "悬停文本" },
                    { original: "Short", translated: "简短" },
                    { original: "Long", translated: "详细" },
                    { original: "None", translated: "无" },
                    { original: "Sticky Searchbar", translated: "固定搜索栏" },
                    { original: "Close settings", translated: "关闭设置" },
                ]
            },
            //模式
            {
                selector: "#mode-box",
                mappings: [
                    { original: "Mode", translated: "模式" },
                    { original: "View", translated: "查看" },
                    { original: "Edit", translated: "编辑" },
                    { original: "Favorite", translated: "收藏" },
                    { original: "Unfavorite", translated: "取消收藏" },
                    { original: "Add To Set", translated: "添加到集合" },
                    { original: "Remove From Set", translated: "从集合移除" },
                ]
            },
            //标签
            {
                selector: "#tag-box .tag-list-header.all-tag-list-header",
                mappings: [
                    { original: "Tags", translated: "标签" },
                ]
            },
            //相关
            {
                selector: "#related-box",
                mappings: [
                    { original: "Related", translated: "相关" },
                    { original: "Hot", translated: "热门" },
                    { original: "Popular", translated: "最受欢迎" },
                    { original: "Random", translated: "随机" },
                    { original: "Random post", translated: "随机" },
                    { original: "", translated: "" },
                ]
            },
            //搜索结果帖子数量
            {
                selector: ".posts-index-stats",
                mappings: [
                    { original: "~* results", translated: "约 * 个结果" },
                    { original: "over * results", translated: "超过 * 个结果" },
                    { original: "* results", translated: "* 个结果" },
                ]
            },
            //收藏夹说明
            {
                selector: ".post-index > .search",
                mappings: [
                    { original: "Searching favorites does not preserve the order in which they were added.", translated: "搜索收藏夹不会保留添加的顺序" },
                    { original: "", translated: "" },
                ]
            },
            //帖子标签
            {
                selector: "#tag-list",
                mappings: [
                    { original: "Artists", translated: "艺术家" },
                    { original: "Contributors", translated: "贡献者" },
                    { original: "Copyrights", translated: "版权" },
                    { original: "Characters", translated: "角色" },
                    { original: "Species", translated: "物种" },
                    { original: "General", translated: "一般" },
                    { original: "Meta", translated: "媒体" },
                    { original: "Lore", translated: "设定" },
                    { original: "", translated: "" },
                ]
            },
            //标签往下的帖子信息
            {
                selector: "#post-information",
                mappings: [
                    { original: "Information", translated: "信息" },
                    { original: "Source:", translated: "来源:" },
                    { original: "ID", translated: "ID" },
                    { original: "MD5", translated: "MD5" },
                    { original: "Size", translated: "尺寸" },
                    { original: "Type", translated: "类型" },
                    { original: "Status", translated: "状态" },
                    { original: "Rating", translated: "评级" },
                    { original: "Score", translated: "评分" },
                    { original: "Faves", translated: "收藏" },
                    { original: "Pending", translated: "待审核" },
                    { original: "Explicit", translated: "限制级" },
                    { original: "Posted:", translated: "发布于:" },
                    { original: "* minute ago", translated: "* 分钟前" },
                    { original: "* minutes ago", translated: "* 分钟前" },
                    { original: "about * minute ago", translated: "大约 * 分钟前" },
                    { original: "about * minutes ago", translated: "大约 * 分钟前" },
                    { original: "* hour ago", translated: "* 小时前" },
                    { original: "* hours ago", translated: "* 小时前" },
                    { original: "about * hour ago", translated: "大约 * 小时前" },
                    { original: "about * hours ago", translated: "大约 * 小时前" },
                    { original: "* day ago", translated: "* 天前" },
                    { original: "* days ago", translated: "* 天前" },
                    { original: "about * day ago", translated: "大约 * 天前" },
                    { original: "about * days ago", translated: "大约 * 天前" },
                    { original: "* month ago", translated: "* 月前" },
                    { original: "* months ago", translated: "* 月前" },
                    { original: "about * month ago", translated: "大约 * 月前" },
                    { original: "about * months ago", translated: "大约 * 月前" },
                    { original: "* year ago", translated: "* 年前" },
                    { original: "* years ago", translated: "* 年前" },
                    { original: "about * year ago", translated: "大约 * 年前" },
                    { original: "about * years ago", translated: "大约 * 年前" },
                    { original: "Show", translated: "查看" },
                    { original: "Uploader:", translated: "上传者:" },
                    { original: "Approver:", translated: "审核员:" },
                    { original: "Show", translated: "查看" },
                    { original: "", translated: "" },
                ]
            },
            //帖子选项
            {
                selector: "#post-options",
                mappings: [
                    { original: "Options", translated: "选项" },
                    { original: "Edit", translated: "编辑" },
                    { original: "Download", translated: "下载" },
                    { original: "Add to pool", translated: "添加到图库" },
                    { original: "Add to set", translated: "添加到集合" },
                    { original: "Set as avatar", translated: "设为头像" },
                    { original: "Edit Notes", translated: "编辑注释" },
                    { original: "Flag", translated: "标记" },
                    { original: "Report", translated: "举报" },
                ]
            },
            //帖子历史记录
            {
                selector: "#post-history",
                mappings: [
                    { original: "History", translated: "历史记录" },
                    { original: "Tags/Desc", translated: "标签/描述" },
                    { original: "Notes", translated: "注释" },
                    { original: "Events", translated: "事件" },
                    { original: "Replacements", translated: "替换记录" },
                ]
            },
            //相关内容
            {
                selector: "#post-related-images",
                mappings: [
                    { original: "Related", translated: "相关内容" },
                    { original: "Sets with this post", translated: "包含此帖子的集合" },
                    { original: "Visually similar on E6", translated: "E6上的视觉相似内容" },
                    { original: "Google", translated: "使用Google搜图" },
                    { original: "SauceNAO", translated: "使用SauceNAO搜图" },
                    { original: "Derpibooru", translated: "使用Derpibooru搜图" },
                    { original: "Yandex", translated: "使用Yandex搜图" },
                    { original: "FuzzySearch", translated: "使用FuzzySearch搜图" },
                    { original: "Fluffle", translated: "使用Fluffle搜图" },
                    { original: "Inkbunny", translated: "使用Inkbunny搜图" }
                ]
            },
            //帖子媒体上部
            {
                selector: "#nav-links-top",
                mappings: [
                    { original: "Prev", translated: "上一页" },
                    { original: "Next", translated: "下一页" },
                    { original: "First", translated: "首页" },
                    { original: "Last", translated: "末页" },
                ]
            },
            //帖子媒体下部
            {
                selector: "#image-resize-notice",
                mappings: [
                    { original: "Viewing sample resized to", translated: "显示的样本大小为" },
                    { original: "of original (", translated: ";查看原始大小 (" },
                    { original: "view original", translated: "查看原图" },
                    { original: "Loading...", translated: "加载中..." },
                    { original: "", translated: "" },
                    { original: "", translated: "" },
                ]
            },
            //帖子操作按钮
            {
                selector: "#image-resize-selector",
                mappings: [
                    { original: "Original", translated: "原始尺寸" },
                    { original: "Fit (Horizontal)", translated: "适应（水平）" },
                    { original: "Fit (Vertical)", translated: "适应（垂直）" },
                    { original: "Sample (850px)", translated: "样本（850像素）" },
                    { original: "Sample (720p)", translated: "样本（720p）" },
                    { original: "Sample (480p)", translated: "样本（480p）" },
                ]
            },
            {
                selector: "#ptbr-wrapper .ptbr-fullscreen",
                mappings: [
                    { original: "View", translated: "打开原图" },
                ]
            },
            {
                selector: "#ptbr-wrapper .ptbr-etc",
                mappings: [
                    { original: "Fullscreen", translated: "全屏" },
                    { original: "Download", translated: "下载" },
                    { original: "Add to Pool", translated: "添加到图库" },
                    { original: "Add to Set", translated: "添加到集合" },
                ]
            },
            {
                selector: "#pending-approval-notice",
                mappings: [
                    { original: "This post is pending approval. (", translated: "这篇帖子正在等待审核。(" },
                    { original: "learn more", translated: "了解更多" },
                    { original: "", translated: "" },
                ]
            },
            //帖子描述
            {
                selector: "#description",
                mappings: [
                    { original: "Description", translated: "描述" },
                ]
            },
            //评论区
            {
                selector: "#post-sections",
                mappings: [
                    { original: "Comments", translated: "评论" },
                    { original: "Edit", translated: "编辑" }
                ]
            },
            {
                selector: "#comments",
                mappings: [
                    { original: "There are no comments.", translated: "暂无评论。" },
                    { original: "Before commenting, read the", translated: "评论前请阅读" },
                    { original: "how to comment guide", translated: "评论指南" },
                    { original: "Post comment", translated: "发表评论" },
                    { original: "Write", translated: "编写" },
                    { original: "Preview", translated: "预览" },
                    { original: "Submitting...", translated: "提交中..." },
                    { original: "No bump", translated: "不顶帖" },
                    { original: "formatting supported.", translated: "格式支持" }
                ]
            },
            //底部信息
            {
                selector: ".footer-wrapper .footer-grid",
                mappings: [
                    { original: "Terms of Use", translated: "使用条款" },
                    { original: "Takedowns", translated: "下架请求" },
                    { original: "Privacy", translated: "隐私政策" },
                    { original: "Contact", translated: "联系我们" },
                    { original: "Advertising", translated: "广告" },
                    { original: "Running e621ng", translated: "运行 e621ng" },
                    { original: "Themes / Gestures", translated: "主题 / 姿势" },
                    { original: "Keyboard Shortcuts", translated: "键盘快捷键" },
                    { original: "Mobile mode: ON", translated: "移动设备模式: 开启" },
                    { original: "Mobile mode: OFF", translated: "移动设备模式: 关闭" },
                ]
            },
            //主题设置页
            {
                selector: "#page .theme-form",
                mappings: [
                    // 标题和说明文本
                    { original: "Theme settings are saved locally in your browser.\n    This means that they will not persist across multiple devices, or in incognito mode.", translated: "主题设置保存在浏览器本地,这意味着它们不会在多个设备上同步，包括隐身模式。" },
                    { original: "Theme Preferences", translated: "主题偏好" },
                    { original: "Theme", translated: "主题" },
                    { original: "Embellishments", translated: "装饰效果" },
                    { original: "Logo", translated: "徽标" },
                    { original: "Accessibility", translated: "无障碍功能" },
                    { original: "Palette", translated: "配色方案" },
                    { original: "Font", translated: "字体" },
                    { original: "Features", translated: "功能" },
                    { original: "Wiki Excerpt", translated: "Wiki摘要" },
                    { original: "Navigation", translated: "导航" },
                    { original: "Other", translated: "其他" },

                    // 主题选项
                    { original: "Hexagon", translated: "六边形" },
                    { original: "Bloodlust", translated: "嗜血" },
                    { original: "Pony", translated: "小马" },
                    { original: "Serpent", translated: "蛇" },
                    { original: "Hotdog", translated: "热狗" },

                    // 装饰效果选项
                    { original: "(None)", translated: "（无）" },
                    { original: "Aurora", translated: "极光" },
                    { original: "Autumn", translated: "秋季" },
                    { original: "Space", translated: "太空" },
                    { original: "Spring", translated: "春季" },
                    { original: "Stars", translated: "星空" },
                    { original: "Eternal Winter", translated: "永恒冬季" },

                    // 徽标选项
                    { original: "Default", translated: "默认" },
                    { original: "Pride", translated: "骄傲" },
                    { original: "Asexual", translated: "无性恋" },
                    { original: "Aromantic", translated: "无浪漫倾向" },
                    { original: "Bisexual", translated: "双性恋" },
                    { original: "French", translated: "法国" },
                    { original: "Gay", translated: "同性恋" },
                    { original: "Genderfluid", translated: "性别流动" },
                    { original: "Lesbian", translated: "女同性恋" },
                    { original: "Nonbinary", translated: "非二元性别" },
                    { original: "Omnisexual", translated: "全性恋" },
                    { original: "Pansexual", translated: "泛性恋" },
                    { original: "Transgender", translated: "跨性别" },

                    // 无障碍选项
                    { original: "Protanopia & Deuteranopia", translated: "红色盲和绿色盲" },
                    { original: "Tritanopia", translated: "蓝色盲" },

                    // Wiki摘要选项
                    { original: "Collapsed", translated: "折叠" },
                    { original: "Expanded", translated: "展开" },
                    { original: "Disabled", translated: "禁用" },

                    // 导航选项
                    { original: "Sticky Header", translated: "固定顶部栏" },
                    { original: "Sticky Searchbar", translated: "固定搜索栏" },
                    { original: "Navbar location", translated: "导航栏位置" },
                    { original: "Mobile Gestures", translated: "移动端手势" },
                    { original: "Disabled", translated: "禁用" },
                    { original: "Enabled", translated: "启用" },
                    { original: "Top (default)", translated: "顶部（默认）" },
                    { original: "Bottom", translated: "底部" },
                    { original: "Both", translated: "两者" },
                    { original: "Off (not recommended)", translated: "关闭（不推荐）" },

                    // 其他选项
                    { original: "Events", translated: "活动" },

                    // 提示文本
                    { original: "Swipe left for next page/image. Swipe right for previous page/image.", translated: "向左滑动查看下一页/图片，向右滑动查看上一页/图片。" },
                    { original: "Opt out of site events, like April Fool's Day.", translated: "选择是否参与网站活动，例如愚人节活动。" },
                ]
            },
            //变量
            {
                selector: "#page .theme-variable-form",
                mappings: [
                    { original: "Variables", translated: "变量" },
                    { original: "Mascot", translated: "吉祥物" },
                ]
            },
            //最受欢迎
            {
                selector: "#popular-nav-links",
                mappings: [
                    { original: "«prev", translated: "«上一页" },
                    { original: "next»", translated: "下一页»" },
                    { original: "Day", translated: "日排行" },
                    { original: "Week", translated: "周排行" },
                    { original: "Month", translated: "月排行" }
                ]
            },
            //悬浮窗（黑名单窗口）
            {
                selector: "#dialog-container",
                mappings: [
                    { original: "Blacklist", translated: "黑名单" },
                    { original: "Tag Blacklist", translated: "标签黑名单" },
                    { original: "Blacklist Help", translated: "黑名单帮助" },
                ]
            },
            // 添加更多元素替换规则...
        ],
        //=======================================================================
        //                             属性替换配置
        //=======================================================================
        AttributeReplace: [
            //示例
            {
                selector: "选择器",
                mappings: [
                    {attribute: "属性", original: "原文", translated: "译文" }
                ]
            },
            //主题按钮
            {
                selector: "#nav-themes",
                mappings: [
                    {attribute: "title", original: "Site Themes", translated: "主题" }
                ]
            },
            //搜索选项按钮
            {
                selector: "#searchform input[type='submit']",
                mappings: [
                    {attribute: "value", original: "Search", translated: "搜索" },
                    {attribute: "data-disable-with", original: "Search", translated: "搜索中" },
                ]
            },
            //搜索框提示
            {
                selector: "#a-home,#tags",
                mappings: [
                    {attribute: "placeholder", original: "Search posts by tag", translated: "按标签搜索" },
                ]
            },
            //搜索框旁按钮
            {
                selector: "#search-fullscreen",
                mappings: [
                    {attribute: "title", original: "Fullscreen mode", translated: "全屏模式" }
                ]
            },
            //搜索框旁设置
            {
                selector: "#search-settings",
                mappings: [
                    {attribute: "title", original: "Search settings", translated: "搜索设置" }
                ]
            },
            //？
            {
                selector: "#set-id optgroup",
                mappings: [
                    {attribute: "label", original: "Owned", translated: "拥有" },
                    {attribute: "label", original: "Maintained", translated: "维护" },
                ]
            },
            //评论区工具按钮
            {
                selector: "#comments .dtext-formatter-button",
                mappings: [
                    {attribute: "title", original: "Bold", translated: "粗体" },
                    {attribute: "title", original: "Italic", translated: "斜体" },
                    {attribute: "title", original: "Underline", translated: "下划线" },
                    {attribute: "title", original: "Strikethrough", translated: "删除线" },
                    {attribute: "title", original: "Heading", translated: "标题" },
                    {attribute: "title", original: "Spoiler", translated: "剧透" },
                    {attribute: "title", original: "Code", translated: "代码" },
                    {attribute: "title", original: "Quote", translated: "引用" },
                    {attribute: "aria-label", original: "Bold", translated: "粗体" },
                    {attribute: "aria-label", original: "Italic", translated: "斜体" },
                    {attribute: "aria-label", original: "Underline", translated: "下划线" },
                    {attribute: "aria-label", original: "Strikethrough", translated: "删除线" },
                    {attribute: "aria-label", original: "Heading", translated: "标题" },
                    {attribute: "aria-label", original: "Spoiler", translated: "剧透" },
                    {attribute: "aria-label", original: "Code", translated: "代码" },
                    {attribute: "aria-label", original: "Quote", translated: "引用" },
                ]
            },
            //评论区提交
            {
                selector: "#new_comment input[type='submit']",
                mappings: [
                    {attribute: "value", original: "Submit", translated: "提交" }
                ]
            },
            {
                selector: "#quick_search_name_matches",
                mappings: [
                    {attribute: "placeholder", original: "Search pools", translated: "搜索图库" }
                ]
            },
            {
                selector: "#quick_search_name",
                mappings: [
                    {attribute: "placeholder", original: "Search artists", translated: "搜索艺术家" }
                ]
            },{
                selector: "#quick_search_name_matches",
                mappings: [
                    {attribute: "placeholder", original: "Search tags", translated: "搜索标签" },
                ]
            },
            {
                selector: "#quick_search_body_matches",
                mappings: [
                    {attribute: "placeholder", original: "Search comments", translated: "搜索评论" },
                ]
            },
            {
                selector: "#quick_search_body_matches",
                mappings: [
                    {attribute: "placeholder", original: "Search forum", translated: "搜索论坛" },
                ]
            },
            {
                selector: "#quick_search_title",
                mappings: [
                    {attribute: "placeholder", original: "Search wiki pages", translated: "搜索百科页面" },
                ]
            },
            {
                selector: "#blacklist-save",
                mappings: [
                    {attribute: "value", original: "Save", translated: "保存" },
                ]
            },
            {
                selector: "#blacklist-cancel",
                mappings: [
                    {attribute: "value", original: "Cancel", translated: "取消" },
                ]
            },
            {
                selector: "button.tag-list-quick-blacklist",
                mappings: [
                    {attribute: "title", original: "Add * to your blacklist", translated: "将 * 添加到黑名单" },
                ]
            },
            // 添加更多属性替换规则...
        ]
    };

    // ========== 日志系统 ==========
    const logger = {
        /**
     * 记录一般信息（受debug开关控制）
     * @param {string} message - 日志消息
     * @param {*} [data] - 附加数据
     */
        info(message, data) {
            if (CONFIG.debug) {
                console.log(`%c[Translation Script INFO] ${message}`, 'color: gray;', data || '');
            }
        },

        /**
     * 记录详细调试信息（受debug开关控制）
     * @param {string} message - 调试消息
     * @param {*} [data] - 附加数据
     */
        debug(message, data) {
            if (CONFIG.debug) {
                console.log(`%c[Translation Script DEBUG] ${message}`, 'color: pink;', data || '');
            }
        },

        /**
     * 记录警告信息
     * @param {string} message - 警告消息
     * @param {*} [data] - 附加数据
     */
        warn(message, data) {
            console.warn(`%c[Translation Script WARN] ${message}`, 'color: orange;', data || '');
        },

        /**
     * 记录错误信息
     * @param {string} message - 错误消息
     * @param {*} [data] - 附加数据
     */
        error(message, data) {
            console.error(`%c[Translation Script ERROR] ${message}`, 'color: red;', data || '');
        }
    };

    // ========== 工具函数 ==========
    /**
   * 节流函数
   * @param {Function} func - 要执行的函数
   * @param {number} wait - 等待时间（毫秒）
   * @returns {Function} 节流后的函数
   */
    function throttle(func, wait) {
        let timeout = null;
        return function() {
            const context = this;
            const args = arguments;
            if (!timeout) {
                timeout = setTimeout(() => {
                    func.apply(context, args);
                    timeout = null;
                }, wait);
            }
        };
    }

    /**
   * 验证映射条目是否有效
   * @param {Object} mapping - 映射条目
   * @param {string} type - 映射类型（'text' 或 'attribute'）
   * @returns {boolean} 是否有效
   */
    function isValidMapping(mapping, type) {
        // 检查是否有空条目
        if (!mapping.original && !mapping.translated) {
            logger.info('忽略空白映射条目');
            return false;
        }

        // 检查是否有原文或译文缺失
        if (!mapping.original || !mapping.translated) {
            logger.warn('忽略不完整的映射条目', mapping);
            return false;
        }

        // 对于属性映射，检查是否有属性名
        if (type === 'attribute' && !mapping.attribute) {
            logger.warn('忽略没有属性名的属性映射条目', mapping);
            return false;
        }

        // 检查通配符数量是否匹配
        const originalStars = (mapping.original.match(/\*/g) || []).length;
        const translatedStars = (mapping.translated.match(/\*/g) || []).length;

        if (originalStars !== translatedStars) {
            logger.warn(`通配符数量不匹配: "${mapping.original}" -> "${mapping.translated}"`);
            return false;
        }

        return true;
    }

    /**
   * 通配符匹配和替换
   * @param {string} text - 待匹配的文本
   * @param {string} pattern - 包含通配符的模式
   * @param {string} replacement - 包含通配符的替换文本
   * @returns {string|null} 替换后的文本，如果匹配失败则返回null
   */
    function wildcardReplace(text, pattern, replacement) {
        logger.debug(`通配符匹配: 文本="${text}", 模式="${pattern}", 替换="${replacement}"`);

        // 如果没有通配符，直接比较
        if (!pattern.includes('*')) {
            const result = text === pattern ? replacement : null;
            logger.debug(`精确匹配结果: ${result}`);
            return result;
        }

        // 将模式按通配符分割，并转义特殊字符用于正则表达式
        const parts = pattern.split('*');
        const escapedParts = parts.map(part => {
            // 转义正则表达式中的特殊字符，但不包括通配符*
            return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        });

        // 构建正则表达式，确保通配符匹配至少一个字符
        const regexParts = [];
        for (let i = 0; i < escapedParts.length; i++) {
            regexParts.push(escapedParts[i]);
            if (i < escapedParts.length - 1) {
                regexParts.push('(.+?)'); // 非贪婪匹配至少一个字符
            }
        }

        const regexString = `^${regexParts.join('')}$`;
        logger.debug(`正则表达式: ${regexString}`);

        try {
            const regex = new RegExp(regexString);
            const match = text.match(regex);

            if (!match) {
                logger.debug(`正则匹配失败`);
                return null;
            }

            // 获取捕获组
            const captures = match.slice(1);
            logger.debug(`捕获组: ${JSON.stringify(captures)}`);

            // 构建替换结果
            let result = replacement;
            for (let i = 0; i < captures.length; i++) {
                result = result.replace('*', captures[i]);
            }

            logger.debug(`替换结果: ${result}`);
            return result;
        } catch (error) {
            logger.error(`正则表达式构建失败: ${regexString}`, error);
            return null;
        }
    }

    // ========== 核心替换逻辑 ==========
    /**
   * 执行文本替换
   * @param {Object} rule - 替换规则
   */
    function applyTextReplace(rule) {
        const { selector, mappings } = rule;
        logger.debug(`开始文本替换规则: ${selector}`);

        try {
            const containers = document.querySelectorAll(selector);
            logger.debug(`找到 ${containers.length} 个容器`);

            if (containers.length === 0) {
                logger.info(`未找到选择器: ${selector}`);
                return;
            }

            containers.forEach((container, containerIndex) => {
                logger.debug(`处理容器 ${containerIndex + 1}: ${container.tagName}.${container.className || ''}#${container.id || ''}`);

                // 遍历容器内的文本节点
                const walker = document.createTreeWalker(
                    container,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode(node) {
                            // 排除script和style标签内的文本节点
                            const tagName = node.parentElement?.tagName || '';
                            if (tagName === 'SCRIPT' || tagName === 'STYLE') {
                                return NodeFilter.FILTER_REJECT;
                            }
                            // 只处理非空文本
                            return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                        }
                    },
                    false
                );

                let node;
                const nodes = [];
                while ((node = walker.nextNode())) {
                    nodes.push(node);
                }

                logger.debug(`在容器中找到 ${nodes.length} 个文本节点`);

                // 处理所有文本节点
                nodes.forEach((textNode, nodeIndex) => {
                    const originalText = textNode.textContent;
                    const trimmedText = originalText.trim();

                    if (!trimmedText) {
                        return;
                    }

                    logger.debug(`处理文本节点 ${nodeIndex + 1}: "${trimmedText}"`);

                    let replaced = false;

                    // 按顺序尝试每个映射条目
                    for (const mapping of mappings) {
                        if (!isValidMapping(mapping, 'text')) {
                            logger.debug('文本映射无效，跳过');
                            continue;
                        }

                        logger.debug(`尝试文本映射: "${mapping.original}" -> "${mapping.translated}"`);
                        const result = wildcardReplace(trimmedText, mapping.original, mapping.translated);

                        if (result !== null) {
                            textNode.textContent = originalText.replace(trimmedText, result);

                            // 添加防翻译标记到父元素
                            if (textNode.parentElement) {
                                textNode.parentElement.setAttribute('translate', 'no');
                            }

                            logger.info(`文本替换成功: "${trimmedText}" -> "${result}"`);
                            replaced = true;
                            break; // 匹配成功，停止尝试其他映射
                        } else {
                            logger.debug(`文本未匹配: "${trimmedText}" 与模式 "${mapping.original}" 不匹配`);
                        }
                    }

                    if (!replaced) {
                        logger.debug(`文本节点未匹配任何映射: "${trimmedText}"`);
                    }
                });
            });
        } catch (error) {
            logger.error(`处理文本替换规则时出错: ${selector}`, error);
        }
    }

    /**
   * 执行属性替换
   * @param {Object} rule - 替换规则
   */
    function applyAttributeReplace(rule) {
        const { selector, mappings } = rule;
        logger.debug(`开始属性替换规则: ${selector}`);

        try {
            const containers = document.querySelectorAll(selector);
            logger.debug(`找到 ${containers.length} 个容器`);

            if (containers.length === 0) {
                logger.info(`未找到选择器: ${selector}`);
                return;
            }

            containers.forEach((container, containerIndex) => {
                logger.debug(`处理容器 ${containerIndex + 1}: ${container.tagName}.${container.className || ''}#${container.id || ''}`);
                logger.debug(`容器HTML:`, container.outerHTML);

                // 检查容器本身是否需要处理
                const elements = [container];

                // 收集容器内所有元素（限制深度）
                const walker = document.createTreeWalker(
                    container,
                    NodeFilter.SHOW_ELEMENT,
                    null,
                    false
                );

                let node;
                while ((node = walker.nextNode())) {
                    // 计算深度
                    let depth = 0;
                    let currentNode = node;
                    while (currentNode !== container && currentNode.parentElement) {
                        depth++;
                        currentNode = currentNode.parentElement;
                        if (currentNode === container) break;
                    }

                    if (depth <= CONFIG.maxDepth) {
                        elements.push(node);
                    }
                }

                logger.debug(`找到 ${elements.length} 个元素（包括容器本身）`);

                // 处理每个元素
                elements.forEach((element, elemIndex) => {
                    logger.debug(`处理元素 ${elemIndex + 1}: ${element.tagName}`);
                    logger.debug(`元素属性列表:`, Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`));

                    // 对每个元素尝试所有属性映射
                    for (const mapping of mappings) {
                        if (!isValidMapping(mapping, 'attribute')) {
                            logger.debug('属性映射无效，跳过');
                            continue;
                        }

                        const { attribute, original, translated } = mapping;

                        logger.debug(`检查属性: ${attribute}, 映射: "${original}" -> "${translated}"`);

                        const attributeValue = element.getAttribute(attribute);

                        if (attributeValue !== null) {
                            const trimmedValue = attributeValue.trim();
                            logger.debug(`属性 ${attribute} 值: "${trimmedValue}"`);

                            const result = wildcardReplace(trimmedValue, original, translated);

                            if (result !== null) {
                                element.setAttribute(attribute, result);
                                element.setAttribute('translate', 'no');
                                logger.info(`属性替换成功 [${attribute}]: "${trimmedValue}" -> "${result}"`);
                                logger.debug(`修改后元素属性:`, element.outerHTML);
                            } else {
                                logger.debug(`属性未匹配: "${trimmedValue}" 与模式 "${original}" 不匹配`);
                            }
                        } else {
                            logger.debug(`元素没有属性: ${attribute}`);
                        }
                    }
                });
            });
        } catch (error) {
            logger.error(`处理属性替换规则时出错: ${selector}`, error);
        }
    }

    /**
   * 执行所有替换规则
   */
    function executeAllReplacements() {
        logger.info('开始执行替换...');

        // 执行文本替换
        CONFIG.TextReplace.forEach(rule => {
            applyTextReplace(rule);
        });

        // 执行属性替换
        CONFIG.AttributeReplace.forEach(rule => {
            applyAttributeReplace(rule);
        });

        logger.info('替换完成');
    }

    // ========== 动态内容处理 ==========
    /**
   * 初始化MutationObserver
   */
    function initMutationObserver() {
        let observer;

        const throttledReplace = throttle(() => {
            logger.info('检测到DOM变化，重新执行替换');
            executeAllReplacements();
        }, CONFIG.throttleDelay);

        // 延迟启动Observer
        setTimeout(() => {
            observer = new MutationObserver(throttledReplace);

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: false,
                attributes: false
            });

            logger.info('MutationObserver已启动');
        }, CONFIG.observerDelay);

        return observer;
    }

    // ========== 脚本初始化 ==========
    /**
   * 初始化脚本
   */
    function init() {
        logger.info('脚本初始化中...');

        // 初始执行一次替换
        executeAllReplacements();

        // 初始化MutationObserver以处理动态内容
        initMutationObserver();

        logger.info('脚本初始化完成');
    }

    // 当DOM加载完成后初始化脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOMContentLoaded已经触发，直接初始化
        init();
    }
})();