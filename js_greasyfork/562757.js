// ==UserScript==
// @name         DocomoAnimestoreDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for animestore.docomo.ne.jp
// @icon         https://animestore.docomo.ne.jp/favicon.png
// @homepageURL  https://greasyfork.org/scripts/562757-docomoanimestoredownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://animestore.docomo.ne.jp/animestore/comic_viewer/viewer.html*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/451814/1159347/PublusPage.js
// @require      https://update.greasyfork.org/scripts/451813/1128858/PublusNovelPage.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562757/DocomoAnimestoreDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562757/DocomoAnimestoreDownloader.meta.js
// ==/UserScript==

(async function (axios, JSZip, saveAs, ImageDownloader, PublusPage, PublusNovelPage) {
  'use strict';

  // get auth data
  const cid = new URLSearchParams(window.location.search).get('cid');
  const authData = await axios.get(`https://api.book.animestore.docomo.ne.jp/api/publus/approval?cid=${cid}`).then(res => res.data);
  authData.auth_info = authData.auth_info || {};

  // get config data
  const { configData, isNovel } = await Promise.any([getConfig(''), getConfig('normal_default/')]);

  // get pages
  const unhex = (hexString) => hexString.match(/.{1,2}/g).map((part) => parseInt(part, 16));
  const pages = configData.configuration.contents.map(pageInfo => {
    const pageConfig = configData[pageInfo.file];
    return (isNovel ? PublusNovelPage : PublusPage).init(pageInfo.index, pageInfo.file, pageConfig, axios, unhex(configData.ct), unhex(configData.st), unhex(configData.et), authData.url);
  }).flat();

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title: authData.cti,
    imageSuffix: 'jpeg',
    zipOptions: { base64: true }
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => page.getImage(authData.auth_info)
        .then(imageBase64 => imageBase64.replace('data:image/jpeg;base64,', ''))
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of config
  function getConfig(addon) {
    return axios({
      method: 'GET',
      url: `${authData.url}${addon}configuration_pack.json?${new URLSearchParams(authData.auth_info)}`
    }).then(res => ({
      configData: res.data,
      isNovel: addon === 'normal_default/'
    }));
  }

})(axios, JSZip, saveAs, ImageDownloader, PublusPage, PublusNovelPage);