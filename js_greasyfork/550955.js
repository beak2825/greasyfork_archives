// ==UserScript==
// @name         NodeSeek <-> DeepFlood 联合访问
// @namespace    http://tampermonkey.net/
// @license      AGPL-3.0
// @version      2025-10-19
// @description  Visit nodeseek.com and deepflood.com at the same time and push hot posts
// @author       xykt
// @match        https://nodeseek.com/
// @match        https://www.nodeseek.com/
// @match        https://nodeseek.com/page-*
// @match        https://www.nodeseek.com/page-*
// @match        https://nodeseek.com/search?*
// @match        https://www.nodeseek.com/search?*
// @match        https://deepflood.com/
// @match        https://www.deepflood.com/
// @match        https://deepflood.com/page-*
// @match        https://www.deepflood.com/page-*
// @match        https://deepflood.com/search?*
// @match        https://www.deepflood.com/search?*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      nodeseek.com
// @connect      www.nodeseek.com
// @connect      deepflood.com
// @connect      www.deepflood.com
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550955/NodeSeek%20%3C-%3E%20DeepFlood%20%E8%81%94%E5%90%88%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/550955/NodeSeek%20%3C-%3E%20DeepFlood%20%E8%81%94%E5%90%88%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==
(function() {
  'use strict';
  const host = location.hostname.replace(/^www\./, '');
  const A = host;
  const B = A === 'nodeseek.com' ? 'deepflood.com' : 'nodeseek.com';
  const scheme = location.protocol;
  const baseA = scheme + '//' + A;
  const baseB = 'https://' + B;
  let NameA, NameB;
  if (A === 'nodeseek.com') {
    NameA = 'NodeSeek';
    NameB = 'DeepFlood';
  } else {
    NameA = 'DeepFlood';
    NameB = 'NodeSeek';
  }
  const pathMatch = location.pathname.match(/^\/(page-\d+)?\/?$/);
  let currentPath = null;
  if (pathMatch) {
    currentPath = pathMatch[1] ? '/' + pathMatch[1] : '/';
  } else if (location.pathname.startsWith('/search')) {
    currentPath = location.pathname + location.search;
  } else {
    return;
  }
  document.documentElement.style.visibility = 'hidden';
  function parseHTML(html) {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }
  function isRelative(url) {
    if (!url || typeof url !== 'string') return false;
    url = url.trim();
    const lower = url.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('//') ||
        lower.startsWith('mailto:') || lower.startsWith('tel:') || lower.startsWith('#') ||
        lower.startsWith('data:') ) {
      return false;
    }
    return true;
  }
  function absolutizeUrl(url, base) {
    if (!url) return url;
    if (!isRelative(url)) return url;
    if (url.startsWith('/')) return base + url;
    return base + '/' + url;
  }
  function convertRelativePaths(doc, base) {
    const attrList = ['href','src','action','poster','data-src','data-href'];
    attrList.forEach(attr => {
      doc.querySelectorAll('['+attr+']').forEach(el => {
        const val = el.getAttribute(attr);
        if (isRelative(val)) el.setAttribute(attr, absolutizeUrl(val, base));
      });
    });
    doc.querySelectorAll('[srcset]').forEach(el => {
      const ss = el.getAttribute('srcset') || '';
      const parts = ss.split(',').map(p => {
        const seg = p.trim();
        const spaceIdx = seg.indexOf(' ');
        if (spaceIdx === -1) {
          return isRelative(seg) ? absolutizeUrl(seg, base) : seg;
        } else {
          const u = seg.slice(0, spaceIdx);
          const rest = seg.slice(spaceIdx+1);
          return (isRelative(u) ? absolutizeUrl(u, base) : u) + ' ' + rest;
        }
      });
      el.setAttribute('srcset', parts.join(', '));
    });
    doc.querySelectorAll('[style]').forEach(el => {
      let s = el.getAttribute('style');
      if (!s) return;
      s = s.replace(/url\((['"]?)(?!https?:|\/\/|data:|#)([^'")]+)\1\)/g,
        (m, q, p1) => 'url(' + absolutizeUrl(p1, base) + ')');
      el.setAttribute('style', s);
    });
    doc.querySelectorAll('style').forEach(st => {
      let txt = st.textContent;
      if (!txt) return;
      txt = txt.replace(/url\((['"]?)(?!https?:|\/\/|data:|#)([^'")]+)\1\)/g,
        (m, q, p1) => 'url(' + absolutizeUrl(p1, base) + ')');
      st.textContent = txt;
    });
    return doc;
  }
  function getCurrentDataVAttr() {
    const container = document.getElementById('nsk-right-panel-container');
    if (container) {
      const el = container.querySelector('.user-card') || container.querySelector('[class*="user-card"]');
      if (el) {
        for (let i = 0; i < el.attributes.length; i++) {
          const name = el.attributes[i].name;
          if (name.startsWith('data-v-')) return name;
        }
      }
    }
    return 'data-v-9796effc';
  }
  function fetchBAndMerge() {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://' + B + currentPath,
      responseType: 'text',
      onload: function(res) {
        if (res.status >= 200 && res.status < 400 && res.responseText) {
          try {
            const docB = parseHTML(res.responseText);
            convertRelativePaths(docB, baseB);
            function doMerge() {
              try {
                const headA = document.querySelector('div#nsk-head.nsk-container, div#nsk-head');
                if (headA) {
                  const strong = headA.querySelector('strong.site-title');
                  let newInner = '';
                  if (A === 'nodeseek.com') {
                    newInner = `
<a href="https://nodeseek.com/"><img src="https://nodeseek.com/static/image/favicon/android-chrome-192x192.png" alt="logo" style="max-height: 36px;vertical-align: middle;"> <span class="title-text" style="vertical-align: middle;">NodeSeek</span><span class="beta-icon">beta</span></a>
<span class="title-text" style="vertical-align: middle;">+</span>
<a href="https://deepflood.com/"><span class="title-text" style="vertical-align: middle;"><span style="color:#0084ff">Deep</span><span style="color:#00a3a3">Flood</span></span><span class="beta-icon">beta</span></a>`;
                  } else {
                    newInner = `
<a href="https://deepflood.com/"><span class="title-text" style="vertical-align: middle;"><span style="color:#0084ff">Deep</span><span style="color:#00a3a3">Flood</span></span><span class="beta-icon">beta</span></a>
<span class="title-text" style="vertical-align: middle;">+</span>
<a href="https://nodeseek.com/"><img src="https://nodeseek.com/static/image/favicon/android-chrome-192x192.png" alt="logo" style="max-height: 36px;vertical-align: middle;"> <span class="title-text" style="vertical-align: middle;">NodeSeek</span><span class="beta-icon">beta</span></a>`;
                  }
                  if (strong) strong.innerHTML = newInner;
                }
                const secA = document.querySelectorAll(".nsk-panel.category-list")[0];
                const secB = docB.querySelectorAll(".nsk-panel.category-list")[0];
                if (secA && secB) {
                  secA.style.lineHeight = "0";
                  secA.style.padding = "0";
                  secB.style.lineHeight = "0";
                  secB.style.padding = "0";
                  secA.insertAdjacentHTML("afterend", secB.outerHTML);
                }
                const head = document.querySelector('#nsk-head.nsk-container');
                if (!head) return;
                const navMenu = head.querySelector('ul.nav-menu');
                if (navMenu) {
                  navMenu.innerHTML = '';
                }
                (function handlePostList(docA, docB, site) {
                  const listA = Array.from(docA.querySelectorAll('ul.post-list > li.post-list-item:not([class*="topic-carousel"])'));
                  const listB = Array.from(docB.querySelectorAll('ul.post-list > li.post-list-item:not([class*="topic-carousel"])'));
                  const icons = {
                    nodeseek: `<span class="info-item info-site"><img src="https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png" width="12" height="12"></span> `,
                    deepflood: `<span class="info-item info-site"><img src="https://www.deepflood.com/static/image/favicon/android-chrome-192x192.png" width="12" height="12"></span>`
                  };
                  const siteShort = (typeof site === 'string' && site.indexOf('nodeseek') !== -1) ? 'nodeseek' : 'deepflood';
                  const siteOther = siteShort === 'nodeseek' ? 'deepflood' : 'nodeseek';
                  function markSite(posts, siteFrom) {
                    posts.forEach(li => {
                      const info = li.querySelector(".post-info");
                      if (info) {
                        if (!info.querySelector('.info-item.info-site')) {
                          info.insertAdjacentHTML("afterbegin", icons[siteFrom]);
                        }
                      }
                    });
                  }
                  markSite(listA, siteShort);
                  markSite(listB, siteOther);
                  let openInNewTab = false;
                  const firstLinkA = listA[0]?.querySelector('.post-title a');
                  if (firstLinkA && firstLinkA.hasAttribute('target') && firstLinkA.getAttribute('target') === '_blank') {
                    openInNewTab = true;
                  }
                  listB.forEach(li => {
                    const link = li.querySelector('.post-title a');
                    if (!link) return;
                    if (openInNewTab) {
                      link.setAttribute('target', '_blank');
                    } else {
                      link.removeAttribute('target');
                    }
                  });
                  let allPosts = [...listA, ...listB];
                  function parsePost(li) {
                    let timeTitle = "";
                    const timeEl = li.querySelector(".post-info time[title]");
                    if (timeEl) timeTitle = timeEl.getAttribute("title") || "";
                    let time = 0;
                    if (timeTitle) {
                      const parsed = Date.parse(timeTitle);
                      time = isNaN(parsed) ? (new Date(timeTitle)).getTime() || 0 : parsed;
                    }
                    let views = 0;
                    const viewsSpan = li.querySelector(".post-info .info-views span[title], .post-info .info-views span");
                    if (viewsSpan) {
                      const vt = viewsSpan.getAttribute("title") || viewsSpan.textContent || "";
                      const m = vt.match(/(\d[\d,]*)/);
                      if (m) views = parseInt(m[1].replace(/,/g, ''), 10) || 0;
                    }
                    let comments = 0;
                    const commentsSpan = li.querySelector(".post-info .info-comments-count span[title], .post-info .info-comments-count span");
                    if (commentsSpan) {
                      const ct = commentsSpan.getAttribute("title") || commentsSpan.textContent || "";
                      const m2 = ct.match(/(\d[\d,]*)/);
                      if (m2) comments = parseInt(m2[1].replace(/,/g, ''), 10) || 0;
                    }
                    const sticky = !!li.querySelector('use[href="#pin"], use[href="#pin"]');

                    return {
                      el: li,
                      time: time || 0,
                      weight: (views || 0) + (comments || 0) * 5,
                      sticky: !!sticky
                    };
                  }
                  let postsData = allPosts.map(parsePost);
                  let stickyPosts = postsData.filter(p => p.sticky).sort((a, b) => b.time - a.time);
                  let normalPosts = postsData.filter(p => !p.sticky);
                  normalPosts.sort((a, b) => b.weight - a.weight);
                  let hotPosts = normalPosts.slice(0, 5);
                  hotPosts.forEach(p => {
                    const info = p.el.querySelector(".post-info");
                    if (info) {
                      if (!info.querySelector('.info-item.info-hot')) {
                        info.insertAdjacentHTML("beforeend", `<span class="info-item info-hot"><svg class="iconpark-icon"><use href="#rocket" style="color: red;"></use></svg><a style="color: red;"> 热帖</a></span>`);
                      }
                    }
                  });
                  let otherPosts = normalPosts.slice(5).sort((a, b) => b.time - a.time);
                  let finalPosts = [...stickyPosts, ...hotPosts, ...otherPosts];
                  const postListA = docA.querySelector('ul.post-list:not([class*="topic-carousel"])');
                  if (postListA) {
                    postListA.innerHTML = "";
                    finalPosts.forEach(p => {
                      const nodeToInsert = (p.el.ownerDocument === document) ? p.el.cloneNode(true) : document.importNode(p.el, true);
                      postListA.appendChild(nodeToInsert);
                    });
                  }
                })(document, docB, A);
const dataVAttr = getCurrentDataVAttr();
const userCard = document.querySelector(`div[${dataVAttr}].user-card, div.user-card[${dataVAttr}]`) || document.querySelector('div.user-card') || null;
                if (userCard) {
                  let newUserHtml = '';
                  newUserHtml = `<div><a href="/new-discussion" class="btn new-discussion"><svg class="iconpark-icon"><use href="#plus-cross-725o7jdo"></use></svg> <span style="vertical-align: middle;">${NameA}发帖</span></a></div>`;
                  const nextDiv = userCard.nextElementSibling;
                  if (nextDiv && nextDiv.tagName.toLowerCase() === 'div') {
                    nextDiv.innerHTML = newUserHtml;
                  }
                }
                (function handleUserConfig(docB) {
                  try {
                    const dataVAttr = getCurrentDataVAttr();
                    const tempScript = docB.querySelector('#temp-script[type="application/json"]');
                    let insertTarget = document.querySelector('#nsk-right-panel-container > div:nth-of-type(2)');
                    const container = document.querySelector('#nsk-right-panel-container .nsk-panel h4');
                    if (container && container.textContent.trim() === '你好啊，陌生人!') {
                      container.innerHTML =
                        '<img src="/static/image/favicon/android-chrome-192x192.png" width="16" height="16"> ' +
                        container.textContent.trim();
                      insertTarget = document.querySelector('#nsk-right-panel-container > div:nth-of-type(1)');
                    } else {
                      const userLink = document.querySelector(`a.Username[${dataVAttr}]`);
                      if (userLink) {
                        userLink.innerHTML =
                          `<img src="/static/image/favicon/android-chrome-192x192.png" width="16" height="16" style="vertical-align: middle;"> ` +
                          userLink.innerHTML;
                      }
                    }
                    if (tempScript) {
                      function b64DecodeUnicode(str) {
                        return decodeURIComponent(atob(str).split('').map(function (c) {
                          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                      }
                      const jsonText = tempScript.textContent;
                      if (jsonText) {
                        const config = JSON.parse(b64DecodeUnicode(jsonText));
                        const user = config.user;
                        if (insertTarget) {
                          let htmlToInsert = '';
                          if (!user) {
                            htmlToInsert = `
                              <div class="nsk-panel">
                                <h4><img src="${baseB}/static/image/favicon/android-chrome-192x192.png" width="16" height="16"> 你好啊，陌生人!</h4>
                                <div class="small-margin">我的朋友，看起来你是新来的，如果想参与到讨论中，点击下面的按钮！</div>
                                <div class="small-margin">
                                  <a href="${baseB}/signIn.html" rel="nofollow" class="btn" style="color:white;margin-right:5px;">登录</a>
                                  <a href="${baseB}/register.html" rel="nofollow" class="btn" style="color:white">注册</a>
                                </div>
                              </div>`;
                          } else {
                            // 这里等待两站同步星辰后删除，#optimize这里等待酒神同步icon后改为wallet
                            let userStatsBlock;
                            if (NameB === 'DeepFlood') {
                              userStatsBlock = `
                                <div ${dataVAttr}>
                                  <a ${dataVAttr} href="${baseB}/stardust/list?member_id=${user.member_id}">
                                    <svg ${dataVAttr} class="iconpark-icon">
                                      <use ${dataVAttr} href="#optimize"></use>
                                    </svg>
                                    <span ${dataVAttr}>星辰 ${user.stardust}</span>
                                  </a>
                                </div>
                              `;
                            } else {
                              userStatsBlock = `
                                <div ${dataVAttr}>
                                  <a ${dataVAttr} href="${baseB}/fans?type=follow">
                                    <svg ${dataVAttr} class="iconpark-icon">
                                      <use ${dataVAttr} href="#personal-collection"></use>
                                    </svg>
                                    <span ${dataVAttr}>关注 ${user.follows}</span>
                                  </a>
                                </div>
                              `;
                            }
                            const notifyHtml = user.unViewedCount && user.unViewedCount.all > 0
                              ? `<span ${dataVAttr} class="notify-count">${user.unViewedCount.all}</span>` : '0';
                            htmlToInsert = `
                              <div ${dataVAttr} class="user-card">
                                <div ${dataVAttr} class="user-head">
                                  <a ${dataVAttr} title="${user.member_name}" href="${baseB}/space/${user.member_id}">
                                    <img ${dataVAttr} src="${baseB}/avatar/${user.member_id}.png" alt="${user.member_name}" class="avatar-normal skeleton">
                                  </a>
                                  <div ${dataVAttr} class="menu">
                                    <img src="${baseB}/static/image/favicon/android-chrome-192x192.png" width="16" height="16" style="vertical-align: middle;">
                                    <a ${dataVAttr} href="${baseB}/space/${user.member_id}" class="Username">${user.member_name}</a>
                                    <div ${dataVAttr}>
                                      <a ${dataVAttr} href="${baseB}/board" title="签到"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#plan"></use></svg></a>
                                      <a ${dataVAttr} href="${baseB}/setting" title="设置"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#setting-two"></use></svg></a>
                                      <a ${dataVAttr} href="javascript:void(0)" title="切换主题模式"></a>
                                      <a ${dataVAttr} href="#" title="临时显示Block内容"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#vr-glasses"></use></svg></a>
                                      <a ${dataVAttr} href="${baseB}/api/account/signOut" title="登出"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#logout"></use></svg></a>
                                    </div>
                                  </div>
                                </div>
                                <div ${dataVAttr} class="user-stat">
                                  <div ${dataVAttr} class="stat-block">
                                    <div ${dataVAttr}><a ${dataVAttr} href="${baseB}/progress"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#level"></use></svg> <span ${dataVAttr}>等级 Lv ${user.rank}</span></a></div>
                                    <div ${dataVAttr}><a ${dataVAttr} href="${baseB}/credit"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#chicken-leg"></use></svg> <span ${dataVAttr}>鸡腿 ${user.coin}</span></a></div>
                                    ${userStatsBlock}
                                    <div ${dataVAttr}><a ${dataVAttr} href="${baseB}/notification"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#remind-6nce9p47"></use></svg> <span ${dataVAttr}>通知 </span>${notifyHtml}</a></div>
                                  </div>
                                  <div ${dataVAttr} class="stat-block">
                                    <div ${dataVAttr}><a ${dataVAttr} href="${baseB}/space/${user.member_id}#discussions"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#write-6ncdp62p"></use></svg> <span ${dataVAttr}>主题帖 ${user.nPost}</span></a></div>
                                    <div ${dataVAttr}><a ${dataVAttr} href="${baseB}/space/${user.member_id}#comments"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#comments-6ncdh3ka"></use></svg> <span ${dataVAttr}>评论数 ${user.nComment}</span></a></div>
                                    <div ${dataVAttr}><a ${dataVAttr} href="${baseB}/fans?type=fans"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#concern"></use></svg> <span ${dataVAttr}>粉丝 ${user.fans}</span></a></div>
                                    <div ${dataVAttr}><a ${dataVAttr} href="${baseB}/space/${user.member_id}#collections"><svg ${dataVAttr} class="iconpark-icon"><use ${dataVAttr} href="#folder-focus"></use></svg> <span ${dataVAttr}>收藏 ${user.collectionCount}</span></a></div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <a href="${baseB}/new-discussion" class="btn new-discussion"><svg class="iconpark-icon"><use href="#plus-cross-725o7jdo"></use></svg> <span style="vertical-align: middle;">${NameB}发帖</span></a>
                              </div>`;
                          }
                          insertTarget.insertAdjacentHTML('afterend', htmlToInsert);
                        }
                      }
                    }
                  } catch (e) {
                    console.error('解析window.__config__失败', e);
                  }
                })(docB);
                (function handleQuickAccess(docA, docB) {
                  try {
                    const quickA = docA.querySelector('div.nsk-panel.quick-access');
                    if (quickA) {
                      const spanA = quickA.querySelector('span');
                      if (spanA && spanA.textContent.trim() === '快捷功能区') {
                        spanA.textContent = `${NameA}快捷功能区`;
                      }
                    }
                    const quickB = docB.querySelector('div.nsk-panel.quick-access');
                    if (quickB) {
                      const spanB = quickB.querySelector('span');
                      if (spanB && spanB.textContent.trim() === '快捷功能区') {
                        spanB.textContent = `${NameB}快捷功能区`;
                      }
                      convertRelativePaths(quickB, baseB);
                      if (quickA) {
                        quickA.insertAdjacentHTML('beforeend', `<hr style="margin:6px 0;opacity:0.3;">`);
                        const innerB = quickB.innerHTML;
                        quickA.insertAdjacentHTML('beforeend', innerB);
                      }
                    }
                  } catch (e) {
                    console.error('合并 quick-access 出错：', e);
                  }
                })(document, docB);
                (function handleNewUsers(docA, docB) {
                  try {
                    const containerA = docA.querySelector('#nsk-right-panel-container');
                    if (!containerA) return;
                    const panelA = Array.from(containerA.querySelectorAll('div.nsk-panel')).find(div =>
                      div.querySelector('h4[aria-level="2"]') &&
                      div.querySelector('h4[aria-level="2"]').textContent.includes('📈用户数目📈')
                    );
                    const panelB = Array.from(docB.querySelectorAll('div.nsk-panel')).find(div =>
                      div.querySelector('h4[aria-level="2"]') &&
                      div.querySelector('h4[aria-level="2"]').textContent.includes('📈用户数目📈')
                    );
                    if (panelA) {
                      const statsA = panelA.querySelector('div[style*="padding: 5px 20px"]');
                      if (statsA && statsA.textContent.includes('论坛共有')) {
                        statsA.innerHTML = statsA.innerHTML.replace('目前论坛共有', `目前${NameA}有`);
                      }
                      const allH4 = panelA.querySelectorAll('h4[aria-level="2"]');
                      const welcomeTitleA = Array.from(allH4).find(h => h.textContent.includes('🎉欢迎新用户🎉'));
                      if (welcomeTitleA) {
                        welcomeTitleA.textContent = `🎉欢迎${NameA}新用户🎉`;
                      }
                      if (panelB) {
                        const statsB = panelB.querySelector('div[style*="padding: 5px 20px"]');
                        if (statsB && statsB.textContent.includes('论坛共有')) {
                          statsB.innerHTML = statsB.innerHTML.replace('目前论坛共有', `目前${NameB}有`);
                          statsB.setAttribute('style', 'padding: 5px 20px 5px 20px; margin-top: -8px;');
                        }
                        const newBoardB = panelB.querySelector('div.nsk-new-member-board');
                        if (newBoardB) {
                          convertRelativePaths(newBoardB, baseB);
                        }
                        if (statsA && statsB) {
                          statsA.insertAdjacentHTML('afterend', statsB.outerHTML);
                        }
                        const newBoardA = panelA.querySelector('div.nsk-new-member-board');
                        if (newBoardA && newBoardB) {
                          const newTitleB = `<h4 aria-level="2">🎉欢迎${NameB}新用户🎉</h4>`;
                          newBoardA.insertAdjacentHTML('afterend', newTitleB + newBoardB.outerHTML);
                        }
                      }
                    }
                  } catch (e) {
                    console.error('合并新用户区块出错：', e);
                  }
                })(document, docB);
                document.documentElement.style.visibility = '';
              } catch (err) {
                console.error('合并出错', err);
                document.documentElement.style.visibility = '';
              }
              initSearchHelper(docB);
            }
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', doMerge, {once:true});
            } else {
              doMerge();
            }
          } catch (e) {
            console.error('解析B失败', e);
            document.documentElement.style.visibility = '';
          }
        } else {
          document.documentElement.style.visibility = '';
        }
      },
      onerror: function() {
        document.documentElement.style.visibility = '';
      }
    });
    setTimeout(() => overrideSearchInputBehavior(document), 2000);
  }
  function overrideSearchInputBehavior(doc) {
    try {
      const searchForm = doc.querySelector('form.search-box');
      const hintBox = doc.querySelector('.search-hint');
      if (!searchForm || !hintBox) return;
      const a = hintBox.querySelector('.search4post');
      const o = hintBox.querySelector('.search4people');
      const i = hintBox.querySelector('.googleSearch');
      const input = doc.getElementById('search-site2');
      if (!a || !o || !i || !input) return;
      const newInput = input.cloneNode(true);
      input.parentNode.replaceChild(newInput, input);
      newInput.addEventListener('input', (function(t) {
        const n = newInput.value;
        if (n) {
          hintBox.style.display = "block";
          const doubleSearch = document.createElement('a');
          doubleSearch.innerText = "NS+DS帖子: " + n;
          doubleSearch.href = "/search?q=" + encodeURIComponent(n);
          doubleSearch.className = "search4post";
          doubleSearch.target = "_blank";
          doubleSearch.style.display = "block";
          const nodeSeekLink = document.createElement('a');
          nodeSeekLink.innerText = "搜索NS用户: " + n;
          nodeSeekLink.href = "https://nodeseek.com/member?q=" + encodeURIComponent(n);
          nodeSeekLink.className = "search4people";
          nodeSeekLink.target = "_blank";
          nodeSeekLink.style.display = "block";
          const deepFloodLink = document.createElement('a');
          deepFloodLink.innerText = "搜索DF用户: " + n;
          deepFloodLink.href = "https://deepflood.com/member?q=" + encodeURIComponent(n);
          deepFloodLink.className = "search4people";
          deepFloodLink.target = "_blank";
          deepFloodLink.style.display = "block";
          const googleNodeSeek = document.createElement('a');
          googleNodeSeek.innerText = "谷歌搜索NS: " + n;
          googleNodeSeek.href = "https://www.google.com/search?q=" + encodeURIComponent("site:www.nodeseek.com " + n);
          googleNodeSeek.className = "googleSearch";
          googleNodeSeek.target = "_blank";
          googleNodeSeek.style.display = "block";
          const googleDeepFlood = document.createElement('a');
          googleDeepFlood.innerText = "谷歌搜索DF: " + n;
          googleDeepFlood.href = "https://www.google.com/search?q=" + encodeURIComponent("site:www.deepflood.com " + n);
          googleDeepFlood.className = "googleSearch";
          googleDeepFlood.target = "_blank";
          googleDeepFlood.style.display = "block";
          hintBox.innerHTML = '';
          hintBox.appendChild(doubleSearch);
          hintBox.appendChild(nodeSeekLink);
          hintBox.appendChild(deepFloodLink);
          hintBox.appendChild(googleNodeSeek);
          hintBox.appendChild(googleDeepFlood);
        } else {
          hintBox.style.display = "none";
        }
      }));
    } catch (err) {
      console.error('overrideSearchInputBehavior error:', err);
    }
  }
  function initSearchHelper(docB = null) {
    function getCategoriesFromPage(docA = document, docB = null) {
      function extractCategories(doc) {
        const container = doc.querySelector('#nsk-left-panel-container');
        if (!container) return [];
        const lis = container.querySelectorAll('li a span');
        const cats = [];
        lis.forEach(span => {
          const text = span.textContent.trim();
          if (text && !cats.includes(text)) {
            cats.push(text);
          }
        });
        return cats;
      }
      const catsA = extractCategories(docA);
      let mergedCats = ['全部显示', ...catsA];
      if (docB) {
        const catsB = extractCategories(docB);
        catsB.forEach(c => {
          if (!mergedCats.includes(c)) mergedCats.push(c);
        });
      }
      return mergedCats;
    }
    const style = document.createElement('style');
    style.textContent = `
      .category-filter-container {
          z-index: 9999;
          gap: 6px;
          display: flex;
          flex-direction: column;
          font-size: 14px;
      }
      .filter-row {
          display: flex;
          align-items: center;
          gap: 4px;
      }
      .filter-label {
          white-space: nowrap;
          width: 50px;
      }
      .category-filter {
          padding: 4px;
          border-radius: 3px;
          border: 1px solid #ddd;
          width: 100%;
          font-size: 14px;
      }
      .text-filter {
          padding: 4px;
          border-radius: 3px;
          border: 1px solid #ddd;
          width: 100%;
          font-size: 14px;
          box-sizing: border-box;
      }
      .filter-option {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
      }
      .blocked-post {
          display: none !important;
      }
      .post-list-item {
          transition: opacity 0.3s;
      }
      .reset-btn {
          padding: 4px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 3px;
          cursor: pointer;
          text-align: center;
          margin-top: 4px;
          font-size: 14px;
          width: 94.8%;
      }
      .reset-btn:hover {
          background: #e0e0e0;
      }
      .award-icon {
          width: 14px;
          height: 14px;
          vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
    const filterContainer = document.createElement('div');
    filterContainer.className = 'nsk-panel category-filter-container';
    const STORAGE_KEY = 'POST_FILTER_SETTINGS';
    let currentSettings = GM_getValue(STORAGE_KEY, null);
    if (!currentSettings) {
      currentSettings = {
        category: '全部显示',
        recommendedOnly: false,
        pinBlock: true,
        authorFilter: '',
        titleFilter: '',
        excludeFilter: '',
        showNodeSeek: true,
        showDeepFlood: true
      };
    }
    let isFirstLoad = true;
    const lastUrl = GM_getValue('LAST_MATCHED_URL', '');
    const currentUrl = window.location.href;
    GM_setValue('LAST_MATCHED_URL', currentUrl);
    isFirstLoad = false;
    const categories = getCategoriesFromPage(document, docB);
    const categoryRow = document.createElement('div');
    categoryRow.className = 'filter-row';
    const categoryLabel = document.createElement('label');
    categoryLabel.className = 'filter-label';
    categoryLabel.textContent = '分类';
    categoryLabel.htmlFor = 'categoryFilter';
    const select = document.createElement('select');
    select.className = 'category-filter';
    select.id = 'categoryFilter';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });
    if (currentSettings.category && Array.from(select.options).some(o => o.value === currentSettings.category)) {
      select.value = currentSettings.category;
    } else {
      select.value = '全部显示';
    }
    categoryRow.appendChild(categoryLabel);
    categoryRow.appendChild(select);
    filterContainer.appendChild(categoryRow);
    const titleRow = document.createElement('div');
    titleRow.className = 'filter-row';
    const titleLabel = document.createElement('label');
    titleLabel.className = 'filter-label';
    titleLabel.textContent = '标题';
    titleLabel.htmlFor = 'titleFilter';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'text-filter';
    titleInput.id = 'titleFilter';
    titleInput.placeholder = ' 包含关键字';
    titleInput.value = currentSettings.titleFilter;
    titleRow.appendChild(titleLabel);
    titleRow.appendChild(titleInput);
    filterContainer.appendChild(titleRow);
    const excludeRow = document.createElement('div');
    excludeRow.className = 'filter-row';
    const excludeLabel = document.createElement('label');
    excludeLabel.className = 'filter-label';
    excludeLabel.textContent = '标题';
    excludeLabel.htmlFor = 'excludeFilter';
    const excludeInput = document.createElement('input');
    excludeInput.type = 'text';
    excludeInput.className = 'text-filter';
    excludeInput.id = 'excludeFilter';
    excludeInput.placeholder = ' 排除关键字';
    excludeInput.value = currentSettings.excludeFilter;
    excludeRow.appendChild(excludeLabel);
    excludeRow.appendChild(excludeInput);
    filterContainer.appendChild(excludeRow);
    const authorRow = document.createElement('div');
    authorRow.className = 'filter-row';
    const authorLabel = document.createElement('label');
    authorLabel.className = 'filter-label';
    authorLabel.textContent = '作者';
    authorLabel.htmlFor = 'authorFilter';
    const authorInput = document.createElement('input');
    authorInput.type = 'text';
    authorInput.className = 'text-filter';
    authorInput.id = 'authorFilter';
    authorInput.placeholder = ' ID / 昵称';
    authorInput.value = currentSettings.authorFilter;
    authorRow.appendChild(authorLabel);
    authorRow.appendChild(authorInput);
    filterContainer.appendChild(authorRow);
    const recommendedContainer = document.createElement('div');
    recommendedContainer.className = 'filter-option';
    const recommendedCheckbox = document.createElement('input');
    recommendedCheckbox.type = 'checkbox';
    recommendedCheckbox.id = 'recommendedOnly';
    recommendedCheckbox.checked = currentSettings.recommendedOnly;
    const awardIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    awardIcon.setAttribute('class', 'iconpark-icon award award-icon');
    awardIcon.setAttribute('style', 'width:14px;height:14px');
    const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useElement.setAttribute('href', '#diamonds');
    awardIcon.appendChild(useElement);
    const recommendedLabel = document.createElement('label');
    recommendedLabel.htmlFor = 'recommendedOnly';
    recommendedLabel.appendChild(document.createTextNode('仅显示推荐阅读 '));
    recommendedLabel.appendChild(awardIcon);
    recommendedContainer.appendChild(recommendedCheckbox);
    recommendedContainer.appendChild(recommendedLabel);
    filterContainer.appendChild(recommendedContainer);
    const pinContainer = document.createElement('div');
    pinContainer.className = 'filter-option';
    const pinCheckbox = document.createElement('input');
    pinCheckbox.type = 'checkbox';
    pinCheckbox.id = 'pinBlock';
    pinCheckbox.checked = currentSettings.pinBlock;
    const pinIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pinIcon.setAttribute('class', 'iconpark-icon pined circle-icon');
    pinIcon.setAttribute('style', 'width:14px;height:14px');
    const pinElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    pinElement.setAttribute('href', '#pin');
    pinIcon.appendChild(pinElement);
    const pinLabel = document.createElement('label');
    pinLabel.htmlFor = 'pinBlock';
    pinLabel.appendChild(document.createTextNode('隐藏置顶贴 '));
    pinLabel.appendChild(pinIcon);
    pinContainer.appendChild(pinCheckbox);
    pinContainer.appendChild(pinLabel);
    filterContainer.appendChild(pinContainer);
    const nsRow = document.createElement('div');
    nsRow.className = 'filter-row';
    const nsCheckbox = document.createElement('input');
    nsCheckbox.type = 'checkbox';
    nsCheckbox.id = 'filterNodeSeek';
    nsCheckbox.checked = currentSettings.showNodeSeek;
    const nsLabel = document.createElement('label');
    nsLabel.htmlFor = 'filterNodeSeek';
    nsLabel.style.display = 'flex';
    nsLabel.style.alignItems = 'center';
    nsLabel.style.gap = '4px';
    const nsIcon = document.createElement('img');
    nsIcon.src = 'https://nodeseek.com/static/image/favicon/android-chrome-192x192.png';
    nsIcon.width = 12;
    nsIcon.height = 12;
    nsLabel.appendChild(nsIcon);
    nsLabel.appendChild(document.createTextNode('NodeSeek'));
    nsRow.appendChild(nsCheckbox);
    nsRow.appendChild(nsLabel);
    filterContainer.appendChild(nsRow);
    const dfRow = document.createElement('div');
    dfRow.className = 'filter-row';
    const dfCheckbox = document.createElement('input');
    dfCheckbox.type = 'checkbox';
    dfCheckbox.id = 'filterDeepFlood';
    dfCheckbox.checked = currentSettings.showDeepFlood;
    const dfLabel = document.createElement('label');
    dfLabel.htmlFor = 'filterDeepFlood';
    dfLabel.style.display = 'flex';
    dfLabel.style.alignItems = 'center';
    dfLabel.style.gap = '4px';
    const dfIcon = document.createElement('img');
    dfIcon.src = 'https://deepflood.com/static/image/favicon/android-chrome-192x192.png';
    dfIcon.width = 12;
    dfIcon.height = 12;
    dfLabel.appendChild(dfIcon);
    dfLabel.appendChild(document.createTextNode('DeepFlood'));
    dfRow.appendChild(dfCheckbox);
    dfRow.appendChild(dfLabel);
    filterContainer.appendChild(dfRow);
    const resetBtn = document.createElement('div');
    resetBtn.className = 'reset-btn';
    resetBtn.textContent = '重置筛选';
    resetBtn.addEventListener('click', function() {
      select.value = '全部显示';
      recommendedCheckbox.checked = false;
      pinCheckbox.checked = true;
      authorInput.value = '';
      titleInput.value = '';
      excludeInput.value = '';
      nsCheckbox.checked = true;
      dfCheckbox.checked = true;
      saveSettings();
      filterPosts();
    });
    filterContainer.appendChild(resetBtn);
    function saveSettings() {
      currentSettings = {
        category: select.value,
        recommendedOnly: recommendedCheckbox.checked,
        pinBlock: pinCheckbox.checked,
        authorFilter: authorInput.value.trim(),
        titleFilter: titleInput.value.trim(),
        excludeFilter: excludeInput.value.trim(),
        showNodeSeek: nsCheckbox.checked,
        showDeepFlood: dfCheckbox.checked
      };
      GM_setValue(STORAGE_KEY, currentSettings);
      GM_setValue('LAST_MATCHED_URL', window.location.href);
    }
    function filterPosts() {
      const selectedCategory = select.value;
      const showRecommendedOnly = recommendedCheckbox.checked;
      const blockPin = pinCheckbox.checked;
      const authorFilterText = authorInput.value.trim().toLowerCase();
      const titleFilterText = titleInput.value.trim().toLowerCase();
      const excludeFilterText = excludeInput.value.trim().toLowerCase();
      const showNS = nsCheckbox.checked;
      const showDF = dfCheckbox.checked;
      document.querySelectorAll('li.post-list-item').forEach(post => {
        if (post.classList.contains("topic-carousel-item")) return;
        post.classList.remove('blocked-post');
        const categoryElement = post.querySelector('.post-category');
        const postCategory = categoryElement ? categoryElement.textContent.trim() : '';
        const isRecommended = post.querySelector('use[href="#diamonds"]') !== null;
        const isPin = post.querySelector('use[href="#pin"]') !== null;
        const authorLink = post.querySelector('.info-author a');
        const authorName = authorLink ? authorLink.textContent.trim().toLowerCase() : '';
        const authorImg = post.querySelector('img.avatar-normal');
        const authorAlt = authorImg ? authorImg.alt.toLowerCase() : '';
        const titleElement = post.querySelector('.post-title a');
        const postTitle = titleElement ? titleElement.textContent.trim().toLowerCase() : '';
        const postHasNSIcon = !!post.querySelector('img[src="https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png"]');
        const postHasDFIcon = !!post.querySelector('img[src="https://www.deepflood.com/static/image/favicon/android-chrome-192x192.png"]');
        const sourceBlocked = (!showNS && postHasNSIcon) || (!showDF && postHasDFIcon);
        const categoryMatch =
          selectedCategory === '全部显示' ||
          selectedCategory === '' ||
          postCategory === selectedCategory;
        const recommendedMatch = !showRecommendedOnly || isRecommended;
        const pinMatch = blockPin && isPin;
        const authorMatch =
          authorFilterText === '' ||
          authorName.includes(authorFilterText) ||
          authorAlt.includes(authorFilterText);
        const titleMatch =
          titleFilterText === '' ||
          postTitle.includes(titleFilterText);
        const excludeMatch =
          excludeFilterText === '' ||
          !postTitle.includes(excludeFilterText);
        if (!categoryMatch || !recommendedMatch || !authorMatch || pinMatch || !titleMatch || !excludeMatch || sourceBlocked) {
          post.classList.add('blocked-post');
        }
      });
    }
    select.addEventListener('change', () => { saveSettings(); filterPosts(); });
    recommendedCheckbox.addEventListener('change', () => { saveSettings(); filterPosts(); });
    pinCheckbox.addEventListener('change', () => { saveSettings(); filterPosts(); });
    authorInput.addEventListener('input', () => { saveSettings(); filterPosts(); });
    titleInput.addEventListener('input', () => { saveSettings(); filterPosts(); });
    excludeInput.addEventListener('input', () => { saveSettings(); filterPosts(); });
    nsCheckbox.addEventListener('change', () => { saveSettings(); filterPosts(); });
    dfCheckbox.addEventListener('change', () => { saveSettings(); filterPosts(); });
    const rightPanel = document.querySelector('#nsk-right-panel-container');
    if (rightPanel) {
      const quickAccessPanel = rightPanel.querySelector('div.nsk-panel.quick-access');
      if (quickAccessPanel) {
        rightPanel.insertBefore(filterContainer, quickAccessPanel);
      } else {
        rightPanel.insertBefore(filterContainer, rightPanel.firstChild);
      }
    } else {
      document.body.appendChild(filterContainer);
    }
    if (isFirstLoad) {
      setTimeout(filterPosts, 500);
    } else {
      filterPosts();
    }
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          filterPosts();
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('beforeunload', function() {
      GM_setValue('LAST_MATCHED_URL', window.location.href);
    });
  }
  fetchBAndMerge();
})();