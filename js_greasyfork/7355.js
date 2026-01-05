// ==UserScript==
// @name The West - Color tchat
// @namespace TomRobert
// @author Falc0n.RG (updated by Tom Robert)
// @description	Adds new features to the chat of The West
// @include	https://*.the-west.*/game.php*
// @exclude https://classic.the-west.net*
// @version	0.3.0.5
//
// @history 20/03/2019 : 0.3.0.5  bugfix
// @history 20/03/2019 : 0.3.0.4  bugfixes
// @history 24/06/2018 : 0.3.0.3  add greek translation (Timemod Herkumo)
// @history 25/11/2017 : 0.3.0.2  bugfix, fixed flip for non-BMP chars, all game smiley variants recognized
// @history 13/04/2017 : 0.3.0.1  fix button and lags
// @history 06/04/2017 : 0.3.0	  many bugfixes and improvements, better updater
// @history 21/10/2016 : 0.2.9.8	"dayofdead!" and "independence!" icon added
// @history 06/09/2016 : 0.2.9.7	"octoberfest!" icon added, flip mode improved, new forum links and choose language in script window, some bb code removed
// @history 26/02/2016 : 0.2.9.6	"hearts!" icon added, new jscolor version
// @history 30/03/2015 : 0.2.9.5	"easter!" icon added
// @history 28/03/2015 : 0.2.9.4	update function fixed
// @history 14/03/2015 : 0.2.9.3	little bugfix
// @history 08/03/2015 : 0.2.9.2	add polish translation (TeeNOmore127), beta really fixed
// @history 26/02/2015 : 0.2.9.1	more emojis
// @history 25/02/2015 : 0.2.9		Emoji Update!
// @history 11/02/2015 : 0.2.8.2	fix for the west beta
// @history 14/01/2015 : 0.2.8.1	TheWestApi improvement
// @history 07/01/2015 : 0.2.8		active for the west 2.16+, correct german translation (Tom Robert)
// @history 19/05/2014 : 0.2.7.3	active for the west 2.09, bug fix in selectbox
// @history 22/01/2014 : 0.2.7.2	active for the west 2.08
// @history 13/11/2013 : 0.2.7.1	active for the west 2.07
// @history 17/06/2013 : 0.2.7		active for the west 2.06
// @history 15/06/2013 : 0.2.7		add flip mode [hiden]
// @history 31/06/2013 : 0.2.7		add default/custom color for each tchat, save color for each tchat
// @history 27/06/2013 : 0.2.6.3	active for the west 2.05
// @history 18/06/2013 : 0.2.6.2	Bug fix smiley in first with one color tag
// @history 17/06/2013 : 0.2.6.1	Bug fix for firefox
// @history 17/06/2013 : 0.2.6		Add multi chat windows support, Disabled format for bdf
// @history 15/06/2013 : 0.2.5.2	fix bold with one color tag
// @history 25/05/2013 : 0.2.5.1	fix linear-gradiant to opera
// @history 13/05/2013 : 0.2.5		add support to the west 2.042 (beta)
// @history 13/02/2013 : 0.2.4.2	Bugfix on colorTxt.Window with Firefox
// @history 13/02/2013 : 0.2.4.1	Bugfix inserRule with Firefox
// @history 13/02/2013 : 0.2.4		active for the west 2.03
// @history 09/02/2013 : 0.2.3		[Only Beta2.03 version] rewrite for the west v2.03
// @history 23/11/2012 : 0.2.2		bugfix: update, rewrite and optimize the script
// @history 25/10/2012 : 0.2.1		finish text input and load/save system
// @history 23/10/2012 : 0.2.1		add more preset color (light red, pink, green), add load/save system (not full), add text input custom color
// @history 22/10/2012 : 0.2.1		bugfix leave chat
// @history 18/10/2012 : 0.2.0		active for the west 2.0
// @history 14/10/2012 : 0.1.9		[Only Beta2.0 version] add more smilies
// @history 06/10/2012 : 0.1.9		[Only Beta2.0 version] add selectbox smilies
// @history 05/10/2012 : 0.1.9		[Only Beta2.0 version] Add item tag
// @history 15/09/2012 : 0.1.9		[Only Beta2.0 version] rewrite to the west v2.0 [many function disabled]
// @history 15/09/2012 : 0.1.8.1	adapt the system update for 2.0
// @history 15/09/2012 : 0.1.8		disabled the script in 2.0 and beta
// @history 11/05/2012 : 0.1.7		add bdf format
// @history 11/05/2012 : 0.1.6		add custom color save, add bdf color change, add bolt choice, change smiley insert [bug with opera][chrome and firefox good]
// @history 04/05/2012 : 0.1.6		change prompt for tell name select
// @history 04/05/2012 : 0.1.5		add update system for chrome and firefox, add opera support
// @history 04/05/2012 : 0.1.4b		debug Multi Language system (sorry for the missing)
// @history 30/04/2012 : 0.1.4		add Multi Language system
// @history 30/04/2012 : 0.1.3		add preset color: '505606607709809', change CBImg, add smiley detect and activate smiley Div (and change this), Bug Fix command color, change all <a> to <div>
// @history 29/04/2012 : 0.1.2		Bug Fix
// @history 29/04/2012 : 0.1.1		add color tchat window
// @history 27/04/2012 : 0.1.0		First Public Version
// @grant none
/*********************************************************************************************************************
 * jscolor, JavaScript Color Picker
 *
 * @version 1.4.5
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2015-09-19
 * @link    http://jscolor.com
 **********************************************************************************************************************/
// @downloadURL https://update.greasyfork.org/scripts/7355/The%20West%20-%20Color%20tchat.user.js
// @updateURL https://update.greasyfork.org/scripts/7355/The%20West%20-%20Color%20tchat.meta.js
// ==/UserScript==
// translation:Falc0n.RG(French),pepe100(Spanish),Tom Robert(German&English),?(Portuguese),TeeNOmore127(Polish)
(function (e) {
  var t = document;
  var n = document.createElement('script');
  n.type = 'application/javascript';
  n.textContent = '(' + e + ')();';
  (t.body || t.head || t.documentElement).appendChild(n);
  n.parentNode.removeChild(n);
})(function () {
  CT = {
    version: '0.3.0.5',
    name: 'Color tchat',
    author: 'Falc0n.RG (updated by Tom Robert)',
    minGame: '2.0',
    maxGame: Game.version.toString(),
    website: 'https://greasyfork.org/scripts/7355',
    DATA: {},
    Window: {},
    Chat: {},
    Tools: {},
    langs: {
      en: {
        language: 'English',
        save: 'Save',
        saveMessage: 'Successfully saved',
        chooseLang: 'Choose language',
        contact: 'Contact',
        ColorWindowTitle: 'Color tchat setting',
        ColorWindowPreviewTxt: '*Click on the letters to change color',
        ColorWindowOkBtn: 'Apply',
        ColorWindowToDefaultBtn: 'Set to default',
        ColorWindowThisTchatBtn: 'Set to this',
        ColorWindowDefaultText: 'Select the tchat for reset to default: ',
        ColorWindowBold: 'Bold',
        ColorWindowCaps: 'Capitalized',
        ColorWindowFlip: 'Flip',
        ColorBtnTitle: '',
        ColorLoadListName: [
          'No color',
          'Enter a color code',
          'red',
          'brown',
          'purple',
          'blue',
          'green',
          'pink',
          'magenta',
          'violet gradient',
          'degraded dark blue',
          'green gradient',
          'degraded red',
          'blue gradient light',
          'degraded pink',
          'light green gradient',
          'degraded pink',
          'red gradient light'
        ],
        ColorLoadTitle: 'Click to load another color code<br>The current color code is: ',
        ColorSaveEmpty: '[empty]',
        CustomReady: 'Valid Code',
        CustomNotReady: 'Invalid Code',
      },
      fr: {
        language: 'French (français)',
        save: 'Sauvegarder',
        saveMessage: 'Enregistrer avec succès',
        chooseLang: 'Choisissez la langue',
        contact: 'Contact',
        ColorWindowTitle: 'Configurer Color tchat',
        ColorWindowPreviewTxt: '*Clickez sur la lettre à changer de couleur',
        ColorWindowOkBtn: 'Appliquer',
        ColorWindowToDefaultBtn: 'Par défaut',
        ColorWindowThisTchatBtn: 'Pour se tchat',
        ColorWindowDefaultText: 'Sélectionnez les tchat à Remettre par défaut:',
        ColorWindowBold: 'En gras',
        ColorWindowCaps: 'En majuscule',
        ColorWindowFlip: 'Flip',
        ColorBtnTitle: '',
        ColorLoadListName: [
          'Sans couleur',
          'Entrer des couleurs',
          'rouge',
          'marron',
          'violet',
          'bleu',
          'vert',
          'rose',
          'magenta',
          'dégradé violet',
          'dégradé bleu foncé',
          'dégradé vert',
          'dégradé rouge',
          'dégradé bleu clair',
          'dégradé rose',
          'dégradé vert clair',
          'dégradé rose clair',
          'dégradé rouge clair'
        ],
        ColorLoadTitle: 'Clickez pour charger un autre code couleur<br>Le code couleur actuel est: ',
        ColorSaveEmpty: '[vide]',
        CustomReady: 'Code valide',
        CustomNotReady: 'Non valide',
      },
      es: {
        language: 'Spanish (español)',
        save: 'Guardar',
        saveMessage: 'Guardar correctamente',
        chooseLang: 'Elige lengua',
        contact: 'Contacto',
        ColorWindowTitle: 'Configurar Color tchat',
        ColorWindowPreviewTxt: '*Haga clic en la carta de un cambio de color',
        ColorWindowOkBtn: 'Aplicar',
        ColorWindowToDefaultBtn: 'Color por defecto',
        ColorWindowThisTchatBtn: 'Elegir este color',
        ColorWindowDefaultText: 'Seleccione la tchat para restablecer a los valores predeterminados',
        ColorWindowBold: 'En negrita',
        ColorWindowCaps: 'Capitalizado',
        ColorWindowFlip: 'Flip',
        ColorBtnTitle: '',
        ColorLoadListName: [
          'No hay color',
          'Introduzca un código de color',
          'rojo',
          'marrón',
          'morado',
          'azul',
          'verde',
          'rosa',
          'magenta',
          'gradiente violeta',
          'degradado rosa',
          'degradado azul marino',
          'gradient',
          'rojo degradado',
          'luz azul degradado',
          'gradiente de luz verde',
          'rosa degradado',
          'luz pendiente roja'
        ],
        ColorLoadTitle: 'Haga clic para cargar otro código de colores<br>El código de color actual es: ',
        ColorSaveEmpty: '[vacío]',
        CustomReady: 'Código válido',
        CustomNotReady: 'No válido',
      },
      de: {
        language: 'German (Deutsch)',
        save: 'Speichern',
        saveMessage: 'Speichern erfolgreich',
        chooseLang: 'Sprache ändern',
        contact: 'Kontakt',
        ColorWindowTitle: 'Color tchat Einstellung',
        ColorWindowPreviewTxt: '*Klicke auf diese Buchstaben um die aktuell im oberen Feld gewählte Farbe reinzumischen',
        ColorWindowOkBtn: 'Übernehmen',
        ColorWindowToDefaultBtn: 'Zurücksetzen',
        ColorWindowThisTchatBtn: 'Einstellung speichern',
        ColorWindowDefaultText: 'Chaträume auf Standard setzen:',
        ColorWindowBold: 'Fett',
        ColorWindowCaps: 'CAPS LOCK',
        ColorWindowFlip: 'Flip',
        ColorBtnTitle: '',
        ColorLoadListName: [
          'Keine Farbe',
          'Eigener Farbcode',
          'rot',
          'braun',
          'violett',
          'blau',
          'grün',
          'pink',
          'magenta',
          'violett wechselnd',
          'blau wechselnd',
          'grün wechselnd',
          'rot wechselnd',
          'hellblau wechselnd',
          'pink wechselnd',
          'hellgrün wechselnd',
          'pink wechselnd',
          'hellrot wechselnd'
        ],
        ColorLoadTitle: 'Klicke um weitere Farben auszuwählen<br>Aktueller Farbcode: ',
        ColorSaveEmpty: '[leer]',
        CustomReady: 'Code ok',
        CustomNotReady: 'Ungültig',
      },
      pt: {
        language: 'Portuguese (português)',
        save: 'Salvar',
        saveMessage: 'Economize com sucesso',
        chooseLang: 'Escolhe idioma',
        contact: 'Contato',
        ColorWindowTitle: 'Set Color tchat',
        ColorWindowPreviewTxt: '*Clique na letra de uma mudança de cor',
        ColorWindowOkBtn: 'Aplicar',
        ColorWindowToDefaultBtn: 'Definido como padrão',
        ColorWindowThisTchatBtn: 'Definido para este',
        ColorWindowDefaultText: 'Selecione o tchat para repor as predefinições: ',
        ColorWindowBold: 'Em negrito',
        ColorWindowCaps: 'Capitalizados',
        ColorWindowFlip: 'Flip',
        ColorBtnTitle: '',
        ColorLoadListName: [
          'Incolor',
          'Insira um código de cor',
          'vermelho',
          'marrom',
          'roxo',
          'azul',
          'verde',
          'cor de rosa',
          'magenta',
          'gradiente violeta',
          'gradiente azul escuro',
          'gradiente verde',
          'gradiente vermelho',
          'gradiente de luz azul',
          'Pink Gradient',
          'gradiente luz verde',
          'rosa Gradiente',
          'gradiente claro vermelho'
        ],
        ColorLoadTitle: 'Clique para carregar outro código de cor<br>O código de cores atual é: ',
        ColorSaveEmpty: '[vazio]',
        CustomReady: 'Código válido',
        CustomNotReady: 'Inválido',
      },
      pl: {
        language: 'Polish (polski)',
        save: 'Zapisz',
        saveMessage: 'Zapisz powodzeniem',
        chooseLang: 'Wybierz język',
        contact: 'Kontakt',
        ColorWindowTitle: 'Ustawienia Koloru Tchat',
        ColorWindowPreviewTxt: '*Kliknij na literę, aby zmienić kolor',
        ColorWindowOkBtn: 'Zastosuj',
        ColorWindowToDefaultBtn: 'Ustaw na domyślny',
        ColorWindowThisTchatBtn: 'Ustaw na ten',
        ColorWindowDefaultText: 'Wybierz tchat, który ma być domyślny: ',
        ColorWindowBold: 'Grubość',
        ColorWindowCaps: 'Wielkie litery',
        ColorWindowFlip: 'Flip',
        ColorBtnTitle: '',
        ColorLoadListName: [
          'Bez koloru',
          'Wprowadź kod koloru',
          'Czerwony',
          'Brązowy',
          'Fioletowy',
          'Niebieski',
          'Zielony',
          'Różowy',
          'Purpurowy',
          'Fioletowo gradientowy',
          'Zwietrzały ciemny niebieski',
          'Zielony gradient',
          'Zwietrzały czerwony',
          'Jasnoniebieski gradient',
          'Zwietrzały ciemny różowy',
          'Jasnozielony gradient',
          'Zwietrzały różowy',
          'Jasnoczerwony gradient'
        ],
        ColorLoadTitle: 'Kliknij tutaj, aby załadować inny kod koloru<br>Twój obecny kod koloru jest: ',
        ColorSaveEmpty: '[pusty]',
        CustomReady: 'Prawidłowy Kod',
        CustomNotReady: 'Zły Kod',
      },
      el: {
        language: 'Greek (ελληνικά)',
        save: 'Αποθήκευση',
        saveMessage: 'Αποθηκεύτηκε με επιτυχία',
        chooseLang: 'Επιλογή γλώσσας',
        contact: 'Επικοινωνία',
        ColorWindowTitle: 'Ρυθμίσεις',
        ColorWindowPreviewTxt: '*Κάντε κλικ στα γράμματα για να αλλάξετε χρώμα',
        ColorWindowOkBtn: 'Εφαρμογή',
        ColorWindowToDefaultBtn: 'Προεπιλογή',
        ColorWindowThisTchatBtn: 'Ορίστε σε αυτό',
        ColorWindowDefaultText: 'Select the tchat for reset to default: ',
        ColorWindowBold: 'Έντονα',
        ColorWindowCaps: 'Κεφαλαία',
        ColorWindowFlip: 'Ανάποδα',
        ColorBtnTitle: '',
        ColorLoadListName: [
          'Χωρίς χρώμα',
          'Καταχωρίστε έναν κωδικό χρώματος',
          'Κόκκινο',
          'Καφέ',
          'Μωβ',
          'Μπλε',
          'Πράσινο',
          'Ροζ',
          'Σκούρο μωβ',
          'Βιολετί',
          'Ξεθωριασμένο σκούρο μπλε',
          'Ανοιχτό πράσινο',
          'Υποβαθμισμένο κόκκινο',
          'Γαλάζιο',
          'Ξεθωριασμένο σκούρο ροζ',
          'Λαχανί',
          'Ξεθωριασμένο ροζ',
          'Φωτεινό κόκκινο'
        ],
        ColorLoadTitle: 'Κάντε κλικ για να τοποθετήσετε έναν άλλο κωδικό χρώματος<br>Ο τρέχων κωδικός χρώματος είναι: ',
        ColorSaveEmpty: '[Άδειο]',
        CustomReady: 'Έγκυρος κωδικός',
        CustomNotReady: 'Μη έγκυρος κωδικός',
      },
    },
    updateLang: function () {
      var lg = CT.langs;
      CT.lang = lg[localStorage.getItem('scriptsLang')] ? localStorage.getItem('scriptsLang') : lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : 'en';
      CTlang = lg[CT.lang];
    },
  };
  CT.updateLang();
  var langBox = new west.gui.Combobox();
  for (var j in CT.langs)
    langBox.addItem(j, CT.langs[j].language);
  langBox.select(CT.lang);
  var saveBtn = new west.gui.Button(CTlang.save, function () {
      localStorage.setItem('scriptsLang', langBox.getValue());
      CT.updateLang();
      new UserMessage(CTlang.saveMessage, 'success').show();
    }),
  fmfb = function (l) {
    return 'https://forum.the-west.' + l + '/index.php?conversations/add&to=Tom Robert';
  };
  TheWestApi.register('Color_tchat', CT.name, CT.minGame, CT.maxGame, CT.author, CT.website).setGui($('<div>' + CTlang.chooseLang +
      ': </div>').append(langBox.getMainDiv()).append(saveBtn.getMainDiv()).append('<br><br>This script adds new features to the chat:<br>Smileys, BB-Codes and Emojis! 🐧🎉<br><br><i>' +
      CT.name + ' v' + CT.version + '</i><br><br><br><b>' + CTlang.contact +
      ':</b><ul style="margin-left:15px;"><li>Send a message to <a target=\'_blanck\' href="http://om.the-west.de/west/de/player/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert on German world Arizona</a></li>' +
      '<li>Contact me on <a target=\'_blanck\' href="https://greasyfork.org/forum/messages/add/Tom Robert">Greasy Fork</a></li>' +
      '<li>Message me on one of these The West Forum:<br>/ <a target=\'_blanck\' href="' + fmfb('de') + '">deutsches Forum</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('net') + '">English forum</a> / <a target=\'_blanck\' href="' + fmfb('pl') + '">forum polski</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('es') + '">foro español</a> /<br>/ <a target=\'_blanck\' href="' + fmfb('ru') + '">Русский форум</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('fr') + '">forum français</a> / <a target=\'_blanck\' href="' + fmfb('it') + '">forum italiano</a> / ' +
      '<a target=\'_blanck\' href="https://forum.beta.the-west.net//index.php?conversations/add&to=Tom Robert">beta forum</a> /<br>I will get an e-mail when you sent me the message <img src="images/chat/emoticons/smile.png"></li></ul>'));
  CT.DATA = new function () {
    this.Setting = {
      saves: {
        'save 1': '999',
        'save 2': '999',
        'save 3': '999',
        'save 4': '999',
        'save 5': '999'
      },
      Default: {
        Format: '%c',
        colorTag: '999'
      },
    };
    this.Load = function () {
      this.Setting = JSON.parse(localStorage.getItem('CT_save')) || this.Setting;
    };
    this.Load();
    this.Save = function () {
      localStorage.CT_save = JSON.stringify(this.Setting);
    };
  };
  CT.Tools = new function () {
    this.colorTagInv = function (e) {
      if (e == null || e == undefined)
        return '';
      if (e.length == 3)
        return '';
      var t = '';
      for (var n = 1; n < e.length / 3 - 1; n++) {
        t = e.substring(n * 3, n * 3 + 3) + t;
      }
      return t;
    };
    this.Degrader = function (e) {
      var t;
      if (e.length == 3)
        t = '#' + this.colorrgb(e);
      else {
        t = 'linear-gradient(to right, ';
        for (var n = 0; n < e.length / 3; n++) {
          t += '#' + this.colorrgb(e.substring(n * 3, n * 3 + 3));
          if (n !== e.length / 3 - 1)
            t += ',';
        }
        t += ')';
      }
      return t;
    };
    this.colorrgb = function (e) {
      result = '';
      TransCode = {
        0: '0',
        1: '1',
        2: '3',
        3: '5',
        4: '6',
        5: '8',
        6: 'a',
        7: 'b',
        8: 'd',
        9: 'f'
      };
      for (var t = 0; t < e.length; t++) {
        result += TransCode[e.substring(t, t + 1)];
      }
      return result;
    };
    this.GuiSelectbox = west.gui.Selectbox;
    this.Guicheckbox = west.gui.Checkbox;
    this.Guitextfield = west.gui.Textfield;
    this.Guibutton = west.gui.Button;
    this.Guidialog = west.gui.Dialog;
  };
  CT.Chat = new function () {
    this.init = function () {
      if (!$('div.chat_room').length)
        return;
      clearInterval(CT.initInterval);
      this.Draw();
      CT.initInterval = setInterval(function () {
          CT.Chat.OnChanelChange();
        }, 500);
    };
    this.Draw = function () {
      if (isDefined(this.btncolor))
        return;
      var e;
      $('#colorTxtStyle').append('div.btnColor{cursor: pointer;position: absolute;right: 0px; width: 25px;height: 25px;}\n');
      $('#colorTxtStyle').append('div.btnColorBG{background-image: url(data:image/png;base64,' + border + ');background-position: 0px 3px;background-repeat: no-repeat;}\n.btnColorBG:hover{background-position: -25px 3px;}\n');
      $('#colorTxtStyle').append('div.btnColorImg{width: 11px; height: 11px; margin: 8px 0px 0px 5px; position: absolute; border-radius: 5px; background-image: url(data:image/png;base64,' + color + ');}\n');
      $('#colorTxtStyle').append('div.btnColorSmiley{border-top-right-radius: 10px;border-top-left-radius: 10px;border: 1px solid #646464;box-shadow: 0px 0px 1px 1px black;background-image: url(images/interface/wood_texture_dark.jpg);width: 425px;bottom: 18px;left: -400px;height: 208px;\tmargin: 0px 0px 6px 0px; position: absolute;}\n');
      $('#colorTxtStyle').append('div.btnColorOneSmiley{display: inline-block; cursor: pointer; width: 17px; height: 13px; padding: 1px; text-align: center; vertical-align: middle;}\n');
      this.btncolor = $('<div class="btnColor btnColorBG"/>').append($('<div class="btnColorImg btnColorImgTag"/>').click(function () {
            CT.Window.show();
          })).append(e = $('<div class="btnColorSmiley"/>').hide()).mouseout(function () {
          $('div.btnColorSmiley:last-child', this).hide();
        }).mouseover(function () {
          $('div.btnColorSmiley:last-child', this).show();
        });
      for (var t in sm) {
        if (sm[t] !== '') {
          e.append($('<div class="btnColorOneSmiley"/>').data('Tag', t).click(this.addSmToTxt).append(sm[t]));
        }
      }
    };
    this.addSmToTxt = function (e) {
      var inp = $(e.target).parentsUntil($('div.chat_main')).find('input');
      var n = $(e.currentTarget).data('Tag');
      var r = inp[0].selectionStart;
      var i = inp[0].selectionEnd;
      var s = inp.val();
      if (n == '[player][/player]') {
        s = s.substring(0, r) + '[player]' + s.substring(r, i) + '[/player]' + s.substring(i);
      } else if (n == '[item=]') {
        s = s.substring(0, r) + '[item=' + s.substring(r, i) + ']' + s.substring(i);
      } else {
        s = s.substring(0, r) + ' ' + n + s.substring(r);
      }
      inp.val(s);
    };
    this.appliquer_couleur = function (e, t) {
      if (e == '')
        return '';
      if (t == '999' && !CT.DATA.Setting.Default.Format.startsWith('/111* '))
        return e;
      if (e.toLowerCase().indexOf('[player]') == 0 && e.toLowerCase().indexOf('[/player]') !== -1)
        return e.substring(0, e.toLowerCase().indexOf('[/player]') + 10) + ' ' + this.appliquer_couleur(e.substring(e.toLowerCase().indexOf('[/player]') + 10), t);
      if (e.toLowerCase().indexOf('[report=') == 0 && e.toLowerCase().indexOf('[/report]') !== -1)
        return e.substring(0, e.toLowerCase().indexOf('[/report]') + 10) + ' ' + this.appliquer_couleur(e.substring(e.toLowerCase().indexOf('[/report]') + 10), t);
      if (e.toLowerCase().indexOf('http') == 0)
        if (e.indexOf(' ') !== -1)
          return e.substring(0, e.indexOf(' ') + 1) + ' ' + this.appliquer_couleur(e.substring(e.indexOf(' ') + 1), t);
        else
          return e;
      if (e.toLowerCase().indexOf('[item=') == 0 && e.indexOf(']') !== -1)
        return e.substring(0, e.indexOf(']') + 1) + ' ' + this.appliquer_couleur(e.substring(e.indexOf(']') + 1), t);
      if (e.toLowerCase().indexOf('[marker') == 0 && e.indexOf(']') !== -1)
        return e.substring(0, e.indexOf(']') + 1) + ' ' + this.appliquer_couleur(e.substring(e.indexOf(']') + 1), t);
      for (var n in sm) {
        if (e.indexOf(n) == 0)
          return e.substring(0, n.length) + ' ' + this.appliquer_couleur(e.substring(n.length), t);
      }
      if (t.length == 3)
        return '/' + t + e;
      if (e.charAt(0) == ' ')
        return e.charAt(0) + this.appliquer_couleur(e.substring(1), t.substring(3) + t.substring(0, 3));
      return '/' + t.substring(0, 3) + e.charAt(0) + ' ' + this.appliquer_couleur(e.substring(1), t.substring(3) + t.substring(0, 3));
    };
    this.fCharAt = function (str, idx) {
      str += '';
      var ret = '',
      end = str.length,
      surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      while ((surrogatePairs.exec(str)) != null) {
        var li = surrogatePairs.lastIndex;
        if (li - 2 < idx)
          idx++;
        else
          break;
      }
      if (idx >= end || idx < 0)
        return '';
      ret += str.charAt(idx);
      if (/[\uD800-\uDBFF]/.test(ret) && /[\uDC00-\uDFFF]/.test(str.charAt(idx + 1)))
        ret += str.charAt(idx + 1);
      return ret;
    };
    this.flipString = function (e) {
      if (e.length === 0)
        return '';
      var eO = this.fCharAt(e, 0);
      for (var p in fl)
        if (p == eO)
          return this.flipString(e.substring(eO.length)) + fl[p];
        else if (fl[p] == eO)
          return this.flipString(e.substring(eO.length)) + p;
      return this.flipString(e.substring(eO.length)) + eO;
    };
    this.OnPressKeyEnter = function (e) {
      var obj = $.extend({}, $(e.target).data('ColorTchat'));
      var n = $(e.target).val();
      if (n.charAt(0) == '/') {
        if (n.substring(0, 6) == '/tell ') {
          if (n.indexOf(':') !== -1) {
            var r = n.substring(6, n.indexOf(':') + 1);
            n = n.substring(n.indexOf(':') + 1);
          }
        } else {
          var i = [
            '/topic',
            '/clear',
            '/logout',
            '/ignorelist',
            '/ignore',
            '/unignore',
            '/rights',
            '/color',
            '/me',
            '/help',
            '/?',
            '/join',
            '/items',
            '/items.s',
            '/items.add',
          ];
          for (var s = 0; s < i.length; s++) {
            if (n.substring(0, i[s].length) == i[s]) {
              return;
            }
          }
        }
      }
      if (/\/flip /.test(n.substring(0, 6))) {
        obj.Format = '%f';
        n = n.substring(6);
      }
      if (/\/[0-9]{3}/.test(n.substring(0, 5))) {
        obj.Format = '%n';
      }
      if (typeof r !== 'undefined')
        obj.Format = '/tell %t:' + obj.Format;
      var cT = function () {
        var te = '',
        co = obj.colorTag;
        if (!co || co.length % 3 !== 0)
          return '999';
        if (co.length !== 3) {
          for (var n = 1; n < co.length / 3 - 1; n++)
            te = co.substring(n * 3, n * 3 + 3) + te;
          return co + te;
        } else
          return co;
      }
      (),
      code = /%[C-n]/.exec(obj.Format)[0],
      newN;
      switch (code) {
      case '%c':
        newN = this.appliquer_couleur(n, cT);
        break;
      case '%C':
        newN = this.appliquer_couleur(n, cT).toUpperCase();
        break;
      case '%f':
        var u = this.flipString(n);
        newN = this.appliquer_couleur(u, cT);
        break;
      case '%F':
        var f = this.flipString(n.toUpperCase());
        newN = this.appliquer_couleur(f, cT);
        break;
      default: //%n
        newN = n;
        break;
      }
      $(e.target).val(obj.Format.replace(code, newN));
    };
    this.OnChanelChange = function () {
      if (!$('div.chat_room').length)
        return;
      clearInterval(CT.initInterval);
      $('div.chat_room').find('.chat_input').each(function (e) {
        if (!$(this).children().is('.btnColor')) {
          $(this).append(CT.Chat.btncolor.clone(true));
          $(this).find('input.message').keypress(function (e) {
            if (e.keyCode == 13) {
              CT.Chat.OnPressKeyEnter(e);
              document.focusing = undefined;
            }
          }).data('ColorTchat', CT.DATA.Setting.Default);
          CT.Chat.Change = true;
        }
      });
      this.ChangeColor();
      CT.initInterval = setInterval(function () {
          CT.Chat.OnChanelChange();
        }, 500);
    };
    this.ChangeColor = function () {
      if (this.Change === false)
        return;
      this.Change = false;
      var e = CT.DATA.Setting.Default.colorTag;
      if (pos[e])
        $('#colorTxtStyleTmp').text('div.btnColorImgTag{background-position: ' + pos[e] + '; z-index: 6}\n');
      else
        $('#colorTxtStyleTmp').text('div.btnColorImgTag{background: ' + CT.Tools.Degrader(e) + '}\n');
      $('div.chat_room').each(function (e) {
        $(this).find('input.message').data('ColorTchat', CT.DATA.Setting.Default);
      });
    };
    var fl = {
      a: 'ɐ',
      A: 'Ɐ',
      b: 'q',
      B: '𐐒',
      c: 'ɔ',
      C: 'Ɔ',
      d: 'p',
      D: 'ᗡ',
      e: 'ǝ',
      E: 'Ǝ',
      f: 'ɟ',
      F: 'Ⅎ',
      g: 'ƃ',
      G: '⅁',
      h: 'ɥ',
      i: 'ᴉ',
      j: 'ɾ',
      J: 'ſ',
      k: 'ʞ',
      K: 'ʞ',
      l: 'ן',
      L: '⅂',
      m: 'ɯ',
      M: 'W',
      n: 'u',
      N: 'N',
      P: 'Ԁ',
      Q: 'Ὁ',
      r: 'ɹ',
      R: 'ᴚ',
      t: 'ʇ',
      T: '⊥',
      U: '∩',
      v: 'ʌ',
      V: 'Ʌ',
      w: 'ʍ',
      y: 'ʎ',
      Y: '⅄',
      1: 'ɩ',
      2: 'ζ',
      3: 'Ɛ',
      4: 'ᔭ',
      5: 'ﻛ',
      6: '9',
      7: 'ㄥ',
      '.': '˙',
      '[': ']',
      '(': ')',
      '{': '}',
      '?': '¿',
      '!': '¡',
      '\'': ',',
      '<': '>',
      '_': '‾',
      ';': '؛',
      '&': '⅋',
      '"': '„',
      '‿': '⁀',
      '⁅': '⁆',
      '∴': '∵',
    },
    sm = {
      ':-)': '',
      ':)': '<img src ="images/chat/emoticons/smile.png">',
      ':-D': '',
      ':D': '<img src ="images/chat/emoticons/grin.png">',
      ':-(': '',
      ':(': '<img src ="images/chat/emoticons/frown.png">',
      ';-)': '',
      ';)': '<img src ="images/chat/emoticons/smirk.png">',
      ':-p': '',
      ':p': '',
      ':-P': '',
      ':P': '<img src ="images/chat/emoticons/tongue.png">',
      '-.-': '<img src ="images/chat/emoticons/nc.png">',
      '^_^': '',
      '^^': '<img src ="images/chat/emoticons/happy.png">',
      'O.o': '',
      'o.O': '',
      'O_o': '',
      'o_O': '<img src ="images/chat/emoticons/oo.png">',
      ':-/': '',
      ':/': '<img src="images/chat/emoticons/sore.png">',
      '=:)': '<img src="images/chat/emoticons/invader.png">',
      '>:(': '<img src="images/chat/emoticons/angry.png">',
      'T_T': '',
      'T.T': '',
      ':\'(': '<img src="images/chat/emoticons/cry.png">',
      ':-o': '',
      ':o': '',
      ':-O': '',
      ':O': '<img src="images/chat/emoticons/ohmy.png">',
      ':-x': '',
      ':x': '',
      ':-X': '',
      ':X': '<img src="images/chat/emoticons/muted.png">',
      ':-|': '',
      ':|': '<img src="images/chat/emoticons/silent.png">',
      '>_<': '',
      '>.<': '<img src="images/chat/emoticons/palm.png">',
      'X_X': '',
      'x_x': '',
      'X.X': '',
      'x.x': '<img src="images/chat/emoticons/xx.png">',
      'el pollo diablo!': '<img src ="images/chat/emoticons/elpollodiablo.png">',
      '!el pollo diablo': '<img src ="images/chat/emoticons/elpollodiablo_mirror.png">',
      'el pollo diablo?!': '<img src ="images/chat/emoticons/elpollodiablo_front.png">',
      'addme!': '<img src="images/chat/emoticons/sheep_rainbow.gif">',
      'addme': '<img src="images/chat/emoticons/sheep.gif">',
      '[player][/player]': '<div style="background-image: url(images/tw2gui/tw2gui_bbcodes.png); background-position:-88px 20px; width: 21px; height: 20px">',
      '[item=]': '<img src="images/forum/icon/cowboy_boots.png" style="background: url(images/tw2gui/tw2gui_bbcodes.png); background-position:-22px 20px; width: 21px; height: 20px">',
    },
    em = [
      '😄', '😃', '😀', '😊', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '😮', '😬', '😐', '😕', '😯', '😶', '😇', '😏', '😑', '🙈', '🙉', '🙊', '💀', '👽', '💩', '🔥', '🌟', '💫', '💦', '💧', '💤', '💨', '👍', '👎', '👌', '👊', '✌️', '👋', '👉', '👈', '🙌', '🙏', '👏', '💪', '🎩', '👑', '👒', '💼', '👜', '👓', '🌂', '💛', '💙', '💜', '💚', '❤️', '💔', '💗', '💓', '💕', '💘', '💌', '💋', '💍', '💎', '💬', '💭', '🐶', '🐺', '🐱', '🐭', '🐹', '🐰', '🐸', '🐯', '🐨', '🐻', '🐷', '🐮', '🐗', '🐵', '🐒', '🐴', '🐑', '🐘', '🐼', '🐧', '🐦', '🐤', '🐔', '🐍', '🐢', '🐛', '🐝', '🐜', '🐞', '🐌', '🐙', '🐚', '🐠', '🐟', '🐬', '🐳', '🐋', '🐄', '🐏', '🐀', '🐃', '🐅', '🐇', '🐉', '🐎', '🐐', '🐓', '🐕', '🐖', '🐁', '🐂', '🐡', '🐊', '🐫', '🐪', '🐆', '🐈', '🐩', '☀️', '⛅️', '☁️', '⚡️', '☔️', '❄️', '⛄️', '🌁', '🌈', '🌊', '🎓', '🎃', '🎅', '🎄', '🎁', '🎉', '🎊', '🎈', '📱', '📞', '⏰', '🔒', '🚿', '🚽', '🚬', '💣', '🔫', '🔪', '💰', '✂️', '🎤', '🎧', '🎶', '🎻', '🎺', '🎷', '🎸', '🎮', '🏈', '🏀', '⚽️', '⚾️', '🎾', '🎳', '⛳️', '🏁', '🏆', '🎿', '🏂', '🏊', '🏄', '☕️', '🍸', '🍹', '🍷', '🍴', '🍕', '🍔', '🍟', '🍳', '🍩', '🍦', '🍨', '🍪', '🍫', '🍬', '🍭', '🍎', '🍇', '🍓', '🍌', '🍍', '🍅',
    ],
    EvName = Object.keys(Game.sesData)[0];
    for (var j of em)
      sm[j] = j;
    if (EvName == 'Easter')
      sm['easter!'] = '<div style="background-image: url(images/window/events/easter/easter_sprite.png); background-position:-20px 0px; width: 17px; height: 20px">';
    else if (EvName)
      sm[EvName.toLowerCase() + '!'] = '<img src="images/icons/' + EvName + '.png">';
    var color = 'iVBORw0KGgoAAAANSUhEUgAAAGAAAAAMCAYAAACdrrgZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHpsAACAjgAA+FQAAIITAAB2OwAA9IEAADvkAAAbd5lS/4AAAAbDSURBVHja7JhLaBzZFYa/c6tf1a12Sy3Zssex/GLG8VtOsDMTDCFMCJ10IK9NZhGyCEMgRHgQCLLLLgjvBrwNIZBVCMoL4gweyGJs8DgeO57YHnvkka2XLcmtV6vV1V2tqpNFXbValmyPFtnlwEWl29/96697zj0qtfz0q7v1zpTH8FMPVeVQV5rjr7hozFA9m6Z2MgVA4oZH8kqVBCGqyoh7jD31YVJhDcUQAqohNUkykTjIfu8TUKicvCxsId7fs5ctRTy2JfzqL7cmf0t1S/yXt/C0BxTM7cdVbk5UWPYDqo2QGxMVbpc8KqdTVL+WIcg5BDkH7+tt1M5mEAURZfjBfa48Noz7aUQENGSiluTqlMP4xCjGwCbevw9cBGbtuGjnnhdb54WLCLN2vJQXuGhg1sCs/A/8CFyUSHtTfXP/aS3aQARVEBFuz3ssv54GWUunAPXTLkLITNUhmJxmmhjlaoMgXAFgZr5C2c1SH52g5DkYsy4D54EhhAKGPA55hAIwZD97NiwvBRyTxzF5jDyfF86jDFGnwDJ5KuSpUUA35wXOKwwtQ2Ee8vOQr0IhhCF5gR8DBQfyDuQNL/av6FCNaqHCQr7CYr6GV1DCdfoGiEpVFRFBW8tWlSg1gtokeOrwn3o7fwpW+PHYI+rBCo7j4MQcJObw1sgwQ40Gt+vbaBhnVakIDEQCQAmYAapWFAYss5FfrsHjhWgs1Z7PKwNUgTlg2urP23voel6gGMDAokXHgHF7vQQEMCCb+BFg0fJjQLlpf6MfJRiossg8T5hhjGlGmWcKjyWUsMmbfR0JAiAUIVAlBF7NJUlf9xAjYAREMUZI3qoxNie8MzrOaQ3Z2Z7js4rgh+AHykjVwQVOo7wzOsHEXPMEnWtu/hTwwI4pOyeWWYtziEDFh0cl+Hg8GqMlWPZXT+a5lnI+h293r2R1p+x1GWhYpkW/bvPzGHgEPAQm7VydjX7ESg0DV4EP7fVSs4rXeIFzPjXKzFJikilGmGaEEhOUmcOnjlg+drzbJes4PCjVEISDnUkO5l34YBkagnfGRQH3mof7UZV7NZc3vSegytN4gtlFj0rmNVBlvvwp0/E4VKu8uVzm17VuzkaeehFbjTPAZy19LQekAaW35YF7MRJV/ORCtPmr0ZmFbAoCXc+vADW7S6WWT9KADyTX9AV6faBiG/lkC74N6AAy0NvSC3odW/0PgX/ZTTfATqAdCFnv36eOxxJLzPKUcQQDCBlyNMiTxO0FiMWN4btdOzncmQMR7pkF7kqZIDAMX/kWdz74HiAcc/7Midhf2Lvd8N5Cjp6FOe5Xlzi8u52PHi2CKid62ql7sLS4yN+PHGd/pr6+K+ozPwHRdb9uaNSfO/QFa+TzLX0ZI3asbv7W7Km1sn5V7BSdnDJ5xN7kDToRTfJ7/QY39G3QEASur/yMkDZOJn/HP3fu4MlimSfbt/NGj8tv3/8EgLcLx3nid/CrkTE+PbiXo+VbLET3uYZSJA10ReWCANub1R8xa3GNUItkU7C7fW12d3tU/aFu5GMUSdkSXo02qx9br69wLQHFLNDZgueBLJCwTKt+CMUcsL8lEfvs7UI2+k+QLKbJkqWzuSJLnhRZ4iSafOyLmiNE7ZtQJHYk6OK2/gBMGJWo/YN8d+XbnJLfkNoV44/xA3ylpxtCj0w2ByiBxOnIGoaO7uX18jDOqjUYbCZgl3Ut0TlXt5mAwZYHGES1SCYB+7qitgOQTUImsfp+O9hSXoMkKJJtaTtAMyFxEGWwpdIHk1DssLfO2cmMbT9JNvpRm7BXgW5rf5tdo8/wCoMJUsU2OlGEDO2A4NJGlg4SpFDLm+ax0E3f2zdMBqGSrZX44YE0X8g0+HjWwRUfVxr8e8awK+Hxo9eybFtZIAiaCbgM9KH4pIEdtvqjzfeBPsts5DMpeKU9GpnU83lDH2l8Oqz+DlvSLj6GPm3hFS470JcFvxvYY0d3dAJ8h/X8qh8FfxvQY3mbb1838WNw+tLk/Dy76GYvO+ihg52kyfqCNPnYsClzLOxoHisB7juzHOWv3Ax/smZZhEOx9wAhRClNT9LoOsz1Gx/yi+98CQQu/O0GR7rPkJx7jBhjX16bcQG4hNKPcoa1Y/sucHeT1Fte+wn05bxyAeESKfqhRV835xUuGLiUgX6xvMI1hXf1BX5C6A95uf9IXy6lcPvBbfLP6svPz+7RYyvtHAii5jkSK3MnvkidODcbb3Fv5ZugyiHzD46aP5CK1RDblh56bVSWq5zoiv4R+7gUoy3jsj9ZJgxBVSifuPL/ryJe8FXEfwcAU73isuGF8swAAAAASUVORK5CYII=',
    border = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAZCAYAAABzVH1EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHpsAACAjgAA+FQAAIITAAB2OwAA9IEAADvkAAAbd5lS/4AAAAnFSURBVHjazJhLb5xHdoafU1XfrdmkSJOWLGs8tjQzgDTKxAGCBEjCyYIDZBtAy8CL8e/QWkj+RgBvo613TJBoEiABJlZGE3EiS45lXakmu8m+fZeqc7JotkRZciazywG6PzTQXU+dt+qct6rlr3/+UwN4PJgC8IPvbVIWOQ/3B9TzyNmNihiFg+MZ6oTNfsHhqCGaIhiD4XNCscl6LwNgPD3gb//+6w+AAzObA/zNp3/+VsZ/Px6QVHl3vSJG5cnhjF4eONPPeXo4Q1jEYPjstzLC+pkzACyfGJgaF7beoYstk0nNdN7iRShyx389fESMHWWxQVIhAXfuPeAPfnSJ9V5GTArwU+CfgEenx37JOIkPL5ylbRtm9YzhuKFfBYos8O93HtDrl0ixijMD4Is3GX8M/OuSEX59/8l8NOuq4eEjEPDSp8gDuTNmUdEYaZtI7AxMF4lipPQE1YRzFWeAL+894Ic/usTvXfoI/vGby8AXywn/+v6T4WjWbXy2+ysAcu/wziFiGIthFWMxZ8EwzAzBEBH05Dt3vvkVn+z8ZMn4EPjPJSNc2FrhAnDz/te8u1Ywjg0hRloVSu8whNWQQaEQFBQEwUTIi0CZFUid+GrUcvX76y/HBdzyw5IBkAdHHgRQSnGId4Qgi+S8Q8wQJ5g4uqi0XUcTlS4a81ZPM/xpRrh9775sbpxjsSGNnIgzoyo9PnNk3uEEgneIMxRwBiZG5pV+1mBlRZ2t8HgwZTB8BixEXEJu37vvtjbewwmUAj/cKlkpPL3SUxUFeeYpMyP3INFIImQO6nnL4TTwzUQZjjtGkng0mHLwFkbY2jjnBofPWXU5H2ysMZ11eJ/wCAG7JcpNRHYT3CXJFWAnYdcQt21mjFLH+LDhAOinxNbGOeDJa7WwtfGefzF8xkoRuPLBBn/x8Vmy3GEGInLLOW46s11RvRtTulLP251m1lwzddv96Hm36TTriRMRXgyfcXb97BuMYAgh32T17DG0Y1bLgmgOgc/AbjhhzzCSAsrthN3G+Byx65r4ZDV3nDvXJw3nWH6GC1v9xeoar4OyTcowoApQBaOXecz4TMVuJNW9pAlNSkrxtmG3LfjPi2TXWfWfZGXmtszTPj4mz9d5f72vTkBPMZxg2epK4HB/xDQaYAS45bEbHtlTBU2Q1IgGqJASezHajaaxW8djYzgxxm1BL895NJgiiAB8+rOryw5anul5iiqw0gvUbcOknt6a1vMb00m9Nzmec3RUcziaMTyqOZ621E23F01voHari8ZwPGXamFbB6ePRDMG514QCEWeJMi/RoiRpxGE3gb1lJ7GXBW6ogHgQk72kdnPe2ra1xmh8xPn31hAqwAQgqp60dA0JoWuNw8MJz3uOMvc3nZM9OVFW1YiLVSdFiGp0Ke3Vrd6c1nE7RVgJ3kVMc8A5Q1VOJWKGCUicYpNAUyge2fWytBXBWLRHOWmPIot+EWC3q0CbhjL0UAt4AxxKgmQ4Fg/FouItdHjq5LBWd70I4sA5wYuQe4HgIAckkIBVk931pMzapPFwhuBIYuoC4qO9tiJgQlUF+quJWS0gdtdUEHeSzcvEF0mIBy+Ceu7GqVF3SkeHqQPMZGE3nNgEZmg0nJwobSgq/u7CtxY+IQgOW7zcwk0Eo1W92ybVrjWnJupNW0k4UmZq3cvt5RA4miUOp/BovyWIILgrJ9sck8WqCCDO8H4hmnNG5rmSV45eryQnZ5YSJiJiIk5EkppbCjGdJeeDiyuZ4SziLF0JYgSB3EEWjCwIWXB45xEX8C4QJFzxEpw5kCgc1SksmomJOyVxWIAS+1PH+rsOwxAnO4LcRljkI7ZYCeSlzCLgnNtZO7NCIRGr+ie6QsIMw7wXXaiFcw5cJmFlpWJ1rSLAjkdui4Bb1h3CchNgoAhO3E4SRRUkRBc8ToyoTnVZgrx0RhN6ldCTnGSGOK7h9bK4xYQ9QhDBy0nFqKKdXk6q1zKBOrZMJqMTjzoVr1ZVFcF3jiLz9BdmeK1X+cu9ylNVnqrMqMqMPM/wIYD3JJPLdbJrszoymScdNxEzFDEkYaaWXiYymnWIc1hsGNNSlY4isF3m7nqeyeW8EEK+sHNVpWsT8zpdnrZ6fd7adtvUxEkEiwtdTvX2uk0GMJq1zptSp4ZpA+tneqyvrWz3+9X1lV55uSwLihDIs0CeeYrgyYO7XGZyvfK2nUxAcUYGIs4JrtUkdooVnuwPMIN53VLFjC55IglvfILZR6Z6M6ntxqh3m06vNNF2OuUazm/3e47Bi5rzG2vEwwMeNwPi+quW+He/+I0BPN0/cGpoTHA0PHb3HmSs9XPyXD5xwkdmdtPMdhW7K8IVL+z44K95H7bLMmOtnZNUSU3N88GIGMV923RDPZ1Q9Pq0DdTB8/TpFBeNLDfUsZ2SbatBUkFNSTjEEk5hPplzrJ7x0YBx07G+2eP56FuWDpwwXDJjdaNHspr9g5ZJm2g72VZj23tHljnKXKhKT3CJwieq3NN6aE0Zt8q6wmB0cgQ/bYhFr1+vhrqkKBgft8yTkJpI39zCyR14bwQFEyETBRzzZMy9MG4bNK+IGlkNNW+Lotc/Wg31meN5ZP/FmD/6wSVmbcf8oGZWzxjXEcMIYoSTrhgI+CKQYkszc3Qe5m1kLX87I1y9eN4Gw2cMps+pO4+2CQmOqRSoGW0byXEQPFIITgSJxrzrKBplZsa0mbC1vkKvX7G18R7cHr4GuXrxvA6GzzAd8uio49/uPSe1LXleoEBRCE48rRrjtiN1iZAZpSWOjyPDWUurSpugt1Kx9c6bjDCadVUoNvnLP1lcJXVxAGM2mzA4OsbJKiv9Ak01asqLoxmbqxWFg6g1dx4e00yUq9+rWBR294Zao1m3EYpN/mrn1XVVBCbzYw6OJuTlFmUWsNhQNy2Tecs7Gz1EO+qtji+fHDOfKH/4443vZIQ/+8mHfHjxfQC+/urJsoWfvC8q6vH+IZr6zOqOjy+9T55n9Ff6qBnwS56PjNlkTq9f8ezF4WtnAYC3MRZxHnB0KfF8f0jUHlGVrbWSqirpVRXjaUMe7vxWRvj8H37B9+9f5MLW4mJU5h7vHON5ixNBDY7nLRpn+FDx5aOnxGT0QmQ4D0urYBxLXjw+Xhraa5eebzOqfPG7Sd3hRYhqHM8bTFucy/iPLx9RZoLGyDSGlzP+3xhiZojIReBnwKfAv7zpbN8ZJfBj4Je8OpVF4DfArpk9fOWNchH40xPGF78Do1r+wXCKkYBvgH9eMpaJ9IBzwMfAgzevRd8ZHrgAPDwFUWAMvDCz2alElozfB776HRnxW4koMDnNELP/63j/v+N/BgBXi5F3d3nGEQAAAABJRU5ErkJggg==',
    pos = {
      999: '0px 0px',
      308318328338348: '-24px -0px',
      106117128139: '-36px -0px',
      120130140150: '-48px -0px',
      400500600700800: '-60px -0px',
      199299399499599699: '-72px -0px',
      505606607709809: '-84px -0px'
    };
  };
  CT.Window = new function () {
    var saveB = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAIAAAAv2XlzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAH6SURBVHjaVM89a1RRFIXhtffZ9zOYTBKJYaKOiumiqdKKgmBhqUL+hI2VIFjYCZaChb9ABAtJIQbFIoJoQNSMEKLkC+IEZhLnzuTM3DP3nm2hhLjq9RYPRceOn5qeDUWcyw0jjUNjDBsTiEnikADbd13rbF7sbKwetLZkdPLs5Ru34cvv9ZXauNy6OlOrnZ6aOmmC+FN9KxQzd+HMs8Wv71caG6ufl54/EvW+28nyfr/V2hvh4KCb9W2XfP5rN3vwZCGJ5en9+Z7tZu3faZKaIBIiEKlhiqMgikMjwswKAJAgEBEAhskwoCVUBQBUiSGBRGEYCweGhPnE2PD8tdk4DCrDQ1nH2l6/KEsQBABB1StIfu5kr5c3zzcHE9udykhl5txEIPxicfnd8mpeStFzBAgBWcfud2xBYUH8diV7862tWldVKBQgIE3jsdGKVw9AitLvtTvMdGVuulYdJyLVvwQAIBAzrW3ufllrDJxT9VKW5X67e/3SxYd3bjKKvu2B6DCAahSFecn3Hi+8fLWuqjIoCmt7IsxMe812s9li5sO/934oTSar1TQJDqxVVfFenXO+LAGEYZikydFAVeM4BtHADVzuVFWIWFkUVBYuTZMwjvD/xLBqCZCyAZHkWUMa9Q9L7m573Xs9Kv7nJmLmj/XtQeuHd70/AwDj7v01yw6ZhAAAAABJRU5ErkJggg==',
    setB = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTM0A1t6AAACoUlEQVQ4T42Uy2sTURTGk1Zbq+ILUdyKG5uZSerQkPbeyYAYCZhlggurFUJN5xGUgiBushdBsQguFMGFC7EqLiyiCwWh0IL/QH3tFJcu1CKlft+duTqJieTA4Z7cOfeX755zZlLaarXaYBx2i9OMW63WQDI2ZDBniOCrKcMHo66/nfvKXNfdgkUlMo4Ppsrl8rCGYx2ybXtzZsIbN47W91vCuwLQhimDDQuekeFl5rUpKBQKIxpAMHwTY8IIN4QfmtL/Dv+WhKnY8S/qfGVJGA8nYXTDCU+YIvhhykbVFCHWBEwGz+1jtZ3MV0Y1vZTRGY8V64eh7BGgP+GPTeG/UjARvCkcr+5hjjKCkjXrBssVZ8YB+wJl96BmwZL+EtY1NOWZJb0VpLBkaX1WWS9lCib8j1knzANyC824b4jwIbr7EvFrQ/rXkJauVqsjXHnmv8rQiPem9GzsDVYqla2A3oayu1C8AOgTvY/0CMYNehz/C3P8IoC7jzinDtju3F7Aliw5exqTONABS2uOInfCTOF9yIjwBlT8QrzOeqEJKxFMWToJ45TEcReY9FbNyWAe11vnaKBmi+jmsiUaZ5CiAEkY66cbq14hvgGMc7Ixqq4JZX9hwSKV5SIYrSes7cqEYhyuA3S1TZkMlk1nZjrO6wnjlGCJVLLDrju9C4ffWSK4iQ6ucTQi2CxhtJ6w5FtGY7eGALgEwLw1ee4krngHvpp1GmfjnL5gek9d2RK+BPATavbWEmF9ojS1L37WF4yzrPdVMUulqW3o7sFD5eYwD6kHfcKSbxktnZUNAWUv8vnmjhjWt7IOmHrOL+9T1AxfDu+82o4BXOkEaBgByWtqGKdE76cwtBfgn61ic4y/4yTC9GwlYwXmH/ypWdRYPEulfgMLajrH8hIjewAAAABJRU5ErkJggg==',
    cList = [
      '999',
      'custom',
      '700',
      '321',
      '409',
      '007',
      '031',
      '704',
      '608',
      '308318328338348',
      '106117128139',
      '120130140150',
      '400500600700800',
      '199299399499599699',
      '505606607709809',
      '696595494393292',
      '959949839829819',
      '900911922933944'
    ];
    this.show = function () {
      var e;
      var i;
      var format = CT.DATA.Setting.Default.Format;
      $((this.w = wman.open('Colorsettings').setTitle(CTlang.ColorWindowTitle).setMiniTitle(CT.name).setSize(350, 400)).getContentPane()).css('text-align', 'center').append(i = $('<input type=hidden class="color" id="colorinput" value="66ff00"/>'));
      (this.ColorPicker = new jscolor.color(i[0], {
            pickerOnfocus: false
          })).showPicker();
      this.tab1 = $('<div style="display:inline-block;width:290px;height:275px;position:relative;padding:4px12px4px4px;text-align:left"/>').appendTo(this.w.getContentPane()).append($(jscolor.picker.boxB).css({
            position: 'relative',
            display: 'inline-block',
            'background-color': ''
          })).append($('<div id="colorPanelDIV" style="display:inline-block;width:auto;height:123px;position:relative;margin-left:7px;border:' + this.ColorPicker.pickerBorder + 'px solid;border-color:' + this.ColorPicker.pickerBorderColor + '"/>').append($('<div id="colorWSetbtn" style="width:20px;height:20px;background-image:url(' + setB + ');margin:10px;cursor:pointer;"/>').click(function (e) {
              CT.Window.SetPreviewColor(0);
            })).append($('<div id="colorWLoadbtn" style="width:20px;height:20px;margin:10px;cursor:pointer;"/>').click(function (e) {
              CT.Window.selectLoad.show(e);
            })).append($('<div id="colorWSavebtnBg" style="width:20px;height:20px;background-image:url(' + saveB + ');background-size:100%100%;margin:10px;cursor:pointer;"/>').click(function (e) {
              CT.Window.selectSave.show(e);
            }))).append(e = $('<div id="PreviewDIV" class="chatwindow_background" style="display:inline-block;width:287px;height:60px;position:relative;zIndex:5;margin-top:5px;border:' + this.ColorPicker.pickerInset + 'px solid;border-color:' + this.ColorPicker.pickerInsetColor + ';color:white;background:#1D1C1C;opacity:' + $('.tw2gui_window_inset', '.chat').css('opacity') + '"/>')).append($('<div style="display:inline-block;position:relative;padding:4px;width:45%"/>').append((this.Bold = new CT.Tools.Guicheckbox(CTlang.ColorWindowBold).setSelected(/\*.*\*/.test(format))).getMainDiv().click(function () {
              CT.Window.updateFormat();
              CT.Window.updatePreview();
            }))).append($('<div style="display:inline-block;position:relative;padding:4px;width:auto"/>').append((this.Caps = new CT.Tools.Guicheckbox(CTlang.ColorWindowCaps).setSelected(/%C|%F/.test(format))).getMainDiv().click(function () {
              CT.Window.updateFormat();
              CT.Window.updatePreview();
            }))).append($('<div style="display:inline-block;position:relative;padding:4px;width:45%"/>').append((this.Flip = new CT.Tools.Guicheckbox(CTlang.ColorWindowFlip).setSelected(/%f|%F/.test(format))).getMainDiv().click(function () {
              CT.Window.updateFormat();
              CT.Window.updatePreview();
            }))).append((this.inputFormat = new CT.Tools.Guitextfield('bdfFormat').setValue(format).setSize(14).setReadonly(true)).getMainDiv());
      $((this.selectLoad = (new CT.Tools.GuiSelectbox('topleft-left')).setPosition(42, 10).addListener(function (e) {
            CT.Window.LoadColor(e);
            setTimeout(function () {
              CT.Window.selectLoad.hide();
            }, 0);
          }).setWidth(200).setHeight(300)).elContent).css({
        'overflow-y': 'auto'
      });
      this.selectSave = (new CT.Tools.GuiSelectbox('topleft-left')).setPosition(42).addListener(function (e) {
        CT.Window.SaveColor(e);
        setTimeout(function () {
          CT.Window.selectSave.hide();
        }, 0);
      }).setWidth(200);
      for (var s = 0; s < cList.length; s++)
        this.selectLoad.addItem(cList[s], $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">').append($('<span style="display:inline-block;width:19px;height:19px;"/>').css('background', CT.Tools.Degrader(cList[s]))).append(CTlang.ColorLoadListName[s]), CTlang.ColorLoadListName[s]);
      for (s in CT.DATA.Setting.saves)
        this.selectLoad.addItem(s, $('<div>').append($('<span style="display:inline-block;width:19px;height:19px;"/>').css('background', CT.Tools.Degrader(CT.DATA.Setting.saves[s]))).append(s + (CT.DATA.Setting.saves[s] == cList[0] ? ' ' + CTlang.ColorSaveEmpty : '')));
      for (s in CT.DATA.Setting.saves)
        this.selectSave.addItem(s, $('<div>').append($('<span style="display:inline-block;width:19px;height:19px;"/>').css('background', CT.Tools.Degrader(CT.DATA.Setting.saves[s]))).append(s + (CT.DATA.Setting.saves[s] == cList[0] ? ' ' + CTlang.ColorSaveEmpty : '')));
      for (s = 1; s < CTlang.ColorWindowPreviewTxt.length; s++)
        $('<div id="idColorPreview_' + s + '"style="display:inline-block;cursor:pointer" onclick="javascript:CT.Window.SetPreviewColor(\'' + s + '\');"/>').appendTo(e);
      this.customTF = (new CT.Tools.Guitextfield).setSize(30);
      this.test = function () {
        CT.Window.customTest.html(CTlang.CustomNotReady).css('color', 'red');
        v = CT.Window.customTF.getValue();
        if (v.length % 3 == 0 && /[0-9]+/.exec(v) == v) {
          CT.Window.customTest.html(CTlang.CustomReady).css('color', 'green');
          CT.Window.customPrev.css('background', CT.Tools.Degrader(v));
        }
      };
      this.customTF.getField()[0].addEventListener('keyup', this.test);
      this.customPrev = $('<div style="float:left;margin-top:5px;width:19px;height:19px;"/>');
      this.customTest = $('<div style="height:12px;width:120px;"/>');
      this.customTF.divMain.append(this.customPrev, this.customTest);
      this.DefaultButton = (new CT.Tools.Guibutton(CTlang.ColorWindowToDefaultBtn, function () {
          CT.Window.DefaultClick();
        })).appendTo(this.w.getContentPane());
      this.OkButton = (new CT.Tools.Guibutton(CTlang.ColorWindowThisTchatBtn, function () {
          CT.Window.OkClick();
        })).appendTo(this.w.getContentPane());
      this.LoadColor(CT.DATA.Setting.Default.colorTag);
    };
    this.OkClick = function () {
      CT.DATA.Setting.Default = {
        Format: $('#bdfFormat').val(),
        colorTag: this.ColorTag
      };
      CT.DATA.Save();
      CT.Chat.Change = true;
      CT.Chat.ChangeColor();
      new UserMessage(CTlang.saveMessage, 'success').show();
    };
    this.DefaultClick = function () {
      CT.DATA.Setting.Default = {
        Format: '%c',
        colorTag: cList[0]
      };
      CT.DATA.Save();
      CT.Chat.Change = true;
      CT.Chat.ChangeColor();
      this.show();
    };
    this.SetPreviewColor = function (e) {
      if (e == 0) {
        this.ColorTag = this.colorwest(this.ColorPicker.toString());
      } else {
        e--;
        if (e > this.ColorTag.length / 3) {
          this.ColorTag += this.colorwest(this.ColorPicker.toString());
        } else {
          this.ColorTag = this.ColorTag.substring(0, e * 3) + this.colorwest(this.ColorPicker.toString()) + this.ColorTag.substring(e * 3 + 3);
        }
      }
      this.updatePreview();
    };
    this.updateFormat = function () {
      var e = this.Flip.isSelected() ? '%f' : '%c';
      if (this.Caps.isSelected())
        e = e.toUpperCase();
      if (this.Bold.isSelected())
        e = '/111* ' + e + ' /111*';
      $('#bdfFormat').val(e);
    };
    this.updatePreview = function () {
      var flip = this.Flip.isSelected();
      var e = flip ? '%f' : '%c';
      if (this.Bold.isSelected())
        e = e.bold();
      if (this.Caps.isSelected())
        e = e.toUpperCase();
      var n = this.ColorTag + CT.Tools.colorTagInv(this.ColorTag);
      var leng = CTlang.ColorWindowPreviewTxt.length;
      for (var r = 1; r < leng; r++) {
        var i = document.getElementById('idColorPreview_' + r);
        i.style.color = '#' + CT.Tools.colorrgb(n.substring(0, 3));
        var g = flip ? leng - r : r;
        var s = CTlang.ColorWindowPreviewTxt.charAt(g);
        if (s == ' ')
          i.innerHTML = '&nbsp';
        else
          i.innerHTML = e.replace('%c', s).replace('%C', s.toUpperCase()).replace('%f', CT.Chat.flipString(s)).replace('%F', CT.Chat.flipString(s.toUpperCase()));
        n = n.substring(3) + n.substring(0, 3);
      }
      $('#colorWLoadbtn').css('background', CT.Tools.Degrader(this.ColorTag));
      $('#colorWLoadbtn').attr('title', CTlang.ColorLoadTitle + this.ColorTag);
    };
    this.SaveColor = function (e) {
      CT.DATA.Setting.saves[e] = this.ColorTag;
      for (var i in this.selectLoad.items) {
        if (this.selectLoad.items[i].value == e) {
          $(this.selectLoad.items[i].node[0].firstChild).css('background', CT.Tools.Degrader(CT.DATA.Setting.saves[e]));
          this.selectLoad.items[i].node[0].lastChild.textContent = e + (CT.DATA.Setting.saves[e] == cList[0] ? ' ' + CTlang.ColorSaveEmpty : '');
        }
        if (typeof this.selectSave.items[i] !== 'undefined')
          if (this.selectSave.items[i].value == e) {
            $(this.selectSave.items[i].node[0].firstChild).css('background', CT.Tools.Degrader(CT.DATA.Setting.saves[e]));
            this.selectSave.items[i].node[0].lastChild.textContent = e + (CT.DATA.Setting.saves[e] == cList[0] ? ' ' + CTlang.ColorSaveEmpty : '');
          }
      }
      this.updateFormat();
      CT.DATA.Save();
    };
    this.LoadColor = function (e) {
      if (/save/.test(e)) {
        e = CT.DATA.Setting.saves[e];
      }
      if (e == 'custom') {
        this.customTF.setValue(this.ColorTag);
        this.test();
        (new CT.Tools.Guidialog(CTlang.ColorLoadListName[1], this.customTF.getMainDiv(), 'question')).addButton(CTlang.ColorWindowOkBtn, function () {
          var e = CT.Window.customTF.getValue();
          if (e.length % 3 == 0 && /[0-9]+/.exec(e) == e)
            CT.Window.LoadColor(e);
        }).addButton('cancel').show();
        return;
      }
      this.ColorPicker.fromString('#' + CT.Tools.colorrgb(e.substring(0, 3)));
      this.ColorTag = e;
      this.updateFormat();
      this.updatePreview();
    };
    this.colorwest = function (e) {
      Wr = (parseInt(e.substring(0, 2), 16) / 255 * 9).toFixed();
      Wg = (parseInt(e.substring(2, 4), 16) / 255 * 9).toFixed();
      Wb = (parseInt(e.substring(4), 16) / 255 * 9).toFixed();
      return Wr + Wg + Wb;
    };
  };
  $('head').append($('<style id=\'colorTxtStyle\' />'));
  $('head').append($('<style id=\'colorTxtStyleTmp\' />'));
  $('#colorTxtStyle').append('div.tw2gui_window.chat div.chat_room div.chat_input div.cbg {right: 65px}\n');
  $('#colorTxtStyle').append('div.tw2gui_window.chat div.chat_room div.chat_input a.speak {right: 25px}\n');
  CT.initInterval = setInterval(function () {
      CT.Chat.init();
    }, 200);
  var jscolor = {
    dir: 'https://tomrobert.safe-ws.de/',
    bindClass: 'color',
    binding: true,
    preloading: true,
    install: function () {
      jscolor.addEvent(window, 'load', jscolor.init);
    },
    init: function () {
      if (jscolor.binding) {
        jscolor.bind();
      }
      if (jscolor.preloading) {
        jscolor.preload();
      }
    },
    getDir: function () {
      if (!jscolor.dir) {
        var detected = jscolor.detectDir();
        jscolor.dir = detected !== false ? detected : 'jscolor/';
      }
      return jscolor.dir;
    },
    detectDir: function () {
      var base = location.href;
      var e = document.getElementsByTagName('base');
      for (var i = 0; i < e.length; i += 1) {
        if (e[i].href) {
          base = e[i].href;
        }
      }
      var e = document.getElementsByTagName('script');
      for (var i = 0; i < e.length; i += 1) {
        if (e[i].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(e[i].src)) {
          var src = new jscolor.URI(e[i].src);
          var srcAbs = src.toAbsolute(base);
          srcAbs.path = srcAbs.path.replace(/[^\/]+$/, '');
          srcAbs.query = null;
          srcAbs.fragment = null;
          return srcAbs.toString();
        }
      }
      return false;
    },
    bind: function () {
      var matchClass = new RegExp('(^|\\s)(' + jscolor.bindClass + ')(\\s*(\\{[^}]*\\})|\\s|$)', 'i');
      var e = document.getElementsByTagName('input');
      for (var i = 0; i < e.length; i += 1) {
        if (jscolor.isColorAttrSupported && e[i].type.toLowerCase() == 'color') {
          continue;
        }
        var m;
        if (!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
          var prop = {};
          if (m[4]) {
            try {
              prop = (new Function('return (' + m[4] + ')'))();
            } catch (eInvalidProp) {}
          }
          e[i].color = new jscolor.color(e[i], prop);
        }
      }
    },
    preload: function () {
      for (var fn in jscolor.imgRequire) {
        if (jscolor.imgRequire.hasOwnProperty(fn)) {
          jscolor.loadImage(fn);
        }
      }
    },
    images: {
      pad: [181, 101],
      sld: [16, 101],
      cross: [15, 15],
      arrow: [7, 11]
    },
    imgRequire: {},
    imgLoaded: {},
    requireImage: function (filename) {
      jscolor.imgRequire[filename] = true;
    },
    loadImage: function (filename) {
      if (!jscolor.imgLoaded[filename]) {
        jscolor.imgLoaded[filename] = new Image();
        jscolor.imgLoaded[filename].src = jscolor.getDir() + filename;
      }
    },
    fetchElement: function (mixed) {
      return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
    },
    addEvent: function (el, evnt, func) {
      if (el.addEventListener) {
        el.addEventListener(evnt, func, false);
      } else if (el.attachEvent) {
        el.attachEvent('on' + evnt, func);
      }
    },
    fireEvent: function (el, evnt) {
      if (!el) {
        return;
      }
      if (document.createEvent) {
        var ev = document.createEvent('HTMLEvents');
        ev.initEvent(evnt, true, true);
        el.dispatchEvent(ev);
      } else if (document.createEventObject) {
        var ev = document.createEventObject();
        el.fireEvent('on' + evnt, ev);
      } else if (el['on' + evnt]) {
        el['on' + evnt]();
      }
    },
    getElementPos: function (e) {
      var e1 = e,
      e2 = e;
      var x = 0,
      y = 0;
      if (e1.offsetParent) {
        do {
          x += e1.offsetLeft;
          y += e1.offsetTop;
        } while (e1 = e1.offsetParent);
      }
      while ((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
        x -= e2.scrollLeft;
        y -= e2.scrollTop;
      }
      return [x, y];
    },
    getElementSize: function (e) {
      return [e.offsetWidth, e.offsetHeight];
    },
    getRelMousePos: function (e) {
      var x = 0,
      y = 0;
      if (!e) {
        e = window.event;
      }
      if (typeof e.offsetX === 'number') {
        x = e.offsetX;
        y = e.offsetY;
      } else if (typeof e.layerX === 'number') {
        x = e.layerX;
        y = e.layerY;
      }
      return {
        x: x,
        y: y
      };
    },
    getViewPos: function () {
      if (typeof window.pageYOffset === 'number') {
        return [window.pageXOffset, window.pageYOffset];
      } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        return [document.body.scrollLeft, document.body.scrollTop];
      } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
      } else {
        return [0, 0];
      }
    },
    getViewSize: function () {
      if (typeof window.innerWidth === 'number') {
        return [window.innerWidth, window.innerHeight];
      } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        return [document.body.clientWidth, document.body.clientHeight];
      } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        return [document.documentElement.clientWidth, document.documentElement.clientHeight];
      } else {
        return [0, 0];
      }
    },
    URI: function (uri) {
      this.scheme = null;
      this.authority = null;
      this.path = '';
      this.query = null;
      this.fragment = null;
      this.parse = function (uri) {
        var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
        this.scheme = m[3] ? m[2] : null;
        this.authority = m[5] ? m[6] : null;
        this.path = m[7];
        this.query = m[9] ? m[10] : null;
        this.fragment = m[12] ? m[13] : null;
        return this;
      };
      this.toString = function () {
        var result = '';
        if (this.scheme !== null) {
          result = result + this.scheme + ':';
        }
        if (this.authority !== null) {
          result = result + '//' + this.authority;
        }
        if (this.path !== null) {
          result = result + this.path;
        }
        if (this.query !== null) {
          result = result + '?' + this.query;
        }
        if (this.fragment !== null) {
          result = result + '#' + this.fragment;
        }
        return result;
      };
      this.toAbsolute = function (base) {
        var base = new jscolor.URI(base);
        var r = this;
        var t = new jscolor.URI;
        if (base.scheme === null) {
          return false;
        }
        if (r.scheme !== null && r.scheme.toLowerCase() === base.scheme.toLowerCase()) {
          r.scheme = null;
        }
        if (r.scheme !== null) {
          t.scheme = r.scheme;
          t.authority = r.authority;
          t.path = removeDotSegments(r.path);
          t.query = r.query;
        } else {
          if (r.authority !== null) {
            t.authority = r.authority;
            t.path = removeDotSegments(r.path);
            t.query = r.query;
          } else {
            if (r.path === '') {
              t.path = base.path;
              if (r.query !== null) {
                t.query = r.query;
              } else {
                t.query = base.query;
              }
            } else {
              if (r.path.substr(0, 1) === '/') {
                t.path = removeDotSegments(r.path);
              } else {
                if (base.authority !== null && base.path === '') {
                  t.path = '/' + r.path;
                } else {
                  t.path = base.path.replace(/[^\/]+$/, '') + r.path;
                }
                t.path = removeDotSegments(t.path);
              }
              t.query = r.query;
            }
            t.authority = base.authority;
          }
          t.scheme = base.scheme;
        }
        t.fragment = r.fragment;
        return t;
      };
      function removeDotSegments(path) {
        var out = '';
        while (path) {
          if (path.substr(0, 3) === '../' || path.substr(0, 2) === './') {
            path = path.replace(/^\.+/, '').substr(1);
          } else if (path.substr(0, 3) === '/./' || path === '/.') {
            path = '/' + path.substr(3);
          } else if (path.substr(0, 4) === '/../' || path === '/..') {
            path = '/' + path.substr(4);
            out = out.replace(/\/?[^\/]*$/, '');
          } else if (path === '.' || path === '..') {
            path = '';
          } else {
            var rm = path.match(/^\/?[^\/]*/)[0];
            path = path.substr(rm.length);
            out = out + rm;
          }
        }
        return out;
      }
      if (uri) {
        this.parse(uri);
      }
    },
    color: function (target, prop) {
      this.required = true;
      this.adjust = true;
      this.hash = false;
      this.caps = true;
      this.slider = true;
      this.valueElement = target;
      this.styleElement = target;
      this.onImmediateChange = null;
      this.hsv = [0, 0, 1];
      this.rgb = [1, 1, 1];
      this.minH = 0;
      this.maxH = 6;
      this.minS = 0;
      this.maxS = 1;
      this.minV = 0;
      this.maxV = 1;
      this.pickerOnfocus = true;
      this.pickerMode = 'HSV';
      this.pickerPosition = 'bottom';
      this.pickerSmartPosition = true;
      this.pickerFixedPosition = false;
      this.pickerButtonHeight = 20;
      this.pickerClosable = false;
      this.pickerCloseText = 'Close';
      this.pickerButtonColor = 'ButtonText';
      this.pickerFace = 10;
      this.pickerFaceColor = 'ThreeDFace';
      this.pickerBorder = 1;
      this.pickerBorderColor = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight';
      this.pickerInset = 1;
      this.pickerInsetColor = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow';
      this.pickerZIndex = 10000;
      for (var p in prop) {
        if (prop.hasOwnProperty(p)) {
          this[p] = prop[p];
        }
      }
      this.hidePicker = function () {
        if (isPickerOwner()) {
          removePicker();
        }
      };
      this.showPicker = function () {
        if (!isPickerOwner()) {
          var tp = jscolor.getElementPos(target);
          var ts = jscolor.getElementSize(target);
          var vp = jscolor.getViewPos();
          var vs = jscolor.getViewSize();
          var ps = getPickerDims(this);
          var a,
          b,
          c;
          switch (this.pickerPosition.toLowerCase()) {
          case 'left':
            a = 1;
            b = 0;
            c = -1;
            break;
          case 'right':
            a = 1;
            b = 0;
            c = 1;
            break;
          case 'top':
            a = 0;
            b = 1;
            c = -1;
            break;
          default:
            a = 0;
            b = 1;
            c = 1;
            break;
          }
          var l = (ts[b] + ps[b]) / 2;
          if (!this.pickerSmartPosition) {
            var pp = [tp[a], tp[b] + ts[b] - l + l * c];
          } else {
            var pp = [-vp[a] + tp[a] + ps[a] > vs[a] ? (-vp[a] + tp[a] + ts[a] / 2 > vs[a] / 2 && tp[a] + ts[a] - ps[a] >= 0 ? tp[a] + ts[a] - ps[a] : tp[a]) : tp[a], -vp[b] + tp[b] + ts[b] + ps[b] - l + l * c > vs[b] ? (-vp[b] + tp[b] + ts[b] / 2 > vs[b] / 2 && tp[b] + ts[b] - l - l * c >= 0 ? tp[b] + ts[b] - l - l * c : tp[b] + ts[b] - l + l * c) : (tp[b] + ts[b] - l + l * c >= 0 ? tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l - l * c)];
          }
          drawPicker(pp[a], pp[b]);
        }
      };
      this.importColor = function () {
        if (!valueElement) {
          this.exportColor();
        } else {
          if (!this.adjust) {
            if (!this.fromString(valueElement.value, leaveValue)) {
              styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
              styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
              styleElement.style.color = styleElement.jscStyle.color;
              this.exportColor(leaveValue | leaveStyle);
            }
          } else if (!this.required && /^\s*$/.test(valueElement.value)) {
            valueElement.value = '';
            styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
            styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
            styleElement.style.color = styleElement.jscStyle.color;
            this.exportColor(leaveValue | leaveStyle);
          } else if (this.fromString(valueElement.value)) {}
          else {
            this.exportColor();
          }
        }
      };
      this.exportColor = function (flags) {
        if (!(flags & leaveValue) && valueElement) {
          var value = this.toString();
          if (this.caps) {
            value = value.toUpperCase();
          }
          if (this.hash) {
            value = '#' + value;
          }
          valueElement.value = value;
        }
        if (!(flags & leaveStyle) && styleElement) {
          styleElement.style.backgroundImage = 'none';
          styleElement.style.backgroundColor = '#' + this.toString();
          styleElement.style.color = 0.213 * this.rgb[0] +
            0.715 * this.rgb[1] +
            0.072 * this.rgb[2] < 0.5 ? '#FFF' : '#000';
        }
        if (!(flags & leavePad) && isPickerOwner()) {
          redrawPad();
        }
        if (!(flags & leaveSld) && isPickerOwner()) {
          redrawSld();
        }
      };
      this.fromHSV = function (h, s, v, flags) {
        if (h !== null) {
          h = Math.max(0, this.minH, Math.min(6, this.maxH, h));
        }
        if (s !== null) {
          s = Math.max(0, this.minS, Math.min(1, this.maxS, s));
        }
        if (v !== null) {
          v = Math.max(0, this.minV, Math.min(1, this.maxV, v));
        }
        this.rgb = HSV_RGB(h === null ? this.hsv[0] : (this.hsv[0] = h), s === null ? this.hsv[1] : (this.hsv[1] = s), v === null ? this.hsv[2] : (this.hsv[2] = v));
        this.exportColor(flags);
      };
      this.fromRGB = function (r, g, b, flags) {
        if (r !== null) {
          r = Math.max(0, Math.min(1, r));
        }
        if (g !== null) {
          g = Math.max(0, Math.min(1, g));
        }
        if (b !== null) {
          b = Math.max(0, Math.min(1, b));
        }
        var hsv = RGB_HSV(r === null ? this.rgb[0] : r, g === null ? this.rgb[1] : g, b === null ? this.rgb[2] : b);
        if (hsv[0] !== null) {
          this.hsv[0] = Math.max(0, this.minH, Math.min(6, this.maxH, hsv[0]));
        }
        if (hsv[2] !== 0) {
          this.hsv[1] = hsv[1] === null ? null : Math.max(0, this.minS, Math.min(1, this.maxS, hsv[1]));
        }
        this.hsv[2] = hsv[2] === null ? null : Math.max(0, this.minV, Math.min(1, this.maxV, hsv[2]));
        var rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
        this.rgb[0] = rgb[0];
        this.rgb[1] = rgb[1];
        this.rgb[2] = rgb[2];
        this.exportColor(flags);
      };
      this.fromString = function (hex, flags) {
        var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
        if (!m) {
          return false;
        } else {
          if (m[1].length === 6) {
            this.fromRGB(parseInt(m[1].substr(0, 2), 16) / 255, parseInt(m[1].substr(2, 2), 16) / 255, parseInt(m[1].substr(4, 2), 16) / 255, flags);
          } else {
            this.fromRGB(parseInt(m[1].charAt(0) + m[1].charAt(0), 16) / 255, parseInt(m[1].charAt(1) + m[1].charAt(1), 16) / 255, parseInt(m[1].charAt(2) + m[1].charAt(2), 16) / 255, flags);
          }
          return true;
        }
      };
      this.toString = function () {
        return ((256 | Math.round(255 * this.rgb[0])).toString(16).substr(1) + (256 | Math.round(255 * this.rgb[1])).toString(16).substr(1) + (256 | Math.round(255 * this.rgb[2])).toString(16).substr(1));
      };
      function RGB_HSV(r, g, b) {
        var n = Math.min(Math.min(r, g), b);
        var v = Math.max(Math.max(r, g), b);
        var m = v - n;
        if (m === 0) {
          return [null, 0, v];
        }
        var h = r === n ? 3 + (b - g) / m : (g === n ? 5 + (r - b) / m : 1 + (g - r) / m);
        return [h === 6 ? 0 : h, m / v, v];
      }
      function HSV_RGB(h, s, v) {
        if (h === null) {
          return [v, v, v];
        }
        var i = Math.floor(h);
        var f = i % 2 ? h - i : 1 - (h - i);
        var m = v * (1 - s);
        var n = v * (1 - s * f);
        switch (i) {
        case 6:
        case 0:
          return [v, n, m];
        case 1:
          return [n, v, m];
        case 2:
          return [m, v, n];
        case 3:
          return [m, n, v];
        case 4:
          return [n, m, v];
        case 5:
          return [v, m, n];
        }
      }
      function removePicker() {
        delete jscolor.picker.owner;
        document.getElementsByTagName('body')[0].removeChild(jscolor.picker.boxB);
      }
      function drawPicker(x, y) {
        if (!jscolor.picker) {
          jscolor.picker = {
            box: document.createElement('div'),
            boxB: document.createElement('div'),
            pad: document.createElement('div'),
            padB: document.createElement('div'),
            padM: document.createElement('div'),
            sld: document.createElement('div'),
            sldB: document.createElement('div'),
            sldM: document.createElement('div'),
            btn: document.createElement('div'),
            btnS: document.createElement('span'),
            btnT: document.createTextNode(THIS.pickerCloseText)
          };
          for (var i = 0, segSize = 4; i < jscolor.images.sld[1]; i += segSize) {
            var seg = document.createElement('div');
            seg.style.height = segSize + 'px';
            seg.style.fontSize = '1px';
            seg.style.lineHeight = '0';
            jscolor.picker.sld.appendChild(seg);
          }
          jscolor.picker.sldB.appendChild(jscolor.picker.sld);
          jscolor.picker.box.appendChild(jscolor.picker.sldB);
          jscolor.picker.box.appendChild(jscolor.picker.sldM);
          jscolor.picker.padB.appendChild(jscolor.picker.pad);
          jscolor.picker.box.appendChild(jscolor.picker.padB);
          jscolor.picker.box.appendChild(jscolor.picker.padM);
          jscolor.picker.btnS.appendChild(jscolor.picker.btnT);
          jscolor.picker.btn.appendChild(jscolor.picker.btnS);
          jscolor.picker.box.appendChild(jscolor.picker.btn);
          jscolor.picker.boxB.appendChild(jscolor.picker.box);
        }
        var p = jscolor.picker;
        p.box.onmouseup = p.box.onmouseout = function () {
          target.focus();
        };
        p.box.onmousedown = function () {
          abortBlur = true;
        };
        p.box.onmousemove = function (e) {
          if (holdPad || holdSld) {
            holdPad && setPad(e);
            holdSld && setSld(e);
            if (document.selection) {
              document.selection.empty();
            } else if (window.getSelection) {
              window.getSelection().removeAllRanges();
            }
            dispatchImmediateChange();
          }
        };
        if ('ontouchstart' in window) {
          var handle_touchmove = function (e) {
            var event = {
              'offsetX': e.touches[0].pageX - touchOffset.X,
              'offsetY': e.touches[0].pageY - touchOffset.Y
            };
            if (holdPad || holdSld) {
              holdPad && setPad(event);
              holdSld && setSld(event);
              dispatchImmediateChange();
            }
            e.stopPropagation();
            e.preventDefault();
          };
          p.box.removeEventListener('touchmove', handle_touchmove, false)
          p.box.addEventListener('touchmove', handle_touchmove, false)
        }
        p.padM.onmouseup = p.padM.onmouseout = function () {
          if (holdPad) {
            holdPad = false;
            jscolor.fireEvent(valueElement, 'change');
          }
        };
        p.padM.onmousedown = function (e) {
          switch (modeID) {
          case 0:
            if (THIS.hsv[2] === 0) {
              THIS.fromHSV(null, null, 1);
            };
            break;
          case 1:
            if (THIS.hsv[1] === 0) {
              THIS.fromHSV(null, 1, null);
            };
            break;
          }
          holdSld = false;
          holdPad = true;
          setPad(e);
          dispatchImmediateChange();
        };
        if ('ontouchstart' in window) {
          p.padM.addEventListener('touchstart', function (e) {
            touchOffset = {
              'X': e.target.offsetParent.offsetLeft,
              'Y': e.target.offsetParent.offsetTop
            };
            this.onmousedown({
              'offsetX': e.touches[0].pageX - touchOffset.X,
              'offsetY': e.touches[0].pageY - touchOffset.Y
            });
          });
        }
        p.sldM.onmouseup = p.sldM.onmouseout = function () {
          if (holdSld) {
            holdSld = false;
            jscolor.fireEvent(valueElement, 'change');
          }
        };
        p.sldM.onmousedown = function (e) {
          holdPad = false;
          holdSld = true;
          setSld(e);
          dispatchImmediateChange();
        };
        if ('ontouchstart' in window) {
          p.sldM.addEventListener('touchstart', function (e) {
            touchOffset = {
              'X': e.target.offsetParent.offsetLeft,
              'Y': e.target.offsetParent.offsetTop
            };
            this.onmousedown({
              'offsetX': e.touches[0].pageX - touchOffset.X,
              'offsetY': e.touches[0].pageY - touchOffset.Y
            });
          });
        }
        var dims = getPickerDims(THIS);
        p.box.style.width = dims[0] + 'px';
        p.box.style.height = dims[1] + 'px';
        p.boxB.style.position = THIS.pickerFixedPosition ? 'fixed' : 'absolute';
        p.boxB.style.left = x + 'px';
        p.boxB.style.top = y + 'px';
        p.boxB.style.zIndex = THIS.pickerZIndex;
        p.boxB.style.border = THIS.pickerBorder + 'px solid';
        p.boxB.style.borderColor = THIS.pickerBorderColor;
        p.boxB.style.background = THIS.pickerFaceColor;
        p.pad.style.width = jscolor.images.pad[0] + 'px';
        p.pad.style.height = jscolor.images.pad[1] + 'px';
        p.padB.style.position = 'absolute';
        p.padB.style.left = THIS.pickerFace + 'px';
        p.padB.style.top = THIS.pickerFace + 'px';
        p.padB.style.border = THIS.pickerInset + 'px solid';
        p.padB.style.borderColor = THIS.pickerInsetColor;
        p.padM.style.position = 'absolute';
        p.padM.style.left = '0';
        p.padM.style.top = '0';
        p.padM.style.width = THIS.pickerFace + 2 * THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
        p.padM.style.height = p.box.style.height;
        p.padM.style.cursor = 'crosshair';
        p.sld.style.overflow = 'hidden';
        p.sld.style.width = jscolor.images.sld[0] + 'px';
        p.sld.style.height = jscolor.images.sld[1] + 'px';
        p.sldB.style.display = THIS.slider ? 'block' : 'none';
        p.sldB.style.position = 'absolute';
        p.sldB.style.right = THIS.pickerFace + 'px';
        p.sldB.style.top = THIS.pickerFace + 'px';
        p.sldB.style.border = THIS.pickerInset + 'px solid';
        p.sldB.style.borderColor = THIS.pickerInsetColor;
        p.sldM.style.display = THIS.slider ? 'block' : 'none';
        p.sldM.style.position = 'absolute';
        p.sldM.style.right = '0';
        p.sldM.style.top = '0';
        p.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2 * THIS.pickerInset + 'px';
        p.sldM.style.height = p.box.style.height;
        try {
          p.sldM.style.cursor = 'pointer';
        } catch (eOldIE) {
          p.sldM.style.cursor = 'hand';
        }
        function setBtnBorder() {
          var insetColors = THIS.pickerInsetColor.split(/\s+/);
          var pickerOutsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
          p.btn.style.borderColor = pickerOutsetColor;
        }
        p.btn.style.display = THIS.pickerClosable ? 'block' : 'none';
        p.btn.style.position = 'absolute';
        p.btn.style.left = THIS.pickerFace + 'px';
        p.btn.style.bottom = THIS.pickerFace + 'px';
        p.btn.style.padding = '0 15px';
        p.btn.style.height = '18px';
        p.btn.style.border = THIS.pickerInset + 'px solid';
        setBtnBorder();
        p.btn.style.color = THIS.pickerButtonColor;
        p.btn.style.font = '12px sans-serif';
        p.btn.style.textAlign = 'center';
        try {
          p.btn.style.cursor = 'pointer';
        } catch (eOldIE) {
          p.btn.style.cursor = 'hand';
        }
        p.btn.onmousedown = function () {
          THIS.hidePicker();
        };
        p.btnS.style.lineHeight = p.btn.style.height;
        switch (modeID) {
        case 0:
          var padImg = 'hs.png';
          break;
        case 1:
          var padImg = 'hv.png';
          break;
        }
        p.padM.style.backgroundImage = 'url(\'' + jscolor.getDir() + 'cross.gif\')';
        p.padM.style.backgroundRepeat = 'no-repeat';
        p.sldM.style.backgroundImage = 'url(\'' + jscolor.getDir() + 'arrow.gif\')';
        p.sldM.style.backgroundRepeat = 'no-repeat';
        p.pad.style.backgroundImage = 'url(\'' + jscolor.getDir() + padImg + '\')';
        p.pad.style.backgroundRepeat = 'no-repeat';
        p.pad.style.backgroundPosition = '0 0';
        redrawPad();
        redrawSld();
        jscolor.picker.owner = THIS;
        document.getElementsByTagName('body')[0].appendChild(p.boxB);
      }
      function getPickerDims(o) {
        var dims = [2 * o.pickerInset + 2 * o.pickerFace + jscolor.images.pad[0] + (o.slider ? 2 * o.pickerInset + 2 * jscolor.images.arrow[0] + jscolor.images.sld[0] : 0), o.pickerClosable ? 4 * o.pickerInset + 3 * o.pickerFace + jscolor.images.pad[1] + o.pickerButtonHeight : 2 * o.pickerInset + 2 * o.pickerFace + jscolor.images.pad[1]];
        return dims;
      }
      function redrawPad() {
        switch (modeID) {
        case 0:
          var yComponent = 1;
          break;
        case 1:
          var yComponent = 2;
          break;
        }
        var x = Math.round((THIS.hsv[0] / 6) * (jscolor.images.pad[0] - 1));
        var y = Math.round((1 - THIS.hsv[yComponent]) * (jscolor.images.pad[1] - 1));
        jscolor.picker.padM.style.backgroundPosition = (THIS.pickerFace + THIS.pickerInset + x - Math.floor(jscolor.images.cross[0] / 2)) + 'px ' + (THIS.pickerFace + THIS.pickerInset + y - Math.floor(jscolor.images.cross[1] / 2)) + 'px';
        var seg = jscolor.picker.sld.childNodes;
        switch (modeID) {
        case 0:
          var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
          for (var i = 0; i < seg.length; i += 1) {
            seg[i].style.backgroundColor = 'rgb(' + (rgb[0] * (1 - i / seg.length) * 100) + '%,' + (rgb[1] * (1 - i / seg.length) * 100) + '%,' + (rgb[2] * (1 - i / seg.length) * 100) + '%)';
          }
          break;
        case 1:
          var rgb,
          s,
          c = [THIS.hsv[2], 0, 0];
          var i = Math.floor(THIS.hsv[0]);
          var f = i % 2 ? THIS.hsv[0] - i : 1 - (THIS.hsv[0] - i);
          switch (i) {
          case 6:
          case 0:
            rgb = [0, 1, 2];
            break;
          case 1:
            rgb = [1, 0, 2];
            break;
          case 2:
            rgb = [2, 0, 1];
            break;
          case 3:
            rgb = [2, 1, 0];
            break;
          case 4:
            rgb = [1, 2, 0];
            break;
          case 5:
            rgb = [0, 2, 1];
            break;
          }
          for (var i = 0; i < seg.length; i += 1) {
            s = 1 - 1 / (seg.length - 1) * i;
            c[1] = c[0] * (1 - s * f);
            c[2] = c[0] * (1 - s);
            seg[i].style.backgroundColor = 'rgb(' + (c[rgb[0]] * 100) + '%,' + (c[rgb[1]] * 100) + '%,' + (c[rgb[2]] * 100) + '%)';
          }
          break;
        }
      }
      function redrawSld() {
        switch (modeID) {
        case 0:
          var yComponent = 2;
          break;
        case 1:
          var yComponent = 1;
          break;
        }
        var y = Math.round((1 - THIS.hsv[yComponent]) * (jscolor.images.sld[1] - 1));
        jscolor.picker.sldM.style.backgroundPosition = '0 ' + (THIS.pickerFace + THIS.pickerInset + y - Math.floor(jscolor.images.arrow[1] / 2)) + 'px';
      }
      function isPickerOwner() {
        return jscolor.picker && jscolor.picker.owner === THIS;
      }
      function blurTarget() {
        if (valueElement === target) {
          THIS.importColor();
        }
        if (THIS.pickerOnfocus) {
          THIS.hidePicker();
        }
      }
      function blurValue() {
        if (valueElement !== target) {
          THIS.importColor();
        }
      }
      function setPad(e) {
        var mpos = jscolor.getRelMousePos(e);
        var x = mpos.x - THIS.pickerFace - THIS.pickerInset;
        var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
        switch (modeID) {
        case 0:
          THIS.fromHSV(x * (6 / (jscolor.images.pad[0] - 1)), 1 - y / (jscolor.images.pad[1] - 1), null, leaveSld);
          break;
        case 1:
          THIS.fromHSV(x * (6 / (jscolor.images.pad[0] - 1)), null, 1 - y / (jscolor.images.pad[1] - 1), leaveSld);
          break;
        }
      }
      function setSld(e) {
        var mpos = jscolor.getRelMousePos(e);
        var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
        switch (modeID) {
        case 0:
          THIS.fromHSV(null, null, 1 - y / (jscolor.images.sld[1] - 1), leavePad);
          break;
        case 1:
          THIS.fromHSV(null, 1 - y / (jscolor.images.sld[1] - 1), null, leavePad);
          break;
        }
      }
      function dispatchImmediateChange() {
        if (THIS.onImmediateChange) {
          var callback;
          if (typeof THIS.onImmediateChange === 'string') {
            callback = new Function(THIS.onImmediateChange);
          } else {
            callback = THIS.onImmediateChange;
          }
          callback.call(THIS);
        }
      }
      var THIS = this;
      var modeID = this.pickerMode.toLowerCase() === 'hvs' ? 1 : 0;
      var abortBlur = false;
      var
      valueElement = jscolor.fetchElement(this.valueElement),
      styleElement = jscolor.fetchElement(this.styleElement);
      var
      holdPad = false,
      holdSld = false,
      touchOffset = {};
      var
      leaveValue = 1 << 0,
      leaveStyle = 1 << 1,
      leavePad = 1 << 2,
      leaveSld = 1 << 3;
      jscolor.isColorAttrSupported = false;
      var el = document.createElement('input');
      if (el.setAttribute) {
        el.setAttribute('type', 'color');
        if (el.type.toLowerCase() == 'color') {
          jscolor.isColorAttrSupported = true;
        }
      }
      jscolor.addEvent(target, 'focus', function () {
        if (THIS.pickerOnfocus) {
          THIS.showPicker();
        }
      });
      jscolor.addEvent(target, 'blur', function () {
        if (!abortBlur) {
          window.setTimeout(function () {
            abortBlur || blurTarget();
            abortBlur = false;
          }, 0);
        } else {
          abortBlur = false;
        }
      });
      if (valueElement) {
        var updateField = function () {
          THIS.fromString(valueElement.value, leaveValue);
          dispatchImmediateChange();
        };
        jscolor.addEvent(valueElement, 'keyup', updateField);
        jscolor.addEvent(valueElement, 'input', updateField);
        jscolor.addEvent(valueElement, 'blur', blurValue);
        valueElement.setAttribute('autocomplete', 'off');
      }
      if (styleElement) {
        styleElement.jscStyle = {
          backgroundImage: styleElement.style.backgroundImage,
          backgroundColor: styleElement.style.backgroundColor,
          color: styleElement.style.color
        };
      }
      switch (modeID) {
      case 0:
        jscolor.requireImage('hs.png');
        break;
      case 1:
        jscolor.requireImage('hv.png');
        break;
      }
      jscolor.requireImage('cross.gif');
      jscolor.requireImage('arrow.gif');
      this.importColor();
    }
  };
  jscolor.install();
});
