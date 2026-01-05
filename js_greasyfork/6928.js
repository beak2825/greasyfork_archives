//
// Written by Glenn Wiking
// Script Version: 1.3.0a
// Date of issue: 09/12/14
// Date of resolution: 11/12/14
//
// ==UserScript==
// @name        ShadeRoot WP
// @namespace   WP
// @description Eye-friendly magic in your browser for Wikipedia
// @version     1.3.0a
// @icon        https://i.imgur.com/ZPsnNvA.png

// @include        http://*.wikipedia.org*
// @include        https://*.wikipedia.org*
// @include        *.wiktionary.org*
// @include        http://*.wikiquote.org*
// @include        https://*.wikiquote.org*
// @include        http://*.wikibooks.org*
// @include        https://*.wikibooks.org*
// @include        http://*.wikisource.org*
// @include        https://*.wikisource.org*
// @include        http://*.wikinews.org*
// @include        https://*.wikinews.org*
// @include        http://*.wikiversity.org*
// @include        https://*.wikiversity.org*
// @include        http://*species.wikimedia.org*
// @include        https://*species.wikimedia.org*
// @include        http://*.mediawiki.org*
// @include        https://*.mediawiki.org*
// @include        http://*.wikidata.org*
// @include        https://*.wikidata.org*
// @include        http://*.wikipedia.org*
// @include        https://*.wikipedia.org*
// @include        http://*commons.wikimedia.org*
// @include        https://*commons.wikimedia.org*
// @include        http://*.wikivoyage.org*
// @include        https://*.wikivoyage.org*
// @include        http://*meta.wikimedia.org*
// @include        https://*meta.wikimedia.org*
// @include        http://*incubator.wikimedia.org*
// @include        https://*incubator.wikimedia.org*
// @include        http://*wikitech.wikimedia.org*
// @include        https://*wikitech.wikimedia.org*
// @include        http://*.wikimedia.org*
// @include        https://*.wikimedia.org*
// @include        http://*commons.wikimedia.org*
// @include        https://*commons.wikimedia.org*
// @include        *wikimediafoundation.org*
// @include        *wikimedia.myshopify.*

// @downloadURL https://update.greasyfork.org/scripts/6928/ShadeRoot%20WP.user.js
// @updateURL https://update.greasyfork.org/scripts/6928/ShadeRoot%20WP.meta.js
// ==/UserScript==

function ShadeRootWP(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootWP(
// ABSOLUTES
  'html, iframe html, body {background: rgba(63, 33, 33, 1) !important;}'
  +
  '*::-moz-selection {background-color: #6E170C;}'
// MOBILE
  +
  '.mw-ui-button {background: #6C2222 !important; border: 1px solid #871D1D !important;}'
  +
  '.last-modified-bar #mw-mf-last-modified {background-color: #4B1313 !important;}'
  +
  '#content {border-top: 1px solid #531414 !important;}'
  +
  '.client-use-basic-search .header .search, .client-nojs .header .search {border: 1px solid #6B1B1B !important;}'
// WIKIPEDIA
  +
  '.trreq, .trreq i, dd span i {background: #5C1111 !important;}'
  +
  'div#mw-head {background: rgba(63, 33, 33, 1) !important;}'
  +
  'div.vectorTabs li.selected a, div.vectorTabs li.selected a:visited {color: rgba(198, 170, 170, 1); background: rgba(138, 59, 59, 1) !important;}'
  +
  'div.vectorTabs ul li {background-image: none; background-color: rgba(138, 59, 59, 1) !important;}'
  +
  'div.vectorTabs ul li {background: #870A1D !important; background: -moz-linear-gradient(top, #870a1d 0%, #490f0e 100%) !important; background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#870a1d), color-stop(100%,#490f0e)) !important; background: -o-linear-gradient(top, #870a1d 0%, #490f0e 100%);}'
  +
  'div.vectorTabs span {opacity: 1;}'
  +
  'div.vectorTabs li a, div#simpleSearch, #p-search form, #p-search input, .mw-body {color: #EDD !important;}'
  +
  'div#simpleSearch {border: 1px solid rgba(128, 21, 21, 1); color: #000; background-color: rgba(120, 16, 16, 1);}'
  +
  'div#simpleSearch {background-image: none !important;}'
  +
  'div#mw-panel div.portal {background-image: none !important; border-top: 1px solid #600;}'
  +
  'div#mw-panel div.portal div.body ul li a {color: rgba(173, 38, 16, 1);}'
  +
  '.mw-body a {color: #BC412D;}'
  +
  'span i, .trreq i {rgb(62, 28, 23) !important;}'
  +
  '#mp-topbanner {background: none repeat scroll 0% 0% rgba(75, 61, 61, 1); border: 1px solid rgba(113, 53, 53, 1);}'
  +
  '#mp-left {background: none repeat scroll 0% 0% #4B3D3D !important;}'
  +
  '#mp-right {background: none repeat scroll 0% 0% rgba(60, 50, 49, 1) !important;}'
  +
  '#mp-bottom {background: none repeat scroll 0% 0% #392724 !important;}'
  +
  '.MainPageBG {border: 1px solid #411711; background: none repeat scroll 0% 0% #411711;}'
  +
  '.mw-body {background-color: rgba(39, 30, 30, 1); border-color: rgba(86, 30, 21, 1);}'
  +
  '#mp-tfp-h2 {background: none repeat scroll 0% 0% #4B221B; border: 1px solid #602319; color: #EDD;}'
  +
  'h1, h2, h3, h4, h5, h6 {border-bottom: 1px solid rgba(69, 12, 12, 1) !important; color: #EDD;}'
  +
  '.MainPageBG {border: 1px solid rgba(113, 23, 8, 1) !important; background: none repeat scroll 0% 0% rgba(72, 20, 11, 1) !important;}'
  +
  '#mp-topbanner {background: none repeat scroll 0% 0% #3F2121 !important; border: 1px solid rgba(87, 41, 41, 1) !important;}'
  +
  '#mp-tfa-h2, #mp-itn-h2, #mp-dyk-h2, #mp-otd-h2, #mp-tfp-h2 {background: none repeat scroll 0% 0% rgba(95, 23, 8, 1) !important; border: 1px solid rgba(63, 24, 17, 1) !important; color: #EDD !important;}'
  +
  '#autonym, .mw-body a.external, #footer-info a, #footer-places a, .mw-body a.extiw, .mw-body a.extiw:active, #metalink {color: rgba(177, 45, 23, 1) !important;}'
  +
  '#footer-info-copyright, #mp-dyk ul li, .mw-body p, .mw-body-content ul, .noprint, #mp-topbanner div, small, #mw-panel h3, .mw-search-formheader div.search-types ul li.current a {color: #EDD !important;}'
  +
  '.mw-ui-input {border: 1px solid rgba(92, 25, 25, 1) !important;}'
  +
  '.mw-ui-button.mw-ui-progressive:hover, .mw-ui-button.mw-ui-progressive:focus, .mw-ui-button.mw-ui-primary:hover, .mw-ui-button.mw-ui-primary:focus {border-bottom-color: rgba(204, 59, 42, 1) !important;}'
  +
  '.mw-ui-button.mw-ui-progressive, .mw-ui-button.mw-ui-primary {background: none repeat scroll 0% 0% rgba(164, 47, 21, 1) !important; border: 1px solid rgba(114, 30, 16, 1) !important;}'
  +
  '.mw-search-formheader {background-color: rgba(57, 24, 24, 1); border: 1px solid rgba(81, 10, 10, 1);}'
  +
  '.mw-search-result-data {color: rgba(128, 18, 0, 1) !important;}'
  +
  '.mw-ui-input:focus {box-shadow: 0.45em 0px 0px rgba(141, 36, 14, 1) inset !important;}'
  +
  'table.dmbox {border-top: 1px solid #450C0C !important; border-bottom: 1px solid #450C0C !important;}'
  +
  '#pt-createaccount a, #pt-login a, #bodyContent div.mw-number-text h3 {color: #EDD !important;}'
  +
  '.fancycaptcha-image-container {background: #271E1E !important;}'
  +
  '.fancycaptcha-wrapper {background-color: #271E1E !important;}'
  +
  '.fancycaptcha-image-container img, .bookshelf-container .bookend {opacity: .8;}'
  +
  '.mw-ui-button.mw-ui-constructive {background: none repeat scroll 0% 0% rgba(150, 39, 15, 1); border: 1px solid rgba(164, 53, 35, 1);}'
  +
  '#mw-page-base {background-image: linear-gradient(#3F2121 50%, #3F2121 100%); background-color: #3F2121;}'
  +
  '.mw-ui-checkbox:not(#noop) input[type="checkbox"] + label:before {background-color: #96270F; border: 1px solid rgba(66, 14, 14, 1);}'
  +
  '.link-box, .langlist div a, .langlist-large div a, .langlist a, .otherprojects-item a, #www-wikipedia-org div a {color: rgba(168, 24, 16, 1) !important;}'
  +
  'a:visited {color: rgba(148, 68, 58, 1) !important;}'
  +
  '.link-box em, .search-container label .language-search label {color: #EDD !important;}'
  +
  '.search-form fieldset {background-color: rgba(0, 0, 0, 0) !important; border: 1px solid rgba(104, 16, 16, 1) !important;}'
  +
  'hr {color: rgba(104, 17, 17, 1) !important; background-color: #681111 !important;}'
  +
  'div.thumbinner, #toc, .toc, .mw-warning, .mbox-small {border: 1px solid rgba(86, 16, 16, 1) !important; background-color: rgba(68, 27, 27, 1) !important;}'
  +
  'div.thumb .thumbimage {background-color: rgba(93, 9, 9, 1) !important;}'
  +
  '.noprint.portal.tright table {background: none repeat scroll 0% 0% #441B1B !important;}'
  +
  '.noprint.portal.tright {border: 1px solid #561010 !important;}'
  +
  '.thumbimage {border: 1px solid rgba(36, 11, 11, 1) !important; opacity: .85;}'
  +
  '.catlinks {border: 1px solid #561010 !important; background-color: #441B1B !important;}'
  +
  '.catlinks li {border-left: 1px solid rgba(119, 15, 15, 1) !important;}'
  +
  '.navbox, .navbox-subgroup {background: none repeat scroll 0% 0% #441B1B;}'
  +
  '.navbox {border: 1px solid #561010;}'
  +
  '.navbox th, .navbox-title, .navbox-abovebelow, th.navbox-group, .navbox-subgroup .navbox-title {background: none repeat scroll 0% 0% rgba(102, 25, 12, 1) !important;}'
  +
  '.navbox-list, .navbox-odd, .hlist {border-left-width: 0px !important;}'
  +
  '.navbox-even {background: none repeat scroll 0% 0% rgba(62, 51, 51, 1) !important;}'
  +
  '.navbox-title {background: none repeat scroll 0% 0% rgba(39, 24, 22, 1) !important;}'
  +
  'fieldset {border: 1px solid rgba(69, 15, 6, 1);}'
  +
  '.help-intro-sidetab, .help-intro-sidetab-active {border-left: 1em solid rgba(98, 24, 12, 1) !important;}'
  +
  '#mw-content-text.mw-content-ltr div table tbody tr td {border-right: 1px solid #450C0C !important;}'
  +
  '#mw-content-text.mw-content-ltr div table tbody {border: 1px solid rgba(44, 6, 6, 1) !important; box-shadow: 2px 2px 2px rgba(27, 9, 9, 1) !important;}'
  +
  '#pagehistory li {border: 1px solid rgba(56, 12, 12, 0.2) !important;}'
  +
  '#feedHeaderContainer {border: 1px solid rgba(113, 23, 23, 1); background-color: rgba(90, 34, 25, 1);}'
  +
  '.feedBackground {background-color: #5A2219 !important;}'
  +
  '#feedHeader, #feedBody {color: #EDD;}'
  +
  '#feedBody {background: none repeat scroll 0% 0% rgba(45, 17, 17, 1); border: 1px solid rgba(95, 8, 8, 1);}'
  +
  '.entry h3 a, .entry h3 a, a.new, .mw-redirect {color: rgba(143, 17, 17, 1);}'
  +
  '.mw-changeslist-legend {border: 1px solid #681111 !important;}'
  +
  '.wb-claimgrouplistview .wb-claimgrouplistview-groupname {background: none repeat scroll 0% 0% #441B1B;}'
  +
  '.wb-claimlistview > .wikibase-toolbar-wrapper {border-top: 1px dashed rgba(141, 18, 18, 1);}'
  +
  '.wb-claims .wb-claimlistview {background-color: rgba(108, 28, 28, 1) !important; border: 1px solid rgba(92, 13, 13, 1) !important;}'
  +
  '.wikibase-sitelinklistview .wikibase-sitelinkview-sitename {border-left: 1px solid rgba(96, 17, 17, 1) !important;}'
  +
  '.wikibase-sitelinklistview th {background-color: rgba(86, 26, 26, 1);}'
  +
  '.wikibase-sitelinklistview tbody td {background: none repeat scroll 0% 0% #452D2D;}'
  +
  '.wikibase-sitelinklistview td {border-top: 1px solid rgba(86, 17, 17, 1);}'
  +
  '.wikibase-sitelinklistview tbody tr:nth-child(2n) td {background: none repeat scroll 0% 0% rgba(56, 33, 33, 1);}'
  +
  '.wikibase-sitelinklistview tbody td.wikibase-sitelinkview-siteid {background: none repeat scroll 0% 0% #452D2D;}'
  +
  '.wikibase-sitelinklistview tbody tr:nth-child(2n) td.wikibase-sitelinkview-siteid {background: none repeat scroll 0% 0% #382121;}'
  +
  '.wikibase-sitelinklistview tfoot td.wikibase-sitelinklistview-placeholder {border-left: 1px solid rgba(92, 13, 13, 1);}'
  +
  '.wikibase-sitelinklistview td:last-child {border-right: 1px solid #5C0D0D;}'
  +
  '.wikibase-sitelinklistview {border-bottom: 1px solid #5C0D0D;}'
  +
  'pre, .mw-code {background-color: rgba(56, 18, 18, 1); border: 1px solid rgba(83, 8, 8, 1); color: #EDD;}'
  +
  '#donate-form-wrapper {background-color: rgba(47, 33, 31, 1) !important; border: 1px solid rgba(101, 23, 14, 1) !important;}'
  +
  '.dividing-line, #appeal-head {border-bottom: 1px solid rgba(110, 25, 11, 1) !important;}'
  +
  '#main_page_mp-mp tbody tr td div {background-color: rgba(42, 21, 21, 1) !important;}'
  +
  '#main_page_mp-mp tbody tr td table {background-color: rgba(56, 42, 40, 1) !important; border: 3px solid rgba(78, 22, 13, 1) !important;}'
  +
  '.bodySearchWrap input {background: none repeat scroll 0% 0% #433 !important; border: 1px solid #511 !important; color: #EDD !important;}'
  +
  '#mf-wotd table, .mp-index {border: 3px solid #4E160D !important; background: none repeat scroll 0% 0% #382A28 !important;}'
  +
  '#main_page_mp-mp tbody tr td {border: 1px solid rgba(86, 20, 20, 1) !important; background-color: rgba(63, 45, 45, 1) !important;}'
  +
  '#mf-wotd table tbody tr td div, #main_page_mp-mp tbody tr td table tbody tr td div div, .mp-index div:nth-of-type(1) {border-bottom: 1px solid rgba(35, 11, 11, 1) !important;}'
  +
  'table.prettytable th {background: none repeat scroll 0% 0% rgba(47, 23, 23, 1) !important;}'
  +
  'table.prettytable {background: none repeat scroll 0% 0% rgba(59, 44, 44, 1) !important; border: 1px solid rgba(78, 23, 23, 1) !important;}'
  +
  'table.prettytable th, table.prettytable td {border: 1px solid rgba(84, 17, 17, 1) !important;}'
  +
  '.editOptions {background-color: rgba(47, 30, 30, 1) !important; border-color: -moz-use-text-color rgba(108, 15, 15, 1) rgba(92, 13, 13, 1) !important; -webkit-use-text-color rgba(108, 15, 15, 1) rgba(92, 13, 13, 1) !important; -o-use-text-color rgba(108, 15, 15, 1) rgba(92, 13, 13, 1) !important;}'
  +
  '.plainlinks {border-color: #6C0F0F !important;}'
  +
  '#mw-content-text div:nth-of-type(1) {background: rgba(61, 36, 36, 1) !important; color: #EDD !important;}'
  +
  '.msgfornewbies {border: 2px solid rgba(83, 22, 12, 1) !important;}'
  +
  '#wpTextbox1, #wpSummary, .searchboxInput {background: rgba(68, 46, 46, 1) !important; color: #EDD !important;}'
  +
  '#mw-content-text table {border: 1px solid rgba(87, 26, 26, 1) !important; background: none repeat scroll 0% 0% rgba(59, 29, 24, 1) !important;}'
  +
  'ul.mw-allpages-chunk li {border-top: 1px solid rgba(59, 14, 14, 1);}'
  +
  '.searchboxInput {border: 1px solid rgba(94, 26, 26, 1) !important;}'
  +
  'code {color: #EDD !important; background-color: rgba(95, 77, 77, 1) !important; border: 1px solid rgba(123, 22, 22, 1) !important;}'
  +
  '#mf-intro {background: none repeat scroll 0% 0% rgba(59, 45, 43, 1) !important; border: 1px solid rgba(87, 14, 14, 1) !important;}'
  +
  '.plainlinks table, .plainlinks table tbody tr td {border: 1px solid #570E0E !important; background: none repeat scroll 0% 0% #3B2D2B !important;}'
  +
  '.plainlinks div {border: 1px solid #571A1A !important; background: none repeat scroll 0% 0% #3D2424 !important;}'
  +
  'table.wikitable > tr > th, table.wikitable > * > tr > th {background-color: rgba(72, 19, 19, 1) !important;}'
  +
  'table.wikitable > tr > th, table.wikitable > tr > td, table.wikitable > * > tr > th, table.wikitable > * > tr > td {border: 1px solid rgba(105, 24, 24, 1) !important;}'
  +
  '.wikitable {color: #EDD !important;}'
  +
  '.mw-charinsert-buttons a {background-color: rgba(0, 0, 0, 0) !important; border: 0px none #000;}'
  +
  '.mbox-small tbody tr td {border-bottom: 1px solid #571A1A !important;}'
  +
  '.infobox.geography td, .infobox.geography th {border-top: 1px solid #571A1A !important;}'
  +
  '.vcard tbody tr td, .geography tbody tr td, .infobox tbody tr td {background-color: rgba(111, 30, 17, 1) !important;}'
  +
  '.infobox.geography .mergedtoprow th {border-top: 1px solid rgba(45, 13, 13, 1) !important;}'
  +
  '.infobox, .geography, .vcard {color: #EDD !important;}'
  +
  '.image img, #footer-copyrightico a img, #footer-icons li, #main_page_mp-mp tbody tr td table tbody tr td div span a img, #main_page_mp-mp tbody tr td p span a img {opacity: .8;}'
  +
  '.infobox.geography .mergedbottomrow td, .infobox.geography .mergedbottomrow th {border-bottom: 1px solid #571A1A !important;}'
  +
  '.quotebox {background-color: #3D2424 !important; border: 1px solid #500B0B !important;}'
  +
  '.navbox-columns-table tbody tr td {border-left: 2px solid rgba(72, 13, 13, 1) !important;}'
  +
  '#mw-content-text table tbody tr td {border: 1px solid rgba(54, 24, 24, 1) !important;}'
  +
  '#mf-sow {background: none repeat scroll 0% 0% rgba(48, 33, 30, 1) !important; border: 1px solid rgba(51, 15, 15, 1) !important;}'
  +
  '#filetoc {border: 1px solid rgba(132, 19, 19, 1) !important; background-color: rgba(101, 7, 7, 1) !important;}'
  +
  '#file a img, .fullImageLink a img, .filehistory tbody tr td a img {opacity: .8;}'
  +
  '.fileinfo-paramfield {background: none repeat scroll 0% 0% rgba(87, 35, 27, 1) !important;}'
  +
  'table.mw_metadata th {background-color: rgba(62, 32, 32, 1) !important;}'
  +
  'table.mw_metadata td {background-color: rgba(78, 20, 20, 1) !important;}'
  +
  'table.mw_metadata td, table.mw_metadata th {border: 1px solid rgba(87, 11, 11, 1) !important;}'
  +
  'img.thumbborder {border: 1px solid rgba(104, 11, 11, 1) !important;}'
  +
  '#mw-content table tbody tr td {border: 1px solid rgba(89, 28, 18, 1) !important; background-color: rgba(47, 34, 32, 1) !important;}'
  +
  '#mw-content table tbody tr td div {border-bottom: 1px solid rgba(83, 28, 20, 1) !important;}'
  +
  '.wikitable tbody tr td {background-color: #2F2220; opacity: .65 !important; color: #200 !important;}'
  +
  '#mw-content-text table tbody tr td div {border-bottom: 1px solid #531C14 !important;}'
  +
  '#mw-searchoptions {background-color: rgba(47, 28, 28, 1) !important; border-color: rgba(81, 19, 19, 1) !important;}'
  +
  '.divider {border-bottom: 1px solid #660000 !important;}'
  +
  'li.gallerybox div.thumb {border: 1px solid rgba(93, 4, 4, 1) !important;}'
  +
  '#footer ul li, .plainlinks {color: #EDD !important;}'
  +
  '.mw-content-ltr center div {border-top: 3px double rgba(104, 16, 16, 1) !important;}'
  +
  '.mw-content-ltr div p img {opacity: .75;}'
  +
  '.sharedUploadNotice {background-color: rgba(71, 26, 19, 1) !important; border: 1px solid rgba(96, 23, 23, 1) !important;}'
  +
  '.mw-content-ltr table tbody tr td table tbody tr td div, .mw-content-ltr table tbody tr td table tbody tr td div {background-color: #3D2424 !important;}'
  +
  '.banner-box-welcome {width: 580px;}'
  +
  '.floatright img, footer-poweredbyico a img {opacity: .8;}'
  +
  '.mainpage_boxcontents, .mainpage_boxcontents_small {background: none repeat scroll 0% 0% rgba(51, 31, 31, 1) !important;}'
  +
  '#mainpage_sitelinks {background-color: rgba(39, 23, 23, 1) !important;}'
  +
  '#mainpage_topbox {border: 1px solid rgba(92, 23, 23, 1) !important;}'
  +
  '.mainpage_boxcontents_title {border-bottom: 1px solid rgba(95, 28, 28, 1) !important;}'
  +
  '.mainpage_boxcontents_small div div {border: 2px outset rgba(93, 12, 12, 1) !important;}'
  +
  '.mbox-image {border-right: 1px solid rgba(122, 19, 19, 1) !important; background: rgba(81, 25, 25, 1) !important;}'
  +
  '.mw-charinsert-buttons, .divlang {border: 1px solid #6C0F0F !important;}'
  +
  'div i, .mw-content-ltr table tbody tr td div div div, .mw-content-ltr table tbody tr td span {color: #EDD !important;}'
  +
  '.mw-content-ltr {border: 2px dotted rgba(111, 15, 15, 1) !important;}'
  +
  '.mw-content-ltr div p {text-shadow: 1px 1px 1px rgba(36, 10, 10, 1) !important;}'
  +
  '.mw-content-ltr div {background: none repeat scroll 0% 0% #5C1111 !important;}'
  +
  '.createboxInput {background: rgba(51, 25, 25, 1) !important; border: 1px solid rgba(128, 19, 19, 1) !important; color: #EDD !important;}'
  +
  '#mw-content-text div:nth-of-type(1) {border: 3px solid #5C1111 !important;}'
  +
  '#content_wrapper .top-bar {background-color: rgba(95, 10, 10, 1) !important; color: #EDD !important;}'
  +
  '#mw-mf-page-center .header {border-bottom: 1px solid #770E0E !important;}'
  +
  '.header .search {background-color: #3F2121 !important; color: #EDD !important;}'
  +
  '.content table td, .content table th {border: 1px solid rgba(113, 11, 11, 1) !important;}'
  +
  '.mbox-text {background: none repeat scroll 0% 0% rgba(75, 60, 60, 1) !important;}'
  +
  '.mbox-image b, .selflink, .content div center b, .content p, .content b, .content div ol li, .content div dl dd dl dd ul li, dd, .mediawiki li {color: #EDD !important;}'
  +
  '.content div div {background-color: rgba(45, 29, 29, 1) !important; border: 3px solid #6C271C !important; color: #EDD;}'
  +
  '.content div p a, .extiw, .mediawiki a, .page-list .title h3, .page-list .title .mw-mf-user {color: rgba(164, 41, 20, 1) !important;}'
  +
  '#footer {border-top: 1px solid rgba(51, 11, 11, 1) !important;}'
  +
  '.list-header {background-color: rgba(99, 12, 12, 1); color: #EDD !important;}'
  +
  '.page-list li, .topic-title-list li, .language-list li {border-bottom: 1px solid rgba(98, 13, 13, 1); color: #EDD !important;}'
  +
  '.page-list.side-list .list-thumb .timestamp, .topic-title-list.side-list .list-thumb .timestamp, .language-list.side-list .list-thumb .timestamp, .mw-content-ltr div div ul li ul li a span {color: #EDD !important;}'
  +
  '.active {background: none repeat scroll 0% 0% rgba(72, 37, 32, 1) !important;}'
  +
  '#hover-magic li:hover {background: none repeat scroll 0% 0% rgba(63, 19, 19, 1) !important;}'
  +
  '#viewerContainer .page, #footer-poweredbyico a img, .thumbborder {opacity: .8;}'
  +
  '.mobile-width-reset {border: 3px solid rgba(125, 31, 16, 1) !important;}'
  +
  '.nomobile div div div a span, #content big {color: #EDD !important;}'
  +
  '.mobile-float-reset {border: 1px solid rgba(134, 47, 33, 1) !important;}'
  +
  '#specialCiteThisPage label input {background: none repeat scroll 0% 0% rgba(59, 45, 45, 1) !important; border: 1px solid #600 !important; color: #EDD !important;}'
  +
  '.mw-content-ltr div div h2, .mw-content-ltr h2, #mf-explore-wikisource center {background-color: rgba(110, 31, 18, 1) !important;}'
  +
  '#mf-highlights p {background-color: rgba(66, 39, 35, 1) !important;}'
  +
  '#mf-explore-wikisource center {background-color: rgba(53, 32, 29, 1) !important;}'
  +
  '.mbox-image {border: 1px solid rgba(102, 17, 17, 1) !important;}'
  +
  '.infobox tbody tr th, .vcard tbody tr th, .plainlist tbody tr th {background-color: rgba(101, 24, 11, 1) !important;}'
  +
  '.wrapper, #nav {background: none repeat scroll 0% 0% rgba(33, 15, 15, 1) !important;}'
  +
  '.logo a img, .flexslider .slides img, .credit-cards img {opacity: .75;}'
  +
  'nav.main {border-bottom: 1px solid #3F0606 !important; border-top: 1px solid #3F0606 !important;}'
  +
  '.span12 {background: rgba(45, 15, 15, 1) !important;}'
  +
  'nav > ul > li > a, .span8.shop-notices a, .span12.details ul ul li a, .s2, .p1 a, #customer_login a {color: rgba(177, 33, 9, 1) !important;}'
  +
  '.details .item-count {color: #EDD !important;}'
  +
  '#mc_embed_signup {background: none repeat scroll 0% 0% #2D0F0F !important;}'
  +
  '#mc-embedded-subscribe.button, #mce-EMAIL.email {border: 1px solid rgba(125, 20, 20, 1); background: #843330 !important; color: #EDD !important;}'
  +
  'nav > ul > li.dropdown > .dropdown, nav > ul > li.dropdown > .dropdown a {background: none repeat scroll 0% 0% rgba(102, 14, 14, 1) !important; border-color: rgba(120, 16, 16, 1) rgba(138, 11, 11, 1) rgba(102, 4, 4, 1) !important; color: #EDD !important;}'
  +
  '.p1, .product .title {color: #EDD !important;}'
  +
  '.product {border-bottom: 1px solid rgba(83, 14, 14, 1) !important;}'
  +
  '.plainlinks table tbody tr td div div a img {opacity: .8 !important;}'
  +
  '.central-featured-lang .link-box em, .central-featured-lang .link-box small, .central-featured-lang strong {text-shadow: 0 0 0 #000;}'
  +
  '.formBtn, #searchLanguage {background-color: rgba(161, 30, 8, 1) !important;}'
  +
  '.mw-content-ltr div {border: 1px solid rgba(57, 18, 12, 1) !important;}'
  +
  '.mw-content-ltr div, .shop__name {color: #EDD !important;}'
  +
  '#mw-htmlform-skin {display: none !important;}'
  +
  '#mw-prefsection-rendering-skin legend:after {content: "s are not available with the use of ShadeRoot Wikimedia" !important;}'
  +
  '.successbox {border-color: rgba(144, 30, 12, 1) !important; background-color: rgba(105, 28, 16, 1) !important;}'
  +
  '.mw-search-results li {background: none repeat scroll 0% 0% rgba(42, 25, 22, 1) !important; border-bottom: 1px solid rgba(35, 12, 9, 1) !important;}'
  +
  'fieldset#mw-searchoptions {border-color: rgba(75, 16, 16, 1) !important;}'
  +
  '.centralauth-logout-box p img {border: 1px solid #3D2424 !important;}'
  +
  '.MainPageBG table tbody tr th h2 {border: 1px solid rgba(57, 27, 22, 1) !important;}'
  +
  '.span12 table tr td {border-top: 1px solid rgba(95, 21, 21, 1) !important;}'
  +
  '.span12 .item a, .span12 .item a strong {color: rgba(180, 32, 9, 1) !important;}'
  +
  '.header {background: none repeat scroll 0% 0% rgba(29, 12, 12, 1) !important;}'
  +
  '.alternative-payment-methods {border-bottom: 1px solid rgba(48, 18, 18, 1) !important;}'
  +
  '.alternative-payment-methods .or {background-color: rgba(137, 15, 15, 1) !important; border: 1px solid rgba(104, 14, 14, 1) !important;}'
  +
  '.main .wrap .fieldset {border: 1px solid rgba(119, 13, 13, 1) !important; background: none repeat scroll 0% 0% rgba(47, 30, 30, 1) !important;}'
  +
  '.order-summary {background: none repeat scroll 0% 0% #2F1E1E !important; border: 1px solid #770D0D !important;}'
  +
  '.summary-body, .order-summary__section, .total-line--total, .main .wrap .field {border-top: 1px solid #770D0D !important;}'
  +
  '.footer {border-top: 1px solid rgba(74, 10, 10, 1); background: none repeat scroll 0% 0% rgba(35, 20, 20, 1);}'
  +
  '.alternative-payment-methods__btn {border: 1px solid #770D0D !important;}'
  +
  '.btn {background-color: #801D0D !important;}'
  +
  '.btn:hover, .btn:focus {background-color: #942D26 !important;}'
  +
  '.mw-content-ltr {border: none !important;}'
  +
  '.mw-content-ltr div div h2, .mw-content-ltr h2, #mf-explore-wikisource center {background-color: #3D2424 !important;}'
  +
  '.phabricator-nav-column-background {background: none repeat scroll 0% 0% rgba(35, 27, 25, 1) !important; border-right: 1px solid rgba(95, 25, 14, 1) !important;}'
  +
  'a.phabricator-application-launch-container, div.phabricator-application-launch-container {border-bottom: 1px solid rgba(68, 18, 10, 1) !important;}'
  +
  '.phabricator-application-launch-name {color: rgba(150, 38, 20, 1) !important; text-shadow: 0px 1px 1px rgba(89, 25, 25, 0.9) !important;}'
  +
  '.phabricator-application-launch-description {color: rgba(189, 172, 169, 1) !important; text-shadow: 0px 1px 1px rgba(110, 36, 36, 0.9) !important;}'
  +
  '.device-desktop a.phabricator-application-launch-container:hover, .device-desktop .phabricator-side-menu a.phui-list-item-href:hover {background-color: rgba(68, 27, 21, 1) !important;}'
  +
  '.phui-list-item-name, .phui-box p, .dashboard-view p, .remarkup-list-item, .phabricator-standard-page-footer a, .remarkup-important, .remarkup-important strong, .phui-property-list-text-content {color: #EDD !important;}'
  +
  '.dashboard-panel .phui-action-header.gradient-grey-header, .dashboard-panel .phui-action-header.gradient-lightblue-header, .dashboard-panel .phui-property-list-section {border-color: rgba(141, 34, 16, 1) rgba(144, 34, 16, 1) rgba(119, 24, 9, 1) !important;}'
  +
  '.sprite-gradient {background-image: none !important; background: none repeat scroll 0% 0% rgba(35, 27, 25, 1) !important;}'
  +
  '.phui-property-list-text-content {background: none repeat scroll 0% 0% rgba(56, 43, 43, 1) !important;}'
  +
  '.dashboard-panel .sprite-gradient .phui-action-header-title, .remarkup-link, .phui-object-item-link, .phui-handle, .phui-link-person, .phui-object-item-attribute a, .phabricator-nav-content a, .mlb a {color: rgba(168, 17, 17, 1) !important;}'
  +
  '.phabricator-standard-page-footer {border-top: 1px solid rgba(95, 23, 12, 1) !important; color: #EDD !important;}'
  +
  '.phabricator-remarkup .remarkup-important {background: none repeat scroll 0% 0% rgba(39, 24, 23, 1) !important;}'
  +
  '.phui-list-item-href {background: none repeat scroll 0% 0% rgba(104, 40, 29, 1) !important;}'
  +
  '.dashboard-panel .phui-list-view.phui-list-navbar {border-left: 1px solid rgba(146, 42, 25, 1) !important; border-right: 1px solid rgba(153, 34, 14, 1) !important; border-bottom: 1px solid rgba(78, 32, 24, 1) !important;}'
  +
  '.phui-list-view.phui-list-navbar > li {border-right: 1px solid rgba(126, 18, 18, 1) !important; background: rgba(74, 40, 40, 1) !important;}'
  +
  '.phui-list-view.phui-list-navbar {background: none repeat scroll 0% 0% #382B2B !important;}'
  +
  '.phui-object-item-bar-color-violet {border-left-color: rgba(167, 74, 58, 1) !important;}'
  +
  '.dashboard-panel .phui-object-item-list-view .phui-object-item {background-color: #231B19 !important; border-color: #892616 #892616 #892616 #A44D3F !important;}'
  +
  '.dashboard-panel .maniphest-task-group-header {background: none repeat scroll 0% 0% rgba(86, 41, 41, 1) !important;}'
  +
  '.dashboard-panel .phui-object-item-frame, .dashboard-panel .phui-object-item-list-view, .maniphest-task-group-header {border-color: rgba(83, 24, 14, 1) !important;}'
  +
  '.phui-tag-shade-violet .phui-tag-core {background-color: rgba(160, 124, 182, 1) !important; border-color: rgba(114, 56, 141, 1) !important; color: #EDD !important;}'
  +
  '.phui-tag-shade-yellow .phui-tag-core {background-color: rgba(201, 156, 43, 1) !important; border-color: rgba(168, 108, 48, 1) !important; color: #EDD !important;}'
  +
  '.phui-tag-shade-blue .phui-tag-core {background-color: rgba(53, 101, 192, 1) !important; border-color: rgba(25, 115, 176, 1) !important; color: #EDD !important;}'
  +
  '.phui-tag-shade-green .phui-tag-core {background-color: rgba(19, 147, 19, 1) !important; border-color: rgba(29, 174, 34, 1) !important; color: #EDD !important;}'
  +
  '.phui-tag-shade-disabled .phui-tag-core, .aphront-dialog-view {background-color: rgba(140, 140, 140, 1) !important; border-color: rgba(74, 74, 74, 1) !important; color: #EDD !important;}'
  +
  '.phui-object-item-image, .phui-pinboard-item-image-link img {opacity: .8 !important;}'
  +
  '.UQ0_8 {color: #EDD !important;}'
  +
  '.dashboard-panel .phui-pinboard-view {background: none repeat scroll 0% 0% #382B2B !important; border-color: rgba(83, 24, 14, 1) !important;}'
  +
  '.phui-pinboard-item-view {background: none repeat scroll 0% 0% rgba(69, 29, 29, 1) !important; border-color: rgba(83, 24, 14, 1) !important;}'
  +
  '.phui-pinboard-item-content + .phui-pinboard-icons, .phui-pinboard-item-image-link + .phui-pinboard-icons {border-top: 1px solid rgba(111, 36, 24, 1) !important;}'
  +
  '.phui-pinboard-item-header {border-bottom: 1px solid rgba(92, 26, 15, 1) !important;}'
  +
  '.phabricator-crumbs-view {border-bottom: 1px solid rgba(90, 36, 28, 1) !important;}'
  +
  '.aphront-dialog-body {background: none repeat scroll 0% 0% rgba(80, 25, 25, 1) !important;}'
  +
  '.aphront-dialog-head .phui-action-header {border-bottom: 1px solid rgba(123, 39, 25, 1) !important;}'
  +
  '.aphront-dialog-tail {background: none repeat scroll 0% 0% rgba(36, 25, 25, 1) !important; border-color: rgba(107, 37, 25, 1) -moz-use-text-color -moz-use-text-color !important;}'
  +
  '.aphront-dialog-head .phui-action-header .phui-action-header-title {color: rgba(153, 33, 13, 1) !important; text-shadow: 0px 1px 2px rgba(29, 7, 7, 1) !important;}'
  +
  '.phui-form-view label.aphront-form-label {color: #EDD !important;}'
  +
  '#base-page button, #base-page a.button, #base-page a.button:visited, #base-page input[type="submit"] {background-color: rgba(155, 41, 22, 1) !important; background-image: linear-gradient(to bottom, rgba(150, 39, 21, 1), rgba(99, 25, 13, 1)) !important; border: 1px solid rgba(141, 41, 25, 1) !important; color: #EDD !important;}'
  +
  '#base-page textarea, #base-page input[type="text"], #base-page input[type="password"], #base-page input[type="datetime"], #base-page input[type="datetime-local"], #base-page input[type="date"], #base-page input[type="month"], #base-page input[type="time"], #base-page input[type="week"], #base-page input[type="number"], #base-page input[type="email"], #base-page input[type="url"], #base-page input[type="search"], #base-page input[type="tel"], #base-page input[type="color"], div.jx-tokenizer-container {background-color: rgba(56, 28, 28, 1) !important; border: 1px solid rgba(102, 29, 17, 1) !important; color: #EDD !important; box-shadow: none !important;}'
  +
  '.phabricator-nav-content {color: #EDD !important;}'
  +
  '.phabricator-crumbs-view, .phabricator-crumbs-view a.phabricator-crumb-view, .phabricator-crumbs-view a.phabricator-crumbs-action {color: rgba(179, 40, 17, 1) !important; text-shadow: 0px 1px 1px rgba(81, 46, 46, 0.9) !important;}'
  +
  '.mw-search-profile-tabs {background-color: #2A1916 !important; border: 1px solid rgba(59, 8, 8, 1) !important;}'
  +
  '.mw-special-Search .searchmatch {background-color: rgba(152, 53, 42, 1) !important;}'
  +
  '.translations tbody tr td {background-color: rgba(62, 28, 23, 1) !important;}'
  +
  '.related tbody tr td, .terms tbody tr td {background: #3B1D18 !important;}'
  +
  '.ttbc {background-color: #2F0C0C !important;}'
// DARKEN OVERRIDE
  +
  '.mw-content-ltr div {background: none repeat scroll 0% 0% rgba(33, 22, 22, 1) !important;}'
  +
  '#mw-content-text div:nth-of-type(1) {background: none repeat scroll 0% 0% rgba(27, 17, 17, 1) !important;}'
  +
  '.wikitable tbody tr td {color: rgba(255, 255, 255, 1) !important; text-shadow: 0px 0px 2px #000 !important;}'
  +
  'input, textarea .oo-ui-textInputWidget.oo-ui-widget-enabled input, .oo-ui-textInputWidget.oo-ui-widget-enabled textarea {background: #471212 !important; color: #EDD !important;}'
  +
  'div#mw-panel div.portal div.body {background-image: none !important; border-bottom: 1px solid #3e2525 !important;}'
  +
  '.mw-searchresults-has-iw .iw-resultset {background-color: #351d19 !important;}'
  +
  '.mw-special-Search .searchmatch {background-color: rgb(69, 29, 25) !important;}'
  +
  '#mw-content-text div:nth-of-type(1) {background: none repeat scroll 0% 0% rgba(27, 17, 17, 0) !important;}'
);