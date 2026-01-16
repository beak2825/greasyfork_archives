// ==UserScript==
// @name         GorakuwebDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for gorakuweb.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gorakuweb.com
// @homepageURL  https://greasyfork.org/scripts/562756-gorakuwebdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://gorakuweb.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562756/GorakuwebDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562756/GorakuwebDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/gorakuweb\.com\/episode\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // get episode config
  const html = document.body.innerHTML;
  const textFragment = html.slice(html.indexOf('titleId'), html.indexOf('viewerPostThumbs'));
  const config = JSON.parse(`{"${textFragment.replaceAll('\\"', '"')}title":"${document.title.split(' | ').slice(1, 2)}"}`);

  // get pages
  const pages = config.metadata.pages.map(page => (page.url = `${config.base}/${page.filename}?__token__=${config.accessKey}`, page));

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title: config.title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => getDecryptedImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  async function getDecryptedImage(page) {
    const unhex = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map((part) => parseInt(part, 16)));
    const encryptedImageArrayBuffer = await axios.get(page.url, { responseType: 'arraybuffer' }).then(res => res.data);
    const algorithm = { name: 'AES-CBC', iv: unhex(config.ivBytes) }
    const key = await crypto.subtle.importKey('raw', unhex(config.keyBytes), algorithm, false, ['decrypt']);
    const decryptedImageArrayBuffer = await crypto.subtle.decrypt(algorithm, key, encryptedImageArrayBuffer);

    return new Promise(resolve => {
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(decryptedImageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        canvas.toBlob(resolve, 'image/jpeg', 1);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);