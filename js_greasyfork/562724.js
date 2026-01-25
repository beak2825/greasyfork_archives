// ==UserScript==
// @name         Comick Reading Sites Links+ (Auto Jump & Cache)
// @namespace    https://greasyfork.org/users/1470715
// @version      2.4.5
// @description  Shows alternative manga/manhwa reading sites with auto chapter jump, cached results, and custom search keywords for accurate cross-site matching.
// @author       cattishly6060
// @author       ak,shh
// @match        https://comick.dev/*
// @match        https://mangafire.to/
// @match        https://mangafire.to/filter*
// @match        https://mangaball.net/search-advanced/
// @match        https://comix.to/browser*
// @match        https://comix.to/api/v2/manga/*
// @match        https://mangadex.org/search*
// @match        https://api.mangadex.org/chapter*
// @match        https://weebcentral.com/search*
// @match        https://weebcentral.com/series/*/full-chapter-list*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=comick.dev
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @run-at       document-end
// @compatible   android
// @downloadURL https://update.greasyfork.org/scripts/562724/Comick%20Reading%20Sites%20Links%2B%20%28Auto%20Jump%20%20Cache%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562724/Comick%20Reading%20Sites%20Links%2B%20%28Auto%20Jump%20%20Cache%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**********************************************************
   * Config
   **********************************************************/
  const DEBUG = false;
  const BTN_ID = 'alt-sites-btn';
  const INIT_DELAY = 300;
  const MAX_RETRIES = 3;

  let initScheduled = false;

  const log = (...a) => DEBUG && console.log('-- [Comick-Linker]', ...a);

  /**********************************************************
   * Constants
   **********************************************************/
  class _Common {
    /** for storing search data */
    static getDataKey = (prefix, searchQuery) => `${prefix}_search:${searchQuery}`;
    static getSearchQuery = (dataKey) => dataKey?.replace(/^[^:]+:/, '');
    /** for storing manga ID */
    static getMangaIDKey = (prefix, searchQuery) => `${prefix}_mangaId_by_query:${searchQuery}`;
    /** for storing manga ID using data key */
    static getMangaIDKeyByDataKey = (prefix, dataKey) => `${prefix}_mangaId_by_query:${this.getSearchQuery(dataKey)}`;
    /** for storing chapter IDs */
    static getChapterIDKey = (prefix, mangaId, chapterNum) => `${prefix}_chapter_id:${mangaId}:${chapterNum}`;
    /** for storing cached manga ID */
    static getCachedMangaIDKey = (prefix, comickMangaId) => `comick:${prefix}:${comickMangaId}`;
  }

  class Comix {
    static name = () => "Comix";
    static #prefix = "comix";

    static getDataKey = (searchQuery) => _Common.getDataKey(this.#prefix, searchQuery);
    static getSearchQuery = (dataKey) => _Common.getSearchQuery(dataKey);
    static getMangaIDKey = (searchQuery) => _Common.getMangaIDKey(this.#prefix, searchQuery);
    static getMangaIDKeyByDataKey = (dataKey) => _Common.getMangaIDKeyByDataKey(this.#prefix, dataKey);
    static getCachedMangaIdKey = (comickMangaId) => _Common.getCachedMangaIDKey(this.#prefix, comickMangaId);

    static getSearchUrl = (query) =>
      `https://comix.to/browser?keyword=${query}&order=relevance:desc`;
    static getChapterListUrl = (mangaId, chapterNum = null) =>
      chapterNum == null
        ? `https://comix.to/api/v2/manga/${mangaId}/chapters?limit=20&page=1&order[number]=asc`
        : `https://comix.to/api/v2/manga/${mangaId}/chapters?number=${chapterNum}&limit=20&page=1&order[number]=asc`;
    static getCustomIconUrl = () =>
      'https://static.everythingmoe.com/icons/comix.png';
    static getMangaUrl = (mangaId) =>
      `https://comix.to/title/${mangaId}`;
    static getChapterUrl = (titleSlugOrMangaId, chapterId, chapterNum = null) =>
      chapterNum == null
        ? `https://comix.to/title/${titleSlugOrMangaId}/${chapterId}`
        : `https://comix.to/title/${titleSlugOrMangaId}/${chapterId}-chapter-${chapterNum}`;
  }

  class MangaFire {
    static name = () => "MangaFire";
    static #prefix = "mangafire";

    static getDataKey = (searchQuery) => _Common.getDataKey(this.#prefix, searchQuery);
    static getSearchQuery = (dataKey) => _Common.getSearchQuery(dataKey);
    static getMangaIDKey = (searchQuery) => _Common.getMangaIDKey(this.#prefix, searchQuery);
    static getMangaIDKeyByDataKey = (dataKey) => _Common.getMangaIDKeyByDataKey(this.#prefix, dataKey);
    static getCachedMangaIdKey = (comickMangaId) => _Common.getCachedMangaIDKey(this.#prefix, comickMangaId);

    static getSearchUrl = (query) =>
      `https://mangafire.to/#search:${query}`;
    static getChapterUrl = (mangaId, chapterNum) =>
      `https://mangafire.to/read/${mangaId}/en/chapter-${chapterNum}`;
  }

  class MangaDex {
    static name = () => "MangaDex";
    static #prefix = "mangadex";

    static getDataKey = (searchQuery) => _Common.getDataKey(this.#prefix, searchQuery);
    static getSearchQuery = (dataKey) => _Common.getSearchQuery(dataKey);
    static getMangaIDKey = (searchQuery) => _Common.getMangaIDKey(this.#prefix, searchQuery);
    static getMangaIDKeyByDataKey = (dataKey) => _Common.getMangaIDKeyByDataKey(this.#prefix, dataKey);
    static getCachedMangaIdKey = (comickMangaId) => _Common.getCachedMangaIDKey(this.#prefix, comickMangaId);

    static getSearchUrl = (query) =>
      `https://mangadex.org/search?q=${query}`;
    static getChapterSearchUrl = (mangaId, chapterNum) =>
      `https://api.mangadex.org/chapter?limit=100&includes[]=scanlation_group&includes[]=user&chapter=${chapterNum}&manga=${mangaId}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`;
    static getMangaUrl = (mangaId) =>
      `https://mangadex.org/title/${mangaId}`;
    static getChapterUrl = (chapterId) =>
      `https://mangadex.org/chapter/${chapterId}`;
  }

  class WeebCentral {
    static name = () => "WeebCentral";
    static #prefix = "weebcentral";

    static getDataKey = (searchQuery) => _Common.getDataKey(this.#prefix, searchQuery);
    static getSearchQuery = (dataKey) => _Common.getSearchQuery(dataKey);
    static getMangaIDKey = (searchQuery) => _Common.getMangaIDKey(this.#prefix, searchQuery);
    static getMangaIDKeyByDataKey = (dataKey) => _Common.getMangaIDKeyByDataKey(this.#prefix, dataKey);
    static getChapterIDKey = (mangaId, chapterNum) => _Common.getChapterIDKey(this.#prefix, mangaId, chapterNum);
    static getCachedMangaIdKey = (comickMangaId) => _Common.getCachedMangaIDKey(this.#prefix, comickMangaId);

    static getSearchUrl = (query) =>
      `https://weebcentral.com/search?text=${query}`;
    static getChapterSearchUrl = (mangaId, chapterNum) =>
      `https://weebcentral.com/series/${mangaId}/full-chapter-list#${chapterNum}`;
    static getChapterListUrl = (mangaId) =>
      `https://weebcentral.com/series/${mangaId}/full-chapter-list`;
    static getMangaUrl = (mangaId) =>
      `https://weebcentral.com/series/${mangaId}`;
    static getChapterUrl = (chapterId) =>
      `https://weebcentral.com/chapters/${chapterId}`;
  }

  class MangaKatana {
    static name = () => "MangaKatana";

    static getSearchUrl = (query) =>
      `https://mangakatana.com/?search=${query}&search_by=book_name`;
  }

  class MangaTaro {
    static name = () => "MangaTaro";

    static getSearchUrl = (query) =>
      `https://mangataro.org/?s=${query}`;
  }

  class Atsu {
    static name = () => "Atsu";

    static getSearchUrl = (query) =>
      `https://atsu.moe/search?query=${query}`;
  }

  class MangaBall {
    static name = () => "MangaBall";

    static getSearchUrl = (query) =>
      `https://mangaball.net/search-advanced/#search:${query}`;
  }

  class MangaBuddy {
    static name = () => "MangaBuddy";

    static getSearchUrl = (query) =>
      `https://mangabuddy.com/search?q=${query}`;
  }

  class Mangago {
    static name = () => "Mangago";

    static getSearchUrl = (query) =>
      `https://www.mangago.me/r/l_search/?name=${query}`;
  }

  class VyManga {
    static name = () => "VyManga";

    static getSearchUrl = (query) =>
      `https://vymanga.com/search?q=${query}`;
  }

  /**********************************************************
   * Auto search and jump handler
   **********************************************************/

  // for mangafire auto search handler
  if (location.host.startsWith('mangafire')) {
    if (location.pathname === '/'
      && location.hash.startsWith('#search:')) {
      const input = document.querySelector("input[name='keyword']");
      if (input) {
        // Create spinner overlay
        createSpinnerOverlay();

        // do query search
        const query = location.hash.replace(/^#search:/, "");
        input.value = decodeURIComponent(query);
        input.dispatchEvent(new Event("change", {bubbles: true}));
        input.parentElement?.requestSubmit();
      }
    } else if (location.pathname === '/filter') {
      const removeSpinner = createSpinnerOverlay();
      const url = new URL(location.href);
      const keyword = url.searchParams.get('keyword');
      const dataKey = MangaFire.getDataKey(keyword);
      const d = getWithTTL(dataKey);
      if (!d) {
        removeSpinner();
        return;
      }
      try {
        const chapterNum = d.shift();
        const titleSet = new Set(d.map(e => e.toLowerCase().trim()));
        const items = document.querySelectorAll('main .container div[class^="unit item-"]');
        if (!items?.length) {
          removeSpinner();
          return;
        }
        for (const item of items) {
          const e = item.querySelector('.info a');
          let title = e?.textContent?.toLowerCase()?.trim() || "";
          title = normalizeTitle(title);
          if (!titleSet.has(title)) {
            continue;
          }
          const url = new URL(e.href);
          const mangaId = url.pathname.split('/')[2]; // titleSlug
          if (!mangaId) {
            removeSpinner();
            return;
          }
          const chapterUrl = MangaFire.getChapterUrl(mangaId, chapterNum);
          const mangaIdKey = MangaFire.getMangaIDKey(keyword);
          setWithTTL(mangaIdKey, mangaId, Infinity); // TODO: async
          window.location.assign(chapterUrl);
          return;
        }
        removeSpinner();
      } catch (err) {
        log('[mangafire] error:', err); // todo log
      }
    }
    return;
  }

  // for mangaball auto search handler
  if (location.host.startsWith('mangaball')) {
    if (!location.hash.startsWith('#search:')) {
      return;
    }
    const input = document.querySelector("input#mainSearch");
    if (input) {
      // do query search
      const query = location.hash.replace(/^#search:/, "");
      input.value = decodeURIComponent(query);
      input.dispatchEvent(new Event("change", {bubbles: true}));
      input.parentElement?.requestSubmit();
    }
    return;
  }

  // for comix auto search and jump handler
  if (location.host.startsWith('comix')
    && location.pathname.startsWith('/browser')) {
    const keyword = new URL(location.href).searchParams.get("keyword");
    const dataKey = Comix.getDataKey(keyword);
    const d = getWithTTL(dataKey);
    if (!d) return;

    const chapterNum = d.shift();
    const titleSet = new Set(d.map(e => e.toLowerCase().trim()));
    const mangaIdKey = Comix.getMangaIDKey(keyword);
    const removeSpinner = createSpinnerOverlay();

    const checkIntervalMs = 300;
    const timeoutMs = 30_000;
    const timeoutTimestamp = Date.now() + timeoutMs;
    let timeout = setTimeout(async function check() {
      try {
        const items = document.querySelectorAll('#wrapper main .container .item');
        if (Date.now() > timeoutTimestamp) {
          removeSpinner();
          return;
        }
        if (!items?.length) {
          timeout = setTimeout(check, checkIntervalMs);
          return;
        }

        for (const item of items) {
          const e = item.querySelector('.title');
          if (!e) {
            continue;
          }
          let title = e.textContent?.toLowerCase()?.trim() || "";
          title = normalizeTitle(title);
          if (!titleSet.has(title)) {
            continue;
          }
          const url = new URL(e.href);
          const [, titlePath] = url.pathname.split("/").filter(Boolean);
          const mangaId = titlePath.split('-')[0];
          if (!mangaId) {
            removeSpinner();
            return;
          }
          const endpoint = chapterNum < 1
            ? Comix.getChapterListUrl(mangaId)
            : Comix.getChapterListUrl(mangaId, chapterNum);
          const res = await fetch(endpoint);
          if (!res?.ok) {
            removeSpinner();
            return;
          }
          const data = await res.json();
          let chapter = data?.result?.items?.find(e => e.number === chapterNum);
          if (!chapter && chapterNum < 1) {
            chapter = data?.result?.items?.[0];
          }
          if (!chapter) {
            const mangaUrl = Comix.getMangaUrl(mangaId);
            window.location.assign(mangaUrl);
            await setWithTTL(mangaIdKey, mangaId, Infinity);
            return;
          }
          const chapterUrl = Comix.getChapterUrl(titlePath, chapter.chapter_id, chapterNum);
          window.location.assign(chapterUrl);
          await setWithTTL(mangaIdKey, mangaId, Infinity);
          return;
        }
        removeSpinner();
      } catch (err) {
        log('[comix] error:', err); // TODO
        removeSpinner();
      }
    }, checkIntervalMs);
    return;
  }

  // for comix direct jumper
  if (location.host.startsWith('comix')
    && location.pathname.startsWith('/api/v2/manga/')) {
    document.documentElement.style.visibility = 'hidden';
    const d = document.body.textContent?.trim();
    document.body.innerHTML = '';
    const removeSpinner = createSpinnerOverlay();
    document.documentElement.style.visibility = 'visible';
    log('[comix] [jumper] textContent:', d); // TODO
    try {
      const data = JSON.parse(d);
      const url = new URL(location.href);
      const mangaId = url.pathname.split('/').filter(Boolean)[3];
      const chapterNum = parseFloat(url.searchParams.get('number')) || null;
      const chapter = chapterNum != null
        ? data?.result?.items?.find(e => e.number === chapterNum)
        : data?.result?.items?.[0];
      if (!chapter) {
        const mangaUrl = Comix.getMangaUrl(mangaId);
        window.location.assign(mangaUrl);
        return;
      }
      const chapterUrl = Comix.getChapterUrl(mangaId, chapter.chapter_id);
      log('[comix] data', {chapterUrl, data, url, mangaId, chapterNum}); // TODO
      window.location.assign(chapterUrl);
    } catch (err) {
      log('[comix] [jumper] error:', err, location.href);
      removeSpinner();
    }
    return;
  }

  // for mangadex auto search and jump
  if (location.host.startsWith('mangadex')
    && location.pathname.startsWith('/search')) {
    const removeSpinner = createSpinnerOverlay();
    const url = new URL(location.href);
    const keyword = url.searchParams.get('q');
    const dataKey = MangaDex.getDataKey(keyword);
    const d = getWithTTL(dataKey);
    log('[mangadex] d:', {d, dataKey, keyword}); // TODO
    if (!d) {
      removeSpinner();
      return;
    }
    const chapterNum = d.shift();
    const titleSet = new Set(d.map(e => e.toLowerCase().trim()));
    const mangaIdKey = MangaDex.getMangaIDKey(keyword);
    const checkIntervalMs = 300;
    const timeoutMs = 30_000;
    const timeoutTimestamp = Date.now() + timeoutMs;
    let timeout = setTimeout(async function check() {
      try {
        const items = document.querySelectorAll('#__nuxt a.manga-card-dense[href^="/title/"]');
        if (Date.now() > timeoutTimestamp) {
          removeSpinner();
          return;
        }
        if (!items?.length) {
          timeout = setTimeout(check, checkIntervalMs);
          return;
        }
        for (const item of items) {
          const e = item.querySelector('a.title');
          let title = normalizeTitle(e?.textContent || "");
          log('[mangadex] title:', [title, titleSet.has(title), Array.from(titleSet)]); // TODO
          if (!titleSet.has(title)) {
            continue;
          }
          const url = new URL(e.href);
          const mangaId = url.pathname.split('/')[2];
          log('[mangadex] mangaId:', mangaId); // TODO
          if (!mangaId) {
            removeSpinner();
            return;
          }
          const endpoint = MangaDex.getChapterSearchUrl(mangaId, chapterNum);
          const res = await fetch(endpoint);
          const jumpToMangaPage = async () => {
            const mangaUrl = MangaDex.getMangaUrl(mangaId);
            await setWithTTL(mangaIdKey, mangaId, Infinity);
            window.location.assign(mangaUrl);
          };
          if (!res?.ok) {
            await jumpToMangaPage();
            return;
          }
          const json = await res.json();
          const chapter = json?.data?.find(e => e?.type === "chapter" && e?.attributes?.translatedLanguage === "en");
          if (!chapter?.id) {
            await jumpToMangaPage();
            return;
          }
          const chapterUrl = MangaDex.getChapterUrl(chapter.id);
          await setWithTTL(mangaIdKey, mangaId, Infinity);
          window.location.assign(chapterUrl);
          return;
        }
        removeSpinner();
      } catch (err) {
        log('[mangadex] error:', err); // todo log
      }
    }, checkIntervalMs);
    return;
  }

  // for mangadex direct jumper
  if (location.host.startsWith('api.mangadex')
    && location.pathname.startsWith('/chapter')) {
    document.documentElement.style.visibility = 'hidden';
    const d = document.body.textContent?.trim();
    document.body.innerHTML = '';
    const removeSpinner = createSpinnerOverlay();
    document.documentElement.style.visibility = 'visible';
    log('[mangadex] [jumper] textContent:', d); // TODO

    const url = new URL(location.href);
    const mangaId = url.searchParams.get("manga");
    if (!mangaId) {
      removeSpinner();
      return;
    }
    const jumpToMangaPage = () => {
      const mangaUrl = MangaDex.getMangaUrl(mangaId);
      window.location.assign(mangaUrl);
    };

    try {
      const chapter = JSON.parse(d)?.data
        ?.find(e => e?.type === "chapter" && e?.attributes?.translatedLanguage === "en");
      if (!chapter?.id) {
        jumpToMangaPage();
        return;
      }
      const chapterUrl = MangaDex.getChapterUrl(chapter.id);
      window.location.assign(chapterUrl);
      return;

    } catch (err) {
      log('[mangadex] [jumper] error:', err, location.href);
      removeSpinner();
    }
    return;
  }

  // for weebcentral auto select + jump
  if (location.host.startsWith('weebcentral')
    && location.pathname.startsWith('/search')) {
    const url = new URL(location.href);
    const keyword = url.searchParams.get('text');
    const dataKey = WeebCentral.getDataKey(keyword);
    const d = getWithTTL(dataKey);
    log('[weebcentral] d:', {d, dataKey, keyword}); // TODO
    if (!d) {
      return;
    }
    const chapterNum = d.shift();
    const titleSet = new Set(d.map(e => e.toLowerCase().trim()));
    const mangaIdKey = WeebCentral.getMangaIDKey(keyword);

    let removeSpinner = () => {
    };
    let isSpinnerActive = false;

    const checkIntervalMs = 300;
    const timeoutMs = 30_000;
    const timeoutTimestamp = Date.now() + timeoutMs;
    let timeout = setTimeout(async function check() {
      try {
        if (!isSpinnerActive) {
          const searchForm = document.querySelector('#advanced-search-form');
          if (searchForm) {
            removeSpinner = createSpinnerOverlay();
            isSpinnerActive = true;
          }
        }
        const items = document.querySelectorAll('#search-results > article span[data-tip] a');
        const isError = !!document.querySelector('#search-results div[role="alert"] span');
        if (isError) {
          removeSpinner();
          return;
        }
        if (Date.now() > timeoutTimestamp) {
          removeSpinner();
          return;
        }
        if (!items?.length) {
          timeout = setTimeout(check, checkIntervalMs);
          return;
        }
        for (const item of items) {
          const title = normalizeTitle(item.textContent.trim());
          log('[weebcentral] title:', [title, titleSet.has(title), Array.from(titleSet)]); // TODO
          if (!titleSet.has(title)) {
            continue;
          }
          const url = new URL(item.href);
          const mangaId = url.pathname.split('/')[2];
          log('[weebcentral] mangaId:', {url, mangaId, item}); // TODO
          if (!mangaId) {
            removeSpinner();
            return;
          }
          const jumpToMangaPage = async () => {
            const mangaUrl = WeebCentral.getMangaUrl(mangaId);
            await setWithTTL(mangaIdKey, mangaId, Infinity);
            window.location.assign(mangaUrl);
          };
          const endpoint = WeebCentral.getChapterListUrl(mangaId);
          const res = await fetch(endpoint);
          if (!res?.ok) {
            await jumpToMangaPage();
            return;
          }
          const rawHtml = await res.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(rawHtml, "text/html");
          const chapters = [...(doc.querySelectorAll('body > div[x-data] a') || [])]
            .map(e => {
              const numberStr = e.querySelector('span.grow span[class=""]')
                ?.textContent
                ?.replace(/^\D+/i, '');
              const number = parseFloat(numberStr) || 0;
              const id = e.href.split('/').pop();
              return {id, number};
            }).filter(e => e.id);
          const chapter = chapters.find(e => e.number === chapterNum);
          for (const c of chapters) {
            if (!c?.id) continue;
            const chapterIdKey = WeebCentral.getChapterIDKey(mangaId, c.number);
            await setWithTTL(chapterIdKey, c.id, Infinity);
          }
          if (!chapters?.length || !chapter?.id) {
            await jumpToMangaPage();
            return;
          }
          const chapterUrl = WeebCentral.getChapterUrl(chapter.id);
          await setWithTTL(mangaIdKey, mangaId, Infinity);
          window.location.assign(chapterUrl);
          return;
        }
        removeSpinner();
      } catch (err) {
        log('[weebcentral] error', err); // todo log
        removeSpinner();
      }
    }, checkIntervalMs);
    return;
  }

  // for weebcentral direct jumper
  if (location.host.startsWith('weebcentral')
    && /^\/series\/[^\/]+\/full-chapter-list$/i.test(location.pathname)
    && /^#\d+/.test(location.hash)) {
    document.documentElement.style.visibility = 'hidden';
    const chapterNum = parseFloat(location.hash.slice(1));
    let chapters = [...(document.querySelectorAll('body > div[x-data] a') || [])];
    document.body.innerHTML = '';
    createSpinnerOverlay();
    chapters = chapters
      .map(e => {
        const numberStr = e.querySelector('span.grow span[class=""]')
          ?.textContent
          ?.replace(/^\D+/i, '');
        const number = parseFloat(numberStr) || 0;
        const id = e.href.split('/').pop();
        return {id, number};
      }).filter(e => e.id);
    document.documentElement.style.visibility = 'visible';

    const mangaId = location.pathname.split('/')[2];
    const chapter = chapters.find(e => e.number === chapterNum);
    log('[weebcentral] chapter:', {chapters, chapter, mangaId}); // TODO
    for (const c of chapters) {
      if (!c?.id) continue;
      const chapterIdKey = WeebCentral.getChapterIDKey(mangaId, c.number);
      setWithTTL(chapterIdKey, c.id, Infinity);
    }
    const jumpToMangaPage = async () => {
      const mangaUrl = WeebCentral.getMangaUrl(mangaId);
      window.location.assign(mangaUrl);
    };
    if (!chapters?.length || !chapter?.id) {
      jumpToMangaPage();
      return;
    }
    const chapterUrl = WeebCentral.getChapterUrl(chapter.id);
    window.location.assign(chapterUrl);
    return;
  }

  /**********************************************************
   * Utils
   **********************************************************/

  /**
   * Global page state/hook
   */
  const initialNextData = JSON.parse(document.querySelector('script[id="__NEXT_DATA__"]')?.innerHTML || "{}");
  let currNextPageProps = initialNextData?.props?.pageProps;
  const latestPagePropsLogs = []; // [urlRaw, url, pageProps]
  const maxPagePropsLogs = 100;
  let currUrl = new URL(location.href);
  const _buildId = initialNextData?.buildId || "";

  log({initialNextData, currNextPageProps, currUrl}); // TODO
  log('buildId:', _buildId); // TODO
  inferTitle(); // TODO

  /**
   * @param {string} slugPath
   * @param {?string} [chapterPath=null]
   * @returns {Object|void}
   */
  function getComicProps(slugPath, chapterPath = null) {
    if (!slugPath) return;
    const path = chapterPath
      ? `/_next/data/${_buildId}/comic/${slugPath}/${chapterPath}.json`
      : `/_next/data/${_buildId}/comic/${slugPath}.json`;
    return latestPagePropsLogs.find(e => e[1].pathname === path)?.[2];
  }

  /** @returns {?{title: string, lang: string}[]} */
  function getMangaTitles() {
    return currNextPageProps?.filteredTitles;
  }

  /**
   * @param {string} [lang="en"]
   * @returns {?string}
   */
  function getMangaTitleByLang(lang = 'en') {
    const titles = getMangaTitles();
    if (!titles?.length) return null;
    lang = lang.toLowerCase();
    return titles.find(e => e?.lang?.toLowerCase() === lang)?.title;
  }

  /**
   * Returns localized title strings.
   * (for search query)
   * @returns {{
   *   fallbackTitle: string,
   *   englishTitle: string,
   *   japanRomanTitle: string,
   *   japanRomanTitle_Manual: string
   * }}
   */
  function inferTitle() {
    const fallbackTitle = currNextPageProps?.chapter?.md_comics?.title
      || currNextPageProps?.comic?.title;
    const englishTitle = currNextPageProps?.englishTitle
      || getMangaTitleByLang('en');
    const japanRomanTitle = getMangaTitleByLang('ja-ro');

    let japanRomanTitle_Manual;
    if (englishTitle
      && englishTitle !== fallbackTitle) {
      japanRomanTitle_Manual = fallbackTitle;
      log('[inferTitle] fb 1'); // TODO
    } else if (japanRomanTitle && japanRomanTitle === fallbackTitle) {
      japanRomanTitle_Manual = fallbackTitle;
      log('[inferTitle] fb 2'); // TODO
    }
    const res = {
      fallbackTitle,
      englishTitle, // EN
      japanRomanTitle,
      japanRomanTitle_Manual // JP
    };
    log('[inferTitle] res:', res); // TODO
    return res;
  }

  function getFavicon(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  }

  /** @returns {number} */
  function getChapterNumber() {
    let chapterStr = "1";
    if (currNextPageProps?.chapter) {
      chapterStr = currNextPageProps.chapter.chap || "0";
    } else if (currNextPageProps?.firstChapters?.length) {
      chapterStr = currNextPageProps.firstChapters?.[0]?.chap || "0";
    }
    return chapterStr != null
      ? parseFloat(chapterStr)
      : 1;
  }

  /** @returns {?string|void} */
  function getComickMangaID() {
    if (!currUrl.pathname.startsWith('/comic/')) return;
    return currUrl.pathname.split('/').filter(Boolean)[1];
  }

  /** @returns {?string|void} */
  function getComickChapterID() {
    if (!currUrl.pathname.startsWith('/comic/')) return;
    return currUrl.pathname.split('/').filter(Boolean)[2];
  }

  /**********************************************************
   * Popup
   **********************************************************/
  function createPopup() {
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const isDark = document.documentElement.classList.contains('dark')
      || document.body.classList.contains('dark');

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,.7);
      z-index:10000; display:flex;
      align-items:${isMobile ? 'flex-end' : 'center'};
      justify-content:center;
    `;

    const popup = document.createElement('div');
    popup.style.cssText = `
      background:${isDark ? '#1F2937' : '#fff'};
      color:${isDark ? '#D1D5DB' : '#333'};
      width:${isMobile ? '100%' : '90%'};
      max-width:600px;
      max-height:90vh;
      overflow:auto;
      border-radius:${isMobile ? '20px 20px 0 0' : '12px'};
      padding:24px;
      position:relative;
    `;

    const close = document.createElement('button');
    close.textContent = '×';
    close.style.cssText = `
      position:absolute; top:10px; right:14px;
      font-size:30px; background:none; border:none;
      color:${isDark ? '#9CA3AF' : '#666'};
      cursor:pointer;
    `;

    close.onclick = () => {
      document.body.style.overflow = '';
      overlay.remove();
    };

    const h2 = document.createElement("h2");
    h2.textContent = "Alternative Reading Sites";

    const info = document.createElement("div");
    info.style.opacity = "0.7";
    info.style.fontStyle = "italic";
    info.style.marginBottom = "16px";

    const updateInfo = (displayTitle) => {
      info.textContent = `"${displayTitle}" — Chapter ${getChapterNumber()}`;
    };

    popup.appendChild(h2);
    popup.appendChild(info);

    // url encoder
    const e = (name, removeHyphen = true) => {
      if (removeHyphen) name = name.replace(/-/g, ' ');
      return encodeURIComponent(name);
    }

    // query
    const t = inferTitle();
    const defaultTitle = t.fallbackTitle;
    updateInfo(defaultTitle);

    const sites = [
      [
        Comix, // class ref
        (query) => Comix.getSearchUrl(e(query)), // search url
        Comix.getCustomIconUrl(), // icon
        (query) => Comix.getDataKey(decodeURIComponent(e(query))), // dataKey
        (chapterNum, dataKey) => {
          const cachedMangaIdKey = Comix.getCachedMangaIdKey(getComickMangaID());
          const mangaIdKey = Comix.getMangaIDKeyByDataKey(dataKey);
          const mangaId = getWithTTL(cachedMangaIdKey)
            || getWithTTL(mangaIdKey);
          log('[comix-directLinkGenerator] mangaId:', mangaId);
          if (!mangaId) return;
          return chapterNum < 1
            ? Comix.getChapterListUrl(mangaId)
            : Comix.getChapterListUrl(mangaId, chapterNum);
        } // direct link generator
      ],
      [
        MangaFire, // class ref
        (query) => MangaFire.getSearchUrl(e(query)), // search url
        null, // icon
        (query) => MangaFire.getDataKey(decodeURIComponent(e(query))), // dataKey
        (chapterNum, dataKey) => {
          const cachedMangaIdKey = MangaFire.getCachedMangaIdKey(getComickMangaID());
          const mangaIdKey = MangaFire.getMangaIDKeyByDataKey(dataKey);
          const mangaId = getWithTTL(cachedMangaIdKey)
            || getWithTTL(mangaIdKey);
          log('[mangafire-directLinkGenerator] mangaId:', mangaId);
          if (!mangaId) return;
          return MangaFire.getChapterUrl(mangaId, chapterNum);
        } // direct link generator
      ],
      [
        WeebCentral, // class ref
        (query) => WeebCentral.getSearchUrl(e(query.replaceAll(/\W/g, ' '))), // search url
        null, // icon
        (query) => WeebCentral.getDataKey(decodeURIComponent(e(query.replaceAll(/\W/g, ' ')))), // dataKey
        (chapterNum, dataKey) => {
          const cachedMangaIdKey = WeebCentral.getCachedMangaIdKey(getComickMangaID());
          const mangaIdKey = WeebCentral.getMangaIDKeyByDataKey(dataKey);
          const mangaId = getWithTTL(cachedMangaIdKey)
            || getWithTTL(mangaIdKey);
          log('[weebcentral-directLinkGenerator] mangaId:', mangaId);
          if (!mangaId) return;
          const chapterIdKey = WeebCentral.getChapterIDKey(mangaId, chapterNum);
          const chapterId = getWithTTL(chapterIdKey);
          return chapterId
            ? WeebCentral.getChapterUrl(chapterId)
            : WeebCentral.getChapterSearchUrl(mangaId, chapterNum);
        }
      ],
      [
        MangaKatana, // class ref
        (query) => MangaKatana.getSearchUrl(e(query)),
        null
      ],
      [
        MangaTaro, // class ref
        (query) => MangaTaro.getSearchUrl(e(query, false)),
        null
      ],
      [
        MangaDex, // class ref
        (query) => MangaDex.getSearchUrl(e(query)), // search url
        null, // icon
        (query) => MangaDex.getDataKey(decodeURIComponent(e(query))), // dataKey
        (chapterNum, dataKey) => {
          const cachedMangaIdKey = MangaDex.getCachedMangaIdKey(getComickMangaID());
          const mangaIdKey = MangaDex.getMangaIDKeyByDataKey(dataKey);
          const mangaId = getWithTTL(cachedMangaIdKey)
            || getWithTTL(mangaIdKey);
          log('[mangadex-directLinkGenerator] mangaId:', mangaId);
          if (!mangaId) return;
          return MangaDex.getChapterSearchUrl(mangaId, chapterNum);
        } // direct link generator
      ],
      [
        Atsu, // class ref
        (query) => Atsu.getSearchUrl(e(query)),
        null
      ],
      [
        MangaBall, // class ref
        (query) => MangaBall.getSearchUrl(e(query, false)),
        null
      ],
      [
        MangaBuddy, // class ref
        (query) => MangaBuddy.getSearchUrl(e(query, false)),
        null
      ],
      [
        Mangago, // class ref
        (query) => Mangago.getSearchUrl(e(query)),
        null
      ],
      [
        VyManga, // class ref
        (query) => VyManga.getSearchUrl(e(query)),
        null
      ],
    ];

    const _getTitles = () => {
      const inferredTitles = Object.values(inferTitle())
        .filter(Boolean);
      const filteredTitles = currNextPageProps
        ?.filteredTitles
        ?.map(e => e.title?.trim())
        ?.filter(Boolean);
      const finalTitles = [...new Set([...inferredTitles, ...filteredTitles])]
      log('finalTitles:', finalTitles);
      return finalTitles;
    };

    /** @type {HTMLAnchorElement[]} */
    const aTags = [];

    const combo = createComboSelect({
      options: _getTitles(),
      placeholder: 'Type a full title search query..',
      defaultValue: defaultTitle,
      styles: {
        'wrapper': {
          width: '100%',
          marginBottom: '16px',
        },
      },
      isDarkMode: isDark,
      useFilter: false,
      // onInput: input change
      onInput(v) {
        log('[combo-box] onInput:', v);
        aTags.forEach(e => e._updateTitle(v));
        updateInfo(v);
      },
      // onInput: on selected / setValue call
      onChange(v) {
        log('[combo-box] onChange:', v);
        aTags.forEach(e => e._updateTitle(v));
        updateInfo(v);
      }
    });
    combo.elements.dropdown.classList.add('alt-popup'); // TODO
    popup.appendChild(combo.el);

    sites.forEach(([ClassRef, getSearchUrl, optIcon, getDataKey, directUrlGenerator]) => {
      const name = ClassRef.name(); // TODO: no interface, need to be careful on using ClassRef API
      const icon = document.createElement('img');
      icon.src = optIcon || getFavicon(getSearchUrl(''));
      icon.alt = '';
      icon.loading = 'lazy';
      icon.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 4px;
        flex-shrink: 0;
      `;

      const label = document.createElement('span');
      label.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        line-height: 1;
      `;

      const text = document.createElement('span');
      text.style.marginRight = '3px';
      text.textContent = name;
      label.append(text);

      const a = document.createElement('a');
      a._updateTitle = (title) => {
        a._inputTitle = title;
        a._dataKey = getDataKey?.(title);
        updateInfo(title);

        const mangaIdKey = ClassRef.getMangaIDKeyByDataKey?.(getDataKey?.(title)); // TODO: no interface, need to be careful on using ClassRef API
        const cachedMangaIdKey = ClassRef.getCachedMangaIdKey?.(getComickMangaID());
        const isCached = Boolean(
          getDataKey?.(title)
          && (getWithTTL(mangaIdKey)
            || getWithTTL(cachedMangaIdKey))
        );

        const hasTitle = Boolean(title && title.trim());
        setAnchorDisabled(a, !hasTitle && !isCached);

        const isJumpSupported = !!getDataKey?.(title);
        toggleBadgeButton(label, 'reset', {
          active: isCached,
          text: '🔄 Reset',
          bg: '#f87171',
          tooltip: 'Reset cache',
          onClick: (badge) => {
            badge.remove();
            GM_deleteValue(mangaIdKey);
            GM_deleteValue(cachedMangaIdKey);
            toggleBadges(label, {
              jump: isJumpSupported,
              cached: false
            });
            a.href = getSearchUrl(title);
          }
        });
        toggleBadges(label, {
          jump: isJumpSupported,
          cached: isCached
        });

        const chapterNum = getChapterNumber();
        const directUrl = directUrlGenerator?.(chapterNum, getDataKey?.(title));
        log('[createPopup] [before] directUrl', {
          directUrl,
          chapterNum,
          dataKey: getDataKey?.(title),
          directUrlGenerator
        }); // TODO
        if (directUrl) {
          a.href = directUrl;
          log('[createPopup] directUrl', directUrl); // TODO
        } else {
          a.href = getSearchUrl(title);
          log('[createPopup] searchUrl', directUrl); // TODO
        }
      };
      a._label = label;
      a.target = '_blank';
      a.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        margin-bottom: 10px;
        border-radius: 8px;
        color: ${isDark ? '#E5E7EB' : '#333'};
        text-decoration: none;
      `;
      addHoverStyles(a, {
        normalStyle: {background: isDark ? '#374151' : '#f5f5f5'},
        hoverStyle: {background: isDark ? '#344767' : '#e0f2ff'},
        isMobile: isMobile,
      });

      a.append(icon, label);
      a._updateTitle(defaultTitle);

      const storeData = async (e) => {
        const cachedMangaIdKey = ClassRef.getCachedMangaIdKey?.(getComickMangaID());
        const cachedMangaId = cachedMangaIdKey && getWithTTL(cachedMangaIdKey);
        if (cachedMangaId) {
          return;
        }
        const href = e.currentTarget.href;
        const dataKey = e.currentTarget._dataKey;

        log('[storedData] event:', {
          dataKey,
          targetHref: href,
        }); // TODO

        if (!dataKey) return;

        /** @type {any[]} */
        const data = Object.values(inferTitle())
          .filter(Boolean)
          .map(e => normalizeTitle(e));

        const filteredTitles = currNextPageProps
          ?.filteredTitles
          ?.filter(e => e?.title);

        if (filteredTitles?.length) {
          for (const e of filteredTitles) {
            const t = normalizeTitle(e.title);
            if (t) data.push(t);
          }
        }
        if (e.currentTarget._inputTitle) {
          const t = normalizeTitle(e.currentTarget._inputTitle);
          if (t) data.push(t);
        }
        if (!data?.length) return;

        /** @type {number} */
        const chapterNum = getChapterNumber();

        log('[storedData] data', {
          dataKey, t, data: data, chapterNum
        }); // TODO

        data.unshift(chapterNum);

        await setWithTTL(dataKey, data, 30_000);
        log('[storedData] dataKey set', {dataKey, data: data}); // TODO

        // listen cached mangaId add
        const LISTENER_KEY = dataKey;
        if (LISTENER_KEY) globalThis[LISTENER_KEY + '_anchor'] = a;
        if (!globalThis[LISTENER_KEY] && dataKey) {
          const mangaIdKey = ClassRef.getMangaIDKeyByDataKey?.(dataKey); // TODO: no interface, need to be careful on using ClassRef API
          const listenerId = GM_addValueChangeListener(
            mangaIdKey,
            (key, oldValue, newValue, remote) => {
              if (!remote) return; // ignore local writes
              log('[storedData] [add-listener] received:', {
                key,
                oldValue,
                newValue,
                remote
              }); // TODO
              const mangaId = unpackValue(newValue);
              const cachedMangaIdKey = ClassRef.getCachedMangaIdKey?.(getComickMangaID());
              setWithTTL(cachedMangaIdKey, mangaId, Infinity);
              log('[storedData] [unpacked] newValue (mangaId):', mangaId); // TODO

              // replace href
              if (dataKey && directUrlGenerator) {
                const chapterNum = getChapterNumber();
                const directUrl = directUrlGenerator(chapterNum, dataKey);
                log('[storeData] [add-listener] [replaced] directUrl', {
                  directUrl,
                  chapterNum,
                  dataKey,
                  directUrlGenerator
                }); // TODO
                if (directUrl) {
                  const a = globalThis[LISTENER_KEY + '_anchor'];
                  if (a?.href) {
                    const searchUrl = a.href;
                    a.href = directUrl;
                    toggleBadgeButton(a._label, 'reset', {
                      active: true,
                      text: '🔄 Reset',
                      bg: '#f87171',
                      tooltip: 'Reset cache',
                      onClick: (badge) => {
                        badge.remove();
                        const cachedMangaIdKey = ClassRef.getCachedMangaIdKey?.(getComickMangaID());
                        GM_deleteValue(mangaIdKey);
                        GM_deleteValue(cachedMangaIdKey);
                        toggleBadges(label, {
                          jump: true,
                          cached: false
                        });
                        a.href = searchUrl;
                      }
                    });
                    toggleBadges(a._label, {
                      jump: true,
                      cached: true
                    }, true);
                  }
                  log('[storeData] [add-listener] directUrl', directUrl); // TODO
                }
              }
            }
          );
          globalThis[LISTENER_KEY] = listenerId;
          log('[storedData] (registered) listenerId:', listenerId); // TODO
        }
      };

      a.addEventListener('click', async (e) => {
        log('[event] click'); // TODO
        await storeData(e);
        e.stopPropagation();
      });

      a.addEventListener('contextmenu', async (e) => {
        log('[event] contextmenu'); // TODO
        await storeData(e);
      });

      popup.appendChild(a);
      aTags.push(a);
    });

    popup.appendChild(close);

    const bottomCloseBtn = document.createElement('button');
    bottomCloseBtn.textContent = 'Close';
    bottomCloseBtn.style.cssText = `
      margin-top: 10px;
      margin-bottom: 10px;
      width: 100%;
      padding: 16px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      background: ${isDark ? '#3B82F6' : '#2563EB'};
      color: #FFFFFF;
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
    `;

    bottomCloseBtn.onclick = e => {
      close.click();
    };

    popup.appendChild(bottomCloseBtn);

    injectScrollbarStyle();
    popup.classList.add('alt-popup');

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.onclick = e => e.target === overlay && close.onclick();
  }

  /**********************************************************
   * Button
   **********************************************************/
  function createButton(isMobile = false, addMarginLeft = true) {
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.textContent = isMobile ? '🔍' : '🔍 Find Alternative Sites';
    btn.style.cssText = `
      padding: ${isMobile ? '10px' : '12px 20px'};
      border-radius:8px;
      border:1px solid #ccc;
      cursor:pointer;
      margin-left:${addMarginLeft ? '8' : '0'}px;
    `;

    btn.onclick = () => {
      createPopup();
    };

    return btn;
  }

  function tryInsertButton() {
    if (document.getElementById(BTN_ID)) return true;

    const candidates = document.querySelectorAll('a[class*="btn-primary"], button[class*="btn-primary"], #images-reader-container button');

    for (let el of candidates) {
      const t = el.textContent || '';
      if (
        t.startsWith('Start Reading') ||
        t.startsWith('Start Tracking') ||
        t.startsWith('Continue') ||
        t.startsWith('Read')
      ) {
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        el.parentElement?.classList.remove('md:max-w-md', 'xl:max-w-xl');
        el.parentElement?.appendChild(createButton(isMobile));
        log('Button inserted');
        return true;

      } else if (t.startsWith('Search')) {
        el = el?.parentElement || el;
        el.parentElement?.appendChild(createButton(false, false));
        log('Button inserted (2)');
        return true;
      }
    }
    return false;
  }

  /**********************************************************
   * SPA handling (efficient)
   **********************************************************/
  function scheduleInit() {
    if (initScheduled) return;
    initScheduled = true;
    setTimeout(() => {
      initScheduled = false;
      init();
    }, INIT_DELAY);
  }

  function init() {
    if (!location.pathname.startsWith('/comic/')) return;

    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (tryInsertButton() || attempts >= MAX_RETRIES) {
        clearInterval(timer);
      }
    }, 200);
  }

  // Initial run
  scheduleInit();

  /**********************************************************
   * Page hooks
   **********************************************************/

  // -- fetch hook --
  function inject(fn) {
    const script = document.createElement('script');
    script.textContent = `{const DEBUG = ${DEBUG}; const log = ${log};`;
    script.textContent += `(${fn})();}`;
    document.documentElement.appendChild(script);
    script.remove();
  }

  inject(() => {
    log('fetch hook injected'); // TODO

    const initialNextData = JSON.parse(document.querySelector('script[id="__NEXT_DATA__"]')?.innerHTML || "{}");
    const _buildId = initialNextData?.buildId || "";
    const _prefixFilter = `/_next/data/${_buildId}/comic/`;

    const origFetch = window.fetch;
    window.fetch = async function (...args) {
      const res = await origFetch.apply(this, args);
      try {
        const url = typeof args[0] === 'string' ? args[0] : args[0].url;
        if (url.startsWith(_prefixFilter)) {
          const clone = res.clone();
          const json = await clone.json();
          if (json?.pageProps) {
            window.postMessage({
              source: 'fetch-hook',
              payload: [url, new URL(url, location.origin).href, json.pageProps],
            }, '*');
          }
          log('[props-hook] Next.js page props:', {
            url, pageProps: json?.pageProps, fullData: json
          }); // TODO
        }
      } catch (e) {
        log('[props-hook] Fetch intercept error:', e);
      }
      return res;
    };
  })

  window.addEventListener('message', e => {
    if (e.data?.source === 'fetch-hook') {
      log('Received from page:', e.data.payload); // TODO
      const d = e.data.payload;
      latestPagePropsLogs.unshift([d[0], new URL(d[1]), d[2]]);
      if (latestPagePropsLogs?.length > maxPagePropsLogs) {
        latestPagePropsLogs.pop();
      }
      log({
        initialNextData,
        currNextPageProps,
        latestPagePropsLogs,
        maxPagePropsLogs,
        currUrl,
        _buildId
      }); // TODO
    }
  });

  // -- url hook --
  function emit(type) {
    if (location.href !== currUrl.href) {
      log('[url-hook] URL changed:', {
        type,
        url: location.href
      }); // TODO
      currUrl = new URL(location.href);
      if (currUrl.pathname.startsWith('/comic/')) {
        let [, slugPath, chapterPath = null] = currUrl.pathname.split('/').filter(Boolean);
        const comicProps = getComicProps(slugPath, chapterPath);
        currNextPageProps = comicProps;
        log('[url-hook] current comicProps', comicProps); // TODO
        inferTitle(); // TODO
        scheduleInit();
      }
    }
  }

  const push = history.pushState;
  history.pushState = function () {
    const r = push.apply(this, arguments);
    emit('pushState');
    return r;
  };
  const replace = history.replaceState;
  history.replaceState = function () {
    const r = replace.apply(this, arguments);
    emit('replaceState');
    return r;
  };
  window.addEventListener('popstate', () => emit('popstate'));

  /**
   * **********************
   * elements
   * **********************
   */
  function createSpinnerOverlay() {
    // Create spinner overlay
    const spinnerOverlay = document.createElement('div');
    spinnerOverlay.style.position = 'fixed';
    spinnerOverlay.style.top = 0;
    spinnerOverlay.style.left = 0;
    spinnerOverlay.style.width = '100%';
    spinnerOverlay.style.height = '100%';
    spinnerOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    spinnerOverlay.style.display = 'flex';
    spinnerOverlay.style.alignItems = 'center';
    spinnerOverlay.style.justifyContent = 'center';
    spinnerOverlay.style.zIndex = 9999;

    const spinner = document.createElement('div');
    spinner.style.border = '8px solid #f3f3f3';
    spinner.style.borderTop = '8px solid #3498db';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '60px';
    spinner.style.height = '60px';
    spinner.style.animation = 'spin 1s linear infinite';

    spinnerOverlay.appendChild(spinner);
    document.body.appendChild(spinnerOverlay);

    // Add keyframes for spinner animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Return cleanup callback
    let removed = false;

    return function removeSpinnerOverlay() {
      if (removed) return;
      removed = true;

      if (spinnerOverlay.parentNode) {
        spinnerOverlay.remove();
      }
      if (style.parentNode) {
        style.remove();
      }
    };
  }

  function injectScrollbarStyle() {
    if (document.getElementById('alt-scrollbar-style')) return;

    const style = document.createElement('style');
    style.id = 'alt-scrollbar-style';
    style.textContent = `
      /* Chromium / Android */
      .alt-popup::-webkit-scrollbar {
        width: 8px;
      }

      .alt-popup::-webkit-scrollbar-track {
        background: transparent;
      }

      .alt-popup::-webkit-scrollbar-thumb {
        background-color: rgba(120,120,120,0.4);
        border-radius: 8px;
        border: 2px solid transparent;
        background-clip: content-box;
      }

      .alt-popup:hover::-webkit-scrollbar-thumb {
        background-color: rgba(120,120,120,0.65);
      }

      /* Firefox */
      .alt-popup {
        scrollbar-width: thin;
        scrollbar-color: rgba(120,120,120,0.6) transparent;
      }

      /* Dark mode tweak */
      .dark .alt-popup::-webkit-scrollbar-thumb {
        background-color: rgba(180,180,180,0.4);
      }

      .dark .alt-popup:hover::-webkit-scrollbar-thumb {
        background-color: rgba(180,180,180,0.65);
      }
    `;
    document.head.appendChild(style);
  }

  function createComboSelect({
                               options = [],
                               placeholder = 'Type or select…',
                               defaultValue = '',
                               styles = {},
                               isDarkMode = false,
                               useFilter = true,
                               onInput = () => {
                               },
                               onChange = () => {
                               },
                             }) {
    const el = {};

    // === Wrapper ===
    el.wrapper = document.createElement('div');
    Object.assign(el.wrapper.style, {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      border: `1px solid ${isDarkMode ? '#445063' : '#ccc'}`,
      borderRadius: '4px',
      padding: '4px 4px',
      background: isDarkMode ? '#1F2937' : '#fff',
      ...styles.wrapper,
    });

    // === Input ===
    el.input = document.createElement('input');
    el.input.type = 'text';
    el.input.placeholder = placeholder;
    Object.assign(el.input.style, {
      border: 'none',
      outline: 'none',
      flex: '1 1 auto',
      minWidth: '80px',
      ...styles.input,
    });

    // === Clear ===
    el.clearBtn = document.createElement('span');
    el.clearBtn.textContent = '✕';
    Object.assign(el.clearBtn.style, {
      cursor: 'pointer',
      padding: '0 6px',
      display: 'none',
      opacity: '0.6',
      ...styles.clearBtn,
    });

    // === Dropdown Button ===
    el.dropdownBtn = document.createElement('span');
    el.dropdownBtn.textContent = '▾';
    Object.assign(el.dropdownBtn.style, {
      cursor: 'pointer',
      padding: '0 6px',
      opacity: '0.8',
      ...styles.dropdownBtn,
    });

    // === Dropdown ===
    el.dropdown = document.createElement('div');
    Object.assign(el.dropdown.style, {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      border: `1px solid ${isDarkMode ? '#445063' : '#ccc'}`,
      background: isDarkMode ? '#1F2937' : '#fff',
      zIndex: '9999',
      maxHeight: '200px',
      overflowY: 'auto',
      display: 'none',
      ...styles.dropdown,
    });

    function renderOptions(filter = '') {
      el.dropdown.innerHTML = '';
      options
        .filter(o => (!useFilter || o.toLowerCase().includes(filter.toLowerCase())))
        .forEach(opt => {
          const item = document.createElement('div');
          item.textContent = opt;

          Object.assign(item.style, {
            padding: '6px',
            cursor: 'pointer',
          });

          const hoverStyle = {
            background: 'rgba(0, 150, 255, 0.12)',
            boxShadow: 'inset 0 0 0 1px rgba(0, 150, 255, 0.4)',
          };

          const normalStyle = {
            background: '',
            boxShadow: '',
          };

          item.addEventListener('mouseenter', () => {
            Object.assign(item.style, hoverStyle);
          });

          item.addEventListener('mouseleave', () => {
            Object.assign(item.style, normalStyle);
          });

          // Mobile touch feedback
          item.addEventListener('touchstart', () => {
            Object.assign(item.style, hoverStyle);
          });

          item.addEventListener('touchend', () => {
            Object.assign(item.style, normalStyle);
          });

          item.addEventListener('mousedown', e => {
            e.preventDefault();
            setValue(opt, true);
          });

          el.dropdown.appendChild(item);
        });
    }

    function showDropdown() {
      renderOptions(el.input.value);
      el.dropdown.style.display = 'block';
    }

    function hideDropdown() {
      el.dropdown.style.display = 'none';
    }

    function setValue(val, fromUser = false) {
      el.input.value = val;
      el.clearBtn.style.display = val ? 'block' : 'none';
      hideDropdown();
      if (fromUser) onChange(val);
    }

    // === Events ===
    el.input.addEventListener('input', e => {
      el.clearBtn.style.display = el.input.value ? 'block' : 'none';
      if (useFilter) showDropdown();
      onInput(el.input.value, e);
    });

    el.input.addEventListener('focus', showDropdown);
    el.input.addEventListener('blur', () => setTimeout(hideDropdown, 150));

    el.dropdownBtn.addEventListener('mousedown', e => {
      e.preventDefault();
      el.dropdown.style.display === 'block' ? hideDropdown() : showDropdown();
    });

    el.clearBtn.addEventListener('mousedown', e => {
      e.preventDefault();
      setValue('', true);
      showDropdown();
      onInput('', e);
    });

    // === Init ===
    if (defaultValue) setValue(defaultValue, false);

    el.wrapper.append(
      el.input,
      el.clearBtn,
      el.dropdownBtn,
      el.dropdown
    );

    // === Public API ===
    return {
      el: el.wrapper,
      elements: el,

      getValue: () => el.input.value,
      setValue: v => setValue(v, false),

      setStyle(target, styleObj) {
        if (el[target]) Object.assign(el[target].style, styleObj);
      }
    };
  }

  function setAnchorDisabled(a, disabled) {
    if (disabled) {
      if (!a.dataset.href && a.getAttribute('href')) {
        a.dataset.href = a.getAttribute('href');
      }
      a.removeAttribute('href');
      a.setAttribute('aria-disabled', 'true');
      a.tabIndex = -1;
      a.style.pointerEvents = 'none';
      a.style.opacity = '0.5';
      a.style.cursor = 'not-allowed';
    } else {
      if (a.dataset.href) {
        a.setAttribute('href', a.dataset.href);
      }
      a.removeAttribute('aria-disabled');
      a.tabIndex = 0;
      a.style.pointerEvents = '';
      a.style.opacity = '';
      a.style.cursor = '';
    }
  }

  /**
   * **********************
   * storage utils
   * **********************
   */
  async function setWithTTL(key, value, ttlMs) {
    await GM_setValue(key, {
      value,
      expires: ttlMs === Infinity
        ? Date.now() * 2
        : Date.now() + ttlMs
    });
  }

  function getWithTTL(key) {
    const data = GM_getValue(key);
    if (!data) return null;
    if (Date.now() > data.expires) {
      GM_deleteValue(key);
      return null;
    }
    return data.value;
  }

  function unpackValue(rawData) {
    return rawData?.value;
  }

  function gc() {
    for (const key of GM_listValues()) {
      const data = GM_getValue(key);
      if (data?.expires && Date.now() > data.expires) {
        GM_deleteValue(key);
      }
    }
  }

  // initial run gc
  gc();

  /**
   * **********************
   * other utils
   * **********************
   */
  function normalizeTitle(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().trim();
  }

  function toggleBadges(label, {jump = false, cached = false} = {}, recreate = false) {
    if (!(label instanceof Element)) return;

    const ensure = (key, shouldExist, create) => {
      const existing = label.querySelector(`[data-badge="${key}"]`);
      if (shouldExist && !existing) {
        label.append(create());
      } else if (shouldExist && existing && recreate) {
        existing.remove();
        label.append(create());
      } else if (!shouldExist && existing) {
        existing.remove();
      }
    };
    ensure('jump', jump, () =>
      createBadge('🎯 AUTO', '#3b82f6', 'jump', 'Supports auto select + jump')
    );
    ensure('cached', cached, () =>
      createBadge('⚡ CACHED', '#22c55e', 'cached', 'Manga ID cached, faster jump')
    );
  }

  function createBadge(text, bg, key, tooltip) {
    const badge = document.createElement('span');
    badge.textContent = text;
    badge.dataset.badge = key;
    badge.title = tooltip || '';
    badge.style.cssText = `
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 999px;
      background: ${bg};
      color: #fff;
      white-space: nowrap;
    `;
    return badge;
  }

  function toggleBadgeButton(label, key, {
    active = false,
    bg = '#3b82f6',
    text = '',
    tooltip = '',
    onClick
  } = {}) {
    if (!(label instanceof Element)) return;

    const existing = label.querySelector(`[data-badge="${key}"]`);

    // Remove badge if it should not be active
    if (!active && existing) {
      existing.remove();
      return;
    }

    // Create badge if it should be active and doesn't exist
    if (active && !existing) {
      const badge = document.createElement('span');
      badge.textContent = text;
      badge.dataset.badge = key;
      badge.title = tooltip || '';
      badge.style.cssText = `
        font-size: 10px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 999px;
        background: ${bg};
        color: #fff;
        white-space: nowrap;
        cursor: pointer;
        user-select: none;
        display: inline-block;
        transition: transform 0.1s ease, opacity 0.2s ease;
      `;

      // Hover effect
      badge.addEventListener('mouseenter', () => badge.style.transform = 'scale(1.1)');
      badge.addEventListener('mouseleave', () => badge.style.transform = 'scale(1)');

      // Click callback
      badge.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the <a> tag
        e.preventDefault();  // Optional: prevent default link behavior
        if (typeof onClick === 'function') onClick(badge);
      });

      label.append(badge);
    }
  }

  function addHoverStyles(el, {
    hoverStyle = {},
    normalStyle = {},
    isMobile = false
  } = {}) {
    if (!el) return;

    const applyHover = () => Object.assign(el.style, hoverStyle);
    const applyNormal = () => Object.assign(el.style, normalStyle);
    applyNormal();

    if (!isMobile) {
      // Mouse
      el.addEventListener('mouseenter', applyHover);
      el.addEventListener('mouseleave', applyNormal);
    }

    // Touch (mobile)
    el.addEventListener('touchstart', applyHover, {passive: true});
    el.addEventListener('touchend', applyNormal);
    el.addEventListener('touchcancel', applyNormal);
  }
})();
