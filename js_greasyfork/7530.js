// ==UserScript==
// @name TWeaker
// @namespace TomRobert
// @author Vbyec (updated by Tom Robert)
// @description Some little tweaks for The-West!
// @include https://*.the-west.*/game.php*
// @version 0.1.20
//
// @history 0.1.20 Add Greek, better updater
// @history 0.1.19 better data saving, export&import
// @history 0.1.18 new forum links, scrollpane and choose language in script window
// @history 0.1.17 topic of alliance-chat added
// @history 0.1.16 Polish corrected (Wojcieszy/Bartosz86), compatibility patch for TW-Toolkit
// @history 0.1.15 Add Dutch (cor696)
// @history 0.1.14 little improvements
// @history 0.1.13 German corrected
// @history 0.1.12 items search fixed and improved
// @history 0.1.11 Fix for the west version 2.21, add update function
// @history 0.1.10 Add Polish (TeeNOmore127)
// @history 0.1.9  Fix for the west beta
// @history 0.1.8  Add German (Tom Robert), remove Kick-o-matic autoload
// @history 0.1.7  Add Spanish (pepe100)
// @history	0.1.6  Add Items controls and search
// @history	0.1.5  Add English
// @history	0.1.4  Add Kick-o-matic autoload
// @nocompat Chrome
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/7530/TWeaker.user.js
// @updateURL https://update.greasyfork.org/scripts/7530/TWeaker.meta.js
// ==/UserScript==
// translation:Vbyec(Russian),pepe100(Spanish),Tom Robert(German&English),TeeNOmore127/Wojcieszy/Bartosz86(Polish),cor696(Dutch),Timemod Herkumo(Greek)
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  Tweaker = {
    version: '0.1.20',
    name: 'Tweaker',
    author: 'Vbyec (updated by Tom Robert)',
    minGame: '2.08',
    maxGame: Game.version.toString(),
    website: 'https://greasyfork.org/scripts/7530',
    langs: {
      ru: {
        language: 'Russian (русский)',
        ApiGui: '<b>How to use:</b><br><u>Ctrl+click:</u> Copy <i>*nickname*</i> to active chat.<br><u>Shift+click:</u> Copy "<i>*nickname* change with</i>" to active chat.<br><u>Backspace+click:</u> Open private chat with current player.<br>Automatically add some information (total dmg, last hit) to players description in fortbattle.<br>Write "<i>/items</i>" into chat to check out new items.<br>Write "<i>/items.s name</i>" into chat to find items by name.<br>Write "<i>/items.add</i>" into chat to update local DB.',
        save: 'Экономить',
        saveMessage: 'Сохранить успешно',
        chooseLang: 'Сменить язык',
        ex: 'Export',
        exTitle: 'Export localStorage to save it when you reset you internet browser',
        im: 'Import',
        imTitle: 'Import your data which you did export earlier',
        imported: 'Data imported',
        noImport: 'Nothing to import!',
        contact: 'контакт',
        searched: 'Number of items found which include this part in their name: ',
        noNew: 'No new items',
        added: 'Items added to local storage: ',
        noAdd: 'No new item to add to local storage',
        TotalDamage: 'Урона за бой',
        LastHit: 'Последний выстрел',
        KillShot: 'Скальп',
        ChangeWith: 'смена с',
        UserMessage: 'Похоже появились новые шмотки: ',
        itemsShorthelp: 'Первичная настрока локального хранилища вещей.',
        itemsHelp: 'Первичная настрока локального хранилища вещей, если хранилище уже существует- проверка на появление новых вещей.',
        itemssShorthelp: 'Поиск по названию предмета.',
        itemssHelp: 'Поиск по части названия предмета. Регистронезависимый.',
        itemssUsage: 'часть названия',
        itemsaddShorthelp: 'Добавить новые предметы в локальную базу.',
        itemsaddHelp: 'Добавить все новые предметы в локальную базу, чтобы они не показывали при.',
      },
      en: {
        language: 'English',
        ApiGui: '<b>How to use:</b><br><u>Ctrl+click:</u> Copy <i>*nickname*</i> to active chat.<br><u>Shift+click:</u> Copy "<i>*nickname* change with</i>" to active chat.<br><u>Backspace+click:</u> Open private chat with current player.<br>Adds some information (total dmg, last hit) to players description in fortbattle.<br>Displays the chat topics at the upper border of the game window.<br>Write "<i>/items</i>" into chat to check out new items.<br>Write "<i>/items.s name</i>" into chat to find items by name.<br>Write "<i>/items.add</i>" into chat to update local DB.',
        save: 'Save',
        saveMessage: 'Successfully saved',
        chooseLang: 'Choose language',
        ex: 'Export',
        exTitle: 'Export localStorage to save it when you reset you internet browser',
        im: 'Import',
        imTitle: 'Import your data which you did export earlier',
        imported: 'Data imported',
        noImport: 'Nothing to import!',
        contact: 'Contact',
        searched: 'Number of items found which include this part in their name: ',
        noNew: 'No new items',
        added: 'Items added to local storage: ',
        noAdd: 'No new item to add to local storage',
        TotalDamage: 'Total damage',
        LastHit: 'Last hit',
        KillShot: 'Kill shot',
        ChangeWith: 'change with',
        UserMessage: 'New items found: ',
        itemsShorthelp: 'Check out new items.',
        itemsHelp: 'Shows the items, which were last added to the game. But you have to set up first a local storage of actual items to detect new items.',
        itemssShorthelp: 'Find items by name.',
        itemssHelp: 'Type in anything to search for items, where that part is included.',
        itemssUsage: 'parte name',
        itemsaddShorthelp: 'Update local DB.',
        itemsaddHelp: 'Add new items to the local storage, which aren\'t registrated yet.',
      },
      es: {
        language: 'Spanish (español)',
        ApiGui: '<b>Uso:</b><br><u>Ctrl+click:</u> Copia <i>*nombre_jugador*</i> en el chat activo.<br><u>Shift+click:</u> Copia el texto "<i>*nombre_jugador* cambia con</i>" en el chat activo.<br><u>Backspace+click:</u> Abre chat privado con el jugador actual.<br>Automáticamente añade la siguiente información (daño total, último tiro) en la descripción de los jugadores en batallas de fuertes, simplemente marcando con el puntero del ratón el jugador en el fuerte.<br>Displays the chat topics at the upper border of the game window.<br>Escribe "<i>/items</i>" en el chat para ver nuevos artículos.<br>Escribe "<i>/items.s nombre</i>" en el chat para encontrar artículos por nombre.<br>Escribe "<i>/items.add</i>" en el char para actualizar la Base de Datos local.',
        save: 'Guardar',
        saveMessage: 'Guardar correctamente',
        chooseLang: 'Elige lengua',
        ex: 'Export',
        exTitle: 'Export localStorage to save it when you reset you internet browser',
        im: 'Import',
        imTitle: 'Import your data which you did export earlier',
        imported: 'Data imported',
        noImport: 'Nothing to import!',
        contact: 'Contacto',
        searched: 'Number of items found which include this part in their name: ',
        noNew: 'No new items',
        added: 'Items added to local storage: ',
        noAdd: 'No new item to add to local storage',
        TotalDamage: 'Daño Total',
        LastHit: 'Último tiro',
        KillShot: 'Desmayo',
        ChangeWith: 'cambiar con',
        UserMessage: 'Parece que hay ropa nueva: ',
        itemsShorthelp: 'Configuración inicial de artículos en la base de datos local.',
        itemsHelp: 'La configuración inicial de la base de datos local, si ya existe la base de datos, comprueba los artículos nuevos.',
        itemssShorthelp: 'Búsqueda por nombre de artículo.',
        itemssHelp: 'Buscar por nombre de artículo, minúsculas.',
        itemssUsage: 'parte del nombre',
        itemsaddShorthelp: 'Agregar nuevos artículos a la base de datos local.',
        itemsaddHelp: 'Agregar nuevos artículos a la base de datos local, los que no se muestran en el registro.',
      },
      de: {
        language: 'German (Deutsch)',
        ApiGui: '<b>Funktionen:</b><br><u>Ctrl+Klick:</u> Kopiert <i>*nickname*</i> in den aktiven Chat.<br><u>Shift+Klick:</u> Kopiert "<i>*nickname* tausche mit</i>" in den aktiven Chat.<br><u>Löschtaste+Klick:</u> Öffnet privaten Chat mit dem angeklickten Spieler.<br>Fügt automatisch zusätzliche Informationen (Gesamter Schaden, letzter Treffer) zur Spielerbeschreibung im Fortkampf hinzu.<br>Zeigt die gesetzten Chat-Topics am oberen Bildschirmrand.<br>Tippe "<i>/items</i>" in den Chat um neue Items zu finden.<br>Tippe "<i>/items.s Kürzel</i>" in den Chat um Items mit dem Kürzel zu finden.<br>Tippe "<i>/items.add</i>" in den Chat um neue Items dem lokalen Speicher hinzuzufügen.',
        save: 'Speichern',
        saveMessage: 'Speichern erfolgreich',
        chooseLang: 'Sprache ändern',
        ex: 'Export',
        exTitle: 'Exportiere den lokalen Speicher um ihn beim Zurücksetzen deines Internetbrowsers nicht zu verlieren',
        im: 'Import',
        imTitle: 'Importiere die Daten, welche du einmal exportiert hattest',
        imported: 'Daten importiert',
        noImport: 'Es gibt nichts zu importieren!',
        contact: 'Kontakt',
        searched: 'Anzahl gefundene Items mit diesem Kürzel im Namen: ',
        noNew: 'Keine neuen Items',
        added: 'Anzahl Items zum lokalen Speicher hinzugefügt: ',
        noAdd: 'Keine neuen Items für Hinzufügen zum lokalen Speicher',
        TotalDamage: 'Gesamter Schaden',
        LastHit: 'Letzter Treffer',
        KillShot: 'KO',
        ChangeWith: 'tausche mit',
        UserMessage: 'Neue Items gefunden: ',
        itemsShorthelp: 'Neue Items anschauen.',
        itemsHelp: 'Zeige Items, welche neu zum Spiel hinzugefügt wurden und noch nicht in deinem lokalen Speicher sind.',
        itemssShorthelp: 'Finde Items mit Kürzel.',
        itemssHelp: 'Durch Eingabe von Wortbruchstücken werden alle Items angezeigt, welche dazu gefunden werden.',
        itemssUsage: 'Wortfetzen',
        itemsaddShorthelp: 'Lokalen Speicher aktualisieren.',
        itemsaddHelp: 'Ungespeicherte Items werden dem lokalen Speicher hinzugefügt.',
      },
      pl: {
        language: 'Polish (polski)',
        ApiGui: '<b>Jak używać:</b><br><u>Ctrl+click:</u> Skopiuj <i>*nickname*</i> do aktywnego czatu.<br><u>Shift+click:</u> Skopiuj "<i>*nickname* rotacja z</i>" do aktywnego czatu.<br><u>Backspace+click:</u> Otwórz czat prywatny z obecnym graczem.<br>Automatycznie dodaje kilka informacji (Całkowite obrażenia, ostatni strzał) do opisu graczy na bitwie.<br>Displays the chat topics at the upper border of the game window.<br>Napisz "<i>/items</i>" na czacie, aby sprawdzić nowe przedmioty.<br>Napisz "<i>/items.s nazwa</i>" na czacie, by znaleźć przedmiot po nazwie.<br>Napisz "<i>/items.add</i>" na czacie,by zaktualizować bazę danych.',
        save: 'Zapisz',
        saveMessage: 'Zapisz powodzeniem',
        chooseLang: 'Wybierz język',
        ex: 'Export',
        exTitle: 'Export localStorage to save it when you reset you internet browser',
        im: 'Import',
        imTitle: 'Import your data which you did export earlier',
        imported: 'Data imported',
        noImport: 'Nothing to import!',
        contact: 'Kontakt',
        searched: 'Liczba przedmiotów która obejmuje tą nazwę: ',
        noNew: 'Brak nowych przedmiotów',
        added: 'Przedmioty dodane do pamięci lokalnej: ',
        noAdd: 'Brak nowych przedmiotów by dodać do pamięci lokalnej',
        TotalDamage: 'Łączne obrażenia',
        LastHit: 'Ostatni strzał',
        KillShot: 'Zabójstwo!',
        ChangeWith: 'rotacja z',
        UserMessage: 'Nowe przedmioty znalezione: ',
        itemsShorthelp: 'Zobacz nowe przedmioty.',
        itemsHelp: 'Pokaż przedmioty, które ostatnio zostały dodane.',
        itemssShorthelp: 'Szukaj przedmiotów po nazwie.',
        itemssHelp: 'Wpisz cokolwiek, aby znaleźć przedmiot w których część została uwzględniona.',
        itemssUsage: 'Część nazwy',
        itemsaddShorthelp: 'Zaktualizuj lokalną bazę danych.',
        itemsaddHelp: 'Dodaj nowe przedmioty do lokalnej pamięci, które nie zostały jeszcze zarejestrowane.',
      },
      nl: {
        language: 'Dutch (Nederlands)',
        ApiGui: '<b>Instructie\'s:</b><br><u>Ctrl+klik:</u> Kopieer <i>*gebruikersnaam*</i> naar de actieve chat.<br><u>Shift+klik:</u> Kopieer "<i>*gebruikersnaam* wissel met</i>" naar de actieve chat.<br><u>Backspace+klik:</u> Open een fluister met de huidige speler.<br>Voegt automatisch informatie toe aan de spelers beschrijving bij fortgevechten (totale schade, laatste treffer).<br>Displays the chat topics at the upper border of the game window.<br>Typ "<i>/items</i>" in de chat om te kijken of er nieuwe voorwerpen zijn.<br>Typ "<i>/items.s naam</i>" in de chat om voorwerpen op naam te zoeken.<br>Typ "<i>/items.add</i>" in de chat om de lokale opslag te updaten.',
        save: 'Besparen',
        saveMessage: 'Sparen succes',
        chooseLang: 'Kies een taal',
        ex: 'Export',
        exTitle: 'Export localStorage to save it when you reset you internet browser',
        im: 'Import',
        imTitle: 'Import your data which you did export earlier',
        imported: 'Data imported',
        noImport: 'Nothing to import!',
        contact: 'Contact',
        searched: 'Aantal voorwerpen gevonden met deze tekst in hun naam: ',
        noNew: 'Geen nieuwe voorwerpen',
        added: 'Voorwerpen toegevoegd aan de lokale opslag: ',
        noAdd: 'Geen nieuwe voorwerpen om toe te voegen aan de lokale opslag',
        TotalDamage: 'Totale schade',
        LastHit: 'Laatste treffer',
        KillShot: 'KO',
        ChangeWith: 'wissel met',
        UserMessage: 'Nieuwe voorwerpen gevonden: ',
        itemsShorthelp: 'Bekijk nieuwe voorwerpen.',
        itemsHelp: 'Laat de voorwerpen zien die het laatst zijn toegevoegd aan het spel. Maar je moet eerst een lokale opslag maken voor de huidige voorwerpen om de nieuwe voorwerpen te zien.',
        itemssShorthelp: 'Zoek voorwerpen op naam.',
        itemssHelp: 'Typ een tekst om voorwerpen te zoeken waarin deze tekst voorkomt.',
        itemssUsage: 'Onderdeel van de naam',
        itemsaddShorthelp: 'Update lokale opslag.',
        itemsaddHelp: 'Voeg nieuwe voorwerpen toe aan de lokale opslag, welke nog niet opgeslagen zijn.',
      },
      el: {
        language: 'Greek (ελληνικά)',
        ApiGui: '<b>Πώς να το χρησιμοποιήσετε:</b><br><u>Ctrl+κλικ:</u> Αντιγραφή του <i><em>nickname</em></i> στην ενεργή συνομιλία.<br><u>Shift+κλικ:</u> Αντιγραφή του "<i><em>nickname</em> αλλαγή με</i>" στην ενεργή συνομιλία.<br><u>Backspace+κλικ:</u> Άνοιγμα ιδιωτικής συνομιλίας με τον τρέχον παίκτη.<br>Προσθέτει κάποιες πληροφορίες (συνολική ζημιά, τελευταίο χτύπημα)<br>στην περιγραφή των παικτών στην μάχη οχυρού.<br>Εμφανίζει τα θέματα συνομιλίας (topic του chat) στο πάνω μέρος του παραθύρου του παιχνιδιού.<br>Γράψτε "<i>/items</i>" στην συνομιλία για να ελέγξετε για νέα αντικείμενα.<br>Γράψτε "<i>/items.s name</i>" στην συνομιλία για να βρείτε τα αντικείμενα αλφαβητικά.<br>Γράψτε "<i>/items.add</i>" στην συνομιλία για την ενημέρωση της τοπικής DB.',
        save: 'Αποθήκευση',
        saveMessage: 'Αποθηκεύτηκε με επιτυχία',
        chooseLang: 'Επιλογή Γλώσσας',
        ex: 'Εξαγωγή',
        exTitle: 'Εξαγωγή κώδικα για να το αποθηκεύσετε όταν επαναφέρετε το πρόγραμμα περιήγησης στο διαδίκτυο',
        im: 'Εισαγωγή',
        imTitle: 'Εισαγάγετε τα δεδομένα που εξαγάγατε νωρίτερα',
        imported: 'Εισήχθησαν δεδομένα',
        noImport: 'Δεν υπάρχει κάτι για εισαγωγή!',
        contact: 'Επικοινωνία',
        searched: 'Αριθμός αντικειμένων που βρέθηκαν και περιλαμβάνουν αυτό το τμήμα στο όνομά τους:',
        noNew: 'Δεν υπάρχουν νέα αντικείμενα',
        added: 'Αντικείμενα που προστέθηκαν:',
        noAdd: 'Δεν υπάρχουν αντικείμενα για προσθήκη',
        TotalDamage: 'Συνολική ζημιά',
        LastHit: 'Τελευταίο χτύπημα',
        KillShot: 'Λιποθυμία',
        ChangeWith: 'άλλαξε με',
        UserMessage: 'Βρέθηκαν νέα αντικείμενα: ',
        itemsShorthelp: 'Ελέγξτε τα νέα αντικείμενα.',
        itemsHelp: 'Εμφανίζει τα αντικείμενα που προστέθηκαν τελευταία στο παιχνίδι. Αλλά πρέπει πρώτα να ρυθμίσετε μια DB πραγματικών στοιχείων για την ανίχνευση νέων αντικειμένων.',
        itemssShorthelp: 'Βρείτε αντικείμενα αλφαβητικά',
        itemssHelp: 'Πληκτρολογήστε οτιδήποτε για να αναζητήσετε αντικείμενα, όπου περιλαμβάνεται αυτό το τμήμα στο όνομά τους.',
        itemssUsage: 'μέρος του ονόματος',
        itemsaddShorthelp: 'Ενημέρωση τοπικής DB.',
        itemsaddHelp: 'Προσθέστε νέα αντικείμενα στην DB, τα οποία δεν έχουν ακόμη καταχωριστεί.',
      },
    },
    updateLang: function () {
      var lg = Tweaker.langs;
      Tweaker.lang = lg[localStorage.getItem('scriptsLang')] ? localStorage.getItem('scriptsLang') : lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : 'en';
      TWlang = lg[Tweaker.lang];
    },
    items: JSON.parse(localStorage.getItem('Tweaker_items')) || {
      count: 0
    },
    room: '',
  };
  Tweaker.updateLang();
  var langBox = new west.gui.Combobox();
  for (var j in Tweaker.langs)
    langBox.addItem(j, Tweaker.langs[j].language);
  langBox.select(Tweaker.lang);
  var saveBtn = new west.gui.Button(TWlang.save, function () {
      localStorage.setItem('scriptsLang', langBox.getValue());
      Tweaker.updateLang();
      new UserMessage(TWlang.saveMessage, UserMessage.TYPE_SUCCESS).show();
    }),
  fmfb = function (l) {
    return 'https://forum.the-west.' + l + '/index.php?conversations/add&to=Tom Robert';
  },
  TweakerAPI = TheWestApi.register('TWeaker', Tweaker.name, Tweaker.minGame, Tweaker.maxGame, Tweaker.author, Tweaker.website),
  scrollP = new west.gui.Scrollpane().appendContent(TWlang.chooseLang + ': ').appendContent(langBox.getMainDiv()).appendContent(saveBtn.getMainDiv()).appendContent('<br><br>Some little tweaks for The West.<br><br>' +
      TWlang.ApiGui + '<br><br><a href="javascript:Tweaker.exportItems();" title="' + TWlang.exTitle + '">' + TWlang.ex + '</a> / <a href="javascript:Tweaker.importItems();" title="' + TWlang.imTitle + '">' + TWlang.im + '</a><br><br><i>' + Tweaker.name + ' v' + Tweaker.version + '</i><br><br><br><b>' + TWlang.contact +
      ':</b><ul style="margin-left:15px;"><li>Send a message to <a target=\'_blanck\' href="http://om.the-west.de/west/de/player/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert on German world Arizona</a></li>' +
      '<li>Contact me on <a target=\'_blanck\' href="https://greasyfork.org/forum/messages/add/Tom Robert">Greasy Fork</a></li>' +
      '<li>Message me on one of these The West Forum:<br>/ <a target=\'_blanck\' href="' + fmfb('de') + '">deutsches Forum</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('net') + '">English forum</a> / <a target=\'_blanck\' href="' + fmfb('pl') + '">forum polski</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('es') + '">foro español</a> /<br>/ <a target=\'_blanck\' href="' + fmfb('ru') + '">Русский форум</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('fr') + '">forum français</a> / <a target=\'_blanck\' href="' + fmfb('it') + '">forum italiano</a> / ' +
      '<a target=\'_blanck\' href="https://forum.beta.the-west.net//index.php?conversations/add&to=Tom Robert">beta forum</a> /<br>I will get an e-mail when you sent me the message <img src="../images/chat/emoticons/smile.png"></li></ul>');
  TweakerAPI.setGui(scrollP.getMainDiv());
  // local DataBase of items.
  Tweaker.oldData = function () {
    if (Tweaker.items.oldData != 1) {
      Tweaker.items.oldData = 1;
      if (localStorage.getItem('tweakItems_count')) {
        for (var k in localStorage)
          if (typeof k === 'string' && k.includes('tweak_')) {
            Tweaker.items[k.split('_')[1]] = localStorage.getItem(k);
            localStorage.removeItem(k);
          }
        Tweaker.items.count = parseInt(localStorage.getItem('tweakItems_count'));
        localStorage.removeItem('tweakItems_count');
      }
      for (var l in localStorage)
        if (l.includes('PlayerId_'))
          localStorage.removeItem(l);
      localStorage.setItem('Tweaker_items', JSON.stringify(Tweaker.items));
    }
  }
  ();
  Tweaker.exportItems = function () {
    (new west.gui.Dialog(TWlang.ex, $('<textarea cols=50 rows=10>' + localStorage.getItem('Tweaker_items') + '</textarea>').click(function () {
          this.select();
        }))).addButton('ok').show();
  };
  Tweaker.importItems = function () {
    var txtarea = $('<textarea cols=50 rows=10></textarea>');
    (new west.gui.Dialog(TWlang.im, txtarea)).addButton('ok', function () {
      try {
        if (JSON.parse(txtarea.val()).count && JSON.parse(txtarea.val()).oldData) {
          localStorage.setItem('Tweaker_items', txtarea.val());
          new UserMessage(TWlang.imported, 'success').show();
        } else {
          new UserMessage(TWlang.noImport, 'error').show();
        }
      } catch (e) {
        new UserMessage('<span>' + e + '</spawn>', 'error').show();
      }
    }).addButton('cancel').show();
  };
  Tweaker.search = function (query) {
    if (Tweaker.items.count === 0)
      Tweaker.init();
    var counter = 0,
    qry = query.toLowerCase();
    for (var key in Tweaker.items) {
      if ($.isNumeric(key) && Tweaker.items[key].toLowerCase().includes(qry)) {
        var txt = 'item=' + key + ': ' + '[item=' + key + ']';
        if (Character.name == 'Tom Robert')
          txt += ' ' + ItemManager.get(key).short;
        Tweaker.show_in_chat(txt);
        counter++;
      }
    }
    Tweaker.show_in_chat('"' + query + '" ---> ' + TWlang.searched + counter);
  };
  Tweaker.show_new = function () {
    var count = 0,
    counterN = 0;
    for (var i = 0; i < 300000; i++) {
      var item = ItemManager.getByBaseId(i);
      if (item) {
        if (Tweaker.items[item.item_id] === undefined) {
          var txt = 'item=' + item.item_id + ': ' + '[item=' + item.item_id + ']';
          if (Character.name == 'Tom Robert')
            txt = 'item=' + item.item_base_id + ': ' + '[item=' + item.item_id + ']' + ItemManager.get(item.item_id).short;
          Tweaker.show_in_chat(txt);
          counterN++;
        }
        count++;
      }
    }
    new UserMessage(TWlang.UserMessage + counterN, UserMessage.TYPE_SUCCESS).show();
    if (Tweaker.items.count >= count) {
      Tweaker.show_in_chat(TWlang.noNew);
    }
  };
  Tweaker.init = function () {
    if (Tweaker.items.count === 0) {
      Tweaker.add_all();
    } else {
      Tweaker.show_new();
    }
  };
  Tweaker.add_all = function () {
    var count = 0;
    for (var i = 0; i < 300000; i++) {
      var item = ItemManager.getByBaseId(i);
      if (item !== undefined && Tweaker.items[item.item_id] === undefined) {
        Tweaker.items[item.item_id] = item.name;
        count++;
      }
    }
    if (count > 0) {
      Tweaker.items.count += count;
      localStorage.setItem('Tweaker_items', JSON.stringify(Tweaker.items));
      Tweaker.show_in_chat(TWlang.added + count);
    } else {
      Tweaker.show_in_chat(TWlang.noAdd);
    }
  };
  Tweaker.show_in_chat = function (text) {
    Tweaker.room.addMessage(Game.TextHandler.parse(text) + '<br/>');
  };
  Chat.Operations['^/items$'] = {
    cmd: 'items',
    shorthelp: TWlang.itemsShorthelp,
    help: TWlang.itemsHelp,
    usage: '/items',
    func: function (room, msg) {
      Tweaker.room = room;
      Tweaker.init();
    }
  };
  Chat.Operations['^/items.s (.+)$'] = {
    cmd: 'items.s',
    shorthelp: TWlang.itemssShorthelp,
    help: TWlang.itemssHelp,
    usage: '/items.s ' + TWlang.itemssUsage,
    func: function (room, msg, search) {
      Tweaker.room = room;
      Tweaker.search(search[1]);
    }
  };
  Chat.Operations['^/items.add$'] = {
    cmd: 'items.add',
    shorthelp: TWlang.itemsaddShorthelp,
    help: TWlang.itemsaddHelp,
    usage: '/items.add',
    func: function (room, msg) {
      Tweaker.room = room;
      Tweaker.add_all();
    }
  };
  Tweaker.players = {};
  FortBattleWindow.showBattleOrigin = FortBattleWindow.showBattle;
  FortBattleWindow.showBattle = function (response) {
    var id = this.fortId;
    if (!Tweaker.players[id]) {
      Tweaker.players[id] = {};
      FortBattle.cacheAll(0, id);
    }
    FortBattleWindow.showBattleOrigin.call(this, response);
  };
  // Add players on fort to localStorage
  //rewrite by while
  //@todo get fort position
  FortBattle.cacheAll = function (page, id) {
    Ajax.remoteCallMode('players', 'get_data', {
      x: Character.position.x,
      y: Character.position.y,
      page: page
    }, function (data) {
      data.players.forEach(function (player) {
        Tweaker.players[id][player.player_id] = player.name;
      });
      if (++page < data.pages)
        FortBattle.cacheAll(page, id);
    });
  };
  // Show advance information about player
  FortBattle.checkCompatibility = function () {
    if (!window.TWToolkit || TWToolkit.Preferences.preferences.fb_info === false) {
      FortBattle.getCharDataSheetOrigin = FortBattle.getCharDataSheet;
      FortBattle.getCharDataSheet = function (data) {
        return FortBattle.getCharDataSheetOrigin(data) + '<br/><div class=\'total_damage\'>' + TWlang.TotalDamage + ':<strong>%totalDmg%</strong> </div>' +
        '<div class=\'last_damage\'>' + TWlang.LastHit + ': <strong>%lastDmg%</strong></div>';
      };
      FortBattle.flashShowCharacterInfoOrigin = FortBattle.flashShowCharacterInfo;
      FortBattle.flashShowCharacterInfo = function (fortId, playerId, healthNow, healthMax, totalDmg, lastDmg, shotat, bonusdata, resp) {
        //Kill shot
        lastDmg = lastDmg == 65535 ? TWlang.KillShot : lastDmg;
        FortBattle.flashShowCharacterInfoOrigin(fortId, playerId, healthNow, healthMax, totalDmg, lastDmg, shotat, bonusdata);
        FortBattle.flashShowCharacterInfoEl(playerId);
      };
    }
  };
  $(document).ready(function () {
    setTimeout(FortBattle.checkCompatibility, 8000);
  });
  FortBattle.flashShowCharacterInfoEl = function (playerId) {
    if (parseInt(Chat.MyId.split('_')[1]) === playerId)
      return;
    setTimeout(function () {
      document.onkeyup = null;
    }, 2500);
    document.onkeyup = function (e) {
      e = e || window.event;
      e.preventDefault();
      var active_chat_input = $('input.message:visible'),
      keyCode = e.keyCode ? e.keyCode : e.charCode,
      nick = '';
      for (var n in Tweaker.players) {
        var tpn = Tweaker.players[n];
        if (tpn[playerId]) {
          nick = tpn[playerId];
          break;
        }
      }
      switch (keyCode) {
      case 16:
        /* shift */
        if (!nick)
          return;
        active_chat_input.val(active_chat_input.val() + '*' + nick + '* ' + TWlang.ChangeWith + '  ');
        break;
      case 17:
        /* ctrl */
        if (!nick)
          return;
        active_chat_input.val(active_chat_input.val() + '*' + nick + '* ');
        active_chat_input.focus();
        break;
      case 8:
        /* backspace */
        var client = Chat.Resource.Manager.getClient('client_' + playerId);
        var room = Chat.Resource.Manager.acquireRoom(client);
        if (room)
          room.openClick();
        break;
      default:
        break;
      }
      document.onkeyup = null;
      /*smth*/
    };
  };
  EventHandler.listen('chat_init', function () {
    for (var room in Chat.Resource.Manager.getRooms()) {
      var br = room.indexOf('room_alliance') === 0 ? '<br>' : '';
      if ((room.indexOf('room_town') === 0 || room.indexOf('room_alliance') === 0) && Chat.Resource.Manager.getRooms()[room].topic !== '') {
        $('<p style=\'left: 50%; position: absolute; top: 44px; margin-left: -305px; color: white; font-weight: bolder; font-size: 18px;\'>' + br + Chat.Resource.Manager.getRooms()[room].title + ': ' + Chat.Resource.Manager.getRooms()[room].topic + '</p>').appendTo('#ui_topbar');
      }
    }
  });
});
