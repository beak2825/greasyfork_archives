// ==UserScript==
// @name         TS FF BS
// @namespace    TSFFBS
// @version      2026-01-05
// @description  TSFFBS
// @author       _syntaxera_
// @match        *tornstats.com/wars/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tornstats.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555207/TS%20FF%20BS.user.js
// @updateURL https://update.greasyfork.org/scripts/555207/TS%20FF%20BS.meta.js
// ==/UserScript==

var key = "";

(function() {
    'use strict';
    let members = document.querySelectorAll('#faction_a_table > tbody > tr, #faction_b_table > tbody > tr')
    let player_ids = []
    for (let i = 0; i < members.length; i++) {
        if (members[i].children[3].innerHTML == "Unknown") {
            player_ids = [...player_ids,
                members[i].getElementsByClassName('text-nowrap')[0].children[0].id.split(/([0-9]+)/)[1]]
        }
    }
    ff(player_ids, members)
})();

function ff(player_ids, members) {
    if (!key) {
        return
    }

    var player_id_list = player_ids.join(",")
    const url = `https://ffscouter.com/api/v1/get-stats?key=${key}&targets=${player_id_list}`;


    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            if (response.status == 200) {
                var result = JSON.parse(response.responseText);
                if (result && result.error) {
                    return;
                }
            }
            var new_player_list = {}
            for (let i in player_ids) {
                let id = result[i].player_id
                new_player_list = {
                    ...new_player_list,
                    [id]: result[i].bs_estimate
                }
            }
            update_values(members, new_player_list)
        },
    });
}

function update_values(members, ffdata) {
    for (let i = 0; i < members.length; i++) {
        if (members[i].children[3].innerHTML == "Unknown") {
            let id = members[i].getElementsByClassName('text-nowrap')[0].children[0].id.split(/([0-9]+)/)[1]
            let bs = ffdata[id].toLocaleString()
            members[i].children[3].style.color = "red"
            members[i].children[3].innerHTML = bs+"*"
        }
    }
}