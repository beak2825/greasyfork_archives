// ==UserScript==
// @name         YouTube Full View Count and Upload Date (Rewrite)
// @name:es      Recuento total de visitas y fecha de subida en YouTube (reescritura)
// @name:fr      Nombre total de vues et date de mise en ligne sur YouTube (réécriture)
// @name:de      YouTube Vollständige Aufrufanzahl und Upload-Datum (Neufassung)
// @name:it      Numero totale di visualizzazioni e data di caricamento su YouTube (riscrittura)
// @name:pt      Contagem total de visualizações e data de carregamento no YouTube (reescrita)
// @name:ru      YouTube: полное количество просмотров и дата загрузки (переписано)
// @name:zh-CN   YouTube 完整观看次数与上传日期（改写版
// @name:ja      YouTube 総視聴回数とアップロード日 (改訂版)
// @name:ko      YouTube 전체 조회수 및 업로드 날짜 (재작성)
// @name:nl      YouTube Volledig aantal weergaven en uploaddatum (herschreven)
// @namespace    https://greasyfork.org/users/1514993-wewe
// @version      1.0
// @description  Displays full view count and upload date (Without time - On video pages only).
// @description:es Muestra el conteo completo de vistas y la fecha de carga (Sin hora - Solo en páginas de video).
// @description:fr Affiche le nombre complet de vues et la date de téléchargement (Sans heure - Sur les pages vidéo seulement).
// @description:de Zeigt die vollständige Aufrufanzahl und das Upload-Datum an (Ohne Uhrzeit - Nur auf Videoseiten).
// @description:it Visualizza il conteggio completo delle visualizzazioni e la data di caricamento (Senza orario - Solo sulle pagine video).
// @description:pt Exibe a contagem completa de visualizações e a data de upload (Sem hora - Apenas em páginas de vídeo).
// @description:ru Отображает полный счёт просмотров и дату загрузки (Без времени - Только на страницах видео).
// @description:zh-CN 显示完整查看次数和上传日期 (无时间 - 仅在视频页面).
// @description:ja 完全視聴回数とアップロード日を表示 (時間なし - ビデオページのみ).
// @description:ko 전체 조회수 및 업로드 날짜 표시 (시간 없음 - 비디오 페이지에서만).
// @description:nl Toont de volledige weergavetelling en upload-datum (Zonder tijd - Alleen op videopagina's).
// @author       ^wewe
// @match        http*://*.youtube.com/watch?v=*
// @run-at       document-start
// @grant        none
// @license      CC-BY-SA-4.0; https://creativecommons.org/licenses/by-sa/4.0/legalcode
// @copyright    2025 ^wewe
// @downloadURL https://update.greasyfork.org/scripts/550979/YouTube%20Full%20View%20Count%20and%20Upload%20Date%20%28Rewrite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550979/YouTube%20Full%20View%20Count%20and%20Upload%20Date%20%28Rewrite%29.meta.js
// ==/UserScript==
 
/*
THE SOFTWARE PROVIDES NO WARRANTY AND IS PROVIDED "AS IS." THE AUTHOR IS NOT LIABLE OR RESPONSIBLE FOR ANY DAMAGES ARISING FROM ITS USE.
*/
 
/*
Creative Commons Attribution-ShareAlike 4.0 International License
 
Copyright (c) 2025 by ^wewe
 
You are free to:
- Share: copy and redistribute the material in any medium or format
- Adapt: remix, transform, and build upon the material
 
Under the following terms:
- Attribution: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- ShareAlike: If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
- No additional restrictions: You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.
 
No warranties are given. The license does not grant trademark rights or permissions for publicity/privacy rights. The licensor is not liable for damages. Private use is explicitly permitted. When distributing, the source code (this userscript) must be included.
 
See the full license text at: https://creativecommons.org/licenses/by-sa/4.0/legalcode
*/

(function () {
  'use strict';

  // --- selectors to try ---
  const INFO_SELECTORS = [
    '#info-container #info',
    'ytd-video-primary-info-renderer #info-contents',
    'ytd-video-primary-info-renderer #info',
    '#info-contents',
    'ytd-video-primary-info-renderer'
  ];
  const TOOLTIP_SELECTORS = [
    'ytd-watch-info-text tp-yt-paper-tooltip',
    'ytd-video-primary-info-renderer tp-yt-paper-tooltip',
    'tp-yt-paper-tooltip'
  ];

  // state
  let lastInfoText = '';
  let lastInfoEl = null;
  let localObserversAttached = false;
  let infoObserver = null;
  let tooltipObserver = null;
  let containerObserver = null;
  let rootObserver = null;

  // language/label state
  let siteLang = (document.documentElement && document.documentElement.lang) || navigator.language || 'en';
  let localizedViews = null; // { unit: 'visualizaciones', order: 'after' } or null

  // throttle with RAF
  let rafScheduled = false;
  function scheduleProcess() {
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(() => {
        rafScheduled = false;
        ensureContainerObserver();
        process();
      });
    }
  }

  // helpers
  function queryFirst(selectors, root = document) {
    for (const s of selectors) {
      const found = root.querySelector(s);
      if (found) return found;
    }
    return null;
  }

  // Extract unit and order from a sample text like "1,234,567 views" or "visualizaciones 1.234.567"
  function extractUnitDetails(sample) {
    if (!sample || !sample.trim()) return null;
    const s = sample.trim();

    // try "number then unit" => after
    const after = s.match(/^[\s\u00A0]*([\d\.,\u202F\u2009\u200B\+\-]+)\s*(.+)$/);
    if (after && after[2]) {
      const unit = after[2].trim();
      if (unit) return { unit, order: 'after' };
    }

    // try "unit then number" => before
    const before = s.match(/^(.+?)\s*([\d\.,\u202F\u2009\u200B\+\-]+)[\s\u00A0]*$/);
    if (before && before[1]) {
      const unit = before[1].trim();
      if (unit) return { unit, order: 'before' };
    }

    // fallback: try to remove digits/separators and keep remainder
    const fallbackUnit = s.replace(/[\d\.,\s\u00A0\u202F\u2009\+\-]+/g, '').trim();
    if (fallbackUnit) return { unit: fallbackUnit, order: 'after' };

    return null;
  }

  // find localized views label from tooltip or info element
  function getLocalizedViewsLabel(infoEl, tooltipText) {
    // 1) from tooltip part if present (tooltipText expected like "1.234.567 visualizaciones")
    if (tooltipText) {
      const p = tooltipText.split('•').map(x => x.trim())[0];
      const det = extractUnitDetails(p);
      if (det) return det;
    }
    // 2) from infoEl count area
    try {
      const countText = (infoEl && (infoEl.querySelector('#count')?.textContent || infoEl.textContent)) || '';
      const candidate = countText.split('•')[0] || countText;
      const det = extractUnitDetails(candidate);
      if (det) return det;
    } catch (e) { /* ignore */ }

    return null;
  }

  // format functions use siteLang (explicit)
  function formatViewCount(view, locale) {
    const digits = String(view).replace(/[^\d]/g, '');
    const n = Number(digits);
    if (isNaN(n)) return String(view || '');
    try { return new Intl.NumberFormat(locale).format(n); } catch (e) { return String(n); }
  }

  function formatDateString(s, locale) {
    if (!s) return '';
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      try {
        return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) {
        return d.toLocaleDateString();
      }
    }
    return s;
  }

  // read JSON metadata (returns object with viewCount (string/number) and uploadDate (string) or null)
  function readFromJson() {
    try {
      let resp = window.ytInitialPlayerResponse;
      if (!resp && window.ytplayer && window.ytplayer.config && window.ytplayer.config.args && window.ytplayer.config.args.player_response) {
        try { resp = JSON.parse(window.ytplayer.config.args.player_response); } catch (e) { resp = null; }
      }
      if (resp) {
        const view = resp.videoDetails && (resp.videoDetails.viewCount || resp.videoDetails.view_count || resp.videoDetails.viewcount);
        const micro = resp.microformat && (resp.microformat.playerMicroformatRenderer || resp.microformat);
        const upload = micro && (micro.publishDate || micro.uploadDate || micro.publishTime || micro.uploadedAt || micro.datePublished);
        if (view || upload) return { viewCount: view, uploadDate: upload };
      }
    } catch (e) { /* ignore */ }

    // try JSON-LD
    try {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      for (const s of scripts) {
        try {
          const j = JSON.parse(s.textContent);
          const arr = Array.isArray(j) ? j : [j];
          for (const obj of arr) {
            if (!obj) continue;
            if (obj['@type'] === 'VideoObject' || obj.uploadDate || obj.interactionCount) {
              const view = obj.interactionCount || obj.interactioncount || obj.viewCount;
              const upload = obj.uploadDate || obj.datePublished || obj.uploadedAt;
              if (view || upload) return { viewCount: view, uploadDate: upload };
            }
          }
        } catch (e) { /* ignore parse errors */ }
      }
    } catch (e) { /* ignore */ }

    // try meta tags
    try {
      const metaView = document.querySelector('meta[itemprop="interactionCount"], meta[name="interactionCount"], meta[property="interactionCount"]');
      if (metaView && metaView.content) {
        const view = metaView.content;
        const metaDate = document.querySelector('meta[itemprop="datePublished"], meta[itemprop="uploadDate"], meta[property="og:video:release_date"]');
        const upload = metaDate && metaDate.content;
        return { viewCount: view, uploadDate: upload };
      }
    } catch (e) { /* ignore */ }

    return null;
  }

  // write view+date text into infoEl safely
  function applyPartsToInfo(infoEl, viewText, dateText) {
    if (!infoEl || (!viewText && !dateText)) return false;

    const vt = (viewText || '').trim();
    const dt = (dateText || '').trim();

    // common patterns
    const spans = infoEl.querySelectorAll('span');
    if (spans && spans.length >= 3) {
      const left = spans[0].textContent.trim();
      const right = spans[2].textContent.trim();
      if (left === vt && right === dt) { lastInfoText = infoEl.textContent.trim(); return false; }
      spans[0].textContent = vt;
      spans[2].textContent = dt;
      lastInfoText = infoEl.textContent.trim();
      return true;
    }

    // '#count' and '#info-strings'
    const countEl = document.querySelector('#count') || infoEl.querySelector('#count');
    const infoStrings = document.querySelector('#info-strings') || infoEl.querySelector('#info-strings');
    if (countEl && infoStrings) {
      const countFS = countEl.querySelector('yt-formatted-string') || countEl;
      const infoFS = infoStrings.querySelector('yt-formatted-string') || infoStrings;
      if (countFS && infoFS) {
        if (countFS.textContent.trim() !== vt || infoFS.textContent.trim() !== dt) {
          countFS.textContent = vt;
          infoFS.textContent = dt;
          lastInfoText = infoEl.textContent.trim();
          return true;
        }
        return false;
      }
    }

    // yt-formatted-string fallback
    const formatted = infoEl.querySelectorAll('yt-formatted-string');
    if (formatted && formatted.length >= 2) {
      if (formatted[0].textContent.trim() === vt && formatted[1].textContent.trim() === dt) { lastInfoText = infoEl.textContent.trim(); return false; }
      formatted[0].textContent = vt;
      formatted[1].textContent = dt;
      lastInfoText = infoEl.textContent.trim();
      return true;
    }

    // last resort: join with bullet
    try {
      const combined = (vt && dt) ? `${vt} • ${dt}` : (vt || dt || '');
      infoEl.textContent = combined;
      lastInfoText = infoEl.textContent.trim();
      return true;
    } catch (e) { /* ignore */ }

    return false;
  }

  // main processing
  function process() {
    // update siteLang from html lang if changed
    siteLang = (document.documentElement && document.documentElement.lang) || siteLang;

    const infoEl = queryFirst(INFO_SELECTORS);
    if (!infoEl) {
      lastInfoEl = null;
      return;
    }

    // if replaced, detach old observers and reset lastInfoText so we always reapply
    if (infoEl !== lastInfoEl) {
      detachLocalObservers();
      lastInfoEl = infoEl;
      lastInfoText = '';
    }

    // read tooltip text if present
    const tooltipEl = queryFirst(TOOLTIP_SELECTORS) || infoEl.querySelector('tp-yt-paper-tooltip');
    const tooltipText = tooltipEl ? (tooltipEl.textContent || tooltipEl.getAttribute('title') || '') : '';

    // try tooltip first (localized)
    let viewText = null, dateText = null;

    if (tooltipText && tooltipText.trim()) {
      const parts = tooltipText.split('•').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        viewText = parts[0];
        dateText = parts[1];
        // capture localized unit + order for fallback use later
        const det = extractUnitDetails(parts[0]);
        if (det) localizedViews = det;
      }
    }

    // if tooltip not usable, fallback to JSON/metadata and build localized strings
    if (!viewText || !dateText) {
      const j = readFromJson();
      if (j) {
        // ensure we have localizedViews; try to capture from page if not set
        if (!localizedViews) {
          localizedViews = getLocalizedViewsLabel(infoEl, tooltipText);
        }

        if (j.viewCount) {
          const formatted = formatViewCount(j.viewCount, siteLang);
          if (localizedViews && localizedViews.unit) {
            viewText = (localizedViews.order === 'before') ? `${localizedViews.unit} ${formatted}` : `${formatted} ${localizedViews.unit}`;
          } else {
            // last-resort English label (should be rare; we tried to capture UI label already)
            viewText = `${formatted} views`;
          }
        }

        if (j.uploadDate) {
          dateText = formatDateString(j.uploadDate, siteLang);
        }
      }
    }

    if (!viewText && !dateText) return;

    applyPartsToInfo(infoEl, viewText, dateText);

    // attach local observers for the small nodes
    if (!localObserversAttached) {
      attachLocalObservers(infoEl, tooltipEl);
    }
  }

  // attach observers
  function attachLocalObservers(infoEl, tooltipEl) {
    detachLocalObservers();
    try {
      infoObserver = new MutationObserver(scheduleProcess);
      infoObserver.observe(infoEl, { childList: true, subtree: true, characterData: true });

      if (tooltipEl) {
        tooltipObserver = new MutationObserver(scheduleProcess);
        tooltipObserver.observe(tooltipEl, { childList: true, subtree: true, characterData: true });
      }

      localObserversAttached = true;
    } catch (e) {
      localObserversAttached = false;
    }
  }

  function detachLocalObservers() {
    if (infoObserver) { try { infoObserver.disconnect(); } catch (e) {} infoObserver = null; }
    if (tooltipObserver) { try { tooltipObserver.disconnect(); } catch (e) {} tooltipObserver = null; }
    localObserversAttached = false;
  }

  // ensure a small container observer watches for replacements (e.g. More/Show less)
  function ensureContainerObserver() {
    if (containerObserver) return;
    const container = document.querySelector('ytd-video-primary-info-renderer') || document.querySelector('#primary') || document.documentElement;
    if (container) {
      try {
        containerObserver = new MutationObserver(scheduleProcess);
        containerObserver.observe(container, { childList: true, subtree: true });
        // we can create a rootObserver placeholder disconnected; it's not needed once containerObserver exists
        if (rootObserver) try { rootObserver.disconnect(); } catch (e) {}
      } catch (e) { /* ignore */ }
    }
  }

  // monitor html[lang] changes (if user changes UI language without full reload)
  const htmlAttrObserver = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.attributeName === 'lang') {
        siteLang = (document.documentElement && document.documentElement.lang) || navigator.language || siteLang;
        localizedViews = null; // recapture in next pass
        scheduleProcess();
      }
    }
  });
  try { htmlAttrObserver.observe(document.documentElement || document.body, { attributes: true }); } catch (e) { /* ignore */ }

  // initial start
  function start() {
    // global observer until we find container
    try {
      rootObserver = new MutationObserver(scheduleProcess);
      rootObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });
    } catch (e) { /* ignore */ }

    // react to YouTube SPA events
    window.addEventListener('yt-navigate-finish', () => { lastInfoText = ''; lastInfoEl = null; localizedViews = null; scheduleProcess(); }, { passive: true });
    window.addEventListener('yt-page-data-updated', () => { lastInfoText = ''; lastInfoEl = null; localizedViews = null; scheduleProcess(); }, { passive: true });

    scheduleProcess();
  }

  start();

})();