// ==UserScript==
// @name           Reddit expand media and comments
// @description    Shows pictures and some videos right after the link, loads and expands comment threads.
// @icon           https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-72x72.png
//
// @version        1.0.14
//
// @author         wOxxOm
// @namespace      wOxxOm.scripts
// @license        MIT License
//
// @match          *://*.reddit.com/*
//
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_xmlhttpRequest
//
// @grant          GM.addStyle
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.registerMenuCommand
// @grant          GM.xmlHttpRequest
//
// @connect        freeimage.host
// @connect        gfycat.com
// @connect        gph.is
// @connect        gstatic.com
// @connect        gyazo.com
// @connect        ibb.co
// @connect        iili.io
// @connect        images.app.goo.gl
// @connect        imgchest.com
// @connect        imgshare.io
// @connect        imgur.com
// @connect        instagram.com
// @connect        pasteall.org
// @connect        pasteboard.co
// @connect        postimg.cc
// @connect        prnt.sc
// @connect        prntscr.com
// @connect        sakugabooru.com
// @connect        streamable.com
// @connect        tenor.com
// @connect        www.google.com
// @downloadURL https://update.greasyfork.org/scripts/370915/Reddit%20expand%20media%20and%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/370915/Reddit%20expand%20media%20and%20comments.meta.js
// ==/UserScript==

'use strict';

const isOldReddit = !!(unsafeWindow.wrappedJSObject || unsafeWindow).reddit;
if (isOldReddit && !/^\/(user|([^/]+\/){2}comments)\//.test(location.pathname))
  return;

//#region Init

const $ = (sel, base = document) => base.querySelector(sel);
const $$ = (sel, base = document) => base.querySelectorAll(sel);
const stringifyConfig = c => (c.expandComments ? '+' : '-') + c.imgurQuality;
const parseConfig = str => {
  const m = `${str || ''}`.match(/^\s*([-+])?\s*([a-z])?/i) || [];
  return {
    expandComments: m[1] !== '-',
    imgurQuality: (m[2] || 'h').toLowerCase(),
  };
};
const cfg = {};
const gm = typeof GM !== 'undefined' ? GM : {
  getValue: k => Promise.resolve(GM_getValue(k)),
  setValue: (k, v) => Promise.resolve(GM_setValue(k, v)),
  addStyle: GM_addStyle,
  xmlHttpRequest: GM_xmlhttpRequest,
};
(gm.registerMenuCommand || GM_registerMenuCommand)('REM&C: Configure', configure);

const CLASS = 'reddit-inline-media';
const CLASS_ALBUM = CLASS + '-album';
const CLASS_SMALL = CLASS + '-small'; // for user profiles where pics are often repeated
const OVERFLOW_ATTR = 'data-overflow';
const MORE_SELECTOR = '[id^="moreComments-"] p, .morecomments a, .deepthread a';
const REQUEST_THROTTLE_MS = isOldReddit ? 500 : 100;

const META_OG_IMG = 'meta[property="og:image"]';
const META_TW_IMG = 'meta[name="twitter:image"]';
const RULES = [{
  /* imgur **********************************/
  u: [
    'imgur.com/a/',
    'imgur.com/gallery/',
  ],
  r: /(a|gallery)\/(\w+)\/?([#.]\w+)?$/,
  s: 'https://imgur.com/ajaxalbums/getimages/$2/hit.json?all=true',
  q: json =>
    json.data.images.map(img =>
      img && `https://i.imgur.com/${img.hash}${img.ext}`),
}, {
  u: 'imgur.com/',
  r: /\.com\/\w+\/?(\?.*)?$/,
  q: `link[rel="image_src"], meta[name="twitter:player:stream"], ${META_TW_IMG}, ${META_OG_IMG}`,
}, {
  /* generic **********************************/
  u: [
    '//freeimage.host/i/',
    '//imgshare.io/image/',
    '//prnt.sc/',
  ],
  q: META_OG_IMG,
  xhr: true,
}, {
  u: [
    '//gyazo.com/',
    '//pasteboard.co/',
  ],
  q: META_TW_IMG,
  xhr: true,
}, {
  u: [
    'instagram.com/p/',
    '//gph.is/',
    '//ibb.co/',
    '//images.app.goo.gl/',
    '//postimg.cc/',
    '//tenor.com/view/',
  ],
  q: META_OG_IMG,
}, {
  u: ['//imgchest.com/'],
  q: doc => [].map.call($$(META_OG_IMG, doc), el => el.content),
}, {
  /* individual sites **********************************/
  u: '.gstatic.com/images?',
}, {
  u: '//streamable.com/',
  q: 'video',
}, {
  u: '//gfycat.com/',
  q: 'source[src*=".webm"], .actual-gif-image',
}, {
  u: '//giphy.com/gifs/',
  r: /gifs\/([^/]+-)?(\w+)/,
  s: 'https://media.giphy.com/media/$2/giphy.gif',
}, {
  u: '//pasteall.org/',
  q: '.center-fit',
}, {
  u: '//prntscr.com/',
  r: /\.com\/(\w+)$/i,
  s: 'https://prnt.sc/$1',
  q: META_OG_IMG,
  xhr: true,
}, {
  r: /^(https:\/\/www\.reddit\.com\/)gallery(\/\w+)$/i,
  s: '$1comments$2.json',
  q: json => Object.values(json[0].data.children[0].data.media_metadata)
    .map(v => v.s.u.replace(/&amp;/g, '&')),
}, {
  u: 'https://www.sakugabooru.com/post/show/',
  q: '#highres',
}, {
  u: 'youtu',
  r: /\/\/(?:youtu\.be\/|(?:(?:www|m)\.)?youtube\.com\/(?:.*?[&?/]v[=/]|shorts\/))([^&?/#]+)/,
  s: 'https://i.ytimg.com/vi/$1/hqdefault.jpg',
}, {
  u: '//pbs.twimg.com/media/',
  r: /.+?(\?format=|\.\w+:)\w+/,
}, {
  u: '.gifv',
  r: /(.+?)\.gifv(\?.*)?$/i,
  s: '$1.mp4$2',
}];
// last rule: direct images
RULES.push({
  r: /\.(jpe?g|png|gif|webm|mp4)(\?.*)?$/i,
});
for (const rule of RULES)
  if (rule.u && !Array.isArray(rule.u))
    rule.u = [rule.u];

// language=CSS
(gm.addStyle || (
  css => (document.head || document.documentElement)
    .appendChild(Object.assign(document.createElement('style'), {textContent: css}))
))(`
  .${CLASS} {
    max-width: 100%;
    display: block;
  }
  .${CLASS}[data-src] {
    padding-top: 400px;
  }
  .${CLASS}:hover {
    outline: 2px solid #3bbb62;
  }
  .${CLASS}.${CLASS_SMALL} {
    max-height: 25vh;
  }
  .${CLASS_ALBUM} {
    overflow-y: auto;
    max-height: calc(100vh - 100px);
    margin: .5em 0;
  }
  .${CLASS_ALBUM}[${OVERFLOW_ATTR}] {
    -webkit-mask-image: linear-gradient(white 75%, transparent);
    mask-image: linear-gradient(white 75%, transparent);
  }
  .${CLASS_ALBUM}[${OVERFLOW_ATTR}]:hover {
    -webkit-mask-image: none;
    mask-image: none;
  }
  .${CLASS_ALBUM} > :nth-child(n + 2) {
    margin-top: 1em;
  }
`);

let pageUrl = location.pathname;
let moreTimer;
const observers = new Map();
const more = [];
const toStop = new Set();
const menu = {
  get el() {
    return $(isOldReddit ? '.drop-choices.inuse' : '[role="menu"]');
  },
  resolve: null,
  observer: new MutationObserver(() => {
    const {el} = menu;
    if (!el || isOldReddit && !el.classList.contains('inuse')) {
      menu.observer.disconnect();
      menu.resolve();
    }
  }),
  observerConfig: isOldReddit ?
    {attributes: true, attributeFilter: ['class']} :
    {childList: true},
};
const scrollObserver = new IntersectionObserver(onScroll, {rootMargin: '150% 0px'});

gm.getValue('imgurQuality').then(v => {
  Object.assign(cfg, parseConfig(v));
  onMutation([{
    addedNodes: [document.body],
  }]);
  new MutationObserver(onMutation)
    .observe(document.body, {subtree: true, childList: true});
});

//#endregion

function onMutation(mutations) {
  if (pageUrl !== location.pathname) {
    pageUrl = location.pathname;
    observers.forEach(o => o.disconnect());
    observers.clear();
    stopOffscreenImages();
  }
  const items = [];
  let someElementsAdded;
  for (const {addedNodes} of mutations) {
    for (const node of addedNodes) {
      if (!node.localName)
        continue;
      someElementsAdded = true;
      for (const a of node.localName === 'a' ? [node] : node.getElementsByTagName('a')) {
        if (a.href.startsWith('https://www.reddit.com/r/') ||
            isOldReddit && a.closest('.side, .title, #header'))
          continue;
        const data = findMatchingRule(a);
        if (data)
          items.push(data);
      }
    }
  }
  if (someElementsAdded && !moreTimer && cfg.expandComments)
    moreTimer = setTimeout(observeShowMore, 500);
  if (items.length)
    setTimeout(maybeExpand, 0, items);
}

function onScroll(entries, observer) {
  const stoppingScheduled = toStop.size > 0;
  const expanders = [];
  for (const e of entries) {
    let el = e.target;
    if (el.localName === 'ins') {
      toggleAttribute(el.parentNode, OVERFLOW_ATTR, !e.isIntersecting);
      continue;
    }
    const rect = e.boundingClientRect;
    if (!e.isIntersecting) {
      if ((rect.bottom < -innerHeight * 2 || rect.top > innerHeight * 2) &&
          el.src && !el.dataset.src && observers.has(el))
        toStop.add(el);
      continue;
    } else if (el.classList.contains(CLASS_ALBUM)) {
      observer.unobserve(el);
      el.appendChild(document.createElement('ins'));
      const io = new IntersectionObserver(onScroll, {root: el});
      for (const c of el.children)
        io.observe(c);
      observers.set(el, io);
      continue;
    }
    if (stoppingScheduled)
      toStop.delete(el);
    const isImage = el.localName === 'img';
    if (el.dataset.src && (isImage || el.localName === 'video')) {
      el.src = el.dataset.src;
      el.addEventListener(isImage ? 'load' : 'loadedmetadata', unobserveOnLoad);
      delete el.dataset.src;
      continue;
    }
    if (el.localName === 'a' && el.id) {
      // switch to an unfocusable element to prevent the link
      // from stealing focus and scrolling the view
      const el2 = document.createElement('span');
      el2.setAttribute('onclick', el.getAttribute('onclick'));
      el2.setAttribute('id', el.id);
      el.parentNode.replaceChild(el2, el);
      el = el2;
    }
    expanders[rect.top >= 0 && rect.bottom <= innerHeight ? 'unshift' : 'push'](el);
  }
  expanders.forEach(expandNextComment);
  if (!stoppingScheduled && toStop.size)
    setTimeout(stopOffscreenImages, 100);
}

function stopOffscreenImages() {
  for (const el of toStop) {
    if (el.naturalWidth || el.videoWidth)
      continue;
    el.dataset.src = el.src;
    el.removeAttribute('src');
  }
  toStop.clear();
}

function findMatchingRule(a) {
  let url = a.href;
  for (const rule of RULES) {
    if (rule.u && !rule.u.find(includedInThis, url))
      continue;
    const {r} = rule;
    const m = !r || url.match(r);
    if (!m)
      continue;
    if (r && rule.s)
      url = url.slice(0, m.index + m[0].length).replace(r, rule.s).slice(m.index);
    return {a, rule, url};
  }
}

function maybeExpand(items) {
  for (const item of items) {
    const {a, rule} = item;
    const {href} = a;
    const text = a.textContent.trim();
    if (
      text &&
      !a.getElementsByTagName('img')[0] &&
      !/^https?:\/\/\S+?\.{3}$/.test(text) &&
      !a.closest(
        '.scrollerItem,' +
        '[contenteditable="true"],' +
        `a[href="${href}"] + * a[href="${href}"],` +
        `img[src="${href}"] + * a[href="${href}"]`) &&
      (
        isOldReddit ||
        // don't process insides of a post except for its text
        !a.closest('[data-test-id="post-content"]') ||
        a.closest('[data-click-id="text"]')
      )
    ) {
      try {
        (rule.q ? expandRemote : expand)(item);
      } catch (e) {
        // console.debug(e, item);
      }
    }
  }
}

function expand({a, url = a.href, isAlbum}) {
  const isVideo = /(webm|gifv|mp4)(\?.*)?$/i.test(url);
  if (!isVideo && url.includes('://i.imgur.com/'))
    url = setImgurQuality(url);
  let el = isAlbum ? a.lastElementChild : a.nextElementSibling;
  if (!el || el.src !== url && el.dataset.src !== url) {
    el = document.createElement(isVideo ? 'video' : 'img');
    el.dataset.src = url;
    el.className = CLASS + (location.pathname.startsWith('/user/') ? ' ' + CLASS_SMALL : '');
    a.insertAdjacentElement(isAlbum ? 'beforeEnd' : 'afterEnd', el);
    if (isVideo) {
      el.controls = true;
      el.preload = 'metadata';
    }
    scrollObserver.observe(el);
  }
  return !isAlbum && el;
}

async function expandRemote(item) {
  const {url, rule} = item;
  const r = await download(url);
  const text = r.response;
  const isJSON = /^content-type:.*?\/json/mi.test(r.responseHeaders);
  const doc = isJSON ? tryJSONparse(text) : parseDoc(text, url);
  switch (typeof rule.q) {
    case 'string': {
      if (!isJSON)
        expandRemoteFromSelector(doc, item);
      return;
    }
    case 'function': {
      let urls;
      try {
        urls = await rule.q(doc, text, item);
      } catch (e) {}
      if (urls && urls.length) {
        urls = Array.isArray(urls) ? urls : [urls];
        expandFromUrls(urls, item);
      }
      return;
    }
  }
}

async function expandRemoteFromSelector(doc, {rule, url, a}) {
  if (!doc)
    return;
  const el = doc.querySelector(rule.q);
  if (!el)
    return;
  let imageUrl = el.href || el.src || el.content;
  if (!imageUrl)
    return;
  if (rule.xhr)
    imageUrl = await downloadAsBase64({imageUrl, url});
  if (imageUrl)
    expand({a, url: imageUrl});
}

function expandFromUrls(urls, {a}) {
  const isAlbum = urls.length > 1;
  if (isAlbum) {
    if (a.nextElementSibling && a.nextElementSibling.classList.contains(CLASS_ALBUM))
      return;
    a = a.insertAdjacentElement('afterEnd', document.createElement('div'));
    a.className = CLASS_ALBUM;
    scrollObserver.observe(a);
  }
  for (const url of urls) {
    if (url)
      a = expand({a, url, isAlbum}) || a;
  }
}

async function expandNextComment(el) {
  if (el)
    more.push(el);
  else
    more.shift();
  if (more.length === 1 || !el && more.length) {
    if (menu.el) {
      await new Promise(resolve => {
        menu.resolve = resolve;
        menu.observer.observe(isOldReddit ? menu.el : document.body, menu.observerConfig);
      });
    }
    const a = more[0];
    if (a.href) {
      expandDeepThread(a);
    } else {
      a.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    }
    a.removeAttribute('onclick');
    more.forEach((el, i) => {
      scrollObserver.unobserve(el);
      if (i) scrollObserver.observe(el);
    });
    more.length = 1;
    setTimeout(expandNextComment, REQUEST_THROTTLE_MS);
  }
}

async function expandDeepThread(a) {
  try {
    a.style.opacity = .25;
    const url = a.href;
    const doc = parseDoc(await (await fetch(url)).text(), url);
    const table = $('.sitetable.nestedlisting', doc);
    const thing = $('.thing', table);
    const oldThing = document.getElementById(thing.id);
    if (oldThing) {
      oldThing.replaceWith(thing);
    } else {
      table.classList.remove('nestedlisting');
      a.closest('.thing').replaceWith(table);
    }
  } catch (e) {}
}

function observeShowMore() {
  moreTimer = 0;
  if ($(MORE_SELECTOR)) {
    for (const el of $$(MORE_SELECTOR)) {
      scrollObserver.observe(el);
    }
  }
}

function tryJSONparse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {}
}

function download(options) {
  return new Promise((resolve, reject) => {
    gm.xmlHttpRequest(Object.assign({
      method: 'GET',
      onload: resolve,
      onerror: reject,
    }, typeof options === 'string' ? {url: options} : options));
  });
}

async function downloadAsBase64({imageUrl, url}) {
  let {response: blob} = await download({
    url: imageUrl,
    headers: {
      Referer: url,
    },
    responseType: 'blob',
  });

  if (blob.type !== getMimeType(imageUrl))
    blob = blob.slice(0, blob.size, getMimeType(imageUrl));

  return new Promise(resolve => {
    Object.assign(new FileReader(), {
      onload: e => resolve(e.target.result),
    }).readAsDataURL(blob);
  });
}

function parseDoc(text, url) {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  if (!doc.querySelector('base'))
    doc.head.appendChild(doc.createElement('base')).href = url;
  return doc;
}

function getMimeType(url) {
  const ext = (url.match(/\.(\w+)(\?.*)?$|$/)[1] || '').toLowerCase();
  return 'image/' + (ext === 'jpg' ? 'jpeg' : ext);
}

function toggleAttribute(el, name, state) {
  const oldState = el.hasAttribute(name);
  if (state && !oldState)
    el.setAttribute(name, '');
  else if (!state && oldState)
    el.removeAttribute(name);
}

function unobserveOnLoad() {
  this.removeEventListener(this.localName === 'img' ? 'load' : 'loadedmetadata', unobserveOnLoad);
  const io = observers.get(this);
  if (io) io.unobserve(this);
}

function includedInThis(needle) {
  const i = this.indexOf(needle);
  // URL should have something after `u` part if that ends with '/'
  return i >= 0 && (!this.endsWith('/') || this.length > i + needle.length);
}

function setImgurQuality(url) {
  const i = url.lastIndexOf('/') + 1;
  const j = url.lastIndexOf('.');
  const ext = url.slice(j);
  return url.slice(0, Math.min(i + 7, j)) + (i && j > i && !/webm|mp4/.test(ext) ? cfg.imgurQuality : '') + '.jpg';
}

function configure() {
  const str = stringifyConfig(cfg);
  const q = prompt(
    'Toggle comment expansion and set imgur quality like +h or -b where ' +
    '+ or - toggles comment expansion and h, l, m, t, b, s sets imgur quality: ' +
    'Huge, Large, Medium, Thumbnail, Big square, Small square, or no letter to use default.',
    str);
  if (q == null) return;
  const cfg2 = parseConfig(q);
  const str2 = stringifyConfig(cfg2);
  if (str2 === str) return;
  gm.setValue('imgurQuality', str2);
  if (cfg.imgurQuality !== cfg2.imgurQuality) {
    const selector = `.${CLASS}!, .${CLASS_SMALL}!, .${CLASS}@, .${CLASS_SMALL}@`
      .replace(/!/g, '[src*="imgur.com"]').replace(/@/g, '[data-src*="imgur.com"]');
    for (const el of $$(selector)) {
      const src = el.src || el.dataset.src;
      const newSrc = setImgurQuality(src);
      if (src !== newSrc)
        el.setAttribute(el.src ? 'src' : 'data-src', newSrc);
    }
  }
  if (cfg.expandComments !== cfg2.expandComments) {
    if (cfg2.expandComments) {
      observeShowMore();
    } else {
      clearTimeout(moreTimer);
      more.length = moreTimer = 0;
    }
  }
  Object.assign(cfg, cfg2);
}
