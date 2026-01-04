// ==UserScript==
// @name         Inbox Favicon Notifier for Linear
// @namespace    http://tampermonkey.net/
// @version      2025-09-04
// @description  Changes the favicon to a red icon when there are unread items in the Linear inbox.
// @author       Blake Stacks
// @match        https://linear.app/transcend/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linear.app
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/548266/Inbox%20Favicon%20Notifier%20for%20Linear.user.js
// @updateURL https://update.greasyfork.org/scripts/548266/Inbox%20Favicon%20Notifier%20for%20Linear.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const svgHtml = `
  <svg
  class=""
  width="350"
  height="350"
  viewBox="0 0 100 100"
  fill="lch(66% 80 48)"
  role="img"
  focusable="false"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  style="--icon-color: lch(66% 80 48)"
>
  <!-- Red version of Linear favicon -->
  <path
    d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
  ></path>
  <g x="50" y="50">
    <!-- black rounded box around text -->
    <rect
      x="30"
      y="40"
      width="70%"
      height="60%"
      rx="2"
      ry="2"
      fill="black"
    ></rect>
    <!-- notification count -->
    <text
      x="65"
      y="75"
      font-size="FONT_SIZE"
      font-family="Arial, sans-serif"
      fill="white"
      font-weight="bold"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      NUM_NOTIFICATIONS
    </text>
  </g>
</svg>



      `;
  const updateFavicon = (unreadCount) => {
    const faviconElements = [...document.querySelectorAll('link[rel="icon"]')];
    const svgBase64 = btoa(
      svgHtml
        .replace("NUM_NOTIFICATIONS", unreadCount.toString())
        .replace(
          "FONT_SIZE",
          unreadCount > 99 ? "40" : unreadCount > 9 ? "50" : "60"
        )
    );
    const href =
      unreadCount > 0
        ? "data:image/svg+xml;base64," + svgBase64
        : "https://static.linear.app/client/assets/favicon.D5VU_JEy.ico";
    faviconElements.forEach((faviconElement) => {
      if (faviconElement.href !== href) {
        faviconElement.setAttribute("href", href);
        console.log(
          "Favicon updated to:" + (unreadCount > 0 ? "pending" : "normal")
        );
      }
    });
  };

  const checkInbox = () => {
    const inboxLinks = [
      ...document.querySelectorAll(
        '[data-visible-sidebar-item] a[href="/transcend/inbox"]'
      ),
    ].filter((el) => el.textContent.trim().startsWith("Inbox"));
    if (inboxLinks.length > 0) {
      const inboxLink = inboxLinks[0];
      const unreadCount = +(
        inboxLink.textContent?.trim().match(/^Inbox.*?(\d+)\+?$/)?.[1] || 0
      );
      console.log("Unread inbox count:", unreadCount);
      // Store in localStorage
      localStorage.setItem("linearUnreadCount", unreadCount.toString());
      updateFavicon(unreadCount);
    }
  };

  // Listen for changes to localStorage
  window.addEventListener("storage", (event) => {
    if (event.key === "linearUnreadCount") {
      const newCount = parseInt(event.newValue, 10) || 0;
      console.log(`Storage event: linearUnreadCount changed to ${newCount}`);
      updateFavicon(newCount);
    }
  });

  setTimeout(checkInbox, 3000);
  setInterval(checkInbox, 15000);

  // Your code here...
})();
