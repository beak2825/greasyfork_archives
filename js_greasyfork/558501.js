// ==UserScript==
// @name         Book More
// @namespace    https://example.com/
// @version      1.2.0
// @author       cccccc
// @description  Quick access buttons for Anna (ISBN/Title) and Libby (copies title) on Douban, NeoDb, and Goodreads
// @match        https://neodb.social/book/*
// @match        https://book.douban.com/subject/*
// @match        https://www.goodreads.com/book/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558501/Book%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/558501/Book%20More.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --------- Helper: safely extract book JSON-LD ----------
  function extractBookData() {
    const script = document.querySelector('script[type="application/ld+json"]');
    if (!script) return { title: '', isbn: '' };

    let data;
    try {
      data = JSON.parse(script.textContent.trim());
    } catch (_) {
      return { title: '', isbn: '' };
    }

    if (Array.isArray(data)) {
      data = data.find(x => x['@type'] === 'Book') || data[0] || {};
    }


    function decodeHtml(html) {
                const txt = document.createElement("textarea");
                txt.innerHTML = html;
                return txt.value;}

    const title = decodeHtml(data.name || data.title || '');
    const isbn = (data.isbn || '').replace(/-/g, '');
    return { title, isbn };
  }

  const { title, isbn } = extractBookData();
  if (!title) return;

  // --------- Build search URLs ----------
  const links = {
    annaIsbn: isbn ? `https://annas-archive.se/search?q=${isbn}` : null,
    annaTitle: `https://annas-archive.se/search?q=${encodeURIComponent(title)}`,
    libby: 'https://libbyapp.com/search'
  };

  // --------- Helper: apply simple hover ----------
  function applyHover(btn, bg, hoverBg, color, hoverColor) {
    btn.addEventListener('mouseenter', () => {
      btn.style.backgroundColor = hoverBg;
      btn.style.color = hoverColor;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = bg;
      btn.style.color = color;
    });
  }

  // --------- Site configuration ----------
  const siteConfig = {
    neodb: {
      match: /^https:\/\/neodb\.social\/book\//,
      insertTarget() {
        const anchor = document.querySelector('.right.mark');
        return { parent: anchor?.parentNode, before: anchor };
      },
      container(el) {
        el.id = 'book-more-links';
        el.style.cssText = `
          float: right;
          clear: right;
          width: 25%;
          margin: 2rem 0;
          text-align: center;
        `;
      },
      buttonClass: 'bm-btn-neodb',
      hover: (btn) =>
        applyHover(
          btn,
          'transparent',
          'var(--pico-primary-hover-background)',
          'var(--pico-primary)',
          'var(--pico-primary-inverse)'
        )
    },

    douban: {
      match: /^https:\/\/book\.douban\.com\/subject\//,
      insertTarget() {
        const aside = document.querySelector('.subjectwrap .aside') ||
                      document.querySelector('.aside');
        return { parent: aside, before: aside?.firstChild };
      },
      container(el) {
        el.className = 'gray_ad no-border';
      },
      wrapper() {
        const w = document.createElement('div');
        w.className = 'mb8 pl';
        return w;
      },
      buttonWrapper(btn) {
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.appendChild(btn);
        return meta;
      },
      buttonClass: 'bm-btn-douban'
    },

    goodreads: {
      match: /^https:\/\/www\.goodreads\.com\/book\//,
      insertTarget() {
        const h = document.querySelector('#bookTitle') ||
                  document.querySelector('h1');
        return { parent: h?.parentNode, before: h };
      },
      container(el) {
        el.id = 'book-more-links';
        el.style.cssText = `
          margin: 1rem 0;
          padding: 0.5rem 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        `;
      },
      buttonClass: 'bm-btn-goodreads',
      hover: (btn) => applyHover(btn, '#f5f5f1', '#ddd', '#333', '#333')
    }
  };

  // --------- Detect site ----------
  let active = null;
  for (const key in siteConfig) {
    if (siteConfig[key].match.test(location.href)) {
      active = siteConfig[key];
      break;
    }
  }
  if (!active) return;

  // --------- Insert shared CSS ----------
  const css = `
    .bm-btn-neodb {
      display: block;
      width: 75%;
      margin: 0.3rem auto;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      text-align: center;
      border-radius: var(--pico-border-radius);
      border: 1px solid var(--pico-primary-border);
      background: transparent;
      color: var(--pico-primary);
      text-decoration: none;
      cursor: pointer;
    }
    .bm-btn-douban {
      text-decoration: none;
      cursor: pointer;
    }
    .bm-btn-goodreads {
      display: inline-block;
      margin: 0.3rem;
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      border-radius: 4px;
      border: 1px solid #d0d0ce;
      background: #f5f5f1;
      color: #333;
      text-decoration: none;
      cursor: pointer;
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // --------- Button creation ----------
  function makeButton(label, href) {
    const btn = document.createElement('a');
    btn.href = href;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.textContent = label;
    btn.className = active.buttonClass;
    if (active.hover) active.hover(btn);
    return btn;
  }

  function makeLibbyButton() {
    const btn = document.createElement('a');
    btn.href = '#';
    btn.textContent = 'Libby';
    btn.className = active.buttonClass;
    if (active.hover) active.hover(btn);

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(title);
      } catch (err) {
        alert('Copy to clipboard failed.');
      }
      window.open(links.libby, '_blank', 'noopener');
    });

    return btn;
  }

  // --------- Construct DOM ----------
  const container = document.createElement('div');
  active.container(container);

  const wrapper = active.wrapper ? active.wrapper() : container;

  const addBtn = (el) => {
    const node = active.buttonWrapper ? active.buttonWrapper(el) : el;
    wrapper.appendChild(node);
  };

  if (links.annaIsbn) addBtn(makeButton('Anna (ISBN)', links.annaIsbn));
  addBtn(makeButton('Anna (Title)', links.annaTitle));
  addBtn(makeLibbyButton());

  if (wrapper !== container) {
    container.appendChild(wrapper);
  }

  const { parent, before } = active.insertTarget();
  if (parent) parent.insertBefore(container, before);
})();