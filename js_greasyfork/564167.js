// ==UserScript==
// @name         Backloggd 汉化脚本 (核弹版)
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Backloggd 汉化，强制解决 Turbo 跳转/SPA 页面切换失效问题。
// @author       Gemini & You
// @match        https://www.backloggd.com/*
// @match        https://backloggd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=backloggd.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564167/Backloggd%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC%20%28%E6%A0%B8%E5%BC%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564167/Backloggd%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC%20%28%E6%A0%B8%E5%BC%B9%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 字典配置
    // ==========================================
    const dict = {
        // --- 核心导航与状态 ---
        "Home": "首页",
        "Games": "游戏",
        "Journal": "日志",
        "Reviews": "评测",
        "Lists": "列表",
        "Community": "社区",
        "Search": "搜索游戏...",
        "Log In": "登录",
        "Sign Up": "注册",
        "Register": "注册",
        "Profile": "个人资料",
        "Settings": "设置",
        "Log Out": "退出",

        // --- 截图反馈修复项 ---
        "Released": "已发售", // 状态标签
        "Release Date": "发售日期", // 详情页字段
        "Updates": "更新",
        "Series": "系列",
        "Related Games": "相关游戏",
        "View All": "查看全部",
        "Awards": "奖项",
        "More info on IGDB": "查看 IGDB 更多信息",
        "Stats for all versions": "统计所有版本",

        // --- 统计与列表头部 ---
        "Game Title": "游戏标题",
        "Popularity": "热度",
        "Top Rated": "最高评分",
        "Avg. Play Time": "平均游玩时长",
        "Avg. Finish Time": "平均通关时长",
        "Time to Beat": "通关用时",
        "Date Added": "添加日期",
        "Name": "名称",
        "Filter": "筛选",
        "Sort by": "排序",

        // --- 核心状态 (Side Bar) ---
        "Playing": "在玩",
        "Backlog": "积压",
        "Wishlist": "愿望单",
        "Played": "已玩",
        "Completed": "已通关",
        "Mastered": "全成就",
        "Retired": "弃坑",
        "Shelved": "搁置",
        "Abandoned": "放弃",

        // --- 统计数据标签 ---
        "Plays": "游玩数",
        "Backlogs": "积压数",
        "Wishlists": "愿望单",
        "Ratings": "评分数",
        "Avg Rating": "平均分",

        // --- 游戏类型 (Genres) ---
        "Genres": "游戏类型",
        "Adventure": "冒险",
        "Strategy": "策略",
        "Action": "动作",
        "RPG": "角色扮演",
        "Shooter": "射击",
        "Puzzle": "解谜",
        "Platform": "平台跳跃",
        "Racing": "竞速",
        "Sport": "体育",
        "Fighting": "格斗",
        "Simulation": "模拟",
        "Indie": "独立游戏",
        "Visual Novel": "视觉小说",
        "Turn Based": "回合制",
        "Tactical": "战术",
        "Point-and-click": "点击解谜",
        "Music": "音乐",
        "Card & Board Game": "卡牌桌游",

        // --- 平台 (Platforms) ---
        "Platforms": "游戏平台",
        "Windows PC": "Windows PC", // 保持或汉化
        "Mac": "Mac",
        "Linux": "Linux",
        "PlayStation 4": "PS4",
        "PlayStation 5": "PS5",
        "Nintendo Switch": "Switch",
        "Xbox One": "Xbox One",
        "Xbox Series X|S": "Xbox Series X|S",

        // --- 版本与详情 ---
        "Deluxe Edition": "豪华版",
        "Digital Deluxe Edition": "数字豪华版",
        "Game of the Year Edition": "年度版",
        "Remastered": "重制版",
        "Remake": "重制版",
        "Episodes": "章节",
        "Editions": "版本",
        "More info on": "查看详情于",
        "Trending": "热门",
        "Latest": "最新",
        "Top Liked": "点赞最多",
        "All reviews for": "全部评测",
        "reviewed": "已测评",
        "Open review": "查看评测",
        "See More": "查看更多",
        "See Past Articles": "查看往期文章",
        "No recent notifications": "暂无最新通知",
        "Log a Game": "记录游戏",
        "": "",
        "": "",
        "": "",

        // --- 日历控件 ---
        "Jump to...": "跳转至...",
        "Today": "今天",
        "Start": "开始", // 可能是指跳到开始日期
        "Finish": "结束", // 可能是指跳到结束日期
        "January": "1月",
        "February": "2月",
        "March": "3月",
        "April": "4月",
        "May": "5月",
        "June": "6月",
        "July": "7月",
        "August": "8月",
        "September": "9月",
        "October": "10月",
        "November": "11月",
        "December": "12月",

        // --- 日志/编辑窗口 (Journal & Log) ---
        "Log Title": "记录标题",
        "Replay": "重玩",
        "Edition": "版本",
        "Specify an edition..": "指定版本...",
        "Played on": "游玩平台", // 区分于普通的 Platform
        "Ownership": "所有权",
        "owned, subscription, ...": "拥有、订阅...", // 占位符
        "Started on": "开始于",
        "Finished on": "完成于",
        "Time Played": "游玩时长",
        "Sync sessions": "同步会话",
        "Review": "评测",
        "Formatting": "格式说明",
        "What'd you think...": "你觉得这游戏怎么样...", // 评论框占位符
        "Contains spoilers": "包含剧透",
        "Delete this log": "删除此记录",
        "Use Quick Editor": "使用快速编辑器",
        "Create Log": "创建记录",
        "Time Tracker": "时间追踪",
        "Library": "库",

        // --- 平台字段修复 ---
        // 请检查原来的字典，建议将 "Platform" 改为 "平台"
        // 如果必须保留 "平台跳跃" 翻译，请检查是否应该对应 "Platformer"
        "Platform": "平台",

        // --- 时间追踪器 (Time Tracker Tab) ---
        "Total Playtime": "总游玩时长",
        "Manual input": "手动输入",
        "Enter total playtime manually": "手动输入总时长",
        "Sum log times": "累加记录时间",
        "Total playtime is the sum of all log playtimes": "总时长为所有记录时长之和",
        "Sum journal times": "累加日志时间",
        "Total playtime is the sum of all journal session playtimes": "总时长为所有日志会话时长之和",
        "Time to finish": "通关用时",
        "Time to master": "全成就用时",
        "AVG": "平均", // 表头里的 AVG

        // --- [新增] 个人主页统计与空状态 ---
        "Nothing here!": "暂无内容", // 用于 Bio 为空时
        "Personal Ratings": "个人评分",
        "Total Games Played": "历史游玩总数",
        "Games Backloggd": "积压游戏总数", // 这里的 Backloggd 是名词属性
        "Recently trending": "近期热门",

        // --- [修复] 侧边栏导航 (确保这些独立词汇能被命中) ---
        "Activity": "动态",
        "Friends": "好友",
        "Likes": "喜欢",
        "Bio": "简介",

        // --- 统计面板细节 ---
        "Avg Rating": "平均分",
        "Stats for all versions": "统计所有版本", // 截图右下角那个下拉菜单
        "Released": "已发售",  // 截图1日期左边的那个灰色小标

        // --- 时长统计 (截图3右下角粉色字) ---
        // 注意：这些词通常全是小写
        "average": "平均时长",
        "to finish": "主线通关",
        "to master": "全成就",

        // --- 游戏奖项 (Awards) ---
        "Game of the Year": "年度最佳游戏",
        "Narrative": "最佳叙事",
        "Art Direction": "最佳美术指导",
        "Soundtrack": "最佳配乐",
        "Music": "最佳音乐",
        "Indie Debut": "最佳独立首作", // 预防性补充
        "Multiplayer": "最佳多人",      // 预防性补充

        // --- 游戏奖项 (Awards) ---
        "Game of the Year": "年度最佳游戏",
        "Narrative": "最佳叙事",
        "Art Direction": "最佳美术指导",
        "Soundtrack": "最佳配乐",
        "Music": "最佳音乐",
        "Indie Debut": "最佳独立首作", // 预防性补充
        "Multiplayer": "最佳多人",      // 预防性补充

        // --- 截图中的 Tab 和标题 ---
        "Updates": "更新",
        "Series": "系列",
        "Related Games": "相关游戏",
        "View All": "查看全部",
        "Reviews": "评测",  // 注意：如果是"X Reviews"这种动态文本，需要正则支持

        // --- 个人主页 Dashboard ---
        "Welcome back": "欢迎回来",
        ", your collection awaits...": "，你的游戏库在等你...", // 注意开头的逗号
        "Profile Stats": "个人统计",
        "Game Ratings": "游戏评分分布", // 通常显示在柱状图上方
        "Quick Log": "快速记录",

        "expand": "展开",
        "collapse": "收起",
        "Latest news": "最新动态",
        "Popular lists": "热门列表",
        "Sleeper hits": "冷门佳作", // 或者是 "宝藏游戏"，指那些被低估的好游戏
        "Recently anticipated": "近期最受期待",
        "Coming soon": "即将推出",

        "About": "关于",
        "Contact": "联系",
        "Backers": "赞助者", // 指 Patreon 等支持者
        "Roadmap": "路线图", // 指开发计划
        "Terms": "条款",
        "Privacy": "隐私",
        "Powered by": "数据支持", // 上下文通常是 Powered by IGDB

};

    const regexPatterns = [
        { reg: /^([\d\.]+[K|M]?)\s+Likes$/i, repl: "$1 喜欢" },
        { reg: /^([\d\.]+[K|M]?)\s+Reviews$/i, repl: "$1 评测" },
        { reg: /^All reviews for\s+(.+)$/i, repl: "$1 的全部评测" },
        { reg: /^Reviewed on (.+)$/, repl: "评测于 $1" },
        { reg: /^([\d\.]+)h\s+average$/i, repl: "$1小时 平均" },
        { reg: /^([\d\.]+)h\s+to finish$/i, repl: "$1小时 通关" },
        { reg: /^([\d\.]+)h\s+to master$/i, repl: "$1小时 全成就" },
        {
            reg: /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})$/i,
            repl: (match, mon, day, year) => {
                const monthMap = {
                    "Jan": "1月", "Feb": "2月", "Mar": "3月", "Apr": "4月", "May": "5月", "Jun": "6月",
                    "Jul": "7月", "Aug": "8月", "Sep": "9月", "Oct": "10月", "Nov": "11月", "Dec": "12月"
                };
                return `${year}年 ${monthMap[mon]} ${day}日`;
            }
        },
        { reg: /^Nintendo Switch$/, repl: "Switch" },
        { reg: /^PlayStation 5$/, repl: "PS5" },
        { reg: /^Windows PC$/, repl: "PC" }
    ];

    // ==========================================
    // 翻译逻辑核心
    // ==========================================
    function translateText(text) {
        if (!text) return null;
        const cleanText = text.trim();
        if (!cleanText) return null;

        if (dict[cleanText]) return dict[cleanText];

        for (let pattern of regexPatterns) {
            if (pattern.reg.test(cleanText)) {
                return cleanText.replace(pattern.reg, pattern.repl);
            }
        }

        if (/(\s•\s|,\s|\s\.\s)/.test(cleanText)) {
            let separator = "";
            if (cleanText.includes(" • ")) separator = " • ";
            else if (cleanText.includes(", ")) separator = ", ";
            else if (cleanText.includes(" . ")) separator = " . ";

            const parts = cleanText.split(separator);
            let hasTranslation = false;

            const translatedParts = parts.map(part => {
                const pTrim = part.trim();
                let trans = dict[pTrim];
                if (!trans) {
                     for (let pattern of regexPatterns) {
                        if (pattern.reg.test(pTrim)) {
                            trans = pTrim.replace(pattern.reg, pattern.repl);
                            break;
                        }
                    }
                }
                if (trans) hasTranslation = true;
                return trans || part;
            });

            if (hasTranslation) return translatedParts.join(separator);
        }
        return null;
    }

    function traverseAndTranslate(node) {
        if (!node) return;

        if (node.nodeType === 3) { // Text Node
            const val = node.nodeValue;
            if (val && /\S/.test(val)) {
                const translated = translateText(val);
                if (translated) node.nodeValue = node.nodeValue.replace(val.trim(), translated);
            }
        } else if (node.nodeType === 1) { // Element Node
            // 忽略这些标签，提高性能
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'svg', 'path'].includes(node.tagName)) return;

            if (node.title) {
               const t = translateText(node.title);
               if(t) node.title = t;
            }
            if (node.placeholder) {
               const p = translateText(node.placeholder);
               if(p) node.placeholder = p;
            }

            // 遍历子节点
            let child = node.firstChild;
            while (child) {
                traverseAndTranslate(child);
                child = child.nextSibling;
            }
        }
    }

    // ==========================================
    // 核弹级执行逻辑 (Nuclear Option)
    // ==========================================

    function runTranslation() {
        if(document.body) {
            traverseAndTranslate(document.body);
        }
    }

    // 1. 劫持 History API (应对 Turbo 跳转)
    // ----------------------------------------
    const wrapHistory = (type) => {
        const orig = history[type];
        return function() {
            const rv = orig.apply(this, arguments);
            // URL 变了，延迟一丢丢执行汉化
            setTimeout(runTranslation, 100);
            setTimeout(runTranslation, 500); // 双重保险
            return rv;
        };
    };
    history.pushState = wrapHistory('pushState');
    history.replaceState = wrapHistory('replaceState');
    window.addEventListener('popstate', () => {
        setTimeout(runTranslation, 100);
    });

    // 2. 挂载到 HTML 根节点 (应对 Body 被替换)
    // ----------------------------------------
    const observer = new MutationObserver((mutations) => {
        // 简单防抖，避免卡顿
        runTranslation();
    });

    // 监听 documentElement 而不是 body，因为 html 标签不会被替换
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 3. 心跳检测 (保底机制)
    // ----------------------------------------
    // 每 800ms 检查一次，如果导航栏变回英文，强制汉化
    // 这是为了解决 MutationObserver 有时在复杂 SPA 渲染中“漏球”的问题
    setInterval(() => {
        const navGames = document.querySelector('nav a[href="/games"]');
        if (navGames && navGames.innerText.trim() === "Games") {
            //console.log("检测到未汉化内容，强制执行...");
            runTranslation();
        }
    }, 800);

    // 4. 初次启动
    // ----------------------------------------
    window.addEventListener('load', runTranslation);
    document.addEventListener('DOMContentLoaded', runTranslation);
    // 针对 Turbo 的特有事件
    window.addEventListener('turbo:load', runTranslation);
    window.addEventListener('turbo:render', runTranslation);

})();