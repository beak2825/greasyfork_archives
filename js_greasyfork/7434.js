// ==UserScript==
// @name The West - Quick items search
// @namespace TomRobert
// @author neversleep1911 (updated by Tom Robert)
// @description Find sets and products quick and easy!
// @include https://*.the-west.*/game.php*
// @exclude https://classic.the-west.net*
// @version 1.6.6
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/7434/The%20West%20-%20Quick%20items%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/7434/The%20West%20-%20Quick%20items%20search.meta.js
// ==/UserScript==
// translation:Tom Robert(English,German&French),HALCON DE ORO/pepe100(Spanish),pantomas(Polish),tw81(Italian),gamer(Portuguese),Surge(Slovak),ruud99(Dutch),Jamza(Slovak&Czech),Timemod Herkumo(Greek)
(function (func) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + func.toString() + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  QIS = {
    version: '1.6.6',
    name: 'Quick items search',
    author: 'neversleep1911 (updated by Tom Robert)',
    minGame: '2.05',
    maxGame: Game.version.toString(),
    website: 'https://greasyfork.org/scripts/7434',
    sets: [],
    equImg: 2188,
    langs: {
      en: {
        language: 'English',
        ApiGui: 'Searching for specific sets or products? Easy job using this script.<br>Just some clicks and the items, which you wanted to find, are showed in your inventory.',
        save: 'Save',
        saveMessage: 'Successfully saved',
        chooseLang: 'Choose language',
        contact: 'Contact',
        adventure: '*Adventures',
        work: '*Work',
        duel: '*Duels',
        energy: '*Energy',
        skill: '*Skill points',
        fk: '*Fort battles',
        speed: '*Speed',
        lp: '*Health points',
        luckNmoney: '*Luck & money',
        motivation: '*Motivation',
        experience: '*Experience',
        special: '*Premium/special',
        events: '*Events',
        chests: '*Open & unpack',
        equipment: '-Equipment',
        products: '-Products',
        questitems: '-Quest items',
        craftitems: '-Craft items',
        recipes: '-Recipes',
        nothingFound: 'No items of this type found!',
      },
      de: {
        language: 'German (Deutsch)',
        ApiGui: 'Schnelles Finden von Setgegenständen und Produkten im Inventar.',
        save: 'Speichern',
        saveMessage: 'Speichern erfolgreich',
        chooseLang: 'Sprache ändern',
        contact: 'Kontakt',
        adventure: '*Abenteuer',
        work: '*Arbeit (AP)',
        duel: '*Duell',
        energy: '*Erholung (EP)',
        skill: '*Fertigkeiten (FP)',
        fk: '*Fortkampf (FK)',
        speed: '*Geschwindigkeit',
        lp: '*Lebenspunkte (LP)',
        luckNmoney: '*Glück & Geld',
        motivation: '*Motivation',
        experience: '*Erfahrung (XP)',
        special: '*Premium/Special',
        events: '*Events',
        chests: '*Öffnen & Auspacken',
        equipment: '-Ausrüstung',
        products: '-Arbeitsprodukte',
        questitems: '-Questprodukte',
        craftitems: '-Handwerk',
        recipes: '-Rezepte',
        nothingFound: 'Keine Gegenstände dieser Art gefunden!',
      },
      es: {
        language: 'Spanish (español)',
        ApiGui: '¿Buscas conjuntos o productos específicos? Tarea fácil usando este script.<br>Unos clics y los artículos, que quieres encontrar, se mostrarán en tu inventario.',
        save: 'Guardar',
        saveMessage: 'Guardado con éxito',
        chooseLang: 'Elige idioma',
        contact: 'Contacto',
        adventure: '*Buffs de Aventuras',
        work: '*Buffs de Trabajo',
        duel: '*Buffs de Duelo',
        energy: '*Buffs Energía',
        skill: '*Buffs de Habilidades',
        fk: '*Buffs de Batalla',
        speed: '*Buffs de Velocidad',
        lp: '*Buffs de Salud',
        luckNmoney: '*Suerte y Dinero',
        motivation: '*Motivación',
        experience: '*Experiencia',
        special: '*Premio/especial',
        events: '*Eventos',
        chests: '*Cajas y cofres',
        equipment: '-Equipo',
        products: '-Productos',
        questitems: '-Objetos de búsqueda',
        craftitems: '-Artesano',
        recipes: '-Recetas',
        nothingFound: 'No tienes de este tipo!',
      },
      pl: {
        language: 'Polish (polski)',
        ApiGui: 'Wyszukiwarka wzmocnień, przedmiotów i zestawy.<br>Skrypt szuka w plecaku zestawy oraz inne przedmioty danego typu.',
        save: 'Zapisz',
        saveMessage: 'Zapisz powodzeniem',
        chooseLang: 'Wybierz język',
        contact: 'Kontakt',
        adventure: '*Przygody',
        work: '*Prace',
        duel: '*Pojedynki',
        energy: '*Energia',
        skill: '*Umiejętności',
        fk: '*Bitwy fortowe',
        speed: '*Prędkość',
        lp: '*HP',
        luckNmoney: '*Luck & money',
        motivation: '*Motivation',
        experience: '*Experience',
        special: '*Premia/specjalny',
        events: '*Eventy',
        chests: '*Przedmioty - Skrzynie',
        equipment: '-Ekwipunek',
        products: '-Produkty',
        questitems: '-Przedmiot zlecenia',
        craftitems: '-Rzemiosło',
        recipes: '-Przepisy',
        nothingFound: 'Nie posiadasz żadnych przedmiotów tego typu!',
      },
      it: {
        language: 'Italian (italiano)',
        ApiGui: 'Searching for specific sets or products? Easy job using this script.<br>Just some clicks and the items, which you wanted to find, are showed in your inventory.',
        save: 'Salvare',
        saveMessage: 'Salva con successo',
        chooseLang: 'Cambia lingua',
        contact: 'Contatto',
        adventure: '*Avventure',
        work: '*Bonus Lavoro',
        duel: '*Bonus Duello',
        energy: '*Bonus Energia',
        skill: '*Bonus Abilità',
        fk: '*Bonus Forte',
        speed: '*Bonus Velocità',
        lp: '*Bonus Punti Vita',
        luckNmoney: '*Luck & money',
        motivation: '*Motivation',
        experience: '*Experience',
        special: '*Premio/speciale',
        events: '*Eventi',
        chests: '*Aprire e decomprimere',
        equipment: '-Attrezzatura',
        products: '-Prodotti',
        questitems: '-Oggetti missione',
        craftitems: '-Produci',
        recipes: '-Ricette',
        nothingFound: 'Non è stato trovato nulla!',
      },
      pt: {
        language: 'Portuguese (português)',
        ApiGui: 'Searching for specific sets or products? Easy job using this script.<br>Just some clicks and the items, which you wanted to find, are showed in your inventory.',
        save: 'Salvar',
        saveMessage: 'Economize com sucesso',
        chooseLang: 'Escolhe idioma',
        contact: 'Contato',
        adventure: '*Aventuras',
        work: '*Buffs Trabalho',
        duel: '*Buffs Duelo',
        energy: '*Buffs Energia',
        skill: '*Buffs Habilidade',
        fk: '*Buffs Batalha',
        speed: '*Buffs Velocidade',
        lp: '*Buffs Saúde',
        luckNmoney: '*Sorte & Dinheiro',
        motivation: '*Motivação',
        experience: '*Experiência',
        special: '*Prêmio/especial',
        events: '*Eventos',
        chests: '*Abrir e desempacotar',
        equipment: '-Equipamento',
        products: '-Produtos',
        questitems: '-Items de aventura',
        craftitems: '-Ofício',
        recipes: '-Receitas',
        nothingFound: 'Nenhum item deste tipo encontrado!',
      },
      fr: {
        language: 'French (français)',
        ApiGui: 'Avec ce script, il est très facile de trouver les sets ou les produits qu\'on cherche.<br>Après qu\'on a cliqué une catégorie, les objets recherchés sont affichés dans l\'inventaire.',
        save: 'Sauvegarder',
        saveMessage: 'Enregistrer avec succès',
        chooseLang: 'Choisissez la langue',
        contact: 'Contact',
        adventure: '*Aventures',
        work: '*Travail',
        duel: '*Duels',
        energy: '*Bonus de repos',
        skill: '*Aptitudes',
        fk: '*Fort bataille',
        speed: '*Vitesse',
        lp: '*Points de vie bonus',
        luckNmoney: '*Luck & money',
        motivation: '*Motivation',
        experience: '*Experience',
        special: '*Prime/spéciale',
        events: '*Événements',
        chests: '*Ouvrir et déballer',
        equipment: '-Équipement',
        products: '-Produits',
        questitems: '-Objets de quête',
        craftitems: '-Artisanat',
        recipes: '-Recettes',
        nothingFound: 'Pas d\'objets de cette sorte trouvé!',
      },
      sk: {
        language: 'Slovak (slovenčina)',
        ApiGui: 'Hľadáš konkrétne sety alebo produkty? Hračka pre tento script.<br>Len pár kliknutí a itemy, ktoré chceš nájsť, sa zobrazia v tvojom inventári.',
        save: 'Uložiť',
        saveMessage: 'Úspešne uložené',
        chooseLang: 'Vyber jazyk',
        contact: 'Kontakt',
        adventure: '*Dobrodružstvá',
        work: '*Práca',
        duel: '*Duely',
        energy: '*Energia',
        skill: '*Schopnosti',
        fk: '*Boje',
        speed: '*Rýchlosť',
        lp: '*Zdravie',
        luckNmoney: '*Šťastie & zárobok',
        motivation: '*Motivácia',
        experience: '*Skúsenosti',
        special: '*Prémium/špeciálne',
        events: '*Eventy',
        chests: '*Tašky a truhly',
        equipment: '-Výbava',
        products: '-Produkty',
        questitems: '-Predmety na úlohy',
        craftitems: '-Predmety z remesiel',
        recipes: '-Recepty',
        nothingFound: 'Neboli nájdené žiadne položky tohto typu!',
      },
      nl: {
        language: 'Dutch (Nederlands)',
        ApiGui: 'Zoek je specifieke sets of producten? Dit script maakt het gemakkelijk.<br>In een aantal klikken vindt je de buffs die je zoekt in je inventaris.',
        save: 'Besparen',
        saveMessage: 'Sparen succes',
        chooseLang: 'Kies een taal',
        contact: 'Contact',
        adventure: '*Avontuur',
        work: '*Werkzaamheid',
        duel: '*Duels',
        energy: '*Actiepunten',
        skill: '*Vaardigheden',
        fk: '*Fort gevechten',
        speed: '*Snelheid',
        lp: '*Levenspunten',
        luckNmoney: '*Luck & money',
        motivation: '*Motivation',
        experience: '*Experience',
        special: '*Premium/speciaal',
        events: '*Events',
        chests: '*Openen',
        equipment: '-Uitrusting',
        products: '-Producten',
        questitems: '-Opdracht gerelateerde voowerpen',
        craftitems: '-Handwerk',
        recipes: '-Recepten',
        nothingFound: 'Er kon geen voorwerp van dit type worden!',
      },
      cs: {
        language: 'Czech (čeština)',
        ApiGui: 'Hledáš konkrétní sety nebo produkty? Hračka pro tenhle script.<br>Jen pár kliknutí a itemy, které chceš najít, jsou zobrazeny v tvém inventáři.',
        save: 'Uložit',
        saveMessage: 'Úspěšně uloženo',
        chooseLang: 'Vyber jazyk',
        contact: 'Kontakt',
        adventure: '*Dobrodružství',
        work: '*Pracovní body',
        duel: '*Duely',
        energy: '*Energie',
        skill: '*Body schopností',
        fk: '*Bitvy',
        speed: '*Rychlost',
        lp: '*Body zdraví',
        luckNmoney: '*Štěstí & zárobek',
        motivation: '*Motivace',
        experience: '*Zkušenosti',
        special: '*Prémium/špeciální',
        events: '*Eventy',
        chests: '*Něco k otevření',
        equipment: '-Vybavení',
        products: '-Produkty',
        questitems: '-Předměty k úkolu',
        craftitems: '-Předměty z remesel',
        recipes: '-Recepty',
        nothingFound: 'Nebyly nalezeny žádné položky tohoto typu!',
      },
      el: {
        language: 'Greek (ελληνικά)',
        ApiGui: 'Η αναζήτηση συγκεκριμένων σετ ή προϊόντων γίνετε εύκολη δουλειά με την χρήση αυτού του script.<br>Με μερικά κλικ και τα αντικείμενα που θέλετε να βρείτε εμφανίζονται στα Αποθέματά σας.',
        save: 'Αποθήκευση',
        saveMessage: 'Αποθηκεύτηκε με επιτυχία',
        chooseLang: 'Επιλογή γλώσσας',
        contact: 'Επικοινωνία',
        adventure: '*Περιπέτειες',
        work: '*Εργασίες',
        duel: '*Μονομαχίες',
        energy: '*Ενέργεια',
        skill: '*Πόντοι ικανοτήτων',
        fk: '*Μάχες οχυρών',
        speed: '*Ταχύτητα',
        lp: '*Πόντοι υγείας',
        luckNmoney: '*Τύχη & Χρήματα',
        motivation: '*Κίνητρο',
        experience: '*Εμπειρία',
        special: '*Premium/special',
        events: '*Εκδηλώσεις',
        chests: '*Θήκες & Κάτι για να ανοίξεις',
        equipment: '-Εξοπλισμός',
        products: '-Προϊόντα',
        questitems: '-Αντικείμενα αποστολών',
        craftitems: '-Αντικείμενα επαγγελμάτων',
        recipes: '-Συνταγές',
        nothingFound: 'Δεν βρέθηκαν αντικείμενα αυτού του τύπου!',
      },
    },
    updateLang: function () {
      var lg = QIS.langs;
      QIS.lang = lg[localStorage.getItem('scriptsLang')] ? localStorage.getItem('scriptsLang') : lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : 'en';
      QISlang = lg[QIS.lang];
    },
  };
  QIS.updateLang();
  var langBox = new west.gui.Combobox();
  for (var j in QIS.langs)
    langBox.addItem(j, QIS.langs[j].language);
  langBox.select(QIS.lang);
  var saveBtn = new west.gui.Button(QISlang.save, function () {
      localStorage.setItem('scriptsLang', langBox.getValue());
      QIS.updateLang();
      new UserMessage(QISlang.saveMessage, 'success').show();
    }),
  fmfb = function (l) {
    return 'https://forum.the-west.' + l + '/index.php?conversations/add&to=Tom Robert';
  };
  TheWestApi.register('QIS', QIS.name, QIS.minGame, QIS.maxGame, QIS.author, QIS.website).setGui($('<div>' + QISlang.chooseLang +
      ': </div>').append(langBox.getMainDiv()).append(saveBtn.getMainDiv()).append('<br><br>' + QISlang.ApiGui + '<br><br><i>' + QIS.name + ' v' + QIS.version +
      '</i><br><br><br><b>' + QISlang.contact + ':</b><ul style="margin-left:15px;"><li>Send a message to <a target=\'_blanck\' href="http://om.the-west.de/west/de/player/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert on German world Arizona</a></li>' +
      '<li>Contact me on <a target=\'_blanck\' href="https://greasyfork.org/forum/messages/add/Tom Robert">Greasy Fork</a></li>' +
      '<li>Message me on one of these The West Forum:<br>/ <a target=\'_blanck\' href="' + fmfb('de') + '">deutsches Forum</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('net') + '">English forum</a> / <a target=\'_blanck\' href="' + fmfb('pl') + '">forum polski</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('es') + '">foro español</a> /<br>/ <a target=\'_blanck\' href="' + fmfb('ru') + '">Русский форум</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('fr') + '">forum français</a> / <a target=\'_blanck\' href="' + fmfb('it') + '">forum italiano</a> / ' +
      '<a target=\'_blanck\' href="https://forum.beta.the-west.net/index.php?conversations/add&to=Tom Robert">beta forum</a> /<br>I will get an e-mail when you sent me the message <img src="../images/chat/emoticons/smile.png"></li></ul>'));
  QIS.MenuButton = function (image, title, onclick) {
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
      self.isHovered = true;
      repaint();
    };
    var mouseOut = function () {
      self.isHovered = false;
      repaint();
    };
    this.obj = $('<div class=\'menulink\' title=\'' + title + '\' />').css('background-image', 'url(' + image + ')');
    this.obj.hover(mouseIn, mouseOut);
    this.obj.click(clicked);
    $('div#ui_menubar').append($('<div class=\'ui_menucontainer\' />').append(this.obj).append('<div class=\'menucontainer_bottom\' />'));
  };
  QIS.start = function () {
    var sets = west.storage.ItemSetManager._setList;
    QIS.sets = [{
        name: QISlang.adventure,
        img: 44053,
        items: [
          1909, 1910, 1991, 2110, 2111, 2112, 2113, 2114, 2115, 2121, 2122, 2741, 50480, 50481, 51126, 51588, 51592,
        ]
      }, {
        name: QISlang.work,
        img: 1879,
        items: [
          1879, 1940, 1982, 1988, 1998, 2100, 2101, 2102, 2103, 2104, 2105, 2118, 2126, 2164, 2206, 2207, 2208, 2209, 2210, 2211, 2212, 2213, 2214, 2215, 2216, 2217, 2218, 2219, 2220, 2221, 2222, 2225, 2285, 2286, 2287, 2288, 2289, 2290, 2313, 2317, 2321, 2325, 2466, 2491, 2493, 2495, 2497, 2516, 2525, 2528, 2531, 2732, 2738, 21342, 50205, 50303, 50482, 50483, 50484, 50485, 50486, 50487, 50766, 50767, 50768, 50769, 50770, 50771, 50772, 50773, 50774, 50775, 50776, 50777, 50778, 50779, 50780, 50781, 50782, 50783, 50790, 50845, 50846, 51038, 51127, 51576, 51580, 51581, 51582, 51587, 51737, 51738, 51741, 253800,
        ]
      }, {
        name: QISlang.duel,
        img: 842,
        items: [
          1863, 1864, 1871, 1872, 1901, 1908, 1916, 1938, 1946, 1981, 1984, 2285, 2286, 2287, 2288, 2289, 2529, 2695, 50135, 50136, 50482, 50483, 50484, 50485, 50486, 50487, 51125, 51587, 51740, 51741, 51742,
        ]
      }, {
        name: QISlang.energy,
        img: 1890,
        items: [
          255, 1890, 1892, 1898, 1928, 1937, 1943, 1969, 1970, 1971, 1985, 1997, 2128, 2129, 2130, 2235, 2294, 2296, 2312, 2316, 2320, 2324, 2356, 2358, 2485, 2486, 2491, 2493, 2495, 2497, 2525, 2670, 2672, 12704, 12706, 13704, 13706, 16100, 17028, 21341, 21345, 50113, 50390, 50627, 50846, 51039, 51232, 51356, 51579, 51582, 51585, 51591, 51594, 51597, 51599, 51782, 51784, 185203, 185205,
        ]
      }, {
        name: QISlang.skill,
        img: 1977,
        items: [
          1863, 1864, 1871, 1872, 1873, 1879, 1946, 1977, 1978, 1979, 1981, 1982, 1984, 1988, 2285, 2286, 2287, 2288, 2289, 2516, 2525, 2528, 2529, 2530, 2531, 2738, 50482, 50483, 50484, 50485, 50486, 50487, 50770, 50771, 50772, 50774, 50775, 50776, 50778, 50779, 50780, 51125, 51581, 51587, 51593, 51598, 51737, 51738, 51739, 51740, 51741, 51742, 51743, 51745, 253800,
        ]
      }, {
        name: QISlang.fk,
        img: 758,
        items: [
          1873, 1900, 1909, 1910, 1946, 1949, 1990, 1991, 2106, 2107, 2108, 2109, 2110, 2111, 2112, 2113, 2114, 2115, 2119, 2120, 2121, 2122, 2123, 2124, 2125, 2127, 2258, 2259, 2260, 2261, 2269, 2285, 2286, 2287, 2288, 2289, 2516, 2522, 2525, 2529, 2530, 2741, 50480, 50481, 50482, 50483, 50484, 50485, 50486, 50487, 51126, 51588, 51592, 51593, 51737, 51739, 51743,
        ]
      }, {
        name: QISlang.speed,
        img: 605,
        items: [
          1918, 1919, 1926, 1927, 1934, 1937, 1952, 1968, 1987, 2135, 2229, 2262, 2263, 2264, 2284, 2292, 2354, 2470, 2473, 2476, 2479, 2491, 2493, 2495, 2497, 2519, 2668, 2734, 12702, 13702, 50304, 50793, 50794, 50795, 50796, 50991, 51586, 51745, 185201,
        ]
      }, {
        name: QISlang.lp,
        img: 2117,
        items: [
          1883, 1892, 1898, 1946, 1974, 1991, 2116, 2117, 2235, 2253, 2254, 2255, 2256, 2257, 2295, 2296, 2357, 2358, 2486, 2525, 2671, 2672, 2734, 12705, 12706, 13705, 13706, 16100, 17028, 50113, 50845, 51038, 51232, 51233, 51579, 51582, 51585, 51591, 51594, 51597, 51599, 51739, 51784, 185204, 185205,
        ]
      }, {
        name: QISlang.luckNmoney,
        img: 2290,
        items: [
          2201, 2202, 2203, 2204, 2205, 2247, 2248, 2249, 2250, 2251, 2270, 2290, 2314, 2318, 2322, 2326, 2421, 2465, 2468, 2472, 2475, 2478, 2481, 2491, 2493, 2495, 2497, 2559, 2560, 2738, 21343, 50766, 50767, 50784, 50785, 50786, 50787, 50788, 50789, 51039, 51127, 51598, 51738, 51739, 51740, 51743, 51745,
        ]
      }, {
        name: QISlang.motivation,
        img: 1939,
        items: [
          255, 1882, 1891, 1928, 1934, 1939, 1952, 1981, 1984, 1985, 1988, 1997, 2128, 2129, 2130, 2268, 2291, 2293, 2353, 2355, 2391, 2484, 2516, 2667, 2669, 2706, 2707, 2734, 12701, 12703, 13701, 13703, 17028, 50113, 50135, 50136, 50627, 50958, 51039, 51233, 51356, 51594, 51782, 185200, 185202,
        ]
      }, {
        name: QISlang.experience,
        img: 2467,
        items: [
          2196, 2197, 2198, 2199, 2200, 2467, 2576, 2732, 50113, 50768, 50773, 50790, 50791, 50792, 50845, 50846, 51038, 51576, 51737, 51740, 51742,
        ]
      }, {
        name: QISlang.special,
        img: 2482,
        items: [
          1977, 1978, 1979, 2311, 2312, 2313, 2314, 2315, 2316, 2317, 2318, 2319, 2320, 2321, 2322, 2323, 2324, 2325, 2326, 2470, 2472, 2473, 2475, 2476, 2478, 2479, 2481, 2482, 2484, 2485, 2486, 2491, 2493, 2495, 2497, 2695, 21340, 21341, 21342, 21343, 50991,
        ]
      }, {
        name: QISlang.events,
        img: 2564,
        items: [
          55, 371, 973, 974, 975, 976, 2557, 2558, 2561, 2562, 2563, 2564, 2565, 2566, 2567, 2590, 2591, 2592, 2593, 2594, 2619, 2620, 2621, 2622, 2623, 2665, 2666, 2675, 2676, 2677, 2678, 2679, 2680, 2692, 2693, 2698, 12700, 50691, 51255, 51256, 51257, 51258, 51482, 51483, 51484, 51485, 51486, 51487, 51488,
        ]
      }, {
        name: QISlang.chests,
        img: 17002,
        items: [
          371, 374, 376, 377, 378, 379, 852, 853, 926, 927, 928, 973, 974, 975, 976, 1003, 1838, 1868, 1869, 1878, 1887, 1888, 1897, 1905, 1906, 1915, 1923, 1924, 1933, 1960, 1961, 1964, 1967, 1975, 1976, 2131, 2132, 2133, 2134, 2136, 2137, 2138, 2139, 2144, 2152, 2172, 2173, 2174, 2175, 2176, 2187, 2192, 2193, 2194, 2195, 2196, 2197, 2198, 2199, 2200, 2201, 2202, 2203, 2204, 2205, 2226, 2227, 2297, 2298, 2299, 2300, 2305, 2329, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337, 2338, 2345, 2359, 2360, 2361, 2362, 2379, 2380, 2381, 2382, 2383, 2384, 2385, 2393, 2394, 2395, 2396, 2397, 2421, 2460, 2461, 2462, 2482, 2487, 2488, 2489, 2490, 2499, 2507, 2518, 2521, 2524, 2527, 2533, 2534, 2535, 2536, 2537, 2538, 2540, 2542, 2556, 2557, 2558, 2559, 2560, 2561, 2562, 2563, 2564, 2565, 2566, 2567, 2579, 2580, 2581, 2585, 2586, 2587, 2588, 2589, 2590, 2591, 2592, 2593, 2594, 2602, 2603, 2604, 2605, 2606, 2614, 2615, 2616, 2617, 2618, 2619, 2620, 2621, 2622, 2623, 2624, 2626, 2627, 2628, 2629, 2630, 2645, 2646, 2647, 2648, 2650, 2665, 2666, 2673, 2674, 2675, 2676, 2677, 2678, 2679, 2680, 2685, 2687, 2688, 2689, 2690, 2692, 2693, 2694, 2698, 2699, 2700, 2701, 2702, 2703, 2704, 2705, 2714, 2715, 2721, 2722, 2723, 2728, 2755, 12700, 12709, 12710, 12711, 13711, 17000, 17001, 17002, 17003, 17004, 17005, 17006, 17007, 17008, 50001, 50002, 50003, 50009, 50023, 50025, 50080, 50081, 50082, 50086, 50087, 50088, 50093, 50105, 50128, 50130, 50131, 50132, 50133, 50134, 50168, 50169, 50170, 50171, 50177, 50195, 50251, 50252, 50253, 50254, 50255, 50256, 50257, 50258, 50259, 50295, 50296, 50297, 50298, 50299, 50300, 50301, 50302, 50305, 50346, 50347, 50348, 50368, 50381, 50382, 50383, 50384, 50385, 50386, 50387, 50388, 50391, 50409, 50423, 50424, 50425, 50426, 50427, 50428, 50442, 50446, 50456, 50477, 50478, 50479, 50488, 50501, 50509, 50540, 50545, 50547, 50556, 50557, 50558, 50559, 50560, 50570, 50579, 50588, 50603, 50604, 50605, 50606, 50607, 50608, 50622, 50623, 50624, 50625, 50675, 50676, 50677, 50678, 50679, 50680, 50681, 50682, 50683, 50684, 50685, 50686, 50687, 50688, 50689, 50690, 50691, 50696, 50697, 50698, 50699, 50700, 50712, 50724, 50736, 50748, 50760, 50819, 50820, 50835, 50836, 50837, 50838, 50839, 50840, 50841, 50842, 50843, 50844, 50854, 50855, 50880, 50884, 50896, 50897, 50919, 50920, 50921, 50931, 50941, 50951, 50959, 50975, 50989, 50990, 50992, 51004, 51008, 51009, 51010, 51013, 51015, 51025, 51040, 51041, 51042, 51043, 51044, 51059, 51066, 51067, 51059, 51066, 51067, 51068, 51075, 51089, 51098, 51107, 51122, 51139, 51140, 51141, 51153, 51154, 51155, 51156, 51174, 51184, 51194, 51220, 51221, 51222, 51223, 51224, 51225, 51226, 51227, 51228, 51229, 51230, 51231, 51249, 51250, 51255, 51256, 51257, 51258, 51259, 51260, 51261, 51262, 51263, 51264, 51265, 51280, 51292, 51304, 51305, 51310, 51311, 51312, 51324, 51325, 51326, 51327, 51328, 51329, 51330, 51332, 51333, 51334, 51341, 51342, 51354, 51387, 51388, 51398, 51408, 51409, 51418, 51428, 51438, 51450, 51454, 51455, 51467, 51468, 51473, 51482, 51483, 51484, 51485, 51486, 51487, 51488, 51497, 51506, 51515, 51533, 51534, 51535, 51536, 51537, 51538, 51542, 51543, 51544, 51545, 51546, 51577, 51583, 51589, 51595, 51611, 51616, 51650, 51667, 51677, 51687, 51710, 51711, 51712, 51713, 51714, 51715, 51716, 51717, 51718, 51719, 51720, 51724, 51736, 51744, 51750, 51762, 51774, 51775, 51776, 51783, 51795, 51796, 51797, 51810, 51811, 51812, 51813, 51814, 51815, 51816, 51825, 51835,
        ]
      }, {
        name: QISlang.equipment,
        img: QIS.equImg,
        itemsk: [
          252, 674, 723, 768, 792, 794, 797, 945, 979, 991, 997, 998, 999, 1702, 1715, 1717, 1740, 1759, 1762, 1772, 1955, 1972, 2154, 2188, 2189, 2190, 2191, 2223, 2228, 2301, 2302, 2310, 2339, 2352, 2363, 2409, 2483, 2539, 2541, 2551, 2555, 2577, 2578, 2583, 2600, 2610, 2611, 2612, 2613, 2640, 2641, 2642, 2643, 2644, 2649, 2660, 2661, 2662, 2663, 2684, 2691, 2696, 2697, 2716, 2717, 2718, 2719, 2720, 2724, 2725, 2726, 2727, 12713, 50000, 50016, 50076, 50089, 50090, 50092, 50107, 50109, 50111, 50112, 50137, 50145, 50153, 50161, 50194, 50206, 50243, 50279, 50292, 50313, 50323, 50331, 50342, 50353, 50377, 50402, 50422, 50432, 50464, 50502, 50510, 50511, 50512, 50513, 50514, 50515, 50516, 50517, 50518, 50519, 50520, 50521, 50522, 50523, 50524, 50525, 50526, 50527, 50528, 50529, 50530, 50531, 50532, 50533, 50534, 50535, 50536, 50537, 50538, 50539, 50544, 50549, 50555, 50569, 50578, 50587, 50596, 50621, 50626, 50635, 50661, 50671, 50708, 50720, 50732, 50744, 50756, 50804, 50815, 50828, 50832, 50833, 50834, 50853, 50856, 50862, 50873, 50883, 50891, 50905, 50968, 50978, 51000, 51012, 51023, 51026, 51051, 51052, 51053, 51054, 51055, 51051, 51052, 51053, 51054, 51055, 51088, 51097, 51106, 51118, 51134, 51149, 51157, 51202, 51213, 51236, 51237, 51266, 51267, 51268, 51276, 51288, 51300, 51323, 51364, 51369, 51386, 51417, 51449, 51461, 51462, 51463, 51466, 51481, 51496, 51505, 51514, 51529, 51554, 51613, 51646, 51647, 51648, 51649, 51655, 51656, 51698, 51709, 51735, 51761, 51773, 51791, 51809,
        ]
      }, {
        name: QISlang.products,
        img: 702,
        items: [
          700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 733, 734, 736, 737, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 771, 774, 778, 779, 780, 781, 782, 783, 784, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 797, 1708, 1755, 1756, 1791, 1807, 1808, 1809, 1810, 1811, 1812, 1813, 1814, 1815, 1816, 1817, 1818, 1819, 1820, 1821, 1822, 1823, 1824, 1825, 1826, 1827, 1828, 1829, 1830, 1831, 1832, 1833, 1834, 1835, 1836, 1837, 1975, 2000, 2003, 2006, 2009, 2160, 2161, 2162, 2163, 2430, 2432, 2431, 2433, 2434, 2435, 2436, 2437, 2438, 2439, 2440, 2441, 2442, 2443, 2444, 2445, 2446, 2447, 2448, 2449, 2450, 2451, 2452, 2453, 2454, 2455, 2456, 2457, 2458,
        ]
      }, {
        name: QISlang.questitems,
        img: 17026,
        items: [
          251, 738, 769, 770, 772, 773, 774, 775, 776, 777, 796, 799, 995, 996, 1016, 1019, 1700, 1701, 1702, 1703, 1704, 1705, 1706, 1707, 1709, 1710, 1711, 1712, 1713, 1716, 1733, 1750, 1751, 1752, 1753, 1754, 1757, 1758, 1760, 1761, 1763, 1764, 1765, 1766, 1767, 1768, 1769, 1770, 1771, 1773, 1774, 1775, 1776, 1777, 1778, 1779, 1780, 1781, 1782, 1783, 1784, 1785, 1786, 1787, 1788, 1789, 1790, 1792, 1793, 1794, 1795, 1796, 1797, 1798, 1799, 1800, 1801, 1802, 1803, 1804, 1805, 1806, 1838, 1839, 1840, 1841, 1842, 1843, 1844, 1845, 1846, 1847, 1848, 1849, 1850, 1851, 1852, 1853, 1854, 1935, 1936, 1953, 1954, 1956, 1957, 1958, 1959, 1962, 1963, 1964, 1965, 1966, 1973, 1992, 1993, 1994, 1995, 1996, 2001, 2004, 2007, 2010, 2145, 2146, 2147, 2148, 2153, 2224, 2245, 2265, 2266, 2267, 2306, 2307, 2308, 2309, 2328, 2340, 2346, 2347, 2348, 2349, 2350, 2351, 2364, 2365, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2386, 2387, 2388, 2389, 2390, 2392, 2398, 2399, 2400, 2401, 2402, 2403, 2404, 2405, 2406, 2407, 2408, 2410, 2411, 2412, 2413, 2414, 2415, 2416, 2417, 2418, 2419, 2420, 2421, 2422, 2423, 2424, 2425, 2426, 2427, 2428, 2429, 2500, 2501, 2502, 2503, 2504, 2505, 2506, 2508, 2509, 2510, 2511, 2512, 2513, 2514, 2515, 2532, 2552, 2553, 2554, 2568, 2569, 2570, 2571, 2572, 2573, 2574, 2575, 2681, 2682, 2683, 2702, 2703, 2704, 2705, 2708, 2709, 2710, 2711, 2712, 2713, 2729, 12707, 12708, 12712, 17020, 17021, 17022, 17023, 17024, 17025, 17026, 17027, 50091, 50094, 50172, 50173, 50174, 50175, 50176, 50178, 50179, 50180, 50181, 50182, 50183, 50184, 50185, 50186, 50196, 50197, 50198, 50199, 50200, 50201, 50202, 50203, 50204, 50207, 50208, 50209, 50271, 50272, 50273, 50274, 50275, 50276, 50277, 50278, 50317, 50318, 50319, 50320, 50321, 50322, 50349, 50350, 50351, 50352, 50369, 50389, 50429, 50430, 50431, 50489, 50490, 50491, 50492, 50493, 50494, 50495, 50496, 50497, 50498, 50499, 50500, 50546, 50548, 50566, 50609, 50610, 50611, 50612, 50613, 50761, 50762, 50763, 50764, 50765, 50847, 50848, 50849, 50850, 50851, 50852, 50857, 50858, 50859, 50860, 50861, 50881, 50882, 50893, 50894, 50895, 50952, 50953, 50954, 50955, 50956, 50957, 50976, 51011, 51014, 51016, 51017, 51018, 51019, 51020, 51021, 51022, 51027, 51028, 51029, 51030, 51031, 51057, 51058, 51057, 51058, 51069, 51071, 51073, 51074, 51076, 51077, 51078, 51080, 51099, 51124, 51158, 51159, 51160, 51161, 51163, 51164, 51234, 51235, 51238, 51239, 51248, 51253, 51355, 51361, 51362, 51363, 51373, 51374, 51375, 51376, 51377, 51378, 51379, 51380, 51381, 51382, 51383, 51384, 51385, 51389, 51390, 51391, 51392, 51459, 51469, 51470, 51471, 51472, 51479, 51480, 51578, 51584, 51590, 51596, 51746, 51747, 51748, 51749, 51777, 51778, 51779, 51780, 51781, 51817, 51818, 51819, 51820, 51821, 51822, 51823, 51824, 51826, 51827, 51828, 51829,
        ]
      }, {
        name: QISlang.craftitems,
        img: 1899,
        items: [
          1855, 1856, 1857, 1858, 1859, 1860, 1861, 1862, 1863, 1864, 1865, 1866, 1867, 1868, 1869, 1870, 1871, 1872, 1873, 1874, 1875, 1876, 1877, 1878, 1879, 1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2516, 2517, 2518, 2519, 2520, 2521, 2522, 2523, 2524, 2525, 2526, 2527, 2730, 2731, 2732, 2733, 2734, 2735, 2736, 2737, 2738, 2739, 2740, 2741, 51576, 51577, 51578, 51579, 51580, 51581, 51582, 51583, 51584, 51585, 51586, 51587, 51588, 51589, 51590, 51591, 51592, 51593, 51594, 51595, 51596, 51597, 51598, 51599,
        ]
      }, {
        name: QISlang.recipes,
        img: 20115,
        items: [
          20000, 20001, 20002, 20083, 20084, 20085, 20086, 20003, 20004, 20005, 20006, 20007, 20008, 20009, 20010, 20011, 20012, 20013, 20014, 20015, 20016, 20017, 20116, 20018, 20134, 20019, 20096, 20120, 20124, 20097, 20098, 20135, 20099, 20100, 20136, 51622, 51617, 51621, 51619, 51620, 51618,
          20020, 20021, 20022, 20081, 20087, 20088, 20089, 20023, 20024, 20025, 20026, 20027, 20028, 20029, 20030, 20031, 20032, 20033, 20034, 20035, 20036, 20037, 20119, 20038, 20123, 20128, 20039, 20101, 20127, 20102, 20103, 20129, 20104, 20105, 20130, 51640, 51635, 51639, 51637, 51638, 51636,
          20040, 20041, 20042, 20082, 20090, 20091, 20092, 20043, 20044, 20045, 20046, 20047, 20048, 20049, 20050, 20051, 20052, 20053, 20054, 20055, 20056, 20057, 20118, 20058, 20122, 20131, 20059, 20111, 20126, 20112, 20113, 20132, 20114, 20115, 20133, 51634, 51629, 51633, 51631, 51632, 51630,
          20060, 20061, 20062, 20080, 20093, 20094, 20095, 20063, 20064, 20065, 20066, 20067, 20068, 20069, 20070, 20071, 20072, 20073, 20074, 20075, 20076, 20077, 20117, 20078, 20121, 20137, 20079, 20106, 20125, 20107, 20108, 20138, 20109, 20110, 20139, 51628, 51623, 51627, 51625, 51626, 51624,
        ]
      }, {
        name: sets.gold_set,
        itemsk: [
          50, 136, 858,
        ]
      }, {
        name: sets.greenhorn_set,
        itemsk: [
          52, 262, 438, 569, 607, 859, 10148, 11118, 40000,
        ]
      }, {
        name: sets.season_set,
        itemsk: [
          137, 258, 437, 567, 609, 856, 1759, 10181, 40200, 50007, 50008,
        ]
      }, {
        name: sets.set_dancer,
        itemsk: [
          259, 368, 433, 566, 665, 1772, 10149, 11138,
        ]
      }, {
        name: sets.set_farmer,
        itemsk: [
          219, 321, 409, 797, 10025, 11005, 41045,
        ]
      }, {
        name: sets.set_gentleman,
        itemsk: [
          235, 354, 427, 537, 664, 1715, 10075, 11077,
        ]
      }, {
        name: sets.set_indian,
        itemsk: [
          96, 253, 369, 429, 512, 602, 904, 10094, 11137,
        ]
      }, {
        name: sets.set_mexican,
        itemsk: [
          95, 254, 312, 428, 561, 600, 792, 903, 10054,
        ]
      }, {
        name: sets.set_pilgrim_female,
        itemsk: [
          256, 372, 431, 528, 723, 10218, 11035,
        ]
      }, {
        name: sets.set_pilgrim_male,
        itemsk: [
          257, 373, 432, 529, 768, 10219, 11034,
        ]
      }, {
        name: sets.set_quackery,
        itemsk: [
          224, 340, 435, 527, 794, 854, 10085, 11085, 44020,
        ]
      }, {
        name: sets.set_sleeper,
        itemsk: [
          47, 132, 261, 375, 436, 1717, 11207, 41203,
        ]
      }, {
        name: sets.tw_times_set,
        itemsk: [
          40031, 41206, 42253, 50129, 50960, 51359, 185145, 185146,
        ]
      }, {
        name: sets.collector_set,
        itemsk: [
          58, 140, 264, 439, 575, 611, 863, 2409, 10150, 11139, 40002,
        ]
      }, {
        name: sets.bunny_set,
        itemsk: [
          63, 265, 440, 11140, 40003,
        ]
      }, {
        name: sets.fireworker_set,
        itemsk: [
          1762,
        ]
      }, {
        name: sets.set_walker,
        itemsk: [
          154, 279, 454, 592, 10164, 11154, 40019,
        ]
      }, {
        name: sets.set_fort,
        itemsk: [
          68, 152, 277, 452, 590, 879, 10162, 11152, 40017, 2174, 2176,
        ]
      }, {
        name: sets.set_fortunehunter,
        itemsk: [
          69, 153, 278, 453, 591, 880, 10163, 11153, 40018, 2175, 2176,
        ]
      }, {
        name: sets.set_duelist,
        itemsk: [
          67, 151, 276, 451, 589, 878, 10161, 11151, 40016, 2173, 2176,
        ]
      }, {
        name: sets.set_cupid,
        itemsk: [
          165, 290, 465, 637, 887, 10175, 11165, 40030, 41003, 2187,
        ]
      }, {
        name: sets.set_proworker,
        itemsk: [
          293, 468, 640, 2191, 10178, 11168, 40034, 41006, 2194, 2195,
        ]
      }, {
        name: sets.set_rangedduelist,
        itemsk: [
          292, 467, 639, 2190, 10177, 11167, 40033, 41005, 2193, 2195,
        ]
      }, {
        name: sets.set_meleeduelist,
        itemsk: [
          291, 466, 638, 2189, 10176, 11166, 40032, 41004, 219200, 2195,
        ]
      }, {
        name: sets.set_party,
        itemsk: [
          295, 470, 10180, 11170, 40036, 41008,
        ]
      }, {
        name: sets.set_fair,
        itemsk: [
          294, 469, 642, 2223, 10179, 11169, 40035, 41007, 50819,
        ]
      }, {
        name: sets.set_soap,
        itemsk: [
          481, 10192, 11181, 40048, 41019, 42007,
        ]
      }, {
        name: sets.set_parade,
        itemsk: [
          482, 10193, 11182, 40049, 41020, 42008,
        ]
      }, {
        name: sets.wooden_magician_set,
        itemsk: [
          185147, 185148, 185149, 185150, 185151, 185152,
        ]
      }, {
        name: sets.set_independence_1,
        itemsk: [
          87, 183, 490, 895, 10201, 11190, 40057, 41028, 42016, 2297, 2300,
        ]
      }, {
        name: sets.set_independence_2,
        itemsk: [
          88, 184, 491, 896, 10202, 11191, 40058, 41029, 42017, 2298, 2300,
        ]
      }, {
        name: sets.set_independence_3,
        itemsk: [
          89, 185, 492, 897, 10203, 11192, 40059, 41030, 42018, 2299, 2300,
        ]
      }, {
        name: sets.set_independence_4,
        itemsk: [
          494, 661, 2301, 10205, 11193, 40061, 41032, 42020,
        ]
      }, {
        name: sets.set_independence_gun_winner,
        itemsk: [
          90, 186, 898,
        ]
      }, {
        name: sets.labor_day,
        itemsk: [
          2352, 40062,
        ]
      }, {
        name: sets.set_octoberfest_1,
        itemsk: [
          91, 187, 495, 899, 10206, 11195, 40063, 41033, 42021, 2359, 2362,
        ]
      }, {
        name: sets.set_octoberfest_2,
        itemsk: [
          92, 188, 496, 900, 10207, 11196, 40064, 41034, 42022, 2360, 2362,
        ]
      }, {
        name: sets.set_octoberfest_3,
        itemsk: [
          93, 189, 497, 901, 10208, 11197, 40065, 41035, 42023, 2361, 2362,
        ]
      }, {
        name: sets.set_octoberfest_4,
        itemsk: [
          498, 663, 2363, 10209, 11198, 40066, 41036, 42024,
        ]
      }, {
        name: sets.set_octoberfest_gun_winner,
        itemsk: [
          94, 190, 902,
        ]
      }, {
        name: sets.set_shop_low,
        itemsk: [
          499, 11199, 10210, 40067, 41037, 42025, 2379,
        ]
      }, {
        name: sets.set_shop_mid,
        itemsk: [
          10211, 11200, 40068, 41038, 42026, 43000, 2380,
        ]
      }, {
        name: sets.set_shop_high,
        itemsk: [
          10212, 11201, 41039, 40069, 42027, 43001, 2381,
        ]
      }, {
        name: sets.set_shop_adventure,
        itemsk: [
          10213, 11202, 40070, 41040, 42028, 43002, 2382,
        ]
      }, {
        name: sets.set_shop_duel,
        itemsk: [
          10214, 11203, 40071, 41041, 42029, 43003, 2383,
        ]
      }, {
        name: sets.set_shop_work,
        itemsk: [
          10215, 11204, 40072, 41042, 42030, 43004, 2384,
        ]
      }, {
        name: sets.set_shop_soldier,
        itemsk: [
          10216, 11205, 40073, 41043, 42031, 43005, 2385,
        ]
      }, {
        name: sets.set_halloween,
        itemsk: [
          10217, 11206, 40074, 41044, 42032, 43006,
        ]
      }, {
        name: sets.set_xmas2013_cloth,
        itemsk: [
          97, 191, 667, 905, 2539, 10261, 11273, 40202, 41200, 42201, 43200, 2540,
        ]
      }, {
        name: sets.set_valentin_2014,
        itemsk: [
          682, 932, 2555, 10302, 11276, 40205, 41204, 42204, 43203, 44032, 45018, 2556,
        ]
      }, {
        name: sets.set_leveling_valentin_2014,
        itemsk: [
          10303, 11277, 40206, 41205, 42205, 43204, 51068,
        ]
      }, {
        name: sets.set_st_patrick,
        itemsk: [
          684, 933, 2577, 10304, 11278, 40207, 41207, 42206, 43205, 44033, 45019,
        ]
      }, {
        name: sets.set_veteran_horse,
        itemsk: [
          687,
        ]
      }, {
        name: sets.set_easter_2014_1,
        itemsk: [
          934, 10305, 11279, 40208, 41208, 42207, 43206, 44034, 45020, 2579,
        ]
      }, {
        name: sets.set_easter_2014_2,
        itemsk: [
          935, 10306, 11280, 41209, 40209, 42208, 43207, 44035, 45021, 2580,
        ]
      }, {
        name: sets.set_easter_2014_3,
        itemsk: [
          936, 10307, 11281, 40210, 41210, 42209, 43208, 44036, 45022, 2581,
        ]
      }, {
        name: sets.set_easter_2014_ranking,
        itemsk: [
          937, 685, 2583, 10308, 11282, 40211, 41211, 42210, 43209, 44037, 45023,
        ]
      }, {
        name: sets.set_easter_2014_weapon_ranking_winner,
        itemsk: [
          938, 44038, 45024,
        ]
      }, {
        name: sets.set_4july_2014_1,
        itemsk: [
          691, 2610, 10325, 11300, 40230, 41225, 42225, 43225, 2614, 2617,
        ]
      }, {
        name: sets.set_4july_2014_2,
        itemsk: [
          692, 2611, 10326, 11301, 40231, 41226, 42226, 43226, 2615, 2617, 50424,
        ]
      }, {
        name: sets.set_4july_2014_3,
        itemsk: [
          693, 2612, 10327, 11302, 41227, 40232, 42227, 43227, 2616, 2617,
        ]
      }, {
        name: sets.set_4july_2014_ranking,
        itemsk: [
          694, 940, 2613, 10328, 11303, 40233, 41228, 42228, 44051, 43228, 45031,
        ]
      }, {
        name: sets.set_4july_2014_weapon_ranking_winner,
        itemsk: [
          941, 44052, 45032,
        ]
      }, {
        name: sets.instance_set_1,
        itemsk: [
          696, 950, 2640, 10340, 11310, 40240, 41240, 42240, 43240, 44060, 45040, 50425, 50426,
        ]
      }, {
        name: sets.set_octoberfest_2014_1,
        itemsk: [
          2641, 10341, 11311, 40241, 41241, 42241, 43241, 48000, 2645, 2648,
        ]
      }, {
        name: sets.set_octoberfest_2014_2,
        itemsk: [
          2642, 10342, 11312, 40242, 41242, 42242, 43242, 48001, 2646, 2648,
        ]
      }, {
        name: sets.set_octoberfest_2014_3,
        itemsk: [
          2643, 10343, 11313, 40243, 41243, 42243, 43243, 48002, 2647, 2648,
        ]
      }, {
        name: sets.set_octoberfest_2014_ranking,
        itemsk: [
          951, 2644, 10344, 11314, 41244, 40244, 42244, 43244, 44061, 45041, 48003,
        ]
      }, {
        name: sets.set_octoberfest_2014_weapon_ranking_winner,
        itemsk: [
          952, 44062, 45042,
        ]
      }, {
        name: sets.set_speedworld_2014,
        itemsk: [
          953, 2649, 10345, 11315, 40245, 41245, 42245, 43245, 44063, 45043, 48004,
        ]
      }, {
        name: sets.set_dayofthedead_2014_1,
        itemsk: [
          954, 2660, 10346, 11316, 40246, 41246, 42246, 43246, 44070, 45044, 48005, 2673,
        ]
      }, {
        name: sets.set_dayofthedead_2014_2,
        itemsk: [
          955, 2661, 10347, 11317, 41247, 40247, 42247, 43247, 44071, 45045, 48006, 2674,
        ]
      }, {
        name: sets.set_dayofthedead_2014_3,
        itemsk: [
          956, 2662, 10348, 11318, 40248, 41248, 42248, 43248, 44072, 45046, 48007, 50002,
        ]
      }, {
        name: sets.set_dayofthedead_2014_4,
        itemsk: [
          957, 2663, 10349, 11319, 40249, 41249, 42249, 43249, 44073, 45047, 48008, 50003,
        ]
      }, {
        name: sets.set_christmas_2014,
        itemsk: [
          958, 2684, 10350, 11320, 40250, 41250, 42250, 43250, 44074, 45048, 48010, 2685,
        ]
      }, {
        name: sets.set_valentinesday_2015_1,
        itemsk: [
          959, 2691, 10351, 11321, 40251, 41251, 42251, 43251, 44075, 45049, 48011, 2694,
        ]
      }, {
        name: sets.set_valentinesday_2015_2,
        itemsk: [
          10352, 11322, 40252, 41252, 42252, 43252, 51334,
        ]
      }, {
        name: sets.set_easter_2015_1,
        itemsk: [
          960, 10353, 11323, 40253, 41253, 42254, 43253, 44076, 45050, 2699,
        ]
      }, {
        name: sets.set_easter_2015_2,
        itemsk: [
          961, 10354, 11324, 40254, 41254, 42255, 43254, 44077, 45051, 2700,
        ]
      }, {
        name: sets.set_easter_2015_3,
        itemsk: [
          962, 10355, 11325, 40255, 41255, 42256, 43255, 44078, 45052, 2701,
        ]
      }, {
        name: sets.set_easter_2015_4,
        itemsk: [
          963, 2697, 10356, 11326, 40256, 41256, 42257, 43256, 44079, 45053, 48015,
        ]
      }, {
        name: sets.set_easter_2015_5,
        itemsk: [
          964, 44080, 45054,
        ]
      }, {
        name: sets.set_4july_2015_1,
        itemsk: [
          2717, 10357, 11327, 40257, 41257, 42258, 43257, 48016, 2721, 2728,
        ]
      }, {
        name: sets.set_4july_2015_2,
        itemsk: [
          2718, 10358, 11328, 40258, 41258, 42259, 43258, 48017, 2722, 2728,
        ]
      }, {
        name: sets.set_4july_2015_3,
        itemsk: [
          2719, 10359, 11329, 40259, 41259, 42260, 43259, 48018, 2723, 2728,
        ]
      }, {
        name: sets.set_4july_2015_ranking,
        itemsk: [
          968, 2720, 10360, 11330, 40260, 41260, 42261, 43260, 44081, 45058, 48019,
        ]
      }, {
        name: sets.set_4july_2015_weapon_ranking_winner,
        itemsk: [
          969, 44082, 45059,
        ]
      }, {
        name: sets.set_october_2015_1,
        itemsk: [
          380, 385, 390, 395, 434, 563, 678, 697, 698, 852, 928,
        ]
      }, {
        name: sets.set_october_2015_2,
        itemsk: [
          381, 386, 391, 396, 558, 564, 679, 713, 732, 853, 928,
        ]
      }, {
        name: sets.set_october_2015_3,
        itemsk: [
          382, 387, 392, 397, 559, 565, 688, 735, 785, 926, 928,
        ]
      }, {
        name: sets.set_october_2015_ranking,
        itemsk: [
          383, 388, 393, 398, 560, 581, 674, 676, 689, 798, 848,
        ]
      }, {
        name: sets.set_october_2015_winner,
        itemsk: [
          849, 850, 851, 927,
        ]
      }, {
        name: sets.set_dotd_2015_1,
        itemsk: [
          54, 260, 675, 677, 929, 943, 944, 945, 946, 947, 948, 1003,
        ]
      }, {
        name: sets.set_dotd_2015_2,
        itemsk: [
          949, 970, 971, 977, 978, 979, 980, 981, 982, 988, 1000, 50383,
        ]
      }, {
        name: sets.set_dotd_2015_3,
        itemsk: [
          983, 984, 985, 986, 987, 989, 990, 991, 992, 993, 994, 50384,
        ]
      }, {
        name: sets.set_xmas2015_clothes,
        itemsk: [
          384, 389, 394, 430, 562, 673, 49999, 50000, 378,
        ]
      }, {
        name: sets.set_valentine_2016,
        itemsk: [
          50004, 50005, 50006, 50010, 50011, 50012, 50013, 50014, 50015, 50016, 50024, 50025,
        ]
      }, {
        name: sets.set_valentine_2016_wof,
        itemsk: [
          50017, 50018, 50019, 50020, 50021, 50022, 50023, 51333,
        ]
      }, {
        name: sets.set_easter_2016_1,
        itemsk: [
          50039, 50040, 50041, 50042, 50043, 50044, 50045, 50046, 50047, 50080,
        ]
      }, {
        name: sets.set_easter_2016_2,
        itemsk: [
          50048, 50049, 50050, 50051, 50052, 50053, 50054, 50055, 50056, 50081,
        ]
      }, {
        name: sets.set_easter_2016_3,
        itemsk: [
          50057, 50058, 50059, 50060, 50061, 50062, 50063, 50064, 50065, 50082,
        ]
      }, {
        name: sets.set_easter_2016_4,
        itemsk: [
          50066, 50067, 50068, 50069, 50070, 50071, 50072, 50073, 50074, 50075, 50076,
        ]
      }, {
        name: sets.set_easter_2016_5w,
        itemsk: [
          50077, 50078, 50079,
        ]
      }, {
        name: sets.set_sale_2016_1,
        itemsk: [
          50083, 50084, 50085, 50105,
        ]
      }, {
        name: sets.set_4july_2016_1,
        itemsk: [
          50095, 50096, 50097, 50098, 50099, 50100, 50101, 50137, 50168, 50177,
        ]
      }, {
        name: sets.set_4july_2016_2,
        itemsk: [
          50138, 50139, 50140, 50141, 50142, 50143, 50144, 50145, 50169, 50177,
        ]
      }, {
        name: sets.set_4july_2016_3,
        itemsk: [
          50146, 50147, 50148, 50149, 50150, 50151, 50152, 50153, 50170, 50177,
        ]
      }, {
        name: sets.set_4july_2016_4,
        itemsk: [
          50154, 50155, 50156, 50157, 50158, 50159, 50160, 50161, 50162, 50163, 50164,
        ]
      }, {
        name: sets.set_4july_2016_5,
        itemsk: [
          50165, 50166, 50167, 50171,
        ]
      }, {
        name: sets.set_colcord,
        itemsk: [
          50187, 50188, 50189, 50190, 50191, 50192, 50193, 50194, 50195,
        ]
      }, {
        name: sets.set_oktoberfest_2016_1,
        itemsk: [
          50210, 50211, 50212, 50213, 50214, 50215, 50216, 50217, 50218, 50251, 50254,
        ]
      }, {
        name: sets.set_oktoberfest_2016_2,
        itemsk: [
          50219, 50220, 50221, 50222, 50223, 50224, 50225, 50226, 50227, 50252, 50254,
        ]
      }, {
        name: sets.set_oktoberfest_2016_3,
        itemsk: [
          50228, 50229, 50230, 50231, 50232, 50233, 50234, 50235, 50236, 50253, 50254,
        ]
      }, {
        name: sets.set_oktoberfest_2016_4,
        itemsk: [
          50237, 50238, 50239, 50240, 50241, 50242, 50243, 50244, 50245, 50246, 50247,
        ]
      }, {
        name: sets.set_oktoberfest_2016_5,
        itemsk: [
          50248, 50249, 50250,
        ]
      }, {
        name: sets.set_wrightbrothers,
        itemsk: [
          50292, 50293, 50294, 50503, 50504, 50505, 50506, 50507, 50508, 50509,
        ]
      }, {
        name: sets.set_dodt_2016_1,
        itemsk: [
          50306, 50307, 50308, 50309, 50310, 50311, 50312, 50313, 50314, 50315, 50316, 50346,
        ]
      }, {
        name: sets.set_dotd_2016_2,
        itemsk: [
          50324, 50325, 50326, 50327, 50328, 50329, 50330, 50331, 50332, 50333, 50334, 50347,
        ]
      }, {
        name: sets.set_dotd_2016_3,
        itemsk: [
          50335, 50336, 50337, 50338, 50339, 50340, 50341, 50342, 50343, 50344, 50345, 50348,
        ]
      }, {
        name: sets.set_dedmoroz_2016,
        itemsk: [
          50370, 50371, 50372, 50373, 50374, 50375, 50376, 50377, 50378, 50379, 50380, 50381,
        ]
      }, {
        name: sets.set_valentine_2017_1,
        itemsk: [
          50392, 50393, 50394, 50395, 50396, 50397, 50398, 50399, 50400, 50401, 50402, 50409,
        ]
      }, {
        name: sets.set_valentine_2017_3,
        itemsk: [
          50403, 50404, 50405, 50406, 50407, 50408, 51332,
        ]
      }, {
        name: sets.set_veteran_2017_1,
        itemsk: [
          50415, 50416, 50417, 50418, 50419, 50420, 50421, 50422, 50423,
        ]
      }, {
        name: sets.set_easter_2017_clothes_1,
        itemsk: [
          50433, 50434, 50435, 50436, 50437, 50438, 50439, 50440, 50441, 50442,
        ]
      }, {
        name: sets.set_easter_2017_weapons_2,
        itemsk: [
          50443, 50444, 50445, 50446,
        ]
      }, {
        name: sets.set_easter_clothes_3,
        itemsk: [
          50447, 50448, 50449, 50450, 50451, 50452, 50453, 50454, 50455, 50456,
        ]
      }, {
        name: sets.set_easter_2017_4,
        itemsk: [
          50457, 50458, 50459, 50460, 50461, 50462, 50463, 50464, 50465, 50466, 50467,
        ]
      }, {
        name: sets.set_easter_2017_clothes_5,
        itemsk: [
          50468, 50469, 50470, 50471, 50472, 50473, 50474, 50475, 50476, 50477,
        ]
      }, {
        name: sets.vanity_sale_football_2017,
        itemsk: [
          50541, 50542, 50543, 50544, 50545, 50547,
        ]
      }, {
        name: sets.set_package_sale_2017,
        itemsk: [
          50550, 50551, 50552, 50553, 50554, 50555,
        ]
      }, {
        name: sets.set_independence_2017_1,
        itemsk: [
          50561, 50562, 50563, 50564, 50565, 50567, 50568, 50569, 50570, 50604,
        ]
      }, {
        name: sets.set_independence_2017_2,
        itemsk: [
          50571, 50572, 50573, 50574, 50575, 50576, 50577, 50578, 50579, 50604,
        ]
      }, {
        name: sets.set_independence_2017_3,
        itemsk: [
          50580, 50581, 50582, 50583, 50584, 50585, 50586, 50587, 50588, 50604,
        ]
      }, {
        name: sets.set_independence_2017_4,
        itemsk: [
          50589, 50590, 50591, 50592, 50593, 50594, 50595, 50596, 50597, 50598, 50599,
        ]
      }, {
        name: sets.set_independence_2017_5,
        itemsk: [
          50600, 50601, 50602, 50603,
        ]
      }, {
        name: sets.set_prisonbrothers_august_2017,
        itemsk: [
          50614, 50615, 50616, 50617, 50618, 50619, 50620, 50621, 50622,
        ]
      }, {
        name: sets.set_oktoberfest_2017_set_1,
        itemsk: [
          50628, 50629, 50630, 50631, 50632, 50633, 50634, 50635, 50675, 50700,
        ]
      }, {
        name: sets.set_oktoberfest_2017_set_2,
        itemsk: [
          50636, 50637, 50638, 50639, 50640, 50641, 50642, 50643, 50644, 50676, 50700,
        ]
      }, {
        name: sets.set_oktoberfest_2017_set_3,
        itemsk: [
          50645, 50646, 50647, 50648, 50649, 50650, 50651, 50652, 50653, 50677, 50700,
        ]
      }, {
        name: sets.set_oktoberfest_2017_set_4_male,
        itemsk: [
          50654, 50655, 50656, 50657, 50658, 50659, 50660, 50661, 50662, 50663, 50664, 50678,
        ]
      }, {
        name: sets['set_oktoberfest-2017_set_4_female'],
        itemsk: [
          50665, 50666, 50667, 50668, 50669, 50670, 50671, 50692, 50693, 50694, 50695, 50678,
        ]
      }, {
        name: sets.set_oktoberfest_2017_set_5_weapons,
        itemsk: [
          50671, 50672, 50673,
        ]
      }, {
        name: sets.set_fair_2017_clothes,
        itemsk: [
          50701, 50702, 50703, 50704, 50705, 50706, 50707, 50708, 50709, 50710, 50711, 50712,
        ]
      }, {
        name: sets.set_sale_cowboy_2017_clothes,
        itemsk: [
          50713, 50714, 50715, 50716, 50717, 50718, 50719, 50720, 50721, 50722, 50723, 50724,
        ]
      }, {
        name: sets.set_dod_2017_1_clothes,
        itemsk: [
          50725, 50726, 50727, 50728, 50729, 50730, 50731, 50732, 50733, 50734, 50735, 50736,
        ]
      }, {
        name: sets.set_dod_2017_2_clothes,
        itemsk: [
          50737, 50738, 50739, 50740, 50741, 50742, 50743, 50744, 50745, 50746, 50747, 50748,
        ]
      }, {
        name: sets.set_dod_2017_3_clothes,
        itemsk: [
          50749, 50750, 50751, 50752, 50753, 50754, 50755, 50756, 50757, 50758, 50759, 50841,
        ]
      }, {
        name: sets.set_xmas17_male,
        itemsk: [
          50797, 50798, 50799, 50800, 50801, 50802, 50803, 50804, 50805, 50806, 50807, 50838,
        ]
      }, {
        name: sets.set_xmas17_female,
        itemsk: [
          50808, 50809, 50810, 50811, 50812, 50813, 50814, 50815, 50816, 50817, 50818, 50838,
        ]
      }, {
        name: sets['2017_ifbc_clothes'],
        itemsk: [
          50821, 50822, 50823, 50824, 50825, 50826, 50827, 50828, 50829, 50830, 50831, 50835, 50836, 50837,
        ]
      }, {
        name: sets['2018_valentines_set_1'],
        itemsk: [
          50863, 50864, 50865, 50866, 50867, 50868, 50869, 50870, 50871, 50872, 50873, 50880,
        ]
      }, {
        name: sets['2018_valentines_set_3'],
        itemsk: [
          50874, 50875, 50876, 50877, 50878, 50879, 51342,
        ]
      }, {
        name: sets.set_carnival_2018_1,
        itemsk: [
          50885, 50886, 50887, 50888, 50889, 50890, 50891, 50892, 50896,
        ]
      }, {
        name: sets['2018_achievement_set'],
        itemsk: [
          50898, 50899, 50900, 50901, 50902, 50903, 50904, 50905, 50906, 50907, 50908,
        ]
      }, {
        name: sets['2018_easter_set_1'],
        itemsk: [
          50922, 50923, 50924, 50925, 50926, 50927, 50928, 50929, 50930, 50931,
        ]
      }, {
        name: sets['2018_easter_set_3'],
        itemsk: [
          50932, 50933, 50934, 50935, 50936, 50937, 50938, 50939, 50940, 50941,
        ]
      }, {
        name: sets['2018_easter_set_5'],
        itemsk: [
          50942, 50943, 50944, 50945, 50946, 50947, 50948, 50949, 50950, 50951,
        ]
      }, {
        name: sets['2018_easter_set_7'],
        itemsk: [
          50961, 50962, 50963, 50964, 50965, 50966, 50967, 50968, 50969, 50970, 50971,
        ]
      }, {
        name: sets['2018_easter_set_8'],
        itemsk: [
          50972, 50973, 50974, 50975,
        ]
      }, {
        name: sets['2018_sale_set_golden_1'],
        itemsk: [
          50977, 50978, 50992,
        ]
      }, {
        name: sets['2018_10th_set_1'],
        itemsk: [
          50993, 50994, 50995, 50996, 50997, 50998, 50999, 51000, 51001, 51002, 51003, 51004,
        ]
      }, {
        name: sets['2018_doldenset'],
        itemsk: [
          51005, 51006, 51007,
        ]
      }, {
        name: sets['2018_spring_sale'],
        itemsk: [
          51032, 51033, 51034, 51035, 51036, 51037,
        ]
      }, {
        name: sets['2018_soccer_sale'],
        itemsk: [
          51045, 51046, 51047, 51048, 51049, 51050, 51051, 51054, 51067,
        ]
      }, {
        name: sets['2018_soccer_event'],
        itemsk: [
          51053, 51055, 51056, 51060, 51070, 51072, 51079,
        ]
      }, {
        name: sets.independance_event_set1,
        itemsk: [
          51081, 51082, 51083, 51084, 51085, 51086, 51087, 51088, 51089, 51122,
        ]
      }, {
        name: sets.independance_event_set3,
        itemsk: [
          51090, 51091, 51092, 51093, 51094, 51095, 51096, 51097, 51098, 51122,
        ]
      }, {
        name: sets.independance_event_set5,
        itemsk: [
          51100, 51101, 51102, 51103, 51104, 51105, 51106, 51123, 51107, 51122,
        ]
      }, {
        name: sets.independance_event_set7,
        itemsk: [
          51108, 51109, 51110,
        ]
      }, {
        name: sets.independance_event_set8,
        itemsk: [
          51111, 51112, 51113, 51114, 51115, 51116, 51117, 51118, 51119, 51120, 51121,
        ]
      }, {
        name: sets.chef_set_2,
        itemsk: [
          51128, 51129, 51130, 51131, 51132, 51133, 51134, 51135, 51136, 51137, 51138,
        ]
      }, {
        name: sets.gold_rush_clothes,
        itemsk: [
          51142, 51143, 51144, 51145, 51146, 51147, 51148, 51149, 51150, 51151, 51152, 51153, 51154, 51155,
        ]
      }, {
        name: sets.community_events_set,
        itemsk: [
          50856, 51162,
        ]
      }, {
        name: sets.oktoberfest_set2018_1,
        itemsk: [
          51165, 51166, 51167, 51168, 51169, 51170, 51171, 51172, 51173, 51174,
        ]
      }, {
        name: sets.oktoberfest_set2018_3,
        itemsk: [
          51175, 51176, 51177, 51178, 51179, 51180, 51181, 51182, 51183, 51184,
        ]
      }, {
        name: sets.oktoberfest_set2018_5,
        itemsk: [
          51185, 51186, 51187, 51188, 51189, 51190, 51191, 51192, 51193, 51194,
        ]
      }, {
        name: sets.oktoberfest_set2018_7,
        itemsk: [
          51195, 51196, 51197, 51198, 51199, 51200, 51201, 51202, 51203, 51204, 51205,
        ]
      }, {
        name: sets.oktoberfest_set2018_8,
        itemsk: [
          51206, 51207, 51208, 51209, 51210, 51211, 51212, 51213, 51214, 51215, 51216,
        ]
      }, {
        name: sets.oktoberfest_set2018_9,
        itemsk: [
          51217, 51218, 51219,
        ]
      }, {
        name: sets.lucille_weapon_set,
        itemsk: [
          51243, 51244, 51245, 51246, 51247, 51249, 51250,
        ]
      }, {
        name: sets.dod_2018_set_1,
        itemsk: [
          51281, 51282, 51283, 51284, 51285, 51286, 51287, 51288, 51289, 51290, 51291, 51292,
        ]
      }, {
        name: sets.dod_2018_set_4,
        itemsk: [
          51293, 51294, 51295, 51296, 51297, 51298, 51299, 51300, 51301, 51302, 51303, 51304,
        ]
      }, {
        name: sets.dod_2018_set_7,
        itemsk: [
          51269, 51270, 51271, 51272, 51273, 51274, 51275, 51276, 51277, 51278, 51279, 51280,
        ]
      }, {
        name: sets.black_friday_set,
        itemsk: [
          10260, 40201, 42200, 51306, 51307, 51308, 51790, 51791, 51792, 51793, 51794, 51795, 51796, 51797,
        ]
      }, {
        name: sets.holiday_2018_set,
        itemsk: [
          51313, 51314, 51315, 51316, 51317, 51318, 51319, 51320, 51321, 51322, 51323, 51325,
        ]
      }, {
        name: sets.valentine_2019_set_1,
        itemsk: [
          51335, 51336, 51337, 51338, 51339, 51340, 51341,
        ]
      }, {
        name: sets.valentine_2019_set_2,
        itemsk: [
          51343, 51344, 51345, 51346, 51347, 51348, 51349, 51350, 51351, 51352, 51353, 51354,
        ]
      }, {
        name: sets.spring_1_2019,
        itemsk: [
          51399, 51400, 51401, 51402, 51403, 51404, 51405, 51406, 51407, 51408, 51409,
        ]
      }, {
        name: sets.easter_set_1_2019,
        itemsk: [
          51410, 51411, 51412, 51413, 51414, 51415, 51416, 51417, 51418,
        ]
      }, {
        name: sets.easter_set_3_2019,
        itemsk: [
          51419, 51420, 51421, 51422, 51423, 51424, 51425, 51426, 51427, 51428,
        ]
      }, {
        name: sets.easter_set_5_2019,
        itemsk: [
          51429, 51430, 51431, 51442, 51433, 51434, 51435, 51436, 51437, 51438,
        ]
      }, {
        name: sets.easter_set_7_2019,
        itemsk: [
          51439, 51440, 51441, 51442, 51443, 51444, 51445, 51446, 51447, 51448, 51449, 51450,
        ]
      }, {
        name: sets.easter_set_10_2019,
        itemsk: [
          51451, 51452, 51453,
        ]
      }, {
        name: sets.summer_spirit,
        itemsk: [
          51464, 51465, 51466, 51467,
        ]
      }, {
        name: sets.independence_day_2019_set_1,
        itemsk: [
          51489, 51490, 51491, 51492, 51493, 51494, 51495, 51496, 51497,
        ]
      }, {
        name: sets.independence_day_2019_set_3,
        itemsk: [
          51498, 51499, 51500, 51501, 51502, 51503, 51504, 51505, 51506,
        ]
      }, {
        name: sets.independence_day_2019_set_5,
        itemsk: [
          51507, 51508, 51509, 51510, 51511, 51512, 51513, 51514, 51515,
        ]
      }, {
        name: sets.independence_day_2019_set_7,
        itemsk: [
          51516, 51517, 51518, 51519, 51520, 51521, 51528, 51529, 51530, 51531, 51532,
        ]
      }, {
        name: sets.independence_day_2019_set_8,
        itemsk: [
          51522, 51523, 51524, 51525, 51526, 51527, 51528, 51529, 51530, 51531, 51532,
        ]
      }, {
        name: sets.independence_day_2019_set_11,
        itemsk: [
          51539, 51540, 51541,
        ]
      }, {
        name: sets.independence_day_2019_set_12,
        itemsk: [
          51550, 51551, 51552,
        ]
      }, {
        name: sets.sale_jfry_set_2019,
        itemsk: [
          51612, 51613, 51614, 51615, 51616, 51798,
        ]
      }, {
        name: sets.okt_setwof_2019_1,
        itemsk: [
          51658, 51659, 51660, 51661, 51662, 51663, 51664, 51665, 51666, 51667,
        ]
      }, {
        name: sets.okt_setwof_2019_3,
        itemsk: [
          51668, 51669, 51670, 51671, 51672, 51673, 51674, 51675, 51676, 51677,
        ]
      }, {
        name: sets.okt_setwof_2019_5,
        itemsk: [
          51678, 51679, 51680, 51681, 51682, 51683, 51684, 51685, 51686, 51687,
        ]
      }, {
        name: sets.okt_setwof_2019_7,
        itemsk: [
          51688, 51689, 51690, 51691, 51692, 51693, 51694, 51695, 51696, 51697, 51698,
        ]
      }, {
        name: sets.okt_setwof_2019_9,
        itemsk: [
          51699, 51700, 51701, 51702, 51703, 51704, 51705, 51706, 51707, 51708, 51709,
        ]
      }, {
        name: sets.okt_setwof_2019_8,
        itemsk: [
          51721, 51722, 51723,
        ]
      }, {
        name: sets.dod_2019_set_1,
        itemsk: [
          51725, 51726, 51727, 51728, 51729, 51730, 51731, 51732, 51733, 51734, 51735, 51736,
        ]
      }, {
        name: sets.dod_2019_set_4,
        itemsk: [
          51751, 51752, 51753, 51754, 51755, 51756, 51757, 51758, 51759, 51760, 51761, 51762,
        ]
      }, {
        name: sets.dod_2019_set_7,
        itemsk: [
          51763, 51764, 51765, 51766, 51767, 51768, 51769, 51770, 51771, 51772, 51773, 51774,
        ]
      }, {
        name: sets.christmas_set_1_2019,
        itemsk: [
          51799, 51800, 51801, 51802, 51803, 51804, 51805, 51806, 51807, 51808, 51809, 51811,
        ]
      },
    ];
    var qs = QIS.sets;
    var i = qs.length;
    while (i--) {
      var si = qs[i];
      if (!si.name)
        qs.splice(i, 1);
      else if (si.name.name)
        si.name = si.name.name;
    }
    var replUml = function (str) {
      return str.toUpperCase().replace(/"/g, '').replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Ő/g, 'O').replace(/Ú|Ü|Ű/g, 'U').replace(/Ś/g, 'S');
    };
    qs.sort(function (a, b) {
      var a1 = replUml(a.name);
      var b1 = replUml(b.name);
      return (a1 == b1) ? 0 : (a1 > b1) ? 1 :  - 1;
    });
  };
  QIS.gui = {
    popupMenu: null,
  };
  QIS.init = function () {
    QIS.gui.menuButton = new QIS.MenuButton('data:image/png;base64,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', QIS.name, QIS.popup);
  };
  QIS.popup = function (button, e) {
    if (!QIS.gui.popupMenu) {
      QIS.start();
      QIS.gui.popupMenu = new west.gui.Selectbox().setWidth(250);
      QIS.gui.popupMenu.addListener(QIS.findSet);
      var sets = QIS.sets;
      for (var i = 0; i < sets.length; i++) {
        var itemimg = sets[i].img || sets[i].itemsk[0];
        var NAME = sets[i].name;
        QIS.gui.popupMenu.addItem(i, '<img src="' + ItemManager.getByBaseId(itemimg).image + '" height="20" width="20">' + '<div style="padding-right: 20px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">' + NAME + '</div>', NAME);
      }
    }
    QIS.gui.popupMenu.show(e);
  };
  QIS.findSet = function (id) {
    var items = [],
    base = QIS.sets[id].items,
    upgrade = QIS.sets[id].itemsk,
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
    if (invItems.length > 0) {
      if (!wman.getById(Inventory.uid))
        Inventory.open();
      Wear.open();
      if (custom && QIS.sets[id].img != QIS.equImg)
        Inventory.showCustomItems(invItems);
      else
        Inventory.showSearchResult(invItems);
    } else
      new UserMessage(QISlang.nothingFound, 'hint').show();
  };
  QIS.init();
});
