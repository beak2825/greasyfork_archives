// ==UserScript==
// @name         네이버 카페 읽은 글 회색표시
// @namespace    http://tampermonkey.net/
// @description  이미 읽은 글 제목을 회색으로 표시합니다.
// @version      20251108
// @match        https://cafe.naver.com/MyCafeIntro.nhn*
// @match        https://cafe.naver.com/ArticleList.nhn*
// @match        https://cafe.naver.com/ca-fe/cafes/*
// @match        https://cafe.naver.com/f-e/cafes/*/menus/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555145/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EC%9D%BD%EC%9D%80%20%EA%B8%80%20%ED%9A%8C%EC%83%89%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/555145/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EC%9D%BD%EC%9D%80%20%EA%B8%80%20%ED%9A%8C%EC%83%89%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==
document.head.innerHTML+=`<style>a.article:visited,a.tit:visited,a.m-tcol-c:visited{color:#ccc !important;}</style>`;
