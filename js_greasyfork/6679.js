// ==UserScript==
// @name		The West - Sets e Outros
// @namespace   
// @description Sets e Outros
// @include		http*://*.the-west.*/game.php*
// @version		0.10.3 beta
// @history		0.10.3 beta (6 de Março de 2017) - Adição do "Matoaka" e passagem dos Sets para o fim.
// @history		0.10.2 beta (3 de Março de 2017) - Adição das medalhas de premium ao "Outros".
// @history		0.10.1 beta (13 de Fevereiro de 2017) - Adição dos sacos de S.Valentim e de pepitas ao "Outros".
// @history		0.10 beta (21 de Dezembro de 2016) - Regresso a vida, adição das caixas e sacos do Natal ao "Outros".
// @history	0.9 beta (9 de Dezembro de 2015) - Adição dos 2 sets do Dia de los Muertos 2015 e "Cartas UPB"
// @history	0.8 beta (2 de Julho de 2015) - Script volta ao activo depois de pausa em Dezembro com limpeza do código e adição dos produtos para a aventura do "Implacável" e a que veio com o Dia da Independência "Tesouros do Deserto".
// @history	0.7.1 beta Adicionado aos "Produtos para Profissões" os 4 buffs para as Diarias
// @history	0.7 beta Adicionado os "Produtos para Profissões" com o primeiro buff de todas as profissões
// @history 	0.6.2 beta Adicionado aos "Outros" o Saco de pepitas encantado, os 5 Gatos, as 6 Cartas de UPBs, os 6 itens do evento de S.Valentim, organizada a ordem
// @history 	0.6.1 beta Adicionado aos "Outros" o Cesto da Roupa e o Cesto para Gatos e o "St. Patrick"
// @history 	0.6 Adicionado a "Ghost of Christmas" e a "El Catrina", os produtos basicos no "Produtos de Diarias" e os sacos de natal ao "Outros"
// @history 	0.5.1 Adicionado os Outros
// @history 	0.5 Adicionado os Produtos com Bónus
// @history 	0.4.1 Mudada a ordem para ficar primeiro Sets, depois Itens e afins e no fim Produtos para diarias ou para aventuras
// @history 	0.4 Adicionada a Festiva - O fantasma das festas
// @history 	0.3.2 Adicionado o ID da Caixa de Saque as Caixas
// @history 	0.3.1 Id do Cofre Unico Precioso trocado
// @history 	0.3 Adicionada as Caixas
// @history 	0.2 Adicionado os Produtos das Diarias
// @history 	0.1 Adicionados os Sets do Bandido, Inverno, Nobre, Azteca e Mariachi
// @grant	   none
// @downloadURL https://update.greasyfork.org/scripts/6679/The%20West%20-%20Sets%20e%20Outros.user.js
// @updateURL https://update.greasyfork.org/scripts/6679/The%20West%20-%20Sets%20e%20Outros.meta.js
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
		name: "Matoaka",
			items: [50403000, 50404000, 50405000, 50406000, 50407000, 50408000]
		}, {
		name: "Produtos com Bónus",
			items: [1715000, 1759000, 1772000, 2188000, 2223000, 2228000, 2301000, 2302000, 2310000, 2352000, 2363000, 2409000, 2541000, 2555000, 2577000, 2583000, 2613000, 2644000, 12713000]
		}, {
		name: "Outros",
			items: [50000, 858000, 136000, 2482000, 21340000, 21341000, 21342000, 21343000, 2557000, 2558000, 12700000, 50009000, 2499000, 2690000, 379000, 50382000]
		}, {
		name: "Caixas",
			items: [1975000, 17008000, 17005000, 1976000, 17000000, 17001000, 17002000, 17006000, 2535000, 17007000, 2534000, 17003000, 2533000, 2618000]
		}, {
		name: "Cartas UPB",
			items: [2136000, 2137000, 2138000, 2139000, 2624000, 2172000]
		}, {
		name: "Produtos de Diarias",
			items: [2160000, 2161000, 2162000, 2163000, 760000, 761000, 702000, 766000, 700000, 791000, 767000, 759000, 708000, 705000, 715000, 1807000, 707000, 737000, 720000, 742000, 716000, 792000, 778000, 1812000, 1708000, 752000, 794000, 1811000, 768000, 725000, 719000, 1814000, 780000, 1818000, 756000, 730000, 1824000, 1819000, 1756000, 764000, 751000]
  		}, {
		name: "Festiva - O fantasma das festas",
			items: [709000, 746000, 703000, 1810000, 1808000, 2161000, 2160000, 700000, 701000, 793000, 706000, 748000]
  		}, {
		name: "Implacável",
			items: [1814000, 728000, 1708000, 719000, 794000]
  		}, {
		name: "Tesouros do Deserto",
			items: [736000, 760000, 766000, 749000]
		}, {
		name: "Outlaw/Bandido",
			items: [42240000, 41240000, 40240000, 11310000, 10340000, 43240000, 45040000, 950000, 44060000, 696000, 2640000]
		}, {
		name: "Inverno/Winter",
			items: [42201000, 41200000, 40202000, 11273000, 10261000, 43200000, 97000, 905000, 191000, 667000, 2539000]
		}, {
		name: "Fantasma de Natal/Ghost of Christmas",
			items: [42250000, 41250000, 11320000, 40250000, 10350000, 43250000, 45048000, 958000, 44074000, 48010000, 2684000]
		}, {
		name: "Natal 2015",
			items: [384000, 389000, 394000, 430000, 562000, 673000]
		}, {
		name: "Nobre/Nobleman",
			items: [42248000, 41248000, 40248000, 11318000, 10348000, 43248000, 45046000, 956000, 44072000, 48007000, 2662000]
		}, {
		name: "Azteca/Aztecan",
			items: [42249000, 41249000, 40249000, 11319000, 10349000, 43249000, 45047000, 957000, 44073000, 48008000, 2663000]
		}, {
		name: "Gordon",
			items: [949000, 970000, 971000, 988000, 1000000, 977000, 980000, 981000, 982000, 978000, 979000]
		}, {
		name: "Skarunyate",
			items: [983000, 984000, 985000, 986000, 987000, 989000, 992000, 993000, 994000, 990000, 991000]
		}, {
		name: "Mariachi/La Catrina",
			items: [42247000, 41247000, 40247000, 11317000, 10347000, 43247000, 45045000, 955000, 44071000, 48006000, 2661000, 42246000, 41246000, 40246000, 11316000, 10346000, 43246000, 45044000, 954000, 44070000, 48005000, 2660000]
		}
	];

	var TW_QuickSearch = new Object();
	TW_QuickSearch.name = "Sets e Outros";
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
			var dlg = new west.gui.Dialog("Sets e Outros", "Não tens nenhum item desse set.");
			dlg.addButton("ok");
			dlg.setIcon(west.gui.Dialog.SYS_WARNING);
			dlg.show();
		}
	}

	$(document).ready(TW_QuickSearch.init);
}));
