// ==UserScript==
// @name         Filter X.com Location
// @namespace    mailto:arabalika@noreplay.codeberg.org
// @version      0.2.7
// @description  Script to filter X content by user location.
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @connect      filter-x-api.phdogee.workers.dev
// @license AGPL3.0
// @downloadURL https://update.greasyfork.org/scripts/557600/Filter%20Xcom%20Location.user.js
// @updateURL https://update.greasyfork.org/scripts/557600/Filter%20Xcom%20Location.meta.js
// ==/UserScript==

(() => {
  // --- CONFIGURATION ---
  const queryUrl = "https://x.com/i/api/graphql/XRqGa7EeokUU5kppkh13EA/AboutAccountQuery";
  const authToken = "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

  const REMOTE_DB_URL = "https://filter-x-api.phdogee.workers.dev";

  // SETTINGS
  const READ_BATCH_DELAY = 75; // Wait 75ms to collect users for Reading
  const WRITE_BATCH_DELAY = 2000; // Wait 2s to collect users for Writing (Uploading)
  const WRITE_BATCH_SIZE = 5; // Or upload immediately if we have 5 users waiting

  const REQUEST_DELAY = 2000;
  const RANDOM_JITTER = 500;
  const RATE_LIMIT_PAUSE = 60000;
  const MAX_RETRIES = 5;
  const CACHE_TTL = 1000 * 60 * 60 * 24 * 30;
  const CONCURRENT_API_LIMIT = 2;

  const csrfToken = decodeURIComponent(document.cookie.match(/(?:^|; )ct0=([^;]+)/)?.[1] || "");

  const cache = new Map();
  const pending = new Map();
  const apiQueue = [];

  let activeRequests = 0; // concurrency control
  let isRateLimited = false;

  // READ Batching
  let readBuffer = [];
  let readTimeout = null;

  // WRITE Batching
  let writeBuffer = new Map();
  let writeTimeout = null;

  const storedValues = localStorage.getItem("tweetFilterValues");
  let filterValues = storedValues ? storedValues.split("\n").filter(Boolean) : [];
  let filterMode = localStorage.getItem("tweetFilterMode") || "blacklist";
  let filterEnabled = localStorage.getItem("tweetFilterEnabled") === "true";

  const countryFlags = new Map([
    ["Afghanistan", "🇦🇫"],
    ["Åland Islands", "🇦🇽"],
    ["Albania", "🇦🇱"],
    ["Algeria", "🇩🇿"],
    ["American Samoa", "🇦🇸"],
    ["Andorra", "🇦🇩"],
    ["Angola", "🇦🇴"],
    ["Anguilla", "🇦🇮"],
    ["Antarctica", "🇦🇶"],
    ["Antigua and Barbuda", "🇦🇬"],
    ["Argentina", "🇦🇷"],
    ["Armenia", "🇦🇲"],
    ["Aruba", "🇦🇼"],
    ["Australia", "🇦🇺"],
    ["Austria", "🇦🇹"],
    ["Azerbaijan", "🇦🇿"],
    ["Bahamas", "🇧🇸"],
    ["Bahrain", "🇧🇭"],
    ["Bangladesh", "🇧🇩"],
    ["Barbados", "🇧🇧"],
    ["Belarus", "🇧🇾"],
    ["Belgium", "🇧🇪"],
    ["Belize", "🇧🇿"],
    ["Benin", "🇧🇯"],
    ["Bermuda", "🇧🇲"],
    ["Bhutan", "🇧🇹"],
    ["Bolivia, Plurinational State of", "🇧🇴"],
    ["Bonaire, Sint Eustatius and Saba", "🇧🇶"],
    ["Bosnia and Herzegovina", "🇧🇦"],
    ["Botswana", "🇧🇼"],
    ["Bouvet Island", "🇧🇻"],
    ["Brazil", "🇧🇷"],
    ["British Indian Ocean Territory", "🇮🇴"],
    ["Brunei Darussalam", "🇧🇳"],
    ["Bulgaria", "🇧🇬"],
    ["Burkina Faso", "🇧🇫"],
    ["Burundi", "🇧🇮"],
    ["Cambodia", "🇰🇭"],
    ["Cameroon", "🇨🇲"],
    ["Canada", "🇨🇦"],
    ["Cape Verde", "🇨🇻"],
    ["Cayman Islands", "🇰🇾"],
    ["Central African Republic", "🇨🇫"],
    ["Chad", "🇹🇩"],
    ["Chile", "🇨🇱"],
    ["China", "🇨🇳"],
    ["Christmas Island", "🇨🇽"],
    ["Cocos (Keeling) Islands", "🇨🇨"],
    ["Colombia", "🇨🇴"],
    ["Comoros", "🇰🇲"],
    ["Congo", "🇨🇬"],
    ["Congo, the Democratic Republic of the", "🇨🇩"],
    ["Cook Islands", "🇨🇰"],
    ["Costa Rica", "🇨🇷"],
    ["Côte d'Ivoire", "🇨🇮"],
    ["Croatia", "🇭🇷"],
    ["Cuba", "🇨🇺"],
    ["Curaçao", "🇨🇼"],
    ["Cyprus", "🇨🇾"],
    ["Czech Republic", "🇨🇿"],
    ["Denmark", "🇩🇰"],
    ["Djibouti", "🇩🇯"],
    ["Dominica", "🇩🇲"],
    ["Dominican Republic", "🇩🇴"],
    ["Ecuador", "🇪🇨"],
    ["Egypt", "🇪🇬"],
    ["El Salvador", "🇸🇻"],
    ["Equatorial Guinea", "🇬🇶"],
    ["Eritrea", "🇪🇷"],
    ["Estonia", "🇪🇪"],
    ["Ethiopia", "🇪🇹"],
    ["Falkland Islands (Malvinas)", "🇫🇰"],
    ["Faroe Islands", "🇫🇴"],
    ["Fiji", "🇫🇯"],
    ["Finland", "🇫🇮"],
    ["France", "🇫🇷"],
    ["French Guiana", "🇬🇫"],
    ["French Polynesia", "🇵🇫"],
    ["French Southern Territories", "🇹🇫"],
    ["Gabon", "🇬🇦"],
    ["Gambia", "🇬🇲"],
    ["Georgia", "🇬🇪"],
    ["Germany", "🇩🇪"],
    ["Ghana", "🇬🇭"],
    ["Gibraltar", "🇬🇮"],
    ["Greece", "🇬🇷"],
    ["Greenland", "🇬🇱"],
    ["Grenada", "🇬🇩"],
    ["Guadeloupe", "🇬🇵"],
    ["Guam", "🇬🇺"],
    ["Guatemala", "🇬🇹"],
    ["Guernsey", "🇬🇬"],
    ["Guinea", "🇬🇳"],
    ["Guinea-Bissau", "🇬🇼"],
    ["Guyana", "🇬🇾"],
    ["Haiti", "🇭🇹"],
    ["Heard Island and McDonald Islands", "🇭🇲"],
    ["Holy See (Vatican City State)", "🇻🇦"],
    ["Honduras", "🇭🇳"],
    ["Hong Kong", "🇭🇰"],
    ["Hungary", "🇭🇺"],
    ["Iceland", "🇮🇸"],
    ["India", "🇮🇳"],
    ["Indonesia", "🇮🇩"],
    ["Iran, Islamic Republic of", "🇮🇷"],
    ["Iraq", "🇮🇶"],
    ["Ireland", "🇮🇪"],
    ["Isle of Man", "🇮🇲"],
    ["Israel", "🇮🇱"],
    ["Italy", "🇮🇹"],
    ["Jamaica", "🇯🇲"],
    ["Japan", "🇯🇵"],
    ["Jersey", "🇯🇪"],
    ["Jordan", "🇯🇴"],
    ["Kazakhstan", "🇰🇿"],
    ["Kenya", "🇰🇪"],
    ["Kiribati", "🇰🇮"],
    ["Korea, Democratic People's Republic of", "🇰🇵"],
    ["Korea, Republic of", "🇰🇷"],
    ["Kuwait", "🇰🇼"],
    ["Kyrgyzstan", "🇰🇬"],
    ["Lao People's Democratic Republic", "🇱🇦"],
    ["Latvia", "🇱🇻"],
    ["Lebanon", "🇱🇧"],
    ["Lesotho", "🇱🇸"],
    ["Liberia", "🇱🇷"],
    ["Libya", "🇱🇾"],
    ["Liechtenstein", "🇱🇮"],
    ["Lithuania", "🇱🇹"],
    ["Luxembourg", "🇱🇺"],
    ["Macao", "🇲🇴"],
    ["Macedonia, the Former Yugoslav Republic of", "🇲🇰"],
    ["Madagascar", "🇲🇬"],
    ["Malawi", "🇲🇼"],
    ["Malaysia", "🇲🇾"],
    ["Maldives", "🇲🇻"],
    ["Mali", "🇲🇱"],
    ["Malta", "🇲🇹"],
    ["Marshall Islands", "🇲🇭"],
    ["Martinique", "🇲🇶"],
    ["Mauritania", "🇲🇷"],
    ["Mauritius", "🇲🇺"],
    ["Mayotte", "🇾🇹"],
    ["Mexico", "🇲🇽"],
    ["Micronesia, Federated States of", "🇫🇲"],
    ["Moldova, Republic of", "🇲🇩"],
    ["Monaco", "🇲🇨"],
    ["Mongolia", "🇲🇳"],
    ["Montenegro", "🇲🇪"],
    ["Montserrat", "🇲🇸"],
    ["Morocco", "🇲🇦"],
    ["Mozambique", "🇲🇿"],
    ["Myanmar", "🇲🇲"],
    ["Namibia", "🇳🇦"],
    ["Nauru", "🇳🇷"],
    ["Nepal", "🇳🇵"],
    ["Netherlands", "🇳🇱"],
    ["New Caledonia", "🇳🇨"],
    ["New Zealand", "🇳🇿"],
    ["Nicaragua", "🇳🇮"],
    ["Niger", "🇳🇪"],
    ["Nigeria", "🇳🇬"],
    ["Niue", "🇳🇺"],
    ["Norfolk Island", "🇳🇫"],
    ["Northern Mariana Islands", "🇲🇵"],
    ["Norway", "🇳🇴"],
    ["Oman", "🇴🇲"],
    ["Pakistan", "🇵🇰"],
    ["Palau", "🇵🇼"],
    ["Palestine, State of", "🇵🇸"],
    ["Panama", "🇵🇦"],
    ["Papua New Guinea", "🇵🇬"],
    ["Paraguay", "🇵🇾"],
    ["Peru", "🇵🇪"],
    ["Philippines", "🇵🇭"],
    ["Pitcairn", "🇵🇳"],
    ["Poland", "🇵🇱"],
    ["Portugal", "🇵🇹"],
    ["Puerto Rico", "🇵🇷"],
    ["Qatar", "🇶🇦"],
    ["Réunion", "🇷🇪"],
    ["Romania", "🇷🇴"],
    ["Russian Federation", "🇷🇺"],
    ["Rwanda", "🇷🇼"],
    ["Saint Barthélemy", "🇧🇱"],
    ["Saint Helena, Ascension and Tristan da Cunha", "🇸🇭"],
    ["Saint Kitts and Nevis", "🇰🇳"],
    ["Saint Lucia", "🇱🇨"],
    ["Saint Martin (French part)", "🇲🇫"],
    ["Saint Pierre and Miquelon", "🇵🇲"],
    ["Saint Vincent and the Grenadines", "🇻🇨"],
    ["Samoa", "🇼🇸"],
    ["San Marino", "🇸🇲"],
    ["Sao Tome and Principe", "🇸🇹"],
    ["Saudi Arabia", "🇸🇦"],
    ["Senegal", "🇸🇳"],
    ["Serbia", "🇷🇸"],
    ["Seychelles", "🇸🇨"],
    ["Sierra Leone", "🇸🇱"],
    ["Singapore", "🇸🇬"],
    ["Sint Maarten (Dutch part)", "🇸🇽"],
    ["Slovakia", "🇸🇰"],
    ["Slovenia", "🇸🇮"],
    ["Solomon Islands", "🇸🇧"],
    ["Somalia", "🇸🇴"],
    ["South Africa", "🇿🇦"],
    ["South Georgia and the South Sandwich Islands", "🇬🇸"],
    ["South Sudan", "🇸🇸"],
    ["Spain", "🇪🇸"],
    ["Sri Lanka", "🇱🇰"],
    ["Sudan", "🇸🇩"],
    ["Suriname", "🇸🇷"],
    ["Svalbard and Jan Mayen", "🇸🇯"],
    ["Eswatini", "🇸🇿"],
    ["Sweden", "🇸🇪"],
    ["Switzerland", "🇨🇭"],
    ["Syrian Arab Republic", "🇸🇾"],
    ["Taiwan", "🇹🇼"],
    ["Tajikistan", "🇹🇯"],
    ["Tanzania, United Republic of", "🇹🇿"],
    ["Thailand", "🇹🇭"],
    ["Timor-Leste", "🇹🇱"],
    ["Togo", "🇹🇬"],
    ["Tokelau", "🇹🇰"],
    ["Tonga", "🇹🇴"],
    ["Trinidad and Tobago", "🇹🇹"],
    ["Tunisia", "🇹🇳"],
    ["Turkey", "🇹🇷"],
    ["Turkmenistan", "🇹🇲"],
    ["Turks and Caicos Islands", "🇹🇨"],
    ["Tuvalu", "🇹🇻"],
    ["Uganda", "🇺🇬"],
    ["Ukraine", "🇺🇦"],
    ["United Arab Emirates", "🇦🇪"],
    ["United Kingdom", "🇬🇧"],
    ["United States", "🇺🇸"],
    ["United States Minor Outlying Islands", "🇺🇲"],
    ["Uruguay", "🇺🇾"],
    ["Uzbekistan", "🇺🇿"],
    ["Vanuatu", "🇻🇺"],
    ["Venezuela, Bolivarian Republic of", "🇻🇪"],
    ["Viet Nam", "🇻🇳"],
    ["Virgin Islands, British", "🇻🇬"],
    ["Virgin Islands, U.S.", "🇻🇮"],
    ["Wallis and Futuna", "🇼🇫"],
    ["Western Sahara", "🇪🇭"],
    ["Yemen", "🇾🇪"],
    ["Zambia", "🇿🇲"],
    ["Zimbabwe", "🇿🇼"],
    ["Europe", "🌍"],
    ["East Asia & Pacific", "🌏"],
    ["North America", "🌎"],
    ["South America", "🌎"],
    ["Eastern Europe (Non-EU)", "🌍"],
    ["West Asia", "🌏"],
    ["South Asia", "🌏"],
    ["Australasia", "🌏"],
  ]);

  const dbPromise = new Promise((resolve) => {
    const request = indexedDB.open("aboutAccountCache", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("countries");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });

  if (!csrfToken) return;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- HELPER: CSP BYPASS ---
  const gmFetch = (url, options) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method || "GET",
        url: url,
        headers: options.headers,
        data: options.body,
        onload: (res) => {
          resolve({
             ok: res.status >= 200 && res.status < 300,
             status: res.status,
             json: () => Promise.resolve(JSON.parse(res.responseText))
          });
        },
        onerror: (e) => reject(e)
      });
    });
  };

  // --- 1. LOCAL STORAGE LOGIC ---
  const saveCountry = (username, country) => {
    dbPromise.then((db) => {
      if (!db) return;
      const tx = db.transaction("countries", "readwrite");
      tx.objectStore("countries").put({ country, timestamp: Date.now() }, username);
    });
  };

  const getFromDb = (username) => {
      return dbPromise.then((db) => {
          if (!db) return null;
          return new Promise((resolve) => {
              const tx = db.transaction("countries", "readonly");
              const req = tx.objectStore("countries").get(username);
              req.onsuccess = () => resolve(req.result);
              req.onerror = () => resolve(null);
          });
      });
  };

  // --- 2. REMOTE INTERACTION (BATCH READ & WRITE) ---

  // A. BATCH READ
  let readBlocked = false;

  const flushReadBatch = async () => {
    const batch = [...new Set(readBuffer)];
    readBuffer = [];
    readTimeout = null;
    if (batch.length === 0) return;

    if (readBlocked || REMOTE_DB_URL.includes("YOUR-SUBDOMAIN")) {
        batch.forEach(u => apiQueue.push(u));
        processApiQueue();
        return;
    }

    try {
      const res = await gmFetch(REMOTE_DB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "batch_read", usernames: batch })
      });

      if (!res.ok) {
          if (res.status === 429 || res.status >= 500) {
             console.warn(`[Filter X] Cloudflare Read Failed (${res.status}). Switching to local-only mode.`);
             readBlocked = true;
          }
          throw new Error(`Worker returned ${res.status}`);
      }

      const results = await res.json();

      batch.forEach(username => {
        if (results[username]) {
          const country = results[username];
          cache.set(username, country);
          saveCountry(username, country);
          finalizeUser(username, country);
        } else {
          apiQueue.push(username);
          processApiQueue();
        }
      });
    } catch (e) {

      console.warn("[Filter X] Read Batch Failed", e);
      batch.forEach(u => apiQueue.push(u));
      processApiQueue();
    }
  };

  const addToReadBatch = (username) => {
    readBuffer.push(username);
    if (!readTimeout) readTimeout = setTimeout(flushReadBatch, READ_BATCH_DELAY);
  };

  // B. BATCH WRITE
  let writeBlocked = false;

  const flushWriteBatch = async () => {
    if (writeBlocked) {
        writeBuffer.clear();
        return;
    }

    const batch = Array.from(writeBuffer, ([username, location]) => ({ username, location }));
    writeBuffer.clear();
    writeTimeout = null;

    if (batch.length === 0) return;
    if (REMOTE_DB_URL.includes("YOUR-SUBDOMAIN")) return;

    try {
      const res = await gmFetch(REMOTE_DB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "batch_write", entries: batch })
      });
      if (res.status === 429) {
          writeBlocked = true;
          return;
      }
    } catch (e) {
      console.warn("[Filter X] Write Error", e);
    }
  };

  const addToWriteBatch = (username, location) => {
    if (writeBlocked) return;
    if (!username || !location) return;

    writeBuffer.set(username, location);

    if (writeBuffer.size >= WRITE_BATCH_SIZE) {
        if (writeTimeout) clearTimeout(writeTimeout);
        flushWriteBatch();
    } else if (!writeTimeout) {
        writeTimeout = setTimeout(flushWriteBatch, WRITE_BATCH_DELAY);
    }
  };

  // --- 3. X API LOGIC ---
  const fetchCountry = async (username) => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
      try {
        const params = new URLSearchParams({ variables: JSON.stringify({ screenName: username }) });
        const res = await fetch(`${queryUrl}?${params.toString()}`, {
          method: "GET",
          headers: { authorization: authToken, "x-csrf-token": csrfToken },
          credentials: "include",
        });

        if (res.status === 429) return "RATE_LIMIT";
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const about = (await res.json())?.data?.user_result_by_screen_name?.result?.about_profile;
        return about?.account_based_in;
      } catch (e) {
         await wait(1000 * (attempt + 1) + Math.random() * 500);
      }
    }
    return null;
  };

  const processApiQueue = () => {
    if (isRateLimited || activeRequests >= CONCURRENT_API_LIMIT || apiQueue.length === 0) return;

    while (activeRequests < CONCURRENT_API_LIMIT && apiQueue.length > 0) {
        const username = apiQueue.shift();

        if (cache.has(username)) {
            finalizeUser(username, cache.get(username));
            continue;
        }

        activeRequests++;

        (async () => {
            try {
                const country = await fetchCountry(username);

                if (country === "RATE_LIMIT") {
                    isRateLimited = true;
                    apiQueue.unshift(username);
                    setTimeout(() => {
                        isRateLimited = false;
                        processApiQueue();
                    }, RATE_LIMIT_PAUSE);
                    return;
                }

                if (country) {
                    cache.set(username, country);
                    saveCountry(username, country);
                    addToWriteBatch(username, country);
                    finalizeUser(username, country);
                } else {
                    pending.delete(username);
                }
            } finally {
                activeRequests--;
                const delay = (REQUEST_DELAY / CONCURRENT_API_LIMIT) + (Math.random() * RANDOM_JITTER);
                setTimeout(processApiQueue, delay);
            }
        })();
    }
  };

  // --- 4. DOM LOGIC ---
  const finalizeUser = (username, country) => {
      const targets = pending.get(username);
      if (!targets) return;
      targets.forEach(({ container, tweet, type }) => applyCountry(username, container, tweet, country, type));
      pending.delete(username);
  };

  const enqueue = (username, container, tweet, type = "tweet") => {
    if (cache.has(username)) {
      applyCountry(username, container, tweet, cache.get(username), type);
      return;
    }

    const existingTargets = pending.get(username);
    if (existingTargets) {
      existingTargets.push({ container, tweet, type });
      return;
    }
    pending.set(username, [{ container, tweet, type }]);

    getFromDb(username).then((record) => {
        if (!pending.has(username)) return;

        if (record && (Date.now() - record.timestamp < CACHE_TTL)) {
            cache.set(username, record.country);
            finalizeUser(username, record.country);
        } else {
            addToReadBatch(username);
        }
    });
  };

  const applyCountry = (username, container, targetElement, country, type = "tweet") => {
    const flag = countryFlags.get(country) || country;
    const flagText = ` ${flag}`;

    let matchesFilter = false;
    if (filterEnabled && filterValues.length && country) {
      const lowerCountry = country.toLowerCase();
      const match = filterValues.some((value) => lowerCountry.includes(value.toLowerCase()));
      matchesFilter = filterMode === "whitelist" ? !match : match;
    }

    const shouldBlock = matchesFilter;

    if (container) {
        const existing = container.querySelector(".filter-x-flag");
        let flagNode;

        if (existing) {
          flagNode = existing;
          flagNode.textContent = flagText;
        } else {
          flagNode = document.createElement("span");
          flagNode.className = "filter-x-flag";
          flagNode.dataset.accountBasedIn = "true";
          flagNode.textContent = flagText;
          flagNode.style.padding = type === "profile" ? "0px" : "0px 10px";
          flagNode.style.cursor = "help";
          container.appendChild(flagNode);
        }
        flagNode.title = country;
    }

    if (type === "tweet" && targetElement) {
        const tweetWrapper = targetElement.closest?.('[data-testid="tweet"]') || targetElement.parentElement?.parentElement?.parentElement;
        if (tweetWrapper) {
            tweetWrapper.style.display = shouldBlock ? "none" : "";
        }
    }
  };

  const handleTweet = (tweet) => {
    const userNameRoot = tweet.querySelector('[data-testid="User-Name"]');
    if (!userNameRoot) return;

    const anchor = userNameRoot.querySelector("a");
    const username = anchor?.getAttribute("href")?.replace(/^\//, "");
    if (!username) return;

    let container = anchor;
    while (container.parentElement && container.parentElement !== userNameRoot) {
      container = container.parentElement;
    }

    enqueue(username, container, tweet, "tweet");
  };

  const handleProfile = (headerStats) => {
      const pathParts = window.location.pathname.split('/');
      const username = pathParts[1];
      if (!username) return;

      const ignoreList = ["home", "explore", "notifications", "messages", "settings", "search", "bookmarks"];
      if (ignoreList.includes(username)) return;

      const primaryCol = document.querySelector('[data-testid="primaryColumn"]');
      const nameContainer = primaryCol?.querySelector('[data-testid="UserName"]');
      enqueue(username, nameContainer, null, "profile");
  };

  const onUrlChange = () => {
      const profileHeader = document.querySelector('[data-testid="UserProfileHeader_Items"]');
      if (profileHeader) {
          delete profileHeader.dataset.filterXObserved;
          profileHeader.querySelector('.filter-x-flag')?.remove();
          handleProfile(profileHeader);
      }
  };

  // Hook into history API
  const originalPushState = history.pushState;
  history.pushState = function() {
      const res = originalPushState.apply(this, arguments);
      onUrlChange();
      return res;
  };
  const originalReplaceState = history.replaceState;
  history.replaceState = function() {
      const res = originalReplaceState.apply(this, arguments);
      onUrlChange();
      return res;
  };
  window.addEventListener('popstate', onUrlChange);

  const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              handleTweet(entry.target);
              observer.unobserve(entry.target);
          }
      });
  };

  const tweetObserver = new IntersectionObserver(observerCallback, { rootMargin: "200px 0px" });

  const findTweets = (root) => {
    if (root.matches?.('[data-testid="tweet"]') && !root.dataset.filterXObserved) {
         root.dataset.filterXObserved = "true";
         tweetObserver.observe(root);
         return;
    }
    if (root.querySelectorAll) {
        const tweets = root.querySelectorAll('[data-testid="tweet"]:not([data-filter-x-observed])');
        for (let i = 0; i < tweets.length; i++) {
             const tweet = tweets[i];
             tweet.dataset.filterXObserved = "true";
             tweetObserver.observe(tweet);
        }
    }
  };

  const findProfile = (root) => {
     const profileHeader = root.matches?.('[data-testid="UserProfileHeader_Items"]')
        ? root
        : root.querySelector?.('[data-testid="UserProfileHeader_Items"]');

     if (!profileHeader) return;

     const currentUsername = window.location.pathname.split('/')[1];
     const observedUsername = profileHeader.dataset.filterXObserved;

     if (observedUsername && observedUsername !== currentUsername) {
         profileHeader.querySelector('.filter-x-flag')?.remove();
         profileHeader.dataset.filterXObserved = ""; // Force reset
     }

     if (!profileHeader.dataset.filterXObserved && currentUsername) {
         profileHeader.dataset.filterXObserved = currentUsername;
         handleProfile(profileHeader);
     }
  };

  const findNav = (root) => {
    const nav = root.querySelector?.('header[role="banner"] nav') || (root.matches?.('nav') && root.closest('header[role="banner"]') ? root : null);

    if (!nav || nav.querySelector("[data-cutoff-config]")) return;

    const wrapper = document.createElement("div");
    wrapper.dataset.cutoffConfig = "true";
    wrapper.style.margin = "8px 0";
    wrapper.style.fontFamily = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    wrapper.innerHTML = `
      <button type="button" aria-haspopup="menu" aria-expanded="false" style="width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: inherit; font-size: 20px; font-weight: 400; line-height: 24px;">
        <svg viewBox="0 0 24 24" aria-hidden="true" style="width: 1.75rem; height: 1.75rem; flex-shrink: 0;"><path d="M4 5h16v2l-6 6v4l-4 2v-6L4 7z" fill="currentColor"></path></svg>
        <span style="white-space: nowrap;">Filters</span>
      </button>
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 12px; min-width: 220px; border-radius: 12px; background: #000; display: none; z-index: 1000; border: 1px solid #333; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
        <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: white;">
          <input type="checkbox" ${filterEnabled ? "checked" : ""}>
          Enable filter
        </label>
        <label style="display: block; color: white;">
          Filter entries (one per line)
          <textarea style="width: 100%; margin-top: 4px; min-height: 80px; background: #222; color: white; border: 1px solid #444;">${filterValues.join("\n")}</textarea>
        </label>
        <label style="display: block; margin-top: 8px; color: white;">
          Mode
          <select style="width: 100%; margin-top: 4px; background: #222; color: white; border: 1px solid #444;">
            <option value="blacklist"${filterMode === "blacklist" ? " selected" : ""}>Blacklist</option>
            <option value="whitelist"${filterMode === "whitelist" ? " selected" : ""}>Whitelist</option>
          </select>
        </label>
      </div>
    `;
    const button = wrapper.querySelector("button");
    const menu = wrapper.querySelector("div");
    const checkbox = menu?.querySelector('input[type="checkbox"]');
    const textarea = menu?.querySelector("textarea");
    const select = menu?.querySelector("select");
    if (!button || !menu || !checkbox || !textarea || !select) return;

    button.addEventListener("click", () => {
      menu.style.display = "block";
      button.setAttribute("aria-expanded", "true");
    });
    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) {
        menu.style.display = "none";
        button.setAttribute("aria-expanded", "false");
      }
    });
    checkbox.addEventListener("change", () => {
      filterEnabled = checkbox.checked;
      localStorage.setItem("tweetFilterEnabled", filterEnabled.toString());
      document.querySelectorAll('[data-testid="tweet"]').forEach(t => handleTweet(t));
      const profileH = document.querySelector('[data-testid="UserProfileHeader_Items"]');
      if(profileH) handleProfile(profileH);
    });
    textarea.addEventListener("change", () => {
      filterValues = textarea.value
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean);
      localStorage.setItem("tweetFilterValues", filterValues.join("\n"));
      document.querySelectorAll('[data-testid="tweet"]').forEach(t => handleTweet(t));
      const profileH = document.querySelector('[data-testid="UserProfileHeader_Items"]');
      if(profileH) handleProfile(profileH);
    });
    select.addEventListener("change", () => {
      filterMode = select.value;
      localStorage.setItem("tweetFilterMode", filterMode);
      document.querySelectorAll('[data-testid="tweet"]').forEach(t => handleTweet(t));
      const profileH = document.querySelector('[data-testid="UserProfileHeader_Items"]');
      if(profileH) handleProfile(profileH);
    });
    nav.appendChild(wrapper);
  };

  findNav(document);
  findTweets(document);
  findProfile(document);

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
             findTweets(node);
             if (node.tagName === 'NAV' || node.querySelector?.('nav')) findNav(node);
             if (node.querySelector?.('[data-testid="UserProfileHeader_Items"]')) findProfile(node);
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });
})();