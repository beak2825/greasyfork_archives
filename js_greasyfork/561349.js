// ==UserScript==
// @name         FanFiction.net EPUB Downloader (via FicHub)
// @namespace    https://github.com/Ashwatthama/fanfiction-epub-downloader
// @version      1.0.0
// @description  Adds a floating button to download any fanfiction as EPUB, PDF, MOBI, or HTML using FicHub.net API
// @author       Ashwatthama
// @license      MIT
// @match        https://www.fanfiction.net/s/*
// @match        https://m.fanfiction.net/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanfiction.net
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      fichub.net
// @homepageURL  https://github.com/Ashwatthama/fanfiction-epub-downloader
// @supportURL   https://github.com/Ashwatthama/fanfiction-epub-downloader/issues
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @downloadURL https://update.greasyfork.org/scripts/561349/FanFictionnet%20EPUB%20Downloader%20%28via%20FicHub%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561349/FanFictionnet%20EPUB%20Downloader%20%28via%20FicHub%29.meta.js
// ==/UserScript==

/*
 * FanFiction.net EPUB Downloader
 *
 * Credits:
 * - FicHub.net for providing the free API (https://fichub.net/)
 * - This script is not affiliated with FanFiction.net or FicHub.net
 *
 * Changelog:
 * v1.0.0 (2025-01-XX) - Initial release
 */

(function () {
  "use strict";

  // ============ CONFIGURATION ============
  const CONFIG = {
    buttonPosition: "top-right",
    defaultFormat: "epub",
    showAllFormats: true,
    autoDownload: false,
  };

  // ============ STYLES ============
  const styles = `
        #fichub-container {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            font-family: Arial, sans-serif;
        }

        #fichub-btn {
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #fichub-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        #fichub-btn:disabled {
            background: #999;
            cursor: not-allowed;
            transform: none;
        }

        #fichub-btn .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        #fichub-popup {
            display: none;
            position: absolute;
            top: 50px;
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            padding: 20px;
            min-width: 300px;
            max-width: 400px;
        }

        #fichub-popup.show {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #fichub-popup h3 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 16px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }

        #fichub-popup .info {
            font-size: 13px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.6;
        }

        #fichub-popup .info strong {
            color: #333;
        }

        #fichub-popup .downloads {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        #fichub-popup .download-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            background: #f5f5f5;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            color: #333;
            font-size: 14px;
            transition: all 0.2s ease;
        }

        #fichub-popup .download-btn:hover {
            background: #667eea;
            color: white;
        }

        #fichub-popup .download-btn .icon {
            font-size: 20px;
        }

        #fichub-popup .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
        }

        #fichub-popup .close-btn:hover {
            color: #333;
        }

        #fichub-error {
            color: #e74c3c;
            padding: 10px;
            background: #ffeaea;
            border-radius: 8px;
            font-size: 13px;
        }
    `;

  // ============ INJECT STYLES ============
  function injectStyles() {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // ============ CREATE UI ============
  function createUI() {
    const container = document.createElement("div");
    container.id = "fichub-container";

    container.innerHTML = `
            <button id="fichub-btn">
                <span class="icon">📚</span>
                <span class="text">Download EPUB</span>
            </button>
            <div id="fichub-popup">
                <button class="close-btn">&times;</button>
                <div id="fichub-content">
                    <!-- Content will be injected here -->
                </div>
            </div>
        `;

    document.body.appendChild(container);

    // Event listeners
    document
      .getElementById("fichub-btn")
      .addEventListener("click", handleExport);
    document
      .querySelector("#fichub-popup .close-btn")
      .addEventListener("click", closePopup);

    // Close popup when clicking outside
    document.addEventListener("click", (e) => {
      const popup = document.getElementById("fichub-popup");
      const container = document.getElementById("fichub-container");
      if (!container.contains(e.target)) {
        popup.classList.remove("show");
      }
    });
  }

  // ============ API REQUEST ============
  function makeRequest(url) {
    return new Promise((resolve, reject) => {
      const gmXhr =
        typeof GM_xmlhttpRequest !== "undefined"
          ? GM_xmlhttpRequest
          : GM.xmlHttpRequest;

      gmXhr({
        method: "GET",
        url: url,
        headers: {
          Accept: "application/json",
        },
        onload: function (response) {
          if (response.status === 200) {
            try {
              const data = JSON.parse(response.responseText);
              resolve(data);
            } catch (e) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            reject(new Error(`Request failed with status ${response.status}`));
          }
        },
        onerror: function (error) {
          reject(new Error("Network error occurred"));
        },
      });
    });
  }

  // ============ HANDLE EXPORT ============
  async function handleExport() {
    const button = document.getElementById("fichub-btn");
    const popup = document.getElementById("fichub-popup");
    const content = document.getElementById("fichub-content");

    // Show loading state
    button.disabled = true;
    button.innerHTML = `
            <div class="spinner"></div>
            <span class="text">Processing...</span>
        `;

    try {
      const currentUrl = window.location.href;
      const apiUrl = `https://fichub.net/api/v0/epub?q=${encodeURIComponent(
        currentUrl
      )}`;

      const data = await makeRequest(apiUrl);

      if (data.err !== 0) {
        throw new Error(data.error || "Unknown error from FicHub");
      }

      // Build the popup content
      const meta = data.meta;
      const baseUrl = "https://fichub.net";

      content.innerHTML = `
                <h3>${escapeHtml(meta.title)}</h3>
                <div class="info">
                    <strong>Author:</strong> ${escapeHtml(meta.author)}<br>
                    <strong>Words:</strong> ${meta.words.toLocaleString()}<br>
                    <strong>Chapters:</strong> ${meta.chapters}<br>
                    <strong>Status:</strong> ${meta.status}<br>
                    <strong>Updated:</strong> ${new Date(
                      meta.updated
                    ).toLocaleDateString()}
                </div>
                <div class="downloads">
                    <a class="download-btn" href="${baseUrl}${
        data.urls.epub
      }" target="_blank">
                        <span class="icon">📕</span>
                        <span>Download EPUB</span>
                    </a>
                    <a class="download-btn" href="${baseUrl}${
        data.urls.pdf
      }" target="_blank">
                        <span class="icon">📄</span>
                        <span>Download PDF</span>
                    </a>
                    <a class="download-btn" href="${baseUrl}${
        data.urls.mobi
      }" target="_blank">
                        <span class="icon">📱</span>
                        <span>Download MOBI (Kindle)</span>
                    </a>
                    <a class="download-btn" href="${baseUrl}${
        data.urls.html
      }" target="_blank">
                        <span class="icon">🌐</span>
                        <span>Download HTML</span>
                    </a>
                </div>
            `;

      popup.classList.add("show");

      // Auto-download if configured
      if (CONFIG.autoDownload) {
        window.open(baseUrl + data.urls[CONFIG.defaultFormat], "_blank");
      }
    } catch (error) {
      content.innerHTML = `
                <div id="fichub-error">
                    <strong>❌ Error:</strong> ${escapeHtml(error.message)}<br>
                    <small>Please try again or use fichub.net directly.</small>
                </div>
            `;
      popup.classList.add("show");
    }

    // Reset button
    button.disabled = false;
    button.innerHTML = `
            <span class="icon">📚</span>
            <span class="text">Download EPUB</span>
        `;
  }

  // ============ HELPER FUNCTIONS ============
  function closePopup() {
    document.getElementById("fichub-popup").classList.remove("show");
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ============ INITIALIZE ============
  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        injectStyles();
        createUI();
      });
    } else {
      injectStyles();
      createUI();
    }
  }

  init();
})();
