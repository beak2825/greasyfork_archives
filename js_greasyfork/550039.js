// ==UserScript==
// @name         GreasyFork显示优化
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  链接改为图标按钮
// @author       ssnangua
// @match        https://greasyfork.org/*
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
    $p.querySelectorAll("a").forEach(($a) => $new.appendChild(createIconButton($a)));
    if ($new.children.length > 0) $p.replaceWith($new);
  }

  function linkAddIcon($a, icon) {
    if (!$a) return;
    icon = icon || findIcon($a);
    $a.textContent = `${icon} ${$a.textContent}`.trim();
  }

  function apply() {
    replaceLinkListToIconButtonList($$("#about-user>section, #about-user>p").pop());
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
      $ul.querySelectorAll("a").forEach(($a) => $new.appendChild(createIconButton($a)));
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
  const $sidebarred = $(".sidebarred");
  if ($aboutUser && $sidebarred) {
    $sidebarred.parentElement.insertBefore($sidebarred, $aboutUser.nextElementSibling);
    $sidebarred.parentElement.style.paddingBottom = "40px";
  }

  GM_addStyle(`
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
  `);
})();
