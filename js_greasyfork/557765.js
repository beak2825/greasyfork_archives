// ==UserScript==
// @name         微信读书-章节内容复制
// @namespace    http://tampermonkey.net/
// @version      20251209
// @description  支持快速复制微信读书章节内容，HTML/Markdown任意格式，可一键抓取当前页，适用于epub和txt格式
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weread.qq.com
// @author       You
// @match        https://weread.qq.com/web/reader/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557765/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6-%E7%AB%A0%E8%8A%82%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/557765/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6-%E7%AB%A0%E8%8A%82%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==


/*


*/
(function() {
    'use strict';

    console.log('jQuery version:', $.fn.jquery);

    class WereadGenerateBrowser {

        constructor(book_id, chapter_id, pc, ps) {

            if (!book_id || !chapter_id || !pc || !ps) {
                alert(`点击书籍进入阅读页面。\nerror:（book_id, chapter_id, pc, ps） all not null.\n `)
                throw `（book_id, chapter_id, pc, ps） all not null.`
            }


            this.book_id = book_id;
            this.chapter_id = chapter_id;
            this.pc = pc;
            this.ps = ps;
        }

        static instance() {
            return new WereadGenerateBrowser('1', '1', '1', '1')
        }

        // ------------------------------
        // Pure JS MD5 implementation
        // ------------------------------
        md5_hex(message) {
            return this.#md5(message);
        }

        #md5(str) {
            function md5cycle(x, k) {
                let a = x[0], b = x[1], c = x[2], d = x[3];

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
                return cmn((b & c) | ((~b) & d), a, b, x, s, t);
            }

            function gg(a, b, c, d, x, s, t) {
                return cmn((b & d) | (c & (~d)), a, b, x, s, t);
            }

            function hh(a, b, c, d, x, s, t) {
                return cmn(b ^ c ^ d, a, b, x, s, t);
            }

            function ii(a, b, c, d, x, s, t) {
                return cmn(c ^ (b | (~d)), a, b, x, s, t);
            }

            function md51(s) {
                const txt = '';
                const n = s.length;
                const state = [1732584193, -271733879, -1732584194, 271733878];
                let i;
                for (i = 64; i <= n; i += 64) {
                    md5cycle(state, md5blk(s.substring(i - 64, i)));
                }
                s = s.substring(i - 64);
                const tail = Array(16).fill(0);
                for (i = 0; i < s.length; i++)
                    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
                tail[(i >> 2)] |= 0x80 << ((i % 4) << 3);
                if (i > 55) {
                    md5cycle(state, tail);
                    tail.fill(0);
                }
                tail[14] = n * 8;
                md5cycle(state, tail);
                return state;
            }

            function md5blk(s) {
                const blks = [];
                for (let i = 0; i < 64; i += 4) {
                    blks[i >> 2] = s.charCodeAt(i)
                        + (s.charCodeAt(i + 1) << 8)
                        + (s.charCodeAt(i + 2) << 16)
                        + (s.charCodeAt(i + 3) << 24);
                }
                return blks;
            }

            function rhex(n) {
                const s = "0123456789abcdef";
                let out = "";
                for (let j = 0; j < 4; j++)
                    out += s[(n >> (j * 8 + 4)) & 0x0F] + s[(n >> (j * 8)) & 0x0F];
                return out;
            }

            function hex(x) {
                return x.map(rhex).join("");
            }

            function add32(a, b) {
                return (a + b) & 0xFFFFFFFF;
            }

            return hex(md51(str));
        }


        // ------------------------------
        // Custom _0x58fb1d hash
        // ------------------------------
        _0x58fb1d(s) {
            let a = 0x15051505;
            let b = a;
            const length = s.length;
            let i = length - 1;
            while (i > 0) {
                a = (a ^ (s.charCodeAt(i) << ((length - i) % 30))) & 0x7fffffff;
                b = (b ^ (s.charCodeAt(i - 1) << (i % 30))) & 0x7fffffff;
                i -= 2;
            }
            return (a + b).toString(16).toLowerCase();
        }

        // ------------------------------
        // _e 转换算法
        // ------------------------------
        async _e(s) {
            s = String(s);

            const h = this.md5_hex(s);

            let result = h.substring(0, 3);

            let chunks, type_flag;

            if (/^\d+$/.test(s)) {
                chunks = [];
                for (let i = 0; i < s.length; i += 9) {
                    const part = s.substring(i, i + 9);
                    chunks.push(parseInt(part).toString(16));
                }
                type_flag = "3";
            } else {
                chunks = [
                    Array.from(s).map(c => c.charCodeAt(0).toString(16)).join("")
                ];
                type_flag = "4";
            }

            result += type_flag;
            result += "2" + h.slice(-2);

            chunks.forEach((chunk, idx) => {
                let lenHex = chunk.length.toString(16);
                if (lenHex.length === 1) lenHex = "0" + lenHex;
                result += lenHex + chunk;
                if (idx < chunks.length - 1) result += "g";
            });

            if (result.length < 20) {
                result += h.slice(0, 20 - result.length);
            }

            result += this.md5_hex(result).slice(0, 3);
            return result;
        }

        // ------------------------------
        // Main entry
        // ------------------------------
        async get_request_param() {
            // const psvts = "60732fa07a84c19cg019846";
            // const pclts = "62332c407a84c19cg016653";

            // a1232c40813ab871eg018128
            let bid = await this._e(this.book_id)
            let cid = await this._e(this.chapter_id)

            const book = {
                b: bid,
                c: cid,
                ct: `${Math.floor(Date.now() / 1000)}`,
                pc: this.pc,
                prevChapter: "false",
                ps: this.ps,
                r: String(Math.floor(10000 * Math.random()) ** 2),
                sc: 0,
                st: 0,
            };

            const s = Object.entries(book).map(([k, v]) => `${k}=${v}`).join("&");
            book.s = this._0x58fb1d(s);
            return book;
        }
    }

    class DragElement {
        constructor(el, options = {}) {
            this.el = typeof el === "string" ? document.querySelector(el) : el;
            if (!this.el) return;

            this.options = Object.assign(
                {
                    saveKey: null,        // localStorage key，不需要存储可设 null
                    boundary: window,     // 目前为窗口内拖动
                },
                options
            );

            this.dragging = false;
            this.pointerId = null;
            this.startPointerX = 0;
            this.startPointerY = 0;
            this.startLeft = 0;
            this.startTop = 0;
            this.movedDuringPointer = false;
            this.suppressClick = false;

            // 初始化
            this.loadPos();
            this.bindEvents();
        }

        // ===================== 工具函数 =====================
        pxToNum(v) {
            return v ? parseFloat(v.replace("px", "")) : 0;
        }

        setPos(left, top) {
            this.el.style.left = left + "px";
            this.el.style.top = top + "px";
        }

        // ===================== 存储位置 =====================
        loadPos() {
            if (!this.options.saveKey) return;

            try {
                const raw = localStorage.getItem(this.options.saveKey);
                if (!raw) return;
                const pos = JSON.parse(raw);

                requestAnimationFrame(() => {
                    const w = this.el.offsetWidth;
                    const h = this.el.offsetHeight;
                    const maxL = Math.max(window.innerWidth - w, 0);
                    const maxT = Math.max(window.innerHeight - h, 0);

                    const left = Math.min(Math.max(pos.left, 0), maxL);
                    const top = Math.min(Math.max(pos.top, 0), maxT);
                    this.setPos(left, top);
                });
            } catch (e) {
            }
        }

        savePos() {
            if (!this.options.saveKey) return;

            const left = this.pxToNum(getComputedStyle(this.el).left);
            const top = this.pxToNum(getComputedStyle(this.el).top);

            try {
                localStorage.setItem(this.options.saveKey, JSON.stringify({left, top}));
            } catch (e) {
            }
        }

        // ===================== 事件绑定 =====================
        bindEvents() {
            this.el.addEventListener("pointerdown", this.onDown.bind(this));
            window.addEventListener("pointermove", this.onMove.bind(this));
            window.addEventListener("pointerup", this.onUp.bind(this));
            this.el.addEventListener("click", this.onClick.bind(this));
            window.addEventListener("resize", this.onResize.bind(this));
        }

        // ===================== pointerdown =====================
        onDown(e) {
            if (e.pointerType === "mouse" && e.button !== 0) return;

            e.preventDefault();
            this.el.setPointerCapture(e.pointerId);
            this.pointerId = e.pointerId;
            this.dragging = true;
            this.movedDuringPointer = false;

            this.startPointerX = e.clientX;
            this.startPointerY = e.clientY;
            this.startLeft = this.pxToNum(getComputedStyle(this.el).left);
            this.startTop = this.pxToNum(getComputedStyle(this.el).top);

            this.el.classList.add("dragging");

            document.body.style.userSelect = "none";
        }

        // ===================== pointermove =====================
        onMove(e) {
            if (!this.dragging || e.pointerId !== this.pointerId) return;

            e.preventDefault();

            const dx = e.clientX - this.startPointerX;
            const dy = e.clientY - this.startPointerY;

            let newLeft = Math.round(this.startLeft + dx);
            let newTop = Math.round(this.startTop + dy);

            // 限制在窗口内
            const w = this.el.offsetWidth;
            const h = this.el.offsetHeight;
            const maxL = Math.max(window.innerWidth - w, 0);
            const maxT = Math.max(window.innerHeight - h, 0);

            newLeft = Math.min(Math.max(newLeft, 0), maxL);
            newTop = Math.min(Math.max(newTop, 0), maxT);

            this.setPos(newLeft, newTop);

            this.movedDuringPointer = true;
        }

        // ===================== pointerup =====================
        onUp(e) {
            if (!this.dragging || e.pointerId !== this.pointerId) return;

            try {
                this.el.releasePointerCapture(e.pointerId);
            } catch (e) {
            }

            this.dragging = false;
            this.pointerId = null;
            this.el.classList.remove("dragging");
            document.body.style.userSelect = "";

            if (this.movedDuringPointer) {
                this.savePos();

                this.suppressClick = true;
                setTimeout(() => (this.suppressClick = false), 50);
            }
        }

        // ===================== click 阻止误触 =====================
        onClick(e) {
            if (this.suppressClick) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }

        // ===================== 窗口缩放时修正位置 =====================
        onResize() {
            const left = this.pxToNum(getComputedStyle(this.el).left);
            const top = this.pxToNum(getComputedStyle(this.el).top);
            const w = this.el.offsetWidth;
            const h = this.el.offsetHeight;

            const newLeft = Math.min(Math.max(left, 0), window.innerWidth - w);
            const newTop = Math.min(Math.max(top, 0), window.innerHeight - h);

            this.setPos(newLeft, newTop);
        }
    }

    var bookInfo = {}

    let params = {}

    /*
    {
        "bookId": "26211970",
        "book": {
            "appId": "wb182564874663h194243764",
            "bookVersion": 0,
            "reviewId": "",
            "chapterUid": 4,
            "chapterOffset": 563,
            "chapterIdx": 4,
            "updateTime": 1764814675,
            "synckey": 1114604009,
            "summary": "统，老师们普遍以理论概念为主进行教授，比",
            "repairOffsetTime": 0,
            "readingTime": 356,
            "progress": 0,
            "isStartReading": 1,
            "ttsTime": 0,
            "startReadingTime": 1764814167,
            "installId": "",
            "recordReadingTime": 0
        },
        "canFreeRead": 0,
        "timestamp": 1764814870
    }

     */
    var readProgress = null

    var contents = {
        // ${fmt-bid-cid}
    }

    var clickedChapters = new Set();

    var hashUtil = WereadGenerateBrowser.instance()

    // 保存原始的 XMLHttpRequest 构造函数和 open 方法
    const OriginalXHR = window.XMLHttpRequest;
    const originalOpen = OriginalXHR.prototype.open;
    const originalSend = OriginalXHR.prototype.send;

    // 要拦截的 URL 模式
    const targetPattern = '/web/book/chapter/';

    // 重写 XMLHttpRequest 的 open 方法
    OriginalXHR.prototype.open = function (method, url, async, user, password) {
        this._url = url; // 保存 URL 用于后续判断
        this._method = method; // 保存请求方法

        return originalOpen.apply(this, arguments);
    };

    // 重写 XMLHttpRequest 的 send 方法
    OriginalXHR.prototype.send = function (body) {
        // 保存请求体
        const t = Date.now()
        this._requestBody = body;
        // console.log('🚨 拦截到请求:', this._url);
        // 如果 URL 匹配目标模式，添加事件监听器
        if (this._url && this._url.includes(targetPattern)) {
            // console.log('🚨 拦截到目标请求:', this._url);
            // console.log('📤 请求方法:', this._method);
            // console.log('📦 请求体:', this._requestBody);

            params = JSON.parse(this._requestBody)

            // 监听 load 事件来获取响应
            // this.addEventListener('load', function () {
            //     // 如果需要，可以将响应体保存到变量中
            //     this._responseBody = this.responseText;
            // });

            // 监听 error 事件
            this.addEventListener('error', function () {
                console.error('❌ 请求失败:', this._url);
            });
        } else if(this._url.includes('/web/book/getProgress')) {
             // 监听 load 事件来获取响应
            this.addEventListener('load', function () {
                // 如果需要，可以将响应体保存到变量中
                try{
                    readProgress = JSON.parse(this.responseText);
                }catch(e) {
                    console.log(e)
                }
            });
        }

        return originalSend.apply(this, arguments);
    };

    console.log('✅ XHR 拦截器已安装，正在监听:', targetPattern);

    // 保存原始的 atob 函数
    // const originalAtob = window.atob;
    // const originalBtoa = window.btoa;

    // 重写 atob 函数
    // window.atob = function (encodedString) {
    //     console.group('🔍 atob 函数被调用');
    //     //  console.log('📥 输入参数:', encodedString);
    //
    //     // 调用原始函数
    //     const result = originalAtob.apply(this, arguments);
    //
    //     //  console.log('📤 解码结果:', result);
    //
    //     // 获取调用栈信息
    //     const stackTrace = new Error().stack;
    //     //  console.log('📋 调用栈:', stackTrace);
    //
    //     console.groupEnd();
    //
    //     return result;
    // };

    // window.btoa = function (decodedString) {
    //     console.group('🔍 btoa 函数被调用');
    //     // console.log('📥 输入参数:', decodedString);
    //
    //     // 调用原始函数
    //     const result = originalBtoa.apply(this, arguments);
    //
    //     // console.log('📤 解码结果:', result);
    //
    //     // 获取调用栈信息
    //     const stackTrace = new Error().stack;
    //     // console.log('📋 调用栈:', stackTrace);
    //
    //     console.groupEnd();
    //
    //     return result;
    // };

    console.log('✅ btoa 监听器已安装');

    class EpubBuilder {
        constructor(options = {}) {
            this.title = options.title || "Untitled";
            this.author = options.author || "Unknown";
            this.language = options.language || "zh-CN";
            this.fileName = options.fileName || "book.epub";

            this.coverBase64 = null;
            this.chapters = [];
        }

        /** 设置封面（必须为 Base64） */
        setCover(base64) {
            this.coverBase64 = base64;
        }

        /** 添加章节 */
        addChapter(title, html) {
            this.chapters.push({title, html});
        }

        /** 生成 toc.ncx 中的章节目录 XML */
        _buildNCX() {
            let items = "";
            this.chapters.forEach((c, i) => {
                items += `
        <navPoint id="navPoint-${i + 1}" playOrder="${i + 1}">
          <navLabel><text>${c.title}</text></navLabel>
          <content src="chap${i + 1}.html"/>
        </navPoint>
      `;
            });

            return `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN"
      "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
      <ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">
        <head>
          <meta name="dtb:uid" content="id"/>
          <meta name="dtb:depth" content="1"/>
          <meta name="dtb:totalPageCount" content="0"/>
          <meta name="dtb:maxPageNumber" content="0"/>
        </head>
        <docTitle><text>${this.title}</text></docTitle>
        <navMap>${items}</navMap>
      </ncx>
    `;
        }

        /** 生成 OEBPS/content.opf */
        _buildOPF() {
            let manifestItems = `
      <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    `;

            let spineItems = "";

            this.chapters.forEach((c, i) => {
                manifestItems += `
        <item id="chap${i + 1}" href="chap${i + 1}.html" media-type="application/xhtml+xml"/>
      `;
                spineItems += `<itemref idref="chap${i + 1}"/>`;
            });

            if (this.coverBase64) {
                manifestItems += `
        <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>
        <item id="cover-img" href="cover.png" media-type="image/png"/>
      `;
                spineItems = `<itemref idref="cover"/>` + spineItems;
            }

            return `<?xml version="1.0" encoding="utf-8"?>
      <package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
        <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
          <dc:title>${this.title}</dc:title>
          <dc:language>${this.language}</dc:language>
          <dc:creator>${this.author}</dc:creator>
          <dc:identifier id="bookid">id-${Date.now()}</dc:identifier>
        </metadata>
        <manifest>${manifestItems}</manifest>
        <spine toc="ncx">${spineItems}</spine>
      </package>`;
        }

        /** 生成整个 EPUB ZIP 包 */
        async generate() {
            const zip = new JSZip();

            // ① mimetype 必须 uncompressed 且首文件
            zip.file("mimetype", "application/epub+zip", {compression: "STORE"});

            // ② META-INF/container.xml
            zip.folder("META-INF")
                .file("container.xml", `
        <container version="1.0"
          xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
          <rootfiles>
            <rootfile full-path="OEBPS/content.opf"
              media-type="application/oebps-package+xml"/>
          </rootfiles>
        </container>
       `.trim());

            // ③ OEBPS 目录
            const oebps = zip.folder("OEBPS");

            // ============== 加封面 ==============
            if (this.coverBase64) {
                const coverBinary = this._base64ToUint8Array(this.coverBase64);
                oebps.file("cover.png", coverBinary);
                oebps.file("cover.xhtml", `
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head><title>Cover</title></head>
        <body style="margin:0;padding:0;">
          <img src="cover.png" style="max-width:100%;"/>
        </body>
        </html>
      `);
            }

            // ============== 加章节 ==============
            this.chapters.forEach((c, i) => {
                oebps.file(`chap${i + 1}.html`, `
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head><title>${c.title}</title></head>
        <body>${c.html}</body>
        </html>
      `);
            });

            // ④ toc.ncx
            oebps.file("toc.ncx", this._buildNCX());

            // ⑤ content.opf
            oebps.file("content.opf", this._buildOPF());

            // ============== 生成 EPUB Blob ==============
            const blob = await zip.generateAsync({type: "blob"});
            return blob;
        }

        /** 一键生成 + 保存 */
        async save() {
            const epubBlob = await this.generate();
            saveAs(epubBlob, this.fileName);
        }

        /** Base64 → Uint8Array */
        _base64ToUint8Array(base64) {
            const binary = atob(base64.replace(/^data:.+;base64,/, ""));
            const len = binary.length;
            const buffer = new Uint8Array(len);
            for (let i = 0; i < len; i++) buffer[i] = binary.charCodeAt(i);
            return buffer;
        }
    }


    async function test(){

      const book = new EpubBuilder({
        title: "我的 EPUB",
        author: "作者A",
        fileName: "mybook.epub"
      });

      book.addChapter("前言", "<p>这是第一章内容。</p>");
      book.addChapter("第二章", "<h2>正文</h2><p>更多内容。</p>");

      await book.save();
    }

    // const $test = $(`<button id="test-btn">测试</button>`).appendTo("body")

    // $test.on('click', ()=>test())

    // function initUI() {
    //
    //     // 创建样式
    //     $('<style>').text(`
    //     #test-btn {
    //
    //         position: fixed;
    //         top: 50px;
    //         right: 20px;
    //         z-index: 9999;
    //         border: none;
    //         border-radius: 20px;
    //         padding: 5px;
    //         cursor: pointer;
    //         background: #28a745;
    //         color: #fff;
    //         font-size: 14px;
    //         box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    //     }
    //
    //     #simple-copy-btn, .copy-md  {
    //         border: none;
    //         border-radius: 5px;
    //         padding: 5px;
    //         font-size: 14px;
    //         /* transition: all 0.3s ease; */
    //
    //     }
    //
    //     #simple-copy-btn, .copy-md {
    //         background: #aeb4ba;
    //         color: white;
    //     }
    //
    //     #simple-copy-btn:hover, .copy-md:hover {
    //         background: #6c737c;
    //     }
    //
    //     /* 新增：章节列表按钮 */
    //     #chapter-list-btn {
    //         position: fixed;
    //         top: 140px;
    //         right: 20px;
    //         z-index: 9999;
    //         border: none;
    //         border-radius: 20px;
    //         padding: 5px;
    //         cursor: pointer;
    //         background: #28a745;
    //         color: #fff;
    //         font-size: 14px;
    //         box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    //         width: max-content;   /* 按文字内容自动定宽，不会被拉伸 */
    //         display: inline-block;
    //         white-space: nowrap;  /* 禁止换行 */
    //     }
    //
    //     /* 章节弹窗 */
    //     #chapter-list-panel {
    //         position: fixed;
    //         top: 200px;
    //         right: 20px;
    //         max-width: 250px;
    //         max-height: 60vh;
    //         overflow-y: auto;
    //         background: #fff;
    //         color: #333;
    //         border-radius: 10px;
    //         padding: 10px;
    //         box-shadow: 0 2px 20px rgba(0,0,0,0.3);
    //         z-index: 99999;
    //         display: none;
    //     }
    //
    //     #chapter-list-panel .header {
    //         display: flex;
    //         justify-content: space-between;
    //         font-weight: bold;
    //         margin-bottom: 8px;
    //     }
    //
    //     #chapter-list-panel .close {
    //         cursor: pointer;
    //         color: #999;
    //         font-size: 16px;
    //     }
    //
    //     #chapter-list-panel ul {
    //         list-style: none;
    //         padding: 0;
    //         margin: 0;
    //     }
    //
    //     #chapter-list-panel li {
    //         padding: 6px 4px;
    //         border-bottom: 1px solid #eaeaea;
    //         cursor: pointer;
    //     }
    //
    //     #chapter-list-panel li:hover {
    //         background: #f6f6f6;
    //     }
    //
    //     #chapter-list-panel li {
    //         padding: 6px 4px;
    //         border-bottom: 1px solid #eaeaea;
    //         cursor: pointer;
    //         display: flex;
    //         justify-content: space-between;
    //         align-items: center;
    //     }
    //
    //     .copy-ch-btn, .copy-ch-btn-loaded {
    //         border: none;
    //         background: #aeb4ba;
    //         color: white;
    //         border-radius: 6px;
    //         padding: 2px 6px;
    //         cursor: pointer;
    //         font-size: 12px;
    //     }
    //
    //     .copy-ch-btn-loaded {
    //         background: green;
    //     }
    //
    //     .copy-ch-btn:hover {
    //         background: #6c737c;
    //     }
    //
    //     #__global_toast {
    //         position: fixed;
    //         left: 50%;
    //         top: 80px;
    //         transform: translateX(-50%);
    //         background: rgba(0,0,0,0.75);
    //         color: #fff;
    //         padding: 10px 20px;
    //         border-radius: 8px;
    //         font-size: 14px;
    //         z-index: 999999;
    //         opacity: 0;
    //         pointer-events: none;
    //         transition: opacity .3s ease, transform .3s ease;
    //     }
    //
    //     #__global_toast.show {
    //         opacity: 1;
    //         transform: translateX(-50%) translateY(-10px);
    //     }
    //
    //
    // `).appendTo('head');
    //
    //
    //     // ========== 新增：章节按钮 ==========
    //     const $chapterBtn = $(`<button id="chapter-list-btn">📚 章节</button>`);
    //
    //     // 添加到 body
    //     $('body').append($chapterBtn);
    //
    //     // 监听元素，调置 .chapter-list-panel 背景色
    //     // readerControls_item dark / readerControls_item white
    //
    //     const dark = $('.readerControls_item.dark')
    //     const white = $('.readerControls_item.white')
    //
    //     let myStyle = {}
    //
    //     if(white) {
    //         myStyle = {
    //             'color': '#262628',
    //             'backgroundColor': '#1c1c1d',
    //         }
    //     } else if (dark) {
    //         myStyle = {
    //             'color': '#1c1c1d',
    //             'backgroundColor': '#fff',
    //         }
    //
    //     }
    //
    //     // ========== 新增：章节列表弹窗 DOM ==========
    //     const $panel = $(`
    //         <div id="chapter-list-panel">
    //             <div style="margin-bottom: 10px;">
    //                 <span>当前页</span>
    //                 <button id="simple-copy-btn">.html/.epub</button>
    //                 <button class="wx-reader-btn copy-md"><span class="icon">📄</span> .md</button>
    //             </div>
    //             <div class="header">
    //                 <span>章节列表</span>
    //                 <span class="close">✖</span>
    //             </div>
    //
    //             <div class="format-box">
    //                 格式：
    //                 <label>
    //                     <span>md</span><input type="checkbox" class="fmt" value="md" checked/>
    //                 </label>
    //                 <label>
    //                     <span>html</span><input type="checkbox" class="fmt" value="html"/>
    //                 </label>
    //             </div>
    //
    //             <ul></ul>
    //         </div>
    //     `);
    //     $('body').append($panel);
    //
    //     // ========== 原按钮 ==========
    //     const $btnCurrentPage = $("#simple-copy-btn")
    //     const $copyMdBtn = $(`.copy-md`)
    //
    //
    //
    //     new DragElement('#chapter-list-btn', {
    //       saveKey: 'simple-copy-btn-pos'
    //     });
    //
    //
    //     // ========== 章节渲染函数 ==========
    //
    //     function renderChapters(chapters) {
    //         const $ul = $panel.find("ul");
    //         $ul.empty();
    //         const bid = bookInfo.book.bookId
    //         chapters.forEach(ch => {
    //
    //             let clicked, copyBtnCls
    //             if (clickedChapters.has(ch.chapterUid)) {
    //                 clicked = '✔'
    //                 copyBtnCls = 'copy-ch-btn-loaded'
    //             } else {
    //                 clicked = '📋'
    //                 copyBtnCls = ''
    //             }
    //
    //             $ul.append(`
    //                 <li class="chapter-item" data-id="${ch.chapterUid}">
    //                     <span class="chapter-title">${ch.title}</span>
    //                     <button class="copy-ch-btn ${copyBtnCls}" data-id="${ch.chapterUid}" data-title="${ch.title}">
    //                         ${clicked}
    //                     </button>
    //                 </li>
    //             `);
    //         });
    //
    //         // 绑定复制按钮（避免 li 点击事件触发）
    //         $(".copy-ch-btn").on("click", function (e) {
    //             e.stopPropagation();
    //
    //             const $btn = $(this);
    //             const original = $btn.text();   // 保存原图标
    //             $btn.text("⏳");                // 切换为加载图标
    //
    //             // 当前选择格式
    //             const fmt = $(".fmt:checked").val() || "html";
    //             const chapterId = $(this).data("id");
    //
    //             // console.log("点击章节：", chapterId, "格式：", fmt);
    //
    //             try {
    //                 getTexts(fmt, bid, chapterId)
    //                     .then(content => {
    //                         copyToClipboard(content, "");
    //                     })
    //                     .catch(err => {
    //                         console.error("❌ 出错:", err);
    //                         showToast("加载失败");
    //                     })
    //                     .finally(() => {
    //                         // 2 秒后恢复按钮图标
    //                         setTimeout(() => {
    //                             if (clickedChapters.has(chapterId)) {
    //                                 $btn.text('✔').css('background', 'green')
    //                             } else {
    //                                 $btn.text(original);
    //                             }
    //                         }, 2000);
    //                     });
    //
    //             } catch (error) {
    //                 console.error("❌ 数据处理出错:", error);
    //                 alert("数据处理出错: " + error.message);
    //
    //                 // 出错时也恢复图标
    //                 setTimeout(() => {
    //                     $btn.text(original);
    //                 }, 2000);
    //             }
    //         });
    //
    //     }
    //
    //     // ========== 点击章节按钮 → 打开列表 ==========
    //     $chapterBtn.on("click", () => {
    //         renderChapters(bookInfo.updated);
    //         $panel.show();
    //     });
    //
    //     // 点击关闭
    //     $panel.find(".close").on("click", () => {
    //         $panel.hide();
    //     });
    //
    //     // 原绑定
    //     $btnCurrentPage.on('click', handleCurrentPage);
    //     $copyMdBtn.on('click', handleCopyMarkdown);
    //
    //     // 格式 checkbox 互斥
    //     $(document).on("change", ".fmt", function () {
    //         $(".fmt").not(this).prop("checked", false);
    //
    //         // 至少保证一个被选
    //         if (!$(".fmt:checked").length) {
    //             $(this).prop("checked", true);
    //         }
    //     });
    // }

    function setMode() {

        // 先判断当前是深色还是浅色（注意要用 .length 判断）
        const isDarkMode = $('.readerControls_item.dark').length > 0;
        const isLightMode = $('.readerControls_item.white').length > 0;

        // 定义一套默认配色（浅色）
        let vars = {

            '--btn-bg': '#d3cfcf',
            '--btn-fg': '#212121',


            '--btn-sec-bg': '#aeb4ba',
            '--btn-sec-bg-hover': '#6c737c',
            '--btn-sec-fg': '#ffffff',

            '--panel-bg': '#ffffff',
            '--panel-fg': '#333333',
            '--panel-border': '#eaeaea',
            '--panel-hover-bg': '#f6f6f6',

            '--copy-loaded-bg': 'green',
        }

        // 如果是深色模式，换一套颜色
        if (!isDarkMode && isLightMode) {
            vars = {
                '--btn-bg': '#343635',
                '--btn-fg': '#dcd6d6',

                '--btn-sec-bg': '#4b5563',
                '--btn-sec-bg-hover': '#6b7280',
                '--btn-sec-fg': '#e5e7eb',

                '--panel-bg': '#18181b',
                '--panel-fg': '#e5e7eb',
                '--panel-border': '#27272f',
                '--panel-hover-bg': '#27272f',

                '--copy-loaded-bg': '#16a34a',
            };
        }

        // ⭐ 关键：把变量写入 documentElement（相当于 :root）
        const root = document.documentElement;
        for (const [key, value] of Object.entries(vars)) {
            root.style.setProperty(key, value);
        }
    }

    function initUI() {
        setMode()
    // 创建样式（使用 CSS 变量）
    $('<style id="my-reader-style">').text(`
        #test-btn {
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 9999;
            border: none;
            border-radius: 20px;
            padding: 5px;
            cursor: pointer;
            background: var(--btn-bg);
            color: var(--btn-fg);
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        #simple-copy-btn, .copy-md  {
            border: none;
            border-radius: 5px;
            padding: 5px;
            font-size: 14px;
            background: var(--btn-sec-bg);
            color: var(--btn-sec-fg);
        }

        #simple-copy-btn:hover, .copy-md:hover {
            background: var(--btn-sec-bg-hover);
        }

        /* 章节列表按钮 */
        #chapter-list-btn {
            position: fixed;
            top: 140px;
            right: 20px;
            z-index: 9999;
            border: none;
            border-radius: 20px;
            padding: 5px;
            cursor: pointer;
            background: var(--btn-bg);
            color: var(--btn-fg);
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            width: max-content;
            display: inline-block;
            white-space: nowrap;
        }

        /* 章节弹窗 */
        #chapter-list-panel {
            position: fixed;
            top: 200px;
            right: 20px;
            max-width: 250px;
            max-height: 60vh;
            overflow-y: auto;
            background: var(--panel-bg);
            color: var(--panel-fg);
            border-radius: 10px;
            padding: 10px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.3);
            z-index: 99999;
            display: none;
        }

        #chapter-list-panel .header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 8px;
        }

        #chapter-list-panel .close {
            cursor: pointer;
            color: #999;
            font-size: 16px;
        }

        #chapter-list-panel ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        #chapter-list-panel li {
            padding: 6px 4px;
            border-bottom: 1px solid var(--panel-border);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #chapter-list-panel li:hover {
            background: var(--panel-hover-bg);
        }

        .copy-ch-btn, .copy-ch-btn-loaded {
            border: none;
            background: var(--btn-sec-bg);
            color: var(--btn-sec-fg);
            border-radius: 6px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 12px;
        }

        .copy-ch-btn-loaded {
            background: var(--copy-loaded-bg);
        }

        .copy-ch-btn:hover {
            background: var(--btn-sec-bg-hover);
        }

        #__global_toast {
            position: fixed;
            left: 50%;
            top: 80px;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.75);
            color: #fff;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 999999;
            opacity: 0;
            pointer-events: none;
            transition: opacity .3s ease, transform .3s ease;
        }

        #__global_toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(-10px);
        }
    `).appendTo('head');


    // ========== 新增：章节按钮 ==========
    const $chapterBtn = $(`<button id="chapter-list-btn">📚 章节</button>`);
    $('body').append($chapterBtn);

    // ========== 章节列表弹窗 DOM ==========
    const $panel = $(`
        <div id="chapter-list-panel">
            <div style="margin-bottom: 10px;">
                <span>当前页</span>
                <button id="simple-copy-btn">.html/.epub</button>
                <button class="wx-reader-btn copy-md"><span class="icon">📄</span> .md</button>
            </div>
            <div class="header">
                <span>章节列表</span>
                <span class="close">✖</span>
            </div>

            <div class="format-box">
                格式：
                <label>
                    <span>md</span><input type="checkbox" class="fmt" value="md" checked/>
                </label>
                <label>
                    <span>html</span><input type="checkbox" class="fmt" value="html"/>
                </label>
            </div>

            <ul></ul>
        </div>
    `);
    $('body').append($panel);

    const $btnCurrentPage = $("#simple-copy-btn");
    const $copyMdBtn     = $(".copy-md");

    new DragElement('#chapter-list-btn', {
        saveKey: 'simple-copy-btn-pos'
    });

    // ========== 章节渲染函数 ==========
    function renderChapters(chapters) {
        const $ul = $panel.find("ul");
        $ul.empty();
        const bid = bookInfo.book.bookId;

        chapters.forEach(ch => {
            let clicked, copyBtnCls;
            if (clickedChapters.has(ch.chapterUid)) {
                clicked = '✔';
                copyBtnCls = 'copy-ch-btn-loaded';
            } else {
                clicked = '📋';
                copyBtnCls = '';
            }

            $ul.append(`
                <li class="chapter-item" data-id="${ch.chapterUid}">
                    <span class="chapter-title">${ch.title}</span>
                    <button class="copy-ch-btn ${copyBtnCls}" data-id="${ch.chapterUid}" data-title="${ch.title}">
                        ${clicked}
                    </button>
                </li>
            `);
        });

        $(".copy-ch-btn").on("click", function (e) {
            e.stopPropagation();

            const $btn = $(this);
            const original = $btn.text();
            $btn.text("⏳");

            const fmt = $(".fmt:checked").val() || "html";
            const chapterId = $(this).data("id");

            try {
                getTexts(fmt, bid, chapterId)
                    .then(content => {
                        copyToClipboard(content, "");
                    })
                    .catch(err => {
                        console.error("❌ 出错:", err);
                        showToast("加载失败");
                    })
                    .finally(() => {
                        setTimeout(() => {
                            if (clickedChapters.has(chapterId)) {
                                $btn.text('✔').addClass('copy-ch-btn-loaded');
                            } else {
                                $btn.text(original);
                            }
                        }, 2000);
                    });

            } catch (error) {
                console.error("❌ 数据处理出错:", error);
                alert("数据处理出错: " + error.message);

                setTimeout(() => {
                    $btn.text(original);
                }, 2000);
            }
        });
    }

    // ========== 点击章节按钮 → 打开列表 ==========
    $chapterBtn.on("click", () => {
        setMode()
        renderChapters(bookInfo.updated);
        $panel.show();
    });

    // 点击关闭
    $panel.find(".close").on("click", () => {
        $panel.hide();
    });

    // 原绑定
    $btnCurrentPage.on('click', handleCurrentPage);
    $copyMdBtn.on('click', handleCopyMarkdown);

    // 格式 checkbox 互斥
    $(document).on("change", ".fmt", function () {
        $(".fmt").not(this).prop("checked", false);
        if (!$(".fmt:checked").length) {
            $(this).prop("checked", true);
        }
    });
}


    initUI()

    // ========== 全局通用 Toast ==========


    function showToast(msg, duration = 2000) {
        // 如果已有 toast，先移除
        $("#__global_toast").remove();

        const $toast = $(`
            <div id="__global_toast">${msg}</div>
        `);

        $("body").append($toast);

        // 强制绘制
        setTimeout(() => {
            $toast.addClass("show");
        }, 10);

        // 自动关闭
        setTimeout(() => {
            $toast.removeClass("show");

            setTimeout(() => $toast.remove(), 300);
        }, duration);
    }

    // 复制到剪贴板
    function copyToClipboard(text, targetCss) {

        const showTost = function () {

            if(! targetCss) {
                showToast('复制完成')
            }

            const $btn = $(targetCss);
            if (!$btn.length) return;

            const originalText = $btn.text();
            $btn.text('✅');
            $btn.css('background', '#28a745');

            setTimeout(() => {
                $btn.text(originalText);
                $btn.css('background', '');
            }, 1500);

            // console.log('📋 复制成功，内容长度:', text.length);
        }

        if (typeof GM_setClipboard !== 'undefined') {
            // Tampermonkey 剪贴板
            GM_setClipboard(text, 'text');
            showTost();
        } else {
            navigator.clipboard.writeText(text)
                .then(showTost)
                .catch(err => {
                    console.error('❌ 复制失败:', err);
                    alert('复制失败: ' + err.message);
                });
        }
    }


    function handleCurrentPage() {
        try {
            getTexts('html').then(content => {

                copyToClipboard(content, '#simple-copy-btn')
            })


        } catch (error) {
            console.error('❌ 数据处理出错:', error);
            alert('数据处理出错: ' + error.message);
        }
    }

    // 按钮点击处理函数
    function handleCopyMarkdown() {
        getTexts('md').then(content => {
            // console.log(content)
            if (content) {

                copyToClipboard(content, '.copy-md');

            }
        })
    }


    function getCurrentBook() {
        const path = location.pathname.split('/').pop()
        const chapters = bookInfo.updated
        let targetChapter = ''


        chapters.forEach(c=>{
            if(path === c.hash) {
                targetChapter = c
            }
        })

        if(targetChapter) {

            let bookId = bookInfo.book.bookId
            let chapterId = targetChapter.chapterUid

            // console.log(bookId, chapterId)

            return [bookId, chapterId]
        }
        return [bookInfo.book.bookId, null]
    }

    async function getTexts(format = 'html', bookId=null, chapterId=null) {


        let bid = bookId, cid = chapterId;

        if(! bookId && ! chapterId) {

            [bid, cid] = getCurrentBook()

            if(!bid || !cid) {
                    await reqProgress(bid)

                const chapterIdx = readProgress.book.chapterIdx

                bookInfo.updated.forEach(c => {
                    if (chapterIdx === c.chapterIdx) {
                        cid = c.chapterIdx
                    }
                })
            }
        }

        const cacheKey = `${format}:${bid}:${cid}`

        if(contents[cacheKey]) {
            // console.log(`kit cache: ${cacheKey}`)
            return contents[cacheKey]
        }

        return await getEpubContent(bid, cid, params.pc, params.ps)
            .then(texts => {
                if (texts.length > 0) {
                    let content = get_content(texts);
                    if (format === 'md') {
                        content = htmlToMarkdown(content)
                    }
                    // console.log('📝 章节内容:', content);

                    contents[cacheKey] = `${content}\n\n`
                    clickedChapters.add(cid)

                    return `${content}\n\n`;
                }
                return ''
            })

    }

    // HTML转Markdown函数
    function htmlToMarkdown(html, options = {}) {
        if (!TurndownService) {
            console.error('TurndownService未加载');
            return html;
        }

        const defaultOptions = {
            headingStyle: 'atx',
            hr: '---',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            emDelimiter: '*',
            strongDelimiter: '**',
            linkStyle: 'inlined',
            linkReferenceStyle: 'full'
        };

        const turndownService = new TurndownService({...defaultOptions, ...options});

        // 添加自定义规则
        turndownService.addRule('wereadHighlight', {
            filter: function (node) {
                return node.nodeName === 'SPAN' &&
                    node.className &&
                    node.className.includes('highlight');
            },
            replacement: function (content) {
                return `**${content}**`;
            }
        });

        turndownService.addRule('wereadNote', {
            filter: function (node) {
                return node.nodeName === 'DIV' &&
                    node.className &&
                    node.className.includes('note');
            },
            replacement: function (content) {
                return `> ${content}`;
            }
        });

        turndownService.addRule('wereadChapter', {
            filter: function (node) {
                return node.nodeName === 'H1' || node.nodeName === 'H2' ||
                    (node.className && node.className.includes('chapter'));
            },
            replacement: function (content, node) {
                const level = node.nodeName === 'H1' ? 1 :
                    node.nodeName === 'H2' ? 2 : 2;
                return `${'#'.repeat(level)} ${content}\n\n`;
            }
        });

        try {
            return turndownService.turndown(html);
        } catch (error) {
            console.error('HTML转Markdown出错:', error);
            return html;
        }
    }

    /**
     * 修复 HTML 字符串：如果 <html> 含 xmlns，则：
     *  - 将自闭合或不完整的 <title/> 修为 <title></title>
     *  - 在 <head> 最前面插入 <meta charset="utf-8"/>（若没有）
     * 并尝试保留原始 XML prolog 和 DOCTYPE。
     *
     * @param {string} htmlIn - 原始 HTML/XML 字符串
     * @returns {string} 修复后的字符串
     */
    function fixHtmlWithDomParser(htmlIn) {
        if (typeof htmlIn !== 'string') return htmlIn;

        // 保留并摘取 xml prolog 与 doctype，以便最后恢复
        const xmlPrologMatch = htmlIn.match(/^\s*(<\?xml[\s\S]*?\?>)\s*/i);
        const xmlProlog = xmlPrologMatch ? xmlPrologMatch[1] + '\n' : '';

        const doctypeMatch = htmlIn.match(/<!DOCTYPE[\s\S]*?>/i);
        const doctype = doctypeMatch ? doctypeMatch[0] + '\n' : '';

        // 如果存在自闭合或不完整的 <title/>（可能带属性），在解析前先替换为标准空元素
        // 示例匹配： <title/>  <title />  <title id="x"/>
        const preprocessed = htmlIn.replace(/<title\b[^>]*?\/\s*>/gi, '<title></title>');

        // 再判断是否有 <html ... xmlns ...>（使用正则加速判断）
        const hasXmlns = /<html\b[^>]*\sxmlns(\:|=)/i.test(preprocessed);

        // 如果没有 xmlns，直接返回原始（或替换了自闭合 title 的版本）
        if (!hasXmlns) {
            // 仍可能需要把自闭合 title 修复：如果替换前后相同就返回原始
            return preprocessed;
        }

        // 解析为文档（使用 text/html 以便宽容处理）
        const parser = new DOMParser();
        const doc = parser.parseFromString(preprocessed, 'text/html');

        // 确保 head 存在
        let head = doc.querySelector('head');
        if (!head) {
            // 如果没有 head，创建一个并插入到 documentElement
            head = doc.createElement('head');
            const htmlEl = doc.documentElement || doc.getElementsByTagName('html')[0];
            if (htmlEl.firstChild) {
                htmlEl.insertBefore(head, htmlEl.firstChild);
            } else {
                htmlEl.appendChild(head);
            }
        }

        // 如果存在 <title/> 被解析为空 title，或者没有 title，确保至少有一个 title 元素（即使为空）
        let titleEl = head.querySelector('title');
        if (!titleEl) {
            titleEl = doc.createElement('title');
            // 可选择插入到 head 的开始或末尾，这里放在 head 的末尾（不影响 meta 放置）
            head.appendChild(titleEl);
        } else {
            // 如果 title 是自闭合替换后应当是空，但有些解析器可能把它转成 text 节点 " /" 等，清理一下只保留文本节点
            // 将所有非文本子节点删除，只保留 textContent（避免解析怪异造成的内容）
            const txt = titleEl.textContent || '';
            titleEl.textContent = txt.trim(); // 保持现有文本但去除空白
        }

        // 检查是否已有 charset meta（两种写法：<meta charset="..."> 或 <meta http-equiv="Content-Type" content="text/html; charset=...">）
        const hasCharsetMeta = head.querySelector('meta[charset], meta[http-equiv="Content-Type"][content*="charset"]');

        if (!hasCharsetMeta) {
            // 插入 <meta charset="utf-8"> 到 head 的最前面
            const meta = doc.createElement('meta');
            meta.setAttribute('charset', 'utf-8');

            // 插到 head 首位（在 title 前或后都可，根据需求这里放在 title 之前）
            if (head.firstChild) {
                head.insertBefore(meta, head.firstChild);
            } else {
                head.appendChild(meta);
            }
        }

        // 序列化：尽量保留 xml prolog 与 doctype（如果有）
        // 使用 outerHTML 获得 <html> 内容
        const htmlOuter = doc.documentElement ? doc.documentElement.outerHTML : doc.documentElement;

        // 合并并返回
        return xmlProlog + doctype + htmlOuter;
    }


    function get_content(texts, type = 'e') {

        if (texts.length === 4) {
            const cssText = texts.splice(2, 1);
        } else if (texts.length === 2) {
            type = 't'
        }
        // === 前处理 ===
        let t = texts.map(s => s.slice(32)).join("");
        t = t.slice(1);

        // --- a(s) ---
        function a(s) {
            const length = s.length;
            if (length < 4) return [];
            if (length < 11) return [0, 2];

            const n = Math.min(4, Math.ceil(length / 10));
            let tmp = "";

            for (let i = length - 1; i >= length - n; i--) {
                const code = s.charCodeAt(i);
                const binStr = code.toString(2);
                const v = parseInt(binStr, 4).toString();
                tmp += v;
            }

            const arr = [];
            const m = length - n - 2;
            const step = String(m).length;

            let i = 0;
            while (arr.length < 10 && i + step < tmp.length) {
                let v = parseInt(tmp.slice(i, i + step));
                arr.push(v % m);

                let v2 = parseInt(tmp.slice(i + 1, i + 1 + step));
                arr.push(v2 % m);

                i += step;
            }
            return arr;
        }

        // --- b(s, arr) ---
        function b(s, arr) {
            const chars = s.split("");
            for (let i = arr.length - 1; i >= 0; i -= 2) {
                for (let k of [1, 0]) {
                    const idx1 = arr[i] + k;
                    const idx2 = arr[i - 1] + k;
                    const tmp = chars[idx1];
                    chars[idx1] = chars[idx2];
                    chars[idx2] = tmp;
                }
            }
            return chars.join("");
        }

        // --- Base64 URL => normal Base64 ---
        function base64UrlToBase64(s) {
            return s.replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+/]/g, "");
        }

        // --- 修复 UTF-8 ---
        function replace_utf8(chunk) {
            const l = chunk.length;
            const c = chunk;

            if (l === 4) {
                let val =
                    ((c.charCodeAt(0) & 0x07) << 18) |
                    ((c.charCodeAt(1) & 0x3F) << 12) |
                    ((c.charCodeAt(2) & 0x3F) << 6) |
                    (c.charCodeAt(3) & 0x3F);
                val -= 0x10000;
                const high = 0xD800 + (val >> 10);
                const low = 0xDC00 + (val & 0x3FF);
                return String.fromCharCode(high, low);
            } else if (l === 3) {
                let val =
                    ((c.charCodeAt(0) & 0x0F) << 12) |
                    ((c.charCodeAt(1) & 0x3F) << 6) |
                    (c.charCodeAt(2) & 0x3F);
                return String.fromCharCode(val);
            } else {
                let val =
                    ((c.charCodeAt(0) & 0x1F) << 6) |
                    (c.charCodeAt(1) & 0x3F);
                return String.fromCharCode(val);
            }
        }

        // === 执行 ===
        const arr = a(t);
        const encodeStr = b(t, arr);

        // Base64 解码
        const b64 = base64UrlToBase64(encodeStr);

        let decodedText = "";
        try {
            decodedText = atob(b64);
        } catch {
            decodedText = "";
        }

        // UTF-8 三/四字节模式修复
        const pattern = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;

        decodedText = decodedText.replace(pattern, replace_utf8);

        if (type === 'e') {
            decodedText = fixHtmlWithDomParser(decodedText)
        }
        return decodedText;
    }



    async function getPsvts(bookKeyHash) {
        fetch('/web/reader/' + bookKeyHash)
            .then(resp => resp.text()).then(html => {
            const match = html.match(/"psvts"\s*:\s*"([^"]+)"/);
            if (match) {
                return match[1]
            } else {
                return 0
            }

        })
    }

    async function reqProgress(bookId) {
        const url = '/web/book/getProgress?bookId=' + bookId

        return await fetch(url, ).then(resp=>resp.json()).then(data=>{
            readProgress = data
            return readProgress
        })
    }

    async function getEpubContent(bookId, chapterId, pc, ps) {

        const wg = new WereadGenerateBrowser(bookId, chapterId, pc, ps || '11');

        // wg.ps = await wg._e(Math.floor(Date.now() / 1000))

        const params = await wg.get_request_param().then(params => {
            return params
        });


        const headers = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-HK;q=0.7",
            "content-type": "application/json;charset=UTF-8",
        }

        // "epub"
        const bookType = bookInfo.book.format

        let urls = [
            "/web/book/chapter/t_0",
            "/web/book/chapter/t_1",
        ]

        if (bookType === "epub") {

            urls = [
                "/web/book/chapter/e_0",
                "/web/book/chapter/e_1",
                // "/web/book/chapter/e_2", // css
                "/web/book/chapter/e_3",
            ]
        }

        const texts = []

        for (let i = 0; i < urls.length; i++) {
            const data = await fetch(urls[i], {
                "headers": headers,
                "body": JSON.stringify(params),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(resp => resp.text())
            texts.push(data)
        }

        return texts
    }


    async function getBookInfo(bookId) {

        if (!bookId) {

            alert('bookid is null')
            return
        }
        let url = '/web/book/publicchapterInfos'
        let data = await fetch(url, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-HK;q=0.7",
                "content-type": "application/json;charset=UTF-8",
            },
            "body": JSON.stringify({"bookIds": [bookId]}),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(resp => resp.json())

        if (data.data[0].updated.length === 0) {
            url = '/web/book/chapterInfos'
            data = await fetch(url, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-HK;q=0.7",
                    "content-type": "application/json;charset=UTF-8",
                },
                "body": JSON.stringify({"bookIds": [bookId]}),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(resp => resp.json())
        }

        return data
    }


    // 监听 DOM 直到出现 ld+json
    const observer = new MutationObserver((mutations) => {
        const el = document.querySelector('script[type="application/ld+json"]');
        if (el) {
            observer.disconnect();

            try {
                bookInfo = JSON.parse(el.textContent)
                   if (bookInfo['@Id']) {
                    getBookInfo(bookInfo['@Id']).then(info => {
                        bookInfo = info.data[0]
                        const gen = new WereadGenerateBrowser('1', '1', '1', '1')

                        const bookId = bookInfo.book.bookId
                        gen._e(bookId).then(bh=> {
                            bookInfo.updated.forEach(u => {
                                gen._e(u.chapterUid).then(uh => {
                                    u.hash = `${bh}k${uh}`
                                })
                            })
                        })
                    })
                } else {
                    bookInfo = null
                }
            } catch (e) {

            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });


})();
