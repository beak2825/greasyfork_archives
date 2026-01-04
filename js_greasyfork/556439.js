// ==UserScript==
// @name        Zlepšovač uživatelského komfortu pro FIT gitlab
// @namespace   Violentmonkey Scripts
// @match       https://gitlab.fit.cvut.cz/*
// @grant       none
// @version     1.2
// @author      jakub.zip
// @run-at      document-start
// @description Nahradí nudný Anubis default mnohem lepším obrázkem.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556439/Zlep%C5%A1ova%C4%8D%20u%C5%BEivatelsk%C3%A9ho%20komfortu%20pro%20FIT%20gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/556439/Zlep%C5%A1ova%C4%8D%20u%C5%BEivatelsk%C3%A9ho%20komfortu%20pro%20FIT%20gitlab.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const COOLER_STEPECH = false; // premium verze

  const cool_website = "https://jakub.zip/lmao/";
  const replacing = ["pensive.webp", "happy.webp"];

  function make_website_awesome() {
    let images = document.querySelectorAll("img");
    if (!images) return;
    images.forEach(img => {
      replacing.forEach(needle => {
        if (img.src.includes(needle)) {
          img.src = cool_website + (COOLER_STEPECH ? "cooler/" : "default/") + needle;
        }
      })
    });
  }
  make_website_awesome();
  document.addEventListener("DOMContentLoaded", make_website_awesome);
  window.addEventListener("load", make_website_awesome);
})();