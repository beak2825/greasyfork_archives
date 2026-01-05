// ==UserScript==
// @name         Warden
// @namespace    warden.mal.watch
// @version      1.2.1
// @match        https://myanimelist.net/animelist/*
// @grant        GM_xmlhttpRequest
// @connect      hianime.to
// @description  Checkout my blog: https://daduckyblog.blogspot.com/
// @license      DUCKY LICENSE

// @downloadURL https://update.greasyfork.org/scripts/561398/Warden.user.js
// @updateURL https://update.greasyfork.org/scripts/561398/Warden.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const ICON = "https://cdn2.steamgriddb.com/icon/a0e7be097b3b5eb71d106dd32f2312ac.png";

  const base = "https://hianime.to";

  const norm = t => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const typeOf = t => {
    t = t.toLowerCase();
    if (t.includes("season 3")) return "s3";
    if (t.includes("season 2") || t.includes("2nd season")) return "s2";
    if (t.includes("movie")) return "movie";
    if (t.includes("ova")) return "ova";
    if (t.includes("special")) return "sp";
    return "s1";
  };

  const score = (a, b) => {
    const A = norm(a).split(" ");
    const B = norm(b).split(" ");
    return A.filter(x => B.includes(x)).length / Math.max(A.length, B.length);
  };

  const close = () => {
    document.querySelector(".mal-modal")?.remove();
    document.querySelector(".mal-modal-backdrop")?.remove();
  };

  const modal = title => {
    close();
    const m = document.createElement("div");
    m.className = "mal-modal show";
    m.innerHTML = `
      <div class="mal-modal-dialog">
        <div class="mal-modal-content">
          <div class="mal-modal-header">
            <div class="title">${title}</div>
          </div>
          <div class="mal-modal-body">
            <div style="padding:16px;opacity:.7">Loading stream…</div>
          </div>
          <button class="btn-close">✕</button>
        </div>
      </div>`;
    const b = document.createElement("div");
    b.className = "mal-modal-backdrop show";
    b.onclick = close;
    m.querySelector(".btn-close").onclick = close;
    document.body.append(b, m);
  };

  const resolveSeason = (url, title) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      onload: r => {
        const d = new DOMParser().parseFromString(r.responseText, "text/html");
        const want = typeOf(title);
        const items = [...d.querySelectorAll(".os-list .os-item")];
        if (!items.length || want === "s1") {
          window.open(url, "_blank");
          close();
          return;
        }
        let pick = null;
        items.forEach(i => {
          const t = i.textContent.toLowerCase();
          if (
            (want === "s2" && t.includes("season 2")) ||
            (want === "s3" && t.includes("season 3")) ||
            (want === "movie" && t.includes("movie")) ||
            (want === "ova" && t.includes("ova")) ||
            (want === "sp" && t.includes("special"))
          ) pick = i;
        });
        window.open(base + (pick ? pick.getAttribute("href") : items[0].getAttribute("href")), "_blank");
        close();
      }
    });
  };

  const openHi = title => {
    modal(title);
    GM_xmlhttpRequest({
      method: "GET",
      url: `${base}/search?keyword=${encodeURIComponent(title)}`,
      onload: r => {
        const d = new DOMParser().parseFromString(r.responseText, "text/html");
        const items = [...d.querySelectorAll(".flw-item")]
          .map(i => ({
            name: i.querySelector(".dynamic-name")?.textContent || "",
            href: i.querySelector(".film-poster-ahref")?.getAttribute("href"),
            score: score(title, i.querySelector(".dynamic-name")?.textContent || "")
          }))
          .filter(x => x.href)
          .sort((a, b) => b.score - a.score);
        if (!items.length) return close();
        resolveSeason(base + items[0].href, title);
      }
    });
  };

  const inject = () => {
    document.querySelectorAll("td.data.title").forEach(td => {
      const w = td.querySelector(".icon-watch2");
      if (!w || w.querySelector(".warden-watch")) return;
      const title = td.querySelector("a.link")?.textContent.trim();
      if (!title) return;
      const a = document.createElement("a");
      a.href = "#";
      a.className = "warden-watch";
      a.innerHTML = `<img src="${ICON}" style="width:16px;height:16px">`;
      a.onclick = e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        openHi(title);
      };
      w.innerHTML = "";
      w.appendChild(a);
    });
  };

  new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
  inject();
})();
