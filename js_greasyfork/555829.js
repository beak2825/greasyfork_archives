// ==UserScript==
// @name         Copy Luogu Markdown
// @namespace    https://github.com/LYkcul
// @namespace    https://github.com/CuteMurasame
// @description  获取页面 Markdown 源代码（增强版）
// @author       BlackPanda (Modified by Murasame)
// @license      MIT
// @version      1.2.2
// @match        https://www.luogu.com.cn/*
// @match        https://www.luogu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555829/Copy%20Luogu%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/555829/Copy%20Luogu%20Markdown.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function injectStyle() {
    var style = document.createElement("style");
    style.textContent = `
    .lcolor-var-green-3 {
        --lcolor-rgb: 82, 196, 26;
    }
    .lcolor-var-blue-3 {
        --lcolor-rgb: 52, 152, 219;
    }
    .lcolor-var-red-3 {
        --lcolor-rgb: 231, 76, 60;
    }
    .copy-markdown-btn {
        --l-button--real-color: var(--lcolor-rgb, var(--lcolor--primary, var(--lcolor--primary, 52, 152, 219)));
        display: inline-block;
        outline: none;
        cursor: pointer;
        font-weight: inherit;
        line-height: 1.5;
        text-align: center;
        vertical-align: middle;
        border-radius: 3px;
        border: 1px solid rgb(var(--l-button--real-color));
        background: rgba(var(--l-button--real-color),0) none;
        color: rgb(var(--l-button--real-color));
        margin-right: .5em;
    }
    .copy-markdown-btn-contest {
        --l-button--real-color: var(--lcolor-rgb, var(--lcolor--primary, var(--lcolor--primary, 52, 152, 219)));
        display: inline-block;
        outline: none;
        cursor: pointer;
        font-weight: inherit;
        line-height: 1.5;
        text-align: center;
        vertical-align: middle;
        border-radius: 3px;
        border: 1px solid rgb(var(--l-button--real-color));
        background: rgb(var(--l-button--real-color));
        color: #fff;
        margin-right: .5em;
    }
    /* why no margin-right on exlg-cph??? */
    .exlg-cph + .copy-markdown-btn-contest {
        margin-left: .5em;
    }
    `;
    document.head.appendChild(style);
  }
  /*====================*/
  const routes = [
    {
      name: "article_show",
      match: (path) => /^\/(article)\/(?!mine$|_?new$)[A-Za-z0-9]+$/.test(path),
      mount: ".user-nav",
      getContent: async () => {
        let ele = document.querySelector("script#lentille-context");
        let json = JSON.parse(ele.textContent.trim());
        let url = location.href;
        if (url.endsWith("/")) url = url.slice(0, -1);
        if (
          json.template !== "article.show" ||
          json.data.article.lid !== url.split("/").pop()
        ) {
          console.log("[DEBUG] retry");
          const res = await fetch(location.href, {
            credentials: "include",
            headers: {
              "x-requested-with": "XMLHttpRequest",
              "x-lentille-request": "content-only",
            },
          });
          const html = await res.text();
          json = JSON.parse(html.trim());
        }
        console.log(json);
        const content = json.data?.article?.content || "复制失败";
        return content;
      },
    },
    {
      name: "user_detail",
      match: (path) => /^\/user\/\d+(?:\/.*)?$/.test(path),
      mount: ".user-nav",
      getContent: async () => {
        try {
          const m = location.pathname.match(/^\/user\/(\d+)/);
          if (!m) return "复制失败";
          const uid = m[1];
          const res = await fetch(`https://www.luogu.com.cn/api/user/info/${uid}`, {
            credentials: "include",
          });
          const json = await res.json();
          console.log(json);
          const content = json?.user?.introduction || "复制失败";
          return content;
        } catch (e) {
          console.error("[copy-markdown] user api error:", e);
          return "复制失败";
        }
      },
    },
    {
      name: "discuss_detail",
      match: (path) => /^\/discuss\/\d+$/.test(path),
      mount: ".user-nav",
      getContent: async () => {
        try {
          console.log("[DEBUG] discuss fetch");
          const res = await fetch(location.href, {
            credentials: "include",
            headers: {
              "x-requested-with": "XMLHttpRequest",
              "x-lentille-request": "content-only",
            },
          });
          const text = await res.text();
          const json = JSON.parse(text.trim());
          console.log(json);
          const content = json.data?.post?.content || "复制失败";
          return content;
        } catch (e) {
          console.error("[copy-markdown] discuss error:", e);
          try {
            const ctxEl = document.getElementById("lentille-context");
            if (!ctxEl) return "复制失败";
            const json = JSON.parse(ctxEl.textContent.trim());
            const content = json.data?.post?.content || "复制失败";
            return content;
          } catch (e2) {
            console.error("[copy-markdown] discuss fallback error:", e2);
            return "复制失败";
          }
        }
      },
    },
    {
      name: "contest_detail",
      match: (path) => /^\/contest\/\d+$/.test(path),
      test: (url) =>
        !(url.hash && url.hash.length > 1 && url.hash !== "#description"),
      mount: ".functional > .operation",
      specialMount: true,
      getContent: async () => {
        return _feInstance.currentData.contest.description || "复制失败";
      },
      className:
        "lfe-form-sz-middle lcolor-var-blue-3 copy-markdown-btn-contest",
      classNameSucc:
        "lfe-form-sz-middle lcolor-var-green-3 copy-markdown-btn-contest",
      classNameErr:
        "lfe-form-sz-middle lcolor-var-red-3 copy-markdown-btn-contest",
      selfMount: ".copy-markdown-btn-contest",
    },
    {
      name: "training_detail",
      match: (path) => /^\/training\/\d+$/.test(path),
      test: (url) =>
        !(url.hash && url.hash.length > 1 && url.hash !== "#information"),
      mount: ".functional > .operation",
      specialMount: true,
      getContent: async () => {
        return _feInstance.currentData.training.description || "复制失败";
      },
      className:
        "lfe-form-sz-middle lcolor-var-blue-3 copy-markdown-btn-contest",
      classNameSucc:
        "lfe-form-sz-middle lcolor-var-green-3 copy-markdown-btn-contest",
      classNameErr:
        "lfe-form-sz-middle lcolor-var-red-3 copy-markdown-btn-contest",
      selfMount: ".copy-markdown-btn-contest",
    },
  ];
  function getRoute() {
    const path = location.pathname;
    return (
      routes.find((r) => {
        return (
          (typeof r.test === "function" ? r.test(location) : true) &&
          r.match(path)
        );
      }) || null
    );
  }
  function isValidUrl() {
    return !!getRoute();
  }
  function cleanupBtn() {
    document
      .querySelectorAll("#copy-markdown-mount")
      .forEach((el) => el.remove());
  }
  async function insertBtn() {
    const route = getRoute();
    if (!route) return false;
    const nav = document.querySelector(route.mount || ".user-nav");
    if (!nav) return;
    if (nav.querySelector(".copy-markdown-btn")) return true;
    let btn = document.createElement("button");
    btn.textContent = "复制源代码";
    btn.type = "button";
    btn.id = "copy-markdown-mount";
    btn.className =
      route.className ||
      "lform-size-middle lcolor-var-blue-3 copy-markdown-btn";
    btn.addEventListener("click", async () => {
      try {
        console.log("[DEBUG] route: ", route.name);
        const content = await route.getContent();
        await navigator.clipboard.writeText(content);
        btn.textContent = "复制成功";
        btn.className =
          route.classNameSucc ||
          "lform-size-middle lcolor-var-green-3 copy-markdown-btn";
      } catch (e) {
        console.error("复制失败:", e);
        btn.textContent = "复制失败";
        btn.className =
          route.classNameErr ||
          "lform-size-middle lcolor-var-red-3 copy-markdown-btn";
      } finally {
        setTimeout(() => {
          btn.textContent = "复制源代码";
          btn.className =
            route.className ||
            "lform-size-middle lcolor-var-blue-3 copy-markdown-btn";
        }, 600);
      }
    });
    if (route.specialMount) {
      nav.insertBefore(btn, nav.lastChild.nextSibling);
    } else {
      nav.insertBefore(btn, nav.firstChild);
    }
    return true;
  }
  function handleUrlChange() {
    injectStyle();
    if (!isValidUrl()) {
      cleanupBtn();
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      if (!isValidUrl()) {
        clearInterval(timer);
        cleanupBtn();
        return;
      }
      if (insertBtn()) {
        clearInterval(timer);
        return;
      }
      if (Date.now() - start > 3000) clearInterval(timer);
    }, 100);
  }
  const fireUrlChange = () =>
    window.dispatchEvent(new Event("userscript:urlchange"));
  const _ps = history.pushState,
    _rs = history.replaceState;
  history.pushState = function (...a) {
    const r = _ps.apply(this, a);
    fireUrlChange();
    return r;
  };
  history.replaceState = function (...a) {
    const r = _rs.apply(this, a);
    fireUrlChange();
    return r;
  };
  window.addEventListener("popstate", fireUrlChange);
  window.addEventListener("hashchange", fireUrlChange);
  window.addEventListener("userscript:urlchange", () => {
    cleanupBtn();
    setTimeout(handleUrlChange, 0);
  });
  const init = () => handleUrlChange();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();