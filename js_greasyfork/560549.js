// ==UserScript==
// @name         SubHD字幕列表优化
// @namespace    https://greasyfork.org/zh-CN/users/1553511
// @version      1.4.0
// @description  1.合集置顶。2.添加字幕排序功能，可按下载量和上传时间排序
// @author       Ling77
// @license      MIT
// @icon         https://subhd.tv/public/images/favicon-32x32.png
// @match        https://subhd.tv/d/*
// @match        https://subhd.cc/d/*
// @match        https://subhd.me/d/*
// @match        https://subhdtw.com/d/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://update.greasyfork.org/scripts/561258/1726820.js
// @homepageURL  https://greasyfork.org/zh-CN/users/1553511-ling77
// @downloadURL https://update.greasyfork.org/scripts/560549/SubHD%E5%AD%97%E5%B9%95%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560549/SubHD%E5%AD%97%E5%B9%95%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  let CONFIG = {
    defaultSort: 'default'
  };
  const ScriptName = 'SubHD字幕列表优化';
  const SortLabel = {
    default: {
      short: '默认',
      long: '默认排序'
    },
    download: {
      short: '下载量',
      long: '按下载量排序'
    },
    time: {
      short: '时间',
      long: '按时间排序'
    }
  };
  let settings;
  const date = new Date;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  function settingPage() {
    const myConfigData = {
      title: ScriptName + ' - 脚本设置',
      fields: {
        a: {
          groups: {
            a: {
              items: {
                defaultSort: {
                  label: "排序方式",
                  type: "select",
                  style: "dropdown",
                  desp: "进入页面时的字幕默认排序方式",
                  options: Object.entries(SortLabel).map(([key, val]) => ({
                    label: val.long,
                    value: key
                  }))
                }
              }
            }
          }
        }
      }
    };
    settings = new GM_ConfigUI({
      config: myConfigData,
      onSave: data => {
        CONFIG = data.a.a;
        GM_setValue("config", JSON.stringify(CONFIG));
      },
      defaultData: {
        a: {
          a: CONFIG
        }
      }
    });
    if (!GM_getValue("config")) GM_setValue("config", JSON.stringify(CONFIG)); else {
      CONFIG = JSON.parse(GM_getValue("config"));
      settings.updateData({
        a: {
          a: CONFIG
        }
      });
    }
    GM_registerMenuCommand("打开设置", () => settings.open());
  }
  function parseDownloadCount(row) {
    const el = row.querySelector(':scope > :nth-child(2) > .text-secondary');
    return el ? parseInt(el.textContent.trim(), 10) || 0 : 0;
  }
  function parseUploadTime(row) {
    const timeEl = row.querySelector(':scope > :nth-child(3) .text-black-50');
    if (!timeEl) return 0;
    let text = timeEl.textContent.trim();
    if (/^\d{2}-\d{2}/.test(text)) text = `${y}-${text}`; else if (/^\d{1,2}:\d{2}$/.test(text)) text = `${y}-${m}-${d} ${text}`;
    return new Date(text.replace(/-/g, '/')).getTime() || 0;
  }
  function setActiveButton(type) {
    [ 'default', 'download', 'time' ].forEach(t => {
      const btn = document.getElementById(`btn-${t}`);
      if (!btn) return;
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-light');
    });
    const active = document.getElementById(`btn-${type}`);
    if (active) {
      active.classList.remove('btn-light');
      active.classList.add('btn-danger');
    }
  }
  function moveCollectionToTop(container) {
    const children = Array.from(container.children);
    let startIndex = -1;
    let endIndex = children.length;
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      if (el.textContent.trim() === '合集') {
        startIndex = i;
        break;
      }
    }
    if (startIndex === -1) return;
    const fragment = document.createDocumentFragment();
    children.slice(startIndex, endIndex).forEach(el => fragment.appendChild(el));
    const subtitleInfo = container.querySelector('.rounded-top.bg-purple');
    if (subtitleInfo) subtitleInfo.after(fragment);
  }
  function getEpisodeBlocks(container) {
    const children = Array.from(container.children);
    const blocks = [];
    let current = null;
    const subtitleInfo = container.querySelector(':scope > .rounded-top');
    const isMovie = subtitleInfo && !subtitleInfo.nextElementSibling.classList.contains('f12');
    children.forEach(el => {
      if (isMovie && el === subtitleInfo) {
        current = {
          title: subtitleInfo,
          rows: [],
          hrs: []
        };
        blocks.push(current);
      } else if (!isMovie && el.classList.contains('f12') && el.textContent.includes('集')) {
        current = {
          title: el,
          rows: [],
          hrs: []
        };
        blocks.push(current);
      } else if (current && el.classList.contains('row')) current.rows.push(el); else if (current && el.tagName === 'HR') current.hrs.push(el);
    });
    return blocks;
  }
  function sortSubtitles(type) {
    const container = document.querySelector('.bg-white.shadow-sm.rounded-3.mb-5');
    if (!container) return;
    const blocks = getEpisodeBlocks(container);
    blocks.forEach(block => {
      const items = block.rows.map((row, i) => ({
        row,
        hr: block.hrs[i],
        download: parseDownloadCount(row),
        time: parseUploadTime(row)
      }));
      if (type === 'download') items.sort((a, b) => a.download - b.download); else if (type === 'time') items.sort((a, b) => a.time - b.time); else return;
      items.forEach(item => {
        block.title.after(item.row);
        if (item.hr) item.row.after(item.hr);
      });
    });
    setActiveButton(type);
  }
  function insertButtons(container) {
    const btnBox = document.createElement('div');
    btnBox.className = 'clearfix';
    btnBox.innerHTML = `\n      <div class="float-start p-3">\n        <a class="btn btn-sm f12 me-1 btn-light" id="btn-default">${SortLabel.default.long}</a>\n        <a class="btn btn-sm f12 me-1 btn-light" id="btn-download">${SortLabel.download.long}</a>\n        <a class="btn btn-sm f12 me-1 btn-light" id="btn-time">${SortLabel.time.long}</a>\n      </div>\n      <div class="float-end p-3">\n        <a class="btn btn-sm f12 btn-outline-secondary" style="font-size: 1.3em" id="btn-setting">⚙️</a>\n      </div>\n    `;
    container.prepend(btnBox);
    document.getElementById('btn-default').onclick = () => {
      if (CONFIG.defaultSort !== 'default') localStorage.setItem('refreshedBy560549', true);
      location.reload();
    };
    document.getElementById('btn-download').onclick = () => sortSubtitles('download');
    document.getElementById('btn-time').onclick = () => sortSubtitles('time');
    document.getElementById('btn-setting').onclick = () => settings.open();
  }
  function init() {
    settingPage();
    const container = document.querySelector('.bg-white.shadow-sm.rounded-3.mb-5');
    if (!container) return;
    moveCollectionToTop(container);
    insertButtons(container);
    if (CONFIG.defaultSort === 'default') setActiveButton('default'); else if (localStorage.getItem('refreshedBy560549')) {
      setActiveButton('default');
      localStorage.removeItem('refreshedBy560549');
    } else if (CONFIG.defaultSort === 'download') sortSubtitles('download'); else if (CONFIG.defaultSort === 'time') sortSubtitles('time');
  }
  init();
})();