// ==UserScript==
// @name            YouTube Shorts Sponsor Skipper
// @name:ko         유튜브 쇼츠 스폰서 스킵
// @name:ja         YouTube Shorts スポンサー スキップ
// @name:zh-CN      YouTube Shorts 赞助跳过
// @name:zh-TW      YouTube Shorts 贊助略過
// @name:es         Saltar Shorts Patrocinados de YouTube
// @name:fr         Ignorer les Shorts Sponsorisés YouTube
// @name:de         YouTube Shorts Sponsoren überspringen
// @name:it         Salta Shorts Sponsorizzati di YouTube
// @name:ru         Пропуск спонсорских Shorts на YouTube
//
// @description     Skip sponsored YouTube Shorts automatically.
// @description:ko  유튜브 쇼츠에서 스폰서(광고) 영상을 자동으로 건너뜁니다.
// @description:ja  スポンサー付きの YouTube Shorts を自動的にスキップします。
// @description:zh-CN  自动跳过 YouTube Shorts 中的赞助内容。
// @description:zh-TW  自動跳過 YouTube Shorts 中的贊助內容。
// @description:es  Omite automáticamente Shorts patrocinados en YouTube.
// @description:fr  Ignore automatiquement les Shorts sponsorisés sur YouTube.
// @description:de  Überspringt automatisch gesponserte YouTube Shorts.
// @description:it  Salta automaticamente gli Shorts sponsorizzati su YouTube.
// @description:ru  Автоматически пропускает спонсорские Shorts на YouTube.
//
// @namespace       yt-shorts-sponsor-skipper
// @version         1.0
// @match           https://www.youtube.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/561468/YouTube%20Shorts%20Sponsor%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/561468/YouTube%20Shorts%20Sponsor%20Skipper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SPONSOR_KEYWORDS = [
    '스폰서', '광고', '후원',
    'Sponsored', 'Sponsor', 'Ad', 'Advertisement', 'Paid promotion',
    'スポンサー', '広告', '提供',
    '赞助', '廣告', '广告',
    'Patrocinado', 'Publicidad', 'Anuncio',
    'Sponsorisé', 'Publicité',
    'Gesponsert', 'Werbung',
    'Sponsorizzato', 'Pubblicità',
    'Спонсор', 'Реклама'
  ];

  function isSponsored(text) {
    if (!text) return false;
    text = text.trim().toLowerCase();
    return SPONSOR_KEYWORDS.some(k => text.includes(k.toLowerCase()));
  }

  function skipShort(shortEl) {
    if (shortEl.__skipped) return;
    shortEl.__skipped = true;

    shortEl.style.opacity = '0';
    shortEl.style.pointerEvents = 'none';

    requestAnimationFrame(() => {
      const event = new WheelEvent('wheel', {
        deltaY: 1000,
        bubbles: true
      });
      document.dispatchEvent(event);
    });

    console.log('[YT Shorts] 스폰서 쇼츠 스킵');
  }

  function scan(root = document) {
    const badges = root.querySelectorAll('.yt-badge-shape__text');
    badges.forEach(badge => {
      if (isSponsored(badge.textContent)) {
        const short = badge.closest(
          '.reel-video-in-sequence-new.style-scope.ytd-shorts'
        );
        if (short) skipShort(short);
      }
    });
  }

  scan();

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) scan(node);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();