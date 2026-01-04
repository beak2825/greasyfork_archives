// ==UserScript==
// @name         UNIT3D Add Letterboxd rating
// @version      1.0
// @description  Add Ratings from Letterboxd to the torrent page.
// @match        *://*/torrents/*
// @match        *://*/requests/*
// @match        *://*/torrents/similar/*
// @namespace    https://www.tampermonkey.net/
// @author       boisterous-larva
// @license      MIT License
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/554009/UNIT3D%20Add%20Letterboxd%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/554009/UNIT3D%20Add%20Letterboxd%20rating.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function addStyle(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function getIMDBID() {
    let a = document.querySelector('[href*="://www.imdb.com/title/tt"]');
    if (!a) return;
    let id = a.href.match(/tt\d+/)[0];
    if (id) {
      handleLetterboxd(id);
    }

  }

  function getElementByInnerText(tag, text) {
    return Array.from(document.querySelectorAll(tag)).find(
      (el) => el.innerText.trim().toLowerCase() === text
    );
  }

  function buildElement(siteName, url, logo, rating, count) {
    if (!rating) return;
    const extraHeader = getElementByInnerText("h2", "extra information");
    if (!extraHeader) return;
    let ratingFloat = parseFloat(rating);
    let ratingColor = "var(--meta-chip-name-fg)"; // Default.
    if (ratingFloat){
      if (siteName === "IMDb") ratingFloat = ratingFloat / 2; // IMDb ratings are out of 10, adjust to match other ratings
      if (siteName === "RT") ratingFloat = (ratingFloat / 100) * 5 // Rotten scores are out of 100, adjust to match other ratings
      ratingColor =
        ratingFloat < 2.5
          ? "rgba(212, 36, 36, 0.8)" // Red for ratings below 2.5
          : ratingFloat < 3.5
            ? "rgba(212, 195, 36, 0.8)" // Yellow for ratings 2.5 and above
            : ratingFloat < 4.5
              ? "rgba(0,224,84, 0.8)" // Green for ratings 3.5 and above
              : "rgba(113, 251, 255, 0.8)"; // Light blue for ratings 4.5 and above
    }

    const logoLink = logo;
    const img = document.createElement("img");
    img.className = `${siteName.toLowerCase()}-chip__icon`;
    img.src = logoLink;

    const iconStyle = `
    .${siteName.toLowerCase()}-chip__icon{
        grid-area: image;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        color: var(--meta-chip-name-fg);
        width: 35px;
        height: 35px;
        border-radius: 4%;
        filter: drop-shadow(0 0 1rem ${ratingColor});
    }`;
    const articleElement = document.querySelector("ul.meta__ids");
    const ratingName = document.createElement("h2");
    const ratingValue = document.createElement("h3");
    const meta_id_tag = document.createElement("a");
    meta_id_tag.className = "meta-chip";
    meta_id_tag.style = "column-gap:4px; row-gap:0; padding-right:18px;";
    ratingName.className = "meta-chip__name";
    ratingName.style = "font-size:14px; margin-bottom:0;";
    ratingValue.className = "meta-chip__value";
    ratingValue.style = `font-size:12px; color:${ratingColor};`;
    meta_id_tag.href = url;
    meta_id_tag.target = "_blank";
    meta_id_tag.append(img);
    ratingName.innerText = siteName;
    ratingValue.innerText = `${rating} / ${count} Votes`;
    meta_id_tag.append(ratingName);
    meta_id_tag.append(ratingValue);
    articleElement.append(meta_id_tag);
    addStyle(iconStyle);
    console.log(`Added ${siteName} rating: ${rating} / ${count} Votes`);
  }

  function handleLetterboxd(id) {
    const letterboxdURL = "https://letterboxd.com/imdb/";
    const siteName = "Letterboxd";
    const logoURL = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNTAwcHgiIGhlaWdodD0iNTAwcHgiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1Mi4yICg2NzE0NSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+bGV0dGVyYm94ZC1kZWNhbC1kb3RzLXBvcy1yZ2I8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz4KICAgICAgICA8cmVjdCBpZD0icGF0aC0xIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTI5Ljg0NzMyOCIgaGVpZ2h0PSIxNDEuMzg5MzEzIj48L3JlY3Q+CiAgICAgICAgPHJlY3QgaWQ9InBhdGgtMyIgeD0iMCIgeT0iMCIgd2lkdGg9IjEyOS44NDczMjgiIGhlaWdodD0iMTQxLjM4OTMxMyI+PC9yZWN0PgogICAgPC9kZWZzPgogICAgPGcgaWQ9ImxldHRlcmJveGQtZGVjYWwtZG90cy1wb3MtcmdiIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8Y2lyY2xlIGlkPSJDaXJjbGUiIGZpbGw9IiMyMDI4MzAiIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjI1MCI+PC9jaXJjbGU+CiAgICAgICAgPGcgaWQ9ImRvdHMtbmVnIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MS4wMDAwMDAsIDE4MC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IkRvdHMiPgogICAgICAgICAgICAgICAgPGVsbGlwc2UgaWQ9IkdyZWVuIiBmaWxsPSIjMDBFMDU0IiBjeD0iMTg5IiBjeT0iNjkuOTczMjgyNCIgcng9IjcwLjA3ODY1MTciIHJ5PSI2OS45NzMyODI0Ij48L2VsbGlwc2U+CiAgICAgICAgICAgICAgICA8ZyBpZD0iQmx1ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQ4LjE1MjY3MiwgMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJNYXNrIj48L2c+CiAgICAgICAgICAgICAgICAgICAgPGVsbGlwc2UgZmlsbD0iIzQwQkNGNCIgbWFzaz0idXJsKCNtYXNrLTIpIiBjeD0iNTkuNzY4Njc2NiIgY3k9IjY5Ljk3MzI4MjQiIHJ4PSI3MC4wNzg2NTE3IiByeT0iNjkuOTczMjgyNCI+PC9lbGxpcHNlPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPGcgaWQ9Ik9yYW5nZSI+CiAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stNCIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTMiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iTWFzayI+PC9nPgogICAgICAgICAgICAgICAgICAgIDxlbGxpcHNlIGZpbGw9IiNGRjgwMDAiIG1hc2s9InVybCgjbWFzay00KSIgY3g9IjcwLjA3ODY1MTciIGN5PSI2OS45NzMyODI0IiByeD0iNzAuMDc4NjUxNyIgcnk9IjY5Ljk3MzI4MjQiPjwvZWxsaXBzZT4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMjkuNTM5MzI2LDEwNy4wMjIyNDQgQzEyMi44MTA0OTMsOTYuMjc4MTY3NyAxMTguOTIxMzQ4LDgzLjU3OTIyMTMgMTE4LjkyMTM0OCw2OS45NzMyODI0IEMxMTguOTIxMzQ4LDU2LjM2NzM0MzUgMTIyLjgxMDQ5Myw0My42NjgzOTcyIDEyOS41MzkzMjYsMzIuOTI0MzIwOSBDMTM2LjI2ODE1OSw0My42NjgzOTcyIDE0MC4xNTczMDMsNTYuMzY3MzQzNSAxNDAuMTU3MzAzLDY5Ljk3MzI4MjQgQzE0MC4xNTczMDMsODMuNTc5MjIxMyAxMzYuMjY4MTU5LDk2LjI3ODE2NzcgMTI5LjUzOTMyNiwxMDcuMDIyMjQ0IFoiIGlkPSJPdmVybGFwIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjQ4LjQ2MDY3NCwzMi45MjQzMjA5IEMyNTUuMTg5NTA3LDQzLjY2ODM5NzIgMjU5LjA3ODY1Miw1Ni4zNjczNDM1IDI1OS4wNzg2NTIsNjkuOTczMjgyNCBDMjU5LjA3ODY1Miw4My41NzkyMjEzIDI1NS4xODk1MDcsOTYuMjc4MTY3NyAyNDguNDYwNjc0LDEwNy4wMjIyNDQgQzI0MS43MzE4NDEsOTYuMjc4MTY3NyAyMzcuODQyNjk3LDgzLjU3OTIyMTMgMjM3Ljg0MjY5Nyw2OS45NzMyODI0IEMyMzcuODQyNjk3LDU2LjM2NzM0MzUgMjQxLjczMTg0MSw0My42NjgzOTcyIDI0OC40NjA2NzQsMzIuOTI0MzIwOSBaIiBpZD0iT3ZlcmxhcCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=";
    const url = `${letterboxdURL}${id}`;
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
          if (response.status === 200) {
            const responseText = response.responseText;
            // Get the relevant info from the response
            const scriptMatch = responseText.match(
              /<script type="application\/ld\+json">\n\/\* <!\[CDATA\[ \*\/\n([\s\S]*?)\/\* ]]> \*\/\n<\/script>/
            );
            if (scriptMatch && scriptMatch[1]) {
              const jsonData = JSON.parse(scriptMatch[1]);
              const aggregateRating = jsonData.aggregateRating;
              if (aggregateRating) {
                console.log("Letterboxd data found.");
                const ratingValue = aggregateRating.ratingValue;
                const ratingCount = aggregateRating.ratingCount;
                buildElement(siteName, response.finalUrl, logoURL, ratingValue, ratingCount);
              }
            } else {
              console.error("Letterboxd data not found.");
              return;
            }
          } else {
            console.error(
              "Failed to fetch the webpage. Status:",
              response.status
            );
            reject(`Failed to fetch the webpage. Status: ${response.status}`);
          }
        },
        onerror: function (error) {
          console.error("Error fetching the webpage:", error);
          reject(error);
        },
      });
    });
  }

  getIMDBID();

})();

