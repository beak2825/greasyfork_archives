// ==UserScript==
// @name        AH/SB/SV/QQ Bookmarks list
// @description List bookmarks before each thread.
// @version     1.19
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @match       https://*.alternatehistory.com/*
// @match       https://*.questionablequesting.com/*
// @match       https://*.spacebattles.com/*
// @match       https://*.sufficientvelocity.com/*
// @grant       GM_addStyle
// @grant       unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/548535/AHSBSVQQ%20Bookmarks%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/548535/AHSBSVQQ%20Bookmarks%20list.meta.js
// ==/UserScript==
let ROUNDNESS = 1; // 0=square, 1=round

const DB_KEY      = '_bookmarks1'
const DEFAULT_DB  = '{}';
const THREAD_ID = location.href.match(/\/threads\/[^\/]*?\.(\d+)\//)?.[1];

let site = location.hostname.split('.').slice(-2, -1)[0];
let IS_AH = site==='alternatehistory';
let baseUrl = IS_AH ? '/forum/' : '/';

// ==================================================== FORUM / SEARCH
if (!location.pathname.includes("/threads/")) {
    GM_addStyle(`
    .bmBubble {
        display: inline-block;
        vertical-align: baseline;
        box-sizing: border-box;
        border-radius: ${ 0.55 * ROUNDNESS }em;
/*         margin-right: 1px; */
        margin-left: 3px;
        font-family: sans-serif;
        font-weight: 400;
        width: auto;
        height: auto;
        text-align: center;
        word-wrap: normal;
        word-break: normal;
        outline: 1px solid rgb(166, 116, 199, 0.9);
        padding: 0px 3px;
        color: rgb(166, 116, 199);
        user-select: none;
        text-decoration: none !important;

        font-size:  0.75em !important;
        line-height: 1.1em;
        min-width:   1.1em;
           position: relative;
           top: -0.60px;
    }
    .bmBubble:hover, .bmBubble:focus { color: rgb(122, 61, 150); outline: 1px solid rgb(122, 61, 150); }
    `);

    const threads = document.querySelectorAll('.structItem--thread');
    if (!threads) return;

    const db   = loadDB();

    for (let thread of threads) {
        let threadid = thread.className.match(/\bjs-threadListItem-(\d+)/)?.[1];
        if (!threadid) continue;

        let list     = db[threadid] || [];
        if (list.length === 0) continue;

        let [postid, _] = list[0];
        let url = `${baseUrl}posts/${postid}`

        const title = thread.querySelector('.structItem-title');
        const viewers = title.querySelector('.sv-user-activity--viewer-count');

        const bubble = document.createElement('a');
        bubble.className = 'bmBubble';
        bubble.textContent = list.length;
        bubble.href = url;

        if (viewers) {
            title.insertBefore(bubble, viewers);
            bubble.style.marginRight = '6px';
        }
        else title.append(bubble);
    }

}
// ==================================================== THREADS

function threadmark_highlight_init() {
  const id = 'post-highlight-style';
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = ''
  return el;
}
function threadmark_highlight_add(el, postid, color, first) {
    el.textContent += `:is(.block-body--threadmarkBody .structItem-title a, .menu.is-active a.recent-threadmark)[href$="#post-${postid}"]{ color: ${color};  border: solid 1px ${color}; border-radius: 4px; padding: 1px 5px; }`;
}
function theadmark_highlight_update(posts) {
    let style_el = threadmark_highlight_init();
    posts.forEach(([postid, _], idx) => {
      let color = (idx == 0) ? 'rgb(156, 70, 196)' : 'rgb(148, 116, 163)';
      threadmark_highlight_add(style_el, postid, color, (idx == 0));
    });
}

if (location.pathname.includes("/threads/") && THREAD_ID) {
    GM_addStyle(`article.message.hasBookmark.hasBookmark { border: solid 2px #9c46c4; border-radius: 4px; }`);
    applyBorderClassOnStart();
    rebuildIndicators();
    !IS_AH && setupXHRListener();
    IS_AH  && setupFetchListener();
}

function loadDB()   { return JSON.parse(localStorage.getItem(DB_KEY) || DEFAULT_DB); }
function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function rebuildIndicators() {
    if (!THREAD_ID) return;                 // not on a thread page

    const db   = loadDB();
    const list = db[THREAD_ID] || [];       // [[postId, date], ...]

    theadmark_highlight_update(list);

    const host = getContainer();
    host.innerHTML = '';                    // clear old indicators
    host.className = '';                    // reset anything left over
    host.style.marginBottom = '0px';

    if (list.length === 0) return;

    host.style.marginBottom = '20px';

    /* ---------------------------------------------------------------
       1. Heading
       --------------------------------------------------------------- */
    const h1 = document.createElement('h1');
    h1.className = 'block-header';          // ← previous nicer style
    h1.textContent = 'Bookmarks:';
    h1.style.padding = '8px 10px';
    h1.style.background = 'none'
    h1.style.backgroundColor = '#9c46c4'
    h1.style.color = 'rgb(254, 254, 254)'
    h1.style.border = 'none'
    h1.style.fontSize = '18px'
    h1.style.fontFamily = "Lato,Segoe UI,Helvetica Neue,Helvetica,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,sans-serif"
    h1.style.fontWeight = '400'

    host.appendChild(h1);

    /* ---------------------------------------------------------------
       2. Indicators  (first = blue, rest = secondary)
       --------------------------------------------------------------- */
    const DM = window.getComputedStyle(document.body).color.match(/\d+/g)[0] > 128;

    list.forEach(([postId, unixTimestamp], idx) => {
      const a = document.createElement('a');

    const formattedDate = formatDateTime(unixTimestamp);
    const relativeTime = getRelativeTime(unixTimestamp);


      a.href        = `${baseUrl}posts/${postId}`;
      a.textContent = `#${postId} - ${formattedDate} (${relativeTime})`;

        a.classList.add('button', 'u-fullWidth', 'u-mbSm', 'button--link');
        a.style.paddingTop = '1px';
        a.style.paddingBottom = '3px';
        a.style.justifyContent = 'left';
        // a.style.background = 'none'
        a.style.backgroundColor = DM ? '#272727' : '#fefefe';   // 'rgb(242, 242, 242)'
        a.style.border = 'solid 1px'
        a.style.marginBottom = '1px'

        if (idx === 0) {
            // a.classList.add('button--cta');   // call-to-action = always pops
            a.style.paddingTop = '10px';
            a.style.paddingBottom = '10px';
            a.style.textDecoration = 'underline';
            a.style.fontWeight = 'bold';
            a.style.color = '#9c46c4'
        } else {
            a.style.color = 'rgb(148, 116, 163)'
        }

      host.appendChild(a);
    });
}

function formatDateTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}/${month}/${day}`; // ${hours}:${minutes}:${seconds}
}

function getRelativeTime(unixTimestamp) {
    const now = new Date();
    const date = new Date(unixTimestamp * 1000);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

    const hours = Math.floor(diffInSeconds / 3600);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const days = Math.floor(diffInSeconds / 86400);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;

    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    if (remainingDays === 0) {
        return `${months} month${months !== 1 ? 's' : ''} ago`;
    }
    return `${months} month${months !== 1 ? 's' : ''} ${remainingDays} day${remainingDays !== 1 ? 's' : ''} ago`;
}


function getContainer() {
    let host = document.getElementById('bookmark-indicators');
    if (!host) {
        host = document.createElement('div');
        host.id = 'bookmark-indicators';
        host.style.display = 'flex';
        host.style.flexDirection = 'column';

        // insert right above the XenForo .p-body-main (or fall back to body)
        const bodyMain = document.querySelector('.p-body-main');
        (bodyMain?.parentElement).insertBefore(host, bodyMain || document.body.firstChild);
    }
    return host;
}

function applyBorderClassOnStart() {
    let articles = document.querySelectorAll('article.message');
    for (let a of articles) {
        let isBookmarked = !!a.querySelector('.bookmarkLink.is-bookmarked');
        if (isBookmarked) {
            a.classList.add('hasBookmark')
        }
    }
}

const bookmarkObservers = new Map();
function onBookmarkChange(postId, removed, method) {
    //console.log(removed ? 'REMOVED' : 'ADDED', postId, method, list);

    /* shut down any observer watching this post */
    bookmarkObservers.get(postId)?.disconnect()

    /* find the post */
    const post = document.querySelector(`#js-post-${postId}`);
    if (!post) { alert('Bookmark error: post with id ' + postId + 'not found.');  return; }

    const observer = new MutationObserver(records => {
      for (const r of records) {
        // console.log(r)
        let el = r.target;
        if (el.nodeType === 1 && el.classList.contains('bookmarkLink')) {
          const isBookmarked = el.classList.contains('is-bookmarked')

          const article = el.closest('article.message');
          article?.classList.toggle('hasBookmark', isBookmarked)

          /* ---- commit change based on `isBookmarked` instead of `removed` */
          const db   = loadDB();
          let   list = db[THREAD_ID] || [];

          if (!isBookmarked) { // ---- Remove entry
              list = list.filter(([id]) => id != postId); // loose !=, also removes accidental strings
          }
          else { // ---- Deduplicate / overwrite
              const unixNow = Math.floor(Date.now() / 1000);
              const idx = list.findIndex(([id]) => id === postId);
              if (idx !== -1) {
                  list[idx] = [postId, unixNow]; // entry exists -> update date
              } else {
                  list.push([postId, unixNow]);  // brand-new entry
              }
          }
          list.sort((a, b) => Number(b[0]) - Number(a[0]));

          if (list.length) { db[THREAD_ID] = list; }
          else             { delete db[THREAD_ID]; }
          saveDB(db);

          rebuildIndicators();
          /* ---- */

          observer.disconnect();
          bookmarkObservers.delete(postId);
          return;
        }
      }
    })
    bookmarkObservers.set(postId, observer)
    observer.observe(post, { childList: true, subtree: true, attributeFilter: ['class'] });
}

function parseKmDigit(text) {
    if (!text) return NaN;
    const cleanedText = text.trim().toLowerCase();
    const multiplier = cleanedText.endsWith('k') ? 1000 : cleanedText.endsWith('m') ? 1000000 : 1;
    return parseFloat(cleanedText.replace(/,/g, '')) * multiplier;
}

function getDataFromComment(comment) {
    const m = comment.match(/\{t:(\d+)[,:\dlp]*\}/); // old can have p:1,lp:9
    return m ? {threadid: m[1]} : null;
}

function firstSentence(post, MAX, title) {

  function removePrefix(text, start){
    const esc = s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const parts = (start+':').split(/([:.])/).map(s=>s.trim()).filter(Boolean).map(esc);
    const regex = parts.reduce((a,b)=> a + '(' + b + '\\s*)?', '');
    return text.replace(new RegExp('^' + regex, 'i'), '');
  }

  function sentencify(node, title) {
    let tmp = node.cloneNode(true);
    tmp.querySelectorAll('blockquote,.bbCodeSpoiler,table,img,br').forEach(function (n) {
      n.remove();
    });
    let text = tmp.textContent.replace(/\s+/g, ' ').trim();
    return removePrefix(text, title);
  }

  function wordSlice(text, maxChars) {
    let words = text.split(' ');
    let out = '', len = 0;
    for (let i = 0; i < words.length; i++) {
      let w = words[i];
      let add = len ? w.length + 1 : w.length;
      if (len + add > maxChars) break;
      out += (len ? ' ' : '') + w;
      len += add;
    }
    return out + '…';
  }

  let src = post.querySelector('.bbWrapper');
  let text = '';
  let hr = src.querySelector(':scope > hr');

  // if first <hr> has less than 10% of text before it, assume authors note and cut it.
  if (hr) {
    let prePart = document.createElement('span');
    let postPart = document.createElement('span');
    let after = false;
    src.childNodes.forEach(function (n) {
      if (n === hr) {
        after = true;
        return;
      }
      (after ? postPart : prePart).appendChild(n.cloneNode(true));
    });

    let pre  = sentencify(prePart, title);
    let post = sentencify(postPart, title);
    let ratio = pre.length / post.length;

    if (ratio < 0.10) text = post;
  }

  if (!text) text = sentencify(src, title);

  return wordSlice(text, MAX);
}




function setupXHRListener() {
    const NativeXHR = window.XMLHttpRequest;

    const _open = NativeXHR.prototype.open;
    NativeXHR.prototype.open = function (m, u) {
        this._method = m;
        this._url    = u;
        return _open.apply(this, arguments);
    };

    const _send = NativeXHR.prototype.send;
    NativeXHR.prototype.send = function (body) {
        try {
            if (this._method === 'POST') {
                const postid = this._url.match(/\/posts\/(\d+)\/bookmark/)?.[1];
                if (postid) {
                    const removed = body instanceof FormData && body.has('delete');

                    // console.log(removed, body, body instanceof FormData)
                    if (!removed) {
                        const post = document.getElementById('js-post-' + postid);

                        const threadid = parseInt(location.href.match(/\/threads\/[^\/]*?\.(\d+)\//)[1], 10);
                        const data = `{t:${threadid}}`;

                        const tm_label = post.querySelector('.message-cell--threadmark-header label')?.textContent;
                        const tm_title = post.querySelector('.message-cell--threadmark-header .threadmarkLabel')?.textContent ?? '';
                        const tm_first = firstSentence(post, 256 - data.length - tm_title.length, tm_title);

                        const message = (tm_label ? `[${tm_label}] ${tm_title}\n` : '') + `${tm_first} ${data}`;
                        // console.log({tm_title, tm_label, tm_first, data})

                        if (body instanceof FormData) {
                            const currentMsg = body.get('message') || '';
                            if (!getDataFromComment(currentMsg)) {
                              body.set('message', currentMsg ? currentMsg + ' ' + data : message);
                            }
                        } else {
                            body += '&message=' + message + '&labels=';
                        }
                    }
                    onBookmarkChange(parseInt(postid, 10), removed, 'xhr');
                }
            }
        } catch (err) {
            alert('XHR listener error:' + err);
        }
        return _send.call(this, body);
    };
}


function setupFetchListener() {
    const native = unsafeWindow.fetch;
    unsafeWindow.fetch = function (...a) {
        const r     = a[0] instanceof Request ? a[0] : null;
        const init  = a[1] || {};
        const url   = r ? r.url : String(a[0]);

        const postid = url.match(/\/posts\/(\d+)\/bookmark/)?.[1];
        if (postid) {
          (async () => {
            let removed = false;
            let isMultipart = r && r.headers.get('content-type')?.startsWith('multipart/form-data');
            if (isMultipart) {
                removed = (await r.clone().text()).includes('name="delete"');
            }
                onBookmarkChange(parseInt(postid, 10), removed, 'fetch');
          })();
        }
        return native.apply(this, a);
    };
}

// ==================================================== ACCOUNT
if (location.pathname.includes("/account")) {
    let sidebarBookmarks = document.querySelector('.blockLink[href$="/account/bookmarks"]')
    sidebarBookmarks.insertAdjacentHTML('beforeend','<span style="float:right">🔖</span>');

    // let sidebarLikes = document.querySelector('.blockLink').cloneNode(false);
    // sidebarLikes.textContent = 'Likes';
    // sidebarLikes.href += '#latest-activity';
    // sidebarLikes.insertAdjacentHTML('beforeend', '<span style="float:right">👍</span>');
    // sidebarBookmarks.after(sidebarLikes);
}


// ==================================================== BOOKMARKS
(async () => {

// Knowable: - threadmark count + page-ratio ~~ new chapters; is-last-threadmark
// TODO then resolving skip existing DB

function tempExists(val) { return localStorage.getItem('_temp_scrape') !== null; }
function saveTemp(val) { localStorage.setItem('_temp_scrape', JSON.stringify(val)); }
function loadTemp()    { return JSON.parse(localStorage.getItem('_temp_scrape') || 'null'); }
function removeTemp()  { localStorage.removeItem('_temp_scrape'); }

// ------------------- BOOKMARKS -------------------
let DELAY = 1_500;
async function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
async function resolveRedirect (url) {
  let res = await fetch(url, { method: 'HEAD' });
  if (res.status === 429) { // Too Many Requests
    drawText(`Too Many Request: Retrying in 2min... do not interrupt`)
    const wait = (+res.headers.get('retry-after') || 120) * 1000;
    DELAY += 1000;
    await sleep(wait);
    return resolveRedirect(url); // retry
  }
  return res.url;
}

if (location.pathname.includes("/bookmarks")) {
    // --------------- Start Button ---------------
    let DBcount = Object.values(loadDB()).flat(Infinity).length;
    document.querySelector('.filterBar').insertAdjacentHTML('afterbegin',
      `<a id="bbtn" class="button" style="padding: 1px 5px; color: #eee; background-color: #f98a28">Fetch bookmarks (${DBcount} in DB ~${Math.ceil(DBcount/20)}pages)</a>`);
    const BTN = document.getElementById("bbtn");
    function drawText(t) { BTN.textContent = t; }
    BTN.onclick = () => {
        saveTemp([]);
        location.href = baseUrl+"account/bookmarks?page=1";
    }

    // ---------------  Auto Scrape ---------------
    let current = location.search.match(/[\?&]page=(\d+)/)?.[1];
    if (!current) {
        removeTemp(); // Delete the key on main page to disable scraping unless the button was pressed to access ?page=1.
        return;
    }
    if (!tempExists()) { // page 1+ page accessed without clicking on the link.
        console.log('temp doesnt exsit')
        return;
    }

    let next = document.querySelector('.pageNav-jump--next');
    BTN.onclick = null;

    let lastCount = [...document.querySelectorAll('.pageNav-page')].pop()?.textContent || 1;
    drawText(`Loading ${current} of ${lastCount}...`);

    let temp = loadTemp();
    let bookmarks = document.querySelectorAll('.p-body-pageContent .block-row');
    for (let [i, b] of [...bookmarks].entries()) {
        let author = b.querySelector('.username').textContent;
        // 2 types of title: Post in thread '...', Thread '..'
        let rawTitle = b.querySelector('.contentRow-title a').textContent;
        let isThread = rawTitle.startsWith('Thread');
        let title    = rawTitle.match(/^(?:Post in thread|Thread) '(.*)'$/)[1]
        let url = b.querySelector('.contentRow-title a').href;
        let postid = isThread ? 0 : parseInt(url.match(/\/posts\/(\d+)/)[1], 10);
        let date = parseInt(b.querySelector('time').getAttribute('data-time'), 10);
        let comment = b.querySelector('.contentRow-snippet').textContent;
        let commentData = getDataFromComment(comment); // Object { threadid: 33798 }

        let entry = {author, title, isThread, url, postid, date, comment, commentData};
        temp.push(entry);
        console.log(entry);
    }
    saveTemp(temp);

    if (next) {
        await sleep(DELAY);
        next.click(); return;
    }

    // ---------------  Last Step - Resolve URLs ---------------
    temp = loadTemp();
    let DB = loadDB();
    let final = {};

    // Group and deduplicate
    const grouped = {};
    for (const e of temp) {     // 1. group entries by [author++id] in a Map[postid] to deudplicate repeated entries
      const key = `${e.author}::${e.title}`;
      if (!grouped[key]) grouped[key] = new Map();
      grouped[key].set(e.postid, e);
    }
    for (const key in grouped) { // 2. turn every bucket's Map into an array
      grouped[key] = [...grouped[key].values()];
    }
    for (const key in grouped) { // 3. sort each array by postid decreasing
      grouped[key].sort((a, b) => b.postid - a.postid);
    }

    // Build final
    let i = 0;
    let N = Object.keys(grouped).length;
    for (const arr of Object.values(grouped)) {
        drawText(`Processing ${i} of ${N}... do not interrupt`);
        let first = arr[0];
        let threadid;

        // Check if we dont already have this postid in the DB
        let threadIdFromDB;
        for (const [tid, tarray] of Object.entries(DB)) {
          for (const [pid, _] of tarray) {
            if (first.postid === pid) {
              threadid = tid;
              console.log("From DB:", threadid)
              break;
            }
          }
        }

        if (!threadid) {
          for (const entry of arr) {
            // check if we got a comment note {t:id}
            if (entry.commentData) {
              threadid = entry.commentData.threadid;
              console.log("Found comment data:", entry.commentData, threadid)
              break;
            }
            // check if we got a direct thread link
            let match = entry.url.match(/\/threads\/[^\/]*?\.(\d+)\//);
            if (match) {
              threadid = match[1];
              console.log("Found thread url:", entry.url, threadid)
              break;
            }
          }
        }

        if (!threadid) {
          // what remains must be a post link, resolve it
          drawText(`Resolving ${i} of ${N}... do not interrupt` );
          const start = Date.now();

          let threadUrl = await resolveRedirect(first.url);
          console.log("Resolved:", first.url, threadUrl)
          const elapsed = Date.now() - start;
          await sleep(Math.max(0, DELAY - elapsed));

          threadid = threadUrl.match(/\/threads\/[^\/]*?\.(\d+)\//)[1]
        }

        final[threadid] = arr.map(({postid, date}) => [postid, date]);
        i++;
    }

    console.log(final)
    saveDB(final);
    console.log(localStorage.getItem(DB_KEY))
    drawText(`Done. All bookmarks saved.`);
    removeTemp();

    return;
}

})();
// // ==================================================== LIKES
// if (location.pathname.includes("/members/")) {
//     if (location.hash === "#latest-activity") {
//         localStorage.removeItem('_scrape');
//     }
//     if (location.pathname.endsWith("/latest-activity")) {

//     }
// }

