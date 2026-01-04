// ==UserScript==
// @name Newspaper
// @namespace https://greasyfork.org/users/1076667
// @version 0.0.1.20251203112504
// @description A CSS stylesheet of Userscript Newspaper.
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/557778/Newspaper.user.js
// @updateURL https://update.greasyfork.org/scripts/557778/Newspaper.meta.js
// ==/UserScript==

(function() {
let css = `img, svg {
  /* border: 4px solid #555; */
  border-radius: 0.5em;
  /* margin: 1.5em !important; */
  margin-top: 0 !important;
  /* display: block; */
  object-fit: scale-down;
  max-height: 20em;
  max-width: 100%;
  /* min-width: 96%; */
}

iframe, video {
  border-radius: 0.5em;
  /* height: 100%; */
  min-height: 70vh;
  outline: none;
  width: 100%; /* 96% */
}

code, pre {
  background: #555;
  border-radius: 4px;
  color: #f5f5f5;
  max-height: 100%;
  max-width: 100%;
  overflow: auto;
}

#webring {
  background: floralwhite;
  border-radius: 9px;
  padding: 2px;
}

html, body {
  margin: 0;
  overflow-x: hidden;
  padding: 0;
}

body {
  hyphens: auto;
  /* font-family: serif; */
  margin: auto;
  max-width: 1200px;
}

a,
body,
.about-newspaper #buttons-custom {
  color: #333;
}

#articles > .entry p {
  margin-right: 10px;
  margin-left: 10px;
  padding-right: 10px;
  padding-left: 10px;
}

#title { /* TODO tag </title-page> */
  border-bottom: 1px solid;
  width: 90%;
  margin: auto;
  margin-top: 1em;
  font-variant: small-caps;
  text-align: center;
  font-weight: bold;
  font-size: 3em;
  overflow: hidden;
}

#title .empty:before {
  content: "StreamBurner News Dashboard";
  font-variant: small-caps;
  text-align: center;
}

#subtitle {
  /* border-top: 1px solid; */
  font-size: 1.5em;
  font-variant: all-small-caps;
  font-weight: normal;
  margin: auto;
  overflow: hidden;
  text-align: center;
  width: 90%;
  white-space: wrap;
}

#summary:before {
  content: "Preamble: ";
  font-weight: bold;
}

#summary {
  line-height: 1.8;
  margin: 1em auto;
  text-align: justify;
  width: 90%;
}

.container {
  display: flex;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-help {
  cursor: help;
}

#toc {
  margin-left: 5%;
  margin-right: 5%;
  padding: 5px;
  padding-bottom: 3.785em;
  padding-top: 3.5em;
}

#toc:before {
  content: "List of entries";
}

#toc > a,
#toc:before {
  content: "List of entries";
  /* font-size: 76%; */
  font-weight: bold;
}

#toc li:first-child,
#toc > a {
  margin-top: 1em;
}

#toc a {
  cursor: pointer;
  /* font-size: 66%; */
  display: block;
  outline: none;
  padding: 5px 0;
  margin-left: 1%;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  /* display: list-item; */
}

/*
#toc a:hover {
  overflow: unset;
  white-space: break-spaces;
*/

/* 
#toc a:hover {
  white-space: unset;
  text-decoration: underline;
}
*/

#toc a:visited {
  text-decoration: line-through;
}

/*
#toc a:first-child {
  margin-top: 1em;
}

#toc a:hover {
  text-decoration: underline;
}

#toc a:visited {
  text-decoration: line-through;
}
*/

a.expand {
  cursor: pointer;
  display: block;
  font-weight: bold;
  margin-top: 1em;
}

.about-newspaper { /* overlay */
  font-family: system-ui;
  font-style: initial;
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: #f5f5f5;
  background-color: #555;
  /* background-color: #ffff9b; */
  z-index: 2;
  overflow-y: auto;
  text-align: left; /* justify */
  direction: ltr;
  padding: 5%;
  line-height: 1.8;
  font-size: 110%;
  cursor: unset;
}

.about-newspaper div {
  margin-bottom: 1em;
}

body.dark,
a.dark,
code.dark,
.enclosures.dark,
.resources.dark,
#empty-feed.dark,
.about-newspaper a,
.about-newspaper span {
  color: #f5f5f5;
}

#urgent-message a.dark {
  color: unset;
}

body,
#control-bar #about-help,
#control-bar #about-settings,
.about-newspaper .filter,
.about-newspaper #buttons-custom,
.about-newspaper #xslt > svg {
  background: #f5f5f5; /* #f4ffce; */
}

.feed-url,
.feed-category,
.category a,
.subcategory a {
  text-decoration: none;
}

.category a:hover,
.subcategory a:hover {
  text-decoration: underline;
}

/* idiomdrottning.org */
footer a:visited {
  color: unset;
}

.about-newspaper #buttons-custom {
  margin: auto;
  margin-top: 1em;
  outline: 0.01em solid;
  /* outline-color: #333; */
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: block;
  font-size: smaller;
  direction: ltr;
}

.about-newspaper #buttons-custom > span {
  outline: none;
  min-width: 12%;
  padding: 6px;
  margin: 6px;
  /* font-family: system-ui; */ }

.quote {
  margin: auto;
  padding: 3em;
  max-width: 75%;
}

#feed-quote,
.about-newspaper .quote {
  text-align: center; /* right */
  font-size: 85%;
  font-style: italic;
}

#feed-quote {
  font-size: 85%;
  margin-bottom: 35px;
}

#feed-quote:after {
  content: "· · • · ·";
}

.about-newspaper .text-icon {
  font-weight: bold;
  border-radius: 11px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 5px;
  padding-left: 5px;
}

.about-newspaper .orange {
  background: darkorange;
}

.about-newspaper #torrents {
  outline: none;
}

.about-newspaper #services > a:after,
.category > a:after,
.subcategory > a:after {
  content: ", ";
}

.about-newspaper #services > a:last-child:after,
.category > a:last-child:after,
.subcategory > a:last-child:after {
  content: ".";
}

.about-newspaper #filter {
  /* margin-right: auto;
  margin-left: auto; */
  margin-top: 25px;
}

.about-newspaper .filter {
  font-weight: bold;
  outline: none;
  border-bottom: 2px solid #f5f5f5;
  color: #555;
  border-radius: 5%;
  /* border-bottom-right-radius: unset; */
  /* border-bottom-left-radius: unset; */
  margin-right: 15px;
  padding: 5px;
  width: 10%;
  cursor: pointer;
}

.about-newspaper .center {
  text-align: center;
}

.about-newspaper .background {
  background: #838383;
  border-radius: 1em;
  padding: 1em;
}

.about-newspaper .hide {
  display: none;
}

.about-newspaper .grey {
  background: inherit;
  color: inherit;
}

/*
.about-newspaper .recom {
  filter: drop-shadow(2px 4px 6px pink);
}
*/

#software .recom:before {
  font-size: 80%;
  content: "🔖 ";
}

#journal .recom:after,
#services-publish .recom:after {
  font-size: 80%;
  content: "🔖 ";
}

.about-newspaper .category > div:first-child {
  font-size: 110%;
  font-weight: bold;
  margin-top: 25px;
}

.about-newspaper .subcategory > div {
  font-weight: bold;
  /* text-decoration: underline; */ }

.about-newspaper .subcategory > div:before {
  content: "* ";
}

.about-newspaper #postscript + div p {
  font-style: italic;
}

/*
#feeds > div.content a:link {
  text-decoration: none;
}
*/

#services-feed a {
  text-decoration: none;
}

#feeds > div.content .category a:before,
#services-feed a:before {
  font-size: 80%;
  content: "🏷️ ";
} /* 🧧 🔗 */

#articles {
  justify-content: space-between;
  max-width: 90%;
  margin: 0 auto;
  padding: 10px 0;
}

/*
.about-newspaper {
  margin: auto;
  max-height: 70vh;
  max-width: 1000px;
}
*/

#feed,
.about-newspaper > .document {
  margin: auto;
  max-width: 1000px;
}

#articles > .entry {
  vertical-align: top;
  white-space: normal;
}

#articles > .entry {
   /*border-bottom: inset;
  border-bottom: groove; */
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
  line-height: 1.6;
  /* font-size: 85%; */
  /* overflow-x: hidden; */
  max-width: 98%;
  /* outline: auto; */
  outline: none;
  padding: 4px;
  padding-top: 3.785em;
  /* overflow-wrap: break-word; */
  word-break: break-word;
}

#articles > .entry:last-child {
  border-bottom: unset;
}

/*
#articles > .entry:hover {
  background: #f8f9fa;
  outline: none;
}
*/

#articles > .entry > a {
  white-space: normal;
}

#articles > .entry > audio {
  width: 100%;
}

.decor {
  /* border-top: inset; */
  /* border-top: groove;
  width: 30%; */
  /* padding-right: 30%;
  padding-left: 30%; */
  margin-right: 30% !important;
  margin-left: 30% !important;
  padding-top: 1.5em !important;
  padding-bottom: 1.5em !important;
  text-align: center;
  /* text-decoration: overline; */
  display: block;
}

.decor:after {
  /* content: "∽ ✦ ∼" */
  /* content: "· · ✦ · ·"; */
  content: "· · • · ·";
} /* ✦ ✧ ۞ ⍟ ⍣ ✹ ✸ ✴ ✶ ✵ ✷ */

.title {
  cursor: pointer;
  font-size: 120%;
  font-weight: bold;
  text-decoration: underline;
  overflow-wrap: anywhere;
  /* overflow: visible;
  text-overflow: ellipsis;
  font-variant: small-caps; */
  margin: 0;
}

.title > a {
  display: block;
}

/*
.title > a {
  text-decoration: none;
}

.title > a:hover {
  text-decoration: underline;
}
*/

#feed .geolocation > a {
  text-decoration: none;
  padding-left: 6px;
}

#feed .authors,
#feed .categories {
  padding: 1em;
}

#feed .author,
#feed .category {
  /* font-size: 75%; */
  font-weight: bold;
  margin: 0 auto 0 auto;
  text-decoration: none;
}

#feed .author:after,
#feed .category:after {
  content: ", ";
}

#feed .author:last-child:after,
#feed .category:last-child:after {
  content: ".";
}

.published, .updated {
  /* font-size: 75%; */
  margin: 0 auto 0 auto;
  /* direction: ltr; */ }

.content {
  inline-size: 95%;
  line-height: 2em;
  margin: 15px auto 15px 1%;
  text-indent: 3px;
}

.content.text {
  white-space: pre-wrap;
}

.content[type="text"] {
  font-family: monospace;
}

/*
.content * {
  height: auto;
  object-fit: contain;
}
*/

#logo {
  text-align: center;
  /* transform: translateY(-6em); */
}

#logo img {
  background: #f5f5f5;
  /* border-radius: 3em; */
  filter: drop-shadow(2px 4px 6px pink);
  height: 5em;
  object-fit: contain;
  outline: auto;
  /* padding: 0.3em; */
  width: 5em;
}

.enclosures {
  cursor: help;
}

.enclosures,
.resources {
  background: #eee;
  border: 1px solid GrayText;
  border-radius: 4px;
  clear: both;
  color: #525c66;
  direction: ltr;
  font-size: 90%;
  margin: 1em;
  /* margin: 5px auto 15px 1%; */
  padding: 15px;
  vertical-align: middle;
  /* border: 1px solid #aaa; */
  border-radius: .5em;
  max-width: 100%;
  border-left: double;
  padding: 1em;
}

.enclosure,
.related {
  margin: 0.5em;
}

.enclosure > a,
.related > a {
  display: inline-flex;
  overflow: hidden;
  /* text-overflow: ellipsis; */
  text-decoration: none;
  /* white-space: nowrap; */
  width: 64%;
}

.enclosure > a:hover,
.related > a:hover {
  text-decoration: underline;
}

.enclosure > *,
.related > * {
  margin: 3px;
  white-space: nowrap;
}

.enclosure:after {
  content: " (Document file) ";
}

.enclosure:before,
.related:before {
  content: "📄️";
  margin: 3px;
}

.enclosure[type*="metalink"]:after{
  content: " (Metalink file) ";
}

.enclosure[type*="metalink"]:before {
  content: "♾️";
  margin: 3px;
}

.enclosure[type*="executable"]:after{
  content: " (Executable file) ";
}

.enclosure[type*="executable"]:before {
  content: "⚙️";
  margin: 3px;
}

.enclosure[type*="image"]:after {
  content: " (Image file) ";
}

.enclosure[type*="image"]:before {
  content: "🖼️";
  margin: 3px;
}

.enclosure[type*="audio"]:after {
  content: " (Audio file) ";
}

.enclosure[type*="audio"]:before {
  content: "🎙";
  margin: 3px;
}

.enclosure[type*="video"]:after {
  content: " (Video file) ";
}

.enclosure[type*="video"]:before {
  content: "📽️";
  margin:3px;
}

.enclosure[type*="atom"]:before {
  content: "📰";
  margin:3px;
}

.enclosure[type*="html5"]:before {
  content: "📰";
  margin:3px;
}

.enclosure[type*="rss"]:before {
  content: "📰";
  margin:3px;
}

.notice {
  text-align: center;
  display: block;
  /* font-size: 130%; */
  /* font-weight: lighter; */
  font-variant-caps: all-small-caps;
  color: FireBrick;
}

.warning {
  display: block;
  font-size: 85%; /* 60 */
  font-weight: bold;
  color: DarkRed;
}

.atom1.author:after {
  content: "Atom 1.0 Warning: Element </author> is missing";
}

.atom1.id:after {
  content: "Atom 1.0 Warning: Element </id> is missing";
}

.atom1.link:after {
  content: "Atom 1.0 Warning: Element </link> is missing";
}

.atom1.published:after {
  content: "Atom 1.0 Warning: Element </published> is missing";
}

.atom1.title:after {
  content: "Atom 1.0 Warning: Element </title> is missing";
}

.rss2.description:after {
  content: "RSS 2.0 Warning: Element </description> is missing";
}

.rss2.link:after {
  content: "RSS 2.0 Warning: Element </link> is missing";
}

.rss2.title:after {
  content: "RSS 2.0 Warning: Element </title> is missing";
}

abbr,acronym {
  border-bottom: 1px dotted #c30;
}

dt {
  font-weight: bold;
}

#about-toc {
  display: grid;
  /* border-bottom: inset;
  text-align: right;
  width: 70%;
  margin-left: 30%; */ }

#about-toc li > a,
#feeds li a {
  /* display: list-item; */
  display: block;
}

#about-toc > li > a {
  text-decoration: none;
}

#about-toc > li > a:hover {
  text-decoration: underline;
}

#empty-feed h3 {
  font-size: 135%;
}

#empty-feed p {
  font-size: 120%;
}

#empty-feed a {
  font-size: 100%;
}

#empty-feed {
  direction: ltr;
  width: 75%;
  max-width: 850px;
  margin: 3em auto;
}

#empty-feed .subject,
.about-newspaper .subject {
  font-size: 130%;
  font-weight: bold;
  padding-bottom: 5px;
  display: block;
}

.about-newspaper .subtitle {
  font-weight: bold;
  /* font-style: italic; */
  font-size: 110%;
}

.about-newspaper .cyan {
  font-weight: bold;
  color: cyan;
}

.about-newspaper .content {
  margin-bottom: 3em;
  white-space: unset;
}

.about-newspaper .orange-color {
  color: orange;
  margin-right: 5px;
}

.about-newspaper .red-color {
  color: red;
}

.about-newspaper .cyan-color {
  color: cyan;
}

.about-newspaper .lizard {
  filter: hue-rotate(250deg);
}

.about-newspaper .redice {
  filter: hue-rotate(170deg);
}

.about-newspaper #private {
  font-style: italic;
}

#info-square.dark {
  filter: drop-shadow(1px -10px 30px pink);
}

#info-square {
  filter: drop-shadow(1px -10px 30px grey);
}

#info-square {
  direction: ltr;
  position: fixed;
  margin: auto;
  bottom: 0;
  right: 0;
  left: 0;
  /* top: 33px; */
  padding: 5px;
  color: #f5f5f5;
  background: #555;
  /* border-radius: 50px; */
  /* width: 50%; */
  font-size: 85%;
  /* font-style: italic; */
  font-family: system-ui;
  /* justify-content: center; */
  align-items: center;
  display: flex;
  text-overflow: ellipsis;
  outline: 0.01em solid;
  overflow: hidden;
  /* white-space: pre; in case we have html tags */
  white-space: nowrap;
}

#info-square > * {
  color: #f5f5f5;
  font-size: 85%;
  margin-left : 0.5em;
  margin-right : 0.5em;
}

#top-navigation-button {
  text-decoration: none;
  /* set position */
  position : fixed;
  bottom : 1em;
  right : 2em;
  z-index : 1;
  /* set appearance */
  background : #f5f5f5;
  color: #555;
  border : 2px solid #555;
  border-radius : 50px;
  /* margin : 10px; */
  min-width : 30px;
  min-height : 30px;
  /* font-size : 1.1em; */
  /* opacity : 0.3; */
  /* center character */
  padding: 0.3em;
  justify-content: center;
  align-items : center;
  display : none;
  /* disable selection marks */
  outline : none;
  /* cursor : default;
  transform: rotate(-90deg) scale(1, -1); */ }

/*
#page-settings button,
#page-settings input,
#page-settings label {
  padding: 5px;
}
*/

#page-settings #keywords-blacklist-current span:after,
#page-settings #keywords-whitelist-current span:after {
  content: ", ";
}

#page-settings td {
  vertical-align: initial;
}

#email-link {
  display: block;
  margin-top: 3em;
  text-decoration: overline;
  outline: none;
}

#feed-banner {
  outline: none;
  display: table;
  margin: auto;
  /* filter: drop-shadow(2px 4px 6px black); */ }

.about-newspaper #buttons {
  text-align: center;
}

#articles-filtered {
  background: #166c23;
}

#petition-alert {
  background: blueviolet;
}

#feature-limited {
  background: indianred;
}

#not-well-formed {
  background: dimgrey; /* #449 */
}

#atom-message {
  background: royalblue;
  text-decoration: none;
}

#xslt-message {
  background: darkgoldenrod; /* coral royalblue #2c3e50 */
  cursor: pointer;
}

#you-are-not-supposed-to-be-here {
  background: #130200;
  color: #be3a1b;
  font-weight: bold;
  /* overflow: hidden;
  text-overflow: ellipsis; */
  white-space: nowrap;
}

.infobar-message {
  color: white; /* #eee navajowhite */
  direction: ltr;
  display: block;
  font-family: system-ui;
  /* height: 50px; */
  line-height: 50px;
  padding: 0.3em;
  text-align: center; /* justify */
}

.infobar-message:last-child {
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
}

/*
#infobar-messages {
  left: 0;
  position: absolute;
  right: 0;
}
*/

body.dark {
  background: #444;
}

#feed code.dark,
.enclosures.dark,
.resources.dark {
  background: #555;
}

::selection {
  color: #000;
  background: #d3d3d3;
}

th {
  text-align: start;
}

tr > * {
  min-width: 150px;
  padding: 0.5em;
}

#feed-info {
  border-bottom: 1px solid;
  width: 90%;
  margin: auto;
  font-size: 90%;
  padding: 3px;
  /* margin: 3px; */
  margin-top: 3em;
  text-align: center;
}

body > footer {
  direction: ltr;
  display: block;
  /* font-family: system-ui; */
  font-size: 90%;
  /* font-weight: lighter; */
  margin: auto;
  text-align: center;
  width: 96%;
  }

body > footer > *,
body > footer > *:hover {
  display: inline-flex;
  justify-content: center;
  text-decoration: unset;
  /* min-width: 100px; */
  color: unset;
  margin: 5px;
  }
/*
body > footer > *:after {
  content: "|";
  margin-left: inherit;
  }

body > footer > *:last-child:after {
  content: "";
  }
*/
placeholder {
  display: block;
  margin-bottom: 3em;
  }

body > footer,
details > summary,
.about-newspaper #buttons-custom > span,
.about-newspaper #buttons-custom,
.about-newspaper #buttons,
.about-newspaper .text-icon,
.about-newspaper .filter,
.decor,
.infobar-message,
#webring,
#control-bar *,
#top-navigation-button,
#page-settings {
  user-select: none;
}

#top-navigation-button {
  display: flex;
}

#control-bar-container.dark {
  filter: drop-shadow(1px 10px 30px pink);
}

#control-bar a {
  color: #f5f5f5;
  /* font-style: italic; */
  font-family: system-ui;
  /* NOTE Should not this be max-width? */
  /* min-width: 100px; */
  margin: 6px;
}

#control-bar-container {
  background: #555; /* #eee */
  filter: drop-shadow(1px 10px 30px grey);
  left: 0;
  position: fixed;
  right: 0;
  z-index: 1;
}

#control-bar {
  color: #f5f5f5;
  cursor: default;
  direction: ltr;
  display: block;
  font-family: system-ui;
  height: 50px;
  margin: auto;
  max-width: 1200px;
  padding: 0.3em;
  text-align: center;
  white-space: nowrap;
  /* scrollbar-width: none; Gecko */
  /* -ms-overflow-style: none;  Edge */
}

/* Falkon and Otter */
#control-bar::-webkit-scrollbar {
  display: none;
}

#control-bar * {
  text-decoration: none;
  font-size: 85%;
  outline: none;
  /* min-width: 12%; */
  padding: 6px;
  /* font-family: system-ui; */
  white-space: nowrap;
  /* margin: 20px; */
  margin: 6px;
  /* min-width: unset; */
  display: inline-block;
  /* margin-right: 5px; */
  /* margin-left: 5px; */
  padding-right: 5px;
  padding-left: 5px;
  min-width: 4%;
}

#control-bar *:hover {
  opacity: 0.9;
}

#control-bar #homepage-link,
#control-bar #subscribe-link {
  border-left-style: solid;
  border-radius: 0.5em; /* 2em 40% */
  border-right-style: solid;
  /* color: #f5f5f5; */
  font-weight: 900;
  cursor: pointer;
  border-color: grey;
  width: 12%;
}

#control-bar #about-help,
#control-bar #about-settings {
  /* border-bottom: solid; */
  border-radius: 0.7em;
  border-color: grey;
  /* cursor: pointer; */ }

/* character ❱

#control-bar #nav-next {
  transform: rotate(90deg);
}

#control-bar #nav-previous {
  transform: rotate(-90deg);
  margin-left: unset;
}
*/

#control-bar #mode {
  transform: rotate(180deg);
}

/*
#control-bar #nav-next:after,
#control-bar #nav-previous:after {
  content: "";
  border: solid;
  padding: 5px;
  border-width: 1px 0 0 1px;
  position: absolute;
}

#control-bar #nav-next:after {
  transform: rotate(-135deg);
}

#control-bar #nav-previous:after {
  transform: rotate(45deg);
}

#control-bar #mode {
  filter: saturate(7);
}
*/

@media (max-width: 1350px) {
    #homepage-link,
    #subscribe-link {
      display: none;
    }
  }

@media (max-width: 800px) {
    #ace-link-next,
    #ace-link-prev {
      display: none;
    }

    #control-bar * {
      min-width: 5%;
    }
}

@media (max-width: 550px) {
    #control-bar #about-help {
      display: none;
    }

    #control-bar #about-settings {
      background: unset;
    }
  }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
