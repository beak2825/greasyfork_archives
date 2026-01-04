// ==UserScript==
// @name         NHentai 汉化插件
// @namespace    https://github.com/Kochisa/NhSyringe
// @version      1.1
// @description  汉化 NHentai 网站内容
// @author       Kochisa
// @license      MIT
// @match        https://nhentai.net/*
// @match        https://*.nhentai.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551797/NHentai%20%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/551797/NHentai%20%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    const translations = {
        "Title": "标题",
        "Artists": "艺术家",
        "Tags": "标签",
        "tags": "标签",
        "Languages": "语言",
        "Pages": "页数",
        "Groups": "社团",
        "Categories": "分类",
        "Uploaded": "上传时间",
        "Parodies": "原作",
        "Random": "随机",
        "Characters": "角色",
        "Info": "信息",
        "Favorites": "收藏",
        "Favorite": "收藏",
        "Log out": "退出登录",
        "Unfavorite": "取消收藏",
        "Download": "下载",
        "Remove": "移除",
        "AI Jerk Off": "AI手冲",
        "Settings": "设置",
        "Blacklist": "黑名单",
        "Joined": "注册时间",
        "Username": "用户名",
        "Email": "邮箱",
        "Avatar": "头像",
        "avatar": "头像",
        "About": "关于",
        "Theme": "主题",
        "If you want to change your password, enter your old password and the new password.": "如需修改密码，请输入旧密码和新密码。",
        "Old Password": "旧密码",
        "New Password": "新密码",
        "Confirm": "确认",
        "Save": "保存",
        "Delete Account": "删除账号",
        "New Uploads": "最新上传",
        "Popular Now": "当前热门"
    };

    async function loadDict(url) {
        const res = await fetch(url);
        const text = await res.text();
        const lines = text.split('\n');
        const dict = {};
        for (const line of lines) {
            const match = line.match(/^\|\s*([^\|]+)\s*\|\s*([^\|]+)\s*\|/);
            if (match) {
                let name = match[2].trim().replace(/!\[.*?\]\(.*?\)/g, '').trim();
                dict[match[1].trim().toLowerCase()] = name;
            }
        }
        return dict;
    }

    async function translateTagField(field, urls) {
        let dict = {};
        for (const url of urls) {
            const d = await loadDict(url);
            dict = Object.assign(dict, d);
        }
        document.querySelectorAll('.tag-container').forEach(container => {
            if (container.textContent.includes(field)) {
                container.querySelectorAll('.tag .name').forEach(nameSpan => {
                    const eng = nameSpan.textContent.trim().toLowerCase();
                    if (dict[eng]) {
                        nameSpan.textContent = dict[eng];
                    }
                });
            }
        });
    }

    function translateTextNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            for (const [key, value] of Object.entries(translations)) {
                const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                text = text.replace(regex, value);
            }
            node.nodeValue = text;
        } else {
            node.childNodes.forEach(translateTextNode);
        }
    }
    function translateText() {
        translateTextNode(document.body);
    }

    function translateTimeUnitsNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            const timeMap = {
                "years": "年", "year": "年", "months": "个月", "month": "个月",
                "days": "天", "day": "天", "hours": "小时", "hour": "小时",
                "minutes": "分钟", "minute": "分钟", "seconds": "秒", "second": "秒", "ago": "前"
            };
            for (const [en, zh] of Object.entries(timeMap)) {
                const regex = new RegExp(`\\b${en}\\b`, 'g');
                text = text.replace(regex, zh);
            }
            node.nodeValue = text;
        } else {
            node.childNodes.forEach(translateTimeUnitsNode);
        }
    }

    const tagConfigs = [
        { field: '标签', urls: [
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/female.md',
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/male.md',
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/location.md',
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/mixed.md',
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/other.md',
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/rows.md'
        ]},
        { field: '社团', urls: [
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/group.md'
        ]},
        { field: '语言', urls: [
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/language.md'
        ]},
        { field: '原作', urls: [
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/parody.md'
        ]},
        { field: '分类', urls: [
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/reclass.md'
        ]},
        { field: '艺术家', urls: [
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/artist.md'
        ]},
        { field: '角色', urls: [
            'https://raw.githubusercontent.com/EhTagTranslation/Database/refs/heads/master/database/character.md'
        ]}
    ];

    async function runTranslate() {
        translateText();
        translateTimeUnitsNode(document.body);
        for (const cfg of tagConfigs) {
            await translateTagField(cfg.field, cfg.urls);
        }
    }

    window.addEventListener('load', runTranslate);

    const observer = new MutationObserver(() => {
        runTranslate();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
