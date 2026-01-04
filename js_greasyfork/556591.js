// ==UserScript==
// @name              ExHentai Viewer+
// @namespace         https://sleazyfork.org/zh-CN/scripts/376340
// @description       ExHentai管理标签，增强搜索，改进漫画页面，预加载图片
// @match             *://exhentai.org/*
// @match             *://e-hentai.org/*
// @grant             GM_setValue
// @grant             GM_getValue
// @icon                https://e-hentai.org/favicon.ico
// @run-at            document-start
// @version           1.0
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556591/ExHentai%20Viewer%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/556591/ExHentai%20Viewer%2B.meta.js
// ==/UserScript==

const currentVersion = '1.0';
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const create = tag => document.createElement(tag);

// Data initialization
let data = {
    custom_filter: GM_getValue('custom_filter', {}),
    script_config: GM_getValue('script_config', {}),
    tag_pref: GM_getValue('tag_pref', { liked_tags: [], disliked_tags: [] })
};

// --- 1. Critical CSS Injection (No FOUC) ---
const url = window.location.href;
const host = window.location.host;
const isReader = url.includes('/s/');
const isMpv = url.includes('/mpv');
const isGallery = url.includes('/g/');

let globalCss = '';

if (isReader) {
    let bg = '#4f535b';
    let border = '1px solid #000';
    if (host === 'e-hentai.org') {
        bg = '#EDEBDF';
        border = '1px solid #5C0D12';
    }
    // Added 'contain: content' for rendering performance
    globalCss += `
        #i1 { width:98%!important; max-width:98%!important; min-width:800px; background-color: inherit!important; border: none!important; }
        #img { max-width:none!important; max-height:none!important; background-color: ${bg}!important; padding: 8px; border: ${border}; border-radius: 2px; display: block; margin: 0 auto; transition: opacity 0.2s ease-in; contain: content; }
        h1, #i2, #i5, #i6, #i7, .ip, .sn { display:none!important; }
        ::-webkit-scrollbar { display:none; }
        html { scrollbar-width: none; }
    `;
}

if (isMpv) {
    globalCss += '#pane_images_inner>div{margin:auto;}';
}

globalCss += `
    #ehv-btn-c { text-align: center; list-style: none; position: fixed; bottom: 30px; right: 30px; z-index: 999; transition: all 0.3s; will-change: transform; }
    .ehv-btn { line-height: 32px; font-size: 16px; padding: 2px; margin: 5px; color: #233; position: relative; width: 32px; height: 32px; border: none; border-radius: 50%; box-shadow: 0 0 3px 0 #0006; cursor: pointer; user-select: none; outline: none; background-color: ${host === 'e-hentai.org' ? '#D3D0D1' : '#44454B'}; background-repeat: no-repeat; background-position: center; }
    .ehv-btn:hover { box-shadow: 0 0 3px 1px #0005!important; transform: scale(1.1); }
    .ehv-btn:active { top: 1px; box-shadow: 0 0 1px 1px #0004!important; }
`;

if (data.script_config.hide_button) {
    globalCss += `
        #ehv-btn-c { padding: 80px 30px 30px 80px; bottom: 0!important; right: -80px!important; opacity: 0.5; }
        #ehv-btn-c:hover { padding: 80px 30px 30px 20px!important; right: 0!important; opacity: 1; }
    `;
}

const styleEl = document.createElement('style');
styleEl.id = 'ehv-style-early';
styleEl.textContent = globalCss;
(document.head || document.documentElement).appendChild(styleEl);

// --- Main Execution ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}

function main() {
    loadScriptData();

    if (isReader) EHViewer('s');
    else if (isMpv) EHViewer('mpv');
    else if (isGallery) handleGallery();
    else if ($('#searchbox')) handleSearchBox();
    else if (url.includes('/gallerytorrents.php')) showMagnetLink();

    // Setting Button (Deferred to idle time)
    const nbElement = $('#nb');
    if (nbElement) {
        requestIdleCallback(() => {
            let ehvSettingBtn = create('div');
            ehvSettingBtn.innerHTML = '<a href="#">EHV Settings</a>';
            ehvSettingBtn.onclick = createSettingPanel;
            nbElement.append(ehvSettingBtn);
            nbElement.style.maxWidth = 'max-content';
        });
    }

    // Defer non-critical tag highlighting
    if (window.requestIdleCallback) {
        requestIdleCallback(highlightTags);
    } else {
        setTimeout(highlightTags, 100);
    }
}

function loadScriptData() {
    if (!data.script_config.current_version) {
        data.script_config.current_version = currentVersion;
        GM_setValue('custom_filter', data.custom_filter);
        GM_setValue('script_config', data.script_config);
    }
}

function addBtnContainer() {
    let btnContainer = create('ul');
    btnContainer.id = 'ehv-btn-c';
    document.body.append(btnContainer);
    return btnContainer;
}

function EHViewer(mode) {
    const svgIcons = {
        autofit: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M8 3V5H4V9H2V3H8ZM2 21V15H4V19H8V21H2ZM22 21H16V19H20V15H22V21ZM22 9H20V5H16V3H22V9Z" fill="rgba(120,120,120,1)"></path></svg>',
        zoomIn: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748ZM10 10V7H12V10H15V12H12V15H10V12H7V10H10Z" fill="rgba(120,120,120,1)"></path></svg>',
        zoomOut: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748ZM7 10H15V12H7V10Z" fill="rgba(120,120,120,1)"></path></svg>',
        prevPage: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" fill="rgba(120,120,120,1)"></path></svg>',
        nextPage: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M13.1714 12.0007L8.22168 7.05093L9.63589 5.63672L15.9999 12.0007L9.63589 18.3646L8.22168 16.9504L13.1714 12.0007Z" fill="rgba(120,120,120,1)"></path></svg>',
        reload: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z" fill="rgba(120,120,120,1)"></path></svg>',
        gallery: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M5.82843 6.99955L8.36396 9.53509L6.94975 10.9493L2 5.99955L6.94975 1.0498L8.36396 2.46402L5.82843 4.99955H13C17.4183 4.99955 21 8.58127 21 12.9996C21 17.4178 17.4183 20.9996 13 20.9996H4V18.9996H13C16.3137 18.9996 19 16.3133 19 12.9996C19 9.68584 16.3137 6.99955 13 6.99955H5.82843Z" fill="rgba(120,120,120,1)"></path></svg>'
    };

    const btnContainer = addBtnContainer();
    let currentScale = 1;
    let autofitEnable = true;
    let cachedImg = $('#img');

    if (mode === 's') {
        const frag = document.createDocumentFragment();
        const btns = [
            { icon: svgIcons.autofit, event: 'mousedown', cb: autofit },
            { icon: svgIcons.zoomIn, event: 'mousedown', cb: e => zoomer(zoomInS) },
            { icon: svgIcons.zoomOut, event: 'mousedown', cb: e => zoomer(zoomOutS) },
            { icon: svgIcons.prevPage, event: 'click', cb: prevPage },
            { icon: svgIcons.nextPage, event: 'click', cb: nextPage },
            { icon: svgIcons.reload, event: 'click', cb: e => $('#loadfail')?.click() },
            { icon: svgIcons.gallery, event: 'click', cb: e => $('div.sb>a')?.click() }
        ];

        btns.forEach(v => {
            let btnEl = create('li');
            if (v.icon.startsWith('data:image')) {
                btnEl.style.backgroundImage = "url('" + v.icon + "')";
            } else {
                btnEl.innerHTML = v.icon;
            }
            btnEl.classList.add('ehv-btn');
            btnEl.addEventListener(v.event, v.cb);
            frag.append(btnEl);
        });
        btnContainer.append(frag);

        if (!document.body.getAttribute('data-ehv-keys')) {
            document.body.addEventListener('keydown', e => {
                const target = e.target;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

                switch (e.key) {
                    case '=': zoomInS(0.1); break;
                    case '-': zoomOutS(0.1); break;
                    case ',': window.scroll(0, 0); break;
                    case '.': window.scroll(0, window.innerHeight); break;
                    case '[': window.scrollBy(0, -window.innerHeight * 0.3); break;
                    case ']': window.scrollBy(0, window.innerHeight * 0.3); break;
                }
            });
            document.body.setAttribute('data-ehv-keys', 'true');
        }

        const attachListener = (img) => {
            if (!img) return;
            img.removeEventListener('load', setNewPage);
            img.addEventListener('load', setNewPage);
            if (img.complete && img.naturalWidth > 0) setNewPage();
        };

        attachListener(cachedImg);
        setNewPage();

        const i3 = $('#i3');
        if (i3) {
            new MutationObserver((mutations) => {
                let shouldUpdate = false;
                for (let m of mutations) {
                    if (m.type === 'childList') shouldUpdate = true;
                }
                if (shouldUpdate) {
                    cachedImg = $('#img');
                    attachListener(cachedImg);
                    setNewPage();
                }
            }).observe(i3, { childList: true });
        }

    } else if (mode === 'mpv') {
        [
            { icon: svgIcons.zoomIn, event: 'mousedown', cb: e => zoomer(zoomInMpv) },
            { icon: svgIcons.zoomOut, event: 'mousedown', cb: e => zoomer(zoomOutMpv) }
        ].forEach(v => {
            let btnEl = create('li');
            btnEl.style.backgroundImage = "url('" + v.icon + "')";
            btnEl.classList.add('ehv-btn');
            btnEl.addEventListener(v.event, v.cb);
            btnContainer.append(btnEl);
        });

        if (!document.body.getAttribute('data-ehv-mpv-keys')) {
            document.body.addEventListener('keydown', e => {
                 if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                 if(e.key === '=') zoomInMpv(0.1);
                 if(e.key === '-') zoomOutMpv(0.1);
            });
            document.body.setAttribute('data-ehv-mpv-keys', 'true');
        }
    }

    // --- High-Performance Utils ---
    function requestUpdate(updateFn) {
        window.requestAnimationFrame(updateFn);
    }

    function autofit() {
        autofitEnable = true;
        const img = cachedImg || $('#img');
        if (!img || img.naturalWidth === 0) return;

        const imgRatio = img.naturalHeight / img.naturalWidth;
        const windowRatio = window.innerHeight / window.innerWidth;

        if (imgRatio > windowRatio) {
            currentScale = (window.innerHeight - 25) / img.naturalHeight;
        } else {
            currentScale = (window.innerWidth - 25) / img.naturalWidth;
        }

        requestUpdate(() => {
            window.scrollTo(0, 0);
            applyZoomS(img);
        });
    }

    function zoomer(cb) {
        let zoomInterval = -1;
        let zoomTimeout = setTimeout(() => {
            zoomInterval = setInterval(() => cb(0.05), 50);
        }, 500);
        document.addEventListener('mouseup', () => {
            if (zoomInterval === -1) {
                cb(0.1);
                clearTimeout(zoomTimeout);
            } else {
                clearInterval(zoomInterval);
            }
        }, { once: true });
    }

    function prevPage() {
        const spans = $$('.sn div span');
        if (spans.length > 0) {
            const currentPage = spans[0].innerText.trim();
            if (currentPage !== '1') $('#prev')?.click();
            else console.log('EHV: Already on first page');
        } else {
            $('#prev')?.click();
        }
    }

    function nextPage() {
        const spans = $$('.sn div span');
        if (spans.length >= 2) {
             const currentPage = spans[0].innerText.trim();
             const totalPage = spans[1].innerText.trim();
             if (currentPage !== totalPage) $('#next')?.click();
             else console.log('EHV: Already on last page');
        } else {
            $('#next')?.click();
        }
    }

    function setNewPage() {
        const img = cachedImg || $('#img');
        if (!img) return;

        // Perform DNS prefetch on current image domain for faster next load
        try {
            const domain = new URL(img.src).origin;
            if (!document.head.querySelector(`link[href="${domain}"]`)) {
                const link = create('link');
                link.rel = 'preconnect';
                link.href = domain;
                document.head.appendChild(link);
            }
        } catch(e) {}

        const footer = $('#i4 > div:first-child');
        const spans = $$('.sn div span');

        if (footer && spans.length >= 2) {
            const curP = spans[0];
            const totP = spans[1];
            const oldText = footer.childNodes[0]?.nodeValue || '';
            if (!oldText.includes('P /')) {
                 footer.innerHTML = `${curP.innerText}P / ${totP.innerText}P :: ${footer.innerHTML} :: `;
            }
            if (!footer.querySelector('a[href^="https://exhentai.org/fullimg"]')) {
                 const imgLink = $('#i7>a');
                 if (imgLink) footer.appendChild(imgLink.cloneNode(true));
                 else footer.insertAdjacentText('beforeend', 'No download');
            }
        }

        if (autofitEnable) autofit();
        else requestUpdate(() => applyZoomS(img));

        // Start Navigation Optimization
        if (window.requestIdleCallback) {
            requestIdleCallback(optimizeNavigation);
        } else {
            setTimeout(optimizeNavigation, 50);
        }
    }

    function zoomInS(pace = 0.02) {
        autofitEnable = false;
        currentScale += pace;
        requestUpdate(() => applyZoomS(cachedImg));
    }

    function zoomOutS(pace = 0.02) {
        autofitEnable = false;
        currentScale -= pace;
        requestUpdate(() => applyZoomS(cachedImg));
    }

    function applyZoomS(img) {
        if (!img) return;
        const originalWidth = img.naturalWidth || img.width;
        if (originalWidth > 0) {
            img.style.width = (originalWidth * currentScale) + 'px';
            img.style.height = 'auto';
        }
    }

    // --- 3. Optimized Navigation & Preloader (Regex + Cache) ---
    function optimizeNavigation() {
        const nextLink = $('#next');
        if (nextLink) processLink(nextLink, true);

        const prevLink = $('#prev');
        if (prevLink) processLink(prevLink, false);
    }

    function processLink(element, isNext) {
        const targetUrl = element.href;
        if (!targetUrl || targetUrl === window.location.href || element.getAttribute('data-ehv-checked') === 'true') return;
        element.setAttribute('data-ehv-checked', 'true');

        // Check Session Cache first (Instant Fix)
        const cacheKey = `ehv_fix_${targetUrl}`;
        const cachedFix = sessionStorage.getItem(cacheKey);
        if (cachedFix) {
            console.log('EHV: Applied cached fix', cachedFix);
            forceLinkRewrite(element, cachedFix);
            if (isNext && $('#i3 > a')) forceLinkRewrite($('#i3 > a'), cachedFix);
            // Preload cached
            preloadUrl(cachedFix, true);
            return;
        }

        // Fetch with high priority
        fetch(targetUrl, { priority: 'high' })
            .then(response => response.text())
            .then(html => {
                // Regex Extraction (Much faster than DOMParser)
                // Extract src
                const srcMatch = html.match(/<img[^>]*id="img"[^>]*src="([^"]+)"/i);
                // Extract onerror
                const errorMatch = html.match(/<img[^>]*id="img"[^>]*onerror="([^"]+)"/i);

                if (srcMatch && srcMatch[1]) {
                    const imgSrc = srcMatch[1].replace(/&amp;/g, '&');
                    const preloader = new Image();

                    preloader.onload = () => { /* OK */ };

                    preloader.onerror = () => {
                        console.warn(`EHV: ${isNext ? 'Next' : 'Prev'} broken. Rewriting...`);

                        // Extract nl code from onerror string
                        if (errorMatch && errorMatch[1]) {
                            const nlMatch = errorMatch[1].match(/nl\('([^']+)'\)/);
                            if (nlMatch && nlMatch[1]) {
                                const sep = targetUrl.includes('?') ? '&' : '?';
                                const fixedUrl = `${targetUrl}${sep}nl=${nlMatch[1]}`;

                                // Apply fix
                                forceLinkRewrite(element, fixedUrl);
                                if (isNext && $('#i3 > a')) forceLinkRewrite($('#i3 > a'), fixedUrl);

                                // Cache the fix!
                                sessionStorage.setItem(cacheKey, fixedUrl);

                                // Recursive Preload of the Fixed URL
                                preloadUrl(fixedUrl, true);
                            }
                        }
                    };
                    preloader.src = imgSrc;
                }
            })
            .catch(() => {});
    }

    // Helper for recursive preloading via regex
    function preloadUrl(url, isFixed) {
        fetch(url, { priority: 'high' })
            .then(r => r.text())
            .then(html => {
                const srcMatch = html.match(/<img[^>]*id="img"[^>]*src="([^"]+)"/i);
                if (srcMatch && srcMatch[1]) {
                     new Image().src = srcMatch[1].replace(/&amp;/g, '&');
                     if(isFixed) console.log('EHV: Fixed failover image preloaded.');
                }
            });
    }

    function forceLinkRewrite(el, newUrl) {
        el.href = newUrl;
        el.removeAttribute('onclick');
        // Removing listeners by cloning
        const newEl = el.cloneNode(true);
        el.parentNode.replaceChild(newEl, el);
    }

    function zoomInMpv(pace) { changeMpvScale(pace); }
    function zoomOutMpv(pace) { changeMpvScale(-pace); }
    function changeMpvScale(pace) {
        const pImg = $('#pane_images');
        const img1 = $('#image_1');
        if(!pImg || !img1) return;

        const maxW = parseFloat(pImg.style.width) - 20;
        const orgW = parseFloat(img1.style.maxWidth);

        let newS = currentScale + pace;
        if (orgW * newS < 200) newS = currentScale;
        if (orgW * newS > maxW) newS = currentScale;

        currentScale = newS;
        const finalW = orgW * currentScale;

        requestUpdate(() => {
             let style = $('#custom-width');
             if(!style) {
                 style = create('style'); style.id = 'custom-width';
                 document.head.appendChild(style);
             }
             style.textContent = `img[id^="imgsrc"], div[id^="image"]{width:${finalW}px!important;height:auto!important; max-width:100%!important;min-width:200px!important}`;
        });
    }
}


function requestIdleCallbackPolyfill(cb) {
    setTimeout(() => {
        cb({
            didTimeout: false,
            timeRemaining: () => 50
        });
    }, 1);
}
if (!window.requestIdleCallback) window.requestIdleCallback = requestIdleCallbackPolyfill;

function handleGallery() {
    let searchBox = create('form');
    searchBox.innerHTML = `<p class="nopm"><input type="text" id="f_search" name="f_search" placeholder="Search Keywords" value="" size="60"><input type="submit" name="f_apply" value="Search"></p>`;
    Object.assign(searchBox.style, {display:'none', width:'720px', margin:'10px auto', border:'2px ridge black', padding:'10px'});
    searchBox.action = 'https://' + window.location.host + '/';
    searchBox.method = 'get';
    $('.gm')?.before(searchBox);

    const tbody = $('#taglist > table > tbody');
    if (tbody) {
        tbody.insertAdjacentHTML('beforeend', `<tr><td class="tc">EHV:</td><td><div id="ehv-panel-btn" class="gt" style="cursor:pointer">show panel</div></td></tr>`);
        $('#ehv-panel-btn').onclick = (e) => {
            const t = e.target;
            const isHidden = searchBox.style.display === 'none';
            searchBox.style.display = isHidden ? 'block' : 'none';
            t.innerText = isHidden ? 'hide panel' : 'show panel';
        };

        setPanel();
        tbody.addEventListener('contextmenu', (e) => {
            const t = e.target;
            if (t.tagName === 'A') {
                e.preventDefault();
                const input = $('#f_search');
                if(!input) return;
                const tag = t.href.split('/').pop().replaceAll('+', ' ');
                const filter = `"${tag}" `;

                if (!input.value.endsWith(' ') && input.value.length > 0) input.value += ' ';

                if (input.value.includes(filter)) input.value = input.value.replace(filter, '');
                else input.value += filter;
            }
        });
    }
}

function handleSearchBox() {
    setPanel();
    const ehvPanel = $('#ehv-panel');
    if (!ehvPanel) return;

    if (data.script_config.hide_panel) {
        ehvPanel.style.display = 'none';
        const a = create('a');
        a.textContent = '[Show EHV Panel]';
        a.href = '#';
        a.style.marginLeft = '1em';
        a.onclick = () => {
             const hidden = ehvPanel.style.display === 'none';
             ehvPanel.style.display = hidden ? 'block' : 'none';
             a.textContent = hidden ? '[Hide EHV Panel]' : '[Show EHV Panel]';
        };
        $$('#searchbox>form>div')[1]?.append(a);
    } else {
        $('#ehv-panel-btn')?.remove();
    }
}

function setPanel() {
    const input = $('#f_search');
    const container = input?.parentNode;
    if (!container) return;

    if (!$('#panel-style')) {
        const s = create('style'); s.id = 'panel-style';
        s.textContent = `#ehv-panel > input[type="button"]{ margin: 2px; }`;
        document.head.append(s);
    }

    let p = $('#ehv-panel');
    if (p) p.remove();
    p = create('div');
    p.className = 'nopm';
    p.id = 'ehv-panel';
    p.style.paddingTop = '8px';

    const frag = document.createDocumentFragment();
    for (let key in data.custom_filter) {
        let btn = create('input');
        btn.type = 'button';
        btn.value = key;
        btn.title = data.custom_filter[key].toString();

        btn.onclick = (e) => {
            const val = data.custom_filter[key];
            if (!input.value.endsWith(' ') && input.value.length > 0) input.value += ' ';

            const exists = val.every(v => input.value.includes(`"${v}"`));
            if(exists) {
                val.forEach(v => input.value = input.value.replaceAll(`"${v}" `, ''));
                e.target.style.filter = '';
            } else {
                val.forEach(v => input.value += `"${v}" `);
                e.target.style.filter = 'invert(20%)';
            }
        };
        btn.oncontextmenu = (e) => {
            e.preventDefault();
            if(confirm('Delete tag?')) {
                delete data.custom_filter[key];
                GM_setValue('custom_filter', data.custom_filter);
                setPanel();
            }
        };

        if (data.custom_filter[key].every(v => input.value.includes(`"${v}"`))) {
            btn.style.filter = 'invert(20%)';
        }
        frag.append(btn);
    }

    let addBtn = create('input');
    addBtn.type = 'button';
    addBtn.value = '+';
    addBtn.onclick = () => {
        const res = prompt('Format: [tag] or [name@tag] or [name@tag+tag]');
        if(!res) return;
        const parts = res.split('@');
        if(parts.length === 2) data.custom_filter[parts[0]] = parts[1].split('+');
        else if(parts[0]) data.custom_filter[parts[0]] = [parts[0]];
        else return;

        GM_setValue('custom_filter', data.custom_filter);
        setPanel();
    };
    addBtn.oncontextmenu = (e) => {
        e.preventDefault();
        data.script_config.hide_panel = confirm('Hide EHV panel default?');
        data.script_config.hide_button = confirm('Hide comic buttons default?');
        GM_setValue('script_config', data.script_config);
    };
    frag.append(addBtn);
    p.append(frag);
    container.append(p);

    const sBtn = $('#f_search+input');
    if (sBtn) {
        sBtn.title = 'Right click for new tab';
        sBtn.oncontextmenu = (e) => {
            e.preventDefault();
            open(`https://${location.host}/?f_search=${encodeURIComponent(input.value)}`);
        };
    }
}

function showMagnetLink() {
    const links = $$('a[href$=".torrent"]');
    for (const link of links) {
        const hash = link.href.match(/[\w\d]{40}/);
        if (hash) {
            const mag = create('a');
            mag.href = `magnet:?xt=urn:btih:${hash[0]}&dn=${encodeURIComponent(link.innerText)}`;
            mag.innerText = '[MAGNET] ';
            link.before(mag);
        }
    }
}

function createSettingPanel() {
    let div = create('div');
    Object.assign(div.style, {
        position:'fixed', top:0, left:0, width:'100vw', height:'100vh',
        zIndex:9999, display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'
    });
    div.innerHTML = `
        <div style="background:#ddd; padding:20px; border-radius:5px; display:flex; flex-direction:column; gap:10px; width:500px;">
            <label>Liked Tags (comma separated):</label>
            <textarea id="ehv-liked" rows="4"></textarea>
            <label>Disliked Tags:</label>
            <textarea id="ehv-disliked" rows="4"></textarea>
            <div style="text-align:right; margin-top:10px;">
                <button id="ehv-save">Save</button>
                <button id="ehv-cancel">Cancel</button>
            </div>
        </div>
    `;
    document.body.append(div);

    const pref = GM_getValue('tag_pref', { liked_tags: [], disliked_tags: [] });
    $('#ehv-liked').value = pref.liked_tags.join(', ');
    $('#ehv-disliked').value = pref.disliked_tags.join(', ');

    $('#ehv-save').onclick = () => {
        const parse = (id) => $(id).value.split(',').map(s=>s.trim()).filter(s=>s);
        pref.liked_tags = parse('#ehv-liked');
        pref.disliked_tags = parse('#ehv-disliked');
        data.tag_pref = pref;
        GM_setValue('tag_pref', pref);
        highlightTags();
        div.remove();
    };
    $('#ehv-cancel').onclick = () => div.remove();
}

function highlightTags() {
    const liked = new Set(data.tag_pref.liked_tags);
    const disliked = new Set(data.tag_pref.disliked_tags);
    if (liked.size === 0 && disliked.size === 0) return;

    const tags = $$('.gt, .gtl');
    for (const t of tags) {
        const txt = (t.firstElementChild?.tagName === 'A' ? t.firstElementChild : t).textContent?.trim();
        if (!txt) continue;

        if (liked.has(txt)) t.style.backgroundColor = '#CCE8';
        else if (disliked.has(txt)) t.style.backgroundColor = '#2338';
        else t.style.backgroundColor = '';
    }
}