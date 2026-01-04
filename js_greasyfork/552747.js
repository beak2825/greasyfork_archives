// ==UserScript==
// @name         FMP Bids Filiter
// @version      0.1
// @description  以Rating为选择进行筛选
// @match        https://footballmanagerproject.com/Transfers/TeamBids
// @match        https://www.footballmanagerproject.com/Transfers/TeamBids
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/552747/FMP%20Bids%20Filiter.user.js
// @updateURL https://update.greasyfork.org/scripts/552747/FMP%20Bids%20Filiter.meta.js
// ==/UserScript==

const div = document.getElementById("shortList");
const button = document.createElement("button");
button.className = 'btn btn-primary w-200';
button.textContent = "筛选";
button.addEventListener("click", () => only_show(15));
div.parentNode.insertBefore(button,div);

function only_show(rating_limit){
    const table = document.getElementById("shortList");
    const rows = table.querySelectorAll('tr[id^="tr"]')

    rows.forEach(row => {
        const ratingSpan = row.querySelector('td.left span.rating');
        const ratingText = ratingSpan?.getAttribute('title');
        const rating = parseInt(ratingText.match(/\d+/)?.[0] || "0"); // 默认 0

        if (rating < rating_limit) {
            row.style.display = 'none'; // 隐藏该 tr
        }
    });
}