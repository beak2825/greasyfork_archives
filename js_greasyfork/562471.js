// ==UserScript==
// @name         FitGirl Alt CSS + Animations
// @namespace    FitGirl css
// @version      1.3
// @description  Modern theme with animations injected via userscript
// @match        https://fitgirl-repacks.site/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562471/FitGirl%20Alt%20CSS%20%2B%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/562471/FitGirl%20Alt%20CSS%20%2B%20Animations.meta.js
// ==/UserScript==

(function () {
  const css = `
/* ====== Base & Theme ====== */
:root {
  --bg: #0f1216;
  --bg-soft: #151a21;
  --card: #1b212a;
  --text: #e6edf3;
  --muted: #9aa7b2;
  --accent: #3fb950;
  --accent-2: #58a6ff;
  --danger: #ff6b6b;
  --link: #7ee787;
  --border: #26303a;
  --shadow: 0 10px 30px rgba(0,0,0,.35);
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 18px;
  --ease: cubic-bezier(.22,1,.36,1);
}

@media (prefers-color-scheme: light) {
  :root {
    --bg: #f7f9fc;
    --bg-soft: #ffffff;
    --card: #ffffff;
    --text: #0b1220;
    --muted: #5b6b7a;
    --accent: #2f7d32;
    --accent-2: #0b6cff;
    --danger: #d7263d;
    --link: #0b6cff;
    --border: #e6eaf0;
    --shadow: 0 10px 30px rgba(0,0,0,.08);
  }
}
.malcode {
    border-radius: 3px;
    padding: 3px;
    background-color: #334a56ed;
}
html, body {
  background: var(--bg);
  color: var(--text);
  font: 16px/1.6 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--link); text-decoration: none; }
a:hover { text-decoration: underline; }

h3{
color:white;
}
.su-spoiler-content su-u-clearfix su-u-trim{
color:white;
}
.su-spoiler.su-spoiler-open .su-spoiler-content{
color:#dfdfdf;

}
#block-7 a:nth-of-type(5){
    font-size: 18px !important;
    text-align: center !important;
    display: block !important;
    border: 1px solid #f887ff !important;
    padding: 5px !important;
    border-radius: 7px !important;
    color: #f887ff !important;
    background: url(https://fitgirl-repacks.site/wp-content/uploads/2022/08/paw.png) 10% 10% repeat !important;
    background-size: 55% !important;
}
li{
color:white;
}
.su-quote-style-default{
position: relative;
    margin-bottom: 1.5em;
    font-style: italic;
    padding: 15px;
    border-radius: 10px;
    background: #53677a;
}
.su-spoiler-title::before {
    content: "";
    margin-right: 10px;
    display: inline-block;
    transition: transform .25s var(--ease);
    color: var(--accent-2);
}
/* ====== Layout ====== */
#page {
  /*max-width: 1200px;*/
  margin: 0 auto;
  padding: 24px;
}
    .site-content, .site-main .widecolumn{
        margin-left: 9%;
        margin-right: 20%;
    }
    .site-description {
        display: block;
        margin: 0 0 18px;
        margin-top: 50px;
    }

    .primary-navigation .menu-item-has-children > a:after, .primary-navigation .page_item_has_children > a:after{
    -webkit-font-smoothing: antialiased;
        content: "";
        display: inline-block;
        font: normal 8px / 1 Genericons;
        position: absolute;
        right: 12px;
        top: 22px;
        vertical-align: text-bottom;
    }



.site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    justify-self: center;
    padding-left: 10%;
    padding-right: 10%;
    max-width: 80%;
        width: 90%;
    margin-bottom: 20px;
    border-radius: 10px;
    backdrop-filter: saturate(1.2) blur(7px);
    background:
 color-mix(in oklab, var(--bg-soft) 85%, transparent);
    border-bottom: 1px solid var(--border);
}

.header-main {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 14px 0;
  width:100%;
}
.su-spoiler.su-spoiler-open .su-spoiler-content {
    max-height: 800px;
    opacity: 1;
    transform: translateY(0);
    background: #3b4c5d;
}
.su-spoiler-style-fancy>.su-spoiler-title {
    background: #3b4c5d !important;
    font-size: .9em;
}
.su-spoiler-style-fancy {
    background: #3b4c5d;
    color: #333;
}

.site-title a {
  display: inline-block;
  font-weight: 800;
  letter-spacing: .2px;
  margin-left: 20px;
    font-size: 30px;
  color: var(--text);
  transform-origin: left center;
  /*transition: transform .35s var(--ease), color .35s var(--ease);*/
}
.site-title a, .site-title a:hover{
    color: #fff;
      display: inline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
#page {
    max-width: 100%;
    margin: 0 auto;
    padding: 24px;
}
/* ====== Primary navigation ====== */
#primary-navigation .nav-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 3px 2px;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
}
.site:before{
width:0px;
}
.content-area, .hfeed.site{
    background: var(--bg);
    border-radius: var(--radius-lg);
    padding: 20px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    width: -webkit-fill-available;
}
#primary-navigation .nav-menu > li > a {
  display: inline-block;
  padding: 8px 12px;
      height: 46px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  transition: transform .25s var(--ease), background .25s var(--ease), border-color .25s var(--ease), box-shadow .25s var(--ease);
}
#primary-navigation .nav-menu > li > a:hover {
  transform: translateY(-2px);
  text-decoration:none;
  border-color: color-mix(in oklab, var(--accent-2) 40%, var(--border));
  box-shadow: var(--shadow);
}

/* Dropdowns */
#primary-navigation .nav-menu li.menu-item-has-children {
  position: relative;
}
#primary-navigation .nav-menu li.menu-item-has-children > .sub-menu {
  position: absolute;
  top: 110%;
  left: 0;
  min-width: 260px;
  padding: 10px;
  border-radius: var(--radius);
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  opacity: 0;
  transform: translateY(-6px);
  pointer-events: none;
  transition: opacity .25s var(--ease), transform .25s var(--ease);
}
#primary-navigation .nav-menu li.menu-item-has-children:hover > .sub-menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
#primary-navigation .sub-menu a {
  display: block;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--text);
}
#primary-navigation .sub-menu a:hover {
  background: color-mix(in oklab, var(--accent-2) 12%, var(--card));
}

/* ====== Search toggle ====== */
#search-container {
  max-width: 780px;
  margin: 0 auto;
  padding: 12px 0 18px;
  transition: max-height .35s var(--ease), opacity .35s var(--ease);
  overflow: hidden;
}
#search-container.hide { max-height: 0; opacity: 0; }
#search-container .search-field {
      width: 80%;
    padding: 12px 14px;
    /* border-radius: var(--radius); */
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border: 1px solid var(--border);
    background: var(--bg-soft);
    color: var(--text);
    transition: border-color .25s var(--ease), box-shadow .25s var(--ease);
    left: -16%;
    /* top: 15%; */
    height: 50px;
    position: relative;
}
#search-container .search-field:focus {
  outline: none;
  border-color: var(--accent-2);
  box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent-2) 20%, transparent);
}

.search-field::placeholder{
color:white;
}
.post-navigation, .image-navigation{
    max-width: 800px;
    margin-left: 20px;
}
/* ====== Article card ====== */
article.post {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    padding: 15px;
        width: max-content;
    margin: 20px 0;
    animation: cardIn .45s var(--ease) both;
}
.search-box-wrapper {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    top: -3px;
    right: 174px;
    width: 100%;
    z-index: 2;
}
.search-box {
      background-color: #14191f00;
    padding: 12px;
}
.widget-grid-view-image {
    float: left;
    max-width: 100%;
    width: 25%;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.entry-header .entry-title {
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  margin: 0 0 6px;
}
.entry-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  color: var(--muted);
  font-size: .95rem;
}

/* ====== Spoilers (Shortcodes Ultimate) ====== */
.su-spoiler {

  border-radius: var(--radius);
  background: #4c617e00;
  margin: 12px 0;
  overflow: hidden;
  border:none;
  transition: border-color .25s var(--ease), box-shadow .25s var(--ease);
}
.su-spoiler:hover {

  box-shadow: 0px 0px 0px 1px #24890d;
}
.su-spoiler-title {
  cursor: pointer;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 600;
}
 .su-spoiler-icon {
    position: absolute;
    left: 7px;
    top: 12px;
    display: block;
    width: 20px;
    height: 20px;
    line-height: 21px;
    text-align: center;
    font-size: 14px;
    font-family: ShortcodesUltimateIcons;
    font-weight: 400;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
}
.su-spoiler.su-spoiler-open .su-spoiler-title::before { transform: rotate(90deg); }
.su-spoiler-content {
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
  transition: max-height .35s var(--ease), opacity .35s var(--ease), transform .35s var(--ease);
}
.s-bg-Background {
    background: #1d2634;
}
.s-color-BlackDark {
    color: #ffffff !important;
}
.s-color-BlackDark s-bg-Background{
color: #ffffff !important;
 background: #1d2634;
}

img.size-full, img.size-large, .wp-post-image, .post-thumbnail img {
    height: 300px;
    width: 400px;
    max-width: 500px;
    margin: 0 !important;
}
.su-spoiler.su-spoiler-open .su-spoiler-content {
  max-height: max-content; /* enough for lists */
  opacity: 1;
  transform: translateY(0);
}

/* ====== Download lists ====== */
.dlinks a {
  display: inline-block;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-soft);
  margin: 6px 6px 6px 0;
  transition: transform .2s var(--ease), border-color .2s var(--ease), box-shadow .2s var(--ease);
}
.dlinks a:hover {
  transform: translateY(-2px);
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
  box-shadow: var(--shadow);
}

/* ====== Screenshots grid ====== */
.entry-content p a img {
width:300px;
    margin: 1px;
    border-radius: 3px;
}
/*ul > li:nth-child(2) span{
outline: 3px solid #00d4ff !important;
border-radius: 8px;
background: rgba(0, 212, 255, 0.08) !important;
box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.25) inset;
}*/
.entry-title a {
    color: #1d9f2e;
}
.cat-links a {
    color: #1d9f2e;
}
#content-sidebar .widget, #primary-sidebar .widget {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 7px;
    margin-top: 40px !important;
    margin-bottom: -15px !important;
    animation: cardIn .45s var(--ease) both;
}

/* ====== Sidebar cards ====== */
/*#content-sidebar .widget,*/
#primary-sidebar .widget {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 16px;
  margin: 16px 0;
  animation: cardIn .45s var(--ease) both;
}
.widget .widgettitle, .widget .widget-title {
  font-weight: 700;
  margin-bottom: 10px;
}

/* ====== CTA buttons ====== */
a.donatebutton,
#lbjoin, #lbjoin2,
.wp-block-button__link {
  display: inline-block;
  background: linear-gradient(135deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 60%, var(--accent-2)) 100%);
  color: white !important;
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-weight: 700;
  letter-spacing: .2px;
  box-shadow: var(--shadow);
  transition: transform .2s var(--ease), filter .2s var(--ease);
}
a.donatebutton:hover,
#lbjoin:hover, #lbjoin2:hover,
.wp-block-button__link:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

/* ====== Footer grid ====== */
#supplementary {
  padding: 24px 0;
  border-top: 1px solid var(--border);
}
.footer-grid .widget-grid-view-image img {
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  transition: transform .25s var(--ease), box-shadow .25s var(--ease);
}
.footer-grid .widget-grid-view-image img:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow);
}

/* ====== Comments iframe overlay fix ====== */
.tolstoycomments-feed iframe {
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

/* ====== Navigation between posts ====== */
.navigation.post-navigation .nav-links a {
  display: inline-block;
    padding: 10px 12px;
    margin-bottom: 10px;
    border-radius: var(--radius-sm);
    /* border: 1px solid var(--border); */
    background: #25313d;
    color: white;
    transition: transform .2s var(--ease), border-color .2s var(--ease), box-shadow .2s var(--ease);
}
.navigation.post-navigation .nav-links a:hover {
  transform: translateY(-2px);
  border-color: var(--accent-2);
  box-shadow: var(--shadow);
}
/* ====== Entry Header ====== */
.entry-header {
  backdrop-filter: blur(6px) saturate(1.2);
  background: color-mix(in oklab, var(--bg-soft) 70%, transparent);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px 22px;
  margin-bottom: 16px;
  transition: background .35s var(--ease);
}
.site-content .entry-header {
    background-color: #1b212a;
    padding: 0 10px 12px;
}
.site-content .entry-meta {
    background-color: #1b212a;
    margin-bottom: 8px;
}
.entry-header .entry-title {
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  font-weight: 800;
  color: var(--accent); /* verde secundario */
  text-shadow: 0 2px 6px rgba(0,0,0,.25);
}

/* ====== Entry Content ====== */
.entry-content {
  backdrop-filter: blur(4px);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--border);
  transition: background .35s var(--ease);
}
.site-content .entry-header, .site-content .entry-content, .site-content .entry-summary, .site-content .entry-meta, .page-content{
    max-width: -webkit-fill-available;
    background: #25313d;
    margin-top: 20px;
}
.entry-content a {
  color: var(--accent);
  font-weight: 600;
  transition: color .25s var(--ease);
}
.entry-content a:hover {
  color: var(--accent-2);
}
    .search-toggle {
        margin-right: 0;
        margin-top: 8px;
    }
}
/* ====== Meta info ====== */
.entry-meta {
  color: var(--muted);
  font-size: .9rem;
  backdrop-filter: blur(3px);
  background: color-mix(in oklab, var(--bg-soft) 60%, transparent);
  border-radius: var(--radius-sm);
  padding: 6px 10px;
}

/* ====== Content Area & Site Wrapper ====== */
.content-area,
.hfeed.site {
  background: var(--bg); /* oscuro consistente */
  border-radius: var(--radius-lg);
  padding: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  /* sin hover */
}

.alignleft{
width:300px !important;
margin-right:20px !important;
margin-left:5px !important;
}
/* ====== Micro-interactions ====== */
a, button, .su-spoiler-title { will-change: transform; }
`;

  // Inject CSS early
  const style = document.createElement('style');
  style.setAttribute('data-userscript-theme', 'fitgirl-modern');
  style.textContent = css;
  document.documentElement.appendChild(style);

  // Enhance Shortcodes Ultimate spoilers (toggle open/close)
  const ready = () => {
    document.querySelectorAll('.su-spoiler').forEach(sp => {
      const title = sp.querySelector('.su-spoiler-title');
      if (!title) return;
      title.addEventListener('click', () => {
        sp.classList.toggle('su-spoiler-open');
      });
    });

    // Optional: smooth show/hide search container when clicking "Search"
    const toggleLink = document.querySelector('.search-toggle a[aria-controls="search-container"]');
    const searchBox = document.getElementById('search-container');
    if (toggleLink && searchBox) {
      toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        searchBox.classList.toggle('hide');
        const expanded = toggleLink.getAttribute('aria-expanded') === 'true';
        toggleLink.setAttribute('aria-expanded', (!expanded).toString());
      });
    }
  };
 window.addEventListener('load', () => {
  const searchbar = document.getElementById("search-container");
  if (searchbar) {
    searchbar.classList.remove("hide");
  }
});


  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
