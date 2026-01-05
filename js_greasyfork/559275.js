// ==UserScript==
// @name         IP Lookup Enhancer
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      2.4
// @description  Adds geolocation and ISP info to IP addresses on Gaia moderation pages (rate-limit friendly)
// @author       kloob
// @match        https://www.gaiaonline.com/forum/mod/ip/*
// @match        http://www.gaiaonline.com/forum/mod/ip/*
// @match        https://www.gaiaonline.com/admin/user/mod/*
// @match        http://www.gaiaonline.com/admin/user/mod/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      web-api.nordvpn.com
// @connect      api.iplocation.net
// @downloadURL https://update.greasyfork.org/scripts/559275/IP%20Lookup%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/559275/IP%20Lookup%20Enhancer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /******************************************************************
   * CONFIG
   ******************************************************************/
  const CONFIG = {
    RATE_LIMIT_DELAY: 2000, // 2 seconds between network requests
    CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
    MAX_CONCURRENT: 1,
    RETRY_DELAY: 10000,
    MAX_RETRIES: 2,
    MAX_IPS_PER_PAGE: 15, // limit by UNIQUE IPs found on page
  };

  /******************************************************************
   * UI / CSS (DO NOT TOUCH)
   ******************************************************************/
  const style = document.createElement('style');
  style.textContent = `
        .ip-info {
            display: inline-block;
            margin-left: 8px;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
        }
        .ip-location {
            background-color: #e3f2fd;
            color: #1976d2;
        }
        .ip-isp {
            background-color: #f3e5f5;
            color: #7b1fa2;
        }
        .ip-vpn {
            background-color: #fff3e0;
            color: #f57c00;
        }
        .ip-direct {
            background-color: #e8f5e9;
            color: #388e3c;
        }
        .ip-loading {
            background-color: #f5f5f5;
            color: #757575;
        }
        .ip-error {
            background-color: #ffebee;
            color: #c62828;
        }
        .ip-toggle {
            display: inline-block;
            margin: 10px;
            padding: 5px 10px;
            background-color: #2196f3;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        }
        .ip-toggle:hover {
            background-color: #1976d2;
        }
        .ip-toggle.paused {
            background-color: #ff9800;
        }
        .ip-stats {
            display: inline-block;
            margin-left: 10px;
            font-size: 11px;
            color: #666;
        }
    `;
  document.head.appendChild(style);

  /******************************************************************
   * HELPERS
   ******************************************************************/
  const IPV4_REGEX =
    /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/;

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Extract IP from href/title/text (href first)
  function extractIP(anchorEl) {
    if (anchorEl && anchorEl.href) {
      const m = anchorEl.href.match(IPV4_REGEX);
      if (m) return m[0];
    }
    if (anchorEl && anchorEl.title) {
      const m = anchorEl.title.match(IPV4_REGEX);
      if (m) return m[0];
    }
    const text = (anchorEl && anchorEl.textContent ? anchorEl.textContent : '').trim();
    const m = text.match(IPV4_REGEX);
    return m ? m[0] : null;
  }

  // Choose a stable container to append badges to (works across different Gaia layouts)
  function pickContainerForLink(link) {
    return (
      link.closest('li.list') ||
      link.closest('li') ||
      link.closest('tr') ||
      link.closest('.row') ||
      link.closest('.entry') ||
      link.closest('div') ||
      link.parentElement
    );
  }

  /******************************************************************
   * CACHE
   ******************************************************************/
  const Cache = {
    async get(ip) {
      const cached = await GM_getValue(`ip_${ip}`, null);
      if (!cached) return null;

      let data;
      try {
        data = JSON.parse(cached);
      } catch {
        await GM_setValue(`ip_${ip}`, null);
        return null;
      }

      if (!data || typeof data !== 'object' || typeof data.timestamp !== 'number') return null;

      if (Date.now() - data.timestamp > CONFIG.CACHE_DURATION) {
        await GM_setValue(`ip_${ip}`, null);
        return null;
      }
      return data.value;
    },

    async set(ip, value) {
      const data = { value, timestamp: Date.now() };
      await GM_setValue(`ip_${ip}`, JSON.stringify(data));
    },
  };

  /******************************************************************
   * BADGES (UI unchanged)
   ******************************************************************/
  function createInfoBadges(data, ip) {
    const container = document.createElement('span');

    if (data.error) {
      const errorBadge = document.createElement('span');
      errorBadge.className = 'ip-info ip-error';
      errorBadge.textContent = '⚠️ Failed';
      errorBadge.title = `Lookup failed: ${data.error}`;
      container.appendChild(errorBadge);
      return container;
    }

    // NEW: Source badge (replaces the old separate "Fallback" badge)
    {
      const srcBadge = document.createElement('span');
      srcBadge.className = 'ip-info ip-loading';

      const src = data._source || (data.fallback ? 'iplocation' : 'nordvpn');
      if (src === 'iplocation') {
        srcBadge.textContent = '🧰 Source: iplocation';
        srcBadge.title = 'Data source: api.iplocation.net (fallback; limited security detection)';
      } else if (src === 'nordvpn') {
        srcBadge.textContent = '🧰 Source: NordVPN IP Lookup';
        srcBadge.title = 'Data source: web-api.nordvpn.com';
      } else {
        srcBadge.textContent = '🧰 Source: Unknown';
        srcBadge.title = 'Data source: unknown';
      }

      container.appendChild(srcBadge);
    }

    // Location badge
    if (data.city || data.country) {
      const locationBadge = document.createElement('span');
      locationBadge.className = 'ip-info ip-location';
      const location = [data.city, data.country?.code].filter(Boolean).join(', ');
      locationBadge.textContent = `📍 ${location}`;
      locationBadge.title = `Location: ${data.city || 'Unknown'}, ${data.country?.name || 'Unknown'}`;
      container.appendChild(locationBadge);
    }

    // ISP badge
    if (data.isp) {
      const ispBadge = document.createElement('span');
      ispBadge.className = 'ip-info ip-isp';
      const ispShort = data.isp.length > 20 ? data.isp.substring(0, 20) + '...' : data.isp;
      ispBadge.textContent = `🌐 ${ispShort}`;
      ispBadge.title = `ISP: ${data.isp}`;
      container.appendChild(ispBadge);
    }

    // VPN/Proxy badge (only meaningful when not fallback)
    if (data.security && !data.fallback) {
      const securityBadge = document.createElement('span');
      const isProxy = data.security.proxy || data.security.vpn || data.security.tor;

      if (isProxy) {
        securityBadge.className = 'ip-info ip-vpn';
        const types = [];
        if (data.security.vpn) types.push('VPN');
        if (data.security.proxy) types.push('Proxy');
        if (data.security.tor) types.push('Tor');
        securityBadge.textContent = `🛡️ ${types.join('/')}`;
        securityBadge.title = `Detected: ${types.join(', ')}`;
      } else {
        securityBadge.className = 'ip-info ip-direct';
        securityBadge.textContent = '✓ Direct';
        securityBadge.title = 'No VPN/Proxy detected';
      }
      container.appendChild(securityBadge);
    }

    return container;
  }

  function addLoadingIndicator(containerEl) {
    if (containerEl.querySelector('.ip-loading')) return;
    const loading = document.createElement('span');
    loading.className = 'ip-info ip-loading';
    loading.textContent = '⏳ Queued';
    containerEl.appendChild(loading);
  }

  /******************************************************************
   * REQUEST QUEUE (one lookup per IP, update all containers waiting)
   ******************************************************************/
  class RequestQueue {
    constructor() {
      this.queue = [];
      this.processing = false;
      this.paused = false;

      // ip -> Set(containerElements)
      this.waitingElementsByIP = new Map();
      this.inflightOrQueuedIPs = new Set();

      this.active = 0;
      this.lastNetworkStart = 0;

      this.stats = { total: 0, completed: 0, cached: 0, errors: 0 };
    }

    async add(ip, containerEl) {
      if (!this.waitingElementsByIP.has(ip)) this.waitingElementsByIP.set(ip, new Set());
      this.waitingElementsByIP.get(ip).add(containerEl);

      if (this.inflightOrQueuedIPs.has(ip)) return;

      this.inflightOrQueuedIPs.add(ip);
      this.queue.push({ ip, retries: 0 });

      this.stats.total++;
      this.updateStats();

      if (!this.processing && !this.paused) this.process();
    }

    pause() {
      this.paused = true;
      console.log('IP lookups paused');
      this.updateStats();
    }

    resume() {
      this.paused = false;
      console.log('IP lookups resumed');
      if (this.queue.length > 0 && !this.processing) this.process();
      this.updateStats();
    }

    async process() {
      if (this.processing || this.paused) return;
      this.processing = true;

      const pump = async () => {
        if (this.paused) return;

        while (this.active < CONFIG.MAX_CONCURRENT && this.queue.length > 0 && !this.paused) {
          const item = this.queue.shift();
          this.active++;

          this.handleItem(item)
            .catch((e) => {
              console.error('Error processing IP:', item.ip, e);
              this.stats.errors++;
              this.stats.completed++;
              this.updateStats();
              this.finishIP(item.ip, { error: 'Unhandled error', _source: 'none' });
            })
            .finally(() => {
              this.active--;
              if (!this.paused) setTimeout(pump, 0);
            });
        }

        if (this.queue.length === 0 && this.active === 0) {
          this.processing = false;
        }
      };

      pump();
    }

    async handleItem(item) {
      const cached = await Cache.get(item.ip);
      if (cached) {
        // Ensure cached data has a source indicator
        if (!cached._source) cached._source = cached.fallback ? 'iplocation' : 'nordvpn';

        this.stats.cached++;
        this.stats.completed++;
        this.updateStats();
        this.finishIP(item.ip, cached);
        return;
      }

      await this.waitForRateLimitSlot();

      const data = await this.lookupIP(item.ip);

      if (data && data.error) {
        if (item.retries < CONFIG.MAX_RETRIES) {
          item.retries++;
          this.queue.push(item);
          this.updateStats();
          await delay(CONFIG.RETRY_DELAY);
          return;
        }

        this.stats.errors++;
        this.stats.completed++;
        this.updateStats();
        this.finishIP(item.ip, data);
        return;
      }

      await Cache.set(item.ip, data);
      this.stats.completed++;
      this.updateStats();
      this.finishIP(item.ip, data);
    }

    finishIP(ip, data) {
      const containers = this.waitingElementsByIP.get(ip);
      if (containers) {
        for (const el of containers) this.updateUI(el, data, ip);
      }
      this.waitingElementsByIP.delete(ip);
      this.inflightOrQueuedIPs.delete(ip);
    }

    async waitForRateLimitSlot() {
      const now = Date.now();
      const earliest = this.lastNetworkStart + CONFIG.RATE_LIMIT_DELAY;
      if (now < earliest) await delay(earliest - now);
      this.lastNetworkStart = Date.now();
    }

    async lookupIP(ip) {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `https://web-api.nordvpn.com/v1/ips/lookup/${ip}`,
          onload: function (response) {
            if (response.status === 429) {
              console.warn('NordVPN rate limit hit, trying fallback API:', ip);
              tryFallbackAPI();
              return;
            }
            try {
              const data = JSON.parse(response.responseText);
              // NEW: source stamp
              data._source = 'nordvpn';
              resolve(data);
            } catch {
              tryFallbackAPI();
            }
          },
          onerror: tryFallbackAPI,
          ontimeout: tryFallbackAPI,
          timeout: 10000,
        });

        function tryFallbackAPI() {
          console.log('Using fallback API for:', ip);
          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.iplocation.net/?ip=${encodeURIComponent(ip)}`,
            onload: function (response) {
              try {
                const data = JSON.parse(response.responseText);
                resolve({
                  city: null,
                  country: {
                    name: data.country_name || 'Unknown',
                    code: data.country_code2 || 'XX',
                  },
                  isp: data.isp || 'Unknown',
                  security: { proxy: false, vpn: false, tor: false },
                  fallback: true,
                  // NEW: source stamp
                  _source: 'iplocation',
                });
              } catch {
                resolve({ error: 'Both APIs failed', _source: 'none' });
              }
            },
            onerror: () => resolve({ error: 'Both APIs failed', _source: 'none' }),
            ontimeout: () => resolve({ error: 'Timeout on fallback API', _source: 'none' }),
            timeout: 10000,
          });
        }
      });
    }

    updateUI(containerEl, data, ip) {
      // Remove queued marker
      const loading = containerEl.querySelector('.ip-loading');
      if (loading) loading.remove();

      // Remove badges we previously added (avoid duplicates on reruns)
      const prior = containerEl.querySelectorAll('.ip-info');
      prior.forEach((n) => {
        if (
          n.classList.contains('ip-location') ||
          n.classList.contains('ip-isp') ||
          n.classList.contains('ip-vpn') ||
          n.classList.contains('ip-direct') ||
          n.classList.contains('ip-error') ||
          n.classList.contains('ip-loading')
        ) {
          n.remove();
        }
      });

      containerEl.appendChild(createInfoBadges(data, ip));
    }

    updateStats() {
      const statsEl = document.getElementById('ip-lookup-stats');
      if (statsEl) {
        const pending = this.stats.total - this.stats.completed;
        statsEl.textContent = `Lookups: ${this.stats.completed}/${this.stats.total} | Cached: ${this.stats.cached} | Pending: ${pending} | Errors: ${this.stats.errors}`;
      }
    }
  }

  const queue = new RequestQueue();

  /******************************************************************
   * CONTROL UI (unchanged)
   ******************************************************************/
  function addControlUI() {
    if (!window.location.href.includes('/forum/mod/ip/')) return;

    const header = document.querySelector('#yui-gen1, h2') || document.body.firstChild;
    if (!header) return;

    const controlDiv = document.createElement('div');
    controlDiv.style.cssText =
      'padding: 10px; background: #f5f5f5; border-radius: 4px; margin-bottom: 10px;';

    const toggleBtn = document.createElement('span');
    toggleBtn.className = 'ip-toggle';
    toggleBtn.textContent = '⏸ Pause Lookups';
    toggleBtn.onclick = function () {
      if (queue.paused) {
        queue.resume();
        toggleBtn.textContent = '⏸ Pause Lookups';
        toggleBtn.classList.remove('paused');
      } else {
        queue.pause();
        toggleBtn.textContent = '▶ Resume Lookups';
        toggleBtn.classList.add('paused');
      }
    };

    const stats = document.createElement('span');
    stats.id = 'ip-lookup-stats';
    stats.className = 'ip-stats';
    stats.textContent = 'Ready to lookup IPs...';

    controlDiv.appendChild(toggleBtn);
    controlDiv.appendChild(stats);

    if (header.parentNode) header.parentNode.insertBefore(controlDiv, header);
    else document.body.insertBefore(controlDiv, document.body.firstChild);
  }

  /******************************************************************
   * PROCESS IPs: first 5 UNIQUE IPs on page (in DOM order)
   ******************************************************************/
  function processIPLinks() {
    const links = Array.from(document.querySelectorAll('a[href*="/forum/mod/ip/"]'));

    const chosen = [];
    const seenIPs = new Set();

    for (const link of links) {
      const ip = extractIP(link);
      if (!ip) continue;
      if (seenIPs.has(ip)) continue;

      seenIPs.add(ip);
      const container = pickContainerForLink(link);
      if (!container) continue;

      chosen.push({ ip, container });
      if (chosen.length >= CONFIG.MAX_IPS_PER_PAGE) break;
    }

    for (const { ip, container } of chosen) {
      const key = `ipProcessed_${ip.replace(/\./g, '_')}`;
      if (container.dataset[key]) continue;

      container.dataset[key] = 'true';
      addLoadingIndicator(container);
      queue.add(ip, container);
    }

    const totalUnique = seenIPs.size;
    if (totalUnique > CONFIG.MAX_IPS_PER_PAGE && !document.getElementById('ip-limit-notice')) {
      const notice = document.createElement('div');
      notice.id = 'ip-limit-notice';
      notice.style.cssText =
        'padding: 8px; margin: 10px 0; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; font-size: 12px; color: #856404;';
      notice.textContent = `ℹ️ Showing IP info for ${CONFIG.MAX_IPS_PER_PAGE} most recent IPs only (${totalUnique} unique IPs on page). This helps respect API rate limits.`;

      const header = document.querySelector('#yui-gen1, h2') || document.body.firstChild;
      if (header && header.parentNode) header.parentNode.insertBefore(notice, header);
      else document.body.insertBefore(notice, document.body.firstChild);
    }
  }

  /******************************************************************
   * INIT
   ******************************************************************/
  function init() {
    addControlUI();
    processIPLinks();
    console.log('Gaia IP Lookup Enhancer loaded (rate-limit friendly)');
    console.log(
      `Config: ${CONFIG.RATE_LIMIT_DELAY}ms delay, ${CONFIG.CACHE_DURATION / (24 * 60 * 60 * 1000)} day cache, max ${CONFIG.MAX_IPS_PER_PAGE} unique IPs`
    );
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /******************************************************************
   * MUTATION OBSERVER (debounced)
   ******************************************************************/
  let processTimer = null;
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        if (processTimer) clearTimeout(processTimer);
        processTimer = setTimeout(() => {
          processIPLinks();
        }, 300);
        break;
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
