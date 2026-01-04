// ==UserScript==
// @name         FV - Stall Offers Panel
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      11.8
// @description  Adds a custom area in the stalls to offer for items, showing only latest offers per user, with sorting options. Clicking "Sell" opens a trading page to begin the transaction.
// @author       necroam
// @match        https://www.furvilla.com/stalls/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      docs.google.com
// @downloadURL https://update.greasyfork.org/scripts/557033/FV%20-%20Stall%20Offers%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/557033/FV%20-%20Stall%20Offers%20Panel.meta.js
// ==/UserScript==

(function() {

    /* -------------------------------------------------------------
     * CONFIG
     * ------------------------------------------------------------- */

    const GOOGLE_FORM =
        "https://docs.google.com/forms/d/e/1FAIpQLSc21ER6a4oBAEPEcMOtsdlCMjq-UHBZ9NC1dqL7rXxjInHcfw/formResponse";

    const GOOGLE_CSV =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vReqGpldwJJnXb6PTWovUd-rBSOTYhbdwdmsgORWEXbcg2Sn1W-c7tIQ0W8d81rP2KfC2GI2LHu5U-1/pub?gid=1997740764&single=true&output=csv";

    const FIELD_USERNAME = "entry.1931843876";
    const FIELD_ITEM = "entry.1785059351";
    const FIELD_AMOUNT = "entry.159183577";
    const FIELD_PRICE = "entry.1005596548";
    const FIELD_CURRENCY = "entry.235872775";
    const FIELD_DATE = "entry.1488227134";
    const FIELD_USERID = "entry.21699863";

    const EXPIRE_DAYS = 5;
    const isSearchPage = window.location.href === "https://www.furvilla.com/stalls/search";

    /* -------------------------------------------------------------
     * UTILS
     * ------------------------------------------------------------- */

    function getUserName() {
        const a = document.querySelector(".widget-content .user-info h4 a");
        return a ? a.textContent.trim() : null;
    }

    function getUserID() {
        const a = document.querySelector('.user-info a[href*="/profile/"]');
        if (!a) return null;
        const m = a.href.match(/profile\/(\d+)/);
        return m ? m[1] : null;
    }

    function getItemName() {
        const a = document.querySelector("p b a[href*='/museum/item/']");
        return a ? a.textContent.trim() : "Unknown Item";
    }

    function normalizeItem(s) {
        if (!s) return "unknown item";
        return s
            .trim()
            .replace(/\u00A0/g, " ")
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, " ");
    }

    function daysAgo(dateString) {
        const d = new Date(dateString);
        const now = new Date();
        return (now - d) / (1000 * 60 * 60 * 24);
    }

    function latestOffersPerUser(offers) {
    const map = {};
    offers.forEach(o => {
        const key = o.username + "::" + normalizeItem(o.item);

        // Only assign if this is the first offer for the user+item
        // or if this offer is more recent than the one already stored
        if (!map[key] || new Date(o.date) > new Date(map[key].date)) {
            map[key] = o;
        }
    });
    return Object.values(map);
}


    /* -------------------------------------------------------------
     * STYLE
     * ------------------------------------------------------------- */

    GM_addStyle(`
        #fv-offer-panel .form-control { background-color: inherit; color: inherit; border:1px solid rgba(255,255,255,0.5); }
        #fv-tabs .btn { background-color: inherit; color: inherit; }
        #fv-tabs .fv-tab-active { background-color: rgba(255,255,255,0.1) !important; font-weight:bold; }
        #fv-toggle-panel { cursor:pointer; }
    `);

    /* -------------------------------------------------------------
     * BUILD TABS + PANEL
     * ------------------------------------------------------------- */

    function addTab() {
        const ref = document.querySelector(".text-center.margin-1em");
        if (!ref) return;

        const tabs = document.createElement("div");
        tabs.id = "fv-tabs";
        tabs.innerHTML = `
            <div class="btn-group" style="margin-bottom:15px;">
                <button class="btn btn-default btn-sm fv-tab-active" id="fv-tab-shop">Shop</button>
                <button class="btn btn-default btn-sm" id="fv-tab-offers">Offers</button>
            </div>
        `;
        ref.parentNode.insertBefore(tabs, ref.nextSibling);

        createPanel();

        document.getElementById("fv-tab-shop").onclick = () => switchTab("shop");
        document.getElementById("fv-tab-offers").onclick = () => switchTab("offers");
    }

    function createPanel() {
        const itemName = getItemName();
        const panel = document.createElement("div");
        panel.id = "fv-offer-panel";
        panel.style.display = "none";

        panel.innerHTML = `
            <h3>Create an Offer <span id="fv-toggle-panel">[toggle]</span></h3>

            <div id="fv-offer-form">
                <div class="form-group">
                    <label>Item:</label>
                    <input class="form-control" id="fv-offer-item" value="${itemName}" readonly>
                </div>

                <div class="form-group">
                    <label>Amount:</label>
                    <input class="form-control" id="fv-offer-amount" type="number" min="1" value="1" style="width:90px;">
                </div>

                <div class="form-group">
                    <label>Currency:</label><br>
                    <label><input type="radio" name="currency" value="FC" checked> FC</label>
                    <label><input type="radio" name="currency" value="FD"> FD</label>
                </div>

                <div class="form-group">
                    <label>Price (per 1):</label>
                    <input class="form-control" id="fv-offer-price" style="width:150px;">
                </div>

                <button class="btn btn-primary btn-sm" id="fv-offer-submit">Submit Offer</button>
                <p id="fv-offer-msg" style="color:green; display:none; margin-top:5px;"></p>
            </div>

            <h4>Other Offers</h4>
            <div style="margin-bottom:10px;">
                <button class="btn btn-secondary btn-sm" id="fv-sort-price">Sort by Price</button>
                <button class="btn btn-secondary btn-sm" id="fv-sort-amount">Sort by Amount</button>
            </div>

            <table class="table" id="fv-offers-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th class="text-right">Amount</th>
                        <th class="text-right">Price</th>
                        <th>User</th>
                        <th>Currency</th>
                        <th>Expires</th>
                        <th>Action</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody id="fv-offer-tbody"></tbody>
            </table>

            <p id="fv-no-offers" style="text-align:center; display:none;"><i>No offers found.</i></p>
        `;

        document.getElementById("fv-tabs").after(panel);

        document.getElementById("fv-offer-submit").onclick = saveOffer;
        document.getElementById("fv-sort-price").onclick = () => sortOffers("price");
        document.getElementById("fv-sort-amount").onclick = () => sortOffers("amount");

        document.getElementById("fv-toggle-panel").onclick = () => {
            const form = document.getElementById("fv-offer-form");
            form.style.display = form.style.display === "none" ? "block" : "none";
        };
    }

    /* -------------------------------------------------------------
     * TAB SWITCH
     * ------------------------------------------------------------- */

    function switchTab(which) {
        const shopBtn = document.getElementById("fv-tab-shop");
        const offBtn = document.getElementById("fv-tab-offers");
        const panel = document.getElementById("fv-offer-panel");

        if (which === "shop") {
            panel.style.display = "none";
            shopBtn.classList.add("fv-tab-active");
            offBtn.classList.remove("fv-tab-active");
        } else {
            panel.style.display = "block";
            offBtn.classList.add("fv-tab-active");
            shopBtn.classList.remove("fv-tab-active");
            loadAndInsertOffers();
        }
    }

    /* -------------------------------------------------------------
     * SAVE OFFER → Local + Google Form
     * ------------------------------------------------------------- */

    function saveOffer() {
        const username = getUserName();
        const userId = getUserID();
        const item = document.getElementById("fv-offer-item").value.trim();
        const amount = Number(document.getElementById("fv-offer-amount").value);
        const price = document.getElementById("fv-offer-price").value.trim();
        const currency = document.querySelector('input[name="currency"]:checked').value;
        const date = new Date().toISOString();

        if (!price || amount < 1) return alert("Enter valid amount and price.");

        const all = GM_getValue("fv-offers", []);
        all.push({ username, userId, item, amount, price, currency, date });
        GM_setValue("fv-offers", all);

        GM_xmlhttpRequest({
            method: "POST",
            url: GOOGLE_FORM,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data:
                FIELD_USERNAME + "=" + encodeURIComponent(username) +
                "&" + FIELD_USERID + "=" + encodeURIComponent(userId) +
                "&" + FIELD_ITEM + "=" + encodeURIComponent(item) +
                "&" + FIELD_AMOUNT + "=" + encodeURIComponent(amount) +
                "&" + FIELD_PRICE + "=" + encodeURIComponent(price) +
                "&" + FIELD_CURRENCY + "=" + encodeURIComponent(currency) +
                "&" + FIELD_DATE + "=" + encodeURIComponent(date)
        });

        document.getElementById("fv-offer-price").value = "";
        document.getElementById("fv-offer-amount").value = 1;

        const msg = document.getElementById("fv-offer-msg");
        msg.textContent = `Offer for "${item}" submitted!`;
        msg.style.display = "block";
        setTimeout(() => (msg.style.display = "none"), 3000);

        loadAndInsertOffers();
    }

    /* -------------------------------------------------------------
     * LOAD GOOGLE SHEET CSV
     * ------------------------------------------------------------- */

    function loadGoogle(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: GOOGLE_CSV,
            onload(res) {
                const text = res.responseText.trim();
                if (!text) return callback([]);

                const delimiter = text.includes("\t") ? "\t" : ",";
                const rows = text.split("\n").map(r => r.split(delimiter).map(x => x.trim()));
                const headers = rows.shift().map(h => h.toLowerCase().replace(/\s+/g, ""));

                const out = rows.map(r => ({
                    username: r[headers.indexOf("username")] || "Unknown",
                    item: r[headers.indexOf("itemname")] || "Unknown Item",
                    amount: Number(r[headers.indexOf("amount")] || 0),
                    price: r[headers.indexOf("price")] || "",
                    currency: r[headers.indexOf("currency")] || "",
                    date: r[headers.indexOf("date")] || new Date().toISOString(),
                    userId: r[headers.indexOf("userid")] || ""
                }));
                callback(out);
            },
            onerror() { callback([]); }
        });
    }

    /* -------------------------------------------------------------
     * INSERT OFFERS INTO TABLE
     * ------------------------------------------------------------- */

    let lastOffers = [];

    function sortOffers(type) {
    if (!lastOffers.length) return;

    const sorted = [...lastOffers];

    if (type === "price") {
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    else if (type === "amount") {
        sorted.sort((a, b) => a.amount - b.amount);
    }

    const tbody = document.getElementById("fv-offer-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    sorted.forEach(o => addRow(o));
}

    function loadAndInsertOffers() {
        const tbody = document.getElementById("fv-offer-tbody");
        const none = document.getElementById("fv-no-offers");
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Loading…</td></tr>`;
        none.style.display = "none";

        const currentItem = normalizeItem(getItemName());

        loadGoogle(sheet => {
            const local = GM_getValue("fv-offers", []).filter(o => {
                const age = daysAgo(o.date);
                return age <= EXPIRE_DAYS &&
                       (isSearchPage || normalizeItem(o.item) === currentItem);
            });

            const google = sheet.filter(o => {
                const age = daysAgo(o.date);
                return age <= EXPIRE_DAYS &&
                       (isSearchPage || normalizeItem(o.item) === currentItem);
            });

            const combined = [...local, ...google];
            const latest = latestOffersPerUser(combined);

            lastOffers = latest;
            tbody.innerHTML = "";
            if (!latest.length) none.style.display = "block";
            else latest.forEach(o => addRow(o));

            startCountdowns();
        });
    }

    function addRow(o) {
        const tbody = document.getElementById("fv-offer-tbody");
        const me = getUserName();

        const validAmt = o.amount > 0;
        const validPrc = o.price !== "";
        const canSell = o.userId && validAmt && validPrc;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${o.item}</td>
            <td class="text-right">${validAmt ? o.amount : "-"}</td>
            <td class="text-right">${validPrc ? o.price : "-"}</td>
            <td>${o.username}</td>
            <td>${o.currency}</td>
            <td><span class="fv-expire" data-date="${o.date}"></span></td>

            <td>
                <button class="btn btn-success btn-sm fv-sell" ${canSell ? "" : "disabled"}>
                    ${canSell ? "Sell" : "Cannot Sell"}
                </button>
            </td>

            <td class="text-center">
                ${o.username === me && o.userId ? `<button class="btn btn-danger btn-sm fv-remove">X</button>` : ""}
            </td>
        `;
        tbody.appendChild(tr);

        /* SELL BUTTON */
        if (canSell) {
            tr.querySelector(".fv-sell").onclick = () => {
                const win = window.open(`https://www.furvilla.com/trade/new?recipient=${o.userId}`, "_blank");
                const interval = setInterval(() => {
                    if (!win || win.closed) return clearInterval(interval);
                    const input = win.document.querySelector("input#name");
                    if (input) {
                        input.value = `Hello! I'm accepting your ${o.currency} offer for my ${o.amount} ${o.item}.`;
                        clearInterval(interval);
                    }
                }, 200);
            };
        }

    /* REMOVE BUTTON */
const remove = tr.querySelector(".fv-remove");
if (remove) {
    remove.onclick = () => {
        let all = GM_getValue("fv-offers", []);
        all = all.filter(x => !(x.username === me && x.date === o.date));
        GM_setValue("fv-offers", all);
        tr.remove();

        const any = document.querySelectorAll("#fv-offer-tbody tr").length;
        document.getElementById("fv-no-offers").style.display = any ? "none" : "block";
    };
} // end remove button

}



    /* -------------------------------------------------------------
     * COUNTDOWN TIMER
     * ------------------------------------------------------------- */

    function startCountdowns() {
        setInterval(() => {
            const now = new Date();
            document.querySelectorAll(".fv-expire").forEach(span => {
                const d = new Date(span.dataset.date);
                const exp = new Date(d.getTime() + EXPIRE_DAYS * 86400000);

                const diff = exp - now;
                if (diff <= 0) {
                    span.closest("tr")?.remove();
                    return;
                }

                const days = Math.floor(diff / 86400000);
                const hrs = Math.floor((diff % 86400000) / 3600000);
                const mins = Math.floor((diff % 3600000) / 60000);
                const secs = Math.floor((diff % 60000) / 1000);

                span.textContent = `${days}d ${hrs}h ${mins}m ${secs}s`;
            });
        }, 1000);
    }

    /* -------------------------------------------------------------
     * INIT
     * ------------------------------------------------------------- */
    addTab();

})();
