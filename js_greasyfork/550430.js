// ==UserScript==
// @name         Silent Article Printer (Readability intercept)
// @namespace    https://example.com/iamnobody
// @version      2.0.0
// @description  Silently replace page content with the parsed main article when user invokes Print. Keeps selectable text, constrains layout to A4 with 0 visual margins where possible, scales wide media to fit A4. Opens native print dialog for user confirmation. Works on most websites; excludes common search engines. MIT License. Author: iamnobody
// @author       iamnobody
// @license      MIT
// @match        *://*/*
// @exclude      *://www.google.*/*
// @exclude      *://www.bing.com/*
// @exclude      *://search.yahoo.com/*
// @exclude      *://duckduckgo.com/*
// @exclude      *://www.baidu.com/*
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/@mozilla/readability@0.4.4/Readability.min.js
// @require      https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js
// @downloadURL https://update.greasyfork.org/scripts/550430/Silent%20Article%20Printer%20%28Readability%20intercept%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550430/Silent%20Article%20Printer%20%28Readability%20intercept%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     Behavior summary (per your choices):
     - Selectable text approach: when user triggers Print (Ctrl/Cmd+P or print menu), we replace page body with the sanitized article content (Readability + fallback) and let the browser's native print dialog open.
     - After the print action completes (or is canceled), we restore the original page so browsing continues normally.
     - If auto-detection fails or yields too little content, a one-time lightweight overlay asks you to click the correct article area. No persistent floating buttons.
     - Scale-to-fit behavior for wide tables/images (we constrain media to page width rather than switching to A3).

     Limitations (transparent):
     - Browser-controlled print headers/footers (URL, date, page numbers) cannot be programmatically disabled in all browsers. Users may need to disable them in the print dialog for a headerless PDF.
     - Script cannot set the filename when using the native print dialog.
    **/

    // --- Configuration ---
    const MIN_ARTICLE_LENGTH = 200; // chars to consider "valid" article
    const OVERLAY_ID = 'iamnobody-select-overlay';
    const RESTORE_TIMEOUT_MS = 2000; // safety timeout to restore page if afterprint doesn't fire

    // Save original state
    let originalHTML = null;
    let originalTitle = document.title;
    let restoring = false;
    let overlayActive = false;

    // Utility: sanitize HTML
    function sanitize(html) {
        try {
            return DOMPurify.sanitize(html, { ALLOWED_TAGS: false });
        } catch (e) {
            return html;
        }
    }

    // Extract article via Readability with fallbacks
    function detectArticle() {
        try {
            const docClone = document.cloneNode(true);
            const parsed = new Readability(docClone).parse();
            if (parsed && parsed.content && parsed.textContent && parsed.textContent.length >= MIN_ARTICLE_LENGTH) {
                return { title: parsed.title || document.title, content: parsed.content };
            }
        } catch (e) {
            console.warn('Readability parse error', e);
        }

        // fallback selectors
        const selectors = ['article', 'main', '[role=main]', '.post', '.article', '#article', '.entry-content', '.content', '.post-content'];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && (el.innerText || '').trim().length >= MIN_ARTICLE_LENGTH) {
                return { title: document.title, content: el.innerHTML };
            }
        }

        // fallback: largest text block
        const all = Array.from(document.body.querySelectorAll('p, div, section'));
        let best = null; let bestLen = 0;
        for (const el of all) {
            const len = (el.innerText || '').length;
            if (len > bestLen) { bestLen = len; best = el; }
        }
        if (best && bestLen >= MIN_ARTICLE_LENGTH) {
            return { title: document.title, content: best.innerHTML };
        }

        return null;
    }

    // Build article wrapper HTML (keeps selectable text)
    function buildArticleDocument(title, contentHtml) {
        // CSS attempts to make print friendly: A4-like width and remove extra margins visually.
        // Note: browser print margins may still apply; user can choose "Margins: None" in print dialog when available.
        const css = `
            html, body { height:100%; margin:0; padding:0; background: #fff; }
            @media screen, print {
                :root { --page-width:794px; } /* A4 width approx at 96dpi */
                body { font-family: Georgia, 'Times New Roman', serif; color:#111; }
                .iamnobody-reader { box-sizing:border-box; width:var(--page-width); margin:0 auto; padding:12px; }
                h1.iamnobody-title { font-size:20px; margin:6px 0 10px 0; }
                .iamnobody-meta { font-size:12px; color:#666; margin-bottom:10px; }
                img { max-width:100%; height:auto; display:block; margin:8px 0; }
                table { max-width:100%; width:auto; border-collapse:collapse; display:block; overflow:auto; margin:8px 0; }
                table th, table td { border:1px solid #ccc; padding:6px 8px; }
                pre { white-space:pre-wrap; word-break:break-word; }
                /* Minimize default print margins visually */
                @page { size: A4; margin: 0; }
            }
        `;

        const safeContent = sanitize(contentHtml);
        const meta = `Saved from ${location.hostname} — ${new Date().toLocaleString()}`;
        return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${css}</style></head><body><article class="iamnobody-reader"><h1 class="iamnobody-title">${escapeHtml(title)}</h1><div class="iamnobody-meta">${escapeHtml(meta)}</div><div class="iamnobody-content">${safeContent}</div></article></body></html>`;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    // Show small overlay to let user click the correct article area
    function showSelectionOverlay(onSelect) {
        if (overlayActive) return;
        overlayActive = true;
        const ov = document.createElement('div');
        ov.id = OVERLAY_ID;
        Object.assign(ov.style, {
            position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.08)', zIndex: 2147483646, cursor: 'crosshair'
        });

        const hint = document.createElement('div');
        hint.textContent = 'Click the main article area to select it for printing. Press Esc to cancel.';
        Object.assign(hint.style, {
            position: 'fixed', top: '12px', left: '50%', transform: 'translateX(-50%)', background:'#fff', padding:'8px 12px', borderRadius:'8px', boxShadow:'0 6px 18px rgba(0,0,0,0.12)', zIndex:2147483647
        });

        document.body.appendChild(ov);
        document.body.appendChild(hint);

        function clickHandler(e) {
            e.preventDefault(); e.stopPropagation();
            // Walk up to find a meaningful container (stop at body)
            let el = e.target;
            while (el && el !== document.body) {
                const textLen = (el.innerText || '').trim().length;
                if (textLen >= MIN_ARTICLE_LENGTH) break;
                el = el.parentElement;
            }
            cleanup();
            if (el && el !== document.body) onSelect(el);
            else onSelect(null);
        }

        function keyHandler(e) {
            if (e.key === 'Escape') { cleanup(); onSelect(null); }
        }

        function cleanup() {
            overlayActive = false;
            ov.remove(); hint.remove();
            document.removeEventListener('click', clickHandler, true);
            document.removeEventListener('keydown', keyHandler, true);
        }

        document.addEventListener('click', clickHandler, true);
        document.addEventListener('keydown', keyHandler, true);
    }

    // Swap document body to article HTML and optionally change title
    function replaceBodyWithArticle(article) {
        try {
            if (!article || !article.content) throw new Error('No article content');
            originalHTML = document.documentElement.outerHTML;
            originalTitle = document.title || originalTitle;

            const articleDoc = buildArticleDocument(article.title || originalTitle, article.content);
            // Use document.open/write to replace entire page so print uses the new content
            document.open();
            document.write(articleDoc);
            document.close();
            // Small delay to let layout settle
        } catch (e) {
            console.error('replaceBodyWithArticle failed', e);
            throw e;
        }
    }

    // Restore original page
    function restoreOriginal() {
        if (restoring) return;
        restoring = true;
        try {
            if (originalHTML) {
                // Replace document with original HTML. Use location.reload as safe fallback if writing fails.
                try {
                    document.open();
                    document.write(originalHTML);
                    document.close();
                } catch (e) {
                    console.warn('Restore via document.write failed, reloading page instead', e);
                    location.reload();
                }
                document.title = originalTitle;
                originalHTML = null;
            }
        } finally {
            restoring = false;
        }
    }

    // Handler when print is invoked
    async function handleBeforePrint(ev) {
        try {
            // If we've already replaced and are printing, no-op
            if (document.documentElement && document.documentElement.querySelector('.iamnobody-reader')) return;

            // Try auto-detect
            let article = detectArticle();

            if (!article) {
                // Ask user to click selection (fallback mode)
                // We need to stop the print flow until selection is made. Some browsers call beforeprint synchronously.
                // We'll attempt to pause by showing overlay and then programmatically calling print after selection.
                // To avoid interfering with synchronous native print calls, we'll cancel here if overlay can't run and let print proceed normally.
                try {
                    // Prevent further immediate printing by returning - let print dialog continue (best effort)
                    // Show selection overlay; when user selects, we programmatically open a new window with article and call print there.
                    showSelectionOverlay(function (el) {
                        if (!el) {
                            // user canceled selection — nothing to do
                            return;
                        }
                        // Build article from chosen element
                        const content = el.innerHTML;
                        const title = (el.querySelector('h1') || document.querySelector('title')).innerText || document.title;
                        const articleData = { title, content };

                        // Open a new window and write article then print
                        const w = window.open('', '_blank');
                        if (!w) { alert('Popup blocked. Allow popups to open a print preview.'); return; }
                        w.document.open();
                        w.document.write(buildArticleDocument(articleData.title, articleData.content));
                        w.document.close();
                        // Defer printing slightly to allow images to load
                        setTimeout(()=>{ try { w.focus(); w.print(); } catch(e){ console.error(e); } }, 800);
                    });
                } catch (overlayErr) {
                    console.warn('Selection overlay failed', overlayErr);
                }

                // Let original print continue (we couldn't reliably pause it here). Returning.
                return;
            }

            // We have an article. Replace body (in-place) so native print dialog prints only article.
            replaceBodyWithArticle(article);

            // Safety: restore after a timeout if afterprint doesn't fire
            setTimeout(()=>{
                restoreOriginal();
            }, RESTORE_TIMEOUT_MS + 1500);

        } catch (err) {
            console.error('beforeprint handler error', err);
        }
    }

    function handleAfterPrint(ev) {
        try {
            // restore original document
            restoreOriginal();
        } catch (e) {
            console.error('afterprint handler error', e);
        }
    }

    // Attach listeners
    function attachPrintListeners() {
        try {
            window.addEventListener('beforeprint', handleBeforePrint);
            window.addEventListener('afterprint', handleAfterPrint);

            // Also intercept Ctrl/Cmd+P to try to handle cases where beforeprint is unreliable.
            window.addEventListener('keydown', function (e) {
                const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                const meta = isMac ? e.metaKey : e.ctrlKey;
                if (meta && e.key.toLowerCase() === 'p') {
                    // Give browser default behavior but also try our handler (we cannot prevent default reliably in some browsers)
                    try { handleBeforePrint(); } catch (e) { console.error(e); }
                    // allow native dialog to open — our replacement may have already occurred
                }
            });
        } catch (e) {
            console.error('attachPrintListeners failed', e);
        }
    }

    // Debugging logs? Enabled by user choice earlier. We'll keep minimal console logs but not noisy.
    console.log('Silent Article Printer: initialized (selectable-text mode).');

    // Initialize
    attachPrintListeners();

})();