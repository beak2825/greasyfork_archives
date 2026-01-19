// ==UserScript==
// @name         WME to PartnerHub link
// @version      1.0.4
// @description  Adds a PartnerHub link in "Share location" popup for the same lat/lon/zoom.
// @author       Falcon4Tech
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @namespace    https://greasyfork.org/users/205544
// @downloadURL https://update.greasyfork.org/scripts/563154/WME%20to%20PartnerHub%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/563154/WME%20to%20PartnerHub%20link.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const PH_WRAPPER_ID = "ph-permalink-wrapper";
  const PH_INPUT_ID = "ph-permalink-input";
  const PERMALINK_OPEN_ID = "permalink-open-icon";
  const PARTNERHUB_BASE = "https://www.waze.com/partnerhub/map-tool";
  const PARTNER_LABEL = "PartnerHub";
  const PARTNER_PLACEHOLDER = "PartnerHub";
  const processedPopups = new WeakSet();

  function getLang() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase();
  }

  function getCopyTitle() {
    const lang = getLang();
    return lang.startsWith("pl") ? "Skopiuj link" : "Copy link";
  }

  function getOpenTitle(sameWindow) {
    const lang = getLang();
    if (lang.startsWith("pl")) return sameWindow ? "Otwórz w tym oknie" : "Otwórz w nowym oknie";
    return sameWindow ? "Open in this window" : "Open in new window";
  }

  function parsePermalink(permalink) {
    try {
      const u = new URL(permalink);
      const lat = u.searchParams.get("lat");
      const lon = u.searchParams.get("lon");
      const zoom = u.searchParams.get("zoomLevel") || u.searchParams.get("zoom") || u.searchParams.get("z");

      if (!lat || !lon) return null;

      const z = zoom ? String(parseInt(zoom, 10)) : "20";
      return { lat: String(lat), lon: String(lon), zoom: z };
    } catch (e) {
      return null;
    }
  }

  function buildPartnerHubUrl({ lat, lon, zoom }) {
    const u = new URL(PARTNERHUB_BASE);
    u.searchParams.set("lat", lat);
    u.searchParams.set("lon", lon);
    u.searchParams.set("initialZoom", zoom);
    return u.toString();
  }

  function getPermalinkFromPopup(popupRoot) {
    const wzPermalink = popupRoot.querySelector('wz-text-input#permalink-input');
    if (!wzPermalink) return null;

    const attrVal = wzPermalink.getAttribute("value");
    if (attrVal && attrVal.startsWith("http")) return attrVal;

    const propVal = wzPermalink.value;
    if (typeof propVal === "string" && propVal.startsWith("http")) return propVal;

    try {
      const inner = wzPermalink.shadowRoot?.querySelector("input");
      const innerVal = inner?.value;
      if (innerVal && innerVal.startsWith("http")) return innerVal;
    } catch (_) {}

    return null;
  }

  function updatePartnerUrl(wrapper, partnerUrl) {
    if (!wrapper || !partnerUrl) return;
    wrapper.dataset.partnerUrl = partnerUrl;
    const input = wrapper.querySelector(`#${PH_INPUT_ID}`);
    if (!input) return;
    input.setAttribute("value", partnerUrl);
    input.value = partnerUrl;
    try {
      const inner = input.shadowRoot?.querySelector("input");
      if (inner) inner.value = partnerUrl;
    } catch (_) {}
  }

  function getPartnerUrlFromWrapper(wrapper) {
    if (!wrapper) return "";
    if (wrapper.dataset?.partnerUrl) return wrapper.dataset.partnerUrl;
    const input = wrapper.querySelector(`#${PH_INPUT_ID}`);
    if (!input) return "";
    const attrVal = input.getAttribute("value");
    if (attrVal && attrVal.startsWith("http")) return attrVal;
    const propVal = input.value;
    if (typeof propVal === "string" && propVal.startsWith("http")) return propVal;
    try {
      const inner = input.shadowRoot?.querySelector("input");
      const innerVal = inner?.value;
      if (innerVal && innerVal.startsWith("http")) return innerVal;
    } catch (_) {}
    return "";
  }

  function copyToClipboard(text) {
    if (!text) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopyText(text);
      });
      return;
    }
    fallbackCopyText(text);
  }

  function fallbackCopyText(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (_) {}
    document.body.removeChild(ta);
  }

  function addIconInteraction(el, handler) {
    el.addEventListener("click", handler);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
      }
    });
  }

  function createOpenIcon(titleText) {
    const openIcon = document.createElement("span");
    openIcon.className = "icon";
    openIcon.style.cursor = "pointer";
    openIcon.style.display = "inline-flex";
    openIcon.style.alignItems = "center";
    openIcon.title = titleText;
    openIcon.setAttribute("role", "button");
    openIcon.tabIndex = 0;
    openIcon.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.33333 3.33333H7.33333V2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V8.66667H12.6667V12.6667H3.33333V3.33333ZM7.80483 9.13798L12.6908 4.25015V6.66667H14V2H9.33333V3.30916H11.7462L6.86184 8.19535L7.80483 9.13798Z" fill="currentColor"></path></svg>';
    return openIcon;
  }

  function createPermalinkOpenButton(titleText) {
    const btn = document.createElement("wz-button");
    btn.setAttribute("color", "clear-icon");
    btn.setAttribute("size", "sm");
    btn.setAttribute("type", "button");
    btn.setAttribute("name", "");
    btn.setAttribute("value", "");
    btn.title = titleText;
    btn.style.alignSelf = "center";
    btn.style.marginLeft = "5px";

    const icon = document.createElement("i");
    icon.className = "w-icon w-icon-refresh";
    btn.appendChild(icon);

    return btn;
  }

  function ensurePermalinkOpenIcon(popupRoot) {
    const input = popupRoot.querySelector("wz-text-input#permalink-input");
    if (!input) return;
    const wrapper = input.closest(".permalink-wrapper");
    if (!wrapper || wrapper.querySelector(`#${PERMALINK_OPEN_ID}`)) return;

    const openBtn = createPermalinkOpenButton(getOpenTitle(true));
    openBtn.id = PERMALINK_OPEN_ID;
    addIconInteraction(openBtn, () => {
      const url = getPermalinkFromPopup(popupRoot);
      if (url) window.location.href = url;
    });
    wrapper.appendChild(openBtn);
  }

  function ensureLinkInPopup(popupRoot) {
    const permalink = getPermalinkFromPopup(popupRoot);
    if (!permalink) return;

    ensurePermalinkOpenIcon(popupRoot);

    const parsed = parsePermalink(permalink);
    if (!parsed) return;

    const partnerUrl = buildPartnerHubUrl(parsed);

    const existing = popupRoot.querySelector(`#${PH_WRAPPER_ID}`);
    if (existing) return;

    const content = popupRoot.querySelector(".share-location-popup-content") || popupRoot;
    const anchor =
      popupRoot.querySelector(".coordinates-wrapper") ||
      popupRoot.querySelector(".permalink-wrapper") ||
      content;

    const wrapper = document.createElement("div");
    wrapper.id = PH_WRAPPER_ID;
    wrapper.className = "permalink-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.gap = "8px";
    wrapper.style.alignItems = "center";

    const input = document.createElement("wz-text-input");
    input.id = PH_INPUT_ID;
    input.setAttribute("value", partnerUrl);
    input.setAttribute("label", PARTNER_LABEL);
    input.setAttribute("placeholder", PARTNER_PLACEHOLDER);
    input.setAttribute("autocomplete", "on");
    input.setAttribute("type", "text");
    input.setAttribute("size", "md");
    input.value = partnerUrl;

    const copyIcon = document.createElement("i");
    copyIcon.className = "w-icon w-icon-copy";
    copyIcon.style.cursor = "pointer";
    copyIcon.title = getCopyTitle();
    copyIcon.setAttribute("role", "button");
    copyIcon.tabIndex = 0;

    const openIcon = createOpenIcon(getOpenTitle(false));

    addIconInteraction(copyIcon, () => {
      const url = getPartnerUrlFromWrapper(wrapper);
      copyToClipboard(url);
    });

    addIconInteraction(openIcon, () => {
      const url = getPartnerUrlFromWrapper(wrapper);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    });

    wrapper.appendChild(input);
    wrapper.appendChild(copyIcon);
    wrapper.appendChild(openIcon);
    updatePartnerUrl(wrapper, partnerUrl);

    if (anchor && anchor.parentElement) {
      anchor.parentElement.insertBefore(wrapper, anchor.nextSibling);
    } else {
      content.appendChild(wrapper);
    }
  }

  function findActiveSharePopupRoot() {
    return document.querySelector(".share-location-pop-up-wrapper");
  }

  function tryInject() {
    const popups = document.querySelectorAll(".share-location-pop-up-wrapper");
    if (!popups.length) return;
    popups.forEach((popupRoot) => {
      if (processedPopups.has(popupRoot)) return;
      ensureLinkInPopup(popupRoot);
      processedPopups.add(popupRoot);
    });
  }

  const obs = new MutationObserver((mutations) => {
    const shouldCheck = mutations.some((m) =>
      Array.from(m.addedNodes || []).some((node) => {
        if (!(node instanceof Element)) return false;
        return (
          node.classList.contains("share-location-pop-up-wrapper") ||
          node.querySelector(".share-location-pop-up-wrapper")
        );
      })
    );
    if (shouldCheck) tryInject();
  });

  obs.observe(document.documentElement, { childList: true, subtree: true });

  tryInject();
})();
