// ==UserScript==
// @name         manhuaren to Mihon
// @version      0.0.1
// @description  export manhuaren bookmark json
// @author       ShigureDD
// @namespace    https://www.manhuaren.net/bookmarker
// @match        https://www.manhuaren.net/bookmarker*
// @match        https://www.manhuaren.com/bookmarker*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/551774/manhuaren%20to%20Mihon.user.js
// @updateURL https://update.greasyfork.org/scripts/551774/manhuaren%20to%20Mihon.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  try {
    if (GM_registerMenuCommand) {
      GM_registerMenuCommand("export manhuaren bookmark", exportToMihon);
    }
  } catch (error) {
    exportToMihon();
  }

  function exportToMihon() {
    if (!window.location.host.startsWith("www.manhuaren")) {
      console.log("address error：" + window.location.href);
      return;
    }
    let cookie = document.cookie;

    String.prototype.toUnicode = function () {
      var result = "";
      for (var i = 0; i < this.length; i++) {
        var partial = this[i].charCodeAt(0).toString(16);
        while (partial.length !== 4) partial = "0" + partial;
        result += "\\u" + partial;
      }
      return result;
    };

    function convertManhau(manhau) {
      let list = [];
      manhau.items.forEach((item) => {
        let newItem = {
          source: "3616827811449702173",
          url: `/v1/manga/getDetail?mangaId=${item.ID}`,
          title: item.Title.toUnicode(),
          status: item.Status === "最新" ? 1 : 2,
          thumbnailUrl: item.ShowPicUrlB,
          dateAdded: "1739073409560",
          viewerFlags: 0,
        };
        list.push(newItem);
      });

      let newObject = {
        backupManga: list,
        backupSources: [
          {
            name: "\u6f2b\u753b\u4eba",
            sourceId: "3616827811449702173",
          },
        ],
      };
      const jsonString = JSON.stringify(newObject, null, 2).replaceAll("\\\\u", "\\u");

      return jsonString;
    }

    async function getManhuarenData(pagesize) {
      const unixTimestampInMilliseconds = Date.now(); // Returns milliseconds since epoch
      const unixTimestampInSeconds = Math.floor(unixTimestampInMilliseconds / 1000); // Converts to seconds and floors to an integer
      let response = await fetch(
        `https://www.manhuaren.net/dm5.ashx?t=${unixTimestampInSeconds}`,
        {
          method: "POST",
          body: new URLSearchParams({
            pageindex: 1,
            pagesize: pagesize,
            sort: 1,
            title: "",
            action: "getmorebookmarkers",
          }),
          headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": " zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            cookie: cookie.toString(),
          },
        }
      );
      return response;
    }

    const getData = async () => {
      let response = await getManhuarenData(1);
      const data = await response.json();

      let response_2 = await getManhuarenData(data.count + 1);
      const allManhau = await response_2.json();
      let jsonString = await convertManhau(allManhau);

      let elementA = document.createElement("a");
      elementA.download = "manhauren_" + new Date().toLocaleString() + ".json";
      elementA.style.display = "none";

      let blob = new Blob([jsonString]);
      elementA.href = URL.createObjectURL(blob);
      document.body.appendChild(elementA);
      elementA.click();
      document.body.removeChild(elementA);
    };

    getData();
  }
})();
