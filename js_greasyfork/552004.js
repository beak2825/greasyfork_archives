// ==UserScript==
// @name       博客网站留言评论信息自动填充
// @namespace    https://www.tjsky.net
// @version      1.0.6
// @description  博客网站留言评论自动填写个人信息方法
// @author      去年夏天
// @namespace   https://greasyfork.org/zh-CN/users/39819
// @homepage    https://greasyfork.org/zh-CN/scripts/552004
// @include     http://*/*
// @include     https://*/*
// @exclude    *://*/wp-admin/*
// @exclude    *://*/admin/*
// @exclude    *://*.aliyun.com/*
// @exclude    *://myssl.com*
// @exclude    *://*.alipay.com/*
// @exclude    *://*.taobao.com/*
// @exclude    *://*.alimama.com/*
// @exclude    *://*.tmall.com/*
// @exclude    *://*.qq.com/*
// @exclude    *://*.tencent.com/*
// @exclude    *://*.qcloud.com/*
// @exclude    *://*.tenpay.com/*
// @exclude    *://*.baidu.com/*
// @exclude    *://*.bing.com/*
// @exclude    *://*.iqiyi.com/*
// @exclude    *://*.jd.com/*
// @exclude    *://*.meituan.com/*
// @exclude    *://*.cloudflare.com/*
// @exclude    *://*.yundun.com/*
// @exclude    *://github.com/*
// @exclude    *://weibo.com/*
// @exclude    *://*.sina.com.cn/*
// @exclude    *://*.youku.com/*
// @exclude    *://*.bilibili.com/*
// @exclude    *://*.acfun.cn/*
// @exclude    *://douban.com/*
// @exclude    *://*.jd.com/*
// @exclude    *://*.huya.com/*
// @exclude    *://*.douyin.com/*
// @exclude    *://*.douyu.com/*
// @exclude    *://*.sohu.com/*
// @exclude    *://*.letv.com/*
// @exclude    *://*.toutiao.com/*
// @exclude    *://*.ixigua.com/*
// @exclude    *://*.kafan.cn/*
// @exclude    *://*.163.com/*
// @exclude    *://*.126.com/*
// @exclude    *://*.hupu.com/*
// @exclude    *://*.qidian.com/*
// @exclude    *://*.mi.com/*
// @exclude    *://*.360.cn/*
// @exclude    *://*.icbc.com.cn/*
// @exclude    *://*.ccb.com/*
// @exclude    *://*.abchina.com/*
// @exclude    *://*.cmbchina.com/*
// @exclude    *://*.boc.cn/*
// @exclude    *://*.bankcomm.com/*
// @exclude    *://*.psbc.com/*
// @exclude    *://*.pingan.com/*
// @exclude    *://*.citicbank.com/*
// @exclude    *://*.cib.com.cn/*
// @exclude    *://*.spdb.com.cn/*
// @exclude    *://*.cebbank.com/*
// @exclude    *://*.cmbc.com.cn/*
// @exclude    *://*.cgbchina.com.cn/*
// @exclude    *://*.unionpay.com/*
// @exclude    *://*.chinalife.com.cn/*
// @exclude    *://*.citi.com/*
// @exclude    *://*.hsbc.com/*
// @exclude    *://*.sc.com/*
// @exclude    *://*.google.com/*
// @exclude    *://*.google.hk/*
// @exclude    *://*.google.cn/*
// @exclude    *://*.apple.com/*
// @exclude    *://*.youtube.com/*
// @exclude    *://*.facebook.com/*
// @exclude    *://twitter.com/*
// @exclude    *://*.qianxin.com/*
// @exclude    *://*.mail-tester.com/*
// @exclude    *://*.openai.com/*
// @exclude    *://*.godaddy.com/*
// @exclude    *://*.lowendtalk.com/*
// @exclude    *://*.racknerd.com/*
// @exclude    *://*.colocrossing.com/*
// @exclude    *://*.namecheap.com/*
// @exclude    *://*.namesilo.com/*
// @exclude    *://*.expireddomains.net/*
// @exclude    *://*.mailu.io/*
// @exclude    *://*.amazon.cn/*
// @exclude    *://*.amazon.com/*
// @exclude    *://*.qiniu.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @icon   data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/552004/%E5%8D%9A%E5%AE%A2%E7%BD%91%E7%AB%99%E7%95%99%E8%A8%80%E8%AF%84%E8%AE%BA%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/552004/%E5%8D%9A%E5%AE%A2%E7%BD%91%E7%AB%99%E7%95%99%E8%A8%80%E8%AF%84%E8%AE%BA%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置值
    const DEFAULT_CONFIG = {
        authorName: '请输入你的昵称',
        authorEmail: '请输入你的邮箱',
        authorUrl: '请输入你的网站（可留空）',
        autoFillEnabled: true,
        hotkey: 'Ctrl+Shift+F'
    };

    // 初始化配置
    function initConfig() {
        if (typeof GM_getValue === 'undefined') return;

        if (GM_getValue('authorName') === undefined) {
            GM_setValue('authorName', DEFAULT_CONFIG.authorName);
        }
        if (GM_getValue('authorEmail') === undefined) {
            GM_setValue('authorEmail', DEFAULT_CONFIG.authorEmail);
        }
        if (GM_getValue('authorUrl') === undefined) {
            GM_setValue('authorUrl', DEFAULT_CONFIG.authorUrl);
        }
        if (GM_getValue('autoFillEnabled') === undefined) {
            GM_setValue('autoFillEnabled', DEFAULT_CONFIG.autoFillEnabled);
        }
        if (GM_getValue('hotkey') === undefined) {
            GM_setValue('hotkey', DEFAULT_CONFIG.hotkey);
        }
    }

    // 注册菜单
    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand === 'undefined') return;

        GM_registerMenuCommand('设置昵称', () => {
            const currentName = GM_getValue('authorName', DEFAULT_CONFIG.authorName);
            const newName = prompt('请输入您的昵称：', currentName);
            if (newName !== null) {
                GM_setValue('authorName', newName);
                alert('昵称已更新！');
            }
        });

        GM_registerMenuCommand('设置邮箱', () => {
            const currentEmail = GM_getValue('authorEmail', DEFAULT_CONFIG.authorEmail);
            const newEmail = prompt('请输入您的邮箱：', currentEmail);
            if (newEmail !== null) {
                GM_setValue('authorEmail', newEmail);
                alert('邮箱已更新！');
            }
        });

        GM_registerMenuCommand('设置网址', () => {
            const currentUrl = GM_getValue('authorUrl', DEFAULT_CONFIG.authorUrl);
            const newUrl = prompt('请输入您的网址（可留空）：', currentUrl);
            if (newUrl !== null) {
                GM_setValue('authorUrl', newUrl);
                alert('网址已更新！');
            }
        });

        GM_registerMenuCommand('切换自动填充状态', () => {
            const currentStatus = GM_getValue('autoFillEnabled', DEFAULT_CONFIG.autoFillEnabled);
            const newStatus = !currentStatus;
            GM_setValue('autoFillEnabled', newStatus);
            alert(`自动填充功能已${newStatus ? '开启' : '关闭'}！`);
        });

        GM_registerMenuCommand('设置填充快捷键', () => {
            const currentHotkey = GM_getValue('hotkey', DEFAULT_CONFIG.hotkey);
            const newHotkey = prompt('请输入新的快捷键组合（例如：Ctrl+Shift+F）：', currentHotkey);
            if (newHotkey !== null && newHotkey.trim() !== '') {
                GM_setValue('hotkey', newHotkey);
                setupHotkeyListener();
                alert(`快捷键已更新为：${newHotkey}`);
            }
        });
    }

    // 快捷键监听
    function setupHotkeyListener() {
        if (window.dr_gm_hotkeyHandler) {
            document.removeEventListener('keydown', window.dr_gm_hotkeyHandler);
        }

        const hotkey = GM_getValue('hotkey', DEFAULT_CONFIG.hotkey);
        const keys = hotkey.split('+').map(k => k.trim().toLowerCase());

        window.dr_gm_hotkeyHandler = function(event) {
            const pressed = [];
            if (event.ctrlKey) pressed.push('ctrl');
            if (event.shiftKey) pressed.push('shift');
            if (event.altKey) pressed.push('alt');
            if (event.metaKey) pressed.push('meta');

            if (event.key.length === 1) {
                pressed.push(event.key.toLowerCase());
            } else if (event.key.startsWith('F') && event.key.length > 1) {
                pressed.push(event.key.toLowerCase());
            }

            // 检查是否匹配快捷键
            const match = keys.length === pressed.length &&
                          keys.every(k => pressed.includes(k));

            if (match) {
                event.preventDefault();
                manualFill();
            }
        };

        document.addEventListener('keydown', window.dr_gm_hotkeyHandler);
    }

    // 手动触发填充
    function manualFill() {
        const result = dr_js_autofill_commentinfos();
        if (!result) {
            alert('未找到可填充的评论表单！');
        }
    }

// 模糊匹配填充三要素
    function dr_js_autofill_commentinfos() {
        const authorName = GM_getValue('authorName', DEFAULT_CONFIG.authorName);
        const authorEmail = GM_getValue('authorEmail', DEFAULT_CONFIG.authorEmail);
        const authorUrl = GM_getValue('authorUrl', DEFAULT_CONFIG.authorUrl);

        // 匹配关键字定义
        const nameKeywords = ['nick', 'name', 'author', 'user', 'displayname', '昵称', '名字', '姓名', '称呼', '大名'];
        const emailKeywords = ['mail', 'email', 'e-mail', '邮箱', '邮件', '地址'];
        const urlKeywords = ['url', 'site', 'web', 'link', 'homepage', '网址', '主页', '网站', '链接'];

        // 获取输入框
        const allInputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="file"]):not([type="checkbox"]):not([type="radio"])');

        let filled = false;

        function checkInputMatch(input, keywords, specificType) {
            if (specificType && input.type === specificType) return 100;

            const strId = (input.id || '').toLowerCase();
            const strName = (input.name || '').toLowerCase();
            const strOther = ((input.placeholder || '') + ' ' + (input.className || '') + ' ' + (input.getAttribute('aria-label') || '')).toLowerCase();

            for (let kw of keywords) {
                if (strId === kw || strName === kw) return 90;
                if (strId.includes(kw) || strName.includes(kw)) return 60;
                if (strOther.includes(kw)) return 30;
            }
            return 0;
        }

        // 防止覆盖
        const processedInputs = new Set();

        allInputs.forEach(input => {
            if (input.disabled || input.readOnly) return;

            const isSearch = (input.id + input.name + input.className + input.placeholder).toLowerCase().includes('search');
            if (isSearch && input.type !== 'url' && input.type !== 'email') return;

            // 填充阈值，默认25
            const MATCH_THRESHOLD = 25;

            // 检查邮箱
            if (!processedInputs.has(input)) {
                let score = checkInputMatch(input, emailKeywords, 'email');
                if (score > MATCH_THRESHOLD) {
                    fillInput(input, authorEmail);
                    processedInputs.add(input);
                    filled = true;
                    return; // 处理下一个input
                }
            }

            // 检查网址
            if (!processedInputs.has(input)) {
                let score = checkInputMatch(input, urlKeywords, 'url');
                if (score > MATCH_THRESHOLD) {
                    fillInput(input, authorUrl);
                    processedInputs.add(input);
                    filled = true;
                    return;
                }
            }

            // 检查昵称
            if (!processedInputs.has(input)) {
                let score = checkInputMatch(input, nameKeywords, null);
                if (score > MATCH_THRESHOLD) {
                    fillInput(input, authorName);
                    processedInputs.add(input);
                    filled = true;
                }
            }
        });

        return filled;
    }

    // 填充触发
    function fillInput(el, value) {
        if (!el) return;
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // init
    function dr_init(){
        var filled = false;

        var obj = dr_get_type();
        const dr_gm_debug = false;

        if ( dr_gm_debug ) {
            console.log( 'GM脚本填充评论信息:', obj );
        }

        if( obj && obj.fill ){
            filled = dr_js_autofill_commentinfos();
        }
        console.log( 'GM脚本填充评论信息'+( filled?'成功':'失败' )+':', obj ? obj.type : '未知类型' );
    }

    // 判断评论程序类型函数
    function dr_get_type(){
        if( dr_is_wordpress() ){
            return { type: 'WordPress', fill: true };
        }else if( dr_is_typecho() ){
            return { type: 'Typecho', fill: true };
        }else if( dr_is_zblog() ){
            return { type: 'ZBlog', fill: true };
        }else if( dr_is_emlog() ){
            return { type: 'Emlog', fill: true };
        }else if( dr_is_twikoojs() ){
            return { type: 'TwikooJS', fill: true };
        }else if( dr_is_artalkjs() ){
            return { type: 'ArtalkJS', fill: true };
        }else if( dr_is_valinejs() ){
            return { type: 'ValineJS', fill: true };
        }else if( dr_is_walinejs() ){
            return { type: 'WalineJS', fill: true };
        }else{
            return { type: '未知', fill: false };
        }
    }

    // 检测评论程序函数
    function dr_is_wordpress(){
        return document.querySelector('#commentform') !== null ||
               document.querySelector('#wp-comment-list') !== null ||
               document.querySelector('input#comment_post_ID') !== null;
    }
    function dr_is_typecho(){
        return document.querySelector('form#comment-form') !== null ||
               document.querySelector('input[name=_]') !== null;
    }
    function dr_is_zblog() {
        return document.querySelector('form#frmSumbit') !== null ||
               document.querySelector('div.commentpost') !== null;
    }
    function dr_is_emlog() {
        return document.querySelector('form#commentform') !== null ||
               document.querySelector('input#comment') !== null;
    }
    function dr_is_twikoojs() {
        return document.querySelector('div.twikoo') !== null ||
               document.querySelector('div#twikoo') !== null;
    }
    function dr_is_artalkjs() {
        return document.querySelector('div#Artalk') !== null ||
               document.querySelector('div.artalk') !== null;
    }
    function dr_is_valinejs() {
        return document.querySelector('div#valine') !== null ||
               document.querySelector('div.v[data-class=v]') !== null;
    }
    function dr_is_walinejs() {
        return document.querySelector('div#waline') !== null ||
               document.querySelector('div.wl-comment') !== null;
    }

    // 初始化
    function init() {
        initConfig();
        registerMenuCommands();
        setupHotkeyListener();

        // 仅在自动填充开启时执行自动填充
        const autoFillEnabled = GM_getValue('autoFillEnabled', DEFAULT_CONFIG.autoFillEnabled);
        if (autoFillEnabled) {
            // 缺失必填项不执行脚本
            const authorName = GM_getValue('authorName', DEFAULT_CONFIG.authorName);
            const authorEmail = GM_getValue('authorEmail', DEFAULT_CONFIG.authorEmail);

            if (authorName === '' || authorEmail === '') {
                console.log('评论信息不完整，自动填充未执行');
                return;
            }

            if (window.top !== window.self) { return; }

            setTimeout(dr_init, 1500);
        }
    }

    init();
})();