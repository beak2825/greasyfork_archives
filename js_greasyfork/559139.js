// ==UserScript==
// @name         Npm Userscript
// @version      0.2.2
// @description  Various improvements and fixes for npmjs.com
// @license      MIT
// @author       Bjorn Lu
// @homepageURL  https://github.com/bluwy/npm-userscript
// @supportURL   https://github.com/bluwy/npm-userscript/issues
// @namespace    https://greasyfork.org/en/scripts/559139-npm-userscript
// @match        https://www.npmjs.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=npmjs.com
// @grant        none
// @inject-into  content
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559139/Npm%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/559139/Npm%20Userscript.meta.js
// ==/UserScript==

(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/features/better-versions.ts
  var better_versions_exports = {};
  __export(better_versions_exports, {
    description: () => description,
    run: () => run,
    runPre: () => runPre
  });

  // src/utils.ts
  var styles = [];
  function addStyle(css) {
    styles.push(css.trim());
  }
  function consolidateStyles() {
    const style = document.createElement("style");
    style.textContent = styles.join("\n");
    document.head.appendChild(style);
    styles.length = 0;
  }
  async function waitForPageReady() {
    await new Promise((resolve) => {
      if (document.readyState === "complete" || document.readyState === "interactive") {
        resolve();
      } else {
        listenOnce("DOMContentLoaded", () => resolve());
      }
    });
    await extractNpmContext();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  function listenOnce(type, listener) {
    document.addEventListener(type, listener, { once: true });
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
    try {
      return unsafeWindow.__context__.context.packageVersion.version;
    } catch {
    }
  }
  function isValidPackagePage() {
    return location.pathname.startsWith("/package/") && // if is a valid package, should be like "package-name - npm"
    document.title !== "npm";
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
  var onNavigateListeners = [];
  function listenNavigate(listener) {
    let lastHref = location.href;
    if (onNavigateListeners.length === 0) {
      document.addEventListener("click", () => {
        setTimeout(() => {
          if (location.href !== lastHref) {
            lastHref = location.href;
            onNavigateListeners.forEach((l2) => l2());
          }
        }, 100);
      });
    }
    onNavigateListeners.push(() => {
      setTimeout(() => listener(), 100);
    });
  }
  function ensureSidebarBalance() {
    const halfWidthColumns = document.querySelectorAll(
      '[aria-label="Package sidebar"] div.w-50:not(.w-100)'
    );
    if (halfWidthColumns.length % 2 === 1) {
      const lastColumn = halfWidthColumns[halfWidthColumns.length - 1];
      lastColumn.classList.add("w-100");
    }
  }
  async function extractNpmContext() {
    return new Promise((resolve) => {
      const elementId = "npm-userscript-context";
      const elementEvent = "npm-userscript-done";
      const script = document.createElement("script");
      script.id = elementId;
      script.textContent = `
      document.getElementById('${elementId}').dataset.value = JSON.stringify(window.__context__)
      document.getElementById('${elementId}').dispatchEvent(new Event('${elementEvent}'))
    `;
      script.addEventListener(
        elementEvent,
        () => {
          const context = JSON.parse(script.dataset.value || "{}");
          script.remove();
          window.__context__ = context;
          window.unsafeWindow = window;
          resolve(context);
        },
        { once: true }
      );
      document.body.appendChild(script);
    });
  }

  // src/features/better-versions.ts
  var description = `Improved package versions tab with compact table view, cumulated versions table, show tags next to
versions, and fix provenance icon alignment.
`;
  function runPre() {
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
  function run() {
    _run();
    listenNavigate(() => _run());
  }
  function _run() {
    if (!isValidPackagePage()) return;
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
    versionHistoryTable.querySelectorAll("tbody tr").forEach((row) => {
      const versionLink = row.querySelector("td a");
      if (!versionLink) return;
      const version = versionLink.textContent || "";
      const major = version.split(".")[0];
      const minor = version.split(".").slice(0, 2).join(".");
      const downloadsTd = row.querySelector("td:nth-child(2)");
      const publishedTd = row.querySelector("td:nth-child(3)");
      if (!downloadsTd || !publishedTd) return;
      const downloadsText = downloadsTd.textContent || "0";
      const downloads = parseInt(downloadsText.replace(/,|\.|\s/g, ""), 10) || 0;
      const publishedText = publishedTd.textContent || "";
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
    });
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

  // src/features/dim-mode.ts
  var dim_mode_exports = {};
  __export(dim_mode_exports, {
    description: () => description2,
    disabled: () => disabled,
    runPre: () => runPre2
  });
  var disabled = true;
  var description2 = `Make light mode less bright. Does not implement dark mode completely.
`;
  function runPre2() {
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

  // src/features/fix-issue-pr-count.ts
  var fix_issue_pr_count_exports = {};
  __export(fix_issue_pr_count_exports, {
    description: () => description3,
    run: () => run2,
    runPre: () => runPre3
  });

  // src/utils-cache.ts
  var CACHE_PREFIX = "npm-userscript:";
  var cache = {
    set: setCache,
    get: getCache,
    clear: clearCache,
    clearByPrefix: clearCacheByPrefix,
    clearExpired: clearExpiredCache,
    hasByPrefix: hasCacheByPrefix
  };
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

  // src/features/fix-issue-pr-count.ts
  var description3 = `Show "Issue" and "Pull Requests" counts in the package sidebar. At the time of writing, npm's own
implementation is broken for large numbers for some reason. This temporarily fixes it.
`;
  function runPre3() {
    if (!isValidPackagePage()) return;
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
  async function run2() {
    if (!isValidPackagePage()) return;
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    if (document.getElementById("issues") || document.getElementById("pulls")) {
      getTotalFilesColumn();
      return;
    }
    const repositoryLink = document.getElementById("repository-link");
    const repo = repositoryLink?.textContent?.match(/github\.com\/([^\/]+\/[^\/]+)/)?.[1];
    if (!repo) return;
    const counts = await getIssueAndPrCount(repo);
    const ref = getTotalFilesColumn();
    if (!ref) return;
    if (document.getElementById("issues") || document.getElementById("pulls")) return;
    insertCountNode(ref, "Pull Requests", counts.pulls, `https://github.com/${repo}/pulls`);
    insertCountNode(ref, "Issues", counts.issues, `https://github.com/${repo}/issues`);
  }
  function getTotalFilesColumn() {
    const sidebarColumns = document.querySelectorAll(
      '[aria-label="Package sidebar"] div.w-50:not(.w-100)'
    );
    const refIndex = Array.from(sidebarColumns).findIndex(
      (el) => el.querySelector("h3")?.textContent.includes("Total Files")
    );
    if (refIndex === -1) return;
    const ref = sidebarColumns[refIndex];
    if (refIndex % 2 === 0) {
      ref.classList.add("w-100");
    }
    return ref;
  }
  function insertCountNode(ref, name, count, link) {
    const cloned = ref.cloneNode(true);
    cloned.classList.remove("w-100");
    cloned.querySelector("h3").textContent = name;
    const linkHtml = `<a class="npm-userscript-issue-pr-link" href="${link}">${count}</a>`;
    cloned.querySelector("p").innerHTML = linkHtml;
    ref.insertAdjacentElement("afterend", cloned);
  }
  async function getIssueAndPrCount(repo) {
    const cached = cache.get(`issue-pr-count:${repo}`);
    if (cached) return JSON.parse(cached);
    const issues = fetch(
      `https://api.github.com/search/issues?q=repo:${repo}+type:issue+state:open&per_page=0`
    ).then((res) => res.json()).then((data) => data.total_count ?? 0).catch(() => 0);
    const pulls = fetch(
      `https://api.github.com/search/issues?q=repo:${repo}+type:pr+state:open&per_page=0`
    ).then((res) => res.json()).then((data) => data.total_count ?? 0).catch(() => 0);
    const promises = await Promise.all([issues, pulls]);
    const result = { issues: promises[0], pulls: promises[1] };
    cache.set(`issue-pr-count:${repo}`, JSON.stringify(result), 60);
    return result;
  }

  // src/features/fix-styles.ts
  var fix_styles_exports = {};
  __export(fix_styles_exports, {
    description: () => description4,
    run: () => run3,
    runPre: () => runPre4
  });
  var description4 = `Fix various style issues on the npm site (mostly the package page at the moment).
`;
  function runPre4() {
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
    }
  }
  function run3() {
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

  // src/features/helpful-links.ts
  var helpful_links_exports = {};
  __export(helpful_links_exports, {
    description: () => description5,
    run: () => run4,
    runPre: () => runPre5
  });
  var description5 = "Add helpful links beside the package name title for convenience.";
  function runPre5() {
    if (!isValidPackagePage()) return;
    addStyle(`
    .npm-userscript-helpful-links {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 8px;
    }
    /* More spacing if no dts icon */
    span + .npm-userscript-helpful-links {
      margin-left: 16px;
    }

    .npm-userscript-helpful-links a {
      display: block;
    }

    .npm-userscript-helpful-links a svg {
      display: block;
      width: 20px;
      height: 20px;
    }

    /* align vertically center */
    h1 > div[data-nosnippet="true"] {
      display: flex;
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
  function run4() {
    if (!isValidPackagePage()) return;
    const packageName = getPackageName();
    if (!packageName) return;
    const links = [
      getRepoLinkData(),
      getHomepageLinkData(),
      getFundingLinkData(),
      getPublintLinkData(packageName),
      getAttwLinkData(packageName),
      getNpmgraphLinkData(packageName),
      getNodeModulesInspectorLinkData(packageName),
      getPackagephobiaLinkData(packageName),
      getBundlejsLinkData(packageName)
    ].filter(Boolean);
    const group = document.createElement("div");
    group.className = "npm-userscript-helpful-links";
    group.innerHTML = links.map(
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
    ).join("");
    const titleEl = document.querySelector("#top h1");
    if (!titleEl) return;
    titleEl.appendChild(group);
    const observer = new MutationObserver(() => {
      const existing = document.querySelector(".npm-userscript-helpful-links");
      if (!existing) {
        titleEl.appendChild(group);
      }
    });
    observer.observe(titleEl, { childList: true });
  }
  function getRepoLinkData() {
    const repositoryLink = document.querySelector(
      "a[aria-labelledby*=repository-link]"
    );
    if (repositoryLink) {
      return {
        label: "Repository",
        url: repositoryLink.href,
        iconSvg: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="#F1502F" fill-rule="nonzero"><path d="M15.6981994,7.28744895 L8.71251571,0.3018063 C8.3102891,-0.1006021 7.65784619,-0.1006021 7.25527133,0.3018063 L5.80464367,1.75263572 L7.64478689,3.59281398 C8.07243561,3.44828825 8.56276901,3.5452772 8.90352982,3.88604451 C9.24638012,4.22907547 9.34249661,4.72359725 9.19431703,5.15282127 L10.9679448,6.92630874 C11.3971607,6.77830046 11.8918472,6.8738964 12.2346975,7.21727561 C12.7135387,7.69595181 12.7135387,8.47203759 12.2346975,8.95106204 C11.755508,9.43026062 10.9796112,9.43026062 10.5002476,8.95106204 C10.140159,8.59061834 10.0510075,8.06127108 10.2336636,7.61759448 L8.57948492,5.9635584 L8.57948492,10.3160467 C8.69614805,10.3738569 8.80636859,10.4509954 8.90352982,10.5479843 C9.38237103,11.0268347 9.38237103,11.8027463 8.90352982,12.2822931 C8.42468862,12.7609693 7.64826937,12.7609693 7.16977641,12.2822931 C6.69093521,11.8027463 6.69093521,11.0268347 7.16977641,10.5479843 C7.28818078,10.4297518 7.42521643,10.3402504 7.57148065,10.2803505 L7.57148065,5.88746473 C7.42521643,5.82773904 7.28852903,5.73893407 7.16977641,5.62000506 C6.80707597,5.25747183 6.71983981,4.72499027 6.90597844,4.27957241 L5.09195384,2.465165 L0.301800552,7.25506126 C-0.100600184,7.65781791 -0.100600184,8.31027324 0.301800552,8.71268164 L7.28783254,15.6983243 C7.69005915,16.1005586 8.34232793,16.1005586 8.74507691,15.6983243 L15.6981994,8.74506934 C16.1006002,8.34266094 16.1006002,7.68968322 15.6981994,7.28744895" id="Path"></path></g></svg>`
      };
    }
  }
  function getHomepageLinkData() {
    const homepageLink = document.querySelector(
      "a[aria-labelledby*=homePage-link]"
    );
    if (homepageLink) {
      return {
        label: "Homepage",
        url: homepageLink.href,
        iconSvg: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2679d8" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path></svg>`
      };
    }
  }
  function getFundingLinkData() {
    const sidebarLinks = document.querySelectorAll(
      '[aria-label="Package sidebar"] a'
    );
    for (const a2 of sidebarLinks) {
      if (a2.textContent === "Fund this package") {
        return {
          label: "Fund this package",
          url: a2.href,
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true"><path fill="#fa5b9b" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>`
        };
      }
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

  // src/features/move-funding.ts
  var move_funding_exports = {};
  __export(move_funding_exports, {
    description: () => description6,
    run: () => run5
  });
  var description6 = `Move the "Fund this package" button to the bottom of the sidebar.
`;
  function run5() {
    if (!isValidPackagePage()) return;
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
      collaboratorsSection?.insertAdjacentElement(
        "afterend",
        fundingButton.cloneNode(true)
      );
      fundingButton.style.display = "none";
    }
  }

  // src/features/no-code-beta.ts
  var no_code_beta_exports = {};
  __export(no_code_beta_exports, {
    description: () => description7,
    runPre: () => runPre6
  });
  var description7 = `Hide the "Beta" label in the package code tab because it has been working for around 3 years now.
`;
  function runPre6() {
    addStyle(`
    #package-tab-code > span > span:last-child {
      display: none;
    }
  `);
  }

  // src/features/npm-create.ts
  var npm_create_exports = {};
  __export(npm_create_exports, {
    description: () => description8,
    run: () => run6
  });
  var description8 = `If the package is named \`create-*\`, change the suggested install command in the sidebar as
\`npm create *\` instead of \`npm install create-*\`.
`;
  function run6() {
    if (!isValidPackagePage()) return;
    const packageName = getPackageName();
    if (!packageName) return;
    let createPackageName;
    if (packageName.startsWith("create-")) {
      createPackageName = packageName;
    } else if (packageName.startsWith("@") && packageName.includes("/create-")) {
      createPackageName = packageName.replace("/create-", "/");
    } else {
      return;
    }
    const codeBlock = document.querySelector('[aria-label="Package sidebar"] code');
    if (!codeBlock) return;
    codeBlock.textContent = `npm create ${packageName.slice("create-".length)}@latest`;
  }

  // src/features/remember-banner.ts
  var remember_banner_exports = {};
  __export(remember_banner_exports, {
    description: () => description9,
    run: () => run7,
    runPre: () => runPre7
  });
  var description9 = `Remember the banner at the top of the page when dismissed, so it doesn't keep showing up.
`;
  var bannerPrefix = "remember-banner:";
  var getBannerKey = (banner) => {
    const text = banner.textContent.trim();
    const hash = btoa(encodeURIComponent(text)).slice(0, 16) + text.length;
    return `${bannerPrefix}${hash}`;
  };
  function runPre7() {
    const wasClosed = cache.hasByPrefix(bannerPrefix);
    if (wasClosed) {
      addStyle(`
      section[aria-label="Site notifications"] {
        display: none;
      }
    `);
    }
  }
  function run7() {
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

  // src/features/remove-runkit.ts
  var remove_runkit_exports = {};
  __export(remove_runkit_exports, {
    description: () => description10,
    run: () => run8
  });
  var description10 = `Remove the RunKit link as it's dead.
`;
  function run8() {
    if (!isValidPackagePage()) return;
    const link = document.querySelector('a[href^="https://runkit.com/npm/"]');
    link?.remove();
  }

  // src/features/tarball-size.ts
  var tarball_size_exports = {};
  __export(tarball_size_exports, {
    description: () => description11,
    run: () => run9
  });

  // node_modules/get-npm-tarball-url/lib/index.mjs
  function src_default(pkgName, pkgVersion, opts) {
    let registry;
    if (opts == null ? void 0 : opts.registry) {
      registry = opts.registry.endsWith("/") ? opts.registry : `${opts.registry}/`;
    } else {
      registry = "https://registry.npmjs.org/";
    }
    const scopelessName = getScopelessName(pkgName);
    return `${registry}${pkgName}/-/${scopelessName}-${removeBuildMetadataFromVersion(pkgVersion)}.tgz`;
  }
  function removeBuildMetadataFromVersion(version) {
    const plusPos = version.indexOf("+");
    if (plusPos === -1)
      return version;
    return version.substring(0, plusPos);
  }
  function getScopelessName(name) {
    if (name[0] !== "@") {
      return name;
    }
    return name.split("/")[1];
  }

  // src/features/tarball-size.ts
  var description11 = `Display the tarball size of the package
`;
  async function run9() {
    if (!isValidPackagePage()) return;
    const packageName = getPackageName();
    const packageVersion = getPackageVersion();
    if (!packageName || !packageVersion) return;
    const tarballSize = await getTarballSize(packageName, packageVersion);
    if (!tarballSize) return;
    const sidebarColumns = document.querySelectorAll('[aria-label="Package sidebar"] > div:has(> h3)');
    const unpackedSizeColumn = Array.from(sidebarColumns).find(
      (col) => col.querySelector("h3")?.textContent === "Unpacked Size"
    );
    if (!unpackedSizeColumn) return;
    const tarballSizeColumn = unpackedSizeColumn.cloneNode(true);
    tarballSizeColumn.querySelector("h3").textContent = "Tarball Size";
    tarballSizeColumn.querySelector("p").textContent = tarballSize;
    unpackedSizeColumn.insertAdjacentElement("afterend", tarballSizeColumn);
  }
  async function getTarballSize(packageName, packageVersion) {
    const controller = new AbortController();
    const result = await fetch(src_default(packageName, packageVersion), {
      method: "GET",
      signal: controller.signal
    });
    controller.abort();
    const contentLength = result.headers.get("Content-Length");
    if (!contentLength) return void 0;
    return prettyBytes(parseInt(contentLength, 10));
  }

  // src/all-features.ts
  var allFeatures = {
    "better-versions": better_versions_exports,
    "dim-mode": dim_mode_exports,
    "fix-issue-pr-count": fix_issue_pr_count_exports,
    "fix-styles": fix_styles_exports,
    "helpful-links": helpful_links_exports,
    "move-funding": move_funding_exports,
    "no-code-beta": no_code_beta_exports,
    "npm-create": npm_create_exports,
    "remember-banner": remember_banner_exports,
    "remove-runkit": remove_runkit_exports,
    "tarball-size": tarball_size_exports
  };

  // node_modules/uhtml/dist/prod/dom.js
  var e;
  !(function(e3) {
    e3[e3.None = 0] = "None", e3[e3.Mutable = 1] = "Mutable", e3[e3.Watching = 2] = "Watching", e3[e3.RecursedCheck = 4] = "RecursedCheck", e3[e3.Recursed = 8] = "Recursed", e3[e3.Dirty = 16] = "Dirty", e3[e3.Pending = 32] = "Pending";
  })(e || (e = {}));
  var t = [];
  var n = [];
  var { link: s, unlink: i, propagate: r, checkDirty: o, endTracking: l, startTracking: a, shallowPropagate: c } = (function({ update: e3, notify: t2, unwatched: n2 }) {
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
  } });
  var u;
  var d;
  var f = 0;
  var p = 0;
  var h = 0;
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
  var O = { greedy: false };
  var $ = (e3) => {
    t.push(v(void 0));
    try {
      return e3();
    } finally {
      v(t.pop());
    }
  };
  var W = class {
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
  var E = class extends W {
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
  var R = (e3, { greedy: t2 = false } = O) => t2 ? new E(e3) : new W(b, e3);
  function L() {
    return R.apply(null, arguments);
  }
  var _ = (e3) => {
    R = e3;
  };
  var { isArray: j } = Array;
  var { assign: F, defineProperties: P, entries: B, freeze: J } = Object;
  var V = class {
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
  var H = (e3) => document.createComment(e3);
  var q = 42;
  var G = /* @__PURE__ */ new Set(["plaintext", "script", "style", "textarea", "title", "xmp"]);
  var I = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"]);
  var K = J({});
  var Q = J([]);
  var U = (e3, t2) => (e3.children === Q && (e3.children = []), e3.children.push(t2), t2.parent = e3, t2);
  var X = (e3, t2, n2) => {
    e3.props === K && (e3.props = {}), e3.props[t2] = n2;
  };
  var Y = (e3, t2, n2) => {
    e3 !== t2 && n2.push(e3);
  };
  var Z = class {
    constructor(e3) {
      this.type = e3, this.parent = null;
    }
    toJSON() {
      return [this.type, this.data];
    }
  };
  var ee = class extends Z {
    constructor(e3) {
      super(8), this.data = e3;
    }
    toString() {
      return `<!--${this.data}-->`;
    }
  };
  var te = class extends Z {
    constructor(e3) {
      super(10), this.data = e3;
    }
    toString() {
      return `<!${this.data}>`;
    }
  };
  var ne = class extends Z {
    constructor(e3) {
      super(3), this.data = e3;
    }
    toString() {
      return this.data;
    }
  };
  var se = class extends Z {
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
  var ie = class extends Z {
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
  var re = class extends Z {
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
  var oe = "\0";
  var le = `"${oe}"`;
  var ae = `'${oe}'`;
  var ce = /\x00|<[^><\s]+/g;
  var ue = /([^\s/>=]+)(?:=(\x00|(?:(['"])[\s\S]*?\3)))?/g;
  var de = (e3, t2, n2, s2, i2) => [t2, n2, s2];
  var fe = (e3) => {
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
  var pe = (e3, t2) => {
    do {
      e3 = e3.parent;
    } while (t2.has(e3));
    return e3;
  };
  var he = (e3, t2) => t2 < 0 ? e3.content : e3.childNodes[t2];
  var ve = (e3, t2) => t2.reduceRight(he, e3);
  var ge;
  var be = false;
  var me = ({ firstChild: e3, lastChild: t2 }) => {
    const n2 = ge || (ge = document.createRange());
    return n2.setStartAfter(e3), n2.setEndAfter(t2), n2.deleteContents(), e3;
  };
  var xe = (e3, t2) => be && 11 === e3.nodeType ? 1 / t2 < 0 ? t2 ? me(e3) : e3.lastChild : t2 ? e3.valueOf() : e3.firstChild : e3;
  var ye = /* @__PURE__ */ Symbol("nodes");
  var we = { get() {
    return this.firstChild.parentNode;
  } };
  var Se = { value(e3) {
    me(this).replaceWith(e3);
  } };
  var ke = { value() {
    me(this).remove();
  } };
  var Ce = { value() {
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
  function Te(e3) {
    const t2 = H("<>"), n2 = H("</>");
    return e3.replaceChildren(t2, ...e3.childNodes, n2), be = true, P(e3, { [ye]: { writable: true, value: Q }, firstChild: { value: t2 }, lastChild: { value: n2 }, parentNode: we, valueOf: Ce, replaceWith: Se, remove: ke });
  }
  Te.prototype = DocumentFragment.prototype;
  var De = 16;
  var Oe = 32768;
  var Ne = ((e3 = globalThis.document) => {
    let t2, n2 = e3.createElement("template");
    return (s2, i2 = false) => {
      if (i2) return t2 || (t2 = e3.createRange(), t2.selectNodeContents(e3.createElementNS("http://www.w3.org/2000/svg", "svg"))), t2.createContextualFragment(s2);
      n2.innerHTML = s2;
      const r2 = n2.content;
      return n2 = n2.cloneNode(false), r2;
    };
  })(document);
  var $e = /* @__PURE__ */ Symbol("ref");
  var We = (e3, t2) => {
    for (const [n2, s2] of B(t2)) {
      const t3 = "role" === n2 ? n2 : `aria-${n2.toLowerCase()}`;
      null == s2 ? e3.removeAttribute(t3) : e3.setAttribute(t3, s2);
    }
  };
  var Ae = (e3) => (t2, n2) => {
    null == n2 ? t2.removeAttribute(e3) : t2.setAttribute(e3, n2);
  };
  var Ee = (e3, t2) => {
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
  var Me = /* @__PURE__ */ new WeakMap();
  var Re = (e3, t2) => {
    const n2 = "object" == typeof t2 ? t2 ?? e3 : ((e4, t3) => {
      let n3 = Me.get(e4);
      return n3 ? n3.data = t3 : Me.set(e4, n3 = document.createTextNode(t3)), n3;
    })(e3, t2), s2 = e3[ye] ?? e3;
    n2 !== s2 && s2.replaceWith(xe(e3[ye] = n2, 1));
  };
  var Le = (e3, t2) => {
    Re(e3, t2 instanceof W ? t2.value : t2);
  };
  var _e = ({ dataset: e3 }, t2) => {
    for (const [n2, s2] of B(t2)) null == s2 ? delete e3[n2] : e3[n2] = s2;
  };
  var je = /* @__PURE__ */ new Map();
  var Fe = (e3) => {
    let t2 = je.get(e3);
    return t2 || je.set(e3, t2 = Pe(e3)), t2;
  };
  var Pe = (e3) => (t2, n2) => {
    t2[e3] = n2;
  };
  var Be = (e3, t2) => {
    for (const [n2, s2] of B(t2)) Ae(n2)(e3, s2);
  };
  var Je = (e3, t2, n2) => n2 ? (n3, s2) => {
    const i2 = n3[t2];
    i2?.length && n3.removeEventListener(e3, ...i2), s2 && n3.addEventListener(e3, ...s2), n3[t2] = s2;
  } : (n3, s2) => {
    const i2 = n3[t2];
    i2 && n3.removeEventListener(e3, i2), s2 && n3.addEventListener(e3, s2), n3[t2] = s2;
  };
  var Ve = (e3) => (t2, n2) => {
    t2.toggleAttribute(e3, !!n2);
  };
  var ze = false;
  var He = true;
  var qe = (e3) => {
    He = e3;
  };
  var Ge = () => He;
  var Ie = (e3) => xe(e3.n ? e3.update(e3) : e3.valueOf(false), 1);
  var Ke = (e3, t2) => {
    const n2 = [], s2 = e3.length, i2 = t2.length;
    for (let r2, o2, l2 = 0, a2 = 0; a2 < i2; a2++) r2 = t2[a2], n2[a2] = l2 < s2 && (o2 = e3[l2++]).t === r2.t ? (t2[a2] = o2).update(r2) : r2.valueOf(false);
    return n2;
  };
  var Qe = (e3, t2, n2) => {
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
  var Ue = (e3, t2) => (e3.t === t2.t ? e3.update(t2) : (e3.n.replaceWith(Ie(t2)), e3 = t2), e3);
  var Xe = (e3, t2, n2) => {
    let s2, i2 = [], r2 = [De, null, n2], o2 = true;
    return x(() => {
      if (o2) o2 = false, s2 = Qe(t2, n2, i2), i2.length || (i2 = Q), s2 ? (e3.replaceWith(Ie(s2)), r2[1] = s2) : e3.remove();
      else {
        const e4 = Qe(t2, n2, i2);
        s2 && Ue(s2, e4) === e4 && (r2[2] = s2 = e4);
      }
    }), r2;
  };
  var Ye = /* @__PURE__ */ Symbol();
  var Ze = {};
  var et = class _et {
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
  var tt = /* @__PURE__ */ new WeakMap();
  var nt = class extends Map {
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
  var st = (({ Comment: e3 = ee, DocumentType: t2 = te, Text: n2 = ne, Fragment: s2 = re, Element: i2 = ie, Component: r2 = se, update: o2 = de }) => (l2, a2, c2) => {
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
  var it = (e3, t2 = /* @__PURE__ */ new WeakMap()) => (n2, ...s2) => {
    let i2 = t2.get(n2);
    return i2 || (i2 = st(n2, s2, e3), i2.push((() => {
      const e4 = ze;
      return ze = false, e4;
    })() ? new nt() : null), i2[0] = Ne(i2[0].toString(), e3), t2.set(n2, i2)), new et(i2, s2);
  };
  var rt = it(false);
  var ot = it(true);
  function at(e3, ...t2) {
    const n2 = rt.apply(null, arguments);
    return Ge() ? n2.valueOf(true) : n2;
  }

  // src/settings.ts
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
  var featureSettings = Object.fromEntries(
    Object.entries(allFeatures).map(([name, feature]) => {
      return [
        name,
        localStorageStore(`npm-userscript:settings:feature:${name}`, feature.disabled ? false : true)
      ];
    })
  );
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
          width: 400px;
          padding: 16px;
          border-radius: 4px;
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
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 4px 0;
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
        <p class="features">Features (Hover for extended description)</p>
        ${Object.entries(featureStates).map(([name, state]) => {
      return at`
            <label
              class="setting"
              key=${name}
              title="${allFeatures[name].description.trim().replace(/\n/g, " ")}"
            >
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
    const button = document.createElement("button");
    button.innerHTML = "Open Npm Userscript Settings";
    button.style.cssText = "font-size: 13px; border: 0px; background: none; cursor: pointer; padding: 0; opacity: 0.8;";
    button.onclick = () => document.body.append(at`<${Settings} />`);
    const sidebar = document.querySelector('[aria-label="Package sidebar"]');
    sidebar?.insertAdjacentElement("beforeend", button);
  }

  // src/index.ts
  runFeatures();
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
    cache.clearExpired();
    ensureSidebarBalance();
    injectSettingsTrigger();
  }
})();
