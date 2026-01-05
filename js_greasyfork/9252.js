// ==UserScript==
// @name           FYTE /Fast YouTube Embedded/ Player
// @description    Hugely improves load speed of pages with lots of embedded Youtube videos by instantly showing clickable and immediately accessible placeholders, then the thumbnails are loaded in background. Optionally a fast simple HTML5 direct playback (720p max) can be selected if available for the video.
// @description:en Hugely improves load speed of pages with lots of embedded Youtube videos by instantly showing clickable and immediately accessible placeholders, then the thumbnails are loaded in background. Optionally a fast simple HTML5 direct playback (720p max) can be selected if available for the video.
// @description:ru На порядок ускоряет время загрузки страниц с большим количеством вставленных Youtube-видео. С первого момента загрузки страницы появляются заглушки для видео, которые можно щелкнуть для загрузки плеера, и почти сразу же появляются кавер-картинки с названием видео. В опциях можно включить режим использования упрощенного браузерного плеера (макс. 720p).
//
// @version        2.15.1
//
// @include        *
// @exclude        /^https:\/\/(www\.)?youtube\.com\/(?!embed)/
// @exclude        https://accounts.google.*/o/oauth2/postmessageRelay*
// @exclude        https://clients*.google.*/youtubei/*
// @exclude        https://clients*.google.*/static/proxy*
// @exclude        https://pikabu.ru/*
//
// @author         wOxxOm
// @namespace      wOxxOm.scripts
// @license        MIT License
//
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
//
// @connect        www.youtube.com
// @connect        youtube.com
//
// @run-at         document-start
//
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAARVBMVEVMaXEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8SEhLg4OC5ubnNzc1jY2Pt7e0xMTGbm5uFhYWqqqpFRUXPnCirAAAACnRSTlMAGWQyT86G4vOxURbENgAAA3xJREFUeNrtm+eSrCAQhQeMYEAQ5v0f9eKuIOoEidbW5fzaMMJXTbBpzjweWVlZWVlZWVkHAVAUpRSE9SKkVK1qdmql9n9Rn1PP/bRSQ7i0WRQAfO69qJFsE8fSQovq4m33JYrXt4mBytexRziZ0IuRKBucUM0pCDVOrPrm/g8E0Pbp/p0s2oDG6mt3bTP2fD6nRZzzeZ6FEOMi8qvhKEqp8dv6qeUB+aB8XDaytCXbZMwEbLf1aMz/pxhoF0+DmLa+qvMA9GMXXSM7DgLQC5ANXQINT70YwT4AafrvOsr2IdAzgHSJRHazQC+BqUumyVwIagT6IR3A0BtjgNIHYAsBkgDV+rNICSC2SaAXIUkJoKZhCx5gnYM9TQlAew2gFgHrkorpZXAvAC4epXoLpQVQ23HpAkDGGACTzRriwTaCUm+EFgCjjBcJBAB1NmgHgHseBqDWANwOwDcI/AQw2wLgfr4ZQAbB/QU6awDkAeARhFm/DpH9y3A0cuvJMQjiBDC6AbgGIRyAYxDGEwBxBsC98AGo/AFcgkB0ShQEwD4IoQFkEOjNAJiNbgAqJx18AeyCoAAaBdAHALAJgjqahAWwCEIsgMtBiAYgEwvqBkBDAWBGbga4lK5FBbiSrlEN0MYA+J5i6sNhJAAmLgNEGYLv2wGNOQeu7AUxAS7thvFWwcXMIBrA1dwo0lZ8PTGKA2CRGsYAsDohDKeUzBvALjMOnhPaHpBCA1gXC8ICOJwPgwK41ErGcIdTt2pROADHUpEIVaBwLZYFAmDOlbKtRONTpOLuJf45QJWM+ZSMuX+hcvK64TgDWJZqmWfFfCvVuhWrJ98Lnq1Y7VKuD3DHPflcWAwBrji9bkxCiGmA//zWTALcfnF579Xt4qGo7Pdif82Gg+GW6/uncX0PcfoxIKaJBNxp4QA7E8uYqn+BjRF46L0wmYuEaEPXauqrNAFJ27/ycpUBruGub0F8M7SVL8xsjBNKI22KlA6EM8PYudlJm4NX8GzoM/x8wwdtVr7RtPJNi5WPHeyGjWEsLS3ttN5mxmUJ7mylMImhd9c/PJhqExO0J1ttWaXsv3phrwZ1siC0NXjjLE9j7f7gLgcQVT+O+UjW9rapEARf/f17g39t+vuVpf+dtMHf9PYb5n7g+JWDHxXFL9gquJPxj+Vz6yP56xpZWVlZWVl/Qf8Ao4r0HI4dIbEAAAAASUVORK5CYII=
//
// @compatible     chrome
// @compatible     firefox
// @compatible     opera
// @downloadURL https://update.greasyfork.org/scripts/9252/FYTE%20Fast%20YouTube%20Embedded%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/9252/FYTE%20Fast%20YouTube%20Embedded%20Player.meta.js
// ==/UserScript==

'use strict';

let localStorage;
try { ({localStorage} = window); } catch (e) { localStorage = {}; }
// keep video info cache for a month since last time it's shown
const CACHE_STALE_DURATION = 30 * 24 * 3600e3;
const CACHE_PREFIX = 'FYTE-cache-';
const CACHE_PROPS = [
  ['videoWidth', 0],
  ['videoHeight', 0],
  ['duration'],
  ['fps'],
  ['title'],
  ['cover'],
];
const CHROME = !CSS.supports('-moz-appearance', 'none');
const rxYoutubeId = /(?:https?:)?\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com(?=\/)(?:\/embed\/(?:v=)?|.*?[&?/]v[=/])|youtu\.be\/)([-\w]+)[^'"\s]*/;
const rxYoutubeIdHtml = new RegExp(`${/(?:src|value)\s*=\s*["']\s*/.source}(${rxYoutubeId.source})['"]|$`, 'i');
const cfg = {
  width: 1280,
  height: 720,
  invidious: false,
  resize: 'Fit to width',
  rules: {},
  pinnable: 'on',
  pinnedWidth: 400,
  playHTML5: false,
  playHTML5Shown: false,
  showStoryboard: true,
  skipCustom: true,
};
const checked = new WeakMap();
const fyteMap = new WeakMap();
const dbCache = {};
const dbFlush = new Set();
const dbFlushDelay = 1000;
let _, db, fytedom, styledom, iframes, objects, persite, playbtn;

if (location.hostname === 'www.youtube.com') {
  if (CHROME && window !== top)
    setupYoutubeFullscreenRelay();
} else {
  for (const [k, def] of Object.entries(cfg)) {
    const v = GM_getValue(k, def);
    cfg[k] = typeof v === typeof def ? v : def;
  }
  _ = initTL();
  persite = getPersiteRule();
  fytedom = document.getElementsByClassName('instant-youtube-container');
  iframes = document.getElementsByTagName('iframe');
  objects = document.getElementsByTagName('object');
  updateCustomSize();
  findEmbeds([]);
  injectStylesIfNeeded();
  new MutationObserver(findEmbeds)
    .observe(document, {subtree: true, childList: true});
  document.addEventListener('DOMContentLoaded', e => {
    injectStylesIfNeeded();
    adjustNodesIfNeeded(e);
  }, {once: true});
  addEventListener('resize', adjustNodesIfNeeded, true);
  addEventListener('message', onMessageHost);
}

function setupYoutubeFullscreenRelay() {
  parent.postMessage('FYTE-toggle-fullscreen-init', '*');
  addEventListener('message', function onMessage(e) {
    if (e.source !== parent ||
        e.data !== 'FYTE-toggle-fullscreen-init-confirmed')
      return;
    removeEventListener('message', onMessage);
    const fsbtn = document.getElementsByClassName('ytp-fullscreen-button');
    new MutationObserver(function () {
      const el = fsbtn[0];
      if (el) {
        this.disconnect();
        el.removeAttribute('aria-disabled');
        el.replaceWith(el.cloneNode(true));
        fsbtn[0].addEventListener('click', () => parent.postMessage('FYTE-toggle-fullscreen', '*'));
      }
    }).observe(document, {subtree: true, childList: true});
  });
}

function getPersiteRule() {
  const h = location.hostname;
  const rule =
    (cfg.rules || {})[h] ||
    h === 'developers.google.com' && {
      test: '[data-video-id]',
      src: e => '//youtu.be/' + e.dataset.videoId,
    } ||
    h === 'play.google.com' && {
      eatparent: 0,
    } ||
    h === 'androidauthority.com' && {
      eatparent: '.video-container',
    } ||
    h === 'reddit.com' && {
      test: '[data-url*="youtube.com/"], [data-url*="youtu.be/"]',
      has: '[src*="/mediaembed"]',
      attr: 'data-url',
    } ||
    h === '9gag.com' && {
      eatparent: 0,
    } ||
    h === 'anilist.co' && {
      eatparent: '.youtube',
    } ||
    h === 'www.theverge.com' && {
      eatparent: '.p-scalable-video',
    } ||
    /^www\.google\.\w{2,3}(\.\w{2,3})?$/.test(h) && $('html[itemtype$="SearchResultsPage"]') && {
      find: '#rcnt a[data-attrid="VisualDigestVideoResult"][href*="youtube.com/watch"]',
      test: '',
      eatparent: 2,
    };
  if (!rule)
    return;
  Object.setPrototypeOf(rule, null);
  const {find = 'iframe', has, test: q = '[src*="youtube.com/embed"]'} = rule;
  if (!/^\.?[a-z][-a-z]*$/i.test(find))
    Object.defineProperty(rule, 'find', {get: () => document.querySelectorAll(find)});
  else
    rule.find = find[0] === '.'
      ? document.getElementsByClassName(find.slice(1))
      : document.getElementsByTagName(find);
  if (q)
    rule.test = el =>
      (el = el.matches(q) ? el : el.querySelector(q)) &&
      (!has || el.querySelector(has)) && el;
  return rule;
}

function onMessageHost(e) {
  switch (e.data) {
    case 'FYTE-toggle-fullscreen-init':
      if (findFrameElement(e.source))
        e.source.postMessage('FYTE-toggle-fullscreen-init-confirmed', '*');
      break;
    case 'FYTE-toggle-fullscreen': {
      const el = findFrameElement(e.source);
      if (el)
        goFullscreen(el,
          !(document.fullscreenElement || document.fullScreen || document.mozFullScreen));
      break;
    }
    case 'iframe-allowfs':
      $$('iframe:not([allowfullscreen])').some(iframe => {
        if (iframe.contentWindow === e.source) {
          iframe.allowFullscreen = true;
          return true;
        }
      });
      if (window !== top)
        parent.postMessage('iframe-allowfs', '*');
      break;
  }
}

function findFrameElement(frameWindow) {
  return $$('iframe[allowfullscreen]').find(el => el.contentWindow === frameWindow);
}

async function findEmbeds(mutations) {
  const found = [];
  if (mutations.length === 1) {
    const added = mutations[0].addedNodes;
    if (!added[0] || !added[1] && added[0].nodeType === 3)
      return;
  }
  if (persite)
    for (let el of persite.find)
      if (!persite.test || (el = persite.test(el)))
        processEmbed(found, el, persite.src ? persite.src(el) : el.getAttribute(persite.attr));
  if (length && hasChildWindow()) {
    for (const el of iframes) {
      const src = rxYoutubeId.exec(el.dataset.src || el.src);
      if (src) processEmbed(found, el, src[0]);
    }
    for (const el of objects) {
      const src = el.innerHTML.match(rxYoutubeIdHtml)[1];
      if (src) processEmbed(found, el, src);
    }
  }
  if (!found.length)
    return;
  const toRead = [];
  for (const [id] of found)
    if (!dbCache[id] && !toRead.includes(id))
      toRead.push(id);
  if (toRead.length)
    await read(toRead);
  for (const r of found)
    createFYTE(...r);
}

function hasChildWindow() {
  for (let i = 0, w; i < length; i++)
    if ((w = unsafeWindow[i]) && typeof w === 'object' && !checked.has(w))
      return checked.set(w, 0);
}

function decodeEmbedUrl(url) {
  return /youtube(-nocookie)?\.com%2Fembed/.test(url) ?
    decodeURIComponent(url.replace(/^.*?(http[^&?=]+?youtube(-nocookie)?\.com%2Fembed[^&]+).*$/i, '$1')) :
    url;
}

function processEmbed(res, node, src) {
  src = src || node.src || node.href || '';
  if (!src || checked.get(node) === src)
    return;
  checked.set(node, src);
  let n = node;
  let np = n.parentNode;
  const srcFixed = decodeEmbedUrl(src)
    .replace(/\/(watch\?v=|v\/)/, '/embed/')
    .replace(/^([^?&]+)&/, '$1?');
  if (src.indexOf('cdn.embedly.com/') > 0 ||
      cfg.resize !== 'Original' && np && np.children.length === 1 && !np.className && !np.id) {
    n = location.hostname === 'disqus.com' ? np.parentNode : np;
    np = n.parentElement;
  }
  if (!np ||
      !np.parentNode ||
      cfg.skipCustom && srcFixed.includes('enablejsapi=1') ||
      srcFixed.includes('/embed/videoseries') ||
      node.matches('.instant-youtube-embed, .YTLT-embed, .ihvyoutube') ||
      node.style.position === 'fixed' ||
      node.onload // skip some retarded loaders
  )
    return;

  let id = srcFixed.match(rxYoutubeId);
  if (!id)
    return;
  id = id[1];

  if (np.localName === 'object') {
    n = np;
    np = n.parentElement;
  }

  let eatparent = persite && persite.eatparent || 0;
  if (typeof eatparent === 'string') {
    n = np.closest(eatparent) || n;
  } else {
    while (eatparent--) {
      n = np;
      np = n.parentElement;
    }
  }
  (n.contentWindow || {}).location = 'about:blank';
  res.push([id, n, srcFixed]);
}

function createFYTE(id, n, srcFixed) {
  const cache = dbCache[id] || {id};
  const autoplay = /[?&](autoplay=1|ps=play)(&|$)/.test(srcFixed);
  const div = $create('div.container');
  const img = $create('img.thumbnail', {style: important('opacity:0;')});
  if (!autoplay) {
    img.src = cache.cover || getCoverUrl(id, 'maxresdefault.jpg');
    img.onload = onCoverLoad;
    img.onerror = onCoverError;
  }
  injectStylesIfNeeded('force');
  const fyte = {
    state: 'querying',
    srcEmbed: srcFixed.replace(/&$/, ''),
    originalWidth: /%/.test(n.width) ? 320 : n.width | 0 || n.clientWidth | 0,
    originalHeight: /%/.test(n.height) ? 200 : n.height | 0 || n.clientHeight | 0,
    cache,
  };
  fyteMap.set(div, fyte);
  fyte.srcEmbedFixed =
    fyte.srcEmbed.replace(/^http:/, 'https:')
      .replace(/([&?])(wmode=\w+|feature=oembed)&?/, '$1')
      .replace(/[&?]$/, '');
  fyte.srcWatchFixed =
    fyte.srcEmbedFixed.replace('/embed/', '/watch?v=').replace(/(\?.*?)\?/, '$1&');

  cache.lastUsed = new Date();
  write(cache);

  if (cache.reason)
    div.setAttribute('disabled', '');

  const divSize = calcContainerSize(div, n, fyte);
  const origStyle = getComputedStyle(n);
  overrideCSS(div, Object.assign(
    {
      height: persite && persite.eatparent === 0 ? '100%' : divSize.h + 'px',
      'min-width': Math.min(divSize.w, fyte.originalWidth) + 'px',
      'min-height': Math.min(divSize.h, fyte.originalHeight) + 'px',
      'max-width': divSize.w + 'px',
    },
    origStyle.transform && {
      transform: origStyle.transform,
    },
    !autoplay && {
      'background-color': 'transparent',
      transition: 'background-color 2s',
    },
    // eslint-disable-next-line no-proto
    ...Object.keys(origStyle.hasOwnProperty('position') ? origStyle : origStyle.__proto__ /*FF*/)
      .filter(k => /^(position|left|right|top|bottom)$/.test(k) &&
                   !/^(auto|static|block)$/.test(origStyle[k]))
      .map(k => ({[k]: origStyle[k]})),
    origStyle.display === 'inline' && {
      display: 'inline-block',
      width: '100%',
    },
    cfg.resize === 'Fit to width' && {
      width: '100%',
    }));
  if (!autoplay) {
    setTimeout(() => div.style.removeProperty('background-color'));
    setTimeout(() => div.style.removeProperty('transition'), 2000);
  }

  const wrapper = $create('div.wrapper', {}, [
    img,
    $create('a.title', {target: '_blank', href: fyte.srcWatchFixed},
      cache.title || cache.reason
        ? [
          $create('strong', {}, cache.title || cache.reason || ''),
          cache.duration && $create('span', {}, cache.duration),
          cache.fps && $create('i', {}, `${cache.fps}fps`),
        ]
        : '\xA0'),
    (playbtn || initPlayButton()).cloneNode(true),
    $create('span.alternative', {}, _(`msgPlay${cfg.playHTML5 ? 'HTML5' : ''}`)),
    $create('div.storyboard', {hidden: !cfg.showStoryboard}),
    $create('div.options-button', {}, _('Options')),
  ]);
  div.appendChild(wrapper);

  fyteMap.set(img, autoplay);
  if (!autoplay && img.naturalWidth)
    img.onload();
  n.replaceWith(div);
  if (!cache.title && !cache.reason || autoplay && cfg.playHTML5)
    fetchInfo.call(div);
  if (autoplay) {
    startPlaying(div);
  } else {
    div.addEventListener('click', clickHandler);
    div.addEventListener('mousedown', clickHandler);
    div.addEventListener('mouseenter', fetchInfo);
  }
  if (cfg.showStoryboard)
    div.addEventListener('mousemove', trackMouse);
}

function fetchInfo(e) {
  const fyte = fyteMap.get(this);
  fyte.mouseEvent = e;
  this.removeEventListener('mouseenter', fetchInfo);
  if (!fyte.storyboard) {
    const {id} = fyte.cache;
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://www.youtube.com/watch?v=' + id,
      context: this,
      onload: parseVideoInfo,
    });
  }
}

function onCoverLoad(e) {
  if (this.naturalWidth <= 120)
    return this.onerror(e);
  this.style.opacity = '';
  fyteMap.delete(this);
}

function onCoverError() {
  const {src} = this;
  const id = src.split('/')[4];
  const src2 = getCoverUrl(id, 'sddefault.jpg');
  this.src = src2 !== src ? src2 : getCoverUrl(id, 'hqdefault.jpg');
}

function adjustNodesIfNeeded(e) {
  if (!fytedom[0])
    return;
  if (adjustNodesIfNeeded.scheduled)
    clearTimeout(adjustNodesIfNeeded.scheduled);
  adjustNodesIfNeeded.scheduled = setTimeout(() => {
    adjustNodes(e);
    adjustNodesIfNeeded.scheduled = 0;
  }, 16);
}

function adjustNodes(event, clickedContainer) {
  const force = !!clickedContainer;
  let nearest = force ? clickedContainer : null;
  let nearestCenterYpct;

  const vids = $$('.instant-youtube-container:not([pinned]):not([stub])');

  if (!nearest && event.type !== 'DOMContentLoaded') {
    let minDistance = window.innerHeight * 3 / 4 | 0;
    const nearTargetY = window.innerHeight / 2;
    for (const n of vids) {
      const bounds = n.getBoundingClientRect();
      const distance = Math.abs((bounds.bottom + bounds.top) / 2 - nearTargetY);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = n;
      }
    }
  }

  if (nearest) {
    const bounds = nearest.getBoundingClientRect();
    nearestCenterYpct = (bounds.top + bounds.bottom) / 2 / window.innerHeight;
  }

  let resized = false;

  for (const n of vids) {
    const size = calcContainerSize(n);
    const w = size.w;
    const h = size.h;

    // prevent parent clipping
    for (let e = n.parentElement, style; e; e = e.parentElement) {
      if (e.style.overflow !== 'visible' &&
          n.offsetTop < e.clientHeight / 2 &&
          n.offsetTop + n.clientHeight > e.clientHeight &&
          (style = getComputedStyle(e)) &&
          /hidden|scroll/.test(style.overflow + style.overflowX + style.overflowY)) {
        overrideCSS(e, {
          overflow: 'visible',
          'overflow-x': 'visible',
          'overflow-y': 'visible',
        });
      }
    }

    if (force && Math.abs(w - parseFloat(n.style.maxWidth)) <= 2)
      continue;

    overrideCSS(n, Object.assign({},
      n.style.maxWidth !== `${w}px` && {
        'max-width': `${w}px`,
      },
      n.style.height !== h + 'px' && {
        height: h + 'px',
      },
      parseFloat(n.style.minWidth) > w && {
        'min-width': n.style.maxWidth,
      },
      parseFloat(n.style.minHeight) > h && {
        'min-height': n.style.height,
      }));

    resized = true;
  }

  if (resized && nearest)
    setTimeout(() => {
      const bounds = nearest.getBoundingClientRect();
      const h = bounds.bottom - bounds.top;
      const projectedCenterY = nearestCenterYpct * window.innerHeight;
      const projectedTop = projectedCenterY - h / 2;
      const safeTop = Math.min(Math.max(0, projectedTop), window.innerHeight - h);
      window.scrollBy(0, bounds.top - safeTop);
    }, 16);
}

function calcContainerSize(div, origNode, fyte = fyteMap.get(div)) {
  if (!fyte)
    return;
  origNode = origNode || div;
  let w, h;
  let np = origNode.parentElement;
  const style = getComputedStyle(np);
  let parentWidth = parseFloat(style.width) -
                    floatPadding(np, style, 'Left') -
                    floatPadding(np, style, 'Right');
  if (+style.columnCount > 1)
    parentWidth = (parentWidth + parseFloat(style.columnGap)) / style.columnCount -
                  parseFloat(style.columnGap);
  switch (cfg.resize) {
    case 'Original':
      if (fyte.originalWidth === 320 && fyte.originalHeight === 200) {
        w = parentWidth;
        h = parentWidth / 16 * 9;
      } else {
        w = fyte.originalWidth;
        h = fyte.originalHeight;
      }
      break;
    case 'Custom':
      w = cfg.width;
      h = cfg.height;
      break;
    case '1080p':
    case '720p':
    case '480p':
    case '360p':
      h = parseInt(cfg.resize);
      w = h / 9 * 16;
      break;
    default: // fit-to-width mode
      // find parent node with nonzero width (i.e. independent of our video element)
      while (np && !(w = np.clientWidth))
        np = np.parentNode;
      if (w)
        h = w / 16 * 9;
      else {
        w = origNode.clientWidth;
        h = origNode.clientHeight;
      }
  }
  if (parentWidth > 0 && parentWidth < w) {
    h *= parentWidth / w;
    w = parentWidth;
  }
  if (cfg.resize === 'Fit to width' && h < fyte.originalHeight * 0.9)
    h = Math.min(fyte.originalHeight, w / fyte.originalWidth * fyte.originalHeight);

  return {w: CHROME ? w : Math.round(w), h: h};
}

function parseVideoInfo(response) {
  const div = response.context;
  const txt = response.responseText;
  const info = tryJSONparse(txt.match(/var\s+ytInitialPlayerResponse\s*=\s*({.+?});|$/)[1]) || {};
  const {reason} = info.playabilityStatus || {};
  const vid = info.videoDetails || {};
  const streams = info.streamingData || {};
  const fyte = fyteMap.get(div);
  const cache = fyte.cache;
  let shouldUpdateCache = false;

  const videoSources = [];
  const fmts = (streams.formats || streams.adaptiveFormats || [])
    .sort((a, b) => b.width - a.width || b.height - a.height);
  // parse width & height to adjust the thumbnail
  if (fmts.length &&
      (cache.videoWidth !== fmts[0].width || cache.videoHeight !== fmts[0].height)) {
    cache.videoWidth = fmts[0].width;
    cache.videoHeight = fmts[0].height;
    shouldUpdateCache = true;
  }

  // parse video sources
  for (const f of fmts) {
    const codec = f.mimeType.match(/codecs="([^.]+)|$/)[1] || '';
    const type = f.mimeType.split(/[/;]/)[1];
    let src = f.url;
    if (!src && f.cipher) {
      const sp = {};
      for (const str of f.cipher.split('&')) {
        const [k, v] = str.split('=');
        sp[k] = v;
      }
      src = decodeURIComponent(sp.url);
      if (sp.s) src += `&${sp.sp || 'sig'}=${decodeYoutubeSignature(sp.s)}`;
    }
    videoSources.push({
      src,
      title: [
        f.quality,
        f.qualityLabel !== f.quality ? f.qualityLabel : '',
        type + (codec ? `:${codec}` : ''),
      ].filter(Boolean).join(', '),
    });
  }

  let fps = new Set();
  for (const f of streams.adaptiveFormats || []) {
    if (f.fps)
      fps.add(f.fps);
  }
  fps = [...fps].join('/');
  if (fps && cache.fps !== fps) {
    cache.fps = fps;
    shouldUpdateCache = true;
  }

  let duration = fyte.duration = vid.lengthSeconds | 0;
  if (duration) {
    duration = secondsToTimeString(duration);
    if (cache.duration !== duration) {
      cache.duration = duration;
      shouldUpdateCache = true;
    }
  }
  if (duration || fps)
    duration = `<span>${duration}</span>${fps ? `<i>${fps}fps</i>` : ''}`;

  const title = [
    decodeURIComponent(vid.title || ''),
    reason && reason.replace(/\s*\.$/, ''),
  ].filter(Boolean).join(' | ').replace(/\+/g, ' ');
  if (title) {
    $('.instant-youtube-title', div).innerHTML =
      (title ? `<strong>${title}</strong>` : '') + duration;
    if (cache.title !== title) {
      cache.title = title;
      shouldUpdateCache = true;
    }
  }
  if (cfg.pinnable !== 'off' && vid.title)
    makeDraggable(div);

  if (reason) {
    div.setAttribute('disabled', '');
    if (cache.reason !== reason) {
      cache.reason = reason;
      shouldUpdateCache = true;
    }
  }

  if (videoSources.length)
    fyte.videoSources = videoSources;

  if (txt.includes('playerStoryboardSpecRenderer') &&
      info.storyboards &&
      fyte.state !== 'scheduled play') {
    const m = info.storyboards.playerStoryboardSpecRenderer.spec.split('|');
    const [w, h, len, rows, cols] = m[m.length - 1].split('#').map(Number);
    fyte.storyboard = {w, h, len, rows, cols};
    if (w * h > 2000) {
      fyte.storyboard.url = m[0].replace('?', '&').replace(
        '$L/$N.jpg',
        `${m.length - 2}/M0.jpg?sigh=${m[m.length - 1].replace(/^.+?#([^#]+)$/, '$1')}`);
      const elSb = $('.instant-youtube-storyboard', div);
      if (elSb) {
        elSb.dataset.loaded = '';
        elSb.appendChild(overrideCSS($create('div.sb-thumb', {}, '\xA0'), {
          width: w - 1 + 'px',
          height: h + 'px',
        }));
        if (cfg.showStoryboard)
          updateHoverHandler(div);
      }
    }
  }

  injectStylesIfNeeded();

  if (fyte.state === 'scheduled play')
    setTimeout(startPlayingDirectly, 0, div);

  fyte.state = '';

  try {
    const cover = vid.thumbnail.thumbnails.pop().url;
    if (cache.cover !== cover) {
      cache.cover = cover;
      shouldUpdateCache = true;
      const img = $('img', div);
      if (img.src && img.src !== cover)
        img.src = cover;
    }
  } catch (e) {}
  if (shouldUpdateCache)
    write(cache);
}

function decodeYoutubeSignature(s) {
  const a = s.split('');
  a.reverse();
  swap(a, 24);
  a.reverse();
  swap(a, 41);
  a.reverse();
  swap(a, 2);
  return a.join('');
}

function swap(a, b) {
  const c = a[0];
  a[0] = a[b % a.length];
  a[b % a.length] = c;
}

function trackMouse(e) {
  fyteMap.get(this).mouseEvent = e;
}

function updateHoverHandler(div) {
  const fyte = fyteMap.get(div);
  const sb = fyte.storyboard;
  const elSb = $('.instant-youtube-storyboard', div);
  if (!cfg.showStoryboard) {
    elSb.hidden = true;
    return;
  }
  elSb.hidden = false;
  let oldIndex = null;
  const tracker = elSb.firstElementChild;
  const style = tracker.style;
  const sbImg = $create('img');
  const spinner = $create('span.loading-spinner');
  elSb.addEventListener('mousemove', storyboardHoverHandler);
  elSb.addEventListener('mouseout', storyboardHoverHandler);
  elSb.addEventListener('click', storyboardClickHandler, {once: true});
  div.addEventListener('mouseover', storyboardPreloader);
  div.addEventListener('mouseout', storyboardPreloader);
  if (div.closest(':hover'))
    storyboardPreloader({});

  function storyboardClickHandler(e) {
    const offsetX = e.offsetX || e.clientX - elSb.getBoundingClientRect().left;
    fyte.startAt = offsetX / elSb.clientWidth * fyte.duration | 0;
    fyte.srcEmbedFixed = setUrlParams(fyte.srcEmbedFixed, {start: fyte.startAt});
    startPlaying(div, {alternateMode: e.shiftKey});
  }

  function storyboardPreloader(e) {
    if (e.type === 'mouseout') {
      spinner.remove();
      return;
    }
    const {len, rows, cols, preloaded} = sb || {};
    const lastpart = (len - 1) / (rows * cols || 1) | 0;
    if (lastpart <= 0 || preloaded)
      return;
    let part = 0;
    $create('img', {
      src: setStoryboardUrl(part++),
      onload() {
        if (part <= lastpart) {
          this.src = setStoryboardUrl(part++);
          return;
        }
        sb.preloaded = true;
        div.removeEventListener('mouseover', storyboardPreloader);
        div.removeEventListener('mouseout', storyboardPreloader);
        this.onload = null;
        this.src = '';
        spinner.remove();
      },
    });
    if (elSb.matches(':hover') && fyte.mouseEvent)
      storyboardHoverHandler(fyte.mouseEvent);
  }

  function setStoryboardUrl(part) {
    return sb.url.replace(/M\d+\.jpg\?/, `M${part}.jpg?`);
  }

  function storyboardHoverHandler(e) {
    div.removeEventListener('mousemove', trackMouse);
    if (!cfg.showStoryboard || !sb)
      return;
    if (e.type === 'mouseout') {
      sbImg.onload && sbImg.onload();
      return;
    }
    const {w, h, cols, rows, len, preloaded} = sb;
    const partlen = rows * cols;

    const offsetX = e.offsetX || e.clientX - elSb.getBoundingClientRect().left;
    const left = Math.min(elSb.clientWidth - w, Math.max(0, offsetX - w)) | 0;
    if (!style.left || parseInt(style.left) !== left) {
      style.left = `${left}px`;
      if (spinner.parentElement)
        spinner.style.cssText = important(`left:${left + w / 2 - 10}px; right:auto;`);
    }

    let index = Math.min(offsetX / elSb.clientWidth * (len + 1) | 0, len - 1);
    if (index === oldIndex)
      return;

    const part = index / partlen | 0;
    if (!oldIndex || part !== (oldIndex / partlen | 0)) {
      const url = setStoryboardUrl(part);
      style.setProperty('background-image', `url(${url})`, 'important');
      if (!preloaded) {
        if (spinner.timer)
          clearTimeout(spinner.timer);
        spinner.timer = setTimeout(() => {
          spinner.timer = 0;
          if (!sbImg.src)
            return;
          elSb.appendChild(spinner);
          spinner.style.cssText = important(`left:${left + w / 2 - 10}px; right:auto;`);
        }, 50);
        sbImg.onload = () => {
          clearTimeout(spinner.timer);
          spinner.remove();
          spinner.timer = 0;
          sbImg.onload = null;
          sbImg.src = '';
        };
        sbImg.src = url;
      }
    }

    tracker.dataset.time = secondsToTimeString(index / (len - 1 || 1) * fyte.duration | 0);
    oldIndex = index;
    index %= partlen;
    style.setProperty('background-position',
      `-${(index % cols) * w}px -${(index / cols | 0) * h}px`, 'important');
  }
}

function clickHandler(e) {
  const el = e.target;
  if (el.closest('a') ||
      e.type === 'mousedown' && e.button !== 1 ||
      e.type === 'click' && el.matches('.instant-youtube-options, .instant-youtube-options *'))
    return;
  if (e.type === 'click' && el.matches('.instant-youtube-options-button')) {
    showOptions(e);
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  startPlaying(el.closest('.instant-youtube-container'), {
    alternateMode: e.shiftKey || el.matches('.instant-youtube-alternative'),
    fullscreen: e.button === 1,
  });
}

function startPlaying(div, params) {
  div.removeEventListener('click', clickHandler);
  div.removeEventListener('mousedown', clickHandler);

  $$remove([
    '.instant-youtube-alternative',
    '.instant-youtube-storyboard',
    '.instant-youtube-options-button',
    '.instant-youtube-options',
  ].join(','), div);
  $('svg', div).outerHTML = '<span class=instant-youtube-loading-spinner></span>';

  if (cfg.pinnable !== 'off') {
    makePinnable(div);
    if (params && params.pin)
      $(`[pin="${params.pin}"]`, div).click();
  }

  if (window !== top)
    parent.postMessage('iframe-allowfs', '*');

  const fyte = fyteMap.get(div);
  if ((!!cfg.playHTML5 + !!(params && params.alternateMode) === 1) &&
      (fyte.videoSources || fyte.state === 'querying')) {
    if (fyte.videoSources)
      startPlayingDirectly(div, params);
    else {
      // playback will start in parseVideoInfo
      fyte.state = 'scheduled play';
      // fallback to iframe in 5s
      setTimeout(() => {
        if (fyte.state) {
          fyte.state = '';
          switchToIFrame.call(div, params);
        }
      }, 5000);
    }
  } else
    switchToIFrame.call(div, params);
}

function startPlayingDirectly(div, params) {
  const switchTimer = setTimeout(switchToIFrame.bind(div, params), 5000);
  const video = $create('video.embed', {
    autoplay: true,
    controls: true,
    volume: GM_getValue('volume', 0.5),
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      padding: 0,
      margin: 'auto',
      opacity: 0,
      width: '100%',
      height: '100%',
    },
    oncanplay() {
      this.oncanplay = null;
      const fyte = fyteMap.get(div);
      if (fyte.startAt && Math.abs(this.currentTime - fyte.startAt) > 1)
        this.currentTime = fyte.startAt;
      clearTimeout(switchTimer);
      pauseOtherVideos(this);
      if (params && params.fullscreen)
        return;
      div.setAttribute('playing', '');
      div.firstElementChild.appendChild(this);
      overrideCSS(this, {opacity: 1});
    },
    onvolumechange() {
      GM_setValue('volume', this.volume);
    },
  });

  for (const src of fyteMap.get(div).videoSources || []) {
    video.appendChild($create('source', src))
      .onerror = switchToIFrame.bind(div, params);
  }

  overrideCSS($('img', div), {
    transition: 'opacity 1s',
    opacity: '0',
  });

  if (params && params.fullscreen) {
    div.firstElementChild.appendChild(video);
    div.setAttribute('playing', '');
    video.style.opacity = 1;
    goFullscreen(video);
  }

  if (CHROME && +navigator.userAgent.match(/Chrom\D+(\d+)|$/)[1] < 74)
    video.addEventListener('click', () =>
      setTimeout(() =>
        video.paused ?
          video.play() :
          video.pause()));

  const title = $('.instant-youtube-title', div);
  if (title) {
    video.onpause = () => (title.hidden = false);
    video.onplay = () => (title.hidden = true);
  }
}

function switchToIFrame(params, e) {
  if (this.querySelector('iframe'))
    return;
  const div = this;
  const wrapper = div.firstElementChild;
  const fullscreen = params && params.fullscreen && !e;
  const fyte = fyteMap.get(div);
  if (e instanceof Event) {
    console.log('[FYTE] Direct linking canceled on %s, switching to IFRAME player',
      fyte.srcEmbed);
    const video = e.target ? e.target.closest('video') : e.composedPath().pop();
    video.textContent = '';
    goFullscreen(video, false);
    video.remove();
  }

  const url = setUrlParams(fyte.srcEmbedFixed, {
    html5: 1,
    autoplay: 1,
    autohide: 2,
    border: 0,
    controls: 1,
    fs: 1,
    showinfo: 1,
    ssl: 1,
    theme: 'dark',
    enablejsapi: 1,
    local: 'true',
    quality: 'medium',
    FYTEfullscreen: fullscreen | 0,
  });

  let iframe = $create('iframe.embed', {
    src: url,
    allow: 'autoplay; fullscreen',
    allowFullscreen: true,
    width: '100%',
    height: '100%',
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: 0,
      margin: 'auto',
      opacity: 0,
      border: 0,
    },
  });

  if (cfg.pinnable !== 'off') {
    $('[pin]', div).insertAdjacentElement('beforebegin', iframe);
  } else {
    wrapper.appendChild(iframe);
  }

  div.setAttribute('iframe', '');
  div.setAttribute('playing', '');

  iframe = $('iframe', div);
  if (fullscreen) {
    goFullscreen(iframe);
    overrideCSS(iframe, {opacity: 1});
  }
  addEventListener('message', YTlistener);
  iframe.addEventListener('load', () => {
    iframe.contentWindow.postMessage('{"event":"listening"}', '*');
    if (fyte.cache.reason)
      show();
  }, {once: true});
  setTimeout(show, 1000);

  function show() {
    overrideCSS(iframe, {opacity: 1});
    $('.instant-youtube-title', div).hidden = true;
  }

  function YTlistener(e) {
    const data = e.source === iframe.contentWindow && e.data && tryJSONparse(e.data);
    if (!data || !data.info || data.info.playerState !== 1)
      return;
    removeEventListener('message', YTlistener);
    pauseOtherVideos(iframe);
    overrideCSS(iframe, {opacity: 1});
    overrideCSS($('img', div), {display: 'none'});
    $$remove('span, a', div);
  }
}

function getCoverUrl(id, name) {
  return `https://i.ytimg.com/vi${name.endsWith('.webp') ? '_webp' : ''}/${id}/${name}`;
}

function setUrlParams(url, params) {
  const u = new URL(url);
  for (const [k, v] of Object.entries(params))
    u.searchParams.set(k, v);
  return u.href;
}

function pauseOtherVideos(activePlayer) {
  for (const v of $$('.instant-youtube-embed', activePlayer.ownerDocument)) {
    if (v === activePlayer)
      continue;
    switch (v.localName) {
      case 'video':
        if (!v.paused)
          v.pause();
        break;
      case 'iframe':
        try {
          v.contentWindow.postMessage('{"event":"command", "func":"pauseVideo", "args":""}', '*');
        } catch (e) {}
        break;
    }
  }
}

function goFullscreen(el, enable) {
  if (enable !== false)
    el.webkitRequestFullScreen && el.webkitRequestFullScreen() ||
    el.mozRequestFullScreen && el.mozRequestFullScreen() ||
    el.requestFullScreen && el.requestFullScreen();
  else
    document.webkitCancelFullScreen && document.webkitCancelFullScreen() ||
    document.mozCancelFullScreen && document.mozCancelFullScreen() ||
    document.cancelFullScreen && document.cancelFullScreen();
}

function makePinnable(div) {
  div.firstElementChild.insertAdjacentHTML('beforeend',
    '<div size-gripper></div>' +
    '<div pin="top-left"></div>' +
    '<div pin="top-right"></div>' +
    '<div pin="bottom-right"></div>' +
    '<div pin="bottom-left"></div>');

  for (const pin of $$('[pin]', div)) {
    if (cfg.pinnable === 'hide')
      pin.setAttribute('transparent', '');
    pin.onclick = pinClicked;
  }
  $('[size-gripper]', div).addEventListener('mousedown', startResize, true);

  function pinClicked() {
    const pin = this;
    const pinIt = !div.hasAttribute('pinned') || !pin.hasAttribute('active');
    const corner = pin.getAttribute('pin');
    const video = $('video', div);
    const paused = video.paused;
    const fyte = fyteMap.get(div);
    if (pinIt) {
      for (const p of $$('[pin][active]', div))
        p.removeAttribute('active');
      pin.setAttribute('active', '');
      if (!fyte.unpinnedStyle) {
        fyte.unpinnedStyle = div.style.cssText;
        const stub = div.cloneNode();
        const img = $('img', div).cloneNode();
        img.style.opacity = 1;
        img.style.display = 'block';
        img.title = '';
        stub.appendChild(img);
        stub.onclick = e => $('[pin][active]', div).onclick(e);
        stub.style.setProperty('opacity', .3, 'important');
        stub.setAttribute('stub', '');
        fyte.stub = stub;
        div.parentNode.insertBefore(stub, div);
      }
      const size = constrainPinnedSize(div,
        localStorage.FYTEwidth || cfg.pinnedWidth);
      overrideCSS(div, {
        position: 'fixed',
        width: size.w + 'px',
        height: size.h + 'px',
        top: corner.includes('top') ? 0 : 'auto',
        left: corner.includes('left') ? 0 : 'auto',
        right: corner.includes('right') ? 0 : 'auto',
        bottom: corner.includes('bottom') ? 0 : 'auto',
        'z-index': 999999999,
      });
      adjustPinnedOffset(div, div, corner);
      div.setAttribute('pinned', corner);
      if (video && document.body)
        document.body.appendChild(div);
    } else { // unpin
      pin.removeAttribute('active');
      div.removeAttribute('pinned');
      div.style.cssText = fyte.unpinnedStyle;
      fyte.unpinnedStyle = '';
      if (fyte.stub) {
        if (video && document.body)
          fyte.stub.parentNode.replaceChild(div, fyte.stub);
        fyte.stub.remove();
        fyte.stub = null;
      }
    }
    if (paused)
      video.pause();
  }

  function startResize(e) {
    const siteSaved = localStorage.FYTEwidth;
    let saveAs = siteSaved ? 'site' : 'global';
    const oldSizeCSS = {w: div.style.width, h: div.style.height};
    const oldDraggable = div.draggable;
    div.draggable = false;

    const gripper = this;
    gripper.removeAttribute('tried-exceeding');
    gripper.innerHTML = `<div>
<div save-as="${saveAs}"><b>S</b> = Site mode: <span>${getSiteOnlyText()}</span></div>
${!siteSaved ? '' : '<div><b>R</b> = Reset to global size</div>'}
<div><b>Esc</b> = Cancel</div>
</div>`;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', resizeDone);
    document.addEventListener('keydown', resizeKeyDown);
    e.stopImmediatePropagation();
    return false;

    function getSiteOnlyText() {
      return saveAs === 'site' ? `only ${location.hostname}` : 'global';
    }

    function resize(e) {
      let deltaX = e.movementX || e.webkitMovementX || e.mozMovementX || 0;
      if (/right/.test(div.getAttribute('pinned')))
        deltaX = -deltaX;
      const newSize = constrainPinnedSize(div, div.clientWidth + deltaX);
      if (newSize.w !== div.clientWidth) {
        div.style.setProperty('width', newSize.w + 'px', 'important');
        div.style.setProperty('height', newSize.h + 'px', 'important');
        gripper.removeAttribute('tried-exceeding');
      } else if (newSize.triedExceeding) {
        gripper.setAttribute('tried-exceeding', '');
      }
      window.getSelection().removeAllRanges();
      return false;
    }

    function resizeDone() {
      div.draggable = oldDraggable;
      gripper.removeAttribute('tried-exceeding');
      gripper.innerHTML = '';
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', resizeDone);
      document.removeEventListener('keydown', resizeKeyDown);
      switch (saveAs) {
        case 'site':
          localStorage.FYTEwidth = div.clientWidth;
          break;
        case 'global':
          cfg.pinnedWidth = div.clientWidth;
          GM_setValue('pinnedWidth', cfg.pinnedWidth);
        // fallthrough to remove the locally saved value
        case 'reset':
          delete localStorage.FYTEwidth;
          break;
        case '':
          return false;
      }
      gripper.setAttribute('saveAs', saveAs);
      setTimeout(() => gripper.removeAttribute('saveAs'), 250);
      return false;
    }

    function resizeKeyDown(e) {
      switch (e.code) {
        case 'Escape':
          saveAs = 'cancel';
          div.style.width = oldSizeCSS.w;
          div.style.height = oldSizeCSS.h;
          break;
        case 'KeyS':
          saveAs = saveAs === 'site' ? 'global' : 'site';
          $('[save-as]', gripper).setAttribute('save-as', saveAs);
          $('[save-as] span', gripper).textContent = getSiteOnlyText();
          return false;
        case 'KeyR': {
          if (!siteSaved)
            return;
          saveAs = 'reset';
          const {w, h} = constrainPinnedSize(div, cfg.pinnedWidth);
          div.style.width = w;
          div.style.height = h;
          break;
        }
        default:
          return;
      }
      document.dispatchEvent(new MouseEvent('mouseup'));
      return false;
    }
  }
}

function makeDraggable(div) {
  div.draggable = true;
  div.addEventListener('dragstart', e => {
    const offsetY = e.offsetY || e.clientY - div.getBoundingClientRect().top;
    if (offsetY > div.clientHeight - 30) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData('text/plain', '');

    let dropZone = $create('div.dragndrop-placeholder');
    const fyte = fyteMap.get(div);
    const dropZoneHeight = 400 / fyte.cache.videoWidth * fyte.cache.videoHeight;

    document.body.addEventListener('dragenter', dragHandler);
    document.body.addEventListener('dragover', dragHandler);
    document.body.addEventListener('dragend', dragHandler);
    document.body.addEventListener('drop', dragHandler);

    function dragHandler(e) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      switch (e.type) {
        case 'dragover': {
          const playing = div.hasAttribute('playing');
          const stub = e.target.closest('.instant-youtube-container[stub]') === fyte.stub &&
                       fyte.stub;
          const gizmo = playing && !stub
            ? {left: 0, top: 0, right: innerWidth, bottom: innerHeight}
            : (stub || div).getBoundingClientRect();
          const x = e.clientX;
          const y = e.clientY;
          const cx = (gizmo.left + gizmo.right) / 2;
          const cy = (gizmo.top + gizmo.bottom) / 2;
          const stay = !!stub || y >= cy - 200 && y <= cy + 200 && x >= cx - 200 && x <= cx + 200;
          overrideCSS(dropZone, {
            top: y < cy || stay ? '0' : 'auto',
            bottom: y > cy || stay ? '0' : 'auto',
            left: x < cx || stay ? '0' : 'auto',
            right: x > cx || stay ? '0' : 'auto',
            width: playing && stay && stub ? stub.clientWidth + 'px' : '400px',
            height: playing && stay && stub ? stub.clientHeight + 'px' : dropZoneHeight + 'px',
            margin: playing && stay ? 'auto' : '0',
            position: !playing && stay || stub ? 'absolute' : 'fixed',
            'background-color': stub ?
              'rgba(0,0,255,0.5)' :
              stay ? 'rgba(255,255,0,0.4)' : 'rgba(0,255,0,0.2)',
          });
          adjustPinnedOffset(dropZone, div);
          (stay && !playing || stub ? (stub || div) : document.body).appendChild(dropZone);
          break;
        }
        case 'dragend':
        case 'drop': {
          const corner = calcPinnedCorner(dropZone);
          dropZone.remove();
          dropZone = null;
          document.body.removeEventListener('dragenter', dragHandler);
          document.body.removeEventListener('dragover', dragHandler);
          document.body.removeEventListener('dragend', dragHandler);
          document.body.removeEventListener('drop', dragHandler);
          if (e.type === 'dragend')
            break;
          if (div.hasAttribute('playing'))
            (corner ? $(`[pin="${corner}"]`, div) : fyte.stub).click();
          else
            startPlaying(div, {pin: corner});
        }
      }
    }
  });
}

function adjustPinnedOffset(el, self, corner) {
  let offset = 0;
  if (!corner) corner = calcPinnedCorner(el);
  for (const pin of $$(`.instant-youtube-container[pinned] [pin="${corner}"][active]`)) {
    const container = pin.closest('[pinned]');
    if (container !== el && container !== self) {
      const {top, bottom} = container.getBoundingClientRect();
      offset = Math.max(offset, el.style.top === '0px' ? bottom : innerHeight - top);
    }
  }
  if (offset)
    el.style[el.style.top === '0px' ? 'top' : 'bottom'] = offset + 'px';
}

function calcPinnedCorner(el) {
  const t = el.style.top !== 'auto';
  const l = el.style.left !== 'auto';
  const r = el.style.right !== 'auto';
  const b = el.style.bottom !== 'auto';
  return t && b && l && r ? '' : `${t ? 'top' : 'bottom'}-${l ? 'left' : 'right'}`;
}

function constrainPinnedSize(div, width) {
  const fyte = fyteMap.get(div);
  const maxWidth = window.innerWidth - 100 | 0;
  const triedExceeding = (width | 0) > maxWidth;
  width = Math.max(200, Math.min(maxWidth, width | 0));
  return {
    w: width,
    h: width / fyte.cache.videoWidth * fyte.cache.videoHeight,
    triedExceeding,
  };
}

function showOptions(e) {
  const [options] = translateHTML(`
<div class=instant-youtube-options>
  <span>
    <label tl style="width: 100% !important;">Size:&nbsp;
      <select data-action=resize>
        <option tl value=Original>Original
        <option tl value="Fit to width">Fit to width
        <option>360p
        <option>480p
        <option>720p
        <option>1080p
        <option tl value=Custom>Custom...
      </select>
    </label>&nbsp;
    <label data-action=resize-custom ${cfg.resize !== 'Custom' ? 'disabled' : ''}>
      <input type=number min=320 max=9999 tl-placeholder=width data-action=width step=1> x
      <input type=number min=240 max=9999 tl-placeholder=height data-action=height step=1>
    </label>
  </span>
  <label tl=content,title title=msgStoryboardTip>
    <input data-action=showStoryboard type=checkbox>
    msgStoryboard
  </label>
  <span>
    <label tl=content,title title=msgDirectTip>
      <input data-action=playHTML5 type=checkbox>
      msgDirect
    </label>
    &nbsp;
    <label tl=content,title title=msgDirectTip>
      <input data-action=playHTML5Shown type=checkbox>
      msgDirectShown
    </label>
  </span>
  <label tl=content,title title=msgSafeTip>
    <input data-action=skipCustom type=checkbox>
    msgSafe
  </label>
  <table>
    <tr>
      <td><label tl=content,title title=msgPinningTip>msgPinning</label></td>
      <td>
        <select data-action=pinnable>
          <option tl value=on>msgPinningOn
          <option tl value=hide>msgPinningHover
          <option tl value=off>msgPinningOff
        </select>
      </td>
    </tr>
  </table>
  <span data-action=buttons>
    <button tl data-action=ok>OK</button>
    <button tl data-action=cancel>Cancel</button>
  </span>
</div>
  `);
  for (const [k, v] of Object.entries(cfg)) {
    const el = $(`[data-action=${k}]`, options);
    if (el) el[el.type === 'checkbox' ? 'checked' : 'value'] = v;
  }
  $('[data-action=resize]', options).onchange = function () {
    const v = this.value !== 'Custom';
    const e = $('[data-action=resize-custom]', options);
    e.children[0].disabled = e.children[1].disabled = v;
    v ? e.setAttribute('disabled', '') : e.removeAttribute('disabled');
  };
  $('[data-action=buttons]', options).onclick = e => {
    const btn = e.target;
    if (btn.dataset.action !== 'ok') {
      options.remove();
      return;
    }
    let shouldAdjust;
    const oldCfg = Object.assign({}, cfg);
    for (const [k, v] of Object.entries(cfg)) {
      const el = $(`[data-action=${k}]`, options);
      const newVal = el && (
        el.type === 'checkbox' ? el.checked :
          el.type === 'number' ? el.valueAsNumber :
            el.value);
      if (newVal != null && newVal !== v) {
        GM_setValue(k, newVal);
        cfg[k] = newVal;
        shouldAdjust = true;
      }
    }
    options.remove();
    if (cfg.resize === 'Custom' && (cfg.width !== oldCfg.width || cfg.height !== oldCfg.height))
      updateCustomSize(cfg.width, cfg.height);
    if (cfg.showStoryboard !== oldCfg.showStoryboard)
      $$('.instant-youtube-container').forEach(updateHoverHandler);
    if (cfg.playHTML5 !== oldCfg.playHTML5 && cfg.playHTML5Shown) {
      const alt = _(`msgPlay${cfg.playHTML5 ? '' : 'HTML5'}`);
      for (const e of $$('.instant-youtube-alternative'))
        e.textContent = alt;
    }
    if (cfg.playHTML5Shown !== oldCfg.playHTML5Shown)
      updateAltPlayerCSS();
    if (shouldAdjust)
      adjustNodes(e, btn.closest('.instant-youtube-container'));
  };
  e.target.insertAdjacentElement('afterend', options);
}

function updateCustomSize(w, h) {
  cfg.width = Math.min(9999, Math.max(320, w | 0 || cfg.width | 0));
  cfg.height = Math.min(9999, Math.max(240, h | 0 || cfg.height | 0));
}

function updateAltPlayerCSS() {
  const ALT = '.instant-youtube-alternative:not(#foo)';
  styledom.textContent = styledom.textContent.split(ALT)[0] + /*language=CSS*/ `${ALT} {
    display: ${cfg.playHTML5Shown ? 'block' : 'none'} !important;
  }`;
}

function important(cssText, rx = /;/g) {
  return cssText.replace(rx, '!important;');
}

function $(sel, base = document) {
  return base.querySelector(sel) || 0;
}

function $$(sel, base = document) {
  return [...base.querySelectorAll(sel)];
}

function $create(tagCls, props, children) {
  const [tag, cls] = tagCls.split('.');
  const el = Object.assign(document.createElement(tag), props);
  if (cls)
    el.className = `instant-youtube-${cls}`;
  if (props && typeof props.style === 'object')
    overrideCSS(el, props.style);
  if (children && typeof children !== 'object')
    children = document.createTextNode(children);
  if (children instanceof Node)
    el.appendChild(children);
  else if (Array.isArray(children))
    el.append(...children.filter(Boolean));
  return el;
}

function $$remove(sel, base = document) {
  for (const el of base.querySelectorAll(sel))
    el.remove();
}

function overrideCSS(el, props) {
  const names = Object.keys(props);
  el.style.cssText = el.style.cssText
    .replace(new RegExp(`(^|\\s|;)(${names.join('|')})(:[^;]+)`, 'gi'), '$1')
    .replace(/[^;]\s*$/, '$&;')
    .replace(/^\s*;\s*/, '') + names.map(n => `${n}:${props[n]}!important;`).join(' ');
  return el;
}

// fix dumb Firefox bug
function floatPadding(node, style, dir) {
  const padding = style['padding' + dir];
  if (padding.indexOf('%') < 0)
    return parseFloat(padding);
  return parseFloat(padding) * (parseFloat(style.width) || node.clientWidth) / 100;
}

async function cleanupStorage() {
  cleanupStorage.timer = 0;
  const cutoff = Date.now() - CACHE_STALE_DURATION;
  // TODO: remove localStorage in 2024
  for (const k in localStorage) {
    if (k.startsWith(CACHE_PREFIX)) {
      try {
        const str = localStorage[k];
        const isObj = str[0] === '{';
        const val = isObj ? tryJSONparse(str) || false : str;
        const time = isObj ? val.lastUsed : parseInt(val, 36) * 1000;
        if (time > cutoff) {
          const res = isObj
            ? (val.lastUsed = new Date(time), val)
            : unpack(val, k.slice(CACHE_PREFIX.length));
          write(res);
        }
      } catch (e) {}
    }
  }
  // TODO: remove GM_listValues in 2024
  for (const k of GM_listValues())
    if (k.startsWith('cache-'))
      GM_deleteValue(k);
  try {
    /** @type {IDBIndex} */
    const store = await db({raw: true, write: true, index: 'lastUsed'});
    const req = store.openCursor(IDBKeyRange.upperBound(new Date(cutoff)));
    req.onerror = console.warn;
    req.onsuccess = () => {
      const cur = /** @type {IDBCursorWithValue} */ req.result; if (!cur) return;
      cur.delete().onerror = console.warn;
      cur.continue();
    };
  } catch (e) { console.warn(e); }
  await write().catch(console.warn);
  for (const k in localStorage)
    if (k.startsWith(CACHE_PREFIX))
      delete localStorage[k];
}

function initDB() {
  db = TinyIDB('FYTE', {
    onUpgrade() {
      this.result
      .createObjectStore('data', {keyPath: 'id'})
      .createIndex('lastUsed', 'u');
    },
  });
  cleanupStorage.timer = setTimeout(cleanupStorage, 1e3);
  return db;
}

async function read(ids) {
  const toRead = [];
  const toWrite = [];
  for (const id of ids) {
    const str = localStorage[CACHE_PREFIX + id];
    if (str) {
      toWrite.push(id);
      unpack(str, id);
    } else {
      toRead.push(id);
    }
  }
  if (toRead.length) {
    for (const val of await (db || initDB()).getMulti(toRead))
      if (val) unpack(val);
  }
  if (toWrite.length) {
    if (!cleanupStorage.timer) cleanupStorage.timer = setTimeout(cleanupStorage, 1000);
    toWrite.forEach(write);
  }
}

function unpack(data, id) {
  const old = !!id;
  const arr = (old ? data : data.a).split('\n');
  const obj = {
    id: id || (id = data.id),
    lastUsed: old ? new Date(parseInt(arr.shift(), 36) * 1000) : data.u,
  };
  for (let j = 0; j < CACHE_PROPS.length; j++) {
    const [key, type] = CACHE_PROPS[j];
    const v = arr[j] || '';
    obj[key] = type === 0 ? parseInt(v, 36) || 0
      : key === 'cover' ? getCoverUrl(id, v) || ''
        : v;
  }
  return (dbCache[id] = obj);
}

function write(data) {
  if (data) {
    if (!write.timer) write.timer = setTimeout(write, dbFlushDelay);
    const id = typeof data === 'object' ? data.id : data;
    dbCache[id] = data;
    dbFlush.add(id);
    return;
  }
  const toWrite = [];
  for (const id of dbFlush) {
    const obj = dbCache[id];
    let res = '';
    for (const [key, type] of CACHE_PROPS) {
      const v = obj[key];
      // not storing array values separately to minimize byte size
      res += `${res ? '\n' : ''}${!v ? ''
        : type === 0 ? (+v).toString(36)
          : key === 'cover' ? v.split('?')[0].split('/').pop()
            : v.replace(/\n/g, ' ')}`;
    }
    toWrite.push({
      a: res,
      u: obj.lastUsed,
      id,
    });
  }
  dbFlush.clear();
  write.timer = 0;
  return toWrite.length ? (db || initDB()).putMulti(toWrite) : Promise.resolve();
}

function tryJSONparse(s) {
  try {
    return JSON.parse(s);
  } catch (e) {}
}

function secondsToTimeString(sec) {
  const h = sec / 3600 | 0;
  const m = (sec / 60 | 0) % 60;
  const s = sec % 60;
  return `${h ? h + ':' : ''}${h && m < 10 ? 0 : ''}${m}:${s < 10 ? 0 : ''}${s}`;
}

function translateHTML(html) {
  const tmp = $create('div', {innerHTML: html.trim().replace(/\n\s*/g, '')});
  for (const node of $$('[tl]', tmp)) {
    for (const what of (node.getAttribute('tl') || 'content').split(',')) {
      let child;
      if (what === 'content') {
        for (const n of [...node.childNodes].reverse()) {
          if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
            child = n;
            break;
          }
        }
      } else
        child = node.getAttributeNode(what);
      if (!child)
        continue;
      const src = child.textContent;
      const srcTrimmed = src.trim();
      const tl = src.replace(srcTrimmed, _(srcTrimmed));
      if (src !== tl)
        child.textContent = tl;
    }
  }
  return [...tmp.childNodes];
}

function initTL() {
  const tlSource = {
    msgWatch: {
      en: 'watch on Youtube',
      ru: 'открыть на Youtube',
    },
    msgPlay: {
      en: 'Play with Youtube player',
      ru: 'Включить плеер Youtube',
    },
    msgPlayHTML5: {
      en: 'Play directly (up to 720p)',
      ru: 'Включить напрямую (макс. 720p)',
    },
    msgAltPlayerHint: {
      en: 'Shift-click to use alternative player',
      ru: 'Shift-клик для смены типа плеера',
    },
    Options: {
      ru: 'Опции',
    },
    'Size:': {
      ru: 'Размер:',
    },
    Original: {
      ru: 'Исходный',
    },
    'Fit to width': {
      ru: 'На всю ширину',
    },
    'Custom...': {
      ru: 'Настроить...',
    },
    width: {
      ru: 'ширина',
    },
    height: {
      ru: 'высота',
    },
    msgStoryboard: {
      en: 'Storyboard thumbnails on hover',
      ru: 'Раскадровка при наведении курсора',
    },
    msgStoryboardTip: {
      en: 'Show storyboard preview on mouse hover at the bottom',
      ru: 'Показывать миникадры при наведении мыши на низ кавер-картинки',
    },
    msgDirect: {
      en: 'Play directly',
      ru: 'Встроенный плеер браузера',
    },
    msgDirectTip: {
      en: 'Shift-click a thumbnail to use the alternative player',
      ru: 'Удерживайте клавишу Shift при щелчке на картинке для альтернативного плеера',
    },
    msgDirectShown: {
      en: 'Show under play button',
      ru: 'Показывать под кнопкой ►',
    },
    msgInvidious: {
      en: 'Use https://invidio.us to play videos',
      ru: 'Использовать https://invidio.us в плеере',
    },
    msgSafe: {
      en: 'Safe (skip videos with enablejsapi=1)',
      ru: 'Консервативный режим',
    },
    msgSafeTip: {
      en: 'Do not process customized videos with enablejsapi=1 parameter (requires page reload)',
      ru: 'Не обрабатывать нестандартные видео с параметром enablejsapi=1 ' +
          '(подействует после обновления страницы)',
    },
    msgPinning: {
      en: 'Corner pinning',
      ru: 'Закрепление по углам',
    },
    msgPinningTip: {
      en: 'Enable corner pinning controls when a video is playing.\n' +
          'To restore the video click the active corner pin or the original video placeholder.',
      ru: 'Включить шпильки по углам для закрепления видео во время просмотра.\n' +
          'Для отмены можно нажать еще раз на активированный угол или на заглушку, ' +
          'где исходно было видео',
    },
    msgPinningOn: {
      en: 'On',
      ru: 'Да',
    },
    msgPinningHover: {
      en: 'On, hover a corner to show',
      ru: 'Да, при наведении курсора',
    },
    msgPinningOff: {
      en: 'Off',
      ru: 'Нет',
    },
    OK: {
      ru: 'ОК',
    },
    Cancel: {
      ru: 'Оменить',
    },
  };
  const browserLang = navigator.language || navigator.languages && navigator.languages[0] || '';
  const browserLangMajor = browserLang.replace(/-.+/, '');
  const tl = {};
  for (const k of Object.keys(tlSource)) {
    const langs = tlSource[k];
    const text = langs[browserLang] || langs[browserLangMajor];
    if (text)
      tl[k] = text;
  }
  return src => tl[src] || src;
}

function initPlayButton() {
  [playbtn] = translateHTML(`
    <svg class="instant-youtube-play-button">
        <path fill-rule="evenodd" clip-rule="evenodd" fill="#1F1F1F" class="ytp-large-play-button-svg" d="M84.15,26.4v6.35c0,2.833-0.15,5.967-0.45,9.4c-0.133,1.7-0.267,3.117-0.4,4.25l-0.15,0.95c-0.167,0.767-0.367,1.517-0.6,2.25c-0.667,2.367-1.533,4.083-2.6,5.15c-1.367,1.4-2.967,2.383-4.8,2.95c-0.633,0.2-1.316,0.333-2.05,0.4c-0.767,0.1-1.3,0.167-1.6,0.2c-4.9,0.367-11.283,0.617-19.15,0.75c-2.434,0.034-4.883,0.067-7.35,0.1h-2.95C38.417,59.117,34.5,59.067,30.3,59c-8.433-0.167-14.05-0.383-16.85-0.65c-0.067-0.033-0.667-0.117-1.8-0.25c-0.9-0.133-1.683-0.283-2.35-0.45c-2.066-0.533-3.783-1.5-5.15-2.9c-1.033-1.067-1.9-2.783-2.6-5.15C1.317,48.867,1.133,48.117,1,47.35L0.8,46.4c-0.133-1.133-0.267-2.55-0.4-4.25C0.133,38.717,0,35.583,0,32.75V26.4c0-2.833,0.133-5.95,0.4-9.35l0.4-4.25c0.167-0.966,0.417-2.05,0.75-3.25c0.7-2.333,1.567-4.033,2.6-5.1c1.367-1.434,2.967-2.434,4.8-3c0.633-0.167,1.333-0.3,2.1-0.4c0.4-0.066,0.917-0.133,1.55-0.2c4.9-0.333,11.283-0.567,19.15-0.7C35.65,0.05,39.083,0,42.05,0L45,0.05c2.467,0,4.933,0.034,7.4,0.1c7.833,0.133,14.2,0.367,19.1,0.7c0.3,0.033,0.833,0.1,1.6,0.2c0.733,0.1,1.417,0.233,2.05,0.4c1.833,0.566,3.434,1.566,4.8,3c1.066,1.066,1.933,2.767,2.6,5.1c0.367,1.2,0.617,2.284,0.75,3.25l0.4,4.25C84,20.45,84.15,23.567,84.15,26.4z M33.3,41.4L56,29.6L33.3,17.75V41.4z"><title tl>msgAltPlayerHint</title></path>
        <polygon fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF"
                 points="33.3,41.4 33.3,17.75 56,29.6"></polygon>
      </svg>`);
  return playbtn;
}

/**
 * @param {string} dbName
 * @param {Object} [opts]
 * @param {string} [opts.store]
 * @param {string} [opts.index]
 * @param {number} [opts.timeout]
 * @param {number} [opts.version]
 * @param {(this:IDBOpenDBRequest, e:IDBVersionChangeEvent)=>void} [opts.onUpgrade]
 * @returns {TinyIDB}
 */
function TinyIDB(dbName, {
  store = 'data',
  index,
  version,
  timeout = 250,
  onUpgrade = function (evt) {
    if (store) evt.target.result.createObjectStore(store);
  },
} = {}) {
  /** @typedef {TinyIDBSource | ((config?:TinyIDBConfig) => Promise<TinyIDBSource>)} TinyIDB */
  /** @typedef {number|string|Date|BufferSource|IDBKeyRange} IDBKey */
  /** @typedef {IDBObjectStore | IDBIndex | {
   *  getMulti: (keys: IDBKey[]) => ?[]
   *  putMulti: (values: Object[] | [val:?, key:IDBKey][]) => IDBKey[]
   * }} TinyIDBSource */
  /** @typedef TinyIDBConfig
   * @prop {boolean} [raw] - returns the raw IDBObjectStore | IDBIndex object
   * @prop {boolean} [write]
   * @prop {string} [store]
   * @prop {string} [index]
   */
  let timer;
  /** @type {IDBDatabase} */
  let db;
  let dbPromise;
  const RW = ['add', 'clear', 'delete', 'put', 'putMulti'];
  const handler = {
    apply: proxyApply,
    get: (cfg, method) => proxyGet.bind(null, cfg, method),
  };
  return new Proxy(TinyIDB, handler);

  function proxyApply(_, thisObj, [cfg]) {
    return cfg && cfg.raw
      ? proxyGet(cfg)
      : new Proxy(cfg || {}, handler);
  }
  /**
   * @param {TinyIDBConfig} cfg
   * @param {keyof IDBObjectStore | 'getMulti' | 'putMulti'} method
   * @param {...?[]} args
   * @return {Promise<?>}
   */
  async function proxyGet(cfg, method, ...args) {
    if (!db) await (dbPromise || open());
    const {
      raw,
      index: txIndex = index,
      store: txStore = store,
      write = RW.includes(method),
    } = cfg;
    const arg = args[0];
    const isMulti = !raw && (method === 'getMulti' || method === 'putMulti');
    if (isMulti) {
      if (!Array.isArray(arg)) throw new Error('Argument must be an array');
      if (!arg.length) return [];
    }
    const tx = db.transaction(txStore, write ? 'readwrite' : 'readonly');
    let source = tx.objectStore(txStore);
    if (timer) clearTimeout(timer);
    if (txIndex) source = source.index(txIndex);
    if (timeout) tx.oncomplete = tx.onerror = closeLater;
    if (raw) return source;
    let req, resolve, reject;
    const promise = new Promise((ok, ko) => (resolve = ok) && (reject = ko));
    if (isMulti) {
      source._results = [];
      method = method.slice(0, 3);
      const addKey = method === 'put' && !source.keyPath;
      for (let i = 0, val, len = arg.length; i < len; i++) {
        val = arg[i];
        req = addKey
          ? source[method](val[0], val[1])
          : source[method](val);
        req.onsuccess = onExecMulti;
        req.onerror = reject;
      }
    } else {
      req = source[method](...args);
      req.onsuccess = onExec;
      req.onerror = reject;
    }
    req._resolve = resolve;
    return promise;
  }
  function onExec() {
    this._resolve(this.result);
  }
  function onExecMulti() {
    const {result, _resolve: cb, source: {_results: arr}} = this;
    arr.push(result);
    if (cb) cb(arr);
  }
  function open() {
    dbPromise = new Promise((resolve, reject) => {
      const op = indexedDB.open(dbName, version);
      op.onupgradeneeded = onUpgrade;
      op.onsuccess = onOpened;
      op.onerror = reject;
      op._resolve = resolve;
    });
    return dbPromise;
  }
  function onOpened() {
    this._resolve(db = this.result);
    dbPromise = null;
  }
  function closeLater() {
    timer = setTimeout(closeNow, timeout);
  }
  function closeNow() {
    timer = 0;
    if (db) {
      db.close();
      db = null;
    }
  }
}

function injectStylesIfNeeded(force) {
  if (!fytedom[0] && !force)
    return;
  styledom = styledom || GM_addStyle(/*language=CSS*/ `
[class^="instant-youtube-"]:not(#foo) {
  margin: 0;
  padding: 0;
  transform: none;
}
` + important(/*language=CSS*/ `
.instant-youtube-container {
  contain: strict;
  display: block;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  margin: auto;
  font: normal 14px/1.0 sans-serif, Arial, Helvetica, Verdana;
  text-align: center;
  background: black;
  break-inside: avoid-column;
}
.instant-youtube-container[disabled] {
  background: #888;
}
.instant-youtube-container[disabled] .instant-youtube-storyboard {
  display: none;
}
.instant-youtube-container[pinned] {
  box-shadow: 0 0 30px black;
}
.instant-youtube-container[playing] {
  contain: none;
}
.instant-youtube-wrapper {
  width: 100%;
  height: 100%;
}
.instant-youtube-play-button {
  display: block;
  position: absolute;
  width: 85px;
  height: 60px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.instant-youtube-loading-spinner {
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  pointer-events: none;
  background: url("data:image/gif;base64,R0lGODlhFAAUAJEDAMzMzLOzs39/f////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgADACwAAAAAFAAUAAACPJyPqcuNItyCUJoQBo0ANIxpXOctYHaQpYkiHfM2cUrCNT0nqr4uudsz/IC5na/2Mh4Hu+HR6YBaplRDAQAh+QQFCgADACwEAAIADAAGAAACFpwdcYupC8BwSogR46xWZHl0l8ZYQwEAIfkEBQoAAwAsCAACAAoACgAAAhccMKl2uHxGCCvO+eTNmishcCCYjWEZFgAh+QQFCgADACwMAAQABgAMAAACFxwweaebhl4K4VE6r61DiOd5SfiN5VAAACH5BAUKAAMALAgACAAKAAoAAAIYnD8AeKqcHIwwhGntEWLkO3CcB4biNEIFACH5BAUKAAMALAQADAAMAAYAAAIWnDSpAHa4GHgohCHbGdbipnBdSHphAQAh+QQFCgADACwCAAgACgAKAAACF5w0qXa4fF6KUoVQ75UaA7Bs3yeNYAkWACH5BAUKAAMALAIABAAGAAwAAAIXnCU2iMfaRghqTmMp1moAoHyfIYIkWAAAOw==");
}
.instant-youtube-container:hover .ytp-large-play-button-svg {
  fill: #CC181E;
}
.instant-youtube-alternative {
  display: block;
  position: absolute;
  width: 20em;
  height: 20px;
  top: 50%;
  left: 0;
  right: 0;
  margin: 60px auto;
  border: none;
  text-align: center;
  text-decoration: none;
  text-shadow: 1px 1px 3px black;
  color: white;
  z-index: 8;
  font-weight: normal;
  font-size: 12px;
}
.instant-youtube-alternative:hover {
  text-decoration: underline;
  color: white;
  background: transparent;
}
.instant-youtube-embed {
  z-index: 10;
  background: transparent;
  transition: opacity .25s;
}
.instant-youtube-title {
  z-index: 20;
  display: block;
  position: absolute;
  width: auto;
  top: 0;
  left: 0;
  right: 0;
  padding: 7px;
  border: none;
  text-shadow: 1px 1px 2px black;
  text-align: center;
  text-decoration: none;
  color: white;
  background-color: #0008;
}
.instant-youtube-title strong {
  font: bold 14px/1.0 sans-serif, Arial, Helvetica, Verdana;
}
.instant-youtube-title strong::after {
  content: " - ${_('msgWatch')}";
  font-weight: normal;
  margin-right: 1ex;
}
.instant-youtube-title span {
  color: white;
}
.instant-youtube-title span::before {
  content: "(";
}
.instant-youtube-title span::after {
  content: ")";
}
.instant-youtube-title i::before {
  content: ", ";
}
.instant-youtube-container .instant-youtube-title i {
  all: unset;
  opacity: .5;
  font-style: normal;
  color: white;
}
@-webkit-keyframes instant-youtube-fadein {
  from { opacity: 0 }
  to { opacity: 1 }
}
@-moz-keyframes instant-youtube-fadein {
  from { opacity: 0 }
  to { opacity: 1 }
}
@keyframes instant-youtube-fadein {
  from { opacity: 0 }
  to { opacity: 1 }
}
.instant-youtube-container:not(:hover) .instant-youtube-title[hidden] {
  display: none;
}
.instant-youtube-title:hover {
  text-decoration: underline;
}
.instant-youtube-title strong {
  color: white;
}
.instant-youtube-options-button {
  opacity: 0.6;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 1.5ex 2ex;
  font-size: 11px;
  text-shadow: 1px 1px 2px black;
  color: white;
}
.instant-youtube-options-button:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.5);
}
.instant-youtube-options {
  display: flex;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 1ex 1ex 2ex 2ex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.5;
  text-align: left;
  opacity: 1;
  color: white;
  background: black;
  z-index: 999;
}
.instant-youtube-options * {
  width: auto;
  height: auto;
  font: inherit;
  font-size: 13px;
  vertical-align: middle;
  text-transform: none;
  text-align: left;
  border-radius: 0;
  text-decoration: none;
  color: white;
  background: black;
}
.instant-youtube-options > * {
  margin-top: 1ex;
}
.instant-youtube-options table {
  all: unset;
  display: table;
}
.instant-youtube-options tr {
  all: unset;
  display: table-row;
}
.instant-youtube-options td {
  all: unset;
  display: table-cell;
  padding: 2px;
}
.instant-youtube-options label > * {
  display: inline;
}
.instant-youtube-options select {
  padding: .5ex .25ex;
  border: 1px solid #444;
  -webkit-appearance: menulist;
}
.instant-youtube-options [data-action="resize-custom"] input {
  width: 9ex;
  padding: .5ex .5ex .4ex;
  border: 1px solid #666;
}
.instant-youtube-options [data-action="buttons"] {
  margin-top: 1em;
}
.instant-youtube-options button {
  margin: 0 1ex 0 0;
  padding: .5ex 2ex;
  border: 2px solid gray;
  font-weight: bold;
}
.instant-youtube-options button:hover {
  border-color: white;
}
.instant-youtube-options label[disabled] {
  opacity: 0.25;
}
.instant-youtube-storyboard {
  height: 33%;
  max-height: 90px;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: visible;
  transition: background-color .5s .25s;
}
.instant-youtube-storyboard[data-loaded]:hover {
  background-color: #0004;
}
.instant-youtube-storyboard div {
  display: block;
  position: absolute;
  bottom: 0;
  pointer-events: none;
  border: 3px solid #888;
  box-shadow: 2px 2px 10px black;
  transition: opacity .25s ease;
  background-color: transparent;
  background-origin: content-box;
  opacity: 0;
}
.instant-youtube-storyboard div::after {
  content: attr(data-time);
  opacity: .5;
  color: #fff;
  background-color: #000;
  font-weight: bold;
  font-size: 10px;
  position: absolute;
  bottom: 4px;
  left: 4px;
  padding: 1px 3px;
}
.instant-youtube-storyboard:hover div {
  opacity: 1;
}
.instant-youtube-thumbnail {
  all: initial;
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  object-fit: cover;
  transition: opacity .5s ease-out;
}
.instant-youtube-container [pin] {
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  top: auto; bottom: auto; left: auto; right: auto;
  border-style: solid;
  transition: opacity 2.5s ease-in, opacity 0.4s ease-out;
  opacity: 0;
  z-index: 100;
}
.instant-youtube-container[playing]:hover [pin]:not([transparent]) {
  opacity: 1;
}
.instant-youtube-container[playing] [pin]:hover {
  cursor: alias;
  opacity: 1;
  transition: opacity 0s;
}
.instant-youtube-container [pin=top-left][active] { border-top-color: green; }
.instant-youtube-container [pin=top-left]:hover { border-top-color: #fc0; }
.instant-youtube-container [pin=top-left] {
  top: 0; left: 0;
  border-width: 10px 10px 0 0;
  border-color: red transparent transparent transparent;
}
.instant-youtube-container [pin=top-left][transparent] {
  border-width: 10px 10px 0 0;
}
.instant-youtube-container [pin=top-right][active] { border-right-color: green; }
.instant-youtube-container [pin=top-right]:hover { border-right-color: #fc0; }
.instant-youtube-container [pin=top-right] {
  top: 0; right: 0;
  border-width: 0 10px 10px 0;
  border-color: transparent red transparent transparent;
}
.instant-youtube-container [pin=top-right][transparent] {
  border-width: 0 10px 10px 0;
}
.instant-youtube-container [pin=bottom-right][active] { border-bottom-color: green; }
.instant-youtube-container [pin=bottom-right]:hover { border-bottom-color: #fc0; }
.instant-youtube-container [pin=bottom-right] {
  bottom: 0; right: 0;
  border-width: 0 0 10px 10px;
  border-color: transparent transparent red transparent;
}
.instant-youtube-container [pin=bottom-right][transparent] {
  border-width: 0 0 10px 10px;
}
.instant-youtube-container [pin=bottom-left][active] { border-left-color: green; }
.instant-youtube-container [pin=bottom-left]:hover { border-left-color: #fc0; }
.instant-youtube-container [pin=bottom-left] {
  bottom: 0; left: 0;
  border-width: 10px 0 0 10px;
  border-color: transparent transparent transparent red;
}
.instant-youtube-container [pin=bottom-left][transparent] {
  border-width: 10px 0 0 10px;
}
.instant-youtube-dragndrop-placeholder {
  z-index: 999999999;
  background: rgba(0, 255, 0, 0.1);
  border: 2px dotted green;
  box-sizing: border-box;
  pointer-events: none;
}
.instant-youtube-container [size-gripper] {
  width: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  cursor: e-resize;
  border-color: rgba(50,100,255,0.5);
  border-width: 12px;
  background: rgba(50,100,255,0.2);
  z-index: 99;
  opacity: 0;
  transition: opacity .1s ease-in-out, border-color .1s ease-in-out;
}
.instant-youtube-container[pinned*="right"] [size-gripper] {
  border-style: none none none solid;
  left: -4px;
}
.instant-youtube-container[pinned*="left"] [size-gripper] {
  border-style: none solid none none;
  right: -4px;
}
.instant-youtube-container [size-gripper]:hover {
  opacity: 1;
}
.instant-youtube-container [size-gripper]:active {
  opacity: 1;
  width: auto;
  left: -4px;
  right: -4px;
}
.instant-youtube-container [size-gripper][tried-exceeding] {
  border-color: rgba(255,0,0,0.5);
}
.instant-youtube-container [size-gripper][saveAs="global"] {
  border-color: rgba(0,255,0,0.5);
}
.instant-youtube-container [size-gripper][saveAs="site"] {
  border-color: rgba(0,255,255,0.5);
}
.instant-youtube-container [size-gripper][saveAs="reset"] {
  border-color: rgba(255,255,0,0.5);
}
.instant-youtube-container [size-gripper][saveAs="cancel"] {
  border-color: rgba(255,0,255,0.25);
}
.instant-youtube-container [size-gripper] > div {
  white-space: nowrap;
  color: white;
  font-weight: normal;
  line-height: 1.25;
  text-align: left;
  position: absolute;
  top: 50%;
  padding: 1ex 1em 1ex;
  background-color: rgba(80,150,255,0.5);
}
.instant-youtube-container [size-gripper] [save-as="site"] {
  font-weight: bold;
  color: yellow;
}
.instant-youtube-container[pinned*="left"] [size-gripper] > div {
  right: 0;
}
`, /;\n/g).replace(/(::\w+)?\s+{/g, ':not(#_)$1 {'));
  // move our rules to the end of HEAD to increase CSS specificity
  if (styledom.nextElementSibling && document.head)
    document.head.appendChild(styledom);
  updateAltPlayerCSS();
}
