// ==UserScript==
// @name        お気に入り＋ for reddit
// @namespace   http://www.reddit.com/user/nmtake
// @description reddit の「保存」ページに表示されるスレに新着コメント数を追加し、コンパクトな一行表示にするスクリプトです。
// @include     https://*.reddit.com/*
// @version     0.2
// @grant       none
// @license     public domain
// @author      nmtake
// @downloadURL https://update.greasyfork.org/scripts/9569/%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%EF%BC%8B%20for%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/9569/%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%EF%BC%8B%20for%20reddit.meta.js
// ==/UserScript==

/* global window, document, indexedDB, console */
/* eslint no-console:0 */

(function() {
    "use strict";
    var DB_NAME = "OkiniiriPlusForReddit";
    var STORE_TLINKS = "tLinks";
    var STORE_CONFIGS = "configs";
    var CLASS_NAME_BADGE_UNREAD = "op-badge-unread";

    var db;
    var DB_VERSION = 1;

    function parseTLink(tLink) {
        var s = {};
        s.fullname = tLink.getAttribute("data-fullname");
        var a = tLink.querySelector("a.comments");
        var temp = a.textContent.match(/^\d+/);
        s.commentsCount = temp ? parseInt(temp[0], 10) : 0;
        s.commentsURL = a.href;
        return s;
    }

    function hideComment(tcomment) {
        tcomment.style.display = "none";
    }

    function toggleBlockDisplay(block) {
        if (block.style.display === "block" || block.style.display === "") {
            block.style.display = "none";
        } else {
            thing.style.display = ""; // default
        }
    }

    function shrinkTLink(tlink) {
        tlink.style.marginBottom = "0";
        var elems = tlink.querySelectorAll(".domain, .midcol, .thumbnail, .tagline, .flat-list, .expando-button, .rank");
        for (var i = 0; i < elems.length; i++) {
            elems[i].style.display = "none";
        }
        var title = tlink.querySelector("p.title");
        title.style.maxWidth = "100%";
        title.style.textOverflow = "ellipsis";
        title.style.whiteSpace = "nowrap";
        title.querySelector("a.title").style.fontSize = "14px";
    }

    function expandTLink(tlink) {
        tlink.style.marginBottom = "8";
        var elems = tlink.querySelectorAll(".domain, .midcol, .thumbnail, .tagline, .flat-list, .expando-button, .rank");
        for (var i = 0; i < elems.length; i++) {
            elems[i].style.display = "";
        }
        var title = tlink.querySelector("p.title");
        title.style.maxWidth = "";
        title.style.whiteSpace = "";
        title.querySelector("a.title").style.fontSize = "medium";
    }

    function makeBadge(classname, count, url) {
        count = count || "0";
        var badge = document.createElement("a");
        if (parseInt(count, 10) > 100) {
            badge.textContent = "100+";
        } else { 
            badge.textContent = count;
        }
        badge.className = classname;
        badge.style.width = "42px";
        badge.style.height = "15px";
        badge.style.borderRadius = "3px";
        badge.style.border = "1px solid gray";
        badge.style.fontSize = "12px";
        badge.style.textAlign = "center";
        badge.style.backgroundColor = "white";
        badge.style.display = "inline-block";
        badge.style.margin = "0 3px";
        badge.href = url;
        return badge;
    }

    function getCommentsCount(tlink) {
        var a = tlink.querySelector("a.comments");
        var temp = a.textContent.match(/\d+/);
        var commentsCount = 0;
        if (temp) {
            commentsCount = temp[0];
        }
        return parseInt(commentsCount, 10);
    }

    function deleteDB() {
        window.indexedDB.deleteDatabase(DB_NAME);
        window.alert("database " + DB_NAME + " deleted");
    }

    function upgradeDB(event) {
        try { 
            db = event.target.result; // 忘れやすい
            if (event.oldVersion < 1) { // 新規
                var store = db.createObjectStore(STORE_TLINKS, {keyPath: "fullname"});
                store.createIndex("commentsCount", "commentsCount", {unique: false});
                store.createIndex("lastReadTime", "lastReadTime", {unique: false});
                store.createIndex("lastReadCommentsCount", "lastReadCommentsCount", {unique: false});
            }
        } catch (e) {
            console.log(e);
        }
    }

    function preProcessProfilePage() {
        var comments = document.querySelectorAll(".thing.comment");
        for (var i = 0; i < comments.length; i++) {
            hideComment(comments[i]);
        }
        var links = document.querySelectorAll(".thing.link");
        var badge, p, count;
        for (i = 0; i < links.length; i++) {
            shrinkTLink(links[i]);
            badge = makeBadge(CLASS_NAME_BADGE_UNREAD, 114514, parseTLink(links[i]).commentsURL);
            p = links[i].querySelector("p.title");
            p.insertBefore(badge, p.firstChild);
        }
    }

    function preProcessListingPage() {
        var links = document.querySelectorAll(".thing.link");
        var badge, buttons, count;
        for (var i = 0; i < links.length; i++) {
            badge = makeBadge(CLASS_NAME_BADGE_UNREAD, 114514, parseTLink(links[i]).commentsURL);
            buttons = links[i].querySelector(".buttons");
            buttons.insertBefore(badge, buttons.firstChild);
        }
    }

    function preProcessCommentsPage() { }

    function makeUpdateCommentCountFunc(tlink, event) { // このevent.targetはIDBDatabase。なんで？
        return function() {
            try {
                var badge = tlink.querySelector("." + CLASS_NAME_BADGE_UNREAD);
                var commentsCount = getCommentsCount(tlink);
                var lastReadCommentsCount;
                if (this.result) { // this.result が偽になることもある
                    lastReadCommentsCount = this.result.lastReadCommentsCount || 0;
                    badge.textContent = (commentsCount - lastReadCommentsCount).toString();
                } else {
                    badge.textContent = commentsCount;
                }
            } catch (e) {
                console.log(e);
            }
        };
    }

    function processCommentsPage(event) {
        try {
            db = event.target.result;
            var transaction = db.transaction([STORE_TLINKS], "readwrite");
            transaction.oncomplete = function() { console.log("transaction complete on", window.location.href); };
            transaction.onerror = function() { console.error("transaction error on ", window.location.href); };
            var store = transaction.objectStore(STORE_TLINKS);
            var obj = parseTLink(document.querySelector(".link.thing"));
            obj.lastReadCommentsCount = obj.commentsCount;
            obj.lastReadTime = new Date();
            store.put(obj);
        } catch (e) {
            console.log(e);
        }
    }

    function processListingPage(event) {
        try {
            db = event.target.result;
            var tlinks = document.querySelectorAll(".thing.link");
            var transaction = db.transaction([STORE_TLINKS], "readonly");
            transaction.oncomplete = function() { console.log("transaction complete on ", window.location.href); };
            transaction.onerror = function() { console.error("transaction failed on ", window.location.href); };
            store = transaction.objectStore(STORE_TLINKS);
            // 実際にonsuccessが呼ばれる頃にはループはまわりきっている
            var req;
            for (var i = 0; i < tlinks.length; i++) {
                req = store.get(parseTLink(tlinks[i]).fullname);
                req.onsuccess = makeUpdateCommentCountFunc(tlinks[i], event);
            }
        } catch (e) {
            console.log(e);
        }
    }
 
    var processProfilePage = processListingPage;

    function main() {
        // deleteDB(); return 0;
        if (!window.indexedDB) {
            window.alert("お使いのブラウザではお気に入り＋ for redditを使用できません。");
            return 1;
        }
        (function() {
            var s = document.body.className;
            var renderFunc;
            if (s.match(/\bprofile-page\b/) && window.location.href.match(/\bsaved\b/)) {
                preProcessProfilePage();
            } else if (s.match(/\bprofile-page\b/)) {
                ; 
            } else if (s.match(/\blisting-page\b/)) {
                preProcessListingPage();
            } else if (s.match(/\bcomments-page\b/)) {
                preProcessCommentsPage();
            } else {
                return;
            }
        })();

        var req = window.indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = upgradeDB;
	req.onsuccess = function(event) {
            var s = document.body.className;
            try {
                if (s.match(/\bprofile-page\b/) && window.location.href.match(/\bsaved\b/)) {
                    processProfilePage(event);
                } else if (s.match(/\bprofile-page\b/)) {
                    ; 
                } else if (s.match(/\blisting-page\b/)) {
                    processListingPage(event);
                } else if (s.match(/\bcomments-page\b/)) {
                    processCommentsPage(event);
                }
            } catch (e) {
                console.log(e);
            }
        }
        req.onerror = function(event) {
            console.error("データベースの生成または更新に失敗しました。", e);
        }
    }

    try {
        main();
    } catch(e) {
        console.log(e);
    }
})();



