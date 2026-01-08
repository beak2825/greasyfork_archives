// ==UserScript==
// @name         Shoutbox Image Viewer & GIF Search
// @namespace    foxbinner
// @version      2.3.0
// @description  GIF Search & Direct Image Link Viewer. Adds a GIF button and converts text links (Tenor, Lightshot etc.) into inline thumbnails.
// @author       foxbinner
// @license      MIT
// @match        https://www.torrentbd.com/*
// @match        https://www.torrentbd.net/*
// @match        https://www.torrentbd.org/*
// @match        https://www.torrentbd.me/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557396/Shoutbox%20Image%20Viewer%20%20GIF%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/557396/Shoutbox%20Image%20Viewer%20%20GIF%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * MODULE 1: GIF SEARCH (Tenor)
     * Adds the button, modal, and API handling.
     */
    const GifSearchModule = {
        config: {
            CLIENT_KEY: 'TBD_UserScript',
            LIMIT: 24,
            NO_KEY_MSG: `
                <div class="gif-error">
                    <div style="margin-bottom:5px; font-size:14px; color:#e74c3c;">API Key Missing</div>
                    <button id="gif-set-key-btn" class="gif-btn-small">Set API Key</button>
                    <div class="gif-help-text">It won't take more than 30 seconds</div>
                    <a href="https://developers.google.com/tenor/guides/quickstart#setup" target="_blank" class="gif-link-btn">Create API Key &nearr;</a>
                </div>`
        },
        dom: {
            shoutInput: '#shout_text',
            btnContainer: '#shout-ibb-container',
            smileyBtnSelector: 'span[onclick*="toggleSmilies"]',
            triggerBtn: 'tbdm-gif-btn',
            overlay: 'gif-modal-overlay',
            modalBox: 'gif-modal-box',
            searchInput: 'gif-search-input',
            clearBtn: 'gif-clear-search',
            results: 'gif-results-container',
            closeBtn: 'gif-close-btn'
        },
        apiKey: GM_getValue('TENOR_API_KEY', ''),
        debounceTimer: null,

        init() {
            this.addStyles();
            GM_registerMenuCommand("⚙️ Set Tenor API Key", () => this.promptForKey());
            this.waitForContainer();
        },

        addStyles() {
            const css = `
                #${this.dom.triggerBtn} { cursor: pointer; margin: 0 2px; display: inline-block; vertical-align: bottom; }
                .gif-icon-rect {
                    display: inline-block; background: #e0e0e0; color: #222; font-weight: 800; font-size: 11px;
                    padding: 0 8px; line-height: 37px; border-radius: 3px; vertical-align: middle;
                    transition: background 0.2s, color 0.2s; text-align: center;
                }
                #${this.dom.triggerBtn}:hover .gif-icon-rect { background: #14a76c; color: #fff; text-decoration: none; }

                #${this.dom.overlay} {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.8); z-index: 9999;
                    display: none; justify-content: center; align-items: center;
                }
                #${this.dom.modalBox} {
                    background: #222; width: 480px; max-width: 90%; height: 550px;
                    border-radius: 8px; display: flex; flex-direction: column;
                    border: 1px solid #444; box-shadow: 0 0 15px rgba(0,0,0,0.5);
                }
                .gif-modal-header {
                    padding: 12px; border-bottom: 1px solid #333; display: flex; gap: 10px;
                    align-items: center; background: #1a1a1a; border-radius: 8px 8px 0 0;
                }

                .gif-search-wrapper {
                    flex: 1; position: relative; display: flex; align-items: center;
                }
                #${this.dom.searchInput} {
                    width: 100%; height: 38px; padding: 0 30px 0 12px;
                    border: 1px solid #444; border-radius: 4px;
                    background: #111; color: #fff; outline: none; box-sizing: border-box; font-size: 14px; margin: 0;
                }
                #${this.dom.searchInput}:focus { border-color: #14a76c; }

                #${this.dom.clearBtn} {
                    position: absolute; right: 8px;
                    color: #888; cursor: pointer; font-size: 18px; font-weight: bold;
                    display: none;
                    line-height: 1;
                    user-select: none;
                }
                #${this.dom.clearBtn}:hover { color: #fff; }

                #${this.dom.closeBtn} {
                    flex: 0 0 38px; height: 38px; border: 1px solid #c0392b; background: #c0392b; color: white;
                    padding: 0; cursor: pointer; border-radius: 4px; font-weight: bold; display: flex;
                    justify-content: center; align-items: center; box-sizing: border-box; font-size: 16px; margin: 0;
                }
                #${this.dom.closeBtn}:hover { background: #a93226; border-color: #a93226; }

                #${this.dom.results} {
                    flex-grow: 1; overflow-y: auto; padding: 10px;
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
                    gap: 8px; align-content: start;
                }
                #${this.dom.results}::-webkit-scrollbar { width: 8px; }
                #${this.dom.results}::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
                #${this.dom.results}::-webkit-scrollbar-track { background: #222; }
                .gif-item {
                    cursor: pointer; border-radius: 4px; overflow: hidden; height: 110px;
                    background: #000; border: 2px solid transparent; position: relative;
                }
                .gif-item:hover { border-color: #14a76c; }
                .gif-item img { width: 100%; height: 100%; object-fit: cover; }

                .gif-loader, .gif-error { text-align: center; color: #888; padding: 20px; grid-column: 1 / -1; }
                .gif-btn-small {
                    display: inline-block; padding: 6px 12px; cursor: pointer;
                    background: #14a76c; color: white; border: none; border-radius: 3px;
                    font-size: 13px; font-weight: bold;
                }
                .gif-btn-small:hover { background: #118c5a; }

                .gif-help-text { font-size: 11px; color: #888; margin: 15px 0 5px; font-style: italic; }
                .gif-link-btn {
                    display: inline-block; padding: 5px 10px;
                    border: 1px solid #444; border-radius: 3px; background: #2a2a2a;
                    color: #ccc; text-decoration: none; font-size: 11px;
                    transition: all 0.2s;
                }
                .gif-link-btn:hover { border-color: #666; color: #fff; background: #333; }
            `;
            GM_addStyle(css);
        },

        promptForKey() {
            const key = prompt("Enter your Tenor API Key:", this.apiKey);
            if (key !== null) {
                this.apiKey = key.trim();
                GM_setValue('TENOR_API_KEY', this.apiKey);
                alert("API Key Saved! You can now search GIFs.");
                if (document.getElementById(this.dom.overlay).style.display === 'flex') {
                    this.fetchGifs('');
                }
            }
        },

        waitForContainer() {
            const checkInterval = setInterval(() => {
                const container = document.querySelector(this.dom.btnContainer);
                const input = document.querySelector(this.dom.shoutInput);
                const exists = document.getElementById(this.dom.triggerBtn);

                if (container && input && !exists) {
                    clearInterval(checkInterval);
                    this.buildUI(container);
                }
            }, 1000);
        },

        buildUI(container) {
            const modalHtml = `
                <div id="${this.dom.overlay}">
                    <div id="${this.dom.modalBox}">
                        <div class="gif-modal-header">
                            <div class="gif-search-wrapper">
                                <input type="text" id="${this.dom.searchInput}" placeholder="Search GIFs...">
                                <span id="${this.dom.clearBtn}">&times;</span>
                            </div>
                            <button id="${this.dom.closeBtn}">X</button>
                        </div>
                        <div id="${this.dom.results}"></div>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            const btn = document.createElement('span');
            btn.id = this.dom.triggerBtn;
            btn.className = 'inline-submit-btn';
            btn.title = 'Insert GIF';
            btn.innerHTML = '<span class="gif-icon-rect">GIF</span>';

            const smileyBtn = container.querySelector(this.dom.smileyBtnSelector);
            if (smileyBtn && smileyBtn.parentNode === container) {
                container.insertBefore(btn, smileyBtn.nextSibling);
            } else {
                container.appendChild(btn);
            }

            this.attachEvents();
        },

        attachEvents() {
            document.getElementById(this.dom.triggerBtn).addEventListener('click', () => this.openModal());
            document.getElementById(this.dom.closeBtn).addEventListener('click', () => this.closeModal());
            document.getElementById(this.dom.overlay).addEventListener('click', (e) => {
                if (e.target.id === this.dom.overlay) this.closeModal();
            });

            document.getElementById(this.dom.results).addEventListener('click', (e) => {
                if (e.target.id === 'gif-set-key-btn') this.promptForKey();
            });

            const input = document.getElementById(this.dom.searchInput);
            const clearBtn = document.getElementById(this.dom.clearBtn);

            input.addEventListener('input', (e) => {
                const val = e.target.value;
                clearBtn.style.display = val.length > 0 ? 'block' : 'none';

                clearTimeout(this.debounceTimer); // Fixed: was clearTimeOut
                this.debounceTimer = setTimeout(() => this.fetchGifs(val), 500);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    clearTimeout(this.debounceTimer);
                    this.fetchGifs(e.target.value);
                }
            });

            clearBtn.addEventListener('click', () => {
                input.value = '';
                clearBtn.style.display = 'none';
                input.focus();
                this.fetchGifs('');
            });
        },

        openModal() {
            document.getElementById(this.dom.overlay).style.display = 'flex';
            const input = document.getElementById(this.dom.searchInput);
            const clearBtn = document.getElementById(this.dom.clearBtn);

            input.focus();
            clearBtn.style.display = input.value.length > 0 ? 'block' : 'none';

            if (!this.apiKey) {
                document.getElementById(this.dom.results).innerHTML = this.config.NO_KEY_MSG;
            } else if (input.value.trim() === '') {
                this.fetchGifs('');
            }
        },

        closeModal() {
            document.getElementById(this.dom.overlay).style.display = 'none';
        },

        insertLink(url) {
            const shoutInput = document.querySelector(this.dom.shoutInput);
            if (!shoutInput) return;

            const filename = url.split('/').pop() || 'image.gif';
            const bbcode = `[url=${url}]${filename}[/url]`;

            const currentText = shoutInput.value;
            const prefix = currentText && !currentText.endsWith(' ') ? currentText + ' ' : currentText;
            shoutInput.value = prefix + bbcode + ' ';

            this.closeModal();
            shoutInput.focus();
        },

        fetchGifs(query) {
            const container = document.getElementById(this.dom.results);
            if (!this.apiKey) {
                container.innerHTML = this.config.NO_KEY_MSG;
                return;
            }

            container.innerHTML = '<div class="gif-loader">Loading...</div>';

            const type = query ? 'search' : 'featured';
            const qParam = query ? `&q=${encodeURIComponent(query)}` : '';

            const now = new Date();
            const dateKey = now.toISOString().split('T')[0];
            const timeBlock = Math.floor(now.getHours() / 6);
            const cacheKey = `${dateKey}-${timeBlock}`;

            const url = `https://tenor.googleapis.com/v2/${type}?key=${this.apiKey}&client_key=${this.config.CLIENT_KEY}&limit=${this.config.LIMIT}&media_filter=minimal${qParam}&ts=${cacheKey}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.error) throw new Error(data.error.message);
                        this.renderResults(data.results);
                    } catch (e) {
                        console.error(e);
                        container.innerHTML = `
                             <div class="gif-error">
                                <div style="margin-bottom:5px; font-size:14px; color:#e74c3c;">Error: Invalid Key</div>
                                <button id="gif-set-key-btn" class="gif-btn-small">Change API Key</button>
                                <div class="gif-help-text">It won't take more than 30 seconds</div>
                                <a href="https://developers.google.com/tenor/guides/quickstart#setup" target="_blank" class="gif-link-btn">Create API Key &nearr;</a>
                            </div>`;
                    }
                },
                onerror: () => {
                    container.innerHTML = '<div class="gif-error">Connection Failed. Check internet or adblockers.</div>';
                }
            });
        },

        renderResults(results) {
            const container = document.getElementById(this.dom.results);
            container.innerHTML = '';
            if (!results || results.length === 0) {
                container.innerHTML = '<div class="gif-loader">No GIFs found.</div>';
                return;
            }
            const fragment = document.createDocumentFragment();
            results.forEach(gif => {
                const preview = gif.media_formats.tinygif.url;
                const directLink = gif.media_formats.gif.url;
                const div = document.createElement('div');
                div.className = 'gif-item';
                div.innerHTML = `<img src="${preview}" loading="lazy">`;
                div.onclick = () => this.insertLink(directLink);
                fragment.appendChild(div);
            });
            container.appendChild(fragment);
        }
    };

    /**
     * MODULE 2: IMAGE VIEWER
     * Scans shoutbox for text links and converts them to images.
     */
    const ImageViewerModule = {
        regex: {
            image: /https?:\/\/[^\s'"><]+\.(?:png|jpe?g|webp|gif)(?:\?[^\s'">]*)?(?=[^\w\-]|$)/gi,
            tenor: /https?:\/\/(?:c|media)\.tenor\.com\/[^\s'"><]+/gi,
            lightshot: /https?:\/\/prnt\.sc\/[a-zA-Z0-9\-_]+/gi,
            ibb: /https?:\/\/ibb\.co\.com\/[a-zA-Z0-9\-_]+/gi,
            gifyu: /https?:\/\/gifyu\.com\/image\/[a-zA-Z0-9\-_]+/gi,
            imgbox: /https?:\/\/imgbox\.com\/[a-zA-Z0-9\-_]+/gi
        },

        init() {
            this.scanAllShouts();
            this.observeChat();
        },

        resolvePageImage(url) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: { "User-Agent": "Mozilla/5.0" },
                    onload: function (response) {
                        const html = response.responseText;
                        const match = html.match(/<meta[^>]+(?:name|property)=["'](?:twitter:image:src|og:image)["'][^>]+content=["']([^"']+)["']/i);
                        if (match && match[1]) {
                            resolve(match[1]);
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: function () {
                        console.error("Page Resolve failed for", url);
                        resolve(null);
                    }
                });
            });
        },

        convertLinksInNode(node) {
            const textField = node.querySelector('.shout-text');
            if (!textField) return;

            const walker = document.createTreeWalker(textField, NodeFilter.SHOW_TEXT, null);
            const textNodes = [];
            let curr;
            while ((curr = walker.nextNode())) textNodes.push(curr);

            textNodes.forEach(textNode => {
                const text = textNode.nodeValue;
                const r = this.regex;

                if (!r.image.test(text) && !r.tenor.test(text) && !r.lightshot.test(text) &&
                    !r.ibb.test(text) && !r.gifyu.test(text) && !r.imgbox.test(text)) return;

                const frag = document.createDocumentFragment();
                let lastIndex = 0;

                r.image.lastIndex = 0; r.tenor.lastIndex = 0; r.lightshot.lastIndex = 0;
                r.ibb.lastIndex = 0; r.gifyu.lastIndex = 0; r.imgbox.lastIndex = 0;

                while (true) {
                    const mImg = r.image.exec(text);
                    const mTen = r.tenor.exec(text);
                    const mLs = r.lightshot.exec(text);
                    const mIbb = r.ibb.exec(text);
                    const mGifyu = r.gifyu.exec(text);
                    const mImgbox = r.imgbox.exec(text);

                    const matches = [
                        { type: 'img', m: mImg },
                        { type: 'tn', m: mTen },
                        { type: 'ls', m: mLs },
                        { type: 'ls', m: mIbb },
                        { type: 'ls', m: mGifyu },
                        { type: 'ls', m: mImgbox }
                    ].filter(x => x.m).sort((a, b) => a.m.index - b.m.index);

                    if (matches.length === 0) break;

                    let next = matches[0];
                    const m = next.m;
                    const url = m[0];

                    if (m.index > lastIndex) {
                        frag.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));
                    }

                    if (next.type === 'img' && url.match(/^https?:\/\/(?:www\.)?tenor\.com\//i)) {
                        next.type = 'ls';
                    }

                    if (next.type === 'img' || next.type === 'tn') {
                        const img = this.createImageElement(url, url);
                        frag.appendChild(document.createTextNode(' '));
                        frag.appendChild(img);
                        frag.appendChild(document.createTextNode(' '));
                        lastIndex = m.index + url.length;
                    } else if (next.type === 'ls') {
                        const placeholder = document.createElement('span');
                        const img = this.createImageElement(null, url);
                        img.alt = 'loading...';

                        placeholder.appendChild(document.createTextNode(' '));
                        placeholder.appendChild(img);
                        placeholder.appendChild(document.createTextNode(' '));

                        this.resolvePageImage(url).then(realUrl => {
                            if (realUrl) {
                                img.src = realUrl;
                                img.dataset.fullsrc = realUrl;
                                img.alt = 'image';
                            } else {
                                const parent = placeholder.parentNode;
                                if (parent) parent.replaceChild(document.createTextNode(url + ' '), placeholder);
                            }
                        });

                        frag.appendChild(placeholder);
                        lastIndex = m.index + url.length;
                    }

                    r.image.lastIndex = lastIndex; r.tenor.lastIndex = lastIndex; r.lightshot.lastIndex = lastIndex;
                    r.ibb.lastIndex = lastIndex; r.gifyu.lastIndex = lastIndex; r.imgbox.lastIndex = lastIndex;
                }

                if (lastIndex < text.length) {
                    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
                }

                textNode.parentNode.replaceChild(frag, textNode);
            });

            const links = textField.querySelectorAll('a');
            links.forEach(a => {
                if (a.dataset.gifProcessed) return;

                const href = a.href;

                const isTenorGif = /^https:\/\/media\.tenor\.com\/.*\.gif$/i.test(href);

                if (isTenorGif) {
                    a.dataset.gifProcessed = "true";

                    const img = this.createImageElement(href, href);

                    a.innerHTML = '';
                    a.appendChild(img);

                    a.onclick = (e) => {
                        e.preventDefault();
                    };
                }
            });
        },

        createImageElement(src, fullSrc) {
            const img = document.createElement('img');
            if (src) img.src = src;
            img.dataset.fullsrc = fullSrc;
            img.referrerPolicy = "no-referrer";
            img.style.cssText = 'max-width:100px; max-height:100px; vertical-align:middle; display:inline; margin:0 4px; cursor:pointer; border-radius:4px;';
            img.alt = 'image';
            return img;
        },

        createOverlay(img) {
            const existing = document.querySelector('.image-overlay');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.9); z-index: 10000;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer;
            `;

            const fullImg = document.createElement('img');
            fullImg.src = img.dataset.fullsrc || img.src;
            fullImg.referrerPolicy = "no-referrer";
            fullImg.style.cssText = `
                max-width: 90vw; max-height: 90vh;
                border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            `;

            overlay.appendChild(fullImg);
            overlay.onclick = () => overlay.remove();
            fullImg.onclick = (e) => e.stopPropagation();

            document.addEventListener('keydown', function escClose(e) {
                if (e.key === 'Escape') overlay.remove();
            }, { once: true });

            document.body.appendChild(overlay);
        },

        addClickHandlers() {
            document.querySelectorAll('.shout-text img[data-fullsrc]').forEach(img => {
                if (img.dataset.bound) return;
                img.dataset.bound = "true";

                img.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.createOverlay(img);
                };
                if (img.parentElement && img.parentElement.tagName === 'A') {
                    img.parentElement.onclick = (e) => e.preventDefault();
                }
            });
        },

        scanAllShouts() {
            document.querySelectorAll('.shout-item').forEach(node => this.convertLinksInNode(node));
            this.addClickHandlers();
        },

        observeChat() {
            const shoutContainer = document.querySelector('#shouts-container');
            if (shoutContainer) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((m) => {
                        m.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE &&
                                (node.classList?.contains('shout-item') || node.querySelector?.('.shout-item'))) {
                                const shoutItem = node.classList?.contains('shout-item') ? node : node.querySelector('.shout-item');
                                setTimeout(() => {
                                    this.convertLinksInNode(shoutItem);
                                    this.addClickHandlers();
                                }, 50);
                            }
                        });
                    });
                });
                observer.observe(shoutContainer, { childList: true, subtree: true });
            }
        }
    };

    // ================= EXECUTION =================
    GifSearchModule.init();
    ImageViewerModule.init();

})();