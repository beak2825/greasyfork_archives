// ==UserScript==
// @name         J-Biblio2Dou
// @namespace    http://tampermonkey.net/
// @version      2.00
// @description  Hanmoto: openBD + hanmoto sections(目次/著者プロフィール + cover); CiNii: RIS + 内容説明・目次 + cover; fill Douban new_subject; add shortcuts on Douban search pages
// @author       千叶ゃ
// @match        *://*.hanmoto.com/bd/isbn/*
// @match        *://ci.nii.ac.jp/ncid/*
// @match        *://book.douban.com/new_subject*
// @match        *://www.douban.com/search*
// @match        *://search.douban.com/book/subject_search*
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
// @downloadURL https://update.greasyfork.org/scripts/563507/J-Biblio2Dou.user.js
// @updateURL https://update.greasyfork.org/scripts/563507/J-Biblio2Dou.meta.js
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

    // 姓名规范化：
    // - 始终去掉逗号/数字
    // - 含拉丁字母：保留中间空格；保留连字符“-”，并把两边空白规整成无空白（Jean - Paul -> Jean-Paul）
    // - 纯 CJK（不含拉丁字母）：去掉所有空白；去掉“-”
    const normalizePersonName = (s) => {
        let t = String(s || '')
        .replace(/[,，]/g, '')
        .replace(/\d+/g, '')
        .trim();

        const hasLatin = /[A-Za-z]/.test(t);
        const hasCJK = /[\u3040-\u30FF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFF]/.test(t);

        if (hasLatin) {
            // 英文/混合：保留“-”，但规整成无空白连字符
            t = t.replace(/[　]+/g, ' ');      // 全角空格 -> 半角
            t = t.replace(/\s*-\s*/g, '-');    // 连字符两边空白去掉
            t = t.replace(/\s+/g, ' ').trim(); // 其他空白压成单空格
        } else if (hasCJK) {
            // 纯 CJK：去掉“-”和全部空白
            t = t.replace(/-/g, '');
            t = t.replace(/[\s　]+/g, '');
        } else {
            // 既非拉丁也非 CJK：保守处理（不删“-”，只规整空白）
            t = t.replace(/[　]+/g, ' ');
            t = t.replace(/\s+/g, ' ').trim();
        }

        return t;
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

    const appendSourceNote = (text, note) => (text ? `${text}\n\n(${note})` : text);

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
        let author_profile = cleanText(
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

        let toc = (() => {
            const h = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'))
            .find(el => (el.textContent || '').trim() === '目次');
            if (!h) return '';
            const p = h.nextElementSibling;
            if (!p) return '';
            return cleanText(p.innerHTML || p.textContent || '');
        })();

        author_profile = appendSourceNote(author_profile, 'Data from 版元ドットコム');
        toc = appendSourceNote(toc, 'Data from 版元ドットコム');

        return { toc, author_profile };
    };

    const extractHanmotoCoverFromDoc = (doc, baseUrl) => {
        const a = doc.querySelector('a[data-book-image-600]');
        const url = a ? (a.getAttribute('data-book-image-600') || '') : '';
        return toAbsUrl(url, baseUrl);
    };

    async function enrichMetaFromHanmoto(meta) {
        const sec = extractHanmotoSectionsFromDoc(document);
        const cover = extractHanmotoCoverFromDoc(document, location.href);
        return {
            ...meta,
            toc: meta.toc || sec.toc,
            author_profile: meta.author_profile || sec.author_profile,
            cover: meta.cover || cover,
            _hanmoto_url: meta._hanmoto_url || location.href
        };
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

    // author / translator（B06）
    const extractContributors = (onix) => {
        const cons = onix?.DescriptiveDetail?.Contributor;
        if (!Array.isArray(cons)) return { author: [], translator: [] };

        const authors = [];
        const translators = [];

        for (const c of cons) {
            const name = normalizePersonName(c?.PersonName?.content || '');
            if (!name) continue;

            const rolesRaw = c?.ContributorRole;
            const roles = Array.isArray(rolesRaw) ? rolesRaw : (rolesRaw ? [rolesRaw] : []);
            const isTranslator = roles.map(r => String(r || '').trim().toUpperCase()).includes('B06');

            if (isTranslator) translators.push(name);
            else authors.push(name);
        }

        return { author: uniq(authors), translator: uniq(translators) };
    };

    // price (PriceAmount) from onix.ProductSupply.SupplyDetail.Price[*].PriceAmount
    const extractPriceAmount = (onix) => {
        const prices = onix?.ProductSupply?.SupplyDetail?.Price;
        if (!Array.isArray(prices) || prices.length === 0) return null;

        const pick = (p) => {
            const pa = p?.PriceAmount;
            if (pa == null) return null;
            if (typeof pa === 'object' && pa.content != null) return pa.content;
            return pa;
        };

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
        const arr = await gmGetJson(url);
        const data = Array.isArray(arr) ? arr[0] : null;
        if (!data) return null;

        const summary = data.summary || {};
        const onix = data.onix || {};
        const hanmoto = data.hanmoto || {};

        // title：优先 onix TitleText + Subtitle；否则 summary.title 再 splitTitle
        const onixTitleText = String(onix?.DescriptiveDetail?.TitleDetail?.TitleElement?.TitleText?.content || '').trim();
        const onixSubtitle = String(onix?.DescriptiveDetail?.TitleDetail?.TitleElement?.Subtitle?.content || '').trim();

        let title = '';
        let main_title = '';
        let subtitle = null;

        if (onixSubtitle) {
            main_title = onixTitleText || '';
            subtitle = onixSubtitle || null;
            title = subtitle ? `${main_title}：${subtitle}` : main_title;
        } else {
            title = String(summary.title || '').trim() || onixTitleText || '';
            const sp = splitTitle(title);
            main_title = sp.main_title;
            subtitle = sp.subtitle;
        }

        const contrib = extractContributors(onix);

        const pubdateRaw = summary.pubdate || onix?.PublishingDetail?.PublishingDate?.[0]?.Date || '';
        const pubParts = parsePubdate(pubdateRaw);

        // binding：toji + hankeidokuji（中间空格）
        const toji = String(hanmoto?.toji || '').trim();
        const hankeidokuji = String(hanmoto?.hankeidokuji || '').trim();
        const binding = [toji, hankeidokuji].filter(Boolean).join(' ').trim();

        // 紹介：末尾加 (Data from OpenBD)，但为空就不加
        const descriptionRaw = pickTextContent(onix, '03') || pickTextContent(onix, '02') || hanmoto?.maegakinado || '';
        const description = appendSourceNote(cleanText(descriptionRaw), 'Data from OpenBD');

        const price = extractPriceAmount(onix);

        // 原題（genshomei）-> Original_title
        const Original_title = String(hanmoto?.genshomei || '').trim() || null;

        return {
            title,
            main_title,
            subtitle,
            description,
            author: contrib.author,
            translator: contrib.translator,
            cover: extractCoverFromOpenBD(onix, summary) || '',
            pages: extractPages(onix),
            binding,
            price, // numeric string
            Original_title,
            publisher: summary.publisher || onix?.PublishingDetail?.Imprint?.ImprintName || '',
            isbn: normalizeIsbn(summary.isbn || summary.isbn13 || isbn),
            ...pubParts,
            toc: '',
            author_profile: '',
            _source: 'openBD'
        };
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
    // CiNii entry (RIS + 内容説明/目次 + cover)
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
        const sp = splitTitle(title);
        const authors = uniq([...(risMap.AU || [])].map(normalizePersonName));
        const publisher = (risMap.PB?.[0] || '').trim();
        const isbn = normalizeIsbn((risMap.SN?.[0] || '').trim());
        const py = (risMap.PY?.[0] || '').trim();
        const pagesRaw = (risMap.EP?.[0] || '').trim();
        const pages = pagesRaw ? pagesRaw.replace(/p$/i, '').trim() : '';

        return {
            title,
            main_title: sp.main_title,
            subtitle: sp.subtitle,
            author: authors,
            translator: [],
            publisher,
            isbn: isbn || null,
            pages: pages || null,
            ...parsePubdate(py),
            description: '',
            toc: '',
            cover: '',
            binding: '',
            price: null,
            Original_title: null,
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

        description = appendSourceNote(description, 'Data from BOOKデータベース');
        toc = appendSourceNote(toc, 'Data from BOOKデータベース');

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

    const fillListInputs = (baseId, values) => {
        if (!Array.isArray(values) || values.length === 0) return;

        const first = document.querySelector(`#${baseId}_0`) || document.querySelector(`#${baseId}`);
        if (!first) return;

        const addLink =
              first.closest('ul')?.querySelector('.add') ||
              document.querySelector('ul li:last-child .add');

        values.forEach((nameRaw, i) => {
            const name = normalizePersonName(nameRaw);
            if (!name) return;

            const selPrimary = (i === 0 && document.querySelector(`#${baseId}`)) ? `#${baseId}` : `#${baseId}_${i}`;

            if (!setValue(selPrimary, name)) {
                if (addLink) addLink.click();
                setValue(`#${baseId}_${i}`, name) || (i === 0 && setValue(`#${baseId}`, name));
            }
        });
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

        setTextarea('textarea[name="p_3_other"]', meta.description);

        if (meta.price) setValue('#p_8', `${meta.price}円+税`);

        // 原题
        if (meta.Original_title) setValue('#p_98', meta.Original_title);

        fillListInputs('p_5', meta.author);
        fillListInputs('p_41', meta.translator);

        setSelectValue('#p_7_selectYear', meta.pub_year);
        setTimeout(() => setSelectValue('#p_7_selectMonth', meta.pub_month), 250);
        setTimeout(() => setSelectValue('#p_7_selectDay', meta.pub_day), 500);

        setTextarea('textarea[name="p_40_other"]', meta.author_profile);
        setTextarea('textarea[name="p_99_other"]', meta.toc);
    }

    // -----------------------------
    // Douban search page shortcuts (www.douban.com/search & search.douban.com/book/subject_search)
    // -----------------------------
    function buildSearchLinks(keyword) {
        const kw = (keyword || '').trim();
        if (!kw) return null;

        const enc = encodeURIComponent(kw);
        return {
            hanmoto: `https://www.hanmoto.com/bd/search/top?keyword=${enc}`,
            cinii: `https://ci.nii.ac.jp/books/search?advanced=false&count=50&sortorder=7&q=${enc}&type=1&update_keep=true`,
            google: `https://www.google.com/search?q=${enc}`
    };
  }

    function injectShortcutsOnWwwDoubanSearch() {
        const kw = new URLSearchParams(location.search).get('q') || '';
        const links = buildSearchLinks(kw);
        if (!links) return;

        // 找到右侧“添加书籍/杂志/丛书/作者”的那一块（.bd 里有多个 p.pl）
        const addBookA =
              document.querySelector('a[href*="book.douban.com/new_subject?cat=1001"]') ||
              document.querySelector('a[href*="book.douban.com/new_subject"]');

        const bd = addBookA?.closest('.bd');
        if (!bd) return;

        if (bd.querySelector('#jp-books2douban-search-shortcuts')) return;

        const mkP = (href, text) => {
            const p = document.createElement('p');
            p.className = 'pl';
            const a = document.createElement('a');
            a.href = href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = `>\u00A0${text}`;
            p.appendChild(a);
            return p;
        };

        const wrap = document.createElement('div');
        wrap.id = 'jp-books2douban-search-shortcuts';
        wrap.appendChild(mkP(links.hanmoto, '在版元ドットコム检索'));
        wrap.appendChild(mkP(links.cinii, '在CiNii检索'));
        wrap.appendChild(mkP(links.google, '在Google检索'));

        // 放到原有4个链接下面：直接 append 到 bd 的末尾
        bd.appendChild(wrap);
    }

    function injectShortcutsOnSearchDoubanSubjectSearch() {
        const kw = new URLSearchParams(location.search).get('search_text') || '';
        const links = buildSearchLinks(kw);
        if (!links) return;

        const titleDiv = Array.from(document.querySelectorAll('div.title'))
        .find(el => (el.textContent || '').includes('添加豆瓣没有的图书'));
        if (!titleDiv) return;

        const container = titleDiv.parentElement;
        if (!container) return;

        if (container.querySelector('#jp-books2douban-search-shortcuts')) return;

        const mkLinkDiv = (href, label) => {
            const d = document.createElement('div');
            d.className = 'link';
            const a = document.createElement('a');
            a.href = href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = `> ${label} ${kw}`.trim();
            d.appendChild(a);
            return d;
        };

        const wrap = document.createElement('div');
        wrap.id = 'jp-books2douban-search-shortcuts';
        wrap.appendChild(mkLinkDiv(links.hanmoto, '在版元ドットコム检索'));
        wrap.appendChild(mkLinkDiv(links.cinii, '在CiNii检索'));
        wrap.appendChild(mkLinkDiv(links.google, '在Google检索'));

        // 放到原有4个链接下面：append 到 container 的末尾
        container.appendChild(wrap);
    }

    function injectDoubanSearchShortcuts() {
        const host = location.hostname || '';
        if (host === 'www.douban.com' && location.pathname === '/search') {
            injectShortcutsOnWwwDoubanSearch();
        } else if (host === 'search.douban.com' && location.pathname.includes('/book/subject_search')) {
            injectShortcutsOnSearchDoubanSubjectSearch();
        }
    }

    // -----------------------------
    // Toolbar (Hanmoto / CiNii / book.douban.com/new_subject only)
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
            toolbar.appendChild(makeButton('Add to Douban', parseAndRedirectFromHanmoto));
            return toolbar;
        }
        if (/ci\.nii\.ac\.jp/i.test(host)) {
            toolbar.appendChild(makeButton('Add to Douban', parseAndRedirectFromCiNii));
            return toolbar;
        }

        // 只在 book.douban.com/new_subject 上显示
        if (host === 'book.douban.com' && location.pathname.startsWith('/new_subject')) {
            const isPage1 = !!document.querySelector('#p_title') || !!document.querySelector('input[name="p_title"]');
            const isPage2 = !!document.querySelector('#p_2');
            const isPage3 = !!document.querySelector('input[name="img_submit"]');
            if (isPage1) toolbar.appendChild(makeButton('ISBN & Title', fillDoubanPage1));
            if (isPage2) toolbar.appendChild(makeButton('Autofill More', fillDoubanPage2));
            if (isPage3) toolbar.appendChild(makeButton('Download Cover', saveCover));
            return (toolbar.childNodes.length ? toolbar : null);
        }

        return null;
    }

    function ensureToolbar() {
        if (document.getElementById('douban-helper-toolbar')) return;
        const toolbar = createToolbarElement();
        if (!toolbar) return;

        const h1 = document.querySelector('h1');
        if (h1 && h1.parentNode) h1.insertAdjacentElement('afterend', toolbar);
        else document.body.appendChild(toolbar);
    }

    function installToolbarObserver() {
        if (window.__douban_toolbar_observer_installed) return;
        window.__douban_toolbar_observer_installed = true;

        const observer = new MutationObserver(() => {
            if (!document.getElementById('douban-helper-toolbar')) ensureToolbar();
            // 搜索页也可能是动态的
            injectDoubanSearchShortcuts();
        });
        observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', () => {
            setTimeout(() => {
                ensureToolbar();
                injectDoubanSearchShortcuts();
            }, 200);
        });

        const _pushState = history.pushState;
        history.pushState = function () {
            const r = _pushState.apply(this, arguments);
            setTimeout(() => {
                ensureToolbar();
                injectDoubanSearchShortcuts();
            }, 200);
            return r;
        };
    }

    // -----------------------------
    // Init
    // -----------------------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ensureToolbar();
            injectDoubanSearchShortcuts();
            installToolbarObserver();
        });
    } else {
        ensureToolbar();
        injectDoubanSearchShortcuts();
        installToolbarObserver();
    }
})();
