// ==UserScript==
// @name         GreasyFork显示优化
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  链接改为图标按钮，顶部增加粘性导航栏，面板可折叠
// @author       ssnangua
// @match        https://greasyfork.org/*
// @match        https://sleazyfork.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550039/GreasyFork%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/550039/GreasyFork%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const R = (pattern) => new RegExp(pattern);
  const iconList = [
    { icon: "🎨", pathname: "/script_versions/new", search: "language=css" },
    { icon: "👨‍💻", pathname: "/script_versions/new" },
    { icon: "🗃️", pathname: R`/users/.*/sets/new$` },
    { icon: "📥", pathname: "/import" },
    { icon: "🛠️", pathname: "/webhook-info" },
    { icon: "🙍🏻‍♂️", pathname: "/users/edit" },
    { icon: "🔏", pathname: "/users/edit_sign_in" },
    { icon: "💬", pathname: "/notifications" },
    { icon: "🗨️", pathname: "/notification_settings" },
    { icon: "🗑️", pathname: "/users/delete_info" },
    { icon: "🏃", pathname: "/users/sign_out" },

    { icon: "📅", pathname: "/discussions", search: "user=" },

    { icon: "💬", pathname: R`/users/.*/conversations/new$` },

    { icon: "⭐", pathname: "/scripts", search: "set=" },
    { icon: "✏️", pathname: R`/users/.*/sets/.*/edit$` },
    { icon: "✏️", pathname: R`/users/.*/sets/new$`, search: "fav=1" },

    { icon: "🔔", pathname: R`/scripts/.*/discussions/.*/subscribe$` },
    { icon: "🔕", pathname: R`/scripts/.*/discussions/.*/unsubscribe$` },
  ];

  function findIcon($a) {
    const item = iconList.find((item) => {
      // pathname
      if (item.pathname instanceof RegExp) {
        if (!item.pathname.test($a.pathname)) return false;
      } else if (typeof item.pathname === "string") {
        if (!$a.pathname.endsWith(item.pathname)) return false;
      }
      // search
      if (item.search instanceof RegExp) {
        if (!item.search.test($a.search)) return false;
      } else if (typeof item.search === "string") {
        if (!$a.search.includes(item.search)) return false;
      }
      return true;
    });
    return item?.icon || "";
  }

  function createIconButton($a, icon) {
    const $button = document.createElement("button");
    icon = icon || findIcon($a);
    const text = $a.textContent.trim();
    $button.textContent = `${icon} ${text}`.trim();
    $button.dataset.href = $a.getAttribute("href");
    $button.addEventListener("click", () => (location.href = $a.href));
    return $button;
  }

  function replaceLinkToIconButton($a, icon) {
    if (!$a) return;
    const $button = createIconButton($a, icon);
    $button.className = $a.className;
    Object.assign($button.dataset, $a.dataset);
    $a.replaceWith($button);
  }

  function replaceLinkListToIconButtonList($p) {
    if (!$p) return;
    const $new = document.createElement("p");
    $new.className = "icon-button-list";
    $p.querySelectorAll("a").forEach(($a) =>
      $new.appendChild(createIconButton($a)),
    );
    if ($new.children.length > 0) $p.replaceWith($new);
  }

  function linkAddIcon($a, icon) {
    if (!$a) return;
    icon = icon || findIcon($a);
    $a.textContent = `${icon} ${$a.textContent}`.trim();
  }

  function apply() {
    replaceLinkListToIconButtonList(
      $$("#about-user>section, #about-user>p").pop(),
    );
    replaceLinkListToIconButtonList($$("#user-discussions>section>p").pop());
    replaceLinkToIconButton($("#user-conversations a"));

    linkAddIcon($(".discussion-subscribe"));
    linkAddIcon($(".discussion-unsubscribe"));
    $$("a.quote-comment").forEach(($a) => linkAddIcon($a, "❝"));
    $$("a.report-link").forEach(($a) => linkAddIcon($a, "⚠️"));

    const $ul = $("ul#user-script-sets");
    if ($ul) {
      const $new = document.createElement("p");
      $new.className = "icon-button-list";
      $ul
        .querySelectorAll("a")
        .forEach(($a) => $new.appendChild(createIconButton($a)));
      $ul.replaceWith($new);
    }
  }
  apply();

  const observer = new MutationObserver(function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes[0]?.tagName === "BODY") apply();
    }
  });
  observer.observe(document.body.parentElement, { childList: true });

  // 脚本面板移到用户面板下面
  const $aboutUser = $("#about-user");
  // const $sidebarred = $(".sidebarred");
  // if ($aboutUser && $sidebarred) {
  //   $sidebarred.parentElement.insertBefore(
  //     $sidebarred,
  //     $aboutUser.nextElementSibling,
  //   );
  //   $sidebarred.parentElement.style.paddingBottom = "40px";
  // }

  // 折叠内容
  document
    .querySelectorAll(
      [
        "#user-script-list-section",
        "#user-unlisted-script-list-section",
        "#user-library-list-section",
        "#user-discussions-on-scripts-written",
        "#user-discussions",
        "#user-conversations",
        "#user-script-sets-section",
      ].join(", "),
    )
    .forEach(($section) => {
      const $details = document.createElement("details");
      $details.id = $section.id;
      $details.open = true;
      const $summary = document.createElement("summary");
      $summary.appendChild($section.children[0]);
      $details.appendChild($summary);
      $details.appendChild($section.children[0]);
      $section.replaceWith($details);
    });

  // 导航栏
  const navIcon = {
    "user-discussions-on-scripts-written": "💬",
    "user-script-list-section": "📜",
  };
  const $nav = document.createElement("div");
  $nav.classList.add("sticky-nav");
  $nav.innerHTML =
    '<a class="nav-item" href="javascript:;" data-target="top">⬆ TOP</a>' +
    Array.from(document.querySelectorAll("details"))
      .map(($details) => {
        const id = $details.id;
        const icon = navIcon[id] ? navIcon[id] + " " : "";
        const text = $details.querySelector("summary").textContent.trim();
        return `<a class="nav-item" href="javascript:;" data-target="${id}">${icon}${text}</a>`;
      })
      .join("");
  $nav.onclick = (e) => {
    const { target } = e.target.dataset;
    if (target) {
      if (target === "top") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        const $target = document.getElementById(target);
        const topOffset = e.target.offsetHeight + 20;
        window.scrollTo({
          top: $target.offsetTop - topOffset,
          behavior: "smooth",
        });
      }
    }
  };
  $aboutUser.parentElement.insertBefore($nav, $aboutUser);

  GM_addStyle(`
    .ad-rb {
      display: none;
    }

    .sticky-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 0 5px var(--content-box-shadow-color);
      border: 1px solid var(--content-border-color);
      border-radius: 5px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: 0;
      background-color: var(--content-background-color);

      display: flex;

      & a.nav-item {
        display: inline-block;
        padding: 10px 20px;
        border-right: 1px solid var(--content-border-color);
        text-decoration: none;

        &:hover {
          background: linear-gradient(var(--list-option-background-color-gradient-1), var(--list-option-background-color-gradient-2));
        }
      }
    }

    #about-user {
      margin-top: 20px;
    }

    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    .icon-button-list {
      display: flex;
      flex-flow: row wrap;
      gap: 4px;
    }

    summary {
      margin-top: 20px;
      & > header {
        display: inline-block;
        & h3 {
          margin: 0;
        }
      }
    }
  `);
})();
