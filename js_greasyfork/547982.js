// ==UserScript==
// @name        AO3 Quick Bookmarks
// @description Auto-fills bookmarks with a clickable link "Title – Author – 0 words, Chapter 0/0". Adds a quick-save button that pops up in the corner when you scroll up, used to capture mid-read jumps. Compatible with Entire Work. Shows +new chapters/words on the bookmarks page.
// @version     1.17
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @match       https://archiveofourown.org/*
// @grant       GM_addStyle
// @run-at      document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/547982/AO3%20Quick%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/547982/AO3%20Quick%20Bookmarks.meta.js
// ==/UserScript==

const PRIVATE_BOOKMARK = true;

let STORAGE_KEY = 'ao3BookmarkDB',
    DEFAULT_DB = { version: 1, works:{} };

// let db = loadDb();
let db = DEFAULT_DB;

let ourARegex = /(<a.*?>.*?words, Chapter.*?<\/a>)/i;

let url = location.href,
    isWork      = /\/(works|chapters)\/\d+/.test(url),
    isBookmarks = url.includes('/bookmarks'),
    isSearch    = !(isWork || isBookmarks);

if (isWork && location.hash === '#NEXT') pressNextButton();

addEventListener('DOMContentLoaded', () => {
    if (isBookmarks)   scrapeBookmarksPage();
    // else if (isSearch) annotateSearchPage();
    else if (isWork)   enhanceWorkPage();
});

// function loadDb () {
//     let raw = localStorage.getItem(STORAGE_KEY);
//     if (!raw) return DEFAULT_DB;
//     try {
//       let data = JSON.parse(raw);
//       // future migrations if (data.version == 1) {}
//       return data;
//     }
//     catch (e) { return DEFAULT_DB; }
// }
// function saveDb () { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
function saveDb () {}

/* ---------------------------- BOOKMARKS --------------------------- */
function scrapeBookmarksPage () {

    GM_addStyle(`
    .qbfav   { box-shadow: inset 0 0 2px 1px #ff7991; /* pink */  }
    .qbwatch { outline: 2px solid green; }
    `);

    let list = document.querySelectorAll("li[id^='bookmark_'][class*='work-']");

    for (let li of list){
        let workId = (li.querySelector("a[href^='/works/']")||{}).href.match(/\/works\/(\d+)/);
        if (!workId) continue;
        workId = workId[1];

        let tags = [];
        for (let tag of li.querySelectorAll(".meta.tags .tag")) {
          let text = tag.textContent.trim();
          tags.push(text);

          if (text.toLowerCase().includes("fav"))   li.classList.add("qbfav");
          if (text.toLowerCase().includes("watch")) li.classList.add("qbwatch");
        }

        let commentNode = li.querySelector(".userstuff.notes > p"),
            commentHtml = commentNode ? commentNode.innerHTML.trim() : '';

        db.works[workId] = {tags:tags, comment:commentHtml};

        /* check if this has one of our links */
        const match = commentHtml.match(ourARegex);
        if (match && match[1]){
            const temp = document.createElement('div');
            temp.innerHTML = match[1];
            let ourLink = temp.querySelector('a');

            /* stored state  "...  - 25,371 Words, Chapter 11/12"     */
            let m = ourLink.textContent.match(/ ([\d,]+) words, Chapter ([\d,]+)\/([\d,]+)/i) || [];
            let oldWords   = +(m[1]||'0').replace(/,/g,''),
                readCh = +(m[2]||'0').replace(/,/g,''),
                lastCh  = +(m[3]||'0').replace(/,/g,'');

            /* current state */
            let chNode = li.querySelector('dd.chapters'),
                wrdNode= li.querySelector('dd.words');

            let newLastCh = chNode ? +chNode.textContent.split('/')[0].replace(/,/g,'') : 0,
                newWords = wrdNode? +wrdNode.textContent.replace(/,/g,''): 0;

            /* add +N indicators besides chapters / words */
            let color;
            let plus = true;
            if (lastCh===readCh) { // caught up
                if (newLastCh>lastCh) { // updated
                    color = '#1bb900';
                    injectDiff(chNode , newLastCh - lastCh,  color, true,  true);
                    injectDiff(wrdNode, newWords - oldWords, color, false, false);
                }
            }
            else { // dropped
                if (newLastCh>lastCh) { // updated
                    color = 'rgb(242, 122, 15)';
                    injectDiff(chNode , newLastCh - readCh,  color, true,  true);
                    injectDiff(wrdNode, newWords - oldWords, color, false, false);
                }
                else if (lastCh>readCh) {
                    color = 'rgb(179, 170, 8)';
                    injectDiff(chNode , lastCh - readCh, color, true, true);
                    injectDiff(wrdNode, '?', color, false, false);
                }
            }
        }
        // console.log('Bookmark', workId, db.works[workId]);
    }

    function injectDiff(node, diff, color, bold, plus){
        if (!node) return;
        // if (!diff) return;
        let sp = document.createElement('span');
        sp.textContent = ' ' + (plus ? '+' : '') + diff.toLocaleString();
        sp.style.fontWeight= bold ? 'bold' : '';
        sp.style.color = color;

        sp.style.border = "1px solid";
        sp.style.borderRadius = "5px";
        sp.style.marginLeft = "5px";
        sp.style.paddingRight = "5px";

        node.appendChild(sp);
    }

    saveDb();

    /* display total bookmarks atop the page */
    let h2 = document.querySelector('h2');
    if (h2) h2.textContent += ' ('+Object.keys(db.works).length+' total)';
}

/* ----------------------------- SEARCH ----------------------------- */

/* no enhancements for now */
// function annotateSearchPage () {
//     let works = document.querySelectorAll("li.blurb.work");
//     for (let work of works){
//         let id = (work.querySelector("a[href^='/works/']")||{}).href.match(/\/works\/(\d+)/);
//         if (!id) continue;
//         id=id[1];
//         console.log('Search result',id, db.works[id]);
//     }
// }

/* ------------------------------ WORK ------------------------------ */

function enhanceWorkPage () {
    /* set bookmark private */
    let privateBox = document.getElementById('bookmark_private');
    if (privateBox) privateBox.checked = PRIVATE_BOOKMARK;

    let form    = document.getElementById('bookmark-form'),  // bookmark container
        notes   = document.getElementById('bookmark_notes'); // comment textarea

    /* display bookmark above the title */
    if (notes && notes.value.trim()){
        let header = document.createElement('h1');
        header.innerHTML = '<hr>Bookmark: '+notes.value +'<hr>';
        header.style = "color: #cf77ef; text-align: center; margin-bottom:-30px; margin-top:15px; font-size: 25px;";
        (document.getElementById('workskin')||document.body).prepend(header);
    }

    /* live preview at the top of the textarea
       detect any <a> in the box and inject it atop the area
       allows jumping back up if you accidentally pressed the bookmark button */
    if (notes){
        notes.addEventListener('input', updatePreview);
        updatePreview();
    }
    function updatePreview(){
        let head = form ? form.querySelector('h4.heading') : null;
        if (!head) return;

        // The form [pseud_id] is inside the head we are about to repurpose, move it up.
        head.parentElement.appendChild(document.querySelector('#bookmark_pseud_id'));

        let link = notes.value.match(/(<a.*?<\/a>)/);
        head.innerHTML = 'Bookmark: '+(link?link[1]:'');

        let linkEl = head.querySelector('a')
        if (linkEl) {
          linkEl.addEventListener('click', () => document.querySelector('.bookmark_form_placement_close')?.click())
           // disable jumping if theres is no mid-jump text search
          if (!linkEl.href.includes('#')) linkEl.style = 'pointer-events: none;'
           // limit jumping to the current page
          if (linkEl.href.includes('#'))  linkEl.href = window.location.pathname + window.location.search + '#' + linkEl.href.split('#')[1];
        }
    }

    /* floating bookmark button, shows when you scrolls up */
    injectFloatingButton();

    /* enchance default Bookmark button */
    let buttons = document.querySelectorAll('.bookmark_form_placement_open');
    for (let button of buttons) { button.addEventListener('click', onClick, true); } // capture: true => assemble link before we move to bottom

    /* -------- internal helpers ------------------------------------- */

    function injectFloatingButton() {
        const css = document.createElement('style');
        css.textContent = `.ao3-float{position:fixed;bottom:10px;left:10px;padding:6px 12px;border-radius:3px;background:#89a;color:#fff;cursor:pointer;user-select:none;will-change:transform;opacity:.85; }`;
        document.head.appendChild(css);

        const btn = document.createElement('div');
        btn.className  = 'ao3-float';
        btn.textContent = 'Bookmark';
        document.body.appendChild(btn);

        let btnH  = btn.getBoundingClientRect().height + 12;
        const EXTRA_HIDE = 20;
        let maxOff = btnH + EXTRA_HIDE;
        let offset = maxOff; // start hidden
        btn.style.transition = 'none'; // first frame
        btn.style.transform  = `translateY(${offset}px)`;

        const clamp = (v, mn, mx) => (v < mn ? mn : v > mx ? mx : v);
        let lastY   = scrollY;                    // baseline scroll position

        function onScroll() {
          const y  = scrollY;
          const dy = y - lastY;                   // +down, –up
          lastY    = y;

          offset   = clamp(offset + 0.6 * dy, 0, maxOff); // 0 = fully shown
          btn.style.transform = `translateY(${offset}px)`;
        }

        addEventListener('scroll', onScroll, { passive:true });

        addEventListener('resize', () => {
          btnH   = btn.getBoundingClientRect().height + 12;
          offset = clamp(offset, 0, maxOff);
          btn.style.transform = `translateY(${offset}px)`;
        });

        /* highlight while button is held */
        let highlightSpan = null;
        function highlightParagraph(){
            if (highlightSpan) return;

            let [node, snippet] = findUniqueVisibleLeaf(); // Text node chosen by algorithm
            if (!snippet) return;

            let span = document.createElement('span');
            span.style.background = 'rgba(255,255,255,0.3)';  // 30% gray overlay
            span.style.mixBlendMode = 'difference';           // darken on light bg / lighten on dark bg
            node.parentNode.insertBefore(span, node);
            span.appendChild(node);
            highlightSpan = span;
        }
        function clearHighlight(){
            if (!highlightSpan) return;
            const parent = highlightSpan.parentNode;
            parent.replaceChild(highlightSpan.firstChild, highlightSpan);
            highlightSpan = null;
        }

        btn.addEventListener('pointerdown', highlightParagraph, {passive:true});
        addEventListener('pointerup',       clearHighlight, {passive:true});
        addEventListener('pointercancel',   clearHighlight, {passive:true});

        btn.addEventListener('click', () => {
            let button = document.querySelector('.bookmark_form_placement_open');
            if (button) button.click(); // let AO3 scroll the page for us
        });
    }

    /* when the floating button is clicked */
    function onClick () {
        let link = assembleLink();
        if (!link) return;

        /* update textarea, replacing <a> inplace but keeping other text */
        if (ourARegex.test(notes.value))
             notes.value = notes.value.replace(ourARegex, link);
        else notes.value = link + ' ' + notes.value;

        updatePreview();                       // keep preview in sync
    }

    /* gather stats to create the link */
    function assembleLink () {

        const workTitle = (document.querySelector('h2.title')   || {textContent:'__error__'}).textContent.trim(),
              author    = (document.querySelector('h3.byline')  || {textContent:'Anonymous'}).textContent.trim(),
              wordsNow  = (document.querySelector('dd.words')   || {textContent:'0'}).textContent,
              chTot     = (document.querySelector('dd.chapters')|| {textContent:'0'}).textContent.split('/')[0];

        const [node, snippet] = findUniqueVisibleLeaf();

        const chapters = [...document.querySelectorAll('#chapters .chapter[id^="chapter-"]')],
              firstChapter = chapters[0],
              lastChapter  = chapters[chapters.length - 1];

        const screenTop = 0,
              screenBottom =  window.innerHeight,
              firstChapterTop = firstChapter.getBoundingClientRect().top,
              lastChapterBottom = lastChapter.getBoundingClientRect().bottom;

        function parentChapter(node) { return node.parentElement.closest('#chapters .chapter[id^="chapter-"]'); }

        const beforeFirst = screenTop < firstChapterTop,
              afterLast = screenBottom > lastChapterBottom,
              hasSnippet = node && snippet;

        let chapter, suffix, ending;
        /* START of work is visible or above */
        if (beforeFirst)     { chapter = firstChapter;        ending = 'Start';  suffix = ''; }
        /* END of work is visible or below */
        else if (afterLast)  { chapter = lastChapter;         ending = 'End';    suffix = '#NEXT'; }
        /* MIDDLE snippet jump */
        else if (hasSnippet) { chapter = parentChapter(node); ending = 'Middle'; suffix = '#:~:text=' + encodeURIComponent(snippet); }
        /* ERROR */
        else  {
            alert('AO3 Quick Bookmarks: Error, in middle of chapter but no text is visible.');
            return '';
        }

        const chNow   = chapter.id.match(/chapter-(\d+)/)[1],
              baseUrl = chapter.querySelector('a').href.match(/(\/works\/\d+(\/chapters\/\d+)?)/)[1]; // "Chapter: 1/1" does not have any chapters.
        return `<a href="${baseUrl+suffix}">${workTitle} - ${author} - ${wordsNow} words, Chapter ${chNow}/${chTot} ${ending}</a>`;
    }

    /*  first strictly visible text node that is unique on the page  */
    function findUniqueVisibleLeaf(){

        /*  WALK all TEXT_NODEs inside *all* chapter-text bodies  */
        let containers = document.querySelectorAll('#chapters .chapter[id^="chapter-"]');
        // !Exception! "Chapter: 1/1" only has #chapters, without a nested #chapter-1 and chapter link.
        // Since assembleLink() expects them, we add them here.
        if (containers.length == 0) {
            let single = document.querySelector('#chapters .userstuff');
            if (single) {
              // Make it a .chapter#chapter-1
              single.id = 'chapter-1';
              single.classList.add('chapter');
              // Give it an invisible link to the current page
              const link = document.createElement('a');
              link.href = location.href.match(/(\/works\/\d+)/)[1];

              single.prepend(link);
              containers = [single];
            }
        }
        if (!containers.length) return [null, ''];

        /*  one TreeWalker per container with a custom nextTextNode() function that bridges them  */
        const walkers = [...containers].map(c => document.createTreeWalker(c, NodeFilter.SHOW_TEXT, null));

        let wi = 0; // walker index
        function nextTextNode(){
            let n;
            while (wi < walkers.length){
                n = walkers[wi].nextNode();
                if (n) return n;
                wi++;
            }
            return null;
        }

        /*  find first TEXT_NODE whose top is visible                 */
        let node;
        while ((node = nextTextNode())){
            if (!node.nodeValue.trim()) continue;
            const rect = textNodeRect(node);
            if (rect.top > 0) break;
        }
        if (!node) return [null, ''];

        /*  helper : get the client-rect for a TEXT_NODE              */
        function textNodeRect(txt){
            const range = document.createRange();
            range.selectNodeContents(txt);
            const rect = range.getBoundingClientRect();
            range.detach?.();
            return rect;
        }

        /*  scan downward from this TEXT_NODE until a unique snippet is found  */
        while (node){
            const txt = node.nodeValue.trim();
            if (txt){
                const snippet = txt.split(/\s+/).slice(0, 10).join(' ');
                if (isUnique(snippet)){
                    return [node, snippet];
                }
            }
            node = nextTextNode();
        }
        return [null, ''];

        /*  ensure snippet appears exactly once on the current page   */
        function isUnique(snippet){
            if (!snippet) return false;
            let cnt = 0, n;
            const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
            while ((n = w.nextNode())){
                if (n.nodeValue.trim().includes(snippet)){
                    cnt++;
                    if (cnt > 1) break;
                }
            }
            return cnt === 1;
        }
    }
}

/* ------------------------------ NEXT ------------------------------ */
const WAIT = 400, SLIDE = 800;

function pressNextButton() {
    new MutationObserver((_, obs) => {
        const next = document.querySelector('.next.chapter a');
        if (next) {
          obs.disconnect();
          setTimeout(() => {
              registerUndoSlide();
              doSlide(next);
          }, WAIT);
        }
  }).observe(document.documentElement, {childList:true, subtree:true});
}

function doSlide(next) {
  /* copy of the page to the right + title + spinner */
  if (!document.getElementById('spinCSS'))
    document.head.insertAdjacentHTML('beforeend',
      '<style id="spinCSS">@keyframes spin{to{transform:rotate(360deg)}}</style>');
  document.body.insertAdjacentHTML('beforeend',
    '<div id="pageClone" style="position:fixed;top:0;left:100vw;width:100vw;height:100vh;overflow:hidden;background:#fff;opacity:.8;filter:brightness(.9);pointer-events:none;z-index:9;display:flex;flex-direction:column;justify-content:center;align-items:center;">' +
      '<div style="font:700 8vw/1 sans-serif;color:#444;">Loading<br>Next&nbsp;Chapter</div>' +
      '<div style="width:64px;height:64px;margin-top:1rem;border:8px solid #bbb;border-top-color:#444;border-radius:50%;animation:spin 1s linear infinite;"></div>' +
    '</div>');

  /* slide page left  */
  document.head.insertAdjacentHTML('beforeend',
    `<style id="slideCSS">html{overflow:hidden}body{transition:transform ${SLIDE}ms ease;transform:translateX(-100vw)}</style>`);

  // setTimeout(() => next.click(), SLIDE);
  setTimeout(() => window.location.href = next.href.split('#')[0], SLIDE);
}

/* undo the slide when we return from BF-cache */
function registerUndoSlide() {
    addEventListener('pageshow', (e) => {
        if (!e.persisted) return;

        const clone = document.getElementById('pageClone');
        if (!clone) return;

        requestAnimationFrame(() => document.body.style.transform = 'translateX(0)');
        setTimeout(() => {
            clone.remove();
            const css = document.getElementById('slideCSS');
            css && css.remove();
            document.documentElement.style.overflow = '';
            document.body.style.transform = '';
        }, SLIDE);
    })
}
