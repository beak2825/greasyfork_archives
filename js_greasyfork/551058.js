// ==UserScript==
// @name         breaking quizN
// @namespace    http://tampermonkey.net/
// @version      2025-09-29.4
// @description  this breaks the name length limit in quizN, which can be used to put an image tag or something like that yk
// @author       You
// @match        https://www.quizn.show/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551058/breaking%20quizN.user.js
// @updateURL https://update.greasyfork.org/scripts/551058/breaking%20quizN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    self.addEventListener('fetch', event => {
  const url = event.request.url;
  if (url.includes('quizn_default.js?v=20210527')) {

    const body = new Response('', {status: 200, headers: {'Content-Type': 'application/javascript'}});
    event.respondWith(body);
  }
  if (url.includes('tooltipster.bundle.min.js')) {

    const body = new Response('', {status: 200, headers: {'Content-Type': 'application/javascript'}});
    event.respondWith(body);
  }
  if (url.includes('jquery-1.12.4.min.js')) {

    const body = new Response('', {status: 200, headers: {'Content-Type': 'application/javascript'}});
    event.respondWith(body);
  }

  });

  maxLengthCheck = lengthCheck = {};

  byteCheck = () => {return 1};
})();