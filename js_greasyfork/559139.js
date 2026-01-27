// ==UserScript==
// @name         Npm Userscript
// @version      0.3.4
// @description  Various improvements and fixes for npmjs.com
// @license      MIT
// @author       Bjorn Lu
// @homepageURL  https://github.com/bluwy/npm-userscript
// @supportURL   https://github.com/bluwy/npm-userscript/issues
// @namespace    https://greasyfork.org/en/scripts/559139-npm-userscript
// @match        https://www.npmjs.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=npmjs.com
// @grant        GM.xmlHttpRequest
// @connect      api.github.com
// @connect      cdn.jsdelivr.net
// @connect      registry.npmjs.org
// @connect      npm-userscript.bjornlu.workers.dev
// @inject-into  content
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559139/Npm%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/559139/Npm%20Userscript.meta.js
// ==/UserScript==

(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/utils-cache.ts
  function setCache(key, value, expirySeconds) {
    key = CACHE_PREFIX + key;
    const data = {
      value,
      expireOn: expirySeconds ? Date.now() + expirySeconds * 1e3 : null
    };
    localStorage.setItem(key, JSON.stringify(data));
  }
  function getCache(key) {
    key = CACHE_PREFIX + key;
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { value, expireOn } = JSON.parse(cached);
    if (expireOn && Date.now() >= expireOn) {
      localStorage.removeItem(key);
      return null;
    }
    return value;
  }
  function clearCache(key) {
    key = CACHE_PREFIX + key;
    localStorage.removeItem(key);
  }
  function clearCacheByPrefix(prefix, except) {
    prefix = CACHE_PREFIX + prefix;
    except = except?.map((k2) => CACHE_PREFIX + k2);
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(prefix) && !except?.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }
  function clearExpiredCache() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        const cached = localStorage.getItem(key);
        if (cached) {
          const expiredOn = /"expireOn":(\d+|null)}$/.exec(cached)?.[1];
          if (expiredOn && expiredOn !== "null" && Date.now() >= Number(expiredOn)) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  }
  function hasCacheByPrefix(prefix) {
    prefix = CACHE_PREFIX + prefix;
    return Object.keys(localStorage).some((key) => key.startsWith(prefix));
  }
  function cacheResult(key, duration, fn) {
    if (key in _inMemoryCache) {
      return _inMemoryCache[key];
    }
    if (duration > 0) {
      const cached = cache.get(key);
      if (cached !== null) return JSON.parse(cached);
    }
    const result = fn();
    _inMemoryCache[key] = result;
    if (result.then) {
      result.then((resolved) => {
        _inMemoryCache[key] = resolved;
        if (duration > 0) {
          cache.set(key, JSON.stringify(resolved), duration);
        }
      });
    } else {
      if (duration > 0) {
        cache.set(key, JSON.stringify(result), duration);
      }
    }
    return result;
  }
  var CACHE_PREFIX, cache, _inMemoryCache;
  var init_utils_cache = __esm({
    "src/utils-cache.ts"() {
      CACHE_PREFIX = "npm-userscript:";
      cache = {
        set: setCache,
        get: getCache,
        clear: clearCache,
        clearByPrefix: clearCacheByPrefix,
        clearExpired: clearExpiredCache,
        hasByPrefix: hasCacheByPrefix
      };
      _inMemoryCache = {};
    }
  });

  // src/utils-npm-context.ts
  function getNpmContext() {
    if (_npmContext == null) {
      throw new Error("Npm context not yet extracted");
    }
    return _npmContext;
  }
  function listenNpmContextCode() {
    if (window.__context__ != null) {
      window.dispatchEvent(
        new CustomEvent("npm-userscript-npm-context:init", {
          // @ts-expect-error
          detail: JSON.stringify(window.__context__)
        })
      );
    } else {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          window.dispatchEvent(
            new CustomEvent("npm-userscript-npm-context:init", {
              // @ts-expect-error
              detail: JSON.stringify(window.__context__)
            })
          );
        },
        { once: true }
      );
    }
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this._npmUserscriptRequestUrl = typeof url === "string" ? url : null;
      if (this._npmUserscriptRequestUrl.startsWith("/")) {
        window.dispatchEvent(new CustomEvent("npm-userscript-npm-context:wait-update"));
      }
      return origOpen.call(this, method, url, ...rest);
    };
    XMLHttpRequest.prototype.send = function(...args) {
      if (this._npmUserscriptRequestUrl && this._npmUserscriptRequestUrl.startsWith("/")) {
        this.addEventListener("load", function() {
          const text = this.responseText;
          if (text.startsWith('{"')) {
            const context = JSON.parse(text);
            const __context__ = { ...window.__context__, context };
            window.dispatchEvent(
              new CustomEvent("npm-userscript-npm-context:update", {
                detail: JSON.stringify(__context__)
              })
            );
          }
        });
      }
      return origSend.apply(this, args);
    };
  }
  function listenNpmContext() {
    window.addEventListener(
      "npm-userscript-npm-context:init",
      (event) => {
        _npmContext = JSON.parse(event.detail);
      },
      { once: true }
    );
    let _resolve = null;
    window.addEventListener("npm-userscript-npm-context:wait-update", () => {
      _npmContextWaitPromise = new Promise((resolve) => {
        _resolve = resolve;
      });
    });
    window.addEventListener("npm-userscript-npm-context:update", (event) => {
      _npmContext = JSON.parse(event.detail);
      _resolve?.();
    });
    const script = document.createElement("script");
    script.textContent = `(${listenNpmContextCode.toString()})()`;
    document.body.appendChild(script);
  }
  async function waitForNpmContextReady() {
    if (_npmContextWaitPromise) return _npmContextWaitPromise;
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (_npmContext != null) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }
  var _npmContext, _npmContextWaitPromise;
  var init_utils_npm_context = __esm({
    "src/utils-npm-context.ts"() {
      _npmContext = null;
      _npmContextWaitPromise = null;
    }
  });

  // src/utils.ts
  function addStyle(css) {
    css = css.trim();
    if (styles.includes(css) || allStyles.includes(css)) return;
    styles.push(css);
  }
  function consolidateStyles() {
    const style = document.createElement("style");
    const combinedStyles = styles.join("\n");
    style.textContent = combinedStyles;
    allStyles += combinedStyles;
    document.head.appendChild(style);
    styles.length = 0;
  }
  async function waitForElement(selector, timeout = 1e3) {
    const element = document.querySelector(selector);
    if (element) return element;
    return new Promise((resolve, reject) => {
      const timeoutTimer = setTimeout(() => {
        clearInterval(queryTimer);
        clearInterval(timeoutTimer);
        reject(new Error(`Timeout waiting for element: ${selector}`));
      }, timeout);
      const queryTimer = setInterval(() => {
        const element2 = document.querySelector(selector);
        if (element2) {
          clearInterval(queryTimer);
          clearTimeout(timeoutTimer);
          resolve(element2);
        }
      }, 100);
    });
  }
  function getPackageName() {
    if (!location.pathname.startsWith("/package/")) return void 0;
    const str = location.pathname.slice("/package/".length);
    const parts = str.split("/");
    if (str[0] === "@") {
      return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : void 0;
    } else {
      return parts[0] || void 0;
    }
  }
  function getPackageVersion() {
    if (!location.pathname.startsWith("/package/")) return void 0;
    const match = /\/v\/(.+?)(?:$|\/|\?|#)/.exec(location.pathname);
    if (match) return match[1];
    return getNpmContext().context.packageVersion.version;
  }
  function isValidPackagePage() {
    return location.pathname.startsWith("/package/") && // if is a valid package, should be like "package-name - npm"
    document.title !== "npm";
  }
  function isSamePackagePage(previousUrl) {
    const previousPathname = new URL(previousUrl).pathname;
    const newPathname = location.pathname;
    return previousPathname === newPathname;
  }
  function getGitHubOwnerRepo() {
    const repositoryLink = getNpmContext().context.packument.repository;
    return /github\.com\/([^\/]+\/[^\/]+)/.exec(repositoryLink)?.[1];
  }
  function getNpmTarballUrl() {
    const packument = getNpmContext().context.packument;
    const versionData = packument.versions.find((v2) => v2.version = packument.version);
    return versionData.dist.tarball;
  }
  function prettyBytes(bytes) {
    if (bytes < 1e3) return `${bytes} B`;
    const units = ["kB", "MB", "GB", "TB"];
    let i2 = -1;
    do {
      bytes *= 1e-3;
      i2++;
    } while (bytes >= 1e3 && i2 < units.length - 1);
    const unit = units[i2];
    const num = unit === "kB" ? Math.round(bytes) : bytes.toFixed(2);
    return `${num} ${unit}`;
  }
  function ensureSidebarBalance() {
    const halfWidthColumns = document.querySelectorAll(
      '[aria-label="Package sidebar"] div.w-50:not(.w-100)'
    );
    if (halfWidthColumns.length % 2 === 1) {
      const lastColumn = halfWidthColumns[halfWidthColumns.length - 1];
      lastColumn.classList.add("w-100");
      lastColumnH3Text = lastColumn.querySelector("h3")?.textContent || null;
    }
  }
  function teardownSidebarBalance() {
    if (lastColumnH3Text) {
      const columns = document.querySelectorAll('[aria-label="Package sidebar"] div.w-50.w-100');
      const lastColumn = Array.from(columns).find(
        (col) => col.querySelector("h3")?.textContent === lastColumnH3Text
      );
      lastColumn?.classList.remove("w-100");
      lastColumnH3Text = null;
    }
  }
  var styles, allStyles, lastColumnH3Text;
  var init_utils = __esm({
    "src/utils.ts"() {
      init_utils_npm_context();
      styles = [];
      allStyles = "";
      lastColumnH3Text = null;
    }
  });

  // src/utils-fetch.ts
  async function getFullRepositoryLink() {
    const repository = getNpmContext().context.packument.repository;
    if (!repository) return;
    const packageJson = await fetchPackageJson();
    const directory = packageJson?.repository?.directory;
    if (!directory) return repository;
    return getRepositoryFilePath(directory);
  }
  async function getRepositoryFilePath(filePath) {
    const repository = getNpmContext().context.packument.repository;
    if (!repository) return;
    let repositoryFilePath = repository;
    if (!/\/tree\/.+$/.test(repository)) {
      const repoData = await fetchGitHubRepoData();
      if (!repoData) return;
      repositoryFilePath += `/tree/${repoData.default_branch}`;
    }
    if (repositoryFilePath.endsWith("/")) {
      repositoryFilePath = repositoryFilePath.slice(0, -1);
    }
    if (filePath.startsWith("/")) {
      filePath = filePath.slice(1);
    }
    if (filePath) {
      repositoryFilePath += `/${filePath}`;
    }
    return repositoryFilePath;
  }
  async function fetchPackageFilesData() {
    const packageName = getPackageName();
    const packageVersion = getPackageVersion();
    if (!packageName || !packageVersion) return void 0;
    return cacheResult(
      `fetchPackageFiles:${packageName}@${packageVersion}`,
      60,
      () => fetchJson(`https://www.npmjs.com/package/${packageName}/v/${packageVersion}/index`)
    );
  }
  async function fetchPackageFileContent(hex) {
    const packageName = getPackageName();
    if (!packageName) return void 0;
    return cacheResult(
      `fetchPackageFiles:${packageName}-${hex}`,
      0,
      () => fetchJson(`https://www.npmjs.com/package/${packageName}/file/${hex}`)
    );
  }
  async function fetchPackageJson() {
    const packageName = getPackageName();
    const packageVersion = getPackageVersion();
    if (!packageName || !packageVersion) return void 0;
    return cacheResult(
      `fetchPackageJson:${packageName}@${packageVersion}`,
      60,
      () => fetchJson(`https://registry.npmjs.org/${packageName}/${packageVersion}`)
    );
  }
  async function fetchGitHubRepoData() {
    const ownerRepo = getGitHubOwnerRepo();
    if (!ownerRepo) return void 0;
    return cacheResult(
      `fetchGitHubRepoData:${ownerRepo}`,
      60,
      () => fetchJson(`https://api.github.com/repos/${ownerRepo}`)
    );
  }
  async function fetchGitHubPullRequestsCount() {
    const ownerRepo = getGitHubOwnerRepo();
    if (!ownerRepo) return void 0;
    return cacheResult(`fetchPrCount:${ownerRepo}`, 60, async () => {
      const headers = await fetchHeaders(`https://api.github.com/repos/${ownerRepo}/pulls?per_page=1`);
      const match = /<https:\/\/api\.github\.com\/repositories\/\d+\/pulls\?per_page=1&page=(\d+)>;\s*rel="last"/.exec(
        headers
      );
      return match ? Number(match[1]) : 0;
    });
  }
  function fetchText(input, init) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        ...getSharedOptions(input, init, reject),
        responseType: "text",
        onload: (response) => {
          resolve(response.responseText);
        }
      });
    });
  }
  function fetchJson(input, init) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        ...getSharedOptions(input, init, reject),
        responseType: "json",
        onload: (response) => {
          resolve(response.response);
        }
      });
    });
  }
  function fetchHeaders(input, init) {
    return new Promise((resolve, reject) => {
      const req = GM.xmlHttpRequest({
        ...getSharedOptions(input, init, reject),
        onreadystatechange: (response) => {
          if (response.readyState === 2) {
            req.abort();
            resolve(response.responseHeaders);
          }
        }
      });
    });
  }
  function fetchStatus(input, init) {
    return new Promise((resolve, reject) => {
      const req = GM.xmlHttpRequest({
        ...getSharedOptions(input, init, reject),
        onreadystatechange: (response) => {
          if (response.readyState === 2) {
            req.abort();
            resolve(response.status);
          }
        }
      });
    });
  }
  function getSharedOptions(input, init, reject) {
    return {
      ...init,
      url: input instanceof Request ? input.url : input.toString(),
      // @ts-expect-error
      method: init?.method || "GET",
      headers: init?.headers ? init.headers instanceof Headers ? Object.fromEntries(init.headers.entries()) : Array.isArray(init.headers) ? Object.fromEntries(init.headers) : init.headers : void 0,
      data: init?.body?.toString() ?? void 0,
      onerror: (err) => reject(err),
      ontimeout: () => reject(new Error("Request timed out")),
      onabort: () => reject(new Error("Request aborted"))
    };
  }
  var init_utils_fetch = __esm({
    "src/utils-fetch.ts"() {
      init_utils_cache();
      init_utils_npm_context();
      init_utils();
    }
  });

  // src/features/better-dependencies.ts
  var better_dependencies_exports = {};
  __export(better_dependencies_exports, {
    description: () => description,
    run: () => run,
    runPre: () => runPre
  });
  function runPre() {
    addStyle(`
    #tabpanel-dependencies li sup {
      font-size: 0.875rem;
      top: -0.6rem;
      opacity: 0.7;
    }
  `);
    addStyle(`
    #tabpanel-dependencies li > a {
      color: var(--wombat-red);
    }
  `);
    addStyle(`
    #tabpanel-dependencies[data-attribute="hidden"] {
      display: none;
    }
  `);
    addStyle(`
    #tabpanel-dependencies > h2:not([data-npm-userscript-added]),
    #tabpanel-dependencies > ul:not([data-npm-userscript-added]) {
      display: none;
    }
  `);
  }
  async function run() {
    if (!isValidPackagePage()) return;
    if (new URLSearchParams(location.search).get("activeTab") !== "dependencies") return;
    if (document.querySelector('[aria-label="Peer Dependencies"]')) return;
    const packageJson = await fetchPackageJson();
    if (!packageJson) return;
    const section = document.getElementById("tabpanel-dependencies");
    if (!section) return;
    const h2 = section.querySelector("h2");
    const ul = section.querySelector("ul");
    const li = section.querySelector("li") ?? (() => {
      const el = document.createElement("li");
      el.className = "dib mr2";
      el.innerHTML = `<a class="f4 fw6 fl db pv1 ma2 black-70 link hover-black animate" href=""></a>`;
      return el;
    })();
    const peerDependencies = {};
    const optionalPeerDependencies = {};
    if (packageJson.peerDependencies) {
      for (const [depName, depVersion] of Object.entries(packageJson.peerDependencies)) {
        if (packageJson.peerDependenciesMeta?.[depName]?.optional === true) {
          optionalPeerDependencies[depName] = depVersion;
        } else {
          peerDependencies[depName] = depVersion;
        }
      }
    }
    const groups = [
      { title: "Dependencies", data: packageJson.dependencies },
      { title: "Peer Dependencies", data: peerDependencies },
      { title: "Optional Peer Dependencies", data: optionalPeerDependencies },
      { title: "Optional Dependencies", data: packageJson.optionalDependencies },
      { title: "Dev Dependencies", data: packageJson.devDependencies }
    ];
    const elements = [];
    for (const group of groups) {
      const normalizedData = group.data ? Object.entries(group.data).sort((a2, b2) => a2[0].localeCompare(b2[0])) : [];
      const newH2 = h2.cloneNode();
      newH2.setAttribute("data-npm-userscript-added", "true");
      newH2.textContent = `${group.title} (${normalizedData.length})`;
      elements.push(newH2);
      const newUl = ul.cloneNode();
      newUl.setAttribute("data-npm-userscript-added", "true");
      newUl.ariaLabel = group.title;
      for (const [depName, depVersion] of normalizedData) {
        const newLi = li.cloneNode(true);
        newLi.classList.remove("mr2");
        newLi.classList.add("mr1");
        newLi.querySelector("a").innerHTML = `${depName} <sup>${depVersion}</sup>`;
        newLi.querySelector("a").href = `/package/${encodeURIComponent(depName)}`;
        newUl.appendChild(newLi);
      }
      elements.push(newUl);
    }
    for (const el of elements) {
      section.appendChild(el);
    }
  }
  var description;
  var init_better_dependencies = __esm({
    "src/features/better-dependencies.ts"() {
      init_utils_fetch();
      init_utils();
      description = `Improved package dependencies tab with added peer dependencies info, optional dependencies info,
and dependency semver ranges.
`;
    }
  });

  // src/features/better-versions.ts
  var better_versions_exports = {};
  __export(better_versions_exports, {
    description: () => description2,
    run: () => run2,
    runPre: () => runPre2
  });
  function runPre2() {
    if (!isValidPackagePage()) return;
    addStyle(`
    table[aria-labelledby="current-tags"] tbody tr td,
    table[aria-labelledby="cumulated-versions"] tbody tr td,
    table[aria-labelledby="version-history"] tbody tr td {
      padding-bottom: 8px;
    }
  `);
    addStyle(`
    table[aria-labelledby="current-tags"] td > span:last-child > div,
    table[aria-labelledby="version-history"] td > span:last-child > div,
    table[aria-labelledby="current-tags"] td > span:last-child > div > button,
    table[aria-labelledby="version-history"] td > span:last-child > div > button {
      display: inline-block;
    }

    table[aria-labelledby="current-tags"] td > span:last-child > div > div,
    table[aria-labelledby="version-history"] td > span:last-child > div > div {
      right: calc(50% - 2px);
    }
  `);
    addStyle(`
    table[aria-labelledby="current-tags"] th:nth-child(1),
    table[aria-labelledby="cumulated-versions"] th:nth-child(1),
    table[aria-labelledby="version-history"] th:nth-child(1) {
      width: 37%;
    }
    table[aria-labelledby="current-tags"] th:nth-child(2),
    table[aria-labelledby="cumulated-versions"] th:nth-child(2),
    table[aria-labelledby="version-history"] th:nth-child(2) {
      width: 30%;
    }
    table[aria-labelledby="current-tags"] th:nth-child(3),
    table[aria-labelledby="cumulated-versions"] th:nth-child(3),
    table[aria-labelledby="version-history"] th:nth-child(3) {
      width: 33%;
    }
  `);
    addStyle(`
    #current-tags {
      margin-bottom: 0;
    }

    #cumulated-versions,
    #version-history {
      margin-top: 2rem;
      margin-bottom: 0;
    }
  `);
    addStyle(`
    table[aria-labelledby="cumulated-versions"] .npm-userscript-cumulated-versions-minor {
      display: none;
    }
    table[aria-labelledby="cumulated-versions"] .npm-userscript-cumulated-versions-minor[open] {
      display: table-row-group;
    }
  `);
  }
  function run2() {
    if (!isValidPackagePage()) return;
    if (new URLSearchParams(location.search).get("activeTab") !== "versions") return;
    addVersionTag();
    addCumulatedVersionsTable();
  }
  function addVersionTag() {
    if (document.querySelector(".npm-userscript-tag")) return;
    const versionToTags = {};
    document.querySelectorAll('table[aria-labelledby="current-tags"] tr').forEach((row) => {
      const version = row.querySelector("td a")?.textContent;
      const tag = row.querySelector("td:last-child")?.textContent;
      if (version && tag) {
        if (!versionToTags[version]) {
          versionToTags[version] = [];
        }
        versionToTags[version].push(tag);
      }
    });
    for (const [version, tags] of Object.entries(versionToTags)) {
      const row = document.querySelector(
        `table[aria-labelledby="version-history"] tr td a[href$="/v/${version}"]`
      );
      row?.insertAdjacentHTML(
        "afterend",
        `<span class="npm-userscript-tag ml2">(${tags.join(", ")})</span>`
      );
    }
  }
  function addCumulatedVersionsTable() {
    if (document.getElementById("cumulated-versions")) return;
    const versionHistoryH3 = document.querySelector("h3#version-history");
    if (!versionHistoryH3) return;
    const versionHistoryTable = document.querySelector('table[aria-labelledby="version-history"]');
    if (!versionHistoryTable) return;
    const newH3 = versionHistoryH3.cloneNode(true);
    newH3.id = "cumulated-versions";
    newH3.textContent = "Cumulated Versions";
    const newTable = versionHistoryTable.cloneNode(true);
    newTable.setAttribute("aria-labelledby", "cumulated-versions");
    const newBody = newTable.querySelector("tbody");
    if (!newBody) return;
    const majorToInfo = {};
    const minorToInfo = {};
    const npmContext = getNpmContext();
    for (const entry of npmContext.context.packument.versions) {
      const version = entry.version;
      const major = version.split(".")[0];
      const minor = version.split(".").slice(0, 2).join(".");
      const downloads = npmContext.context.versionsDownloads[version] || 0;
      const publishedText = entry.date.rel;
      if (!majorToInfo[major]) {
        majorToInfo[major] = {
          totalDownloads: 0,
          lastPublished: publishedText
        };
      }
      majorToInfo[major].totalDownloads += downloads;
      if (!minorToInfo[minor]) {
        minorToInfo[minor] = {
          totalDownloads: 0,
          lastPublished: publishedText
        };
      }
      minorToInfo[minor].totalDownloads += downloads;
    }
    newBody.remove();
    const keys = Object.keys(majorToInfo).sort((a2, b2) => parseInt(b2) - parseInt(a2));
    for (const major of keys) {
      const majorInfo = majorToInfo[major];
      const majorTbody = document.createElement("tbody");
      majorTbody.innerHTML = `
      <tr>
        <td style="cursor: pointer;"><span class="f5 black-80 lh-copy code">${major}.x</span></td>
        <td>${majorInfo.totalDownloads.toLocaleString()}</td>
        <td>${majorInfo.lastPublished}</td>
      </tr>
    `;
      const minorTbody = document.createElement("tbody");
      minorTbody.className = "npm-userscript-cumulated-versions-minor";
      const minorKeys = Object.keys(minorToInfo).filter((k2) => k2.startsWith(major + ".")).sort((a2, b2) => {
        const [aMajor, aMinor] = a2.split(".").map((n2) => parseInt(n2, 10));
        const [bMajor, bMinor] = b2.split(".").map((n2) => parseInt(n2, 10));
        if (aMajor !== bMajor) return bMajor - aMajor;
        return bMinor - aMinor;
      });
      for (const minor of minorKeys) {
        const minorInfo = minorToInfo[minor];
        minorTbody.innerHTML += `
        <tr>
          <td><span class="f6 black-80 code ml3">${minor}.x</span></td>
          <td class="o-80">${minorInfo.totalDownloads.toLocaleString()}</td>
          <td class="o-80">${minorInfo.lastPublished}</td>
        </tr>
      `;
      }
      majorTbody.querySelector("td")?.addEventListener("click", () => {
        minorTbody.toggleAttribute("open");
      });
      newTable.appendChild(majorTbody);
      newTable.appendChild(minorTbody);
    }
    versionHistoryH3.insertAdjacentElement("beforebegin", newH3);
    versionHistoryH3.insertAdjacentElement("beforebegin", newTable);
  }
  var description2;
  var init_better_versions = __esm({
    "src/features/better-versions.ts"() {
      init_utils_npm_context();
      init_utils();
      description2 = `Improved package versions tab with compact table view, cumulated versions table, show tags next to
versions, and fix provenance icon alignment.
`;
    }
  });

  // src/features/dim-mode.ts
  var dim_mode_exports = {};
  __export(dim_mode_exports, {
    description: () => description3,
    disabled: () => disabled,
    runPre: () => runPre3
  });
  function runPre3() {
    const white = "#e9e9e9";
    const whiteDarker = "#e0e0e0";
    addStyle(`
    :root {
      --bg: ${white};
      --background-color: ${white};
      --code-bg: ${whiteDarker};
    }
    .bg-white { background-color: ${white}; }
    table tr th, table tr td { background-color: ${white} !important; }
    table tr:nth-child(2n) td { background-color: #dfdfdf !important; }
  `);
  }
  var disabled, description3;
  var init_dim_mode = __esm({
    "src/features/dim-mode.ts"() {
      init_utils();
      disabled = true;
      description3 = `Make light mode less bright. Does not implement dark mode completely.
`;
    }
  });

  // node_modules/uhtml/dist/prod/dom.js
  function v(e3) {
    const t2 = u;
    return u = e3, t2;
  }
  function b(e3) {
    return T.bind({ previousValue: e3, value: e3, subs: void 0, subsTail: void 0, flags: 1 });
  }
  function x(e3) {
    const t2 = { fn: e3, subs: void 0, subsTail: void 0, deps: void 0, depsTail: void 0, flags: 2 };
    void 0 !== u ? s(t2, u) : void 0 !== d && s(t2, d);
    const n2 = v(t2);
    try {
      t2.fn();
    } finally {
      v(n2);
    }
    return D.bind(t2);
  }
  function y(e3) {
    const t2 = v(e3);
    a(e3);
    try {
      const t3 = e3.value;
      return t3 !== (e3.value = e3.getter(t3));
    } finally {
      v(t2), l(e3);
    }
  }
  function w(e3, t2) {
    return e3.flags = 1, e3.previousValue !== (e3.previousValue = t2);
  }
  function S(e3, t2) {
    if (16 & t2 || 32 & t2 && o(e3.deps, e3)) {
      const t3 = v(e3);
      a(e3);
      try {
        e3.fn();
      } finally {
        v(t3), l(e3);
      }
      return;
    }
    32 & t2 && (e3.flags = -33 & t2);
    let n2 = e3.deps;
    for (; void 0 !== n2; ) {
      const e4 = n2.dep, t3 = e4.flags;
      64 & t3 && S(e4, e4.flags = -65 & t3), n2 = n2.nextDep;
    }
  }
  function k() {
    for (; p < h; ) {
      const e3 = n[p];
      n[p++] = void 0, S(e3, e3.flags &= -65);
    }
    p = 0, h = 0;
  }
  function T(...e3) {
    if (!e3.length) {
      const e4 = this.value;
      if (16 & this.flags && w(this, e4)) {
        const e5 = this.subs;
        void 0 !== e5 && c(e5);
      }
      return void 0 !== u && s(this, u), e4;
    }
    {
      const t2 = e3[0];
      if (this.value !== (this.value = t2)) {
        this.flags = 17;
        const e4 = this.subs;
        void 0 !== e4 && (r(e4), f || k());
      }
    }
  }
  function D() {
    let e3 = this.deps;
    for (; void 0 !== e3; ) e3 = i(e3, this);
    const t2 = this.subs;
    void 0 !== t2 && i(t2), this.flags = 0;
  }
  function L() {
    return R.apply(null, arguments);
  }
  function Te(e3) {
    const t2 = H("<>"), n2 = H("</>");
    return e3.replaceChildren(t2, ...e3.childNodes, n2), be = true, P(e3, { [ye]: { writable: true, value: Q }, firstChild: { value: t2 }, lastChild: { value: n2 }, parentNode: we, valueOf: Ce, replaceWith: Se, remove: ke });
  }
  function at(e3, ...t2) {
    const n2 = rt.apply(null, arguments);
    return Ge() ? n2.valueOf(true) : n2;
  }
  var e, t, n, s, i, r, o, l, a, c, u, d, f, p, h, O, $, W, E, R, _, j, F, P, B, J, V, H, q, G, I, K, Q, U, X, Y, Z, ee, te, ne, se, ie, re, oe, le, ae, ce, ue, de, fe, pe, he, ve, ge, be, me, xe, ye, we, Se, ke, Ce, De, Oe, Ne, $e, We, Ae, Ee, Me, Re, Le, _e, je, Fe, Pe, Be, Je, Ve, ze, He, qe, Ge, Ie, Ke, Qe, Ue, Xe, Ye, Ze, et, tt, nt, st, it, rt, ot;
  var init_dom = __esm({
    "node_modules/uhtml/dist/prod/dom.js"() {
      !(function(e3) {
        e3[e3.None = 0] = "None", e3[e3.Mutable = 1] = "Mutable", e3[e3.Watching = 2] = "Watching", e3[e3.RecursedCheck = 4] = "RecursedCheck", e3[e3.Recursed = 8] = "Recursed", e3[e3.Dirty = 16] = "Dirty", e3[e3.Pending = 32] = "Pending";
      })(e || (e = {}));
      t = [];
      n = [];
      ({ link: s, unlink: i, propagate: r, checkDirty: o, endTracking: l, startTracking: a, shallowPropagate: c } = (function({ update: e3, notify: t2, unwatched: n2 }) {
        let s2 = 0;
        return { link: function(e4, t3) {
          const n3 = t3.depsTail;
          if (void 0 !== n3 && n3.dep === e4) return;
          let i3;
          if (4 & t3.flags && (i3 = void 0 !== n3 ? n3.nextDep : t3.deps, void 0 !== i3 && i3.dep === e4)) return i3.version = s2, void (t3.depsTail = i3);
          const r3 = e4.subsTail;
          if (void 0 !== r3 && r3.version === s2 && r3.sub === t3) return;
          const o3 = t3.depsTail = e4.subsTail = { version: s2, dep: e4, sub: t3, prevDep: n3, nextDep: i3, prevSub: r3, nextSub: void 0 };
          void 0 !== i3 && (i3.prevDep = o3);
          void 0 !== n3 ? n3.nextDep = o3 : t3.deps = o3;
          void 0 !== r3 ? r3.nextSub = o3 : e4.subs = o3;
        }, unlink: i2, propagate: function(e4) {
          let n3, s3 = e4.nextSub;
          e: for (; ; ) {
            const i3 = e4.sub;
            let r3 = i3.flags;
            if (3 & r3 && (60 & r3 ? 12 & r3 ? 4 & r3 ? 48 & r3 || !o2(e4, i3) ? r3 = 0 : (i3.flags = 40 | r3, r3 &= 1) : i3.flags = -9 & r3 | 32 : r3 = 0 : i3.flags = 32 | r3, 2 & r3 && t2(i3), 1 & r3)) {
              const t3 = i3.subs;
              if (void 0 !== t3) {
                e4 = t3, void 0 !== t3.nextSub && (n3 = { value: s3, prev: n3 }, s3 = e4.nextSub);
                continue;
              }
            }
            if (void 0 === (e4 = s3)) {
              for (; void 0 !== n3; ) if (e4 = n3.value, n3 = n3.prev, void 0 !== e4) {
                s3 = e4.nextSub;
                continue e;
              }
              break;
            }
            s3 = e4.nextSub;
          }
        }, checkDirty: function(t3, n3) {
          let s3, i3 = 0;
          e: for (; ; ) {
            const o3 = t3.dep, l2 = o3.flags;
            let a2 = false;
            if (16 & n3.flags) a2 = true;
            else if (17 & ~l2) {
              if (!(33 & ~l2)) {
                void 0 === t3.nextSub && void 0 === t3.prevSub || (s3 = { value: t3, prev: s3 }), t3 = o3.deps, n3 = o3, ++i3;
                continue;
              }
            } else if (e3(o3)) {
              const e4 = o3.subs;
              void 0 !== e4.nextSub && r2(e4), a2 = true;
            }
            if (a2 || void 0 === t3.nextDep) {
              for (; i3; ) {
                --i3;
                const o4 = n3.subs, l3 = void 0 !== o4.nextSub;
                if (l3 ? (t3 = s3.value, s3 = s3.prev) : t3 = o4, a2) {
                  if (e3(n3)) {
                    l3 && r2(o4), n3 = t3.sub;
                    continue;
                  }
                } else n3.flags &= -33;
                if (n3 = t3.sub, void 0 !== t3.nextDep) {
                  t3 = t3.nextDep;
                  continue e;
                }
                a2 = false;
              }
              return a2;
            }
            t3 = t3.nextDep;
          }
        }, endTracking: function(e4) {
          const t3 = e4.depsTail;
          let n3 = void 0 !== t3 ? t3.nextDep : e4.deps;
          for (; void 0 !== n3; ) n3 = i2(n3, e4);
          e4.flags &= -5;
        }, startTracking: function(e4) {
          ++s2, e4.depsTail = void 0, e4.flags = -57 & e4.flags | 4;
        }, shallowPropagate: r2 };
        function i2(e4, t3 = e4.sub) {
          const s3 = e4.dep, i3 = e4.prevDep, r3 = e4.nextDep, o3 = e4.nextSub, l2 = e4.prevSub;
          return void 0 !== r3 ? r3.prevDep = i3 : t3.depsTail = i3, void 0 !== i3 ? i3.nextDep = r3 : t3.deps = r3, void 0 !== o3 ? o3.prevSub = l2 : s3.subsTail = l2, void 0 !== l2 ? l2.nextSub = o3 : void 0 === (s3.subs = o3) && n2(s3), r3;
        }
        function r2(e4) {
          do {
            const n3 = e4.sub, s3 = e4.nextSub, i3 = n3.flags;
            32 == (48 & i3) && (n3.flags = 16 | i3, 2 & i3 && t2(n3)), e4 = s3;
          } while (void 0 !== e4);
        }
        function o2(e4, t3) {
          const n3 = t3.depsTail;
          if (void 0 !== n3) {
            let s3 = t3.deps;
            do {
              if (s3 === e4) return true;
              if (s3 === n3) break;
              s3 = s3.nextDep;
            } while (void 0 !== s3);
          }
          return false;
        }
      })({ update: (e3) => "getter" in e3 ? y(e3) : w(e3, e3.value), notify: function e2(t2) {
        const s2 = t2.flags;
        if (!(64 & s2)) {
          t2.flags = 64 | s2;
          const i2 = t2.subs;
          void 0 !== i2 ? e2(i2.sub) : n[h++] = t2;
        }
      }, unwatched(e3) {
        if ("getter" in e3) {
          let t2 = e3.deps;
          if (void 0 !== t2) {
            e3.flags = 17;
            do {
              t2 = i(t2, e3);
            } while (void 0 !== t2);
          }
        } else "previousValue" in e3 || D.call(e3);
      } }));
      f = 0;
      p = 0;
      h = 0;
      O = { greedy: false };
      $ = (e3) => {
        t.push(v(void 0));
        try {
          return e3();
        } finally {
          v(t.pop());
        }
      };
      W = class {
        constructor(e3, t2) {
          this._ = e3(t2);
        }
        get value() {
          return this._();
        }
        set value(e3) {
          this._(e3);
        }
        peek() {
          return $(this._);
        }
        valueOf() {
          return this.value;
        }
      };
      E = class extends W {
        constructor(e3) {
          super(b, [e3]);
        }
        get value() {
          return super.value[0];
        }
        set value(e3) {
          super.value = [e3];
        }
        peek() {
          return super.peek()[0];
        }
      };
      R = (e3, { greedy: t2 = false } = O) => t2 ? new E(e3) : new W(b, e3);
      _ = (e3) => {
        R = e3;
      };
      ({ isArray: j } = Array);
      ({ assign: F, defineProperties: P, entries: B, freeze: J } = Object);
      V = class {
        #e;
        constructor(e3) {
          this.#e = e3;
        }
        valueOf() {
          return this.#e;
        }
        toString() {
          return String(this.#e);
        }
      };
      H = (e3) => document.createComment(e3);
      q = 42;
      G = /* @__PURE__ */ new Set(["plaintext", "script", "style", "textarea", "title", "xmp"]);
      I = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"]);
      K = J({});
      Q = J([]);
      U = (e3, t2) => (e3.children === Q && (e3.children = []), e3.children.push(t2), t2.parent = e3, t2);
      X = (e3, t2, n2) => {
        e3.props === K && (e3.props = {}), e3.props[t2] = n2;
      };
      Y = (e3, t2, n2) => {
        e3 !== t2 && n2.push(e3);
      };
      Z = class {
        constructor(e3) {
          this.type = e3, this.parent = null;
        }
        toJSON() {
          return [this.type, this.data];
        }
      };
      ee = class extends Z {
        constructor(e3) {
          super(8), this.data = e3;
        }
        toString() {
          return `<!--${this.data}-->`;
        }
      };
      te = class extends Z {
        constructor(e3) {
          super(10), this.data = e3;
        }
        toString() {
          return `<!${this.data}>`;
        }
      };
      ne = class extends Z {
        constructor(e3) {
          super(3), this.data = e3;
        }
        toString() {
          return this.data;
        }
      };
      se = class extends Z {
        constructor() {
          super(q), this.name = "template", this.props = K, this.children = Q;
        }
        toJSON() {
          const e3 = [q];
          return Y(this.props, K, e3), Y(this.children, Q, e3), e3;
        }
        toString() {
          let e3 = "";
          for (const t2 in this.props) {
            const n2 = this.props[t2];
            null != n2 && ("boolean" == typeof n2 ? n2 && (e3 += ` ${t2}`) : e3 += ` ${t2}="${n2}"`);
          }
          return `<template${e3}>${this.children.join("")}</template>`;
        }
      };
      ie = class extends Z {
        constructor(e3, t2 = false) {
          super(1), this.name = e3, this.xml = t2, this.props = K, this.children = Q;
        }
        toJSON() {
          const e3 = [1, this.name, +this.xml];
          return Y(this.props, K, e3), Y(this.children, Q, e3), e3;
        }
        toString() {
          const { xml: e3, name: t2, props: n2, children: s2 } = this, { length: i2 } = s2;
          let r2 = `<${t2}`;
          for (const t3 in n2) {
            const s3 = n2[t3];
            null != s3 && ("boolean" == typeof s3 ? s3 && (r2 += e3 ? ` ${t3}=""` : ` ${t3}`) : r2 += ` ${t3}="${s3}"`);
          }
          if (i2) {
            r2 += ">";
            for (let n3 = !e3 && G.has(t2), o2 = 0; o2 < i2; o2++) r2 += n3 ? s2[o2].data : s2[o2];
            r2 += `</${t2}>`;
          } else r2 += e3 ? " />" : I.has(t2) ? ">" : `></${t2}>`;
          return r2;
        }
      };
      re = class extends Z {
        constructor() {
          super(11), this.name = "#fragment", this.children = Q;
        }
        toJSON() {
          const e3 = [11];
          return Y(this.children, Q, e3), e3;
        }
        toString() {
          return this.children.join("");
        }
      };
      oe = "\0";
      le = `"${oe}"`;
      ae = `'${oe}'`;
      ce = /\x00|<[^><\s]+/g;
      ue = /([^\s/>=]+)(?:=(\x00|(?:(['"])[\s\S]*?\3)))?/g;
      de = (e3, t2, n2, s2, i2) => [t2, n2, s2];
      fe = (e3) => {
        const t2 = [];
        for (; e3.parent; ) {
          switch (e3.type) {
            case q:
            case 1:
              "template" === e3.name && t2.push(-1);
          }
          t2.push(e3.parent.children.indexOf(e3)), e3 = e3.parent;
        }
        return t2;
      };
      pe = (e3, t2) => {
        do {
          e3 = e3.parent;
        } while (t2.has(e3));
        return e3;
      };
      he = (e3, t2) => t2 < 0 ? e3.content : e3.childNodes[t2];
      ve = (e3, t2) => t2.reduceRight(he, e3);
      be = false;
      me = ({ firstChild: e3, lastChild: t2 }) => {
        const n2 = ge || (ge = document.createRange());
        return n2.setStartAfter(e3), n2.setEndAfter(t2), n2.deleteContents(), e3;
      };
      xe = (e3, t2) => be && 11 === e3.nodeType ? 1 / t2 < 0 ? t2 ? me(e3) : e3.lastChild : t2 ? e3.valueOf() : e3.firstChild : e3;
      ye = /* @__PURE__ */ Symbol("nodes");
      we = { get() {
        return this.firstChild.parentNode;
      } };
      Se = { value(e3) {
        me(this).replaceWith(e3);
      } };
      ke = { value() {
        me(this).remove();
      } };
      Ce = { value() {
        const { parentNode: e3 } = this;
        if (e3 === this) this[ye] === Q && (this[ye] = [...this.childNodes]);
        else {
          if (e3) {
            let { firstChild: e4, lastChild: t2 } = this;
            for (this[ye] = [e4]; e4 !== t2; ) this[ye].push(e4 = e4.nextSibling);
          }
          this.replaceChildren(...this[ye]);
        }
        return this;
      } };
      Te.prototype = DocumentFragment.prototype;
      De = 16;
      Oe = 32768;
      Ne = ((e3 = globalThis.document) => {
        let t2, n2 = e3.createElement("template");
        return (s2, i2 = false) => {
          if (i2) return t2 || (t2 = e3.createRange(), t2.selectNodeContents(e3.createElementNS("http://www.w3.org/2000/svg", "svg"))), t2.createContextualFragment(s2);
          n2.innerHTML = s2;
          const r2 = n2.content;
          return n2 = n2.cloneNode(false), r2;
        };
      })(document);
      $e = /* @__PURE__ */ Symbol("ref");
      We = (e3, t2) => {
        for (const [n2, s2] of B(t2)) {
          const t3 = "role" === n2 ? n2 : `aria-${n2.toLowerCase()}`;
          null == s2 ? e3.removeAttribute(t3) : e3.setAttribute(t3, s2);
        }
      };
      Ae = (e3) => (t2, n2) => {
        null == n2 ? t2.removeAttribute(e3) : t2.setAttribute(e3, n2);
      };
      Ee = (e3, t2) => {
        e3[ye] = ((e4, t3, n2, s2) => {
          const i2 = s2.parentNode, r2 = t3.length;
          let o2 = e4.length, l2 = r2, a2 = 0, c2 = 0, u2 = null;
          for (; a2 < o2 || c2 < l2; ) if (o2 === a2) {
            const e5 = l2 < r2 ? c2 ? n2(t3[c2 - 1], -0).nextSibling : n2(t3[l2], 0) : s2;
            for (; c2 < l2; ) i2.insertBefore(n2(t3[c2++], 1), e5);
          } else if (l2 === c2) for (; a2 < o2; ) u2 && u2.has(e4[a2]) || n2(e4[a2], -1).remove(), a2++;
          else if (e4[a2] === t3[c2]) a2++, c2++;
          else if (e4[o2 - 1] === t3[l2 - 1]) o2--, l2--;
          else if (e4[a2] === t3[l2 - 1] && t3[c2] === e4[o2 - 1]) {
            const s3 = n2(e4[--o2], -0).nextSibling;
            i2.insertBefore(n2(t3[c2++], 1), n2(e4[a2++], -0).nextSibling), i2.insertBefore(n2(t3[--l2], 1), s3), e4[o2] = t3[l2];
          } else {
            if (!u2) {
              u2 = /* @__PURE__ */ new Map();
              let e5 = c2;
              for (; e5 < l2; ) u2.set(t3[e5], e5++);
            }
            const s3 = u2.get(e4[a2]) ?? -1;
            if (s3 < 0) n2(e4[a2++], -1).remove();
            else if (c2 < s3 && s3 < l2) {
              let r3 = a2, d2 = 1;
              for (; ++r3 < o2 && r3 < l2 && u2.get(e4[r3]) === s3 + d2; ) d2++;
              if (d2 > s3 - c2) {
                const r4 = n2(e4[a2], 0);
                for (; c2 < s3; ) i2.insertBefore(n2(t3[c2++], 1), r4);
              } else i2.replaceChild(n2(t3[c2++], 1), n2(e4[a2++], -1));
            } else a2++;
          }
          return t3;
        })(e3[ye] || Q, t2, xe, e3);
      };
      Me = /* @__PURE__ */ new WeakMap();
      Re = (e3, t2) => {
        const n2 = "object" == typeof t2 ? t2 ?? e3 : ((e4, t3) => {
          let n3 = Me.get(e4);
          return n3 ? n3.data = t3 : Me.set(e4, n3 = document.createTextNode(t3)), n3;
        })(e3, t2), s2 = e3[ye] ?? e3;
        n2 !== s2 && s2.replaceWith(xe(e3[ye] = n2, 1));
      };
      Le = (e3, t2) => {
        Re(e3, t2 instanceof W ? t2.value : t2);
      };
      _e = ({ dataset: e3 }, t2) => {
        for (const [n2, s2] of B(t2)) null == s2 ? delete e3[n2] : e3[n2] = s2;
      };
      je = /* @__PURE__ */ new Map();
      Fe = (e3) => {
        let t2 = je.get(e3);
        return t2 || je.set(e3, t2 = Pe(e3)), t2;
      };
      Pe = (e3) => (t2, n2) => {
        t2[e3] = n2;
      };
      Be = (e3, t2) => {
        for (const [n2, s2] of B(t2)) Ae(n2)(e3, s2);
      };
      Je = (e3, t2, n2) => n2 ? (n3, s2) => {
        const i2 = n3[t2];
        i2?.length && n3.removeEventListener(e3, ...i2), s2 && n3.addEventListener(e3, ...s2), n3[t2] = s2;
      } : (n3, s2) => {
        const i2 = n3[t2];
        i2 && n3.removeEventListener(e3, i2), s2 && n3.addEventListener(e3, s2), n3[t2] = s2;
      };
      Ve = (e3) => (t2, n2) => {
        t2.toggleAttribute(e3, !!n2);
      };
      ze = false;
      He = true;
      qe = (e3) => {
        He = e3;
      };
      Ge = () => He;
      Ie = (e3) => xe(e3.n ? e3.update(e3) : e3.valueOf(false), 1);
      Ke = (e3, t2) => {
        const n2 = [], s2 = e3.length, i2 = t2.length;
        for (let r2, o2, l2 = 0, a2 = 0; a2 < i2; a2++) r2 = t2[a2], n2[a2] = l2 < s2 && (o2 = e3[l2++]).t === r2.t ? (t2[a2] = o2).update(r2) : r2.valueOf(false);
        return n2;
      };
      Qe = (e3, t2, n2) => {
        const s2 = R, i2 = n2.length;
        let r2 = 0;
        _((e4) => r2 < i2 ? n2[r2++] : n2[r2++] = e4 instanceof W ? e4 : s2(e4));
        const o2 = Ge();
        o2 && qe(!o2);
        try {
          return e3(t2, Ze);
        } finally {
          o2 && qe(o2), _(s2);
        }
      };
      Ue = (e3, t2) => (e3.t === t2.t ? e3.update(t2) : (e3.n.replaceWith(Ie(t2)), e3 = t2), e3);
      Xe = (e3, t2, n2) => {
        let s2, i2 = [], r2 = [De, null, n2], o2 = true;
        return x(() => {
          if (o2) o2 = false, s2 = Qe(t2, n2, i2), i2.length || (i2 = Q), s2 ? (e3.replaceWith(Ie(s2)), r2[1] = s2) : e3.remove();
          else {
            const e4 = Qe(t2, n2, i2);
            s2 && Ue(s2, e4) === e4 && (r2[2] = s2 = e4);
          }
        }), r2;
      };
      Ye = /* @__PURE__ */ Symbol();
      Ze = {};
      et = class _et {
        constructor(e3, t2) {
          this.t = e3, this.v = t2, this.n = null, this.k = -1;
        }
        valueOf(e3 = Ge()) {
          const [t2, n2, s2] = this.t, i2 = document.importNode(t2, true), r2 = this.v;
          let o2, l2, a2, c2 = r2.length, u2 = Q;
          if (0 < c2) {
            for (u2 = n2.slice(0); c2--; ) {
              const [t3, s3, d3] = n2[c2], f3 = r2[c2];
              if (l2 !== t3 && (o2 = ve(i2, t3), l2 = t3), d3 & De) {
                const e4 = o2[Ye] || (o2[Ye] = {});
                if (d3 === De) {
                  for (const { name: t4, value: n3 } of o2.attributes) e4[t4] ??= n3;
                  e4.children ??= [...o2.content.childNodes], u2[c2] = Xe(o2, f3, e4);
                } else s3(e4, f3), u2[c2] = [d3, s3, e4];
              } else {
                let t4 = true;
                e3 || !(8 & d3) || d3 & Oe || (1 & d3 ? (t4 = false, f3.length && s3(o2, f3[0] instanceof _et ? Ke(Q, f3) : f3)) : f3 instanceof _et && (t4 = false, s3(o2, Ie(f3)))), t4 && (512 === d3 ? this.k = c2 : (16384 === d3 && (a2 ??= /* @__PURE__ */ new Set()).add(o2), s3(o2, f3))), u2[c2] = [d3, s3, f3, o2], e3 && 8 & d3 && o2.remove();
              }
            }
            a2 && ((e4) => {
              for (const t3 of e4) {
                const e5 = t3[$e];
                "function" == typeof e5 ? e5(t3) : e5 instanceof W ? e5.value = t3 : e5 && (e5.current = t3);
              }
            })(a2);
          }
          const { childNodes: d2 } = i2, f2 = d2.length, p2 = 1 === f2 ? d2[0] : f2 ? Te(i2) : i2;
          return this.v = u2, this.n = p2, -1 < this.k && s2.set(u2[this.k][2], p2, this), p2;
        }
        update(e3) {
          const t2 = this.k, n2 = this.v, s2 = e3.v;
          if (-1 < t2 && n2[t2][2] !== s2[t2]) return ((e4, t3) => e4.t[2].get(t3)?.update(e4) ?? e4.valueOf(false))(e3, s2[t2]);
          let { length: i2 } = n2;
          for (; i2--; ) {
            const e4 = n2[i2], [t3, r2, o2] = e4;
            if (512 === t3) continue;
            let l2 = s2[i2];
            if (t3 & De) if (t3 === De) {
              const t4 = l2(o2, Ze);
              r2 && Ue(r2, t4) === t4 && (e4[2] = t4);
            } else r2(o2, l2);
            else {
              let n3 = l2;
              if (1 & t3) {
                if (8 & t3) l2.length && l2[0] instanceof _et && (n3 = Ke(o2, l2));
                else if (256 & t3 && l2[0] === o2[0]) continue;
              } else if (8 & t3) if (t3 & Oe) {
                if (l2 === o2) {
                  r2(e4[3], n3);
                  continue;
                }
              } else o2 instanceof _et && (l2 = Ue(o2, l2), n3 = l2.n);
              l2 !== o2 && (e4[2] = l2, r2(e4[3], n3));
            }
          }
          return this.n;
        }
      };
      tt = /* @__PURE__ */ new WeakMap();
      nt = class extends Map {
        constructor() {
          super()._ = new FinalizationRegistry((e3) => this.delete(e3));
        }
        get(e3) {
          const t2 = super.get(e3)?.deref();
          return t2 && tt.get(t2);
        }
        set(e3, t2, n2) {
          tt.set(t2, n2), this._.register(t2, e3), super.set(e3, new WeakRef(t2));
        }
      };
      st = (({ Comment: e3 = ee, DocumentType: t2 = te, Text: n2 = ne, Fragment: s2 = re, Element: i2 = ie, Component: r2 = se, update: o2 = de }) => (l2, a2, c2) => {
        const u2 = l2.join(oe).trim(), d2 = /* @__PURE__ */ new Set(), f2 = [];
        let p2 = new s2(), h2 = 0, v2 = 0, g = 0, b2 = Q;
        for (const s3 of u2.matchAll(ce)) {
          if (0 < v2) {
            v2--;
            continue;
          }
          const l3 = s3[0], m = s3.index;
          if (h2 < m && U(p2, new n2(u2.slice(h2, m))), l3 === oe) {
            "table" === p2.name && (p2 = U(p2, new i2("tbody", c2)), d2.add(p2));
            const t3 = U(p2, new e3("\u25E6"));
            f2.push(o2(t3, 8, fe(t3), "", a2[g++])), h2 = m + 1;
          } else if (l3.startsWith("<!")) {
            const n3 = u2.indexOf(">", m + 2);
            if ("-->" === u2.slice(n3 - 2, n3 + 1)) {
              const t3 = u2.slice(m + 4, n3 - 2);
              "!" === t3[0] && U(p2, new e3(t3.slice(1).replace(/!$/, "")));
            } else U(p2, new t2(u2.slice(m + 2, n3)));
            h2 = n3 + 1;
          } else if (l3.startsWith("</")) {
            const e4 = u2.indexOf(">", m + 2);
            c2 && "svg" === p2.name && (c2 = false), p2 = pe(p2, d2), h2 = e4 + 1;
          } else {
            const e4 = m + l3.length, t3 = u2.indexOf(">", e4), s4 = l3.slice(1);
            let x2 = s4;
            if (s4 === oe ? (x2 = "template", p2 = U(p2, new r2()), b2 = fe(p2).slice(1), f2.push(o2(p2, q, b2, "", a2[g++]))) : (c2 || (x2 = x2.toLowerCase(), "table" !== p2.name || "tr" !== x2 && "td" !== x2 || (p2 = U(p2, new i2("tbody", c2)), d2.add(p2)), "tbody" === p2.name && "td" === x2 && (p2 = U(p2, new i2("tr", c2)), d2.add(p2))), p2 = U(p2, new i2(x2, !!c2 && "svg" !== x2)), b2 = Q), e4 < t3) {
              let n3 = false;
              for (const [s5, i3, r3] of u2.slice(e4, t3).matchAll(ue)) if (r3 === oe || r3 === le || r3 === ae || (n3 = i3.endsWith(oe))) {
                const e5 = b2 === Q ? b2 = fe(p2) : b2;
                f2.push(o2(p2, 2, e5, n3 ? i3.slice(0, -1) : i3, a2[g++])), n3 = false, v2++;
              } else X(p2, i3, !r3 || r3.slice(1, -1));
              b2 = Q;
            }
            h2 = t3 + 1;
            const y2 = 0 < t3 && "/" === u2[t3 - 1];
            if (c2) y2 && (p2 = p2.parent);
            else if (y2 || I.has(x2)) p2 = y2 ? pe(p2, d2) : p2.parent;
            else if ("svg" === x2) c2 = true;
            else if (G.has(x2)) {
              const e5 = u2.indexOf(`</${s4}>`, h2), t4 = u2.slice(h2, e5);
              t4.trim() === oe ? (v2++, f2.push(o2(p2, 3, fe(p2), "", a2[g++]))) : U(p2, new n2(t4)), p2 = p2.parent, h2 = e5 + s4.length + 3, v2++;
              continue;
            }
          }
        }
        return h2 < u2.length && U(p2, new n2(u2.slice(h2))), [p2, f2];
      })({ Comment: ee, DocumentType: te, Text: ne, Fragment: re, Element: ie, Component: se, update: (e3, t2, n2, s2, i2) => {
        switch (t2) {
          case q:
            return [n2, i2, De];
          case 8:
            return j(i2) ? [n2, Ee, 9] : i2 instanceof V ? [n2, (r2 = e3.xml, (e4, t3) => {
              const n3 = e4[$e] ?? (e4[$e] = {});
              n3.v !== t3 && (n3.f = Te(Ne(t3, r2)), n3.v = t3), Re(e4, n3.f);
            }), 8192] : i2 instanceof W ? [n2, Le, 32776] : [n2, Re, 8];
          case 3:
            return [n2, Fe("textContent"), 2048];
          case 2: {
            const t3 = e3.type === q;
            switch (s2.at(0)) {
              case "@": {
                const e4 = j(i2);
                return [n2, Je(s2.slice(1), Symbol(s2), e4), e4 ? 257 : 256];
              }
              case "?":
                return [n2, Ve(s2.slice(1)), 4096];
              case ".":
                return "..." === s2 ? [n2, t3 ? F : Be, t3 ? 144 : 128] : [n2, Pe(s2.slice(1)), t3 ? 80 : 64];
              default:
                return t3 ? [n2, Pe(s2), 1040] : "aria" === s2 ? [n2, We, 2] : "data" !== s2 || /^object$/i.test(e3.name) ? "key" === s2 ? [n2, ze = true, 512] : "ref" === s2 ? [n2, Fe($e), 16384] : s2.startsWith("on") ? [n2, Fe(s2.toLowerCase()), 64] : [n2, Ae(s2), 4] : [n2, _e, 32];
            }
          }
        }
        var r2;
      } });
      it = (e3, t2 = /* @__PURE__ */ new WeakMap()) => (n2, ...s2) => {
        let i2 = t2.get(n2);
        return i2 || (i2 = st(n2, s2, e3), i2.push((() => {
          const e4 = ze;
          return ze = false, e4;
        })() ? new nt() : null), i2[0] = Ne(i2[0].toString(), e3), t2.set(n2, i2)), new et(i2, s2);
      };
      rt = it(false);
      ot = it(true);
    }
  });

  // src/settings.ts
  var settings_exports = {};
  __export(settings_exports, {
    clearOutdatedSettings: () => clearOutdatedSettings,
    featureSettings: () => featureSettings,
    injectSettingsTrigger: () => injectSettingsTrigger
  });
  function localStorageStore(key, defaultValue) {
    const store = {
      get() {
        const v2 = localStorage.getItem(key);
        if (v2) return JSON.parse(v2);
        if (defaultValue != null) {
          store.reset();
          return JSON.parse(JSON.stringify(defaultValue));
        }
      },
      set(value) {
        localStorage.setItem(key, JSON.stringify(value));
      },
      reset() {
        if (defaultValue != null) {
          store.set(defaultValue);
        } else {
          localStorage.removeItem(key);
        }
      }
    };
    return store;
  }
  function Settings() {
    const featureStates = Object.fromEntries(
      Object.entries(featureSettings).map(([name, setting]) => [name, L(setting.get())])
    );
    return at`
    <div id="npm-userscript-settings" @click=${(e3) => e3.currentTarget.remove()}> }>
      <style>
        #npm-userscript-settings {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          font-family: 'Source Sans Pro', 'Lucida Grande', sans-serif;
        }
        #npm-userscript-settings .dialog {
          background-color: var(--background-color);
          width: 700px;
          max-width: 90vw;
          max-height: 90vh;
          padding: 16px;
          border-radius: 4px;
          overflow-y: auto;
        }
        #npm-userscript-settings h2 {
          margin: 0;
        }
        #npm-userscript-settings .features {
          font-size: 14px;
          margin: 12px 0 4px 0;
          color: var(--color-fg-muted);
        }
        #npm-userscript-settings .setting {
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          margin: 0 0 10px 0;
        }
        #npm-userscript-settings .setting > input {
          grid-area: 1 / 1 / 3 / 2;
          margin: 3px 6px 0 0;
        }
        #npm-userscript-settings .setting > span {
          grid-area: 1 / 2 / 2 / 3;
          font-weight: bold;
        }
        #npm-userscript-settings .setting > p {
          grid-area: 2 / 2 / 3 / 3; 
          margin: 4px 0 0 0;
          opacity: 0.6;
        }
        #npm-userscript-settings .footer {
          font-size: 12px;
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        #npm-userscript-settings .footer p {
          color: var(--color-fg-muted);
          margin: 0
        }
      </style>
      <div class="dialog" @click=${(e3) => e3.stopPropagation()}>
        <h2>Npm Userscript Settings</h2>
        <p class="features">Features</p>
        ${Object.entries(featureStates).map(([name, state]) => {
      return at`
            <label class="setting" key=${name}>
              <input
                type="checkbox"
                .checked=${state.value}
                @change=${(e3) => {
        const checked = e3.target.checked;
        featureSettings[name].set(checked);
        state.value = checked;
      }}
              />
              <span>${name}</span>
              <p>${allFeatures[name].description.trim().replace(/\n/g, " ")}</p>
            </label>
          `;
    })}
        <div class="footer">
          <p class="note">(Refresh page to view changes)</p>
          <button
            @click=${() => {
      Object.entries(featureStates).forEach(([name, state]) => {
        featureSettings[name].reset();
        state.value = featureSettings[name].get();
      });
    }}
          >
            Reset to defaults 
          </button>
        </button>
      </div>
    </div>
  `;
  }
  function injectSettingsTrigger() {
    if (document.querySelector(".npm-userscript-settings-trigger")) return;
    const button = document.createElement("button");
    button.classList.add("npm-userscript-settings-trigger");
    button.innerHTML = "Open Npm Userscript Settings";
    button.style.cssText = "font-size: 13px; border: 0px; background: none; cursor: pointer; padding: 0; opacity: 0.8;";
    button.onclick = () => document.body.append(at`<${Settings} />`);
    const sidebar = document.querySelector('[aria-label="Package sidebar"]');
    sidebar?.insertAdjacentElement("beforeend", button);
  }
  function clearOutdatedSettings() {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("npm-userscript:settings:feature:")) {
        const featureName = key.slice("npm-userscript:settings:feature:".length);
        if (!(featureName in allFeatures)) {
          localStorage.removeItem(key);
        }
      }
    }
  }
  var featureSettings;
  var init_settings = __esm({
    "src/settings.ts"() {
      init_dom();
      init_all_features();
      featureSettings = Object.fromEntries(
        Object.entries(allFeatures).map(([name, feature]) => {
          return [
            name,
            localStorageStore(`npm-userscript:settings:feature:${name}`, feature.disabled ? false : true)
          ];
        })
      );
    }
  });

  // src/features/fix-issue-pr-count.ts
  var fix_issue_pr_count_exports = {};
  __export(fix_issue_pr_count_exports, {
    description: () => description4,
    run: () => run3,
    runPre: () => runPre4,
    teardown: () => teardown
  });
  function teardown(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelectorAll(".npm-userscript-issue-pr-count").forEach((el) => el.remove());
  }
  async function runPre4() {
    if (!isValidPackagePage()) return;
    if ((await getFeatureSettings())["repository-card"].get() === true) return;
    addStyle(`
    #issues + p,
    #pulls + p {
      padding: 0;
      margin: 0;
    }

    #issues + p > a,
    #pulls + p > a {
      font-size: 1.25rem;
    }
  `);
    addStyle(`
    .npm-userscript-issue-pr-link {
      text-decoration: none;
    }

    .npm-userscript-issue-pr-link:focus,
    .npm-userscript-issue-pr-link:hover {
      text-decoration: underline;
      color: #cb3837;
    }
  `);
  }
  async function run3() {
    if (!isValidPackagePage()) return;
    if ((await getFeatureSettings())["repository-card"].get() === true) return;
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    if (document.getElementById("issues") || document.getElementById("pulls")) return;
    if (document.querySelector(".npm-userscript-issue-pr-count")) return;
    const ownerRepo = getGitHubOwnerRepo();
    if (!ownerRepo) return;
    const counts = await fetchIssueAndPrCount();
    let ref;
    if ((await getFeatureSettings())["stars"].get() === true) {
      ref = await waitForElement(".npm-userscript-stars-column", 5e3);
    } else {
      ref = getTotalFilesColumn();
    }
    if (!ref) return;
    if (document.getElementById("issues") || document.getElementById("pulls")) return;
    insertCountNode(ref, "Pull Requests", counts.pulls, `https://github.com/${ownerRepo}/pulls`);
    const c2 = insertCountNode(ref, "Issues", counts.issues, `https://github.com/${ownerRepo}/issues`);
    balanceColumn(c2);
  }
  function getTotalFilesColumn() {
    const sidebarColumns = document.querySelectorAll(
      '[aria-label="Package sidebar"] div.w-50:not(.w-100)'
    );
    return Array.from(sidebarColumns).find(
      (el) => el.querySelector("h3")?.textContent.includes("Total Files")
    );
  }
  function balanceColumn(column) {
    const sidebarColumns = document.querySelectorAll(
      '[aria-label="Package sidebar"] div.w-50:not(.w-100)'
    );
    const columnIndex = Array.from(sidebarColumns).indexOf(column);
    if (columnIndex % 2 === 1) {
      const previousColumn = sidebarColumns[columnIndex - 1];
      if (!previousColumn) return;
      previousColumn.classList.add("w-100");
    }
  }
  function insertCountNode(ref, name, count, link) {
    const cloned = ref.cloneNode(true);
    cloned.classList.add("npm-userscript-issue-pr-count");
    cloned.classList.remove("w-100");
    cloned.querySelector("h3").textContent = name;
    const linkHtml = `<a class="npm-userscript-issue-pr-link" href="${link}">${count}</a>`;
    cloned.querySelector("p").innerHTML = linkHtml;
    ref.insertAdjacentElement("afterend", cloned);
    return cloned;
  }
  async function fetchIssueAndPrCount() {
    const data = await fetchGitHubRepoData();
    if (!data) return { issues: 0, pulls: 0 };
    const prCount = await fetchGitHubPullRequestsCount();
    if (prCount === void 0) return { issues: 0, pulls: 0 };
    const issueAndPrCount = data.open_issues_count;
    const issues = issueAndPrCount - prCount;
    const pulls = prCount;
    return { issues, pulls };
  }
  async function getFeatureSettings() {
    const settings = await Promise.resolve().then(() => (init_settings(), settings_exports));
    return settings.featureSettings;
  }
  var description4;
  var init_fix_issue_pr_count = __esm({
    "src/features/fix-issue-pr-count.ts"() {
      init_utils_fetch();
      init_utils();
      description4 = `Show "Issue" and "Pull Requests" counts in the package sidebar. At the time of writing, npm's own
implementation is broken for large numbers for some reason. This temporarily fixes it.
`;
    }
  });

  // src/features/fix-styles.ts
  var fix_styles_exports = {};
  __export(fix_styles_exports, {
    description: () => description5,
    run: () => run4,
    runPre: () => runPre5
  });
  function runPre5() {
    if (isValidPackagePage()) {
      addStyle(`
      #repository + p,
      #homePage + p {
        padding: 0 !important;
        margin: 0 !important;
        text-decoration: none;
      }
    `);
      addStyle(`
      [aria-labelledby*=repository-link],
      [aria-labelledby*=homePage-link] {
        display: flex;
        align-items: center;
      }

      [aria-labelledby*=repository-link] > span {
        margin-right: 6px;
      }

      [aria-labelledby*=repository-link] > span > svg {
        display: block;
      }
    `);
      addStyle(`
      [aria-label="Package sidebar"] a.button > svg {
        margin-right: 8px;
      }
    `);
      addStyle(`
      button[aria-label="Copy install command line"] {
        right: -1px;
      }

      button[aria-label="Copy install command line"] > svg {
        margin-right: 0;
        margin-top: 4px;
      }
    `);
      addStyle(`
      h1 > div[data-nosnippet="true"] {
        display: flex;
      }
    `);
      addStyle(`
      aside[aria-label="Package sidebar"] > h3 + div {
        margin-bottom: 0;
      }
    `);
    }
    if (/^\/settings\/.+?\/members/.test(location.pathname)) {
      addStyle(`
      #tabpanel-members h3 {
        width: 300px;
        flex-grow: 0;
      }

      #tabpanel-members [data-type="role"] {
        text-align: left;
      }
    `);
    }
  }
  function run4() {
    if (isValidPackagePage()) {
      const sidebar = document.querySelector('[aria-label="Package sidebar"]');
      const el = Array.from(sidebar?.querySelectorAll("h3") || []).find(
        (el2) => el2.textContent === "Last publish"
      );
      if (el) {
        el.textContent = "Last Publish";
      }
    }
  }
  var description5;
  var init_fix_styles = __esm({
    "src/features/fix-styles.ts"() {
      init_utils();
      description5 = `Fix various style issues on the npm site.
`;
    }
  });

  // src/features/helpful-links.ts
  var helpful_links_exports = {};
  __export(helpful_links_exports, {
    description: () => description6,
    run: () => run5,
    runPre: () => runPre6,
    teardown: () => teardown2
  });
  function teardown2(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector(".npm-userscript-helpful-links")?.parentElement?.remove();
  }
  function runPre6() {
    if (!isValidPackagePage()) return;
    addStyle(`
    .npm-userscript-helpful-links {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 0;
      transform: translateY(5px);
    }

    .npm-userscript-helpful-links a {
      display: block;
    }

    .npm-userscript-helpful-links a svg {
      display: block;
      width: 20px;
      height: 20px;
    }

    /* link icon is jarringly large, so shrink */
    .npm-userscript-helpful-links a[title="Homepage"] svg {
      height: 17px;
    }
    
    /* publint icon is too short, so widen */
    .npm-userscript-helpful-links a[href*="publint.dev"] svg {
      width: 24px;
    }
  `);
  }
  async function run5() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-helpful-links")) return;
    const packageName = getPackageName();
    if (!packageName) return;
    const links = [
      await getRepoLinkData(),
      getHomepageLinkData(),
      getFundingLinkData(),
      getPublintLinkData(packageName),
      getAttwLinkData(packageName),
      getNpmgraphLinkData(packageName),
      getNodeModulesInspectorLinkData(packageName),
      getPackagephobiaLinkData(packageName),
      getBundlejsLinkData(packageName)
    ].filter(Boolean);
    const injectParent = document.querySelector("#top > div:first-child");
    if (!injectParent) return;
    const group = injectParent.lastElementChild.cloneNode();
    group.innerHTML = `&nbsp;\u2022&nbsp;<div class="npm-userscript-helpful-links">
    ${links.map(
      (link) => `
        <a
          href="${link.url}"
          target="_blank"
          rel="noopener noreferrer nofollow"
          title="${link.label}"
        >
          ${scopeSvgId(link.iconSvg, link.label.toLowerCase().replace(/\s+/g, "-"))}
        </a>
      `
    ).join("")}
  <div>`;
    injectParent.appendChild(group);
  }
  async function getRepoLinkData() {
    const useFullRepoLink = (await getFeatureSettings2())["repository-directory"].get() === true;
    const repositoryLink = useFullRepoLink ? await getFullRepositoryLink() : getNpmContext().context.packument.repository;
    if (repositoryLink) {
      return {
        label: "Repository",
        url: repositoryLink,
        iconSvg: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="#F1502F" fill-rule="nonzero"><path d="M15.6981994,7.28744895 L8.71251571,0.3018063 C8.3102891,-0.1006021 7.65784619,-0.1006021 7.25527133,0.3018063 L5.80464367,1.75263572 L7.64478689,3.59281398 C8.07243561,3.44828825 8.56276901,3.5452772 8.90352982,3.88604451 C9.24638012,4.22907547 9.34249661,4.72359725 9.19431703,5.15282127 L10.9679448,6.92630874 C11.3971607,6.77830046 11.8918472,6.8738964 12.2346975,7.21727561 C12.7135387,7.69595181 12.7135387,8.47203759 12.2346975,8.95106204 C11.755508,9.43026062 10.9796112,9.43026062 10.5002476,8.95106204 C10.140159,8.59061834 10.0510075,8.06127108 10.2336636,7.61759448 L8.57948492,5.9635584 L8.57948492,10.3160467 C8.69614805,10.3738569 8.80636859,10.4509954 8.90352982,10.5479843 C9.38237103,11.0268347 9.38237103,11.8027463 8.90352982,12.2822931 C8.42468862,12.7609693 7.64826937,12.7609693 7.16977641,12.2822931 C6.69093521,11.8027463 6.69093521,11.0268347 7.16977641,10.5479843 C7.28818078,10.4297518 7.42521643,10.3402504 7.57148065,10.2803505 L7.57148065,5.88746473 C7.42521643,5.82773904 7.28852903,5.73893407 7.16977641,5.62000506 C6.80707597,5.25747183 6.71983981,4.72499027 6.90597844,4.27957241 L5.09195384,2.465165 L0.301800552,7.25506126 C-0.100600184,7.65781791 -0.100600184,8.31027324 0.301800552,8.71268164 L7.28783254,15.6983243 C7.69005915,16.1005586 8.34232793,16.1005586 8.74507691,15.6983243 L15.6981994,8.74506934 C16.1006002,8.34266094 16.1006002,7.68968322 15.6981994,7.28744895" id="Path"></path></g></svg>`
      };
    }
  }
  function getHomepageLinkData() {
    const homepageLink = getNpmContext().context.packument.homepage;
    if (homepageLink) {
      return {
        label: "Homepage",
        url: homepageLink,
        iconSvg: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2679d8" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path></svg>`
      };
    }
  }
  function getFundingLinkData() {
    const fundingLink = getNpmContext().context.packument.funding?.url;
    if (fundingLink) {
      return {
        label: "Fund this package",
        url: fundingLink,
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true"><path fill="#fa5b9b" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>`
      };
    }
  }
  function getPublintLinkData(packageName) {
    return {
      label: "Check with Publint",
      url: `https://publint.dev/${packageName}`,
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 241" width="100%" height="100%" aria-hidden="true" fill="none"><g clip-path="url(#a)"><path fill="#CF7522" stroke="#fff" stroke-width="8" d="m171.514 210.672-.006.003-.007.003c-.717.358-1.534.461-2.326.304-1.486-.294-2.092-1.028-2.446-1.852-.448-1.041-.45-2.255-.339-2.813l35.471-179.0918c.22-1.1065.922-2.029 1.922-2.5282.346-.1148.784-.2761 1.321-.4739 2.613-.9619 7.569-2.7866 15.673-4.3209 10.147-1.921 24.244-3.0651 40.689-.1184 16.777 3.1628 35.653 11.4949 54.595 24.6852 3.309 2.3123 4.906 6.6296 4.362 11.4434l-33.08 167.0166c-.528 2.663-3.609 3.763-5.582 2.318-55.564-40.744-107.73-15.819-110.247-14.575Z"/></g><g clip-path="url(#b)"><path fill="#CF7522" stroke="#fff" stroke-width="8" d="m158.439 210.682.007.003.007.003c.717.358 1.534.461 2.325.304 1.486-.294 2.093-1.028 2.447-1.851.447-1.042.449-2.256.339-2.814L128.092 27.2354c-.219-1.1065-.921-2.0289-1.921-2.5282-.346-.1148-.784-.2761-1.321-.4739-2.613-.9619-7.569-2.7866-15.674-4.3209-10.1467-1.921-24.2437-3.065-40.6882-.1184-16.777 3.1629-35.6531 11.4949-54.5951 24.6852-3.3089 2.3123-4.9057 6.6296-4.3621 11.4434L42.6108 222.939c.5275 2.664 3.6093 3.764 5.5817 2.318 55.5635-40.744 107.7305-15.819 110.2465-14.575Z"/></g><g clip-path="url(#c)"><path fill="#E69B57" stroke="#fff" stroke-width="8" d="m170.873 208.731-.006.004-.006.005c-.633.49-1.415.75-2.222.75-1.515 0-2.252-.602-2.76-1.341-.641-.934-.879-2.126-.879-2.694V22.8841c0-1.128.509-2.1692 1.393-2.8532.317-.1799.716-.4233 1.204-.7217 2.377-1.4512 6.883-4.204 14.536-7.2837 9.58-3.856 23.186-7.717 39.89-8.0215 17.072-.1571 37.207 4.3487 58.351 13.6074 3.695 1.6254 6.1 5.5501 6.502 10.3778V198.25c0 2.715-2.809 4.393-5.025 3.358-62.421-29.171-108.751 5.414-110.978 7.123Z"/></g><g clip-path="url(#d)"><path fill="#E69B57" stroke="#fff" stroke-width="8" d="m159.127 208.731.006.004.006.005c.633.49 1.415.75 2.222.75 1.515 0 2.252-.602 2.76-1.341.641-.934.879-2.126.879-2.694V22.8841c0-1.128-.509-2.1692-1.393-2.8532-.318-.1799-.716-.4233-1.204-.7217-2.377-1.4512-6.883-4.204-14.536-7.2837-9.58-3.856-23.186-7.717-39.89-8.0215-17.0716-.1571-37.2068 4.3487-58.3507 13.6074-3.695 1.6254-6.1002 5.5501-6.5023 10.3778l.0001 170.2618c0 2.715 2.8093 4.392 5.0251 3.357 62.4208-29.171 108.7508 5.414 110.9778 7.123Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h130v215.599H0z" transform="rotate(11.203 80.8005 1033.73)"/></clipPath><clipPath id="b"><path fill="#fff" d="M0 0h130v215.06H0z" transform="scale(-1 1) rotate(11.203 -84.2286 -648.3313)"/></clipPath><clipPath id="c"><path fill="#fff" d="M0 0h130v213H0z" transform="translate(161)"/></clipPath><clipPath id="d"><path fill="#fff" d="M0 0h130v213H0z" transform="matrix(-1 0 0 1 169 0)"/></clipPath></defs></svg>`
    };
  }
  function getAttwLinkData(packageName) {
    return {
      label: "Check with Are the types wrong?",
      url: `https://arethetypeswrong.github.io/?p=${packageName}`,
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="933.333" height="933.333" viewBox="0 0 700 700" aria-hidden="true"><path fill="#3178C6" d="M0 350v350h420.5l-3.5-2.2c-11.7-7.2-27.9-18.1-36.5-24.7-10.8-8.1-32-28.8-37.1-36.1l-3.2-4.5 21.1-40.6 21.1-40.6 5.6 11.1c9.9 19.8 20.4 34.1 35.8 48.7 19.9 19 42.3 32.4 65.9 39.5 12.2 3.7 28.9 3.9 37.6.5 11.8-4.6 20.5-16.9 21.5-30 .6-8.5-1.5-16.9-7.2-28.8-5.7-11.8-12-21.1-27-39.6-6.6-8.2-15.6-19.3-19.9-24.6-10.7-13.1-19.9-27.2-26.2-39.9-9.8-19.7-13.7-35.1-13.7-53.7 0-18.4 3.3-31.9 12.4-50.3 30.6-62.3 95-80 175-48.1 14.9 5.9 42.7 20.2 55.1 28.3l2.7 1.8V0H0zm395-115v38H275v337h-95V273H60v-76h335z"/><path fill="#3178C6" d="M580.7 403c-11.6 3-21.3 11.9-24.7 22.7-2.5 8.1-2.5 11-.1 20.5 4.3 16.6 12.2 28.6 47.1 71.8 25 30.9 39.4 57.5 44.4 82.2 2 9.6 2.1 28.2.2 38-3.1 16.2-12.5 37.5-23.1 52.2-2.8 4-5.5 7.8-5.9 8.4-.5.9 9.5 1.2 40.3 1.2H700V466.3l-6.3-7.4c-21.9-25.5-51.7-45.6-79.8-53.9-8.3-2.4-26.9-3.6-33.2-2"/></svg>`
    };
  }
  function getNpmgraphLinkData(packageName) {
    return {
      label: "Check with Npmgraph",
      url: `https://npmgraph.js.org/?q=${packageName}`,
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 8.467 8.467" aria-hidden="true"><defs><radialGradient xlink:href="#a" id="b" cx=".794" cy="3.572" r="1.323" fx=".794" fy="3.572" gradientTransform="matrix(1.4 0 0 .8 -.317 1.111)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#a" id="c" cx=".794" cy="3.572" r="1.323" fx=".794" fy="3.572" gradientTransform="matrix(1.4 0 0 .8 4.974 -2.328)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#a" id="d" cx=".794" cy="3.572" r="1.323" fx=".794" fy="3.572" gradientTransform="matrix(1.4 0 0 .8 4.974 .053)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#a" id="f" cx=".794" cy="3.572" r="1.323" fx=".794" fy="3.572" gradientTransform="matrix(1.4 0 0 .8 4.974 4.55)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#a" id="e" cx=".794" cy="3.572" r="1.323" fx=".794" fy="3.572" gradientTransform="matrix(1.4 0 0 .8 4.974 2.17)" gradientUnits="userSpaceOnUse"/><linearGradient id="a"><stop offset="0" style="stop-color:#fff;stop-opacity:1"/><stop offset="1" style="stop-color:#a4a4a4;stop-opacity:1"/></linearGradient></defs><rect width="2.381" height=".794" x=".397" y="3.836" rx=".282" ry=".282" style="fill:url(#b);stroke:#000;stroke-width:.264584;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;fill-opacity:1"/><path d="M2.891 4.233c1.047.045.558-3.44 2.136-3.44" style="fill:none;stroke:#000;stroke-width:.264583;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="m5.027.265.546.557-.546.5ZM5.027 2.646l.546.558-.546.5ZM5.027 4.762l.546.558-.546.5ZM5.027 7.144l.546.558-.546.5Z" style="fill:#000;stroke:none;stroke-width:.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"/><path d="M2.91 4.233c1.048.045.539-1.058 2.117-1.058" style="fill:none;stroke:#000;stroke-width:.264583;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M2.891 4.233c1.047-.044.558 3.44 2.136 3.44" style="fill:none;stroke:#000;stroke-width:.264583;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="M2.91 4.233c1.048-.044.539 1.059 2.117 1.059" style="fill:none;stroke:#000;stroke-width:.264583;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><rect width="2.381" height=".794" x="5.689" y=".397" rx=".282" ry=".282" style="fill:url(#c);fill-opacity:1;stroke:#000;stroke-width:.264583;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none"/><rect width="2.381" height=".794" x="5.689" y="2.778" rx=".282" ry=".282" style="fill:url(#d);fill-opacity:1;stroke:#000;stroke-width:.264583;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none"/><rect width="2.381" height=".794" x="5.689" y="4.895" rx=".282" ry=".282" style="fill:url(#e);fill-opacity:1;stroke:#000;stroke-width:.264583;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none"/><rect width="2.381" height=".794" x="5.689" y="7.276" rx=".282" ry=".282" style="fill:url(#f);fill-opacity:1;stroke:#000;stroke-width:.264583;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none"/></svg>`
    };
  }
  function getNodeModulesInspectorLinkData(packageName) {
    return {
      label: "Check with Node Modules Inspector",
      url: `https://node-modules.dev/grid/depth#install=${packageName}`,
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true"><path fill="#469B18" fill-rule="evenodd" d="M51.05 39.797a3.1 3.1 0 0 1 3.428-2.732c2.682.304 5.347 1.215 7.865 2.543a3.1 3.1 0 1 1-2.89 5.485c-1.977-1.042-3.901-1.667-5.672-1.867a3.1 3.1 0 0 1-2.732-3.43Zm-1.133.1a3.1 3.1 0 0 1-1.316 4.182 8.62 8.62 0 0 0-2.113 1.569 3.1 3.1 0 1 1-4.384-4.385 14.82 14.82 0 0 1 3.631-2.682 3.1 3.1 0 0 1 4.182 1.316Zm14.52 4.506a3.1 3.1 0 0 1 4.377-.244 38.946 38.946 0 0 1 5.239 5.744 3.1 3.1 0 1 1-4.971 3.705 32.743 32.743 0 0 0-4.4-4.827 3.1 3.1 0 0 1-.245-4.378Zm9.497 10.678a3.1 3.1 0 0 1 4.127 1.48 34.816 34.816 0 0 1 2.55 7.425 3.1 3.1 0 0 1-6.058 1.32 28.622 28.622 0 0 0-2.1-6.099 3.1 3.1 0 0 1 1.481-4.127ZM78.35 68.67a3.1 3.1 0 0 1 2.92 3.27 26.364 26.364 0 0 1-1.677 7.911 3.1 3.1 0 1 1-5.794-2.205 20.163 20.163 0 0 0 1.281-6.056 3.1 3.1 0 0 1 3.27-2.92Zm-3.264 13.833a3.1 3.1 0 0 1 .558 4.348 31.224 31.224 0 0 1-2.639 2.992 3.1 3.1 0 1 1-4.383-4.384 25.043 25.043 0 0 0 2.115-2.397 3.1 3.1 0 0 1 4.349-.559ZM32.676 9.046a3.1 3.1 0 0 1 0 4.384 25.044 25.044 0 0 0-2.117 2.397 3.1 3.1 0 1 1-4.907-3.79 31.23 31.23 0 0 1 2.64-2.992 3.1 3.1 0 0 1 4.384 0Zm-6.973 8.197a3.1 3.1 0 0 1 1.795 4 20.155 20.155 0 0 0-1.28 6.056 3.1 3.1 0 0 1-6.19-.35 26.349 26.349 0 0 1 1.675-7.911 3.1 3.1 0 0 1 4-1.795Zm-2.648 13.971a3.1 3.1 0 0 1 3.69 2.368 28.625 28.625 0 0 0 2.098 6.1 3.1 3.1 0 0 1-5.606 2.646 34.822 34.822 0 0 1-2.55-7.424 3.1 3.1 0 0 1 2.368-3.69Zm4.822 13.434a3.1 3.1 0 0 1 4.338.633 32.756 32.756 0 0 0 4.4 4.828 3.1 3.1 0 0 1-4.132 4.621 38.956 38.956 0 0 1-5.239-5.744 3.1 3.1 0 0 1 .633-4.338Zm31.315 8.593a3.1 3.1 0 0 1 0 4.384 14.816 14.816 0 0 1-3.63 2.683 3.1 3.1 0 1 1-2.867-5.497 8.621 8.621 0 0 0 2.113-1.57 3.1 3.1 0 0 1 4.384 0Zm-21.536 1.853a3.1 3.1 0 0 1 4.188-1.297c1.977 1.042 3.901 1.667 5.672 1.867a3.1 3.1 0 1 1-.698 6.16c-2.681-.303-5.346-1.215-7.865-2.542a3.1 3.1 0 0 1-1.297-4.188Z" clip-rule="evenodd" opacity=".5"></path><path fill="#469B18" fill-rule="evenodd" d="M69.316 22.298a3.1 3.1 0 0 1 3.27-2.92 26.35 26.35 0 0 1 7.911 1.676 3.1 3.1 0 1 1-2.204 5.795 20.157 20.157 0 0 0-6.057-1.281 3.1 3.1 0 0 1-2.92-3.27Zm-.995.107a3.1 3.1 0 0 1-2.368 3.69 28.626 28.626 0 0 0-6.099 2.099 3.1 3.1 0 1 1-2.646-5.607 34.823 34.823 0 0 1 7.424-2.55 3.1 3.1 0 0 1 3.69 2.368Zm14.828 3.156a3.1 3.1 0 0 1 4.348-.558 31.223 31.223 0 0 1 2.992 2.638 3.1 3.1 0 0 1-4.384 4.384 25.041 25.041 0 0 0-2.397-2.115 3.1 3.1 0 0 1-.559-4.349Zm-28.26 1.667a3.1 3.1 0 0 1-.634 4.338 32.75 32.75 0 0 0-4.826 4.4 3.1 3.1 0 1 1-4.622-4.132 38.952 38.952 0 0 1 5.743-5.239 3.1 3.1 0 0 1 4.338.633Zm-10.445 9.78a3.1 3.1 0 0 1 1.297 4.187c-1.042 1.977-1.666 3.9-1.867 5.671a3.1 3.1 0 1 1-6.16-.697c.303-2.681 1.215-5.346 2.542-7.865a3.1 3.1 0 0 1 4.188-1.297ZM40.545 50.73a3.1 3.1 0 0 1 4.182 1.315c.38.727.893 1.436 1.57 2.112a3.1 3.1 0 0 1-4.383 4.386 14.816 14.816 0 0 1-2.684-3.63 3.1 3.1 0 0 1 1.315-4.183Zm13.346-9.272a3.1 3.1 0 0 1 4.384 0 14.817 14.817 0 0 1 2.683 3.631 3.1 3.1 0 0 1-5.497 2.866 8.62 8.62 0 0 0-1.57-2.113 3.1 3.1 0 0 1 0-4.384Zm5.851 8.945a3.1 3.1 0 0 1 2.732 3.43c-.304 2.68-1.216 5.346-2.544 7.864a3.1 3.1 0 1 1-5.484-2.89c1.042-1.978 1.666-3.902 1.867-5.672a3.1 3.1 0 0 1 3.43-2.732ZM55.135 63.79a3.1 3.1 0 0 1 .244 4.378 38.955 38.955 0 0 1-5.743 5.238 3.1 3.1 0 0 1-3.706-4.971 32.758 32.758 0 0 0 4.828-4.4 3.1 3.1 0 0 1 4.377-.245Zm-45.44 4.185a3.1 3.1 0 0 1 4.384 0c.788.787 1.588 1.49 2.398 2.116a3.1 3.1 0 1 1-3.79 4.906 31.225 31.225 0 0 1-2.992-2.638 3.1 3.1 0 0 1 0-4.384Zm34.763 5.312a3.1 3.1 0 0 1-1.48 4.127 34.814 34.814 0 0 1-7.425 2.55 3.1 3.1 0 1 1-1.32-6.058 28.622 28.622 0 0 0 6.098-2.099 3.1 3.1 0 0 1 4.127 1.48Zm-26.565 1.66a3.1 3.1 0 0 1 4-1.795 20.161 20.161 0 0 0 6.056 1.28 3.1 3.1 0 1 1-.35 6.19 26.361 26.361 0 0 1-7.911-1.675 3.1 3.1 0 0 1-1.795-4Z" clip-rule="evenodd" opacity=".5"></path><path fill="#579E4B" fill-rule="evenodd" d="M58.501 50.834C56.589 46.9 53.708 44.767 50 44.767a3.1 3.1 0 1 1 0-6.2c6.708 0 11.432 4.116 14.077 9.557 2.607 5.363 3.381 12.263 2.43 18.977C64.614 80.466 55.465 94.767 37.5 94.767a3.1 3.1 0 1 1 0-6.2c13.701 0 21.22-10.699 22.868-22.335.82-5.786.083-11.385-1.867-15.398Z" clip-rule="evenodd"></path><path fill="#579E4B" fill-rule="evenodd" d="M42.799 49.166c1.913 3.934 4.793 6.067 8.501 6.067a3.1 3.1 0 0 1 0 6.2c-6.708 0-11.432-4.116-14.077-9.557-2.607-5.363-3.381-12.263-2.43-18.977C36.686 19.534 45.834 5.232 63.8 5.232a3.1 3.1 0 1 1 0 6.2c-13.701 0-21.22 10.699-22.868 22.335-.82 5.786-.083 11.385 1.867 15.398Z" clip-rule="evenodd"></path><path fill="#3E863D" fill-rule="evenodd" d="M50.834 42.799c-3.934 1.913-6.067 4.793-6.067 8.501a3.1 3.1 0 1 1-6.2 0c0-6.708 4.116-11.432 9.557-14.077 5.363-2.607 12.263-3.381 18.977-2.43C80.466 36.686 94.767 45.834 94.767 63.8a3.1 3.1 0 1 1-6.2 0c0-13.701-10.699-21.22-22.335-22.868-5.786-.82-11.385-.083-15.398 1.867Z" clip-rule="evenodd"></path><path fill="#3E863D" fill-rule="evenodd" d="M8.333 34.4a3.1 3.1 0 0 1 3.1 3.1c0 13.701 10.699 21.22 22.335 22.868 5.786.82 11.385.083 15.398-1.867 3.934-1.912 6.067-4.793 6.067-8.501a3.1 3.1 0 0 1 6.2 0c0 6.708-4.116 11.432-9.557 14.077-5.363 2.607-12.263 3.381-18.977 2.43C19.534 64.614 5.232 55.465 5.232 37.5a3.1 3.1 0 0 1 3.1-3.1Z" clip-rule="evenodd"></path><path fill="#579E4B" fill-rule="evenodd" d="M50 45.017a4.983 4.983 0 1 0 0 9.966 4.983 4.983 0 0 0 0-9.966ZM38.317 50c0-6.453 5.23-11.683 11.683-11.683 6.453 0 11.683 5.23 11.683 11.683 0 6.453-5.23 11.683-11.683 11.683-6.453 0-11.683-5.23-11.683-11.683Z" clip-rule="evenodd"></path></svg>`
    };
  }
  function getPackagephobiaLinkData(packageName) {
    return {
      label: "Check with Packagephobia",
      url: `https://packagephobia.com/result?p=${packageName}`,
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="108" height="108" aria-hidden="true"><defs><linearGradient id="main"><stop offset="0" stop-color="#006838"></stop><stop offset="1" stop-color="#32de85"></stop></linearGradient></defs><path xmlns="http://www.w3.org/2000/svg" fill="url(#main)" d="M21.667 73.809V33.867l28.33-16.188 28.337 16.188V66.13L49.997 82.321 35 73.75V41.604l14.997-8.57L65 41.604v16.788l-15.003 8.571-1.663-.95v-16.67l8.382-4.792-6.719-3.838-8.33 4.763V69.88l8.33 4.762 21.67-12.383V37.737l-21.67-12.379-21.663 12.379v39.88L49.997 90 85 70V30L49.997 10 15 30v40z" transform="translate(-8.75 -7.5)scale(1.25)"></path></svg>`
    };
  }
  function getBundlejsLinkData(packageName) {
    return {
      label: "Check with Bundlejs",
      url: `https://bundlejs.com/?q=${packageName}`,
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" aria-hidden="true" fill="none"><rect width="1024" height="1024" rx="250" fill="url(#a)"/><path d="M546.914 715.1c-28.98 0-53.19-6.75-72.63-20.25-19.44-13.5-34.11-31.86-44.01-55.08-9.72-23.22-14.58-49.41-14.58-78.57 0-29.16 4.86-55.35 14.58-78.57 9.72-23.22 24.03-41.58 42.93-55.08s42.21-20.25 69.93-20.25c27.9 0 52.2 6.66 72.9 19.98 20.7 13.32 36.72 31.59 48.06 54.81 11.52 23.04 17.28 49.41 17.28 79.11 0 29.16-5.67 55.35-17.01 78.57-11.16 23.22-26.82 41.58-46.98 55.08-20.16 13.5-43.65 20.25-70.47 20.25Zm-143.64-8.1V318.2h73.98v189h-9.18V707h-64.8Zm131.76-57.24c15.84 0 28.8-3.96 38.88-11.88 10.08-7.92 17.55-18.54 22.41-31.86 4.86-13.5 7.29-28.44 7.29-44.82 0-16.2-2.52-30.96-7.56-44.28-5.04-13.5-12.87-24.21-23.49-32.13-10.44-8.1-23.85-12.15-40.23-12.15-15.3 0-27.72 3.69-37.26 11.07-9.36 7.38-16.2 17.73-20.52 31.05s-6.48 28.8-6.48 46.44c0 17.64 2.16 33.12 6.48 46.44s11.34 23.67 21.06 31.05c9.9 7.38 23.04 11.07 39.42 11.07Z" fill="#FCFCFC" fill-opacity=".96"/><path d="m474.284 694.85.57-.821-.57.821Zm-44.01-55.08-.923.386.003.006.92-.392Zm0-157.14-.923-.386.923.386Zm42.93-55.08-.582-.814.582.814Zm142.83-.27-.541.841.541-.841Zm48.06 54.81-.899.439.004.008.895-.447Zm.27 157.68-.899-.439-.003.006.902.433Zm-46.98 55.08-.557-.831.557.831ZM403.274 707h-1v1h1v-1Zm0-388.8v-1h-1v1h1Zm73.98 0h1v-1h-1v1Zm0 189v1h1v-1h-1Zm-9.18 0v-1h-1v1h1Zm0 199.8v1h1v-1h-1Zm128.25-100.98.939.343.002-.004-.941-.339Zm-.27-89.1-.937.35.001.004.936-.354Zm-23.49-32.13-.613.79.007.006.008.006.598-.802Zm-77.49-1.08-.612-.791-.007.006.619.785Zm-20.52 31.05-.952-.309.952.309Zm0 92.88-.952.308.952-.308Zm21.06 31.05-.605.796.007.006.598-.802Zm51.3 75.41c-28.823 0-52.822-6.712-72.06-20.071l-1.141 1.642c19.642 13.641 44.063 20.429 73.201 20.429v-2Zm-72.06-20.071c-19.275-13.386-33.829-31.592-43.66-54.651l-1.84.784c9.968 23.381 24.754 41.895 44.359 55.509l1.141-1.642Zm-43.658-54.645c-9.661-23.08-14.502-49.136-14.502-78.184h-2c0 29.272 4.879 55.596 14.657 78.956l1.845-.772ZM416.694 561.2c0-29.048 4.841-55.104 14.502-78.184l-1.845-.772c-9.778 23.36-14.657 49.684-14.657 78.956h2Zm14.502-78.184c9.655-23.063 23.853-41.269 42.589-54.652l-1.163-1.628c-19.063 13.617-33.485 32.131-43.271 55.508l1.845.772Zm42.589-54.652c18.7-13.357 41.796-20.064 69.349-20.064v-2c-27.887 0-51.411 6.793-70.512 20.436l1.163 1.628Zm69.349-20.064c27.734 0 51.841 6.618 72.359 19.821l1.082-1.682c-20.882-13.437-45.376-20.139-73.441-20.139v2Zm72.359 19.821c20.538 13.216 36.438 31.343 47.702 54.408l1.797-.878c-11.416-23.375-27.556-41.788-48.417-55.212l-1.082 1.682Zm47.706 54.416c11.441 22.882 17.175 49.094 17.175 78.663h2c0-29.831-5.787-56.359-17.386-79.557l-1.789.894Zm17.175 78.663c0 29.028-5.644 55.064-16.909 78.131l1.797.878c11.415-23.373 17.112-49.717 17.112-79.009h-2Zm-16.912 78.137c-11.087 23.069-26.632 41.288-46.635 54.682l1.113 1.662c20.318-13.606 36.093-32.107 47.325-55.478l-1.803-.866Zm-46.635 54.682c-19.978 13.378-43.27 20.081-69.913 20.081v2c26.996 0 50.684-6.797 71.026-20.419l-1.113-1.662ZM404.274 707V318.2h-2V707h2Zm-1-387.8h73.98v-2h-73.98v2Zm72.98-1v189h2v-189h-2Zm1 188h-9.18v2h9.18v-2Zm-10.18 1V707h2V507.2h-2Zm1 198.8h-64.8v2h64.8v-2Zm66.96-55.24c16.01 0 29.203-4.005 39.498-12.094l-1.236-1.572c-9.866 7.751-22.592 11.666-38.262 11.666v2Zm39.498-12.094c10.241-8.047 17.814-18.827 22.731-32.303l-1.879-.686c-4.803 13.164-12.17 23.624-22.088 31.417l1.236 1.572Zm22.733-32.307c4.904-13.623 7.349-28.68 7.349-45.159h-2c0 16.281-2.415 31.104-7.231 44.481l1.882.678Zm7.349-45.159c0-16.304-2.537-31.186-7.625-44.634l-1.871.708c4.992 13.192 7.496 27.83 7.496 43.926h2Zm-7.623-44.63c-5.102-13.663-13.042-24.537-23.829-32.582l-1.196 1.604c10.452 7.795 18.172 18.341 23.151 31.678l1.874-.7ZM573.177 484c-10.654-8.266-24.296-12.36-40.843-12.36v2c16.212 0 29.391 4.006 39.617 11.94l1.226-1.58Zm-40.843-12.36c-15.461 0-28.115 3.731-37.872 11.279l1.224 1.582c9.322-7.212 21.509-10.861 36.648-10.861v-2Zm-37.879 11.285c-9.542 7.522-16.482 18.052-20.853 31.526l1.903.618c4.27-13.166 11.009-23.336 20.188-30.574l-1.238-1.57Zm-20.853 31.526c-4.359 13.442-6.528 29.03-6.528 46.749h2c0-17.561 2.15-32.933 6.431-46.131l-1.903-.618Zm-6.528 46.749c0 17.719 2.169 33.307 6.528 46.748l1.903-.617c-4.281-13.198-6.431-28.57-6.431-46.131h-2Zm6.528 46.748c4.374 13.485 11.501 24.017 21.407 31.538l1.209-1.592c-9.534-7.239-16.446-17.407-20.713-30.563l-1.903.617Zm21.414 31.544c10.121 7.545 23.492 11.268 40.018 11.268v-2c-16.235 0-29.144-3.657-38.823-10.872l-1.195 1.604Z" fill="#fff"/><defs><linearGradient id="a" x1="512" y1="0" x2="512" y2="1024" gradientUnits="userSpaceOnUse"><stop offset=".161" stop-color="#3B82F6"/><stop offset="1" stop-color="#262BA3"/></linearGradient></defs></svg>`
    };
  }
  function scopeSvgId(svg, scope) {
    return svg.replace(/id="([^"]+)"/g, `id="${scope}-$1"`).replace(/url\(#([^ )]+)\)/g, `url(#${scope}-$1)`);
  }
  async function getFeatureSettings2() {
    const settings = await Promise.resolve().then(() => (init_settings(), settings_exports));
    return settings.featureSettings;
  }
  var description6;
  var init_helpful_links = __esm({
    "src/features/helpful-links.ts"() {
      init_utils_fetch();
      init_utils_npm_context();
      init_utils();
      description6 = "Add helpful links beside the package header for convenience.";
    }
  });

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  function getSideAxis(placement) {
    return yAxisSides.has(getSide(placement)) ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x: x2,
      y: y2,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y2,
      left: x2,
      right: x2 + width,
      bottom: y2 + height,
      x: x2,
      y: y2
    };
  }
  var min, max, round, createCoords, yAxisSides;
  var init_floating_ui_utils = __esm({
    "node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs"() {
      min = Math.min;
      max = Math.max;
      round = Math.round;
      createCoords = (v2) => ({
        x: v2,
        y: v2
      });
      yAxisSides = /* @__PURE__ */ new Set(["top", "bottom"]);
    }
  });

  // node_modules/@floating-ui/core/dist/floating-ui.core.mjs
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case "top":
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case "bottom":
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case "right":
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case "left":
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case "start":
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case "end":
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x: x2,
      y: y2,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
      element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x: x2,
      y: y2,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
    const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  async function convertValueToCoords(state, options) {
    const {
      placement,
      platform: platform2,
      elements
    } = state;
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = originSides.has(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  var computePosition, originSides, offset, shift;
  var init_floating_ui_core = __esm({
    "node_modules/@floating-ui/core/dist/floating-ui.core.mjs"() {
      init_floating_ui_utils();
      init_floating_ui_utils();
      computePosition = async (reference, floating, config) => {
        const {
          placement = "bottom",
          strategy = "absolute",
          middleware = [],
          platform: platform2
        } = config;
        const validMiddleware = middleware.filter(Boolean);
        const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
        let rects = await platform2.getElementRects({
          reference,
          floating,
          strategy
        });
        let {
          x: x2,
          y: y2
        } = computeCoordsFromPlacement(rects, placement, rtl);
        let statefulPlacement = placement;
        let middlewareData = {};
        let resetCount = 0;
        for (let i2 = 0; i2 < validMiddleware.length; i2++) {
          const {
            name,
            fn
          } = validMiddleware[i2];
          const {
            x: nextX,
            y: nextY,
            data,
            reset
          } = await fn({
            x: x2,
            y: y2,
            initialPlacement: placement,
            placement: statefulPlacement,
            strategy,
            middlewareData,
            rects,
            platform: platform2,
            elements: {
              reference,
              floating
            }
          });
          x2 = nextX != null ? nextX : x2;
          y2 = nextY != null ? nextY : y2;
          middlewareData = {
            ...middlewareData,
            [name]: {
              ...middlewareData[name],
              ...data
            }
          };
          if (reset && resetCount <= 50) {
            resetCount++;
            if (typeof reset === "object") {
              if (reset.placement) {
                statefulPlacement = reset.placement;
              }
              if (reset.rects) {
                rects = reset.rects === true ? await platform2.getElementRects({
                  reference,
                  floating,
                  strategy
                }) : reset.rects;
              }
              ({
                x: x2,
                y: y2
              } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
            }
            i2 = -1;
          }
        }
        return {
          x: x2,
          y: y2,
          placement: statefulPlacement,
          strategy,
          middlewareData
        };
      };
      originSides = /* @__PURE__ */ new Set(["left", "top"]);
      offset = function(options) {
        if (options === void 0) {
          options = 0;
        }
        return {
          name: "offset",
          options,
          async fn(state) {
            var _middlewareData$offse, _middlewareData$arrow;
            const {
              x: x2,
              y: y2,
              placement,
              middlewareData
            } = state;
            const diffCoords = await convertValueToCoords(state, options);
            if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
              return {};
            }
            return {
              x: x2 + diffCoords.x,
              y: y2 + diffCoords.y,
              data: {
                ...diffCoords,
                placement
              }
            };
          }
        };
      };
      shift = function(options) {
        if (options === void 0) {
          options = {};
        }
        return {
          name: "shift",
          options,
          async fn(state) {
            const {
              x: x2,
              y: y2,
              placement
            } = state;
            const {
              mainAxis: checkMainAxis = true,
              crossAxis: checkCrossAxis = false,
              limiter = {
                fn: (_ref) => {
                  let {
                    x: x3,
                    y: y3
                  } = _ref;
                  return {
                    x: x3,
                    y: y3
                  };
                }
              },
              ...detectOverflowOptions
            } = evaluate(options, state);
            const coords = {
              x: x2,
              y: y2
            };
            const overflow = await detectOverflow(state, detectOverflowOptions);
            const crossAxis = getSideAxis(getSide(placement));
            const mainAxis = getOppositeAxis(crossAxis);
            let mainAxisCoord = coords[mainAxis];
            let crossAxisCoord = coords[crossAxis];
            if (checkMainAxis) {
              const minSide = mainAxis === "y" ? "top" : "left";
              const maxSide = mainAxis === "y" ? "bottom" : "right";
              const min2 = mainAxisCoord + overflow[minSide];
              const max2 = mainAxisCoord - overflow[maxSide];
              mainAxisCoord = clamp(min2, mainAxisCoord, max2);
            }
            if (checkCrossAxis) {
              const minSide = crossAxis === "y" ? "top" : "left";
              const maxSide = crossAxis === "y" ? "bottom" : "right";
              const min2 = crossAxisCoord + overflow[minSide];
              const max2 = crossAxisCoord - overflow[maxSide];
              crossAxisCoord = clamp(min2, crossAxisCoord, max2);
            }
            const limitedCoords = limiter.fn({
              ...state,
              [mainAxis]: mainAxisCoord,
              [crossAxis]: crossAxisCoord
            });
            return {
              ...limitedCoords,
              data: {
                x: limitedCoords.x - x2,
                y: limitedCoords.y - y2,
                enabled: {
                  [mainAxis]: checkMainAxis,
                  [crossAxis]: checkCrossAxis
                }
              }
            };
          }
        };
      };
    }
  });

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle2(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
  }
  function isTableElement(element) {
    return tableElements.has(getNodeName(element));
  }
  function isTopLayer(element) {
    return topLayerSelectors.some((selector) => {
      try {
        return element.matches(selector);
      } catch (_e2) {
        return false;
      }
    });
  }
  function isContainingBlock(elementOrCss) {
    const webkit = isWebKit();
    const css = isElement(elementOrCss) ? getComputedStyle2(elementOrCss) : elementOrCss;
    return transformProperties.some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || willChangeValues.some((value) => (css.willChange || "").includes(value)) || containValues.some((value) => (css.contain || "").includes(value));
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (typeof CSS === "undefined" || !CSS.supports) return false;
    return CSS.supports("-webkit-backdrop-filter", "none");
  }
  function isLastTraversableNode(node) {
    return lastTraversableNodeNames.has(getNodeName(node));
  }
  function getComputedStyle2(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.scrollX,
      scrollTop: element.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === "html") {
      return node;
    }
    const result = (
      // Step into the shadow DOM of the parent of a slotted node.
      node.assignedSlot || // DOM Element detected.
      node.parentNode || // ShadowRoot detected.
      isShadowRoot(node) && node.host || // Fallback.
      getDocumentElement(node)
    );
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    }
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }
  var invalidOverflowDisplayValues, tableElements, topLayerSelectors, transformProperties, willChangeValues, containValues, lastTraversableNodeNames;
  var init_floating_ui_utils_dom = __esm({
    "node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs"() {
      invalidOverflowDisplayValues = /* @__PURE__ */ new Set(["inline", "contents"]);
      tableElements = /* @__PURE__ */ new Set(["table", "td", "th"]);
      topLayerSelectors = [":popover-open", ":modal"];
      transformProperties = ["transform", "translate", "scale", "rotate", "perspective"];
      willChangeValues = ["transform", "translate", "scale", "rotate", "perspective", "filter"];
      containValues = ["paint", "layout", "strict", "content"];
      lastTraversableNodeNames = /* @__PURE__ */ new Set(["html", "body", "#document"]);
    }
  });

  // node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
  function getCssDimensions(element) {
    const css = getComputedStyle2(element);
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }
  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $: $2
    } = getCssDimensions(domElement);
    let x2 = ($2 ? round(rect.width) : rect.width) / width;
    let y2 = ($2 ? round(rect.height) : rect.height) / height;
    if (!x2 || !Number.isFinite(x2)) {
      x2 = 1;
    }
    if (!y2 || !Number.isFinite(y2)) {
      y2 = 1;
    }
    return {
      x: x2,
      y: y2
    };
  }
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x2 = (clientRect.left + visualOffsets.x) / scale.x;
    let y2 = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle2(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x2 *= iframeScale.x;
        y2 *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x2 += left;
        y2 += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x: x2,
      y: y2
    });
  }
  function getWindowScrollBarX(element, rect) {
    const leftScroll = getNodeScroll(element).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getHTMLOffset(documentElement, scroll) {
    const htmlRect = documentElement.getBoundingClientRect();
    const x2 = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
    const y2 = htmlRect.top + scroll.scrollTop;
    return {
      x: x2,
      y: y2
    };
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
    };
  }
  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y2 = -scroll.scrollTop;
    if (getComputedStyle2(body).direction === "rtl") {
      x2 += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x: x2,
      y: y2
    };
  }
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x2 = 0;
    let y2 = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
        x2 = visualViewport.offsetLeft;
        y2 = visualViewport.offsetTop;
      }
    }
    const windowScrollbarX = getWindowScrollBarX(html);
    if (windowScrollbarX <= 0) {
      const doc = html.ownerDocument;
      const body = doc.body;
      const bodyStyles = getComputedStyle(body);
      const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
      const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
      if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
        width -= clippingStableScrollbarWidth;
      }
    } else if (windowScrollbarX <= SCROLLBAR_MAX) {
      width += windowScrollbarX;
    }
    return {
      width,
      height,
      x: x2,
      y: y2
    };
  }
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x2 = left * scale.x;
    const y2 = top * scale.y;
    return {
      width,
      height,
      x: x2,
      y: y2
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport") {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y,
        width: clippingAncestor.width,
        height: clippingAncestor.height
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
  }
  function getClippingElementAncestors(element, cache2) {
    const cachedResult = cache2.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle2(element).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element) : element;
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle2(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === "fixed") {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache2.set(element, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }
  function getDimensions(element) {
    const {
      width,
      height
    } = getCssDimensions(element);
    return {
      width,
      height
    };
  }
  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    function setLeftRTLScrollbarOffset() {
      offsets.x = getWindowScrollBarX(documentElement);
    }
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        setLeftRTLScrollbarOffset();
      }
    }
    if (isFixed && !isOffsetParentAnElement && documentElement) {
      setLeftRTLScrollbarOffset();
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    const x2 = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y2 = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
      x: x2,
      y: y2,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element) {
    return getComputedStyle2(element).position === "static";
  }
  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;
    if (getDocumentElement(element) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element, polyfill) {
    const win = getWindow(element);
    if (isTopLayer(element)) {
      return win;
    }
    if (!isHTMLElement(element)) {
      let svgOffsetParent = getParentNode(element);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element) || win;
  }
  function isRTL(element) {
    return getComputedStyle2(element).direction === "rtl";
  }
  var noOffsets, SCROLLBAR_MAX, absoluteOrFixed, getElementRects, platform, offset2, shift2, computePosition2;
  var init_floating_ui_dom = __esm({
    "node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs"() {
      init_floating_ui_core();
      init_floating_ui_utils();
      init_floating_ui_utils_dom();
      noOffsets = /* @__PURE__ */ createCoords(0);
      SCROLLBAR_MAX = 25;
      absoluteOrFixed = /* @__PURE__ */ new Set(["absolute", "fixed"]);
      getElementRects = async function(data) {
        const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
        const getDimensionsFn = this.getDimensions;
        const floatingDimensions = await getDimensionsFn(data.floating);
        return {
          reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
          floating: {
            x: 0,
            y: 0,
            width: floatingDimensions.width,
            height: floatingDimensions.height
          }
        };
      };
      platform = {
        convertOffsetParentRelativeRectToViewportRelativeRect,
        getDocumentElement,
        getClippingRect,
        getOffsetParent,
        getElementRects,
        getClientRects,
        getDimensions,
        getScale,
        isElement,
        isRTL
      };
      offset2 = offset;
      shift2 = shift;
      computePosition2 = (reference, floating, options) => {
        const cache2 = /* @__PURE__ */ new Map();
        const mergedOptions = {
          platform,
          ...options
        };
        const platformWithCache = {
          ...mergedOptions.platform,
          _c: cache2
        };
        return computePosition(reference, floating, {
          ...mergedOptions,
          platform: platformWithCache
        });
      };
    }
  });

  // src/utils-ui.ts
  function addPackageLabelStyle() {
    addStyle(`
    .npm-userscript-package-label {
      display: inline-flex;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: bold;
      border-style: solid;
      border-width: 1px;
      margin-left: 8px;
      gap: 3px;
      align-items: center;
      padding: 2px 4px;
      letter-spacing: normal;
    }
    button.npm-userscript-package-label {
      cursor: pointer;
    }
    .npm-userscript-package-label-info {
      color: #004085;
      background-color: #cce5ff;
      border-color: #b8daff;
    }
    .npm-userscript-package-label-warning {
      color: #856404;
      background-color: #ffe76a;
      border-color: #d4c150;
    }
    .npm-userscript-package-label-error {
      color: #721c24;
      background-color: #f8d7da;
      border-color: #f5c6cb;
    }
  `);
  }
  function addPackageLabel(orderKey, innerHtml, type = "info", el = "span") {
    const order = PACKAGE_LABEL_ORDER.indexOf(orderKey);
    const titleEl = document.querySelector("#top h1");
    if (!titleEl) throw new Error("Could not find package title element");
    const label = document.createElement(el);
    label.className = `npm-userscript-package-label npm-userscript-package-label-${type}`;
    label.innerHTML = innerHtml;
    label.dataset.order = order.toString();
    let inserted = false;
    const insertedLabels = document.querySelectorAll(".npm-userscript-package-label");
    for (let i2 = 0; i2 < insertedLabels.length; i2++) {
      const insertedLabel = insertedLabels[i2];
      const insertedOrder = Number(insertedLabel.dataset.order);
      if (order < insertedOrder) {
        titleEl.insertBefore(label, insertedLabel);
        inserted = true;
        return label;
      }
    }
    if (!inserted) {
      titleEl.appendChild(label);
    }
    return label;
  }
  function computeFloatingUI(ref, floating, options) {
    let manualOpened = false;
    async function open() {
      await options?.onBeforeOpen?.();
      floating.style.display = "block";
      const computed = await computePosition2(ref, floating, {
        placement: "bottom-start",
        middleware: [offset2(6), shift2({ padding: 5 })]
      });
      floating.style.left = `${computed.x}px`;
      floating.style.top = `${computed.y}px`;
    }
    function close() {
      if (manualOpened) return;
      setTimeout(() => {
        if (floating.matches(":hover") || floating.matches(":focus-within")) return;
        floating.style.display = "";
      }, 100);
    }
    ;
    [
      ["mouseenter", open],
      ["mouseleave", close],
      ["focus", open],
      ["blur", close]
    ].forEach(([event, listener]) => {
      ref.addEventListener(event, listener);
    });
    ref.addEventListener("click", () => {
      manualOpened = !manualOpened;
      manualOpened ? open() : close();
    });
    document.addEventListener("click", (event) => {
      if (!ref.contains(event.target) && !floating.contains(event.target)) {
        manualOpened = false;
        close();
      }
    });
    floating.addEventListener("mouseleave", close);
  }
  var PACKAGE_LABEL_ORDER;
  var init_utils_ui = __esm({
    "src/utils-ui.ts"() {
      init_floating_ui_dom();
      init_utils();
      PACKAGE_LABEL_ORDER = [
        "show-vulnerabilities",
        "show-file-types-label",
        "show-types-label",
        "show-cli-label-and-command",
        "show-binary-label",
        "show-engine-label",
        "show-lifecycle-scripts-label",
        "module-replacements"
      ];
    }
  });

  // src/features/module-replacements.ts
  var module_replacements_exports = {};
  __export(module_replacements_exports, {
    description: () => description7,
    run: () => run6,
    runPre: () => runPre7,
    teardown: () => teardown3
  });
  function teardown3(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelectorAll(".npm-userscript-module-replacements-label").forEach((el) => el.remove());
    document.querySelectorAll(".npm-userscript-popup").forEach((el) => el.remove());
  }
  function runPre7() {
    addPackageLabelStyle();
    addStyle(`
    .npm-userscript-popup {
      display: none;
      width: max-content;
      max-width: 500px;
      max-height: 500px;
      z-index: 1000;
      overflow-y: auto;
      position: absolute;
      top: 0;
      left: 0;
      background: var(--background-color);
      font-size: 90%;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #aaa;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .npm-userscript-popup-documented {
      transform-origin: 0 0;
      transform: scale(0.8);
    }
  `);
  }
  async function run6() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-module-replacements-label")) return;
    const packageName = getPackageName();
    if (!packageName) return;
    const moduleReplacements = await getModuleReplacements();
    const replacement = moduleReplacements.find((r2) => r2.moduleName === packageName);
    if (!replacement) return;
    const injectParent = document.querySelector("#top > div:first-child");
    if (!injectParent) return;
    switch (replacement.type) {
      case "documented": {
        const label = addPackageLabel("module-replacements", "Has alternatives", "info", "button");
        label.classList.add("npm-userscript-module-replacements-label");
        const popup = document.createElement("div");
        popup.className = "npm-userscript-popup npm-userscript-popup-documented " + getReadmeInternalClassName();
        injectParent.appendChild(popup);
        let fetched = false;
        computeFloatingUI(label, popup, {
          async onBeforeOpen() {
            if (fetched) return;
            fetched = true;
            const html = await fetchDocumentedDocs(replacement.docPath);
            popup.innerHTML = html;
          }
        });
        break;
      }
      case "native": {
        const label = addPackageLabel(
          "module-replacements",
          "Prefer native code",
          "warning",
          "button"
        );
        label.classList.add("npm-userscript-module-replacements-label");
        let replacementText = replacement.replacement;
        if (replacementText.startsWith("Use ")) replacementText = replacementText.slice(4);
        const popup = document.createElement("div");
        popup.className = "npm-userscript-popup " + getReadmeInternalClassName();
        popup.innerHTML = `For Node.js v${replacement.nodeVersion} and later, use ${replacementText}. 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/${replacement.mdnPath}" target="_blank">See MDN docs</a>.
`;
        injectParent.appendChild(popup);
        computeFloatingUI(label, popup);
        break;
      }
      case "simple": {
        const label = addPackageLabel("module-replacements", "Prefer simpler code", "error", "button");
        label.classList.add("npm-userscript-module-replacements-label");
        const popup = document.createElement("div");
        popup.className = "npm-userscript-popup " + getReadmeInternalClassName();
        popup.textContent = replacement.replacement;
        injectParent.appendChild(popup);
        computeFloatingUI(label, popup);
        break;
      }
    }
  }
  function getReadmeInternalClassName() {
    const el = document.getElementById("readme");
    if (!el) return "";
    return el.className.split(" ").filter((c2) => c2.startsWith("_")).join(" ");
  }
  async function getModuleReplacements() {
    const results = [
      fetchJson("https://cdn.jsdelivr.net/npm/module-replacements@2/manifests/micro-utilities.json"),
      fetchJson("https://cdn.jsdelivr.net/npm/module-replacements@2/manifests/native.json"),
      fetchJson("https://cdn.jsdelivr.net/npm/module-replacements@2/manifests/preferred.json")
    ];
    const [microUtilities, native, preferred] = await Promise.all(results);
    return [
      ...microUtilities.moduleReplacements,
      ...native.moduleReplacements,
      ...preferred.moduleReplacements
    ];
  }
  async function fetchDocumentedDocs(docPath) {
    return cacheResult(`fetchDocumentedDocs:${docPath}`, 120, async () => {
      let markdown = await fetchText(
        `https://api.github.com/repos/es-tooling/module-replacements/contents/docs/modules/${docPath}.md`,
        {
          headers: {
            Accept: "application/vnd.github.raw+json",
            "X-GitHub-Api-Version": "2022-11-28"
          }
        }
      );
      markdown = markdown.replace(/^([\s\S]*?\n)# .+?\n/, "");
      const html = await fetchText("https://api.github.com/markdown", {
        method: "POST",
        headers: {
          Accept: "text/html",
          "X-GitHub-Api-Version": "2022-11-28"
        },
        body: JSON.stringify({
          text: markdown,
          mode: "gfm",
          context: "es-tooling/module-replacements"
        })
      });
      return html;
    });
  }
  var description7;
  var init_module_replacements = __esm({
    "src/features/module-replacements.ts"() {
      init_utils_fetch();
      init_utils_ui();
      init_utils();
      init_utils_cache();
      description7 = `Suggest alternatives for the package based on "es-tooling/module-replacements" data set.
`;
    }
  });

  // src/features/move-funding.ts
  var move_funding_exports = {};
  __export(move_funding_exports, {
    description: () => description8,
    run: () => run7
  });
  function run7() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-funding-button")) return;
    const sidebarButtons = document.querySelectorAll('[aria-label="Package sidebar"] a.button');
    let fundingButton = null;
    for (const button of sidebarButtons) {
      if (button.textContent.includes("Fund this package")) {
        fundingButton = button.parentElement;
        break;
      }
    }
    if (fundingButton) {
      const collaboratorsSection = document.querySelector("div:has(> #collaborators)");
      if (!collaboratorsSection) return;
      const cloned = fundingButton.cloneNode(true);
      cloned.classList.add("npm-userscript-funding-button");
      collaboratorsSection.insertAdjacentElement("afterend", cloned);
      fundingButton.style.display = "none";
    }
  }
  var description8;
  var init_move_funding = __esm({
    "src/features/move-funding.ts"() {
      init_utils();
      description8 = `Move the "Fund this package" button to the bottom of the sidebar.
`;
    }
  });

  // src/features/no-code-beta.ts
  var no_code_beta_exports = {};
  __export(no_code_beta_exports, {
    description: () => description9,
    disabled: () => disabled2,
    runPre: () => runPre8
  });
  function runPre8() {
    addStyle(`
    #package-tab-code > span > span:last-child {
      display: none;
    }
  `);
  }
  var description9, disabled2;
  var init_no_code_beta = __esm({
    "src/features/no-code-beta.ts"() {
      init_utils();
      description9 = `Hide the "Beta" label in the package code tab.
`;
      disabled2 = true;
    }
  });

  // src/features/remember-banner.ts
  var remember_banner_exports = {};
  __export(remember_banner_exports, {
    description: () => description10,
    run: () => run8,
    runPre: () => runPre9
  });
  function runPre9() {
    if (inited) return;
    inited = true;
    const wasClosed = cache.hasByPrefix(bannerPrefix);
    if (wasClosed) {
      addStyle(`
      section[aria-label="Site notifications"] {
        display: none;
      }
    `);
    }
  }
  function run8() {
    if (inited) return;
    const banner = document.querySelector('section[aria-label="Site notifications"]');
    if (!banner) return;
    const key = getBannerKey(banner);
    if (cache.get(key) === "hide") {
      banner.remove();
    } else {
      banner.style.display = "block";
      const closeButton = banner.querySelector("button");
      closeButton?.addEventListener("click", () => {
        cache.set(key, "hide");
      });
    }
    cache.clearByPrefix(bannerPrefix, [key]);
  }
  var description10, bannerPrefix, getBannerKey, inited;
  var init_remember_banner = __esm({
    "src/features/remember-banner.ts"() {
      init_utils_cache();
      init_utils();
      description10 = `Remember the banner at the top of the page when dismissed, so it doesn't keep showing up.
`;
      bannerPrefix = "remember-banner:";
      getBannerKey = (banner) => {
        const text = banner.textContent.trim();
        const hash = btoa(encodeURIComponent(text)).slice(0, 16) + text.length;
        return `${bannerPrefix}${hash}`;
      };
      inited = false;
    }
  });

  // src/features/remove-redundant-homepage.ts
  var remove_redundant_homepage_exports = {};
  __export(remove_redundant_homepage_exports, {
    description: () => description11,
    run: () => run9,
    teardown: () => teardown4
  });
  function teardown4(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    const homepageEl = document.getElementById("homePage");
    if (homepageEl) {
      homepageEl.parentElement.style.display = "";
    }
  }
  function run9() {
    if (!isValidPackagePage()) return;
    const homepageEl = document.getElementById("homePage");
    if (!homepageEl) return;
    const npmContext = getNpmContext();
    const homepage = npmContext.context.packument.homepage;
    const repository = npmContext.context.packument.repository;
    if (!homepage || !repository) return;
    const isRedundant = homepage === repository || homepage === `${repository}#readme`;
    if (isRedundant) {
      homepageEl.parentElement.style.display = "none";
    }
  }
  var description11;
  var init_remove_redundant_homepage = __esm({
    "src/features/remove-redundant-homepage.ts"() {
      init_utils();
      init_utils_npm_context();
      description11 = `Remove the homepage link if it's the same as the repository link, or only has a hash to the readme.
`;
    }
  });

  // src/features/remove-runkit.ts
  var remove_runkit_exports = {};
  __export(remove_runkit_exports, {
    description: () => description12,
    run: () => run10
  });
  function run10() {
    if (!isValidPackagePage()) return;
    const link = document.querySelector('a[href^="https://runkit.com/npm/"]');
    link?.remove();
  }
  var description12;
  var init_remove_runkit = __esm({
    "src/features/remove-runkit.ts"() {
      init_utils();
      description12 = `Remove the RunKit link as it's dead.
`;
    }
  });

  // src/features/repository-card.ts
  var repository_card_exports = {};
  __export(repository_card_exports, {
    description: () => description13,
    run: () => run11,
    runPre: () => runPre10,
    teardown: () => teardown5
  });
  function teardown5(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector(".npm-userscript-repository-card")?.remove();
  }
  function runPre10() {
    if (!isValidPackagePage()) return;
    addStyle(`
    .npm-userscript-repository-card {
      border: 1px solid #cccccc;
      border-radius: 5px;
      padding: 10px;
      margin-top: 14px;
      margin-right: -8px;
      font-size: 18px;
    }

    .npm-userscript-repository-card-title {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
    }
    
    .npm-userscript-repository-card-title-repo {
      font-weight: bold;
      text-wrap: nowrap;
    }

    .npm-userscript-repository-card-title-directory {
      font-weight: bold;
      color: #757575;
      text-wrap: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
    
    .npm-userscript-repository-card-title-separator {
      color: #757575;
    }

    .npm-userscript-repository-card-description {
      margin: 0;
      margin-top: 10px;
    }

    .npm-userscript-repository-card-entry {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-right: 20px;
    }
    .npm-userscript-repository-card-entry:last-child {
      margin-right: 0;
    }

    .npm-userscript-repository-card a {
      text-decoration: none;
    }

    .npm-userscript-repository-card a:focus,
    .npm-userscript-repository-card a:hover {
      text-decoration: underline;
      color: #cb3837;
    }
  `);
    addStyle(`
    .npm-userscript-repository-card + p {
      display: none;
    }
  `);
  }
  async function run11() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-repository-card")) return;
    const repositoryH3 = document.getElementById("repository");
    if (!repositoryH3) return;
    const repoData = await fetchGitHubRepoData();
    if (!repoData) return;
    const prCount = await fetchGitHubPullRequestsCount();
    if (prCount === void 0) return;
    const issueCount = repoData.open_issues_count - prCount;
    const packageJson = await fetchPackageJson();
    let directory = packageJson?.repository?.directory;
    if (directory) {
      directory = directory.replace(/^\/+/, "").replace(/\/+$/, "");
    }
    const fullRepoLink = repoData.html_url + (directory ? `/tree/${repoData.default_branch}/${directory}` : "");
    const changelogLink = await getChangelogLink(repoData.full_name, directory);
    const card = document.createElement("div");
    card.className = "npm-userscript-repository-card";
    card.innerHTML = `
    <div class="npm-userscript-repository-card-title">
      <img
        src="${repoData.owner.avatar_url}"
        alt="Repo logo"
        width="24"
        height="24"
        style="border-radius: ${repoData.organization ? "3px" : "100%"}"
      >
      <a class="npm-userscript-repository-card-title-repo" href="${repoData.html_url}" rel="noopener noreferrer nofollow">
        ${repoData.full_name}
      </a>
      ${directory ? `
            <span class="npm-userscript-repository-card-title-separator">/</span>
            <a class="npm-userscript-repository-card-title-directory" href="${fullRepoLink}" title="${directory}" rel="noopener noreferrer nofollow">
              ${directory}
            </a>
            ` : ""}
    </div>
    <div class="npm-userscript-repository-card-description">
      <a class="npm-userscript-repository-card-entry" href="${repoData.html_url}/stargazers" title="${repoData.stargazers_count} stars" rel="noopener noreferrer nofollow">
        ${starSvg}
        ${repoData.stargazers_count.toLocaleString()}
      </a>
      <a class="npm-userscript-repository-card-entry" href="${repoData.html_url}/issues" title="${issueCount} issues" rel="noopener noreferrer nofollow" style="gap: 5px;">
        ${issueSvg}
        ${issueCount.toLocaleString()}
      </a>
      <a class="npm-userscript-repository-card-entry" href="${repoData.html_url}/pulls" title="${prCount} pull requests" rel="noopener noreferrer nofollow">
        ${pullSvg}
        ${prCount.toLocaleString()}
      </a>
      ${changelogLink ? `
            <a class="npm-userscript-repository-card-entry" href="${changelogLink}" rel="noopener noreferrer nofollow" style="font-size: 90%">
              ${changelogSvg} Changelog
            </a>
            ` : ""}
    </div>
  `;
    repositoryH3.insertAdjacentElement("afterend", card);
    repositoryH3.parentElement?.classList.remove("bb");
    const sidebarColumns = document.querySelectorAll('[aria-label="Package sidebar"] > div:has(> h3)');
    for (const col of sidebarColumns) {
      const h3Text = col.querySelector("h3")?.textContent;
      if (h3Text === "Issues" || h3Text === "Pull Requests") {
        col.remove();
      }
    }
  }
  async function getChangelogLink(ownerRepo, directory) {
    const changelogPath = directory ? directory + "/CHANGELOG.md" : "CHANGELOG.md";
    return cacheResult(`getChangelogLink:${ownerRepo}:${directory}`, 600, async () => {
      const status = await fetchStatus(
        `https://api.github.com/repos/${ownerRepo}/contents/${changelogPath}`
      );
      if (status === 200) {
        return getRepositoryFilePath(changelogPath);
      }
    });
  }
  var description13, starSvg, issueSvg, pullSvg, changelogSvg;
  var init_repository_card = __esm({
    "src/features/repository-card.ts"() {
      init_utils_cache();
      init_utils_fetch();
      init_utils();
      description13 = `Consolidates all repository information in a card-like view in the package sidebar.
Enabling this would remove the "Stars", "Issues", and "Pull Requests" columns.
`;
      starSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path></svg>`;
      issueSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>`;
      pullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>`;
      changelogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M5 8.25a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 5 8.25ZM4 10.5A.75.75 0 0 0 4 12h4a.75.75 0 0 0 0-1.5H4Z"></path><path d="M13-.005c1.654 0 3 1.328 3 3 0 .982-.338 1.933-.783 2.818-.443.879-1.028 1.758-1.582 2.588l-.011.017c-.568.853-1.104 1.659-1.501 2.446-.398.789-.623 1.494-.623 2.136a1.5 1.5 0 1 0 2.333-1.248.75.75 0 0 1 .834-1.246A3 3 0 0 1 13 16H3a3 3 0 0 1-3-3c0-1.582.891-3.135 1.777-4.506.209-.322.418-.637.623-.946.473-.709.923-1.386 1.287-2.048H2.51c-.576 0-1.381-.133-1.907-.783A2.68 2.68 0 0 1 0 2.995a3 3 0 0 1 3-3Zm0 1.5a1.5 1.5 0 0 0-1.5 1.5c0 .476.223.834.667 1.132A.75.75 0 0 1 11.75 5.5H5.368c-.467 1.003-1.141 2.015-1.773 2.963-.192.289-.381.571-.558.845C2.13 10.711 1.5 11.916 1.5 13A1.5 1.5 0 0 0 3 14.5h7.401A2.989 2.989 0 0 1 10 13c0-.979.338-1.928.784-2.812.441-.874 1.023-1.748 1.575-2.576l.017-.026c.568-.853 1.103-1.658 1.501-2.448.398-.79.623-1.497.623-2.143 0-.838-.669-1.5-1.5-1.5Zm-10 0a1.5 1.5 0 0 0-1.5 1.5c0 .321.1.569.27.778.097.12.325.227.74.227h7.674A2.737 2.737 0 0 1 10 2.995c0-.546.146-1.059.401-1.5Z"></path></svg>`;
    }
  });

  // src/features/repository-directory.ts
  var repository_directory_exports = {};
  __export(repository_directory_exports, {
    description: () => description14,
    run: () => run12,
    teardown: () => teardown6
  });
  function teardown6(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector("a[aria-labelledby*=repository-link]")?.classList.remove("npm-userscript-repository-directory");
  }
  async function run12() {
    if (!isValidPackagePage()) return;
    if (!document.querySelector(".npm-userscript-repository-directory")) return;
    const el = document.querySelector("a[aria-labelledby*=repository-link]");
    const textEl = document.getElementById("repository-link");
    if (!el || !textEl) return;
    const fullRepositoryLink = await getFullRepositoryLink();
    if (!fullRepositoryLink) return;
    if (el.href === fullRepositoryLink) return;
    el.href = fullRepositoryLink;
    textEl.textContent = fullRepositoryLink.replace(/^https?:\/\//, "");
    el.classList.add("npm-userscript-repository-directory");
  }
  var description14;
  var init_repository_directory = __esm({
    "src/features/repository-directory.ts"() {
      init_utils_fetch();
      init_utils();
      description14 = `Adds the repository directory to the repository link.
`;
    }
  });

  // src/features/show-binary-label.ts
  var show_binary_label_exports = {};
  __export(show_binary_label_exports, {
    description: () => description15,
    run: () => run13,
    runPre: () => runPre11,
    teardown: () => teardown7
  });
  function teardown7(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelectorAll(".npm-userscript-types-label").forEach((el) => el.remove());
  }
  function runPre11() {
    addPackageLabelStyle();
  }
  async function run13() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-binary-label")) return;
    const packageJson = await fetchPackageJson();
    if (!packageJson) return;
    if (shipsNativeBinaries(packageJson)) {
      const label = addPackageLabel("show-binary-label", "Has binaries");
      label.classList.add("npm-userscript-binary-label");
      label.title = "This package ships prebuilt native binaries via optional dependencies";
      return;
    }
    const nativeInfo = isNativeBinary(packageJson);
    if (nativeInfo) {
      const label = addPackageLabel("show-binary-label", `${nativeInfo} binary`);
      label.classList.add("npm-userscript-binary-label");
      label.title = `This package ships prebuilt native binary for ${nativeInfo}`;
    }
  }
  function shipsNativeBinaries(packageJson) {
    const optionalDependencies = Object.keys(packageJson.optionalDependencies || {});
    if (optionalDependencies.length <= 0) return false;
    let matchCount = 0;
    for (const dep of optionalDependencies) {
      if (popularOs.some((os) => dep.includes(os)) && popularArch.some((arch) => dep.includes(arch)) && ++matchCount >= 2) {
        return true;
      }
    }
    return false;
  }
  function isNativeBinary(packageJson) {
    const os = packageJson.os ?? [];
    if (os.length === 0) return false;
    let str = os.join(", ");
    const cpu = packageJson.cpu ?? [];
    if (cpu.length > 0) {
      str += ` ${cpu.join(", ")}`;
    }
    return str;
  }
  var description15, popularOs, popularArch;
  var init_show_binary_label = __esm({
    "src/features/show-binary-label.ts"() {
      init_utils_fetch();
      init_utils_ui();
      init_utils();
      description15 = `Adds a label for packages that ship prebuilt native binaries.
`;
      popularOs = ["linux", "darwin", "win32"];
      popularArch = ["x64", "arm64", "ia32"];
    }
  });

  // src/features/show-cli-label-and-command.ts
  var show_cli_label_and_command_exports = {};
  __export(show_cli_label_and_command_exports, {
    description: () => description16,
    run: () => run14,
    runPre: () => runPre12,
    teardown: () => teardown8
  });
  function teardown8(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector(".npm-userscript-types-label")?.remove();
  }
  function runPre12() {
    addPackageLabelStyle();
  }
  async function run14() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-types-label")) return;
    const packageName = getPackageName();
    const packageVersion = getPackageVersion();
    if (!packageName || !packageVersion) return;
    const isLatest = getNpmContext().context.packument.distTags.latest === packageVersion;
    if (packageName.startsWith("create-") || /^@.+\/create-/.test(packageName)) {
      const label2 = addPackageLabel("show-cli-label-and-command", "CLI");
      label2.classList.add("npm-userscript-types-label");
      label2.title = "This package is a template CLI";
      const atVersion = isLatest ? "@latest" : `@${packageVersion}`;
      updateCodeBlock(`npm create ${packageName.slice("create-".length)}${atVersion}`);
      return;
    }
    const packageJson = await fetchPackageJson();
    if (!packageJson) return;
    const binNames = getBinNames(packageJson.bin, packageName);
    if (binNames.length === 0) return;
    const label = addPackageLabel("show-cli-label-and-command", "CLI");
    label.classList.add("npm-userscript-types-label");
    label.title = `This package ships the ${binNames.map((n2) => `"${n2}"`).join(", ")} command`;
    if (!packageJson.main && !packageJson.exports && !packageJson.browser && !packageJson.module) {
      const atVersion = isLatest ? "" : `@${packageVersion}`;
      updateCodeBlock(`npx ${packageName}${atVersion}`);
    }
  }
  function getBinNames(binField, packageName) {
    if (typeof binField === "string") {
      return [packageName.startsWith("@") ? packageName.split("/")[1] : packageName];
    } else if (typeof binField === "object" && binField !== null) {
      return Object.keys(binField);
    } else {
      return [];
    }
  }
  function updateCodeBlock(command) {
    const codeBlock = document.querySelector('[aria-label="Package sidebar"] code');
    if (!codeBlock) return;
    codeBlock.textContent = command;
  }
  var description16;
  var init_show_cli_label_and_command = __esm({
    "src/features/show-cli-label-and-command.ts"() {
      init_utils_fetch();
      init_utils_npm_context();
      init_utils_ui();
      init_utils();
      description16 = `Adds a label if the package ships a CLI via the package.json "bin" field, and update the install
command to "npm create" or "npx" accordingly.
`;
    }
  });

  // src/features/show-engine-label.ts
  var show_engine_label_exports = {};
  __export(show_engine_label_exports, {
    description: () => description17,
    run: () => run15,
    runPre: () => runPre13,
    teardown: () => teardown9
  });
  function teardown9(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector(".npm-userscript-engine-label")?.remove();
  }
  function runPre13() {
    addPackageLabelStyle();
  }
  async function run15() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-engine-label")) return;
    const packageJson = await fetchPackageJson();
    if (!packageJson) return;
    const engines = packageJson.engines;
    if (!engines || Object.keys(engines).length === 0) return;
    if (engines.node) {
      const label = addPackageLabel("show-engine-label", `Node.js ${engines.node}`);
      label.classList.add("npm-userscript-engine-label");
      label.title = `This package requires Node.js ${engines.node}`;
    }
  }
  var description17;
  var init_show_engine_label = __esm({
    "src/features/show-engine-label.ts"() {
      init_utils_fetch();
      init_utils_ui();
      init_utils();
      description17 = `Adds a label of the engine versions (e.g. Node.js) that a package supports.
`;
    }
  });

  // src/features/show-file-types-label.ts
  var show_file_types_label_exports = {};
  __export(show_file_types_label_exports, {
    description: () => description18,
    run: () => run16,
    runPre: () => runPre14,
    teardown: () => teardown10
  });
  function teardown10(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelectorAll(".npm-userscript-file-types-label").forEach((el) => el.remove());
  }
  function runPre14() {
    addPackageLabelStyle();
  }
  async function run16() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-file-types-label")) return;
    const data = await fetchPackageFilesData();
    if (!data) return;
    const packageJson = await fetchPackageJson();
    if (!packageJson) return;
    const fileNames = Object.keys(data.files).sort();
    const fileTypes = await detectFileTypes(fileNames, data.files, packageJson);
    if (fileTypes.hasEsm) {
      const label = addPackageLabel("show-file-types-label", "ESM");
      label.classList.add("npm-userscript-file-types-label");
      label.title = "This package ships ECMAScript Modules (ESM)";
    }
    if (fileTypes.hasCjs) {
      const label = addPackageLabel("show-file-types-label", "CJS");
      label.classList.add("npm-userscript-file-types-label");
      label.title = "This package ships CommonJS modules (CJS)";
    }
  }
  async function detectFileTypes(fileNames, files, rootPackageJson) {
    let hasEsm = false;
    let hasCjs = false;
    for (const fileName of fileNames) {
      if (fileName.endsWith(".mjs")) {
        hasEsm = true;
      } else if (fileName.endsWith(".cjs")) {
        hasCjs = true;
      }
      if (hasEsm && hasCjs) break;
    }
    if (hasEsm && hasCjs) {
      return { hasEsm, hasCjs };
    }
    for (const fileName of fileNames) {
      if (fileName.endsWith(".js")) {
        const packageJson = await getNearesetPackageJson(fileName);
        if (packageJson?.type === "module") {
          hasEsm = true;
        } else {
          hasCjs = true;
        }
        if (hasEsm && hasCjs) break;
      }
    }
    return { hasEsm, hasCjs };
    async function getNearesetPackageJson(path) {
      const parts = path.split("/");
      while (parts.length > 0) {
        parts.pop();
        const candidatePath = parts.join("/") + "/package.json";
        if (candidatePath === "/package.json") {
          return rootPackageJson;
        } else if (files[candidatePath]) {
          return await fetchPackageFileContent(files[candidatePath].hex);
        }
      }
    }
  }
  var description18;
  var init_show_file_types_label = __esm({
    "src/features/show-file-types-label.ts"() {
      init_utils_fetch();
      init_utils_ui();
      init_utils();
      description18 = `Show ESM or CJS labels if the package ships them.
`;
    }
  });

  // src/features/show-lifecycle-scripts-label.ts
  var show_lifecycle_scripts_label_exports = {};
  __export(show_lifecycle_scripts_label_exports, {
    description: () => description19,
    run: () => run17,
    runPre: () => runPre15,
    teardown: () => teardown11
  });
  function teardown11(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector(".npm-userscript-lifecycle-scripts-label")?.remove();
  }
  function runPre15() {
    addPackageLabelStyle();
  }
  async function run17() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-lifecycle-scripts-label")) return;
    const packageJson = await fetchPackageJson();
    if (!packageJson) return;
    const scriptNames = Object.keys(packageJson.scripts || {});
    const matchedScripts = LIFECYCLE_SCRIPTS.filter((script) => scriptNames.includes(script));
    if (matchedScripts.length === 0) return;
    const label = addPackageLabel("show-lifecycle-scripts-label", `Runs script on install`, "warning");
    label.classList.add("npm-userscript-lifecycle-scripts-label");
    label.title = `This package defines lifecycle scripts that run on install: ${matchedScripts.map((s2) => `"${s2}"`).join(", ")}`;
  }
  var description19, LIFECYCLE_SCRIPTS;
  var init_show_lifecycle_scripts_label = __esm({
    "src/features/show-lifecycle-scripts-label.ts"() {
      init_utils_fetch();
      init_utils_ui();
      init_utils();
      description19 = `Adds a label if the package defines lifecycle scripts in its package.json.
`;
      LIFECYCLE_SCRIPTS = ["postinstall", "preinstall", "install"];
    }
  });

  // src/features/show-types-label.ts
  var show_types_label_exports = {};
  __export(show_types_label_exports, {
    description: () => description20,
    run: () => run18,
    runPre: () => runPre16,
    teardown: () => teardown12
  });
  function teardown12(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector(".npm-userscript-types-label")?.remove();
  }
  function runPre16() {
    addPackageLabelStyle();
    addStyle(`
    h1 > div[data-nosnippet="true"] {
      display: none !important;
    }
  `);
  }
  async function run18() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-types-label")) return;
    const packageName = getPackageName();
    if (!packageName) return;
    if (packageName.startsWith("create-") || /^@.+\/create-/.test(packageName)) {
    }
    const typesInfo = parseNpmTypes();
    if (typesInfo.type === "none") {
      const data = await fetchPackageFilesData();
      if (Object.keys(data?.files ?? {}).some(
        (p2) => p2.endsWith(".d.ts") || p2.endsWith(".d.mts") || p2.endsWith(".d.cts")
      )) {
        typesInfo.type = "bundled";
      } else {
        let hasJsFiles = function(value) {
          if (typeof value === "string") {
            return value.endsWith(".js") || value.endsWith(".mjs") || value.endsWith(".cjs");
          } else if (Array.isArray(value)) {
            return value.some(hasJsFiles);
          } else if (typeof value === "object" && value !== null) {
            return Object.values(value).some(hasJsFiles);
          }
          return false;
        };
        const packageJson = await fetchPackageJson();
        if (!hasJsFiles(packageJson?.main) && !hasJsFiles(packageJson?.exports)) {
          return;
        }
      }
    }
    let label;
    if (typesInfo.type === "none") {
      label = addPackageLabel("show-types-label", "Untyped", "warning");
      label.title = "This package does not ship TypeScript types";
    } else if (typesInfo.type === "bundled") {
      label = addPackageLabel("show-types-label", "DTS");
      label.title = "This package ships TypeScript types";
    } else if (typesInfo.type === "package") {
      label = addPackageLabel("show-types-label", `DTS: ${typesInfo.packageName}`);
      label.title = `This package relies on ${typesInfo.packageName} for TypeScript types`;
    } else {
      console.warn("[npm-userscript:show-types-label] unable to determine types info");
    }
    label?.classList.add("npm-userscript-types-label");
  }
  function parseNpmTypes() {
    const npmTypes = getNpmContext().context.capsule.types;
    if (npmTypes.typescript == null) {
      return { type: "none" };
    }
    if (npmTypes.typescript.bundled) {
      return { type: "bundled" };
    }
    if (npmTypes.typescript.package) {
      return { type: "package", packageName: npmTypes.typescript.package };
    }
    return { type: "unknown" };
  }
  var description20;
  var init_show_types_label = __esm({
    "src/features/show-types-label.ts"() {
      init_utils_fetch();
      init_utils_npm_context();
      init_utils_ui();
      init_utils();
      description20 = `Adds a label for packages that ship types. This is similar to npm's own DT / TS icon but
with a more consistent UI. It is also more accurate if the package ship types but isn't detectable
in the package.json.
`;
    }
  });

  // node_modules/semver/internal/debug.js
  var require_debug = __commonJS({
    "node_modules/semver/internal/debug.js"(exports, module) {
      "use strict";
      var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
      };
      module.exports = debug;
    }
  });

  // node_modules/semver/internal/constants.js
  var require_constants = __commonJS({
    "node_modules/semver/internal/constants.js"(exports, module) {
      "use strict";
      var SEMVER_SPEC_VERSION = "2.0.0";
      var MAX_LENGTH = 256;
      var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
      9007199254740991;
      var MAX_SAFE_COMPONENT_LENGTH = 16;
      var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
      var RELEASE_TYPES = [
        "major",
        "premajor",
        "minor",
        "preminor",
        "patch",
        "prepatch",
        "prerelease"
      ];
      module.exports = {
        MAX_LENGTH,
        MAX_SAFE_COMPONENT_LENGTH,
        MAX_SAFE_BUILD_LENGTH,
        MAX_SAFE_INTEGER,
        RELEASE_TYPES,
        SEMVER_SPEC_VERSION,
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2
      };
    }
  });

  // node_modules/semver/internal/re.js
  var require_re = __commonJS({
    "node_modules/semver/internal/re.js"(exports, module) {
      "use strict";
      var {
        MAX_SAFE_COMPONENT_LENGTH,
        MAX_SAFE_BUILD_LENGTH,
        MAX_LENGTH
      } = require_constants();
      var debug = require_debug();
      exports = module.exports = {};
      var re2 = exports.re = [];
      var safeRe = exports.safeRe = [];
      var src = exports.src = [];
      var safeSrc = exports.safeSrc = [];
      var t2 = exports.t = {};
      var R2 = 0;
      var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
      var safeRegexReplacements = [
        ["\\s", 1],
        ["\\d", MAX_LENGTH],
        [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
      ];
      var makeSafeRegex = (value) => {
        for (const [token, max2] of safeRegexReplacements) {
          value = value.split(`${token}*`).join(`${token}{0,${max2}}`).split(`${token}+`).join(`${token}{1,${max2}}`);
        }
        return value;
      };
      var createToken = (name, value, isGlobal) => {
        const safe = makeSafeRegex(value);
        const index = R2++;
        debug(name, index, value);
        t2[name] = index;
        src[index] = value;
        safeSrc[index] = safe;
        re2[index] = new RegExp(value, isGlobal ? "g" : void 0);
        safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
      };
      createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
      createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
      createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
      createToken("MAINVERSION", `(${src[t2.NUMERICIDENTIFIER]})\\.(${src[t2.NUMERICIDENTIFIER]})\\.(${src[t2.NUMERICIDENTIFIER]})`);
      createToken("MAINVERSIONLOOSE", `(${src[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src[t2.NUMERICIDENTIFIERLOOSE]})`);
      createToken("PRERELEASEIDENTIFIER", `(?:${src[t2.NONNUMERICIDENTIFIER]}|${src[t2.NUMERICIDENTIFIER]})`);
      createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t2.NONNUMERICIDENTIFIER]}|${src[t2.NUMERICIDENTIFIERLOOSE]})`);
      createToken("PRERELEASE", `(?:-(${src[t2.PRERELEASEIDENTIFIER]}(?:\\.${src[t2.PRERELEASEIDENTIFIER]})*))`);
      createToken("PRERELEASELOOSE", `(?:-?(${src[t2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t2.PRERELEASEIDENTIFIERLOOSE]})*))`);
      createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
      createToken("BUILD", `(?:\\+(${src[t2.BUILDIDENTIFIER]}(?:\\.${src[t2.BUILDIDENTIFIER]})*))`);
      createToken("FULLPLAIN", `v?${src[t2.MAINVERSION]}${src[t2.PRERELEASE]}?${src[t2.BUILD]}?`);
      createToken("FULL", `^${src[t2.FULLPLAIN]}$`);
      createToken("LOOSEPLAIN", `[v=\\s]*${src[t2.MAINVERSIONLOOSE]}${src[t2.PRERELEASELOOSE]}?${src[t2.BUILD]}?`);
      createToken("LOOSE", `^${src[t2.LOOSEPLAIN]}$`);
      createToken("GTLT", "((?:<|>)?=?)");
      createToken("XRANGEIDENTIFIERLOOSE", `${src[t2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
      createToken("XRANGEIDENTIFIER", `${src[t2.NUMERICIDENTIFIER]}|x|X|\\*`);
      createToken("XRANGEPLAIN", `[v=\\s]*(${src[t2.XRANGEIDENTIFIER]})(?:\\.(${src[t2.XRANGEIDENTIFIER]})(?:\\.(${src[t2.XRANGEIDENTIFIER]})(?:${src[t2.PRERELEASE]})?${src[t2.BUILD]}?)?)?`);
      createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:${src[t2.PRERELEASELOOSE]})?${src[t2.BUILD]}?)?)?`);
      createToken("XRANGE", `^${src[t2.GTLT]}\\s*${src[t2.XRANGEPLAIN]}$`);
      createToken("XRANGELOOSE", `^${src[t2.GTLT]}\\s*${src[t2.XRANGEPLAINLOOSE]}$`);
      createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
      createToken("COERCE", `${src[t2.COERCEPLAIN]}(?:$|[^\\d])`);
      createToken("COERCEFULL", src[t2.COERCEPLAIN] + `(?:${src[t2.PRERELEASE]})?(?:${src[t2.BUILD]})?(?:$|[^\\d])`);
      createToken("COERCERTL", src[t2.COERCE], true);
      createToken("COERCERTLFULL", src[t2.COERCEFULL], true);
      createToken("LONETILDE", "(?:~>?)");
      createToken("TILDETRIM", `(\\s*)${src[t2.LONETILDE]}\\s+`, true);
      exports.tildeTrimReplace = "$1~";
      createToken("TILDE", `^${src[t2.LONETILDE]}${src[t2.XRANGEPLAIN]}$`);
      createToken("TILDELOOSE", `^${src[t2.LONETILDE]}${src[t2.XRANGEPLAINLOOSE]}$`);
      createToken("LONECARET", "(?:\\^)");
      createToken("CARETTRIM", `(\\s*)${src[t2.LONECARET]}\\s+`, true);
      exports.caretTrimReplace = "$1^";
      createToken("CARET", `^${src[t2.LONECARET]}${src[t2.XRANGEPLAIN]}$`);
      createToken("CARETLOOSE", `^${src[t2.LONECARET]}${src[t2.XRANGEPLAINLOOSE]}$`);
      createToken("COMPARATORLOOSE", `^${src[t2.GTLT]}\\s*(${src[t2.LOOSEPLAIN]})$|^$`);
      createToken("COMPARATOR", `^${src[t2.GTLT]}\\s*(${src[t2.FULLPLAIN]})$|^$`);
      createToken("COMPARATORTRIM", `(\\s*)${src[t2.GTLT]}\\s*(${src[t2.LOOSEPLAIN]}|${src[t2.XRANGEPLAIN]})`, true);
      exports.comparatorTrimReplace = "$1$2$3";
      createToken("HYPHENRANGE", `^\\s*(${src[t2.XRANGEPLAIN]})\\s+-\\s+(${src[t2.XRANGEPLAIN]})\\s*$`);
      createToken("HYPHENRANGELOOSE", `^\\s*(${src[t2.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t2.XRANGEPLAINLOOSE]})\\s*$`);
      createToken("STAR", "(<|>)?=?\\s*\\*");
      createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
      createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
    }
  });

  // node_modules/semver/internal/parse-options.js
  var require_parse_options = __commonJS({
    "node_modules/semver/internal/parse-options.js"(exports, module) {
      "use strict";
      var looseOption = Object.freeze({ loose: true });
      var emptyOpts = Object.freeze({});
      var parseOptions = (options) => {
        if (!options) {
          return emptyOpts;
        }
        if (typeof options !== "object") {
          return looseOption;
        }
        return options;
      };
      module.exports = parseOptions;
    }
  });

  // node_modules/semver/internal/identifiers.js
  var require_identifiers = __commonJS({
    "node_modules/semver/internal/identifiers.js"(exports, module) {
      "use strict";
      var numeric = /^[0-9]+$/;
      var compareIdentifiers = (a2, b2) => {
        if (typeof a2 === "number" && typeof b2 === "number") {
          return a2 === b2 ? 0 : a2 < b2 ? -1 : 1;
        }
        const anum = numeric.test(a2);
        const bnum = numeric.test(b2);
        if (anum && bnum) {
          a2 = +a2;
          b2 = +b2;
        }
        return a2 === b2 ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a2 < b2 ? -1 : 1;
      };
      var rcompareIdentifiers = (a2, b2) => compareIdentifiers(b2, a2);
      module.exports = {
        compareIdentifiers,
        rcompareIdentifiers
      };
    }
  });

  // node_modules/semver/classes/semver.js
  var require_semver = __commonJS({
    "node_modules/semver/classes/semver.js"(exports, module) {
      "use strict";
      var debug = require_debug();
      var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
      var { safeRe: re2, t: t2 } = require_re();
      var parseOptions = require_parse_options();
      var { compareIdentifiers } = require_identifiers();
      var SemVer = class _SemVer {
        constructor(version, options) {
          options = parseOptions(options);
          if (version instanceof _SemVer) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
              return version;
            } else {
              version = version.version;
            }
          } else if (typeof version !== "string") {
            throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
          }
          if (version.length > MAX_LENGTH) {
            throw new TypeError(
              `version is longer than ${MAX_LENGTH} characters`
            );
          }
          debug("SemVer", version, options);
          this.options = options;
          this.loose = !!options.loose;
          this.includePrerelease = !!options.includePrerelease;
          const m = version.trim().match(options.loose ? re2[t2.LOOSE] : re2[t2.FULL]);
          if (!m) {
            throw new TypeError(`Invalid Version: ${version}`);
          }
          this.raw = version;
          this.major = +m[1];
          this.minor = +m[2];
          this.patch = +m[3];
          if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError("Invalid major version");
          }
          if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError("Invalid minor version");
          }
          if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError("Invalid patch version");
          }
          if (!m[4]) {
            this.prerelease = [];
          } else {
            this.prerelease = m[4].split(".").map((id) => {
              if (/^[0-9]+$/.test(id)) {
                const num = +id;
                if (num >= 0 && num < MAX_SAFE_INTEGER) {
                  return num;
                }
              }
              return id;
            });
          }
          this.build = m[5] ? m[5].split(".") : [];
          this.format();
        }
        format() {
          this.version = `${this.major}.${this.minor}.${this.patch}`;
          if (this.prerelease.length) {
            this.version += `-${this.prerelease.join(".")}`;
          }
          return this.version;
        }
        toString() {
          return this.version;
        }
        compare(other) {
          debug("SemVer.compare", this.version, this.options, other);
          if (!(other instanceof _SemVer)) {
            if (typeof other === "string" && other === this.version) {
              return 0;
            }
            other = new _SemVer(other, this.options);
          }
          if (other.version === this.version) {
            return 0;
          }
          return this.compareMain(other) || this.comparePre(other);
        }
        compareMain(other) {
          if (!(other instanceof _SemVer)) {
            other = new _SemVer(other, this.options);
          }
          if (this.major < other.major) {
            return -1;
          }
          if (this.major > other.major) {
            return 1;
          }
          if (this.minor < other.minor) {
            return -1;
          }
          if (this.minor > other.minor) {
            return 1;
          }
          if (this.patch < other.patch) {
            return -1;
          }
          if (this.patch > other.patch) {
            return 1;
          }
          return 0;
        }
        comparePre(other) {
          if (!(other instanceof _SemVer)) {
            other = new _SemVer(other, this.options);
          }
          if (this.prerelease.length && !other.prerelease.length) {
            return -1;
          } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
          } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
          }
          let i2 = 0;
          do {
            const a2 = this.prerelease[i2];
            const b2 = other.prerelease[i2];
            debug("prerelease compare", i2, a2, b2);
            if (a2 === void 0 && b2 === void 0) {
              return 0;
            } else if (b2 === void 0) {
              return 1;
            } else if (a2 === void 0) {
              return -1;
            } else if (a2 === b2) {
              continue;
            } else {
              return compareIdentifiers(a2, b2);
            }
          } while (++i2);
        }
        compareBuild(other) {
          if (!(other instanceof _SemVer)) {
            other = new _SemVer(other, this.options);
          }
          let i2 = 0;
          do {
            const a2 = this.build[i2];
            const b2 = other.build[i2];
            debug("build compare", i2, a2, b2);
            if (a2 === void 0 && b2 === void 0) {
              return 0;
            } else if (b2 === void 0) {
              return 1;
            } else if (a2 === void 0) {
              return -1;
            } else if (a2 === b2) {
              continue;
            } else {
              return compareIdentifiers(a2, b2);
            }
          } while (++i2);
        }
        // preminor will bump the version up to the next minor release, and immediately
        // down to pre-release. premajor and prepatch work the same way.
        inc(release, identifier, identifierBase) {
          if (release.startsWith("pre")) {
            if (!identifier && identifierBase === false) {
              throw new Error("invalid increment argument: identifier is empty");
            }
            if (identifier) {
              const match = `-${identifier}`.match(this.options.loose ? re2[t2.PRERELEASELOOSE] : re2[t2.PRERELEASE]);
              if (!match || match[1] !== identifier) {
                throw new Error(`invalid identifier: ${identifier}`);
              }
            }
          }
          switch (release) {
            case "premajor":
              this.prerelease.length = 0;
              this.patch = 0;
              this.minor = 0;
              this.major++;
              this.inc("pre", identifier, identifierBase);
              break;
            case "preminor":
              this.prerelease.length = 0;
              this.patch = 0;
              this.minor++;
              this.inc("pre", identifier, identifierBase);
              break;
            case "prepatch":
              this.prerelease.length = 0;
              this.inc("patch", identifier, identifierBase);
              this.inc("pre", identifier, identifierBase);
              break;
            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
            case "prerelease":
              if (this.prerelease.length === 0) {
                this.inc("patch", identifier, identifierBase);
              }
              this.inc("pre", identifier, identifierBase);
              break;
            case "release":
              if (this.prerelease.length === 0) {
                throw new Error(`version ${this.raw} is not a prerelease`);
              }
              this.prerelease.length = 0;
              break;
            case "major":
              if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
                this.major++;
              }
              this.minor = 0;
              this.patch = 0;
              this.prerelease = [];
              break;
            case "minor":
              if (this.patch !== 0 || this.prerelease.length === 0) {
                this.minor++;
              }
              this.patch = 0;
              this.prerelease = [];
              break;
            case "patch":
              if (this.prerelease.length === 0) {
                this.patch++;
              }
              this.prerelease = [];
              break;
            // This probably shouldn't be used publicly.
            // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
            case "pre": {
              const base = Number(identifierBase) ? 1 : 0;
              if (this.prerelease.length === 0) {
                this.prerelease = [base];
              } else {
                let i2 = this.prerelease.length;
                while (--i2 >= 0) {
                  if (typeof this.prerelease[i2] === "number") {
                    this.prerelease[i2]++;
                    i2 = -2;
                  }
                }
                if (i2 === -1) {
                  if (identifier === this.prerelease.join(".") && identifierBase === false) {
                    throw new Error("invalid increment argument: identifier already exists");
                  }
                  this.prerelease.push(base);
                }
              }
              if (identifier) {
                let prerelease = [identifier, base];
                if (identifierBase === false) {
                  prerelease = [identifier];
                }
                if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                  if (isNaN(this.prerelease[1])) {
                    this.prerelease = prerelease;
                  }
                } else {
                  this.prerelease = prerelease;
                }
              }
              break;
            }
            default:
              throw new Error(`invalid increment argument: ${release}`);
          }
          this.raw = this.format();
          if (this.build.length) {
            this.raw += `+${this.build.join(".")}`;
          }
          return this;
        }
      };
      module.exports = SemVer;
    }
  });

  // node_modules/semver/functions/compare.js
  var require_compare = __commonJS({
    "node_modules/semver/functions/compare.js"(exports, module) {
      "use strict";
      var SemVer = require_semver();
      var compare = (a2, b2, loose) => new SemVer(a2, loose).compare(new SemVer(b2, loose));
      module.exports = compare;
    }
  });

  // node_modules/semver/functions/gte.js
  var require_gte = __commonJS({
    "node_modules/semver/functions/gte.js"(exports, module) {
      "use strict";
      var compare = require_compare();
      var gte = (a2, b2, loose) => compare(a2, b2, loose) >= 0;
      module.exports = gte;
    }
  });

  // node_modules/semver/functions/lt.js
  var require_lt = __commonJS({
    "node_modules/semver/functions/lt.js"(exports, module) {
      "use strict";
      var compare = require_compare();
      var lt = (a2, b2, loose) => compare(a2, b2, loose) < 0;
      module.exports = lt;
    }
  });

  // node_modules/semver/internal/lrucache.js
  var require_lrucache = __commonJS({
    "node_modules/semver/internal/lrucache.js"(exports, module) {
      "use strict";
      var LRUCache = class {
        constructor() {
          this.max = 1e3;
          this.map = /* @__PURE__ */ new Map();
        }
        get(key) {
          const value = this.map.get(key);
          if (value === void 0) {
            return void 0;
          } else {
            this.map.delete(key);
            this.map.set(key, value);
            return value;
          }
        }
        delete(key) {
          return this.map.delete(key);
        }
        set(key, value) {
          const deleted = this.delete(key);
          if (!deleted && value !== void 0) {
            if (this.map.size >= this.max) {
              const firstKey = this.map.keys().next().value;
              this.delete(firstKey);
            }
            this.map.set(key, value);
          }
          return this;
        }
      };
      module.exports = LRUCache;
    }
  });

  // node_modules/semver/functions/eq.js
  var require_eq = __commonJS({
    "node_modules/semver/functions/eq.js"(exports, module) {
      "use strict";
      var compare = require_compare();
      var eq = (a2, b2, loose) => compare(a2, b2, loose) === 0;
      module.exports = eq;
    }
  });

  // node_modules/semver/functions/neq.js
  var require_neq = __commonJS({
    "node_modules/semver/functions/neq.js"(exports, module) {
      "use strict";
      var compare = require_compare();
      var neq = (a2, b2, loose) => compare(a2, b2, loose) !== 0;
      module.exports = neq;
    }
  });

  // node_modules/semver/functions/gt.js
  var require_gt = __commonJS({
    "node_modules/semver/functions/gt.js"(exports, module) {
      "use strict";
      var compare = require_compare();
      var gt = (a2, b2, loose) => compare(a2, b2, loose) > 0;
      module.exports = gt;
    }
  });

  // node_modules/semver/functions/lte.js
  var require_lte = __commonJS({
    "node_modules/semver/functions/lte.js"(exports, module) {
      "use strict";
      var compare = require_compare();
      var lte = (a2, b2, loose) => compare(a2, b2, loose) <= 0;
      module.exports = lte;
    }
  });

  // node_modules/semver/functions/cmp.js
  var require_cmp = __commonJS({
    "node_modules/semver/functions/cmp.js"(exports, module) {
      "use strict";
      var eq = require_eq();
      var neq = require_neq();
      var gt = require_gt();
      var gte = require_gte();
      var lt = require_lt();
      var lte = require_lte();
      var cmp = (a2, op, b2, loose) => {
        switch (op) {
          case "===":
            if (typeof a2 === "object") {
              a2 = a2.version;
            }
            if (typeof b2 === "object") {
              b2 = b2.version;
            }
            return a2 === b2;
          case "!==":
            if (typeof a2 === "object") {
              a2 = a2.version;
            }
            if (typeof b2 === "object") {
              b2 = b2.version;
            }
            return a2 !== b2;
          case "":
          case "=":
          case "==":
            return eq(a2, b2, loose);
          case "!=":
            return neq(a2, b2, loose);
          case ">":
            return gt(a2, b2, loose);
          case ">=":
            return gte(a2, b2, loose);
          case "<":
            return lt(a2, b2, loose);
          case "<=":
            return lte(a2, b2, loose);
          default:
            throw new TypeError(`Invalid operator: ${op}`);
        }
      };
      module.exports = cmp;
    }
  });

  // node_modules/semver/classes/comparator.js
  var require_comparator = __commonJS({
    "node_modules/semver/classes/comparator.js"(exports, module) {
      "use strict";
      var ANY = /* @__PURE__ */ Symbol("SemVer ANY");
      var Comparator = class _Comparator {
        static get ANY() {
          return ANY;
        }
        constructor(comp, options) {
          options = parseOptions(options);
          if (comp instanceof _Comparator) {
            if (comp.loose === !!options.loose) {
              return comp;
            } else {
              comp = comp.value;
            }
          }
          comp = comp.trim().split(/\s+/).join(" ");
          debug("comparator", comp, options);
          this.options = options;
          this.loose = !!options.loose;
          this.parse(comp);
          if (this.semver === ANY) {
            this.value = "";
          } else {
            this.value = this.operator + this.semver.version;
          }
          debug("comp", this);
        }
        parse(comp) {
          const r2 = this.options.loose ? re2[t2.COMPARATORLOOSE] : re2[t2.COMPARATOR];
          const m = comp.match(r2);
          if (!m) {
            throw new TypeError(`Invalid comparator: ${comp}`);
          }
          this.operator = m[1] !== void 0 ? m[1] : "";
          if (this.operator === "=") {
            this.operator = "";
          }
          if (!m[2]) {
            this.semver = ANY;
          } else {
            this.semver = new SemVer(m[2], this.options.loose);
          }
        }
        toString() {
          return this.value;
        }
        test(version) {
          debug("Comparator.test", version, this.options.loose);
          if (this.semver === ANY || version === ANY) {
            return true;
          }
          if (typeof version === "string") {
            try {
              version = new SemVer(version, this.options);
            } catch (er) {
              return false;
            }
          }
          return cmp(version, this.operator, this.semver, this.options);
        }
        intersects(comp, options) {
          if (!(comp instanceof _Comparator)) {
            throw new TypeError("a Comparator is required");
          }
          if (this.operator === "") {
            if (this.value === "") {
              return true;
            }
            return new Range(comp.value, options).test(this.value);
          } else if (comp.operator === "") {
            if (comp.value === "") {
              return true;
            }
            return new Range(this.value, options).test(comp.semver);
          }
          options = parseOptions(options);
          if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
            return false;
          }
          if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
            return false;
          }
          if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
            return true;
          }
          if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
            return true;
          }
          if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
            return true;
          }
          if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
            return true;
          }
          if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
            return true;
          }
          return false;
        }
      };
      module.exports = Comparator;
      var parseOptions = require_parse_options();
      var { safeRe: re2, t: t2 } = require_re();
      var cmp = require_cmp();
      var debug = require_debug();
      var SemVer = require_semver();
      var Range = require_range();
    }
  });

  // node_modules/semver/classes/range.js
  var require_range = __commonJS({
    "node_modules/semver/classes/range.js"(exports, module) {
      "use strict";
      var SPACE_CHARACTERS = /\s+/g;
      var Range = class _Range {
        constructor(range, options) {
          options = parseOptions(options);
          if (range instanceof _Range) {
            if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
              return range;
            } else {
              return new _Range(range.raw, options);
            }
          }
          if (range instanceof Comparator) {
            this.raw = range.value;
            this.set = [[range]];
            this.formatted = void 0;
            return this;
          }
          this.options = options;
          this.loose = !!options.loose;
          this.includePrerelease = !!options.includePrerelease;
          this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
          this.set = this.raw.split("||").map((r2) => this.parseRange(r2.trim())).filter((c2) => c2.length);
          if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
          }
          if (this.set.length > 1) {
            const first = this.set[0];
            this.set = this.set.filter((c2) => !isNullSet(c2[0]));
            if (this.set.length === 0) {
              this.set = [first];
            } else if (this.set.length > 1) {
              for (const c2 of this.set) {
                if (c2.length === 1 && isAny(c2[0])) {
                  this.set = [c2];
                  break;
                }
              }
            }
          }
          this.formatted = void 0;
        }
        get range() {
          if (this.formatted === void 0) {
            this.formatted = "";
            for (let i2 = 0; i2 < this.set.length; i2++) {
              if (i2 > 0) {
                this.formatted += "||";
              }
              const comps = this.set[i2];
              for (let k2 = 0; k2 < comps.length; k2++) {
                if (k2 > 0) {
                  this.formatted += " ";
                }
                this.formatted += comps[k2].toString().trim();
              }
            }
          }
          return this.formatted;
        }
        format() {
          return this.range;
        }
        toString() {
          return this.range;
        }
        parseRange(range) {
          const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
          const memoKey = memoOpts + ":" + range;
          const cached = cache2.get(memoKey);
          if (cached) {
            return cached;
          }
          const loose = this.options.loose;
          const hr = loose ? re2[t2.HYPHENRANGELOOSE] : re2[t2.HYPHENRANGE];
          range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
          debug("hyphen replace", range);
          range = range.replace(re2[t2.COMPARATORTRIM], comparatorTrimReplace);
          debug("comparator trim", range);
          range = range.replace(re2[t2.TILDETRIM], tildeTrimReplace);
          debug("tilde trim", range);
          range = range.replace(re2[t2.CARETTRIM], caretTrimReplace);
          debug("caret trim", range);
          let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
          if (loose) {
            rangeList = rangeList.filter((comp) => {
              debug("loose invalid filter", comp, this.options);
              return !!comp.match(re2[t2.COMPARATORLOOSE]);
            });
          }
          debug("range list", rangeList);
          const rangeMap = /* @__PURE__ */ new Map();
          const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
          for (const comp of comparators) {
            if (isNullSet(comp)) {
              return [comp];
            }
            rangeMap.set(comp.value, comp);
          }
          if (rangeMap.size > 1 && rangeMap.has("")) {
            rangeMap.delete("");
          }
          const result = [...rangeMap.values()];
          cache2.set(memoKey, result);
          return result;
        }
        intersects(range, options) {
          if (!(range instanceof _Range)) {
            throw new TypeError("a Range is required");
          }
          return this.set.some((thisComparators) => {
            return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
              return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
                return rangeComparators.every((rangeComparator) => {
                  return thisComparator.intersects(rangeComparator, options);
                });
              });
            });
          });
        }
        // if ANY of the sets match ALL of its comparators, then pass
        test(version) {
          if (!version) {
            return false;
          }
          if (typeof version === "string") {
            try {
              version = new SemVer(version, this.options);
            } catch (er) {
              return false;
            }
          }
          for (let i2 = 0; i2 < this.set.length; i2++) {
            if (testSet(this.set[i2], version, this.options)) {
              return true;
            }
          }
          return false;
        }
      };
      module.exports = Range;
      var LRU = require_lrucache();
      var cache2 = new LRU();
      var parseOptions = require_parse_options();
      var Comparator = require_comparator();
      var debug = require_debug();
      var SemVer = require_semver();
      var {
        safeRe: re2,
        t: t2,
        comparatorTrimReplace,
        tildeTrimReplace,
        caretTrimReplace
      } = require_re();
      var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
      var isNullSet = (c2) => c2.value === "<0.0.0-0";
      var isAny = (c2) => c2.value === "";
      var isSatisfiable = (comparators, options) => {
        let result = true;
        const remainingComparators = comparators.slice();
        let testComparator = remainingComparators.pop();
        while (result && remainingComparators.length) {
          result = remainingComparators.every((otherComparator) => {
            return testComparator.intersects(otherComparator, options);
          });
          testComparator = remainingComparators.pop();
        }
        return result;
      };
      var parseComparator = (comp, options) => {
        comp = comp.replace(re2[t2.BUILD], "");
        debug("comp", comp, options);
        comp = replaceCarets(comp, options);
        debug("caret", comp);
        comp = replaceTildes(comp, options);
        debug("tildes", comp);
        comp = replaceXRanges(comp, options);
        debug("xrange", comp);
        comp = replaceStars(comp, options);
        debug("stars", comp);
        return comp;
      };
      var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
      var replaceTildes = (comp, options) => {
        return comp.trim().split(/\s+/).map((c2) => replaceTilde(c2, options)).join(" ");
      };
      var replaceTilde = (comp, options) => {
        const r2 = options.loose ? re2[t2.TILDELOOSE] : re2[t2.TILDE];
        return comp.replace(r2, (_2, M, m, p2, pr) => {
          debug("tilde", comp, _2, M, m, p2, pr);
          let ret;
          if (isX(M)) {
            ret = "";
          } else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
          } else if (isX(p2)) {
            ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
          } else if (pr) {
            debug("replaceTilde pr", pr);
            ret = `>=${M}.${m}.${p2}-${pr} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.${p2} <${M}.${+m + 1}.0-0`;
          }
          debug("tilde return", ret);
          return ret;
        });
      };
      var replaceCarets = (comp, options) => {
        return comp.trim().split(/\s+/).map((c2) => replaceCaret(c2, options)).join(" ");
      };
      var replaceCaret = (comp, options) => {
        debug("caret", comp, options);
        const r2 = options.loose ? re2[t2.CARETLOOSE] : re2[t2.CARET];
        const z = options.includePrerelease ? "-0" : "";
        return comp.replace(r2, (_2, M, m, p2, pr) => {
          debug("caret", comp, _2, M, m, p2, pr);
          let ret;
          if (isX(M)) {
            ret = "";
          } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
          } else if (isX(p2)) {
            if (M === "0") {
              ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            } else {
              ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
          } else if (pr) {
            debug("replaceCaret pr", pr);
            if (M === "0") {
              if (m === "0") {
                ret = `>=${M}.${m}.${p2}-${pr} <${M}.${m}.${+p2 + 1}-0`;
              } else {
                ret = `>=${M}.${m}.${p2}-${pr} <${M}.${+m + 1}.0-0`;
              }
            } else {
              ret = `>=${M}.${m}.${p2}-${pr} <${+M + 1}.0.0-0`;
            }
          } else {
            debug("no pr");
            if (M === "0") {
              if (m === "0") {
                ret = `>=${M}.${m}.${p2}${z} <${M}.${m}.${+p2 + 1}-0`;
              } else {
                ret = `>=${M}.${m}.${p2}${z} <${M}.${+m + 1}.0-0`;
              }
            } else {
              ret = `>=${M}.${m}.${p2} <${+M + 1}.0.0-0`;
            }
          }
          debug("caret return", ret);
          return ret;
        });
      };
      var replaceXRanges = (comp, options) => {
        debug("replaceXRanges", comp, options);
        return comp.split(/\s+/).map((c2) => replaceXRange(c2, options)).join(" ");
      };
      var replaceXRange = (comp, options) => {
        comp = comp.trim();
        const r2 = options.loose ? re2[t2.XRANGELOOSE] : re2[t2.XRANGE];
        return comp.replace(r2, (ret, gtlt, M, m, p2, pr) => {
          debug("xRange", comp, ret, gtlt, M, m, p2, pr);
          const xM = isX(M);
          const xm = xM || isX(m);
          const xp = xm || isX(p2);
          const anyX = xp;
          if (gtlt === "=" && anyX) {
            gtlt = "";
          }
          pr = options.includePrerelease ? "-0" : "";
          if (xM) {
            if (gtlt === ">" || gtlt === "<") {
              ret = "<0.0.0-0";
            } else {
              ret = "*";
            }
          } else if (gtlt && anyX) {
            if (xm) {
              m = 0;
            }
            p2 = 0;
            if (gtlt === ">") {
              gtlt = ">=";
              if (xm) {
                M = +M + 1;
                m = 0;
                p2 = 0;
              } else {
                m = +m + 1;
                p2 = 0;
              }
            } else if (gtlt === "<=") {
              gtlt = "<";
              if (xm) {
                M = +M + 1;
              } else {
                m = +m + 1;
              }
            }
            if (gtlt === "<") {
              pr = "-0";
            }
            ret = `${gtlt + M}.${m}.${p2}${pr}`;
          } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
          } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
          }
          debug("xRange return", ret);
          return ret;
        });
      };
      var replaceStars = (comp, options) => {
        debug("replaceStars", comp, options);
        return comp.trim().replace(re2[t2.STAR], "");
      };
      var replaceGTE0 = (comp, options) => {
        debug("replaceGTE0", comp, options);
        return comp.trim().replace(re2[options.includePrerelease ? t2.GTE0PRE : t2.GTE0], "");
      };
      var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
        if (isX(fM)) {
          from = "";
        } else if (isX(fm)) {
          from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
        } else if (isX(fp)) {
          from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
        } else if (fpr) {
          from = `>=${from}`;
        } else {
          from = `>=${from}${incPr ? "-0" : ""}`;
        }
        if (isX(tM)) {
          to = "";
        } else if (isX(tm)) {
          to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
          to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
          to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (incPr) {
          to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
          to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
      };
      var testSet = (set, version, options) => {
        for (let i2 = 0; i2 < set.length; i2++) {
          if (!set[i2].test(version)) {
            return false;
          }
        }
        if (version.prerelease.length && !options.includePrerelease) {
          for (let i2 = 0; i2 < set.length; i2++) {
            debug(set[i2].semver);
            if (set[i2].semver === Comparator.ANY) {
              continue;
            }
            if (set[i2].semver.prerelease.length > 0) {
              const allowed = set[i2].semver;
              if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
                return true;
              }
            }
          }
          return false;
        }
        return true;
      };
    }
  });

  // node_modules/semver/ranges/max-satisfying.js
  var require_max_satisfying = __commonJS({
    "node_modules/semver/ranges/max-satisfying.js"(exports, module) {
      "use strict";
      var SemVer = require_semver();
      var Range = require_range();
      var maxSatisfying = (versions, range, options) => {
        let max2 = null;
        let maxSV = null;
        let rangeObj = null;
        try {
          rangeObj = new Range(range, options);
        } catch (er) {
          return null;
        }
        versions.forEach((v2) => {
          if (rangeObj.test(v2)) {
            if (!max2 || maxSV.compare(v2) === -1) {
              max2 = v2;
              maxSV = new SemVer(max2, options);
            }
          }
        });
        return max2;
      };
      module.exports = maxSatisfying;
    }
  });

  // src/features/show-vulnerabilities.ts
  var show_vulnerabilities_exports = {};
  __export(show_vulnerabilities_exports, {
    description: () => description21,
    run: () => run19,
    runPre: () => runPre17,
    teardown: () => teardown13
  });
  function teardown13(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector(".npm-userscript-vulnerability-label")?.remove();
    document.querySelectorAll(".npm-userscript-vulnerability-tag").forEach((el) => el.remove());
    document.querySelectorAll(".npm-userscript-vulnerability-popup").forEach((el) => el.remove());
  }
  function runPre17() {
    addPackageLabelStyle();
    addStyle(`
    .npm-userscript-vulnerability-tag {
      background: none;
      border: none;
      padding: 0;
      margin-left: 8px;
      cursor: pointer;
      vertical-align: middle;
    }
    .npm-userscript-vulnerability-popup {
      display: none;
      z-index: 1000;
      overflow-y: auto;
      position: absolute;
      top: 0;
      left: 0;
      background: var(--background-color);
      font-size: 90%;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #aaa;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .npm-userscript-vulnerability-popup ul {
      margin: 0;
      padding: 0 0 0 16px;
      font-size: 1em
    }
    .npm-userscript-vulnerability-popup li {
      margin: 6px 0;
    }
  `);
  }
  async function run19() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-vulnerability-label") && document.querySelector(".npm-userscript-vulnerability-tag"))
      return;
    const packageName = getPackageName();
    const packageVersion = getPackageVersion();
    if (!packageName || !packageVersion) return;
    const json = await fetchJson(`${"https://npm-userscript.bjornlu.workers.dev"}/vulnerabilities/${packageName}`);
    if (!json?.vulns || json.vulns.length === 0) return;
    for (const vuln of json.vulns) {
      for (let i2 = 0; i2 < vuln.affected.length; i2++) {
        const range = vuln.affected[i2];
        range[0] = padVersion(range[0]);
        range[1] = padVersion(range[1]);
      }
    }
    if (!document.querySelector(".npm-userscript-vulnerability-label")) {
      const vulnsForVersion = getVulnerabilitiesForVersion(packageVersion, json.vulns);
      const injectParent = document.querySelector("#top > div:first-child");
      if (vulnsForVersion && injectParent) {
        const label = addPackageLabel("show-vulnerabilities", "VULNERABLE", "error", "button");
        label.classList.add("npm-userscript-vulnerability-label");
        const popup = createPopup(vulnsForVersion, label);
        injectParent.appendChild(popup);
      }
    }
    if (new URLSearchParams(location.search).get("activeTab") === "versions") {
      await addVulnerabilityTagToTable(json.vulns);
    }
  }
  async function addVulnerabilityTagToTable(vulns) {
    if (document.querySelector(".npm-userscript-vulnerability-tag")) return;
    const featureSettings2 = await getFeatureSettings3();
    if (featureSettings2["better-versions"].get() === true) {
      await waitForElement('[aria-labelledby="cumulated-versions"]');
    }
    const allVersions = Object.keys(getNpmContext().context.versionsDownloads);
    document.querySelectorAll("table tr").forEach((row) => {
      const versionEl = row.querySelector("td a") ?? row.querySelector("td span");
      if (!versionEl) return;
      let version = versionEl.textContent;
      if (version.endsWith(".x")) {
        const matched = (0, import_max_satisfying.default)(allVersions, version);
        if (!matched) return;
        version = matched;
      }
      const vulnsForVersion = getVulnerabilitiesForVersion(version, vulns);
      if (!vulnsForVersion) return;
      const button = document.createElement("button");
      button.className = "npm-userscript-vulnerability-tag ml2";
      button.innerHTML = warningSvg;
      button.style.color = vulnerabilityScoreToColor(Math.max(...vulnsForVersion.map((v2) => v2.score)));
      const popup = createPopup(vulnsForVersion, button);
      versionEl.insertAdjacentElement("afterend", button);
      versionEl.insertAdjacentElement("afterend", popup);
    });
  }
  function createPopup(vulns, ref) {
    const popup = document.createElement("div");
    popup.className = "npm-userscript-vulnerability-popup";
    let inited2 = false;
    computeFloatingUI(ref, popup, {
      onBeforeOpen() {
        if (inited2) return;
        inited2 = true;
        popup.innerHTML = `
        <p class="mt1 mb2">This version is vulnerable:</p>
        <ul>
          ${vulns.map(
          (vuln) => `<li>
                  <a class="black-60 code" href="${vuln.link}" target="_blank" rel="noopener noreferrer">${vuln.id}</a>
                  - ${vuln.score} (<span style="color: ${vulnerabilityScoreToColor(vuln.score)}">${vulnerabilityScoreToText(vuln.score)}</span>)
                </li>`
        ).join("")}
        </ul>`;
      }
    });
    return popup;
  }
  function getVulnerabilitiesForVersion(version, vulnerabilities) {
    const matched = [];
    for (const vuln of vulnerabilities) {
      for (const affected of vuln.affected) {
        if ((0, import_gte.default)(version, affected[0]) && (0, import_lt.default)(version, affected[1])) {
          matched.push(vuln);
          break;
        }
      }
    }
    return matched.length > 0 ? matched : void 0;
  }
  function padVersion(v2) {
    const parts = v2.split(".");
    while (parts.length < 3) {
      parts.push("0");
    }
    return parts.join(".");
  }
  function vulnerabilityScoreToText(score) {
    if (score >= 9) return "Critical";
    if (score >= 7) return "High";
    if (score >= 4) return "Medium";
    if (score > 0) return "Low";
    return "None";
  }
  function vulnerabilityScoreToColor(score) {
    if (score >= 9) return "var(--color-fg-danger)";
    if (score >= 7) return "#d15704";
    if (score >= 4) return "var(--color-fg-attention)";
    if (score > 0) return "var(color-fg-accent)";
    return "var(--color-fg-subtle)";
  }
  async function getFeatureSettings3() {
    const settings = await Promise.resolve().then(() => (init_settings(), settings_exports));
    return settings.featureSettings;
  }
  var import_gte, import_lt, import_max_satisfying, description21, warningSvg;
  var init_show_vulnerabilities = __esm({
    "src/features/show-vulnerabilities.ts"() {
      import_gte = __toESM(require_gte(), 1);
      import_lt = __toESM(require_lt(), 1);
      import_max_satisfying = __toESM(require_max_satisfying(), 1);
      init_utils_fetch();
      init_utils_npm_context();
      init_utils_ui();
      init_utils();
      description21 = `Adds a label if a package is vulnerable in the header and versions table. The core vulnerability data
is powered by https://osv.dev.
`;
      warningSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>`;
    }
  });

  // src/features/stars.ts
  var stars_exports = {};
  __export(stars_exports, {
    description: () => description22,
    run: () => run20,
    runPre: () => runPre18,
    teardown: () => teardown14
  });
  function teardown14(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector(".npm-userscript-stars-column")?.remove();
  }
  async function runPre18() {
    if (!isValidPackagePage()) return;
    if ((await getFeatureSettings4())["repository-card"].get() === true) return;
    addStyle(`
    .npm-userscript-stars-link {
      text-decoration: none;
    }

    .npm-userscript-stars-link:focus,
    .npm-userscript-stars-link:hover {
      text-decoration: underline;
      color: #cb3837;
    }
  `);
  }
  async function run20() {
    if (!isValidPackagePage()) return;
    if ((await getFeatureSettings4())["repository-card"].get() === true) return;
    if (document.querySelector(".npm-userscript-stars-column")) return;
    const sidebarColumns = document.querySelectorAll('[aria-label="Package sidebar"] > div:has(> h3)');
    const ref = Array.from(sidebarColumns).find(
      (col) => col.querySelector("h3")?.textContent === "Total Files"
    );
    if (!ref) return;
    const data = await fetchGitHubRepoData();
    if (!data) return;
    const link = `https://github.com/${data.full_name}/stargazers`;
    const count = data.stargazers_count.toLocaleString();
    const cloned = ref.cloneNode(true);
    cloned.classList.add("npm-userscript-stars-column");
    cloned.classList.remove("w-100");
    cloned.querySelector("h3").textContent = "Stars";
    const linkHtml = `<a class="npm-userscript-stars-link" href="${link}">${count}</a>`;
    cloned.querySelector("p").innerHTML = linkHtml;
    ref.insertAdjacentElement("afterend", cloned);
  }
  async function getFeatureSettings4() {
    const settings = await Promise.resolve().then(() => (init_settings(), settings_exports));
    return settings.featureSettings;
  }
  var description22;
  var init_stars = __esm({
    "src/features/stars.ts"() {
      init_utils_fetch();
      init_utils();
      description22 = `Display a "Stars" column in the package sidebar for GitHub repos.
`;
    }
  });

  // src/features/tarball-size.ts
  var tarball_size_exports = {};
  __export(tarball_size_exports, {
    description: () => description23,
    run: () => run21,
    teardown: () => teardown15
  });
  function teardown15(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector(".npm-userscript-tarball-size-column")?.remove();
  }
  async function run21() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-tarball-size-column")) return;
    const tarballSize = await getTarballSize();
    if (!tarballSize) return;
    const columnToInsertAfter = await getColumnToInsertAfter();
    if (!columnToInsertAfter) return;
    const tarballSizeColumn = columnToInsertAfter.cloneNode(true);
    tarballSizeColumn.classList.add("npm-userscript-tarball-size-column");
    tarballSizeColumn.querySelector("h3").textContent = "Tarball Size";
    tarballSizeColumn.querySelector("p").textContent = tarballSize;
    columnToInsertAfter.insertAdjacentElement("afterend", tarballSizeColumn);
  }
  async function getTarballSize() {
    const tarballUrl = getNpmTarballUrl();
    if (!tarballUrl) return void 0;
    const result = await fetchHeaders(tarballUrl);
    const contentLength = /content-length:\s*(\d+)/.exec(result)?.[1];
    if (!contentLength) return void 0;
    return prettyBytes(parseInt(contentLength, 10));
  }
  async function getColumnToInsertAfter() {
    const column = getColumnByName("Unpacked Size");
    if (column) return column;
    const featureSettings2 = await getFeatureSettings5();
    if (featureSettings2["unpacked-size-and-total-files"].get() === true) {
      let checks = 10;
      setInterval(() => {
        const column2 = getColumnByName("Unpacked Size");
        if (column2 || --checks <= 0) {
          return column2;
        }
      }, 500);
    } else {
      const column2 = getColumnByName("License");
      return column2;
    }
  }
  function getColumnByName(name) {
    const sidebarColumns = document.querySelectorAll('[aria-label="Package sidebar"] > div:has(> h3)');
    return Array.from(sidebarColumns).find((col) => col.querySelector("h3")?.textContent === name);
  }
  async function getFeatureSettings5() {
    const settings = await Promise.resolve().then(() => (init_settings(), settings_exports));
    return settings.featureSettings;
  }
  var description23;
  var init_tarball_size = __esm({
    "src/features/tarball-size.ts"() {
      init_utils_fetch();
      init_utils();
      description23 = `Display the tarball size of the package.
`;
    }
  });

  // src/features/unpacked-size-and-total-files.ts
  var unpacked_size_and_total_files_exports = {};
  __export(unpacked_size_and_total_files_exports, {
    description: () => description24,
    run: () => run22,
    teardown: () => teardown16
  });
  function teardown16(previousUrl) {
    if (isSamePackagePage(previousUrl)) return;
    document.querySelector(".npm-userscript-unpacked-size-column")?.remove();
    document.querySelector(".npm-userscript-total-files-column")?.remove();
  }
  async function run22() {
    if (!isValidPackagePage()) return;
    if (document.querySelector(".npm-userscript-unpacked-size-column") || document.querySelector(".npm-userscript-total-files-column"))
      return;
    const sidebarColumns = document.querySelectorAll('[aria-label="Package sidebar"] > div:has(> h3)');
    const licenseColumn = Array.from(sidebarColumns).find(
      (col) => col.querySelector("h3")?.textContent === "License"
    );
    if (!licenseColumn) return;
    const unpackedSizeColumn = Array.from(sidebarColumns).find(
      (col) => col.querySelector("h3")?.textContent === "Unpacked Size"
    );
    const totalFilesColumn = Array.from(sidebarColumns).find(
      (col) => col.querySelector("h3")?.textContent === "Total Files"
    );
    if (unpackedSizeColumn && totalFilesColumn) return;
    const data = await fetchPackageFilesData();
    if (!data) return;
    if (!totalFilesColumn) {
      const newTotalFilesColumn = licenseColumn.cloneNode(true);
      newTotalFilesColumn.classList.add("npm-userscript-total-files-column");
      newTotalFilesColumn.querySelector("h3").textContent = "Total Files";
      newTotalFilesColumn.querySelector("p").textContent = data.fileCount.toString();
      licenseColumn.insertAdjacentElement("afterend", newTotalFilesColumn);
    }
    if (!unpackedSizeColumn) {
      const newUnpackedSizeColumn = licenseColumn.cloneNode(true);
      newUnpackedSizeColumn.classList.add("npm-userscript-unpacked-size-column");
      newUnpackedSizeColumn.querySelector("h3").textContent = "Unpacked Size";
      newUnpackedSizeColumn.querySelector("p").textContent = prettyBytes(data.totalSize);
      licenseColumn.insertAdjacentElement("afterend", newUnpackedSizeColumn);
    }
  }
  var description24;
  var init_unpacked_size_and_total_files = __esm({
    "src/features/unpacked-size-and-total-files.ts"() {
      init_utils_fetch();
      init_utils();
      description24 = `Display the "Unpacked Size" and "Total Files" columns for older packages that lack the data.
`;
    }
  });

  // src/all-features.ts
  var allFeatures;
  var init_all_features = __esm({
    "src/all-features.ts"() {
      init_better_dependencies();
      init_better_versions();
      init_dim_mode();
      init_fix_issue_pr_count();
      init_fix_styles();
      init_helpful_links();
      init_module_replacements();
      init_move_funding();
      init_no_code_beta();
      init_remember_banner();
      init_remove_redundant_homepage();
      init_remove_runkit();
      init_repository_card();
      init_repository_directory();
      init_show_binary_label();
      init_show_cli_label_and_command();
      init_show_engine_label();
      init_show_file_types_label();
      init_show_lifecycle_scripts_label();
      init_show_types_label();
      init_show_vulnerabilities();
      init_stars();
      init_tarball_size();
      init_unpacked_size_and_total_files();
      allFeatures = {
        "better-dependencies": better_dependencies_exports,
        "better-versions": better_versions_exports,
        "dim-mode": dim_mode_exports,
        "fix-issue-pr-count": fix_issue_pr_count_exports,
        "fix-styles": fix_styles_exports,
        "helpful-links": helpful_links_exports,
        "module-replacements": module_replacements_exports,
        "move-funding": move_funding_exports,
        "no-code-beta": no_code_beta_exports,
        "remember-banner": remember_banner_exports,
        "remove-redundant-homepage": remove_redundant_homepage_exports,
        "remove-runkit": remove_runkit_exports,
        "repository-card": repository_card_exports,
        "repository-directory": repository_directory_exports,
        "show-binary-label": show_binary_label_exports,
        "show-cli-label": show_cli_label_and_command_exports,
        "show-engine-label": show_engine_label_exports,
        "show-file-types-label": show_file_types_label_exports,
        "show-lifecycle-scripts-label": show_lifecycle_scripts_label_exports,
        "show-types-label": show_types_label_exports,
        "show-vulnerabilities": show_vulnerabilities_exports,
        stars: stars_exports,
        "tarball-size": tarball_size_exports,
        "unpacked-size-and-total-files": unpacked_size_and_total_files_exports
      };
    }
  });

  // src/index.ts
  init_all_features();
  init_settings();
  init_utils_cache();

  // src/utils-navigation.ts
  var HYDRATION_DELAY_MS = 50;
  async function waitForDocumentPartiallyReady() {
    if (!document.body) {
      await new Promise((resolve, reject) => {
        let max2 = 40;
        setInterval(() => {
          if (document.body) {
            resolve();
          } else if (max2-- <= 0) {
            reject(new Error("[npm-userscript] Document took too long to be ready"));
          }
        }, 50);
      });
    }
  }
  var pageAlreadyReady = false;
  async function waitForPageReady() {
    if (!pageAlreadyReady) {
      await new Promise((resolve) => {
        if (document.readyState === "complete" || document.readyState === "interactive") {
          resolve();
        } else {
          document.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
        }
      });
    }
    await new Promise((resolve) => setTimeout(resolve, HYDRATION_DELAY_MS));
    pageAlreadyReady = true;
  }
  var onNavigateListeners = [];
  function listenNavigateCode() {
    const pushState = history.pushState;
    history.pushState = function() {
      pushState.apply(this, arguments);
      window.dispatchEvent(new Event("npm-userscript-navigate"));
    };
    const replaceState = history.replaceState;
    history.replaceState = function() {
      replaceState.apply(this, arguments);
      window.dispatchEvent(new Event("npm-userscript-navigate"));
    };
    window.addEventListener("popstate", function() {
      window.dispatchEvent(new Event("npm-userscript-navigate"));
    });
  }
  function listenNavigate(listener) {
    let lastHref = location.href;
    if (onNavigateListeners.length === 0) {
      const script = document.createElement("script");
      script.textContent = `(${listenNavigateCode.toString()})()`;
      document.head.appendChild(script);
      window.addEventListener("npm-userscript-navigate", () => {
        if (location.href === lastHref) return;
        onNavigateListeners.forEach((l2) => l2(lastHref));
        lastHref = location.href;
      });
    }
    onNavigateListeners.push((previousUrl) => {
      setTimeout(() => listener(previousUrl), HYDRATION_DELAY_MS);
    });
  }

  // src/index.ts
  init_utils_npm_context();
  init_utils();
  main();
  async function main() {
    await waitForDocumentPartiallyReady();
    listenNpmContext();
    let sequencePromise = runFeatures().then(() => runNotImportantStuff());
    let teardownQueue = 0;
    listenNavigate(async (previousUrl) => {
      teardownQueue++;
      sequencePromise = sequencePromise.then(async () => {
        await runTeardown(previousUrl);
        if (teardownQueue-- > 1) return;
        await runFeatures();
        if (teardownQueue === 0) sequencePromise = Promise.resolve();
      });
    });
  }
  async function runTeardown(previousUrl) {
    const promises = [];
    for (const feature in allFeatures) {
      if (featureSettings[feature].get() === false) continue;
      const promise = allFeatures[feature].teardown?.(previousUrl)?.catch((err) => {
        console.error(`Error running teardown for feature "${feature}":`, err);
      });
      if (promise) promises.push(promise);
    }
    await Promise.all(promises);
    teardownSidebarBalance();
  }
  async function runFeatures() {
    const promises = [];
    for (const feature in allFeatures) {
      if (featureSettings[feature].get() === false) continue;
      const promise = allFeatures[feature].runPre?.()?.catch((err) => {
        console.error(`Error running pre for feature "${feature}":`, err);
      });
      if (promise) promises.push(promise);
    }
    await Promise.all(promises);
    promises.length = 0;
    consolidateStyles();
    await waitForPageReady();
    await waitForNpmContextReady();
    for (const feature in allFeatures) {
      if (featureSettings[feature].get() === false) continue;
      const promise = allFeatures[feature].run?.()?.catch((err) => {
        console.error(`Error running feature "${feature}":`, err);
      });
      if (promise) promises.push(promise);
    }
    await Promise.all(promises);
    promises.length = 0;
    consolidateStyles();
    ensureSidebarBalance();
    injectSettingsTrigger();
  }
  function runNotImportantStuff() {
    cache.clearExpired();
    clearOutdatedSettings();
  }
})();
