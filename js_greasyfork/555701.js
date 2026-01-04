// ==UserScript==
// @name         NHentai Web Clipper for Obsidian
// @namespace    https://nhentai.net
// @version      v1.0.37.20260102
// @description  🔞 A user script that exports NHentai gallery metadata as Obsidian Markdown files (Obsidian NHentai Web Clipper).
// @author       abc202306
// @match        https://nhentai.net/g/*
// @icon         none
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555701/NHentai%20Web%20Clipper%20for%20Obsidian.user.js
// @updateURL https://update.greasyfork.org/scripts/555701/NHentai%20Web%20Clipper%20for%20Obsidian.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class Main {
    static KEY_MAP = {
      parodies: "parody",
      characters: "character",
      tags: "keywords",
      artists: "artist",
      groups: "group",
      languages: "language",
      categories: "categories"
    };

    util;

    // Entry point
    static main() {
      new Main(Util.util);
    }

    constructor(util) {
      this.util = util;
      this.util.startWebclipperWithDelay(
        2000,
        "NHentai Web Clipper for Obsidian (a tampermonkey user script by abc202306) says:\n\nDo you want to proceed to clip the nhentai gallery metadata as a obsidian markdown note (by obsidian uri protocol api)?\n\nclick 'OK' to proceed, or 'Cancel' to abort.",
        this.getNHentaiGalleryData.bind(this),
        this.getNHentaiOBMDNoteFileContent.bind(this)
      );

    }
    getNHentaiGalleryData() {
      const info = document.getElementById("info");
      const coverImg = document.querySelector("#cover img");
      if (!info || !coverImg) { throw new Error("NHentai Web Clipper for Obsidian: Failed to locate necessary DOM elements."); };
      const titles = info.querySelectorAll(".title");

      const now = this.util.getLocalISOStringWithTimezone();

      const titleEN = this.util.getTitleStr(titles[0] ?? null);
      const titleJP = this.util.getTitleStr(titles[1] ?? null);

      const url = window.location.href;

      const galleryID = /(\d+)/.exec(url)[1];

      const data = {
        basename: `nhentai-g-${galleryID}`,
        title: this.util.sanitizeTitle(titleJP || titleEN),
        english: titleEN,
        japanese: titleJP,
        url: url,
        aliases: [...new Set([titleEN, titleJP].filter(t => t && t.length !== 0))],
        cover: coverImg.src,
        parody: [],
        character: [],
        keywords: [],
        artist: [],
        group: [],
        language: [],
        categories: [],
        pagecount: null,
        uploaded: null,
        ctime: now,
        mtime: now,
        unindexedData: {}
      };

      info.querySelectorAll("#tags > div.tag-container").forEach(tagGroupCon => {
        const textNode = [...tagGroupCon.childNodes].find(i => i.nodeType === Node.TEXT_NODE);
        const key = ((textNode && textNode.textContent) || "").trim().replace(/:$/, "").toLowerCase().replace(/\s/g, "");
        if (key === "uploaded") {
          const timeEl = tagGroupCon.querySelector("time");
          if (timeEl) data.uploaded = timeEl.dateTime;
        } else if (key === "pages") {
          const nameEl = tagGroupCon.querySelector(".name");
          data.pagecount = nameEl ? this.getTagName(nameEl) : null;
        } else if (Main.KEY_MAP[key]) {
          const newKey = Main.KEY_MAP[key];
          data[newKey] = this.toArray(data[newKey])
            .concat(Array.from(tagGroupCon.querySelectorAll(".name")).map(el => `[[exhentai-tag-${this.getTagName(el)}|${this.getTagName(el)}]]`));
        } else {
          data.unindexedData[key] = this.toArray(data.unindexedData[key])
            .concat(Array.from(tagGroupCon.querySelectorAll(".name")).map(el => `[[exhentai-tag-${this.getTagName(el)}|${this.getTagName(el)}]]`));
        }
      });

      return data;
    }

    getNHentaiOBMDNoteFileContent(data) {
      return `---
up:
  - "[[collection-gallery-items|collection-gallery-items]]"
categories:${this.util.getYamlArrayStr(data.categories)}
keywords:${this.util.getYamlArrayStr(data.keywords)}
english: "${data.english}"
japanese: "${data.japanese}"
title: "${data.title}"
url: "${data.url}"
artist:${this.util.getYamlArrayStr(data.artist)}
group:${this.util.getYamlArrayStr(data.group)}
parody:${this.util.getYamlArrayStr(data.parody)}
character:${this.util.getYamlArrayStr(data.character)}
language:${this.util.getYamlArrayStr(data.language)}
pagecount: ${data.pagecount}
aliases:${this.util.getYamlArrayStr(data.aliases)}
cover: "${data.cover}"
uploaded: ${data.uploaded}
ctime: ${data.ctime}
mtime: ${data.mtime}${this.util.getUnindexedDataFrontMatterPartStrBlock(data.unindexedData)}
---

# \`${data.title}\`

![200](${data.cover})

| | |
| --- | --- |
| title_en | \`${this.util.escapePipe(data.english)}\` |
| title_jp | \`${this.util.escapePipe(data.japanese)}\` |
| url | ${data.url} |
| Parodies | ${this.util.escapePipe(data.parody.join(", "))} |
| Characters | ${this.util.escapePipe(data.character.join(", "))} |
| Tags | ${this.util.escapePipe(data.keywords.join(", "))} |
| Artists | ${this.util.escapePipe(data.artist.join(", "))} |
| Groups | ${this.util.escapePipe(data.group.join(", "))} |
| Languages | ${this.util.escapePipe(data.language.join(", "))} |
| Categories | ${this.util.escapePipe(data.categories.join(", "))} |
| Pages | ${data.pagecount} |
| Uploaded | ${data.uploaded} |${this.util.escapePipe(this.util.getUnindexedDataTablePartStrBlock(data.unindexedData))}
`;
    }

    getTagName(tagNameEl) {
      return this.util.getTagNameStr(tagNameEl.innerText);
    }

    toArray(value) {
      if (Array.isArray(value)) {
        return value;
      } else if (value != null) {
        return [value];
      } else {
        return [];
      }
    }
  }


  // utils  

  class DefaultConfig {
    static vault = "galleries";
    static path = "galleries/nhentai";
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