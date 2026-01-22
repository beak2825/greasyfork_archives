// ==UserScript==
// @name         微信读书网页版功能综合（修复发布版）
// @version      0.0.1
// @namespace    http://tampermonkey.net/
// @description  书籍内容字体修改为苍耳今楷，修改标题等字体，更改背景颜色，更改字体颜色，增减页面宽度，上划隐藏头部侧栏，PC自动滚动，代码复制与图片下载
// @author       SimonDW
// @contributor  Li_MIxdown;hubzy;xvusrmqj;LossJ;JackieZheng;das2m;harmonyLife
// @license      MIT
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/563541/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E5%8A%9F%E8%83%BD%E7%BB%BC%E5%90%88%EF%BC%88%E4%BF%AE%E5%A4%8D%E5%8F%91%E5%B8%83%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563541/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E5%8A%9F%E8%83%BD%E7%BB%BC%E5%90%88%EF%BC%88%E4%BF%AE%E5%A4%8D%E5%8F%91%E5%B8%83%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. 样式定义 ===
    const THEME_COLOR = "rgba(216,226,200,0.8)"; 
    
    GM_addStyle(`
        /* 字体美化 */
        * { font-family: "TsangerJinKai05", "LXGW WenKai", "Microsoft YaHei", serif !important; }
        .readerTopBar, .bookInfo_title, .readerTopBar_title_link, .readerTopBar_title_chapter {
            font-family: "SourceHanSerifCN-Bold", "SimSun", serif !important;
            transition: opacity 0.3s ease;
        }

        /* 背景与配色 */
        .wr_whiteTheme, .wr_whiteTheme .readerTopBar, 
        .wr_whiteTheme .readerContent .app_content,
        .wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity {
            background-color: ${THEME_COLOR} !important;
        }

        /* 交互控件 */
        .readerControls { 
            margin-left: calc(50% - 60px) !important; 
            margin-bottom: -28px !important; 
            transition: opacity 0.3s ease;
            opacity: 0; 
        }
        .readerControls:hover { opacity: 1 !important; }
        
        .custom-btn { color: #6a6c6c; cursor: pointer; padding: 5px 10px; border: none; background: transparent; }
        
        #toast_box {
            position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
            padding: 15px 30px; background: rgba(0,0,0,0.7); color: #fff;
            border-radius: 8px; z-index: 10000; display: none;
        }
    `);

    // === 2. 核心工具 ===
    function observeElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = $(selector);
            if (el.length > 0) callback(el);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function showToast(msg) {
        $('#toast_box').text(msg).fadeIn().delay(1000).fadeOut();
    }

    // === 3. 功能模块 ===

    function initCodeCopy() {
        observeElement('pre', (pres) => {
            pres.each(function() {
                if ($(this).find('.copy-code-btn').length > 0) return;
                $(this).css('position', 'relative');
                $(this).append('<button class="copy-code-btn" style="position:absolute;right:5px;top:5px;z-index:10;cursor:pointer;background:none;border:none;">📋</button>');
            });
        });
    }

    function initImageTools() {
        observeElement('.wr_readerImage_opacity', (imgs) => {
            imgs.each(function() {
                if ($(this).next('.img-tool-group').length > 0) return;
                const toolGroup = $(`
                    <div class="img-tool-group" style="position:absolute; right:10px; top:${this.offsetTop}px; z-index:100;">
                        <button class="btn-open-img" title="查看原图" style="display:block;margin-bottom:5px;cursor:pointer;">🔍</button>
                        <button class="btn-down-img" title="下载图片" style="display:block;cursor:pointer;">💾</button>
                    </div>
                `);
                $(this).after(toolGroup);
            });
        });
    }

    function setupWidthControls() {
        const changeWidth = (delta) => {
            const $content = $(".readerContent .app_content, .readerTopBar");
            let current = parseInt($content.css('max-width')) || 800;
            $content.css('max-width', (current + delta) + 'px');
            window.dispatchEvent(new Event('resize'));
        };

        $('.readerControls').append(`
            <button id="width-inc" class="readerControls_item custom-btn">加宽</button>
            <button id="width-dec" class="readerControls_item custom-btn">减宽</button>
        `);
        $('#width-inc').on('click', () => changeWidth(100));
        $('#width-dec').on('click', () => changeWidth(-100));
    }

    let scrollRAID, scrollSpeed = 0;
    function setupAutoScroll() {
        const startScroll = () => {
            if (scrollSpeed >= 3) {
                scrollSpeed = 0;
                cancelAnimationFrame(scrollRAID);
                $('#btn-scroll').text('自动滚动');
                return;
            }
            scrollSpeed += 1;
            $('#btn-scroll').text(`滚动 X${scrollSpeed}`);
            const step = () => {
                window.scrollBy(0, scrollSpeed * 0.5);
                scrollRAID = requestAnimationFrame(step);
            };
            cancelAnimationFrame(scrollRAID);
            scrollRAID = requestAnimationFrame(step);
        };

        $('.readerControls').append('<button id="btn-scroll" class="readerControls_item custom-btn">自动滚动</button>');
        $('#btn-scroll').on('click', startScroll);
        $(window).on('mousedown wheel', () => {
            if (scrollSpeed > 0) {
                scrollSpeed = 0;
                cancelAnimationFrame(scrollRAID);
                $('#btn-scroll').text('自动滚动');
            }
        });
    }

    // === 4. 初始化 ===
    $(document).ready(() => {
        $('body').append('<div id="toast_box"></div>');
        initCodeCopy();
        initImageTools();
        setupWidthControls();
        setupAutoScroll();

        $(document).on('click', '.copy-code-btn', function() {
            const text = $(this).parent().text().replace('📋', '').trim();
            GM_setClipboard(text);
            showToast('代码已复制');
        });

        $(document).on('click', '.btn-open-img', function() {
            const src = $(this).parent().prev().attr('src');
            GM_openInTab(src, { active: true });
        });

        $(document).on('click', '.btn-down-img', function() {
            const src = $(this).parent().prev().attr('src');
            GM_download({ url: src, name: `Weread_${Date.now()}.jpg` });
        });

        let lastScrollTop = 0;
        $(window).on('scroll', () => {
            let st = $(window).scrollTop();
            $('.readerTopBar').css('opacity', (st > lastScrollTop && st > 100) ? '0' : '1');
            lastScrollTop = st;
        });
    });
})();