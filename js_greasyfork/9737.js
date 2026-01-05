// ==UserScript==
// @name         IGDB.com - Nightmode (8PM-6AM)
// @namespace    http://hille.tv
// @version      0.5
// @description  Changes the site to a dark theme during the night
// @author       Hille
// @domain       igdb.com
// @match        https://igdb.com/*
// @match        http://igdb.com/*
// @match        https://www.igdb.com/*
// @match        http://www.igdb.com/*
// @include      https://igdb.com/*
// @include      htts://igdb.com/*
// @include      https://www.igdb.com/*
// @include      http://www.igdb.com/*
// @downloadURL https://update.greasyfork.org/scripts/9737/IGDBcom%20-%20Nightmode%20%288PM-6AM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/9737/IGDBcom%20-%20Nightmode%20%288PM-6AM%29.meta.js
// ==/UserScript==


var d = new Date();
  var currentTime = new Date().getHours();
    if (20 <= currentTime && currentTime < 24 || 0 <= currentTime && currentTime < 6) { 
        var link = window.document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'data:text/css,' +
    '#searchbar #searchButton input, #searchButton button, #boxart, aside h4, hr, blockquote, pre, .form-control, .btn-default, .panel, .redactor-editor, .modal-content, .modal-header, .tab-content, .nav>li>a:hover, .nav>li>a:focus, .pagination>.disabled>span, .pagination>.disabled>span:hover, .pagination>.disabled>span:focus, .pagination>.disabled>a, .pagination>.disabled>a:hover, .pagination>.disabled>a:focus, .pagination>li>a, .sorting-area, .chosen-container-multi .chosen-choices, .border-top, .notif ul li:not(:last-child), .chosen-container-single .chosen-single, .chosen-container-single .chosen-drop, .well, .page-header, .nav-tabs-justified>li>a, .nav-tabs.nav-justified>li>a, .game-changes #change_list ul li {border-color:#323232 !important;}' +
    '#searchbar #searchButton button { border-color: #27AE60 !important;}' +
    '.modal-content{border:1px solid #323232}' +
    '#searchbar,.panel .panel-heading,.redactor-toolbar,.nav-alt.nav-tabs>li{background:#1a1a1a}' +
    'pre,#topic_title.form-control,.table>thead>tr>td.active,.table>thead>tr>th.active,.table>thead>tr.active>td,.table>thead>tr.active>th,.table>tbody>tr>td.active,.table>tbody>tr>th.active,.table>tbody>tr.active>td,.table>tbody>tr.active>th,.table>tfoot>tr>td.active,.table>tfoot>tr>th.active,.table>tfoot>tr.active>td,.table>tfoot>tr.active>th,.btn-default,.panel,.dropdown-menu,.tt-dropdown-menu,.breadcrumb,.redactor-editor,.tab-content,.nav.nav-tabs,.chosen-container .chosen-results li.no-results,.well, .table-striped tr:nth-child(even) {background:#202020}' +
    'body,#searchbar #searchType select,#searchbar #searchType input,.btn-default:hover,.btn-default:focus,.btn-default.focus,.btn-default:active,.btn-default.active,.open>.btn-default.dropdown-toggle,.modal-content,.form-control,.nav>li>a:hover,.nav>li>a:focus,.pagination>.disabled>span,.pagination>.disabled>span:hover,.pagination>.disabled>span:focus,.pagination>.disabled>a,.pagination>.disabled>a:hover,.pagination>.disabled>a:focus,.pagination>li>a,.pagination>li>a:hover,.pagination>li>a:focus,.pagination>li>span:hover,.pagination>li>span:focus,.chosen-container-multi .chosen-choices,.chosen-container-single .chosen-single,.chosen-container-single .chosen-drop,.chosen-container .chosen-drop, .game-changes #change_list ul li:nth-child(odd), .table-striped>tbody>tr:nth-of-type(odd) {background:#282828}' +
    '.form-control.tt-input{background:#282828!important}' +
    '#search,.input-group .form-control{background:#282828!important}' +
    '#searchbar #searchButton input,#searchbar #searchButton button, #searchButton button {background:#27AE60}' +
    '.panel .panel-heading .dropdown-toggle{background:transparent}' +
    'body,#searchbar #searchType select,#searchbar #searchType input,#search,.btn-default,.btn-default:hover,.btn-default:focus,.btn-default.focus,.btn-default:active,.btn-default.active,.open>.btn-default.dropdown-toggle,.dropdown-menu>li>a,.tt-dropdown-menu a,.redactor-toolbar li a,.nav-alt.nav-tabs>li a,.form-control,.chosen-container-single .chosen-single,.chosen-container .chosen-results, .title {color:#ccc}' +
    '.forum-title a:visited,.chosen-container .chosen-results li.no-results{color:#1D7341}' +
    '.link-dark{color:#27AE60}';
        document.getElementsByTagName("HEAD")[0].appendChild(link);
}
else {
}


