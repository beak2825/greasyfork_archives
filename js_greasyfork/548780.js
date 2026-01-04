// ==UserScript==
// @name         GitHub — View File Before Commit
// @namespace    https://github.com/jwbth
// @version      0.1
// @description  Adds "View file before commit" to GitHub's "View file" menu on commit pages, linking to the previous revision of that file (if any). This is useful to trace code chunks when they are moved between files. Uses a MutationObserver and fetches the per-file commits page to find the previous SHA.
// @author       jwbth
// @match        https://github.com/*/*/commit/*
// @match        https://github.com/*/*/pull/*/commits/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548780/GitHub%20%E2%80%94%20View%20File%20Before%20Commit.user.js
// @updateURL https://update.greasyfork.org/scripts/548780/GitHub%20%E2%80%94%20View%20File%20Before%20Commit.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SCRIPT_NAME = 'View File Before Commit';

  // configuration: how many distinct shas we want to find (we need 2: current and previous)
  const NEED_SHAS = 2;

  // Helper: parse blob URL path into owner, repo, ref, filePath
  // Expects a path like: /owner/repo/blob/<ref>/path/to/file
  function parseBlobPath(pathname) {
    const m = pathname.match(/^\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
    if (!m) return null;
    return { owner: m[1], repo: m[2], ref: m[3], filePath: m[4] };
  }

  // Helper: given owner/repo/ref/filePath, build commits URL (relative)
  function commitsUrl({ owner, repo, ref, filePath }) {
    return `/${owner}/${repo}/commits/${ref}/${filePath}`;
  }

  /**
   * Extract up to NEED_SHAS distinct commit SHAs for the given file
   * from a `commits` page Document. SHAs are returned in order of appearance.
   */
  function extractShasFromDoc(doc, owner, repo, filePath) {
    const SHA_RE = /^[0-9a-f]{7,40}$/;
    const prefix = `/${owner}/${repo}/blob/`;
    const shas = new Set();

    for (const a of doc.querySelectorAll('a')) {
      try {
        const href = a.getAttribute('href') || a.href;
        if (!href) continue;

        const url = new URL(href, location.origin);
        if (!url.pathname.startsWith(prefix)) continue;

        const rest = url.pathname.slice(prefix.length); // "<sha>/path/to/file"
        const slashIndex = rest.indexOf('/');
        if (slashIndex < 7) continue; // sha should be at least 7 chars

        const sha = rest.slice(0, slashIndex);
        if (!SHA_RE.test(sha)) continue;

        const pathPart = rest.slice(slashIndex + 1);
        // Compare decoded path parts to avoid %-encoding mismatches
        if (decodeURIComponent(pathPart) !== decodeURIComponent(filePath)) continue;

        shas.add(sha);
        if (shas.size >= NEED_SHAS) break;
      } catch {
        // ignore malformed anchors / URLs
      }
    }

    return Array.from(shas);
  }

  // Insert a new menu item by cloning the existing list item and modifying it.
  function insertPrevMenuItem(existingAnchor, prevSha, filePath) {
    const li = existingAnchor.closest('li');
    if (!li) return;

    // Avoid inserting twice: mark processed anchors with data attribute
    if (li.dataset.prevInserted === '1') return;

    // Clone the LI, change anchor href and label
    const newLi = li.cloneNode(true);

    // Find the anchor inside the clone
    const a = newLi.querySelector('a');
    if (!a) return;

    // Remove id to avoid duplicates
    a.removeAttribute('id');

    // Compute new href absolute URL
    // Keep relative path (/owner/repo/blob/<sha>/filePath) but preserve hostname
    // Get owner/repo from existingAnchor.href
    const parsed = parseBlobPath(existingAnchor.getAttribute('href') || existingAnchor.href);
    if (!parsed) return;
    const newHref = `/${parsed.owner}/${parsed.repo}/blob/${prevSha}/${filePath}`;
    a.setAttribute('href', newHref);

    // Update label text (find the element that contains the visible text; fallback to anchor text)
    // Many GitHub UI elements nest the visible label inside a span with a specific class; be permissive
    const labelElement = Array.from(newLi.querySelectorAll('span,div')).find(
      (el) => el.textContent && el.textContent.trim() === 'View file'
    );
    if (labelElement) {
      labelElement.textContent = 'View file before commit';
    } else {
      // fallback
      a.textContent = 'View file before commit';
    }

    // Insert after the original li
    li.parentNode.insertBefore(newLi, li.nextSibling);

    // Mark original li so we don't insert again for the same menu
    li.dataset.prevInserted = '1';
  }

  // Main worker: given the found "View file" anchor element, find previous commit and insert item
  async function handleViewFileAnchor(anchor) {
    if (!anchor || !anchor.getAttribute) return;
    // already processed?
    if (anchor.dataset.prevProcessed === '1') return;
    anchor.dataset.prevProcessed = '1';

    // parse href
    const href = anchor.getAttribute('href') || anchor.href;
    const parsed = parseBlobPath(href);
    if (!parsed) {
      // not a blob URL
      return;
    }

    const cUrl = commitsUrl(parsed);
    try {
      const resp = await fetch(cUrl, { credentials: 'same-origin' });
      if (!resp.ok) {
        console.warn(`${SCRIPT_NAME}: failed to fetch commits page`, cUrl, resp.status);
        return;
      }
      const html = await resp.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const shas = extractShasFromDoc(doc, parsed.owner, parsed.repo, parsed.filePath);
      if (shas.length < 2) {
        // no previous commit for this file found
        return;
      }
      const previousSha = shas[1]; // second one is previous commit
      insertPrevMenuItem(anchor, previousSha, parsed.filePath);
    } catch (e) {
      console.error(`${SCRIPT_NAME}: error`, e);
    }
  }

  // Scans a node subtree for "View file" anchors and calls handler for each one found.
  function scanForViewFile(node) {
    // find anchors that *look like* the "View file" menu entry
    // attempt a few selection strategies:
    // 1) exact class from your DOM sample
    // 2) role=menuitem and inner label 'View file'
    // 3) any anchor with href containing '/blob/' and closest list indicates a menu
    const candidates = [];

    // strategy 1: specific classes (fast)
    Array.from(
      (node.querySelectorAll &&
        node.querySelectorAll('a.prc-ActionList-ActionListContent-sg9-x.prc-Link-Link-85e08')) ||
        []
    ).forEach((a) => candidates.push(a));

    // strategy 2: anchors with role=menuitem and visible text "View file"
    Array.from(
      (node.querySelectorAll && node.querySelectorAll('a[role="menuitem"]')) || []
    ).forEach((a) => {
      const text = (a.textContent || '').trim();
      if (text === 'View file') candidates.push(a);
    });

    // strategy 3: anchors inside menus whose href contains '/blob/'
    Array.from((node.querySelectorAll && node.querySelectorAll('a[href*="/blob/"]')) || []).forEach(
      (a) => {
        // ensure anchor is inside something that looks like an action list/menu
        if (
          a.closest &&
          a.closest(
            '.prc-ActionList-ActionList-X4RiC, .prc-ActionMenu-ActionMenuContainer-XdFHv, [role="menu"], .js-file-action'
          )
        ) {
          candidates.push(a);
        }
      }
    );

    // deduplicate
    const uniq = Array.from(new Set(candidates));

    for (const a of uniq) {
      // only handle anchors that point to /<owner>/<repo>/blob/...
      if (!/\/[^/]+\/[^/]+\/blob\//.test(a.getAttribute('href') || a.href)) continue;
      handleViewFileAnchor(a);
    }
  }

  // Mutation observer: watch for overlay/menu nodes being added
  const observer = new MutationObserver((muts) => {
    for (const mut of muts) {
      if (!mut.addedNodes || mut.addedNodes.length === 0) continue;
      for (const node of mut.addedNodes) {
        // Some menus are wrapped in small containers; scan subtree for the menu anchor
        try {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // quick textual heuristic: only search in nodes that contain "View file" or have 'prc-ActionMenu' classes
            const el = /** @type {Element} */ (node);
            if (el.textContent && el.textContent.includes('View file')) {
              scanForViewFile(el);
            } else if (
              el.classList &&
              (el.classList.contains('prc-ActionMenu-ActionMenuContainer-XdFHv') ||
                el.classList.contains('prc-ActionList-ActionList-X4RiC'))
            ) {
              scanForViewFile(el);
            } else {
              // for safety, do a light scan (limits to anchors under this node)
              // but only if there are anchors present
              if (el.querySelector && el.querySelector('a')) {
                scanForViewFile(el);
              }
            }
          }
        } catch (e) {
          // swallow errors from scanning unknown structures
          console.error(`${SCRIPT_NAME}: scan error`, e);
        }
      }
    }
  });

  // Start observing the document body
  function start() {
    const root = document.body;
    if (!root) return;
    observer.observe(root, { childList: true, subtree: true });

    // Also do an initial scan in case the menu is already present
    scanForViewFile(document);
    console.info(`${SCRIPT_NAME}: observer started`);
  }

  // Start after a small delay to allow GitHub's dynamic HTML to initialize
  setTimeout(start, 400);
})();
