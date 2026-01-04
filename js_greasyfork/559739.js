// ==UserScript==
// @name         Sehuatang Clean Gallery
// @namespace    https://www.sehuatang.net/
// @version      2.5.0
// @description  Vibe coded, so don't expect any frequent updates.
// @author       fred5566123
// @match        https://www.sehuatang.net/forum-*
// @match        https://www.sehuatang.net/forum.php?mod=forumdisplay&fid=*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559739/Sehuatang%20Clean%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/559739/Sehuatang%20Clean%20Gallery.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $j = jQuery.noConflict(true);

    // --- 設定區 ---
    const MIN_DELAY = 500;
    const MAX_DELAY = 1200;
    const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000;
    // 重置緩存前綴，解決舊資料結構不一致的問題
    const CACHE_PREFIX = 'sht_lite_v2.5_';

    var nextListUrl = null;
    var isFetching = false;

    // --- 燈箱狀態 ---
    var lightboxState = {
        images: [], currentIndex: 0, isLoading: false, threadUrl: '', lastWheelTime: 0
    };

    // --- CSS ---
    GM_addStyle(`
        #gallery-trigger-btn {
            position: fixed; bottom: 30px; right: 30px; z-index: 99999;
            background: linear-gradient(135deg, #e91e63, #c2185b);
            color: white; padding: 12px 24px;
            border-radius: 50px; font-weight: bold; cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            font-family: "Microsoft JhengHei", sans-serif;
            transition: transform 0.2s;
        }
        #gallery-trigger-btn:hover { transform: scale(1.05); }

        #gallery-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: #121212; z-index: 100000;
            overflow-y: scroll; display: none; padding: 0;
            font-family: "Microsoft JhengHei", sans-serif;
        }

        #gallery-lightbox {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.98); z-index: 100001;
            display: none;
            flex-direction: column; justify-content: center; align-items: center;
            user-select: none;
        }

        #gallery-lightbox img.main-img {
            max-width: 100vw; max-height: 100vh;
            object-fit: contain; transition: opacity 0.2s;
        }

        .lb-close-btn {
            position: absolute; top: 20px; right: 30px;
            color: rgba(255,255,255,0.6); font-size: 40px; cursor: pointer;
            z-index: 100003; transition: color 0.2s; line-height: 1;
        }
        .lb-close-btn:hover { color: #fff; }

        .lb-nav {
            position: absolute; top: 50%; transform: translateY(-50%);
            color: rgba(255,255,255,0.3); font-size: 80px; padding: 50px 20px; cursor: pointer;
            transition: all 0.2s; z-index: 100002;
        }
        .lb-nav:hover { color: #fff; background: rgba(0,0,0,0.2); }
        .lb-prev { left: 0; }
        .lb-next { right: 0; }

        .lb-info {
            position: absolute; bottom: 20px;
            text-align: center; color: #ccc;
            background: rgba(0,0,0,0.6); padding: 5px 20px; border-radius: 20px;
            pointer-events: none;
        }
        .lb-status { font-size: 14px; color: #4caf50; margin-left: 10px; font-weight: bold; }

        /* Grid & Card Style */
        #gallery-header {
            position: sticky; top: 0; background: #1e1e1e; z-index: 100;
            padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid #333;
        }
        #gallery-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 15px; padding: 15px;
        }
        .gallery-card {
            background: #252525; border-radius: 4px; overflow: hidden;
            border: 1px solid #333; display: flex; flex-direction: column;
            position: relative; transition: transform 0.2s;
        }
        .gallery-card:hover { transform: translateY(-3px); border-color: #666; }

        .card-img-box {
            width: 100%; height: 220px; background: #000;
            display: flex; align-items: center; justify-content: center;
            overflow: hidden; cursor: zoom-in; position: relative;
        }
        .card-img-box img { width: 100%; height: 100%; object-fit: cover; }

        .card-content { padding: 8px 10px; display: flex; flex-direction: column; flex-grow: 1; }
        .card-title {
            color: #ddd; font-size: 13px; line-height: 1.4; text-decoration: none;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
            margin-bottom: 6px; cursor: help;
        }
        .card-title:hover { color: #fff; }

        .tag-uncensored { color: #ff4081; font-weight: bold; margin-right: 4px; }
        .tag-censored { color: #2196f3; font-weight: bold; margin-right: 4px; }
        .tag-other { color: #888; font-size: 12px; margin-right: 4px; }

        .info-row {
            font-size: 11px; color: #aaa; margin-bottom: 6px;
            display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
            line-height: 1.2;
        }
        .info-item { display: flex; align-items: center; white-space: nowrap; }
        .info-item span { overflow: hidden; text-overflow: ellipsis; max-width: 90px; }

        .card-date {
            font-size: 11px; color: #666; margin-bottom: 8px;
            display: flex; align-items: center;
        }
        .card-date::before { content: '🕒 '; font-size: 10px; margin-right: 3px; opacity: 0.7; }

        .magnet-btn {
            background: #333; color: #777; border: 1px solid #444;
            padding: 5px; font-size: 12px; text-align: center; cursor: default;
            border-radius: 3px; margin-top: auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .magnet-btn.active { cursor: pointer; color: #bbb; }
        .magnet-btn.active:hover { background: #444; color: #fff; }
        .magnet-btn.copied { background: #2e7d32; border-color: #2e7d32; color: #fff; }

        #gallery-load-more {
            display: block; width: 95%; margin: 20px auto 50px auto; padding: 12px;
            background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer;
        }
    `);

    // --- 緩存系統 ---
    const Cache = {
        get: function(url) {
            try {
                const item = localStorage.getItem(CACHE_PREFIX + url);
                if (item) {
                    const data = JSON.parse(item);
                    if (Date.now() - data.t > CACHE_EXPIRY) {
                        localStorage.removeItem(CACHE_PREFIX + url);
                        return null;
                    }
                    // [Fix]: 將簡寫還原為全名，讓 updateCardUI 能正確讀取
                    return {
                        cover: data.c,
                        magnet: data.m,
                        actress: data.a,
                        size: data.s
                    };
                }
            } catch(e) {}
            return null;
        },
        set: function(url, data) {
            try {
                // 存入時使用簡寫以節省空間
                const item = { t: Date.now(), c: data.cover, m: data.magnet, a: data.actress, s: data.size };
                localStorage.setItem(CACHE_PREFIX + url, JSON.stringify(item));
            } catch(e) {
                if (e.name === 'QuotaExceededError') localStorage.clear();
            }
        }
    };

    // --- UI 初始化 ---
    function initUI() {
        if ($j('#gallery-trigger-btn').length === 0) {
            $j('body').append('<div id="gallery-trigger-btn">🎴 畫廊模式</div>');
        }

        if ($j('#gallery-overlay').length === 0) {
            const html = `
                <div id="gallery-overlay">
                    <div id="gallery-header">
                        <div style="color:#fff; font-weight:bold;">Sehuatang Gallery v2.5</div>
                        <div id="gallery-progress" style="font-size:12px; color:#4caf50;"></div>
                        <button id="gallery-close" style="background:#444; color:#fff; border:none; padding:5px 15px; cursor:pointer; border-radius:4px;">退出畫廊</button>
                    </div>
                    <div id="gallery-grid"></div>
                    <button id="gallery-load-more" style="display:none;">⬇️ 載入下一頁</button>
                </div>

                <div id="gallery-lightbox">
                    <div class="lb-close-btn" title="關閉 (Esc)">✕</div>
                    <div class="lb-nav lb-prev">❮</div>
                    <div class="lb-nav lb-next">❯</div>
                    <img class="main-img" src="" alt="" />
                    <div class="lb-info">
                        <span class="lb-counter">1 / 1</span>
                        <span class="lb-status"></span>
                    </div>
                </div>
            `;
            $j('body').append(html);
        }

        $j('#gallery-trigger-btn').on('click', startGalleryMode);

        $j('#gallery-close').on('click', function() {
            $j('#gallery-overlay').fadeOut();
            $j('body').css('overflow', 'auto');
            $j('#gallery-trigger-btn').fadeIn();
        });

        $j('#gallery-load-more').on('click', loadNextPageList);

        initLightboxEvents();
    }

    // --- 畫廊主邏輯 ---
    function startGalleryMode() {
        $j('body').css('overflow', 'hidden');
        $j('#gallery-trigger-btn').hide();
        $j('#gallery-overlay').fadeIn();
        $j('#gallery-grid').empty();

        const tasks = extractThreadsFromDom($j(document));
        updateNextPageUrl($j(document));

        if (tasks.length === 0) {
            alert("此頁面無可用帖子");
            return;
        }
        processTasks(tasks);
    }

    function extractThreadsFromDom($context) {
        var tasks = [];
        $context.find("tbody[id^='normalthread_']").each(function () {
            var $tbody = $j(this);
            var $link = $tbody.find("a.xst");
            var href = $link.attr("href");
            var rawTitle = $link.text().trim();

            var $tag = $tbody.find("th em a");
            var tagHtml = "";
            if ($tag.length) {
                var t = $tag.text();
                if (t.includes("无码") || t.includes("無碼")) tagHtml = '<span class="tag-uncensored">[無碼]</span>';
                else if (t.includes("有码") || t.includes("有碼")) tagHtml = '<span class="tag-censored">[有碼]</span>';
                else tagHtml = `<span class="tag-other">[${t}]</span>`;
            }

            var dateStr = "";
            var $dateElem = $tbody.find("td.by").first().find("em");
            if ($dateElem.length > 0) {
                dateStr = $dateElem.text();
            } else {
                dateStr = $tbody.find("td.by").first().text();
            }
            dateStr = dateStr.replace(/[\r\n]+/g, ' ').trim();

            if (href) {
                if (!href.startsWith("http")) href = window.location.origin + "/" + href;
                tasks.push({
                    url: href,
                    title: rawTitle,
                    tagHtml: tagHtml,
                    date: dateStr
                });
            }
        });
        return tasks;
    }

    function updateNextPageUrl($context) {
        var $next = $context.find('.pg a.nxt');
        if ($next.length) {
            nextListUrl = $next.attr('href');
            if (!nextListUrl.startsWith("http")) nextListUrl = window.location.origin + "/" + nextListUrl;
            $j('#gallery-load-more').text('⬇️ 載入下一頁').show().prop('disabled', false);
        } else {
            nextListUrl = null;
            $j('#gallery-load-more').hide();
        }
    }

    // --- 列表處理 ---
    function processTasks(tasks) {
        var $progress = $j('#gallery-progress');
        var queue = [];
        var batchId = Date.now();

        tasks.forEach((task, idx) => {
            task.cardId = `card-${batchId}-${idx}`;
            var safeTitle = task.title.replace(/"/g, '&quot;');

            $j('#gallery-grid').append(`
                <div class="gallery-card" id="${task.cardId}">
                    <div class="card-img-box"><span style="color:#555;">...</span></div>
                    <div class="card-content">
                        <a href="${task.url}" target="_blank" class="card-title" title="${safeTitle}">${task.tagHtml}${task.title}</a>
                        <div class="info-row"></div>
                        <div class="card-date">${task.date}</div>
                        <div class="magnet-btn">...</div>
                    </div>
                </div>
            `);

            var cached = Cache.get(task.url);
            if (cached) {
                updateCardUI(task.cardId, cached, task.url);
            } else {
                queue.push(task);
            }
        });

        if (queue.length === 0) {
            $progress.text("全部命中緩存");
            return;
        }

        var total = queue.length;
        var processed = 0;

        function next() {
            if (queue.length === 0) {
                $progress.text("列表載入完成");
                return;
            }
            var task = queue.shift();
            processed++;
            $progress.text(`同步列表: ${processed} / ${total}`);

            $j.get(task.url, function(data) {
                var res = parsePostData(data);
                Cache.set(task.url, res);
                updateCardUI(task.cardId, res, task.url);
                setTimeout(next, Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);
            }).fail(() => {
                setTimeout(next, MIN_DELAY);
            });
        }
        next();
    }

    // [核心解析] 抓取封面、磁力、女優、大小
    function parsePostData(html) {
        // [Fix]: 輔助函式 - 移除 HTML 標籤與強制截斷
        const cleanText = (str) => {
            if (!str) return null;
            let s = str.replace(/<[^>]*>/g, '');
            // 如果抓到了下一個欄位的開頭 '【'，強制切斷
            if (s.includes('【')) s = s.split('【')[0];
            return s.trim();
        };

        // 1. Cover
        var imgMatch = html.match(/zoomfile="([^"]+)"/);
        if (!imgMatch) imgMatch = html.match(/file="([^"]+)"/);
        var cover = null;
        if (imgMatch && imgMatch[1]) {
            cover = imgMatch[1];
            if (!cover.startsWith("http")) cover = window.location.origin + "/" + cover;
        }

        // 2. Magnet
        var magMatch = html.match(/magnet:\?xt=urn:btih:[a-zA-Z0-9]+/);
        var magnet = magMatch ? magMatch[0] : null;

        // 3. Actress [Fix: Regex 排除 '【' 和 '<']
        var actress = null;
        var actMatch = html.match(/【(?:出演女优|女优|出演|演员|主演)】[:：]?\s*([^【<]+)/i);
        if (actMatch && actMatch[1]) {
            actress = cleanText(actMatch[1]);
        }

        // 4. Size [Fix: Regex 排除 '【' 和 '<']
        var size = null;
        var sizeMatch = html.match(/【(?:影片容量|容量|大小|文件大小|档案大小)】[:：]?\s*([^【<]+)/i);
        if (sizeMatch && sizeMatch[1]) {
            size = cleanText(sizeMatch[1]);
        }

        return { cover: cover, magnet: magnet, actress: actress, size: size };
    }

    function updateCardUI(cardId, data, url) {
        var $card = $j('#' + cardId);
        $card.data('cover', data.cover);
        $card.data('url', url);

        if (data.cover) {
            $card.find('.card-img-box').html(`<img src="${data.cover}" loading="lazy">`);
        } else {
            $card.find('.card-img-box').html(`<span style="font-size:24px;">🈚</span>`);
        }

        var infoHtml = '';
        if (data.actress) infoHtml += `<div class="info-item" title="${data.actress}">👩 <span>${data.actress}</span></div>`;
        if (data.size) infoHtml += `<div class="info-item">💾 <span>${data.size}</span></div>`;
        $card.find('.info-row').html(infoHtml);

        var $btn = $card.find('.magnet-btn');
        if (data.magnet) {
            $btn.text("🧲 複製磁力").addClass('active').attr('title', data.magnet).on('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                GM_setClipboard(data.magnet);
                var t = $j(this).text();
                $j(this).text("✅").addClass('copied');
                setTimeout(() => $j(this).text(t).removeClass('copied'), 1500);
            });
        } else {
            $btn.text("無磁力");
        }
    }

    function loadNextPageList() {
        if (!nextListUrl || isFetching) return;
        isFetching = true;
        var $btn = $j('#gallery-load-more');
        $btn.text('⏳ Loading...').prop('disabled', true);

        $j.get(nextListUrl, function(data) {
            var $doc = $j("<div>").html(data);
            var tasks = extractThreadsFromDom($doc);
            if (tasks.length) {
                processTasks(tasks);
                updateNextPageUrl($doc);
            } else {
                $btn.hide();
            }
            isFetching = false;
        });
    }

    function initLightboxEvents() {
        $j(document).on('click', '.card-img-box', function() {
            var $card = $j(this).closest('.gallery-card');
            var cover = $card.data('cover');
            var url = $card.data('url');
            if (cover && url) openLightbox(cover, url);
        });

        $j('.lb-close-btn').click(closeLightbox);
        $j('#gallery-lightbox').click(function(e) {
            if (e.target.id === 'gallery-lightbox') closeLightbox();
        });

        $j('.lb-prev').click((e) => { e.stopPropagation(); changeImage(-1); });
        $j('.lb-next').click((e) => { e.stopPropagation(); changeImage(1); });

        $j(document).on('keydown', function(e) {
            if ($j('#gallery-lightbox').is(':visible')) {
                if (e.keyCode === 37) changeImage(-1);
                if (e.keyCode === 39) changeImage(1);
                if (e.keyCode === 27) closeLightbox();
            }
        });

        $j('#gallery-lightbox').on('wheel', function(e) {
            if (!$j(this).is(':visible')) return;
            e.preventDefault();
            var now = Date.now();
            if (now - lightboxState.lastWheelTime < 250) return;
            lightboxState.lastWheelTime = now;
            if (e.originalEvent.deltaY > 0) changeImage(1);
            else changeImage(-1);
        });
    }

    function openLightbox(cover, url) {
        lightboxState = { images: [cover], currentIndex: 0, isLoading: true, threadUrl: url, lastWheelTime: 0 };

        var $lb = $j('#gallery-lightbox');
        $lb.find('img.main-img').attr('src', cover).css('opacity', 1);
        $lb.find('.lb-counter').text('1 / ?');
        $lb.find('.lb-status').text('⏳ 正在解析剩餘圖片...');
        $lb.fadeIn(200).css('display', 'flex');

        $j.get(url, function(data) {
            if (!$lb.is(':visible') || lightboxState.threadUrl !== url) return;

            var $doc = $j("<div>").html(data);
            var imgs = [];
            $doc.find(".t_f img").each(function() {
                var s = $j(this).attr('zoomfile') || $j(this).attr('file') || $j(this).attr('src');
                if (s && !s.includes('none.gif') && !s.includes('static/image')) {
                    if (!s.startsWith('http')) s = window.location.origin + "/" + s;
                    imgs.push(s);
                }
            });

            if (imgs.length > 0) {
                lightboxState.images = imgs;
                lightboxState.isLoading = false;
                lightboxState.currentIndex = 0;

                $lb.find('.lb-counter').text(`1 / ${imgs.length}`);
                $lb.find('.lb-status').text(`✅ 已載入 ${imgs.length} 張`);
                setTimeout(() => $lb.find('.lb-status').text(''), 2000);
            }
        });
    }

    function closeLightbox() {
        $j('#gallery-lightbox').fadeOut(200);
    }

    function changeImage(dir) {
        var state = lightboxState;
        if (state.images.length <= 1 && state.isLoading) return;

        var next = state.currentIndex + dir;
        if (next < 0) next = state.images.length - 1;
        if (next >= state.images.length) next = 0;

        state.currentIndex = next;

        var $img = $j('#gallery-lightbox img.main-img');
        var src = state.images[next];

        $img.css('opacity', 0.8);
        $img.attr('src', src).one('load', function() {
            $img.css('opacity', 1);
        });

        var total = state.isLoading ? "?" : state.images.length;
        $j('.lb-counter').text(`${next + 1} / ${total}`);
    }

    initUI();
})();