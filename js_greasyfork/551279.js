// ==UserScript==
// @name        sc-letterboxd-rating
// @namespace   https://tampermonkey.net/
// @version     2.1
// @author      boisterous-larva
// @description Add rating and link to Letterboxd to SC torrent pages.
// @homepage    https://github.com/boisterous-larva/sc-letterboxd-rating/blob/master/sc-letterboxd-rating.user.js
// @icon        https://letterboxd.com/favicon.ico
// @match       https://*.secret-cinema.pw/torrents.php?id=*
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/551279/sc-letterboxd-rating.user.js
// @updateURL https://update.greasyfork.org/scripts/551279/sc-letterboxd-rating.meta.js
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
      handleIMDB(id)
      handleLetterboxd(id);
    }

  }

  // function getRottenID() {
  //   let rottenURL = document.querySelector('.meta__rotten a').href;
  //   if (rottenURL) {
  //     handleRotten(rottenURL);
  //   } else return;
  // }


  function getElementByInnerText(tag, text) {
    return Array.from(document.querySelectorAll(tag)).find(
      (el) => el.innerText.trim().toLowerCase() === text
    );
  }

  function buildElement(siteName, url, logo, rating, count) {
    if (!rating) return;
    const linkbox = document.querySelector(".linkbox"); // Selects the first linkbox on the page. Consider improving this by making it more specific.
    if (!linkbox) return;
    let ratingFloat = parseFloat(rating);
    let ratingColor = "white"; // Default.
    if (ratingFloat){
      if (siteName === "IMDb") ratingFloat = ratingFloat / 2; // IMDb ratings are out of 10, adjust to match other ratings
      if (siteName === "RT") ratingFloat = (ratingFloat / 100) * 5 // Rotten scores are out of 100, adjust to match other ratings
      ratingColor =
        ratingFloat < 2.5
          ? "rgba(212, 36, 36, 0.8)" // Red for ratings below 2.5 (5.0 IMDb and 50% RT)
          : ratingFloat < 3.5
            ? "rgba(212, 195, 36, 0.8)" // Yellow for ratings 2.5 and above (5.0 IMDb and 50% RT)
            : ratingFloat < 4.5
              ? "rgba(0,224,84, 0.8)" // Green for ratings 3.5 and above (7.0 IMDb and 70& RT)
              : "rgba(113, 251, 255, 0.8)"; // Light blue for ratings 4.5 and above (9.0 IMDb and 90% RT)
    }

    const logoLink = logo;
    const img = document.createElement("img");
    img.className = `${siteName.toLowerCase()}-chip__icon`;
    img.src = logoLink;

    const iconStyle = `
        .meta-chip {
          display: grid;
          grid-template-areas:
              "image name"
              "image value";
          grid-template-columns: 32px auto;
          grid-template-rows: auto auto;
          border-radius: 26px;
          padding: 6px 12px 6px 12px;
          background: black;
        }
        .${siteName.toLowerCase()}-chip__icon{
          grid-area: image;
          text-align: center;
          line-height: 40px;
          font-size: 12px;
          width: 25px;
          height: 25px;
          border-radius: 4%;
          filter: drop-shadow(0 0 0.3rem ${ratingColor});
        }

        .meta-chip__name {
            color: white;
            grid-area: name;
            display: inline;
            margin: 0;
            font-weight: 400;
            font-size: 12px;
            line-height: 1;
            align-self: end;
        }
        .meta-chip__value {
            color:white;
            grid-area: value;
            display: inline;
            margin: 0;
            padding: 0;
            line-height: 1;
            align-self: start;
            height: 100%;
            font-weight: 400;
            font-size: 10px;
        }`;
    const container = document.createElement("div");
    const ratingName = document.createElement("h2");
    const ratingValue = document.createElement("h3");
    const meta_id_tag = document.createElement("a");
    meta_id_tag.className = "meta-chip";
    meta_id_tag.style = "column-gap:4px; row-gap:0; padding-right:18px;";
    ratingName.className = "meta-chip__name";
    ratingValue.className = "meta-chip__value";
    ratingValue.style = `color:${ratingColor};`;
    meta_id_tag.href = url;
    meta_id_tag.target = "_blank";
    meta_id_tag.append(img);
    ratingName.innerText = siteName;
    ratingValue.innerText = `${rating} / ${count} Votes`;
    meta_id_tag.append(ratingName);
    meta_id_tag.append(ratingValue);
    container.className = "ratings-container";
    container.style = `display:flex; margin-top:4px; gap:6px;`;
    const ratingsContainer = document.querySelector('.ratings-container');
    if (!ratingsContainer) {
      container.append(meta_id_tag);
      linkbox.append(container);
    } else ratingsContainer.append(meta_id_tag);
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

  function handleIMDB(id) {
    const siteName = "IMDb";
    const logoURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAHJ0lEQVR4nO2daWxUVRTH//fN1um0tBTKtKXUCi2JYkGjYKGKW4CgEYvGJSpqqGjkgwtKYhMNMX4wROOCcUkjxKiJAqIYFZRCTAibqNEYgYSClBa6gLTQZWa6vF4/1JFXOvvylp7z+zR9c/vumd7fO+e++968ClxCzz5vBaTyuIC8DRKlEPBc2oaxFBcgcAxSfD2kyrrs+W1ntW+K4Au5rczly+l5C8CTABS9o2R0oVNCPJ1V1fpZcIMAhgffn9OzXQK3GBcboxNSArVZVW1rgf+OdF9uz9s8+GQQAnjNt6fwbgAQPfu8FUKKP8BpnxrtPjlYrkAqNeDBp4jXLexPKELIBUZHwhiDAO5RIFFidCCMUcgrFABZRofBGIXI5dpPHBaAOCwAcVgA4rAAxGEBiMMCEIcFIA4LQBwWgDgsAHFYAOKwAMRhAYjDAhCHBSAOC0AcFoA4LABxWADisADEYQGIwwIQhwUgDgtAHBaAOCwAcVgA4rAAxGEBiMMCEIcFIA4LQBwWgDgsAHFYAOKwAMSxJ7sDT1VbTO169xYk9HtBHlrsRt1LOSO2LXmuE7sO9sW1n2Tj0CIEkD9ewfVXObH8LjcWVrrCto2ln5X3ZuL1Z8clHE8iWCYDNDQNjtrW2DJ6m55ICZzpGMK3uwNY+nwnHltzHv4+aWhM8ZJ0BtCLo03qiJ/VIaC5fcigaEKzeWcAAPDxK7kGRxI7lskA57uH8M/5iwN+ql1F/4D5jrbNOwP4cX98ZclILCMAMLIMNLaoEVoay4ZvfEaHEDMWE+DioJ8wsQA//zVgdAgxYy0BmrUZQL8J4OpHPPipbgJefSobLoeI2v7cBXPNTSJhmUkgABw9aUwJKPbaMGeGA3NmONDQPIhPvvNHbD9knfG3WgYwvgQU5dsM6TddWCoDnDitYlAF7Lbh10aQnRm9BCRLy1kVH231Y9ueABpbVQT6JLx5Nsyb5UBNdSZuuNqZsr4sJUD/gMTJVhXePMWwOptuATbu8OOZN7rQ3TvyFPfUGRWb6lVsqg9g2R1uvLN6XEzzkWhYSgBgeB7Q6w9duRQl/fVXSWPRrD/Qjw+3+KJ+hk+/96N/ANiwJidywxgw7RzAkxHa7oamwbD1v3CitetzQ/NgzAJv3OFPyYKTaQUoKwmdnBqaVTSGqf/Tiq0tQLys35r8gpNpBZheEnowI2WAqZOtLUCGU2DJTRmovjkDGc7o9f3goeQXnEw7B7is0AanQ4xa7z/aNAhXiD+OyyFQ7LW2AI/e6cabq4YvB7+7sRcvruuO2F57bSRRTCuA3S5QWmQbsfgDAO3nhgCMNr+k0Aa7Lf2naOnErvF3VrkjanuZgmthpi0BAkD5lNBH9LAEI5lWbINMxV/EJGSGmQSnGtMKAISfCIZiWrENQlg7A2hxRk8AKcG0AggRPgOE4vLJpq1mpsa0AgBAeZwZgIkfcwswJXYBpnIGSAhTC+CdoCAnK3qINgUoKVAwhqYAumFqAQCgLIZ5QEnB8JoBEz+mFSB4NJfFUAamFuuX/sfQmSYAEwsQpDzMkrCW4BKwHjnAFxhbBphegJgygI7XAFgAnQiWgHAXhbToWQI6u/QRoE+nG4tNK0CQsin2qLN7PdcA9v/Zr0s/vT59RDP9ybPHLVA40YaWs6EvAQsBlBbZ/n+dDo43q/hyVwB7fu/Hr0eiH5qJ3jXUockuv8XQTyo+r2kF0H628pLwAhTl2+B2pXf6t+6L3rjaT8xNzIDPf/Djl0P9cDkFDv8d/XsPifajxfQlAIi8ImjGm0AqKxK/a/dYs4pDxwdjOt2cMyP5K0aWEKAswkRQK4BZVgKXL3Hr0k9NdWbS+zCtANrBnB7hopCeZwCxcP9CNxZEeFBEJG68xglbjCNy38IMLJqbWD9aTCuAlkhrAWYqAQ8scuP92sSf8PHyiiysX5OLbE/kVPbgYjc+qE3+lnDAxJNALaVFNrgcAn0hngegPQXUuwQoCjBpvILKCidqqjNx6+zwtX/Vw56o+5t9pQNOh8DcmQ7UfeXD9r19OHFaRd+AhDdPwbyZw/3cdG3qvhkkevcWjK2lLSYuLFECmPTBAhCHBSAOC0AcFoA4LABxWADisADEYQGIwwIQhwUgDgtAHBaAOCwAcVgA4rAAxGEBiMMCEIcFIA4LQBwWgDgsAHFYAOKwAMRhAYjDAhCHBSAOC0AcFoA4LABxWADisADEYQGIwwIQhwUgDgtAHBaAOAqAC0YHwRhGlwLgiNFRMIbRpEiBLUZHwRiDFLJenDuQNy5DdTYAmGR0QIyuqEMqZioTKju6BMRKAPzEUEJIiPey57cdVgAgs6p1iwRqwRLQQIqdHlfrC4DmNDCrqm2tlGIZgA7DAmPSjSoh1mVmtN4ursMAEOJf7XXvLshXFLkCQiwFZBkgcvWPk0khPQAaJbBDqlifPb/tsPbNfwG0A8F76LE3rQAAAABJRU5ErkJggg==";
    const imdbURL = `https://www.imdb.com/title/${id}`;

    return new Promise((resolve, reject) => {
        // Step 1: Use GM.xmlHttpRequest to fetch the IMDb page
        GM.xmlHttpRequest({
          method: 'GET',
          url: imdbURL,
          onload: function(response) {
            try {
              // Step 2: Parse the HTML content
              const parser = new DOMParser();
              const doc = parser.parseFromString(response.responseText, 'text/html');
              if (doc){
                console.log("IMDB data found.");
              } else {
                console.error('IMDB data not found.');
                return;
              }

              // Step 3: Extract the rating
              const ratingBarParent = doc.querySelector('[data-testid="hero-rating-bar__aggregate-rating__score"]');
              if (!ratingBarParent) {
                throw new Error('IMDb rating element not found');
              }
              const ratingElement = ratingBarParent.querySelector('span');
              const rating = ratingElement.textContent.trim(); // e.g., "8.7"

              // Step 4: Extract the votes
              const parent = ratingBarParent.parentElement;
              const votesElement = parent.lastChild;
              const votes = votesElement.textContent.trim(); // e.g., "13K"

              // Step 5: Resolve with the results
              resolve(buildElement(siteName, imdbURL, logoURL, rating, votes)); // Assemble data and build IMDB element.
            } catch (error) {
              console.error('Error:', error.message);
              reject(error);
            }
          },
          onerror: function(error) {
            console.error('Request failed:', error);
            reject(new Error('Failed to fetch IMDb page'));
          }
        });
      });
  }

  function handleRotten(rottenURL) {
  const siteName = "RT";
  const logoURL = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgo8c3ZnIGlkPSJzdmczMzkwIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSIxNDEuMjUiIHZpZXdCb3g9IjAgMCAxMzguNzUgMTQxLjI1IiB3aWR0aD0iMTM4Ljc1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiA8bWV0YWRhdGEgaWQ9Im1ldGFkYXRhMzM5NiI+CiAgPHJkZjpSREY+CiAgIDxjYzpXb3JrIHJkZjphYm91dD0iIj4KICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgPGRjOnR5cGUgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIvPgogICAgPGRjOnRpdGxlLz4KICAgPC9jYzpXb3JrPgogIDwvcmRmOlJERj4KIDwvbWV0YWRhdGE+CiA8ZyBpZD0ibGF5ZXIxIiBmaWxsPSIjZjkzMjA4Ij4KICA8cGF0aCBpZD0icGF0aDM0MTIiIGQ9Im0yMC4xNTQgNDAuODI5Yy0yOC4xNDkgMjcuNjIyLTEzLjY1NyA2MS4wMTEtNS43MzQgNzEuOTMxIDM1LjI1NCA0MS45NTQgOTIuNzkyIDI1LjMzOSAxMTEuODktNS45MDcxIDQuNzYwOC04LjIwMjcgMjIuNTU0LTUzLjQ2Ny0yMy45NzYtNzguMDA5eiIvPgogIDxwYXRoIGlkPSJwYXRoMzQ3MSIgZD0ibTM5LjYxMyAzOS4yNjUgNC43Nzc4LTguODYwNyAyOC40MDYtNS4wMzg0IDExLjExOSA5LjIwODJ6Ii8+CiA8L2c+CiA8ZyBpZD0ibGF5ZXIyIj4KICA8cGF0aCBpZD0icGF0aDM0MzciIGQ9Im0zOS40MzYgOC41Njk2IDguOTY4Mi01LjI4MjYgNi43NTY5IDE1LjQ3OWMzLjc5MjUtNi4zMjI2IDEzLjc5LTE2LjMxNiAyNC45MzktNC42Njg0LTQuNzI4MSAxLjI2MzYtNy41MTYxIDMuODU1My03LjczOTcgOC40NzY4IDE1LjE0NS00LjE2OTcgMzEuMzQzIDMuMjEyNyAzMy41MzkgOS4wOTExLTEwLjk1MS00LjMxNC0yNy42OTUgMTAuMzc3LTQxLjc3MSAyLjMzNCAwLjAwOSAxNS4wNDUtMTIuNjE3IDE2LjYzNi0xOS45MDIgMTcuMDc2IDIuMDc3LTQuOTk2IDUuNTkxLTkuOTk0IDEuNDc0LTE0Ljk4Ny03LjYxOCA4LjE3MS0xMy44NzQgMTAuNjY4LTMzLjE3IDQuNjY4IDQuODc2LTEuNjc5IDE0Ljg0My0xMS4zOSAyNC40NDgtMTEuNDI1LTYuNzc1LTIuNDY3LTEyLjI5LTIuMDg3LTE3LjgxNC0xLjQ3NSAyLjkxNy0zLjk2MSAxMi4xNDktMTUuMTk3IDI4LjYyNS04LjQ3NnoiIGZpbGw9IiMwMjkwMmUiLz4KIDwvZz4KPC9zdmc+Cg==";
  const url = rottenURL;

  return new Promise((resolve, reject) => {
      // Step 1: Use GM.xmlHttpRequest to fetch the IMDb page
      GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
          try {
            // Step 2: Parse the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            if (doc){
              console.log("RT data found.");
            } else {
              console.error('RT data not found.');
              return;
            }

            // Step 3: Extract the ratings
            let criticsScore = doc.querySelector('[slot="criticsScore"]').textContent.trim();
            if (!criticsScore) {
              criticsScore = '-';
              console.error('Rotten critics score not found');
            }
            let audienceScore = doc.querySelector('[slot="audienceScore"]').textContent.trim();
            if (!audienceScore) {
              audienceScore = '-';
              console.error('Rotten audience score not found');
            }

            // Step 4: Extract number of reviews
            let reviews = doc.querySelector('[slot="criticsReviews"]').textContent.trim().match(/\d+/)[0];
            if (!reviews) {
              reviews = '-';
              console.error('Rotten number of reviews not found');

            }

            // Step 5: Resolve with the results
            resolve(buildElement(siteName, url, logoURL, criticsScore, `${audienceScore} / ${reviews}`)); // Assemble data and build element.
          } catch (error) {
            console.error('Error:', error.message);
            reject(error);
          }
        },
        onerror: function(error) {
          console.error('Request failed:', error);
          reject(new Error('Failed to fetch Rotten page'));
        }
      });
    });
}

  getIMDBID();
  // getRottenID();

})();
