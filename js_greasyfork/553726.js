// ==UserScript==
// @name         Pokelegenda Bot
// @namespace    http://tampermonkey.net/
// @version      1.0.0o
// @description  Бот для игры Покелегенда
// @author       Nayr1s
// @match        https://pokelegenda.ru/game
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553726/Pokelegenda%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/553726/Pokelegenda%20Bot.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  let autoBattle = false;

  //        Основной цикл
  let inGameLoop = false;
  async function GameLoop() {
    if (inGameLoop) return;
    inGameLoop = true;
    try {
      console.log(autoBattle);
    } finally {
      inGameLoop = false;
    }

    setTimeout(GameLoop, 100);
  }

  /** ============================================================
   *  1. ИНИЦИАЛИЗАЦИЯ ОБЪЕКТОВ
   *  ============================================================
   *  Здесь создаются два объекта, с которыми будет работать пользователь:
   *    - Bot  → отвечает за автоматические действия
   *    - Data → предоставляет информацию об игре
   *
   *  Оба объекта прикрепляются к `window`, чтобы ими можно было
   *  управлять из консоли браузера:
   *      > Data.getRegion()
   *      > Bot.getPathToLocation("Покецентр")
   */
  //        Инициализация
  async function initialize() {
    const BotInstance = new PokelegendaBot();
    const Data = new GameData();
    const userSettingsInstance = new UserSettings();
    await userSettingsInstance.load();

    window.Bot = BotInstance;
    window.Data = Data;
    window.Settings = userSettingsInstance;
    BotInterface.init();

    const menuAutoBattle = BotInterface.createCategory("Автобой", "󰞇");
    menuAutoBattle.addToggle(
      "Автобой",
      "Включён/Отключён",
      autoBattle,
      (value) => {
        value ? (autoBattle = true) : (autoBattle = false);
      }
    );
    menuAutoBattle.addButton("ФЫВ", "", () => {}, "Текст", "#606090");
    menuAutoBattle.addInput(
      "Запрещённые Атаки",
      "через запятую (например: psybeam, cut, confuse)",
      (Settings.get("blockedMoves") ?? []).join(", "),
      (value) => {
        const moves = value
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s !== "");
        Settings.set("blockedMoves", moves);
        // Возвращаем отформатированное значение для обновления в интерфейсе
        return moves.join(", ");
      }
    );
    const menuAutoBattleContainer = menuAutoBattle.addContainer(
      "Лечение",
      "Автолечение/Хп ниже %"
    );
    menuAutoBattleContainer.addToggle(
      "Автохил",
      "Включён/Отключён",
      Settings.get("autoHeal"),
      (value) => {
        value
          ? Settings.set("autoHeal", true)
          : Settings.set("autoHeal", false);
      }
    );
    menuAutoBattleContainer.addSlider(
      "ХП",
      "Лечение при хп ниже %",
      0,
      100,
      5,
      Settings.get("autoHealHP"),
      (val) => {
        Settings.set("autoHealHP", val);
      }
    );
    menuAutoBattleContainer;
    const menuWait = BotInterface.createCategory("Задержки", "󱑎");
    menuWait.addInput(
      "Тут можно что-то вводить",
      "Наверное",
      Settings.get("popa"),
      (val) => {
        Settings.set("popa", val);
      }
    );
    const menuSettings = BotInterface.createCategory("Настройки", "");
    const menuSettingsContainer = menuSettings.addContainer(
      "Контейнер",
      "Тут шото расписал типа, понял ?"
    );
    menuSettingsContainer.addButton("Ещё кнопка", "Ага", () => {});
    menuSettingsContainer.addInput(
      "Поле для ввода",
      "Самое настоящее",
      () => {}
    );
    menuSettingsContainer.addSlider(
      "Тут подпись",
      "Описание",
      1,
      100,
      1,
      50,
      () => {}
    );
    menuSettingsContainer.addToggle(
      "Переключалка",
      "Неожидал ?",
      true,
      () => {}
    );
    menuSettingsContainer.addSelect(
      "Выпадающая менюшка",
      "С описанием",
      [
        { value: "first", label: "Первый" },
        { value: "two", label: "Второй" },
        { value: "three", label: "Третий" },
        { value: "four", label: "Четвертый" },
      ],
      "first",
      () => {}
    );
    BotInterface.renderActiveCategory();
  }

  /** ------------------------------------------------------------
   *  Класс PokelegendaBot
   *  ------------------------------------------------------------
   *  Здесь описывается поведение бота — пока он умеет одно:
   *  находить кратчайший путь между локациями.
   *  В будущем можно добавить: автоходьбу, автосражения, фарм.
   */
  //        Класс Бота
  class PokelegendaBot {
    /** Ищет путь до нужной локации по сохранённой карте */
    async getPathToLocation(location) {
      return await findLocationPath(location);
    }

    /** Ищет путь до нужного NPC по сохранённой карте */
    async getPathToNpc(npcName) {
      return await findLocationPath(npcName);
    }
  }

  /** ------------------------------------------------------------
   *  Класс GameData
   *  ------------------------------------------------------------
   *  Этот класс даёт доступ к данным игры через глобальный объект `Games`.
   *  С его помощью можно узнать:
   *    - в каком регионе сейчас игрок,
   *    - идёт ли бой,
   *    - кто сейчас сражается (игрок и враг),
   *    - какие у них типы и приёмы.
   */
  //        Класс Даты
  class GameData {
    getRegion() {
      return Games.user.data.region;
    }
    isInBattle() {
      return !!document.querySelector(
        '.battle-content:not(:has([data-type="exit"]))'
      );
    }

    getCurrentLocation() {
      return document.querySelector(".__location_name_txt").textContent;
    }

    /** --------------------------------------------------------
     *  Подраздел: работа с боем
     *  -------------------------------------------------------- */
    battle = {
      /** Получает состояние покемона игрока */
      getUserState: () => {
        const active = Games.battleRoom?.battle?.mySide.active[0];
        const dex = Games._dex;
        const userTypes =
          dex.Pokedex[active?.speciesForme?.toLowerCase()]?.types;

        return {
          getMenu: () =>
            this.isInBattle() ? Games.battleRoom?.targetMenu : undefined,
          getHp: () => active?.hp,
          getMaxHp: () => active?.maxhp,
          getTypes: () => userTypes,

          /** Возвращает список доступных приёмов с их характеристиками */
          getMoves: () => {
            const moves =
              Games.battleRoom?.choices?.request?.active?.[0]?.moves;
            if (!moves) return [];

            const moveDex = dex.Moves;
            const enemyTypes = this.battle.getEnemyState().getTypes();

            return moves.map((move) => {
              const data = moveDex[move.id];
              const effectiveness = this.getTypeEffectiveness(
                data.type,
                enemyTypes
              );
              const hasStab = userTypes.includes(data.type) ? 1.5 : 1; // бонус за совпадение типа
              const acc =
                typeof data.accuracy === "number" ? data.accuracy / 100 : 1;

              return {
                name: move.id,
                pp: move.pp,
                maxpp: move.maxpp,
                accuracy: data.accuracy,
                basepower: data.basePower ?? 0,
                category: data.category,
                target: data.target,
                type: data.type,
                multiplier: effectiveness,
                /** "impact" — условная сила приёма с учётом точности и бонусов */
                impact: (data.basePower || 0) * acc * effectiveness * hasStab,
              };
            });
          },
        };
      },

      /** Получает информацию о противнике */
      getEnemyState: () => {
        const active = Games.battleRoom?.battle?.farSide?.active[0];
        const dex = Games._dex;
        return {
          getName: () => Games.battleRoom?.battle?.farSide?.name?.toLowerCase(),
          getHp: () => active?.hp,
          getMaxHp: () => active?.maxhp,
          getPokemon: () => active?.name?.toLowerCase(),
          isShiny: () => active?.shiny,
          getRarity: () => active?.rarity,
          getLevel: () => active?.level,
          getTypes: () =>
            dex.Pokedex[active?.speciesForme?.toLowerCase()]?.types,
        };
      },
    };

    /** --------------------------------------------------------
     *  Рассчитывает эффективность типа атаки по типу цели
     *  -------------------------------------------------------- */
    getTypeEffectiveness(attackType, targetTypes) {
      if (!attackType) return 1;
      if (!Array.isArray(targetTypes)) targetTypes = [targetTypes];
      const type = attackType.toLowerCase();
      const table = this.TYPE_EFFECTIVENESS[type];
      if (!table) return 1;
      return targetTypes.reduce(
        (mult, t) => mult * (table[t?.toLowerCase()] ?? 1),
        1
      );
    }

    /** Таблица эффективности типов */
    TYPE_EFFECTIVENESS = {
      normal: { rock: 0.5, steel: 0.5, ghost: 0 },
      fighting: {
        normal: 2,
        ice: 2,
        rock: 2,
        dark: 2,
        steel: 2,
        flying: 0.5,
        poison: 0.5,
        psychic: 0.5,
        bug: 0.5,
        fairy: 0.5,
        ghost: 0,
      },
      flying: {
        grass: 2,
        fighting: 2,
        bug: 2,
        rock: 0.5,
        steel: 0.5,
        electric: 0.5,
      },
      poison: {
        grass: 2,
        fairy: 2,
        poison: 0.5,
        ground: 0.5,
        rock: 0.5,
        ghost: 0.5,
        steel: 0,
      },
      ground: {
        fire: 2,
        electric: 2,
        poison: 2,
        rock: 2,
        steel: 2,
        grass: 0.5,
        bug: 0.5,
        flying: 0,
      },
      rock: {
        fire: 2,
        ice: 2,
        flying: 2,
        bug: 2,
        fighting: 0.5,
        ground: 0.5,
        steel: 0.5,
      },
      bug: {
        grass: 2,
        psychic: 2,
        dark: 2,
        fire: 0.5,
        fighting: 0.5,
        poison: 0.5,
        flying: 0.5,
        ghost: 0.5,
        steel: 0.5,
      },
      ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
      steel: {
        ice: 2,
        rock: 2,
        fairy: 2,
        fire: 0.5,
        water: 0.5,
        electric: 0.5,
        steel: 0.5,
      },
      fire: {
        grass: 2,
        ice: 2,
        bug: 2,
        steel: 2,
        fire: 0.5,
        water: 0.5,
        rock: 0.5,
        dragon: 0.5,
      },
      water: {
        fire: 2,
        ground: 2,
        rock: 2,
        water: 0.5,
        grass: 0.5,
        dragon: 0.5,
      },
      grass: {
        water: 2,
        ground: 2,
        rock: 2,
        fire: 0.5,
        grass: 0.5,
        poison: 0.5,
        flying: 0.5,
        bug: 0.5,
        dragon: 0.5,
      },
      electric: {
        water: 2,
        flying: 2,
        electric: 0.5,
        grass: 0.5,
        dragon: 0.5,
        ground: 0,
      },
      psychic: {
        fighting: 2,
        poison: 2,
        psychic: 0.5,
        steel: 0.5,
        dark: 0,
      },
      ice: {
        grass: 2,
        ground: 2,
        flying: 2,
        dragon: 2,
        fire: 0.5,
        water: 0.5,
        ice: 0.5,
        steel: 0.5,
      },
      dragon: { dragon: 2, steel: 0.5, fairy: 0 },
      dark: {
        psychic: 2,
        ghost: 2,
        fighting: 0.5,
        dark: 0.5,
        fairy: 0.5,
      },
      fairy: {
        fighting: 2,
        dragon: 2,
        dark: 2,
        fire: 0.5,
        poison: 0.5,
        steel: 0.5,
      },
    };
  }

  /** ============================================================
   *  УТИЛИТЫ (вспомогательные функции)
   *  ============================================================
   */

  /** Асинхронная обёртка над ldb.get для удобства с await */
  //        Утилиты
  async function ldbGet(key) {
    return new Promise((resolve) => {
      ldb.get(key, resolve);
    });
  }

  /** ------------------------------------------------------------
   *  Поиск кратчайшего пути между локациями
   *  ------------------------------------------------------------
   *  Алгоритм — простой обход в ширину (BFS).
   *  Ищет минимальное количество переходов от текущей точки до цели.
   */
  async function findLocationPath(target = "Покецентр") {
    const regionData = await ldbGet(`MapRegion${Data.getRegion()}`);
    const result = findShortestRoute(
      regionData,
      Data.getCurrentLocation(),
      target
    );
    return result;

    function findShortestRoute(graph, start, goal) {
      if (start === goal) return { selectors: [], locations: [] };

      // Проверяем, является ли начальная точка целевой
      const startData = graph[start];
      if (startData) {
        // Проверяем, есть ли цель среди moves или npc в начальной точке
        if (
          (startData.moves && startData.moves[goal]) ||
          (startData.npc && startData.npc[goal])
        ) {
          const selector =
            (startData.moves && startData.moves[goal]) ||
            (startData.npc && startData.npc[goal]);
          return {
            selectors: [selector],
            locations: [goal],
          };
        }
      }

      const queue = [[start, [], []]];
      const visited = new Set([start]);

      while (queue.length) {
        const [current, selectors, names] = queue.shift();
        const currentData = graph[current] || {};

        // Объединяем moves и npc в текущей локации для поиска
        const allTransitions = {
          ...currentData.moves,
          ...currentData.npc,
        };

        for (const [next, selector] of Object.entries(allTransitions)) {
          if (next === goal) {
            return {
              selectors: [...selectors, selector],
              locations: [...names, next],
            };
          }
          if (!visited.has(next)) {
            visited.add(next);
            queue.push([next, [...selectors, selector], [...names, next]]);
          }
        }
      }
      return null; // путь не найден
    }
  }

  /** ============================================================
   *  ОБСЕРВЕРЫ (наблюдатели за изменениями страницы)
   *  ============================================================
   *  Когда игрок перемещается по карте, в DOM меняется текст
   *  элемента с классом "__location_name_txt".
   *
   *  Мы следим за этими изменениями и автоматически
   *  обновляем карту региона в базе.
   */
  //        Обсерверы
  const locationElement = document.querySelector(".__location_name_txt");
  if (locationElement) {
    new MutationObserver(updateLocationMap).observe(locationElement, {
      childList: true,
    });
  }

  /** Обновляет карту региона при смене локации */
  function updateLocationMap() {
    const ignored = ["Покецентр", "Покемаркет"];
    const current = document.querySelector(".__location_name_txt")?.textContent;
    if (ignored.includes(current)) return;

    const locationData = {
      moves: {},
      npc: {},
    };

    // собираем все возможные направления движения
    const moveLinks = document.querySelectorAll(".move .target");
    moveLinks.forEach((el) => {
      const target = el.textContent.trim();
      const moveClass = [...el.classList].find((cls) =>
        cls.startsWith("__l_move_")
      );
      if (moveClass) {
        locationData.moves[target] = "." + moveClass;
      }
    });

    // собираем NPC
    const npcElements = document.querySelectorAll(".target.__npc");
    npcElements.forEach((el) => {
      const npcName = el.textContent.trim();
      const npcIdClass = [...el.classList].find((cls) =>
        cls.startsWith("__npc_id_")
      );
      if (npcIdClass) {
        locationData.npc[npcName] = "." + npcIdClass;
      }
    });

    const regionKey = `MapRegion${Games.user.data.region}`;
    ldb.get(regionKey, (map) => {
      map ||= {};
      map[current] = locationData;
      ldb.set(regionKey, map, () => {});
    });
  }

  /** ============================================================
   *  КЛАСС НАСТРОЕК ПОЛЬЗОВАТЕЛЯ (UserSettings)
   *  ============================================================
   *  Хранит настройки бота и обеспечивает их сохранение между сессиями через ldb.
   *
   *  Основной объект: `current`
   *    - Содержит все текущие настройки после загрузки.
   *    - Обёрнут в Proxy для автоматической реакции на изменения вложенных объектов.
   *
   *  Использование:
   *  1. `await UserSettings.load()`
   *       - Загружает настройки из ldb.
   *       - Если сохранённых настроек нет — используется объект `defaults`.
   *       - Результат сохраняется в `current`.
   *
   *  2. `UserSettings.get('ключ_настройки')`
   *       - Возвращает текущее значение из `current`.
   *       - Если ключ отсутствует — возвращает `undefined`.
   *
   *  3. `await UserSettings.set('ключ', значение)`
   *       - Обновляет значение в `current`.
   *       - Сразу сохраняет все настройки в ldb для будущих сессий.
   *
   *  4. `await UserSettings.reset()`
   *       - Сбрасывает все настройки к дефолтным значениям (`defaults`).
   *       - Сохраняет результат в ldb.
   *
   *  Пример:
   *    const settings = new UserSettings();
   *    await settings.load();
   *    console.log(settings.get("enableLogging"));
   *    await settings.set("enableLogging", false);
   *    await settings.reset();
   */
  //        Класс Настроек
  class UserSettings {
    ldbKey = "UserSettings"; // ключ в ldb
    defaults = {
      autoUseItems: false,
      useAllowedMovesOnly: false,
      minMoveEffectiveness: 1.0,
      actionDelay: 1000,
      autoPathfinding: true,
      hotkeys: {
        toggleBot: "F1",
        toggleLogging: "F2",
        saveCurrentLocation: "F3",
      },
      elementKeyBindings: {}, // Store key bindings for interface elements
    };
    current = {};

    constructor() {}

    /** Создаёт реактивный Proxy для автосохранения */
    _makeReactive(obj) {
      const self = this;
      return new Proxy(obj, {
        set(target, key, value) {
          target[key] = value;
          self._saveToLdb();
          return true;
        },
        get(target, key) {
          const value = target[key];
          if (value && typeof value === "object" && !Array.isArray(value)) {
            return self._makeReactive(value);
          }
          return value;
        },
      });
    }

    /** Асинхронная загрузка настроек из ldb */
    async load() {
      try {
        const saved = await ldbGet(this.ldbKey);
        this.current = this._makeReactive({
          ...this.defaults,
          ...saved,
        });

        return this.current;
      } catch (err) {
        console.error("Ошибка загрузки настроек из ldb:", err);
        this.current = this._makeReactive({ ...this.defaults });
        return this.current;
      }
    }

    /** Сохранение текущих настроек в ldb */
    async _saveToLdb() {
      try {
        const rawSettings = this._getRawObject(this.current);
        await new Promise((resolve) =>
          ldb.set(this.ldbKey, rawSettings, resolve)
        );
      } catch (err) {
        console.error("Ошибка сохранения настроек в ldb:", err);
      }
    }

    /** Преобразует Proxy в обычный объект для сохранения */
    _getRawObject(obj) {
      if (!obj || typeof obj !== "object") return obj;
      if (Array.isArray(obj))
        return obj.map((item) => this._getRawObject(item));
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, this._getRawObject(v)])
      );
    }

    /** Получение настройки по ключу */
    get(key) {
      return this.current[key];
    }

    /** Установка настройки и мгновенное сохранение */
    async set(key, value) {
      this.current[key] = value;
      await this._saveToLdb();
    }

    /** Сброс всех настроек к дефолтным значениям */
    async reset() {
      this.current = this._makeReactive({ ...this.defaults });
      await this._saveToLdb();
    }
  }

  /** ============================================================
   *  2. ЛЁГКАЯ БАЗА ДАННЫХ (ldb)
   *  ============================================================
   *  Это мини-обёртка над IndexedDB — встроенным хранилищем браузера.
   *  Она позволяет сохранять и читать данные (например, карту локаций),
   *  не беспокоясь о промисах и транзакциях.
   *
   *  Хранилище называется "ldb" и создаёт один объект store с ключом "k".
   *  Методы:
   *      ldb.get(key, callback)        → получить данные
   *      ldb.set(key, value, callback) → записать данные
   *      ldb.delete(key, callback)     → удалить запись
   *      ldb.list(callback)            → список всех ключей
   *      ldb.clear(callback)           → очистить хранилище
   *
   *  Здесь код минифицирован (в одну строку), но он полностью рабочий.
   */
  // prettier-ignore
  !function(){var s,c,e="undefined"!=typeof window?window:{},t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB;"undefined"==typeof window||t?((t=t.open("ldb",1)).onsuccess=function(e){s=this.result},t.onerror=function(e){console.error("indexedDB request error"),console.log(e)},t={get:(c={ready:!(t.onupgradeneeded=function(e){s=null,e.target.result.createObjectStore("s",{keyPath:"k"}).transaction.oncomplete=function(e){s=e.target.db}}),get:function(e,t){s?s.transaction("s").objectStore("s").get(e).onsuccess=function(e){e=e.target.result&&e.target.result.v||null;t(e)}:setTimeout(function(){c.get(e,t)},50)},set:function(t,n,o){if(s){let e=s.transaction("s","readwrite");e.oncomplete=function(e){"Function"==={}.toString.call(o).slice(8,-1)&&o()},e.objectStore("s").put({k:t,v:n}),e.commit()}else setTimeout(function(){c.set(t,n,o)},50)},delete:function(e,t){s?s.transaction("s","readwrite").objectStore("s").delete(e).onsuccess=function(e){t&&t()}:setTimeout(function(){c.delete(e,t)},50)},list:function(t){s?s.transaction("s").objectStore("s").getAllKeys().onsuccess=function(e){e=e.target.result||null;t(e)}:setTimeout(function(){c.list(t)},50)},getAll:function(t){s?s.transaction("s").objectStore("s").getAll().onsuccess=function(e){e=e.target.result||null;t(e)}:setTimeout(function(){c.getAll(t)},50)},clear:function(t){s?s.transaction("s","readwrite").objectStore("s").clear().onsuccess=function(e){t&&t()}:setTimeout(function(){c.clear(t)},50)}}).get,set:c.set,delete:c.delete,list:c.list,getAll:c.getAll,clear:c.clear},e.ldb=t,"undefined"!=typeof module&&(module.exports=t)):console.error("indexDB not supported")}();

  /**
   * =============================================================
   * BOT INTERFACE API DOCUMENTATION (v1.1) + DEBUG LOGS
   * =============================================================
   *
   * Это модуль для создания плавающего интерфейса бота.
   * Вызывается по нажатию F2 (можно изменить).
   *
   * Основные методы:
   *
   * 1. BotInterface.createCategory(name, icon = null)
   *    - Создает категорию с именем и опциональной иконкой (HTML-строка)
   *    - Возвращает объект категории для добавления элементов
   *
   * 2. category.addToggle(label, description, defaultValue, onChange)
   *    - Добавляет переключатель (toggle)
   *    - label: название
   *    - description: подпись
   *    - defaultValue: начальное значение (true/false)
   *    - onChange: функция, вызываемая при изменении (принимает новое значение)
   *
   * 3. category.addSlider(label, description, min, max, step, defaultValue, onChange)
   *    - Добавляет слайдер
   *    - min/max/step: диапазон и шаг
   *    - defaultValue: начальное значение
   *    - onChange: функция, вызываемая при изменении (принимает новое числовое значение)
   *
   * 4. category.addButton(label, description, onClick)
   *    - Добавляет кнопку
   *    - onClick: функция, вызываемая при клике
   *    - Также поддерживает параметры buttonText (текст кнопки) и buttonColor (цвет кнопки)
   *
   * 5. category.addSelect(label, description, options, defaultValue, onChange)
   *    - Добавляет выпадающий список
   *    - options: массив объектов {value: 'val', label: 'Label'}
   *    - onChange: функция, вызываемая при изменении (принимает выбранное значение)
   *
   * 6. category.addInput(label, description, defaultValue, onChange)
   *    - Добавляет текстовое поле
   *    - onChange вызывается при потере фокуса или нажатии Enter
   *    - Если onChange возвращает новое значение, оно отображается в поле ввода
   *    - Это позволяет обновлять отображаемое значение после обработки пользовательского ввода
   *    (например, для приведения к нижнему регистру или форматирования)
   *
   * 7. category.addContainer(label, description) - создает контейнер
   *    - Возвращает объект контейнера с методами addToggle, addSlider и т.д.
   *    - Позволяет группировать элементы внутри одного пункта
   *    - Все методы контейнера работают аналогично основным методам (см. выше)
   *
   * 8. BotInterface.toggle() — показать/скрыть меню
   * 9. BotInterface.isVisible() — вернуть true, если меню открыто
   * 10. BotInterface.setKey(key) — изменить клавишу вызова (например, 'F2', 'Escape', 'KeyA', 'Digit1')
   *
   * Примеры:
   *   BotInterface.setKey('F3'); // изменить на F3
   *   BotInterface.setKey('KeyZ'); // изменить на Z
   *   BotInterface.setKey('Escape'); // изменить на Escape
   *
   * Стили можно кастомизировать через CSS-классы:
   *   .bot-interface, .bot-interface-sidebar, .bot-interface-content, .bot-interface-category, .bot-interface-item
   */
  class BotInterface {
    static #instance = null;
    static #menuElement = null;
    static #isVisible = false;
    static #key = "F4"; // Теперь используем строку
    static #overlay = null; // <-- Объявление поля добавлено
    static categories = [];
    static #categoryIdCounter = 0;
    static currentCategory = null;
    /**
     * Инициализация меню
     */
    static init() {
      if (this.#instance) {
        return this.#instance;
      }
      this.#createDOM();
      this.#bindEvents();
      this.#bindKeyEvents(); // Add key binding functionality
      this.#instance = this;
      return this;
    }
    /**
     * Создание DOM-элементов меню
     */
    static #createDOM() {
      this.#menuElement = document.createElement("div");
      this.#menuElement.className = "pokelegenda-interface";
      // Боковая панель
      const sidebar = document.createElement("div");
      sidebar.className = "pokelegenda-sidebar";
      sidebar.innerHTML = `
            <div class="pokelegenda-category-header">
                <img src='https://i.ibb.co/k6ghSn0j/7-removebg-preview.png' width='40px' height='40px'>
                <span>Pokelegenda Bot</span>
            </div>
        `;
      // Контент
      const content = document.createElement("div");
      content.className = "pokelegenda-content";
      this.#menuElement.appendChild(sidebar);
      this.#menuElement.appendChild(content);
      document.body.appendChild(this.#menuElement);
      // Заглушка для скрытия меню при клике вне
      this.#overlay = document.createElement("div");
      this.#overlay.className = "pokelegenda-overlay";
      this.#overlay.addEventListener("click", () => this.toggle());
      document.body.appendChild(this.#overlay);
    }
    /**
     * Привязка событий
     */
    static #bindEvents() {
      // Обработка клавиши вызова
      document.addEventListener("keydown", (e) => {
        // Проверяем, что клавиша соответствует настроенной, и это не повтор нажатия
        if (e.key.toLowerCase() === this.#key.toLowerCase() && !e.repeat) {
          e.preventDefault(); // Предотвращаем возможное срабатывание браузером
          this.toggle();
        }
      });
    }

    /**
     * Привязка событий клавиш для горячих клавиш элементов
     */
    static #bindKeyEvents() {
      document.addEventListener(
        "keydown",
        (e) => {
          // Проверяем, не находится ли пользователь в поле ввода
          if (
            e.target.tagName === "INPUT" ||
            e.target.tagName === "TEXTAREA" ||
            e.target.contentEditable === "true"
          ) {
            return;
          }

          // Проверяем, не удерживается ли клавиша уже (чтобы избежать повторных срабатываний)
          if (e.repeat) return;

          const keyCombo = this.#getKeyCombo(e);

          // Проверяем, есть ли биндинги для этой комбинации клавиш
          const bindings = Settings.get("elementKeyBindings") || {};
          const boundElementId = Object.keys(bindings).find(
            (id) => bindings[id] === keyCombo
          );

          if (boundElementId) {
            e.preventDefault(); // Предотвращаем действия браузера по умолчанию
            this.#triggerBoundElement(boundElementId);
          }
        },
        true
      ); // Используем capture phase для перехвата до других обработчиков
    }

    /**
     * Создает строку комбинации клавиш из события
     */
    static #getKeyCombo(event) {
      const keys = [];
      if (event.ctrlKey) keys.push("Ctrl");
      if (event.shiftKey) keys.push("Shift");
      if (event.altKey) keys.push("Alt");
      if (event.metaKey) keys.push("Meta");

      // Добавляем основную клавишу, если это не модификатор
      const mainKey = event.key;
      if (!["Control", "Shift", "Alt", "Meta", "OS"].includes(mainKey)) {
        keys.push(mainKey);
      }

      return keys.join("+");
    }

    /**
     * Активирует связанный элемент
     */
    static #triggerBoundElement(elementId) {
      const element = this.#findElementById(elementId);
      if (!element) return;

      switch (element.type) {
        case "toggle":
          element.value = !element.value;
          if (element.onChange) element.onChange(element.value);
          // Обновляем UI элемента
          this.#updateToggleUI(elementId, element.value);
          break;
        case "button":
          if (element.onClick) element.onClick();
          break;
      }
    }

    /**
     * Поиск элемента по ID
     */
    static #findElementById(targetId) {
      for (const category of this.categories) {
        const found = this.#findElementInCategory(category, targetId);
        if (found) return found;
      }
      return null;
    }

    /**
     * Поиск элемента в категории
     */
    static #findElementInCategory(category, targetId) {
      for (const item of category.items) {
        // Проверяем текущий элемент
        if (item.id === targetId) return item;

        // Если это контейнер, проверяем его вложенные элементы
        if (item.type === "container" && Array.isArray(item.items)) {
          for (const nestedItem of item.items) {
            if (nestedItem.id === targetId) return nestedItem;
          }
        }
      }
      return null;
    }

    /**
     * Обновление UI переключателя
     */
    static #updateToggleUI(elementId, value) {
      const element = document.querySelector(
        `[data-element-id="${elementId}"]`
      );
      if (element) {
        const input = element.querySelector('input[type="checkbox"]');
        if (input) {
          input.checked = value;
        }
      }
    }

    /**
     * Получает привязку клавиши для элемента
     */
    static #getKeyBindingForElement(elementId) {
      const bindings = Settings.get("elementKeyBindings") || {};
      return bindings[elementId] || null;
    }

    /**
     * Устанавливает привязку клавиши для элемента
     */
    static #setKeyBindingForElement(elementId, keyCombo) {
      const bindings = Settings.get("elementKeyBindings") || {};
      bindings[elementId] = keyCombo;
      Settings.set("elementKeyBindings", bindings);
    }

    /**
     * Удаляет привязку клавиши для элемента
     */
    static #removeKeyBindingForElement(elementId) {
      const bindings = Settings.get("elementKeyBindings") || {};
      delete bindings[elementId];
      Settings.set("elementKeyBindings", bindings);
    }

    /**
     * Генерирует детерминистский ID для элемента на основе его свойств
     */
    static #generateElementId(categoryName, label, description, type) {
      // Create a simple hash of the input strings to generate consistent IDs
      // Using category name, label, description and type to create unique but consistent IDs
      const str = `${categoryName}_${label}_${description}_${type}`;
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return `element_${Math.abs(hash).toString(36)}`;
    }

    /**
     * Показывает меню для привязки клавиш
     */
    static #showKeyBindMenu(event, element) {
      // Удаляем предыдущее меню, если оно существует
      const existingMenu = document.querySelector(".keybind-menu");
      if (existingMenu) existingMenu.remove();

      // Создаем контейнер для меню
      const menu = document.createElement("div");
      menu.className = "keybind-menu";
      menu.style.cssText = `
        position: fixed;
        background: #2d2d2d;
        border: 1px solid #4CAF50;
        border-radius: 6px;
        padding: 10px;
        z-index: 10000;
        min-width: 200px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #ffffff;
        font-size: 14px;
      `;

      // Позиционируем меню рядом с курсором
      menu.style.left = event.clientX + "px";
      menu.style.top = event.clientY + "px";

      // Если у элемента уже есть бинд, показываем его
      const currentBinding = element.currentKeyBinding
        ? `<div style="margin-bottom: 8px; padding: 5px; background: #333; border-radius: 4px;">
          Текущая клавиша: <strong>${element.currentKeyBinding}</strong>
        </div>`
        : '<div style="margin-bottom: 8px; padding: 5px;">Клавиша не назначена</div>';

      // Опции меню
      menu.innerHTML = `
        ${currentBinding}
        <div id="bind-key-btn" style="padding: 8px; background: #4CAF50; border-radius: 4px; cursor: pointer; margin-bottom: 5px; text-align: center;">
          ${
            element.currentKeyBinding
              ? "Переназначить клавишу"
              : "Назначить клавишу"
          }
        </div>
        ${
          element.currentKeyBinding
            ? `
          <div id="remove-key-btn" style="padding: 8px; background: #f44336; border-radius: 4px; cursor: pointer; text-align: center;">
            Удалить клавишу
          </div>
        `
            : ""
        }
        <div id="cancel-btn" style="padding: 8px; background: #666; border-radius: 4px; cursor: pointer; margin-top: 5px; text-align: center;">
          Отмена
        </div>
      `;

      document.body.appendChild(menu);

      // Обработчики для кнопок меню
      document.getElementById("bind-key-btn")?.addEventListener("click", () => {
        menu.remove();
        this.#startKeyCapture(element);
      });

      document
        .getElementById("remove-key-btn")
        ?.addEventListener("click", () => {
          this.#removeKeyBindingForElement(element.id);
          element.currentKeyBinding = null; // Обновляем привязку в элементе
          menu.remove();
          this.#renderContent(); // Перерисовываем, чтобы обновить отображение
        });

      document.getElementById("cancel-btn")?.addEventListener("click", () => {
        menu.remove();
      });

      // Закрываем меню при клике вне его
      const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener("click", closeMenu);
        }
      };
      setTimeout(() => {
        document.addEventListener("click", closeMenu);
      }, 100);
    }

    /**
     * Начинает захват клавиши для привязки
     */
    static #startKeyCapture(element) {
      // Создаем оверлей для захвата клавиш
      const overlay = document.createElement("div");
      overlay.id = "keybind-overlay";
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 24px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-align: center;
        cursor: pointer;
      `;

      overlay.innerHTML = `
        <div>
          <div style="font-size: 32px; margin-bottom: 20px; color: #4CAF50;">Нажмите клавишу для привязки</div>
          <div style="font-size: 18px;">(Нажмите ESC или кликните вне области для отмены)</div>
        </div>
      `;

      document.body.appendChild(overlay);

      const handleKeyInput = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Проверяем, не является ли нажатая клавиша клавишей отмены
        if (e.key === "Escape") {
          document.body.removeChild(overlay);
          document.removeEventListener("keydown", handleKeyInput, true);
          return;
        }

        // Создаем комбинацию клавиш
        const keyCombo = this.#getKeyCombo(e);

        // Если это модификатор (Ctrl, Shift и т.д.), ждем дополнительной клавиши
        if (["Control", "Shift", "Alt", "Meta", "OS", "Fn"].includes(e.key)) {
          return;
        }

        // Проверяем, не используется ли уже эта комбинация
        const existingBindings = Settings.get("elementKeyBindings") || {};
        const existingElementId = Object.keys(existingBindings).find(
          (id) => existingBindings[id] === keyCombo
        );

        if (existingElementId && existingElementId !== element.id) {
          // Клавиша уже используется другим элементом
          if (
            confirm(
              `Клавиша ${keyCombo} уже назначена на другой элемент. Заменить?`
            )
          ) {
            // Удаляем старую привязку
            this.#removeKeyBindingForElement(existingElementId);

            // Найдем и обновим элемент, с которого удалили привязку
            const originalElement = this.#findElementById(existingElementId);
            if (originalElement) {
              originalElement.currentKeyBinding = null;
            }

            // Обновляем привязку для текущего элемента
            this.#setKeyBindingForElement(element.id, keyCombo);
            element.currentKeyBinding = keyCombo;
          }
        } else {
          // Просто устанавливаем новую привязку
          this.#setKeyBindingForElement(element.id, keyCombo);
          element.currentKeyBinding = keyCombo;
        }

        document.body.removeChild(overlay);
        document.removeEventListener("keydown", handleKeyInput, true);

        // Перерисовываем интерфейс, чтобы отобразить новую привязку
        this.#renderContent();
      };

      // Обработчик для клика вне оверлея
      const handleOverlayClick = (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
          document.removeEventListener("keydown", handleKeyInput, true);
          document.removeEventListener("click", handleOverlayClick);
        }
      };

      // Обработка нажатия клавиш
      document.addEventListener("keydown", handleKeyInput, true);
      document.addEventListener("click", handleOverlayClick);
    }
    /**
     * Создание новой категории
     * @param {string} name - название категории
     * @param {string} icon - иконка (HTML или emoji)
     * @returns {Object} - объект категории с методами addToggle, addSlider, addButton и другими
     */
    static createCategory(name, icon = null) {
      const id = "cat_" + ++this.#categoryIdCounter;
      const self = this; // Store reference to BotInterface for use in nested functions

      const category = {
        id,
        name,
        icon,
        items: [],
        addToggle(label, description, defaultValue, onChange) {
          const itemId = self.#generateElementId(
            this.name,
            label,
            description,
            "toggle"
          );
          const item = {
            id: itemId,
            type: "toggle",
            label,
            description,
            value: !!defaultValue,
            onChange,
            currentKeyBinding: self.#getKeyBindingForElement(itemId),
          };
          this.items.push(item);
          return item;
        },
        addSlider(label, description, min, max, step, defaultValue, onChange) {
          const itemId = self.#generateElementId(
            this.name,
            label,
            description,
            "slider"
          );
          const item = {
            id: itemId,
            type: "slider",
            label,
            description,
            min,
            max,
            step,
            value: Math.min(Math.max(defaultValue, min), max),
            onChange,
          };
          this.items.push(item);
          return item;
        },
        addButton(
          label,
          description,
          onClick,
          buttonText = "Выполнить",
          buttonColor = "#4CAF50"
        ) {
          const itemId = self.#generateElementId(
            this.name,
            label,
            description,
            "button"
          );
          const item = {
            id: itemId,
            type: "button",
            label,
            description,
            onClick,
            buttonText,
            buttonColor,
            currentKeyBinding: self.#getKeyBindingForElement(itemId),
          };
          this.items.push(item);
          return item;
        },
        addSelect(label, description, options, defaultValue, onChange) {
          const itemId = self.#generateElementId(
            this.name,
            label,
            description,
            "select"
          );
          const item = {
            id: itemId,
            type: "select",
            label,
            description,
            options,
            value: defaultValue,
            onChange,
          };
          this.items.push(item);
          return item;
        },
        addInput(label, description, defaultValue, onChange) {
          const itemId = self.#generateElementId(
            this.name,
            label,
            description,
            "input"
          );
          const item = {
            id: itemId,
            type: "input",
            label,
            description,
            value: defaultValue || "",
            onChange,
          };
          this.items.push(item);
          return item;
        },
        addContainer(label, description) {
          const containerId = self.#generateElementId(
            this.name,
            label,
            description,
            "container"
          );
          const container = {
            id: containerId,
            type: "container",
            label,
            description,
            items: [],
            addToggle(label, description, defaultValue, onChange) {
              const nestedItemId = self.#generateElementId(
                this.label,
                label,
                description,
                "toggle"
              );
              const item = {
                id: nestedItemId,
                type: "toggle",
                label,
                description,
                value: !!defaultValue,
                onChange,
                currentKeyBinding: self.#getKeyBindingForElement(nestedItemId),
              };
              this.items.push(item);
              return item;
            },
            addSlider(
              label,
              description,
              min,
              max,
              step,
              defaultValue,
              onChange
            ) {
              const nestedItemId = self.#generateElementId(
                this.label,
                label,
                description,
                "slider"
              );
              const item = {
                id: nestedItemId,
                type: "slider",
                label,
                description,
                min,
                max,
                step,
                value: Math.min(Math.max(defaultValue, min), max),
                onChange,
              };
              this.items.push(item);
              return item;
            },
            addSelect(label, description, options, defaultValue, onChange) {
              const nestedItemId = self.#generateElementId(
                this.label,
                label,
                description,
                "select"
              );
              const item = {
                id: nestedItemId,
                type: "select",
                label,
                description,
                options,
                value: defaultValue,
                onChange,
              };
              this.items.push(item);
              return item;
            },
            addInput(label, description, defaultValue, onChange) {
              const nestedItemId = self.#generateElementId(
                this.label,
                label,
                description,
                "input"
              );
              const item = {
                id: nestedItemId,
                type: "input",
                label,
                description,
                value: defaultValue || "",
                onChange,
              };
              this.items.push(item);
              return item;
            },
            addButton(
              label,
              description,
              onClick,
              buttonText = "Выполнить",
              buttonColor = "#4CAF50"
            ) {
              const nestedItemId = self.#generateElementId(
                this.label,
                label,
                description,
                "button"
              );
              const item = {
                id: nestedItemId,
                type: "button",
                label,
                description,
                onClick,
                buttonText,
                buttonColor,
                currentKeyBinding: self.#getKeyBindingForElement(nestedItemId),
              };
              this.items.push(item);
              return item;
            },
          };
          this.items.push(container);
          return container;
        },
      };
      this.categories.push(category);

      const sidebar = this.#menuElement.querySelector(".pokelegenda-sidebar");
      const btn = document.createElement("div");
      btn.className = "pokelegenda-category-button";
      btn.dataset.categoryId = id;
      btn.innerHTML = `${
        icon ? `<span class="pokelegenda-nf-icon">${icon}</span>` : ""
      }<span>${name}</span>`;
      sidebar.appendChild(btn);

      // Устанавливаем первую категорию как активную
      if (this.categories.length === 1) {
        this.currentCategory = id;
        btn.classList.add("active");
        // НЕ вызываем #renderContent() здесь
        sidebar.addEventListener("click", (e) => {
          const categoryBtn = e.target.closest(".pokelegenda-category-button");
          if (!categoryBtn) return;
          sidebar
            .querySelectorAll(".pokelegenda-category-button")
            .forEach((el) => el.classList.remove("active"));
          categoryBtn.classList.add("active");
          const clickedCategoryId = categoryBtn.dataset.categoryId;
          if (clickedCategoryId) {
            this.currentCategory = clickedCategoryId;
            this.#renderContent();
          }
        });
      }

      return category;
    }
    /**
     * Рендеринг контента текущей категории
     */
    static #renderContent() {
      const content = this.#menuElement.querySelector(".pokelegenda-content");
      content.innerHTML = "";
      const category = this.categories.find(
        (c) => c.id === this.currentCategory
      );
      if (!category) {
        console.error(
          `[DEBUG] Категория с id ${this.currentCategory} не найдена!`
        );
        return;
      }
      // Заголовок категории
      const title = document.createElement("h2");
      title.className = "pokelegenda-category-header";
      title.textContent = category.name;
      content.appendChild(title);
      // Рендер элементов категории
      category.items.forEach((item, index) => {
        const itemContainer = document.createElement("div");
        itemContainer.className = "pokelegenda-setting-item";
        itemContainer.setAttribute("data-element-id", item.id); // Add element ID

        if (item.type === "toggle") {
          const currentBinding = item.currentKeyBinding
            ? ` (Клавиша: ${item.currentKeyBinding})`
            : " (Правый клик для бинда)";
          itemContainer.innerHTML = `
                <div class="pokelegenda-item-content">
                    <div>
                        <div class="pokelegenda-setting-label">${
                          item.label
                        }</div>
                        <div class="pokelegenda-setting-description">${
                          item.description
                        }${currentBinding}</div>
                    </div>
                    <label class="pokelegenda-toggle-switch">
                        <input type="checkbox" ${item.value ? "checked" : ""}>
                        <span class="pokelegenda-toggle-slider round"></span>
                    </label>
                </div>
            `;
          const input = itemContainer.querySelector("input");
          input.addEventListener("change", (e) => {
            item.value = e.target.checked;
            if (item.onChange) item.onChange(item.value);
          });

          // Add right-click context menu for key binding
          itemContainer.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.#showKeyBindMenu(e, item);
          });
        } else if (item.type === "slider") {
          itemContainer.innerHTML = `
                <div class="pokelegenda-item-content">
                    <div>
                        <div class="pokelegenda-setting-label">${item.label}</div>
                        <div class="pokelegenda-setting-description">${item.description}</div>
                    </div>
                    <div class="pokelegenda-slider-controls">
                        <input type="range" class="pokelegenda-slider" min="${item.min}" max="${item.max}" step="${item.step}" value="${item.value}">
                        <span class="pokelegenda-slider-value">${item.value}</span>
                    </div>
                </div>
            `;
          const slider = itemContainer.querySelector('input[type="range"]');
          const valueDisplay = itemContainer.querySelector(
            ".pokelegenda-slider-value"
          );
          slider.addEventListener("input", (e) => {
            const val = parseFloat(e.target.value);
            item.value = val;
            valueDisplay.textContent = val;
            if (item.onChange) item.onChange(val);
          });
        } else if (item.type === "button") {
          const currentBinding = item.currentKeyBinding
            ? ` (Клавиша: ${item.currentKeyBinding})`
            : " (Правый клик для бинда)";
          itemContainer.innerHTML = `
                <div class="pokelegenda-item-content">
                    <div>
                        <div class="pokelegenda-setting-label">${item.label}</div>
                        <div class="pokelegenda-setting-description">${item.description}${currentBinding}</div>
                    </div>
                    <button class="pokelegenda-button" style="background-color: ${item.buttonColor};">${item.buttonText}</button>
                </div>
            `;
          const button = itemContainer.querySelector("button");
          button.addEventListener("click", () => {
            if (item.onClick) item.onClick();
          });

          // Add right-click context menu for key binding
          itemContainer.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.#showKeyBindMenu(e, item);
          });
        } else if (item.type === "select") {
          let optionsHtml = "";
          item.options.forEach((opt) => {
            const selected = opt.value === item.value ? "selected" : "";
            optionsHtml += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
          });
          itemContainer.innerHTML = `
                <div>
                    <div class="pokelegenda-setting-label">${item.label}</div>
                    <div class="pokelegenda-setting-description">${item.description}</div>
                    <select class="pokelegenda-select">${optionsHtml}</select>
                </div>
            `;
          const select = itemContainer.querySelector("select");
          select.addEventListener("change", (e) => {
            item.value = e.target.value;
            if (item.onChange) item.onChange(item.value);
          });
        } else if (item.type === "input") {
          itemContainer.innerHTML = `
                <div>
                    <div class="pokelegenda-setting-label">${item.label}</div>
                    <div class="pokelegenda-setting-description">${item.description}</div>
                    <input type="text" value="${item.value}" class="pokelegenda-input"/>
                </div>
            `;
          const input = itemContainer.querySelector('input[type="text"]');
          let isCommitted = false;

          const commitValue = (value) => {
            if (isCommitted) return;
            isCommitted = true;
            if (item.onChange) {
              const result = item.onChange(value);
              // Если функция onChange возвращает новое значение, используем его
              item.value = result !== undefined ? result : value;
            } else {
              item.value = value;
            }
            // Обновляем значение в поле ввода, чтобы отразить изменения,
            // сделанные в onChange (например, приведение к нижнему регистру)
            setTimeout(() => {
              if (input.value !== item.value) {
                input.value = item.value;
              }
            }, 0);
          };

          input.addEventListener("blur", () => {
            commitValue(input.value);
            isCommitted = false;
          });

          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitValue(input.value);
              input.blur();
            }
          });
        } else if (item.type === "container") {
          // Рендер контейнера
          itemContainer.classList.add("has-container");
          itemContainer.innerHTML = `
                <div>
                    <div class="pokelegenda-setting-label">${item.label}</div>
                    <div class="pokelegenda-setting-description">${item.description}</div>
                    <div class="pokelegenda-container-items">
                        <!-- Вложенные элементы будут добавлены сюда -->
                    </div>
                </div>
            `;
          const containerItemsDiv = itemContainer.querySelector(
            ".pokelegenda-container-items"
          );
          // Рендер вложенных элементов
          item.items.forEach((nestedItem, nestedIndex) => {
            const nestedContainer = document.createElement("div");
            nestedContainer.className = "pokelegenda-nested-item";
            nestedContainer.setAttribute("data-element-id", nestedItem.id); // Add element ID

            if (nestedItem.type === "toggle") {
              const currentBinding = nestedItem.currentKeyBinding
                ? ` (Клавиша: ${nestedItem.currentKeyBinding})`
                : " (Правый клик для бинда)";
              nestedContainer.innerHTML = `
                    <div>
                        <div class="pokelegenda-setting-label">${
                          nestedItem.label
                        }</div>
                        <div class="pokelegenda-setting-description">${
                          nestedItem.description
                        }${currentBinding}</div>
                    </div>
                    <label class="pokelegenda-toggle-switch">
                        <input type="checkbox" ${
                          nestedItem.value ? "checked" : ""
                        }>
                        <span class="pokelegenda-toggle-slider round"></span>
                    </label>
                `;
              const input = nestedContainer.querySelector("input");
              input.addEventListener("change", (e) => {
                nestedItem.value = e.target.checked;
                if (nestedItem.onChange) nestedItem.onChange(nestedItem.value);
              });

              // Add right-click context menu for key binding
              nestedContainer.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                this.#showKeyBindMenu(e, nestedItem);
              });
            } else if (nestedItem.type === "slider") {
              nestedContainer.innerHTML = `
                    <div>
                        <div class="pokelegenda-setting-label">${nestedItem.label}</div>
                        <div class="pokelegenda-setting-description">${nestedItem.description}</div>
                    </div>
                    <div class="pokelegenda-slider-controls">
                        <input type="range" class="pokelegenda-slider" min="${nestedItem.min}" max="${nestedItem.max}" step="${nestedItem.step}" value="${nestedItem.value}">
                        <span class="pokelegenda-slider-value">${nestedItem.value}</span>
                    </div>
                `;
              const slider = nestedContainer.querySelector(
                'input[type="range"]'
              );
              const valueDisplay = nestedContainer.querySelector(
                ".pokelegenda-slider-value"
              );
              slider.addEventListener("input", (e) => {
                const val = parseFloat(e.target.value);
                nestedItem.value = val;
                valueDisplay.textContent = val;
                if (nestedItem.onChange) nestedItem.onChange(val);
              });
            } else if (nestedItem.type === "select") {
              let optionsHtml = "";
              nestedItem.options.forEach((opt) => {
                const selected =
                  opt.value === nestedItem.value ? "selected" : "";
                optionsHtml += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
              });
              nestedContainer.innerHTML = `
                    <div>
                        <div class="pokelegenda-setting-label">${nestedItem.label}</div>
                        <div class="pokelegenda-setting-description">${nestedItem.description}</div>
                    </div>
                    <select class="pokelegenda-select">${optionsHtml}</select>
                `;
              const select = nestedContainer.querySelector("select");
              select.addEventListener("change", (e) => {
                nestedItem.value = e.target.value;
                if (nestedItem.onChange) nestedItem.onChange(nestedItem.value);
              });
            } else if (nestedItem.type === "input") {
              nestedContainer.innerHTML = `
                    <div>
                        <div class="pokelegenda-setting-label">${nestedItem.label}</div>
                        <div class="pokelegenda-setting-description">${nestedItem.description}</div>
                    </div>
                    <input type="text" value="${nestedItem.value}" class="pokelegenda-input"/>
                `;
              const input = nestedContainer.querySelector('input[type="text"]');
              let isCommitted = false;

              const commitValue = (value) => {
                if (isCommitted) return;
                isCommitted = true;
                if (nestedItem.onChange) {
                  const result = nestedItem.onChange(value);
                  // Если функция onChange возвращает новое значение, используем его
                  nestedItem.value = result !== undefined ? result : value;
                } else {
                  nestedItem.value = value;
                }
                // Обновляем значение в поле ввода, чтобы отразить изменения,
                // сделанные в onChange (например, приведение к нижнему регистру)
                setTimeout(() => {
                  if (input.value !== nestedItem.value) {
                    input.value = nestedItem.value;
                  }
                }, 0);
              };

              input.addEventListener("blur", () => {
                commitValue(input.value);
                isCommitted = false;
              });

              input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitValue(input.value);
                  input.blur();
                }
              });
            } else if (nestedItem.type === "button") {
              // ✅ Поддержка buttonText и buttonColor
              const text = nestedItem.buttonText ?? "Выполнить";
              const currentBinding = nestedItem.currentKeyBinding
                ? ` (Клавиша: ${nestedItem.currentKeyBinding})`
                : " (Правый клик для бинда)";
              const color = nestedItem.buttonColor ?? "#4CAF50";
              nestedContainer.innerHTML = `
                    <div>
                        <div class="pokelegenda-setting-label">${nestedItem.label}</div>
                        <div class="pokelegenda-setting-description">${nestedItem.description}${currentBinding}</div>
                    </div>
                    <button class="pokelegenda-button" style="background-color: ${color};">${text}</button>
                `;
              const button = nestedContainer.querySelector("button");
              button.addEventListener("click", () => {
                if (nestedItem.onClick) nestedItem.onClick();
              });

              // Add right-click context menu for key binding
              nestedContainer.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                this.#showKeyBindMenu(e, nestedItem);
              });
            }

            containerItemsDiv.appendChild(nestedContainer);
          });
        }
        content.appendChild(itemContainer);
      });
    }
    /**
     * Переключение видимости меню
     */
    static toggle() {
      this.#isVisible = !this.#isVisible;
      this.#menuElement.style.transform = this.#isVisible
        ? "translateX(0)"
        : "translateX(-110%)";
      this.#overlay.style.display = this.#isVisible ? "block" : "none";
      // Если меню закрыто, сбрасываем фокус
      if (!this.#isVisible) {
        document.activeElement?.blur();
      }
    }
    /**
     * Проверка видимости меню
     * @returns {boolean}
     */
    static isVisible() {
      return this.#isVisible;
    }
    /**
     * Изменение клавиши вызова
     * @param {string} key - клавиша в формате, как в event.key (например, 'F2', 'KeyA', 'Escape')
     */
    static setKey(key) {
      this.#key = key;
    }

    static renderActiveCategory() {
      this.#renderContent();
    }
  }

  // 👇 СТИЛИ (все в одном месте)
  //        CSS Стили
  const style = document.createElement("style");
  style.textContent = `
/* ==================== ОСНОВНОЙ КОНТЕЙНЕР ИНТЕРФЕЙСА ==================== */
.pokelegenda-interface {
position: fixed;
top: 20px;
left: 20px;
width: 800px;
height: 600px;
background: #121212;
border-radius: 12px;
box-shadow: 0 10px 30px rgba(0,0,0,0.5);
display: flex;
overflow: hidden;
z-index: 9999;
transform: translateX(-110%);
transition: transform 0.15s ease-out;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
color: #ffffff;
}

/* ==================== БОКОВАЯ ПАНЕЛЬ ==================== */
.pokelegenda-sidebar {
width: 200px;
background: #1e1e1e;
padding: 20px 10px;
overflow-y: auto;
background-image: url('https://i.ibb.co/pv71yTmt/ddb50ab07d50a24c3e634e1c6e314742.png');
background-size: 115px;
background-repeat: no-repeat;
background-position: bottom 10px left 10px;
}

/* ==================== ОСНОВНОЙ КОНТЕНТ ==================== */
.pokelegenda-content {
flex: 1;
padding: 15px 20px;
overflow-y: auto;
background: #1a1a1a;
scrollbar-width: none;
}
.pokelegenda-content::-webkit-scrollbar { display: none; }

.pokelegenda-content .pokelegenda-category-header {
position: sticky;
top: -20px;
background: #1a1a1a;
z-index: 1;
}

/* ==================== ЗАГОЛОВКИ КАТЕГОРИЙ ==================== */
.pokelegenda-category-header {
margin: 0 0 20px 0;
padding: 15px 0 12px 0;
border-bottom: 2px solid #4CAF50;
font-size: 19px;
font-weight: bold;
color: #4CAF50;
line-height: 1.2;
text-transform: uppercase;
letter-spacing: 1px;
display: flex;
align-items: center;
gap: 8px;
}

/* ==================== КНОПКИ КАТЕГОРИЙ ==================== */
.pokelegenda-category-button {
font-size: 17px;
padding: 15px 0 10px 10px;
margin: 5px 10px;
border-radius: 8px;
cursor: pointer;
display: flex;
align-items: center;
gap: 10px;
transition: background 0.15s ease;
}
.pokelegenda-category-button:hover,
.pokelegenda-category-button.active {
background: #2d2d2d;
}

/* ==================== ЭЛЕМЕНТЫ НАСТРОЕК ==================== */
.pokelegenda-setting-item {
margin: 15px 0;
padding: 15px;
background: #252525;
border-radius: 8px;
transition: background 0.15s ease;
}
.pokelegenda-setting-item:hover { background: #202020; }
.pokelegenda-setting-item.has-container:hover { background: #252525; }

.pokelegenda-item-content {
display: flex;
justify-content: space-between;
align-items: center;
}
.pokelegenda-setting-label { font-weight: bold; margin-bottom: 5px; }
.pokelegenda-setting-description { font-size: 14px; color: #aaaaaa; }

.pokelegenda-container-items {
margin-top: 10px;
padding-top: 10px;
border-top: 1px solid #333;
}

/* ==================== ВЛОЖЕННЫЕ ЭЛЕМЕНТЫ ==================== */
.pokelegenda-nested-item {
margin: 10px 0;
padding: 10px;
background: #252525;
border-radius: 6px;
display: flex;
justify-content: space-between;
align-items: center;
transition: background 0.15s ease;
}
.pokelegenda-nested-item:hover { background: #202020; }

/* ==================== ПЕРЕКЛЮЧАТЕЛИ ==================== */
.pokelegenda-toggle-switch {
position: relative;
display: inline-block;
width: 50px;
height: 24px;
}
.pokelegenda-toggle-switch input {
opacity: 0;
width: 0;
height: 0;
}
.pokelegenda-toggle-slider {
position: absolute;
cursor: pointer;
inset: 0;
background-color: #505050;
transition: .4s;
border-radius: 24px;
}
.pokelegenda-toggle-slider:before {
content: "";
position: absolute;
height: 16px;
width: 16px;
left: 4px;
bottom: 4px;
background-color: white;
transition: .4s;
border-radius: 50%;
}
input:checked + .pokelegenda-toggle-slider { background-color: #4CAF50; }
input:checked + .pokelegenda-toggle-slider:before { transform: translateX(26px); }

/* ==================== СЛАЙДЕРЫ ==================== */
.pokelegenda-slider { width: 120px; }
.pokelegenda-nested-item .pokelegenda-slider { width: 100px; }

.pokelegenda-slider-value {
min-width: 30px;
text-align: center;
}

.pokelegenda-slider-controls {
display: flex;
align-items: center;
gap: 10px;
max-width: 135px;
}

input[type="range"] {
-webkit-appearance: none;
width: 120px;
height: 4px;
background: #444;
}
input[type="range"]::-webkit-slider-thumb {
-webkit-appearance: none;
width: 18px;
height: 18px;
border-radius: 50%;
background: #4CAF50;
cursor: pointer;
transition: all 0.2s ease;
}
input[type="range"]:hover::-webkit-slider-thumb { background: #5CbF60; }

/* ==================== ВЫПАДАЮЩИЕ СПИСКИ И ПОЛЯ ВВОДА ==================== */
.pokelegenda-input,
.pokelegenda-select {
background: #333;
border: 1px solid #555;
border-radius: 4px;
color: #fff;
box-sizing: border-box;
}
.pokelegenda-input {
width: 100%;
padding: 7px;
margin-top: 8px;
}
.pokelegenda-nested-item .pokelegenda-input {
width: 135px;
padding: 5px;
margin: 0;
}
.pokelegenda-select {
width: 100%;
padding: 7px;
margin-top: 8px;
cursor: pointer;
}
.pokelegenda-nested-item .pokelegenda-select {
width: max-content;
min-width: 135px;
padding: 5px;
margin: 0;
}

/* ==================== КНОПКИ ==================== */
.pokelegenda-button {
width: 135px;
height: 35px;
padding: 5px 10px;
background: #4CAF50;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
box-shadow: 0 2px 4px rgba(0,0,0,0.2);
transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.pokelegenda-nested-item .pokelegenda-button { width: 135px; }

.pokelegenda-button:hover {
transform: scale(1.02);
box-shadow: 0 0 10px #101010;
}
.pokelegenda-button:active {
transform: scale(0.98);
filter: brightness(1.1);
}

/* ==================== ОВЕРЛЕЙ ==================== */
.pokelegenda-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0,0,0,0.5);
z-index: 9998;
display: none;
cursor: pointer;
}

/* ==================== ИКОНКИ ==================== */
.pokelegenda-nf-icon {
font-family: "JetBrainsMono Nerd Font", "FiraCode Nerd Font", "Cascadia Code PL", "Segoe UI", sans-serif;
display: inline-block;
width: 1.2em;
text-align: center;
}

/* ==================== МЕНЮ ПРИВЯЗКИ КЛАВИШ ==================== */
.keybind-menu {
position: absolute;
background: #2d2d2d;
border: 1px solid #4CAF50;
border-radius: 6px;
padding: 10px;
z-index: 10000;
min-width: 200px;
box-shadow: 0 4px 12px rgba(0,0,0,0.3);
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
color: #ffffff;
font-size: 14px;
}
`;
  document.head.appendChild(style);

  await initialize();
  GameLoop();
})();

