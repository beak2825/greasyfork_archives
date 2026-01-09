// ==UserScript==
// @name         Literotica Enhanced Story Downloader
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Download Literotica stories in HTML, TXT, EPUB, or MOBI format
// @author       Merlin_McNasty (Enhanced)
// @match        https://www.literotica.com/s/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/561886/Literotica%20Enhanced%20Story%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561886/Literotica%20Enhanced%20Story%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLE_CSS = `
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; background: #f9f9f9; color: #333; }
        .story-title { font-size: 24px; font-weight: bold; color: #900; }
        .story-meta { font-size: 14px; color: #666; margin-bottom: 20px; }
        .story-text { font-size: 16px; margin-bottom: 20px; white-space: pre-wrap; }
    `;

    const BUTTON_STYLES = `
        .lit-download-wrapper {
            display: inline-flex;
            gap: 8px;
            align-items: center;
            padding: 12px 0;
            margin: 10px 0;
        }
        .lit-download-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .lit-download-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .lit-download-btn:active {
            transform: translateY(0);
        }
        .lit-download-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .lit-download-btn svg {
            width: 14px;
            height: 14px;
            margin-right: 6px;
            vertical-align: middle;
            display: inline-block;
        }
    `;

    function addStyles() {
        if (document.getElementById('lit-download-styles')) return;
        const style = document.createElement('style');
        style.id = 'lit-download-styles';
        style.textContent = BUTTON_STYLES;
        document.head.appendChild(style);
    }

    function createButton(text, format) {
        const btn = document.createElement('button');
        btn.className = 'lit-download-btn';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            ${text}
        `;
        btn.onclick = () => downloadStory(format);
        return btn;
    }

    function addDownloadButtons() {
        if (document.querySelector('.lit-download-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'lit-download-wrapper';

        wrapper.appendChild(createButton('HTML', 'html'));
        wrapper.appendChild(createButton('TXT', 'txt'));
        wrapper.appendChild(createButton('EPUB', 'epub'));

        const container = document.querySelector('.page__main, .panel, main, .story-container, .story-page') || document.body;
        try {
            container.insertBefore(wrapper, container.firstChild);
        } catch (e) {
            document.body.insertBefore(wrapper, document.body.firstChild);
        }
        console.log('Download buttons added');
    }

    function parseHTMLString(html) {
        const parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
    }

    function fetchPage(pageUrl) {
        if (!pageUrl) return Promise.resolve(null);
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => reject(new Error('Fetch timeout')), 30000);
            GM_xmlhttpRequest({
                method: 'GET',
                url: pageUrl,
                headers: {
                    'Referer': window.location.href,
                    'Cookie': document.cookie,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'User-Agent': navigator.userAgent
                },
                onload: (response) => {
                    clearTimeout(timeoutId);
                    if (response.status === 200) {
                        const doc = parseHTMLString(response.responseText);
                        doc._url = pageUrl;
                        resolve(doc);
                    } else {
                        reject(new Error(`Failed with status ${response.status}`));
                    }
                },
                onerror: (error) => {
                    clearTimeout(timeoutId);
                    reject(error);
                }
            });
        });
    }

    const anchorBlacklistPattern = /\/authors?\/|\/u\/|followers|stories$|report|signup|login|logout|\/user|\/users|facebook|twitter|instagram|mailto:|\/profile/i;

    function isUIElement(text) {
        const uiPatterns = [
            /log\s*in\s*to\s*change/i,
            /switch\s*back\s*to\s*classic/i,
            /help\s*us\s*make\s*literotica/i,
            /november\s*\d+\s*update/i,
            /exciting\s*changes\s*coming/i,
            /sign\s*up/i,
            /create\s*account/i,
            /literotica\s*podcast/i,
            /advertisement/i,
            /cookies?\s*settings?/i
        ];
        return uiPatterns.some(pattern => pattern.test(text));
    }

    function sanitizeParagraphHTML(p) {
        const text = (p.textContent || '').trim();

        // Filter out UI elements
        if (isUIElement(text)) return '';

        const clone = p.cloneNode(true);
        clone.querySelectorAll('img').forEach(img => {
            const w = img.width || img.naturalWidth || 0;
            const h = img.height || img.naturalHeight || 0;
            if ((w && w < 80) || (h && h < 80) || img.className.includes('avatar') || img.className.includes('userpic') || img.closest('.usercard') || img.closest('.author')) {
                img.remove();
            }
        });
        clone.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href') || '';
            if (anchorBlacklistPattern.test(href) || (a.querySelector('img') && (href && href.includes('/author')))) {
                const t = document.createTextNode(a.textContent || '');
                a.parentNode.replaceChild(t, a);
            } else {
                a.removeAttribute('target');
                a.removeAttribute('onclick');
                a.removeAttribute('rel');
            }
        });
        return clone.innerHTML.trim();
    }

    function stripHtmlToPlainText(html) {
        let t = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<[^>]+>/g, '');
        const textarea = document.createElement('textarea');
        textarea.innerHTML = t;
        t = textarea.value;
        t = t.replace(/\n{3,}/g, '\n\n').trim();
        return t;
    }

    function selectBestContainer(doc) {
        const rootCandidates = [];
        const roots = Array.from(doc.querySelectorAll('main, article, .story, .content, #content, body'));
        const seen = new Set();
        for (const r of roots) {
            if (!r || seen.has(r)) continue;
            seen.add(r);
            rootCandidates.push(r);
        }
        if (rootCandidates.length === 0) rootCandidates.push(doc.body);

        let best = { element: doc.body, score: 0, paragraphs: [] };
        for (const root of rootCandidates) {
            const containers = [root, ...Array.from(root.querySelectorAll('div, section, article'))].slice(0, 120);
            for (const cont of containers) {
                const ps = Array.from(cont.querySelectorAll('p'));
                if (ps.length === 0) continue;
                let score = 0;
                const goodParas = [];
                for (const p of ps) {
                    const text = (p.textContent || '').trim();
                    const textLen = text.length;

                    // Skip UI elements
                    if (isUIElement(text)) continue;

                    const anchors = Array.from(p.querySelectorAll('a'));
                    let anchorTextLen = 0;
                    anchors.forEach(a => anchorTextLen += (a.textContent || '').length);
                    const linkDensity = textLen > 0 ? (anchorTextLen / Math.max(1, textLen)) : 1;
                    const hasLargeImg = !!p.querySelector('img:not(.avatar):not(.userpic)');
                    if (textLen < 30 && !hasLargeImg) continue;
                    if (linkDensity > 0.6 && textLen < 300) continue;
                    score += textLen;
                    goodParas.push(p);
                }
                if (score > best.score) {
                    best = { element: cont, score, paragraphs: goodParas };
                }
            }
        }
        return best;
    }

    function extractStoryTextFromDoc(doc) {
        const candidateSelectors = [
            '.aa_ht > div', '.story-text', '.story-body', '.entry-content',
            '.post-content', '.content', '#story', '.story-content', '.article-body'
        ];
        for (const sel of candidateSelectors) {
            try {
                const el = doc.querySelector(sel);
                if (el && (el.textContent || '').trim().length > 200) {
                    const ps = Array.from(el.querySelectorAll('p')).filter(p => {
                        const text = (p.textContent || '').trim();
                        return text.length > 20 && !isUIElement(text);
                    });
                    if (ps.length) {
                        const parts = ps.map(p => sanitizeParagraphHTML(p)).filter(Boolean);
                        if (parts.join('').trim().length > 200) return parts.join('<br><br>');
                    } else {
                        return el.innerHTML;
                    }
                }
            } catch (e) {}
        }

        const best = selectBestContainer(doc);
        if (best && best.paragraphs && best.paragraphs.length) {
            const parts = best.paragraphs.map(p => sanitizeParagraphHTML(p)).filter(Boolean);
            const joined = parts.join('<br><br>');
            if (joined.trim().length > 200) return joined;
        }

        const main = doc.querySelector('main') || doc.querySelector('article') || doc.body;
        const paragraphs = Array.from(main.querySelectorAll('p'))
            .filter(p => {
                const text = (p.textContent || '').trim();
                return text.length >= 30 && !isUIElement(text);
            })
            .filter(p => !p.closest('nav, footer, header, aside, .story-info, .story-meta, .similar-stories, .comments, .related, .usercard, .author, .profile'));
        if (paragraphs.length) {
            const parts = paragraphs.map(p => sanitizeParagraphHTML(p)).filter(Boolean);
            const out = parts.join('<br><br>');
            if (out.trim().length > 200) return out;
        }

        const whole = main.textContent ? main.textContent.trim() : '';
        return whole.length > 200 ? escapeHtml(whole) : '';
    }

    function escapeHtml(s) {
        if (!s) return '';
        return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }

    function findNextLinkInDoc(doc, currentPageNum) {
        const relNext = doc.querySelector('a[rel="next"]');
        if (relNext && relNext.href) return relNext.href;
        const anchors = Array.from(doc.querySelectorAll('a'));
        const nextByText = anchors.find(a => a.textContent && /next/i.test(a.textContent.trim()));
        if (nextByText && nextByText.href) return nextByText.href;
        const pageLinks = anchors.filter(a => a.href && /[?&]page=\d+/i.test(a.href));
        if (pageLinks.length) {
            try {
                const target = pageLinks.find(a => {
                    const url = new URL(a.href, location.href);
                    const p = url.searchParams.get('page');
                    return p && parseInt(p, 10) === (currentPageNum + 1);
                });
                if (target) return target.href;
            } catch (e) {}
            return pageLinks[pageLinks.length - 1].href;
        }
        return null;
    }

    async function fetchStoryContent() {
        let fullHtml = '';
        const visitedUrls = new Set();
        const maxPages = 20;
        let pageNum = 1;
        let prevText = '';
        let currentDoc = document;

        try {
            while (pageNum <= maxPages) {
                const currentUrl = currentDoc._url || (currentDoc.location && currentDoc.location.href) || window.location.href;
                if (visitedUrls.has(currentUrl)) break;
                visitedUrls.add(currentUrl);

                const pageText = extractStoryTextFromDoc(currentDoc) || '';
                console.log(`Page ${pageNum} captured length:`, pageText.length);

                if (pageText === prevText) {
                    console.log(`Skipping duplicate content on page ${pageNum}`);
                    break;
                }
                fullHtml += (pageText ? pageText + '<br><br>' : '');
                prevText = pageText;

                const nextHref = findNextLinkInDoc(currentDoc, pageNum);
                if (!nextHref) break;

                try {
                    const curNum = (new URL(currentUrl, location.href)).searchParams.get('page');
                    const nextNum = (new URL(nextHref, location.href)).searchParams.get('page');
                    if (curNum && nextNum && parseInt(nextNum) <= parseInt(curNum)) break;
                } catch (e) {}

                try {
                    const fetched = await fetchPage(nextHref);
                    if (!fetched) break;
                    currentDoc = fetched;
                } catch (err) {
                    console.error('Fetch error for next page:', err);
                    break;
                }
                pageNum++;
            }

            const title = (document.querySelector('h1')?.textContent || document.title || 'Untitled').trim();
            let author = 'Unknown';
            try {
                author = (document.querySelector('[href^="/authors/"], .author-name, .byline, .story-meta a')?.textContent || document.querySelector('.story-meta')?.textContent || 'Unknown').trim();
            } catch (e) {}
            const rating = document.querySelector('.rating, .score, .story-info__stat')?.textContent?.trim() || '';
            const date = document.querySelector('.date, time, .pub-date')?.textContent?.trim() || '';

            if (!fullHtml || fullHtml.trim().length < 200) {
                throw new Error('Story content too short or missing');
            }

            const htmlContent = `
                <!DOCTYPE html>
                <html><head><meta charset="utf-8"/><title>${escapeHtml(title)} by ${escapeHtml(author)}</title>
                <style>${STYLE_CSS}</style>
                </head><body>
                <h1 class="story-title">${escapeHtml(title)}</h1>
                <div class="story-meta">By ${escapeHtml(author)} ${date ? '| ' + escapeHtml(date) : ''} ${rating ? '| ' + escapeHtml(rating) : ''}</div>
                <div class="story-text">${fullHtml}</div>
                </body></html>
            `;
            const filenameBase = `${(author || 'unknown').replace(/[^a-z0-9]/gi, '_')}_${(title || 'story').substring(0,50).replace(/[^a-z0-9]/gi, '_')}`.substring(0,200);
            return {
                filenameBase,
                htmlContent,
                textContent: stripHtmlToPlainText(fullHtml),
                title,
                author,
                date,
                rating
            };
        } catch (e) {
            console.error('Error fetching story:', e);
            return null;
        }
    }

    async function createEPUB(story) {
        console.log('Starting EPUB creation...');

        // Check if JSZip is available
        if (typeof JSZip === 'undefined') {
            console.error('JSZip not loaded!');
            throw new Error('JSZip library not loaded. Please refresh the page.');
        }

        console.log('JSZip loaded successfully');

        const zip = new JSZip();

        // Extract and clean story content for EPUB
        let storyContent = '';
        try {
            // Start with plain text to avoid HTML issues
            const plainText = story.textContent;

            // Split into paragraphs and clean
            const paragraphs = plainText
                .split('\n\n')
                .map(p => p.trim())
                .filter(p => p.length > 0);

            console.log('Found', paragraphs.length, 'paragraphs');

            // Convert to proper XHTML paragraphs
            storyContent = paragraphs
                .map(p => {
                    // Escape HTML entities
                    const cleaned = escapeHtml(p);
                    return `    <p>${cleaned}</p>`;
                })
                .join('\n');

        } catch (e) {
            console.error('Error extracting story content:', e);
            // Emergency fallback
            storyContent = `    <p>${escapeHtml(story.textContent)}</p>`;
        }

        console.log('Story content formatted, length:', storyContent.length);

        // mimetype must be first and uncompressed
        zip.file('mimetype', 'application/epub+zip', {compression: 'STORE'});
        console.log('Added mimetype');

        // META-INF/container.xml
        const metaInf = zip.folder('META-INF');
        metaInf.file('container.xml',
`<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);
        console.log('Added container.xml');

        const oebps = zip.folder('OEBPS');

        // content.opf
        oebps.file('content.opf',
`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeHtml(story.title)}</dc:title>
    <dc:creator>${escapeHtml(story.author)}</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="BookId">literotica-${Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="content"/>
  </spine>
</package>`);
        console.log('Added content.opf');

        // toc.ncx
        oebps.file('toc.ncx',
`<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="literotica-${Date.now()}"/>
  </head>
  <docTitle>
    <text>${escapeHtml(story.title)}</text>
  </docTitle>
  <navMap>
    <navPoint id="content" playOrder="1">
      <navLabel>
        <text>${escapeHtml(story.title)}</text>
      </navLabel>
      <content src="content.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`);
        console.log('Added toc.ncx');

        // content.xhtml - Strict XHTML 1.1
        oebps.file('content.xhtml',
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
  <title>${escapeHtml(story.title)}</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <style type="text/css">
    body {
      font-family: Georgia, serif;
      line-height: 1.6;
      margin: 1em;
    }
    h1 {
      text-align: center;
      margin-bottom: 0.5em;
    }
    .meta {
      text-align: center;
      font-style: italic;
      margin-bottom: 2em;
      color: #666;
    }
    p {
      text-indent: 1.5em;
      margin: 0.8em 0;
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(story.title)}</h1>
  <div class="meta">by ${escapeHtml(story.author)}</div>
  <div class="story">
${storyContent}
  </div>
</body>
</html>`);
        console.log('Added content.xhtml');

        console.log('Generating EPUB blob...');
        const blob = await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/epub+zip',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 }
        });

        console.log('EPUB generated successfully, size:', blob.size);
        return blob;
    }

    async function downloadStory(format = 'html') {
        const buttons = document.querySelectorAll('.lit-download-btn');
        buttons.forEach(b => { b.disabled = true; b.innerHTML = b.innerHTML.replace(/Download \w+/, 'Downloading...'); });

        const story = await fetchStoryContent();
        if (!story) {
            buttons.forEach(b => {
                b.disabled = false;
                b.innerHTML = b.innerHTML.replace('Downloading...', b.textContent.includes('HTML') ? 'HTML' : b.textContent.includes('TXT') ? 'TXT' : b.textContent.includes('EPUB') ? 'EPUB' : 'MOBI');
            });
            alert('Failed to capture story content. See console for details.');
            return;
        }

        const name = story.filenameBase || 'story';
        try {
            if (format === 'html') {
                const blob = new Blob([story.htmlContent], { type: 'text/html' });
                saveAs(blob, `${name}.html`);
            } else if (format === 'txt') {
                const blob = new Blob([story.textContent], { type: 'text/plain;charset=utf-8' });
                saveAs(blob, `${name}.txt`);
            } else if (format === 'epub') {
                const blob = await createEPUB(story);
                saveAs(blob, `${name}.epub`);
            } else if (format === 'mobi') {
                // MOBI requires conversion tools, so download as EPUB instead
                console.log('MOBI format requires conversion. Downloading as EPUB instead. Use Calibre (calibre-ebook.com) to convert to MOBI if needed.');
                const blob = await createEPUB(story);
                saveAs(blob, `${name}.epub`);
            }
            console.log('Download triggered:', format);
        } catch (e) {
            console.error('Error creating download:', e);
            let errorMsg = 'Download failed: ' + e.message;
            if (e.message.includes('JSZip')) {
                errorMsg += '\n\nTry refreshing the page and attempting the download again.';
            }
            alert(errorMsg);
        } finally {
            buttons.forEach(b => {
                b.disabled = false;
                const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
                if (b.textContent.includes('HTML') || b.innerHTML.includes('Downloading')) b.innerHTML = icon + 'HTML';
                else if (b.textContent.includes('TXT')) b.innerHTML = icon + 'TXT';
                else if (b.textContent.includes('EPUB')) b.innerHTML = icon + 'EPUB';
                else if (b.textContent.includes('MOBI')) b.innerHTML = icon + 'MOBI';
            });
        }
    }

    // Initialize
    window.addEventListener('load', () => {
        if (window.location.href.includes('/s/')) {
            addStyles();
            setTimeout(addDownloadButtons, 1000);
        }
    });

})();