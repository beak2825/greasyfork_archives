// ==UserScript==
// @name         Bandcamp to Douban (Silent Version)
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      5.1
// @description  Bandcamp 抓取双重保险：HTML DOM + JS 变量 (无弹窗版)
// @author       gemini
// @match        *://*.bandcamp.com/album/*
// @match        *://*.bandcamp.com/track/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562066/Bandcamp%20to%20Douban%20%28Silent%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562066/Bandcamp%20to%20Douban%20%28Silent%20Version%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const doubanURL = 'https://music.douban.com/new_subject';

  function extractBandcampData() {
    // 1. 尝试获取核心数据对象
    let tralbum = unsafeWindow.TralbumData || window.TralbumData;
    let embedData = unsafeWindow.EmbedData || window.EmbedData;

    // 2. 标签抓取（双重保险）
    let rawTags = [];

    // 方法A: 从 JS 对象获取
    if (tralbum && tralbum.tags) {
        rawTags = tralbum.tags.map(t => t.name);
    }

    // 方法B: 如果方法A失败，直接从页面可见元素抓取 (class="tag")
    if (rawTags.length === 0) {
        const tagElements = document.querySelectorAll('.tag');
        tagElements.forEach(el => {
            if (el.innerText && !el.innerText.includes('tags:')) {
                rawTags.push(el.innerText.trim());
            }
        });
    }

    // 3. 流派映射
    const standardGenre = mapGenreToDouban(rawTags);
    const finalGenres = standardGenre ? [standardGenre] : rawTags;

    // 4. 其他数据处理
    // 如果 tralbum 为空，尝试从 DOM 拼凑最基本信息
    const title = tralbum ? tralbum.current.title : (document.querySelector('.trackTitle') ? document.querySelector('.trackTitle').innerText.trim() : 'Unknown');
    const artist = tralbum ? tralbum.artist : (document.querySelector('.nwa-header-artist') ? document.querySelector('.nwa-header-artist').innerText.trim() : 'Unknown');

    // 日期
    let formattedDate = '';
    if (tralbum && tralbum.current.release_date) {
        const d = new Date(tralbum.current.release_date);
        if (!isNaN(d)) formattedDate = d.toISOString().split('T')[0];
    } else {
        const credits = document.querySelector('.tralbum-credits');
        if (credits && credits.innerText.includes('released')) {
            const dateMatch = credits.innerText.match(/released\s+(.*)/);
            if (dateMatch) {
                const d = new Date(dateMatch[1]);
                if (!isNaN(d)) formattedDate = d.toISOString().split('T')[0];
            }
        }
    }

    // 5. 构建发送给豆瓣的数据
    const info = {
      artists: [{ name: artist }],
      genres: finalGenres,
      numArtists: 1,
      label: extractLabel(embedData),
      title: title,
      format: detectFormat(tralbum),
      styles: rawTags,
      release: formattedDate,
      note: (tralbum && tralbum.current.about) ? tralbum.current.about : 'None',
      country: 'Unknown',
      link: window.location.href,
      tracklist: buildTracklist(tralbum),
      type: detectType(tralbum, title),
    };

    // 6. 下载封面
    if (tralbum && tralbum.art_id) {
        const coverUrl = `https://f4.bcbits.com/img/a${tralbum.art_id}_10.jpg`;
        try { GM_download(coverUrl, `${title}.jpg`); } catch(e) { console.error(e); }
    } else {
        const imgEl = document.querySelector('#tralbumArt img');
        if (imgEl) {
             try { GM_download(imgEl.src, `${title}.jpg`); } catch(e) {}
        }
    }

    // 7. 直接发送，无弹窗
    window.open(doubanURL, JSON.stringify(info));
  }

  // --- 强力映射字典 ---
  function mapGenreToDouban(tags) {
      const t = tags.join(' ').toLowerCase();
      if (t.match(/rock|metal|punk|indie|emo|grunge|shoegaze|post-rock|new wave|alternative|hardcore|screamo/)) return 'Rock';
      if (t.match(/electronic|techno|house|ambient|drone|synth|idm|vaporwave|glitch|bass|club|dubstep|breakcore|experimental/)) return 'Electronic';
      if (t.match(/rap|hip-hop|hiphop|trap|grime|beats|instrumental hip-hop/)) return 'HipHop';
      if (t.match(/jazz|fusion|bop|swing|improvisation|big band/)) return 'Jazz';
      if (t.match(/folk|country|acoustic|americana|singer-songwriter|neofolk|world|roots|bluegrass/)) return 'Folk, World, & Country';
      if (t.match(/funk|soul|r&b|disco|groove|motown/)) return 'Funk / Soul';
      if (t.match(/classical|orchestral|chamber|piano|neo-classical|contemporary classical/)) return 'Classical';
      if (t.match(/reggae|dub|ska|dancehall|rocksteady/)) return 'Reggae';
      if (t.match(/blues/)) return 'Blues';
      if (t.match(/latin|salsa|bossa|cumbia|tango/)) return 'Latin';
      if (t.match(/pop|j-pop|k-pop|city pop|indie pop/)) return 'Pop';
      return null;
  }

  function extractLabel(embedData) {
    if (embedData && embedData.publisher) return embedData.publisher;
    const backLink = document.querySelector('.back-link-text');
    return backLink ? backLink.innerText : 'Self-Released';
  }

  function detectFormat(tralbum) {
      if (!tralbum) return 'File';
      const packages = tralbum.packages || [];
      const pStr = JSON.stringify(packages).toLowerCase();
      if (pStr.includes('vinyl') || pStr.includes('lp')) return 'Vinyl';
      if (pStr.includes('cassette') || pStr.includes('tape')) return 'Cassette';
      if (pStr.includes('cd')) return 'CD';
      return 'File';
  }

  function detectType(tralbum, title) {
    title = title.toLowerCase();
    const trackCount = (tralbum && tralbum.trackinfo) ? tralbum.trackinfo.length : 1;
    if (title.includes(' ep') || title.endsWith(' ep')) return 'EP';
    if (title.includes('single')) return '单曲';
    if (title.includes('compilation')) return '选集';
    if (trackCount === 1) return '单曲';
    if (trackCount > 1 && trackCount <= 6) return 'EP';
    return '专辑';
  }

  function buildTracklist(tralbum) {
      if (!tralbum || !tralbum.trackinfo) return '';
      let str = '';
      tralbum.trackinfo.forEach(track => {
          const duration = track.duration ? formatDuration(track.duration) : '';
          str += `${track.track_num}. ${track.title} ${duration}\n`;
      });
      return str;
  }

  function formatDuration(seconds) {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  GM_registerMenuCommand('添加 Bandcamp 条目', extractBandcampData);
})();