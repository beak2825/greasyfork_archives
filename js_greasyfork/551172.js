// ==UserScript==
// @name         Španělská házená Tabulka s LIVE URL (verze 1.2)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Přepsání tabulky na resultadosbalonmano.isquad.es
// @author       LM
// @license      MIT
// @match        https://resultadosbalonmano.isquad.es/competicion.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551172/%C5%A0pan%C4%9Blsk%C3%A1%20h%C3%A1zen%C3%A1%20Tabulka%20s%20LIVE%20URL%20%28verze%2012%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551172/%C5%A0pan%C4%9Blsk%C3%A1%20h%C3%A1zen%C3%A1%20Tabulka%20s%20LIVE%20URL%20%28verze%2012%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const oldTable = document.querySelector('table.table.table-striped');
    if (!oldTable) return;

    // Najdeme hlavičku
    const oldHead = oldTable.querySelector('thead tr');
    const newHead = document.createElement('tr');

    // Přidáme EQUIPOS
    const equiposTh = Array.from(oldHead.children).find(th => th.textContent.trim() === "EQUIPOS");
    if (equiposTh) newHead.appendChild(equiposTh.cloneNode(true));

    // Přidáme nový sloupec LIVE URL
    const liveTh = document.createElement('th');
    liveTh.textContent = "LIVE URL";
    liveTh.style.fontWeight = "bold";
    liveTh.style.textAlign = "center";
    newHead.appendChild(liveTh);

    // Přidáme MARCADOR, FECHA, ESTADO
    ["MARCADOR", "FECHA", "ESTADO"].forEach(colName => {
        const th = Array.from(oldHead.children).find(th => th.textContent.trim() === colName);
        if (th) newHead.appendChild(th.cloneNode(true));
    });

    // Vytvoříme novou tabulku
    const newTable = document.createElement('table');
    newTable.className = oldTable.className;
    const thead = document.createElement('thead');
    thead.appendChild(newHead);
    newTable.appendChild(thead);

    const newBody = document.createElement('tbody');

    // Projdeme řádky
    oldTable.querySelectorAll('tbody tr.partido').forEach(tr => {
        const newRow = document.createElement('tr');
        newRow.className = tr.className;
        newRow.setAttribute('data-id', tr.getAttribute('data-id'));
        newRow.setAttribute('data-estado', tr.getAttribute('data-estado'));

        // EQUIPOS
        const indexEquipos = Array.from(oldHead.children).findIndex(th => th.textContent.trim() === "EQUIPOS");
        if (indexEquipos !== -1) {
            const oldCell = tr.children[indexEquipos];
            if (oldCell) newRow.appendChild(oldCell.cloneNode(true));
        }

        // LIVE URL
        const id = tr.getAttribute('data-id');
        const liveTd = document.createElement('td');
        liveTd.style.textAlign = "center";
        const a = document.createElement('a');
        a.href = `https://resultadosbalonmano.isquad.es/acta.php?id_partido=${id}`;
        a.textContent = "LIVE URL";
        a.style.fontWeight = "bold";
        a.style.fontSize = "14px";
        a.style.textDecoration = "underline";
        a.target = "_blank";
        liveTd.appendChild(a);
        newRow.appendChild(liveTd);

        // MARCADOR, FECHA, ESTADO
        ["MARCADOR", "FECHA", "ESTADO"].forEach(colName => {
            const index = Array.from(oldHead.children).findIndex(th => th.textContent.trim() === colName);
            if (index !== -1) {
                const oldCell = tr.children[index];
                if (oldCell) newRow.appendChild(oldCell.cloneNode(true));
            }
        });

        newBody.appendChild(newRow);
    });

    newTable.appendChild(newBody);

    // Původní tabulku nahradíme
    oldTable.parentNode.replaceChild(newTable, oldTable);

})();