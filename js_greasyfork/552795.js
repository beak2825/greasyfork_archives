// ==UserScript==
// @name         Twitch - Show Stream Language
// @namespace    twitch-language-suffix
// @version      1.5.4
// @description  Displays the stream language as [EN]/[JA]/etc. Configurable, with two UI modes: a badge on the stream preview or a suffix next to the streamer’s username
// @author       Vikindor (https://vikindor.github.io/)
// @homepageURL  https://github.com/Vikindor/twitch-show-stream-language
// @supportURL   https://github.com/Vikindor/twitch-show-stream-language/issues
// @license      MIT
// @match        https://www.twitch.tv/*
// @grant        none
// @inject-into  page
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552795/Twitch%20-%20Show%20Stream%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/552795/Twitch%20-%20Show%20Stream%20Language.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ----------- CONFIG -----------
  // VISUAL_MODE options:
  // - 'suffix' : adds label next to the streamer's username
  // - 'badge'        : adds small pill in the top-right corner of the preview card
  const VISUAL_MODE = 'suffix';

  // ----------- DATA -----------
  const langByLogin = new Map();
  const idByLogin = new Map();
  const loginById = new Map();
  const langById = new Map();
  const toUpperCode = (v) => (typeof v === 'string' ? v.trim().toUpperCase() : null);
  const isIsoLike = (v) => typeof v === 'string' && /^[a-z]{2}(?:-[a-z]{2})?$/i.test(v.trim());

  const tagNameToCode = new Map(Object.entries({
    'arabic': 'AR','qatar': 'AR','uae': 'AR','العربية': 'AR','bulgarian': 'BG','български': 'BG',
    'czech': 'CS','cz': 'CS','czsk': 'CS','čeština': 'CS','danish': 'DA','dansk': 'DA','deutsch': 'DE',
    'greek': 'EL','ελληνικά': 'EL','australia': 'EN','english': 'EN','español': 'ES','espanol': 'ES',
    'suomi': 'FI','francais': 'FR','français': 'FR','magyar': 'HU','italiano': 'IT','日本語': 'JA',
    '한국어': 'KO','lietuva': 'LT','lithuania': 'LT','dutch': 'NL','nederlands': 'NL','norsk': 'NO',
    'polski': 'PL','portugues': 'PT','português': 'PT','portuguese': 'PT','romania': 'RO',
    'romanian': 'RO','română': 'RO','русский': 'RU','slovenčina': 'SK','svenska': 'SV','ภาษาไทย': 'TH',
    'tagalog': 'TL','turkish': 'TR','türkçe': 'TR','ukrainian': 'UK','українська': 'UK',
    '中文': 'ZH','中文(简体)': 'ZH','中文(繁體)': 'ZH'
  }));

  function tagToCode(tagObj) {
    if (!tagObj) return null;
    if (typeof tagObj === 'string') return tagNameToCode.get(tagObj.trim().toLowerCase()) || null;
    const name = tagObj.localizedName || tagObj.name || tagObj.tagName || tagObj.label || tagObj.slug;
    return name ? (tagNameToCode.get(String(name).trim().toLowerCase()) || null) : null;
  }

  function extractPair(node) {
    if (!node || typeof node !== 'object') return null;

    const login =
      (node.broadcaster && (node.broadcaster.login || node.broadcasterLogin)) ||
      node.userLogin ||
      node.login ||
      (node.channel && (node.channel.login || node.channel.name)) ||
      null;

    let lang = null;
    if (typeof node.broadcasterLanguage === 'string' && node.broadcasterLanguage) lang = node.broadcasterLanguage;
    if (!lang && typeof node.language === 'string' && isIsoLike(node.language)) lang = node.language;
    if (!lang && node.stream && typeof node.stream.language === 'string' && isIsoLike(node.stream.language)) lang = node.stream.language;
    if (!lang && node.channel) {
      const ch = node.channel;
      if (typeof ch.broadcasterLanguage === 'string' && isIsoLike(ch.broadcasterLanguage)) lang = ch.broadcasterLanguage;
      else if (typeof ch.language === 'string' && isIsoLike(ch.language)) lang = ch.language;
    }
    if (!lang) {
      const tags = Array.isArray(node.contentTags) ? node.contentTags :
                   Array.isArray(node.freeformTags) ? node.freeformTags : null;
      if (tags) {
        for (const t of tags) { const c = tagToCode(t); if (c) { lang = c; break; } }
      }
    }

    if (login && lang) return { login: String(login).toLowerCase(), lang: toUpperCode(lang) };
    return null;
  }

  function extractTriple(node) {
    if (!node || typeof node !== 'object') return null;

    const login =
      (node.broadcaster && (node.broadcaster.login || node.broadcasterLogin)) ||
      (node.user && node.user.login) ||
      (node.userByAttribute && node.userByAttribute.login) ||
      node.userLogin ||
      node.login ||
      (node.channel && (node.channel.login || node.channel.name)) ||
      null;

    const id =
      (node.user && node.user.id) ||
      (node.userByAttribute && node.userByAttribute.id) ||
      (node.channel && node.channel.id) ||
      (node.broadcaster && node.broadcaster.id) ||
      node.id || null;

    let lang = null;
    if (typeof node.broadcasterLanguage === 'string' && node.broadcasterLanguage) lang = node.broadcasterLanguage;
    if (!lang && typeof node.language === 'string' && isIsoLike(node.language)) lang = node.language;
    if (!lang && node.stream && typeof node.stream.language === 'string' && isIsoLike(node.stream.language)) lang = node.stream.language;
    if (!lang && node.broadcastSettings && typeof node.broadcastSettings.language === 'string') lang = node.broadcastSettings.language;
    if (!lang && node.channel) {
      const ch = node.channel;
      if (typeof ch.broadcasterLanguage === 'string' && isIsoLike(ch.broadcasterLanguage)) lang = ch.broadcasterLanguage;
      else if (typeof ch.language === 'string' && isIsoLike(ch.language)) lang = ch.language;
    }
    const outLogin = login ? String(login).toLowerCase() : null;
    const outLang  = lang ? toUpperCode(lang) : null;
    if (outLogin || id || outLang) return { login: outLogin, id, lang: outLang };
    return null;
  }

  function collectLanguages(any) {
    if (!any || typeof any !== 'object') return;

    const pair = extractPair(any);
    if (pair) {
      const prev = langByLogin.get(pair.login);
      if (prev !== pair.lang) {
        langByLogin.set(pair.login, pair.lang);
        queueAnnotate();
      }
    }

    const triple = extractTriple(any);
    if (triple) {
      let touched = false;

      if (triple.login && triple.id) {
        if (idByLogin.get(triple.login) !== triple.id) { idByLogin.set(triple.login, triple.id); touched = true; }
        if (loginById.get(triple.id) !== triple.login) { loginById.set(triple.id, triple.login); touched = true; }
      }
      if (triple.lang) {
        if (triple.id && langById.get(triple.id) !== triple.lang) { langById.set(triple.id, triple.lang); touched = true; }
        if (triple.login && !langByLogin.has(triple.login)) { langByLogin.set(triple.login, triple.lang); touched = true; }

        if (!triple.login && triple.id) {
          const knownLogin = loginById.get(triple.id);
          if (knownLogin && !langByLogin.get(knownLogin)) { langByLogin.set(knownLogin, triple.lang); touched = true; }
        }
        if (!triple.id && triple.login) {
          const knownId = idByLogin.get(triple.login);
          if (knownId && !langById.get(knownId)) { langById.set(knownId, triple.lang); touched = true; }
        }
      }
      if (touched) queueAnnotate();
    }

    if (Array.isArray(any)) {
      for (const it of any) collectLanguages(it);
    } else {
      for (const k in any) {
        if (!Object.prototype.hasOwnProperty.call(any, k)) continue;
        const v = any[k];
        if (v && typeof v === 'object') collectLanguages(v);
      }
    }
  }

  const origFetch = window.fetch;
  window.fetch = function (...args) {
    const p = origFetch.apply(this, args);
    try {
      const url = String(args[0] || '');
      if (url.includes('/gql')) {
        p.then((res) => { res.clone().json().then(collectLanguages).catch(()=>{}); }).catch(()=>{});
      }
    } catch {}
    return p;
  };

  const OrigXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function PatchedXHR() {
    const xhr = new OrigXHR();
    let isGQL = false;
    const origOpen = xhr.open;
    xhr.open = function (method, url, ...rest) {
      isGQL = url && /\/gql(\?|$)/.test(String(url));
      return origOpen.call(this, method, url, ...rest);
    };
    xhr.addEventListener('load', function () {
      if (!isGQL) return;
      try {
        const ct = (xhr.getResponseHeader('content-type') || '').toLowerCase();
        if (!ct.includes('application/json')) return;
        collectLanguages(JSON.parse(xhr.responseText));
      } catch {}
    });
    return xhr;
  };

  const ANY_LINK_SELECTORS = [
    'a[data-a-target="preview-card-title-link"]',
    'a[data-a-target="preview-card-channel-link"]',
    'a[data-test-selector="preview-card-title-link"]',
    'a[data-test-selector="preview-card-channel-link"]',
    'a[data-test-selector="TitleAndChannel__titleLink"]',
    'a[data-test-selector="TitleAndChannel__channelLink"]',
  ].join(',');

  const CHANNEL_LINK_SELECTORS = [
    'a[data-a-target="preview-card-channel-link"]',
    'p[data-a-target="preview-card-channel-link"]',
    'a[data-test-selector="preview-card-channel-link"]',
    'a[data-test-selector="TitleAndChannel__channelLink"]',
    'p[data-test-selector="TitleAndChannel__channelLink"]',
  ].join(',');

  function getLoginFromLink(node) {
    const a = node.tagName === 'A' ? node : node.closest('a[href^="/"]');
    if (!a) return null;
    const href = a.getAttribute('href') || '';
    const m = href.match(/^\/([a-zA-Z0-9_]+)(?:\/|$)/);
    return m ? m[1].toLowerCase() : null;
  }

  function inferLanguageFromText(text) {
    if (!text) return null;
    const t = text.replace(/https?:\/\/\S+/g, '');
    if (/[ㄱ-ㅎ가-힣]/.test(t)) return 'KO';
    if (/[\u3040-\u309F]/.test(t) || /[\u30A0-\u30FF]/.test(t)) return 'JA';
    if (/[\u4E00-\u9FFF]/.test(t)) return 'ZH';
    if (/[\u0600-\u06FF]/.test(t)) return 'AR';
    if (/[\u0590-\u05FF]/.test(t)) return 'HE';
    if (/[\u0E00-\u0E7F]/.test(t)) return 'TH';
    if (/[\u0900-\u097F]/.test(t)) return 'HI';
    return null;
  }

  function inferLangFromCard(card) {
    try {
      const titled = card.querySelector('h4[title], h3[title], p[title]');
      const titleFromAttr = titled ? titled.getAttribute('title') : '';
      if (titleFromAttr) return inferLanguageFromText(titleFromAttr);

      const titleEl =
        card.querySelector('a[data-a-target="preview-card-title-link"]') ||
        card.querySelector('a[data-test-selector="preview-card-title-link"]') ||
        card.querySelector('[data-test-selector="TitleAndChannel__title"]');

      const title = titleEl ? titleEl.textContent : '';
      return inferLanguageFromText(title);
    } catch (_) {
      return null;
    }
  }

  function getCurrentLogin() {
    const m = location.pathname.match(/^\/([a-zA-Z0-9_]+)(?:\/|$)/);
    return m ? m[1].toLowerCase() : null;
  }

  function getInlineEl(mode) {
    const el = document.createElement('span');
    el.className = '__langChannelInline';
    el.style.marginLeft = '0.2rem';
    el.style.verticalAlign = 'middle';
    el.style.pointerEvents = 'none';
    el.style.fontWeight = '700';

    if (mode === 'badge') {
      el.style.padding = '2px 6px';
      el.style.borderRadius = '4px';
      el.style.fontSize = '12px';
      el.style.lineHeight = '16px';
      el.style.background = 'rgb(235,4,0)';
      el.style.color = '#fff';
    } else {
      el.style.whiteSpace = 'nowrap';
      el.style.opacity = '0.9';
      el.style.color = 'rgb(162,126,217)';
    }
    el.textContent = '[??]';
    return el;
  }

  function ensureChannelHeaderLang(root) {
    const section =
      root.querySelector('section#live-channel-stream-information') ||
      root.querySelector('section[id="live-channel-stream-information"]');
    if (!section) return;

    const h1 = section.querySelector('h1');
    if (!h1) return;

    const verifiedSvg = section.querySelector('svg[aria-label*="Verified" i]');
    const verifiedBox = verifiedSvg ? verifiedSvg.closest('[class]') : null;

    const nameLink = (h1.closest && h1.closest('a[href^="/"]')) || null;
    const ref = verifiedBox || nameLink;
    if (!ref || !ref.parentElement) return;

    const parent = ref.parentElement;
    let container = parent.querySelector(':scope > .__langChannelInline');

    const oldSpan = parent.querySelector(':scope > span.__langChannelInline');
    if (!container) {
      container = document.createElement('div');
      container.className = '__langChannelInline';
      parent.insertBefore(container, ref.nextSibling);

      if (oldSpan) {
        oldSpan.classList.remove('__langChannelInline');
        container.appendChild(oldSpan);
      } else {
        const inner = getInlineEl(VISUAL_MODE);
        inner.classList.remove('__langChannelInline');
        container.appendChild(inner);
      }
    } else {
      if (container.previousSibling !== ref || container.parentElement !== parent) {
        parent.insertBefore(container, ref.nextSibling);
      }
      if (!container.firstElementChild && !container.textContent.trim()) {
        const inner = getInlineEl(VISUAL_MODE);
        inner.classList.remove('__langChannelInline');
        container.appendChild(inner);
      }
    }

    const login = getCurrentLogin();
    const displayEl = container.firstElementChild || container;
    let code = login ? langByLogin.get(login) : null;
    if (!code && login) {
      const id = idByLogin.get(login);
      if (id) code = langById.get(id) || null;
    }
    displayEl.textContent = `[${code || '??'}]`;
  }

  function ensureRightSuffix(node, login) {
    const card = node.closest('article,[data-target="directory-first-item"]') || node;

    let row = node.parentElement || node;
    if (row && row.nextElementSibling && row.parentElement) {
      row = row.parentElement;
    }

    let badge = row.querySelector('.__langSuffixRight');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = '__langSuffixRight';
      badge.style.marginLeft = 'auto';
      badge.style.whiteSpace = 'nowrap';
      badge.style.fontWeight = '600';
      badge.style.opacity = '0.9';
      badge.style.order = '999';
      row.appendChild(badge);
    }
    badge.style.color = 'rgb(162,126,217)';
    badge.style.pointerEvents = 'none';

    let code = langByLogin.get(login);
    if (!code) {
      const h = inferLangFromCard(card);
      if (h) code = h;
    }
    badge.textContent = `[${code || '??'}]`;

    card.querySelectorAll('.__langSuffixRight').forEach((el) => {
      if (el !== badge && el.parentElement !== row) el.remove();
    });
  }

  function ensureBadge(a, login) {
    const article = a.closest('article') || a.closest('div[data-target="directory-first-item"]') || a.closest('div') || a;

    const thumb =
      article.querySelector('[data-a-target="preview-card-image-link"]') ||
      article.querySelector('[data-a-target="preview-card-thumbnail"]') ||
      article.querySelector('figure') ||
      article;

    const id = '__langBadge';
    if (getComputedStyle(thumb).position === 'static') thumb.style.position = 'relative';

    let el = thumb.querySelector(`.${id}`);
    if (!el) {
      el = document.createElement('div');
      el.className = id;
      el.style.position = 'absolute';
      el.style.top = '8px';
      el.style.right = '8px';
      el.style.padding = '2px 6px';
      el.style.borderRadius = '4px';
      el.style.fontSize = '12px';
      el.style.fontWeight = '700';
      el.style.lineHeight = '16px';
      el.style.background = 'rgb(235,4,0)';
      el.style.color = '#fff';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '3';
      el.textContent = '[??]';
      thumb.appendChild(el);
    }
    let code = langByLogin.get(login);
    if (!code) {
      const h = inferLangFromCard(article);
      if (h) code = h;
    }
    el.textContent = `[${code || '??'}]`;
  }

  function annotate(root = document) {
    ensureChannelHeaderLang(root);

    if (VISUAL_MODE === 'suffix') {
      let nodes = root.querySelectorAll(
        'p[data-a-target="preview-card-channel-link"], p[data-test-selector="TitleAndChannel__channelLink"]'
      );
      if (nodes.length === 0) {
        nodes = root.querySelectorAll(
          'a[data-a-target="preview-card-channel-link"], a[data-test-selector="preview-card-channel-link"], a[data-test-selector="TitleAndChannel__channelLink"]'
        );
      }
      nodes.forEach((n) => {
        const login = getLoginFromLink(n);
        if (!login) return;
        ensureRightSuffix(n, login);
      });
    } else {
      const links = root.querySelectorAll(ANY_LINK_SELECTORS);
      links.forEach((a) => {
        const login = getLoginFromLink(a);
        if (!login) return;
        ensureBadge(a, login);
      });
    }
  }

  let raf = null;
  function queueAnnotate() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => annotate(document));
  }

  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (!m.addedNodes || !m.addedNodes.length) continue;
      for (const n of m.addedNodes) if (n.nodeType === 1) annotate(n);
    }
  });

  function start() {
    try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch {}
    queueAnnotate();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
