// ==UserScript==
// @name         Torn Sticky Navigation
// @namespace    torn-sticky-navbar
// @version      1.0.2
// @description  Expanded from Myth's Sticky sidebar - Makes navigation elements sticky on both mobile and desktop.
// @author       Cypher [2641265]
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560331/Torn%20Sticky%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/560331/Torn%20Sticky%20Navigation.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const Z_INDEX = 999999;
  const TOP_OFFSET_PX = 0;
  
  // Mobile state
  let mobileSidebar = null;
  let mobileSpacer = null;
  let mobileOriginalTop = 0;
  
  // Desktop state
  let desktopSidebar = null;

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function isMobileView() {
    return document.body.classList.contains("tt-mobile") || 
           document.body.classList.contains("mobile") ||
           window.innerWidth <= 768;
  }

  function findMobileSidebar() {
    return $("#sidebar") || $(".sidebar___xipSp") || $('[class*="sidebar"][class*="mobile"]');
  }

  function findDesktopSidebar() {
    // Desktop sidebar - use ID like the working script
    const sidebar = document.getElementById("sidebar");
    
    // Only return if we're NOT in mobile view (mobile uses same ID)
    if (sidebar && !isMobileView()) {
      return sidebar;
    }
    
    return null;
  }

  function createSpacer(height, id) {
    const el = document.createElement("div");
    el.id = id;
    el.style.height = `${height}px`;
    el.style.width = "100%";
    el.style.display = "none";
    el.style.pointerEvents = "none";
    return el;
  }

  function injectCSS() {
    const style = document.createElement("style");
    style.id = "vm-torn-sticky-navbar-css";
    style.textContent = `
      .vm-torn-mobile-sidebar-fixed {
        position: fixed !important;
        top: ${TOP_OFFSET_PX}px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: ${Z_INDEX} !important;
      }
      .vm-torn-desktop-sidebar-fixed {
        position: sticky !important;
        top: 0px !important;
        max-height: 100vh !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
      }
      .vm-torn-desktop-sidebar-fixed::-webkit-scrollbar {
        width: 0px;
      }
      @media only screen and (max-width: 1001px) {
        .vm-torn-desktop-sidebar-fixed::-webkit-scrollbar {
          width: 0px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Mobile scroll handler
  function handleMobileScroll() {
    if (!mobileSidebar) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > mobileOriginalTop) {
      if (!mobileSidebar.classList.contains("vm-torn-mobile-sidebar-fixed")) {
        mobileSidebar.classList.add("vm-torn-mobile-sidebar-fixed");
        if (mobileSpacer) mobileSpacer.style.display = "block";
      }
    } else {
      if (mobileSidebar.classList.contains("vm-torn-mobile-sidebar-fixed")) {
        mobileSidebar.classList.remove("vm-torn-mobile-sidebar-fixed");
        if (mobileSpacer) mobileSpacer.style.display = "none";
      }
    }
  }

  function initMobile() {
    mobileSidebar = findMobileSidebar();
    if (!mobileSidebar) return false;

    const rect = mobileSidebar.getBoundingClientRect();
    mobileOriginalTop = rect.top + (window.pageYOffset || document.documentElement.scrollTop);

    mobileSpacer = createSpacer(rect.height, "torn-mobile-sidebar-spacer");
    mobileSidebar.parentNode.insertBefore(mobileSpacer, mobileSidebar);

    window.addEventListener("scroll", handleMobileScroll, { passive: true });
    handleMobileScroll();

    console.log("[Torn Sticky Nav] Mobile sidebar initialized");
    return true;
  }

  function initDesktop() {
    desktopSidebar = findDesktopSidebar();

    if (desktopSidebar) {
      // For sidebar, use CSS sticky with independent scrolling
      desktopSidebar.classList.add("vm-torn-desktop-sidebar-fixed");
      console.log("[Torn Sticky Nav] Desktop sidebar set to sticky");
      return true;
    }

    return false;
  }

  function boot() {
    if ($("#vm-torn-sticky-navbar-css")) return;
    injectCSS();

    const isMobile = isMobileView();
    
    if (isMobile) {
      console.log("[Torn Sticky Nav] Mobile view detected");
      setTimeout(() => {
        if (!initMobile()) {
          const mo = new MutationObserver(() => {
            if (initMobile()) mo.disconnect();
          });
          mo.observe(document.documentElement, { childList: true, subtree: true });
        }
      }, 500);
    } else {
      console.log("[Torn Sticky Nav] Desktop view detected");
      setTimeout(() => {
        if (!initDesktop()) {
          const mo = new MutationObserver(() => {
            if (initDesktop()) mo.disconnect();
          });
          mo.observe(document.documentElement, { childList: true, subtree: true });
        }
      }, 500);
    }
  }

  boot();
})();
