// ==UserScript==
// @name            Red 40
// @description     e6* downloader without a memory leak
// @author          1fz54ARh0m8g0KUYzqui
// @license         Unlicense
// @version         3.0
// @match           https://e621.net/*
// @match           https://e6ai.net/*
// @match           https://e926.net/*
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM_download
// @grant           GM_log
// @run-at          document-end
// @namespace https://greasyfork.org/users/1518908
// @downloadURL https://update.greasyfork.org/scripts/550566/Red%2040.user.js
// @updateURL https://update.greasyfork.org/scripts/550566/Red%2040.meta.js
// ==/UserScript==
// Verified working on e621ng 25.09.17

// A constructed object cannot be returned from an async IIFE
// This might be the only way to do this
// There is a race condition here
const configuration = {
  maximumAttempts: 1,
  clientName: "",
  rememberHashes: false,
  userAgentCompliant: false,

  getHashes: async () => {
    try {
      const retrieved = JSON.parse(GM.getValue("hashes", []));
      if (!(retrieved instanceof Array)) {
        return [];
      }

      return retrieved;
    } catch {
      return [];
    }
  },

  setHashes: async (hashArray) => {
    if (!(hashArray instanceof Array)) {
      return new TypeError("Array required");
    }

    await GM.setValue("hashes", JSON.stringify(hashArray));
  }
};

// Page data
const currentPage = document.querySelector("nav.pagination.numbered")?.dataset.current | 0;
const finalPage = (document.querySelector("nav.pagination.numbered")?.dataset.total ?? currentPage) | 0;
const hasPosts = !!(document.querySelector("section.posts-container"));

// Locking system modified from
// https://medium.com/@chris_marois/asynchronous-locks-in-modern-javascript-8142c877baf
const metadata = {
  unlock: () => {},
  lock: () => {
    this.promise = new Promise(resolve => this.unlock = resolve);
  },
  promise: Promise.resolve(),

  data: []
};

// Heavy checks since the user can put invalid data
(async function() {
  const maximumAttempts = Math.max((await GM.getValue("maximumAttempts", 3)) | 0, 1);
  const clientName = String(await GM.getValue("clientName", "e129"));
  const rememberHashes = !!(await GM.getValue("rememberHashes", false));
  const userAgentCompliant = !!(await GM.getValue("userAgentCompliant", true));

  configuration.maximumAttempts = maximumAttempts;
  configuration.clientName = clientName;
  configuration.rememberHashes = rememberHashes;
  configuration.userAgentCompliant = (userAgentCompliant && clientName.length !== 0);
})();

// Having a reusable attempts function was slow and broke
// No point if there's only 2 attemptable functions
// FireMonkey has issues with this, that sucks
async function _download(url, currentAttempt) {
  url = String(url);
  currentAttempt = Math.max(currentAttempt|0, 1);

  // Guess the file name
  let fileName = new URL(url).pathname.split("/").pop();

  // If the file name is invalid, just go with no extension
  if (!/^[0-9A-Za-z.]+$/.test(fileName)) {
    fileName = `download@${Date.now()}`;
  }

  GM_log(`Downloading ${fileName}.`);

  const downloadPromise = new Promise((resolve, reject) => {
    GM_download({
      url: url,
      name: fileName,
      saveAs: false,
      conflictAction: "uniquify",
      onerror: (error) => reject(error),
      onload: (response) => resolve(response)
    });
  });

  await downloadPromise.catch(async () => {
    GM_log(`Failed to download ${fileName}. (Attempt ${currentAttempt}/${configuration.maximumAttempts})`);
    if (currentAttempt >= configuration.maximumAttempts) {
      return;
    }

    // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, currentAttempt)));
    await _download(url, currentAttempt+1);
  });

  await downloadPromise.then(() => GM_log(`Downloaded ${fileName}.`));
}

// A wrapper for _download
async function _downloadList(urlList) {
  if (!(urlList instanceof Array)) {
    return new TypeError("Array required");
  }

  for (const url of urlList) {
    await _download(url, 1);
  }
}

async function _fetch(url, currentAttempt) {
  url = String(url);
  currentAttempt = Math.max(currentAttempt | 0, 1);

  let response = await fetch(url);

  if (!response.ok) {
    GM_log(`Failed to fetch ${url} (Attempt ${currentAttempt}/${configuration.maximumAttempts})`);
    if (currentAttempt >= configuration.maximumAttempts) {
      return undefined;
    }

    // Hopefully this frees memory
    response = undefined;

    // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, currentAttempt)));
    return await _fetch(url, currentAttempt+1);
  }

  response = await response.text();

  // This has to be on the same line, I don't know why
  const parser = new DOMParser().parseFromString(response, "text/html");
  return parser;
}

async function _getMetadata() {
  if (!hasPosts) {
    return;
  }

  await metadata.promise;

  if (metadata.data.length !== 0) {
    return;
  }

  metadata.lock();

  if (finalPage === 1) {
    GM_log("Fetching 1 page.");
  } else {
    GM_log(`Fetching ${(finalPage+1)-currentPage} pages.`);
  }

  let pagesSkipped = 0;

  // The other parameters are unknown, so only replace the page numbers
  // A URL is needed, so provide one if there is only one page
  const baseURL = new URL(document.querySelector("a.page.last")?.href ?? "https://example.com");
  const baseURLParameters = new URLSearchParams(baseURL.search);

  if (configuration.userAgentCompliant) {
    baseURLParameters.set("_client", String(configuration.clientName));
  }

  // Keep only one of following pages' DOMs active
  for (let i = currentPage; i <= finalPage; i++) {
    let parser;

    if (i === currentPage) {
      parser = document;
    } else {
      // This should never happen
      if (baseURL.hostname === "example.com") {
        pagesSkipped++;
        continue;
      }

      baseURLParameters.set("page", i);
      baseURL.search = baseURLParameters.toString();

      // Fetch isn't async, it just returns a promise
      parser = await _fetch(baseURL.toString());

      if (parser === undefined) {
        pagesSkipped++;
        continue;
      }
    }

    const pagePosts = parser.querySelector("section.posts-container")?.querySelectorAll("article");

    // There is a chance that a human verification page is returned, nothing can be done
    if (pagePosts === null) {
      pagesSkipped++;
      continue;
    }

    for (const post of pagePosts) {
      // Tags are split by spaces, so split here
      const tags = post.dataset.tags.split(' ');

      const postData = {
        id: post.dataset.id | 0,
        extension: post.dataset.fileExt,
        md5: post.dataset.md5,
        tags: tags.map((e) => e.replaceAll('_', ' ')),
        url: post.dataset.fileUrl
      };

      // Race condition possible, oh well
      metadata.data.push(postData);
    }
  }

  metadata.unlock();

  if (pagesSkipped === 1) {
    GM_log("1 page skipped.");
  } else if (pagesSkipped !== 0) {
    GM_log(`${pagesSkipped} pages skipped.`);
  }
}

const metadataExportButton = document.createElement("a");
metadataExportButton.onclick = async () => {
  if (metadataExportButton.disabled) {
    return;
  }

  metadataExportButton.disabled = true;

  let jsonData;

  if (hasPosts) {
    await _getMetadata();
    jsonData = JSON.stringify(metadata.data);
  } else {
    // This data could be cached instead of computed, but what are the benefits?
    // There must be at least 1 tag on a post
    const tagList = document.querySelector("section#tag-list").querySelectorAll("span.tag-list-name");
    const tagObject = {
      tags: []
    };

    tagList.foreach((e) => tagObject.tags.push(e.innerText.trim()));
    jsonData = JSON.stringify(tagObject);
  }

  const blob = new Blob([jsonData], {
    type: "application/json"
  });

  const a = document.createElement("a");

  a.setAttribute('download', `download@${Date.now()}.json`);
  a.setAttribute('href', window.URL.createObjectURL(blob));
  a.click();

  metadataExportButton.disabled = false;
};

const postDownloadButton = document.createElement("a");
postDownloadButton.onclick = async () => {
  if (postDownloadButton.disabled) {
    return;
  }

  postDownloadButton.disabled = true;

  await _getMetadata();
  const previousHashes = await configuration.getHashes();
  const futureHashes = [];

  // This pointer will be changed
  let urlList1 = [];

  for (const e of metadata.data) {
    if (configuration.rememberHashes && previousHashes.includes(e.md5)) {
      continue;
    }

    urlList1.push(e.url);
    futureHashes.push(e.md5);
  }

  const fileCount = urlList1.length;

  // 0 is weirdly truthy in this case
  const urlList2 = urlList1.filter((e, i) => !!(i & 1));
  urlList1 = urlList1.filter((e, i) => !(i & 1));

  GM_log(`Downloading ${fileCount} files.`);
  postDownloadButton.innerText = `Downloading ${fileCount} files...`;

  await Promise.allSettled([_downloadList(urlList1), _downloadList(urlList2)]);
  GM_log(`Finished downloading ${fileCount} files.`);

  if (configuration.rememberHashes) {
    await configuration.setHashes(previousHashes.concat(futureHashes));
    GM_log("Saved hashes of the download list.");
  }

  postDownloadButton.disabled = false;
  postDownloadButton.innerText = "Download all posts";
};

const secondaryBar = document.querySelector("menu.nav-secondary.desktop");

if (hasPosts || document.querySelector("section#tag-list")) {
  const metadataExportItem = document.createElement("li");
  metadataExportItem.id = "subnav-metadata-export";
  metadataExportButton.id = "subnav-metadata-export-link";
  metadataExportButton.innerText = "Export metadata";
  metadataExportItem.appendChild(metadataExportButton);
  secondaryBar?.appendChild(metadataExportItem);
}

if (hasPosts) {
  const postDownloadItem = document.createElement("li");
  postDownloadItem.id = "subnav-post-download";
  postDownloadButton.id = "subnav-post-download-link";
  postDownloadButton.innerText = "Download all posts";
  postDownloadItem.appendChild(postDownloadButton);
  secondaryBar?.appendChild(postDownloadItem);
}