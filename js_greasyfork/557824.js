// ==UserScript==
// @name         Faved
// @namespace    https://github.com/denho/faved
// @version      0.2.0
// @description  Save a bookmark by pressing Alt + B.
// @author       sachinsenal0x64
// @license      MIT
// @icon         https://faved.dev/cdn-cgi/image/format=auto/static/images/faved-logo-blue.png
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557824/Faved.user.js
// @updateURL https://update.greasyfork.org/scripts/557824/Faved.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function runBookmarklet() {
    try {
      const params = new URLSearchParams();
      params.append("url", window.location.href);
      params.append("title", document.title);

      const desc = document.querySelector('meta[name="description"]');
      if (desc) params.append("description", desc.getAttribute("content") || "");

      const ogImg =
        document.querySelector('meta[property="og:image"]')?.getAttribute("content") ??
        document.querySelector('meta[name="twitter:image"]')?.getAttribute("content") ??
        Array.from(document.querySelectorAll("img"))
          .find((img) => img.naturalWidth >= 200 && img.naturalHeight >= 200)
          ?.getAttribute("src");

      if (ogImg) {
        const absolutify = (src) => {
          if (!src) return "";
          if (src.startsWith("http")) return src;
          if (src.startsWith("//")) return (window.location.protocol || "https:") + src;
          if (src.startsWith("/")) return window.location.origin + src;

          let path = window.location.pathname || "/";
          path = path.substring(0, path.lastIndexOf("/"));
          return window.location.origin + path + "/" + src;
        };
        params.append("image", absolutify(ogImg));
      }

      const target = "http://localhost:8080/create-item";

      const width = 700,
        height = 760;

      const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
      const dualScreenTop = window.screenTop ?? window.screenY ?? 0;

      const viewportW =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        screen.width;
      const viewportH =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        screen.height;

      const left = Math.floor(dualScreenLeft + (viewportW - width) / 2);
      const top = Math.floor(dualScreenTop + (viewportH - height) / 2);

      const popup = window.open(
        `${target}?${params.toString()}`,
        "createItemPopup",
        `width=${width},height=${height},left=${left},top=${top},popup=1`
      );

      if (popup) popup.focus();
    } catch (e) {
      alert("Keybind script failed: " + (e?.message || e));
    }
  }

  window.addEventListener("keydown", (ev) => {
    const isTrigger = ev.altKey && ev.code === "KeyB";

    const tag = (ev.target && ev.target.tagName) || "";
    const typing =
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      ev.target.isContentEditable;

    if (isTrigger && !typing) {
      ev.preventDefault();
      runBookmarklet();
    }
  });

  console.log("[Create-item keybind] Loaded. Press Alt+B");
})();

