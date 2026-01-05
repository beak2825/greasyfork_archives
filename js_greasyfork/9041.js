// ==UserScript==
// @name The West - Selector de buffs
// @namespace HALCON DE ORO
// @description Selector de Tipos de buffs
// @include http://*.the-west.*/game.php*
// @include http*://*.the-west.*/game.php*
// @version 2.13
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/9041/The%20West%20-%20Selector%20de%20buffs.user.js
// @updateURL https://update.greasyfork.org/scripts/9041/The%20West%20-%20Selector%20de%20buffs.meta.js
// ==/UserScript==


(function(func) {
    var script = document.createElement("script");
    script.setAttribute("type", "application/javascript");
    script.textContent = "(" + func.toString() + ")();";
    document.body.appendChild(script);
    document.body.removeChild(script);
}(function() {
    var TW_Widgets = new Object();
    if (!"#tws_selectable_text".length) return;
    $("head").append("<style id=\"tws_selectable_text\">" + "* { -webkit-user-select: text !important; -khtml-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; user-select: text !important; }" + "</style>");




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
        name: "Habilidades",
        items: [1863000, 1864000, 1871000, 1872000, 1873000, 1981000, 1879000, 1982000, 1946000, 1984000, 1988000, 2285000, 2286000, 2287000, 2288000, 2289000, 2525000, 2516000, 2528000, 2529000, 2530000, 2531000]
    }, {
        name: "Batalla",
        items: [1863000, 1864000,1873000,  1946000,1991000, 1990000, 1910000, 1909000, 1900000, 1949000, 2106000, 2107000, 2108000, 2109000, 2110000, 2111000, 2112000, 2113000, 2114000, 2115000, 2119000, 2120000, 2121000, 2122000, 2123000, 2124000, 2125000, 2127000, 2258000, 2259000, 2260000, 2261000, 2269000, 2516000, 2522000 , 2529000, 2530000 ,2525000]
    }, {
        name: "Duelo",
        items: [1863000, 1872000, 1939000, 1946000, 1882000, 1980005, 1938000, 1864000, 1901000, 1908000, 1916000, 1952000, 1981000, 1988000, 1934000, 2128000, 2129000, 2130000, 2268000, 2293000, 2355000,2529000, 12703000, 13703000, 185202000, 2516000, 2391000, 2484000]
    },{
        name: "Aventuras",
        items: [1900000, 2258000, 2259000, 2260000, 2261000,1990000, 1949000, 2119000, 2109000, 2108000, 2106000, 2107000, 2120000 , 1909000, 1910000, 2114000 , 2110000, 2121000, 2112000, 2125000, 2113000, 2123000, 2122000, 2115000, 2124000, 2111000, 2127000, 1991000, 2522000]
    }, {
        name: "Velocidad",
        items: [1934000, 1987000, 1927000, 1926000, 1919000, 1918000, 1952000, 1937000, 1968000, 2135000, 2229000, 2262000, 2263000, 2264000, 2284000, 2292000, 2354000, 12702000, 13702000, 185201000, 2519000]
    }, {
        name: "Energia",
        items: [1890000, 1892000, 1898000, 1943000, 1985000, 1937000, 1928000, 1969000, 1970000, 1971000, 1997000, 2128000 ,2129000 ,2130000, 2235000, 2294000, 2296000, 2356000, 2358000, 2485000, 12704000, 12706000, 13704000, 13706000, 16100000, 185203000, 185205000, 2525000, 2270000, 2272000, 21341000]
    }, {
        name: "Vida",
        items: [1883000, 1892000, 1898000,1946000, 1991000, 1974000, 2116000, 2117000, 2235000, 2253000, 2254000, 2255000, 2256000, 2257000, 2295000, 2296000, 2357000, 2358000, 12705000, 12706000, 13705000, 13706000, 16100000, 185204000, 185205000, 2525000, 2271000, 2272000]
    }, {
        name: "Trabajo",
        items: [1940000, 1981000, 1879000, 1939000, 1891000, 1984000, 1928000, 1934000, 1997000, 1998000, 2100000, 2101000, 2102000, 2103000, 2104000, 2105000, 2118000, 2126000, 2128000, 2129000, 2130000, 2164000,  2268000, 2290000, 2291000, 2353000, 12701000, 13701000, 185200000, 2516000, 2267000, 2391000, 2484000]
    }, {
        name: "Colecciones",
        items: [1868000, 1869000, 1878000, 1887000, 1888000, 1897000, 1905000, 1906000, 1915000, 1923000, 1924000, 1933000, 2227000, 2345000, 2518000, 2521000, 2524000, 2527000]
    },{
        name: "Cajas y cofres",
        items: [2685000,2687000,2688000,2689000,2690000,2694000,2173000, 2174000, 2175000, 2176000, 2187000, 2192000, 2193000, 2194000, 2195000, 2226000, 2297000, 2298000, 2299000, 2300000, 2329000, 2330000, 2331000, 2332000, 2333000, 2334000, 2335000, 2336000, 2337000, 2338000, 2359000, 2360000, 2361000, 2487000, 2488000, 2489000,2536000, 2537000, 2538000,  2490000, 2507000,2540000, 2556000, 2579000, 2580000, 2581000, 2589000, 2602000, 2603000, 2604000, 2605000, 2606000, 2614000, 2615000, 2616000, 2617000,2618000, 2626000, 2627000, 2628000, 2629000, 2630000, 2645000, 2646000, 2647000, 2648000, 2650000, 2673000, 2674000,17002000,17003000, 17008000, 1975000, 17005000, 17001000, 1976000, 17000000, 17006000, 2131000, 2535000, 2534000, 2133000, 17007000, 2379000, 2533000, 2385000, 2382000, 2380000, 2384000, 2381000,2690000, 2689000, 2688000, 2687000, 2490000, 2489000, 2488000, 2487000]
    },{
        name: "Evento activo",
        items: []
    },{
        name: "Otros buff",
        items: [2562000,2561000,2693000,2692000,1838000,21366000, 2137000, 2138000, 2139000, 2172000,2173000, 2174000, 2175000, 2176000, 2187000, 2192000, 2193000, 2194000,2195000, 2297000, 2298000, 2299000, 2300000,  2196000, 2197000, 2198000, 2199000, 2200000, 2201000, 2202000, 2203000, 2204000, 2205000, 2247000, 2248000, 2249000, 2250000, 2251000, 2270000, 2290000,2393000, 2394000, 2395000, 2396000, 2397000, 2465000, 2466000, 2467000, 2468000, 2624000, 2666000, 2665000, 2675000, 2676000, 2677000, 2678000, 2679000, 2680000, 21340000, 21342000, 21343000,2311000, 2312000, 2313000, 2314000, 2315000, 2316000, 2317000, 2318000, 2319000, 2320000, 2321000, 2322000, 2323000, 2324000, 2325000, 2206000, 2207000, 2208000, 2209000, 2210000, 2211000, 2212000, 2213000, 2214000, 2215000, 2216000, 2217000, 2218000, 2219000, 2220000, 2221000, 2222000, 2225000,12700000]
    },
                  ];

                   var TW_QuickSearch = new Object();
                   TW_QuickSearch.name = "Selecciona el tipo de Buff";
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
        var dlg = new west.gui.Dialog("Buscando buffs", "No tienes de este tipo.");
        dlg.addButton("ok");
        dlg.setIcon(west.gui.Dialog.SYS_WARNING);
        dlg.show();
    }
}

$(document).ready(TW_QuickSearch.init);
}));