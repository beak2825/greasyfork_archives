// ==UserScript==
// @name TW Kick-o-Matic
// @namespace http://forum.the-west.ru/showthread.php?t=18398
// @author Macabre2077 (updated by Tom Robert)
// @description Helps to assign ranks to the players before a fort battle!
// @include https://*.the-west.*/game.php*
// @exclude https://classic.the-west.net*
// @version 1.75
//
// @history 1.75 Greek translation, bugfixes
// @history 1.74 removed ally in popup to fix streak of bad luck
// @history 1.73 fixed performance (ally requests), fixed message when multiple battles, better updater
// @history 1.72 bugfixes, Spanish updated, new rank sergeant supported
// @history 1.71 error message at init, bugfix
// @history 1.70 send message to ally members, popup has more details
// @history 1.65 ally name added, new forum links, choose language
// @history 1.64 new itemIDs, links fixed, other corrections
// @history 1.63 Contact in westapi added
// @history 1.62 fix for the west beta
// @history 1.61 German translation, 2.16 version compatibility
// @history 1.60 2.03 version compatibility
// @history 1.50 Polish translation
// @history 1.44 Italian translation
// @history 1.43 Multiple forts support
// @history 1.40 The West 2.0 compatibility
// @history 1.39 Disabling script before fixing bugs caused by 2.0
// @history 1.38 Slovak translation
// @history 1.37 Portuguese localisation
// @history 1.36 1.36 version bugfix
// @history 1.32 Translations: Spanish and Italian
// @history 1.30 Translations: English, Dutch!
// @history 1.30 Bugfix: selected player stays highlighted
// @history 1.20 old popup redesign,added compact version of popup, weapon accordance, intro
// @history 1.18 bugfix
// @history 1.15 fixed bug when one player`s data can`t be shown
// @history 1.15 prevents too long loading
// @history 1.10 new design
// @history 1.10 force chat to show ranks
// @history 1.10 bug fixes
// @history 1.000 players` hp (without lists) and town name
// @history 0.995 lists without {}
// @history 0.995 update hp list button
// @history 0.992 small bugfix
// @history 0.99 players` hp
// @history 0.98 player`s position is being highlihted when popup is shown
// @history 0.97 ally`s name is shown
// @history 0.96 new script`s name,added namespace
// @history 0.95 new feature fully completed
// @history 0.94 testing new feature - showing name of sector instead of numeric fort position
// @history 0.93 fixed bug caused by empty fort weapon
// @history 0.92 fixed mulitply battles error
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/7486/TW%20Kick-o-Matic.user.js
// @updateURL https://update.greasyfork.org/scripts/7486/TW%20Kick-o-Matic.meta.js
// ==/UserScript==
// translation:Tom Robert(German),Macabre2077(Russian),Tanais(Dutch&English),pepe100(Spanish),tw81(Italian),jccwest(Portuguese),Surge(Slovak),Darius II(Polish),Timemod Herkumo(Greek)
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  KoM = {
    version: '1.75',
    name: 'TW Kick-o-Matic',
    author: 'Macabre2077 (updated by Tom Robert)',
    minGame: '2.0',
    maxGame: Game.version.toString(),
    website: 'https://greasyfork.org/scripts/7486',
    loading: false,
    inProgress: {},
    fortsCapacity: [[50, 42], [100, 84], [140, 120]],
    betaFortsCapacity: [[25, 21], [50, 42], [70, 60]],
    weapons: [],
    langs: {
      ru: {
        language: 'Russian (русский)',
        ApiGui: 'This script helps to assign ranks to the players before a fort battle.<br>To see more details, click in the chat on the rank-symbol next to the nicknames.',
        save: 'Экономить',
        saveMessage: 'Сохранить успешно',
        chooseLang: 'Сменить язык',
        contact: 'контакт',
        success: 'Лычка дана!',
        error: 'Произошла ошибка',
        showPlayerOnMap: 'Показать игрока на карте',
        showTown: 'Посмотреть город',
        showAlly: 'Открыть окно альянс',
        showFort: 'Show fort overview',
        showBattle: 'Show battlefield',
        atFort: 'At the fort',
        nearFort: 'Nearby the fort',
        notFort: 'Not at the fort',
        evaluated: 'Already evaluated',
        started: 'The battle is taking place right now',
        remindAlly: 'Remind ally members, which haven\'t participated yet',
        where: 'Where',
        when: 'When',
        att: 'Attackers',
        def: 'Defenders',
        nodata: 'Информация о званиях не загружена для данного форта!',
        getData: 'Пытаемся загрузить данные о званиях',
        errorTimeout: 'Загрузка происходит слишком долго',
        ascaptain: 'Произвести в капитаны',
        assergeant: 'Назначить сержантом',
        asprivate: 'Назначить рядовым',
        asrecruit: 'Взять в рекруты',
        asreservist: 'Записать в резерв',
        astraitor: 'Обвинить в предательстве',
        youcant: 'Ты не можешь понизить старшего<br>или равного по званию.',
        position: 'Позиция',
        pos_undefined: 'не установлена',
        notown: 'Нет города',
        noally: 'Без альянса',
        flag: 'Флаг',
        inside: 'Внутри форта',
        sectors: {
          undef: 'Не назначена',
          0: 'Левый верхний сектор',
          1: 'Левый нижний сектор',
          2: 'Левый южный сектор',
          3: 'Центральный южный сектор',
          4: 'Правый южный сектор',
          5: 'Правый нижний сектор',
          6: 'Правый верхний сектор',
          7: 'Башня авантов',
          8: 'Башня дуэлянтов',
          9: 'Башня солдат',
          10: 'Башня трудяг',
          11: 'Казарма',
          12: 'Склад',
          13: 'Штаб',
          14: 'Северная стена',
          15: 'Южная стена',
          16: 'Западная стена',
          17: 'Восточная стена',
          18: 'Ворота',
          19: 'Флаг',
          20: 'Внутри форта'
        },
        damage: 'Урон',
        version: 'версия',
        changelist: 'Список изменений',
      },
      nl: {
        language: 'Dutch (Nederlands)',
        ApiGui: 'This script helps to assign ranks to the players before a fort battle.<br>To see more details, click in the chat on the rank-symbol next to the nicknames.',
        save: 'Besparen',
        saveMessage: 'Sparen succes',
        chooseLang: 'Kies een taal',
        contact: 'Contact',
        success: 'Rang wordt gegeven!',
        error: 'Er is een fout opgetreden',
        showPlayerOnMap: 'Laat speler zien op de map',
        showTown: 'Stadsoverzicht tonen',
        showAlly: 'Alliantie overzicht tonen',
        showFort: 'Fort overzicht tonen',
        showBattle: 'Show slagveld',
        atFort: 'Bij het fort',
        nearFort: 'Dichtbij het fort',
        notFort: 'Niet bij het fort',
        evaluated: 'Evalueer speler',
        started: 'Het gevecht is volop bezig',
        remindAlly: 'Herinner alliantieleden, die nog niet hebben deelgenomen',
        where: 'Waarin',
        when: 'Wanneer',
        att: 'Aanvallers',
        def: 'Verdedigers',
        nodata: 'Informatie over rangen is niet gegeven voor het fort!',
        getData: 'Ranginformatie aan het laden',
        errorTimeout: 'Het downloaden duurde te lang',
        ascaptain: 'Tot kapitein bevorderen',
        assergeant: 'Benoemen tot sergeant',
        asprivate: 'Tot soldaat benoemen',
        asrecruit: 'Tot rekruut benoemen',
        asreservist: 'Tot reservist benoemen',
        astraitor: 'Als verrader markeren',
        youcant: 'Je kan geen spelers met dezelfde<br>of een hogere rang rekruteren.',
        position: 'Positie',
        pos_undefined: 'Geen startpositie',
        notown: 'No town',
        noally: 'Geen alliantie',
        flag: 'Vlag',
        inside: 'Binnen het fort',
        sectors: {
          undef: 'Geen startpositie',
          0: 'De sector links boven',
          1: 'De centraal linker sector',
          2: 'De sector linksonder',
          3: 'De sector midden onder',
          4: 'De sector rechtsonder',
          5: 'De centraal rechter sector',
          6: 'De sector rechtsboven',
          7: 'Avonturierstoren',
          8: 'Duellantentoren',
          9: 'Soldatentoren',
          10: 'Arbeiderstoren',
          11: 'Kazerne',
          12: 'Opslagplaats',
          13: 'Hoofdgebouw',
          14: 'Bovenmuur',
          15: 'Ondermuur',
          16: 'Linkermuur',
          17: 'Rechtermuur',
          18: 'Poort',
          19: 'Vlag',
          20: 'In het fort'
        },
        damage: 'Schade',
        version: 'versie',
        changelist: 'Lijst van wijzigingen',
      },
      en: {
        language: 'English',
        ApiGui: 'This script helps to assign ranks to the players before a fort battle.<br>To see more details, click in the chat on the rank-symbol next to the nicknames.',
        save: 'Save',
        saveMessage: 'Successfully saved',
        chooseLang: 'Choose language',
        contact: 'Contact',
        success: 'Rank is given!',
        error: 'An error has occured',
        showPlayerOnMap: 'Show player on map',
        showTown: 'Show town overview',
        showAlly: 'Show alliance overview',
        showFort: 'Show fort overview',
        showBattle: 'Show battlefield',
        atFort: 'At the fort',
        nearFort: 'Nearby the fort',
        notFort: 'Not at the fort',
        evaluated: 'Number of evaluated players',
        started: 'The battle is taking place right now',
        remindAlly: 'Remind ally members, who haven\'t participated yet',
        where: 'Where',
        when: 'When',
        att: 'Attackers',
        def: 'Defenders',
        nodata: 'Couldn\'t load rank information for the fort',
        getData: 'Loading rank information',
        errorTimeout: 'The loading took too much time',
        ascaptain: 'Promote to captain',
        assergeant: 'Appoint as sergeant',
        asprivate: 'Appoint as private',
        asrecruit: 'Appoint as recruit',
        asreservist: 'Appoint as reservist',
        astraitor: 'Mark as traitor',
        youcant: 'You can\'t demote fighters of<br>the same or higher rank.',
        position: 'Position',
        pos_undefined: 'No starting position',
        notown: 'No town',
        noally: 'No alliance',
        flag: 'Flag',
        inside: 'Inside the fort',
        sectors: {
          undef: 'No starting position',
          0: 'The upper-left sector',
          1: 'The lower-left sector',
          2: 'The central left sector',
          3: 'The lower central sector',
          4: 'The central right sector',
          5: 'The lower-right sector',
          6: 'The upper-right sector',
          7: 'Adventurer\'s tower',
          8: 'Dueller\'s tower',
          9: 'Soldier\'s tower',
          10: 'Worker\'s tower',
          11: 'Barracks',
          12: 'Resource stock',
          13: 'Headquarters',
          14: 'North wall',
          15: 'South wall',
          16: 'West wall',
          17: 'East wall',
          18: 'Gate',
          19: 'Flag',
          20: 'Inside the fort'
        },
        damage: 'Damage',
        version: 'version',
        changelist: 'Changelog',
      },
      es: {
        language: 'Spanish (español)',
        ApiGui: 'Este script ayuda a asignar rangos a los jugadores antes de la batalla.<br>Para ver más detalles, hacier click en el chat , en el símbolo del rango que está junto al nombre.',
        save: 'Guardar',
        saveMessage: 'Guardar correctamente',
        chooseLang: 'Elige idioma',
        contact: 'Contacto',
        success: 'Rango asignado!',
        error: 'Un error ha ocurrido',
        showPlayerOnMap: 'Mostrar jugador en el mapa',
        showTown: 'Mostrar resumen de ciudad',
        showAlly: 'Mostrar resumen de alianza',
        showFort: 'Mostrar resumen del fuerte',
        showBattle: 'Mostrar campo de batalla',
        atFort: 'En el fuerte',
        nearFort: 'Cerca del fuerte',
        notFort: 'No en el fuerte',
        evaluated: 'Evaluar jugador',
        started: 'La batalla ya ha comenzado',
        remindAlly: 'Recuerde a los miembros de la alianza, que todavía no han participado',
        where: 'Dónde',
        when: 'Cuando',
        att: 'atacantes',
        def: 'defensores',
        nodata: 'No se puede cargar la información de rango para el fuerte',
        getData: 'Información del rango cargada',
        errorTimeout: 'La carga tomó demasiado tiempo',
        ascaptain: 'Promocionar a capitán',
        assergeant: 'Designado como sargento',
        asprivate: 'Designar como soldado raso',
        asrecruit: 'Designar como recluta',
        asreservist: 'Designar reservista',
        astraitor: 'Marcar como traidor',
        youcant: 'No se pueden disminuir los combatientes<br>con igual o superior rango.',
        position: 'Posición',
        pos_undefined: 'Sin posición de partida',
        notown: 'Sin ciudad',
        noally: 'Sin alianza',
        flag: 'Bandera',
        inside: 'Dentro del fuerte',
        sectors: {
          undef: 'Sin posición de partida',
          0: 'El sector superior izquierdo',
          1: 'El sector central izquierdo',
          2: 'El sector inferior izquierdo',
          3: 'El sector central inferior',
          4: 'El sector inferior derecho',
          5: 'El sector central derecho',
          6: 'El sector superior derecho',
          7: 'Torre Aventureros',
          8: 'Torre Duelistas',
          9: 'Torre Soldados',
          10: 'Torre Trabajadores',
          11: 'Barracas',
          12: 'Almacén de recursos',
          13: 'Cuartel general',
          14: 'Muralla Norte',
          15: 'Muralla Sur',
          16: 'Muralla Oeste',
          17: 'Muralla Este',
          18: 'Puerta',
          19: 'Bandera',
          20: 'Dentro del fuerte'
        },
        damage: 'Daño',
        version: 'versión',
        changelist: 'Historial de cambios',
      },
      it: {
        language: 'Italian (italiano)',
        ApiGui: 'This script helps to assign ranks to the players before a fort battle.<br>To see more details, click in the chat on the rank-symbol next to the nicknames.',
        save: 'Save',
        saveMessage: 'Salva con successo',
        chooseLang: 'Cambia lingua',
        contact: 'Contatto',
        success: 'Il rango è stato dato!',
        error: 'Si e\' verificato un errore',
        showPlayerOnMap: 'Centra nella mappa',
        showTown: 'Mostra riepilogo città',
        showAlly: 'Mostra alleanza',
        showFort: 'Mostra panoramica forte',
        showBattle: 'Spettacolo campo di battaglia',
        atFort: 'Al forte',
        nearFort: 'Vicino al forte',
        notFort: 'Non al forte',
        evaluated: 'Valuta giocatore',
        started: 'La battaglia è in pieno svolgimento',
        remindAlly: 'Ricordare i membri dell alleanza, che non hanno ancora partecipato',
        where: 'Dove',
        when: 'Quando',
        att: 'Attaccanti',
        def: 'Difensori',
        nodata: 'Impossibile caricare le informazioni di rango per la fortezza',
        getData: 'Caricamento Informazioni rango',
        errorTimeout: 'Il caricamento ha richiesto troppo tempo',
        ascaptain: 'Promuovi a capitano',
        assergeant: 'Nomina sergente',
        asprivate: 'Nomina soldato semplice',
        asrecruit: 'Nomina recluta',
        asreservist: 'Nomina riservista',
        astraitor: 'Contrassegna come traditore',
        youcant: 'Non è possibile il reclutamento di giocatori<br>con rango uguale o superiore.',
        position: 'Posizione',
        pos_undefined: 'Nessuna posizione di partenza',
        notown: 'No town',
        noally: 'Nessuna alleanza',
        flag: 'Bandiera',
        inside: 'All\'interno del forte',
        sectors: {
          undef: 'Nessuna posizione di partenza',
          0: ' -O1- Il settore superiore sinistro',
          1: ' -O2- Il settore centrale sinistro',
          2: ' -S1- Il settore in basso a sinistra',
          3: ' -S2- Il settore centrale',
          4: ' -S3- Il settore in basso a destra',
          5: ' -E2- Il settore centrale destro',
          6: ' -E1- Il settore superiore destro',
          7: 'Torre avventuriero',
          8: 'Torre duellante',
          9: 'Torre soldato',
          10: 'Torre lavoratore',
          11: 'Caserma',
          12: 'Magazzino',
          13: 'Quartier generale',
          14: 'Muro nord',
          15: 'Muro sud',
          16: 'Muro ovest',
          17: 'Muro est',
          18: 'Cancello',
          19: 'Bandiera',
          20: 'All\'interno del forte'
        },
        damage: 'Danno',
        version: 'versione',
        changelist: 'Elenco delle modifiche',
      },
      pt: {
        language: 'Portuguese (português)',
        ApiGui: 'This script helps to assign ranks to the players before a fort battle.<br>To see more details, click in the chat on the rank-symbol next to the nicknames.',
        save: 'Salvar',
        saveMessage: 'Economize com sucesso',
        chooseLang: 'Escolhe idioma',
        contact: 'Contato',
        success: 'Classificação é dada!',
        error: 'Ocorreu um erro',
        showPlayerOnMap: 'Mostra jogador no mapa',
        showTown: 'Mostrar visualização da cidade',
        showAlly: 'Mostra alliança',
        showFort: 'Mostrar vista geral do forte',
        showBattle: 'Mostrar campo de batalha',
        atFort: 'No forte',
        nearFort: 'Perto do forte',
        notFort: 'Não está no forte',
        evaluated: 'Avaliar jogador',
        started: 'A batalha está a decorrer agora',
        remindAlly: 'Relembre os membros da aliança, que ainda não participaram',
        where: 'Onde',
        when: 'Quando',
        att: 'Atacantes',
        def: 'Defensores',
        nodata: 'Não é possível carregar as informações para a classificar o forte',
        getData: 'A carregar informações de classificação',
        errorTimeout: 'O carregamento demorou demasiado tempo',
        ascaptain: 'Promover a capitão',
        assergeant: 'Nomear como sargento',
        asprivate: 'Nomear para soldado raso',
        asrecruit: 'Nomear para recruta',
        asreservist: 'Nomear como reservista',
        astraitor: 'Marcar como traidor',
        youcant: 'Não é possível dar patente a jogadores<br>com patente igual ou superior.',
        position: 'Posição',
        pos_undefined: 'Nenhuma posição',
        notown: 'No town',
        noally: 'Nome da Aliança',
        flag: 'Bandiera',
        inside: 'Dentro da forte',
        sectors: {
          undef: 'Não há posição de partida',
          0: 'sector superior esquerdo',
          1: 'sector centro esquerda',
          2: 'sector inferior esquerdo',
          3: 'sector inferior central',
          4: 'sector inferior direito',
          5: 'sector centro direita',
          6: 'sector superior direito',
          7: 'torre dos Aventureiros',
          8: 'torre dos Pistoleiros ',
          9: 'torre dos soldados',
          10: 'torre dos Trabalhadores',
          11: 'Quartel ',
          12: 'Armazém',
          13: 'Quartel Geral ',
          14: 'Muro norte',
          15: 'Muro sul',
          16: 'Muro esquerdo',
          17: 'Muro direito',
          18: 'Portão',
          19: 'Bandeira',
          20: 'Dentro do forte'
        },
        damage: 'Dano',
        version: 'versão',
        changelist: 'Lista de mudanças',
      },
      sk: {
        language: 'Slovak (slovenčina)',
        ApiGui: 'This script helps to assign ranks to the players before a fort battle.<br>To see more details, click in the chat on the rank-symbol next to the nicknames.',
        save: 'Save',
        saveMessage: 'Uloženie úspešne',
        chooseLang: 'Choose Language',
        contact: 'Kontakt',
        success: 'Hodnosti boli udelené!',
        error: 'Vyskytol sa problém',
        showPlayerOnMap: 'Ukázať hráča na mape',
        showTown: 'Ukázať náhl\'ad mesta',
        showAlly: 'Ukázať náhl\'ad aliancia',
        showFort: 'Ukázať náhl\'ad pevnosti',
        showBattle: 'Zobraziť bojisko',
        atFort: 'V pevnosti',
        nearFort: 'V blízkosti pevnosti',
        notFort: 'Mimo pevnosti',
        evaluated: 'Posúdenie hráča',
        started: 'Boj je v plnom prúde',
        remindAlly: 'Pripomeňte členmi aliancie, ktorí sa doteraz podieľal',
        where: 'Kde',
        when: 'Kedy',
        att: 'Útočníci',
        def: 'Obrancovia',
        nodata: 'Informácie pre pevnosť sa nedali načítať',
        getData: 'Načítavanie informácií',
        errorTimeout: 'Načítavanie trvalo príliš dlho',
        ascaptain: 'Povýšiť na kapitána',
        assergeant: 'Vymenovať za seržanta',
        asprivate: 'Vymenovať za slobodníka',
        asrecruit: 'Vymenovať za nováčika',
        asreservist: 'Vymenovať za záložnika',
        astraitor: 'Označiť ako zradcu',
        youcant: 'Nemôžeš degradovať bojovníkov s rovnakou<br>alebo vyššou hodnosťou.',
        position: 'Pozícia',
        pos_undefined: 'nemá zadanú pozíciu',
        notown: 'No town',
        noally: 'Bez aliancie',
        flag: 'Vlajka',
        inside: 'V pevnosti',
        sectors: {
          undef: 'Nemá zadanú pozíciu',
          0: 'Horný ľavý sektor',
          1: 'Stredný ľavý sektor',
          2: 'Spodný ľavý sektor',
          3: 'Spodný stredný sektor',
          4: 'Spodný pravý sektor',
          5: 'Stredný pravý sektor',
          6: 'Horný pravý sektor',
          7: 'Veža dobrodruhov',
          8: 'Veža duelantov',
          9: 'Veža vojakov',
          10: 'Veža pracovníkov',
          11: 'Kasárne',
          12: 'Sklad',
          13: 'Hlavná budova',
          14: 'Severná hradba',
          15: 'Južná hradba',
          16: 'Západná hradba',
          17: 'Východná hradba',
          18: 'Brána',
          19: 'Vlajka',
          20: 'V pevnosti'
        },
        damage: 'Poškodenie',
        version: 'verzia',
        changelist: 'Zmeny',
      },
      pl: {
        language: 'Polish (polski)',
        ApiGui: 'This script helps to assign ranks to the players before a fort battle.<br>To see more details, click in the chat on the rank-symbol next to the nicknames.',
        save: 'Zapisz',
        saveMessage: 'Zapisz powodzeniem',
        chooseLang: 'Wybierz język',
        contact: 'Kontakt',
        success: 'Ranga została zmieniona!',
        error: 'Wystąpił błąd',
        showPlayerOnMap: 'Pokaż gracza na mapie',
        showTown: 'Pokaż podgląd profilu',
        showAlly: 'Pokaż podgląd sojuszu',
        showFort: 'Pokaż podgląd fortu',
        showBattle: 'Pokaż bitwy',
        atFort: 'W forcie',
        nearFort: 'W pobliżu fortu',
        notFort: 'Nie w forcie',
        evaluated: 'Ocena gracza',
        started: 'Bitwa właśnie się odbywa',
        remindAlly: 'Przypomnij członków sojuszu, którzy nie dotychczas ze',
        where: 'Gdzie',
        when: 'Gdy',
        att: 'Napastnicy',
        def: 'Obrońcy',
        nodata: 'Nie można załadować danych fortu',
        getData: 'Pobieranie danych o rangach',
        errorTimeout: 'Zbyt długie ładowanie danych',
        ascaptain: 'Awans na kapitana',
        assergeant: 'Mianowanie na sierżanta',
        asprivate: 'Mianowanie na szeregowca',
        asrecruit: 'Mianowanie na rekruta',
        asreservist: 'Mianowanie na rezerwistę',
        astraitor: 'Oznacz jako zdrajcę',
        youcant: 'Nie można zmienić ragi, posiadasz<br>niższą lub taką samą rangę.',
        position: 'Pozycja',
        pos_undefined: 'Źle ustawiony',
        notown: 'No town',
        noally: 'Bez sojuszu',
        flag: 'Flaga',
        inside: 'W forcie',
        sectors: {
          undef: 'Źle ustawiony',
          0: 'Lewy górny - 7',
          1: 'Lewy dolny - 6',
          2: 'Dolny lewy - 5',
          3: 'Dolny środkowy - 4',
          4: 'Dolny Prawy - 3',
          5: 'Prawy dolny - 2',
          6: 'Prawy górny - 1',
          7: 'Baszta poszukiwaczy',
          8: 'Baszta zawadiaków',
          9: 'Baszta żołnierzy',
          10: 'Baszta budowniczych',
          11: 'Koszary',
          12: 'Magazyn',
          13: 'Budynek główny',
          14: 'Górny mur',
          15: 'Dolny mur',
          16: 'Lewy mur',
          17: 'Prawy mur',
          18: 'Brama',
          19: 'Flaga',
          20: 'W środku fortu'
        },
        damage: 'Obrażenia',
        version: 'wersja',
        changelist: 'Zmiany',
      },
      de: {
        language: 'German (Deutsch)',
        ApiGui: 'Das Script hilft dir beim Mustern vor einem Fortkampf.<br>Klicke im Fortkampf-Chat einfach auf die Rangsymbole neben dem Spielernamen um mehr Details zu sehen.',
        save: 'Speichern',
        saveMessage: 'Speichern erfolgreich',
        chooseLang: 'Sprache ändern',
        contact: 'Kontakt',
        success: 'Musterung erfolgreich!',
        error: 'Ein Fehler ist aufgetreten',
        showPlayerOnMap: 'Spieler auf Karte zeigen',
        showTown: 'Stadtübersicht anzeigen',
        showAlly: 'Bündnisübersicht anzeigen',
        showFort: 'Fortübersicht anzeigen',
        showBattle: 'Schlachtfeld öffnen',
        atFort: 'Im Fort',
        nearFort: 'In der Nähe des Forts',
        notFort: 'Nicht im Fort',
        evaluated: 'Anzahl gemusterte Spieler',
        started: 'Die Schlacht ist in vollem Gange',
        remindAlly: 'Informiere Allianzmitglieder, die noch nicht angemeldet sind',
        where: 'Wo',
        when: 'Wann',
        att: 'Angreifer',
        def: 'Verteidiger',
        nodata: 'Rang-Informationen für das Fort konnten nicht geladen werden',
        getData: 'Rang-Informationen werden geladen',
        errorTimeout: 'Zeitüberschreitung',
        ascaptain: 'Zum Captain befördern',
        assergeant: 'Zum Sergeant ernennen',
        asprivate: 'Zum Private ernennen',
        asrecruit: 'Zum Rekruten ernennen',
        asreservist: 'Zum Reservisten ernennen',
        astraitor: 'Als Verräter markieren',
        youcant: 'Du kannst Kämpfer von gleichem oder<br>höherem Rang nicht degradieren.',
        position: 'Position',
        pos_undefined: 'Keine Startposition',
        notown: 'Stadtlos',
        noally: 'Ohne Bündnis',
        flag: 'Flagge',
        inside: 'Innerhalb des Forts',
        sectors: {
          undef: 'Keine Startposition',
          0: 'Sektor oben-links',
          1: 'Sektor unten-links',
          2: 'Sektor mitte-links',
          3: 'Sektor unten-mitte',
          4: 'Sektor mitte-rechts',
          5: 'Sektor unten-rechts',
          6: 'Sektor oben-rechts',
          7: 'Abenteurerturm',
          8: 'Duellantentrum',
          9: 'Soldatenturm',
          10: 'Arbeiterturm',
          11: 'Kaserne',
          12: 'Rohstofflager',
          13: 'Hauptgebäude',
          14: 'Nordwall',
          15: 'Südwall',
          16: 'Westwall',
          17: 'Ostwall',
          18: 'Tor',
          19: 'Flagge',
          20: 'Innerhalb des Forts'
        },
        damage: 'Schaden',
        version: 'Version',
        changelist: 'Changelog',
      },
      el: {
        language: 'Greek (ελληνικά)',
        ApiGui: 'Αυτό το script βοηθά να αναθέσετε βαθμούς στους παίκτες πριν από μια μάχη οχυρών.<br>Για να δείτε περισσότερες λεπτομέρειες, κάντε κλικ στο σύμβολο της <img src="images/chat/servicegrade_recruit.png" alt="image"> Στρατολόγησης<br>δίπλα στο ψευδόνυμό τους στο Τσατ του Οχυρού.',
        save: 'Αποθήκευση',
        saveMessage: 'Αποθηκεύτηκε με επιτυχία',
        chooseLang: 'Επιλογή Γλώσσας',
        contact: 'Επικοινωνία',
        success: 'Ο βαθμός άλλαξε με επιτυχία!',
        error: 'Παρουσιάστηκε σφάλμα',
        showPlayerOnMap: 'Κεντράρισμα παίχτη στον χάρτη',
        showTown: 'Επισκόπηση Πόλης',
        showAlly: 'Επισκόπηση Συμμαχίας',
        showFort: 'Επισκόπηση Οχυρού',
        showBattle: 'Επισκόπηση Μάχης Οχυρού',
        atFort: 'Βρίσκεται στο Οχυρό',
        nearFort: 'Βρίσκεται κοντά στο Οχυρό',
        notFort: 'Βρίσκεται μακριά από το Οχυρό',
        evaluated: 'Αριθμός αξιολογούμενων παικτών',
        started: 'Η μάχη μόλις ξεκίνησε',
        remindAlly: 'Στείλτε μύνημα στα μέλη της συμμαχίας,<br>που δεν έχουν ακόμη συμμετάσχει στην μάχη.',
        where: 'Πάμε στο Οχυρό',
        when: 'Ημέρα Μάχης',
        att: 'Επιτιθέμενοι',
        def: 'Αμυνόμενοι',
        nodata: 'Δεν ήταν δυνατή η φόρτωση των πληροφοριών κατάταξης βαθμίδας για το οχυρό',
        getData: 'Φόρτωση πληροφοριών κατάταξης βαθμίδας',
        errorTimeout: 'Η φόρτωση χρειάστηκε πολύ χρόνο',
        ascaptain: 'Προβιβασμός σε Καπετάνιο',
        assergeant: 'Ορισμός ως Λοχίας',
        asprivate: 'Διορισμός ως Στρατιώτης',
        asrecruit: 'Ορισμός ως Αστρατολόγητος',
        asreservist: 'Ορισμός ως Έφεδρος',
        astraitor: 'Σήμανση ως Προδότης',
        youcant: 'Δεν μπορείτε να υποβιβάσετε παίχτες<br>της ίδιας ή υψηλότερης βαθμίδας',
        position: 'Θέση στο οχυρό',
        pos_undefined: 'Χωρίς θέση ακόμη',
        notown: 'Χωρίς πόλη',
        noally: 'Χωρίς συμμαχία',
        flag: 'Σημαία',
        inside: 'Μέσα στο Οχυρό',
        sectors: {
          undef: '❝Χωρίς θέση ακόμη❞',
          0: '❝Αριστερός (πάνω) μεγάλος τομέας❞',
          1: '❝Αριστερός (κάτω) μεγάλος τομέας❞',
          2: '❝Κεντρικός (αριστερά) μεγάλος τομέας❞',
          3: '❝Κεντρικός (μεσαίος) μεγάλος τομέας❞',
          4: '❝Κεντρικός (δεξιά) μεγάλος τομέας❞',
          5: '❝Δεξιός (κάτω) μεγάλος τομέας❞',
          6: '❝Δεξιός (πάνω) μεγάλος τομέας❞',
          7: '❝Πύργος Τυχοδιοκτών❞',
          8: '❝Πύργος Μονομάχων❞',
          9: '❝Πύργος Στρατιωτών❞',
          10: '❝Πύργος Εργατών❞',
          11: '❝Κάτω δεξιά Σπιτάκι❞',
          12: '❝Πάνω δεξιά Σπιτάκι❞',
          13: '❝Αριστερά Σπιτάκι❞',
          14: '❝Πάνω τοίχος❞',
          15: '❝Κάτω τοίχος❞',
          16: '❝Αριστερό τοίχος❞',
          17: '❝Δεξιό τοίχος❞',
          18: '❝Πύλες❞',
          19: '❝Σημαία❞',
          20: '❝Μέσα στο οχυρό❞'
        },
        damage: 'Ζημιά',
        version: 'Έκδοση',
        changelist: 'Αλλαγές',
      },
    },
    updateLang: function () {
      var lg = KoM.langs;
      KoM.lang = lg[localStorage.getItem('scriptsLang')] ? localStorage.getItem('scriptsLang') : lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : 'en';
      KoMlang = lg[KoM.lang];
    },
  };
  KoM.updateLang();
  var langBox = new west.gui.Combobox();
  for (var j in KoM.langs)
    langBox.addItem(j, KoM.langs[j].language);
  langBox.select(KoM.lang);
  var saveBtn = new west.gui.Button(KoMlang.save, function () {
      localStorage.setItem('scriptsLang', langBox.getValue());
      KoM.updateLang();
      new UserMessage(KoMlang.saveMessage, UserMessage.TYPE_SUCCESS).show();
    }),
  fmfb = function (l) {
    return 'https://forum.the-west.' + l + '/index.php?conversations/add&to=Tom Robert';
  };
  TheWestApi.register('kickomatic', KoM.name, KoM.minGame, KoM.maxGame, KoM.author, KoM.website).setGui($('<div>' + KoMlang.chooseLang + ': </div>').append(langBox.getMainDiv()).append(saveBtn.getMainDiv()).append('<br><br>' + KoMlang.ApiGui +
      '<br><br><i>' + KoM.name + ' v' + KoM.version + '</i><br><br><br><b>' + KoMlang.contact +
      ':</b><ul style="margin-left:15px;"><li>Send a message to <a target=\'_blanck\' href="http://om.the-west.de/west/de/player/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert on German world Arizona</a></li>' +
      '<li>Contact me on <a target=\'_blanck\' href="https://greasyfork.org/forum/messages/add/Tom Robert">Greasy Fork</a></li>' +
      '<li>Message me on one of these The West Forum:<br>/ <a target=\'_blanck\' href="' + fmfb('de') + '">deutsches Forum</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('net') + '">English forum</a> / <a target=\'_blanck\' href="' + fmfb('pl') + '">forum polski</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('es') + '">foro español</a> /<br>/ <a target=\'_blanck\' href="' + fmfb('ru') + '">Русский форум</a> / ' +
      '<a target=\'_blanck\' href="' + fmfb('fr') + '">forum français</a> / <a target=\'_blanck\' href="' + fmfb('it') + '">forum italiano</a> / ' +
      '<a target=\'_blanck\' href="https://forum.beta.the-west.net//index.php?conversations/add&to=Tom Robert">beta forum</a> /<br>I will get an e-mail when you sent me the message <img src="../images/chat/emoticons/smile.png"></li></ul>'));
  KoM.consoleError = function (error) {
    try {
      throw new Error(error);
    } catch (e) {
      console.log(e.stack);
    }
  };
  KoM.init = function () {
    KoM.coords = {
      'attack': {
        0: 0,
        1: 0,
        2: 0,
        34: 0,
        35: 0,
        36: 0,
        68: 0,
        69: 0,
        70: 0,
        102: 0,
        103: 0,
        104: 0,
        136: 0,
        137: 0,
        138: 0,
        170: 0,
        171: 0,
        172: 0,
        204: 0,
        205: 0,
        206: 0,
        238: 0,
        239: 0,
        240: 0,
        272: 0,
        273: 0,
        274: 0,
        306: 0,
        307: 0,
        308: 0,
        340: 0,
        341: 0,
        342: 0,
        374: 1,
        375: 1,
        376: 1,
        408: 1,
        409: 1,
        410: 1,
        442: 1,
        443: 1,
        444: 1,
        476: 1,
        477: 1,
        478: 1,
        510: 1,
        511: 1,
        512: 1,
        544: 1,
        545: 1,
        546: 1,
        578: 1,
        579: 1,
        580: 1,
        612: 1,
        613: 1,
        614: 1,
        646: 1,
        647: 1,
        648: 1,
        680: 1,
        681: 1,
        682: 1,
        714: 2,
        748: 2,
        782: 2,
        715: 2,
        749: 2,
        783: 2,
        716: 2,
        750: 2,
        784: 2,
        717: 2,
        751: 2,
        785: 2,
        718: 2,
        752: 2,
        786: 2,
        719: 2,
        753: 2,
        787: 2,
        720: 2,
        754: 2,
        788: 2,
        721: 2,
        755: 2,
        789: 2,
        722: 2,
        756: 2,
        790: 2,
        723: 2,
        757: 2,
        791: 2,
        724: 2,
        758: 2,
        792: 2,
        725: 3,
        759: 3,
        793: 3,
        726: 3,
        760: 3,
        794: 3,
        727: 3,
        761: 3,
        795: 3,
        728: 3,
        762: 3,
        796: 3,
        729: 3,
        763: 3,
        797: 3,
        730: 3,
        764: 3,
        798: 3,
        731: 3,
        765: 3,
        799: 3,
        732: 3,
        766: 3,
        800: 3,
        733: 3,
        767: 3,
        801: 3,
        734: 3,
        768: 3,
        802: 3,
        735: 3,
        769: 3,
        803: 3,
        736: 4,
        770: 4,
        804: 4,
        737: 4,
        771: 4,
        805: 4,
        738: 4,
        772: 4,
        806: 4,
        739: 4,
        773: 4,
        807: 4,
        740: 4,
        774: 4,
        808: 4,
        741: 4,
        775: 4,
        809: 4,
        742: 4,
        776: 4,
        810: 4,
        743: 4,
        777: 4,
        811: 4,
        744: 4,
        778: 4,
        812: 4,
        745: 4,
        779: 4,
        813: 4,
        746: 4,
        747: 4,
        780: 4,
        781: 4,
        814: 4,
        815: 4,
        405: 5,
        406: 5,
        407: 5,
        439: 5,
        440: 5,
        441: 5,
        473: 5,
        474: 5,
        475: 5,
        507: 5,
        508: 5,
        509: 5,
        541: 5,
        542: 5,
        543: 5,
        575: 5,
        576: 5,
        577: 5,
        609: 5,
        610: 5,
        611: 5,
        643: 5,
        644: 5,
        645: 5,
        677: 5,
        678: 5,
        679: 5,
        711: 5,
        712: 5,
        713: 5,
        31: 6,
        32: 6,
        33: 6,
        65: 6,
        66: 6,
        67: 6,
        99: 6,
        100: 6,
        101: 6,
        133: 6,
        134: 6,
        135: 6,
        167: 6,
        168: 6,
        169: 6,
        201: 6,
        202: 6,
        203: 6,
        235: 6,
        236: 6,
        237: 6,
        269: 6,
        270: 6,
        271: 6,
        303: 6,
        304: 6,
        305: 6,
        337: 6,
        338: 6,
        339: 6,
        371: 6,
        372: 6,
        373: 6
      },
      0: {
        178: 7,
        179: 7,
        180: 7,
        212: 7,
        213: 7,
        214: 7,
        246: 7,
        247: 7,
        248: 7,
        193: 8,
        194: 8,
        195: 8,
        227: 8,
        228: 8,
        229: 8,
        261: 8,
        262: 8,
        263: 8,
        450: 9,
        451: 9,
        452: 9,
        484: 9,
        485: 9,
        486: 9,
        518: 9,
        519: 9,
        520: 9,
        465: 10,
        466: 10,
        467: 10,
        499: 10,
        500: 10,
        501: 10,
        533: 10,
        534: 10,
        535: 10,
        291: 11,
        292: 11,
        293: 11,
        325: 11,
        326: 11,
        327: 11,
        393: 13,
        394: 13,
        395: 13,
        427: 13,
        428: 13,
        429: 13,
        318: 12,
        319: 12,
        352: 12,
        353: 12,
        386: 12,
        387: 12,
        215: 14,
        216: 14,
        217: 14,
        218: 14,
        219: 14,
        220: 14,
        221: 14,
        222: 14,
        223: 14,
        224: 14,
        225: 14,
        226: 14,
        487: 15,
        488: 15,
        489: 15,
        490: 15,
        491: 15,
        494: 15,
        495: 15,
        496: 15,
        497: 15,
        498: 15,
        281: 16,
        315: 16,
        349: 16,
        383: 16,
        417: 16,
        296: 17,
        330: 17,
        364: 17,
        398: 17,
        432: 17,
        492: 18,
        493: 18,
        287: 19,
        288: 19,
        289: 19,
        290: 19,
        321: 19,
        322: 19,
        323: 19,
        324: 19,
        355: 19,
        356: 19,
        357: 19,
        358: 19,
        389: 19,
        390: 19,
        391: 19,
        392: 19
      },
      1: {
        143: 7,
        144: 7,
        145: 7,
        177: 7,
        178: 7,
        179: 7,
        211: 7,
        212: 7,
        213: 7,
        160: 8,
        161: 8,
        162: 8,
        194: 8,
        195: 8,
        196: 8,
        228: 8,
        229: 8,
        230: 8,
        483: 9,
        484: 9,
        485: 9,
        517: 9,
        518: 9,
        519: 9,
        551: 9,
        552: 9,
        553: 9,
        500: 10,
        501: 10,
        502: 10,
        534: 10,
        535: 10,
        536: 10,
        568: 10,
        569: 10,
        570: 10,
        326: 11,
        327: 11,
        328: 11,
        360: 11,
        361: 11,
        362: 11,
        385: 13,
        386: 13,
        387: 13,
        419: 13,
        420: 13,
        421: 13,
        250: 12,
        251: 12,
        284: 12,
        285: 12,
        318: 12,
        319: 12,
        180: 14,
        181: 14,
        182: 14,
        183: 14,
        184: 14,
        185: 14,
        186: 14,
        187: 14,
        188: 14,
        189: 14,
        190: 14,
        191: 14,
        192: 14,
        193: 14,
        520: 15,
        521: 15,
        522: 15,
        523: 15,
        524: 15,
        525: 15,
        528: 15,
        529: 15,
        530: 15,
        531: 15,
        532: 15,
        533: 15,
        246: 16,
        280: 16,
        314: 16,
        348: 16,
        382: 16,
        416: 16,
        450: 16,
        263: 17,
        297: 17,
        331: 17,
        365: 17,
        399: 17,
        433: 17,
        467: 17,
        526: 18,
        527: 18,
        287: 19,
        288: 19,
        289: 19,
        290: 19,
        321: 19,
        322: 19,
        323: 19,
        324: 19,
        355: 19,
        356: 19,
        357: 19,
        358: 19,
        389: 19,
        390: 19,
        391: 19,
        392: 19
      },
      2: {
        108: 7,
        109: 7,
        110: 7,
        142: 7,
        143: 7,
        144: 7,
        176: 7,
        177: 7,
        178: 7,
        127: 8,
        128: 8,
        129: 8,
        161: 8,
        162: 8,
        163: 8,
        195: 8,
        196: 8,
        197: 8,
        516: 9,
        517: 9,
        518: 9,
        550: 9,
        551: 9,
        552: 9,
        584: 9,
        585: 9,
        586: 9,
        535: 10,
        536: 10,
        537: 10,
        569: 10,
        570: 10,
        571: 10,
        603: 10,
        604: 10,
        605: 10,
        258: 12,
        259: 12,
        292: 12,
        293: 12,
        326: 12,
        327: 12,
        395: 11,
        396: 11,
        429: 11,
        430: 11,
        463: 11,
        464: 11,
        384: 13,
        385: 13,
        386: 13,
        418: 13,
        419: 13,
        420: 13,
        145: 14,
        146: 14,
        147: 14,
        148: 14,
        149: 14,
        150: 14,
        151: 14,
        152: 14,
        153: 14,
        154: 14,
        155: 14,
        156: 14,
        157: 14,
        158: 14,
        159: 14,
        160: 14,
        553: 15,
        554: 15,
        555: 15,
        556: 15,
        557: 15,
        558: 15,
        559: 15,
        562: 15,
        563: 15,
        564: 15,
        565: 15,
        566: 15,
        567: 15,
        568: 15,
        211: 16,
        245: 16,
        279: 16,
        313: 16,
        347: 16,
        381: 16,
        415: 16,
        449: 16,
        483: 16,
        230: 17,
        264: 17,
        298: 17,
        332: 17,
        366: 17,
        400: 17,
        434: 17,
        468: 17,
        502: 17,
        560: 18,
        561: 18,
        287: 19,
        288: 19,
        289: 19,
        290: 19,
        321: 19,
        322: 19,
        323: 19,
        324: 19,
        355: 19,
        356: 19,
        357: 19,
        358: 19,
        389: 19,
        390: 19,
        391: 19,
        392: 19
      }
    };
    KoM.is_beta = window.location.href.match(/beta/);
    if (KoM.is_beta) {
      KoM.fortsCapacity = KoM.betaFortsCapacity;
    } // Названия алов

    KoM.highlightedFortCells = {};
    // Размеры фортов
    KoM.fort = {};
    KoM.fortSizeLoading = {};
    // Где стоят игроки на форте (additionalinfo.idx)
    KoM.playersPosition = {};
    // Лычки игроков
    KoM.playerRank = {};
    // Более подробная информация об игроках, чем в чате
    KoM.playersData = {};
    KoM.allies = {};
    KoM.playersDataLoading = {};
    // Список игроков, которым надо раздать лычки
    ChatWindow.Client.onClickOrigin = ChatWindow.Client.onClick;
    ChatWindow.Client.onClick = function (args, id) {
      if (args[0].target.className.indexOf('chat_servicegrade') !== 0) {
        ChatWindow.Client.onClickOrigin(args, id);
      }
    };
    // KoM.queue = {};
  };
  KoM.highlightFortCell = function (idx, fortId) {
    if (idx == null || idx ==  - 1)
      return;
    var battlegroundEl = $('#fort_battle_' + fortId + '_battleground');
    var pos = $('.cell-' + idx).position();
    $('.battleground_marker', battlegroundEl).css(pos);
    KoM.highlightedFortCells[fortId] = true;
  };
  KoM.unhighlightFortCell = function (fortId) {
    var battlegroundEl = $('#fort_battle_' + fortId + '_battleground');
    var pos = {
      top: '',
      left: ''
    };
    $('.battleground_marker', battlegroundEl).css(pos);
    if (!KoM.highlightedFortCells[fortId])
      return;
  };
  KoM.isFortHighlighted = function (fortId) {
    return KoM.highlightedFortCells[fortId];
  };
  KoM.hidePopup = function () {
    KoM.mb.hide();
    for (var fortId in KoM.highlightedFortCells) {
      KoM.unhighlightFortCell(fortId);
    }
  };
  KoM.getAlliance = function (player_Id) {
    if (KoM.allies[player_Id])
      return;
    Ajax.remoteCallMode('profile', 'init', {
      playerId: player_Id
    }, function (resp) {
      if (resp.town && resp.town.alliance_id)
        KoM.allies[resp.playerid] = [
          resp.town.alliance_id,
          resp.town.alliance_name
        ];
      else
        KoM.allies[resp.playerid] = [
          null,
          KoMlang.noally
        ];
    });
  };
  KoM.pushChatSystemMessage = function (str) {
    Chat.pushSystemMessage(str);
  };
  KoM.updatePrivilege = function (fortId, westId, rank) {
    var list = {};
    list[westId] = rank;
    var data = {
      fort_id: fortId,
      privileges: list
    };
    Ajax.remoteCall('fort_battlepage', 'updatePrivileges', data, function (response) {
      if (response.hasOwnProperty('playerlist') && response.playerlist.length > 0) {
        new UserMessage(KoMlang.success, {
          type: 'success'
        }).show();
      }
      KoM.setPlayerRank(fortId, westId, rank);
      KoM.hidePopup();
    });
  };
  KoM.makeRankRow = function (rank, westId, fortId) {
    var rankList = {
      '-2': 'traitor',
      '-1': 'reservist',
      '0': 'recruit',
      '1': 'private',
      '2': 'sergeant',
      '3': 'captain',
      '4': 'general'
    };
    function rankLink(image, fortId, westId, rank) {
      var rL = $('<a/>');
      rL.attr('onclick', 'KoM.updatePrivilege(' + fortId + ', ' + westId + ', ' + rank + ');');
      rL.append(image, KoMlang['as' + rankList[rank]]);
      return rL;
    }
    function rankImage(rrank) {
      var img = $('<img/>');
      img.attr('src', '/images/chat/servicegrade_' + rrank + '.png');
      img.attr('title', '<strong>' + Chat.rankTitles[rrank] + '</strong>');
      return img;
    }
    return rankLink(rankImage(rankList[rank]), fortId, westId, rank);
  };
  KoM.makeRankUpdateHtml = function (myRank, playerRank, westId, fortId) {
    var span = $('<span/>');
    var div = $('<div/>');
    function appendError(text) {
      var d = $('<div/>');
      // d.css("width", "200px");
      d.css('padding', '4px');
      d.css('text-align', 'center');
      d.html(text);
      span.append(d);
    }
    if (myRank > 2)
      if (playerRank < myRank) {
        var fromRank = myRank == 4 ? 3 : 2;
        for (var rank = fromRank; rank >=  - 2; rank--) {
          if (rank == playerRank)
            continue;
          var row = KoM.makeRankRow(rank, westId, fortId);
          div.append(row, $('<br>'));
        }
      } else {
        appendError('<br>' + KoMlang.youcant);
      }
    span.append(div);
    return span;
  };
  KoM.getPlayerFortPosition = function (fortId, westId) {
    if (!KoM.playersPosition.hasOwnProperty(fortId))
      return;
    return KoM.playersPosition[fortId].hasOwnProperty(westId) ? KoM.playersPosition[fortId][westId] : null;
  };
  KoM.getPlayerClass = function (playerClass) {
    return playerClass + '.png" title="' + Game.InfoHandler.getLocalString4Charclass(playerClass);
  };
  KoM.setPlayerFortPosition = function (fortId, westId, pos) {
    if (!KoM.playersPosition.hasOwnProperty(fortId)) {
      KoM.playersPosition[fortId] = {};
    }
    KoM.playersPosition[fortId][westId] = pos;
  };
  KoM.makeSmallTitle = function (playerName, westId, playerX, playerY) {
    var span = $('<span/>');
    span.attr('onclick', 'PlayerProfileWindow.open(' + westId + ')');
    span.html(playerName);
    var st = $('<a/>');
    st.attr('onclick', 'Map.center(' + playerX + ', ' + playerY + ')');
    st.attr('title', KoMlang.showPlayerOnMap);
    st.css({
      width: '15px',
      height: '15px',
      display: 'inline-block',
      background: 'url(/images/tw2gui/window/window2_title_divider.jpg) no-repeat'
    });
    span.append('&nbsp;', st);
    return span;
  };
  KoM.getPlayerRank = function (fortId, westId) {
    if (KoM.playerRank[fortId] && KoM.playerRank[fortId].hasOwnProperty(westId))
      return KoM.playerRank[fortId][westId];
    return null;
  };
  KoM.getFortRanks = function (fortId) {
    return KoM.playerRank.hasOwnProperty(fortId) ? KoM.playerRank[fortId] : null;
  };
  KoM.setPlayerRank = function (fortId, westId, rank) {
    if (!KoM.playerRank.hasOwnProperty(fortId)) {
      KoM.playerRank[fortId] = {};
    }
    KoM.playerRank[fortId][westId] = rank;
  };
  KoM.smallPopUp = function (e) {
    try {
      if (KoM.loading)
        return;
      KoM.loading = true;
      var x = e.clientX || 500;
      var y = e.clientY || 500;
      var westId = KoM.westId;
      var r,
      rooms = Chat.Resource.Manager.getRooms();
      for (r in rooms) {
        var room = Chat.Resource.Manager.getRoom(r);
        if (!(room instanceof Chat.Resource.RoomFortBattle) || room.id != KoM.fortRoom)
          continue;
        var fortId = room.fortId;
        if (KoM.started(fortId /*, true, westId*/))
          continue;
        var playerRank = KoM.getPlayerRank(fortId, westId),
        myId = Chat.MyId.match(/[0-9]+/),
        myRank = KoM.getPlayerRank(fortId, myId),
        playerInfo = KoM.playersData[westId],
        playerName = playerInfo.name,
        playerX = playerInfo.coords.x,
        playerY = playerInfo.coords.y,
        title = KoM.makeSmallTitle(playerName, westId, playerX, playerY);
        KoM.mb = new west.gui.Dialog(title.outerHTML()).addButton('cancel').setId('KickoMaticPopUp').setModal(true, true);
        KoM.mb.setText(KoM.makeRankUpdateHtml(myRank, playerRank, westId, fortId)).setX(x).setY(y - 50).show();
        break;
      }
      KoM.loading = false;
    } catch (e) {
      KoM.loading = false;
      new UserMessage('<span>' + e + '</spawn>', 'error').show();
      KoM.consoleError(e);
    }
  };
  KoM.makePopupHtml = function (fortId, fortX, fortY, distanceImage, playerPositionName, rankHtml, weaponName, weaponMinDamage, weaponMaxDamage, currentHp, maxHp, townName, townId, townRights, playerClass) {
    var capacityDiv = KoM.makeCapacityDiv(fortId);
    var fillPx = Math.floor(currentHp / maxHp * 194);
    return '<div class="txcenter"><div style="background:url(https://tomrobert.safe-ws.de/healthbar.png) right top; width: 210px;height:14px;display:inline-block;padding:2px;margin:0;font-size:8pt; text-align:left;"><div style="background: url(&quot;images/character_bars/filler.png&quot;) repeat scroll 0% 0% transparent; width:' +
    fillPx + 'px; height: 14px; padding: 0pt; margin: 0pt; position: absolute;" id="recruit_healthbar"></div><div id="recruit_health" style="position:absolute; color:white;width: 194px;text-align:center">' + currentHp + '/' + maxHp + '</div></div><br><div>' +
    weaponName + ' (' + weaponMinDamage + '-' + weaponMaxDamage + ' ' + KoMlang.damage + ')</div><span style="font-size:16px; text-align: center;" ><div style="display:inline-block;" ><img src="../images/class_choose/class_' + playerClass +
    '"><a style="display:inline;padding:0;" class="profile_link_town_overview" title="' + KoMlang.showTown + '" href="javascript:void(TownWindow.open(' + townId + '));" > ' + townName +
    '</a>' + /*<br><a style="display:inline;padding:0;" class="open_alliance" title="' + KoMlang.showAlly + '" href="javascript:void(parent.AllianceWindow.open(' + ally[0] + '));" > ' + ally[1] +
    '</a>*/
    '</span><br><img src="../images/fort/battle/divider.png" ></div><br>' + distanceImage.outerHTML() + '&nbsp;<a title="' + KoMlang.showFort + '" href="javascript:void(FortWindow.open(' + fortId + '))" >' + KoM.fort[fortId].name +
    '</a><p>' + capacityDiv + '</p><p><a title="' + KoMlang.showBattle + '" href="javascript:void(FortBattleWindow.open(' + fortId + '))" >' +
    KoMlang.position + ': ' + playerPositionName + '</a></p><img src="../images/fort/battle/divider.png" ><br>' +
    rankHtml.outerHTML() + '</div>';
  };
  KoM.makeDistanceImage = function (fortX, fortY, playerX, playerY) {
    var diffX = fortX - playerX;
    var diffY = fortY - playerY;
    var image = $('<img/>');
    if (!diffX && !diffY) {
      image.attr('src', '/images/town/cityhall/green.png').attr('title', KoMlang.atFort);
    } else if (Math.abs(diffX) <= 500 && Math.abs(diffY) <= 500) {
      image.attr('src', '/images/town/cityhall/yellow.png').attr('title', KoMlang.nearFort);
    } else {
      image.attr('src', '/images/town/cityhall/red.png').attr('title', KoMlang.notFort);
    }
    return image;
  };
  KoM.popUp = function (e) {
    try {
      if (KoM.loading)
        return;
      KoM.loading = true;
      var x = e.clientX || 500;
      var y = e.clientY || 500;
      var westId = KoM.westId;
      var r,
      rooms = Chat.Resource.Manager.getRooms();
      for (r in rooms) {
        var room = Chat.Resource.Manager.getRoom(r);
        if (!(room instanceof Chat.Resource.RoomFortBattle) || room.id != KoM.fortRoom) {
          continue;
        }
        var fortId = room.fortId;
        if (KoM.started(fortId /*, true, westId*/))
          continue;
        var fortCoords = KoM.fort[fortId],
        playerRank = KoM.getPlayerRank(fortId, westId),
        myId = Chat.MyId.match(/[0-9]+/),
        myRank = KoM.getPlayerRank(fortId, myId),
        playerInfo = KoM.playersData[westId],
        playerName = playerInfo.name,
        playerLevel = playerInfo.level,
        playerX = playerInfo.coords.x,
        playerY = playerInfo.coords.y,
        playerPos = KoM.getPlayerFortPosition(fortId, westId),
        playerClass = KoM.getPlayerClass(playerInfo.class),
        currentHp = playerInfo.currhealth,
        maxHp = playerInfo.maxhealth;
        //var alliance = KoM.allies[westId];
        if ($('.fortbattle-' + fortId).length) {
          KoM.highlightFortCell(playerPos, fortId);
        }
        var positionName;
        if (playerPos == null || playerPos ==  - 1) {
          positionName = KoMlang.sectors.undef;
        } else if (KoM.fort[fortId].defense) {
          positionName = KoMlang.sectors[KoM.coords[KoM.fort[fortId].type][playerPos]];
          if (playerPos ==  - 1) {
            positionName = KoMlang.sectors.undef;
          } else if (positionName == undefined) {
            positionName = KoMlang.inside;
          }
        } else {
          positionName = KoMlang.sectors[KoM.coords.attack[playerPos]];
          if (positionName == undefined) {
            positionName = KoMlang.inside;
          }
        }
        var weaponMinDamage = playerInfo.weapon_damage.min;
        var weaponMaxDamage = playerInfo.weapon_damage.max;
        var weaponName = playerInfo.weapon;
        //var weaponImage = KoM.getWeaponImage(weaponName);
        var townId = playerInfo.town_id;
        var townRights;
        var town = playerInfo.townname || KoMlang.notown;
        switch (playerInfo.town_rights) {
        case 1:
          townRights = 'norights';
          break;
        case 2:
          townRights = 'councillor';
          break;
        case 3:
          townRights = 'founder';
          break;
        default:
          townRights = 'norights';
          break;
        }
        var distanceImage = KoM.makeDistanceImage(fortCoords.x, fortCoords.y, playerX, playerY);
        var rankHtml = KoM.makeRankUpdateHtml(myRank, playerRank, westId, fortId);
        var text = KoM.makePopupHtml(fortId, fortCoords.x, fortCoords.y, distanceImage, positionName, rankHtml, weaponName, weaponMinDamage, weaponMaxDamage, currentHp, maxHp, town, townId, townRights, playerClass);
        var title = KoM.makeSmallTitle(playerName, westId, playerX, playerY);
        KoM.mb = new west.gui.Dialog(title.outerHTML(), text).addButton('cancel').setId('KickoMaticPopUp').setModal(true, true).setX(x).setY(y - 50);
        KoM.mb.show();
        $('#KickoMaticPopUp').css('min-width', '0');
        $('#KickoMaticPopUp .messagedialog_content').css('padding-bottom', '5px');
        break;
      }
      KoM.loading = false;
    } catch (e) {
      console.log(e.stack);
      KoM.loading = false;
      new UserMessage('<span>' + e + '</spawn>', 'error').show();
    }
  };
  KoM.getWeapons = function () {
    if (KoM.weapons.length > 0)
      return;
    var itemId = 100,
    result = {};
    while (result != null) {
      result = ItemManager.getByBaseId(itemId++);
      KoM.weapons.push(result);
    }
  };
  KoM.getWeaponImage = function (weaponName) {
    KoM.getWeapons();
    for (var itemId in KoM.weapons) {
      var w = KoM.weapons[itemId];
      if (weaponName == w.name) {
        return w.image;
      }
    }
  };
  KoM.obtainFortSize = function (room) {
    var x = room.battleData.x,
    y = room.battleData.y;
    if (KoM.fortSizeLoading.hasOwnProperty(x + '' + y) && KoM.fortSizeLoading[x + '' + y] == true)
      return;
    KoM.fortSizeLoading[x + '' + y] = true;
    if (x == undefined || y == undefined) {
      console.log('x or y is undefined');
      return;
    }
    Ajax.remoteCallMode('fort', 'display', {
      x: x,
      y: y
    }, function (data) {
      var fD = KoM.fort[data.data.fortid] = data.data;
      fD.defense = room.battleData.defense;
      fD.capacity = KoM.fortsCapacity[fD.type][(fD.defense ? 1 : 0)];
      fD.startTime = new Date(new Date().getTime() + fD.battle.fortBattleStart * 1000).toDateTimeStringNice();
      KoM.fortSizeLoading[x + '' + y] = false;
    });
  };
  KoM.getFortCoordinates = function (fortId) {
    return KoM.fortCoordinates.hasOwnProperty(fortId) ? KoM.fortCoordinates[fortId] : null;
  };
  KoM.obtainPlayersData = function (fortId) {
    if (KoM.playersDataLoading.hasOwnProperty(fortId) && KoM.playersDataLoading[fortId] == true)
      return;
    KoM.playersDataLoading[fortId] = true;
    Ajax.remoteCall('fort_battlepage&fort_id=' + fortId, '', {}, function (data) {
      if (data.inProgress === false) {
        var playerList = data.playerlist;
        for (var i in playerList) {
          if (playerList.hasOwnProperty(i)) {
            var id = playerList[i].player_id;
            //KoM.getAlliance(id);
            KoM.setPlayerRank(fortId, id, playerList[i].privilege);
            KoM.setPlayerFortPosition(fortId, id, playerList[i].idx);
            KoM.playersData[id] = playerList[i];
          }
        }
      } else
        KoM.inProgress[fortId] = true;
      KoM.playersDataLoading[fortId] = false;
    });
  };
  KoM.started = function (fi, a, id) {
    if (KoM.inProgress[fi]) {
      new UserMessage(KoMlang.started, 'error').show();
      return true;
    } else if ($.isEmptyObject(KoM.playersData) || a && !KoM.allies[id]) {
      new UserMessage(KoMlang.getData + '...', 'hint').show();
      return true;
    }
  };
  KoM.openMessage = function (fortId) {
    if (KoM.started(fortId))
      return;
    Ajax.remoteCall('messages', 'insert_alliance_members', {
      type: 'members'
    }, function (json) {
      if (json[0] === false)
        new UserMessage(json[1], 'error').show();
      else {
        KoM.allyMembers = json[1].split(';');
        var done = 0;
        for (var a in KoM.playersData) {
          KoM.allyMembers[KoM.allyMembers.indexOf(KoM.playersData[a].name)] = null;
          done++;
          if (Object.keys(KoM.playersData).length == done) {
            MessagesWindow.open('telegram', {
              insert_to: KoM.allyMembers.toString().replace(/[,]+/g, ';')
            });
            var Kff = KoM.fort[fortId];
            var defAtt = Kff.defense ? KoMlang.def : KoMlang.att;
            setTimeout(function () {
              MessagesWindow.Telegram.subjectInput.setValue(Kff.name + ' ' + Kff.startTime);
              MessagesWindow.Telegram.masstelegramInput.setSelected(true);
              MessagesWindow.Telegram.telegramInput.setContent('[b]' + KoMlang.where + ':[/b] [fort]' + Kff.name + '[/fort]\n[b]' + KoMlang.when + ':[/b] ' + Kff.startTime + '\n[b]' + Kff.typename + ':[/b] ' + Kff.capacity + ' ' + defAtt);
            }, 1000);
          }
        }
      }
    });
  };
  KoM.interval = function () {
    KoM.bindClickFunctions();
    try {
      var rooms = Chat.Resource.Manager.getRooms();
      for (var r in rooms) {
        var room = Chat.Resource.Manager.getRoom(r);
        if (!room.hasOwnProperty('room') || room.room != 'fortbattle') {
          continue;
        }
        var fortId = room.fortId;
        if (!KoM.fort.hasOwnProperty(fortId)) {
          KoM.obtainFortSize(room);
        }
        if ($('.battleMessage' + fortId).length === 0)
          $('#tab_title_' + r + ' .chat_icons').css('background-image', 'url("https://tomrobert.safe-ws.de/cicons.png")').append('<div class="battleMessage' + fortId + '"/>').attr('title', KoMlang.remindAlly).click(function () {
            KoM.openMessage(fortId);
          });
      }
    } catch (e) {
      console.log(e.stack);
    }
  };
  KoM.dataInterval = function () {
    var rooms = Chat.Resource.Manager.getRooms();
    for (var r in rooms) {
      var room = Chat.Resource.Manager.getRoom(r);
      if (!room.hasOwnProperty('room') || room.room != 'fortbattle') {
        continue;
      }
      var fortId = room.fortId;
      KoM.obtainPlayersData(fortId);
    }
  };
  KoM.bindClickFunctions = function () {
    var fContacts = function (e) {
      KoM.westId = $(this).parent().attr('class').match(/[0-9]+/);
      var lastElement = $(this);
      for (var i = 0; i < 10; i++) {
        lastElement = lastElement.parent();
      }
      var room = lastElement.attr('class').match(/(room_fortbattle_(att|def)_[0-9]+)/);
      KoM.fortRoom = room[1];
      if (e.ctrlKey) {
        KoM.smallPopUp(e);
      } else {
        KoM.popUp(e);
      }
    };
    var fMessages = function (e) {
      KoM.westId = $(this).parent().attr('class').match(/[0-9]+/);
      var lastElement = $(this);
      for (var i = 0; i < 12; i++) {
        lastElement = lastElement.parent();
      }
      var room = lastElement.attr('class').match(/(room_fortbattle_(att|def)_[0-9]+)/);
      KoM.fortRoom = room[1];
      if (e.ctrlKey) {
        KoM.smallPopUp(e);
      } else {
        KoM.popUp(e);
      }
    };
    var classes = [
      'chat_servicegrade_general',
      'chat_servicegrade_captain',
      'chat_servicegrade_sergeant',
      'chat_servicegrade_private',
      'chat_servicegrade_recruit',
      'chat_servicegrade_reservist',
      'chat_servicegrade_traitor'
    ];
    $.each(classes, function (k, v) {
      $('.chat_contacts .' + v).off('click').on('click', fContacts);
      $('.chat_messages .' + v).off('click').on('click', fMessages);
    });
  };
  KoM.makeCapacityDiv = function (fortId) {
    var ranks = [
      1, 2, 3
    ],
    fortCapacity = KoM.fort[fortId].capacity,
    count = KoM.countPlayersWithRanks(fortId, ranks),
    color;
    if (count < fortCapacity) {
      color = 'green';
    } else if (count == fortCapacity) {
      color = 'yellow';
    } else {
      color = 'red';
    }
    return '<span><span style="color:' + color + ';" id="fortCapacity' + fortId + '" title="' + KoMlang.evaluated + '">' + count + '/' + fortCapacity + '</span><p></p></span>';
  };
  KoM.countPlayersWithRanks = function (fortId, ranks) {
    function isArray(a) {
      return (typeof a == 'object') && (a instanceof Array);
    }
    if (!(isArray(ranks))) {
      ranks = [
        ranks
      ];
    }
    var result = 0;
    var fortRanks = KoM.getFortRanks(fortId);
    if (ranks == null) {
      return 0;
    }
    for (var westId in fortRanks) {
      if (ranks.indexOf(fortRanks[westId]) != -1) {
        result++;
      }
    }
    return result;
  };
  KoM.thatWouldntHappendIfZetWasStillWorkingOnTheWest = function () {
    Chat.Resource.RoomFactory = function (data) {
      var room = null;
      if (data instanceof Chat.Resource.Client) {
        room = new Chat.Resource.RoomClient(data);
      } else {
        switch (data.room) {
        case 'town':
          room = new Chat.Resource.RoomTown(data.townid, data.x, data.y);
          break;
        case 'general':
          room = new Chat.Resource.RoomGeneral(data.general_id);
          break;
        case 'maneuver':
          room = new Chat.Resource.RoomManeuver(data.fortid, data.xy);
          break;
        case 'fortbattle':
          room = new Chat.Resource.RoomFortBattle(data.fortid);
          break;
        default:
          room = new Chat.Resource.Room();
        }
      }
      room.init();
      return room;
    };
  };
  $.fn.outerHTML = function () {
    return $('<div />').append(this.eq(0).clone()).html();
  };
  KoM.init();
  KoM.interval();
  KoM.dataInterval();
  KoM.thatWouldntHappendIfZetWasStillWorkingOnTheWest();
  setInterval(KoM.interval, 1000);
  setInterval(KoM.dataInterval, 10000);
});
