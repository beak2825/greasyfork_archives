// ==UserScript==
// @name         Rousi Pro 一键转种
// @author       xiaoQQya
// @version      0.1.1
// @description  将站点 Rousi 的种子一键转种到新站点 Rousi Pro
// @namespace    form.transfer
// @match        https://rousi.zip/details.php*
// @match        https://zmpt.cc/details.php*
// @match        https://rousi.pro/upload
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562754/Rousi%20Pro%20%E4%B8%80%E9%94%AE%E8%BD%AC%E7%A7%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/562754/Rousi%20Pro%20%E4%B8%80%E9%94%AE%E8%BD%AC%E7%A7%8D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SOURCE_HOST = 'rousi.zip'
  const TARGET_HOST = 'rousi.pro'
  const STORE_KEY = 'ROUSI_PRO_DATA'

  /** 判断当前页面类型 */
  const isSourcePage = location.hostname === SOURCE_HOST
  const isTargetPage = location.hostname === TARGET_HOST

  /** ---------- 源页面逻辑 ---------- */
  function handleSourcePage() {
    const table = document.querySelector('table[width="97%"]');
    if (!table) return;

    const title = document.querySelector('h1').innerText.split('[免费]')[0].trim();
    const tds = table.querySelectorAll('td');
    const url = tds[1].querySelector('a').href;
    const torrent = tds[1].innerText.split("torrent")[0].replace(/\[Rousi\]\./g, "").trim() + "torrent";

    const subtitle = tds[3].innerText.trim();

    const typeDict = {
      "TV Series": "tv",
      "Movies": "movie",
      "Animations": "animation",
      "ACGN": "animation",
      "Documentaries": "documentary",
      "步兵": "9kg",
      "H图": "9kg",
      "III": "9kg"
    };

    let type = "";
    let mediainfo = "";
    let desc = "";
    let imgUrl = "";
    tds.forEach((td, index) => {
      if (td.innerText.trim() === "基本信息") {
        type = typeDict[tds[index + 1].innerText.trim().match(/类型:\s*([^\(（]+)/)?.[1] || ""];
      }
      if (td.innerText.trim() === "MediaInfo/BDInfo") {
        mediainfo = tds[index + 1].querySelector("pre").textContent;
      }
      if (td.innerText.trim() === "简介") {
        desc = tds[index + 1].innerText.trim();
        imgUrl = tds[index + 1].querySelector('img')?.src || "";
      }
    });

    const labelStr = desc.match(/◎类\s*别\s*(.+)/)?.[1];
    const labels = labelStr ? labelStr.replaceAll(/\s/, "").split("/") : [];

    const country = (desc.match(/◎产\s*地\s*(.+)/)?.[1] || "").replace("中国", "").trim();
    const imdb = desc.match(/◎IMDb链接\s*(https?:\/\/\S+)/)?.[1] || "";
    const tmdb = desc.match(/◎TMDB链接\s*(https?:\/\/\S+)/)?.[1] || "";
    const douban = desc.match(/◎豆瓣链接\s*(https?:\/\/\S+)/)?.[1] || "";

    console.log("title:", title);
    console.log("url:", url);
    console.log("torrent:", torrent);
    console.log("subtitle:", subtitle);
    console.log("type:", type);
    console.log("labels:", JSON.stringify(labels));
    console.log("country:", country);
    console.log("imdb:", imdb);
    console.log("tmdb:", tmdb);
    console.log("douban:", douban);
    console.log("imgUrl:", imgUrl);
    console.log("desc:", desc);
    console.log("mediainfo:", mediainfo);

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.textContent = '转种到新站'
    btn.style.marginLeft = '10px'

    table.prepend(btn)

    btn.addEventListener('click', () => {
      const data = { title, url, torrent, subtitle, type, labels, country, imdb, tmdb, douban, imgUrl, desc, mediainfo }
      GM_setValue(STORE_KEY, data)
      window.open('https://rousi.pro/upload', '_blank')
    })
  }

  /** ---------- 目标页面逻辑 ---------- */
  function fillFileInputFromUrl(fileInput, fileUrl, fileName) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: fileUrl,
      responseType: 'blob',
      onload: res => {
        const file = new File([res.response], fileName, { type: res.response.type })
        const dt = new DataTransfer()
        for (const f of fileInput.files) {
          dt.items.add(f)
        }
        dt.items.add(file)
        fileInput.files = dt.files
        fileInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
  }

  function setInputValue(input, value) {
    const prototype = Object.getPrototypeOf(input)
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value')
    const nativeSetter = descriptor.set

    nativeSetter.call(input, value)

    input.dispatchEvent(new Event('input', { bubbles: true }))
  }

  function setSelectValue(select, value) {
    const proto = Object.getPrototypeOf(select)
    const desc = Object.getOwnPropertyDescriptor(proto, 'value')
    const nativeSetter = desc.set

    nativeSetter.call(select, value)

    select.dispatchEvent(new Event('change', { bubbles: true }))
  }


  function handleTargetPage() {
    const data = GM_getValue(STORE_KEY)
    if (!data) return
    console.log(data)

    setTimeout(() => {
      let selects = document.querySelectorAll("select");
      if (data.type && data.type != "") {
        setSelectValue(selects[0], data.type);
      }

      selects = document.querySelectorAll("select");
      console.log(selects);
      setSelectValue(selects[1], data.country);

      let options = selects[2].options;
      for (let i = options.length - 1; i >= 0; i--) {
        let items = options[i].value.split("/");
        let value = null;
        for (let j = 0; j < items.length; j++) {
          if (data.title.toLowerCase().includes(items[j].toLowerCase().trim())) {
            value = options[i].value;
            break;
          }
        }
        if (value) {
          setSelectValue(selects[2], value);
          break;
        }
      }

      options = selects[3].options;
      for (let i = options.length - 1; i >= 0; i--) {
        let items = options[i].value.split("/");
        let value = null;
        for (let j = 0; j < items.length; j++) {
          if (data.title.toLowerCase().includes(items[j].toLowerCase().trim())) {
            value = options[i].value;
            break;
          }
        }
        if (value) {
          setSelectValue(selects[3], value);
          break;
        }
      }

      document.querySelector('div[class="flex flex-wrap gap-2"]').querySelectorAll('button').forEach(btn => {
        if (data.labels.includes(btn.innerText.trim())) {
          btn.click();
        }
      });

      const inputs = document.querySelectorAll("input");
      console.log(inputs);
      fillFileInputFromUrl(inputs[0], data.url, data.torrent);
      const imgInput = document.querySelectorAll('input[type="file"]')[1];
      console.log(imgInput)
      if (data.imgUrl != "") {
        const segments = data.imgUrl.split("/");
        fillFileInputFromUrl(imgInput, data.imgUrl, segments[segments.length - 1]);
      }

      setInputValue(inputs[1], data.title);
      setInputValue(inputs[2], data.subtitle);
      const imdbInput = document.querySelector('input[placeholder="填入 IMDb 链接"]');
      console.log(imdbInput);
      setInputValue(imdbInput, data.imdb);
      const doubanInput = document.querySelector('input[placeholder="填入 豆瓣 链接"]');
      console.log(doubanInput);
      setInputValue(doubanInput, data.douban);
      const tmdbInput = document.querySelector('input[placeholder="填入 TMDB 链接"]');
      console.log(tmdbInput);
      setInputValue(tmdbInput, data.tmdb);

      const textareas = document.querySelectorAll("textarea");
      console.log(textareas);
      setInputValue(textareas[0], data.desc);
      setInputValue(textareas[1], data.mediainfo);

      document.querySelector('input[type="checkbox"]').click();

      GM_setValue(STORE_KEY, null);
    }, 2000)
  }

  /** ---------- 执行入口 ---------- */
  if (isSourcePage) {
    handleSourcePage()
  } else if (isTargetPage) {
    handleTargetPage()
  }
})();
