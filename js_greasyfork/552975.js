// ==UserScript==
// @name        WTRLAB Library Auto Load More + Layout Reorganization
// @namespace   Violentmonkey Scripts
// @match       https://wtr-lab.com/en/library*
// @grant       none
// @version     1.3
// @author      -
// @description Makes your library into the Webnovel grid format 
// @downloadURL https://update.greasyfork.org/scripts/552975/WTRLAB%20Library%20Auto%20Load%20More%20%2B%20Layout%20Reorganization.user.js
// @updateURL https://update.greasyfork.org/scripts/552975/WTRLAB%20Library%20Auto%20Load%20More%20%2B%20Layout%20Reorganization.meta.js
// ==/UserScript==
(function () {
  /* ---------- config ---------- */
  const TARGET_CARD_WIDTH_PX = 122; // --- MODIFIED --- Set to original cover width
  const AFTER_LOADMORE_RESTYLE_DELAY = 600; // ms after load-more click to restyle
  const POLL_INTERVAL_MS = 800; // how often we check for initial library presence
  const POLL_TIMEOUT_MS = 30000; // stop trying after this (ms)

  /* ---------- helpers ---------- */
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- restyle logic (unchanged core, idempotent) ---------- */
let compactMode = true; // default, remembers toggle via localStorage

// --- Transform single item ---
function transformItem(item) {
    if (!item) return;

    const card = item.querySelector('.compact-card');

    if (!compactMode) {
        // --- REVERT to original layout ---
        if (item.dataset.originalHTML) {
            item.innerHTML = item.dataset.originalHTML;
            item.dataset.compact = '';
        }
        return;
    }

    // already transformed? skip
    if (card) return;

    // store original HTML once
    if (!item.dataset.originalHTML) item.dataset.originalHTML = item.innerHTML;

    item.dataset.compact = '1';

    const imageWrap = item.querySelector('.image-wrap');
    const btnLine = item.querySelector('.w-100.btn-line.merged, .btn-line.merged');
    const chCurrent = item.dataset.currentChapter || '';
    const chTotal = item.dataset.totalChapters || '';

    // Get title
    const titleLink = item.querySelector('.detail-wrap a.title');
    const titleText = titleLink ? titleLink.textContent.trim() : 'Unknown';

    // Extract Progress text
    let progressText = '';
    const spans = item.querySelectorAll('.detail-wrap span');
    spans.forEach(s => {
        if (/Progress:/i.test(s.textContent)) {
            progressText = s.textContent.replace(/Progress:\s*/i, '').trim();
        }
    });

    // Create Card container
    const newCard = document.createElement('div');
    newCard.className = 'compact-card';
    Object.assign(newCard.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        textAlign: 'left',
        padding: '0',
        borderRadius: '8px',
        background: '#111',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        height: '100%',
    });

    // Cover
    if (imageWrap) {
        imageWrap.style.width = '100%';
        imageWrap.style.display = 'block';
        imageWrap.style.margin = '0';
        const img = imageWrap.querySelector('img');
        if (img) {
            img.style.width = '100%';
            img.style.height = '200px';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
        }
        newCard.appendChild(imageWrap);
    }

    const contentWrap = document.createElement('div');
    Object.assign(contentWrap.style, {
        padding: '4px 8px 8px 8px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
        gap: '4px',
    });
    newCard.appendChild(contentWrap);

    const titleWrap = document.createElement('div');
    titleWrap.textContent = titleText;
    titleWrap.className = 'compact-title';
    Object.assign(titleWrap.style, {
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '1.2',
        width: '100%',
        display: '-webkit-box',
        WebkitLineClamp: '5',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        margin: '0',
        padding: '0',
        position: 'relative',
        textAlign: 'left',
        wordBreak: 'break-word',
        minHeight: '28.8px',
        color: '#fff',
    });
    contentWrap.appendChild(titleWrap);

    const controls = document.createElement('div');
    Object.assign(controls.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        width: '100%',
        margin: '0',
        padding: '0',
        alignItems: 'flex-start',
        marginTop: 'auto',
    });

    if (btnLine) {
        const continueBtn = btnLine.querySelector('a.btn, a.btn-dark, a.btn-secondary') || btnLine.querySelector('a');
        if (continueBtn) {
            Object.assign(continueBtn.style, {
                display: 'inline-block',
                width: '100%',
                height: '24px',
                lineHeight: '22px',
                fontSize: '13px',
                boxSizing: 'border-box',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: '0',
                padding: '0',
            });
            controls.appendChild(continueBtn);
        }
    }

    if (progressText) {
        const progressDiv = document.createElement('div');
        progressDiv.textContent = `Progress: ${progressText}`;
        Object.assign(progressDiv.style, {
            fontSize: '11px',
            color: '#aaa',
            width: '100%',
            margin: '2px 0 0 0',
            padding: '0',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        });
        controls.appendChild(progressDiv);
    }

    if (chCurrent && chTotal) {
        const chapterDiv = document.createElement('div');
        chapterDiv.textContent = `${chCurrent}/${chTotal}`;
        Object.assign(chapterDiv.style, {
            fontSize: '12px',
            color: '#555',
            width: '100%',
            margin: '0',
            padding: '0',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        });
        controls.appendChild(chapterDiv);
    }

    contentWrap.appendChild(controls);

    const detailWrap = item.querySelector('.detail-wrap');
    if (detailWrap) detailWrap.remove();

    // Finalize
    item.innerHTML = '';
    item.appendChild(newCard);
}





// --- Grid container ---
function ensureGridContainer(exampleItem) {
  if (!exampleItem) return null;
  const listParent = exampleItem.parentElement;
  let grid = document.querySelector('.compact-series-grid');
  if (grid) return grid;

  grid = document.createElement('div');
  grid.className = 'compact-series-grid';
  Object.assign(grid.style, {
    display: 'grid',
    gridAutoFlow: 'row',
    // --- MODIFIED --- This is the key fix.
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '2px',
    justifyContent: 'start', // Aligns grid to the left
    alignItems: 'stretch',
    width: '100%',
  });

  listParent.insertBefore(grid, listParent.firstChild);
  return grid;
}

// --- Apply to all ---
function restyleAll() {
  const items = document.querySelectorAll('.serie-item');
  if (!items.length) return;

  const grid = ensureGridContainer(items[0]);
  if (!grid) return; // safety check

  items.forEach(item => {
    transformItem(item);
    if (compactMode && !grid.contains(item)) grid.appendChild(item);
  });

}

// --- Grid toggle button ---


// --- Initialize ---
function initCompactGrid() {
  compactMode = localStorage.getItem('compactMode') === '0' ? false : true;
  addGridToggleButton();
  restyleAll();
  window.addEventListener('resize', restyleAll);
}


  /* ---------- robust startup: poll until library exists (then stop) ---------- */
  function waitForLibraryAndInit() {
    const start = Date.now();
    const interval = setInterval(() => {
      const found = q('.serie-item');
      if (found) {
        clearInterval(interval);
        initCompactGrid(); // Call init *after* items are found
        // after 1 second more (in case more items append), run again
        // to tidy
        setTimeout(restyleAll, 900);
      } else if (Date.now() - start > POLL_TIMEOUT_MS) {
        clearInterval(interval);
        console.warn('compact layout: timed out waiting for .serie-item');
      }
    }, POLL_INTERVAL_MS);
  }

  /* ---------- capture any clicks on "Load More" via delegated listener ---------- */
  function installLoadMoreCatchAll() {
    document.addEventListener('click', (e) => {
      // matches the typical wrapper/button for load more — adapt selector if needed
      const lm = e.target.closest('.d-flex.w-100.load-more button, .load-more button, .load-more');
      if (lm) {
        // give DOM a bit of time to append new items
        setTimeout(restyleAll, AFTER_LOADMORE_RESTYLE_DELAY);
        // and run again a touch later to be safe
        setTimeout(restyleAll, AFTER_LOADMORE_RESTYLE_DELAY + 700);
      }
    }, { passive: true });
  }

let lastFoundTime = Date.now();

function autoClickLoadMore() {
    const loadMoreBtn = document.querySelector('.d-flex.w-100.load-more button');
    if (loadMoreBtn) {
        console.log('[AutoLoad] Clicking Load More');
        loadMoreBtn.click();
        lastFoundTime = Date.now(); // reset last found time
    }
}

// Run once on load and occasionally retry (in case button reappears)
const autoClickInterval = setInterval(() => {
    autoClickLoadMore();

    // stop if no button found for 10 seconds
    if (Date.now() - lastFoundTime > 10000) {
        console.log('[AutoLoad] No Load More button found for 10s, stopping.');
        clearInterval(autoClickInterval);
    }
}, 3000);

  /* ---------- start ---------- */
  waitForLibraryAndInit();
  installLoadMoreCatchAll();

  // also expose manual trigger in case you want to run it via console:
  window.reflowCompactLibrary = function () { restyleAll(); };

})();