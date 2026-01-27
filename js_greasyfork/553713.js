// ==UserScript==
// @name             HWHNewCharacterExt
// @name:en          HWHNewCharacterExt
// @name:ru          HWHNewCharacterExt
// @namespace        HWHNewCharacterExt
// @version          2.25
// @description      Extension for HeroWarsHelper script
// @description:en   Extension for HeroWarsHelper script
// @description:ru   Расширение для скрипта HeroWarsHelper
// @author           ZingerY, Green
// @license          Copyright Green
// @icon             https://i.ibb.co/xtmhK7zS/icon.png
// @match            https://www.hero-wars.com/*
// @match            https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at           document-start
// @downloadURL https://update.greasyfork.org/scripts/553713/HWHNewCharacterExt.user.js
// @updateURL https://update.greasyfork.org/scripts/553713/HWHNewCharacterExt.meta.js
// ==/UserScript==

(function () {
    if (!this.HWHClasses) {
        console.log('%cObject for extension not found', 'color: red');
        return;
    }

    console.log('%cStart Extension ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: red');
    const { addExtentionName } = HWHFuncs;
    addExtentionName(GM_info.script.name, GM_info.script.version, GM_info.script.author);

    const { popup, confShow, setProgress, I18N, countdownTimer } = HWHFuncs;

    const { i18nLangData } = HWHData;

    const { WinFixBattle } = HWHClasses;

    const i18nLangDataEn = {
        NEW_CHARACTER: 'New Character',
        NEW_CHARACTER_TITLE: 'Complete quests for a new hero or titan',
        NEW_CHARACTER_NO_EVENT: 'The event is not active',
        NEW_CHARACTER_SOMETHING_WENT_WRONG:`<span style="color: red;">Oops! Something went wrong</span>
          <br> Please try again
          <br> If you keep seeing this, wait for the next extension update`,
        NEW_CHARACTER_SELECT_ACTION: 'Select an action',
        NT_TITAN_EVENT: '<span style="color: White; font-size: 35px;"> The Titan Awakens </span> <br>',
        NT_COLLECT_TITANS: 'Сollect the Titans',
        NT_COLLECT_TITANS_TITLE: 'Сollecting the Titans of the maximum rank by purchasing fragments in the store',
        NT_COLLECT_HEROES: 'Сollect the Heroes',
        NT_COLLECT_HEROES_TITLE: 'Сollecting the Heroes of the maximum rank by purchasing fragments in the store',
        NT_COLLECT_TOTEM_SKILLS: 'Сollect totem skills',
        NT_COLLECT_TOTEM_SKILLS_TITLE: 'Get the influence skill of the maximum rank by purchasing fragments in the store',
        NT_COLLECT_TITANS_PROGRESS: '<span style="color: LimeGreen;"> {counter} </span> titans left to collect',
        NT_TITANS_COLLECTED: 'All titans have been collected',
        NT_TOTEM_SKILLS_COLLECTED: 'All influence skills have been collected',
        NT_TITANS_AND_TOTEM_SKILLS_COLLECTED: 'Titans and Totem influence skills have been collected',
        NT_COLLECT_TOTEM_SKILLS_PROGRESS: '<span style="color: LimeGreen;"> {counter} </span> influence skills left to collect <br> Collecting...',
        NT_CHAPTER_NOT_AVAILABLE: '<span style="color: red;"> Chapter unavailable </span> <br> Complete the previous chapter',
        NT_COLLECT_HEROES_PROGRESS: '<span style="color: LimeGreen;"> {counter} </span> heroes left to collect <br> Collecting...',
        NT_HEROES_COLLECTED: 'All heroes have been collected',
        NT_COLLECT_EVERYTHING: 'Collect everything',
        NT_COLLECT_EVERYTHING_TITLE: 'Collect heroes, titans, totems, pets',
        NT_BOSS_WAS_KILLED: 'The Chapter <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span> boss didn\'t appreciate our health-conscious approach... to his health.',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_1: 'All done. <span style="color: LimeGreen;">Boss defeated</span>. Collecting trophies...',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_2: '<br>Oh no, our loot is too much for this humble bag\'s capacity.',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_3: '<br>Urgently calling the porters guild.',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_4: '<br>All of it!',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_5: '<br><span style="color: LimeGreen;">Stand by.</span> Arrival in approximately seconds ',
        NT_BOSS_WAS_NOT_KILLED: 'The Chapter <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span> boss was not killed <br> Reload the game and try to kill the boss yourself',
        NT_COMPLETE_CHAPTER: 'Complete the chapter',
        NT_COMPLETE_CHAPTER_START: 'Kick off the Magic Vibe',
        NT_COMPLETE_CHAPTER_CANCEL: 'Hogwarts cancellation',
        NT_COMPLETE_CHAPTER_TITLE: 'Complete an available chapter',
        NT_ALL_CHAPTERS_COMPLETED: 'All chapters completed',
        NT_NOT_ENOUGH_BUFF:
          `Not enough buff to complete Chapter <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span>
          You have: <span style="color: red;"> {buffAmount} </span> <br>
          You need: <span style="color: LimeGreen;"> {invasionBuff} </span>`,
        NT_ENTER_TITAN_IDS:
          `Chapter <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span> is available for completion <br>
          Enter <span style="color: red;"> 5 </span> titan IDs separated by commas or dashes`,
        NT_ENTER_HERO_IDS:
          `Chapter <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span> is available for completion <br>
          Enter <span style="color: red;"> 5 </span> hero IDs separated by commas or dashes`,
        NT_MUST_FIVE_TITANS: 'There must be <span style="color: red;"> 5 </span> titans',
        NT_MUST_FIVE_HEROES: 'There must be <span style="color: red;"> 5 </span> heroes',
        NT_MUST_ONLY_NUMBERS: 'The list must contain only numbers and commas',
        NT_LETS_START: 'Let\'s start...',
        NT_LETS_CONTINUE: 'let\'s continue...',
        NT_COMPLETE_TITAN_TASKS_TITLE: 'Complete event tasks: collect heroes, titans, totem skills, pets',
        NT_OUTDATED_VERSION_OF_SCRIPT:
          `<span style="color: red;"> Outdated version of HeroWarsHelper </span><br>
          Please update the script`,
        NT_MISSION_PROGRESS: 'Taking out <span style="color: LimeGreen;"> {missionNumber} </span> enemy team',
        NT_MISSION_PROGRESS_BOSS: 'Let\'s wipe <span style="color: LimeGreen;">the boss</span> as a team!',
        NT_GET_TITAN_IDS: 'Titan IDs',
        NT_GET_TITAN_IDS_TITLE: 'Get a list of titan IDs',
        NT_WATER_TITANS: 'Water Titans',
        NT_EARTH_TITANS: 'Earth Titans',
        NT_FIRE_TITANS: 'Fire Titans',
        NT_LIGHT_TITANS: 'Light Titans',
        NT_DARK_TITANS: 'Dark Titans',
        NHR_NOTHING_HERE: 'There\'s nothing here yet. Please wait.',
        NHR_HERO_EVENT: '<span style="color: White; font-size: 35px;">Rise of a New Hero</span> <br>',
        NHR_COMPLETE_TASKS: 'Complete the tasks',
        NHR_COMPLETE_TASKS_TITLE: 'Complete event tasks: collect heroes, buy pets, spend coins',
        NHR_TASKS_COMPLETED: 'The tasks have been completed',
        NHR_LIVES_ARE_OVER: 'Failed to complete chapter <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span>. Lives are over. Try again',
        NHR_SHOPPING: 'Make purchases...',
        NHR_NOTHING_HERE_1: 'What\'s this? Where is it? When? Booooooooooosss...',
        NHR_NOTHING_HERE_2: 'Nobody\'s heeere! ',
        NHR_NOTHING_HERE_3: 'And nobody here either.',
        NHR_NOTHING_HERE_4: 'If he\'s not there, then what\'s supposed to be here?',
        NHR_COMPLETE_CHAPTER_N1: 'Raid for Chapter <span style="font-family: Times New Roman;">I</span>',
        NHR_COMPLETE_CHAPTER_N1_TITLE: 'Complete chapter I one time',
        NHR_COMPLETE_CHAPTER_N1_COMPLETED: 'Chapter <span style="color: LimeGreen; font-family: Times New Roman;">I</span> raid completed',
        NHR_CHAPTER_N1_RAID: 'Starting <span style="color: LimeGreen;">{raidNumber}</span>/3 raid chapter I',
        NHR_MAKE_OTHER_TASKS: '<br>Moving on to other quests',
        NHR_GET_HERO_IDS: 'Hero IDs',
        NHR_GET_HERO_IDS_TITLE: 'Get a list of hero IDs',
        NHR_GET_HERO_IDS_MESSAGE: '<span style="color: White; font-size: 25px;">ID - Name</span>',
        NHR_SPEND_VALOR_COINS: 'Spend Valor Coins',
        NHR_SPEND_VALOR_COINS_TITLE: 'Spend all available Valor Coins',
        NHR_NOT_ENOUGH_COINS: '<span style="font-size: 30px;">Not enough coins</span><br> <span style="color: LimeGreen; font-size: 30px;">No money, no honey </span>',
        NHR_SPEND_VALOR_COINS_RESULT:
          `<span style="font-size: 30px;">Valor Coin Exchange Result:</span><br><br>
          Sapphire Medallion: <span style="color: LimeGreen;">{sapphireMedallion}</span> <br>
          Soul stones: <span style="color: LimeGreen;">{fragmentHero}</span>`,
        NHR_SPEND_VALOR_COINS_MESSAGE: 'Exchange all available Coins of Valor?',

        NHR_APPLY: 'Spend it before I change my mind',
        NHR_NOT_APPLY: 'Oh no, I\'ve already changed my mind',
        NHR_COMPLETE_CHAPTER_N2: 'Let\'s begin to complete <span style="color: LimeGreen; font-family: Times New Roman;"> II </span> chapter',
        NHR_COMPLETE_CHAPTER_N1_MESSAGE: 'Complete chapter <span style="color: LimeGreen; font-family: Times New Roman;"> I </span>?',
        NHR_COMPLETE_CHAPTER_N1_APPLY: 'Click if you\'re brave',
        NHR_COMPLETE_CHAPTER_N1_NOT_APPLY: 'Nah, I\'m losing my nerve',
    };

    i18nLangData['en'] = Object.assign(i18nLangData['en'], i18nLangDataEn);

    const i18nLangDataRu = {
        NEW_CHARACTER: 'Новый персонаж',
        NEW_CHARACTER_TITLE: 'Выполнять задания для нового героя или титана',
        NEW_CHARACTER_NO_EVENT: 'Ивент не активен',
        NEW_CHARACTER_SOMETHING_WENT_WRONG: `<span style="color: red;">В процессе выполнения произошла ошибка</span>
          <br> Повторите действие еще раз
          <br> Если ошибка повторяется, подождите обновления расширения`,
        NEW_CHARACTER_SELECT_ACTION: 'Выберите действие',
        NT_TITAN_EVENT: '<span style="color: White; font-size: 35px;"> Пробуждение Титана </span> <br>',
        NT_COLLECT_TITANS: 'Собрать титанов',
        NT_COLLECT_TITANS_TITLE: 'Собрать титанов максимального ранга, покупая фрагменты в магазине',
        NT_COLLECT_HEROES: 'Собрать героев',
        NT_COLLECT_HEROES_TITLE: 'Собрать героев максимального ранга, покупая фрагменты в магазине',
        NT_COLLECT_TOTEM_SKILLS: 'Собрать тотемы',
        NT_COLLECT_TOTEM_SKILLS_TITLE: 'Собрать навыки тотемов максимального ранга, покупая фрагменты в магазине',
        NT_COLLECT_TITANS_PROGRESS: 'Осталось собрать титанов: <span style="color: LimeGreen;"> {counter} </span> шт.',
        NT_TITANS_COLLECTED: 'Титаны собраны',
        NT_TOTEM_SKILLS_COLLECTED: 'Все навыки влияния собраны',
        NT_TITANS_AND_TOTEM_SKILLS_COLLECTED: 'Титаны и навыки влияния тотемов собраны',
        NT_COLLECT_TOTEM_SKILLS_PROGRESS: 'Осталось собрать навыков тотемов: <span style="color: LimeGreen;"> {counter} </span> шт. <br> Собираем...',
        NT_CHAPTER_NOT_AVAILABLE: '<span style="color: red;"> Глава не доступна </span> <br> Завершите предыдущую главу',
        NT_COLLECT_HEROES_PROGRESS: 'Осталось собрать героев: <span style="color: LimeGreen;"> {counter} </span> шт. <br> Собираем...',
        NT_HEROES_COLLECTED: 'Все герои собраны',
        NT_COLLECT_EVERYTHING: 'Собрать все',
        NT_COLLECT_EVERYTHING_TITLE: 'Собрать героев, титанов, тотемы, питомцев',
        NT_BOSS_WAS_KILLED: 'Босс <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span> главы не пережил нашего искреннего интереса к его здоровью',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_1: 'Готовенько. <span style="color: LimeGreen;">Босс повержен</span>. Собираем трофеи...',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_2: '<br>О нет, размеры добычи превосходят скромные возможности этого мешка.',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_3: '<br>Срочно вызываем гильдию носильщиков!',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_4: '<br>Всю!',
        NT_BOSS_WAS_KILLED_SET_PROGRESS_5: '<br><span style="color: LimeGreen;">Ожидайте.</span> Прибытие, примерно секунд через ',
        NT_BOSS_WAS_NOT_KILLED: 'Босса <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span> главы не убили <br> Перезагрузите игру, и попробуйте убить босса самостоятельно',
        NT_COMPLETE_CHAPTER: 'Пройти главу',
        NT_COMPLETE_CHAPTER_START: 'Старт магического движняка',
        NT_COMPLETE_CHAPTER_CANCEL: 'Отмена Хогвартса',
        NT_COMPLETE_CHAPTER_TITLE: 'Пройти доступную главу',
        NT_ALL_CHAPTERS_COMPLETED: 'Все главы пройдены',
        NT_NOT_ENOUGH_BUFF:
          `Недостаточно усиления для прохождения <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span> главы <br>
          У вас: <span style="color: red;"> {buffAmount} </span> <br>
          Необходимо: <span style="color: LimeGreen;"> {invasionBuff} </span>`,
        NT_ENTER_TITAN_IDS:
          `Для прохождения доступна <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span> глава <br>
          Введите <span style="color: red;"> 5 </span> id <span style="color: LimeGreen;"> титанов </span> через запятые или дефисы`,
        NT_ENTER_HERO_IDS:
          `Для прохождения доступна <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span> глава <br>
          Введите <span style="color: red;"> 5 </span> id <span style="color: LimeGreen;"> героев </span> через запятые или дефисы`,
        NT_MUST_FIVE_TITANS:'Должно быть <span style="color: red;"> 5 </span> титанов',
        NT_MUST_FIVE_HEROES:'Должно быть <span style="color: red;"> 5 </span> героев',
        NT_MUST_ONLY_NUMBERS: 'Список должен содержать только цифры и запятые',
        NT_LETS_START: 'Начинаем начинать...',

        NT_LETS_CONTINUE: 'Продолжаем продолжать...',
        NT_COMPLETE_TITAN_TASKS_TITLE: 'Выполнить задания ивента: собрать героев, титанов, навыки тотемов, питомцев',

        NT_OUTDATED_VERSION_OF_SCRIPT:
          `<span style="color: red;"> Устаревшая версия HeroWarsHelper </span><br>
          Пожалуйста, обновите скрипт`,
        NT_MISSION_PROGRESS: 'Сносим <span style="color: LimeGreen;"> {missionNumber} </span> команду противника',
        NT_MISSION_PROGRESS_BOSS: 'Пакуем <span style="color: LimeGreen;">босса</span> всем коллективом!',
        NT_GET_TITAN_IDS: 'Id титанов',
        NT_GET_TITAN_IDS_TITLE: 'Получить список Id титанов',
        NT_WATER_TITANS: 'Титаны Воды',
        NT_EARTH_TITANS: 'Титаны Земли',
        NT_FIRE_TITANS: 'Титаны Огня',
        NT_LIGHT_TITANS: 'Титаны Света',
        NT_DARK_TITANS: 'Титаны Тьмы',
        NHR_NOTHING_HERE: 'Здесь пока ничего нет. Ожидайте',
        NHR_HERO_EVENT: '<span style="color: White; font-size: 35px;">Восхождение Нового Героя</span> <br>',
        NHR_COMPLETE_TASKS: 'Выполнить задания',
        NHR_COMPLETE_TASKS_TITLE: 'Выполнить задания ивента: собрать героев, купить питомцев, потратить монеты',
        NHR_TASKS_COMPLETED: 'Задания выполнены',
        NHR_LIVES_ARE_OVER:
          `Дорогой дневник, мне не подобрать слов, чтобы описать боль и унижение, которые были получены при походе на босса <span style="color: LimeGreen; font-family: Times New Roman;"> {chapterNumber} </span> главы.
          Наши богатыри были втянуты в яростный бой, точнее не бой, а именно пиздилку, мочилово, где всё равнялось, даже морды с асфальтом.
          И после нескольких дней этого хаоса и резни наступил бесславный и постыдный конец нашему походу.<br> <br>
          Конец. Конец. Концы в воду! Давай по новой!`,
        NHR_SHOPPING: 'Шопимся, шопимся, шопимся...',
        NHR_NOTHING_HERE_1: 'А чё это? А где? А когда? Хазяяяяяяяииинн...',
        NHR_NOTHING_HERE_2: 'Здеся никого нет!',
        NHR_NOTHING_HERE_3: 'И здесь тоже нет.',
        NHR_NOTHING_HERE_4: 'Если там нет, то чё здесь должно быть?',
        NHR_COMPLETE_CHAPTER_N1: 'Рейд <span style="font-family: Times New Roman;">I</span> главы',
        NHR_COMPLETE_CHAPTER_N1_TITLE: 'Пройти I главу 1 раз',
        NHR_COMPLETE_CHAPTER_N1_COMPLETED: 'Рейд <span style="color: LimeGreen; font-family: Times New Roman;">I</span> главы выполнен',
        NHR_CHAPTER_N1_RAID: 'Выполняем <span style="color: LimeGreen;">{raidNumber}</span>/3 рейд I главы',
        NHR_MAKE_OTHER_TASKS: '<br> Приступаем к выполнению других заданий',
        NHR_GET_HERO_IDS: 'Id героев',
        NHR_GET_HERO_IDS_TITLE: 'Получить список Id героев',
        NHR_GET_HERO_IDS_MESSAGE: '<span style="color: White; font-size: 25px;">ID - Имя</span>',
        NHR_SPEND_VALOR_COINS: 'Потратить монеты доблести',
        NHR_SPEND_VALOR_COINS_TITLE: 'Потратить все имеющиеся монеты доблести',
        NHR_NOT_ENOUGH_COINS: '<span style="font-size: 30px;">Нэт Монэт</span><br> <span style="color: LimeGreen; font-size: 30px;">Ноу мани - ноу хани</span>',
        NHR_SPEND_VALOR_COINS_RESULT:
          `<span style="font-size: 30px;">Результат обмена монет доблести: </span><br><br>
          <span style="color: LimeGreen;">3</span> магнитoфoна,  <span style="color: LimeGreen;">3</span> кинoкамеры заграничных,
          <span style="color: LimeGreen;">3</span> пoртсигара отечественных, куртка замшевая - <span style="color: LimeGreen;">три</span> куртки,
          сапфировый медальон - <span style="color: LimeGreen;">{sapphireMedallion}</span>, камни души - <span style="color: LimeGreen;">{fragmentHero}</span>`,
        NHR_SPEND_VALOR_COINS_MESSAGE: 'Потратить все имеющиеся монеты доблести?',

        NHR_APPLY: 'Потратить, пока не передумал',
        NHR_NOT_APPLY: 'А нет, не успел. Уже передумал',
        NHR_COMPLETE_CHAPTER_N2: 'Проходим <span style="color: LimeGreen; font-family: Times New Roman;"> II </span> главу',

        NHR_COMPLETE_CHAPTER_N1_MESSAGE: 'Выполнить рейд <span style="color: LimeGreen; font-family: Times New Roman;"> I </span> главы?',
        NHR_COMPLETE_CHAPTER_N1_APPLY: 'Жми, если смелый',
        NHR_COMPLETE_CHAPTER_N1_NOT_APPLY: 'Нет, чёт я очкую',
    };

    i18nLangData['ru'] = Object.assign(i18nLangData['ru'], i18nLangDataRu);

    const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

    ///////////////////////////////////////////////////////////////////////////////////////////////

    // Добавление кнопоки в окно Разное
    const { othersPopupButtons } = HWHData;
    othersPopupButtons.push({
        get msg() {
            return I18N('NEW_CHARACTER');
        },
        get title() {
            return I18N('NEW_CHARACTER_TITLE');
        },
        result: async function () {
            await onClickNewCharacterButton();
        },
        color: 'pink',
    });

    async function onClickNewCharacterButton() {
        if (compareVersions(scriptInfo.version, '2.390') < 0) {
            confShow(`${I18N('NT_OUTDATED_VERSION_OF_SCRIPT')}`);
            return;
        }
        console.log(scriptInfo.version);
        let invasionInfo = await Caller.send('invasion_getInfo');
//if (true) {
        if (invasionInfo) {
            let invasionInfoId = invasionInfo.id;
            let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId);
            //const startDate = new Date("2025-11-14 14:00:00".replace(' ', 'T') + 'Z');
            const startDate = new Date((chapters[0].startDate).replace(' ', 'T') + 'Z');
            const todayDate = Date.now();
            console.log(startDate);
            console.log(todayDate);

            if (todayDate < startDate) {
                confShow(`${I18N('NEW_CHARACTER_NO_EVENT')}`);
                return;
            }
            let titanIvent = false;
            for (let chapter of chapters) {
                if (chapter.settings?.unitType === 'titan') {
                    titanIvent = true;
                    break;
                }
            }

            if (titanIvent) {
//if (true) {
                await onClickNewTitanButton();
            } else {
                await onClickNewHeroButton();
            }
        } else {
            confShow(`${I18N('NEW_CHARACTER_NO_EVENT')}`);
        }
    }

    async function onClickNewHeroButton() {
        const popupButtons = [
            {
                get msg() {
                    return I18N('NHR_COMPLETE_TASKS');
                },
                get title() {
                    return I18N('NHR_COMPLETE_TASKS_TITLE');
                },
                result: async function () {
                    await completeHerosTasks();
                },
                color: 'green',
            },
            {
                get msg() {
                    return I18N('NT_COMPLETE_CHAPTER');
                },
                get title() {
                    return I18N('NT_COMPLETE_CHAPTER_TITLE');
                },
                result: async function () {
                    await completeChapter();
                },
                color: 'blue',
            },
            {
                get msg() {
                    return I18N('NHR_COMPLETE_CHAPTER_N1');
                },
                get title() {
                    return I18N('NHR_COMPLETE_CHAPTER_N1_TITLE');
                },
                result: async function () {
                    await completeChapterN1();
                },
                color: 'pink',
            },
            {
                get msg() {
                    return I18N('NHR_GET_HERO_IDS');
                },
                get title() {
                    return I18N('NHR_GET_HERO_IDS_TITLE');
                },
                result: function () {
                    getAllHeroIDs();
                },
                color: 'pink',
            },
            {
                get msg() {
                    return I18N('NHR_SPEND_VALOR_COINS');
                },
                get title() {
                    return I18N('NHR_SPEND_VALOR_COINS_TITLE');
                },
                result: async function () {
                    await spendValorCoins();
                },
                color: 'pink',
            },
        ];
        popupButtons.push({ result: false, isClose: true });
        const answer = await popup.confirm(I18N('NHR_HERO_EVENT'), popupButtons);
        if (typeof answer === 'function') {
            answer();
        }
    }

    async function onClickNewTitanButton() {
        const popupButtons = [
            {
                get msg() {
                    return I18N('NHR_COMPLETE_TASKS');
                },
                get title() {
                    return I18N('NT_COMPLETE_TITAN_TASKS_TITLE');
                },
                result: async function () {
                    await completeTitansTasks();
                },
                color: 'green',
            },
            {
                get msg() {
                    return I18N('NT_COMPLETE_CHAPTER');
                },
                get title() {
                    return I18N('NT_COMPLETE_CHAPTER_TITLE');
                },
                result: async function () {
                    await completeChapter();
                },
                color: 'blue',
            },
            {
                get msg() {
                    return I18N('NHR_GET_HERO_IDS');
                },
                get title() {
                    return I18N('NHR_GET_HERO_IDS_TITLE');
                },
                result: function () {
                    getAllHeroIDs();
                },
                color: 'pink',
            },
            {
                get msg() {
                    return I18N('NT_GET_TITAN_IDS');
                },
                get title() {
                    return I18N('NT_GET_TITAN_IDS_TITLE');
                },
                result: function () {
                    getAllTitanIDs();
                },
                color: 'pink',
            },
            {
                get msg() {
                    return I18N('NHR_SPEND_VALOR_COINS');
                },
                get title() {
                    return I18N('NHR_SPEND_VALOR_COINS_TITLE');
                },
                result: async function () {
                    await spendValorCoins();
                },
                color: 'pink',
            },
        ];
        popupButtons.push({ result: false, isClose: true });
        const answer = await popup.confirm(I18N('NT_TITAN_EVENT'), popupButtons);
        if (typeof answer === 'function') {
            answer();
        }
    }
    //****************************************************************************************************
    //****************************************************************************************************
    //****************************************************************************************************
    //****************************************************************************************************
    async function completeHerosTasks() {
        //Получить список героев, которых нужно собрать
        let heroIdsToBuy = await getHeroIdsToBuy();
        if (heroIdsToBuy.length != 0) {
            let spendCoins = true;
            //Собрать героев
            await collectHeroes(spendCoins);
            setProgress(`${I18N('NT_HEROES_COLLECTED')} ${I18N('NHR_MAKE_OTHER_TASKS')}`, false);
            await new Promise((e) => setTimeout(e, 2000));

            //Убрать сообщения обучения
            let tasks = Object.values(lib.data.tutorial.task).filter((e) => e.params && e.params.includes('invasion') && e.saveState != null);
            let calls = [];
            for (let task of tasks){
                calls.push({name: 'tutorialSaveProgress', args: {taskId: task.id }});
            }
            tasks = Object.values(lib.data.tutorial.task).filter((e) => e.name && e.name.includes('invasion') && e.saveState != null);
            for (let task of tasks){
                calls.push({name: 'tutorialSaveProgress', args: {taskId: task.id }});
            }
            if (calls.length >= 1) {
                calls.sort((a, b) => a.args.taskId - b.args.taskId);
                try{
                    await Caller.send(calls);
                } catch (e) {}
            }

            //Пройти II главу
            setProgress(I18N('NHR_COMPLETE_CHAPTER_N2'), false);
            await new Promise((e) => setTimeout(e, 2000));
            await secondHeroicChapterRaid();
            await new Promise((e) => setTimeout(e, 3000));

            //Выполнить рейды I главы
            for (let i = 1; i <= 3; i++) {
                setProgress(I18N('NHR_CHAPTER_N1_RAID', {raidNumber:i}), false);
                await new Promise((e) => setTimeout(e, 2000));
                await firstHeroicChapterRaid();
            }

            //Сбросить главу
            await Caller.send('invasion_resetChapter');
        }
        setProgress('', true);
        await popup.confirm(I18N('NHR_TASKS_COMPLETED'));

        //Возврат в меню "Новый герой"
        onClickNewHeroButton();
    }

    async function completeTitansTasks() {
        //Пройти I главу
        let farmedChapters = await Caller.send('invasion_getInfo').then((e) => e.farmedChapters);
        if (farmedChapters.length == 0) {
            await firstTitanChapterRaid();
            setProgress(I18N('NT_LETS_CONTINUE'), false);
            await new Promise((e) => setTimeout(e, 3000));
        }

        //Собрать титанов и тотемы
        await collectTitansAndTotemFragments();
        setProgress(I18N('NT_LETS_CONTINUE'), false);
        await new Promise((e) => setTimeout(e, 3000));

        //Пройти II главу
        farmedChapters = await Caller.send('invasion_getInfo').then((e) => e.farmedChapters);
        if (farmedChapters.length == 1) {
            await firstHeroicChapterRaid();
            setProgress(I18N('NT_LETS_CONTINUE'), false);
            await new Promise((e) => setTimeout(e, 3000));
        }

        //Собрать героев и питомцев
        await collectHeroes();
        setProgress(I18N('NT_LETS_CONTINUE'), false);
        await new Promise((e) => setTimeout(e, 3000));

        //Убрать сообщения обучения
        farmedChapters = await Caller.send('invasion_getInfo').then((e) => e.farmedChapters);
        if (farmedChapters.length == 2) {
            let tasks = Object.values(lib.data.tutorial.task).filter((e) => e.params && e.params.includes('invasion') && e.saveState != null);
            let calls = [];
            for (let task of tasks){
                calls.push({name: 'tutorialSaveProgress', args: {taskId: task.id }});
            }
            tasks = Object.values(lib.data.tutorial.task).filter((e) => e.name && e.name.includes('invasion') && e.saveState != null);
            for (let task of tasks){
                calls.push({name: 'tutorialSaveProgress', args: {taskId: task.id }});
            }
            if (calls.length >= 1) {
                calls.sort((a, b) => a.args.taskId - b.args.taskId);
                try{
                    await Caller.send(calls);
                } catch (e) {}
            }
        }

        //Сбросить главу
        await Caller.send('invasion_resetChapter');

        setProgress('', true);
        await popup.confirm(I18N('NHR_TASKS_COMPLETED'));
        //Возврат в меню "Новый титан"
        returnToNewTitanMenu();
    }
    async function completeChapterN1() {
        let answer = await popup.confirm(
            I18N('NHR_COMPLETE_CHAPTER_N1_MESSAGE'),
            [
                { msg: I18N('NHR_COMPLETE_CHAPTER_N1_APPLY'), result: true, color: 'green' },
                { msg: I18N('NHR_COMPLETE_CHAPTER_N1_NOT_APPLY'), result: false, isCancel: true, color: 'red' },
            ],
        );
        if (!answer) {
            //Возврат в меню "Новый герой"
            returnToNewHeroMenu();
            return;
        }
        await firstHeroicChapterRaid();
        setProgress('', true);
        await popup.confirm(I18N('NHR_COMPLETE_CHAPTER_N1_COMPLETED'));
        //Возврат в меню "Новый герой"
        returnToNewHeroMenu();
    }

    function returnToNewHeroMenu() {
        onClickNewHeroButton();
    }

    function returnToNewTitanMenu() {
        onClickNewTitanButton();
    }

    function returnToNewCharacterMenu() {
        onClickNewCharacterButton();
    }

    async function firstHeroicChapterRaid() {
        let titanOrHero = 'hero';
        let spendCoins = true;
        let missionRaid = true;
        await completeChapter(spendCoins, missionRaid, titanOrHero);
    }

    async function secondHeroicChapterRaid() {
        let titanOrHero = 'hero';
        let spendCoins = true;
        let missionRaid = true;
        let secondHeroicChapter = true;
        await completeChapter(spendCoins, missionRaid, titanOrHero, secondHeroicChapter);
    }

    async function firstTitanChapterRaid() {
        let titanOrHero = 'titan';
        let spendCoins = false;
        let missionRaid = true;
        await completeChapter(spendCoins, missionRaid, titanOrHero);
    }

    async function completeChapter(spendCoins = false, missionRaid = false, titanOrHero = '', secondHeroicChapter = false) {
        //Получить состояние на карте
        let invasionInfo = await Caller.send('invasion_getInfo');
        let invasionInfoId = invasionInfo.id;
        let farmedChapters = invasionInfo.farmedChapters;
        let buffAmount = invasionInfo.buffAmount;
        console.log('invasionInfoId ' + invasionInfoId);
        console.log('farmedChapters ', JSON.stringify(farmedChapters));
        console.log('buffAmount ' + buffAmount);

        //Получить id главы для атаки
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId);
        console.log(chapters);
        let chapterId = 0;
        let invasionBuff = 0;
        //let titanOrHero = '';
        let chapterNumber = 0;

        if (chapters.length == farmedChapters.length) {
            confShow(I18N('NT_ALL_CHAPTERS_COMPLETED'));
            return;
        }
        if (missionRaid == false) {
            for (let chapter of chapters) {
                if (!farmedChapters.includes(chapter.id)) {
                    chapterId = chapter.id;
                    if (chapter.requirements?.invasionBuff) {
                        invasionBuff = chapter.requirements.invasionBuff;
                    }
                    titanOrHero = chapter.settings.unitType;
                    chapterNumber = chapters.indexOf(chapter)+1;
                    break;
                }
            }
        }
        //Рейд мисси
        if (missionRaid == true) {
            if (secondHeroicChapter == true){
                chapterId = chapters[1].id;
                chapterNumber = 2;
            } else {
                for (let chapter of chapters) {
                    if (chapter.settings.unitType === titanOrHero) {
                        chapterId = chapter.id;
                        chapterNumber = chapters.indexOf(chapter)+1;
                        break;
                    }
                }
            }
        }

        console.log('chapterId ' + chapterId);
        console.log('invasionBuff ' + invasionBuff);
        console.log('titanOrHero ' + titanOrHero);
        console.log('chapterNumber ' + chapterNumber);

        if (buffAmount < invasionBuff) {
            await popup.confirm(I18N('NT_NOT_ENOUGH_BUFF', { chapterNumber: romanNumerals[chapterNumber], buffAmount, invasionBuff}));
            //Возврат в меню "Новый персонаж"
            returnToNewCharacterMenu();
            return;
        }
        if (titanOrHero === 'hero' ) {
            await completeHeroesChapter(chapters, chapterId, chapterNumber, farmedChapters, spendCoins, missionRaid);
        }
        if (titanOrHero === 'titan' ) {
            await completeTitansChapter(chapters, chapterId, chapterNumber, farmedChapters, missionRaid);
        }
        if (!missionRaid) {
            //Возврат в меню "Новый персонаж"
            returnToNewCharacterMenu();
        }
    }

    async function completeHeroesChapter(chapters, chapterId, chapterNumber, farmedChapters, spendCoins = false, missionRaid = false) {
        /*Питомцы
        6000 - Фенрис   //6005 - Альбрус
        6001 - Оливер	//6006 - Аксель
        6002 - Мерлин   //6007 - Бисквит
        6003 - Мара	    //6008 - Хорус
        6004 - Каин	    //6009 - Векс*/
        //Атакующие герои: Галахад, Тристан, Лирия, Кира, Себастьян.
        //let heroAttackingTeams = {heroes: [2, 54, 67, 3, 48], pets: [6005,6000,6001,6006]};

        //Атакующие герои: Электра, Каскад + Тея, Криста + Ларс.
        //let heroAttackingTeams = {heroes: [70, 69, 7, 33, 34], pets: [6005, 6001, 6002, 6003, 6006]};

        //Атакующие герои: Электра + Орион, Каскад, Криста + Ларс.
        //let heroAttackingTeams = {heroes: [70, 13, 69, 33, 34], pets: [6005, 6001, 6002, 6003, 6006]};

        //Атакующие герои: Электра, Каскад, Криста + Ларс, Хайди.
        let heroAttackingTeams = {heroes: [70, 69, 33, 34, 9], pets: [6005, 6001, 6002, 6003, 6006]};

        //Атакующие герои: Электра, Каскад, Айрис, Хайди, Дориан.
        //let heroAttackingTeams = {heroes: [70, 69, 55, 9, 29], pets: [6005, 6001, 6002, 6003, 6006]};

        let titanOrHero = 'hero';
        let heroIds = heroAttackingTeams.heroes;

        if (missionRaid == false) {
            //Кнопка ввод Id героев, что необходимо собрать
            console.log("chapterNumber chapterNumber" + chapterNumber);
            heroIds = await getTeamButton(heroAttackingTeams.heroes, chapterNumber, titanOrHero);
            console.log('heroIds ', JSON.stringify(heroIds));
            if (!heroIds) {
                return;
            }
        }

        setProgress(I18N('NT_LETS_START'), false);
        await new Promise((e) => setTimeout(e, 3000));

        //Активировать главу
        let chapterInfo = await Caller.send({ name: 'invasion_setActiveChapter', args: { chapterId: chapterId } });
        let haveHeroFragments = chapterInfo.invasion.fragments;
        console.log('haveHeroFragments ', JSON.stringify(haveHeroFragments));

        //Получить id магазина
        let shopId = await getShopId(chapters, titanOrHero); //1078; // Магазин титанов
        console.log('Id магазина ' + shopId);

        //Id миссии
        let firstMissionId = chapterInfo.invasion.actions[0].payload.id;
        let missionId = firstMissionId;

        //Жизни
        let lives = chapterInfo.invasion.lives;
        console.log('firstMissionId ' + firstMissionId);
        console.log('missionId ' + missionId);
        console.log('lives ' + lives);

        //Фрагменты героев
        let heroFragments = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            if (haveHeroFragments[heroIds[i]]) {
                heroFragments[i] = haveHeroFragments[heroIds[i]];
            }
        }
        console.log('shopId ' + shopId);
        console.log(heroIds);
        console.log('heroFragments ', JSON.stringify(heroFragments));

        //Питомцы, что необходимо купить
        let pets = heroAttackingTeams.pets;

        while (lives > 0 && missionId <= firstMissionId + 7) {
            //Купить героев
            setProgress(I18N('NHR_SHOPPING'), false);
            let result = await buyHeroesAndPets(shopId, heroIds, heroFragments, pets, spendCoins);

            //Текущая миссия босс или нет
            let boss = false;

            //Атаковать / не атаковать босса
            if (missionId == firstMissionId + 7) {
                if (missionRaid == true && farmedChapters.includes(chapterId)) {
                    return;
                }
                //Произвести атаку босса, если его ни разу не убили
                boss = true;
            }

            //Получить атакующую команду
            let heroes = [];
            let havePets = [];
            let pet;
            let allHeroes = [];
            let petsFavor = {};

            await getAttackingTeam(heroes, havePets, allHeroes);

            const haveAllAttackingTeams = (arr, values) => {
                return values.every(v => arr.includes(v));
            };
            if (haveAllAttackingTeams(allHeroes, heroIds)) {
                heroes = heroIds;
            }
            console.log('allHeroes ', JSON.stringify(allHeroes));
            console.log('heroes ', JSON.stringify(heroes));

            if (havePets.length > 0) {
                //Основной питомец первый в списке питомцев
                let mainPet = heroAttackingTeams.pets[0];
                if (havePets.includes(mainPet)) {
                    pet = mainPet;
                } else {
                    pet = havePets[0];
                }
                //Покровительство
                const petLib = lib.getData('pet');
                for (let heroId of heroes) {
                    /** Поиск питомца для героя */
                    for (let petId of havePets) {
                        if (petLib[petId].favorHeroes.includes(heroId)) {
                            petsFavor[heroId] = petId;
                            havePets = havePets.filter((e) => e != petId);
                            break;
                        };
                    }
                }
            }

            //Проходим миссию
            if (!boss) {
                setProgress(I18N('NT_MISSION_PROGRESS', {missionNumber: 1 + missionId - firstMissionId}), false);
            } else {
                setProgress(I18N('NT_MISSION_PROGRESS_BOSS'), false);
            }
            await new Promise((e) => setTimeout(e, 2000));

            let error = await attackHeroMission(missionId, chapterId, heroes, pet, boss, petsFavor);
            if (error) {
                await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
                return;
            }

            //Результат атаки
            let invasionInfo = await Caller.send('invasion_getInfo');
            let missions = Object.values(invasionInfo.actions);
            for (let mission of missions) {
                if (mission.payload.wins == 0) {
                    missionId = mission.payload.id;
                    break;
                }
            }

            //Результат атаки босса
            if (boss) {
                if (missionRaid) {
                    return;
                }
                if (invasionInfo.farmedChapters.includes(chapterId)) {
                    await popup.confirm(I18N('NT_BOSS_WAS_KILLED', { chapterNumber: romanNumerals[chapterNumber]}));
                    //Сбросить главу
                    await Caller.send('invasion_resetChapter')
                } else {
                    await popup.confirm(I18N('NT_BOSS_WAS_NOT_KILLED', { chapterNumber: romanNumerals[chapterNumber]}));
                }
                return;
            }
            lives = invasionInfo.lives;
            console.log('missionId ' + missionId);
            console.log('lives ' + lives);
        }
        if (lives == 0) {
            setProgress('', true);
            await popup.confirm(I18N('NHR_LIVES_ARE_OVER', { chapterNumber: romanNumerals[chapterNumber]}));
            return;
        }
    }



    async function completeTitansChapter(chapters, chapterId, chapterNumber, farmedChapters, missionRaid = false) {
        //Атакующие титаны: Ияри, Солярис, Молох, Игнис, Араджи
        /*Навыки тотемов:
        elemental                  primal
        4500 - Последний Всполох   4506 - Пульс Древних
        4502 - Ледниковый Период   4507 - Первородное Рвение
        4503 - Гнев Недр           4508 - Эгида Эха
        4509 - Танец Пламени       4514 - Тройной Круговорот
        4510 - Шепот Глубин        4515 - Зов Стихий
        4511 - Гул Скал */

        const elementalSkils = [4500,4502,4503,4509,4510,4511];
        const primalSkils = [4506,4507,4508,4514,4515];
        let titanAttackingTeams = {heroes: [4042, 4043, 4010, 4012, 4013], titanSkilsIds: [4500, 4507]};

        let titanOrHero = 'titan';
        let titanIds = titanAttackingTeams.heroes;

        if (missionRaid == false) {
            //Id титанов, что необходимо собрать
            titanIds = await getTeamButton(titanAttackingTeams.heroes, chapterNumber, titanOrHero);
            console.log('titanIds ', JSON.stringify(titanIds));
            if (!titanIds) {
                return;
            }
        }
        setProgress(I18N('NT_LETS_START'), false);
        await new Promise((e) => setTimeout(e, 3000));

        //Активировать главу
        let chapterInfo = await Caller.send({ name: 'invasion_setActiveChapter', args: { chapterId: chapterId } });
        let haveTitanFragments = chapterInfo.invasion.fragments;
        console.log('haveTitanFragments ', JSON.stringify(haveTitanFragments));

        //Получить id магазина
        let shopId = await getShopId(chapters, titanOrHero); //1073; // Магазин титанов
        console.log('Id магазина ' + shopId);

        //Id миссии
        let firstMissionId = chapterInfo.invasion.actions[0].payload.id;
        let missionId = firstMissionId;

        //Жизни
        let lives = chapterInfo.invasion.lives;
        console.log('firstMissionId ' + firstMissionId);
        console.log('missionId ' + missionId);
        console.log('lives ' + lives);

        //Фрагменты титанов
        let titanFragments = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            if (haveTitanFragments[titanIds[i]]) {
                titanFragments[i] = haveTitanFragments[titanIds[i]];
            }
        }
        console.log('shopId ' + shopId);
        console.log(titanIds);
        console.log('titanFragments ', JSON.stringify(titanFragments));

        //Навыки тотемов, что необходимо собрать
        let titanSkilsIds = titanAttackingTeams.titanSkilsIds;

        //Фрагменты навыков тотемов
        let titanSkilFragments = [];
        for (let i = 0; i < titanSkilsIds.length; i++){
            titanSkilFragments.push(0);
        }

        while (lives > 0 && missionId <= firstMissionId + 7) {
            setProgress(I18N('NHR_SHOPPING'), false);
            //Купить титанов и фрагменты тотемов
            let result = await buyTitansAndTotemSkils(shopId, titanIds, titanFragments, titanSkilsIds, titanSkilFragments);

            //Текущая миссия босс или нет
            let boss = false;

            //Атаковать / не атаковать босса
            if (missionId == firstMissionId + 7) {
                if (missionRaid == true && farmedChapters.includes(chapterId)) {
                    return;
                }
                //Произвести атаку босса, если его ни разу не убили
                boss = true;
            }

            //Получить атакующую команду
            let heroes = [];
            let titanSkil = [];
            let allHeroes = [];
            await getAttackingTeam(heroes, titanSkil, allHeroes);
            console.log('heroes ', JSON.stringify(heroes));
            let spiritSkills = new Array();
            if (titanSkil.length > 0) {
                for (let ts of titanSkil) {
                    if (elementalSkils.includes(ts)) {
                        spiritSkills.push(['elemental', ts]);
                    }
                    if (primalSkils.includes(ts)) {
                        spiritSkills.push(['primalSkils', ts]);
                    }
                }
            }
            let firstSpiritSkills = Object.fromEntries(spiritSkills);

            //Проходим миссию
            if (!boss) {
                setProgress(I18N('NT_MISSION_PROGRESS', {missionNumber: 1 + missionId - firstMissionId}), false);
            } else {
                setProgress(I18N('NT_MISSION_PROGRESS_BOSS'), false);
            }
            await new Promise((e) => setTimeout(e, 2000));
            let error = await attackTitanMission(missionId, chapterId, heroes, firstSpiritSkills, boss);
            if (error) {
                await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
                return;
            }

            //Результат атаки
            let invasionInfo = await Caller.send('invasion_getInfo');
            let missions = Object.values(invasionInfo.actions);
            for (let mission of missions) {
                if (mission.payload.wins == 0) {
                    missionId = mission.payload.id;
                    break;
                }
            }

            //Результат атаки босса
            if (boss) {
                if (invasionInfo.farmedChapters.includes(chapterId)) {
                    await popup.confirm(I18N('NT_BOSS_WAS_KILLED', { chapterNumber: romanNumerals[chapterNumber]}));
                    //Сбросить главу
                    await Caller.send('invasion_resetChapter')
                } else {
                    await popup.confirm(I18N('NT_BOSS_WAS_NOT_KILLED', { chapterNumber: romanNumerals[chapterNumber]}));
                }
                return;
            }
            lives = invasionInfo.lives;
            console.log('missionId ' + missionId);
            console.log('lives ' + lives);
        }
        if (lives == 0) {
            setProgress('', true);
            await popup.confirm(I18N('NHR_LIVES_ARE_OVER', { chapterNumber: romanNumerals[chapterNumber]}));
            return;
        }
    }
    async function collectTitansAndTotemFragments() {
        //Получить состояние на карте
        let invasionInfo = await Caller.send('invasion_getInfo');
        let invasionInfoId = invasionInfo.id;
        let farmedChapters = invasionInfo.farmedChapters;
        console.log('invasionInfoId ' + invasionInfoId);
        console.log('farmedChapters ', JSON.stringify(farmedChapters));

        //Получить id первой главый
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId);
        let chapterId = getChapterId(chapters, 'titan');
        console.log('chapterId ' + chapterId);

        let cycle = true;
        while (cycle) {
            //Титаны, что необходимо собрать
            let titanIdsToBuy = await getTitanIdsToBuy();

            //Навыки тотемов, что необходимо собрать
            let titanSkilsIds = await getTitanSkillIdsToBuy();

            if (titanIdsToBuy.length == 0 && titanSkilsIds.length == 0) {
                setProgress('', true);
                confShow(I18N('NT_TITANS_AND_TOTEM_SKILLS_COLLECTED'));
                cycle = false;
                return;
            }

            setProgress(
                I18N('NT_COLLECT_TITANS_PROGRESS', { counter: titanIdsToBuy.length }) +
                '<br>' +
                I18N('NT_COLLECT_TOTEM_SKILLS_PROGRESS', { counter: titanSkilsIds.length }),
                false
            );
            await new Promise((e) => setTimeout(e, 3000));

            //Активировать главу
            let chapterInfo = await Caller.send({ name: 'invasion_setActiveChapter', args: { chapterId: chapterId } });
            let haveTitanFragments = chapterInfo.invasion.fragments;

            //Получить id магазина
            let shopId = await getShopId(chapters, 'titan'); //1073; // Магазин титанов
            console.log('Id магазина титанов ' + shopId);

            //Id миссии
            let firstMissionId = chapterInfo.invasion.actions[0].payload.id;
            let missionId = firstMissionId;

            //Жизни
            let lives = chapterInfo.invasion.lives;
            console.log('firstMissionId ' + firstMissionId);
            console.log('missionId ' + missionId);
            console.log('lives ' + lives);

            //Id титанов, что необходимо собрать
            let titanIds = [0, 0];
            //Резервные титаны, для добавления в покупки: Солярис, Ияри
            let reserveTitans = [4043, 4042];

            if (titanIdsToBuy.length >= 2) {
                titanIds = [titanIdsToBuy[0], titanIdsToBuy[1]];
            }
            if (titanIdsToBuy.length == 1) {
                if (reserveTitans.includes(titanIdsToBuy[0])) {
                    titanIds = reserveTitans;
                } else {
                    titanIds[0] = titanIdsToBuy[0];
                    titanIds[1] = reserveTitans[0];
                }
            }

            if (titanIdsToBuy.length == 0) {
                titanIds = reserveTitans;
            }

            //Фрагменты титанов
            let titanFragments = [0, 0];
            for (let i = 0; i < titanFragments.length; i++){
                if (haveTitanFragments[titanIds[i]]) {
                    titanFragments[i] = haveTitanFragments[titanIds[i]];
                }
            }

            //Фрагменты навыков тотемов
            let titanSkilFragments = [0, 0];
            if (titanSkilsIds.length <= 1) {
                titanSkilFragments = [0];
            }

            console.log('shopId ' + shopId);
            console.log(titanIds);
            console.log(titanFragments);

            while (lives > 0 && missionId <= firstMissionId + 7) {
                setProgress(I18N('NHR_SHOPPING'), false);
                //Купить титанов и фрагменты тотемов
                let result = await buyTitansAndTotemSkils(shopId, titanIds, titanFragments, titanSkilsIds, titanSkilFragments);

                //Выйти, если босс побежден и полностью собрали титанов и тотемы.
                if (result && farmedChapters.includes(chapterId)) {
                    break;
                }
                //Текущая миссия босс или нет
                let boss = false;

                //Произвести атаку босса, если его ни разу не убили
                if (!farmedChapters.includes(chapterId)) {
                    if (missionId == firstMissionId + 7) {
                        boss = true;
                        console.log('%cАтакуем босса ', 'color: green; font-weight: bold;');
                    }
                } else {
                    //Не атаковать босса, если его уже убили
                    if (missionId == firstMissionId + 7) {
                        break;
                    }
                }
                //Получить атакующую команду
                let heroes = [];
                let titanSkil = [];
                let allHeroes = [];
                await getAttackingTeam(heroes, titanSkil, allHeroes);
                let firstSpiritSkills = {};

                //Проходим миссию
                if (!boss) {
                    setProgress(I18N('NT_MISSION_PROGRESS', {missionNumber: 1 + missionId - firstMissionId}), false);
                } else {
                    setProgress(I18N('NT_MISSION_PROGRESS_BOSS'), false);
                }
                await new Promise((e) => setTimeout(e, 2000));
                let error = await attackTitanMission(missionId, chapterId, heroes, firstSpiritSkills, boss);
                if (error) {
                    await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
                    return;
                }
                //Убили / не убили босса, вышли с "while"
                if (boss == true) {
                    break;
                }
                //Результат атаки
                let invasionInfo = await Caller.send('invasion_getInfo');
                farmedChapters = invasionInfo.farmedChapters;
                let missions = Object.values(invasionInfo.actions);
                for (let mission of missions) {
                    if (mission.payload.wins == 0) {
                        missionId = mission.payload.id;
                        break;
                    }
                }
                lives = invasionInfo.lives;
                console.log('missionId ' + missionId);
                console.log('lives ' + lives);
            }
        }
    }

    async function collectHeroes(spendCoins = false) {
        //Получить состояние на карте
        let invasionInfo = await Caller.send('invasion_getInfo');

        let invasionInfoId = invasionInfo.id;
        let farmedChapters = invasionInfo.farmedChapters;
        console.log('invasionInfoId ' + invasionInfoId);
        console.log('farmedChapters ', JSON.stringify(farmedChapters));

        //Получить id главы
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId);
        let chapterId = getChapterId(chapters, 'hero');
        console.log('chapterId ' + chapterId);

        //Питомцы, что необходимо купить
        let allPets = [6000, 6001, 6002, 6003, 6004, 6005, 6006, 6007, 6008, 6009];
        let pets = allPets;

        let titanIvent = false;
        for (let chapter of chapters) {
            if (chapter.settings?.unitType === 'titan') {
                titanIvent = true;
                break;
            }
        }

        let cycle = true;
        while (cycle) {
            //Получить героев, которых нужно собрать
            let heroIdsToBuy = await getHeroIdsToBuy();
            if (heroIdsToBuy.length == 0) {
                if (spendCoins == false) {
                    setProgress('', true);
                    confShow(I18N('NT_HEROES_COLLECTED'));
                }
                cycle = false;
                return;
            }
            console.log(heroIdsToBuy);
            setProgress(I18N('NT_COLLECT_HEROES_PROGRESS', { counter: heroIdsToBuy.length }), false);
            await new Promise((e) => setTimeout(e, 3000));

            //Питомцы, которых будем покупать:
            if (titanIvent == false){
                pets = [allPets[0], allPets[5], allPets[8]];
            }

            //Активировать главу
            let chapterInfo = await Caller.send({ name: 'invasion_setActiveChapter', args: { chapterId: chapterId } });
            let haveHeroFragments = chapterInfo.invasion.fragments;

            //Получить id магазина
            let shopId = await getShopId(chapters, 'hero'); //1078; // Магазин героев
            console.log('Id магазина героев ' + shopId);

            //Id миссии
            let firstMissionId = chapterInfo.invasion.actions[0].payload.id;
            let missionId = firstMissionId;

            //Жизни
            let lives = chapterInfo.invasion.lives;
            console.log('firstMissionId ' + firstMissionId);
            console.log('missionId ' + missionId);
            console.log('lives ' + lives);

            //Id героев, что будем покупить
            let heroIds = [0, 0, 0];
            //Резервные герои, для добавления в покупки: Галахад, Тристан, Лирия
            //let reserveHeroes = [2, 54, 67];

            //Резервные герои, для добавления в покупки: Электра, Каскад + Тея
            let reserveHeroes = [70, 69, 7];

            //Собирать по 3 нужных героя
            if (heroIdsToBuy.length >= 3) {
                heroIds = [heroIdsToBuy[0], heroIdsToBuy[1], heroIdsToBuy[2]];
            }
            if (heroIdsToBuy.length == 2) {
                heroIds[0] = heroIdsToBuy[0];
                heroIds[1] = heroIdsToBuy[1];
                for (let r of reserveHeroes) {
                    if (r != heroIds[0] && r != heroIds[1]) {
                        heroIds[2] = r;
                        break;
                    }
                }
            }

            if (heroIdsToBuy.length == 1) {
                if (reserveHeroes.includes(heroIdsToBuy[0])) {
                    heroIds = reserveHeroes;
                } else {
                    heroIds[0] = heroIdsToBuy[0];
                    heroIds[1] = reserveHeroes[0];
                    heroIds[2] = reserveHeroes[1];
                }
            }

            //Фрагменты героев
            let heroFragments = [0, 0, 0];
            for (let i = 0; i < heroFragments.length; i++){
                if (haveHeroFragments[heroIds[i]]) {
                    heroFragments[i] = haveHeroFragments[heroIds[i]];
                }
            }

            console.log(heroIds);
            console.log(heroFragments);

            while (lives > 0 && missionId <= firstMissionId + 7) {
                setProgress(I18N('NHR_SHOPPING'), false);
                //Купить героев
                let result = await buyHeroesAndPets(shopId, heroIds, heroFragments, pets, spendCoins);

                //Выйти, если босс побежден и полностью собрали три героя
                if (result && farmedChapters.includes(chapterId)) {
                    break;
                }

                //Текущая миссия босс или нет
                let boss = false;

                //Произвести атаку босса, если его ни разу не убили
                if (!farmedChapters.includes(chapterId)) {
                    if (missionId == firstMissionId + 7) {
                        boss = true;
                        console.log('%cАтакуем босса ', 'color: green; font-weight: bold;');
                    }
                } else {
                    //Не атаковать босса, если его уже убили
                    if (missionId == firstMissionId + 7) {
                        break;
                    }
                }
                //Получить атакующую команду
                let heroes = [];
                let havePets = [];
                let pet;
                let petsFavor = {};
                await getAttackingTeam(heroes, havePets);
                console.log('heroes ', JSON.stringify(heroes));
                if (havePets.length > 0) {
                    //Основной питомец 6005 - Альбрус
                    let mainPet = 6005;
                    if (havePets.includes(mainPet)) {
                        pet = mainPet;
                    } else {
                        pet = havePets[0];
                    }
                    //Покровительство
                    const petLib = lib.getData('pet');
                    for (let heroId of heroes) {
                        /** Поиск питомца для героя */
                        for (let petId of havePets) {
                            if (petLib[petId].favorHeroes.includes(heroId)) {
                                petsFavor[heroId] = petId;
                                havePets = havePets.filter((e) => e != petId);
                                break;
                            };
                        }
                    }
                }
                console.log('Атакующие герои ' + heroes);

                //Проходим миссию
                if (!boss) {
                    setProgress(I18N('NT_MISSION_PROGRESS', {missionNumber: 1 + missionId - firstMissionId}), false);
                } else {
                    setProgress(I18N('NT_MISSION_PROGRESS_BOSS'), false);
                }
                await new Promise((e) => setTimeout(e, 2000));

                let error = await attackHeroMission(missionId, chapterId, heroes, pet, boss, petsFavor);
                if (error) {
                    await popup.confirm(I18N('NEW_CHARACTER_SOMETHING_WENT_WRONG'));
                    return;
                }
                //Убили / не убили босса, вышли с "while"
                if (boss == true) {
                    break;
                }
                //Результат атаки
                let invasionInfo = await Caller.send('invasion_getInfo');
                farmedChapters = invasionInfo.farmedChapters;
                let missions = Object.values(invasionInfo.actions);
                for (let mission of missions) {
                    if (mission.payload.wins == 0) {
                        missionId = mission.payload.id;
                        break;
                    }
                }
                lives = invasionInfo.lives;
                console.log('missionId ' + missionId);
                console.log('lives ' + lives);
            }
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getHeroIdsToBuy() {
        const quest = await Caller.send('questGetAll');
        const heroIds = quest
            .filter((e) => e.state == 1 && lib.data.quest.special[e.id]?.translationMethod === 'invasionStallHeroFragments')
            .map((e) => lib.data.quest.special[e.id].farmCondition.eventFunc.args.fragmentId);
        return heroIds;
    }

    async function getTitanIdsToBuy() {
        const quest = await Caller.send('questGetAll');
        const titanIds = quest
            .filter((e) => e.state == 1 && lib.data.quest.special[e.id]?.translationMethod === 'invasionStallFragmentsTitans')
            .map((e) => lib.data.quest.special[e.id].farmCondition.eventFunc.args.fragmentId);
        return titanIds;
    }

    async function getTitanSkillIdsToBuy() {
        const quest = await Caller.send('questGetAll');
        const titanSkillIds = quest
            .filter((e) => e.state == 1 && lib.data.quest.special[e.id]?.translationMethod === 'invasionStallFragmentsTitanSkills')
            .map((e) => lib.data.quest.special[e.id].farmCondition.eventFunc.args.fragmentId);
        return titanSkillIds;
    }

    async function getShopId(chapters, titanOrHero) {
        if (chapters[0].settings?.stallShopId) {
            for (let chapter of chapters) {
                if (chapter.settings.unitType === titanOrHero) {
                    return chapter.settings.stallShopId;
                }
            }
        }
        const result = await Caller.send('shopGetAll');
        const shops = Object.values(result).filter(e => e.slots[1].cost?.coin);
        for (let shop of shops){
            if (shop.slots[1].cost.coin[1080]){
                return shop.id;
            }
        }
        return false;
    }

    function getChapterId(chapters, titanOrHero) {
        for (let chapter of chapters) {
            if (chapter.settings.unitType === titanOrHero) {
                return chapter.id;
            }
        }
        return false;
    }

    function compareVersions(version1, version2) {
        const v1 = version1.split('.').map(Number);
        const v2 = version2.split('.').map(Number);

        const maxLength = Math.max(v1.length, v2.length);

        for (let i = 0; i < maxLength; i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;

            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }

        return 0;
    }

    async function getAllHeroIDs() {
        let heroIds = Object.values(lib.data.hero).filter(e => e.type === 'hero' && !e.roleExtended.includes('boss'));
        heroIds = heroIds.filter((e) => e.id != 63 && e.id != 65);
        const heroIdsConsole = heroIds.map(e => `${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`)).join('\n');
        console.log(heroIdsConsole);
        await popup.customPopup(async (complete) => {
            popup.custom.insertAdjacentHTML(
                'beforeend',
                '<div class="PopUp_text" style="text-align: left;">' + heroIds.map((e) => `<div>${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('') + '</div>'
            );
            popup.setMsgText(I18N('NHR_GET_HERO_IDS_MESSAGE'));
            popup.addButton({ isClose: true }, () => {
                complete(false);
                popup.hide();
            });
            popup.show();
        });
        //Возврат в меню "Новый персонаж"
        returnToNewCharacterMenu();
    }

    async function getAllTitanIDs() {
        let waterTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id < 4010);;
        let fireTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id >= 4010 && e.id < 4020);
        let earthTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id >= 4020 && e.id < 4030);
        let darknessTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id >= 4030 && e.id < 4040);
        let lightTitans = Object.values(lib.data.hero).filter(e => e.type === 'titan' && e.id >= 4040 && e.id < 4050);
        let message = '';
        const heroIdsConsole = Object.values(lib.data.hero).filter(e => e.type === 'titan').map(e => `${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`)).join('\n');
        console.log(heroIdsConsole);

        message += `<br><div class="PopUp_text" style="color: DeepSkyBlue; text-align: center;">${I18N('NT_WATER_TITANS')}</div>` + waterTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('') + '<br>';
        message += `<div class="PopUp_text" style="color: red; text-align: center;">${I18N('NT_FIRE_TITANS')}</div>` + fireTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('') + '<br>';
        message += `<div class="PopUp_text" style="color: Lime; text-align: center;">${I18N('NT_EARTH_TITANS')}</div>` + earthTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('') + '<br>';
        message += `<div class="PopUp_text" style="color: SlateGray; text-align: center;">${I18N('NT_DARK_TITANS')}</div>` + darknessTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('') + '<br>';
        message += `<div class="PopUp_text" style="color: Yellow; text-align: center;">${I18N('NT_LIGHT_TITANS')}</div>` + lightTitans.map((e) => `<div class="PopUp_text" style="text-align: left;">${e.id} - ` + cheats.translate(`LIB_HERO_NAME_${e.id}`) + '</div>').join('');

        await popup.customPopup(async (complete) => {
            popup.custom.insertAdjacentHTML(
                'beforeend',
                message
            );
            popup.setMsgText(I18N('NHR_GET_HERO_IDS_MESSAGE'));
            popup.addButton({ isClose: true }, () => {
                complete(false);
                popup.hide();
            });
            popup.show();
        });
        //Возврат в меню "Новый титан"
        returnToNewTitanMenu();
    }

    async function getAttackingTeam (heroes, other = [], allHeroes = []) {
        let haveFragments = Object.entries(await Caller.send('invasion_getInfo').then((e) => e.fragments)).map(e => ({id:e[0],count:e[1]})).sort((a, b) => b.count - a.count);
        console.log(haveFragments);
        for (let m of haveFragments) {
            if(m.count == 0){
                continue;
            }
            //Отделяем питомцев и фрагменты тотемов
            if (Number(m.id) < 4400) {
                allHeroes.push(Number(m.id));
                if (heroes.length < 5) {
                    heroes.push(Number(m.id));
                }
            }
            if (Number(m.id) > 4400) {
                other.push(Number(m.id));
            }
        }
    }

    async function getTeamButton (titanAttackingTeams, chapterNumber, titanOrHero) {
        let message = '';
        if (titanOrHero === 'titan' ) {
            message = I18N('NT_ENTER_TITAN_IDS', { chapterNumber: romanNumerals[chapterNumber] });
        }
        if (titanOrHero === 'hero' ) {
            message = I18N('NT_ENTER_HERO_IDS', { chapterNumber: romanNumerals[chapterNumber] });
        }
        const answer = await popup.confirm(message, [
            {
                msg: I18N('NT_COMPLETE_CHAPTER_START'),
                placeholder: '1,2,3,4,5,6',
                isInput: true,
                default: titanAttackingTeams,
                color: 'green',
            },
            {
                msg: I18N('NT_COMPLETE_CHAPTER_CANCEL'),
                result: false,
                isCancel: true,
                color: 'red',
            },
        ]);
        if (!answer) {
            return false;
        }

        let team = answer.split(',');
        if (team.length != 5) {
            team = answer.split('-');
        }

        if (team.length != 5) {
            if (titanOrHero === 'hero' ) {
                confShow(I18N('NT_MUST_FIVE_HEROES'));
            }
            if (titanOrHero === 'titan' ) {
                confShow(I18N('NT_MUST_FIVE_TITANS'));
            }
            return false;
        }

        for (let p in team) {
            team[p] = +team[p].trim()
            if (Number.isNaN(team[p])) {
                confShow(I18N('NT_MUST_ONLY_NUMBERS'));
                return false;
            }
        }
        return team;
    }

    async function spendValorCoins() {
        let answer = await popup.confirm(
            I18N('NHR_SPEND_VALOR_COINS_MESSAGE'),
            [
                { msg: I18N('NHR_APPLY'), result: true, color: 'green' },
                { msg: I18N('NHR_NOT_APPLY'), result: false, isCancel: true, color: 'red' },
            ],
        );
        if (!answer) {
            //Возврат в меню "Новый персонаж"
            returnToNewCharacterMenu();
            return;
        }

        let [invasionInfo, inventoryGet, workshopBuffInfo] = await Caller.send(['invasion_getInfo', 'inventoryGet', 'workshopBuff_getInfo']);
        let invasionInfoId = invasionInfo.id;
        let chapters = Object.values(lib.data.invasion.chapter).filter((e) => e.invasionId === invasionInfoId);
        let coins = chapters[0].completeReward.coin;
        let valorCoinId = 0;
        let sapphireMedallionId = 0;
        for (let coin in coins) {
            if(coins[coin] > 10) {
                valorCoinId = coin;
            }
            if(coins[coin] < 10) {
                sapphireMedallionId = coin;
            }
        }
        console.log('valorCoinId ' + valorCoinId);

        let valorCoins = 0;
        if (inventoryGet.coin[valorCoinId]) {
            valorCoins = inventoryGet.coin[valorCoinId];
        }
        console.log('valorCoins ' + valorCoins);

        let grailId = Object.entries(lib.data.workshop.relic).find(([key, item]) => item.invasionId === invasionInfoId && item.effect?.type === "gachaReward_change")[0];
        let grailLvl = workshopBuffInfo.find(e => e.id == grailId ).level;
        console.log('grailId ' + grailId);
        console.log('grailLvl ' + grailLvl);

        if (valorCoins < (2800 - grailLvl * 100)) {
            await popup.confirm(I18N('NHR_NOT_ENOUGH_COINS'));
            //Возврат в меню "Новый персонаж"
            returnToNewCharacterMenu();
            return;
        }

        let amount = Math.floor(valorCoins/(2800 - grailLvl * 100));
        console.log('amount ' + amount);
        let offerId = lib.data.invasion.list[invasionInfoId].clientData.festival.lootBoxSpecialOfferId;
        let boxName = Object.keys((await Caller.send('specialOffer_getAll')).find(e => e.id == offerId).offerData.lootBoxes)[0];
        console.log('offerId ' + offerId);
        console.log('boxName ' + boxName);
        let result = await Caller.send({name:"lootBoxBuy",args:{box:boxName,offerId:offerId,price:"openCoin",amount:amount}})
        let sapphireMedallion = 0;
        let fragmentHero = 0;
        let fragmentTitan = 0;
        if (result) {
            for (let r of result) {
                if (r.coin?.[sapphireMedallionId]) {
                    sapphireMedallion += Number(r.coin[sapphireMedallionId]);
                }
                if (r.fragmentHero) {
                    fragmentHero += Number(Object.values(r.fragmentHero)[0]);
                }
                if (r.fragmentTitan) {
                    fragmentTitan += Number(Object.values(r.fragmentTitan)[0]);
                }
            }
        }
        await popup.confirm(I18N('NHR_SPEND_VALOR_COINS_RESULT', {sapphireMedallion:sapphireMedallion, fragmentHero: fragmentHero > fragmentTitan ? fragmentHero : fragmentTitan }));
        //Возврат в меню "Новый персонаж"
        returnToNewCharacterMenu();
    }

    async function buyTitansAndTotemSkils (shopId, titanIds, titanFragments, titanSkilsIds, titanSkilFragments) {
        console.log('Зашли в магазин');
        console.log('titanIds ', JSON.stringify(titanIds));
        console.log('titanFragments ', JSON.stringify(titanFragments));
        console.log('titanSkilsIds ', JSON.stringify(titanSkilsIds));
        console.log('titanSkilFragments ', JSON.stringify(titanSkilFragments));

        let coins = await Caller.send('inventoryGet').then((e) => e.coin[1080]);
        console.log('Монеты: ' + coins);

        let shopSlots = null;
        //Cобраны ли титаны и тотемы
        let titanF = false;
        let titanS = false;

        while (coins >= 9) {
            try {
                //Получить состояние магазина
                if (!shopSlots) {
                    shopSlots = await Caller.send([{ name: 'shopGet', args: { shopId: shopId } }]).then((e) => Object.values(e.slots));
                }
                for (let slot of shopSlots) {
                    //Пропустить скрытые лоты
                    if (slot.reward.invasionFragmentTitanRand || slot.reward.invasionFragmentSkillRand) {
                        continue;
                    }
                    let boughtTitan = false;
                    //Купить титанов
                    for (let t = 0; t < titanIds.length; t++) {
                        if (slot.reward.invasionFragmentTitan?.[titanIds[t]] && titanFragments[t] < 7) {
                            if (coins >= slot.cost.coin[1080]) {
                                let shopBuy = await Caller.send({ name: 'shopBuy', args: { cost: {}, reward: {}, shopId: shopId, slot: slot.id } });
                                console.log('%cКуплен титан ', 'color: green; font-weight: bold;');
                                coins -= slot.cost.coin[1080];
                                titanFragments[t] += slot.reward.invasionFragmentTitan?.[titanIds[t]];

                                //Если c первым титаном есть другой
                                for (let i = t+1; i < titanIds.length; i++) {
                                    if (slot.reward.invasionFragmentTitan?.[titanIds[i]]) {
                                        console.log('%cВторой титан в комплекте ', 'color: green; font-weight: bold;');
                                        titanFragments[i] += slot.reward.invasionFragmentTitan?.[titanIds[i]];
                                        break;
                                    }
                                }
                            } else {
                                await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                            }
                            boughtTitan = true;
                            break;
                        }
                    }

                    //Купить навыки тотема
                    if (!boughtTitan) {
                        for (let s = 0; s < titanSkilsIds.length; s++) {
                            if (slot.reward.invasionFragmentSkill?.[titanSkilsIds[s]] && titanSkilFragments[s] < 7) {
                                if (coins >= slot.cost.coin[1080]) {
                                    let shopBuy = await Caller.send({ name: 'shopBuy', args: { cost: {}, reward: {}, shopId: shopId, slot: slot.id } });
                                    console.log('%cКуплена часть навыка тотема ', 'color: green; font-weight: bold;');
                                    coins -= slot.cost.coin[1080];
                                    titanSkilFragments[s] += slot.reward.invasionFragmentSkill?.[titanSkilsIds[s]];
                                } else {
                                    await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                                }
                                break;
                            }
                        }
                    }

                    //Проверить, собраны ли титаны и тотемы
                    for (let tf of titanFragments) {
                        if (tf < 7) {
                            titanF = false;
                            break;
                        }
                        titanF = true;
                    }
                    if (titanSkilsIds.length > 0) {
                        for (let ts of titanSkilFragments) {
                            if (ts < 7) {
                                titanS = false;
                                break;
                            }
                            titanS = true;
                        }
                    } else {
                        titanS = true;
                    }
                    //Выйти, если титаны и тотемы собраны
                    if ( titanF && titanS) {
                        return true;
                    }
                }
            } catch (e) {
                console.log('%cПроизошла ошибка', 'color: red; font-weight: bold;');
                coins = await Caller.send('inventoryGet').then((e) => e.coin[1080]);
            }
            //Обновить магазин
            if (coins >= 12) {
                try {
                    shopSlots = await Caller.send([{ name: 'shopRefresh', args: { shopId: shopId } }]).then((e) => Object.values(e.slots));
                    coins -= 3;
                    console.log('Обновили магазин. Осталось монет: ' + coins);
                } catch (e) {
                    shopSlots = await Caller.send([{ name: 'shopRefresh', args: { shopId: shopId } }]).then((e) => Object.values(e.slots));
                    coins = await Caller.send('inventoryGet').then((e) => e.coin[1080]);
                }
            } else {
                break;
            }
        }
        return false;
    }

    async function buyHeroesAndPets (shopId, heroIds, heroFragments, pets, spendCoins = false) {
        console.log('Зашли в магазин');
        console.log('heroIds ', JSON.stringify(heroIds));
        console.log('heroFragments ', JSON.stringify(heroFragments));
        console.log('pets ', JSON.stringify(pets));


        let coins = await Caller.send('inventoryGet').then((e) => e.coin[1080]);
        console.log('Монеты: ' + coins);

        let shopSlots = null;
        let boughtAllHeroes = false;

        while (coins >= 12) {
            try {
                //Получить состояние магазина
                if (!shopSlots) {
                    shopSlots = await Caller.send([{ name: 'shopGet', args: { shopId: shopId } }]).then((e) => Object.values(e.slots));
                }
                //Если куплены все герои, питомци, и нет задания на трату монет, выйти и заменить героев для покупки
                if (boughtAllHeroes && pets.length == 0 && !spendCoins ) {
                    return true;
                }

                //Если куплены все герои, питомци, и есть задание на трату монет
                if (boughtAllHeroes && pets.length == 0 && spendCoins ) {
                    console.log('%cТратим монеты ', 'color: red; font-weight: bold;');
                    for (let slot of shopSlots) {
                        if (coins >= slot.cost.coin[1080]) {
                            await Caller.send({ name: 'shopBuy', args: { cost: {}, reward: {}, shopId: shopId, slot: slot.id } });
                            coins -= slot.cost.coin[1080];
                        }
                    }
                }
                //Купить героев
                if (!boughtAllHeroes) {
                    for (let slot of shopSlots) {
                        //Пропустить скрытые лоты и питомцев
                        if (slot.reward.invasionFragmentHeroRand || slot.reward.invasionFragmentPet) {
                            continue;
                        }
                        //Покупки героев, когда собираем героев
                        if (heroIds.length <= 3) {
                            for (let t = 0; t < heroIds.length; t++) {
                                if (slot.reward.invasionFragmentHero?.[heroIds[t]] && heroFragments[t] < 7) {
                                    if (coins >= slot.cost.coin[1080]) {
                                        let shopBuy = await Caller.send({ name: 'shopBuy', args: { cost: {}, reward: {}, shopId: shopId, slot: slot.id } });
                                        console.log('%cКуплен герой ', 'color: green; font-weight: bold;');
                                        coins -= slot.cost.coin[1080];
                                        heroFragments[t] += slot.reward.invasionFragmentHero?.[heroIds[t]];

                                        //Если c первым героем есть другой
                                        for (let i = t+1; i < heroIds.length; i++) {
                                            if (slot.reward.invasionFragmentHero?.[heroIds[i]]) {
                                                console.log('%cВторой герой в комплекте ', 'color: green; font-weight: bold;');
                                                heroFragments[i] += slot.reward.invasionFragmentHero?.[heroIds[i]];
                                                break;
                                            }
                                        }
                                    } else {
                                        await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                                    }
                                    break;
                                }
                            }
                        }

                        //Покупки героев, когда проходим миссии
                        if (heroIds.length > 3) {
                            //Если 2 героя в одном слоте
                            if (Object.values(slot.reward.invasionFragmentHero).length >= 2) {
                                for (let t = 0; t < heroIds.length; t++) {
                                    let boughtSlot = false;
                                    if (slot.reward.invasionFragmentHero?.[heroIds[t]] && heroFragments[t] < 7) {
                                        //Если c первым героем есть другой
                                        for (let i = t+1; i < heroIds.length; i++) {
                                            if (slot.reward.invasionFragmentHero?.[heroIds[i]]) {
                                                if (coins >= slot.cost.coin[1080]) {
                                                    console.log('%cДва героя по цене троих! Выгодно. Покупаем. ', 'color: green; font-weight: bold;');
                                                    let shopBuy = await Caller.send({ name: 'shopBuy', args: { cost: {}, reward: {}, shopId: shopId, slot: slot.id } });
                                                    heroFragments[t] += slot.reward.invasionFragmentHero?.[heroIds[t]];
                                                    heroFragments[i] += slot.reward.invasionFragmentHero?.[heroIds[i]];
                                                    coins -= slot.cost.coin[1080];
                                                } else {
                                                    await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                                                }
                                                boughtSlot = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (boughtSlot) {
                                        break;
                                    }
                                }
                            }
                            //Если 1 герой в слоте
                            if (Object.values(slot.reward.invasionFragmentHero).length == 1) {
                                for (let t = 0; t < heroIds.length; t++) {
                                    if (slot.reward.invasionFragmentHero?.[heroIds[t]] && heroFragments[t] < 7) {
                                        if (coins >= slot.cost.coin[1080]) {
                                            let shopBuy = await Caller.send({ name: 'shopBuy', args: { cost: {}, reward: {}, shopId: shopId, slot: slot.id } });
                                            console.log('%cКуплен герой ', 'color: green; font-weight: bold;');
                                            coins -= slot.cost.coin[1080];
                                            heroFragments[t] += slot.reward.invasionFragmentHero?.[heroIds[t]];
                                        } else {
                                            await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    //Куплены все герои или нет
                    for (let fragments of heroFragments) {
                        if (fragments < 7) {
                            boughtAllHeroes = false;
                            break;
                        }
                        boughtAllHeroes = true;
                    }
                }

                //Купить питомцев
                if (pets.length > 0) {
                    for (let slot of shopSlots) {
                        //Пропустить скрытые лоты и героев
                        if (slot.reward.invasionFragmentHeroRand || slot.reward.invasionFragmentHero) {
                            continue;
                        }
                        for (let s = 0; s < pets.length; s++) {
                            if (slot.reward.invasionFragmentPet?.[pets[s]] ) {
                                if (coins >= slot.cost.coin[1080]) {
                                    let shopBuy = await Caller.send({ name: 'shopBuy', args: { cost: {}, reward: {}, shopId: shopId, slot: slot.id } });
                                    console.log('%cКуплен питомец ', 'color: green; font-weight: bold;');
                                    coins -= slot.cost.coin[1080];
                                    pets.splice(pets.indexOf(pets[s]), 1)
                                } else {
                                    await Caller.send({ name: 'shop_pinSlot', args: { shopId: shopId, slotId: slot.id } });
                                }
                                break;
                            }
                        }
                        if (pets.length == 0) {
                            break;
                        }
                    }
                }
            } catch (e) {
                console.log('%cПроизошла ошибка', 'color: red; font-weight: bold;');
                coins = await Caller.send('inventoryGet').then((e) => e.coin[1080]);
            }

            //Обновить магазин
            if (coins >= 15) {
                try {
                    shopSlots = await Caller.send([{ name: 'shopRefresh', args: { shopId: shopId } }]).then((e) => Object.values(e.slots));
                    coins -= 3;
                    console.log('Обновили магазин. Осталось монет: ' + coins);
                } catch (e) {
                    shopSlots = await Caller.send([{ name: 'shopRefresh', args: { shopId: shopId } }]).then((e) => Object.values(e.slots));
                    coins = await Caller.send('inventoryGet').then((e) => e.coin[1080]);
                }
            } else {
                break;
            }
        }
        return false;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function attackTitanMission(missionId, chapterId, heroes, firstSpiritSkills, boss = false) {
        try {
            if (boss == true) {
                console.log('%cАтакуем босса ', 'color: green; font-weight: bold;');
            }
            const startBattle = await Caller.send({
                name: 'invasion_bossStart',
                args: {
                    id: missionId,
                    chapterId: chapterId,
                    heroes: heroes,
                    //firstSpiritElement: "earth",
                    firstSpiritSkills: firstSpiritSkills,
                    favor: {},
                },
            });
            const calcBattle = await Calc(startBattle);

            if (!calcBattle.result.win) {
                const cloneBattle = structuredClone(startBattle);
                const bFix = new WinFixBattle(cloneBattle);
                let result = await bFix.start(cloneBattle.endTime, Infinity);
                if (result.result?.win) {
                    calcBattle.result = result.result;
                    calcBattle.progress = result.progress;
                    calcBattle.battleTimer = result.battleTimer;
                }
            }

            if (!calcBattle.result.win && boss == true) {
                //Босса не убили
                console.log('%cБосса не убили ', 'color: red; font-weight: bold;');
                return;
            }
            if (boss == true) {
                let timer = calcBattle.battleTimer;
                console.log('%cУбили босса', 'color: green; font-weight: bold;');
                let message = I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_1');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_2');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_3');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_4');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_5');
                await countdownTimer(timer, message);
            }

            const endBattle = await Caller.send({
                name: 'invasion_bossEnd',
                args: {
                    id: missionId,
                    result: calcBattle.result,
                    progress: calcBattle.progress,
                },
            });
            return false;
        } catch (e) {
            return true;
        }
    }

    async function attackHeroMission(missionId, chapterId, heroes, pet, boss = false, petsFavor) {
        try {
            if (boss == true) {
                console.log('%cАтакуем босса ', 'color: green; font-weight: bold;');
            }
            const startBattle = await Caller.send({
                name: 'invasion_bossStart',
                args: {
                    id: missionId,
                    chapterId: chapterId,
                    heroes: heroes,
                    pet: pet,
                    favor: petsFavor,
                },
            });
            const calcBattle = await Calc(startBattle);

            if (!calcBattle.result.win) {
                const cloneBattle = structuredClone(startBattle);
                const bFix = new WinFixBattle(cloneBattle);
                let result = await bFix.start(cloneBattle.endTime, Infinity);
                if (result.result?.win) {
                    calcBattle.result = result.result;
                    calcBattle.progress = result.progress;
                    calcBattle.battleTimer = result.battleTimer;
                }
            }

            if (!calcBattle.result.win && boss == true) {
                //Босса не убили
                console.log('%cБосса не убили ', 'color: red; font-weight: bold;');
                return;
            }
            if (boss == true) {
                let timer = calcBattle.battleTimer;
                console.log('%cУбили босса', 'color: green; font-weight: bold;');
                let message = I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_1');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_2');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_3');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_4');
                setProgress(message, false);
                await new Promise((e) => setTimeout(e, 1000));
                message += I18N('NT_BOSS_WAS_KILLED_SET_PROGRESS_5');
                await countdownTimer(timer, message);
            }

            await Caller.send({
                name: 'invasion_bossEnd',
                args: {
                    id: missionId,
                    result: calcBattle.result,
                    progress: calcBattle.progress,
                },
            });
            return false;
        } catch (e) {
            return true;
        }
    }
})();
