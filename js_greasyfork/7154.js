// ==UserScript==
// @name       Hackforums Modern Dark Theme
// @namespace  http://www.hackforums.net/*
// @version    0.1
// @description  A dark modern theme for Hackforums.
// @include         http://www.hackforums.net/*
// @include         http://hackforums.net/*
// @copyright  2012+, Andy Biersack
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/7154/Hackforums%20Modern%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/7154/Hackforums%20Modern%20Dark%20Theme.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
var styles = [];
styles.push('body {Background: #040404!important;margin:0;}');
styles.push('#container {background: #222;padding-left: 0px!important;padding-right: 0px!important;}');
styles.push('.menu ul {background: rgba(0,0,0,0)!important;color: #00ff00!important;height: 50px;border-radius: 0px 0px 0 0!important;}');
styles.push('tr:first-child td:only-child, thead tr:only-child td:only-child, .tborder[style*="border-bottom-width"], .tborder[style*="border-bottom-width"] tbody tr td, #posts .tborder[style*="top: 5"]:last-child {-moz-border-radius: 0px 0px 0 0!important;border-radius: 0px 0px 0 0!important;}');
styles.push('.thead {background: #2A2A2A!important;}');
styles.push('.tborder {background: #4F3A6B;margin: auto auto;border: none!important;}');
styles.push('.pagination .pagination_current, .pagination a {background: #444444!important;border-radius: 0px}');
styles.push('.quick_jump, a.quick_jump {color: #494949!important;}');
styles.push('.bottommenu {border: none!important;-moz-border-radius: 0px!important;border-radius: 0px!important;}');
styles.push('.bitButton {background-color: #444!important;border:none!important;text-shadow: none!important;}');
styles.push('.tfoot {background: #2A2A2A!important;}');
styles.push('.button {background-color: #444!important;border: none!important;}');
styles.push('a:hover, a:active, .menu ul a:hover, .navigation a:hover, .tfoot a:hover, .pagination a:hover, .bitButton:hover, .button:hover {color: #fff!important;text-shadow: 0 0 7px #fff!important;}');
styles.push('.navButton:hover {color: #000!important;border-top:none!important;background: none!important;text-decoration:none;}');
styles.push('.pagination a:hover {background:none!important;}');
styles.push('.tborder, tr:only-child td:only-child {-moz-border-radius:none!important;border-radius:none!important;}');
styles.push('tr:only-child td:last-child {-moz-border-radius: 0 0px 0px 0;border-radius: 0 0px 0px 0;}');
styles.push('.shadetabs li a.selected {position: relative;top: 1px;background: #2A2A2A!important;color: #ABABAB!important;text-shadow: none!important;}');
styles.push('.shadetabs li a {background-color: #3C3C3C!important;box-shadow: 0 1px 0 0 rgba(120, 88, 163, 0) inset !important;border-radius: 0px 0px 0px 0px !important;text-shadow: 1px 1px 0px #000!important;}');
styles.push('#panel {background: rgba(50,50,50,0.50)!important;-moz-border-radius: none!important;border-radius: 0px 0px 0px 0px;color: #cccccc;font-size: 13px;border: none!important;padding: 6px;}');
styles.push('tr:only-child td:last-child {border-radius: 0 0px 0px 0;}');
styles.push('.trow_sep {background: #2A2A2A;}');
addGlobalStyle(styles.join(''));