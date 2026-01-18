// ==UserScript==
// @name         Old OT!
// @namespace    https://example.com/userscripts/old-ot
// @version      1.0.0
// @description  Attempts to revert OT! to how it was in 2017, while retaining useful new features.
// @license      MIT
// @match        https://osu.ppy.sh/community/forums/*
// @run-at       document-start
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/563135/Old%20OT%21.user.js
// @updateURL https://update.greasyfork.org/scripts/563135/Old%20OT%21.meta.js
// ==/UserScript==


(() => {

    const WALLPAPER      = "https://i.imgur.com/JVlHA8E.png";
    const UNREAD_ICON    = "https://i.imgur.com/tGX6KcT.png";
    const READ_ICON      = "https://i.imgur.com/p8LBSQ5.png";
    const NEW_TOPIC_ICON = "https://i.imgur.com/tbdDdEO.png";
    const IMPORTANT_ICON = "https://i.imgur.com/9gz0N2X.png";

    const LEGACY_AVATAR_FRAME = "https://i.imgur.com/gpSLOoi.png";
    const LEGACY_AVATAR_WHITE = "https://i.imgur.com/4MwlfKT.png";
    const LEGACY_AVATAR_WHITE_L1 = "https://i.imgur.com/lNpngdz.png";
    const LEGACY_AVATAR_WHITE_L2 = "https://i.imgur.com/gvo27ST.png";
    const LEGACY_AVATAR_WHITE_L3 = "https://i.imgur.com/0fl16HC.png";
    const LEGACY_BANNED_AVATAR = "https://i.imgur.com/aJu5cAG.png";

    const ICON_EYE   = "https://i.imgur.com/pluHWkY.png";
    const ICON_POSTS = "https://i.imgur.com/LSxtuWy.png";

    const THREADS_HEADER_52    = "https://i.imgur.com/Xc6OzDS.png";
    const THREADS_HEADER_OTHER = "https://i.imgur.com/Whyr9SB.png";

    const THREAD_BREADCRUMB_IMAGE = "https://i.imgur.com/Zr3hPc3.png";

    const LEGACY_FLAG_BASE = "https://assets.ppy.sh/old-flags/";

    const LEGACY_DEFAULT_USER_COLOUR = "#32c6f1";

    const css = `
@font-face{
  font-family:"Exo 2";
  font-style:normal;
  font-weight:400;
  font-display:swap;
  src:url(https://cdn.jsdelivr.net/fontsource/fonts/exo-2@latest/latin-400-normal.woff2) format("woff2"),
      url(https://cdn.jsdelivr.net/fontsource/fonts/exo-2@latest/latin-400-normal.woff) format("woff");
}
@font-face{
  font-family:"Exo 2";
  font-style:normal;
  font-weight:700;
  font-display:swap;
  src:url(https://cdn.jsdelivr.net/fontsource/fonts/exo-2@latest/latin-700-normal.woff2) format("woff2"),
      url(https://cdn.jsdelivr.net/fontsource/fonts/exo-2@latest/latin-700-normal.woff) format("woff");
}

@font-face{
  font-family:"Exo 2";
  font-style:italic;
  font-weight:500;
  font-display:swap;
  src:url(https://cdn.jsdelivr.net/fontsource/fonts/exo-2@latest/latin-500-italic.woff2) format("woff2"),
      url(https://cdn.jsdelivr.net/fontsource/fonts/exo-2@latest/latin-500-italic.woff) format("woff");
}

:root{
  --legacy-threads-header-image: url("${THREADS_HEADER_52}");
}

body::before{
  content:"";
  position:fixed;
  inset:0;
  z-index:-2;
  pointer-events:none;
  background:url("${WALLPAPER}") repeat top left;
  background-attachment:fixed;
}

:root{

  --legacy-panel-target: 1000px;

  --legacy-panel-gutter: 0px;

  --legacy-panel-width: min(
    var(--legacy-panel-target),
    calc(100% - (var(--legacy-panel-gutter) * 2))
  );

  --legacy-panel-edge: 24px;
}

body > div.osu-layout__section.osu-layout__section--full{
  overflow: visible !important;
}

:root{
  --legacy-panel-content-inset: 25px;
}

body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--forum{
  position:relative !important;
  background:transparent !important;

  padding-top: calc(var(--legacy-panel-top) + var(--legacy-panel-content-inset)) !important;

  overflow: visible !important;
}

.osu-page--forum .forum-list,
.osu-page--forum #topics{
  margin-top: 0 !important;
}

body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--forum::after{
  content:"";
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  width: var(--legacy-panel-width);

  aspect-ratio: 5 / 1;
  height: auto;

  background-image: var(--legacy-threads-header-image);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  box-shadow:
    0 2px 2px rgba(0,0,0,.12),
    0 6px 10px rgba(0,0,0,.16);

  z-index:0;
}

#legacy-forum-header-title{
  position:absolute !important;
  z-index: 6 !important;
  pointer-events:auto !important;

  font-family:"Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-style: italic !important;
  font-weight: 500 !important;

  font-size: var(--legacy-header-title-size, 45px) !important;
  line-height: var(--legacy-header-title-line, 45px) !important;

  color: var(--legacy-header-title-color, #ffffff) !important;
  text-shadow: var(--legacy-header-title-shadow, 0 1px 2px rgba(0,0,0, 0.7)) !important;

  white-space: nowrap !important;
  transform: translateY(-50%) !important;
  cursor: pointer !important;
  text-decoration: none !important;
}

#legacy-forum-header-title.legacy-title-wrap{
  transform: none !important;
  white-space: normal !important;
}

#legacy-forum-header-title.legacy-thread-title{
  white-space: normal !important;
  overflow: hidden !important;

  display: -webkit-box !important;
  -webkit-box-orient: vertical !important;
  -webkit-line-clamp: 2 !important;

  padding-top: 2px !important;
}

body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--forum::before{
  content:"";
  position:absolute;

  bottom: var(--legacy-panel-edge);

  left:50%;
  transform:translateX(-50%);
  width: var(--legacy-panel-width);

  background:#fff;
  box-shadow:0 3px 3px rgba(0,0,0,.18);
  border:1px solid rgba(0,0,0,.08);
  z-index:0;
}

body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--forum > *{
  position:relative;
  z-index:1;
}

.forum-topic-entry{
  border-left:0 !important;
  box-shadow:none !important;
  background-color:#fff !important;
  border-radius:8px;
  margin:6px 0;
  position:relative;
  z-index:0;
}
.forum-topic-entry > *{
  background:transparent !important;
}

.forum-topic-entry:hover::before{
  content:"";
  position:absolute;
  left:0;
  right:0;
  top:-6px;
  bottom:0;
  background:#ededed;
  border-radius:8px;
  z-index:-1;
  pointer-events:none;
}

.forum-topic-entry::after{
  content:"";
  position:absolute;
  left:12px;
  right:12px;
  bottom:0px;
  border-bottom:1px solid #cccccc;
  pointer-events:none;
}

.forum-topic-entry__bg{
  position:absolute !important;
  inset:0 !important;
  border-radius:8px !important;
  background:transparent !important;
  pointer-events:auto !important;
}

.forum-item-stripe,
.forum-item-stripe__arrow{
  display:none !important;
}

.forum-topic-entry__col--icon{
  border-left:0 !important;
  box-shadow:none !important;
  flex:0 0 40px !important;
  width:40px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
}
.forum-topic-entry__col--icon::before,
.forum-topic-entry__col--icon::after{
  content:none !important;
  display:none !important;
}

.forum-topic-entry__icon--unread{
  background-image:url("${UNREAD_ICON}") !important;
  background-repeat:no-repeat !important;
  background-position:center !important;
  background-size:contain !important;

  width:36px;
  height:36px;
  padding:0 !important;

  border-radius:50%;
  overflow:hidden;

  border:0 !important;
  outline:0 !important;
  box-shadow:none !important;
  background-color:transparent !important;
}
.forum-topic-entry__icon--unread::before,
.forum-topic-entry__icon--unread::after{
  content:none !important;
  display:none !important;
}
.forum-topic-entry__icon--unread > *{
  display:none !important;
}

.forum-topic-entry__icon:not(.forum-topic-entry__icon--unread){
  background-image:url("${READ_ICON}") !important;
  background-repeat:no-repeat !important;
  background-position:center !important;
  background-size:contain !important;

  width:36px;
  height:36px;
  padding:0 !important;

  border-radius:50%;
  overflow:hidden;

  border:0 !important;
  outline:0 !important;
  box-shadow:none !important;
  background-color:transparent !important;
}
.forum-topic-entry__icon:not(.forum-topic-entry__icon--unread) > *{
  display:none !important;
}

.forum-topic-entry__icon.legacy-important{
  background-image:url("${IMPORTANT_ICON}") !important;
  background-repeat:no-repeat !important;
  background-position:center !important;
  background-size:contain !important;

  width:36px !important;
  height:36px !important;
  padding:0 !important;

  border-radius:50% !important;
  overflow:hidden !important;

  border:0 !important;
  outline:0 !important;
  box-shadow:none !important;
  background-color:transparent !important;
}
.forum-topic-entry__icon.legacy-important > *{
  display:none !important;
}

.forum-topic-entry__icon--unread:hover,
.forum-topic-entry__icon--unread:focus,
.forum-topic-entry__icon--unread:focus-visible,
.forum-topic-entry__icon:not(.forum-topic-entry__icon--unread):hover,
.forum-topic-entry__icon:not(.forum-topic-entry__icon--unread):focus,
.forum-topic-entry__icon:not(.forum-topic-entry__icon--unread):focus-visible{
  outline:0 !important;
  box-shadow:none !important;
}

.forum-topic-entry__title{
  color:#445500 !important;
  font-weight:400;
}
.forum-topic-entry__title:hover{
  text-decoration:underline;
}
.forum-topic-entry:hover .forum-topic-entry__title{
  color:#99cc00 !important;
}

.forum-topic-entry__detail a.js-usercard{
  color:#229abb !important;
  font-weight:700;
}
.forum-topic-entry__detail a.js-usercard:hover{
  text-decoration:underline;
}

.forum-topic-entry__content--right,
.forum-topic-entry__content--right *,
.forum-topic-entry__detail,
.forum-topic-entry__detail *,
.forum-topic-entry__count,
.forum-topic-entry time,
.forum-topic-entry .js-timeago{
  color:#999999 !important;
  font-weight:700;
}

.forum-post__header-content-item a.js-post-url > time.js-timeago{

  color:#999999 !important;
  font-weight:700 !important;
}

.forum-topic-entry__content--counts,
.forum-topic-entry__content--counts *,
.forum-topic-entry__content--counts strong{
  color:#555 !important;
  font-weight:normal !important;
}

.forum-topic-entry__content--right a.js-usercard{
  color:#229abb !important;
  font-weight:700 !important;
}
.forum-topic-entry__content--right a.js-usercard:hover{
  text-decoration:underline;
}

.forum-topic-entry__col--last-link,
.forum-topic-entry__col--last-link i{
  color:#555 !important;
}
.forum-topic-entry__col--last-link:hover,
.forum-topic-entry__col--last-link:focus,
.forum-topic-entry__col--last-link:focus-visible{
  color:#555 !important;
  box-shadow:none !important;
  outline:0 !important;
}

.forum-topic-entry__col--icon .fa-lock{
  display:none !important;
}
.legacy-lock-icon{
  position:absolute;
  left:15px;
  top:50%;
  transform:translateY(-50%);
  font-size:14px;
  pointer-events:none;
  color:rgb(38,38,38) !important;
  opacity:1 !important;
  filter:none !important;
  mix-blend-mode:normal !important;
}

.forum-user-icon{ display:none !important; }

.forum-topic-entry__content--counts{
  display:flex !important;
  justify-content:flex-end !important;
  align-items:center !important;
  flex:0 0 170px !important;
  min-width:170px !important;
  white-space:nowrap !important;
}
.forum-topic-entry__count{
  min-width:7ch !important;
  text-align:right !important;
  font-variant-numeric:tabular-nums;
}
.forum-topic-entry__count strong{
  display:inline-block !important;
  min-width:7ch !important;
  text-align:right !important;
}

#legacy-create-topic .legacy-plus-icon{
  width:36px;
  height:36px;
  background-image:url("${NEW_TOPIC_ICON}") !important;
  background-repeat:no-repeat !important;
  background-position:center !important;
  background-size:contain !important;
  border-radius:50%;
  overflow:hidden;
  background-color:transparent !important;
  box-shadow:none !important;
  display:block !important;
  margin:0 auto !important;
}
#legacy-create-topic .forum-topic-entry__col--icon-plus{
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
}

.title--forum{
  font-family:"Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-weight:400 !important;
  color:#555555 !important;
}

.osu-page--forum .forum-list__header{
  background:transparent !important;
  background-image:none !important;
  border:0 !important;
  border-left:0 !important;
  border-top:0 !important;
  border-right:0 !important;
  border-bottom:0 !important;
  box-shadow:none !important;
  outline:0 !important;
  padding-right:0 !important;
  padding-left:32px !important;
}
.osu-page--forum .forum-list__header::before,
.osu-page--forum .forum-list__header::after{
  content:none !important;
  display:none !important;
  background:none !important;
}
.osu-page--forum .forum-list__header .title--forum{
  border:0 !important;
  box-shadow:none !important;
  background:transparent !important;
  background-image:none !important;
}
.osu-page--forum .forum-list__header .title--forum::before,
.osu-page--forum .forum-list__header .title--forum::after{
  content:none !important;
  display:none !important;
  background:none !important;
}

.osu-page--forum .forum-list > h2.title.title--forum{
  border:0 !important;
  border-left:0 !important;
  box-shadow:none !important;
  background:transparent !important;
  background-image:none !important;
  outline:0 !important;
}
.osu-page--forum .forum-list > h2.title.title--forum::before,
.osu-page--forum .forum-list > h2.title.title--forum::after{
  content:none !important;
  display:none !important;
  background:none !important;
  box-shadow:none !important;
  border:0 !important;
}

.legacy-subforums{ margin-top:6px; }

.legacy-subforums ul.forums{
  list-style:none;
  padding:0;
  margin:0;
  overflow:visible !important;
}

.forum-list.legacy-subforums > ul.forum-list__items{
  display:none !important;
}

.legacy-subforums .forums__forum{
  position:relative;
  z-index:1;

  display:flex;
  align-items:stretch;

  background:#fff !important;
  border-radius:0 !important;
  margin:6px 0;

  overflow:visible !important;
  box-shadow:0 3px 2px rgba(0,0,0,.10) !important;
}
.legacy-subforums .forums__forum:hover{
  background:#fff !important;
  box-shadow:0 10px 18px rgba(0,0,0,.22) !important;
  z-index:10;
}

.legacy-subforums .forums__forum:hover + .forums__forum{
  position:relative;
}
.legacy-subforums .forums__forum:hover + .forums__forum::before{
  content:"";
  position:absolute;
  left:0;
  right:0;
  top:-1px;
  height:10px;
  pointer-events:none;
  background:linear-gradient(to bottom, rgba(0,0,0,.14), rgba(0,0,0,.06), rgba(0,0,0,0));
  opacity:.55;
}

.legacy-subforums .left{
  flex:1 1 auto;
  padding:5px 12px 5px 26px !important;
  min-width:0;
  transition:none !important;
}
.legacy-subforums .right{
  flex:0 0 340px;
  min-width:0;

  padding:5px 12px;
  display:flex !important;
  align-items:center !important;
  justify-content:flex-end;
  gap:10px;

  background:#eeeeee !important;
  border-radius:0 !important;
}
.legacy-subforums .right .right-content{
  width:100%;
  min-width:0;
  text-align:left;

  display:flex !important;
  flex-direction:column !important;
  justify-content:center !important;
  gap:0px !important;

  padding:0 !important;
  margin:0 !important;
}

.legacy-subforums .left > a.name.u-forum--link{
  color:#445500 !important;
  font-weight:400;
  text-decoration:none;
  transition:color .12s ease-in-out;

  font-family:"Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-size:16px !important;
}
.legacy-subforums .left > a.name.u-forum--link:hover{
  text-decoration:underline;
}
.legacy-subforums .forums__forum:hover .left > a.name.u-forum--link{
  color:#99cc00 !important;
}
.legacy-subforums .description{
  font-family:"Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-size:12px !important;
  font-weight:400 !important;
  color:#555555 !important;
  margin-top:2px;
}

.legacy-subforums ul.subforums{
  list-style:none;
  padding:0;
  margin:6px 0 0 0;
}
.legacy-subforums ul.subforums li{
  margin:2px 0;
  font-family:"Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-size:12px !important;
  font-weight:700 !important;
}
.legacy-subforums ul.subforums a.name.u-forum--link{
  color:#445500 !important;
  font-weight:700 !important;
  text-decoration:none;
  font-family:"Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-size:12px !important;
}
.legacy-subforums ul.subforums a.name.u-forum--link i{
  color:#445500 !important;
}
.legacy-subforums ul.subforums a.name.u-forum--link i.fa-bars{
  margin-right:4px !important;
}

.legacy-subforums .forums__hover-bar,
.legacy-subforums .forums__forum:hover .forums__hover-bar{
  width:10px !important;
  flex:0 0 10px !important;
  flex-basis:10px !important;

  position:relative !important;
  background:transparent !important;
  overflow:visible !important;

  display:block !important;
  transition:none !important;
}
.legacy-subforums .forums__colour-stripe{
  display:none !important;
}
.legacy-subforums .forums__hover-bar::after{
  content:"";
  position:absolute;
  left:0;
  top:0;
  bottom:0;

  width:10px;
  background:#89b300;

  transition:width .22s cubic-bezier(.2,.8,.2,1) !important;
  will-change:width;
  z-index:0;
}
.legacy-subforums .forums__forum:hover .forums__hover-bar::after{
  width:25px;
}
.legacy-subforums .forums__hover-bar-icon{
  display:block !important;

  position:absolute !important;
  left:12.5px !important;
  top:50% !important;
  transform:translate(-50%, -50%) !important;

  z-index:1;
  opacity:0;

  color:#ffffff !important;
  line-height:1;

  transition:none !important;
  transition-delay:0s !important;
}
.legacy-subforums .forums__forum:hover .forums__hover-bar-icon{
  opacity:1;
}

.legacy-subforums .legacy-last-title{
  display:block !important;
  margin:0 !important;
  padding:0 !important;

  font-family:"Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-size:12px !important;
  line-height:14px !important;
  font-weight:600 !important;

  color:#445500 !important;
  text-decoration:none !important;

  white-space:nowrap !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;

  background:none !important;
  box-shadow:none !important;
  border:0 !important;
}
.legacy-subforums .legacy-last-meta{
  display:block !important;
  margin:0 !important;
  padding:0 !important;

  font-family:"Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-size:12px !important;
  line-height:14px !important;

  color:#555555 !important;

  background:none !important;
  box-shadow:none !important;
  border:0 !important;
}
.legacy-subforums .legacy-last-user{
  font-family:Torus, Inter, "Helvetica Neue", Tahoma, Helvetica, Arial, sans-serif !important;
  font-size:12px !important;
  font-weight:700 !important;

  color:#229abb !important;
  text-decoration:none !important;
}
.legacy-subforums .legacy-last-user:hover{
  text-decoration:underline !important;
}

.pagination-v2.pagination-v2--forum{
  display:none !important;
}

nav.forum-pagination.legacy-forum-pagination{
  display:flex !important;
  flex-direction:column !important;
  align-items:center !important;
  gap:6px !important;
  margin:24px 0 26px 0 !important;
  font-family:"Exo 2", Arial, sans-serif !important;
}

nav.forum-pagination.legacy-forum-pagination > ul,
nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext{
  list-style:none !important;
  display:flex !important;
  align-items:center !important;
  gap:14px !important;
  margin:0 !important;
  padding:0 !important;
}

nav.forum-pagination.legacy-forum-pagination li{
  display:inline-flex !important;
}

nav.forum-pagination.legacy-forum-pagination > ul:first-of-type{
  gap:0 !important;
}

nav.forum-pagination.legacy-forum-pagination > ul:first-of-type a.u-forum--link,
nav.forum-pagination.legacy-forum-pagination > ul:first-of-type li.active > span,
nav.forum-pagination.legacy-forum-pagination > ul:first-of-type li > span{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  text-align:center !important;

  min-width:14px !important;
  padding:0 5px !important;
  line-height:16px !important;
}

nav.forum-pagination.legacy-forum-pagination > ul:first-of-type a.u-forum--link{
  background:transparent !important;
  border:0 !important;
  border-radius:0 !important;
  color:#445500 !important;
  font-size:12px !important;
  font-weight:400 !important;
  text-decoration:none !important;
}
nav.forum-pagination.legacy-forum-pagination > ul:first-of-type a.u-forum--link:hover{
  background:transparent !important;
  text-decoration:none !important;
  color:#99cc00 !important;
}

nav.forum-pagination.legacy-forum-pagination > ul:first-of-type li.active > span{
  background:transparent !important;
  border:0 !important;
  border-radius:0 !important;
  color:#555555 !important;
  font-size:12px !important;
  font-weight:700 !important;
}
nav.forum-pagination.legacy-forum-pagination > ul:first-of-type li > span{
  color:#555555 !important;
  font-size:12px !important;
  font-weight:400 !important;
}

nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext a.u-forum--link,
nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext a.u-forum--link:hover,
nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext a.u-forum--link:focus,
nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext a.u-forum--link:focus-visible{
  background:transparent !important;
  text-decoration:none !important;
}

nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext a.u-forum--link,
nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext span{
  display:inline-flex !important;
  align-items:center !important;
  height:auto !important;
  padding:0 4px !important;
  line-height:16px !important;

  border:0 !important;
  border-radius:0 !important;
  box-shadow:none !important;
  outline:0 !important;

  font-weight:700 !important;
  font-size:16px !important;
}

nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext a.u-forum--link{
  color:#445500 !important;
}
nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext a.u-forum--link:hover{
  color:#99cc00 !important;
}

nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext span{
  color:#555555 !important;
}

nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext i{
  display:none !important;
}

nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext li:first-child a::before,
nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext li:first-child span::before{
  content:"‹";
  margin-right:3px;
  font-weight:400 !important;
  font-size:20px !important;
  line-height:1 !important;
  position:relative;
  top:-1px;
  color:currentColor;
}

nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext li:last-child a::after,
nav.forum-pagination.legacy-forum-pagination > ul.forum-pagination-prevnext li:last-child span::after{
  content:"›";
  margin-left:3px;
  font-weight:400 !important;
  font-size:20px !important;
  line-height:1 !important;
  position:relative;
  top:-1px;
  color:currentColor;
}

    .forum-topic-entry__content--counts{
      display: flex !important;
      flex-direction: column !important;
      gap: 4px !important;
    }

    .forum-topic-entry__content--counts > div:nth-child(1){ order: 2 !important; }
    .forum-topic-entry__content--counts > div:nth-child(2){ order: 1 !important; }

    .forum-topic-entry__content--counts > div{
      font-size: 0 !important;
      line-height: 1 !important;
      white-space: nowrap !important;
      display: flex !important;
      align-items: center !important;
      gap: 1px !important;
    }

    .forum-topic-entry__content--counts > div > strong{
      font-size: 13px !important;
      line-height: 1 !important;
      color: #666 !important;
      font-weight: 400 !important;
    }

    .forum-topic-entry__content--counts > div::after{
      content: "";
      width: 14px;
      height: 14px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      opacity: 0.85;
    }

    .forum-topic-entry__content--counts > div:nth-child(1)::after{
      background-image: url("${ICON_POSTS}");
    }
    .forum-topic-entry__content--counts > div:nth-child(2)::after{
      background-image: url("${ICON_EYE}");
    }

.forum-topic-entry__content--counts > div{
  display: flex !important;
  align-items: center !important;
  gap: 3px !important;
}

.forum-topic-entry__content--counts > div > strong{
  display: inline-block !important;
  width: 32px;
  text-align: right !important;
  font-variant-numeric: tabular-nums;
}

:root{
  --legacy-thread-shift: 2px;
}

.forum-topic-entry,
.forum-topic-entry__col,
.forum-topic-entry__content{
  min-height: 0 !important;
}

.forum-topic-entry__col--icon,
.forum-topic-entry__col--main,
.forum-topic-entry__content--counts,
.forum-topic-entry__col--last-link,
.forum-topic-entry__content--left,
.forum-topic-entry__content--right,
.forum-topic-entry__detail{
  transform: translateY(calc(var(--legacy-thread-shift) * -1)) !important;
}

.forum-topic-entry{
  overflow: visible !important;
}

:root{
  --legacy-hover-bleed: 50px;
}

#topics,
#topics ul.forum-list__items{
  overflow: visible !important;
}

.forum-topic-entry:hover::before{
  left: calc(var(--legacy-hover-bleed) * -1) !important;
  right: calc(var(--legacy-hover-bleed) * -1) !important;

  top: -6px !important;
  bottom: 0 !important;

  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.header-v4__content{
  width: var(--legacy-panel-width) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  box-sizing: border-box !important;
}

.header-nav-v4.header-nav-v4--breadcrumb{
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 16px !important;
  list-style: none !important;
  box-sizing: border-box !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item::after{
  content: none !important;
}

.header-v4__content{
  display: flex !important;
  justify-content: center !important;
}

.header-v4__row.header-v4__row--title{
  display: none !important;
}

.header-v4__bg.js-forum-cover--header{
  display: none !important;
}

.header-v4__bg-container{
  background-color: #c01e79 !important;
  background-image: none !important;

  clip-path: inset(0 0 10px 0);
}

.header-v4__row.header-v4__row--bar{
  position: relative !important;
}

:root{
  --legacy-threadsheader-top: 24px;
  --legacy-panel-top: 200px;
}

body > div.osu-layout__section.osu-layout__section--full
> div.osu-page.osu-page--forum::after{
  top: var(--legacy-threadsheader-top) !important;
  z-index: 1 !important;
}

body > div.osu-layout__section.osu-layout__section--full
> div.osu-page.osu-page--forum::before{
  top: var(--legacy-panel-top) !important;
  z-index: 0 !important;
}

:root{
  --legacy-breadcrumb-shift: 20px;
}

.header-v4__row.header-v4__row--bar{
  position: relative !important;
  top: auto !important;
  z-index: 5 !important;

  width: var(--legacy-panel-width) !important;
  margin: 0 auto !important;
  box-sizing: border-box !important;

  overflow: visible !important;
  min-height: unset !important;
  height: auto !important;

}

.header-v4__row.header-v4__row--bar{
  min-height: 0 !important;
}

:root{
  --legacy-breadcrumb-nudge: -8px;
}

.header-v4__row.header-v4__row--bar{
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.header-v4__row.header-v4__row--bar{
  margin-top: calc(var(--legacy-breadcrumb-shift) * -1) !important;
  transform: none !important;
}

.header-nav-v4.header-nav-v4--breadcrumb{
  transform: translateY(var(--legacy-breadcrumb-nudge)) !important;
}

.header-nav-v4.header-nav-v4--breadcrumb{
  background: #333333 !important;
  padding: 3px 8px !important;
  gap: 0 !important;
  line-height: 15px !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item{
  margin: 0 !important;
  padding: 0 !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item a{
  font-size: 15px !important;
  line-height: 15px !important;
  text-decoration: none !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item:not(:last-child) a{
  color: #CCCCCC !important;
  font-weight: 400 !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item:last-child a,
.header-nav-v4--breadcrumb .header-nav-v4__item:last-child{
  color: #FFFFFF !important;
  font-weight: 700 !important;
  font-size: 15px !important;
  line-height: 15px !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item + .header-nav-v4__item::before{
  content: "≫" !important;

  font-size: 7px !important;
  line-height: 1 !important;

  display: inline-block !important;

  transform:
    scaleY(1.5)
    translateX(5px)
    translateY(-2.5px) !important;

  transform-origin: center !important;

  margin: 0 5px !important;
  color: #CCCCCC !important;

  vertical-align: middle !important;
}

.header-v4__row.header-v4__row--bar{
  background: #333333 !important;
  background-image: none !important;
  box-shadow: none !important;
  border: 0 !important;
}

.header-v4__row.header-v4__row--bar > *{
  background: transparent !important;
}

:root{
  --legacy-bar-cut: 26px;
}

.header-v4__row.header-v4__row--bar{

  margin-top: calc(var(--legacy-breadcrumb-shift) * -1) !important;
  transform: none !important;

  margin-bottom: calc(var(--legacy-bar-cut) * -1) !important;
}

.header-nav-v4.header-nav-v4--breadcrumb,
.header-nav-v4.header-nav-v4--breadcrumb *{
  font-family: "Exo 2", "Arial Grande", Tahoma, Helvetica, Arial, sans-serif !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__link{
  display: inline-block !important;
  padding-bottom: 6px !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item:last-child .header-nav-v4__link{
  box-shadow: inset 0 -5px 0 #88b300 !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__link .fake-bold{
  position: relative !important;
  top: -4px !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__link{
  position: relative !important;
  display: inline-block !important;
  padding-bottom: 6px !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item:not(:last-child) .header-nav-v4__link{
  box-shadow: none !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item:not(:last-child) .header-nav-v4__link::after{
  content: "" !important;
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;

  height: 5px !important;
  background: #88b300 !important;

  transform: translateY(100%) !important;
  opacity: 0 !important;

  transition:
    transform .22s cubic-bezier(.2,.8,.2,1),
    opacity   .22s cubic-bezier(.2,.8,.2,1) !important;

  pointer-events: none !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item:not(:last-child):hover .header-nav-v4__link::after{
  transform: translateY(0) !important;
  opacity: 1 !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item:not(:last-child):hover .header-nav-v4__link,
.header-nav-v4--breadcrumb .header-nav-v4__item:not(:last-child):hover .header-nav-v4__link *{
  color: #ffffff !important;
}

.header-nav-v4--breadcrumb .header-nav-v4__item:last-child .header-nav-v4__link{
  box-shadow: inset 0 -5px 0 #88b300 !important;
}

:root{
  --legacy-thread-crumbimg-h: 200px;
}

.osu-page--forum-topic #posts{
  padding-top: var(--legacy-thread-firstpost-gap) !important;
}

.osu-page--forum-topic .forum-posts,
.osu-page--forum-topic .forum-posts__items{
  padding-top: var(--legacy-thread-firstpost-gap) !important;
}

.osu-page--forum-topic .forum-post:first-child{
  margin-top: var(--legacy-thread-firstpost-gap) !important;
}

:root{
  --legacy-thread-firstpost-gap: 5px;
}

.osu-page--forum-topic .forum-post:first-of-type{
  margin-top: var(--legacy-thread-firstpost-gap) !important;
}

body > div.osu-layout__section.osu-layout__section--full,
body > div.osu-layout__section.osu-layout__section--full > div.osu-page,
body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--forum-topic{
  background: transparent !important;
}

body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--forum-topic::before,
body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--forum-topic::after{
  background: transparent !important;
}

.osu-page--forum-topic .js-header--main.legacy-hide-header{
  height: 0 !important;
  min-height: 0 !important;
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
  opacity: 0 !important;
  pointer-events: none !important;
  background: transparent !important;
}
.osu-page--forum-topic .js-header--main.legacy-hide-header > *{
  display: none !important;
}

#legacy-thread-poll-wrap{
  width: min(var(--legacy-thread-post-first), 100%) !important;
  margin: 0 auto var(--legacy-thread-firstpost-gap) auto !important;
}

#legacy-thread-poll-wrap .forum-poll-container__content,
#legacy-thread-poll-wrap .forum-poll{
  background: #fff !important;
  box-shadow: 0 3px 3px rgba(0,0,0,.18) !important;
  border: 1px solid rgba(0,0,0,.08) !important;
  border-radius: 0 !important;
}

.osu-page--forum-topic .forum-post,
.osu-page--forum-topic .forum-post__body{
  background: #fff !important;
}

.osu-page--forum-topic .forum-post__content{
  background: transparent !important;
}

.osu-page--forum-topic .forum-post__bg{
  background: transparent !important;
}

.well{
  background: #eeeeee !important;
  border: 1px solid #dddddd !important;
}

.osu-page--forum-topic .forum-post,
.osu-page--forum-topic .forum-post__body,
.osu-page--forum-topic .forum-post__content,
.osu-page--forum .forum-topic-title,
.osu-page--forum .forum-list,
.osu-page--forum .forum-item,
.osu-page--forum .forum-post{
  color: #444444 !important;
}

.forum-post__body,
.forum-post__body *{
  text-shadow: none !important;
}

.forum-post__body a{ color: #2299bb !important; }

.osu-page--forum-topic .forum-post__body{
  color: #444444 !important;
}

.osu-page--forum-topic .forum-post,
.osu-page--forum-topic .forum-post__body,
.osu-page--forum-topic .forum-post__content {
  border-top: 0 !important;
  border-bottom: 0 !important;
}

.osu-page--forum-topic .forum-post::before,
.osu-page--forum-topic .forum-post::after,
.osu-page--forum-topic .forum-post__body::before,
.osu-page--forum-topic .forum-post__body::after,
.osu-page--forum-topic .forum-post__content::before,
.osu-page--forum-topic .forum-post__content::after {
  content: none !important;
  display: none !important;
}

.osu-page--forum-topic .forum-post {
  margin: 0 0 5px 0 !important;
}

.osu-page--forum-topic #posts,
.osu-page--forum-topic .forum-posts,
.osu-page--forum-topic .forum-posts__items {
  display: flow-root !important;
}

.osu-page--forum-topic .forum-post{
  background: #ffffff !important;

  box-shadow:
    0 3px 3px rgba(0,0,0,.18) !important;

  border: 1px solid rgba(0,0,0,.08) !important;
  border-radius: 0 !important;
}

.js-forum-post-edit--container{
  color: #444444 !important;
}

.js-forum-post-edit--container textarea,
.js-forum-post-edit--container input,
.js-forum-post-edit--container [contenteditable="true"],
.js-forum-post-edit--container .bbcode-editor__textarea,
.js-forum-post-edit--container .bbcode-editor__preview,
.js-forum-post-edit--container .bbcode-editor,
.js-forum-post-edit--container .bbcode-editor *:is(textarea,[contenteditable="true"]){
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
  caret-color: #444444 !important;
}

.js-forum-post-edit--container ::placeholder{
  color: #777777 !important;
  opacity: 1 !important;
}

.js-forum-post-edit--container svg,
.js-forum-post-edit--container svg *{
  fill: currentColor !important;
  stroke: currentColor !important;
}

.forum-post__body .bbcode{
  color: #444444 !important;
  text-shadow: none !important;
}

.forum-post__body .bbcode a{ color:#2299bb !important; }

.osu-page--forum-topic .forum-post__body h2{ color:#CC5288 !important; }

.forum-post__body .bbcode blockquote{
  color: #444444 !important;
}

.forum-post__body .bbcode blockquote *:not(a):not([style*="color"]):not(font[color])
  :not(.spoiler):not(.spoiler *)
  :not(.bbcode-spoilerbox):not(.bbcode-spoilerbox *)
  :not(.bbcode-spoilerbox__content):not(.bbcode-spoilerbox__content *) {
  color: inherit !important;
}

.forum-post__body .bbcode a{
  color: #2299bb !important;
}

.forum-post__body pre,
.forum-post__body .bbcode pre{
  background: #F5F5F5 !important;
  border: 1px solid #DDDDDD !important;
}

.forum-post__body code,
.forum-post__body .bbcode code{
  background: #F5F5F5 !important;
  border: 1px solid #DDDDDD !important;
}

.forum-post__body audio,
.forum-post__body .bbcode audio{
  background: #F5F5F5 !important;
  border: 1px solid #DDDDDD !important;
  border-radius: 4px !important;
}

.forum-post__body audio-player,
.forum-post__body .bbcode audio-player,
.forum-post__body .js-audio--player,
.forum-post__body .bbcode .js-audio--player{
  background: #F5F5F5 !important;
  border: 1px solid #DDDDDD !important;
}

.forum-post__body .bbcode .audio-player,
.forum-post__body .bbcode .audio-player *{
  color: #444444 !important;
}

.forum-post__body .bbcode .audio-player a{
  color: #2299bb !important;
}

.forum-post__body .bbcode .audio-player .spoiler,
.forum-post__body .bbcode .audio-player .spoiler *,
.forum-post__body .bbcode .audio-player .bbcode-spoilerbox,
.forum-post__body .bbcode .audio-player .bbcode-spoilerbox *{
  color: revert !important;
}

.forum-post__body .bbcode .audio-player__button--play:hover .play-button,
.forum-post__body .bbcode .audio-player__button--play:hover .play-button::before,
.forum-post__body .bbcode .audio-player__button--play:focus-visible .play-button,
.forum-post__body .bbcode .audio-player__button--play:focus-visible .play-button::before{
  filter: brightness(1.2) !important;
  opacity: 0.95 !important;
}

.audio-player.audio-player--main{
  background: #F5F5F5 !important;
  border: 1px solid #DDDDDD !important;
  border-radius: 4px !important;
  box-shadow: none !important;
}

.audio-player.audio-player--main,
.audio-player.audio-player--main *{
  color: #444444 !important;
}

.audio-player.audio-player--main .audio-player__bar--progress{
  background: #1c1719 !important;
}
.audio-player.audio-player--main .audio-player__bar--progress .audio-player__bar-current{
  background: #ff66ab !important;
}

.audio-player.audio-player--main .audio-player__bar--volume{
  background: #1c1719 !important;
}
.audio-player.audio-player--main .audio-player__bar--volume .audio-player__bar-current{
  background: #ff66ab !important;
}

.audio-player.audio-player--main .audio-player__button:hover,
.audio-player.audio-player--main .audio-player__button:focus-visible,
.audio-player.audio-player--main .audio-player__volume-button:hover,
.audio-player.audio-player--main .audio-player__volume-button:focus-visible,
.audio-player.audio-player--main .audio-player__autoplay-button:hover,
.audio-player.audio-player--main .audio-player__autoplay-button:focus-visible{
  filter: brightness(1.3) !important;
  opacity: 0.95 !important;
}

.audio-player.audio-player--main .audio-player__button--play:hover .play-button,
.audio-player.audio-player--main .audio-player__button--play:hover .play-button::before,
.audio-player.audio-player--main .audio-player__button--play:focus-visible .play-button,
.audio-player.audio-player--main .audio-player__button--play:focus-visible .play-button::before{
  filter: brightness(1.0) !important;
  opacity: 0.95 !important;
}

.forum-post__body blockquote > :first-child{
  color: #CC5288 !important;
}

.forum-post__body blockquote{
  --legacy-wrote-color: #CC5288;
}
.forum-post__body blockquote::first-line{
  color: var(--legacy-wrote-color) !important;
}

.forum-post__body .bbcode blockquote{
  box-shadow: none !important;
  background: transparent !important;
  background-image: none !important;
}

.forum-post__body .bbcode blockquote::before,
.forum-post__body .bbcode blockquote::after,
.forum-post__body .bbcode blockquote > *::before,
.forum-post__body .bbcode blockquote > *::after{
  content: none !important;
  display: none !important;
}

.forum-post__body .bbcode blockquote > h4{
  border: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  padding-left: 0 !important;
  margin-left: 0 !important;
}

.forum-post__body .bbcode blockquote{
  border-left: 5px solid #e3e3e3 !important;
  padding-left: 10px !important;
  margin-left: 0 !important;
}

.forum-post__body .bbcode blockquote blockquote{
  border-left: 5px solid #e3e3e3 !important;
  padding-left: 10px !important;
  margin-left: 6px !important;
}

.forum-post__body .bbcode blockquote blockquote blockquote{
  margin-left: 12px !important;
}

.forum-post__content--signature{
  border-top: 0 !important;
}

.forum-post__content--main{
  border-bottom: 0 !important;
}

.forum-post__content--signature::before,
.forum-post__content--signature::after{
  content: none !important;
}

.forum-post__content--signature{
  background: #EEEEEE !important;

  padding: 10px 12px !important;

  margin: 0 !important;
}

.forum-post__content--main{
  margin-bottom: 0 !important;
  padding-bottom: 10px !important;
}

.osu-page--forum-topic .forum-post__content.forum-post__content--signature{
  background-color: #eaeaea !important;
}

.osu-page--forum-topic .forum-post__content.forum-post__content--signature .forum-post-content,
.osu-page--forum-topic .forum-post__content.forum-post__content--signature .bbcode{
  background: transparent !important;
}

.osu-page--forum-topic .forum-post__content.forum-post__content--signature{
  padding: 10px 12px !important;
  margin: 0 !important;
}

.osu-page--forum-topic .forum-post__content.forum-post__content--signature{
  border-top: 0 !important;
}
.osu-page--forum-topic .forum-post__content.forum-post__content--main{
  border-bottom: 0 !important;
}
.osu-page--forum-topic .forum-post__content.forum-post__content--signature::before,
.osu-page--forum-topic .forum-post__content.forum-post__content--signature::after{
  content: none !important;
}

.osu-page--forum-topic .forum-post__content.forum-post__content--main::after,
.osu-page--forum-topic .forum-post__content.forum-post__content--main::before{
  content: none !important;
}

:root{
  --legacy-thread-post-first: 1000px;
  --legacy-thread-post-other: 960px;
}

.osu-page--forum-topic .forum-post.js-forum-post:not([data-post-position="1"]){
  width: min(var(--legacy-thread-post-other), 100%) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  box-sizing: border-box !important;
}

.osu-page--forum-topic .forum-post.js-forum-post[data-post-position="1"]{
  width: min(var(--legacy-thread-post-first), 100%) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  box-sizing: border-box !important;
}

.osu-page--forum-topic .forum-post__body{
  width: 100% !important;
  box-sizing: border-box !important;
}

.forum-post-info{
  --legacy-avatar-size: 132px;
}

.forum-post-info__row--avatar{
  width: 100% !important;
  display: flex !important;
  justify-content: center !important;
}

:root{
  --legacy-pfp-inset-top: 25px;
  --legacy-pfp-inset-bottom: 45px;
  --legacy-pfp-inset-left: 35px;
  --legacy-pfp-inset-right: 35px;

  --legacy-pfp-shift-y: calc((var(--legacy-pfp-inset-bottom) - var(--legacy-pfp-inset-top)) / 2);
}

.forum-post-info .avatar.avatar--forum{
  position: relative !important;
  width: var(--legacy-avatar-size) !important;
  height: var(--legacy-avatar-size) !important;

  background-repeat: no-repeat !important;
  background-size: calc(100% - (var(--legacy-pfp-inset-left) + var(--legacy-pfp-inset-right)))
                   calc(100% - (var(--legacy-pfp-inset-top) + var(--legacy-pfp-inset-bottom))) !important;

  background-position: 50% calc(50% - var(--legacy-pfp-shift-y)) !important;

  border-radius: 0 !important;
  box-shadow: none !important;
  background-color: transparent !important;

  overflow: hidden !important;
  z-index: 1 !important;
}

.forum-post-info .avatar.avatar--forum::before{
  content:"" !important;
  position:absolute !important;
  inset:0 !important;

  background-image:
    url("${LEGACY_AVATAR_FRAME}"),
    linear-gradient(var(--legacy-user-colour, #32c6f1), var(--legacy-user-colour, #32c6f1)) !important;

  background-repeat: no-repeat, no-repeat !important;
  background-position: center, center !important;
  background-size: 100% 100%, 100% 100% !important;

  background-blend-mode: multiply !important;

  -webkit-mask-image: url("${LEGACY_AVATAR_FRAME}") !important;
  -webkit-mask-repeat: no-repeat !important;
  -webkit-mask-position: center !important;
  -webkit-mask-size: 100% 100% !important;

  mask-image: url("${LEGACY_AVATAR_FRAME}") !important;
  mask-repeat: no-repeat !important;
  mask-position: center !important;
  mask-size: 100% 100% !important;

  z-index:2 !important;
  pointer-events:none !important;
}

.forum-post-info .avatar.avatar--forum.legacy-banned{

  background-image: none !important;
  background-color: transparent !important;
}

.forum-post-info .avatar.avatar--forum.legacy-banned::before{
  background-image: url("${LEGACY_BANNED_AVATAR}") !important;
  background-repeat: no-repeat !important;

  background-position: 50% 0% !important;

  background-size: 100% auto !important;

  background-blend-mode: normal !important;
  -webkit-mask-image: none !important;
  mask-image: none !important;
}

.forum-post-info .avatar.avatar--forum.legacy-banned::after{

  bottom: auto !important;
  top: 34px !important;

  font-size: clamp(11px, 1.6vw, 15px) !important;
  line-height: 1 !important;
}

.forum-post-info .avatar.avatar--forum.legacy-banned > .legacy-avatar-white{
  display:none !important;
}

.forum-post-info:has(.avatar.avatar--forum.legacy-banned){
  background-color: #f5f5f5 !important;
}

.forum-post-info__row--avatar{
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.forum-post-info{
  padding-top: 0 !important;
}

.forum-post-info{
  row-gap: 0 !important;
}

.forum-post-info__row--avatar:first-child{
  margin-top: 0 !important;
}

.forum-post-info .avatar.avatar--forum{
  margin-top: 0 !important;
  align-self: flex-start !important;
}

.forum-post-info .avatar.avatar--forum > .legacy-avatar-white{
  position: absolute !important;
  inset: 0 !important;
  pointer-events: none !important;
  z-index: 4 !important;

  background-image: var(--legacy-avatar-white-image, url("${LEGACY_AVATAR_WHITE}")) !important;

  background-repeat: no-repeat !important;
  background-position: 50% calc(50% - 10px) !important;
  background-size: auto 120px !important;
}

.forum-post-info__row--username{
  display: none !important;
}

.forum-post-info .avatar.avatar--forum::after{
  content: attr(data-legacy-name) !important;

  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 10% !important;
  text-align: center !important;

  font-family: "Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-weight: 700 !important;
  font-size: clamp(11px, 1.6vw, 15px) !important;
  line-height: 1 !important;

  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0,0,0,.8) !important;

  z-index: 3 !important;
  pointer-events: none !important;
}

img.legacy-flag.forum__user-flag--country{
  width: 32px !important;
  height: 22px !important;
  display: inline-block !important;
  vertical-align: middle !important;
  image-rendering: auto !important;

  filter:
    drop-shadow(0 2px 2px rgba(0,0,0,.20))
    drop-shadow(1px 0 1px rgba(0,0,0,.14))
    drop-shadow(-1px 0 1px rgba(0,0,0,.14));
}

.flag-team{
  filter:
    drop-shadow(0 2px 2px rgba(0,0,0,.20))
    drop-shadow(1px 0 1px rgba(0,0,0,.14))
    drop-shadow(-1px 0 1px rgba(0,0,0,.14)) !important;
}

.forum-post-info__row.forum-post-info__row--posts,
.forum-post-info__row.forum-post-info__row--posts *{
  color: #444444 !important;
  font-weight: 500 !important;
}

.forum-post-info__row--title{
  color: #444444 !important;
}

#posts,
.forum-posts,
.forum-posts__items{
  overflow: visible !important;
}

.forum-post{
  position: relative !important;
  overflow: visible !important;
}

.forum-post.legacy-role-stripe::before{
  display: block !important;

  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  bottom: 0 !important;

  width: 10px !important;
  left: -10px !important;

  background: var(--legacy-role-colour, #32c6f1) !important;

  filter: brightness(0.7);

  pointer-events: none !important;
  z-index: 10 !important;
}

a.bbcode-spoilerbox__link,
a.bbcode-spoilerbox__link:visited{
  color: #CC6600 !important;
}

a.bbcode-spoilerbox__link .bbcode-spoilerbox__link-icon{
  color: #CC6600 !important;
  fill: #CC6600 !important;
  stroke: #CC6600 !important;
}

a.bbcode-spoilerbox__link:hover,
a.bbcode-spoilerbox__link:focus,
a.bbcode-spoilerbox__link:focus-visible{
  color: #CC6600 !important;
  text-decoration: underline;
}

.forum-post__body .bbcode a.bbcode-spoilerbox__link{ color:#CC6600 !important; }

.forum-post__body .bbcode .bbcode-spoilerbox__link-icon{
  filter: brightness(0) saturate(100%) invert(36%) sepia(0%) saturate(0%) brightness(92%) contrast(90%) !important;
}

.osu-page--forum-topic,
.osu-page--forum-topic #posts,
.osu-page--forum-topic .forum-posts,
.osu-page--forum-topic .forum-posts__items{
  overflow-anchor: none !important;
}

.osu-page--forum-topic .forum-post__body h2{
  color: #CC5288 !important;
}

.osu-page--forum-topic .forum-post__body h2 *:not([style*="color"]):not(font[color]){
  color: inherit !important;
}

:root{
  --legacy-thread-crumbimg-image: url("${THREAD_BREADCRUMB_IMAGE}");
}

#legacy-thread-crumbimg{
  display:block !important;
  width: min(var(--legacy-thread-post-first), 100%) !important;
  height: var(--legacy-thread-crumbimg-h) !important;

  position: relative !important;
  left: auto !important;
  transform: none !important;
  top: auto !important;

  margin: 0 auto var(--legacy-thread-firstpost-gap) auto !important;

  background-image: var(--legacy-thread-crumbimg-image) !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center center !important;
  box-shadow: 0 2px 2px rgba(0,0,0,.12), 0 6px 10px rgba(0,0,0,.16) !important;
  pointer-events:none !important;
}

#legacy-thread-crumbimg .legacy-thread-title-inbanner{
  position:absolute;
  left: 4.5%;
  right: 10%;
  top: 60%;
  transform: translateY(-50%);
  font-family:"Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif;
  font-style: italic;
  font-weight: 500;
  font-size: 36px;
  line-height: 36px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,.7);
  display:-webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow:hidden;
}

#legacy-forum-header-title.legacy-thread-title,
#legacy-thread-crumbimg .legacy-thread-title-inbanner{
  line-height: 1.15 !important;
  padding-bottom: 0.25em !important;
  box-sizing: content-box !important;
}

#legacy-thread-top-spacer{
  width: min(var(--legacy-thread-post-first), 100%) !important;
  margin: 0 auto !important;
  height: var(--legacy-thread-top-spacer-h, 0px) !important;
  background: transparent !important;
}

:root{
  --legacy-thread-topspacer-nudge: 0px;
}
#legacy-thread-top-spacer{
  height: calc(var(--legacy-thread-top-spacer-h, 0px) + var(--legacy-thread-topspacer-nudge)) !important;
}


#legacy-thread-crumbimg .legacy-thread-title-inbanner{
  top: var(--legacy-thread-title-top-2, 60%) !important;
}

#legacy-thread-crumbimg .legacy-thread-title-inbanner[data-lines="1"]{
  top: var(--legacy-thread-title-top-1, 72%) !important;
}

.forum-post-info__row--support-level{
  display: none !important;
}

#legacy-thread-poll-wrap,
#legacy-thread-poll-wrap *{
  color: #444444 !important;
  text-shadow: none !important;
}

#legacy-thread-poll-wrap a{
  color: #2299bb !important;
}

#legacy-thread-poll-wrap h1,
#legacy-thread-poll-wrap h2{
  color: #CC5288 !important;
}
#legacy-thread-poll-wrap h2 *:not([style*="color"]):not(font[color]){
  color: inherit !important;
}

#legacy-thread-poll-wrap .well{
  background: #eeeeee !important;
  border: 1px solid #dddddd !important;
}

#legacy-thread-poll-wrap pre,
#legacy-thread-poll-wrap code{
  background: #F5F5F5 !important;
  border: 1px solid #DDDDDD !important;
}

#legacy-thread-poll-wrap blockquote,
#legacy-thread-poll-wrap blockquote *{
  color: #444444 !important;
  box-shadow: none !important;
  background: transparent !important;
  background-image: none !important;
}

#legacy-thread-poll-wrap blockquote::before,
#legacy-thread-poll-wrap blockquote::after,
#legacy-thread-poll-wrap blockquote > *::before,
#legacy-thread-poll-wrap blockquote > *::after{
  content: none !important;
  display: none !important;
}

#legacy-thread-poll-wrap blockquote{
  border-left: 5px solid #e3e3e3 !important;
  padding-left: 10px !important;
  margin-left: 0 !important;
}

#legacy-thread-poll-wrap a.bbcode-spoilerbox__link,
#legacy-thread-poll-wrap a.bbcode-spoilerbox__link:visited,
#legacy-thread-poll-wrap a.bbcode-spoilerbox__link .bbcode-spoilerbox__link-icon{
  color: #CC6600 !important;
  fill: #CC6600 !important;
  stroke: #CC6600 !important;
}

#legacy-thread-poll-wrap .btn-osu-big--forum-primary,
#legacy-thread-poll-wrap .btn-osu-big--forum-primary *,
#legacy-thread-poll-wrap .btn-osu-big--forum-secondary,
#legacy-thread-poll-wrap .btn-osu-big--forum-secondary *{
  color: #ffffff !important;
}

#legacy-thread-poll-wrap .forum-poll__title,
#legacy-thread-poll-wrap .forum-poll__title *{
  color: #444444 !important;
}

.btn-circle{
  --bg: #2299bb !important;
  background-color: var(--bg) !important;
  transition: filter .15s ease;
}

.btn-circle:hover{
  filter: brightness(1.15);
}

.js-forum-post-edit--container form.forum-post-edit-box{
  background-color: #eaeaea !important;
  background-image: none !important;

  padding: 10px !important;
  border: 1px solid #dddddd !important;
}

.js-forum-post-edit--container form.forum-post-edit-box > .bbcode-editor{
  background: transparent !important;
}

.js-forum-post-edit--container .bbcode-editor__content{
  background-color: #ffffff !important;
  background-image: none !important;
  border: 1px solid #dddddd !important;
}

.js-forum-post-edit--container textarea.bbcode-editor__body,
.js-forum-post-edit--container .bbcode-editor__preview,
.js-forum-post-edit--container .bbcode-editor__preview .forum-post-content{
  background-color: #ffffff !important;
  background-image: none !important;
}

.js-forum-post-edit--container .bbcode-size-select__select.js-bbcode-btn--size{
  background-color: #eaeaea !important;
  background-image: none !important;
  border: 1px solid #dddddd !important;
  color: #444444 !important;
  border-radius: 3px !important;

  -webkit-appearance: none !important;
  appearance: none !important;

  padding: 3px 24px 3px 8px !important;
  line-height: 16px !important;
}

.js-forum-post-edit--container .bbcode-size-select__select.js-bbcode-btn--size option{
  background-color: #ffffff !important;
  color: #444444 !important;
}

.js-forum-post-edit--container label.bbcode-size-select{
  background: transparent !important;
}

.js-forum-post-edit--container label.bbcode-size-select{
  position: relative !important;
}
.js-forum-post-edit--container label.bbcode-size-select > i.fas.fa-chevron-down{
  pointer-events: none !important;
  position: absolute !important;
  right: 8px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.js-forum-post-edit--container .post-box-toolbar .btn-circle,
.js-forum-post-edit--container .post-box-toolbar .btn-circle .btn-circle__content,
.js-forum-post-edit--container .post-box-toolbar .btn-circle i,
.js-forum-post-edit--container .post-box-toolbar .btn-circle i::before{
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
}

.js-forum-post-edit--container .post-box-toolbar .btn-circle svg,
.js-forum-post-edit--container .post-box-toolbar .btn-circle svg *{
  fill: #ffffff !important;
  stroke: #ffffff !important;
}

.js-forum-post-edit--container .bbcode-editor__buttons--actions button,
.js-forum-post-edit--container .bbcode-editor__buttons--actions button *{
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode{
  color: #444444 !important;
  text-shadow: none !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode a,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode a:visited{
  color: #2299bb !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote > h4,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote > :first-child{
  color: #CC5288 !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote{
  border-left: 5px solid #e3e3e3 !important;
  padding-left: 10px !important;
  margin-left: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote::before,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote::after,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote > *::before,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote > *::after{
  content: none !important;
  display: none !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote a,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote a:visited{
  color: #2299bb !important;
}

.js-forum-post-edit--container .bbcode-editor__preview,
.js-forum-post-edit--container .bbcode-editor__preview *{
  -webkit-text-fill-color: initial !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode{
  color: #444444 !important;
  text-shadow: none !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode a,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode a:visited{
  color: #2299bb !important;
  -webkit-text-fill-color: #2299bb !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode h1,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode h2{
  color: #CC5288 !important;
  -webkit-text-fill-color: #CC5288 !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote{
  border-left: 5px solid #e3e3e3 !important;
  padding-left: 10px !important;
  margin-left: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: #444444 !important;
}
.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote > h4{
  color: #CC5288 !important;
  -webkit-text-fill-color: #CC5288 !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode a.bbcode-spoilerbox__link,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode a.bbcode-spoilerbox__link:visited{
  color: #CC6600 !important;
  -webkit-text-fill-color: #CC6600 !important;
}

.js-forum-post-edit--container .bbcode-editor__preview .bbcode pre,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode code{
  background: #F5F5F5 !important;
  border: 1px solid #DDDDDD !important;
}

.js-forum-post-edit--container .post-box-toolbar__help,
.js-forum-post-edit--container .post-box-toolbar__help:visited{
  color: #2299bb !important;
  -webkit-text-fill-color: #2299bb !important;
}

.fixed-bar .osu-page--forum-topic-reply .post-box-toolbar__help,
.fixed-bar .osu-page--forum-topic-reply .post-box-toolbar__help:visited,
.forum-topic-reply .osu-page--forum-topic-reply .post-box-toolbar__help,
.forum-topic-reply .osu-page--forum-topic-reply .post-box-toolbar__help:visited{
  color: #2299bb !important;
  -webkit-text-fill-color: #2299bb !important;
}

.fixed-bar .osu-page--forum-topic-reply,
.forum-topic-reply .osu-page--forum-topic-reply{
  background-color: #eaeaea !important;
  background-image: none !important;
  border: 1px solid #dddddd !important;
  padding: 10px !important;
}

.fixed-bar .osu-page--forum-topic-reply .bbcode-editor__content,
.forum-topic-reply .osu-page--forum-topic-reply .bbcode-editor__content{
  background-color: #ffffff !important;
  background-image: none !important;
  border: 1px solid #dddddd !important;
}

.fixed-bar .osu-page--forum-topic-reply textarea.bbcode-editor__body,
.forum-topic-reply .osu-page--forum-topic-reply textarea.bbcode-editor__body{
  background-color: #ffffff !important;
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
  caret-color: #444444 !important;
}

.fixed-bar .osu-page--forum-topic-reply .bbcode-editor__preview,
.fixed-bar .osu-page--forum-topic-reply .bbcode-editor__preview *,
.forum-topic-reply .osu-page--forum-topic-reply .bbcode-editor__preview,
.forum-topic-reply .osu-page--forum-topic-reply .bbcode-editor__preview *{
  -webkit-text-fill-color: initial !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode{
  color: #444444 !important;
  text-shadow: none !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a,
.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a:visited,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a:visited{
  color: #2299bb !important;
  -webkit-text-fill-color: #2299bb !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode h2,
.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote > h4,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode h2,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote > h4{
  color: #CC5288 !important;
  -webkit-text-fill-color: #CC5288 !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote{
  border-left: 5px solid #e3e3e3 !important;
  padding-left: 10px !important;
  margin-left: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.fixed-bar .osu-page--forum-topic-reply .post-box-toolbar .btn-circle,
.fixed-bar .osu-page--forum-topic-reply .post-box-toolbar .btn-circle * ,
.forum-topic-reply .osu-page--forum-topic-reply .post-box-toolbar .btn-circle,
.forum-topic-reply .osu-page--forum-topic-reply .post-box-toolbar .btn-circle *{
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
}

.fixed-bar .osu-page--forum-topic-reply .bbcode-size-select__select.js-bbcode-btn--size,
.forum-topic-reply .osu-page--forum-topic-reply .bbcode-size-select__select.js-bbcode-btn--size{
  background-color: #eaeaea !important;
  border: 1px solid #dddddd !important;
  color: #444444 !important;
  -webkit-appearance: none !important;
  appearance: none !important;
}

.fixed-bar .osu-page--forum-topic-reply .bbcode-editor__title,
.forum-topic-reply .osu-page--forum-topic-reply .bbcode-editor__title{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.fixed-bar .osu-page--forum-topic-reply .bbcode-size-select__select.js-bbcode-btn--size option,
.forum-topic-reply .osu-page--forum-topic-reply .bbcode-size-select__select.js-bbcode-btn--size option{
  background-color: #ffffff !important;
  color: #444444 !important;
}

.fixed-bar .osu-page--forum-topic-reply .post-box-toolbar__help,
.fixed-bar .osu-page--forum-topic-reply .post-box-toolbar__help:visited,
.forum-topic-reply .osu-page--forum-topic-reply .post-box-toolbar__help,
.forum-topic-reply .osu-page--forum-topic-reply .post-box-toolbar__help:visited{
  color: #2299bb !important;
  -webkit-text-fill-color: #2299bb !important;
}

.fixed-bar .osu-page--forum-topic-reply label.bbcode-size-select,
.forum-topic-reply .osu-page--forum-topic-reply label.bbcode-size-select{
  background: transparent !important;
}

.fixed-bar .osu-page--forum-topic-reply label.bbcode-size-select > select.bbcode-size-select__select,
.forum-topic-reply .osu-page--forum-topic-reply label.bbcode-size-select > select.bbcode-size-select__select{
  background: #eaeaea !important;
  border: 1px solid #dddddd !important;
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;

  -webkit-appearance: none !important;
  appearance: none !important;

  border-radius: 3px !important;
  padding: 3px 24px 3px 8px !important;
  line-height: 16px !important;

  filter: none !important;
}

.fixed-bar .osu-page--forum-topic-reply .post-box-toolbar label.bbcode-size-select > select,
.forum-topic-reply .osu-page--forum-topic-reply .post-box-toolbar label.bbcode-size-select > select{
  background: #eaeaea !important;
}

.fixed-bar .osu-page--forum-topic-reply label.bbcode-size-select > i.fas.fa-chevron-down,
.forum-topic-reply .osu-page--forum-topic-reply label.bbcode-size-select > i.fas.fa-chevron-down{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.fixed-bar .osu-page--forum-topic-reply label.bbcode-size-select,
.forum-topic-reply .osu-page--forum-topic-reply label.bbcode-size-select{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.fixed-bar .osu-page--forum-topic-reply .bbcode-size-select__label,
.forum-topic-reply .osu-page--forum-topic-reply .bbcode-size-select__label{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.fixed-bar .osu-page--forum-topic-reply select.bbcode-size-select__select option:checked,
.forum-topic-reply .osu-page--forum-topic-reply select.bbcode-size-select__select option:checked{
  color: #444444 !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a.bbcode-spoilerbox__link,
.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a.bbcode-spoilerbox__link:visited,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a.bbcode-spoilerbox__link,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a.bbcode-spoilerbox__link:visited{
  color: #CC6600 !important;
  -webkit-text-fill-color: #CC6600 !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a.bbcode-spoilerbox__link .bbcode-spoilerbox__link-icon,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a.bbcode-spoilerbox__link .bbcode-spoilerbox__link-icon{
  color: #CC6600 !important;
  fill: #CC6600 !important;
  stroke: #CC6600 !important;
  filter: none !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .well,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .well{
  background: #eeeeee !important;
  border: 1px solid #dddddd !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview pre,
.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview code,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview pre,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview code{
  background: #F5F5F5 !important;
  border: 1px solid #DDDDDD !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote{
  background: transparent !important;
  box-shadow: none !important;
  border: 0 !important;
  margin: 0 0 0 0 !important;
  padding: 0 0 0 10px !important;
  color: #444444 !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote{
  border-left: 5px solid #e3e3e3 !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote blockquote,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote blockquote{
  border-left: 5px solid #e3e3e3 !important;
  margin-left: 6px !important;
  padding-left: 10px !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote::before,
.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote::after,
.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote > *::before,
.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote > *::after,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote::before,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote::after,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote > *::before,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote > *::after{
  content: none !important;
  display: none !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a.bbcode-spoilerbox__link .bbcode-spoilerbox__link-icon,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode a.bbcode-spoilerbox__link .bbcode-spoilerbox__link-icon{
  color: #595959 !important;
  -webkit-text-fill-color: #595959 !important;
  fill: #595959 !important;
  stroke: #595959 !important;
  filter: none !important;
  font-weight: 1 !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .bbcode blockquote,
.js-forum-post-edit--container .bbcode-editor__preview .bbcode blockquote{
  margin: 0 0 15px 0 !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .audio-player,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .audio-player{
  background: #F5F5F5 !important;
  border: 1px solid #DDDDDD !important;
  border-radius: 4px !important;
  box-shadow: none !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .audio-player,
.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .audio-player *,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .audio-player,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .audio-player *{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
  text-shadow: none !important;
}

.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .audio-player__bar--progress,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .audio-player__bar--progress{
  background: #1c1719 !important;
}
.fixed-bar .osu-page--forum-topic-reply .forum-post-content--reply-preview .audio-player__bar--progress .audio-player__bar-current,
.forum-topic-reply .osu-page--forum-topic-reply .forum-post-content--reply-preview .audio-player__bar--progress .audio-player__bar-current{
  background: #ff66ab !important;
}

#legacy-thread-crumbimg{
  position: relative !important;
}

#legacy-thread-crumbimg .legacy-thread-counters{
  position: absolute !important;
  right: 4.5% !important;
  bottom: 12% !important;

  display: flex !important;
  gap: 10px !important;

  z-index: 3 !important;
  pointer-events: auto !important;
}

#legacy-thread-crumbimg .legacy-thread-counters .counter-box{
  filter: drop-shadow(0 2px 2px rgba(0,0,0,.25));
}

#legacy-thread-crumbimg .legacy-thread-counters .counter-box{
  position: relative !important;

  background: rgba(0, 0, 0, .7) !important;

border: none !important;
box-shadow:
  0 0 0 2px rgba(0,0,0,.5),
  0 4px 10px rgba(0,0,0,.7);

  padding: 7.5px 7.5px 7.5px 7.5px !important;
  min-width: 132px !important;

  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
}

#legacy-thread-crumbimg .legacy-thread-counters .counter-box::after{
  content: "" !important;
  position: absolute !important;
  top: 8px !important;
  bottom: 8px !important;
  right: 10px !important;

  width: 2px !important;
  background: #88B300 !important;

  border-radius: 2px !important;
}

#legacy-thread-crumbimg .legacy-thread-counters .counter-box__title{
  font-family: "Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  line-height: 1.05 !important;

  opacity: .95 !important;
}

#legacy-thread-crumbimg .legacy-thread-counters .counter-box__count{
  font-family: "Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-size: 18px !important;
  font-weight: 500 !important;
  color: #ffffff !important;
  line-height: 1 !important;
}

#legacy-thread-crumbimg .legacy-thread-counters .counter-box__line{
  display: none !important;
}

.sticky-header__body{
  background-color: #333333 !important;
}

.legacy-thread-counters{
  transform: translateX(15px);
}

.sticky-header__body .sticky-header-breadcrumbs__link,
.sticky-header__body .sticky-header-breadcrumbs__link:visited,
.sticky-header__body .sticky-header-breadcrumbs__link--is-active{
  color: #ffffff !important;
}

.sticky-header__body .sticky-header-breadcrumbs{
  background-color: #445500 !important;
  border-radius: 4px !important;
  padding: 3px 6px !important;
  box-sizing: border-box !important;
}

.sticky-header__breadcrumbs,
.sticky-header__breadcrumbs *{
  color: #ffffff !important;
}

.sticky-header__body .forum-topic-floating-header__title-link{
  color: #ffffff !important;
}

.forum-topic-nav__content{
  background-color: #333333 !important;
}

.btn-osu-big--forum-reply{
  background-color: #2299bb !important;
  border-color: #2299bb !important;
}

.btn-osu-big--forum-reply,
.btn-osu-big--forum-reply *{
  color: #ffffff !important;
}

.btn-osu-big--forum-reply:hover{
  filter: brightness(1.15) !important;
}

.forum-topic-nav__counter,
.forum-topic-nav__counter-container,
.forum-topic-nav__counter-cover{
  border-radius: 4px !important;
}

.forum-topic-nav__counter,
.forum-topic-nav__counter input{
  font-family: "Exo 2","Arial Grande",Tahoma,Helvetica,Arial,sans-serif !important;
  font-variant-numeric: tabular-nums !important;
  font-size: 15px !important;
  transform: translateX(-3px) !important;
}

.forum-topic-nav__counter--left,
.forum-topic-nav__counter--middle{
  padding-left: 2px !important;
  padding-right: 2px !important;
}

.forum-topic-nav__counter--right{
  padding-left: 3px !important;
  padding-right: 3px !important;
}

.forum-topic-nav__counter{
  box-sizing: border-box !important;
}

body:has(.forum-topic-toolbar)
.header-nav-v4.header-nav-v4--breadcrumb {
  transform: translateY(calc(var(--legacy-breadcrumb-nudge) + 13px)) !important;
}

.forum-topic-title__title {
  margin: 10px !important;
}

.forum-topic-title__title {
  transform: translateY(calc(-50% + 25px)) !important;
}

.osu-page--forum-topic{
  background-color: #eaeaea !important;
  background-image: none !important;
}

.osu-page--forum-topic .bbcode-editor--create{
  background: transparent !important;
}

.osu-page--forum-topic .bbcode-editor--create .bbcode-editor__content{
  background-color: #ffffff !important;
  background-image: none !important;
  border: 1px solid #dddddd !important;
}

.osu-page--forum-topic .bbcode-editor--create .bbcode-editor__input-title,
.osu-page--forum-topic .bbcode-editor--create textarea.bbcode-editor__body{
  background-color: #ffffff !important;
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
  caret-color: #444444 !important;
}

.osu-page--forum-topic .bbcode-editor--create ::placeholder{
  color: #777777 !important;
  opacity: 1 !important;
}

.osu-page--forum-topic .bbcode-editor--create .post-box-toolbar .btn-circle,
.osu-page--forum-topic .bbcode-editor--create .post-box-toolbar .btn-circle *{
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
}

.osu-page--forum-topic .bbcode-editor--create .post-box-toolbar__help,
.osu-page--forum-topic .bbcode-editor--create .post-box-toolbar__help:visited{
  color: #2299bb !important;
  -webkit-text-fill-color: #2299bb !important;
}

.osu-page--forum-topic .bbcode-editor--create .bbcode-size-select__select.js-bbcode-btn--size{
  background-color: #eaeaea !important;
  border: 1px solid #dddddd !important;
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  border-radius: 3px !important;
  padding: 3px 24px 3px 8px !important;
  line-height: 16px !important;
}
.osu-page--forum-topic .bbcode-editor--create .bbcode-size-select__select.js-bbcode-btn--size option{
  background-color: #ffffff !important;
  color: #444444 !important;
}
.osu-page--forum-topic .bbcode-editor--create label.bbcode-size-select > i.fas.fa-chevron-down{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}
.osu-page--forum-topic .bbcode-editor--create .bbcode-size-select__label{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.osu-page--forum-topic .js-post-preview--box.forum-post-preview{
  background: #ffffff !important;
  border: 0 !important;
  box-shadow: none !important;
}

.osu-page--forum-topic .forum-post-preview{
  background: #eaeaea !important;
  border: 1px solid #dddddd !important;
}
.osu-page--forum-topic .forum-post-preview .forum-post-content{
  background: #ffffff !important;
}

.osu-page--forum-topic .js-post-preview--preview,
.osu-page--forum-topic .js-post-preview--preview *,
.osu-page--forum-topic .bbcode-editor__preview,
.osu-page--forum-topic .bbcode-editor__preview *{
  -webkit-text-fill-color: initial !important;
}

.osu-page--forum-topic .js-post-preview--preview .bbcode,
.osu-page--forum-topic .bbcode-editor__preview .bbcode{
  color: #444444 !important;
  text-shadow: none !important;
}

.osu-page--forum-topic .js-post-preview--preview .bbcode a,
.osu-page--forum-topic .js-post-preview--preview .bbcode a:visited,
.osu-page--forum-topic .bbcode-editor__preview .bbcode a,
.osu-page--forum-topic .bbcode-editor__preview .bbcode a:visited{
  color: #2299bb !important;
  -webkit-text-fill-color: #2299bb !important;
}

.osu-page--forum-topic .js-post-preview--preview .bbcode h1,
.osu-page--forum-topic .js-post-preview--preview .bbcode h2,
.osu-page--forum-topic .bbcode-editor__preview .bbcode h1,
.osu-page--forum-topic .bbcode-editor__preview .bbcode h2{
  color: #CC5288 !important;
  -webkit-text-fill-color: #CC5288 !important;
}

.osu-page--forum-topic .js-post-preview--preview .bbcode blockquote,
.osu-page--forum-topic .bbcode-editor__preview .bbcode blockquote{
  border-left: 5px solid #e3e3e3 !important;
  padding-left: 10px !important;
  margin-left: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: #444444 !important;
}
.osu-page--forum-topic .js-post-preview--preview .bbcode blockquote > h4,
.osu-page--forum-topic .bbcode-editor__preview .bbcode blockquote > h4{
  color: #CC5288 !important;
  -webkit-text-fill-color: #CC5288 !important;
}

.osu-page--forum-topic .js-post-preview--preview .bbcode a.bbcode-spoilerbox__link,
.osu-page--forum-topic .js-post-preview--preview .bbcode a.bbcode-spoilerbox__link:visited,
.osu-page--forum-topic .bbcode-editor__preview .bbcode a.bbcode-spoilerbox__link,
.osu-page--forum-topic .bbcode-editor__preview .bbcode a.bbcode-spoilerbox__link:visited{
  color: #CC6600 !important;
  -webkit-text-fill-color: #CC6600 !important;
}

.osu-page--forum-topic .js-post-preview--preview a.bbcode-spoilerbox__link .bbcode-spoilerbox__link-icon,
.osu-page--forum-topic .bbcode-editor__preview a.bbcode-spoilerbox__link .bbcode-spoilerbox__link-icon{
  color: #595959 !important;
  -webkit-text-fill-color: #595959 !important;
  fill: #595959 !important;
  stroke: #595959 !important;
  filter: none !important;
}

.osu-page--forum-topic .js-post-preview--preview pre,
.osu-page--forum-topic .js-post-preview--preview code,
.osu-page--forum-topic .bbcode-editor__preview pre,
.osu-page--forum-topic .bbcode-editor__preview code{
  background: #F5F5F5 !important;
  border: 1px solid #DDDDDD !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode{
  color:#444444 !important;
  text-shadow:none !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode a,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode a:visited{
  color:#2299bb !important;
  -webkit-text-fill-color:#2299bb !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode h2{
  color:#CC5288 !important;
  -webkit-text-fill-color:#CC5288 !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode blockquote{
  background:transparent !important;
  box-shadow:none !important;
  border:0 !important;
  border-left:5px solid #e3e3e3 !important;
  padding-left:10px !important;
  margin-left:0 !important;
  color:#444444 !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode blockquote::before,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode blockquote::after,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode blockquote > *::before,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode blockquote > *::after{
  content:none !important;
  display:none !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode blockquote > h4{
  color:#CC5288 !important;
  -webkit-text-fill-color:#CC5288 !important;
  border:0 !important;
  box-shadow:none !important;
  background:transparent !important;
  padding-left:0 !important;
  margin-left:0 !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode blockquote blockquote{
  border-left:5px solid #e3e3e3 !important;
  padding-left:10px !important;
  margin-left:6px !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode a.bbcode-spoilerbox__link,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .bbcode a.bbcode-spoilerbox__link:visited{
  color:#CC6600 !important;
  -webkit-text-fill-color:#CC6600 !important;
}

:where(
  .forum-post__body,
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) a.bbcode-spoilerbox__link .bbcode-spoilerbox__link-icon,
:where(
  .forum-post__body,
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) a.bbcode-spoilerbox__link .bbcode-spoilerbox__link-icon::before{
  color: #595959 !important;
  -webkit-text-fill-color: #595959 !important;
  filter: none !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) audio-player,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .js-audio--player{
  background:#F5F5F5 !important;
  border:1px solid #DDDDDD !important;
  border-radius:4px !important;
  box-shadow:none !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player *{
  color:#444444 !important;
  -webkit-text-fill-color:#444444 !important;
  text-shadow:none !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player a{
  color:#2299bb !important;
  -webkit-text-fill-color:#2299bb !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player__bar--progress,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player__bar--volume{
  background:#1c1719 !important;
}
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player__bar-current{
  background:#ff66ab !important;
}

:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player__button:hover,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player__button:focus-visible,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player__volume-button:hover,
:where(
  .js-forum-post-edit--container .bbcode-editor__preview,
  .osu-page--forum-topic-reply .forum-post-content--reply-preview,
  .osu-page--forum-topic .js-post-preview--preview,
  .osu-page--forum-topic .bbcode-editor__preview
) .audio-player__volume-button:focus-visible{
  filter: brightness(1.3) !important;
  opacity: 0.95 !important;
}

.osu-page--forum-topic .forum-post-preview__title{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.osu-page--forum-topic .bbcode-editor--create
.bbcode-size-select__select.js-bbcode-btn--size{
  background-color: #eaeaea !important;
  background-image: none !important;
  border: 1px solid #dddddd !important;
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;

  -webkit-appearance: none !important;
  appearance: none !important;

  border-radius: 3px !important;
  padding: 3px 24px 3px 8px !important;
  line-height: 16px !important;
}

.osu-page--forum-topic .bbcode-editor--create
.bbcode-size-select__select.js-bbcode-btn--size option{
  background-color: #ffffff !important;
  color: #444444 !important;
}

.osu-page--forum-topic .bbcode-editor--create
label.bbcode-size-select{
  background: transparent !important;
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.osu-page--forum-topic .bbcode-editor--create
label.bbcode-size-select > i.fas.fa-chevron-down{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.osu-page--forum-topic .forum-topic-title{
  background: #ffffff !important;
  border: 1px solid rgba(0,0,0,.08) !important;
  box-shadow: 0 3px 3px rgba(0,0,0,.18) !important;
  border-radius: 0 !important;
}

.osu-page--forum-topic .forum-topic-title__title{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.osu-page--forum-topic .bbcode-editor.bbcode-editor--create{
  box-shadow: 0 3px 3px rgba(0,0,0,.18) !important;
  border: 1px solid rgba(0,0,0,.08) !important;
}

.osu-page--forum-topic .js-post-preview--box.forum-post-preview{
  box-shadow:
    -2px 0 2px rgba(0,0,0,.12),
     2px 0 2px rgba(0,0,0,.12) !important;
}

.osu-page--forum-topic .forum-topic-toolbar{
  background: #e3e3e3 !important;
  padding: 10px !important;
}

.osu-page--forum-topic .forum-poll.js-form-toggle--form{
  background: #ffffff !important;
  border: 1px solid #dddddd !important;
  box-shadow: 0 3px 3px rgba(0,0,0,.18) !important;
  border-radius: 0 !important;
}

.osu-page--forum-topic .forum-poll__title{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.osu-page--forum-topic .forum-poll .simple-form__label,
.osu-page--forum-topic .forum-poll .simple-form__info{
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.osu-page--forum-topic .forum-poll .simple-form__input{
  background: #ffffff !important;
  border: 1px solid #dddddd !important;
  color: #444444 !important;
  -webkit-text-fill-color: #444444 !important;
}

.footer{
  background: #222222
}

.js-forum__posts-progress.forum-topic-nav__seek-bar{
  background-color: #445500 !important;
}

.forum-topic-nav__seek-bar{
  background-color: #445500 !important;
}

.warning-box{
  background-color: #FFFFFF !important;
  color: #444444 !important;
}

.warning-box__icon{
  color: #FFFFFF !important;
}

.forum-topic-entry__replied.legacy-replied-icon{
  position:absolute !important;
  top:50% !important;
  transform:translateY(-50%) !important;

  left:15px;

  display:block !important;
  visibility:visible !important;

  width:6px !important;
  height:6px !important;

  background-color:#88b300 !important;
  border-radius:50% !important;

  pointer-events:none !important;
  opacity:1 !important;

  z-index:3 !important;
}

.forum-topic-entry__replied.legacy-replied-icon::before,
.forum-topic-entry__replied.legacy-replied-icon::after{
  content:none !important;
}

  `;

    const getForumCoverUrl = () => {
        const el = document.querySelector(".js-forum-cover--header");
        if (!el) return null;

        const bg =
              el.style?.backgroundImage ||
              getComputedStyle(el).backgroundImage ||
              "";

        const m = bg.match(/url\((['"]?)(.*?)\1\)/i);
        const url = m?.[2]?.trim();
        return url && url !== "none" ? url : null;
    };

    const syncThreadCrumbBannerImage = () => {
        if (!isThreadPage?.() || !isThreadPage()) {
            document.documentElement.style.setProperty(
                "--legacy-thread-crumbimg-image",
                `url("${THREAD_BREADCRUMB_IMAGE}")`
            );
            return;
        }

        const coverUrl = getForumCoverUrl();

        const finalUrl = coverUrl || THREAD_BREADCRUMB_IMAGE;

        document.documentElement.style.setProperty(
            "--legacy-thread-crumbimg-image",
            `url("${finalUrl}")`
        );
    };

    const legacyGetPostsRoot = () => {
        const page = getActiveTopicPage?.() || document;
        return (
            page.querySelector("#posts") ||
            page.querySelector(".forum-posts__items") ||
            page.querySelector(".forum-posts") ||
            page
        );
    };

    const legacyPostKey = (el) => {
        if (!el) return null;
        return (
            el.getAttribute("data-post-id") ||
            el.getAttribute("data-id") ||
            el.id ||
            el.dataset?.postId ||
            el.dataset?.id ||
            null
        );
    };

    const legacyGetViewportAnchor = () => {
        const postsRoot = legacyGetPostsRoot();
        const posts = [...postsRoot.querySelectorAll(".forum-post.js-forum-post")];
        if (!posts.length) return null;

        let best = null;
        let bestTop = Infinity;

        for (const p of posts) {
            const r = p.getBoundingClientRect();
            if (r.height <= 0) continue;
            if (r.top >= 0 && r.top < bestTop) {
                best = p;
                bestTop = r.top;
            }
        }

        if (!best) {
            best = posts[0];
            bestTop = best.getBoundingClientRect().top;
        }

        return { el: best, top: bestTop };
    };

    let legacyLoadMorePending = null;

    const legacyLooksLikeLoadMore = (target) => {
        if (!isThreadPage?.() || !isThreadPage()) return false;

        const el = target?.closest?.("a, button");
        if (!el) return false;

        const txt = (el.textContent || "").trim().toLowerCase();
        const saysMore = txt.includes("mostrar mais") || txt.includes("show more");
        if (!saysMore) return false;

        const href = (el.getAttribute("href") || "").toLowerCase();

        const looksLikeCursor = href.includes("cursor_string=") || href.includes("skip_layout=1");

        const inPostsArea = !!el.closest("#posts, .forum-posts, .forum-posts__items, .osu-page--forum-topic");

        return looksLikeCursor || inPostsArea;
    };

    const legacyCaptureBeforeLoadMore = () => {
        const postsRoot = legacyGetPostsRoot();

        const posts = [...postsRoot.querySelectorAll(".forum-post.js-forum-post")];
        const first = posts[0] || null;
        const last = posts[posts.length - 1] || null;

        legacyLoadMorePending = {
            ts: performance.now(),
            scrollY: window.scrollY,
            scrollH: document.documentElement.scrollHeight,
            anchor: legacyGetViewportAnchor(),
            firstKey: legacyPostKey(first),
            lastKey: legacyPostKey(last),
        };
    };

    document.addEventListener(
        "pointerdown",
        (e) => {
            if (legacyLooksLikeLoadMore(e.target)) legacyCaptureBeforeLoadMore();
        },
        true
    );

    const legacyApplyLoadMoreFix = () => {
        const p = legacyLoadMorePending;
        if (!p) return;

        const postsRoot = legacyGetPostsRoot();

        const run = (tries = 0) => {
            if (!legacyLoadMorePending) return;

            const anchorEl = p.anchor?.el;
            const anchorTop = p.anchor?.top ?? 0;

            if (anchorEl && document.contains(anchorEl)) {
                const newTop = anchorEl.getBoundingClientRect().top;
                const delta = newTop - anchorTop;
                if (Math.abs(delta) > 0.5) window.scrollBy(0, delta);
            } else {

                const posts = [...postsRoot.querySelectorAll(".forum-post.js-forum-post")];
                const newFirstKey = legacyPostKey(posts[0] || null);
                const newLastKey  = legacyPostKey(posts[posts.length - 1] || null);

                const addedAtTop = p.firstKey && newFirstKey && p.firstKey !== newFirstKey;
                const addedAtBottom = p.lastKey && newLastKey && p.lastKey !== newLastKey;

                if (addedAtTop && !addedAtBottom) {
                    const dh = document.documentElement.scrollHeight - p.scrollH;
                    if (dh > 1) window.scrollTo(0, p.scrollY + dh);
                }
            }

            if (tries < 12 && performance.now() - p.ts < 5000) {
                requestAnimationFrame(() => run(tries + 1));
            } else {
                legacyLoadMorePending = null;
            }
        };

        requestAnimationFrame(() => run(0));
        setTimeout(() => run(0), 0);
        setTimeout(() => run(0), 50);
        setTimeout(() => run(0), 250);
        setTimeout(() => run(0), 800);
    };

    const iso2FromRankingLink = (flagSpan) => {
        const a = flagSpan.closest("a[href*='country=']");
        if (!a) return null;

        try {
            const u = new URL(a.href, location.origin);
            const cc = (u.searchParams.get("country") || "").trim().toUpperCase();
            return /^[A-Z]{2}$/.test(cc) ? cc : null;
        } catch {
            return null;
        }
    };

    const iso2FromEmojiSvg = (flagSpan) => {
        const bg = flagSpan.style?.backgroundImage || "";

        const m = bg.match(/\/([0-9a-f]{4,6})-([0-9a-f]{4,6})\.svg/i);
        if (!m) return null;

        const a = parseInt(m[1], 16);
        const b = parseInt(m[2], 16);

        const A = 0x1F1E6;

        const c1 = a - A;
        const c2 = b - A;

        if (c1 < 0 || c1 > 25 || c2 < 0 || c2 > 25) return null;

        return String.fromCharCode(65 + c1) + String.fromCharCode(65 + c2);
    };

    const replaceCountryFlagsWithLegacy = (root = document) => {
        root.querySelectorAll(".flag-country").forEach(span => {

            if (span.dataset.legacyDone === "1") return;

            const iso2 =
                  iso2FromRankingLink(span) ||
                  iso2FromEmojiSvg(span);

            if (!iso2) return;

            const img = document.createElement("img");
            img.className = "forum__user-flag forum__user-flag--country legacy-flag";
            img.alt = iso2;
            img.src = `${LEGACY_FLAG_BASE}${iso2}.png`;

            const t = span.getAttribute("title") || span.getAttribute("data-orig-title") || "";
            if (t) img.setAttribute("title", t);

            span.replaceWith(img);
        });
    };

    const mountLegacyThreadCounters = () => {
        const banner = document.getElementById("legacy-thread-crumbimg");
        if (!banner) return;

        if (banner.querySelector(".legacy-thread-counters")) return;

        const src = document.querySelector(".js-header--main .forum-topic-title__item--counters");
        if (!src) return;

        const boxes = [...src.querySelectorAll(".counter-box")];
        if (!boxes.length) return;

        const wrap = document.createElement("div");
        wrap.className = "legacy-thread-counters";

        for (const b of boxes) wrap.appendChild(b.cloneNode(true));
        banner.appendChild(wrap);
    };

    window.addEventListener("turbo:render", mountLegacyThreadCounters);
    window.addEventListener("legacy:urlchange", mountLegacyThreadCounters);

    setTimeout(mountLegacyThreadCounters, 0);

    const rgbToCss = ({r,g,b}) => `rgb(${r}, ${g}, ${b})`;

    const hueIn = (h, a, b) => (a <= b) ? (h >= a && h <= b) : (h >= a || h <= b);

    const style = document.createElement("style");
    style.id = "legacy-forum-style";
    style.textContent = css;

    document.documentElement.appendChild(style);

    const ensureStyleLast = () => {

        const head = document.head || document.documentElement;
        head.appendChild(style);
    };

    let styleRaf = 0;
    const ensureStyleLastScheduled = () => {
        cancelAnimationFrame(styleRaf);
        styleRaf = requestAnimationFrame(ensureStyleLast);
    };

    window.addEventListener("turbo:render", ensureStyleLastScheduled);
    window.addEventListener("legacy:urlchange", ensureStyleLastScheduled);

    const markImportantTriangles = (root = document) => {
        root.querySelectorAll(".forum-topic-entry__icon").forEach(a => {
            const hasTriangle =
                  !!a.querySelector("i.fa-exclamation-triangle, i.fas.fa-exclamation-triangle, i.far.fa-exclamation-triangle") ||
                  !!a.querySelector("i.fa-triangle-exclamation, i.fas.fa-triangle-exclamation, i.far.fa-triangle-exclamation");

            a.classList.toggle("legacy-important", hasTriangle);
        });
    };

    const getForumIdFromUrl = () => {

        const m = location.pathname.match(/\/community\/forums\/(\d+)/);
        return m ? m[1] : null;
    };

    const isFirstPage = () => {
        const url = new URL(location.href);
        const p = url.searchParams.get("page");
        return !p || p === "1";
    };

    const getForumPage = () => (
        document.querySelector(
            "body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--forum"
        )
        || document.querySelector(
            "body > div.osu-layout__section.osu-layout__section--full > div.osu-page.osu-page--forum-topic"
        )
        || document.querySelector(
            "body > div.osu-layout__section.osu-layout__section--full > div.osu-page"
        )
    );

    const isThreadPage = () => location.pathname.includes("/community/forums/topics/");

    const removePostHighlight = (root = document) => {
        root
            .querySelectorAll(".js-forum-post--highlighted")
            .forEach(el => el.classList.remove("js-forum-post--highlighted"));
    };

    const syncLegacyPostInfoAvatarSizes = (root = document) => {
        let anyPending = false;

        root.querySelectorAll(".forum-post-info").forEach(info => {
            const r = info.getBoundingClientRect();

            if (!r.width) {
                anyPending = true;
                return;
            }

            const frac = 1;
            const inset = 0;
            const size = Math.max(60, Math.round((r.width * frac) - (inset * 2)));
            info.style.setProperty("--legacy-avatar-size", `${size}px`);
        });

        if (anyPending) {
            requestAnimationFrame(() => syncLegacyPostInfoAvatarSizes(root));
        }
    };

    syncLegacyPostInfoAvatarSizes();
    requestAnimationFrame(() => syncLegacyPostInfoAvatarSizes());
    setTimeout(() => syncLegacyPostInfoAvatarSizes(), 50);

    window.addEventListener("turbo:load", () => {
        syncLegacyPostInfoAvatarSizes(document);
    });

    window.addEventListener("turbo:render", () => {
        syncLegacyPostInfoAvatarSizes(document);
    });

    const postInfoResizeObserver = new ResizeObserver(() => {
        syncLegacyPostInfoAvatarSizes();
    });
    document.querySelectorAll(".forum-post-info").forEach(el => postInfoResizeObserver.observe(el));

    const observeNewPostInfos = (root = document) => {
        root.querySelectorAll(".forum-post-info").forEach(el => postInfoResizeObserver.observe(el));
    };

    const ensureBannedAvatarPlaceholders = (root = document) => {
        root.querySelectorAll(".forum-post-info").forEach(info => {
            const hasAvatar = !!info.querySelector(".forum-post-info__row--avatar .avatar.avatar--forum");

            if (hasAvatar) return;

            const nameEl = info.querySelector(".forum-post-info__row--username");
            const name = nameEl?.textContent?.trim() || "Banned";

            let row = info.querySelector(".forum-post-info__row--avatar");
            if (!row) {
                row = document.createElement("div");
                row.className = "forum-post-info__row forum-post-info__row--avatar";

                info.prepend(row);
            }

            const avatar = document.createElement("div");
            avatar.className = "avatar avatar--forum legacy-banned";
            avatar.setAttribute("data-legacy-name", name);

            avatar.style.setProperty("background-image", "none", "important");

            row.appendChild(avatar);
        });
    };

    const markThreadHeaders = (root = document) => {
        const isThread = isThreadPage();
        root.querySelectorAll(".osu-page--forum-topic .js-header--main").forEach(h => {

            h.classList.toggle("legacy-hide-header", isThread);
        });
    };

    const ensureThreadPollWrapAndMove = () => {
        if (!isThreadPage()) {
            document.querySelector("#legacy-thread-poll-wrap")?.remove();
            return null;
        }

        const pollInner = document.querySelector(".js-forum-poll--container");
        const pollCard = pollInner?.closest(".forum-poll-container") || pollInner;

        if (!pollCard) {
            document.querySelector("#legacy-thread-poll-wrap")?.remove();
            return null;
        }

        let wrap = document.querySelector("#legacy-thread-poll-wrap");
        if (!wrap) {
            wrap = document.createElement("div");
            wrap.id = "legacy-thread-poll-wrap";
        }

        if (pollCard.parentElement !== wrap) {
            wrap.appendChild(pollCard);
        }

        const page = getActiveTopicPage();
        if (!page) return wrap;

        const firstPost = page.querySelector('.forum-post.js-forum-post[data-post-position="1"]');
        if (!firstPost) return wrap;

        const postsWrap =
              firstPost.closest("#posts") ||
              firstPost.closest(".forum-posts__items") ||
              firstPost.closest(".forum-posts") ||
              page;

        let ref = firstPost;
        while (ref && ref.parentElement !== postsWrap) ref = ref.parentElement;

        const banner = document.querySelector("#legacy-thread-crumbimg");

        if (banner && banner.parentElement === postsWrap) {
            if (banner.nextSibling !== wrap) {
                postsWrap.insertBefore(wrap, banner.nextSibling);
            }
        } else {

            if (ref && wrap.parentElement !== postsWrap) {
                postsWrap.insertBefore(wrap, ref);
            }
        }

        return wrap;
    };

    const syncLegacyAvatarNames = (root = document) => {
        root.querySelectorAll(".forum-post-info").forEach(info => {
            const nameEl = info.querySelector(".forum-post-info__row--username");
            const avatar = info.querySelector(".avatar.avatar--forum");
            if (!nameEl || !avatar) return;

            const name = nameEl.textContent.trim();
            if (name) avatar.setAttribute("data-legacy-name", name);

            const userId = nameEl.getAttribute("data-user-id") || nameEl.dataset.userId;
            if (userId) {
                avatar.classList.add("js-usercard");
                avatar.setAttribute("data-user-id", userId);
            }
        });
    };

    syncLegacyAvatarNames();
    requestAnimationFrame(() => syncLegacyAvatarNames());

    ensureBannedAvatarPlaceholders();
    requestAnimationFrame(() => ensureBannedAvatarPlaceholders());

    const getActiveTopicPage = () => {

        const page = getForumPage();
        if (page && page.classList.contains("osu-page--forum-topic")) return page;

        const pages = [...document.querySelectorAll(".osu-page.osu-page--forum-topic")];
        return pages.find(p => p.getClientRects().length > 0) || pages[0] || null;
    };

    const updateThreadBannerTitleLines = (titleEl) => {
        if (!titleEl) return;

        titleEl.removeAttribute("data-lines");

        const cs = getComputedStyle(titleEl);
        const lh = parseFloat(cs.lineHeight) || 0;
        const h = titleEl.getBoundingClientRect().height;

        const lines = (lh > 0 && h > lh * 1.3) ? 2 : 1;
        titleEl.setAttribute("data-lines", String(lines));
    };

    const ensureThreadBannerInFlow = () => {

        if (!isThreadPage()) {
            document.querySelector("#legacy-thread-top-spacer")?.remove();
            document.querySelector("#legacy-thread-crumbimg")?.remove();
            document.querySelector("#legacy-thread-poll-wrap")?.remove();
            return;
        }

        document.documentElement.style.setProperty("--legacy-thread-topspacer-nudge", "-100px");

        const page = getActiveTopicPage();
        if (!page) return;

        const firstPost = page.querySelector('.forum-post.js-forum-post[data-post-position="1"]');
        if (!firstPost || firstPost.getClientRects().length === 0) return;

        const postsWrap =
              firstPost.closest("#posts") ||
              firstPost.closest(".forum-posts__items") ||
              firstPost.closest(".forum-posts") ||
              page;

        let ref = firstPost;
        while (ref && ref.parentElement !== postsWrap) ref = ref.parentElement;

        let spacer = document.querySelector("#legacy-thread-top-spacer");
        if (!spacer) {
            spacer = document.createElement("div");
            spacer.id = "legacy-thread-top-spacer";
        }

        let banner = document.querySelector("#legacy-thread-crumbimg");
        if (!banner) {
            banner = document.createElement("div");
            banner.id = "legacy-thread-crumbimg";
        }

        syncThreadCrumbBannerImage();

        const pollWrap = ensureThreadPollWrapAndMove();

        if (ref) {
            postsWrap.insertBefore(spacer, ref);
            postsWrap.insertBefore(banner, ref);
            if (pollWrap) postsWrap.insertBefore(pollWrap, ref);
        } else {
            if (pollWrap) postsWrap.prepend(pollWrap);
            postsWrap.prepend(banner);
            postsWrap.prepend(spacer);
        }

        markThreadHeaders(document);

        const bar = document.querySelector(".header-v4__row.header-v4__row--bar");
        if (bar) {
            const r = bar.getBoundingClientRect();
            const h = Math.max(0, Math.round(r.height - 30));
            document.documentElement.style.setProperty("--legacy-thread-top-spacer-h", `${h}px`);
        } else {
            document.documentElement.style.setProperty("--legacy-thread-top-spacer-h", `0px`);
        }

        const t = getThreadTitleText();
        let title = banner.querySelector(".legacy-thread-title-inbanner");
        if (!title) {
            title = document.createElement("div");
            title.className = "legacy-thread-title-inbanner";
            banner.appendChild(title);
        }
        title.textContent = t;
        requestAnimationFrame(() => updateThreadBannerTitleLines(title));
        setTimeout(() => updateThreadBannerTitleLines(title), 50);
    };

    const removeCreateTopicRow = (root = document) => {
        root
            .querySelectorAll("#topics ul.forum-list__items > li#legacy-create-topic")
            .forEach(el => el.remove());
    };

    const injectCreateTopicRow = (root = document) => {
        const topics = root.querySelector("#topics");
        if (!topics) return;

        const ul = topics.querySelector("ul.forum-list__items");
        if (!ul) return;

        if (!isFirstPage()) {
            removeCreateTopicRow(root);
            return;
        }

        if (ul.querySelector(":scope > li#legacy-create-topic")) return;

        const forumId = getForumIdFromUrl();
        if (!forumId) return;

        const href = `https://osu.ppy.sh/community/forums/topics/create?forum_id=${forumId}`;

        const li = document.createElement("li");
        li.id = "legacy-create-topic";
        li.className = "forum-topic-entry clickable-row u-forum--hover-area";

        li.innerHTML = `
      <div class="forum-topic-entry__bg"></div>

<a class="
      forum-topic-entry__col
      forum-topic-entry__col--icon
      forum-topic-entry__col--icon-plus
      js-login-required--click
  " href="${href}">
  <span class="legacy-plus-icon" aria-hidden="true"></span>
</a>

      <div class="forum-topic-entry__col forum-topic-entry__col--main">
        <div class="forum-topic-entry__content forum-topic-entry__content--left">
          <a class="
                u-forum--link
                u-forum--hover-target
                clickable-row-link
                js-login-required--click
                forum-topic-entry__title
            " href="${href}">
            Post new topic
          </a>
        </div>
      </div>

      <a class="
            forum-topic-entry__col
            forum-topic-entry__col--last-link
            js-login-required--click
            u-forum--link-hover
        " href="${href}" data-orig-title="Post new topic">
        <i class="fa fa-chevron-right"></i>
      </a>
    `;

        ul.prepend(li);
    };

    const ensureLegacyReplied = (entry, replied, locked) => {
        let el =
            entry.querySelector(":scope > .forum-topic-entry__replied") ||
            entry.querySelector(".forum-topic-entry__replied");

        if (replied) {
            if (!el) {
                el = document.createElement("span");
                el.className = "forum-topic-entry__replied";
                el.setAttribute("data-orig-title", "Você respondeu a este tópico");
                el.setAttribute("data-hasqtip", "1");
            }

            el.classList.add("legacy-replied-icon");

            el.style.left = locked ? "1px" : "15px";

            if (el.parentElement !== entry) entry.prepend(el);
            else entry.prepend(el);
        } else if (el) {
            el.classList.remove("legacy-replied-icon");
            el.style.left = "";
        }
    };

    const ensureLegacyLock = (entry, locked) => {
        let icon = entry.querySelector(":scope > .legacy-lock-icon");

        if (locked) {
            if (!icon) {
                icon = document.createElement("i");
                icon.className = "fas fa-lock legacy-lock-icon";
                entry.prepend(icon);
            }
            entry.classList.add("legacy-locked");
        } else {
            if (icon) icon.remove();
            entry.classList.remove("legacy-locked");
        }
    };

    const setLegacyHeaderImageForForum = (forumId) => {
        const img = (forumId === "52") ? THREADS_HEADER_52 : THREADS_HEADER_OTHER;
        document.documentElement.style.setProperty("--legacy-threads-header-image", `url("${img}")`);
    };

    const getForumTitleText = () => {

        const lastCrumb =
              document.querySelector(".header-nav-v4--breadcrumb .header-nav-v4__item:last-child .header-nav-v4__link") ||
              document.querySelector(".header-nav-v4--breadcrumb .header-nav-v4__item:last-child a");

        const t = lastCrumb?.textContent?.replace(/\s+/g, " ").trim();
        if (t) return t;

        const docT = (document.title || "").trim();
        return docT.replace(/\s*·\s*osu!\s*$/i, "") || "Forum";
    };

    const getThreadTitleText = () => {
        const h1 =
              document.querySelector("h1.forum-topic-title") ||
              document.querySelector(".forum-topic-title") ||
              document.querySelector("h1.title") ||
              document.querySelector("h1");

        if (h1) {
            const tmp = h1.cloneNode(true);

            tmp.querySelectorAll(
                "time, .js-timeago, .timeago, .forum-topic-title__details, .forum-topic-title__info, .forum-topic-title__meta, small"
            ).forEach(n => n.remove());

            tmp.querySelectorAll("[class*='time'], [class*='date'], [class*='meta'], [class*='details'], [class*='info']")
                .forEach(n => n.remove());

            const t = tmp.textContent.replace(/\s+/g, " ").trim();
            if (t) return t;
        }

        const docT = (document.title || "").trim();
        return docT.replace(/\s*·\s*osu!\s*$/i, "") || "Thread";
    };

    const ensureLegacyHeaderTitle = () => {
        const page = getForumPage();
        if (!page) return null;

        const container = isThreadPage() ? document.body : page;

        let el = document.getElementById("legacy-forum-header-title");
        if (!el) {
            el = document.createElement("a");
            el.id = "legacy-forum-header-title";
            el.className = "u-forum--link";
            container.appendChild(el);
        } else if (el.parentElement !== container) {
            container.appendChild(el);
        }

        if (isThreadPage()) {
            el.textContent = getThreadTitleText();
            el.href = location.href;
        } else {
            el.textContent = getForumTitleText();
            el.href = location.href;
        }

        const forumId = getForumIdFromUrl();
        if (forumId) setLegacyHeaderImageForForum(forumId);

        return el;
    };

    const markLocked = (root = document) => {
        root.querySelectorAll(".forum-topic-entry").forEach(entry => {
            const locked = !!entry.querySelector("i.fa-lock, i.fas.fa-lock, i[class*='fa-lock']");
            ensureLegacyLock(entry, locked);

            const replied = !!entry.querySelector(".forum-topic-entry__replied");
            ensureLegacyReplied(entry, replied, locked);
        });
    };

    let _legacyHeaderRaf = 0;
    const scheduleLegacyHeaderSync = () => {
        cancelAnimationFrame(_legacyHeaderRaf);
        _legacyHeaderRaf = requestAnimationFrame(() => {
            syncLegacyHeader();
            setTimeout(syncLegacyHeader, 50);
            setTimeout(syncLegacyHeader, 250);
        });
    };

    let supporterRaf = 0;
    const scheduleSupporterRescan = () => {
        cancelAnimationFrame(supporterRaf);
        supporterRaf = requestAnimationFrame(() => applySupporterAvatarOverlays(document));
    };

    const syncLegacyHeader = () => {
        const bar = document.querySelector(".header-v4__row.header-v4__row--bar");
        const crumb = document.querySelector(".header-nav-v4.header-nav-v4--breadcrumb");
        const page = getForumPage();

        if (!bar || !page) return;

        ensureThreadBannerInFlow();

        markThreadHeaders(document);
        ensureThreadPollWrapAndMove();

        const CUT = 26;
        const VISIBLE = 50;
        const OVERLAP = 10;
        const GAP = 10;

        bar.style.height = "";
        bar.style.minHeight = "0";
        bar.style.overflow = "visible";
        bar.style.clipPath = "";
        bar.style.paddingTop = "";
        bar.style.paddingBottom = "";

        let r = bar.getBoundingClientRect();
        const targetTotal = CUT + VISIBLE;

        if (r.height < targetTotal) {
            const add = targetTotal - r.height;
            bar.style.paddingTop = `${add / 2}px`;
            bar.style.paddingBottom = `${add / 2}px`;
            r = bar.getBoundingClientRect();
        }

        bar.style.overflow = "hidden";
        bar.style.clipPath = `inset(0 0 ${CUT}px 0)`;

        const pageRect = page.getBoundingClientRect();

        const visibleBarBottom = r.bottom - CUT;

        const anchorBottomViewport =
              (crumb && crumb.getClientRects().length ? crumb.getBoundingClientRect().bottom : null)
        ?? visibleBarBottom;

        document.documentElement.style.setProperty(
            "--legacy-bar-visible-bottom",
            `${anchorBottomViewport}px`
        );

        const headerH = Math.round(r.width / 5);

        const pageTopDoc = pageRect.top + window.scrollY;
        const anchorBottomDoc = anchorBottomViewport + window.scrollY;

        const afterTop = (anchorBottomDoc - pageTopDoc) - OVERLAP;
        const panelTop = afterTop + headerH + GAP;

        document.documentElement.style.setProperty("--legacy-threadsheader-top", `${Math.round(afterTop)}px`);
        document.documentElement.style.setProperty("--legacy-panel-top", `${Math.round(panelTop)}px`);

        if (isThreadPage()) {
            const rootStyle = getComputedStyle(document.documentElement);

            const crumbH =
                  parseFloat(rootStyle.getPropertyValue("--legacy-thread-crumbimg-h")) || 200;

            const crumbGap =
                  parseFloat(rootStyle.getPropertyValue("--legacy-thread-crumbimg-gap")) || 0;

            const firstGap =
                  parseFloat(rootStyle.getPropertyValue("--legacy-thread-firstpost-gap")) || 5;

        }

        const titleEl = ensureLegacyHeaderTitle();
        if (titleEl) {
            titleEl.style.setProperty(
                "position",
                isThreadPage() ? "fixed" : "absolute",
                "important"
            );

            const panelW = r.width;

            const X_FRAC = 0.045;
            const leftPx = panelW * X_FRAC;
            titleEl.style.left = `calc(50% - ${panelW / 2}px + ${leftPx}px)`;

            titleEl.classList.remove("legacy-title-below");

            if (isThreadPage()) {
                document.getElementById("legacy-forum-header-title")?.remove();
            } else {
                const titleEl = ensureLegacyHeaderTitle();
                if (titleEl) {
                    titleEl.style.setProperty("position", "absolute", "important");

                    const panelW = r.width;

                    const X_FRAC = 0.045;
                    const leftPx = panelW * X_FRAC;
                    titleEl.style.left = `calc(50% - ${panelW / 2}px + ${leftPx}px)`;

                    titleEl.classList.remove("legacy-title-below");
                    titleEl.classList.remove("legacy-thread-title");
                    titleEl.classList.remove("legacy-title-wrap");

                    document.documentElement.style.setProperty("--legacy-header-title-size", "45px");
                    document.documentElement.style.setProperty("--legacy-header-title-line", "45px");
                    document.documentElement.style.setProperty("--legacy-header-title-color", "#ffffff");
                    document.documentElement.style.setProperty("--legacy-header-title-shadow", "0 1px 2px rgba(0,0,0, 0.7)");

                    titleEl.style.setProperty("transform", "translateY(-50%)", "important");

                    const Y_FRAC_FORUM = 0.7;
                    const topPx = headerH * Y_FRAC_FORUM;
                    titleEl.style.top = `calc(var(--legacy-threadsheader-top) + ${topPx}px)`;

                    titleEl.style.maxWidth = "";
                }
            }
        }

    };

    const clamp01 = (x) => Math.max(0, Math.min(1, x));

    const srgbToLin = (c) => {
        c = c / 255;
        return (c <= 0.04045) ? (c / 12.92) : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const relLuminance = ({r,g,b}) => {
        const R = srgbToLin(r), G = srgbToLin(g), B = srgbToLin(b);
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };

    const contrastRatio = (rgb1, rgb2) => {
        const L1 = relLuminance(rgb1);
        const L2 = relLuminance(rgb2);
        const hi = Math.max(L1, L2);
        const lo = Math.min(L1, L2);
        return (hi + 0.05) / (lo + 0.05);
    };

    const parseCssColor = (str) => {
        if (!str) return null;
        str = str.trim().toLowerCase();

        let m = str.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+)\s*)?\)$/);
        if (m) return {
            r: Math.round(+m[1]),
            g: Math.round(+m[2]),
            b: Math.round(+m[3]),
            a: (m[4] === undefined ? 1 : Math.max(0, Math.min(1, +m[4])))
        };

        m = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
        if (m) {
            const h = m[1];
            if (h.length === 3) {
                return {
                    r: parseInt(h[0] + h[0], 16),
                    g: parseInt(h[1] + h[1], 16),
                    b: parseInt(h[2] + h[2], 16),
                    a: 1
                };
            }
            return {
                r: parseInt(h.slice(0,2), 16),
                g: parseInt(h.slice(2,4), 16),
                b: parseInt(h.slice(4,6), 16),
                a: 1
            };
        }

        if (!document.body) return null;

        const tmp = document.createElement("span");
        tmp.style.color = str;
        document.body.appendChild(tmp);
        const resolved = getComputedStyle(tmp).color;
        tmp.remove();
        return parseCssColor(resolved);
    };

    const rgbToHsl = ({r,g,b}) => {
        let R = r/255, G = g/255, B = b/255;
        const max = Math.max(R,G,B), min = Math.min(R,G,B);
        let h=0, s=0, l=(max+min)/2;
        const d = max-min;
        if (d !== 0) {
            s = d / (1 - Math.abs(2*l - 1));
            switch(max){
                case R: h = ((G-B)/d) % 6; break;
                case G: h = (B-R)/d + 2; break;
                case B: h = (R-G)/d + 4; break;
            }
            h *= 60;
            if (h < 0) h += 360;
        }
        return {h, s, l};
    };

    const hslToRgb = ({h,s,l}) => {
        const C = (1 - Math.abs(2*l - 1)) * s;
        const X = C * (1 - Math.abs(((h/60) % 2) - 1));
        const m = l - C/2;
        let r1=0,g1=0,b1=0;
        if (0<=h && h<60)  { r1=C; g1=X; b1=0; }
        else if (60<=h && h<120){ r1=X; g1=C; b1=0; }
        else if (120<=h && h<180){ r1=0; g1=C; b1=X; }
        else if (180<=h && h<240){ r1=0; g1=X; b1=C; }
        else if (240<=h && h<300){ r1=X; g1=0; b1=C; }
        else { r1=C; g1=0; b1=X; }
        return {
            r: Math.round((r1+m)*255),
            g: Math.round((g1+m)*255),
            b: Math.round((b1+m)*255),
        };
    };

    const getEffectiveBg = (el) => {
        let cur = el;

        while (cur && cur.nodeType === 1) {
            const bg = getComputedStyle(cur).backgroundColor;
            const rgb = parseCssColor(bg);

            if (rgb && rgb.a !== undefined) {

                if (rgb.a > 0.05) return { r: rgb.r, g: rgb.g, b: rgb.b };
            } else if (rgb) {

                return { r: rgb.r, g: rgb.g, b: rgb.b };
            }

            cur = cur.parentElement;
        }

        return { r: 255, g: 255, b: 255 };
    };

    const fixLowContrastBBCodeColors = (root = document) => {
        const MIN_CONTRAST = 1.8;

        const nodes = root.querySelectorAll
        ? root.querySelectorAll(`
      .forum-post__body [style*="color"],
      .forum-post__body font[color],

      .js-forum-post-edit--container [style*="color"],
      .js-forum-post-edit--container font[color],

      .osu-page--forum-topic-reply .forum-post-content--reply-preview [style*="color"],
      .osu-page--forum-topic-reply .forum-post-content--reply-preview font[color],

      .osu-page--forum-topic .js-post-preview--preview [style*="color"],
      .osu-page--forum-topic .js-post-preview--preview font[color],
      .osu-page--forum-topic .bbcode-editor__preview [style*="color"],
      .osu-page--forum-topic .bbcode-editor__preview font[color]
    `)
        : [];

        nodes.forEach(el => {
            const inSpoiler = el.closest('.spoiler, .bbcode-spoilerbox, .bbcode-spoilerbox__content');
            if (inSpoiler) {
                const cs = getComputedStyle(inSpoiler);
                const hidden =
                      cs.display === "none" ||
                      cs.visibility === "hidden" ||
                      cs.opacity === "0";

                if (hidden) return;
            }

            let c = "";
            if (el.tagName === "FONT" && el.getAttribute("color")) {
                c = el.getAttribute("color");
            } else {
                c = el.style?.color || "";
            }
            if (!c) return;

            const fg = parseCssColor(c);
            if (!fg) return;

            const bg = getEffectiveBg(el);
            const cr = contrastRatio(fg, bg);

            const hsl = rgbToHsl(fg);

            const isNeon =
                  hsl.s > 0.92 &&
                  (hsl.l > 0.70 || hueIn(hsl.h, 80, 160));

            if (cr >= MIN_CONTRAST && !isNeon) return;

            let s = hsl.s;
            if (s > 0.85) {
                s = (hsl.l > 0.75) ? 0.60 : 0.75;
            }

            const bgLum = relLuminance(bg);
            const dir = (bgLum > 0.5) ? -1 : 1;

            let best = fg;
            let l = hsl.l;

            for (let i = 0; i < 140; i++) {
                const candidate = hslToRgb({ h: hsl.h, s, l });
                best = candidate;

                if (contrastRatio(candidate, bg) >= MIN_CONTRAST) break;

                l = clamp01(l + dir * 0.01);
                if (l === 0 || l === 1) break;
            }

            el.style.setProperty("color", rgbToCss(best), "important");
        });
    };

    const hexToRgb = (hex) => {
        if (!hex) return null;
        hex = hex.trim();

        const m = hex.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (!m) return null;

        const h = m[1].toLowerCase();
        if (h.length === 3) {
            return {
                r: parseInt(h[0] + h[0], 16),
                g: parseInt(h[1] + h[1], 16),
                b: parseInt(h[2] + h[2], 16),
            };
        }
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
        };
    };

    const rgbaFromHex = (hex, a) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return null;
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
    };

    const normalizeGroupColour = (c) => {
        if (!c) return c;

        const n = c.trim().toLowerCase().replace(/\s+/g, "");

        if (n === "#999999" || n === "rgb(153,153,153)") return "#666666";
        if (n === "#e45678" || n === "rgb(228,86,120)")  return "#fc628c";

        return c.trim();
    };

    const getUserGroupColour = (infoEl) => {
        const badge = infoEl.querySelector(".forum-post-info__row--group-badge .user-group-badge");
        if (!badge) return null;

        let c = badge.style.getPropertyValue("--group-colour")?.trim();
        if (c) return normalizeGroupColour(c);

        c = getComputedStyle(badge).getPropertyValue("--group-colour")?.trim();
        return c ? normalizeGroupColour(c) : null;
    };

    const getSupporterLevel = (info) => {
        const row = info.querySelector(".forum-post-info__row--support-level");
        if (!row) return null;

        const hearts = row.querySelectorAll(`
    i[class*="heart"],
    span[class*="heart"],
    svg[data-icon="heart"],
    svg[class*="heart"]
  `);

        return Math.min(3, hearts.length || 0);
    };

    const applySupporterAvatarOverlays = (root = document) => {
        root.querySelectorAll(".forum-post-info").forEach(info => {
            const avatar = info.querySelector(".forum-post-info__row--avatar .avatar.avatar--forum");
            if (!avatar) return;

            if (avatar.classList.contains("legacy-banned")) {
                avatar.style.removeProperty("--legacy-avatar-white-image");
                info.querySelector(".forum-post-info__row--support-level")?.remove();
                return;
            }

            const lvl = getSupporterLevel(info);

            if (lvl === null) return;

            let img = null;
            if (lvl === 1) img = LEGACY_AVATAR_WHITE_L1;
            else if (lvl === 2) img = LEGACY_AVATAR_WHITE_L2;
            else if (lvl === 3) img = LEGACY_AVATAR_WHITE_L3;

            if (img) avatar.style.setProperty("--legacy-avatar-white-image", `url("${img}")`);
            else avatar.style.removeProperty("--legacy-avatar-white-image");

            info.querySelector(".forum-post-info__row--support-level")?.remove();
        });
    };

    const applyLegacyUserTints = (root = document) => {
        const DEFAULT = LEGACY_DEFAULT_USER_COLOUR;
        const INFO_ALPHA = 0.10;

        root.querySelectorAll(".forum-post-info").forEach(info => {
            const avatar = info.querySelector(".forum-post-info__row--avatar .avatar.avatar--forum");
            if (!avatar) return;

            if (avatar.classList.contains("legacy-banned")) {
                info.style.removeProperty("background-color");
                avatar.style.removeProperty("--legacy-user-colour");
                return;
            }

            const groupColour = getUserGroupColour(info);
            const base = groupColour || DEFAULT;

            avatar.style.setProperty("--legacy-user-colour", base);

            const bg = rgbaFromHex(base, INFO_ALPHA);
            if (bg) info.style.setProperty("background-color", bg, "important");
        });
    };

    const applyRoleStripes = (root = document) => {
        const DEFAULT = (LEGACY_DEFAULT_USER_COLOUR || "").trim().toLowerCase();

        root.querySelectorAll(".forum-post.js-forum-post").forEach(post => {
            const info = post.querySelector(".forum-post-info");
            if (!info) return;

            const avatar = info.querySelector(".forum-post-info__row--avatar .avatar.avatar--forum");

            if (!avatar || avatar.classList.contains("legacy-banned")) {
                post.classList.remove("legacy-role-stripe");
                post.style.removeProperty("--legacy-role-colour");
                return;
            }

            const groupColour = (getUserGroupColour(info) || "").trim();
            const groupLower = groupColour.toLowerCase();

            if (!groupColour || groupLower === DEFAULT) {
                post.classList.remove("legacy-role-stripe");
                post.style.removeProperty("--legacy-role-colour");
                return;
            }

            post.classList.add("legacy-role-stripe");
            post.style.setProperty("--legacy-role-colour", groupColour);
        });
    };

    const ensureLegacyAvatarWhiteOverlay = (root = document) => {
        root.querySelectorAll(".forum-post-info .avatar.avatar--forum").forEach(avatar => {
            if (avatar.querySelector(":scope > .legacy-avatar-white")) return;

            const d = document.createElement("div");
            d.className = "legacy-avatar-white";
            avatar.appendChild(d);
        });
    };

    const applyUserColors = (root = document) => {
        root.querySelectorAll(".forum-user-icon[style]").forEach(icon => {
            let bg = icon.style.backgroundColor;
            if (!bg) return;

            const normalized = bg.replace(/\s+/g, "").toLowerCase();
            if (
                normalized === "rgb(153,235,71)" ||
                normalized === "#99eb47"
            ) {
                bg = "#89b300";
            }

            const nameEl =
                  icon.nextElementSibling ||
                  icon.closest("a, .js-usercard, .user-name") ||
                  icon.parentElement;

            if (!nameEl) return;

            nameEl.style.setProperty("color", bg, "important");
        });
    };

    const removeForumExtras = (root = document) => {
        root
            .querySelectorAll(`
      div.forum-list__buttons,
      div.sort.sort--forum-topics,
      li.forum-item--header,
      div.forum-title.forum-title--forum
    `)
            .forEach(el => el.remove());
    };

    const removeLegacyPagination = (root = document) => {
        root.querySelectorAll("nav.forum-pagination.legacy-forum-pagination").forEach(n => n.remove());
    };

    const buildLegacyPagination = (root = document) => {

        const modern = root.querySelector("nav.pagination-v2.pagination-v2--forum");
        if (!modern) return;

        if (modern.parentElement?.querySelector("nav.forum-pagination.legacy-forum-pagination")) return;

        const activeEl = modern.querySelector(".pagination-v2__link--active");
        const current = parseInt(activeEl?.textContent?.trim() || "1", 10);

        const pageLinks = [...modern.querySelectorAll("ul.pagination-v2__col--pages a.pagination-v2__link[href]")]
        .map(a => ({
            page: parseInt(a.textContent.trim(), 10),
            href: a.getAttribute("href")
        }))
        .filter(x => Number.isFinite(x.page) && x.href);

        const maxVisible = pageLinks.reduce((m, x) => Math.max(m, x.page), current);

        const prevHref = modern.querySelector(".pagination-v2__col:first-child a.pagination-v2__link--quick")?.getAttribute("href") || null;
        const nextHref = modern.querySelector(".pagination-v2__col:last-child a.pagination-v2__link--quick")?.getAttribute("href") || null;

        const prevDisabled = !!modern.querySelector(".pagination-v2__col:first-child .pagination-v2__link--disabled");
        const nextDisabled = !!modern.querySelector(".pagination-v2__col:last-child .pagination-v2__link--disabled");

        const pagesLiHtml = (() => {
            const last = pageLinks.reduce((m, x) => Math.max(m, x.page), current);

            const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

            const makeHref = (p) =>
            (pageLinks.find(x => x.page === p)?.href) || (() => {
                const u = new URL(location.href);
                u.searchParams.set("page", String(p));
                u.hash = "topics";
                return u.toString();
            })();

            const makeItem = (p) => {
                const href = makeHref(p);
                return (p === current)
                    ? `<li class="active"><span>${p}</span></li>`
                : `<li><a class="u-forum--link" href="${href}">${p}</a></li>`;
            };

            const dots = `<li><span>...</span></li>`;

            if (last <= 11) {
                return Array.from({ length: last }, (_, i) => makeItem(i + 1)).join("\n");
            }

            let start, end;

            if (current === 6) {
                start = 1;
                end = 10;
            } else if (current < 5) {

                start = 1;
                end = 4 + current;
            } else if (current === 5) {

                start = 1;
                end = 9;
            } else {

                start = current - 4;
                end = current + 4;
            }

            start = clamp(start, 1, last);
            end   = clamp(end, 1, last);

            const desired = (current === 6) ? 10 : (current <= 5 ? end : 9);

            if (current > 6) {
                const len = end - start + 1;
                if (len < 9) {
                    const need = 9 - len;
                    start = clamp(start - need, 1, last);
                }
            }

            const parts = [];

            if (start > 1) {
                parts.push(makeItem(1));
                if (start > 2) parts.push(dots);
            }

            for (let p = start; p <= end; p++) parts.push(makeItem(p));

            if (end < last) {
                if (end < last - 1) parts.push(dots);
                parts.push(makeItem(last));
            }

            return parts.join("\n");
        })();

        const legacy = document.createElement("nav");
        legacy.className = "forum-pagination legacy-forum-pagination";
        legacy.innerHTML = `
    <ul>
      ${pagesLiHtml}
    </ul>

    <ul class="forum-pagination-prevnext">
      <li>
        ${
        (prevDisabled || !prevHref)
            ? `<span><i class="fa fa-angle-left"></i>prev</span>`
        : `<a class="u-forum--link" href="${prevHref}"><i class="fa fa-angle-left"></i>prev</a>`
    }
      </li>
      <li>
        ${
        (nextDisabled || !nextHref)
            ? `<span>next<i class="fa fa-angle-right"></i></span>`
        : `<a class="u-forum--link" href="${nextHref}">next<i class="fa fa-angle-right"></i></a>`
    }
      </li>
    </ul>
  `;

        modern.parentElement?.insertBefore(legacy, modern);
    };

    const escapeHtml = (s) =>
    (s ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

    const buildLegacySubforums = (root = document) => {

        root.querySelectorAll(".forum-list").forEach(list => {
            const ul = list.querySelector(":scope > ul.forum-list__items");
            if (!ul) return;

            const items = ul.querySelectorAll(":scope > li.forum-item");
            if (!items.length) return;

            if (list.querySelector(":scope > ul.forums.legacy-forums")) return;

            list.classList.add("legacy-subforums");

            const legacyUl = document.createElement("ul");
            legacyUl.className = "forums legacy-forums";

            items.forEach(item => {
                const nameA = item.querySelector(".forum-item__name");
                const desc = item.querySelector(".forum-item__description");

                const latestA = item.querySelector(".forum-item__latest-post a.u-ellipsis-overflow");
                const timeEl = item.querySelector(".forum-item__latest-post time");
                const userA = item.querySelector(".forum-item__latest-post a.js-usercard");

                const subforumLinks = [...item.querySelectorAll(".forum-item__subforums a[href]")];

                const forumHref = nameA?.getAttribute("href") || "#";
                const forumName = nameA?.textContent?.trim() || "";
                const forumDesc = desc?.textContent?.trim() || "";

                const lastHref = latestA?.getAttribute("href") || forumHref;
                const lastTitle = latestA?.textContent?.trim() || "";
                const timeText = timeEl?.textContent?.trim() || "";
                const timeDt = timeEl?.getAttribute("datetime") || "";

                const userHref = userA?.getAttribute("href") || "#";
                const userName = userA?.textContent?.trim() || "";

                const metaDiv = item.querySelector(".forum-item__latest-post > div");

                let byWord = "";
                if (metaDiv && timeEl && userA) {
                    const nodes = [...metaDiv.childNodes];
                    const iTime = nodes.indexOf(timeEl);
                    const iUser = nodes.indexOf(userA);

                    if (iTime !== -1 && iUser !== -1 && iUser > iTime) {
                        byWord = nodes
                            .slice(iTime + 1, iUser)
                            .filter(n => n.nodeType === Node.TEXT_NODE)
                            .map(n => n.textContent)
                            .join("")
                            .trim();
                    }
                }

                const subforumsHtml = subforumLinks.length
                ? `<ul class="subforums">
            ${subforumLinks.map(a => {
                const t = a.getAttribute("title") || "";
                const h = a.getAttribute("href") || "#";
                const n = a.textContent.trim();
                return `<li>
                <a class="name u-forum--link" href="${escapeHtml(h)}" title="${escapeHtml(t)}">
                  <i class="fa fa-bars"></i>${escapeHtml(n)}
                </a>
              </li>`;
            }).join("")}
          </ul>`
                : `<ul class="subforums"></ul>`;

                const li = document.createElement("li");
                li.className = "forums__forum clickable-row u-forum--hover-area";

                li.innerHTML = `
        <div class="forums__hover-bar hidden-xs">
          <div class="forums__colour-stripe u-forum--bg"></div>
          <div class="forums__hover-bar-icon"><i class="fa fa-angle-right"></i></div>
        </div>

        <div class="left">
          <a class="name clickable-row-link u-forum--hover-target u-forum--link" href="${escapeHtml(forumHref)}">
            ${escapeHtml(forumName)}
          </a>
          <div class="description">${escapeHtml(forumDesc)}</div>
          ${subforumsHtml}
        </div>

<div class="right hidden-xs">
  <div class="right-content">
    <a class="legacy-last-title clickable-row-link" href="${escapeHtml(lastHref)}">
      ${escapeHtml(lastTitle)}
    </a>

<div class="legacy-last-meta">
<time class="legacy-last-time timeago" datetime="${escapeHtml(timeDt)}">${escapeHtml(timeText)}</time>
${escapeHtml(" " + byWord + " ")}
<a class="legacy-last-user js-usercard" href="${escapeHtml(userHref)}">${escapeHtml(userName)}</a>
</div>
  </div>
</div>

      `;

                const right = li.querySelector(".right");
                const rightContent = li.querySelector(".right-content");
                const titleLink = li.querySelector(".last-post a.u-forum--link.title");
                const when = li.querySelector(".when-post");

                if (right) {
                    right.style.setProperty("display", "flex", "important");
                    right.style.setProperty("align-items", "center", "important");
                    right.style.setProperty("justify-content", "flex-end", "important");
                }

                if (rightContent) {
                    rightContent.style.setProperty("display", "flex", "important");
                    rightContent.style.setProperty("flex-direction", "column", "important");
                    rightContent.style.setProperty("justify-content", "center", "important");
                    rightContent.style.setProperty("gap", "2px", "important");

                    rightContent.style.setProperty("background", "transparent", "important");
                    rightContent.style.setProperty("background-image", "none", "important");
                    rightContent.style.setProperty("box-shadow", "none", "important");
                    rightContent.style.setProperty("border", "0", "important");
                }

                const killDecor = (el) => {
                    if (!el) return;
                    el.style.setProperty("background", "transparent", "important");
                    el.style.setProperty("background-image", "none", "important");
                    el.style.setProperty("box-shadow", "none", "important");
                    el.style.setProperty("border", "0", "important");
                    el.style.setProperty("outline", "0", "important");
                    el.style.setProperty("text-decoration", "none", "important");
                };

                killDecor(titleLink);
                killDecor(when);

                legacyUl.appendChild(li);
            });

            const h2 = list.querySelector(":scope > h2.title--forum");
            if (h2 && h2.nextSibling) {
                h2.parentNode.insertBefore(legacyUl, h2.nextSibling);
            } else {
                list.appendChild(legacyUl);
            }
        });
    };

    const removeLegacySubforums = (root = document) => {
        root.querySelectorAll("ul.forums.legacy-forums").forEach(el => el.remove());
        root.querySelectorAll(".forum-list.legacy-subforums").forEach(el => el.classList.remove("legacy-subforums"));
    };

    markLocked();
    markImportantTriangles();
    applyUserColors();
    fixLowContrastBBCodeColors();

    applyLegacyUserTints();

    applyRoleStripes();

    replaceCountryFlagsWithLegacy();

    ensureLegacyAvatarWhiteOverlay();

    applySupporterAvatarOverlays();

    removePostHighlight();

    buildLegacyPagination();

    buildLegacySubforums();

    injectCreateTopicRow();

    removeForumExtras();

    scheduleLegacyHeaderSync();

    window.addEventListener("resize", scheduleLegacyHeaderSync);

    const mo = new MutationObserver(muts => {
        let sawSomething = false;

        for (const m of muts) {
            for (const n of m.addedNodes) {
                if (n.nodeType === 1) {
                    removePostHighlight(n);
                    sawSomething = true;

                    if (n.matches?.(".forum-post-info")) {
                        postInfoResizeObserver.observe(n);
                    }
                    if (n.querySelectorAll) {
                        n.querySelectorAll(".forum-post-info").forEach(el => postInfoResizeObserver.observe(el));
                    }

                    if (n.matches?.(".forum-topic-entry")) {
                        const ctx = n.parentNode || document;
                        markLocked(ctx);
                        markImportantTriangles(ctx);
                        applyUserColors(ctx);
                        applyLegacyUserTints(ctx);
                        applyRoleStripes(ctx);
                        ensureLegacyAvatarWhiteOverlay(ctx);
                        applySupporterAvatarOverlays(ctx);
                        injectCreateTopicRow(ctx);
                        buildLegacySubforums(ctx);
                        buildLegacyPagination(ctx);

                        syncLegacyPostInfoAvatarSizes(document);
                    } else {
                        markLocked(n);
                        markImportantTriangles(n);
                        applyUserColors(n);
                        applyLegacyUserTints(n);
                        applyRoleStripes(n);
                        ensureLegacyAvatarWhiteOverlay(n);
                        applySupporterAvatarOverlays(n);
                        ensureBannedAvatarPlaceholders(n);
                        injectCreateTopicRow(n);
                        removeForumExtras(n);
                        buildLegacySubforums(n);
                        buildLegacyPagination(n);
                        fixLowContrastBBCodeColors(n);
                        syncLegacyAvatarNames(n);
                        replaceCountryFlagsWithLegacy(n);

                        syncLegacyPostInfoAvatarSizes(document);
                    }
                }
            }
        }

        if (sawSomething) {
            requestAnimationFrame(() => syncLegacyPostInfoAvatarSizes(document));
            setTimeout(() => syncLegacyPostInfoAvatarSizes(document), 50);
            setTimeout(() => syncLegacyPostInfoAvatarSizes(document), 250);
        }

        requestAnimationFrame(legacyApplyLoadMoreFix);

        requestAnimationFrame(() => {
            markThreadHeaders(document);
            ensureThreadPollWrapAndMove();
        });

        scheduleSupporterRescan();
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });

    const onUrlChange = () => {

        const forumId = getForumIdFromUrl();
        if (forumId) setLegacyHeaderImageForForum(forumId);

        removeCreateTopicRow(document);
        injectCreateTopicRow(document);
        removeForumExtras(document);

        scheduleLegacyHeaderSync();

        ensureThreadBannerInFlow();

        syncThreadCrumbBannerImage();
        setTimeout(syncThreadCrumbBannerImage, 50);
        setTimeout(syncThreadCrumbBannerImage, 250);

        markThreadHeaders(document);
        ensureThreadPollWrapAndMove();
        setTimeout(ensureThreadPollWrapAndMove, 50);
        setTimeout(ensureThreadPollWrapAndMove, 250);

        syncLegacyPostInfoAvatarSizes(document);
        setTimeout(() => syncLegacyPostInfoAvatarSizes(document), 50);
        setTimeout(() => syncLegacyPostInfoAvatarSizes(document), 250);

        ensureBannedAvatarPlaceholders(document);
        setTimeout(() => ensureBannedAvatarPlaceholders(document), 250);

        removeLegacySubforums(document);
        buildLegacySubforums(document);
        setTimeout(() => buildLegacySubforums(document), 250);

        removeLegacyPagination(document);
        buildLegacyPagination(document);
        setTimeout(() => buildLegacyPagination(document), 250);

        applySupporterAvatarOverlays(document);
        setTimeout(() => applySupporterAvatarOverlays(document), 250);

        markLocked(document);
        markImportantTriangles(document);
        applyUserColors(document);
        applyLegacyUserTints(document);
        applyRoleStripes(document);
        ensureLegacyAvatarWhiteOverlay(document);

        removePostHighlight(document);

        setTimeout(() => injectCreateTopicRow(document), 50);
        setTimeout(() => injectCreateTopicRow(document), 250);
        setTimeout(() => removeForumExtras(document), 250);
        setTimeout(() => markImportantTriangles(document), 250);

        fixLowContrastBBCodeColors(document);
        setTimeout(() => fixLowContrastBBCodeColors(document), 250);
    };

    (() => {
        const fire = () => window.dispatchEvent(new Event("legacy:urlchange"));

        const _pushState = history.pushState;
        history.pushState = function () {
            _pushState.apply(this, arguments);
            fire();
        };

        const _replaceState = history.replaceState;
        history.replaceState = function () {
            _replaceState.apply(this, arguments);
            fire();
        };

        window.addEventListener("popstate", fire);
        window.addEventListener("legacy:urlchange", onUrlChange);
        window.addEventListener("turbo:load", onUrlChange);
        window.addEventListener("turbo:render", onUrlChange);
        scheduleLegacyHeaderSync();
    })();

})();
