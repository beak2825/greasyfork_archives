// ==UserScript==
// @name         hitbox.tv Theatre Mode
// @namespace    http://gamingtom.com/
// @version      0.0.6
// @description  Expands the video player to give maximum viewing.
// @author       GamingTom
// @match        *://*.hitbox.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9650/hitboxtv%20Theatre%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/9650/hitboxtv%20Theatre%20Mode.meta.js
// ==/UserScript==
$ = window.jQuery;

$(document).ready(function() {

    function init() {

        state = false;

        $("#detail-player").append('<div id="theatre-mode">Theater</div>');
        $("#theatre-mode").css({
            'position': 'absolute',
            'top': '0px',
            'color': 'white',
            'z-index': '100',
            'display': 'none',
            'cursor': 'pointer'
        });

        $("#detail-player").hover(
            function() {
                $("#theatre-mode").css({
                    'position': 'absolute',
                    'top': '0px',
                    'color': 'white',
                    'z-index': '100',
                    'display': 'initial',
                    'cursor': 'pointer'
                });
            },
            function() {
                $("#theatre-mode").css({
                    'position': 'absolute',
                    'top': '0px',
                    'color': 'white',
                    'z-index': '100',
                    'display': 'none',
                    'cursor': 'pointer'
                });
            }
        );

        $("#theatre-mode").click(function() {
            if (state === false) {
                activateTheatre();
                state = true;
            } else {
                deactivateTheatre();
                state = false;
            }
        });

        $(window).resize(function() {
            if (state === true) {
                activateTheatre();
            }
        });


        function activateTheatre() {
            $("#nav").css({
                "display": "none"
            });

            $("#detailpage").css({
                "padding-top": "0px"
            });

            $("#detail-player").css({
                "height": "calc(100vh)",
                "padding": "0px"
            });

            $("#player-transform").css({
                "max-height": "",
                "height": "calc(100vh)"
            });
        };

        function deactivateTheatre() {
            $('#nav').css({
                'display': 'initial'
            });

            $("#detailpage").css({
                "padding-top": "50px"
            });

            $("#detail-player").css({
                "height": "",
                "padding": "0 20px"
            });

            $("#player-transform").css({
                "max-height": "",
                "height": ""
            });



        };

    }


    function test() {

        $("#nav").css({
            "display": "none"
        });

        $("#detailpage").css({
            "padding-top": "0px"
        });

        $("#detail-player").css({
            "height": "calc(100vh)",
            "padding": "0px"
        });

        $("#player-transform").css({
            "max-height": "",
            "height": "calc(100vh)"
        });
    }

    setTimeout(function() {
        init();
    }, 3000);

});