// ==UserScript==
// @name         Invitaciones
// @namespace    http://tampermonkey.net/
// @version      2025-10-15
// @description  Cambia el botón "Enviar solicitud" del perfil de una alianza para obtener una invitación
// @author       You
// @match        https://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/552724/Invitaciones.user.js
// @updateURL https://update.greasyfork.org/scripts/552724/Invitaciones.meta.js
// ==/UserScript==

const uw = unsafeWindow ? unsafeWindow : window;
const pId = uw.Game.player_id;
const pName = uw.Game.player_name;
const wId = uw.Game.world_id;


function requestInv(allianceId) {
    const url = 'https://inv.grepo.win/new_inv';

    const playerData = {
        player_id: pId,
        player_name: pName,
        world_id: wId,
        alliance_id: allianceId
    };

    fetch(url, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerData)
    })
}


function changeBtn(allianceId){
    const allyBtns = $('#ally_buttons')[0];

    if (allyBtns){
        let btn = allyBtns.children[0].children[0]

        if (!btn.classList.contains('btn_leave_alliance')){
            btn.children[2].innerText = 'Conseguir invitación';
            btn.classList.remove('disabled');

            btn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                requestInv(allianceId);
                return false;
            }, true);
        }
    }else{
        setTimeout(changeBtn, 50);
    }
}


$(document).ajaxComplete(function (e, xhr, opt) {
    let url = opt.url.split("?");

    if (url[0] == "/game/alliance" && url[1].split(/&/)[1].substr(7) == 'profile') {
        const params = new URLSearchParams(url[1]);
        const jsonStr = params.get('json');
        const data = JSON.parse(decodeURIComponent(jsonStr));
        changeBtn(data.alliance_id);

        $.Observer(GameEvents.town.town_switch).subscribe(['town_switch'], function(e, data) {
            changeBtn(data.alliance_id);
        });
    }
});
