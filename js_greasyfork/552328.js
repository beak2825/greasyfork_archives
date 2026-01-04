// ==UserScript==
// @name         FitGirl Endless Scroll by Doc00n
// @namespace    fitgirl-endless-scroll
// @version      1.0
// @description  Automatically load next FitGirl pages when scrolling down
// @match        https://fitgirl-repacks.site/page/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552328/FitGirl%20Endless%20Scroll%20by%20Doc00n.user.js
// @updateURL https://update.greasyfork.org/scripts/552328/FitGirl%20Endless%20Scroll%20by%20Doc00n.meta.js
// ==/UserScript==

(function () {
  let loading = false;
  let nextPage = parseInt(window.location.pathname.match(/page\/(\d+)/)?.[1] || 1) + 1;

  async function loadNextPage() {
    if (loading) return;
    loading = true;

    console.log("Loading page", nextPage);

    try {
      const res = await fetch(`https://fitgirl-repacks.site/page/${nextPage}/`);
      if (!res.ok) throw new Error("Failed to fetch next page");

      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      const posts = doc.querySelectorAll(".post");
      const container = document.querySelector("#content");

      posts.forEach(post => container.appendChild(post));
      nextPage++;
    } catch (e) {
      console.error("Error loading next page:", e);
    } finally {
      loading = false;
    }
  }

  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2000) {
      loadNextPage();
    }
  });
})();
