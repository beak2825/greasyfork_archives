// ==UserScript==
// @name         YouTube 油管去广告 Pro
// @version      3.6
// @description  采用倍速快进跳过技术，避开检测
// @author       stephchow
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/561174/YouTube%20%E6%B2%B9%E7%AE%A1%E5%8E%BB%E5%B9%BF%E5%91%8A%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/561174/YouTube%20%E6%B2%B9%E7%AE%A1%E5%8E%BB%E5%B9%BF%E5%91%8A%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. 隐藏广告位的 CSS (保持原有基础上增加)
    const adSelectors = [
        '.video-ads', '.ytp-ad-module', 'ytd-ad-slot-renderer',
        'ytd-rich-item-renderer:has([aria-label*="Ad"])',
        'ytd-rich-item-renderer:has([aria-label*="廣告"])',
        '#player-ads', 'ytd-banner-promo-renderer',
        '#masthead-ad', '.ad-showing', '.ad-interrupting'
    ].join(', ');

    GM_addStyle(`${adSelectors} { display: none !important; }`);

    // 2. 核心逻辑：检测并加速广告
  // 定义多语言跳过关键词（支持简体/繁体/英文等）
const SKIP_KEYWORDS_MAP = {
    en: ['Skip', 'skip', 'SKIP'],
    zh_cn: ['跳过'],
    zh_tw: ['略過', '跳過'],
    ja: ['スキップ'],
    ko: ['건너뛰기'],
    ru: ['Пропустить'],
    es: ['Saltar'],
    fr: ['Ignorer']
};

// 提取所有关键词为扁平数组（供脚本使用）
const SKIP_KEYWORDS = Object.values(SKIP_KEYWORDS_MAP).flat();

/**
  *智能查找“跳过广告”按钮：先按 class，再按文本内容
 */
function getSkipButton() {
    // ✅ 第一优先级：已知的 class 选择器（高效且准确）
    const classSelectors = [
        '.ytp-ad-skip-button',
        '.ytp-skip-ad-button',
        '.ytp-ad-skip-button-modern'
    ].join(', ');

    let button = document.querySelector(classSelectors);
    if (button && !button.disabled) {
        return button;
    }

    // ✅ 第二优先级：基于文本或 aria-label 的模糊匹配（抗 UI 变更）
    const candidateButtons = document.querySelectorAll('button, [role="button"]');
    for (const btn of candidateButtons) {
        if (btn.disabled) continue;

        const text = (btn.textContent || btn.innerText || '').trim();
        const ariaLabel = btn.ariaLabel || '';

        // 检查文本或 aria-label 是否包含任一关键词
        const matched = SKIP_KEYWORDS.some(keyword =>
            text.includes(keyword) || ariaLabel.includes(keyword)
        );

        if (matched) {
            return btn;
        }
    }

    return null; // 未找到
}

/**
 * 处理广告视频：快进 + 自动跳过
 */
function handleVideoAds() {
    const video = document.querySelector('video');
    const moviePlayer = document.querySelector('#movie_player');

    const isAd = moviePlayer?.classList.contains('ad-showing') ||
                 moviePlayer?.classList.contains('ad-interrupting');

    if (video && isAd) {
        // 静音 + 16倍速快进到结尾
        video.muted = true;
        video.playbackRate = 16;
        if (isFinite(video.duration)) {
            video.currentTime = video.duration - 0.1;
        }

        // 🔥 使用双重保险策略获取并点击跳过按钮
        const skipButton = getSkipButton();
        if (skipButton) {
            // 防止重复点击（可选）
            if (!skipButton.hasBeenClickedByScript) {
                skipButton.click();
                skipButton.hasBeenClickedByScript = true; // 标记已点击
            }
        }
    }
}

    // 3. 移除反拦截弹窗 (关键修复)
   function removeEnforcement() {
    const overlays = document.querySelectorAll(
        'ytd-enforcement-message-view-model, tp-yt-iron-overlay-backdrop, ytd-popup-container'
    );

    if (overlays.length > 0) {
        console.log('[YT Ad Block] 检测到 enforcement 弹窗，正在移除...', overlays);
        overlays.forEach(el => el.remove());
    }

    if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
        console.log('[YT Ad Block] 已恢复页面滚动');
    }
}

    // 4. 高频监听
    const observer = new MutationObserver(() => {
        handleVideoAds();
        removeEnforcement();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 5. 定时检查（防止 MutationObserver 漏掉）
    setInterval(handleVideoAds, 500);

})();