// ==UserScript==
// @name        MyAnimeList (MAL) Tags Updater
// @namespace   https://greasyfork.org/users/7517
// @description Adds type, genres and other info to entries tags. Can also delete all current tags.
// @icon        http://i.imgur.com/b7Fw8oH.png
// @version     6.1.3
// @author      akarin
// @include     /^https?:\/\/myanimelist\.net\/(anime|manga)list\//
// @include     /^https?:\/\/myanimelist\.net\/panel\.php\?go=(add|edit)/
// @include     /^https?:\/\/myanimelist\.net\/editlist\.php\?type=anime/
// @include     /^https?:\/\/myanimelist\.net\/ownlist\/(anime|manga)\//
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7125/MyAnimeList%20%28MAL%29%20Tags%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/7125/MyAnimeList%20%28MAL%29%20Tags%20Updater.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  const T_PAGE = {
    M_LIST: 1, M_POPUP: 2
  };

  const T_RUN = {
    M_FULL: 1, M_EMPTY: 2, M_CLEAR: 3
  };

  const T_STATUS = {
    ALL: 7, IN_PROGRESS: 1, COMPLETED: 2, ON_HOLD: 3, DROPPED: 4, PLAN_TO: 6
  };

  const TAGS_CHAR_MAX = 255;

  const mal = {
    version: '6.0', // cache
    page: document.URL.match(/^https?:\/\/myanimelist\.net\/(anime|manga)list\//) ? T_PAGE.M_LIST : T_PAGE.M_POPUP,
    type: '', // anime or manga
    status: '',
    entries: {
      updating: false,
      total: 0,
      done: 0,
      fail: 0
    },
    content: {
      stage: $('<span id="tu_stage">'),
      done: $('<span id="tu_status_done">'),
      fail: $('<span id="tu_status_fail">')
    }
  };

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  $.fn.myfancybox = function (onstart) {
    return $(this).click(() => {
      mal.fancybox.start(onstart);
    });
  };

  mal.fancybox = {
    body: $('<div id="tu_fancybox_inner">'),
    outer: $('<div id="tu_fancybox_outer">'),
    wrapper: $('<div id="tu_fancybox_wrapper">'),

    init: (el) => {
      mal.fancybox.outer.hide()
        .append(mal.fancybox.body)
        .insertAfter(el);

      mal.fancybox.wrapper.hide()
        .insertAfter(el);

      mal.fancybox.wrapper.click(() => {
        mal.fancybox.close();
      });
    },

    start: (onstart) => {
      mal.fancybox.body.children().hide();
      if (onstart()) {
        mal.fancybox.wrapper.show();
        mal.fancybox.outer.show();
      } else {
        mal.fancybox.close();
      }
    },

    close: () => {
      mal.fancybox.outer.hide();
      mal.fancybox.wrapper.hide();
    }
  };

  const T_ = {
    TYPE: 1,
    STATUS: 2,
    AIRED: 3,
    PRODUCERS: 4,
    LICENSORS: 5,
    STUDIOS: 6,
    AUTHORS: 7,
    SERIALIZATION: 8,
    GENRES: 9,
    JRATING: 10,
    RATING: 11,
    BROADCAST: 12,
    SOURCE: 13,
    SCORE: 14,
    RANK: 15,
    POPULARITY: 16,
    MEMBERS: 17,
    FAVORITES: 18,
    JAPANESE: 19,
    ENGLISH: 20,
    DURATION: 101,
    YEAR: 102,
    SEASON: 103,
    PERIOD: 104,
    RND_SCORE: 105,
    YEAR_SHORT: 106,
    SEASON_SHORT: 107,
    PERIOD_SHORT: 108
  };

  const TAGS_ARRAY = {
    anime: [
      { id: T_.TYPE, text: 'Type', has_prefix: true, prefix: '', def: true },
      { id: T_.GENRES, text: 'Genres', has_prefix: false, prefix: '', def: true },
      { id: T_.STUDIOS, text: 'Studios', has_prefix: false, prefix: '', def: true },
      { id: T_.LICENSORS, text: 'Licensors', has_prefix: false, prefix: '', def: true },
      { id: T_.PRODUCERS, text: 'Producers', has_prefix: false, prefix: '', def: false },
      { id: T_.DURATION, text: 'Episode Length', has_prefix: true, prefix: '', def: true },
      { id: T_.RATING, text: 'Rating', has_prefix: true, prefix: 'Rating: ', def: false },
      { id: T_.JRATING, text: 'Japanese Rating', has_prefix: true, prefix: 'Rating: ', def: false },
      { id: T_.BROADCAST, text: 'Broadcast', has_prefix: true, prefix: 'Broadcast: ', def: false },
      { id: T_.SOURCE, text: 'Source', has_prefix: true, prefix: 'Source: ', def: false },
      { id: T_.STATUS, text: 'Status', has_prefix: true, prefix: 'Status: ', def: false },
      { id: T_.YEAR, text: 'Year', has_prefix: true, prefix: '', def: false },
      { id: T_.YEAR_SHORT, text: 'Year (Short)', has_prefix: true, prefix: '`', def: false },
      { id: T_.SEASON, text: 'Season', has_prefix: true, prefix: '', def: true },
      { id: T_.SEASON_SHORT, text: 'Season (Short)', has_prefix: true, prefix: '', def: false },
      { id: T_.PERIOD, text: 'Time Period', has_prefix: true, prefix: '', def: false },
      { id: T_.PERIOD_SHORT, text: 'Time Period (Short)', has_prefix: true, prefix: '`', def: false },
      { id: T_.JAPANESE, text: 'Japanese Title', has_prefix: true, prefix: '', def: false },
      { id: T_.ENGLISH, text: 'English Title', has_prefix: true, prefix: '', def: false },
      { id: T_.SCORE, text: 'Score', has_prefix: true, prefix: 'Score: ', def: false },
      { id: T_.RND_SCORE, text: 'Rounded Score', has_prefix: true, prefix: 'Score: ', def: false },
      { id: T_.RANK, text: 'Rank', has_prefix: true, prefix: 'Ranked: ', def: false },
      { id: T_.POPULARITY, text: 'Popularity', has_prefix: true, prefix: 'Popularity: ', def: false },
      { id: T_.MEMBERS, text: 'Members', has_prefix: true, prefix: 'Members: ', def: false },
      { id: T_.FAVORITES, text: 'Favorites', has_prefix: true, prefix: 'Favorites: ', def: false }
    ],
    manga: [
      { id: T_.TYPE, text: 'Type', has_prefix: true, prefix: '', def: true },
      { id: T_.GENRES, text: 'Genres', has_prefix: false, prefix: '', def: true },
      { id: T_.AUTHORS, text: 'Authors', has_prefix: false, prefix: '', def: true },
      { id: T_.SERIALIZATION, text: 'Serialization', has_prefix: true, prefix: '', def: true },
      { id: T_.STATUS, text: 'Status', has_prefix: true, prefix: 'Status: ', def: false },
      { id: T_.YEAR, text: 'Year', has_prefix: true, prefix: '', def: false },
      { id: T_.YEAR_SHORT, text: 'Year (Short)', has_prefix: true, prefix: '`', def: false },
      { id: T_.SEASON, text: 'Season', has_prefix: true, prefix: '', def: false },
      { id: T_.SEASON_SHORT, text: 'Season (Short)', has_prefix: true, prefix: '', def: false },
      { id: T_.PERIOD, text: 'Time Period', has_prefix: true, prefix: '', def: false },
      { id: T_.PERIOD_SHORT, text: 'Time Period (Short)', has_prefix: true, prefix: '`', def: false },
      { id: T_.JAPANESE, text: 'Japanese Title', has_prefix: true, prefix: '', def: false },
      { id: T_.ENGLISH, text: 'English Title', has_prefix: true, prefix: '', def: false },
      { id: T_.SCORE, text: 'Score', has_prefix: true, prefix: 'Score: ', def: false },
      { id: T_.RND_SCORE, text: 'Rounded Score', has_prefix: true, prefix: 'Score: ', def: false },
      { id: T_.RANK, text: 'Rank', has_prefix: true, prefix: 'Ranked: ', def: false },
      { id: T_.POPULARITY, text: 'Popularity', has_prefix: true, prefix: 'Popularity: ', def: false },
      { id: T_.MEMBERS, text: 'Members', has_prefix: true, prefix: 'Members: ', def: false },
      { id: T_.FAVORITES, text: 'Favorites', has_prefix: true, prefix: 'Favorites: ', def: false }
    ]
  };

  const TAGS_ARRAY_SORTED = {
    anime: [], manga: []
  };

  TAGS_ARRAY_SORTED.update = () => {
    ['anime', 'manga'].forEach((type) => {
      const map = mal.settings.order[type];
      TAGS_ARRAY_SORTED[type] = TAGS_ARRAY[type].slice().sort((a, b) => {
        const a1 = map.hasOwnProperty(a.id) ? map[a.id] : 0;
        const b1 = map.hasOwnProperty(b.id) ? map[b.id] : 0;
        return a1 - b1;
      });
    });
  };

  const AJAX = {
    delay: 3000
  };

  class Cache {
    constructor (name) {
      this.name = name;
    }

    encodeKey (key) {
      return this.name + '#' + mal.version + '#' + key;
    }

    loadValue (key, value) {
      try {
        return JSON.parse(localStorage.getItem(this.encodeKey(key))) || value;
      } catch (e) {
        console.log(e.name + ': ' + e.message);
        return value;
      }
    }

    saveValue (key, value) {
      localStorage.setItem(this.encodeKey(key), JSON.stringify(value));
    }
  }

  class MalData {
    constructor (username, type, offset, delay) {
      this.username = username;
      this.type = type;
      this.offset = parseInt(offset) || 300;
      this.delay = parseInt(delay) || AJAX.delay;
      this.running = false;
      this.data = {};
      this.size = 0;
    }

    clear () {
      this.running = false;
      this.data = {};
      this.size = 0;
    }

    async load (status, callbacks, filter, offset = 0, trycnt = 0) {
      if (!this.running) {
        return;
      }

      const hasFilter = Array.isArray(filter) && filter.length > 0;

      try {
        const response = await fetch('/' + this.type + 'list/' + this.username + '/load.json?offset=' + offset + '&status=' + status);
        if (!response.ok) {
          throw false;
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((entry) => {
            this.data[entry[this.type + '_id']] = hasFilter ? Object.keys(entry)
              .filter(key => filter.includes(key))
              .reduce((obj, key) => {
                obj[key] = entry[key];
                return obj;
              }, {}) : entry;
          });

          this.size = this.size + data.length;
          if (callbacks.hasOwnProperty('onNext')) {
            await callbacks.onNext(this.size);
          }
        } else {
          if (callbacks.hasOwnProperty('onFinish')) {
            await callbacks.onFinish(Object.assign({}, this.data));
          }
          this.clear();
        }
      } catch (e) {
        if (trycnt >= 10) {
          this.clear();
          if (callbacks.hasOwnProperty('onError')) {
            await callbacks.onError();
          }
        } else {
          await sleep(this.delay * 2);
          return this.load(status, callbacks, filter, offset, trycnt + 1);
        }
      }
    }

    async populate (status, callbacks, filter) {
      if (this.running) {
        return;
      }

      this.clear();
      this.running = true;

      for (let offset = 0; this.running; offset += this.offset) {
        for (let trycnt = 10; trycnt > 0; trycnt -= 1) {
          try {
            await sleep(this.delay);
            await this.load(parseInt(status) || T_STATUS.ALL, callbacks, filter, offset);
            break;
          } catch (e) {
            if (trycnt <= 1) {
              this.running = false;
              return;
            }
          }
        }
      }

      this.running = false;
    }
  }

  mal.settings = {
    cache: new Cache('mal_tags_updater'),
    body: $('<div id="tu_settings">'),
    ajax: { delay: AJAX.delay },
    tags: { anime: [], manga: [] },
    order: { anime: {}, manga: {} },
    prefix: { anime: {}, manga: {} },
    status: { anime: T_STATUS.ALL, manga: T_STATUS.ALL },

    load: () => {
      mal.settings.reset();
      mal.settings.ajax.delay = mal.settings.cache.loadValue('mal.settings.ajax.delay', mal.settings.ajax.delay);

      ['anime', 'manga'].forEach((type) => {
        mal.settings.tags[type] = mal.settings.cache.loadValue('mal.settings.tags.' + type, mal.settings.tags[type]);
        mal.settings.order[type] = mal.settings.cache.loadValue('mal.settings.order.' + type, mal.settings.order[type]);
        mal.settings.prefix[type] = mal.settings.cache.loadValue('mal.settings.prefix.' + type, mal.settings.prefix[type]);
        mal.settings.status[type] = mal.settings.cache.loadValue('mal.settings.status.' + type, mal.settings.status[type]);
      });

      TAGS_ARRAY_SORTED.update();
    },

    save: () => {
      mal.settings.cache.saveValue('mal.settings.ajax.delay', mal.settings.ajax.delay);

      ['anime', 'manga'].forEach((type) => {
        mal.settings.cache.saveValue('mal.settings.tags.' + type, mal.settings.tags[type]);
        mal.settings.cache.saveValue('mal.settings.order.' + type, mal.settings.order[type]);
        mal.settings.cache.saveValue('mal.settings.prefix.' + type, mal.settings.prefix[type]);
        mal.settings.cache.saveValue('mal.settings.status.' + type, mal.settings.status[type]);
      });

      TAGS_ARRAY_SORTED.update();
    },

    reset: () => {
      mal.settings.ajax.delay = AJAX.delay;

      ['anime', 'manga'].forEach((type) => {
        mal.settings.tags[type] = [];
        mal.settings.order[type] = {};
        mal.settings.prefix[type] = {};
        mal.settings.status[type] = T_STATUS.ALL;
        TAGS_ARRAY[type].forEach((tag, index) => {
          if (tag.def) {
            mal.settings.tags[type].push(tag.id);
          }
          if (tag.has_prefix) {
            mal.settings.prefix[type][tag.id] = tag.prefix;
          }
          mal.settings.order[type][tag.id] = index + 1;
        });
      });
    },

    update: () => {
      mal.settings.body.empty();

      const table = $('<table class="tu_table" border="0" cellpadding="0" cellspacing="0" width="100%">' +
                      '<thead><tr>' +
                          '<th>Anime Tags <span>(Order / Prefix / Status)</span></th>' +
                          '<th>Manga Tags <span>(Order / Prefix / Status)</span></th>' +
                      '</tr></thead></table>');
      const tbody = $('<tbody>').appendTo(table);

      const reTags = {
        anime: new RegExp('^(' + mal.settings.tags.anime.join('|') + ')$'),
        manga: new RegExp('^(' + mal.settings.tags.manga.join('|') + ')$')
      };

      const maxLength = Math.max(TAGS_ARRAY.anime.length, TAGS_ARRAY.manga.length);
      for (let i = 0; i < maxLength; i += 1) {
        const tr = $('<tr>').appendTo(tbody);

        ['anime', 'manga'].forEach((type) => {
          if (i < TAGS_ARRAY[type].length) {
            const tag = TAGS_ARRAY[type][i];
            const mapOrder = mal.settings.order[type];
            const mapPrefix = mal.settings.prefix[type];

            const el = $('<div class="tu_checkbox">')
              .append('<input type="number" min="0" max="999">')
              .append('<input type="text" value="">')
              .append('<input name="tu_cb' + type[0] + '_' + tag.id +
                            '" id="tu_cb' + type[0] + '_' + tag.id + '" type="checkbox">')
              .append('<label for="tu_cb' + type[0] + '_' + tag.id + '">' + tag.text + '</label>');

            $('input[type=number]', el).val(mapOrder.hasOwnProperty(tag.id) ? mapOrder[tag.id] : 0);
            $('input[type=checkbox]', el).prop('checked', tag.id.toString().match(reTags[type]));

            const prefix = $('input[type=text]', el);
            if (tag.has_prefix) {
              prefix.val(mapPrefix.hasOwnProperty(tag.id) ? mapPrefix[tag.id] : '');
            } else {
              prefix.prop('disabled', true);
            }

            $('<td>').append(el).appendTo(tr);
          } else {
            $('<td>').appendTo(tr);
          }
        });
      }

      const ajax = $('<div class="tu_ajax">')
        .append('<label>Requests Delay (ms):</label>')
        .append('<input id="tu_ajax_delay" type="number" min="100" max="99999">');

      $('input[id^="tu_ajax_"]', ajax).each(function () {
        const id = this.id.match(/[^_]+$/)[0];
        $(this).val(mal.settings.ajax[id] || AJAX[id]);
        $(this).attr('placeholder', AJAX[id]);
      });

      const status = $('<div class="tu_status">');
      ['anime', 'manga'].forEach((type) => {
        status.append('<label>Filter Entries:</label>');
        $('<select id="tu_status_' + type + '">')
          .append('<option value="' + T_STATUS.ALL + '">All ' + type.replace(/^a/, 'A').replace(/^m/, 'M') + '</option>')
          .append('<option value="' + T_STATUS.IN_PROGRESS + '">' + (type === 'anime' ? 'Watching' : 'Reading') + '</option>')
          .append('<option value="' + T_STATUS.COMPLETED + '">Completed</option>')
          .append('<option value="' + T_STATUS.ON_HOLD + '">On-Hold</option>')
          .append('<option value="' + T_STATUS.DROPPED + '">Dropped</option>')
          .append('<option value="' + T_STATUS.PLAN_TO + '">Plan to ' + (type === 'anime' ? 'Watch' : 'Read') + '</option>')
          .val(mal.settings.status[type])
          .change(function () {
            mal.settings.status[type] = parseInt($(this).val() || T_STATUS.ALL);
          })
          .appendTo(status);
      });

      const buttons = $('<div class="tu_buttons">')
        .append($('<input class="tu_button" value="Save" type="button">').click(() => {
          ['anime', 'manga'].forEach((type) => {
            mal.settings.tags[type] = [];
            mal.settings.order[type] = {};

            $('input[type=checkbox][id^="tu_cb' + type[0] + '_"]', mal.settings.body).each(function () {
              const id = this.id.match(/\d+/)[0];
              if ($(this).prop('checked')) {
                mal.settings.tags[type].push(id);
              }

              let order = parseInt($(this).parent().find('input[type=number]').val()) || 0;
              order = Math.max(order, 0);
              order = Math.min(order, 999);
              mal.settings.order[type][id] = order;

              const prefix = $(this).parent().find('input[type=text]').val();
              mal.settings.prefix[type][id] = prefix.replace(/^\s+$/, '');
            });

            $('input[id^="tu_ajax_"]', mal.settings.body).each(function () {
              const id = this.id.match(/[^_]+$/)[0];
              mal.settings.ajax[id] = parseInt($(this).val()) || AJAX[id];
            });
          });

          mal.settings.save();
          mal.fancybox.close();
        }))
        .append($('<input class="tu_button" value="Cancel" type="button">').click(() => {
          mal.fancybox.close();
        }))
        .append($('<input class="tu_button" value="Reset" type="button">').click(() => {
          mal.settings.reset();
          mal.settings.save();
          mal.fancybox.close();
        }));

      mal.settings.body
        .append('<div class="tu_title">Tags Settings</div>')
        .append($('<div class="tu_table_div">')
          .append(table)
          .append(ajax)
          .append(status)
        )
        .append(buttons);
    }
  };

  const formatProducers = (str) => {
    return String(str)
      .replace(/None\sfound,\s<a\shref="[^"]*?\/dbchanges\.php\?[^>]*?>add\ssome<\/a>\.?/i, '')
      .replace(/<sup>[\s\S]*?<\/sup>/g, '')
      .replace(/,/g, '')
      .replace(/<\/a>\s*?<a/g, '</a>, <a');
  };

  const getTagsFromDuration = (type, duration) => {
    const reSec = duration.match(/(\d+)\ssec./)
    const reMin = duration.match(/(\d+)\smin./);
    const reHour = duration.match(/(\d+)\shr./);

    duration = reHour ? (parseInt(reHour[1]) * 60 * 60) : 0;
    duration += reMin ? (parseInt(reMin[1]) * 60) : 0;
    duration += reSec ? (parseInt(reSec[1])) : 0;

    if (type.match(/(Music|Unknown)/) || duration <= 0) {
      return '';
    }
    if (duration > (32*60) && !type.match('Movie')) {
      return 'Long-ep';
    }
    if (duration < (10*60)) {
      return 'Short-ep';
    }
    if (duration <= (16*60)) {
      return 'Half-ep';
    }

    return '';
  };

  const getDateFromString = (str) => {
    const result = {
      year: '',
      year_short: '',
      season: '',
      season_short: '',
      period: '',
      period_short: ''
    };
    const date = str.replace(/to(.*)$/, '').trim();
    const mYear = date.match(/\d{4}/);
    const mMonth = date.match(/^[a-zA-Z]{3}/);

    if (!mYear) {
      return result;
    }

    result.year = mYear[0];
    result.year_short = result.year.replace(/(\d\d)(\d\d)$/, '$2');

    if (mMonth) {
      result.season = mMonth[0]
        .replace(/^(Jan|Feb|Mar)$/i, 'Winter')
        .replace(/^(Apr|May|Jun)$/i, 'Spring')
        .replace(/^(Jul|Aug|Sep)$/i, 'Summer')
        .replace(/^(Oct|Nov|Dec)$/i, 'Fall');
      result.season += ' ' + result.year;
      result.season_short = result.season.replace(/(\d\d)(\d\d)$/, '$2');
    }

    const years = [
      [1917, 1959], [1960, 1979], [1980, 1989], [1990, 1999], [2000, 2004],
      [2005, 2009], [2010, 2014], [2015, 2019], [2020, 2024], [2025, 2029]
    ];
    for (let i = years.length - 1; i >= 0; i -= 1) {
      if (result.year >= years[i][0] && result.year <= years[i][1]) {
        result.period = years[i][0] + '-' + years[i][1];
        result.period_short = result.period.replace(/(\d\d)(\d\d)/g, '$2');
        break;
      }
    }

    return result;
  };

  const getTags = (data) => {
    const result = [];
    const reTags = new RegExp('^(' + mal.settings.tags[mal.type].join('|') + ')$');

    let re = data.match(/<div\sid="editdiv"([\s\S]*?)<h2>Information<\/h2>([\s\S]*?)<h2>Statistics<\/h2>([\s\S]*?)<\/td>/);
    if (!re) {
      return null;
    }

    const titles = re[1];
    const info = re[2];
    const stats = re[3];

    re = info.match(/[\s\S]*?>(Aired|Published):<\/span>([\s\S]*?)<\/div>/);
    const date = re ? getDateFromString(re[2]) : null;
    const textarea = $('<textarea>');
    const mapPrefix = mal.settings.prefix[mal.type];

    TAGS_ARRAY_SORTED[mal.type].forEach((tag) => {
      if (!tag.id.toString().match(reTags)) {
        return;
      }

      const prefix = tag.has_prefix ? (mapPrefix.hasOwnProperty(tag.id) ? mapPrefix[tag.id] : '') : '';

      switch (tag.id) {
        case T_.JAPANESE:
        case T_.ENGLISH:
          if (tag.id === T_.JAPANESE) {
            re = titles.match(/[\s\S]*?>Japanese:<\/span>([\s\S]*?)<\/div>/);
          } else {
            re = titles.match(/[\s\S]*?>English:<\/span>([\s\S]*?)<\/div>/);
          }
          if (re) {
            textarea.html(re[1].trim());
            re = textarea.val();
            if (re.length > 0) {
              result.push(prefix + re);
            }
          }
          break;

        case T_.TYPE:
          re = info.match(/[\s\S]*?>Type:<\/span>([\s\S]*?)<\/div>/);
          textarea.html(re ? re[1].trim() : '<a>N/A</a>');
          re = textarea.val().trim()
            .replace('Unknown', 'N/A')
            .replace(/<[^>]*?>/g, '');
          if (re !== 'N/A' || prefix.length > 0) {
            result.push(prefix + re);
          }
          break;

        case T_.GENRES:
          if (mal.type === 'anime') {
            re = info.match(/[\s\S]*?>Genres:<\/span>([\s\S]*?)<\/div>[\s\S]*?>Rating:<\/span>([\s\S]*?)(\s-|None)/);
          } else {
            re = info.match(/[\s\S]*?>Genres:<\/span>([\s\S]*?)<\/div>/);
          }
          if (re) {
            $(re[1].replace('No genres have been added yet.', '')).filter('a[title]').each(function () {
              result.push($(this).text());
            });
            if (mal.type === 'anime' && re[2].match('Rx')) {
              result.push('Hentai');
            }
          }
          break;

        case T_.STUDIOS:
          re = info.match(/[\s\S]*?>Studios:<\/span>([\s\S]*?)<\/div>/);
          if (re) {
            result.push($(formatProducers(re[1])).text());
          }
          break;

        case T_.LICENSORS:
          re = info.match(/[\s\S]*?>Licensors:<\/span>([\s\S]*?)<\/div>/);
          if (re) {
            result.push($(formatProducers(re[1])).text());
          }
          break;

        case T_.PRODUCERS:
          re = info.match(/[\s\S]*?>Producers:<\/span>([\s\S]*?)<\/div>/);
          if (re) {
            result.push($(formatProducers(re[1])).text());
          }
          break;

        case T_.AUTHORS:
          re = info.match(/[\s\S]*?>Authors:<\/span>([\s\S]*?)<\/div>/);
          if (re) {
            re = $(re[1]
              .replace(/,/g, '')
              .replace(/\((Art|Story|Story\s&\sArt)\)/g, '')
              .replace(/<\/a>\s*?<a/g, '</a>, <a')
            ).text();
            if (re.length > 0) {
              result.push(prefix + re);
            }
          }
          break;

        case T_.SERIALIZATION:
          re = info.match(/[\s\S]*?>Serialization:<\/span>([\s\S]*?)<\/div>/);
          if (re) {
            re = $(re[1].replace(/None\s*?$/, '<a>N/A</a>')).text().trim();
            if (re !== 'N/A' || prefix.length > 0) {
              result.push(prefix + re);
            }
          }
          break;

        case T_.DURATION:
          re = info.match(/[\s\S]*?>Type:<\/span>([\s\S]*?)<\/div>[\s\S]*?>Duration:<\/span>([\s\S]*?)<\/div>/);
          if (re) {
            re = getTagsFromDuration(re[1], re[2]);
            if (re.length > 0) {
              result.push(prefix + re);
            }
          }
          break;

        case T_.RATING:
        case T_.JRATING:
          re = info.match(/[\s\S]*?>Rating:<\/span>([\s\S]*?)(\s-|None)/);
          re = re ? re[1].trim().replace(/^\s*?$/, 'N/A') : 'N/A';
          if (tag.id === T_.JRATING) {
            re = re
              .replace(/^PG$/, 'G')
              .replace(/^PG-13$/, 'PG-12')
              .replace(/^(R|R\+)$/, 'R-15')
              .replace(/^Rx$/, 'R-18');
          }
          if (re !== 'N/A' || prefix.length > 0) {
            result.push(prefix + re);
          }
          break;

        case T_.STATUS:
          re = info.match(/[\s\S]*?>Status:<\/span>([\s\S]*?)<\/div>/);
          re = re ? re[1].trim()
            .replace('Finished Airing', 'Finished')
            .replace('Currently Airing', 'Airing') : 'N/A';
          if (re !== 'N/A' || prefix.length > 0) {
            result.push(prefix + re);
          }
          break;

        case T_.BROADCAST:
          re = info.match(/[\s\S]*?>Broadcast:<\/span>([\s\S]*?)<\/div>/);
          if (re) {
            re = re[1].trim()
              .replace(/s\s[\s\S]*?$/, '')
              .replace('Unknown', 'N/A');
            if (re !== 'N/A' || prefix.length > 0) {
              result.push(prefix + re);
            }
          }
          break;

        case T_.SOURCE:
          re = info.match(/[\s\S]*?>Source:<\/span>([\s\S]*?)<\/div>/);
          if (re) {
            re = re[1].trim().replace('Unknown', 'N/A');
            if (re !== 'N/A' || prefix.length > 0) {
              result.push(prefix + re);
            }
          }
          break;

        case T_.YEAR:
        case T_.YEAR_SHORT:
        case T_.PERIOD:
        case T_.PERIOD_SHORT:
          if (date) {
            switch (tag.id) {
              case T_.YEAR:
                re = date.year;
                break;
              case T_.YEAR_SHORT:
                re = date.year_short;
                break;
              case T_.PERIOD:
                re = date.period;
                break;
              case T_.PERIOD_SHORT:
                re = date.period_short;
                break;
            }
            if (re.length > 0) {
              result.push(prefix + re);
            }
          }
          break;

        case T_.SEASON:
        case T_.SEASON_SHORT:
          re = info.match(/[\s\S]*?>Premiered:<\/span>[^<]*?<a\shref=[^>]+?>([\s\S]*?)<\/a>[^<]*?<\/div>/);
          if (re && re[1].match(/(Winter|Spring|Summer|Fall)\s\d{4}/)) {
            re = tag.id === T_.SEASON ? re[1].trim() : re[1].trim().replace(/(\d\d)(\d\d)$/, '$2');
            result.push(prefix + re);
          } else if (date) {
            re = tag.id === T_.SEASON ? date.season : date.season_short;
            if (re.length > 0) {
              result.push(prefix + re);
            }
          }
          break;

        case T_.SCORE:
        case T_.RND_SCORE:
          re = stats.match(/itemprop="ratingValue">([\d.]+?)<\/span>/);
          re = re ? (tag.id === T_.RND_SCORE ? Math.round(re[1]) : re[1]) : 'N/A';
          if (re !== 'N/A' || prefix.length > 0) {
            result.push(prefix + re);
          }
          break;

        case T_.RANK:
          re = stats.match(/[\s\S]*?>Ranked:<\/span>\s*?#(\d+?)\s*?</);
          re = re ? re[1] : 'N/A';
          if (re !== 'N/A' || prefix.length > 0) {
            result.push(prefix + re);
          }
          break;

        case T_.POPULARITY:
          re = stats.match(/[\s\S]*?>Popularity:<\/span>\s*?#(\d+?)\s*?</);
          re = re ? re[1] : 'N/A';
          if (re !== 'N/A' || prefix.length > 0) {
            result.push(prefix + re);
          }
          break;

        case T_.MEMBERS:
          re = stats.match(/[\s\S]*?>Members:<\/span>\s*?([\d,]+?)\s*?</);
          re = re ? re[1].replace(',', '') : 'N/A';
          if (re !== 'N/A' || prefix.length > 0) {
            result.push(prefix + re);
          }
          break;

        case T_.FAVORITES:
          re = stats.match(/[\s\S]*?>Favorites:<\/span>\s*?([\d,]+?)\s*?</);
          re = re ? re[1].replace(',', '') : 'N/A';
          if (re !== 'N/A' || prefix.length > 0) {
            result.push(prefix + re);
          }
          break;
      }
    });

    return result;
  };

  const setTags = async (id, tags) => {
    if (!tags) {
      throw id;
    }

    const cache = {};
    tags = $.map(tags.join(',').split(','), (tag) => {
      return tag.trim().replace(/'/g, '’').replace(/\s+/g, ' ');
    }).filter((tag) => {
      if (tag.length === 0 || cache.hasOwnProperty(tag)) {
        return false;
      } else {
        cache[tag] = true;
        return true;
      }
    }).join(', ');

    while (tags.length > TAGS_CHAR_MAX) {
      tags = tags.replace(/,(?!.*,).*$/, '');
    }

    if (mal.page === T_PAGE.M_POPUP) {
      $('textarea#add_' + mal.type + '_tags').prop('value', tags);
    } else {
      if (tags === '') {
        try {
          await $.when($.ajax({
            type: 'POST',
            url: mal.tagsUrl,
            data: mal.type[0] + 'id=' + id,
            dataType: 'text'
          }));
        } catch (e) {
          return Promise.reject(id);
        }
      } else {
        mal.tags[id] = tags;
      }
    }
  };

  const updateTags = async (id, mode) => {
    try {
      let tags = [];
      if (mode !== T_RUN.M_CLEAR) {
        const response = await fetch('/' + mal.type + '/' + id + '/_/news');
        if (!response.ok) {
          throw id;
        }
        tags = getTags(await response.text());
      }
      return await setTags(id, tags);
    } catch (e) {
      return Promise.reject(id);
    }
  };

  const updateAllTags = async (username, mode) => {
    if (mal.page !== T_PAGE.M_LIST || mal.entries.updating) {
      return;
    }

    mal.tags = {};

    if (mal.page === T_PAGE.M_LIST) {
      mal.content.stage.html('&nbsp;&nbsp;[1/3]');
      mal.content.done.html('&nbsp;&nbsp;Loading...');
      mal.content.fail.empty();
    }

    mal.entries.updating = true;
    mal.entries.total = 0;
    mal.entries.done = 0;
    mal.entries.fail = 0;

    if (mal.settings.tags[mal.type].length === 0) {
      mode = T_RUN.M_CLEAR;
    }

    await (new MalData(username, mal.type, 300, mal.settings.ajax.delay)).populate(mal.settings.status[mal.type], {
      onFinish: async (data) => {
        const keys = Object.keys(data);
        mal.entries.total = keys.length;

        if (mal.entries.total === 0) {
          if (mal.page === T_PAGE.M_LIST) {
            mal.content.stage.html('&nbsp;&nbsp;[3/3]&nbsp;&nbsp;Finished');
            mal.content.done.empty();
          }
          return;
        } else {
          if (mal.page === T_PAGE.M_LIST) {
            mal.content.stage.html('&nbsp;&nbsp;[2/3]');
            mal.content.done.html('&nbsp;&nbsp;Done: ' + mal.entries.done + '/' + mal.entries.total);
          }
        }

        const ids = [];
        keys.forEach((id) => {
          const entry = data[id];
          if ((mode === T_RUN.M_EMPTY && entry.tags !== '') ||
              (mode === T_RUN.M_CLEAR && entry.tags === '')) {
            mal.entries.done += 1;
          } else {
            ids.push(id);
          }
          delete data[id];
        });

        while (ids.length > 0) {
          const id = ids.shift();
          try {
            for (let trycnt = 10; trycnt > 0; trycnt -= 1) {
              try {
                await sleep(mal.settings.ajax.delay);
                await updateTags(id, mode);
                break;
              } catch (e) {
                if (trycnt <= 1) {
                  throw e;
                }
              }
            }

            if (mal.page === T_PAGE.M_LIST) {
              mal.entries.done += 1;
              mal.content.done.html('&nbsp;&nbsp;Done: ' + mal.entries.done + '/' + mal.entries.total);
            }
          } catch (e) {
            await sleep(mal.settings.ajax.delay);
            await setTags(id, []).catch(() => {});

            if (mal.page === T_PAGE.M_LIST) {
              mal.entries.fail += 1;
              mal.content.fail.html('&nbsp;&nbsp;Failed: ' + mal.entries.fail);
              console.log('[2/3] failed ' + mal.type + ' id: ' + id);
            }
          }
        }

        mal.entries.updating = false;
        if (mal.page !== T_PAGE.M_LIST) {
          return;
        }

        const tags = Object.keys(mal.tags);
        mal.entries.total = tags.length + mal.entries.fail;
        mal.entries.done = 0;

        if (tags.length === 0) {
          mal.content.stage.html('&nbsp;&nbsp;[3/3]&nbsp;&nbsp;Finished');
          mal.content.done.empty();
          return;
        } else {
          mal.content.stage.html('&nbsp;&nbsp;[3/3]');
          mal.content.done.html('&nbsp;&nbsp;Done: ' + mal.entries.done + '/' + mal.entries.total);
        }

        while (tags.length > 0) {
          const id = tags.shift();
          try {
            await sleep(mal.settings.ajax.delay);
            let data = await $.when($.ajax({
              type: 'POST',
              url: mal.tagsUrl + encodeURIComponent(mal.tags[id]),
              data: mal.type[0] + 'id=' + id,
              dataType: 'text'
            }));

            if (!mal.modern && $('#list_surround .table_header[width="125"]').length > 0) {
              data = data.replace(/[?&]status=\d/g, '').replace(/&tag=/g, mal.status + '&tag=');
              $('#list_surround #tagLinks' + id).html(data);
              $('#list_surround #tagRow' + id).text($(data).text());
            }
            mal.entries.done += 1;
            mal.content.done.html('&nbsp;&nbsp;Done: ' + mal.entries.done + '/' + mal.entries.total);
          } catch (e) {
            await sleep(mal.settings.ajax.delay);
            await setTags(id, []).catch(() => {});

            mal.entries.fail += 1;
            mal.content.fail.html('&nbsp;&nbsp;Failed: ' + mal.entries.fail);
            console.log('[3/3] failed ' + mal.type + ' id: ' + id);
          }
        }
      },

      onNext: (count) => {
        mal.content.done.html('&nbsp;&nbsp;Loading: ' + count);
      },

      onError: () => {
        mal.content.done.empty();
        mal.content.fail.html('&nbsp;&nbsp;Failed');
        mal.entries.total = 0;
        mal.entries.done = 0;
        mal.entries.fail = 0;
      }
    }, [ 'tags' ]);

    mal.entries.updating = false;
  };

  if ($('#malLogin').length === 0 && $('a[href$="/login.php"]').length === 0) {
    mal.settings.load();
    mal.modern = false;

    if (mal.page === T_PAGE.M_LIST) {
      mal.type = document.URL.match(/^https?:\/\/myanimelist\.net\/(anime|manga)list\//)[1];
      mal.modern = $('.header .header-menu .btn-menu > span.username').length > 0;

      let el;
      let username;

      if (mal.modern) {
        if ($('.header .header-info').length === 0) {
          $('.header .header-menu').addClass('other').append('<div class="header-info">');
        }
        el = $('.header .header-info');
        username = $('.list-menu-float .icon-menu.profile').prop('href').match(/\/profile\/(.*)$/)[1];
        mal.status = $('.status-menu-container .status-menu .status-button.on').prop('href').match(/[?&]status=\d/)[0];
        mal.fancybox.init('.list-container');
      } else {
        if (!$('#mal_cs_otherlinks div:first strong').text().match('You are viewing your')) {
          return;
        }
        el = $('<span id="tu_links">').appendTo('#mal_cs_otherlinks div:last');
        username = $('#mal_cs_listinfo strong a strong').text();
        mal.status = $('.status_selected a').prop('href').match(/[?&]status=\d/)[0];
        mal.fancybox.init('#list_surround');
      }

      mal.fancybox.body.append(mal.settings.body);

      el.append((mal.modern ? '' : '&nbsp;|') + '&nbsp;&nbsp;Update Tags: ')
        .append($('<a href="javascript:void(0);" title="Update all tags">All</a>').click(() => {
          if (mal.entries.updating || mal.entries.done + mal.entries.fail < mal.entries.total) {
            alert('Updating in process!');
          } else if (confirm('Are you sure you want to update all tags?')) {
            updateAllTags(username, T_RUN.M_FULL);
          }
        }))
        .append(',&nbsp;')
        .append($('<a href="javascript:void(0);" title="Update only empty tags">Empty</a>').click(() => {
          if (mal.entries.updating || mal.entries.done + mal.entries.fail < mal.entries.total) {
            alert('Updating in process!');
          } else if (confirm('Are you sure you want to update empty tags?')) {
            updateAllTags(username, T_RUN.M_EMPTY);
          }
        }))
        .append('&nbsp;-&nbsp;')
        .append($('<a href="javascript:void(0);" title="Clear all tags">Clear</a>').click(() => {
          if (mal.entries.updating || mal.entries.done + mal.entries.fail < mal.entries.total) {
            alert('Updating in process!');
          } else if (confirm('Are you sure you want to clear all tags?')) {
            updateAllTags(username, T_RUN.M_CLEAR);
          }
        }))
        .append('&nbsp;-&nbsp;')
        .append($('<a href="javascript:void(0);" title="Change Tags Updater settings">Settings</a>').myfancybox(() => {
          mal.settings.update();
          mal.settings.body.show();
          return true;
        }))
        .append(mal.content.stage)
        .append(mal.content.done)
        .append(mal.content.fail);

      $('<style type="text/css">').html(
        'div#tu_fancybox_wrapper { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background: rgba(102, 102, 102, 0.3); z-index: 99990; }' +
        'div#tu_fancybox_inner { width: 600px !important; height: 730px !important; overflow: hidden; color: #000; }' +
        'div#tu_fancybox_outer { position: absolute; display: block; width: auto; height: auto; padding: 10px; border-radius: 8px; top: 80px; left: 50%; margin-top: 0 !important; margin-left: -310px !important; background: #fff; box-shadow: 0 0 15px rgba(32, 32, 32, 0.4); z-index: 99991; }' +
        'div#tu_settings { width: 100%; height: 100%; text-align: center; padding: 40px 0 35px; box-sizing: border-box; }' +
        'div#tu_settings .tu_title { position: absolute; top: 10px; left: 10px; width: 600px; font-size: 16px; font-weight: normal; text-align: center; margin: 0; border: 0; }' +
        'div#tu_settings .tu_title:after { content: ""; display: block; position: relative; width: 100%; height: 8px; margin: 0.5em 0 0; padding: 0; border-top: 1px solid #ebebeb; background: center bottom no-repeat radial-gradient(#f6f6f6, #fff 70%); background-size: 100% 16px; }' +
        'div#tu_settings .tu_table_div { width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; border: 1px solid #eee; box-sizing: border-box; }' +
        'div#tu_settings .tu_table thead { background-color: #f5f5f5; }' +
        'div#tu_settings .tu_table th { background-color: transparent; width: 50%; padding: 5px 0 5px 5px; color: #222; font-size: 13px; font-weight: bold; text-align: left; line-height: 20px !important; box-shadow: none; }' +
        'div#tu_settings .tu_table th > span { font-size: 11px; font-weight: normal; }' +
        'div#tu_settings .tu_table tbody { background-color: #fff; }' +
        'div#tu_settings .tu_table td { text-align: left !important; }' +
        'div#tu_settings .tu_table .tu_checkbox { font-size: 12px; }' +
        'div#tu_settings .tu_table .tu_checkbox > * { vertical-align: middle; }' +
        'div#tu_settings .tu_table .tu_checkbox > input[type=number], div#tu_settings .tu_table .tu_checkbox > input[type=text] { width: 40px !important; margin: 1px 2px 1px 5px !important; padding: 2px 0 1px 2px !important; border: 1px solid #bbb !important; font-size: 11px !important; }' +
        'div#tu_settings .tu_table .tu_checkbox > input[type=text] { width: 70px !important; margin: 1px 2px !important; text-align: right; }' +
        'div#tu_settings .tu_table .tu_checkbox > input[type=checkbox] + label { font-weight: normal; color: #666; }' +
        'div#tu_settings .tu_table .tu_checkbox > input[type=checkbox]:checked + label { font-weight: bold; color: #222; }' +
        'div#tu_settings .tu_ajax, div#tu_settings .tu_status { width: 100%; text-align: center; margin: 8px 0 4px; border: 0; }' +
        'div#tu_settings .tu_ajax > *, div#tu_settings .tu_status > * { vertical-align: middle; font-size: 12px; font-weight: normal; margin: 0 6px; }' +
        'div#tu_settings .tu_ajax > label, div#tu_settings .tu_status > label { padding-top: 1px !important; }' +
        'div#tu_settings .tu_ajax > input, div#tu_settings .tu_status > select { width: 70px !important; margin-left: 0 !important; padding: 2px 0 1px 2px !important; border: 1px solid #bbb !important; font-size: 11px !important; }' +
        'div#tu_settings .tu_status > select { width: 100px !important; }' +
        'div#tu_settings .tu_buttons { position: absolute; bottom: 10px; width: 600px; text-align: center; padding: 0; }' +
        'div#tu_settings .tu_buttons > .tu_button { margin: 2px 5px !important; font-size: 12px; }'
      ).appendTo('head');
    } else {
      mal.type = document.URL.match(/(\?go=(add|edit)&|\?type=anime&|ownlist\/anime\/)/) ? 'anime' : 'manga';

      const id = $('#main-form > table td.borderClass:contains(Title) + td > strong > a').prop('href').match(/\d+/)[0];
      $('#main-form > table.advanced td.borderClass:contains(Tags)').append('&nbsp;').append(
        $('<a href="javascript:void(0)">').click(() => {
          updateTags(id, T_RUN.M_FULL);
        })
          .append('<small>update</small>')
      );
    }

    mal.tagsUrl = '/includes/ajax.inc.php?' + (mal.type === 'anime' ? 't=22' : 't=30') + '&tags=';
  }
}(jQuery));