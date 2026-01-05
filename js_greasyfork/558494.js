// ==UserScript==
// @name         115+
// @namespace    https://greasyfork.org/users/1546436-zasternight
// @version      1.2.18
// @author       zasternight
// @description  为115网盘添加一些功能，已美化下载按钮为红色
// @license      MIT
// @icon         https://115.com/favicon.ico
// @supportURL   https://github.com/lvzhenbo/115-plus/issues
// @match        https://115.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.25/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/naive-ui@2.43.2/dist/index.prod.js
// @require      https://cdn.jsdelivr.net/npm/xgplayer@3.0.23/dist/index.min.js
// @require      https://cdn.jsdelivr.net/npm/xgplayer-hls.js@3.0.23/dist/index.min.js
// @connect      115.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/558494/115%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/558494/115%2B.meta.js
// ==/UserScript==

(function (vue, naiveUi, Player, HlsJsPlugin) {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  importCSS(" [data-v-83bc69cf] .n-button__content{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px} ");

  const crypto = (typeof globalThis !== "undefined" ? globalThis : void 0)?.crypto || (typeof global !== "undefined" ? global : void 0)?.crypto || (typeof window !== "undefined" ? window : void 0)?.crypto || (typeof self !== "undefined" ? self : void 0)?.crypto || (typeof frames !== "undefined" ? frames : void 0)?.[0]?.crypto;
  let randomWordArray;
  if (crypto) randomWordArray = (nBytes) => {
    const words = [];
    for (let i = 0; i < nBytes; i += 4) words.push(crypto.getRandomValues(new Uint32Array(1))[0]);
    return new WordArray(words, nBytes);
  };
  else randomWordArray = (nBytes) => {
    const words = [];
    const r = (m_w) => {
      let _m_w = m_w;
      let _m_z = 987654321;
      const mask = 4294967295;
      return () => {
        _m_z = 36969 * (_m_z & 65535) + (_m_z >> 16) & mask;
        _m_w = 18e3 * (_m_w & 65535) + (_m_w >> 16) & mask;
        let result = (_m_z << 16) + _m_w & mask;
        result /= 4294967296;
        result += 0.5;
        return result * (Math.random() > 0.5 ? 1 : -1);
      };
    };
    let rcache;
    for (let i = 0; i < nBytes; i += 4) {
      const _r = r((rcache || Math.random()) * 4294967296);
      rcache = _r() * 987654071;
      words.push(_r() * 4294967296 | 0);
    }
    return new WordArray(words, nBytes);
  };
  var Base = class {
static create(...args) {
      return new this(...args);
    }
mixIn(properties) {
      return Object.assign(this, properties);
    }
clone() {
      const clone = new this.constructor();
      Object.assign(clone, this);
      return clone;
    }
  };
  var WordArray = class extends Base {
words;
sigBytes;
constructor(words = [], sigBytes) {
      super();
      if (words instanceof ArrayBuffer) {
        const typedArray = new Uint8Array(words);
        this._initFromUint8Array(typedArray);
        return;
      }
      if (ArrayBuffer.isView(words)) {
        let uint8Array;
        if (words instanceof Uint8Array) uint8Array = words;
        else uint8Array = new Uint8Array(words.buffer, words.byteOffset, words.byteLength);
        this._initFromUint8Array(uint8Array);
        return;
      }
      this.words = words;
      this.sigBytes = sigBytes !== void 0 ? sigBytes : this.words.length * 4;
    }
_initFromUint8Array(typedArray) {
      const typedArrayByteLength = typedArray.byteLength;
      const words = [];
      for (let i = 0; i < typedArrayByteLength; i += 1) words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
      this.words = words;
      this.sigBytes = typedArrayByteLength;
    }
static random = randomWordArray;
toString(encoder = Hex) {
      return encoder.stringify(this);
    }
concat(wordArray) {
      const thisWords = this.words;
      const thatWords = wordArray.words;
      const thisSigBytes = this.sigBytes;
      const thatSigBytes = wordArray.sigBytes;
      this.clamp();
      if (thisSigBytes % 4) for (let i = 0; i < thatSigBytes; i += 1) {
        const thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
      }
      else for (let i = 0; i < thatSigBytes; i += 4) thisWords[thisSigBytes + i >>> 2] = thatWords[i >>> 2];
      this.sigBytes += thatSigBytes;
      return this;
    }
clamp() {
      const { words, sigBytes } = this;
      words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
      words.length = Math.ceil(sigBytes / 4);
    }
clone() {
      const clone = super.clone();
      clone.words = this.words.slice(0);
      return clone;
    }
  };
  const Hex = {
    stringify(wordArray) {
      const { words, sigBytes } = wordArray;
      const hexChars = [];
      for (let i = 0; i < sigBytes; i += 1) {
        const bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        hexChars.push((bite >>> 4).toString(16));
        hexChars.push((bite & 15).toString(16));
      }
      return hexChars.join("");
    },
    parse(hexStr) {
      const hexStrLength = hexStr.length;
      const words = [];
      for (let i = 0; i < hexStrLength; i += 2) words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
      return new WordArray(words, hexStrLength / 2);
    }
  };
  const Latin1 = {
    stringify(wordArray) {
      const { words, sigBytes } = wordArray;
      const latin1Chars = [];
      for (let i = 0; i < sigBytes; i += 1) {
        const bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        latin1Chars.push(String.fromCharCode(bite));
      }
      return latin1Chars.join("");
    },
    parse(latin1Str) {
      const latin1StrLength = latin1Str.length;
      const words = [];
      for (let i = 0; i < latin1StrLength; i += 1) words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
      return new WordArray(words, latin1StrLength);
    }
  };
  const Utf8 = {
    stringify(wordArray) {
      try {
        return decodeURIComponent(escape(Latin1.stringify(wordArray)));
      } catch (e) {
        throw new Error("Malformed UTF-8 data");
      }
    },
    parse(utf8Str) {
      return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
    }
  };
  var BufferedBlockAlgorithm = class extends Base {
_minBufferSize = 0;
_data;
_nDataBytes;
    constructor() {
      super();
    }
reset() {
      this._data = new WordArray();
      this._nDataBytes = 0;
    }
_append(data) {
      let m_data;
      if (typeof data === "string") m_data = Utf8.parse(data);
      else m_data = data;
      this._data.concat(m_data);
      this._nDataBytes += m_data.sigBytes;
    }
_process(doFlush) {
      let processedWords;
      const data = this._data;
      const dataWords = data.words;
      const dataSigBytes = data.sigBytes;
      const blockSizeBytes = this.blockSize * 4;
      let nBlocksReady = dataSigBytes / blockSizeBytes;
      if (doFlush) nBlocksReady = Math.ceil(nBlocksReady);
      else nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
      const nWordsReady = nBlocksReady * this.blockSize;
      const nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
      if (nWordsReady) {
        for (let offset = 0; offset < nWordsReady; offset += this.blockSize) this._doProcessBlock(dataWords, offset);
        processedWords = dataWords.splice(0, nWordsReady);
        data.sigBytes -= nBytesReady;
      }
      return new WordArray(processedWords || [], nBytesReady);
    }
clone() {
      const clone = super.clone();
      clone._data = this._data.clone();
      return clone;
    }
  };
  var Hasher = class extends BufferedBlockAlgorithm {
blockSize = 512 / 32;
cfg;
_hash;
constructor(cfg) {
      super();
      this.cfg = Object.assign({}, cfg);
      this.reset();
    }
static _createHelper(SubHasher) {
      return (message2, cfg) => {
        return new SubHasher(cfg).finalize(message2);
      };
    }
static _createHmacHelper(SubHasher) {
      return (message2, key) => {
        return new HMAC(SubHasher, key).finalize(message2);
      };
    }
reset() {
      super.reset();
      this._doReset();
    }
update(messageUpdate) {
      this._append(messageUpdate);
      this._process();
      return this;
    }
finalize(messageUpdate) {
      if (messageUpdate) this._append(messageUpdate);
      const hash = this._doFinalize();
      return hash;
    }
  };
  var Hasher32 = class extends Hasher {
  };
  var HMAC = class HMAC2 extends Base {
_hasher;
_oKey;
_iKey;
constructor(SubHasher, key) {
      super();
      const hasher = new SubHasher();
      this._hasher = hasher;
      let _key;
      if (typeof key === "string") _key = Utf8.parse(key);
      else _key = key;
      const hasherBlockSize = hasher.blockSize;
      const hasherBlockSizeBytes = hasherBlockSize * 4;
      if (_key.sigBytes > hasherBlockSizeBytes) _key = hasher.finalize(_key);
      _key.clamp();
      const oKey = _key.clone();
      this._oKey = oKey;
      const iKey = _key.clone();
      this._iKey = iKey;
      const oKeyWords = oKey.words;
      const iKeyWords = iKey.words;
      for (let i = 0; i < hasherBlockSize; i += 1) {
        oKeyWords[i] ^= 1549556828;
        iKeyWords[i] ^= 909522486;
      }
      oKey.sigBytes = hasherBlockSizeBytes;
      iKey.sigBytes = hasherBlockSizeBytes;
      this.reset();
    }
    static create(...args) {
      const [SubHasher, key] = args;
      return new HMAC2(SubHasher, key);
    }
reset() {
      const hasher = this._hasher;
      hasher.reset();
      hasher.update(this._iKey);
    }
update(messageUpdate) {
      this._hasher.update(messageUpdate);
      return this;
    }
finalize(messageUpdate) {
      const hasher = this._hasher;
      const innerHash = hasher.finalize(messageUpdate);
      hasher.reset();
      const hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
      return hmac;
    }
  };
  const T = (() => {
    const a = [];
    for (let i = 0; i < 64; i += 1) a[i] = Math.abs(Math.sin(i + 1)) * 4294967296 | 0;
    return a;
  })();
  const FF = (a, b, c, d, x, s, t) => {
    const n = a + (b & c | ~b & d) + x + t;
    return (n << s | n >>> 32 - s) + b;
  };
  const GG = (a, b, c, d, x, s, t) => {
    const n = a + (b & d | c & ~d) + x + t;
    return (n << s | n >>> 32 - s) + b;
  };
  const HH = (a, b, c, d, x, s, t) => {
    const n = a + (b ^ c ^ d) + x + t;
    return (n << s | n >>> 32 - s) + b;
  };
  const II = (a, b, c, d, x, s, t) => {
    const n = a + (c ^ (b | ~d)) + x + t;
    return (n << s | n >>> 32 - s) + b;
  };
  var MD5Algo = class extends Hasher32 {
    _doReset() {
      this._hash = new WordArray([
        1732584193,
        4023233417,
        2562383102,
        271733878
      ]);
    }
    _doProcessBlock(M, offset) {
      const _M = M;
      for (let i = 0; i < 16; i += 1) {
        const offset_i = offset + i;
        const M_offset_i = M[offset_i];
        _M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
      }
      const H = this._hash.words;
      const M_offset_0 = _M[offset + 0];
      const M_offset_1 = _M[offset + 1];
      const M_offset_2 = _M[offset + 2];
      const M_offset_3 = _M[offset + 3];
      const M_offset_4 = _M[offset + 4];
      const M_offset_5 = _M[offset + 5];
      const M_offset_6 = _M[offset + 6];
      const M_offset_7 = _M[offset + 7];
      const M_offset_8 = _M[offset + 8];
      const M_offset_9 = _M[offset + 9];
      const M_offset_10 = _M[offset + 10];
      const M_offset_11 = _M[offset + 11];
      const M_offset_12 = _M[offset + 12];
      const M_offset_13 = _M[offset + 13];
      const M_offset_14 = _M[offset + 14];
      const M_offset_15 = _M[offset + 15];
      let a = H[0];
      let b = H[1];
      let c = H[2];
      let d = H[3];
      a = FF(a, b, c, d, M_offset_0, 7, T[0]);
      d = FF(d, a, b, c, M_offset_1, 12, T[1]);
      c = FF(c, d, a, b, M_offset_2, 17, T[2]);
      b = FF(b, c, d, a, M_offset_3, 22, T[3]);
      a = FF(a, b, c, d, M_offset_4, 7, T[4]);
      d = FF(d, a, b, c, M_offset_5, 12, T[5]);
      c = FF(c, d, a, b, M_offset_6, 17, T[6]);
      b = FF(b, c, d, a, M_offset_7, 22, T[7]);
      a = FF(a, b, c, d, M_offset_8, 7, T[8]);
      d = FF(d, a, b, c, M_offset_9, 12, T[9]);
      c = FF(c, d, a, b, M_offset_10, 17, T[10]);
      b = FF(b, c, d, a, M_offset_11, 22, T[11]);
      a = FF(a, b, c, d, M_offset_12, 7, T[12]);
      d = FF(d, a, b, c, M_offset_13, 12, T[13]);
      c = FF(c, d, a, b, M_offset_14, 17, T[14]);
      b = FF(b, c, d, a, M_offset_15, 22, T[15]);
      a = GG(a, b, c, d, M_offset_1, 5, T[16]);
      d = GG(d, a, b, c, M_offset_6, 9, T[17]);
      c = GG(c, d, a, b, M_offset_11, 14, T[18]);
      b = GG(b, c, d, a, M_offset_0, 20, T[19]);
      a = GG(a, b, c, d, M_offset_5, 5, T[20]);
      d = GG(d, a, b, c, M_offset_10, 9, T[21]);
      c = GG(c, d, a, b, M_offset_15, 14, T[22]);
      b = GG(b, c, d, a, M_offset_4, 20, T[23]);
      a = GG(a, b, c, d, M_offset_9, 5, T[24]);
      d = GG(d, a, b, c, M_offset_14, 9, T[25]);
      c = GG(c, d, a, b, M_offset_3, 14, T[26]);
      b = GG(b, c, d, a, M_offset_8, 20, T[27]);
      a = GG(a, b, c, d, M_offset_13, 5, T[28]);
      d = GG(d, a, b, c, M_offset_2, 9, T[29]);
      c = GG(c, d, a, b, M_offset_7, 14, T[30]);
      b = GG(b, c, d, a, M_offset_12, 20, T[31]);
      a = HH(a, b, c, d, M_offset_5, 4, T[32]);
      d = HH(d, a, b, c, M_offset_8, 11, T[33]);
      c = HH(c, d, a, b, M_offset_11, 16, T[34]);
      b = HH(b, c, d, a, M_offset_14, 23, T[35]);
      a = HH(a, b, c, d, M_offset_1, 4, T[36]);
      d = HH(d, a, b, c, M_offset_4, 11, T[37]);
      c = HH(c, d, a, b, M_offset_7, 16, T[38]);
      b = HH(b, c, d, a, M_offset_10, 23, T[39]);
      a = HH(a, b, c, d, M_offset_13, 4, T[40]);
      d = HH(d, a, b, c, M_offset_0, 11, T[41]);
      c = HH(c, d, a, b, M_offset_3, 16, T[42]);
      b = HH(b, c, d, a, M_offset_6, 23, T[43]);
      a = HH(a, b, c, d, M_offset_9, 4, T[44]);
      d = HH(d, a, b, c, M_offset_12, 11, T[45]);
      c = HH(c, d, a, b, M_offset_15, 16, T[46]);
      b = HH(b, c, d, a, M_offset_2, 23, T[47]);
      a = II(a, b, c, d, M_offset_0, 6, T[48]);
      d = II(d, a, b, c, M_offset_7, 10, T[49]);
      c = II(c, d, a, b, M_offset_14, 15, T[50]);
      b = II(b, c, d, a, M_offset_5, 21, T[51]);
      a = II(a, b, c, d, M_offset_12, 6, T[52]);
      d = II(d, a, b, c, M_offset_3, 10, T[53]);
      c = II(c, d, a, b, M_offset_10, 15, T[54]);
      b = II(b, c, d, a, M_offset_1, 21, T[55]);
      a = II(a, b, c, d, M_offset_8, 6, T[56]);
      d = II(d, a, b, c, M_offset_15, 10, T[57]);
      c = II(c, d, a, b, M_offset_6, 15, T[58]);
      b = II(b, c, d, a, M_offset_13, 21, T[59]);
      a = II(a, b, c, d, M_offset_4, 6, T[60]);
      d = II(d, a, b, c, M_offset_11, 10, T[61]);
      c = II(c, d, a, b, M_offset_2, 15, T[62]);
      b = II(b, c, d, a, M_offset_9, 21, T[63]);
      H[0] = H[0] + a | 0;
      H[1] = H[1] + b | 0;
      H[2] = H[2] + c | 0;
      H[3] = H[3] + d | 0;
    }
    _doFinalize() {
      const data = this._data;
      const dataWords = data.words;
      const nBitsTotal = this._nDataBytes * 8;
      const nBitsLeft = data.sigBytes * 8;
      dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
      const nBitsTotalH = Math.floor(nBitsTotal / 4294967296);
      const nBitsTotalL = nBitsTotal;
      dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
      dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
      data.sigBytes = (dataWords.length + 1) * 4;
      this._process();
      const hash = this._hash;
      const H = hash.words;
      for (let i = 0; i < 4; i += 1) {
        const H_i = H[i];
        H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
      }
      return hash;
    }
    clone() {
      const clone = super.clone.call(this);
      clone._hash = this._hash.clone();
      return clone;
    }
  };
  const MD5 = Hasher._createHelper(MD5Algo);
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_openInTab = (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const gKts = [
    240,
    229,
    105,
    174,
    191,
    220,
    191,
    138,
    26,
    69,
    232,
    190,
    125,
    166,
    115,
    184,
    222,
    143,
    231,
    196,
    69,
    218,
    134,
    196,
    155,
    100,
    139,
    20,
    106,
    180,
    241,
    170,
    56,
    1,
    53,
    158,
    38,
    105,
    44,
    134,
    0,
    107,
    79,
    165,
    54,
    52,
    98,
    166,
    42,
    150,
    104,
    24,
    242,
    74,
    253,
    189,
    107,
    151,
    143,
    77,
    143,
    137,
    19,
    183,
    108,
    142,
    147,
    237,
    14,
    13,
    72,
    62,
    215,
    47,
    136,
    216,
    254,
    254,
    126,
    134,
    80,
    149,
    79,
    209,
    235,
    131,
    38,
    52,
    219,
    102,
    123,
    156,
    126,
    157,
    122,
    129,
    50,
    234,
    182,
    51,
    222,
    58,
    169,
    89,
    52,
    102,
    59,
    170,
    186,
    129,
    96,
    72,
    185,
    213,
    129,
    156,
    248,
    108,
    132,
    119,
    255,
    84,
    120,
    38,
    95,
    190,
    232,
    30,
    54,
    159,
    52,
    128,
    92,
    69,
    44,
    155,
    118,
    213,
    27,
    143,
    204,
    195,
    184,
    245
  ];
  const gKeyS = [41, 35, 33, 94];
  const gKeyL = [120, 6, 173, 76, 51, 134, 93, 24, 76, 1, 63, 70];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const getDownLoadUrl = async (code) => {
    const time = Math.floor(( new Date()).getTime() / 1e3);
    const { data, key } = m115Encode(
      JSON.stringify({
        pickcode: code
      }),
      time
    );
    const download = {
      name: "",
      url: "",
      code: ""
    };
    await wait(1e3);
    const res = await request({
      method: "POST",
      url: `https://proapi.115.com/app/chrome/downurl?t=${time}`,
      data: `data=${encodeURIComponent(data)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    const json = JSON.parse(res.responseText);
    if (!json.state) {
      throw new Error(json.msg);
    } else {
      const data2 = Object.values(JSON.parse(m115Decode(json.data, key)))[0];
      download.name = data2.file_name;
      download.url = data2.url.url;
      download.code = data2.pick_code;
      return download;
    }
  };
  const m115Encode = (code, time) => {
    const key = stringToBytes(MD5(`!@###@#${time}DFDR@#@#`).toString());
    const bytes = stringToBytes(code);
    const tmp1 = m115SymEncode(bytes, bytes.length, key);
    const tmp2 = key.slice(0, 16).concat(tmp1);
    return {
      data: m115AsymEncode(tmp2, tmp2.length),
      key
    };
  };
  const m115Decode = function(src, key) {
    const bytes = stringToBytes(window.atob(src));
    const tmp = m115AsymDecode(bytes, bytes.length);
    return bytesToString(m115SymDecode(tmp.slice(16), tmp.length - 16, key, tmp.slice(0, 16)));
  };
  const stringToBytes = (str) => {
    const arr = [];
    const strLength = str.length;
    for (let i = 0; i < strLength; i++) {
      arr.push(str.charCodeAt(i));
    }
    return arr;
  };
  const m115SymEncode = (src, srclen, key1) => {
    let ret;
    const k1 = m115Getkey(4, key1);
    const k2 = m115Getkey(12, null);
    ret = xor115Enc(src, srclen, k1, 4);
    ret.reverse();
    ret = xor115Enc(ret, srclen, k2, 12);
    return ret;
  };
  const m115SymDecode = (src, srclen, key1, key2) => {
    const k1 = m115Getkey(4, key1);
    const k2 = m115Getkey(12, key2);
    let ret = xor115Enc(src, srclen, k2, 12);
    ret.reverse();
    ret = xor115Enc(ret, srclen, k1, 4);
    return ret;
  };
  const m115Getkey = (length, key) => {
    if (key != null) {
      const results = [];
      for (let i = 0; i < length; i++) {
        const keyValue = key[i];
        const gKtsValue1 = gKts[length * i];
        const gKtsValue2 = gKts[length * (length - 1 - i)];
        if (keyValue !== void 0 && gKtsValue1 !== void 0 && gKtsValue2 !== void 0) {
          results.push(keyValue + gKtsValue1 & 255 ^ gKtsValue2);
        }
      }
      return results;
    }
    if (length === 12) {
      return gKeyL.slice(0);
    }
    return gKeyS.slice(0);
  };
  const xor115Enc = (src, srclen, key, keylen) => {
    const mod4 = srclen % 4;
    const ret = [];
    if (mod4 !== 0) {
      for (let i = 0, j = 0; 0 <= mod4 ? j < mod4 : j > mod4; i = 0 <= mod4 ? ++j : --j) {
        const srcValue = src[i];
        const keyValue = key[i % keylen];
        if (srcValue !== void 0 && keyValue !== void 0) {
          ret.push(srcValue ^ keyValue);
        }
      }
    }
    for (let i = mod4, k = mod4; mod4 <= srclen ? k < srclen : k > srclen; i = mod4 <= srclen ? ++k : --k) {
      const srcValue = src[i];
      const keyValue = key[(i - mod4) % keylen];
      if (srcValue !== void 0 && keyValue !== void 0) {
        ret.push(srcValue ^ keyValue);
      }
    }
    return ret;
  };
  const m115AsymEncode = (src, srclen) => {
    const m = 128 - 11;
    let ret = "";
    const ref2 = Math.floor((srclen + m - 1) / m);
    for (let i = 0, j = 0; 0 <= ref2 ? j < ref2 : j > ref2; i = 0 <= ref2 ? ++j : --j) {
      ret += RSA().encrypt(bytesToString(src.slice(i * m, Math.min((i + 1) * m, srclen))));
    }
    return window.btoa(RSA().hex2a(ret));
  };
  const m115AsymDecode = function(src, srclen) {
    const m = 128;
    let ret = "";
    const ref2 = Math.floor((srclen + m - 1) / m);
    for (let i = 0, j = 0; 0 <= ref2 ? j < ref2 : j > ref2; i = 0 <= ref2 ? ++j : --j) {
      ret += RSA().decrypt(bytesToString(src.slice(i * m, Math.min((i + 1) * m, srclen))));
    }
    return stringToBytes(ret);
  };
  const bytesToString = (b) => {
    let ret = "";
    for (let j = 0; j < b.length; j++) {
      const byteValue = b[j];
      if (byteValue !== void 0) {
        ret += String.fromCharCode(byteValue);
      }
    }
    return ret;
  };
  const RSA = () => {
    const n = BigInt(
      "0x8686980c0f5a24c4b9d43020cd2c22703ff3f450756529058b1cf88f09b8602136477198a6e2683149659bd122c33592fdb5ad47944ad1ea4d36c6b172aad6338c3bb6ac6227502d010993ac967d1aef00f0c8e038de2e4d3bc2ec368af2e9f10a6f1eda4f7262f136420c07c331b871bf139f74f3010e3c4fe57df3afb71683"
    );
    const e = BigInt("0x10001");
    const modPow = (base, exponent, modulus) => {
      if (modulus === 1n) return 0n;
      let result = 1n;
      base = base % modulus;
      while (exponent > 0n) {
        if (exponent % 2n === 1n) {
          result = result * base % modulus;
        }
        exponent = exponent >> 1n;
        base = base * base % modulus;
      }
      return result;
    };
    const pkcs1pad2 = (s, n2) => {
      if (n2 < s.length + 11) {
        return null;
      }
      const ba = [];
      let i = s.length - 1;
      while (i >= 0 && n2 > 0) {
        ba[--n2] = s.charCodeAt(i--);
      }
      ba[--n2] = 0;
      while (n2 > 2) {
        ba[--n2] = 255;
      }
      ba[--n2] = 2;
      ba[--n2] = 0;
      const c = a2hex(ba);
      return BigInt("0x" + c);
    };
    const pkcs1unpad2 = (a) => {
      let b = a.toString(16);
      if (b.length % 2 !== 0) {
        b = "0" + b;
      }
      const c = hex2a(b);
      let i = 1;
      while (c.charCodeAt(i) !== 0) {
        i++;
      }
      return c.slice(i + 1);
    };
    const a2hex = (byteArray) => {
      let hexString = "";
      for (let i = 0; i < byteArray.length; i++) {
        const byteValue = byteArray[i];
        if (byteValue !== void 0) {
          let nextHexByte = byteValue.toString(16);
          if (nextHexByte.length < 2) {
            nextHexByte = "0" + nextHexByte;
          }
          hexString += nextHexByte;
        }
      }
      return hexString;
    };
    const hex2a = (hex) => {
      let str = "";
      for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    };
    const encrypt = (text) => {
      const m = pkcs1pad2(text, 128);
      if (m === null) {
        return null;
      }
      let h = modPow(m, e, n).toString(16);
      while (h.length < 128 * 2) {
        h = "0" + h;
      }
      return h;
    };
    const decrypt = (text) => {
      const ba = [];
      let i = 0;
      while (i < text.length) {
        ba[i] = text.charCodeAt(i);
        i += 1;
      }
      const c = modPow(BigInt("0x" + a2hex(ba)), e, n);
      const d = pkcs1unpad2(c);
      return d;
    };
    return {
      encrypt,
      decrypt,
      hex2a
    };
  };
  const settings = _GM_getValue("settings", null);
  const request = (req) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: req.method,
        url: req.url,
        data: req.data,
        headers: req.headers,
        cookie: req.cookie,
        anonymous: req.anonymous,
        onload: (response) => {
          resolve(response);
        },
        onerror: (error) => {
          reject(error);
        }
      });
    });
  };
  const getErrorMessage = (error) => {
    if (error === null || error === void 0) {
      return "未知错误";
    }
    if (typeof error === "string") {
      return error;
    }
    if (error instanceof Error) {
      return error.message || "未知错误";
    }
    if (typeof error === "object") {
      const errorObj = error;
      if (typeof errorObj.message === "string" && errorObj.message) {
        return errorObj.message;
      }
      if (typeof errorObj.error === "string" && errorObj.error) {
        return errorObj.error;
      }
      if (typeof errorObj.msg === "string" && errorObj.msg) {
        return errorObj.msg;
      }
      if (typeof errorObj.description === "string" && errorObj.description) {
        return errorObj.description;
      }
      if (typeof errorObj.toString === "function") {
        const str = errorObj.toString();
        if (str !== "[object Object]") {
          return str;
        }
      }
      try {
        return JSON.stringify(error);
      } catch {
        return "错误对象无法序列化";
      }
    }
    return String(error);
  };
  const useTheme = () => {
    const osThemeRef = naiveUi.useOsTheme();
    const theme = vue.computed(
      () => osThemeRef.value === "dark" && settings?.darkMode.enable ? naiveUi.darkTheme : null
    );
    return theme;
  };
  // 更加现代化的按钮样式覆盖
  const buttonThemeOverrides = {
    heightMedium: "32px",
    fontSizeMedium: "13px",
    borderRadiusMedium: "16px", // 胶囊圆角
    // 红色按钮 (Error) 样式微调
    colorError: "#ff4d4f",
    colorHoverError: "#ff7875",
    colorPressedError: "#d9363e",
    colorFocusError: "#ff7875",
    // 蓝色按钮 (Primary) 样式微调
    colorPrimary: "#2777F8",
    colorHoverPrimary: "#5191fa",
    colorPressedPrimary: "#1e60d1",
    colorFocusPrimary: "#5191fa",
    // 绿色/青色按钮 (Info) 样式微调
    colorInfo: "#00b578", // 改为更现代的绿色
    colorHoverInfo: "#33c48f",
    colorPressedInfo: "#009660",
    colorFocusInfo: "#33c48f",
  };

  const menuThemeOverrides = {
    itemColorActive: "#EEF0FF",
    itemColorActiveHover: "#EEF0FF",
    itemTextColorActive: "#2777F8",
    itemTextColorActiveHover: "#2777F8",
    borderRadius: "8px" // 菜单项圆角
  };

  // 新增全局配置（用于 NConfigProvider）
  const globalThemeOverrides = {
      common: {
          borderRadius: '6px',
          primaryColor: '#2777F8'
      },
      Button: buttonThemeOverrides
  };
  const _hoisted_1$7 = {
    style: {
      "border-right": "1px solid #edeeef",
      "height": "100%"
    }
  };
  const _sfc_main$9 = vue.defineComponent({
    __name: "Sidebar",
    setup(__props) {
      const menuOptions = [{
        label: () => vue.createVNode("a", {
          "href": "//115.com/?cid=0&offset=0&mode=wangpan"
        }, [vue.createTextVNode("全部文件")]),
        key: "all"
      }, {
        label: () => vue.createVNode("a", {
          "href": "//115.com/?tab=upload&mode=wangpan"
        }, [vue.createTextVNode("最近上传")]),
        key: "upload"
      }, {
        label: () => vue.createVNode("a", {
          "href": "//115.com/?tab=offline&mode=wangpan"
        }, [vue.createTextVNode("云下载")]),
        key: "offline"
      }];
      const menuValue = vue.ref("all");
      const theme = useTheme();
      const url = new URL(window.location.href);
      if (url.searchParams.has("cid")) {
        menuValue.value = "all";
      } else if (url.searchParams.has("tab")) {
        const tab = url.searchParams.get("tab");
        if (tab === "upload") {
          menuValue.value = "upload";
        } else if (tab === "offline") {
          menuValue.value = "offline";
        }
      }
      return (_ctx, _cache) => {
        const _component_NMenu = naiveUi.NMenu;
        const _component_NConfigProvider = naiveUi.NConfigProvider;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$7, [vue.createVNode(_component_NConfigProvider, {
          theme: vue.unref(theme),"theme-overrides": globalThemeOverrides
        }, {
          default: vue.withCtx(() => [vue.createVNode(_component_NMenu, {
            value: vue.unref(menuValue),
            "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.isRef(menuValue) ? menuValue.value = $event : null),
            options: menuOptions,
            "theme-overrides": vue.unref(menuThemeOverrides)
          }, null, 8, ["value", "theme-overrides"])]),
          _: 1
        }, 8, ["theme"])]);
      };
    }
  });
  function tryOnScopeDispose(fn, failSilently) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn, failSilently);
      return true;
    }
    return false;
  }
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const toString = Object.prototype.toString;
  const isObject = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  function createSingletonPromise(fn) {
    let _promise;
    function wrapper() {
      if (!_promise) _promise = fn();
      return _promise;
    }
    wrapper.reset = async () => {
      const _prev = _promise;
      _promise = void 0;
      if (_prev) await _prev;
    };
    return wrapper;
  }
  function toArray(value) {
    return Array.isArray(value) ? value : [value];
  }
  function useIntervalFn(cb, interval = 1e3, options = {}) {
    const { immediate = true, immediateCallback = false } = options;
    let timer = null;
    const isActive = vue.shallowRef(false);
    function clean() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
    function pause() {
      isActive.value = false;
      clean();
    }
    function resume() {
      const intervalValue = vue.toValue(interval);
      if (intervalValue <= 0) return;
      isActive.value = true;
      if (immediateCallback) cb();
      clean();
      if (isActive.value) timer = setInterval(cb, intervalValue);
    }
    if (immediate && isClient) resume();
    if (vue.isRef(interval) || typeof interval === "function") tryOnScopeDispose(vue.watch(interval, () => {
      if (isActive.value && isClient) resume();
    }));
    tryOnScopeDispose(pause);
    return {
      isActive: vue.shallowReadonly(isActive),
      pause,
      resume
    };
  }
  function useTimeoutFn(cb, interval, options = {}) {
    const { immediate = true, immediateCallback = false } = options;
    const isPending = vue.shallowRef(false);
    let timer;
    function clear() {
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }
    }
    function stop() {
      isPending.value = false;
      clear();
    }
    function start(...args) {
      if (immediateCallback) cb();
      clear();
      isPending.value = true;
      timer = setTimeout(() => {
        isPending.value = false;
        timer = void 0;
        cb(...args);
      }, vue.toValue(interval));
    }
    if (immediate) {
      isPending.value = true;
      if (isClient) start();
    }
    tryOnScopeDispose(stop);
    return {
      isPending: vue.shallowReadonly(isPending),
      start,
      stop
    };
  }
  function watchImmediate(source, cb, options) {
    return vue.watch(source, cb, {
      ...options,
      immediate: true
    });
  }
  const defaultWindow = isClient ? window : void 0;
  const defaultNavigator = isClient ? window.navigator : void 0;
  function unrefElement(elRef) {
    var _$el;
    const plain = vue.toValue(elRef);
    return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
  }
  function useEventListener(...args) {
    const register = (el, event, listener, options) => {
      el.addEventListener(event, listener, options);
      return () => el.removeEventListener(event, listener, options);
    };
    const firstParamTargets = vue.computed(() => {
      const test = toArray(vue.toValue(args[0])).filter((e) => e != null);
      return test.every((e) => typeof e !== "string") ? test : void 0;
    });
    return watchImmediate(() => {
      var _firstParamTargets$va, _firstParamTargets$va2;
      return [
        (_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
        toArray(vue.toValue(firstParamTargets.value ? args[1] : args[0])),
        toArray(vue.unref(firstParamTargets.value ? args[2] : args[1])),
        vue.toValue(firstParamTargets.value ? args[3] : args[2])
      ];
    }, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
      if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
      const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
      const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
      onCleanup(() => {
        cleanups.forEach((fn) => fn());
      });
    }, { flush: "post" });
  }
function useMounted() {
    const isMounted = vue.shallowRef(false);
    const instance = vue.getCurrentInstance();
    if (instance) vue.onMounted(() => {
      isMounted.value = true;
    }, instance);
    return isMounted;
  }
function useSupported(callback) {
    const isMounted = useMounted();
    return vue.computed(() => {
      isMounted.value;
      return Boolean(callback());
    });
  }
function usePermission(permissionDesc, options = {}) {
    const { controls = false, navigator: navigator$1 = defaultNavigator } = options;
    const isSupported = useSupported(() => navigator$1 && "permissions" in navigator$1);
    const permissionStatus = vue.shallowRef();
    const desc = typeof permissionDesc === "string" ? { name: permissionDesc } : permissionDesc;
    const state = vue.shallowRef();
    const update = () => {
      var _permissionStatus$val, _permissionStatus$val2;
      state.value = (_permissionStatus$val = (_permissionStatus$val2 = permissionStatus.value) === null || _permissionStatus$val2 === void 0 ? void 0 : _permissionStatus$val2.state) !== null && _permissionStatus$val !== void 0 ? _permissionStatus$val : "prompt";
    };
    useEventListener(permissionStatus, "change", update, { passive: true });
    const query = createSingletonPromise(async () => {
      if (!isSupported.value) return;
      if (!permissionStatus.value) try {
        permissionStatus.value = await navigator$1.permissions.query(desc);
      } catch (_unused) {
        permissionStatus.value = void 0;
      } finally {
        update();
      }
      if (controls) return vue.toRaw(permissionStatus.value);
    });
    query();
    if (controls) return {
      state,
      isSupported,
      query
    };
    else return state;
  }
  function useClipboard(options = {}) {
    const { navigator: navigator$1 = defaultNavigator, read = false, source, copiedDuring = 1500, legacy = false } = options;
    const isClipboardApiSupported = useSupported(() => navigator$1 && "clipboard" in navigator$1);
    const permissionRead = usePermission("clipboard-read");
    const permissionWrite = usePermission("clipboard-write");
    const isSupported = vue.computed(() => isClipboardApiSupported.value || legacy);
    const text = vue.shallowRef("");
    const copied = vue.shallowRef(false);
    const timeout = useTimeoutFn(() => copied.value = false, copiedDuring, { immediate: false });
    async function updateText() {
      let useLegacy = !(isClipboardApiSupported.value && isAllowed(permissionRead.value));
      if (!useLegacy) try {
        text.value = await navigator$1.clipboard.readText();
      } catch (_unused) {
        useLegacy = true;
      }
      if (useLegacy) text.value = legacyRead();
    }
    if (isSupported.value && read) useEventListener(["copy", "cut"], updateText, { passive: true });
    async function copy(value = vue.toValue(source)) {
      if (isSupported.value && value != null) {
        let useLegacy = !(isClipboardApiSupported.value && isAllowed(permissionWrite.value));
        if (!useLegacy) try {
          await navigator$1.clipboard.writeText(value);
        } catch (_unused2) {
          useLegacy = true;
        }
        if (useLegacy) legacyCopy(value);
        text.value = value;
        copied.value = true;
        timeout.start();
      }
    }
    function legacyCopy(value) {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "absolute";
      ta.style.opacity = "0";
      ta.setAttribute("readonly", "");
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    function legacyRead() {
      var _document$getSelectio, _document, _document$getSelectio2;
      return (_document$getSelectio = (_document = document) === null || _document === void 0 || (_document$getSelectio2 = _document.getSelection) === null || _document$getSelectio2 === void 0 || (_document$getSelectio2 = _document$getSelectio2.call(_document)) === null || _document$getSelectio2 === void 0 ? void 0 : _document$getSelectio2.toString()) !== null && _document$getSelectio !== void 0 ? _document$getSelectio : "";
    }
    function isAllowed(status) {
      return status === "granted" || status === "prompt";
    }
    return {
      isSupported,
      text: vue.readonly(text),
      copied: vue.readonly(copied),
      copy
    };
  }
  const DefaultMagicKeysAliasMap = {
    ctrl: "control",
    command: "meta",
    cmd: "meta",
    option: "alt",
    up: "arrowup",
    down: "arrowdown",
    left: "arrowleft",
    right: "arrowright"
  };
  function useMagicKeys(options = {}) {
    const { reactive: useReactive = false, target = defaultWindow, aliasMap = DefaultMagicKeysAliasMap, passive = true, onEventFired = noop } = options;
    const current = vue.reactive( new Set());
    const obj = {
      toJSON() {
        return {};
      },
      current
    };
    const refs = useReactive ? vue.reactive(obj) : obj;
    const metaDeps = new Set();
    const depsMap = new Map([
      ["Meta", metaDeps],
      ["Shift", new Set()],
      ["Alt", new Set()]
    ]);
    const usedKeys = new Set();
    function setRefs(key, value) {
      if (key in refs) if (useReactive) refs[key] = value;
      else refs[key].value = value;
    }
    function reset() {
      current.clear();
      for (const key of usedKeys) setRefs(key, false);
    }
    function updateDeps(value, e, keys$1) {
      if (!value || typeof e.getModifierState !== "function") return;
      for (const [modifier, depsSet] of depsMap) if (e.getModifierState(modifier)) {
        keys$1.forEach((key) => depsSet.add(key));
        break;
      }
    }
    function clearDeps(value, key) {
      if (value) return;
      const depsMapKey = `${key[0].toUpperCase()}${key.slice(1)}`;
      const deps = depsMap.get(depsMapKey);
      if (!["shift", "alt"].includes(key) || !deps) return;
      const depsArray = Array.from(deps);
      const depsIndex = depsArray.indexOf(key);
      depsArray.forEach((key$1, index) => {
        if (index >= depsIndex) {
          current.delete(key$1);
          setRefs(key$1, false);
        }
      });
      deps.clear();
    }
    function updateRefs(e, value) {
      var _e$key, _e$code;
      const key = (_e$key = e.key) === null || _e$key === void 0 ? void 0 : _e$key.toLowerCase();
      const values = [(_e$code = e.code) === null || _e$code === void 0 ? void 0 : _e$code.toLowerCase(), key].filter(Boolean);
      if (key === "") return;
      if (key) if (value) current.add(key);
      else current.delete(key);
      for (const key$1 of values) {
        usedKeys.add(key$1);
        setRefs(key$1, value);
      }
      updateDeps(value, e, [...current, ...values]);
      clearDeps(value, key);
      if (key === "meta" && !value) {
        metaDeps.forEach((key$1) => {
          current.delete(key$1);
          setRefs(key$1, false);
        });
        metaDeps.clear();
      }
    }
    useEventListener(target, "keydown", (e) => {
      updateRefs(e, true);
      return onEventFired(e);
    }, { passive });
    useEventListener(target, "keyup", (e) => {
      updateRefs(e, false);
      return onEventFired(e);
    }, { passive });
    useEventListener("blur", reset, { passive });
    useEventListener("focus", reset, { passive });
    const proxy = new Proxy(refs, { get(target$1, prop, rec) {
      if (typeof prop !== "string") return Reflect.get(target$1, prop, rec);
      prop = prop.toLowerCase();
      if (prop in aliasMap) prop = aliasMap[prop];
      if (!(prop in refs)) if (/[+_-]/.test(prop)) {
        const keys$1 = prop.split(/[+_-]/g).map((i) => i.trim());
        refs[prop] = vue.computed(() => keys$1.map((key) => vue.toValue(proxy[key])).every(Boolean));
      } else refs[prop] = vue.shallowRef(false);
      const r = Reflect.get(target$1, prop, rec);
      return useReactive ? vue.toValue(r) : r;
    } });
    return proxy;
  }
function usePageLeave(options = {}) {
    const { window: window$1 = defaultWindow } = options;
    const isLeft = vue.shallowRef(false);
    const handler = (event) => {
      if (!window$1) return;
      event = event || window$1.event;
      isLeft.value = !(event.relatedTarget || event.toElement);
    };
    if (window$1) {
      const listenerOptions = { passive: true };
      useEventListener(window$1, "mouseout", handler, listenerOptions);
      useEventListener(window$1.document, "mouseleave", handler, listenerOptions);
      useEventListener(window$1.document, "mouseenter", handler, listenerOptions);
    }
    return isLeft;
  }
  const _sfc_main$8 = vue.defineComponent({
    __name: "DownloadContent",
    setup(__props) {
      const message2 = naiveUi.useMessage();
      const showDownload = vue.ref(false);
      const downloads = vue.ref([]);
      const keys = useMagicKeys();
      const ctrlAltD = keys["Ctrl+Alt+D"];
      const ctrlAltO = keys["Ctrl+Alt+O"];
      const f9 = keys["F9"];
      const videoList = vue.ref([]);
      const bc = new BroadcastChannel("115Plus");
      vue.watch(ctrlAltD, (v) => {
        if (v && _GM_info.userAgentData.platform !== "macOS") {
          handleDownload();
        }
      });
      vue.watch(ctrlAltO, (v) => {
        if (v) {
          openFile();
        }
      });
      vue.watch(f9, (v) => {
        if (v && _GM_info.userAgentData.platform === "macOS") {
          handleDownload();
        }
      });
      const getSelectFile = () => {
        const files = [];
        downloads.value = [];
        // BUG修复：同时获取列表模式(.list-contents)和缩略图模式(.list-thumb)下的列表项
        const lists = document.querySelectorAll(".list-contents > ul > li, .list-thumb > ul > li");

        lists.forEach((item) => {
          const checkbox = item.querySelector('input[type="checkbox"]');
          // 逻辑增强：既检查 checkbox 是否选中，也检查 li 元素是否有 selected 类名（缩略图模式常用状态）
          const isSelected = (checkbox && checkbox.checked) || item.classList.contains("selected");

          if (isSelected) {
            files.push({
              name: item.getAttribute("title"),
              isDir: item.getAttribute("file_type") === "0" ? true : false,
              code: item.getAttribute("pick_code"),
              cateId: item.getAttribute("cate_id") || "",
              fileMode: item.getAttribute("file_mode") || ""
            });
          }
        });
        if (files.length === 0) {
          message2.destroyAll();
          message2.warning("请选择文件");
          return false;
        }
        return files;
      };

      const handleDownload = async () => {
        const selectFiles = getSelectFile();
        if (!selectFiles) return;
        const loading = message2.loading("获取文件信息中...", {
          duration: 0
        });
        try {
          for (const file of selectFiles) {
            if (file.isDir) {
              const children = await getForderFileStructure(file.cateId);
              downloads.value.push({
                name: file.name,
                code: file.cateId,
                children
              });
            } else {
              downloads.value.push({
                name: file.name,
                code: file.code
              });
            }
          }
          vue.nextTick(() => {
            loading.destroy();
          });
          if (downloads.value.length === 0) {
            message2.error("获取文件信息失败");
          } else {
            showDownload.value = true;
          }
        } catch (error) {
          console.error(error);
          message2.error(`获取信息失败，错误信息：${getErrorMessage(error)}`);
        }
      };
      const openFile = () => {
        const files = getSelectFile();
        if (!files) return;
        files.forEach((file) => {
          if (file.isDir) {
            _GM_openInTab(`https://115.com/?cid=${file.cateId}&offset=0&tab=&mode=wangpan`, {
              setParent: settings?.openNewTab.setParent
            });
          } else if (file.fileMode === "9") {
            _GM_openInTab(`https://115vod.com/?pickcode=${file.code}&share_id=0`, {
              setParent: settings?.openNewTab.setParent
            });
          }
        });
      };
      const handlePlay = async () => {
        try {
          const files = getSelectFile();
          if (!files) return;
          videoList.value = [];
          for (const file of files) {
            if (file.isDir) {
              message2.error("暂不支持选择文件夹播放，请勿选择文件夹");
              return;
            }
            if (file.fileMode === "9") {
              videoList.value.push({
                name: file.name,
                code: file.code
              });
            }
          }
          if (videoList.value.length === 0) {
            message2.error("未选择视频文件");
            return;
          }
          bc.postMessage({
            type: "VideoPlay",
            data: JSON.stringify(videoList.value),
            url: window.top?.location.href
          });
        } catch (error) {
          console.error(error);
          message2.error(`视频播放失败，错误信息：${getErrorMessage(error)}`);
        }
      };
      const handleFolderPlay = async () => {
        try {
          const url = new URL(window.parent.location.href);
          const files = await getForderVideos(url.searchParams.get("cid"));
          if (files.length === 0) {
            message2.error("文件夹内没有视频文件");
            return;
          }
          videoList.value = files.map((item) => {
            return {
              name: item.n,
              code: item.pc
            };
          });
          bc.postMessage({
            type: "VideoPlay",
            data: JSON.stringify(videoList.value),
            url: window.top?.location.href
          });
        } catch (error) {
          console.error(error);
          message2.error(`视频播放失败，错误信息：${getErrorMessage(error)}`);
        }
      };
      const getForderVideos = async (cid) => {
        const res = await request({
          method: "GET",
          url: `https://aps.115.com/natsort/files.php?aid=1&cid=${cid}&offset=0&limit=1150&show_dir=0&nf=&qid=0&type=4&source=&format=json&star=&is_q=&is_share=&r_all=1&o=file_name&asc=1&cur=1&natsort=1`
        });
        if (res.status === 200) {
          const json = JSON.parse(res.responseText);
          if (json.state) {
            return json.data;
          } else {
            if (json.error) {
              throw new Error(json.error);
            } else {
              throw new Error("获取文件夹文件失败");
            }
          }
        } else {
          throw new Error("获取文件夹文件失败");
        }
      };
      const getForderFileStructure = async (id) => {
        const temp = [];
        const files = await getForderFiles(id);
        for (const file of files) {
          if (file.fid) {
            temp.push({
              name: file.n,
              code: file.pc
            });
          } else {
            const children = await getForderFileStructure(file.cid);
            temp.push({
              name: file.n,
              code: file.pc,
              children
            });
          }
        }
        return temp;
      };
      const getForderFiles = async (id) => {
        const res = await request({
          method: "GET",
          url: `https://webapi.115.com/files?aid=1&cid=${id}&show_dir=1&limit=9999&format=json`
        });
        const json = JSON.parse(res.responseText);
        if (json.state) {
          return json.data;
        } else {
          if (json.error) {
            throw new Error(json.error);
          } else {
            throw new Error("获取文件夹中的文件失败");
          }
        }
      };
      const handleDownloadFile = async (option) => {
        try {
          const loading = message2.loading("获取下载链接中...", {
            duration: 0
          });
          const download = await getDownLoadUrl(option.code);
          loading.destroy();
          if (download.url) {
            _GM_openInTab(download.url, {
              setParent: settings?.openNewTab.setParent
            });
          } else {
            message2.error("获取下载链接失败");
          }
        } catch (error) {
          console.error(error);
          message2.error(`获取下载链接失败，错误信息：${getErrorMessage(error)}`);
        }
      };
      const suffixRender = (info) => {
        if (info.option.url) {
          return vue.createVNode(naiveUi.NButton, {
            "text": true,
            "size": "tiny", // 调小
            "theme-overrides": buttonThemeOverrides,
            "tag": "a",
            "href": info.option.url,
            "target": "_blank"
          }, {
            default: () => [vue.createTextVNode("下载")]
          });
        } else if (!info.option.children) {
          return vue.createVNode(naiveUi.NButton, {
            "text": true,
            "size": "tiny",
            "theme-overrides": buttonThemeOverrides,
            "onClick": () => handleDownloadFile(info.option)
          }, {
            default: () => [vue.createTextVNode("下载")]
          });
        } else {
          return void 0;
        }
      };
      // *** 核心修改：新的渲染函数 ***
      return (_ctx, _cache) => {
        const _component_NTree = naiveUi.NTree;
        const _component_NModal = naiveUi.NModal;
        const _component_NButton = naiveUi.NButton;
        const _component_NIcon = naiveUi.NIcon;
        const _component_NTooltip = naiveUi.NTooltip; // 可选：添加提示
        // 辅助函数：渲染带图标的按钮
        const renderBtn = (key, type, onClick, iconComp, text, tooltip) => {
             return vue.createVNode(_component_NButton, {
                key: key,
                type: type,
                secondary: true, // 使用次级按钮样式（白底带色），更现代
                round: true,     // 圆角胶囊样式
                size: "medium",
                style: { "margin-right": "12px", "box-shadow": "0 2px 4px rgba(0,0,0,0.05)" },
                onClick: onClick
              }, {
                icon: () => vue.createVNode(_component_NIcon, null, { default: () => [vue.createVNode(iconComp)] }),
                default: () => [vue.createTextVNode(" " + text)]
              });
        };
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          // 下载按钮
          (vue.unref(settings) ? vue.unref(settings).download.enable : true) ?
            renderBtn(0, "error", handleDownload, DownloadIcon, "下载选中", "下载选中的文件")
            : null,

          // 新标签打开按钮
          (vue.unref(settings) ? vue.unref(settings).openNewTab.enable : true) ?
             renderBtn(1, "primary", openFile, TabIcon, "批量打开", "在新标签页打开")
            : null,

          // 播放按钮
          (vue.unref(settings) ? vue.unref(settings).video.enable : true) ?
             renderBtn(2, "info", handlePlay, PlayIcon, "播放视频", "播放选中视频")
            : null,

          // 文件夹播放按钮
          (vue.unref(settings) ? vue.unref(settings).video.enable : true) ?
             renderBtn(3, "info", handleFolderPlay, PlayIcon, "播放文件夹", "播放当前文件夹内所有视频")
            : null,
          // 弹窗部分保持不变
          vue.createVNode(_component_NModal, {
            show: vue.unref(showDownload),
            "onUpdate:show": _cache[0] || (_cache[0] = ($event) => vue.isRef(showDownload) ? showDownload.value = $event : null),
            style: { "width": "500px", "border-radius": "12px" }, // 稍微调宽并加圆角
            title: "文件下载列表",
            bordered: false,
            preset: "card"
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_NTree, {
              data: vue.unref(downloads),
              "block-line": "",
              "expand-on-click": "",
              "key-field": "code",
              "label-field": "name",
              "show-line": "",
              "virtual-scroll": "",
              style: { "max-height": "50vh" },
              "render-suffix": suffixRender
            }, null, 8, ["data"])]),
            _: 1
          }, 8, ["show"])
        ], 64);
      };
    }
  });
  const _hoisted_1$6 = { style: { "height": "100%", "display": "flex", "align-items": "center", "margin-left": "1rem" } };
  const _sfc_main$7 = vue.defineComponent({
    __name: "Download",
    setup(__props) {
      const theme = useTheme();
      return (_ctx, _cache) => {
        const _component_DownloadContent = _sfc_main$8;
        const _component_NMessageProvider = naiveUi.NMessageProvider;
        const _component_NModalProvider = naiveUi.NModalProvider;
        const _component_NConfigProvider = naiveUi.NConfigProvider;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          vue.createVNode(_component_NConfigProvider, { theme: vue.unref(theme),"theme-overrides": globalThemeOverrides }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_NModalProvider, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_NMessageProvider, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_DownloadContent)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["theme"])
        ]);
      };
    }
  });
  const _hoisted_1$5 = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 1024 1024"
  };
  const CopyOutlined = vue.defineComponent({
    name: "CopyOutlined",
    render: function render(_ctx, _cache) {
      return vue.openBlock(), vue.createElementBlock(
        "svg",
        _hoisted_1$5,
        _cache[0] || (_cache[0] = [
          vue.createElementVNode(
            "path",
            {
              d: "M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z",
              fill: "currentColor"
            },
            null,
            -1
)
        ])
      );
    }
  });
  const _hoisted_1$4 = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 1024 1024"
  };
  const DeleteOutlined = vue.defineComponent({
    name: "DeleteOutlined",
    render: function render2(_ctx, _cache) {
      return vue.openBlock(), vue.createElementBlock(
        "svg",
        _hoisted_1$4,
        _cache[0] || (_cache[0] = [
          vue.createElementVNode(
            "path",
            {
              d: "M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z",
              fill: "currentColor"
            },
            null,
            -1
)
        ])
      );
    }
  });
  const _hoisted_1$3 = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 1024 1024"
  };
  const FolderOutlined = vue.defineComponent({
    name: "FolderOutlined",
    render: function render3(_ctx, _cache) {
      return vue.openBlock(), vue.createElementBlock(
        "svg",
        _hoisted_1$3,
        _cache[0] || (_cache[0] = [
          vue.createElementVNode(
            "path",
            {
              d: "M880 298.4H521L403.7 186.2a8.15 8.15 0 0 0-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z",
              fill: "currentColor"
            },
            null,
            -1
)
        ])
      );
    }
  });
  const _hoisted_1$2 = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 1024 1024"
  };
  const SettingOutlined = vue.defineComponent({
    name: "SettingOutlined",
    render: function render4(_ctx, _cache) {
      return vue.openBlock(), vue.createElementBlock(
        "svg",
        _hoisted_1$2,
        _cache[0] || (_cache[0] = [
          vue.createElementVNode(
            "path",
            {
              d: "M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a443.74 443.74 0 0 0-79.7-137.9l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.4a351.86 351.86 0 0 0-99 57.4l-81.9-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a446.02 446.02 0 0 0-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1c0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0 0 25.8 25.7l2.7.5a449.4 449.4 0 0 0 159 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-85a350 350 0 0 0 99.7-57.6l81.3 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1l74.7 63.9a370.03 370.03 0 0 1-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3l-17.9 97a377.5 377.5 0 0 1-85 0l-17.9-97.2l-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9l-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5l-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5c0-15.3 1.2-30.6 3.7-45.5l6.5-40l-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2l31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3l17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97l38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8l92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176s176-78.8 176-176s-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 0 1 624 502c0 29.9-11.7 58-32.8 79.2z",
              fill: "currentColor"
            },
            null,
            -1
)
        ])
      );
    }
  });
  const DownloadIcon = vue.defineComponent({
    name: "DownloadIcon",
    render: () => vue.h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" }, [
      vue.h("path", { fill: "currentColor", d: "M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7l7-7z" })
    ])
  });
  const PlayIcon = vue.defineComponent({
    name: "PlayIcon",
    render: () => vue.h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" }, [
      vue.h("path", { fill: "currentColor", d: "M8 5v14l11-7z" })
    ])
  });
  const TabIcon = vue.defineComponent({
    name: "TabIcon",
    render: () => vue.h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" }, [
      vue.h("path", { fill: "currentColor", d: "M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3h-7z" })
    ])
  });
  const _hoisted_1$1 = { style: { "display": "flex", "justify-content": "center", "margin-top": "8px" } };
  const _hoisted_2$1 = { style: { "display": "flex", "justify-content": "end" } };
  const _sfc_main$6 = vue.defineComponent({
    __name: "Setting",
    setup(__props) {
      const showSetting = vue.ref(false);
      const theme = useTheme();
      const settingsRef = vue.ref(
        settings ?? {
          sidebar: {
            enable: true
          },
          download: {
            enable: true
          },
          openNewTab: {
            enable: true,
            setParent: false
          },
          oldButton: {
            enable: true,
            deleteSource: true
          },
          video: {
            enable: true,
            volume: 1,
            defaultPlaybackRate: 1,
            autoplay: true,
            history: true
          },
          darkMode: {
            enable: false
          },
          fp: {
            enable: true
          }
        }
      );
      const handleOpen = () => {
        showSetting.value = true;
      };
      const handleClose = () => {
        showSetting.value = false;
      };
      const handleSave = () => {
        _GM_setValue("settings", settingsRef.value);
        handleClose();
        history.go(0);
      };
      return (_ctx, _cache) => {
        const _component_NIcon = naiveUi.NIcon;
        const _component_NButton = naiveUi.NButton;
        const _component_NSwitch = naiveUi.NSwitch;
        const _component_NFormItem = naiveUi.NFormItem;
        const _component_NForm = naiveUi.NForm;
        const _component_NTabPane = naiveUi.NTabPane;
        const _component_NSlider = naiveUi.NSlider;
        const _component_NRadio = naiveUi.NRadio;
        const _component_NSpace = naiveUi.NSpace;
        const _component_NRadioGroup = naiveUi.NRadioGroup;
        const _component_NTabs = naiveUi.NTabs;
        const _component_NCard = naiveUi.NCard;
        const _component_NModal = naiveUi.NModal;
        const _component_NConfigProvider = naiveUi.NConfigProvider;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createVNode(_component_NConfigProvider, { theme: vue.unref(theme) ,"theme-overrides": globalThemeOverrides}, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_NButton, {
                text: "",
                style: { "font-size": "12px" },
                "theme-overrides": vue.unref(buttonThemeOverrides),
                onClick: handleOpen
              }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("div", null, [
                    vue.createVNode(_component_NIcon, { size: "24" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(SettingOutlined))
                      ]),
                      _: 1
                    })
                  ]),
                  _cache[14] || (_cache[14] = vue.createElementVNode("div", null, " 115+ 设置 ", -1))
                ]),
                _: 1
              }, 8, ["theme-overrides"]),
              vue.createVNode(_component_NModal, {
                show: vue.unref(showSetting),
                "onUpdate:show": _cache[13] || (_cache[13] = ($event) => vue.isRef(showSetting) ? showSetting.value = $event : null)
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_NCard, {
                    style: { "width": "40%" },
                    title: "115+ 设置",
                    bordered: false,
                    role: "dialog",
                    closable: "",
                    onClose: handleClose
                  }, {
                    action: vue.withCtx(() => [
                      vue.createElementVNode("div", _hoisted_2$1, [
                        vue.createVNode(_component_NButton, {
                          type: "primary",
                          onClick: handleSave
                        }, {
                          default: vue.withCtx(() => [..._cache[24] || (_cache[24] = [
                            vue.createTextVNode("保存", -1)
                          ])]),
                          _: 1
                        })
                      ])
                    ]),
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_NTabs, {
                        type: "segment",
                        animated: ""
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_NTabPane, {
                            name: "functionSwitch",
                            tab: "功能开关"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_NForm, {
                                ref: "formRef",
                                "label-placement": "left",
                                "label-width": "auto",
                                "show-feedback": false
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_NFormItem, {
                                    label: "精简侧边栏",
                                    path: "sidebar.enable"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).sidebar.enable,
                                        "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.unref(settingsRef).sidebar.enable = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_NFormItem, {
                                    label: "下载文件",
                                    path: "download.enable"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).download.enable,
                                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => vue.unref(settingsRef).download.enable = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_NFormItem, {
                                    label: "批量新标签打开",
                                    path: "openNewTab.enable"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).openNewTab.enable,
                                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => vue.unref(settingsRef).openNewTab.enable = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_NFormItem, {
                                    label: "自定义离线下载按钮和云下载列表",
                                    path: "oldButton.enable"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).oldButton.enable,
                                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => vue.unref(settingsRef).oldButton.enable = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_NFormItem, {
                                    label: "视频播放",
                                    path: "video.enable"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).video.enable,
                                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => vue.unref(settingsRef).video.enable = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_NFormItem, {
                                    label: "跟随系统暗黑模式",
                                    path: "darkMode.enable"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).darkMode.enable,
                                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => vue.unref(settingsRef).darkMode.enable = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_NFormItem, {
                                    label: "去水印",
                                    path: "fp.enable"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).fp.enable,
                                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => vue.unref(settingsRef).fp.enable = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 512)
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_NTabPane, {
                            name: "playSetting",
                            tab: "播放设置"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_NForm, {
                                ref: "formRef",
                                "label-placement": "left",
                                "label-width": "auto",
                                "show-feedback": false
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_NFormItem, {
                                    label: "默认音量",
                                    path: "video.volume"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSlider, {
                                        value: vue.unref(settingsRef).video.volume,
                                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => vue.unref(settingsRef).video.volume = $event),
                                        step: 0.01,
                                        max: 1,
                                        "format-tooltip": (v) => `${(v * 100).toFixed(0)}%`
                                      }, null, 8, ["value", "format-tooltip"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_NFormItem, {
                                    label: "默认速度",
                                    path: "video.defaultPlaybackRate"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NRadioGroup, {
                                        value: vue.unref(settingsRef).video.defaultPlaybackRate,
                                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => vue.unref(settingsRef).video.defaultPlaybackRate = $event),
                                        name: "radiogroup"
                                      }, {
                                        default: vue.withCtx(() => [
                                          vue.createVNode(_component_NSpace, null, {
                                            default: vue.withCtx(() => [
                                              vue.createVNode(_component_NRadio, { value: 0.5 }, {
                                                default: vue.withCtx(() => [..._cache[15] || (_cache[15] = [
                                                  vue.createTextVNode(" 0.5x ", -1)
                                                ])]),
                                                _: 1
                                              }),
                                              vue.createVNode(_component_NRadio, { value: 0.75 }, {
                                                default: vue.withCtx(() => [..._cache[16] || (_cache[16] = [
                                                  vue.createTextVNode(" 0.75x ", -1)
                                                ])]),
                                                _: 1
                                              }),
                                              vue.createVNode(_component_NRadio, { value: 1 }, {
                                                default: vue.withCtx(() => [..._cache[17] || (_cache[17] = [
                                                  vue.createTextVNode(" 1x ", -1)
                                                ])]),
                                                _: 1
                                              }),
                                              vue.createVNode(_component_NRadio, { value: 1.25 }, {
                                                default: vue.withCtx(() => [..._cache[18] || (_cache[18] = [
                                                  vue.createTextVNode(" 1.25x ", -1)
                                                ])]),
                                                _: 1
                                              }),
                                              vue.createVNode(_component_NRadio, { value: 1.5 }, {
                                                default: vue.withCtx(() => [..._cache[19] || (_cache[19] = [
                                                  vue.createTextVNode(" 1.5x ", -1)
                                                ])]),
                                                _: 1
                                              }),
                                              vue.createVNode(_component_NRadio, { value: 2 }, {
                                                default: vue.withCtx(() => [..._cache[20] || (_cache[20] = [
                                                  vue.createTextVNode(" 2x ", -1)
                                                ])]),
                                                _: 1
                                              }),
                                              vue.createVNode(_component_NRadio, { value: 3 }, {
                                                default: vue.withCtx(() => [..._cache[21] || (_cache[21] = [
                                                  vue.createTextVNode(" 3x ", -1)
                                                ])]),
                                                _: 1
                                              }),
                                              vue.createVNode(_component_NRadio, { value: 4 }, {
                                                default: vue.withCtx(() => [..._cache[22] || (_cache[22] = [
                                                  vue.createTextVNode(" 4x ", -1)
                                                ])]),
                                                _: 1
                                              }),
                                              vue.createVNode(_component_NRadio, { value: 5 }, {
                                                default: vue.withCtx(() => [..._cache[23] || (_cache[23] = [
                                                  vue.createTextVNode(" 5x ", -1)
                                                ])]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["value"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_NFormItem, {
                                    label: "自动播放",
                                    path: "video.autoplay"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).video.autoplay,
                                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => vue.unref(settingsRef).video.autoplay = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_NFormItem, {
                                    label: "同步播放进度",
                                    path: "video.history"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).video.history,
                                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => vue.unref(settingsRef).video.history = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 512)
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_NTabPane, {
                            name: "cloudDownloadSetting",
                            tab: "离线下载设置"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_NForm, {
                                ref: "formRef",
                                "label-placement": "left",
                                "label-width": "auto",
                                "show-feedback": false
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_NFormItem, {
                                    label: "默认删除源文件",
                                    path: "oldButton.deleteSource"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).oldButton.deleteSource,
                                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => vue.unref(settingsRef).oldButton.deleteSource = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 512)
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_NTabPane, {
                            name: "otherSeetting",
                            tab: "其他设置"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_NForm, {
                                ref: "formRef",
                                "label-placement": "left",
                                "label-width": "auto",
                                "show-feedback": false
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_NFormItem, {
                                    label: "火狐默认在身份组内打开标签",
                                    path: "openNewTab.setParent"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_NSwitch, {
                                        value: vue.unref(settingsRef).openNewTab.setParent,
                                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => vue.unref(settingsRef).openNewTab.setParent = $event)
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 512)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["show"])
            ]),
            _: 1
          }, 8, ["theme"])
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const Setting = _export_sfc(_sfc_main$6, [["__scopeId", "data-v-83bc69cf"]]);
  const _sfc_main$5 = vue.defineComponent({
    __name: "CloudDownload",
    setup(__props) {
      const theme = useTheme();
      const options = [
        {
          label: "云下载",
          key: "CloudDownload"
        }
      ];
      const bc = new BroadcastChannel("115Plus");
      const handleSelect = (option) => {
        if (option === "CloudDownload") {
          bc.postMessage({
            type: "CloudDownload",
            url: window.top?.location.href
          });
        }
      };
      const handleDownload = () => {
        bc.postMessage({
          type: "OfflineDownload",
          url: window.top?.location.href
        });
      };
      return (_ctx, _cache) => {
        const _component_NButton = naiveUi.NButton;
        const _component_NDropdown = naiveUi.NDropdown;
        const _component_NConfigProvider = naiveUi.NConfigProvider;
        return vue.openBlock(), vue.createBlock(_component_NConfigProvider, { theme: vue.unref(theme),"theme-overrides": globalThemeOverrides }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_NDropdown, {
              trigger: "hover",
              options,
              onSelect: handleSelect
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_NButton, { onClick: handleDownload }, {
                  default: vue.withCtx(() => [..._cache[0] || (_cache[0] = [
                    vue.createTextVNode("离线下载", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["theme"]);
      };
    }
  });
  const indexMinCss = '@charset "UTF-8";.xgplayer-fullscreen-parent{position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999}.xgplayer-fullscreen-parent .xgplayer.xgplayer-is-cssfullscreen,.xgplayer-fullscreen-parent .xgplayer.xgplayer-is-fullscreen{z-index:10;position:absolute}.xgplayer-rotate-parent{position:fixed;inset:0 0 0 100%;width:100vh;height:100vw;z-index:9999;transform-origin:top left;transform:rotate(90deg)}.xgplayer-rotate-parent .xgplayer.xgplayer-rotate-fullscreen{position:absolute;top:0;left:0;z-index:10;margin:0;padding:0;width:100%;height:100%;transform:rotate(0)}.xgplayer-rotate-parent .xgplayer-mobile video{z-index:-1}.xgplayer{position:relative;width:100%;height:100%;overflow:hidden;font-family:PingFang SC,Helvetica Neue,Helvetica,STHeiTi,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;font-size:14px;font-weight:400;background:#000;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer}.xgplayer *{margin:0;padding:0;border:0;vertical-align:baseline;white-space:normal;word-wrap:normal;overflow-wrap:normal}.xgplayer ul,.xgplayer li{list-style:none}.xgplayer .xgplayer-none{display:none}.xgplayer.xgplayer-is-fullscreen{position:fixed;top:0;left:0;width:100%;height:100%;margin:0;padding:0;z-index:9999}.xgplayer.xgplayer-is-cssfullscreen{position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999}.xgplayer.xgplayer-rotate-fullscreen{position:fixed;inset:0 0 0 100%;width:100vh;height:100vw;transform-origin:top left;transform:rotate(90deg);z-index:9999}.xgplayer.xgplayer-rotate-fullscreen.xgplayer-mobile video{z-index:-1}.xgplayer xg-video-container.xg-video-container{position:absolute;top:0;bottom:48px;display:block;width:100%}.xgplayer video{position:absolute;top:0;left:0;width:100%;height:100%;outline:none}.xgplayer[data-xgfill=contain] video{-o-object-fit:contain;object-fit:contain}.xgplayer[data-xgfill=cover] video{-o-object-fit:cover;object-fit:cover}.xgplayer[data-xgfill=fill] video{-o-object-fit:fill;object-fit:fill}.xgplayer .xg-pos{left:10px;right:10px}.xgplayer .xg-margin{margin-left:16px;margin-right:16px}.xgplayer .xg-bottom{bottom:0}.xgplayer .btn-text{position:relative;top:50%;height:24px;font-size:13px;text-align:center}.xgplayer .btn-text span{display:inline-block;min-width:52px;height:24px;line-height:24px;background:#00000061;border-radius:12px}.xgplayer xg-icon{position:relative;box-sizing:border-box;height:40px;margin-left:16px;margin-right:16px;cursor:pointer;color:#fffc;fill:#fff}.xgplayer xg-icon.xg-icon-disable{cursor:not-allowed}.xgplayer xg-icon .xg-tips{top:-30px;left:50%;transform:translate(-50%)}.xgplayer xg-icon:active .xg-tips,.xgplayer xg-icon:hover .xg-tips{display:block}.xgplayer xg-icon:active .xg-tips.hide,.xgplayer xg-icon:hover .xg-tips.hide{display:none}.xgplayer xg-icon .xgplayer-icon{position:relative;top:50%;transform:translateY(-50%);cursor:pointer}.xgplayer xg-icon .xg-icon-disable{cursor:not-allowed}.xgplayer xg-icon .xg-img{width:100%}.xgplayer xg-icon svg,.xgplayer xg-icon img{height:100%;display:block}.xgplayer xg-bar{display:block}.xgplayer.xgplayer-inactive xg-bar,.xgplayer.xgplayer-mini xg-bar{display:none}.xgplayer.xgplayer-inactive .xg-top-bar{display:flex}.xgplayer.xgplayer-inactive .xg-top-bar.top-bar-autohide{display:none}.xgplayer .xg-top-bar{position:absolute;z-index:10;top:0;padding:0 16px;display:flex;height:50px}.xgplayer .xg-top-bar xg-icon{position:relative;top:10px;left:0;width:34px;margin-top:0}.xgplayer .xg-top-bar xg-icon:first-child{margin-left:0}.xgplayer .xg-left-bar,.xgplayer .xg-right-bar{position:absolute;z-index:9;top:50px;bottom:50px;width:50px}.xgplayer .xg-left-bar{left:0}.xgplayer .xg-right-bar{right:0}.xgplayer .xg-tips{display:none;position:absolute;padding:4px 6px;background:#0000008a;border-radius:4px;font-size:12px;color:#fff;text-align:center;white-space:nowrap;opacity:.85}.xgplayer .xg-margin{left:0;right:0}.xgplayer-mobile{-webkit-tap-highlight-color:rgba(0,0,0,0)}.xgplayer-mobile *{text-decoration:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.xgplayer-mobile.xgplayer-rotate-fullscreen .xg-top-bar,.xgplayer-mobile.xgplayer-rotate-fullscreen .xg-pos{left:6%;right:6%}.xgplayer-mobile xg-icon:hover .xg-tips{display:none}.xg-list-slide-scroll::-webkit-scrollbar-track{background-color:transparent;display:none}.xg-list-slide-scroll:hover::-webkit-scrollbar-track{display:block}.xg-list-slide-scroll::-webkit-scrollbar{-webkit-appearance:none;appearance:none;background:#0000;height:4px;width:4px}.xg-list-slide-scroll::-webkit-scrollbar-corner{background:transparent;display:none}.xg-list-slide-scroll::-webkit-scrollbar-thumb{background:#ffffff80;border-radius:3px;display:none;width:4px}.xg-list-slide-scroll:hover::-webkit-scrollbar-thumb{display:block}@media only screen and (max-width:480px){.xgplayer-mobile xg-icon{margin-right:10px;margin-left:10px}.xgplayer-mobile .xg-top-bar{left:10px;right:10px}}@media screen and (orientation:portrait){.xgplayer-mobile.xgplayer-is-fullscreen .xgplayer-controls,.xgplayer-mobile.xgplayer-is-cssfullscreen .xgplayer-controls{bottom:34px;bottom:constant(safe-area-inset-bottom);bottom:env(safe-area-inset-bottom)}.xgplayer-mobile.xgplayer-is-fullscreen .xg-top-bar,.xgplayer-mobile.xgplayer-is-cssfullscreen .xg-top-bar{top:34px;top:constant(safe-area-inset-top);top:env(safe-area-inset-top)}}@media only screen and (orientation:landscape){.xgplayer-mobile.xgplayer-is-fullscreen .xg-top-bar,.xgplayer-mobile.xgplayer-is-fullscreen .xg-pos{left:6%;right:6%}.xgplayer-mobile.xgplayer-rotate-fullscreen{left:0;width:100vw;height:100vh;transform:rotate(0)}}.xgplayer .xgplayer-screen-container{display:block;width:100%}.xgplayer .xg-options-icon{display:none;cursor:pointer}.xgplayer .xg-options-icon.show{display:block}@keyframes xg_right_options_active{0%{transform:translate(50%)}to{transform:translate(-50%)}}@keyframes xg_right_options_hide{0%{transform:translate(-50%)}to{transform:translate(50%)}}@keyframes xg_left_options_active{0%{transform:translate(-50%)}to{transform:translate(50%)}}@keyframes xg_left_options_hide{0%{transform:translate(50%)}to{transform:translate(-50%)}}.xgplayer .xg-options-list{display:none;position:absolute;z-index:5;width:78px;right:50%;bottom:100%;background:#0000008a;border-radius:1px;transform:translate(50%);cursor:pointer;overflow:auto;height:0;opacity:.85;font-size:14px;color:#fffc}.xgplayer .xg-options-list li{height:20px;line-height:20px;position:relative;padding:4px 0;text-align:center;color:#fffc}.xgplayer .xg-options-list li:hover,.xgplayer .xg-options-list li.selected{color:red;opacity:1}.xgplayer .xg-options-list li:nth-child(1){position:relative;margin-top:12px}.xgplayer .xg-options-list li:last-child{position:relative;margin-bottom:12px}.xgplayer .xg-options-list:hover{opacity:1}.xgplayer .xg-options-list.active{display:block;height:auto}.xgplayer .xg-options-list.xg-side-list{width:20%;height:100%;bottom:0;background:#000000e6;display:flex;flex-direction:column;box-sizing:border-box}.xgplayer .xg-options-list.xg-side-list li{flex:1;width:100%;padding:0;position:relative}.xgplayer .xg-options-list.xg-side-list li span{display:block;position:relative;top:50%;transform:translateY(-50%);pointer-events:none}.xgplayer .xg-options-list.xg-side-list li:nth-child(1){margin-top:20px}.xgplayer .xg-options-list.xg-side-list li:last-child{margin-bottom:20px}.xgplayer .xg-options-list.xg-right-side{right:-10.5%}.xgplayer .xg-options-list.xg-right-side.active{height:100%;animation:xg_right_options_active .2s ease-out forwards}.xgplayer .xg-options-list.xg-right-side.hide{height:100%;animation:xg_right_options_hide .2s ease-in forwards}.xgplayer .xg-options-list.xg-left-side{left:-10.5%;transform:translate(-50%)}.xgplayer .xg-options-list.xg-left-side.active{height:100%;animation:xg_left_options_active .2s ease-out forwards}.xgplayer .xg-options-list.xg-left-side.hide{height:100%;animation:xg_left_options_hide .2s ease-in forwards}@media only screen and (max-width:480px){.xgplayer-mobile .xg-options-icon.portrait{display:none}.xgplayer-mobile .xg-options-list li:hover{color:#fffc}.xgplayer-mobile .xg-options-list li.selected{color:red}}.xgplayer.not-allow-autoplay .xgplayer-controls,.xgplayer.xgplayer-nostart .xgplayer-controls,.xgplayer.xgplayer-inactive .controls-autohide{pointer-events:none;visibility:hidden;cursor:default;opacity:0}.xgplayer.not-allow-autoplay .xgplayer-controls-initshow,.xgplayer.xgplayer-nostart .xgplayer-controls-initshow{pointer-events:auto;visibility:visible;opacity:1}.xgplayer .xgplayer-controls{display:block;position:absolute;visibility:visible;height:48px;left:0;right:0;bottom:0;opacity:1;z-index:10;background-image:linear-gradient(180deg,transparent,rgba(0,0,0,.37),rgba(0,0,0,.75),rgba(0,0,0,.75));transition:opacity .5s ease,visibility .5s ease}.xgplayer .xgplayer-controls.show{display:block;opacity:1;visibility:visible;pointer-events:auto}.xgplayer .xg-inner-controls{position:absolute;height:40px;bottom:0;justify-content:space-between;display:flex}.xgplayer .xg-left-grid,.xgplayer .xg-right-grid{position:relative;display:flex;flex-wrap:wrap;flex-shrink:1;height:100%;z-index:1}.xgplayer .xg-right-grid{flex-direction:row-reverse}.xgplayer .xg-right-grid>:first-child{margin-right:0}.xgplayer .xg-right-grid xg-icon{margin-left:0}.xgplayer .xg-left-grid>:first-child{margin-left:0}.xgplayer .xg-left-grid xg-icon{margin-right:0}.xgplayer .xg-center-grid{display:block;position:absolute;left:0;right:0;outline:none;top:-20px;padding:5px 0;text-align:center}.xgplayer .flex-controls .xg-inner-controls{justify-content:space-around;display:flex;bottom:8px}.xgplayer .flex-controls .xg-center-grid{display:flex;flex:1;position:relative;top:0;height:100%;justify-content:space-between;align-items:center;left:0;right:0;padding:0 16px}.xgplayer.xgplayer-mobile .xg-center-grid{z-index:2}.xgplayer.xgplayer-mobile .flex-controls .xg-center-grid{padding:0 8px}.xgplayer .bottom-controls .xg-center-grid{top:20px;padding:0}.xgplayer .bottom-controls .xg-left-grid,.xgplayer .bottom-controls .xg-right-grid{bottom:10px}.xgplayer .mini-controls{background-image:none}.xgplayer .mini-controls .xg-inner-controls{bottom:0;left:0;right:0}.xgplayer .mini-controls .xg-center-grid{bottom:-28px;top:auto;padding:0}.xgplayer .mini-controls .xg-left-grid,.xgplayer .mini-controls .xg-right-grid{display:none}.xgplayer .controls-follow{bottom:70px;transition:bottom .3s ease}.xgplayer.flex-controls .controls-follow{bottom:45px}.xgplayer.xgplayer-inactive .controls-follow,.xgplayer.no-controls .controls-follow,.xgplayer.mini-controls .controls-follow{bottom:10px}.xgplayer .xgplayer-cssfullscreen .xg-get-cssfull{display:block}.xgplayer .xgplayer-cssfullscreen .xg-exit-cssfull,.xgplayer .xgplayer-cssfullscreen[data-state=full] .xg-get-cssfull{display:none}.xgplayer .xgplayer-cssfullscreen[data-state=full] .xg-exit-cssfull{display:block}.xgplayer .xgplayer-fullscreen .xg-exit-fullscreen{display:none}.xgplayer .xgplayer-fullscreen .xg-get-fullscreen,.xgplayer .xgplayer-fullscreen[data-state=full] .xg-exit-fullscreen{display:block}.xgplayer .xgplayer-fullscreen[data-state=full] .xg-get-fullscreen{display:none}.xgplayer .xg-top-bar .xgplayer-back{position:relative;left:0;top:16px;width:34px;height:40px;display:none}.xgplayer .xg-top-bar .xgplayer-back.show{display:block}.xgplayer .xgplayer-play .xg-icon-play{display:none}.xgplayer .xgplayer-play .xg-icon-pause,.xgplayer .xgplayer-play[data-state=pause] .xg-icon-play{display:block}.xgplayer .xgplayer-play[data-state=pause] .xg-icon-pause{display:none}.xgplayer .xgplayer-progress{display:flex;align-items:center;position:relative;min-width:10px;height:20px;left:0;right:0;top:0;outline:none;flex:1;cursor:pointer}.xgplayer .xgplayer-progress-outer{position:relative;width:100%;height:2px;border-radius:3px;cursor:pointer}.xgplayer .progress-list{display:flex;height:100%;width:100%;border-radius:inherit}.xgplayer .xgplayer-progress-inner{position:relative;flex:1;height:100%;background:#ffffff4d;transition:height .2s ease-in,opacity .2s ease-out;border-radius:inherit;margin-right:2px;pointer-events:none}.xgplayer .xgplayer-progress-inner:last-child,.xgplayer .xgplayer-progress-inner:only-child{margin-right:0}.xgplayer .inner-focus-point{background:#fff;position:relative}.xgplayer .inner-focus-point:before,.xgplayer .inner-focus-point:after{position:absolute;content:" ";display:block;width:2px;height:300%;top:50%;z-index:1;transform:translateY(-50%);border-radius:3px;background:#fff}.xgplayer .inner-focus-point:before{left:0}.xgplayer .inner-focus-point:after{right:0}.xgplayer .xgplayer-progress-cache,.xgplayer .xgplayer-progress-played{display:block;height:100%;width:0;position:absolute;top:0;left:0;border-radius:inherit}.xgplayer .xgplayer-progress-played{background:linear-gradient(-90deg,#fa1f41,#e31106)}.xgplayer .xgplayer-progress-cache{background:#ffffff80}.xgplayer .xgplayer-progress-btn{display:block;background:#ff5e5e4e;border:.5px solid rgba(255,94,94,.056545);box-shadow:0 0 1px #ff000062;width:20px;height:20px;border-radius:30px;left:0;top:50%;position:absolute;z-index:1;transform:translate(-50%,-50%);box-sizing:border-box;pointer-events:none}.xgplayer .xgplayer-progress-btn:before{content:" ";display:block;position:relative;width:12px;height:12px;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:30px;background:#fff}.xgplayer .xgplayer-progress-btn.active{border:4px solid rgba(255,94,94,.064057)}.xgplayer .xgplayer-progress-btn.active:before{box-shadow:0 0 3px #f85959b0}.xgplayer .xgplayer-progress-dot{display:inline-block;position:absolute;height:100%;width:5px;top:0;background:#fff;border-radius:6px;z-index:16}.xgplayer .xgplayer-progress-dot .xgplayer-progress-tip{position:absolute;left:25%;top:-40px;height:auto;line-height:30px;width:auto;transform:scale(.8) translate(-50%);background:#0000004d;border-radius:6px;border:1px solid rgba(0,0,0,.8);cursor:default;white-space:nowrap;display:none}.xgplayer .xgplayer-progress-dot:hover .xgplayer-progress-tip{display:block}.xgplayer .flex-controls .xgplayer-progress{transform:translateY(0)}.xgplayer.xgplayer-pc .xgplayer-progress-btn{transform:translate(-50%,-50%) scale(0)}.xgplayer.xgplayer-pc .xgplayer-progress-outer{height:3px}.xgplayer.xgplayer-pc .xgplayer-progress-inner{margin-right:4px}.xgplayer.xgplayer-pc .xgplayer-progress-inner:last-child,.xgplayer.xgplayer-pc .xgplayer-progress-inner:only-child{margin-right:0}.xgplayer.xgplayer-pc .inner-focus-point:before,.xgplayer.xgplayer-pc .inner-focus-point:after{width:3px}.xgplayer.xgplayer-pc .inner-focus-highlight{background:#fffc}.xgplayer.xgplayer-pc .xgplayer-progress.active .xgplayer-progress-outer{height:6px;margin-bottom:3px;transition:height .3s ease,margin-bottom .3s ease}.xgplayer.xgplayer-pc .xgplayer-progress.active .xgplayer-progress-btn{transform:translate(-50%,-50%) scale(1)}.xgplayer.xgplayer-pc .xgplayer-progress.active .inner-focus-point:before,.xgplayer.xgplayer-pc .xgplayer-progress.active .inner-focus-point:after{width:6px}.xgplayer .xgplayer-progress-bottom .xgplayer-progress-outer{top:9px}.xgplayer .xgplayer-progress-bottom .xgplayer-progress-btn:before{height:6px;width:6px}.xgplayer.xgplayer-mobile .xgplayer-progress-bottom .xgplayer-progress-outer{height:4px}@media(prefers-color-scheme:dark){.xgplayer .xgplayer-progress .xgplayer-progress-inner{background-color:#ffffff4d}.xgplayer .xgplayer-progress .inner-focus-highlight{background:#fffc}.xgplayer .xgplayer-progress .xgplayer-progress-btn{background:#ff5e5e4e;border:.5px solid rgba(255,94,94,.056545);box-shadow:0 0 1px #ff000062}.xgplayer .xgplayer-progress .xgplayer-progress-btn:before{background-color:#fff}.xgplayer .xgplayer-progress .xgplayer-progress-played{background-color:linear-gradient(-90deg,#FA1F41 0%,#E31106 100%)}.xgplayer .xgplayer-progress .xgplayer-progress-cache{background-color:#ffffff80}}.xg-mini-progress{display:none;position:absolute;height:2px;left:0;right:0;bottom:0;pointer-events:none}.xg-mini-progress xg-mini-progress-played,.xg-mini-progress xg-mini-progress-cache{height:100%;width:0;position:absolute;top:0;left:0;border-radius:inherit}.xg-mini-progress xg-mini-progress-played{background:linear-gradient(-90deg,#fa1f41,#e31106)}.xg-mini-progress xg-mini-progress-cache{background:#ffffff80}.xg-mini-progress-show,.xgplayer-inactive .xg-mini-progress,.xgplayer-mini .xg-mini-progress{display:block}.xgplayer .xgplayer-time{pointer-events:none;min-width:40px;font-size:14px;font-family:PingFangSC-Semibold;color:#fff;text-align:center;display:inline-block;line-height:40px}.xgplayer .xgplayer-time span{display:inline-block;line-height:40px;height:40px}.xgplayer .xgplayer-time span .time-min-width{text-align:center;min-width:2ch}.xgplayer .xgplayer-time span .time-min-width:first-child{text-align:right}.xgplayer .xgplayer-time span .time-min-width:last-child{text-align:left}.xgplayer .xgplayer-time .time-duration{color:#ffffff80}.xgplayer .xgplayer-time .time-live-tag{display:none}.xgplayer .xgplayer-time.xg-time-left{margin-left:0}.xgplayer .xgplayer-time.xg-time-right{margin-right:0}.xgplayer.xgplayer-mobile .xgplayer-time{min-width:30px;font-size:12px}.xgplayer.xgplayer-mobile .xgplayer-time.xg-time-left{margin-right:8px}.xgplayer.xgplayer-mobile .xgplayer-time.xg-time-right{margin-left:8px}.xgplayer .xgplayer-volume.slide-show .xgplayer-slider{display:block}.xgplayer .xgplayer-slider{display:none;position:absolute;width:28px;height:92px;background:#0000008a;border-radius:1px;bottom:40px;outline:none}.xgplayer .xgplayer-slider:after{content:" ";display:block;height:15px;width:28px;position:absolute;bottom:-15px;left:0;z-index:20;cursor:initial}.xgplayer .xgplayer-value-label{position:absolute;left:0;right:0;bottom:100%;padding:5px 0 0;font-size:12px;background-color:#0000008a;color:#fff;text-align:center}.xgplayer .xgplayer-bar,.xgplayer .xgplayer-drag{display:block;position:absolute;bottom:6px;left:12px;background:#ffffff4d;border-radius:100px;width:4px;height:76px;outline:none;cursor:pointer}.xgplayer .xgplayer-drag{bottom:0;left:0;background:#fa1f41;max-height:76px}.xgplayer .xgplayer-drag:after{content:" ";display:inline-block;width:8px;height:8px;background:#fff;box-shadow:0 0 5px #00000042;position:absolute;border-radius:50%;left:-2px;top:-4px}.xgplayer .xgplayer-volume[data-state=normal] .xg-volume{display:block}.xgplayer .xgplayer-volume[data-state=normal] .xg-volume-small,.xgplayer .xgplayer-volume[data-state=normal] .xg-volume-mute,.xgplayer .xgplayer-volume[data-state=small] .xg-volume{display:none}.xgplayer .xgplayer-volume[data-state=small] .xg-volume-small{display:block}.xgplayer .xgplayer-volume[data-state=small] .xg-volume-mute,.xgplayer .xgplayer-volume[data-state=mute] .xg-volume,.xgplayer .xgplayer-volume[data-state=mute] .xg-volume-small{display:none}.xgplayer .xgplayer-volume[data-state=mute] .xg-volume-mute{display:block}.xgplayer.xgplayer-mobile .xgplayer-volume .xgplayer-slider,.xgplayer-replay{display:none}.xgplayer .xgplayer-replay{display:none;position:absolute;left:50%;top:50%;width:100px;height:100px;justify-content:center;align-items:center;flex-direction:column;z-index:5;transform:translate(-50%,-50%);cursor:pointer}.xgplayer .xgplayer-replay .xgplayer-replay-txt{display:inline-block;font-size:14px;color:#fff;line-height:34px;text-align:center}.xgplayer.xgplayer-mobile .xgplayer-replay-svg{width:50px;height:50px}.xgplayer.xgplayer-mobile .xgplayer-replay-txt{line-height:24px;font-size:12px}.xgplayer .xgplayer-poster{display:block;opacity:1;visibility:visible;position:absolute;left:0;top:0;width:100%;height:100%;background-position:center center;background-size:100% auto;background-repeat:no-repeat;transition:opacity .3s ease,visibility .3s ease;pointer-events:none}.xgplayer .xgplayer-poster.hide,.xgplayer.xgplayer-playing .xgplayer-poster{opacity:0;visibility:hidden}.xgplayer.xgplayer-playing .xg-not-hidden,.xgplayer.xgplayer-is-enter .xgplayer-poster.xg-showplay,.xgplayer.xgplayer-playing .xgplayer-poster.xg-showplay,.xgplayer.xgplayer-nostart .xgplayer-poster,.xgplayer.xgplayer-ended .xgplayer-poster,.xgplayer.not-allow-autoplay .xgplayer-poster{opacity:1;visibility:visible}.xgplayer.xgplayer-nostart .xgplayer-poster.hide,.xgplayer.xgplayer-ended .xgplayer-poster.hide,.xgplayer.not-allow-autoplay .xgplayer-poster.hide{opacity:0;visibility:hidden}@keyframes playPause{0%{transform:scale(1);opacity:1}99%{transform:scale(1.3);opacity:0}to{transform:scale(1);opacity:0}}.xgplayer xg-start-inner{display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;background:#00000061}.xgplayer .xgplayer-start{width:70px;height:70px;position:absolute;left:50%;top:50%;z-index:5;transform:translate(-50%,-50%);cursor:pointer}.xgplayer .xgplayer-start svg{width:100%;height:100%}.xgplayer .xgplayer-start.hide,.xgplayer .xgplayer-start.focus-hide{display:none;pointer-events:none}.xgplayer .xgplayer-start:hover{opacity:.85}.xgplayer .xgplayer-start .xg-icon-play{display:block}.xgplayer .xgplayer-start .xg-icon-pause,.xgplayer .xgplayer-start[data-state=pause] .xg-icon-play{display:none}.xgplayer .xgplayer-start[data-state=pause] .xg-icon-pause,.xgplayer .xgplayer-start.interact{display:block}.xgplayer .xgplayer-start.interact xg-start-inner{animation:playPause .4s .1s ease-out forwards}.xgplayer .xgplayer-start.show{display:block}.xgplayer.xgplayer-mobile xg-start-inner{background:initial;border-radius:0}.xgplayer.xgplayer-mobile .xgplayer-start{height:50px;width:50px}.xgplayer.xgplayer-mobile .xgplayer-start:hover{opacity:1}.xgplayer.xgplayer-inactive .xgplayer-start.auto-hide,.xgplayer.xgplayer-is-enter .xgplayer-start.auto-hide,.xgplayer.xgplayer-isloading.xgplayer-playing .xgplayer-start,.xgplayer.xgplayer-is-enter .xgplayer-start,.xgplayer.xgplayer-is-error .xgplayer-start,.xgplayer.xgplayer-is-enter .xgplayer-start.show,.xgplayer.xgplayer-is-error .xgplayer-start.show{display:none}.xgplayer-enter{display:none;position:absolute;left:0;top:0;width:100%;height:100%;background:#000c;z-index:5;pointer-events:none}.xgplayer-enter .show{display:block}.xgplayer-enter .xgplayer-enter-spinner{display:block;position:absolute;z-index:1;left:50%;top:50%;height:100px;width:100px;transform:translate(-50%,-50%)}.xgplayer-enter .xgplayer-enter-spinner div{width:6%;height:13%;background-color:#ffffffb3;position:absolute;left:45%;top:45%;opacity:0;border-radius:30px;animation:fade 1s linear infinite}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar1{transform:rotate(0) translateY(-140%);animation-delay:-0s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar2{transform:rotate(30deg) translateY(-140%);animation-delay:-.9163s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar3{transform:rotate(60deg) translateY(-140%);animation-delay:-.833s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar4{transform:rotate(90deg) translateY(-140%);animation-delay:-.7497s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar5{transform:rotate(120deg) translateY(-140%);animation-delay:-.6664s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar6{transform:rotate(150deg) translateY(-140%);animation-delay:-.5831s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar7{transform:rotate(180deg) translateY(-140%);animation-delay:-.4998s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar8{transform:rotate(210deg) translateY(-140%);animation-delay:-.4165s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar9{transform:rotate(240deg) translateY(-140%);animation-delay:-.3332s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar10{transform:rotate(270deg) translateY(-140%);animation-delay:-.2499s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar11{transform:rotate(300deg) translateY(-140%);animation-delay:-.1666s}.xgplayer-enter .xgplayer-enter-spinner div.xgplayer-enter-bar12{transform:rotate(330deg) translateY(-142%);animation-delay:-.0833s}@keyframes fade{0%{opacity:1}to{opacity:.25}}.xgplayer.xgplayer-is-enter .xgplayer-enter{display:block;opacity:1;transition:opacity .3s}.xgplayer.xgplayer-nostart .xgplayer-enter{display:none}.xgplayer.xgplayer-mobile .xgplayer-enter .xgplayer-enter-spinner{width:70px;height:70px}.xg-mini-layer{display:none;position:absolute;top:0;left:0;width:100%;height:100%;z-index:11;background:linear-gradient(180deg,#393939e6,#39393900 50.27%)}.xg-mini-layer .mask{pointer-events:none;position:absolute;top:0;left:0;height:100%;width:100%;background-color:#0006}.xg-mini-layer xg-mini-header{display:flex;top:0;left:0;right:40px;box-sizing:border-box;padding:10px 3px 0 8px;justify-content:space-between;color:#fff;font-size:14px;position:absolute;z-index:22}.xg-mini-layer xg-mini-header .xgplayer-pip-disableBtn{pointer-events:all}.xg-mini-layer xg-mini-header #disabledMini{display:none;position:relative}.xg-mini-layer xg-mini-header #disabledMini+label{cursor:pointer;position:relative;display:flex;align-items:center}.xg-mini-layer xg-mini-header #disabledMini+label:before{content:"";color:#ff142b;background-color:transparent;border-radius:2px;border:solid 1px #cdcdcd;width:16px;height:16px;display:inline-block;text-align:center;vertical-align:middle;line-height:16px;margin-right:7px}.xg-mini-layer xg-mini-header #disabledMini:checked+label{color:#ff142b}.xg-mini-layer xg-mini-header #disabledMini:checked+label:before{border-color:#ff142b}.xg-mini-layer xg-mini-header #disabledMini:checked+label:after{content:"";position:absolute;width:4px;height:8px;border-color:#ff142b;border-style:solid;border-width:0px 2px 2px 0px;transform:rotate(45deg);left:6px;top:5px}.xg-mini-layer xg-mini-header .xgplayer-mini-disableBtn xg-tips{position:absolute;padding:4px 6px;white-space:nowrap;bottom:-30px;right:15px;border-radius:4px;background-color:#0000008a;display:none}.xg-mini-layer xg-mini-header .xgplayer-mini-disableBtn:hover #disabledMini+label:before{border-color:#ff142b}.xg-mini-layer xg-mini-header .xgplayer-mini-disableBtn:hover #disabledMini+label{color:#ff142b}.xg-mini-layer xg-mini-header .xgplayer-mini-disableBtn:hover xg-tips{display:block}.xg-mini-layer .mini-cancel-btn{cursor:pointer;display:block;color:#fff;width:40px;height:38px;position:absolute;right:0;top:0;text-align:center;line-height:38px}.xg-mini-layer .play-icon{cursor:pointer;height:48px;width:48px;position:absolute;background:#0000008a;border-radius:24px;top:50%;left:50%;margin:-24px 0 0 -24px}.xg-mini-layer .play-icon svg,.xg-mini-layer .play-icon img{width:50px;height:50px;fill:#faf7f7}.xg-mini-layer .xg-icon-play{display:none}.xg-mini-layer .xg-icon-pause,.xg-mini-layer[data-state=pause] .xg-icon-play{display:block}.xg-mini-layer[data-state=pause] .xg-icon-pause{display:none}.xgplayer-miniicon{position:relative;outline:none;display:block}.xgplayer-miniicon .name{text-align:center;font-size:13px;line-height:20px;height:20px;color:#fffc;line-height:40px}.xgplayer-miniicon .name span{font-size:13px;width:60px;height:20px;line-height:20px;background:#00000061;border-radius:10px;display:inline-block;vertical-align:middle}.xgplayer-mini{position:fixed;width:320px;height:180px;z-index:91;box-shadow:0 4px 7px 2px #0003}.xgplayer-mini:hover{cursor:move}.xgplayer-mini:hover .xg-mini-layer{display:block}.xgplayer-mini.xgplayer-ended .xg-mini-layer{display:none}.xgplayer-mobile .xg-mini-layer .play-icon{background:none;border-radius:initial}.xgplayer.xgplayer-inactive{cursor:none}.xgplayer xg-thumbnail{display:block}.xgplayer xg-trigger{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:absolute;top:0;left:0;height:100%;width:100%}.xgplayer xg-trigger .time-preview{display:none;position:absolute;width:200px;margin:0 auto;padding:0 20px 30px;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;text-shadow:0 0 1px rgba(0,0,0,.54);font-size:18px;text-align:center;pointer-events:none}.xgplayer xg-trigger .time-preview span{line-height:24px}.xgplayer xg-trigger .time-preview .xg-cur{color:red}.xgplayer xg-trigger .time-preview .xg-separator{font-size:14px}.xgplayer xg-trigger .time-preview .xg-seek-show{transform:translate(-10px)}.xgplayer xg-trigger .time-preview .xg-seek-show.xg-back .xg-seek-pre{transform:rotate(180deg) translate(-5px)}.xgplayer xg-trigger .time-preview .xg-seek-show.hide-seek-icon .xg-seek-icon{display:none}.xgplayer xg-trigger .time-preview .xg-bar{width:96px;height:2px;margin:8px auto 0;border-radius:10px;box-sizing:content-box;background:#ffffff4d}.xgplayer xg-trigger .time-preview .xg-bar .xg-curbar{width:0;height:100%;background-color:red}.xgplayer xg-trigger .time-preview .xg-bar.hide{display:none}.xgplayer xg-trigger .mobile-thumbnail{position:relative;left:50%;transform:translate(-50%)}.xgplayer xg-trigger .xg-top-note{position:absolute;height:32px;width:135px;top:26px;left:50%;margin-left:-78px;background:#0000004d;border-radius:100px;color:#fff}.xgplayer xg-trigger .xg-top-note span{display:block;line-height:32px;height:32px;font-size:13px;text-align:center}.xgplayer xg-trigger .xg-top-note i{color:red;margin:0 5px}.xgplayer xg-trigger .xg-playbackrate{display:none}.xgplayer xg-trigger[data-xg-action=seeking] .time-preview{display:block}.xgplayer xg-trigger[data-xg-action=playbackrate] .xg-playbackrate{display:block}.xgplayer .gradient{display:none;position:absolute;top:0;left:0;height:100%;width:100%;pointer-events:none;background-image:linear-gradient(#0009,#0000005c 20%,#0000 36% 70%,#0000003d 77%,#0000005c 83%,#0009)}.xgplayer .gradient.top{background-image:linear-gradient(#0009,#0000005c 20%,#0000 36% 70%)}.xgplayer .gradient.bottom{background-image:linear-gradient(#0000 70%,#0000003d 77%,#0000005c 83%,#0009)}.xgplayer .gradient.none,.xgplayer-mobile .xgplayer-controls{background-image:initial}.xgplayer-mobile.xgplayer-playing .gradient{display:block}.xgplayer-mobile.xgplayer-inactive .gradient{background-image:initial}.xgplayer-mobile .xgmask{position:absolute;height:100%;z-index:10;top:0;left:0;width:100%;pointer-events:none;background-color:#0000}@media(prefers-color-scheme:dark){.xgplayer-mobile xg-trigger .time-preview{color:#fff}.xgplayer-mobile xg-trigger .time-preview span.xg-cur{color:red}.xgplayer-mobile xg-trigger .time-preview .xg-bar{background-color:#ffffff4d}.xgplayer-mobile xg-trigger .time-preview .xg-bar.xg-curbar{background-color:red}}@keyframes loadingRotate{0%{transform:rotate(0)}25%{transform:rotate(90deg)}50%{transform:rotate(180deg)}75%{transform:rotate(270deg)}to{transform:rotate(360deg)}}@keyframes loadingDashOffset{0%{stroke-dashoffset:236}to{stroke-dashoffset:0}}xg-loading-inner{display:block;height:100%;width:100%;transform-origin:center;animation:loadingRotate 1s .1s linear infinite}.xgplayer-loading{display:none;width:70px;height:70px;overflow:hidden;position:absolute;z-index:10;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none}.xgplayer-loading svg,.xgplayer-loading img{width:100%;height:100%}.xgplayer-mobile .xgplayer-loading{width:50px;height:50px}.xgplayer-isloading .xgplayer-loading{display:block}.xgplayer-nostart .xgplayer-loading,.xgplayer-pause .xgplayer-loading,.xgplayer-is-enter .xgplayer-loading,.xgplayer-is-ended .xgplayer-loading,.xgplayer-is-error .xgplayer-loading,.xgplayer .xgplayer-pip .xg-exit-pip{display:none}.xgplayer .xgplayer-pip .xg-get-pip,.xgplayer .xgplayer-pip[data-state=pip] .xg-exit-pip{display:block}.xgplayer .xgplayer-pip[data-state=pip] .xg-get-pip{display:none}.xgplayer .xgplayer-playnext{position:relative;display:none;cursor:pointer}.xgplayer .xgplayer-playnext .xgplayer-tips .xgplayer-tip-playnext{display:block}.xgplayer .xgplayer-playnext:hover{opacity:.85}.xgplayer .xgplayer-playnext:hover .xgplayer-tips{display:block}.lang-is-en .xgplayer-playnext .xgplayer-tips{margin-left:-25px}.lang-is-jp .xgplayer-playnext .xgplayer-tips{margin-left:-38px}.xgplayer .xgplayer-download{position:relative;display:block;cursor:pointer}.lang-is-en .xgplayer-download .xgplayer-tips{margin-left:-32px}.lang-is-jp .xgplayer-download .xgplayer-tips{margin-left:-40px}.xgplayer .xgplayer-shot{display:none}.xgplayer-definition{display:none;cursor:pointer}.xgplayer .xgplayer-playbackrate{display:none;cursor:default}.xgplayer-error{background:#000;display:none;position:absolute;left:0;top:0;width:100%;height:100%;z-index:6;color:#fff;text-align:center;line-height:100%;justify-content:center;align-items:center}.xgplayer-error .xgplayer-error-refresh{color:#fa1f41;padding:0 3px;cursor:pointer}.xgplayer-error .xgplayer-error-text{line-height:18px;margin:auto 6px 20px;display:block}.xgplayer-is-error .xgplayer-error{display:flex}.xgplayer .xgplayer-prompt{display:block;pointer-events:none;position:absolute;z-index:1;padding:6px 12px 5px;opacity:0;left:10px;background:#00000080;border-radius:50px;font-size:12px;line-height:17px;text-align:center;color:#fff}.xgplayer .xgplayer-prompt.show{display:block;opacity:1;z-index:10;pointer-events:initial}.xgplayer .xgplayer-prompt.arrow{transform:translate(-50%)}.xgplayer .xgplayer-prompt.arrow:after{content:"";display:block;position:absolute;left:50%;bottom:0;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid rgba(0,0,0,.5);transform:translate(-50%,100%)}.xgplayer .xgplayer-prompt .highlight{display:inline-block;margin-left:6px;color:red;cursor:pointer}.xgplayer.xgplayer-is-error .xgplayer-prompt.show{display:none;opacity:1}.xgplayer .xgplayer-spot{position:absolute;top:0;left:0;height:100%;background:#fff;border-radius:12px}.xgplayer .xgplayer-spot.mini{min-width:6px;transform:translate(-50%)}.xgplayer .xgplayer-spot.active .xgplayer-spot-pop{display:block;opacity:1;pointer-events:initial}.xgplayer .xgplayer-spot-pop{display:block;opacity:0;pointer-events:none;position:absolute;left:50%;bottom:5px;padding-bottom:5px;transform:translate(-50%)}.xgplayer-mobile .xgplayer-spot{height:3px;min-width:3px;top:50%;opacity:1;transform:translateY(-50%)}.xgplayer-mobile .xgplayer-spot.mini{min-width:3px;transform:translate(-50%,-50%)}.xgplayer .xgplayer-progress.active .xgplayer-spot{opacity:1;transition:opacity .3s;visibility:visible}.xgplayer .xg-spot-info{position:absolute;left:0;bottom:100%;display:none}.xgplayer .xg-spot-info.short-line .xg-spot-line{height:6px}.xgplayer .xg-spot-info.short-line .xg-spot-content{bottom:-4px}.xgplayer .xg-spot-info.no-thumbnail .xg-spot-thumbnail{display:none}.xgplayer .xg-spot-info.no-thumbnail .xgplayer-progress-point{display:block}.xgplayer .xg-spot-info.no-timepoint .xgplayer-progress-point,.xgplayer .xg-spot-info.hide{display:none}.xgplayer .xgplayer-progress.active .xg-spot-info{display:block}.xgplayer .xgplayer-progress.active .xg-spot-info.hide{display:none}.xgplayer .xg-spot-line{position:relative;bottom:-7px;margin-left:50%;display:block;width:1px;height:41px;background-color:#fff;pointer-events:none}.xgplayer .xgplayer-progress-point{display:none;position:relative;bottom:-4px;left:50%;transform:translate(-50%);background:#0000008a;font-size:11px;color:#fff;padding:4px 6px;border-radius:4px;text-align:center;opacity:.85;white-space:nowrap}.xgplayer .xg-spot-content{position:relative;bottom:-7px;color:#fff;border-radius:2px 2px 0 0}.xgplayer .xg-spot-ext-text{position:relative;bottom:-7px}.xgplayer .xg-spot-thumbnail{position:relative;background-color:#111010;pointer-events:none;border-radius:2px 2px 0 0}.xgplayer .xg-spot-time{position:absolute;bottom:2px;font-size:12px;line-height:16.8px;left:50%;transform:translate(-50%);pointer-events:none}.xgplayer .progress-thumbnail{margin:0 auto;display:block}.xgplayer .xg-spot-text{display:none;padding:5px 8px;background:#000c;border-radius:0 0 2px 2px;pointer-events:none;box-sizing:border-box}.xgplayer .spot-inner-text{overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:20px;font-size:12px;max-height:40px}.xgplayer .xg-spot-content.show-text .xg-spot-text{display:block}.xgplayer .product .xg-spot-text{background:#3370ff}.xgplayer .product .xg-spot-line{border-left:10px solid transparent;border-right:10px solid transparent;border-top:7px solid #3370FF;width:0;height:15px;left:-10px;background:none}.xgplayer .xgvideo-preview{position:absolute;width:100%;height:100%;top:0;left:0;opacity:0;visibility:hidden;transition:visibility .3s,opacity .3s;background-color:#000}.xgplayer .xgvideo-preview .xgvideo-thumbnail{position:relative;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:0}.xgplayer .xgvideo-preview.show{opacity:1;visibility:visible}.xgplayer-dynamic-bg,.xgplayer-dynamic-bg canvas,.xgplayer-dynamic-bg xgmask,.xgplayer-dynamic-bg xgfilter{display:block;position:absolute;top:0;left:0;height:100%;width:100%;pointer-events:none}.xgplayer-dynamic-bg canvas{transform:translateZ(0)}.xgplayer-dynamic-bg xgmask{background:#000000b3}';
  importCSS(indexMinCss);
    const _sfc_main$4 = vue.defineComponent({
    __name: "VideoModal",
    props: vue.mergeModels({
      data: {}
    }, {
      "show": {
        type: Boolean,
        default: false
      },
      "showModifiers": {}
    }),
    emits: ["update:show"],
    setup(__props) {
      const show = vue.useModel(__props, "show");
      const props = __props;
      const message2 = naiveUi.useMessage();
      const menuOptions = vue.ref([]);
      const menuValue = vue.ref("");
      const videoList = vue.ref([]);
      const videoRef = vue.useTemplateRef("videoRef");
      const player = vue.ref(null);
      const layoutHeight = vue.ref(700);
      const currentVideo = vue.ref(null);
      const { pause: pauseSaveTimer, resume: resumeSaveTimer } = useIntervalFn(
        () => {
          if (!player.value || !currentVideo.value || player.value.paused) return;
          if (!videoSettings.value.enableHistory) return;
          const currentTime = Math.floor(player.value.currentTime);
          if (currentTime && currentTime !== currentVideo.value.time) {
            currentVideo.value.time = currentTime;
            setVideoHistory(currentVideo.value.code, currentTime);
          }
        },
        5e3,
        { immediate: false }
      );
      const layoutHeightStyle = vue.computed(() => ({
        height: `${layoutHeight.value}px`
      }));
      const videoSettings = vue.computed(() => ({
        autoplay: settings?.video.autoplay ?? true,
        volume: settings?.video.volume ?? 1,
        defaultPlaybackRate: settings?.video.defaultPlaybackRate ?? 1,
        enableHistory: settings?.video.history ?? true
      }));
      vue.watch(show, (value) => {
        if (value) {
          initializeVideoList();
        }
      });
      const stopSaveTimer = () => {
        pauseSaveTimer();
        currentVideo.value = null;
      };
      const destroyPlayer = () => {
        if (player.value) {
          player.value.destroy();
          player.value = null;
        }
      };
      const initializeVideoList = () => {
        videoList.value = [...props.data];
        play();
      };
      const play = async () => {
        try {
          menuOptions.value = videoList.value.map((item) => ({
            label: item.name,
            key: item.code
          }));
          const firstVideo = videoList.value[0];
          if (!firstVideo) {
            throw new Error("视频列表为空");
          }
          await setupVideoForPlay(firstVideo);
          await createPlayer(firstVideo);
        } catch (error) {
          handleError("视频播放失败", error);
        }
      };
      const setupVideoForPlay = async (video) => {
        menuValue.value = video.code;
        video.url = await getVideoUrl(video.code);
        video.time = videoSettings.value.enableHistory ? await getVideoHistory(video.code) || 0 : 0;
      };
      const createPlayer = async (video) => {
        if (!videoRef.value || !video.url) {
          throw new Error("播放器容器或视频URL不可用");
        }
        const baseConfig = {
          el: videoRef.value,
          url: video.url,
          autoplay: videoSettings.value.autoplay,
          fluid: true,
          volume: videoSettings.value.volume,
          defaultPlaybackRate: videoSettings.value.defaultPlaybackRate,
          playbackRate: { list: [5, 4, 3, 2, 1.5, 1.25, 1, 0.75, 0.5] },
          rotate: true,
          pip: true,
          dynamicBg: { disable: false }
        };
        const canPlayHLS = document.createElement("video").canPlayType("application/vnd.apple.mpegurl");
        if (canPlayHLS) {
          player.value = new Player(baseConfig);
        } else if (HlsJsPlugin.isSupported()) {
          player.value = new Player({
            ...baseConfig,
            isLive: false,
            plugins: [HlsJsPlugin]
          });
        } else {
          throw new Error("浏览器不支持HLS播放");
        }
        setupPlayerEvents(video);
      };
      const setupPlayerEvents = (video) => {
        if (!player.value) return;
        if (videoSettings.value.enableHistory && video.time) {
          player.value.currentTime = video.time;
          startSaveTimer(video);
        }
        player.value.on(Player.Events.VIDEO_RESIZE, () => {
          layoutHeight.value = videoRef.value?.clientHeight || 700;
        });
      };
      const startSaveTimer = (video) => {
        stopSaveTimer();
        if (!videoSettings.value.enableHistory || !player.value) return;
        currentVideo.value = video;
        resumeSaveTimer();
      };
      const getVideoUrl = async (code) => {
        const res = await request({
          method: "GET",
          url: `https://webapi.115.com/files/video?pickcode=${code}&share_id=0&local=1`
        });
        if (res.status !== 200) {
          throw new Error("获取视频地址失败");
        }
        const json = JSON.parse(res.responseText);
        if (!json.state) {
          throw new Error(json.error || "获取视频地址失败");
        }
        if (!json.video_url) {
          throw new Error("视频地址获取失败");
        }
        const masterUrl = json.video_url.replace("http://", "https://");
        return await parseM3u8MasterPlaylist(masterUrl);
      };
      const parseM3u8MasterPlaylist = async (masterUrl) => {
        const res = await request({
          method: "GET",
          url: masterUrl
        });
        if (res.status !== 200) {
          throw new Error("获取视频流地址失败");
        }
        const m3u8Content = res.responseText;
        const lines = m3u8Content.split("\n");
        let bestUrl = "";
        let bestBandwidth = 0;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (!line) continue;
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("#EXT-X-STREAM-INF:")) {
            const bandwidthMatch = trimmedLine.match(/BANDWIDTH=(\d+)/);
            const bandwidth = bandwidthMatch && bandwidthMatch[1] ? parseInt(bandwidthMatch[1], 10) : 0;
            const nextLine = lines[i + 1]?.trim();
            if (nextLine && !nextLine.startsWith("#")) {
              if (bandwidth > bestBandwidth) {
                bestBandwidth = bandwidth;
                bestUrl = nextLine;
              }
            }
          }
        }
        if (!bestUrl) {
          return masterUrl;
        }
        return bestUrl;
      };
      const getVideoHistory = async (code) => {
        const res = await request({
          method: "GET",
          url: `https://webapi.115.com/files/history?pick_code=${code}&fetch=one&category=1&share_id=0`
        });
        const json = JSON.parse(res.responseText);
        if (!json.state) {
          if (json.error) {
            throw new Error(json.error);
          }
          return 0;
        }
        return json.data?.time || 0;
      };
      const setVideoHistory = async (code, time) => {
        request({
          method: "POST",
          url: "https://webapi.115.com/files/history",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: `op=update&pick_code=${code}&time=${time}&definition=0&category=1&share_id=0`
        });
      };
      const handleError = (title, error) => {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        message2.error(`${title}，错误信息：${errorMessage}`);
      };
      const handleVideoClose = () => {
        stopSaveTimer();
        destroyPlayer();
        show.value = false;
      };
      const handleMenuUpdate = async (value) => {
        try {
          if (!player.value) {
            throw new Error("播放器未初始化");
          }
          const videoIndex = videoList.value.findIndex((item) => item.code === value);
          const currentVideo2 = videoList.value[videoIndex];
          if (!currentVideo2) {
            throw new Error("找不到对应的视频");
          }
          if (!currentVideo2.url) {
            await setupVideoForPlay(currentVideo2);
          }
          await switchVideo(currentVideo2);
        } catch (error) {
          handleError("视频切换失败", error);
        }
      };
      const switchVideo = async (video) => {
        if (!player.value || !video.url) return;
        stopSaveTimer();
        player.value.src = video.url;
        if (videoSettings.value.autoplay) {
          player.value.play();
        }
        if (videoSettings.value.enableHistory && video.time) {
          player.value.currentTime = video.time;
          startSaveTimer(video);
        }
      };
      return (_ctx, _cache) => {
        const _component_NMenu = naiveUi.NMenu;
        const _component_NLayoutSider = naiveUi.NLayoutSider;
        const _component_NLayout = naiveUi.NLayout;
        const _component_NModal = naiveUi.NModal;
        return vue.openBlock(), vue.createBlock(_component_NModal, {
          show: show.value,
          "onUpdate:show": _cache[1] || (_cache[1] = ($event) => show.value = $event),
          style: { "width": "60%" },
          title: "视频播放",
          preset: "card",
          bordered: false,
          onAfterLeave: handleVideoClose
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_NLayout, {
              "has-sider": "",
              "content-style": vue.unref(layoutHeightStyle)
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_NLayoutSider, {
                  "native-scrollbar": false,
                  bordered: ""
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_NMenu, {
                      value: vue.unref(menuValue),
                      "onUpdate:value": [
                        _cache[0] || (_cache[0] = ($event) => vue.isRef(menuValue) ? menuValue.value = $event : null),
                        handleMenuUpdate
                      ],
                      options: vue.unref(menuOptions),
                      "theme-overrides": vue.unref(menuThemeOverrides)
                    }, null, 8, ["value", "options", "theme-overrides"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_NLayout, { "native-scrollbar": false }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("div", {
                      ref_key: "videoRef",
                      ref: videoRef,
                      class: "video-js"
                    }, null, 512)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["content-style"])
          ]),
          _: 1
        }, 8, ["show"]);
      };
    }
  });
  const _hoisted_1 = { style: { "display": "flex", "justify-content": "space-between" } };
  const _hoisted_2 = { style: { "display": "flex", "justify-content": "space-between" } };
  const _sfc_main$3 = vue.defineComponent({
    __name: "OfflineDownloadModal",
    props: vue.mergeModels({
      signData: {},
      downPath: {}
    }, {
      "show": {
        type: Boolean,
        default: false
      },
      "showModifiers": {}
    }),
    emits: ["update:show"],
    setup(__props) {
      const show = vue.useModel(__props, "show");
      const props = __props;
      const message2 = naiveUi.useMessage();
      const url = vue.ref("");
      const pathId = vue.ref("");
      const countData = vue.ref({
        used: 0,
        count: 0
      });
      const showCaptcha = vue.ref(false);
      const iframe = vue.ref(null);
      const showResult = vue.ref(false);
      const resultData = vue.ref({
        success: 0,
        fail: 0,
        list: []
      });
      const resultTitle = vue.computed(() => {
        return (resultData.value.success ? resultData.value.success + "个任务添加成功，" : "") + resultData.value.fail + "个任务添加失败";
      });
      vue.watch(show, (value) => {
        if (value) {
          getCount();
        }
      });
      const getCount = async () => {
        try {
          const res = await request({
            url: `https://115.com/web/lixian/?ct=lixian&ac=get_quota_package_info`,
            method: "GET"
          });
          const json = JSON.parse(res.responseText);
          countData.value.used = json.used;
          countData.value.count = json.count;
          if (json.used >= json.count) {
            message2.error("本月配额已用完");
          }
        } catch (error) {
          message2.error(error);
        }
      };
      const handleDownload = async () => {
        if (!url.value) {
          message2.error("下载链接不能为空");
          return;
        }
        if (pathId.value && !/^\d+$/.test(pathId.value)) {
          message2.error("文件夹ID只能为数字");
          return;
        }
        try {
          const sp = new URLSearchParams();
          sp.append("savepath", "");
          sp.append("wp_path_id", pathId.value ? pathId.value : props.downPath.file_id);
          const urls = url.value.split("\n").filter((item) => item.trim());
          if (urls.length > 1) {
            urls.forEach((item, index) => {
              sp.append(`url[${index}]`, item);
            });
          } else {
            const firstUrl = urls[0];
            if (firstUrl) {
              sp.append("url", firstUrl);
            }
          }
          sp.append("uid", props.downPath.user_id);
          sp.append("sign", props.signData.sign);
          sp.append("time", props.signData.time);
          const res = await request({
            url: `https://115.com/web/lixian/?ct=lixian&ac=add_task_url${urls.length > 1 ? "s" : ""}`,
            method: "POST",
            data: sp,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json, text/javascript, */*; q=0.01",
              Origin: "https://115.com",
              "X-Requested-With": "XMLHttpRequest"
            }
          });
          const json = JSON.parse(res.responseText);
          if (json.state) {
            if (urls.length > 1) {
              json.result.forEach((item) => {
                if (item.state) {
                  resultData.value.success++;
                } else {
                  resultData.value.fail++;
                  resultData.value.list.push({ url: item.url, error: item.error_msg || "未知原因" });
                }
              });
              if (resultData.value.fail) {
                showResult.value = true;
                return;
              }
            }
            message2.success("添加下载成功");
            show.value = false;
            url.value = "";
            pathId.value = "";
          } else {
            if (json.errcode === 911) {
              message2.warning(json.error_msg);
              showCaptcha.value = true;
              vue.nextTick(() => {
                if (iframe.value) {
                  iframe.value.onload = () => {
                    const contentWindow = iframe.value?.contentWindow;
                    const iframeUrl = contentWindow?.location.href;
                    if (iframeUrl !== "https://captchaapi.115.com/?ac=security_code&type=web") {
                      message2.success("验证成功, 请重试");
                      showCaptcha.value = false;
                    }
                  };
                }
              });
            } else {
              if (json.error_msg) {
                throw json.error_msg;
              } else {
                throw "添加失败";
              }
            }
          }
        } catch (error) {
          message2.error(error);
        }
      };
      const handleCencel = () => {
        showResult.value = false;
        show.value = false;
      };
      return (_ctx, _cache) => {
        const _component_NInput = naiveUi.NInput;
        const _component_NFormItem = naiveUi.NFormItem;
        const _component_NButton = naiveUi.NButton;
        const _component_NModal = naiveUi.NModal;
        const _component_NEllipsis = naiveUi.NEllipsis;
        const _component_NText = naiveUi.NText;
        const _component_NListItem = naiveUi.NListItem;
        const _component_NScrollbar = naiveUi.NScrollbar;
        const _component_NList = naiveUi.NList;
        const _component_NSpace = naiveUi.NSpace;
        const _component_NResult = naiveUi.NResult;
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_NModal, {
            show: show.value,
            "onUpdate:show": _cache[2] || (_cache[2] = ($event) => show.value = $event),
            style: { "width": "40%" },
            title: "添加离线下载",
            preset: "card",
            bordered: false
          }, {
            action: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1, [
                vue.createElementVNode("div", null, "本月配额：剩" + vue.toDisplayString(vue.unref(countData).count - vue.unref(countData).used) + "/总" + vue.toDisplayString(vue.unref(countData).count), 1),
                vue.createElementVNode("div", null, [
                  vue.createVNode(_component_NButton, {
                    type: "primary",
                    disabled: vue.unref(countData).used >= vue.unref(countData).count,
                    onClick: handleDownload
                  }, {
                    default: vue.withCtx(() => [..._cache[7] || (_cache[7] = [
                      vue.createTextVNode(" 开始下载 ", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ])
            ]),
            default: vue.withCtx(() => [
              vue.createElementVNode("div", null, [
                vue.createVNode(_component_NInput, {
                  value: vue.unref(url),
                  "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.isRef(url) ? url.value = $event : null),
                  type: "textarea",
                  placeholder: "支持HTTP、HTTPS、FTP、磁力链和电驴链接，换行可添加多个",
                  clearable: "",
                  rows: 10
                }, null, 8, ["value"]),
                vue.createVNode(_component_NFormItem, {
                  label: "保存到：",
                  "label-placement": "left",
                  style: { "margin-top": "10px" }
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_NInput, {
                      value: vue.unref(pathId),
                      "onUpdate:value": _cache[1] || (_cache[1] = ($event) => vue.isRef(pathId) ? pathId.value = $event : null),
                      placeholder: "暂时只支持填入文件夹ID，不填默认云下载文件夹"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                })
              ])
            ]),
            _: 1
          }, 8, ["show"]),
          vue.createVNode(_component_NModal, {
            show: vue.unref(showCaptcha),
            "onUpdate:show": _cache[3] || (_cache[3] = ($event) => vue.isRef(showCaptcha) ? showCaptcha.value = $event : null),
            title: "验证账号",
            style: { "width": "360px" },
            preset: "card"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("iframe", {
                ref_key: "iframe",
                ref: iframe,
                src: "https://captchaapi.115.com/?ac=security_code&type=web",
                style: { "width": "100%", "height": "500px", "border": "none" }
              }, null, 512)
            ]),
            _: 1
          }, 8, ["show"]),
          vue.createVNode(_component_NModal, {
            show: vue.unref(showResult),
            "onUpdate:show": _cache[5] || (_cache[5] = ($event) => vue.isRef(showResult) ? showResult.value = $event : null),
            title: "下载任务错误列表",
            style: { "width": "40%" },
            preset: "card",
            "close-on-esc": false,
            "mask-closable": false,
            onAfterLeave: _cache[6] || (_cache[6] = () => {
              vue.unref(resultData).success = 0;
              vue.unref(resultData).fail = 0;
              vue.unref(resultData).list = [];
            })
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_NResult, {
                status: "warning",
                size: "small",
                title: vue.unref(resultTitle)
              }, {
                footer: vue.withCtx(() => [
                  vue.createVNode(_component_NSpace, { justify: "end" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_NButton, { onClick: handleCencel }, {
                        default: vue.withCtx(() => [..._cache[9] || (_cache[9] = [
                          vue.createTextVNode("取消", -1)
                        ])]),
                        _: 1
                      }),
                      vue.createVNode(_component_NButton, {
                        type: "primary",
                        onClick: _cache[4] || (_cache[4] = ($event) => showResult.value = false)
                      }, {
                        default: vue.withCtx(() => [..._cache[10] || (_cache[10] = [
                          vue.createTextVNode("重试", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                default: vue.withCtx(() => [
                  vue.createVNode(_component_NList, null, {
                    header: vue.withCtx(() => [..._cache[8] || (_cache[8] = [
                      vue.createTextVNode(" 失败任务列表： ", -1)
                    ])]),
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_NScrollbar, { style: { "max-height": "120px" } }, {
                        default: vue.withCtx(() => [
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(resultData).list, (item, index) => {
                            return vue.openBlock(), vue.createBlock(_component_NListItem, { key: index }, {
                              default: vue.withCtx(() => [
                                vue.createElementVNode("div", _hoisted_2, [
                                  vue.createVNode(_component_NEllipsis, { style: { "max-width": "300px" } }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(item.url), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  vue.createElementVNode("div", null, [
                                    vue.createVNode(_component_NText, { type: "error" }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(item.error), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ])
                                ])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["title"])
            ]),
            _: 1
          }, 8, ["show"])
        ], 64);
      };
    }
  });
  const INVALID_NUMBER = "Invalid number";
  const INVALID_ROUND = "Invalid rounding method";
  const IEC = "iec";
  const JEDEC = "jedec";
  const SI = "si";
  const BIT = "bit";
  const BITS = "bits";
  const BYTE = "byte";
  const BYTES = "bytes";
  const SI_KBIT = "kbit";
  const SI_KBYTE = "kB";
  const ARRAY = "array";
  const FUNCTION = "function";
  const OBJECT = "object";
  const STRING = "string";
  const EXPONENT = "exponent";
  const ROUND = "round";
  const E = "e";
  const EMPTY = "";
  const PERIOD = ".";
  const S = "s";
  const SPACE = " ";
  const ZERO = "0";
  const STRINGS = {
    symbol: {
      iec: {
        bits: ["bit", "Kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
        bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
      },
      jedec: {
        bits: ["bit", "Kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
        bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
      }
    },
    fullform: {
      iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
      jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
    }
  };
  const BINARY_POWERS = [
    1,
1024,
1048576,
1073741824,
1099511627776,
1125899906842624,
1152921504606847e3,
11805916207174113e5,
12089258196146292e8
];
  const DECIMAL_POWERS = [
    1,
1e3,
1e6,
1e9,
1e12,
1e15,
1e18,
1e21,
1e24
];
  const LOG_2_1024 = Math.log(1024);
  const LOG_10_1000 = Math.log(1e3);
  const STANDARD_CONFIGS = {
    [SI]: { isDecimal: true, ceil: 1e3, actualStandard: JEDEC },
    [IEC]: { isDecimal: false, ceil: 1024, actualStandard: IEC },
    [JEDEC]: { isDecimal: false, ceil: 1024, actualStandard: JEDEC }
  };
  function getBaseConfiguration(standard, base) {
    if (STANDARD_CONFIGS[standard]) {
      return STANDARD_CONFIGS[standard];
    }
    if (base === 2) {
      return { isDecimal: false, ceil: 1024, actualStandard: IEC };
    }
    return { isDecimal: true, ceil: 1e3, actualStandard: JEDEC };
  }
  function handleZeroValue(precision, actualStandard, bits, symbols, full, fullforms, output, spacer) {
    const result = [];
    result[0] = precision > 0 ? 0 .toPrecision(precision) : 0;
    const u = result[1] = STRINGS.symbol[actualStandard][bits ? BITS : BYTES][0];
    if (output === EXPONENT) {
      return 0;
    }
    if (symbols[result[1]]) {
      result[1] = symbols[result[1]];
    }
    if (full) {
      result[1] = fullforms[0] || STRINGS.fullform[actualStandard][0] + (bits ? BIT : BYTE);
    }
    return output === ARRAY ? result : output === OBJECT ? {
      value: result[0],
      symbol: result[1],
      exponent: 0,
      unit: u
    } : result.join(spacer);
  }
  function calculateOptimizedValue(num, e, isDecimal, bits, ceil) {
    const d = isDecimal ? DECIMAL_POWERS[e] : BINARY_POWERS[e];
    let result = num / d;
    if (bits) {
      result *= 8;
      if (result >= ceil && e < 8) {
        result /= ceil;
        e++;
      }
    }
    return { result, e };
  }
  function applyPrecisionHandling(value, precision, e, num, isDecimal, bits, ceil, roundingFunc, round) {
    let result = value.toPrecision(precision);
    if (result.includes(E) && e < 8) {
      e++;
      const { result: valueResult } = calculateOptimizedValue(num, e, isDecimal, bits, ceil);
      const p = round > 0 ? Math.pow(10, round) : 1;
      result = (p === 1 ? roundingFunc(valueResult) : roundingFunc(valueResult * p) / p).toPrecision(precision);
    }
    return { value: result, e };
  }
  function applyNumberFormatting(value, locale, localeOptions, separator, pad, round) {
    let result = value;
    if (locale === true) {
      result = result.toLocaleString();
    } else if (locale.length > 0) {
      result = result.toLocaleString(locale, localeOptions);
    } else if (separator.length > 0) {
      result = result.toString().replace(PERIOD, separator);
    }
    if (pad && round > 0) {
      const resultStr = result.toString();
      const x = separator || ((resultStr.match(/(\D)/g) || []).pop() || PERIOD);
      const tmp = resultStr.split(x);
      const s = tmp[1] || EMPTY;
      const l = s.length;
      const n = round - l;
      result = `${tmp[0]}${x}${s.padEnd(l + n, ZERO)}`;
    }
    return result;
  }
  function filesize(arg, {
    bits = false,
    pad = false,
    base = -1,
    round = 2,
    locale = EMPTY,
    localeOptions = {},
    separator = EMPTY,
    spacer = SPACE,
    symbols = {},
    standard = EMPTY,
    output = STRING,
    fullform = false,
    fullforms = [],
    exponent = -1,
    roundingMethod = ROUND,
    precision = 0
  } = {}) {
    let e = exponent, num = Number(arg), result = [], val = 0, u = EMPTY;
    const { isDecimal, ceil, actualStandard } = getBaseConfiguration(standard, base);
    const full = fullform === true, neg = num < 0, roundingFunc = Math[roundingMethod];
    if (typeof arg !== "bigint" && isNaN(arg)) {
      throw new TypeError(INVALID_NUMBER);
    }
    if (typeof roundingFunc !== FUNCTION) {
      throw new TypeError(INVALID_ROUND);
    }
    if (neg) {
      num = -num;
    }
    if (num === 0) {
      return handleZeroValue(precision, actualStandard, bits, symbols, full, fullforms, output, spacer);
    }
    if (e === -1 || isNaN(e)) {
      e = isDecimal ? Math.floor(Math.log(num) / LOG_10_1000) : Math.floor(Math.log(num) / LOG_2_1024);
      if (e < 0) {
        e = 0;
      }
    }
    if (e > 8) {
      if (precision > 0) {
        precision += 8 - e;
      }
      e = 8;
    }
    if (output === EXPONENT) {
      return e;
    }
    const { result: valueResult, e: valueExponent } = calculateOptimizedValue(num, e, isDecimal, bits, ceil);
    val = valueResult;
    e = valueExponent;
    const p = e > 0 && round > 0 ? Math.pow(10, round) : 1;
    result[0] = p === 1 ? roundingFunc(val) : roundingFunc(val * p) / p;
    if (result[0] === ceil && e < 8 && exponent === -1) {
      result[0] = 1;
      e++;
    }
    if (precision > 0) {
      const precisionResult = applyPrecisionHandling(result[0], precision, e, num, isDecimal, bits, ceil, roundingFunc, round);
      result[0] = precisionResult.value;
      e = precisionResult.e;
    }
    const symbolTable = STRINGS.symbol[actualStandard][bits ? BITS : BYTES];
    u = result[1] = isDecimal && e === 1 ? bits ? SI_KBIT : SI_KBYTE : symbolTable[e];
    if (neg) {
      result[0] = -result[0];
    }
    if (symbols[result[1]]) {
      result[1] = symbols[result[1]];
    }
    result[0] = applyNumberFormatting(result[0], locale, localeOptions, separator, pad, round);
    if (full) {
      result[1] = fullforms[e] || STRINGS.fullform[actualStandard][e] + (bits ? BIT : BYTE) + (result[0] === 1 ? EMPTY : S);
    }
    if (output === ARRAY) {
      return result;
    }
    if (output === OBJECT) {
      return {
        value: result[0],
        symbol: result[1],
        exponent: e,
        unit: u
      };
    }
    return spacer === SPACE ? `${result[0]} ${result[1]}` : result.join(spacer);
  }
  const _sfc_main$2 = vue.defineComponent({
    __name: "CloudDownloadModal",
    props: vue.mergeModels({
      signData: {},
      downPath: {}
    }, {
      "show": {
        type: Boolean,
        default: false
      },
      "showModifiers": {}
    }),
    emits: ["update:show"],
    setup(__props) {
      const show = vue.useModel(__props, "show");
      const props = __props;
      const message2 = naiveUi.useMessage();
      const dialog = naiveUi.useDialog();
      const {
        copy
      } = useClipboard();
      const columns = [{
        title: "文件名",
        key: "name"
      }, {
        title: "大小",
        key: "size",
        width: 100,
        render(row) {
          return filesize(row.size, {
            standard: "jedec"
          });
        }
      }, {
        title: "进度",
        key: "percentDone",
        width: 300,
        render(row) {
          if (row.percentDone === 100) {
            return "已完成";
          } else {
            return vue.createVNode(naiveUi.NProgress, {
              "type": "line",
              "percentage": Math.floor(row.percentDone),
              "processing": true
            }, null);
          }
        }
      }, {
        title: "操作",
        key: "action",
        width: 150,
        render: (row) => {
          return vue.createVNode(naiveUi.NSpace, null, {
            default: () => [row.file_id ? vue.createVNode(naiveUi.NButton, {
              "text": true,
              "onClick": () => _GM_openInTab(`https://115.com/?cid=${row.file_id}&offset=0&tab=&mode=wangpan`, {
                setParent: settings?.openNewTab.setParent
              })
            }, {
              icon: () => vue.createVNode(naiveUi.NIcon, null, {
                default: () => [vue.createVNode(FolderOutlined, null, null)]
              })
            }) : null, vue.createVNode(naiveUi.NButton, {
              "text": true,
              "onClick": async () => {
                await copy(row.url);
                message2.success("复制成功！");
              }
            }, {
              icon: () => vue.createVNode(naiveUi.NIcon, null, {
                default: () => [vue.createVNode(CopyOutlined, null, null)]
              })
            }), vue.createVNode(naiveUi.NButton, {
              "text": true,
              "onClick": () => {
                dialog.warning({
                  title: "信息提示",
                  content: () => vue.createVNode("div", {
                    "style": {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }
                  }, [vue.createVNode("div", {
                    "style": {
                      marginBottom: "10px"
                    }
                  }, [vue.createTextVNode("是否确认删除该下载任务？")]), vue.createVNode(naiveUi.NCheckbox, {
                    "checked": flag.value,
                    "onUpdate:checked": ($event) => flag.value = $event,
                    "checked-value": 1,
                    "unchecked-value": 0
                  }, {
                    default: () => [vue.createTextVNode("删除源文件")]
                  })]),
                  positiveText: "确定",
                  negativeText: "取消",
                  onPositiveClick: () => {
                    handleDelete(row.info_hash);
                  }
                });
              }
            }, {
              icon: () => vue.createVNode(naiveUi.NIcon, null, {
                default: () => [vue.createVNode(DeleteOutlined, null, null)]
              })
            })]
          });
        }
      }];
      const data = vue.ref([]);
      const pagination = vue.reactive({
        page: 1,
        pageCount: 1,
        pageSize: 30
      });
      const loading = vue.ref(false);
      const flag = vue.ref(0);
      vue.onMounted(() => {
        if (settings?.oldButton.deleteSource) {
          flag.value = 1;
        }
      });
      vue.watch(show, (value) => {
        if (value) {
          getList();
        }
      });
      const getList = async (page) => {
        try {
          loading.value = true;
          const sp = new URLSearchParams();
          sp.append("sign", props.signData.sign);
          sp.append("time", props.signData.time);
          sp.append("page", page ? page.toString() : pagination.page.toString());
          sp.append("uid", props.downPath.user_id);
          const res = await request({
            url: `https://115.com/web/lixian/?ct=lixian&ac=task_lists`,
            method: "POST",
            data: sp,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          });
          const json = JSON.parse(res.responseText);
          if (json.state) {
            data.value = json.tasks;
            pagination.page = json.page;
            pagination.pageCount = json.page_count;
            pagination.itemCount = json.count;
          } else {
            if (json.error) {
              throw new Error(json.error);
            } else {
              throw new Error("获取签名失败");
            }
          }
        } catch (error) {
          message2.error(error);
        } finally {
          loading.value = false;
        }
      };
      const handlePageChange = (page) => {
        getList(page);
      };
      const handleDelete = async (hash) => {
        try {
          const sp = new URLSearchParams();
          sp.append("sign", props.signData.sign);
          sp.append("time", props.signData.time);
          sp.append("hash[0]", hash);
          sp.append("uid", props.downPath.user_id);
          if (flag.value) {
            sp.append("flag", flag.value.toString());
          }
          const res = await request({
            url: `https://115.com/web/lixian/?ct=lixian&ac=task_del`,
            method: "POST",
            data: sp,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          });
          const json = JSON.parse(res.responseText);
          if (json.state) {
            message2.success("删除成功");
            getList();
          } else {
            if (json.error) {
              throw new Error(json.error);
            } else {
              throw new Error("删除失败");
            }
          }
        } catch (error) {
          message2.error(error);
        }
      };
      return (_ctx, _cache) => {
        const _component_NDataTable = naiveUi.NDataTable;
        const _component_NModal = naiveUi.NModal;
        return vue.openBlock(), vue.createBlock(_component_NModal, {
          show: show.value,
          "onUpdate:show": _cache[0] || (_cache[0] = ($event) => show.value = $event),
          style: {
            "width": "80%"
          },
          title: "云下载",
          preset: "card",
          bordered: false
        }, {
          default: vue.withCtx(() => [vue.createVNode(_component_NDataTable, {
            remote: "",
            "flex-height": "",
            columns,
            data: vue.unref(data),
            pagination: vue.unref(pagination),
            "row-key": (row) => row.info_hash,
            loading: vue.unref(loading),
            style: {
              "height": "70vh"
            },
            "onUpdate:page": handlePageChange
          }, null, 8, ["data", "pagination", "row-key", "loading"])]),
          _: 1
        }, 8, ["show"]);
      };
    }
  });
  const _sfc_main$1 = vue.defineComponent({
    __name: "AppContent",
    setup(__props) {
      const message2 = naiveUi.useMessage();
      const isLeft = usePageLeave();
      const bc = new BroadcastChannel("115Plus");
      const showList = vue.ref(false);
      const showDownload = vue.ref(false);
      const showVideo = vue.ref(false);
      const videoList = vue.ref([]);
      const signData = vue.ref({
        sign: "",
        time: ""
      });
      const downPath = vue.ref({
        file_id: "",
        user_id: ""
      });
      vue.onMounted(async () => {
        bc.onmessage = (event) => {
          console.log(event.data);
          if (isLeft.value || event.data.url !== window.location.href) {
            return;
          }
          if (event.data.type === "CloudDownload") {
            showList.value = true;
          } else if (event.data.type === "VideoPlay") {
            videoList.value = JSON.parse(event.data.data);
            showVideo.value = true;
          } else if (event.data.type === "OfflineDownload") {
            showDownload.value = true;
          }
        };
        if (window.location.search) {
          getSign();
          getDownPath();
        }
      });
      const getSign = async () => {
        try {
          const res = await request({
            url: `https://115.com/?ct=offline&ac=space&_${Date.now()}`,
            method: "GET"
          });
          const json = JSON.parse(res.responseText);
          if (json.state) {
            signData.value.sign = json.sign;
            signData.value.time = json.time;
          } else {
            if (json.error) {
              throw new Error(json.error);
            } else {
              throw new Error("获取签名失败");
            }
          }
        } catch (error) {
          message2.error(error);
        }
      };
      const getDownPath = async () => {
        try {
          const res = await request({
            url: `https://webapi.115.com/offine/downpath`,
            method: "GET"
          });
          const json = JSON.parse(res.responseText);
          if (json.state) {
            downPath.value.file_id = json.data[0].file_id;
            downPath.value.user_id = json.data[0].user_id;
          } else {
            if (json.error) {
              throw new Error(json.error);
            } else {
              throw new Error("获取云下载路径失败");
            }
          }
        } catch (error) {
          message2.error(error);
        }
      };
      return (_ctx, _cache) => {
        const _component_CloudDownloadModal = _sfc_main$2;
        const _component_OfflineDownloadModal = _sfc_main$3;
        const _component_VideoModal = _sfc_main$4;
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_CloudDownloadModal, {
            show: vue.unref(showList),
            "onUpdate:show": _cache[0] || (_cache[0] = ($event) => vue.isRef(showList) ? showList.value = $event : null),
            "down-path": vue.unref(downPath),
            "sign-data": vue.unref(signData)
          }, null, 8, ["show", "down-path", "sign-data"]),
          vue.createVNode(_component_OfflineDownloadModal, {
            show: vue.unref(showDownload),
            "onUpdate:show": _cache[1] || (_cache[1] = ($event) => vue.isRef(showDownload) ? showDownload.value = $event : null),
            "down-path": vue.unref(downPath),
            "sign-data": vue.unref(signData)
          }, null, 8, ["show", "down-path", "sign-data"]),
          vue.createVNode(_component_VideoModal, {
            show: vue.unref(showVideo),
            "onUpdate:show": _cache[2] || (_cache[2] = ($event) => vue.isRef(showVideo) ? showVideo.value = $event : null),
            data: vue.unref(videoList)
          }, null, 8, ["show", "data"])
        ], 64);
      };
    }
  });
  const _sfc_main = vue.defineComponent({
    __name: "App",
    setup(__props) {
      const theme = useTheme();
      return (_ctx, _cache) => {
        const _component_AppContent = _sfc_main$1;
        const _component_NMessageProvider = naiveUi.NMessageProvider;
        const _component_NModalProvider = naiveUi.NModalProvider;
        const _component_NDialogProvider = naiveUi.NDialogProvider;
        const _component_NConfigProvider = naiveUi.NConfigProvider;
        return vue.openBlock(), vue.createBlock(_component_NConfigProvider, { theme: vue.unref(theme) ,"theme-overrides": globalThemeOverrides}, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_NDialogProvider, null, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_NModalProvider, null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_NMessageProvider, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_AppContent)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["theme"]);
      };
    }
  });
  const indexCss = ".n-card-header__close .n-base-icon,.n-dialog__close .n-base-icon,.n-icon{font-size:18px}";
  importCSS(indexCss);
  const { message } = naiveUi.createDiscreteApi(["message"]);
  if (settings) {
    let newSettings = settings;
    let flag = false;
    if (!settings.darkMode) {
      newSettings = {
        ...newSettings,
        darkMode: {
          enable: false
        }
      };
      flag = true;
    }
    if (!settings.fp) {
      newSettings = {
        ...newSettings,
        fp: {
          enable: true
        }
      };
      flag = true;
    }
    if (typeof settings.oldButton.deleteSource !== "boolean") {
      newSettings = {
        ...newSettings,
        oldButton: {
          enable: settings.oldButton.enable,
          deleteSource: true
        }
      };
      flag = true;
    }
    if (typeof settings.openNewTab.setParent !== "boolean") {
      newSettings = {
        ...newSettings,
        openNewTab: {
          enable: settings.openNewTab.enable,
          setParent: false
        }
      };
      flag = true;
    }
    _GM_setValue("settings", newSettings);
    if (flag) {
      message.loading("115+ 功能更新中，即将刷新页面……");
      setTimeout(() => {
        window.location.reload();
      }, 3e3);
    }
  }
  if (window.top === window.self) {
    vue.createApp(_sfc_main).mount(
      (() => {
        const body = document.querySelector("body");
        const app = document.createElement("div");
        if (body) {
          body.appendChild(app);
        }
        return app;
      })()
    );
  }
  vue.createApp(Setting).mount(
    (() => {
      const top_side = document.querySelector(".top-side");
      const setting = document.createElement("div");
      if (top_side) {
        top_side.appendChild(setting);
      }
      return setting;
    })()
  );
  if (!settings || settings.sidebar.enable) {
    vue.createApp(_sfc_main$9).mount(
      (() => {
        const wrap_hflow = document.getElementsByClassName("wrap-hflow")[0];
        const site_left_bar = document.getElementById("site_left_bar");
        const sidebar = document.createElement("div");
        sidebar.addEventListener("mousedown", (e) => {
          e.stopPropagation();
        });
        if (site_left_bar && wrap_hflow) {
          wrap_hflow.insertBefore(sidebar, site_left_bar);
          wrap_hflow.removeChild(site_left_bar);
        }
        return sidebar;
      })()
    );
  }
  if (!settings || settings.download.enable || settings.openNewTab.enable || settings.video.enable) {
    vue.createApp(_sfc_main$7).mount(
      (() => {
        const js_top_header_file_path_box = document.getElementById("js_top_header_file_path_box");
        const download = document.createElement("div");
        download.addEventListener("mousedown", (e) => {
          e.stopPropagation();
        });
        if (js_top_header_file_path_box) {
          js_top_header_file_path_box.appendChild(download);
        }
        return download;
      })()
    );
  }
  if (!settings || settings.oldButton.enable) {
    vue.createApp(_sfc_main$5).mount(
      (() => {
        const upload_btn_add_dir = document.querySelector(
          'a[data-dropdown-tab="upload_btn_add_dir"]'
        );
        const cloudDownload = document.createElement("div");
        cloudDownload.addEventListener("mousedown", (e) => {
          e.stopPropagation();
        });
        cloudDownload.style.display = "inline-block";
        if (upload_btn_add_dir) {
          upload_btn_add_dir.parentNode.insertBefore(cloudDownload, upload_btn_add_dir.nextSibling);
        }
        return cloudDownload;
      })()
    );
  }
  if (!settings || settings.fp.enable) {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.some((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const fp = document.querySelector('div[class|="fp"]');
          if (fp && fp.style.display !== "none") {
            fp.style.display = "none";
          }
          return true;
        }
        return false;
      });
    });
    observer.observe(document.querySelector("body"), { childList: true });
  }

})(Vue, naive, Player, HlsJsPlugin);

