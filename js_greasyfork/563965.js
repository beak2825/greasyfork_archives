// ==UserScript==
// @name         MALScores+
// @namespace    SuperTouch
// @version      1.0.1
// @description  Adds scores from other anime platforms to MyAnimeList
// @author       SuperTouch
// @match        https://myanimelist.net/*
// @connect      api.anidb.net
// @connect      graphql.anilist.co
// @connect      raw.githubusercontent.com
// @icon         https://cdn.myanimelist.net/images/favicon.ico
// @require      https://update.greasyfork.org/scripts/563964/1741592/LibMAL.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/563965/MALScores%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/563965/MALScores%2B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const section = libMAL.settings.registerScript('MALScoresPlus', { title: 'MAL Scores+' });

  section.tab('Providers')
    .addDescription('Select general platforms settings. AniDB requires a client key.')
    .addCheckbox('showAniList', 'Show AniList Rating', { default: true })
    .addCheckbox('showAniDB', 'Show AniDB Rating', { default: true })
    .addInput('anidbClient', 'AniDB Client Key', { inputType: 'text', default: '', description: 'Used for AniDB API requests' })
    .addInput('anidbDelay', 'AniDB Delay (ms)', { inputType: 'number', default: 3000, description: 'Delay between requests to avoid bans' });

  section.tab('Cache TTL')
    .addDescription('Days to cache scores based on show status.<br>If the show is finished, age is calculated from the show\'s <b>End Date</b>.')
    .addInput('ttlAiring', 'Currently Airing', { inputType: 'number', default: 4, width: '60px', description: 'Updates every X days' })
    .addInput('ttlActive', 'Just Finished', { inputType: 'number', default: 14, width: '60px', description: 'Age < 3 months' })
    .addInput('ttlRecent', 'Recent Shows', { inputType: 'number', default: 14, width: '60px', description: 'Age: 3mo - 1yr' })
    .addInput('ttlOlder', 'Older Shows', { inputType: 'number', default: 30, width: '60px', description: 'Age: 1yr - 5yr' })
    .addInput('ttlLegacy', 'Legacy', { inputType: 'number', default: 45, width: '60px', description: 'Age > 5yr' });

  const ANIDB_CLIENT = section.get('anidbClient', '');

  const CONFIG = {
    ttl: {
      airing: section.get('ttlAiring', 4),
      active: section.get('ttlActive', 14),
      recent: section.get('ttlRecent', 14),
      older:  section.get('ttlOlder', 30),
      legacy: section.get('ttlLegacy', 45)
    }
  };

  libMAL.settings.injectDropdownLink();

  const ALL_HOSTS = [
    { name: 'AniDB', key: 'showAniDB', favicon: 'https://anidb.net/favicon.ico', fetchScore: fetchAniDBScore, cssClass: 'anidb', color: '#fcad1b', urlTemplate: 'https://anidb.net/anime/{id}', supportedTypes: ['ANIME'], delay: section.get('anidbDelay', 3000) },
    { name: 'AniList', key: 'showAniList', favicon: 'https://anilist.co/img/icons/favicon-32x32.png', fetchScore: fetchAniListScore, cssClass: 'anilist', color: '#02A9FF', urlTemplate: 'https://anilist.co/{type}/{id}', supportedTypes: ['ANIME', 'MANGA'], delay: 0 }
  ];

  const HOSTS = ALL_HOSTS.filter(h => {
    if (!section.get(h.key, true)) return false;
    if (h.name === 'AniDB' && !ANIDB_CLIENT) return false;
    return true;
  });

  let cachedScores = GM_getValue('cacheScores', {});

  function log(message) { console.log(`[MALScores+] ${message}`); }

  const SCORE_STYLES = `
    .anime-detail-header-stats .stats-block { height: 82px !important; }
    .anime-detail-header-stats .stats-block::before { height: 76px !important; }
    .anime-detail-header-stats .stats-block .information-block { top: 78px !important; }
    .msp-score-block { display: flex; flex-direction: column; align-items: center; width: 100%; margin-top: 2px; }
    .msp-scores { display: flex; align-items: center; width: 100%; }
    .msp-favicon { width: 16px; height: 16px; margin-right: 4px; cursor: pointer; }
    .msp-favicon:hover { opacity: 0.8; }
    .msp-ratings { display: flex; justify-content: space-between; width: 100%; }
    .msp-rating { display: flex; align-items: center; width: 50%; }
    .msp-rating:first-child { border-right: #414141 1px solid; color: #e0e0e0; margin-right: 6px !important; padding-right: 6px !important; }
    .msp-rating-label { flex: 1; }
    .msp-rating-value { flex: 1; text-align: right; }
    [data-tooltip] { position: relative; text-decoration: underline; text-decoration-style: dotted; cursor: help; }
    [data-tooltip]::after { position: absolute; opacity: 0; pointer-events: none; content: attr(data-tooltip); left: 0; top: calc(100% + 2px); border-radius: 3px; box-shadow: 1px 1px 1px 1px rgb(27, 27, 27); background-color: #121212; z-index: 10; padding: 2px 4px 2px 4px; width: 88px; transform: translateY(-20px); transition: all 150ms cubic-bezier(.25, .8, .25, 1); }
    [data-tooltip]:hover::after { opacity: 1; transform: translateY(0); transition-duration: 300ms; }
    .msp-anidb { color: #fcad1b; }
    .msp-anilist { color: #02A9FF; }
  `;

  function injectCSS() {
    if (document.getElementById('msp-styles')) return;
    const style = document.createElement('style');
    style.id = 'msp-styles';
    style.textContent = SCORE_STYLES;
    document.head.appendChild(style);
  }

  function parsePageStatus() {
    let status = null, dates = null;
    document.querySelectorAll('.spaceit_pad').forEach(el => {
      const text = el.textContent;
      if (text.includes('Status:')) status = text.replace('Status:', '').trim();
      if (text.includes('Aired:')) dates = text.replace('Aired:', '').trim();
      if (text.includes('Published:')) dates = text.replace('Published:', '').trim();
    });
    return { status, dates };
  }

  function calculateTTL(status, dates) {
    const DAY = 24 * 60 * 60 * 1000;
    const ttl = CONFIG.ttl;
    
    if (status === 'Currently Airing' || status === 'Publishing' || status === 'On Hiatus') return ttl.airing * DAY;
    if (status === 'Finished Airing' || status === 'Finished' || status === 'Discontinued') {
      if (!dates) return ttl.recent * DAY;            // Default if no date found
      const endMatch = dates.match(/to\s+([A-Za-z]+\s+\d+,\s+\d{4})/);
      if (endMatch) {
        const ageMonths = (Date.now() - new Date(endMatch[1])) / (30 * DAY);
        if (ageMonths < 3) return ttl.active * DAY;   // Active (< 3 months)
        if (ageMonths < 12) return ttl.recent * DAY;  // Recent (3 mo - 1 yr)
        if (ageMonths < 60) return ttl.older * DAY;   // Older (1 yr - 5 yr)
        return ttl.legacy * DAY;                      // Legacy (> 5 yr)
      }
    }
    return ttl.recent * DAY;                          // Fallback
  }

  function rateLimit(hostKey, delay) {
    return new Promise(resolve => {
      const now = Date.now();
      const lastKey = `limitLastReq${hostKey}`;
      const lastReq = GM_getValue(lastKey, 0);
      const targetTime = Math.max(now, lastReq + delay);
      
      GM_setValue(lastKey, targetTime);
      
      const wait = targetTime - now;
      if (wait > 0) setTimeout(resolve, wait);
      else resolve();
    });
  }

  function downloadAnimeIDs() {
    return new Promise((resolve, reject) => {
      log('[Cache] Updating ID map...');
      const startTime = performance.now();
      
      libMAL.utilities.fetch('https://raw.githubusercontent.com/anime-and-manga/lists/main/anime.json')
        .then(response => {
          if (response.ok) {
            try {
              const downloadEndTime = performance.now();
              const rawData = response.data;
              
              const malToHostMap = {};
              let count = 0;
              
              rawData.forEach(item => {
                if (item.idMal) {
                    malToHostMap[item.idMal] = [item.idAniDB || null, item.idAL || null];
                    count++;
                }
              });
              
              const mapEndTime = performance.now();
              log(`[Cache] Map updated (${count} entries) [DL: ${(downloadEndTime - startTime).toFixed(2)}ms | Parse: ${(mapEndTime - downloadEndTime).toFixed(2)}ms]`);
              
              resolve(malToHostMap);
            } catch (e) {
              log(`[Cache] Error parsing map: ${e.message}`);
              reject(e);
            }
          } else {
            log(`[Cache] Map download failed: ${response.status}`);
            reject(new Error(`HTTP ${response.status}`));
          }
        })
        .catch(e => {
          log(`[Cache] Network error: ${e.message}`);
          reject(e);
        });
    });
  }


  function fetchAndCacheScore(host, hostID, malID, ttl, type) {
    return new Promise((resolve) => {
      if (!cachedScores[malID]) cachedScores[malID] = {};
      const cached = cachedScores[malID][host.name];
      const now = Date.now();
      const age = cached && cached.cachedAt ? (now - cached.cachedAt) : Infinity;
      const isValid = age < ttl;
      
      if (isValid) {
        log(`[#${malID}] [${host.name}] Cache hit (${(age / (24 * 60 * 60 * 1000)).toFixed(1)}d < ${(ttl / (24 * 60 * 60 * 1000)).toFixed(1)}d)`);
        resolve({ rating: cached.rating, average: cached.average, id: cached.id });
      } else {
        if (cached) {
            log(`[#${malID}] [${host.name}] Cache EXPIRED (${(age / (24 * 60 * 60 * 1000)).toFixed(1)}d >= ${(ttl / (24 * 60 * 60 * 1000)).toFixed(1)}d)`);
        } else {
            log(`[#${malID}] [${host.name}] Cache miss`);
        }
        
        log(`[#${malID}] [${host.name}] Fetching score...`);
        rateLimit(host.name, host.delay).then(() => {
          host.fetchScore(hostID || malID, type).then(({ rating, average, id, isError }) => {
            if (!isError) {
              cachedScores[malID][host.name] = { rating, average, id, cachedAt: Date.now() };
              GM_setValue('cacheScores', cachedScores);
            } else {
              log(`[#${malID}] [${host.name}] Fetch error, skipping cache.`);
            }
            resolve({ rating, average, id });
          });
        });
      }
    });
  }

  function fetchAniDBScore(anidbID, type) {
    return new Promise((resolve) => {
      if (type === 'MANGA') { resolve({ rating: null, average: null, id: null, isError: false }); return; }
      
      libMAL.utilities.fetch(`http://api.anidb.net:9001/httpapi?request=anime&client=${ANIDB_CLIENT}&clientver=1&protover=1&aid=${anidbID}`, {
        responseType: 'text'
      })
        .then(response => {
          if (response.ok) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'text/xml');
            const ratings = xmlDoc.getElementsByTagName('ratings')[0];
            if (!ratings) {
              resolve({ rating: null, average: null, id: anidbID, isError: false });
              return;
            }
            const permanentEl = ratings.getElementsByTagName('permanent')[0];
            const temporaryEl = ratings.getElementsByTagName('temporary')[0];
            resolve({ rating: permanentEl?.textContent || null, average: temporaryEl?.textContent || null, id: anidbID, isError: false });
          } else {
            log(`[AniDB] Fetch failed (${response.status})`);
            resolve({ rating: null, average: null, id: null, isError: true });
          }
        })
        .catch((e) => {
          log(`[AniDB] Fetch failed: ${e?.message}`);
          resolve({ rating: null, average: null, id: null, isError: true })
        });
    });
  }

  function fetchAniListScore(idOrMalId, type) {
    return new Promise((resolve) => {
      const isManga = type === 'MANGA';
      const query = `query ($queryId: Int, $type: MediaType) { Media (${isManga ? 'idMal' : 'id'}: $queryId, type: $type) { id averageScore meanScore } }`;
      
      libMAL.utilities.fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query: query, variables: { queryId: idOrMalId, type: type } })
      })
      .then(response => {
        if (response.ok) {
          try {
            const data = response.data;
            if (data.data?.Media) {
              const { averageScore, meanScore, id } = data.data.Media;
              resolve({ rating: averageScore, average: meanScore, id, isError: false });
            } else {
              resolve({ rating: null, average: null, id: null, isError: false });
            }
          } catch { resolve({ rating: null, average: null, id: null, isError: true }); }
        } else {
          log(`[AniList] Fetch failed (${response.status})`);
          resolve({ rating: null, average: null, id: null, isError: true });
        }
      })
      .catch(() => resolve({ rating: null, average: null, id: null, isError: true }));
    });
  }

  function addScores(malToHostMap) {
    const pageInfo = libMAL.utilities.getPageInfo();
    if (!pageInfo.type || !pageInfo.id) return;

    const malID = pageInfo.id;
    const pageType = pageInfo.type.toUpperCase();

    const statsBlock = document.querySelector('.stats-block .di-ib');
    if (!statsBlock || statsBlock.querySelector('.msp-score-block')) return;

    const scoreBlock = document.createElement('div');
    scoreBlock.classList.add('msp-score-block');
    
    const { status, dates } = parsePageStatus();
    
    if (status === 'Not yet aired' || status === 'Not yet published') {
      log(`[#${malID}] Show not yet aired, skipping.`);
      return;
    }
    
    const ttl = calculateTTL(status, dates);
    
    const hostData = malToHostMap && malToHostMap[malID] ? malToHostMap[malID] : {};
    
    log(`[#${malID}] Processing scores...`);
    
    const activeHosts = HOSTS.filter(host => host.supportedTypes.includes(pageType));
    if (activeHosts.length === 0) return;

    injectCSS();

    const containers = {};
    activeHosts.forEach(host => {
      const div = document.createElement('div');
      div.className = 'msp-scores-placeholder';
      div.style.minHeight = '14px';
      scoreBlock.appendChild(div);
      containers[host.name] = div;
    });
    statsBlock.appendChild(scoreBlock);

    activeHosts.forEach(async host => {
      let hostID = null;
      if (hostData) {
          if (host.name === 'AniDB') hostID = hostData[0];
          else if (host.name === 'AniList') hostID = hostData[1];
      }
      
      if (pageType === 'MANGA' && !hostID) hostID = null;
      if (pageType === 'ANIME' && !hostID) {
        log(`[#${malID}] [${host.name}] No ID found.`);
        containers[host.name].remove();
        return;
      }

      const { rating, average, id } = await fetchAndCacheScore(host, hostID, malID, ttl, pageType);
      const container = containers[host.name];
      const linkID = id || hostID;

      if (!linkID && !rating) {
        container.remove();
        return;
      }

      container.className = 'msp-scores';
      container.style.minHeight = '';
      container.innerHTML = `
          <a href="${host.urlTemplate.replace('{id}', linkID).replace('{type}', pageType.toLowerCase())}" target="_blank" rel="noopener noreferrer">
            <img class="msp-favicon" src="${host.favicon}" alt="${host.name}" />
          </a>
          <div class="msp-ratings">
            <span class="msp-rating">
              <span class="msp-rating-label" data-tooltip="Weighted score">Rating</span>
              <span class="msp-rating-value msp-${host.cssClass}">${rating ?? 'N/A'}</span>
            </span>
            <span class="msp-rating">
              <span class="msp-rating-label">Average</span>
              <span class="msp-rating-value msp-${host.cssClass}">${average ?? 'N/A'}</span>
            </span>
          </div>
      `;
    });
  }

  async function init() {
    let malToHostMap = GM_getValue('cacheIdMap', {});
    const lastDownloadTime = GM_getValue('cacheIdLastUpdate', 0);
    const currentTime = Date.now();
    const needsUpdate = Object.keys(malToHostMap).length === 0 || (currentTime - lastDownloadTime >= 12 * 60 * 60 * 1000);
    
    if (needsUpdate) {
      try {
        malToHostMap = await downloadAnimeIDs();
        GM_setValue('cacheIdMap', malToHostMap);
        GM_setValue('cacheIdLastUpdate', currentTime);
      } catch (e) {
        log(`[Cache] Update failed: ${e.message}`);
      }
    }
    
    const pageInfo = libMAL.utilities.getPageInfo();
    if (pageInfo.type === 'anime' || pageInfo.type === 'manga') {
      addScores(malToHostMap);
    }
  }

  libMAL.utilities.onReady(init);
})();
