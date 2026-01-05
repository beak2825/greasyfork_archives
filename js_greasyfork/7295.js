// ==UserScript==
// @name        The West - Set
// @namespace   http://userscripts.org/users/501971
// @author 	    [Italiano] – tw81 , [En] jojok, [Sp] pepe100
// @description Show Sets Owned - Muestra Conjuntos que se poseen
// @include     http://*.the-west.*/game.php*
// @include     http://*.public.beta.the-west.net/game.php*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7295/The%20West%20-%20Set.user.js
// @updateURL https://update.greasyfork.org/scripts/7295/The%20West%20-%20Set.meta.js
// ==/UserScript==

(function(func) {
	var script = document.createElement("script");
	script.setAttribute("type", "application/javascript");
	script.textContent = "(" + func.toString() + ")();";
	document.body.appendChild(script);
	document.body.removeChild(script);
}(function() {
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
			
			name:"1.-Conjuntos Principales"
		}, {	
			name:"1.1-Básicos"
		}, {	
			name:"1.1.1.-Mexicano",
			items:[254,312,428,561,792,10054,600,903]
		}, {	
			name:"1.1.2.-Caballero",
			items:[235,354,427,537,1715,10075,11077,664]
		}, {
			name:"1.1.3.-Granjero",
			items:[219,321,409,41045,797,10025,11005]
		}, {	
			name:"1.1.4.-Indio",
			items:[253,369,429,512,10094,11137,602,96,904]
		}, {	
			name:"1.1.5.-Matasanos",
			items:[224,340,435,527,794,10085,11085,854,44020]
		}, {	
			name:"1.1.6.-Peregrino",
			items:[257,373,432,529,768,10219,11034]
		}, {	
			name:"1.1.7.-Peregrina",
			items:[256,372,431,528,723,10218,11035]
		}, {	
			name:"1.1.8.-Bailarina",
			items:[259,368,433,566,1772,10149,11138,665]
		}, {	
			name:"1.1.9.-Pradera",
			items:[42025,40067,499,41037,10210,11199]
		}, {	
			name:"1.1.10.-Confederado",
			items:[42026,40068,43000,41038,10211,11200]
		}, {	
			name:"1.1.11.-Sin nombre",
			items:[42027,40069,43001,41039,10212,11201]
		}, {	
			name:"1.2.-Coleccionables en Aventuras"
		}, {	
			name:"1.2.1.-Novato",
			items:[262,40000,438,569,10148,11118,607,52,859]
		}, {
			name:"1.2.2.-Festivo",
			items:[258,40200,437,567,1759,10181,609,856,137]
		}, {	
			name:"1.2.3.-Bombero",
			items:[1762]
		}, {	
			name:"1.2.4.-Oro",
			items:[50,858,136]
		}, {	
			name:"1.3.-Coleccionista",
			items:[264,40002,439,575,2409,10150,11130,611,58,863,140]
		}, {	
			name:"1.4.-Dormilón",
			items:[261,375,436,41203,1717,11207,47,132]
		}, {	
			name:"1.5.-Feriante",
			items:[294,40035,469,41007,2223,10179,11169,642]
		}, {	
			name:"1.6.-Famosa",
			items:[42007,40048,481,41019,10192,11181]
		}, {	
			name:"1.7.-Forajido",
			items:[42240,40240,43240,41240,10340,11310,696,45040,950,44060,2640]
		}, {	
			name:"2.-Conjuntos Temporales"
		}, {	
			name:"2.1.1.-Conejo Pascua",
			items:[265,40003,440,11140,63]
		}, {	
			name:"2.2.1.-Mago del Bosque",
			items:[185152,185149,185150,185151,185148,185147]
		}, {	
			name:"2.3.1.-Walker",
			items:[279,40019,454,592,10164,11154,154]
		}, {	
			name:"2.4.1.-Cupido",
			items:[290,40030,465,41003,10175,11165,637,887,165]
		}, {	
			name:"2.5.1.-Fiesta (5º Aniversario)",
			items:[295,40036,470,41008,10180,11170]
		}, {	
			name:"2.6.1.-Desfile Christopher",
			items:[42008,40049,482,41020,10193,11182]
		}, {	
			name:"2.7.1.-Trasnporte heno 8 horas",
			items:[,40062,2352]
		}, {	
			name:"2.8.1.-Halloween",
			items:[42032,40074,43006,41044,10217,11206]
		}, {	
			name:"2.9.1.-San Patricio",
			items:[42206,40207,43205,41207,2577,10304,11278,684,45019,933,44033]
		}, {	
			name:"2.10.1.-Reportero TW",
			items:[,40031,41206,185145,185146]
		}, {	
			name:"2.10.2.-Llanero Solitario",
			items:[687]
		}, {	
			name:"3.-Conjuntos Tómbolas"
		}, {	
			name:"3.1.-Navidad  2012"
		}, {	
			name:"3.1.1.-Natty Bumppo",
			items:[277,40017,452,590,10162,11152,68,879,152]
		}, {	
			name:"3.1.2.-Allan Quatermain",
			items:[278,40018,453,591,10163,11153,,69,880,153]
		}, {	
			name:"3.1.3.-Chingachgook",
			items:[276,40016,451,589,10161,11151,67,878,151]
		}, {	
			name:"3.2.-Pascua 2013"
		}, {	
			name:"3.2.1.-Freeman",
			items:[291,40032,466,41004,10176,11166,638,2189]
		}, {	
			name:"3.2.2.-Doc",
			items:[292,40033,467,41005,10177,11167,639,2190]
		}, {
			name:"3.2.3.-Cartwright",
			items:[293,40034,468,41006,10178,11168,640,2191]
		}, {	
			name:"3.3.-Independencia 2013"
		}, {	
			name:"3.3.1.-Will Munny",
			items:[42016,40057,490,41028,10201,11190,87,895,183]
		}, {	
			name:"3.3.2.-Jeremiah Johnson",
			items:[42017,40058,491,41029,10202,11191,88,896,184]
		}, {	
			name:"3.3.3.-Elfego Baca",
			items:[42018,40059,492,41030,10203,11192,89,897,185]
		}, {	
			name:"3.3.4.-Día Independencia",
			items:[42020,40061,494,41032,2301,10205,11193,661]
		}, {	
			name:"3.3.5.-Armas Fuego y Hielo",
			items:[90,898,186]
		}, {	
			name:"3.4.-Oktoberfest 2013"
		}, {	
			name:"3.4.1.-Frank Eaton",
			items:[42021,40063,495,41033,10206,11195,91,899,187]
		}, {	
			name:"3.4.2.-George McJunkin",
			items:[42022,40064,496,41034,10207,11196,92,900,188]
		}, {	
			name:"3.4.3.-King Fisher",
			items:[42023,40065,497,41035,10208,11197,93,901,189]
		}, {	
			name:"3.4.4.-Tradicional Baviera",
			items:[42024,40066,498,41036,2363,10209,11198,663]
		}, {	
			name:"3.4.5.-Armas Rayos y Truenos",
			items:[94,902,190]
		}, {	
			name:"3.5.-Navidad 2013"
		}, {	
			name:"3.5.1.-Invierno",
			items:[42201,40202,43200,41200,2539,10261,11273,667,97,905,191]
		}, {	
			name:"3.6.-San Valentín 2014"
		}, {	
			name:"3.6.1.-Enamorados",
			items:[42205,40206,43204,41205,10303,11277]
		}, {	
			name:"3.6.2.-San Valentín",
			items:[42204,40205,43203,41204,2555,10302,11276,682,45018,932,44032]
		}, {	
			name:"3.7.-Pascua 2014"
		}, {	
			name:"3.7.1.-Pat Desmond",
			items:[42209,40210,43208,41210,10307,11281,45022,936,44036]
		}, {	
			name:"3.7.2.-Cullen Baker",
			items:[42207,40208,43206,41208,10305,11279,45020,934,44034]
		}, {	
			name:"3.7.3.-Bass Reeve",
			items:[42208,40209,43207,41209,10306,11280,45021,935,44035,]
		}, {	
			name:"3.7.4.-Pascua",
			items:[42210,40211,43209,41211,2583,10308,11282,685,45023,937,44037]
		}, {	
			name:"3.7.5.-Armas Vapor y Madera Podrida",
			items:[45024,938,44038]
		}, {	
			name:"3.8.-Independencia 2014"
		}, {	
			name:"3.8.1.-Black Bart",
			items:[42225,40230,43225,41225,10325,11300,691,2610]
		}, {	
			name:"3.8.2.-Bob Dalton",
			items:[42226,40231,43226,41226,10326,11301,692,2611]
		}, {	
			name:"3.8.3.-Jesse Chisholm",
			items:[42227,40232,43227,41227,10327,11302,693,2612]
		}, {	
			name:"3.8.4.-Thomas Jefferson",
			items:[42228,40233,43228,41228,2613,10328,11303,694,45031,940,44051]
		}, {	
			name:"3.8.5.-Armas Nihon no Buki",
			items:[45032,941,44052]
		}, {	
			name:"3.9.-Oktoberfest 2014"
		}, {	
			name:"3.9.1.-Bill Doolin",
			items:[42241,40241,43241,41241,10341,11311,48000,2641]
		}, {	
			name:"3.9.2.-Deadwood Dick",
			items:[42242,40242,43242,41242,10342,11312,48001,2642]
		}, {	
			name:"3.9.3.-Frank James",
			items:[42243,40243,43243,41243,10343,11313,48002,2643]
		}, {	
			name:"3.9.4.-Ludwig Oktoberfest",
			items:[42244,40244,43244,41244,2644,10344,11314,48003,45041,951,44061]
		}, {	
			name:"3.9.5.-Armas Manitú",
			items:[45042,952,44062]
		}, {	
			name:"3.10.-Día Muertos 2014"
		}, {	
			name:"3.10.1.-Noble",
			items:[42248,40248,43248,41248,10348,11318,48007,45046,956,44072,2662]
		}, {	
			name:"3.10.2.-Azteca",
			items:[42249,40249,43249,41249,10349,11319,48008,45047,957,44073,2663]
		}, {	
			name:"3.10.3.-Catrina",
			items:[42246,40246,43246,41246,10346,11316,48005,45044,954,44070,2660]
		}, {	
			name:"3.10.4.-Mariachi",
			items:[42247,40247,43247,41247,10347,11317,48006,45045,955,44071,2661]
		}, {	
			name:"3.11.-Navidad 2014"
		}, {	
			name:"3.11.1.-Espíritu de la Navidad",
			items:[42250,40250,43250,41250,2684,10350,11320,48010,45048,958,44074]
		}, {	
			name:"4.-Conjuntos Personaje"
		}, {	
			name:"4.1.-Aventurero",
			items:[42028,40070,43002,41040,10213,11202]
		}, {	
			name:"4.2.-Duelista",
			items:[42029,40071,43003,41041,10214,11203]
		}, {	
			name:"4.3.-Trabajador",
			items:[42030,40072,43004,41042,10215,11204]
		}, {	
			name:"4.4.- Soldado",
			items:[42031,40073,43005,41043,10216,11205]
		}, {	
			name:"5.-Conjuntos Individuales"
		}, {	
			name:"5.1.-Personalizado",
			items:[,]
		}, {	
			name:"5.2.-Black Friday",
			items:[42200,40201,10260]
		}, {	
			name:"5.3.-Fútbol",
			items:[,40220,43220,41220,2600,10320]
		}, {	
			name:"5.4.-Verano",
			items:[42230,40235,43230,41230,10330]
		}, {	
			name:"5.5.-Speedy Gonzales",
			items:[42245,40245,43245,41245,10345,11315,48004,45043,953,44063,2649]
        },
                   
    ];

    var TW_QuickSearch = new Object();
    TW_QuickSearch.name = "Conjuntos";
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
            TW_QuickSearch.gui.popupMenu = new west.gui.Selectbox().setWidth(200);
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
            var dlg = new west.gui.Dialog("Buscar Conjunto", "No Encontrado !!");
            dlg.addButton("ok");
            dlg.setIcon(west.gui.Dialog.SYS_WARNING);
            dlg.show();
        }
    }

	$(document).ready(TW_QuickSearch.init);
}));