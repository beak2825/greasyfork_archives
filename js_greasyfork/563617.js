// ==UserScript==
// @name         Biathlon Live Table
// @namespace    https://kvido.local/biathlon
// @version      1.0
// @description  Render live biathlon data into HTML table
// @match        https://biathlon.live/api/race?id=*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/563617/Biathlon%20Live%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/563617/Biathlon%20Live%20Table.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const REFRESH_INTERVAL = 30000;
  const TABLE_ID = 'biathlon-live-table';

  const log = (msg) => console.log(`[BiathlonLive] ${msg}`);

  const fetchJsonObject = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Fetch failed (${res.status})`);
    }
    return res.json();
  };

  const validateMatchData = (data) => {
    if (!data || !data.ResultRows) {
      throw new Error('Invalid match data');
    }
    return data;
  };

    const transformData = (matchData) =>
    matchData.ResultRows.map((row) => ({
        id: row.aid,
        data_slug: `Name: ${row.anme}, Position: ${row.rnk}, Status: ${row.t1}, Time: ${row.t2}, Shooting: ${row.sh}`,
    }));



  const ensureTable = () => {
    let table = document.getElementById(TABLE_ID);

    if (!table) {
      table = document.createElement('table');
      table.id = TABLE_ID;
      table.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        border-collapse: collapse;
        font-family: Arial;
        font-size: 12px;
        z-index: 9999;
      `;

      document.body.appendChild(table);
    }

    return table;
  };

    const renderTable = (rows) => {
        const table = ensureTable();

        table.innerHTML = `
    <thead>
      <tr>
        <th>Data Slug</th>
      </tr>
    </thead>
    <tbody>
      ${rows
            .map(
            (r) => `
        <tr id="row-${r.id}" data-id="${r.id}">
          <td>${r.data_slug}</td>
        </tr>`
        )
            .join('')}
    </tbody>
  `;

        table.querySelectorAll('th, td').forEach((cell) => {
            cell.style.border = '1px solid #ccc';
            cell.style.padding = '4px 6px';
            cell.style.textAlign = 'left';
        });
    };


  const update = async () => {
    const data = await fetchJsonObject(location.href);
    const validData = validateMatchData(data);
    const rows = transformData(validData);
    renderTable(rows);
  };

  const start = async () => {
    try {
      await update();
      setInterval(() => {
        update().catch((e) => log(e.message));
      }, REFRESH_INTERVAL);
    } catch (e) {
      log(e.message);
    }
  };

  start();
})();
