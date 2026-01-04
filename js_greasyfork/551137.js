// ==UserScript==
// @name           YouTube Premium Ad blocker
// @name:zh-TW     YouTube Premium Lite² (擋廣告) [Beta 測試版]
// @name:zh-CN     YouTube Premium Lite² (去广告) [Beta 测试版]
// @name:ja        YouTube Premium Lite² (広告ブロック) [ベータ版]
// @icon           https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author         ElectroKnight22
// @namespace      electroknight22_youtube_premium_lite_squared_namespace
// @version        0.3.2
// @match          *://www.youtube.com/*
// @exclude        *://www.youtube.com/live_chat*
// @require        https://update.greasyfork.org/scripts/549881/1669057/YouTube%20Helper%20API.js
// @grant          none
// @run-at         document-idle
// @inject-into    page
// @license        MIT
// @description    Features: Logo Swap: Replaces the standard YouTube logo with the Premium version. Ad Blocking: Removes banner and pre-roll ads for a cleaner look. The Goal: Convince anyone glancing at your screen that you're a Premium subscriber. Perfect for a laugh or just to enjoy the aesthetic. Status: Early Beta - Please report any bugs you find!
// @description:zh-TW 是否曾渴望擁有 Premium，卻又覺得正版太過美好？別擔心，這個腳本會將那魯蛇般的普通標誌替換為 Premium 圖示，還能順便擋掉廣告，讓你和你的朋友們誤以為你比實際上更有錢。目前仍在測試階段，因此部分功能可能會不穩定或不完整，請多見諒。
// @description:zh-CN 是否曾渴望拥有 Premium，却又觉得正版太过美好？别担心，这个脚本会将那有些寒酸的普通标志替换为 Premium 图标，还能顺便挡掉广告，让你和你的朋友们误以为你比实际上更有钱。目前仍在测试阶段，因此部分功能可能会不稳定或不完整，请多见谅。
// @description:ja Premium が欲しいけど、本物は立派すぎて手が出せないと思ったことはありませんか？ご心配なく。このスクリリプトは、あの負け犬っぽい普通のロゴを Premium のロゴに置き換え、さらに広告もブロックし、あなたや友達に「実は金持ちなんじゃないか」と勘違いさせることができます。現在まだテスト中のため、一部の機能が不安定であったり、不完全な場合があります。ご了承ください。
// @downloadURL https://update.greasyfork.org/scripts/551137/YouTube%20Premium%20Ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/551137/YouTube%20Premium%20Ad%20blocker.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
  'use strict';

  // Inject premium logos (light and dark) as CSS variables and update YouTube logos accordingly
  function setPremiumLogo() {
    const logoLight = "data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' ...";  // abbreviated for brevity
    const logoDark = "data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' ...";   // abbreviated for brevity

    const premiumLogoCss = `
      :root {
        --logo-light-theme: url("${logoLight}");
        --logo-dark-theme: url("${logoDark}");
      }
      #logo-container .logo,
      .footer-logo-icon,
      #logo-icon,
      #logo-icon-container {
        width: 98px !important;
        content: var(--logo-light-theme) !important;
      }
      html[dark] #logo-icon,
      html[dark] #logo-icon-container {
        content: var(--logo-dark-theme) !important;
      }
    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = premiumLogoCss;
    document.head.appendChild(styleNode);
  }

  // Inject CSS rules to hide/block various YouTube ad elements
  function setAdBlockingStyles() {
    const adBlockCss = `
      #ad-created,
      .player-ads,
      #ytd-in-feed-ad-layout-renderer,
      ytd-in-feed-ad-layout-renderer,
      ytd-banner-promo-renderer,
      ytd-ad-slot-renderer,
      ytd-rich-item-renderer:has(ytd-ad-slot-renderer):not([is-in-first-column]),
      yt-mealbar-promo-renderer,
      ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads'],
      ytd-player-legacy-desktop-watch-ads-renderer,
      ytd-single-option-survey-renderer {
        display: none !important;
      }
      ytd-rich-item-renderer:has(ytd-ad-slot-renderer)[is-in-first-column] {
        display: unset !important;
        width: 16px !important;
        padding: 0 !important;
        margin: 0 !important;
      }
    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = adBlockCss;
    document.head.appendChild(styleNode);
  }

  // Fix YouTube homepage layout caused by ad removal (currently fragile, may require rewrite)
  function fixHomepageLayout() {
    if (window.location.pathname !== '/') return;

    try {
      const adRenderers = document.querySelectorAll('ytd-rich-item-renderer:has(ytd-ad-slot-renderer)');
      if (adRenderers.length === 0) return;

      const rendererParent = adRenderers[0].parentElement;
      const rowLength = parseInt(adRenderers[0].getAttribute('items-per-row'), 10);
      if (!rowLength) throw new Error('Row length cannot be determined.');

      const allRenderers = Array.from(rendererParent.children);
      const blockingRenderers = allRenderers.filter(renderer => renderer?.querySelector('ytd-rich-shelf-renderer'));

      // Adjust layout by removing ad placeholders and recalculating indices
      let processedRenderers = 0;
      blockingRenderers.forEach(blockingRenderer => {
        let blockingIndex = allRenderers.indexOf(blockingRenderer);
        let hiddenAdCount = 0;

        adRenderers.forEach(adRenderer => {
          const adIndex = allRenderers.indexOf(adRenderer);
          if (blockingIndex > adIndex) hiddenAdCount++;
        });

        blockingIndex = blockingIndex - processedRenderers - hiddenAdCount + 1;

        for (let i = 0; i <= rowLength; i++) {
          const toRemove = allRenderers[blockingIndex + i];
          if (toRemove && toRemove.style) {
            toRemove.style.display = 'none';
            processedRenderers++;
          }
        }
      });
    } catch (err) {
      console.warn('Failed to fix homepage layout:', err);
    }
  }

  // Run all setup functions after page load
  function init() {
    setPremiumLogo();
    setAdBlockingStyles();
    fixHomepageLayout();
  }

  // Run script at document idle
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
})();
