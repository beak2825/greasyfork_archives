// ==UserScript==
// @name         亚马逊搜索结果添加序号和广告ID（自用）
// @version      2.3.1
// @description  为亚马逊搜索结果页面上的广告和自然搜索结果添加序号，并为所有广告（含品牌广告）添加广告ID和活动ID，全部显示在商品卡片上。
// @author       Haer
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.com.mx/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.ca/*
// @icon         https://www.amazon.com/favicon.ico
// @license      MIT
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/1124651
// @downloadURL https://update.greasyfork.org/scripts/557746/%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%B7%BB%E5%8A%A0%E5%BA%8F%E5%8F%B7%E5%92%8C%E5%B9%BF%E5%91%8AID%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557746/%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%B7%BB%E5%8A%A0%E5%BA%8F%E5%8F%B7%E5%92%8C%E5%B9%BF%E5%91%8AID%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /************ 多语言 ************/
    const translations = {
        'zh': { AdID: '广告ID', CampaignID: '活动ID', Copy: '复制', Copied: '已复制' },
        'en': { AdID: 'Ad ID', CampaignID: 'Campaign ID', Copy: 'Copy', Copied: 'Copied' },
        'de': { AdID: 'Werbe-ID', CampaignID: 'Kampagnen-ID', Copy: 'Kopieren', Copied: 'Kopiert' },
        'fr': { AdID: 'ID Publicité', CampaignID: 'ID Campagne', Copy: 'Copier', Copied: 'Copié' },
        'es': { AdID: 'ID Anuncio', CampaignID: 'ID Campaña', Copy: 'Copiar', Copied: 'Copiado' },
        'it': { AdID: 'ID Annuncio', CampaignID: 'ID Campagna', Copy: 'Copia', Copied: 'Copiato' },
        'nl': { AdID: 'Advertentie-ID', CampaignID: 'Campagne-ID', Copy: 'Kopiëren', Copied: 'Gekopieerd' },
        'ja': { AdID: '広告ID', CampaignID: 'キャンペーンID', Copy: 'コピー', Copied: 'コピー済み' }
    };

    function getLanguage() {
        const hostname = window.location.hostname;
        const countryMap = {
            'amazon.co.jp': 'ja',
            'amazon.de': 'de',
            'amazon.fr': 'fr',
            'amazon.es': 'es',
            'amazon.it': 'it',
            'amazon.co.uk': 'en',
            'amazon.ca': 'en',
            'amazon.com': 'en',
            'amazon.com.mx': 'es',
            'amazon.se': 'en'
        };
        for (const [domain, lang] of Object.entries(countryMap)) {
            if (hostname.includes(domain)) return lang;
        }
        const lang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
        return translations[lang] ? lang : 'en';
    }

    const lang = getLanguage();
    const t = translations[lang];

    /************ 工具函数 ************/
    function safeJSONParse(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return null;
        }
    }

    function getUrlParam(url, name) {
        try {
            const u = new URL(url, location.origin);
            return u.searchParams.get(name);
        } catch (e) {
            return null;
        }
    }

    /************ 复制标签 ************/
    function createCopyableLabel(text, title, backgroundColor) {
        const container = document.createElement('span');
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        container.style.gap = '4px';
        container.style.marginRight = '8px';
        container.style.flexWrap = 'nowrap';

        const label = document.createElement('span');
        label.textContent = text;
        label.title = title || text;
        label.style.backgroundColor = backgroundColor;
        label.style.color = '#fff';
        label.style.padding = '2px 8px';
        label.style.borderRadius = '4px';
        label.style.fontSize = '12px';
        label.style.userSelect = 'text';
        label.style.webkitUserSelect = 'text';
        label.style.whiteSpace = 'nowrap';
        label.style.maxWidth = '180px';
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';

        const copyBtn = document.createElement('span');
        copyBtn.textContent = '📋';
        copyBtn.title = t.Copy;
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.fontSize = '11px';
        copyBtn.style.opacity = '0.8';
        copyBtn.style.flexShrink = '0';

        const copyText = text.split(': ').pop() || text;

        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(copyText, 'text');
            } else {
                const ta = document.createElement('textarea');
                ta.value = copyText;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                } catch (err) {}
                document.body.removeChild(ta);
            }

            const old = copyBtn.textContent;
            copyBtn.textContent = '✓';
            copyBtn.style.color = '#00c853';
            setTimeout(() => {
                copyBtn.textContent = old;
                copyBtn.style.color = '';
            }, 1200);
        });

        container.appendChild(label);
        container.appendChild(copyBtn);
        return container;
    }

    function createNumberLabel(text, isAd) {
        const label = document.createElement('span');
        label.textContent = text;
        label.style.backgroundColor = isAd ? '#FF9900' : '#146EB4';
        label.style.color = '#fff';
        label.style.padding = '2px 8px';
        label.style.borderRadius = '4px';
        label.style.fontSize = '12px';
        label.style.fontWeight = 'bold';
        label.style.minWidth = isAd ? '45px' : '32px';
        label.style.textAlign = 'center';
        label.style.marginRight = '8px';
        label.style.flexShrink = '0';
        return label;
    }

    /************ 收集 asin → 广告元数据（SP + multi-ad + 带 asin 的品牌广告） ************/
    function collectAsinAdMap() {
        const asinToAd = new Map();

        // 1）SP 广告：data-s-safe-ajax-modal-trigger
        document.querySelectorAll('[data-s-safe-ajax-modal-trigger]').forEach(el => {
            const raw = el.getAttribute('data-s-safe-ajax-modal-trigger');
            if (!raw) return;
            const cfg = safeJSONParse(raw);
            if (!cfg || !cfg.ajaxUrl) return;

            const pl = getUrlParam(cfg.ajaxUrl, 'pl');
            if (!pl) return;

            const decoded = decodeURIComponent(pl);
            const payload = safeJSONParse(decoded);
            if (!payload || !payload.adCreativeMetaData) return;

            const details = payload.adCreativeMetaData.adCreativeDetails || [];
            details.forEach(d => {
                if (d.asin && d.adId && d.campaignId && !asinToAd.has(d.asin)) {
                    asinToAd.set(d.asin, {
                        adId: d.adId,
                        campaignId: d.campaignId
                    });
                }
            });
        });

        // 2）multi-ad：data-multi-ad-feedback-form-trigger
        document.querySelectorAll('[data-multi-ad-feedback-form-trigger]').forEach(el => {
            const raw = el.getAttribute('data-multi-ad-feedback-form-trigger');
            if (!raw) return;
            const cfg = safeJSONParse(raw);
            if (!cfg || !cfg.multiAdfPayload) return;

            const payload = safeJSONParse(cfg.multiAdfPayload);
            if (!payload || !payload.adCreativeMetaData) return;

            const details = payload.adCreativeMetaData.adCreativeDetails || [];
            details.forEach(d => {
                if (d.asin && d.adId && d.campaignId && !asinToAd.has(d.asin)) {
                    asinToAd.set(d.asin, {
                        adId: d.adId,
                        campaignId: d.campaignId
                    });
                }
            });
        });

        // 3）带 asin 的 data-ad-feedback（品牌广告）：creativeDetails 里如果有 asin 也并入
        document.querySelectorAll('[data-ad-feedback]').forEach(el => {
            const raw = el.getAttribute('data-ad-feedback');
            if (!raw) return;
            const payload = safeJSONParse(raw);
            if (!payload) return;

            const details = payload.creativeDetails || payload.creativeDetail || [];
            details.forEach(d => {
                const adId = d.adId || d.adID;
                const campaignId = d.campaignId || d.campaignID;
                const asin = d.asin;
                if (!asin || !adId || !campaignId) return;
                if (!asinToAd.has(asin)) {
                    asinToAd.set(asin, {
                        adId,
                        campaignId
                    });
                }
            });
        });

        return asinToAd;
    }

    /************ 判断是否为“显式 Sponsored” ************/
    function isAdSearchResultByLabel(result) {
        if (!result) return false;
        if (result.classList.contains('AdHolder')) return true;
        if (result.getAttribute('data-component-type') === 'sp-sponsored-result') return true;
        if (result.querySelector('.puis-sponsored-label-text, .s-sponsored-label-text, .s-widget-sponsored-label-text')) return true;
        return false;
    }

    /************ 在商品标题下插入标签 ************/
    function insertLabelUnderTitle(result, labelContainer) {
        const title =
            result.querySelector('h2, h2 a, [data-cy="title-recipe"]') ||
            result.querySelector('a.a-link-normal.s-underline-text');

        if (title && title.parentElement) {
            title.parentElement.insertBefore(labelContainer, title.nextSibling);
        } else {
            result.insertBefore(labelContainer, result.firstChild);
        }
    }

    /************ 主逻辑：给搜索结果加序号和广告ID ************/
    function applyLabelsToResults() {
        // 清理旧的
        document.querySelectorAll('.amazon-adhelper-label').forEach(el => el.remove());

        const asinToAd = collectAsinAdMap();
        const results = document.querySelectorAll('[data-component-type="s-search-result"][data-asin]');
        let adIndex = 0;
        let naturalIndex = 0;
        const seenAsinNatural = new Set();

        results.forEach(result => {
            const asin = result.getAttribute('data-asin');
            if (!asin) return;

            const meta = asinToAd.get(asin);  // 是否在广告反馈里出现过
            const hasSponsoredLabel = isAdSearchResultByLabel(result);

            // 关键修正：只要这个 ASIN 被识别为广告（出现在广告反馈里），就当广告处理
            const isAd = hasSponsoredLabel || !!meta;

            const box = document.createElement('div');
            box.className = 'amazon-adhelper-label';
            box.style.display = 'flex';
            box.style.alignItems = 'center';
            box.style.flexWrap = 'wrap';
            box.style.gap = '6px';
            box.style.margin = '4px 0';

            if (isAd) {
                adIndex++;
                box.appendChild(createNumberLabel('AD' + adIndex, true));

                if (meta && meta.adId) {
                    box.appendChild(
                        createCopyableLabel(`${t.AdID}: ${meta.adId}`, `${t.AdID}: ${meta.adId}`, '#232F3E')
                    );
                }
                if (meta && meta.campaignId) {
                    box.appendChild(
                        createCopyableLabel(`${t.CampaignID}: ${meta.campaignId}`, `${t.CampaignID}: ${meta.campaignId}`, '#37475A')
                    );
                }
            } else {
                // 自然位：同一个 ASIN 只记一次自然序号
                if (seenAsinNatural.has(asin)) return;
                seenAsinNatural.add(asin);
                naturalIndex++;
                box.appendChild(createNumberLabel('#' + naturalIndex, false));
            }

            insertLabelUnderTitle(result, box);
        });
    }

    /************ 监听 DOM & URL 变化 ************/
    let applyTimer = null;
    function scheduleApply() {
        clearTimeout(applyTimer);
        applyTimer = setTimeout(applyLabelsToResults, 800);
    }

    window.addEventListener('load', scheduleApply);
    document.addEventListener('DOMContentLoaded', scheduleApply);

    const domObserver = new MutationObserver(() => {
        if (document.querySelector('[data-component-type="s-search-result"]')) {
            scheduleApply();
        }
    });
    domObserver.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const current = location.href;
        if (current !== lastUrl) {
            lastUrl = current;
            scheduleApply();
        }
    });
    urlObserver.observe(document.body, { childList: true, subtree: true });

})();
