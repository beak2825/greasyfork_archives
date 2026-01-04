// ==UserScript==
// @name        Gridify (PC)
// @namespace   Violentmonkey Scripts
// @match       https://wtr-lab.com/en/library*
// @grant       none
// @version     1.2
// @author      -
// @description 10/17/2025, 7:11:55 PM
// @downloadURL https://update.greasyfork.org/scripts/553053/Gridify%20%28PC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553053/Gridify%20%28PC%29.meta.js
// ==/UserScript==

(function () {
  /* ---------- config ---------- */
  const TARGET_CARD_WIDTH_PX = 121;  // your width
const TARGET_CARD_HEIGHT_PX = 260; // your fixed height
const TARGET_CARD_GAP_PX = 10;      // grid gap
  const AFTER_LOADMORE_RESTYLE_DELAY = 600; // ms after load-more click to restyle
  const POLL_INTERVAL_MS = 800; // how often we check for initial library presence
  const POLL_TIMEOUT_MS = 30000; // stop trying after this (ms)

  /* ---------- helpers ---------- */
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- restyle logic (unchanged core, idempotent) ---------- */
  let compactMode = true;

// --- Transform single item ---
function transformItem(item) {
  if (!item) return;
Object.assign(item.style, {
  width: '121px',
  height: '265px',
  margin: '0',
  padding: '0',
  boxSizing: 'border-box',
  display: 'inline-block',
  verticalAlign: 'top',
  flex: 'none',
  gridColumn: 'auto',
  justifySelf: 'start',
  alignSelf: 'start',
});
const style = document.createElement('style');
style.textContent = `
  .serie-item {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    width: ${TARGET_CARD_WIDTH_PX}px !important;
    max-width: ${TARGET_CARD_WIDTH_PX}px !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* In case the inner shadow/border is from .compact-card */
  .compact-card {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  /* Also stop any hover border effects */
  .serie-item:hover,
  .compact-card:hover {
    border: none !important;
    box-shadow: none !important;
  }
`;
document.head.appendChild(style);
  // revert to original if not compact mode (MUST reset styles here)
  if (!compactMode && item.dataset.compact === '1') {
    if (item.dataset.originalHTML) item.innerHTML = item.dataset.originalHTML;
    item.dataset.compact = '';
    item.style.width = '';
    item.style.padding = '';
    item.style.margin = '';
    item.style.boxSizing = '';
    return;
  }

  // store original HTML ONLY IF NOT ALREADY STORED
  if (!item.dataset.originalHTML) item.dataset.originalHTML = item.innerHTML;

  if (item.dataset.compact === '1') return; // already transformed
  item.dataset.compact = '1';

  const imageWrap = item.querySelector('.image-wrap');
  const btnLine = item.querySelector('.w-100.btn-line.merged, .btn-line.merged');
  const chCurrent = item.dataset.currentChapter || '';
  const chTotal = item.dataset.totalChapters || '';

  // --- Get title from detail-wrap ---
  const titleLink = item.querySelector('.detail-wrap a.title');
  const titleText = titleLink ? titleLink.textContent.trim() : 'Unknown';

  const infoLine = item.querySelector('.detail-wrap .info-line.d-flex');
  let progressText = '';
  if (infoLine) {
    // Find the span that contains "Progress:"
    const progressSpan = Array.from(infoLine.querySelectorAll('span')).find(s => s.textContent.includes('Progress:'));
    if (progressSpan) {
      progressText = progressSpan.textContent.trim().replace('Progress: ', '');
    }
  }


  // --- Card container ---
  const card = document.createElement('div');
  card.className = 'compact-card';
// --- Card container ---
Object.assign(card.style, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '121px',
  textAlign: 'left',
  padding: '0px',
  borderRadius: '0px',
  background: '#111',
  overflow: 'hidden',
  boxSizing: 'border-box',
  height: '100%',
});



  // --- Cover ---
  if (imageWrap) {
    imageWrap.style.width = '121px';
    imageWrap.style.display = 'block';
    imageWrap.style.margin = '0';
    const img = imageWrap.querySelector('img');
    if (img) {
      img.style.width = '121px';
      img.style.height = '200px';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
    }
    card.appendChild(imageWrap);
  }

  // QOL: Create a content wrapper for padding
  const contentWrap = document.createElement('div');
// --- Content wrapper ---
Object.assign(contentWrap.style, {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flexGrow: '1',
  width: '121px',
  minWidth: '0',
  maxWidth: '100%',
  boxSizing: 'border-box',
});
  card.appendChild(contentWrap);


// --- Title ---
const titleWrap = document.createElement('div');
titleWrap.textContent = titleText;
titleWrap.className = 'compact-title';
Object.assign(titleWrap.style, {
  fontSize: '12px',
  fontWeight: '500',
  lineHeight: '1.2',
  width: '100%',
  maxWidth: '100%',
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 4,              // limit to 2 lines max
  WebkitBoxOrient: 'vertical',     // vertical orientation for clamping
  wordBreak: 'break-word',
  whiteSpace: 'normal',
  margin: '0',
  padding: '0',
  color: '#fff',
  minHeight: `${1.2 * 12 * 2}px`,  // keep consistent height
});
contentWrap.appendChild(titleWrap);


  // --- Controls container ---
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

  // --- Continue Button ---
  if (btnLine) {
    const continueBtn = btnLine.querySelector('a.btn, a.btn-dark, a.btn-secondary') || btnLine.querySelector('a');
    if (continueBtn) {
Object.assign(continueBtn.style, {
    display: 'block',
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

  // 💡 NEW 3: Progress Number below Continue Button
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

  // --- Chapter Numbers (Original, now hidden) ---
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
      display: 'none',
    });
    controls.appendChild(chapterDiv);
  }

  contentWrap.appendChild(controls);

  // --- Remove original detail-wrap ---
  const detailWrap = item.querySelector('.detail-wrap');
  if (detailWrap) detailWrap.remove();

  // --- Finalize ---
  item.innerHTML = '';
  item.appendChild(card);
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
    gap: '8px',
    justifyContent: 'start',
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
  if (!grid) return;

  items.forEach(item => {
    transformItem(item);
    if (compactMode && !grid.contains(item)) grid.appendChild(item);
  });

  // Move grid items back to parent container if switching to original layout
  if (!compactMode) {
      qa('.serie-item').forEach(item => {
          if (item.parentElement === grid) {
              grid.parentElement.appendChild(item);
          }
      });
      grid.remove();
  }
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

function installFolderSwitchListener() {
  document.addEventListener('click', (e) => {
    const folderBtn = e.target.closest('.folder-btn');
    if (folderBtn) {
      console.log('[CompactGrid] Folder switch detected:', folderBtn.textContent.trim());
      // Delay slightly to allow new content to render
      setTimeout(() => {
          restyleAll();
          autoClickLoadMore(); // 🔹 restart auto-load-more
      }, 700);

      setTimeout(() => {
          restyleAll();
          autoClickLoadMore(); // run again for safety if async render
      }, 1500);
    }
  }, { passive: true });
}


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

let lastLoadTime = 0;  // prevent spamming clicks
const LOAD_COOLDOWN = 1500; // ms between clicks

function autoClickLoadMoreOnScroll() {
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        const scrollPercent = (scrollTop + windowHeight) / docHeight;

        // Only trigger if scrolled past 70% and cooldown has passed
        if (scrollPercent > 0.7 && Date.now() - lastLoadTime > LOAD_COOLDOWN) {
            const loadMoreBtn = document.querySelector('.d-flex.w-100.load-more button');
            if (loadMoreBtn) {
                console.log('[AutoLoad] Clicking Load More at scroll', (scrollPercent*100).toFixed(0), '%');
                loadMoreBtn.click();
                lastLoadTime = Date.now();
            }
        }
    }, { passive: true });
}

// Run once to attach listener
autoClickLoadMoreOnScroll();




  /* ---------- start ---------- */
waitForLibraryAndInit();
installLoadMoreCatchAll();
installFolderSwitchListener();

  // also expose manual trigger in case you want to run it via console:
  window.reflowCompactLibrary = function () { restyleAll(); };

})();