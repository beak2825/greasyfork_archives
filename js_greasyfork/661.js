// ==UserScript==
// @name        WoTStatScript
// @version     0.9.19.1.0
// @description More info for World of Tanks profile page. Updated for the new style.
// @author      Orrie
// @namespace   http://forum.worldoftanks.eu/index.php?/topic/263423-
// @icon        https://i.imgur.com/AxOhQ7C.png
// @include     http*://worldoftanks.eu/*/accounts/*/*
// @include     http*://worldoftanks.ru/*/accounts/*/*
// @include     http*://worldoftanks.com/*/accounts/*/*
// @include     http*://worldoftanks.asia/*/accounts/*/*
// @include     http*://worldoftanks.kr/*/accounts/*/*
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @connect     api.worldoftanks.eu
// @connect     api.worldoftanks.ru
// @connect     api.worldoftanks.com
// @connect     api.worldoftanks.asia
// @connect     api.worldoftanks.kr
// @connect     eu.wargaming.net
// @connect     ru.wargaming.net
// @connect     na.wargaming.net
// @connect     asia.wargaming.net
// @connect     kr.wargaming.net
// @connect     www.wnefficiency.net
// @connect     jaj22.org.uk
// @connect     puu.sh
// @require     https://greasyfork.org/scripts/18946-tablesort/code/Tablesort.js?version=120660
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/661/WoTStatScript.user.js
// @updateURL https://update.greasyfork.org/scripts/661/WoTStatScript.meta.js
// ==/UserScript==
// jshint
/* globals $, Raphael, GM_info, GM_xmlhttpRequest, GM_setValue, GM_getValue, GM_deleteValue, GM_listValues */
(function() {
	try {
	// global vars
	var w = window, d = document, c = d.cookie, n = navigator, fragment = d.createDocumentFragment();

	// get server info and webpage
	var wg = {host:d.location.host, href:d.location.href, clan:{}};
	wg.srv = wg.host.match(/\.(eu|ru|com|asia|kr)/)[1].replace(/com/,"na");
	wg.img = wg.srv.replace(/na/,"us");

	// getting userinfo and checking if own profile
	var profileName_header = d.getElementById('js-profile-name');
	wg.name = profileName_header.innerHTML;
	wg.id = wg.href.match(/\/(\d+)/)[1];
	wg.login = (c.match(/user_name=(\w+)/) || false)[1];
	wg.own = wg.login == wg.name;

	// script variables
	var sc = {
		vers: ((GM_info) ? GM_info.script.version : ""),
		host: "http://greasyfork.org/scripts/661-wotstatscript",
		user: {
			wl: "http://forum.wotlabs.net/index.php?/user/1618-orrie/",
			wot: "http://worldoftanks.eu/community/accounts/505838943-Orrie/"
		},
		top: {
			eu: "http://forum.worldoftanks.eu/index.php?showtopic=263423",
			na: "http://forum.worldoftanks.com/index.php?showtopic=404652"
		},
		cred: { // translators
			cs: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/500744969/'>Crabtr33</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/508323506/'>Ragnarocek</a></td></tr><tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/508904714/'>jViks</a></td></tr>" ,
			de: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/504873051/'>ArtiOpa</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/501118529/'>Crakker</a></td></tr><tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/501072645/'>multimill</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/500373105/'>coolathlon</a></td></tr>",
			fr: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/506641783/'>SuperPommeDeTerre</a></td></tr>",
			pl: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/501801562/'>KeluMocy</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/504412736/'>pokapokami</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/500414963/'>zdzich</a></td></tr>",
			es: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/512759883/'>Frodo45127</a></td></tr>",
			tr: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/500400806/'>Ufuko</a></td></tr>",
			ru: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.ru/community/accounts/291063/'>Bananium</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.ru/community/accounts/14179676/'>Minamoto_ru</a></td></tr>"
		},
		api: {
			wg_key: "a7595640a90bf2d19065f3f2683b171c",
			wn8: "http://www.wnefficiency.net/exp/expected_tank_values_latest.json",
			wn9: "http://jaj22.org.uk/tankdata/exp_wn9.json",
			ch: "https://"+wg.srv+".wargaming.net/clans/wot/playerslist/api/accounts/"+wg.id+"/"
		},
		srv: {
			wl: false,   // wotlabs
			nm: false,   // noobmeter
			vb: false,   // vbaddict
			ws: false,   // wotstats
			cs: false,   // wotcs
			wlf: false,  // wot-life
			ct: false,   // clan tools
			aos: false,  // age of strife
			kttc: false, // kttc
			wots: false, // wots
			ch: false,   // clan history
			wr: false,   // wotreplays
			we: false    // wot event stats
		},
		wn: {v: {}},
		stats: {},
		pedia: {},
		nm: {
			id: "orrie_js_174043" // noobmeter api id
		},
		locSet: {
			cur: [(c.match(/hllang=(\w+)/)) ? c.match(/hllang=(\w+)/)[1] : "en", wg.href.match(/\.\w+\/([\w-]+)\//)[1]],
			sup: ["en", "ru", "cs", "de", "fr", "pl", "es", "tr"],
			miss: 0
		},
		loc: [ // localization
			{i:0, en: ",", ru: " ", cs: " ", de: ".", fr: " ", pl: " ", es:".", tr: "."}, // thousands separator
			{i:1, en: "Go to Bottom", ru: "Пролистать вниз", cs: "Konec stránky", de: "nach unten", fr: "Aller à la fin", pl: "Koniec strony", es: "Ir al final", tr: "Aşağı İn"},
			{i:2, en: "Go to Top", ru: "Пролистать наверх", cs: "Začátek stránky", de: "nach oben", fr: "Aller au début", pl: "Początek strony", es: "Ir al principio", tr: "Yukarı Çık"},
			{i:3, en: "Days Ago", ru: "Дней назад", cs: "dnů", de: "Tage in WOT aktiv", fr: "jours", pl: "Dni temu", es: "Días", tr: "Gün Önce"},
			{i:4, en: "Player Stats:", ru: "Статистика игрока:", cs: "Stat. hráče:", de: "Spielerstatistik", fr: "Statistiques du joueur:", pl: "Statystyki gracza:", es: "Estadísticas del jugador:", tr: "Oyuncu Statları"},
			{i:5, en: "Signature:", ru: "Подпись:", cs: "Podpis:", de: "Forumsignatur", fr: "Signature:", pl: "Sygnatura do forum:", es: "Firma", tr: "İmza"},
			{i:6, en: "Light", ru: "Светлые тона", cs: "Světlý", de: "Signatur Weiß", fr: "Claire", pl: "Jasna", es: "Clara", tr: "Açık"},
			{i:7, en: "Dark", ru: "Тёмные тона", cs: "Tmavý", de: "Signatur Schwarz", fr: "Foncée", pl: "Ciemna", es: "Oscura", tr: "Koyu"},
			{i:8, en: "Replays:", ru: "Реплеи:", cs: "Záznamy:", de: "Replays", fr: "Replays:", pl: "Powtórki:", es: "Repeticiones:", tr: "Replayler"},
			{i:9, en: "Victories", ru: "Победы", cs: "Vítězství", de: "Siege", fr: "Victoires", pl: "Zwycięstw", es: "Victorias", tr: "Zaferler"},
			{i:10, en: "Battles Participated", ru: "Участий в битвах", cs: "Počet bitev", de: "Gefechte geführt", fr: "Batailles participées", pl: "Bitew", es: "Batallas jugadas", tr: "Savaş Katılımı"},
			{i:11, en: "Average Experience", ru: "Средний опыт", cs: "Průměrné zkušenosti", de: "Durchnittl. Erfahrung", fr: "Expérience moyenne", pl: "Średnie doświadczenie", es: "Experiencia media", tr: "Ortalama Deneyim"},
			{i:12, en: "Average Tier", ru: "Средний уровень танка", cs: "Průměrný Tier", de: "Durchschnittl. Stufe", fr: "Tiers moyen", pl: "Średni poziom pojazdu", es: "Tier medio", tr: "Ortalama Seviye"},
			{i:13, en: "Win/Loss Ratio", ru: "Отношение Победы/Поражения", cs: "Poměr vítězství/porážek", de: "Verhältnis Siege/ Niederlagen", fr: "Ratio Victoires/Défaites", pl: "Zwycięstwa/porażki", es: "Ratio de victorias/derrotas", tr: "Zafer/Kayıp Oranı"},
			{i:14, en: "Performance Ratings", ru: "Рейтинги производительности", cs: "Hodnocení bojového výkonu", de: "Leistungsverhältnis", fr: "Indices de performances", pl: "Statystyki wydajności", es: "Ratios de rendimiento", tr: "Performans Değerleri"},
			{i:15, en: "Fetching...", ru: "Загрузка...", cs: "Načítám...", de: "abrufen...", fr: "Récupération...", pl: "Pobieranie...", es: "Recuperando...", tr: "Getiriliyor..."},
			{i:16, en: "Performance Rating Calculations", ru: "Вычисления рейтинга производительности", cs: "Výpočet hodnocení bojového výkonu", de: "Leistungsberechnung", fr: "Calculs des indicateurs de performances", pl: "Obliczenia statystyk wydajności", es: "Cálculos del ratio de rendimiento", tr: "Performans Değeri Hesaplamaları"},
			{i:17, en: "Formula Type", ru: "Тип формулы", cs: "Typ výpočtu", de: "Formel", fr: "Type de formule", pl: "Formuła", es: "Tipo de fórmula", tr: "Formül Tipi"},
			{i:18, en: "Total", ru: "Всего", cs: "Celkem", de: "Gesamt", fr: "Total", pl: "Wynik", es: "Total", tr: "Toplam"},
			{i:19, en: "Scaled", ru: "Шкала", cs: "Stupnice", de: "Skaliert", fr: "A l'échelle", pl: "Skalowanie", es: "Escala", tr: "Ölçek"},
			{i:20, en: "Destroyed", ru: "Уничтожено", cs: "Zničeno", de: "Zerstört", fr: "Détruits", pl: "Fragi", es: "Destruidos", tr: "imha"},
			{i:21, en: "Damage", ru: "Урон", cs: "Poškození", de: "Schaden", fr: "Dommages", pl: "Obrażenia", es: "Daño", tr: "Hasar"},
			{i:22, en: "Detected", ru: "Обнаружено", cs: "Detekováno", de: "Aufgeklärt", fr: "Détectés", pl: "Wykrycia", es: "Detectados", tr: "Tespit"},
			{i:23, en: "Capping", ru: "Захват", cs: "Obsazení", de: "Erobert", fr: "Capture", pl: "Zdobycie bazy", es: "Capturando", tr: "İşgal"},
			{i:24, en: "Defense", ru: "Оборона", cs: "Obrana", de: "Verteidigt", fr: "Défense", pl: "Obrona bazy", es: "Defendiendo", tr: "Savunma"},
			{i:25, en: "Victories", ru: "Победы", cs: "Vítězství", de: "Siege", fr: "Victoires", pl: "Zwycięstwa", es: "Victorias", tr: "Zaferler"},
			{i:26, en: "WN9", ru: "WN9", cs: "WN9", de: "WN9", fr: "WN9", pl: "WN9", es: "WN9", tr: "WN9", f:1},
			{i:27, en: "WN8", ru: "WN8", cs: "WN8", de: "WN8", fr: "WN8", pl: "WN8", es: "WN8", tr: "WN8", f:1},
			{i:28, en: "WN7", ru: "WN7", cs: "WN7", de: "WN7", fr: "WN7", pl: "WN7", es: "WN7", tr: "WN7", f:1},
			{i:29, en: "Efficiency", ru: "Эффективность", cs: "Efektivita", de: "Effizienz", fr: "Efficacité", pl: "Efficiency", es: "Eficiencia", tr: "Efficiency", f:1},
			{i:30, en: "NoobMeter", ru: "NoobMeter", cs: "NoobMeter", de: "NoobMeter", fr: "NoobMeter", pl: "NoobMeter", es: "NoobMeter", tr: "NoobMeter", f:1},
			{i:31, en: "What is WN Efficiency?", ru: "Что такое WN эффективность?", cs: "Co je WN hodnocení?", de: "Was bedeutet WN Effizienz", fr: "Qu'est que l'efficacité WN ?", pl: "Czym jest statystyka wydajności WN?", es: "¿Qué es la eficiencia WN?", tr: "WN Efficiency Nedir?"},
			{i:32, en: "Ace Tanker", ru: "Мастер", cs: "Hrdina", de: "Panzer Ass", fr: "As du char", pl: "As Pancerny", es: "As de tanques", tr: "Tank Ası"},
			{i:33, en: "1st Class", ru: "1 степень", cs: "1. třídy", de: "1ter Klasse", fr: "Classe 1", pl: "Pierwsza Klasa", es: "Clase I", tr: "1. Sınıf"},
			{i:34, en: "2nd Class", ru: "2 степень", cs: "2. třídy", de: "2ter Klasse", fr: "Classe 2", pl: "Druga Klasa", es: "Clase II", tr: "2. Sınıf"},
			{i:35, en: "3rd Class", ru: "3 степень", cs: "3. třídy", de: "3ter Klasse", fr: "Classe 3", pl: "Trzecia Klasa", es: "Clase III", tr: "3. Sınıf"},
			{i:36, en: "No Badge", ru: "Нет значка", cs: "Nezískáno", de: "kein Orden", fr: "Aucun badge", pl: "Bez odznaki", es: "Sin medalla", tr: "Rozetsiz"},
			{i:37, en: "Total Vehicles", ru: "Общее количество танки", cs: "Celkem vozidel", de: "Alle Fahrzeuge", fr: "Nombre total de véhicules", pl: "Całkowita liczba pojazdów", es: "Total de vehículos", tr: "Toplam Araçlar"},
			{i:38, en: "Battles Participated", ru: "Участий в битвах", cs: "Počet bitev", de: "An Gefechten teilgenommen", fr: "Batailles participées", pl: "Bitwy", es: "Batallas jugadas", tr: "Savaş Katılımı"},
			{i:39, en: "Victories", ru: "Победы", cs: "Vítězství", de: "Siege", fr: "Victoires", pl: "Zwycięstwa", es: "Victorias", tr: "Zaferler"},
			{i:40, en: "Defeats", ru: "Поражения", cs: "Porážek", de: "Niederlagen", fr: "Défaites", pl: "Porażki", es: "Derrotas", tr: "Yenilgiler"},
			{i:41, en: "Draws", ru: "Ничья", cs: "Remíza", de: "Unentschieden", fr: "Egalités", pl: "Remisy", es: "Empates", tr: "Beraberlikler"},
			{i:42, en: "Battles Survived", ru: "Битв пережито", cs: "Přežito bitev", de: "Gefechte überlebt", fr: "Batailles survécues", pl: "Przetrwane bitwy", es: "Batallas como superviviente", tr: "Hayatta Kalma"},
			{i:43, en: "Average Battles per Day", ru: "Среднее число битв за день", cs: "Průměrný počet bitev za den", de: "Durschnittliche Gefechte pro Tag", fr: "Nombre moyen de batailles par jour", pl: "Średnia bitew na dzień", es: "Media de batallas por día", tr: "Günlük Ortalama Savaş"},
			{i:44, en: "Experience", ru: "Опыт", cs: "Zkušenosti", de: "Erfahrung", fr: "Expérience", pl: "Doświadczenie", es: "Experiencia", tr: "Deneyim"},
			{i:45, en: "Average Experience per Battle", ru: "Средний опыт за битву", cs: "Průměrné zkušenosti za bitvu", de: "Durchschnittserfahrung", fr: "Expérience moyenne par bataille", pl: "Średnie doświadczenie na bitwę", es: "Experiencia media por batalla", tr: "Savaş Başına Ortalama Deneyim"},
			{i:46, en: "Maximum Experience per Battle", ru: "Максимальный опыт за битву", cs: "Maximální zkušenosti za bitvu", de: "Höchste Gefechtserfahrung", fr: "Expérience maximum par bataille", pl: "Maksymalne doświadczenie na bitwę", es: "Experiencia máxima por batalla", tr: "Savaş Başına Maksimum Deneyim"},
			{i:47, en: "Destroyed", ru: "Уничтожено", cs: "Zničeno", de: "Zerstört", fr: "Détruits", pl: "Zniszczeni przeciwnicy", es: "Destruidos", tr: "İmhalar"},
			{i:48, en: "Deaths", ru: "Смертей", cs: "Nepřežil", de: "Tode", fr: "Morts", pl: "Zniszczony", es: "Muertes", tr: "Ölümler"},
			{i:49, en: "Detected", ru: "Обнаружено", cs: "Detekováno", de: "Aufgeklärt", fr: "Détectés", pl: "Wykrytych", es: "Detectados", tr: "Tespitler"},
			{i:50, en: "Hit Ratio", ru: "Коэффициент попаданий", cs: "Přesnost střelby", de: "Trefferquote", fr: "Ratio de hit", pl: "Celność", es: "Ratio de impactos", tr: "İsabet Oranı"},
			{i:51, en: "Damage Caused", ru: "Урона нанесено", cs: "Udělené poškození", de: "Schaden verursacht", fr: "Dommages causés", pl: "Zadane obrażenia", es: "Daño causado", tr: "Yapılan Hasar"},
			{i:52, en: "Damage Received", ru: "Урона получено", cs: "Přijaté poškození", de: "Schaden erhalten", fr: "Dommages reçus", pl: "Otrzymane obrażenia", es: "Daño recibido", tr: "Alınan Hasar"},
			{i:53, en: "Base Capture Points", ru: "Очки захвата", cs: "Bodů obsazení základny", de: "Eroberungspunkte", fr: "Points de capture de base", pl: "Punkty przejęcia bazy", es: "Puntos de captura", tr: "Bölge İşgali Puanı"},
			{i:54, en: "Base Defense Points", ru: "Очки обороны", cs: "Bodů obrany základny", de: "Verteidigungspunkte", fr: "Points de défense de base", pl: "Punkty obrony bazy", es: "Puntos de defensa", tr: "Bölge Savunması Puanı"},
			{i:55, en: "Average Tier", ru: "Средний уровень", cs: "Průměrný Tier", de: "Durchschnittliche Stufe", fr: "Tiers moyen", pl: "Średni poziom pojazdów", es: "Tier media", tr: "Ortalama Seviye"},
			{i:56, en: "Vehicle Tiers", ru: "Уровни техники", cs: "Tiery vozidel", de: "Fahrzeuge Stufe", fr: "Tiers du véhicule", pl: "Poziomy czołgów", es: "Tier de los vehículos:", tr: "Araç Seviyeleri"},
			{i:57, en: "Tier", ru: "Уровень", cs: "Tier", de: "Stufe", fr: "Tiers", pl: "Poziom", es: "Tier", tr: "Seviye", f:1},
			{i:58, en: "Total Vehicles:", ru: "Количество техники:", cs: "Celkem vozidel:", de: "Gesamt Fahrzeuge", fr: "Nombre total de véhicules:", pl: "Całkowita liczba pojazdów:", es: "Total de vehículos:", tr: "Toplam Araçlar"},
			{i:59, en: "Tankopedia", ru: "Танковедение", cs: "Tankpédie", de: "Tankopedia", fr: "Tankopedia", pl: "Tankopedia", es: "Tankopedia", tr: "Tankopedia", f:1},
			{i:60, en: "Tank Statistics", ru: "Статистика танка", cs: "Statistiky vozidel", de: "Panzer Statistik", fr: "Statistiques des chars", pl: "Statystyki czołgu", es: "Estadísticas de tanques", tr: "Tank İstatistikleri"},
			{i:61, en: "Premium Tanks", ru: "Премиум танки", cs: "Premium tanky", de: "Premium Panzer", fr: "Chars premiums", pl: "Czołgi premium", es: "Tanques premium", tr: "Premium Tanklar"},
			{i:62, en: "Copy stats to Clipboard", ru: "Скопировать в буфер обмена", cs: "Kopírovat Stat. do schránky", de: "Statistiken in Zwischenablage kopieren", fr: "Copier les statistiques vers le presse-papiers", pl: "Kopiuj statystyki do schowka", es: "Copiar estadísticas al portapapeles", tr: "İstatistikleri Panoya Kopyala"},
			{i:63, en: "Press Ctrl+C, or Right-Click and Copy", ru: "Нажмите Ctrl+C или ПКМ и Скопировать", cs: "Stiskni Ctrl+C, nebo klikni pravým tl. myši a vyber Kopírovat", de: "STRG+C/ rechter Mausklick und Kopieren", fr: "Appuyez sur Ctrl+C, ou clic droit et Copier", pl: "Naciśnij Ctrl+C, lub prawy klawisz myszy i 'Kopiuj'", es: "Presiona Ctrl+C, o haz clic derecho y pulsa Copiar.", tr: "Ctrl+C Tuşuna Bas, veya Sağ Tıkla ve Kopyala"},
			{i:64, en: "WoTStatScript not active, because of player having 0 battles", ru: "Скрипт неактивен, т.к. у игрока 0 битв", cs: "WoTStatScript není aktivní, protože hráč má 0 bitev", de: "WoTStatScript inaktiv wegen fehlender Gefechte", fr: "WoTStatScript n'est pas actif, car le joueur a 0 batailles", pl: "WoTStatScript nieaktywny, ponieważ gracz rozegrał 0 bitew", es: "El script WoTStat no está activo, porque el jugador no ha jugado ninguna batalla.", tr: "WoTStat Scipt aktif değil, çünkü oyuncunun 0 savaşı var."},
			{i:65, en: "Clan Stats:", ru: "Статистика клана:", cs: "Stat. klanu:", de: "Clanstatistiken", fr: "Statistiques du clan:", pl: "Statystyki klanu:", es: "Estadísticas del clan:", tr: "Klan İstatistikleri"},
			{i:66, en: "Replays:", ru: "Реплеи:", cs: "Záznamy:", de: "Replays", fr: "Replays:", pl: "Powtórki:", es: "Repeticiones:", tr: "Replayler"},
			{i:67, en: "Tier 10 Tanks", ru: "Уровень 10 Только", cs: "Pouze Tier 10", de: "nur Stufe 10", fr: "Seulement les tiers 10", pl: "Tylko 10 tier", es: "Sólo tier 10", tr: "Seviye 10 Tanklar"},
			{i:68, en: "Battles missing from API, ratings may be inaccurate", ru: "Отсутствует Battles от API, рейтинги могут быть неточными", cs: "Některé bitvy se z API nenačetly, hodnocení může být nepřesné", de: "Fehlende API Gefechtsdaten, Bewertungen können ungenau sein", fr: "Des batailles manquent de l'API, les indices peuvent être faussés", pl: "Brakujące bitwy, obliczenia mogą być niedokładne", es: "Faltan batallas desde la API, por lo que los ratios pueden no ser muy precisos.", tr: "Savaş bilgileri eksik, hesaplamalar hatalı olabilir."},
			{i:69, en: "Hit Ratio", ru: "Коэффициент попаданий", cs: "Přesnost střelby", de: "Trefferquote", fr: "Ratio de hit", pl: "Celność", es: "Ratio de impacto", tr: "İsabet Oranı"},
			{i:70, en: "Average Damage", ru: "Средний Урона", cs: "Průměrné poškození", de: "Durchschnittlicher Schaden", fr: "Dommages moyens", pl: "Średnie obrażenia", es: "Daño medio", tr: "Ortalama Hasar"},
			{i:71, en: "Stats for", ru: "Cтатистика для", cs: "Statistika hráče", de: "Statistik für", fr: "Statistiques pour ", pl: "Statystyki z", es: "Estadísticas para", tr: "İstatistikler"},
			{i:72, en: "Battles:", ru: "Битвы:", cs: "Bitev:", de: "Gefechte", fr: "Batailles:", pl: "Bitew:", es: "Batallas:", tr: "Savaşlar"},
			{i:73, en: "Clan History:", ru: "История клана:", cs: "Historie klanů:", de: "Clan Historie", fr: "Historique de clan :", pl: "Poprzednie klany:", es: "Clan History:", tr: "Clan History:"},
			{i:74, en: "No Rating", ru: "Нет рейтинга", cs: "Bez hodnocení", de: "Kein Rating", fr: "Aucun indice de performance", pl: "Brak klasyfikacji", es: "No Rating", tr: "No Rating"},
			{i:75, en: "None", ru: "Никто", cs: "Žádné", de: "Kein", fr: "Aucun", pl: "Brak", es: "None", tr: "None"},
			{i:76, en: "Error", ru: "Oшибка", cs: "Chyba", de: "Fehler", fr: "Erreur", pl: "Błąd", es: "Error", tr: "Error"},
			{i:77, en: "Missing Tanks", ru:"Отсутствующие танки", cs: "Chybějící tanky", de: "Fehlende Panzer", fr: "Chars manquants", pl: "Brakujące czołgi", es: "Missing Tanks", tr: "Missing Tanks"},
			{i:78, en: "Refresh WN Tables", ru: "Обновить значения для рейтингов WN", cs: "Refresh WN Tables", de: "Refresh WN Tables", fr: "Refresh WN Tables", pl: "Odświerz wartości WN", es: "Refresh WN Tables", tr: "Refresh WN Tables"},
			{i:79, en: "Script Menu", ru: "Меню скрипта", cs: "Nastavení scriptu", de: "Script-Menü", fr: "Menu du script", pl: "Opcje skryptu", es:"Script Menu", tr: "Script Menu"},
			{i:80, en: "Famepoints:", ru: "Очки славы:", cs: "Body slávy:", de: "Ruhmespunkte:", fr: "Points de renommée:", pl: "Punkty sławy:", es:"Famepoints:", tr: "Famepoints:"},
			{i:81, en: "Tanks missing from WN8 table, ratings may be inaccurate", ru:"Отсутствуют танки в таблице WN8, рейтинги могут быть не точными", cs: "Některé tanky chybí ve WN8 tabulce, statistiky mohou být nepřesné", de: "Einige Panzer fehlen in der WN8-Tabelle; Ratings können abweichen", fr: "Certains chars sont absents de la table WN8, les indices de performances peuvent être faussés", pl: "Czołgi nie występujące w tabeli WN8, wartości mogą być niedokładne.", es:"Tanks missing from WN8 table, ratings may be inaccurate", tr: "Tanks missing from WN8 table, ratings may be inaccurate"},
			{i:82, en: "Account banned until:", ru: "Аккаунт заблокирован до", cs: "Konto zabanováno do:", de: "Account gebannt bis:", fr: "Compte banni jusqu'au :", pl: "Konto zbanowane do:", es:"Account banned until:", tr: "Account banned until:"},
			{i:83, en: "Last Battle:", ru: "Последние бои:", cs: "Poslední bitva:", de: "Letztes Gefecht:", fr: "Dernière bataille :", pl: "Ostatnia bitwa:", es:"Last Battle:", tr: "Last Battle:"},
			{i:84, en: "Max & Assist Performance", ru: "Максимальная эффективность и помощь", cs: "Nej výkony & Asistence", de: "Performances Max & Assistance", fr: "Max & Assist Performance", pl: "Najlepsze wyniki i Asysty", es:"Max & Assist Performance", tr: "Max & Assist Performance"},
			{i:85, en: "Tanking Performance", ru: "Танковая эффективность", cs: "Tankovací výkon", de: "Tanking Performance", fr: "Performanec de Tanking", pl: "Wyniki na czołgach", es:"Tanking Performance", tr: "Tanking Performance"},
			{i:86, en: "Maximum Damage in a Battle", ru: "Максимальный урон за бой", cs: "Nejvyšší poškození v bitvě", de: "Maximum Damage in a Battle", fr: "Dommages maximums effectués", pl: "Największa ilość zadancyh uszkodzeń w bitwie", es:"Maximum Damage in a Battle", tr: "Maximum Damage in a Battle"},
			{i:87, en: "Maximum Destroyed in a Battle", ru: "Максимально унечтожено за бой", cs: "Nejvíce zničení v bitvě", de: "Maximum Destroyed in a Battle", fr: "Nb de chars détruits maximum", pl: "Największa liczba zniszczonych czołgów w bitwie", es:"Maximum Destroyed in a Battle", tr: "Maximum Destroyed in a Battle"},
			{i:88, en: "Maximum Experience in a Battle", ru: "Максимально опыта за бой", cs: "Nejvíce zkušeností v bitvě", fr: "Maximum Experience in a Battle", de: "Expérience maximum", pl: "Największa ilość doświadczenia za bitwę", es:"Maximum Experience in a Battle", tr: "Maximum Experience in a Battle"},
			{i:89, en: "Damage Assisted", ru: "Урон, нанесённый с вашей помощью", cs: "Asistované poškození", de: "Schaden durch Unterstützung", fr: "Dommages assistés", pl: "Uszkodzenia po asyscie", es:"Damage Assisted", tr: "Damage Assisted"},
			{i:90, en: "Damage Assisted with Radio", ru: "Урон по вашим разведданным", cs: "Asistované poškození spotováním", de: "Schaden durch Aufklärung", fr: "Dommages assistés par radio", pl: "Uszkodzenia po asyscie przy użyciu radia", es:"Damage Assisted with Radio", tr: "Damage Assisted with Radio"},
			{i:91, en: "Damage Assisted with Tracking", ru: "Урон после вашего попадания, сбившего гусеницу", cs: "Asistované poškození detrackováním", de: "Schaden durch Ketten", fr: "Dommages assistés par détrack", pl: "Uszkodzenia po asyscie po uszkodzeniu gąsienic", es:"Damage Assisted with Tracking", tr: "Damage Assisted with Tracking"},
			{i:92, en: "Direct Hits Received", ru: "Прямых попаданий получено", cs: "Obdrženo přímých zásahů", de: "Erhaltene Schüsse", fr: "Tirs directs reçus", pl: "Otrzymane strzały", es:"Direct Hits Received", tr: "Direct Hits Received"},
			{i:93, en: "Penetrations Received", ru: "Пробитий получено", cs: "Obdrženo penetrací", de: "Erhaltene Durchschläge", fr: "Pénétrations reçues", pl: "Otrzymane strzały z penetracją", es:"Penetrations Received", tr: "Penetrations Received"},
			{i:94, en: "No Damage Direct Hits Recieved", ru: "Попаданий без урона", cs: "Obdrženo zásahů bez poškození", de: "Erhaltene Schüsse ohne Schaden", fr: "Aucun tir direct reçu", pl: "Otrzymane strzały bez otrzymanych uszkodzeń", es:"No Damage Direct Hits Recieved", tr: "No Damage Direct Hits Recieved"},
			{i:95, en: "Explosion Hits Recieved", ru: "Фугасных попаданий получено", cs: "Obdrženo explozivních zásahů", de: "Erhaltene HE-Schüsse", fr: "Tirs par explosion reçus", pl: "Otrzymane strzały z wybuchem", es:"Explosion Hits Recieved", tr: "Explosion Hits Recieved"},
			{i:96, en: "Damage Blocked", ru: "Заблокировано урона", cs: "Poškození zastavené pancířem", de: "Abgewehrter Schaden", fr: "Dommages bloqués", pl: "Ilość uszkodzeń zablokowanych przez pancerz", es:"Damage Blocked", tr: "Damage Blocked"},
			{i:97, en: "Trees Driven Down", ru: "Повалено деревьев", cs: "Pokáceno stromů", de: "Umgefahrene Bäume", fr: "Arbres abbatus", pl: "Ilość przewróconych drzew", es:"Trees Driven Down", tr: "Trees Driven Down"},
			{i:98, en: "Armor-Use Efficiency", ru: "Эффективность использования брони", cs: "Efektivita využítí pancíře", de: "Panzerungs-Effektivität", fr: "Efficacité d'utilisation du blindage", pl: "Eektywność użycia pancerza", es:"Armor-Use Efficiency", tr: "Armor-Use Efficiency"},
			{i:99, en: "Overall", ru: "В общем", cs: "Celkem", de: "Gesamt", fr: "Global", pl: "Ogólne", es:"Overall", tr: "Overall"},
			{i:100, en: "Max, Assist & Tanking", ru: "Лучшее, ассист и танкование", cs: "Nej, Asist & Tankování", de: "Max., Aufklärung & Tanken", fr: "Max, Assistance & Tanking", pl: "Maksymalne wyniki, Asysty i wyniki na czołgach", es:"Max, Assist & Tanking", tr: "Max, Assist & Tanking"},
			{i:101, en: "Global Map", ru: "Глобальная карта", cs: "Klanové války", de: "Weltkarte", fr: "Carte globale", pl: "Mapa globalna", es:"Global Map", tr: "Global Map"},
			{i:102, en: "Medium - T6", ru: "Средний - 6 ур.", cs: "Střední - T6", de: "Medium - T6", fr: "Moyen - T6", pl: "Medium - T6", es:"Medium - T6", tr: "Medium - T6", f:1},
			{i:103, en: "Champion - T8", ru: "Чемпионский - 8 ур.", cs: "Šampión - T8", de: "Champion - T8", fr: "Champion - T8", pl: "Champion - T8", es:"Champion - T8", tr: "Champion - T8", f:1},
			{i:104, en: "Absolute - T10", ru: "Абсолютный  - 10 ур.", cs: "Absolutní - T10", de: "Absolut - T10", fr: "Absolu - T10", pl: "Absolute - T10", es:"Absolute - T10", tr: "Absolute - T10", f:1},
			{i:105, en: "Strongholds", ru: "Укрепрайоны", cs: "Opevnění", de: "Festungen", fr: "Bastions", pl: "Twierdze", es:"Strongholds", tr: "Strongholds"},
			{i:106, en: "Stronghold Skirmish", ru: "Укрепрайоны Вылазки", cs: "Opevnění - Šarvátky", de: "Festungen Bollwerk", fr: "Batailles de bastion", pl: "Potyczki na twierdach", es:"Stronghold Skirmish", tr: "Stronghold Skirmish"},
			{i:107, en: "Stronghold Defense", ru: "Укрепрайоны защита", cs: "Opevnění - Obrana", de: "Festungs-Verteidigung", fr: "Défense de bastion", pl: "Obrony twierdz", es:"Stronghold Defense", tr: "Stronghold Defense"},
			{i:108, en: "Team Battles", ru: "Командные бои", cs: "Týmové bitvy", de: "Teamgefechte", fr: "Batailles en équipe", pl: "Bitwy drużynowe", es:"Team Battles", tr: "Team Battles"},
			{i:109, en: "Ranked Team Battles", ru: "Ранговые командные бои", cs: "Hodnocené týmové bitvy", de: "Gewertete Teamgefechte", fr: "Batailles en équipe classées", pl: "Bitwy drużynowe rankingowe", es:"Ranked Team Battles", tr: "Ranked Team Battles"},
			{i:110, en: "Other Modes", ru: "Другие режимы", cs: "Ostatní bitvy", de: "Andere Modi", fr: "Autres modes", pl: "Inne tryby", es:"Other Modes", tr: "Other Modes"},
			{i:111, en: "Rampage", ru: "Превосходство", cs: "Běsnení", de: "Verwüstung", fr: "Ravages", pl: "Rozwałka", es:"Rampage", tr: "Rampage"},
			{i:112, en: "Historical Battles", ru: "Исторические бои", cs: "Historické bitvy", de: "Historische Gefechte", fr: "Batailles historiques", pl: "Bitwy historyczne", es:"Historical Battles", tr: "Historical Battles"},
			{i:113, en: "Tank Company", ru: "Роты", cs: "Roty", de: "Kompanie", fr: "Compagnie de chars", pl: "Bitwa kompanii czołgów", es:"Tank Company", tr: "Tank Company"},
			{i:114, en: "Penetration Ratio", ru: "Процент пробития", cs: "Poměr průstřelů", de: "Penetrationsrate", fr: "Ratio de pénétration", pl: "Współczynnik przebijalności", es:"Penetration Ratio", tr: "Penetration Ratio"},
			{i:115, en: "First value is either average per battle or % of a related value, and the second value is the total.", ru: "Первое значение - это или среднее за бой или процент от связанного значения, второе значение - сумма.", cs: "První hodnota je buďto průměr na jednu bitvu nebo procentuální zastoupení dané hodnoty. Druhá hodnota je celkové množství ve všech bitvách.", de: "Der erste Wert ist entweder der Durchschnitt pro Gefecht oder ein prozentualer Anteil; der zweite Wert ist die Summe.", fr: "La première valeur est soit la moyenne par bataille ou un % de la valeur afférente, et la deuxième valeur correspond au total.", pl: "Pierwsza wartość jest albo wartością średnią na bitwę alb procentem powiązanej wartości, natomiast druga wartość jest ogólnym wynikiem.", es:"First value is either average per battle or % of a related value, and the second value is the total.", tr: "First value is either average per battle or % of a related value, and the second value is the total."},
			{i:116, en: "Do mind that some of the values are from the API, and might not load immediately.", ru: "Помните о том, что часть записей берутся из API, и не могут загрузиться мгновенно.", cs: "Některé hodnoty jsou načítány z API a nemusí se načíst ihned.", de: "Bitte beachten: Einige Werte stammen aus der API und brauchen deshalb einige Zeit zum Laden.", fr: "Gardez à l'esprit que les valeurs proviennent de l'API, et qu'elles peuvent ne pas être chargées immédiatement.", pl: "Miej na uwadzę że część wartości jest pobrane z API i mogą nie być załadowane od razu.", es:"Do mind that some of the values are from the API, and might not load immediately.", tr: "Do mind that some of the values are from the API, and might not load immediately."},
			{i:117, en: "Script Author:", ru: "Автор скрипта:", cs: "Autor skriptu:", de: "Script-Autor:", fr: "Auteur du script :", pl: "Autor skryptu:", es:"Script Author:", tr: "Script Author:"},
			{i:118, en: "Contributors", ru: "Внесшие вклад", cs: "Kontributoři", de: "Contributors", fr: "Contributeurs", pl: "Współtwórcy", es:"Contributors", tr: "Contributors"},
			{i:119, en: "Battles & WN8 per Tier", ru: "Бои & WN8 по уровням", cs: "Bitky a WN8 za tier", de: "Battles & WN8 per Tier", fr: "Battles & WN8 per Tier", pl: "Bitwy i WN8 dla daneego tieru", es:"Battles & WN8 per Tier", tr: "Battles & WN8 per Tier"},
			{i:120, en: "Battles & WN8 per Class", ru: "Бои & WN8 по классам", cs: "Bitky a WN8 za třídu", de: "Battles & WN8 per Class", fr: "Battles & WN8 per Class", pl: "Bitwy i WN8 dla danej klasy", es:"Battles & WN8 per Class", tr: "Battles & WN8 per Class"},
			{i:121, en: "Battles & WN8 per Nation", ru: "Бои & WN8 по нациям", cs: "Bitky a WN8 za národ", de: "Battles & WN8 per Nation", fr: "Battles & WN8 per Nation", pl: "Bitwy i WN8 dla danej nacji", es:"Battles & WN8 per Nation", tr: "Battles & WN8 per Nation"},
			{i:122, en: "Calculating", ru: "Рассчет", cs: "Probíhá výpočet", de: "Calculating", fr: "Calculating", pl: "Przeliczanie", es:"Calculating", tr: "Calculating"},
			{i:123, en: "Supertest Tanks", ru: "Танки на супертесте", cs: "Tanky ze supertestu", de: "Supertest Tanks", fr: "Supertest Tanks", pl: "Czołgi z supertestu", es:"Supertest Tanks", tr: "Supertest Tanks"},
			{i:124, en: "Light Tanks", ru: "лёгкие танки", cs: "Lehké tanky", de: "Leichte Panzer", fr: "Chars légers", pl: "Czołgi lekkie", es:"Carros ligeros", tr: "Hafif Tanklar"},
			{i:125, en: "Medium Tanks", ru: "средние танки", cs: "Střední tanky", de: "Mittlere Panzer", fr: "Chars moyens", pl: "Czołgi średnie", es:"Carros ligeros", tr: "Orta Tanklar"},
			{i:126, en: "Heavy Tanks", ru: "тяжёлые танки", cs: "Těžké tanky", de: "Schwere Panzer", fr: "Chars lourds", pl: "Czołgi ciężkie", es:"Carros pesados", tr: "Ağır Tanklar"},
			{i:127, en: "Tank Destroyers", ru: "ПТ-САУ", cs: "Stíhače tanků", de: "Jagdpanzer", fr: "Chass. de chars", pl: "Niszczyciele czołgów", es:"Cazacarros", tr: "Tank Avcısı"},
			{i:128, en: "SPGs", ru: "САУ", cs: "Dělostřelectvo", de: "Selbstfahrlafetten", fr: "Canons AM", pl: "Działa samobieżne", es:"Cazacarros", tr: "KMT"},
			{i:129, en: "Tanks", ru: "Танки", cs: "Tanky", de: "Panzer", fr: "Chars", pl: "Czołgi", es: "Carros", tr: "Tanklar"},
			{i:130, en: "Battles", ru: "Бои", cs: "Bitvy", de: "Gefechte", fr: "Batailles", pl: "Bitwy", es: "Batallas", tr: "Savaşlar"},
			{i:131, en: "Mastery Badges", ru: "Знаки классности", cs: "Mistrovské odznaky", de: "Überlegenheitsabzeichen", fr: "Badges de maîtrise", pl: "Odznaczenia mistrzowskie", es: "Insignias de maestría", tr: "Ustalık Bröveleri"},
			{i:132, en: "Update Profile", ru: "Обновить профиль", cs: "Aktualizuj profil", de: "Update Profile", fr: "Update Profile", pl: "Zaaktualizuj profil", es: "Update Profile", tr: "Update Profile"},
			{i:133, en: "Last Updated:", ru: "Последнее обновление:", cs: "Poslední aktualizace:", de: "Last Updated:", fr: "Last Updated:", pl: "Ostatnia aktualizacja:", es: "Last Updated:", tr: "Last Updated:"},
			{i:134, en: "Reload Tankopedia", ru: "Reload Tankopedia", cs: "Obnov Tankopedii", de: "Reload Tankopedia", fr: "Reload Tankopedia", pl: "Przeładuj dane z Tankopedii", es: "Reload Tankopedia", tr: "Reload Tankopedia"},
			{i:135, en: "Free XP:", ru: "Свободный опыт:", cs: "Volné XP:", de: "Free XP:", fr: "Free XP:", pl: "Wolne doświadczenie:", es: "Free XP:", tr: "Free XP:"},
			{i:136, en: "Version:", ru: "Версия:", cs: "Verze:", de: "Version:", fr: "Version:", pl: "Wersja:", es: "Version:", tr: "Version:"},
			{i:137, en: "Support Thread", ru: "Форум поддержки (на английском)", cs: "Fórum podpory", de: "Support Thread", fr: "Support Thread", pl: "Wątek na forum", es: "Support Thread", tr: "Support Thread"},
			{i:138, en: "Script Translation", ru: "Перевод скрипта", cs: "Překlad scriptu", de: "Script Translation", fr: "Script Translation", pl: "Tłumaczenie skryptu", es: "Script Translation", tr: "Script Translation"},
			{i:139, en: "Unsupported language detected!", ru: "Обнаружен неподдерживаемый язык!", cs: "Zjištěn nepodporovaný jazyk!", de: "Unsupported language detected!", fr: "Unsupported language detected!", pl: "Wykryto niewspierany język!", es: "Unsupported language detected!", tr: "Unsupported language detected!"},
			{i:140, en: "If you want to contribute with translation, please contact", ru: "Если вы хотите участвовать в переводе скрипта, свяжитесь с", cs: "Jestli chceš pomoct s překladem, kontaktuj", de: "If you want to contribute with translation, please contact", fr: "If you want to contribute with translation, please contact", pl: "Jeśli chesch pmóc w tłumaczeniach skontaktuj się ze mną", es: "If you want to contribute with translation, please contact", tr: "If you want to contribute with translation, please contact"},
			{i:141, en: "Strings that requires translation:", ru: "Строки, которые требуют перевода:", cs: "Nepřeložené řeteězce :", de: "Strings that requires translation:", fr: "Strings that requires translation:", pl: "Słowa wymagające tłumaczenia:", es: "Strings that requires translation:", tr: "Strings that requires translation:"},
			{i:142, en: "If you want to contribute, open the browser console (Firefox: CTRL+SHIFT+K, Chrome: F12), translate the strings and send them to", ru: "Если вы хотите участвовать в переводе, откройте консоль браузера (Firefox: CTRL+SHIFT+K, Chrome: F12), переведите строки и отправьте их", cs: "Jestli chceš pomoct, otevři konzoli (Firefox: CTRL+SHIFT+K, Chrome: F12), přelož řetězce a pošli je", de: "If you want to contribute, open the browser console (Firefox: CTRL+SHIFT+K, Chrome: F12), translate the strings and send them to", fr: "If you want to contribute, open the browser console (Firefox: CTRL+SHIFT+K, Chrome: F12), translate the strings and send them to", pl: "Jeśli chcesz pomóc w tłumaczeniu, otwórz konsolę przeglądarki (Firefox: CTRL+SHIFT+K, Chrome: F12), przetłumacz słowa i wyślij te tłumaczenia do mnie", es: "If you want to contribute, open the browser console (Firefox: CTRL+SHIFT+K, Chrome: F12), translate the strings and send them to", tr: "If you want to contribute, open the browser console (Firefox: CTRL+SHIFT+K, Chrome: F12), translate the strings and send them to"},
			{i:143, en: "Nation", ru: "Нациям", cs: "Národ", de: "Nation", fr: "Nation", pl: "Nacja", es: "Nacione", tr: "Ülke", f:1},
			{i:144, en: "Clean Script Database", ru: "Clean Script Database", cs: "Vyčisti db scriptu", de: "Clean Script Database", fr: "Nettoyer la base de données du script", pl: "Wyczyść bazę skryptu", es: "Clean Script Database", tr: "Clean Script Database"},
			{i:145, en: "No Random Battles", ru: "No Random Battles", cs: "Žádné náhodné bitvy", de: "No Random Battles", fr: "No Random Battles", pl: "No Random Battles", es: "No Random Battles", tr: "No Random Battles"},
			{i:146, en: "Marks of Excellence", ru: "Marks of Excellence", cs: "Vítězné znaky ", de: "Marks of Excellence", fr: "Marks of Excellence", pl: "Marks of Excellence", es: "Marks of Excellence", tr: "Marks of Excellence"},
			{i:147, en: "Debug Script", ru: "Debug Script", cs: "Ladění skriptu", de: "Debug Script", fr: "Debug Script", pl: "Debug Script", es: "Debug Script", tr: "Debug Script"},
			{i:148, en: "Overall Results", ru: "Общие результаты", cs: "Celkové výsledky", de: "Gesamtergebnisse", fr: "Résultats généraux", pl: "Ogólne wyniki", es: "Resultados generales", tr: "Genel Sonuçlar"},
			{i:149, en: "Battle Performance", ru: "Боевая эффективность", cs: "Bojový výkon", de: "Leistung in Gefechten", fr: "Performances", pl: "Skuteczność bojowa", es: "Rendimiento en batalla", tr: "Savaş Performansı"},
			{i:150, en: "3 Marks", ru: "3 Marks", cs: "3 Marks", de: "3 Marks", fr: "3 Marks", pl: "3 Marks", es: "3 Marks", tr: "3 Marks"},
			{i:151, en: "2 Marks", ru: "2 Marks", cs: "2 Marks", de: "2 Marks", fr: "2 Marks", pl: "2 Marks", es: "2 Marks", tr: "2 Marks"},
			{i:152, en: "1 Mark", ru: "1 Mark", cs: "1 Mark", de: "1 Mark", fr: "1 Mark", pl: "1 Mark", es: "1 Mark", tr: "1 Mark"},
			{i:153, en: "No Marks", ru: "No Marks", cs: "No Marks", de: "No Marks", fr: "No Marks", pl: "No Marks", es: "No Marks", tr: "No Marks"},
			{i:154, en: "Tier 10 Marks", ru: "Tier 10 Marks", cs: "Tier 10 Marks", de: "Tier 10 Marks", fr: "Tier 10 Marks", pl: "Tier 10 Marks", es: "Tier 10 Marks", tr: "Tier 10 Marks"}
			// {en: "", ru: "", cs: "", de: "", fr: "", pl: "", es:"", tr: ""},
		],
		date: {
			raw: new Date(),
			now: Date.now(),
			format: {ru: "ru-RU", eu: "en-GB", na: "en-US", asia: "en-AU", kr: "ko-KR"}
		},
		col: {
			//      col        wr  lr  bat    sr  hr  dmg  wgr   wn9   wn8   wn7   eff   nm
			sUni: ["#5A3175", 65, 35, 30000, 50, 80, 270, 9900, 1000, 2900, 2050, 2050, 2000], // 99.99% super unicum
			uni:  ["#83579D", 60, 40, 25000, 46, 75, 240, 9000,  900, 2450, 1850, 1800, 1950], // 99.90% unicum
			gr8:  ["#3972C6", 56, 44, 21000, 42, 70, 210, 8500,  800, 2000, 1550, 1500, 1750], // 99.00% great
			vGud: ["#4099BF", 54, 46, 17000, 38, 65, 180, 6500,  700, 1600, 1350            ], // 95.00% very good
			good: ["#4D7326", 52, 48, 13000, 34, 60, 150, 5000,  600, 1200, 1100, 1200, 1450], // 82.00% good
			aAvg: ["#849B24", 50, 50, 10000, 30, 55, 120, 4000,  500,  900                  ], // 63.00% above average
			avg:  ["#CCB800", 48, 52,  7000, 25, 50,  90, 3000,  400,  650,  900,  900, 1250], // 40.00% average
			bAvg: ["#CC7A00", 47, 53,  3000, 20, 45,  60, 2000,  300,  450,  700,  600, 1150], // 20.00% below average
			bas:  ["#CD3333", 46, 54,  1000, 15, 40,  30, 1500,  200,  300,  500            ], //  6.00% basic
			beg:  ["#930D0D",  0, 100,    0,  0,  0,   0,    0,    0,    0,    0,    0,    0], //  0.00% beginner
			dft:  ["#6B6B6B"], // default
			id: {col: 0, wr: 1,  lr: 2, bat: 3, sr: 4, hr: 5, dmg: 6, wgr: 7, wn9: 8, wn8: 9, wn7: 10, eff: 11, nm: 12}  // type identifier
		},
		vehBackup: {
			// id   name                      name_id                      prem   tier nation     class         name_ru
			50945: ["T-45",                   "R125_T_45",                 true,  3,   "ussr",    "lightTank"],
			57089: ["T-44-85",                "R98_T44_85",                true,  7,   "ussr",    "mediumTank"],
			57345: ["T-44-85M",               "R98_T44_85M",               true,  8,   "ussr",    "mediumTank"],
			48897: ["T-44-100M",              "R122_T44_100B",             true,  8,   "ussr",    "mediumTank"],
			62721: ["Kirovets-1",             "R123_Kirovets_1",           true,  8,   "ussr",    "heavyTank",  "Кировец-1"],
			50433: ["Object 257",             "R129_Object_257",           true,  10,  "ussr",    "heavyTank",  "Объект 257"],
			50689: ["Object 268 Version 5",   "R126_Object_730_5",         true,  10,  "ussr",    "AT-SPG",     "Объект 268 Вариант 5"],
			64017: ["M 41 90 mm",             "G120_M41_90",               true,  8,   "germany", "lightTank"],
			63761: ["Panzer 58",              "G119_Panzer58",             true,  8,   "germany", "mediumTank"],
			59409: ["VK 65.01 (H)",           "G122_VK6501H",              true,  5,   "germany", "heavyTank"],
			49681: ["Tiger II (H)",           "G16_PzVIB_Tiger_II_F",      true,  7,   "germany", "heavyTank"],
			62225: ["VK 45.02 (P) Ausf. B7",  "G58_VK4502P7",              true,  7,   "germany", "heavyTank"],
			49425: ["Jagdtiger (H)",          "G44_JagdTigerH",            true,  8,   "germany", "AT-SPG"],
			16913: ["Waffenträger auf E 100", "G98_Waffentrager_E100",     false, 10,  "germany", "AT-SPG"],
			57889: ["T92 Lt",                 "A99_T92_LT",                true,  7,   "usa",     "lightTank"],
			57633: ["T71 CMCD",               "A112_T71E2",                true,  7,   "usa",     "lightTank"],
			59681: ["M4A3E8 Thunderbolt VII", "A118_M4_Thunderbolt",       true,  6,   "usa",     "mediumTank"],
			57377: ["T25 Pilot 1",            "A111_T25_Pilot",            true,  8,   "usa",     "mediumTank"],
			58657: ["Chrysler K",             "A115_Chrysler_K",           true,  8,   "usa",     "heavyTank"],
			56865: ["M48A2/T54E2/T123E6",     "A106_M48A2_120",            true,  10,  "usa",     "mediumTank"],
			62017: ["AMX M4 1949 Liberté",    "F74_AMX_M4_1949_Liberte",   true,  8,   "france",  "heavyTank"],
			62273: ["Somua SM",               "F84_Somua_SM",              true,  8,   "france",  "heavyTank"],
			63537: ["121B",                   "Ch25_121_mod_1971B",        true,  10,  "china",   "mediumTank"],
			56401: ["T95/Chieftain",          "GB88_T95_Chieftain_turret", true,  10,  "uk",      "mediumTank"],
			15185: ["Chieftain Mk. 6",        "GB84_Chieftain_Mk6",        true,  10,  "uk",      "heavyTank"],
			51809: ["Type 98 Ke-Ni Otsu",     "J05_Ke_Ni_B",               true,  3,   "japan",   "lightTank"],
			52353: ["Strv 81",                "S23_Strv_81",               true,  8,   "sweden",  "mediumTank"]
			// 63745, 64833, 64257 are rentals
		},
		superTest: [
			// russian
			"R98_T44_85", "R98_T44_85M", "R99_T44_122", "R122_T44_100B", "R114_Object_244", "R123_Kirovets_1", "R119_Object_777", "R129_Object_257", "R121_KV4_KTT", "R126_Object_730_5",
			// german
			"G120_M41_90", "G119_Panzer58", "G122_VK6501H", "G16_PzVIB_Tiger_II_F", "G58_VK4502P7", "G115_Typ_205_4_Jun", "G44_JagdTigerH", "G114_Skorpian",
			// american
			"A99_T92_LT", "A112_T71E2", "A106_M48A2_120",
			// french
			"F69_amx13_57_100", "F84_Somua_SM",
			// british
			"GB84_Chieftain_Mk6", "GB88_T95_Chieftain_turret",
			// chinese
			// "",
			// japanese
			"J05_Ke_Ni_B",
			// czechoslovakian
			// "",
			// swedish
			"S23_Strv_81"
		],
		tierAvg: [ // from 150816 EU avgs exc scout/arty
			{win:0.477, dmg:88.9, frag:0.68, spot:0.90, def:0.53, cap:1.0, weight:0.40},
			{win:0.490, dmg:118.2, frag:0.66, spot:0.85, def:0.65, cap:1.0, weight:0.41},
			{win:0.495, dmg:145.1, frag:0.59, spot:1.05, def:0.51, cap:1.0, weight:0.44},
			{win:0.492, dmg:214.0, frag:0.60, spot:0.81, def:0.55, cap:1.0, weight:0.44},
			{win:0.495, dmg:388.3, frag:0.75, spot:0.93, def:0.63, cap:1.0, weight:0.60},
			{win:0.497, dmg:578.7, frag:0.74, spot:0.93, def:0.52, cap:1.0, weight:0.70},
			{win:0.498, dmg:791.1, frag:0.76, spot:0.87, def:0.58, cap:1.0, weight:0.82},
			{win:0.497, dmg:1098.7, frag:0.79, spot:0.87, def:0.58, cap:1.0, weight:1.00},
			{win:0.498, dmg:1443.2, frag:0.86, spot:0.94, def:0.56, cap:1.0, weight:1.23},
			{win:0.498, dmg:1963.8, frag:1.04, spot:1.08, def:0.61, cap:1.0, weight:1.60}
		],
		web: {
			gecko: typeof InstallTrigger !== 'undefined',
			opera: !!w.opera || /opera|opr/i.test(n.userAgent),
			chrome: !!w.chrome && !!w.chrome.webstore,
			safari: /constructor/i.test(w.HTMLElement)
		}
	},
	s = { // variable for statistics
		b: [{c:0,p:0},{c:0,p:0},{c:0,p:0},{c:0,p:0},{c:0,p:0},{c:0,p:100}], // badges
		f: {wn9:{},wn8:{},wn7:{},eff:{},wgr:{}}, // formulas
		h: {}, // hex colours
		m: [{c:0,p:0},{c:0,p:0},{c:0,p:0},{c:0,p:0},{c:0,p:0}], // marks of excellence
		n: {china:{b:0,bd:0,wn8:0,wn9:0},czech:{b:0,bd:0,wn8:0,wn9:0},france:{b:0,bd:0,wn8:0,wn9:0},germany:{b:0,bd:0,wn8:0,wn9:0},japan:{b:0,bd:0,wn8:0,wn9:0},poland:{b:0,bd:0,wn8:0,wn9:0},sweden:{b:0,bd:0,wn8:0,wn9:0},uk:{b:0,bd:0,wn8:0,wn9:0},usa:{b:0,bd:0,wn8:0,wn9:0},ussr:{b:0,bd:0,wn8:0,wn9:0}}, // nations
		s: {lightTank:{r:[],b:0,bd:0,w:0,wn8:0,wn9:0,bg:0,m:0},mediumTank:{r:[],b:0,bd:0,w:0,wn8:0,wn9:0,bg:0,m:0},heavyTank:{r:[],b:0,bd:0,w:0,wn8:0,wn9:0,bg:0,m:0},"AT-SPG":{r:[],b:0,bd:0,w:0,wn8:0,wn9:0,bg:0,m:0},SPG:{r:[],b:0,bd:0,w:0,wn8:0,wn9:0,bg:0,m:0},prem:{r:[],b:0,bd:0,w:0,wn8:0,wn9:0,bg:0,m:0},ten:{r:[],b:0,bd:0,w:0,wn8:0,wn9:0,bg:0,m:0},miss:{r:[],b:0,bd:0,w:0,wn8:0,wn9:0,bg:0,m:0},super:{r:[],b:0,bd:0,w:0,wn8:0,wn9:0,bg:0,m:0},zero:{r:[],b:0,bd:0,w:0,wn8:0,wn9:0,bg:0,m:0}}, // custom tank tables
		t: [{b:0,bd:0,c:0,wn8:0,wn9:0,t:1},{b:0,bd:0,c:0,wn8:0,wn9:0,t:2},{b:0,bd:0,c:0,wn8:0,wn9:0,t:3},{b:0,bd:0,c:0,wn8:0,wn9:0,t:4},{b:0,bd:0,c:0,wn8:0,wn9:0,t:5},{b:0,bd:0,c:0,wn8:0,wn9:0,t:6},{b:0,bd:0,c:0,wn8:0,wn9:0,t:7},{b:0,bd:0,c:0,wn8:0,wn9:0,t:8},{b:0,bd:0,c:0,wn8:0,wn9:0,t:9},{b:0,bd:0,c:0,wn8:0,wn9:0,t:10}], // tiers
		v: {a:0,t:0,battles:0,tier:0}, // vehicles
		w: {e:{frag:0,dmg:0,spot:0,def:0,win:0},c:{},w:{total:0,used:0,use:0}}, // values for wn8 and wn9
	},
	sf = { // script functions
		statCalc: function () { // statCalc function
			// fetching info, calculate averages, colourize and store into var s
			// wn9 static values
			var tankList = [];

			// r = raw stats
			s.r = userStats.all;
			s.r.days = (sc.date.raw - new Date(sc.stats.u.created_at)*1000)/1000/60/60/24;
			s.r.batsRan= 0;
			s.r.deaths = s.r.battles-s.r.survived_battles;
			s.r.cuts = sc.stats.u.statistics.trees_cut;
			s.r.dmgA = s.r.avg_damage_assisted*s.r.battles;
			s.r.dmgAR = s.r.avg_damage_assisted_radio*s.r.battles;
			s.r.dmgAT = s.r.avg_damage_assisted_track*s.r.battles;
			s.r.dmgB = s.r.avg_damage_blocked*s.r.battles;
			s.r.winLR = s.r.wins/s.r.losses;

			// p = personal stats - store to display on all profile pages
			var userData = sf.storage("statScriptUserdata_"+wg.srv, "", "get", "parse"),
			pd_table = d.getElementsByClassName('t-dotted');
			if (wg.own) {
				s.p = {
					gold: [pd_table[0].rows[0].cells[0].textContent, pd_table[0].rows[0].cells[1].firstElementChild.textContent],
					cred: [pd_table[0].rows[1].cells[0].textContent, pd_table[0].rows[1].cells[1].firstElementChild.textContent],
					fxp: pd_table[0].rows[2].cells[1].firstElementChild.textContent,
					bonds: [pd_table[0].rows[3].cells[0].textContent, pd_table[0].rows[3].cells[1].firstElementChild.textContent]
				};
				if (pd_table[1].rows[1]) {
					s.p.prem = [pd_table[1].rows[1].cells[0].textContent, pd_table[1].rows[1].cells[1].textContent];
				}
				sf.storage("statScriptUserdata_"+wg.srv, s.p, "set", "string");
			}
			else if (userData) {
				s.p = userData;
			}

			// roll through the vehicles
			for (var _v=0, _v_len = sc.stats.v.length; _v<_v_len; _v++) {
				var veh = sc.stats.v[_v],
				vehMedal = sc.stats.a[_v],
				vehAll = veh.all,
				vehRan = veh.random,
				vehId = veh.tank_id,
				vehBats = vehAll.battles,
				vehWins = vehAll.wins,
				vehBadge = (veh.mark_of_mastery) ? veh.mark_of_mastery : 0,
				vehExp = false,
				tankpedia = sc.pedia[vehId];
				veh.wn8 = {tot: 0};
				veh.wn9 = {rat: 0};
				veh.miss = [false, []];
				if (sc.wn[vehId]) {
					vehExp = {
						wn8: sc.wn[vehId].wn8,
						wn9: sc.wn[vehId].wn9
					};
				}
				// add data to vehExp array
				if (tankpedia) {
					veh.name = tankpedia.name;
					veh.tag = tankpedia.tag;
					veh.tier = tankpedia.tier;
					veh.type = tankpedia.type;
					veh.nation = tankpedia.nation;
					veh.prem = tankpedia.is_premium;
				}
				else if (sc.vehBackup[vehId]) {
					if (sc.locSet.cur == "ru" && sc.vehBackup[vehId][6]) {
						sc.vehBackup[vehId][0] = sc.vehBackup[vehId][6];
					}
					veh.name = sc.vehBackup[vehId][0];
					veh.tag = sc.vehBackup[vehId][1];
					veh.tier = sc.vehBackup[vehId][3];
					veh.type = sc.vehBackup[vehId][5];
					veh.nation = sc.vehBackup[vehId][4];
					veh.prem = sc.vehBackup[vehId][2];
					if (sc.debug) {
						veh.miss[0] = true;
						veh.miss[1].push("DB");
					}
				}
				else {
					var vehIgnore = [63745,64833,64257]; // rentals
					if (vehIgnore.indexOf(vehId) == -1) {
						console.error(vehId+" doesn't exist in the database, please report!");
					}
					continue;
				}
				// check battle amount, skip stat calculation if 0
				if (vehBats === 0) {
					s.s.zero.r.push(_v);
					if (sc.debug) {
						console.info(((tankpedia) ? tankpedia.name : "")+" - "+vehId+" has no battles");
					}
					continue;
				}

				// marks of excellence
				veh.marksOnGun = (veh.tank_id == vehMedal.tank_id && vehMedal.achievements.marksOnGun) ? vehMedal.achievements.marksOnGun : 0;
				s.m[veh.marksOnGun].c ++;
				if (veh.tier == 10 && veh.marksOnGun == 3) {
					s.m[4].c ++;
				}

				// wn8 rating
				if (vehExp.wn8) {
					// add to total vehicle battles if it exists in wnefficiency table
					s.v.battles += vehBats;
					// summarize expected stat from every vehicle for WN8
					veh.wn8exp = {
						frag: vehExp.wn8.expFrag    * vehBats,
						dmg:  vehExp.wn8.expDamage  * vehBats,
						spot: vehExp.wn8.expSpot    * vehBats,
						def:  vehExp.wn8.expDef     * vehBats,
						win:  vehExp.wn8.expWinRate * vehBats
					};

					// wn8 rating
					veh.wn8.dmg = Math.max((vehAll.damage_dealt/veh.wn8exp.dmg-0.22)/(1-0.22),0);
					veh.wn8.frag = Math.max(Math.min(veh.wn8.dmg+0.2,(vehAll.frags/veh.wn8exp.frag-0.12)/(1-0.12)),0);
					veh.wn8.spot = Math.max(Math.min(veh.wn8.dmg+0.1,(vehAll.spotted/veh.wn8exp.spot-0.38)/(1-0.38)),0);
					veh.wn8.def = Math.max(Math.min(veh.wn8.dmg+0.1,(vehAll.dropped_capture_points/veh.wn8exp.def-0.10)/(1-0.10)),0);
					veh.wn8.win = Math.max((100*vehAll.wins/veh.wn8exp.win-0.71)/(1-0.71),0);
					veh.wn8.rat = 980*veh.wn8.dmg+210*veh.wn8.dmg*veh.wn8.frag+155*veh.wn8.frag*veh.wn8.spot+75*veh.wn8.frag*veh.wn8.def+145*Math.min(1.8,veh.wn8.win);
					// multiply wn8 per battle for category usage
					veh.wn8.tot = veh.wn8.rat * vehBats;

					// summarize for account wn8
					s.w.e.frag += veh.wn8exp.frag;
					s.w.e.dmg  += veh.wn8exp.dmg;
					s.w.e.spot += veh.wn8exp.spot;
					s.w.e.def  += veh.wn8exp.def;
					s.w.e.win  += veh.wn8exp.win;
				}
				else {
					console.error(veh.name+" - "+vehId+" doesn't exist in WN8 database, please report!");
					if (sc.debug) {
						veh.miss[0] = true;
						veh.miss[1].push("WN8");
					}
				}

				// wn9 rating
				if (vehExp.wn9) {
					var avg = sc.tierAvg[vehExp.wn9.mmrange >= 3 ? vehExp.wn9.tier : vehExp.wn9.tier-1];
					veh.wn9.nerf = vehExp.wn9.wn9nerf;
					veh.wn9.dmg = vehRan.damage_dealt/(vehRan.battles*avg.dmg);
					veh.wn9.frag = vehRan.frags/(vehRan.battles*avg.frag);
					veh.wn9.spot = vehRan.spotted/(vehRan.battles*avg.spot);
					veh.wn9.def = vehRan.dropped_capture_points/(vehRan.battles*avg.def);
					veh.wn9.win = vehRan.wins/(vehRan.battles*avg.win);
					veh.wn9.base = 0.7*veh.wn9.dmg+((vehRan.battles < 5) ? 0.14*veh.wn9.frag+0.13*Math.sqrt(veh.wn9.spot)+0.03*Math.sqrt(veh.wn9.def) : 0.25*Math.sqrt(veh.wn9.frag*veh.wn9.spot)+0.05*Math.sqrt(veh.wn9.frag*Math.sqrt(veh.wn9.def)));
					veh.wn9.rat = sc.wn.v.wn9accmul*Math.max(1+(veh.wn9.base/vehExp.wn9.wn9exp-1)/vehExp.wn9.wn9scale,0);
					// multiply wn9 per battle for category usage
					veh.wn9.tot = veh.wn9.rat * vehBats;
				}
				else {
					console.error(veh.name+" - "+vehId+" doesn't exist in WN9 database, please report!");
					if (sc.debug) {
						veh.miss[0] = true;
						veh.miss[1].push("WN9");
					}
				}

				// vehicle badges
				s.b[vehBadge].c ++;

				// vehicle stats per tier
				s.t[veh.tier-1].bd += vehBats;
				s.t[veh.tier-1].c ++;
				s.v.tier += veh.tier*vehBats;
				s.v.a ++;

				// vehicle stats per nation
				s.n[veh.nation].bd += vehBats;

				// vehicle stats per class
				s.s[veh.type].r.push(_v);
				s.s[veh.type].bd += vehBats;
				s.s[veh.type].w += vehWins;
				if (vehBadge !== 0) {
					s.s[veh.type].bg ++;
				}
				if (veh.marksOnGun !== 0) {
					s.s[veh.type].m ++;
				}

				// summarize wn8 if it exists
				if (veh.wn8.tot > 0 || veh.wn9.tot > 0) {
					s.t[veh.tier-1].b += vehBats;
					s.n[veh.nation].b += vehBats;
					s.s[veh.type].b += vehBats;
					if (veh.wn8.tot > 0) {
						s.t[veh.tier-1].wn8 += veh.wn8.tot;
						s.n[veh.nation].wn8 += veh.wn8.tot;
						s.s[veh.type].wn8 += veh.wn8.tot;
					}
					if (veh.wn9.tot > 0) {
						s.t[veh.tier-1].wn9 += veh.wn9.tot;
						s.n[veh.nation].wn9 += veh.wn9.tot;
						s.s[veh.type].wn9 += veh.wn9.tot;
					}
				}


				// get info for premium tanks
				if (veh.prem) {
					s.s.prem.r.push(_v);
					s.s.prem.bd += vehBats;
					s.s.prem.w += vehWins;
					if (veh.wn8.tot > 0) {
						s.s.prem.b += vehBats;
						s.s.prem.wn8 += (veh.wn8.tot > 0) ? veh.wn8.tot : 0;
						s.s.prem.wn9 += (veh.wn9.tot > 0) ? veh.wn9.tot : 0;
					}
					if (vehBadge !== 0) {
						s.s.prem.bg ++;
					}
					if (veh.marksOnGun !== 0) {
						s.s.prem.m ++;
					}
				}

				// get info for tier 10 tanks
				if (veh.tier == 10) {
					s.s.ten.r.push(_v);
					s.s.ten.bd += vehBats;
					s.s.ten.w += vehWins;
					if (veh.wn8.tot > 0) {
						s.s.ten.b += vehBats;
						s.s.ten.wn8 += (veh.wn8.tot > 0) ? veh.wn8.tot : 0;
						s.s.ten.wn9 += (veh.wn9.tot > 0) ? veh.wn9.tot : 0;
					}
					if (vehBadge !== 0) {
						s.s.ten.bg ++;
					}
					if (veh.marksOnGun !== 0) {
						s.s.ten.m ++;
					}
				}

				// get info for supertester tanks
				if (sc.superTest.indexOf(veh.tag) !== -1) {
					veh.test = true;
					s.s.super.r.push(_v);
					s.s.super.bd += vehBats;
					s.s.super.w += vehWins;
					if (veh.wn8.tot > 0) {
						s.s.super.b += vehBats;
						s.s.super.wn8 += (veh.wn8.tot > 0) ? veh.wn8.tot : 0;
						s.s.super.wn9 += (veh.wn9.tot > 0) ? veh.wn9.tot : 0;
					}
					if (vehBadge !== 0) {
						s.s.super.bg ++;
					}
					if (veh.marksOnGun !== 0) {
						s.s.super.m ++;
					}
				}

				// get info for tanks with any sort of errors
				if (veh.miss[0]) {
					s.s.miss.r.push(_v);
					s.s.miss.bd += vehBats;
					s.s.miss.w += vehWins;
					if (veh.wn8.tot > 0) {
						s.s.miss.b += vehBats;
						s.s.miss.wn8 += (veh.wn8.tot > 0) ? veh.wn8.tot : 0;
						s.s.miss.wn9 += (veh.wn9.tot > 0) ? veh.wn9.tot : 0;
					}
					if (vehBadge !== 0) {
						s.s.miss.bg ++;
					}
					if (veh.marksOnGun !== 0) {
						s.s.miss.m ++;
					}
				}

				// total ratings
				s.r.batsRan += vehRan.battles;

				// push vehicle stats into array for future - ignore spgs
				if (vehExp.wn9 && veh.type !== "SPG") {
					tankList.push({bRan: vehRan.battles, tier: veh.tier, wn9: veh.wn9});
				}
			}

			// a = average stats
			s.a = {
				bats: s.r.battles/s.r.days,
				wins: (s.r.wins/s.r.battles)*100,
				loss: (s.r.losses/s.r.battles)*100,
				draw: (s.r.draws/s.r.battles)*100,
				surv: (s.r.survived_battles/s.r.battles)*100,
				frag: s.r.frags/s.r.battles,
				deaths: s.r.deaths/s.r.battles,
				spot: s.r.spotted/s.r.battles,
				hits: (s.r.hits/s.r.shots)*100,
				dmgD: s.r.damage_dealt/s.r.battles,
				dmgR: s.r.damage_received/s.r.battles,
				caps: s.r.capture_points/s.r.battles,
				defs: s.r.dropped_capture_points/s.r.battles,
				tier: s.v.tier/s.v.battles,
				cuts: s.r.cuts/s.v.battles,
				dmgA: s.r.avg_damage_assisted,
				dmgAR: s.r.avg_damage_assisted_radio,
				dmgAT: s.r.avg_damage_assisted_track,
				dmgB: s.r.avg_damage_blocked,
				recPens: s.r.piercings_received/s.r.direct_hits_received*100,
				recNo: s.r.no_damage_direct_hits_received/s.r.direct_hits_received*100,
				recExp: s.r.explosion_hits_received/s.r.direct_hits_received*100
			};

			// calculate marks of excellence percent
			for (var _m=0, _m_len = s.m.length; _m<_m_len; _m++) {
				s.m[_m].p = s.m[_m].c/s.v.a*100;
			}

			// calculate badge percent
			s.b[5].c = s.v.a;
			for (var _b=0, _b_len = s.b.length; _b<_b_len; _b++) {
				s.b[_b].p = s.b[_b].c/s.v.a*100;
			}

			// adjust tier values accordingly and insert
			for (var _ta=0; _ta<s.t.length; _ta++) {
				var tier = s.t[_ta];
				if (tier.b > 0) {
					tier.wn8 /= tier.b;
					tier.wn9 /= tier.b;
				}
			}

			// adjust type values accordingly and insert
			for (var _ty in s.s) {
				if (s.s.hasOwnProperty(_ty)) {
					var type = s.s[_ty];
					if (type.b > 0) {
						type.wn8 /= type.b;
						type.wn9 /= type.b;
					}
				}
			}

			// adjust nation values accordingly and insert
			for (var _na in s.n) {
				if (s.n.hasOwnProperty(_na)) {
					var nation = s.n[_na];
					if (nation.b > 0) {
						nation.wn8 /= nation.b;
						nation.wn9 /= nation.b;
					}
				}
			}

			// prepare numbers for WN8 formula
			s.w.c.win = Math.max((s.a.wins/(s.w.e.win/s.v.battles)-0.71)/(1-0.71),0);
			s.w.c.dmg = Math.max((s.a.dmgD/(s.w.e.dmg/s.v.battles)-0.22)/(1-0.22),0);
			s.w.c.frag = Math.max(Math.min(s.w.c.dmg+0.2,(s.a.frag/(s.w.e.frag/s.v.battles)-0.12)/(1-0.12)),0);
			s.w.c.spot = Math.max(Math.min(s.w.c.dmg+0.1,(s.a.spot/(s.w.e.spot/s.v.battles)-0.38)/(1-0.38)),0);
			s.w.c.def = Math.max(Math.min(s.w.c.dmg+0.1,(s.a.defs/(s.w.e.def/s.v.battles)-0.10)/(1-0.10)),0);

			// calculate ratings
			// wg personal rating
			s.f.wgr = (function() {
				var rat = sc.stats.u.global_rating;
				return {rat: rat, ratCol: sf.color(rat,"wgr",0)};
			})();
			// WN9
			s.f.wn9 = (function() {
				var rat = 0, pct = 0;
				if (sc.wn.v.wn9 !== "404") {
					// cap tank weight according to tier, total battles & nerf status
					for (var _w=0, _w_len = tankList.length; _w<_w_len; _w++) {
						tankList[_w].weight = Math.min(tankList[_w].bRan, tankList[_w].tier*(40+tankList[_w].tier*s.r.batsRan/2000));
						if (tankList[_w].wn9.nerf) {tankList[_w].weight /= 2;}
						s.w.w.total += tankList[_w].weight;
					}
					// sort tanks by wn9 descending
					tankList.sort(function(a, b) {
						return b.wn9.rat - a.wn9.rat;
					});
					// add up account wn9 over top 65% of battles
					s.w.w.use = 0.65*s.w.w.total;
					for (var _uw = 0; s.w.w.used+tankList[_uw].weight <= s.w.w.use; _uw++) {
						if (tankList[_uw].bRan !== 0) {
							rat += tankList[_uw].wn9.rat*tankList[_uw].weight;
							s.w.w.used += tankList[_uw].weight;
							}
						}

					// last tank before cutoff uses remaining weight, not its battle count
					rat += tankList[_uw].wn9.rat*(s.w.w.use-s.w.w.used);
					rat /= s.w.w.use;

					// insert new WN9
					pct = (rat<=sc.col.sUni[8]) ? (rat/sc.col.sUni[8])*100 : 100;
				}
				return {rat: rat, pct: pct, ratCol: sf.color(rat,"wn9",2,"")};
			})();
			// WN8
			s.f.wn8 = (function() {
				var frag = 210*s.w.c.dmg*s.w.c.frag,
				dmg = 980*s.w.c.dmg,
				spot = 155*s.w.c.frag*s.w.c.spot,
				def = 75*s.w.c.def*s.w.c.frag,
				win = 145*Math.min(1.8,s.w.c.win),
				rat = frag+dmg+spot+def+win,
				pct = (rat<=sc.col.sUni[9]) ? (rat/sc.col.sUni[9])*100 : 100,
				scale = (rat<=sc.col.sUni[9]) ? Math.max(0,Math.min(100,rat*(rat*(rat*(rat*(rat*(-rat*0.00000000000000000004164+0.000000000000001176)-0.000000000009033)+0.000000027466)-0.00003804)+0.05819)-0.965)) : 100;
				return {frag: frag, dmg: dmg, spot: spot, def: def, win: win, rat: rat, pct: pct, scale: scale, ratCol: (isFinite(rat)) ? sf.color(rat,"wn8",2) : sc.loc[15], scaleCol: (isFinite(rat)) ? sf.color(scale,"wn8",2) : sc.loc[15]};
			})();
			// WN7 - legacy support
			s.f.wn7 = (function() {
				var frag = s.a.frag*(1240-1040/(Math.pow(Math.min(s.a.tier,6),0.164))),
				dmg = s.a.dmgD*530/(184*Math.exp(0.24*s.a.tier)+130),
				spot = s.a.spot*125*Math.min(s.a.tier,3)/3,
				def = Math.min(2.2,s.a.defs)*100,
				win = (((185/(0.17+Math.exp((s.a.wins-35)*-0.134)))-500)*0.45),
				norm = -Math.abs((((5-Math.min(s.a.tier,5))*125)/(1+Math.exp(s.a.tier-Math.pow(s.r.battles/220,3/s.a.tier))*1.5))),
				rat = frag+dmg+spot+def+win+norm,
				pct = (rat<=sc.col.sUni[10]) ? (rat/sc.col.sUni[10])*100 : 100,
				scale = (rat<=sc.col.sUni[10]) ? Math.max(0,Math.min(100,rat*(rat*(rat*(rat*(rat*(rat*0.000000000000000001225-0.000000000000007167)+0.000000000005501)+0.00000002368)-0.00003668)+0.05965)-5.297)) : 100;
				return {frag: frag, dmg: dmg, spot: spot, def: def, win: win, norm: norm, rat: rat, pct: pct, scale: scale, ratCol: sf.color(rat,"wn7",2), scaleCol: sf.color(scale,"wn7",2) };
			})();
			// efficiency - improved
			s.f.eff = (function() {
				var frag = s.a.frag*250,
					dmg = s.a.dmgD*(10/(s.a.tier+2))*(0.23+2*s.a.tier/100),
					spot = s.a.spot*150,
					cap = (Math.log(s.a.caps+1)/Math.log(1.732))*150,
					def = s.a.defs*150,
					rat = frag+dmg+spot+cap+def,
					pct = (rat<=sc.col.sUni[11]) ? (rat/sc.col.sUni[11])*100 : 100,
					scale = (rat<=sc.col.sUni[11]) ? Math.max(0,Math.min(100,rat*(rat*(rat*(rat*(rat*(rat*0.000000000000000013172 - 0.000000000000092286)+0.00000000023692)-0.00000027377)+0.00012983)+0.05935)-31.684)) : 100;
				return {frag: frag, dmg: dmg, spot: spot, cap: cap, def: def, rat: rat, pct: pct, scale: scale, ratCol: sf.color(rat,"eff",2), scaleCol: sf.color(scale,"eff",2) };
			})();

			// localized and coloured stats
			s.l = {
				winsR: sf.color(s.a.wins, "wr", 2, "%"),
				lossR: sf.color(s.a.loss, "lr", 2, "%"),
				survR: sf.color(s.a.surv, "sr", 2, "%"),
				hitsR: sf.color(s.a.hits, "hr", 2, "%"),
				drawR: sf.color(s.a.draw, "",   2, "%"),
				batsC: sf.color(s.r.battles, "bat", 0),
				dmgTier: sf.color(s.a.dmgD/s.a.tier, "dmg", 0, "", s.a.dmgD),
				veh: "<span style='color:#CD3333'>"+sf.format(s.v.battles,2)+"</span>",
				clip: sc.loc[71]+" "+wg.name+": \n"+sc.loc[72]+" "+s.r.battles+" \nWR: "+s.a.wins.toFixed(2)+" \nWN8: "+s.f.wn8.rat.toFixed(2)+" \nWN7: "+s.f.wn7.rat.toFixed(2)+" \nEff: "+s.f.eff.rat.toFixed(2)
			};
		},
		clan: function () { // clanBlock function
			wg.clan.id = cl_class.getAttribute('href').match(/\/(\d+)/)[1];
			wg.clan.name = cl_class.getElementsByTagName('span')[0].innerHTML.match(/[\w.+\-]+/)[0];
			// clan statistic links
			var clanStat_table_cells = [
				[
					[sc.loc[65]],
					[sc.srv.wl, "<a target='_blank' href='http://wotlabs.net/"+sc.srv.wl+"/clan/"+wg.clan.name+"'>WoTLabs</a>"],
					[sc.srv.nm, "<a target='_blank' href='http://noobmeter.com/clan/"+sc.srv.nm+"/"+wg.clan.name+"/"+wg.clan.id+"'>Noobmeter</a>"],
					[sc.srv.ct, "<a target='_blank' href='http://clantools.us/servers/"+sc.srv.ct+"/clans?id="+wg.clan.id+"'>Clan Tools</a>"]
				],
				[
					[""],
					[sc.srv.vb, "<a target='_blank' href='http://www.vbaddict.net/clan/worldoftanks."+sc.srv.vb+"/"+wg.clan.id+"/clan-"+wg.clan.name.toLowerCase()+"'>vBAddict</a>"],
					(wg.srv=="ru") ? [sc.srv.kttc, "<a target='_blank' href='http://kttc.ru/clan/"+wg.clan.id+"/'>KTTC</a>"] : [sc.srv.wlf, "<a target='_blank' href='http://wot-life.com/"+sc.srv.wlf+"/clan/"+wg.clan.name+"-"+wg.clan.id+"/'>WoT-Life</a>"]
				],
				[
					[sc.loc[66]],
					[sc.srv.wr, "<a target='_blank' href='http://wotreplays."+sc.srv.wr+"/clan/"+wg.clan.name+"'>WoTReplays</a>"]
				],
				[
					[sc.srv.we, sc.loc[80]],
					[sc.srv.we, "<a target='_blank' href='http://wotevent.guildity.com/clans/"+wg.clan.name+"/'>WoT Event Stats</a>"]
				]
			];
			sf.links(clanStat_table, clanStat_table_cells, "table");
			clanBlock.appendChild(clanStat_table);
		},
		cake: function () { // cakeDiagram function
			var diagTier_div = sf.elem("div", "b-diagram-block b-diagram-tiers js-diagram-block", "<h3>"+sc.loc[56]+"</h3><h4>"+sc.loc[119]+"</h4><div class='b-diagram-wrpr'><div class='b-diagram' id='holder-mechanism-tier'></div><div class='b-diagram-round js-diagram-round'><span class='b-diagram-round_title'></span><span class='b-diagram-round_value js-result'>"+s.v.a+"</span></div></div>"),
			diagTier_table = sf.elem("table", "t-dotted t-dotted__diagram js-diagram-mechanism-legend"),
			diagTierCol = ["#831818","#814F07","#763D46","#496877","#303766","#2B591F","#471952","#936C19","#9B9B9B","#514A3C"];
			diagSector_class.children[1].insertBefore(sf.elem("h4", "", sc.loc[120]), diagSector_class.children[1].firstElementChild.nextSibling);
			diagSector_class.children[2].insertBefore(sf.elem("h4", "", sc.loc[121]), diagSector_class.children[2].firstElementChild.nextSibling);
			diagSector_class.insertBefore(diagTier_div, diagSector_class.children[1].nextSibling);
			for (var _d=0, _d_len = s.t.length; _d<_d_len; ++_d) {
				if (s.t[_d].c !== 0) {
					diagTier_table.appendChild(sf.elem("tr", "t-diagram-tier", "<td class='t-dotted_diagram-first'><span class='t-dotted_diagram-bg'></span></td><td><span class='t-dotted_diagram-bg'><span class='t-dotted_diagram-info'><span class='t-diagram_rating'>"+sf.color(s.t[_d].wn8,"wn8",2,"","f")+"</span><span class='t-diagram_tiers js-results'>"+sf.format(s.t[_d].b,2)+"</span><span class='t-dotted_diagram-percent'>(<span class='js-value'>"+sf.format((s.t[_d].b/s.r.battles*100),2,2)+"%</span>)</span></span><span class='b-diagram-ico b-diagram-ico_tier b-diagram-ico_tier-"+s.t[_d].t+"'>"+sc.loc[57]+" "+s.t[_d].t+"</span></span></td><td class='t-dotted_diagram-last'><span class='t-dotted_diagram-bg'><span class='js-colors'>"+diagTierCol[_d]+"</span></span></td>"));
				}
			}
			diagTier_div.appendChild(diagTier_table);
			// insert wn8 for classes
			for (var _ty in s.s) {
				if (s.s.hasOwnProperty(_ty)) {
					if (_ty == "prem") {break;}
					var type = s.s[_ty];
					if (type.b > 0) {
						var classSpan = d.getElementsByClassName('js-'+_ty)[0];
						classSpan.firstElementChild.insertBefore(sf.elem("span", "t-diagram_rating", (type.wn8 === 0) ? sc.loc[76] : sf.color(type.wn8,"wn8",2,"","f")), classSpan.firstElementChild.firstElementChild);
					}
				}
			}
			// insert wn8 for nations
			for (var _na in s.n) {
				if (s.n.hasOwnProperty(_na)) {
					var nation = s.n[_na];
					if (nation.b > 0) {
						var natSpan = d.getElementsByClassName('js-'+_na)[0];
						if (natSpan) {
							natSpan.firstElementChild.insertBefore(sf.elem("span", "t-diagram_rating", (nation.wn8 === 0) ? sc.loc[76] : sf.color(nation.wn8,"wn8",2,"","f")), natSpan.firstElementChild.firstElementChild);
						}
					}
				}
			}
			diagSector_class.children[1].appendChild(sf.elem("div", "b-diagram-total", "<h3>"+sc.loc[58]+" "+s.v.a+"</h3>"));
			// fix for cake diagram in chrome
			if (sc.web.chrome) {
				var diagItems = [], diagValues = [], diagResults = [],
				diagRows = diagTier_table.rows,
				diagResult = $('.js-result', diagTier_div);
				for (var _dt=0, _dt_len = diagRows.length; _dt<_dt_len; ++_dt) {
					diagItems.push($(diagRows[_dt]));
					diagValues.push(parseInt(diagRows[_dt].getElementsByClassName('js-value')[0].innerHTML, 10));
					diagResults.push(diagRows[_dt].getElementsByClassName('js-results')[0].innerHTML);
				}
				new Raphael("holder-mechanism-tier", 630, 630).pieChart(65, 65.5, 53.5, diagItems, diagValues, diagTierCol, diagResults, diagTier_table, diagResult);
			}
		},
		medals: function () { // special medals function
			if (medalSpecial_class) {
				var medals = medalSpecial_class.getElementsByTagName('li'),
				medalsFull = Math.floor(medals.length/12)*12,
				medalsRest = 12-(medals.length-medalsFull),
				medalsHelper = medals[medalsFull];
				if (medals.length > 12 && medalsRest !== 12) {
					medalsHelper.style.marginLeft = (medalsRest*39.5)+"px";
				}
			}
		},
		format: function (input, type, dec) { // input and output formatting
			var inputReg = new RegExp("\\"+sc.loc[0], "g");
			switch(type) {
				case (1): // input string into number
					return parseFloat(input.replace(inputReg,"").replace(",","."));
				case (2): // output number with locale symbol
					if (isNaN(input)) {return 0;}
					dec = dec ? dec : 0;
					input = input.toFixed(dec).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+sc.loc[0]);
					return (sc.loc[0] !== "," && dec !== 0) ? input.replace(/\.(\d+)*$/g,",$1") : input;
				default:
					console.error("Error filtering: ", input);
					return input;
			}
		},
		color: function (input, type, dec, sym, ext) { // color formatting
			if (isNaN(input) || input === 0) {return 0;}
			var color = sc.col.dft[0], output = input.toFixed(dec);
			if (type == "dmg") {
				output =  sf.format(ext,2,0);
			}
			else if (input >= 1000) {
				output = sf.format(input,2,dec);
			}
			if (type !== "") {
				if (s.h[type] && ext !== "f") {
					color = s.h[type];
				}
				else {
					for (var _c in sc.col) {
						if (sc.col.hasOwnProperty(_c)) {
							if (type == "lr") {
								if (input <= sc.col[_c][sc.col.id[type]]) {
									color = sc.col[_c][0]; break;
								}
							}
							else {
								if (input >= sc.col[_c][sc.col.id[type]]) {
									color = sc.col[_c][0]; break;
								}
							}
						}
					}
					if (sym !== "%") {
						s.h[type] = color;
					}
				}
			}
			else {
				color = "";
			}
			if (sc.loc[0] !== "," && dec !== 0) {
				output = output.replace(/\.(\d+)*$/g,",$1");
			}
			if (sym) {
				output += sym;
			}
			return "<span style='color:"+color+"'>"+output+"</span>";
		},
		elem: function (tag, name, html, extra) { // element creation
			var element = d.createElement(tag);
			if (name) {
				element.className = name;
			}
			if (html) {
				if (/</.test(html)) {
					element.innerHTML = html;
				}
				else {
					element.textContent = html;
				}
			}
			if (extra) {
				for (var _e in extra) {
					if (extra.hasOwnProperty(_e)) {
						element[_e] = extra[_e];
					}
				}
			}
			return element;
		},
		settings: function (name, text, state, dftState) { // script menu handler
			var setItem = sf.elem("li", "b-settingItem"),
			setDiv = sf.elem("div", "b-settingParent b-"+name, "<a>"+text+"</a>");
			switch(name) {
				case ("wnRefresh"):
					setDiv.addEventListener('click', function() {
						GM_deleteValue("wnExpValues");
						location.reload();
					}, false);
				break;
				case ("pediaRefresh"):
					setDiv.addEventListener('click', function() {
						GM_deleteValue("statScriptPedia");
						location.reload();
					}, false);
				break;
				case ("cleanStorage"):
					setDiv.addEventListener('click', function() {
						var database = GM_listValues();
						for (var _vi=0, _vi_len = database.length; _vi<_vi_len; ++_vi) {
							var item = database[_vi];
							if (item.match(/statScriptPlayer/)) {
								GM_deleteValue(item);
							}
						}
						location.reload();
					}, false);
				break;
				case ("copyClipboard"):
					setDiv.addEventListener('click', function() {
						w.prompt(sc.loc[63], d.getElementById('js-clipBoard').innerHTML);
					}, false);
				break;
				case ("debugging"):
					var optCheckDiv = sf.elem("div", "b-checkbox", "<span class='b-checkbox_checker'></span>"),
					optCheck = sf.elem("input", "l-box", "", {type:"checkbox", name: name, id: name, checked: (state !== undefined) ? state : dftState});
					setDiv = sf.elem("label", "b-combobox-label", text, {htmlFor: name});
					if (state) {
						optCheckDiv.classList.add("b-checkbox__checked");
						setDiv.classList.add("b-combobox-label__checked");
					}
					optCheck.addEventListener('click', function() {
						sf.storage('statScript_' + this.name, this.checked, "set");
						d[this.name] = this.checked;
						this.parentNode.classList.toggle('b-checkbox__checked');
						this.parentNode.parentNode.classList.toggle('b-combobox-label__checked');
						return this.checked;
					}, false);
					d[optCheck.name] = optCheck.checked;
					optCheckDiv.insertBefore(optCheck, optCheckDiv.firstChild);
					setDiv.appendChild(optCheckDiv);
					break;
				default: break;
			}
			setItem.appendChild(setDiv);
			return setItem;
		},
		links: function (parent, links, type) { // statistic links handler
			var linksFragment = d.createDocumentFragment();
			for (var _l=0, _l_len = links.length; _l<_l_len; ++_l) {
				switch(type) {
					case ("table"):
						var link = sf.elem("tr");
						for (var _lr=0, _lr_len = links[_l].length; _lr<_lr_len; ++_lr) {
							link.appendChild((links[_l][_lr][0] && links[_l][_lr][1]) ? sf.elem("td", "", links[_l][_lr][1]) : sf.elem("td", "", links[_l][_lr][0]));
						}
						linksFragment.appendChild(link);
					break;
					case ("list"):
						if (links[_l] instanceof HTMLElement) {
							linksFragment.appendChild(links[_l]);
						}
						else {
							linksFragment.appendChild((links[_l][0] && links[_l][1]) ? sf.elem("li", "", links[_l][1]) : sf.elem("li", "statname", links[_l][0]));
						}
					break;
					default: break;
				}
			}
			parent.appendChild(linksFragment);
		},
		tabs: function (elem) { // statistic tabs handler
			var tab = elem.target.parentNode;
			if (!tab.classList.contains("js-tabs__active")) {
				d.getElementsByClassName('b-statistics-wrpr')[0].getElementsByClassName('js-tabs__active')[0].classList.remove('js-tabs__active');
				tab.classList.add("js-tabs__active");
				d.getElementsByClassName('js-stat_active')[0].classList.remove("js-stat_active");
				d.getElementsByClassName(tab.getAttribute('data-ref'))[0].classList.add("js-stat_active");
			}
		},
		storage: function (name, data, type, mode) { // database handler
			var storage;
			switch(type) {
				case ("set"):
					if (mode == "string") {
						data = JSON.stringify(data);
					}
					storage = GM_setValue(name, data);
				break;
				case ("get"):
					storage = GM_getValue(name, false);
					if (mode == "parse") {
						storage = JSON.parse(storage);
					}
				break;
				default: break;
			}
			return storage;
		},
		api: { // wargaming api functions
			info: function (resp) { // processing information from player API
				sc.stats.u = resp.data[wg.id];
				ss.run++;
				if ((ss.pedia && ss.run == 3) || ss.run == 4) {
					sf.storage("statScriptPlayer_"+wg.id+"_date", sc.date.now, "set");
					sf.storage("statScriptPlayer_"+wg.id, sc.stats, "set", "string");
					location.reload();
				}
			},
			veh: function (resp) { // processing information from vehicle API
				sc.stats.v = resp.data[wg.id];
				ss.run++;
				if ((ss.pedia && ss.run == 3) || ss.run == 4) {
					sf.storage("statScriptPlayer_"+wg.id+"_date", sc.date.now, "set");
					sf.storage("statScriptPlayer_"+wg.id, sc.stats, "set", "string");
					location.reload();
				}
			},
			medals: function (resp) { // processing information from achivements API
				sc.stats.a = resp.data[wg.id];
				ss.run++;
				if ((ss.pedia && ss.run == 3) || ss.run == 4) {
					sf.storage("statScriptPlayer_"+wg.id+"_date", sc.date.now, "set");
					sf.storage("statScriptPlayer_"+wg.id, sc.stats, "set", "string");
					location.reload();
				}
			},
			pedia: function (resp) { // processing information from tankopedia API
				sf.storage("statScriptPedia_"+wg.srv, resp.data, "set", "string");
				ss.run++;
				if (ss.run == 4) {
					location.reload();
				}
			}
		},
		stat: { // stat database functions
			wn8: function (resp) { // wnefficiency.net/exp/expected_tank_values_latest.json handler
				var data = resp.data;
				for (var _wn8=0, _wn8_len = data.length; _wn8<_wn8_len; ++_wn8) {
					var veh = data[_wn8];
					if (sc.wn[veh.IDNum]) {
						sc.wn[veh.IDNum].wn8 = veh;
					}
					else {
						sc.wn[veh.IDNum] = {wn8: veh};
					}
				}
				sc.wn.v.wn8 = resp.header.version;
				wn.run++;
				if (wn.run == 2) {
					sf.stat.store();
				}
			},
			wn9: function (resp) { // jaj22.org.uk/tankdata/exp_wn9.json handler
				var data = resp.data;
				for (var _wn9=0, _wn9_len = data.length; _wn9<_wn9_len; ++_wn9) {
					var veh = data[_wn9];
					if (sc.wn[veh.id]) {
						sc.wn[veh.id].wn9 = veh;
					}
					else {
						sc.wn[veh.id] = {wn9: veh};
					}
				}
				sc.wn.v.wn9 = resp.header.version;
				sc.wn.v.wn9accmul = resp.header.wn9accmul;
				wn.run++;
				if (wn.run == 2) {
					sf.stat.store();
				}
			},
			error: function (resp, name) {
				switch (name) {
					case ("wn8Data"):
						sc.wn.v.wn8 = "404";
					break;
					case ("wn9Data"):
						sc.wn.v.wn9 = "404";
					break;
					default: break;
				}
				wn.run++;
				if (wn.run == 2) {
					sf.stat.store();
				}
			},
			store: function () {
				sc.wn.v.sc = sc.vers;
				sf.storage("wnExpValues", sc.wn, "set", "string");
				sf.storage("wnExpDate", sc.date.now, "set");
				location.reload();
			}
		},
		ch: { // clan history handler
			hnd: function (resp) {
				var history = resp.accountcard.clan_history.collection, _h_len = history.length, clansCount = 0, prevClan,
				clanHistFragment = d.createDocumentFragment();
				clanHist_div.lastElementChild.classList.add("b-display-none");
				if (_h_len > 0) {
					for (var _h=_h_len-1; _h>=0; --_h) {
						var chap = history[_h];
						clansCount ++;
						if (prevClan !== chap.clan.tag) {
							var clanHist_span = sf.elem("span", (chap.clan.tag == wg.clan.name) ? "clantag curr" : "clantag", "<a href='http://"+wg.srv+".wargaming.net/clans/"+chap.clan.id+"/' target='_blank'><img src='http://"+wg.srv+".wargaming.net/"+chap.clan.emblem+"' title='["+chap.clan.tag+"] "+chap.clan.name+((chap.role) ? "\n"+chap.role.localized : "")+"'/></a>");
							clanHistFragment.appendChild(clanHist_span);
							prevClan = chap.clan.tag;
						}
					}
					clanHist_div.appendChild(clanHistFragment);
				}
				else {
					clanHist_div.appendChild(sf.elem("span", "clantag", sc.loc[75]));
				}
			},
			error: function (resp) {
				clanHist_div.lastElementChild.textContent = sc.loc[76]+" "+resp.status;
			}
		},
		request: function (name, api, handler, error) { // request handler
			GM_xmlhttpRequest({
				method: "GET",
				url: api,
				headers: {
					"Accept": "application/json"
				},
				onload: function(resp) {
					if (resp.status == 200) {
						var data = JSON.parse(resp.responseText);
						if (sc.debug) {console.info(name, data);}
						handler(data);
					}
					else {
						console.error("Error:", name, api, resp);
						if (error) {error(resp, name);}
					}
				},
				onerror: function(resp) {
					console.error("Error:", name, api, resp);
					if (error) {error(resp, name);}
				}
			});
		}
	};

	// load stored debug status - defaults to false
	sc.debug = sf.storage("statScript_debugging", "", "get", "parse") || false;

	// region settings for external sites
	switch(wg.srv) {
		case ("eu"): // eu server
			sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.cs = sc.srv.wlf = sc.srv.ct = sc.srv.kttc = sc.srv.aos = sc.srv.ch = sc.srv.wr = sc.srv.we = wg.srv;
		break;
		case ("ru"): // ru server
			sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.cs = sc.srv.ct = sc.srv.kttc = sc.srv.wots = sc.srv.aos = sc.srv.ch = sc.srv.wr = wg.srv;
		break;
		case ("na"): // na server - american english
			sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.cs = sc.srv.wlf = sc.srv.ct = sc.srv.kttc = sc.srv.aos = sc.srv.ch = sc.srv.vb = wg.srv; sc.srv.wr = "com";
			sc.loc[24].en = "Defence";
			sc.loc[54].en = "Base Defence Points:";
			sc.loc[107].en = "Stronghold Defence";
		break;
		case ("asia"): // asia server
			sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.cs = "sea"; sc.srv.ct = sc.srv.kttc = sc.srv.aos = sc.srv.ch = sc.srv.vb = wg.srv; sc.srv.wr = "com";
		break;
		case ("kr"): // korean server
			sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.cs = sc.srv.ct = sc.srv.aos = sc.srv.ch = sc.srv.vb = wg.srv; sc.srv.wr = "com";
		break;
		default: break;
	}
	// make sure correct localization is displayed, and reload page with user language if not
	if (sc.locSet.cur[0] == sc.locSet.cur[1]) {
		sc.locSet.cur = sc.locSet.cur[0];
	}
	else {
		sc.locSet.cur = sc.locSet.cur[0];
		w.location.href = "http://"+wg.host+"/"+sc.locSet.cur+"/community/accounts/"+wg.id+"-"+wg.name+"/";
	}

	// set script language to english if an unsupported language is detected
	if (sc.locSet.sup.indexOf(sc.locSet.cur) == -1) {
		sc.locSet.cur = "en";
	}
	// process localization
	for (var _l=0, l_len = sc.loc.length; _l<l_len; _l++) {
		var langLoc = sc.loc[_l][sc.locSet.cur];
		if (sc.locSet.cur !== "en" && langLoc == sc.loc[_l].en && !sc.loc[_l].f) {
			sc.locSet.miss ++;
			console.info("Missing translation at line "+(_l+668)+" - en:\""+sc.loc[_l].en+"\"", sc.locSet.cur+":\""+sc.loc[_l][sc.locSet.cur]+"\"");
		}
		sc.loc[_l] = langLoc;
	}


	// add language to body classname for language based styling
	d.body.classList.add("lang-"+sc.locSet.cur);

	// add animated loading icon for progress indication
	var loadGif = sf.elem("div", "processing", "<i class='old-waiting'></i>");

	// fetch wnefficiency values - check if array exists in database, otherwise fetch and reload page
	var wn = {
		data: sf.storage("wnExpValues", "", "get", "parse"),
		date: sf.storage("wnExpDate", "", "get", "parse")+12096e5 >= sc.date.now, // true if timestamp is less than 2 weeks old, refresh list if false.
		run: 0
	};
	var versCheck = wn.data && wn.data.v.sc == sc.vers;
	if (!versCheck || !wn.data || !wn.date) {
		d.body.appendChild(loadGif);
		sf.request("wn8Data", sc.api.wn8, sf.stat.wn8, sf.stat.error);
		sf.request("wn9Data", sc.api.wn9, sf.stat.wn9, sf.stat.error);
	}
	else {
		sc.wn = wn.data;
	}
	// fetch stored clanlist stats - check if array exists in database, otherwise tag fetching to true
	var ss = {
		val: sf.storage("statScriptPlayer_"+wg.id, "", "get", "parse"),
		pedia: sf.storage("statScriptPedia_"+wg.srv, "", "get", "parse"),
		date: sf.storage("statScriptPlayer_"+wg.id+"_date", "", "get", "parse"), // true if timestamp is less than 1 weeks old, refresh list if false.
		run: 0
	}, userStats;
	if (ss.val && ss.date+6048e5 >= sc.date.now && ss.pedia && ss.val.a) {
		sc.stats = ss.val;
		sc.pedia = ss.pedia;
		userStats = sc.stats.u.statistics;
		sf.statCalc();
	}
	else {
		sc.api.i = "http://api.worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/wot/account/info/?application_id="+sc.api.wg_key+"&account_id="+wg.id+"&extra=statistics.fallout,statistics.globalmap_absolute,statistics.globalmap_champion,statistics.globalmap_middle";
		sc.api.v = "http://api.worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/wot/tanks/stats/?application_id="+sc.api.wg_key+"&account_id="+wg.id+"&extra=random";
		sc.api.a = "http://api.worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/wot/tanks/achievements/?application_id="+sc.api.wg_key+"&account_id="+wg.id;
		sc.api.e = "https://api.worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/wot/encyclopedia/vehicles/?application_id="+sc.api.wg_key;
		d.body.appendChild(loadGif);
		sf.request("infoData", sc.api.i, sf.api.info);
		sf.request("vehData", sc.api.v, sf.api.veh);
		sf.request("medalData", sc.api.a, sf.api.medals);
		if (!!sc.pedia) {
			sf.request("pediaData", sc.api.e, sf.api.pedia);
		}
	}
	if (sc.debug) {
		console.info(GM_listValues());
		console.info(s);
		console.info(sc);
	}

	// inserting style into head
	var style = sf.elem("style", "wotstatscript", "", {type:"text/css"}),
	styleText = [
		// processing loader rules
		".processing {width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 500; background: url(http://eu.wargaming.net/clans/static/2.2.9/images/processing/processing_overlay-pattern.png);}",
		".processing_loader {width: 56px; height: 54px; position: absolute; top: 50%; left: 50%; margin-top: -27px; margin-left: -28px;}",
		".processing .old-waiting {position: absolute; top: 50%; left: 50%; margin: -68px 0 0 -68px;}",
		// settings menu rules
		"#common_menu .menu-settings {color: #7C7E80; display: inline-block;}",
		"#common_menu .menu-settings .cm-user-menu-link {margin: 0 10px 0 0;}",
		"#common_menu .menu-settings .cm-user-menu-link_cutted-text {max-width: unset;}",
		"#common_menu .menu-settings .cm-user-menu {min-width: 200px; padding: 15px;}",
		"#common_menu .menu-settings .cm-parent-link:hover {cursor: pointer;}",
		"#common_menu .menu-settings .b-settingItem {margin: 6px 0px; text-align: center;}",
		"#common_menu .menu-settings label {display: table; line-height: normal; cursor: pointer; margin: 0 auto;}",
		"#common_menu .menu-settings .l-box {display: none;}",
		"#common_menu .menu-settings .b-checkbox {background: url(http://eu.wargaming.net/clans/static/tags/1.2.4/clansassets/images/v2/b-checkbox/b-checkbox-sprite.png) -4px -4px no-repeat; height: 16px; width: 16px; float: left; margin: 1px 5px 0 0;}",
		"#common_menu .menu-settings .b-checkbox span {height: 16px; width: 16px;}",
		"#common_menu .menu-settings .b-checkbox > div {display: none;}",
		"#common_menu .menu-settings .b-checkbox.b-checkbox__checked {background-position: -28px -4px;}",
		"#common_menu .menu-settings .b-checkbox.b-checkbox__checked .b-checkbox_checker {background: url(http://eu.wargaming.net/clans/static/tags/1.2.4/clansassets/images/v2/b-checkbox/b-checkbox-sprite.png) -76px -4px no-repeat;}",
		"#common_menu .menu-settings .b-combobox-label__checked {color: #DCDCDC;}",
		"#common_menu .menu-settings .b-settingItem .b-combobox-label:hover {color: #DCDCDC;}",
		"#common_menu .menu-settings .b-settingItem .b-combobox-label:hover .b-checkbox {box-shadow: 0px 0px 10px 1px rgba(191, 166, 35, 0.15), 0px 0px 3px 1px rgba(191, 166, 35, 0.25);}",
		"#common_menu .menu-settings textarea.l-textarea {background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 2px; color: #FFFFFF; line-height: normal; padding: 5px; min-height: 50px; margin: 5px 0 5px 0; min-width: 175px;}",
		"#common_menu .menu-settings textarea::-webkit-input-placeholder {color: #FFFFFF;}",
		"#common_menu .menu-settings textarea::-moz-placeholder {color: #FFFFFF;}",
		"#common_menu .menu-settings .b-settingParent {line-height: 26px;}",
		"#common_menu .menu-settings .b-settingParent a {cursor: pointer; color: #B1B2B3; text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);}",
		"#common_menu .menu-settings .b-settingParent a:hover {color: #FFFFFF; text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.75); text-decoration: underline;}",
		"#common_menu .menu-settings .settingCredits {margin: 2px 0px;}",
		"#common_menu .menu-settings .settingCredits h1 {color: #B1B2B3;}",
		"#common_menu .menu-settings .settingCredits table {font-size: 12px; margin: 0 auto; width: unset;}",
		"#common_menu .menu-settings .settingCredits table td {padding: 0 5px;}",
		"#common_menu .menu-settings .settingCredits p {font-size: 12px; padding: 2px 0;}",
		"#common_menu .menu-settings .settingCredits .b-orange-arrow {color: #F25322; line-height: 14px; padding-right: 9px;}",
		"#common_menu .menu-settings .settingCredits .b-orange-arrow:hover {color: #FF7432;}",
		"#common_menu .menu-settings .settingCredits.settingSeperator {border-top: 1px dashed #212123; margin-top: 6px; padding-top: 12px;}",
		"#common_menu .menu-settings .settingCredits.settingLinks {margin: 5px 0;}",
		"#common_menu .menu-settings .settingCredits.settingLinks a {margin: 0 5px;}"
	];
	d.head.appendChild(style);

	// script link, settings, credits and localization indicators
	var userSet_div = sf.elem("div", "menu-settings menu-top_item", "<a class='cm-user-menu-link' href='#' onClick='return false;'><span class='cm-user-menu-link_cutted-text'>"+sc.loc[79]+"</span><span class='cm-arrow'></span></a>"),
	userSet_list = sf.elem("ul", "cm-user-menu"),
	userSet_list_locItem = sf.elem("li", "b-settingItem settingCredits settingSeperator"),
	userSet_list_items = [
		sf.settings("wnRefresh", sc.loc[78]+" [v"+wn.data.v.wn8+"][v"+wn.data.v.wn9+"]"),
		sf.settings("pediaRefresh", sc.loc[134]),
		sf.settings("cleanStorage", sc.loc[144]),
		sf.settings("copyClipboard", sc.loc[62]),
		sf.settings("debugging", sc.loc[147], sc.debug, false),
		sf.elem("li", "b-settingItem settingCredits settingSeperator", "<p>"+sc.loc[136]+" "+sc.vers+"</p>"),
		sf.elem("li", "b-settingItem settingCredits", "<p>"+sc.loc[117]+" <a class='b-orange-arrow' href='"+sc.user.wot+"'>Orrie</a></p>"+((sc.cred[sc.locSet.cur]) ? "<p>"+sc.loc[118]+" ("+sc.locSet.cur.toUpperCase()+"):</p><table>"+sc.cred[sc.locSet.cur]+"</table>" : "")),
		sf.elem("li", "b-settingItem settingCredits settingLinks", "<p><a class='b-orange-arrow' href='"+sc.host+"'>Greasy Fork</a><a class='b-orange-arrow' href='"+((wg.srv == "na") ? sc.top.na : sc.top.eu)+"'>"+sc.loc[137]+"</a></p>")
	],
	navMenu = d.getElementById('common_menu'),
	navUser = navMenu.getElementsByClassName('cm-menu__user')[0],
	navLook = new MutationObserver(function() {
		var userMenu = d.getElementsByClassName('menu-settings')[0];
		navUser = navMenu.getElementsByClassName('cm-menu__user')[0];
		if (!userMenu) {
			navUser.appendChild(userSet_div);
		}
	});
	if (sc.locSet.sup.indexOf(sc.locSet.cur) == -1) {
		userSet_list_locItem.innerHTML = "<h1>"+sc.loc[138]+"</h1><p>"+sc.loc[139]+"</p><p>"+sc.loc[140]+" <a class='b-orange-arrow' href='"+sc.user.wl+"'>Orrie</a></p>";
		userSet_list_items.push(userSet_list_locItem);
	}
	else if (sc.locSet.miss > 0) {
		userSet_list_locItem.innerHTML = "<h1>"+sc.loc[138]+"</h1><p>"+sc.loc[141]+" "+sc.locSet.miss+"</p><p>"+sc.loc[142]+" <a class='b-orange-arrow' href='"+sc.user.wl+"'>Orrie</a></p>";
		userSet_list_items.push(userSet_list_locItem);
	}
	sf.links(userSet_list, userSet_list_items, "list");
	userSet_div.firstElementChild.addEventListener('click', function() {
		this.classList.toggle('cm-user-menu-link__opened');
		this.nextSibling.classList.toggle('cm-user-menu__opened');
	}, false);
	userSet_div.appendChild(userSet_list);
	if (navUser) {
		navUser.appendChild(userSet_div);
	}
	navLook.observe(navMenu, {childList: true});

	// check if player has 0 battles before continuing
	var tableBattles = sf.format(d.getElementsByClassName('t-personal-data_value')[2].innerHTML,1),
	profileName_class = d.getElementsByClassName('b-profile-name')[0];
	if (tableBattles > 0 && Object.keys(sc.stats).length !== 0) {
		// variables for css and data uri
		var css = {
			box: "box-shadow: 0 0 38px 1px rgba(0, 0, 0, 0.3) inset, 0 0 23px 1px rgba(255, 255, 255, 0.02), 0 0 5px 1px rgba(0, 0, 0, 0.5) inset;",
			input: "background: rgba(0, 0, 0, 0.09); box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.15) inset, 0 0 38px 1px rgba(0, 0, 0, 0.3) inset, 0 0 23px 1px rgba(255, 255, 255, 0.02), 0 0 5px 1px rgba(0, 0, 0, 0.5) inset; color: #606061;",
			l: [
				"/static/wot/common/css/scss/context-menu/img/arrow.png",
				"/static/wot/common/css/scss/content/links/img/orange_arrow.png",
				"/static/wot/common/css/scss/content/user/img/speedometr-separator.png",
				"/static/wot/common/css/scss/content/links/img/ico-info.png",
				"/static/wot/common/css/scss/content/links/img/vertical-arrow.png",
				"/static/wot/common/img/common/cont-img-mask.png",
				"/static/wot/common/img/classes/class-ace.png",
				"/static/wot/common/img/classes/class-1.png",
				"/static/wot/common/img/classes/class-2.png",
				"/static/wot/common/img/classes/class-3.png"
			],
			u: {
				menu: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPQAAAABCAIAAABmEhQDAAAAHklEQVQoU2MAAj4BAR5ePi6eUTSKhgni4eFjYGAAAN9YIhjam+zlAAAAAElFTkSuQmCC",
				icon1:"data:image/png;base64,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",
				icon2:"data:image/png;base64,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",
				nmLogo:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABgUlEQVQ4y92SPWsUYRSFn/POzE4MgkhMKyKICAEjiUksgoWClY0WYifKDlj4VyxsDGvlgmhtLUiIkoSNiLEWCwN+dmvAnZl3jkV2lxArSz3d/eDe53Iu/NOabb8J6cHkfLGZbXUWq1E8c2c7kxpPhF8unfPu0bk4qqWqz+jggAtFL6uor9hhLqjZnkwHq7ip+/WRJlF50tYs0oLwF5vdPwhKKCHDguiEfpUBkKh6aMIT8MutzmJ3TDFGb/duA7L91HBTgAEYQlqHgeOH9PPt/oUCWCpezVTk7z1sFpwG7gMt4C64a7QCdGUTVF9LQ/l6feXiN80Xmw8aJ/cQxm6AIKkAXgAfgWnbZyVNgp8bjdAIqi8HW1MMeSUs2MG+ZfsTeMdwQrBs+AAgPAQ1gl0BnC82njVOboxPkGujVHhglMuORonYywfid8nXe52ltbGNC8X6JaNTQapjrGNjchH7VutYnvhHJJ3Cg8+mdXSCr4/XOlcH+7xf1d984Fx7I/D/6Dd9b6wCx93gcQAAAABJRU5ErkJggg==",
				vbLogo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACrUExURUxpcahYHvXmtciUVrbSzejKpNzr8f///47A3adRHu3n29zd3cOUct3t9cDj9BFeuTJUoe7EitufUiuGzOrTn5HT+NHdy7Pp+f/0x83m9Pz96n240Pry4DWg2WKn1Nfp9K7f8CthnNurZvz27OrTsP/////+/P757fv+/vL8/+L6/+fy+Pv49f/z2uPSvrDf+Prrysfj4OPDlrqRrsDDrXen15PH3sC918vq/6QbRKQAAAAldFJOUwBxqjlV41VVVTnGqsbxuDmqqqqqOaqOqnGOjqrjqsbGORxxxhxX8ZyaAAAAjElEQVQY043N1xaCMAyA4aKAbPceuNq0FHCP938yU6pU7/yvmu+cNIR8tfGa5KckbuiH18Lcqcx3Ww0HiuUcor2e25kC6tQfdCpg3ffYF7Tu6CMMzUxZD2HMDXB1dmmAnQcI62dhJRC5wvEzmCDMJYQxC1KxCEVRnbnJzwYElgJ7VT6up0t5n41s8kcvaosSk0veKFwAAAAASUVORK5CYII=",
				rat:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3kAAAAYCAMAAABwbsSFAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAEXUExURZs5OVmBuzJTgjhbjkVvrMdlZWeMwoYqKjpuhD1jm7FBQcFUVJI0NFRvN2aBS3SMW0tjMT5TKERcLGc/kHRIoJFquFY1eYVbsHkgIF87haFLS28dHWUaGrCiGp9oFp6RGMa5Q2p5LcCyMYV6EpKGFcaRQ7B1HMCGMZJgFYVXEm6lvkF8lkuLp16ctpamXHyNNo2dSl1qJsu5aKKCwhMmQi1DFk0TEx0rDkILCy0XRTcFBU1GAEQpACU0ECVZbxg6SCNGeRciDCA/bhs1XH0eHhcuT3IbG2AYGDgcVUolb0MiZSUTOFIHBy4EBFoICExbFX1yAXJmAD85AF9WADI6DX1LAHJEAFIxAF85ABQvOx5HWT1IEaQoKMAyv+0AAAA0dFJOU+bn5ubn5+fm5+jn5+bn5+bm5ubn5ubm5ufm5+bm6enn5+fn5ubn5+fm5ufo5+fo5+fm7e2U9GplAAADyElEQVR42t3b7VLaQBiG4WABXRD8iFarTQAVaBOINhbUWiEipUKtCSr0g5z/cbSdyfAPZgl58u52J9ch5M89z6s8PDw+gnT9Xrfb4+Xro/F4FJKuDYeeFxHNc2HPcxtUzzVbVM9kTqfjiICpg35/IIBb5dOn799BHrrNy8smr+74c/g3Hl5fPz1FZOi+3Ny8YLiNi9vbCxKNVrv96xeJVuejIK/Tv/r27UoA//68y0uQnt/8+rXJy9d//vjxMyRdu75+fo6I5r5MJi8Y3uTi5uaChGu2279/k1hjd1++3ImA9a/u768EcKsoysEBSCqV/fvxStnlarUckm0fHRWLEbGtM8s6w7Ct/MZGnoRl1OsGDcNIJxJpERjne7u7ewIYKIeHb9+C7GfWV1fXeWX09+/evQ9JL5ycHB9HpHBa+vChhFHKbW9tbZPYNNeoXo2tvHq1IgK28+b16zcCuFf291dXQQ6ySiaj8MqWK7peCalcLBQ0LSLFs9LpaQnDym/mcpskNgzTrNVI1NNJxpIiSO+pOzuqAO4VYNuktFhX5ebr4fvrHLrmRdhmpzRX+nJqMuoeylT52ialxboqt94yAXb2Gw2fImyzU14jvnbaaEG6aMuhrqHOQL62SWmxrsrN18P31zlG2nOEbXbKm8TXTidrkC5qOtQ91FHla5uUFuuq/Ozw/XWOsl2MsM1O2VZ87dQyMF3UoO6hxrl8bZPSYl2Vm6KH769zVArHEbbZKS0XXzvN1SBV1ExS99CkKl/bpLRYV+WWKofvr3NUi1qEbXbqKB9fO83XIV3USFD30MQuqG32IA1QLr4O6JV0u1PhO+iMOsqod51MjXO32YQ0QLl0R5+JX6S7U+E76IxdKfm40+nHudtsQhqgXPwRoFfS7U6F76AzdqWMetfp9OPcbWYxDVAqqTKgV9LtToXvoLN2pdS7TuM8zt3mOqQByiVTAfRKut2p8B10xq6UUe86kztx7jYVSAOUS7YK6JV0u1PhO+iMXWmaeteZ2Pu/dptdH94nl7pn56Nr8L6IvIWP7yQ+htN3k6E7J1OlvkkPPPTgfbI7htfHkQfvi8hb+IDbgDfKRgt+444fc3YGUt+kB3o+vE8udc/OZ+TB+yLyFj7gufBGOTHhN+5rDrpzMlXqm/RADH1yqXt2PmUb3heRt/AB24I3Sgt/424Y6M5pnEt9kx7Yx/fTpe7Z+VQ0eF9E3sIHSpvwRpnDn77XkujOyVSpb9IDByl4n1zqnp1P9QjeF5G38AFrA94o8wb8xr2eQHfO9C68bf4BJj9mhs1FXSUAAAAASUVORK5CYII=",
				ratMark:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAANCAQAAADLNWwDAAAAV0lEQVQI12NgEGQQZhBhEALSQEqMQQIIgUxxBqmvRyBMKQa5H3cZpIGyDHIMir/fAkkxBgZFa/0/nxgUgQoZVNLsgExloGpkUSS1SCYgmQuxTQwkCncDAH0wFzVj5p2XAAAAAElFTkSuQmCC",
				tiers:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAACVCAMAAABipVoFAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACQUExURQAAACYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJkxLSCYmJrWxpCYmJiYmJktKRyYmJuLg0V5dWCYmJlpZVpeVi/n36bu5rnFwa0ZFQnp4cb67rcrHuP//+ufk1ioqKcG+r//+8IiHf6CelPDt3/z46tfUxtrXy6Cel7Kwp8/MwY6MhcrHu////9fUxAMhjVoAAAAudFJOUwB9DD9GW2wWcXaEqR/pUDedZ/GnKpjL98ugkbHv9vv9jvz8vs3w7/DapcTRo9ombTjKAAACgUlEQVRIx73W2bKiMBAGYAIheyAsAgLuop6l9P3fbiIqpHGqZs4FJ+XVXwjNR5PG83604iSeRskpmUbkRKYR69hblL5H5/do9RaR9u30iU7+o9R5V0AwJgGstGSshMWyE+cneEu8Q6jjMEqFSCfRWYjzJFohtIIRazlv4emJZkyTf5U6Ow2Dl7Q0vORAx9KgEwI6lkZ0Auj0NFCnp4E6lkasBNCxNKhFQMfScM2Bzl9KndmGRShUNGLYHyot6+syyNH6Y2hhfkKXzwQv95yONuKQClJVkWtjNnKbNoFrg3SRpUI5rxQKm7Y4hq4NCra7NotdG54nhXbbKyZYxSHDv/hSYRZRGnHnkvHHGuXx8lqPEeX7JQ4/L84N0aiqCEq/ncdIgybdmk2dO5ESaVZURDlXVOGx0A2mnvvPrN0J5Uae4roIFaiVYhbm4CDP9yn1/Xlo/LuNClGIImATLK/L6wLYJJ+XbL0ANiI9mP1i7EJrIzdSlmPU22ghN2Zik5hbDW22kVk50d0mCepdDW1iFfEI2tyXPyONCF86Ds3iqTPSZC+dF43cS/nUoQON/Rmnbe40ctB50siblDczoTGjzoPG7IwZdB40tljnQc64XJsnD7TpeYDNgwfYyL55gM2DB9g8eVybJ89oI1fywUMdmxfPaCN+iaefAPcd2W46w5tLSm5t8GL9nfvDsEJJdeFfX+HQwKxD2HRVWcdjlArMDmVB8iGyGzJGx82RjdF9Q5a37JbhMbKTSh/YQSdDZDfkRm9jpJvYd4dVpOy0mmuTeW+fiEMbz8unNnaFDxvwQVb3Nm6UJ70NiEhvA2aA6W3g915v45690TWwsaVaHvWzSf4Hg8Q8dbSrlJgAAAAASUVORK5CYII=",
				bad1:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAfCAYAAABtYXSPAAAFVklEQVR42q2Xf0idVRjHu/f95dxVBGvNJlM2lI2hbW5sqMo23SDa2JaOtWBDCuZG2QBawZis0WA4pgtMREUQFXWJiASIGgkgEBWRKSD9GYAVEDQE+qtOzweey7nck12vdODLc5/3fL/f87znx/ve94X/aDEbFc61TXSZtFk2X6PnmGUe2OVYeNZ/aw1BXAWxtN+a66A2p7nXrcYnT/vtZVEQIi3MigONtjAH2qd810N9MzcV2DsIFTmCHfbOMxVjeejQWy+dZS0y86xYUSR48fr169MHDhx4czvFoEOPD372JjefHTu1wM5GflFR0fujo6MmNzf3s97e3pJsioGPDj0++OFriwGW7yyRVp8rSOzZs+fVs2fPfj03N2ck/3xoaKgCYllZWRzs3r3bKy4u9goLCz0iebIPHnx06PHBD1/1j9KWyikkTBYjrbKlpeXvwcHBv2SaKeaLvr6+GsjHjh3zgCyBf/ToUW/fvn0ekTzZBw8+OvT44IdvSjFhWkHO7mcaXwqC4PbMzIwB7e3tJhaLfTkwMNCAoLa2NgCHDx8OGxoa/EOHDvlE8mQfPPjo0Ce98MWfcdzTaWfG152/My8vr6ygoGBgcnLSLCwsmJ6eHmbmK7nT1yCfPHkyBMePH4/Onz8fVFVVBUTyZB88+OjQ44Mfvvgzjo7npy9VLOX0FAr56b1798yjR49Md3e32b9/P8V809nZeQ7y6dOnI1BdXZ3T1NQUnjhxIiSSJ/vgwUeHHh/88MWfcVJOVyy9mEArLZOpfXb37l0zPz9vLl++jAnF/NDV1XUBcmNj4w4gy5F79erVqKamJiKSJ/vgwUeHHh/88MWfcXS84N+KCXVjlQs+qqurMxsbG+bx48dmZGTEYPrkyZNzkM+cOZML6uvrd167di2SGBHJk33w4KNDjw9++OKv48ALbTH2h6+b6uXy8vKnJSUl64uLi6ajo8PIHWPwvRhegCjHdCeQvZGQE5IjMYdInuyDBx8denzwwxd/xtHxfLjpBYXaWSzPiZ/Gx8eN7APDesseYGqXHzx48Ho2xcBHhx4f/PDFn3EYz86M+xqIdPr6Ll26ZNbX141sTjMxMcHMLN+5c6cxm2Lgo0OPD3744q/jRDqu+yrQzhLB22EY/jI2NmbkRJiHDx9isNLW1nb71q1b9YgyNXjw0aHHBz988WccW4zWkLZnIj3/lYL2vXv3/lpRUWHkYUYx38rR7bAFZS4EPjr0+OCHL/46TpS6Z9y3tW7ieDzecvHixefDw8OmsrKSdf5NrrccOXLkQ7cgtxB48NGhxwc/fO3m3fztHRcEinxBred5azdv3jT9/f3m/v37Zmpq6k+5/okYvmULcguhHx58dOjxwQ9f9Q8U8c2KoQVacYXgAzF+Lu8ec/DgQXPjxg3D2u/atWtF+tgPzRSwtLT0jEjOdfrhwUeHHh/88FX/IG1ct6CUv4V5gmrBx3I81xKJxB9RFJn8/HyeFYbNeOXKlRUt4A0iOdfphwcfHXp88MNX/f3NC3H/XEeCAkGd4B3Bp3Jkf29tbTWnTp0y8pQ109PTZnZ21jQ3N68RyblOPzz46NDjo36R8yd+i18Iob7uSwVN8oL7ubS01MgpMcQgCAyPd15+RPLUfvjo0KtPmM2XQSwl+kAN8vTF9q6s/XeCVd/3V2Xw1TAMlwU/Esm5Tj88+OhUH1rPrD7o7LeNxkCPY5XeaavgPUUby0AkB/TDg49O9dYP/6yb+9GVELwiKNJYIigmJ5Kn9Secj8JtNfcLEgR26Yhbyl2fbTcr9pzjb3N7Et1j61mf/6k539FuEXGnL8si/gEY8SzOXUsBvQAAAABJRU5ErkJggg==",
				bad2:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAfCAQAAADHaLwEAAAErklEQVQYGQXAD4yWdR0A8M/39zzv8R4cB4fADmUorjRUmULKNDetVMtcTWdYbra0aJZrjmVZrY1yW26LcmuMZCZrJUbaLEfGRjUczjnHTUXaIADjPzAABLw74O55vg4ACIQQAiEAABAAAAAANSohBIAQAIoCKCAUgAKg0qq1QoVQBAgUFC231mpFqwgpAAqARqCgVdQCIVC0CBW3UVCrhAoFCEARWpWCIpyTAgFaVGgVtdBKKYwJoaUAWnQQ+h968VNfBgAApPa6iz//mn5FkToKgoIQKlCbMOvrd96775aVc7inHtr92+a55vlmRf4uNxy+oY+Vc07fuOhzd680RVFLrZDUSAW1Srlk7lUPzjAys7efPxy9ZeCP0rhhPZbM+MuRBTN6+5vLue32zfOOveeCGuOIgiJUMPHy29994MY19B6btePUwoFXdc1wjX4D1rqn++bho7P39f3H3CkPvj64WEcIIShCIoVJY7fdG9PLpaL3s6tvmHq/p/zckJPW+4Ufme/OvgWr9V3veHlEfZepoJKylopQK5OnVtdcMNWgLAe6w/6kccI9jjvrFdN0nPPuRD2TdHVcmD0w+9QZjUaIgkSr67uPLdllu2foG467DHlUOGXEB3q87IsuMTlMfMGQNzy6aOA3eoVQyQJCMe2ji1sLbfItej5w0gW11Dprkta4fpUPQ/chZ7SutH9Av0qtFQWEEPnOG252g9k4oeO0Lnaba4LWMWmm0VR6LPAVmzVb9SlaKYuQWq3TVwzuP7xZWkXbNe6499CrOKG1117TzQ2xzg7HbBydc9wZqQhRpFDQyS89PWuF5/SI6ixG3GyK804aMMsFl5niQirTrbfU97tXLBZohCxIjTRx58aXrDDdd6S+5oQXHbDEJHuEJ822xVsuauV95nrS8diwTZ8WjSxCgPPe/ueRjb5qF+XA818b2+igtThqj997xZD7muVb1f9zla5fj3nZKakIKiFVinPONWeGrt7et92RfX17tu5/ev4yZ1xmkU3escvjtu38wq5/j47O3+m1kcNrm/X2GTMmKRIpNY6W/df3PqH1yUvf2la2/PKlpec7xpzWY6Inxg7um/bmj/81eOWwb7uzro/Y7ZxGKNQgpcZou+sfhwb7H3Nw5vxn7/9VvDpt+IGHX7fQVo84dOTvK0fHf7rsE7P3KFaPj7ytQUoJUNDR41o/KKevznm5JJfnzPc93rPqm9nJZdlZa2nPxp/kUzkvP511Y5Wb9KoVRQGgqFUmu8my2Nb34YTsz0tzTS5+3/Jn01+v2/S3/ExOyQk5eaTssdLdpuvqCAQBQmgVHb2ucYVr7/jG3Gk71L6n62eHll48aI0tFhoe+/MLthmy3UljQoskAFBJtSkmWTD5mYvmzHLYQYvc6r826JrnmBOjJ39ovVNGjUutFJIAhBQqFBMMuqM8rFuEaERoa23ThmaddXb4SCuFRkgIANRaIVWmucRlpusgjOhRS+mE/9tr2HnjQiskEACAUGmFXv1S6Gg0KjQ6RjTOSq1UpAQIABAIiVoqWiEVoVU0WiGMCyQABACAkCqNokiNIgVSoBUILQBQAQAAAAgpERIhkQAAHwPlu9kMCvbXiAAAAABJRU5ErkJggg==",
				miss: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAcCAMAAAAz6Z0tAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA5UExURUxpcdkCCP8KJP8MJtIAAdkEC88AANAAAP8LJusHGM8AAM8AAM8AAM8AAP8OKf8OKdAAAP8MJ88AAK2kIk4AAAATdFJOUwBH1rffDcv+/if1nzhijVC68IB97NktAAAAjElEQVQoz+3RSxIDIQgEUBkQ8K9z/8OOJi4l2afS5c6nXahzvx3fKmJt3hYBh84MDKa4dNTW6qWXYTzqey+g9HNXG2OfDxThSKpW2OaWdCSozQEJTwPSj6TLvD2/jEWS3G4bq6hEWnOsLorlPHSXtI2w8cCrowAUEsrW82aOEufi/OEbS2JOxbt/vucBz3AEu+Dj2y4AAAAASUVORK5CYII=",
				sparks: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALgAAACWCAMAAABaS7KzAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABvUExURQAAACocGzMkHTkhHCYaGyYaGyYaGyYaHCcaGycaGycaGycaGiYaGiscGzAeGicbGisbGiYaGikbGikbGi0dHC4dGycbGigaGzAfGygbGjAgGiwcGlIhHHcuJEchHMBJMJpEL1YrIuSoWjkpH0ArIq2KtiUAAAAjdFJOUwCn+f4wEBYBCQQkPhx161HBZ4tdt82XR+CA/db99+j99dP3oWq3YgAAD8xJREFUeNrtXety4swOjAFjczdgbMwtJOb9n/FILWk8JgkkwZPvULXzY6t2K8s2si6tlsb78vLv/Dv/zr/z73x6EpwnRD3CeS7sQJ3iAPsz4U7TeEgnjgn70yBPAHs65jMdxl0hT0JHDdubYA8mdAaDMZB3FzQBo4YMHk8Hk3KxXq8X5WA8fRy5FzRpuKAh4MPxZLGcVdVsuS4n4+GjwL2gGcaAHs7g5XK2KopiNVuTzR9FbkEzIM8bA3oS0OCrKMqjiJBPBtPH/qUEtpCgoaiZDsPYXICvqyLKMka+XAzIy5NOgmZJUTN5/AneAZ5nmzyPitniUS/HJw4QNBQ1hHwah0CuwGewOANfPwpcgmZNQRMVRbVcTMKYnB8s24f+GbjKwxbHByJo8iyLGHkok8MjYSCx0OBh4M73NlkXj/CmS5brZbVadeGT/HmUXldRtnk7EvLVsnw0T339aAn5hJLActlBFqDPmwrw/dvr2yYq4CuB8gojpwRWlpPJw2wlGcUKfLN9g6+Q8z2WYG8VDCl0VOoe5odq8SrKN/t9A3wUhpALtZh2QS7g48ivlFWyvNCSFgK4siKPziUP0GmrP1VBaSoqhEQEcZU2fx4p4l/Taa34XDlXlKco3kMV/XbHYqjT3/JpdryhchVOU2Womv+Fyyud/kUTyn9dWipNU6H44We4uQUFnUaSGf0ceTtNpX+EW9K634QmP491eWSWppK/wk2FdA0P/VUTepWm/kLxUNxEXYhOr2azNZNFQf6T/Ohlqb9RxxxukEXOwsYWvXMzKd36k8Aay5hbZ617zEpLSWewYfKd89+IWtK9UFex2W+ZaqxmYvLRVYFqXOHq/CfQteWfgdrN5/PtJrdG4MuT+ue/0nxVY6HuhXGfTvN9FlVLKX1f4I2b44H/Y7cRT1mgCWCDK3A4eTpKUx91HFuinuJooQX+lkv9xXe4Bk6uQsCF3Tlrqp0ZMAReLZBUZPULwPSfOv+fuMp+S2dvzW7sOzJQK2CtsFxjgR5S9dDcxjxKv0s46NYEsLSwoR5d5YUWcAd7Aha10FMaeqYn06H5fCzPZiqlP6Tk7JUfrkCVtv0fYRPkNdOC5YwOswMCDzo4EXIGlx+6Z9PlzOCrwjkRrWJlcoVn8Dh2sNdrRszEAD8I8HzY+EIs+Yy1Cy8nSnoCIp+aVqFtgCjF8FaYm52EcM+4w0F7FrGUBPAVrL8W6AMJXP0sR9fC5JjE1yqsDYgtm8TCstHcEGwGnesB/qLQx8TQJxK58qP0h2uJlVDUi9lK3OSMsUaVAm/hjkBnNnIygZ+DmQE6PH7BrWfhiXuuTHWeZJrGbep6Ny06V7iReJA1OXHaF4DkC+g4POngL5hznLO3uGzf+Yyl1QR4pUSBq3+vhIZtqU6B1MztC+zZ+syHOVpncCj6QZU/S02YlmQ67uiU+lGRb5MTcv5xy+AMe97jM28OWz+Hw1SccaJIitmeieZa/QcxH6SHbrhrMvroKTA44xHYu11Pzk6+A9Nhhk6hWhhuEM0Vp0x+Do26GkQMday7SeFIEww8EuKruHe7Xb/fv/Qvdd+gS6KJIniU0h48BRSIlejZYXTzBjVI3/BDaArwnQOOcwH0LVw953SJUJjPuSnhhIkcyiVZpbnukaueJQnGqmATmjkTyB7jJdD1rmZ702HsZnSkmJwz5h4xi0rFKQbfaRVoOpSYhmtcQ8pgOzR7PTFzTYDr/uH4ej7U/CWAXK0u0GF+Njd94bfzmX5fKNEPUUM9ZQjcaeLXHjY4A6/Z6H0AP7wScn4AYnOGnmVWWRGryI2n4/vbvhHOk85ZiyiA2E5YK/lj3OIo6uHiKvBwcpTD8Qh3qQ26mlqy40we1X5LPaHXzXZf+lnQYmUIk1YuhaxuGe49p/CLGJyzyYX85XKp+bd1DeDqLlmuLIAPI+csw2mnqMIAN5VbqDk9Z06/DW4YXPOI/EpwEZ41uzmww+aYngp74ecF5DZjCQMcuwmVKEOZZLBZG7fLgeTWZHOy9+HANq9rNboUIwAHYSzZEJTaM+6teMbSvY9j3szdJ0cTLATuhBqeZS3ctfgKgMNb7LhahKy9oPCeeI8wUCLXCb8pQ2I5ptuawRGYkrbhLOQclMh3O06MAr5n3rKn78w0RQi68fNq2cVqzFddcxXlb8eTBNpe+EerZJp3yxdguJdaIvRiRoccRv681LZoogL2ejHpagHsA3BMWd+O5zNlvJ5YDpVvo4GprsIYJRteLghP+QLOW9omB3b0Vr+ZGXwXeBVlVC7OR+J9anIlTa5kwrfFwy2l1H0Hn9xFnAVyAXNZJyGNx8MAjLzZYmER8XTygLdqfUOt5GhUsvNwoNYgvBKfanKnd4VazpQtliY4wUsV+N6lcFBZzSscqnDw2v8O5iyq0EgTK41nGFVuNJItFl4c2khTKZ7ikqErPX2tmRdLKPiNc3MO0K2YvDTRIO2+z7dPS2w0gbwtXXBUCL3beFn80m+cRKp+y95UQ3dm8kZcCmDrRqtxw6BK1Thk8ZURQ+RD8nEFbvVef71oWpTi70y+EDkrDYRbPtTGWDqTF5VtJpRWKj6XHUkp7CVqdGQYdfVa6JYE6CaSbcwgwFsavA08S5XjliKTeE2E7+LCT8xPLspYkOJ3qAJkckhC4YG/2P6NqMmQ5FCvi1YNAmStmuYpWoH6DBr+QiaHPCENcpfAE39HxT71So4zJVAkHotPB/qiwJt0Ujvv2ZmvaJkffTIP/R3o0acTJyfHTWVsMpDGomnxpY3ou+RtZd+wXxzw3nafF7JyHKd+KmxNiX70FTzJzcC3GyE3qYI8sUCeycXLe+2i2W85i/YTClzmYNQ6tH3ls4Hpt7DrpkM8dEOnq7+lcpwThKQXsJQoQtBF+x81szM4eTn9AGeXlpPHqUPXwp3+RMhtXZCYfj6oUeiK3JlcdCyr+/Btr4twp8+W54SYqZNP4+bZGu5mkvfNaZH18nZD4nMN1bQh/KSZvGnz+3Xfj0ZJKI2zMNfyo9MmBSMH3JvRfHNa5O1P6fAG445r5Lakpc4Ckyu71W6C3NtLJlo7BTj9hJT9zErQsD0I9UcdpUyQ7gq51suv5YYEKDOUyK/83JwFKVHiUzUhyYo78466BbxnPq4Wj1tT6tjF/VJGSPfXZN2OOl+QKIovd4KTxs2dszi5tl9boTF/sd/0FHivzVaGjtaOUClcuppRS8syyP0uutmWiEQmqz5H7pzRnMUhZ5MDXtPbe4HJf7rjI4sY+HQHPG2p7vKRQKE7lqPR/Z6YH/wmawbJ6Sfx+RG56YeMjxMfUHrwdz21t3SsHiP3Br5TG3KsCuHP+mRuO4sPfL/B7rHsHHz8O2J0F6AL1aTmLDXX0lJYFveFFZlXSMNcWWxe4baZEtvhdBI6Vt5e3W7u0pD19vJtv74a8BlyaOT14XAQVt5jm1+AuO7ZmVvXaZ7S4Na9NSejHo7HE/RQMvktBTppBCsM/+4oeh5ykRUjcZa6Ph4PKJ8UmJxjGtRzVZNEzWr3bilS8VqdBHOCw/n19XjaRKqH3pvdL5bVyrbHbvrXFXLZJOJcfjieD9DhVB13kOfWrooK18riMLg8bpM8+JOOx02+mt25nyCze86glUl6N6VIR23gm7NKnIUy4uH19SDKuMr6GBzK5DaTwedyUfp1cyQ1BLdAjPhgMkMpn33lDnBv68DWpstbSdSv/qIt7tnLL/3j61n1cRtHYFiLYYrozIrbA64Gz/anU08USIa+41o1u3exIhnZ1sFiIQ3aHSnSR16qYsS8/HJ+PR8unAdt/sP5Nc9NW5dFjLbBUUPwCeQgh37/IK0gs4O7wIVxD4e6zOHoSnJnjCiZTOxFJuc0eH49kqsg+W1l9qPaQCV1XHA74JpSWOVDNiHoB4hjrJkV94F7AefI2W2G42rR1AxGwOkRs5tTgPYw01RLywbOWjZYxrZq5nDLiiN9c57YUT4Rk8832V0fd0Ak4iDr3V/3VqPbtRnkciCnf7nuYYislhbUAtupbx7uJXZK54z8/Pr+eqYPoCdGWYUq0De0c3e5wNYGk2/9DdNF98iI3MOdjxcYPI/gHwK6nLRgK3DF7YgD2/z9nb76AQR4eTuPf3z+6Xc3BPnn1eTsK0LLyU+Nlswa0B9h22SsEoFPgCvy3okeGE8Sv30F56c7mXYbT8JzB+wUX6L9zNx2k/SE3ipikwm5YOdaNOlrA/n5sOX6E+qamSAXKdqVT4RoT2evi0kD2uOx8kDdhAnLUTrE4699fH/niv9NF39A/Z/q2GIuLHDnerQFkp+Ajv1FI3Sa9qyo1mc4m70I14T8/JZHwa5SttuQIhJhSw5cHCqhW/dM27vnyqZxHe4NhIAMv5dlo8Pp+CY763FQ4LaKa0vEcxt2lwNHX0dXy81edBDwt9wbic2lxWPePowD3h2yllV56d4mucIw4/TDlv/1hCnKCbiOT2U3bes3QCGBo3ziQl4uqykggkrUfPe4Dmte965sWUj3KjLZoJvd5nldriqseU1Pz6pSbXP09TqqSyuFzPnXtgUjrXIZbM/MV3OpixlA/J/J+c6tJ3eJhOUcWeqzyQf6jbD7w63ueeI2yWUh984/rLMxuYCIWblNPtzXDmRwd3VSF8qd+P+9m33NnEYJ2Fi/fKmrlIEMrpq6u9/hFuWmDXNN7kbHcNx8U75xMfCvIwYB7i3IjQd2K8K7UfMNnmY3vFXdjt2WIL53qKsgLXHa9iDS9EczhfYbl7wrRW4yEgo32tS12+pP05/dWrq+Oem/8SrUvbOWOP3b1z58vjLtldlw5Eq3q377oo32Rb+/uKflXUHMZZ8NnCr++TXbP75a6d7IIgtyv3+9xF9fATXgBRSRcMumAYFz/3A6bbPQrVaHvabdQZzPj+fTJi/CNrddZhWRWblreT/vxVfiZ/CVoYvO7fmd5YjncPJmWMfLQjw6qp7EyUf2pifqWdBurZZl504eIFkmhnwpE5io+9fWXJfVzkxuqmVlr9fqtr81ChZ3/fYKeS3lwK6sVkudYndomDR2BL3Lu4jJqHVltdtdcFsGswap0wvPzfColAZ52iVwfWGifnS3XahdFGoGMF0Bb70rzbt/3JldTJ2YigDe4cNMbVTevvHdcezH7sUN3XmK3YiJtFOxGEpeOoQ+6noZXN4mp8soeKvBKoCcmDRvjHnpFDgPDFjA3eOKRZiriB23MM37++QKKxT3AJwiHG0G8JOM8cLcoQyiIsykN6QWS4czzwC8GdFgyhHs1mog4QZvAb6//vN/x/ftnYlRR++M/kvksvyjBSh+BuD+OxOXgS70hUIee+9MtEX/l+dA7r3G5+qCwv85cjersR7oKf7DhY/vTHya/1rk46tdn+k/5zC4yXP+Zy4vz/q/0Djk/wPn7ip7+G9zbgAAAABJRU5ErkJggg==",
				blueMsg: "data:image/png;base64,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",
				wgLogo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAG2UExURXiw+HLC5Yji84DB0woUGILK3g0VGEZcdR44SA8bHozU8Ds9QCg1NSI3O4PJ70VcYYqvu6vBxw0bJA8WFxMjJxQWFhMZJQ4YHBEWGBoaGCAhHxIaHRwdG0NFRikvLyQuL2aXsJDU9np6fKW0u9na3+jm57rCxhcZFQ8VFyMjITAxMRcZFycoJzM0MxoaGQ8VF0pMTi0vLT5CQDA3OjI2NDM1MlhaW1FTUzhUZ0pOTnZ3d32BgI2Sko6Vl26gsVmCkFxnZ3CAhsfLy5q2v6Cqr8HIzKSpqpqfobe+wc/T1sbO08zQ0RoqL4CxwUJGSj5CRUFER2ZqbZaWl8a/wY9vcskiHjU2ODo9P1VXWUtMTlBJTF9dX32DhVkGBsDBw56anN/T1bCztN3d32wkJ9QJCce4uaBqbD8eH3JhYl1ERVIdHUtERm5naVMBAYyRk2sXF3BKSpdMTZIpKWlkZYxFR24DApxXV50EA5QeINbOzs7HyHFpansDA8tnaJSLjZMQD5IQEenf36wnLNJaYvtCDq8xE/QWFfwxHLRFKOUcBuva36Z5e9giH6+JjKEUF9RVSfdBQ6CisIhPiQ4AAABOdFJOUwQHCxsrFk0CBzcR9g0pCxItRBtoIJ4URny4sFqm8GJSFQ/9Xej+78qD5O2x1u3JkPGSz0p0zv2iG4+xnaKPLiVgX8I4Z6fN8Oux4+UvI/Wmz6gAAAELSURBVBjTDcjTlsMAFADAmzZumtrm2mbXPKdJ26S21rZt//FmHgcIQFgPptZo1BjNIkAAgcjo6cXlYHBpVo15WACQYTML10K9/hXz++S0DID2zQs398W7D7Hm18ilCM1d3D68R2ufz99nU+MAyES0chX4e3p9+a0eByYxUI1mDsvlytvjT0zcL47JQTWcLuRLl1XxvLS3ExuRYiCZ3T44Ojn1FnbX80NuYHr7U5GNrZyQ3cyteZ1uIHu6E3xqNRrJpFcifa5BIJVdnXEuHOa5eNJhdymlcFodPJeQTtHeYaOA1FI6a2ubQtHc1GAw4ygQjJ6yme0WS4uhUYejRiAI0qhHKROOmyhUy5D/T8Y4lZQQWWoAAAAASUVORK5CYII=",
				tenIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQcSURBVEhLlZVdSJtXGMf96DY1M35NiMNh1EXm90cak6hrdCatKOhFdegWvNFdZNkqokPEC4V5o5W6ebHhxNJuVh2i0CtbC522tNgxxCF0TJBsNhukIl0XyxqCPPv/X960gbluPvDjnJz3PP/znOc85yTiPywKvARiwnhFHeO3Y1skCInGAQ2IV2GfC5wAnEeOZdEgJJwE3lBJUMf4jaKc97+MkdKBzqkgG5TZ7fbHNTU1j9AvBVkgBRwrLdwit2wANvBedna2d3R01Ds8POxhH2PvgrdBBngV0OdfLbQtTVpamikjI+M3irAtKCj4cW5uTiYnJ4V9joXIy8v7MDExkbuj75H55nZe1mg0usrKys+bmpoOA4GA9Pb2is1mWxocHPQ2NDTcd7nc8vChT3w+n/j9fuG83NzcLgTDXf4zJVlZWVqK5ufnf83Ja2trsrvrlY6ODmlsbLwWGxt7hf29vT2ZmZmRvr4+WV9fl52dHamqqtqPj48/l5OTkwyp51Fje7pw0eXlZSErN25IW1vboV6vXwIHFJmZnZX6+npfmbFsGwv9tbm5KWNjY/tJSUm3DQZDCeSeR41oDSHR7Z+3FdFLly/L1tYWo/Uih1covLGxIUNDQ2KxWn6319ofVFRUHFy/fk2QpseqcDHknkUc9RYsJSVlU6vV/lBb6xBrhfURBOX7e/cEefVgfJbCq6ur0tPTE8Sh7iBqKS8vP5yfn5eBgYE/dTrdbRymEXrPKoS36DUMnsEBfEBMJlPAdsomKysr4nA4PIhYEV5aXBS3272fnp5+s/zkyfuYJ1NTU9Ld3e2H8F1QBS3eTMViAeuxDJwtKiq6hUj+sFqtsrCwINXV1R7sRknFpYsXpbOz8ylS9x0q4YvS0tLDiYkJcblcB6mpqRQ+BQ1eHF4axV4HlpiYmE9ZuyUlJXeMRqNMT08L8vgrhL+h8PiFCzxMwemv48A/Li4ufjIyMiJOp9NPYWqoWoqxsHOAE1u8Y7FYgjiEb+GEaD4Tk9m8C+FFRXh8nKlgbn36LL2nrq7uKQ+zubk5SF9qqFqKMdlGbOMrRott3iRIiTAaRO5DjV4l7e3t0t/fr9R2S0uLnOvqUhbC/Cf0pQa1FFXYiaioqEZEyHwKDwRFokAnpEJwbR+YzWYpLCxkjoNO5/vS2toqH7ndwczMTMWHvtSglqqrpMKCkvokOTm5PyEhYQi3bCw6OvonXJpbyOcvyP35uLi482wx9yoiFKQmgAgFafqSPvSlBrUoGjKeJCuDT6IVq55GqxAZGVmHthbYwTv4fQacxpxatA60DoxbAX2pQS3FmGOWHJ+/dMCPfG8J3+I3VcLHMtU+W3Kk8YJQmAtQnPCl0qot/zEI++GEvocuBDXC/7KUR+OofwB+fBEvsIiIvwGdi5IETpXqcAAAAABJRU5ErkJggg==",
				testIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANlSURBVEhLtZTPS1RRFMfnvfvr/RhNUMfSHHXMZkZnnPHNWFFQUKvKCPq1yApaVvtoIS2qTYXRj021SYOCDCKiIogW2b/QwhQCF7XTdQ7S6XvepAy9cdGvA1/ee/fe83nnnnvuiRHRf1HdwT8V2+p77cTfqi64xiw7FlNxo7sapRhtEfb9diVmklpWepRc7lBiHmNTmDvpK5UUWMs+Vde1wRYWeo5llRNajSe1mu0xqjLgaOp3IcdQ1lGUNmoJc5+apRz3bGtYWjGPfRlQF8yRYmG5RdoTm4xayHma0oBmjKYcnjnXQE6ogucQ1iwmpD3JcPatC7Zt2/KV7GzX8jqiWxgbLdHXD+foC2uadRbv0PSZVY0dD0J4q5I3fK27hRB2BIwUuE1Snkg5ZibwXTpa6KCXt0boxc399Bz6/PZ0qBc3R+jVrQPQCB0qtFPguZRy9Nw6KU8xIwI2VqytTYmpvGeWBrHNPLbNOe01ijq1oumJI/T+wWFKIS1FzA9BvK6EIAZ9U4HvU2ZEwOtsa3OnFvOluKGibyjDBwYIH1zKSHp3/yC9u3eQ+jDGwHLcpSBezXXgO5RUcp4ZEfB6KfJdWi3nAC0CnsXB9SFSPjQ+wDd39tHr23spg/EcQP1QEPdCFRtc3tkyMyLgNgymUFoFQAfgnMcPcmGJKdrsSHp+bQ89u7qb0r6mUiMqAykYgIJGqMGhbvgyIwKO21Zvu5Izg4gkD2cGF/GO/NEmV9HUlV305PJOvCMV4a4cyKUhPPl7gxYzzIiAlRVrbpHiXtbVSwUs5MUBwCUoDdjjizvo0cXtlObdeACHuQUY6/o9/a1VibvMiIBR4Abldgzp+FQFV09+GM5ZVMfDC1uhLbiBhgqYK6PMtnFFeOZ7t6M/4oofZkYELMILopIJJcczrl7kaIoQl1MOP5g4P0wPzpdpAOAhBkNbMJd2zUJCiWueFBuBsCJgNlx25eJ6rldiErdvkcuOo2PY5dEMXYKySAOnJwjrXC90KDnp23Z5zSv908ImxPA2LW/0Omou65oKR1xEJWxr4l3gR56p4LbNbkCjagR0zSb0i1kcOdpmdxPaJraJtinRNlUFfWE5ibaZkOIpzuNUgzFdshpp/bZZaysTv6sVW/2uHWRbmfhdrdjqd+3kvxPFfgCnD1EcKH+OSwAAAABJRU5ErkJggg==",
				testOverlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACQUExURQAAAAoBABYDAgkHBxwEAwMDAxACAQgICAQEBBYVFQcGBgUDAwgFBQwHBwcAAAwBARwEAhsEAhQDAg8CAQkGBgkBAQwBAZqamgcEBCEGBAwBAS4JBxQDAhECAQoBACgIBQ8CAQsBAS4HBTcLCCsJBi8LCCYHBSEGBDQMCWBBI0EdDNCvYFUuEIpgKerIbKJ+POkkqdsAAAAkdFJOUwCD/jb+Cv4BBBIhGS5UenDU9cWPP2SoB0jq9fi4ntHi5e7L2LyXA2oAAAJBSURBVDjLjdTZYqMgFAbgIFoFcd8TNZoCkqUz7/92c0A7WZrUoJef/4EDstmsD8+B8YZzPYf45K1AH9fsjUDi5ygI1qFDWdShYj3Qx1GXdWjVURxlXVuGawv286IryziNVvoC62jTOO1T9GtbCK1RvG+GZvgNQltoHTa7RI84e+kqQnEQxsKeEnhfQ89nLEAxIMu27SZ+VbryWR6EBznZlmXZVhK/aE9FGS5QzLkNEuy2z144XINTQoKcoPrYoxcuB7eTgksO0JqSpw13Ca4jqCvhgdfWiynxE0hMXQFIcKWktJMkDfwnjgURSvnRjJOCD5K0oM6TvCDM0p06n89/zuejUELsQ0rcx/lVbHaCT8e/UoBTTcaI5/6sa5zuzOULpigU77Dvue7PuqgFx2Fqly/BwbW57zxCM792p+sJIU5HDqUPs3PvzgsOEOQJw5Q6XSDwUFPHe4A6r2t3uio0UAAU6jNg5BFWDPZD50kpuVnuSXwWzHcMvN1g2N+yUVzKCTYOMrnaR8xfAt0HB9smdaIe4DAlzj2s9LnvmgniZgaZkEeJDvTuXB1leznBodKB2pq6xl0h1IUGxhIOlLXI3b4weXPgxl2uIXMAE33otZwmyRs9v2/n/r+ucu1s6wMe/dNNspnXsbgZeoTCSUhH/b8ZCbRBmJoG3kDXgQshKoftxzJADugub4YQmBdZP35D62M7oLnPt3kwQwIrLvth3OoxjuPQh3gp617zIJHVCG7AMu37tG3LssuKa5t1Xxb3D/r8QjMvEc3CAAAAAElFTkSuQmCC",
				refresh: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMzSURBVFhHxZZNSFRRGIZ1FBXKqGgZZJQgtWj6k6KIgWpRgQv7kVpUSBm6CTKUFuLQogQX2sYRDSMUaaKRiix/aoxKClLzb7SFEEhRCC4iW/Q7ve/xzHTuveeOc0cYP3g43z33/b7vnZl7596UcDi8pPxPYsT7yedcUsE6cBAUg8ugSsKcezxHTSprIujCiQEO3upyuS4eO3rklq/h2qvenvbpwYHHc6Hx4G/CnHuNvuv91FDLGtaaDHjkGreBVenp6SWVlWUP3rx+OItm4XigljWsZY/5Vime+jpvn8zjMpCzc8eWmr6g/5NuSDywlj3Qq4DDuTffemEDG4qKClqG33V9Nzd1Cnu0tt4YihzL/jENrDl75ngLf1u1keQH8IOTIAdkgOUgT+7dBdSY66LIGbYGXAf2760aHenVNekAG0H06raBmgAw1ws4g4O0BrKzl203/+aTE31/sFYA3TAtCE93V9sH5IbhkjQKdAZSvdWX2jUFjodHLjgdFDAsBjIzM9abbzX8FPcpRu6EamAYqiKmIywGKitKy1XhRCj4C+tairEuCl1YDNxsrg1CrLptk1ptUyfowmJgaPDJV4jFcOZSJ0Jtlgi6sBgIjT+bgVgYwH/AjNSJUJslgi4sBiA8DD6Dj8ylTgSbLAYZuaBckmsxECt0TZ3AKDl/qnngbec3wjzpBszXWLINFPKTIxcGxkZ7Z5NmALHC7/cNIxfDycsXgcZYBrwx8EQax8vuXdsu4A4zPFlx7LE1oAo1eIFliB2IPYF7TSHk0R4jwz3TWF12Blyq2ITT4fk1NVe6kRv64D/mHE9qDUCQZi4gnY9uT+H0CbAax5ZhKtRQiydrJ54nf7EX7TM+9pTXgu3jWIRaoNIRaJrIz3fXQVIINoGVgM0Ic+4VUgOt4WsnMMPXuzxoRDg2QPia5r/TMFpWetrvdm+uz8rKukqYc4/ndK9yeKn5ifWQHCEiHgOtKJxTjhNC9jAMZyxkgLccc75sDsi9RGBt9GtXI5YBMTwSOOadUQymgG6IDmpZw1rZyRi2BnTBJrLZPlAL+sEXwLdnwpx7PEeNGBxBFxYDS4V2M3mEU/4Bmtz6+PFwAdkAAAAASUVORK5CYII=",
				link: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABLSURBVChTlZCxEQAgCAOzF+u7lxoFDhUKvxE+aRAV/YKi7XGjPUf1KhJRf8DAX1tuol9zFEbmHpmWSBkonn8VJ9XVwtCW4x8TGgAMZgeUbNICO6YAAAAASUVORK5CYII=",
				marks1: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFqSURBVDhPpZRBa8JAEIX12J8ivVUJ9RYsKiGHgMRqajQx2exmd5PUEPDW39b+n156XsXpbOi5pczCnhY+5s17bwe/HffJbbIsMyxnwAoGm+3mIwzDu5/n/5+Ft+iUUoZzDlJK2O12NGD4HJ7rujZaa0AwHOIDDRhF0VtVVZdKV1CKEtI0fScBV8HqbCUrqSDPc8iznDbhbDbr0AzDGANecGAZowE93+tEIYyVq7QCzjgNuPSWr/Eh/sLdXbXUIISgATE2FWbvM9pGlyzN6Dv0PK/TSpuyLAHdhvglprns+36HsH6HmEfA1tCAQRB0hSjMMT3epJAQx8QJXddtsG5mvV7fmrqBJEloO3TGDhorjOCi32GSEoHT6VRhS4ytHppjJdOAY2cscDLTNA3Yi3kkSn50BDbEVu9qJaPLNOB8Pm/RDGPlnk4nyBkt2MPJw0QjyLRt2wOp1RuO7key/xx42f+H+/3+jxwOBt+uJdZ5T0kzugAAAABJRU5ErkJggg==",
				marks2: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAL/SURBVDhPhVRLTxpRGDURtNumaVJJkJaFj4UxxoVLF24UikRFRpg3l3kBw8uktjH+oMr/aRfayr7goyvHtHw930SNpu1wk8ksvnvPPd8557sTT1Zst7Db1QxtWK1WSVQFmap5nkwmE1xcX1+PbW9vm5VKJbAsiyzbIuzvbW5uvg5P/2PFd3Z2jkRFXFpVi0zDJE3VviUSiSQXGbBQKAjXdQPHdcireVQsFiMBY7ls7tDQjaFjOwRgPnD+ALi6uhpXVdWq1+tBo94g/Kl8UD7FJf8FnJRLclfX9aFt2eS5HhmG8X0mPTPLRdu246ZpegC7Y7BarUayLEcD4kBH07WBEIJqXo0BLxYXF1NcZIblctmq1+qB67iE1gmX93BmDKCiDcCG/LrPOvZXVlZCQNYwn8/jLhGawh1UjEok4DRcO4Zu17qhk+M4ZJnWM8CCVBDQN/A8jxqNBsHx/wOmUqkX0ORkv7h/g7ZZH8Lm/tzc3Duuhwx384aiKj8B9Mtv+AS20YBw8QQu37DL/DHg/Pz8W67f51ArlUrDcql8VxVVwt7xDLHhhkNtOzaHt7+8vPwIKEmSgFkBO8xOS/vSaVQOpxGbY6fqXMNJcj2XTGE+A4TLAvqFgC2/xcGPjM0UGH5Eq1dhzuphbP4CxFgGnFNLWL/H5XAKBz4hY1fMgJ3Ewf7a2tpTDU3suUX+RtyFoii9KMD43t7eEbJ1yYZweMHmkSFWLJPJqMhowBnkC+F4JOCkVJK6siL/wByPGBAGXaTT6XD0sGK5XE5nDXmWGbRULkUDopU2Aj3gSQDLETQ8m52dnbmvxzLvMyq0DZrNJvE3jmEMOTyENsOm3yRmgQvOEKc3D/Wt7JaGC28xxyOeFFVXewUzgiGYdXzfH/Bm1gjB/bK0tPSSi2wK2Ah+vrCHWq1W+DhEmoKROgLYVbvdpm63y/P8dWFh4dV9PZbNZnW0GnQ6Hep0OySsiNHDih8UDz7gtb70HC98HBRZOX+q4cbGho764/OFCH1+znBi4g98VbeovG5kHAAAAABJRU5ErkJggg==",
				marks3: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAP0SURBVDhPVVVLbxtVGJ24i6jJKquwyA6SqokNpqqjWFESpfGDYOrn2OPxeOx5eezxM8kuFIgFC34MW4Sg4G5hUSDhL8AGwQIbCWxTz+V848k0tnSl0f30nXvO+c695gRBsGtGjamqyhKJxJcP8OPc397e3nuKpkw0TWN6TWeyLP+I7du6L5PJfIy+oWmarGbWWDqbZlxFrsza7TajxfP8Vzs7Ow/dBm77wTZv1swJHUigYlH8eXV1dcct+/JCvt9oNEZm3WStVovlcjmbI2YOYKvNRFF8vr+/f9vA+R/631cUZdyoN5hpmCyfz/+0trbmAVYqlU/ROwKYTf1CXrC5crnMcAqzLIuVSqXB0dGR323gdnd3Y9Vq1WHYarZYpVq5Xl9fd+pXV1c+2PE5AP8mdtQPQjYHmf+QfmKBje/CR2EPMBKJnABkTHKbzSYD2+utra233bJPkqTPSDL1GobBqnKVcfFo/M90Ov1HLpv79fj4+IvNzU3Pw0Q8ESlL5XGtVmOddod8vEH9HbfsS2VSfd3QR1QnULWqMg5AIzRNZEme8jn+27uSH4UeKXk+PwVLVjfrzFCNBUAkpI+hjayG5QxFVQBYLBYdQ+kEyB8cHh4G3Abu4OCggaapUBSYrusM378AMOiWfdls9iNJln6HFTPCIGs4Or3b7TqTRs5epFIpDxAWWEpVmUKWMzh83yBWHsOn6aeXRbH4myiI/xk6PKzCQxjLup0uNcwKhcI38eO4FxsC1FRtqunaXLJh3ASDwdeSRaEPuY5kIpVNZ2dODjvdDnlgA3BB8uN3H6tW3ZpSJKymxRCTBUCQ6WMgI4pUr9tjUkmyOdJN6DRFUF6QHAgESk2rOSG5rTZM19QFQFES+/B2hMGwhtmwkWObI7MJnTyEuS8wGA/Q7/dLOH1CGSSGYHODm+QBIm6fYFBDXF/bZcg4XdMddgTIF/jnof2Q52EwEOQRhTEk2+QT5fAOwyU8JpfwdUg16sfEGUfZcabcabMcn/saDdtuA8UmBtb/wqtXkE6WXG9sbNwq8CWTyWeI25AiQz4iggCkoYBht9elEwbRaNQLNr6fgB3dFBs+2QB/uby8/JZbXkqkE5eoD4lQr9ejt2AOSLGhDRrK6emp52E4HE5AyuSOxy+x/ea8yi1RDuv1+l9Ys06nw+SK/JohbSC4C4CxWCyKg8ZurJhSUb5fWVl5wy378Jz1sT+iw87Pz+eAdLHPzs6chfdtcHJy4gGGQqEC9icEeHFxQeH/4T53f8Mt30t+kHwGsCGB0XKuHl0Xer7oJhT4wgDP/i3gEgAzeN4nNEW664gH/QVszsvcvciTyIe4ckOqUfgFQXj1PxYnSdpNgdtfAAAAAElFTkSuQmCC"
			}
		};

		// style contents
		styleText = styleText.concat([
			// global rules
			"h3, h4 {margin: 0 0 15px; text-align: center;}",
			"h5 {margin: 5px 0 8px;}",
			"p, .reg-KR p {margin: 0;}",
			".reg-KR p {line-height: 133%;}",
			"table {width: 100%;}",
			".b-profile-wrpr, .b-header-h1__profile {text-shadow: 0px 0px 1px rgba(27,27,28, 1), 0px 0px 2px rgba(27,27,28, 1), 0px 0px 3px rgba(27,27,28, 1), 0px 0px 4px rgba(27,27,28, 1);}",
			".b-hr-layoutfix__small-indent-bottom {margin: 0px 0 -10px;}",
			".js-account_game_ban_info_msg {display: none !important;}",
			// page/content-wrapper rules
			".page-wrapper__main {background-position-y: 37px;}",
			".page-wrapper__old .nav-submenu_item {padding: 0 1.25%;}",
			".content-wrapper {overflow: unset;}",
			".content-wrapper__old p {margin: 0;}",
			".content-wrapper__old p.b-fame-message, .b-fame-message {display: table; color: #B1B2B2; margin: 0px auto 14px;}",
			// nav bar user info rules
			".b-user-data {font: 14px robotocondensedbold,'Arial Narrow',Arial,sans-serif; position: absolute; top: 0; right: 25px;}",
			".t-user-data {display: table-cell; padding: 7px 0; vertical-align: middle; width: auto;}",
			".t-user-data td {padding: 0 5px;}",
			".t-user-data td:last-of-type {text-align: right;}",
			".b-user-data .t-user-refresh {display: table-cell; height: 66px; padding-left: 10px; vertical-align: middle;}",
			".b-user-data .i-image-refresh {display: block; background: url("+css.u.refresh+") no-repeat 0 0; opacity: 0.2; transition: all 0.5s ease-in-out; height: 32px; width: 32px;}",
			".b-user-data .i-image-refresh:hover {opacity: 0.8;}",
			".b-user-data .i-image-refresh_rotate {transform: rotate(180deg);}",
			".t-user-date {margin-top: 10px; text-align: right;}",
			".currency-gold, .currency-credit, .currency-experience {font-weight: unset;}",
			// header rules
			".b-header {height: 194px;}",
			".b-logo {height: 175px; top: 45px;}",
			// container wrapper
			".l-container-wrapper {background: none;}",
			// content width
			".l-content {width: 955px; z-index: 2;}",
			// background rules
			".b-background {display: flex; opacity: 0.25; position: absolute; width: 100%; z-index: -1;}",
			".b-background img {width: 100%;}",
			// profile wrapper rules
			".b-profile-wrpr {margin: 20px 0 0;}",
			".b-profile-wrpr td {font-weight: bold; line-height: 133%;}",
			".b-profile-wrpr .t-profile-table a, .b-profile-wrpr #js-profile-clan-table a {background: url("+css.l[0]+") no-repeat 0 3px; color: #CACBCC; padding: 0 0 0 10px;}",
			".b-profile-wrpr .t-profile-table a:hover, .b-profile-wrpr #js-profile-clan-table a:hover {background: url("+css.l[0]+") no-repeat -244px 3px; color: #FFFFFF;}",
			".b-profile-wrpr .b-profile-header {position: absolute; width: 750px; top: -4px;}",
			".b-profile-wrpr .b-ratingsClip {display: inline-block;}",
			".b-profile-wrpr .b-ratingsButton {"+css.input+" display: block; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000; padding: 7px 7px 6px;}",
			".b-profile-wrpr .b-ratingsButton:hover {background-color: #282828; cursor: pointer;}",
			".b-profile-wrpr .b-profile-error {background: rgba(81,0,0,0.5); border: 1px solid #510000; box-shadow: 0 0 3px #733232; color: #CACBCC; display: none; padding: 3px; text-align: center; margin: 0 auto;}",
			// b-info-block rules
			".b-profile-wrpr .b-info-block {display: inline-block; width: 745px;}",
			".b-profile-wrpr .b-info-block > div {min-height: 118px;}",
			// profile player rules
			".b-profile-wrpr .b-profile-name {display: table-cell; margin: 0; max-width: unset; width: 50%;}",
			".b-profile-wrpr .b-profile-name table {font-family: Arial;}",
			".b-profile-wrpr .b-profile-name td:first-child {white-space: nowrap;}",
			".b-profile-wrpr .b-header-h1__profile {display: inline-block; margin: 0; padding: 0 0 6px; max-width: 375px;}",
			".b-profile-wrpr .b-header-h1__profile.b-account-type__premium {background-position: right top; background-repeat: no-repeat; color: #FFC364; max-width: 350px; padding: 0 25px 6px 0;}",
			".b-profile-wrpr .b-header-h1__profile .i-profile-flag {border: 1px solid rgba(27,27,28, 0.5); margin-left: 2px; vertical-align: super;}",
			// profile clan rules
			".b-profile-wrpr #js-clan-block-container {display: table-cell; width: 50%;}",
			".b-profile-wrpr .b-profile-clan {display: flex; float: none; margin: 0; padding: 0;}",
			".b-profile-wrpr .b-photo {min-height: 52px;}",
			".b-profile-wrpr .b-profile-clan .b-text {margin: 3px 0 0 0;}",
			".b-profile-wrpr .b-profile-clan .b-text-wrpr {margin: 0; max-width: 310px; padding: 0 0 4px 0;}",
			".b-profile-wrpr a.b-link-clan, .b-link-clan a {display: inline;}",
			".b-profile-wrpr .b-statistic {margin: 0;}",
			".b-profile-wrpr .b-statistic_item {color: #979899;}",
			".b-profile-wrpr #js-clan-block-container table {font-family: Arial;}",
			".b-profile-wrpr #js-clan-block-container td:first-child {white-space: nowrap;}",
			".b-profile-wrpr .b-profile-noclan {margin: 16px 0 13px 0;}",
			// profile clan history rules
			".b-profile-wrpr .b-clanHistory-wrpr {font-family: Arial; margin: 0 0 10px 0; width: 715px;}",
			".b-profile-wrpr .b-clanHistory-wrpr span {display: inline-block; font-weight: bold; line-height: 133%;}",
			".b-profile-wrpr .b-clanHistory-wrpr .clanname {padding: 0 2px 0 0;}",
			".b-profile-wrpr .b-clanHistory-wrpr .clantag {padding: 0 2px;}",
			".b-profile-wrpr .b-clanHistory-wrpr .clantag:hover {width: 32px; position: relative;}",
			".b-profile-wrpr .b-clanHistory-wrpr .clantag img {height: 15px; width: 15px; vertical-align: bottom;}",
			".b-profile-wrpr .b-clanHistory-wrpr .clantag:hover img {height: 32px; width: 32px; position: absolute; top: -12px;}",
			".b-profile-wrpr .b-clanHistory-wrpr a {color: #CACBCC;}",
			".b-profile-wrpr .b-clanHistory-wrpr a:hover {color: #FFFFFF;}",
			// campaign rating rules
			".b-profile-wrpr #js-knockout-fame-points {}",
			".b-profile-wrpr #js-knockout-fame-points.b-fame-points-empty {margin: 0 0 10px 0;}",
			".b-profile-wrpr .b-header-h3__user-account {display: none;}",
			".b-profile-wrpr .b-time {margin: 0;}",
			".b-profile-wrpr .b-tabs {padding-top: 0;}",
			".b-profile-wrpr .b-tabs-list {display: table; margin: 0 auto;}",
			".b-profile-wrpr .b-main-divider {margin: 0 auto; left: 0; right: 0;}",
			".b-profile-wrpr .l-tabs__top-indent {margin: 0;}",
			".b-profile-wrpr .b-fame-list {padding: 0; margin: 0 0 5px 0;}",
			".b-profile-wrpr .b-fame-indicators__one-country {background-color: unset; border-radius: 10px 10px 0 0; margin: 0 0 -1px 0; padding: 10px 20px 10px;}",
			".b-profile-wrpr .b-fame-list_item {padding: 0 10px; text-align: center;}",
			".b-profile-wrpr .b-fame-list_count {display: table; margin: 0 auto;}",
			".b-profile-wrpr .b-link-list {text-align: center;}",
			".b-profile-wrpr .b-link-list_item {padding: 0 8px;}",
			// sidebar rules
			".b-profile-wrpr .l-sidebar {margin: 0; position: absolute; right: 0; top: -1px; width: auto;}",
			".b-profile-wrpr .b-context-menu {background: url("+css.u.menu+") repeat-y; border-right: 1px solid black; margin: 0; width: 200px; z-index: 3;}",
			".b-profile-wrpr .b-context-menu_wrapper {padding: 10px 0 5px;}",
			".b-profile-wrpr .b-context-menu-list {line-height: 16px;}",
			".b-profile-wrpr .b-context-menu-list a {background-position: 0 50%;}",
			".b-profile-wrpr .b-context-menu-list a:hover {background-position: -244px 50%;}",
			".b-profile-wrpr .b-context-menu-list .current-page a {background-position: -244px 50%;}",
			".b-profile-wrpr .b-context-menu-list li {padding: 4px 3px 4px 12px;}",
			// sidebar messages wrapper rules
			".b-profile-wrpr .l-side-msg {position: absolute; left: 201px; text-align: center; top: 77px; width: 192px;}",
			".b-profile-wrpr .b-sidebar-widget__comparison {background-color: #000000; border: 1px solid #000000; margin: 0; position: absolute; left: 201px; top: 0; width: 192px;}",
			".b-profile-wrpr .b-sidebar-widget {margin: 0;}",
			".b-profile-wrpr .b-sidebar-widget_inner {padding: 10px}",
			".b-profile-wrpr .b-sidebar-widget_inner__comparison {display: table; margin: 5px auto; padding: 0;}",
			".b-profile-wrpr .b-sidebar-widget_title {margin: 0 0 5px; text-align: center;}",
			".b-profile-wrpr .b-sidebar-widget_text {margin: 0 0 5px;}",
			".b-profile-wrpr .b-box-shadow.js-recruitstation-recommended-widget {margin: 0; width: 242px;}",
			".b-profile-wrpr .l-sidebar .b-b4r {height: 52px; overflow: hidden; position: absolute; top: 26px; left: 201px;}",
			".b-profile-wrpr .l-sidebar .b-b4r_link img {width: 192px;}",
			// userblock wrapper rules
			".b-userblock-wrpr .b-user-block {background-color: unset; margin: 0;}",
			".b-userblock-wrpr .b-user-block:first-of-type {display: none;}",
			".b-userblock-wrpr .b-user-block__sparks {background-image: url("+css.u.sparks+"); border-radius: 0 0 10px 10px;}",
			".b-userblock-wrpr .b-user-block__sparks.b-user-block_sparks-radius {border-radius: 10px;}",
			".b-userblock-wrpr .b-personal-data {min-height: 180px; padding: 0 20px 15px;}",
			".b-userblock-wrpr .t-personal-data_ico {padding: 82px 5px 0;}",
			".b-userblock-wrpr .t-personal-data_ico__hitrate {background: url("+css.u.icon1+") no-repeat 50% 50px;}",
			".b-userblock-wrpr .t-personal-data_ico__tier {background: url("+css.u.icon2+") no-repeat 50% 50px;}",
			".b-userblock-wrpr .t-personal-data_value {font-size: 28px; line-height: 100%;}",
			".b-userblock-wrpr .t-personal-data_value.t-personal-data_value__pr {font-size: 36px;}",
			".b-userblock-wrpr .b-speedometer-body {background-color: unset; padding: 20px 50px;}",
			".b-userblock-wrpr .b-speedometer {width: 33.3333%}",
			".b-userblock-wrpr .b-message-ban-holder {position: absolute; width: 620px;}",
			".b-userblock-wrpr .b-message-error {margin: 0; min-height: 48px;}",
			".b-userblock-wrpr .b-message-battle-holder {position: absolute; width: 637px; right: 0;}",
			".b-userblock-wrpr .b-message-battle {background: url("+css.u.blueMsg+") no-repeat 0 0; margin: 0; min-height: 48px; text-align: right; padding: 15px 48px 13px 13px;}",
			".b-userblock-wrpr .t-ratings-info {table-layout: fixed;}",
			".b-userblock-wrpr .t-ratings-info th {font-size: 13px; font-weight: bold; line-height: 133%; padding: 20px 0 0;}",
			".b-userblock-wrpr .t-ratings-info td {font-family: 'WarHeliosCondCBold','Arial Narrow',arial,sans-serif; font-size: 36px; line-height: 133%}",
			".b-userblock-wrpr .t-ratings-info .rating-url_nm {background: url("+css.u.nmLogo+") no-repeat left center; padding: 0 0 0 20px;}",
			".b-userblock-wrpr .ratings-table {background: url("+css.l[2]+") no-repeat 50% 0; padding: 20px 25px 10px;}",
			".b-userblock-wrpr .t-table-ratings {width: 100%;}",
			".b-userblock-wrpr .t-table-ratings td {line-height: 130%; padding: 9px 12px 2px 0; vertical-align: bottom;}",
			".b-userblock-wrpr .t-table-ratings .td-center {line-height: 16px; padding: 9px 0 2px; text-align: center;}",
			".b-userblock-wrpr .t-table-ratings .td-rating-meter {background: url("+css.l[2]+") no-repeat 50% 100%;}",
			".b-userblock-wrpr .t-table-ratings .td-rating-meter td {padding: 0;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter {background: url("+css.u.rat+") no-repeat; border: 1px solid #252527; border-radius: 3px; height: 3px; margin: 0 7px;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter-dail_line {background: url("+css.u.rat+") no-repeat; box-shadow: 0 0 10px 1px rgba(221, 84, 12, 0.15), 0 0 3px 1px rgba(133, 18, 11, 0.25); height: 3px; width: 0; transition: width 2s;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter-marker {background: url("+css.u.ratMark+") no-repeat; float: right; height: 13px; margin: -5px -2px 0 0; width: 5px;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter_wn8 {background-position: 0 0;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter_wn8 .rating-meter-dail_line {background-position: 0 -3px;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter_wn7 {background-position: 0 -6px;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter_wn7 .rating-meter-dail_line {background-position: 0 -9px;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter_eff {background-position: 0 -12px;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter_eff .rating-meter-dail_line {background-position: 0 -15px;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter_wn9 {background-position: 0 -18px;}",
			".b-userblock-wrpr .t-table-ratings .rating-meter_wn9 .rating-meter-dail_line {background-position: 0 -21px;}",
			".b-userblock-wrpr .t-table-ratings .b-stat-fun {height: 16px;}",
			".b-userblock-wrpr .t-table-ratings .i-stat-fun {margin-top: -9px;}",
			".b-userblock-wrpr .wnelink {padding: 5px 25px 5px 0; text-align: right;}",
			".b-userblock-wrpr .wnelink_info {background-image: url("+css.l[3]+"), url("+css.l[1]+"); background-position: 4px 0px, right 0; padding: 0 9px 0 20px;}",
			".b-userblock-wrpr .wnelink_info:hover {background-position: 4px -17px, right -22px;}",
			// christmas marathon rules
			".b-marathon {background-size: 100%;}",
			// statistics wrapper rules
			".b-statistics-wrpr {margin: 0 0 35px;}",
			".b-statistics-wrpr .l-tabs__top-indent {margin: 0;}",
			".b-statistics-wrpr .b-tabs-list {display: table; margin: 0 auto -2px;}",
			".b-statistics-wrpr .b-tabs-list_link {cursor: pointer;}",
			".b-statistics-wrpr .b-fame-indicators__one-country {background-color: unset; border-radius: 10px 10px 0 0; margin: 0 0 -1px 0; padding: 10px 20px 10px;}",
			".b-statistics-wrpr .b-fame-indicators {border-radius: 10px; padding: 20px 8px;}",
			".b-statistics-wrpr .b-tabs {padding-top: 0;}",
			".b-statistics-wrpr .b-tabs > div {display: none; margin: 0 auto}",
			".b-statistics-wrpr .b-tabs .js-stat_active {display: table;}",
			".b-statistics-wrpr .b-result {float: none; display: inline-block; margin: 0 0 20px 0; padding: 0 8px; vertical-align: top; width: 317px;}",
			".b-statistics-wrpr .b-tab-user .b-result {padding: 0 20px; width: 428px;}",
			".b-statistics-wrpr .b-tab-user .b-result-badges span, .b-statistics-wrpr .b-tab-user .b-result-marks span {color: #606061; display: inline-block; width: 48px;}",
			".b-statistics-wrpr .b-tab-more .b-result {width: 420.5px; padding: 0 18px;}",
			".b-statistics-wrpr .b-tab-more .b-result td:last-of-type {min-width: 45px;}",
			".b-statistics-wrpr .b-tab-clan .b-result {width: 296px;}",
			".b-statistics-wrpr .b-tab-strong .b-result {padding: 0 20px; width: 428px;}",
			".b-statistics-wrpr .b-tab-team .b-result {padding: 0 20px; width: 428px;}",
			".b-statistics-wrpr .b-tab-other .b-result {width: 296px;}",
			".b-statistics-wrpr .t-dotted td {line-height: 23px; padding: 0 1px;}",
			".b-statistics-wrpr .t-dotted tr:hover td {color: #79797A;}",
			".b-statistics-wrpr .t-dotted td.t-dotted_class-ico {line-height: 14px;}",
			".b-statistics-wrpr .b-result-marks .t-dotted td {line-height: 31px;}",
			".b-statistics-wrpr .t-dotted td.t-dotted_class-ico img {vertical-align: middle;}",
			".b-statistics-wrpr .b-result .t-dotted__fixed {table-layout: auto;}",
			".b-statistics-wrpr .t-dotted td {background: url("+css.l[2]+") no-repeat 50% 100%;}",
			".b-statistics-wrpr .b-stat-legend {line-height: 15px; text-align: center;}",
			// cake diagram rules
			".b-diagrams-sector {margin: 0 0 35px;}",
			".b-diagrams-sector h3 {text-align: center;}",
			".b-diagrams-sector .b-diagram {background-position: 7px 7.5px;}",
			".b-diagrams-sector .b-diagram-block {display: table-cell; float: none; padding: 0 2px; width: 33.335%; max-width: 320px;}",
			".b-diagrams-sector .b-diagram-block h3 {margin: 0 0 3px 0;}",
			".b-diagrams-sector .b-diagram-block h4 {font-size: 12px; margin: 0;}",
			".b-diagrams-sector .b-diagram-wrpr {float: none; margin: 0 auto;}",
			".b-diagrams-sector .t-dotted.t-dotted__diagram {margin-top: 0px; width: 100%;}",
			".b-diagrams-sector .t-dotted_diagram-bg {position: unset;}",
			".b-diagrams-sector .t-dotted_diagram-percent {display: inline-block; width: 40px;}",
			".b-diagrams-sector .b-diagram-total {margin: 25px 0 0;}",
			".b-diagrams-sector .t-diagram_rating {display: inline-block; margin-right: 20px; text-align: center; width: 55px;}",
			".b-diagrams-sector .t-dotted_diagram-info .js-results {display: inline-block; margin: 0 3px; text-align: right; width: 40px;}",
			".b-diagrams-sector .b-diagram-ico_tier {background: url("+css.u.tiers+") no-repeat; padding-left: 30px;}",
			".b-diagrams-sector .b-diagram-ico_tier-1 {background-position: 4px 1px;}",
			".b-diagrams-sector .b-diagram-ico_tier-2 {background-position: 4px -14px;}",
			".b-diagrams-sector .b-diagram-ico_tier-3 {background-position: 4px -29px;}",
			".b-diagrams-sector .b-diagram-ico_tier-4 {background-position: 4px -45px;}",
			".b-diagrams-sector .b-diagram-ico_tier-5 {background-position: 4px -59px;}",
			".b-diagrams-sector .b-diagram-ico_tier-6 {background-position: 4px -74px;}",
			".b-diagrams-sector .b-diagram-ico_tier-7 {background-position: 4px -89px;}",
			".b-diagrams-sector .b-diagram-ico_tier-8 {background-position: 4px -104px;}",
			".b-diagrams-sector .b-diagram-ico_tier-9 {background-position: 4px -120px;}",
			".b-diagrams-sector .b-diagram-ico_tier-10 {background-position: 4px -134px;}",
			".b-diagrams-sector .t-dotted__diagram tr td.t-dotted_diagram-last {width: 0;}",
			// achievement wrapper rules
			".js-all-achievements {margin: 0 0 50px;}",
			".js-all-achievements .b-vertical-arrow {display: table; margin: 8px auto 0; padding: 2px 10px 0;}",
			".js-all-achievements .js-all-achievements {display: table; margin: 15px auto 0; width: 897px;}",
			".js-all-achievements .b-achivements {display: table; margin: 0 auto; padding: 0 0 20px;}",
			".js-all-achievements .b-achivements-head {margin-top: 15px;}",
			".js-all-achievements .b-achivements_item {display: inline-block; float: unset; margin: 5px 0 0 0; width: 76px;}",
			".js-all-achievements .b-achivements_item img {display: table; margin: 0 auto;}",
			".js-all-achievements #js-achivement-tankExpert5 {margin-left: 237px;}",
			".js-all-achievements #js-achivement-medalBurda {margin-left: 117.5px;}",
			".js-all-achievements #js-achivement-tankwomen {margin-left: 395px;}",
			".js-all-achievements #js-achivement-readyForBattleLT {margin-left: 237px;}",
			// global rating rules
			"#js-knockout-ratings {margin: 0 0 35px;}",
			"#js-knockout-ratings .b-composite-heading {margin: 21px 0 15px 400px; width: 553px;}",
			"#js-knockout-ratings .b-profile-ratings-date {margin-top: 1px;}",
			"#js-knockout-ratings .b-leadership-info {display: table; margin: 0 auto;}",
			"#js-knockout-ratings .b-profile-link {display: table; margin: 14px auto 0}",
			"#js-knockout-ratings .b-msg-important__rating {display: table; margin: 5px auto 0;}",
			"#js-knockout-ratings .b-rating-dial__user {display: table; margin: 30px auto 22px;}",
			"#js-knockout-ratings .b-orange-arrow__leadership {display: table; margin: 25px auto 0;}",
			"#js-knockout-ratings .b-leadership-rating-text {text-align: center;}",
			"#js-knockout-ratings .l-leadership-info-alignment {text-align: center;}",
			// vehicle table rules
			".b-vehicles-wrpr {margin: 20px 0;}",
			".b-vehicles-wrpr .b-vehicles-header {display: table; margin: 0 auto 15px}",
			".b-vehicles-wrpr .b-profile-vehicles-tankstat {margin: 0; position: absolute; right: 15px;}",
			".b-vehicles-wrpr .b-profile-vehicles-tankstat_link {background-image: url("+css.u.vbLogo+"), url("+css.l[1]+"); background-position: left center, right 0px; padding: 0 9px 0 20px;}",
			".b-vehicles-wrpr .b-profile-vehicles-tankstat_link:hover {background-position: left center, right -22px;}",
			".b-vehicles-wrpr .t-profile th {cursor: pointer; padding: 10px 6px;}",
			".b-vehicles-wrpr .t-profile th .t-profile_vehicle-head {margin-left: 8px; padding-right: 8px;}",
			".b-vehicles-wrpr .t-profile th:hover .t-profile_vehicle-head {color: #BABCBF;}",
			".b-vehicles-wrpr .t-profile .sort-down .t-profile_vehicle-head {background: url(/static/wot/common/css/scss/tables/img/arr-down.png) no-repeat right center; color: #DADDE0;}",
			".b-vehicles-wrpr .t-profile .sort-up .t-profile_vehicle-head {background: url(/static/wot/common/css/scss/tables/img/arr-up.png) no-repeat right center; color: #DADDE0;}",
			".b-vehicles-wrpr .t-profile .t-tableClassHeader-open td, .b-vehicles-wrpr .t-profile t-profile_tankstype-open > td {border-bottom: 2px solid #2C532E;}",
			".b-vehicles-wrpr .t-profile__vehicle .t-profile_right {text-align: center;}",
			".b-vehicles-wrpr .t-profile_dropdown-ico .tablesorter-header-inner {display: inherit;}",
			".b-vehicles-wrpr .b-tankstype-ico__miss, .b-vehicles-wrpr .b-tankstype-ico__zero {background: url("+css.u.miss+") no-repeat center center;}",
			".b-vehicles-wrpr .t-profile .t-profile_tankstype td {height: 50px; padding: 0; vertical-align: middle;}",
			".b-vehicles-wrpr .b-tankstype-ico {display: table-cell;}",
			".b-vehicles-wrpr .b-tankstype-ico__lighttank {background-position: 0 -114px;}",
			".b-vehicles-wrpr .b-tankstype-ico__mediumtank {background-position: 0 -173px;}",
			".b-vehicles-wrpr .b-tankstype-ico__heavytank {background-position: 0 5px;}",
			".b-vehicles-wrpr .b-tankstype-ico__at-spg {background-position: 0 -232px;}",
			".b-vehicles-wrpr .b-tankstype-ico__spg {background-position: 0 -54px;}",
			".b-vehicles-wrpr .b-tankstype-ico__prem {background-position: 0 -291px;}",
			".b-vehicles-wrpr .b-tankstype-ico__ten {background: url("+css.u.tenIcon+") no-repeat center center; color: #BBB7AC; font-size: 17px; font-weight: 100; padding: 0 0 3px; text-align: center;}",
			".b-vehicles-wrpr .b-tankstype-ico__super {background: url("+css.u.testIcon+") no-repeat center center; color: #BBB7AC; font-size: 17px; font-weight: 100; padding: 0 0 3px; text-align: center;}",
			".b-vehicles-wrpr .b-tankstype-text {display: table-cell; height: inherit; vertical-align: middle; width: 304px;}",
			".b-vehicles-wrpr .b-armory-col {margin-left: 10px;}",
			".b-vehicles-wrpr .t-profile .t-profile_tankstype__item td {height: 40px; padding: 0; vertical-align: middle;}",
			".b-vehicles-wrpr .t-profile .t-profile_tankstype__item:hover td {background: rgba(0, 0, 0, 0.04); border-bottom: 1px solid rgba(255, 255, 255, 0); color: #BABCBF;}",
			".b-vehicles-wrpr .t-profile .t-profile_tankstype td.t-profile_center div.hidden {display: none;}",
			".b-vehicles-wrpr .t-profile .t-profile_tankstype td.t-profile_center span:first-of-type {margin-right: 5px;}",
			".b-vehicles-wrpr .t-profile .t-profile_tankstype td.t-profile_center span:last-of-type {margin-left: 5px;}",
			".b-vehicles-wrpr .b-armory-wrapper {height: inherit; margin: 0; padding: 0; width: 120px;}",
			".b-vehicles-wrpr .b-armory-wrapper .b-armory-level {font-size: unset; left: 0;}",
			".b-vehicles-wrpr .b-armory-wrapper img.png {height: 64px; margin: -10px 0 0 18px;}",
			".b-vehicles-wrpr .b-armory-wrapper img.imgError {height: 78px; margin-top: -13px;}",
			".b-vehicles-wrpr .i-super_icon {position: absolute; right: 12px; bottom: -6px;}",
			".b-vehicles-wrpr .b-name-vehicle {color: #BBB7AC; display: table-cell; height: inherit; vertical-align: middle; width: 226px; max-width: 226px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}",
			".b-vehicles-wrpr .b-name-vehicle a {color: #979899; border-bottom: 1px solid hsla(0,0%,100%,.3); transition: all 0.2s;}",
			".b-vehicles-wrpr .b-name-vehicle a:hover {color: #BABCBF; border-bottom-color: transparent; text-decoration: none;}",
			".b-vehicles-wrpr .b-name-vehicle .link_icon {background-image: url("+css.u.link+"); opacity: 0.3; vertical-align: middel; width: 10px; height: 10px; display: inline-block; margin: 0 0 1px 5px;}",
			".b-vehicles-wrpr .b-name-vehicle.b-gold-name a {color: #FFC363;}",
			".b-vehicles-wrpr .b-name-vehicle .b-debug-name {color: #D00900; font-size: 11px; margin-left: 10px;}",
			".b-vehicles-wrpr .t-profile_dropdown-link {display: inherit;}",
			".b-vehicles-wrpr .js-error-data {text-align: center;}",
			".b-vehicles-wrpr .b-msg-error {display: table; margin: 0 auto;}",
			".b-vehicles-wrpr .b-vehicle-detail_txt {margin: 0 auto 4px; text-align: center; width: 768px;}",
			".b-vehicles-wrpr .b-vehicle-detail_link {display: table; margin: 0 auto;}",
			".b-vehicles-wrpr .b-vehicle-slider {margin: 23px 64px 17px}",
			".b-vehicles-wrpr .b-vehicle-slider_inner {width: 741px;}",
			".b-vehicles-wrpr .b-vehicle-slider_prev {left: -12px;}",
			".b-vehicles-wrpr .b-vehicle-slider_next {right: -12px;}",
			".b-vehicles-wrpr .t-profile_tanksextended > td {border-top: 2px solid #294B59; padding: 0;}",
			".b-vehicles-wrpr .t-profile_tanksextended .b-vehicle-stats {background: #121315; padding: 15px 10px 40px;}",
			".b-vehicles-wrpr .t-profile_tanksextended .b-vehicle-stats .b-vehicle-stats_tables {}",
			".b-vehicles-wrpr .t-profile_tanksextended .b-vehicle-stats .t-vehicle-stats {display: inline-table; margin: 0 2%; width: 46%;}",
			// profile navigator
			".b-profile-nav {font-family: Arial; font-size: 13px; text-align: center;}",
			".b-profile-nav-top {max-width: 135px; left: 0; margin: 0 auto; padding: 8px 0px 8px; position: absolute; right: 0; top: 0; z-index: 1000;}",
			".wrapper-dropdown .b-profile-nav {float: left; padding: 7px 0 0;}",
			".b-profile-nav a {background: url("+css.l[4]+") no-repeat; cursor: pointer; margin: 0 10px 0 0; padding: 0 10px;}",
			".b-profile-nav a.top {background-position: 100% 0px;}",
			".b-profile-nav a.top:hover {background-position: 100% -36px;}",
			".b-profile-nav a.bot {background-position: 100% -18px;}",
			".b-profile-nav a.bot:hover {background-position: 100% -54px;}",
			".b-profile-nav span {border-bottom: 1px dashed;}",
			// multiple usage rules
			".b-orange-arrow__heading, .b-profile-ratings_link {margin: 4px 0 0;}",
			// region spesific rules
			"body.reg-KR h1, body.reg-KR .b-header-h1 {line-height: 1;}",
			".b-diagrams-sector .reg-RUS .b-diagram-tiers .js-results {margin: 0 0 0 15px;}",
			".js-all-achievements .reg-KR .js-full-achievements {margin: 0 34px 30px;}",
			".lang-pl .b-statistics-wrpr .b-tabs .b-tab-more div:first-of-type {width: 475px}",
			".lang-pl .b-statistics-wrpr .b-tabs .b-tab-more div:last-of-type {width: 390px}",
			// element display state rules
			".b-display-none, .b-profile-wrpr .b-clanHistory-wrpr span.b-display-none {display: none;}",
			".b-display-block {display: block !important;}",
			".b-display-table {display: table !important;}"
		]);
		// applies relevant style for own profile
		if (wg.own) {
			styleText.push(
				".b-context-menu-list__bottomindent {border-bottom: 1px dashed #212123; max-height: 115px; margin: 0; padding-bottom: 4px; overflow: hidden; transition: max-height 0.15s ease-out;}",
				".b-context-menu-list__bottomindent:hover {border: none; max-height: 300px; transition: max-height 0.25s ease-in;}"
			);
		}
		style.textContent = styleText.join("");
		// end style

		// start modifying and enhancing the rest of the page
		// store userBlocks
		var userBlock_wprp = d.getElementsByClassName('b-userblock-wrpr')[0],
		userBlock_sparks = d.getElementsByClassName('b-user-block__sparks')[0];

		// add user treasury in navigation menu - personal data block will be hidden
		var subMenu_class = d.getElementsByClassName('nav-wrapper')[0],
		userData_list = sf.elem("div", "b-user-data"),
		statRefresh_div = sf.elem("div", "t-user-refresh", "<i title='"+sc.loc[132]+"' class='i-image-refresh'></i>"),
		statDate_div = sf.elem("div", "t-user-date", sc.loc[133]+" "+(new Date(ss.date).toLocaleString(sc.date.format[wg.srv]))+".");
		statRefresh_div.firstElementChild.addEventListener('click', function() {
			this.classList.toggle('i-image-refresh_rotate');
			GM_deleteValue("statScriptPlayer_"+wg.id);
			location.reload();
		}, false);
		if (wg.login && s.p) {
			userData_list.appendChild(sf.elem("table", "t-user-data", "<tr><td>"+s.p.cred[0]+"</td><td><span class='currency-credit'>"+s.p.cred[1]+"</span></td><td>"+sc.loc[135]+"</td><td><span class='currency-experience'>"+s.p.fxp+"</span></td></tr><tr><td>"+s.p.gold[0]+"</td><td><span class='currency-gold'>"+s.p.gold[1]+"</span></td><td>"+s.p.bonds[0]+"</td><td><span class='currency-proxy'>"+s.p.bonds[1]+"</span></td></tr>"));
		}
		subMenu_class.appendChild(userData_list);
		userData_list.appendChild(statRefresh_div);
		userData_list.appendChild(statDate_div);

		// modify sidebar structure
		var sidebar_class = d.getElementsByClassName('l-sidebar')[0],
		recBlock_class = d.getElementsByClassName('js-recruitsation-block')[0],
		sidemsg_class = sf.elem("div", "l-side-msg");
		sidemsg_class.appendChild(recBlock_class);
		sidebar_class.appendChild(sidemsg_class);

		// removing elements
		var layoutfix_class = d.getElementsByClassName('b-hr-layoutfix');
		layoutfix_class[0].parentNode.removeChild(layoutfix_class[0]);

		// page navigation
		var menu_class = d.getElementsByClassName('cm-holder')[0],
		content_class = d.getElementsByClassName('l-content')[0];
		content_class.appendChild(sf.elem("div", "b-profile-nav", "<a class='bot' onclick='window.scrollTo(0, 0)'><span>"+sc.loc[2]+"</span></a>"));
		menu_class.appendChild(sf.elem("div", "b-profile-nav b-profile-nav-top", "<a class='top' onclick='window.scrollTo(0, 9999)'><span>"+sc.loc[1]+"</span></a>"));

		// profile wrapper
		var profile_div = sf.elem("div", "b-profile-wrpr"),
		profileHead_div = sf.elem("div", "b-profile-header", "<div id='js-clipBoard' style='display:none;'>"+s.l.clip+"</div>"),
		profileError_div = sf.elem("div", "b-profile-error");
		if (s.v.battles !== s.r.battles) {
			profileError_div.classList.add("b-display-table");
			profileError_div.textContent = sc.loc[68];
		}
		else {
			s.l.veh = " ";
		}
		profileName_class.lastElementChild.innerHTML += " - "+sf.format(s.r.days,2,0)+" "+sc.loc[3];
		profileName_class.parentNode.insertBefore(profile_div, profileName_class.nextSibling);
		profileHead_div.appendChild(profileError_div);
		fragment.appendChild(profileHead_div);

		// add client language as a flag
		profileName_header.appendChild(sf.elem("img", "i-profile-flag", "", {src:"https://bytebucket.org/seriych/worldoftanksforumextendedstat.user.js/raw/tip/data/img/lang/"+sc.stats.u.client_language+".png"}));
		// add style if on own profile and has premium
		if (wg.own && s.p.prem) {
			var profileName_tooltip = d.getElementById('js-profile-name_tooltip');
			profileName_header.classList.add("b-account-type__premium");
			profileName_tooltip.firstElementChild.textContent += " - "+s.p.prem[0]+" "+s.p.prem[1];
		}

		// player statistic links
		var profileStat_table = sf.elem("table", "t-profile-table"),
		profileStat_table_cells = [
			[
				[sc.loc[4]],
				[sc.srv.wl, "<a target='_blank' href='http://wotlabs.net/"+sc.srv.wl+"/player/"+wg.name+"'>WoTLabs</a>"],
				[sc.srv.nm, "<a target='_blank' href='http://noobmeter.com/player/"+sc.srv.nm+"/"+wg.name+"/"+wg.id+"'>Noobmeter</a>"],
				[sc.srv.ct, "<a target='_blank' href='http://clantools.us/servers/"+sc.srv.ct+"/players?id="+wg.id+"'>Clan Tools</a>"]
			],
			[
				[""],
				[sc.srv.ws, "<a target='_blank' href='http://wotstats.org/stats/"+sc.srv.ws+"/"+wg.name+"/'>WoTstats</a>"],
				[sc.srv.vb, "<a target='_blank' href='http://www.vbaddict.net/player/"+wg.name.toLowerCase()+"-"+sc.srv.vb+"'>vBAddict</a>"],
				(wg.srv=="ru") ? [sc.srv.kttc, "<a target='_blank' href='http://kttc.ru/statistics/user/"+wg.name+"/'>KTTC</a>"] : [sc.srv.wlf, "<a target='_blank' href='http://wot-life.com/"+sc.srv.wlf+"/player/"+wg.name+"/'>WoT-Life</a>"]
			],
			[
				[sc.loc[5]],
				[sc.srv.wl, "<a target='_blank' href='http://wotlabs.net/sig/"+sc.srv.wl+"/"+wg.name+"/signature.png'>"+sc.loc[6]+"</a>"],
				[sc.srv.wl, "<a target='_blank' href='http://wotlabs.net/sig_dark/"+sc.srv.wl+"/"+wg.name+"/signature.png'>"+sc.loc[7]+"</a>"]
			],
			[
				[sc.loc[8]],
				[sc.srv.wr, "<a target='_blank' href='http://wotreplays."+sc.srv.wr+"/player/"+wg.name+"'>WoTReplays</a>"],
				[sc.srv.we, sc.loc[80]],
				[sc.srv.we, "<a target='_blank' href='http://wotevent.guildity.com/players/"+wg.name+"/'>WoT Event Stats</a>"]
			]
		];
		sf.links(profileStat_table, profileStat_table_cells, "table");
		profileName_class.appendChild(profileStat_table);

		// clan handler
		var clanBlock = d.getElementById('js-clan-block-container'),
		cl_class = clanBlock.getElementsByTagName('a')[1],
		clanStat_table = sf.elem("table", "", "", {id: "js-profile-clan-table"}),
		clanLook = new MutationObserver(function() {
			cl_class = clanBlock.getElementsByTagName('a')[1];
			sf.clan();
			clanLook.disconnect();
		});
		// apply changes if and when clanBlock is modified
		if(cl_class) {
			sf.clan();
		}
		else {
			clanLook.observe(clanBlock, {childList: true});
		}

		// move player and clan blocks together
		var infoBlock_div = sf.elem("div", "b-info-block");
		infoBlock_div.appendChild(profileName_class);
		infoBlock_div.appendChild(clanBlock);
		fragment.appendChild(infoBlock_div);

		// player clan history
		var clanHist_div = sf.elem("div", "b-clanHistory-wrpr", "<span class='clanname'>"+sc.loc[73]+"</span><span>"+sc.loc[15]+"</span>");
		fragment.appendChild(clanHist_div);
		// clan history retrieval
		sf.request("historyData", sc.api.ch, sf.ch.hnd, sf.ch.error);

		// move fame points block, if it exists
		var fameClass = d.getElementById('js-knockout-fame-points'),
		fameMessage = d.getElementsByClassName('b-fame-message')[0];
		if (fameClass) {
			if (fameMessage.id == "js-fame-message-error") {
				fameClass.appendChild(fameMessage);
			}
			var fameHeader = d.getElementsByClassName('b-header-h3__user-account')[0],
			fameIndicator = d.getElementsByClassName('b-fame-indicators')[0],
			fameTime = d.getElementsByClassName('b-time')[0],
			fameLinkList = d.getElementsByClassName('b-link-list')[0];
			fameClass.insertBefore(fameHeader, fameClass.firstElementChild);
			fameLinkList.appendChild(sf.elem("li", "b-link-list_item"));
			fameLinkList.lastElementChild.appendChild(fameTime);
			fameIndicator.dataset.bind = "";
			fameIndicator.classList.add("b-fame-indicators__one-country");
			fragment.appendChild(fameClass);
		}
		else if (fameMessage) {
			var fameDiv = fameMessage.parentNode;
			fameDiv.id = "js-knockout-fame-points";
			fameDiv.className = "b-fame-points-empty";
			fragment.appendChild(fameDiv);
			userBlock_sparks.classList.add("b-user-block_sparks-radius");
		}
		else {
			userBlock_sparks.classList.add("b-user-block_sparks-radius");
		}

		// move marathon block, if it exists
		var marathonClass = d.getElementsByClassName('b-marathon')[0];
		if (marathonClass) {
			userBlock_wprp.appendChild(marathonClass);
		}

		// move sidebar
		fragment.appendChild(sidebar_class);
		profile_div.appendChild(fragment);
		// end profile wrapper

		// add background
		var background_div = sf.elem("div", "b-background", "<img src='"+css.l[5]+"'>");
		background_div.style.background = s.h.wn8;
		userBlock_sparks.insertBefore(background_div, userBlock_sparks.firstChild);

		// add hidden holders for banned and last battle messages
		var banInfo_div = sf.elem("div", "b-message-ban-holder", "<div class='b-message-error'><span>"+sc.loc[82]+" <span id='js-banInfo'>"+(new Date(sc.stats.u.ban_time*1000).toLocaleString(sc.date.format[wg.srv]))+"</span>.</span></div>"),
		lastBattle_div = sf.elem("div", "b-message-battle-holder", "<div class='b-message-battle b-message-info'><span>"+sc.loc[83]+" <span id='js-lastBattle'>"+(new Date(sc.stats.u.last_battle_time*1000).toLocaleString(sc.date.format[wg.srv]))+"</span>.</span></div>");
		userBlock_sparks.insertBefore(lastBattle_div, userBlock_sparks.firstChild.nextSibling);
		if (sc.stats.u.ban_time) {
			userBlock_sparks.insertBefore(banInfo_div, userBlock_sparks.firstChild.nextSibling);
		}

		// personal data - modify table - add ratings
		var persDataTable = d.getElementsByClassName('t-personal-data')[0];
		persDataTable.rows[0].cells[0].textContent = sc.loc[9]; // winrate
		persDataTable.rows[1].cells[0].innerHTML = s.l.winsR;
		persDataTable.rows[0].cells[1].textContent = sc.loc[10]; // battles
		persDataTable.rows[1].cells[1].innerHTML = s.l.batsC;
		persDataTable.rows[0].cells[1].parentNode.insertBefore(sf.elem("th", "t-personal-data_ico t-personal-data_ico__exp", sc.loc[11]), persDataTable.rows[0].cells[1].nextSibling); // xp
		persDataTable.rows[1].cells[1].parentNode.insertBefore(sf.elem("td", "t-personal-data_value", sf.format(s.r.battle_avg_xp,2)), persDataTable.rows[1].cells[1].nextSibling);
		persDataTable.rows[0].cells[4].textContent = sc.loc[69]; // hitrate
		persDataTable.rows[1].cells[3].innerHTML = s.l.hitsR;
		persDataTable.rows[0].cells[4].className = "t-personal-data_ico t-personal-data_ico__hitrate";
		persDataTable.rows[0].cells[5].textContent = sc.loc[70]; // damage
		persDataTable.rows[1].cells[4].innerHTML = s.l.dmgTier;
		persDataTable.rows[0].appendChild(sf.elem("th", "t-personal-data_ico t-personal-data_ico__tier", sc.loc[12])); // avg tier
		persDataTable.rows[1].appendChild(sf.elem("td", "t-personal-data_value", sf.format(s.a.tier,2,2)));
		persDataTable.appendChild(sf.elem("tbody", "t-ratings-info", "<tr><th colspan='2'><a href='http://www.wnefficiency.net/wnexpected/' target='_blank'>"+sc.loc[27]+" v"+sc.wn.v.wn8+"</a></th><th><a href='http://jaj22.org.uk/expvals.html' target='_blank'>"+sc.loc[26]+" v"+sc.wn.v.wn9+"</a></th><th></th><th>"+sc.loc[28]+"</th><th colspan='2'>"+sc.loc[29]+"</th></tr><tr><td colspan='2'>"+s.f.wn8.ratCol+"</td><td>"+s.f.wn9.ratCol+"</td><td></td><td>"+s.f.wn7.ratCol+"</td><td colspan='2'>"+s.f.eff.ratCol+"</td></tr>"));
		persDataTable.getElementsByClassName('t-personal-data_value__pr')[0].innerHTML = s.f.wgr.ratCol;

		// speedometer - win/loss ratio
		var smBody_class = d.getElementsByClassName('b-speedometer-body')[0],
		smWinWeight = (isFinite(s.r.winLR)) ? s.r.winLR : 1,
		smWinArrow = (isFinite(s.r.winLR)) ? Math.min(30*(s.r.winLR-1),31) : 0;
		smBody_class.appendChild(sf.elem("div", "b-speedometer", "<div class='b-speedometer_scale'></div><div class='b-speedometer-arrow' data-deg='"+smWinArrow+"' style='transform: rotate("+smWinArrow+"deg); -webkit-transform: rotate("+smWinArrow+"deg); -ms-transform: rotate("+smWinArrow+"deg);'></div><div class='b-speedometer-round'></div><p class='b-speedometer-title'>"+sc.loc[13]+"</p><p class='b-speedometer-weight'>"+sf.format(smWinWeight,2,2)+"</p><p class='b-speedometer-ratio'>"+sf.format(s.r.wins,2)+" / "+sf.format(s.r.losses,2)+"</p>"));

		// performance ratings calculations table
		var ratingsTable_div = sf.elem("div", "ratings-table", "<h3>"+sc.loc[16]+"</h3>"),
		ratingsTable = sf.elem("table", "t-table-ratings"),
		ratingsFragment = d.createDocumentFragment(),
		ratingsArr = [
			["", "", sc.loc[17], sc.loc[18], sc.loc[19], sc.loc[20], sc.loc[21], sc.loc[22], sc.loc[23], sc.loc[24], sc.loc[25]],
			["wn9", s.f.wn8.pct, sc.loc[26], s.f.wn9.ratCol, "–", "–", "–", "–", "–", "–", "–"],
			["wn8", s.f.wn8.pct, sc.loc[27], s.f.wn8.ratCol, s.f.wn8.scaleCol, sf.format(s.f.wn8.frag,2,2), sf.format(s.f.wn8.dmg,2,2), sf.format(s.f.wn8.spot,2,2), "–", sf.format(s.f.wn8.def,2,2), sf.format(s.f.wn8.win,2,2)],
			["wn7", s.f.wn7.pct, sc.loc[28], s.f.wn7.ratCol, s.f.wn7.scaleCol, sf.format(s.f.wn7.frag,2,2), sf.format(s.f.wn7.dmg,2,2), sf.format(s.f.wn7.spot,2,2), "–", sf.format(s.f.wn7.def,2,2), sf.format(s.f.wn7.win,2,2)],
			["eff", s.f.eff.pct, sc.loc[29], s.f.eff.ratCol, s.f.eff.scaleCol, sf.format(s.f.eff.frag,2,2), sf.format(s.f.eff.dmg,2,2), sf.format(s.f.eff.spot,2,2), sf.format(s.f.eff.cap,2,2), sf.format(s.f.eff.def,2,2), "–"]
		];
		for (var _r=0, _r_len = ratingsArr.length; _r<_r_len; ++_r) {
			var ratingsRow = sf.elem("tr");
			ratingsFragment.appendChild(ratingsRow);
			for (var _rc=2, _rc_len = ratingsArr[_r].length; _rc<_rc_len; ++_rc) {
				ratingsRow.appendChild(sf.elem("td", "td-center", ratingsArr[_r][_rc]));
			}
			if (_r !== 0) {
				ratingsFragment.appendChild(sf.elem("tr", "td-rating-meter", "<td colspan='9'><div class='rating-meter rating-meter_"+ratingsArr[_r][0]+"'><div class='rating-meter-dail_line' style='width:"+ratingsArr[_r][1]+"%;'><div class='rating-meter-marker'></div></div></div></td>"));
			}
			ratingsTable.appendChild(ratingsFragment);
		}
		ratingsTable_div.appendChild(ratingsTable);
		fragment.appendChild(ratingsTable_div);
		// link to WN thread
		fragment.appendChild(sf.elem("div", "wnelink", "<a class ='b-orange-arrow wnelink_info' target='_blank' href='http://wiki.wnefficiency.net/pages/WN8:_Summary'>"+sc.loc[31]+"</a>"));
		userBlock_sparks.appendChild(fragment);
		// end user block

		// statistics wrapper
		var statistics_wrpr = d.getElementsByClassName('b-result-classes')[0].parentNode;
		statistics_wrpr.className = "b-statistics-wrpr";
		while (statistics_wrpr.firstChild) {
			statistics_wrpr.removeChild(statistics_wrpr.firstChild);
		}
		userBlock_wprp.parentNode.insertBefore(statistics_wrpr, userBlock_wprp.nextSibling);

		// stat tabs framework and content
		var statTabs = sf.elem("div", "l-tabs l-tabs__top-indent", "<ul class='b-tabs-list'></ul><div class='b-fame-indicators b-fame-indicators__no-margin b-fame-indicators__one-country'><div class='b-tabs'></div><div class='b-stat-legend'>"+sc.loc[115]+"</br>"+sc.loc[116]+"</div></div>"),
		statFragment = d.createDocumentFragment(),
		statTabsMenu = statTabs.firstElementChild,
		statTabsParent = statTabs.lastElementChild.firstElementChild,
		statTabsMenuItems = [
			["user", sc.loc[99]],
			["more", sc.loc[100]],
			["clan", sc.loc[101]],
			["strong", sc.loc[105]],
			["team", sc.loc[108]],
			["other", sc.loc[110]]
		],
		statTabUser = sf.elem("div", "b-tab-user js-stat_active"),
		statTabMore = sf.elem("div", "b-tab-more"),
		statTables = [
			[
				[
					[sc.loc[38], s.l.veh, sf.format(s.r.battles,2)],
					[sc.loc[39], s.l.winsR, sf.format(s.r.wins,2)],
					[sc.loc[40], s.l.lossR, sf.format(s.r.losses,2)],
					[sc.loc[41], s.l.drawR, sf.format(s.r.draws,2)],
					[sc.loc[42], s.l.survR, sf.format(s.r.survived_battles,2)],
					[sc.loc[48], sf.color(s.a.deaths*100, "", 2, "%"), sf.format(s.r.deaths,2)],
					[sc.loc[43], "", sf.format(s.a.bats,2,2)],
					[sc.loc[44], sf.format(s.r.battle_avg_xp,2), sf.format(s.r.xp,2)],
					[sc.loc[98], "", sf.format(s.r.tanking_factor,2,2)]
				],
				[
					[sc.loc[47], sf.format(s.a.frag,2,2), sf.format(s.r.frags,2)],
					[sc.loc[49], sf.format(s.a.spot,2,2), sf.format(s.r.spotted,2)],
					[sc.loc[51], s.l.dmgTier, sf.format(s.r.damage_dealt,2)],
					[sc.loc[52], sf.format(s.a.dmgR,2,0), sf.format(s.r.damage_received,2)],
					[sc.loc[53], sf.format(s.a.caps,2,2), sf.format(s.r.capture_points,2)],
					[sc.loc[54], sf.format(s.a.defs,2,2), sf.format(s.r.dropped_capture_points,2)],
					[sc.loc[50], sf.color(s.r.hits/s.r.shots*100, "hr", 2, "%"), sf.format(s.r.hits,2)],
					[sc.loc[114], sf.color(s.r.piercings/s.r.hits*100, "", 2, "%"), sf.format(s.r.piercings,2)],
					[sc.loc[97], sf.format(s.a.cuts,2,2), sf.format(s.r.cuts,2)]
				],
				[
					["<img src='"+css.l[6]+"'>", sc.loc[32], s.b[4].c+"<span>("+sf.format(s.b[4].p,2,0)+"%)</span>"],
					["<img src='"+css.l[7]+"'>", sc.loc[33], s.b[3].c+"<span>("+sf.format(s.b[3].p,2,0)+"%)</span>"],
					["<img src='"+css.l[8]+"'>", sc.loc[34], s.b[2].c+"<span>("+sf.format(s.b[2].p,2,0)+"%)</span>"],
					["<img src='"+css.l[9]+"'>", sc.loc[35], s.b[1].c+"<span>("+sf.format(s.b[1].p,2,0)+"%)</span>"],
					["<img src='"+css.u.bad1+"'>", sc.loc[36], s.b[0].c+"<span>("+sf.format(s.b[0].p,2,0)+"%)</span>"],
					["<img src='"+css.u.bad2+"'>", sc.loc[37], s.b[5].c+"<span>("+sf.format(s.b[5].p,2,0)+"%)</span>"]
				],
				[
					["<img src='"+css.u.marks3+"'>", sc.loc[150], s.m[3].c+"<span>("+sf.format(s.m[3].p,2,0)+"%)</span>"],
					["<img src='"+css.u.marks2+"'>", sc.loc[151], s.m[2].c+"<span>("+sf.format(s.m[2].p,2,0)+"%)</span>"],
					["<img src='"+css.u.marks1+"'>", sc.loc[152], s.m[1].c+"<span>("+sf.format(s.m[1].p,2,0)+"%)</span>"],
					["", sc.loc[153], s.m[0].c+"<span>("+sf.format(s.m[0].p,2,0)+"%)</span>"],
					["<img src='"+css.u.marks3+"'>", sc.loc[154], s.m[4].c+"<span>("+sf.format(s.m[4].p,2,0)+"%)</span>"]
				],
				[
					["overall", sc.loc[148]],
					["battle", sc.loc[149]],
					["badges", sc.loc[131]],
					["marks", sc.loc[146]]
				]
			],
			[
				[
					[sc.loc[86], ((sc.pedia[s.r.max_damage_tank_id]) ? sc.pedia[s.r.max_damage_tank_id].name : sc.vehBackup[s.r.max_damage_tank_id][0]), sf.format(s.r.max_damage,2)],
					[sc.loc[87], ((sc.pedia[s.r.max_frags_tank_id]) ? sc.pedia[s.r.max_frags_tank_id].name : sc.vehBackup[s.r.max_frags_tank_id][0]), sf.format(s.r.max_frags,2)],
					[sc.loc[88], ((sc.pedia[s.r.max_xp_tank_id]) ? sc.pedia[s.r.max_xp_tank_id].name : sc.vehBackup[s.r.max_xp_tank_id][0]), sf.format(s.r.max_xp,2)],
					[sc.loc[89], sf.format(s.a.dmgA,2), sf.format(s.r.dmgA,2)],
					[sc.loc[90], sf.format(s.a.dmgAR,2), sf.format(s.r.dmgAR,2)],
					[sc.loc[91], sf.format(s.a.dmgAT,2), sf.format(s.r.dmgAT,2)]
				],
				[
					[sc.loc[92], sf.color(100, "", 2, "%"), sf.format(s.r.direct_hits_received,2)],
					[sc.loc[93], sf.color(s.a.recPens, "", 2, "%"), sf.format(s.r.piercings_received,2)],
					[sc.loc[94], sf.color(s.a.recNo, "", 2, "%"), sf.format(s.r.no_damage_direct_hits_received,2)],
					[sc.loc[95], sf.color(s.a.recExp, "", 2, "%"), sf.format(s.r.explosion_hits_received,2)],
					[sc.loc[96], sf.format(s.a.dmgB,2), sf.format(s.r.dmgB,2)],
					[sc.loc[98], "", sf.format(s.r.tanking_factor,2,2)]
				],
				[
					sc.loc[84],
					sc.loc[85]
				]
			],
			[
				[
					["globalmap_absolute", sc.loc[104]],
					["globalmap_champion", sc.loc[103]],
					["globalmap_middle", sc.loc[102]]
				],
				[
					["stronghold_skirmish", sc.loc[106]],
					["stronghold_defense", sc.loc[107]]
				],
				[
					["team", sc.loc[108]],
					["regular_team", sc.loc[109]]
				],
				[
					["fallout", sc.loc[111]],
					["historical", sc.loc[112]],
					["company", sc.loc[113]]
				],
				[
					"clan",
					"strong",
					"team",
					"other"
				]
			]
		];
		// create the menu
		for (var _tm=0, _tm_len = statTabsMenuItems.length; _tm<_tm_len; ++_tm) {
			var tabMenuItem = sf.elem("li", "b-tabs-list_item b-tabs-list_"+statTabsMenuItems[_tm][0], "<a class='b-tabs-list_link' href='#' onClick='return false;'>"+statTabsMenuItems[_tm][1]+"</a>");
			tabMenuItem.dataset.ref = "b-tab-"+statTabsMenuItems[_tm][0];
			if (statTabsMenuItems[_tm][0] == "user") {
				tabMenuItem.classList.add("js-tabs__active");
			}
			tabMenuItem.addEventListener('click', sf.tabs, false);
			statFragment.appendChild(tabMenuItem);
		}
		statTabsMenu.appendChild(statFragment);
		// add new values for the official tables and extended tables
		for (var _s=0, _s_len = statTables.length; _s<(_s_len-1); ++_s) {
			for (var _st=0, _st_len = statTables[_s].length; _st<(_st_len-1); ++_st) {
				var newTable = sf.elem("div", "b-result", "<h3></h3><table class='t-dotted t-dotted__fixed'></table>");
				for (var _sr=0, _sr_len = statTables[_s][_st].length; _sr<_sr_len; ++_sr) {
					statFragment.appendChild(sf.elem("tr", "", "<td class='"+((_st >= 2) ? 't-dotted_class-ico t-dotted_minor__middle' : 't-dotted_minor')+"'>"+statTables[_s][_st][_sr][0]+"</td><td class='"+((_st >= 2) ? 't-dotted_minor t-dotted_minor__middle' : 't-dotted_value')+"'>"+statTables[_s][_st][_sr][1]+"</td><td class='"+((_st >= 2) ? 't-dotted_value t-dotted_minor__middle' : 't-dotted_value')+"'>"+statTables[_s][_st][_sr][2]+"</td>"));
				}
				newTable.lastElementChild.appendChild(statFragment);
				switch(_s) {
					case (0):
						newTable.classList.add("b-result-"+statTables[0][4][_st][0]);
						newTable.firstElementChild.innerHTML = statTables[0][4][_st][1];
						statTabUser.appendChild(newTable);
						break;
					case (1):
						newTable.classList.add("b-result-"+statTabsMenuItems[1][0]);
						newTable.firstElementChild.innerHTML = statTables[1][2][_st];
						statTabMore.appendChild(newTable);
						break;
					default:
						break;
				}
			}
		}
		fragment.appendChild(statTabUser);
		fragment.appendChild(statTabMore);
		// add new tables with stats from relevant gamemodes
		for (var _mt=0, _mt_len = statTables[2].length; _mt<(_mt_len-1); ++_mt) {
			var newModeTab = sf.elem("div", "b-tab-"+statTables[2][4][_mt]);
			for (var _gm=0, _gm_len = statTables[2][_mt].length; _gm<_gm_len; ++_gm) {
				var modeStats = userStats[statTables[2][_mt][_gm][0]],
				modeStatsArr = [
					[sc.loc[38], "", sf.format(modeStats.battles,2)],
					[sc.loc[39], sf.color(modeStats.wins/modeStats.battles*100, "wr", 2, "%"), sf.format(modeStats.wins,2)],
					[sc.loc[40], sf.color(modeStats.losses/modeStats.battles*100, "lr", 2, "%"), sf.format(modeStats.losses,2)],
					[sc.loc[41], sf.color(modeStats.draws/modeStats.battles*100, "", 2, "%"), sf.format(modeStats.draws,2)],
					[sc.loc[42], sf.color(modeStats.survived_battles/modeStats.battles*100, "sr", 2, "%"), sf.format(modeStats.survived_battles,2)],
					[sc.loc[44], sf.format(modeStats.xp/modeStats.battles,2), sf.format(modeStats.xp,2)],
					[sc.loc[51], sf.format(modeStats.damage_dealt/modeStats.battles,2), sf.format(modeStats.damage_dealt,2)],
					[sc.loc[98], "", sf.format(modeStats.tanking_factor,2,2)],
					[sc.loc[50], "", sf.color(modeStats.hits/modeStats.shots*100, "hr", 2, "%")]
				],
				newTableMode = sf.elem("div", "b-result", "<h3>"+statTables[2][_mt][_gm][1]+"</h3><table class='t-dotted t-dotted__fixed'></table>");
				for (var _ms=0, _ms_len = modeStatsArr.length; _ms<_ms_len; ++_ms) {
					statFragment.appendChild(sf.elem("tr", "", "<td class='t-dotted_minor'>"+modeStatsArr[_ms][0]+"</td><td class='t-dotted_value'>"+modeStatsArr[_ms][1]+"</td><td class='t-dotted_value'>"+modeStatsArr[_ms][2]+"</td>"));
				}
				newTableMode.lastElementChild.appendChild(statFragment);
				newModeTab.appendChild(newTableMode);
			}
			fragment.appendChild(newModeTab);
		}
		statTabsParent.appendChild(fragment);
		statistics_wrpr.appendChild(statTabs);
		// end statistics wrapper

		// cake diagrams - adding tier diagram - delayed insertion
		var diagSector_class = d.getElementsByClassName('b-diagrams-sector')[0],
		diagSector_id = d.getElementById('diagrams-sector'),
		diagLook = new MutationObserver(function() {
			sf.cake();
		});
		if (diagSector_id.firstElementChild.childElementCount) {
			sf.cake();
		}
		else {
			diagLook.observe(diagSector_id, {childList: true});
		}

		// achievements wrapper and fix special medals margin
		var medalWrpr_class = d.getElementsByClassName('js-all-achievements')[0],
		medalHeader_class = d.getElementsByClassName('js-achievements-header')[0],
		medalSpecial_class = d.getElementsByClassName('b-achivements')[7],
		medalLook = new MutationObserver(function() {
			medalSpecial_class = d.getElementsByClassName('b-achivements')[7];
			if (medalSpecial_class) {
				sf.medals();
			}
		});
		if (medalSpecial_class) {
			sf.medals();
		}
		else {
			medalLook.observe(medalWrpr_class.children[3], {childList: true});
		}
		medalHeader_class.parentNode.insertBefore(medalWrpr_class.lastElementChild, medalHeader_class.nextSibling);
		diagSector_class.parentNode.insertBefore(medalWrpr_class, diagSector_class.nextSibling);
		diagSector_class.parentNode.insertBefore(layoutfix_class[0], diagSector_class.nextSibling);

		// vehicles wrapper
		var vehTable_class = d.getElementsByClassName('t-profile__vehicle')[0],
		vehicles_div = sf.elem("div", "b-vehicles-wrpr"),
		vehiclesHeader_class = vehTable_class.previousElementSibling.previousElementSibling,
		vehiclesHeader_div = sf.elem("div", "b-vehicles-header", "<a class='b-orange-arrow b-profile-ratings_link' target='_blank' href='/encyclopedia/vehicles/'>"+sc.loc[59]+"</a><span class='b-profile-vehicles-tankstat'><a class='b-orange-arrow b-profile-ratings_link b-profile-vehicles-tankstat_link' target='_blank' href='http://www.vbaddict.net/statistics.php?server="+((wg.srv == "ru") ? "net" : sc.srv.vb)+"'>vBAddict: "+sc.loc[60]+"</a></span>"),
		vehTable_table = sf.elem("table", "t-profile sortable", "<thead><tr><th width='275'><span class='t-profile_vehicle-head'>"+sc.loc[129]+"</span></th><th data-sort-method='number'><span class='t-profile_vehicle-head'>"+sc.loc[57]+"</span></th><th data-sort-method='number' data-sort-order='desc'><span class='t-profile_vehicle-head'>"+sc.loc[143]+"</span></th><th class='t-profile_center sort-default' data-sort-method='number'><span class='t-profile_vehicle-head'>"+sc.loc[130]+"</span></th><th class='t-profile_center'><span class='t-profile_vehicle-head'>"+sc.loc[25]+"</span></th><th class='t-profile_center' data-sort-method='number'><span class='t-profile_vehicle-head'>"+sc.loc[27]+"</span></th><th class='t-profile_center' data-sort-method='number'><span class='t-profile_vehicle-head'>"+sc.loc[26]+"</span></th><th class='t-profile_center' data-sort-method='number'><span class='t-profile_vehicle-head'>"+sc.loc[44]+"</span></th><th class='t-profile_center' data-sort-method='number'><span class='t-profile_vehicle-head'>"+sc.loc[21]+"</span></th><th class='t-profile_center'><span class='t-profile_vehicle-head'>"+sc.loc[131]+"</span></th><th class='t-profile_center'><span class='t-profile_vehicle-head'>"+sc.loc[146]+"</span></th></tr></thead>"),
		vehTypes = [
			["lightTank", sc.loc[124]],
			["mediumTank", sc.loc[125]],
			["heavyTank", sc.loc[126]],
			["AT-SPG", sc.loc[127]],
			["SPG", sc.loc[128]],
			["prem", sc.loc[61]],
			["ten", sc.loc[67]],
			["super", sc.loc[123]],
			["zero", sc.loc[145]],
			["miss", sc.loc[77]]
		],
		vehTiers = ["I","II","III","IV","V","VI","VII","VIII","IX","X"],
		vehNations = {"ussr": 1, "germany": 2, "usa": 3, "france": 4, "uk": 5, "china": 6, "japan": 7, "czech": 8, "sweden": 9, "poland": 10},
		masteryIcons = ["none","3","2","1","ace"],
		marksIcons = ["none", "marks1", "marks2", "marks3"];
		vehiclesHeader_class.className = "b-profile-ratings_title";
		vehiclesHeader_div.insertBefore(vehiclesHeader_class, vehiclesHeader_div.firstChild);
		vehTable_class.parentNode.insertBefore(vehicles_div, vehTable_class);
		fragment.appendChild(vehiclesHeader_div);
		fragment.appendChild(vehTable_table);
		vehicles_div.appendChild(fragment);
		for (var _vt=0, _vt_len = vehTypes.length; _vt<_vt_len; ++_vt) {
			var vehicleGroup = vehTypes[_vt][0],
			vehicleSubs = s.s[vehicleGroup].r;
			if (vehicleSubs.length === 0 || (vehicleGroup == "miss" && !sc.debug)) {
				continue;
			}
			else {
				var vehicleFragment = d.createDocumentFragment(),
				vehicleCategoryHead = sf.elem("tbody", "", "<tr class='t-profile_tankstype no-sort'><td class='t-profile_head' colspan='3'><span class='b-tankstype-ico b-tankstype-ico__"+vehTypes[_vt][0].toLowerCase()+"'></span><span class='b-tankstype-text'><span>"+vehTypes[_vt][1]+"</span><span class='b-armory-col'>"+vehicleSubs.length+"</span></span></td><td class='b-display-none'></td><td class='b-display-none'></td><td class='t-profile_center'>"+sf.format(s.s[vehicleGroup].bd,2)+"</td><td class='t-profile_center'>"+sf.color((s.s[vehicleGroup].w/s.s[vehicleGroup].bd)*100, "wr", 2, "%")+"</td><td class='t-profile_center'>"+sf.color(s.s[vehicleGroup].wn8,"wn8",2,"","f")+"</td><td class='t-profile_center'>"+sf.color(s.s[vehicleGroup].wn9,"wn9",2,"","f")+"</td><td class='t-profile_center'>&#9776;</td><td class='t-profile_center'>&#9776;</td><td class='t-profile_center'>"+s.s[vehicleGroup].bg+"</td><td class='t-profile_center'>"+s.s[vehicleGroup].m+"</td></tr>"),
				vehicleCategoryBody = sf.elem("tbody", "b-display-none");
				vehicleCategoryHead.addEventListener('click', function() {
					this.classList.toggle("t-tableClassHeader-open");
					this.nextElementSibling.classList.toggle("b-display-none");
				}, false);
				for (var _vr=0, _vr_len = vehicleSubs.length; _vr<_vr_len; ++_vr) {
					var vehStat = sc.stats.v[vehicleSubs[_vr]],
					vehRow = sf.elem("tr", "t-profile_tankstype t-profile_tankstype__item", "<td class='t-profile_armory-icon' colspan='3' data-sort='"+vehStat.name+"'><div class='b-armory-wrapper b-armory-wrapper__"+vehStat.nation+"'><span class='b-armory-level'>"+vehTiers[vehStat.tier-1]+"</span><img class='png' src='http://dav-static."+wg.host+"//ptlwot"+wg.img+"/wot/current/vehicle/"+vehStat.nation+"-"+vehStat.tag+".png' onerror='this.onerror=null;this.classList.add(\"imgError\");this.src=\"http://worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/static/4.2.5/wotp_static/img/tankopedia_new/frontend/scss/tankopedia-detail/img/tanks/default_image_resized.png\";'>"+((vehStat.test) ? "<img class='i-super_icon' src='"+css.u.testOverlay+"'>" : "")+"</div><span class='b-name-vehicle"+((vehStat.prem) ? " b-gold-name" : "")+"'><a target='_blank' href='http://worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/tankopedia/"+vehStat.tag+"'>"+vehStat.name+"<i class='link_icon'></i></a>"+((vehStat.miss[0]) ? "<span class='b-debug-name'>"+vehStat.miss[1]+"</span>" : "")+"</span></td><td class='b-display-none' data-sort='"+vehStat.tier+"'></td><td class='b-display-none' data-sort='"+vehNations[vehStat.nation]+"'></td><td class='t-profile_center' data-sort='"+vehStat.all.battles+"'>"+sf.format(vehStat.all.battles,2)+"</td><td class='t-profile_center' data-sort='"+vehStat.all.wins/vehStat.all.battles+"'>"+sf.color((vehStat.all.wins/vehStat.all.battles)*100, "wr", 2, "%")+"</td><td class='t-profile_center' data-sort='"+vehStat.wn8.rat+"'>"+sf.color(vehStat.wn8.rat,"wn8",2,"","f")+"</td><td class='t-profile_center' data-sort='"+vehStat.wn9.rat+"'>"+sf.color(vehStat.wn9.rat,"wn9",2,"","f")+"</td><td class='t-profile_center' data-sort='"+vehStat.all.battle_avg_xp+"'>"+sf.format(vehStat.all.battle_avg_xp,2)+"</td><td class='t-profile_center' data-sort='"+vehStat.all.damage_dealt/vehStat.all.battles+"'>"+sf.format(vehStat.all.damage_dealt/vehStat.all.battles,2)+"</td><td class='t-profile_ico-class' data-sort='"+vehStat.mark_of_mastery+"'>"+((vehStat.mark_of_mastery > 0) ? "<img src='//static-ptl-eu.gcdn.co/static/4.3.4/common/img/classes/class-"+masteryIcons[vehStat.mark_of_mastery]+".png'>" : "-")+"</td><td class='t-profile_center' data-sort='"+vehStat.marksOnGun+"'>"+((vehStat.marksOnGun > 0) ? "<img src='"+css.u[marksIcons[vehStat.marksOnGun]]+"'>" : "-")+"</td>",{id: vehStat.tank_id}),
					vehExtRow = sf.elem("tr", "t-profile_tanksextended b-display-none js_ext_"+vehTypes[_vt][0]+"_"+vehStat.tank_id, "<td class='t-profile_armory-icon' colspan='11' data-sort='"+vehStat.name+"_0'><div class='b-vehicle-stats'><div class='b-vehicle-stats_tables'><table class='t-dotted t-vehicle-stats' cellspacing='0' cellpadding='0'><tbody><tr><td>"+sc.loc[44]+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.xp/vehStat.all.battles,2)+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.xp,2)+"</td></tr><tr><td>"+sc.loc[20]+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.frags/vehStat.all.battles,2,2)+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.frags,2)+"</td></tr><tr><td>"+sc.loc[22]+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.spotted/vehStat.all.battles,2,2)+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.spotted,2)+"</td></tr><tr><td>"+sc.loc[21]+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.damage_dealt/vehStat.all.battles,2,2)+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.damage_dealt,2)+"</td></tr><tr><td>"+sc.loc[50]+"</td><td class='t-dotted_value'>"+sf.color(vehStat.all.hits/vehStat.all.shots*100, "hr", 2, "%")+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.hits,2)+"</td></tr><tr></tr></tbody></table><table class='t-dotted t-vehicle-stats' cellspacing='0' cellpadding='0'><tbody><tr><td>"+sc.loc[53]+"</td><td></td><td class='t-dotted_value'>"+sf.format(vehStat.all.capture_points/vehStat.all.battles,2,2)+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.capture_points,2)+"</td></tr><tr><td>"+sc.loc[54]+"</td><td></td><td class='t-dotted_value'>"+sf.format(vehStat.all.dropped_capture_points/vehStat.all.battles,2,2)+"</td><td class='t-dotted_value'>"+sf.format(vehStat.all.dropped_capture_points,2)+"</td></tr><tr><td>"+sc.loc[88]+"</td><td></td><td></td><td class='t-dotted_value'>"+sf.format(vehStat.max_xp,2)+"</td></tr><tr><td>"+sc.loc[87]+"</td><td></td><td></td><td class='t-dotted_value'>"+sf.format(vehStat.max_frags,2)+"</td></tr><tr><td>"+sc.loc[26]+"</td><td class='t-dotted_value'></td><td></td><td class='t-dotted_value'>"+sf.color(vehStat.wn9.rat,"wn9",2,"","f")+"</td></tr></tbody></table></div></div></td><td class='b-display-none'>"+vehStat.tier+".0</td><td class='b-display-none'>"+vehNations[vehStat.nation]+".0</td><td class='b-display-none'>"+vehStat.all.battles+".0</td><td class='b-display-none'>"+vehStat.all.wins/vehStat.all.battles+"0</td><td class='b-display-none'>"+vehStat.wn8.rat+"0</td><td class='b-display-none'>"+vehStat.wn9.rat+"0</td><td class='b-display-none'>"+vehStat.all.battle_avg_xp+".0</td><td class='b-display-none'>"+vehStat.all.damage_dealt/vehStat.all.battles+".0</td><td class='b-display-none'>"+vehStat.mark_of_mastery+".0</td><td class='b-display-none'>"+vehStat.marksOnGun+".0</td>");
					vehRow.dataset.extend = "js_ext_"+vehTypes[_vt][0]+"_"+vehStat.tank_id;
					vehRow.addEventListener('click', function(click) {
						if (!this.lastElementChild.contains(click.target)) {
							var panelChecker = d.getElementsByClassName(this.getAttribute('data-extend'))[0];
							panelChecker.classList.toggle("b-display-none");
						}
					}, false);
					vehicleFragment.appendChild(vehRow);
					vehicleFragment.appendChild(vehExtRow);
				}
				vehicleCategoryBody.appendChild(vehicleFragment);
				fragment.appendChild(vehicleCategoryHead);
				fragment.appendChild(vehicleCategoryBody);
			}
		}
		vehTable_table.appendChild(fragment);
		vehTable_class.parentNode.removeChild(vehTable_class);

		// activate tablesort function
		var sortTable = false;
		if (w.Tablesort) {
			// Numeric sort
			w.Tablesort.extend('number', function(item) {
				return item.match(/^-?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/); // Number
			}, function(a, b) {
				a = parseFloat(a);
				b = parseFloat(b);

				a = isNaN(a) ? 0 : a;
				b = isNaN(b) ? 0 : b;
				return a - b;
			});
			sortTable = new w.Tablesort(vehTable_table) ;
		}
		else {
			w.alert("Error activating tablesort, please refresh - if this shit continues, poke Orrie");
		}
	}
	else {
		// add a message informing that the script is disabled
		profileName_class.appendChild(sf.elem("div", "b-script-disabled", sc.loc[64]));
		styleText.push(
			".b-script-disabled {background-color: rgb(27, 27, 28); border: 1px solid rgba(255,255,255,0.04); border-bottom: none; border-radius: 15px 15px 0px 0px; box-shadow: 0px 0px 5px 4px rgba(0, 0, 0, 0.15) inset; color: #CD3333; line-height: 25px; margin: 10px 0 -15px 0px; text-align: center; width: 684px;}",
			".b-profile-clan {margin: 0;}",
			".content-wrapper__old p.b-statistic_item {margin: 0;}"
		);
		style.textContent = styleText.join("");
	} // end tableBattles
	}
	catch(error) {
		console.log(error.message+" at "+error.lineNumber, error);
	}
}(window));
