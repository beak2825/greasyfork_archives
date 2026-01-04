// ==UserScript==
// @name         DDL Redirect Link Queue
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fetch and queue DDL links from whitelisted domains, with keybindings and toasts.
// @author       leveldesigner
// @license      Unlicense
// @match        https://*.downmagaz.net/*
// @match        https://*.sanet.st/*
// @match        https://*.magsguru.com/*
// @match        https://*.pdfmagaz.in/*
// @match        https://*.worldmags.net/*
// @match        https://*.magazinelib.com/*
// @match        https://*.oceanofpdf.com/*
// @match        https://*.freemagazines.top/*
// @match        https://*.pdfdude.com/*
// @match        https://*.pdf-magazines-download.com/*
// @match        https://*.pdf-magazines-archive.com/*
// @match        https://*.magdownload.org/*
// @match        https://*.warmazon.com/*
// @match        https://*.avxhm.se/*
// @match        https://*.zavat.pw/*
// @match        https://*.scnlog.me/*
// @match        https://*.forum.mobilism.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      nfile.cc
// @connect      novafile.org
// @connect      turbobit.net
// @connect      tbit.to
// @connect      vk.com
// @connect      rapidgator.net
// @connect      ddownload.com
// @connect      nitroflare.com
// @connect      limewire.com
// @connect      uploadmall.com
// @connect      1fichier.com
// @connect      icerbox.com
// @downloadURL https://update.greasyfork.org/scripts/550916/DDL%20Redirect%20Link%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/550916/DDL%20Redirect%20Link%20Queue.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // If true, toasts will auto-hide (default: true)
  const HIDE_TOASTS = true;

  // Declarative link extraction configs
  const LINK_EXTRACTION_CONFIGS = [
    // Script-based click event listeners (e.g. #spec1)
    {
      selectors: ["#spec1"],
      getUrl: (el) => {
        // Try to extract the redirect URL from script tags
        const id = el.id;
        if (!id) return null;
        const scripts = Array.from(document.querySelectorAll("script"));
        for (const script of scripts) {
          // Match: document.getElementById("spec1").addEventListener("click", function(){ window.location.href = "..." });
          const regex = new RegExp(
            `document\\.getElementById\\(["']${id}["']\\)\\.addEventListener\\(["']click["'],\\s*function\\s*\\(\\)\\s*\\{\\s*window\\.location\\.href\\s*=\\s*["']([^"']+)["']`,
            "m",
          );
          const m = script.textContent.match(regex);
          if (m) return m[1];
        }
        return null;
      },
      request: null,
    },
    {
      // Direct external links
      selectors: [
        'a[rel~="external"][rel~="noopener"][rel~="nofollow"]',
        '.post-wrapper a[rel~="external"][rel~="noopener"][rel~="noreferrer"]',
        'a.dw[target="_blank"]',
        'a.external[target="_blank"]',
        'a.postlink:not([href*="mobilism.org"])',
        "div.quote>a",
      ],
      getUrl: (el) => el.href,
      request: null,
    },
    {
      // AJAX download links
      selectors: [".download-link[data-link]"],
      getUrl: (el) => el.getAttribute("data-link"),
      request: {
        method: "POST",
        url: "/wp-admin/admin-ajax.php?action=ajaxs_action&jxs_act=get_download_url_item",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: (link) => `link=${encodeURIComponent(link)}`,
        parseResponse: (response) => {
          try {
            const json = JSON.parse(response.responseText);
            return Object.values(json);
          } catch {
            return [];
          }
        },
      },
    },
    {
      // ouo.io links - extract s= parameter and follow redirect
      selectors: ['a[href*="ouo.io"][href*="s="]'],
      getUrl: (el) => {
        const url = new URL(el.href);
        return url.searchParams.get("s");
      },
      request: {
        method: "GET",
        url: (link) => link,
        headers: {},
        parseResponse: (response) => {
          // If status is not 200, we likely got redirected and finalUrl should contain the result
          if (response.status !== 200 && response.finalUrl) {
            console.log(
              "[ouo.io] Non-200 status redirect detected:",
              response.finalUrl,
            );
            return [response.finalUrl];
          }

          // If status is 200, check if finalUrl is different from what we requested
          // (this handles cases where GM_xmlhttpRequest followed redirects automatically)
          if (response.status === 200 && response.finalUrl) {
            // Try to get the original request URL from the config context
            // For now, assume if finalUrl exists and status is 200, check for JS redirect
            console.log(
              "[ouo.io] Status 200 response, checking for JS redirect",
            );

            // Look for plpJsRedirectL10n in the response text
            const jsRedirectMatch = response.responseText.match(
              /=\s*\{\s*"url"\s*:\s*"([^"]+)"/,
            );
            console.log("[ouo.io] JS redirect match:", jsRedirectMatch);

            if (jsRedirectMatch) {
              // Unescape the URL (handles \/ -> /)
              const redirectUrl = jsRedirectMatch[1].replace(/\\\//g, "/");
              console.log("[ouo.io] Extracted JS redirect URL:", redirectUrl);
              return [redirectUrl];
            }

            // If no JS redirect found, maybe this was a normal redirect that GM followed
            // Check if finalUrl looks like a different domain than the s= parameter domain
            try {
              const finalUrlObj = new URL(response.finalUrl);
              // If finalUrl is not the same as what we'd expect from the s= parameter,
              // it might be the actual redirect destination
              if (
                !finalUrlObj.hostname.includes("warmazon.com") &&
                !finalUrlObj.hostname.includes("magsguru.com") &&
                response.finalUrl !== response.responseURL
              ) {
                console.log(
                  "[ouo.io] Looks like automatic redirect to external domain:",
                  response.finalUrl,
                );
                return [response.finalUrl];
              }
            } catch (e) {
              console.log("[ouo.io] URL parsing error:", e);
            }
          }

          console.log("[ouo.io] No redirect found, returning empty array");
          return [];
        },
      },
    },
    {
      // Redirect links (go.php, /go/, and VK attachments)
      selectors: [
        'a[href*="/engine/go.php?url="]',
        'a[href^="/go/"]',
        ".vk-att-item a",
      ],
      getUrl: (el) => el.href,
      request: {
        method: "GET",
        url: (link) => link,
        headers: {
          Referer: window.location.origin,
        },
        parseResponse: (response) => {
          const redirected =
            response.finalUrl && response.finalUrl !== response.responseURL
              ? response.finalUrl
              : null;
          return redirected ? [redirected] : [];
        },
      },
    },
    {
      // Form-based DDL extraction
      selectors: ['form[action*="Fetching_Resource.php"]'],
      getUrl: (el) => el, // Pass the form element itself
      request: {
        method: "POST",
        url: (form) => form.action,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: (form) => {
          // Serialize all form fields
          return Array.from(form.elements)
            .filter((e) => e.name)
            .map(
              (e) =>
                encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value),
            )
            .join("&");
        },
        parseResponse: (response) => {
          // Extract DDL link from meta refresh
          const match = response.responseText.match(
            /<meta\s+http-equiv=["']Refresh["']\s+content=["'][^;]+;url=([^"']+)["']/i,
          );
          return match ? [match[1]] : [];
        },
      },
    },
  ];

  // --- Toast Notification System ---
  // Adds toast styles and container to the page
  GM_addStyle(`
    #ddl-toast-container, #ddl-toast-container * {
      width: auto;
      float: unset;
      text-align: left;
      line-height: normal;
      font-family: "Fira Code";
      pointer-events: none;
    }
    #ddl-toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      }
      .ddl-toast {
        min-width: 200px;
        max-width: 400px;
        background: #222;
        color: #fff;
        padding: 12px 18px;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        font-size: 15px;
        opacity: 0.85;
        pointer-events: auto;
        transition: opacity 0.3s;
      }
      .ddl-toast.info { background: #222; }
      .ddl-toast.success { background: #2e7d32; }
      .ddl-toast.error { background: #c62828; }
      .ddl-toast.warning { background: orange; color: #222; }
    `);
  if (!document.getElementById("ddl-toast-container")) {
    const container = document.createElement("div");
    container.id = "ddl-toast-container";
    document.body.appendChild(container);
  }
  // Toast helpers
  // Shows only the queue size (used in some toasts)
  function formatQueueSizeToast(queue) {
    return `<br><span style='font-size:18px;font-weight:bold;'>Queue size: ${queue.length}</span><br>`;
  }

  // Shows queue size and first 4 items (truncated)
  function formatQueuePreviewToast(queue) {
    const sizeLine = `<span style='font-size:18px;font-weight:bold;'>Queue size: ${queue.length}</span>`;
    if (queue.length === 0) return `${sizeLine}<br>(Queue is empty)`;
    const preview = queue
      .slice(0, 4)
      .map((item, i) => {
        let truncated = item.length > 60 ? item.slice(0, 57) + "..." : item;
        return `<span style='font-size:13px;'>${i + 1}. ${truncated}</span>`;
      })
      .join("<br>");
    return `<br>${sizeLine}<br>${preview}${queue.length > 4 ? "<br>...and more" : ""}`;
  }

  function showToast(msg, type = "info", timeout = 3000) {
    const container = document.getElementById("ddl-toast-container");
    const toast = document.createElement("div");
    toast.className = `ddl-toast ${type}`;
    toast.innerHTML = msg.replace(/\n/g, "<br>");
    container.appendChild(toast);
    if (HIDE_TOASTS) {
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => container.removeChild(toast), 400);
      }, timeout);
    }
  }

  // --- Queue Management ---
  const QUEUE_KEY = "redirectQueue";
  async function getQueue() {
    return await GM_getValue(QUEUE_KEY, []);
  }
  async function setQueue(arr) {
    await GM_setValue(QUEUE_KEY, arr);
  }
  // Queue management
  async function clearQueue() {
    await setQueue([]);
    showToast("Queue cleared.", "success");
  }

  // --- Fetch Redirected Links ---
  // Link fetching
  async function fetchRedirectedLinks() {
    const queue = await getQueue();
    let totalAdded = 0;
    let foundAny = false;

    // Show persistent "Fetching links..." toast
    const container = document.getElementById("ddl-toast-container");
    const fetchingToast = document.createElement("div");
    fetchingToast.className = "ddl-toast warning";
    fetchingToast.innerHTML = "Fetching links...";
    container.appendChild(fetchingToast);

    // Now handle all declarative configs
    for (const config of LINK_EXTRACTION_CONFIGS) {
      const elements = config.selectors.flatMap((sel) =>
        Array.from(document.querySelectorAll(sel)),
      );
      for (const el of elements) {
        const link = config.getUrl(el);
        if (!link || queue.includes(link)) continue;
        if (!config.request) {
          queue.push(link);
          totalAdded++;
        } else {
          await new Promise((resolve) => {
            GM_xmlhttpRequest({
              method: config.request.method,
              url:
                typeof config.request.url === "function"
                  ? config.request.url(link)
                  : config.request.url,
              headers: {
                Referer: window.location.href,
                ...config.request.headers,
              },
              data: config.request.data ? config.request.data(link) : undefined,
              onload: (response) => {
                const urls = config.request.parseResponse(response);
                for (const u of urls) {
                  if (u && !queue.includes(u)) {
                    queue.push(u);
                    totalAdded++;
                  }
                }
                resolve();
              },
              onerror: resolve,
            });
          });
        }
      }
    }
    // Remove the fetching toast
    if (fetchingToast && fetchingToast.parentNode) {
      fetchingToast.parentNode.removeChild(fetchingToast);
    }

    if (totalAdded > 0) {
      await setQueue(queue);
      showToast(
        `Added ${totalAdded} links.${formatQueueSizeToast(queue)}`,
        "success",
      );
    } else if (!foundAny) {
      showToast("No links found to add.", "error");
    }
  }

  // --- Copy Queue to Clipboard ---
  // Clipboard helpers
  function groupQueueByHostname(queue) {
    const groups = {};
    for (const url of queue) {
      try {
        const hostname = new URL(url).hostname;
        if (!groups[hostname]) groups[hostname] = [];
        groups[hostname].push(url);
      } catch (e) {
        if (!groups["unknown"]) groups["unknown"] = [];
        groups["unknown"].push(url);
      }
    }
    return groups;
  }

  async function copyQueueToClipboard() {
    const queue = await getQueue();
    if (queue.length === 0) {
      showToast("Queue is empty.", "error");
      return;
    }
    const groups = groupQueueByHostname(queue);
    const text = Object.values(groups)
      .map((urls) => urls.join("\n"))
      .join("\n\n");
    try {
      if (typeof GM_setClipboard === "function") {
        GM_setClipboard(text);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      showToast("Queue copied to clipboard.", "success");
    } catch (e) {
      showToast("Failed to copy to clipboard.", "error");
    }
  }

  // --- Keybinding Handler ---
  // Modifier state tracking
  const modState = { alt: false, ctrl: false, shift: false, meta: false };

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Alt") modState.alt = true;
      if (e.key === "Control") modState.ctrl = true;
      if (e.key === "Shift") modState.shift = true;
      if (e.key === "Meta") modState.meta = true;

      // Only handle non-modifier keys
      if (e.key.toLowerCase() === "k") {
        if (modState.alt && !modState.shift && !modState.ctrl) {
          e.preventDefault();
          copyQueueToClipboard();
        }
      }

      if (e.key.toLowerCase() === "l") {
        if (modState.alt && !modState.ctrl && !modState.shift) {
          e.preventDefault();
          fetchRedirectedLinks();
        } else if (modState.alt && modState.shift && !modState.ctrl) {
          e.preventDefault();
          copyQueueToClipboard();
        } else if (modState.alt && modState.ctrl && !modState.shift) {
          e.preventDefault();
          clearQueue();
        } else if (modState.alt && modState.ctrl && modState.shift) {
          e.preventDefault();
          (async () => {
            const queue = await getQueue();
            showToast(formatQueuePreviewToast(queue), "info", 7000);
          })();
        }
      }
    },
    true,
  );

  document.addEventListener(
    "keyup",
    (e) => {
      if (e.key === "Alt") modState.alt = false;
      if (e.key === "Control") modState.ctrl = false;
      if (e.key === "Shift") modState.shift = false;
      if (e.key === "Meta") modState.meta = false;
    },
    true,
  );

  // --- Initial Toast with Queue Size and Keybindings ---
  // Initial toast
  setTimeout(async () => {
    const queue = await getQueue();
    const keybindings = [
      "Alt+L: Fetch links from page",
      "Alt+K: Copy queue to clipboard",
      "Ctrl+Alt+L: Clear queue",
    ].join("\n");
    showToast(
      `DDL Link Queue loaded.${formatQueueSizeToast(queue)}<br><br>${keybindings}`,
      "info",
      9000,
    );
  }, 500);
})();
