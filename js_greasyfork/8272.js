// ==UserScript==
// @name            The West - Player Checker
// @description		With this script you can easy check status of players
// @author          neversleep1911
// @namespace       https://greasyfork.org/users/8637
// @include         http://*.the-west.*/game.php*
// @include         https://*.the-west.*/game.php*
// @version         2.0.2
// @grant           none
// @copyright       Copyright (c) 2015 neversleep1911
// @license         MIT (http://opensource.org/licenses/MIT)
// @downloadURL https://update.greasyfork.org/scripts/8272/The%20West%20-%20Player%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/8272/The%20West%20-%20Player%20Checker.meta.js
// ==/UserScript==

(function(func) {
    var script;
    script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.textContent = "(" + func.toString() + ")();";
    document.body.appendChild(script);
    document.body.removeChild(script);
    return true;
})(function() {
    $(document).ready(function() {
        var I18n = function() {
            var DEFAULT_LANGUAGE, STRINGS, language;
            function I18n() {}
            DEFAULT_LANGUAGE = "en_US";
            STRINGS = {
                de_DE: {
                    buttons: {
                        check: "Prüfen",
                        save: "Speichern",
                    },
                    messages: {
                        empty_players: 'Spielernamen eingeben',
                        players_saved: 'Liste gespeichert!'
                    },
                    status: {
                        checking: 'Lädt...',
                        player_not_found: 'Spieler nicht gefunden',
                        homeless_player: 'Stadtlos',
                        player_not_sleeping: 'Schäft nicht'
                    }
                },
                en_US: {
                    buttons: {
                        check: "Check",
                        save: "Save",
                    },
                    messages: {
                        empty_players: 'Enter a list of players',
                        players_saved: 'Player list successfully saved!'
                    },
                    status: {
                        checking: 'Checking...',
                        player_not_found: 'Player not found',
                        homeless_player: 'Homeless player',
                        player_not_sleeping: 'Not sleeping'
                    }
                },
                ru_RU: {
                    buttons: {
                        check: "Проверить",
                        save: "Сохранить",
                    },
                    messages: {
                        empty_players: 'Введите список игроков с новой строки',
                        players_saved: 'Список игроков сохранён!'
                    },
                    status: {
                        checking: 'Проверка...',
                        player_not_found: 'Игрок не найден',
                        homeless_player: 'Игрок без города',
                        player_not_sleeping: 'Не спит'
                    }
                },
            };
            language = DEFAULT_LANGUAGE;
            I18n.language = function() {
                return language;
            };
            I18n.setLanguage = function(lang) {
                return language = STRINGS[lang] ? lang : DEFAULT_LANGUAGE;
            };
            I18n.tr = function(id) {
                var string;
                string = STRINGS[language];
                $(id.split(".")).each(function(k, v) {
                    return (string = string[v]) !== void 0;
                });
                return string || id;
            };
            return I18n;
        }();
        
        I18n.setLanguage(Game.locale);
        
        var PlayerChecker = {
            PlayerState: {
                Player_NotFound: -1,
                Player_Nomeless: -2
            }
        };
        PlayerChecker.check = function(players, before, after) {
            var result = [], ranking = [], currentPlayer = 0, saloonCache = [], nextPlayer, checkPlayer, nextSaloon, checkSaloon;
            nextPlayer = function() {
                if (++currentPlayer < players.length) checkPlayer(); else {
                    currentPlayer = 0;
                    checkSaloon();
                }
            };
            checkPlayer = function() {
                var player = players[currentPlayer].trim();
                Ajax.remoteCallMode("ranking", "get_data", {
                    rank: NaN,
                    search: player,
                    tab: "experience"
                }, function(json) {
                    var found = false;
                    for (var j = 0; j < json.ranking.length; j++) {
                        if (json.ranking[j].name.toLowerCase() == player.toLowerCase()) {
                            ranking.push(json.ranking[j]);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        ranking.push(PlayerChecker.PlayerState.Player_NotFound);
                    }
                    nextPlayer();
                });
            };
            nextSaloon = function() {
                if (++currentPlayer < ranking.length) checkSaloon(); else after(result);
            };
            checkSaloon = function() {
                var player = ranking[currentPlayer];
                if (player == PlayerChecker.PlayerState.Player_NotFound) {
                    result.push(PlayerChecker.PlayerState.Player_NotFound);
                    nextSaloon();
                    return;
                }
                if (player.town_id == null) {
                    result.push(PlayerChecker.PlayerState.Player_Nomeless);
                    nextSaloon();
                    return;
                }
                var findPlayer = function(saloon, id) {
                    for (var i = 0; i < saloon.players.length; i++) {
                        if (saloon.players[i].player_id == id) return saloon.players[i];
                    }
                    return null;
                };
                for (var i = 0; i < saloonCache.length; i++) {
                    if (saloonCache[i].town_id == player.town_id) {
                        player = findPlayer(saloonCache[i].saloon, player.player_id);
                        if (player) result.push(player);
                        nextSaloon();
                        return;
                    }
                }
                Ajax.remoteCallMode("building_saloon", "get_data", {
                    town_id: player.town_id
                }, function(json) {
                    saloonCache.push({
                        town_id: player.town_id,
                        saloon: json
                    });
                    player = findPlayer(json, player.player_id);
                    if (player) result.push(player);
                    nextSaloon();
                });
            };
            before();
            checkPlayer();
        };
        PlayerChecker.showWindow = function() {
            var wnd = wman.open("tw-playerchecker-window", null, "noreload").setTitle("Player Checker").setMiniTitle("Player Checker").addEventListener("WINDOW_DESTROY", function() {});
            
            //var tablePlayers = new west.gui.Table().addColumns(['status', 'duel_level', 'distance']);
            //tablePlayers.setHeight(315).setWidth(450);
            //$(tablePlayers.getMainDiv()).css({position: 'absolute', width: 470, height: 335, left: 220, top: 0});
            
            var txtPlayers = new west.gui.Textarea(undefined);
            txtPlayers.setHeight(315).setWidth(200);
            
            try {
                txtPlayers.textarea.val(localStorage.getItem("players") || Character.name);
            } catch (e) {
                new UserMessage(e, UserMessage.TYPE_ERROR).show();
            }
    
            var txtLog = new west.gui.Textarea(undefined);
            txtLog.setReadonly().setHeight(315).setWidth(450);
            
            $(txtLog.getMainDiv()).css("position", "absolute").css("left", "220px");
            var button = new west.gui.Button(I18n.tr('buttons.check'), function() {
                var text = txtPlayers.textarea.val().trim();
                if (text == "") {
                    new UserMessage(I18n.tr('messages.empty_players'), UserMessage.TYPE_HINT).show();
                    return;
                }
                txtLog.textarea.val(I18n.tr('status.checking'));
                PlayerChecker.check(text.split("\n"), function() { wnd.showLoader(); }, function(players) {
                    var tmp = SaloonWindow.self;
                    if (SaloonWindow.self && SaloonWindow.self.confAfterDeath === undefined) {
                        SaloonWindow.self.confAfterDeath = 48;
                    }
                    text = "";
                    for (var i = 0; i < players.length; i++) {
                        var player = players[i];
                        if (player == PlayerChecker.PlayerState.Player_NotFound) {
                            text += I18n.tr('status.player_not_found') + "\n";
                        } else if (player == PlayerChecker.PlayerState.Player_Nomeless) {
                            text += I18n.tr('status.homeless_player') + "\n";
                        } else {
                            text += SaloonWindow.playerStat(player).replace(/(<([^>]+)>)/gi, "");
                            if (!(player.isSleeping || player.isSleepingFort)) {
                                text += " | " + I18n.tr('status.player_not_sleeping');
                            }
                            text += " | " + player.duel_level + " | " + Character.calcWayTo(player.x, player.y).formatDuration() + "\n";
                        }
                    }
    
                    txtLog.textarea.val(text);
                    SaloonWindow.self = tmp;
                    wnd.hideLoader();
                });
            });
            $(button.getMainDiv()).css("position", "absolute").css("left", "0").css("top", "342px");
            var buttonSave = new west.gui.Button(I18n.tr('buttons.save'), function() {
                try {
                    var text = txtPlayers.textarea.val().trim();
                    localStorage.setItem("players", text);
    
                    new UserMessage(I18n.tr('messages.players_saved'), UserMessage.TYPE_SUCCESS).show();
                } catch (e) {
                    new UserMessage(e, UserMessage.TYPE_ERROR).show();
                }
            });
            $(buttonSave.getMainDiv()).css("position", "absolute").css("left", 104).css("top", 342);
            wnd.appendToContentPane(txtPlayers.getMainDiv());
            //wnd.appendToContentPane(tablePlayers.getMainDiv());
            wnd.appendToContentPane(txtLog.getMainDiv());
            wnd.appendToContentPane(button.getMainDiv());
            wnd.appendToContentPane(buttonSave.getMainDiv());
        };
        var menuImage = 'data:image/png;base64,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';
        var menuButton = $("<div class='menulink' title='Player Checker' />");
        menuButton.css("background-image", "url(" + menuImage + ")");
        menuButton.hover(function() {
            $(this).css("background-position", "-25px 0px");
            return true;
        }, function() {
            $(this).css("background-position", "0px 0px");
            return true;
        }).on("click", function() {
            PlayerChecker.showWindow();
            return false;
        });
        $("div#ui_menubar").append($('<div class="ui_menucontainer" />').append(menuButton).append('<div class="menucontainer_bottom" />'));
    });
});