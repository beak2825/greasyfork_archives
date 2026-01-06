// ==UserScript==
// @name         EXHentai Web Clipper for Obsidian
// @namespace    https://exhentai.org
// @version      v1.0.36.20260106
// @description  🔞 A user script that exports EXHentai gallery metadata as Obsidian Markdown files (Obsidian EXHentai Web Clipper).
// @author       abc202306
// @match        https://exhentai.org/g/*
// @icon         none
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555824/EXHentai%20Web%20Clipper%20for%20Obsidian.user.js
// @updateURL https://update.greasyfork.org/scripts/555824/EXHentai%20Web%20Clipper%20for%20Obsidian.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class Main {
    util;

    // Entry point
    static main() {
      new Main(Util.util);
    }

    constructor(util) {
      this.util = util;
      this.util.startWebclipperWithDelay(
        2000,
        "EXHentai Web Clipper for Obsidian (a tampermonkey user script by abc202306) says:\n\nDo you want to proceed to clip the exhentai gallery metadata as a obsidian markdown note (by obsidian uri protocol api)?\n\nclick 'OK' to proceed, or 'Cancel' to abort.",
        this.getEXHentaiGalleryData.bind(this),
        this.getEXHentaiOBMDNoteFileContent.bind(this)
      );
    }

    // Extract metadata from page
    getEXHentaiGalleryData() {
      const util = this.util;

      const gn = document.getElementById("gn");
      const gj = document.getElementById("gj");
      const gdd = document.getElementById("gdd");
      const gdc = document.getElementById("gdc");
      const gdn = document.getElementById("gdn");
      const taglist = document.getElementById("taglist");

      const url = window.location.href;    

      const now = util.getLocalISOStringWithTimezone();

      const data0 = Object.fromEntries([...(gdd && gdd.firstChild && gdd.firstChild.firstChild ? gdd.firstChild.firstChild.childNodes : [])].map(c => {
        const key = c.children[0].innerText.replace(/:$/, "").toLowerCase().replaceAll(/\s/g, "");
        const value = key === "posted"
          ? (() => {
            const postedTimeData = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2}) (?<hour>\d{2}):(?<minute>\d{2})$/.exec(c.children[1].innerText).groups;
            return postedTimeData.year + "-" + postedTimeData.month + "-" + postedTimeData.day + "T" + postedTimeData.hour + ":" + postedTimeData.minute + ":00Z";
          })()
          : key === "language"
            ? (() => {
              const languageStr = c.children[1].innerText;
              return languageStr.length === 0 ? [] : languageStr.split(/\s+/).filter(i => i.length !== 0).map(i=>i.toLowerCase()).map(i => (i === "tr") ? "[[exhentai-tag-translated|translated]]" : (i==="n/a") ? ("[[exhentai-tag-n_a|n_a]]") : (`[[exhentai-tag-${i}|${i}]]`));
            })()
            : key === "length"
              ? parseInt(c.children[1].innerText.replace(/ pages$/, ""))
              : key === "favorited"
                ? parseInt(c.children[1].innerText.replace(/ times$/, ""))
                : key === "parent"
                  ? (c.children[1].firstChild && c.children[1].firstChild.href) || c.children[1].innerText
                  : key === "visible"
                    ? c.children[1].innerText
                    : key === "filesize"
                      ? c.children[1].innerText
                      : c.children[1].innerText;
        const keyMap = {
          "posted": "uploaded",
          "length": "pagecount"
        };
        return [keyMap[key] || key, value];
      }));

      const data0EntryCount = 7;
      if (Array.from(Object.entries(data0)).length !== data0EntryCount) {
        throw new Error(`exhentai-web-clipper-for-obsidian: gdd data length changed (expected ${data0EntryCount}, got ${Array.from(Object.entries(data0)).length})`);
      }

      const { uploaded, parent, visible, language, filesize, pagecount, favorited } = data0;

      const category = gdc.innerText.trim().toLowerCase().replaceAll(/\s/g, "-");

      const uploaderItem = gdn.innerText.trim();

      const categories = (gdc && gdc.innerText) ? [`[[exhentai-tag-${category}|${category}]]`] : []; // gd3.Category => categories
      const uploader = (gdn && gdn.innerText) ? [`[[exhentai-uploader-${uploaderItem}|${uploaderItem}]]`] : []; // gd3.Uploader => uploader

      const rating = parseFloat(document.getElementById("rating_label").innerText.replace(/Average: ([\d\.]*)/, "$1"));

      const ctime = now;
      const mtime = now;

      const gidPairResult = /^https?:\/\/e[x\-]hentai.org\/g\/(\d*)\/([a-z\d]*)\/?/.exec(window.location.href);
      const galleryID = gidPairResult ? gidPairResult[1] : null;
      const galleryToken = gidPairResult ? gidPairResult[2] : null;

      const basename = `exhentai-g-${galleryID}-${galleryToken}`;
      const titleEN = util.getTitleStr(gn);
      const titleJP = util.getTitleStr(gj);
      const title = util.sanitizeTitle(titleJP || titleEN);

      const aliases = (titleEN ? [titleEN] : []).concat(titleJP && titleJP !== titleEN ? [titleJP] : []); 

      // coverPromise: fetch cover URL once; swallow errors and resolve to empty string on failure  
      const coverPromise = fetch('https://api.e-hentai.org/api.php', { method: "POST", body: JSON.stringify({ "method": "gdata", "gidlist": [[galleryID, galleryToken]], "namespace": 1 }) })
        .then(response => response.ok ? response.json() : Promise.reject(new Error('cover fetch failed')))
        .then(json => (json && json.gmetadata && json.gmetadata[0] && json.gmetadata[0].thumb) || "")
        .catch(() => "");

      const data = {
        basename: basename,
        title: title,
        english: titleEN,
        japanese: titleJP,
        url: url,

        aliases: aliases,
        coverPromise: coverPromise,

        categories: categories,

        uploader: uploader,

        uploaded: uploaded, // gd3.Posted => uploaded
        parent: parent, // gd3.Parent => parent
        visible: visible, // gd3.Visible => visible
        language: language, // gd3.Language and gd4.language => language
        filesize: filesize, // gd3.Filesize => filesize
        pagecount: pagecount, // gd3.length => pagecount
        favorited: favorited, // gd3.Favorited => favorited

        rating: rating,

        ctime: ctime,
        mtime: mtime,

        parody: [],
        character: [],
        artist: [],
        group: [],
        female: [],
        male: [],
        mixed: [],
        location: [],
        other: [],
        unindexedData: {}
      };

      const dataKeyIndexed = Object.keys(data);

      if (taglist && taglist.firstChild && taglist.firstChild.firstChild) {
        [...taglist.firstChild.firstChild.children].forEach(c => {
          const key = (c.children[0] && c.children[0].innerText ? c.children[0].innerText.replace(/:$/, "").toLowerCase().replaceAll(/\s/g, "") : "");
          const value = (c.children[1] && c.children[1].innerText) ? c.children[1].innerText.split("\n").map(i => `[[exhentai-tag-${util.getTagNameStr(i)}|${util.getTagNameStr(i)}]]`) : [];

          const newValue = [...new Set(
            Array.isArray(data[key])
              ? data[key].concat(value)
              : data[key]
                ? [data[key]].concat(value)
                : value
          )];

          if (dataKeyIndexed.includes(key) && key !== "unindexedData") {
            data[key] = newValue;
          } else {
            data.unindexedData[key] = newValue;
          }
        });
      }

      return data;
    }

    // Build Obsidian note content
    async getEXHentaiOBMDNoteFileContent(data) {
      const util = this.util;

      const yamlArray = util.getYamlArrayStr.bind(util);
      const unindexDataYamlPart = util.getUnindexedDataFrontMatterPartStrBlock.bind(util);
      const unindexDataTablePart = util.getUnindexedDataTablePartStrBlock.bind(util);

      const { categories,
        female, male, mixed, location, other,
        title, english, japanese, url,
        artist, group,
        parody, character, language,
        pagecount,
        aliases,
        coverPromise,
        uploader,
        parent, visible, filesize,
        favorited, rating, uploaded,
        ctime, mtime,
        unindexedData
      } = data;
      const coverUrl = await coverPromise;

      return `---
up:
  - "[[collection-gallery-items|collection-gallery-items]]"
categories:${yamlArray(categories)}
female:${yamlArray(female)}
male:${yamlArray(male)}
mixed:${yamlArray(mixed)}
location:${yamlArray(location)}
other:${yamlArray(other)}
english: "${english}"
japanese: "${japanese}"
title: "${title}"
url: "${url}"
artist:${yamlArray(artist)}
group:${yamlArray(group)}
parody:${yamlArray(parody)}
character:${yamlArray(character)}
language:${yamlArray(language)}
pagecount: ${pagecount}
aliases:${yamlArray(aliases)}
cover: "${coverUrl}"
uploader:${yamlArray(uploader)}
parent: "${parent}"
visible: "${visible}"
filesize: "${filesize}"
favorited: ${favorited}
rating: ${rating}
uploaded: ${uploaded}
ctime: ${ctime}
mtime: ${mtime}${unindexDataYamlPart(unindexedData)}
---

# \`${title}\`

![200](${coverUrl})

| | |
| --- | --- |
| title_en | \`${util.escapePipe(english)}\` |
| title_jp | \`${util.escapePipe(japanese)}\` |
| url | ${url} |
| parody | ${util.escapePipe(parody.join(", "))} |
| character | ${util.escapePipe(character.join(", "))} |
| artist | ${util.escapePipe(artist.join(", "))} |
| group | ${util.escapePipe(group.join(", "))} |
| languages | ${util.escapePipe(language.join(", "))} |
| categories | ${util.escapePipe(categories.join(", "))} |
| female | ${util.escapePipe(female.join(", "))} |
| male | ${util.escapePipe(male.join(", "))} |
| mixed | ${util.escapePipe(mixed.join(", "))} |
| location | ${util.escapePipe(location.join(", "))} |
| other | ${util.escapePipe(other.join(", "))} |
| pagecount | ${pagecount} |
| uploader | ${util.escapePipe(uploader.join(", "))} |
| uploaded | ${uploaded} |
| parent | ${parent} |
| visible | ${visible} |
| filesize | ${filesize} |
| favorited | ${favorited} |
| rating | ${rating} |${util.escapePipe(unindexDataTablePart(unindexedData))}
`;
    }
  }

  // utils  

  class DefaultConfig {
    static vault = "galleries";
    static path = "galleries/exhentai";
    static isAutoConfirm = "0";
  }

  class Config {
    static config = new Config();
    getPath(){
      return GM_getValue("path",DefaultConfig.path).replace(/\/$/,"");
    }
    getVault(){
      return GM_getValue("vault",DefaultConfig.vault);
    }
    getISAutoConfirm(){
      return GM_getValue("isAutoConfirm",DefaultConfig.isAutoConfirm);
    }
    constructor() {
      this.menuCommandIdForPath = this.registerMenuCommand(
        this.getPath.bind(this),
        "path",
        "menuCommandIdForPath"
      );
      this.menuCommandIdForVault = this.registerMenuCommand(
        this.getVault.bind(this),
        "vault",
        "menuCommandIdForVault"
      );
      this.menuCommandIdForIsAutoConfirm = this.registerMenuCommand(
        this.getISAutoConfirm.bind(this),
        "isAutoConfirm",
        "menuCommandIdForIsAutoConfirm"
      );
    }
    menuCommandIdForPath;
    menuCommandIdForVault;
    menuCommandIdForISAutoConfirm;
    registerMenuCommand(getValue,valueKey,menuCommandIdKey){
      const value = getValue();
      const curConfigObj = this;
      return GM_registerMenuCommand(`Set ${valueKey} Value (${valueKey}=${value}")`, () => {
          GM_setValue(valueKey, prompt(`${valueKey}=`,value));
          GM_unregisterMenuCommand(curConfigObj[menuCommandIdKey]);
          curConfigObj[menuCommandIdKey] = curConfigObj.registerMenuCommand(getValue,valueKey,menuCommandIdKey);
      });
    }
  }

  class Util {
    static util = new Util();
    startWebclipperWithDelay(timeout, message, getGalleryData, getOBMDNoteFileContent) {
      setTimeout(async () => {
        if (Config.config.getISAutoConfirm()||confirm(message)) {
          const galleryData = getGalleryData();
          const content = await Promise.resolve(getOBMDNoteFileContent(galleryData));
          const obsidianURI = this.getObsidianURI(galleryData.basename, content);
          window.location.href = obsidianURI;
        }
      }, timeout);
    }

    // Build Obsidian URI
    getObsidianURI(theOBMDNotefileBaseName, theOBMDNoteFileContent) {
      const params = [
        ["vault", Config.config.getVault()],
        ["file", `${Config.config.getPath()}/${theOBMDNotefileBaseName}`.replace(/^\//, "")],
        ["content", theOBMDNoteFileContent],
        ["append", "1"]
      ].map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");

      return `obsidian://new?${params}`;
    }

    getUnindexedDataFrontMatterPartStrBlock(unindexedData) {
      return Object.entries(unindexedData).map(([key, value]) =>
        Array.isArray(value) ? `\n${key}:${this.getYamlArrayStr(value)}` : `\n${key}: "${value}"`
      ).join('');
    }

    getUnindexedDataTablePartStrBlock(unindexedData) {
      return Object.entries(unindexedData).map(([key, value]) =>
        `\n| ${key} | ${Array.isArray(value) ? value.join(", ") : value} |`
      ).join('');
    }

    escapePipe(str) {
      return (str || "").replace(/\|/g, "\\|");
    }

    sanitizeTitle(titleStr, addtionalSuffix="") {
      return (titleStr + addtionalSuffix).replace(/\s{2,}/g, " ").trim();
    }

    getTitleStr(titleEl) {
      if (!titleEl) return "";
      return titleEl.innerText.replace(/\s{2,}/g, " ").replace(/"/g, "\\\"").trim();
    }

    getTagNameStr(str) {
      return str.trim()
        .replace(/\s+/g, "-")
        .replace("-|-", "-or-");
    }

    getLocalISOStringWithTimezone() {
      const date = new Date();
      const pad = n => String(n).padStart(2, "0");

      const offset = -date.getTimezoneOffset(); // actual UTC offset in minutes
      const sign = offset >= 0 ? "+" : "-";
      const hours = pad(Math.floor(Math.abs(offset) / 60));
      const minutes = pad(Math.abs(offset) % 60);

      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
        `${sign}${hours}:${minutes}`;
    }

    getYamlArrayStr(arr) {
      return arr.map(i => `\n  - "${i}"`).join("");
    }
  }

  Main.main();
})();