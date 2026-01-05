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
// @version 1.45.4
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/7722/TWLeoTools.user.js
// @updateURL https://update.greasyfork.org/scripts/7722/TWLeoTools.meta.js
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
      version: '1.45.4',
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
          renameWarning: 'Cuando renombre un conjunto, se lo pondrá y se lo quitará de nuevo. <br> ¡Puede perder puntos de vida durante el proceso!',
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
    };
    if (location.href.includes('game.php')) {
      LT = {
        name: 'TWLeoTools',
        author: 'Leotas (updated by Tom Robert)',
        minGame: '2.04',
        maxGame: Game.version.toString(),
        website: 'https://greasyfork.org/scripts/7238',
        updateUrl: 'https://tomrobert.safe-ws.de/sUp.js',
        updateAd: 'http://adf.ly/1OMM8P',
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
        Images: {
          recipe: 'data:image/png;base64,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',
          settings: 'data:image/png;base64,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',
          logout: 'data:image/png;base64,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',
          backGr: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4RHGRXhpZgAATU0AKgAAAAgACgALAAIAAAAmAAAIkgESAAMAAAABAAEAAAEaAAUAAAABAAAIuAEbAAUAAAABAAAIwAEoAAMAAAABAAIAAAExAAIAAAAmAAAIyAEyAAIAAAAUAAAI7odpAAQAAAABAAAJAoglAAQAAAABAAARhuocAAcAAAgMAAAAhgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFdpbmRvd3MgUGhvdG8gRWRpdG9yIDEwLjAuMTAwMTEuMTYzODQAAAAAYAAAAAEAAABgAAAAAVdpbmRvd3MgUGhvdG8gRWRpdG9yIDEwLjAuMTAwMTEuMTYzODQAMjAxNjowMTowNiAxMzo1MDoyNgAABpADAAIAAAAUAAARXJAEAAIAAAAUAAARcJKRAAIAAAADMDAAAJKSAAIAAAADMDAAAKABAAMAAAABAAEAAOocAAcAAAgMAAAJUAAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIwMTY6MDE6MDYgMTI6NDg6NDgAMjAxNjowMTowNiAxMjo0ODo0OAAAAAABAAsAAgAAACYAABGYAAAAAFdpbmRvd3MgUGhvdG8gRWRpdG9yIDEwLjAuMTAwMTEuMTYzODQA/+ExsGh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPjx4bXA6Q3JlYXRvclRvb2w+V2luZG93cyBQaG90byBFZGl0b3IgMTAuMC4xMDAxMS4xNjM4NDwveG1wOkNyZWF0b3JUb29sPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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',
          newImg: 'https://tomrobert.safe-ws.de/new.png',
          wiki: 'https://tomrobert.safe-ws.de/wiki.png',
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
          var menuContainer = $('<div id="LT-menu" class="menulink" onclick="LT.GUI.openSelectbox();" title="' + LT.name + '" />').css('background-image', 'url(' + LT.Images.settings + ')').css('background-position', '0px 0px').mouseenter(function () {
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
          $('.tw2gui_window_inset', LT.GUI.window.getMainDiv()).css('background-image', 'url(' + LT.Images.backGr + ')');
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
              var addItems = function (obj, state) {
                var ob = obj.bonus;
                var boni = {
                  1: ob.item.slice()
                };
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
                  slots: 'item',
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
                speed: [delChar(collect[1]), 'jobs/walk'],
                regen: [delChar(collect[3]), 'jobs/sleep'],
                pray: [delChar(collect[4]), 'jobs/pray'],
                joball: [delChar(collect[0]), 'jobs/build'],
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
          nNew = window.forbid && (isItem && id >= forbid.unlockID || !isItem && forbid.unlock.includes(id)) ? '<img src="' + LT.Images.newImg + '">' : '',
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
        html: {
          body: '',
          right_arm: '',
          animal: '',
          rest: '',
          item: '',
        },
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
                    var NUM = types[i].value[NAM] * (LT.SPEC.includes(NAM) ? 100 : 1);
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
              scrollpane.appendContent('<span class="LTBonusS body" style="width:19%;position:absolute;"><h4>' + LTlang.body + '</h4></span><span class="LTBonusS right_arm" style="width:19%;left:20%;position:absolute;"><h4>' + LTlang.right_arm + '</h4></span><span class="LTBonusS animal" style="width:19%;left:40%;position:absolute;"><h4>' + LTlang.animal + '</h4></span><span class="LTBonusS rest" style="width:19%;left:60%;position:absolute;"><h4>' + LTlang.rest + '</h4></span><span class="LTBonusS item" style="width:20%;right:0;position:absolute;"><h4>' + LTlang.items + '</h4></span>');
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
                  selbox.addItem(j, '<img src=' + (forbid.unlock.includes(j) ? LT.Images.newImg : ItemManager.getByBaseId(sj.items[0]).image) + ' height="20" width="20">' + '<div style="padding-right: 20px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">' + sj.name + '</div>', sj.name);
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
          $('div.tw2gui_window.LT.active_tab_id_BonusSearch').width(990);
          $('div.tw2gui_window.LT.active_tab_id_BonusSearch div.tw2gui_scrollpane.LTSetsWindow').width(830);
        },
        openFrame: function (iframe, size) {
          LT.GUI.window.setResizeable(true).addClass('nocloseall').clearContentPane().activateTab('LTFrame');
          LT.GUI.window.dontCloseAll = true;
          if (Array.isArray(size))
            LT.GUI.window.setSize(size[0], size[1]);
          var wnd = LT.GUI.window.getMainDiv();
          $('.tw2gui_window_inset', wnd).css('background-image', 'url(' + LT.Images.backGr + ')');
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
            var buttons_recipe = $('<div class="LTFind"><a href=\'javascript:LT.RecipeMarket.filterRecipe(0);\'><img title="' + LTlang.allprofessions + '" alt="allprofessions" style="width: 30px;" src="' + LT.Images.recipe + '" /></a><a href=\'javascript:LT.RecipeMarket.filterRecipe(1);\'><img title="' + gLS4P(1) + '" alt="fieldcook" style="width: 30px;" src="images/items/recipe/recipe_cook.png" /></a><a href=\'javascript:LT.RecipeMarket.filterRecipe(2);\'><img title="' + gLS4P(2) + '" alt="tonicpeddler" style="width: 30px;" src="images/items/recipe/recipe_quack.png" /></a><a href=\'javascript:LT.RecipeMarket.filterRecipe(3);\'><img title="' + gLS4P(3) + '" alt="blacksmith" style="width: 30px;" src="images/items/recipe/recipe_smith.png" /></a><a href=\'javascript:LT.RecipeMarket.filterRecipe(4);\'><img title="' + gLS4P(4) + '" alt="mastersaddler" style="width: 30px;" src="images/items/recipe/recipe_sattle.png" /></a></div>');
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
          var menu = $('<div class="menulink" onclick="LT.Logout.logout();" title="' + LTlang.logout + '" />').css('background-image', 'url(' + LT.Images.logout + ')').css('background-position', '0px 0px').mouseenter(function () {
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
                this.el.find('.quest_description_container .strong').append('<a class="questWiki" style="float:right;" title="' + LTlang.onWiki + '" href="' + wiki + questName + '" target="_blank"><img src="' + LT.Images.wiki + '"/></a>');
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
            'Gesucht',
            'Wanted',
            'Poszukiwany',
            'Gezocht',
            'Efterlyst',
            'Căutat',
            'Procurado',
            'Hledán',
            'Buscado',
            'В розыске',
            'Aranıyor',
            'Körözött',
            'Καταζητείται',
            'Eftersøgt',
            'Odmena za ulovenie',
            'Recherché',
            'Ricercato',
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
      (LT.Updater = function () {
        if (!window.scriptRequest) {
          scriptRequest = true;
          $.getScript(LT.updateUrl);
        }
        var intVal = setInterval(function () {
            if (window.scriptUp) {
              scriptUp.c('LT', LTstart.version, LT.name, LT.updateAd, LT.website, LT.lang);
              clearInterval(intVal);
            }
          }, 2000);
      })();
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
              'background-image': 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAABaCAYAAAARg3zAAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAASlVJREFUeF7tfQd4XNWZNgm7mwAmkIIBY4MpCSGbTTaFFCB000lCNYYs1WBsYwPGuHdbtlwlW1axqq0uq7dR76OumdFoZtR7l23JkEL2Tzb5/vc9Z64ks94F4vx5sH7N87zPvXPvueeec773fOWcc++9YPo3/Zv+Tf+mf9O//2e/L7hxIfDPwEXAxcClwGXnEVjeS4AvA18C/gVgfVivLwL/BPD4DOBs139ecbZ6sS6s0z/8Z5CFN2fDskAs4NeAb5wFXwUud+N/SmPg6wDT8JqvAMyX4H+eO9s1k3EFMBO4ErgauBb4JvAD4CfA3cADwMOfUzzkxoMAy3kPcBvA8v8b8K/ATQDrdQ1wg/vYHcD5XK/vAKwL60QZnk22BsgDgnxiR2ZnIB8/888gMnsSM2FmJM/NwO0AC/7rj+FXAI/fD8wDHgF4/ImPYXL6RwGmpZAMsCEeBz5+3cfxpBtPA88CLwGLM5P3VF544Re2xgZusyeGeTckhHg5k8J9nclRR5x+XmudB/escB4P3u/k8ZiQXWqbeMzHmREX7Cw2xTjNucedJaZjaktkJ4aqbWlOFKDPpyNtQqQ3/sf99/RJx5yJkYecCaE6/5iQneoewd4rnfs9luGcj0Lc0d2O+MgDjpgwT0eU/3pHZtRue0Lo+oqH7v/JwXXvPR+xfeMrMb969Pat7no9D7wKvBcXvN12Ptdrx8ZXo3/92B2b3HWi/M4mW4Mf5IHBkZ8B7AgkNy3Xpya2oZF5EU03M5gLkGyvemxamplwdEdvbPCmvsxo376spIC+lGM7+1JjvfpyEvf2bnhvfvbmlfML8xL29Joz/Pry4rcjzS6dJnx3X3F6QF9F7pG+8pzwvrzU4N7CZJ+ea2dfeSAzYVcbiOhZnHKopzI3pM9SerzPnB3Wl5N8qC81cndfctg2lUdW0m61JZLCtvfHBW/ujwna1B8fsnkwIXT7cG7i3r8eD99zqq4wQhwV6dJqyZRWa5Y0ViZIcWagFGcFSHt9oZzorJV2e6F02Iukoz5LnOWhUpd/UGqzd4s5Y7/YS8KloTpCrIU+Upu7X8ozd0pF1l6pL/DGMX+pxL69JFgaSiOk3LRfSjN3ixXnHKVHpNWWpfJl/iOd1Wrfbj4mhSk+Yi+PkRZLqjRUpInDHCN1xRFSW3hMrGp79C/5SV4f5iYd+ENW7J4/ZiXuGcuN3zWYn+w7kJfgNZgQsefE+V6v7Ng9H2Ul7RnNS9g1UJDq11eQ7N2Xe3yrli/knH7cpy8vJaCvJDO8LzPep/d4yJbe1IhdPRlRuzvBv5cBEpsWmd7CpyK1oZlJZqp7mrw7Fr30nGd1QeIH5Zlef8qPXSVVWbvEUuYrlnI/aaqNkTabCQ1qkqaa1D85q2L/3FgZJtb8HVKZvhHn0oFMlabbVSo9jUQZGiRXnJXpUp0X+geLOUhKU31+by0IEXtZtLTWJctwe4X0tZQj3yxpKE8VpzlSmut4L+YFWCnUDAg4TSwQaEXeYTReuHQ6it33MUuPMxeCTYCAgiU/eYuUpHlIReZqKUpcKdXZe6U8Y6eYwt+SxIAFkuA/X0xhr4g5batUpm3Gsecl0f85SfCbL/F+zwLzVRrjWKL/AsmLfh8k8JTM8Nf1uYDnJOvYG1KRtknq8rylMHWbFCSskArTTslP2gTS+EpLbRzqlIn6Z6m6dbtK1FbDNF63Fks82nm9WHI8xFUeJJ3OqVmv5rpodZzn2+vTpLkmQuqLjyh+Vefsl9zY5ajTPnSWlA/iw/2KwcdfAHRJ6AZ/4o/ameynf3sdQN/n+Wefuj+2zOQjaWFvyvHDT0tW5BtSlvq2lKW9I3lxb0lu5CKpL/QQR9khsRUekMrMNZIT8bqYk9eKNXcniM1KH1Caod2aIr1N5dLlyAchE4A4XOMLTXDYDV/132n2k05brHQ2ZAE50mnPxnXmcXQ6snHtcTQgGzFbCbvLnoRr/VQelZk7pDx9m5Sm7YQm8oDw/ZVWyjr2mhJwTsxiSQ9+UeJ8npKUwBdUnUxHX5UsNzJDX1bpeDzlyPPjaRJAgjifJxWYR9ZRnV9W+EJJDnpBHc8IfQnnlqj8jh9+CvXfDC3nJ5Wm3VKWvlNqcvahfkHQsFHSVBkt3Q2J0gMCOM1hYsvfizbbCmxH+VdINvKtSF0/ZevVWLFfbEUHxFKyW4rjV0hR/FJ0vnfc3Foqx33BN5SlwuQpaVGef1m3YkEEOMn4gl7EJ/6onekz02n/HkAHf/W9t80tSD6yQFUw0V1xo2G4n31soZSnUkO8pVCWulyhNnudKnRdznpxFcC05e6Wtsqj0m6Jhmk7pMhuLdjnJrKxnYDTfBgVDgei3AiRxsJgbCdQX+yPns40IdBAG9X9FKBNSlN3SF7sWjTgDtXYxPh5oDRplRJeCTRbRcZWXLNBcqNWSE7ku6pu7LRMV5S0VooB7rMDx6ORWX+my0H6vETkl75FCuPeR+O/LmXI17gH09Tk7IVG2iVVIGMJNGqFaQ9IAHOP+1XgGEGyWgsOSUOBp9SZNo9frxQH2tL4P9XqReTGLlHbrAjNp/Tg/1DlpPLkf+6zXMG7n5VXnns4BZz8PkDF+7/+6G4wCORIA3sA/eZXLvzCFw49fPdNjmT05uLj76rK5YS/AY3wKhp1CczTe+hR76ISa8SMQrJ31WStkar09SC0JrM1Z7vY8naKvQj+WImP1Ji2wk3YJq6ygyBjIMhO4h7G/mGxFfgoMlsLj0ArBeNYiLTA1Wi1xEprzVFN5EoQG1t7iR+0E3p3/iEtVBIaWov71BoFSZulLMNDnbci3/HGTmWDb1dbcyrSpGyC4CB4dWyj5MRrIZenoOFTNkhxyjaFspSN6lhu7FtIs0ayjsMSIW1ZGq6DtipL3YL8kJc7/9I0CBX7tFAsJ+ulyglB03TzP7Ury8yto8RLrHmewC6py96E64w2ZH5Ts17mNHIGSH1HytNWQUuvhnV/U1mcpID5UJQoB3hFQgftfkZefPahdPDyxwCHAv/XHwnNRBzR+C7AkYpVV11xSRLNS1rIK1J0/D2pylivCFuSDA2csw5aF70wBxXJhrYwbUCP3QJsVkSeDGeplzihpV35nuitO7C/W5z5e2CK9qAB9ilCN5b74PgBkBppYcqaKqmFIwGasFA3mYNA8ChproK/XYyGQnqiGoFPVdZu1cDUHDTHldAYBuGtyJP7TEOw8Wm+zfQHQZBSChVCK0ndDuyQ0uR1khsPIcesAt6XbHTc7Nj3JQ8Cz0tYi+s2Kg3GaxSoOVO2Ku1J88v8q7J2jpdJCzpA6svgH8L9MoOQPFZf5CeWgoNiyWVdvFGn/QjS6KatQ/tuQlvCXYMlm6r14rYO5K7J3IL/HmIDSPrSlLel2rROKjNWKYtDNyf8wHxZ/OK8T01o+s8cBJ8N3ApwOGzHFV+fkRvrv1AK4qCdE5aDyMuUeShMeEu5FDQlJHRt9nZFZmvONhQMQWPOVhB/Mwq/XaqxZRr20gb4Uo2lhwAQF4Vnr1WELvUGoKWhwZ3wqZzFB6Wp4giIewxEPoatm9AVAUgXgPN+aCA2FoRaPNlVCUBDe0lVNoQOgdfhmGX83ASoUdjw3FYhAKrI9BRzugeERsHtkPxEkmAHNBixFf83Sj6IUKq03mYQC6YW1zEtr6OPx/+EJh9dKJZv8n394EYFq7rU5aGMIEVDCerDOiFuoLWqhxWz5O1QwrSg8yvNptyxKVov8EIrwK1KKdrBnVq4JsWJy8WcslLxrDBhKbBSUkLflPXLH85w8/MTCc2okZMcHKbjePOLwN6ZV1xelBaNHoSGrMzYgF67Cj4TYFqlNK8iJApXmwUyQ/NaC6kpPCUnwUOOh64B1klc8GpJOroajYSgIH8/XA8vuAsIBvI5LMQG2id29OaGQu16NJpB6lIfaGUSWrsXBhSxS49IY1mgOBEJ24rgoowT+ggQrPZrKVQ0LoU/IfgAseLacSC9Jd8XQjgo1UANBEZNTy1kpkAzoO1g4jlyUJ3NcwekHKhwC5ajPVW0DCBaDa8H6vLc91FlmbiPtcAfOKw0F+vhRPkpfMJegjqjM9vRmSl4K61WHtsGgZS7faZsvdyKzpK9RRHa0NrVptWKawZqcnZLRtxWWbH06U9NaAaEnK6k/3wXwMF8r6tnfrWkOAX+G3t72mqYho0g8gZFZmphVSAWjD0OPa8gdbd4bFooby+ZL5tXvSLbdiySxQufkEWv/VreWvacRIWtQoNux/UICBn5qorRdKLBQOh6BIIORO6NFYHSUh0KUmtC081orIjA/wj1Xx8PQlDI6J+Nzcal0I3/Pu6GPYjGhyAKA3HMX6rQ8FZeU8S0RJBYSyAEM86XhIEIPlIB0hCVAM06jzEfS74/NKOvVCJ/HmcadQ6+vqU0RCzMowj5qXwpaPj46Ki1uSjDeLm08Dlk5TQfVeShy8T4QbcDBA+hN8DvdJo5arQfx9hGU7Re5A+0siI7+UAFCSuvOJZFK78ebtAKqc7cKmWwHh4bnv9MhGZAyCnke4E3gINXzrysLD9xDaLhd4BluMFaRWalnVkYVSD0qvx9khW7RZ5d+KLcetdP5c7775Dn5z8ki998QeY/PU9+/cQ8+cb3b5df3PtzObh7Ofw7BhCa0AwcjEYhqbW5MkirNXOrNVZaEBi2VGv3wwGfzVY0MdzH4SLd4IelyshLBZgABVKOc0jDMW9udVo3IDgSwWGOEJc5HJoP6YhCpCtlWoLE0fs8Z2yZ3lUeKQ1wi6wop7XYyNdXmWgGbNR61Ko14+VC8GuGKa4AWUAgtgE7sAud2QXrZC+Gy4WA2Q5rZcmD5sqFv4lrpmS9xjkE95PIIcCNnAnFmRe3RAqOL5ey5PXitXn+Zyb0t4D7gDeBQyR0XgJHMFZKQfxSyYt5B+ZgLW4KX5kFUeZjr5gz98gbb70ql958q/zrz2+Tl1+8X5a+8aAsePZBRejXX31Avv3T2+SiOd+WBx6eJ/s9liJaZi/WFTcahNCEpu9MvzkCJD6qyN1ac0xaLTH4HyYN1E7s9QXsDHBf0BH0ENGEb6m1D7QIBU+hAC73VhGhDODMWPkxqS8PVYJgEMpzLsAJgVqLw89Iw3NO93nuG0OKDaUQPAnkJlMVylJh4oSHHlojCSbX0Uohw8JQo7kQDDdW+AJBGuU03yBHEdJBwJWm7eqaKVmvcUJzCBdcUvEXib4NAeQG8G2FGoIsT1knhcnbZdv6hX+zhl4EUEMXczaIY41qyC7yXTVhYkEQyB5EMtbl7ZNjvmvkx3fdKZd871753l33yvI358vaTa/JsjcfkrcWPShvLnxAvnvH3XLRt2+Xq66/SV574wlJjEAeedQ2kxoEmCC0blRjyI6TMNx3UpAfu0aDGgZbE4hN06tIz+NIj6BlXDAQvKH5CTuJQChzTQ0DgeO/DURwlIXDB+RwYRQi+SgIPUod13no8jnR6dT1bi1WBTNcgfsqDaYwYYGqAQZ0HGNnxzSGIjmZxC2nmVVanLdC8CSF1shTtF5nEJqu6yRCc/w8ZoniHIdki+HObln/+t/kQ3O12kJg79VXfj2vJAWBwmRCp23FTd0FQSEqTXtl/daVcumPHpYZP35EXnh5gYT6bZTM2LXit3+5rNv6unI5Lv7+/XLRLXfIP191k9wN12PPtkVSkLhNuSu6YahhISQQ2gFC071QRP4YnGigBsBeogMSghqBjc+G5lSstTwMDQftQkFTY7mFqv67hV8PKMGP58MOoQVqLYGAC6nZtHAnQwnenY5wghzUdgo4XkkthvxYFm6pWSthgvmf2pWBk0E6gm1oCJ4jAwym9HAk24WC1wSaivUyUJsDH9rglBuK0FHvqlE1TpqVZXh9JkIboxzXA5xU4Uqv7UDCvLt/2Fae5iFZxxZJdsQyEHqLMjkEb5ybsFWeX/yCzAChv/LTX8rDz86XqKAVkl+1Vw4feFtWbHxdvvVruCO3PgpSz5MvXfddufl735TlbzwtyRGr3P4WGx2CodDQUCRoU2XkWUltNBjdEHsFhEYTB23C2UIbG9JACbRCIUAtxv9Kk/E+WsCKDCodUIZgBnnY4ObYSg0hcww8zL0PVEbhPsY5DVu5JoG1+CjyQ/AFLcbgqgJBFdcgVKBulRQegzZ2OsChzLHWZI3l0JxwmVwwxdRaPE5Y8vcroigikxhTtF5EdfaecT5x4qY2i6MwO9TYedax19VMYV7SBqnO8/tMhDbGobkg6afAc8A6IOKReT931eZ6Qzu/JVnR70oxfGpOibIAHGoxxYHQS36jtPPX73hSbnr8ZVm9ZpEkR++RjdsXyXeeXig3P/GqfOMXTynSf/nmn8vNP/xXWbLwlxLiu06qsumHo/cyYoc7YUPA51T+8zGYMB0YGmZMEzpIrWFQ19AfKz+ChiPJOQXuFqYKeqjtsYXmUFAjAozKCaQhxjWQn9QjqHIgGHKOT7dHYj8MeUcqNNfESIM5GuaanUcLnqZbXU/fs9hfBW7UWmXpHmq8tzxjhxKYMaqgNSYnJPaJqxJkKzwk9ThWTxOshrS8cU4HXRzP5bUc8mI8YTUDU6hedXl7NJkztmkyk1OcGud/ICdutZq15MKoahC8qiBMNqx6+VMTmjOFfOKDy/O4KInrUt8DQh576PaGevht+XErJTscPk3UMimKX6UG4lmQnPitsvDtVxRhb3z8JbnlqYVy/wsvyyvvvCnvrHxZvoP/PPbNXyHNHU/A7bhdbrn1h/Lay/dJgPd7qCAJzSEomlSQFaTWGiQExNXuBYnK0Q01Dg1Cc/FSQwlQHoDzelTESKN8x2IKmY18RGoh1IlInP4nBQ3/riRE6ktAkiKkLUY+ZTDn1Hbw9wzBNlQcVZE+tZw+Fo4yad9TBUxqTJb3C4YP6S/VCNboW1bk7FWTE4SelNivhK/LwOEu+J8l3jDDICvHa2FpGkpAAnTQurz9SujGhEYD2wRlsJcxmJs69ZpM4vL0rbD826Q8daPiVUniGsmNXi5ZUcsV3zj+Xp4T/pnGoUloLvjg1DefLuDi6uVA4CPzbrPXolK50W8r9Z8NTZ0ds1LN8fPmxQga121ZIbPnLZAbH9OENnD3gpfV9vm3X5f5S16Su379mHzz1p/I3fPukGWLnpD4o2vRKCS0W+NSACVn+mI2aAqSdPIxHTmTyNwax/yVBm8CqdWYrFvwRjDDwIVQ9ypDZ4FA65XWCxQ7fFOHGYTBcUcpO40WvKsqEvdnBzomzdUx0lwLjVYbo845KPhiXIetHdvafPqX2qRWwOpQ6BRaeaYnhEkNpScceJ5xQwNnR2GSNfTYO0dvSBBOZNTBxNpJ4DLcB22g7ll+VJWvvijkvKuXkcaYyVQdAxwiyt3rT7glwXPjuMBqieIbV/xxlrQ8N0zWr3zxUxOaPy5O4lpTPirDlXZLgYB5d/2wvihxo/JnssMXw/V4R7JgDujj8ObmlPUSHPC+/OK555XLMfOup+Vb0MaTif3u27+SpYsfl0cfu13un/dTefrJ+2THhteg3TehEdizKRDCFw19RAU29SBsPQjrgK/IQPBMQhO6sSb+Q4AIhLhv5FeL/HQwcwQIVARQ47nFXHtN0xuBe4QpjVYP4dG81hdrwbfUxir/0m6GcMuPoaNEj6OlLlZdR/+yHm6RrZAC81aax5yxU8rSEEQn7VALefLQdpypoxAJbaq94VOinsVeuBcFr+uhhiNRhwbzUbEh33qWsRwBmhmatBJWq4ajEmHwh0OkDv4rRxYqVd0+//UioQ3tzCCyKmuPcl/yEjZIaeo2RWjlcpDQ8Wuhmd+R7KhFitRFSaulKNNHtm1YlAZO/hD4xNV2/HGNKRf2fxvgoy9LAP97fn6TLS34JUkL+o0KCjnSMZnQLAz96E2blskt9z6O4O8x+drtTyhyE5ff+oi88Nw8eeLXd8ptd/4IpL5H3nr9KQnyWYtevgfCQsDA4RwKhCiBUClY5R8z4JsgMX1p7XbQfBL6mD6vtTJnrBycZIAGskBrMRrnZEElzDEFr4WPtBCwrQyAtlMjBuPBFaxCkb8SMLWWCxqPmEwGRRI1woD0KpD1h/mHxoSwKGxjvQR9zUqYWS4son9JwVOYVk4MVXij7oeQrxY668VgmJ3ShvLT53WBzLwvwTFiklKVE0TT7XXkvKkXZ3Wp6StNeqUgr2H8xBV/zM+cvl1xiW5HHjwA8oxj0CR00pHnpSBxq3hsXpwETnLxHJXvJ/7OSuh7f/FvttyYNSDz2/omRNQKyT6+VpMa5oeVjQlaC038stx07xNyyQ8elIv/fZ58+Zs/kS/d+GP5+i0/krvv+aHSzItffVL2bl2kZhbrsj2gBfRqOz2kYwQ2dEEYzfvhvHYrVFBoiVFbNhKhXIzxGUUKTXcKDhfp4SwtdOZZibyruazRLXxq7nEgvYXpx2fbqF1AJAjZINTk/zoNoNJzKjhAqpT5PaiCJy6dpPDZNoYG00L3VubTAl/TiYBpssvEerBOJLQDcQTdCo42GPd2lUfoezJYg8adcKd8z5t6cbhOuy8gNoLJCvzXLpY38oQVgJbOT6B21uu36Q3kRL4NN/cdOeazvPsb37jsXTc/P9UC/7MS+rEHfm6rMu0fJ3NZ0trxBeOsnFGpsnRPOXzwXVn13kvy/PyH5fb77pKf3XMn8AsQ+X75zYJ5snH1cxLiu1YKU2h26Dvraw0iakwEOONwNw4bnes5DFLrY5yBmmhAanWjkZgfTbEh7I+jLMtHilIOiTkHDatGD+BvMrJHPhyXNQTOSQgOk3F4kMfHZ+aYHtdR4KyHErrKG8JyC5/H6VtyW1cCLUbLgzQcxjLKrK2MdpdUUFsajs4MbQwy6mE2jhMHi4Pn4I7QJVCEyz2g7zWpTp/beilCT5azAZJcrw4sSN4oOdHvKW6Zk9e5n5x5VXITNklxRthf3l/2zHFwkk/A/+0a+uH7b7fxIUuD0MXJW5WJ+G+9NMtbylK85KjvKtn0/suy/M2H5a03H1RY9+6Lsmv3ckmJ2gWTowfh9VqMiXFJVpq+snI3EJHT5HL8VJtM3dCGIIjmqnDV+40xWl5PoqtJljMajCMD1NATptkAtU8VhEZfVKc1NNnHBF8BwSN/Y7zbSKPT62tVcAaCsS4UOttHt9HEjJoBuljax3R3QsCYEDFmSVl3DqsZZVDT0uP3nSBHJcpwftQL+xy3ZtozZMSxbT0WzVEQ9cAC9vmQgcG5ouRdYjruLa8ueDQRnDwnlyPgoftvqzdnHYI/g8gTmjk/foty6FnBiUIZ5h2Vh5krSN4viZG7JCFip0JxChd/e6vgwKicsbhIuwe4Ftt6VLQBgqMmUpqK/hyfp8M+tQeFodcqoEHwXweLFBC3FJIeW9VTwnA11Jg2OwaIT59SdQ4K3QdaB4EJI29YBE4c6LUSmvxKoGx03EsPZ0WqNQ/jExxGJ1Ppdb11FL9X+YjcGqaVnVaP1RJ6DbfLbMygTUaI1sBq/BhAUKbrr6et6RawLhxyIxHPu3qxQ4LQXHfjgkvlQllcXChFTOIPrQ6XtubEr9OuR9R7Upy6RwrTQ/7r7cVPxoCTn1pDf3yUg8N2IfPuvcNpzgpDL9kN1b8BAeEq7G9XvUkXgoVhAyCYAUm52Juas6kqDNA+brPxH1sdzOkRCQYKrLRaBmr0XgQ8djQ4yTre0Fy/ga0ma6DUMj20fCPcDlclJwzCcF89scI09dBuDaohEclja3drO15rBCQGKHxNhEPwGVkf+tyc1TqEcqHhVd6I+lE+F3xLVSZ2GCV4XWaShuuOKzJ3Kg1DwRt5sJ14vDaXCsAL+XDmLEhZE5bXibqy/K5yaGbUhwGhhWPInOIuc3dgpFOBm9Kk4ajTsfOuXvWlWs50SdR4NfKpZyDP+ik3k8f1TGRRsodkx60GqddLScpOMef5S1So59C3vj2X7/W4BfhEQn98HPoxYPVll10a5+255kRlTjACv32Sh16TG7sWEed23HSn8lM57MYFRWwYO4IVToZwOWdLbaS010WpCrZypo+LjGrDJ/m+GsZ/vT4DFSuBMNmw/A9Y0QF4nJpJa2CdltD78CdxT75TQucJ84x01GDcJ6nVRIKaMPA9Q+iE0gg00TB7NNWGOWfdaD04qWSBlajLO6T9QE44KKFzKEoLl2O1jPr5xAe1S4VpNwTO5+r0BEJ5hocyqxwRsHNUBz6/rjfK5dbIjjJOdoRKNe7ByQxrIerFc4S7XgSH8FzA+VYvuh4uyNJRwSWoJLS22ExH3lDDW/IPSEnaNrWyLid2leTGbxJzOnz4rCNSnB3GkbRP7XJMninkOB/fYrNl7rWzTepR9IoE3OiAFCZsxg12qfHI8kw+jQAXoURr2QZGxiQ1Goerqwhnpd42VgZIa12kIjQDBa2pzyQ04USDWDmtDdixT8I60AhMQ59ZP5LFtLxGX9dcA0Gj8xhT32xMrcm4Pao0mdI+7qEuBjoaxkA/zZw3BMNhKGobEArnjKBSCRYC4DlLPk0rtReFpRfq1OQcwHkvJVhqMAqbQdM4UnagvfRDrmrMvdhXtRs7qb0kTHVaTjWzzC7UyQ5t21AKjVlE94sLtdCek+rlMnMYLPS8qxdlSfnYSpnuIHhBaH+7qTII+77g0hGpwn35bCInXvLAt4LEfeIsCZe2+gKJDT0UD17SJf5EQk9+ppDvh3sG2H793DlZY3029X4FS26I1MAPrsnerxqG/li9WvBCjQytCt+o3ISGgGZoqg7HMU6t0hXh2DDXwfqgInA1oFEoEE0+bYa06wFzBOGxlzfx0atKTXajAxjQRIbJLQ3U11XCvYA/yBeUGHnVF8NiuPdtZgiKHcXtq3PUg4EOBUph03SWZ+xCR4VpA8ozPN3mVUfeWqB6nw+IcoENiUINqAMYfR23fMlLccp+FTMYKEjks3y7cH6XyofX8REpkoX5lKupf7RRsW4LZxnbIhDtR3/0COofMl6XqVYvghzg00mUK2c1uRpQ++n7pDqdHeqQdNpN4qzJ6fr1o/e/Dl7yNRuf+KIZJuA7OeYAnFp8Clg/e9bM+IocmgwTNGG6tFnSpN0SB6LpYaNKBIckWZslGpHwPokNWSWhPu9JdvweKcsOEnMOJzTQ6MVHUdmDaChv9LwDIHawdFjjpM8CF4Irs1R07CvNIG9X/XFpt8VJiyUGxEYkDiGqSrsX9/Pe1E4WdBAKoQ7aRTeiDlQMrVNp2qWOq+DQmCwAOMlSB1QjALIUwh9HemVO0/jI/nt6+jVtI673UCu/GNmTIFrIfKjTQz3CX5m2SaXjdca9mG9tXpCU5yFfoBxasijZW4rT9PN9JJEOriZcA44Y8Ylq5SLgPJUFhd4Ca9aJtqCrxjH6qVgv5Y4ClHkTrG9VNuXoL40IIPn+FvKtzZomlpLk391/9+1cW8T3xZCn9Cj+159BaLL/3wH60Iv5zrnZ18yMmzPr6oxr51xtunbOLADb2TNNc2ZdYZp99dfU/rVzrjTNnvV108wrLjNd8fXLTFfP/Jpp1tVXADNxnGlnZl0z6xvZ11z19byrr/pawTVXXVF6zawrao75b/pTCfwjbZYipLYoXMpyQqQ0k6/3ChI+XcH3cvANSXyLkqMiVWwl9BsDpKkmHOYZvjL8yebaaAhVm0pjbLQ2F5oKna4s+whITyuCeyA/vpqK737rgtVpteYiwIxD8OQv1bwW5pjvnODLc/Ljlqk1ufxfnvY+zOs72F8n+TEr1fnc2KX64WFYpTITNFPRUWmuS5MuZ9H4K7BYfgvqVJ0bJGUQFNfEWOCXqtep5XPEgOXdi7Ih0IOVsRfTnaC7FAF3LRXIUA82MPCaivViTFCaFSi+e94ZA5+KwI/s2bOuyJg758qk6+fOir7phjmBt9x8467vffdmPkH1I4Bv9fpE7cwfXQ6+045BIX2UOwG+IZIq/n1gwzmC0ekWwAPYDRwEAi++6Euxl1xycdJXZlycNmPGRekzLrkoAzABOTMuvqjokku+XJ0V6/+nysJoCCgVhM6UxupMkNwEP5s9F9qLi9bh+qhnDgF2DK4D5rBVaSai5ny4LLWxaMR0XJ+hXy3myFWvJOuGkGwlifAJ+UotuEfFESABTDcEWp6xXfITtkhh4lrhCw+tsAYFcavUODzPE5yAqEH+xWl+KN9x5F2s8mX+vA/v58B9OdVsLWVH5SQCNCviDZbTKDPrQNQhj9qiFHTUdNQpFtenwwpGT9l6XX7ZjKwZMy6OuvjL/+Lj5sZGYA2wAuBzrfMBDiFzoIKv4P1Uw3X8Ge+141Mr1NIcuqMvzSfAmSFfdXsu4Ot2+YpUdpIFAJ8q5zg3zchaYD1A4m8G+GCBJ0DSB1944YXHv/jFL2YAhddcPbPOWpQkbbZCRODxEGqS2Msz0GhoWDRcsSlIsuJ2IzreJ4VJXlKUBv+yJAnapVQLBML47VCDfDBgV/9HOmvx3yEfDjbIQEulOKtM6oWIfH+es5JWIXscjdUm+HecuIlU79Mz0vQ1F6vrmQ8x0Fqp8ue+vmeuikEcVQkQvB9M9SGUbb9kH9+j9isYiKH87Kx2c5KqR4slXXXYa66+0oZ61xZmHPnrVKrXdddekwa5Ur6rAD4dxffA0CsgV/hMKxUqXV8O0dEN5ptwyU/y9FP96JPwMSyOdJDUVwFc7M9HsvhuaGrtcwELxl7GtdZ8gIDv/uCjXnx+kRUg2HFI/F8CrOArwFsAe+w2YB/gB4QDHGCPm0KIBaKBSIAvJDwKBAH+bvA/z5/t2s8zjHodAwIBL4BamJaf74Hm01F0cTlZQp6Qa3xQm++DJpGplfkkFZeLfipXY/KP7CepqdYnf9qBvYMP0J4L6Ptw0oZv3acF4NtNWegbAXYagg/oslIkPv0lvv2db4F/BDA0O98TzAd4ubR1KoHWivWitmJH5iNwBvif5pdpznbt5xksM8vOelBJcZ09X4nLFy5S/hwmJmk5Q02OkCvkG0lsfM6CM9jk5icGgmf78SJeTLBHECT53wPsKDQbtAIMQNlhWHB2mskdh8RnRWkhSHhqdzYASU7t/vMpCL7Mmy4e39vGeQBaMtaXZpd15vmzXfd5h1Ev1ody5DOrlC3JS/mTC+QFSWvwxOCdwcO/icj/qB8Ld7ZOY8AgvkF6Ep2VZ7A6C+A4OU3RVAQtF+tId4+g4Pmfx8+W/nwBy0/LTC1MBWaQmPL+XJP17/WbTHpWmr3X0Ox0hWiKpiJYN9aRZtbAVKizUSeSmArrc691/xE/g+TTOL8x/Zv+Tf+mf9O/6d/0b/o3/Zv+Tf+mf9O/6d/072w/I3I2hvaMIS5jhvN8AcvL4S0ObXF40phoYL04xMWhLh43xuXPF5ytXsaw3T/8Z5DFGAtmgVhAYwr74zCmLIn/KY2BydOcHGhnvgT/89zZrpmM6Y/Xfz7xSfWa/nj9/wCu6yDO+Hh9rfmo+nh9QbKPvTQjuqE4PdJZbkp0VuWmO4+H73ZGhmxxFqWFO3k8N91fbc2Zx511helOZ22ps7G+CsgDKtV+fWmm+1gJoM/XFpqcJblRzkZrhfsc03Nb5bSU5jlLc2OdxRk6/9x0P9wjwpl8bIcz3G+9+2Pwcc78zEBHce4xR15GgCMvwdNRmxdmL0nfXfHrX91+0HP76xGHDiyLee7pe/7bx+sLU31t53O9fA4sj35h/r2fn4/X+3qtzixOP9xbkOTVV5sf32cpT+orzwroqygM66s3B/Ue2PxK9oHtrxTaS8N622oT+hqLfZDGX6fJDuprqkzq66hP6+uw5fXZq9J7Gyvjem6YO+tATZl/24UXXujZXBXb09mQ0dffUd7XZs3us5VH9lXkHMH13oB/X115gMqLMJt8+otTvPoLEr36S9P2D5akHx62l4T9tTDryKkBZ56MdVnkdyMN8vsTDjndXSFNlkRpssXJh8Md8n8++p18ONKB893ywZBLTrSnS78rQnqdIdJhDZOR1gI50VMow01ROHZMuuwB0m0PlmFnhAw3xktXfQjSpMiJ1kJpt4RJp+2IDOLcqZYU+RD5MV/m/8ePPlD7g+154iqPkZH2UtzfKqNdtXKqvUgGXLnS78iSocZ8bE1/aSiP/NBeEfoHa3HgHy3mwDF7md+go+z4QENZ1GBRduCJ871etuKgj6zmwNGGMv8BV3l8H67tcxV4afnmBPVVl0T3NYBTbbU5fbWlUb1FqYd6K7MCemrygv++H69f+dbrnv1O8wdd9RF/airdLr31/qhMtAx2xMip/lL5/akG+cMpu5wetPzpRK/5z2Nd2TLS7C/dtgPy+5NWwA445KPRPvlojOiXP4w2QyAW6WnI+MMAGr6l+vjvhxpNcqKlUH43VCN/+uik/PHDYVznlNGOGhlF440OlLnz0vjdiXoIuFYG6+Ol0xkl/c4cHO9B3rzHAMrVLB8MV0GwKdJSc0CaqnwhwF3Sat4qPRBkp8VPGvLek5q0F6Q6dYE4Ta9LR623dNm8cew36lhVynPAfLWtTlmAY89jX2+bi7ZIf52/NOQuU+dqUl8QV/ZS6bJ4ybA9XNrqDkpL6Wbk54/67ZPBxjg53W9GuexoCyfKSfS6tw4ARMU51u30UKX0OPbKoM1PxjoycHxq1muM/DlZr859OFInY9354ECiDLZFy4A1RJqK1smAJVhO9NZ9YM5M/vt8vP6VFx+NbbNFiiX7balMelqceW+j0TagB2/EDVdLS95bKISfnGqLkKGmUDTqLmnOWywddZ4yhIJ32dAQjWFywhktvxu0yB9PDwFtEEo1KliBa2LQm6PHMYz/o+2xcnqgCAJ0yB/HGgEXrhkABhUoVDYOO9JHY06gV/0fbopVeXTZfNHw/Nahn7TX+crJ1kSUJVSashZJY+ZCaSx4TxoyXpaKxKfEBiG7ILxG0xvA6wquzFeBheq4FQI10lSDABWJTyowjyamz3wNAl8sdekvSSXyc+LaJpxjPmyvbhDpVFsCtkdQFj8ZsAXLWHuanO4qAIpUuT8CAUY7MqEtg4BDMmQ/LN3WLdKUs0g6rfumbL1Od4bKcHOYDLQGSpt5o7SXv4/jGxW3motW4T7PqLLQWlTnBP5l36aF5/7x+sfum1tgQeVZwZrk+arSzoxX1X82XFM2C7dL2irWSFvlGuyvVxh07VGFHmrcJ2OuIBmpP4IKZMjp3nxo8EgZqveTIVcwzkcBxnYCo+1RSJ8DoIEUTHK6CeC2M1NhpPk4ejrTmCDsA+p+GgekteawNJZ4SG+1jwxZkT8wcX6ftFfvUMJrq9yG/weB/eigG3BsvapbpxWdFulaazylrdZT7TcVr5aq5GcUMVS6wg3SXMVz3tICDdmYtVjla9yDaYasQYC/9Fl9odEOSm9dIITqh/P7gcOAL+rLzhwhJxsDZMDuNX69LgPb0/g/1eq1HmVbqbaOosWKWw3oQCxnFTqN6mDYJ98yw56T5a/88hw/Xn/hFw4988hNDhKaPailbJs05ywFid9AD3of2ChdVpgfKyvP/Y0y4PSU7nqYIpcm85DNR4ZB3hPN8MdaY6W34RB68yEZazsGMqbKGMh7ujMK+1HQ5CC6InQytFImjoG8A2a4M4CbxKe7stT2RMtx9PhQdIoImDAKdT/uj0aEgHvqjkhTxQHpqYXQ4QcOId9uWAvd2ISP2rbWeANsaAreRzos+6WxYif292F/r7TVQHjlhxTaaverY7RKTRUgDdBUuRPCZF4QPITaVuul8mBeTZUU6n4I2QudNwxliEbdWc7D8C2P6XraQlSZh7E91XxUhhoCALh0jgMTbeiawvWCJiY0d3ZIW/kOaYbFIL9q0xbAE6BS3AhCvwJCz5e3Xnrs3D5eP+eqS5Iqk56SepitFvMW6UXF+x2e0lGzDoXaC617GA19WAaw7W/YD4IdRMG9USk3md0YbTkqo9DSY64AOdV0WEabAmXUGQgzFIjzwYrQpzsiZbQRJgjuyWhbPI5Bm3fmA9TOBplh0vpL4H9noIOgoZB+COl77EekBxaADTwIzdEBc9wNjaEaXAkeae1IhzQEG78HDd5RewiaaL8Sansd/NFKvgr2MPb3QNie0li8DdgCbJLG0i3SXOmB9DtV2uaq3WpLdFgOIA/mdVhaq0AwC0wrOrFRpqEGljVBhtuSZKCRH0Lyg3CPwcLEyYgjQkZQthFnODopAjMXrrPtQXAFwjhJGliyqVov5wFF7l4beAN3ahgYdKDz1G4Az/bguAcsg4e4st6QgsgFsnbJQ+f28fpZV16aW5awVJqLN0hr+TrcaB0abb20VqxWhKYpIaH7G6AxSOR6+kn+2D8offyP42qLNOylJ+FLnYavfbotDFobWodpSejWYwC0dCtI3RyKDkDtTVJTG9OlcBO6MwHpkpDmuIxQmDBnQy0TbgoblwLutQXCUoSjkaMQtEw+r9EHjUJhDNQHS681QLpqAyAMXwCCo0mv2KsIQG3UXMVPLPCj+57SWk23xls6a/zVdUzbhuu66wLUf2IQ91f5q/JNvm8cfE50SNSj33kUpvqI8oFPdybBlYpBfVNABGg4p6/02XajfanVAOWOTdF6KV54yyCtNpTiCfBhoMEL7hJ4ZtkOzq1WoDK1mpaL9+bHP/Nn3ThMN/7x+llXfbXIUrBbeu3wj2AqOq3w3Ro8pM/hgQJB+yryBkg/e5gThXMdgSkKkPoSX+GXYs0pnlKSwheY7ETjIDh0hCrNyh477EQvV8JCFIvefbJJux6nOyKgoSPRECCv0tIGmQn8b0uGu5KMRoyBWwIXZZzQSUCm2h9sOAafDYKFFpsQPM7jOoVWAG7NkCtOhqBR+hQgMAiDWq6tVoMmvtcWhLqHKrQDnQ2wCjD/vcp/hGbEdQO4nhhyIHhzsRzu/HkvtQ9CogzUXGMdaSh7ihL+EMp4AuU/3RaFbbRb8NDADrQNLJrRPlO2XiS0A52l/qAitKG1+x074YJ4KL4RfQ1HxFriJR5rPv03VhgQcrqS/vP4x+uvmfW1krZqaOB69HbbTlQUbgV8H0VmamMWiAVjj0PBXNVHxG/vctm48iXx2bZYfH3fljXLnpNVb82X1RtfkkLTVhSQvZEBoVGxcACCAaFHEAieajsO4qZq8hpEppvRmQfkThzrTENDMfqnUNm4FDr8av53gehoVAp1iCMBTanqXA8afkiBaYl0dIhUGWjHefjsQ85I6YRAiC4nhQALwLyYjzMBmjFGupg/jjMN0w80pslgS4YMMo/mDHe+8QDu04Dr7YwLjHJS+LEQfjqCXhNMMDVVKP7zHF0IkgcargVuV3sEOmwIjrGNkNdUrBf5Q6VIspMP3CevwLEBKMkBJ5XoFriUh6QDAWeQ19/+aWT18fprZl1e1lIFP6Zqo7RVrUNv9URB3L4xC0OoXhUs9nwv+Y/lb8nPHrxD7n7sbnnjxcdl9ZrX5LXnH5Hnn31UvvKDB+T+B++WqCBEtGb43Q43oaEdjEYhqU+2UjMbpHVjqFwHh+4RjlPQEMZQFq8bbYcAVYNHSbeRFwVGUCAdOAcNMgBwq9O6QYEDp9rzIYAcaD6kozCbkA6mdAj7Qy4Sh0JNV+d5jGmYfqwjX05iO4RyTRAqRtWLUT+1HrVqn1EuYLgDphjpBxHQsg3YgSn8McQRJ+hytcHvhLUaaoLla4S/iWumZL0MDsF3Hgf/U2m6FWdz8fvSXEp3d49E+Xz67xQahD7j4/UkNIMF+jMt5lWIhNfBX96te5G6MUgJtFsC5d0NK+RL35snt9x9j7y7/F7ZsuY+kPoxRei1790nN915r/zz3B/J408+LuG+a6SjEr2RFR8futPQhKbfTP+ZWhkk5sgGMVCG/5lIQ/MHTdLIng73pYnE5nj2JN9SmUpofwqeQgHY2GqfRGgDWpAXhDbSkYVz7Cz56twYMAqBDjXlnpGG5ziuyvPcN4YUT7ZB8CSQm0zd1HhqCIsCY6flaMBEHYco5M505ENEIo9YIN0NWiiQoxnpEGd02RCf4JopWS+VD2BYbGpoBIXkV7dtP8i8UQ1BdiCYdSGw9dn39t+sodXH66+Z9dXitqq9cDUO6/HIgvXoKXDsrSiM6kHopdDOplgP+dkDD8kFP31GbnnwUdm44jey7+Cbsn39/bJ93b2ycdW9cst9D8gF//aIzPzWd+Sd95+RMpMPrqXZmtQggCY0XQvdqHrIDkKhlsb+KAX5sWs0qGmwtYHYNJE0yeq4W5MZgoHgJ2v/EyQCobQQzCaFj//DuOeptjw50ZqtyjHSXAChF6jjOg9dvlF0OnU9CKKFHiuduO8gBU7Y2Ol0GXsBBnSjELwWMvPJQIeMUfun2thRkRauF60VScGhuSlbr8mEprVW7scB5O2DjrNfGgtXKs51WQ8gUDwiB/et+Jt86PGP18++5oq8tqpgENoXhN7mJrQXKuUuCArRVxckuw7vlC/c9oJccPtvZOHS1yTj+F64FR6SFLJe9h1eKgvgclzwgydBaGxnfU8eeuAuOXrwPWkoPQTzhIqohqGGTYHAEuSUIrQeb/44RoGTwIkW+nO6QakRVOOzodGIQ+1cSwDtQkG3A0rozJ+kxz7SjgDM70SLDmyUCcY5CnOoEQJWkzjuTjUJSvDudASn5YdakefHBM+yKAIAPU5oVJYN2nW0PQXXTdRHWxgteI4MMJjiUKQSsCIztlO1XgTlb4UPbXDKDU1oPQHDSbO2uqOfidDGKMd/+3j9Lx/6aVt3rY80Zi+Txrz3FaFpcrTZOSy2Em9ZuHqhXPDz5+WCe1+Txxe+LsUZm6SxJ0gSQtfLNq9lcu3La+WCO1+SC374lFxw3U/lllu/LRvfXSB1BdvUAhgVxFAwynWIVj7yuLsxqZEmkKFIPNKBAAXB4Zg77TDOKWITyi1BsEjB878SPu/j9repuXicAmvLUBqJQh1uMoTMMXB2Kvf/rkLcxzinMdyhSTDUlI1tFoQcp4KrDrhSAxQ8tt30dxmwsdMBp5Q5pqChyTqiZQyCH4MpptYy/M1h94iDAoQ+VetFMg+AzAafOHHTj20XoMbOs95UM4Ut1Xukx5H4mQhtjENzQdIZH69/8vF7XAOOSGnKh/ovXo/gkDNOnIE6rG6uCL32daWd/+WhRTLrN6tkp+f7UpEXKF5+y+SGhevlulfWypceflMuoBb/7kNyy+3/LuvffUIy4jxlwMLgEL2XEXt7mgyDzKOKyLno9WcjdAbcErd2pj/WkYSG43E9AqKFTo0Fbd+CxkaeQ9AeQ02AGgUhkIYY10Bx6BxpCKBwT9U5KNh87NMHRVBFEvSVqpVoNNeG4E+1wRdlHjT9zfHSgzJ1o4O2VPOl3pzIQPBrQ/2oyUgAlplayh4MAiTJaGOEjODYCIQ91MBhTMQF9jDpgZ/KobN+CHukOQL3gmamdp5C9ep3AIrMh9xk9gY4qsH/h6TJvB332gFSL5FeuCRdrizZv3PZpyY0Zwr5xAeX53FREtelqo/XP/XEvIbB1mQ46NC6Oe9IY/4qaS3f7i7AYakvOSjLNy9XhCWZr39tvTyw5B1ZsmWdbPF4U27Afx6b/eJq+fIDIP73H5Vb7vyZrF5xtyRHbJEBuCxqPJMmFb38JHzk053070wgrnYvziR0Gogeh3NARwLOnzlerXzHFgqZjZws/RDqRCRO/5OChi/ZapKRVpCkGR2pJRH5ubUSNKAh2JMITokJMuQinV5fwq0aA6bgoRUHGuOlF8HaIKd9IVhjMqPPGqD9TQpflQFBHbTXUOtREOmocELpdGc88osEedEG9lAldGNC42QHOjDKcKIVPvAUqtdkEndYDiLPQ+7pdS+lNBsL1wLvw81dLcP1x6SrPuczjUOT0FzwwalvPl0w/vH6J395v72nIQFEXq3UfyM1dekW9FYWxkuaqrzE89B2+epTb8vVL7yvyGvg7sUr1PaVLe/KyxuWyL0vPi033HmnzHvsHtm88ikpz/aQwQYSmhoX7kYzCNqqZ50MDKNhSdLJx0jq052cjZqcVg/3jYHcQ83u8WgIvgeCp89HLcPgRd2rjR3FHeG3pcoJbE+1gTBtDJgY1EDIMMWj3UUy3MIOBBPdWwJtVqw0Gs8rLQbfldsTLdky4IhVQqc57bIHSQuEroRWA8E3QNgcP+YwF0jBuOEkZ0dhkjVY9hQcA5HognEiwwEyNMG1aAHBoG3VPTuyVflGEByed/ViOroanC63hkhr9WG1ToTrTkjkifUi+6CdEa8xIOQKwuzFIPRR6bRnyr7tSz41ofnj4iSuNT3j4/WPP/iz+payPdqfoYYuWCeN0NCNFVy8wt61T9JTtsodi5Yol+OiR5fInJfWnEHsndsel81rH5NnnvmFPPr4bfLycw9KwO5lYi/Zj0YwejgRDQInq8BmBIQdgT92Cr4iA8EJ4hrg1Di1ufE/FYLm6jv6kjq/PgQyXcizE+a4EwInAdR4brNJaTxqqBGYX2q0kWZqtXi1VYLvL5MxCP8E3B4S6TRIcLoHgidwjtcNNeG6dkbzIJP9mNI87dV+au0DTTO3TZV7YDIZ9GjfkT7jkItT+6hncxjuRcHreijBI5g72Z4tw7jvSAvK2K4DtNNd2TIK4o20ZSktPAD/lSMLXapu50G9QGjm01MfIIPQ+Fydx7waK3YjPy6S8lJ8UoSu9AChwbO8t5USbaP7URclPvtXnvvH6x+751u2+oxXxJ72H7iBHkaZTOimykNSV+Qt+73XybcegY+M4O+fH1ykyK1w2wJZ/PLD8h/P3SO/ePAn8uRT82T98gWSGr1LumuOQFgMGAxCA61wP9QsGDQ2/D/tH38cDBppQidPjetZK07DnuIkAzT9IIRNoQ80pkLwSUrwWvicVUOgBM3FqF+N3argSo8IDDfFaUFDa41B440p/1yTgRpuBJpLp4c1oKuEztLngsaEsLhOQgvqMDo74gwLp3ZhhbgOgsLnOHJbCgK1cBntoH88YWW46J2jE8Pwj0nKsQ7ck/cF2A7DLSQby0oXgwF0yvlTL8hlsF6vwlMTL7imH/FTU+VBlV9rjQ/2fdSiqKaSzZpnXH8NQtemvyjOqoPid3DVuX+8/rEHfmhzFe8QV/4arZ15o8INqJiHKoAqTO1hKUrxlK2blsqcX74mF9z6rFzwo6cRAD4gF3znfrns3++RBx/5sbz03EOyeul8Oeq9QuoKvBAQ+sow/C72Zr1yDgJRQ1B0QWBuIYDhpkmkdU+saCJPJjMxoZk5XKSHsyh0PS3ehf80nYbw+X8cSD/I9NBKyt/EeSVoCNkg1OT/Og2gZijpyyZJH8wvNU8XhMVpWgqeptnQYArKRCN4coVC6Jx4MMZsJ8DhyFOII0ZITC6fdd97rCNP35PBnhqyTFYE7kQdz5d6MYBU7gvQhX1CrUtBZ+iCC0P3o6V6lzQWcUKFhAbf8teKC9v0mA3dM2d+7dw/Xv/0L++19VlD3TdYL+01ntJk3BCVY4U42N5ZHSCx0etl15bX5Y0XfyW3PXKf/OThexVeeu4RWfrqg3LY8wXJiPWUlnL0bid9ZzSGDUBDT2AiwNHkxna8YSgAPZoxAWM2ivtIT5eDfqha2kgfky4HoQU+GW22KPXJ4fYGanFqMfibjOyRD4e6DIHTl+QwGUcFeHx8Zo7pOepA7YQ26MF9dd6RELoeEVD1c7gF34R0HJlBGlqliU7J8nMmzR3UNtOPZTDHYTC9hJZDd6d4rpVDaQTihPpQRYrzol6T5g3OAEdJkAeDzJbqvXpJK7jF2UH1tA386OaqvfC5M/6ya+3L5/7x+icfu8/WVRs2TuhGM533s/RS61H4WWGSHbNDDm5dJDvWzVOzhMS+jQslMGSVVOXzWUM9CK/XYuhgg2Cl6SurcVY1dKfHT7UJ1A1tCEKDIyEwo7xGndOY7ENrcGSAGnrCNBvohWbpgdD6VTqC1+r7nSF43Iv3UMNcLJM7jU6vr2Vg1s+pYNSFZlUFTmwjaqTx/DW00CcEz7yNCRHdYfVEh76fLoOalh6/rzFpQo2ccJ7UC/sct2ZaJSNaT+yD0Hr4jiMnXK2pp9b5kIHBueaqALHkR8g7r/7q3D9eD0LXd7HHl2zVrkb5AennInMScbwyhnlHA8D3dZqPijk3QEpz/BVaqsLQCY4hOODIhK6sJrThHiAPXDfCYTv4W9REWlMBTIdrlA/JRueEAsdhcUwHixQQtxSSHltVaZqMjpGrrhuGCdedAyRAI/bAjPYxOodF4MSBXiuhfU0lUJRDjRq4h7NGYP7HJziMTqbSu9sAeXERvvIR+XiS27QOuULgM3KslqDViIDgo5GnocUMIEhj3hwuY94I2tR90D6KcHAL2MnVEB6IeN7ViwCh+dS5flIpXcaaUB64lOPkJtB5BuFbN5PQ5FvhRmmp4SeX0/9r68oXzv3j9b96ZJ6z02aSlspA9Jrd0NDbYHIOoVdxwJyF0MEJ/V6SdBT+mqpINxqsZ5J70K01qg7m0mCCEtBjaY4y1FbNOjG/pgRE4Fpbjze0eyGOJmua9DM9tDzTULCcgBlt1/diGkbqJ1VDZgGI/LHV1yIfuiNuq0BQ+CQCJw60RnOP9To5fsqgFOTp4GiBXvOrysQOowSvy0zS9NtDpbPOT2kYJXiVR7hqpy4c56TDkOso8uHM2UTANMq6qvIzSEOdcW6wmWXIAfHcHZhpGbiB0NTgXBpwvtVrBJ1I3wtKDJ2B+YzAHVGBq3IzWcYI6YMr01wJt0ZNrHhKW5WftDvjJCc9cOi737vh3D5ef/nll8eFBew70WVPgzsRIi1mOOwlHriRjzRV+OtgABqBC4pYWD7nd7I1FQBpe6Ex+xhsoIJcKTcIgZDk7gp/HCdB7BNqhAMNr/w9t5bmOgAcp2bSGphpNfQ+zCbHqgGdF0cE9NAV90lqXqtWjrHzTRK6AvxQBj59tkCYamoatznHMXbQEbpADFIbIuQk/UA1W0ch4HgDBO9gYBMj3XwEqtZfzXx210LY0GIMdGg+22t99bAWfM4T7VwoZPj82Wgr5sUFPJzsyJJe3GNAzfqBzAwAed5dL4JDeGMd+eddveh6jHUmo9woaz0JTYudBHBkh/VFh3SGSlv1QcWvxlJ4BBX7cC/EZ/UJ0mTPkIMH1p3bx+tvvH6uiY+in+yoQAR6TBrL9iP481NPPXTUHZdTTSlyqllPaJxE76SWpeblWgxuT3TGY8vxYrgavTCb/wuhiVFo7iFOa7fhOuyTsKfUEB3PU8MbWp5jqgT2e4vlVF8x9g1roIlvpKcmU9oHml8JlIEOAQ2mBO+Ay1MPf5MWh/8pZJ5zB5VK89HE8pwLvqQiG4WFczxmwzFcT8Eq0wxhNyFoYuBEtFS7BU8huhg8sY3SdfsgKGOn5SSG7qxZIAYUQls6SJeiZkJPoQ1pso16jUGrEudbvShLyme4NVZONofj3DGA/jaI3gEetcXKqRaOqoQKX9Gg1g9VHACCZRSB8O9H2qQwNebcPl5/ww03ZP3lz/8pfMnJYEOq9NbRnwqRAQcbha4CtQZNC0wWtEQ3z9UflbEeaEg0+mgnTCEaaAQR8IiTWw66w9RxhspdQbob1O6nO2GOILxR+FcEZ/yMNGeC1+agAZgXroH2P4GGG0HH4n+dHycSuA+frR3aBppDj6vqmTXCMJs90GDtEBZNm0KNDkw4csOHQanhKGA9KYDjrlAIGmSAr8e1CTS7vI5mub3GD0IPhRCOjoPfMneUHoEC8EdwBaIwwHKhLCQX8mmzhMgIyDfSzBnAOLQN24KzeBy9YWfWE0ZTsV4alKmWNWc1OUw7YENZWDbwrdceLh+dckhfd3vX88/88tw+Xn/dnKvjO2yc83fIbwes6CUW+HIl6FFoyMZY6bYFwZ1AUAbXot8RJmVp28UUuUVsRSHSWp8srfYk6VamLgsaI1x66sLRs+lvwTT1l8qfB8qQVzTAnoqAohtk5VizgS6u19V+9sQYNCpO7cTGg4kapsZBJ+ILV9RYNrZ86Um3DQ2NMg1x+lgFHgx09BMZnGjpbUyGEBNlAD4iB/g7LZyC3Qpw+pWP6fsi6ubKL19NEAiZZnbQBu1h9VLQrw7AvgUm2R4m/c4U3DNdOhwJ2KZhi2C6IlyaqiPUUkv1bCaDKw55QWCEGsevgvtmOyr9aM8BJx9TikH7wMq422Gq1kvJk/zB/ikopi4bXKSGJDkFt3UMLiv59vuTFrheVb974IEH/h4fr7/Q87prr46be92cjOvnzjHdeP0c0/VzZ5uuv/Zq09w5V5qunXOF2r9+7iz8n2madeXXTFfOvNw0++orTHNmX2mao9JciXOzsq6bMzN7zjVX5M2e9Y2Ca2dfWXrtnKtrMhMP/KnZRpckF6TOkz5XjrTYU6Sljq/3QsVwbGygVD4abVBvSBrrqEEP5qKlRFXhEU7zQjuPoZMpU8kGdeoGHbRzyOk4OlW89Lsy0Jja9/wDX13mfl3VbwebZKC5GMHTcUWWQT53B2E2Zb8pzcVrIXRNAr4zotO6CdiD45vV+aai96Ht4J/WofNaYhB4ZciHgxbk2+XO3wFLkwdB5kqPI1Va4ZeqkQd0RJJSjcOznK4glA0WB2b1RDPNL800p7prACgQvl1qitaL7kizNUFiAreMzZ1zVdG113wjG9uMG+fOSrrpxmujb7n5hsDv/9vNu279wffOj4/Xz7j4othLL70k6bKvXJIGpH9lxiUZgOnSGRflXDrj4qIZMy6uthYm/amriS8ZtKIBrPJhr01+N2RHEIie21gKFEBTIRDkky0A10ZzHTAbudUC4dsRaffhXFcdrueryBqBZoCvJOuS4bZKaa6m5qF7lKfGcQctgdAw9OG8EDt4Sp8D5rkRQTEDlfKDOH9EpeEERK89Uxpr4hSB/nCiy50v829U9+N9x/qhZVvTdHkaEPS2cxgSwnWXWdVBgfsWEMECy0RLWCdd9YWqblOxXl+7/NKsSy+dETXj4i////fx+n/64hcLr5s9q26guRqEboeGMAPVaBwryF6kGq7RmijWgmCxF4dBaAhia6NluKUc2qvXLZAmEfmr/PUv/6X+//mj36r/8te/yn/+9qR80F2vXoj4x9OD8kGXFVu+U0/jw7563Ec/PEprodJ02+T//K5HXa/ywY/5MH/+JkjQK6cg/Ja6WJSL5jpUbIXBar8TBGX52VlPtkIbox6/Hbahw9rk2jmz1cfrnXXxf51K9brxhrnTH68Hpj9ef/ZrP8+Y/ng9QOJPf7x+AtMfr9fc/MRA8Gw/XsSLCfYIgiT/e4AdhWaDVoABKDsMC85OM7njkPjGpyamP14//fH6v4nI/6gfC3e2TmPAIL5BehKdlWewOv3x+vMTLP/0x+sBg/DsvYZmpytEUzQVwbqxjjSzBqZCnY06kcRUWJ97rfuP+Bkkn8b5jenf9G/6N/2b/k3/pn/Tv/P3d8EF/xfGq/WyiFk+BwAAAABJRU5ErkJggg==")',
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
              'background-image': 'url("data:image/png;base64,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")',
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
