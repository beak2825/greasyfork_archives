// ==UserScript==
// @name TWLeoTools
// @namespace TomRobert
// @author Leotas (updated by Tom Robert)
// @description Useful tools for The West!
// @include https://*.the-west.*/game.php*
// @include https://*.the-west.*/index.php?page=logout
// @include https://www.the-west.*
// @include https://beta.the-west.net*
// @include http*://tw-db.info/*?strana=invent&x=*
// @exclude https://classic.the-west.net*
// @version 1.45.5
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/7238/TWLeoTools.user.js
// @updateURL https://update.greasyfork.org/scripts/7238/TWLeoTools.meta.js
// ==/UserScript==
// translation:Tom Robert(German&English),Darius II/Wojcieszy(Polish),pepe100(Spanish),ruud99(Dutch),Creature/krcsirke(Hungarian),Timemod Herkumo(Greek),Elly Siranno/Raymond Reddington(Portuguese),Billy-AR(Italian)
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn.toString() + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  if (location.href.includes('index.php?page=logout')) {
    location.href = '/';
  } else {
    LTstart = {
      version: '1.45.5',
      langs: {
        en: {
          language: 'English',
          ApiGui1: 'This script contains many features to simplify your everyday life in The West.<br><br>More Informations: ',
          ApiGui2: 'Open script page',
          FeatLogout: 'Add a logout button on the right side',
          FeatStatusbar: 'Remove the taskbar',
          FeatShowAP: 'Show your actual skill points in job windows',
          FeatChangeCity: 'Switch title and player name in the town hall',
          FeatDuellMap: 'Add Duelmap tab in duel window',
          FeatMarkDaily: 'Highlight daily login bonus on day 5 to not miss it',
          FeatMarketTown: 'Show town name in market window',
          FeatMarketMessage: 'Get a message when there are items or money to pick up on actual market',
          FeatAchievHide: 'Hide completed achievements in achievements window',
          FeatRecipeMarket: 'Improve the purchase of recipes on market',
          FeatMoveJobs: 'Move the queued jobs a bit to the left',
          FeatBlinkEvents: 'Stop the blinking of the event, County Fair buttons on the left side',
          FeatFortTracker: 'Turn off fort battle reminder',
          FeatFriendsPop: 'Hide "Friend online" pop-ups',
          FeatInstantQuest: 'Complete the quest instantly if all requirements are done',
          FeatQuestWiki: 'Add a link in the quest window to show the quest on the wiki page',
          FeatCityTravel: 'Show the travel time to the towns in the blackboard',
          FeatBetterSheriff: 'Add a new tab in the sheriff window to see all possible bounties',
          FeatChatProfessions: 'Show the crafting profession of the players in the chat list',
          FeatQuestBookSearch: 'Search for solved quests in the quest book',
          FeatMarketRights: 'Show if market offers are public or only for alliance/town members',
          FeatEquipManagerPlus: 'Improve the equipment manager in the inventory',
          FeatShortPopups: 'Make the item pop-ups shorter',
          FeatHideNotis: 'Add a button to hide the job notifications on the left side',
          FeatJobProducts: 'Show in the job pop-up how many products you already have in your inventory',
          FeatMapDistance: ' Show the number of miles next to the travel time',
          FeatTraderSell: 'Sell multiple items at once to the trader',
          FeatTouchControl: 'Enable touch control on your mobile browser',
          settings1: 'Open settings',
          settings2: 'Open settings and information window',
          ghosttown1: 'Go to ghost town ',
          ghosttown2: 'Open ghost town',
          ghosttown3: 'Open ghost town and center it on map',
          indiantown1: 'Go to Indian village ',
          indiantown2: 'Open Indian village',
          indiantown3: 'Open Indian village and center it on map',
          openmarket: 'Open market',
          forum: 'Open town forum',
          newsets: 'New sets are added to the script',
          chooseItems: 'Choose the items',
          remindHover: 'You get a notification when an item can be used again. Here you can choose these items.',
          remindReady: 'Ready to collect',
          skipHover: 'Skip the confirmation and result messages when you open some bags. Here you can choose these bags',
          skipDone: 'You get',
          info: 'Info',
          contact: 'Contact',
          chooseLang: 'Choose language',
          features: 'Features',
          name: 'Name',
          author: 'Author',
          version: 'Version',
          gameversion: 'Gameversions',
          website: 'Website',
          weblink: 'Weblink',
          save: 'Save',
          saveMessage: 'Settings saved. Some changes need a refresh of the game window.',
          setbonus2: 'Informations about the set bonuses',
          frame2: 'Helpful web pages',
          choose: 'Click on the hat to get started',
          items: 'items',
          parts: 'parts',
          showItems: 'Show the set items in your Bag',
          noItems: 'No items in your inventory found. Click again with CTRL to show it on TW-Calc.',
          ownSets: 'Only own sets',
          switchWeapon: 'Switch between firearm and melee weapon',
          selectBonus: 'Select bonuses',
          resetB: 'Reset',
          body: 'Clothing',
          right_arm: 'Weapons',
          animal: 'Horse & Yield',
          rest: 'Other',
          buff: 'Buffs',
          refresh: 'Refresh',
          noFriends: 'No Friends',
          reward: 'Reward',
          allprofessions: 'All Professions',
          market1: 'Items on market',
          market2: 'There are items/money on this market. What do you want to pick up?',
          all: 'All',
          onlyBids: 'Only bids',
          nothing: 'Nothing',
          worldwide: 'Worldwide',
          alliance: 'Alliance',
          town: 'Town',
          level: 'Level',
          duelLevel: 'Duelling level',
          exp: 'Exp',
          distance: 'Distance',
          startduel: 'Start Duel',
          centerMap: 'Center map',
          popup: 'The opponent\'s skill bonus',
          damage: 'Damage',
          duelmap: 'Duelmap',
          duelradius: 'Duel radius',
          minutes: 'minutes',
          hour: '1 hour',
          hours: 'hours',
          searchOpp: 'Search for opponents',
          amount: 'Dead',
          not_dead_amount: 'Alive',
          duellevel: 'Lvl',
          status: 'Status',
          sortBy: 'Sort by',
          tooLow: 'Too low duelling level of opponent',
          tooHigh: 'Too high duelling level of opponent',
          ownTown: 'Member of your town',
          attackable: 'Show only attackable players',
          logout: 'Logout',
          accNfin: 'Accept & complete quest',
          onWiki: 'Show the quest on the wiki',
          longerName: 'Name must be longer than 2 characters',
          loading: 'Loading...',
          rename: 'Rename',
          newName: 'Choose a new set name',
          used: 'Used',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Hide all job notifications',
          compInv: 'Click on "cancel" to just show only auctionable items\n or\nEnter other inventory URL to compare',
          loginAll1: 'Login all worlds',
          loginAll2: 'Load all your active worlds with one click',
          custom1: 'Custom',
          custom2: 'Your custom login list',
          edit: 'Edit',
          saveMessage2: 'Saved successfully',
        },
        de: {
          language: 'German (Deutsch)',
          ApiGui1: 'Das Script beinhaltet verschiedene Funktionen um den Alltag bei The West zu vereinfachen.<br><br>Weitere Informationen: ',
          ApiGui2: 'Skriptfenster öffnen',
          FeatLogout: 'Erstellt einen Logout-Button rechts in der Menüleiste',
          FeatStatusbar: 'Entfernt die Fensterleiste mit den verschiedenen Tabs im unteren Teil',
          FeatShowAP: 'Zeige die Arbeitspunkte im Job-Fenster',
          FeatChangeCity: 'Tausche Titel und Spielername in der Stadthalle',
          FeatDuellMap: 'Füge im Duellfenster einen Tab hinzu, der eine Duellkarte zeigt',
          FeatMarkDaily: 'Markiere Täglicher Loginbonus am Tag 5 besonders, um ihn nicht zu übersehen',
          FeatMarketTown: 'Zeige im Marktfenster, zu welcher Stadt es gehört',
          FeatMarketMessage: 'Wenn du an einem Markt stehst, wo etwas abgeholt werden kann, erscheint eine Meldung',
          FeatAchievHide: 'Verstecke alle abgeschlossenen Erfolge im Erfolgsfenster für eine bessere Übersicht',
          FeatRecipeMarket: 'Verbessert den Kauf von Rezepten im Markt',
          FeatMoveJobs: 'Verschiebe eingestellte Arbeiten ein wenig nach links',
          FeatBlinkEvents: 'Das Blinken der Event-, Wanderzirkus-Buttons usw. am linken Rand entfernen',
          FeatFortTracker: 'Fortkampftracker abschalten',
          FeatFriendsPop: '"Freund online" Pop-ups deaktivieren',
          FeatInstantQuest: 'Schliesse die Quest sofort ab, wenn die Voraussetzungen bereits erfüllt sind',
          FeatQuestWiki: 'Füge im Questfenster einen Link hinzu, der die Quest im Wiki zeigt',
          FeatCityTravel: 'Zeige die Reisezeit zu den Städten im Blackboard-Fenster',
          FeatBetterSheriff: 'Erweitere den Sheriff um einen Tab, welcher alle Kopfgelder auflistet',
          FeatChatProfessions: 'Zeige den Handwerksberuf der Spieler in der Chatliste',
          FeatQuestBookSearch: 'Suche im Questbuch nach abgeschlossenen Quests',
          FeatMarketRights: 'Zeige ob Marktangebote öffenltich oder nur für Allianz-/Stadtmitglieder sind',
          FeatEquipManagerPlus: 'Erweitere den Ausrüstungsmanager im Inventar',
          FeatShortPopups: 'Mache die Item-Popups kompakter',
          FeatHideNotis: 'Blende Arbeits-Benachrichtigungen am linken Rand mit einem Klick aus',
          FeatJobProducts: 'Zeige bei den Arbeiten, wie viele Produkte du bereits besitzt',
          FeatMapDistance: 'Zeige die Entfernung in Meilen neben der Reisezeit',
          FeatTraderSell: 'Ermöglicht dem Fahrenden Händler mehrere Gegenstände auf einmal zu verkaufen',
          FeatTouchControl: 'Aktiviere Touchsteuerung im mobilen Browser',
          settings1: 'Einstellungen öffnen',
          settings2: 'Öffnet das Informations- und Einstellungsfenster',
          ghosttown1: 'Gehe zur Geisterstadt ',
          ghosttown2: 'Öffne Geisterstadt',
          ghosttown3: 'Öffnet das Fenster der Geisterstadt und zentriert es auf der Map',
          indiantown1: 'Gehe zum Indianerdorf ',
          indiantown2: 'Öffne Indianerdorf',
          indiantown3: 'Öffnet das Fenster des Indianerdorfes und zentriert es auf der Map',
          openmarket: 'Öffne Marktfenster',
          forum: 'Öffne Stadtforum',
          newsets: 'Dem Script wurden neue Sets hinzugefügt',
          chooseItems: 'Wähle die Gegenstände aus',
          remindHover: 'Wenn die Gegenstände bereit zum Einsammeln sind, bekommst du einen Hinweis. Hier kannst du diese Items auswählen.',
          remindReady: 'Bereit zum Einsammeln',
          skipHover: 'Überspringe die Bestätigungs- und Resultatsmeldung beim Öffnen bestimmter Taschen. Hier kannst du diese Taschen auswählen.',
          skipDone: 'Du bekommst',
          info: 'Info',
          contact: 'Kontakt',
          chooseLang: 'Sprache auswählen',
          features: 'Features',
          name: 'Name',
          author: 'Autor',
          version: 'Version',
          gameversion: 'Gameversionen',
          website: 'Webseite',
          weblink: 'Link',
          save: 'Speichern',
          saveMessage: 'Einstellungen gespeichert. Manche Änderungen werden erst nach Neuladen des Spiels sichtbar.',
          setbonus2: 'Lass dir die Boni aller Sets anzeigen',
          frame2: 'Hilfreiche Webseiten',
          choose: 'Klicke auf den Hut und wähle aus',
          items: 'Gegenstände',
          parts: 'Teile',
          showItems: 'Zeige die Setgegenstände in deinem Inventar',
          noItems: 'Keine Gegenstände im Inventar gefunden. Klicke erneut mit CTRL um sie auf TW-Calc anzuzeigen.',
          ownSets: 'Nur eigene Sets',
          switchWeapon: 'Wähle Schuss- oder Schlagwaffe',
          selectBonus: 'Boni auswählen',
          resetB: 'Zurücksetzen',
          body: 'Kleidung',
          right_arm: 'Waffen',
          animal: 'Pferd & Produkt',
          rest: 'Andere',
          buff: 'Buffs',
          refresh: 'Aktualisieren',
          noFriends: 'Keine Freunde',
          reward: 'Belohnung',
          allprofessions: 'Alle Berufe',
          market1: 'Gegenstände auf dem Markt',
          market2: 'Es sind noch Gegenstände/Geld auf diesem Markt. Was soll abgeholt werden?',
          all: 'Alles',
          onlyBids: 'Nur Gebote',
          nothing: 'Nichts',
          worldwide: 'Weltweit',
          alliance: 'Allianz',
          town: 'Stadt',
          level: 'Stufe',
          duelLevel: 'Duellstufe',
          exp: 'EP',
          distance: 'Distanz',
          startduel: 'Starte Duell',
          centerMap: 'Zentriere Map',
          popup: 'Fertigkeitenbonus des Gegners',
          damage: 'Schaden',
          duelmap: 'Duellkarte',
          duelradius: 'Duellradius',
          minutes: 'Minuten',
          hour: '1 Stunde',
          hours: 'Stunden',
          searchOpp: 'Duellgegner suchen',
          amount: 'Tot',
          not_dead_amount: 'Lebendig',
          duellevel: 'Lvl',
          status: 'Status',
          sortBy: 'Sortiere nach',
          tooLow: 'Zu tiefe Duellstufe des Gegners',
          tooHigh: 'Zu hohe Duellstufe des Gegners',
          ownTown: 'Mitbürger deiner Stadt',
          attackable: 'Zeige nur duellierbare Spieler',
          logout: 'Logout',
          accNfin: 'Quest annehmen & abschließen',
          onWiki: 'Zeige die Quest im Wiki',
          longerName: 'Name muss länger als 2 Zeichen sein',
          loading: 'Lädt...',
          rename: 'Umbenennen',
          newName: 'Neuer Set-Name',
          used: 'Benutzt',
          renameWarning: 'Du ziehst das Set beim Umbenennen an und wieder aus.<br>Möglicherweise verlierst du deswegen Lebenspunkte!',
          sellItems: 'Items dem Händler verkaufen?',
          removeWorkNotis: 'Entferne die Arbeits-Benachrichtigungen',
          compInv: 'Klicke auf "Abbrechen, um nur auktionierbare Items anzuzeigen\n oder\nFüge andere Inventar-URL ein, um zu vergleichen',
          loginAll1: 'Alle einloggen',
          loginAll2: 'Lade all deine aktiven Welten mit einem Klick',
          custom1: 'Eigene',
          custom2: 'Deine eigene Login-Liste',
          edit: 'Bearbeiten',
          saveMessage2: 'Speichern erfolgreich',
        },
        pl: {
          language: 'Polish (polski)',
          ApiGui1: 'Skrypt ten zawiera wiele funkcji, aby uprościć codzienne życie na Zachodzie.<br><br>Więcej informacji: ',
          ApiGui2: 'Otwórz w nowej karcie',
          FeatLogout: 'Dodanie przycisku po prawej stronie, wyloguj się.',
          FeatStatusbar: 'Usuwa pasek z oknami w dolnej części gry.',
          FeatShowAP: 'Pokazuje Punkty Pracy (PP) w oknie danej pracy.',
          FeatChangeCity: 'Zamienia tytuł gracza na początku, w karcie graczy w ratuszu.',
          FeatDuellMap: 'Dodaje dodatkową zakładkę pojedynków, w pojedynkach.',
          FeatMarkDaily: 'Oznacza dodatkową ramką 5 dzień logowania.',
          FeatMarketTown: 'Dodaje nazwę miasta w karcie targu.',
          FeatMarketMessage: 'Jeżeli znajdujesz się w mieście gdzie coś jest do odebrania. Pojawia się komunikat.',
          FeatAchievHide: 'Ukrywa zaliczone osiągnięcia.',
          FeatRecipeMarket: 'Dodaje dodatkowe przyciski z receptami w karcie targ.',
          FeatMoveJobs: 'Przenieś zadania w kolejce trochę na lewo',
          FeatBlinkEvents: 'Zatrzymaj pulsowanie przycisków (zdarzenie, pomoce, ostrzeżenia itp) po lewej stronie',
          FeatFortTracker: 'Wyłącz przypomnienie o bitwie',
          FeatFriendsPop: 'Ukryj "Przyjaciel on-line" pop-ups',
          FeatInstantQuest: 'Wykonaj zadanie natychmiast, gdyby wszystkie wymagania zostały wykonane',
          FeatQuestWiki: 'Add a link in the quest window to show the quest on the wiki page',
          FeatCityTravel: 'Show the travel time to the towns in the blackboard',
          FeatBetterSheriff: 'Add a new tab in the sheriff window to see all possible bounties',
          FeatChatProfessions: 'Show the crafting profession of the players in the chat list',
          FeatQuestBookSearch: 'Search for solved quests in the quest book',
          FeatMarketRights: 'Show if market offers are public or only for alliance/town members',
          FeatEquipManagerPlus: 'Improve the equipment manager in the inventory',
          FeatShortPopups: 'Make the item pop-ups shorter',
          FeatHideNotis: 'Add a button to hide the job notifications on the left side',
          FeatJobProducts: 'Show in the job pop-up how many products you already have in your inventory',
          FeatMapDistance: ' Show the number of miles next to the travel time',
          FeatTraderSell: 'Sell multiple items at once to the trader',
          FeatTouchControl: 'Enable touch control for map and scrollbar on your mobile',
          settings1: 'Otwórz ustawienia',
          settings2: 'Otwiera okno ustawień oraz informacji o skrypcie.',
          ghosttown1: 'Idź do Miasta Widmo, dojście ',
          ghosttown2: 'Otwórz zadania w Mieście Widmo',
          ghosttown3: 'Otwiera okno z zadaniami w Mieście Widmo',
          indiantown1: 'Idź do Wioski Indiańskiej, dojście ',
          indiantown2: 'Otwórz zadania w Wiosce Indiańskiej',
          indiantown3: 'Otwiera okno z zadaniami w Wiosce Indiańskiej.',
          openmarket: 'Otwórz targ',
          forum: 'Otwórz forum',
          newsets: 'Nowe zestawy są dodawane do skryptu',
          chooseItems: 'Choose the items',
          remindHover: 'You get a notification when an item can be used again. Here you can choose these items.',
          remindReady: 'Ready to collect',
          skipHover: 'Skip the confirmation and result messages when you open some bags. Here you can choose these bags',
          skipDone: 'You get',
          info: 'Informacja',
          contact: 'Kontakt',
          chooseLang: 'Wybierz język',
          features: 'Ustawienia',
          name: 'Nazwa',
          author: 'Autor',
          version: 'Wersja',
          gameversion: 'Wersja gry',
          website: 'Strona',
          weblink: 'Dyskusja',
          save: 'Zapisz',
          saveMessage: 'Ustawienia zapisane. Niektóre zmiany potrzebują odświeżenia okna gry.',
          setbonus2: 'Informacje o ustawionych premie',
          frame2: 'Pomocna stron internetowych',
          choose: 'Kliknij na kapelusz i wybierz',
          items: 'przedmioty',
          parts: 'parts',
          showItems: 'Show the set items in your Bag',
          noItems: 'No items in your inventory found. Click again with CTRL to show it on TW-Calc.',
          ownSets: 'Only own sets',
          switchWeapon: 'Switch between firearm and melee weapon',
          selectBonus: 'Select bonuses',
          resetB: 'Reset',
          body: 'Clothing',
          right_arm: 'Weapons',
          animal: 'Horse & Yield',
          rest: 'Other',
          buff: 'Buffs',
          refresh: 'Odświeżać',
          noFriends: 'Brak przyjaciół',
          reward: 'Nagroda',
          allprofessions: 'Wszystko',
          market1: 'Przedmioty na targu',
          market2: 'Na tym targu znajdują się przedmioty/kasa, odebrać?',
          all: 'Wszystko',
          onlyBids: 'Tylko oferty',
          nothing: 'Nic',
          worldwide: 'Worldwide',
          alliance: 'Alliance',
          town: 'Miasto',
          level: 'Poziom',
          duelLevel: 'Poziom pojedynków',
          exp: 'Exp',
          distance: 'Odległość',
          startduel: 'Akcja',
          centerMap: 'Wyśrodkowanie',
          popup: 'Bonusy umiejętności przeciwnika',
          damage: 'Obrażenia',
          duelmap: 'Mapa pojedynków',
          duelradius: 'Zasięg',
          minutes: 'Minut',
          hour: '1 Godzina',
          hours: 'Godzin',
          searchOpp: 'Szukaj przeciwników',
          amount: 'Dead',
          not_dead_amount: 'Alive',
          duellevel: 'Lvl',
          status: 'Status',
          sortBy: 'Sort by',
          tooLow: 'Too low duelling level of opponent',
          tooHigh: 'Too high duelling level of opponent',
          ownTown: 'Member of your town',
          attackable: 'Show only attackable players',
          logout: 'Logout',
          accNfin: 'Przyjmij & zakończ zadanie',
          onWiki: 'Show the quest on the wiki',
          longerName: 'Name must be longer than 2 characters',
          loading: 'Loading...',
          rename: 'Rename',
          newName: 'Choose a new set name',
          used: 'Used',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Hide all job notifications',
          compInv: 'Click on "cancel" to just show only auctionable items\n or\nEnter other inventory URL to compare',
          loginAll1: 'Login all worlds',
          loginAll2: 'Załaduj wszystkie aktywne światów za pomocą jednego kliknięcia',
          custom1: 'Custom',
          custom2: 'Your custom login list',
          edit: 'Edit',
          saveMessage2: 'Saved successfully',
        },
        es: {
          language: 'Spanish (español)',
          ApiGui1: 'El script incluye varias funciones que simplifican la vida cotidiana en The West.<br><br>Más información: ',
          ApiGui2: 'Abrir ventana del script',
          FeatLogout: 'Crea un botón de cierre de sesión a la derecha en la barra de menús',
          FeatStatusbar: 'Oculta la barra inferior de las ventanas',
          FeatShowAP: 'Ver los puntos de trabajo en la ventana de trabajo',
          FeatChangeCity: 'Cambiar título y nombre del jugador en el ayuntamiento',
          FeatDuellMap: 'Completar la ventana de duelos con una pestaña que muestra el mapa de duelos',
          FeatMarkDaily: 'Marcar el Bonus-Conexión-5 Días especialmente para que no te lo pierdas',
          FeatMarketTown: 'Mostrar en la ventana de mercado, la ciudad al que pertenece',
          FeatMarketMessage: 'Si llegas a un mercado donde tienes algo que puede ser recogido, aparece un mensaj',
          FeatAchievHide: 'Ocultar logros completados en la ventana de logros para una mejor visión',
          FeatRecipeMarket: 'Mejorar la compra de recetas en el mercado',
          FeatMoveJobs: 'Mover los trabajos en cola un poco a la izquierda',
          FeatBlinkEvents: 'Detener el parpadeo de los botones de Evento y Feria de Condado en el lado izquierdo',
          FeatFortTracker: 'Apagar el recordatorio de Batalla de fuerte',
          FeatFriendsPop: 'Esconder ventana emergente de "Amigo conectado"',
          FeatInstantQuest: 'Completar la misión al instante si se cumplen todos los requisitos',
          FeatQuestWiki: 'Agregar un enlace en la ventana de búsqueda para mostrar la búsqueda en la Wiki',
          FeatCityTravel: 'Mostrar el tiempo de viaje a las ciudades en la pizarra',
          FeatBetterSheriff: 'Añadir una nueva pestaña en la ventana del sheriff para ver todas las recompensas posibles',
          FeatChatProfessions: 'Mostrar el oficio de los jugadores en la lista del chat',
          FeatQuestBookSearch: 'Buscar misiones terminadas en libro de misiones',
          FeatMarketRights: 'Mostrar si las ofertas de mercado son públicas o solo para los miembros de la Alianza/Ciudad',
          FeatEquipManagerPlus: 'Mejorar el administrador de equipos en el inventario',
          FeatShortPopups: 'Hacer los pop-ups de articulos más cortos',
          FeatHideNotis: 'Agregar un botón para ocultar las notificaciones de trabajo en el lado izquierdo',
          FeatJobProducts: 'Mostrar en la ventana emergente de trabajo cuántos productos tienes en tu inventario',
          FeatMapDistance: 'Mostrar la cantidad de millas al lado del tiempo de viaje',
          FeatTraderSell: 'Vender varios artículos a la vez al comerciante',
          FeatTouchControl: 'Habilitar el control táctil para el mapa y la barra de desplazamiento en su dispositivo móvil',
          settings1: 'Abrir preferencias',
          settings2: 'Abrir la ventana de información y ajustes',
          ghosttown1: 'Ir a la Ciudad Fantasma ',
          ghosttown2: 'Abrir Ciudad Fantasma',
          ghosttown3: 'Abrir la ventana de la Ciudad Fantasma y centrarla en el mapa',
          indiantown1: 'Ir al Pueblo Indio Waupee ',
          indiantown2: 'Abrir Pueblo Indio Waupee',
          indiantown3: 'Abrir la ventana del Pueblo Indio Waupee y centrarla en el mapa',
          openmarket: 'Abrir Mercado',
          forum: 'Abrir el foro de la ciudad',
          newsets: 'Nuevos conjuntos añadidos al script',
          chooseItems: 'Elegir los artículos',
          remindHover: 'Recibir una notificación cuando un artículo puede volverse a usar. Aquí puedes elegir estos artículos.',
          remindReady: 'Listo para recoger',
          skipHover: 'Omitir los mensajes de confirmación y resultado cuando abres algunas bolsas. Aquí puedes elegir estas bolsas',
          skipDone: 'Obtienes',
          info: 'Información',
          contact: 'Contacto',
          chooseLang: 'Elige idioma',
          features: 'Funciones',
          name: 'Nombre',
          author: 'Autor',
          version: 'Versión',
          gameversion: 'Versión Juego',
          website: 'Web',
          weblink: 'Weblink',
          save: 'Guardar',
          saveMessage: 'Ajustes guardados. Algunos cambios necesitan una actualización de la ventana de juego.',
          setbonus2: 'Información acerca de los bonus de conjunto',
          frame2: 'Páginas web votos',
          choose: 'Haga clic en el sombrero y elegir',
          items: 'artículos',
          parts: 'partes',
          showItems: 'Mostrar los artículos del conjunto en tu bolsa',
          noItems: '¡No se han encontrado artículos de este conjunto!',
          ownSets: 'Solo conjuntos propios',
          switchWeapon: 'Cambiar entre arma de fuego y arma contundente',
          selectBonus: 'Seleccionas bonus',
          resetB: 'Reiniciar',
          body: 'Ropa',
          right_arm: 'Armas',
          animal: 'Montura y Producto',
          rest: 'Otros',
          refresh: 'Actualizar',
          noFriends: 'Sin Amigos',
          reward: 'Recompensa',
          allprofessions: 'Todos Oficios',
          market1: 'Productos en el Mercado',
          market2: 'Todavía hay productos/dinero en el Mercado. ¿Desea recogerlos?',
          all: 'Todos',
          onlyBids: 'Solo Ofertas',
          nothing: 'Ninguno',
          worldwide: 'Mundo',
          alliance: 'Alianza',
          town: 'Ciudad',
          level: 'Nivel',
          duelLevel: 'Nivel Duelo',
          exp: 'Exp',
          distance: 'Distancia',
          startduel: 'Iniciar Duelo',
          centerMap: 'Centrar Mapa',
          popup: 'El bonus de habilidad del oponente',
          damage: 'Daño',
          duelmap: 'Mapa Duelos',
          duelradius: 'Radio duelos',
          minutes: 'Minutos',
          hour: '1 Hora',
          hours: 'Horas',
          searchOpp: 'Buscar Duelo',
          amount: 'Muerto',
          not_dead_amount: 'Vivo',
          duellevel: 'Niv',
          status: 'Estado',
          sortBy: 'Ordenar por',
          tooLow: 'Nivel de duelo del oponente demasiado bajo',
          tooHigh: 'Nivel de duelo del oponente demasiado alto',
          ownTown: 'Miembro de tu ciudad',
          attackable: 'Mostrar solo jugadores atacables',
          logout: 'Cerrar sesión',
          accNfin: 'Aceptar & concluir búsqueda',
          onWiki: 'Mostrar la búsqueda en la Wiki',
          longerName: 'El nombre debe tener más de 2 caracteres',
          loading: 'Cargando...',
          rename: 'Renombrar',
          newName: 'Elige un nuevo nombre de conjunto',
          used: 'Usado',
          renameWarning: 'Cuando renombre un conjunto, se lo pondrá y se lo quitará de nuevo.<br>¡Puede perder puntos de vida durante el proceso!',
          sellItems: '¿Vender artículos al comerciante?',
          removeWorkNotis: 'Ocultar todas las notificaciones de trabajo',
          compInv: 'Haga clic en "cancelar" para mostrar solo los artículos subastables \n o \n Ingrese otra URL de inventario para comparar',
          loginAll1: 'Conectarse a todos los mundos',
          loginAll2: 'Cargar todos los mundos activos con un solo click',
          custom1: 'Personalizar',
          custom2: 'Tu lista de conexión personalizada',
          edit: 'Editar',
          saveMessage2: 'Grabado con éxito',
        },
        nl: {
          language: 'Dutch (Nederlands)',
          ApiGui1: 'Dit script bevat veel mogelijkheden om het dagelijks leven in The West te vergemakkelijken.<br><br>Voor meer informatie: ',
          ApiGui2: 'Open script pagina',
          FeatLogout: 'Voeg een afmeldknop toe aan de rechterzijde van het scherm',
          FeatStatusbar: 'Verwijder het dagelijkse taken icoon',
          FeatShowAP: 'Toon je vaardigheidspunten in werkzaamheidsscherm windows',
          FeatChangeCity: 'Verwissel de titel en de spelersnaam in het  stadhuis',
          FeatDuellMap: 'Voeg een duelkaart toe aan de duel tab',
          FeatMarkDaily: 'Markeer de dagelijkse inlogbonus op de 5e dag zodat je hem niet mist',
          FeatMarketTown: 'Toon stadsnaam in marktscherm',
          FeatMarketMessage: 'Krijg een bericht wanneer er voorwerpen of geld beschikbaar zijn om op te halen',
          FeatAchievHide: 'Verberg voltooide prestaties in prestatiescherm',
          FeatRecipeMarket: 'Verbeter overzicht voor recepten kopen.',
          FeatMoveJobs: 'Verschuif de werkzaamheden in de wachtrij een stukje naar links',
          FeatBlinkEvents: 'Stop het knipperen van event of circus knop aan linkerkant',
          FeatFortTracker: 'Schakel de fortgevecht herinnering uit',
          FeatFriendsPop: 'Verberg “uw vriend logt in” pop-ups',
          FeatInstantQuest: 'Voltooi de quest direct als aan alle vereisten is gedaan',
          FeatQuestWiki: 'Add a link in the quest window to show the quest on the wiki page',
          FeatCityTravel: 'Show the travel time to the towns in the blackboard',
          FeatBetterSheriff: 'Add a new tab in the sheriff window to see all possible bounties',
          FeatChatProfessions: 'Show the crafting profession of the players in the chat list',
          FeatQuestBookSearch: 'Search for solved quests in the quest book',
          FeatMarketRights: 'Show if market offers are public or only for alliance/town members',
          FeatEquipManagerPlus: 'Improve the equipment manager in the inventory',
          FeatShortPopups: 'Make the item pop-ups shorter',
          FeatHideNotis: 'Add a button to hide the job notifications on the left side',
          FeatJobProducts: 'Show in the job pop-up how many products you already have in your inventory',
          FeatMapDistance: ' Show the number of miles next to the travel time',
          FeatTraderSell: 'Sell multiple items at once to the trader',
          FeatTouchControl: 'Enable touch control for map and scrollbar on your mobile',
          settings1: 'Instellingen openen',
          settings2: 'Instellingen en informatiescherm openen',
          ghosttown1: 'Ga naar de Spookstad ',
          ghosttown2: 'Open Spookstad',
          ghosttown3: 'Open Spookstad en centreer het op de kaart',
          indiantown1: 'Ga naar Waupees indianendorp ',
          indiantown2: 'Open Waupees indianendorp',
          indiantown3: 'Open Waupees indianendorp en centreer het op de kaart',
          openmarket: 'Open markt',
          forum: 'Open stadsforum',
          newsets: 'Nieuwe sets worden toegevoegd aan het script',
          chooseItems: 'Choose the items',
          remindHover: 'You get a notification when an item can be used again. Here you can choose these items.',
          remindReady: 'Ready to collect',
          skipHover: 'Skip the confirmation and result messages when you open some bags. Here you can choose these bags',
          skipDone: 'You get',
          info: 'Informatie',
          contact: 'Contact',
          chooseLang: 'Kies een taal',
          features: 'Features',
          name: 'Naam',
          author: 'Auteur',
          version: 'Versie',
          gameversion: 'Spelversies',
          website: 'Website',
          weblink: 'Link',
          save: 'Opslaan',
          saveMessage: 'Instellingen toegevoegd. Sommige veranderingen hebben behoefte aan een refresh van het spel venster.',
          setbonus2: 'Informatie over de set bonusen',
          frame2: 'Nuttige websites',
          choose: 'Klik op de hoed en kies',
          items: 'Voorwerpen',
          parts: 'parts',
          showItems: 'Show the set items in your Bag',
          noItems: 'No items in your inventory found. Click again with CTRL to show it on TW-Calc.',
          ownSets: 'Only own sets',
          switchWeapon: 'Switch between firearm and melee weapon',
          selectBonus: 'Select bonuses',
          resetB: 'Reset',
          body: 'Clothing',
          right_arm: 'Weapons',
          animal: 'Horse & Yield',
          rest: 'Other',
          buff: 'Buffs',
          refresh: 'Verversen',
          noFriends: 'Geen vrienden',
          reward: 'Beloning',
          allprofessions: 'Alle Beroepen',
          market1: 'Voorwerpen op de markt',
          market2: 'Er zijn voorpen/geld op de markt. Wat wil je eraf halen?',
          all: 'Alles',
          onlyBids: 'Alleen biedingen',
          nothing: 'Niets',
          worldwide: 'Worldwide',
          alliance: 'Alliance',
          town: 'Stad',
          level: 'Level',
          duelLevel: 'Duel level',
          exp: 'Ervaring',
          distance: 'Afstand',
          startduel: 'Duelleren',
          centerMap: 'Centreer kaart',
          popup: 'Vaardigheden-Bonus van de tegenstander',
          damage: 'Schade',
          duelmap: 'Duelkaart',
          duelradius: 'Duel radius',
          minutes: 'minuten',
          hour: '1 uur',
          hours: 'uren',
          searchOpp: 'Zoek naar tegenstanders',
          amount: 'Dead',
          not_dead_amount: 'Alive',
          duellevel: 'Lvl',
          status: 'Status',
          sortBy: 'Sort by',
          tooLow: 'Too low duelling level of opponent',
          tooHigh: 'Too high duelling level of opponent',
          ownTown: 'Member of your town',
          attackable: 'Show only attackable players',
          logout: 'Afmelden',
          accNfin: 'Opdracht aannemen & afsluiten',
          onWiki: 'Show the quest on the wiki',
          longerName: 'Name must be longer than 2 characters',
          loading: 'Loading...',
          rename: 'Rename',
          newName: 'Choose a new set name',
          used: 'Used',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Hide all job notifications',
          compInv: 'Click on "cancel" to just show only auctionable items\n or\nEnter other inventory URL to compare',
          loginAll1: 'Login all worlds',
          loginAll2: 'Laad al uw actieve werelden met één klik',
          custom1: 'Custom',
          custom2: 'Your custom login list',
          edit: 'Edit',
          saveMessage2: 'Saved successfully',
        },
        hu: {
          language: 'Hungarian (Magyar)',
          ApiGui1: 'Ez a szkript több olyan funkciót tartalmaz ami megkönnyíti a mindennapjaidat a vadnyugaton.<br><br>Több információ: ',
          ApiGui2: 'Szkript oldalának megnyitása',
          FeatLogout: 'Kilépés gomb a jobb oldalra',
          FeatStatusbar: 'Tálca eltüntetése',
          FeatShowAP: 'Valódi képességpontok a munkaablakokban',
          FeatChangeCity: 'Cím és játékosnév felcserélése a városházánál',
          FeatDuellMap: 'Párbajtérkép a párbaj ablakban',
          FeatMarkDaily: 'Az 5. napi belépés bónusz bekeretezése, hogy nehogy kihagyd',
          FeatMarketTown: 'Városnév megjelenítése a piac ablakban',
          FeatMarketMessage: 'Felugró ablak amikor tárgyak vagy pénz felvétele lehetséges az aktuális piacnál',
          FeatAchievHide: 'Befejezett események elrejtése az esemény ablakban',
          FeatRecipeMarket: 'Receptvásárlás megkönnyítése, rendezése a piacon',
          FeatMoveJobs: 'Mozgassa el a munka várólistát kissé balra hogy elférjenek az ikonok',
          FeatBlinkEvents: 'Események, eladás és piaci vásár gomb villogás kikapcsolása',
          FeatFortTracker: 'Kapcsolja ki az erődharc emlékeztetőt',
          FeatFriendsPop: 'Rejtse el a "barátod bejelentkezett" felugró ablakokat',
          FeatInstantQuest: 'Befejezni a küldetést, azonnal, ha minden feltétel kész',
          FeatQuestWiki: 'Link hozzáadása a kalandablakban, amin elérhető a kaland wikioldala',
          FeatCityTravel: 'Távolság a várostól mutatása a hirdetőtáblán',
          FeatBetterSheriff: 'Új lap hozzáadása a Seriff ablakban, láthatóvá téve az összes körözöttet',
          FeatChatProfessions: 'Mesterségek mutatása a játékosoknál a chat partnerlistánál',
          FeatQuestBookSearch: 'Keresés a befejezett kalandoknál a kalandkönyvben',
          FeatMarketRights: 'Piaci ajánlatoknál mutatása, hogy bárki számára elérhető vagy csak szövetség/város tagok számára',
          FeatEquipManagerPlus: 'Felszerelés kezelő ablak fejlesztése',
          FeatShortPopups: 'Tárgy felugró menüjének rövidítése',
          FeatHideNotis: 'Bal oldalon lévő munkaértesítéseket eltüntető gomb hozzáadása',
          FeatJobProducts: 'Munkáknál felugró menüben mutassa, mennyi terméked van már a felszerelésedben, ami az adott munkánál található',
          FeatMapDistance: ' Show the number of miles next to the travel time',
          FeatTraderSell: 'Sell multiple items at once to the trader',
          FeatTouchControl: 'Enable touch control for map and scrollbar on your mobile',
          settings1: 'Beállítások megnyitása',
          settings2: 'Beállítások és információk',
          ghosttown1: 'Menj el a Szellemvárosba ',
          ghosttown2: 'Szellemváros megnyitása',
          ghosttown3: 'Szellemváros megnyitása és ráközelítés térképen',
          indiantown1: 'Menj Waupee Indián falujába ',
          indiantown2: 'Indián falu megnyitása',
          indiantown3: 'Indián falu megnyitása és ráközelítés térképen',
          openmarket: 'Piac megnyitása',
          forum: 'Városfórum megnyitása',
          newsets: 'Új szett(ek) lettek hozzáadva a szkripthez',
          chooseItems: 'Válasz tárgyat',
          remindHover: 'Értesítést kapsz, amint egy tárgy ismét használható. Itt tudod kiválasztani melyik tárgyakról szeretnél értesítést kapni.',
          remindReady: 'Begyűjtésre készen áll',
          skipHover: 'Táskák nyitásánál megerősítő és jutalom üzenet figyelem kívül hagyása. Itt tudod kiválasztani melyik táska nyitásról ne kapj üzenetet.',
          skipDone: 'Ezt kapod',
          info: 'Információk',
          contact: 'Elérhetőségek',
          chooseLang: 'Válasszon nyelvet',
          features: 'Funkciók',
          name: 'Név',
          author: 'Szerző',
          version: 'Verzió',
          gameversion: 'Játékverzió',
          website: 'Weboldal',
          weblink: 'Webcím',
          save: 'Mentés',
          saveMessage: 'Beállítások elmentve. Néhány változás életbe lépéséhez frissítse a játék ablakát.',
          setbonus2: 'Információk a szettbónuszokról',
          frame2: 'Hasznos weboldalak',
          choose: 'Kattints a kalapra a kezdéshez, választáshoz',
          items: 'tárgyak',
          parts: 'darabok',
          showItems: 'Mutassa a szett tárgyakat a felszerelésedben',
          noItems: 'Nem található tárgy(ak) a felszerelésedben',
          ownSets: 'Csak a megszerzett szettek',
          switchWeapon: 'Váltás lőfegyver és ütőfegyver közt',
          selectBonus: 'Válasz bónuszt',
          resetB: 'Visszaállítás',
          body: 'Ruházat',
          right_arm: 'Párbajfegyver',
          animal: 'Állat',
          rest: 'Egyéb',
          buff: 'Buffs',
          refresh: 'Újratöltés',
          noFriends: 'Nincsenek barátok',
          reward: 'Díjak',
          allprofessions: 'Minden szakma',
          market1: 'Áruk a piacon',
          market2: 'Vannak Áruk/Pénz ezen a piacon. Mit szeretnél átvenni? ',
          all: 'Mindent',
          onlyBids: 'Árukat',
          nothing: 'Semmit',
          worldwide: 'Világ',
          alliance: 'Szövetség',
          town: 'Város',
          level: 'Szint',
          duelLevel: 'Párbajszint',
          exp: 'Tp',
          distance: 'Távolság',
          startduel: 'Párbaj kezdése',
          centerMap: 'Térkép közepére',
          popup: 'Az ellenfél bónusza',
          damage: 'Sebzés',
          duelmap: 'Párbajtérkép',
          duelradius: 'Párbaj sugár',
          minutes: 'perc',
          hour: '1 óra',
          hours: 'óra',
          searchOpp: 'Ellenfél keresése',
          amount: 'Halva',
          not_dead_amount: 'Élve',
          duellevel: 'Szint',
          status: 'Státusz',
          sortBy: 'Rendezés',
          tooLow: 'Túl alacsony a párbajszintje az ellenfélnek',
          tooHigh: 'Túl magas a párbajszintje az ellenfélnek',
          ownTown: 'Városod tagja',
          attackable: 'Csak a kihívható ellenfeleket mutassa',
          logout: 'Kijelentkezés',
          accNfin: 'Kaland elfogadása & lezárása',
          onWiki: 'Kaland mutatása a wikin',
          longerName: 'Névnek két karakternél hosszabbnak kell lennie',
          loading: 'Töltés...',
          rename: 'Átnevezés',
          newName: 'Válasz új nevet a szettnek',
          used: 'Használt',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Összes munkaértesítés elrejtése',
          compInv: 'Kattints a "mégse" gombra hogy csak az árverezhető tárgyakat mutassa\n vagy\nHozzáadd egy másik táska URL címét összehasonlításként',
          loginAll1: 'Összes világba bejelentkezés',
          loginAll2: 'Betölti az összes aktív világok egyetlen kattintással',
          custom1: 'Egyedi',
          custom2: 'Egyedi bejelentkezési listád',
          edit: 'Szerkesztés',
          saveMessage2: 'Sikeres mentés',
        },
        el: {
          language: 'Greek (ελληνικά)',
          ApiGui1: 'Αυτό το script περιέχει πολλά χαρακτηριστικά για να απλοποιήσετε την ζωή σας στο The West.<br><br>Περισσότερες πληροφορίες: ',
          ApiGui2: 'Ρυθμίσεις του script',
          FeatLogout: 'Προσθέστε ένα κουμπί αποσύνδεσης στη δεξιά πλευρά',
          FeatStatusbar: 'Αφαιρέστε τη γραμμή εργασιών',
          FeatShowAP: 'Εμφάνιση των συνολικών πόντων εργασίας στα παράθυρα εργασίας',
          FeatChangeCity: 'Βάλτε τον τίτλο πριν από το όνομα του παίκτη στην καρτέλα του Δημαρχείου',
          FeatDuellMap: 'Προσθήκη καρτέλας Duelmap στην καρτέλα μονομαχιών',
          FeatMarkDaily: 'Επισημάνετε το καθημερινό μπόνους σύνδεσης την 5η ημέρα για να μην το χάσετε',
          FeatMarketTown: 'Εμφάνιση ονόματος πόλης στο παράθυρο της αγοράς',
          FeatMarketMessage: 'Εμφάνιση μηνύματος όταν υπάρχουν αντικείμενα ή χρήματα στην αγορά της πόλης που μόλις ταξιδέψατε',
          FeatAchievHide: 'Απόκρυψη ολοκληρωμένων επιτευγμάτων στο παράθυρο επιτευγμάτων',
          FeatRecipeMarket: 'Βελτιώστε την αγορά συνταγών στην αγορά',
          FeatMoveJobs: 'Μετακινήστε την καρτέλα των τρέχουσων εργασιών λίγο προς τα αριστερά',
          FeatBlinkEvents: 'Σταματήστε την αναλαμπή των Εκδηλώσεων και του Λούνα Παρκ στην αριστερή πλευρά',
          FeatFortTracker: 'Απενεργοποιήστε την υπενθύμιση μάχης οχυρού',
          FeatFriendsPop: 'Απόκρυψη αναδυόμενων παραθύρων "Συνδεδεμένοι φίλοι"',
          FeatInstantQuest: 'Ολοκληρώστε μια αποστολή αμέσως αν πληρούνται όλες οι απαιτήσεις',
          FeatQuestWiki: 'Προσθήκη ενός κουμπιού στις αποστολές για την εμφάνισή τους στην σελίδα "Βοήθειας"',
          FeatCityTravel: 'Εμφάνιση του χρόνου ταξιδιού στις πόλεις του μαυροπίνακα',
          FeatBetterSheriff: 'Προσθήκη μιας νέας καρτέλας στο παράθυρο του "Σερίφη" για να δείτε όλες τις πιθανές επικυρήξεις',
          FeatChatProfessions: 'Προσθήκη του εικονιδίου επαγγέλματος των παικτών στη λίστα συνομιλίας (τσατ)',
          FeatQuestBookSearch: 'Αναζήτηση για επιλυμένες αποστολές στο βιβλίο αποστολών',
          FeatMarketRights: 'Προσθήκη εικονιδίου για το εάν οι προσφορές της αγοράς είναι δημόσιες ή μόνο για μέλη της συμμαχίας / πόλης',
          FeatEquipManagerPlus: 'Βελτιώστε τον υπεύθυνο εξοπλισμού στα αποθέματα',
          FeatShortPopups: 'Εμφάνιση μικρότερης περιγραφής αντικειμένων στα αποθέματα',
          FeatHideNotis: 'Προσθήκη ενός κουμπιού για την απόκρυψη των ειδοποιήσεων εργασίας στην αριστερή πλευρά',
          FeatJobProducts: 'Εμφανίστε στο αναδυόμενο παράθυρο εργασίας πόσα προϊόντα έχετε ήδη στα αποθέματά σας',
          FeatMapDistance: 'Εμφάνιση της απόστασης του ταξιδιού σας σε Μίλια',
          FeatTraderSell: 'Πώληση πολλαπλών αντικειμένων στον Έμπορο',
          FeatTouchControl: 'Enable touch control for map and scrollbar on your mobile',
          settings1: 'Ρυθμίσεις',
          settings2: 'Ανοίξτε τις ρυθμίσεις και το παράθυρο πληροφοριών',
          ghosttown1: 'Προς την Πόλη Φάντασμα ➔ ',
          ghosttown2: 'Άνοιγμα της Πόλης Φάντασμα',
          ghosttown3: 'Άνοιγμα και κεντράρισμα του χάρτη στην Πόλη Φάντασμα',
          indiantown1: 'Προς το Ινδιάνικο χωριό ➔ ',
          indiantown2: 'Άνοιγμα του Ινδιάνικου χωριού',
          indiantown3: 'Άνοιγμα και κεντράρισμα του χάρτη στο Ινδιάνικο χωριό',
          openmarket: 'Άνοιγμα της Αγοράς',
          forum: 'Άνοιγμα του Φόρουμ Πόλης',
          newsets: 'Νέα Σετ προσθέθηκαν στο script',
          chooseItems: 'Επιλέξτε τα αντικείμενα',
          remindHover: 'Λαμβάνετε μια ειδοποίηση όταν ένα αντικείμενο μπορεί να χρησιμοποιηθεί ξανά. Εδώ μπορείτε να επιλέξετε αυτά τα αντικείμενα.',
          remindReady: 'Έτοιμο για συλλογή',
          skipHover: 'Απενεργοποιήστε τα μηνύματα επιβεβαίωσης και τα αποτελέσματα όταν ανοίγετε κάποιες τσάντες. Εδώ μπορείτε να επιλέξετε αυτές τις τσάντες',
          skipDone: 'Παίρνετε',
          info: 'Πληροφορίες',
          contact: 'Επικοινωνία',
          chooseLang: 'Επιλογή γλώσσας',
          features: 'Χαρακτηριστικά',
          name: ' Όνομα παίκτη',
          author: 'Συντάκτης',
          version: 'Έκδοση',
          gameversion: 'Έκδοση παιχνιδιού',
          website: 'Ιστοσελίδα',
          weblink: 'Σύνδεσμος',
          save: 'Αποθήκευση',
          saveMessage: 'Οι ρυθμίσεις αποθηκεύτηκαν. Ορισμένες αλλαγές χρειάζονται μια ανανέωση του παραθύρου του παιχνιδιού.',
          setbonus2: 'Πληροφορίες σχετικά με τα μπόνους των Σετ',
          frame2: 'Χρήσιμες ιστοσελίδες',
          choose: 'Κάντε κλικ στο καπέλο για να ξεκινήσετε',
          items: 'Αντικείμενα',
          parts: 'Τεμάχια',
          showItems: 'Εμφάνιση των αντικειμένων που υπάρχουν στα αποθέματά σας',
          noItems: 'Δεν βρέθηκαν αντικείμενα στα αποθέματά σας!',
          ownSets: 'Δικά σου Σετ',
          switchWeapon: 'Εναλλαγή μεταξύ πυροβόλου όπλου και ξίφους όπλου',
          selectBonus: 'Επιλέξτε Μπόνους',
          resetB: 'Επαναφορά',
          body: 'Ένδυση',
          right_arm: 'Όπλο μονομαχίας',
          animal: 'Άλογο & σέλα',
          rest: 'Άλλο',
          buff: 'Buffs',
          refresh: 'Ανανέωση',
          noFriends: 'Δεν υπάρχουν φίλοι',
          reward: 'Ανταμοιβή',
          allprofessions: 'Όλα τα επαγγέλματα',
          market1: 'Αντικείμενα στην Αγορά',
          market2: 'Υπάρχουν αντικείμενα / χρήματα σε αυτήν την αγορά. Τι θέλετε να σηκώσετε;',
          all: 'Όλα',
          onlyBids: 'Μόνο προσφορές',
          nothing: 'Τίποτα',
          worldwide: 'Οποιονδήποτε',
          alliance: 'Συμμαχία',
          town: 'Πόλη',
          level: 'Επίπεδο',
          duelLevel: ' Επίπεδο μονομαχίας ',
          exp: ' Εμπειρία ',
          distance: ' Απόσταση ',
          startduel: ' Μονομαχήστε ',
          centerMap: 'Κεντράρισμα στον χάρτη',
          popup: 'Το μπόνους δεξιοτήτων των αντιπάλων',
          damage: 'Ζημιά',
          duelmap: 'Χάρτης μονομαχιών',
          duelradius: 'Ακτίνα μονομαχιών',
          minutes: 'λεπτά',
          hour: '1 ώρα',
          hours: 'ώρες',
          searchOpp: 'Αναζήτηση για αντιπάλους',
          amount: 'Νεκρός/ή',
          not_dead_amount: 'Ζωντανός/ή',
          duellevel: 'Επίπεδο',
          status: 'Κατάσταση',
          sortBy: 'Ταξινόμηση κατά',
          tooLow: 'Χαμηλό επίπεδο μονομαχίας του αντιπάλου',
          tooHigh: 'Υψηλό επίπεδο μονομαχίας του αντιπάλου',
          ownTown: 'Μέλος της πόλης σου',
          attackable: 'Εμφάνιση μόνο παίκτες που μπορείτε να μονομαχήσετε',
          logout: 'Αποσύνδεση',
          accNfin: 'Αποδοχή & Ολοκλήρωση αποστολής',
          onWiki: 'Εμφάνισε την αποστολή στο Wiki',
          longerName: 'Το όνομα πρέπει να είναι μεγαλύτερο από 2 χαρακτήρες',
          loading: 'Φόρτωση...',
          rename: 'Μετονομασία',
          newName: 'Επιλέξτε ένα νέο όνομα Σετ',
          used: 'Χρησιμοποιείται',
          renameWarning: 'Όταν μετονομάζετε ένα Σετ, θα το φορέσετε και θα το ξαναβγάλετε.<br>Μπορεί να χάσετε κάποιους πόντους υγείας κατά τη διάρκεια της διαδικασίας!',
          sellItems: 'Πώληση αντικειμένων στον Έμπορο;',
          removeWorkNotis: 'Απόκρυψη όλων των ειδοποιήσεων εργασιών',
          compInv: 'Κάντε κλικ στην επιλογή "ακύρωση" για να προβάλλετε μόνο αντικείμενα που μπορούν να πουληθούν με πλειστηριασμό\n ή\nΠροσθέστε άλλη διεύθυνση URL αποθέματος για σύγκριση',
          loginAll1: 'Είσοδος σε όλους',
          loginAll2: 'Φορτώστε όλους τους ενεργούς κόσμους σας με ένα κλικ',
          custom1: 'Προσαρμοσμένο',
          custom2: 'Η προσαρμοσμένη λίστα σας σύνδεσης',
          edit: 'Επεξεργασία',
          saveMessage2: 'Αποθηκεύτηκε με επιτυχία',
        },
        pt: {
          language: 'Portuguese (português)',
          ApiGui1: 'Esse script foi feito para facilitar sua vida no Velho Oeste: ',
          ApiGui2: 'Abrir página do Script',
          FeatLogout: 'Adicionar botão de sair no fim dos scripts',
          FeatStatusbar: 'Remover a barra de tarefas',
          FeatShowAP: 'Mostrar seus pontos de habilidade na janela de trabalho.',
          FeatChangeCity: 'Mude o título e nome do jogador na cidade.',
          FeatDuellMap: 'Adicionar mapa de duelos na janela duelos.',
          FeatMarkDaily: 'Destacar bônus de login diário.',
          FeatMarketTown: 'Mostrar nome da cidade no mercado.',
          FeatMarketMessage: 'Receber notificação de itens comprados ou vendidos no mercado atual.',
          FeatAchievHide: 'Ocultar conquistas realizadas na janela de conquistas.',
          FeatRecipeMarket: 'Melhorar a compra de receitas no mercado.',
          FeatMoveJobs: 'Mover os trabalhos enfileirados a esquerda.',
          FeatBlinkEvents: 'Não piscar botões de evento ao lado esquerdo.',
          FeatFortTracker: 'Ocultar botão da batalha de forte.',
          FeatFriendsPop: 'Ocultar janela de amigos online.',
          FeatInstantQuest: 'Completar aventura instantâneamente quando tiver os requisitos.',
          FeatQuestWiki: 'Adicionar link para abrir a aventura no wiki.',
          FeatCityTravel: 'MOstrar o tempo de distância nas cidades do quadro.',
          FeatBetterSheriff: 'Adicionar aba no Xerife para ver todas as recompensas possíveis.',
          FeatChatProfessions: 'MOstrar a profissão dos jogadores na lista do chat.',
          FeatQuestBookSearch: 'Pesquisar por aventuras resolvidas no livro de aventuras',
          FeatMarketRights: 'Diferenciar itens no mercado entre cidade, aliança, e público.',
          FeatEquipManagerPlus: 'Mostre o gerenciamento de equipamento no inventário.',
          FeatShortPopups: 'Tornar janelas pop-up mais curtas.',
          FeatHideNotis: 'Adicionar botão para ocultar as notificações do trabalho ao lado esquerdo.',
          FeatJobProducts: 'Mostrar na janela de trabalho quantos produtos você já tem no inventário.',
          FeatMapDistance: ' Mostrar o número de milhas ao lado do tempo de viagem.',
          FeatTraderSell: 'Vender vários itens de uma só vez ao comerciante.',
          FeatTouchControl: 'Enable touch control for map and scrollbar on your mobile',
          settings1: 'Configurações',
          settings2: 'Configurações e Janela de Informações',
          ghosttown1: 'Ir para Cidade Fantasma ',
          ghosttown2: 'Abrir Cidade Fantasma',
          ghosttown3: 'Abrir Cidade Fantasma e Centralizar no Mapa',
          indiantown1: 'Ir para Vila Indígena ',
          indiantown2: 'Abrir Vila Ingígena',
          indiantown3: 'Abrir Vila Indígena e Centralizar no Mapa',
          openmarket: 'Mercado',
          forum: 'Fórum da Cidade',
          newsets: 'Novos Sets Adicionados ao Script',
          chooseItems: 'Escolha os Itens',
          remindHover: 'Receber notificação quando um item puder ser usado novamente.',
          remindReady: 'Pronto para recolher.',
          skipHover: 'Pular janelas de confirmação ao abrir algumas caixas e itens.',
          skipDone: 'Você ganhou:',
          info: 'Informação',
          contact: 'Contato:',
          chooseLang: 'Escolher Idioma',
          features: 'Características',
          name: 'Nome',
          author: 'Autor',
          version: 'Versão',
          gameversion: 'Versão do Game',
          website: 'Website',
          weblink: 'Weblink',
          save: 'Salvar',
          saveMessage: 'Configurações salvas. Algumas mudanças só apareceram quando atualizar a janela.',
          setbonus2: 'Informações sobre o bônus do set',
          frame2: 'Páginas da Web Úteis',
          choose: 'Clique no Chapéu para começar.',
          items: 'Itens',
          parts: 'Partes',
          showItems: 'Mostrar os itens definidos no seu saco.',
          noItems: 'Nenhum item no seu inventário foi encontrado. Clique novamente com a tecla CTRL para mostrar no TW-Calc.',
          ownSets: 'Apenas possui conjuntos.',
          switchWeapon: 'Alternar entre arma de fogo e arma de vigor.',
          selectBonus: 'Selecionar bônus',
          resetB: 'Resetar',
          body: 'Roupas',
          right_arm: 'Armas',
          animal: 'Cavalo & Sela',
          rest: 'Outros',
          buff: 'Buffs',
          refresh: 'Atualizar',
          noFriends: 'Sem Amigos',
          reward: 'Recompensa',
          allprofessions: 'Todas as Profissões',
          market1: 'Itens no Mercado',
          market2: 'Há itens e dinheiro no mercado, o que você quer recolher?',
          all: 'Os dois',
          onlyBids: 'Apenas Lance',
          nothing: 'Nada',
          worldwide: 'No mundo todo',
          alliance: 'Aliança',
          town: 'Cidade',
          level: 'Nível',
          duelLevel: 'Nivel de Duelo',
          exp: 'Experiência',
          distance: 'Distância',
          startduel: 'Desafiar num Duelo',
          centerMap: 'Centralizar Mapa',
          popup: 'Bônus de Habilidade do Oponente',
          damage: 'Danificar',
          duelmap: 'Mapa de Duelo',
          duelradius: 'Raio de Duelo',
          minutes: 'Minutos',
          hour: '1 hora',
          hours: 'horas',
          searchOpp: 'Pesquisar Oponentes',
          amount: 'Morto',
          not_dead_amount: 'Vivo',
          duellevel: 'Nível',
          status: 'Status',
          sortBy: 'Ordenar por:',
          tooLow: 'Nível de duelo muito baixo.',
          tooHigh: 'Nível de duelo muito alto',
          ownTown: 'Membro da sua Cidade',
          attackable: 'Mostrar apenas jogadores atacáveis',
          logout: 'Sair',
          accNfin: 'Aceitar e completar quest.',
          onWiki: 'Abrir quest na janela wi-ki',
          longerName: 'O nome deve ter mais de 2 caracteres.',
          loading: 'Carregando...',
          rename: 'Renomear',
          newName: 'Escolha um novo nome de conjunto',
          used: 'Usado',
          renameWarning: 'Quando você renomeia um conjunto, você vai usá-lo e despir-lo novamente.<br>Você pode perder pontos de saúde durante o processo!',
          sellItems: 'Vender itens para o comerciante?',
          removeWorkNotis: 'Ocultar todas as notificações de Jobs',
          compInv: 'Clique em "cancelar" para mostrar apenas itens leiloáveis\n ou\nIntroduza outro URL de inventário para comparar',
          loginAll1: 'Login em todos os mundos',
          loginAll2: 'Carregue todos os seus mundos ativos em um clique',
          custom1: 'Personalizado',
          custom2: 'Sua lista de login persnalizada',
          edit: 'Editar',
          saveMessage2: 'Salvo com sucesso!',
        },
        it: {
          language: 'Italian (italiano)',
          ApiGui1: 'Questo script raccoglie molte funzionalità utili a semplificarti la vita in The West.<br><br>Ulteriori informazioni: ',
          ApiGui2: 'Apri la pagina dello script',
          FeatLogout: 'Aggiungi sul lato destro dello schermo un pulsante disconnetti',
          FeatStatusbar: 'Nascondi la barra degli incarichi',
          FeatShowAP: 'Mostra i tuoi attuali punti abilità nelle finestre dei lavori',
          FeatChangeCity: 'Nel municipio, inverti il titolo e il nome del giocatore',
          FeatDuellMap: 'Aggiungi la scheda Mappa duelli nella finestra Duelli',
          FeatMarkDaily: 'Evidenzia il bonus login del 5° giorno per non dimenticarlo',
          FeatMarketTown: 'Mostra il nome della città nella finestra del mercato',
          FeatMarketMessage: 'Ricevi una notifica quando ci sono oggetti o soldi da ritirare al mercato della città dove ti trovi in quel momento',
          FeatAchievHide: 'Nascondi i Successi completati nella rispettiva finestra di gioco',
          FeatRecipeMarket: 'Migliora l\'organizzazione delle ricette al mercato',
          FeatMoveJobs: 'Sposta la coda dei lavori leggermente più a sinistra',
          FeatBlinkEvents: 'Termina il lampeggiamento delle icone degli eventi e della fiera nella barra delle notifiche',
          FeatFortTracker: 'Disattiva l\'icona di notifica della battaglia al forte',
          FeatFriendsPop: 'Nascondi i pop-up "Amico online"',
          FeatInstantQuest: 'Se tutti i requisiti sono soddisfatti, permetti di concludere le missioni istantaneamente',
          FeatQuestWiki: 'Aggiungi un link alla wiki italiana (ove disponibile) nelle finestre delle missioni',
          FeatCityTravel: 'Mostra la distanza verso le città nella lavagna',
          FeatBetterSheriff: 'Aggiungi una nuova scheda nella finestra dello sceriffo per vedere tutte le possibili taglie',
          FeatChatProfessions: 'Mostra la professione a fianco del nome dei giocatori nella lista della chat',
          FeatQuestBookSearch: 'Aggiungi una casella di ricerca nella scheda "Completate" del libro missioni',
          FeatMarketRights: 'Mostra se le offerte del mercato sono pubbliche oppure per alleati\concittadini',
          FeatEquipManagerPlus: 'Migliora la finestra "Gestione equipaggiamento" nell\'inventario',
          FeatShortPopups: 'Rendi i tooltip degli oggetti più corti',
          FeatHideNotis: 'Aggiungi un pulsante per nascondere le notifiche dei lavori nella relativa barra',
          FeatJobProducts: 'Nel tooltip dei prodotti mostra quanti se ne possiede in inventario',
          FeatMapDistance: 'Mostra la distanza in miglia accanto al tempo di viaggio',
          FeatTraderSell: 'Consenti di vendere oggetti in quantità multipla ai negozi\mercante ambulante',
          FeatTouchControl: 'Abilità il controllo touch nel browser mobile',
          settings1: 'Apri le impostazioni',
          settings2: 'Apri le impostazioni e la finestra di informazioni',
          ghosttown1: 'Vai alla Città fantasma',
          ghosttown2: 'Apri la Città Fantasma',
          ghosttown3: 'Apri la Città Fantasma e centra la mappa',
          indiantown1: 'Vai al Villaggio Indiano',
          indiantown2: 'Apri il Villaggio Indiano',
          indiantown3: 'Apri il Villaggio Indiano e centra la mappa',
          openmarket: 'Apri il mercato',
          forum: 'Apri il forum città',
          newsets: 'Nuovi set sono stati aggiunti allo script',
          chooseItems: 'Scegli gli oggetti',
          remindHover: 'Ricevi una notifica quando un oggetto può essere di nuovo utilizzato. Scegli qui gli oggetti di interesse.',
          remindReady: 'Pronto per essere collezionato',
          skipHover: 'Salta i messaggi di conferma e risultato quando apri alcuni oggetti. Scegli qui gli oggetti di interesse',
          skipDone: 'Ottieni',
          info: 'Informazioni',
          contact: 'Contatti',
          chooseLang: 'Scegli lingua',
          features: 'Caratteristiche',
          name: 'Nome',
          author: 'Autore',
          version: 'Versione',
          gameversion: 'Versione di gioco',
          website: 'Sito internet',
          weblink: 'Link al sito',
          save: 'Salva',
          saveMessage: 'Impostazioni salvate. Aggiorna la pagina per renderle effettive.',
          setbonus2: 'Informazioni sui bonus set',
          frame2: 'Pagine internet di aiuto',
          choose: 'Clicca sul cappello per iniziare',
          items: 'oggetti',
          parts: 'parti',
          showItems: 'Mostra i set oggetti nel tuo inventario',
          noItems: 'Nessun oggetto trovato nel tuo inventario. Cliccaci nuovamente tenendo premuto CTRL per mostrarlo su TW-Calc.',
          ownSets: 'Solo propri set',
          switchWeapon: 'Inverti armi da fuoco e da contusione',
          selectBonus: 'Scegli i bonus',
          resetB: 'Reset',
          body: 'Abiti',
          right_arm: 'Armi',
          animal: 'Cavallo e oggetto',
          rest: 'Altro',
          buff: 'Buffs',
          refresh: 'Aggiorna',
          noFriends: 'Nessun amico',
          reward: 'Ricompensa',
          allprofessions: 'Tutte le professioni',
          market1: 'Oggetti al mercato',
          market2: 'Ci sono oggetti/soldi da ritirare in questo mercato. Vuoi farlo?',
          all: 'Tutto',
          onlyBids: 'Solo aste',
          nothing: 'Niente',
          worldwide: 'Mondiale',
          alliance: 'Alleanza',
          town: 'Città',
          level: 'Livello',
          duelLevel: 'Livello duello',
          exp: 'Esperienza',
          distance: 'Distanza',
          startduel: 'Inizia duello',
          centerMap: 'Centra mappa',
          popup: 'Abilità bonus dell\'avversario',
          damage: 'Danno',
          duelmap: 'Mappa duelli',
          duelradius: 'Raggio duelli',
          minutes: 'minuti',
          hour: '1 ora',
          hours: 'ore',
          searchOpp: 'Cerca avversari',
          amount: 'Morto',
          not_dead_amount: 'Vivo',
          duellevel: 'Liv',
          status: 'Stato',
          sortBy: 'Ordina per',
          tooLow: 'Livello duello avversario troppo basso',
          tooHigh: 'Livello duello avversario troppo alto',
          ownTown: 'Membro della tua città',
          attackable: 'Mostra solo i giocatori duellabili',
          logout: 'Disconneti',
          accNfin: 'Accetta e completa missione',
          onWiki: 'Mostra la missione nella Wiki',
          longerName: 'Il nome deve essere più lungo di 2 caratteri',
          loading: 'Caricamento...',
          rename: 'Rinomina',
          newName: 'Scegli un nuovo nome set',
          used: 'Usato',
          renameWarning: 'Quando rinomini un set lo indosserai e svestirai di nuovo.<br>In questo processo potresti perdere dei punti vita!',
          sellItems: 'Vuoi vendere questi oggetti?',
          removeWorkNotis: 'Nascondi tutte le notifiche dei lavori',
          compInv: 'Clicca su "cancella" per mostrare solo gli oggetti vendibili all\'asta\n oppure\nInserisci altro URL di inventari per confrontare',
          loginAll1: 'Fai login in tutti i mondi',
          loginAll2: 'Carica tutti i mondi in cui sei attivo con un clic',
          custom1: 'Personalizza',
          custom2: 'La tua lista login personalizzata',
          edit: 'Modifica',
          saveMessage2: 'Salvato con successo',
        },
      },
      Images: function (img, file) {
        return 'https://tomrobert.safe-ws.de/' + img + (file ? '.jpg' : '.png');
      },
    };
    if (location.href.includes('game.php')) {
      LT = {
        name: 'TWLeoTools',
        author: 'Leotas (updated by Tom Robert)',
        minGame: '2.04',
        maxGame: Game.version.toString(),
        website: 'https://greasyfork.org/scripts/7238',
        SPEC: [
          'speed', 'luck', 'dollar', 'experience', 'regen', 'drop',
        ],
        list: null,
        currSetBonus: 0,
        currBonusSearch: '',
        lvlToggle: 0,
        setAbc: false,
        onlyOwnSets: false,
        chooseBonus: {
          subWeapon: 'hand'
        },
        Data: {},
        loaded: [],
        Features: {
          Logout: false,
          Statusbar: false,
          ShowAP: false,
          ChangeCity: false,
          DuellMap: true,
          MarkDaily: true,
          MarketMessage: true,
          MarketTown: true,
          AchievHide: true,
          RecipeMarket: true,
          MoveJobs: true,
          BlinkEvents: false,
          FortTracker: false,
          FriendsPop: false,
          InstantQuest: true,
          QuestWiki: true,
          CityTravel: true,
          BetterSheriff: true,
          ChatProfessions: true,
          QuestBookSearch: true,
          MarketRights: true,
          EquipManagerPlus: true,
          ShortPopups: true,
          HideNotis: true,
          JobProducts: true,
          MapDistance: true,
          TraderSell: true,
          TouchControl: true,
        },
        cooldown: {
          2482: 1,
          2484: 1,
          2485: 1,
          2557: 1,
          2558: 1,
          2665: 1,
          2666: 1,
          2698: 1,
          50691: 1,
          51482: 1,
          51483: 1,
        },
        cooldownTimer: {},
        cooldownSetTime: function (y, res, sec) {
          LT.cooldownTimer[y] = setTimeout(function () {
              var imgs = $('<span></span>');
              for (var z = 0; z < res.length; z++) {
                var itemDiv = new tw2widget.JobItem(res[z].obj).getMainDiv();
                imgs.append(itemDiv);
              }
              var cooldownMsg = new west.gui.Dialog(LTlang.remindReady, imgs, 'ok').addButton('ok', function () {
                  Wear.open();
                  Inventory.showSearchResult(res);
                  cooldownMsg.hide();
                  LT.cooldownTimer[y] = 0;
                }).addButton('cancel').show();
            }, sec);
        },
        skipOpen: {
          1975: 1,
          2561: 0.5,
          2562: 0.5,
          2675: 0.5,
        },
        addStyle: function (css) {
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = css;
          document.body.appendChild(style);
        },
        updateLang: function () {
          var lg = LTstart.langs;
          LT.lang = lg[localStorage.getItem('scriptsLang')] ? localStorage.getItem('scriptsLang') : lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : 'en';
          LTlang = lg[LT.lang];
        },
      };
      LT.updateLang();
      LT.Skript = {
        init: function () {
          TheWestApi.register('LeoTools', LT.name, LT.minGame, LT.maxGame, LT.author, LT.website).setGui('<br>' + LTlang.ApiGui1 + '<a href="javascript:LT.GUI.open(\'openKontakt\');LT.GUI.makeList();" title="' + LTlang.ApiGui2 + '">' + LTlang.ApiGui2 + '</a><br><br><i>' + LT.name + ' v' + LTstart.version + '</i>');
          var menuContainer = $('<div id="LT-menu" class="menulink" onclick="LT.GUI.openSelectbox();" title="' + LT.name + '" />').css('background-image', 'url(' + LTstart.Images('LT_settings') + ')').css('background-position', '0px 0px').mouseenter(function () {
              $(this).css('background-position', '-25px 0px');
            }).mouseleave(function () {
              $(this).css('background-position', '0px 0px');
            });
          $('#ui_menubar').append($('<div class="ui_menucontainer" />').append(menuContainer).append('<div class="menucontainer_bottom" />'));
          LT.Skript.updateFeat();
          LT.SkipOpen();
        },
        updateFeat: function () {
          var saved = localStorage.getItem('TWLT');
          LT.Data = saved && saved.indexOf('{') === 0 && JSON.parse(saved) || {};
          for (var k in LT.Features) {
            if (LT.Skript.getFeature(k) && !LT.loaded.includes(k)) {
              try {
                LT.loaded.push(k);
                LT[k].init();
              } catch (e) {}
            }
          }
          LT.CollectReminder();
        },
        getFeature: function (name) {
          return (LT.Data[name] !== undefined) ? LT.Data[name] : LT.Features[name];
        },
      };
      Map.getLastQueuePosition = function () {
        var posx = Character.position.x;
        var posy = Character.position.y;
        if (TaskQueue.queue.length >= 1) {
          var data = TaskQueue.queue[TaskQueue.queue.length - 1].wayData;
          if (data.x) {
            posx = data.x;
            posy = data.y;
          }
        }
        return {
          x: posx,
          y: posy
        };
      };
      var EvName = Object.keys(Game.sesData)[0],
      set1 = west.storage.ItemSetManager._setList;
      if (EvName)
        var sendGift = Game.sesData[EvName].friendsbar;
      LT.GUI = {
        openSelectbox: function () {
          LT.GUI.makeList();
          var selectbox = new west.gui.Selectbox();
          $(selectbox.getMainDiv()).append('<div class="LTselbox"/>');
          selectbox.setHeader(LT.name);
          selectbox.setWidth(300);
          selectbox.addItem(0, LTlang.settings1, LTlang.settings2);
          selectbox.addItem(1, 'SetBonus', LTlang.setbonus2);
          selectbox.addItem(2, 'BonusSearch', LTlang.setbonus2);
          selectbox.addItem(3, 'WebCenter', LTlang.frame2);
          selectbox.addItem(4, LTlang.ghosttown1 + Map.calcWayTime(Map.getLastQueuePosition(), {
              x: 1728,
              y: 2081
            }).formatDuration(), LTlang.ghosttown1);
          selectbox.addItem(5, LTlang.ghosttown2, LTlang.ghosttown3);
          selectbox.addItem(6, LTlang.indiantown1 + Map.calcWayTime(Map.getLastQueuePosition(), {
              x: 28002,
              y: 16658
            }).formatDuration(), LTlang.indiantown1);
          selectbox.addItem(7, LTlang.indiantown2, LTlang.indiantown3);
          selectbox.addItem(8, LTlang.openmarket, LTlang.openmarket);
          selectbox.addItem(9, LTlang.forum, LTlang.forum);
          if (EvName) {
            selectbox.addItem(10, '<div style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;"><b>' + sendGift.label + '</b></div>', sendGift.label);
          }
          selectbox.addListener(function (e) {
            switch (e) {
            case 0:
              LT.GUI.open('openFeatures');
              break;
            case 1:
              LT.GUI.open('openSetsWindow', 0, 'SetBonus');
              break;
            case 2:
              LT.GUI.open('openSetsWindow', 0, 'BonusSearch');
              break;
            case 3:
              LT.GUI.open('openFrame');
              break;
            case 4:
              QuestEmployerWindow.startWalk({
                key: 'ghosttown',
                x: '1728',
                y: '2081'
              });
              break;
            case 5:
              Map.center(1728, 2081);
              QuestEmployerWindow.showEmployer('ghosttown', '1728', '2081');
              break;
            case 6:
              QuestEmployerWindow.startWalk({
                key: 'indianvillage',
                x: '28002',
                y: '16658'
              });
              break;
            case 7:
              Map.center(28002, 16658);
              QuestEmployerWindow.showEmployer('indianvillage', '28002', '16658');
              break;
            case 8:
              MarketWindow.open(Character.homeTown.town_id);
              break;
            case 9:
              ForumWindow.open();
              break;
            case 10:
              LT.GUI.open('openSender');
              break;
            }
          });
          var pos = $('div#LT-menu').offset();
          pos = {
            clientX: pos.left,
            clientY: pos.top
          };
          selectbox.show(pos);
        },
        window: {},
        checkbox: {},
        open: function (tab, data, id) {
          LT.GUI.window = wman.open('LT', 'TheWest - LeoTools', 'noreload').setMiniTitle(LT.name).setMaxSize(1268, 838).addTab(LTlang.info + ' & ' + LTlang.contact, 'LTContact', LT.GUI.openKontakt).addTab(LTlang.features, 'LTFeatures', LT.GUI.openFeatures).addTab('SetBonus', 'SetBonus', LT.GUI.openSetsWindow).addTab('BonusSearch', 'BonusSearch', LT.GUI.openSetsWindow).addTab('WebCenter', 'LTFrame', LT.GUI.openFrame);
          if (EvName)
            LT.GUI.window.addTab('Event', 'LTSender', LT.GUI.openSender);
          LT.GUI[tab](data, id);
          $('.tw2gui_window_inset', LT.GUI.window.getMainDiv()).css('background-image', 'url(' + LTstart.Images('LT_backGr', 1) + ')');
        },
        getDefault: function (tab) {
          LT.GUI.window.setResizeable(false).setSize(748, 471).clearContentPane().removeClass('nocloseall').setTitle('TheWest - LeoTools');
          LT.GUI.window.dontCloseAll = false;
          $(LT.GUI.window.getContentPane()).css('margin-top', '0px');
          var wnd = LT.GUI.window.getMainDiv();
          $('.textart_title', wnd).css('display', '');
          LT.GUI.window.activateTab(tab);
        },
        openKontakt: function () {
          LT.GUI.getDefault('LTContact');
          var fmfb = function (l) {
            return 'https://forum.the-west.' + l + '/index.php?conversations/add&to=Tom Robert';
          },
          content = $('<br><h1>' + LTlang.info + '</h1><ul style="list-style-type:none;line-height:18px;margin-left:5px;"><li><b>' + LTlang.name + ': </b>' + LT.name + '</li><li><b>' + LTlang.author + ': </b>' + LT.author + '</li><li><b>' + LTlang.version + ': </b>' + LTstart.version + '</li><li><b>' + LTlang.gameversion + ': </b>' + LT.minGame + ' - ' + LT.maxGame + '</li><li><b>' + LTlang.website + ': </b>' + '<a href="' + LT.website + '" target="_blank">' + LTlang.weblink + '</a></li></ul>' +
              '<br><h1>' + LTlang.contact + '</h1><ul style="margin-left:15px;line-height:18px;"><li>Send a message to <a target=\'_blanck\' href="http://om.the-west.de/west/de/player/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert on German world Arizona</a></li>' +
              '<li>Contact me on <a target=\'_blanck\' href="https://greasyfork.org/forum/messages/add/Tom Robert">Greasy Fork</a></li>' +
              '<li>Message me on one of these The West Forum:<br>/ <a target=\'_blanck\' href="' + fmfb('de') + '">deutsches Forum</a> / ' +
              '<a target=\'_blanck\' href="' + fmfb('net') + '">English forum</a> / <a target=\'_blanck\' href="' + fmfb('pl') + '">forum polski</a> / ' +
              '<a target=\'_blanck\' href="' + fmfb('es') + '">foro español</a> /<br>/ <a target=\'_blanck\' href="' + fmfb('ru') + '">Русский форум</a> / ' +
              '<a target=\'_blanck\' href="' + fmfb('fr') + '">forum français</a> / <a target=\'_blanck\' href="' + fmfb('it') + '">forum italiano</a> / ' +
              '<a target=\'_blanck\' href="https://forum.beta.the-west.net/index.php?conversations/add&to=Tom Robert">beta forum</a> /<br>I will get an e-mail when you sent me the message <img src="images/chat/emoticons/smile.png"></li></ul>');
          LT.GUI.window.appendToContentPane(content);
        },
        openFeatures: function () {
          LT.GUI.getDefault('LTFeatures');
          var featScroll = new west.gui.Scrollpane().appendContent('<h2>' + LTlang.chooseLang + '</h2>'),
          langBox = new west.gui.Combobox().appendTo(featScroll.getContentPane());
          for (var j in LTstart.langs)
            langBox.addItem(j, LTstart.langs[j].language);
          langBox.select(LT.lang);
          LT.cdTemp = LT.Data.cooldown ? $.extend({}, LT.Data.cooldown) : $.extend({}, LT.cooldown);
          $('<span title="' + LTlang.remindHover + '" style="background-image: url(images/items/yield/low_heart_container.png); cursor: pointer; position: absolute; height: 73px; width: 73px; right: 0px; top: 0px;"/>').appendTo(featScroll.getContentPane()).click(function () {
            var cont = $('<span>');
            for (var x in LT.cooldown) {
              var productDiv = new tw2widget.JobItem(ItemManager.getByBaseId(x)).getMainDiv();
              $(productDiv).css('opacity', LT.cdTemp[x] || LT.cooldown[x]).attr('onclick', 'LT.cdTemp[' + x + ']=$(this).css("opacity")==1?0.5:1;$(this).css("opacity",LT.cdTemp[' + x + ']);');
              cont.append(productDiv);
            }
            new west.gui.Dialog(LTlang.chooseItems, cont).addButton('ok').show();
          });
          LT.skipTemp = LT.Data.skipOpen ? $.extend({}, LT.Data.skipOpen) : $.extend({}, LT.skipOpen);
          var openSkipList = function () {
            var cont2 = $('<span></span>');
            for (var x in LT.skipTemp) {
              var productDiv2 = new tw2widget.JobItem(ItemManager.getByBaseId(x)).getMainDiv(),
              productDel = new west.gui.Icon('abort ' + x).getMainDiv().click(function (e) {
                  e.stopPropagation();
                  e.target.parentElement.remove();
                  delete LT.skipTemp[e.target.classList[2]];
                });
              $(productDel).css({
                'display': 'inline-block',
                'position': 'absolute',
                'right': '0px'
              });
              $(productDiv2).css('opacity', LT.skipTemp[x]).attr('onclick', 'LT.skipTemp[' + x + ']=$(this).css("opacity")==1?0.5:1;$(this).css("opacity",LT.skipTemp[' + x + ']);').append(productDel);
              cont2.append(productDiv2);
            }
            var itemPrew = $('<div id="LT_add_chest_prew" style="height:73px;width:73px;border:1px solid;border-radius:10px;float:left"/><br>');
            var textFP = new west.gui.Textfield('add_skipOpen_chest').maxlength(6).setPlaceholder('item_base_id').addKeyUpListener(function (e) {
                $('#LT_add_chest_prew').empty();
                iconP.disable();
                var val = e.target.value;
                if (!isNaN(val) && val < forbid.maxID) {
                  var item = ItemManager.getByBaseId(val);
                  if (item) {
                    $('#LT_add_chest_prew').append(new tw2widget.JobItem(item).getMainDiv());
                    if (item.usebonus && item.usebonus.length == 1 && item.action.split(',')[2] == "'yield');" && !LT.skipTemp[val])
                      iconP.enable();
                  }
                }
              }),
            iconP = new west.gui.Iconbutton(new west.gui.Icon('plus'), function () {
                LT.skipTemp[textFP.getValue()] = 1;
                skipList.hide();
                openSkipList();
              }).disable(),
            iconA = new west.gui.Icon('abort').getMainDiv().click(function () {
                textFP.setValue('');
                $('#LT_add_chest_prew').empty();
                iconP.disable();
              });
            cont2.append(itemPrew, textFP.getMainDiv(), iconP.getMainDiv(), iconA);
            var skipList = new west.gui.Dialog(LTlang.chooseItems, cont2).setBlockGame(false).setDraggable(true).addButton('ok').show();
          };
          $('<span title="' + LTlang.skipHover + '" style="background-image: url(images/items/yield/productchest_1.png); cursor: pointer; position: absolute; height: 73px; width: 73px; right: 0px; top: 73px;"/>').appendTo(featScroll.getContentPane()).click(openSkipList);
          featScroll.appendContent('<br><br><h2>' + LTlang.features + '</h2>');
          for (var k in LT.Features) {
            LT.GUI.checkbox[k] = new west.gui.Checkbox().setLabel(LTlang['Feat' + k]).setSelected(LT.Skript.getFeature(k)).appendTo(featScroll.getContentPane());
            featScroll.appendContent('<br><div style="height:5px;" />');
          }
          featScroll.appendContent('<br>');
          $(featScroll.getMainDiv()).css({
            'height': '330px',
            'margin-top': '10px'
          });
          var button = new west.gui.Button(LTlang.save, function () {
              localStorage.setItem('scriptsLang', langBox.getValue());
              LT.updateLang();
              for (var k in LT.GUI.checkbox)
                LT.Data[k] = LT.GUI.checkbox[k].isSelected();
              LT.Data.cooldown = LT.cdTemp;
              LT.Data.skipOpen = LT.skipTemp;
              localStorage.setItem('TWLT', JSON.stringify(LT.Data));
              LT.Skript.updateFeat();
              new UserMessage(LTlang.saveMessage, 'success').show();
            });
          $(LT.GUI.window.getContentPane()).append(featScroll.getMainDiv()).append(button.getMainDiv());
        },
        makeList: function () {
          if (!LT.list)
            $.getScript('https://tomrobert.safe-ws.de/forbidN.js').done(function () {
              LT.list = west.storage.ItemSetManager._setArray.slice(0);
              LT.setListAll = {};
              LT.setListOwn = {};
              LT.itemListAll = {};
              LT.itemListOwn = {};
              var slot = {
                2: ['animal', 'yield'],
                3: ['right_arm', 'left_arm'],
                6: ['body', 'pants', 'neck', 'head', 'foot', 'belt']
              };
              var i = LT.list.length;
              while (i--) {
                var si = LT.list[i];
                if (!forbid.sets.includes(si.key) && si.items[0] && !ItemManager.getByBaseId(si.items[0]).short.includes('friendset_') && !si.key.includes('friendship_set_'))
                  LT.setListAll[si.key] = si;
                else
                  LT.list.splice(i, 1);
              }
              LT.setLength = Object.keys(LT.setListAll).length;
              for (var j in LT.setListAll) {
                var sa = LT.setListAll[j];
                //sa.items.sort((a, b) => a - b);
                var sil = sa.items.length;
                sa.slots = slot[sil] && slot[sil].includes(ItemManager.getByBaseId(sa.items[1]).type) ? slot[sil][0] : 'rest';
                var items = sa.getAvailableItems();
                if (items.length) {
                  var bon = {},
                  oneType = [];
                  for (var o = 0; o < items.length; o++) {
                    var igt = ItemManager.get(items[o]);
                    items[o] = igt.item_base_id;
                    if (sa.bonus[o + 1] && !oneType.includes(igt.type))
                      bon[o + 1] = sa.bonus[o + 1];
                    oneType.push(igt.type);
                  }
                  LT.setListOwn[j] = {
                    items: items.reverse(),
                    bonus: bon,
                    name: sa.name,
                    slots: sa.slots,
                  };
                }
              }
              var replUml = function (str) {
                return str.toUpperCase().replace(/"/g, '').replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Ő/g, 'O').replace(/Ú|Ü|Ű/g, 'U').replace(/Ś/g, 'S');
              };
              LT.list.sort(function (a, b) {
                var a1 = replUml(a.name),
                b1 = replUml(b.name);
                return (a1 == b1) ? 0 : (a1 > b1) ? 1 : -1;
              });
              var buffDesc = function (umt) {
                return umt.match(/[^%-:]+/)[0].trim();
              },
              useboni = {},
              ammobelt = 2741,
              ghostmusic = 2732,
              lantern = 2734,
              moneyboost = 2468,
              ratatou = 51127,
              cocktail = 51579,
              getBuff = function (itm, num) {
                return buffDesc(ItemManager.getByBaseId(itm).usebonus[num]);
              };
              useboni[getBuff(ammobelt, 2)] = 'offense';
              useboni[getBuff(ammobelt, 1)] = 'defense';
              useboni[getBuff(ghostmusic, 0)] = 'experience';
              useboni[getBuff(moneyboost, 0)] = 'dollar';
              useboni[getBuff(ratatou, 0)] = 'luck';
              useboni[getBuff(ratatou, 1)] = 'drop';
              useboni[getBuff(ghostmusic, 1)] = 'joball';
              useboni[getBuff(lantern, 0)] = 'speed';
              useboni[getBuff(cocktail, 0)] = 'regen';
              for (var kn in CharacterSkills.keyNames)
                useboni[CharacterSkills.keyNames[kn]] = kn;
              var addItems = function (obj, state) {
                var ob = obj.bonus,
                boni = {
                  1: ob.item.slice()
                },
                slot = 'item';
                if (obj.usebonus) {
                  slot = 'buff';
                  for (var oub of obj.usebonus) {
                    if (!oub)
                      continue;
                    var desc = buffDesc(oub);
                    if (useboni[desc])
                      boni[1].push({
                        name: useboni[desc],
                        value: oub.match(/\d+/)[0],
                      });
                  }
                } else
                  for (var cat in ob) {
                    if (cat == 'item')
                      continue;
                    for (var type in ob[cat]) {
                      var ct = ob[cat][type];
                      if (ct > 0) {
                        boni[1].push({
                          name: type,
                          value: ct,
                          isSector: cat == 'fortbattlesector',
                          leveled: obj.item_level > 0
                        });
                      }
                    }
                  }
                LT['itemList' + state][obj.item_base_id] = {
                  bonus: boni,
                  name: obj.name,
                  slots: slot,
                  pos: obj.type,
                  item_level: obj.item_level,
                };
              };
              var allItems = ItemManager.getAll();
              for (var k in allItems)
                if (k > 9 && k < forbid.maxID && !forbid.IDs.includes(k) && !(allItems[k].set && !LT.setListAll[allItems[k].set]))
                  addItems(allItems[k], 'All');
              for (var l in Bag.items_by_id)
                if (!forbid.IDs.includes(k))
                  addItems(Bag.items_by_id[l].obj, 'Own');
              for (var m in Wear.wear)
                addItems(Wear.wear[m].obj, 'Own');
              var collect = set1.collector_set.bonus[9], //pray
              pilg = set1.set_pilgrim_male.bonus[2], //build
              lee = set1.set_oktoberfest_2016_1.bonus[6], //offenstrue
              hero = set1.independance_event_set7.bonus[2], //drop
              delChar = function (list) {
                return list.desc.replace(/[0-9]|\+|\.|\%/g, '').substring(1);
              };
              LT.searchObj = {
                offense: [delChar(collect[5]), 'fort/battle/button_attack'],
                offensetrue: [delChar(lee[4]), 'fort/battle/help01'],
                defense: [delChar(hero[13]), 'fort/battle/button_defend'],
                defensetrue: [delChar(collect[6]), 'fort/battle/help02'],
                resistance: [delChar(hero[15]), 'fort/battle/resistance'],
                //damage: ['weapon damage', 'items/left_arm/golden_rifle'],
                damagetrue: [delChar(collect[7]), 'items/left_arm/golden_rifle'],
                experience: [delChar(hero[10]), 'items/yield/xp_boost', '<br>'],
                dollar: [delChar(hero[11]), 'items/yield/dollar_boost'],
                luck: [delChar(collect[2]), 'items/yield/luck_boost'],
                drop: [delChar(hero[9]), 'items/yield/product_boost'],
                joball: [delChar(collect[0]), 'window/job/jobstar_small_gold'],
                speed: [delChar(collect[1]), 'jobs/walk'],
                regen: [delChar(collect[3]), 'jobs/sleep'],
                pray: [delChar(collect[4]), 'jobs/pray'],
                job1000: [delChar(pilg[0]), 'jobs/build'],
              };
              for (var ca = 0; ca < CharacterSkills.allSkillKeys.length; ca++) {
                if (ca % 5 === 0) {
                  var attr = CharacterSkills.allAttrKeys[ca / 5];
                  LT.searchObj[attr] = [CharacterSkills.keyNames[attr], 'window/skills/circle_' + attr, ca % 10 === 0 ? '<br>' : ''];
                }
                var skill = CharacterSkills.allSkillKeys[ca];
                LT.searchObj[skill] = [CharacterSkills.keyNames[skill], 'window/skills/skillicon_' + skill];
              }
              if (!localStorage.getItem('TWLTdate') || Date.parse(forbid.date) > Date.parse(localStorage.getItem('TWLTdate'))) {
                var setNames = '',
                nSets = forbid.unlock;
                for (var h of nSets)
                  setNames += LT.GUI.getSetOrItem(h, set1[h]) + '<br>';
                new west.gui.Dialog(LT.name, '<span><b>' + forbid.date.toDateString() + '</b><br>' + LTlang.newsets + ':<br><br>' + setNames + '</span>', west.gui.Dialog.SYS_OK).setBlockGame(false).setDraggable(true).addButton('ok').show();
                localStorage.setItem('TWLTdate', forbid.date);
              }
            });
        },
        itemsInInv: function (id) {
          var upgrade = isNaN(id) ? LT.currList[id].items : [id],
          items = [];
          for (var g of upgrade) {
            for (var h = 0; h <= 5; h++) {
              items.push(g * 1000 + h);
            }
          }
          var invItems = Bag.getItemsByItemIds(items);
          if (invItems.length > 0) {
            Wear.open();
            Inventory.showCustomItems(invItems);
          } else
            new UserMessage(LTlang.noItems, 'hint').show();
        },
        getSetOrItem: function (id, obj, nolink) {
          if (!obj)
            return id;
          var isItem = !isNaN(id),
          nNew = window.forbid && (isItem && id >= forbid.unlockID || !isItem && forbid.unlock.includes(id)) ? '<img src="' + LTstart.Images('new') + '">' : '',
          nLvl = obj.item_level ? '<img src="images/items/item_level.png"><span style="font-size: 11px;color:#ffffff;text-shadow:black -1px 0 1px,black 0 1px 1px,black 1px 0 1px,black 0 -1px 1px;">' + obj.item_level + '</span>' : '',
          options = {
            show_alreadyown: true
          };
          if (LT.lvlToggle)
            options.character = {
              level: LT.lvlToggle
            };
          var nPopup = 'data-setkey="' + id + '"',
          click = 'onclick="LT.GUI.itemsInInv(\'' + id + '\')"',
          img = '';
          if (isItem) {
            var itemId = id + '00' + obj.item_level,
            item = ItemManager.get(itemId);
            nPopup = 'data-itemid="' + itemId + '" title="' + (new ItemPopup(item, options).getXHTML().escapeHTML()) + '"';
            img = '<img src="' + item.image + '" width="25">';
          } else if (LT.GUI.window.currentActiveTabId == 'SetBonus')
            nPopup += 'title="' + LTlang.showItems + '" style="color:#FFE7B1;"';
          else
            click = 'onclick="LT.GUI.open(\'openSetsWindow\',\'' + id + '\',\'SetBonus\')"';
          if (nolink)
            click = '';
          return '<b><span class="linklike" ' + nPopup + click + '>' + nNew + img + nLvl + obj.name + '</span></b>';
        },
        newState: '',
        html: {},
        openSetsWindow: function (st, tab) {
          LT.GUI.getDefault(tab);
          LT.GUI.window.setTitle(tab);
          var newSet = false;
          if (typeof st === 'string') {
            newSet = true;
            LT['curr' + tab] = st;
          }
          var scrollpane = new west.gui.Scrollpane('LTSetsWindow');
          $(scrollpane.getMainDiv()).css({
            'margin-left': '120px',
            'margin-top': '10px',
            'width': '578px'
          });
          var lvlUp = function (level, value) {
            var ret = !level ? 0 : value < 1 ? Math.round(Math.max(1, value * 1000 * level)) / 10000 : Math.round(Math.max(1, value * 0.1 * level));
            return value + ret;
          },
          charLvl = Character.level,
          getBonImg = function (n, w) {
            var son = LT.searchObj[n] || JobList.getJobById(n.slice(3));
            return '<img src="images/' + (son[1] || 'jobs/' + son.shortname) + '.png" width="' + w + '" title="' + (son[0] || son.name) + '">';
          },
          types = {},
          perL = set1.instance_set_1.bonus[2][0].desc.match(/\(.*?\)/)[0],
          compare = function (sets, id) {
            for (var i in sets) {
              var si = sets[i];
              for (var k in si.bonus)
                for (var ID of si.bonus[k]) {
                  var ib = ID.bonus || ID;
                  var NAM = (ib.name || ib.type) + (ib.job || ib.isSector || '');
                  if (id[NAM]) {
                    if (!types[i]) {
                      types[i] = {
                        desc: (LT.SPEC.includes(NAM) ? '% ' : ' ') + (ID.key && !LT.lvlToggle ? perL : ''),
                        value: {},
                        values: {},
                        compVal: {
                          sum: 0
                        },
                        slots: si.slots,
                        name: si.name,
                        item_level: si.item_level,
                        items: si.items,
                      };
                    }
                    if (!types[i].value[NAM])
                      types[i].value[NAM] = 0;
                    types[i].value[NAM] += ib.value;
                    var NUM = types[i].value[NAM] * (LT.SPEC.includes(NAM) && types[i].slots != 'buff' ? 100 : 1);
                    var VAL = LT.lvlToggle && ID.key ? Math.ceil(NUM * LT.lvlToggle) : NUM;
                    var lvl = ib.leveled ? 0 : si.item_level;
                    var LVL = lvlUp(lvl, VAL) * id[NAM];
                    if (!types[i].values[k])
                      types[i].values[k] = $.extend({
                          sum: 0
                        }, types[i].values[k - 1]);
                    types[i].values[k][NAM] = Math.round(LVL * 1000) / 1000;
                    types[i].compVal[NAM] = !LT.lvlToggle && ID.key ? lvlUp(lvl, Math.ceil(NUM * Character.level)) * id[NAM] : LVL;
                    types[i].parts = k;
                  }
                }
              if (types[i]) {
                for (var cv in types[i].compVal) {
                  types[i].compVal.sum += types[i].compVal[cv];
                  for (var nv in types[i].values)
                    types[i].values[nv].sum += types[i].values[nv][cv] || 0;
                }
                if (si.items) {
                  for (var is of si.items)
                    if (ItemManager.getByBaseId(is).sub_type != id.subWeapon)
                      types[i].compVal.sum += types[is] ? types[is].compVal.sum : 0;
                }
              }
            }
          },
          reloadLvl = 0,
          showbonus = {
            'SetBonus': function (id) {
              LT.currSetBonus = id;
              scrollpane.contentPane.empty();
              var types = {},
              sets = LT.currList[id];
              if (!sets)
                return;
              LT.GUI.window.setTitle(LT.GUI.getSetOrItem(id, sets));
              var spCont = '<span style="width:60%;position:absolute;">';
              for (var k in sets.bonus) {
                spCont += '<b>' + k + ' ' + LTlang.items + ':</b><br>';
                for (var ID of sets.bonus[k]) {
                  var ib = ID.bonus || ID;
                  var NAM = (ib.name || ib.type) + (ib.job || ib.isSector || '');
                  if (!types[NAM]) {
                    var DESC = ID.desc && (LT.lvlToggle && ID.key && ID.desc.replace(/[0-9]|\+|\.|\([^)]+\)$/g, '') || ID.desc.replace(/[0-9]|\+|\./g, '')) || CharacterSkills.keyNames[NAM];
                    types[NAM] = {
                      key: (ID.key || 0),
                      desc: DESC,
                      value: 0
                    };
                  }
                  types[NAM].value += ib.value;
                }
                for (var m in types) {
                  var n = types[m];
                  var NUM = n.value * (LT.SPEC.includes(m) ? 100 : 1);
                  var VAL = LT.lvlToggle && n.key ? Math.ceil(NUM * LT.lvlToggle) : Math.round(NUM * 100) / 100;
                  spCont += getBonImg(m, 23) + ' + ' + VAL + ' ' + n.desc + '<br>';
                }
              }
              spCont += '</span><span style="width:40%;left:60%;position:absolute;">';
              for (var o of LT.currList[id].items)
                spCont += LT.GUI.getSetOrItem(o, LT['itemList' + LT.currState][o]) + '<br>';
              scrollpane.appendContent(spCont);
              setTimeout(function () {
                var cont = $('div.LTSetsWindow div.tw2gui_scrollpane_clipper_contentpane > span');
                cont.parent().height(cont.height() + 10);
              }, 100);
            },
            'BonusSearch': function (idString) {
              var id = JSON.parse(idString);
              if (Object.keys(id).length > 2 && !LT.lvlToggle) {
                if (!LT.currBonusSearch) {
                  LT.currBonusSearch = idString;
                  reloadLvl = 1;
                }
                return lvlBox.select(charLvl);
              }
              scrollpane.contentPane.empty();
              types = {};
              var title = '';
              for (var oi in LT.searchObj)
                if (id[oi])
                  title += getBonImg(oi, 35) + ' ';
              LT.GUI.window.setTitle(title);
              var ns = '' + LT.lvlToggle + LT.onlyOwnSets;
              if (idString != LT.currBonusSearch || ns != LT.GUI.newState || reloadLvl) {
                LT.currBonusSearch = idString;
                LT.GUI.newState = ns;
                reloadLvl = 0;
                compare(LT['itemList' + LT.currState], id);
                compare(LT.currList, id);
                var types2 = Object.keys(types).sort(function (a, b) {
                    return types[b].compVal.sum / types[b].parts - types[a].compVal.sum / types[a].parts;
                  }),
                ic = 0;
                LT.GUI.html = {
                  body: '',
                  right_arm: '',
                  animal: '',
                  rest: '',
                  item: '',
                  buff: '',
                };
                for (var type of types2) {
                  var n = types[type],
                  nsi = n.slots == 'item';
                  if (nsi && ic++ > 200)
                    continue;
                  var setval = 0;
                  LT.GUI.html[n.slots] += '<br>' + LT.GUI.getSetOrItem(type, n) + '<br>';
                  for (var o in n.values) {
                    if (o == 'sum')
                      continue;
                    var pre = (nsi ? '' : o + ' ' + LTlang.parts + ':');
                    LT.GUI.html[n.slots] += pre + ' +' + n.values[o].sum + n.desc + '<br>';
                    setval = n.values[o].sum;
                  }
                  if (n.items) {
                    var ibs = 0;
                    for (var ib of n.items)
                      if (ItemManager.getByBaseId(ib).sub_type != id.subWeapon)
                        ibs += types[ib] ? types[ib].values[1].sum : 0;
                    LT.GUI.html[n.slots] += '& ' + LTlang.items + ': +' + (ibs + setval) + '<br>';
                  }
                }
              }
              scrollpane.appendContent('<span class="LTBonusS body" style="width:16%;position:absolute;"><h4>' + LTlang.body + '</h4></span><span class="LTBonusS right_arm" style="width:16%;left:17%;position:absolute;"><h4>' + LTlang.right_arm + '</h4></span><span class="LTBonusS animal" style="width:16%;left:34%;position:absolute;"><h4>' + LTlang.animal + '</h4></span><span class="LTBonusS rest" style="width:16%;left:51%;position:absolute;"><h4>' + LTlang.rest + '</h4></span><span class="LTBonusS item" style="width:16%;left:68%;position:absolute;"><h4>' + LTlang.items + '</h4></span><span class="LTBonusS buff" style="width:16%;right:0;position:absolute;"><h4>' + LTlang.buff + '</h4></span>');
              for (var hs in LT.GUI.html)
                $('.LTBonusS.' + hs).append(LT.GUI.html[hs]);
              setTimeout(function () {
                var maxHeight = 0;
                for (var h of $('div.LTSetsWindow span.LTBonusS'))
                  if (h.clientHeight > maxHeight)
                    maxHeight = h.clientHeight;
                $('div.LTSetsWindow div.tw2gui_scrollpane_clipper_contentpane').height(maxHeight + 10);
              }, 200);
            },
          },
          loadResult = function () {
            if (LT.setLength <= forbid.max || LT.onlyOwnSets || newSet) {
              if (LT['curr' + tab])
                showbonus[tab](LT['curr' + tab]);
              newSet = false;
            }
          },
          selbox,
          loadSelbox = function () {
            LT.currState = LT.onlyOwnSets ? 'Own' : 'All';
            LT.currList = LT['setList' + LT.currState];
            selbox = new west.gui.Selectbox().setWidth(250);
            LT.GUI.window.setTitle(tab);
            scrollpane.contentPane.empty();
            if (LT.setLength <= forbid.max || LT.onlyOwnSets) {
              if (tab == 'SetBonus') {
                selbox.addListener(showbonus.SetBonus);
                var sbaI = function (j) {
                  var sj = LT.currList[j];
                  selbox.addItem(j, '<img src=' + (forbid.unlock.includes(j) ? LTstart.Images('new') : ItemManager.getByBaseId(sj.items[0]).image) + ' height="20" width="20">' + '<div style="padding-right: 20px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">' + sj.name + '</div>', sj.name);
                };
                if (LT.setAbc) {
                  for (var h of LT.list)
                    if (LT.currList[h.key])
                      sbaI(h.key);
                } else
                  for (var i in LT.currList)
                    sbaI(i);
              }
              scrollpane.appendContent('<h1>' + LTlang.choose + '!</h1>');
            } else
              scrollpane.appendContent('<p style="color: #a31919;">ERROR: There are new sets added to the game.<br>Please <a href="javascript:LT.GUI.open(\'openKontakt\');" title="Open contact tab">contact me</a> so I can add the sets to the script.</p>');
          },
          img = {
            SetBonus: 'dayofthedead_2014_hat3',
            BonusSearch: 'st_patrick_head',
            shot: 'goldensable',
            hand: 'golden_gun',
          },
          buttonLogic = function (ev, d, b) {
            var butObj = b || ev.data.obj,
            id = butObj.id,
            val = 1;
            if ($(ev.currentTarget).hasClass('butPlus') || d > 0) {
              if (butObj.current_value + 1 > butObj.max_value)
                return false;
            } else {
              if (butObj.current_value - 1 < butObj.min_value)
                return false;
              val = -1;
            }
            butObj.current_value += val;
            if (CharacterSkills.skills[id]) {
              var attr = CharacterSkills.skills[id].attr_key;
              if (!LT.chooseBonus[attr])
                LT.chooseBonus[attr] = 0;
              LT.chooseBonus[attr] += val;
              $('.chooseBonus #' + attr + ' span.displayValue').text(LT.chooseBonus[attr]);
              if (LT.chooseBonus[attr] === 0)
                delete LT.chooseBonus[attr];
            }
            if (butObj.current_value === 0)
              delete LT.chooseBonus[id];
            else
              LT.chooseBonus[id] = butObj.current_value;
            $('.chooseBonus #' + id + ' span.displayValue').text(butObj.current_value);
            return true;
          },
          cont,
          getCB = function (id) {
            if (LT.searchObj[id][2])
              cont.append(LT.searchObj[id][2]);
            var div = $('<div class="chooseBonus" style="display:inline-block;">' + getBonImg(id, 45)).appendTo(cont);
            new west.gui.Plusminusfield(id, LT.chooseBonus[id] || 0, -100, 100, 0, buttonLogic, buttonLogic, buttonLogic).setWidth(45).appendTo(div);
          },
          chooseWindow = function () {
            cont = $('<span>').append('<div style="width:92px;display:inline-block;vertical-align:top;background-color:#A47F5B;border-radius:5px;">' +
                '<img id="switchWeapon" style="cursor:pointer;" src="https://wiki.the-west.de/images/1/1a/Switch_weapons_icon.png" title="' + LTlang.switchWeapon + '" width="45">' +
                '<img id="subWeapon" src="images/items/right_arm/' + img[LT.chooseBonus.subWeapon] + '.png" width="45"></div>');
            for (var so in LT.searchObj) {
              getCB(so);
            }
            new west.gui.Dialog(LTlang.selectBonus, cont).setBlockGame(false).setDraggable(true).addButton('ok', function () {
              if (Object.keys(LT.chooseBonus).length > 1)
                showbonus.BonusSearch(JSON.stringify(LT.chooseBonus));
              else {
                LT.currBonusSearch = '';
                loadSelbox();
              }
            }).addButton(LTlang.resetB, function () {
              LT.chooseBonus = {
                subWeapon: 'hand'
              };
              chooseWindow();
            }).addButton('cancel').show();
            $('#switchWeapon').click(function () {
              LT.chooseBonus.subWeapon = LT.chooseBonus.subWeapon == 'shot' ? 'hand' : 'shot';
              $("#subWeapon").attr('src', 'images/items/right_arm/' + img[LT.chooseBonus.subWeapon] + '.png');
            });
            $('div.chooseBonus .tw2gui_plusminus').width('auto');
            $('div.chooseBonus').css('margin-left', '2px');
          };
          setbutton = $('<span title="' + LTlang.choose + '" style="background-image:url(images/items/head/' + img[tab] + '.png); cursor:pointer;  position:absolute; height:73px; width:73px; margin:4px;" />');
          setbutton.click(function () {
            if (tab == 'SetBonus') {
              var pos = $(setbutton).offset();
              selbox.setPosition(pos.left + 35, pos.top + 50);
              selbox.show();
            } else if (tab == 'BonusSearch' && (LT.setLength <= forbid.max || LT.onlyOwnSets))
              chooseWindow();
          });
          var content = $('<div>');
          content.css({
            'margin-top': '90px',
            'width': '110px',
            'position': 'absolute',
          });
          $(LT.GUI.window.getContentPane()).append(setbutton, content, scrollpane.getMainDiv());
          var maxLvl = 150,
          setsSort = tab == 'SetBonus' ? new west.gui.Checkbox('ABC', null, function (state) {
              LT.setAbc = state;
              loadSelbox();
            }).setSelected(LT.setAbc, true).getMainDiv() : '',
          lvlBox = new west.gui.Combobox().setWidth(77).addItem(0, '0').addItem(charLvl, '' + charLvl),
          onlyOwn = new west.gui.Checkbox(LTlang.ownSets, null, function (state) {
              LT.onlyOwnSets = state;
              loadSelbox();
              loadResult();
            }).setSelected(LT.onlyOwnSets);
          if (charLvl != maxLvl)
            lvlBox.addItem(maxLvl, '' + maxLvl);
          lvlBox.select(LT.lvlToggle).addListener(function (lvl) {
            LT.lvlToggle = lvl;
            loadResult();
          });
          content.append(setsSort, '<br><br><b>' + LTlang.level + ':</b>', lvlBox.getMainDiv(), onlyOwn.getMainDiv());
          $('div.tw2gui_window.LT.active_tab_id_BonusSearch').width(1060);
          $('div.tw2gui_window.LT.active_tab_id_BonusSearch div.tw2gui_scrollpane.LTSetsWindow').width(900);
        },
        openFrame: function (iframe, size) {
          LT.GUI.window.setResizeable(true).addClass('nocloseall').clearContentPane().activateTab('LTFrame');
          LT.GUI.window.dontCloseAll = true;
          if (Array.isArray(size))
            LT.GUI.window.setSize(size[0], size[1]);
          var wnd = LT.GUI.window.getMainDiv();
          $('.tw2gui_window_inset', wnd).css('background-image', 'url(' + LTstart.Images('LT_backGr', 1) + ')');
          $('.textart_title', wnd).css('display', 'none');
          var contPan = $(LT.GUI.window.getContentPane());
          contPan.css('margin-top', '-30px');
          new west.gui.Button('QuakeNet Webchat').appendTo(contPan).click(function () {
            var iframe = 'https://webchat.quakenet.org';
            LT.GUI.openFrame(iframe);
          });
          new west.gui.Button('Wiki The-West').appendTo(contPan).click(function () {
            var iframe = Game.helpURL.replace('http:', 'https:');
            LT.GUI.openFrame(iframe);
          });
          new west.gui.Button('TW-DB.info').appendTo(contPan).click(function () {
            var iframe = 'https://tw-db.info';
            LT.GUI.openFrame(iframe);
          });
          if (typeof iframe === 'string')
            contPan.append($('<iframe src="' + iframe + '" style="width:100%; height:94%; border:0; margin-bottom:1px; ">'));
        },
        openSender: function () {
          LT.GUI.getDefault('LTSender');
          var EvImg = EvName == 'Octoberfest' ? 'window/events/octoberfest/pretzels_icon' : 'interface/friendsbar/events/' + EvName;
          LT.GUI.window.setTitle(sendGift.label + '    <img src="images/' + EvImg + '.png">');
          if (!isDefined(WestUi.FriendsBar.friendsBarUi)) {
            WestUi.FriendsBar.toggle();
          }
          setTimeout((function () {
              var e = [],
              t = Chat.Friendslist.getFriends(),
              r = WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations,
              i,
              s,
              u,
              a;
              for (s = 0; s < t.length; s++) {
                i = typeof r[t[s].playerId] !== 'undefined' && r[t[s].playerId][EvName] !== 'undefined' ? r[t[s].playerId][EvName] : 0;
                e.push({
                  n: t[s].pname,
                  i: t[s].playerId,
                  t: i
                });
              }
              e.sort(Sort.create('asc', function (e) {
                  return e.t;
                }));
              i = $('<table align="center" border="1" cellpadding="2px" border="1">');
              for (s = 0; s < e.length; s++) {
                u = e[s].t + parseInt(sendGift.cooldown, 10) - new ServerDate().getTime() / 1000;
                if (u > 0) {
                  a = $('<td>(' + u.formatDurationBuffWay() + ')</td>');
                } else {
                  a = $('<td><a href="#">' + sendGift.label + '</a></td>').click(e[s].i, function (e) {
                      $(this).parent().remove();
                      Ajax.remoteCall('friendsbar', 'event', {
                        player_id: e.handleObj.data,
                        event: EvName
                      }, function (t) {
                        if (t.error)
                          return MessageError(t.msg).show();
                        MessageSuccess(t.msg).show();
                        var n = e.handleObj.data;
                        r[n] = r[n] || {};
                        r[n][EvName] = t.activationTime;
                      });
                    });
                }
                i.append($('<tr>)').append($('<td>' + e[s].n + '</td>'), a));
              }
              var scrollpane = new west.gui.Scrollpane();
              $(scrollpane.getMainDiv()).css({
                'margin-top': '10px',
                'width': '340px',
                'position': 'absolute',
              });
              scrollpane.appendContent(i);
              if (t.length === 0)
                scrollpane.appendContent('<h2 style="text-align: center; color: #a31919; margin-top: 50px;">' + LTlang.noFriends + '</h2>');
              var scrollP = new west.gui.Scrollpane();
              $(scrollP.getMainDiv()).css({
                'margin-top': '10px',
                'margin-left': '345px',
                'width': '353px', //698-345
              });
              if (EvName == 'Hearts' || EvName == 'DayOfDead') {
                var name = '',
                weMmd = west.events.Manager.model._data.events;
                if (EvName == 'Hearts')
                  name = weMmd.valentine.model._data.name;
                else
                  name = weMmd.DayOfDead.model._l10n.ui.mouseover + ' ' + new Date().getFullYear();
                scrollP.appendContent('<h3>' + name + '</h3>');
                //west.events.Manager.getRunningEvents()
                var rew = Game.sesData[EvName].rewards;
                for (var r in rew) {
                  var div = $('<div />');
                  div.append('<img src="images/' + EvImg + '.png">  <b>' + r + '</b><br>' + rew[r].desc + '<br>');
                  var id = rew[r].id;
                  if (isNaN(id)) {
                    div.append('<i>' + LTlang.reward + ': ' + id + '</i><br><br>');
                  } else {
                    var invItem = new tw2widget.JobItem(ItemManager.get(id));
                    div.append(invItem.getMainDiv()).append('<br><br><br><br><br>');
                  }
                  scrollP.appendContent(div);
                }
              }
              $(LT.GUI.window.getContentPane()).append(scrollpane.getMainDiv()).append(scrollP.getMainDiv());
            }), 500);
        },
      };
      LT.RecipeMarket = {
        init: function () {
          var inject = function (category, data) {
            $('.LTFind').remove();
            var gLS4P = Game.InfoHandler.getLocalString4ProfessionId;
            var buttons_recipe = $('<div class="LTFind"><a href=\'javascript:LT.RecipeMarket.filterRecipe(0);\'><img title="' + LTlang.allprofessions + '" alt="allprofessions" src="' + LTstart.Images('LT_recipes') + '" /></a><a href=\'javascript:LT.RecipeMarket.filterRecipe(1);\'><img title="' + gLS4P(1) + '" alt="fieldcook" style="width: 30px;" src="images/items/recipe/recipe_cook.png" /></a><a href=\'javascript:LT.RecipeMarket.filterRecipe(2);\'><img title="' + gLS4P(2) + '" alt="tonicpeddler" style="width: 30px;" src="images/items/recipe/recipe_quack.png" /></a><a href=\'javascript:LT.RecipeMarket.filterRecipe(3);\'><img title="' + gLS4P(3) + '" alt="blacksmith" style="width: 30px;" src="images/items/recipe/recipe_smith.png" /></a><a href=\'javascript:LT.RecipeMarket.filterRecipe(4);\'><img title="' + gLS4P(4) + '" alt="mastersaddler" style="width: 30px;" src="images/items/recipe/recipe_sattle.png" /></a></div>');
            if (category == 'recipe') {
              $('.searchbox').before(buttons_recipe);
              $('.searchbox').css('margin-bottom', '0');
              var items = [];
              for (var i = 0; i < data.length; i++)
                items[i] = ItemManager.get(data[i]);
              items.sort(function (a, b) {
                return a.min_level - b.min_level;
              });
              LT.RecipeMarket.Recipe = items;
              for (var h = 0; h < items.length; h++)
                data[h] = items[h].item_id;
              return data;
            }
            $('.searchbox').css('margin-bottom', '18px');
            return data;
          };
          MarketWindow.Buy.twlt_updateCategory = MarketWindow.Buy.updateCategory;
          MarketWindow.Buy.updateCategory = function (category, data) {
            data = inject(category, data);
            MarketWindow.Buy.twlt_updateCategory.call(this, category, data);
          };
          MarketWindow.getClearName = function (obj) {
            if (obj.type == 'recipe') {
              var name = ItemManager.get(obj.craftitem).name;
              return isDefined(name) ? name : obj.name;
            }
            return obj.name;
          };
        },
        filterRecipe: function (profession_id) {
          var data = $('#mpb_recipe_content p');
          data.show();
          if (profession_id === 0)
            return;
          for (var i = 0; i < LT.RecipeMarket.Recipe.length; i++)
            if (profession_id != LT.RecipeMarket.Recipe[i].profession_id)
              $(data[i]).hide();
        }
      };
      LT.AchievHide = {
        init: function () {
          var hideUnErfolge = function () {
            $('.playerachievement-' + Character.playerId + ' .achievement').hide();
            $('.playerachievement-' + Character.playerId + ' .achievement .achievement_unachieved').parent().show();
          };
          AchievementExplorer.prototype.twlt_updateContent = AchievementExplorer.prototype.updateContent;
          AchievementExplorer.prototype.updateContent = function (data) {
            var tmp = AchievementExplorer.prototype.twlt_updateContent.call(this, data);
            if (data.folder.id != 'overall' && data.folder.id != 'heroics')
              hideUnErfolge();
            return tmp;
          };
        }
      };
      LT.MarketMessage = {
        Towns: {},
        init: function () {
          Ajax.get('map', 'get_minimap', {}, function (json) {
            if (json.error)
              return new UserMessage(json.msg).show();
            LT.MarketMessage.Towns = json.towns;
            EventHandler.listen('position_change', function () {
              LT.MarketMessage.check();
            });
            var setVal2 = setInterval(function () {
                if (Character.position.x) {
                  clearInterval(setVal2);
                  LT.MarketMessage.check();
                }
              }, 1000);
          });
        },
        check: function () {
          var town_id,
          offers,
          bids,
          fetch = function (action) {
            Ajax.remoteCall('building_market', action, {}, function (resp) {
              if (resp.error)
                return new UserMessage(resp.msg).show();
              Character.setDeposit(resp.deposit);
              Character.setMoney(resp.cash);
              return new MessageSuccess(resp.msg).show();
            });
          };
          var fetchAll = function (what) {
            if (what == 1)
              fetch('fetch_town_offers');
            fetch('fetch_town_bids');
            EventHandler.signal('inventory_changed');
          };
          var showDialog = function () {
            new west.gui.Dialog(LTlang.market1, LTlang.market2, west.gui.Dialog.SYS_QUESTION).addButton(LTlang.all, function () {
              fetchAll(1);
            }).addButton(LTlang.onlyBids, function () {
              fetchAll(0);
            }).addButton(LTlang.nothing).show();
          };
          var checkItems = function () {
            for (var g = 0; g < bids.length; g++) {
              var bgs = bids[g];
              if (bgs.market_town_id == town_id && (bgs.auction_ends_in < 0 || bgs.current_bid == bgs.max_price)) {
                showDialog();
                return;
              }
            }
            for (var f = 0; f < offers.length; f++) {
              var ofs = offers[f];
              if (ofs.market_town_id == town_id && (ofs.auction_ends_in < 0 || ofs.current_bid == ofs.max_price)) {
                showDialog();
                return;
              }
            }
          };
          var get_offers = function () {
            Ajax.remoteCall('building_market', 'fetch_offers', {
              page: 0
            }, function (json) {
              offers = json.msg.search_result;
              checkItems();
            });
          };
          var get_bids = function () {
            Ajax.remoteCall('building_market', 'fetch_bids', {}, function (json) {
              bids = json.msg.search_result;
              get_offers();
            });
          };
          var towns = LT.MarketMessage.Towns;
          for (var k in towns)
            if (towns[k].x == Character.position.x && towns[k].y == Character.position.y) {
              town_id = towns[k].town_id;
              var wait = Character.health < 6 ? Character.playerId.toString().substr(-4) : 1;
              setTimeout(function () {
                get_bids();
              }, wait);
            }
        }
      };
      LT.MarketTown = {
        init: function () {
          if (!LT.Skript.getFeature('MarketMessage'))
            Ajax.get('map', 'get_minimap', {}, function (json) {
              if (json.error)
                return new UserMessage(json.msg).show();
              LT.MarketMessage.Towns = json.towns;
            });
          MarketWindow.twlt_showTab = MarketWindow.showTab;
          MarketWindow.showTab = function () {
            MarketWindow.twlt_showTab.apply(this, arguments);
            if (MarketWindow.townId > -1)
              MarketWindow.window.setTitle(MarketWindow.window.titler.text + " - " + LT.MarketMessage.Towns[MarketWindow.townId].name);
          };
        }
      };
      LT.MarkDaily = {
        init: function () {
          var addBorder = function () {
            var rows = $('.reward-row');
            var row = $(rows[4]);
            if (row.hasClass('today'))
              row.css('border', '20px solid red');
          };
          west.player.LoginBonus.prototype.twlt_show = west.player.LoginBonus.prototype.show;
          west.player.LoginBonus.prototype.show = function () {
            var tmp = west.player.LoginBonus.prototype.twlt_show.call(this);
            if (tmp !== undefined)
              return tmp;
            addBorder();
          };
        }
      };
      LT.DuellMap = {
        init: function () {
          var generateNpcPopup = function (data) {
            var weapon = ItemManager.get(data.weaponId),
            damage = weapon.getDamage(data),
            npcData = data.bonus;
            return '<table class="dln_npcskill_popup"><tr><td colspan="5" class="text_bold">' + LTlang.popup + '<br>&nbsp;</td></tr><tr><td><img src="/images/window/duels/npcskill_shot.jpg" /></td><td><img src="/images/window/duels/npcskill_punch.jpg" /></td><td><img src="/images/window/duels/npcskill_aim.jpg" /></td><td><img src="/images/window/duels/npcskill_appearance.jpg" /></td><td></td></tr><tr><td class="text_bold">' + (npcData.shot || 0) + '</td><td class="text_bold">' + (npcData.punch || 0) + '</td>' + '<td class="text_bold">' + (npcData.aim || 0) + '</td><td class="text_bold">' + (npcData.appearance || 0) + '</td><td></td></tr>' + '<tr><td><img src="/images/window/duels/npcskill_tactic.jpg" /></td><td><img src="/images/window/duels/npcskill_reflex.jpg" /></td><td><img src="/images/window/duels/npcskill_dodge.jpg" /></td><td><img src="/images/window/duels/npcskill_tough.jpg" /></td><td><img src="/images/window/duels/npcskill_health.jpg" /></td></tr><tr><td class="text_bold">' + (npcData.tactic || 0) + '</td><td class="text_bold">' + (npcData.reflex || 0) + '</td><td class="text_bold">' + (npcData.dodge || 0) + '</td><td class="text_bold">' + (npcData.tough || 0) + '</td><td class="text_bold">' + (npcData.health || 0) + '</td></tr><tr><td colspan="2" class="text_bold"><img src="' + weapon.image + '" /></td><td colspan="3" class="text_bold"><br>' + weapon.name + '<br>(' + LTlang.damage + ': ' + damage.min + ' - ' + damage.max + ')</td></tr></table>';
          };
          Ajax.remoteCallMode('character', 'get_info', {}, function (resp) {
            Character.setDuelLevel(resp.duelLevel);
          });
          var progB = new west.gui.Progressbar(0, 100);
          progB.setTextOnly(true);
          $(progB.getMainDiv()).css('width', '772px');
          var fillPage = function () {
            $('#LTDuellMapTable').empty();
            $('#LTDuellMapPlayers').empty();
            $('#LTDuellMapTable').append('<tr><th>' + LTlang.name + '</th><th>' + LTlang.town + '</th><th>' + LTlang.level + '</th><th>' + LTlang.duelLevel + '</th><th>' + LTlang.exp + '</th><th>' + LTlang.distance + '</th><th>' + LTlang.startduel + '</th><th>' + LTlang.centerMap + '</th></tr>');
            for (var k in LT.DuellMap.Player) {
              var data = LT.DuellMap.Player[k];
              var content = $('<tr></tr>');
              content.append('<td><a href="javascript:void(PlayerProfileWindow.open(' + data.player_id + '));" title="' + (Character.charClass == 'duelist' ? generateNpcPopup(data).escapeHTML() : '') + '">' + data.player_name + '</a></td>',
                '<td><a href="javascript:void(TownWindow.open(' + data.town_x + ',' + data.town_y + '));">' + data.town_name + '</a></td>',
                '<td>' + data.level + '</td>',
                '<td>' + data.duellevel + '</td>',
                '<td>' + Math.round((7 * data.duellevel - 5 * Character.duelLevel + 5) * Character.duelMotivation * 3) + '</td>',
                '<td>' + window.Map.calcWayTime(Map.getLastQueuePosition(), {
                  x: data.character_x,
                  y: data.character_y
                }).formatDuration() + '</td>',
                '<td><a href="#" onclick="SaloonWindow.startDuel(' + data.player_id + ', ' + data.alliance_id + ', false, DuelsWindow);">' + LTlang.startduel + '</a></td>',
                '<td><a href="#" onclick="Map.center(' + data.character_x + ', ' + data.character_y + ');">' + LTlang.centerMap + '</a></td>');
              $('#LTDuellMapTable').append(content);
              content = $('<div style="position:absolute;border:1px solid black;background:#FF0000;width:4px;height:4px;left:' + (data.character_x / 46592 * 770 - 2) + 'px;top:' + (data.character_y / 20480 * 338 - 2) + 'px;" />');
              eval('content.click(function () { SaloonWindow.startDuel(' + data.player_id + ', ' + data.alliance_id + ', false, DuelsWindow); });');
              content.addMousePopup('<b>' + data.player_name + '</b> ' + window.Map.calcWayTime(Map.getLastQueuePosition(), {
                  x: data.character_x,
                  y: data.character_y
                }).formatDuration());
              $('#LTDuellMapPlayers').append(content);
            }
            $('<div style="position:absolute;border:1px solid black;background:#00CCFF;width:4px;height:4px;left:' + (Character.position.x / 46592 * 770 - 2) + 'px;top:' + (Character.position.y / 20480 * 338 - 2) + 'px;" />').addMousePopup('Deine Position').appendTo('#LTDuellMapPlayers');
          };
          var getPlayer = function (i, distance) {
            if (i == -1) {
              progB.setValue(0);
              LT.DuellMap.Player = {};
              i++;
            }
            Ajax.remoteCall('duel', 'search_op', {
              next: true,
              order_by: 'ASC',
              sort: 'range',
              page: i,
              distance: distance * 60
            }, function (json) {
              var l = json.oplist.pclist.length;
              for (var j = 0; j < l; j++) {
                var plyr = json.oplist.pclist[j].player_name;
                if (!LT.DuellMap.Player[plyr]) {
                  LT.DuellMap.Player[plyr] = json.oplist.pclist[j];
                  progB.increase(1);
                }
              }
              if (json.oplist.next && i < 40) {
                getPlayer(++i, distance);
                return;
              }
              LT.DuellMap.progBVal = progB.getValue();
              fillPage();
            });
          };
          var showTab = function (win, id) {
            DuelsWindow.window.setSize(840, 655).addClass('premium-buy');
            DuelsWindow.window.activateTab(id).$('div.tw2gui_window_content_pane > *').each(function (i, e) {
              if ($(e).hasClass('duels-' + id)) {
                $(e).children().fadeIn();
                $(e).show();
              } else {
                $(e).children().fadeOut();
                $(e).hide();
              }
            });
            DuelsWindow.window.setTitle(LTlang.duelmap);
            if (Object.keys(LT.DuellMap.Player).length === 0) {
              LT.DuellMap.progBVal = 0;
              getPlayer(-1, 15);
            } else
              progB.setValue(LT.DuellMap.progBVal);
          };
          var initDuellmap = function () {
            DuelsWindow.window.addTab(LTlang.duelmap, 'LTDuellmap', showTab);
            LT.DuellMap.Player = {};
            var area = $('<div class="duels-LTDuellmap" style="display:none;"></div>').appendTo(DuelsWindow.window.getContentPane()),
            content = $('<div style="height:350px;top:10px;position:relative"></div>'),
            left = 0,
            top = 0;
            for (var i = 1; i <= 15; i++) {
              var img = $('<img style="position:absolute;border:1px solid #000;width:110px;height:169px;left:' + left + 'px;top:' + top + 'px;" src="images/map/minimap/county_' + i + '.jpg" />');
              left += 110;
              if (i === 7) {
                left = 0;
                top = 169;
              }
              if (i === 4 || i === 11) {
                img.css('height', '114px');
              }
              if (i === 11) {
                img.css('top', top + 55 + 'px');
              }
              if (i === 15) {
                img.css({
                  height: '110px',
                  left: '330px',
                  top: '114px'
                });
              }
              content.append(img);
            }
            content.append('<div id="LTDuellMapPlayers"></div>');
            content.appendTo(area);
            area.append(progB.getMainDiv());
            var scrollpane = new west.gui.Scrollpane().appendTo(area);
            $(scrollpane.getMainDiv()).css('height', '185px');
            scrollpane.appendContent(LTlang.duelradius + '    ');
            var combobox = new west.gui.Combobox().setWidth(120).addItem('15', '15 ' + LTlang.minutes).addItem('30', '30 ' + LTlang.minutes).addItem('60', LTlang.hour).addItem('120', '2 ' + LTlang.hours).addItem('240', '4 ' + LTlang.hours).addItem('360', '6 ' + LTlang.hours).select('15').appendTo(scrollpane.getContentPane());
            new west.gui.Button(LTlang.searchOpp).appendTo(scrollpane.getContentPane()).click(function () {
              getPlayer(-1, combobox.getValue());
            });
            scrollpane.appendContent('<table border="1" id="LTDuellMapTable"></table>');
          };
          DuelsWindow.twlt_open = DuelsWindow.open;
          DuelsWindow.open = function () {
            var tmp = DuelsWindow.twlt_open.call(this);
            if (tmp !== undefined)
              return tmp;
            initDuellmap();
          };
          DuelsWindow.twlt_showTab = DuelsWindow.showTab;
          DuelsWindow.showTab = function (id) {
            var tmp = DuelsWindow.twlt_showTab.call(this, id);
            if (tmp !== undefined)
              return tmp;
            DuelsWindow.window.removeClass('premium-buy').setSize(748, 472);
          };
        }
      };
      LT.ChangeCity = {
        init: function () {
          var swap = function (that) {
            var rows = $('.' + that.window.id + ' .row .cell.cell_2.name,.' + that.window.id + ' .row .cell.cell_2.name_foreign');
            rows.empty();
            for (var i = 0; i <= that.data.length; i++) {
              var player = that.data[i];
              $(rows[i]).append('<span>&nbsp;' + (player.title !== undefined ? player.title : '') + '</span><a href="#" onClick="PlayerProfileWindow.open(' + player.player_id + ')">' + player.name + '</a>');
            }
          };
          CityhallWindow.Residents.twlt_fillContent = CityhallWindow.Residents.fillContent;
          CityhallWindow.Residents.fillContent = function () {
            var tmp = CityhallWindow.Residents.twlt_fillContent.call(this);
            if (tmp !== undefined)
              return tmp;
            swap(this);
          };
        }
      };
      LT.ShowAP = {
        init: function () {
          var addAP = function (that) {
            var job = that.job;
            var getJobFeaturedCls = function () {
              if (LinearQuestHandler.hasTutorialQuest())
                return '';
              if (job.is_gold)
                return 'gold';
              if (job.is_silver)
                return 'silver';
              return '';
            };
            var aps = that.currSkillpoints - that.job.workpoints;
            var jobicon = '<div class="job" title="' + job.get('description').escapeHTML().cutIt(150) + '"><div class="featured ' + getJobFeaturedCls() + '"></div>' + '<img src="images/jobs/' + job.get('shortname') + '.png" class="job_icon" /></div>';
            that.window.setTitle(jobicon + '&nbsp;&nbsp;' + job.get('name').escapeHTML() + ' (' + aps + ' AP)');
          };
          JobWindow.twlt_initView = JobWindow.initView;
          JobWindow.initView = function () {
            var tmp = JobWindow.twlt_initView.call(this);
            if (tmp !== undefined)
              return tmp;
            addAP(this);
          };
        }
      };
      LT.Statusbar = {
        init: function () {
          $('div#ui_windowbar').hide();
          $('div#ui_windowbar_state').hide();
        }
      };
      LT.Logout = {
        init: function () {
          var menu = $('<div class="menulink" onclick="LT.Logout.logout();" title="' + LTlang.logout + '" />').css('background-image', 'url(' + LTstart.Images('logout') + ')').css('background-position', '0px 0px').mouseenter(function () {
              $(this).css('background-position', '-25px 0px');
            }).mouseleave(function () {
              $(this).css('background-position', '0px 0px');
            });
          $('#LT-menu').after(menu);
        },
        logout: function () {
          location.href = 'game.php?window=logout&action=logout&h=' + Player.h;
        },
      };
      LT.MoveJobs = {
        init: function () {
          var st = $('.menulink.lscript')[0].title;
          $('div#ui_bottomright').css('right', '35px');
          $('div.ui_menucontainer').css('margin-bottom', '7px');
          $('div#ui_scripts').remove();
          EscapeWindow.twlt_open = EscapeWindow.twlt_open || EscapeWindow.open;
          EscapeWindow.open = function () {
            EscapeWindow.twlt_open.apply(this, arguments);
            wman.getById('escape').setSize(240, 326);
            $('div.tw2gui_win2.escape div.content div.tw2gui_button')[3].after(new west.gui.Button(st, function () {
                TheWestApi.open();
                wman.getById('escape').destroy();
              }).setMinWidth(175).getMainDiv());
          };
        }
      };
      LT.BlinkEvents = {
        init: function () {
          var setVal7 = setInterval(function () {
              if ($('.border.highlight').length) {
                clearInterval(setVal7);
                $('.border.highlight').remove();
                LT.addStyle('.border.highlight {display:none;}');
              }
            }, 3000);
        }
      };
      LT.FortTracker = {
        init: function () {
          LT.addStyle('.fort_battle_notification {display:none!important;}');
        }
      };
      LT.FriendsPop = {
        init: function () {
          west.notification.ToastOnlineNotification.prototype.show = function () {};
        }
      };
      LT.InstantQuest = {
        init: function () {
          var setVal1 = setInterval(function () {
              if (QuestEmployerView.showQuest) {
                clearInterval(setVal1);
                QuestEmployerView.twlt_showQuest = QuestEmployerView.showQuest;
                QuestEmployerView.showQuest = function (e) {
                  QuestEmployerView.twlt_showQuest(e);
                  if (e.accepted === false) {
                    var req = e.requirements,
                    solvCnt = 0;
                    for (var f = 0; f < req.length; f++)
                      if (req[f].solved === true)
                        solvCnt += 1;
                    if (req.length == solvCnt)
                      $('div.quest_button_area_' + e.id + '').empty().append(new west.gui.Button(LTlang.accNfin, function () {
                          QuestWindow.acceptQuest(e.id);
                          var siVal = setInterval(function () {
                              if (QuestLog.quests[e.id]) {
                                clearInterval(siVal);
                                QuestWindow.finishQuest(e.id);
                              }
                            }, 200);
                        }).getMainDiv());
                  }
                };
              }
            }, 2000);
        }
      };
      LT.QuestWiki = {
        init: function () {
          $.getScript('https://tomrobert.safe-ws.de/repGroups.js').done(function () {
            QuestLog.solvedGroups = {};
            Ajax.remoteCallMode('building_quest', 'get_solved_groups', {}, function (json) {
              for (var sg in json.solved)
                QuestLog.solvedGroups[sg] = json.solved[sg].title;
              QuestLog.twlt_addSolvedQuestGroup = QuestLog.addSolvedQuestGroup;
              QuestLog.addSolvedQuestGroup = function (groupId, questGroup) {
                QuestLog.twlt_addSolvedQuestGroup.apply(this, arguments);
                QuestLog.solvedGroups[groupId] = questGroup.title;
              };
              var lang = Game.locale.substr(0, 2),
              repText = {
                de: ' (Wiederholbare Feiertagsquestreihe)',
                hu: ' (Ismételhető)',
                it: ' (Ripetibile)',
                pt: ' repetível',
                ru: ' - Снова праздник',
              };
              Quest.twlt_render = Quest.render;
              Quest.render = function () {
                Quest.twlt_render.apply(this, arguments);
                var wiki = 'https://wiki.the' + Game.masterURL.match(/the(.*)/)[1] + '/wiki/',
                gid = LT.repGroups[this.id],
                qGroup = QuestLog.solvedGroups[gid] || lang == 'de' && isNaN(gid) && gid,
                groupName = [69, 34].includes(this.group) && qGroup ? qGroup + repText[lang] || '' : this.groupTitle,
                questName = encodeURIComponent((lang == 'pl' ? 'Zadania: ' : '') + groupName + '#' + (lang == 'de' ? this.id : this.soloTitle));
                this.el.find('.quest_description_container .strong').append('<a class="questWiki" style="float:right;" title="' + LTlang.onWiki + '" href="' + wiki + questName + '" target="_blank"><img src="' + LTstart.Images('wiki') + '"/></a>');
              };
            });
          });
        }
      };
      LT.CityTravel = {
        init: function () {
          var setVal3 = setInterval(function () {
              if (west.window.Blackboard.cities.show) {
                clearInterval(setVal3);
                var wwBc = west.window.Blackboard.cities;
                wwBc.twlt_show = wwBc.show;
                wwBc.show = function () {
                  for (var c = 0; c < this.cities_.length; c++)
                    this.cities_[c].member += '<br>' +
                    Map.calcWayTime(Map.getLastQueuePosition(), {
                      x: this.cities_[c].x,
                      y: this.cities_[c].y
                    }).formatDuration();
                  wwBc.twlt_show.apply(this, arguments);
                  $('.cities .city.inlineblock .popup-title').css('margin-top', '-10px');
                };
              }
            }, 2000);
        }
      };
      LT.BetterSheriff = {
        onlyAttackable: false,
        init: function () {
          var columns = [
            'name" style="width:100px;',
            'distance" style="width:70px;',
            'amount" style="width:70px;',
            'not_dead_amount" style="width:70px;',
            'duellevel" style="width:50px;',
            'status" style="width:192px;'
          ], //max 552px
          wanted = [
            'Gesucht', 'Wanted', 'Poszukiwany', 'Gezocht', 'Efterlyst', 'Căutat', 'Procurado', 'Hledán', 'Buscado', 'В розыске', 'Aranıyor', 'Körözött', 'Καταζητείται', 'Eftersøgt', 'Odmena za ulovenie', 'Recherché', 'Ricercato',
          ],
          sortByObj,
          myPos,
          lvl,
          players,
          loadedIDs,
          counter,
          maxCount,
          updateTable = function (data) {
            LT.BetterSheriff.table.clearBody();
            var tmpCells = {};
            for (var i = 0; i < data.length; i++) {
              var rd = data[i];
              if (LT.BetterSheriff.onlyAttackable && !rd.status.includes('.startDuel'))
                continue;
              tmpCells[columns[0]] = '<a title="' + SheriffWindow.createWantedTooltip(rd).escapeHTML() + '" href="javascript:void(PlayerProfileWindow.open(' + rd.player_id + '));"> ' + rd.name + '</a>';
              tmpCells[columns[1]] = rd.distance.formatDuration();
              tmpCells[columns[2]] = format_number(rd.amount);
              tmpCells[columns[3]] = format_number(rd.not_dead_amount);
              tmpCells[columns[4]] = rd.duellevel;
              tmpCells[columns[5]] = '<span title=\'' + rd.status + '\'>' + rd.status + '</span>';
              LT.BetterSheriff.table.buildRow('" style="padding-left:5px;', tmpCells);
            }
          },
          startSortDispatcher = function (ev) {
            var sortBy = ev && (ev.target.tagName == 'SPAN' && ev.target.parentElement.classList[2] || ev.target.classList[2]) || 'distance';
            if (sortByObj == sortBy)
              players.reverse();
            else {
              sortByObj = sortBy;
              switch (sortBy) {
              case 'name':
              case 'status':
                players.sort(function (a, b) {
                  return a[sortBy].toUpperCase().replace(/^Ä/, 'A').replace(/^Ö/, 'O').replace(/^Ü/, 'U').replace(/^É/, 'E').replace(/\(.*?\)/, '') > b[sortBy].toUpperCase().replace(/^Ä/, 'A').replace(/^Ö/, 'O').replace(/^Ü/, 'U').replace(/^É/, 'E').replace(/\(.*?\)/, '') ? 1 : -1;
                });
                break;
              case 'distance':
                players.sort(function (a, b) {
                  return a[sortBy] - b[sortBy];
                });
                break;
              default:
                players.sort(function (a, b) {
                  return b[sortBy] - a[sortBy];
                });
                break;
              }
            }
            updateTable(players);
          },
          setStatus = function (player, string) {
            if (player) {
              player.status = string;
              players.push(player);
            }
            counter++;
            LT.BetterSheriff.progB.increase(1);
            if (counter == maxCount) {
              startSortDispatcher();
              $('div.sheriff-LTSheriff .fancytable .row_head').css('cursor', 'pointer').click(startSortDispatcher);
              $('div.sheriff-LTSheriff', SheriffWindow.DOM).append(LT.BetterSheriff.checkB.getMainDiv());
            }
          },
          loadPlayer = function (arr) {
            if (loadedIDs[arr.player_id])
              setStatus(arr, SaloonWindow.playerStat(loadedIDs[arr.player_id]));
            else
              Ajax.remoteCallMode('profile', 'init', {
                playerId: arr.player_id
              }, function (resp) {
                if (resp.error)
                  return new UserMessage(resp.message).show();
                if (!wanted.includes(resp.status))
                  setStatus(arr, resp.status);
                else if (resp.town) {
                  if (resp.town.town_id == Character.homeTown.town_id)
                    setStatus(arr, LTlang.ownTown);
                  else
                    Ajax.remoteCallMode('building_saloon', 'get_data', {
                      town_id: resp.town.town_id
                    }, function (data) {
                      if (data.error)
                        return new UserMessage(data.msg).show();
                      for (var l = 0; l < data.players.length; l++)
                        loadedIDs[data.players[l].player_id] = data.players[l];
                      setStatus(arr, SaloonWindow.playerStat(loadedIDs[arr.player_id]));
                    });
                } else
                  Ajax.remoteCall('task', 'add', {
                    'tasks': {
                      '0': {
                        'player_id': arr.player_id,
                        'taskType': 'duel'
                      }
                    }
                  }, function (data) {
                    if (data.tasks[0].error)
                      setStatus(arr, data.tasks[0].msg);
                    else {
                      setStatus(arr, SaloonWindow.playerStat({
                          player_id: arr.player_id,
                          holiday_duel: true,
                        }));
                      Ajax.remoteCall('task', 'cancel', {
                        'tasks': {
                          '0': {
                            'queueId': data.tasks[0].task.queue_id,
                            'type': 'duel'
                          }
                        }
                      });
                    }
                  });
              });
          },
          initData = function (pg) {
            Ajax.remoteCall('building_sheriff', 'load_page', {
              page: pg,
            }, function (json) {
              if (json.error) {
                new UserMessage(json.msg).show();
                return null;
              }
              if (pg === 0) {
                maxCount = json.count * 10;
                LT.BetterSheriff.progB.setMaxValue(maxCount);
              }
              for (var j = 0; j < 10; j++) {
                if (json.result[j]) {
                  var res = json.result[j];
                  res.distance = Map.calcWayTime(myPos, {
                      x: res.x,
                      y: res.y
                    });
                  res.not_dead_amount = res.not_dead_amount || 0;
                  if (lvl.min > res.duellevel)
                    setStatus(res, LTlang.tooLow);
                  else if (lvl.max < res.duellevel)
                    setStatus(res, LTlang.tooHigh);
                  else
                    loadPlayer(res);
                } else {
                  setStatus();
                }
              }
              if (pg < json.count - 1)
                initData(++pg);
            });
          },
          tabclick = function (win, id) {
            if (!SheriffWindow.window)
              return;
            SheriffWindow.window.activateTab(id).setTitle('BetterSheriff').$('div.tw2gui_window_content_pane > *', SheriffWindow.DOM).each(function (i, e) {
              if ($(e).hasClass('sheriff-' + id)) {
                $(e).children().fadeIn();
                $(e).show();
              } else {
                $(e).children().fadeOut();
                $(e).hide();
              }
            });
            if (LT.loadedSheriff)
              return;
            LT.loadedSheriff = true;
            myPos = Map.getLastQueuePosition();
            lvl = {
              min: Math.ceil(Character.duelLevel / 1.4),
              max: Math.floor(Character.duelLevel * 1.4 - 0.01)
            };
            players = [];
            loadedIDs = {};
            counter = 0;
            sortByObj = '';
            initData(0);
          },
          initBetterSheriff = function () {
            LT.loadedSheriff = false;
            SheriffWindow.window.addTab('BetterSheriff', 'LTSheriff', tabclick).appendToContentPane($('<div class="sheriff-LTSheriff" style="display:none;width:590px;position:relative;left:50px;"/>'));
            LT.BetterSheriff.table = new west.gui.Table().removeFooter();
            for (var k = 0; k < columns.length; k++)
              LT.BetterSheriff.table.addColumn(columns[k]).appendToThCell('head', columns[k], LTlang.sortBy + ' ' + LTlang[columns[k].split('"')[0]], LTlang[columns[k].split('"')[0]]);
            LT.BetterSheriff.progB = new west.gui.Progressbar(0, null);
            $(LT.BetterSheriff.progB.getMainDiv()).css('width', '587px');
            LT.BetterSheriff.checkB = new west.gui.Checkbox().setLabel('<img src="/images/window/dailyactivity/tasks_icon.png">').setTooltip(LTlang.attackable).setCallback(function (state) {
                LT.BetterSheriff.onlyAttackable = state;
                updateTable(players);
              }).setSelected(LT.BetterSheriff.onlyAttackable, true);
            $(LT.BetterSheriff.checkB.getMainDiv()).css({
              'position': 'absolute',
              'top': '35px',
              'right': '-65px'
            });
            $('div.sheriff-LTSheriff', SheriffWindow.DOM).empty().append(LT.BetterSheriff.table.getMainDiv()).append(LT.BetterSheriff.progB.getMainDiv());
            $('div.sheriff-LTSheriff .fancytable .tw2gui_scrollpane').css('height', '293px');
            Ajax.remoteCallMode('building_saloon', 'get_data', {
              town_id: Character.homeTown.town_id
            }, function (data) {
              if (data.error)
                return new UserMessage(data.msg).show();
              SaloonWindow.self = data.self;
            });
          };
          SheriffWindow.twlt_open = SheriffWindow.open;
          SheriffWindow.open = function (townId, tabId, wanted) {
            SheriffWindow.twlt_open.call(this, townId, tabId, wanted);
            if (townId === Character.homeTown.town_id) {
              initBetterSheriff();
            }
          };
        }
      };
      LT.ChatProfessions = {
        init: function () {
          Chat.Formatter.twlt_formatContactClient = Chat.Formatter.formatContactClient;
          Chat.Formatter.formatContactClient = function (client, room) {
            var cClient = Chat.Formatter.twlt_formatContactClient.call(this, client, room);
            if (client.professionId > -1)
              $(cClient[0].lastChild).prepend($(Chat.Formatter.getProfessionImage(client.professionId)).css('background-color', '#D5C6A2')[0]);
            return cClient;
          };
        }
      };
      LT.QuestBookSearch = {
        init: function () {
          QuestWindowView.clearSearch = function () {
            $('.window-quest_solved .employer_description .questlog_entrie').show();
            $('.window-quest_solved .solved_container .tw2gui_scrollpane_clipper_contentpane').empty();
          };
          QuestWindowView.searchQuest = function (txt) {
            if (txt) {
              txt = txt.toLowerCase();
              var questGroup = new QuestGroup('searchResult', {});
              for (var q in QuestLog.solved_group) {
                var Qq = QuestLog.solved_group[q];
                if (Qq.title.toLowerCase().includes(txt))
                  $('#solved_questgroup_' + q).show();
                else
                  $('#solved_questgroup_' + q).hide();
                for (var r in Qq.quests)
                  if (Qq.quests.hasOwnProperty(r)) {
                    var Qr = Qq.quests[r],
                    idMatch = r == txt;
                    if (Qr.toLowerCase().includes(txt) || idMatch)
                      questGroup.el.append($('<div>').prop({
                          id: 'solved_questgroup_quest_' + r,
                          className: 'questlog_entrie finish'
                        }).append($('<a>').attr({
                            href: '#',
                            className: 'shorten',
                            onclick: s('QuestGroupWindow.open(%1, %2);', q, r)
                          }).text((idMatch ? '#ID ' : '') + Qr)));
                  }
              }
              QuestWindowView.showSolvedGroup(questGroup);
            } else
              QuestWindowView.clearSearch();
          };
          QuestWindowView.twlt_renderGroupSolved = QuestWindowView.renderGroupSolved;
          QuestWindowView.renderGroupSolved = function () {
            QuestWindowView.twlt_renderGroupSolved.apply(this, arguments);
            var textF = new west.gui.Textfield('questbook_search').addListener(QuestWindowView.searchQuest),
            iconB = new west.gui.Iconbutton(new west.gui.Icon('search'), function () {
                QuestWindowView.searchQuest(textF.getValue());
              }),
            icon = new west.gui.Icon('abort').getMainDiv().click(function () {
                textF.setValue('');
                QuestWindowView.clearSearch();
              });
            $('.window-quest_solved .employer_description .quest_splitter').after($('<div id=QuestBookSearch>').append(textF.getMainDiv(), iconB.getMainDiv(), icon));
          };
        }
      };
      LT.MarketRights = {
        init: function () {
          MarketWindow.sellRights = [{
              i: 'town_new',
              t: LTlang.town
            }, {
              i: 'friends',
              t: LTlang.alliance
            }, {
              i: 'welt',
              t: LTlang.worldwide
            }
          ];
          MarketWindow.Sell.twlt_updateTable = MarketWindow.Sell.updateTable;
          MarketWindow.Sell.updateTable = function () {
            MarketWindow.Sell.twlt_updateTable.apply(this, arguments);
            if (Character.homeTown.town_id)
              Ajax.remoteCall('building_market', 'search', {
                visibility: 0
              }, function (json) {
                for (var i = 0; i < json.msg.search_result.length; i++) {
                  var jsr = json.msg.search_result[i];
                  if (jsr.seller_name == Character.name)
                    $('.marketSellsData_' + jsr.market_offer_id + ' .mps_pickup').prepend('<img src="images/icons/' + MarketWindow.sellRights[jsr.sell_rights].i + '.png" title="' + MarketWindow.sellRights[jsr.sell_rights].t + '">');
                }
              });
          };
          MarketWindow.Buy.twlt_updateTable = MarketWindow.Buy.updateTable;
          MarketWindow.Buy.updateTable = function (data) {
            MarketWindow.Buy.twlt_updateTable.call(this, data);
            if (Character.homeTown.town_id)
              for (var i = 0; i < data.length; i++)
                $('#mpb_vendor_' + data[i].market_offer_id).before('<img src="images/icons/' + MarketWindow.sellRights[data[i].sell_rights].i + '.png" title="' + MarketWindow.sellRights[data[i].sell_rights].t + '">');
          };
        }
      };
      LT.EquipManagerPlus = {
        init: function () {
          var current = {};
          var changeSlot = function (slot) {
            var ws = Wear.slots;
            if (slot == ws.length) {
              $('#equip_manager_list').html(EquipManager.buildEquipList());
              new UserMessage(LTlang.saveMessage2, 'success').show();
            } else if (current[ws[slot]])
              Ajax.remoteCall('inventory', 'carry', {
                item_id: current[ws[slot]].obj.item_id,
                last_inv_id: Bag.getLastInvId()
              }, function () {
                changeSlot(++slot);
              });
            else
              Ajax.remoteCall('inventory', 'uncarry', {
                last_inv_id: Bag.getLastInvId(),
                type: ws[slot]
              }, function () {
                changeSlot(++slot);
              });
          };
          var rename = function (equipId, nr, name) {
            if (name.length < 3)
              return new UserMessage(LTlang.longerName).show();
            new UserMessage(LTlang.loading, 'hint').show();
            current = $.extend({}, Wear.wear);
            Ajax.remoteCall('inventory', 'switch_equip', {
              id: equipId,
              last_inv_id: Bag.getLastInvId()
            }, function () {
              Ajax.remoteCall('inventory', 'delete_equip', {
                id: equipId
              }, function () {
                EquipManager.list.splice(nr, 1);
                Ajax.remoteCall('inventory', 'save_equip', {
                  name: name
                }, function (data) {
                  if (data.error)
                    new UserMessage(data.msg).show();
                  else
                    EquipManager.list.unshift(data.data);
                  changeSlot(0);
                });
              });
            });
          };
          EquipManager.renameEquip = function (equipId, nr) {
            var cont = $('<span>');
            var textF = new west.gui.Textfield('equip_rename').maxlength(25).setValue(EquipManager.list[nr].name).getMainDiv();
            cont.append(LTlang.newName + ': ', textF, '<p style="margin-top:10px;color:red;">' + LTlang.renameWarning + '</p>');
            new west.gui.Dialog(LTlang.rename + ': ' + EquipManager.list[nr].name, cont).addButton('ok', function () {
              rename(equipId, nr, $('#equip_rename').val());
            }).addButton('cancel').show();
          };
          EquipManager.twlt_showPopup = EquipManager.showPopup;
          EquipManager.showPopup = function () {
            EquipManager.twlt_showPopup.apply(this, arguments);
            setTimeout(function () {
              $('#max_equip_count').append(' | ' + LTlang.used + ': <span id="equip_used">' + EquipManager.list.length);
            }, 100);
          };
          EquipManager.twlt_buildEquipList = EquipManager.buildEquipList;
          EquipManager.buildEquipList = function () {
            if ($('#equip_used').length > 0)
              $('#equip_used')[0].innerHTML = EquipManager.list.length;
            EquipManager.list.sort(function (a, b) {
              var a1 = a.name.toUpperCase(),
              b1 = b.name.toUpperCase();
              return (a1 == b1) ? 0 : (a1 > b1) ? 1 : -1;
            });
            var html = EquipManager.twlt_buildEquipList().replace(/60%/g, '40%').replace(/20%/g, '15%');
            for (var i = 0; EquipManager.list.length > i; i++) {
              var id = EquipManager.list[i].equip_manager_id;
              html = html.replace('deleteEquip(' + id, 'renameEquip(' + id + ',' + i + ');\'>' + LTlang.rename + '&emsp;</a></td><td width=\'15%\'><a href=\'javascript:EquipManager.deleteEquip(' + id);
            }
            return html;
          };
        }
      };
      LT.ShortPopups = {
        init: function () {
          ItemPopup.twlt_getXHTML = ItemPopup.twlt_getXHTML || ItemPopup.getXHTML;
          ItemPopup.getXHTML = function () {
            var end = '';
            var html = ItemPopup.twlt_getXHTML.call(this).replace(/<br><span class="inventory_popup_requirement_text(.*?)>$/, function (str) {
                end = str;
                return '';
              }).replace('<div class="invPopup_body">', '').replace('inventory_popup"', 'invPopup_body $& style="max-width:385px;"><table><td').replace(/bonus_attr tw_green"/g, '$& style="white-space:nowrap;"').replace('<br><br><div class="item_set_bonus">', end + '</td><td style="padding-left:5px;">');
            if (!html.includes(end))
              html += end;
            return html;
          };
        }
      };
      LT.HideNotis = {
        init: function () {
          var setVal5 = setInterval(function () {
              var WNw = WestUi.NotiBar.work;
              if (WNw) {
                clearInterval(setVal5);
                WNw.setMaxSize(999);
                $('<div class="tw2gui_window_buttons_close" style="position:absolute;left:40px;z-index:2;" title="' + LTlang.removeWorkNotis + '" />').prependTo(WNw.element).click(function () {
                  var l = WNw.list.length;
                  while (l--)
                    if (WNw.list[l].tooltip.includes('job/danger.png'))
                      WNw.removeEntry(WNw.list[l]);
                });
              }
            }, 1000);
        }
      };
      LT.JobProducts = {
        init: function () {
          Map.PopupHandler.twlt_getJobPopup = Map.PopupHandler.twlt_getJobPopup || Map.PopupHandler.getJobPopup;
          Map.PopupHandler.getJobPopup = function (d) {
            var html = Map.PopupHandler.twlt_getJobPopup.apply(this, arguments);
            for (var i in d.yields) {
              var m = ItemManager.get(i);
              html = html.replace('<img src="' + Game.cdnURL + '/images/items/yield/' + m['short'] + '.', '<div class="item"><span class="count" style="display:block;top:29px;left:0px">' + Bag.getItemCount(i) + '</span></div>$&');
            }
            return html;
          };
        }
      };
      LT.MapDistance = {
        init: function () {
          LT.addStyle('div.job_way {left:61px;width:170px;}\n .mpb_distance, .wih_distance, .mpo_distance, .mpw_distance, .mps_distance {width:45px;}\n div.tw2gui_window.marketplace div.fancytable .row > div {text-overflow:unset;}');
          Map.twlt_calcWayTime = Map.twlt_calcWayTime || Map.calcWayTime;
          Map.calcWayTime = function () {
            var time = Map.twlt_calcWayTime.apply(this, arguments);
            this.newDist = time / Game.travelSpeed / Character.speed;
            return time;
          };
          Number.prototype.twlt_formatDuration = Number.prototype.twlt_formatDuration || Number.prototype.formatDuration;
          Number.prototype.formatDuration = function () {
            var dist = '';
            if (Map.newDist)
              dist = ' <small>' + (Math.floor(Map.newDist) / 1000).toFixed(3) + 'mi</small>';
            Map.newDist = 0;
            return Number.prototype.twlt_formatDuration.apply(this, arguments) + dist;
          };
          String.prototype.replaceAll = function () {
            return this.replace(/\D/g, '');
          };
        }
      };
      LT.TraderSell = {
        init: function () {
          var setVal8 = setInterval(function () {
              var wws = west.window.shop;
              if (wws) {
                clearInterval(setVal8);
                LT.addStyle('.focused_new_item_shop .sellIt, .focused_marketplace .auctIt {filter: grayscale(90%)}\n .focused_tailor .not_sellable::after, .focused_gunsmith .not_sellable::after, .focused_general .not_sellable::after, .focused_marketplace .not_auctionable::after {content:"";position:absolute;width:28px;height:28px;right:0;background:url("images/window/shop/shop_icons_sprite.png")no-repeat -167px 0;} .focused_tailor .not_sellable, .focused_gunsmith .not_sellable, .focused_general .not_sellable, .focused_marketplace .not_auctionable {opacity:0.5}');
                var mt = -1,
                itemsToSell = [null, null],
                attr = ['sellable', 'auctionable'],
                className = ['sellIt', 'auctIt'],
                sellItem = function (item) {
                  if (!item.obj[attr[mt]])
                    return this;
                  var inv_id = item.inv_id;
                  if (!itemsToSell[mt][inv_id]) {
                    itemsToSell[mt][inv_id] = item.count;
                    item.divMain[0].classList.add(className[mt]);
                  } else {
                    delete itemsToSell[mt][inv_id];
                    item.divMain[0].classList.remove(className[mt]);
                  }
                },
                setClickH = function () {
                  Inventory.setClickHandler({
                    callback: mt ? MarketWindow.onInventoryClick : wws.handleInventoryClick,
                    context: mt ? MarketWindow : wws,
                    window: mt ? MarketWindow.window : wws.getWindow()
                  });
                },
                exitSell = function (destroy) {
                  if (mt)
                    MarketWindow.onInventoryClick = MarketWindow.twlt_onInventoryClick || MarketWindow.onInventoryClick;
                  else
                    wws.handleInventoryClick = wws.twlt_handleInventoryClick || wws.handleInventoryClick;
                  $.each(itemsToSell[mt], function (invId) {
                    var bgbi = Bag.getItemIdByInvId(invId);
                    if (!bgbi)
                      return delete itemsToSell[mt][invId];
                    Bag.getItemByItemId(bgbi).divMain[0].classList.remove(className[mt]);
                  });
                  itemsToSell[mt] = null;
                  if (destroy)
                    return;
                  setClickH();
                  $(sellButton[mt]).css('filter', 'grayscale(90%)');
                },
                repItems = [
                  3, 201, 302, 325, 603, 802, 10003, 11003,
                ],
                initSell = function () {
                  if (!itemsToSell[mt]) {
                    if (mt) {
                      MarketWindow.twlt_onInventoryClick = MarketWindow.twlt_onInventoryClick || MarketWindow.onInventoryClick;
                      MarketWindow.onInventoryClick = function (item) {
                        if (this.window.currentActiveTabId != 'sell')
                          return false;
                        sellItem(item);
                        return true;
                      };
                    } else {
                      wws.twlt_handleInventoryClick = wws.twlt_handleInventoryClick || wws.handleInventoryClick;
                      wws.handleInventoryClick = function (item) {
                        sellItem(item);
                        return true;
                      };
                    }
                    setClickH();
                    $(sellButton[mt]).css('filter', 'grayscale(0%)');
                    itemsToSell[mt] = {};
                  } else {
                    if (Object.keys(itemsToSell[mt]).length) {
                      var cont = '<div>',
                      money = 0;
                      $.each(itemsToSell[mt], function (invId, count) {
                        var bgbi = Bag.getItemIdByInvId(invId);
                        if (!bgbi)
                          return delete itemsToSell[mt][invId];
                        var bgo = Bag.getItemByItemId(bgbi).obj,
                        bi = bgo.item_base_id;
                        cont += count + 'x ' + LT.GUI.getSetOrItem(bi, bgo, true) + (repItems.includes(bi) ? ' (repeatable quest!)' : '') + '<br>';
                        money += bgo.sell_price * count;
                      });
                      cont += '<br><span class="invPopup_sellicon"/> $' + money + '</span></div>';
                      new west.gui.Dialog(LTlang.sellItems, cont).setDraggable(true).addButton('yes', function () {
                        $.each(itemsToSell[mt], function (inv_id, amount) {
                          if (mt) {
                            var item = Bag.getItemByInvId(inv_id).obj;
                            var params = MarketWindow.Offer.getOfferObject(item.item_id, 0, (item.sell_price || Math.round(item.price / 2)) * amount, amount, 1, 0, 3, '');
                            Ajax.remoteCall('building_market', 'putup', params, function (resp) {
                              if (resp.error)
                                return new UserMessage(resp.msg).show();
                              Character.setMoney(resp.msg.money);
                              Character.setDeposit(resp.msg.deposit);
                              new UserMessage(s('Die Ware wird zum Kauf angeboten, die Gebühr beträgt $ %1', resp.msg.costs), 'success').show();
                            }, MarketWindow);
                          } else
                            wws.requestSell({
                              inv_id: inv_id,
                              count: amount
                            });
                        });
                        itemsToSell[mt] = {};
                        if (mt) {
                          EventHandler.signal('inventory_changed');
                          MarketWindow.Sell.initData();
                        }
                        exitSell();
                      }).addButton('cancel').show();
                    } else
                      exitSell();
                  }
                },
                sellButton = [null, null],
                icon = ['dollar', 'box'],
                addMtButton = function (winmt) {
                  mt = winmt;
                  if (!$('.LT_' + attr[mt] + '_button').length) {
                    sellButton[mt] = new west.gui.Iconbutton(new west.gui.Icon(icon[mt]), initSell).addClass('LT_' + attr[mt] + '_button').getMainDiv();
                    $(sellButton[mt]).css({
                      'position': 'absolute',
                      'left': 0,
                      'z-index': 1,
                      'filter': 'grayscale(90%)'
                    });
                    Inventory.DOM.children('.actions').prepend(sellButton[mt]);
                  }
                };
                wws.twlt_openSellInventory = wws.twlt_openSellInventory || wws.openSellInventory;
                wws.openSellInventory = function () {
                  exitSell(true);
                  wws.twlt_openSellInventory.apply(this, arguments);
                  addMtButton(0);
                };
                /*MarketWindow.twlt_open = MarketWindow.twlt_open || MarketWindow.open;
                MarketWindow.open = function () {
                exitSell(true);
                MarketWindow.twlt_open.apply(this, arguments);
                addMtButton(1);
                };*/
                Inventory.twlt_setClickHandler = Inventory.twlt_setClickHandler || Inventory.setClickHandler;
                Inventory.setClickHandler = function (h) {
                  if (sellButton[mt])
                    $(sellButton[mt]).hide();
                  var win = h && h.window.id,
                  winmt = ['new_item_shop', 'marketplace'].indexOf(win);
                  if (winmt > -1) {
                    mt = winmt;
                    h.callback = mt ? MarketWindow.onInventoryClick : wws.handleInventoryClick;
                    if (sellButton[mt])
                      $(sellButton[mt]).show();
                  }
                  Inventory.twlt_setClickHandler.apply(this, arguments);
                };
                Inventory.twlt_undock = Inventory.twlt_undock || Inventory.undock;
                Inventory.undock = function () {
                  if (itemsToSell[mt])
                    exitSell(true);
                  if (sellButton[mt])
                    sellButton[mt].remove();
                  return Inventory.twlt_undock.apply(this, arguments);
                };
                var tIp = tw2widget.InventoryItem.prototype;
                tIp.twlt_initDisplay = tIp.twlt_initDisplay || tIp.initDisplay;
                tIp.initDisplay = function () {
                  this.twlt_initDisplay.apply(this, arguments);
                  if (!this.obj.auctionable)
                    this.addClass('not_auctionable');
                };
                west.window.shop.trackBuyItem = function () {};
              }
            }, 1000);
        }
      };
      LT.TouchControl = {
        init: function () {
          var fingers = 0,
          wgSbp = west.gui.Scrollbar.prototype;
          wgSbp.twlt_init = wgSbp.twlt_init || wgSbp.init;
          wgSbp.init = function () {
            this.twlt_init.apply(this, arguments);
            var start,
            that = this;
            $(this.divMain).on('touchstart', function (e) {
              start = e.originalEvent.touches[0].clientY;
            }).on('touchmove', function (e) {
              e.stopPropagation();
              e.preventDefault();
              var move = e.originalEvent.changedTouches[0].clientY;
              that.move(move - start);
              start = move;
            });
          };
          var wgSpp = west.gui.Scrollpane.prototype;
          wgSpp.twlt_init = wgSpp.twlt_init || wgSpp.init;
          wgSpp.init = function () {
            this.twlt_init.apply(this, arguments);
            var start,
            coP = this.contentPane,
            clP = this.clipPane,
            vB = this.verticalBar,
            ratio;
            $(this.divMain).on('touchstart', function (e) {
              fingers++;
              start = e.originalEvent.touches[0].clientY;
              ratio = (vB._divPullArea.height() - vB._divPulley.height()) / (clP.height() - coP.height());
            }).on('touchmove', function (e) {
              if (fingers != 1)
                return;
              e.preventDefault();
              var move = e.originalEvent.changedTouches[0].clientY,
              topPos = move - start;
              vB.move(ratio * topPos);
              start = move;
            }).on('touchend', function (e) {
              fingers = 0;
            });
          };
          var start,
          currZoom = 1;
          $('#ui_minimap').on('touchstart', function (e) {
            fingers++;
            start = e.originalEvent.touches[0].clientY;
          }).on('touchmove', function (e) {
            if (fingers != 1)
              return;
            e.preventDefault();
            var move = e.originalEvent.changedTouches[0].clientY,
            cZmb = currZoom + (move - start) / 100;
            if (cZmb >= 0.65 && cZmb <= 5)
              document.getElementById('map').style.zoom = cZmb;
          }).on('touchend', function (e) {
            fingers = 0;
            currZoom = $('#map').css('zoom') * 1;
            Map.resize();
          });
          Map.twlt_getCurrentMid = Map.twlt_getCurrentMid || Map.getCurrentMid;
          Map.getCurrentMid = function () {
            var xy = this.twlt_getCurrentMid.apply(this, arguments);
            return {
              x: xy.x / currZoom,
              y: xy.y / currZoom
            };
          };
          Map.twlt_resize = Map.twlt_resize || Map.resize;
          Map.resize = function () {
            if (!Map.initialized)
              return;
            this.twlt_resize.apply(this, arguments);
            this.width /= currZoom;
            this.height /= currZoom;
          };
          var start2;
          $('#map').on('touchstart', function (e) {
            fingers++;
            var eoEt = e.originalEvent.touches[0];
            start2 = [eoEt.clientX, eoEt.clientY];
          }).on('touchmove', function (e) {
            if (fingers != 1)
              return;
            e.preventDefault();
            var eoEcT = e.originalEvent.changedTouches[0],
            move = [eoEcT.clientX, eoEcT.clientY];
            Map.Drag.scrollby((start2[0] - move[0]) / currZoom, (start2[1] - move[1]) / currZoom);
            start2 = move;
          }).on('touchend', function (e) {
            fingers = 0;
          });
          var wgWp = west.gui.Window.prototype;
          wgWp.twlt_init = wgWp.twlt_init || wgWp.init;
          wgWp.init = function () {
            this.twlt_init.apply(this, arguments);
            var start,
            that = this,
            tdM = that.divMain,
            currPos;
            $('div.tw2gui_inner_window_title', tdM).on('touchstart', function (e) {
              fingers++;
              var eoEt = e.originalEvent.touches[0];
              start = [eoEt.clientX, eoEt.clientY];
              that.bringToTop();
            }).on('touchmove', function (e) {
              if (fingers != 1)
                return;
              e.preventDefault();
              currPos = [tdM.offsetLeft, tdM.offsetTop];
              var eoEcT = e.originalEvent.changedTouches[0],
              move = [eoEcT.clientX, eoEcT.clientY],
              res = [currPos[0] + move[0] - start[0], currPos[1] + move[1] - start[1]];
              if (res[0] > -1) {
                tdM.style.left = res[0] + 'px';
                currPos[0] = res[0];
              }
              if (res[1] > -1) {
                tdM.style.top = res[1] + 'px';
                currPos[1] = res[1];
              }
              start = move;
            }).on('touchend', function (e) {
              fingers = 0;
            });
          };
          LT.addStyle('img {-webkit-touch-callout:none;}');
          var timer,
          timer2,
          wph = west.popup.handler;
          $(document).on('touchstart', function (e) {
            timer = setTimeout(function () {
                wph.handleMouseMove.call(wph, e);
              }, 500);
            timer2 = setTimeout(function () {
                e.ctrlKey = 1;
                LT.CalcTwdb.show(e);
              }, 2000);
          }).on('touchend', function (e) {
            clearTimeout(timer);
            clearTimeout(timer2);
          });
        }
      };
      LT.CalcTwdb = {
        show: function (e) {
          if (!e.ctrlKey && !e.altKey)
            return;
          var t = $(e.target).data();
          var tdi = t.itemId || t.itemid || t.setkey;
          if (!tdi)
            return;
          var add;
          if (e.altKey) {
            add = isNaN(tdi) ? 'supravy&set=' : 'item&id=';
            LT.GUI.open('openFrame', 'https://tw-db.info/?strana=' + add + tdi, [1000, 630]);
            LT.GUI.makeList();
          } else {
            add = isNaN(tdi) ? 'sets/' : 'item/';
            window.open('https://tw-calc.net/' + add + tdi);
          }
        },
        init: function () {
          $(document).click(function (e) {
            LT.CalcTwdb.show(e);
          });
          Inventory.clickHandler = function (item_id, e) {
            var item = Bag.getItemByItemId(item_id);
            if (e.shiftKey || e.ctrlKey || e.altKey)
              return;
            if (this.click && this.click.callback.apply(this.click.context, [item]))
              return;
            if (item.obj.action) {
              $.globalEval(item.obj.action);
              return;
            }
            if (wman.getById(Wear.uid)) {
              Wear.carry(item);
              return;
            }
            return;
          };
        }
        (),
      };
      LT.CollectReminder = function () {
        var setVal4 = setInterval(function () {
            if (window.Bag && Bag.loaded) {
              clearInterval(setVal4);
              var nulls = [];
              for (var y in LT.cooldown) {
                var cdwn = LT.Data.cooldown && LT.Data.cooldown[y] || LT.cooldown[y];
                var item = Bag.getItemsByBaseItemId(y)[0];
                if (cdwn == 1 && item) {
                  var coold = BuffList.cooldowns[item.obj.item_id] && BuffList.cooldowns[item.obj.item_id].time || item.cooldown;
                  var sec = coold * 1000 - new ServerDate().getTime();
                  if (!(sec > 0))
                    nulls.push(item);
                  else if (!LT.cooldownTimer[y])
                    LT.cooldownSetTime(y, [item], sec);
                } else if (cdwn == 0.5 && LT.cooldownTimer[y]) {
                  clearTimeout(LT.cooldownTimer[y]);
                  LT.cooldownTimer[y] = 0;
                }
              }
              if (nulls.length)
                LT.cooldownSetTime(0, nulls, 0);
            }
          }, 2000);
      };
      LT.SkipOpen = function () {
        ItemUse.twlt_use = ItemUse.use;
        ItemUse.use = function (itemId) {
          var baseId = itemId / 1000,
          skips = LT.Data.skipOpen && LT.Data.skipOpen[baseId] || LT.skipOpen[baseId];
          if (skips == 1)
            Ajax.remoteCall('itemuse', 'use_item', {
              item_id: itemId,
              lastInvId: Bag.getLastInvId()
            }, function (res) {
              if (res.error)
                return new UserMessage(res.msg).show();
              var m = res.msg.effects[0],
              widget;
              switch (m.type) {
              case 'lottery':
              case 'content':
                var mi = m.items[0],
                cont = {};
                cont[mi.item_id] = mi.count;
                widget = new tw2widget.Item(ItemManager.get(mi.item_id)).setCount(mi.count).getMainDiv();
                $.get('https://tw-calc.net/service/chest-export', {
                  chest: itemId,
                  count: 1,
                  content: cont,
                  version: Game.version
                }, function () {}, 'jsonp');
                if (ItemUse.twdb)
                  ItemUse.twdb(itemId, res);
                break;
              case 'ses':
                widget = ' <img src="images/icons/' + m.event + '.png" title="' + m.name.escapeHTML() + '" /> ' + m.amount;
                break;
              }
              var mess = $('<div>' + LTlang.skipDone + ':<br></div>').append(widget);
              new UserMessage(mess, 'success').show();
              Bag.updateChanges(res.msg.changes);
              EventHandler.signal('item_used', [itemId]);
            });
          else
            ItemUse.twlt_use.apply(this, arguments);
        };
      };
      LT.Skript.init();
    } else if (location.href.includes('?strana=invent&x=')) {
      var lg = LTstart.langs,
      lang = /lang=([a-z]+)/.exec(document.cookie),
      LTlang = lang && lg.hasOwnProperty(lang[1]) ? lg[lang[1]] : lg.en,
      done = false,
      i = document.getElementsByClassName('bag_empty'),
      wrld = document.getElementById('char_server').textContent,
      saveCounts = {},
      sameWorld = false,
      hide = function (it) {
        saveCounts = {};
        var sameItem = false;
        for (var j of i) {
          var m = j.children[1].innerHTML.match(/,\d,\d,\d,(\d),\d/),
          auct = m ? m[1] == 1 : true,
          id = j.id.slice(1),
          level = id.slice(-1) > 0;
          if (it)
            sameItem = sameWorld ? it[id] : !it[id];
          if (!auct || level || sameItem)
            j.style.display = 'none';
          else if (it && it[id]) {
            var count = j.firstChild.firstChild;
            if (count.textContent > it[id]) {
              saveCounts[j.id] = count.textContent;
              count.textContent = it[id];
            }
          }
        }
        $('.inputV2')[0].style.display = 'none';
      };
      LTstart.compInv = function () {
        if (done) {
          done = false;
          for (var h of i) {
            h.style.display = 'inline-block';
            if (saveCounts[h.id])
              h.firstChild.firstChild.textContent = saveCounts[h.id];
          }
          $('.inputV2')[0].style.display = 'inline-block';
        } else {
          done = true;
          var url = prompt(LTlang.compInv + ': ');
          if (url && url.includes('?strana=invent&x='))
            $.ajax({
              url: url
            }).done(function (data) {
              var regex = /<div id='i(\d+)' class='bag_empty'><span class="pocetx"><span class="pocet_cislox">(\d+)<\/span>/g,
              t,
              items = {},
              world = /id="char_server">(.*?)</.exec(data);
              if (!world) {
                alert('invalid inventory');
                done = false;
              }
              sameWorld = wrld == world[1];
              while (t = regex.exec(data)) {
                var u = sameWorld ? t[1].slice(0, -3) + '000' : t[1];
                items[u] = t[2];
              }
              hide(items);
            }).fail(function () {
              alert(arguments[1] + arguments[2]);
              done = false;
            });
          else {
            sameWorld = false;
            hide();
          }
        }
      };
      $('.inputV2').after('<img src="https://westzz.innogamescdn.com/images/items/yield/pick.png" width="25" style="position:absolute;right:0px;cursor:pointer;" onclick="LTstart.compInv();"/>');
    } else {
      window.onload = function () {
        var lg = LTstart.langs,
        LTlang = lg.hasOwnProperty(location.href.substr(21, 2)) ? lg[location.href.substr(21, 2)] : lg.en;
        Worlds.show = (function () {
          Worlds.twlt_show = Worlds.show;
          return function () {
            Worlds.twlt_show.apply(this, arguments);
            var first = true;
            var plyWrl = Worlds.playerWorlds,
            state = (JSON.parse(localStorage.getItem('TWLTcustom1')) || {}),
            t1 = [],
            t2 = [];
            for (var a in plyWrl) {
              if (plyWrl[a][1] !== null) {
                t1.push(a);
                if (!state[a])
                  state[a] = false;
                else if (state[a] == true)
                  t2.push(a);
              }
            }
            var loginNow = function (t) {
              for (var x = 0; x < t.length; x++) {
                if (first)
                  Auth.login(plyWrl[t[x]]);
                else
                  window.open(location.origin + '#loginWorld' + t[x], '_blank');
                first = false;
              }
            };
            $('#worldsWrapper').append('<div id="loginMore" />');
            $('#loginMore').append('<a id="loginAll" title="' + LTlang.loginAll2 + '" href="#" >' + LTlang.loginAll1 + '</a>').append('<a id="custom" title="' + LTlang.custom2 + '" href="#" >' + LTlang.custom1 + '</a>').append('<img id="cust1" title="' + LTlang.edit + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAFOSURBVDhPY6A6KKnL4j60a2Xf1jWz/6PjQ5unbIUqww3WLpr0Hx0/vXXq/9e39/5fPL4VzAdZAlVOGFw6s9t49sQGsAF/f30GGwLiQ6UJA5Dio7tW/X/z6AIYgwxaNKPr7/1rh6ShSnADkJ/banPB/r9z+QDYIBAfRE9oKf7f2Vz8BKoUE+ydEfj/5Orm/88vb/1fVxwHdjZI88p5zc0gevemRWBxqHJUANP86+Wu/9f3TPu/Y1Yh2NbCskQWkPyiOTmiIM0gw8AakAFI88FFVWCbQYasn5iBVeG0SWWeUCYCLKl1B9sG0gwyZFl73P+99d79UGn8AKQZZBtIM8iQ2XXh2J2IDYA0g2x7cGwZ2JDJpf7E2zwnwwxsG0gzyJCuXC/iNYMAsubGFDvSNIMAyEaQFxoiDf93Vgb3QIWJBwtb3NJANoNoqBAJgIEBAEbiFXTTZGcSAAAAAElFTkSuQmCC"/>');
            $('#selectWorldText').css('margin-bottom', '20px');
            $('#loginAll').css({
              'background-image': 'url("' + LTstart.Images('LT_login') + '")',
              'height': '45px',
              'width': '180px',
              'line-height': '40px',
              'font-weight': 'bold',
              'font-size': '12px',
              'margin-left': '10px',
              'top': '35px',
              'z-index': '1',
              'position': 'absolute',
              'cursor': 'pointer',
            }).mouseenter(function () {
              $(this).css('background-position', '0px -45px');
            }).mouseleave(function () {
              $(this).css('background-position', '0px 0px');
            }).click(function () {
              loginNow(t1);
            });
            $('#custom').css({
              'background-image': 'url("' + LTstart.Images('LT_loginC') + '")',
              'background-repeat': 'no-repeat',
              'height': '36px',
              'width': '144px',
              'text-align': 'left',
              'padding-left': '15px',
              'line-height': '32px',
              'font-weight': 'bold',
              'font-size': '11px',
              'margin-left': '45px',
              'top': '70px',
              'z-index': '1',
              'position': 'absolute',
              'cursor': 'pointer',
            }).mouseenter(function () {
              $(this).css('background-position', '0px -36px');
            }).mouseleave(function () {
              $(this).css('background-position', '0px 0px');
            }).click(function () {
              loginNow(t2);
            });
            $('#cust1').css({
              'margin-left': '160px',
              'top': '78px',
              'z-index': '2',
              'position': 'absolute',
              'cursor': 'pointer',
            }).click(function () {
              var checkB = {},
              checkD = {};
              $('#loginMore').hide();
              $('#allWorlds').empty();
              $('#allWorlds').css('text-align', 'left');
              for (var k = 0; k < t1.length; k++) {
                checkB[t1[k]] = new west.gui.Checkbox().setLabel(Worlds.data[t1[k]].name).setSelected(state[t1[k]]).appendTo($('#allWorlds'));
                $('#allWorlds').append('<br><div style="height:5px;" />');
              }
              var butB = new west.gui.Button(LTlang.save, function () {
                  for (var l in checkB) {
                    checkD[l] = checkB[l].isSelected();
                    localStorage.setItem('TWLTcustom1', JSON.stringify(checkD));
                  }
                  new UserMessage(LTlang.saveMessage2, 'success').show();
                });
              butB.appendTo($('#allWorlds'));
            });
          };
        })();
      };
      if (location.hash.includes('loginWorld')) {
        setTimeout(function () {
          $('#loginButton').click();
          var val = setInterval(function () {
              var u = Worlds.playerWorlds;
              if (Object.keys(u).length !== 0) {
                clearInterval(val);
                Auth.login(u[parseFloat(location.hash.replace(/\D/g, ''))]);
              }
            }, 500);
        }, 1000);
      }
    }
  }
});
