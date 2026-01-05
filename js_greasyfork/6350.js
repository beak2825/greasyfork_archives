// ==UserScript==
// @name         SkyGo DE: Larger Player
// @version      0.3
// @description  Adds a button to the german SkyGo website to enlarge the player
// @author       Jannik Zabel
// @include      http://www.skygo.sky.de/*
// @include      https://www.skygo.sky.de/*
// @grant        none
// @namespace https://greasyfork.org/users/6721
// @downloadURL https://update.greasyfork.org/scripts/6350/SkyGo%20DE%3A%20Larger%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/6350/SkyGo%20DE%3A%20Larger%20Player.meta.js
// ==/UserScript==


$( document ).ready(function() {
    $('.detail_player').after('<button type="button" id="larger_player">larger player</button>');
    $("#larger_player").click( function(){
        if ($('.detail_player').length) {
            $('.detail_details').remove();
            $('.detail_actions').remove();
            $('#larger_player').remove();

            var s = "";
            for (i = 0; i < 50; i++) {
                s += "<br />";
            }

            $('#playerContainerId').after(s);
            var checkExist = setInterval(function() {
                // Silverlight Player
                if ($('#PolymediaShowPlayer').length) {
                    $('#PolymediaShowPlayer').width(1280);
                    $('#PolymediaShowPlayer').height(720);
                    clearInterval(checkExist);
                }
                // HTML5 Player
                if ($('#playerContainerId_inner').length) {
                    $("#playerContainerId_inner").width(1280);
                    $("#playerContainerId_inner").height(720);
                    clearInterval(checkExist);
                }
            }, 200); // need to wait for object to exist
        }
    });
});