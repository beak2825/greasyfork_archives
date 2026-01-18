// ==UserScript==
// @name         Telegram Web A 汉化
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  解决动态加载不跟随问题。采用 TreeWalker 高效遍历与多维度监听，确保翻译实时生效。
// @author       Gemini Helper
// @match        https://web.telegram.org/a/*
// @match        https://web.telegram.org/k/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563013/Telegram%20Web%20A%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563013/Telegram%20Web%20A%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 扩展字典（包含正则和静态词汇）
    const i18n = {
        static: {


            // --- 手动添加的部分 ---
            "Today": "今天",
            "More": "更多",
            "Add Account": "添加账户",
            "My Profile": "我的个人资料",
            "Message Font Size": "消息字体大小",
            "Chat Wallpaper": "聊天壁纸",
            "General Settings": "通用设置",
            "Theme": "主题",
            "Light": "日间模式",
            "Dark": "夜间模式",
            "System": "跟随系统",
            "Time format": "时间格式",
            "12-hour": "12 小时制",
            "24-hour": "24 小时制",
            "Keyboard": "键盘",
            "Send with Enter": "使用 Enter 键发送",
            "Press Shift + Enter for new line": "按 Shift + Enter 换行",
            "Send with Ctrl+Enter": "使用 Ctrl + Enter 发送",
            "Press Enter for new line": "按 Enter 键换行",
            "Animations and Performance": "动画与性能",
            "Animation Level": "动画等级",
            "Choose the desired animations amount.": "选择所需的动画数量。",
            "Power Saving": "省电模式",
            "Nice and Fast": "流畅快速",
            "Lots of Stuff": "丰富效果",
            "Resource-Intensive Processes": "资源密集型进程",
            "Interface Animations": "界面动画",
            "Media Autoplay": "媒体自动播放",
            "Show Translate Button": "显示翻译按钮",
            "Translate Entire Chats": "翻译整个聊天",
            "The 'Translate' button will appear in the context menu of messages containing text.": "“翻译”按钮将出现在包含文本的消息上下文菜单中。",
            "Interface Language": "界面语言",
            "Telegram Premium": "Telegram 会员",
            "My Stars": "我的星币",
            "Telegram Stars": "Telegram 星币",
            "Balance": "余额",
            "Buy Stars to unlock content and services in mini apps on Telegram.": "购买星币以解锁 Telegram 小程序中的内容和服务。",
            "Buy More Stars": "购买更多星币",
            "Gift Stars to Friends": "赠送星币给好友",
            "My TON": "我的 TON",
            "Send a Gift": "赠送礼物",
            "Ask a Question": "提问",
            "Telegram FAQ": "Telegram 常见问题",
            "Privacy Policy": "隐私政策",
            "Phone": "手机号码",
            "Auto-download photos": "自动下载照片",
            "Other Private Chats": "其他私聊",
            "Group Chats": "群组聊天",
            "Channels": "频道",
            "Auto-download videos and GIFs": "自动下载视频和 GIF",
            "Auto-download files": "自动下载文件",
            "Maximum file size": "最大文件限制",
            "Clear Media Cache": "清理媒体缓存",
            "Deletes locally cached media for this account": "删除此账号在本地缓存的媒体文件",
            "Boost Group": "提升群组等级",
            "View Channel": "查看频道",
            "Select messages": "选择消息",
            "Leave Group": "退出群组",
            "Copy Text": "复制文本",
            "Copy Message Link": "复制消息链接",
            "Download": "下载",
            "Add to Favorites": "添加到收藏夹",
            "Photo or Video": "照片或视频",
            "File": "文件",
            "Poll": "投票",
            "Checklist": "清单",
            "Send Photo": "发送照片",
            "Move Caption Up": "标题移至上方",
            "Send as Files": "以文件形式发送",
            "Send In High Quality": "以高质量发送",
            "Enable Spoiler": "启用剧透遮盖",
            "Send File": "发送文件",
            "Add a caption...": "添加说明...",
            "Send as Media": "以媒体形式发送",
            "New Poll": "新建投票",
            "Create": "创建",
            "Poll options": "投票选项",
            "Add an Option": "添加选项",
            "Anonymous Voting": "匿名投票",
            "Multiple Answers": "多项选择",
            "Quiz Mode": "测验模式",


            // --- 侧边栏与主菜单 ---
            "Search": "搜索",
            "Saved Messages": "收藏夹",
            "Archived Chats": "已归档会话",
            "Contacts": "联系人",
            "Settings": "设置",
            "Night Mode": "夜间模式",
            "Animations": "动画效果",
            "Telegram Features": "Telegram 特性",
            "Report": "举报",
            "Switch to K Version": "切换至 K 版本",
            "Switch to Old Version": "切换至旧版本",
            "Install App": "安装应用",
            "Log Out": "退出登录",

            // --- 设置界面通用 ---
            "Edit Profile": "编辑个人资料",
            "Chat Settings": "聊天设置",
            "Notifications and Sounds": "通知与声音",
            "Privacy and Security": "隐私与安全",
            "Data and Storage": "数据与存储",
            "Chat Folders": "聊天文件夹",
            "Devices": "设备",
            "Language": "语言",
            "General": "通用",
            "Stickers and Emoji": "表情符号与贴纸",

            // --- 个人资料编辑 ---
            "First name (required)": "名字 (必填)",
            "Last name (optional)": "姓氏 (可选)",
            "Bio": "个人简介",
            "Username": "用户名",
            "Phone Number": "手机号码",
            "Set Profile Photo": "设置个人头像",

            // --- 聊天列表与操作 ---
            "New Group": "新建群组",
            "New Channel": "新建频道",
            "Mute": "静音",
            "Unmute": "取消静音",
            "Mark as read": "标记为已读",
            "Mark as unread": "标记为未读",
            "Pin": "置顶",
            "Unpin": "取消置顶",
            "Delete": "删除",
            "Delete Chat": "删除对话",
            "Clear History": "清除历史记录",
            "Archive": "归档",
            "Unarchive": "取消归档",

            // --- 聊天对话框内 ---
            "Message": "输入消息...",
            "Reply": "回复",
            "Edit": "编辑",
            "Copy": "复制",
            "Copy Link": "复制链接",
            "Forward": "转发",
            "Select": "选择",
            "Pin Message": "置顶消息",
            "Unpin Message": "取消置顶消息",
            "Report Message": "举报消息",
            "View Profile": "查看个人资料",
            "Add to Contacts": "添加到联系人",
            "Block User": "屏蔽用户",
            "Shared Media": "共享媒体",
            "Members": "成员",
            "Subscribers": "订阅者",

            // --- 状态与提示 ---
            //"online": "在线",
            "last seen recently": "最近上线",
            "last seen within a month": "一月内上线",
            "last seen within a week": "一周内上线",
            "last seen long ago": "很久以前上线",
            "typing...": "正在输入...",
            "recording voice message...": "正在录制语音...",
            "uploading...": "正在上传...",
            "Connecting...": "连接中...",
            "Updating...": "更新中...",
            "Waiting for network...": "等待网络...",

            // --- 媒体分类 ---
            "Media": "媒体",
            "Files": "文件",
            "Links": "链接",
            "Music": "音乐",
            "Voice": "语音",
            "GIFs": "GIF 动图",
            "Groups in Common": "共同群组",

            // --- 隐私与安全详情 ---
            "Two-Step Verification": "两步验证",
            "Passcode Lock": "锁定代码",
            "Blocked Users": "已屏蔽用户",
            "Active Sessions": "活跃会话",
            "Who can see my phone number?": "谁可以看到我的手机号？",
            "Who can see my last seen time?": "谁可以看到我的最后上线时间？",
            "Who can see my profile photos?": "谁可以看到我的头像？",
            "Who can add a link to my account when forwarding my messages?": "谁可以在转发我的消息时添加账号链接？",
            "Who can add me to group chats?": "谁可以把我加入群组？",
            "Everybody": "所有人",
            "My Contacts": "我的联系人",
            "Nobody": "没有人",

            // --- 数据与存储详情 ---
            "Storage Usage": "存储使用情况",
            "Data Usage": "数据使用情况",
            "Keep Media": "保留媒体",
            "Clear Cache": "清理缓存",
            "Automatic Media Download": "媒体自动下载",
            "When using mobile data": "使用移动数据时",
            "When connected on Wi-Fi": "连接 Wi-Fi 时",
            "When roaming": "漫游时",

            // --- 通用设置 ---
            "Message Text Size": "消息文字大小",
            "Color Theme": "配色主题",
            "Chat Background": "聊天背景",
            "Auto-Night Mode": "自动夜间模式",
            "Time Format": "时间格式",
            "Distance Units": "距离单位",

            // --- 按钮与交互 ---
            "Cancel": "取消",
            "Done": "完成",
            "Save": "保存",
            "Next": "下一步",
            "Back": "返回",
            "Close": "关闭",
            "Apply": "应用",
            "Discard": "放弃",
            "OK": "确定",
            "Send": "发送",
            "Add": "添加",
            "Invite": "邀请",
            "Leave": "离开",
            "Join": "加入",

            "Chats": "聊天",
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
            "Notifications": "通知",
            "Group Info": "群组信息",
            "Channel Info": "频道信息",
            "Boost Channel": "提升频道等级",
            "View Discussion": "查看讨论",
            "Leave Channel": "退出频道",
            "Copy Image": "复制图片",
            "Unread Messages": "未读消息",
            "Block Bot": "屏蔽机器人",
            "New Message": "新消息",
            "Search contacts": "搜索联系人",
            "Add Members": "添加成员",
            "Who would you like to add?": "你想添加谁？",
            "Forward to...": "转发给...",
            "AM": "上午",
            "PM": "下午",
            "Monday": "星期一",
            "Tuesday": "星期二",
            "Wednesday": "星期三",
            "Thursday": "星期四",
            "Friday": "星期五",
            "Saturday": "星期六",
            "Sunday": "星期日",
            "Yesterday": "昨天",
            "Mon": "周一",
            "Tue": "周二",
            "Wed": "周三",
            "Thu": "周四",
            "Fri": "周五",
            "Sat": "周六",
            "Sun": "周日",
            "Jump to Date": "跳转到日期"
        },
        regex: [
            //这里是正则位置

            // 1. 处理格式: Month Day, Year (如: December 9, 2024 -> 2024年12月9日)
            {
                p: /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})$/,
                r: (match, p1, p2, p3) => {
                    const months = {"January":"1月","February":"2月","March":"3月","April":"4月","May":"5月","June":"6月","July":"7月","August":"8月","September":"9月","October":"10月","November":"11月","December":"12月"};
                    return `${p3}年${months[p1]}${p2}日`;
                }
            },

            // 2. 处理格式: Month Day (如: January 1 -> 1月1日)
            // 适用于今年内的日期显示
            {
                p: /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})$/,
                r: (match, p1, p2) => {
                    const months = {"January":"1月","February":"2月","March":"3月","April":"4月","May":"5月","June":"6月","July":"7月","August":"8月","September":"9月","October":"10月","November":"11月","December":"12月"};
                    return `${months[p1]}${p2}日`;
                }
            },

            // 3. 原有的其他正则规则
            { p: /^([\d,]+) members$/, r: '$1 位成员' },
            { p: /^([\d,]+) subscribers$/, r: '$1 位订阅者' },
            { p: /^Last seen (.+)$/, r: '上次上线于 $1' }

        ]
    };

    // 2. 翻译引擎核心
    function translate(text) {
        if (!text) return null;
        let clean = text.trim();
        if (clean.length < 2) return null;

        // 优先静态匹配
        if (i18n.static[clean]) return i18n.static[clean];

        // 正则匹配
        for (let rule of i18n.regex) {
            if (rule.p.test(clean)) return clean.replace(rule.p, rule.r);
        }
        return null;
    }

    // 3. 高效 TreeWalker 扫描器
    function walkAndTranslate(root) {
        // 使用浏览器原生的 TreeWalker 寻找所有文本节点
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.nodeType === 3) { // 文本节点
                const res = translate(node.nodeValue);
                if (res && node.nodeValue !== res) {
                    node.nodeValue = res;
                }
            } else if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                const ph = node.getAttribute('placeholder');
                if (ph) {
                    const res = translate(ph);
                    if (res) node.setAttribute('placeholder', res);
                }
            }
        }
    }

    // 4. 多维度监听器
    const observer = new MutationObserver((mutations) => {
        // 性能优化：使用 requestAnimationFrame 在浏览器空闲帧执行
        window.requestAnimationFrame(() => {
            for (let m of mutations) {
                if (m.type === 'childList') {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === 1) walkAndTranslate(node);
                    });
                } else if (m.type === 'characterData') {
                    // 处理直接修改文字的情况
                    const res = translate(m.target.nodeValue);
                    if (res && m.target.nodeValue !== res) {
                        m.target.nodeValue = res;
                    }
                }
            }
        });
    });

    // 5. 启动与持续纠错机制
    function start() {
        console.log("【汉化 v4.0】引擎启动...");

        // 首次全量扫描
        walkAndTranslate(document.body);

        // 开启深度监听
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true // 关键：监听文字内容本身的改变
        });

        // 每秒一次的“轻量巡逻”，防止某些极端情况下的 UI 闪烁回英文
        setInterval(() => {
            // 重点检查当前可见区域
            walkAndTranslate(document.body);
        }, 1500);
    }

    // 确保在 DOM 加载后运行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        setTimeout(start, 1000); // 稍微延迟以规避某些框架的初始渲染
    }

})();