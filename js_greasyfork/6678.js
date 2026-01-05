// ==UserScript==
// @name		The West - Sets de Tombolas
// @namespace   
// @description Sets de Tombolas
// @include		http*://*.the-west.*/game.php*
// @version		1.1
// @history		1.1 (21 de Março de 2016) - Adição dos 3 Conjuntos da Tombola da Páscoa 2016.
// @history		1 - Os 30 Conjuntos que saíram anteriormente nas Tombolas.
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/6678/The%20West%20-%20Sets%20de%20Tombolas.user.js
// @updateURL https://update.greasyfork.org/scripts/6678/The%20West%20-%20Sets%20de%20Tombolas.meta.js
// ==/UserScript==

(function(func) {
	var script = document.createElement("script");
	script.setAttribute("type", "application/javascript");
	script.textContent = "(" + func.toString() + ")();";
	document.body.appendChild(script);
	document.body.removeChild(script);
}

(function() {
	var TW_Widgets = new Object();

	TW_Widgets.MenuButton = function(image, title, onclick) {
		var self = this;

		this.isHovered = false;
		this.onClick = onclick;

		var clicked = function(e) {
			if (self.onClick)
			self.onClick(self, e);
		}

		var repaint = function() {
			var x = !self.isHovered ? 0 : -25;
			self.obj.css("background-position", x + "px 0px");
		}

		var mouseIn = function() {
			self.isHovered = true;
			repaint();
		}

		var mouseOut = function() {
			self.isHovered = false;
			repaint();
		}

		this.obj = $("<div class='menulink' title='" + title + "' />").css("background-image", "url(" + image + ")");
		this.obj.hover(mouseIn, mouseOut);
		this.obj.click(clicked);

		$("div#ui_menubar").append($("<div class='ui_menucontainer' />").append(this.obj).append("<div class='menucontainer_bottom' />"));
	}

var TW_Sets = [{
		name: "1) Chingachgook",
			items: [276000, 589000, 40016000, 11151000, 10161000, 451000, 67000, 878000, 151000]
		}, {
		name: "2) Natty Bumppo",
			items: [277000, 590000, 40017000, 11152000, 10162000, 452000, 68000, 879000, 152000]
		}, {
		name: "3) Allan Quatermain",
			items: [278000, 591000, 40018000, 11153000, 10163000, 453000, 69000, 880000, 153000]
		}, {
		name: "4) Freeman",
			items: [291000, 41004000, 40032000, 11166000, 10176000, 466000, 638000, 2189000]
		}, {
		name: "5) Doc",
			items: [292000, 41005000, 40033000, 11167000, 10177000, 467000, 639000, 2190000]
		}, {
		name: "6) Cartwright",
			items: [293000, 41006000, 40034000, 11168000, 10178000, 468000, 640000, 2191000]
		}, {
		name: "7) Will Munny",
			items: [42016000, 41028000, 40057000, 11190000, 10201000, 490000, 87000, 895000, 183000]
		}, {
		name: "8) Jeremiah Johnson",
			items: [42017000, 41029000, 40058000, 11191000, 10202000, 491000, 88000, 896000, 184000]
		}, {
		name: "9) Elfego Baca",
			items: [42018000, 41030000, 40059000, 11192000, 10203000, 492000, 89000, 897000, 185000]
		}, {
		name: "10) Frank Eaton",
			items: [42021000, 41033000, 40063000, 11195000, 10206000, 495000, 91000, 899000, 187000]
		}, {
		name: "11) George McJunkin",
			items: [42022000, 41034000, 40064000, 11196000, 10207000, 496000, 92000, 900000, 188000]
		}, {
		name: "12) King Fisher",
			items: [42023000, 41035000, 40065000, 11197000, 10208000, 497000, 93000, 901000, 189000]
		}, {
		name: "13) Cullen Baker",
			items: [42207000, 41208000, 40208000, 11279000, 10305000, 43206000, 45020000, 934000, 44034000]
		}, {
		name: "14) Bass Reeves",
			items: [42208000, 41209000, 40209000, 11280000, 10306000, 43207000, 45021000, 935000, 44035000]
		}, {
		name: "15) Pat Desmond",
			items: [42209000, 41210000, 40210000, 11281000, 10307000, 43208000, 45022000, 936000, 44036000]
		}, {
		name: "16) Black Bart",
			items: [42225000, 41225000, 40230000, 11300000, 10325000, 43225000, 691000, 2610000]
		}, {
		name: "17) Bob Dalton",
			items: [42226000, 41226000, 40231000, 11301000, 10326000, 43226000, 692000, 2611000]
		}, {
		name: "18) Jesse Chisholm",
			items: [42227000, 41227000, 40232000, 11302000, 10327000, 43227000, 693000, 2612000]
		}, {
		name: "19) Bill Doolin",
			items: [42241000, 41241000, 40241000, 11311000, 10341000, 43241000, 48000000, 2641000]
		}, {
		name: "20) Deadwood Dick",
			items: [42242000, 41242000, 40242000, 11312000, 10342000, 43242000, 48001000, 2642000]
		}, {
		name: "21) Frank James",
			items: [42243000, 41243000, 40243000, 11313000, 10343000, 43243000, 48002000, 2643000]
		}, {
		name: "22) Wyatt Earp",
			items: [42254000, 41253000, 40253000, 11323000, 10353000, 43253000, 45050000, 960000, 44076000]
		}, {
		name: "23) Flint Eastwood",
			items: [42255000, 41254000, 40254000, 11324000, 10354000, 43254000, 45051000, 961000, 44077000]
		}, {
		name: "24) Eric Pinter",
			items: [42256000, 41255000, 40255000, 11325000, 10355000, 43255000, 45052000, 962000, 44078000]
		}, {
		name: "25) Garimpeiro/Prospector",
			items: [42258000, 41257000, 40257000, 11327000, 10357000, 43257000, 48016000, 2717000]
		}, {
		name: "26) Explorador/Scout",
			items: [42259000, 41258000, 40258000, 11328000, 10358000, 43258000, 48017000, 2718000]
		}, {
		name: "27) Construtor/Builder",
			items: [42260000, 41259000, 40259000, 11329000, 10359000, 43259000, 48018000, 2719000]
		}, {
		name: "28) Collin",
			items: [380000, 385000, 390000, 395000, 434000, 563000, 698000, 697000, 678000]
		}, {
		name: "29) Corey",
			items: [381000, 386000, 391000, 396000, 558000, 564000, 732000, 713000, 679000]
		}, {
		name: "30) Aird",
			items: [382000, 387000, 392000, 397000, 559000, 565000, 785000, 735000, 688000]
		}, {
		name: "31) Detetive/Detective",
			items: [50039000, 50040000, 50041000, 50043000, 50042000, 50044000, 50046000, 50045000, 50047000]
		}, {
		name: "32) Nómada/Wanderer",
			items: [50048000, 50049000, 50050000, 50051000, 50052000, 50053000, 50055000, 50054000, 50056000]
		}, {
		name: "33) Shawnee",
			items: [50057000, 50058000, 50059000, 50060000, 50061000, 50062000, 50064000, 50063000, 50065000]
		}
	];

	var TW_QuickSearch = new Object();
	TW_QuickSearch.name = "Sets de Tombola";
	TW_QuickSearch.gui = {};
	TW_QuickSearch.gui.popupMenu = null;
	TW_QuickSearch.init = function() {
		TW_QuickSearch.gui.menuButton = new TW_Widgets.MenuButton(
			"data:image/png;base64,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",
			TW_QuickSearch.name,
			TW_QuickSearch.popup
		);
	}

	TW_QuickSearch.popup = function(button, e) {
		if (!TW_QuickSearch.gui.popupMenu) {
			TW_QuickSearch.gui.popupMenu = new west.gui.Selectbox().setWidth(175);
			TW_QuickSearch.gui.popupMenu.addListener(TW_QuickSearch.findSet);

			for (var i = 0; i < TW_Sets.length; i++)
				TW_QuickSearch.gui.popupMenu.addItem(i, TW_Sets[i].name);
		}

		TW_QuickSearch.gui.popupMenu.show(e);
	}

	TW_QuickSearch.findSet = function(id) {
		var items, invItems = [];
		try {

			items = TW_Sets[id].items;
		} catch (e) {
			return;
		}

		for (var i = 0; i < items.length; i++) {
			var invItem = Bag.getItemByItemId(items[i]);
			if (invItem)
				invItems.push(invItem);
		}

		if (invItems.length > 0) {
			if (!Bag.loaded) {
				var f = function(res) {
					EventHandler.listen('inventory_loaded', function() {
						Wear.open();
						Inventory.showSearchResult(res);
						return EventHandler.ONE_TIME_EVENT;
					});
					return Bag.loadItems();
				}(invItems);
			} else {
				Wear.open();
				Inventory.showSearchResult(invItems);
			}
		} else {
			var dlg = new west.gui.Dialog("Sets de Tombolas", "Não tens nenhum item desse set.");
			dlg.addButton("ok");
			dlg.setIcon(west.gui.Dialog.SYS_WARNING);
			dlg.show();
		}
	}

	$(document).ready(TW_QuickSearch.init);
}));
