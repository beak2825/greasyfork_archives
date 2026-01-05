// ==UserScript==
// @name The West - Selector de Buffs
// @namespace HALCON DE ORO
// @author HALCON DE ORO
// @description Encontrar Buff rapidamente
// @include https://*.the-west.*/game.php*
// @version 5.0
// @downloadURL https://update.greasyfork.org/scripts/6314/The%20West%20-%20Selector%20de%20Buffs.user.js
// @updateURL https://update.greasyfork.org/scripts/6314/The%20West%20-%20Selector%20de%20Buffs.meta.js
// ==/UserScript==
// translation:Tom Robert(Ingles, Aleman y frances),HALCON DE ORO(Español),pantomas(Polish),tw81(Italiano),gamer(Portugues),Surge(Eslovaco),ruud99(Holandes)
(function (func) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + func.toString() + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})(function () {

    BUSCADOR = {
        version: '4.2.1',
        name: 'Selector de buffs',
        author: 'neversleep1911 (Actualizacion de HALCON DE ORO)',
        minGame: '2.01',
        maxGame: Game.version.toString(),
        website: 'https://greasyfork.org/es/scripts/6314',
        updateUrl:'http://yourjavascript.com/701360421110/buff.js',
        updateAd: 'https://greasyfork.org/es/scripts/6314-the-west-selector-de-buffs',
        buff: [],
        langs: {
            en: {
                language: 'English',
                adventure: '*Adventures',
                work: '*Work',
                duel: '*Duels',
                energy: '*Energy',
                skill: '*Skill points',
                fortbattle: '*Fort battles',
                speed: '*Speed',
                health: '*Health points',
                motivationjob: '*Motivation',
				motivationduel: 'Motivación de duelo',
                experience: '*Experience',
                special: '*Premium/special',
                events: '*Events',
                chests: '*Open & unpack',
                nothingFound: 'No items of this type found!',
            },
            de: {
                language: 'Deutsch',
                adventure: '*Abenteuer',
                work: '*Arbeit',
                duel: '*Duell',
                energy: '*Erholung',
                skill: '*Fertigkeiten',
                fortbattle: '*Fortkampf',
                speed: '*Geschwindigkeit',
                health: '*Lebenspunkte',
                motivation: '*Motivation',
                experience: '*Erfahrung',
                special: '*Premium/Special',
                events: '*Events',
                chests: '*Öffnen & Auspacken',
                nothingFound: 'Keine Gegenstände dieser Art gefunden!',
            },
            es: {
                language: 'Español',
               adventure: 'Aventuras',
                work: 'Puntos de trabajo',
                duel: 'Duelo',
                energy: 'Energía',
                skill: 'Habilidades',
                fortbattle: 'Batalla',
                speed: 'Velocidad',
                health: 'Salud',
                motivationjob: 'Motivación de trabajo',
				motivationduel: 'Motivación de duelo',
                experience: 'Experience',
                special: 'Premio/especial',
                events: 'Eventos',
                chests: 'Cajas y cofres',
                nothingFound: '¡No tienes de este tipo!',
            },
            pl: {
                language: 'Polish (polski)',
                adventure: '*Przygody',
                work: '*Prace',
                duel: '*Pojedynki',
                energy: '*Energia',
                skill: '*Umiejętności',
                fortbattle: '*Bitwy fortowe',
                speed: '*Prędkość',
                health: '*HP',
                motivationjob: 'Motivación de trabajo',
				motivationduel: 'Motivación de duelo',
                experience: '*Experience',
                special: '*Premia/specjalny',
                events: '*Eventy',
                chests: '*Przedmioty - Skrzynie',
                nothingFound: 'Nie posiadasz żadnych przedmiotów tego typu!',
            },
            it: {
                language: 'italiano',
                adventure: '*Avventure',
                work: '*Bonus Lavoro',
                duel: '*Bonus Duello',
                energy: '*Bonus Energia',
                skill: '*Bonus Abilità',
                fortbattle: '*Bonus Forte',
                speed: '*Bonus Velocità',
                health: '*Bonus Punti Vita',
                motivationjob: 'Motivación de trabajo',
				motivationduel: 'Motivación de duelo',
                experience: '*Experience',
                special: '*Premio/speciale',
                events: '*Eventi',
                chests: '*Aprire e decomprimere',
                nothingFound: 'Non è stato trovato nulla!',
            },
            pt: {
                language: 'português',
                adventure: '*Aventuras',
                work: '*Buffs Trabalho',
                duel: '*Buffs Duelo',
                energy: '*Buffs Energia',
                skill: '*Buffs Habilidade',
                fortbattle: '*Buffs Batalha',
                speed: '*Buffs Velocidade',
                health: '*Buffs Saúde',
                motivationjob: 'Motivación de trabajo',
				motivationduel: 'Motivación de duelo',
                experience: '*Experiência',
                special: '*Prêmio/especial',
                events: '*Eventos',
                chests: '*Abrir e desempacotar',
                nothingFound: 'Nenhum item deste tipo encontrado!',
            },
            fr: {
                language: 'français',
                adventure: '*Aventures',
                work: '*Travail',
                duel: '*Duels',
                energy: '*Bonus de repos',
                skill: '*Aptitudes',
                fortbattle: '*Fort bataille',
                speed: '*Vitesse',
                health: '*Points de vie bonus',
                motivationjob: 'Motivación de trabajo',
				motivationduel: 'Motivación de duelo',
                experience: '*Experience',
                special: '*Prime/spéciale',
                events: '*Événements',
                chests: '*Ouvrir et déballer',
                nothingFound: 'Pas d\'objets de cette sorte trouvé!',
            },
            sk: {
                language: 'slovenčina',
                adventure: '*Dobrodružstvá',
                work: '*Práca',
                duel: '*Duely',
                energy: '*Energia',
                skill: '*Schopnosti',
                fortbattle: '*Boje',
                speed: '*Cestovanie',
                health: '*Zdravie',
                motivationjob: 'Motivación de trabajo',
				motivationduel: 'Motivación de duelo',
                experience: '*Experience',
                special: '*Prémia/špeciálne',
                events: '*Eventy',
                chests: '*Tašky a truhly',
                nothingFound: 'Nemáte tento typ!',
            },
            nl: {
                language: 'Nederlands',
                adventure: '*Avontuur',
                work: '*Werkzaamheid',
                duel: '*Duels',
                energy: '*Actiepunten',
                skill: '*Vaardigheden',
                fortbattle: '*Fort gevechten',
                speed: '*Snelheid',
                health: '*Levenspunten',
                motivationjob: 'Motivación de trabajo',
				motivationduel: 'Motivación de duelo',
                experience: '*Experience',
                special: '*Premium/speciaal',
                events: '*Events',
                chests: '*Openen',
                nothingFound: 'Er kon geen voorwerp van dit type worden!',
            },
        },
        updateLang: function () {
            var lg = BUSCADOR.langs;
            BUSCADOR.lang = lg[localStorage.getItem('scriptsLang')] ? localStorage.getItem('scriptsLang') : lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : 'en';
            BUSCADORlang = lg[BUSCADOR.lang];
        },
    };
  
 TheWestApi.register('BUSCADOR', BUSCADOR.name, BUSCADOR.minGame, BUSCADOR.maxGame, BUSCADOR.author, BUSCADOR.website).setGui('<br>' +'</a><br><br><i>' + BUSCADOR.name +'<br>'+ ' v' + BUSCADOR.version + '</i>');;
  
  
//Cambio en la interfaz para que entren mas scripts.

  
  $('div#ui_bottomright').css({
            'right': '55px'
          });
/*  
  $('div#ui_right').css({
            'right': '35px'
          });
  $('#westforts_link_div').css({
            'right': '40px'
          });
  $('div#ui_menubar').css({
            'bottom': '110px'
          });
  $('div#buffbars').css({
            'right': '35px'
          });
*/  
  
  
    BUSCADOR.updateLang();
    var langBox = new west.gui.Combobox();
    for (var j in BUSCADOR.langs)
        langBox.addItem(j, BUSCADOR.langs[j].language);
    langBox.select(BUSCADOR.lang);
    var saveBtn = new west.gui.Button(BUSCADORlang.save, function () {
        localStorage.setItem('scriptsLang', langBox.getValue());
        BUSCADOR.updateLang();
    });

    BUSCADOR.MenuButton = function (image, title, onclick) {
        var self = this;
        this.isHovered = false;
        this.onClick = onclick;
        var clicked = function (e) {
            if (self.onClick) {
                self.onClick(self, e);
            }
        };
        var repaint = function () {
            var x = !self.isHovered ? 0 :  - 25;
            self.obj.css('background-position', x + 'px 0px');
        };
        var mouseIn = function () {
            repaint();
        };
        var mouseOut = function () {
            repaint();
        };
        this.obj = $('<div class=\'menulink\' title=\'' + title + '\' />').css('background-image', 'url(' + image + ')');
        this.obj.hover(mouseIn, mouseOut);
        this.obj.click(clicked);
        $('div#ui_menubar').append($('<div class=\'ui_menucontainer\' />').append(this.obj).append('<div class=\'menucontainer_bottom\' />'));
    };
    BUSCADOR.start = function () {
        var buff = west.storage.ItemSetManager._setList;
        BUSCADOR.buff = [{
            name: BUSCADORlang.adventure,
            img: 2618,
            items: [
                1909, 1910, 1991, 2110, 2111, 2112, 2113, 2114, 2115, 2121, 2122, 2741, 50480, 50481, 51126,
            ]
        }, {
            name: BUSCADORlang.work,
            img: 1879,
            items: [
                1879, 1940, 1982, 1988, 1998, 2100, 2101, 2102, 2103, 2104, 2105, 2118, 2126, 2164, 2206, 2207, 2208, 2209, 2210, 2211, 2212, 2213, 2214, 2215, 2216, 2217, 2218, 2219, 2220, 2221, 2222, 2225, 2285, 2286, 2287, 2288, 2289, 2290, 2313, 2317, 2321, 2325, 2466, 2491, 2493, 2495, 2497, 2516, 2525, 2528, 2531, 2732, 2738, 21342, 50205, 50303, 50766, 50767, 50770, 50768, 50769,50771, 50772, 50773, 50774, 50775, 50776, 50777, 50778, 50780, 50781, 50782, 50783, 50790,50845,50846, 253800,
            ]
        }, {
            name: BUSCADORlang.duel,
            img: 842,
            items: [
                1863, 1864, 1871, 1872, 1901, 1908, 1916, 1938, 1946, 1981, 1984, 2285, 2286, 2287, 2288, 2289, 2529, 2695, 50135, 50136, 51125,
            ]
        }, {
            name: BUSCADORlang.energy,
            img: 1890,
            items: [
                255, 1890, 1892, 1898, 1928, 1937, 1943, 1969, 1970, 1971, 1985, 1997, 2128, 2129, 2130, 2235, 2294, 2296, 2312, 2316, 2320, 2324, 2356, 2358, 2485, 2486, 2491, 2493, 2495, 2497, 2525, 2670, 2672, 12704, 12706, 13704, 13706, 16100, 17028, 21341, 21345, 50113, 50390, 50627, 50846, 51039, 185203, 185205,
            ]
        }, {
            name: BUSCADORlang.skill,
            img: 1977,
            items: [
                1863, 1864, 1871, 1872, 1873, 1879, 1946, 1977, 1978, 1979, 1981, 1982, 1984, 1988, 2285, 2286, 2287, 2288, 2289, 2516, 2525, 2528, 2529, 2530, 2531, 2738, 50482, 50483, 50484, 50485, 50486, 50487, 50770, 50771, 50772, 50774, 50775, 50776, 50778, 50779, 50780, 51125, 253800,
            ]
        }, {
            name: BUSCADORlang.fortbattle,
            img: 758,
            items: [
                21340,1872, 1873, 1900, 1909, 1910, 1946, 1949, 1990, 1991, 2106, 2107, 2108, 2109, 2110, 2111, 2112, 2113, 2114, 2115, 2119, 2120, 2121, 2122, 2123, 2124, 2125, 2127, 2258, 2259, 2260, 2261, 2269, 2285, 2286, 2287, 2288, 2289, 2516, 2522, 2525, 2529, 2530, 2741, 50480, 50481, 50482, 50483, 50484, 50485, 50486, 50487, 51126,
            ]
        }, {
            name: BUSCADORlang.speed,
            img: 672,
            items: [
                1918, 1919, 1926, 1927, 1934, 1937, 1952, 1968, 1987, 2135, 2229, 2262, 2263, 2264, 2284, 2292, 2354, 2470, 2473, 2476, 2479, 2491, 2493, 2495, 2497, 2519, 2668, 2734, 12702, 13702, 50304, 50793, 50794, 50795, 50796, 185201,
            ]
        }, {
            name: BUSCADORlang.health,
            img: 2117,
            items: [
                1883, 1892, 1898, 1946, 1974, 1991, 2116, 2117, 2235, 2253, 2254, 2255, 2256, 2257, 2295, 2296, 2357, 2358, 2486, 2525, 2671, 2672, 2734, 12705, 12706, 13705, 13706, 16100, 17028, 50113,50845, 185204, 185205, 51038, 
            ]
        },{
            name: BUSCADORlang.motivationjob,
            img: 1891,
            items: [
                255, 1891, 1928, 1934, 1939, 1981, 1984, 1997, 2128, 2129, 2130, 2268, 2291, 2353, 2391, 2484, 2516, 2667, 2706, 2707, 12701, 13701, 13703, 17028, 50113, 50627, 185200, 51039, 
            ]
        },{
            name: BUSCADORlang.motivationduel,
            img: 1882,
            items: [
                 1882, 1934, 1939, 1952, 1985, 1988, 2128, 2129, 2130, 2268, 2293, 2355, 2391, 2484, 2516, 2669, 2734, 12703, 13703, 17028, 50113, 50135, 50136, 51039, 50958, 185202, 
            ]
        },{
            name: BUSCADORlang.special,
            img: 21342,
            items: [
                2201, 2202, 2203, 2204, 2205, 2247, 2248, 2249, 2250, 2251, 2270, 2290, 2314, 2318, 2322, 2326, 2421, 2465, 2468, 2472, 2475, 2478, 2481, 2491, 2493, 2495, 2497, 2559, 2560, 2738, 21343,2196, 2197, 2198, 2199, 2200, 2467, 2576, 2732, 50113,1977, 1978, 1979, 2311, 2312, 2313, 2314, 2315, 2316, 2317, 2318, 2319, 2320, 2321, 2322, 2323, 2324, 2325, 2326, 2470, 2472, 2473, 2475, 2476, 2478, 2479, 2481, 2482, 2484, 2485, 2486, 2491, 2493, 2495, 2497, 2695, 21340, 21341, 21342, 21343,50760, 50766, 50767, 50768,50773, 50784, 50785, 50786, 50787, 50788, 50789, 50790, 50791,   50792, 50845, 50846, 50991, 51038, 51039, 51059, 51127,
            ]
        }, {
            name: BUSCADORlang.events,
            img: 2564,
            items: [
                50691, 55, 371, 973, 974, 975, 976, 2557, 2558, 2561, 2562, 2563, 2564, 2565, 2566, 2567, 2590, 2591, 2592, 2593, 2594, 2619, 2620, 2621, 2622, 2623, 2665, 2666, 2675, 2676, 2677, 2678, 2679, 2680, 2692, 2693, 2698, 12700, 50855, 51059,
            ]
        }, {
            name: BUSCADORlang.chests,
            img: 17002,
            items: [
                  50684, 50685, 50686, 50687, 50688, 50689, 50690, 50696, 50697, 50698, 50699, 50680, 50258, 50681, 50682, 2460, 2618, 50683, 50677, 50675, 50700, 50700, 50676, 371 , 374, 376, 377, 378, 379, 852, 853, 926, 927, 928, 973, 974, 975, 976, 1003, 1838, 1868, 1869, 1878, 1887, 1888, 1897, 1905, 1906, 1915, 1923, 1924, 1933, 1960, 1961, 1964, 1967, 1975, 1976, 2131, 2132, 2133, 2134, 2136, 2137, 2138, 2139, 2144, 2152, 2172, 2173, 2174, 2175, 2176, 2187, 2192, 2193, 2194, 2195, 2196, 2197, 2198, 2199, 2200, 2201, 2202, 2203, 2204, 2205, 2226, 2227, 2297, 2298, 2299, 2300, 2305, 2329, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337, 2338, 2345, 2359, 2360, 2361, 2362, 2379, 2380, 2381, 2382, 2383, 2384, 2385, 2393, 2394, 2395, 2396, 2397, 2421, 2460, 2461, 2462, 2482, 2487, 2488, 2489, 2490, 2499, 2507, 2518, 2521, 2524, 2527, 2533, 2534, 2535, 2536, 2537, 2538, 2540, 2542, 2556, 2557, 2558, 2559, 2560, 2561, 2562, 2563, 2564, 2565, 2566, 2567, 2579, 2580, 2581, 2585, 2586, 2587, 2588, 2589, 2590, 2591, 2592, 2593, 2594, 2602, 2603, 2604, 2605, 2606, 2614, 2615, 2616, 2617, 2618, 2619, 2620, 2621, 2622, 2623, 2624, 2626, 2627, 2628, 2629, 2630, 2645, 2646, 2647, 2648, 2650, 2665, 2666, 2673, 2674, 2675, 2676, 2677, 2678, 2679, 2680, 2685, 2687, 2688, 2689, 2690, 2692, 2693, 2694, 2698, 2699, 2700, 2701, 2702, 2703, 2704, 2705, 2714, 2715, 2721, 2722, 2723, 2728, 2755, 12700, 12709, 12710, 12711, 13711, 17000, 17001, 17002, 17003, 17004, 17005, 17006, 17007, 17008, 50001, 50002, 50003, 50009, 50023, 50025, 50080, 50081, 50082, 50093, 50105, 50128, 50130, 50131, 50132, 50133, 50134, 50168, 50169, 50170, 50171, 50177, 50195, 50251, 50252, 50253, 50254, 50255, 50256, 50257, 50258, 50259, 50295, 50296, 50297, 50298, 50299, 50300, 50301, 50302, 50305, 50346, 50347, 50348, 50368, 50381, 50382, 50383, 50384, 50385, 50386, 50387, 50388, 50391, 50409, 50423, 50424, 50425, 50426, 50427, 50428, 50442, 50446, 50456, 50477, 50478, 50479, 50488, 50501, 50509, 50540, 50545, 50547, 50556, 50557, 50558, 50559, 50560, 50570, 50579, 50588, 50603, 50604, 50605, 50606, 50607, 50608, 50675, 50676 ,50677, 50678, 50679, 50680, 50681, 50682, 50683, 50700, 50712, 50724 ,50736, 50748, 50760, 50819, 50820, 50835, 50855, 50880, 50989, 50990, 50992, 51004, 51013, 51015, 51040, 51041, 51042, 51043, 51044, 51059, 51066, 51067, 51068, 51075, 51089, 51098, 51107, 51122,    
            ]
        }, 
                        ];
        var qs = BUSCADOR.buff;
        var i = qs.length;
        while (i--) {
            var si = qs[i];
            if (!si.name)
                qs.splice(i, 1);
            else if (si.name.name)
                si.name = si.name.name;
        }
        qs.sort(function (a, b) {
            var a1 = a.name.toUpperCase().replace(/"/g, '').replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Ő/g, 'O').replace(/Ú|Ü|Ű/g, 'U').replace(/Ś/g, 'S');
            var b1 = b.name.toUpperCase().replace(/"/g, '').replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Ő/g, 'O').replace(/Ú|Ü|Ű/g, 'U').replace(/Ś/g, 'S');
            return (a1 == b1) ? 0 : (a1 > b1) ? 1 :  - 1;
        });
    };
    BUSCADOR.gui = {
        popupMenu: null,
    };
    BUSCADOR.init = function () {
        BUSCADOR.gui.menuButton = new BUSCADOR.MenuButton('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAaCAYAAABCfffNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAOWSURBVEhLjVZbSFRBGP52V3PVSLuom0EWXsoIwSLQaiEpqOglrZfqwYcIJaQb0oMRIT1IoWJFUEQQJFmB2VtbaUYPEfYgkYVQZJblJRTdvJzV3JrrOTPnnMUGZs+Zf77/+y/z/2fWk5/q/+v3QwzzRQpiPw0XFTcZgXmYEYGXGNOkZZ2L7CR0bfdLlRkGU2FGqH4srGWYIFwC9dsNkTWl9lOwwHvp06lLIVKqxEk8g5yxMszgukOewkAqi4SPNLQ8OY91gZSFzwRRzIQnEB79gc5HIVxpfo9IDC3dCPWSjIT0Vbh87QSCBWtMtemhdyjf24iBJQkoCRahoqoMWYFUsR/Fz+4OHK28h+HZKMuBer5ezTg9aDIj4VG0veq1+TXP1pFwBKHWpzi4pwF9o1MC40Vm4U40nCtha2lAPpkRlkYShXYKcT6X4DnGTxyZ93zDm+4vCsaLvF3bsEWRSD4vJTdomoiiLBS2dhuicsbF/tvPQxoqLikRydxfPs04BTmP0yKPdzMi+kZ6uCknTUMZo+MYkBQCRCl5upQaZtHYm5DIPPBhkaCk+0szNmBXcb5iJILXLSH0CD6WVjYNasQ6Jk7O13PgBy0HrfNZspeSvhxlxw7g/oMqBJITiDSK8GAvrp+qQ/Xtd5rDTJdweopJn8gzYSZoAZCNoopDaKzc45Y0RWagpyOE+ksd6Po+omVA8lBOkS6lv9UzUuhmSJ8cKSxHye7TqKm9i/7hcZaMjTv3486zJnS2nUQwI8nVKS9NznwiTw1958lyVhdPFzAxMobQ43aU7jiDrt5BQepDxvqtqG+tRtEi3no0G5KPSXwzPvZR04dbn0hPKHYKV291ap+S+ORsHK8JmjRWn2h+x+gPU82KlYo+vviKSZtrK9dmOlKmVBcLUgCUmjZVSEpVHwjET+ttmibROawSlgfPs+gKdmfgFMsKViMlSXYPRw729bOnjJk+2X1imlDviz9OevNTTjQNYxYVlUEsVmBzk5/QdOElawN1suqSlmUwCekrULo9R7OSFMjG4b1Z1C/kbc7FzeZa7CvONTG/h3pw9mAdXkeiDu/IfcKvXz4yyKV18T8vrXlMjv3CyEAf2h8+x43WDy6Fz1nJHQ9ixGpGZ5KcEr3cFz5L6z5RuPRCdRrhLslp27fbJGsWiRqH2fH0hSnQH7127TzmrltQZNNTKP4SMX8IiF8pUk3X0lYxsmQaFE7SAP4BJhw5CoKWF5MAAAAASUVORK5CYII=', BUSCADOR.name, BUSCADOR.popup);
    };
    BUSCADOR.popup = function (button, e) {
        if (!BUSCADOR.gui.popupMenu) {
            BUSCADOR.start();
            BUSCADOR.gui.popupMenu = new west.gui.Selectbox().setWidth(200);
            BUSCADOR.gui.popupMenu.addListener(BUSCADOR.findSet);
            var buff = BUSCADOR.buff;
            for (var i = 0; i < buff.length; i++) {
                var itemimg = buff[i].img || buff[i].itemsk[0];
                var NAME = buff[i].name;
                BUSCADOR.gui.popupMenu.addItem(i, '<img src="' + ItemManager.getByBaseId(itemimg).image + '" height="20" width="25">' + '<div style="padding-right: 20px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">' + NAME + '</div>', NAME);
            }
        }
        BUSCADOR.gui.popupMenu.show(e);
    };
    BUSCADOR.findSet = function (id) {
        var items = [],
            base = BUSCADOR.buff[id].items,
            upgrade = BUSCADOR.buff[id].itemsk,
            custom = false;
        if (base)
            for (var f = 0; f < base.length; f++)
                items.push(base[f] * 1000);
        else {
            for (var g = 0; g < upgrade.length; g++)
                for (var h = 0; h <= 5; h++)
                    items.push(upgrade[g] * 1000 + h);
            custom = true;
        }
        var invItems = Bag.getItemsByItemIds(items);
        if (invItems.length > 0)
            EventHandler.listen('inventory_loaded', function () {
                Wear.open();
               Inventory.showSearchResult(invItems);
                return EventHandler.ONE_TIME_EVENT;
            });
        else
            new UserMessage(BUSCADORlang.nothingFound, 'hint').show();
    };
  
//Para guardar el boton de los scripts en opciones
  $(document).ready(function()
 {
 var newfunction = String(EscapeWindow.open);
 newfunction = 'EscapeWindow.open='+newfunction+';';
 newfunction = newfunction.replace(/\.setSize\(240\,290\)/g, ".setSize(240, 326)");
 newfunction = newfunction.replace(/window\.open\(Game\.forumURL,'wnd'\+\(new Date\)\.getTime\(\)\);/g, "(window.open(Game.forumURL, 'wnd' + new Date).getTime());}],['Script', function() {TheWestApi.open();");
 eval(newfunction);
 window.setTimeout("$('#ui_scripts').css({'display' : 'none'});", 10000);
 });
  
  BUSCADOR.init();
});
