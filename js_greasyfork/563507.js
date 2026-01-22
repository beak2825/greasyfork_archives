// ==UserScript==
// @name         Jp-Books2Douban
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  Hanmoto: openBD + hanmoto sections(目次/著者プロフィール + cover); CiNii: RIS + 内容説明・目次 + cover; then fill Douban new_subject (3 steps incl. cover download)
// @author       千叶ゃ
// @match        *://*.hanmoto.com/bd/isbn/*
// @match        *://ci.nii.ac.jp/ncid/*
// @match        *://book.douban.com/new_subject*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      api.openbd.jp
// @connect      cover.openbd.jp
// @connect      *.hanmoto.com
// @connect      ci.nii.ac.jp
// @connect      *
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563507/Jp-Books2Douban.user.js
// @updateURL https://update.greasyfork.org/scripts/563507/Jp-Books2Douban.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const STORAGE_KEY = 'douban_book_meta_global';

    // -----------------------------
    // Storage (sync)
    // -----------------------------
    const storage = {
        get(key) {
            const v = GM_getValue(key);
            try { return v ? JSON.parse(v) : null; } catch (_e) { return v || null; }
        },
        set(key, val) {
            try { GM_setValue(key, JSON.stringify(val)); } catch (e) { GM_setValue(key, val); }
        }
    };

    const readStored = () => storage.get(STORAGE_KEY);
    const saveGlobal = (meta) => { if (meta) storage.set(STORAGE_KEY, meta); };

    // -----------------------------
    // Helpers
    // -----------------------------
    const cleanText = (s) => {
        if (!s) return '';
        return String(s)
            .replace(/<br\s*\/?\>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<li[^>]*>/gi, '')
            .replace(/<\/li>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/\u00a0/g, ' ')
            .replace(/\r/g, '')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    };

    const normalizeIsbn = (raw) => {
        if (!raw) return '';
        const s = String(raw).trim().replace(/[\s\-–—]/g, '');
        const cleaned = s.replace(/[^0-9Xx]/g, '');
        return cleaned.toUpperCase();
    };

    const parsePubdate = (s) => {
        if (!s) return {};
        const str = String(s).trim();
        if (/^\d{8}$/.test(str)) return { pub_year: +str.slice(0, 4), pub_month: +str.slice(4, 6), pub_day: +str.slice(6, 8) };
        if (/^\d{6}$/.test(str)) return { pub_year: +str.slice(0, 4), pub_month: +str.slice(4, 6) };
        if (/^\d{4}$/.test(str)) return { pub_year: +str };
        return {};
    };

    const splitTitle = (title) => {
        const full = (title || '').trim();
        if (!full) return { main_title: '', subtitle: null };

        if (full.includes('：')) {
            const [l, ...r] = full.split('：');
            return { main_title: l.trim(), subtitle: r.join('：').trim() || null };
        }
        if (full.includes(':')) {
            const [l, ...r] = full.split(':');
            return { main_title: l.trim(), subtitle: r.join(':').trim() || null };
        }

        // split by dash-runs (e.g. "――", "——", "—", "―", "-" etc)
        const dashRunRe = /[\-‐-–—―]{1,}/;
        const spacedDashRe = /[\s　][\-‐-–—―]+[\s　]/;
        if (dashRunRe.test(full) || spacedDashRe.test(full)) {
            const parts = full.split(/[\s　]*[\-‐-–—―]+[\s　]*/).filter(Boolean);
            if (parts.length >= 2) {
                const main = parts[0].trim();
                const sub = parts.slice(1).join(' ').trim();
                if (main && sub) return { main_title: main, subtitle: sub || null };
            }
        }

        return { main_title: full, subtitle: null };
    };

    const normalizeFormat = (binding) => {
        if (!binding) return '';
        const lower = String(binding).toLowerCase();
        if (lower.includes('paperback')) return 'Paperback';
        if (lower.includes('hardcover') || lower.includes('hardback')) return 'Hardcover';
        if (lower.includes('ebook')) return 'eBook';
        if (lower.includes('audiobook')) return 'Audiobook';
        if (lower.includes('並製') || lower.includes('ソフトカバー') || lower.includes('ペーパーバック')) return 'Paperback';
        if (lower.includes('上製') || lower.includes('ハードカバー')) return 'Hardcover';
        if (lower.includes('電子') || lower.includes('kindle')) return 'eBook';
        return String(binding).trim();
    };

    const uniq = (arr) => {
        const out = [];
        const seen = new Set();
        (arr || []).forEach(x => {
            const v = (x || '').trim();
            if (!v || seen.has(v)) return;
            seen.add(v);
            out.push(v);
        });
        return out;
    };

    const gmGetJson = (url) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: { 'Accept': 'application/json' },
            onload: (res) => { try { resolve(JSON.parse(res.responseText)); } catch (e) { reject(e); } },
            onerror: reject,
            ontimeout: () => reject(new Error('Request timeout'))
        });
    });

    const gmGetText = (url) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'text',
            onload: (res) => resolve({ text: res.responseText || '', status: res.status }),
            onerror: reject,
            ontimeout: () => reject(new Error('Request timeout'))
        });
    });

    const toAbsUrl = (maybeUrl, baseUrl) => {
        const u = String(maybeUrl || '').trim();
        if (!u) return '';
        try { return new URL(u, baseUrl || location.href).href; } catch (_e) { return u; }
    };

    const waitForElement = (selector, timeoutMs = 4000, intervalMs = 100) => new Promise((resolve) => {
        const start = Date.now();
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) { clearInterval(timer); resolve(el); return; }
            if (Date.now() - start >= timeoutMs) { clearInterval(timer); resolve(null); }
        }, intervalMs);
    });

    // -----------------------------
    // Hanmoto: sections + cover (LIVE DOM only)
    // -----------------------------
    const extractHanmotoSectionsFromDoc = (doc) => {
        // 著者プロフィール：h3 + note；h3 行压缩多余空格
        const author_profile = cleanText(
            Array.from(doc.querySelectorAll('.book-author-profiles .book-author-profile'))
            .map(block => {
                const h3 = block.querySelector('h3');
                const nameLine = h3 ? String(h3.textContent || '').replace(/\s+/g, ' ').trim() : '';
                const noteEl = block.querySelector('.book-author-note') || block.querySelector('.book-info-more') || block.querySelector('p');
                const note = noteEl ? String(noteEl.textContent || '').trim() : '';
                return [nameLine, note].filter(Boolean).join('\n');
            })
            .filter(Boolean)
            .join('\n\n')
        );

        // 目次：h2(目次) + nextElementSibling(p.book-info-more...)，用 innerHTML 保留 <br>
        const toc = (() => {
            const h = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'))
            .find(el => (el.textContent || '').trim() === '目次');
            if (!h) return '';
            const p = h.nextElementSibling;
            if (!p) return '';
            return cleanText(p.innerHTML || p.textContent || '');
        })();

        return { toc, author_profile };
    };

    const extractHanmotoCoverFromDoc = (doc, baseUrl) => {
        const a = doc.querySelector('a[data-book-image-600]');
        const url = a ? (a.getAttribute('data-book-image-600') || '') : '';
        return toAbsUrl(url, baseUrl);
    };

    async function enrichMetaFromHanmoto(meta) {
        try {
            const sec = extractHanmotoSectionsFromDoc(document);
            const cover = extractHanmotoCoverFromDoc(document, location.href);
            return {
                ...meta,
                toc: meta.toc || sec.toc,
                author_profile: meta.author_profile || sec.author_profile,
                cover: meta.cover || cover,
                _hanmoto_url: meta._hanmoto_url || location.href
            };
        } catch (e) {
            console.warn('[Hanmoto] enrich failed:', e);
            return meta;
        }
    }

    // -----------------------------
    // openBD
    // -----------------------------
    const pickTextContent = (onix, textType) => {
        const tc = onix?.CollateralDetail?.TextContent;
        if (!Array.isArray(tc)) return '';
        const hit = tc.find(x => String(x?.TextType) === String(textType));
        return hit?.Text || '';
    };

    const extractCoverFromOpenBD = (onix, summary) => {
        if (summary?.cover) return summary.cover;
        const sr = onix?.CollateralDetail?.SupportingResource;
        if (Array.isArray(sr)) {
            for (const r of sr) {
                const rv = r?.ResourceVersion;
                if (Array.isArray(rv)) {
                    for (const v of rv) {
                        if (v?.ResourceLink) return v.ResourceLink;
                    }
                }
            }
        }
        return '';
    };

    const extractPages = (onix) => {
        const ex = onix?.DescriptiveDetail?.Extent;
        if (!Array.isArray(ex)) return null;
        const pages = ex.find(x => String(x?.ExtentType) === '11')?.ExtentValue;
        return pages ? String(pages) : null;
    };

    const extractContributors = (onix) => {
        const cons = onix?.DescriptiveDetail?.Contributor;
        if (!Array.isArray(cons)) return [];
        return uniq(cons.map(c => c?.PersonName?.content?.trim()).filter(Boolean));
    };

    // NEW: price (PriceAmount) from openBD onix.ProductSupply.SupplyDetail.Price[*].PriceAmount
    const extractPriceAmount = (onix) => {
        const prices = onix?.ProductSupply?.SupplyDetail?.Price;
        if (!Array.isArray(prices) || prices.length === 0) return null;

        const pick = (p) => {
            const pa = p?.PriceAmount;
            if (pa == null) return null;
            if (typeof pa === 'object' && pa.content != null) return pa.content;
            return pa;
        };

        // Prefer PriceType=01 if exists; else first usable
        let preferred = prices.find(p => String(p?.PriceType) === '01');
        let v = pick(preferred);
        if (v == null) {
            for (const p of prices) {
                v = pick(p);
                if (v != null) break;
            }
        }

        if (v == null) return null;
        const s = String(v).replace(/[^\d]/g, '');
        return s || null;
    };

    async function fetchOpenBDMetaByIsbn(isbnRaw) {
        const isbn = normalizeIsbn(isbnRaw);
        if (!isbn) return null;

        const url = `https://api.openbd.jp/v1/get?isbn=${encodeURIComponent(isbn)}`;
        try {
            const arr = await gmGetJson(url);
            const data = Array.isArray(arr) ? arr[0] : null;
            if (!data) return null;

            const summary = data.summary || {};
            const onix = data.onix || {};
            const hanmoto = data.hanmoto || {};

            const title = summary.title
            || onix?.DescriptiveDetail?.TitleDetail?.TitleElement?.TitleText?.content
            || '';

            const authors = extractContributors(onix);
            const pubdateRaw = summary.pubdate || onix?.PublishingDetail?.PublishingDate?.[0]?.Date || '';
            const pubParts = parsePubdate(pubdateRaw);

            const binding = hanmoto?.hankeidokuji || '';
            //      const format = normalizeFormat(binding);

            const description = pickTextContent(onix, '03') || pickTextContent(onix, '02') || hanmoto?.maegakinado || '';

            const price = extractPriceAmount(onix);

            return {
                title,
                ...splitTitle(title),
                description: cleanText(description),
                author: authors,
                cover: extractCoverFromOpenBD(onix, summary) || '',
                pages: extractPages(onix),
                binding,
                //        format,
                price, // numeric string (e.g. "1500")
                publisher: summary.publisher || onix?.PublishingDetail?.Imprint?.ImprintName || '',
                isbn: normalizeIsbn(summary.isbn || summary.isbn13 || isbn),
                ...pubParts,
                toc: '',
                author_profile: '',
                _source: 'openBD'
            };
        } catch (e) {
            console.warn('[openBD] fetch failed:', e);
            return null;
        }
    }

    // -----------------------------
    // Hanmoto entry
    // -----------------------------
    function extractIsbnFromHanmotoUrl() {
        const m = location.pathname.match(/\/bd\/isbn\/([0-9Xx\-–—]+)/);
        return m ? normalizeIsbn(m[1]) : '';
    }

    async function extractHanmotoMeta() {
        const isbn = extractIsbnFromHanmotoUrl();
        const ob = await fetchOpenBDMetaByIsbn(isbn);
        if (!ob) throw new Error('openBD fetch failed');
        const enriched = await enrichMetaFromHanmoto(ob);
        saveGlobal(enriched);
        console.log('[Hanmoto] Extracted meta:', enriched);
        return enriched;
    }

    // -----------------------------
    // CiNii entry (RIS + 内容説明/目次 + cover) — no extra fallbacks
    // -----------------------------
    function extractNcidFromCiNiiUrl() {
        const m = location.pathname.match(/\/ncid\/([^\/?#]+)/);
        return m ? m[1] : '';
    }

    function parseRIS(risText) {
        const s = String(risText || '').replace(/\r/g, '\n');
        const re = /(?:^|\s)([A-Z0-9]{2})\s*-\s*/g;
        const out = {};
        let m, lastIndex = 0, lastTag = null;

        while ((m = re.exec(s)) !== null) {
            if (lastTag) {
                const val = s.slice(lastIndex, m.index).trim();
                if (val) (out[lastTag] ||= []).push(val);
            }
            lastTag = m[1];
            lastIndex = re.lastIndex;
        }
        if (lastTag) {
            const val = s.slice(lastIndex).trim();
            if (val) (out[lastTag] ||= []).push(val);
        }
        return out;
    }

    const risToMeta = (risMap) => {
        const title = (risMap.TI?.[0] || '').trim();
        const authors = uniq([...(risMap.AU || [])]);
        const publisher = (risMap.PB?.[0] || '').trim();
        const isbn = normalizeIsbn((risMap.SN?.[0] || '').trim());
        const py = (risMap.PY?.[0] || '').trim();
        const pagesRaw = (risMap.EP?.[0] || '').trim();
        const pages = pagesRaw ? pagesRaw.replace(/p$/i, '').trim() : '';

        return {
            title,
            ...splitTitle(title),
            author: authors,
            publisher,
            isbn: isbn || null,
            pages: pages || null,
            ...parsePubdate(py),
            description: '',
            toc: '',
            cover: '',
            format: '',
            binding: '',
            price: null,
            author_profile: '',
            _source: 'CiNii'
        };
    };

    function extractContentsFromCiNiiLiveDom() {
        const container = document.querySelector('.dataContainer.biblio-contents.toc');
        if (!container) return { description: '', toc: '' };

        let description = '';
        let toc = '';

        const kinds = Array.from(container.querySelectorAll('p.toc-kind'));
        for (const kindEl of kinds) {
            const kind = (kindEl.textContent || '').trim();
            const bodyEl = kindEl.nextElementSibling;
            if (!bodyEl || !bodyEl.classList.contains('toc-body')) continue;

            if (kind.includes('内容説明')) {
                description = cleanText(bodyEl.innerHTML || bodyEl.textContent || '');
            } else if (kind.includes('目次')) {
                const lis = Array.from(bodyEl.querySelectorAll('li'));
                toc = lis.length
                    ? cleanText(lis.map(li => li.textContent || '').join('\n'))
                : cleanText(bodyEl.innerHTML || bodyEl.textContent || '');
            }
        }
        return { description, toc };
    }

    function extractCoverFromCiNiiLiveDom() {
        const img = document.querySelector('#biblio-image img.biblio-image');
        const src = img ? (img.getAttribute('src') || '') : '';
        return toAbsUrl(src, location.href);
    }

    async function extractCiNiiMeta() {
        const ncid = extractNcidFromCiNiiUrl();
        if (!ncid) throw new Error('NCID not found');

        const risUrl = `https://ci.nii.ac.jp/ncid/${encodeURIComponent(ncid)}.ris`;
        const { text: risText, status } = await gmGetText(risUrl);
        if (status >= 400) throw new Error(`RIS fetch failed: HTTP ${status}`);

        const risMap = parseRIS(risText);
        const meta = risToMeta(risMap);

        // wait a bit for the toc block to exist (still LIVE DOM, not a fallback source)
        await waitForElement('.dataContainer.biblio-contents.toc', 4000, 100);

        const { description, toc } = extractContentsFromCiNiiLiveDom();
        meta.description = description || '';
        meta.toc = toc || '';
        meta.cover = extractCoverFromCiNiiLiveDom() || '';

        meta._ncid = ncid;
        meta._ris_url = risUrl;

        saveGlobal(meta);
        console.log('[CiNii] Extracted meta:', meta);
        return meta;
    }

    // -----------------------------
    // Cover download (GM_download)
    // -----------------------------
    async function saveCover() {
        const meta = readStored();
        if (!meta || !meta.cover) {
            alert('No cover URL found (meta.cover is empty).');
            return null;
        }
        const url = meta.cover;
        const safeBase = (meta.main_title || meta.title || 'cover').trim().replace(/[\\/:*?"<>|]+/g, '_');
        const filename = `${safeBase}.jpg`;

        if (typeof GM_download === 'function') {
            return await new Promise((resolve) => {
                GM_download({
                    url,
                    name: filename,
                    onload: () => resolve(url),
                    onerror: (e) => { console.error('GM_download failed:', e); resolve(null); }
                });
            });
        }

        window.open(url, '_blank', 'noopener,noreferrer');
        return url;
    }

    // -----------------------------
    // Redirect flows
    // -----------------------------
    async function parseAndRedirectFromHanmoto() {
        try {
            await extractHanmotoMeta();
            setTimeout(() => window.open('https://book.douban.com/new_subject', '_blank'), 300);
        } catch (e) {
            console.error('[Hanmoto] error:', e);
            alert(`Hanmoto -> Douban: failed: ${e?.message || e}`);
        }
    }

    async function parseAndRedirectFromCiNii() {
        try {
            await extractCiNiiMeta();
            setTimeout(() => window.open('https://book.douban.com/new_subject', '_blank'), 300);
        } catch (e) {
            console.error('[CiNii] error:', e);
            alert(`CiNii -> Douban: failed: ${e?.message || e}`);
        }
    }

    // -----------------------------
    // Douban fill
    // -----------------------------
    const setValue = (selector, value) => {
        if (value === undefined || value === null || value === '') return false;
        const el = document.querySelector(selector);
        if (!el) return false;
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    };

    const setSelectValue = (selector, value) => {
        if (value === undefined || value === null || value === '') return false;
        const el = document.querySelector(selector);
        if (!el) return false;
        el.value = value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    };

    const setTextarea = (selector, value) => {
        if (!value) return false;
        const el = document.querySelector(selector);
        if (!el) return false;
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    };

    async function fillDoubanPage1() {
        const meta = readStored();
        if (!meta) return;
        setValue('#p_title', meta.title) || setValue('input[name="p_title"]', meta.title);
        setValue('#uid', meta.isbn) || setValue('input[name="p_uid"]', meta.isbn);
    }

    async function fillDoubanPage2() {
        const meta = readStored();
        if (!meta) return;

        const fieldMap = {
            '#p_2': 'main_title',
            '#p_42': 'subtitle',
            '#p_6': 'publisher',
            '#p_58_other': 'binding',
            '#p_9': 'isbn',
            '#p_10': 'pages'
        };

        for (const [selector, metaKey] of Object.entries(fieldMap)) {
            if (meta[metaKey] != null) setValue(selector, meta[metaKey]);
        }

        // 介绍/内容简介
        setTextarea('textarea[name="p_3_other"]', meta.description);

        // 价格：p_8，输出为「数值円+税」
        if (meta.price) {
            setValue('#p_8', `${meta.price}円+税`);
        }

        // 作者（可多作者）
        if (Array.isArray(meta.author)) {
            const addLink = document.querySelector("ul li:last-child .add");
            meta.author.forEach((name, i) => {
                const selector = `#p_5_${i}`;
                setValue(selector, name) || (addLink && addLink.click(), setValue(selector, name));
            });
        }

        // 出版日期
        setSelectValue('#p_7_selectYear', meta.pub_year);
        setTimeout(() => setSelectValue('#p_7_selectMonth', meta.pub_month), 250);
        setTimeout(() => setSelectValue('#p_7_selectDay', meta.pub_day), 500);

        // 著者プロフィール / 目次
        setTextarea('textarea[name="p_40_other"]', meta.author_profile);
        setTextarea('textarea[name="p_99_other"]', meta.toc);
    }

    // -----------------------------
    // Toolbar
    // -----------------------------
    function createToolbarElement() {
        const toolbar = document.createElement('div');
        toolbar.id = 'douban-helper-toolbar';
        toolbar.style.zIndex = 9999;
        toolbar.style.position = 'relative';

        const makeButton = (label, cb, color = '#28a745') => {
            const b = document.createElement('button');
            b.textContent = label;
            b.type = 'button';
            b.style.cssText = `padding:6px 8px;margin:6px 6px 6px 0;border-radius:4px;border:none;background:${color};color:#fff;cursor:pointer;font-weight:300;`;
            b.onclick = cb;
            return b;
        };

        const host = location.hostname || '';
        if (/hanmoto\.com/i.test(host)) {
            toolbar.appendChild(makeButton('Add to Douban (openBD + Hanmoto)', parseAndRedirectFromHanmoto));
        } else if (/ci\.nii\.ac\.jp/i.test(host)) {
            toolbar.appendChild(makeButton('Add to Douban (CiNii)', parseAndRedirectFromCiNii));
        } else if (/douban\.com/i.test(host)) {
            const isPage1 = !!document.querySelector('#p_title') || !!document.querySelector('input[name="p_title"]');
            const isPage2 = !!document.querySelector('#p_2');
            const isPage3 = !!document.querySelector('input[name="img_submit"]');
            if (isPage1) toolbar.appendChild(makeButton('ISBN & Title', fillDoubanPage1));
            if (isPage2) toolbar.appendChild(makeButton('Autofill More', fillDoubanPage2));
            if (isPage3) toolbar.appendChild(makeButton('Download Cover', saveCover));
        }

        return toolbar;
    }

    function ensureToolbar() {
        if (document.getElementById('douban-helper-toolbar')) return;
        const toolbar = createToolbarElement();
        const h1 = document.querySelector('h1');
        if (h1 && h1.parentNode) h1.insertAdjacentElement('afterend', toolbar);
        else document.body.appendChild(toolbar);
    }

    function installToolbarObserver() {
        if (window.__douban_toolbar_observer_installed) return;
        window.__douban_toolbar_observer_installed = true;

        const observer = new MutationObserver(() => {
            if (!document.getElementById('douban-helper-toolbar')) ensureToolbar();
        });
        observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', () => setTimeout(ensureToolbar, 200));
        const _pushState = history.pushState;
        history.pushState = function () {
            const r = _pushState.apply(this, arguments);
            setTimeout(ensureToolbar, 200);
            return r;
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { ensureToolbar(); installToolbarObserver(); });
    } else {
        ensureToolbar();
        installToolbarObserver();
    }
})();
