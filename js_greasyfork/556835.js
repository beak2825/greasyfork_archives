// ==UserScript==
// @name         显示推特用户地理位置
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在Twitter用户名旁边显示基于账户位置的国家旗帜
// @author       https://x.com/Gufii_666
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556835/%E6%98%BE%E7%A4%BA%E6%8E%A8%E7%89%B9%E7%94%A8%E6%88%B7%E5%9C%B0%E7%90%86%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/556835/%E6%98%BE%E7%A4%BA%E6%8E%A8%E7%89%B9%E7%94%A8%E6%88%B7%E5%9C%B0%E7%90%86%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ==================== 国家旗帜映射 ====================
const COUNTRY_FLAGS = {
  "Afghanistan": "阿富汗",
  "Albania": "阿尔巴尼亚",
  "Algeria": "阿尔及利亚",
  "Argentina": "阿根廷",
  "Australia": "澳大利亚",
  "Austria": "奥地利",
  "Bangladesh": "孟加拉国",
  "Belgium": "比利时",
  "Brazil": "巴西",
  "Canada": "加拿大",
  "Chile": "智利",
  "China": "中国",
  "Colombia": "哥伦比亚",
  "Czech Republic": "捷克",
  "Denmark": "丹麦",
  "Egypt": "埃及",
  "Europe": "欧盟",
  "Finland": "芬兰",
  "France": "法国",
  "Germany": "德国",
  "Greece": "希腊",
  "Hong Kong": "中国香港",
  "Hungary": "匈牙利",
  "India": "印度",
  "Indonesia": "印度尼西亚",
  "Iran": "伊朗",
  "Iraq": "伊拉克",
  "Ireland": "爱尔兰",
  "Israel": "以色列",
  "Italy": "意大利",
  "Japan": "日本",
  "Kenya": "肯尼亚",
  "Malaysia": "马来西亚",
  "Mexico": "墨西哥",
  "Netherlands": "荷兰",
  "New Zealand": "新西兰",
  "Nigeria": "尼日利亚",
  "Norway": "挪威",
  "Pakistan": "巴基斯坦",
  "Philippines": "菲律宾",
  "Poland": "波兰",
  "Portugal": "葡萄牙",
  "Romania": "罗马尼亚",
  "Russia": "俄罗斯",
  "Saudi Arabia": "沙特阿拉伯",
  "Singapore": "新加坡",
  "South Africa": "南非",
  "Korea": "韩国",
  "South Korea": "韩国",
  "Spain": "西班牙",
  "Sweden": "瑞典",
  "Switzerland": "瑞士",
  "Taiwan": "中国台湾",
  "Thailand": "泰国",
  "Turkey": "土耳其",
  "Ukraine": "乌克兰",
  "United Arab Emirates": "阿拉伯联合酋长国",
  "United Kingdom": "英国",
  "United States": "美国",
  "Venezuela": "委内瑞拉",
  "Vietnam": "越南"
};

  // 区域名称到国家的映射（用于处理区域名称）
  const REGION_TO_COUNTRY = {
    "East Asia & Pacific": "China", // 默认映射到中国
    "Europe": "Europe",
    "Middle East & North Africa": "Saudi Arabia",
    "Sub-Saharan Africa": "South Africa",
    "Latin America & Caribbean": "Brazil",
    "North America": "United States",
    "South Asia": "India"
  };

  function getCountryFlag(countryName) {
    if (!countryName) return null;

    // 先检查是否是区域名称
    if (REGION_TO_COUNTRY[countryName]) {
      const mappedCountry = REGION_TO_COUNTRY[countryName];
      if (COUNTRY_FLAGS[mappedCountry]) {
        return COUNTRY_FLAGS[mappedCountry];
      }
    }

    // Try exact match first
    if (COUNTRY_FLAGS[countryName]) {
      return COUNTRY_FLAGS[countryName];
    }

    // Try case-insensitive match
    const normalized = countryName.trim();
    for (const [country, flag] of Object.entries(COUNTRY_FLAGS)) {
      if (country.toLowerCase() === normalized.toLowerCase()) {
        return flag;
      }
    }

    // 尝试部分匹配（例如 "Hong Kong" 匹配 "Hong Kong"）
    for (const [country, flag] of Object.entries(COUNTRY_FLAGS)) {
      if (normalized.toLowerCase().includes(country.toLowerCase()) ||
          country.toLowerCase().includes(normalized.toLowerCase())) {
        return flag;
      }
    }

    return null;
  }

  // ==================== 配置和状态 ====================
  let locationCache = new Map();
  const CACHE_KEY = 'twitter_location_cache';
  const CACHE_EXPIRY_DAYS = 30;
  const TOGGLE_KEY = 'extension_enabled';
  const DEFAULT_ENABLED = true;

  // Rate limiting
  const requestQueue = [];
  let isProcessingQueue = false;
  let lastRequestTime = 0;
  const MIN_REQUEST_INTERVAL = 2000;
  const MAX_CONCURRENT_REQUESTS = 2;
  let activeRequests = 0;
  let rateLimitResetTime = 0;

  // Observer for dynamically loaded content
  let observer = null;

  // Extension enabled state
  let extensionEnabled = DEFAULT_ENABLED;

  // Track usernames currently being processed
  const processingUsernames = new Set();

  // Debounce timer for processUsernames
  let processTimer = null;
  let isProcessing = false;

  // ==================== 存储管理（使用GM_* API）====================
  function loadEnabledState() {
    try {
      const value = GM_getValue(TOGGLE_KEY, DEFAULT_ENABLED);
      extensionEnabled = value;
      console.log('Extension enabled:', extensionEnabled);
    } catch (error) {
      console.error('Error loading enabled state:', error);
      extensionEnabled = DEFAULT_ENABLED;
    }
  }

  function loadCache() {
    try {
      const cached = GM_getValue(CACHE_KEY, null);
      if (cached) {
        const now = Date.now();

        // Filter out expired entries and null entries
        for (const [username, data] of Object.entries(cached)) {
          if (data.expiry && data.expiry > now && data.location !== null) {
            locationCache.set(username, data.location);
          }
        }
        console.log(`Loaded ${locationCache.size} cached locations (excluding null entries)`);
      }
    } catch (error) {
      console.error('Error loading cache:', error);
    }
  }

  function saveCache() {
    try {
      const cacheObj = {};
      const now = Date.now();
      const expiry = now + (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

      for (const [username, location] of locationCache.entries()) {
        cacheObj[username] = {
          location: location,
          expiry: expiry,
          cachedAt: now
        };
      }

      GM_setValue(CACHE_KEY, cacheObj);
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  function saveCacheEntry(username, location) {
    locationCache.set(username, location);
    // Debounce saves - only save every 5 seconds
    if (!saveCache.timeout) {
      saveCache.timeout = setTimeout(() => {
        saveCache();
        saveCache.timeout = null;
      }, 5000);
    }
  }

  // ==================== 页面脚本注入 ====================
  function injectPageScript() {
    // 检查是否已经注入
    if (unsafeWindow.__twitterLocationFlagInjected) {
      console.log('Page script already injected');
      return;
    }

    try {
      // 直接在页面上下文中定义函数，避免使用 eval
      const pageContext = unsafeWindow;

      // 防止重复注入
      if (pageContext.__twitterLocationFlagInjected) {
        return;
      }
      pageContext.__twitterLocationFlagInjected = true;
      console.log('[Page Script] Twitter Location Flag page script initialized');

      // Store headers from Twitter's own API calls
      let twitterHeaders = null;
      let headersReady = false;

      function captureHeaders(headers) {
        if (!headers) return;

        const headerObj = {};
        if (headers instanceof Headers) {
          headers.forEach((value, key) => {
            headerObj[key] = value;
          });
        } else if (headers instanceof Object) {
          for (const [key, value] of Object.entries(headers)) {
            headerObj[key] = value;
          }
        }

        twitterHeaders = headerObj;
        headersReady = true;
        console.log('Captured Twitter API headers:', Object.keys(headerObj));
      }

      // Intercept fetch to capture Twitter's headers
      const originalFetch = pageContext.fetch;
      pageContext.fetch = function(...args) {
        const url = args[0];
        const options = args[1] || {};

        if (typeof url === 'string' && url.includes('x.com/i/api/graphql')) {
          if (options.headers) {
            captureHeaders(options.headers);
            console.log('Captured Twitter headers:', Object.keys(twitterHeaders || {}));
          }
        }

        return originalFetch.apply(this, args);
      };

      // Also intercept XMLHttpRequest
      const originalXHROpen = XMLHttpRequest.prototype.open;
      const originalXHRSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...rest]);
      };

      XMLHttpRequest.prototype.send = function(...args) {
        if (this._url && this._url.includes('x.com/i/api/graphql')) {
          const headers = {};
          if (this._headers) {
            Object.assign(headers, this._headers);
          }
          captureHeaders(headers);
        }
        return originalXHRSend.apply(this, args);
      };

      const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
      XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (!this._headers) this._headers = {};
        this._headers[header] = value;
        return originalSetRequestHeader.apply(this, [header, value]);
      };

      setTimeout(() => {
        if (!headersReady) {
          console.log('No Twitter headers captured yet, using defaults');
          twitterHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          };
          headersReady = true;
        }
      }, 3000);

      // 监听测试消息
      pageContext.addEventListener('message', function(event) {
        if (event.source !== pageContext) return;
        if (event.data && event.data.type === '__testPageScript') {
          console.log('[Page Script] Test message received, responding...');
          pageContext.postMessage({ type: '__pageScriptReady' }, '*');
        }
      });

      // Listen for fetch requests from content script via postMessage
      console.log('[Page Script] Message listener registered');
      pageContext.addEventListener('message', async function(event) {
        // 只处理来自同源的消息
        if (event.source !== pageContext) return;

        if (event.data && event.data.type === '__fetchLocation') {
          console.log('[Page Script] Received fetch request for:', event.data.screenName);
          const { screenName, requestId } = event.data;

          // 如果 headers 还没准备好，等待一下，但不要等太久
          if (!headersReady) {
            console.log('[Page Script] Headers not ready, waiting...');
            let waitCount = 0;
            while (!headersReady && waitCount < 20) {
              await new Promise(resolve => setTimeout(resolve, 100));
              waitCount++;
            }
          }

          try {
            const variables = JSON.stringify({ screenName });
            const url = `https://x.com/i/api/graphql/XRqGa7EeokUU5kppkh13EA/AboutAccountQuery?variables=${encodeURIComponent(variables)}`;

            // 构建 headers，优先使用捕获的，否则使用基本 headers
            let headers = {};
            if (twitterHeaders && Object.keys(twitterHeaders).length > 0) {
              headers = { ...twitterHeaders };
              console.log('[Page Script] Using captured headers:', Object.keys(headers));
            } else {
              // 使用基本 headers，浏览器会自动添加必要的认证 headers（通过 cookies）
              headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              };
              console.log('[Page Script] Using default headers (cookies will be included automatically)');
            }

            console.log('[Page Script] Making request to:', url);
            const response = await fetch(url, {
              method: 'GET',
              credentials: 'include', // 这很重要，确保包含 cookies
              headers: headers,
              referrer: pageContext.location.href,
              referrerPolicy: 'origin-when-cross-origin'
            });

            console.log('[Page Script] Response status:', response.status, response.statusText);

            let location = null;
            if (response.ok) {
              const data = await response.json();
              console.log(`API response for ${screenName}:`, data);
              location = data?.data?.user_result_by_screen_name?.result?.about_profile?.account_based_in || null;
              console.log(`Extracted location for ${screenName}:`, location);

              if (!location && data?.data?.user_result_by_screen_name?.result) {
                console.log('User result available but no location:', {
                  hasAboutProfile: !!data.data.user_result_by_screen_name.result.about_profile,
                  aboutProfile: data.data.user_result_by_screen_name.result.about_profile
                });
              }
            } else {
              const errorText = await response.text().catch(() => '');

              if (response.status === 429) {
                const resetTime = response.headers.get('x-rate-limit-reset');
                const remaining = response.headers.get('x-rate-limit-remaining');
                const limit = response.headers.get('x-rate-limit-limit');

                if (resetTime) {
                  const resetDate = new Date(parseInt(resetTime) * 1000);
                  const now = Date.now();
                  const waitTime = resetDate.getTime() - now;

                  console.log(`Rate limited! Limit: ${limit}, Remaining: ${remaining}`);
                  console.log(`Rate limit resets at: ${resetDate.toLocaleString()}`);
                  console.log(`Waiting ${Math.ceil(waitTime / 1000 / 60)} minutes before retrying...`);

                  pageContext.postMessage({
                    type: '__rateLimitInfo',
                    resetTime: parseInt(resetTime),
                    waitTime: Math.max(0, waitTime)
                  }, '*');
                }
              } else {
                console.log(`Twitter API error for ${screenName}:`, response.status, response.statusText, errorText.substring(0, 200));
              }
            }

            console.log('[Page Script] Sending response for', screenName, 'location:', location);
            pageContext.postMessage({
              type: '__locationResponse',
              screenName,
              location,
              requestId,
              isRateLimited: response.status === 429
            }, '*');
          } catch (error) {
            console.error('Error fetching location:', error);
            pageContext.postMessage({
              type: '__locationResponse',
              screenName,
              location: null,
              requestId
            }, '*');
          }
        }
      });

      console.log('Page script injection completed');

      // 验证注入是否成功
      setTimeout(() => {
        // 通过postMessage测试页面脚本是否响应
        const testId = 'test_' + Date.now();
        let responded = false;
        const testHandler = (event) => {
          if (event.source !== window) return;
          if (event.data && event.data.type === '__pageScriptReady') {
            responded = true;
            window.removeEventListener('message', testHandler);
            console.log('Page script is ready and responding');
          }
        };
        window.addEventListener('message', testHandler);

        // 发送测试消息
        window.postMessage({ type: '__testPageScript', testId }, '*');

        setTimeout(() => {
          if (!responded) {
            console.warn('Page script may not be responding to messages');
          }
          window.removeEventListener('message', testHandler);
        }, 2000);
      }, 500);
    } catch (error) {
      console.error('Failed to inject page script:', error);
    }

    // Listen for rate limit info from page script
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      if (event.data && event.data.type === '__rateLimitInfo') {
        rateLimitResetTime = event.data.resetTime;
        const waitTime = event.data.waitTime;
        console.log(`Rate limit detected. Will resume requests in ${Math.ceil(waitTime / 1000 / 60)} minutes`);
      }
    });
  }

  // ==================== API请求处理 ====================
  async function processRequestQueue() {
    if (isProcessingQueue || requestQueue.length === 0) {
      return;
    }

    if (rateLimitResetTime > 0) {
      const now = Math.floor(Date.now() / 1000);
      if (now < rateLimitResetTime) {
        const waitTime = (rateLimitResetTime - now) * 1000;
        console.log(`Rate limited. Waiting ${Math.ceil(waitTime / 1000 / 60)} minutes...`);
        setTimeout(processRequestQueue, Math.min(waitTime, 60000));
        return;
      } else {
        rateLimitResetTime = 0;
      }
    }

    isProcessingQueue = true;

    while (requestQueue.length > 0 && activeRequests < MAX_CONCURRENT_REQUESTS) {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;

      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
      }

      const { screenName, resolve, reject } = requestQueue.shift();
      activeRequests++;
      lastRequestTime = Date.now();

      makeLocationRequest(screenName)
        .then(location => {
          resolve(location);
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => {
          activeRequests--;
          setTimeout(processRequestQueue, 200);
        });
    }

    isProcessingQueue = false;
  }

  function makeLocationRequest(screenName) {
    return new Promise((resolve, reject) => {
      const requestId = Date.now() + Math.random();
      let resolved = false;
      let retryCount = 0;
      const maxRetries = 3;

      let checkTimer = null;

      const handler = (event) => {
        // 接受来自页面上下文的消息（unsafeWindow）
        // 在油猴脚本中，页面脚本和content script的window是不同的
        // 所以我们需要接受来自任何源的消息，但验证消息内容
        if (!event.data || event.data.type !== '__locationResponse') {
          return;
        }

        // 调试：记录所有收到的消息
        console.log(`[Content Script] Received response for ${event.data.screenName}, requestId: ${event.data.requestId}, expected: ${requestId}`);

        // 检查是否匹配我们的请求
        if (event.data.screenName === screenName &&
            event.data.requestId === requestId) {
          if (resolved) {
            console.log(`[Content Script] Already resolved for ${screenName}, ignoring duplicate response`);
            return;
          }
          resolved = true;
          if (checkTimer) clearTimeout(checkTimer);
          window.removeEventListener('message', handler);
          const location = event.data.location;
          const isRateLimited = event.data.isRateLimited || false;

          console.log(`[Content Script] Processing response for ${screenName}, location: ${location}`);

          if (!isRateLimited) {
            saveCacheEntry(screenName, location || null);
          } else {
            console.log(`Not caching null for ${screenName} due to rate limit`);
          }

          resolve(location || null);
        }
      };
      window.addEventListener('message', handler);

      // 发送请求，如果失败则重试
      const sendRequest = () => {
        console.log(`[Content Script] Sending request for ${screenName}, requestId: ${requestId}`);
        window.postMessage({
          type: '__fetchLocation',
          screenName,
          requestId
        }, '*');
      };

      sendRequest();

      // 设置一个检查，如果3秒后还没收到响应，可能是页面脚本未准备好
      checkTimer = setTimeout(() => {
        if (!resolved && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying request for ${screenName} (attempt ${retryCount}/${maxRetries})`);
          // 重新注入页面脚本
          injectPageScript();
          setTimeout(sendRequest, 1000);
        }
      }, 3000);

      // 超时处理
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          clearTimeout(checkTimer);
          window.removeEventListener('message', handler);
          console.log(`Request timeout for ${screenName}, not caching`);
          resolve(null);
        }
      }, 15000); // 增加到15秒
    });
  }

  async function getUserLocation(screenName) {
    if (locationCache.has(screenName)) {
      const cached = locationCache.get(screenName);
      if (cached !== null) {
        console.log(`Using cached location for ${screenName}: ${cached}`);
        return cached;
      } else {
        console.log(`Found null in cache for ${screenName}, will retry API call`);
        locationCache.delete(screenName);
      }
    }

    console.log(`Queueing API request for ${screenName}`);
    return new Promise((resolve, reject) => {
      requestQueue.push({ screenName, resolve, reject });
      processRequestQueue();
    });
  }

  // ==================== DOM处理 ====================
  function extractUsername(element) {
    const usernameElement = element.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');
    if (usernameElement) {
      const links = usernameElement.querySelectorAll('a[href^="/"]');
      for (const link of links) {
        const href = link.getAttribute('href');
        const match = href.match(/^\/([^\/\?]+)/);
        if (match && match[1]) {
          const username = match[1];
          const excludedRoutes = ['home', 'explore', 'notifications', 'messages', 'i', 'compose', 'search', 'settings', 'bookmarks', 'lists', 'communities'];
          if (!excludedRoutes.includes(username) &&
              !username.startsWith('hashtag') &&
              !username.startsWith('search') &&
              username.length > 0 &&
              username.length < 20) {
            return username;
          }
        }
      }
    }

    const allLinks = element.querySelectorAll('a[href^="/"]');
    const seenUsernames = new Set();

    for (const link of allLinks) {
      const href = link.getAttribute('href');
      if (!href) continue;

      const match = href.match(/^\/([^\/\?]+)/);
      if (!match || !match[1]) continue;

      const potentialUsername = match[1];

      if (seenUsernames.has(potentialUsername)) continue;
      seenUsernames.add(potentialUsername);

      const excludedRoutes = ['home', 'explore', 'notifications', 'messages', 'i', 'compose', 'search', 'settings', 'bookmarks', 'lists', 'communities', 'hashtag'];
      if (excludedRoutes.some(route => potentialUsername === route || potentialUsername.startsWith(route))) {
        continue;
      }

      if (potentialUsername.includes('status') || potentialUsername.match(/^\d+$/)) {
        continue;
      }

      const text = link.textContent?.trim() || '';
      const linkText = text.toLowerCase();
      const usernameLower = potentialUsername.toLowerCase();

      if (text.startsWith('@')) {
        return potentialUsername;
      }

      if (linkText === usernameLower || linkText === `@${usernameLower}`) {
        return potentialUsername;
      }

      const parent = link.closest('[data-testid="UserName"], [data-testid="User-Name"]');
      if (parent) {
        if (potentialUsername.length > 0 && potentialUsername.length < 20 && !potentialUsername.includes('/')) {
          return potentialUsername;
        }
      }

      if (text && text.trim().startsWith('@')) {
        const atUsername = text.trim().substring(1);
        if (atUsername === potentialUsername) {
          return potentialUsername;
        }
      }
    }

    const textContent = element.textContent || '';
    const atMentionMatches = textContent.matchAll(/@([a-zA-Z0-9_]+)/g);
    for (const match of atMentionMatches) {
      const username = match[1];
      const link = element.querySelector(`a[href="/${username}"], a[href^="/${username}?"]`);
      if (link) {
        const isInUserNameContainer = link.closest('[data-testid="UserName"], [data-testid="User-Name"]');
        if (isInUserNameContainer) {
          return username;
        }
      }
    }

    return null;
  }

  function findHandleSection(container, screenName) {
    return Array.from(container.querySelectorAll('div')).find(div => {
      const link = div.querySelector(`a[href="/${screenName}"]`);
      if (link) {
        const text = link.textContent?.trim();
        return text === `@${screenName}`;
      }
      return false;
    });
  }

  function createLoadingShimmer() {
    const shimmer = document.createElement('span');
    shimmer.setAttribute('data-twitter-flag-shimmer', 'true');
    shimmer.style.display = 'inline-block';
    shimmer.style.width = '20px';
    shimmer.style.height = '16px';
    shimmer.style.marginLeft = '4px';
    shimmer.style.marginRight = '4px';
    shimmer.style.verticalAlign = 'middle';
    shimmer.style.borderRadius = '2px';
    shimmer.style.background = 'linear-gradient(90deg, rgba(113, 118, 123, 0.2) 25%, rgba(113, 118, 123, 0.4) 50%, rgba(113, 118, 123, 0.2) 75%)';
    shimmer.style.backgroundSize = '200% 100%';
    shimmer.style.animation = 'shimmer 1.5s infinite';

    if (!document.getElementById('twitter-flag-shimmer-style')) {
      const style = document.createElement('style');
      style.id = 'twitter-flag-shimmer-style';
      style.textContent = `
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return shimmer;
  }

  async function addFlagToUsername(usernameElement, screenName) {
    if (usernameElement.dataset.flagAdded === 'true') {
      return;
    }

    if (processingUsernames.has(screenName)) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (usernameElement.dataset.flagAdded === 'true') {
        return;
      }
      usernameElement.dataset.flagAdded = 'waiting';
      return;
    }

    usernameElement.dataset.flagAdded = 'processing';
    processingUsernames.add(screenName);

    const userNameContainer = usernameElement.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');

    const shimmerSpan = createLoadingShimmer();
    let shimmerInserted = false;

    if (userNameContainer) {
      const handleSection = findHandleSection(userNameContainer, screenName);
      if (handleSection && handleSection.parentNode) {
        try {
          handleSection.parentNode.insertBefore(shimmerSpan, handleSection);
          shimmerInserted = true;
        } catch (e) {
          try {
            userNameContainer.appendChild(shimmerSpan);
            shimmerInserted = true;
          } catch (e2) {
            console.log('Failed to insert shimmer');
          }
        }
      } else {
        try {
          userNameContainer.appendChild(shimmerSpan);
          shimmerInserted = true;
        } catch (e) {
          console.log('Failed to insert shimmer');
        }
      }
    }

    try {
      console.log(`Processing flag for ${screenName}...`);

      const location = await getUserLocation(screenName);
      console.log(`Location for ${screenName}:`, location);

      if (shimmerInserted && shimmerSpan.parentNode) {
        shimmerSpan.remove();
      }

      if (!location) {
        console.log(`No location found for ${screenName}, marking as failed`);
        usernameElement.dataset.flagAdded = 'failed';
        return;
      }

      const flag = getCountryFlag(location);
      if (!flag) {
        console.log(`No flag found for location: ${location}`);
        if (shimmerInserted && shimmerSpan.parentNode) {
          shimmerSpan.remove();
        }
        usernameElement.dataset.flagAdded = 'failed';
        return;
      }

      console.log(`Found flag ${flag} for ${screenName} (${location})`);

      let usernameLink = null;
      const containerForLink = userNameContainer || usernameElement.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');

      if (containerForLink) {
        const containerLinks = containerForLink.querySelectorAll('a[href^="/"]');
        for (const link of containerLinks) {
          const text = link.textContent?.trim();
          const href = link.getAttribute('href');
          const match = href.match(/^\/([^\/\?]+)/);

          if (match && match[1] === screenName) {
            if (text === `@${screenName}` || text === screenName) {
              usernameLink = link;
              break;
            }
          }
        }
      }

      if (!usernameLink && containerForLink) {
        const containerLinks = containerForLink.querySelectorAll('a[href^="/"]');
        for (const link of containerLinks) {
          const text = link.textContent?.trim();
          if (text === `@${screenName}`) {
            usernameLink = link;
            break;
          }
        }
      }

      if (!usernameLink) {
        const links = usernameElement.querySelectorAll('a[href^="/"]');
        for (const link of links) {
          const href = link.getAttribute('href');
          const text = link.textContent?.trim();
          if ((href === `/${screenName}` || href.startsWith(`/${screenName}?`)) &&
              (text === `@${screenName}` || text === screenName)) {
            usernameLink = link;
            break;
          }
        }
      }

      if (!usernameLink) {
        const links = usernameElement.querySelectorAll('a[href^="/"]');
        for (const link of links) {
          const href = link.getAttribute('href');
          const match = href.match(/^\/([^\/\?]+)/);
          if (match && match[1] === screenName) {
            const hasVerificationBadge = link.closest('[data-testid="User-Name"]')?.querySelector('[data-testid="icon-verified"]');
            if (!hasVerificationBadge || link.textContent?.trim() === `@${screenName}`) {
              usernameLink = link;
              break;
            }
          }
        }
      }

      if (!usernameLink) {
        console.error(`Could not find username link for ${screenName}`);
        if (shimmerInserted && shimmerSpan.parentNode) {
          shimmerSpan.remove();
        }
        usernameElement.dataset.flagAdded = 'failed';
        return;
      }

      console.log(`Found username link for ${screenName}:`, usernameLink.href, usernameLink.textContent?.trim());

      const existingFlag = usernameElement.querySelector('[data-twitter-flag]');
      if (existingFlag) {
        if (shimmerInserted && shimmerSpan.parentNode) {
          shimmerSpan.remove();
        }
        usernameElement.dataset.flagAdded = 'true';
        return;
      }

      const flagSpan = document.createElement('span');
      flagSpan.textContent = ` ${flag}`;
      flagSpan.setAttribute('data-twitter-flag', 'true');
      flagSpan.style.marginLeft = '4px';
      flagSpan.style.marginRight = '4px';
      flagSpan.style.display = 'inline';
      flagSpan.style.color = 'inherit';
      flagSpan.style.verticalAlign = 'middle';

      const containerForFlag = userNameContainer || usernameElement.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');

      if (!containerForFlag) {
        console.error(`Could not find UserName container for ${screenName}`);
        if (shimmerInserted && shimmerSpan.parentNode) {
          shimmerSpan.remove();
        }
        usernameElement.dataset.flagAdded = 'failed';
        return;
      }

      const verificationBadge = containerForFlag.querySelector('[data-testid="icon-verified"]');
      const handleSection = findHandleSection(containerForFlag, screenName);

      let inserted = false;

      if (handleSection && handleSection.parentNode === containerForFlag) {
        try {
          containerForFlag.insertBefore(flagSpan, handleSection);
          inserted = true;
          console.log(`✓ Inserted flag before handle section for ${screenName}`);
        } catch (e) {
          console.log('Failed to insert before handle section:', e);
        }
      }

      if (!inserted && handleSection && handleSection.parentNode) {
        try {
          const handleParent = handleSection.parentNode;
          if (handleParent !== containerForFlag && handleParent.parentNode) {
            handleParent.parentNode.insertBefore(flagSpan, handleParent);
            inserted = true;
            console.log(`✓ Inserted flag before handle parent for ${screenName}`);
          } else if (handleParent === containerForFlag) {
            containerForFlag.insertBefore(flagSpan, handleSection);
            inserted = true;
            console.log(`✓ Inserted flag before handle section (direct child) for ${screenName}`);
          }
        } catch (e) {
          console.log('Failed to insert before handle parent:', e);
        }
      }

      if (!inserted && handleSection) {
        try {
          const displayNameLink = containerForFlag.querySelector('a[href^="/"]');
          if (displayNameLink) {
            const displayNameContainer = displayNameLink.closest('div');
            if (displayNameContainer && displayNameContainer.parentNode) {
              if (displayNameContainer.parentNode === handleSection.parentNode) {
                displayNameContainer.parentNode.insertBefore(flagSpan, handleSection);
                inserted = true;
                console.log(`✓ Inserted flag between display name and handle (siblings) for ${screenName}`);
              } else {
                displayNameContainer.parentNode.insertBefore(flagSpan, displayNameContainer.nextSibling);
                inserted = true;
                console.log(`✓ Inserted flag after display name container for ${screenName}`);
              }
            }
          }
        } catch (e) {
          console.log('Failed to insert after display name:', e);
        }
      }

      if (!inserted) {
        try {
          containerForFlag.appendChild(flagSpan);
          inserted = true;
          console.log(`✓ Inserted flag at end of UserName container for ${screenName}`);
        } catch (e) {
          console.error('Failed to append flag to User-Name container:', e);
        }
      }

      if (inserted) {
        usernameElement.dataset.flagAdded = 'true';
        console.log(`✓ Successfully added flag ${flag} for ${screenName} (${location})`);

        const waitingContainers = document.querySelectorAll(`[data-flag-added="waiting"]`);
        waitingContainers.forEach(container => {
          const waitingUsername = extractUsername(container);
          if (waitingUsername === screenName) {
            addFlagToUsername(container, screenName).catch(() => {});
          }
        });
      } else {
        console.error(`✗ Failed to insert flag for ${screenName} - tried all strategies`);
        if (shimmerInserted && shimmerSpan.parentNode) {
          shimmerSpan.remove();
        }
        usernameElement.dataset.flagAdded = 'failed';
      }
    } catch (error) {
      console.error(`Error processing flag for ${screenName}:`, error);
      if (shimmerInserted && shimmerSpan.parentNode) {
        shimmerSpan.remove();
      }
      usernameElement.dataset.flagAdded = 'failed';
    } finally {
      processingUsernames.delete(screenName);
    }
  }

  function removeAllFlags() {
    const flags = document.querySelectorAll('[data-twitter-flag]');
    flags.forEach(flag => flag.remove());

    const shimmers = document.querySelectorAll('[data-twitter-flag-shimmer]');
    shimmers.forEach(shimmer => shimmer.remove());

    const containers = document.querySelectorAll('[data-flag-added]');
    containers.forEach(container => {
      delete container.dataset.flagAdded;
    });

    console.log('Removed all flags');
  }

  async function processUsernames() {
    if (!extensionEnabled) {
      return;
    }

    // 防止重复处理
    if (isProcessing) {
      return;
    }

    isProcessing = true;

    try {
      const containers = document.querySelectorAll('article[data-testid="tweet"], [data-testid="UserCell"], [data-testid="User-Names"], [data-testid="User-Name"]');

      console.log(`Processing ${containers.length} containers for usernames`);

      let foundCount = 0;
      let processedCount = 0;
      let skippedCount = 0;

      for (const container of containers) {
        const screenName = extractUsername(container);
        if (screenName) {
          foundCount++;
          const status = container.dataset.flagAdded;
          if (!status || status === 'failed') {
            processedCount++;
            addFlagToUsername(container, screenName).catch(err => {
              console.error(`Error processing ${screenName}:`, err);
              container.dataset.flagAdded = 'failed';
            });
          } else {
            skippedCount++;
          }
        }
      }

      if (foundCount > 0 && processedCount > 0) {
        console.log(`Found ${foundCount} usernames, processing ${processedCount} new ones, skipped ${skippedCount} already processed`);
      }
    } finally {
      isProcessing = false;
    }
  }

  // 防抖版本的processUsernames
  function debouncedProcessUsernames() {
    if (processTimer) {
      clearTimeout(processTimer);
    }
    processTimer = setTimeout(() => {
      processUsernames();
    }, 1000);
  }

  function initObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver((mutations) => {
      if (!extensionEnabled) {
        return;
      }

      let shouldProcess = false;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          // 只处理实际的内容节点，忽略脚本和样式
          if (node.nodeType === 1 &&
              (node.tagName === 'ARTICLE' ||
               node.querySelector?.('article[data-testid="tweet"], [data-testid="UserCell"], [data-testid="User-Name"]'))) {
            shouldProcess = true;
            break;
          }
        }
        if (shouldProcess) break;
      }

      if (shouldProcess) {
        debouncedProcessUsernames();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ==================== 初始化 ====================
  async function init() {
    console.log('Twitter Location Flag userscript initialized');

    loadEnabledState();
    loadCache();

    if (!extensionEnabled) {
      console.log('Extension is disabled');
      return;
    }

    injectPageScript();

    setTimeout(() => {
      processUsernames();
    }, 2000);

    initObserver();

    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        console.log('Page navigation detected, reprocessing usernames');
        // 重新注入页面脚本（SPA导航可能丢失）
        injectPageScript();
        setTimeout(() => {
          processUsernames();
        }, 2000);
      }
    }).observe(document, { subtree: true, childList: true });

    setInterval(saveCache, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

