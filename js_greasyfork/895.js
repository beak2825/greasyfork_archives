// ==UserScript==
// @name    InoReader Filter
// @description    Highlight or remove articles in Inoreader. / Inoreaderの記事を消去もしくは強調表示します。
// @description:en    Highlight or remove articles in InoReader.
// @description:ja    Inoreaderの記事を消去もしくは強調表示します。
// @namespace    https://userscripts.org/scripts/show/352673
// @homepage    https://greasyfork.org/scripts/895-inoreader-filter
// @match    https://*.inoreader.com/*
// @exclude    *inoreader.com/stream*
// @exclude    *inoreader.com/m/*
// @grant    GM_registerMenuCommand
// @noframes
// @version    1.24
// @downloadURL https://update.greasyfork.org/scripts/895/InoReader%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/895/InoReader%20Filter.meta.js
// ==/UserScript==

(() => {
  'use strict';

  if (!/Ino\s?Reader/i.test(document.title)) return;
  let appVersion = 0,
    aNgTextarea = [],
    aNg = [],
    aNgId = [],
    aHiTextarea = [],
    aHi = [],
    aHiId = [],
    aAd = [],
    aAdId = [],
    aAdTemp,
    bExclude = false,
    nArticles = 0,
    nExcludes = 0,
    nUnread = 0,
    nUnreadEx = 0,
    st = {},
    LOC;
  const reAd =
      '^\\s*(?:ad|pr|広告)\\s*[:：]|^\\s*[\\[［【](?:ad|pr|広告)[\\]］】]|[\\[［【](?:ad|pr|広告)[\\]］】]\\s*$|[:：]\\s*(?:ad|pr|広告)\\s*$',
    $id = function (id) {
      return document.getElementById(id);
    },
    notType = function (t, a) {
      return Object.prototype.toString.call(a).slice(8, 11) !== t
        ? true
        : false;
    },
    target = $id('reader_pane'),
    config = {
      childList: true,
    },
    config2 = {
      childList: true,
      subtree: true,
    };

  const convertRules = () => {
    aNg = [];
    aHi = [];
    aNgTextarea = st.ngdata ? st.ngdata.split(/\r\n|\n|\r/) : [];
    aHiTextarea = st.hidata ? st.hidata.split(/\r\n|\n|\r/) : [];
    const wildcardToRegexp = function (s) {
        return s
          .replace(/~\*/g, '<InoReaderFilterAM>')
          .replace(/~\?/g, '<InoReaderFilterQM>')
          .replace(/[.+^=!:${}()|[\]/\\]/g, '\\$&')
          .replace(/\*/g, '.*')
          .replace(/\?/g, '.')
          .replace(/<InoReaderFilterAM>/g, '\\*')
          .replace(/<InoReaderFilterQM>/g, '\\?');
      },
      a = [aNg, aNgTextarea, aHi, aHiTextarea];
    for (let n = 0, m = a.length; n < m; n = n + 2) {
      for (let i = 0, j = a[n + 1].length; i < j; i++) {
        const str = a[n + 1][i];
        let sFeed = '',
          sTitle = '',
          sText = '';
        a[n][i] = {};
        a[n][i].feedPattern = '';
        a[n][i].feedFlag = '';
        a[n][i].titlePattern = '';
        a[n][i].titleFlag = '';
        a[n][i].textPattern = '';
        a[n][i].textFlag = '';
        a[n][i].task = '';
        if (str.indexOf(st.delimiter) !== -1) {
          const arr = str.split(st.delimiter);
          sFeed = arr[0];
          if (arr.length === 2) sText = arr[1];
          else if (arr.length > 2) {
            sTitle = arr[1];
            sText = str.slice(
              arr[0].length + arr[1].length + st.delimiter.length * 2
            );
            if (!arr[1]) a[n][i].task = 'text';
          }
        } else sText = str;
        if (sFeed) {
          if (/^\/.+\/g?i?y?$/.test(sFeed)) {
            a[n][i].feedPattern = sFeed.slice(
              sFeed.indexOf('/') + 1,
              sFeed.lastIndexOf('/')
            );
            a[n][i].feedFlag = sFeed.slice(sFeed.lastIndexOf('/') + 1);
          } else a[n][i].feedPattern = wildcardToRegexp(sFeed);
        }
        if (sTitle) {
          if (/^\/.+\/g?i?y?$/.test(sTitle)) {
            a[n][i].titlePattern = sTitle.slice(
              sTitle.indexOf('/') + 1,
              sTitle.lastIndexOf('/')
            );
            a[n][i].titleFlag = sTitle.slice(sTitle.lastIndexOf('/') + 1);
          } else a[n][i].titlePattern = wildcardToRegexp(sTitle);
        }
        if (sText) {
          if (/^\/.+\/g?i?y?$/.test(sText)) {
            a[n][i].textPattern = sText.slice(
              sText.indexOf('/') + 1,
              sText.lastIndexOf('/')
            );
            a[n][i].textFlag = sText.slice(sText.lastIndexOf('/') + 1);
          } else a[n][i].textPattern = wildcardToRegexp(sText);
        }
      }
    }
  };

  const checkArticle = (a, ft, at, du, tdu) => {
    const feed = a.feedPattern,
      title = a.titlePattern,
      text = a.textPattern,
      task = a.task;
    if ((!title && !text) || /^\s+$/.test(title + text)) return false;
    const bFeed = new RegExp(feed, `${a.feedFlag}m`).test(ft),
      bTitle = new RegExp(title, a.titleFlag).test(at),
      bDU = new RegExp(text, `${a.textFlag}m`).test(du),
      bTDU = new RegExp(text, `${a.textFlag}m`).test(tdu);
    if (!feed) {
      if (!title && bDU && task === 'text') return `DU: ${text}`;
      if (!title && bTDU && !task) return `TDU: ${text}`;
      if (bTitle && !text) return `T: ${title}`;
      if (bTitle && bDU) return `T: ${title} DU: ${text}`;
    }
    if (bFeed) {
      if (!title && bDU && task === 'text') {
        return `F: ${feed} DU: ${text}`;
      }
      if (!title && bTDU && !task) return `F: ${feed} TDU: ${text}`;
      if (bTitle && !text) return `F: ${feed} T: ${title}`;
      if (bTitle && bDU) return `F: ${feed} T: ${title} DU: ${text}`;
    }
    return '';
  };

  const currentArticle = () => {
    if (target) return target.getElementsByClassName('article_current');
    return [];
  };

  const currentExpandedArticle = () => {
    if (target) {
      return target.getElementsByClassName('article_current article_expanded');
    }
    return [];
  };

  const currentTreeName = () => {
    const tlf = document
      .getElementById('tree')
      .getElementsByClassName('selected');
    if (tlf.length && tlf[0] && tlf[0].textContent) return tlf[0].textContent;
    return '';
  };

  const articleData = (e) => {
    const o = {};
    o.sId = '';
    o.sFeed = '';
    o.sTitle = '';
    o.sDesc = '';
    o.sUrl = '';
    o.sDate = '';
    o.bUnread = false;
    o.sId = e && e.id ? e.id.slice(e.id.lastIndexOf('_') + 1) : '';
    if (!o.sId) return o;
    const eArticleFeed =
        $id(`article_feed_info_link_${o.sId}`) ||
        e.getElementsByClassName('article_feed_title')[0] ||
        e.querySelector('.article_tile_footer_feed_title > a'),
      eArticleTitle =
        $id(`at_${o.sId}`) ||
        $id(`article_title_link_inline_${o.sId}`) ||
        e.getElementsByClassName('article_title_link')[0] ||
        e.getElementsByClassName('article_magazine_title_link')[0],
      eArticleDesc =
        $id(`article_contents_inner_${o.sId}`) ||
        $id(`article_short_contents_${o.sId}`) ||
        e.getElementsByClassName('article_short_contents')[0] ||
        e.getElementsByClassName('article_tile_content')[0],
      eArticleUrl =
        $id(`aurl_${o.sId}`) ||
        $id(`burl_${o.sId}`) ||
        $id(`article_title_link_${o.sId}`),
      eArticleDate =
        $id(`header_date_${o.sId}`) ||
        $id(`header_date_tile_${o.sId}`) ||
        e.getElementsByClassName('article_sub_date')[0] ||
        e.getElementsByClassName('article_magazine_date')[0];
    o.sFeed = eArticleFeed ? eArticleFeed.textContent : currentTreeName();
    o.sTitle = eArticleTitle ? eArticleTitle.textContent : '';
    o.sDesc = eArticleDesc ? eArticleDesc.textContent : '';
    o.sUrl =
      eArticleUrl && eArticleUrl.hasAttribute('href')
        ? eArticleUrl.getAttribute('href')
        : '';
    o.sDate =
      eArticleDate && eArticleDate.hasAttribute('title')
        ? eArticleDate.getAttribute('title').trim()
        : '';
    if (/^\s+$/.test(o.sFeed)) o.sFeed = '';
    if (/^\s+$/.test(o.sTitle)) o.sTitle = '';
    if (/^\s+$/.test(o.sDesc)) o.sDesc = '';
    if (/^\s+$/.test(o.sUrl)) o.sUrl = '';
    if (/^\s+$/.test(o.sDate)) o.sDate = '';
    if (o.sDesc) {
      o.sDesc = o.sDesc.replace(/^\s+-\s+(.+)/, '$1').replace(/(.+)\s+$/, '$1');
    }
    if (o.sDate?.length >= 20) {
      o.sDate = o.sDate.slice(o.sDate.lastIndexOf(': ') + 2);
    }
    if (e.classList.contains('article_unreaded')) o.bUnread = true;
    return o;
  };

  const changedArticles = () => {
    if (!target) return;
    const articles = target.getElementsByClassName('ar'),
      treeTitle = currentTreeName(),
      eAc = currentExpandedArticle(),
      eUct =
        appVersion < 14
          ? $id('unread_cnt_top')
          : document.querySelector('#show_articles_menu label[for="option_0"]');
    let bFoundCurrentArticle = false,
      eExpandedCurrentArticle,
      nCnt = 0,
      aCnt;
    if (!articles.length || nArticles > articles.length + nExcludes + 3) {
      aHiId = [];
      aNgId = [];
      aAdId = [];
      bExclude = false;
      nArticles = 0;
      nExcludes = 0;
      nUnread = 0;
      nUnreadEx = 0;
      return;
    }
    if (eAc.length) eExpandedCurrentArticle = eAc[0];
    if (eUct && eUct.textContent && articles.length + nExcludes) {
      aCnt = eUct.textContent.match(/\d+/);
      if (aCnt && aCnt.length) {
        nCnt = Number(aCnt[0]);
        if (
          nCnt !== 1000 &&
          nCnt !== 10000 &&
          (!nUnread || nCnt !== nUnread - nUnreadEx)
        ) {
          nUnread = nCnt;
        }
      }
    }
    nArticles = articles.length + nExcludes;
    loop1: for (let n1 = 0, l1 = articles.length; n1 < l1; n1++) {
      if (n1 === 0 && !st.hi && !st.ng) break;
      const eArticle = articles[n1],
        oA = articleData(eArticle);
      if (!oA.sId) continue;
      if (eArticle === eExpandedCurrentArticle) bFoundCurrentArticle = true;
      if (st.hi) {
        for (let n2 = 0, l2 = aHiId.length; n2 < l2; n2++) {
          if (oA.sId === aHiId[n2]) continue loop1;
        }
      }
      if (st.ng) {
        for (let n3 = 0, l3 = aNgId.length; n3 < l3; n3++) {
          if (oA.sId === aNgId[n3]) {
            if (oA.bUnread) nUnreadEx += 1;
            nExcludes += 1;
            continue loop1;
          }
        }
      }
      if (st.ad) {
        for (let n4 = 0, l4 = aAdId.length; n4 < l4; n4++) {
          if (oA.sId === aAdId[n4]) {
            if (oA.bUnread) nUnreadEx += 1;
            nExcludes += 1;
            continue loop1;
          }
        }
      }
      if (treeTitle) oA.sFeed += `\n${treeTitle}`;
      const sArticleDU = `${oA.sDesc}\n${oA.sUrl}`,
        sArticleTDU = `${oA.sTitle}\n${oA.sDesc}\n${oA.sUrl}`;
      let sCa = '';
      if (st.hi) {
        for (let i1 = 0, j1 = aHi.length; i1 < j1; i1++) {
          sCa = checkArticle(
            aHi[i1],
            oA.sFeed,
            oA.sTitle,
            sArticleDU,
            sArticleTDU
          );
          if (sCa) {
            if (st.log) {
              console.log('highlight: ', oA.sTitle, ' / matching rule ', sCa);
            }
            $id(`article_${oA.sId}`).classList.add(
              'inoreader_filter_highlight'
            );
            aHiId.push(oA.sId);
            continue loop1;
          }
        }
      }
      if (bExclude) break;
      if (st.ad) {
        const sT = oA.sTitle
          .replace(/^\s*(?:ad|pr|広告)\s?[:：]\s*(.+)$/i, '$1')
          .replace(/^\s*[[［【](?:ad|pr|広告)[\]］】]\s*(.+)$/i, '$1')
          .replace(/^(.+)\s*[[［【](?:ad|pr|広告)[\]］】]\s*$/i, '$1');
        for (let i2 = 0, j2 = aAd.length, a; i2 < j2; i2++) {
          if (
            !aAd[i2] ||
            notType('Str', aAd[i2]) ||
            aAd[i2].indexOf('<>') === -1
          ) {
            continue;
          } else if (
            aAd[i2].slice(0, aAd[i2].lastIndexOf('<>')).indexOf(sT) !== -1
          ) {
            a = aAd[i2].slice(aAd[i2].lastIndexOf('<>') + 2).split('@');
            if (
              (!eAc.length || bFoundCurrentArticle) &&
              a.length === 2 &&
              Number(a[1]) &&
              $id(`article_${oA.sId}`) !== eExpandedCurrentArticle
            ) {
              if (st.log) console.log('remove ad: ', oA.sTitle);
              target.removeChild($id(`article_${oA.sId}`));
              aAdId.push(oA.sId);
              if (oA.bUnread) nUnreadEx += 1;
              nExcludes += 1;
              n1 -= 1;
              l1 -= 1;
              continue loop1;
            }
          }
        }
      }
      if (st.ng) {
        if (
          st.ad &&
          new RegExp(st.adfilter, 'im').test(`${oA.sTitle}\n${oA.sDesc}`) &&
          oA.sDate &&
          (oA.sDate.length <= 5 ||
            (oA.sDate.length > 5 &&
              new Date(oA.sDate).getTime() + 86400000 * 60 > Date.now()))
        ) {
          continue;
        }
        for (let i3 = 0, j3 = aNg.length; i3 < j3; i3++) {
          sCa = checkArticle(
            aNg[i3],
            oA.sFeed,
            oA.sTitle,
            sArticleDU,
            sArticleTDU
          );
          if (sCa) {
            if (st.log) {
              console.log('remove: ', oA.sTitle, ' / matching rule ', sCa);
            }
            target.removeChild($id(`article_${oA.sId}`));
            aNgId.push(oA.sId);
            if (oA.bUnread) nUnreadEx += 1;
            nExcludes += 1;
            n1 -= 1;
            l1 -= 1;
            continue loop1;
          }
        }
      }
    }
    if (!eUct?.hasAttribute('data-irf_ngcheck')) changedNumberOfUnreadArticles();
    if (appVersion < 14) {
      observer2.observe($id('unread_cnt_top'), config);
    } else {
      observer2.observe($id('header_pane'), config2);
    }
  };
  const observer1 = new MutationObserver(changedArticles);

  const changedNumberOfUnreadArticles = () => {
    if (st.ngcount === 2) return;
    observer2.disconnect();
    const eUct =
      appVersion < 14
        ? $id('unread_cnt_top')
        : document.querySelector('#show_articles_menu label[for="option_0"]');
    if (!eUct) return;
    let nDeduct = nUnread ? nUnread - nUnreadEx : 0,
      nCnt = 0,
      aCnt;
    eUct.removeAttribute('data-irf_ngcount');
    if (st.ngcount === 0) {
      if (nUnreadEx) {
        eUct.setAttribute('data-irf_ngcount', `(${nUnreadEx})`);
      }
    } else if (st.ngcount === 1) {
      aCnt = eUct.textContent.match(/\d+/);
      if (aCnt && aCnt.length) {
        nCnt = Number(aCnt[0]);
        if (nCnt !== 1000 && nCnt !== 10000) {
          nUnread = nCnt;
          nDeduct = nUnread ? nUnread - nUnreadEx : 0;
          if (nDeduct < 0) nDeduct = 0;
          eUct.textContent = eUct.textContent.replace(
            /([^\d]*)\d+([^\d]*)/,
            `$1${nDeduct}$2`
          );
        }
      }
    }
    if (nArticles >= 50 && nExcludes / nArticles >= 0.8) {
      if (!bExclude) window.alert(LOC.t30);
      bExclude = true;
    }
    observer2.observe(eUct, config);
    eUct.setAttribute('data-irf_ngcheck', '1');
  };
  const observer2 = new MutationObserver(changedNumberOfUnreadArticles);

  const createAdtable = (type, flag) => {
    let html = '';
    const at = aAdTemp || flag ? aAdTemp.concat() : aAd.concat();
    switch (Number(type)) {
      case 0:
        at.sort((a, b) => {
          const tA = a.slice(0, a.lastIndexOf('<>')),
            tB = b.slice(0, b.lastIndexOf('<>'));
          if (tA > tB) return 1;
          if (tA < tB) return -1;
          return 0;
        });
        break;
      case 1:
        at.sort((a, b) => {
          const tA = a.slice(0, a.lastIndexOf('<>')),
            tB = b.slice(0, b.lastIndexOf('<>'));
          if (tA < tB) return 1;
          if (tA > tB) return -1;
          return 0;
        });
        break;
      case 2:
        at.sort((a, b) => {
          const nA = a.slice(a.lastIndexOf('<>') + 2, -2),
            nB = b.slice(b.lastIndexOf('<>') + 2, -2);
          return Number(nB) - Number(nA);
        });
        break;
      case 3:
        at.sort((a, b) => {
          const nA = a.slice(a.lastIndexOf('<>') + 2, -2),
            nB = b.slice(b.lastIndexOf('<>') + 2, -2);
          return Number(nA) - Number(nB);
        });
        break;
    }
    for (let i = 0, j = at.length, a, t, d; i < j; i++) {
      if (!at[i] || notType('Str', at[i]) || at[i].indexOf('<>') === -1) {
        continue;
      }
      t = at[i].slice(0, at[i].lastIndexOf('<>'));
      a = at[i].slice(at[i].lastIndexOf('<>') + 2).split('@');
      d = a.length === 2 && Number(a[0]) >= 0 ? a[0] : '';
      if (!d) continue;
      html += `<div class="irf_tr"><div class="irf_ad_td1"><label><input id="irf_ad_switch_${d}" type="checkbox"${
        Number(a[1]) ? ' checked' : ''
      } value="${a[1]}" /><span title="${LOC.t22} : ${new Date(
        Number(a[0])
      ).toLocaleString()}">${t}</span></label></div><div class="irf_ad_td2"><input id="irf_ad_remove_${d}" type="button" value="${
        LOC.t12
      }" /></div></div>`;
    }
    $id('irf_ad_table').innerHTML = html;
  };

  const getAppVersion = () => {
    const extractNumber = (str) => {
      if (typeof str !== 'string' || str === '') return 0;
      const [first, second] = str.split('.');
      return first && second ? parseFloat(`${first}.${second}`) : 0;
    };
    try {
      /* global application_version */
      /* @ts-expect-error */
      appVersion = extractNumber(application_version);
    } catch (e) {
      if (st.log) console.log('getAppVersion', e);
    }
  };

  const setSettingsTab = (s) => {
    for (let t = ['ng', 'hi', 'ad', 'etc'], i = 0; i < 4; i++) {
      $id(`irf_tab_${t[i]}`).classList.remove('irf_tab_selected');
      $id(`irf_form_${t[i]}`).style.display = 'none';
    }
    $id(`irf_tab_${s}`).classList.add('irf_tab_selected');
    $id(`irf_form_${s}`).style.display = 'block';
    if (s === 'ng' || s === 'hi') {
      if ($id(`irf_${s}_add_word`).getBoundingClientRect().left > 0) {
        $id(`irf_${s}_add_word`).focus();
      } else if ($id(`irf_${s}_ta`).getBoundingClientRect().left > 0) {
        $id(`irf_${s}_ta`).focus();
      }
    }
  };

  const settingsMode = (s) => {
    const e = $id('irf_settings').getElementsByClassName('irf_advance');
    for (let i = 0, j = e.length; i < j; i++) {
      if (s === 'simple') e[i].classList.add('inoreader_filter_hide');
      else if (s === 'advance') e[i].classList.remove('inoreader_filter_hide');
    }
  };

  const viewSettings = () => {
    const se = $id('irf_settings');
    if (!se) return;
    if (se.style.display !== 'block') {
      setSettingsTab('ng');
      $id('irf_ng_add_bt').classList.add('inoreader_filter_hide');
      $id('irf_hi_add_bt').classList.add('inoreader_filter_hide');
      $id('irf_ng_fill_bt').classList.remove('inoreader_filter_hide');
      $id('irf_hi_fill_bt').classList.remove('inoreader_filter_hide');
      $id('irf_ng_cb').checked = st.ng;
      $id('irf_hi_cb').checked = st.hi;
      $id('irf_ad_cb').checked = st.ad;
      if (st.ng) $id('irf_ng_fs').removeAttribute('disabled');
      else $id('irf_ng_fs').setAttribute('disabled', '');
      if (st.hi) $id('irf_hi_fs').removeAttribute('disabled');
      else $id('irf_hi_fs').setAttribute('disabled', '');
      $id('irf_ng_add_word').value = '';
      $id('irf_hi_add_word').value = '';
      $id('irf_ng_add_feed').value = '';
      $id('irf_hi_add_feed').value = '';
      $id('irf_ng_add_title').value = '';
      $id('irf_hi_add_title').value = '';
      $id('irf_ng_ta').value = st.ngdata;
      $id('irf_hi_ta').value = st.hidata;
      $id('irf_ad_filter').value = st.adfilter;
      $id('irf_ad_sort_type')[Number(st.adsort)].selected = true;
      if (st.mode === 'simple') $id('irf_etc_mode-s').checked = true;
      else if (st.mode === 'advance') $id('irf_etc_mode-a').checked = true;
      $id('irf_etc_key_settings').value = st.keywindow;
      $id('irf_etc_delimiter').value = st.delimiter;
      $id('irf_etc_ngcount')[Number(st.ngcount)].selected = true;
      $id('irf_etc_log').checked = st.log;
      aAdTemp = null;
      createAdtable(st.adsort);
      settingsMode(st.mode);
      se.style.display = 'block';
      if ($id('irf_ng_add_word').getBoundingClientRect().left > 0) {
        $id('irf_ng_add_word').focus();
      } else if ($id('irf_ng_ta').getBoundingClientRect().left > 0) {
        $id('irf_ng_ta').focus();
      }
    } else {
      se.style.display = 'none';
      $id('irf_ok').removeAttribute('disabled');
    }
  };

  const loadSettings = () => {
    st = {};
    try {
      st = JSON.parse(localStorage.getItem('InoReaderFilter_settings')) || {};
    } catch (er) {
      if (st.log) console.log('loadSettings', er);
      alert('InoReaderFilter Error: Load Settings');
    }
    if (notType('Num', st.format)) st.format = 1;
    if (notType('Boo', st.ng)) st.ng = true;
    if (notType('Boo', st.hi)) st.hi = true;
    if (notType('Boo', st.ad)) st.ad = true;
    if (notType('Str', st.ngdata)) st.ngdata = '';
    if (notType('Str', st.hidata)) st.hidata = '';
    if (notType('Str', st.adfilter)) st.adfilter = reAd;
    if (notType('Num', st.adcount)) st.adcount = 0;
    if (notType('Num', st.adsort)) st.adsort = 0;
    if (notType('Str', st.mode)) st.mode = 'simple';
    if (notType('Str', st.keywindow)) st.keywindow = 'F';
    if (notType('Str', st.delimiter)) st.delimiter = '<>';
    if (notType('Num', st.ngcount)) st.ngcount = 0;
    if (notType('Boo', st.log)) st.log = false;
    convertRules();
  };

  const saveSettings = (flag) => {
    try {
      localStorage.setItem('InoReaderFilter_settings', JSON.stringify(st));
    } catch (er) {
      if (st.log) console.log('saveSettings', er);
      alert('InoReaderFilter Error: Save Settings');
    }
    if (!flag) convertRules();
  };

  const loadAddata = () => {
    try {
      aAd = JSON.parse(localStorage.getItem('InoReaderFilter_addata')) || [];
    } catch (er) {
      if (st.log) console.log('loadAddata', er);
      alert('InoReaderFilter Error: Load AdData');
    }
  };

  const saveAddata = (a) => {
    if (aAdTemp) {
      aAd = aAdTemp.concat();
      aAdTemp = null;
    }
    try {
      localStorage.setItem('InoReaderFilter_addata', JSON.stringify(a));
    } catch (er) {
      if (st.log) console.log('saveAddata', er);
      alert('InoReaderFilter Error: Save AdData');
    }
    loadAddata();
  };

  const init = () => {
    if (!target) return;
    getAppVersion();
    loadSettings();
    loadAddata();
    let CSS =
      '#unread_cnt_top:after { content: attr(data-irf_ngcount); margin-left: 2px; opacity: 0.75; }' +
      '.inoreader_filter_highlight span[id^="at_"], .inoreader_filter_highlight a[id^="article_title_link_"], .inoreader_filter_highlight .article_title_link, .inoreader_filter_highlight.article_unreaded .article_header_title, .inoreader_filter_highlight.article_tile.article_unreaded .article_title_link, .inoreader_filter_highlight.article_unreaded .article_magazine_title_link { color: #B65F06; }' +
      '.high_contrast .inoreader_filter_highlight span[id^="at_"], .high_contrast .inoreader_filter_highlight a[id^="article_title_link_"], .high_contrast .inoreader_filter_highlight .article_title_link, .high_contrast .inoreader_filter_highlight.article_unreaded .article_header_title, .high_contrast .inoreader_filter_highlight.article_tile.article_unreaded .article_title_link, .high_contrast .inoreader_filter_highlight.article_unreaded .article_magazine_title_link { color: #D66F16; }' +
      '.inoreader_filter_hide { display: none; }' +
      '#irf_settings { display: none; color: black; padding: 0; position: absolute; top: 48px; left: 48px; z-index: 90300; background: rgba(255, 255, 255, 0.98); border: 1px solid #999999; border-radius: 4px; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); min-width: 20em; -moz-user-select: none; -webkit-user-select: none; font-size: 13px; position: fixed; }' +
      '#irf_settings input[type="text"], #irf_settings textarea { padding: 0 2px; }' +
      '#irf_settings input[type="button"] { font-size: 90%; height: 2em; }' +
      '#irf_settings input[type=checkbox] { position: static; opacity: 1; pointer-events: auto; }' +
      '#irf_settings select { font-size: 100%; padding: 1px 2px; }' +
      '#irf_settings fieldset { border: 1px solid #CCCCCC }' +
      '#irf_settings fieldset, #irf_settings input[type="text"], #irf_settings input[type="number"], #irf_settings textarea { color: black; background-color: transparent; }' +
      '#irf_settings legend { font-size: 13px; margin: 0; }' +
      '#irf_titlebar { background-color: #666666; border-radius: 4px 4px 0 0; padding: 2px 0 0 4px; height: 2em; }' +
      '#irf_title a { font-weight: bold; color: white; text-decoration: none; }' +
      '#irf_title a:hover { color: #FF9; }' +
      '#irf_title_btn { position: absolute; top: 2px; right: 4px; }' +
      '#irf_desc { padding: 0 0.5em; margin: 0.5em 0 1em 0; }' +
      '#irf_tab { padding: 0 0.5em; margin-top: 1em; }' +
      '#irf_tab span { background-color: #E9E9E9; background-image: -webkit-linear-gradient(#F9F9F9, #E9E9E9); background-image: linear-gradient(#F9F9F9, #E9E9E9); border: 1px solid #999999; padding: 3px 16px; border-radius: 4px 4px 0 0; cursor: pointer; }' +
      '#irf_tab span:hover { background-color: #F3F3F3; }' +
      '#irf_tab .irf_tab_selected, #irf_tab .irf_tab_selected:hover { background-color: #FFFFFF; background-image: none; border-bottom-color: #FFFFFF; }' +
      '#irf_form { padding: 8px 4px 4px 4px; border-top: 1px solid #999999; margin-top: 2px; }' +
      '#irf_form input[type="checkbox"], #irf_form input[type="radio"] { vertical-align: inherit; }' +
      '#irf_form input[type="checkbox"] { margin: 2px 4px 2px 0; }' +
      '#irf_form label { vertical-align: top; }' +
      '#irf_form textarea { margin: 0; width: 100%; height: 200px; }' +
      '#irf_form input, #irf_form textarea { color: black; }' +
      '#irf_form fieldset { padding: 4px; margin: 0 0 0.5em 0; border-color: #999; min-width: 490px; }' +
      '#irf_form fieldset:disabled > label { color: gray; }' +
      '#irf_form fieldset:disabled input, #irf_form fieldset:disabled textarea { color: #666666; background-color: #EEEEEE; }' +
      '#irf_form fieldset + fieldset { margin: 0.5em auto; }' +
      '#irf_form_hi, #irf_form_ad, #irf_form_etc { display: none; }' +
      '#irf_form_etc input[type="checkbox"] { margin: 2px 4px 2px 2px; }' +
      '.irf_form_add-row-button { text-align: right; }' +
      '.irf_form_add-row-input + .irf_form_add-row-caption, .irf_form_add-row-input + .irf_form_add-row-button { margin-top: 0.5em; }' +
      '.irf_form_add-row-textarea { margin-top: 1em; }' +
      '.inoreader_filter_hide + .irf_form_add-row-textarea { margin-top: 0; }' +
      '.irf_form_add-input { width: 95%; }' +
      '.irf_form_add-button:active { position:relative; top:1px; }' +
      '.irf_table_wrapper { max-height: 400px; overflow-y: scroll; }' +
      '.irf_table { display: table; width: 100%; }' +
      '.irf_tr { display: table-row; border: 1px solid red; }' +
      '.irf_tr:hover div { background-color: #EFEFEF; }' +
      '#irf_ad_sort { margin-left: 2em; font-weight: normal; }' +
      '#irf_ad_sort_type { padding: 0; margin-top: -4px; }' +
      '.irf_ad_td1, .irf_ad_td2 { display: table-cell; padding: 4px 2px; }' +
      '.irf_ad_td1 { max-width: 50em; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }' +
      '.irf_ad_td2 { width: 5em; }' +
      '.irf_ad_td2 input { width: 4.8em; }' +
      '#irf_etc_key_settings { width: 7ex; text-align: center; margin: 0 0.5em; }' +
      '#irf_ok { margin-right: 0.5em; padding: 0 2em; }' +
      '#irf_cancel { padding: 0 1ex; }' +
      '#irf_ok, #irf_cancel { width: 8em; }' +
      '.irf_form_add-button { width: 12em; }' +
      '#irf_form textarea, .irf_form_add-input { width: -moz-available; width: -webkit-fill-available; width: available; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; }';
    if ($id('sb_rp_settings_menu')) {
      CSS +=
        '.inoreader_filter_adarticle:before { font-family: "InoReader-UI-Icons-Font"; content: "\\e684"; padding-right: 5px; }';
    } else if ($id('read_articles_button')) {
      const img = $id('read_articles_button').firstChild;
      if (img && img.hasAttribute('src')) {
        CSS += `.inoreader_filter_adarticle:before { background: url("${img.getAttribute(
          'src'
        )}") no-repeat; content: " "; padding: 0 10px; }`;
      }
    }
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    const LOCALE_JA = {
      t00: '設定',
      t01: 'ＯＫ',
      t02: 'キャンセル',
      t03: 'ＮＧワード',
      t04: 'ハイライト',
      t05: '広告記事',
      t06: 'その他',
      t07: 'フィード・フォルダ・タグ',
      t08: '記事タイトル',
      t09: '記事タイトル・記事概要・記事URL',
      t10: '記事概要・記事URL',
      t11: 'ルールを追加',
      t12: '削除',
      t13: '設定モード',
      t14: 'シンプル',
      t15: 'アドバンス',
      t16: '区切り文字',
      t17: 'コンソールにログを表示',
      t18: '選択記事をフォームに記入',
      t19: '累計',
      t20: 'ソート',
      t21: 'タイトル',
      t22: '登録日時',
      t23: '昇順',
      t24: '降順',
      t25: '新しい順',
      t26: '古い順',
      t27: 'ショートカットキー',
      t28: '設定欄の開閉',
      t29: 'キー',
      t30: '消去した記事が多すぎるので、InoReader Filterは記事を消去する機能を一時的に無効化しました。NGワードの設定を確認して下さい。',
      t31: 'ルール',
      t32: '正規表現',
      t33: 'NG記事数',
      t34: '未読記事数の後にNG記事数を表示する',
      t35: '未読記事数からNG記事数を差し引く',
      t36: 'NG記事数は表示しない',
    };
    const LOCALE_EN = {
      t00: 'Settings',
      t01: 'OK',
      t02: 'Cancel',
      t03: 'Exclude words',
      t04: 'Highlight words',
      t05: 'Advertising articles',
      t06: 'Etc',
      t07: 'Feed, folder, tag',
      t08: 'Article title',
      t09: 'Article title, summary, url',
      t10: 'Article summary, url',
      t11: 'Add rule',
      t12: 'Remove',
      t13: 'Settings mode',
      t14: 'Simple',
      t15: 'Advanced',
      t16: 'Delimiter',
      t17: 'Logging to console',
      t18: 'Fill in the selected article',
      t19: 'cumulative total',
      t20: 'Sort by',
      t21: 'Title',
      t22: 'Registered date',
      t23: 'A-Z',
      t24: 'Z-A',
      t25: 'newest',
      t26: 'oldest',
      t27: 'Shortcut keys',
      t28: 'Open/close the settings',
      t29: 'key',
      t30: 'Articles that was removed is too many. InoReader Filter has temporarily disabled the ability to remove the articles. Please check the settings of the exclude words.',
      t31: 'Rule',
      t32: 'regular expression',
      t33: 'The number of remove articles',
      t34: 'Show the number of remove articles after the number of unread articles',
      t35: 'Subtracting the number of remove articles from the number of unread articles',
      t36: 'Do not show the number of remove articles',
    };
    LOC = /^ja$|^ja-jp$/i.test(window.navigator.language)
      ? LOCALE_JA
      : LOCALE_EN;

    const div = document.createElement('div');
    let html = `<div id="irf_titlebar"><div id="irf_title"><a href="https://greasyfork.org/scripts/895-inoreader-filter" target="_blank">InoReader Filter ${LOC.t00}</a></div><div id="irf_title_btn"><input id="irf_ok" type="button" value="${LOC.t01}" /><input id="irf_cancel" type="button" value="${LOC.t02}" /></div></div><div id="irf_tab"><span id="irf_tab_ng" class="irf_tab_selected">${LOC.t03}</span><span id="irf_tab_hi">${LOC.t04}</span><span id="irf_tab_ad" class="irf_advance">${LOC.t05}</span><span id="irf_tab_etc">${LOC.t06}</span></div><div id="irf_form">`;
    html += `<div id="irf_form_ng"><fieldset id="irf_ng_fs"><legend><label><input id="irf_ng_cb" type="checkbox" />${LOC.t03}</label></legend><div class="irf_advance"><div class="irf_form_add-row-caption">${LOC.t07} :</div><div class="irf_form_add-row-input"><input id="irf_ng_add_feed" class="irf_form_add-input" type="input" /></div><div class="irf_form_add-row-caption">${LOC.t08} :</div><div class="irf_form_add-row-input"><input id="irf_ng_add_title" class="irf_form_add-input" type="input" /></div><div id="irf_ng_add_word-caption" class="irf_form_add-row-caption">${LOC.t09} :</div><div class="irf_form_add-row-input"><input id="irf_ng_add_word" class="irf_form_add-input" type="input" /></div><div class="irf_form_add-row-button"><input id="irf_ng_fill_bt" class="irf_form_fill-button" value="${LOC.t18}" type="button" /><input id="irf_ng_add_bt" class="irf_form_add-button" value="${LOC.t11}" type="button" /></div></div><div class="irf_form_add-row-textarea"><textarea id="irf_ng_ta"></textarea></div></fieldset></div>`;
    html += `<div id="irf_form_hi"><fieldset id="irf_hi_fs"><legend><label><input id="irf_hi_cb" type="checkbox" />${LOC.t04}</label></legend><div class="irf_advance"><div class="irf_form_add-row-caption">${LOC.t07} :</div><div class="irf_form_add-row-input"><input id="irf_hi_add_feed" class="irf_form_add-input" type="input" /></div><div class="irf_form_add-row-caption">${LOC.t08} :</div><div class="irf_form_add-row-input"><input id="irf_hi_add_title" class="irf_form_add-input" type="input" /></div><div id="irf_hi_add_word-caption" class="irf_form_add-row-caption">${LOC.t09} :</div><div class="irf_form_add-row-input"><input id="irf_hi_add_word" class="irf_form_add-input" type="input" /></div><div class="irf_form_add-row-button"><input id="irf_hi_fill_bt" class="irf_form_fill-button" value="${LOC.t18}" type="button" /><input id="irf_hi_add_bt" class="irf_form_add-button" value="${LOC.t11}" type="button" /></div></div><div class="irf_form_add-row-textarea"><textarea id="irf_hi_ta"></textarea></div></fieldset></div>`;
    html += `<div id="irf_form_ad" class="irf_advance"><fieldset id="irf_ad_filter_fs"><legend>${LOC.t31} (${LOC.t32})</legend><input id="irf_ad_filter" class="irf_form_add-input" type="text"></fieldset><fieldset id="irf_ad_fs"><legend id="irf_ad_legend" title="${LOC.t19} : ${st.adcount}"><label><input id="irf_ad_cb" type="checkbox" />${LOC.t05}</label><span id="irf_ad_sort">( ${LOC.t20} : <select id="irf_ad_sort_type"><option value="0">${LOC.t21} ( ${LOC.t23} )</option><option value="1">${LOC.t21} ( ${LOC.t24} )</option><option value="2">${LOC.t22} ( ${LOC.t25} )</option><option value="3">${LOC.t22} ( ${LOC.t26} )</option></select> )</span></legend><div id="irf_ad_table_wrapper" class="irf_table_wrapper"><div id="irf_ad_table" class="irf_table"></div></div></fieldset></div>`;
    html += `<div id="irf_form_etc"><fieldset id="irf_etc_mode_fs"><legend>${LOC.t13}</legend><label><input id="irf_etc_mode-s" name="irf_etc_mode_r" type="radio" value="simple" />${LOC.t14}</label><label><input id="irf_etc_mode-a" name="irf_etc_mode_r" type="radio" value="advance" />${LOC.t15}</label></fieldset><div class="irf_advance"><fieldset><legend>${LOC.t27}</legend><label>${LOC.t28} : Ctrl+Shift+<input id="irf_etc_key_settings" type="text" maxlength="1" />${LOC.t29}</label></fieldset><fieldset id="irf_etc_delimiter_fs"><legend>${LOC.t16}</legend><input id="irf_etc_delimiter" type="input" /></fieldset><fieldset><legend>${LOC.t33}</legend><select id="irf_etc_ngcount"><option value="0">${LOC.t34}</option><option value="1">${LOC.t35}</option><option value="2">${LOC.t36}</option></select></fieldset><label><input id="irf_etc_log" type="checkbox">${LOC.t17}</label></div></div>`;
    html += '</div>';
    div.innerHTML = html;
    div.id = 'irf_settings';
    document.body.appendChild(div);

    for (let i = 0, a; i < aAd.length; i++) {
      if (!aAd[i] || notType('Str', aAd[i]) || aAd[i].indexOf('<>') === -1) {
        continue;
      }
      a = aAd[i].slice(aAd[i].lastIndexOf('<>') + 2).split('@');
      if (
        a.length === 2 &&
        Date.now() > new Date(Number(a[0]) + 86400000 * 60).getTime()
      ) {
        if (st.log) {
          console.log(
            'unregister ad: ',
            aAd[i].slice(0, aAd[i].lastIndexOf('<>'))
          );
        }
        aAd.splice(i, 1);
      }
    }
    saveAddata(aAd);

    const addRule = (f, t, w) => {
      let word = '';
      if (f) {
        word = f + st.delimiter;
        if (t) {
          word += t + st.delimiter;
          if (w) word += w;
        } else if (w) word += st.delimiter + w;
      } else if (t) {
        word = st.delimiter + t + st.delimiter;
        if (w) word += w;
      } else if (w) word = w;
      return `${word}\n`;
    };

    const clickAddButton = (s) => {
      const sF = $id(`irf_${s}_add_feed`).value,
        sT = $id(`irf_${s}_add_title`).value,
        sW = $id(`irf_${s}_add_word`).value;
      if (!sT && !sW) return;
      const sData = $id(`irf_${s}_ta`).value,
        sRule = addRule(sF, sT, sW);
      if (sData.indexOf(sRule) === -1) {
        $id(`irf_${s}_ta`).value +=
          !sData || /(?:\r\n|\n|\r)$/.test(sData) ? sRule : `\n${sRule}`;
      }
      $id(`irf_${s}_add_feed`).value = '';
      $id(`irf_${s}_add_title`).value = '';
      $id(`irf_${s}_add_word`).value = '';
      $id(`irf_${s}_add_word-caption`).textContent = `${LOC.t09} :`;
      if (s === 'ng') {
        $id('irf_ng_add_bt').classList.add('inoreader_filter_hide');
        $id('irf_ng_fill_bt').classList.remove('inoreader_filter_hide');
      } else if (s === 'hi') {
        $id('irf_hi_add_bt').classList.add('inoreader_filter_hide');
        $id('irf_hi_fill_bt').classList.remove('inoreader_filter_hide');
      }
    };

    const checkAd = () => {
      if (!target) return;
      const eAc = currentExpandedArticle();
      if (!eAc.length) return;
      const sId = eAc[0].id
        ? eAc[0].id.slice(eAc[0].id.lastIndexOf('_') + 1)
        : '';
      if (!sId) return;
      const eTitle = $id(`at_${sId}`) || $id(`article_title_link_${sId}`),
        sTitle = eTitle ? eTitle.textContent : '';
      let bUnregistered = true;
      if (!sTitle) return;
      for (let i = 0, j = aAd.length; i < j; i++) {
        if (!aAd[i] || notType('Str', aAd[i]) || aAd[i].indexOf('<>') === -1) {
          continue;
        }
        if (sTitle === aAd[i].slice(0, aAd[i].lastIndexOf('<>'))) {
          bUnregistered = false;
          break;
        }
      }
      if (bUnregistered && new RegExp(st.adfilter, 'im').test(sTitle)) {
        aAd.push(`${sTitle}<>${Date.now()}@1`);
        aAd.sort((a, b) => {
          return a - b;
        });
        if ($id(`at_${sId}`)) {
          $id(`at_${sId}`).classList.add('inoreader_filter_adarticle');
        }
        if ($id(`article_title_link_${sId}`)) {
          $id(`article_title_link_${sId}`).classList.add(
            'inoreader_filter_adarticle'
          );
        }
        if (st.log) console.log('register ad: ', sTitle);
        saveAddata(aAd);
        st.adcount += 1;
        saveSettings(true);
        $id('irf_ad_legend').setAttribute(
          'title',
          `${LOC.t19} : ${st.adcount}`
        );
        changedArticles();
      }
    };

    const escRe = (s) => s.replace(/[.+^=!:${}()|[\]/\\]/g, '\\$&');

    $id('irf_settings').addEventListener(
      'click',
      (e) => {
        const tId = e.target.id;
        if (!tId) return;
        if (
          e.target.nodeName === 'INPUT' &&
          e.target.getAttribute('type') === 'button'
        ) {
          e.target.blur();
        }
        if (tId === 'irf_ok') {
          let problem = false;
          const adfilter = $id('irf_ad_filter').value,
            delim = $id('irf_etc_delimiter').value,
            keyWin = $id('irf_etc_key_settings').value;
          st.ng = $id('irf_ng_cb').checked;
          st.ngdata = $id('irf_ng_ta').value;
          st.hi = $id('irf_hi_cb').checked;
          st.hidata = $id('irf_hi_ta').value;
          st.ad = $id('irf_ad_cb').checked;
          st.adfilter = adfilter ? adfilter : reAd;
          st.adsort = $id('irf_ad_sort_type').selectedIndex;
          st.ngcount = $id('irf_etc_ngcount').selectedIndex;
          if ($id('irf_etc_mode-s').checked) st.mode = 'simple';
          else if ($id('irf_etc_mode-a').checked) st.mode = 'advance';
          if (keyWin.length === 1) {
            if (/^[A-Za-z0-9]$/.test(keyWin)) {
              st.keywindow = keyWin.toUpperCase();
            } else {
              problem = true;
              setSettingsTab('etc');
              $id('irf_etc_key_settings').focus();
            }
          } else {
            $id('irf_etc_key_settings').value = 'F';
            st.keywindow = 'F';
          }
          if (delim) {
            if (/[.+^=!:${}()|[\]/\\]/.test(delim)) {
              problem = true;
              setSettingsTab('etc');
              $id('irf_etc_delimiter').focus();
            } else st.delimiter = $id('irf_etc_delimiter').value;
          } else st.delimiter = '<>';
          st.log = $id('irf_etc_log').checked;
          if (!problem) {
            viewSettings();
            saveSettings();
            saveAddata(aAdTemp ? aAdTemp : aAd);
          }
        } else if (tId === 'irf_cancel') {
          viewSettings();
        } else if (tId.indexOf('irf_tab_') !== -1) {
          const sId = tId.slice(tId.indexOf('irf_tab_') + 8);
          if (sId) setSettingsTab(sId);
        } else if (tId.indexOf('irf_etc_mode-') !== -1) {
          if (tId === 'irf_etc_mode-s') settingsMode('simple');
          else if (tId === 'irf_etc_mode-a') settingsMode('advance');
        } else if (/^irf_(?:ng|hi)_fill_bt$/.test(tId)) {
          const eAc = currentArticle(),
            sT = currentTreeName();
          let sF = '',
            sW = '';
          if (!eAc.length) return;
          const oA = articleData(eAc[0]);
          if (sT && oA.sFeed && sT !== oA.sFeed) {
            sF = `/^${escRe(sT)}$|^${escRe(oA.sFeed)}$/`;
          } else if (sT) sF = sT;
          else if (oA.sFeed) sF = oA.sFeed;
          if (oA.sDesc) {
            sW = `/^${escRe(oA.sDesc)}$|^${escRe(oA.sUrl)}$/`;
          } else sW = oA.sUrl;
          if (tId === 'irf_ng_fill_bt') {
            $id('irf_ng_add_feed').value = sF;
            $id('irf_ng_add_title').value = oA.sTitle;
            $id('irf_ng_add_word').value = sW;
            $id('irf_ng_add_bt').classList.remove('inoreader_filter_hide');
            $id('irf_ng_fill_bt').classList.add('inoreader_filter_hide');
          } else if (tId === 'irf_hi_fill_bt') {
            $id('irf_hi_add_feed').value = sF;
            $id('irf_hi_add_title').value = oA.sTitle;
            $id('irf_hi_add_word').value = sW;
            $id('irf_hi_add_bt').classList.remove('inoreader_filter_hide');
            $id('irf_hi_fill_bt').classList.add('inoreader_filter_hide');
          }
        } else if (tId === 'irf_ng_add_bt') {
          clickAddButton('ng');
        } else if (tId === 'irf_hi_add_bt') {
          clickAddButton('hi');
        } else if (/^irf_ad_switch_|^irf_ad_remove_/.test(tId)) {
          if (!aAdTemp) aAdTemp = aAd.concat();
          for (let i = 0, j = aAdTemp.length, a, d; i < j; i++) {
            if (
              !aAdTemp[i] ||
              notType('Str', aAdTemp[i]) ||
              aAdTemp[i].indexOf('<>') === -1
            ) {
              continue;
            }
            a = aAdTemp[i].slice(aAdTemp[i].lastIndexOf('<>') + 2).split('@');
            d = a.length === 2 && Number(a[0]) >= 0 ? a[0] : '';
            if (d && tId.slice(14) === d) {
              if (/^irf_ad_switch_/.test(tId)) {
                aAdTemp[i] = aAdTemp[i].replace(
                  /@\d$/,
                  `@${a[1] === '1' ? '0' : '1'}`
                );
              } else if (/^irf_ad_remove_/.test(tId)) {
                aAdTemp.splice(i, 1);
              }
              createAdtable($id('irf_ad_sort_type').selectedIndex, true);
              break;
            }
          }
        }
      },
      false
    );

    $id('irf_ng_cb').addEventListener(
      'click',
      (e) => {
        if (e.target.checked) $id('irf_ng_fs').removeAttribute('disabled');
        else $id('irf_ng_fs').setAttribute('disabled', '');
      },
      false
    );

    $id('irf_hi_cb').addEventListener(
      'click',
      (e) => {
        if (e.target.checked) $id('irf_hi_fs').removeAttribute('disabled');
        else $id('irf_hi_fs').setAttribute('disabled', '');
      },
      false
    );

    $id('irf_titlebar').addEventListener(
      'dblclick',
      (e) => {
        if (e.target.nodeName === 'DIV') {
          $id('irf_tab').classList.toggle('inoreader_filter_hide');
          $id('irf_form').classList.toggle('inoreader_filter_hide');
          $id('irf_title_btn').classList.toggle('inoreader_filter_hide');
        }
      },
      false
    );

    $id('irf_settings').addEventListener(
      'input',
      (e) => {
        if (e.target.id === 'irf_ng_add_title') {
          if (e.target.value) {
            $id('irf_ng_add_word-caption').textContent = `${LOC.t10} :`;
          } else $id('irf_ng_add_word-caption').textContent = `${LOC.t09} :`;
        } else if (e.target.id === 'irf_hi_add_title') {
          if (e.target.value) {
            $id('irf_hi_add_word-caption').textContent = `${LOC.t10} :`;
          } else $id('irf_hi_add_word-caption').textContent = `${LOC.t09} :`;
        }
        if ($id('irf_tab_ng').classList.contains('irf_tab_selected')) {
          if (
            $id('irf_ng_add_feed').value ||
            $id('irf_ng_add_title').value ||
            $id('irf_ng_add_word').value
          ) {
            $id('irf_ng_add_bt').classList.remove('inoreader_filter_hide');
            $id('irf_ng_fill_bt').classList.add('inoreader_filter_hide');
          } else {
            $id('irf_ng_add_bt').classList.add('inoreader_filter_hide');
            $id('irf_ng_fill_bt').classList.remove('inoreader_filter_hide');
          }
        } else if ($id('irf_tab_hi').classList.contains('irf_tab_selected')) {
          if (
            $id('irf_hi_add_feed').value ||
            $id('irf_hi_add_title').value ||
            $id('irf_hi_add_word').value
          ) {
            $id('irf_hi_add_bt').classList.remove('inoreader_filter_hide');
            $id('irf_hi_fill_bt').classList.add('inoreader_filter_hide');
          } else {
            $id('irf_hi_add_bt').classList.add('inoreader_filter_hide');
            $id('irf_hi_fill_bt').classList.remove('inoreader_filter_hide');
          }
        }
      },
      false
    );

    $id('irf_ad_sort_type').addEventListener(
      'change',
      () => {
        createAdtable($id('irf_ad_sort_type').selectedIndex);
      },
      false
    );

    $id('reader_pane').addEventListener(
      'click',
      () => {
        checkAd();
      },
      true
    );

    document.addEventListener(
      'keyup',
      (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === st.keywindow) {
          viewSettings();
        } else if (/input|textarea/i.test(e.target.tagName)) return;
        checkAd();
      },
      true
    );
    try {
      GM_registerMenuCommand(`${LOC.t00}`, () => viewSettings());
    } catch (e) {
      if (st.log) console.log('GM_registerMenuCommand', e);
    }

    changedArticles();
    changedNumberOfUnreadArticles();
    observer1.observe(target, config);
    if (appVersion < 14) {
      observer2.observe($id('unread_cnt_top'), config);
    } else {
      observer2.observe($id('header_pane'), config2);
    }
  };

  const initInterval = window.setInterval(() => {
    const tree = $id('tree');
    if (/ino\s?reader/i.test(document.title) && tree?.innerHTML) {
      window.clearInterval(initInterval);
      window.setTimeout(() => init(), 1000);
    }
  }, 500);
})();
