// ==UserScript==
// @name         豆瓣、TMDB、IMDb跳转至影巢（HDHIVE）
// @namespace    https://greasyfork.org/zh-CN/users/1553511
// @version      1.0.0
// @description  在豆瓣、TMDB、IMDb的影视条目页添加直接跳转至影巢（HDHIVE）对应条目的按纽
// @author       Ling77
// @license      MIT
// @icon         data:img/png;base64,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
// @match        https://movie.douban.com/subject/*
// @match        https://www.imdb.com/title/*
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      api.themoviedb.org
// @homepageURL  https://greasyfork.org/zh-CN/users/1553511-ling77
// @downloadURL https://update.greasyfork.org/scripts/562544/%E8%B1%86%E7%93%A3%E3%80%81TMDB%E3%80%81IMDb%E8%B7%B3%E8%BD%AC%E8%87%B3%E5%BD%B1%E5%B7%A2%EF%BC%88HDHIVE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562544/%E8%B1%86%E7%93%A3%E3%80%81TMDB%E3%80%81IMDb%E8%B7%B3%E8%BD%AC%E8%87%B3%E5%BD%B1%E5%B7%A2%EF%BC%88HDHIVE%EF%BC%89.meta.js
// ==/UserScript==
(function() {
  const ScriptName = '豆瓣、TMDB、IMDb跳转至影巢';
  const Icon_HDHive = GM_info.script.icon;
  let TMDB_API_KEY = '02a84d2c6a55d57e24ed723c398327e9';
  function minifyCSS(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*([\{\}:;,])\s*/g, '$1').replace(/\s+/g, ' ').replace(';}', '}').trim();
  }
  function addStyle(cssCode) {
    cssCode = minifyCSS(cssCode);
    const style = document.createElement('style');
    style.textContent = cssCode;
    document.head.appendChild(style);
  }
  const TmdbCache = {
    config: {
      cache_key: 'cache_mapping',
      cleanup_time_key: 'last_cleanup',
      trigger_size: 500,
      retain_size: 200,
      cleanup_interval: 7 * 24 * 60 * 60 * 1e3
    },
    cache: {},
    get: function(imdbId) {
      if (this.cache[imdbId]) {
        this.cache[imdbId].last_accessed = Date.now();
        return this.cache[imdbId].path;
      }
      return null;
    },
    set: function(imdbId, tmdbPath) {
      this.cache[imdbId] = {
        path: tmdbPath,
        last_accessed: Date.now()
      };
    },
    update: function() {
      this.tryCleanup();
      GM_setValue(this.config.cache_key, JSON.stringify(this.cache));
    },
    tryCleanup: function() {
      const now = Date.now();
      const lastCleanup = GM_getValue(this.config.cleanup_time_key, 0);
      const keys = Object.keys(this.cache);
      const isOverSize = keys.length >= this.config.trigger_size;
      const isTimeDue = now - lastCleanup > this.config.cleanup_interval;
      if (isOverSize || isTimeDue) {
        console.log(`[${ScriptName}] [i] TMDB Cache 触发清理: 数量过多(${isOverSize}) 或 周期触发(${isTimeDue})`);
        if (keys.length <= this.config.retain_size) {
          GM_setValue(this.config.cleanup_time_key, now);
          return;
        }
        const sortedEntries = keys.map(key => ({
          id: key,
          data: this.cache[key]
        })).sort((a, b) => b.data.last_accessed - a.data.last_accessed);
        const retainedEntries = sortedEntries.slice(0, this.config.retain_size);
        let newCache = {};
        retainedEntries.forEach(entry => {
          newCache[entry.id] = entry.data;
        });
        this.cache = newCache;
        GM_setValue(this.config.cleanup_time_key, now);
        console.log(`[${ScriptName}] [i] TMDB Cache 清理完成: 从 ${keys.length} 条减少至 ${this.config.retain_size} 条`);
        return true;
      }
    }
  };
  TmdbCache.cache = JSON.parse(GM_getValue(TmdbCache.config.cache_key, '{}'));
  async function getTmdbPath(imdb_id) {
    let tmdbPath = TmdbCache.get(imdb_id);
    if (tmdbPath) return tmdbPath;
    const options = {
      method: 'GET',
      url: `https://api.themoviedb.org/3/find/${imdb_id}?external_source=imdb_id&language=en-US&api_key=${TMDB_API_KEY}`,
      headers: {
        accept: 'application/json'
      },
      anonymous: true
    };
    let res = await GM.xmlHttpRequest(options).catch(err => console.error(`[${ScriptName}] 请求 tmdb 错误\n${JSON.stringify(err, null, 2)}`));
    let respBody = JSON.parse(res.responseText);
    if (res.status >= 200 && res.status < 300) if (respBody.movie_results.length > 0) {
      tmdbPath = `movie/${respBody.movie_results[0].id}`;
      TmdbCache.set(imdb_id, tmdbPath);
    } else if (respBody.tv_results.length > 0) {
      tmdbPath = `tv/${respBody.tv_results[0].id}`;
      TmdbCache.set(imdb_id, tmdbPath);
    } else console.error(`[${ScriptName}] 未在 Tmdb 检索到相关资源`); else if (res.status == 429) alert(`[${ScriptName}]\n请求 tmdb 错误 (${res.status})\n` + `达到速率限制，可能当前使用的人过多，请暂时关闭脚本，等待一段时间后再使用``${JSON.stringify(respBody, null, 2)}`); else alert(`[${ScriptName}]\n请求 tmdb 错误 (${res.status})\n` + `${JSON.stringify(respBody, null, 2)}`);
    return tmdbPath;
  }
  function createJumpButton(link, css_append = '') {
    const css = `\n      .hdhive-btn {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n\n        padding: 8px 16px;\n        box-sizing: border-box;\n\n        background-color: #0d253f;\n        color: #eee !important;\n        border-radius: 12px;\n        box-shadow: 0 2px 5px rgba(0,0,0,0.2);\n        font-size: 14px;\n        font-weight: bold;\n        text-decoration: none;\n        line-height: 1.2;\n        transition: all 0.2s ease;      }\n\n      .hdhive-btn:hover {\n        text-decoration: none !important;\n      }\n      \n      .hdhive-btn img {\n        height: 1.8em !important;\n        margin: 0 !important; \n        margin-right: 6px !important;\n      }\n\n      .hdhive-label {\n          color: goldenrod;\n          font-weight: 900;\n          margin-right: 4px;\n      }\n    `;
    addStyle(css + css_append);
    const wrapper = document.createElement('div');
    wrapper.className = 'hdhive-btn-wrapper';
    wrapper.innerHTML = `\n        <a href="${link}" target="_blank" class="hdhive-btn" title="跳转到 HDHIVE 站点">\n            <img src="${Icon_HDHive}" alt="图标">\n            <span class="hdhive-label">HDHIVE</span> 跳转\n        </a>\n    `;
    return wrapper;
  }
  async function douban() {
    const imdb_id = document.getElementById('info').textContent.match(/(tt\d{7,})/)[1];
    if (!imdb_id) {
      console.warn(`[${ScriptName}] [w] imdbid not found}`);
      return;
    }
    const tmdb_path = await getTmdbPath(imdb_id);
    if (!tmdb_path) {
      console.warn(`[${ScriptName}] [w] can't get tmdbid}`);
      return;
    }
    const hdhive_link = `https://hdhive.com/tmdb/${tmdb_path}`;
    const css_append = `.hdhive-btn-wrapper {\n      display: inline-flex;\n      vertical-align: middle;\n    }\n    .hdhive-btn:hover {\n      background-color: #0c3a6a;\n      color: #eee;\n      transform: translateY(-2px);\n      box-shadow: 0 4px 8px rgba(0,0,0,0.3);\n    }`;
    const jumpButton = createJumpButton(hdhive_link, css_append);
    document.querySelector('h1').appendChild(jumpButton);
  }
  async function imdb() {
    const imdb_id = location.pathname.match(/^\/title\/(tt\d+)\//)[1];
    if (!imdb_id) {
      console.warn(`[${ScriptName}] [w] imdbid not found}`);
      return;
    }
    const tmdb_path = await getTmdbPath(imdb_id);
    if (!tmdb_path) {
      console.warn(`[${ScriptName}] [w] can't get tmdbid}`);
      return;
    }
    const hdhive_link = `https://hdhive.com/tmdb/${tmdb_path}`;
    const css_append = `.hdhive-btn-wrapper {\n      margin: 0.3rem auto 0 1rem;\n      align-self: baseline;\n    }\n    .hdhive-btn:hover {\n      background-color: #0c3a6a;\n      color: #eee;\n      transform: translateY(-2px);\n      box-shadow: 0 4px 8px rgba(0,0,0,0.3);\n    }`;
    const jumpButton = createJumpButton(hdhive_link, css_append);
    document.querySelector('h1').parentElement.after(jumpButton);
  }
  function tmdb() {
    const tmdb_path = location.pathname.match(/^\/((movie|tv)\/\d+)/)[1];
    const hdhive_link = `https://hdhive.com/tmdb/${tmdb_path}`;
    const vibes_label = document.getElementById('vibes_label');
    const class_append = Array.from(vibes_label.classList).filter(item => item.match(/^(hover:scale|duration)/));
    const css_append = `.hdhive-btn-wrapper {\n      margin-left: 1rem;\n    }\n    .hdhive-btn {\n      background-color: #032541;\n    }`;
    const jumpButton = createJumpButton(hdhive_link, css_append);
    jumpButton.classList.add(...class_append);
    vibes_label.after(jumpButton);
  }
  switch (location.hostname) {
   case 'movie.douban.com':
    if (location.pathname.match(/^\/subject\/\d+\/?$/)) douban().then(() => TmdbCache.update());
    break;

   case 'www.imdb.com':
    if (location.pathname.match(/^\/title\/tt\d+\/?$/) && !__NEXT_DATA__.props.pageProps.aboveTheFoldData.titleType.isEpisode) imdb().then(() => TmdbCache.update());
    break;

   case 'www.themoviedb.org':
    if (location.pathname.match(/^\/(movie|tv)\/\d+\/?$/)) tmdb();
    break;

   default:
    return;
  }
})();
