// ==UserScript==
// @name         屏蔽百度搜索百家号文章
// @website      https://225336.xyz
// @source       https://github.com/tengxunlaozu/baijiahao
// @namespace    https://github.com/tengxunlaozu/baijiahao
// @support      https://github.com/tengxunlaozu/baijiahao/issues
// @version      3.0
// @description  屏蔽百家号文章
// @author       tengxunlaozu
// @match        *://www.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/551100/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/551100/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BAIDU_TOOL_TPL_WHITELIST = [
    'weather_forecast_new_san',
    'air_quality_san',
    'time_now_san',
    'date_query_san',
    'holiday_san',
    'calculator_san',
    'unit_convert_san',
    'exchange_rate_san',
    'translate_san',
    'dict_san',
    'ip_query_san',
    'whois_san',
    'map_san',
    'route_plan_san',
    'transit_san'
  ];

  function isBaiduToolCard(el) {
    const tpl = el.getAttribute('tpl');
    if (tpl && BAIDU_TOOL_TPL_WHITELIST.includes(tpl)) return true;

    const mName = el.getAttribute('m-name');
    if (mName && /weather|calculator|translate|dict|map|unit|exchange|ip_query|whois/.test(mName)) {
      return true;
    }

    const mu = el.getAttribute('mu');
    if (mu && /weathernew\.pae\.baidu\.com|fanyi\.baidu\.com|dict\.baidu\.com|map\.baidu\.com/.test(mu)) {
      return true;
    }

    return false;
  }

  function killBaijiahao() {

    /* 1️⃣ cosc-card（新版百家号聚合） */
    document.querySelectorAll('.cosc-card, .cosc-card-content')
      .forEach(el => {
        const container = el.closest('.result, .c-container, .cosc-card');
        if (container && isBaiduToolCard(container)) return;
        el.remove();
      });

    /* 2️⃣ contype = nohumanReview */
    document.querySelectorAll('[data-click-info]')
      .forEach(el => {
        const info = el.getAttribute('data-click-info');
        const container = el.closest('.c-container, .result, .cosc-card');
        if (!container || isBaiduToolCard(container)) return;

        if (info && info.includes('"nohumanReview"')) {
          container.remove();
        }
      });

    /* 3️⃣ mu 指向百家号（最稳定） */
    document.querySelectorAll('.result.c-container[mu]')
      .forEach(el => {
        if (isBaiduToolCard(el)) return;

        const mu = el.getAttribute('mu');
        if (mu && mu.includes('baijiahao.baidu.com')) {
          el.remove();
        }
      });

    /* 4️⃣ 兜底：baidu.com/link + mu */
    document.querySelectorAll('a[href^="https://www.baidu.com/link"]')
      .forEach(a => {
        const container = a.closest('.result.c-container');
        if (!container || isBaiduToolCard(container)) return;

        const mu = container.getAttribute('mu');
        if (mu && mu.includes('baijiahao.baidu.com')) {
          container.remove();
        }
      });

    /* 5️⃣ aladdin_struct 聚合卡 */
    document.querySelectorAll('[class*="aladdin"], [class*="aladding"]')
      .forEach(el => {
        const container = el.closest('.result, .c-container');
        if (!container || isBaiduToolCard(container)) return;

        if (container.getAttribute('mu')?.includes('baijiahao.baidu.com')) {
          container.remove();
        }
      });
  }

  killBaijiahao();

  const observer = new MutationObserver(killBaijiahao);
  observer.observe(document.body, { childList: true, subtree: true });

})();

