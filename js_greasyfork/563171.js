// ==UserScript==
// @name        Add Favicons to Links
// @namespace   Violentmonkey Scripts
// @match       file:///*floccus*bookmarks*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.xmlhttpRequest
// @version     1.0
// @author      SHA
// @license     GNU GPLv3
// @description 1/17/2026, 12:06:49 AM
// @downloadURL https://update.greasyfork.org/scripts/563171/Add%20Favicons%20to%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/563171/Add%20Favicons%20to%20Links.meta.js
// ==/UserScript==

//window.addEventListener("load", async function () {
(async function() {
  document.head.insertAdjacentHTML("beforeend", `
  <style>
    img {
      vertical-align: text-bottom;
    }
  </style>
  `);

  const links = document.getElementsByTagName("a");

  Array.from(links).forEach(async link => {
    const imgElement = document.createElement("img");
    imgElement.width = 16;
    imgElement.height = 16;

    const url = new URL(link.href);
    let faviconURL;
    let dataURL = await GM.getValue(url.origin);

    if (!dataURL) {
      faviconURL = await getFaviconURLOfOrigin(url.origin);
      dataURL = await imageURLToDataURL(faviconURL);
      await GM.setValue(url.origin, dataURL);
    }
    if (!dataURL) {

    }

    imgElement.src = dataURL;
    link.insertAdjacentElement("afterbegin", imgElement);
  });

})();
//});

async function getFaviconURLOfOrigin(origin) {
  return new Promise((resolve, reject) => {
    GM.xmlhttpRequest({
      url: origin,
      responseType: "document",
      onload: ({ response }) => {
        let icon = response.querySelector('link[rel=icon][sizes="16x16"]:not([href^="EXT:"])') ??
          response.querySelector('link[rel="icon"]:not(sizes)') ??
          response.querySelector('link[rel="icon"]') ??
          response.querySelector('link[rel="shortcut icon"]');
        let href = 'favicon.ico';
        if (icon) {
          href = icon.getAttribute('href');
        }
        if (!href.startsWith('http')) {
          if (href.startsWith('//')) {
            href = 'https:' + href;
          } else {
            let temp = new URL(origin);
            temp.pathname = href;
            href = temp.href;
          }
        }
        console.log(`Favicon for ${origin} is at ${href}`);
        resolve(href);
      },
      onerror: () => resolve("")
    });
  });
}

async function cacheImage(img, key) {
  console.log(`caching ${img.src} under ${key}`);
  const dataURL = imageElementToDataURL(img);
  await GM.setValue(key, dataURL);
}

async function imageURLToDataURL(url) {
  return new Promise((resolve, reject) => {
    GM.xmlhttpRequest({
      url,
      responseType: "blob",
      onload: ({ response, total, loaded, status }) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log(`${status} for ${url}. total: ${total}, loaded: ${loaded}, .length: ${reader.result.length}.`);
          if (status === 200) {
            resolve(reader.result);
          } else {
            reject(status);
          }
        }
        reader.onerror = reject;
        reader.readAsDataURL(response); // async call
      },
      onerror: reject
    });
  }).catch(() => "not found");
}

