// ==UserScript==
// @name         NexusMods 汉化
// @name:en        ChineseNexusmods
// @namespace    https://github.com/fbstorm/ChineseNexusmods
// @version      0.0.1-2025-09-14
// @description  将 NexusMods 网站的静态UI元素（如导航、按钮、标签页等）翻译为中文，同时忽略用户生成内容（UGC），如Mod描述、评论、帖子等。
// @description:en Translates static UI elements (like navigation, buttons, tabs) on NexusMods to Chinese, while ignoring User-Generated Content (UGC) like mod descriptions, comments, and posts.
// @author       Gemini and Fantastormb(Operator)
// @match        https://*.nexusmods.com/*
// @match        https://www.nexusmods.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549485/NexusMods%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/549485/NexusMods%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 翻译词典 (可根据需要自行扩充)
    // 键: 英文原文 (区分大小写)
    // 值: 中文译文
    const translations = {
        // 顶部导航和通用
        'Games': '游戏',
        'Mods': '模组',
        "Collections":"合集",
        "Media":"媒体文件",
        "Members":"注册用户",
        "Creator rewards":"创作者收益",
        "Network stats":"网站探针",
        "View more":"查看更多",
        "View all":"查看所有",
        "Add some games to get started":"添加些游戏以开始",
        "Add games":"添加游戏",
        "My games":"我的游戏",
        "Latest news":"最新消息",
        "My content":"我的内容",
        "Download history":"下载记录",
        "Tracking centre":"追踪中心",
        "Upload":"上传",
        'Community': '社区',
        'Support': '支持',
        'Log in': '登录',
        'Register': '注册',
        'Search': '搜索',
        'UPLOAD A MOD': '上传模组',
        'Donate': '捐赠',
        'Give Premium': '赠送会员',
        'Logout': '登出',
        'VIEW PROFILE': '查看个人资料',
        'SETTINGS': '设置',
        'ABOUT US': '关于我们',
        'CONTACT US': '联系我们',
        'CAREERS': '招贤纳士',
        'Home': '首页',
        "My profile":"个人资料",
        "My mods":"我的mod",
        "My collections":"我的合集",
        "My media":"我的媒体文件",
        "My wallet":"我的钱包",
        "Give feedback":"反馈",
        "Account settings":"账户设置",
        "Site preferences":"网站设置",
        "Sign out":"登出",
        "All games":"所有游戏",
        "Recently added":"最近添加",
        "All mods":"所有模组",
        "Most endorsed":"最多赞同",
        "Tracked mods":"已追踪模组",
        "New":"最新",
        "Trending":"热门趋势",
        "My stuff":"我的内容",
        "My mods":"我的模组",
        "Mod rewards":"模组奖励",
        "Upload mod":"上传模组",
        "All collections":"所有合集",
        "Recently added":"最近添加",
        "Most endorsed":"最多赞同",
        "Highest rated":"评分最高",
        "Latest":"最新发布",
        "My images":"我的图片",
        "Upload image":"上传图片",
        "My videos":"我的视频",
        "Upload video":"上传视频",
        "Support authors":"支持作者",
        "News":"消息",
        "All news":"所有消息",
        "Site news":"网站消息",
        "Competitions":"比赛",
        "Interviews":"访谈",
        "Go Premium":"升级高级会员",
        "Search mods,games,,collections,,images & videos":"搜索模组、游戏、合集、图片和视频",
        "All content":"所有内容",
        "Recent Searches":"最近搜索",
        "Popular games":"热门游戏",
        "Select":"选择",
        "Move":"移动",
        "Customise your search preferences":"自定义您的搜索偏好",
        "Close":"关闭",
        "Clear all":"全部清除",
        "Users":"用户",
        "All Games":"所有游戏",
        "Member":"注册用户",
        "Go premium":"升级会员",
        "Mod updates":"更新的mod",
        "Games that you favourite will be displayed here":"你喜好的游戏会显示在这里",
        "Kudos":"点赞",
        "Support Nexus Mods":"赞助NexuMods",
        "Customise your search preferences":"自定义您的搜索偏好",
        "Updates":"更新",
        "Popular":"流行",
        "Surprise":"惊人的",
        "All time":"所有时间内",
        "24 Hours":"24小时内",
        "7 Days":"7天内",
        "14 Days":"14天内",
        "28 Days":"28天内",
        "1 Year":"1年内",

        //游戏搜索页面
        "Hide filters":"隐藏筛选",
        "Game":"游戏",
        "Apply":"应用",
        "Search game":"搜索游戏",
        "Game genre":"游戏类型",
        "Game genre search":"搜索游戏类型",
        "Vortex Support":"Vortex 支持",
        "Show games with Collections":"显示包含合集的游戏",
        "Supported by Vortex":"由 Vortex 支持",
        "Action":"动作",
        "Adventure":"冒险",
        "ARPG":"动作角色扮演",
        "Dungeon crawl":"地牢探索",
        "Fighting":"格斗",
        "FPS":"第一人称射击",
        "Hack and Slash":"砍杀",
        "Horror":"恐怖",
        "Indie":"独立",
        "Metroidvania":"类银河战士恶魔城",
        "MMORPG":"大型多人在线角色扮演",
        "Music ":"音乐 ",
        "Platformer":"平台跳跃",
        "Puzzle":"解谜",
        "Racing":"竞速",
        "Roguelike":"类 Rogue",
        "RPG":"角色扮演",
        "Sandbox":"沙盒",
        "Simulation":"模拟",
        "Space sim":"太空模拟",
        "Sports":"体育",
        "Stealth":"潜行",
        "Strategy":"策略",
        "Survival ":"生存 ",
        "Third-Person Shooter":"第三人称射击",
        "Visual Novel":"视觉小说",
        "Download count":"下载量",
        "Mods count":"模组数",
        "Collections count":"合集数",
        "Name":"名称",
        "20 Items":"20 项",
        "40 Items":"40 项",
        "60 Items":"60 项",
        "80 Items":"80 项",
        "Get more with Premium":"升级高级会员以获取更多",
        "View more results for mods,collections and media everywhere.":"在任何地方查看更多关于模组、合集和媒体的结果。",
        "Page":"页码",
        "Go":"跳转",

        // Mod 页面标签页
        'Description': '描述',
        'Files': '文件',
        'Images': '图片',
        'Videos': '视频',
        'Posts': '帖子',
        'Forums': '论坛',
        'Bugs': 'Bug报告',
        'Logs': '日志',
        'Stats': '统计',
        'Articles': '文章',
        "Unique DLs":"不同的下载量",
        "Total DLs":"总下载量",
        "Add media":"添加媒体文件",
        "Download:":"下载：",
        "Add images":"添加图片",
        "Link a new video":"链接一个新视频",
        "Tags for this mod":"这个mod的标签",
        "Tag this mod":"为这个mod打标签",
        "Original upload":"初始上传",
        "Vote":"投票",

        // Mod 页面按钮和信息
        'Track': '追踪',
        'Endorse': '赞赏',
        'Donate': '捐赠',
        'Download': '下载',
        'Vortex': 'Vortex',
        'Manual': '手动下载',
        'Preview file contents': '预览文件内容',
        'Last updated': '最后更新',
        'Original author': '原作者',
        'Unique downloads': '独立下载',
        'Total downloads': '总下载',
        'Total views': '总浏览',
        'Version': '版本',
        'Endorsements': '赞赏数',
        'Created by': '创建者',
        'Uploaded by': '上传者',
        'Added on': '添加于',
        "About this mod":"",
        "Permissions and credits":"",
        "Share":"",
        "Report Abuse":"",
        "You haven't downloaded this mod yet":"",
        "":"",

        // 文件页面
        'Main files': '主文件',
        'Optional files': '可选文件',
        'Old files': '旧版本文件',
        'Miscellaneous': '杂项',
        'File name': '文件名',
        'Uploader': '上传者',
        'Size': '大小',
        'Downloads': '下载',
        'Date added': '添加日期',
        'Mirrors': '镜像',

        // 其它
        'Filters': '筛选',
        'all time': '总计',
        'Sort by': '排序方式',
        'Endorsed': '已赞赏',
        'premium': '会员',
        'supporter': '支持者',
        'Moderator': '管理员',
        'Author': '作者',
        'More': '更多',
        'Less': '收起',
        'Requirements': '前置需求',
        'Mods requiring this file': '需要此文件的模组',
    };

    // UGC (用户生成内容) 区域的 CSS 选择器
    // 脚本将不会翻译这些区域内的任何文本
    const ugcSelectors = [
        '#description',         // Mod 描述主体
        '.comment',             // 评论区
        '#posts-container',     // Posts 区域
        '#forum-posts',         // 论坛区域
        '.file-description',    // 文件描述
        '#bug-reports',         // Bug 报告区
        'article',              // 文章内容
        '.ProseMirror',         // 富文本编辑器
        '.users-endorsed',      // 点赞用户列表
        '.post-content',        // 帖子内容
        '.users-donated'        // 捐赠用户列表
    ];

    /**
     * 检查一个元素或其父元素是否是UGC内容
     * @param {Node} element
     * @returns {boolean}
     */
    function isInsideUGC(element) {
        // .closest 会检查当前元素及其所有父元素
        return ugcSelectors.some(selector => element.closest(selector));
    }

    /**
     * 翻译指定节点内的静态文本
     * @param {Node} node
     */
    function translateNode(node) {
        // 使用 TreeWalker 高效遍历所有文本节点
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        const nodesToProcess = [];

        // 先收集所有需要处理的文本节点
        while (walker.nextNode()) {
            const currentNode = walker.currentNode;
            // 排除脚本、样式和UGC区域的文本
            const parent = currentNode.parentElement;
            if (parent && parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE' && !isInsideUGC(parent)) {
                 nodesToProcess.push(currentNode);
            }
        }
        
        // 统一进行替换，避免在遍历时修改DOM
        nodesToProcess.forEach(textNode => {
            const originalText = textNode.nodeValue.trim();
            if (translations[originalText]) {
                 // 使用 replace 来保留原始文本周围的空白字符
                 textNode.nodeValue = textNode.nodeValue.replace(originalText, translations[originalText]);
            }
        });
    }

    /**
     * 使用 MutationObserver 监视动态加载的内容
     */
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(newNode => {
                    // 只处理元素节点，因为文本节点的变化由其父元素捕获
                    if (newNode.nodeType === Node.ELEMENT_NODE) {
                        translateNode(newNode);
                    }
                });
            }
        }
    });

    // 等待 DOM 加载后开始首次翻译和监控
    document.addEventListener('DOMContentLoaded', () => {
        // 初始翻译
        translateNode(document.body);

        // 开始监控
        observer.observe(document.body, {
            childList: true, // 监控子节点的添加或删除
            subtree: true    // 监控所有后代节点
        });
    }, { once: true });

})();