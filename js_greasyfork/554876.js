// ==UserScript==
// @name         FMP NT Club Seacher
// @version      0.1
// @description  Search player in club
// @match        https://footballmanagerproject.com/Team/Players?id=*
// @match        https://www.footballmanagerproject.com/Team/Players?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/554876/FMP%20NT%20Club%20Seacher.user.js
// @updateURL https://update.greasyfork.org/scripts/554876/FMP%20NT%20Club%20Seacher.meta.js
// ==/UserScript==

const div = document.getElementById("head_info");
const button = document.createElement("button");
button.className = 'btn btn-primary w-200';
button.textContent = "筛选";
button.addEventListener("click", () => only_show('cn',14));
div.parentElement.appendChild(button);

function only_show(nation_code,rating_limit){
    const urlParams = new URLSearchParams(window.location.search);
    const club_id = urlParams.get('id');
    const gkTable = document.getElementById("gkList"+club_id);
    const gkTabletr = gkTable.getElementsByTagName("tr");
    display_limit(gkTabletr,nation_code,rating_limit);
    const plTable = document.getElementById("plList"+club_id);
    const plTabletr = plTable.getElementsByTagName("tr");
    display_limit(plTabletr,nation_code,rating_limit);
}

function display_limit(tabletr, nation_code, rating_limit) {
    for (let i = 1; i < tabletr.length; i++) {
        const row = tabletr[i];
        const Td2 = row.cells[2];

        if (!Td2) continue;

        const img = Td2.querySelector("img");
        if (!img) continue;

        const county_png = img.src.split("/")[5];
        const county = county_png.split(".")[0];

        if (county !== nation_code) {
            row.style.display = "none";
            continue;
        }

        const Td7 = row.cells[7];
        const span = Td7.querySelector("span");

        if (!span) {
            row.style.display = "none";
            continue;
        }

        const rating = parseInt(span.title);
        if (rating < rating_limit) {
            row.style.display = "none";
        }
    }
}

