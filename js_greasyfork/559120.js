// ==UserScript==
// @name         SteamDB Data Fork
// @namespace    https://steamdb.info/
// @version      0.2.6
// @description  Fetches Achievements/DLCs. Generates Tenoke, Goldberg, and RUNE configs.
// @author       SCN
// @match        https://steamdb.info/app/*
// @icon         https://steamdb.info/static/logos/192px.png
// @homepage     https://github.com/InsertCleverNameHere/GetDataFromSteam-SteamDB
// @homepageURL  https://github.com/InsertCleverNameHere/GetDataFromSteam-SteamDB
// @source       github:InsertCleverNameHere/GetDataFromSteam-SteamDB
// @supportURL   https://github.com/InsertCleverNameHere/GetDataFromSteam-SteamDB/issues
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/559120/SteamDB%20Data%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/559120/SteamDB%20Data%20Fork.meta.js
// ==/UserScript==

(function ($) {
  "use strict";

  /* global jQuery, fflate, saveAs */

  // =================================================================
  // 1. CONSTANTS & CONFIG
  // =================================================================
  const CONFIG = {
    CDN_BASE:
      "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps",
    BATCH_SIZE: 50,
    PREFIX: "sdb-fork",
  };

  const RUNE_ASCII = `###                                                                \\    /
###                       _  _                 _            _      \\\\__//
###      ____ ._/______:_//\\//_/____       _  //___  ./_ __//_____:_\\\\//
###     :\\  //_/    _  . /_/  /    /_/__:_//_/    /\\ /\\__/_    _  . /\\\\\\
###      \\\\///      ____/___./    / /     / /    /  /  \\X_/   //___/ /_\\_
###     . \\///   _______   _/_   /_/    _/_/     \\\\/   //        /_\\_\\  /.
###       z_/   _/\  _/   // /         //      /  \\   ///     __//   :\\//
###     | / _   / /\\//   /__//      __//_   _ /\\     /X/     /__/   |/\\/2
###   --+-_=\\__/ / /    / \\_____:__/ //\\____// /\\   /\\/__:_______=_-+--\\4
###     |-\\__\\- / /________\\____.__\\/- -\\--/_\\/_______\\--.\\________\\|___\\
###      = dS!\\/- -\\_______\\ =-RUNE- -== \\/ ==-\\______\\-= ======== --\\__\\
###`;

  // =================================================================
  // 2. STYLES
  // =================================================================
  GM_addStyle(`
        #${CONFIG.PREFIX}-trigger {
            position: fixed; bottom: 20px; right: 20px;
            background: #1b2838; color: #66c0f4; border: 1px solid #66c0f4;
            padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer;
            z-index: 9999; box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            font-family: "Motiva Sans", Arial, sans-serif;
            transition: all 0.2s;
        }
        #${CONFIG.PREFIX}-trigger:hover { background: #66c0f4; color: #fff; transform: translateY(-2px); }

        #${CONFIG.PREFIX}-overlay {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 10000;
            justify-content: center; align-items: center;
        }
        #${CONFIG.PREFIX}-overlay.active { display: flex; }

        #${CONFIG.PREFIX}-modal {
            background: #16202d;
            width: 95%;
            max-width: 700px;
            height: 650px;        /* Fixed Height */
            max-height: 90vh;     /* Mobile Safety */
            display: flex;
            flex-direction: column;
            border-radius: 6px; border: 1px solid #2a475e;
            font-family: "Motiva Sans", Arial, sans-serif; color: #c6d4df;
            box-shadow: 0 0 40px rgba(0,0,0,0.5);
        }

        .${CONFIG.PREFIX}-header {
            padding: 15px 20px; background: #101822; border-bottom: 1px solid #2a475e;
            display: flex; justify-content: space-between; align-items: center;
            flex-shrink: 0;
        }
        .${CONFIG.PREFIX}-header h3 { margin: 0; color: #fff; font-size: 18px; }
        .${CONFIG.PREFIX}-close { cursor: pointer; font-size: 24px; color: #67c1f5; }
        .${CONFIG.PREFIX}-close:hover { color: #fff; }

        .${CONFIG.PREFIX}-nav {
            display: flex; background: #1b2838; border-bottom: 1px solid #000;
            flex-shrink: 0;
        }
        .${CONFIG.PREFIX}-nav-item {
            flex: 1; padding: 15px; text-align: center; cursor: pointer; color: #8f98a0;
            border-bottom: 3px solid transparent; font-weight: bold; font-size: 14px;
            transition: background 0.2s;
        }
        .${CONFIG.PREFIX}-nav-item:hover { background: #233246; color: #fff; }
        .${CONFIG.PREFIX}-nav-item.active { border-bottom-color: #66c0f4; color: #fff; background: #233246; }

        /* Body becomes a flex column to fill remaining height */
        .${CONFIG.PREFIX}-body {
            padding: 20px; overflow: hidden; flex-grow: 1; display: flex; flex-direction: column;
        }

        .${CONFIG.PREFIX}-tab { display: none; flex-direction: column; flex-grow: 1; height: 100%; }
        .${CONFIG.PREFIX}-tab.active { display: flex; }

        /* Standard Controls Row */
        .${CONFIG.PREFIX}-controls {
            display: flex; gap: 10px; margin-bottom: 15px; align-items: center; flex-wrap: wrap; width: 100%; flex-shrink: 0; min-height: 36px;
        }
        .${CONFIG.PREFIX}-input-group { flex: 1; display: flex; gap: 10px; align-items: center; min-width: 0; }

        .${CONFIG.PREFIX}-select {
            flex-grow: 1; height: 36px; padding: 0 35px 0 10px;
            background-color: #000; color: #fff; border: 1px solid #444; border-radius: 3px;
            outline: none; cursor: pointer; font-size: 13px;
            appearance: none; -webkit-appearance: none; -moz-appearance: none;
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
            background-repeat: no-repeat; background-position: right 12px center; background-size: 10px;
        }
        .${CONFIG.PREFIX}-select:disabled { opacity: 0.5; cursor: not-allowed; }

        .${CONFIG.PREFIX}-checkbox-label {
            display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 13px; user-select: none; color: #8f98a0; white-space: nowrap;
        }
        .${CONFIG.PREFIX}-checkbox-label:hover { color: #fff; }
        .${CONFIG.PREFIX}-checkbox-label.disabled { opacity: 0.5; cursor: not-allowed; }
        .${CONFIG.PREFIX}-checkbox { accent-color: #66c0f4; width: 16px; height: 16px; margin: 0; cursor: pointer; }
        .${CONFIG.PREFIX}-checkbox:disabled { cursor: not-allowed; }

        .${CONFIG.PREFIX}-btn {
            padding: 0 16px; height: 36px; line-height: 36px; border: none; border-radius: 3px; cursor: pointer; font-weight: bold; color: #fff;
            transition: background 0.2s; position: relative; overflow: hidden; font-size: 13px; min-width: 80px; white-space: nowrap;
        }
        .${CONFIG.PREFIX}-btn-fixed { width: 100px; text-align: center; justify-content: center; }
        #${CONFIG.PREFIX}-btn-img { min-width: 60px; }

        .${CONFIG.PREFIX}-btn-primary { background: #66c0f4; color: #000; }
        .${CONFIG.PREFIX}-btn-primary:hover { background: #fff; }
        .${CONFIG.PREFIX}-btn-secondary { background: #3a4b5d; }
        .${CONFIG.PREFIX}-btn-secondary:hover { background: #4b627a; }
        .${CONFIG.PREFIX}-btn:disabled { opacity: 0.8; cursor: not-allowed; color: #ddd; }

        .${CONFIG.PREFIX}-btn.pause-mode { background: #f39c12; color: #fff; }
        .${CONFIG.PREFIX}-btn.pause-mode:hover { background: #d68910; }
        .${CONFIG.PREFIX}-btn.resume-mode { background: #27ae60; color: #fff; }
        .${CONFIG.PREFIX}-btn.resume-mode:hover { background: #2ecc71; }
        .${CONFIG.PREFIX}-btn.cancel-mode { background: #c0392b; color: #fff; }
        .${CONFIG.PREFIX}-btn.cancel-mode:hover { background: #e74c3c; }

        .${CONFIG.PREFIX}-textarea {
            width: 100%; height: auto; flex-grow: 1; background: #0d121a; color: #a6b2be; border: 1px solid #444; padding: 10px; box-sizing: border-box;
            font-family: Consolas, monospace; font-size: 12px; resize: none; white-space: pre;
        }

        .${CONFIG.PREFIX}-footer {
            margin-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; flex-shrink: 0;
        }
        #${CONFIG.PREFIX}-status { color: #8f98a0; text-align: right; }
        #${CONFIG.PREFIX}-footer-stats { color: #66c0f4; font-weight: bold; font-size: 12px; }

        /* --- STACKED GRID FOR SMOOTH CROSSFADE --- */
        .${CONFIG.PREFIX}-stack-container {
            display: grid; grid-template-columns: 1fr; grid-template-rows: 1fr; align-items: center; margin-bottom: 15px; flex-shrink: 0; min-height: 36px;
        }
        .${CONFIG.PREFIX}-controls-setup, .${CONFIG.PREFIX}-controls-progress {
            grid-area: 1 / 1; display: flex; align-items: center; gap: 10px; width: 100%; transition: opacity 0.5s ease, transform 0.5s ease, visibility 0.5s;
        }
        .${CONFIG.PREFIX}-visible { opacity: 1; transform: scale(1); visibility: visible; pointer-events: auto; z-index: 2; }
        .${CONFIG.PREFIX}-hidden { opacity: 0; transform: scale(0.98); visibility: hidden; pointer-events: none; z-index: 1; }

        /* --- Progress Bar Styles --- */
        .${CONFIG.PREFIX}-progress-info {
            flex: 1; display: flex; justify-content: space-between; align-items: center; background: #0d121a; padding: 0 12px; height: 36px; border-radius: 3px; border: 1px solid #444; margin-right: 0; position: relative; overflow: hidden;
        }
        .${CONFIG.PREFIX}-progress-fill {
            position: absolute; top: 0; left: 0; bottom: 0; background: rgba(102, 192, 244, 0.2); width: 0%; transition: width 0.5s ease; z-index: 0;
        }
        .${CONFIG.PREFIX}-progress-percent {
            color: #ffffff; font-weight: bold; font-size: 14px; font-family: "Motiva Sans", Arial, sans-serif; font-variant-numeric: tabular-nums; text-shadow: 0 1px 4px rgba(0,0,0,1); z-index: 1;
        }
        .${CONFIG.PREFIX}-progress-text { color: #66c0f4; font-weight: bold; font-size: 13px; z-index: 1; }
    `);

  // =================================================================
  // 3. NETWORK MODULE
  // =================================================================
  const Network = {
    fetchBuffer: (url) => {
      return new Promise((resolve) => {
        if (!url) return resolve(null);
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          responseType: "arraybuffer",
          onload: (res) =>
            resolve(res.status === 200 ? new Uint8Array(res.response) : null),
          onerror: () => resolve(null),
        });
      });
    },

    fetchText: (url) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "text/html",
          },
          onload: (res) => {
            if (res.status === 200) resolve(res.responseText);
            else reject(`HTTP ${res.status}`);
          },
          onerror: (err) => reject("Network Error"),
        });
      });
    },
  };

  // =================================================================
  // 4. PARSER MODULE
  // =================================================================
  const Parser = {
    cleanHtml(htmlString) {
      return htmlString.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
    },

    achievements(htmlString, appId) {
      const safeHtml = this.cleanHtml(htmlString);
      const doc = new DOMParser().parseFromString(safeHtml, "text/html");
      const $doc = $(doc);
      const list = [];

      $doc.find(".achievement_inner").each((i, el) => {
        const $el = $(el);
        const apiName = $el.find(".achievement_api").text().trim();
        const displayName = $el.find(".achievement_name").text().trim();
        let description = $el.find(".achievement_desc").text().trim();

        const $spoiler = $el.find(".achievement_spoiler");
        const isHidden = $spoiler.length > 0;
        if (isHidden) description = $spoiler.text().trim();

        const iconBase = $el.find(".achievement_image").attr("data-name");
        const iconGrayBase = $el
          .closest(".achievement")
          .find(".achievement_checkmark .achievement_image_small")
          .attr("data-name");

        if (apiName) {
          list.push({
            apiName,
            displayName,
            description,
            hidden: isHidden,
            iconUrl: iconBase
              ? `${CONFIG.CDN_BASE}/${appId}/${iconBase}`
              : null,
            iconGrayUrl: iconGrayBase
              ? `${CONFIG.CDN_BASE}/${appId}/${iconGrayBase}`
              : null,
            iconBase,
            iconGrayBase,
          });
        }
      });
      return list;
    },

    dlcs(htmlString) {
      const safeHtml = this.cleanHtml(htmlString);
      const doc = new DOMParser().parseFromString(
        `<table>${safeHtml}</table>`,
        "text/html"
      );
      const $doc = $(doc);
      const list = [];

      $doc.find("tr.app[data-appid]").each((i, el) => {
        const $el = $(el);
        const id = $el.attr("data-appid");
        let $td = $el.find("td:nth-of-type(3)");
        let name = $td.find("a b").first().text().trim();

        if (!name) name = $td.find("a").first().text().trim();
        if (!name) {
          let clone = $td.clone();
          clone.find(".muted, .label").remove();
          name = clone.text().trim();
        }

        if (id && name) list.push({ id, name });
      });
      return list;
    },

    // ADVANCED ITEM PARSER
    items(htmlString, appId) {
      const safeHtml = this.cleanHtml(htmlString);
      const doc = new DOMParser().parseFromString(safeHtml, "text/html");
      const $doc = $(doc);
      const list = [];

      $doc.find(".economy-item").each((i, el) => {
        const $el = $(el);
        const item = { appid: appId };

        // 1. Name & ID
        const $header = $el.find("h4.economy-item-name");

        // Handle name (sometimes inside <i>)
        const $i = $header.find("i");
        item.name = (
          $i.length > 0 ? $i : $header.clone().children().remove().end()
        )
          .text()
          .trim();

        // Handle ID
        const itemDefId = $header.find("a").text().trim().slice(1); // remove #
        item.itemdefid = itemDefId;

        // 2. Description
        const $desc = $el.find("div.economy-item-description");
        if ($desc.length > 0) {
          item.description = $desc.text().trim();
        }

        // 3. Properties Table & Web Assets (Tags)
        let currentCategory = null;

        $el.find(".table tr").each((j, tr) => {
          const $tr = $(tr);

          // Check for category separator (e.g. Tags)
          if ($tr.hasClass("web-assets-hr")) {
            currentCategory = $tr
              .find("td:first-child")
              .text()
              .slice(0, -1)
              .trim(); // remove colon
            // Convert to snake_case for consistency
            currentCategory = currentCategory
              .toLowerCase()
              .replace(/\s+/g, "_");
          }

          if (currentCategory !== null) {
            // Collect tags in this category
            const tags = [];
            $tr.find("td").each((k, td) => {
              tags.push($(td).text().trim());
            });
            item[currentCategory] = tags.join(";");
          } else {
            // Standard Key-Value pair
            let key = $tr
              .find("td:first-child")
              .text()
              .trim()
              .replace(/:$/, "");
            let val = $tr.find("td:last-child").text().trim();

            // Normalization
            key = key.toLowerCase().replace(/\s+/g, "_"); // Name Color -> name_color

            // Boolean string normalization
            if (val.toLowerCase() === "yes") val = "true";
            if (val.toLowerCase() === "no") val = "false";

            item[key] = val;
          }

          if ($tr.hasClass("web-assets-bottom")) {
            currentCategory = null;
          }
        });

        // 4. Extract Images & Colors manually if not in table
        const $img = $el.find("img.economy-item-image");
        if ($img.length && !item.icon_url) {
          item.icon_url = $img.attr("src");
          item.icon_url_large = item.icon_url;
        }

        // CSS Colors
        const style = $header.attr("style") || "";
        const colorMatch = style.match(/color:\s*#([a-fA-F0-9]{6})/);
        if (colorMatch && !item.name_color) {
          item.name_color = colorMatch[1];
        }

        list.push(item);
      });
      return list;
    },
  };

  // =================================================================
  // 5. GENERATORS MODULE
  // =================================================================
  const Generators = {
    // --- ACHIEVEMENTS ---
    tenoke_ach: {
      type: "ach",
      name: "Tenoke (.ini)",
      supportsIcons: true,
      render: (data) => {
        let out = "";
        data.forEach((ach) => {
          out += `[ACHIEVEMENTS.${ach.apiName}]\n`;
          if (ach.iconBase) out += `icon = "${ach.iconBase}"\n`;
          if (ach.iconGrayBase) out += `icon_gray = "${ach.iconGrayBase}"\n`;
          if (ach.hidden) out += `hidden = "1"\n`;
          out += `\n[ACHIEVEMENTS.${ach.apiName}.name]\nenglish = "${ach.displayName}"\n\n`;
          out += `[ACHIEVEMENTS.${ach.apiName}.desc]\nenglish = "${ach.description}"\n\n`;
        });
        return out.trim();
      },
      getFileName: (ach, type) =>
        type === "main" ? ach.iconBase : ach.iconGrayBase,
    },

    json_ach: {
      type: "ach",
      name: "Goldberg / JSON (.json)",
      supportsIcons: true,
      render: (data) => {
        const achievements = data.map((ach) => ({
          hidden: ach.hidden ? 1 : 0,
          displayName: { english: ach.displayName },
          description: { english: ach.description },
          icon_gray: ach.iconGrayBase ? `img/${ach.iconGrayBase}` : "",
          icon: ach.iconBase ? `img/${ach.iconBase}` : "",
          name: ach.apiName,
        }));
        return JSON.stringify(achievements, null, 2);
      },
      getFileName: (ach, type) =>
        type === "main" ? ach.iconBase : ach.iconGrayBase,
    },

    // --- ITEMS ---
    goldberg_items: {
      type: "items",
      name: "Goldberg Items (.json)",
      filename: "items.json",
      render: (data) => {
        if (!data || !data.length) return "{}";
        const map = {};
        data.forEach((item) => {
          map[item.itemdefid] = item;
        });
        return JSON.stringify(map, null, 4);
      },
    },

    // --- DLC ---
    tenoke_dlc: {
      type: "dlc",
      name: "Tenoke (.ini)",
      filename: "tenoke.ini",
      render: (data) => {
        if (!data.length) return "";
        let out = "[DLC]\n";
        data.forEach((d) => (out += `${d.id} = "${d.name}"\n`));
        return out;
      },
    },
    goldberg_dlc: {
      type: "dlc",
      name: "Goldberg (.ini)",
      filename: "configs.app.ini",
      render: (data) => {
        let out = "[app::dlcs]\nunlock_all=0\n";
        if (data.length > 0) {
          data.forEach((d) => (out += `${d.id}=${d.name}\n`));
        }
        return out;
      },
    },
    rune_dlc: {
      type: "dlc",
      name: "RUNE (.ini)",
      filename: "steam_emu.ini",
      render: (data) => {
        let out =
          "[DLC]\n###\n### Automatically unlock all DLCs\n###\nDLCUnlockall=0\n###\n### Identifiers for DLCs\n###\n#ID=Name\n";
        data.forEach((d) => (out += `${d.id}=${d.name}\n`));
        return out;
      },
    },
    cream_dlc: {
      type: "dlc",
      name: "CreamAPI (.ini)",
      filename: "cream_api.ini",
      render: (data, context) => {
        const appId = context && context.appId ? context.appId : "0";
        let out = `[steam]
; Application ID (http://store.steampowered.com/app/%appid%/)
appid=${appId}
; Current game language.
; Uncomment this option to turn it on.
; Default is "english".
;language=german
; Enable/disable automatic DLC unlock. Default option is set to "false".
; Keep in mind that this option  WON'T work properly if the "[dlc]" section is NOT empty
unlockall=false
; Original Valve's steam_api.dll.
; Default is "steam_api_o.dll".
orgapi=steam_api_o.dll
; Original Valve's steam_api64.dll.
; Default is "steam_api64_o.dll".
orgapi64=steam_api64_o.dll
; Enable/disable extra protection bypasser.
; Default is "false".
extraprotection=false
; Add the specific files to hide from detection.
; Use comma (,) to separate the files. "cream_api.ini" is hidden by default.
;filestohide=steam_appid.txt,steam_emu.ini
; The game will think that you're offline (supported by some games).
; Default is "false".
forceoffline=false
; Some games are checking for the low violence presence.
; Default is "false".
;lowviolence=true
; Purchase timestamp for the DLC (http://www.onlineconversion.com/unix_time.htm).
; Default is "0" (1970/01/01).
;purchasetimestamp=0

[steam_misc]
; Disables the internal SteamUser interface handler.
; Does have an effect on the games that are using the license check for the DLC/application.
; Default is "false".
disableuserinterface=false

[dlc]
; DLC handling.
; Format: <dlc_id> = <dlc_description>
; e.g. : 247295 = Saints Row IV - GAT V Pack
; If the DLC is not specified in this section
; then it won't be unlocked
`;
        if (data.length > 0) {
          data.forEach((d) => {
            out += `${d.id}=${d.name}\n`;
          });
        }
        return out;
      },
    },
    smoke_dlc: {
      type: "dlc",
      name: "SmokeAPI (.json)",
      filename: "SmokeAPI.config.json",
      render: (data, context) => {
        const appId = context && context.appId ? context.appId : "0";
        // Map inventory items to simple integer IDs for SmokeAPI array
        const inv =
          context && context.inventory
            ? context.inventory
                .map((i) => parseInt(i.itemdefid, 10))
                .filter((n) => !isNaN(n))
            : [];

        const dlcList = {};
        data.forEach((d) => {
          dlcList[d.id] = d.name;
        });

        const config = {
          $schema:
            "https://raw.githubusercontent.com/acidicoala/SmokeAPI/refs/tags/v4.0.0/res/SmokeAPI.schema.json",
          $version: 4,
          logging: false,
          log_steam_http: false,
          default_app_status: "unlocked",
          override_app_status: {
            [appId]: "unlocked",
          },
          override_dlc_status: {},
          auto_inject_inventory: true,
          extra_inventory_items: inv,
          extra_dlcs: {
            [appId]: {
              dlcs: dlcList,
            },
          },
        };
        return JSON.stringify(config, null, 2);
      },
    },

    // --- FULL PACKAGES ---
    tenoke_ini: {
      type: "ini",
      name: "Tenoke Full Config",
      supportsIcons: true,
      render: (appInfo, dlcs, achs) => {
        let ini = `[TENOKE]\nid = ${appInfo.appId} # ${appInfo.gameName}\nuser = "TENOKE"\naccount = 0x1234\nuniverse = 1\naccount_type = 1\nlanguage = "english"\ncountry = "UK"\noverlay = false\n\n`;
        if (dlcs.length) ini += Generators.tenoke_dlc.render(dlcs) + "\n\n";
        if (achs.length) ini += Generators.tenoke_ach.render(achs);
        return ini.trim();
      },
    },
    goldberg_zip: {
      type: "ini",
      name: "Goldberg Full Package",
      supportsIcons: true,
      render: (appInfo, dlcs, achs, items) => {
        const ac = achs.length;
        const dc = dlcs.length;
        const ic = items ? items.length : 0;
        let out = `[Goldberg Configuration Package]\n\nClicking 'Download' will generate a ZIP containing:\n\n1. steam_settings/steam_appid.txt\n2. steam_settings/achievements.json (${ac} items)\n3. steam_settings/configs.app.ini (${dc} DLCs)\n`;
        let counter = 4;
        if (ic > 0) {
          out += `${counter++}. steam_settings/items.json (${ic} items)\n`;
        }
        out += `${counter}. steam_settings/img/ (${
          ac * 2
        } images)\n\nNote: This saves time by organizing the folder structure automatically.`;
        return out;
      },
    },
    rune_ini: {
      type: "ini",
      name: "RUNE Full Config",
      filename: "steam_emu.ini",
      supportsIcons: false,
      render: (appInfo, dlcs, achs) => {
        const id = appInfo.appId;
        let out = RUNE_ASCII + "\n\n";
        out += `###\n###\n### Game data is stored at %SystemDrive%\\Users\\Public\\Documents\\Steam\\RUNE\\${id}\n###\n\n`;
        out += `[Settings]\n###\n### Game identifier (http://store.steampowered.com/app/${id})\n###\nAppId=${id}\n`;
        out += `###\n### Steam Account ID, set it to 0 to get a random Account ID\n###\n#AccountId=0\n`;
        out += `### \n### Name of the current player\n###\nUserName=RUNE\n`;
        out += `###\n### Language that will be used in the game\n###\nLanguage=english\n`;
        out += `###\n### Enable lobby mode\n###\nLobbyEnabled=1\n`;
        out += `###\n### Lobby port to listen on\n###\n#LobbyPort=31183\n`;
        out += `###\n### Enable/Disable Steam overlay\n###\nOverlays=1\n`;
        out += `###\n### Set Steam connection to offline mode\n###\nOffline=0\n`;
        out += `###\nLegacyCallbacks=1\n###\n\n`;
        out += `[Interfaces]\n###\n### Steam Client API interface versions\n###\n###\n\n`;
        out += `[DLC]\n###\n### Automatically unlock all DLCs\n###\nDLCUnlockall=0\n`;
        out += `###\n### Identifiers for DLCs\n###\n#ID=Name\n`;
        if (dlcs.length) dlcs.forEach((d) => (out += `${d.id}=${d.name}\n`));
        out += `###\n\n[Crack]\n`;
        return out;
      },
    },
  };

  // =================================================================
  // 6. PACKAGER (DOWNLOAD & ZIP)
  // =================================================================
  const Packager = {
    state: { active: false, stop: false, paused: false, resumeResolver: null },

    toggleControls(tabPrefix, isDownloading) {
      const p = CONFIG.PREFIX;
      const setupId = `${p}-${tabPrefix}-controls-setup`;
      const progressId = `${p}-${tabPrefix}-controls-progress`;

      const $setup = $(`#${setupId}`);
      const $progress = $(`#${progressId}`);

      if (isDownloading) {
        $setup.removeClass(`${p}-visible`).addClass(`${p}-hidden`);
        $progress.removeClass(`${p}-hidden`).addClass(`${p}-visible`);
      } else {
        $progress.removeClass(`${p}-visible`).addClass(`${p}-hidden`);
        $setup.removeClass(`${p}-hidden`).addClass(`${p}-visible`);
      }
    },

    cancel() {
      if (this.state.active) {
        this.state.stop = true;
        if (this.state.resumeResolver) {
          this.state.resumeResolver();
        }
      }
    },

    togglePause(btnSelector) {
      if (this.state.paused) {
        this.state.paused = false;
        if (this.state.resumeResolver) {
          this.state.resumeResolver();
          this.state.resumeResolver = null;
        }
        $(btnSelector)
          .text("Pause")
          .removeClass("resume-mode")
          .addClass("pause-mode");
      } else {
        this.state.paused = true;
        $(btnSelector)
          .text("Resume")
          .removeClass("pause-mode")
          .addClass("resume-mode");
      }
    },

    async fetchImagesWithProgress(achs, tabPrefix) {
      const p = CONFIG.PREFIX;
      this.state = {
        active: true,
        stop: false,
        paused: false,
        resumeResolver: null,
      };

      // UI: Switch to Progress
      this.toggleControls(tabPrefix, true);

      const tasks = [];
      achs.forEach((ach) => {
        if (ach.iconUrl && ach.iconBase) {
          tasks.push({ url: ach.iconUrl, name: ach.iconBase });
        }
        if (ach.iconGrayUrl && ach.iconGrayBase) {
          tasks.push({ url: ach.iconGrayUrl, name: ach.iconGrayBase });
        }
      });

      const total = tasks.length;
      let completed = 0;
      const downloadedData = {};

      const $progressText = $(`#${p}-${tabPrefix}-progress-text`);
      const $progressPercent = $(`#${p}-${tabPrefix}-progress-percent`);
      const $progressFill = $(`#${p}-${tabPrefix}-progress-fill`);

      // Reset State
      $progressFill.css("width", "0%");
      $(`#${p}-btn-${tabPrefix}-pause`)
        .text("Pause")
        .removeClass("resume-mode")
        .addClass("pause-mode");

      const updateProgress = (pct) => {
        if (this.state.stop) return;
        const percent = Math.floor(pct * 100);
        $progressText.text("Downloading...");
        $progressPercent.text(`${percent}%`);
        $progressFill.css("width", `${percent}%`);
      };

      const processTask = async (task) => {
        const buf = await Network.fetchBuffer(task.url);
        if (buf) downloadedData[task.name] = buf;
        completed++;

        if (!this.state.paused && !this.state.stop) {
          updateProgress(completed / total);
        }
      };

      try {
        for (let i = 0; i < tasks.length; ) {
          if (this.state.stop) throw new Error("CANCELLED");

          if (this.state.paused) {
            $progressText.text("Paused");
            await new Promise((res) => (this.state.resumeResolver = res));
            if (this.state.stop) throw new Error("CANCELLED");
          }

          const batch = tasks.slice(i, i + CONFIG.BATCH_SIZE);
          // Pass the pre-defined function
          await Promise.all(batch.map(processTask));

          i += CONFIG.BATCH_SIZE;
        }
      } catch (e) {
        if (e.message === "CANCELLED") {
          $progressText.text("Cancelled");
          setTimeout(() => {
            this.toggleControls(tabPrefix, false);
          }, 800);
          this.state.active = false;
          return null;
        }
      }

      $progressText.text("Creating zip...");
      $progressPercent.text("100%");
      $progressFill.css("width", "100%");

      return downloadedData;
    },

    async downloadTenoke(appInfo, dlcs, achs, withIcons, btnSelector) {
      const tabPrefix = "ini";
      const iniContent = Generators.tenoke_ini.render(appInfo, dlcs, achs);

      if (!withIcons || achs.length === 0) {
        saveAs(
          new Blob([iniContent], { type: "text/plain;charset=utf-8" }),
          "tenoke.ini"
        );
        return;
      }

      const icons = await this.fetchImagesWithProgress(achs, tabPrefix);
      if (!icons) return;

      const zip = {};
      zip["tenoke.ini"] = new TextEncoder().encode(iniContent);

      const innerZipData = {};
      for (const [name, buf] of Object.entries(icons)) {
        innerZipData[name] = buf;
      }

      zip["icons.zip"] = await new Promise((res) =>
        fflate.zip(innerZipData, { level: 0 }, (err, data) => res(data))
      );

      this.finalizeZip(zip, "tenoke_release.zip", tabPrefix);
    },

    async downloadGoldberg(appInfo, dlcs, achs, items, withIcons, btnSelector) {
      const tabPrefix = "ini";
      const icons = await this.fetchImagesWithProgress(achs, tabPrefix);
      if (!icons) return;

      const zip = {};
      zip["steam_settings/steam_appid.txt"] = new TextEncoder().encode(
        appInfo.appId
      );

      if (achs.length > 0) {
        const json = Generators.json_ach.render(achs);
        zip["steam_settings/achievements.json"] = new TextEncoder().encode(
          json
        );
      }
      if (dlcs.length) {
        const ini = Generators.goldberg_dlc.render(dlcs);
        zip["steam_settings/configs.app.ini"] = new TextEncoder().encode(ini);
      }
      if (items && items.length > 0) {
        const itemJson = Generators.goldberg_items.render(items);
        zip["steam_settings/items.json"] = new TextEncoder().encode(itemJson);
      }

      for (const [name, buf] of Object.entries(icons)) {
        zip[`steam_settings/img/${name}`] = buf;
      }

      this.finalizeZip(zip, "steam_settings.zip", tabPrefix);
    },

    async downloadIconsOnly(achs, presetKey) {
      const tabPrefix = "ach";
      const icons = await this.fetchImagesWithProgress(achs, tabPrefix);
      if (!icons) return;

      const preset = Generators[presetKey];
      const zip = {};

      achs.forEach((ach) => {
        if (icons[ach.iconBase]) {
          zip[preset.getFileName(ach, "main")] = icons[ach.iconBase];
        }
        if (icons[ach.iconGrayBase]) {
          zip[preset.getFileName(ach, "gray")] = icons[ach.iconGrayBase];
        }
      });

      this.finalizeZip(zip, "icons.zip", tabPrefix);
    },

    finalizeZip(zipData, filename, tabPrefix) {
      fflate.zip(zipData, { level: 0, mem: 8 }, (err, data) => {
        if (err) {
          alert("Zip error: " + err);
          this.toggleControls(tabPrefix, false);
          this.state.active = false;
          return;
        }

        saveAs(new Blob([data], { type: "application/zip" }), filename);

        // Small delay before switching back to show 100% state
        setTimeout(() => {
          this.toggleControls(tabPrefix, false);
          this.state.active = false;
        }, 500);
      });
    },
  };

  // =================================================================
  // 7. MAIN APP CONTROLLER
  // =================================================================
  const App = {
    appId: null,
    gameName: "Unknown Game",
    achievements: [],
    dlcs: [],
    inventory: [], // NEW
    loader: null,
    uiBuilt: false,
    activeTab: "ach",
    iconState: false,

    init() {
      this.appId = $(".scope-app[data-appid]").attr("data-appid");
      if (!this.appId) return false;

      const nameEl = $('h1[itemprop="name"]');
      if (nameEl.length) this.gameName = nameEl.text().trim();

      this.loader = this.startPreload();
      this.injectButton();
    },

    async startPreload() {
      const [achRes, dlcRes, itemRes] = await Promise.allSettled([
        Network.fetchText(
          `https://steamdb.info/api/RenderAppSection/?section=stats&appid=${this.appId}`
        ),
        Network.fetchText(
          `https://steamdb.info/api/RenderLinkedApps/?appid=${this.appId}`
        ),
        Network.fetchText(
          `https://steamdb.info/api/RenderAppSection/?section=items&appid=${this.appId}`
        ),
      ]);

      if (achRes.status === "fulfilled") {
        this.achievements = Parser.achievements(achRes.value, this.appId);
      }
      if (dlcRes.status === "fulfilled") {
        this.dlcs = Parser.dlcs(dlcRes.value);
      }
      if (itemRes.status === "fulfilled") {
        this.inventory = Parser.items(itemRes.value, this.appId);
      }

      return {
        achCount: this.achievements.length,
        dlcCount: this.dlcs.length,
        invCount: this.inventory.length,
      };
    },

    injectButton() {
      const $btn = $(
        `<div id="${CONFIG.PREFIX}-trigger">SteamDB Data Fork</div>`
      );
      $btn.on("click", () => this.openUI());
      $("body").append($btn);
    },

    openUI() {
      if (!this.uiBuilt) UI.build(this);
      $(`#${CONFIG.PREFIX}-overlay`).addClass("active");
      this.syncUI();
    },

    async syncUI() {
      const $status = $(`#${CONFIG.PREFIX}-status`);

      if (
        this.achievements.length ||
        this.dlcs.length ||
        this.inventory.length
      ) {
        this.refreshAll();
        return;
      }

      $status.text("Waiting for background fetch...");
      $(`.${CONFIG.PREFIX}-textarea`).val("Loading...");

      try {
        const res = await this.loader;
        $status.text("Data loaded successfully.");
        this.refreshAll();
      } catch (e) {
        $status.text("Error!");
        $(`.${CONFIG.PREFIX}-textarea`).val("Error: " + e);
      }
    },

    refreshAll() {
      this.renderTab("ach");
      this.renderTab("dlc");
      this.renderTab("items");
      this.renderTab("ini");
      this.updateFooter();
    },

    updateFooter() {
      const $stats = $(`#${CONFIG.PREFIX}-footer-stats`);
      if (this.activeTab === "ach") {
        const c = this.achievements.length;
        $stats.text(`${c} Achievements (${c * 2} Images)`);
      } else if (this.activeTab === "dlc") {
        $stats.text(`${this.dlcs.length} DLCs Found`);
      } else if (this.activeTab === "items") {
        $stats.text(`${this.inventory.length} Items Found`);
      } else if (this.activeTab === "ini") {
        $stats.text(`Ready to generate full config`);
      }
    },

    renderTab(type) {
      const presetKey = $(`#${CONFIG.PREFIX}-${type}-preset`).val();
      const generator = Generators[presetKey];
      if (!generator) return;

      let out = "";

      if (type === "ach") {
        out = this.achievements.length
          ? generator.render(this.achievements)
          : "No achievements found.";
      } else if (type === "dlc") {
        out = generator.render(this.dlcs, {
          appId: this.appId,
          gameName: this.gameName,
          inventory: this.inventory,
        });
      } else if (type === "items") {
        out = this.inventory.length
          ? generator.render(this.inventory)
          : "No inventory items found.";
      } else if (type === "ini") {
        out = generator.render(
          { appId: this.appId, gameName: this.gameName },
          this.dlcs,
          this.achievements,
          this.inventory
        );
      }

      $(`#${CONFIG.PREFIX}-${type}-output`).val(out);
    },
  };

  // =================================================================
  // 8. UI BUILDER
  // =================================================================
  const UI = {
    build(ctx) {
      const p = CONFIG.PREFIX;

      // Helper to generate options
      const getOptions = (type) => {
        return Object.entries(Generators)
          .filter(([key, gen]) => gen.type === type)
          .map(([key, gen]) => `<option value="${key}">${gen.name}</option>`)
          .join("");
      };

      const modal = `
                <div id="${p}-overlay">
                    <div id="${p}-modal">
                        <div class="${p}-header">
                            <h3>SteamDB Data Fork</h3>
                            <span class="${p}-close">&times;</span>
                        </div>
                        <div class="${p}-nav">
                            <div class="${p}-nav-item active" data-tab="ach">Achievements</div>
                            <div class="${p}-nav-item" data-tab="dlc">DLC</div>
                            <div class="${p}-nav-item" data-tab="items">Items</div>
                            <div class="${p}-nav-item" data-tab="ini">Full Config</div>
                        </div>
                        <div class="${p}-body">
                            <!-- Achievements -->
                            <div id="${p}-tab-ach" class="${p}-tab active">
                                <div id="${p}-ach-container" class="${p}-stack-container">
                                    <!-- Setup State -->
                                    <div id="${p}-ach-controls-setup" class="${p}-controls-setup ${p}-visible">
                                        <select id="${p}-ach-preset" class="${p}-select" style="flex:1">
                                            ${getOptions("ach")}
                                        </select>
                                        <button id="${p}-btn-ach-copy" class="${p}-btn ${p}-btn-secondary ${p}-btn-fixed">Copy</button>
                                        <button id="${p}-btn-ach-save" class="${p}-btn ${p}-btn-primary ${p}-btn-fixed">Save</button>
                                        <button id="${p}-btn-img" class="${p}-btn ${p}-btn-secondary">Download Icons</button>
                                    </div>

                                    <!-- Progress State -->
                                    <div id="${p}-ach-controls-progress" class="${p}-controls-progress ${p}-hidden">
                                        <div class="${p}-progress-info">
                                            <span id="${p}-ach-progress-text" class="${p}-progress-text">Starting...</span>
                                            <span id="${p}-ach-progress-percent" class="${p}-progress-percent">0%</span>
                                            <div id="${p}-ach-progress-fill" class="${p}-progress-fill"></div>
                                        </div>
                                        <button id="${p}-btn-ach-pause" class="${p}-btn pause-mode ${p}-btn-fixed">Pause</button>
                                        <button id="${p}-btn-ach-cancel" class="${p}-btn cancel-mode ${p}-btn-fixed">Cancel</button>
                                    </div>
                                </div>
                                <textarea id="${p}-ach-output" class="${p}-textarea" readonly>Loading...</textarea>
                            </div>

                            <!-- DLC -->
                            <div id="${p}-tab-dlc" class="${p}-tab">
                                <div class="${p}-controls">
                                    <select id="${p}-dlc-preset" class="${p}-select">
                                        ${getOptions("dlc")}
                                    </select>
                                    <button id="${p}-btn-dlc-copy" class="${p}-btn ${p}-btn-secondary">Copy</button>
                                    <button id="${p}-btn-dlc-save" class="${p}-btn ${p}-btn-primary">Save</button>
                                </div>
                                <textarea id="${p}-dlc-output" class="${p}-textarea" readonly>Loading...</textarea>
                            </div>

                            <!-- Items (NEW) -->
                            <div id="${p}-tab-items" class="${p}-tab">
                                <div class="${p}-controls">
                                    <select id="${p}-items-preset" class="${p}-select">
                                        ${getOptions("items")}
                                    </select>
                                    <button id="${p}-btn-items-copy" class="${p}-btn ${p}-btn-secondary">Copy</button>
                                    <button id="${p}-btn-items-save" class="${p}-btn ${p}-btn-primary">Save</button>
                                </div>
                                <textarea id="${p}-items-output" class="${p}-textarea" readonly>Loading...</textarea>
                            </div>

                            <!-- Config -->
                            <div id="${p}-tab-ini" class="${p}-tab">
                                <div id="${p}-ini-container" class="${p}-stack-container">
                                    <!-- Setup State -->
                                    <div id="${p}-ini-controls-setup" class="${p}-controls-setup ${p}-visible">
                                        <div class="${p}-input-group">
                                            <select id="${p}-ini-preset" class="${p}-select" style="width:100%">
                                                ${getOptions("ini")}
                                            </select>
                                            <label class="${p}-checkbox-label" id="${p}-ini-icons-label">
                                                <input type="checkbox" id="${p}-ini-include-icons" class="${p}-checkbox">
                                                Include Icons
                                            </label>
                                        </div>
                                        <button id="${p}-btn-ini-copy" class="${p}-btn ${p}-btn-secondary ${p}-btn-fixed">Copy</button>
                                        <button id="${p}-btn-ini-save" class="${p}-btn ${p}-btn-primary ${p}-btn-fixed">Download</button>
                                    </div>

                                    <!-- Progress State -->
                                    <div id="${p}-ini-controls-progress" class="${p}-controls-progress ${p}-hidden">
                                        <div class="${p}-progress-info">
                                            <span id="${p}-ini-progress-text" class="${p}-progress-text">Starting...</span>
                                            <span id="${p}-ini-progress-percent" class="${p}-progress-percent">0%</span>
                                            <div id="${p}-ini-progress-fill" class="${p}-progress-fill"></div>
                                        </div>
                                        <button id="${p}-btn-ini-pause" class="${p}-btn pause-mode ${p}-btn-fixed">Pause</button>
                                        <button id="${p}-btn-ini-cancel" class="${p}-btn cancel-mode ${p}-btn-fixed">Cancel</button>
                                    </div>
                                </div>
                                <textarea id="${p}-ini-output" class="${p}-textarea" readonly>Loading...</textarea>
                            </div>

                            <!-- Footer -->
                            <div class="${p}-footer">
                                <div id="${p}-footer-stats"></div>
                                <div id="${p}-status">Ready</div>
                            </div>
                        </div>
                    </div>
                </div>`;
      $("body").append(modal);
      this.bindEvents(ctx);
      ctx.uiBuilt = true;
    },

    bindEvents(ctx) {
      const p = CONFIG.PREFIX;

      // Close (Auto-Cancel Logic)
      const closeModal = () => {
        $(`#${p}-overlay`).removeClass("active");
        Packager.cancel();
      };

      $(`.${p}-close, #${p}-overlay`).on("click", (e) => {
        if (e.target === e.currentTarget) closeModal();
      });
      $(document).on("keydown", (e) => {
        if (e.key === "Escape" && $(`#${p}-overlay`).hasClass("active")) {
          closeModal();
        }
      });

      // Tabs
      $(`.${p}-nav-item`).on("click", (e) => {
        const tab = $(e.currentTarget).data("tab");
        ctx.activeTab = tab;
        $(`.${p}-nav-item`).removeClass("active");
        $(e.currentTarget).addClass("active");
        $(`.${p}-tab`).removeClass("active");
        $(`#${p}-tab-${tab}`).addClass("active");
        ctx.updateFooter();
      });

      // Icons Checkbox Toggle
      $(`#${p}-ini-include-icons`).on("change", function () {
        ctx.iconState = $(this).is(":checked");
      });

      // Presets Change
      $(`select[id^="${p}-"]`).on("change", (e) => {
        const key = $(e.currentTarget).val();
        if (e.currentTarget.id === `${p}-ini-preset`) {
          const gen = Generators[key];
          const $cb = $(`#${p}-ini-include-icons`);
          const $lbl = $(`#${p}-ini-icons-label`);

          if (gen && gen.supportsIcons === false) {
            $cb.prop("checked", false).prop("disabled", true);
            $lbl.addClass("disabled");
          } else {
            $cb.prop("disabled", false).prop("checked", ctx.iconState);
            $lbl.removeClass("disabled");
          }
        }
        ctx.refreshAll();
      });

      // Copy Buttons
      $(`button[id*="-copy"]`).on("click", (e) => {
        const target = $(e.currentTarget)
          .attr("id")
          .replace("-btn-", "-")
          .replace("-copy", "-output");
        GM_setClipboard($(`#${target}`).val());
        const old = $(e.currentTarget).text();
        $(e.currentTarget).text("Copied!");
        setTimeout(() => $(e.currentTarget).text(old), 1000);
      });

      // Standalone Save Buttons
      $(`#${p}-btn-ach-save`).on("click", () => {
        const key = $(`#${p}-ach-preset`).val();
        const fname = key.includes("tenoke")
          ? "tenoke_achievements.ini"
          : "achievements.json";
        saveAs(
          new Blob([$(`#${p}-ach-output`).val()], {
            type: "text/plain;charset=utf-8",
          }),
          fname
        );
      });

      $(`#${p}-btn-dlc-save`).on("click", () => {
        const key = $(`#${p}-dlc-preset`).val();
        const fname = Generators[key].filename || "dlc_list.ini";
        saveAs(
          new Blob([$(`#${p}-dlc-output`).val()], {
            type: "text/plain;charset=utf-8",
          }),
          fname
        );
      });

      $(`#${p}-btn-items-save`).on("click", () => {
        const key = $(`#${p}-items-preset`).val();
        const fname = Generators[key].filename || "items.json";
        saveAs(
          new Blob([$(`#${p}-items-output`).val()], {
            type: "text/plain;charset=utf-8",
          }),
          fname
        );
      });

      $(`#${p}-btn-img`).on("click", () => {
        const key = $(`#${p}-ach-preset`).val();
        Packager.downloadIconsOnly(ctx.achievements, key);
      });

      $(`#${p}-btn-ini-save`).on("click", () => {
        const key = $(`#${p}-ini-preset`).val();
        const withIcons = $(`#${p}-ini-include-icons`).is(":checked");
        const btnId = `#${p}-btn-ini-save`;

        if (key === "goldberg_zip") {
          Packager.downloadGoldberg(
            { appId: ctx.appId },
            ctx.dlcs,
            ctx.achievements,
            ctx.inventory,
            withIcons,
            btnId
          );
        } else if (key === "tenoke_ini") {
          Packager.downloadTenoke(
            { appId: ctx.appId, gameName: ctx.gameName },
            ctx.dlcs,
            ctx.achievements,
            withIcons,
            btnId
          );
        } else if (key === "rune_ini") {
          const content = $(`#${p}-ini-output`).val();
          saveAs(
            new Blob([content], { type: "text/plain;charset=utf-8" }),
            Generators.rune_ini.filename
          );
        }
      });

      // Global Pause/Cancel Handlers
      $(`#${p}-btn-ach-pause, #${p}-btn-ini-pause`).on("click", function (e) {
        Packager.togglePause(this);
      });

      $(`#${p}-btn-ach-cancel, #${p}-btn-ini-cancel`).on("click", function () {
        Packager.cancel();
      });
    },
  };

  $(document).ready(() => App.init());
})(jQuery);
