// ==UserScript==
// @name         Better SEP
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  Better UI for Stanford Encyclopedia of Philosophy
// @author       Wittgensteins Hund
// @match        https://plato.stanford.edu/entries/*
// @match        https://plato.stanford.edu/ENTRIES/*
// @match        https://plato.stanford.edu/Entries/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559863/Better%20SEP.user.js
// @updateURL https://update.greasyfork.org/scripts/559863/Better%20SEP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname.endsWith('/notes.html')) return;

    let darkMode = localStorage.getItem('sep-dark-mode') === 'true';
    let notesData = {};
    let bibEntries = [];
    let bibAuthors = {};
    let yearIndex = {};
    let citationText = '';
    let bibtexText = '';

    const excludeWords = new Set([
        'see', 'also', 'but', 'and', 'the', 'for', 'that', 'this', 'with', 'from',
        'have', 'has', 'had', 'are', 'was', 'were', 'been', 'being', 'which', 'what',
        'when', 'where', 'who', 'whom', 'whose', 'why', 'how', 'all', 'each', 'every',
        'both', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very',
        'just', 'only', 'own', 'same', 'into', 'over', 'after', 'before', 'between',
        'under', 'again', 'further', 'then', 'once', 'here', 'there', 'above', 'below',
        'during', 'about', 'against', 'among', 'through', 'while', 'since', 'until',
        'unless', 'although', 'though', 'because', 'therefore', 'however', 'thus',
        'hence', 'moreover', 'furthermore', 'nevertheless', 'nonetheless', 'otherwise',
        'indeed', 'certainly', 'perhaps', 'maybe', 'probably', 'possibly', 'actually',
        'really', 'simply', 'merely', 'especially', 'particularly', 'specifically',
        'generally', 'usually', 'often', 'always', 'never', 'sometimes', 'rarely',
        'according', 'following', 'including', 'regarding', 'concerning', 'given',
        'provided', 'assuming', 'considering', 'note', 'notes', 'section', 'chapter',
        'part', 'volume', 'page', 'pages', 'figure', 'table', 'example', 'examples',
        'case', 'cases', 'point', 'points', 'first', 'second', 'third', 'fourth', 'fifth',
        'last', 'next', 'previous', 'former', 'latter', 'one', 'two', 'three', 'four', 'five'
    ]);

    const css = `
        :root {
            --bg: #ffffff;
            --bg-toc: #f8f7f5;
            --bg-tooltip: #ffffff;
            --text: #1a1a1a;
            --text-secondary: #444;
            --text-muted: #777;
            --link: #2563eb;
            --border: #e5e3df;
            --border-section: #999;
            --shadow: 0 8px 32px rgba(0,0,0,0.12);
            --serif: 'Source Serif Pro', Georgia, serif;
            --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --mono: 'JetBrains Mono', Consolas, monospace;
            --active-bg: rgba(0, 0, 0, 0.04);
            --active-border: var(--text);
            --btn-bg: rgba(0, 0, 0, 0.7);
            --btn-hover: rgba(0, 0, 0, 0.85);
            --scrollbar-thumb: #c0bdb8;
            --scrollbar-thumb-hover: #a09d98;
        }
        :root.dark {
            --bg: #1a1a18;
            --bg-toc: #222220;
            --bg-tooltip: #2a2a28;
            --text: #e0e0e0;
            --text-secondary: #bbb;
            --text-muted: #888;
            --link: #60a5fa;
            --border: #3a3a36;
            --border-section: #666;
            --shadow: 0 8px 32px rgba(0,0,0,0.5);
            --active-bg: rgba(255, 255, 255, 0.06);
            --active-border: var(--text);
            --btn-bg: rgba(255, 255, 255, 0.15);
            --btn-hover: rgba(255, 255, 255, 0.25);
            --scrollbar-thumb: #555;
            --scrollbar-thumb-hover: #666;
        }

        ::-webkit-scrollbar { width: 12px; height: 12px; }
        ::-webkit-scrollbar-track { background: var(--bg-toc); border-radius: 6px; }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 6px; border: 2px solid var(--bg-toc); }
        ::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover); }
        * { scrollbar-width: auto; scrollbar-color: var(--scrollbar-thumb) var(--bg-toc); }

        html, body { background: var(--bg) !important; color: var(--text) !important; }
        #container, #content, #article, #article-content, #aueditable, #main-text, #preamble,
        #bibliography, #academic-tools, #other-internet-resources, #related-entries,
        #acknowledgments, #article-copyright { background: var(--bg) !important; box-shadow: none !important; border: none !important; }
        #container { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }

        #preamble { text-align: justify; }
        #main-text { text-align: justify; }
        #sep-notes { text-align: justify; }
        #bibliography { text-align: justify; }

        #header-wrapper { background: var(--bg) !important; border-bottom: 1px solid var(--border) !important; }
        #header { background: var(--bg) !important; max-width: 1300px !important; margin: 0 auto !important; padding: 0 40px !important; }
        #branding { background: var(--bg) !important; }
        #branding #site-title a { color: var(--text) !important; }
        :root.dark #branding #site-logo img { filter: brightness(1.5); }
        #navigation i, #footer i { display: none !important; }
        #navigation, #navigation .navbar, #navigation .navbar-inner, #navigation .container { background: var(--bg) !important; border: none !important; box-shadow: none !important; }
        #navigation .nav > li > a { color: var(--text-secondary) !important; }
        #navigation .nav > li > a:hover { color: var(--link) !important; }
        #navigation .dropdown-menu { background: var(--bg-tooltip) !important; border: 1px solid var(--border) !important; }
        #navigation .dropdown-menu a { color: var(--text-secondary) !important; }
        #navigation .dropdown-menu a:hover { color: var(--link) !important; background: var(--active-bg) !important; }
        #search input { background: var(--bg-toc) !important; border: 1px solid var(--border) !important; color: var(--text) !important; border-radius: 8px !important; }
        #search .search-btn { background: transparent !important; color: var(--text-muted) !important; }

        #footer { background: var(--bg-toc) !important; border-top: 1px solid var(--border) !important; padding: 40px 24px !important; margin-top: 80px !important; }
        #footer, #footer * { background-color: transparent !important; }
        #footer h4 { color: var(--text) !important; }
        #footer a { color: var(--link) !important; }
        #footer #site-credits { color: var(--text-muted) !important; }
        #footer .btn { background: var(--bg) !important; border: 1px solid var(--border) !important; color: var(--text) !important; }

        #article-banner, #article-sidebar, #toc, .scroll-block { display: none !important; }

        #content { display: flex !important; flex-direction: row !important; justify-content: center !important; gap: 48px !important; max-width: 1300px !important; margin: 0 auto !important; padding: 48px 40px 80px !important; align-items: flex-start !important; }

        #sep-toc { flex: 0 0 260px !important; width: 260px !important; position: sticky; top: 24px; max-height: calc(100vh - 48px); overflow-y: auto; font-family: var(--sans); font-size: 14px; padding: 20px 0 40px; background: var(--bg-toc); border-radius: 12px; }
        #sep-toc-title { font-weight: 600; font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; padding: 0 20px; }
        #sep-toc-top { display: block; padding: 10px 20px; color: var(--text-secondary) !important; text-decoration: none !important; font-weight: 500; font-size: 13px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
        #sep-toc-top:hover { color: var(--text) !important; }
        #sep-toc ul { list-style: none !important; margin: 0 !important; padding: 0 !important; }
        #sep-toc li { margin: 0 !important; }
        #sep-toc a { display: block; padding: 7px 20px; color: var(--text-muted) !important; text-decoration: none !important; line-height: 1.4; border-left: 3px solid transparent; }
        #sep-toc a:hover { color: var(--text) !important; background: var(--active-bg); }
        #sep-toc a.active { color: var(--text) !important; background: var(--active-bg) !important; border-left-color: var(--active-border) !important; font-weight: 600; }
        #sep-toc .toc-sub { font-size: 13px; }
        #sep-toc .toc-sub a { padding-left: 36px; }
        #sep-toc .toc-divider { height: 1px; background: var(--border); margin: 16px 20px; }
        #sep-toc .toc-label { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; padding: 0 20px; }

        #article { flex: 0 1 780px !important; max-width: 780px !important; padding: 0 !important; margin: 0 !important; }
        #article-content { border: none !important; }

        #sep-header { margin-bottom: 48px; text-align: center; padding-bottom: 32px; border-bottom: 2px solid var(--border); }
        #sep-header h1 { font-family: var(--serif) !important; font-size: 44px !important; font-weight: 700 !important; color: var(--text) !important; margin: 0 0 20px !important; line-height: 1.2 !important; letter-spacing: -0.3px !important; }
        #sep-header-authors { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 16px; font-family: var(--sans); font-size: 15px; font-weight: 600; color: var(--text-secondary); margin-bottom: 12px; }
        #sep-header-authors a { color: var(--text-secondary) !important; text-decoration: none !important; }
        #sep-header-authors a:hover { text-decoration: underline !important; }
        #sep-header-authors .sep-author-sep { color: var(--text-muted); font-weight: 400; }
        #sep-header-meta { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        #sep-header-date { font-family: var(--sans); font-size: 13px; color: var(--text-muted); }
        #aueditable > h1:first-of-type, #pubinfo { display: none !important; }

        #aueditable { font-family: var(--serif) !important; font-size: 19px !important; line-height: 1.8 !important; color: var(--text) !important; }
        #aueditable h2 { font-family: var(--sans) !important; font-size: 28px !important; font-weight: 600 !important; color: var(--text) !important; margin: 64px 0 12px !important; padding-bottom: 12px !important; border-bottom: 2px solid var(--border-section) !important; }
        #aueditable h2 a, #aueditable h3 a {
            color: inherit !important;
            text-decoration: none !important;
            pointer-events: none;
        }
        #aueditable h3 { font-family: var(--sans) !important; font-size: 21px !important; font-weight: 600 !important; color: var(--text) !important; margin: 40px 0 16px !important; }
        #aueditable h4 { font-family: var(--sans) !important; font-size: 17px !important; font-weight: 600 !important; color: var(--text-secondary) !important; margin: 32px 0 12px !important; }
        a { color: var(--link) !important; text-decoration: none !important; }
        a:hover { text-decoration: underline !important; }
        sup a { font-size: 13px !important; font-weight: 500; padding: 1px 3px; border-radius: 3px; }
        sup a:hover { background: var(--link) !important; color: white !important; text-decoration: none !important; }
        blockquote { margin: 28px 0 !important; padding: 20px 24px !important; background: var(--bg-toc) !important; border: none !important; border-left: 3px solid var(--text-muted) !important; border-radius: 0 10px 10px 0 !important; color: var(--text-secondary) !important; font-style: italic; }

        .sep-cite { color: var(--link) !important; cursor: pointer; border-bottom: 1px dashed currentColor; }
        .sep-cite:hover { background: var(--active-bg); border-bottom-style: solid; text-decoration: none !important; }

        #sep-tip { position: fixed; max-width: 520px; padding: 16px 20px; background: var(--bg-tooltip); color: var(--text); border-radius: 12px; font-family: var(--sans); font-size: 14px; line-height: 1.6; z-index: 100000; box-shadow: var(--shadow); border: 1px solid var(--border); opacity: 0; visibility: hidden; pointer-events: none; }
        #sep-tip.show { opacity: 1; visibility: visible; pointer-events: auto; }
        #sep-tip-label { font-weight: 600; font-size: 13px; color: var(--text); margin-bottom: 8px; }
        #sep-tip-text { color: var(--text-secondary); max-height: 400px; overflow-y: auto; }
        #sep-tip-text em, #sep-tip-text i { font-style: italic !important; }
        #sep-tip-text strong, #sep-tip-text b { font-weight: bold !important; }
        .sep-tip-entry { padding: 10px 0; border-bottom: 1px solid var(--border); }
        .sep-tip-entry:last-child { border-bottom: none; padding-bottom: 0; }
        .sep-tip-entry:first-child { padding-top: 0; }

        #sep-notes { margin-top: 64px; padding-top: 32px; border-top: 1px solid var(--border); }
        #sep-notes h2 { font-family: var(--sans) !important; font-size: 28px !important; font-weight: 600 !important; margin: 0 0 24px !important; padding-bottom: 12px !important; border-bottom: 2px solid var(--border-section) !important; }
        .sep-note-item { display: flex; gap: 12px; padding: 16px 0 !important; border-bottom: 1px solid var(--border) !important; font-size: 15px !important; line-height: 1.7 !important; color: var(--text-secondary) !important; font-family: var(--sans) !important; }
        .sep-note-item:last-child { border-bottom: none !important; }
        .sep-note-num { flex: 0 0 32px; font-weight: 600; color: var(--text); text-align: right; }
        .sep-note-content { flex: 1; }
        .sep-note-back { font-size: 12px; margin-left: 8px; opacity: 0.6; }

        #bibliography { margin-top: 64px; padding-top: 32px; border-top: 1px solid var(--border); }
        #bibliography h2 { font-family: var(--sans) !important; font-size: 28px !important; font-weight: 600 !important; margin: 0 0 24px !important; padding-bottom: 12px !important; border-bottom: 2px solid var(--border-section) !important; }
        #bibliography ul { padding: 0 !important; margin: 0 !important; }
        #bibliography li { padding: 16px 0 16px 44px !important; margin: 0 !important; border-bottom: 1px solid var(--border) !important; font-size: 15px !important; line-height: 1.7 !important; list-style: none !important; color: var(--text-secondary) !important; font-family: var(--sans) !important; text-indent: -44px; }
        #bibliography li:last-child { border-bottom: none !important; }
        #bibliography li em, #bibliography li i { color: var(--text) !important; font-style: italic !important; }
        #bibliography a[href*="doi"] { font-family: var(--mono) !important; font-size: 11px !important; color: var(--text-muted) !important; background: var(--bg-toc); padding: 2px 6px; border-radius: 4px; }
        #bibliography img { display: none !important; }

        #academic-tools, #other-internet-resources, #related-entries, #acknowledgments { margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--border) !important; }
        #academic-tools h2, #other-internet-resources h2, #related-entries h2, #acknowledgments h2 { font-family: var(--sans) !important; font-size: 24px !important; font-weight: 600 !important; margin: 0 0 20px !important; padding-bottom: 10px !important; border-bottom: 2px solid var(--border-section) !important; }
        #academic-tools img { display: none !important; }
        #article-copyright { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border) !important; color: var(--text-muted) !important; font-size: 14px !important; font-family: var(--sans) !important; }
        #article-copyright a { color: var(--link) !important; }

        #sep-top-btns { position: fixed; top: 20px; right: 20px; display: flex; gap: 10px; z-index: 10000; }
        .sep-btn { width: 44px; height: 44px; border: none; border-radius: 50%; background: var(--btn-bg); color: #fff; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 12px rgba(0,0,0,0.15); transition: all 0.2s; backdrop-filter: blur(8px); }
        .sep-btn:hover { background: var(--btn-hover); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
        #sep-cite-btn { font-family: Georgia, serif; font-size: 20px; font-weight: bold; }

        #sep-back-top { position: fixed; bottom: 24px; right: 24px; width: 48px; height: 48px; border: none; border-radius: 50%; background: var(--btn-bg); color: #fff; cursor: pointer; font-size: 20px; display: none; align-items: center; justify-content: center; box-shadow: 0 2px 12px rgba(0,0,0,0.15); z-index: 9999; transition: all 0.2s; backdrop-filter: blur(8px); }
        #sep-back-top.show { display: flex; }
        #sep-back-top:hover { background: var(--btn-hover); transform: translateY(-2px); }

        #sep-cite-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100001; display: none; align-items: center; justify-content: center; padding: 20px; }
        #sep-cite-modal.show { display: flex; }
        #sep-cite-box { background: var(--bg); border-radius: 16px; padding: 28px; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 1px solid var(--border); }
        #sep-cite-title { font-family: var(--sans); font-size: 18px; font-weight: 600; color: var(--text); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
        #sep-cite-close { background: none; border: none; font-size: 24px; color: var(--text-muted); cursor: pointer; padding: 0; line-height: 1; }
        #sep-cite-close:hover { color: var(--text); }
        #sep-cite-text { font-family: var(--sans); font-size: 15px; line-height: 1.7; color: var(--text-secondary); background: var(--bg-toc); padding: 16px; border-radius: 8px; margin-bottom: 16px; user-select: text; }
        #sep-cite-copy { background: var(--text); color: var(--bg); border: none; padding: 10px 20px; border-radius: 8px; font-family: var(--sans); font-size: 14px; cursor: pointer; }
        #sep-cite-tabs { display: flex; gap: 0; margin-bottom: 16px; border-bottom: 1px solid var(--border); }
        .sep-cite-tab { background: none; border: none; padding: 10px 20px; font-family: var(--sans); font-size: 14px; font-weight: 500; color: var(--text-muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; }
        .sep-cite-tab:hover { color: var(--text); }
        .sep-cite-tab.active { color: var(--text); border-bottom-color: var(--text); }
        #sep-cite-bibtex { font-family: var(--mono); font-size: 12px; line-height: 1.5; color: var(--text-secondary); background: var(--bg-toc); padding: 16px; border-radius: 8px; margin-bottom: 16px; user-select: text; white-space: pre-wrap; word-break: break-all; display: none; max-height: 300px; overflow-y: auto; }
        #sep-cite-copy:hover { opacity: 0.9; }
        #sep-cite-copy.copied { background: #22c55e; color: white; }

        #sep-progress { position: fixed; top: 0; left: 0; height: 2px; background: var(--text); z-index: 99999; width: 0; }

        html { scroll-behavior: smooth; }
        @media (max-width: 900px) {
            #content { flex-direction: column !important; padding: 24px 16px 60px !important; }
            #sep-toc { display: none !important; }
            #article { max-width: 100% !important; }
            #sep-header h1 { font-size: 30px !important; }
            #aueditable { font-size: 17px !important; }
        }

        @media print {
          #sep-toc, #sep-cite-btn, #sep-dark-toggle, #sep-dark, .sep-cite-tooltip, .sep-btn, #academic-tools, #other-internet-resources, #related-entries { display: none !important; }
          #header { max-width: 100% !important; padding: 20px 0 !important; }
          #header h1 { font-size: 24px !important; }
          #content { display: block !important; }
          #article { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          #main-text { max-width: 100% !important; }
          #sep-header { padding: 0 0 16px !important; margin-bottom: 24px !important; border-bottom: 1px solid #ccc !important; background: none !important; }
          #sep-header h1 { font-size: 28px !important; }
          body { background: white !important; color: black !important; }
          a { color: black !important; }
          a[href]:after { content: none !important; }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);

    function main() {
        const font = document.createElement('link');
        font.href = 'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;1,400&display=swap';
        font.rel = 'stylesheet';
        document.head.appendChild(font);

        function setDark(on) {
            document.documentElement.classList.toggle('dark', on);
            localStorage.setItem('sep-dark-mode', on);
            darkMode = on;
            const btn = document.getElementById('sep-dark');
            if (btn) btn.textContent = on ? '☀' : '☾';
        }

        function extractAuthors() {
            const copyright = document.getElementById('article-copyright');
            if (!copyright) return [];

            const authors = [];
            const html = copyright.innerHTML;

            // Split by <br> tags to get each author line
            const lines = html.split(/<br\s*\/?>/gi);

            for (const line of lines) {
                // Skip copyright line and empty lines
                if (line.includes('Copyright') || line.trim() === '') continue;

                // Create a temporary element to parse the line
                const temp = document.createElement('div');
                temp.innerHTML = line;

                // Remove email parts (anything in angle brackets)
                const emailParts = temp.querySelectorAll('a[href^="mailto"], a[href^="m"]');
                emailParts.forEach(el => {
                    // Find the surrounding < > and remove them too
                    let node = el;
                    while (node.previousSibling && node.previousSibling.textContent.includes('<')) {
                        node.previousSibling.textContent = node.previousSibling.textContent.replace(/&lt;|</, '');
                    }
                    while (node.nextSibling && node.nextSibling.textContent.includes('>')) {
                        node.nextSibling.textContent = node.nextSibling.textContent.replace(/&gt;|>/, '');
                    }
                    el.remove();
                });

                // Get remaining text/links
                const text = temp.textContent.replace(/[<>]/g, '').trim();
                if (!text) continue;

                // Check if there's a profile link (not mailto)
                const profileLink = temp.querySelector('a[href^="http"], a[href^="/"]');

                if (profileLink) {
                    authors.push({
                        name: text,
                        url: profileLink.href
                    });
                } else if (text) {
                    authors.push({
                        name: text,
                        url: null
                    });
                }
            }

            return authors;
        }

        function createHeader() {
            const h1 = document.querySelector('#aueditable > h1');
            const pubinfo = document.getElementById('pubinfo');
            const aueditable = document.getElementById('aueditable');
            if (!h1 || !aueditable) return;

            const header = document.createElement('div');
            header.id = 'sep-header';

            const title = document.createElement('h1');
            title.textContent = h1.textContent;
            header.appendChild(title);

            // Add authors
            const authors = extractAuthors();
            if (authors.length > 0) {
                const authorsDiv = document.createElement('div');
                authorsDiv.id = 'sep-header-authors';

                authors.forEach((author, i) => {
                    if (author.url) {
                        const link = document.createElement('a');
                        link.href = author.url;
                        link.textContent = author.name;
                        link.target = '_blank';
                        authorsDiv.appendChild(link);
                    } else {
                        const span = document.createElement('span');
                        span.textContent = author.name;
                        authorsDiv.appendChild(span);
                    }

                    if (i < authors.length - 1) {
                        const sep = document.createElement('span');
                        sep.className = 'sep-author-sep';
                        sep.textContent = i === authors.length - 2 ? ' & ' : ', ';
                        authorsDiv.appendChild(sep);
                    }
                });

                header.appendChild(authorsDiv);
            }

            const meta = document.createElement('div');
            meta.id = 'sep-header-meta';

            if (pubinfo) {
                const dateDiv = document.createElement('div');
                dateDiv.id = 'sep-header-date';
                dateDiv.textContent = pubinfo.textContent.trim();
                meta.appendChild(dateDiv);
            }

            header.appendChild(meta);
            aueditable.insertBefore(header, aueditable.firstChild);
        }

        async function fetchNotes() {
            try {
                let basePath = window.location.pathname;
                if (!basePath.endsWith('/')) basePath += '/';
                const res = await fetch(basePath + 'notes.html');
                if (!res.ok) return false;

                const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
                const noteDivs = doc.querySelectorAll('div[id^="note-"]');
                if (!noteDivs.length) return false;

                const section = document.createElement('div');
                section.id = 'sep-notes';
                section.innerHTML = '<h2 id="notes">Notes</h2>';

                const list = document.createElement('div');
                list.id = 'sep-notes-list';

                noteDivs.forEach(div => {
                    const num = div.id.replace('note-', '');
                    const p = div.querySelector('p');
                    if (!p) return;
                    let html = p.innerHTML.replace(/^\s*<a[^>]*>\d+\.<\/a>\s*/, '');
                    notesData[num] = html;
                    const item = document.createElement('div');
                    item.className = 'sep-note-item';
                    item.id = div.id;
                    item.innerHTML = `<span class="sep-note-num">${num}.</span><span class="sep-note-content">${html}<a href="#ref-${num}" class="sep-note-back">↩</a></span>`;
                    list.appendChild(item);
                });

                section.appendChild(list);
                const bib = document.getElementById('bibliography');
                if (bib) bib.parentNode.insertBefore(section, bib);

                document.querySelectorAll('a[href*="notes.html#"]').forEach(a => {
                    const m = a.href.match(/#(note-\d+)/);
                    if (m) a.href = '#' + m[1];
                });

                return true;
            } catch (e) { return false; }
        }

        function buildTOC(hasNotes) {
            const content = document.getElementById('content');
            const aueditable = document.getElementById('aueditable');
            if (!content || !aueditable) return;

            const toc = document.createElement('div');
            toc.id = 'sep-toc';

            const top = document.createElement('a');
            top.id = 'sep-toc-top';
            top.href = '#';
            top.textContent = '↑ Top';
            top.onclick = e => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
            toc.appendChild(top);

            const title = document.createElement('div');
            title.id = 'sep-toc-title';
            title.textContent = 'Contents';
            toc.appendChild(title);

            const list = document.createElement('ul');
            const skip = ['bibliography', 'academic tools', 'other internet', 'related entries', 'acknowledgments', 'notes'];
            let currentLi = null, currentSub = null;

            aueditable.querySelectorAll('h2, h3').forEach(h => {
                // Get ID from the anchor's name attribute, or generate one
                const anchor = h.querySelector('a[name]');
                if (anchor && anchor.name && !h.id) {
                    h.id = anchor.name;
                } else if (!h.id) {
                    h.id = 'section-' + h.textContent.trim().toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '')
                        .slice(0, 40);
                }

                const text = h.textContent.trim();
                if (skip.some(s => text.toLowerCase().includes(s))) return;
                if (h.tagName === 'H2') {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = '#' + h.id;
                    a.textContent = text;
                    li.appendChild(a);
                    list.appendChild(li);
                    currentLi = li;
                    currentSub = null;
                } else if (h.tagName === 'H3' && currentLi) {
                    if (!currentSub) { currentSub = document.createElement('ul'); currentSub.className = 'toc-sub'; currentLi.appendChild(currentSub); }
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = '#' + h.id;
                    a.textContent = text;
                    li.appendChild(a);
                    currentSub.appendChild(li);
                }
            });
            toc.appendChild(list);

            toc.appendChild(Object.assign(document.createElement('div'), { className: 'toc-divider' }));
            toc.appendChild(Object.assign(document.createElement('div'), { className: 'toc-label', textContent: 'Resources' }));

            const res = document.createElement('ul');
            [hasNotes && { id: 'notes', text: 'Notes' }, { id: 'Bib', alt: 'bibliography', text: 'Bibliography' }, { id: 'Aca', alt: 'academic-tools', text: 'Academic Tools' }, { id: 'Oth', alt: 'other-internet-resources', text: 'Other Internet Resources' }, { id: 'Rel', alt: 'related-entries', text: 'Related Entries' }].filter(Boolean).forEach(item => {
                const el = document.getElementById(item.id) || document.getElementById(item.alt);
                if (el) { const li = document.createElement('li'); const a = document.createElement('a'); a.href = '#' + el.id; a.textContent = item.text; li.appendChild(a); res.appendChild(li); }
            });
            toc.appendChild(res);
            content.insertBefore(toc, content.firstChild);
        }

        function normalize(str) {
            return str.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[''`]/g, "'")
                .replace(/[-–—]/g, '-')
                .trim();
        }

        function buildBibIndex() {
            let currentAuthorFull = '';
            let prevEntryHtml = '';
            const seenEntries = new Set();

            document.querySelectorAll('#bibliography li').forEach((li, i) => {
                li.id = li.id || 'bib-' + i;
                const text = li.textContent.trim();
                const htmlContent = li.innerHTML;

                const isContinuation = /^[–—-]{2,}/.test(text);

                let authorFull;
                let displayHtml = htmlContent;

                if (isContinuation) {
                    authorFull = currentAuthorFull;
                    const prevAuthorMatch = prevEntryHtml.match(/^([^,]+(?:,\s*[^,]+)?)\s*[,.]?\s*(?:\d{4}|\()/);
                    if (prevAuthorMatch) {
                        displayHtml = htmlContent.replace(/^[–—-]{2,}[,.]?\s*/, prevAuthorMatch[1] + ', ');
                    }
                } else {
                    const authorMatch = text.match(/^(.+?)\s*[,.]?\s*(?:\d{4}|\(?\s*(?:eds?\.?|forthcoming|manuscript|unpublished|in press))/i);
                    if (authorMatch) {
                        authorFull = authorMatch[1].trim();
                        currentAuthorFull = authorFull;
                        prevEntryHtml = htmlContent;
                    }
                }

                if (!authorFull) return;

                const yearMatch = text.match(/\b(1[5-9]\d{2}|20[0-2]\d)([a-z])?\b/);
                if (!yearMatch) return;

                const year = yearMatch[1] + (yearMatch[2] || '');
                const yearClean = yearMatch[1];

                const entryKey = normalize(authorFull) + '|' + year + '|' + li.id;
                if (seenEntries.has(entryKey)) return;
                seenEntries.add(entryKey);

                const surnames = [];
                const authorNorm = authorFull.replace(/\b(van|von|de|du|la|le|der|den|di)\s+/gi, (m) => m.toLowerCase());
                const authorParts = authorNorm.split(/\s*(?:,\s*(?:and\s+)?|&|\s+and\s+)\s*/i);

                authorParts.forEach(part => {
                    const commaParts = part.split(',');
                    if (commaParts.length >= 1) {
                        let surname = commaParts[0].trim();
                        const prefixMatch = surname.match(/^(van|von|de|du|la|le|der|den|di)\s+(.+)$/i);
                        if (prefixMatch) {
                            surnames.push(normalize(prefixMatch[1] + ' ' + prefixMatch[2]));
                            surnames.push(normalize(prefixMatch[2]));
                        } else {
                            surnames.push(normalize(surname));
                        }
                    }
                });

                const entry = {
                    el: li,
                    authorFull: authorFull,
                    year: year,
                    yearClean: yearClean,
                    text: displayHtml,
                    surnames: surnames
                };

                bibEntries.push(entry);

                if (!yearIndex[year]) yearIndex[year] = [];
                yearIndex[year].push(entry);

                if (year !== yearClean) {
                    if (!yearIndex[yearClean]) yearIndex[yearClean] = [];
                    yearIndex[yearClean].push(entry);
                }

                surnames.forEach(sn => {
                    const key = sn + '|' + year;
                    if (!bibAuthors[key]) bibAuthors[key] = [];
                    bibAuthors[key].push(entry);

                    if (year !== yearClean) {
                        const keyClean = sn + '|' + yearClean;
                        if (!bibAuthors[keyClean]) bibAuthors[keyClean] = [];
                        if (!bibAuthors[keyClean].includes(entry)) {
                            bibAuthors[keyClean].push(entry);
                        }
                    }
                });
            });
        }

        function findEntry(authorText, year) {
            if (!authorText || !year) return null;

            if (excludeWords.has(authorText.toLowerCase())) return null;

            const authNorm = normalize(authorText);
            const yearClean = year.replace(/[a-z]$/i, '');

            if (authNorm.length < 3) return null;

            let key = authNorm + '|' + year;
            if (bibAuthors[key]) return bibAuthors[key][0];

            key = authNorm + '|' + yearClean;
            if (bibAuthors[key]) return bibAuthors[key][0];

            for (const k in bibAuthors) {
                const [sn, y] = k.split('|');
                if (y !== year && y !== yearClean) continue;

                if (sn === authNorm) return bibAuthors[k][0];
                if (sn.endsWith(' ' + authNorm)) return bibAuthors[k][0];
                if (authNorm.endsWith(' ' + sn)) return bibAuthors[k][0];
            }

            return null;
        }

        function findEntriesByAuthorYears(authorText, years) {
            if (!authorText || !years || years.length === 0) return [];
            if (excludeWords.has(authorText.toLowerCase())) return [];

            const entries = [];
            for (const year of years) {
                const entry = findEntry(authorText, year);
                if (entry) entries.push(entry);
            }
            return entries;
        }

        function isExcludedWord(word) {
            return excludeWords.has(word.toLowerCase());
        }

        function linkCitations() {
            if (bibEntries.length === 0) return;

            ['#main-text', '#preamble', '#sep-notes-list'].forEach(sel => {
                const container = document.querySelector(sel);
                if (!container) return;

                const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
                    acceptNode: n => {
                        if (n.parentElement.closest('a, script, style, h1, h2, h3, h4, sup, .sep-cite'))
                            return NodeFilter.FILTER_REJECT;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                });

                const nodes = [];
                while (walker.nextNode()) nodes.push(walker.currentNode);

                nodes.forEach(node => {
                    const text = node.textContent;
                    if (!/\d{4}/.test(text)) return;

                    const replacements = [];

                    // Pattern for Author (year, year, year) or Author (year; year) or Author (year and year)
                    const multiYearPat = /([A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿ'''-]+)\s*\(\s*((?:1[5-9]\d{2}|20[0-2]\d)[a-z]?(?:\s*(?:[,;]|and)\s*(?:1[5-9]\d{2}|20[0-2]\d)[a-z]?)+)\s*\)/g;
                    let match;

                    while ((match = multiYearPat.exec(text)) !== null) {
                        const author = match[1];
                        if (isExcludedWord(author)) continue;

                        const yearsStr = match[2];
                        const years = yearsStr.match(/(1[5-9]\d{2}|20[0-2]\d)[a-z]?/g) || [];

                        const entries = findEntriesByAuthorYears(author, years);
                        if (entries.length > 0) {
                            const seenIds = new Set();
                            const uniqueEntries = entries.filter(e => {
                                if (seenIds.has(e.el.id)) return false;
                                seenIds.add(e.el.id);
                                return true;
                            });

                            const entriesData = uniqueEntries.map(e => ({
                                id: e.el.id,
                                author: e.authorFull,
                                year: e.year,
                                text: e.text
                            }));

                            const link = document.createElement('a');
                            link.href = '#' + entries[0].el.id;
                            link.className = 'sep-cite';
                            link.textContent = match[0];
                            link.dataset.entriesJson = JSON.stringify(entriesData);

                            replacements.push({
                                start: match.index,
                                end: match.index + match[0].length,
                                html: link.outerHTML
                            });
                        }
                    }

                    const yearRegex = /\b(1[5-9]\d{2}|20[0-2]\d)([a-z])?\b/g;

                    while ((match = yearRegex.exec(text)) !== null) {
                        // Skip if already covered by multi-year pattern
                        if (replacements.some(r => match.index >= r.start && match.index < r.end)) continue;

                        const year = match[1] + (match[2] || '');
                        const yearClean = match[1];
                        const yearStart = match.index;
                        const yearEnd = yearStart + match[0].length;

                        const before = text.slice(0, yearStart);
                        const after = text.slice(yearEnd);

                        let linkStart = yearStart;
                        let linkEnd = yearEnd;
                        let entries = [];
                        let matched = false;

                        // Pattern: Author et al. (year)
                        const etAlPat = /([A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿ'''-]+)\s+et\s+al\.?\s*\(?\s*$/i;
                        let m = before.match(etAlPat);
                        if (m && !isExcludedWord(m[1])) {
                            const entry = findEntry(m[1], year);
                            if (entry) {
                                entries = [entry];
                                linkStart = before.lastIndexOf(m[1]);
                                matched = true;
                            }
                        }

                        // Pattern: Author, Author, & Author (year)
                        if (!matched) {
                            const threeAuthPat = /([A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿ'''-]+),\s+([A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿ'''-]+),?\s+(?:&|and)\s+([A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿ'''-]+)\s*\(?\s*$/i;
                            m = before.match(threeAuthPat);
                            if (m && !isExcludedWord(m[1]) && !isExcludedWord(m[2]) && !isExcludedWord(m[3])) {
                                const entry = findEntry(m[1], year) || findEntry(m[2], year) || findEntry(m[3], year);
                                if (entry) {
                                    entries = [entry];
                                    linkStart = before.lastIndexOf(m[1]);
                                    matched = true;
                                }
                            }
                        }

                        // Pattern: Author & Author (year)
                        if (!matched) {
                            const twoPat = /([A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿ'''-]+)\s+(?:&|and)\s+([A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿ'''-]+)\s*\(?\s*$/i;
                            m = before.match(twoPat);
                            if (m && !isExcludedWord(m[1]) && !isExcludedWord(m[2])) {
                                const entry = findEntry(m[1], year) || findEntry(m[2], year);
                                if (entry) {
                                    entries = [entry];
                                    linkStart = before.lastIndexOf(m[1]);
                                    matched = true;
                                }
                            }
                        }

                        // Pattern: van Fraassen, de Finetti, etc.
                        if (!matched) {
                            const prefixPat = /((?:van|von|de|du|la|le|der|den|di)\s+[A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿ'''-]+)\s*\(?\s*$/i;
                            m = before.match(prefixPat);
                            if (m) {
                                const entry = findEntry(m[1], year);
                                if (entry) {
                                    entries = [entry];
                                    linkStart = before.search(new RegExp(m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(?\\s*$', 'i'));
                                    matched = true;
                                }
                            }
                        }

                        // Pattern: Single Author
                        if (!matched) {
                            const singlePat = /([A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿ'''-]+)'?s?\s*\(?\s*$/;
                            m = before.match(singlePat);
                            if (m && !isExcludedWord(m[1]) && m[1].length >= 3) {
                                const entry = findEntry(m[1], year);
                                if (entry) {
                                    entries = [entry];
                                    linkStart = before.lastIndexOf(m[1]);
                                    matched = true;
                                }
                            }
                        }

                        // Pattern: Standalone year in parentheses
                        if (!matched) {
                            const parenBefore = /\(\s*$/.test(before);
                            const parenAfter = /^[a-z]?\s*\)/.test(after);

                            if (parenBefore && parenAfter && yearIndex[year]) {
                                entries = yearIndex[year];
                                matched = true;
                            }
                        }

                        if (entries.length > 0) {
                            const extraMatch = after.match(/^([a-z])?(\s*\[\d{4}\])?(:\s*[\w\d]+(?:[-–][\w\d]+)?)?(\s*(?:ch\.?|chapter|sect?\.?|§)\s*[\d.]+)?(ff\.?)?/i);
                            if (extraMatch && extraMatch[0]) {
                                linkEnd = yearEnd + extraMatch[0].length;
                            }

                            const linkText = text.slice(linkStart, linkEnd);
                            const primary = entries[0];

                            const seenIds = new Set();
                            const uniqueEntries = entries.filter(e => {
                                if (seenIds.has(e.el.id)) return false;
                                seenIds.add(e.el.id);
                                return true;
                            });

                            const entriesData = uniqueEntries.map(e => ({
                                id: e.el.id,
                                author: e.authorFull,
                                year: e.year,
                                text: e.text
                            }));

                            const link = document.createElement('a');
                            link.href = '#' + primary.el.id;
                            link.className = 'sep-cite';
                            link.textContent = linkText;
                            link.dataset.entriesJson = JSON.stringify(entriesData);

                            replacements.push({
                                start: linkStart,
                                end: linkEnd,
                                html: link.outerHTML
                            });
                        }
                    }

                    if (replacements.length === 0) return;

                    replacements.sort((a, b) => b.start - a.start);
                    const filtered = [];
                    let minStart = Infinity;
                    for (const r of replacements) {
                        if (r.end <= minStart) {
                            filtered.push(r);
                            minStart = r.start;
                        }
                    }

                    let html = text;
                    for (const r of filtered) {
                        html = html.slice(0, r.start) + r.html + html.slice(r.end);
                    }

                    const span = document.createElement('span');
                    span.innerHTML = html;
                    node.parentNode.replaceChild(span, node);
                });
            });
        }

        function initTooltip() {
            const tip = document.createElement('div');
            tip.id = 'sep-tip';
            tip.innerHTML = '<div id="sep-tip-label"></div><div id="sep-tip-text"></div>';
            document.body.appendChild(tip);

            let timeout;
            const show = (el, label, html) => {
                clearTimeout(timeout);
                document.getElementById('sep-tip-label').textContent = label;
                document.getElementById('sep-tip-text').innerHTML = html;

                const r = el.getBoundingClientRect();
                let top = r.bottom + 10;
                if (top + 200 > window.innerHeight) top = r.top - 220;
                tip.style.top = Math.max(10, top) + 'px';
                tip.style.left = Math.max(16, Math.min(r.left, window.innerWidth - 540)) + 'px';
                tip.classList.add('show');
            };
            const hide = () => { timeout = setTimeout(() => tip.classList.remove('show'), 250); };

            tip.onmouseenter = () => clearTimeout(timeout);
            tip.onmouseleave = hide;

            document.querySelectorAll('sup a').forEach(a => {
                const m = a.href.match(/#note-?(\d+)/);
                if (m && notesData[m[1]]) {
                    a.onmouseenter = () => show(a, 'Note ' + m[1], notesData[m[1]]);
                    a.onmouseleave = hide;
                }
            });

            document.querySelectorAll('.sep-cite').forEach(a => {
                a.onmouseenter = () => {
                    try {
                        const entries = JSON.parse(a.dataset.entriesJson);
                        if (entries.length === 1) {
                            show(a, entries[0].author + ' (' + entries[0].year + ')', entries[0].text);
                        } else {
                            const label = entries.length + ' references';
                            const html = entries.map(e =>
                                `<div class="sep-tip-entry"><strong>${e.author} (${e.year})</strong><br>${e.text}</div>`
                            ).join('');
                            show(a, label, html);
                        }
                    } catch (e) {}
                };
                a.onmouseleave = hide;
            });
        }

        function initCiteModal() {
            const modal = document.createElement('div');
            modal.id = 'sep-cite-modal';
            modal.innerHTML = `<div id="sep-cite-box">
                <div id="sep-cite-title"><span>Cite This Entry</span><button id="sep-cite-close">×</button></div>
                <div id="sep-cite-tabs">
                    <button class="sep-cite-tab active" data-tab="text">Text Citation</button>
                    <button class="sep-cite-tab" data-tab="bibtex">BibTeX</button>
                </div>
                <div id="sep-cite-text">Loading...</div>
                <div id="sep-cite-bibtex">Loading...</div>
                <button id="sep-cite-copy">Copy to Clipboard</button>
            </div>`;
            document.body.appendChild(modal);
            modal.onclick = e => { if (e.target === modal) modal.classList.remove('show'); };
            document.getElementById('sep-cite-close').onclick = () => modal.classList.remove('show');

            // Tab switching
            modal.querySelectorAll('.sep-cite-tab').forEach(tab => {
                tab.onclick = () => {
                    modal.querySelectorAll('.sep-cite-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const isText = tab.dataset.tab === 'text';
                    document.getElementById('sep-cite-text').style.display = isText ? 'block' : 'none';
                    document.getElementById('sep-cite-bibtex').style.display = isText ? 'none' : 'block';
                };
            });

            document.getElementById('sep-cite-copy').onclick = async () => {
                const btn = document.getElementById('sep-cite-copy');
                const activeTab = modal.querySelector('.sep-cite-tab.active').dataset.tab;
                const textToCopy = activeTab === 'text' ? citationText : bibtexText;
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    btn.textContent = 'Copied!'; btn.classList.add('copied');
                    setTimeout(() => { btn.textContent = 'Copy to Clipboard'; btn.classList.remove('copied'); }, 2000);
                } catch (e) {}
            };
        }

        async function showCitationModal() {
            const modal = document.getElementById('sep-cite-modal');
            const textEl = document.getElementById('sep-cite-text');
            const bibtexEl = document.getElementById('sep-cite-bibtex');

            modal.classList.add('show');

            if (!citationText) {
                textEl.textContent = 'Loading citation...';
                bibtexEl.textContent = 'Loading BibTeX...';

                const entry = window.location.pathname.split(/\/entries\//i)[1]?.replace(/\/$/, '');
                try {
                    const res = await fetch(`https://plato.stanford.edu/cgi-bin/encyclopedia/archinfo.cgi?entry=${entry}`);
                    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
                    citationText = doc.querySelector('blockquote')?.textContent.trim().replace(/\s+/g, ' ') || 'Citation not found';
                    bibtexText = doc.querySelector('pre')?.textContent.trim() || 'BibTeX not found';
                } catch (e) {
                    citationText = 'Failed to load citation';
                    bibtexText = 'Failed to load BibTeX';
                }
            }

            textEl.textContent = citationText;
            bibtexEl.textContent = bibtexText;
        }

        function initControls() {
            const btns = document.createElement('div');
            btns.id = 'sep-top-btns';
            btns.innerHTML = `<button class="sep-btn" id="sep-cite-btn" title="Cite this entry (C)">❝</button><button class="sep-btn" id="sep-dark" title="Dark mode (D)">${darkMode ? '☀' : '☾'}</button>`;
            document.body.appendChild(btns);
            document.getElementById('sep-cite-btn').onclick = showCitationModal;
            document.getElementById('sep-dark').onclick = () => setDark(!darkMode);

            const back = document.createElement('button');
            back.id = 'sep-back-top';
            back.innerHTML = '⌃';
            back.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
            document.body.appendChild(back);
            window.addEventListener('scroll', () => back.classList.toggle('show', scrollY > 500), { passive: true });
        }

        function initProgress() {
            const bar = document.createElement('div');
            bar.id = 'sep-progress';
            document.body.appendChild(bar);
            window.addEventListener('scroll', () => { bar.style.width = Math.min(100, scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%'; }, { passive: true });
        }

        function initActive() {
            const links = document.querySelectorAll('#sep-toc a:not(#sep-toc-top)');
            const sections = [];
            links.forEach(a => { const el = document.getElementById(a.getAttribute('href')?.slice(1)); if (el) sections.push({ a, el }); });
            const update = () => { let cur = sections[0]; sections.forEach(s => { if (s.el.getBoundingClientRect().top < 150) cur = s; }); links.forEach(a => a.classList.remove('active')); cur?.a.classList.add('active'); };
            window.addEventListener('scroll', update, { passive: true });
            update();
        }

        document.addEventListener('keydown', e => {
            if (e.target.matches('input,textarea')) return;
            if (e.key === 'd') setDark(!darkMode);
            if (e.key === 't') window.scrollTo({ top: 0, behavior: 'smooth' });
            if (e.key === 'c' && !e.ctrlKey && !e.metaKey) showCitationModal();
            if (e.key === 'Escape') document.getElementById('sep-cite-modal')?.classList.remove('show');
        });

        async function init() {
            setDark(darkMode);
            const hasNotes = await fetchNotes();
            createHeader();
            buildTOC(hasNotes);
            initCiteModal();
            initControls();
            initProgress();
            initActive();
            setTimeout(() => {
                buildBibIndex();
                linkCitations();
                initTooltip();
            }, 100);
        }

        init();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
    else main();
})();