// ==UserScript==
// @name         YouTubeのボタン欄に再生速度コントロールボタンを追加
// @namespace    https://example.local/
// @version      1.１
// @description  YouTubeのグッドボタンの並びに一体化した再生速度ボタンを追加。　”「”キーで減速”」”キーで倍速する機能も搭載。
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554583/YouTube%E3%81%AE%E3%83%9C%E3%82%BF%E3%83%B3%E6%AC%84%E3%81%AB%E5%86%8D%E7%94%9F%E9%80%9F%E5%BA%A6%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/554583/YouTube%E3%81%AE%E3%83%9C%E3%82%BF%E3%83%B3%E6%AC%84%E3%81%AB%E5%86%8D%E7%94%9F%E9%80%9F%E5%BA%A6%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STEP = 0.5;
    const MIN_SPEED = 0.25;
    const MAX_SPEED = 2;
    const DISPLAY_MS = 500;
    const ALLOW_FALLBACK_BRACKETS = true;
    const COMBINED_ID = 'yourspeed-top-combined';

    /* ---------------- プレーヤー取得 ---------------- */
    function getPlayerObject() {
        try {
            const mp = document.getElementById('movie_player');
            if (mp && typeof mp.getPlaybackRate === 'function' && typeof mp.setPlaybackRate === 'function') return mp;
        } catch (e) {}
        return null;
    }
    function getYouTubeVideoElement() {
        return document.querySelector('video.html5-main-video') || document.querySelector('video');
    }
    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

    /* ---------------- Bezel 表示再利用 ---------------- */
    let hideTimeout = null;
    function showBezelText(text) {
        const candidates = document.querySelectorAll('div[data-layer="4"]');
        if (!candidates || candidates.length === 0) { showFallbackOverlay(text); return; }
        let target = null;
        for (const div of candidates) {
            if (div.className === 'ytp-bezel-text-hide' || div.classList.length === 0) { target = div; break; }
        }
        if (!target) target = candidates[0];
        const ytpBezelTextWrapper = target.querySelector('.ytp-bezel-text-wrapper');
        const ytpBezelText = ytpBezelTextWrapper ? ytpBezelTextWrapper.querySelector('.ytp-bezel-text') : null;
        const ytpBezel = target.querySelector('.ytp-bezel');
        try {
            if (target.classList.contains('ytp-bezel-text-hide')) target.classList.remove('ytp-bezel-text-hide');
            target.style.display = 'block';
            if (ytpBezelText) {
                ytpBezelText.innerText = text;
                if (ytpBezel) ytpBezel.style.display = 'none';
            } else {
                target.textContent = text;
            }
            if (hideTimeout) clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => { try { target.style.display = 'none'; } catch(e){} }, DISPLAY_MS);
        } catch (e) {
            showFallbackOverlay(text);
        }
    }
    let fallbackDiv = null;
    function showFallbackOverlay(text) {
        if (!fallbackDiv) {
            fallbackDiv = document.createElement('div');
            fallbackDiv.style.position = 'fixed';
            fallbackDiv.style.left = '50%';
            fallbackDiv.style.top = '50%';
            fallbackDiv.style.transform = 'translate(-50%,-50%)';
            fallbackDiv.style.padding = '8px 12px';
            fallbackDiv.style.borderRadius = '6px';
            fallbackDiv.style.background = 'rgba(0,0,0,0.75)';
            fallbackDiv.style.color = 'white';
            fallbackDiv.style.fontSize = '16px';
            fallbackDiv.style.zIndex = '999999';
            fallbackDiv.style.pointerEvents = 'none';
            document.documentElement.appendChild(fallbackDiv);
        }
        fallbackDiv.textContent = text;
        fallbackDiv.style.display = 'block';
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => { if (fallbackDiv) fallbackDiv.style.display = 'none'; }, DISPLAY_MS);
    }

    /* ---------------- 速度変更本体 ---------------- */
    function changeSpeed(delta) {
        const player = getPlayerObject();
        if (player) {
            let current = 1.0;
            try { current = parseFloat(player.getPlaybackRate && player.getPlaybackRate()) || 1.0; } catch (e) { current = 1.0; }
            let newSpeed = Math.round((current + delta) * 100) / 100;
            newSpeed = clamp(newSpeed, MIN_SPEED, MAX_SPEED);
            try { player.setPlaybackRate(newSpeed); }
            catch (e) {
                const vid = getYouTubeVideoElement();
                if (!vid) return false;
                vid.playbackRate = newSpeed;
            }
            showBezelText(newSpeed + 'x');
            return true;
        }
        const vid = getYouTubeVideoElement();
        if (!vid) return false;
        let newSpeed = vid.playbackRate + delta;
        newSpeed = Math.round(newSpeed * 100) / 100;
        newSpeed = clamp(newSpeed, MIN_SPEED, MAX_SPEED);
        vid.playbackRate = newSpeed;
        showBezelText(newSpeed + 'x');
        return true;
    }

    /* ---------------- キー操作 ---------------- */
    function isEditableTarget(target) {
        if (!target) return false;
        const name = target.tagName;
        if (!name) return false;
        const editableTags = ['INPUT','TEXTAREA','SELECT'];
        if (editableTags.includes(name)) return true;
        if (target.isContentEditable) return true;
        return false;
    }
    window.addEventListener('keydown', function(e) {
        if (isEditableTarget(document.activeElement)) return;
        const k = e.key;
        if (k === '」' || k === '〟') { if (changeSpeed(STEP)) e.preventDefault(); return; }
        if (k === '「' || k === '〝') { if (changeSpeed(-STEP)) e.preventDefault(); return; }
        if (ALLOW_FALLBACK_BRACKETS) {
            if (k === ']') { if (changeSpeed(STEP)) e.preventDefault(); return; }
            if (k === '[') { if (changeSpeed(-STEP)) e.preventDefault(); return; }
        }
    }, false);

/* ---------------- 結合ボタン作成 ---------------- */
function createCombinedButton() {
    const existing = document.getElementById(COMBINED_ID);
    if (existing) return existing;

    const wrapper = document.createElement('div');
    wrapper.id = COMBINED_ID;
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.marginLeft = '8px';
    wrapper.style.marginRight = '8px';
    wrapper.style.userSelect = 'none';
    wrapper.style.backgroundColor = 'rgb(242,242,242)';
    wrapper.style.borderRadius = '30px';
    wrapper.style.overflow = 'hidden';
    wrapper.style.position = 'relative';

    const left = document.createElement('button');
    const right = document.createElement('button');
    const baseClass =
        'yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m';
    left.className = baseClass;
    right.className = baseClass;

    Object.assign(left.style, {
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
        padding: '0 10px',
        minWidth: '60px',
        height: '36px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        position: 'relative',
    });

    Object.assign(right.style, {
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0',
        padding: '0 10px',
        minWidth: '60px',
        height: '36px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        position: 'relative',
    });

    const lspan = document.createElement('span');
    lspan.className = 'yt-spec-button-shape-next__button-text-content';
    lspan.textContent = '◀◀';
    const rspan = document.createElement('span');
    rspan.className = 'yt-spec-button-shape-next__button-text-content';
    rspan.textContent = '▶▶';
    left.appendChild(lspan);
    right.appendChild(rspan);

    left.addEventListener('click', (e) => {
        e.preventDefault();
        changeSpeed(-STEP);
    });
    right.addEventListener('click', (e) => {
        e.preventDefault();
        changeSpeed(STEP);
    });

    // ↓ 区切り線を右ボタンの ::before 風に追加
    const divider = document.createElement('div');
    divider.style.position = 'absolute';
    divider.style.left = '50%';
    divider.style.top = '6px';           // ← 上から6px下げる
    divider.style.width = '1px';
    divider.style.height = '24px';       // ← 線の長さを調整（全高36pxのうち24pxに）
    divider.style.background = 'rgba(0,0,0,0.1)';
    wrapper.appendChild(divider);

    wrapper.appendChild(left);
    wrapper.appendChild(right);
    return wrapper;
}



    /* ---------------- top-level コンテナに挿入 ---------------- */
    function findTopButtonsContainer() {
        const a = document.getElementById('top-level-buttons-computed');
        if (a) return a;
        const b = document.querySelector('#top-level-buttons');
        if (b) return b;
        const c = document.querySelector('ytd-video-primary-info-renderer');
        if (c) {
            const maybe = c.querySelector('#top-level-buttons-computed, #top-level-buttons');
            if (maybe) return maybe;
        }
        return null;
    }

function addCombinedToTop() {
    try {
        // 既に存在すればスキップ
        if (document.getElementById(COMBINED_ID)) return;

        const container = findTopButtonsContainer();
        if (!container) return;

        const combined = createCombinedButton();

        // 「いいね」ボタンの次に入れる対象を探す
        // segmented-like-dislike-button-view-model クラスの要素
        const segmentedBtn = container.querySelector(
            '.ytSegmentedLikeDislikeButtonViewModelHost.style-scope.ytd-menu-renderer'
        );

        // yt-button-view-model の共有ボタンを探す（予備）
        const shareBtn = container.querySelector('ytd-button-view-model');

        if (segmentedBtn) {
            // segmentedBtn の次に combined を挿入
            container.insertBefore(combined, segmentedBtn.nextSibling);
        } else if (shareBtn) {
            // 万一 segmentedBtn が無ければ共有ボタンの前に挿入
            container.insertBefore(combined, shareBtn);
        } else {
            // fallback: 最後尾
            container.appendChild(combined);
        }
    } catch (e) {
        // ignore
    }
}

  // ---------------- ホバー効果 ----------------
const style = document.createElement('style');
style.textContent = `
    #yourspeed-top-combined button:hover {
        background-color: rgb(220,220,220) !important;
    }
    #yourspeed-top-combined button:hover span {
        background-color: rgb(220,220,220) !important;
    }
`;
document.head.appendChild(style);


    /* ---------------- DOM 監視 / SPA 対応 ---------------- */
    const topObserver = new MutationObserver(() => {
        addCombinedToTop();
    });

    function startObservingTop() {
        const target = document.querySelector('ytd-video-primary-info-renderer') || document.documentElement;
        topObserver.disconnect();
        topObserver.observe(target, { childList: true, subtree: true });
        addCombinedToTop();
    }

    new MutationObserver(() => { startObservingTop(); }).observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('yt-navigate-finish', () => { startObservingTop(); });
    window.addEventListener('resize', () => { startObservingTop(); });

    // 初期化
    startObservingTop();

})();
