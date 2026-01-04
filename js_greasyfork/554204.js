// ==UserScript==
// @name         V2EX 关键词屏蔽器（标题│正文│评论）
// @namespace    https://github.com/yourname
// @version      1.0.0
// @description  自由管理三组关键词，隐藏含关键词的帖子或评论
// @author       kun
// @match        https://www.v2ex.com/*
// @match        https://v2ex.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554204/V2EX%20%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%99%A8%EF%BC%88%E6%A0%87%E9%A2%98%E2%94%82%E6%AD%A3%E6%96%87%E2%94%82%E8%AF%84%E8%AE%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554204/V2EX%20%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%99%A8%EF%BC%88%E6%A0%87%E9%A2%98%E2%94%82%E6%AD%A3%E6%96%87%E2%94%82%E8%AF%84%E8%AE%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- 工具 ---------- */
    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => [...el.querySelectorAll(s)];

    /* ---------- 配置读写 ---------- */
    const CFG = {
        title:  'v2ex_kw_title',
        body:   'v2ex_kw_body',
        reply:  'v2ex_kw_reply'
    };
    function load(key) {
        return JSON.parse(GM_getValue(key, '[]'));
    }
    function save(key, arr) {
        GM_setValue(key, JSON.stringify([...new Set(arr.map(w => w.trim()).filter(Boolean))]));
    }

    /* ---------- 关键词检测 ---------- */
    function contain(txt, words) {
        if (!words.length) return false;
        const reg = new RegExp(words.join('|'), 'i');
        return reg.test(txt);
    }

    /* ---------- 屏蔽逻辑 ---------- */
    function runFilter() {
        const titleWords = load(CFG.title);
        const bodyWords  = load(CFG.body);
        const replyWords = load(CFG.reply);

        /* 1. 帖子列表页：整帖 */
        $$('.cell.item').forEach(item => {
            const titleEl = $('a.topic-link', item);
            const title   = titleEl ? titleEl.textContent : '';
            const bodyEl  = $('.topic_info', item);
            const body    = bodyEl ? bodyEl.textContent : '';

            if (contain(title, titleWords) || contain(body, bodyWords)) {
                item.style.display = 'none';
            }
        });

        /* 2. 帖子详情页：正文 */
        if ($('#Main .topic_content')) {
            const mainTitle = $('#Main h1').textContent;
            const mainBody  = $('#Main .topic_content').textContent;
            if (contain(mainTitle, titleWords) || contain(mainBody, bodyWords)) {
                $('#Main').style.display = 'none';
                return;          // 正文都被屏蔽了，评论也不用看了
            }
        }

        /* 3. 帖子详情页：评论 */
        $$('.reply_content').forEach(rc => {
            if (contain(rc.textContent, replyWords)) {
            /* 把整条评论块隐藏掉 */
                const block = rc.closest('.cell') || rc.closest('.comment');
                if (block) block.style.display = 'none';
            }
        });
    }

    /* ---------- 控制面板 ---------- */
    function createPanel() {
        const div = document.createElement('div');
        div.id = 'kw-panel';
        div.innerHTML = `
        <style>
        #kw-panel{position:fixed;top:10px;right:10px;width:260px;background:#fff;border:1px solid #ccd0d7;border-radius6px;box-shadow:0 2px 8px rgba(0,0,0,.1);z-index:9999;font-size:14px;font-family:Arial;}
        #kw-panel .head{background:#f6f7f8;padding:6px 10px;font-weight:bold;cursor:move;}
        #kw-panel .body{padding:10px;}
        #kw-panel textarea{width:100%;height:60px;font-size:12px;border:1px solid #e0e0e0;padding:4px;}
        #kw-panel button{margin-top:6px;width:100%;}
        #kw-panel .close{float:right;cursor:pointer;}
        </style>
        <div class="head">
          <span>V2EX 关键词屏蔽</span>
          <span class="close">✖</span>
        </div>
        <div class="body">
          <label>标题关键词（一行一个）</label>
          <textarea id="kw-title"></textarea>
          <label>正文关键词</label>
          <textarea id="kw-body"></textarea>
          <label>评论关键词</label>
          <textarea id="kw-reply"></textarea>
          <button id="kw-save">保存并立即生效</button>
        </div>`;

        document.body.appendChild(div);

        /* 事件 */
        $('.close', div).onclick = () => div.style.display = 'none';
        $('#kw-save').onclick = () => {
            save(CFG.title, $('#kw-title').value.split('\n'));
            save(CFG.body,  $('#kw-body').value.split('\n'));
            save(CFG.reply, $('#kw-reply').value.split('\n'));
            runFilter();
            alert('已保存并重新过滤！');
        };

        /* 回填现有数据 */
        $('#kw-title').value = load(CFG.title).join('\n');
        $('#kw-body').value  = load(CFG.body).join('\n');
        $('#kw-reply').value = load(CFG.reply).join('\n');

        /* 简单拖拽 */
        let ox, oy;
        $('.head', div).onmousedown = e => {
            ox = e.clientX - div.offsetLeft;
            oy = e.clientY - div.offsetTop;
            document.onmousemove = ev => {
                div.style.left = (ev.clientX - ox) + 'px';
                div.style.top  = (ev.clientY - oy) + 'px';
                div.style.right = 'auto';
            };
            document.onmouseup = () => document.onmousemove = null;
        };
    }

    /* ---------- 入口 ---------- */
    GM_registerMenuCommand('关键词面板', () => $('#kw-panel').style.display = 'block');

    /* 等 DOM 准备好再跑，后续用 MutationObserver 做增量 */
    function start() {
        runFilter();
        new MutationObserver(runFilter).observe(document.body, {childList: true, subtree: true});
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    /* 第一次使用时自动弹出面板 */
    if (!GM_getValue('kw-inited')) {
        GM_setValue('kw-inited', '1');
        document.addEventListener('DOMContentLoaded', () => {
            createPanel();
        });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            createPanel();
            $('#kw-panel').style.display = 'none';   /* 默认收起来 */
        });
    }
})();