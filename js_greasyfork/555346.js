// ==UserScript==
// @name         GitHub Avatar to Identicon Switcher
// @namespace    http://tampermonkey.net/
// @version      2025-11-09
// @description  Replace GitHub avatars with identicons - toggle in Tampermonkey menu
// @author       TheMX/TheXM
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABEgsN2AAAABlBMVEXw8PCgjuCi1ezxAAAAeElEQVR4Ae3LoRWAMBBEwaAog1JDqSkDRTAJ7hy8nJgv9+0USZL0e7VHNYqiKIqiKIqiKIpKpSRJkiRJSt7RR+cYtjlc4YWiKIqiKIqiKIqiVqi32qNaiaMoiqIoiqIoiqKodeqew05RFEVRFEVRFEVROZUkSfqmBwlwQYdil+rrAAAAAElFTkSuQmCC
// @match        https://github.com/*
// @match        https://*.github.com/*
// @match        https://avatars.githubusercontent.com/*
// @match        https://*.githubusercontent.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @antifeature  none
// @downloadURL https://update.greasyfork.org/scripts/555346/GitHub%20Avatar%20to%20Identicon%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/555346/GitHub%20Avatar%20to%20Identicon%20Switcher.meta.js
// ==/UserScript==

// Credits to Joseph K. Myers for https://www.myersdaily.org/joseph/javascript/md5-text.html
function md5cycle(x, k) {
  var a = x[0],
    b = x[1],
    c = x[2],
    d = x[3];

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}

function cmn(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | (~b & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}

function md51(s) {
  txt = "";
  var n = s.length,
    state = [1732584193, -271733879, -1732584194, 271733878],
    i;
  for (i = 64; i <= s.length; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 0; i < s.length; i++) {
    tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
  }
  tail[i >> 2] |= 0x80 << (i % 4 << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}

function md5blk(s) {
  var md5blks = [],
    i;
  for (i = 0; i < 64; i += 4) {
    md5blks[i >> 2] =
      s.charCodeAt(i) +
      (s.charCodeAt(i + 1) << 8) +
      (s.charCodeAt(i + 2) << 16) +
      (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

var hex_chr = "0123456789abcdef".split("");

function rhex(n) {
  var s = "",
    j = 0;
  for (; j < 4; j++) {
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
  }
  return s;
}

function hex(x) {
  for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
  return x.join("");
}

function md5(s) {
  return hex(md51(s));
}

function add32(a, b) {
  return (a + b) & 0xffffffff;
}

if (md5("hello") != "5d41402abc4b2a76b9719d911017c592") {
  function add32(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff),
      msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
}

// Credits to David Graham for https://github.com/dgraham/identicon that I ported to C++ and now to JavaScript
(function () {
  "use strict";

  const CONFIG = {
    enabled: GM_getValue("identiconEnabled", false),
    avatarDomains: ["avatars.githubusercontent.com"],
  };

  let menuCommandId;

  function registerMenuCommand() {
    if (menuCommandId) {
      GM_unregisterMenuCommand(menuCommandId);
    }

    menuCommandId = GM_registerMenuCommand(
      CONFIG.enabled ? "🔴 Disable Identicons" : "🟢 Enable Identicons",
      function () {
        CONFIG.enabled = !CONFIG.enabled;
        GM_setValue("identiconEnabled", CONFIG.enabled);
        registerMenuCommand();
        replaceAllAvatars();
      },
      CONFIG.enabled ? "d" : "e"
    );
  }

  function isAvatarUrl(url) {
    return CONFIG.avatarDomains.some((domain) => url.includes(domain));
  }

  function hexToBytes(hex) {
    const out = new Uint8Array(16);
    for (let i = 0; i < 16; ++i) {
      out[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return out;
  }

  function generateIdenticon(identifier, size = 420) {
    if (identifier === "error") return null;

    const GRID_SIZE = 5;
    const SQUARE_SIZE = 70; // 420 / 6 = 70 (5 squares + margins)
    const MARGIN = SQUARE_SIZE / 2; // 35px margin

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const md5hex = md5(identifier);
    const hashBytes = hexToBytes(md5hex);

    const h1 = (hashBytes[12] & 0x0f) << 8;
    const h2 = hashBytes[13];
    const h = h1 | h2;
    const s = hashBytes[14];
    const l = hashBytes[15];

    const mapRange = (value, vmin, vmax, dmin, dmax) => {
      return ((value - vmin) * (dmax - dmin)) / (vmax - vmin) + dmin;
    };

    const hue = mapRange(h, 0, 4095, 0, 360);
    const sat = mapRange(s, 0, 255, 0, 20);
    const lum = mapRange(l, 0, 255, 0, 20);

    const finalHue = hue;
    const finalSat = 65.0 - sat;
    const finalLum = 75.0 - lum;

    const hNorm = finalHue / 360.0;
    const sNorm = finalSat / 100.0;
    const lNorm = finalLum / 100.0;

    const q = lNorm <= 0.5 ? lNorm * (sNorm + 1.0) : lNorm + sNorm - lNorm * sNorm;
    const p = 2.0 * lNorm - q;

    const hueToRgb = (a, b, h) => {
      if (h < 0.0) h += 1.0;
      else if (h > 1.0) h -= 1.0;

      if (h < 1.0 / 6.0) return a + (b - a) * 6.0 * h;
      if (h < 1.0 / 2.0) return b;
      if (h < 2.0 / 3.0) return a + (b - a) * (2.0 / 3.0 - h) * 6.0;
      return a;
    };

    const r = hueToRgb(p, q, hNorm + 1.0 / 3.0);
    const g = hueToRgb(p, q, hNorm);
    const b = hueToRgb(p, q, hNorm - 1.0 / 3.0);

    const color = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    const bgColor = "rgb(240, 240, 240)";

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = color;

    let byteIndex = 0;
    let hasLow = false;
    let lowNibble = 0;

    const nextNibble = () => {
      if (hasLow) {
        hasLow = false;
        return lowNibble;
      }

      if (byteIndex >= 16) return 0;

      const byte = hashBytes[byteIndex++];
      const high = (byte >> 4) & 0x0f;
      lowNibble = byte & 0x0f;
      hasLow = true;
      return high;
    };

    const grid = new Array(25).fill(false);

    for (let col = 2; col >= 0; --col) {
      for (let row = 0; row < 5; ++row) {
        if (byteIndex >= 16 && !hasLow) break;

        const nibble = nextNibble();
        const paint = nibble % 2 === 0;

        const ix = col + (row * 5);
        const mirrorCol = 4 - col;
        const mirrorIx = mirrorCol + (row * 5);

        grid[ix] = paint;
        grid[mirrorIx] = paint;
      }
    }

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row * GRID_SIZE + col]) {
          const x = col * SQUARE_SIZE + MARGIN;
          const y = row * SQUARE_SIZE + MARGIN;

          ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
        }
      }
    }

    return canvas.toDataURL();
  }

  function getIdentifier(img) {
    const url = img.src || "";
    const userIdMatch = url.match(/\/(\d+)(?:\?|$)/);
    if (userIdMatch) return userIdMatch[1];

    const link = img.closest('a[href*="/"]');
    if (link) {
      const href = link.getAttribute("href");
      const userMatch = href.match(/^\/([^\/]+)/);
      if (userMatch) return userMatch[1];
    }

    const card = img.closest("[data-hovercard-url]");
    if (card) {
      const hovercard = card.getAttribute("data-hovercard-url");
      const userMatch = hovercard.match(/\/users\/([^\/]+)/);
      if (userMatch) return userMatch[1];
    }

    return "error";
  }

  function replaceAllAvatars() {
    const images = document.querySelectorAll("img");
    let replacedCount = 0;

    images.forEach((img) => {
      const src = img.src || "";

      if (CONFIG.enabled) {
        if (!isAvatarUrl(src)) return;

        if (!img.dataset.originalSrc) {
          img.dataset.originalSrc = src;
        }
        const identifier = getIdentifier(img);
        const identicon = generateIdenticon(identifier, 420);
        if (identicon) {
          img.src = identicon;
          replacedCount++;
        }
      } else {
        if (img.dataset.originalSrc) {
          img.src = img.dataset.originalSrc;
          delete img.dataset.originalSrc;
          replacedCount++;
        }
      }
    });

    console.log(
      `Identicons: ${CONFIG.enabled ? "ON" : "OFF"
      }, Processed ${replacedCount} avatars`
    );
  }

  function initObserver() {
    const observer = new MutationObserver(function (mutations) {
      let shouldUpdate = false;
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
              if (node.tagName === "IMG" && isAvatarUrl(node.src || "")) {
                shouldUpdate = true;
                break;
              }
              if (node.querySelector && node.querySelector("img")) {
                const imgs = node.querySelectorAll("img");
                for (const img of imgs) {
                  if (isAvatarUrl(img.src || "")) {
                    shouldUpdate = true;
                    break;
                  }
                }
              }
            }
          }
        }
      }
      if (shouldUpdate) {
        setTimeout(replaceAllAvatars, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function init() {
    registerMenuCommand();
    initObserver();
    replaceAllAvatars();

    let lastUrl = location.href;
    const checkUrlChange = setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(replaceAllAvatars, 500);
      }
    }, 1000);

    window.addEventListener("beforeunload", () => {
      clearInterval(checkUrlChange);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();