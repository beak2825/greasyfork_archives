// ==UserScript== 
// @name         Wiki Check
// @author       Schimon Jehudah, Adv.
// @homepageURL  https://greasyfork.org/scripts/562198-wiki-check
// @supportURL   https://greasyfork.org/scripts/562198-wiki-check/feedback
// @copyright    2026, Schimon Jehudah (http://schimon.i2p)
// @license      MIT
// @namespace    i2p.schimon.wiki-check
// @description  Notify of similar articles over your preferred wiki.
// @tag          wiki
// @run-at       document-start
// @version      26.01.13
// @grant        GM.getValue
// @grant        GM.notification
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @match        *://*.wikipedia.org/*
// @match        *://*.m.wikipedia.org/*
// @connect      *
// @connect      archlinuxarm.org
// @connect      metapedia.org
// @connect      wiki.archlinux.org
// @connect      wiki.artixlinux.org
// @connect      wiki.gentoo.org
// @connect      wiki.postmarketos.org
// @connect      wiki.xmpp.org
// @icon         data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMCAxMDAiPgogICAgICAgIDx0ZXh0IHk9Ii45ZW0iIGZvbnQtc2l6ZT0iOTAiPvCfk5o8L3RleHQ+CiAgICA8L3N2Zz4KICA=
// @downloadURL https://update.greasyfork.org/scripts/562198/Wiki%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/562198/Wiki%20Check.meta.js
// ==/UserScript==

var gmGetValue,
    gmNotification,
    gmRegisterMenuCommand,
    gmXmlHttpRequest,
    gmSetValue;

// Check availability of Greasemonkey API

if (typeof GM !== "undefined" && typeof GM.xmlHttpRequest === "function") {
  gmXmlHttpRequest = true;
} else {
  gmXmlHttpRequest = false;
  console.warn("Greasemonkey API GM.xmlHttpRequest does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.registerMenuCommand === "function") {
  gmRegisterMenuCommand = true;
} else {
  gmRegisterMenuCommand = false;
  console.warn("Greasemonkey API GM.registerMenuCommand does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.notification === "function") {
  gmNotification = true;
} else {
  gmNotification = false;
  console.warn("Greasemonkey API GM.notification does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.getValue === "function") {
  gmGetValue = true;
} else {
  gmGetValue = false;
  console.warn("Greasemonkey API GM.getValue does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.setValue === "function") {
  gmSetValue = true;
} else {
  gmSetValue = false;
  console.warn("Greasemonkey API GM.setValue does not seem to be available.");
}

function messageError(hst) {
  console.info("📚 Wiki Check: Server " + hst + " is not blocked nor offline.");
  //notification("Check that server " + hst + " is not blocked nor offline.", "🚧");
}

function messageFail() {
  notification("No article was found.", "🛑");
}

function messageWait() {
  notification("Searching for similar articles... Please wait.", "🔭");
}

function messageArticle() {
  notification("An article was found.", "📰");
}

function messageArticleOf(number) {
  notification("A similar article, out of " + number + " similar articles, was found.", "📰");
}

function messageArticles(number) {
  notification(number + " similar articles were found.", "🗞️");
}

function changeProvider() {
  if (gmSetValue) {
    let hst = prompt("Enter hostname of a desired provider (e.g. en.metapedia.org)");
    GM.setValue("hostname", hst);
  } else {
    alert("Could not change provider. Function \"GM.setValue\" is not supported.");
  }
}

//(function createMenu() {
  if (gmRegisterMenuCommand) {
    GM.registerMenuCommand("Set a wiki provider.", () => changeProvider());
  }
//})()

(async function engage() {
  let hst;
  if (gmGetValue) {
    hst = await GM.getValue("hostname", "en.metapedia.org");
  } else {
    hst = "en.metapedia.org";
  }
  let trm = location.pathname.slice(6).replaceAll("_", "%20");
  let uri = "https://" + hst + "/index.php?search=" + trm + "&title=Special%3ASearch&profile=default&fulltext=1";
  if (gmXmlHttpRequest) {
    GM.xmlHttpRequest({
      method: "GET",
      url: uri,
      synchronous: false,
      //onprogress: messageWait(),
      onload: function(response) {
        let responseData = response;
        let finalUri = new URL(responseData.finalUrl);
        if (finalUri.hostname == hst && responseData.status == 200) {
          if (finalUri.pathname.startsWith("/wiki/")) {
            messageArticle();
            if (confirm("Do you want to read this article at " + hst)) {
              location = finalUri;
            }
          } else {
            let domParser = new DOMParser();
            let content = domParser.parseFromString(responseData.responseText, "text/html");
            let numberOfResults, resultUri;
            let resultsTotal = content.querySelector("*[data-mw-num-results-total]");
            if (resultsTotal) {
              numberOfResults = resultsTotal.getAttribute("data-mw-num-results-total");
            }
            let resultExists = content.querySelector(".mw-search-exists a");
            if (resultExists) {
              resultUri = "https://" + hst + resultExists.getAttribute("href");
            }
            if (resultUri) {
              messageArticleOf(numberOfResults);
              if (confirm("Do you want to read this article at " + hst)) {
                location = resultUri;
              }
            } else
            if (numberOfResults) {
              messageArticles(numberOfResults);
              if (confirm("Do you want to read similar articles at " + hst)) {
                location = uri;
              }
            } else
            if (content.querySelector(".mw-search-nonefound")) {
              let noResults = content.querySelector(".mw-search-nonefound").textContent;
              console.info("📚 Wiki Check: " + noResults.trim());
            } else {
              console.info("📚 Wiki Check: No results.");
            }
          }
        }
      },
      onerror: messageError(hst)
    });
  } else {
    notification("API GM.xmlHttpRequest does not seem to be available. Contribute your help in C++ to improve Greasemonkey for Falkon https://bugs.kde.org/show_bug.cgi?id=466533", "🖥");
  }
})()

function characterAsSvgDataUri(character) {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <text y=".9em" font-size="90">${character}</text>
    </svg>
  `;
  const base64Svg = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64Svg}`;
}

function notification(message, graphics) {
  console.info("📚 Wiki Check: " + message);
  if (gmNotification) {
    GM.notification(message, "📚 Wiki Check", characterAsSvgDataUri(graphics));
  }
}

