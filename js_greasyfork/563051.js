// ==UserScript==
// @name         MAL List Exporter
// @namespace    http://tampermonkey.net/
// @version      2026-01-20
// @description  Export any MyAnimeList.net list you have access to as XML.
// @author       Nutzboie Funnimanne
// @license      AGPL-3.0-only
// @match        https://myanimelist.net/animelist/*
// @match        https://myanimelist.net/mangalist/*
// @homepage     https://github.com/nutzboi/MAL-Exporter
// @icon         https://raw.githubusercontent.com/nutzboi/MAL-Exporter/master/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563051/MAL%20List%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/563051/MAL%20List%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Assumes this script runs in the browser on a MyAnimeList anime/manga list page.
// It will try to fetch "load.json" from the same origin; if not present, it will
// try to reuse an already-loaded `loadjson` variable on the page (if one exists).
// Uses the previously converted jsonToXml function (import/define it above or include inline).
let userid = 0;
let username = window.location.pathname.split("/").pop();
let update_on_import = false
if(username.indexOf("?") != -1){
    username = username.split("?")[0];
}
if(username.indexOf("#") != -1){
    username = username.split("#")[0];
}

let lstype = 0;
const path = window.location.pathname.toLowerCase();
if (path.includes('.net/mangalist/')) lstype = 1;


const btnsvg = "<svg class=\"icon icon-export\" width=\"21px\" height=\"24px\" viewBox=\"0 0 21 24\" version=\"1.1\">"
              +"<g transform=\"translate(0.000000, -253.000000)\">"
              +"<path d=\"M1.229,275.994 C1.454,276.24 1.745,276.353 2.082,276.353 L18.916,276.353 C19.231,276.353 19.522,276.24 19.769,275.994 C19.994,275.769 20.106,275.477 20.106,275.141 L20.106,261.92 L13.305,261.92 C12.968,261.92 12.676,261.808 12.452,261.561 C12.205,261.337 12.093,261.045 12.093,260.708 L12.093,253.907 L2.082,253.907 C1.745,253.907 1.454,254.019 1.229,254.244 C0.982,254.491 0.87,254.783 0.87,255.097 L0.87,275.141 C0.87,275.477 0.982,275.769 1.229,275.994 L1.229,275.994 Z M19.612,260.326 C19.5,260.124 19.365,259.99 19.253,259.855 L14.158,254.76 C14.023,254.648 13.888,254.513 13.686,254.401 L13.686,260.326 L19.612,260.326 L19.612,260.326 Z\" id=\"icon_menu_side_export\" sketch:type=\"MSShapeGroup\"></path>"
              +"</g></svg>";
const btntitle = "\n<span class=\"text\">Export</span>";

(async function() {

    function buildMyInfo(loadjson, lstype, lstypestr) {
        // lstype: 0 = anime, 1 = manga (matching earlier code)
        // uses global userid, username
        const st = {
            1: lstype ? "reading" : "watching",
            2: "completed",
            3: "onhold",
            4: "dropped",
            6: lstype ? "plantoread" : "plantowatch"
        };

        // stats indices 0..6 (keep 7 elements like original)
        const stats = new Array(7).fill(0);

        for (const entry of loadjson) {
            const statKey = dic[lstype].j.stat;
            const idx = Number(entry[statKey]) || 0;
            if (idx >= 0 && idx < stats.length) stats[idx] += 1;
        }

        const info = {
            user_id: userid,
            user_name: username,
            user_export_type: lstype + 1,
            ["user_total_" + lstypestr]: loadjson.length
        };

        for (const iStr of Object.keys(st)) {
            const i = Number(iStr);
            info["user_total_" + st[i]] = stats[i] || 0;
        }

        return info;
    }

    // getData returns a Promise resolving to loadjson array, or rejects/returns null on failure.
    // listType defaults to "anime".
    async function getData(user, listType = "anime") {
        // global userid will be set if extraction succeeds
        try {
            // Fetch profile page to extract user id
            const profileResp = await fetch(`https://myanimelist.net/profile/${encodeURIComponent(user)}`, { credentials: "omit" });
            if (!profileResp.ok) {
                console.error(`${profileResp.status} User does not exist.`);
                return null;
            }
            const profileText = await profileResp.text();

            // Attempt to locate the id fragment used in the Python version
            const needle = "https://myanimelist.net/modules.php?go=report&amp;type=profile&amp;id=";
            let uid = null;
            const startPos = profileText.indexOf(needle);
            if (startPos !== -1) {
                const idStart = startPos + needle.length;
                let idEnd = profileText.indexOf('"', idStart);
                if (idEnd === -1) idEnd = profileText.length;
                const idStr = profileText.slice(idStart, idEnd).replace(/[^0-9]/g, "");
                if (idStr) {
                    uid = parseInt(idStr, 10);
                    userid = uid; // set global
                } else {
                    console.warn("Warning: Failed to extract user id.");
                }
            } else {
                console.warn("Warning: Failed to extract user id.");
            }

            // Fetch initial load.json
            const baseUrl = `https://myanimelist.net/${listType}list/${encodeURIComponent(user)}/load.json`;
            let resp = await fetch(baseUrl, { credentials: "include" });
            if (!resp.ok) {
                console.error(`User's ${listType} list is not public.`);
                return null;
            }
            let loadjson = await resp.json();
            // If empty or not array, treat as failure
            if (!Array.isArray(loadjson)) loadjson = Array.isArray(loadjson.list) ? loadjson.list : [];

            // Fetch additional pages (offsets of 300) until no more results
            let offset = 300;
            while (true) {
                const pagedUrl = `${baseUrl}?offset=${offset}`;
                const r = await fetch(pagedUrl, { credentials: "omit" });
                if (!r.ok) break;
                const nextJson = await r.json();
                if (!nextJson || (Array.isArray(nextJson) && nextJson.length === 0)) break;
                // If server returns object with .list, prefer that
                const chunk = Array.isArray(nextJson) ? nextJson : (Array.isArray(nextJson.list) ? nextJson.list : []);
                if (chunk.length === 0) break;
                loadjson = loadjson.concat(chunk);
                offset += 300;
            }

            return loadjson;
        } catch (err) {
            console.error("getData error:", err);
            return null;
        }
    }

  /* // Try fetch from relative path "load.json"
  async function fetchLoadJson() {
    try {
      const resp = await fetch(window.location.href+'/load.json', { credentials: 'same-origin' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      if (Array.isArray(data)) return data;
      // if the JSON wraps the array in a property, try common keys
      if (data && Array.isArray(data.list)) return data.list;
      return null;
    } catch (e) {
      return null;
    }
  } */


  // jsonToXml function (concise inline version). If you already have a module, remove this block.
  const dic = [
    { x: { id:"series_animedb_id", title:"series_title", type:"series_type", seps:"series_episodes",
           weps:"my_watched_episodes", sdate:"my_start_date", fdate:"my_finish_date", score:"my_score",
           store:"my_storage", storev:"my_storage_value", stat:"my_status", notes:"my_comments",
           pri:"my_priority", tags:"my_tags", rew:"my_rewatching", updimp: "update_on_import" },
      j: { id:"anime_id", title:"anime_title", type:"anime_media_type_string", seps:"anime_num_episodes",
           weps:"num_watched_episodes", sdate:"start_date_string", fdate:"finish_date_string",
           score:"score", store:"storage_string", stat:"status", notes:"editable_notes", pri:"priority_string",
           tags:"tags", rew:"is_rewatching" } },
    { x: { id:"manga_mangadb_id", title:"manga_title", mvol:"manga_volumes", mch:"manga_chapters",
           rvol:"my_read_volumes", rch:"my_read_chapters", sdate:"my_start_date", fdate:"my_finish_date",
           score:"my_score", ret:"my_retail_volumes", stat:"my_status", notes:"my_comments",
           tags:"my_tags", pri:"my_priority", rew:"my_rereading", updimp: "update_on_import" },
      j: { id:"id", title:"manga_title", mvol:"manga_num_volumes", mch:"manga_num_chapters",
           rvol:"num_read_volumes", rch:"num_read_chapters", sdate:"start_date_string",
           fdate:"finish_date_string", score:"score", ret:"retail_string", stat:"status",
           notes:"editable_notes", tags:"tags", pri:"priority_string", rew:"is_rereading" } }
  ];

  function CD(s) {
    if (s === null || s === undefined) s = "";
    s = String(s);
    return "<![CDATA[" + s.replace(/\]\]>/g, "]]]]><![CDATA[>") + "]]>";
  }

  function formatDateToYMD(dateStr) {
    if (!dateStr) return "0000-00-00";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "0000-00-00";
    const yyyy = d.getFullYear().toString().padStart(4,"0");
    const mm = (d.getMonth()+1).toString().padStart(2,"0");
    const dd = d.getDate().toString().padStart(2,"0");
    return `${yyyy}-${mm}-${dd}`;
  }
  
  function parseStore(s) {
    let store = {"store": "", "storev": "0.00"};
    const storedic = {
        "RDVD": "Retail DVD",
        "EHD": "External HD",
        "VHS": "VHS",
        "": "",
        "HD":"Hard Drive",
        "NAS": "NAS",
        "DVD": "DVD / CD"
    };
    if (s) {
        s = s.split(" ");
        store["store"] = storedic[s[0]];
        store["storev"] = s[1]+"0";
    }
    return store;
  }

  function jsonToXml(loadjsonArr = []) {
    let lstype = 0, lstypestr = "anime";
    if (loadjsonArr.length > 0 && Object.prototype.hasOwnProperty.call(loadjsonArr[0], "manga_id")) {
      lstype = 1; lstypestr = "manga";
    }
    const newlist = [];
    for (const jsonentry of loadjsonArr) {
      newlist.push({[lstypestr]: {}});
      for (const prop in dic[lstype].j) {
        let obj = {};
        const jsonKey = dic[lstype].j[prop];
        let propval = jsonentry[jsonKey];
        if (prop === "title" || prop === "notes" || prop === "tags")
          obj = {[prop]: CD(propval)};
        else if (prop === "pri")
          obj = {[prop]: String(propval).toUpperCase()};
        else if (prop.includes("date"))
          obj = {[prop]: formatDateToYMD(propval)};
        else if (prop == "store")
          obj = parseStore(propval);
        else
          obj = {[prop]: propval}

        Object.assign(newlist[newlist.length - 1][lstypestr], obj);
      }
      newlist[newlist.length - 1][[lstypestr]].updimp = String(Number(update_on_import));
    }

    let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n\t\t<myanimelist>\n\t\t\n';

    xml+= "\t\t\t<myinfo>\n";
    let myinfo = buildMyInfo(loadjsonArr, lstype, lstypestr);
    for (const prop of Object.keys(myinfo)) {
      xml += `\t\t\t\t<${prop}>${myinfo[prop]}</${prop}>\n`;
    }
    xml+= "\t\t\t</myinfo>\n\t\t\n\t\t\n"

    for (const entry of newlist) {
      xml += `\t\t\t\t<${lstypestr}>\n`;
      for (const prop in entry[lstypestr]) {
        const propval = entry[lstypestr][prop] == null ? "" : entry[lstypestr][prop];
        const tagName = dic[lstype].x[prop] || prop;
        xml += `\t\t\t\t\t<${tagName}>${propval}</${tagName}>\n`;
      }
      xml += `\t\t\t\t</${lstypestr}>\n\t\t\t\n`;
    }
    xml += "\n\t\t</myanimelist>\n";
    return xml;
  }

  async function run(){
      let loadjson = await getData(username,(lstype?"manga":"anime"));
      if (!Array.isArray(loadjson)) {
          console.error('Could not load load.json and no page variable found.');
          return;
      }
      update_on_import = confirm("Enable update_on_import?");
      // Convert and either download the XML or log it to console
      const xmlOutput = jsonToXml(loadjson);
      // Create a download link and click it to save as load.xml
      const blob = new Blob([xmlOutput], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = username+'.load.xml';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      console.log('Converted load.json to load.xml and triggered download.');
  }

// Requires jQuery to be loaded on the page.
// Adds an "Export" button (with class "export") either inside .list-menu-float
// or at the top-right of the page if that container doesn't exist.
// When clicked, it calls runExport() — replace or implement that function as needed.

(function($){
  const btnel = $('<img/>', {
      alt: 'Export',
      css: { width: '16px', height: '16px', verticalAlign: 'middle' }
    });
  // Define the export button element
  function createExportButton() {
    return $('<a/>', {
      class: 'icon-menu export',
      title: 'Export list',
      href: '#',
      text: "Export"
    }).html(btnsvg+btntitle);
  }

  // The function the button should run
  function runExport(e) {
    e.preventDefault();
    // Replace this with the real export action
    console.log('Export button clicked');
    run(); // UNCOMMENT LINE UNCOMMENT LINE UNCOMMENT LINE UNCOMMENT LINE UNCOMMENT LINE UNCOMMENT LINE UNCOMMENT LINE
    // Example: call jsonToXml/loadjson handling or open a modal
    /*if (typeof window.runExportAction === 'function') {
      window.runExportAction();
    }*/
    return;
  }

  $(function(){
    var pathname = window.location.pathname || '';

    var $menu = $('.list-menu-float').first();
    var $existing = $menu.length ? $menu.find('.export').first() : $();

    if ($menu.length && $existing.length === 0) {
      // Insert button into .list-menu-float
      var $btn = createExportButton();
      $btn.on('click', runExport);
        // Insert under element with class "history" if present, otherwise append to menu
        var $history = $menu.find('.history').first();
        if ($history.length) {
            $history.after($btn);
        } else {
            $menu.append($btn);
        }
    } else if (!$menu.length) {
      // No .list-menu-float: add button to top-right of page.
      // Attempt to place in a header-like container; fallback to body.
      var $container = $('#content .header-right, .layout-main .header, header').first();
      if ($container.length === 0) $container = $('body');

      var $btn2 = createExportButton();
      var $lmf = $('<div/>', {
          class: 'list-menu-float'
      }).append($btn2);
      $btn2.css({
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 9999
      });
      $btn2.on('click', runExport);
      $container.append($lmf);
    }
  });
})(jQuery);

})();

})();
