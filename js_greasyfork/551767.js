// ==UserScript==
// @name         tsconfig Compiler Options Catalog
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  tsconfig 编译选项目录
// @author       ssnangua
// @match        https://www.typescriptlang.org/tsconfig/*
// @match        https://www.typescriptlang.org/*/tsconfig/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typescriptlang.org
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551767/tsconfig%20Compiler%20Options%20Catalog.user.js
// @updateURL https://update.greasyfork.org/scripts/551767/tsconfig%20Compiler%20Options%20Catalog.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const $catalog = document.createElement("div");
  $catalog.id = "options-catalog";
  $catalog.innerHTML = `
    <h3>${document.querySelector(".main-content-block>h2").textContent}</h3>
    <p><input type="text" id="option-filter" /></p>
    <div>
      <ul>
        ${[...document.querySelectorAll(".main-content-block ol a")]
          .toSorted((a, b) => a.textContent.localeCompare(b.textContent))
          .map(
            ($a) =>
              `<li data-option="${$a.textContent}"><code>${$a.outerHTML}</code></li>`
          )
          .join("")}
      <ul/>
    </div>
  `;
  document.body.appendChild($catalog);

  const calculateOffset = (target, subnav) => {
    let offset = target.offsetTop;
    if (subnav) {
      // Subtract height of subnav if "position: sticky" is active
      const style = window.getComputedStyle(subnav);
      if (style.position === "sticky") {
        offset -= subnav.clientHeight;
      }
    }
    return offset;
  };

  const scrollToHash = (hash) => {
    if (hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;

    // Search for subnav if the target is a descendant of <article>
    let search = target;
    let subnav = null;
    while (search.parentElement) {
      search = search.parentElement;
      if (search.tagName === "ARTICLE") {
        subnav = search.querySelector("nav");
        break;
      }
    }

    // Smooth scroll to the target
    const offset = calculateOffset(target, subnav);
    if (!offset) return;
    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  };

  const hashLinks = $catalog.querySelectorAll("a[href^='#']");
  hashLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToHash(link.hash);

      // Update URL without triggering default scroll behavior
      window.history.pushState(null, "", link.hash);
    });
  });

  const $main = document.querySelector(".main-content-block");
  const updateLeft = () => {
    if (updateLeft.timer) clearTimeout(updateLeft.timer);
    updateLeft.timer = setTimeout(() => {
      $catalog.style.left = $main.offsetLeft - 320 + "px";
      delete updateLeft.timer;
    }, 10);
  };
  updateLeft();
  window.addEventListener("resize", updateLeft);

  const $filter = $catalog.querySelector("#option-filter");
  const options = $catalog.querySelectorAll("[data-option]");
  $filter.addEventListener("focus", () => {
    $filter.selectionStart = 0;
    $filter.selectionEnd = $filter.value.length;
  });
  $filter.addEventListener("input", () => {
    const rule = new RegExp($filter.value.trim());
    options.forEach(($li) => {
      $li.style.display = rule.test($li.dataset.option) ? "list-item" : "none";
    });
  });

  GM_addStyle(`
    [role="main"] {
      padding-left: 320px;
    }

    #options-catalog {
      width: 260px;
      padding: 0 20px;
      position: fixed;
      left: 0;
      top: 65px;
      max-height: calc(100vh - 65px - 65px);
      display: flex;
      flex-flow: column;
      background-color: var(--raised-background-color);
      box-shadow: var(--raised-box-shadow);
      color: var(--alt-text-color);

      & h3 {
        text-align: center;
        font-weight: bold;
      }

      & p:has(input) {
        display: flex;
        margin: 0;
        & input {
          flex: auto;
          outline: none;
        }
      }

      & div:has(ul) {
        overflow: auto;
        margin: 10px 0;

        & ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
      }

      & a {
        color: #000;
        text-decoration: none;
        &:hover { text-decoration: underline; }
      }
    }
  `);
})();
