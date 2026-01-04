// ==UserScript==
// @name         IMDb TT Grabber (Global)
// @namespace    https://github.com/yourname/imdb-tt-finder
// @version      2.0
// @description  Search IMDb titles anywhere using the OMDb API and copy tt title easily.
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555461/IMDb%20TT%20Grabber%20%28Global%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555461/IMDb%20TT%20Grabber%20%28Global%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Style
  GM_addStyle(`
    #ttFinderBox {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #fff;
      border: 2px solid #f5c518;
      border-radius: 10px;
      padding: 12px;
      width: 320px;
      font-family: Arial, sans-serif;
      z-index: 99999;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    #ttFinderBox header {
      font-weight: bold;
      color: #000;
      font-size: 14px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #ttFinderClose {
      cursor: pointer;
      background: none;
      border: none;
      font-weight: bold;
      color: #555;
      font-size: 14px;
    }
    #ttFinderSearch {
      width: 100%;
      padding: 6px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .tt-result {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      border-bottom: 1px solid #eee;
      padding-bottom: 6px;
    }
    .tt-poster {
      width: 40px;
      height: 60px;
      object-fit: cover;
      margin-right: 10px;
      border-radius: 3px;
    }
    .tt-details {
      flex-grow: 1;
      font-size: 13px;
    }
    .tt-id {
      color: green;
      font-size: 11px;
      font-weight: bold;
    }
    .tt-copy {
      background: #ffd700;
      border: none;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
      font-weight: bold;
    }
    #ttSettings {
      font-size: 11px;
      text-align: right;
      display: block;
      margin-top: 8px;
      color: #0077cc;
      cursor: pointer;
    }
    #ttToggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f5c518;
      color: #000;
      font-weight: bold;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      cursor: pointer;
      z-index: 99998;
      font-size: 24px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.3);
    }
  `);

  // Toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "ttToggle";
  toggleBtn.textContent = "🎬";
  document.body.appendChild(toggleBtn);

  // Main UI box
  const box = document.createElement("div");
  box.id = "ttFinderBox";
  box.innerHTML = `
    <header>
      IMDb TT Grabber
      <button id="ttFinderClose">✖</button>
    </header>
    <input type="text" id="ttFinderSearch" placeholder="Search IMDb titles..." />
    <div id="ttResults"></div>
    <a id="ttSettings">⚙️ Set API Key</a>
  `;
  document.body.appendChild(box);
  box.style.display = "none";

  const closeBtn = document.getElementById("ttFinderClose");
  const searchBox = document.getElementById("ttFinderSearch");
  const resultsDiv = document.getElementById("ttResults");
  const settingsLink = document.getElementById("ttSettings");

  // Toggle show/hide
  toggleBtn.addEventListener("click", () => {
    box.style.display = box.style.display === "none" ? "block" : "none";
  });
  closeBtn.addEventListener("click", () => box.style.display = "none");

  // API key storage
  let apiKey = GM_getValue("omdbApiKey", "");

  settingsLink.addEventListener("click", async () => {
    const key = prompt("Enter your OMDb API key:", apiKey);
    if (key) {
      apiKey = key.trim();
      GM_setValue("omdbApiKey", apiKey);
      alert("✅ API key saved!");
    }
  });

  // Live search
  let timeout = null;
  searchBox.addEventListener("input", () => {
    clearTimeout(timeout);
    const query = searchBox.value.trim();
    if (query.length < 2) return;
    timeout = setTimeout(() => searchOMDb(query), 400);
  });

  async function searchOMDb(query) {
    if (!apiKey) {
      resultsDiv.innerHTML = `<p style="color:red;">⚠️ No OMDb API key set.</p>`;
      return;
    }

    resultsDiv.innerHTML = "Searching...";
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.Response === "True") {
        resultsDiv.innerHTML = "";
        data.Search.forEach((item) => {
          const div = document.createElement("div");
          div.className = "tt-result";
          const poster = item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/40x60?text=N/A";
          div.innerHTML = `
            <img class="tt-poster" src="${poster}" />
            <div class="tt-details">
              <strong>${item.Title}</strong> (${item.Year})<br>
              <span class="tt-id">${item.imdbID}</span>
            </div>
            <button class="tt-copy" data-id="${item.imdbID}">Copy</button>
          `;
          resultsDiv.appendChild(div);
        });

        document.querySelectorAll(".tt-copy").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            await navigator.clipboard.writeText(id);
            btn.textContent = "Copied!";
            btn.style.background = "#00cc66";
            setTimeout(() => {
              btn.textContent = "Copy";
              btn.style.background = "#ffd700";
            }, 1500);
          });
        });
      } else {
        resultsDiv.innerHTML = "No results found.";
      }
    } catch (err) {
      resultsDiv.innerHTML = "Error fetching results.";
    }
  }
})();
