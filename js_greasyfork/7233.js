// ==UserScript==
// @name The West Minimap NPC locator
// @namespace TomRobert
// @author Rask Hund (updated by Tom Robert)
// @description Shows the location of NPCs on the map!
// @include https://*.the-west.*/game.php*
// @exclude https://classic.the-west.net*
// @version 1.1.8
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/7233/The%20West%20Minimap%20NPC%20locator.user.js
// @updateURL https://update.greasyfork.org/scripts/7233/The%20West%20Minimap%20NPC%20locator.meta.js
// ==/UserScript==
// translation:Tom Robert(German&English),?(Polish),pepe100(Spanish),Did97(Russian),jccwest(Portuguese),OguzhanCekic(Turkish),Timemod Herkumo(Greek),Billy-AR(Italian)
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  NPC = {
    version: '1.1.8',
    name: 'Minimap NPC locator',
    author: 'Rask Hund (updated by Tom Robert)',
    minGame: '2.03',
    maxGame: Game.version.toString(),
    website: 'https://greasyfork.org/scripts/7233',
    loading: false,
    inner: '',
    langs: {
      en: {
        language: 'English',
        ApiGui: 'This script shows you the location of NPCs on the minimap.<br>With one more click, you can center the map on the quest giver.',
        save: 'Save',
        saveMessage: 'Successfully saved',
        chooseLang: 'Choose language',
        contact: 'Contact',
        loading: 'Loading current quest givers',
        title: 'Quest giver locator',
        chooseNpc: 'Select employer',
        yourposition: 'Your position',
        questgiver: 'Quest giver',
        reload: 'Reload all quest givers',
      },
      de: {
        language: 'German (Deutsch)',
        ApiGui: 'Das Script zeigt dir die Punkte der Questgeber an.<br>Mit einem Mausklick auf den jeweiligen Punkt verschiebt sich die Karte an die richtige Position des Questgebers.',
        save: 'Speichern',
        saveMessage: 'Speichern erfolgreich',
        chooseLang: 'Sprache ändern',
        contact: 'Kontakt',
        loading: 'Aktuelle Questgeber werden geladen',
        title: 'Questgebersuche',
        chooseNpc: 'Wähle den Questgeber',
        yourposition: 'Eigene Position',
        questgiver: 'Questgeber',
        reload: 'Questgeber neu laden',
      },
      pl: {
        language: 'Polish (polski)',
        ApiGui: 'This script shows you the location of NPCs on the minimap.<br>With one more click, you can center the map on the quest giver.',
        save: 'Zapisz',
        saveMessage: 'Zapisz powodzeniem',
        chooseLang: 'Wybierz język',
        contact: 'Kontakt',
        loading: 'Loading current quest givers',
        title: 'Gdzie jest zleceniodawca?',
        chooseNpc: 'Wybierz zleceniodawcę',
        yourposition: 'Twoja pozycja',
        questgiver: 'Zleceniodawca',
        reload: 'Reload all quest givers',
      },
      es: {
        language: 'Spanish (español)',
        ApiGui: 'El script muestra los puntos de los dadores de búsqueda en un minimapa.<br>Pincha en el respectivo punto rojo y te moverás en el mapa a la ubicación correcta del dador de búsqueda.',
        save: 'Guardar',
        saveMessage: 'Guardado con éxito',
        chooseLang: 'Elige idioma',
        contact: 'Contacto',
        loading: 'Loading current quest givers',
        title: 'Dador de búsqueda',
        chooseNpc: 'Seleccionar empleador',
        yourposition: 'Tu posición',
        questgiver: 'Dador de búsqueda',
        reload: 'Reload all quest givers',
      },
      ru: {
        language: 'Russian (русский)',
        ApiGui: 'Этот скрипт показывает местоположение NPC на миникарте.<br>Кликнув ещё раз, Вы можете центрировать карту на квестодателе.',
        save: 'Экономить',
        saveMessage: 'Сохранить успешно',
        chooseLang: 'Сменить язык',
        contact: 'Контакты',
        loading: 'Loading current quest givers',
        title: 'Расположение работодателя',
        chooseNpc: 'Выбор работодателя',
        yourposition: 'Твоё местоположение',
        questgiver: 'Квестодатель',
        reload: 'Reload all quest givers',
      },
      pt: {
        language: 'Portuguese (português)',
        ApiGui: 'O scrip mostra os empregadores no minimapa<br>Clicando no respectivo ponto vai para o local correto do empregador.',
        save: 'Salvar',
        saveMessage: 'Economize com sucesso',
        chooseLang: 'Escolhe idioma',
        contact: 'Contacto',
        loading: 'Atualizar empregadores atuais',
        title: 'Localizador de empregadores',
        chooseNpc: 'Selecionar empregador',
        yourposition: 'Minha posição',
        questgiver: 'Empregador',
        reload: 'Atualizar todos os empregadores',
      },
      tr: {
        language: 'Turkish (Türkçe)',
        ApiGui: 'Bu komut minimap NPC konumunu gösterir.<br>Yine tıklayarak, macera verici haritanın merkezine alabilirsiniz.',
        save: 'Kurtarmak',
        saveMessage: 'Başarıyla kaydet',
        chooseLang: 'Dili değiştir',
        contact: 'Bana ulaşmak isterseniz ',
        loading: 'Geçerli görev vericiler Yükleniyor',
        title: 'Görev verici haritası',
        chooseNpc: 'İşverenin seçimi',
        yourposition: 'Bulunduğunuz yer',
        questgiver: 'Görevin bulunduğu yer',
        reload: 'Tüm görev vericileri güncelle',
      },
      el: {
        language: 'Greek (ελληνικά)',
        ApiGui: 'Αυτό το script σας δείχνει τη θέση των NPC στο minimap.<br>Με ένα ακόμη κλικ, μπορείτε να κεντράρετε τον χάρτη στον δότη αποστολής που επιθυμείτε.',
        save: 'Αποθήκευση',
        saveMessage: 'Αποθηκεύτηκε με επιτυχία',
        chooseLang: 'Επιλογή γλώσσας',
        contact: 'Επικοινωνία',
        loading: 'Φόρτωση των τρέχοντων δοτών αποστολής',
        title: 'Τοποθεσία δότη αποστολής',
        chooseNpc: 'Επιλέξτε εργοδότη',
        yourposition: 'Η θέση σου',
        questgiver: 'Δότης αποστολής',
        reload: 'Ανανέωση όλων των δοτών αποστολής',
      },
      it: {
        language: 'Italian (italiano)',
        ApiGui: 'Questo script mostra la posizione dei PNG sulla mini mappa.<br>Con un clic puoi centrare la mappa sul mandante.',
        save: 'Salvare',
        saveMessage: 'Salva con successo',
        chooseLang: 'Cambia lingua',
        contact: 'Contatti',
        loading: 'Caricando gli attuali mandanti',
        title: 'Posizione dei mandanti missione',
        chooseNpc: 'Scegli mandante',
        yourposition: 'La tua posizione',
        questgiver: 'Mandante',
        reload: 'Ricarica tutti i mandanti missione',
      },
    },
    images: {
      reload: 'data:image/png;base64,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',
      menu: 'data:image/png;base64,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',
    },
    updateLang: function () {
      var lg = NPC.langs;
      NPC.lang = lg[localStorage.getItem('scriptsLang')] ? localStorage.getItem('scriptsLang') : lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : 'en';
      MMlang = lg[NPC.lang];
    },
  };
  NPC.updateLang();
  var langBox = new west.gui.Combobox();
  for (var j in NPC.langs)
    langBox.addItem(j, NPC.langs[j].language);
  langBox.select(NPC.lang);
  var saveBtn = new west.gui.Button(MMlang.save, function () {
      localStorage.setItem('scriptsLang', langBox.getValue());
      NPC.updateLang();
      new UserMessage(MMlang.saveMessage, 'success').show();
    }),
  fmfb = function (l) {
    return 'https://forum.the-west.' + l + '/index.php?conversations/add&to=Tom Robert';
  };
  TheWestApi.register('NPC', NPC.name, NPC.minGame, NPC.maxGame, NPC.author, NPC.website).setGui($('<div>' + MMlang.chooseLang +
      ': </div>').append(langBox.getMainDiv()).append(saveBtn.getMainDiv()).append('<br><br>' + MMlang.ApiGui + '<br><br><i>' + NPC.name + ' v' + NPC.version +
      '</i><br><br><br><b>' + MMlang.contact + ':</b><ul style="margin-left:15px;"><li>Send a message to <a target=\'_blanck\' href="http://om.the-west.de/west/de/player/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert on German world Arizona</a></li>' +
      '<li>Contact me on <a target=\'_blanck\' href="https://greasyfork.org/forum/messages/add/Tom Robert">Greasy Fork</a></li>' +
      '<li>Message me on one of these The West Forum:<br>/ <a target=\'_blanck\' href="' + fmfb('de') + '">deutsches Forum</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('net') + '">English forum</a> / <a target=\'_blanck\' href="' + fmfb('pl') + '">forum polski</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('es') + '">foro español</a> /<br>/ <a target=\'_blanck\' href="' + fmfb('ru') + '">Русский форум</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('fr') + '">forum français</a> / <a target=\'_blanck\' href="' + fmfb('it') + '">forum italiano</a> / ' +
      '<a target=\'_blanck\' href="https://forum.beta.the-west.net//index.php?conversations/add&to=Tom Robert">beta forum</a> /<br>I will get an e-mail when you sent me the message <img src="../images/chat/emoticons/smile.png"></li></ul>'));
  NPC.init = function () {
    var style = document.createElement('style');
    var css = '#njk_minimap_map {position:relative;width:500px;height:220px;background-repeat:no-repeat;background-image:url("images/map/minimap/worldmap_500.jpg"); margin-left: 4px;}' +
      '#njk_minimap_map span.adv_pointer {position:absolute;height:16px;width:16px;cursor:pointer;background: 0 0 no-repeat transparent url("images/map/minimap/icons/miniicon_quests.png");}' +
      '#njk_minimap_map span.char_pointer {position:absolute;height:16px;width:16px;cursor:pointer;background: 0 0 no-repeat transparent url("images/map/minimap/icons/miniicon_pos.png");}' +
      '#njk_minimap #NPC_helpers {float:left;height:20px;width:150px;padding-left:5px;text-align:left;color:black;}' +
      '#njk_minimap span.advHelper {display:block;text-indent:20px;line-height:16px; background: 0 0 no-repeat transparent url("images/map/minimap/icons/miniicon_quests.png");}' +
      '#njk_minimap span.charHelper {display:block;text-indent:20px;line-height:16px; background: 0 0 no-repeat transparent url("images/map/minimap/icons/miniicon_pos.png");}' +
      '#njk_minimap #NPC_reload {margin:-7px 3px 0 0;cursor:pointer;}';
    style.setAttribute('type', 'text/css');
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
    NPC.start();
  };
  NPC.start = function () {
    if (window.document.getElementById('ui_menubar')) {
      try {
        this.addButton();
      } catch (e) {}
    } else {
      setTimeout(function () {
        NPC.start();
      }, 1000);
    }
  };
  NPC.addButton = function () {
    var t = $('<div title="' + NPC.name + '" class="menulink" />').css('background-image', 'url(' + NPC.images.menu + ')').css('background-position', '0px 0px').mouseenter(function () {
        $(this).css('background-position', '-25px 0px');
      }).mouseleave(function () {
        $(this).css('background-position', '0px 0px');
      }).click(function () {
        if (!NPC.employers)
          NPC.load();
        else if (NPC.loading === false)
          NPC.open();
      });
    $('#ui_menubar').append($('<div class="ui_menucontainer" />').append(t).append('<div class="menucontainer_bottom" />'));
  };
  NPC.load = function () {
    if (NPC.loading === false) {
      NPC.loading = true;
      new UserMessage(MMlang.loading, 'hint').show();
      Ajax.get('map', 'get_minimap', {}, function (json) {
        if (json.error)
          return new UserMessage(json.msg).show();
        var locs = [
        ];
        var ql = json.quest_locations;
        for (var loc in ql)
          if (ql.hasOwnProperty(loc))
            locs.push([parseInt(ql[loc][0][0] / Map.tileSize),
                parseInt(ql[loc][0][1] / Map.tileSize)]);
        Ajax.get('map', 'get_complete_data', {
          tiles: JSON.stringify(locs)
        }).done(function (res) {
          var ne = NPC.employers = {};
          var rq = res.quests;
          for (var g = 0; g < locs.length; g++) {
            var em = rq[locs[g][0]][locs[g][1]][0][1];
            for (var h = 0; h < em.employer.length; h++)
              if (!ne[em.employer[h].name])
                ne[em.employer[h].name] = em.x + ';' + em.y;
              else
                ne[em.employer[h].name] += '|' + em.x + ';' + em.y;
          }
          var ne2 = Object.keys(ne).sort(function (a, b) {
              a = a.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ł/g, 'l').replace(/ś/g, 's');
              b = b.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ł/g, 'l').replace(/ś/g, 's');
              return (a > b) ? 1 :  - 1;
            });
          for (var j = 0; j < ne2.length; j++)
            NPC.inner += '<option value="' + ne[ne2[j]] + '">' + ne2[j] + '</option>';
          NPC.open();
          NPC.loading = false;
        });
      });
    }
  };
  NPC.open = function () {
    var mm = wman.open('npc_minimap', null).setMiniTitle(NPC.name).setTitle(MMlang.title);
    $('.npc_minimap').css('width', '560px').css('height', '352px');
    var mm_mapdiv = $('<div id="njk_minimap_map" />'),
    CharX = Character.position.x,
    CharY = Character.position.y,
    x = 685 * CharX / 182 / 256 - 6,
    y = 302 * CharY / 80 / 256 - 6;
    x = x * 0.727;
    y = y * 0.727;
    NPC.charPoint = '<span title="' + MMlang.yourposition + '" class="char_pointer" onClick="Map.center(' + CharX + ',' + CharY + ')" style="left:' + x + 'px; top:' + y + 'px;">';
    mm_mapdiv.append(NPC.charPoint);
    mm.appendToContentPane($('<div id="njk_minimap"/>').append(mm_mapdiv));
    NPC.drawSelect();
  };
  NPC.drawSelect = function () {
    var selectDiv = window.document.createElement('div');
    selectDiv.style.cssText = 'color: #fff; font-size: 11px;';
    selectDiv.style.height = '38px';
    selectDiv.style.marginTop = '0px';
    selectDiv.style.marginRight = '5px';
    selectDiv.style.textAlign = 'right';
    selectDiv.innerHTML = '<img src="' + NPC.images.reload + '" onclick="NPC.load()" id="NPC_reload" title="' + MMlang.reload + '"><select style="background-color: #e8dab3; font-size: 14px; width: 200px; cursor:pointer;" onchange="NPC.questPoint(this);" id="NPC_dropdown" size="1">' +
      '<option selected disabled>-' + MMlang.chooseNpc + '</option>' + NPC.inner +
      '</select><div id="NPC_helpers"><span class="charHelper">' + MMlang.yourposition + '</span><span class="advHelper">' + MMlang.questgiver + '</span></div>';
    var mm2 = document.getElementById('njk_minimap');
    mm2.insertBefore(selectDiv, mm2.firstChild);
  };
  NPC.questPoint = function (place) {
    var dp = $('#njk_minimap_map');
    dp.find('.adv_pointer').remove();
    var positions = place.value;
    var arrPos = positions.split('|');
    for (var i = 0; i < arrPos.length; i++) {
      var xy = arrPos[i].split(';'),
      x = 685 * xy[0] / 182 / 256 - 6,
      y = 302 * xy[1] / 80 / 256 - 6;
      x = x * 0.727;
      y = y * 0.727;
      dp.append('<span class="adv_pointer" onClick="Map.center(' + xy[0] + ',' + xy[1] + ')" id="mapPos' + i + '" px="' + xy[0] + '" py="' + xy[1] + '" style="left:' + x + 'px; top:' + y + 'px;">');
    }
  };
  NPC.init();
});
