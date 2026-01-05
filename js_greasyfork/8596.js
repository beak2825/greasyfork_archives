// ==UserScript==
// @namespace		https://greasyfork.org/users/8637
// @name        	The West - Item Set Manager
// @author      	neversleep1911
// @description		Manage your sets like a boss!
// @include     	http://*.the-west.*/game.php*
// @include     	https://*.the-west.*/game.php*
// @grant       	none
// @version     	1.1.2
// @copyright		Copyright (c) 2015 neversleep1911
// @license			MIT (http://opensource.org/licenses/MIT)
// @downloadURL https://update.greasyfork.org/scripts/8596/The%20West%20-%20Item%20Set%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/8596/The%20West%20-%20Item%20Set%20Manager.meta.js
// ==/UserScript==

(function(func) {
    var script;
    script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.textContent = "(" + func.toString() + ")();";
    document.body.appendChild(script);
    document.body.removeChild(script);
})(function() {
    var Gui, I18n, ItemSetManager, ItemSetWindow, Recent;
    I18n = function() {
        function I18n() {}
        var DEFAULT_LANGUAGE, STRINGS, language;
        DEFAULT_LANGUAGE = "en_US";
        STRINGS = {
            de_DE: {
                item_set_window: {
                    title: "Gegenstände"
                },
                messages: {
                    bag_is_not_loaded: "Inventar nicht geladen!"
                }
            },
            en_US: {
                item_set_window: {
                    title: "Items"
                },
                messages: {
                    bag_is_not_loaded: "Bag is not loaded!"
                }
            },
            ru_RU: {
                item_set_window: {
                    title: "Предметы"
                },
                messages: {
                    bag_is_not_loaded: "Инвентарь не загружен!"
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
            var j, len, prop, properties, string;
            string = STRINGS[language];
            properties = id.split(".");
            for (j = 0, len = properties.length; j < len; j++) {
                prop = properties[j];
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
        Gui.createSelectbox = function(options) {
            var menu;
            if (options == null) {
                options = {};
            }
            menu = new west.gui.Selectbox;
            if (options.header) {
                menu.setHeader(options.header);
            }
            menu.setWidth(options.width || 175);
            if (options.height) {
                menu.setHeight(options.height);
            }
            if (options.onclick) {
                menu.addListener(options.onclick);
            }
            return menu;
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
        return Gui;
    }();
    Recent = function() {
        function Recent() {}
        Recent.LSK_RECENT = "7d04d85e-cbc4-4d6f-acdc-7ccadcb24534";
        Recent.MAX_SIZE = 10;
        Recent.load = function() {
            return this.list = (localStorage.getItem(this.LSK_RECENT) || "").split(",");
        };
        Recent.push = function(value) {
            var i;
            i = this.list.indexOf(value);
            if (i !== -1) {
                this.list.splice(i, 1);
            }
            if (this.list.push(value) > this.MAX_SIZE) {
                this.list.shift();
            }
            localStorage.setItem(this.LSK_RECENT, this.list.join(","));
            return this.list.length;
        };
        return Recent;
    }();
    ItemSetManager = function() {
        function ItemSetManager() {
            var self;
            self = this;
            I18n.setLanguage(Game.locale);
            Recent.load();
            Gui.createMenuButton({
                title: ItemSetManager.NAME,
                image: this.MENU_BUTTON_IMAGE,
                onclick: function(e) {
                    self.onMenuButtonClick(e);
                    e.preventDefault();
                    return false;
                }
            });
            this.menu = Gui.createSelectbox({
                height: 500,
                onclick: function(value) {
                    self.onMenuItemClick(value);
                    return true;
                }
            });
            this.buildMenu();
        }
        ItemSetManager.ID = "tw_item_set_manager";
        ItemSetManager.NAME = "Item Set Manager";
        ItemSetManager.AUTHOR = "neversleep1911";
        ItemSetManager.WEB_SITE = "https://greasyfork.org/scripts/8596";
        ItemSetManager.MIN_GAME_VERSION = "2.21";
        ItemSetManager.MAX_GAME_VERSION = Game.version.toString();
        ItemSetManager.prototype.MENU_BUTTON_IMAGE = "data:image/png;base64,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";
        ItemSetManager.prototype.onMenuButtonClick = function(e) {
            var offset;
            offset = $(e.target).offset();
            offset.left -= $(e.target).width();
            this.menu.show();
            this.menu.setPosition(offset.left, offset.top);
            return this;
        };
        ItemSetManager.prototype.onMenuItemClick = function(setId) {
            var css, invWasClosed, invWnd, self, wearWndDiv;
            self = this;
            if (Bag.loaded) {
                invWasClosed = wman.getById(Inventory.uid) ? false : true;
                if (wman.getById(Wear.uid)) {
                    if (wman.isMinimized(Wear.uid)) {
                        wman.reopen(Wear.uid);
                    }
                } else {
                    Wear.open();
                }
                if (invWasClosed) {
                    invWnd = wman.getById(Inventory.uid);
                    if (invWnd) {
                        invWnd.fireEvent(TWE("WINDOW_CLOSE"), invWnd);
                    }
                }
                if (ItemSetWindow.wnd) {
                    if (wman.isMinimized(ItemSetWindow.uid)) {
                        wman.reopen(ItemSetWindow.uid);
                    }
                    ItemSetWindow.wnd.bringToTop();
                } else {
                    wearWndDiv = $(wman.getById(Wear.uid).getMainDiv());
                    css = wearWndDiv.offset();
                    css.left += wearWndDiv.width() - 13;
                    css.width = 304;
                    css.height = wearWndDiv.height();
                    ItemSetWindow.open({
                        css: css
                    });
                }
                ItemSetWindow.setItemSet(west.storage.ItemSetManager.get(setId));
                setTimeout(function() {
                    Recent.push(setId);
                    self.buildMenu();
                }, 200);
            } else {
                (new UserMessage(I18n.tr("messages.bag_is_not_loaded"), UserMessage.TYPE_ERROR)).show();
            }
            return this;
        };
        ItemSetManager.prototype.buildMenu = function() {
            var i, img, item, j, k, l, len, len1, len2, menuItem, ref, set, setId, sets, text;
            sets = west.storage.ItemSetManager.getAll().slice(0).reverse();
            if (Recent.list.length > 0) {
                ref = Recent.list;
                for (j = 0, len = ref.length; j < len; j++) {
                    setId = ref[j];
                    for (i = k = 0, len1 = sets.length; k < len1; i = ++k) {
                        set = sets[i];
                        if (setId === set.key) {
                            sets.splice(i, 1);
                            sets.unshift(set);
                            break;
                        }
                    }
                }
            }
            this.menu.removeAll();
            for (l = 0, len2 = sets.length; l < len2; l++) {
                set = sets[l];
                item = ItemManager.getByBaseId(set.items[0]);
                img = $("<img />");
                img.attr("src", item.image);
                img.css({
                    position: "absolute",
                    width: 18,
                    height: 18,
                    left: 4
                });
                text = $("<span>" + set.name + "</span>");
                text.css("padding-left", 16);
                menuItem = $("<div />");
                menuItem.css({
                    overflow: "hidden",
                    "text-overflow": "ellipsis",
                    "white-space": "nowrap"
                });
                menuItem.append(img);
                menuItem.append(text);
                this.menu.addItem(set.key, menuItem, set.name);
            }
            return this;
        };
        return ItemSetManager;
    }();
    ItemSetWindow = function() {
        function ItemSetWindow() {}
        ItemSetWindow.uid = "item-set-window";
        ItemSetWindow.open = function(options) {
            if (options == null) {
                options = {};
            }
            if (!this.wnd) {
                this.wnd = wman.open(this.uid, null, "noreload");
                this.wnd.setTitle(I18n.tr("item_set_window.title"));
                this.wnd.addEventListener("WINDOW_DESTROY", function() {
                    ItemSetWindow.unlistenWearChagned();
                    delete ItemSetWindow.wnd;
                });
                $(".tw2gui_window_inset", this.wnd.getMainDiv()).css({
                    background: 'url("/images/interface/wood_texture_dark.jpg") 50% -35px repeat'
                });
                $(".tw2gui_inner_window_bg", this.wnd.getMainDiv()).css({
                    background: 'url("/images/window/inventory/bag_background.jpg") 50% 0 no-repeat',
                    "background-size": "auto 419px"
                });
                $(".tw2gui_inner_window_bg2", this.wnd.getMainDiv()).css({
                    display: "none"
                });
                this.wnd.appendToContentPane(this.itemsDiv = $("<div />"));
                this.wnd.appendToContentPane((this.actionsDiv = $("<div />")).css({
                    position: "absolute",
                    top: 375,
                    width: "100%",
                    height: 40,
                    "text-align": "right"
                }));
                this.actionsDiv.append(Gui.createButton({
                    icon: new west.gui.Icon("search"),
                    onclick: function(button, data) {
                        return ItemSetWindow.onButtonSearchClick(button, data);
                    }
                }).getMainDiv());
                if (options.css) {
                    $(this.wnd.getMainDiv()).css(options.css);
                }
                this.listenWearChagned();
            }
            return this;
        };
        ItemSetWindow.setItemSet = function(set) {
            var bagItem, bagItems, bestItem, invItem, invItemDiv, item, itemCount, itemId, j, k, l, len, len1, len2, ref, timer;
            if (!this.wnd) {
                return false;
            }
            timer = 0;
            this.set = set;
            this.wnd.setMiniTitle(set.name);
            this.itemsDiv.empty();
            ref = set.items;
            for (j = 0, len = ref.length; j < len; j++) {
                itemId = ref[j];
                item = ItemManager.getByBaseId(itemId);
                invItem = new tw2widget.InventoryItem(item);
                invItemDiv = $(invItem.getMainDiv());
                bagItems = Bag.getItemsByBaseItemId(itemId);
                itemCount = 0;
                for (k = 0, len1 = bagItems.length; k < len1; k++) {
                    bagItem = bagItems[k];
                    itemCount += bagItem.getCount();
                }
                invItemDiv.css({
                    border: "1px solid transparent",
                    "border-radius": 4
                });
                if (Wear.carries(itemId)) {
                    ++itemCount;
                    invItemDiv.css("border-color", "black");
                } else {
                    if (bagItems.length > 0) {
                        bestItem = bagItems[0];
                        for (l = 0, len2 = bagItems.length; l < len2; l++) {
                            bagItem = bagItems[l];
                            if (bagItem.level > bestItem.level) {
                                bestItem = bagItem;
                            }
                        }
                        (function(bestItem, invItemDiv) {
                            invItemDiv.on("click", function(e) {
                                if (!e.shiftKey) {
                                    if (timer) {
                                        clearTimeout(timer);
                                    }
                                    invItemDiv.off("click");
                                    invItemDiv.css("opacity", .5);
                                    ItemSetWindow.unlistenWearChagned();
                                    Wear.carry(bestItem);
                                    timer = setTimeout(function() {
                                        ItemSetWindow.setItemSet(set);
                                        ItemSetWindow.listenWearChagned();
                                        timer = 0;
                                    }, 1e3);
                                }
                                return true;
                            });
                        })(bestItem, invItemDiv);
                    } else {
                        invItemDiv.css("opacity", .5);
                    }
                }
                invItem.setCount(itemCount);
                this.itemsDiv.append(invItem.getMainDiv());
            }
            return this;
        };
        ItemSetWindow.onButtonSearchClick = function() {
            var bagItems, itemId, j, len, ref;
            if (!this.set) {
                return;
            }
            if (Bag.loaded) {
                bagItems = [];
                ref = this.set.items;
                for (j = 0, len = ref.length; j < len; j++) {
                    itemId = ref[j];
                    bagItems = bagItems.concat(Bag.getItemsByBaseItemId(itemId));
                }
                if (wman.getById(Inventory.uid)) {
                    if (wman.isMinimized(Inventory.uid)) {
                        wman.reopen(Inventory.uid);
                    }
                } else {
                    Inventory.open();
                    $(Inventory.window.getMainDiv()).css($(this.wnd.getMainDiv()).offset());
                }
                Inventory.showSearchResult(bagItems);
                Inventory.window.bringToTop();
            } else {
                (new UserMessage(I18n.tr("messages.bag_is_not_loaded"), UserMessage.TYPE_ERROR)).show();
            }
        };
        ItemSetWindow.listenWearChagned = function() {
            if (!this.listening) {
                EventHandler.listen("wear_changed", this.wearChangedHandler, this);
                this.listening = true;
            }
            return this.listening;
        };
        ItemSetWindow.unlistenWearChagned = function() {
            if (this.listening) {
                EventHandler.unlisten("wear_changed", this.wearChangedHandler, this);
                this.listening = false;
            }
            return this.listening;
        };
        ItemSetWindow.wearChangedHandler = function() {
            if (ItemSetWindow.set) {
                ItemSetWindow.setItemSet(ItemSetWindow.set);
            }
        };
        return ItemSetWindow;
    }();
    $(document).ready(function() {
        var api, manager;
        api = TheWestApi.register(ItemSetManager.ID, ItemSetManager.NAME, ItemSetManager.MIN_GAME_VERSION, ItemSetManager.MAX_GAME_VERSION, ItemSetManager.AUTHOR, ItemSetManager.WEB_SITE);
        api.setGui("Copyrights, changelog and other details see <a href='" + ItemSetManager.WEB_SITE + "' target='_blank'>here</a>.");
        manager = null;
        EventHandler.listen([ "itemmanager_loaded", "itemsetmanager_loaded" ], function() {
            if (manager === null && ItemManager.isLoaded() && west.storage.ItemSetManager.isLoaded()) {
                manager = new ItemSetManager;
            }
            return EventHandler.ONE_TIME_EVENT;
        });
        return true;
    });
});