// ==UserScript==
// @name        GitHub Toc
// @description Generate TOC(Table of Content) for Github readme and Github Wiki
// @author      wenLiangcan
// @version     0.1
// @namespace   https://github.com/wenLiangcan
// @homepage    https://github.com/summerblue/github-toc
// @license     MIT (http://mit-license.org/)
// @copyright   Copyright © 2014 wenLiangcan
// @updateURL
// @downloadURL
// @include     https://github.com/*
// @include     http://github.com/*
// @run-at      document-end
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @require     https://greasyfork.org/scripts/5542-toc/code/toc.js?version=20193
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/5541/GitHub%20Toc.user.js
// @updateURL https://update.greasyfork.org/scripts/5541/GitHub%20Toc.meta.js
// ==/UserScript==


GM_addStyle("#toc{margin-bottom:25px}#toc ul{margin:0;padding:0;list-style:disc;margin-left:15px}#toc li a{padding:5px 10px}#toc a{text-decoration:none;display:block}#toc a:hover{background:#F3F4F8}#toc .toc-h1{padding-left:0}#toc .toc-h2{padding-left:0}#toc .toc-h3{padding-left:10px;list-style:none}article.markdown-body h2,#wiki-body .markdown-body h2{padding-bottom:.3em;font-size:1.5em;line-height:1.225;border-bottom:2px solid #eee}article.markdown-body h3,#wiki-body .markdown-body h3{padding-bottom:.3em;font-size:1.3em;line-height:1.225;border-bottom:1px solid #eee}");

(function($) {
    $('#wiki-body .markdown-body').prepend("<div id='toc'><div>");
    $('#wiki-body .markdown-body').addClass('toc-mian-body')
    $('article.markdown-body').prepend("<div id='toc'><div>");
    $('article.markdown-body').addClass('toc-mian-body')
    $('#toc').toc({
        'selectors': 'h1,h2,h3', //elements to use as headings
        'container': '.markdown-body.toc-mian-body', //element to find all selectors in
        'smoothScrolling': true, //enable or disable smooth scrolling on click
        'prefix': 'toc', //prefix for anchor tags and class names
        'onHighlight': function(el) {}, //called when a new section is highlighted
        'highlightOnScroll': true, //add class to heading that is currently in focus
        'highlightOffset': 100, //offset to trigger the next headline
        'anchorName': function(i, heading, prefix) { //custom function for anchor name
            return prefix + i;
        },
        'headerText': function(i, heading, $heading) { //custom function building the header-item text
            var rank = $heading.prop("tagName").substr(1)
            if (rank > 2) {
                return '- ' + $heading.text();
            }
            return $heading.text();
        },
    });
    $('.markdown-body.toc-mian-body').prepend("<h2>Table of Contents</h2>");
})(jQuery);
