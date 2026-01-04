// ==UserScript==
// @name         FitGirl Infinite Scroll
// @namespace    https://github.com/thegouhund
// @version      1.0
// @description  Infinite scrolling with floating navbar, supports up and down
// @match        https://fitgirl-repacks.site/
// @match        https://fitgirl-repacks.site/page/*
// @grant        none
// @author       gouhund
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556634/FitGirl%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/556634/FitGirl%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    @media (max-width: 1024px) {
      #secondary,
      #colophon {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  const POST_SELECTOR = "article";
  const NEXT_SELECTOR = "a.next";
  const PREV_SELECTOR = "a.prev";

  let container = document.querySelector("#content");
  if (!container) return;

  let navElem = container.querySelector("nav");
  let nextUrl = (document.querySelector(NEXT_SELECTOR) || {}).href || null;
  let prevUrl = (document.querySelector(PREV_SELECTOR) || {}).href || null;

  if (navElem) {
    navElem.style.position = "fixed";
    navElem.style.bottom = "0px";
    navElem.style.right = "0px";
    navElem.style.background = "rgba(255,255,255,1)";
    navElem.style.color = "#000";
    navElem.style.padding = "0px";
    navElem.style.borderRadius = "0px";
    navElem.style.zIndex = "9999";
  }

  let loading = false;

  async function loadPage(url, direction) {
    if (loading || !url) return;
    loading = true;
    console.log("fetching", url)
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) {
      loading = false;
      return;
    }

    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    if (direction === "next") {
      const newPosts = doc.querySelectorAll(POST_SELECTOR);
      newPosts.forEach((p) =>
        container.appendChild(document.importNode(p, true)),
      );
    } else {
      const firstVisible = container.querySelector(POST_SELECTOR);
      const newPosts = doc.querySelectorAll(POST_SELECTOR);

      let totalHeight = 0;
      newPosts.forEach((p) => {
        const clone = document.importNode(p, true);
        clone.style.visibility = "hidden";
        container.insertBefore(clone, firstVisible);
        totalHeight += clone.offsetHeight;
        container.removeChild(clone);
      });

      newPosts.forEach((p) => {
        container.insertBefore(document.importNode(p, true), firstVisible);
      });

      window.scrollBy(0, totalHeight);
    }

    const newNav = doc.querySelector("#content > nav");
    if (newNav && navElem) navElem.innerHTML = newNav.innerHTML;
    nextUrl = (doc.querySelector(NEXT_SELECTOR) || {}).href || null;
    prevUrl = (doc.querySelector(PREV_SELECTOR) || {}).href || null;

    loading = false;
  }

  function nearBottom(offset = 500) {
    const content = document.querySelector("#content");
    if (!content) return false;
    const contentBottom = content.offsetTop + content.offsetHeight;
    return window.scrollY + window.innerHeight >= contentBottom - offset;
  }

  function nearTop(offset = 200) {
    const content = document.querySelector("#content");
    if (!content) return false;
    return window.scrollY <= content.offsetTop + offset;
  }

  window.addEventListener("scroll", () => {
    if (nearBottom()) loadPage(nextUrl, "next");
    if (nearTop()) loadPage(prevUrl, "prev");
  });

  if (nearBottom()) loadPage(nextUrl, "next");
})();
