// ==UserScript==
// @name        The West - Výber posilnení
// @namespace    Surge
// @description Selector de Tipos de buffs
// @include     http://*.the-west.*/game.php*
// @version     2.13
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6939/The%20West%20-%20V%C3%BDber%20posilnen%C3%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/6939/The%20West%20-%20V%C3%BDber%20posilnen%C3%AD.meta.js
// ==/UserScript==


(function(func) {
	var script = document.createElement("script");
	script.setAttribute("type", "application/javascript");
	script.textContent = "(" + func.toString() + ")();";
	document.body.appendChild(script);
	document.body.removeChild(script);
}(function() {
	var TW_Widgets = new Object();

  window.TW_Widgets = {
    script: TheWestApi.register('TW_Widgets', 'The West Posilnenia', '2.15', '3.00', 'HALCON DE ORO', 'https://greasyfork.org/en/scripts/6939-the-west-vyber-posileni'),
    setGui: function () {
        this.script.setGui('<p> Dobré pre čokoľvek, dajte mi vedieť. </p><br />\ Návrhy na zlepšenia sú vítané</a>.\
                ');
    },
    init: function () {
        this.setGui();
    }
};
    
   
 
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
			name: "Schopnosti",
            items: [1863, 1864, 1871, 1872, 1873, 1981, 1879, 1982, 1946, 1984, 1988, 2285, 2286, 2287, 2288, 2289, 2525, 2516, 2528, 2529, 2530, 2531]
        }, {
			name: "Boje",
            items: [1863, 1864,1873,  1946,1991, 1990, 1910, 1909, 1900, 1949, 2106, 2107, 2108, 2109, 2110, 2111, 2112, 2113, 2114, 2115, 2119, 2120, 2121, 2122, 2123, 2124, 2125, 2127, 2258, 2259, 2260, 2261, 2269, 2516, 2522 , 2529, 2530 ,2525]
        }, {
			name: "Duely",
            items: [1863, 1872, 1939, 1946, 1882, 1985, 1938, 1864, 1901, 1908, 1916, 1952, 1981, 1988, 1934, 2128, 2129, 2130, 2268, 2293, 2355,2529, 12703, 13703, 185202, 2516, 2391, 2484]
        },{
			name: "Dobrodružstvá",
            items: [1900, 2258, 2259, 2260, 2261,1990, 1949, 2119, 2109, 2108, 2106, 2107, 2120 , 1909, 1910, 2114 , 2110, 2121, 2112, 2125, 2113, 2123, 2122, 2115, 2124, 2111, 2127, 1991, 2522]
        }, {
			name: "Cestovanie",
            items: [1934, 1987, 1927, 1926, 1919, 1918, 1952, 1937, 1968, 2135, 2229, 2262, 2263, 2264, 2284, 2292, 2354, 12702, 13702, 185201, 2519]
        }, {
			name: "Energia",
            items: [1890, 1892, 1898, 1943, 1985, 1937, 1928, 1969, 1970, 1971, 1997, 2128 ,2129 ,2130, 2235, 2294, 2296, 2356, 2358, 2485, 12704, 12706, 13704, 13706, 16100, 185203, 185205, 2525, 2270, 2272, 21341]
        }, {
			name: "Zdravie",
            items: [1883, 1892, 1898,1946, 1991, 1974, 2116, 2117, 2235, 2253, 2254, 2255, 2256, 2257, 2295, 2296, 2357, 2358, 12705, 12706, 13705, 13706, 16100, 185204, 185205, 2525, 2271, 2272]
		    }, {
			name: "Práca",
            items: [1940, 1981, 1879, 1939, 1891, 1984, 1928, 1934, 1997, 1998, 2100, 2101, 2102, 2103, 2104, 2105, 2118, 2126, 2128, 2129, 2130, 2164,  2268, 2290, 2291, 2353, 12701, 13701, 185200, 2516, 2267, 2391, 2484]
		    }, {
			name: "Kolekcie",
            items: [1868, 1869, 1878, 1887, 1888, 1897, 1905, 1906, 1915, 1923, 1924, 1933, 2227, 2345, 2518, 2521, 2524, 2527]
        },{
			name: "Tašky a truhly",
            items: [2173, 2174, 2175, 2176, 2187, 2192, 2193, 2194, 2195, 2226, 2297, 2298, 2299, 2300, 2329, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337, 2338, 2359, 2360, 2361, 2487, 2488, 2489,2536, 2537, 2538,  2490, 2507,2540, 2556, 2579, 2580, 2581, 2589, 2602, 2603, 2604, 2605, 2606, 2614, 2615, 2616, 2617,2618, 2626, 2627, 2628, 2629, 2630, 2645, 2646, 2647, 2648, 2650, 2673, 2674,   17003, 17008, 1975, 17005, 17001, 1976, 17000, 17006, 2131, 2535, 2534, 2133, 17007, 2379, 2533, 2385, 2382, 2380, 2384, 2381]
        },{
			name: "Aktívne eventy",
            items: [12700]
        },{
			name: "Ostatné",
            items: [1838,21366, 2137, 2138, 2139, 2172,2173, 2174, 2175, 2176, 2187, 2192, 2193, 2194,2195, 2297, 2298, 2299, 2300,  2196, 2197, 2198, 2199, 2200, 2201, 2202, 2203, 2204, 2205, 2247, 2248, 2249, 2250, 2251, 2270, 2290,2393, 2394, 2395, 2396, 2397, 2465, 2466, 2467, 2468, 2624, 2666, 2665, 2675, 2676, 2677, 2678, 2679, 2680, 21340, 21342, 21343,2311, 2312, 2313, 2314, 2315, 2316, 2317, 2318, 2319, 2320, 2321, 2322, 2323, 2324, 2325, 2206, 2207, 2208, 2209, 2210, 2211, 2212, 2213, 2214, 2215, 2216, 2217, 2218, 2219, 2220, 2221, 2222, 2225,12700]
        },
    ];

    var TW_QuickSearch = new Object();
    TW_QuickSearch.name = "Vyberte typ posilnenia";
    TW_QuickSearch.gui = {};
    TW_QuickSearch.gui.popupMenu = null;

    TW_QuickSearch.init = function() {
		TW_QuickSearch.gui.menuButton = new TW_Widgets.MenuButton(
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAaCAYAAABCfffNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAOWSURBVEhLjVZbSFRBGP52V3PVSLuom0EWXsoIwSLQaiEpqOglrZfqwYcIJaQb0oMRIT1IoWJFUEQQJFmB2VtbaUYPEfYgkYVQZJblJRTdvJzV3JrrOTPnnMUGZs+Zf77/+y/z/2fWk5/q/+v3QwzzRQpiPw0XFTcZgXmYEYGXGNOkZZ2L7CR0bfdLlRkGU2FGqH4srGWYIFwC9dsNkTWl9lOwwHvp06lLIVKqxEk8g5yxMszgukOewkAqi4SPNLQ8OY91gZSFzwRRzIQnEB79gc5HIVxpfo9IDC3dCPWSjIT0Vbh87QSCBWtMtemhdyjf24iBJQkoCRahoqoMWYFUsR/Fz+4OHK28h+HZKMuBer5ezTg9aDIj4VG0veq1+TXP1pFwBKHWpzi4pwF9o1MC40Vm4U40nCtha2lAPpkRlkYShXYKcT6X4DnGTxyZ93zDm+4vCsaLvF3bsEWRSD4vJTdomoiiLBS2dhuicsbF/tvPQxoqLikRydxfPs04BTmP0yKPdzMi+kZ6uCknTUMZo+MYkBQCRCl5upQaZtHYm5DIPPBhkaCk+0szNmBXcb5iJILXLSH0CD6WVjYNasQ6Jk7O13PgBy0HrfNZspeSvhxlxw7g/oMqBJITiDSK8GAvrp+qQ/Xtd5rDTJdweopJn8gzYSZoAZCNoopDaKzc45Y0RWagpyOE+ksd6Po+omVA8lBOkS6lv9UzUuhmSJ8cKSxHye7TqKm9i/7hcZaMjTv3486zJnS2nUQwI8nVKS9NznwiTw1958lyVhdPFzAxMobQ43aU7jiDrt5BQepDxvqtqG+tRtEi3no0G5KPSXwzPvZR04dbn0hPKHYKV291ap+S+ORsHK8JmjRWn2h+x+gPU82KlYo+vviKSZtrK9dmOlKmVBcLUgCUmjZVSEpVHwjET+ttmibROawSlgfPs+gKdmfgFMsKViMlSXYPRw729bOnjJk+2X1imlDviz9OevNTTjQNYxYVlUEsVmBzk5/QdOElawN1suqSlmUwCekrULo9R7OSFMjG4b1Z1C/kbc7FzeZa7CvONTG/h3pw9mAdXkeiDu/IfcKvXz4yyKV18T8vrXlMjv3CyEAf2h8+x43WDy6Fz1nJHQ9ixGpGZ5KcEr3cFz5L6z5RuPRCdRrhLslp27fbJGsWiRqH2fH0hSnQH7127TzmrltQZNNTKP4SMX8IiF8pUk3X0lYxsmQaFE7SAP4BJhw5CoKWF5MAAAAASUVORK5CYII=",
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
            var dlg = new west.gui.Dialog("Hľadám posilnenie", "Nemáte tento typ.");
            dlg.addButton("ok");
            dlg.setIcon(west.gui.Dialog.SYS_WARNING);
            dlg.show();
        }
    }

	$(document).ready(TW_QuickSearch.init);
}));