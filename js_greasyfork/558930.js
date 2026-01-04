// ==UserScript==
// @name         Skool UI中文翻译
// @namespace    https://www.skool.com/
// @version      1.0.0
// @description  将Skool的UI控件翻译成中文 Translate Skool UI controls from English to Chinese (UI only)
// @match        https://*.skool.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558930/Skool%20UI%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/558930/Skool%20UI%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

/* =========================
   1. 翻译字典
   ========================= */

// 精确匹配
const EXACT_TRANSLATIONS = {
    "Members": "成员",
    "Classroom": "课堂",
    "Communities": "社区",
    "Community": "社区",
    "Calendar": "日历",
    "New Post": "发布帖子",
    "Map": "地图",
    "Leaderboards": "排行榜",
    "About": "关于",
    "Write something": "写点啥",
    "Edit": "编辑",
    "Delete": "删除",
    "Comment": "评论",
    "Copy link": "复制链接",
    "Search": "搜索",
    "Settings": "设置",
    "Profile": "个人资料",
    "Log out": "退出登录",
    "Save": "保存",
    "Cancel": "取消",
    "Reply": "回复",
    "Like": "点赞",
    "Comments": "评论",
    "Less...": "收起",
    "More...": "展开",
    "Default": "默认",
    "New": "最新",
    "Top": "热门",
    "Unread": "未读",
    "Last": "最后",
    "posting in": "发布于",
    "Write something...": "写点啥...",
    "Leaderboard (30-day)": "排行榜（30天）",
    "Invite People": "邀请他人",
    "See all leaderboards": "查看所有排行榜",
    "Post": "发布",
    "Select a category": "选择一个分区",
    "By": "发起人 ",
    "Admins": "管理",
    "Online": "在线",
    "All": "全部",
    "Mark as done": "标记为完成",
    "Today": "今天",
    "Mon": "星期一",
    "Tue": "星期二",
    "We": "星期三",
    "Thu": "星期四",
    "Fri": "星期五",
    "Sat": "星期六",
    "Sun": "星期天",
    "Affiliates": "邀请返佣",
    "Previous": "前页",
    "Next": "向后",
    "Copy links": "复制链接",
    "Report to admins": "向管理举报",
    "Online now": "现在在线",
    "Chats": "私聊",
    "Chat": "私聊",
    "follow": "关注",
    "Invite": "邀请",
    "Notifications": "通知",
    "Mark all as read": "全部已读",
    "Drop files here to upload": "将要上传的文件拖到这",
    "Your rank": "你的排行",
    "all-time": "所有时间",
    "liked your post": "点赞了你的帖子",
    "liked your comment": "点赞了你的评论",
    "mentioned you in reply": "提到了你",
    "Theme": "主题",
    "View": "查看",
    "Month": "当月",
    "Week": "当周",
    "Year": "当年",
    "All time": "全部",
    "You don't have access": "你没有权限",
    "days": "天",
    "day": "天",
    "Resources": "资料",
    "Bio": "签名"
};
const MONTH_TRANSLATIONS = {
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
};
// 模糊匹配
const FUZZY_TRANSLATIONS = {
    "posted": "发布于",
    "comments": "评论",
    "New comment": "新评论",
    "Last comment": "最后评论",
    "membership": "会籍",
    "members": "成员",
    "Admins": "管理",
    "Online": "在线",
    "Leaderboard": "排行榜",
    "Active ": "上次在线",
    "new post": "新发布"
};

/* =========================
   2. UI 安全过滤规则
   ========================= */

const BLOCKED_TAGS = new Set([
    "SCRIPT",
    "STYLE",
    "TEXTAREA",
    "CODE",
    "PRE"
]);

function isValidTextNode(node) {
    if (!node || !node.parentElement) return false;
    if (BLOCKED_TAGS.has(node.parentElement.tagName)) return false;

    const parent = node.parentElement;

    // 排除用户内容与编辑器区域
    if (
        parent.closest('[contenteditable="true"]') ||
        parent.closest('[data-lexical-editor]') ||
        parent.closest('.post-content') ||
        parent.closest('.comment-content')
    ) {
        return false;
    }

    return true;
}

/* =========================
   3. 翻译引擎 防重复
   ========================= */

const TRANSLATED_FLAG = "__skool_ui_translated__";


function translateTextNode(node) {
    if (!isValidTextNode(node)) return;
    if (node[TRANSLATED_FLAG]) return;

    const rawText = node.nodeValue;
    const text = rawText.trim();
    if (!text) return;

    /* ===== 月份 + 年份（优先处理）===== */
    for (const month in MONTH_TRANSLATIONS) {
        const reg = new RegExp(`^${month}\\s+(\\d{4})$`);
        const match = text.match(reg);
        if (match) {
            node.nodeValue = `${MONTH_TRANSLATIONS[month]} ${match[1]}`;
            node[TRANSLATED_FLAG] = true;
            return;
        }
    }

    /* ===== 精确匹配 ===== */
    if (EXACT_TRANSLATIONS[text]) {
        node.nodeValue = EXACT_TRANSLATIONS[text];
        node[TRANSLATED_FLAG] = true;
        return;
    }

    /* ===== 模糊匹配 ===== */
    for (const key in FUZZY_TRANSLATIONS) {
        if (text.toLowerCase().includes(key.toLowerCase())) {
            node.nodeValue = text.replace(
                new RegExp(key, "gi"),
                FUZZY_TRANSLATIONS[key]
            );
            node[TRANSLATED_FLAG] = true;
            return;
        }
    }
}
/* =========================
   4. DOM Scan
   ========================= */

function scanAndTranslate(root) {
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while ((node = walker.nextNode())) {
        translateTextNode(node);
    }
}

/* =========================
   5. MutationObserver
   ========================= */

const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                scanAndTranslate(node);
            }
        });
    }
});

/* =========================
   6. history hook
   ========================= */

(function hookHistory() {
    const originalPushState = history.pushState;

    history.pushState = function () {
        originalPushState.apply(this, arguments);
        setTimeout(() => scanAndTranslate(document.body), 300);
    };

    window.addEventListener("popstate", () => {
        setTimeout(() => scanAndTranslate(document.body), 300);
    });
})();

/* =========================
   7. 启动入口
   ========================= */

(function init() {
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener("load", () => {
        scanAndTranslate(document.body);
    });
})();
