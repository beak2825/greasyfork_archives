// ==UserScript==
// @name         풍투데이 편하게 보기
// @namespace    RetrieverEngine_SOOP
// @version      2026-01-27.001
// @description  풍투데이를 편하기 봅시다
// @author       RetrieverEngine
// @match        https://poong.today/broadcast/*
// @license      All rights reserved
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poong.today
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564193/%ED%92%8D%ED%88%AC%EB%8D%B0%EC%9D%B4%20%ED%8E%B8%ED%95%98%EA%B2%8C%20%EB%B3%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/564193/%ED%92%8D%ED%88%AC%EB%8D%B0%EC%9D%B4%20%ED%8E%B8%ED%95%98%EA%B2%8C%20%EB%B3%B4%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('.adsbygoogle').forEach(el => el.remove());
})();