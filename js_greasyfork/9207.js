// ==UserScript==
// @name        posting helper for /r/kindle_sale_jp
// @namespace   http://www.reddit.com/r/kindle_sale_jp/
// @description amazon.co.jpの商品リストをMarkdownで書式化
// @include     http://www.amazon.co.jp/*
// @include     https://www.amazon.co.jp/*
// @version     4
// @grant       GM_setClipboard
// @license     public domain
// @downloadURL https://update.greasyfork.org/scripts/9207/posting%20helper%20for%20rkindle_sale_jp.user.js
// @updateURL https://update.greasyfork.org/scripts/9207/posting%20helper%20for%20rkindle_sale_jp.meta.js
// ==/UserScript==

/* eslint no-console:0 */
/* global document, window, console, GM_setClipboard, MutationObserver */

(function() {
    "use strict";

    //var ASIN_RE = /\bB[A-Z0-9]{9}\b|\b.{10}\b/;
    var ASIN_RE = /\bB[A-Z0-9]{9}\b/;

    function escapeMD(s){ // -> str : s に含まれる Markdown の特殊文字 [, ], (, ) をエスケープする
        return s.replace(/[\[\]\(\)]/g, function(ch){ return "\\" + ch; });
    }

    function escapeHTML(s) { // s -> str : sに含まれるHTMLの特殊文字 <, >, ", ', & をエスケープする
        return s.replace(/</g, "&lt;").replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;").replace(/'/g, "&#039;")
                .replace(/&/g, "&amp;");
    }

    function compactText(s, isCompactSpace) { // s, compactSpace -> str : 文字列sの連続する空白文字類やキャレットを圧縮する
        var newchar = isCompactSpace ? "" : " ";
        return s.replace(/[　\s\n›]+/gm, function(){ return newchar; }).trim();
    }

    function parseResultsCol(node) { // node -> books or [] : 検索ページ向け
        var books = [];
        var lis = node.querySelectorAll("li[id^=result_]");
        var li, asin, title, author, temp, price, book;
        for (var i = 0; i < lis.length; i++) {
            try {
                li = lis[i];
                asin = li.getAttribute("data-asin");
                title = li.querySelector(".s-access-detail-page").title;
                author = li.querySelector(".a-row.a-spacing-none").textContent;
                author = compactText(author, true);
                temp = li.querySelector(".s-price");
                price = temp ? temp.textContent : "n/a";
                book = { "asin": asin, "title": title, "author": author, "price": price };
                books.push(book);
            } catch (e) {
                console.warn(e);
            }
        }
        return books;
    }


    function parseS9Multipack(node) { // node -> books or [] : コミックトップページのスライドショー用
        var s9list = node.querySelectorAll(".s9hl");
        var s9, a, title, asin, t11, author, temp, price, book;
        var books = [];
        for (var i = 0; i < s9list.length; i++) {
            try {
                s9 = s9list[i];
                a = s9.querySelector("a");
                title = a.title;
                asin = a.href.match(ASIN_RE)[0];
                t11 = s9.querySelector(".t11");
                author = compactText(t11.textContent, true);
                temp = s9.querySelector(".s9Price");
                price = temp ? temp.textContent : "n/a";
                book = { "asin": asin, "title": title, "author": author, "price": price };
                books.push(book);
            } catch (e) {
                console.log(e);
            }
        }
        return books;
    }

    function parseAmabotWidget(node) { // node -> books or [] : テーブルレイアウトの特設ページ用
        var ary = node.querySelectorAll("td[valign=top][colspan='2']");
        if (!ary.length) {
            console.warn("td[valign=top][colspan='2'] not found in .productList");
            return [];
        }
        var tds = [];
        var text;
        for (var i = 0; i < ary.length; i++) {
            text = ary[i].textContent.trim();
            if (text.length > 10) {
                tds.push(ary[i]);
            }
        }
        var books = [];
        var td, a, asin, title, author, price, book;
        for (i = 0; i < tds.length; i++) {
            try {
                td = tds[i];
                a = td.querySelector("a");
                asin = a.href.match(ASIN_RE)[0];
                title = compactText(a.textContent);
                // author は a で囲われてない前提
                author = td.querySelector("br").nextSibling.textContent.trim();
                author = author ? compactText(author, true) : "n/a";
                price = td.querySelector("table b.price").textContent;
                book = { "asin": asin, "title": title, "author": author, "price": price };
                books.push(book);
            } catch (e) {
                console.warn(e);
            }
        }
        return books;
    }

    function parseAecenter(node) { // node -> books or [] : 著者ページ向け
        var books = [];
        var divs = node.querySelectorAll("div[id^=result_]");
        var div, h3, title, author, asin, price, book; // ...
        var temp;
        for (var i = 0; i < divs.length; i++) {
            try {
                div = divs[i];
                h3 = div.querySelector("h3"); // grid spacer return null;
                if (!h3) { continue; }
                title = h3.querySelector("span.lrg.bold").textContent;
                author = h3.querySelector("span.med.reg").textContent;
                author = author.replace(/\s*\(\d+\/\d+\/\d+\).*/, "");
                author = compactText(author, true);
                asin = div.getAttribute("name").match(ASIN_RE)[0];
                try {
                    temp = div.querySelector("ul.rsltL");
                    if (temp) {
                        price = compactText(temp.textContent).replace(/Kindle.+/, "");
                    } else {
                        temp = div.querySelector(".newp");
                        if (temp) {
                            price = div.textContent.match(/(￥ *[\d,]+)\s*Kindle/m)[1];
                        }
                    }
                } catch (e) {
                    price = "n/a";
                }
                if (!price) { price = "n/a"; }
                book = { "asin": asin, "title": title, "author": author, "price": price };
                books.push(book);
            } catch(e) {
                // XXX
                book = { "asin": asin || "XXX", "title": title || "XXX", "author": author || "XXX", "price": price || "XXX" };
                books.push(book);
                console.warn(e);
            }
        }
        return books;
    }

    function parseMainResults(node) { // コミックトップページ下部
        if (window.location.href.match(/\/e\//)) { return []; } // 著者ページ
        return parseAecenter(node);
    }

    function bookToMD(book) { // book -> str or '' : book をマークダウンで書式化して返す。書式化に失敗したら '' を返す
        try {
            var em = escapeMD;
            var eh = escapeHTML;
            return ["* ", eh(em(book.author)), ", [", eh(em(book.title)), "]",
                    "(http://www.amazon.co.jp/dp/", eh(em(book.asin)), "/), ",
                    eh(em(book.price))].join("");
        } catch (e) {
            return "";
        }
    }

    var LI = [
        "<li style='color: #0A0A0A; list-style-position: inside; margin: 0; font-size: 12px;'>",
        "</li>\n"
    ];

    function bookToHTML(book) { // book -> str or '' : book をHTMLで書式化して返す。書式化に失敗した場合は '' を返す
        try {
            var eh = escapeHTML;
            var author = eh(book.author);
            var href = "http://www.amazon.co.jp/dp/" + eh(book.asin) + "/";
            var title = "<a href='" + href + "'>" + eh(book.title) + "</a>";
            var price = eh(book.price);
            return LI[0] + [author, title, price].join(", ") + LI[1];
        } catch (e) {
            console.warn(e);
            return "";
        }
    }

    var WIDGET = [ // widgetの初期HTML
            "<div class='ksj-widget' style='margin: 5px 0;' >",
            " <span class='ksj-buttons'>",
            "  <button class='ksj-prev' style='margin: 0px;'>prev</button>",
            "  <button class='ksj-next' style='margin: 0px;'>next</button>",
            "  <button class='ksj-copy-md' style='margin: 0px;'>copy MD</button>",
            " </span>",
            " <form action='' style='display: inline; margin-bottom: 0px'>",
            "  <span><input type='radio' name='ksj-text-format' class='ksj-radio-hide' "
            + "value='hide' checked style='margin: 0 5px;' />隠す</span>",
            "  <span><input type='radio' name='ksj-text-format' class='ksj-radio-html' "
            + "value='HTML' style='margin: 0 5px;' />HTML</span>",
            "  <span><input type='radio' name='ksj-text-format' class='ksj-radio-md' "
            + "value='Markdown' style='margin: 0 5px;' />Markdown</span>",
            "  <span class='ksj-counter' style='margin-left: 20px;'></span>",
            "  <span class='ksj-info' style='margin-left: 20px;'></span>",
            " </form>",
            " <div class='ksj-md-container' style='display: none;' ></div>",
            " <div class='ksj-html-container' style='display: none;' ></div>",
            "</div>"
    ].join("\n");

/*
    function findWidget(child) { // findWidget(child) -> widget or null : childを含むwidgetを探す
        var elem = child;
        for (var i = 0; i < 5; i++) { // XXX
            elem = elem.parentNode;
            if (elem.querySelector(".ksj-widget")) {
                return elem;
            }
        }
        return null;
    }
*/

    function switchTab(elem) { // elem -> undefined : ラジオボタンの状況に応じてテキストコンテナの状態を変更する
        // var widget = findWidget(elem);
        var widget = elem.parentNode.parentNode.parentNode; // XXX
        if (!widget) { return; }
        var mdBox = widget.querySelector(".ksj-md-container");
        var htmlBox = widget.querySelector(".ksj-html-container");
        if (!mdBox || !htmlBox) { return; }
        // 一旦両方とも閉じる
        mdBox.style.display = "none";
        htmlBox.style.display = "none";
        // ラジオボタンに応じてどちらかを開閉
        if (elem.value === "HTML" && elem.checked) {
            mdBox.style.display = "none";
            htmlBox.style.display = "block";
        } else if (elem.value === "Markdown" && elem.checked) {
            htmlBox.style.display = "none";
            mdBox.style.display = "block";
        } else {
            console.warn("must not happen");
        }
    }

    function makeKSJWidget() { // -> widget : ハンドラで初期化済みのwidgetを返す。返り値はupdate_widget すること
        var dummy = document.createElement("div");
        dummy.innerHTML = WIDGET;
        var widget = dummy.querySelector(".ksj-widget");
        try {
            var mdContainer = widget.querySelector(".ksj-md-container");
            var htmlContainer = widget.querySelector(".ksj-html-container");
            var nextBtn = widget.querySelector(".ksj-next");
            nextBtn.addEventListener("click", function() {
                var pagn = document.querySelector("#pagnNextLink") || document.querySelector("a.paginationNext");
                if (pagn) {
                    pagn.click();
                }
            }, false);
            var prevBtn = widget.querySelector(".ksj-prev");
            prevBtn.addEventListener("click", function() {
                var pagn = document.querySelector("#pagnPrevLink") || document.querySelector(".paginationPrev a");
                if (pagn) {
                    pagn.click();
                }
            });
            var copyBtn = widget.querySelector(".ksj-copy-md");
            copyBtn.addEventListener("click", function() {
                GM_setClipboard(mdContainer.textContent);
                widget.querySelector(".ksj-info").textContent = "Markdownソースをコピーしました。";
            });
            var radioMD = widget.querySelector(".ksj-radio-md");
            radioMD.addEventListener("click", function() { switchTab(this); });
            var radioHTML = widget.querySelector(".ksj-radio-html");
            radioHTML.addEventListener("click", function() { switchTab(this); });
            var radioHide = widget.querySelector(".ksj-radio-hide");
            radioHide.addEventListener("click", function() {
                mdContainer.style.display = "none";
                htmlContainer.style.display = "none";
            });
        } catch (e) {
            console.log(e);
        }
        return widget;
    }

    var selectorsAndParsers = [ // パーサー、パース対象
        [parseAmabotWidget, ".amabot_widget"], // テーブルレイアウト。特設ページ
        // コミックのトップページは画面株に#mainResultsATFのすぐ下に入れ子で#mainResultsが来る。注意
        [parseS9Multipack, ".s9Multipack"], // スライドショー
        [parseMainResults, "#mainResults"], // コミックトップページ
        [parseResultsCol, "#resultsCol"], // 検索ページ
        [parseAecenter, "#aecenter"] // 著者ページ
    ];

    var UL = [ // HTML でマークアップするときに使う
        "<ul style='border: 1px solid gray; border-radius: 5px; background-color: #FCFCFC; "
        + "padding: 3px; font-family: monospace; margin-left: 0;'>",
        "</ul>"
    ];
    var PRE = [ // Markfown でマークアップするときに使う
        "<pre style='border: 1px solid gray; border-radius: 5px; background-color: #FCFCFC; "
        + "padding: 3px; font: 12px monospace; margin: 0; white-space: pre-wrap; '>",
        "</pre>"
    ];

    function fillMDContainer(widget, books) {
        var container = widget.querySelector(".ksj-md-container");
        var lines = books.map(bookToMD);
        var mdhtml = PRE[0] + lines.join("\n") + PRE[1];
        container.innerHTML = mdhtml;
    }

    function fillHTMLContainer(widget, books) {
        var container = widget.querySelector(".ksj-html-container");
        var lines = books.map(bookToHTML);
        var html = UL[0] + lines.join("\n") + UL[1];
        container.innerHTML = html;
    }

    function fillCounter(widget, books) {
        var counter = widget.querySelector(".ksj-counter");
        if (counter) { counter.textContent = books.length.toString() + "件"; }
    }

    function initPrevLink(widget) {
        var pagn = document.querySelector("#pagnPrevLink") || document.querySelector(".paginationPrev a");
        var bprev = widget.querySelector(".ksj-prev");
        if (pagn && bprev) {
            bprev.style.color = "black";
        } else {
            bprev.style.color = "lightgray";
        }
    }

    function initNextLink(widget) {
        var pagn = document.querySelector("#pagnNextLink") || document.querySelector("a.paginationNext");
        var bnext = widget.querySelector(".ksj-next");
        if (pagn && bnext) {
            bnext.style.color = "black";
        } else {
            bnext.style.color = "lightgray";
        }
    }

    function initWidget(widget, books) {
        try {
            fillCounter(widget, books);
            fillMDContainer(widget, books);
            fillHTMLContainer(widget, books);
            initPrevLink(widget);
            initNextLink(widget);
            return widget;
        } catch (e) {
            console.warn(e);
            return widget;
        }
    }

    function injectWidgets() { // -> : ドキュメントを走査してウィジェットを埋め込む
        selectorsAndParsers.forEach(function(record) {
            var parser = record[0];
            var parseeSel = record[1];
            var containers = document.querySelectorAll(parseeSel);
            containers = [].slice.call(containers).map(function(e){
                // .s9Multipack は親がぜんぶ共通なので特別扱い
                if (e.className && e.className.match(/\bs9Multipack\b/)) {
                    return e;
                } else {
                    return e.parentNode;
                }
            });
            if (!containers.length) { return; }
            var books, widget, parsee;
            for (var i = 0; i < containers.length; i++) {
                // .s9Multipackはやはり特別扱い
                if (containers[i].className && containers[i].className.match(/\bs9Multipack\b/)) {
                    parsee = containers[i];
                } else {
                    parsee = containers[i].querySelector(parseeSel); // コンテナひとつにつきパース対象一つ
                }
                if (!parsee) { continue; }
                books = parser(parsee);
                if (!books.length) {
                    console.warn("books not found. continue...");
                    continue;
                }
                widget = makeKSJWidget();
                widget = initWidget(widget, books);
                containers[i].insertBefore(widget, containers[i].firstChild);
            }
        });
    }

    // 引数には可変要素の直接の親を指定する
    function watchElem(elem) {
        var observer = new MutationObserver(function(mutations) {
            var books, target, widget;
            for (var i = 0; i < mutations.length; i++) {
                target = mutations[i].target;
                if (target.id === "rightResultsATF") {
                    books = parseResultsCol(target);
                } else if (target.id === "searchTemplate") {
                    books = parseAecenter(target);
                }
                widget = target.querySelector(".ksj-widget");
                if (widget && books.length > 0) {
                    initWidget(widget, books);
                }
            }
        });
        var conf = { attributes: false, childList: true, characterData: false };
        // var conf = { attributes: false, childList: true, characterData: false, subtree: true}; // 高くつく
        observer.observe(elem, conf);
    }

    function main() {
        var node;
        try {
            injectWidgets();
            node = document.querySelector("#searchTemplate");
            if (node) { watchElem(node); }
            node = document.querySelector("#rightResultsATF"); // www.amazon.co.jp/s
            if (node) { watchElem(node); }
       } catch (e) {
            console.log(e);
        }
    }

    window.addEventListener("load", main, false);

})();

