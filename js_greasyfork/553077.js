// ==UserScript==
// @name         Search the Ships
// @namespace    search-the-ships
// @version      1.7.2
// @description  Adds a beautifully designed button to book-related websites to search the current book title on various archives, with a centralized status indicator.
// @author       Delaxy
// @match        https://thegreatestbooks.org/*
// @match        https://www.goodreads.com/*
// @match        https://www.amazon.*/*
// @match        https://tastedive.com/*
// @match        https://app.thestorygraph.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553077/Search%20the%20Ships.user.js
// @updateURL https://update.greasyfork.org/scripts/553077/Search%20the%20Ships.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Change the urls accordingly if a website is down.
  // https://open-slum.pages.dev/
  
  

  const SITE_CONFIG = {
    searchSites: {
      "Z-Library": {
        queryKey: "",
        separator: "?",
        urls: [
          {
            name: "All Files",
            base: "https://articles.sk/s/",
            extra: "",
          },
          {
            name: "EPUBs",
            base: "https://articles.sk/s/",
            extra: "extensions[]=EPUB",
          },
          {
            name: "PDFs",
            base: "https://articles.sk/s/",
            extra: "extensions[]=PDF",
          },
        ],
      },
      "Anna's Archive": {
        queryKey: "q",
        separator: "&",
        urls: [
          {
            name: "All Files",
            base: "https://annas-archive.li/search",
            extra: "page=1&sort=",
          },
          {
            name: "EPUBs",
            base: "https://annas-archive.li/search",
            extra: "page=1&sort=&ext=epub",
          },
          {
            name: "PDFs",
            base: "https://annas-archive.li/search",
            extra: "page=1&sort=&ext=pdf",
          },
        ],
      },
      "Library Genesis": {
        queryKey: "req",
        separator: "&",
        urls: [
          {
            name: "Default Search",
            base: "https://libgen.li/index.php",
            extra:
              "lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def",
          },
        ],
      },
      Mobilism: {
        queryKey: "keywords",
        separator: "&",
        urls: [
          {
            name: "Books Forum",
            base: "https://forum.mobilism.org/search.php",
            extra: "fid[]=120&sr=topics&sf=titleonly",
          },
        ],
      },
    },
    titleExtractors: {
      "goodreads.com": () => {
        if (window.location.pathname.includes("/book/show/")) {
          const el = document.querySelector('[data-testid="bookTitle"]');
          return el ? el.innerText.trim() : "";
        }
        return "";
      },
      "amazon.": () => {
        const isProductPage =
          window.location.pathname.includes("/dp/") ||
          window.location.pathname.includes("/gp/product/");
        const breadcrumb = document.querySelector(
          "#wayfinding-breadcrumbs_feature_div",
        );
        const isBookCategory =
          breadcrumb &&
          (breadcrumb.innerText.includes("Books") ||
            breadcrumb.innerText.includes("Kindle Store"));
        if (isProductPage && isBookCategory) {
          const el =
            document.getElementById("productTitle") ||
            document.getElementById("bookTitle");
          return el ? el.innerText.trim() : "";
        }
        return "";
      },
      "thegreatestbooks.org": () => {
        if (window.location.pathname.includes("/books/")) {
          const el = document.querySelector("h1 a.no-underline-link");
          return el ? el.textContent.trim() : "";
        }
        return "";
      },
      "tastedive.com": () => {
        if (window.location.pathname.includes("/books/like")) {
          const el = document.getElementsByClassName("sc-5b0eeb21-6 bpGMKW")[0];
          return el ? el.innerText : "";
        }
        return "";
      },
      "thestorygraph.com": () => {
        if (window.location.pathname.includes("/books")) {
          const el = document.querySelector(
            ".book-title-author-and-series h3",
          );
          return el ? el.innerText : "";
        }
        return "";
      },
    },
  };

  function getBookTitle() {
    const hostname = window.location.hostname;
    for (const key in SITE_CONFIG.titleExtractors) {
      if (hostname.includes(key)) {
        const title = SITE_CONFIG.titleExtractors[key]();
        if (title) {
          return cleanTitle(title);
        }
      }
    }
    return "";
  }

  function cleanTitle(title) {
    return title
      .replace(
        /\s*\((Paperback|Hardcover|Kindle Edition|Audible Audio Edition)\)/g,
        "",
      )
      .trim();
  }

  function constructSearchUrl(siteConfig, urlObject, encodedTitle) {
    let finalUrl;
    if (!siteConfig.queryKey) {
      finalUrl = `${urlObject.base}${encodedTitle}`;
      if (urlObject.extra) {
        finalUrl += `${siteConfig.separator}${urlObject.extra}`;
      }
    } else {
      finalUrl = `${urlObject.base}?${siteConfig.queryKey}=${encodedTitle}`;
      if (urlObject.extra) {
        finalUrl += `${siteConfig.separator}${urlObject.extra}`;
      }
    }
    return finalUrl;
  }

  function injectCSS() {
    const styles = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  
      .sts-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          font-family: 'Inter', sans-serif;
      }
      @media (max-width: 480px) {
          .sts-container {
              right: 10px;
              bottom: 10px;
          }
      }
      .sts-button {
          background: linear-gradient(135deg, #5A67D8 0%, #9F7AEA 100%);
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          outline: none;
          display: flex;
          align-items: center;
          gap: 8px;
      }
      .sts-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 25px rgba(0, 0, 0, 0.25);
      }
      .sts-button svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
      }
      .sts-dropdown {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          display: none;
          z-index: 10001;
          min-width: 220px;
          padding: 6px;
          box-sizing: border-box;
          opacity: 0;
          transform: translate(-50%, 10px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
      }
      .sts-dropdown.sts-visible {
          display: block;
          opacity: 1;
          transform: translate(-50%, 0);
          pointer-events: auto;
      }
      .sts-site-div {
          padding: 10px 15px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          color: #333;
          transition: background-color 0.2s ease;
          border-radius: 8px;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
      }
      .sts-site-div:hover {
          background-color: rgba(0, 0, 0, 0.05);
      }
      .sts-submenu {
          display: none;
          position: absolute;
          top: -6px;
          right: calc(100% + 8px);
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          min-width: 220px;
          z-index: 10002;
          padding: 6px;
          opacity: 0;
          transform: translateX(10px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
      }
      .sts-site-div:last-child > .sts-submenu {
          top: auto;
          bottom: -6px;
      }
      .sts-submenu.sts-submenu-visible {
          display: block;
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
      }
      .sts-link {
          display: block;
          padding: 8px 12px;
          color: #4A5568;
          text-decoration: none;
          font-size: 14px;
          border-radius: 6px;
          transition: background-color 0.2s ease, color 0.2s ease;
      }
      .sts-link:hover {
          background-color: rgba(90, 103, 216, 0.1);
          color: #5A67D8;
      }
      .sts-ship-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-left: 10px;
          flex-shrink: 0;
      }
      .sts-pending { background-color: #9CA3AF; }
      .sts-online { background-color: #34D399; }
      .sts-offline { background-color: #F87171; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
  
  function createDropdownMenu(encodedTitle) {
    const dropdown = document.createElement("div");
    dropdown.className = "sts-dropdown";
  
    for (const siteName in SITE_CONFIG.searchSites) {
      const siteConfig = SITE_CONFIG.searchSites[siteName];
      const siteDiv = document.createElement("div");
      siteDiv.className = "sts-site-div";
  
      const nameSpan = document.createElement("span");
      nameSpan.innerText = siteName;
      siteDiv.appendChild(nameSpan);
  
      if (siteConfig.urls && siteConfig.urls.length > 0) {
        const statusSpan = document.createElement("span");
        statusSpan.className = "sts-ship-status sts-pending";
        statusSpan.dataset.url = siteConfig.urls[0].base;
        statusSpan.title = "Checking...";
        siteDiv.appendChild(statusSpan);
  
        const baseUrl = new URL(siteConfig.urls[0].base).origin;
        fetch(baseUrl, { method: "HEAD", mode: "no-cors" })
          .then(() => {
            statusSpan.classList.remove("sts-pending");
            statusSpan.classList.add("sts-online");
            statusSpan.title = "Online";
          })
          .catch(() => {
            statusSpan.classList.remove("sts-pending");
            statusSpan.classList.add("sts-offline");
            statusSpan.title = "Offline";
          });
      }
  
      const subMenu = document.createElement("div");
      subMenu.className = "sts-submenu";
  
      siteConfig.urls.forEach((urlObject) => {
        const finalUrl = constructSearchUrl(siteConfig, urlObject, encodedTitle);
        const link = document.createElement("a");
        link.href = finalUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "sts-link";
        link.innerText = urlObject.name;
        subMenu.appendChild(link);
      });
  
      siteDiv.appendChild(subMenu);
      dropdown.appendChild(siteDiv);
    }
  
    return dropdown;
  }
  
  function attachEventListeners() {
    const buttonContainer = document.querySelector(".sts-container");
    const dropdown = document.querySelector(".sts-dropdown");
    let hideDropdownTimeout;
  
    buttonContainer.addEventListener("mouseenter", () => {
      clearTimeout(hideDropdownTimeout);
      if (!dropdown.classList.contains("sts-visible")) {
        dropdown.classList.add("sts-visible");
      }
    });
  
    buttonContainer.addEventListener("mouseleave", () => {
      hideDropdownTimeout = setTimeout(() => {
        dropdown.classList.remove("sts-visible");
      }, 300);
    });
  
    document.querySelectorAll(".sts-site-div").forEach((siteDiv) => {
      const subMenu = siteDiv.querySelector(".sts-submenu");
      let hideSubMenuTimeout;
  
      const show = () => {
        clearTimeout(hideSubMenuTimeout);
        document
          .querySelectorAll(".sts-submenu-visible")
          .forEach((visibleSubMenu) => {
            if (visibleSubMenu !== subMenu) {
              visibleSubMenu.classList.remove("sts-submenu-visible");
            }
          });
        subMenu.classList.add("sts-submenu-visible");
      };
  
      const hide = () => {
        hideSubMenuTimeout = setTimeout(() => {
          subMenu.classList.remove("sts-submenu-visible");
        }, 300);
      };
  
      siteDiv.addEventListener("mouseenter", show);
      siteDiv.addEventListener("mouseleave", hide);
      subMenu.addEventListener("mouseenter", show);
      subMenu.addEventListener("mouseleave", hide);
    });
  }
  
  function createSearchButton() {
    const bookTitle = getBookTitle();
    if (!bookTitle) return;
  
    const encodedTitle = encodeURIComponent(bookTitle);
  
    injectCSS();
  
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "sts-container";
  
    const button = document.createElement("button");
    button.className = "sts-button";
    button.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <span>Search the Ships</span>
          `;
  
    const dropdown = createDropdownMenu(encodedTitle);
    button.appendChild(dropdown);
  
    buttonContainer.appendChild(button);
    document.body.appendChild(buttonContainer);
  
    attachEventListeners();
  }

  function main() {
    createSearchButton();

    if (window.location.hostname.includes("tastedive.com")) {
      const handleTastediveNavigation = () => {
        const existingButton = document.querySelector(".sts-container");
        if (existingButton) {
          existingButton.remove();
        }
        setTimeout(createSearchButton, 500);
      };

      let oldHref = document.location.href;
      const body = document.querySelector("body");
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
          if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            handleTastediveNavigation();
          }
        });
      });
      observer.observe(body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
