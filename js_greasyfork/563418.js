// ==UserScript==
// @name         Scorebuzzer Compact Table
// @namespace    http://tampermonkey.net/
// @version      1.5
// @author       JV
// @license      MIT
// @description  Tabulka s odkazy do API a Webu Scorebuzzer AO Junioři
// @match        https://api-backend.scorebuzzer.com/api/tournament/score/*
// @grant        GM_xmlhttpRequest
// @connect      api-backend.scorebuzzer.com
// @downloadURL https://update.greasyfork.org/scripts/563418/Scorebuzzer%20Compact%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/563418/Scorebuzzer%20Compact%20Table.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TOURNAMENT_ID = 466;

  const API_BASE = "https://api-backend.scorebuzzer.com/api/tournament/score/";
  const LIVE_API_BASE = "https://api-backend.scorebuzzer.com/api/match/";
  const LIVE_WEB_BASE = "https://tennisau.scorebuzzer.com/qualifying-australian-open-junior-championships-2026/matches/";

  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function buildApiUrl() {
    return `${API_BASE}${TOURNAMENT_ID}/date/${today()}`;
  }

  function flattenMatches(payload) {
    const rows = [];
    if (!Array.isArray(payload)) return rows;

    payload.forEach(day => {
      (day.info || []).forEach(block => {
        (block.cmatches || []).forEach(m => {
          rows.push({
            team1: m.players.team1,
            team2: m.players.team2,
            matchId: m.matchId
          });
        });
      });
    });

    return rows;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");
  }

  function insertContainer() {
    let container = document.getElementById("sbz-table-container");

    if (!container) {
      container = document.createElement("div");
      container.id = "sbz-table-container";
      container.style.margin = "10px";
      container.style.display = "inline-block";  // hlavní trik – kontejner se smrskne na obsah
      document.body.prepend(container);
    }

    container.innerHTML = "";
    return container;
  }

  function createTable(container, rows) {
    const title = document.createElement("div");
    title.textContent = `Scorebuzzer matches – ${today()}`;
    title.style.cssText = "font-weight:bold; margin-bottom:8px;";
    container.appendChild(title);

    const table = document.createElement("table");

    table.style.cssText = `
      border-collapse: collapse;
      font-size: 14px;
      width: auto;
      max-width: 100%;
    `;

    table.innerHTML = `
      <thead>
        <tr>
          <th style="padding:6px 10px; border-bottom:2px solid #ccc; text-align:left;">Team 1</th>
          <th style="padding:6px 10px; border-bottom:2px solid #ccc; text-align:left;">Team 2</th>
          <th style="padding:6px 10px; border-bottom:2px solid #ccc; text-align:left;">Live API</th>
          <th style="padding:6px 10px; border-bottom:2px solid #ccc; text-align:left;">Live Web</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    rows.forEach(r => {
      const liveApiUrl = `${LIVE_API_BASE}${r.matchId}/1`;
      const liveWebUrl = `${LIVE_WEB_BASE}${r.matchId}`;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding:6px 10px; border-bottom:1px solid #eee; white-space:nowrap;">${escapeHtml(r.team1)}</td>
        <td style="padding:6px 10px; border-bottom:1px solid #eee; white-space:nowrap;">${escapeHtml(r.team2)}</td>
        <td style="padding:6px 10px; border-bottom:1px solid #eee;">
          <a href="${liveApiUrl}" target="_blank">API</a>
        </td>
        <td style="padding:6px 10px; border-bottom:1px solid #eee;">
          <a href="${liveWebUrl}" target="_blank">Web</a>
        </td>
      `;

      tbody.appendChild(tr);
    });

    container.appendChild(table);
  }

  function loadAndRender() {
    GM_xmlhttpRequest({
      method: "GET",
      url: buildApiUrl(),
      headers: {"Accept":"application/json"},
      onload: function(res) {
        try {
          const data = JSON.parse(res.responseText);
          const rows = flattenMatches(data);
          const container = insertContainer();
          createTable(container, rows);
        } catch (e) {
          console.error("Scorebuzzer parse error", e);
        }
      },
      onerror: function() {
        console.error("Scorebuzzer request failed");
      }
    });
  }

  window.addEventListener("load", loadAndRender);

})();