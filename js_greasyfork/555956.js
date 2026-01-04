// ==UserScript==
// @name         Roler's Bookmarklets
// @namespace    https://github.com/rRoler/bookmarklets
// @version      1.3.0
// @description  Various simple bookmarklets
// @author       Roler
// @match        http*://mangadex.org/*
// @match        http*://www.amazon.co.jp/*
// @match        http*://www.amazon.com/*
// @match        http*://bookwalker.jp/*
// @match        http*://r18.bookwalker.jp/*
// @match        http*://global.bookwalker.jp/*
// @match        http*://viewer-trial.bookwalker.jp/*
// @match        http*://booklive.jp/*
// @match        http*://www.kodansha.co.jp/*
// @match        http*://kodansha.us/*
// @match        http*://mangaplus.shueisha.co.jp/*
// @match        http*://mangaplus-creators.jp/*
// @match        http*://shonenjumpplus.com/*
// @supportURL   https://github.com/rRoler/bookmarklets/issues
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      wsrv.nl
// @connect      c.roler.dev
// @connect      www.amazon.co.jp
// @connect      www.amazon.com
// @connect      c.bookwalker.jp
// @connect      res.booklive.jp
// @connect      dvs-cover.kodansha.co.jp
// @connect      cdn.kodansha.us
// @connect      kitsu.app
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555956/Roler%27s%20Bookmarklets.user.js
// @updateURL https://update.greasyfork.org/scripts/555956/Roler%27s%20Bookmarklets.meta.js
// ==/UserScript==

(() => {
/*!
 * MIT License
 * 
 * Copyright (c) 2023 Roler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * ---
 * 
 * Third Party Dependencies:
 * 
 * 
 * file-saver@2.0.5 -- MIT
 * 
 * The MIT License
 *
 * Copyright © 2016 [Eli Grey][1].
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * [1]: http://eligrey.com
 * 
 * 
 * 
 * 
 * fflate@0.8.2 -- MIT
 * 
 * MIT License
 *
 * Copyright (c) 2023 Arjun Barrett
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * 
 * 
 * heroicons@2.2.0 -- MIT
 * 
 * MIT License
 *
 * Copyright (c) Tailwind Labs, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

class FetchClient {
  m_queue = [];
  m_processing = false;
  m_abortControllers = new Map();
  m_bucketLastRefill = Date.now();
  m_activeRequests = 0;
  constructor(options = {}) {
    const {
      rateLimitRequests = Infinity,
      rateLimitTime = 1000
    } = options;
    this.m_rateLimitRequests = rateLimitRequests;
    this.m_rateLimitTime = rateLimitTime;
    this.m_bucketTokens = rateLimitRequests;
    this.fetchFunction = options.fetchFunction || fetch;
  }
  async processQueue() {
    if (this.m_processing) return;
    this.m_processing = true;
    while (this.m_queue.length > 0 && this.m_activeRequests < this.m_rateLimitRequests) {
      await this.refillBucket();
      if (this.m_bucketTokens > 0) {
        const queueItem = this.m_queue.shift();
        if (queueItem) {
          this.m_bucketTokens--;
          this.m_activeRequests++;
          queueItem.request().finally(() => {
            this.m_activeRequests--;
            this.processQueue();
          });
        }
      } else {
        const waitTime = this.m_calculateWaitTime();
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    this.m_processing = false;
  }
  m_calculateWaitTime() {
    const now = Date.now();
    const timeSinceLastRefill = now - this.m_bucketLastRefill;
    const timeUntilNextRefill = this.m_rateLimitTime - timeSinceLastRefill % this.m_rateLimitTime;
    return Math.max(timeUntilNextRefill, 100);
  }
  async refillBucket() {
    const now = Date.now();
    const timePassed = now - this.m_bucketLastRefill;
    const tokensToAdd = Math.floor(timePassed / this.m_rateLimitTime) * this.m_rateLimitRequests;
    if (tokensToAdd > 0) {
      this.m_bucketTokens = Math.min(this.m_bucketTokens + tokensToAdd, this.m_rateLimitRequests);
      this.m_bucketLastRefill = now;
    }
  }
  m_getRetryAfterValue(headers) {
    for (const [key, value] of headers.entries()) {
      if (key.toLowerCase().endsWith('retry-after')) {
        return value;
      }
    }
    return null;
  }
  async m_fetch(input, init) {
    const fetchFunction = init?.fetchFunction || this.fetchFunction || fetch;
    const requestId = init?.requestId || crypto.randomUUID();
    const abortController = new AbortController();
    this.m_abortControllers.set(requestId, abortController);
    const _request = async () => {
      try {
        const response = await fetchFunction(input, {
          signal: abortController.signal,
          ...init
        });
        if (response.status === 429) {
          const retryAfter = this.m_getRetryAfterValue(response.headers);
          throw new Error(`Rate limit exceeded. Retry after: ${retryAfter} seconds`);
        }
        return response;
      } finally {
        this.m_abortControllers.delete(requestId);
      }
    };
    return new Promise((resolve, reject) => {
      this.m_queue.push({
        id: requestId,
        request: async () => {
          try {
            const response = await _request();
            resolve(response);
          } catch (error) {
            reject(error);
          }
        },
        abort: () => {
          abortController.abort();
          this.m_abortControllers.delete(requestId);
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        }
      });
      this.processQueue();
    });
  }
  m_abort(requestId) {
    const index = this.m_queue.findIndex(item => item.id === requestId);
    if (index > -1) {
      const [queueItem] = this.m_queue.splice(index, 1);
      queueItem.abort();
    }
  }
  m_abortAll() {
    this.m_queue.forEach(queueItem => this.m_abort(queueItem.id));
  }
}
async function gmFetch(input, init) {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const {
    method = 'GET',
    headers = {},
    body,
    signal,
    anonymous,
    ...otherOptions
  } = init || {};
  const headersObj = {};
  if (!anonymous) {
    headersObj['Origin'] = window.location.origin;
    headersObj['Referer'] = window.location.href;
  }
  if (headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        headersObj[key] = value;
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        headersObj[key] = value;
      });
    } else {
      Object.assign(headersObj, headers);
    }
  }
  const abortError = new DOMException('The operation was aborted', 'AbortError');
  if (signal?.aborted) throw abortError;
  let response;
  try {
    let gmRequest;
    response = await new Promise((resolve, reject) => {
      const abortHandler = () => {
        if (gmRequest) gmRequest.abort();
        reject(abortError);
      };
      const addAbortHandler = () => {
        if (signal) signal.addEventListener('abort', abortHandler);
      };
      const removeAbortHandler = () => {
        if (signal) signal.removeEventListener('abort', abortHandler);
      };
      addAbortHandler();
      gmRequest = GM_xmlhttpRequest({
        method: method.toUpperCase(),
        url: url,
        headers: headersObj,
        anonymous,
        data: body,
        responseType: 'blob',
        onload: response => {
          try {
            removeAbortHandler();
            const responseHeaders = new Headers();
            if (response.responseHeaders) {
              const headerLines = response.responseHeaders.trim().split('\n');
              headerLines.forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                  const key = line.substring(0, colonIndex).trim();
                  const value = line.substring(colonIndex + 1).trim();
                  responseHeaders.set(key, value);
                }
              });
            }
            const fetchResponse = new Response(response.response, {
              status: response.status,
              statusText: response.statusText,
              headers: responseHeaders
            });
            resolve(fetchResponse);
          } catch (error) {
            reject(error);
          }
        },
        onerror: error => {
          removeAbortHandler();
          reject(error);
        },
        ontimeout: () => {
          removeAbortHandler();
          reject(new Error('GM_xmlhttpRequest timed out'));
        },
        onabort: () => {
          removeAbortHandler();
          reject(new Error('GM_xmlhttpRequest was aborted'));
        }
      });
    });
  } catch (gmError) {
    console.warn('GM_xmlhttpRequest failed, falling back to native fetch:', gmError);
    response = await fetch(input, {
      method,
      headers,
      body,
      signal,
      ...otherOptions
    });
  }
  return response;
}

// User agents
const DESKTOP_USER_AGENT =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0';

// URLs
const ROLER_CDN_URL =
	/* @__PURE__ */
	new URL('https://c.roler.dev');

const WSRV_URL =
	/* @__PURE__ */
	new URL('https://wsrv.nl');

const MANGAPLUS_URL =
	/* @__PURE__ */
	new URL('https://mangaplus.shueisha.co.jp');

const MANGAPLUS_API_URL =
	/* @__PURE__ */
	new URL('https://jumpg-webapi.tokyo-cdn.com/api');

const MANGAPLUS_CREATORS_URL =
	/* @__PURE__ */
	new URL('https://mangaplus-creators.jp');

const SHONENJUMPPLUS_URL =
	/* @__PURE__ */
	new URL('https://shonenjumpplus.com');

// MangaDex URLs
const MANGADEX_URL =
	/* @__PURE__ */
	new URL('https://mangadex.org');

const MANGADEX_CANARY_URL =
	/* @__PURE__ */
	new URL('https://canary.mangadex.dev');

const MANGADEX_SANDBOX_URL =
	/* @__PURE__ */
	new URL('https://sandbox.mangadex.dev');

const MANGADEX_API_URL =
	/* @__PURE__ */
	new URL('https://api.mangadex.org');

const MANGADEX_DEV_API_URL =
	/* @__PURE__ */
	new URL('https://api.mangadex.dev');

const MANGADEX_AUTH_URL =
	/* @__PURE__ */
	new URL('https://auth.mangadex.org');

const MANGADEX_DEV_AUTH_URL =
	/* @__PURE__ */
	new URL('https://auth.mangadex.dev');

const BOOKWALKER_URL =
	/* @__PURE__ */
	new URL('https://bookwalker.jp');

const BOOKWALKER_GLOBAL_URL =
	/* @__PURE__ */
	new URL('https://global.bookwalker.jp');

const BOOKWALKER_VIEWER_TRIAL_URL =
	/* @__PURE__ */
	new URL('https://viewer-trial.bookwalker.jp');

const BOOKWALKER_R18_URL =
	/* @__PURE__ */
	new URL('https://r18.bookwalker.jp');

const BOOKLIVE_URL =
	/* @__PURE__ */
	new URL('https://booklive.jp');

const BOOKLIVE_CDN_URL =
	/* @__PURE__ */
	new URL('https://res.booklive.jp');

const KODANSHA_JAPAN_URL =
	/* @__PURE__ */
	new URL('https://www.kodansha.co.jp');

const KODANSHA_US_URL =
	/* @__PURE__ */
	new URL('https://kodansha.us');

const KODANSHA_US_API_URL =
	/* @__PURE__ */
	new URL('https://api.kodansha.us');

// Tracking site URLs
const ANILIST_URL =
	/* @__PURE__ */
	new URL('https://anilist.co');

const ANIME_PLANET_URL =
	/* @__PURE__ */
	new URL('https://www.anime-planet.com');

const KITSU_URL =
	/* @__PURE__ */
	new URL('https://kitsu.app');

const MANGAUPDATES_URL =
	/* @__PURE__ */
	new URL('https://www.mangaupdates.com');

const MYANIMELIST_URL =
	/* @__PURE__ */
	new URL('https://myanimelist.net');

const NOVELUPDATES_URL =
	/* @__PURE__ */
	new URL('https://www.novelupdates.com');

const wsrvUrl = WSRV_URL.origin;
function getWsrvUrl(options) {
  const cdnURL = new URL(options.cdnUrl || wsrvUrl);
  cdnURL.searchParams.set('url', options.url);
  if (options.defaultUrl) cdnURL.searchParams.set('default', options.defaultUrl);
  if (options.output) cdnURL.searchParams.set('output', options.output);
  if (options.quality && ['jpeg', 'tiff', 'webp'].includes(options.output || 'jpeg')) {
    if (options.quality < 1) options.quality = 1;
    if (options.quality > 100) options.quality = 100;
    cdnURL.searchParams.set('q', options.quality.toString());
  }
  if (options.width) cdnURL.searchParams.set('width', options.width.toString());
  if (options.height) cdnURL.searchParams.set('height', options.height.toString());
  if (options.cx) cdnURL.searchParams.set('cx', options.cx.toString());
  if (options.cy) cdnURL.searchParams.set('cy', options.cy.toString());
  if (options.cw) cdnURL.searchParams.set('cw', options.cw.toString());
  if (options.ch) cdnURL.searchParams.set('ch', options.ch.toString());
  return cdnURL;
}
async function getWsrvResource(options) {
  const errorPrefix = 'WSRV Error: ';
  if (!options.url.startsWith('http')) throw new Error(errorPrefix + 'Invalid URL');
  const url = getWsrvUrl(options);
  const response = await gmFetch(url.toString(), {
    anonymous: true
  });
  if (!response.ok) throw new Error(errorPrefix + response.statusText);
  return await (options.output === 'json' ? response.json() : response.blob());
}
function getWsrvImage(options) {
  return getWsrvResource(options);
}
function getWsrvData(options) {
  if (!options.output) options.output = 'json';
  return getWsrvResource(options);
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var FileSaver_min$1 = {exports: {}};

var FileSaver_min = FileSaver_min$1.exports;

var hasRequiredFileSaver_min;

function requireFileSaver_min () {
	if (hasRequiredFileSaver_min) return FileSaver_min$1.exports;
	hasRequiredFileSaver_min = 1;
	(function (module, exports) {
		(function(a,b){b();})(FileSaver_min,function(){function b(a,b){return "undefined"==typeof b?b={autoBom:false}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c);},d.onerror=function(){console.error("could not download file");},d.send();}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,false);try{b.send();}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"));}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",true,true,window,0,0,0,80,20,false,false,false,false,0,null),a.dispatchEvent(b);}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof commonjsGlobal&&commonjsGlobal.global===commonjsGlobal?commonjsGlobal:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href);},4E4),setTimeout(function(){e(j);},0));}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else {var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i);});}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null;},k.readAsDataURL(b);}else {var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m);},4E4);}});f.saveAs=g.saveAs=g,(module.exports=g);});

		
	} (FileSaver_min$1));
	return FileSaver_min$1.exports;
}

var FileSaver_minExports = /*@__PURE__*/ requireFileSaver_min();
var fileSaver = /*@__PURE__*/getDefaultExportFromCjs(FileSaver_minExports);

// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new i32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return { b: b, r: r };
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
freb(fdeb, 0);
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >> 8) | ((x & 0x00FF) << 8)) >> 1;
}
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    return new u8(v.subarray(s, e));
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    ,
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
    if (!nt)
        throw e;
    return e;
};
// empty
var et = /*#__PURE__*/ new u8(0);
// CRC32 table
var crct = /*#__PURE__*/ (function () {
    var t = new Int32Array(256);
    for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
            c = ((c & 1) && -306674912) ^ (c >>> 1);
        t[i] = c;
    }
    return t;
})();
// CRC32
var crc = function () {
    var c = -1;
    return {
        p: function (d) {
            // closures have awful performance
            var cr = c;
            for (var i = 0; i < d.length; ++i)
                cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
            c = cr;
        },
        d: function () { return ~c; }
    };
};
// Walmart object spread
var mrg = function (a, b) {
    var o = {};
    for (var k in a)
        o[k] = a[k];
    for (var k in b)
        o[k] = b[k];
    return o;
};
// write bytes
var wbytes = function (d, b, v) {
    for (; v; ++b)
        d[b] = v, v >>>= 8;
};
// text encoder
var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder();
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
try {
    td.decode(et, { stream: true });
}
catch (e) { }
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
function strToU8(str, latin1) {
    var i; 
    if (te)
        return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function (v) { ar[ai++] = v; };
    for (var i = 0; i < l; ++i) {
        if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + ((l - i) << 1));
            n.set(ar);
            ar = n;
        }
        var c = str.charCodeAt(i);
        if (c < 128 || latin1)
            w(c);
        else if (c < 2048)
            w(192 | (c >> 6)), w(128 | (c & 63));
        else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                w(240 | (c >> 18)), w(128 | ((c >> 12) & 63)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
        else
            w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
    }
    return slc(ar, 0, ai);
}
// extra field length
var exfl = function (ex) {
    var le = 0;
    if (ex) {
        for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
                err(9);
            le += l + 4;
        }
    }
    return le;
};
// write zip header
var wzh = function (d, b, f, fn, u, c, ce, co) {
    var fl = fn.length, ex = f.extra, col = co && co.length;
    var exl = exfl(ex);
    wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
    if (ce != null)
        d[b++] = 20, d[b++] = f.os;
    d[b] = 20, b += 2; // spec compliance? what's that?
    d[b++] = (f.flag << 1) | (c < 0 && 8), d[b++] = u && 8;
    d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
    var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
    if (y < 0 || y > 119)
        err(10);
    wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >> 1)), b += 4;
    if (c != -1) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c < 0 ? -c - 2 : c);
        wbytes(d, b + 8, f.size);
    }
    wbytes(d, b + 12, fl);
    wbytes(d, b + 14, exl), b += 16;
    if (ce != null) {
        wbytes(d, b, col);
        wbytes(d, b + 6, f.attrs);
        wbytes(d, b + 10, ce), b += 14;
    }
    d.set(fn, b);
    b += fl;
    if (exl) {
        for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d, b, +k);
            wbytes(d, b + 2, l);
            d.set(exf, b + 4), b += 4 + l;
        }
    }
    if (col)
        d.set(co, b), b += col;
    return b;
};
// write zip footer (end of central directory)
var wzf = function (o, b, c, d, e) {
    wbytes(o, b, 0x6054B50); // skip disk
    wbytes(o, b + 8, c);
    wbytes(o, b + 10, c);
    wbytes(o, b + 12, d);
    wbytes(o, b + 16, e);
};
/**
 * A pass-through stream to keep data uncompressed in a ZIP archive.
 */
var ZipPassThrough = /*#__PURE__*/ (function () {
    /**
     * Creates a pass-through stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     */
    function ZipPassThrough(filename) {
        this.filename = filename;
        this.c = crc();
        this.size = 0;
        this.compression = 0;
    }
    /**
     * Processes a chunk and pushes to the output stream. You can override this
     * method in a subclass for custom behavior, but by default this passes
     * the data through. You must call this.ondata(err, chunk, final) at some
     * point in this method.
     * @param chunk The chunk to process
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.process = function (chunk, final) {
        this.ondata(null, chunk, final);
    };
    /**
     * Pushes a chunk to be added. If you are subclassing this with a custom
     * compression algorithm, note that you must push data from the source
     * file only, pre-compression.
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        this.c.p(chunk);
        this.size += chunk.length;
        if (final)
            this.crc = this.c.d();
        this.process(chunk, final || false);
    };
    return ZipPassThrough;
}());
// TODO: Better tree shaking
/**
 * A zippable archive to which files can incrementally be added
 */
var Zip = /*#__PURE__*/ (function () {
    /**
     * Creates an empty ZIP archive to which files can be added
     * @param cb The callback to call whenever data for the generated ZIP archive
     *           is available
     */
    function Zip(cb) {
        this.ondata = cb;
        this.u = [];
        this.d = 1;
    }
    /**
     * Adds a file to the ZIP archive
     * @param file The file stream to add
     */
    Zip.prototype.add = function (file) {
        var _this = this;
        if (!this.ondata)
            err(5);
        // finishing or finished
        if (this.d & 2)
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, false);
        else {
            var f = strToU8(file.filename), fl_1 = f.length;
            var com = file.comment, o = com && strToU8(com);
            var u = fl_1 != file.filename.length || (o && (com.length != o.length));
            var hl_1 = fl_1 + exfl(file.extra) + 30;
            if (fl_1 > 65535)
                this.ondata(err(11, 0, 1), null, false);
            var header = new u8(hl_1);
            wzh(header, 0, file, f, u, -1);
            var chks_1 = [header];
            var pAll_1 = function () {
                for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
                    var chk = chks_2[_i];
                    _this.ondata(null, chk, false);
                }
                chks_1 = [];
            };
            var tr_1 = this.d;
            this.d = 0;
            var ind_1 = this.u.length;
            var uf_1 = mrg(file, {
                f: f,
                u: u,
                o: o,
                t: function () {
                    if (file.terminate)
                        file.terminate();
                },
                r: function () {
                    pAll_1();
                    if (tr_1) {
                        var nxt = _this.u[ind_1 + 1];
                        if (nxt)
                            nxt.r();
                        else
                            _this.d = 1;
                    }
                    tr_1 = 1;
                }
            });
            var cl_1 = 0;
            file.ondata = function (err, dat, final) {
                if (err) {
                    _this.ondata(err, dat, final);
                    _this.terminate();
                }
                else {
                    cl_1 += dat.length;
                    chks_1.push(dat);
                    if (final) {
                        var dd = new u8(16);
                        wbytes(dd, 0, 0x8074B50);
                        wbytes(dd, 4, file.crc);
                        wbytes(dd, 8, cl_1);
                        wbytes(dd, 12, file.size);
                        chks_1.push(dd);
                        uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file.crc, uf_1.size = file.size;
                        if (tr_1)
                            uf_1.r();
                        tr_1 = 1;
                    }
                    else if (tr_1)
                        pAll_1();
                }
            };
            this.u.push(uf_1);
        }
    };
    /**
     * Ends the process of adding files and prepares to emit the final chunks.
     * This *must* be called after adding all desired files for the resulting
     * ZIP file to work properly.
     */
    Zip.prototype.end = function () {
        var _this = this;
        if (this.d & 2) {
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
            return;
        }
        if (this.d)
            this.e();
        else
            this.u.push({
                r: function () {
                    if (!(_this.d & 1))
                        return;
                    _this.u.splice(-1, 1);
                    _this.e();
                },
                t: function () { }
            });
        this.d = 3;
    };
    Zip.prototype.e = function () {
        var bt = 0, l = 0, tl = 0;
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
        }
        var out = new u8(tl + 22);
        for (var _b = 0, _c = this.u; _b < _c.length; _b++) {
            var f = _c[_b];
            wzh(out, bt, f, f.f, f.u, -f.c - 2, l, f.o);
            bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
        }
        wzf(out, bt, this.u.length, tl, l);
        this.ondata(null, out, true);
        this.d = 2;
    };
    /**
     * A method to terminate any internal workers used by the stream. Subsequent
     * calls to add() will fail.
     */
    Zip.prototype.terminate = function () {
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            f.t();
        }
        this.d = 2;
    };
    return Zip;
}());

let isUserScript = false;
const userAgentDesktop = DESKTOP_USER_AGENT;
function enableUserScriptFeatures() {
  isUserScript = true;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function isUrlLocallyStored(url) {
  return url.startsWith('blob:') || url.startsWith('data:');
}
function openNewTab(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
function formatRegexText(text) {
  const toReplace = [['uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'], ['numid', '[0-9]+']];
  let newText = text;
  toReplace.forEach(strings => newText = newText.replaceAll(`:${strings[0]}`, strings[1]));
  return newText;
}
function getMatch(string, regex, index = 0) {
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}
function splitArray(array, chunkSize = 100) {
  const arrayCopy = [...array];
  const resArray = [];
  while (arrayCopy.length) resArray.push(arrayCopy.splice(0, chunkSize));
  return resArray;
}
function waitForElement(reference, noElement = false) {
  const getElement = () => typeof reference === 'string' ? document.body.querySelector(reference) : document.body.contains(reference) ? reference : null;
  let element = getElement();
  return new Promise(resolve => {
    if (noElement ? !element : element) return resolve(element);
    const observer = new MutationObserver(() => {
      element = getElement();
      if (noElement ? !element : element) {
        resolve(element);
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}
function parseStorage(key) {
  const value = localStorage.getItem(key);
  if (value) return JSON.parse(value);
}
function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function createSVG(options) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (options.svg.attributes) setAttributes(svg, options.svg.attributes);
  if (options.svg.styles) setStyles(svg, options.svg.styles);
  for (const pathOptions of options.paths) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (pathOptions.attributes) setAttributes(path, pathOptions.attributes);
    if (pathOptions.styles) setStyles(path, pathOptions.styles);
    svg.append(path);
  }
  return svg;
}
function setStyles(element, styles) {
  for (const style in styles) {
    if (styles[style].endsWith('!important')) element.style.setProperty(style, styles[style].slice(0, -10), 'important');else element.style.setProperty(style, styles[style]);
  }
}
function getStyles(element, styles) {
  const resStyles = {};
  for (const style of styles || element.style) {
    const value = element.style.getPropertyValue(style);
    const priority = element.style.getPropertyPriority(style);
    resStyles[style] = priority ? `${value} !${priority}` : value;
  }
  return resStyles;
}
function setAttributes(element, attributes) {
  for (const attribute in attributes) element.setAttribute(attribute, attributes[attribute]);
}
function createUrl(base, path = '/', query = {}) {
  const url = new URL(base);
  url.pathname = path;
  for (const key in query) {
    const value = query[key];
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, item);
    } else url.searchParams.set(key, value.toString());
  }
  return url;
}
async function copyText(text) {
  let copied = false;
  await navigator.clipboard.writeText(text).then(() => {
    console.debug('Copied to clipboard:\n' + text);
    copied = true;
  }, () => {
    console.error('Failed to copy to clipboard:\n' + text);
    copied = false;
  });
  return copied;
}
function filterFilename(name, options) {
  const replaceString = options?.replaceString || '_';
  const isPath = !!options?.isPath;
  const extensionRegex = /\.[a-z0-9]+$/i;
  const extension = getMatch(name.trim(), extensionRegex) || '';
  const filter = (str, removeExtension = true) => str.trim().replace(removeExtension ? extensionRegex : '', '').normalize('NFKC').replace(/[\\/:"*?<>|]/g, replaceString).trim().slice(0, 255 - extension.length).trim();
  const pathParts = name.split(/[\\/]/g);
  const filename = isPath ? pathParts.map((p, i) => filter(p, i === pathParts.length - 1)).join('/') : filter(name);
  return filename + extension;
}
async function saveFile(data, filename, options) {
  const name = filterFilename(filename || 'rbm-file');
  const path = filterFilename(options?.path || '', {
    isPath: true
  });
  const isString = typeof data === 'string';
  const url = isString ? data : URL.createObjectURL(data);
  const save = () => new Promise((resolve, reject) => {
    const useFileSaver = () => {
      try {
        fileSaver.saveAs(url, name);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    if (!isUserScript || !options?.path) return useFileSaver();
    const useFallback = error => {
      console.warn(error);
      useFileSaver();
    };
    try {
      GM_download({
        url,
        name: filterFilename(`${path ? path + '/' : ''}${name}`, {
          isPath: true
        }),
        // @ts-ignore
        saveAs: !!options?.saveAs,
        headers: {
          Origin: window.location.origin,
          Referer: window.location.href
        },
        onload: () => resolve(),
        onerror: useFallback
      });
    } catch (error) {
      useFallback(error);
    }
  });
  try {
    await save();
  } finally {
    if (!isString) URL.revokeObjectURL(url);
  }
  await sleep(100);
}
async function zipFiles(files, options = {}) {
  const {
    filename = 'archive.zip',
    onProgress,
    signal
  } = options;
  return new Promise((resolve, reject) => {
    const chunks = [];
    const zip = new Zip((error, chunk, final) => {
      if (error) return reject(error);
      chunks.push(chunk);
      if (final) {
        const blob = new Blob(chunks, {
          type: 'application/zip'
        });
        resolve(new File([blob], filename, {
          type: blob.type
        }));
      }
    });
    onProgress?.(0, files.length);
    const processFiles = async () => {
      for (const [index, file] of files.entries()) {
        const fileIndex = index + 1;
        if (signal?.aborted) {
          zip.end();
          reject(new DOMException('Zipping aborted', 'AbortError'));
          return;
        }
        try {
          const zipData = new Uint8Array(await file.arrayBuffer());
          const zipFile = new ZipPassThrough(filterFilename(file.name));
          zip.add(zipFile);
          zipFile.push(zipData, true);
          onProgress?.(fileIndex, files.length);
        } catch (error) {
          zip.end();
          reject(error);
          return;
        }
        if (fileIndex === files.length) zip.end();
      }
    };
    processFiles();
  });
}
function formatStringVariable(name) {
  return `%${name}%`;
}
function replaceStringVariable(string, variables) {
  let newString = string;
  variables.forEach(variable => {
    newString = newString.replaceAll(variable[0], variable[1]);
  });
  return newString;
}
function addKeyShortcutListener(keys, callback, parent = document.body) {
  let pressedKeys = [];
  parent.addEventListener('keydown', e => {
    const pressedKey = e.code || e.key.toUpperCase();
    if (!pressedKeys.includes(pressedKey)) pressedKeys.push(pressedKey);
  });
  parent.addEventListener('keyup', () => {
    if (keys.length === pressedKeys.length && keys.every(key => pressedKeys.includes(key))) {
      callback();
    }
    pressedKeys = [];
  });
}
function hideImageElement(element) {
  setStyles(element, {
    width: 'fit-content',
    height: 'fit-content',
    opacity: '0',
    position: 'absolute',
    top: '-10000px',
    'z-index': '-10000',
    'pointer-events': 'none'
  });
  return element;
}
async function getImageDimensions(url, options) {
  if (!isUrlLocallyStored(url)) {
    const cdnData = await getWsrvData({
      url
    }).catch(console.warn);
    if (cdnData && cdnData.width > 0 && cdnData.height > 0) return {
      width: cdnData.width,
      height: cdnData.height
    };
  }
  const imageUrl = options?.localUrl || url;
  const replacementUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NgAAIAAAUAAR4f7BQAAAAASUVORK5CYII=';
  const imageElement = new Image();
  hideImageElement(imageElement);
  document.body.append(imageElement);
  try {
    return await new Promise((resolve, reject) => {
      function fallbackMethod() {
        imageElement.onerror = e => {
          reject(e);
        };
        imageElement.onload = () => {
          resolve({
            width: imageElement.naturalWidth,
            height: imageElement.naturalHeight
          });
        };
        imageElement.src = imageUrl;
      }
      try {
        const observer = new ResizeObserver(_entries => {
          const imageWidth = imageElement.naturalWidth;
          const imageHeight = imageElement.naturalHeight;
          if (imageWidth > 0 && imageHeight > 0) {
            observer.disconnect();
            imageElement.src = replacementUrl;
            resolve({
              width: imageWidth,
              height: imageHeight
            });
          }
        });
        imageElement.onerror = e => {
          console.warn(e);
          observer.disconnect();
          fallbackMethod();
        };
        observer.observe(imageElement);
      } catch (error) {
        fallbackMethod();
      }
      imageElement.src = imageUrl;
    });
  } finally {
    imageElement.remove();
  }
}
async function cropImage(options) {
  options.output = options.output || 'png';
  options.quality = options.quality || 98;
  if (options.quality < 1) options.quality = 1;
  if (options.quality > 100) options.quality = 100;
  const isLocal = isUrlLocallyStored(options.url);
  let croppedImage = !isLocal ? await getWsrvImage(options).catch(console.warn) : null;
  if (!croppedImage && isLocal || !croppedImage && options.localUrl) {
    const imageElement = new Image();
    hideImageElement(imageElement);
    document.body.append(imageElement);
    try {
      await new Promise((resolve, reject) => {
        imageElement.onerror = e => reject(e);
        imageElement.onload = () => resolve();
        imageElement.src = options.localUrl || options.url;
      });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const croppedWidth = options.cw || (options.width || imageElement.naturalWidth) - (options.cx || 0);
      const croppedHeight = options.ch || (options.height || imageElement.naturalHeight) - (options.cy || 0);
      canvas.width = croppedWidth;
      canvas.height = croppedHeight;
      ctx?.drawImage(imageElement, options.cx || 0, options.cy || 0, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
      croppedImage = await new Promise(resolve => canvas?.toBlob(blob => resolve(blob), `image/${options.output}`, options.quality / 100));
    } finally {
      imageElement.remove();
    }
  }
  if (!croppedImage) throw new Error('Failed to crop image.');
  return croppedImage;
}
function formatCSV(data) {
  return data.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function formatXMLTag(name, value, indent = 0) {
  return `${'\t'.repeat(indent)}<${name}>${value}</${name}>\n`;
}

class Component {
  constructor(componentElement = document.createElement('div'), {
    defaultStyles = true,
    defaultEvents = true
  } = {}) {
    this.m_componentElement = componentElement;
    if (defaultStyles) this.m_setDefaultStyles();
    if (defaultEvents) this.m_addDefaultEvents();
  }
  m_setDefaultStyles(element = this.m_componentElement) {
    setStyles(element, {
      color: componentColors.text,
      'font-family': 'Poppins,Verdana,sans-serif !important',
      'font-size': '16px',
      'font-weight': 'normal',
      'line-height': '20px'
    });
  }
  m_addDefaultEvents(element = this.m_componentElement) {
    waitForElement(element).then(() => {
      element.dispatchEvent(new CustomEvent('componentadded'));
      waitForElement(element, true).then(() => {
        element.dispatchEvent(new CustomEvent('componentremoved'));
        this.m_addDefaultEvents();
      });
    });
  }
  m_add(parent = document.body) {
    return parent.appendChild(this.m_componentElement);
  }
  m_remove() {
    this.m_componentElement.remove();
  }
  m_replace(withElement) {
    this.m_componentElement.replaceWith(withElement);
  }
  m_hidden = false;
  m_displayStyles = {};
  m_hide() {
    if (this.m_hidden) return;
    this.m_hidden = true;
    this.m_displayStyles = getStyles(this.m_componentElement, ['display']);
    setStyles(this.m_componentElement, {
      display: 'none !important'
    });
  }
  m_show() {
    if (!this.m_hidden) return;
    this.m_hidden = false;
    setStyles(this.m_componentElement, this.m_displayStyles);
  }
  m_disabled = false;
  m_opacityStyles = {};
  m_disable() {
    if (this.m_disabled) return;
    this.m_disabled = true;
    this.m_opacityStyles = getStyles(this.m_componentElement, ['opacity', 'pointer-events']);
    setStyles(this.m_componentElement, {
      opacity: '0.5 !important',
      'pointer-events': 'none !important'
    });
  }
  m_enable() {
    if (!this.m_disabled) return;
    this.m_disabled = false;
    setStyles(this.m_componentElement, this.m_opacityStyles);
  }
  m_generateId() {
    return `bm-component-${Math.random().toString(36).substring(2, 15)}`;
  }
}
let componentColors = {
  text: '#000',
  primary: '#b5e853',
  secondary: '#cccccc',
  background: '#fff',
  accent: '#3c3c3c',
  warning: '#ffcf0e',
  error: '#FF4040'
};
function setComponentColors(colors) {
  componentColors = {
    ...componentColors,
    ...colors
  };
}

class Button extends Component {
  constructor(text, callback) {
    super(document.createElement('button'));
    setStyles(this.m_componentElement, {
      'font-size': '20px',
      'font-weight': 'bold',
      'line-height': '24px',
      border: 'none',
      'border-radius': '8px',
      cursor: 'pointer',
      padding: '4px 8px'
    });
    this.m_componentElement.innerText = text;
    this.m_componentElement.addEventListener('click', callback);
  }
}
class PrimaryButton extends Button {
  constructor(text, callback) {
    super(text, callback);
    setStyles(this.m_componentElement, {
      'background-color': componentColors.primary
    });
  }
}
class SecondaryButton extends Button {
  constructor(text, callback) {
    super(text, callback);
    setStyles(this.m_componentElement, {
      'background-color': componentColors.secondary
    });
  }
}

class TextInput extends Component {
  constructor(defaultValue = '', {
    labelText
  } = {}) {
    super(document.createElement('span'), {
      defaultStyles: false
    });
    const inputId = this.m_generateId();
    const listId = this.m_generateId();
    if (labelText) {
      const label = document.createElement('label');
      label.innerText = labelText;
      this.m_setDefaultStyles(label);
      label.setAttribute('for', inputId);
      this.m_componentElement.append(label);
    }
    const input = document.createElement('input');
    if (typeof defaultValue === 'string') input.value = defaultValue;else input.value = defaultValue[0];
    this.m_setDefaultStyles(input);
    setStyles(input, {
      'font-size': '18px',
      border: `1px solid ${componentColors.secondary}`,
      'border-radius': '4px',
      'background-color': componentColors.background,
      padding: '2px 8px'
    });
    input.setAttribute('id', inputId);
    this.m_componentElement.append(input);
    this.m_inputElement = input;
    if (Array.isArray(defaultValue)) {
      input.setAttribute('list', listId);
      const dataList = document.createElement('datalist');
      dataList.setAttribute('id', listId);
      defaultValue.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.innerText = value;
        dataList.append(option);
      });
      this.m_componentElement.append(dataList);
    }
  }
}
class TextArea extends Component {
  constructor(defaultValue = '', {
    rows,
    cols,
    labelText
  } = {}) {
    super(document.createElement('span'), {
      defaultStyles: false
    });
    const textareaId = this.m_generateId();
    if (labelText) {
      const label = document.createElement('label');
      label.innerText = labelText;
      this.m_setDefaultStyles(label);
      label.setAttribute('for', textareaId);
      this.m_componentElement.append(label);
    }
    const textarea = document.createElement('textarea');
    textarea.value = defaultValue;
    this.m_setDefaultStyles(textarea);
    setStyles(textarea, {
      'font-size': '18px',
      border: `1px solid ${componentColors.secondary}`,
      'border-radius': '4px',
      'background-color': componentColors.background,
      padding: '2px 8px'
    });
    textarea.setAttribute('id', textareaId);
    if (rows) textarea.setAttribute('rows', rows.toString());
    if (cols) textarea.setAttribute('cols', cols.toString());
    this.m_componentElement.append(textarea);
    this.m_textareaElement = textarea;
  }
}

class Select extends Component {
  constructor(values, {
    labelText
  } = {}) {
    super(document.createElement('span'), {
      defaultStyles: false
    });
    const selectId = this.m_generateId();
    if (labelText) {
      const label = document.createElement('label');
      label.innerText = labelText;
      this.m_setDefaultStyles(label);
      label.setAttribute('for', selectId);
      this.m_componentElement.append(label);
    }
    const select = document.createElement('select');
    this.m_setDefaultStyles(select);
    setStyles(select, {
      'font-size': '18px',
      border: `1px solid ${componentColors.secondary}`,
      'border-radius': '4px',
      'background-color': componentColors.background,
      padding: '2px 8px'
    });
    select.setAttribute('id', selectId);
    this.m_componentElement.append(select);
    this.m_selectElement = select;
    values.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.innerText = value;
      select.append(option);
    });
  }
}

class Checkbox extends Component {
  constructor(callback = () => {}, {
    labelText
  } = {}) {
    super(document.createElement('span'), {
      defaultStyles: false
    });
    setStyles(this.m_componentElement, {
      gap: '8px',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center'
    });
    const inputId = this.m_generateId();
    const input = document.createElement('input');
    this.m_setDefaultStyles(input);
    setStyles(input, {
      appearance: 'checkbox',
      width: '18px',
      height: '18px',
      margin: '0',
      'accent-color': componentColors.primary,
      border: `1px solid ${componentColors.secondary}`,
      'border-radius': '2px',
      cursor: 'pointer'
    });
    input.setAttribute('id', inputId);
    input.setAttribute('type', 'checkbox');
    input.addEventListener('change', () => callback(input.checked));
    this.m_componentElement.append(input);
    this.m_checkboxElement = input;
    if (labelText) {
      const label = document.createElement('label');
      label.innerText = labelText;
      this.m_setDefaultStyles(label);
      setStyles(label, {
        cursor: 'pointer'
      });
      label.setAttribute('for', inputId);
      this.m_componentElement.append(label);
    }
  }
}

var name = "heroicons";

console.debug(name, 'included');
const solidIconOptions = {
  svg: {
    attributes: {
      fill: 'currentColor',
      viewBox: '0 0 24 24'
    },
    styles: {
      width: '24px',
      height: '24px'
    }
  },
  paths: [{
    attributes: {
      'fill-rule': 'evenodd',
      'clip-rule': 'evenodd'
    }
  }]
};

/**
 * <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
 *   <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
 * </svg>
 * **/
const xMarkSolid = () => {
  const options = solidIconOptions;
  options.paths[0].attributes.d = 'M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z';
  return createSVG(options);
};

class Modal extends Component {
  constructor({
    title,
    content,
    buttons
  }) {
    super();
    setStyles(this.m_componentElement, {
      'z-index': '1000000',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center'
    });
    const background = document.createElement('div');
    setStyles(background, {
      position: 'fixed',
      top: '0',
      left: '0',
      height: '100%',
      width: '100%',
      'background-color': 'rgba(0, 0, 0, 0.4)',
      'backdrop-filter': 'blur(4px)'
    });
    background.addEventListener('click', () => this.m_remove());
    this.m_componentElement.append(background);
    const box = document.createElement('div');
    setStyles(box, {
      'z-index': '1',
      'min-width': '300px',
      'max-width': '80vw',
      'max-height': '100vh',
      'background-color': componentColors.background,
      'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.4)',
      'border-radius': '8px',
      margin: '8px',
      padding: '8px'
    });
    this.m_componentElement.append(box);
    const headerContainer = document.createElement('div');
    setStyles(headerContainer, {
      'max-height': '32px',
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      gap: '8px',
      'padding-bottom': '8px'
    });
    box.append(headerContainer);
    const titleContainer = document.createElement('span');
    if (title) titleContainer.innerText = title;
    this.m_setDefaultStyles(titleContainer);
    setStyles(titleContainer, {
      'font-size': '24px',
      'line-height': '32px',
      'font-weight': 'bold',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap'
    });
    headerContainer.append(titleContainer);
    const close = document.createElement('button');
    const closeIcon = xMarkSolid();
    setStyles(close, {
      width: '32px',
      height: '32px',
      'flex-shrink': '0',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      padding: '0'
    });
    setStyles(closeIcon, {
      width: '100%',
      height: '100%',
      cursor: 'pointer'
    });
    close.addEventListener('click', () => this.m_remove());
    close.append(closeIcon);
    headerContainer.append(close);
    const contentContainer = document.createElement('div');
    if (typeof content === 'string') contentContainer.innerText = content;else contentContainer.append(content);
    this.m_setDefaultStyles(contentContainer);
    setStyles(contentContainer, {
      'text-align': 'center',
      'max-height': '75vh',
      'overflow-y': 'auto',
      padding: '4px'
    });
    box.append(contentContainer);
    if (buttons) {
      const footerContainer = document.createElement('div');
      this.m_setDefaultStyles(footerContainer);
      setStyles(footerContainer, {
        'max-height': '50px',
        display: 'flex',
        'align-items': 'center',
        gap: '8px',
        'padding-top': '8px',
        'overflow-x': 'auto'
      });
      const footerMargin = document.createElement('div');
      setStyles(footerMargin, {
        'margin-left': 'auto'
      });
      footerContainer.append(footerMargin);
      buttons.forEach(button => {
        setStyles(button.m_componentElement, {
          'flex-shrink': '0'
        });
        button.m_add(footerContainer);
      });
      box.append(footerContainer);
    }
    let isAdded = false;
    let bodyOverflows = {};
    this.m_componentElement.addEventListener('componentadded', () => {
      if (isAdded) return;
      isAdded = true;
      bodyOverflows = getStyles(document.body, ['overflow', 'overflow-y', 'overflow-x']);
      setStyles(document.body, {
        overflow: 'hidden !important'
      });
    });
    this.m_componentElement.addEventListener('componentremoved', () => {
      if (!isAdded) return;
      isAdded = false;
      setStyles(document.body, bodyOverflows);
    });
  }
}
async function alertModal(text, level) {
  switch (level) {
    case 'warning':
      console.warn(text);
      break;
    case 'error':
      console.error(text);
      break;
    default:
      console.log(text);
      break;
  }
  try {
    const okButton = new PrimaryButton('OK', () => {
      modal.m_remove();
    });
    const modal = new Modal({
      title: level?.toUpperCase().concat('!'),
      content: text.toString(),
      buttons: [okButton]
    });
    modal.m_add();
    okButton.m_componentElement.focus();
    return await new Promise(resolve => modal.m_componentElement.addEventListener('componentremoved', () => resolve()));
  } catch (error) {
    console.error(error);
    return alert(text);
  }
}
function selectModal(text, options) {
  const select = new Select(options, {
    labelText: text
  });
  setStyles(select.m_selectElement, {
    width: '90%'
  });
  let value;
  const okButton = new PrimaryButton('OK', () => {
    value = select.m_selectElement.value;
    modal.m_remove();
  });
  const cancelButton = new SecondaryButton('Cancel', () => {
    value = null;
    modal.m_remove();
  });
  const modal = new Modal({
    content: select.m_componentElement,
    buttons: [okButton, cancelButton]
  });
  select.m_selectElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') okButton.m_componentElement.click();
  });
  modal.m_add();
  select.m_selectElement.focus();
  return new Promise(resolve => modal.m_componentElement.addEventListener('componentremoved', () => resolve(value)));
}
function checkboxModal(text, options, defaultValues = []) {
  const selectedOptions = [];
  const checkboxes = options.map(option => {
    const checkbox = new Checkbox(checked => {
      if (checked) {
        selectedOptions.push(option);
      } else {
        selectedOptions.splice(selectedOptions.indexOf(option), 1);
      }
      updateSelectAllCheckbox();
    }, {
      labelText: option
    });
    return {
      value: option,
      element: checkbox.m_componentElement,
      checkboxElement: checkbox.m_checkboxElement
    };
  });
  const selectAllCheckbox = new Checkbox(checked => {
    if (checked) {
      checkboxes.forEach(checkbox => {
        if (!checkbox.checkboxElement.checked) checkbox.checkboxElement.click();
      });
    } else {
      checkboxes.forEach(checkbox => {
        if (checkbox.checkboxElement.checked) checkbox.checkboxElement.click();
      });
    }
  });
  const updateSelectAllCheckbox = () => {
    const allChecked = checkboxes.every(checkbox => checkbox.checkboxElement.checked);
    const allUnchecked = checkboxes.every(checkbox => !checkbox.checkboxElement.checked);
    if (allChecked) {
      selectAllCheckbox.m_checkboxElement.checked = true;
      selectAllCheckbox.m_checkboxElement.indeterminate = false;
    } else if (allUnchecked) {
      selectAllCheckbox.m_checkboxElement.checked = false;
      selectAllCheckbox.m_checkboxElement.indeterminate = false;
    } else {
      selectAllCheckbox.m_checkboxElement.checked = false;
      selectAllCheckbox.m_checkboxElement.indeterminate = true;
    }
  };
  let values;
  const okButton = new PrimaryButton('OK', () => {
    values = selectedOptions;
    modal.m_remove();
  });
  const cancelButton = new SecondaryButton('Cancel', () => {
    values = null;
    modal.m_remove();
  });
  const contentContainer = document.createElement('div');
  setStyles(contentContainer, {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'start',
    gap: '8px'
  });
  contentContainer.append(selectAllCheckbox.m_componentElement, ...checkboxes.map(checkbox => checkbox.element));
  const modal = new Modal({
    title: text,
    content: contentContainer,
    buttons: [okButton, cancelButton]
  });
  modal.m_add();
  checkboxes.forEach(checkbox => {
    if (defaultValues.includes(checkbox.value)) checkbox.checkboxElement.click();
  });
  okButton.m_componentElement.focus();
  if (checkboxes.length <= 0) selectAllCheckbox.m_hide();
  return new Promise(resolve => modal.m_componentElement.addEventListener('componentremoved', () => resolve(values)));
}
function exportTextFileModal(text, filename = 'rbm-export.txt') {
  const contentContainer = document.createElement('div');
  setStyles(contentContainer, {
    width: '100vw',
    'max-width': '100%'
  });
  const textarea = new TextArea(text, {
    rows: 20
  });
  setStyles(textarea.m_textareaElement, {
    width: '100%'
  });
  contentContainer.append(textarea.m_componentElement);
  const saveButton = new PrimaryButton('Save', () => {
    saveFile(new Blob([textarea.m_textareaElement.value], {
      type: 'text/plain'
    }), filename).catch(error => alertModal(error, 'error'));
  });
  const copyButton = new PrimaryButton('Copy', async () => {
    const copied = await copyText(textarea.m_textareaElement.value);
    if (!copied) await alertModal('Failed to copy text to clipboard', 'error');
    textarea.m_textareaElement.select();
  });
  const modal = new Modal({
    title: 'Export',
    content: contentContainer,
    buttons: [saveButton, copyButton]
  });
  modal.m_add();
  textarea.m_textareaElement.focus();
}

class KeyRecorder extends Component {
  m_keys = [];
  m_isRecording = false;
  m_recordButton = new PrimaryButton('+', () => this.m_isRecording ? this.m_stop() : this.m_record());
  m_keyButtonsElement = document.createElement('span');
  m_keyListeners = [];
  constructor({
    keys,
    onChange
  }) {
    super();
    const flexStyles = {
      display: 'flex',
      'flex-direction': 'row',
      'flex-wrap': 'wrap',
      gap: '4px'
    };
    setStyles(this.m_componentElement, {
      ...flexStyles,
      border: `1px solid ${componentColors.accent}`,
      'border-radius': '4px',
      padding: '4px'
    });
    setStyles(this.m_keyButtonsElement, flexStyles);
    this.m_componentElement.append(this.m_keyButtonsElement, this.m_recordButton.m_componentElement);
    if (keys) this.m_addKeys(keys);
    this.m_onChange = onChange;
    this.m_componentElement.addEventListener('componentremoved', () => this.m_stop());
  }
  m_addKey(key) {
    if (this.m_keys.includes(key)) return;
    this.m_keys.push(key);
    const button = new SecondaryButton(key, () => this.m_removeKey(key));
    button.m_componentElement.setAttribute('data-key', key);
    this.m_keyButtonsElement.append(button.m_componentElement);
    if (this.m_onChange) this.m_onChange(this.m_keys);
  }
  m_removeKey(key) {
    const keyIndex = this.m_keys.indexOf(key);
    if (keyIndex <= -1) return;
    this.m_keys.splice(keyIndex, 1);
    const buttonElement = this.m_keyButtonsElement.querySelector(`[data-key="${key}"]`);
    if (buttonElement) buttonElement.remove();
    if (this.m_onChange) this.m_onChange(this.m_keys);
  }
  m_addKeyListeners() {
    this.m_keyListeners.forEach(listener => document.body.addEventListener(listener.type, listener.callback));
  }
  m_clearKeyListeners() {
    this.m_keyListeners.forEach(listener => document.body.removeEventListener(listener.type, listener.callback));
    this.m_keyListeners = [];
  }
  m_record() {
    if (this.m_isRecording) return;
    this.m_isRecording = true;
    this.m_recordButton.m_componentElement.innerText = '+ Hold keys...';
    this.m_keyListeners.push({
      type: 'keydown',
      callback: e => {
        if (this.m_isRecording) {
          e.preventDefault();
          e.stopPropagation();
          this.m_addKey(e.code || e.key.toUpperCase());
        }
      }
    }, {
      type: 'keyup',
      callback: e => {
        if (this.m_isRecording) {
          e.preventDefault();
          e.stopPropagation();
          this.m_stop();
        }
      }
    });
    this.m_addKeyListeners();
  }
  m_stop = () => {
    this.m_isRecording = false;
    this.m_recordButton.m_componentElement.innerText = '+';
    this.m_clearKeyListeners();
  };
  m_clear() {
    [...this.m_keys].forEach(key => this.m_removeKey(key));
  }
  m_addKeys(keys) {
    keys.forEach(key => this.m_addKey(key));
  }
}

const storageKey = 'rbm-settings-4abbd04d-2504-4a5a-8cf2-c96bc68bbdea';
function getSavedField(fieldId) {
  const savedFields = parseStorage(storageKey) || [];
  return savedFields.find(f => f.id === fieldId);
}
function setSavedField(field) {
  const savedFields = parseStorage(storageKey) || [];
  const fieldIndex = savedFields.findIndex(f => f.id === field.id);
  if (fieldIndex === -1) {
    savedFields.push(field);
  } else {
    savedFields[fieldIndex] = field;
  }
  saveStorage(storageKey, savedFields);
}
class SettingsField {
  constructor(props) {
    this.m_id = props.id;
    this.m_name = props.name;
    this.m_description = props.description;
    this.m_userScriptOnly = props.userScriptOnly;
    this.m_settings = props.settings;
    this.m_savedSettings = this.m_settings.map(setting => ({
      ...setting
    }));
    this.m_newSettings = this.m_settings.map(setting => ({
      ...setting
    }));
    this.m_load();
  }
  m_getValue(id) {
    const setting = this.m_savedSettings.find(s => s.id === id);
    if (!setting || setting.userScriptOnly && !isUserScript) return;
    switch (setting.type) {
      case 'text':
      case 'textarea':
        {
          if (setting.value || setting.value?.trim() === '') return setting.value;
          return setting.defaultValue;
        }
      case 'checkbox':
      case 'keys':
        {
          if (setting.value === undefined) return setting.defaultValue;
          return setting.value;
        }
      default:
        {
          return setting.value || setting.defaultValue;
        }
    }
  }
  m_setValue(id, value) {
    const setting = this.m_newSettings.find(s => s.id === id);
    if (setting) setting.value = value;
  }
  m_load() {
    const loadedSettings = [];
    const savedField = getSavedField(this.m_id);
    if (savedField?.settings) {
      for (const setting of this.m_settings) {
        const loadedSetting = {
          ...setting
        };
        const savedSetting = savedField.settings.find(s => s.id === setting.id && s.type === setting.type && !(setting.type === 'select' && !s.options?.includes(setting.value || setting.defaultValue)));
        if (savedSetting) {
          loadedSetting.value = savedSetting.value;
        }
        loadedSettings.push(loadedSetting);
      }
    } else {
      loadedSettings.push(...this.m_settings.map(setting => ({
        ...setting
      })));
    }
    this.m_savedSettings = loadedSettings;
    this.m_newSettings = loadedSettings.map(setting => ({
      ...setting
    }));
  }
  m_save() {
    const newSettings = this.m_newSettings.map(setting => ({
      ...setting,
      value: Array.isArray(setting.value) ? [...setting.value] : setting.value
    }));
    setSavedField({
      id: this.m_id,
      name: this.m_name,
      description: this.m_description,
      settings: newSettings
    });
    this.m_savedSettings = newSettings;
  }
}
class Settings extends Modal {
  constructor(fields) {
    const cancelButton = new SecondaryButton('Cancel', () => this.m_remove());
    const saveButton = new PrimaryButton('Save', () => this.m_save());
    const content = document.createElement('div');
    setStyles(content, {
      width: '100%',
      display: 'flex',
      gap: '12px',
      'flex-wrap': 'wrap',
      'align-items': 'center',
      'justify-content': 'center'
    });
    super({
      title: 'SETTINGS',
      content: content,
      buttons: [cancelButton, saveButton]
    });
    this.m_contentContainer = content;
    this.m_cancelButton = cancelButton;
    this.m_saveButton = saveButton;
    this.m_fields = fields;
  }
  m_load() {
    this.m_fields.forEach(field => field.m_load());
    this.m_updateButtons();
  }
  m_save() {
    this.m_fields.forEach(field => field.m_save());
    this.m_updateButtons();
  }
  m_add(parent) {
    this.m_load();
    this.m_render();
    return super.m_add(parent);
  }
  m_render() {
    while (this.m_contentContainer.firstChild) {
      this.m_contentContainer.removeChild(this.m_contentContainer.firstChild);
    }
    let renderedSettingCount = 0;
    for (const field of this.m_fields) {
      if (field.m_userScriptOnly && !isUserScript) continue;
      const fieldElement = document.createElement('div');
      setStyles(fieldElement, {
        width: '100%',
        display: 'flex',
        'flex-wrap': 'wrap',
        'align-items': 'flex-start',
        gap: '4px',
        padding: '8px',
        'background-color': componentColors.secondary,
        'border-radius': '8px',
        'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.40)'
      });
      const fieldNameElement = document.createElement('span');
      fieldNameElement.innerText = field.m_name;
      setStyles(fieldNameElement, {
        width: '100%',
        'text-align': 'center',
        'font-weight': 'bold',
        'font-size': '20px',
        'line-height': '24px'
      });
      const fieldDescriptionElement = document.createElement('span');
      if (field.m_description) {
        fieldDescriptionElement.innerText = field.m_description;
        setStyles(fieldDescriptionElement, {
          width: '100%',
          'text-align': 'center'
        });
      }
      fieldElement.append(fieldNameElement, fieldDescriptionElement);
      for (const setting of field.m_savedSettings) {
        if (setting.userScriptOnly && !isUserScript) continue;
        const settingElement = document.createElement('div');
        setStyles(settingElement, {
          width: '100%',
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'flex-start',
          gap: '4px',
          padding: '8px',
          'box-shadow': '0 2px 4px 0 rgba(0, 0, 0, 0.25)',
          'background-color': componentColors.background,
          'border-radius': '8px'
        });
        const settingNameElement = document.createElement('span');
        settingNameElement.innerText = setting.name;
        setStyles(settingNameElement, {
          'font-weight': 'bold',
          'font-size': '18px',
          'line-height': '22px',
          'text-align': 'left'
        });
        const settingDescriptionElement = document.createElement('span');
        if (setting.description) {
          settingDescriptionElement.innerText = setting.description;
          setStyles(settingDescriptionElement, {
            'text-align': 'left'
          });
        }
        const settingInputElements = document.createElement('div');
        setStyles(settingInputElements, {
          width: '100%',
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'space-between',
          gap: '4px'
        });
        settingElement.append(settingNameElement, settingDescriptionElement, settingInputElements);
        const inputComponentStyle = {
          'flex-grow': '1',
          display: 'flex'
        };
        const inputStyle = {
          width: '50%',
          'flex-grow': '1'
        };
        const resetButtonText = 'Reset';
        switch (setting.type) {
          case 'text':
          case 'textarea':
            {
              const textSettingValue = field.m_getValue(setting.id);
              const textComponent = setting.type === 'textarea' ? new TextArea(textSettingValue, {
                rows: 5
              }) : new TextInput(textSettingValue);
              const textInputElement = textComponent.m_inputElement || textComponent.m_textareaElement;
              setStyles(textComponent.m_componentElement, inputComponentStyle);
              setStyles(textInputElement, inputStyle);
              const onTextInput = () => {
                field.m_setValue(setting.id, textInputElement.value);
                updateTextResetButton();
                this.m_updateButtons();
              };
              textInputElement.addEventListener('input', () => onTextInput());
              const textResetButton = new SecondaryButton(resetButtonText, () => {
                textInputElement.value = setting.defaultValue;
                onTextInput();
              });
              const updateTextResetButton = () => {
                if (textInputElement.value === setting.defaultValue) {
                  textResetButton.m_disable();
                } else {
                  textResetButton.m_enable();
                }
              };
              updateTextResetButton();
              settingInputElements.append(textComponent.m_componentElement, textResetButton.m_componentElement);
              break;
            }
          case 'checkbox':
            {
              const checkboxSettingValue = field.m_getValue(setting.id);
              const onCheck = () => {
                field.m_setValue(setting.id, checkboxComponent.m_checkboxElement.checked);
                updateCheckboxResetButton();
                this.m_updateButtons();
              };
              const checkboxComponent = new Checkbox(() => onCheck());
              checkboxComponent.m_checkboxElement.checked = !!checkboxSettingValue;
              const checkboxResetButton = new SecondaryButton(resetButtonText, () => {
                checkboxComponent.m_checkboxElement.checked = setting.defaultValue;
                onCheck();
              });
              const updateCheckboxResetButton = () => {
                if (checkboxComponent.m_checkboxElement.checked === setting.defaultValue) {
                  checkboxResetButton.m_disable();
                } else {
                  checkboxResetButton.m_enable();
                }
              };
              updateCheckboxResetButton();
              settingInputElements.append(checkboxComponent.m_componentElement, checkboxResetButton.m_componentElement);
              break;
            }
          case 'select':
            {
              const selectSettingValue = field.m_getValue(setting.id);
              const onSelect = () => {
                field.m_setValue(setting.id, selectComponent.m_selectElement.value);
                updateSelectResetButton();
                this.m_updateButtons();
              };
              const selectComponent = new Select(setting.options);
              setStyles(selectComponent.m_componentElement, inputComponentStyle);
              setStyles(selectComponent.m_selectElement, inputStyle);
              selectComponent.m_selectElement.addEventListener('change', () => onSelect());
              selectComponent.m_selectElement.value = selectSettingValue || setting.defaultValue;
              const selectResetButton = new SecondaryButton(resetButtonText, () => {
                selectComponent.m_selectElement.value = setting.defaultValue;
                onSelect();
              });
              const updateSelectResetButton = () => {
                if (selectComponent.m_selectElement.value === setting.defaultValue) {
                  selectResetButton.m_disable();
                } else {
                  selectResetButton.m_enable();
                }
              };
              updateSelectResetButton();
              settingInputElements.append(selectComponent.m_componentElement, selectResetButton.m_componentElement);
              break;
            }
          case 'keys':
            {
              const keysSettingValue = field.m_getValue(setting.id) || [];
              const keyRecorderComponent = new KeyRecorder({
                keys: keysSettingValue,
                onChange: keys => {
                  field.m_setValue(setting.id, keys);
                  updateKeysResetButton();
                  this.m_updateButtons();
                }
              });
              setStyles(keyRecorderComponent.m_componentElement, inputComponentStyle);
              const keysResetButton = new SecondaryButton(resetButtonText, () => {
                keyRecorderComponent.m_clear();
                keyRecorderComponent.m_addKeys(setting.defaultValue);
              });
              const updateKeysResetButton = () => {
                const defaultKeys = setting.defaultValue;
                const currentKeys = keyRecorderComponent.m_keys;
                if (defaultKeys.length === currentKeys.length && defaultKeys.every(key => currentKeys.includes(key))) {
                  keysResetButton.m_disable();
                } else {
                  keysResetButton.m_enable();
                }
              };
              updateKeysResetButton();
              settingInputElements.append(keyRecorderComponent.m_componentElement, keysResetButton.m_componentElement);
              break;
            }
        }
        fieldElement.append(settingElement);
        renderedSettingCount++;
      }
      this.m_contentContainer.append(fieldElement);
    }
    if (renderedSettingCount <= 0) {
      const noSettingsElement = document.createElement('p');
      noSettingsElement.innerText = 'No settings available';
      setStyles(noSettingsElement, {
        width: '100%',
        'text-align': 'center',
        'font-size': '20px',
        'line-height': '24px',
        'font-weight': 'semibold'
      });
      this.m_contentContainer.append(noSettingsElement);
      return;
    }
  }
  m_updateButtons() {
    const hasChanges = this.m_fields.some(field => field.m_savedSettings.some(saved => {
      const newSetting = field.m_newSettings.find(n => n.id === saved.id);
      if (Array.isArray(newSetting?.value) && Array.isArray(saved.value)) {
        return newSetting.value.length !== saved.value.length || saved.value.some(v => !newSetting.value?.includes(v));
      }
      return newSetting && newSetting.value !== saved.value;
    }));
    if (hasChanges) this.m_saveButton.m_enable();else this.m_saveButton.m_disable();
  }
}

class Bookmarklet {
  m_website = 'bookmarklets.roler.dev';
  m_main = () => {
    alert('Bookmarklet successfully executed!');
  };
  m_isWebsite = () => new RegExp(this.m_website).test(window.location.hostname);
  m_isRoute = () => {
    if (this.m_routes) {
      const routes = this.m_routes.map(route => {
        route = formatRegexText(route);
        route = `^${route}`;
        return route;
      });
      return routes.some(route => new RegExp(route).test(window.location.pathname + window.location.search));
    }
    return true;
  };
  m_execute() {
    let notice;
    if (!this.m_isWebsite()) notice = 'Bookmarklet executed on the wrong website!\n' + `Allowed website: ${this.m_website}`;
    if (!this.m_isRoute() && !notice) notice = 'Bookmarklet executed on the wrong route!\n' + `Allowed routes: ${this.m_routes.join(', ')}`;
    if (notice) {
      console.error(notice);
      alert(notice);
      return;
    }
    this.m_main();
  }
}

class UniversalBookmarklet extends Bookmarklet {
  m_website = '.*';
}

const anonymousM = () => createSVG({
  svg: {
    attributes: {
      width: '100',
      height: '100',
      stroke: 'currentColor'
    }
  },
  paths: [{
    attributes: {
      d: 'M96.64 56.72c-3.18-6.34-6.04-13.9-7.46-19.72-.21-.87-.36-1.8-.53-2.88-.42-2.65-.95-5.95-2.81-10.52-1.15-2.82-4.4-7.12-8.6-7.78l-2.51-7.26c-.11-.26-.33-.46-.6-.53l-3.46-.87c-.01 0-.03 0-.04-.01-.02 0-.04-.01-.06-.01h-.05-.06-.05-.05c-.02 0-.04.01-.05.01-.02 0-.04.01-.05.01-.02 0-.03.01-.05.02s-.03.01-.05.02-.03.02-.05.02c-.02.01-.03.02-.05.03-.03.01-.05.02-.06.03-.02.01-.03.02-.05.03-.01.01-.03.02-.04.04-.01.01-.02.02-.03.02l-4.97 4.85s-.01.01-.01.02c-.01.01-.02.02-.02.03-.02.02-.04.04-.05.07-.01.01-.01.02-.02.03-.02.03-.04.06-.06.1-.02.03-.03.07-.04.1 0 .01-.01.02-.01.03-.01.03-.01.05-.02.08 0 .01 0 .02-.01.03-.01.04-.01.08-.01.11v.09c0 .03 0 .04.01.05.01.03.01.06.02.09l.79 2.55c-1.62-1.26-3.47-2.31-5.58-3.02-2.87-.96-5.94-1.28-9.14-.95-3.59-.5-10.16-1.39-15.84 2.33-.22.14-.43.29-.65.44l.23-1.38c0-.04.01-.06.01-.09v-.06-.08-.03c0-.03-.01-.07-.02-.1-.01-.05-.02-.08-.04-.11 0-.01-.01-.02-.01-.03-.01-.02-.02-.05-.04-.07-.01-.01-.01-.02-.02-.03-.01-.02-.03-.04-.05-.06-.01-.01-.01-.02-.02-.02-.02-.03-.05-.05-.07-.07l-5.18-4.63c-.01-.01-.02-.01-.03-.02-.02-.03-.03-.04-.05-.05s-.03-.02-.05-.03-.03-.02-.05-.03-.03-.02-.05-.02c-.02-.01-.03-.01-.05-.02s-.04-.01-.05-.02c-.02 0-.03-.01-.05-.01s-.04-.01-.06-.01-.03-.01-.05-.01h-.06-.05c-.02 0-.04 0-.06.01-.02 0-.03 0-.05.01-.02 0-.04.01-.06.01-.01 0-.03.01-.04.01l-3.42 1.02a.83.83 0 0 0-.56.56l-2.06 6.92c-4.49 1.01-7.67 6.51-8.58 8.73-1.86 4.57-2.39 7.86-2.81 10.52-.17 1.08-.32 2.01-.53 2.88-1.65 6.72-4.17 13.72-6.92 19.22-.1.2-.12.43-.04.65 2.31 6.72 4.89 10.62 8.28 15.38a.83.83 0 0 0 .77.35.83.83 0 0 0 .68-.5c.49-1.15.6-1.56.85-2.48l.26-.97-.04 1.27c-.04 1.69-.08 3.03-.44 4.57-.06.27.01.56.21.77l2.07 2.19a.83.83 0 0 0 .61.26c.06 0 .12-.01.18-.02a.82.82 0 0 0 .61-.54c2.43-7.01 2.58-11.98 2.73-16.8.13-4.11.25-8 1.7-13.09a135.84 135.84 0 0 1 2-6.42c-.02.71-.02 1.42 0 2.13l.29 7.92a8.31 8.31 0 0 1-.29 2.51c-.23.83-.55 1.63-.94 2.4-.58 1.14-1.32 2.19-2.19 3.13-.23.25-.29.61-.15.92s.46.5.8.48c.74-.04 2.18-.26 3.46-1.35.15-.13.3-.27.44-.41.46.91 1.14 1.9 2 3.16l.1.15c.75 1.1 1.6 1.9 2.45 2.47-.05 1.49.61 2.95 1.8 3.87.83.64 1.83.96 2.84.96a4.48 4.48 0 0 0 .89-.09l.01.15c.02.22.13.42.3.56a.86.86 0 0 0 .53.19h.08l3.03-.3a.84.84 0 0 0 .75-.91l-.17-1.7c-.02-.22-.13-.42-.3-.56s-.39-.21-.61-.19l-3.03.3a.84.84 0 0 0-.75.91l.02.16c-.95.22-1.96.01-2.74-.59-.64-.5-1.07-1.21-1.21-1.99a8.66 8.66 0 0 0 4.17.6c.28-.03.52-.2.65-.45a.85.85 0 0 0-.01-.79c-.31-.55-.58-1.07-.84-1.57.92.96 1.95 1.81 3.09 2.53l3.34 2.12c-.02.64-.05 1.69-.15 2.89l-.79-.59a.97.97 0 0 0-.87-.15c-.3.09-.53.32-.63.62l-1.18 3.54-2.34 2.34a.97.97 0 0 0-.14 1.2c-.07.08-.13.16-.17.25-.66.43-3.15 1.21-4.83 1.74-4.76 1.5-6.32 2.08-6.6 3.25-.11.46.03.95.37 1.3 1.36 1.36 13.7 7.84 25.29 7.84.19 0 .37 0 .56-.01 10.57-.19 22.17-5.06 25.7-7.73.27-.21.44-.53.44-.87.01-.34-.15-.67-.41-.88-1.41-1.14-3.63-1.9-5.98-2.69-1.98-.67-4.02-1.37-5.15-2.21a.97.97 0 0 0-.15-1.18l-2.34-2.34-1.18-3.54c-.1-.3-.33-.53-.63-.62s-.62-.04-.87.15l-.83.63c-.07-1.19-.1-2.22-.1-2.74l3.64-2.32c1.29-.82 2.39-1.82 3.33-3.05-.27.79-.6 1.61-1.01 2.54a.82.82 0 0 0 .06.79c.15.24.42.38.7.38 1.08 0 4.82-.28 7.36-3.9a15.69 15.69 0 0 0 1.83-3.43c.1.14.21.27.32.4 1.25 1.44 2.77 2.07 3.82 2.34.35.09.72-.06.92-.36.19-.31.17-.7-.07-.98-.89-1.05-1.63-2.22-2.21-3.47-.66-1.42-1.1-2.93-1.31-4.49V38.2c1.41 5.08 2.49 13.09 3.61 21.44.86 6.4 1.75 13.01 2.86 18.82a.81.81 0 0 0 .58.64c.08.02.16.03.24.03.22 0 .44-.09.6-.26l2.43-2.54c.2-.2.27-.49.21-.77-.52-2.18-.89-4.4-1.11-6.63a37.61 37.61 0 0 0 1.65 4.6.83.83 0 0 0 .68.5.84.84 0 0 0 .77-.35c3.53-4.96 5.98-9.84 8.2-16.31.02-.21.01-.45-.09-.65zM69.37 19.14l-1.25-5.03 2.56-2.83 1.76 5.33c-1.18.59-2.24 1.45-3.07 2.53zm3.6-.92l2.64 8-1.45 1.74c-.9-2.26-2.16-4.82-3.87-7.24a7.36 7.36 0 0 1 2.68-2.5zM29.08 19c-.63-.81-1.41-1.47-2.2-1.98l1.54-5.44 2.68 2.71-.67 3.32c-.46.45-.91.91-1.35 1.39zm-2.13 10.12l-1.07-.95c.83-.97 1.65-1.83 2.28-2.35.08-.07.16-.13.25-.2l-1.46 3.5zm-.54-10.41c.56.41 1.11.93 1.54 1.56-1.15 1.33-2.21 2.73-3.14 4.1l1.6-5.66zm-6.23 29.16c-1.51 5.29-1.64 9.46-1.76 13.5-.14 4.38-.27 8.9-2.21 14.99l-.81-.86c.31-1.52.35-2.84.39-4.47.02-.83.04-1.78.11-2.86a52.74 52.74 0 0 0-.29-9.65.83.83 0 0 0-.88-.73.84.84 0 0 0-.78.84c.04 3.6-.43 7.17-1.39 10.59l-.28 1.05-.22.81c-2.89-4.12-5.03-7.61-7.04-13.35 2.75-5.55 5.25-12.55 6.9-19.25.23-.94.39-1.95.56-3.01.41-2.57.92-5.76 2.71-10.15.69-1.69 3.15-6.06 6.46-7.43l-2.71 9.08c-.02.04-.04.09-.05.13a.82.82 0 0 0 .27.88l2.45 2.01c-.68 1.53-1.1 2.87-1.17 3.87a.83.83 0 0 0 .76.89.83.83 0 0 0 .9-.75c.05-.5.56-1.46 1.29-2.55l1.93 1.58c-1.99 4.84-3.71 9.82-5.14 14.84zm19.8-8.5c.64 2 1.49 3.75 2.43 5.27h-6.77c.85-1.01 1.64-2.07 2.35-3.18.63-.99 1.2-2.02 1.71-3.07.08.32.18.65.28.98zm13.37-2.15l-.1-1.68a37.79 37.79 0 0 0 2.97 4.04c1.58 1.86 3.34 3.55 5.25 5.06h-7.29c-.38-2.46-.66-4.94-.83-7.42zM39.5 76.16a1.02 1.02 0 0 0 .24-.38l.82-2.47 8.24 6.18a65.07 65.07 0 0 1-1.75 2.78c-1.47 2.2-2.31 3.08-2.72 3.42-1.45-2.28-5.12-6.13-6.66-7.71l1.83-1.82zm-12.72 7.93c1.12-.47 3-1.06 4.37-1.49 3.51-1.1 5.25-1.69 5.92-2.45 2.09 2.19 5.12 5.5 5.88 7.02a1.14 1.14 0 0 0 .18.25 1.36 1.36 0 0 0 .98.41c.07 0 .14 0 .2-.01.4-.05.91-.26 1.71-1.06l.8 1.6c.1.2.28.35.49.42-.02.13-.06.27-.12.46-.15.46-.38.91-.58 1.25-4.68-.43-9.19-1.8-12.41-3-3.44-1.27-6.07-2.6-7.42-3.4zm46.26.18c-3.81 2.21-11.74 5.27-19.54 6.14a6.59 6.59 0 0 1-.4-.95 5.91 5.91 0 0 1-.19-.69c.18-.08.33-.21.43-.39l.8-1.6c.79.8 1.31 1 1.71 1.06a1.41 1.41 0 0 0 .2.01c.37 0 .72-.14.98-.41.07-.07.14-.16.18-.25.77-1.53 3.84-4.9 5.94-7.09 1.41 1.14 3.63 1.9 5.98 2.69 1.39.47 2.8.95 3.91 1.48zM59.61 73.31l.82 2.47a1.02 1.02 0 0 0 .24.38l1.82 1.82c-1.54 1.57-5.21 5.42-6.66 7.71-.41-.34-1.24-1.22-2.72-3.42a65.07 65.07 0 0 1-1.75-2.78l8.25-6.18zm-2.78-.36l-6.75 5.06-6.81-5.11c.12-1.14.18-2.2.22-3.05l2.94 1.87c1.15.73 2.47 1.1 3.79 1.1s2.64-.37 3.79-1.1l2.64-1.68.18 2.91zm4.2-8.32l-8.2 5.22c-1.58 1-3.62 1-5.2 0l-8.18-5.21c-2.67-1.7-4.69-4.21-5.78-7.15h32.46c-1.14 3.41-2.73 5.63-5.1 7.14zm15.09-5.43l-.04-.04a5.52 5.52 0 0 1-1.02-1.72c-.13-.34-.47-.56-.83-.54a.83.83 0 0 0-.76.63c-.43 1.73-1.16 3.34-2.17 4.78-1.45 2.06-3.35 2.8-4.68 3.05 1.06-2.64 1.44-4.64 1.64-7.25.07-.2.13-.41.2-.62h1.6c.38 0 .7-.31.7-.7V45.34c0-.38-.31-.7-.7-.7h-2.05c-.58-5.04-1.7-10.04-3.36-14.96a.83.83 0 0 0-1.58.54c1.6 4.74 2.69 9.56 3.26 14.42h-2.05c-2.53-1.75-4.8-3.8-6.79-6.14-1.68-1.97-3.13-4.14-4.34-6.45a84.54 84.54 0 0 1 .73-11.58.97.97 0 0 0-.84-1.09c-.54-.07-1.02.3-1.09.84a86.3 86.3 0 0 0-.55 17.15 85.51 85.51 0 0 0 .81 7.29h-2.87a15.22 15.22 0 0 1-1.58-3.87c-.12-.46-.56-.77-1.03-.73-.48.04-.85.43-.88.91a22.86 22.86 0 0 0 .05 3.7h-1.16c-1.13-1.62-2.17-3.57-2.9-5.87-2.56-8.02.31-14.97 1.66-17.58.25-.48.06-1.07-.42-1.31-.48-.25-1.07-.06-1.31.42-1.24 2.4-3.67 8.2-2.66 15.23-.67 1.76-1.52 3.45-2.52 5.03-.93 1.46-1.99 2.82-3.17 4.08h-.93a76.44 76.44 0 0 1 2.35-15.47c.12-.45-.15-.9-.6-1.02s-.9.15-1.02.6c-1.35 5.21-2.15 10.53-2.41 15.89h-2.69c-.38 0-.7.31-.7.7v11.46c0 .38.31.7.7.7h3.14c.43 2.69 1.21 4.94 2.63 7.67-.76-.07-1.73-.28-2.71-.82-.09-.17-.25-.31-.45-.35-.05-.01-.1-.02-.14-.02-.66-.46-1.31-1.09-1.89-1.95l-.1-.15c-1.26-1.84-2.09-3.06-2.35-4.17a.84.84 0 0 0-1.57-.18 3.97 3.97 0 0 1-.98 1.27c.23-.38.45-.76.65-1.16a14.52 14.52 0 0 0 1.05-2.7 9.8 9.8 0 0 0 .35-3.03l-.29-7.92c-.15-4.22.59-8.34 2.21-12.24l3.44-8.27a.85.85 0 0 0-.24-.97.84.84 0 0 0-1-.04c-.95.65-1.88 1.35-2.77 2.07-.29.24-.64.56-1.02.94l.27-.4c1.02-1.47 2.1-2.86 3.22-4.12.03-.03.05-.06.08-.09 2.01-2.27 4.12-4.16 6.19-5.51 5.22-3.41 11.45-2.53 14.8-2.06a.74.74 0 0 0 .21 0c2.99-.33 5.85-.04 8.53.86 2.87.96 5.22 2.63 7.15 4.6.04.05.09.1.14.14.48.5.93 1.02 1.36 1.55.03.06.08.11.12.15.15.19.29.38.43.57.04.06.08.12.13.18 3.44 4.71 5.04 10.16 5.59 12.46v19.53a.41.41 0 0 0 .01.11 17.21 17.21 0 0 0 1.46 5.03c.1.21.22.45.35.69zm11.87 12.25c-.42-1.09-.78-2.19-1.09-3.31-.96-3.42-1.42-6.98-1.39-10.59a.84.84 0 0 0-.78-.84.83.83 0 0 0-.88.73 52.74 52.74 0 0 0-.29 9.65 52.97 52.97 0 0 0 1.21 8.4l-.99 1.04c-.96-5.37-1.77-11.34-2.55-17.13-1.51-11.24-2.95-21.86-5.32-26.01-.1-.42-.23-.93-.4-1.52l5.16-4.61a.83.83 0 0 0 .23-.89c-.02-.05-.04-.09-.06-.13l-2.96-8.55c3.2 1.03 5.62 4.63 6.4 6.54 1.79 4.39 2.3 7.58 2.71 10.15.17 1.07.33 2.08.56 3.01 1.43 5.84 4.27 13.38 7.44 19.75-1.95 5.62-4.09 9.99-7 14.31z'
    }
  }]
});
class LoadingCircle extends Component {
  constructor() {
    super(anonymousM(), {
      defaultStyles: false
    });
    setStyles(this.m_componentElement, {
      width: '100px',
      height: '100px'
    });
    this.m_componentElement.animate({
      transform: ['rotate(0deg)', 'rotate(360deg)']
    }, {
      duration: 1000,
      iterations: Infinity,
      easing: 'linear'
    });
  }
}

class Skeleton extends Component {
  constructor() {
    super(document.createElement('div'), {
      defaultStyles: false
    });
    setStyles(this.m_componentElement, {
      width: '100%',
      height: '100%',
      'background-color': componentColors.secondary,
      opacity: '0.4',
      'border-radius': '4px'
    });
    this.m_componentElement.animate({
      opacity: [0.2, 0.4, 0.2]
    }, {
      duration: 2000,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  }
}

class SimpleProgressBar extends Component {
  m_maxValue = 100;
  m_minValue = 0;
  m_currentValue = this.m_minValue;
  constructor(maxValue, minValue) {
    super(document.createElement('div'), {
      defaultStyles: false
    });
    setStyles(this.m_componentElement, {
      'z-index': '1000000',
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '24px',
      'background-color': componentColors.accent,
      cursor: 'pointer'
    });
    const progress = document.createElement('div');
    setStyles(progress, {
      width: '0%',
      height: '100%',
      'background-color': componentColors.primary,
      transition: 'width 200ms'
    });
    this.m_barElement = progress;
    this.m_componentElement.append(progress);
    this.m_componentElement.addEventListener('click', () => this.m_remove());
    this.m_reset({
      maxValue,
      minValue
    });
  }
  m_start({
    maxValue,
    minValue,
    currentValue
  } = {}) {
    this.m_reset({
      maxValue,
      minValue,
      currentValue
    });
    this.m_add();
  }
  m_update(currentValue = this.m_currentValue + 1) {
    if (currentValue > this.m_maxValue) currentValue = this.m_maxValue;else if (currentValue < this.m_minValue) currentValue = this.m_minValue;
    const currentPercentageRounded = Math.ceil(this.m_currentValue / this.m_maxValue * 100);
    const percentageRounded = Math.ceil(currentValue / this.m_maxValue * 100);
    if (percentageRounded >= 100) this.m_remove();else if (currentPercentageRounded !== percentageRounded && percentageRounded >= 0) setStyles(this.m_barElement, {
      width: `${percentageRounded}%`
    });
    this.m_currentValue = currentValue;
  }
  m_reset({
    maxValue,
    minValue,
    currentValue
  } = {}) {
    if (maxValue) this.m_maxValue = maxValue;
    if (minValue) this.m_minValue = minValue;
    this.m_update(currentValue || this.m_minValue);
  }
}

const settingIds = {
  cropFormat: 'crop_format',
  cropQuality: 'crop_quality',
  imageFilename: 'image_filename',
  zipFilename: 'zip_filename',
  enableSavePaths: 'enable_save_paths',
  userscriptImageSavePath: 'userscript_image_save_path',
  userscriptZipSavePath: 'userscript_zip_save_path',
  copyFormat: 'copy_format'
};
const settingGlobalStringVariableNames = {
  seriesTitle: formatStringVariable('SERIES_TITLE'),
  hostname: formatStringVariable('HOSTNAME')
};
const settingPathStringVariableNames = {
  volumeRanges: formatStringVariable('VOLUME_RANGES'),
  firstVolumeNumber: formatStringVariable('FIRST_VOLUME_NUMBER'),
  lastVolumeNumber: formatStringVariable('LAST_VOLUME_NUMBER'),
  coverCount: formatStringVariable('COVER_COUNT'),
  totalCoverCount: formatStringVariable('TOTAL_COVER_COUNT'),
  ...settingGlobalStringVariableNames
};
const settingImageStringVariableNames = {
  volumeName: formatStringVariable('VOLUME_NAME'),
  volumeNumber: formatStringVariable('VOLUME_NUMBER'),
  bookTitle: formatStringVariable('BOOK_TITLE'),
  ...settingGlobalStringVariableNames
};
const settingZipStringVariableNames = {
  ...settingPathStringVariableNames
};
const settingCopyStringVariableNames = {
  coverUrl: formatStringVariable('COVER_URL'),
  ...settingImageStringVariableNames,
  ...settingPathStringVariableNames
};
const settingStringVariableNames = {
  ...settingGlobalStringVariableNames,
  ...settingPathStringVariableNames,
  ...settingImageStringVariableNames,
  ...settingZipStringVariableNames,
  ...settingCopyStringVariableNames
};
const savePathSettingNotice = 'This setting may only work with Tampermonkey!\n';
const getFileSavingSettingDescription = variableIds => 'Available variables: ' + Object.values(variableIds).join(', ');
const getFileSavingSettingDefaultValue = (nameParts, isPath = false) => nameParts.join(isPath ? '/' : ' - ');
const defaultCropFormat = 'jpeg';
const defaultCropQuality = 98;
const coverDownloaderSettings = new SettingsField({
  id: '29f4b713-8ccd-4a4e-97ac-5a34d48ac5d7',
  name: 'Cover Downloader',
  settings: [{
    id: settingIds.cropFormat,
    type: 'select',
    name: 'Crop Format',
    description: 'Select the output format of the cropped images.',
    options: ['PNG', 'JPEG'],
    defaultValue: defaultCropFormat.toUpperCase()
  }, {
    id: settingIds.cropQuality,
    type: 'text',
    name: 'Crop Quality',
    description: 'Specify the output quality of the cropped images.\n' + 'Only used if the format is JPEG.\n' + 'Quality range: 1 - 100',
    defaultValue: defaultCropQuality.toString()
  }, {
    id: settingIds.imageFilename,
    type: 'text',
    name: 'Image Filename',
    description: getFileSavingSettingDescription(settingImageStringVariableNames),
    defaultValue: getFileSavingSettingDefaultValue([settingImageStringVariableNames.hostname, settingImageStringVariableNames.seriesTitle, settingImageStringVariableNames.volumeName])
  }, {
    id: settingIds.zipFilename,
    type: 'text',
    name: 'Zip Filename',
    description: getFileSavingSettingDescription(settingZipStringVariableNames),
    defaultValue: getFileSavingSettingDefaultValue([settingZipStringVariableNames.hostname, settingZipStringVariableNames.seriesTitle, 'covers', `[${settingZipStringVariableNames.volumeRanges}]`, `(${settingZipStringVariableNames.coverCount})`])
  }, {
    id: settingIds.enableSavePaths,
    type: 'checkbox',
    name: 'Enable Save Paths',
    userScriptOnly: true,
    description: savePathSettingNotice + 'Enables the use of save paths for images and zips.',
    defaultValue: false
  }, {
    id: settingIds.userscriptImageSavePath,
    type: 'text',
    name: 'Image Save Path',
    userScriptOnly: true,
    description: savePathSettingNotice + getFileSavingSettingDescription(settingPathStringVariableNames),
    defaultValue: getFileSavingSettingDefaultValue(['covers', 'image', settingPathStringVariableNames.hostname, settingPathStringVariableNames.seriesTitle], true)
  }, {
    id: settingIds.userscriptZipSavePath,
    type: 'text',
    name: 'Zip Save Path',
    userScriptOnly: true,
    description: savePathSettingNotice + getFileSavingSettingDescription(settingPathStringVariableNames),
    defaultValue: getFileSavingSettingDefaultValue(['covers', 'zip'], true)
  }, {
    id: settingIds.copyFormat,
    type: 'textarea',
    name: 'Copy Format',
    description: getFileSavingSettingDescription(settingCopyStringVariableNames),
    defaultValue: `[${settingCopyStringVariableNames.volumeName}][ja]{${settingCopyStringVariableNames.volumeName} cover from ${settingCopyStringVariableNames.hostname}}(${settingCopyStringVariableNames.coverUrl})\n`
  }]
});
class CoverDownloader extends Modal {
  m_knownFileNames = {};
  m_aborted = false;
  m_loadMax = 1;
  m_currentLoad = 0;
  m_covers = [];
  m_busy = false;
  m_stats = {};
  m_thumbnail = {
    width: 280,
    output: 'jpeg'
  };
  m_settings = {
    crop: {
      format: defaultCropFormat,
      quality: defaultCropQuality
    }
  };
  constructor(getCovers, {
    loadMax = 1,
    title,
    fileNamePrefix = 'Volume',
    disableCropping = false,
    reverseCoverOrder = false
  } = {}) {
    const resultsContainer = document.createElement('div');
    setStyles(resultsContainer, {
      width: '100%',
      'min-width': '200px',
      height: '100%',
      'min-height': '200px',
      display: 'flex',
      'flex-wrap': 'wrap',
      gap: '8px',
      'justify-content': 'center',
      'align-items': 'center'
    });
    const loadContainer = document.createElement('div');
    setStyles(loadContainer, {
      width: '90%',
      'flex-shrink': '0',
      'margin-top': '2px',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center'
    });
    const loadButton = new SecondaryButton('LOAD MORE', () => this.m_loadCovers());
    setStyles(loadButton.m_componentElement, {
      width: '100%'
    });
    loadButton.m_add(loadContainer);
    const buttons = {
      selectAll: new PrimaryButton('Select All', () => this.m_selectAll()),
      crop: new PrimaryButton('Crop', () => this.m_crop()),
      open: new PrimaryButton('Open', () => this.m_open()),
      copy: new PrimaryButton('Copy', () => this.m_copy()),
      zip: new PrimaryButton('Zip', () => this.m_zip()),
      save: new PrimaryButton('Save', () => this.m_save())
    };
    setStyles(buttons.selectAll.m_componentElement, {
      'min-width': '150px'
    });
    setStyles(buttons.crop.m_componentElement, {
      'min-width': '100px'
    });
    super({
      title: 'Cover Downloader',
      content: resultsContainer,
      buttons: Object.values(buttons)
    });
    this.m_resultsContainer = resultsContainer;
    this.m_loadContainer = loadContainer;
    this.m_loadButton = loadButton;
    this.m_loadCircle = new LoadingCircle();
    this.m_buttons = buttons;
    this.m_loadingCircle = new LoadingCircle();
    this.m_loadMax = loadMax;
    this.m_getCovers = getCovers;
    this.m_title = title?.trim();
    this.m_fileNamePrefix = fileNamePrefix;
    this.m_croppingDisabled = disableCropping;
    this.m_coverOrderReversed = reverseCoverOrder;
    this.m_loadSettings();
    this.m_componentElement.addEventListener('componentadded', () => {
      this.m_aborted = false;
      Object.values(buttons).forEach(button => button.m_hide());
      this.m_loadingCircle.m_add(this.m_resultsContainer);
      this.m_loadSettings();
      this.m_loadCovers();
    });
    this.m_componentElement.addEventListener('componentremoved', () => {
      this.m_aborted = true;
      this.m_clearCovers();
    });
  }
  m_loadSettings() {
    const enablePathsSetting = !!coverDownloaderSettings.m_getValue(settingIds.enableSavePaths);
    const imagePathSetting = coverDownloaderSettings.m_getValue(settingIds.userscriptImageSavePath);
    const zipPathSetting = coverDownloaderSettings.m_getValue(settingIds.userscriptZipSavePath);
    this.m_settings.paths = {
      enabled: enablePathsSetting,
      image: imagePathSetting?.trim(),
      zip: zipPathSetting?.trim()
    };
    const imageFilenameSetting = coverDownloaderSettings.m_getValue(settingIds.imageFilename);
    const zipFilenameSetting = coverDownloaderSettings.m_getValue(settingIds.zipFilename);
    this.m_settings.filenames = {
      image: imageFilenameSetting?.trim(),
      zip: zipFilenameSetting?.trim()
    };
    this.m_settings.copyFormat = coverDownloaderSettings.m_getValue(settingIds.copyFormat);
    const cropFormatSetting = coverDownloaderSettings.m_getValue(settingIds.cropFormat);
    this.m_settings.crop.format = cropFormatSetting?.toLowerCase() || this.m_settings.crop.format;
    const cropQualitySetting = coverDownloaderSettings.m_getValue(settingIds.cropQuality);
    this.m_settings.crop.quality = cropQualitySetting ? parseInt(cropQualitySetting) : this.m_settings.crop.quality;
  }
  m_loadCovers() {
    if (this.m_currentLoad >= this.m_loadMax) this.m_currentLoad = 0;
    ++this.m_currentLoad;
    this.m_loadButton.m_replace(this.m_loadCircle.m_componentElement);
    const progressBar = new SimpleProgressBar();
    this.m_getCovers(this.m_currentLoad).then(covers => {
      if (this.m_aborted) return;
      const coverUrls = this.m_covers.map(cover => cover.url);
      covers = covers.filter(cover => !coverUrls.includes(cover.url));
      if (covers.length <= 0) throw new Error('No covers found');
      covers.forEach(cover => cover.title = cover.title || `${this.m_covers.length + 1}`);
      covers.forEach(cover => this.m_parseTitle(cover));
      covers.sort((a, b) => {
        return (this.m_coverOrderReversed ? b : a).parsedTitle.localeCompare((this.m_coverOrderReversed ? a : b).parsedTitle, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });
      covers.forEach(cover => this.m_setCoverFilename(cover));
      this.m_covers.push(...covers);
      this.m_updateStats();
      progressBar.m_start({
        maxValue: covers.length
      });
      const afterLoad = () => {
        progressBar.m_update();
        if (progressBar.m_currentValue >= progressBar.m_maxValue) {
          progressBar.m_remove();
          if (covers.some(cover => cover.cropAmount && !cover.cropped)) this.m_crop(covers, true).catch(console.error);
        }
      };
      covers.forEach(cover => this.m_loadCover(cover).then(afterLoad).catch(afterLoad));
    }).catch(error => {
      console.error(error);
      progressBar.m_remove();
      this.m_remove();
      alertModal('Failed to load covers!\n' + error, 'error').catch(console.error);
    });
  }
  async m_loadCover(cover) {
    const result = document.createElement('div');
    setStyles(result, {
      'min-width': '134px',
      'max-width': '140px',
      'min-height': '234px',
      'max-height': '240px',
      'flex-grow': '1',
      'background-color': componentColors.background,
      border: `1px solid ${componentColors.secondary}`,
      'border-radius': '4px',
      'box-shadow': '0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 5px 0 rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      display: 'flex',
      'flex-direction': 'column',
      cursor: 'pointer',
      'user-select': 'none'
    });
    if (cover.element) cover.element.replaceWith(result);
    cover.element = result;
    const headerContainer = document.createElement('div');
    this.m_setDefaultStyles(headerContainer);
    setStyles(headerContainer, {
      'font-size': '14px',
      'line-height': '14px',
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      gap: '2px',
      padding: '4px'
    });
    result.append(headerContainer);
    const dimensionsElementPlaceholder = new Skeleton();
    setStyles(dimensionsElementPlaceholder.m_componentElement, {
      height: '14px'
    });
    dimensionsElementPlaceholder.m_add(headerContainer);
    const checkboxElementPlaceholder = new Skeleton();
    setStyles(checkboxElementPlaceholder.m_componentElement, {
      height: '14px',
      width: '14px',
      'flex-shrink': '0'
    });
    checkboxElementPlaceholder.m_add(headerContainer);
    const imageContainer = document.createElement('div');
    setStyles(imageContainer, {
      position: 'relative',
      'flex-grow': '1'
    });
    result.append(imageContainer);
    const imageElementPlaceholder = new Skeleton();
    setStyles(imageElementPlaceholder.m_componentElement, {
      position: 'absolute',
      top: '0',
      left: '0'
    });
    imageContainer.append(imageElementPlaceholder.m_componentElement);
    const footerContainer = document.createElement('div');
    this.m_setDefaultStyles(footerContainer);
    setStyles(footerContainer, {
      'font-size': '14px',
      'line-height': '14px',
      'text-align': 'center',
      padding: '4px',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap'
    });
    result.append(footerContainer);
    const titleElementPlaceholder = new Skeleton();
    setStyles(titleElementPlaceholder.m_componentElement, {
      height: '14px'
    });
    titleElementPlaceholder.m_add(footerContainer);
    if (this.m_covers.every(c => c.element)) {
      this.m_loadingCircle.m_remove();
      this.m_covers.forEach(cover => {
        if (!this.m_resultsContainer.contains(cover.element)) this.m_resultsContainer.append(cover.element);
      });
      this.m_loadCircle.m_replace(this.m_loadButton.m_componentElement);
      if (this.m_currentLoad < this.m_loadMax) this.m_resultsContainer.append(this.m_loadContainer);else this.m_loadContainer.remove();
    }
    const titleElement = document.createElement('span');
    titleElement.innerText = cover.parsedTitle;
    titleElement.setAttribute('title', cover.parsedTitle);
    titleElementPlaceholder.m_replace(titleElement);
    await this.download(cover).catch(e => console.warn('Failed to download cover', cover.url, e));
    if (this.m_aborted) return;
    const imageElement = document.createElement('img');
    imageElement.alt = cover.filename;
    setStyles(imageElement, {
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: '0',
      left: '0',
      'object-fit': 'cover',
      'object-position': 'center'
    });
    imageElementPlaceholder.m_replace(imageElement);
    const checkbox = new Checkbox();
    setStyles(checkbox.m_checkboxElement, {
      width: '14px',
      height: '14px',
      position: 'unset',
      'vertical-align': 'unset'
    });
    checkboxElementPlaceholder.m_replace(checkbox.m_componentElement);
    cover.select = (select = true) => {
      cover.selected = select;
      checkbox.m_checkboxElement.checked = cover.selected;
      this.m_lastSelected = cover;
      let borderColor = componentColors.secondary;
      if (cover.selected) {
        if (cover.errored) borderColor = componentColors.error;else if (!cover.blobUrl) borderColor = componentColors.warning;else borderColor = componentColors.primary;
      }
      let backgroundColor = componentColors.background;
      if (cover.selected) {
        if (cover.errored) backgroundColor = componentColors.error;else if (!cover.blobUrl) backgroundColor = componentColors.warning;else backgroundColor = componentColors.primary;
      }
      setStyles(result, {
        'border-color': borderColor,
        'background-color': backgroundColor
      });
      if (cover.errored) setStyles(checkbox.m_checkboxElement, {
        'accent-color': componentColors.error
      });else if (!cover.blobUrl) setStyles(checkbox.m_checkboxElement, {
        'accent-color': componentColors.warning
      });
      this.m_updateButtons();
      this.m_updateStats();
    };
    result.addEventListener('click', event => {
      if (!cover.select) return;
      if (event.shiftKey && this.m_lastSelected) {
        this.m_selectRange(this.m_lastSelected, cover, !cover.selected);
      } else cover.select(!cover.selected);
    });
    const thumbnailUrl = cover.thumbnailUrl || getWsrvUrl({
      url: cover.url,
      ...this.m_thumbnail
    }).href;
    new Promise((resolve, reject) => {
      imageElement.onerror = e => reject(e);
      imageElement.onload = () => resolve();
      imageElement.src = thumbnailUrl;
    }).catch(e => {
      console.warn(e);
      imageElement.onerror = e => {
        if (imageElement.src !== cover.url) {
          console.warn(e);
          imageElement.src = cover.url;
        } else {
          console.error('Failed to load thumbnail:', imageElement.src, e);
        }
      };
      imageElement.src = cover.blobUrl || cover.url;
    });
    const coverDimensions = !cover.cropped ? await getImageDimensions(cover.url, {
      localUrl: cover.blobUrl || undefined
    }).catch(async e => {
      console.warn(e);
      return await getImageDimensions(cover.url).catch(console.error);
    }) : null;
    if (coverDimensions || cover.cropped) {
      cover.width = coverDimensions?.width || cover.width;
      cover.height = coverDimensions?.height || cover.height;
      cover.cropAmount = this.m_getCropMethod(cover);
      const dimensionsElement = document.createElement('span');
      dimensionsElement.innerText = `${cover.width}x${cover.height}${cover.cropped ? 'c' : ''}`;
      dimensionsElementPlaceholder.m_replace(dimensionsElement);
    } else {
      console.error('Failed to load cover:', cover.editedUrl || cover.url);
      cover.errored = true;
      const errorElement = document.createElement('span');
      this.m_setDefaultStyles(errorElement);
      setStyles(errorElement, {
        'font-size': '32px',
        'font-weight': 'bold',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        'background-color': componentColors.error,
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center'
      });
      errorElement.innerText = 'ERROR';
      imageElement.replaceWith(errorElement);
      if (cover.selected && cover.select) cover.select();
    }
    if (cover.selected || this.m_covers.length === 1) cover.select();
    cover.loaded = true;
    this.m_updateButtons();
  }
  m_clearCovers() {
    this.m_removeBlobs();
    this.m_covers.forEach(cover => cover.element?.remove());
    this.m_loadContainer.remove();
    this.m_covers = [];
    this.m_currentLoad = 0;
    this.m_knownFileNames = {};
  }
  m_createBlobUrl(cover) {
    if (!cover.blob) return;
    if (!cover.blobUrl) cover.blobUrl = URL.createObjectURL(cover.blob);
  }
  m_removeBlob(cover) {
    if (cover.blobUrl) {
      URL.revokeObjectURL(cover.blobUrl);
      delete cover.blobUrl;
    }
    if (cover.blob) delete cover.blob;
  }
  m_removeBlobs() {
    this.m_covers.forEach(cover => this.m_removeBlob(cover));
  }
  m_setBlob(cover, blob) {
    if (this.m_aborted) {
      this.m_removeBlob(cover);
      throw new Error('aborted');
    } else {
      cover.blob = cover.blob || blob;
      this.m_createBlobUrl(cover);
      return cover.blob;
    }
  }
  m_parseTitle(cover) {
    let volumeString = cover.title;
    const japaneseCharacters = '０１２３４５６７８９'.split('');
    japaneseCharacters.forEach((character, i) => volumeString = volumeString.replaceAll(character, i.toString()));
    const spaceMatch = volumeString.match(/\((\d+)(\.\d+)?\)| (\d+)(\.\d+)? /);
    if (spaceMatch && spaceMatch[0]) volumeString = spaceMatch[0];
    const volumeNumbers = volumeString.match(/\d+(?:\.\d+)?/g);
    if (volumeNumbers) {
      const volumeNumberString = volumeNumbers.pop();
      if (volumeNumberString) cover.volumeNumber = parseFloat(volumeNumberString);
      cover.parsedTitle = `${this.m_fileNamePrefix} ${cover.volumeNumber}`.trim();
    } else cover.parsedTitle = cover.title.trim();
  }
  m_updateStats() {
    const selectedCovers = this.m_covers.filter(c => c.selected);
    const volumeNumbers = selectedCovers.filter(c => c.volumeNumber !== undefined && c.volumeNumber !== null).map(c => c.volumeNumber).sort((a, b) => a - b);
    const firstVolume = volumeNumbers.length > 0 ? volumeNumbers[0] : undefined;
    const lastVolume = volumeNumbers.length > 0 ? volumeNumbers[volumeNumbers.length - 1] : undefined;
    const volumeRanges = [];
    if (volumeNumbers.length > 0) {
      let rangeStart = volumeNumbers[0];
      let rangeEnd = volumeNumbers[0];
      for (let i = 1; i <= volumeNumbers.length; i++) {
        const current = volumeNumbers[i];
        const prev = volumeNumbers[i - 1];
        if (i === volumeNumbers.length || current !== prev + 1) {
          volumeRanges.push([rangeStart, rangeEnd]);
          if (i < volumeNumbers.length) {
            rangeStart = current;
            rangeEnd = current;
          }
        } else {
          rangeEnd = current;
        }
      }
    }
    this.m_stats = {
      firstVolume,
      lastVolume,
      volumeRanges,
      totalCovers: this.m_covers.length,
      selectedCovers: selectedCovers.length
    };
  }
  m_parseFilename(filename, cover) {
    if (!filename) return;
    return replaceStringVariable(filename, [[settingStringVariableNames.volumeName, cover?.parsedTitle || 'Unknown Volume'], [settingStringVariableNames.volumeNumber, cover?.volumeNumber?.toString() || '1'], [settingStringVariableNames.bookTitle, cover?.title || 'Unknown Book'], [settingStringVariableNames.seriesTitle, this.m_title || 'Unknown Series'], [settingStringVariableNames.volumeRanges, this.m_stats.volumeRanges?.map(([start, end]) => start === end ? `${start}` : `${start}-${end}`).join(', ') || '1'], [settingStringVariableNames.firstVolumeNumber, this.m_stats.firstVolume?.toString() || '1'], [settingStringVariableNames.lastVolumeNumber, this.m_stats.lastVolume?.toString() || '1'], [settingStringVariableNames.totalCoverCount, this.m_stats.totalCovers?.toString() || '1'], [settingStringVariableNames.coverCount, this.m_stats.selectedCovers?.toString() || '1'], [settingStringVariableNames.hostname, window.location.hostname || 'Unknown Hostname'], [settingStringVariableNames.coverUrl, cover?.editedUrl || cover?.url || 'Unknown Cover URL']]);
  }
  m_setCoverFilename(cover) {
    const name = this.m_parseFilename(this.m_settings.filenames?.image, cover) || cover.parsedTitle || 'cover';
    const extension = cover.blob?.type.split('/')[1]?.replace('jpeg', 'jpg') || getMatch(cover.url, /\.(\w+)$/, 1) || 'jpg';
    if (this.m_knownFileNames[name] === undefined) this.m_knownFileNames[name] = 0;else ++this.m_knownFileNames[name];
    if (this.m_knownFileNames[name] === 0) cover.filename = name;else cover.filename = `${name} (${this.m_knownFileNames[name]})`;
    cover.extension = extension;
  }
  async download(cover) {
    if (cover.blob) return this.m_setBlob(cover, cover.blob);
    return await gmFetch(cover.url).then(response => {
      if (!response.ok) throw new Error(response.statusText);
      return response.blob();
    }).then(blob => this.m_setBlob(cover, blob));
  }
  m_selectRange(rangeStartCover, rangeEndCover, select = true) {
    if (!this.m_covers) return;
    let rangeStart = this.m_covers.indexOf(rangeStartCover);
    let rangeEnd = this.m_covers.indexOf(rangeEndCover);
    if (rangeStart > rangeEnd) [rangeStart, rangeEnd] = [rangeEnd, rangeStart];
    for (let i = rangeStart; i <= rangeEnd; i++) {
      const cover = this.m_covers[i];
      if (select && cover.errored) continue;
      if (cover.select) cover.select(select);
    }
  }
  m_isSelectAll = () => !this.m_covers.some(cover => cover.selected);
  m_isCropped = () => this.m_covers.some(cover => cover.selected && cover.cropped);
  m_updateButtons() {
    const select = this.m_isSelectAll();
    const cropped = this.m_isCropped();
    if (select) this.m_buttons.selectAll.m_componentElement.innerText = 'Select All';else this.m_buttons.selectAll.m_componentElement.innerText = 'Deselect All';
    this.m_buttons.selectAll.m_show();
    if (select && this.m_covers.every(cover => cover.errored) || select && this.m_covers.some(cover => !cover.loaded && !cover.errored)) this.m_buttons.selectAll.m_disable();else this.m_buttons.selectAll.m_enable();
    if (!cropped) this.m_buttons.crop.m_componentElement.innerText = 'Crop';else this.m_buttons.crop.m_componentElement.innerText = 'Uncrop';
    if (this.m_croppingDisabled || this.m_covers.every(cover => !cover.cropAmount)) this.m_buttons.crop.m_hide();else this.m_buttons.crop.m_show();
    if (this.m_busy || select) this.m_buttons.crop.m_disable();else this.m_buttons.crop.m_enable();
    if (!this.m_covers.some(cover => cover.selected)) {
      this.m_buttons.open.m_disable();
      this.m_buttons.copy.m_disable();
    } else {
      this.m_buttons.open.m_enable();
      this.m_buttons.copy.m_enable();
    }
    this.m_buttons.open.m_show();
    this.m_buttons.copy.m_show();
    if (this.m_covers.every(cover => !cover.blob)) this.m_buttons.zip.m_hide();else this.m_buttons.zip.m_show();
    if (this.m_busy || select || this.m_covers.some(cover => cover.selected && !cover.blob)) this.m_buttons.zip.m_disable();else this.m_buttons.zip.m_enable();
    if (this.m_covers.every(cover => !cover.blobUrl)) this.m_buttons.save.m_hide();else this.m_buttons.save.m_show();
    if (this.m_busy || select || this.m_covers.some(cover => cover.selected && !cover.blobUrl)) this.m_buttons.save.m_disable();else this.m_buttons.save.m_enable();
  }
  m_selectAll() {
    if (!this.m_covers) return;
    this.m_selectRange(this.m_covers[0], this.m_covers[this.m_covers.length - 1], this.m_isSelectAll());
    delete this.m_lastSelected;
  }
  m_getCropMethod(cover) {
    if (cover.cropAmount) return cover.cropAmount;
    if (cover.cropped || !cover.width || !cover.height) return;
    const aspect = Math.floor(cover.width / cover.height * 100) / 100;
    if (cover.width >= 880 && cover.width <= 964 && cover.height === 1200) return 120;
    if (cover.width >= 220 && cover.width <= 241 && cover.height === 300) return 30;
    if (cover.height > 4000 && aspect >= 0.73 && aspect < 0.8) return -355;
    if (cover.width > 2000 && cover.height > 2000 && aspect >= 0.73 && aspect < 0.8) return -211;
    if (cover.width < 2000 && cover.height > 2000 && aspect >= 0.73 && aspect < 0.8) return -224;
  }
  async m_crop(covers = this.m_covers, force = false) {
    if (this.m_busy || !covers || this.m_croppingDisabled) return;
    this.m_busy = true;
    this.m_updateButtons();
    const cropped = this.m_isCropped();
    const coversToCrop = covers.filter(cover => force && cover.cropAmount || cover.selected && cover.cropAmount);
    const progressBar = new SimpleProgressBar(coversToCrop.length);
    progressBar.m_start();
    await Promise.all(coversToCrop.map(async cover => {
      if (force && cover.cropped) {
        progressBar.m_update();
        return;
      } else if (cropped && !force) {
        if (cover.cropped) {
          cover.loaded = false;
          this.m_removeBlob(cover);
          delete cover.editedUrl;
          delete cover.thumbnailUrl;
          cover.extension = cover.croppedExtension;
          cover.cropped = false;
          await this.m_loadCover(cover).catch(console.error);
        }
        progressBar.m_update();
        return;
      }
      const cropExtension = this.m_settings.crop.format?.replace('jpeg', 'jpg');
      const width = cover.width;
      const height = cover.height;
      const cropAmount = cover.cropAmount;
      const absoluteCropAmount = Math.abs(cropAmount);
      const croppedWidth = width - absoluteCropAmount;
      const cropSettings = {
        url: cover.url,
        output: this.m_settings.crop.format,
        quality: this.m_settings.crop.quality,
        width,
        height,
        cw: cropAmount > 0 ? croppedWidth : undefined,
        cx: cropAmount < 0 ? absoluteCropAmount : undefined
      };
      let croppedImage = await getWsrvImage(cropSettings).catch(console.warn);
      if (croppedImage) {
        const croppedShareUrl = getWsrvUrl(cropSettings);
        cover.editedUrl = croppedShareUrl.href;
      } else if (cover.blobUrl) {
        croppedImage = await cropImage({
          ...cropSettings,
          url: cover.blobUrl
        }).catch(console.error);
      }
      if (croppedImage) {
        const thumbnailAbsoluteCropAmount = Math.round(absoluteCropAmount * (this.m_thumbnail.width / width));
        const thumbnailCroppedWidth = this.m_thumbnail.width - thumbnailAbsoluteCropAmount;
        const thumbnailUrl = getWsrvUrl({
          url: cover.url,
          ...this.m_thumbnail,
          cw: cropAmount > 0 ? thumbnailCroppedWidth : undefined,
          cx: cropAmount < 0 ? thumbnailAbsoluteCropAmount : undefined
        });
        cover.loaded = false;
        this.m_removeBlob(cover);
        this.m_setBlob(cover, croppedImage);
        cover.width = croppedWidth;
        cover.height = height;
        cover.thumbnailUrl = thumbnailUrl.href;
        cover.croppedExtension = cover.extension;
        cover.extension = cropExtension;
        cover.cropped = true;
        await this.m_loadCover(cover).catch(console.error);
      } else {
        console.error('Failed to crop cover:', cover.url);
        cover.loaded = false;
        this.m_removeBlob(cover);
        if (cover.croppedExtension) cover.extension = cover.croppedExtension;
        cover.cropped = false;
        await this.m_loadCover(cover).catch(console.error);
      }
      progressBar.m_update();
    }));
    progressBar.m_remove();
    this.m_busy = false;
    this.m_updateButtons();
  }
  m_open() {
    this.m_covers.forEach(cover => {
      if (!cover.selected) return;
      openNewTab(cover.cropped ? cover.editedUrl || cover.blobUrl || cover.url : cover.url);
    });
  }
  async m_copy() {
    let clipboardText = '';
    this.m_covers.forEach(cover => {
      if (!cover.selected) return;
      clipboardText += this.m_parseFilename(this.m_settings.copyFormat, cover) || '';
    });
    const copied = await copyText(clipboardText);
    if (!copied) await alertModal('Failed to copy to clipboard!\n' + clipboardText, 'error');
  }
  async m_save() {
    if (this.m_busy) return;
    const path = this.m_parseFilename(this.m_settings.paths?.image);
    this.m_busy = true;
    this.m_updateButtons();
    for (const cover of this.m_covers) {
      if (!cover.selected) continue;
      const filename = `${cover.filename}.${cover.extension}`;
      await saveFile(isUserScript && this.m_settings.paths?.enabled ? cover.cropped ? cover.editedUrl || cover.blobUrl || cover.url : cover.url : cover.blobUrl || cover.editedUrl || cover.url, filename, {
        path: this.m_settings.paths?.enabled ? path : undefined
      });
    }
    this.m_busy = false;
    this.m_updateButtons();
  }
  async m_zip() {
    if (this.m_busy) return;
    const path = this.m_parseFilename(this.m_settings.paths?.zip);
    const filename = `${this.m_parseFilename(this.m_settings.filenames?.zip) || 'covers'}.zip`;
    this.m_busy = true;
    this.m_updateButtons();
    const selectedCoverFiles = this.m_covers.filter(cover => cover.selected && cover.blob).map(cover => new File([cover.blob], `${cover.filename}.${cover.extension}`, {
      type: cover.blob.type
    }));
    const progressBar = new SimpleProgressBar();
    const abortController = new AbortController();
    if (this.m_aborted) abortController.abort();
    progressBar.m_start({
      maxValue: selectedCoverFiles.length
    });
    let zipFile;
    try {
      zipFile = await zipFiles(selectedCoverFiles, {
        filename,
        signal: abortController.signal,
        onProgress: () => {
          if (this.m_aborted) abortController.abort();
          progressBar.m_update();
        }
      });
    } catch (error) {
      console.error(error);
      progressBar.m_remove();
      this.m_busy = false;
      this.m_updateButtons();
      if (!this.m_aborted) await alertModal('Failed to zip covers!\n' + error, 'error');
    }
    this.m_busy = false;
    this.m_updateButtons();
    progressBar.m_remove();
    if (zipFile) await saveFile(zipFile, filename, {
      path: this.m_settings.paths?.enabled ? path : undefined
    });
  }
}

function ExportTitle(data) {
  const mainTitleLang = data.title ? Object.keys(data.title)[0] : undefined;
  const mainTitle = mainTitleLang ? data.title?.[mainTitleLang] : undefined;
  const altTitleLang = data.altTitles?.[0] ? Object.keys(data.altTitles[0])[0] : undefined;
  const altTitle = altTitleLang ? data.altTitles?.[0]?.[altTitleLang] : undefined;
  const name = `${mainTitle || altTitle || 'rbm-title-export'} [${mainTitleLang || altTitleLang || 'en'}] (${window.location.hostname})`;
  const extension = 'json';
  const filename = `${name}.${extension}`;
  const dataString = JSON.stringify(data, null, 2);
  exportTextFileModal(dataString, filename);
}
const titleImporterSettings = [{
  id: 'include_title',
  type: 'checkbox',
  name: 'Title',
  defaultValue: true
}, {
  id: 'include_altTitles',
  type: 'checkbox',
  name: 'Alternative Titles',
  defaultValue: true
}, {
  id: 'include_description',
  type: 'checkbox',
  name: 'Synopsis',
  defaultValue: true
}, {
  id: 'include_authors',
  type: 'checkbox',
  name: 'Authors',
  defaultValue: true
}, {
  id: 'include_artists',
  type: 'checkbox',
  name: 'Artists',
  defaultValue: true
}, {
  id: 'include_originalLanguage',
  type: 'checkbox',
  name: 'Original Language',
  defaultValue: true
}, {
  id: 'include_contentRating',
  type: 'checkbox',
  name: 'Content Rating',
  defaultValue: true
}, {
  id: 'include_publicationDemographic',
  type: 'checkbox',
  name: 'Magazine Demographic',
  defaultValue: true
}, {
  id: 'include_status',
  type: 'checkbox',
  name: 'Publication Status',
  defaultValue: true
}, {
  id: 'include_lastChapter',
  type: 'checkbox',
  name: 'Final Chapter',
  defaultValue: true
}, {
  id: 'include_year',
  type: 'checkbox',
  name: 'Publication Year',
  defaultValue: true
}, {
  id: 'include_tags',
  type: 'checkbox',
  name: 'Tags',
  defaultValue: true
}, {
  id: 'include_links',
  type: 'checkbox',
  name: 'Site Links',
  defaultValue: true
}, {
  id: 'include_covers',
  type: 'checkbox',
  name: 'Covers',
  defaultValue: true
}, {
  id: 'include_includeCoverLocales',
  type: 'checkbox',
  name: 'Cover Locales',
  defaultValue: true
}, {
  id: 'include_includeCoverDescriptions',
  type: 'checkbox',
  name: 'Cover Descriptions',
  defaultValue: true
}];
const titleImporterSettingsField = new SettingsField({
  id: '84f42ce5-3b7b-4d70-9fb8-09076bf467c4',
  name: 'Title Importer',
  description: 'Data selected by default when importing a title.',
  settings: titleImporterSettings
});

class MangadexBookmarklet extends Bookmarklet {
  m_website = `^(${MANGADEX_URL.hostname}|${MANGADEX_CANARY_URL.hostname}|${MANGADEX_SANDBOX_URL.hostname})`;
}

const baseTitleSiteLinks = {
  al: `${ANILIST_URL.origin}/manga/`,
  ap: `${ANIME_PLANET_URL.origin}/manga/`,
  kt: `${KITSU_URL.origin}/manga/`,
  mu: `${MANGAUPDATES_URL.origin}/series/`,
  mu_num: `${MANGAUPDATES_URL.origin}/series.html?id=`,
  mal: `${MYANIMELIST_URL.origin}/manga/`,
  nu: `${NOVELUPDATES_URL.origin}/series/`,
  bw: `${BOOKWALKER_URL.origin}/`,
  amz: '',
  ebj: '',
  cdj: '',
  md: `${MANGADEX_URL.origin}/title/`
};
const mdComponentColors = {
  color: 'rgb(var(--md-color))',
  primary: 'rgb(var(--md-primary))',
  background: 'rgb(var(--md-background))',
  accent: 'rgb(var(--md-accent))',
  buttonAccent: 'rgb(var(--md-button-accent))',
  statusYellow: 'rgb(var(--md-status-yellow))',
  statusRed: 'rgb(var(--md-status-red))'
};
const titleId = (path = window.location.pathname) => getMatch(path, new RegExp(formatRegexText('/title/(?:edit/)?(:uuid)')), 1);
const listId = (path = window.location.pathname) => getMatch(path, new RegExp(formatRegexText('/list/(:uuid)')), 1);
const chapterId = (path = window.location.pathname) => getMatch(path, new RegExp(formatRegexText('/chapter/(:uuid)')), 1);
const useComponents = () => setComponentColors({
  text: mdComponentColors.color,
  primary: mdComponentColors.primary,
  secondary: mdComponentColors.buttonAccent,
  background: mdComponentColors.background,
  accent: mdComponentColors.accent,
  warning: mdComponentColors.statusYellow,
  error: mdComponentColors.statusRed
});
const authToken = () => parseStorage(`oidc.user:${MANGADEX_AUTH_URL.origin}/realms/mangadex:mangadex-frontend-stable`) || parseStorage(`oidc.user:${MANGADEX_AUTH_URL.origin}/realms/mangadex:mangadex-frontend-canary`) || parseStorage(`oidc.user:${MANGADEX_DEV_AUTH_URL.origin}/realms/mangadex:mangadex-frontend-sandbox`);
const storage = () => parseStorage('md');
const locale = () => storage()?.userPreferences?.interfaceLocale || storage()?.userPreferences?.locale || 'en';
const localTime = (date = Date.now()) => new Date(date).toLocaleString(locale(), {
  hour12: false
});
const langDisplayName = () => new Intl.DisplayNames([locale()], {
  type: 'language'
});
const linkIdToURL = (siteId, seriesId) => {
  if (!siteId || !seriesId) return '';
  let baseURL = baseTitleSiteLinks[siteId] || '';
  if (siteId === 'mu' && !/[A-Za-z]/.test(seriesId)) baseURL = baseTitleSiteLinks['mu_num'];
  return baseURL + seriesId;
};

const baseUrlSetting = {
  id: 'base_url',
  type: 'text',
  name: 'Base URL',
  description: 'The base URL of the MangaDex API.',
  defaultValue: window.location.hostname.startsWith('sandbox') ? MANGADEX_DEV_API_URL.origin : MANGADEX_API_URL.origin
};
const moreInfoString = `\nMore information at ${MANGADEX_API_URL.origin}/docs/2-limitations/#general-rate-limit`;
const rateLimitRequestsSetting = {
  id: 'rate_limit_requests',
  type: 'text',
  name: 'Rate Limit Requests',
  description: 'The number of requests allowed per the time specified in the Rate Limit Time field.' + moreInfoString,
  defaultValue: '5'
};
const rateLimitTimeSetting = {
  id: 'rate_limit_time',
  type: 'text',
  name: 'Rate Limit Time (ms)',
  description: 'The time in milliseconds to wait between requests.' + moreInfoString,
  defaultValue: '1000'
};
const mangadexAPISettings = new SettingsField({
  id: '8993eca2-7906-43ff-a0b2-9716b67ea229',
  name: 'API',
  settings: [baseUrlSetting, rateLimitRequestsSetting, rateLimitTimeSetting]
});
const rateLimitRequestsValue = mangadexAPISettings.m_getValue(rateLimitRequestsSetting.id);
let rateLimitRequestsNumber = rateLimitRequestsValue ? parseInt(rateLimitRequestsValue) : parseInt(rateLimitRequestsSetting.defaultValue);
rateLimitRequestsNumber = Math.max(1, rateLimitRequestsNumber);
const rateLimitTimeValue = mangadexAPISettings.m_getValue(rateLimitTimeSetting.id);
let rateLimitTimeNumber = rateLimitTimeValue ? parseInt(rateLimitTimeValue) : parseInt(rateLimitTimeSetting.defaultValue);
rateLimitTimeNumber = Math.max(0, rateLimitTimeNumber);
const baseUrl = mangadexAPISettings.m_getValue(baseUrlSetting.id);
const fetchClient = new FetchClient({
  rateLimitRequests: rateLimitRequestsNumber,
  rateLimitTime: rateLimitTimeNumber
});
const contentRatings = ['safe', 'suggestive', 'erotica', 'pornographic'];
const checkResourceId = id => {
  if (!id) throw new Error('Invalid ID');
};
async function responsePromise({
  path,
  query,
  method = 'GET',
  body,
  useAuth = false,
  contentType
}) {
  return await new Promise((resolve, reject) => {
    if (query?.offset) if (query?.offset + query?.limit > 10000) reject(new Error('Collection size limit reached'));
    const headers = {};
    if (useAuth) {
      const authToken$1 = authToken();
      if (!authToken$1) reject(new Error('Not logged in'));else headers.Authorization = `${authToken$1.token_type} ${authToken$1.access_token}`;
    }
    if (contentType) headers['Content-Type'] = contentType;
    fetchClient.m_fetch(createUrl(baseUrl, path, query), {
      method: method,
      body: body,
      headers: headers
    }).then(response => response.json()).then(responseJson => {
      let error;
      if (responseJson.result !== 'ok') {
        if (Array.isArray(responseJson.errors)) error = JSON.stringify(responseJson.errors) || 'Unknown error';else error = 'Unknown error';
      } else if (!responseJson) {
        error = 'Response is empty';
      }
      if (error) reject(new Error(error));else resolve(responseJson);
    }).catch(reject);
  });
}
async function collectionResponsePromise({
  options,
  offset = 0,
  limit = 10000,
  collectionLimit = 100,
  callback
}) {
  const responseCollectionLimit = Math.min(collectionLimit, limit);
  let allResponses;
  let responseOffset = offset;
  let responseTotal = Math.min(10000, offset + limit);
  while (responseOffset < responseTotal) {
    const response = await responsePromise({
      ...options,
      query: {
        ...options.query,
        offset: responseOffset,
        limit: responseCollectionLimit
      }
    });
    if (!response.data.length) break;
    responseTotal = Math.min(responseTotal, response.total);
    responseOffset += responseCollectionLimit;
    if (!allResponses) {
      allResponses = {
        result: response.result,
        response: response.response,
        data: response.data,
        limit: response.limit,
        offset: response.offset,
        total: response.total
      };
    } else allResponses.data.push(...response.data);
    if (callback) callback(response);
  }
  if (!allResponses) throw new Error('All responses are empty');
  return allResponses;
}
async function getMangaList({
  title,
  ids,
  includes = [],
  contentRating = contentRatings,
  offset,
  limit,
  callback
} = {}) {
  const websiteTitleId = titleId();
  if (!ids && websiteTitleId) ids = [websiteTitleId];
  const query = {
    'includes[]': includes,
    'contentRating[]': contentRating
  };
  if (title) query['title'] = title;
  if (ids) query['ids[]'] = ids;
  return await collectionResponsePromise({
    options: {
      path: '/manga',
      query
    },
    offset,
    limit,
    callback: callback
  });
}
async function getChapterList({
  title,
  ids,
  manga,
  includes = [],
  contentRating = contentRatings,
  includeUnavailable,
  offset,
  limit,
  callback
} = {}) {
  const websiteTitleId = titleId();
  if (!ids && websiteTitleId) ids = [websiteTitleId];
  const query = {
    'includes[]': includes,
    'contentRating[]': contentRating
  };
  if (title) query['title'] = title;
  if (ids) query['ids[]'] = ids;
  if (manga) query['manga'] = manga;
  if (includeUnavailable !== undefined) query['includeUnavailable'] = includeUnavailable ? '1' : '0';
  return await collectionResponsePromise({
    options: {
      path: '/chapter',
      query
    },
    offset,
    limit,
    callback: callback
  });
}
async function getMangaStatuses({
  status
} = {}) {
  const query = {};
  if (status) query['status'] = status;
  return await responsePromise({
    path: '/manga/status',
    query,
    useAuth: true
  });
}
async function getReadMarkers({
  mangaIds,
  grouped = true
} = {}) {
  const websiteTitleId = titleId();
  if (!mangaIds && websiteTitleId) mangaIds = [websiteTitleId];
  const query = {
    'ids[]': mangaIds || [],
    grouped: grouped
  };
  return await responsePromise({
    path: '/manga/read',
    query,
    useAuth: true
  });
}
async function getCustomList({
  id = listId(),
  visibility
} = {}) {
  checkResourceId(id);
  return await responsePromise({
    path: `/list/${id}`,
    useAuth: visibility !== 'public'
  });
}
async function getMangaStatistics({
  mangaIds
} = {}) {
  const websiteTitleId = titleId();
  if (!mangaIds && websiteTitleId) mangaIds = [websiteTitleId];
  const query = {
    'manga[]': mangaIds || []
  };
  return await responsePromise({
    path: '/statistics/manga',
    query
  });
}
async function getMangaRatings({
  mangaIds
} = {}) {
  const websiteTitleId = titleId();
  if (!mangaIds && websiteTitleId) mangaIds = [websiteTitleId];
  const query = {
    'manga[]': mangaIds || []
  };
  return await responsePromise({
    path: '/rating',
    query,
    useAuth: true
  });
}
async function getChapterStatistics({
  chapterIds
} = {}) {
  const websiteChapterId = chapterId();
  if (!chapterIds && websiteChapterId) chapterIds = [websiteChapterId];
  const query = {
    'chapter[]': chapterIds || []
  };
  return await responsePromise({
    path: '/statistics/chapter',
    query
  });
}
async function getLoggedUser() {
  return await responsePromise({
    path: '/user/me',
    useAuth: true
  });
}

class AmazonBookmarklet extends Bookmarklet {
  m_website = '^www.amazon[a-z.]+$';
}

class BookliveBookmarklet extends Bookmarklet {
  m_website = `^${BOOKLIVE_URL.hostname}$`;
}

class BookwalkerBookmarklet extends Bookmarklet {
  m_website = `^(${BOOKWALKER_URL.hostname}|${BOOKWALKER_R18_URL.hostname}|${BOOKWALKER_GLOBAL_URL.hostname}|${BOOKWALKER_VIEWER_TRIAL_URL.hostname})$`;
}

class KodanshaBookmarklet extends Bookmarklet {
  m_website = `^(${KODANSHA_JAPAN_URL.hostname}|${KODANSHA_US_URL.hostname})`;
}

class UniversalSettings extends UniversalBookmarklet {
  m_additionalFields = [];
  m_main = () => {
    const fields = [];
    if (new MangadexBookmarklet().m_isWebsite()) {
      useComponents();
      fields.push(mangadexAPISettings, titleImporterSettingsField);
    } else if (new AmazonBookmarklet().m_isWebsite()) {
      fields.push(coverDownloaderSettings);
    } else if (new BookliveBookmarklet().m_isWebsite()) {
      fields.push(coverDownloaderSettings);
    } else if (new BookwalkerBookmarklet().m_isWebsite()) {
      fields.push(coverDownloaderSettings);
    } else if (new KodanshaBookmarklet().m_isWebsite()) {
      fields.push(coverDownloaderSettings);
    }
    new Settings([...fields, ...this.m_additionalFields]).m_add();
  };
}

class MangadexExportTitleList extends MangadexBookmarklet {
  m_main = async () => {
    useComponents();
    const errors = [];
    const onError = e => {
      console.error(e);
      errors.push(e);
    };
    const listId$1 = listId();
    let mangaList = [];
    const exportFormatOptions = {
      xml: 'MyAnimeList XML',
      csv: 'CSV',
      json: 'JSON'
    };
    const exportFormat = await selectModal('Export format', Object.values(exportFormatOptions));
    if (!exportFormat) return;
    const csvDataColumns = {
      title: 'Title',
      originalTitle: 'Original Title',
      originalLanguage: 'Original Language',
      author: 'Authors',
      year: 'Publication Year',
      publication: 'Publication Status',
      contentRating: 'Content Rating',
      demographic: 'Demographic',
      tags: 'Tags',
      description: 'Description',
      mangaId: 'Manga ID',
      mangaThread: 'Manga Forum Thread ID',
      myRating: 'My Rating',
      readingStatus: listId$1 ? 'List Name' : 'My Reading Status',
      isOneshot: 'Is Oneshot',
      lastVolume: 'Last Published Volume',
      lastChapter: 'Last Published Chapter',
      readVolume: 'Latest Read Volume',
      readChapter: 'Latest Read Chapter',
      readChapterScans: 'Latest Read Chapter Scanlation Groups',
      readChapterId: 'Latest Read Chapter ID',
      readChapterThread: 'Latest Read Chapter Forum Thread ID',
      anilist: 'Anilist',
      animePlanet: 'Anime Planet',
      kitsu: 'Kitsu',
      mangaUpdates: 'MangaUpdates',
      myAnimeList: 'MyAnimeList',
      novelUpdates: 'NovelUpdates',
      bookWalker: 'BookWalker',
      amazon: 'Amazon',
      ebookJapan: 'Ebook Japan',
      cdJapan: 'CD Japan',
      officialRaw: 'Official Raw',
      officialEnglish: 'Official English'
    };
    const allIncludeDataOptions = {
      ...csvDataColumns,
      askForPreferredLang: 'Ask for Preferred Language',
      includeUnavailableChapters: 'Include Unavailable Chapters',
      updateOnImport: 'Update on Import',
      excludeNoMal: 'Exclude Titles with no MyAnimeList ID'
    };
    const includeDataOptions = [allIncludeDataOptions.askForPreferredLang, allIncludeDataOptions.includeUnavailableChapters];
    const defaultIncludeDataOptions = [allIncludeDataOptions.askForPreferredLang, allIncludeDataOptions.includeUnavailableChapters];
    switch (exportFormat) {
      case exportFormatOptions.xml:
        {
          includeDataOptions.push(allIncludeDataOptions.updateOnImport, allIncludeDataOptions.excludeNoMal, allIncludeDataOptions.myRating, allIncludeDataOptions.readingStatus, allIncludeDataOptions.lastVolume, allIncludeDataOptions.lastChapter, allIncludeDataOptions.readVolume, allIncludeDataOptions.readChapter, allIncludeDataOptions.readChapterScans);
          defaultIncludeDataOptions.push(allIncludeDataOptions.updateOnImport, allIncludeDataOptions.excludeNoMal, allIncludeDataOptions.myRating, allIncludeDataOptions.readingStatus, allIncludeDataOptions.lastVolume, allIncludeDataOptions.lastChapter, allIncludeDataOptions.readVolume, allIncludeDataOptions.readChapter);
          break;
        }
      case exportFormatOptions.csv:
        {
          includeDataOptions.push(...Object.values(csvDataColumns));
          defaultIncludeDataOptions.push(allIncludeDataOptions.title, allIncludeDataOptions.originalTitle, allIncludeDataOptions.originalLanguage, allIncludeDataOptions.year, allIncludeDataOptions.readingStatus, allIncludeDataOptions.readVolume, allIncludeDataOptions.readChapter);
          break;
        }
    }
    const dataToInclude = await checkboxModal('Options', includeDataOptions, defaultIncludeDataOptions);
    if (dataToInclude === null || dataToInclude === undefined) return;
    switch (exportFormat) {
      case exportFormatOptions.xml:
        {
          dataToInclude.push(...[allIncludeDataOptions.title, allIncludeDataOptions.isOneshot, allIncludeDataOptions.myAnimeList]);
          break;
        }
      case exportFormatOptions.json:
        {
          dataToInclude.push(...Object.values(csvDataColumns));
          break;
        }
    }
    const progressBar = new SimpleProgressBar();
    progressBar.m_start({
      maxValue: 1
    });
    if (listId$1) {
      mangaList = await getCustomList({
        id: listId$1
      }).then(response => response.data.relationships.filter(rel => rel.type === 'manga').map(rel => ({
        id: rel.id,
        listName: response.data.attributes.name
      }))).catch(onError);
    } else {
      mangaList = await getMangaStatuses().then(response => Object.entries(response.statuses).map(([id, status]) => ({
        id,
        status
      }))).catch(onError);
    }
    const mangaIds = mangaList?.map(status => status.id);
    progressBar.m_update();
    if (!mangaIds?.length) return alertModal('This list seems empty!', 'error');
    const splitMangaIds = splitArray(mangaIds, 100);
    progressBar.m_start({
      maxValue: splitMangaIds.length
    });
    const splitMangaData = await Promise.all(splitMangaIds.flatMap(async ids => {
      const data = await getMangaList({
        ids: ids,
        includes: dataToInclude.includes(allIncludeDataOptions.author) ? ['artist', 'author'] : undefined
      }).then(response => response.data).catch(onError);
      progressBar.m_update();
      return data;
    }));
    progressBar.m_remove();
    if (!splitMangaData) return alertModal('Failed to fetch manga data!', 'error');
    const mangaData = splitMangaData.flat().filter(m => !!m);
    let preferredLang;
    if (dataToInclude.includes(allIncludeDataOptions.askForPreferredLang)) {
      const allTitleLangs = dataToInclude.includes(allIncludeDataOptions.title) ? mangaData.filter(m => Array.isArray(m.attributes.altTitles)).flatMap(m => m.attributes.altTitles.flatMap(altTitle => Object.keys(altTitle))) : [];
      const allDescriptionLangs = dataToInclude.includes(allIncludeDataOptions.description) ? mangaData.flatMap(m => Object.keys(m.attributes.description)) : [];
      const allLangs = {};
      [...allTitleLangs, ...allDescriptionLangs].forEach(lang => {
        let displayName = lang;
        try {
          displayName = langDisplayName().of(lang) || lang;
        } catch (e) {
          console.warn(e);
        }
        if (!allLangs[displayName]) allLangs[displayName] = lang;
      });
      if (Object.keys(allLangs).length > 0) {
        const siteLocaleName = langDisplayName().of(locale());
        const preferredLangName = await selectModal('Preferred language', Object.keys(allLangs).sort((a, b) => a === siteLocaleName ? -1 : b === siteLocaleName ? 1 : a.localeCompare(b)));
        if (preferredLangName) preferredLang = allLangs[preferredLangName];
      }
    }
    const mangaDataSplitIds = splitArray(mangaData.map(m => m.id), 100);
    progressBar.m_start({
      maxValue: mangaDataSplitIds.length
    });
    let mangaStatistics = {};
    if (dataToInclude.includes(allIncludeDataOptions.mangaThread)) {
      const splitMangaStatistics = await Promise.all(mangaDataSplitIds.map(async ids => {
        const data = await getMangaStatistics({
          mangaIds: ids
        }).then(response => response.statistics).catch(onError);
        progressBar.m_update();
        return data;
      }));
      splitMangaStatistics.forEach(data => {
        mangaStatistics = {
          ...mangaStatistics,
          ...data
        };
      });
    }
    progressBar.m_remove();
    progressBar.m_start();
    let mangaRatings = {};
    if (dataToInclude.includes(allIncludeDataOptions.myRating)) {
      const splitMangaRatings = await Promise.all(mangaDataSplitIds.map(async ids => {
        const data = await getMangaRatings({
          mangaIds: ids
        }).then(response => response.ratings).catch(onError);
        progressBar.m_update();
        return data;
      }));
      splitMangaRatings.forEach(data => {
        mangaRatings = {
          ...mangaRatings,
          ...data
        };
      });
    }
    progressBar.m_remove();
    progressBar.m_start();
    let readChapterMarkers = {};
    let chapterStatistics = {};
    if (dataToInclude.includes(allIncludeDataOptions.readChapter) || dataToInclude.includes(allIncludeDataOptions.readVolume)) {
      const splitReadChapterMarkers = await Promise.all(mangaDataSplitIds.map(async ids => {
        const data = await getReadMarkers({
          mangaIds: ids,
          grouped: true
        }).then(response => response.data).catch(onError);
        progressBar.m_update();
        return data;
      }));
      progressBar.m_remove();
      splitReadChapterMarkers.forEach(data => {
        readChapterMarkers = {
          ...readChapterMarkers,
          ...data
        };
      });
    }
    const readChapterIds = Object.values(readChapterMarkers).flat();
    const splitReadChapterIds = splitArray(readChapterIds, 100);
    progressBar.m_start({
      maxValue: splitReadChapterIds.length
    });
    let chapterData = [];
    if (readChapterIds.length > 0) {
      const splitReadChapterData = await Promise.all(splitReadChapterIds.flatMap(async ids => {
        const data = await getChapterList({
          ids,
          includes: dataToInclude.includes(allIncludeDataOptions.readChapterScans) ? ['scanlation_group'] : undefined,
          includeUnavailable: dataToInclude.includes(allIncludeDataOptions.includeUnavailableChapters)
        }).then(response => response.data).catch(onError);
        progressBar.m_update();
        return data;
      }));
      progressBar.m_remove();
      chapterData = splitReadChapterData.flat().filter(c => !!c);
      const splitChapterDataIds = splitArray(chapterData.map(c => c.id), 100);
      if (dataToInclude.includes(allIncludeDataOptions.readChapterThread)) {
        progressBar.m_start({
          maxValue: splitChapterDataIds.length
        });
        const splitChapterStatistics = await Promise.all(splitChapterDataIds.map(async ids => {
          const data = await getChapterStatistics({
            chapterIds: ids
          }).then(response => response.statistics).catch(onError);
          progressBar.m_update();
          return data;
        }));
        splitChapterStatistics.forEach(data => {
          chapterStatistics = {
            ...chapterStatistics,
            ...data
          };
        });
      }
    }
    progressBar.m_remove();
    const mergedData = mangaData.map(manga => {
      const mainTitle = manga.attributes.title[Object.keys(manga.attributes.title)[0]];
      const altTitles = Array.isArray(manga.attributes.altTitles) ? manga.attributes.altTitles : undefined;
      const preferredTitle = preferredLang ? altTitles?.find(t => t[preferredLang])?.[preferredLang] || mainTitle : mainTitle;
      const fallbackDescription = manga.attributes.description.en || manga.attributes.description[manga.attributes.originalLanguage] || manga.attributes.description[Object.keys(manga.attributes.description)[0]];
      const preferredDescription = preferredLang ? manga.attributes.description[preferredLang] || fallbackDescription : fallbackDescription;
      const originalTitle = altTitles?.find(t => t[manga.attributes.originalLanguage])?.[manga.attributes.originalLanguage];
      const readChapters = chapterData.map(c => {
        if (readChapterMarkers[manga.id]?.includes(c.id)) return {
          ...c,
          ...chapterStatistics[c.id]
        };
      }).filter(c => !!c).sort((a, b) => {
        const aDigits = a.attributes.chapter?.split('.').map(d => parseInt(d));
        const bDigits = b.attributes.chapter?.split('.').map(d => parseInt(d));
        if (aDigits && bDigits) {
          const aNum = aDigits.reduce((acc, cur) => acc * 10 + cur, 0);
          const bNum = bDigits.reduce((acc, cur) => acc * 10 + cur, 0);
          return aNum - bNum;
        }
        return 0;
      });
      const list = mangaList?.find(s => s.id === manga.id);
      const allAuthorNames = manga.relationships.filter(rel => ['author', 'artist'].includes(rel.type) && rel.attributes?.name).filter((rel, i, arr) => arr.findIndex(r => r.id === rel.id) === i).map(a => a.attributes?.name).filter(a => !!a).join(', ');
      const allTags = manga.attributes.tags.map(t => t.attributes.name.en).join(', ');
      const latestReadChapter = readChapters[readChapters.length - 1];
      const scanlationGroups = latestReadChapter?.relationships.map(rel => {
        if (rel.type === 'scanlation_group') return rel.attributes?.name;
      }).filter(s => !!s).join(', ');
      const isOneshot = manga.attributes.tags.some(t => t.id === '0234a31e-a729-4e28-9d6a-3f87c4966b9e');
      const lastVolume = manga.attributes.lastVolume;
      const lastChapter = isOneshot ? manga.attributes.lastChapter || '0' : manga.attributes.lastChapter;
      return {
        ...manga,
        preferredTitle,
        preferredDescription,
        originalTitle,
        allAuthorNames,
        allTags,
        isOneshot,
        lastVolume,
        lastChapter,
        mangaThreadId: mangaStatistics[manga.id]?.comments?.threadId,
        listName: list?.listName,
        readingStatus: list?.status,
        readChapters,
        latestReadVolume: latestReadChapter?.attributes.volume,
        latestReadChapter: latestReadChapter?.attributes.chapter === null ? '0' : latestReadChapter?.attributes.chapter,
        latestReadChapterScans: scanlationGroups,
        latestReadChapterId: latestReadChapter?.id,
        latestReadChapterThreadId: readChapters[readChapters.length - 1]?.comments?.threadId,
        myRating: mangaRatings[manga.id]?.rating
      };
    }).sort((a, b) => a.preferredTitle.localeCompare(b.preferredTitle));
    const filename = `MangaDex ${mangaList?.[0]?.listName || (listId$1 ? 'List' : 'Library')} ${localTime().replaceAll(/[:/]/g, '-')}`;
    switch (exportFormat) {
      case exportFormatOptions.xml:
        {
          const malStatuses = {
            reading: 'Reading',
            completed: 'Completed',
            onHold: 'On Hold',
            dropped: 'Dropped',
            planToRead: 'Plan to Read'
          };
          const statusToMal = status => {
            let malStatus = malStatuses.reading;
            if (status) {
              switch (status.toLowerCase()) {
                case 'reading':
                case 're_reading':
                  malStatus = malStatuses.reading;
                  break;
                case 'completed':
                  malStatus = malStatuses.completed;
                  break;
                case 'on_hold':
                  malStatus = malStatuses.onHold;
                  break;
                case 'dropped':
                  malStatus = malStatuses.dropped;
                  break;
                case 'plan_to_read':
                  malStatus = malStatuses.planToRead;
                  break;
              }
            }
            return malStatus;
          };
          const excludedMangaIds = [];
          const mergedMalData = mergedData.filter(d => {
            if (dataToInclude.includes(allIncludeDataOptions.excludeNoMal) && !d.attributes.links?.mal) {
              excludedMangaIds.push(d.id);
              return false;
            }
            return true;
          }).map(d => ({
            ...d,
            readingStatus: statusToMal(d.readingStatus)
          }));
          let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
          let xmlMyAnimeListSection = '';
          const user = await getLoggedUser().catch(onError);
          const allMalStatuses = mergedMalData.map(d => d.readingStatus);
          let xmlMyInfoSection = '';
          xmlMyInfoSection += formatXMLTag('user_id', '', 2);
          xmlMyInfoSection += formatXMLTag('user_name', user?.data.attributes?.username || 'MangaDex User', 2);
          xmlMyInfoSection += formatXMLTag('user_export_type', '2', 2);
          xmlMyInfoSection += formatXMLTag('user_total_manga', mergedMalData.length.toString(), 2);
          xmlMyInfoSection += formatXMLTag('user_total_reading', allMalStatuses.filter(s => s === malStatuses.reading).length.toString(), 2);
          xmlMyInfoSection += formatXMLTag('user_total_completed', allMalStatuses.filter(s => s === malStatuses.completed).length.toString(), 2);
          xmlMyInfoSection += formatXMLTag('user_total_onhold', allMalStatuses.filter(s => s === malStatuses.onHold).length.toString(), 2);
          xmlMyInfoSection += formatXMLTag('user_total_dropped', allMalStatuses.filter(s => s === malStatuses.dropped).length.toString(), 2);
          xmlMyInfoSection += formatXMLTag('user_total_plantoread', allMalStatuses.filter(s => s === malStatuses.planToRead).length.toString(), 2);
          xmlMyAnimeListSection += formatXMLTag('myinfo', '\n' + xmlMyInfoSection + '\t', 1) + '\n';
          const formatChapterNumber = chapter => {
            if (!chapter) return '0';
            const chapterNum = parseInt(chapter.split('.')[0]);
            return chapterNum ? chapterNum.toString() : '0';
          };
          const reReadingMangaIds = mergedData.filter(d => d.readingStatus === 're_reading').map(d => d.id);
          mergedMalData.forEach(manga => {
            const mangaVolumes = dataToInclude.includes(allIncludeDataOptions.lastVolume) ? formatChapterNumber(manga.lastVolume) : '0';
            const mangaChapters = dataToInclude.includes(allIncludeDataOptions.lastChapter) ? manga.lastChapter === '0' && manga.isOneshot ? '1' : formatChapterNumber(manga.lastChapter) : '0';
            const myReadVolumes = dataToInclude.includes(allIncludeDataOptions.readVolume) ? formatChapterNumber(manga.latestReadVolume) : '0';
            const myReadChapters = dataToInclude.includes(allIncludeDataOptions.readChapter) ? manga.latestReadChapter === '0' && manga.isOneshot ? '1' : formatChapterNumber(manga.latestReadChapter) : '0';
            const myScanalationGroup = dataToInclude.includes(allIncludeDataOptions.readChapterScans) ? manga.latestReadChapterScans : '';
            const myScore = dataToInclude.includes(allIncludeDataOptions.myRating) ? manga.myRating?.toString() : '0';
            const myStatus = dataToInclude.includes(allIncludeDataOptions.readingStatus) ? manga.readingStatus : '';
            const myTimesRead = (myStatus === malStatuses.completed || reReadingMangaIds.includes(manga.id) ? '1' : null) || (myReadChapters !== '0' && mangaChapters !== '0' ? parseInt(myReadChapters) >= parseInt(mangaChapters) ? '1' : '0' : '0');
            const updateOnImport = dataToInclude.includes(allIncludeDataOptions.updateOnImport) ? '1' : '0';
            let xmlMangaSection = '';
            xmlMangaSection += formatXMLTag('manga_mangadb_id', manga.attributes.links?.mal || '', 2);
            xmlMangaSection += formatXMLTag('manga_title', `<![CDATA[${manga.preferredTitle || ''}]]>`, 2);
            xmlMangaSection += formatXMLTag('manga_volumes', mangaVolumes || '0', 2);
            xmlMangaSection += formatXMLTag('manga_chapters', mangaChapters || '0', 2);
            xmlMangaSection += formatXMLTag('my_id', '', 2);
            xmlMangaSection += formatXMLTag('my_read_volumes', myReadVolumes || '0', 2);
            xmlMangaSection += formatXMLTag('my_read_chapters', myReadChapters || '0', 2);
            xmlMangaSection += formatXMLTag('my_start_date', '0000-00-00', 2);
            xmlMangaSection += formatXMLTag('my_finish_date', '0000-00-00', 2);
            xmlMangaSection += formatXMLTag('my_scanalation_group', `<![CDATA[${myScanalationGroup || ''}]]>`, 2);
            xmlMangaSection += formatXMLTag('my_score', myScore || '0', 2);
            xmlMangaSection += formatXMLTag('my_storage', '', 2);
            xmlMangaSection += formatXMLTag('my_retail_volumes', '0', 2);
            xmlMangaSection += formatXMLTag('my_status', myStatus || malStatuses.reading, 2);
            xmlMangaSection += formatXMLTag('my_comments', '<![CDATA[]]>', 2);
            xmlMangaSection += formatXMLTag('my_times_read', myTimesRead, 2);
            xmlMangaSection += formatXMLTag('my_tags', '<![CDATA[]]>', 2);
            xmlMangaSection += formatXMLTag('my_reread_value', '', 2);
            xmlMangaSection += formatXMLTag('update_on_import', updateOnImport, 2);
            xmlMyAnimeListSection += formatXMLTag('manga', '\n' + xmlMangaSection + '\t', 1);
          });
          xmlContent += formatXMLTag('myanimelist', '\n' + xmlMyAnimeListSection, 0);
          await saveFile(new Blob([xmlContent.trim()], {
            type: 'application/xml'
          }), `${filename}.xml`);
          if (excludedMangaIds.length > 0) await alertModal(`You have enabled the "${allIncludeDataOptions.excludeNoMal}" option!\n` + 'The following titles were excluded because they lack a MyAnimeList ID:\n\n' + excludedMangaIds.map(id => `https://${window.location.host}/title/${id}`).join('\n'), 'warning');
          break;
        }
      case exportFormatOptions.csv:
        {
          const csvData = [Object.values(csvDataColumns).filter(d => dataToInclude.includes(d))];
          csvData.push(...mergedData.map(manga => [[allIncludeDataOptions.title, manga.preferredTitle], [allIncludeDataOptions.originalTitle, manga.originalTitle], [allIncludeDataOptions.originalLanguage, langDisplayName().of(manga.attributes.originalLanguage) || manga.attributes.originalLanguage], [allIncludeDataOptions.author, manga.allAuthorNames], [allIncludeDataOptions.year, manga.attributes.year], [allIncludeDataOptions.publication, capitalizeFirstLetter(manga.attributes.status)], [allIncludeDataOptions.contentRating, capitalizeFirstLetter(manga.attributes.contentRating)], [allIncludeDataOptions.demographic, manga.attributes.publicationDemographic ? capitalizeFirstLetter(manga.attributes.publicationDemographic) : ''], [allIncludeDataOptions.tags, manga.allTags], [allIncludeDataOptions.description, manga.preferredDescription], [allIncludeDataOptions.mangaId, manga.id], [allIncludeDataOptions.mangaThread, manga.mangaThreadId], [allIncludeDataOptions.myRating, manga.myRating], [allIncludeDataOptions.readingStatus, listId$1 ? manga.listName : manga.readingStatus ? capitalizeFirstLetter(manga.readingStatus).replaceAll('_', ' ') : ''], [allIncludeDataOptions.isOneshot, manga.isOneshot], [allIncludeDataOptions.lastVolume, manga.lastVolume], [allIncludeDataOptions.lastChapter, manga.lastChapter], [allIncludeDataOptions.readVolume, manga.latestReadVolume], [allIncludeDataOptions.readChapter, manga.latestReadChapter], [allIncludeDataOptions.readChapterScans, manga.latestReadChapterScans], [allIncludeDataOptions.readChapterId, manga.latestReadChapterId], [allIncludeDataOptions.readChapterThread, manga.latestReadChapterThreadId], [allIncludeDataOptions.anilist, linkIdToURL('al', manga.attributes.links?.al)], [allIncludeDataOptions.animePlanet, linkIdToURL('ap', manga.attributes.links?.ap)], [allIncludeDataOptions.kitsu, linkIdToURL('kt', manga.attributes.links?.kt)], [allIncludeDataOptions.mangaUpdates, linkIdToURL('mu', manga.attributes.links?.mu)], [allIncludeDataOptions.myAnimeList, linkIdToURL('mal', manga.attributes.links?.mal)], [allIncludeDataOptions.novelUpdates, linkIdToURL('nu', manga.attributes.links?.nu)], [allIncludeDataOptions.bookWalker, linkIdToURL('bw', manga.attributes.links?.bw)], [allIncludeDataOptions.amazon, linkIdToURL('amz', manga.attributes.links?.amz)], [allIncludeDataOptions.ebookJapan, linkIdToURL('ebj', manga.attributes.links?.ebj)], [allIncludeDataOptions.cdJapan, linkIdToURL('cdj', manga.attributes.links?.cdj)], [allIncludeDataOptions.officialRaw, manga.attributes.links?.raw], [allIncludeDataOptions.officialEnglish, manga.attributes.links?.engtl]].flatMap(d => {
            if (dataToInclude.includes(d[0])) return d[1] ? d[1].toString() : '';
          }).filter(d => d !== undefined)));
          const csv = formatCSV(csvData);
          await saveFile(new Blob([csv], {
            type: 'text/csv'
          }), `${filename}.csv`);
          break;
        }
      case exportFormatOptions.json:
        {
          await saveFile(new Blob([JSON.stringify(mergedData, null, 2)], {
            type: 'application/json'
          }), `${filename}.json`);
          break;
        }
    }
    if (errors.length > 0) return alertModal('Failed to fetch some data:\n\n' + errors.join('\n'), 'warning');
  };
}

const asinRegex = '(?:[/dp]|$)([A-Z0-9]{10})';
class AmazonDownloadCovers extends AmazonBookmarklet {
  m_routes = [`.*${asinRegex}`];
  m_main = () => {
    const getAsin = url => getMatch(url, new RegExp(asinRegex), 1);
    const getCoverUrl = asin => `${window.location.origin}/images/P/${asin}.01.MAIN._SCRM_.jpg`;
    const books = (element = document) => element.querySelectorAll('a.itemImageLink');
    let downloader;
    const covers = [];
    const locationAsin = getAsin(window.location.pathname);
    const followButtons = document.querySelectorAll('#follow-button');
    const followButtonAsins = [];
    let followButtonAsin;
    followButtons.forEach(button => {
      const asin = button.parentElement?.getAttribute('data-asin');
      if (asin) followButtonAsins.push(asin);
    });
    if (followButtonAsins.length > 0) {
      followButtonAsin = followButtonAsins[0];
    }
    const dataAsin = followButtonAsin || locationAsin;
    if (!dataAsin) {
      const error = new Error('Asin not found!');
      console.error(error);
      alertModal(error, 'error').catch(console.error);
      return;
    }
    if (books().length > 0) {
      const pageSize = 100;
      const itemsElement = document.querySelector('#seriesAsinListPagination, #seriesAsinListPagination_volume');
      const maxItems = parseInt(itemsElement?.getAttribute('data-number_of_items') || books().length.toString());
      const maxPage = Math.ceil(maxItems / pageSize);
      downloader = new CoverDownloader(async loadIndex => {
        let seriesPage = await fetch(`https://${window.location.host}/kindle-dbs/productPage/ajax/seriesAsinList?asin=${dataAsin}&pageNumber=${loadIndex}&pageSize=${pageSize}`, {
          headers: {
            'User-Agent': userAgentDesktop
          }
        }).then(response => response.text()).then(html => new DOMParser().parseFromString(html, 'text/html')).catch(console.error);
        if (!seriesPage || books(seriesPage).length < 1) {
          if (loadIndex !== 1) throw new Error('Failed to fetch series page!');
          seriesPage = document;
        }
        books(seriesPage).forEach(element => {
          const asin = getAsin(element.href);
          if (!asin) return;
          covers.push({
            url: getCoverUrl(asin),
            title: element.getAttribute('title')
          });
        });
        return covers;
      }, {
        loadMax: maxPage,
        title: document.querySelector('#collection-title, #collection-masthead__title, #title-sdp-aw')?.textContent
      });
    } else {
      const bookTitle = document.querySelector('#productTitle, #ebooksTitle, #title')?.textContent?.split('     ')[0];
      downloader = new CoverDownloader(async () => {
        covers.push({
          url: getCoverUrl(dataAsin),
          title: bookTitle
        });
        return covers;
      }, {
        title: (document.querySelector('#seriesBulletWidget_feature_div > .a-link-normal') || document.querySelector('#mobile_productTitleGroup_inner_feature_div > .a-row > .a-row > .a-link-normal'))?.textContent?.replace(/.*: /, '')
      });
    }
    downloader.m_add();
  };
}

class BookwalkerDownloadCovers extends BookwalkerBookmarklet {
  m_routes = ['/de:uuid', '/series/:numid', '/:numid/:numid/viewer.html'];
  m_main = () => {
    const getSeriesId = link => getMatch(link, /series\/(\d+)/, 1);
    const getBookId = link => getMatch(link, /(?:de|cid=)([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/, 1);
    const getLastPage = elements => {
      let lastPage = 1;
      elements.forEach(element => {
        const url = element.getAttribute('href') || element.getAttribute('value');
        if (!url) return;
        const page = getMatch(url, /page=(\d+)/, 1);
        if (!page) return;
        const pageNum = parseInt(page);
        if (lastPage < pageNum) lastPage = pageNum;
      });
      return lastPage;
    };
    const cdnBaseUrl = `${ROLER_CDN_URL.origin}/bw`;
    const getCdnBookUrl = bookId => `${cdnBaseUrl}/${bookId}?crop=false`;
    let downloader;
    const covers = [];
    if (window.location.hostname === BOOKWALKER_VIEWER_TRIAL_URL.hostname) {
      const bookId = getBookId(window.location.search);
      downloader = new CoverDownloader(async () => {
        const pagesJson = await fetch(`${cdnBaseUrl}/pages?ids[]=${bookId}`).then(response => response.json());
        const pages = pagesJson.data[0].pages;
        pages.forEach((page, i) => {
          covers.push({
            url: page.url,
            title: i.toString()
          });
        });
        return covers;
      }, {
        fileNamePrefix: 'Page',
        title: document.querySelector('title')?.textContent,
        disableCropping: true
      });
    } else if (getBookId(window.location.pathname)) {
      const bookId = getBookId(window.location.pathname);
      const bookTitle = document.querySelector('.detail-book-title')?.textContent || document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      downloader = new CoverDownloader(async () => {
        if (bookId) covers.push({
          url: getCdnBookUrl(bookId),
          title: bookTitle
        });
        return covers;
      }, {
        title: document.querySelector(`a[href^="${window.location.origin}/series/"]`)?.textContent
      });
    } else if (/series\/\d+/.test(window.location.pathname)) {
      const seriesId = getSeriesId(window.location.pathname);
      const lastPage = (element = document) => getLastPage(element.querySelectorAll('a[href*="page="], option[value*="page="]'));
      const seriesTitle = document.querySelector('.o-contents-section__title, .o-headline-ttl')?.textContent;
      const wayomiSeriesTitle = document.querySelector('.o-ttsk-card__title')?.textContent;
      const globalSeriesTitle = document.querySelector('.title-main-inner')?.textContent?.split('\n').find(title => title) || document.querySelector('.title-main')?.textContent;
      downloader = new CoverDownloader(async loadIndex => {
        let seriesPage = document;
        if (wayomiSeriesTitle) {
          seriesPage.querySelectorAll('.o-ttsk-list-item > a').forEach(element => {
            const bookId = element.getAttribute('data-book-uuid');
            if (!bookId) return;
            covers.push({
              url: getCdnBookUrl(bookId),
              title: element.getAttribute('data-book-title')
            });
          });
          return covers;
        }
        if (downloader.m_loadMax > 1 || !/\/list/.test(window.location.pathname)) {
          seriesPage = await fetch(`https://${window.location.host}/series/${seriesId}/list/?order=title&page=${loadIndex}`, {
            headers: {
              'User-Agent': userAgentDesktop
            }
          }).then(response => response.text()).then(html => new DOMParser().parseFromString(html, 'text/html'));
        }
        if (!/\/list/.test(window.location.pathname) && loadIndex === 1) downloader.m_loadMax = lastPage(seriesPage);
        seriesPage.querySelectorAll('a.m-thumb__image > img, a.a-thumb-img > img, a.a-tile-thumb-img > img').forEach(element => {
          const bookId = getBookId(element.parentElement.href);
          if (!bookId) return;
          covers.push({
            url: getCdnBookUrl(bookId),
            title: element.alt
          });
        });
        return covers;
      }, {
        loadMax: wayomiSeriesTitle ? 1 : lastPage(),
        title: wayomiSeriesTitle || seriesTitle || globalSeriesTitle,
        fileNamePrefix: wayomiSeriesTitle ? 'Chapter' : 'Volume'
      });
    }
    try {
      downloader.m_add();
    } catch (error) {
      console.error(error);
      alertModal('Failed to initialize cover downloader!\n' + error, 'error').catch(console.error);
    }
  };
}

class BookliveDownloadCovers extends BookliveBookmarklet {
  m_routes = ['/product/index/title_id/:numid/vol_no/:numid'];
  m_main = () => {
    const getTitleId = link => getMatch(link, /title_id\/(\d+)/, 1);
    const getVolumeId = link => getMatch(link, /vol_no\/(\d+)/, 1);
    const downloader = new CoverDownloader(async () => {
      const covers = [];
      const titleId = getTitleId(window.location.pathname);
      document.querySelectorAll(`a[href^="/product/index/title_id/${titleId}/vol_no/"] > img`).forEach(element => {
        const volumeId = getVolumeId(element.parentElement.href);
        if (!volumeId) return;
        const cover = {
          title: element.alt,
          url: `${BOOKLIVE_CDN_URL.origin}/${titleId}/${volumeId}/thumbnail/X.jpg`
        };
        if (covers.some(c => c.url === cover.url)) return;
        covers.push(cover);
      });
      if (!covers.length) {
        const volumeId = getVolumeId(window.location.pathname);
        covers.push({
          title: document.querySelector('#product_display_1')?.textContent,
          url: `${BOOKLIVE_CDN_URL.origin}/${titleId}/${volumeId}/thumbnail/X.jpg`
        });
      }
      return covers;
    }, {
      title: document.querySelector('.heading_title')?.textContent
    });
    downloader.m_add();
  };
}

class KodanshaDownloadCovers extends KodanshaBookmarklet {
  m_routes = ['(/[a-z]+)?/(series|titles|product|products)/[a-z0-9-]+'];
  m_main = async () => {
    const seriesId = getMatch(window.location.pathname, /\/(?:titles|series)\/([a-z0-9-]+)/i, 1);
    const productId = getMatch(window.location.pathname, /\/(?:products|product)\/([a-z0-9-]+)/i, 1);
    if (!seriesId && !productId) {
      await alertModal('Failed to get series ID!', 'error');
      return;
    }
    let downloader;
    if (window.location.hostname === KODANSHA_JAPAN_URL.hostname) {
      if (productId) {
        downloader = new CoverDownloader(async () => {
          const covers = [];
          const coverElement = document.querySelector(`img[src*="/${productId}/"]`);
          if (!coverElement) throw new Error('Failed to find cover element!');
          covers.push({
            url: coverElement.src,
            title: coverElement.alt
          });
          return covers;
        }, {
          title: document.querySelector('#app-main-breadcrumb a[href*="/titles/"]')?.textContent
        });
      } else {
        const fetchSeriesProducts = async (count = 0) => {
          const seriesResponse = await fetch(`${KODANSHA_JAPAN_URL.origin}/titles/${seriesId}/api?count=${count}`).catch(console.error);
          const seriesData = await seriesResponse?.json();
          return seriesData?.products;
        };
        const seriesDataProducts = await fetchSeriesProducts(0);
        if (!seriesDataProducts) {
          await alertModal('Failed to fetch series data!', 'error');
          return;
        }
        downloader = new CoverDownloader(async loadIndex => {
          const covers = [];
          let seriesDataProductsOnCount;
          if (loadIndex === 1) seriesDataProductsOnCount = seriesDataProducts;else seriesDataProductsOnCount = await fetchSeriesProducts(loadIndex - 1);
          if (!seriesDataProductsOnCount) return covers;
          seriesDataProductsOnCount.forEach((product, i) => {
            if (!product.imageUrl) return;
            covers.push({
              url: product.imageUrl,
              title: product.name || i.toString()
            });
          });
          if (seriesDataProductsOnCount.length > 18) downloader.m_loadMax++;
          return covers;
        }, {
          title: document.querySelector('#app-main-breadcrumb strong')?.textContent,
          loadMax: seriesDataProducts.length > 18 ? 1 : 0,
          reverseCoverOrder: true
        });
      }
    } else if (window.location.hostname === KODANSHA_US_URL.hostname) {
      if (productId) {
        const productResponse = await fetch(`${KODANSHA_US_API_URL.origin}/product/${productId}?api-version=1.4`).catch(console.error);
        const productData = await productResponse?.json();
        const productDataThumbnailUrl = productData?.response?.thumbnails?.[0]?.url;
        if (!productDataThumbnailUrl) {
          await alertModal('Failed to fetch product data!', 'error');
          return;
        }
        downloader = new CoverDownloader(async () => [{
          url: productDataThumbnailUrl,
          title: productData?.response?.relativeName
        }], {
          title: productData?.response?.series?.title || document.querySelector('.product-title')?.textContent
        });
      } else {
        const seriesResponse = await fetch(`${KODANSHA_US_API_URL.origin}/series/V2/${seriesId}?api-version=1.4`).catch(console.error);
        const seriesData = await seriesResponse?.json();
        const seriesDataId = seriesData?.response?.id;
        if (!seriesDataId) {
          await alertModal('Failed to fetch series data!', 'error');
          return;
        }
        downloader = new CoverDownloader(async () => {
          const covers = [];
          const productListResponse = await fetch(`${KODANSHA_US_API_URL.origin}/product/forSeries/${seriesDataId}?api-version=1.4`);
          const productListData = await productListResponse.json();
          productListData.forEach((product, i) => covers.push({
            url: product.thumbnails[0].url,
            title: product.relativeName || i.toString()
          }));
          return covers;
        }, {
          title: seriesData?.response?.title || document.querySelector('.series-desktop-header-info-title')?.textContent
        });
      }
    }
    if (downloader) downloader.m_add();else await alertModal('Failed to initialize the cover downloader!', 'error');
  };
}

class MangaplusBookmarklet extends Bookmarklet {
  m_website = `^${MANGAPLUS_URL.hostname}`;
}

class MangaplusExportTitle extends MangaplusBookmarklet {
  m_routes = ['/titles/:numid'];
  m_main = async () => {
    const languageMap = {
      ENGLISH: 'en',
      SPANISH: 'es',
      FRENCH: 'fr',
      INDONESIAN: 'id',
      PORTUGUESE_BR: 'pt-br',
      RUSSIAN: 'ru',
      THAI: 'th',
      GERMAN: 'de',
      VIETNAMESE: 'vi'
    };
    const titleId = getMatch(window.location.pathname, new RegExp(formatRegexText('/titles/(:numid)')), 1);
    if (!titleId) {
      await alertModal('Title ID not found!', 'error');
      return;
    }
    const apiResponse = await fetch(`${MANGAPLUS_API_URL.href}/title_detailV3?format=json&title_id=${titleId}`);
    if (!apiResponse.ok) {
      await alertModal(`Failed to fetch title data!\nStatus: ${apiResponse.status}`, 'error');
      return;
    }
    const titleData = await apiResponse.json();
    if (!titleData.success) {
      await alertModal(`Failed to fetch title data!\n${titleData.error ? titleData.error.englishPopup.subject + '\n' + titleData.error.englishPopup.body : 'Unknown error'}`, 'error');
      return;
    }
    const titleLanguage = titleData.success.titleDetailView.titleLanguages.map(titleLanguage => {
      if (titleLanguage.titleId.toString() !== titleId) return;
      if (!titleLanguage.language) return;
      return languageMap[titleLanguage.language];
    }).find(lang => lang) || 'en';
    ExportTitle({
      title: {
        [titleLanguage]: titleData.success.titleDetailView.title.name
      },
      description: {
        [titleLanguage]: titleData.success.titleDetailView.overview
      },
      authors: titleData.success.titleDetailView.title.author.split(/ [/×] /),
      tags: titleData.success.titleDetailView.tags.map(tag => tag.tag),
      engtlLink: titleLanguage === 'en' ? window.location.href : undefined,
      links: titleLanguage !== 'en' ? [window.location.href] : undefined,
      covers: [{
        url: titleData.success.titleDetailView.title.portraitImageUrl,
        description: 'Cover from MangaPlus'
      }]
    });
  };
}

class MangaplusCreatorsBookmarklet extends Bookmarklet {
  m_website = `^${MANGAPLUS_CREATORS_URL.hostname}`;
}

class MangaplusCreatorsExportTitle extends MangaplusCreatorsBookmarklet {
  m_routes = ['/titles/[a-z0-9]+'];
  m_main = () => {
    const langugageElement = document.querySelector('.book-locale');
    const language = langugageElement?.textContent.toLowerCase().trim() || 'en';
    const titleElement = document.querySelector('.title');
    const title = titleElement?.textContent.trim();
    const descriptionElement = document.querySelector('.summary');
    const description = descriptionElement?.textContent.trim();
    const tagElements = Array.from(document.querySelectorAll('.book-submit-type, .tag-genre'));
    const tags = tagElements.map(element => element.textContent.trim());
    const authorElements = Array.from(document.querySelectorAll('.mod-btn-profile .name'));
    const authors = authorElements.map(element => element.textContent.trim());
    const publicationDateElement = document.querySelector('.item-update > dd');
    const publicationDate = publicationDateElement?.textContent.trim();
    const year = publicationDate ? new Date(publicationDate).getFullYear() : undefined;
    const coverElement = document.querySelector('.cover > img');
    const coverUrl = coverElement?.getAttribute('data-src');
    ExportTitle({
      title: title ? {
        [language]: title
      } : undefined,
      description: description ? {
        [language]: description
      } : undefined,
      authors,
      tags,
      year,
      originalLanguage: language,
      rawLink: window.location.href,
      covers: coverUrl ? [{
        url: coverUrl,
        locale: language,
        description: 'Cover from MangaPlus Creators'
      }] : undefined
    });
  };
}

class ShonenjumpplusBookmarklet extends Bookmarklet {
  m_website = `^${SHONENJUMPPLUS_URL.hostname}`;
}

class ShonenjumpplusExportTitle extends ShonenjumpplusBookmarklet {
  m_routes = ['/episode/:numid'];
  m_main = async () => {
    const seriesDataString = document.documentElement.getAttribute('data-gtm-data-layer');
    let seriesData;
    if (seriesDataString) {
      try {
        seriesData = JSON.parse(seriesDataString);
      } catch (e) {
        console.error(e);
      }
    }
    const coverElement = document.querySelector('meta[property="og:image"]');
    const coverUrl = coverElement?.getAttribute('content');
    const titleElement = document.querySelector('.series-header-title');
    const title = seriesData?.episode?.series_title || titleElement?.textContent.trim() || undefined;
    const status = seriesData?.episode?.series_ongoing === 1 ? 'ongoing' : 'completed';
    const authorElement = document.querySelector('.series-header-author');
    const authors = authorElement?.textContent.trim().split('/') || undefined;
    const descriptionElement = document.querySelector('meta[property="og:description"]');
    const description = descriptionElement?.getAttribute('content');
    let firstEpisodeId;
    let year;
    if (seriesData?.episode?.series_id) {
      const episodesResponse = await fetch(`${SHONENJUMPPLUS_URL.origin}/api/viewer/pagination_readable_products?type=episode&aggregate_id=${seriesData?.episode?.series_id}&offset=0&limit=50&sort_order=asc&is_guest=1`).catch(console.error);
      if (episodesResponse?.ok) {
        const episodesData = await episodesResponse.json();
        const firstEpisode = episodesData[0];
        if (firstEpisode.readable_product_id) firstEpisodeId = firstEpisode.readable_product_id;
        if (firstEpisode?.display_open_at) year = new Date(firstEpisode.display_open_at).getFullYear();
      }
    }
    ExportTitle({
      title: title ? {
        ja: title
      } : undefined,
      authors,
      year,
      status,
      description: description ? {
        ja: description
      } : undefined,
      originalLanguage: 'ja',
      rawLink: firstEpisodeId ? `${SHONENJUMPPLUS_URL.origin}/episode/${firstEpisodeId}` : window.location.href,
      publicationDemographic: 'shounen',
      covers: coverUrl ? [{
        url: coverUrl,
        locale: 'ja',
        description: 'Cover from Shonen Jump+'
      }] : undefined
    });
  };
}

enableUserScriptFeatures();const settings = [];const universalSettings = new UniversalSettings();if (universalSettings.m_isWebsite()) {GM_registerMenuCommand('[Any Website] Settings Manager v1.8', () =>universalSettings.m_execute());settings.push({id: 'universal-settings_key_shortcut',type: 'keys',name: 'Keyboard Shortcut for Settings Manager',description: 'Keys to press to execute the Settings Manager bookmarklet.',defaultValue: ['ControlLeft', 'ShiftLeft', 'AltLeft', 'KeyS']});}const mangadexExportTitleList = new MangadexExportTitleList();if (mangadexExportTitleList.m_isWebsite()) {GM_registerMenuCommand('[MangaDex] Export Title List v2.0', () =>mangadexExportTitleList.m_execute());settings.push({id: 'mangadex-export_title_list_key_shortcut',type: 'keys',name: 'Keyboard Shortcut for Export Title List',description: 'Keys to press to execute the Export Title List bookmarklet.',defaultValue: []});}const amazonDownloadCovers = new AmazonDownloadCovers();if (amazonDownloadCovers.m_isWebsite()) {GM_registerMenuCommand('[Amazon] Download Covers v4.1', () =>amazonDownloadCovers.m_execute());settings.push({id: 'amazon-download_covers_key_shortcut',type: 'keys',name: 'Keyboard Shortcut for Download Covers',description: 'Keys to press to execute the Download Covers bookmarklet.',defaultValue: []});}const bookwalkerDownloadCovers = new BookwalkerDownloadCovers();if (bookwalkerDownloadCovers.m_isWebsite()) {GM_registerMenuCommand('[BookWalker] Download Covers v3.2', () =>bookwalkerDownloadCovers.m_execute());settings.push({id: 'bookwalker-download_covers_key_shortcut',type: 'keys',name: 'Keyboard Shortcut for Download Covers',description: 'Keys to press to execute the Download Covers bookmarklet.',defaultValue: []});}const bookliveDownloadCovers = new BookliveDownloadCovers();if (bookliveDownloadCovers.m_isWebsite()) {GM_registerMenuCommand('[BookLive] Download Covers v2.5', () =>bookliveDownloadCovers.m_execute());settings.push({id: 'booklive-download_covers_key_shortcut',type: 'keys',name: 'Keyboard Shortcut for Download Covers',description: 'Keys to press to execute the Download Covers bookmarklet.',defaultValue: []});}const kodanshaDownloadCovers = new KodanshaDownloadCovers();if (kodanshaDownloadCovers.m_isWebsite()) {GM_registerMenuCommand('[Kodansha] Download Covers v1.2', () =>kodanshaDownloadCovers.m_execute());settings.push({id: 'kodansha-download_covers_key_shortcut',type: 'keys',name: 'Keyboard Shortcut for Download Covers',description: 'Keys to press to execute the Download Covers bookmarklet.',defaultValue: []});}const mangaplusExportTitle = new MangaplusExportTitle();if (mangaplusExportTitle.m_isWebsite()) {GM_registerMenuCommand('[MangaPlus] Export Title v1.1', () =>mangaplusExportTitle.m_execute());settings.push({id: 'mangaplus-export_title_key_shortcut',type: 'keys',name: 'Keyboard Shortcut for Export Title',description: 'Keys to press to execute the Export Title bookmarklet.',defaultValue: []});}const mangaplus_creatorsExportTitle = new MangaplusCreatorsExportTitle();if (mangaplus_creatorsExportTitle.m_isWebsite()) {GM_registerMenuCommand('[MangaPlus Creators] Export Title v1.1', () =>mangaplus_creatorsExportTitle.m_execute());settings.push({id: 'mangaplus_creators-export_title_key_shortcut',type: 'keys',name: 'Keyboard Shortcut for Export Title',description: 'Keys to press to execute the Export Title bookmarklet.',defaultValue: []});}const shonenjumpplusExportTitle = new ShonenjumpplusExportTitle();if (shonenjumpplusExportTitle.m_isWebsite()) {GM_registerMenuCommand('[Shonen Jump+] Export Title v1.1', () =>shonenjumpplusExportTitle.m_execute());settings.push({id: 'shonenjumpplus-export_title_key_shortcut',type: 'keys',name: 'Keyboard Shortcut for Export Title',description: 'Keys to press to execute the Export Title bookmarklet.',defaultValue: []});}const settingsField = new SettingsField({id: '1ed69755-08c1-4d22-8a7d-6c4377102cc7',name: 'UserScript',description: 'Settings only available when using the UserScript (reload the page to apply changes).',settings});universalSettings.m_additionalFields.push(settingsField);settingsField.m_load();const universalSettingsKeyShortcut = settingsField.m_getValue('universal-settings_key_shortcut');if (universalSettingsKeyShortcut && universalSettingsKeyShortcut.length > 0) {addKeyShortcutListener(universalSettingsKeyShortcut, () => universalSettings.m_execute());}const mangadexExportTitleListKeyShortcut = settingsField.m_getValue('mangadex-export_title_list_key_shortcut');if (mangadexExportTitleListKeyShortcut && mangadexExportTitleListKeyShortcut.length > 0) {addKeyShortcutListener(mangadexExportTitleListKeyShortcut, () => mangadexExportTitleList.m_execute());}const amazonDownloadCoversKeyShortcut = settingsField.m_getValue('amazon-download_covers_key_shortcut');if (amazonDownloadCoversKeyShortcut && amazonDownloadCoversKeyShortcut.length > 0) {addKeyShortcutListener(amazonDownloadCoversKeyShortcut, () => amazonDownloadCovers.m_execute());}const bookwalkerDownloadCoversKeyShortcut = settingsField.m_getValue('bookwalker-download_covers_key_shortcut');if (bookwalkerDownloadCoversKeyShortcut && bookwalkerDownloadCoversKeyShortcut.length > 0) {addKeyShortcutListener(bookwalkerDownloadCoversKeyShortcut, () => bookwalkerDownloadCovers.m_execute());}const bookliveDownloadCoversKeyShortcut = settingsField.m_getValue('booklive-download_covers_key_shortcut');if (bookliveDownloadCoversKeyShortcut && bookliveDownloadCoversKeyShortcut.length > 0) {addKeyShortcutListener(bookliveDownloadCoversKeyShortcut, () => bookliveDownloadCovers.m_execute());}const kodanshaDownloadCoversKeyShortcut = settingsField.m_getValue('kodansha-download_covers_key_shortcut');if (kodanshaDownloadCoversKeyShortcut && kodanshaDownloadCoversKeyShortcut.length > 0) {addKeyShortcutListener(kodanshaDownloadCoversKeyShortcut, () => kodanshaDownloadCovers.m_execute());}const mangaplusExportTitleKeyShortcut = settingsField.m_getValue('mangaplus-export_title_key_shortcut');if (mangaplusExportTitleKeyShortcut && mangaplusExportTitleKeyShortcut.length > 0) {addKeyShortcutListener(mangaplusExportTitleKeyShortcut, () => mangaplusExportTitle.m_execute());}const mangaplus_creatorsExportTitleKeyShortcut = settingsField.m_getValue('mangaplus_creators-export_title_key_shortcut');if (mangaplus_creatorsExportTitleKeyShortcut && mangaplus_creatorsExportTitleKeyShortcut.length > 0) {addKeyShortcutListener(mangaplus_creatorsExportTitleKeyShortcut, () => mangaplus_creatorsExportTitle.m_execute());}const shonenjumpplusExportTitleKeyShortcut = settingsField.m_getValue('shonenjumpplus-export_title_key_shortcut');if (shonenjumpplusExportTitleKeyShortcut && shonenjumpplusExportTitleKeyShortcut.length > 0) {addKeyShortcutListener(shonenjumpplusExportTitleKeyShortcut, () => shonenjumpplusExportTitle.m_execute());}
})();
