// ==UserScript==
// @namespace		https://greasyfork.org/users/8637
// @name        	The West - Skills Calc
// @author      	neversleep1911
// @description		Calculates sum of skills obtained from items
// @include     	http://*.the-west.*/game.php*
// @include     	https://*.the-west.*/game.php*
// @grant       	none
// @version     	2.1.3
// @copyright		Copyright (c) 2015 neversleep1911 (full list of contributors/translators see here: https://greasyfork.org/scripts/7829)
// @license			MIT (http://opensource.org/licenses/MIT)
// @downloadURL https://update.greasyfork.org/scripts/7829/The%20West%20-%20Skills%20Calc.user.js
// @updateURL https://update.greasyfork.org/scripts/7829/The%20West%20-%20Skills%20Calc.meta.js
// ==/UserScript==

(function(func) {
    var script;
    script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.textContent = "(" + func.toString() + ")();";
    document.body.appendChild(script);
    document.body.removeChild(script);
})(function() {
    var Gui, I18n, SkillsCalc;
    I18n = function() {
        function I18n() {}
        var DEFAULT_LANGUAGE, STRINGS, language;
        DEFAULT_LANGUAGE = "en_US";
        STRINGS = {
            de_DE: {
                dialogs: {
                    add_item: "Gegenstand hinzufügen",
                    add_character_items: "Items eines Spielers"
                },
                groups: {
                    skills: "Fertigkeiten",
                    items: "Ausrüstung"
                },
                buttons: {
                    character: "Spieler",
                    add: "Hinzufügen",
                    reset: "Zurücksetzen"
                },
                checkboxes: {
                    show_bonus: "Bonus anzeigen",
                    show_skills: "Meinen Skill anzeigen"
                },
                labels: {
                    level: "Stufe",
                    item_id: "Item ID",
                    character_name: "Name des Spielers",
                    health: "LPs"
                },
                tooltip: {
                    health: "Normal / Soldat / Soldat mit Bonus"
                },
                errors: {
                    player_not_found: "Spieler nicht gefunden!"
                }
            },
            en_US: {
                dialogs: {
                    add_item: "Add item",
                    add_character_items: "Character's items"
                },
                groups: {
                    skills: "Skills",
                    items: "Items"
                },
                buttons: {
                    character: "Character",
                    add: "Add",
                    reset: "Reset"
                },
                checkboxes: {
                    show_bonus: "Show bonus",
                    show_skills: "Show my skills"
                },
                labels: {
                    level: "Level",
                    item_id: "Item ID",
                    character_name: "Character's name",
                    health: "Health"
                },
                tooltip: {
                    health: "Normal / Solder / Solder with bonus"
                },
                errors: {
                    player_not_found: "Player not found!"
                }
            },
            pl_PL: {
                dialogs: {
                    add_item: "Dodaj przedmiot",
                    add_character_items: "Przedmioty gracza"
                },
                groups: {
                    skills: "Umiejętności",
                    items: "Przedmioty"
                },
                buttons: {
                    character: "Gracz",
                    add: "Dodaj",
                    reset: "Reset"
                },
                checkboxes: {
                    show_bonus: "Pokaż bonus",
                    show_skills: "Pokaż moje umiejętności"
                },
                labels: {
                    level: "Level",
                    item_id: "ID przedmiotu",
                    character_name: "Nazwa gracza",
                    health: "Życie"
                },
                tooltip: {
                    health: "Normalny / Żołnierz / Żołnierz z bonusem"
                },
                errors: {
                    player_not_found: "Gracz nie znaleziony!"
                }
            },
            ru_RU: {
                dialogs: {
                    add_item: "Добавить предмет",
                    add_character_items: "Предметы персонажа"
                },
                groups: {
                    skills: "Навыки",
                    items: "Предметы"
                },
                buttons: {
                    character: "Персонаж",
                    add: "Добавить",
                    reset: "Сбросить"
                },
                checkboxes: {
                    show_bonus: "Показывать бонусы",
                    show_skills: "Показывать мои навыки"
                },
                labels: {
                    level: "Уровень",
                    item_id: "ID предмета",
                    character_name: "Имя персонажа",
                    health: "Здоровье"
                },
                tooltip: {
                    health: "Минимум / Солдат / Солдат с бонусом"
                },
                errors: {
                    player_not_found: "Игрок не найден!"
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
            var string;
            string = STRINGS[language];
            $(id.split(".")).each(function(k, v) {
                return (string = string[v]) !== void 0;
            });
            return string || id;
        };
        return I18n;
    }();
    Gui = function() {
        function Gui() {}
        Gui.createMenuButton = function(options) {
            var button;
            if (options == null) {
                options = {};
            }
            button = $("<div class='menulink' title='" + options.title + "' />");
            if (options.image) {
                button.css("background-image", "url(" + options.image + ")");
            }
            button.hover(function() {
                $(this).css("background-position", "-25px 0px");
                return true;
            }, function() {
                $(this).css("background-position", "0px 0px");
                return true;
            }).on("click", options.onclick);
            $("div#ui_menubar").append($('<div class="ui_menucontainer" />').append(button).append('<div class="menucontainer_bottom" />'));
            return button;
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
        Gui.createCheckbox = function(options) {
            var checkbox;
            if (options == null) {
                options = {};
            }
            checkbox = new west.gui.Checkbox(options.text, "", options.onclick);
            $(checkbox.getMainDiv()).css(options.css);
            return checkbox;
        };
        Gui.createTextfield = function(options) {
            var field;
            if (options == null) {
                options = {};
            }
            field = new west.gui.Textfield;
            field.setSize(options.size);
            field.setLabel($("<span>" + options.label + "</span>"));
            if (options.value) {
                field.setValue(options.value);
            }
            if (options.css) {
                $(field.getMainDiv()).css(options.css);
            }
            return field;
        };
        return Gui;
    }();
    SkillsCalc = function() {
        function SkillsCalc() {
            var self;
            self = this;
            I18n.setLanguage(Game.locale);
            Gui.createMenuButton({
                title: SkillsCalc.NAME,
                image: this.MENU_BUTTON_IMAGE,
                onclick: function(e) {
                    self.createWindow();
                    e.preventDefault();
                    return false;
                }
            });
        }
        var ItemCalculator, Window;
        SkillsCalc.ID = "tw_skills_calc";
        SkillsCalc.NAME = "Skills Calc";
        SkillsCalc.AUTHOR = "neversleep1911";
        SkillsCalc.WEB_SITE = "https://greasyfork.org/scripts/7829";
        SkillsCalc.MIN_GAME_VERSION = "2.21";
        SkillsCalc.MAX_GAME_VERSION = Game.version.toString();
        SkillsCalc.prototype.MENU_BUTTON_IMAGE = "data:image/png;base64,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";
        SkillsCalc.prototype.windows = {};
        SkillsCalc.prototype.createWindow = function() {
            var self, wndId;
            self = this;
            while (true) {
                wndId = Math.ceil(Math.random() * 1024);
                if (!this.windows[wndId]) {
                    break;
                }
            }
            this.windows[wndId] = new Window({
                id: wndId,
                title: SkillsCalc.NAME,
                miniTitle: SkillsCalc.NAME
            });
            this.windows[wndId].onDestroy = function(wnd) {
                delete self.windows[wnd.id];
                return true;
            };
            return true;
        };
        Window = function() {
            function Window(options) {
                var self;
                self = this;
                this.images = {};
                this.items = {};
                this.calculator = new ItemCalculator;
                this.calculator.level = Character.level;
                this.id = options.id;
                this.wnd = wman.open("skills-calc-window-" + options.id, null, "noreload");
                this.wnd.setTitle(options.title);
                this.wnd.setMiniTitle(options.miniTitle);
                this.wnd.addEventListener("WINDOW_DESTROY", function() {
                    if (self.onDestroy) {
                        return self.onDestroy(self);
                    } else {
                        return true;
                    }
                });
                this.wnd.appendToContentPane((this.groupSkills = Gui.createGroup({
                    title: I18n.tr("groups.skills"),
                    css: {
                        width: 402,
                        position: "absolute"
                    },
                    scrollPane: {
                        css: {
                            height: 264
                        }
                    }
                })).getMainDiv());
                this.wnd.appendToContentPane((this.groupItems = Gui.createGroup({
                    title: I18n.tr("groups.items"),
                    css: {
                        left: 400,
                        width: 294
                    },
                    scrollPane: {
                        css: {
                            height: 264
                        }
                    }
                })).getMainDiv());
                this.wnd.appendToContentPane(Gui.createButton({
                    text: I18n.tr("buttons.reset"),
                    css: {
                        left: 592,
                        top: 342,
                        position: "absolute"
                    },
                    onclick: function(button, data) {
                        return self.onButtonResetClick(button, data);
                    }
                }).getMainDiv());
                this.wnd.appendToContentPane(Gui.createButton({
                    text: I18n.tr("buttons.add"),
                    css: {
                        left: 490,
                        top: 342,
                        position: "absolute"
                    },
                    onclick: function(button, data) {
                        return self.onButtonAddClick(button, data);
                    }
                }).getMainDiv());
                this.wnd.appendToContentPane(Gui.createButton({
                    text: I18n.tr("buttons.character"),
                    css: {
                        left: 388,
                        top: 342,
                        position: "absolute"
                    },
                    onclick: function(button, data) {
                        return self.onButtonCharacterClick(button, data);
                    }
                }).getMainDiv());
                this.wnd.appendToContentPane((this.checkboxBonus = Gui.createCheckbox({
                    text: I18n.tr("checkboxes.show_bonus"),
                    css: {
                        left: 2,
                        top: 324,
                        position: "absolute"
                    },
                    onclick: function(state) {
                        return self.onCheckboxBonusClick(state);
                    }
                })).getMainDiv());
                this.wnd.appendToContentPane((this.checkboxSkills = Gui.createCheckbox({
                    text: I18n.tr("checkboxes.show_skills"),
                    css: {
                        left: 2,
                        top: 350,
                        position: "absolute"
                    },
                    onclick: function(state) {
                        return self.onCheckboxSkillsClick(state);
                    }
                })).getMainDiv());
                this.wnd.appendToContentPane((this.textfieldLevel = Gui.createTextfield({
                    size: 6,
                    label: I18n.tr("labels.level"),
                    value: this.calculator.level,
                    css: {
                        left: 180,
                        top: 320,
                        position: "absolute"
                    }
                })).getMainDiv());
                this.wnd.appendToContentPane(this.labelHealth = $("<span />").css({
                    position: "absolute",
                    left: 180,
                    top: 352
                }).attr("title", I18n.tr("tooltip.health")));
                this.textfieldLevel.onlyNumeric().getField().keyup(function(e) {
                    var level;
                    level = parseInt(self.textfieldLevel.getValue());
                    if (!isNaN(level) && level > 0) {
                        self.calculator.level = level;
                        self.recalc();
                        self.repaint();
                    }
                    return true;
                });
                this.initGroupSkills();
                this.initGroupItems();
            }
            Window.prototype.initGroupSkills = function() {
                var attr, attrs, div, img, j, l, len, len1, skill, skillType, skills;
                attrs = CharacterSkills.allAttrKeys;
                for (j = 0, len = attrs.length; j < len; j++) {
                    attr = attrs[j];
                    div = $('<div style="height: 41px;" />');
                    skills = CharacterSkills.skillKeys4Attr[attr];
                    for (l = 0, len1 = skills.length; l < len1; l++) {
                        skillType = skills[l];
                        skill = new Skill(skillType);
                        img = skill.getSkillImage();
                        img.removeAttr("class").css({
                            width: 72,
                            display: "inline-block",
                            "text-align": "center",
                            "font-weight": "bold",
                            "margin-left": 2
                        });
                        $("img.skillicon", img).removeAttr("class").css({
                            width: "100%"
                        });
                        $("span.skillpoints_label", img).attr("class", "skills-calc-skillpoints_label").css({
                            display: "inline-block",
                            position: "relative",
                            top: -16,
                            width: "100%",
                            height: 12,
                            color: "#ffffff",
                            "text-align": "center",
                            "font-size": "9pt",
                            "text-shadow": "1px 1px 1px rgb(0, 0, 0)",
                            "background-image": "url('/images/tw2gui/plusminus/plusminus_display_bg2.png')"
                        });
                        div.append(img);
                        this.images[skillType] = img.get(0);
                    }
                    this.groupSkills.appendToScrollContentPane(div);
                    this.groupSkills.appendToScrollContentPane($('<hr style="margin: 12px 0;" />'));
                }
                return true;
            };
            Window.prototype.initGroupItems = function() {
                var items, j, len, ref, slot;
                items = [];
                ref = Wear.slots;
                for (j = 0, len = ref.length; j < len; j++) {
                    slot = ref[j];
                    if (Wear.wear[slot]) {
                        items.push(Wear.wear[slot].obj);
                    }
                }
                this.addItems(items);
                return this.repaint();
            };
            Window.prototype.onButtonCharacterClick = function() {
                var content, dlg, ok, self, textfieldName;
                self = this;
                dlg = new west.gui.Dialog(I18n.tr("dialogs.add_character_items"));
                content = $("<div style='margin-top: 10px; text-align: center;'></div>");
                content.append((textfieldName = Gui.createTextfield({
                    size: 25,
                    label: I18n.tr("labels.character_name")
                })).getMainDiv());
                ok = function() {
                    var name;
                    if (!(name = $.trim(textfieldName.getValue()))) {
                        return false;
                    }
                    self.wnd.showLoader();
                    return Ajax.remoteCallMode("ranking", "get_data", {
                        rank: NaN,
                        search: name = name.toLowerCase(),
                        tab: "duels"
                    }, function(json) {
                        var found, j, len, player, ref;
                        if (json.error) {
                            self.wnd.hideLoader();
                            return (new UserMessage(json.msg, UserMessage.TYPE_ERROR)).show();
                        }
                        found = false;
                        ref = json.ranking;
                        for (j = 0, len = ref.length; j < len; j++) {
                            player = ref[j];
                            found = player.name.toLowerCase() === name;
                            if (found) {
                                Ajax.remoteCallMode("profile", "init", {
                                    name: player.name,
                                    playerId: player.id
                                }, function(resp) {
                                    var items, l, len1, ref1, slot;
                                    if (resp.error) {
                                        self.wnd.hideLoader();
                                        return (new UserMessage(resp.message, UserMessage.TYPE_ERROR)).show();
                                    } else {
                                        items = [];
                                        ref1 = Wear.slots;
                                        for (l = 0, len1 = ref1.length; l < len1; l++) {
                                            slot = ref1[l];
                                            if (resp.wear[slot]) {
                                                items.push(ItemManager.get(resp.wear[slot]));
                                            }
                                        }
                                        self.reset();
                                        self.calculator.level = resp.level;
                                        self.textfieldLevel.setValue(resp.level);
                                        self.addItems(items);
                                        self.repaint();
                                        self.wnd.hideLoader();
                                    }
                                    return true;
                                });
                                break;
                            }
                        }
                        if (!found) {
                            self.wnd.hideLoader();
                            (new UserMessage(I18n.tr("errors.player_not_found"), UserMessage.TYPE_ERROR)).show();
                        }
                        return true;
                    });
                };
                textfieldName.getField().keypress(function(e) {
                    if (e.which === 13 && ok()) {
                        dlg.hide();
                    }
                    return true;
                });
                dlg.setText(content).addButton("ok", ok).addButton("cancel").show();
                textfieldName.getField().focus();
                return true;
            };
            Window.prototype.onButtonAddClick = function() {
                var content, dlg, ok, self, textfieldId;
                self = this;
                dlg = new west.gui.Dialog(I18n.tr("dialogs.add_item"));
                content = $('<div style="margin-top: 10px; text-align: center;"><div id="skills-calc-preview-item" style="height: 60px; width: 60px; float: right; border: 1px solid black; border-radius: 4px;" /></div>');
                content.append((textfieldId = Gui.createTextfield({
                    size: 25,
                    label: I18n.tr("labels.item_id")
                })).maxlength(8).getMainDiv());
                textfieldId.getItem = function() {
                    var id;
                    id = parseInt(this.getValue());
                    if (isNaN(id)) {
                        return void 0;
                    } else {
                        return ItemManager.get(id);
                    }
                };
                ok = function() {
                    var item;
                    if (item = textfieldId.getItem()) {
                        self.addItems([ item ]);
                        self.repaint();
                        return true;
                    } else {
                        return false;
                    }
                };
                dlg.setText(content).addButton("ok", ok).addButton("cancel").show();
                textfieldId.getField().keypress(function(e) {
                    if (e.which === 13 && ok()) {
                        dlg.hide();
                    }
                    return true;
                }).keyup(function(e) {
                    var item, preview;
                    preview = $("#skills-calc-preview-item", content).empty();
                    if (item = textfieldId.getItem()) {
                        item = new tw2widget.InventoryItem(item);
                        preview.append($(item.getMainDiv()).css({
                            "float": "none"
                        }));
                    }
                    return true;
                }).focus();
                return true;
            };
            Window.prototype.onButtonResetClick = function() {
                return this.reset();
            };
            Window.prototype.onCheckboxBonusClick = function(state) {
                return this.repaint();
            };
            Window.prototype.onCheckboxSkillsClick = function(state) {
                this.recalc();
                return this.repaint();
            };
            Window.prototype.addItems = function(items) {
                var item, j, len, self;
                self = this;
                for (j = 0, len = items.length; j < len; j++) {
                    item = items[j];
                    this.removeItem(item);
                    this.items[item.type] = new tw2widget.InventoryItem(item);
                    $(this.items[item.type].getMainDiv()).css({
                        "float": "none",
                        display: "inline-block"
                    }).on("click", function(e) {
                        if (!e.shiftKey) {
                            item = ItemManager.get($(e.target).data("itemId"));
                            if (item && self.removeItem(item)) {
                                self.repaint();
                            }
                        }
                        return true;
                    });
                    this.calculator.sumItem(item);
                    this.groupItems.appendToScrollContentPane($(this.items[item.type].getMainDiv()));
                }
                return true;
            };
            Window.prototype.removeItem = function(item) {
                if (this.items[item.type]) {
                    this.calculator.subItem(this.items[item.type].obj);
                    $(this.items[item.type].getMainDiv()).remove();
                    delete this.items[item.type];
                    return true;
                } else {
                    return false;
                }
            };
            Window.prototype.recalc = function() {
                var item, ref, ref1, skill, type, value;
                this.calculator.reset();
                ref = this.items;
                for (type in ref) {
                    item = ref[type];
                    this.calculator.sumItem(item.obj);
                }
                if (this.checkboxSkills.isSelected()) {
                    ref1 = CharacterSkills.skills;
                    for (skill in ref1) {
                        value = ref1[skill];
                        this.calculator.calcSkill(skill, value.points, ItemCalculator.SUM_OP);
                    }
                }
                return true;
            };
            Window.prototype.repaint = function() {
                var health, min_health, result, skill, value;
                result = this.checkboxBonus.isSelected() ? this.calculator.resultWithBonus() : this.calculator.result;
                for (skill in result) {
                    value = result[skill];
                    if (this.images[skill]) {
                        $("span.skills-calc-skillpoints_label", this.images[skill]).text(value);
                    }
                }
                min_health = this.calculator.level * 10 + 90;
                health = {
                    normal: format_number(min_health + result.health * 10),
                    solder: format_number(min_health + result.health * 15),
                    solderBonus: format_number(min_health + result.health * 20),
                    toString: function() {
                        return this.normal + " / " + this.solder + " / " + this.solderBonus;
                    }
                };
                this.labelHealth.text(I18n.tr("labels.health") + ": " + health.toString());
                return true;
            };
            Window.prototype.reset = function() {
                var item, ref, type;
                ref = this.items;
                for (type in ref) {
                    item = ref[type];
                    $(item.getMainDiv()).remove();
                }
                $("span.skills-calc-skillpoints_label", this.groupSkills.getMainDiv()).text("0");
                this.items = {};
                this.calculator.reset();
                this.calculator.level = Character.level;
                this.textfieldLevel.setValue(Character.level);
                this.labelHealth.text(I18n.tr("labels.health") + ": 0 / 0 / 0");
                this.checkboxBonus.setSelected(false, true);
                this.checkboxSkills.setSelected(false, true);
                return true;
            };
            return Window;
        }();
        ItemCalculator = function() {
            function ItemCalculator() {
                this.level = 1;
                this._bonusExtractor = new west.item.BonusExtractor({
                    level: this.level
                });
                this._resultStack = [];
                this.reset();
            }
            ItemCalculator.SUM_OP = "sum";
            ItemCalculator.SUB_OP = "sub";
            ItemCalculator.prototype.sum = function(skill, value) {
                return this.result[skill] += value;
            };
            ItemCalculator.prototype.sub = function(skill, value) {
                return this.result[skill] -= value;
            };
            ItemCalculator.prototype.sumItem = function(item) {
                return this.calcItem(item, ItemCalculator.SUM_OP);
            };
            ItemCalculator.prototype.subItem = function(item) {
                return this.calcItem(item, ItemCalculator.SUB_OP);
            };
            ItemCalculator.prototype.calcItem = function(item, operator) {
                if (item.bonus.attributes) {
                    this.calcAttributes(item.bonus.attributes, operator);
                }
                if (item.bonus.skills) {
                    this.calcSkills(item.bonus.skills, operator);
                }
                if (item.bonus.item) {
                    this.calcBonuses(item.bonus.item, operator);
                }
                if (item.item_level > 0) {
                    this.calcDifference(item.bonus.item, item.item_level, operator);
                }
                if (item.set) {
                    this.calcSet(item.set, operator);
                }
                return this.result;
            };
            ItemCalculator.prototype.calcAttribute = function(attr, value, operator) {
                var j, len, skill, skills;
                skills = CharacterSkills.skillKeys4Attr[attr];
                for (j = 0, len = skills.length; j < len; j++) {
                    skill = skills[j];
                    this[operator](skill, value);
                }
                return this.result;
            };
            ItemCalculator.prototype.calcAttributes = function(attrs, operator) {
                var attr, value;
                for (attr in attrs) {
                    value = attrs[attr];
                    if (this.isAttribute(attr)) {
                        this.calcAttribute(attr, value, operator);
                    }
                }
                return this.result;
            };
            ItemCalculator.prototype.calcSkill = function(skill, value, operator) {
                return this[operator](skill, value);
            };
            ItemCalculator.prototype.calcSkills = function(skills, operator) {
                var skill, value;
                for (skill in skills) {
                    value = skills[skill];
                    if (this.isSkill(skill)) {
                        this.calcSkill(skill, value, operator);
                    }
                }
                return this.result;
            };
            ItemCalculator.prototype.calcDifference = function(bonuses, itemLevel, operator) {
                var bonus, diff, j, len;
                for (j = 0, len = bonuses.length; j < len; j++) {
                    bonus = bonuses[j];
                    diff = this._bonusExtractor.getCharacterItemValueDifferenceToItemLevel(bonus, 0, itemLevel);
                    if (diff <= 0) {
                        continue;
                    }
                    switch (bonus.bonus.type) {
                      case "attribute":
                        this.calcAttribute(bonus.bonus.name, diff, operator);
                        break;
                      case "skill":
                        this.calcSkill(bonus.bonus.name, diff, operator);
                    }
                }
                return this.result;
            };
            ItemCalculator.prototype.calcBonuses = function(bonuses, operator) {
                var bonus, j, len;
                this._bonusExtractor.character.level = this.level;
                for (j = 0, len = bonuses.length; j < len; j++) {
                    bonus = bonuses[j];
                    this.calcSkills(this._bonusExtractor.getAffectedSkills(bonus), operator);
                }
                return this.result;
            };
            ItemCalculator.prototype.calcSet = function(set, operator) {
                switch (operator) {
                  case ItemCalculator.SUM_OP:
                    this.itemSets[set] = (this.itemSets[set] || 0) + 1;
                    break;
                  case ItemCalculator.SUB_OP:
                    if (this.itemSets[set] && (this.itemSets[set] -= 1) <= 0) {
                        delete this.itemSets[set];
                    }
                }
                return this.result;
            };
            ItemCalculator.prototype.isAttribute = function(attr) {
                return CharacterSkills.allAttrKeys.indexOf(attr) !== -1;
            };
            ItemCalculator.prototype.isSkill = function(skill) {
                return CharacterSkills.allSkillKeys.indexOf(skill) !== -1;
            };
            ItemCalculator.prototype.reset = function() {
                var j, len, ref, skill;
                this.itemSets = {};
                this.result = {};
                ref = CharacterSkills.allSkillKeys;
                for (j = 0, len = ref.length; j < len; j++) {
                    skill = ref[j];
                    this.result[skill] = 0;
                }
                return this.result;
            };
            ItemCalculator.prototype.resultWithBonus = function() {
                var b, bonus, cb, found, i, itemCount, itemSet, j, l, len, len1, len2, m, n, name1, name2, ref, ref1, ref2, ref3, result, setId, stage, value;
                this.pushResult();
                this._bonusExtractor.level = this.level;
                bonus = {};
                ref = this.itemSets;
                for (setId in ref) {
                    itemCount = ref[setId];
                    itemSet = west.storage.ItemSetManager.get(setId);
                    for (i = j = 1, ref1 = itemCount; 1 <= ref1 ? j <= ref1 : j >= ref1; i = 1 <= ref1 ? ++j : --j) {
                        stage = itemSet.bonus[i];
                        if (stage) {
                            for (l = 0, len = stage.length; l < len; l++) {
                                b = stage[l];
                                switch (b.type) {
                                  case "attribute":
                                  case "skill":
                                    bonus[name1 = b.type] || (bonus[name1] = {});
                                    bonus[b.type][b.name] = (bonus[b.type][b.name] || 0) + b.value;
                                    break;
                                  case "character":
                                    bonus[name2 = b.type] || (bonus[name2] = []);
                                    found = false;
                                    ref2 = bonus[b.type];
                                    for (i = m = 0, len1 = ref2.length; m < len1; i = ++m) {
                                        cb = ref2[i];
                                        found = cb.type === b.bonus.type && cb.name === b.bonus.name && cb.key === b.key && cb.roundingMethod === b.roundingMethod;
                                        if (found) {
                                            bonus[b.type][i].value += b.bonus.value;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        bonus[b.type].push({
                                            type: b.bonus.type,
                                            name: b.bonus.name,
                                            value: b.bonus.value,
                                            key: b.key,
                                            roundingMethod: b.roundingMethod
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                if (bonus.attribute) {
                    this.calcAttributes(bonus.attribute, ItemCalculator.SUM_OP);
                }
                if (bonus.skill) {
                    this.calcSkills(bonus.skill, ItemCalculator.SUM_OP);
                }
                if (bonus.character) {
                    ref3 = bonus.character;
                    for (n = 0, len2 = ref3.length; n < len2; n++) {
                        b = ref3[n];
                        if (b.key === "level") {
                            value = this._bonusExtractor.getRoundedValue(b.value * this.level, b.roundingMethod);
                            switch (b.type) {
                              case "attribute":
                                this.calcAttribute(b.name, value, ItemCalculator.SUM_OP);
                                break;
                              case "skill":
                                this.calcSkill(b.name, value, ItemCalculator.SUM_OP);
                            }
                        }
                    }
                }
                result = this.result;
                this.popResult();
                return result;
            };
            ItemCalculator.prototype.pushResult = function() {
                return this._resultStack.push($.extend(true, {}, this.result));
            };
            ItemCalculator.prototype.popResult = function() {
                return this.result = this._resultStack.pop();
            };
            return ItemCalculator;
        }();
        return SkillsCalc;
    }();
    $(document).ready(function() {
        var api, calc;
        api = TheWestApi.register(SkillsCalc.ID, SkillsCalc.NAME, SkillsCalc.MIN_GAME_VERSION, SkillsCalc.MAX_GAME_VERSION, SkillsCalc.AUTHOR, SkillsCalc.WEB_SITE);
        api.setGui("Copyrights, changelog and other details see <a href='" + SkillsCalc.WEB_SITE + "' target='_blank'>here</a>.");
        calc = null;
        EventHandler.listen([ "itemmanager_loaded", "itemsetmanager_loaded" ], function() {
            if (calc === null && ItemManager.isLoaded() && west.storage.ItemSetManager.isLoaded()) {
                calc = new SkillsCalc;
            }
            return EventHandler.ONE_TIME_EVENT;
        });
        return true;
    });
    return true;
});