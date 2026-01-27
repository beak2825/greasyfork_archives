// ==UserScript==
// @name         nhentai Quick Peek
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Shows language, page count, artist, upload date, and copyable manga code/link when hovering over thumbnails
// @author       Snow2122
// @icon         https://nhentai.net/favicon.ico
// @match        *://nhentai.net/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563526/nhentai%20Quick%20Peek.user.js
// @updateURL https://update.greasyfork.org/scripts/563526/nhentai%20Quick%20Peek.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ============================================
  // CONFIGURATION
  // ============================================
  const LANGUAGE_TAGS = {
    12227: { name: "English", flag: "🇬🇧", code: "EN" },
    6346: { name: "Japanese", flag: "🇯🇵", code: "JP" },
    29963: { name: "Chinese", flag: "🇨🇳", code: "CN" },
  };

  // ============================================
  // STYLES
  // ============================================
  const styles = `
        .nhi-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 60%, rgba(0, 0, 0, 0) 100%);
            padding: 40px 10px 10px 10px;
            opacity: 0;
            transition: opacity 0.25s ease-in-out;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            gap: 6px;
            z-index: 100;
        }

        .gallery:hover .nhi-overlay {
            opacity: 1;
            pointer-events: auto;
        }

        .nhi-row {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #fff;
        }

        .nhi-label {
            color: #888;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            min-width: 60px;
        }

        .nhi-value {
            font-weight: 600;
            color: #fff;
        }

        .nhi-language {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .nhi-flag {
            font-size: 14px;
        }

        .nhi-copy-container {
            display: flex;
            gap: 6px;
            margin-top: 4px;
        }

        .nhi-copy-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            flex: 1;
            background: rgba(237, 37, 83, 0.15);
            border: 1px solid rgba(237, 37, 83, 0.3);
            border-radius: 4px;
            padding: 6px 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .nhi-copy-btn:hover {
            background: rgba(237, 37, 83, 0.3);
            border-color: rgba(237, 37, 83, 0.5);
        }

        .nhi-copy-btn.nhi-link-btn {
            background: rgba(37, 99, 237, 0.15);
            border-color: rgba(37, 99, 237, 0.3);
        }

        .nhi-copy-btn.nhi-link-btn:hover {
            background: rgba(37, 99, 237, 0.3);
            border-color: rgba(37, 99, 237, 0.5);
        }

        .nhi-copy-value {
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 12px;
            font-weight: 700;
            color: #ed2553;
            letter-spacing: 0.5px;
        }

        .nhi-link-btn .nhi-copy-value {
            color: #2563ed;
        }

        .nhi-copy-icon {
            font-size: 11px;
            color: #888;
            transition: color 0.2s ease;
        }

        .nhi-copy-btn:hover .nhi-copy-icon {
            color: #ed2553;
        }

        .nhi-link-btn:hover .nhi-copy-icon {
            color: #2563ed;
        }

        .nhi-copied {
            background: rgba(76, 175, 80, 0.2) !important;
            border-color: rgba(76, 175, 80, 0.5) !important;
        }

        .nhi-copied .nhi-copy-value,
        .nhi-copied .nhi-copy-icon {
            color: #4caf50 !important;
        }

        .nhi-pages-badge {
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
        }

        .nhi-loading {
            color: #666;
            font-style: italic;
        }

        .nhi-artist {
            color: #ed9825;
            font-weight: 600;
            max-width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .nhi-date {
            color: #aaa;
            font-size: 11px;
        }

        /* Ensure gallery has relative positioning for overlay */
        .gallery {
            position: relative !important;
        }

        .gallery > a {
            position: relative;
            display: block;
        }
    `;

  // Inject styles
  if (typeof GM_addStyle !== "undefined") {
    GM_addStyle(styles);
  } else {
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Extract manga code from gallery element
   */
  function getMangaCode(gallery) {
    const link = gallery.querySelector("a.cover") || gallery.querySelector("a");
    if (!link) return null;

    const href = link.getAttribute("href");
    const match = href.match(/\/g\/(\d+)\/?/);
    return match ? match[1] : null;
  }

  /**
   * Get language from data-tags attribute
   */
  function getLanguage(gallery) {
    const dataTags = gallery.getAttribute("data-tags");
    if (!dataTags) return { name: "Unknown", flag: "🏳️", code: "??" };

    const tagIds = dataTags.split(" ");

    for (const tagId of tagIds) {
      if (LANGUAGE_TAGS[tagId]) {
        return LANGUAGE_TAGS[tagId];
      }
    }

    return { name: "Other", flag: "🌐", code: "OT" };
  }

  /**
   * Cache for gallery info to avoid repeated API calls
   */
  const galleryInfoCache = new Map();

  /**
   * Format Unix timestamp to readable date
   */
  function formatDate(timestamp) {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp * 1000);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  /**
   * Extract artist name from tags
   */
  function extractArtist(tags) {
    if (!tags || !Array.isArray(tags)) return null;
    const artistTag = tags.find((tag) => tag.type === "artist");
    return artistTag ? artistTag.name : null;
  }

  /**
   * Fetch gallery info from API or cache
   */
  async function getGalleryInfo(mangaCode) {
    if (galleryInfoCache.has(mangaCode)) {
      return galleryInfoCache.get(mangaCode);
    }

    try {
      const response = await fetch(
        `https://nhentai.net/api/gallery/${mangaCode}`,
      );
      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      const info = {
        pageCount: data.num_pages || data.images?.pages?.length || "?",
        uploadDate: formatDate(data.upload_date),
        artist: extractArtist(data.tags),
      };

      galleryInfoCache.set(mangaCode, info);
      return info;
    } catch (error) {
      console.error(
        "[nhentai Hover Info] Failed to fetch gallery info:",
        error,
      );
      return { pageCount: "?", uploadDate: "Unknown", artist: null };
    }
  }

  /**
   * Copy text to clipboard
   */
  function copyToClipboard(text, element) {
    if (typeof GM_setClipboard !== "undefined") {
      GM_setClipboard(text, "text");
      showCopiedFeedback(element);
    } else {
      // Fallback for browsers without GM_setClipboard
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showCopiedFeedback(element);
        })
        .catch((err) => {
          console.error("[nhentai Hover Info] Failed to copy:", err);
        });
    }
  }

  /**
   * Show visual feedback when code is copied
   */
  function showCopiedFeedback(element) {
    const copyBtn = element.closest(".nhi-copy-btn");
    const copyIcon = copyBtn.querySelector(".nhi-copy-icon");
    const originalIcon = copyIcon.textContent;

    copyBtn.classList.add("nhi-copied");
    copyIcon.textContent = "✓";

    setTimeout(() => {
      copyBtn.classList.remove("nhi-copied");
      copyIcon.textContent = originalIcon;
    }, 1500);
  }

  /**
   * Create info overlay element
   */
  function createOverlay(mangaCode, language) {
    const overlay = document.createElement("div");
    overlay.className = "nhi-overlay";
    overlay.innerHTML = `
            <div class="nhi-row">
                <span class="nhi-label">Artist</span>
                <span class="nhi-value nhi-artist nhi-artist-name nhi-loading">Loading...</span>
            </div>
            <div class="nhi-row">
                <span class="nhi-label">Language</span>
                <span class="nhi-language">
                    <span class="nhi-flag">${language.flag}</span>
                    <span class="nhi-value">${language.name}</span>
                </span>
            </div>
            <div class="nhi-row">
                <span class="nhi-label">Pages</span>
                <span class="nhi-value nhi-pages-count nhi-loading">Loading...</span>
            </div>
            <div class="nhi-row">
                <span class="nhi-label">Uploaded</span>
                <span class="nhi-value nhi-date nhi-upload-date nhi-loading">Loading...</span>
            </div>
            <div class="nhi-copy-container">
                <div class="nhi-copy-btn nhi-code-btn" title="Copy manga code">
                    <span class="nhi-copy-value">#${mangaCode}</span>
                    <span class="nhi-copy-icon">📋</span>
                </div>
                <div class="nhi-copy-btn nhi-link-btn" title="Copy manga link">
                    <span class="nhi-copy-value">🔗 Link</span>
                    <span class="nhi-copy-icon">📋</span>
                </div>
            </div>
        `;

    const mangaLink = `https://nhentai.net/g/${mangaCode}/`;

    // Add click handler for copying code
    const codeBtn = overlay.querySelector(".nhi-code-btn");
    codeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      copyToClipboard(mangaCode, codeBtn);
    });

    // Add click handler for copying link
    const linkBtn = overlay.querySelector(".nhi-link-btn");
    linkBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      copyToClipboard(mangaLink, linkBtn);
    });

    return overlay;
  }

  /**
   * Initialize overlay for a gallery element
   */
  async function initGallery(gallery) {
    // Skip if already initialized
    if (gallery.dataset.nhiInitialized) return;
    gallery.dataset.nhiInitialized = "true";

    const mangaCode = getMangaCode(gallery);
    if (!mangaCode) return;

    const language = getLanguage(gallery);
    const overlay = createOverlay(mangaCode, language);

    // Find the cover link and append overlay to it
    const coverLink =
      gallery.querySelector("a.cover") || gallery.querySelector("a");
    if (coverLink) {
      coverLink.style.position = "relative";
      coverLink.appendChild(overlay);
    } else {
      gallery.appendChild(overlay);
    }

    // Fetch gallery info asynchronously
    const info = await getGalleryInfo(mangaCode);

    // Update pages
    const pagesElement = overlay.querySelector(".nhi-pages-count");
    if (pagesElement) {
      pagesElement.textContent = info.pageCount;
      pagesElement.classList.remove("nhi-loading");
      pagesElement.classList.add("nhi-pages-badge");
    }

    // Update artist
    const artistElement = overlay.querySelector(".nhi-artist-name");
    if (artistElement) {
      artistElement.textContent = info.artist || "Unknown";
      artistElement.classList.remove("nhi-loading");
      if (info.artist) {
        artistElement.title = info.artist; // Full name on hover
      }
    }

    // Update upload date
    const dateElement = overlay.querySelector(".nhi-upload-date");
    if (dateElement) {
      dateElement.textContent = info.uploadDate;
      dateElement.classList.remove("nhi-loading");
    }
  }

  /**
   * Initialize all galleries on the page
   */
  function initAllGalleries() {
    const galleries = document.querySelectorAll(".gallery");
    galleries.forEach((gallery) => initGallery(gallery));
  }

  /**
   * Observe for dynamically loaded galleries (infinite scroll, etc.)
   */
  function observeNewGalleries() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && node.classList.contains("gallery")) {
              initGallery(node);
            }
            // Also check for galleries within added nodes
            const nestedGalleries = node.querySelectorAll
              ? node.querySelectorAll(".gallery")
              : [];
            nestedGalleries.forEach((gallery) => initGallery(gallery));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // ============================================
  // MAIN INITIALIZATION
  // ============================================
  function init() {
    initAllGalleries();
    observeNewGalleries();
  }

  // Run initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
