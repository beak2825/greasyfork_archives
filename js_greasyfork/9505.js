// ==UserScript==
// @namespace		https://greasyfork.org/users/8637
// @name        	The West - NERD Portrait
// @author      	neversleep1911
// @description		Displays some useful info on the portrait
// @include     	http://*.the-west.*/game.php*
// @include     	https://*.the-west.*/game.php*
// @grant       	none
// @version     	1.0.2
// @copyright		Copyright (c) 2015 neversleep1911
// @license			MIT (http://opensource.org/licenses/MIT)
// @downloadURL https://update.greasyfork.org/scripts/9505/The%20West%20-%20NERD%20Portrait.user.js
// @updateURL https://update.greasyfork.org/scripts/9505/The%20West%20-%20NERD%20Portrait.meta.js
// ==/UserScript==

(function(func) {
    var script;
    script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.textContent = "(" + func.toString() + ")();";
    document.body.appendChild(script);
    document.body.removeChild(script);
})(function() {
    var Gui, I18n, NerdFormatter, NerdPortrait, Tab;
    I18n = function() {
        function I18n() {}
        var DEFAULT_LANGUAGE, STRINGS, language;
        DEFAULT_LANGUAGE = "en_US";
        STRINGS = {
            en_US: {
                buttons: {
                    save: "Save"
                },
                messages: {
                    text_saved: "Text saved",
                    enter_text: "Enter text!"
                }
            },
            de_DE: {
                buttons: {
                    save: "Speichern"
                },
                messages: {
                    text_saved: "Text gespeichert",
                    enter_text: "Text eingeben!"
                }
            },
            ru_RU: {
                buttons: {
                    save: "Сохранить"
                },
                messages: {
                    text_saved: "Текст сохранён",
                    enter_text: "Введите текст!"
                }
            }
        };
        language = DEFAULT_LANGUAGE;
        I18n.language = function() {
            return language;
        };
        I18n.setLanguage = function(lang) {
            return language = STRINGS[lang] ? lang : DEFAULT_LANGUAGE;
        };
        I18n.tr = function(id) {
            var i, len, prop, properties, string;
            string = STRINGS[language];
            properties = id.split(".");
            for (i = 0, len = properties.length; i < len; i++) {
                prop = properties[i];
                if ((string = string[prop]) === void 0) {
                    break;
                }
            }
            return string || id;
        };
        return I18n;
    }();
    Gui = function() {
        function Gui() {}
        Gui.createButton = function(options) {
            var button;
            if (options == null) {
                options = {};
            }
            if (options.icon) {
                button = new west.gui.Iconbutton(options.icon, options.onclick);
            } else {
                button = new west.gui.Button(options.text, options.onclick);
            }
            if (options.css) {
                $(button.getMainDiv()).css(options.css);
            }
            return button;
        };
        Gui.createTextarea = function(options) {
            var textarea;
            if (options == null) {
                options = {};
            }
            textarea = new west.gui.Textarea(options.content, null);
            if (options.width) {
                textarea.setWidth(options.width);
            }
            if (options.height) {
                textarea.setHeight(options.height);
            }
            if (options.css) {
                $(textarea.getMainDiv()).css(options.css);
            }
            return textarea;
        };
        Gui.createGroup = function(options) {
            var content, group, scrollPane;
            if (options == null) {
                options = {};
            }
            group = new west.gui.Groupframe("", "<div />");
            if (options.css) {
                $(group.getMainDiv()).css(options.css);
            }
            content = $(".tw2gui_groupframe_content_pane div", group.getMainDiv()).first();
            if (options.title) {
                content.append($("<h2>" + options.title + "</h2><hr style='margin-top: 2px; margin-bottom: 4px;' />"));
            }
            if (options.scrollPane) {
                scrollPane = new west.gui.Scrollpane;
                if (options.scrollPane.css) {
                    $(scrollPane.getMainDiv()).css(options.scrollPane.css);
                }
                content.append(scrollPane.getMainDiv());
                group.scrollPane = scrollPane;
                group.appendToScrollContentPane = function(content) {
                    scrollPane.appendContent(content);
                    return group;
                };
            }
            return group;
        };
        return Gui;
    }();
    NerdFormatter = function() {
        function NerdFormatter() {}
        NerdFormatter.keys = [ {
            pattern: /%ch/,
            value: function() {
                return Character.healthRegen;
            }
        }, {
            pattern: /%ce/,
            value: function() {
                return Character.energyRegen;
            }
        }, {
            pattern: /%hp/,
            value: function() {
                return Math.round(Character.health * 100 / Character.maxHealth);
            }
        }, {
            pattern: /%hr/,
            value: function() {
                return Math.round(1 / (Character.healthRegen * Character.maxHealth) * 3600).formatDuration();
            }
        }, {
            pattern: /%ht/,
            value: function() {
                return ((Character.maxHealth - Character.health) / (Character.healthRegen * Character.maxHealth) * 3600).formatDuration();
            }
        }, {
            pattern: /%ep/,
            value: function() {
                return Math.round(Character.energy * 100 / Character.maxEnergy);
            }
        }, {
            pattern: /%er/,
            value: function() {
                return Math.round(1 / (Character.healthRegen * Character.maxEnergy) * 3600).formatDuration();
            }
        }, {
            pattern: /%et/,
            value: function() {
                return ((Character.maxEnergy - Character.energy) / (Character.energyRegen * Character.maxEnergy) * 3600).formatDuration();
            }
        }, {
            pattern: /%dl/,
            value: function() {
                return Character.duelLevel;
            }
        }, {
            pattern: /%dm/,
            value: function() {
                return Math.ceil(5 * Character.duelLevel / 7);
            }
        }, {
            pattern: /%dx/,
            value: function() {
                return Math.ceil(7 * Character.duelLevel / 5);
            }
        } ];
        NerdFormatter.format = function(s) {
            var i, k, len, ref;
            ref = this.keys;
            for (i = 0, len = ref.length; i < len; i++) {
                k = ref[i];
                s = s.replace(k.pattern, k.value());
            }
            return s;
        };
        return NerdFormatter;
    }();
    NerdPortrait = function() {
        function NerdPortrait() {
            if (instance) {
                return instance;
            }
            instance = this;
            EventHandler.listen([ "health", "energy", "wear_changed", "taskqueue-updated", "position_change", "character_level_up" ], function() {
                NerdPortrait.instance().update();
            });
            this.update();
            return;
        }
        var instance;
        NerdPortrait.ID = "tw_nerd_portrait";
        NerdPortrait.NAME = "NERD Portrait";
        NerdPortrait.AUTHOR = "neversleep1911";
        NerdPortrait.WEB_SITE = "https://greasyfork.org/scripts/9505";
        NerdPortrait.MIN_GAME_VERSION = "2.22";
        NerdPortrait.MAX_GAME_VERSION = Game.version.toString();
        NerdPortrait.LSK_TEXT = "3577cb3d-1fbf-4c37-9b6a-3854a6c4c34d";
        NerdPortrait.DEFAULT_TEXT = '<div style="color: whitesmoke; position: relative; left: 10px; top: 5px; font-size: 75%; font-weight: bold; line-height: 110%;">\n' + "Health: %hp%<br />\n" + "Regen: %ch (%ht)<br />\n" + "1HP / %hr<br /><br />\n\n" + "Energy: %ep%<br />\n" + "Regen: %ce (%et)<br />\n" + "1EP / %er<br /><br />\n\n" + "Duel Level: %dl (%dm-%dx)" + "</div>";
        instance = null;
        NerdPortrait.instance = function() {
            return instance;
        };
        NerdPortrait.prototype.update = function() {
            if (!this.content) {
                $("div.character_link").append(this.content = $("<div />"));
            }
            this.content.html(NerdFormatter.format(this.text()));
        };
        NerdPortrait.prototype.text = function() {
            return this._text || (this._text = localStorage.getItem(NerdPortrait.LSK_TEXT)) || NerdPortrait.DEFAULT_TEXT;
        };
        NerdPortrait.prototype.setText = function(_text) {
            this._text = _text;
            localStorage.setItem(NerdPortrait.LSK_TEXT, this._text);
            this.update();
        };
        return NerdPortrait;
    }();
    Tab = function() {
        function Tab() {
            if (instance) {
                return instance;
            }
            instance = this;
            this.maindiv = $("<div />");
            this.maindiv.append((this.textGroup = Gui.createGroup()).getMainDiv());
            this.maindiv.append((this.actionGroup = Gui.createGroup()).getMainDiv());
            this.textGroup.appendToContentPane((this.text = Gui.createTextarea({
                width: 598,
                height: 205
            })).getMainDiv());
            this.actionGroup.appendToContentPane((this.buttonSave = Gui.createButton({
                text: I18n.tr("buttons.save")
            })).getMainDiv());
            EventHandler.listen("WINDOW_OPENED", function(uid) {
                if (uid !== "scripts") {
                    return;
                }
                Tab.instance().text.setContent(NerdPortrait.instance().text());
                $(Tab.instance().buttonSave.getMainDiv()).off("click").on("click", function() {
                    var e, text;
                    text = $.trim(Tab.instance().text.getContent());
                    if (text !== "") {
                        try {
                            NerdPortrait.instance().setText(text);
                            (new UserMessage(I18n.tr("messages.text_saved"), UserMessage.TYPE_SUCCESS)).show();
                        } catch (_error) {
                            e = _error;
                            (new UserMessage(e, UserMessage.TYPE_ERROR)).show();
                        }
                    } else {
                        (new UserMessage(I18n.tr("messages.enter_text"), UserMessage.TYPE_HINT)).show();
                    }
                    return false;
                });
            });
        }
        var instance;
        instance = null;
        Tab.instance = function() {
            return instance;
        };
        return Tab;
    }();
    $(document).ready(function() {
        var api;
        I18n.setLanguage(Game.locale);
        api = TheWestApi.register(NerdPortrait.ID, NerdPortrait.NAME, NerdPortrait.MIN_GAME_VERSION, NerdPortrait.MAX_GAME_VERSION, NerdPortrait.AUTHOR, NerdPortrait.WEB_SITE);
        api.setGui((new Tab).maindiv);
        new NerdPortrait;
        return true;
    });
});