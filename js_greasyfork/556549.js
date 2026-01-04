// ==UserScript==
// @name         SWDR4 German Translation
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Übersetzt die SWDR4-Oberfläche ins Deutsche (Chat-Nachrichten werden ignoriert)
// @author       Bravura
// @match        https://rj.td2.info.pl/swdr*
// @match        https://rj.td2.info.pl/live*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556549/SWDR4%20German%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/556549/SWDR4%20German%20Translation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Übersetzungstabelle Polnisch -> Deutsch. Kann bei Bedarf erweitert werden.
    const translations = {
        // Menü und Allgemeines
        'Chat': 'Chat',
        'Rozkład jazdy': 'Fahrplan',
        'Blokady liniowe': 'Streckensperren',
        'Chat dyżurnych ruchu': 'Chat der Fahrdienstleiter',
        'Powiadomienia': 'Benachrichtigungen',
        'Nowa wiadomość...': 'Neue Nachricht...',
        'Wyślij': 'Senden',
        'Bezpieczeństwo ruchu kolejowego': 'Eisenbahnbetriebssicherheit',
        'Ostatnie wykolejenie:': 'Letzte Entgleisung:',
        'Ostatnie przejechanie sygnału S1:': 'Letzte Überfahrt des Signals S1:',
        'minut temu': 'Minuten her',
        'godziny temu': 'Stunden her',
        'Nowy rozkład (auto.)': 'Neuer Fahrplan (automatisch)',
        'Nowy rozkład (ręcznie)': 'Neuer Fahrplan (manuell)',
        'Nowe kategorie - pomocnik': 'Neue Kategorien – Assistent',
        'Rozkłady jazdy': 'Fahrpläne',

        // Spaltenüberschriften (Groß- und Kleinschreibung)
        'Przyjazd': 'Ankunft',
        'PRZYJAZD': 'ANKUNFT',
        'Planowo': 'Planmäßig',
        'PLANOWO': 'PLANMÄSSIG',
        'Rzeczyw': 'Tatsächlich',
        'RZECZYW': 'TATSÄCHLICH',
        'Uwagi': 'Bemerkungen',
        'UWAGI': 'BEMERKUNGEN',
        'Rodz': 'Art',
        'RODZ': 'ART',
        'Numer': 'Nummer',
        'NUMER': 'NUMMER',
        'Maszynista': 'Lokführer',
        'MASZYNISTA': 'LOKFÜHRER',
        'Trasa': 'Strecke',
        'TRASA': 'STRECKE',
        'Ze scenerii': 'Von Szene',
        'ZE SCENERII': 'VON SZENE',
        'Przez': 'Über',
        'PRZEZ': 'ÜBER',
        'Do scenerii': 'Zur Szene',
        'DO SCENERII': 'ZUR SZENE',
        'Postój': 'Halt',
        'POSTÓJ': 'HALT',
        'Odjazd': 'Abfahrt',
        'ODJAZD': 'ABFAHRT',
        'Poc. rozpoczyna bieg': 'Zug beginnt Fahrt',
        'POC. ROZPOCZYNA BIEG': 'ZUG BEGINNT FAHRT',
        'Poc. kończy bieg': 'Zug endet Fahrt',
        'POC. KOŃCZY BIEG': 'ZUG ENDET FAHRT',
        'Szlak': 'Strecke',
        'Szlak': 'Strecke',
        'zelektryfikowany': 'elektrifiziert',
        '1-torowy': 'eingleisig',
        'Połącz': 'Verbinden',
        'Region': 'Region',
        'Stan połączenia': 'Verbindungsstatus',
        'Dyżurni on-line': 'Fahrdienstleiter online',
        'Pociągi w trasie': 'Züge unterwegs',
        'Statystyki Ruchu': 'Verkehrsstatistiken',
        'Numer pociągu': 'Zugnummer',
        'Sceneria': 'Szene',
        'Prędkość': 'Geschwindigkeit',
        'Ostatnio aktywny': 'Zuletzt aktiv',
        'Serwer': 'Server',
        'Uruchomione scenerie': 'Gestartete Szenen',
        'on-line': 'online',

        // Einstellungen – allgemeine Texte
        'Ustawienia SWDR': 'SWDR‑Einstellungen',
        'Wygląd': 'Aussehen',
        'Ustawienia dotyczące wyglądu strony': 'Einstellungen zum Seitenlayout',
        'Ustawienie': 'Einstellung',
        'Wartość': 'Wert',
        'Ciemny motyw aplikacji': 'Dunkles Thema der Anwendung',
        'Dźwięki': 'Klänge',
        'Ustawienia dotyczące dźwięków odtwarzanych przez stronę': 'Einstellungen für auf der Seite abgespielte Töne',
        'Powiadomienie': 'Benachrichtigung',
        'Głośność [%]': 'Lautstärke [%]',
        'Odtwórz': 'Abspielen',
        'Dźwięk prywatnej wiadomości (pomiędzy dyżurnymi)': 'Ton für private Nachricht (zwischen Fahrdienstleitern)',
        'Dźwięk prywatnej wiadomości (od maszynisty)': 'Ton für private Nachricht (vom Lokführer)',
        'Dźwięk wywołania selektywnego': 'Ton des Selektivrufs',
        'Dźwięk dzwonka blokady liniowej': 'Ton des Streckensperren‑Klingelns',
        'Dźwięk wiadomości o wykolejeniu': 'Ton der Entgleisungsnachricht',
        'Odtwarzaj dźwięki prywatne od maszynistów': 'Private Töne von Lokführern abspielen',
        'Odtwarzaj dźwięki powiadomienia o zbliżającym się końcu służby': 'Benachrichtigungstöne über das nahende Dienstende abspielen',
        'w każdym przypadku': 'in jedem Fall',

        // Weitere Dropdown-Optionen
        'tylko z rozkładami przez twoje scenerie': 'nur mit Fahrplänen über deine Szenen',
        'Tylko z rozkładami przez twoje scenerie': 'Nur mit Fahrplänen über deine Szenen',
        'TYLKO Z ROZKŁADAMI PRZEZ TWOJE SCENERIE': 'NUR MIT FAHRPLÄNEN ÜBER DEINE SZENEN',
        'Wiadomości na czacie i powiadomienia': 'Nachrichten im Chat und Benachrichtigungen',
        'Ustawienia dotyczące wiadomości na głównym czacie SWDR oraz wyskakujących powiadomień': 'Einstellungen für Nachrichten im Hauptchat von SWDR und Pop‑up‑Benachrichtigungen',
        'Pogrubiaj wywołania maszynistów z nazwami stacji i posterunków na twoich sceneriach:': 'Rufe von Lokführern mit Stations‑ und Postennamen in deinen Szenen fett darstellen:',
        'Pokazuj powiadomienia z prywatnymi wiadomościami od dyżurnych': 'Benachrichtigungen für private Nachrichten von Fahrdienstleitern anzeigen',
        'Pokazuj powiadomienia z prywatnymi wiadomościami systemowymi': 'Benachrichtigungen für private Systemnachrichten anzeigen',
        'Pokazuj powiadomienia z wiadomościami od maszynistów': 'Benachrichtigungen über Nachrichten von Lokführern anzeigen',
        'Lista graczy on-line': 'Liste der Online‑Spieler',
        'Ustawienia dotyczące zarządzania informacjami na listach dyżurnych i pociągów on-line': 'Einstellungen zur Verwaltung der Informationen in den Listen der Fahrdienstleiter und Züge online',
        'Sortowanie listy pociągów': 'Sortierung der Zugliste',
        'Według numeru pociągu': 'Nach Zugnummer',
        'Sortowanie listy dyżurnych': 'Sortierung der Fahrdienstleiterliste',
        'Według nazwy scenerii': 'Nach Szenenname',
        'Ustawienia dotyczące zarządzania informacjami w zakładce z rozkładami jazdy': 'Einstellungen zur Verwaltung der Informationen im Fahrplanreiter',
        'Sortowanie rozkładów jazdy': 'Sortierung der Fahrpläne',
        'Według godziny planowego przejazdu': 'Nach planmäßiger Fahrzeit',
        'Sortowanie scenerii podczas ręcznego tworzenia RJ': 'Sortierung der Szenen beim manuellen Erstellen des Fahrplans',
        'Według statusu dyżurnego': 'Nach Status des Fahrdienstleiters',
        'Sortowanie szlaków podczas ręcznego tworzenia RJ': 'Sortierung der Strecken beim manuellen Erstellen des Fahrplans',
        'Losowo': 'Zufällig',

        // Zusätzliche Sortieroptionen für Dropdowns in den Einstellungen
        'Według nazwy maszynisty': 'Nach Name des Lokführers',
        'WEDŁUG NAZWY MASZYNISTY': 'NACH NAME DES LOKFÜHRERS',
        'Według aktualnej prędkości': 'Nach aktueller Geschwindigkeit',
        'WEDŁUG AKTUALNEJ PRĘDKOŚCI': 'NACH AKTUELLER GESCHWINDIGKEIT',
        'Według dystansu do semafora / końca szlaku': 'Nach Entfernung zum Signal / Streckenende',
        'WEDŁUG DYSTANSU DO SEMAFORA / KOŃCA SZLAKU': 'NACH ENTFERNUNG ZUM SIGNAL / STRECKENENDE',
        'Według sumy kontrolnej pliku': 'Nach Prüfsumme der Datei',
        'WEDŁUG SUMY KONTROLNEJ PLIKU': 'NACH PRÜFSUMME DER DATEI',
        'Według statusu': 'Nach Status',
        'WEDŁUG STATUSU': 'NACH STATUS',
        'Według godziny rzeczywistego przejazdu': 'Nach tatsächlicher Fahrzeit',
        'WEDŁUG GODZINY RZECZYWISTEGO PRZEJAZDU': 'NACH TATSÄCHLICHER FAHRZEIT',
        'Alfabetycznie': 'Alphabetisch',
        'ALFABETYCZNIE': 'ALPHABETISCH',
        'Obsługa blokad liniowych': 'Handhabung der Streckensperren',
        'Automatyczne zwalnianie blokady liniowej EAP, gdy tylko dostępne': 'Automatisches Lösen der EAP‑Streckensperre, sobald verfügbar',
        'Tak, automatycznie naciskaj przycisk Ko, gdy dostępny': 'Ja, drücke automatisch den Ko‑Knopf, wenn verfügbar',
        'Ustawienia chatu': 'Chat‑Einstellungen',
        'Ustawienia dotyczące okna chatu z wiadomościami od innych graczy': 'Einstellungen für das Chatfenster mit Nachrichten anderer Spieler',
        'Automatycznie przewijaj chat do najnowszych wiadomości': 'Chat automatisch zu den neuesten Nachrichten scrollen',
        'Zapisz': 'Speichern',

        // Zusätzliche Tabellenspalten und Buttons
        'Ustaw godzinę zakończenia dla wszystkich twoich scenerii': 'Endzeit für alle deine Szenen festlegen',
        'Dyżurny': 'Fahrdienstleiter',
        'Pociągi': 'Züge',
        'Status': 'Status',
        'DOSTĘPNY DO': 'VERFÜGBAR BIS',
        'Online?': 'Online?',
        'Semafor': 'Signal',
        'Szlak': 'Strecke',
        'Dystans': 'Entfernung',

        // Pop‑up für Dienstende
        'Ustawienie końcowej godziny dyżuru na sceneriach użytkownika': 'Festlegen der Endzeit der Schicht für die Szenen des Benutzers',
        'Status zostanie zmieniony na sceneriach:': 'Status wird für die Szenen geändert:',
        'Godzina zakończenia dyżuru': 'Endzeit der Schicht',
        'Chcę zakończyć dyżur o:': 'Ich möchte die Schicht beenden um:',
        '– przyjmuj rozkłady jazdy tylko do tej godziny!': '– Fahrpläne nur bis zu dieser Uhrzeit annehmen!',
        'Generuj rozkłady jazdy przez moją scenerię bez ograniczeń czasowych - jestem świadom obowiązku obsłużenia wszystkich pociągów w rozkładzie jazdy!': 'Erzeuge Fahrpläne für meine Szene ohne zeitliche Begrenzung – mir ist bewusst, dass ich alle Züge im Fahrplan bedienen muss!',
        'Zamknij': 'Schließen',
        'Ustaw': 'Festlegen',

        // Allgemeine Optionen
        'Tak': 'Ja',
        'Nie': 'Nein'
        ,

        // Optionen für Typ pociągu (Zugtyp) im Generator/Dropdowns
        'pasażerski': 'Personenzug',
        'PASAŻERSKI': 'PERSONENZUG',
        'towarowy': 'Güterzug',
        'TOWAROWY': 'GÜTERZUG',
        'lokomotywa luzem': 'Lokomotive solo',
        'LOKOMOTYWA LUZEM': 'LOKOMOTIVE SOLO',
        'inny': 'Andere',
        'INNY': 'ANDERE'
        ,

        // Neue Übersetzungen für Fahrplan-Generator und Einstellungs-Dropdowns
        'Tworzenie rozkładu jazdy (automatycznie)': 'Fahrplan erstellen (automatisch)',
        'Tworzenie rozkładu jazdy (ręcznie)': 'Fahrplan erstellen (manuell)',
        'Posterunek początkowy:': 'Startbahnhof:',
        'Posterunek początkowy': 'Startbahnhof',
        'Szlak początkowy:': 'Startstrecke:',
        'Szlak początkowy': 'Startstrecke',
        'Typ pociągu:': 'Zugtyp:',
        'Typ pociągu': 'Zugtyp',
        'Kategoria pociągu:': 'Zugkategorie:',
        'Kategoria pociągu': 'Zugkategorie',
        'Typ taboru:': 'Fahrzeugtyp:',
        'Typ taboru': 'Fahrzeugtyp',
        'Max. ilość scenerii:': 'Max. Anzahl an Szenen:',
        'Max. ilość scenerii': 'Max. Anzahl an Szenen',
        'Odjazd za [min]:': 'Abfahrt in [Min]:',
        'Odjazd za [min] :': 'Abfahrt in [Min]:',
        'Prędkość rozkładowa pociągu:': 'Planmäßige Geschwindigkeit des Zuges:',
        'Prędkość rozkładowa pociągu': 'Planmäßige Geschwindigkeit des Zuges',
        'Długość wybranego pociągu [m]:': 'Länge des ausgewählten Zuges [m]:',
        'Długość składu [m]:': 'Zuglänge [m]:',
        'Uwagi dotyczące TWR, towarów niebezpiecznych lub przesyłek nadzwyczajnych': 'Bemerkungen zu TWR, gefährlichen Gütern oder außergewöhnlichen Sendungen',
        'TWR': 'TWR',
        'Towary niebezpieczne': 'Gefährliche Güter',
        'Przesyłki nadzwyczajne': 'Außergewöhnliche Sendungen',
        'Uwaga!': 'Achtung!',
        'Popraw następujące błędy:': 'Beheben Sie die folgenden Fehler:',
        'Wybierz pociąg, dla którego chcesz przygotować rozkład': 'Wählen Sie den Zug, für den Sie den Fahrplan erstellen möchten',
        'Przebieg trasy': 'Streckenverlauf',
        'DODAJ TRASĘ': 'Route hinzufügen',
        'RESETUJ TRASĘ': 'Route zurücksetzen',
        'ODŚWIEŻ TRASĘ': 'Route aktualisieren',
        'Posterunek początkowy trasy': 'Startbahnhof der Strecke',
        'Posterunek końcowy trasy': 'Endbahnhof der Strecke',
        'Generuj rozkład jazdy': 'Fahrplan generieren',

        // Übersetzungen für den Kategorie‑Assistenten
        'Pomocnik kategorii': 'Kategorie‑Assistent',
        'Jak dobrać kategorię?': 'Wie wählt man eine Kategorie?',
        'Relacje pasażerskie:': 'Kategorien für Personenzüge:',
        'Relacje pasażerskie': 'Kategorien für Personenzüge',
        'Relacje towarowe:': 'Kategorien für Güterzüge:',
        'Relacje towarowe': 'Kategorien für Güterzüge',
        'Relacje lokomotywami luzem:': 'Kategorien für Lokomotiven ohne Wagen:',
        'Relacje lokomotywami luzem': 'Kategorien für Lokomotiven ohne Wagen',
        'Pozostałe relacje:': 'Weitere Kategorien:',
        'Pozostałe relacje': 'Weitere Kategorien',
        'osobowe': 'Personenzüge',
        'pospieszne': 'Eilzüge',
        'ekspresowe': 'Expresszüge',
        'próżne': 'Leerzüge',
        'masowe': 'Massengüterzüge',
        'niemasowe': 'Stückgut',
        'niesamowe': 'Stückgut',
        'intermodalne': 'Intermodal',
        'do obsługi stacji i bocznic': 'Zur Bedienung von Bahnhöfen und Anschlüssen',
        'próbne': 'Probefahrt',
        'próbne / do naprawy': 'Probefahrt/Reparatur',
        'do naprawy': 'zur Reparatur',
        'składy lokomotyw': 'Lokomotivzüge',
        'lokomotywa pasażerska luzem': 'Personenlokomotive (leer)',
        'lokomotywa towarowa luzem': 'Güterlokomotive (leer)',
        'lokomotywa manewrowa luzem': 'Rangierlokomotive (leer)',
        'lokomotywa od/do pociągów utrzymaniowo-naprawczych': 'Lokomotive zu/von Instandhaltungszügen',
        'inspekcyjne / diagnostyczne': 'Inspektions-/Diagnose',
        'inne utrzymaniowe': 'Andere Instandhaltung'
        ,

        // Kategorien für Zugarten (pasażerski / towarowy / lokomotywa luzem / inny)
        'RO - wojewódzki osobowy': 'RO - regionaler Personenzug',
        'RM - wojewódzki osobowy międzynarodowy': 'RM - internationaler Regionalzug',
        'RP - wojewódzki pospieszny': 'RP - regionaler Schnellzug',
        'RA - wojewódzki osobowy-aglomeracyjny': 'RA - regionaler Agglomerationszug',
        'MP - międzywojewódzki pospieszny': 'MP - überregionaler Schnellzug',
        'MO - międzywojewódzki osobowy': 'MO - überregionaler Personenzug',
        'MH - międzywojewódzki pospieszny nocny': 'MH - überregionaler Nachtschnellzug',
        'MM - międzynarodowy pospieszny': 'MM - internationaler Schnellzug',
        'EI - ekspres krajowy': 'EI - nationaler Express',
        'EC - ekspres międzynarodowy': 'EC - internationaler Express',
        'EN - ekspres nocny międzynarodowy': 'EN - internationaler Nacht-Express',
        'PW - próżny pasażerski (służbowy)': 'PW - leerer Personenzug (dienstlich)',
        'PX - próżny pasażerski (próby)': 'PX - leerer Personenzug (Probefahrt)',
        'TM - towarowy krajowy masowy': 'TM - nationaler Massengüterzug',
        'TN - towarowy krajowy niemasowy': 'TN - nationaler Stückgutzug',
        'TD - towarowy krajowy intermodalny': 'TD - nationaler intermodaler Güterzug',
        'TK - towarowy do obsługi stacji i bocznic (zdawczy)': 'TK - Güterzug zur Bedienung von Bahnhöfen und Anschlüssen (Übergabe)',
        'TC - towarowy międzynarodowy intermodalny': 'TC - internationaler intermodaler Güterzug',
        'TG - towarowy międzynarodowy masowy': 'TG - internationaler Massengüterzug',
        'TR - towarowy międzynarodowy niemasowy': 'TR - internationaler Stückgutzug',
        'TS - towarowy próżny (próbny / do naprawy)': 'TS - leerer Güterzug (Probefahrt/Reparatur)',
        'TH - skład lokomotyw - powyżej 3 lokomotywy': 'TH - Lokomotivzug (mehr als 3 Lokomotiven)',
        'LP - lokomotywa pasażerska luzem': 'LP - Personenlokomotive (leer)',
        'LT - lokomotywa towarowa luzem': 'LT - Güterlokomotive (leer)',
        'LS - lokomotywa manewrowa luzem': 'LS - Rangierlokomotive (leer)',
        'LZ - lokomotywa luzem (dla poc. utrzymaniowo-naprawczych)': 'LZ - Lokomotive (leer) (für Instandhaltungs-/Reparaturzüge)',
        'ZN - inspekcyjny / diagnostyczny': 'ZN - Inspektions-/Diagnosezug',
        'ZU - inny utrzymaniowy': 'ZU - anderer Instandhaltungszug'
        ,

        // Spezifische Korrekturen für Güterzug‑Kategorien nach teilweiser Übersetzung
        // Manche Kategorien werden durch die generelle Übersetzung von „towarowy“ zu „Güterzug“ nur teilweise ersetzt.
        // Diese Einträge sorgen dafür, dass solche bereits teilweise übersetzten Begriffe vollständig ins Deutsche übertragen werden.
        'TM - Güterzug krajowy masowy': 'TM - nationaler Massengüterzug',
        'TN - Güterzug krajowy niemasowy': 'TN - nationaler Stückgutzug',
        'TD - Güterzug krajowy intermodalny': 'TD - nationaler intermodaler Güterzug',
        'TK - Güterzug do obsługi stacji i bocznic (zdawczy)': 'TK - Güterzug zur Bedienung von Bahnhöfen und Anschlüssen (Übergabe)',
        'TC - Güterzug międzynarodowy intermodalny': 'TC - internationaler intermodaler Güterzug',
        'TG - Güterzug międzynarodowy masowy': 'TG - internationaler Massengüterzug',
        'TR - Güterzug międzynarodowy niemasowy': 'TR - internationaler Stückgutzug',
        'TS - Güterzug próżny (próbny / do naprawy)': 'TS - leerer Güterzug (Probefahrt/Reparatur)',
        'TH - skład lokomotyw - powyżej 3 lokomotyw': 'TH - Lokomotivzug (mehr als 3 Lokomotiven)',
        // Zusätzliche Ersatzteile für Teile der Beschriftungen
        'skład lokomotyw': 'Lokomotivzug',
        'powyżej 3 lokomotyw': 'mehr als 3 Lokomotiven',
        'krajowy masowy': 'nationaler Massengüterzug',
        'krajowy niemasowy': 'nationaler Stückgutzug',
        'krajowy intermodalny': 'nationaler intermodaler Güterzug',
        'międzynarodowy intermodalny': 'internationaler intermodaler Güterzug',
        'międzynarodowy masowy': 'internationaler Massengüterzug',
        'międzynarodowy niemasowy': 'internationaler Stückgutzug',
        'próżny (próbny / do naprawy)': 'leer (Probefahrt/Reparatur)',
        'zdawczy': 'Übergabe',

        // Weitere fehlende Begriffe und Abkürzungen
        'przeciągnij & upuść': 'Drag‑&‑Drop',
        'np.': 'z. B.',

        // Hinweise und Warnmeldungen im Generator
        'Rozkład jazdy dla pociągu należy wystawić w chwili gdy lokomotywa połączona jest z wagonami': 'Den Fahrplan für den Zug sollte man erst erstellen, wenn die Lokomotive mit den Wagen verbunden ist',
        'Rozkład jazdy dla pociągu należy wystawić w chwili gdy lokomotywa połączona jest z wagonami, ponieważ rzeczywista długość składu ma wpływ na możliwość wjazdu na scenerie!': 'Den Fahrplan für den Zug sollte man erst erstellen, wenn die Lokomotive mit den Wagen verbunden ist, da die tatsächliche Länge des Zuges die Möglichkeit der Einfahrt in die Szene beeinflusst!',
        'ponieważ rzeczywista długość składu ma wpływ na możliwość wjazdu na scenerie!': 'da die tatsächliche Länge des Zuges die Möglichkeit der Einfahrt in die Szene beeinflusst!',
        'Jeśli prezentowana długość oraz podgląd pociągu nie odpowiada stanowi rzeczywistemu, spróbuj otworzyć okno generatora za chwilę!': 'Sollte die angezeigte Länge und die Zugvorschau nicht dem tatsächlichen Zustand entsprechen, versuche das Generatorfenster später zu öffnen!',
        'Rozkład jazdy dla pociągu należy wystawić w chwili gdy lokomotywa połączona jest z wagonami, ponieważ rzeczywista długość składu ma wpływ na możliwość wjazdu na scenerie! Jeśli prezentowana długość oraz podgląd pociągu nie odpowiada stanowi rzeczywistemu, spróbuj otworzyć okno generatora za chwilę!': 'Den Fahrplan für den Zug sollte man erst erstellen, wenn die Lokomotive mit den Wagen verbunden ist, da die tatsächliche Länge des Zuges die Möglichkeit der Einfahrt in die Szene beeinflusst! Sollte die angezeigte Länge und die Zugvorschau nicht dem tatsächlichen Zustand entsprechen, versuche das Generatorfenster später zu öffnen!',

        // Hinweise beim manuellen Fahrplanerstellen
        'Aby dodać przejazd przez scenerię wybierz istniejącą trasę z listy. Lista uwzględnia trasy obsługujące zadany typ pociągu (np. Güterzug).': 'Um eine Fahrt durch eine Szene hinzuzufügen, wähle eine vorhandene Strecke aus der Liste. Die Liste berücksichtigt Strecken, die den angegebenen Zugtyp unterstützen (z. B. Güterzug).',
        'Kolejność elementów na liście możesz zmienić metodą przeciągnij & upuść.': 'Du kannst die Reihenfolge der Elemente in der Liste per Drag‑&‑Drop ändern.',
        'Aby usunąć dodany element kliknij na nim dwukrotnie.': 'Um ein hinzugefügtes Element zu entfernen, klicke doppelt darauf.'
        ,

        // Weitere Korrekturen für gemischt übersetzte Warn‑ und Hilfetexte
        'Fahrplan dla pociągu należy wystawić w chwili gdy lokomotywa połączona jest z wagonami': 'Den Fahrplan für den Zug sollte man erst erstellen, wenn die Lokomotive mit den Wagen verbunden ist',
        'Fahrplan dla pociągu należy wystawić w chwili gdy lokomotywa połączona jest z wagonami, da die tatsächliche Länge des Zuges die Möglichkeit der Einfahrt in die Szene beeinflusst! Sollte die angezeigte Länge und die Zugvorschau nicht dem tatsächlichen Zustand entsprechen, versuche das Generatorfenster später zu öffnen!': 'Den Fahrplan für den Zug sollte man erst erstellen, wenn die Lokomotive mit den Wagen verbunden ist, da die tatsächliche Länge des Zuges die Möglichkeit der Einfahrt in die Szene beeinflusst! Sollte die angezeigte Länge und die Zugvorschau nicht dem tatsächlichen Zustand entsprechen, versuche das Generatorfenster später zu öffnen!',

        // Anleitungen im manuellen Fahrplan‑Generator (variantenabhängig)
        'Aby dodać przejazd przez scenerię wybierz istniejącą trasę z listy. Lista uwzględnia trasy obsługujące zadany typ pociągu (z. B. Güterzug).': 'Um eine Fahrt durch eine Szene hinzuzufügen, wähle eine vorhandene Strecke aus der Liste. Die Liste berücksichtigt Strecken, die den angegebenen Zugtyp unterstützen (z. B. Güterzug).',
        'Aby utworzyć rozkład ręczny dla ułozonej powyżej trasy, wskaż posterunek ruchu, z którego pociąg rozpocznie jazdę. Opcja ta pozwala rozpocząć bieg na dowolnym obsadzonym posterunku pod warunkiem, że obsługuje on rozpoczynanie biegu dla danego typu pociągu (podanego w nawiasie za nazwą posterunku).': 'Um einen manuellen Fahrplan für die oben erstellte Strecke zu erstellen, wähle den Bahnhof, von dem der Zug starten soll. Diese Option erlaubt es, den Lauf an jedem besetzten Bahnhof zu beginnen, sofern dieser den Startlauf für den angegebenen Zugtyp unterstützt (in Klammern hinter dem Namen angegeben).',
        'Skorzystaj z tej opcji jeśli chcesz, aby rozkład jazdy został zakończony na wybranym posterunku scenerii końcowej. Pamiętaj, że posterunek musi przyjmować dany typ pociągu (podany za jego nazwą w nawiasie) - w przeciwnym wypadku rozkład nie zostanie poprawnie wytrasowany.': 'Nutze diese Option, wenn du möchtest, dass der Fahrplan am ausgewählten Bahnhof der Endszene beendet wird. Beachte, dass der Bahnhof den angegebenen Zugtyp akzeptieren muss (der hinter seinem Namen in Klammern steht) – andernfalls wird der Fahrplan nicht korrekt geroutet.'
        ,

        // Zusätzliche Varianten der Warnmeldung mit fett gedrucktem Teil und teilweiser Übersetzung
        'Rozkład jazdy dla pociągu należy wystawić w chwili gdy lokomotywa ': 'Den Fahrplan für den Zug sollte man erst erstellen, wenn die Lokomotive ',
        'Fahrplan dla pociągu należy wystawić w chwili gdy lokomotywa ': 'Den Fahrplan für den Zug sollte man erst erstellen, wenn die Lokomotive ',
        'połączona jest z wagonami': 'mit den Wagen verbunden ist',
        'połączona jest z wagonami,': 'mit den Wagen verbunden ist,',
        'połączona jest z wagonami, ': 'mit den Wagen verbunden ist, ',

        // Einzelne Sätze der Anleitung für den manuellen Fahrplan‑Generator
        'Aby dodać przejazd przez scenerię wybierz istniejącą trasę z listy.': 'Um eine Fahrt durch eine Szene hinzuzufügen, wähle eine vorhandene Strecke aus der Liste.',
        'Lista uwzględnia trasy obsługujące zadany typ pociągu (np. Güterzug).': 'Die Liste berücksichtigt Strecken, die den angegebenen Zugtyp unterstützen (z. B. Güterzug).',
        'Lista uwzględnia trasy obsługujące zadany typ pociągu (z. B. Güterzug).': 'Die Liste berücksichtigt Strecken, die den angegebenen Zugtyp unterstützen (z. B. Güterzug).',
        'Aby utworzyć rozkład ręczny dla ułozonej powyżej trasy, wskaż posterunek ruchu, z którego pociąg rozpocznie jazdę.': 'Um einen manuellen Fahrplan für die oben erstellte Strecke zu erstellen, wähle den Bahnhof, von dem der Zug starten soll.',
        'Opcja ta pozwala rozpocząć bieg na dowolnym obsadzonym posterunku pod warunkiem, że obsługuje on rozpoczynanie biegu dla danego typu pociągu (podanego w nawiasie za nazwą posterunku).': 'Diese Option erlaubt es, den Lauf an jedem besetzten Bahnhof zu beginnen, sofern dieser den Startlauf für den angegebenen Zugtyp unterstützt (in Klammern hinter dem Namen angegeben).',
        'Skorzystaj z tej opcji jeśli chcesz, aby rozkład jazdy został zakończony na wybranym posterunku scenerii końcowej.': 'Nutze diese Option, wenn du möchtest, dass der Fahrplan am ausgewählten Bahnhof der Endszene beendet wird.',
        'Pamiętaj, że posterunek musi przyjmować dany typ pociągu (podany za jego nazwą w nawiasie) - w przeciwnym wypadku rozkład nie zostanie poprawnie wytrasowany.': 'Beachte, dass der Bahnhof den angegebenen Zugtyp akzeptieren muss (der hinter seinem Namen in Klammern steht) – andernfalls wird der Fahrplan nicht korrekt geroutet.'
        ,

        // Kontextmenü im Fahrplan-Editor
        'Szczegóły rozkładu': 'Fahrplandetails',
        'Wprowadzanie godzin': 'Zeiten eingeben',
        'Aktualizuj rozkład': 'Fahrplan aktualisieren',
        'Skopiuj numer pociągu': 'Zugnummer kopieren',

        // Überschriften und Texte im Modal „Aktualizowanie rozkładu jazdy”
        'Aktualizowanie rozkładu jazdy': 'Fahrplan aktualisieren',
        'Edycja numeru pociągu': 'Zugnummer bearbeiten',
        'Edycja kategorii pociągu': 'Zugkategorie bearbeiten',
        'Edycja informacji przewozowych': 'Frachtinformationen bearbeiten',
        'Numer zostanie automatycznie zaktualizowany w rozkładzie jazdy u maszynisty. Jeśli maszynista nie wyświetla się z danym numerem na liście, poczekaj chwilę na odświeżenie danych z symulatora i otwórz ponownie okno aktualizacji. Jeśli wysłałeś rozkład pod zły numer - pamiętaj o ponownym wznowieniu rozkładu po aktualizacji numeru. W przeciwnym razie maszynista nie będzie w stanie opuścić twojej scenerii.': 'Die Nummer wird im Fahrplan des Lokführers automatisch aktualisiert. Wenn der Lokführer mit dieser Nummer nicht in der Liste erscheint, warte einen Moment, bis die Daten aus dem Simulator aktualisiert wurden, und öffne dann das Aktualisierungsfenster erneut. Wenn du den Fahrplan unter der falschen Nummer gesendet hast, denke daran, den Fahrplan nach der Aktualisierung der Nummer erneut zu aktivieren. Andernfalls kann der Lokführer deine Szene nicht verlassen.',
        'Kategoria zostanie automatycznie zaktualizowana w rozkładzie jazdy u maszynisty. Kategorię można edytować wyłącznie na inną, zgodną z numerem pociągu (patrz: Nowe kategorie - pomocnik)! Uwaga - zmiana kategorii resetuje wszystkie wystawione informacje przewozowe!': 'Die Kategorie wird im Fahrplan des Lokführers automatisch aktualisiert. Die Kategorie kann nur auf eine andere geändert werden, die zur Zugnummer passt (siehe: Neue Kategorien – Assistent)! Achtung – das Ändern der Kategorie setzt alle ausgestellten Frachtinformationen zurück!',
        'Wpisz uwagi dotyczące TWR, towarów niebezpiecznych lub przesyłek nadzwyczajnych do zaktualizowania': 'Gib Anmerkungen zu TWR, Gefahrgut oder außergewöhnlichen Sendungen zur Aktualisierung ein',
        'Aktualizuj uwagi przewozowe': 'Frachtanmerkungen aktualisieren',
        'Wznów rozkład': 'Fahrplan wieder aufnehmen',
        'Usuń rozkład': 'Fahrplan löschen',

        // Überschriften und Texte im Modal „Wprowadzanie godzin przejazdu”
        'Wprowadzanie godzin przejazdu pociągu numer': 'Eingabe der Fahrzeiten für Zug Nummer',
        'Przyjazd': 'Ankunft',
        'Odjazd': 'Abfahrt',
        'Planowy:': 'Planmäßig:',
        'Rzeczywisty:': 'Tatsächlich:',
        'Zastosuj czas aktualny': 'Aktuelle Zeit übernehmen',
        'Opóźnienie:': 'Verspätung:',
        'Zapisz': 'Speichern',
        'Zapisz z postojem': 'Speichern mit Halt',

        // Statusoptionen im Dropdown „Fahrdienstleiter online“
        'DOSTĘPNY': 'VERFÜGBAR',
        'Dostępny': 'Verfügbar',
        'ZARAZ WRACAM': 'Gleich zurück',
        'NIEDŁUGO KOŃCZĘ': 'Bald fertig',
        'BRAK MIEJSCA': 'Kein Platz',
        'NIEDOSTĘPNY': 'Nicht verfügbar',

        // Fahrplandetails‑Modal
        'Szczegółowy rozkład jazdy pociągu': 'Detaillierter Fahrplan des Zuges',
        'Relacja:': 'Verbindung:',
        'Relacja': 'Verbindung',
        'Numer:': 'Nummer:',
        'Kategoria:': 'Kategorie:',
        'Maszynista:': 'Lokführer:',
        'Długość:': 'Länge:',
        'Masa:': 'Masse:',
        'Prędkość RJ:': 'RJ‑Geschwindigkeit:',
        'Informacje przewozowe': 'Frachtinformationen',
        'Brak dodatkowych informacji przewozowych': 'Keine zusätzlichen Frachtinformationen',
        'Podgląd składu': 'Zugzusammenstellung',
        'Trasa pociągu': 'Strecke des Zuges',
        'Kolor szary wskazuje posterunki ruchu, na których dyżurny wprowadził rzeczywiste godziny przyjazdu i odjazdu pociągu.': 'Die graue Farbe kennzeichnet Bahnhöfe, an denen der Fahrdienstleiter die tatsächlichen Ankunfts‑ und Abfahrtszeiten eingetragen hat.',
        'Wielkość opóźnienia na posterunkach niezatwierdzonych jest wartością prognozowaną i może ulec zmianie!': 'Die Höhe der Verspätung an unbesetzten Bahnhöfen ist ein prognostizierter Wert und kann sich ändern!',
        'Szlak wjazdowy': 'Einfahrgleis',
        'Przyjazd planowo': 'Planmäßige Ankunft',
        'Posterunek ruchu': 'Bahnhof',
        'Postój': 'Halt',
        'Odjazd planowo': 'Planmäßige Abfahrt',
        'Szlak wyjazdowy': 'Ausfahrgleis',
        'Uwagi eksploatacyjne': 'Betriebshinweise',
        'Opcje wznowienia, usuwania i edycji rozkładu jazdy zostały przeniesione do wydzielonego okna! Wybierz opcję \'Aktualizuj rozkład\' z menu rozkładu jazdy!': 'Die Optionen zum Wiederaufnehmen, Löschen und Bearbeiten des Fahrplans wurden in ein separates Fenster verschoben! Wähle die Option „Fahrplan aktualisieren“ im Fahrplan‑Menü!',
        'Zamknij': 'Schließen'

        ,
        // Checkbox‑Bezeichnungen im Modal „Aktualizowanie rozkładu jazdy”
        'Towary niebezpieczne': 'Gefahrgut',
        'Przesyłki nadzwyczajne': 'Außergewöhnliche Sendungen',

        // Ergänzungen für das Modal „Fahrplan aktualisieren“ bei unterbrochenen Texten
        'Numer zostanie automatycznie zaktualizowany w rozkładzie jazdy u maszynisty. Jeśli maszynista nie wyświetla się z danym numerem na liście, poczekaj chwilę na odświeżenie danych z symulatora i otwórz ponownie okno aktualizacji.': 'Die Nummer wird im Fahrplan des Lokführers automatisch aktualisiert. Wenn der Lokführer mit dieser Nummer nicht in der Liste erscheint, warte einen Moment, bis die Daten aus dem Simulator aktualisiert wurden, und öffne dann erneut das Aktualisierungsfenster.',
        'Nummer zostanie automatycznie zaktualizowany w rozkładzie jazdy u maszynisty. Jeśli maszynista nie wyświetla się z danym numerem na liście, poczekaj chwilę na odświeżenie danych z symulatora i otwórz ponownie okno aktualizacji.': 'Die Nummer wird im Fahrplan des Lokführers automatisch aktualisiert. Wenn der Lokführer mit dieser Nummer nicht in der Liste erscheint, warte einen Moment, bis die Daten aus dem Simulator aktualisiert wurden, und öffne dann erneut das Aktualisierungsfenster.',
        'Jeśli maszynista nie wyświetla się z danym numerem na liście, poczekaj chwilę na odświeżenie danych z symulatora i otwórz ponownie okno aktualizacji.': 'Wenn der Lokführer mit dieser Nummer nicht in der Liste erscheint, warte einen Moment, bis die Daten aus dem Simulator aktualisiert wurden, und öffne dann erneut das Aktualisierungsfenster.',
        'Jeśli wysłałeś rozkład pod zły numer - pamiętaj o ponownym wznowieniu rozkładu po aktualizacji numeru. W przeciwnym razie maszynista nie będzie w stanie opuścić twojej scenerii.': 'Wenn du den Fahrplan unter der falschen Nummer gesendet hast, denke daran, den Fahrplan nach der Aktualisierung der Nummer erneut zu aktivieren. Andernfalls kann der Lokführer deine Szene nicht verlassen.',
        'W przeciwnym razie maszynista nie będzie w stanie opuścić twojej scenerii.': 'Andernfalls kann der Lokführer deine Szene nicht verlassen.',

        // Ergänzungen für das Modal „Fahrplan aktualisieren“ – Kategorie‑Teil
        'Kategoria zostanie automatycznie zaktualizowana w rozkładzie jazdy u maszynisty.': 'Die Kategorie wird im Fahrplan des Lokführers automatisch aktualisiert.',
        'Kategorię można edytować wyłącznie na inną, zgodną z numerem pociągu': 'Die Kategorie kann nur auf eine andere geändert werden, die zur Zugnummer passt',
        'patrz: Nowe kategorie - pomocnik': 'siehe: Neue Kategorien – Assistent',
        'Uwaga - zmiana kategorii resetuje wszystkie wystawione informacje przewozowe!': 'Achtung – das Ändern der Kategorie setzt alle ausgestellten Frachtinformationen zurück!',

        // Schaltflächen
        'Aktualizuj': 'Aktualisieren',
        'patrz:': 'siehe:',
        'patrz': 'siehe',
        '! Uwaga - zmiana kategorii resetuje wszystkie wystawione informacje przewozowe!': 'Achtung – das Ändern der Kategorie setzt alle ausgestellten Frachtinformationen zurück!'
    };

    // Übersetzt einen String anhand der Tabelle.
    function translateText(str) {
        let result = str;
        // Sortiere die Übersetzungspaare nach absteigender Schlüssellänge, damit längere (spezifischere)
        // Begriffe zuerst ersetzt werden und nicht durch kürzere Vorabersetzungen verändert werden.
        const entries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
        for (const [pl, de] of entries) {
            // Escape Regex‑Sonderzeichen im Schlüssel, damit er als Literal interpretiert wird.
            const escaped = pl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            result = result.replace(new RegExp(escaped, 'g'), de);
        }
        return result;
    }

    // Prüft, ob der aktuelle Knoten oder einer seiner Vorfahren Teil des Chat-Bereichs ist,
    // um eine Übersetzung von Chat-Nachrichten zu verhindern.
    function isChatContext(node) {
        let current = node;
        while (current && current !== document.body) {
            if (current.nodeType === Node.ELEMENT_NODE) {
                const id = current.id ? current.id.toLowerCase() : '';
                const classes = current.className ? current.className.toString().toLowerCase() : '';
                /*
                 * Prüft, ob der Knoten oder einer seiner Vorfahren als Nachrichteninhalt zu identifizieren ist.
                 * Wir vermeiden hier die generische Prüfung auf „chat“, da sich viele UI‑Elemente im Chat‑Bereich
                 * befinden. Stattdessen konzentrieren wir uns auf Begriffe, die typischerweise für Nachrichtenelemente
                 * verwendet werden, wie „wiadomość“ (polnisch für Nachricht), „wiadomosc“, „message“ oder „msg“.
                 * Dadurch werden nur tatsächliche Chat‑Nachrichten von der Übersetzung ausgenommen, während
                 * andere Überschriften und Schaltflächen weiterhin übersetzt werden.
                 */
                if (id.includes('wiadomo') || id.includes('message') || id.includes('msg') ||
                    classes.includes('wiadomo') || classes.includes('message') || classes.includes('msg')) {
                    return true;
                }
            }
            current = current.parentNode;
        }
        return false;
    }

    // Übersetzt einen Knoten rekursiv, ausgenommen Eingabefelder und Chat-Bereiche
    function translateNode(node) {
        if (isChatContext(node)) {
            // Überspringe die Übersetzung innerhalb des Chat-Kontexts vollständig
            return;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            const original = node.textContent;
            const translated = translateText(original);
            if (translated !== original) {
                node.textContent = translated;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Bereiche überspringen, in denen Benutzer eingeben. Bei <select> wollen wir die Optionen übersetzen,
            // daher wird nur input, textarea oder contentEditable übersprungen.
            const tag = node.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || node.isContentEditable) {
                return;
            }
            // Attribute wie placeholder, title und aria-label übersetzen
            ['placeholder','title','aria-label'].forEach(attr => {
                if (node.hasAttribute(attr)) {
                    const originalAttr = node.getAttribute(attr);
                    const translatedAttr = translateText(originalAttr);
                    if (translatedAttr !== originalAttr) {
                        node.setAttribute(attr, translatedAttr);
                    }
                }
            });
            // Kindknoten durchlaufen
            node.childNodes.forEach(child => translateNode(child));
        }
    }

    // Anwendung der Übersetzung auf das gesamte Dokument
    function translatePage() {
        translateNode(document.body);
    }

    // Erstanwendung bei Seitenaufruf
    translatePage();

    // Beobachte DOM-Veränderungen, um dynamische Inhalte zu übersetzen
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(added => translateNode(added));
            if (mutation.type === 'characterData') {
                translateNode(mutation.target);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
})();
