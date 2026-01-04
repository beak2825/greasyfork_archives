// ==UserScript==
// @name Genius Кнопка (RZT)
// @namespace https://risazatvorchestvo.com/
// @version 1.2
// @description Добавляет кнопку Текст песни в карточку трека на сайте РЗТ
// @author veryhighlibido
// @match *://*/*
// @grant GM_xmlhttpRequest
// @connect api.genius.com
// @downloadURL https://update.greasyfork.org/scripts/553853/Genius%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%28RZT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553853/Genius%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%28RZT%29.meta.js
// ==/UserScript==
(function () {
  const ACCESS_TOKEN = '83eyeIojILU55FgYHdrh3Dpb481M3B9_qSwIl3s05xbC7pI5qt3Ti1hPVPg_gtKS';
  const CHECK_INTERVAL = 100;
  const TARGET_CLASSES = [
    'whitespace-nowrap',
    'font-medium',
    'inline-flex',
    'items-center',
    'justify-center',
    'transition-colors',
    'duration-200',
    'cursor-pointer',
    'disabled:opacity-50',
    'h-10',
    'border',
    'border-input',
    'gap-1',
    'text-sm',
    'px-3',
    'rounded-full'
  ];
  function findTitleElement() {
    return [...document.querySelectorAll('div.font-extrabold')]
      .find(e => e.innerText.trim().length > 0);
  }
  function findArtistAliasElement(titleEl) {
    const flex = titleEl?.nextElementSibling?.querySelector('a span');
    return flex ? flex.innerText.trim() : null;
  }
  function createButton(url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = 'Текст песни';
    a.className =
      'whitespace-nowrap font-medium ring-offset-background focus-visible:outline-hidden ' +
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent ' +
      'hover:text-accent-foreground has-[>svg]:px-2.5 inline-flex items-center justify-center ' +
      'transition-colors duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 ' +
      'h-10 border border-input bg-[#212121] gap-1 text-sm px-3 opacity-100 rounded-full max-lg:mt-3 ' +
      'lg:ml-6 w-[150px] risa-genius-btn';
    return a;
  }
  function queryGenius(q, cb) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://api.genius.com/search?q=${encodeURIComponent(q)}`,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
      onload: resp => {
        try {
          const data = JSON.parse(resp.responseText);
          cb({ ok: true, data });
        } catch (e) {
          cb({ ok: false, error: e });
        }
      },
      onerror: err => cb({ ok: false, error: err })
    });
  }
  function findExactMatch(hits, title, artist) {
    title = title.toLowerCase().trim();
    artist = (artist || '').toLowerCase().trim();
    for (const hit of hits) {
      const t = (hit.result.title_with_featured || hit.result.title || '').toLowerCase();
      const a = (hit.result.primary_artist && hit.result.primary_artist.name || '').toLowerCase();
      if (t.includes(title) && (!artist || a.includes(artist))) {
        return hit.result.url;
      }
    }
    return null;
  }
  function findTargetButtonElement() {
    const escapedClasses = TARGET_CLASSES.map(cls => cls.replace(/:/g, '\\:'));
    const selector = '.' + escapedClasses.join('.');
    return document.querySelector(selector);
  }
  function insertButtonAfterTarget(btn) {
    const target = findTargetButtonElement();
    if (target && target.parentElement) {
      const next = target.nextElementSibling;
      if (next?.classList?.contains('risa-genius-btn')) return;
      target.insertAdjacentElement('afterend', btn);
      return true;
    }
    const titleEl = findTitleElement();
    if (titleEl && !titleEl.querySelector('.risa-genius-btn')) {
      titleEl.appendChild(btn);
      return true;
    }
    return false;
  }
  function runOnce() {
    const titleEl = findTitleElement();
    if (!titleEl) return false;
    if (document.querySelector('.risa-genius-btn')) return true;
    const title = titleEl.innerText.trim();
    const artist = findArtistAliasElement(titleEl);
    queryGenius(`${title} ${artist || ''}`, resp => {
      let url = 'https://genius.com/search?q=' + encodeURIComponent(`${title} ${artist || ''}`);
      if (resp?.ok && resp.data?.response?.hits?.length) {
        const hits = resp.data.response.hits;
        const exact = findExactMatch(hits, title, artist);
        url = exact || hits[0].result.url || url;
      }
      const btn = createButton(url);
      insertButtonAfterTarget(btn);
    });
    return true;
  }
  runOnce();
  const interval = setInterval(runOnce, CHECK_INTERVAL);
  const observer = new MutationObserver(runOnce);
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();