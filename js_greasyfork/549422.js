// ==UserScript==
// @name         FF Scouter V2
// @namespace    Violentmonkey Scripts
// @match        https://www.torn.com/*
// @version      2.41
// @license      MIT
// @author       rDacted, Weav3r
// @description  Shows the expected Fair Fight score against targets and faction war status
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @connect      ffscouter.com
// @downloadURL https://update.greasyfork.org/scripts/549422/FF%20Scouter%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/549422/FF%20Scouter%20V2.meta.js
// ==/UserScript==

const FF_VERSION = 2.4;
const API_INTERVAL = 30000;
const memberCountdowns = {};
let apiCallInProgressCount = 0;

let singleton = document.getElementById('ff-scouter-run-once');
if (!singleton) {
    console.log(`FF Scouter version ${FF_VERSION} starting`);
    GM_addStyle(`
        .ff-scouter-indicator {
        position: relative;
        display: block;
        padding: 0;
        }

        .ff-scouter-vertical-line-low-upper,
        .ff-scouter-vertical-line-low-lower,
        .ff-scouter-vertical-line-high-upper,
        .ff-scouter-vertical-line-high-lower {
        content: '';
        position: absolute;
        width: 2px;
        height: 30%;
        background-color: black;
        margin-left: -1px;
        }

        .ff-scouter-vertical-line-low-upper {
        top: 0;
        left: calc(var(--arrow-width) / 2 + 33 * (100% - var(--arrow-width)) / 100);
        }

        .ff-scouter-vertical-line-low-lower {
        bottom: 0;
        left: calc(var(--arrow-width) / 2 + 33 * (100% - var(--arrow-width)) / 100);
        }

        .ff-scouter-vertical-line-high-upper {
        top: 0;
        left: calc(var(--arrow-width) / 2 + 66 * (100% - var(--arrow-width)) / 100);
    }

        .ff-scouter-vertical-line-high-lower {
        bottom: 0;
        left: calc(var(--arrow-width) / 2 + 66 * (100% - var(--arrow-width)) / 100);
        }

        .ff-scouter-arrow {
        position: absolute;
        transform: translate(-50%, -50%);
        padding: 0;
        top: 0;
        left: calc(var(--arrow-width) / 2 + var(--band-percent) * (100% - var(--arrow-width)) / 100);
        width: var(--arrow-width);
        object-fit: cover;
        pointer-events: none;
        }

        .last-action-row {
            font-size: 11px;
            color: inherit;
            font-style: normal;
            font-weight: normal;
            text-align: center;
            margin-left: 8px;
            margin-bottom: 2px;
            margin-top: -2px;
            display: block;
        }
        .travel-status {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 2px;
            min-width: 0;
            overflow: hidden;
        }
        .torn-symbol {
            width: 16px;
            height: 16px;
            fill: currentColor;
            vertical-align: middle;
            flex-shrink: 0;
        }
        .plane-svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
            vertical-align: middle;
            flex-shrink: 0;
        }
        .plane-svg.returning {
            transform: scaleX(-1);
        }
        .country-abbr {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            min-width: 0;
            flex: 0 1 auto;
            vertical-align: bottom;
        }
    `);

    var BASE_URL = "https://ffscouter.com";
    var BLUE_ARROW = "https://raw.githubusercontent.com/rDacted2/fair_fight_scouter/main/images/blue-arrow.svg";
    var GREEN_ARROW = "https://raw.githubusercontent.com/rDacted2/fair_fight_scouter/main/images/green-arrow.svg";
    var RED_ARROW = "https://raw.githubusercontent.com/rDacted2/fair_fight_scouter/main/images/red-arrow.svg";

    var rD_xmlhttpRequest;
    var rD_setValue;
    var rD_getValue;
    var rD_deleteValue;
    var rD_registerMenuCommand;

    // DO NOT CHANGE THIS
    // DO NOT CHANGE THIS
    var apikey = 'ScAD9PllxM9XsxDD';
    // DO NOT CHANGE THIS
    // DO NOT CHANGE THIS
    if (apikey[0] != '#') {
        console.log("Adding modifications to support TornPDA");
        rD_xmlhttpRequest = function (details) {
            console.log("Attempt to make http request");
            if (details.method.toLowerCase() == "get") {
                return PDA_httpGet(details.url)
                    .then(details.onload)
                    .catch(details.onerror ?? ((e) => console.error(e)));
            }
            else if (details.method.toLowerCase() == "post") {
                return PDA_httpPost(details.url, details.headers ?? {}, details.body ?? details.data ?? "")
                    .then(details.onload)
                    .catch(details.onerror ?? ((e) => console.error(e)));
            }
            else {
                console.log("What is this? " + details.method);
            }
        }
        rD_setValue = function (name, value) {
            console.log("Attempted to set " + name);
            return localStorage.setItem(name, value);
        }
        rD_getValue = function (name, defaultValue) {
            var value = localStorage.getItem(name) ?? defaultValue;
            return value;
        }
        rD_deleteValue = function (name) {
            console.log("Attempted to delete " + name);
            return localStorage.removeItem(name);
        }
        rD_registerMenuCommand = function () {
            console.log("Disabling GM_registerMenuCommand");
        }
        rD_setValue('limited_key', apikey);
    }
    else {
        rD_xmlhttpRequest = GM_xmlhttpRequest;
        rD_setValue = GM_setValue;
        rD_getValue = GM_getValue;
        rD_deleteValue = GM_deleteValue;
        rD_registerMenuCommand = GM_registerMenuCommand;
    }

    var key = rD_getValue("limited_key", null);
    var info_line = null;

    rD_registerMenuCommand('Enter Limited API Key', () => {
        let userInput = prompt("Enter Limited API Key", rD_getValue('limited_key', ""));
        if (userInput !== null) {
            rD_setValue('limited_key', userInput);
            // Reload page
            window.location.reload();
        }
    });

    function create_text_location() {
        info_line = document.createElement('div');
        info_line.id = "ff-scouter-run-once";
        info_line.style.display = 'block';
        info_line.style.clear = 'both';
        info_line.style.margin = '5px 0';
        info_line.addEventListener('click', () => {
            if (key === null) {
                const limited_key = prompt("Enter Limited API Key", rD_getValue('limited_key', ""));
                if (limited_key) {
                    rD_setValue('limited_key', limited_key);
                    key = limited_key;
                    window.location.reload();
                }
            }
        });

        var h4 = $("h4")[0]
        if (h4.textContent === "Attacking") {
            h4.parentNode.parentNode.after(info_line);
        } else {
            const linksTopWrap = h4.parentNode.querySelector('.links-top-wrap');
            if (linksTopWrap) {
                linksTopWrap.parentNode.insertBefore(info_line, linksTopWrap.nextSibling);
            } else {
                h4.after(info_line);
            }
        }

        return info_line;
    }

    function set_message(message, error = false) {
        while (info_line.firstChild) {
            info_line.removeChild(info_line.firstChild);
        }

        const textNode = document.createTextNode(message);
        if (error) {
            info_line.style.color = "red";
        }
        else {
            info_line.style.color = "";
        }
        info_line.appendChild(textNode);
    }

    function update_ff_cache(player_ids, callback) {
        if (!key) {
            return
        }

        player_ids = [...new Set(player_ids)];

        var unknown_player_ids = get_cache_misses(player_ids)

        if (unknown_player_ids.length > 0) {
            console.log(`Refreshing cache for ${unknown_player_ids.length} ids`);

            var player_id_list = unknown_player_ids.join(",")
            const url = `${BASE_URL}/api/v1/get-stats?key=${key}&targets=${player_id_list}`;

            rD_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (response.status == 200) {
                        var ff_response = JSON.parse(response.responseText);
                        if (ff_response && ff_response.error) {
                            showToast(ff_response.error);
                            return;
                        }
                            var one_hour = 60 * 60 * 1000;
                            var expiry = Date.now() + one_hour;
                        ff_response.forEach(result => {
                            if (result && result.player_id) {
                                // If all values are null, store a no_data flag
                                if (
                                    result.fair_fight === null &&
                                    result.bs_estimate === null &&
                                    result.bs_estimate_human === null &&
                                    result.last_updated === null
                                ) {
                                    let cacheObj = {
                                        no_data: true,
                                        expiry: expiry
                                    };
                                    rD_setValue("" + result.player_id, JSON.stringify(cacheObj));
                                } else {
                                    let cacheObj = {
                                        value: result.fair_fight,
                                        last_updated: result.last_updated,
                                        expiry: expiry,
                                        bs_estimate: result.bs_estimate,
                                        bs_estimate_human: result.bs_estimate_human
                                    };
                                    rD_setValue("" + result.player_id, JSON.stringify(cacheObj));
                                }
                                }
                            });
                            callback(player_ids);
                    }
                    else {
                        try {
                            var err = JSON.parse(response.responseText);
                            if (err && err.error) {
                                showToast(err.error);
                        } else {
                                showToast('API request failed.');
                            }
                        } catch {
                            showToast('API request failed.');
                        }
                    }
                },
                onerror: function (e) { console.error('**** error ', e); },
                onabort: function (e) { console.error('**** abort ', e); },
                ontimeout: function (e) { console.error('**** timeout ', e); }
            });
        } else {
            callback(player_ids);
        }
    }

    function get_fair_fight_response(target_id) {
        var cached_ff_response = rD_getValue("" + target_id, null);
        try {
            cached_ff_response = JSON.parse(cached_ff_response);
        }
        catch {
            cached_ff_response = null;
        }

        if (cached_ff_response) {
            if (cached_ff_response.expiry > Date.now()) {
                return cached_ff_response;
            }
        }
    }

    function display_fair_fight(target_id, player_id) {
        const response = get_fair_fight_response(target_id);
        if (response) {
            set_fair_fight(response, player_id);
        }
    }

    function get_ff_string(ff_response) {
        const ff = ff_response.value.toFixed(2);

        const now = Date.now() / 1000;
        const age = now - ff_response.last_updated;

        var suffix = ""
        if (age > (14 * 24 * 60 * 60)) {
            suffix = "?"
        }

        return `${ff}${suffix}`;
    }

    function get_difficulty_text(ff) {
        if (ff <= 1) {
            return "Extremely easy";
        } else if (ff <= 2) {
            return "Easy";
        } else if (ff <= 3.5) {
            return "Moderately difficult";
        } else if (ff <= 4.5) {
            return "Difficult";
        } else {
            return "May be impossible";
        }
    }

    function get_detailed_message(ff_response, player_id) {
        if (ff_response.no_data) {
            // Show 'No data' if the API returned all nulls
            return `<span style=\"font-weight: bold; margin-right: 6px;\">FairFight:</span><span style=\"background: #444; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px; display: inline-block;\">No data</span>`;
        }
        const ff_string = get_ff_string(ff_response)
        const difficulty = get_difficulty_text(ff_response.value);

        const now = Date.now() / 1000;
        const age = now - ff_response.last_updated;

        var fresh = "";

        if (age < 24 * 60 * 60) {
            // Pass
        }
        else if (age < 31 * 24 * 60 * 60) {
            var days = Math.round(age / (24 * 60 * 60));
            if (days == 1) {
                fresh = "(1 day old)";
            }
            else {
                fresh = `(${days} days old)`;
            }
        }
        else if (age < 365 * 24 * 60 * 60) {
            var months = Math.round(age / (31 * 24 * 60 * 60));
            if (months == 1) {
                fresh = "(1 month old)";
            }
            else {
                fresh = `(${months} months old)`;
            }
        }
        else {
            var years = Math.round(age / (365 * 24 * 60 * 60));
            if (years == 1) {
                fresh = "(1 year old)";
            }
            else {
                fresh = `(${years} years old)`;
            }
        }

        const background_colour = get_ff_colour(ff_response.value);
        const text_colour = get_contrast_color(background_colour);

        let statDetails = '';
        if (ff_response.bs_estimate_human) {
            statDetails = `<span style=\"font-size: 11px; font-weight: normal; margin-left: 8px; vertical-align: middle; color: #cccccc; font-style: italic;\">Est. Stats: <span>${ff_response.bs_estimate_human}</span></span>`;
        }

        return `<span style=\"font-weight: bold; margin-right: 6px;\">FairFight:</span><span style=\"background: ${background_colour}; color: ${text_colour}; font-weight: bold; padding: 2px 6px; border-radius: 4px; display: inline-block;\">${ff_string} (${difficulty}) ${fresh}</span>${statDetails}`;
    }

    function get_ff_string_short(ff_response, player_id) {
        const ff = ff_response.value.toFixed(2);

        const now = Date.now() / 1000;
        const age = now - ff_response.last_updated;

        if (ff > 9) {
            return `high`;
        }

        var suffix = ""
        if (age > (14 * 24 * 60 * 60)) {
            suffix = "?";
        }

        return `${ff}${suffix}`;
    }

    function set_fair_fight(ff_response, player_id) {
        const detailed_message = get_detailed_message(ff_response, player_id);
        info_line.innerHTML = detailed_message;
    }

    function get_members() {
        var player_ids = [];
        $(".table-body > .table-row").each(function () {
            if (!$(this).find(".fallen").length) {
                if (!$(this).find(".fedded").length) {
                    $(this).find(".member").each(function (index, value) {
                        var url = value.querySelectorAll('a[href^="/profiles"]')[0].href;
                        var player_id = url.match(/.*XID=(?<player_id>\d+)/).groups.player_id;
                        player_ids.push(parseInt(player_id));
                    });
                }
            }
        });

        return player_ids;
    }

    function rgbToHex(r, g, b) {
        return '#' +
            ((1 << 24) + (r << 16) + (g << 8) + b)
                .toString(16)
                .slice(1)
                .toUpperCase(); // Convert to hex and return
    }

    function get_ff_colour(value) {
        let r, g, b;

        // Transition from
        // blue - #2828c6
        // to
        // green - #28c628
        // to
        // red - #c62828
        if (value <= 1) {
            // Blue
            r = 0x28;
            g = 0x28;
            b = 0xc6;
        } else if (value <= 3) {
            // Transition from blue to green
            const t = (value - 1) / 2; // Normalize to range [0, 1]
            r = 0x28;
            g = Math.round(0x28 + ((0xc6 - 0x28) * t));
            b = Math.round(0xc6 - ((0xc6 - 0x28) * t));
        } else if (value <= 5) {
            // Transition from green to red
            const t = (value - 3) / 2; // Normalize to range [0, 1]
            r = Math.round(0x28 + ((0xc6 - 0x28) * t));
            g = Math.round(0xc6 - ((0xc6 - 0x28) * t));
            b = 0x28;
        } else {
            // Red
            r = 0xc6;
            g = 0x28;
            b = 0x28;
        }

        return rgbToHex(r, g, b); // Return hex value
    }

    function get_contrast_color(hex) {
        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        // Calculate brightness
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
        return (brightness > 126) ? 'black' : 'white'; // Return black or white based on brightness
    }

    function apply_fair_fight_info(player_ids) {
        const fair_fights = new Object();

        for (const player_id of player_ids) {
            var cached_ff_response = rD_getValue("" + player_id, null);
            try {
                cached_ff_response = JSON.parse(cached_ff_response);
            }
            catch {
                cached_ff_response = null;
            }

            if (cached_ff_response) {
                if (cached_ff_response.expiry > Date.now()) {
                    fair_fights[player_id] = cached_ff_response;
                }
            }
        }

        var header_li = document.createElement("li");
        header_li.tabIndex = "0";
        header_li.classList.add("table-cell");
        header_li.classList.add("lvl");
        header_li.classList.add("torn-divider");
        header_li.classList.add("divider-vertical");
        header_li.classList.add("c-pointer");
        header_li.appendChild(document.createTextNode("FF"));

        $(".table-header > .lvl")[0].after(header_li);

        $(".table-body > .table-row > .member").each(function (index, value) {
            var url = value.querySelectorAll('a[href^="/profiles"]')[0].href;
            var player_id = url.match(/.*XID=(?<player_id>\d+)/).groups.player_id;

            var fair_fight_div = document.createElement("div");
            fair_fight_div.classList.add("table-cell");
            fair_fight_div.classList.add("lvl");

            // Lookup the fair fight score from cache
            if (fair_fights[player_id]) {
                const ff = fair_fights[player_id].value;
                const ff_string = get_ff_string_short(fair_fights[player_id], player_id)

                const background_colour = get_ff_colour(ff);
                const text_colour = get_contrast_color(background_colour);
                fair_fight_div.style.backgroundColor = background_colour;
                fair_fight_div.style.color = text_colour;
                fair_fight_div.style.fontWeight = 'bold';
                fair_fight_div.innerHTML = ff_string;
            }

            value.nextSibling.after(fair_fight_div);
        });
    }

    function get_cache_misses(player_ids) {
        var unknown_player_ids = []
        for (const player_id of player_ids) {
            var cached_ff_response = rD_getValue("" + player_id, null);
            try {
                cached_ff_response = JSON.parse(cached_ff_response);
            }
            catch {
                cached_ff_response = null;
            }

            if ((!cached_ff_response) ||
                (cached_ff_response.expiry < Date.now()) ||
                (cached_ff_response.age > (7 * 24 * 60 * 60))) {
                unknown_player_ids.push(player_id);
            }
        }

        return unknown_player_ids;
    }

    create_text_location();

    const match1 = window.location.href.match(/https:\/\/www.torn.com\/profiles.php\?XID=(?<target_id>\d+)/);
    const match2 = window.location.href.match(/https:\/\/www.torn.com\/loader.php\?sid=attack&user2ID=(?<target_id>\d+)/);
    const match = match1 ?? match2
    if (match) {
        // We're on a profile page or an attack page - get the fair fight score
        var target_id = match.groups.target_id
        update_ff_cache([target_id], function (target_ids) { display_fair_fight(target_ids[0], target_id) })

        if (!key) {
            set_message("Limited API key needed - click to add");
        }
    }
    else if (window.location.href.startsWith("https://www.torn.com/factions.php")) {
        const torn_observer = new MutationObserver(function () {
            // Find the member table - add a column if it doesn't already have one, for FF scores
            var members_list = $(".members-list")[0];
            if (members_list) {
                torn_observer.disconnect()

                var player_ids = get_members();
                update_ff_cache(player_ids, apply_fair_fight_info)
            }
        });

        torn_observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });

        if (!key) {
            set_message("Limited API key needed - click to add");
        }
    }
    else {
        // console.log("Did not match against " + window.location.href);
    }

    function get_player_id_in_element(element) {
        const match = element.parentElement?.href?.match(/.*XID=(?<target_id>\d+)/);
        if (match) {
            return match.groups.target_id;
        }

        const anchors = element.getElementsByTagName('a');

        for (const anchor of anchors) {
            const match = anchor.href.match(/.*XID=(?<target_id>\d+)/);
            if (match) {
                return match.groups.target_id;
            }
        }

        if (element.nodeName.toLowerCase() === "a") {
            const match = element.href.match(/.*XID=(?<target_id>\d+)/);
            if (match) {
                return match.groups.target_id;
            }
        }

        return null;
    }

    function get_ff(target_id) {
        const response = get_fair_fight_response(target_id);
        if (response) {
            return response.value;
        }

        return null;
    }

    function ff_to_percent(ff) {
        // There are 3 key areas, low, medium, high
        // Low is 1-2
        // Medium is 2-4
        // High is 4+
        // If we clip high at 8 then the math becomes easy
        // The percent is 0-33% 33-66% 66%-100%
        const low_ff = 2;
        const high_ff = 4;
        const low_mid_percent = 33;
        const mid_high_percent = 66;
        ff = Math.min(ff, 8)
        var percent;
        if (ff < low_ff) {
            percent = (ff - 1) / (low_ff - 1) * low_mid_percent;
        } else if (ff < high_ff) {
            percent = (((ff - low_ff) / (high_ff - low_ff)) * (mid_high_percent - low_mid_percent)) + low_mid_percent;
        } else {
            percent = (((ff - high_ff) / (8 - high_ff)) * (100 - mid_high_percent)) + mid_high_percent;
        }

        return percent;
    }

    function show_cached_values(elements) {
        for (const [player_id, element] of elements) {
            element.classList.add('ff-scouter-indicator');
            if (!element.classList.contains('indicator-lines')) {
                element.classList.add('indicator-lines');
                element.style.setProperty("--arrow-width", "20px");

                // Ugly - does removing this break anything?
                element.classList.remove("small");
                element.classList.remove("big");

                //$(element).append($("<div>", { class: "ff-scouter-vertical-line-low-upper" }));
                //$(element).append($("<div>", { class: "ff-scouter-vertical-line-low-lower" }));
                //$(element).append($("<div>", { class: "ff-scouter-vertical-line-high-upper" }));
                //$(element).append($("<div>", { class: "ff-scouter-vertical-line-high-lower" }));
            }

            const ff = get_ff(player_id);
            if (ff) {
                const percent = ff_to_percent(ff);
                element.style.setProperty("--band-percent", percent);

                $(element).find('.ff-scouter-arrow').remove();

                var arrow;
                if (percent < 33) {
                    arrow = BLUE_ARROW;
                } else if (percent < 66) {
                    arrow = GREEN_ARROW;
                } else {
                    arrow = RED_ARROW;
                }
                const img = $('<img>', {
                    src: arrow,
                    class: "ff-scouter-arrow",
                });
                $(element).append(img);
            }
        }
    }

    async function apply_ff_gauge(elements) {
        // Remove elements which already have the class
        elements = elements.filter(e => !e.classList.contains('ff-scouter-indicator'));
        // Convert elements to a list of tuples
        elements = elements.map(e => {
            const player_id = get_player_id_in_element(e);
            return [player_id, e];
        });
        // Remove any elements that don't have an id
        elements = elements.filter(e => e[0]);

        if (elements.length > 0) {
            // Display cached values immediately
            // This is also important to ensure we only iterate the list once
            // Then update
            // Then re-display after the update
            show_cached_values(elements);
            const player_ids = elements.map(e => e[0]);
            update_ff_cache(player_ids, () => { show_cached_values(elements); });
        }
    }

    async function apply_to_mini_profile(mini) {
        // Get the user id, and the details
        // Then in profile-container.description append a new span with the text. Win
        const player_id = get_player_id_in_element(mini);
        if (player_id) {
            const response = get_fair_fight_response(player_id);
            if (response) {
                // Remove any existing elements
                $(mini).find('.ff-scouter-mini-ff').remove();

                // Minimal, text-only Fair Fight string for mini-profiles
                const ff_string = get_ff_string(response);
                const difficulty = get_difficulty_text(response.value);
                const now = Date.now() / 1000;
                const age = now - response.last_updated;
                let fresh = "";
                if (age < 24 * 60 * 60) {
                    // Pass
                } else if (age < 31 * 24 * 60 * 60) {
                    var days = Math.round(age / (24 * 60 * 60));
                    fresh = days === 1 ? "(1 day old)" : `(${days} days old)`;
                } else if (age < 365 * 24 * 60 * 60) {
                    var months = Math.round(age / (31 * 24 * 60 * 60));
                    fresh = months === 1 ? "(1 month old)" : `(${months} months old)`;
                } else {
                    var years = Math.round(age / (365 * 24 * 60 * 60));
                    fresh = years === 1 ? "(1 year old)" : `(${years} years old)`;
                }
                const message = `FF ${ff_string} (${difficulty}) ${fresh}`;

                const description = $(mini).find('.description');
                const desc = $('<span></span>', {
                    class: "ff-scouter-mini-ff",
                });
                desc.text(message);
                $(description).append(desc);
            }
        }
    }

    const ff_gauge_observer = new MutationObserver(async function () {
        var honor_bars = $(".honor-text-wrap").toArray();
        if (honor_bars.length > 0) {
            await apply_ff_gauge($(".honor-text-wrap").toArray());
        } else {
            if (window.location.href.startsWith("https://www.torn.com/factions.php")) {
                await apply_ff_gauge($(".member").toArray());
            } else if (window.location.href.startsWith("https://www.torn.com/companies.php")) {
                await apply_ff_gauge($(".employee").toArray());
            } else if (window.location.href.startsWith("https://www.torn.com/joblist.php")) {
                await apply_ff_gauge($(".employee").toArray());
            } else if (window.location.href.startsWith("https://www.torn.com/messages.php")) {
                await apply_ff_gauge($(".name").toArray());
            } else if (window.location.href.startsWith("https://www.torn.com/index.php")) {
                await apply_ff_gauge($(".name").toArray());
            } else if (window.location.href.startsWith("https://www.torn.com/hospitalview.php")) {
                await apply_ff_gauge($(".name").toArray());
            } else if (window.location.href.startsWith("https://www.torn.com/page.php?sid=UserList")) {
                await apply_ff_gauge($(".name").toArray());
            } else if (window.location.href.startsWith("https://www.torn.com/bounties.php")) {
                await apply_ff_gauge($(".target").toArray());
                await apply_ff_gauge($(".listed").toArray());
            } else if (window.location.href.startsWith("https://www.torn.com/forums.php")) {
                await apply_ff_gauge($(".last-poster").toArray());
                await apply_ff_gauge($(".starter").toArray());
                await apply_ff_gauge($(".last-post").toArray());
                await apply_ff_gauge($(".poster").toArray());
            } else if (window.location.href.includes("page.php?sid=hof")) {
                await apply_ff_gauge($('[class^="userInfoBox__"]').toArray());
            }
        }

        var mini_profiles = $('[class^="profile-mini-_userProfileWrapper_"]').toArray();
        if (mini_profiles.length > 0) {
            for (const mini of mini_profiles) {
                if (!mini.classList.contains('ff-processed')) {
                    mini.classList.add('ff-processed');

                    const player_id = get_player_id_in_element(mini);
                    apply_to_mini_profile(mini);
                    update_ff_cache([player_id], () => { apply_to_mini_profile(mini); });
                }
            }
        }
    });

    ff_gauge_observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });

    function abbreviateCountry(name) {
        if (!name) return '';
        if (name.trim().toLowerCase() === 'switzerland') return 'Switz';
        const words = name.trim().split(/\s+/);
        if (words.length === 1) return words[0];
        return words.map(w => w[0].toUpperCase()).join('');
    }

    function formatTime(ms) {
        let totalSeconds = Math.max(0, Math.floor(ms / 1000));
        let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        let minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        let seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function fetchFactionData(factionID) {
        const url = `https://api.torn.com/v2/faction/${factionID}/members?striptags=true&key=${key}`;
        return fetch(url).then(response => response.json());
    }

    function updateMemberStatus(li, member) {
        if (!member || !member.status) return;

        let statusEl = li.querySelector('.status');
        if (!statusEl) return;

        let lastActionRow = li.querySelector('.last-action-row');
        let lastActionText = member.last_action?.relative || '';
        if (lastActionRow) {
            lastActionRow.textContent = `Last Action: ${lastActionText}`;
        } else {
            lastActionRow = document.createElement('div');
            lastActionRow.className = 'last-action-row';
            lastActionRow.textContent = `Last Action: ${lastActionText}`;
            let lastDiv = Array.from(li.children).reverse().find(el => el.tagName === 'DIV');
            if (lastDiv?.nextSibling) {
                li.insertBefore(lastActionRow, lastDiv.nextSibling);
            } else {
                li.appendChild(lastActionRow);
            }
        }

        // Handle status changes
        if (member.status.state === "Okay") {
            if (statusEl.dataset.originalHtml) {
                statusEl.innerHTML = statusEl.dataset.originalHtml;
                delete statusEl.dataset.originalHtml;
            }
            statusEl.textContent = "Okay";
        } else if (member.status.state === "Traveling") {
            if (!statusEl.dataset.originalHtml) {
                statusEl.dataset.originalHtml = statusEl.innerHTML;
            }

            let description = member.status.description || '';
            let location = '';
            let isReturning = false;

            if (description.includes("Returning to Torn from ")) {
                location = description.replace("Returning to Torn from ", "");
                isReturning = true;
            } else if (description.includes("Traveling to ")) {
                location = description.replace("Traveling to ", "");
            }

            let abbr = abbreviateCountry(location);
            const planeSvg = `<svg class="plane-svg ${isReturning ? 'returning' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"/>
            </svg>`;
            const tornSymbol = `<svg class="torn-symbol" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14" fill="currentColor">T</text>
            </svg>`;
            statusEl.innerHTML = `<span class="travel-status">${tornSymbol}${planeSvg}<span class="country-abbr">${abbr}</span></span>`;
        } else if (member.status.state === "Abroad") {
            if (!statusEl.dataset.originalHtml) {
                statusEl.dataset.originalHtml = statusEl.innerHTML;
            }
            let description = member.status.description || '';
            if (description.startsWith("In ")) {
                let location = description.replace("In ", "");
                let abbr = abbreviateCountry(location);
                statusEl.textContent = `in ${abbr}`;
            }
        }

        // Update countdown
        if (member.status.until && parseInt(member.status.until, 10) > 0) {
            memberCountdowns[member.id] = parseInt(member.status.until, 10);
        } else {
            delete memberCountdowns[member.id];
        }
    }

    function updateFactionStatuses(factionID, container) {
        apiCallInProgressCount++;
        fetchFactionData(factionID)
            .then(data => {
                if (!Array.isArray(data.members)) {
                    console.warn(`No members array for faction ${factionID}`);
                    return;
                }

                const memberMap = {};
                data.members.forEach(member => {
                    memberMap[member.id] = member;
                });

                container.querySelectorAll("li").forEach(li => {
                    let profileLink = li.querySelector('a[href*="profiles.php?XID="]');
                    if (!profileLink) return;
                    let match = profileLink.href.match(/XID=(\d+)/);
                    if (!match) return;
                    let userID = match[1];
                    updateMemberStatus(li, memberMap[userID]);
                });
            })
            .catch(err => {
                console.error("Error fetching faction data for faction", factionID, err);
            })
            .finally(() => {
                apiCallInProgressCount--;
            });
    }

    function updateAllMemberTimers() {
        const liElements = document.querySelectorAll(".enemy-faction .members-list li, .your-faction .members-list li");
        liElements.forEach(li => {
            let profileLink = li.querySelector('a[href*="profiles.php?XID="]');
            if (!profileLink) return;
            let match = profileLink.href.match(/XID=(\d+)/);
            if (!match) return;
            let userID = match[1];
            let statusEl = li.querySelector('.status');
            if (!statusEl) return;
            if (memberCountdowns[userID]) {
                let remaining = (memberCountdowns[userID] * 1000) - Date.now();
                if (remaining < 0) remaining = 0;
                statusEl.textContent = formatTime(remaining);
            }
        });
    }

    function updateAPICalls() {
        let enemyFactionLink = document.querySelector(".opponentFactionName___vhESM");
        let yourFactionLink = document.querySelector(".currentFactionName___eq7n8");
        if (!enemyFactionLink || !yourFactionLink) return;

        let enemyFactionIdMatch = enemyFactionLink.href.match(/ID=(\d+)/);
        let yourFactionIdMatch = yourFactionLink.href.match(/ID=(\d+)/);
        if (!enemyFactionIdMatch || !yourFactionIdMatch) return;

        let enemyList = document.querySelector(".enemy-faction .members-list");
        let yourList = document.querySelector(".your-faction .members-list");
        if (!enemyList || !yourList) return;

        updateFactionStatuses(enemyFactionIdMatch[1], enemyList);
        updateFactionStatuses(yourFactionIdMatch[1], yourList);
    }

    function initWarScript() {
        let enemyFactionLink = document.querySelector(".opponentFactionName___vhESM");
        let yourFactionLink = document.querySelector(".currentFactionName___eq7n8");
        if (!enemyFactionLink || !yourFactionLink) return false;

        let enemyList = document.querySelector(".enemy-faction .members-list");
        let yourList = document.querySelector(".your-faction .members-list");
        if (!enemyList || !yourList) return false;

        updateAPICalls();
        setInterval(updateAPICalls, API_INTERVAL);
        console.log("Torn Faction Status Countdown (Real-Time & API Status - Relative Last): Initialized");
        return true;
    }

    let warObserver = new MutationObserver((mutations, obs) => {
        if (initWarScript()) {
            obs.disconnect();
        }
    });
    warObserver.observe(document.body, { childList: true, subtree: true });

    setInterval(updateAllMemberTimers, 1000);

    function showToast(message) {
        const existing = document.getElementById('ffscouter-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'ffscouter-toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#c62828';
        toast.style.color = '#fff';
        toast.style.padding = '8px 16px';
        toast.style.borderRadius = '8px';
        toast.style.fontSize = '14px';
        toast.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
        toast.style.zIndex = '2147483647';
        toast.style.opacity = '1';
        toast.style.transition = 'opacity 0.5s';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '10px';

        // Close button
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.marginLeft = '8px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.fontSize = '18px';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.onclick = () => toast.remove();

        const msg = document.createElement('span');
        if (message === 'Invalid API key. Please sign up at ffscouter.com to use this service') {
            msg.innerHTML = 'FairFight Scouter: Invalid API key. Please sign up at <a href="https://ffscouter.com" target="_blank" style="color: #fff; text-decoration: underline; font-weight: bold;">ffscouter.com</a> to use this service';
        } else {
            msg.textContent = `FairFight Scouter: ${message}`;
        }

        toast.appendChild(msg);
        toast.appendChild(closeBtn);
        document.body.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 500);
            }
        }, 4000);
    }
}
