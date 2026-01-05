// ==UserScript==
// @name        MyAnimeList (MAL) Track Missing Relations
// @namespace   https://greasyfork.org/users/7517
// @description Allows to find missing relations and entries with wrong episode/chapter count
// @icon        http://i.imgur.com/b7Fw8oH.png
// @version     9.0.2
// @author      akarin
// @include     /^https?:\/\/myanimelist\.net\/profile/
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/9261/MyAnimeList%20%28MAL%29%20Track%20Missing%20Relations.user.js
// @updateURL https://update.greasyfork.org/scripts/9261/MyAnimeList%20%28MAL%29%20Track%20Missing%20Relations.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  if ($('#malLogin').length > 0) {
    return;
  }

  const mal = {
    title: 'Missing Relations',
    name: '',
    type: 'anime',
    forceUpdate: false,
    forceFrom: 0,
    forceTo: 0
  };

  const USER_STATUS = {
    IN_PROCESS: 1, COMPLETED: 2, ON_HOLD: 3, DROPPED: 4, PLAN_TO: 6
  };

  const SERIES_STATUS = {
    IN_PROCESS: 1, COMPLETED: 2, NOT_YET: 3
  };

  const OPTS = {
    CACHE_VERSION: '8.3',
    EXPAND_LONG: 100,
    EXPAND_LONG_R: 101,
    HIDE_NOTYET: 102,
    HIDE_AIRING: 103
  };

  class Cache {
    constructor (name, username) {
      this.name = name;
      this.username = username;
      this.objects = {
        left: true,
        graph: false,
        title: false,
        airing: false,
        status: true,
        wrong: true,
        hidden: true
      };
      this.data = {};
      this.init();
    }

    init (id) {
      id = parseInt(id);
      Object.keys(this.objects).forEach(obj => {
        if (isNaN(id)) {
          this.data[obj] = {};
        } else {
          delete this.data[obj][id];
        }
      });
    }

    load (obj) {
      if (obj == null) {
        Object.keys(this.objects).forEach(obj => this.load(obj));
      } else {
        this.data[obj] = this.loadValue('mal.entries.' + obj, this.data[obj], mal.type, this.objects[obj]);
      }
    }

    save (obj) {
      if (obj == null) {
        Object.keys(this.objects).forEach(obj => this.save(obj));
      } else {
        this.saveValue('mal.entries.' + obj, this.data[obj], mal.type, this.objects[obj]);
      }
    }

    clear (id) {
      const hidden = Object.prototype.hasOwnProperty.call(this.data, 'hidden') ? this.data.hidden : {};
      this.init(id);
      this.data.hidden = hidden;
    }

    encodeKey (key, type, userobj) {
      const username = userobj === true ? this.username : '';
      return this.name + '#' + OPTS.CACHE_VERSION + '#' + username + '#' + type + '#' + key;
    }

    loadValue (key, value, type, userobj) {
      try {
        let result = JSON.parse(localStorage.getItem(this.encodeKey(key, type, userobj)));
        if (result == null) {
          result = JSON.parse(localStorage.getItem(this.encodeKey(key, type, !userobj)));
          if (result != null) {
            console.log(`Migrate cache key "${key}"`);
            this.clearValue(key, type, !userobj);
            this.saveValue(key, result, type, userobj);
          }
        }
        return result == null ? value : result;
      } catch (err) {
        console.error(err);
        return value;
      }
    }

    saveValue (key, value, type, userobj) {
      localStorage.setItem(this.encodeKey(key, type, userobj), JSON.stringify(value));
    }

    clearValue (key, type, userobj) {
      localStorage.removeItem(this.encodeKey(key, type, userobj));
    }

    export (type) {
      const json = {};
      Object.keys(this.objects).forEach(obj => {
        json[obj] = this.loadValue('mal.entries.' + obj, {}, type, this.objects[obj]);
      });
      return json;
    }

    import (type, json) {
      if (json !== Object(json)) {
        return;
      }
      Object.keys(this.objects).forEach(obj => {
        this.saveValue('mal.entries.' + obj, json[obj], type, this.objects[obj]);
      });
    }
  }

  class MalData {
    constructor (username, type, offset) {
      this.username = username;
      this.type = type;
      this.offset = offset;
      this.running = false;
      this.data = {};
      this.size = 0;
    }

    clear () {
      this.running = false;
      this.data = {};
      this.size = 0;
    }

    load (callbacks, filter, offset) {
      if (!this.running) {
        return;
      }

      const hasFilter = Array.isArray(filter) && filter.length > 0;

      $.ajax({
        url: '/' + this.type + 'list/' + this.username + '/load.json?status=7&offset=' + offset,
        dataType: 'json'
      })
        .done((data) => {
          if (Array.isArray(data) && data.length > 0) {
            data.forEach((entry) => {
              this.data[entry[this.type + '_id']] = hasFilter ? Object.keys(entry)
                .filter(key => filter.includes(key))
                .reduce((obj, key) => {
                  obj[key] = entry[key];
                  return obj;
                }, {}) : entry;
            });

            this.size += data.length;
            if (Object.prototype.hasOwnProperty.call(callbacks, 'onNext')) {
              callbacks.onNext(this.size);
            }

            this.load(callbacks, filter, offset + this.offset);
          } else {
            this.running = false;
            if (Object.prototype.hasOwnProperty.call(callbacks, 'onFinish')) {
              callbacks.onFinish(Object.assign({}, this.data));
            }
            this.clear();
          }
        })
        .fail(() => {
          this.clear();
          if (Object.prototype.hasOwnProperty.call(callbacks, 'onError')) {
            callbacks.onError();
          }
        });
    }

    populate (callbacks, filter) {
      if (this.running) {
        return;
      }

      this.clear();
      this.running = true;
      this.load(callbacks, filter, 0);
    }
  }

  function toHtmlId (str) {
    return String(str).trim().toLowerCase().replace(/\s/g, '_').replace(/[^\w]/g, '_');
  }

  function toHtmlStr (str) {
    return String(str).trim().replace(/"/g, '&quot;');
  }

  mal.settings = {
    ajaxDelay: 3000,
    windowWidth: 700,
    windowHeight: 820,
    footerHeight: 88,
    footerSwitchHeight: 8,

    availableRelations: [
      'Alternative Setting', 'Alternative Version', 'Character', 'Full Story', 'Other',
      'Parent Story', 'Prequel', 'Sequel', 'Side Story', 'Spin-off', 'Summary'
    ],
    availableStatus: {
      anime: ['Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'],
      manga: ['Reading', 'Completed', 'On-Hold', 'Dropped', 'Plan to Read']
    },
    otherSettings: {
      anime: [
        { id: OPTS.EXPAND_LONG, text: 'Expand long lists (both)', footer: true, def: false, val: false },
        { id: OPTS.EXPAND_LONG_R, text: 'Expand long lists (right)', footer: true, def: false, val: false },
        { id: OPTS.HIDE_NOTYET, text: 'Hide unaired entries (from your list)', footer: false, def: false, val: false },
        { id: OPTS.HIDE_AIRING, text: 'Hide airing entries (from your list)', footer: false, def: false, val: false }
      ],
      manga: [
        { id: OPTS.EXPAND_LONG, text: 'Expand long lists (both)', footer: true, def: false, val: false },
        { id: OPTS.EXPAND_LONG_R, text: 'Expand long lists (right)', footer: true, def: false, val: false },
        { id: OPTS.HIDE_NOTYET, text: 'Hide unpublished entries (from your list)', footer: false, def: false, val: false },
        { id: OPTS.HIDE_AIRING, text: 'Hide publishing entries (from your list)', footer: false, def: false, val: false }
      ]
    },

    excludedRelations: { anime: [], manga: [] },
    excludedStatus: {
      left: { anime: [], manga: [] },
      right: { anime: [], manga: [] }
    },

    load: function () {
      ['anime', 'manga'].forEach(function (type) {
        mal.settings.excludedRelations[type] = ['Adaptation'];
        mal.settings.availableRelations.forEach(function (val) {
          const id = 'mr_xr' + type[0] + '_' + toHtmlId(val);
          const flag = mal.cache.loadValue(id, 'false', 'global');
          if (flag === 'true' || flag === true) {
            mal.settings.excludedRelations[type].push(val);
          }
        });

        ['left', 'right'].forEach(function (status) {
          mal.settings.excludedStatus[status][type] = ['Empty Status'];
          mal.settings.availableStatus[type].forEach(function (val) {
            const id = 'mr_xs' + status[0] + type[0] + '_' + toHtmlId(val);
            const flag = mal.cache.loadValue(id, 'false', 'global');
            if (flag === 'true' || flag === true) {
              mal.settings.excludedStatus[status][type].push(val);
            }
          });
        });

        mal.settings.otherSettings[type].forEach(function (opt) {
          const id = 'mr_xo' + type[0] + '_' + opt.id;
          const flag = mal.cache.loadValue(id, opt.def === true ? 'true' : 'false', 'global');
          opt.val = (flag === 'true' || flag === true);
        });
      });
    },

    export: function (type) {
      const json = {};

      json.relations = {};
      mal.settings.availableRelations.forEach((val) => {
        const flag = mal.cache.loadValue('mr_xr' + type[0] + '_' + toHtmlId(val), 'false', 'global');
        json.relations[val] = (flag === 'true' || flag === true);
      });

      ['left', 'right'].forEach((status) => {
        json['hide_' + status] = {};
        mal.settings.availableStatus[type].forEach((val) => {
          const flag = mal.cache.loadValue('mr_xs' + status[0] + type[0] + '_' + toHtmlId(val), 'false', 'global');
          json['hide_' + status][val] = (flag === 'true' || flag === true);
        });
      });

      {
        const flag = mal.cache.loadValue('mr_xsr' + type[0] + '_empty_status', 'false', 'global');
        json.hide_right.empty_status = (flag === 'true' || flag === true);
      }

      json.other = {};
      mal.settings.otherSettings[type].forEach((opt) => {
        const flag = mal.cache.loadValue('mr_xo' + type[0] + '_' + opt.id, opt.def === true ? 'true' : 'false', 'global');
        json.other[opt.id] = (flag === 'true' || flag === true);
      });

      {
        const flag = mal.cache.loadValue('mr_xo' + type[0] + '_quick_settings', 'false', 'global');
        json.other.quick_settings = (flag === 'true' || flag === true);
      }

      return json;
    },

    import: function (type, json) {
      if (json !== Object(json)) {
        return;
      }

      {
        const key = 'relations';
        const keys = Object.prototype.hasOwnProperty.call(json, key) ? Object.keys(json[key]) : [];
        keys.forEach((val) => {
          const flag = json.relations[val] === true ? 'true' : 'false';
          mal.cache.saveValue('mr_xr' + type[0] + '_' + toHtmlId(val), flag, 'global');
        });
      }

      ['left', 'right'].forEach((status) => {
        const key = 'hide_' + status;
        const keys = Object.prototype.hasOwnProperty.call(json, key) ? Object.keys(json[key]) : [];
        keys.forEach((val) => {
          const flag = json['hide_' + status][val] === true ? 'true' : 'false';
          mal.cache.saveValue('mr_xs' + status[0] + type[0] + '_' + toHtmlId(val), flag, 'global');
        });
      });

      if (Object.prototype.hasOwnProperty.call(json, 'hide_right') && json.hide_right === Object(json.hide_right)) {
        const flag = json.hide_right.empty_status === true ? 'true' : 'false';
        mal.cache.saveValue('mr_xsr' + type[0] + '_empty_status', flag, 'global');
      }

      {
        const key = 'other';
        const keys = Object.prototype.hasOwnProperty.call(json, key) ? Object.keys(json[key]) : [];
        keys.forEach((id) => {
          const flag = json.other[id] === true ? 'true' : 'false';
          mal.cache.saveValue('mr_xo' + type[0] + '_' + id, flag, 'global');
        });
      }

      if (Object.prototype.hasOwnProperty.call(json, 'other') && json.other === Object(json.other)) {
        const flag = json.other.quick_settings === true ? 'true' : 'false';
        mal.cache.saveValue('mr_xo' + type[0] + '_quick_settings', flag, 'global');
      }
    },

    reset: function () {
      ['anime', 'manga'].forEach(function (type) {
        mal.settings.availableRelations.forEach(function (val) {
          mal.cache.saveValue('mr_xr' + type[0] + '_' + toHtmlId(val), 'false', 'global');
        });

        ['left', 'right'].forEach(function (status) {
          mal.settings.availableStatus[type].forEach(function (val) {
            mal.cache.saveValue('mr_xs' + status[0] + type[0] + '_' + toHtmlId(val), 'false', 'global');
          });
        });
        mal.cache.saveValue('mr_xsr' + type[0] + '_empty_status', 'false', 'global');

        mal.settings.otherSettings[type].forEach(function (opt) {
          opt.val = opt.def === true;
          mal.cache.saveValue('mr_xo' + type[0] + '_' + opt.id, opt.def === true ? 'true' : 'false', 'global');
        });
        mal.cache.saveValue('mr_xo' + type[0] + '_quick_settings', 'false', 'global');
      });
    }
  };

  $.fn.myfancybox = function (onstart) {
    return $(this).click(function () {
      mal.fancybox.show(onstart);
    });
  };

  mal.fancybox = {
    body: $('<div id="mr_fancybox_inner">'),
    outer: $('<div id="mr_fancybox_outer">'),
    wrapper: $('<div id="mr_fancybox_wrapper">'),

    init: function (el) {
      mal.fancybox.outer.hide().append(mal.fancybox.body).insertAfter(el);
      mal.fancybox.wrapper.hide().click(mal.fancybox.hide).insertAfter(el);
    },

    show: function (onstart) {
      mal.fancybox.body.children().hide();
      if (!onstart()) {
        mal.fancybox.hide();
        return;
      }
      mal.fancybox.wrapper.show();
      mal.fancybox.outer.show();
    },

    hide: function () {
      mal.fancybox.outer.hide();
      mal.fancybox.wrapper.hide();
    }
  };

  mal.entries = {
    status: {
      updating: false,
      total: 0,
      done: 0,
      fail: 0,
      skip: 0,

      clear: function () {
        mal.entries.status.total = 0;
        mal.entries.status.done = 0;
        mal.entries.status.fail = 0;
        mal.entries.status.skip = 0;
      }
    },

    updating: function (strict) {
      return (strict && mal.entries.status.updating) ||
            ((mal.entries.status.done + mal.entries.status.fail + mal.entries.status.skip) < mal.entries.status.total);
    },

    update: function (rescan) {
      let entrylist = [];
      let rightlist = [];
      const processed = {};
      const excludedRelationsRe = new RegExp('^(' + mal.settings.excludedRelations[mal.type].join('|') + ')$', 'i');

      function setRelations (idLeft, idRight) {
        [{ x: idLeft, y: idRight }, { x: idRight, y: idLeft }].forEach(function (rel) {
          const graph = mal.cache.data.graph[rel.x];
          if (!Array.isArray(graph)) {
            mal.cache.data.graph[rel.x] = [rel.y];
          } else if (!graph.includes(rel.y)) {
            graph.push(rel.y);
          }
        });
      }

      function getRelations (idLeft, data) {
        const graph = mal.cache.data.graph[idLeft];
        if (!Array.isArray(graph)) {
          mal.cache.data.graph[idLeft] = [];
        }

        $('#dialog .normal_header + form > br ~ div > small', data).each(function () {
          const val = $('input[id^="relationGen"]', this).val();
          if (!val.match(/^\d+\s\(/) || val.match(/^\d+\s\(\)$/)) {
            console.log(`Empty relation /${mal.type}/${idLeft}`);
            return;
          }

          const idRight = parseInt(val.match(/\d+/)[0]);
          if (!isNaN(idRight) && !$('select[name^="relationTypeId"] option:selected', this).text().match(excludedRelationsRe)) {
            setRelations(idLeft, idRight);
            if (processed[idRight] !== true && !rightlist.includes(idRight)) {
              rightlist.push(idRight);
            }
          }
        });
      }

      function loadRight () {
        if (mal.entries.updating(false)) {
          return;
        }

        rightlist = rightlist.filter(id => processed[id] !== true);

        mal.content.status.done = mal.entries.status.done;
        mal.content.status.fail = mal.entries.status.fail;
        mal.content.status.skip = mal.entries.status.skip;
        mal.content.status.total = mal.entries.status.total;

        mal.entries.status.clear();
        mal.entries.status.total = rightlist.length;
        mal.content.status.update();

        function fetchRight () {
          if (rightlist.length === 0) {
            mal.content.status.update();
            mal.content.list.update(true);
            return;
          }

          const id = parseInt(rightlist.shift());
          processed[id] = true;

          setTimeout(function () {
            $.ajax({
              url: '/dbchanges.php?' + mal.type[0] + 'id=' + id + '&t=relations',
              dataType: 'html'
            })
              .done(function (data) {
                mal.cache.data.title[id] = toHtmlStr($('#dialog .normal_header > a', data).text());
                const length = rightlist.length;
                getRelations(id, data);
                mal.entries.status.total += rightlist.length - length;
                mal.entries.status.done += 1;
                mal.content.status.update();
                fetchRight();
              })
              .fail(function () {
                console.log(`Failed to update /${mal.type}/${id}`);
                mal.entries.status.fail += 1;
                mal.content.status.update();
                fetchRight();
              });
          }, mal.settings.ajaxDelay);
        }

        fetchRight();
      }

      function loadLeft () {
        if (mal.entries.updating(false)) {
          return;
        }

        mal.entries.status.clear();
        mal.entries.status.total = entrylist.length;
        mal.content.status.update();

        Object.keys(mal.cache.data.graph).map(id => parseInt(id)).filter(id => !isNaN(id)).forEach(id => {
          const graph = mal.cache.data.graph[id];
          if (Array.isArray(graph)) {
            processed[id] = true;
          } else {
            delete mal.cache.data.graph[id];
          }
        });

        entrylist.forEach(entry => {
          const id = entry.id;
          const graph = mal.cache.data.graph[id];
          if (Array.isArray(graph)) {
            mal.cache.data.left[id] = true;
            processed[id] = true;
          } else {
            delete mal.cache.data.left[id];
            delete mal.cache.data.graph[id];
          }
        });

        entrylist = entrylist.filter(function (entry) {
          if (processed[entry.id] === true) {
            mal.entries.status.skip += 1;
            mal.content.status.update();
            return false;
          }
          return true;
        });

        function fetchLeft () {
          if (entrylist.length === 0) {
            loadRight();
            return;
          }

          const id = parseInt(entrylist.shift().id);
          processed[id] = true;

          setTimeout(function () {
            $.ajax({
              url: '/dbchanges.php?' + mal.type[0] + 'id=' + id + '&t=relations',
              dataType: 'html'
            })
              .done(function (data) {
                mal.cache.data.left[id] = true;
                getRelations(id, data);
                mal.entries.status.done += 1;
                mal.content.status.update();
                fetchLeft();
              })
              .fail(function () {
                console.log(`Failed to update /${mal.type}/${id}`);
                mal.entries.status.fail += 1;
                mal.content.status.update();
                fetchLeft();
              });
          }, mal.settings.ajaxDelay);
        }

        fetchLeft();
      }

      function loadUserList () {
        mal.entries.status.updating = true;
        mal.content.status.clear();
        mal.content.status.body.text('Loading...');

        mal.loader[mal.type].populate({
          onFinish: (data) => {
            $.each(data, (id, entry) => {
              const isAnime = mal.type === 'anime';
              const isManga = !isAnime;

              const title = entry[mal.type + '_title'];
              const status = parseInt(entry[isAnime ? 'anime_airing_status' : 'manga_publishing_status']);
              const episodes = isAnime ? parseInt(entry.anime_num_episodes) : 0;
              const chapters = isManga ? parseInt(entry.manga_num_chapters) : 0;
              const volumes = isManga ? parseInt(entry.manga_num_volumes) : 0;
              const userStatus = parseInt(entry.status);
              const userEpisodes = isAnime ? parseInt(entry.num_watched_episodes) : 0;
              const userChapters = isManga ? parseInt(entry.num_read_chapters) : 0;
              const userVolumes = isManga ? parseInt(entry.num_read_volumes) : 0;
              const rewatching = parseInt(entry[isAnime ? 'is_rewatching' : 'is_rereading']);

              // [ 1, 2, 3, 4, 6 ] --> [ 0, 1, 2, 3, 4 ]
              let userStatusID = userStatus - (userStatus === USER_STATUS.PLAN_TO ? 2 : 1);
              if (userStatusID < 0 || userStatusID >= mal.settings.availableStatus[mal.type].length) {
                userStatusID = -1;
              }

              const listEntry = {
                id: parseInt(id),
                title: toHtmlStr(title),
                correct: !(userStatusID < 0 ||
                  (userStatus !== USER_STATUS.PLAN_TO && status === SERIES_STATUS.NOT_YET) ||
                  (userStatus === USER_STATUS.COMPLETED && rewatching === 0 &&
                    (status !== SERIES_STATUS.COMPLETED || episodes !== userEpisodes ||
                    chapters !== userChapters || volumes !== userVolumes)) ||
                  (userStatus !== USER_STATUS.COMPLETED && status === SERIES_STATUS.COMPLETED &&
                    ((episodes > 0 && userEpisodes >= episodes) ||
                    (volumes > 0 && userVolumes >= volumes) ||
                    (chapters > 0 && userChapters >= chapters)))
                )
              };

              mal.cache.data.title[listEntry.id] = listEntry.title;
              mal.cache.data.airing[listEntry.id] = status;

              if (userStatusID !== -1) {
                mal.cache.data.status[listEntry.id] = userStatusID;
              }

              if (!listEntry.correct) {
                mal.cache.data.wrong[listEntry.id] = true;
              }

              entrylist.push(listEntry);
            });

            loadLeft();
          },
          onNext: (count) => {
            mal.content.status.body.html('Loading... (' + count + ' entries)');
          },
          onError: () => {
            mal.content.status.body.html('Loading... (failed)');
            mal.entries.status.updating = false;
          }
        }, [
          mal.type + '_title', // title
          'status', // userStatus
          'num_watched_episodes', // userEpisodes
          'num_read_chapters', // userChapters
          'num_read_volumes', // userVolumes
          'anime_num_episodes', // episodes
          'manga_num_chapters', // chapters
          'manga_num_volumes', // volumes
          'anime_airing_status', // status
          'manga_publishing_status', // status
          'is_rewatching', // rewatching
          'is_rereading' // rewatching
        ]);
      }

      if (!mal.entries.updating(true)) {
        mal.entries.status.updating = true;
        mal.content.status.clear();
        mal.content.status.body.text('Loading...');

        if (rescan) {
          mal.entries.status.clear();
          mal.cache.clear();
        } else {
          if (mal.forceUpdate) {
            for (let id = mal.forceFrom; id <= mal.forceTo; ++id) {
              if (Object.prototype.hasOwnProperty.call(mal.cache.data.left, id)) {
                console.log(`Force update /${mal.type}/${id} - "${mal.cache.data.title[id]}"`);
                mal.cache.clear(id);
              }
            }
          }
          mal.cache.data.airing = {};
          mal.cache.data.status = {};
          mal.cache.data.wrong = {};
        }

        mal.content.list.body.empty()
          .append('<p id="mr_information">' + (rescan ? 'Recalculating' : 'Updating') + ' missing relations...</p>')
          .append('<input type="hidden" id="mr_list_type" value="' + mal.type + '">');

        loadUserList();
      }
    },

    getTitle: function (id) {
      const result = Object.prototype.hasOwnProperty.call(mal.cache.data.title, id) ? String(mal.cache.data.title[id]) : '';
      return result.length > 0 ? result : '?';
    },

    getStatus: function (id) {
      const result = parseInt(mal.cache.data.status[id]);
      if (isNaN(result) || result < 0 || result >= mal.settings.availableStatus[mal.type].length) {
        return '';
      }
      return mal.settings.availableStatus[mal.type][result];
    },

    getGraph: function () {
      const graph = {};
      const used = {};

      function dfs (id, result) {
        id = parseInt(id);
        if (isNaN(id)) {
          return result;
        }

        used[id] = true;
        result.push(id);

        mal.cache.data.graph[id]
          .map(id => parseInt(id))
          .filter(id => !isNaN(id) && Array.isArray(mal.cache.data.graph[id]))
          .forEach(id => {
            if (used[id] !== true) {
              dfs(id, result);
            }
          });

        return result;
      }

      Object.keys(mal.cache.data.graph)
        .map(id => parseInt(id))
        .filter(id => !isNaN(id) && Array.isArray(mal.cache.data.graph[id]))
        .forEach(id => {
          if (used[id] !== true) {
            const result = dfs(id, []);
            if (result.length > 1) {
              graph[id] = result;
            }
          }
        });

      return graph;
    },

    comparator: function (a, b) {
      const aTitle = mal.entries.getTitle(a).toLowerCase();
      const bTitle = mal.entries.getTitle(b).toLowerCase();
      return aTitle.localeCompare(bTitle);
    }
  };

  mal.content = {
    body: $('<div class="mr_body mr_body_list">'),

    show: function (type) {
      if (type !== mal.type) {
        if (!mal.entries.updating(true)) {
          mal.content.status.body.empty();
        } else {
          alert('Updating in process!');
          return false;
        }
      }

      const listType = $('#mr_list_type', mal.content.body);
      mal.type = type;
      $('#mr_links_settings > #mr_link_switch', mal.content.body)
        .text(mal.type === 'anime' ? 'Manga' : 'Anime');

      if (listType.length === 0 || listType.val() !== mal.type) {
        mal.settings.load();
        mal.cache.load();
        mal.content.list.update(false);
      }

      mal.content.body.show();
      return true;
    },

    status: {
      body: $('<span id="mr_status_msg">'),
      done: 0,
      fail: 0,
      skip: 0,
      total: 0,

      update: function () {
        if (mal.content.status.total > 0 && mal.entries.status.total === 0) {
          mal.content.status.set(mal.content.status.done + mal.content.status.fail + mal.content.status.skip,
            mal.content.status.fail, mal.content.status.skip, mal.content.status.total);
        } else if (mal.content.status.total === 0 && mal.entries.status.total > 0) {
          mal.content.status.set(mal.entries.status.done + mal.entries.status.fail + mal.entries.status.skip,
            mal.entries.status.fail, mal.entries.status.skip, mal.entries.status.total);
        } else if (mal.content.status.total > 0 && mal.entries.status.total > 0) {
          mal.content.status.set((mal.content.status.done + mal.content.status.fail + mal.content.status.skip) + '+' +
          (mal.entries.status.done + mal.entries.status.fail + mal.entries.status.skip),
          mal.content.status.fail + '+' + mal.entries.status.fail,
          mal.content.status.skip + '+' + mal.entries.status.skip,
          mal.content.status.total + '+' + mal.entries.status.total);
        } else {
          mal.content.status.set(0, 0, 0, 0);
        }
      },

      set: function (done, fail, skip, total) {
        done = 'Done: <b><span style="color: green;">' + done + '</span></b>';
        fail = 'Failed: <b><span style="color: #c32;">' + fail + '</span></b>';
        skip = 'Skipped: <b><span style="color: gray;">' + skip + '</span></b>';
        total = 'Total: <b><span style="color: #444;">' + total + '</span></b>';
        mal.content.status.body.html(done + ' <small>(' + fail + ', ' + skip + ')</small> - ' + total);
      },

      clear: function () {
        mal.content.status.body.empty();
        mal.content.status.done = 0;
        mal.content.status.fail = 0;
        mal.content.status.skip = 0;
        mal.content.status.total = 0;
      }
    },

    footer: {
      body: $('<div class="mr_footer">'),
      footerSwitch: $('<div class="mr_footer_switch" title="Show/hide quick settings">').click(function () {
        mal.content.footer.toggle(!mal.content.list.body.hasClass('mr_has_footer'));
      }),

      show: function () {
        mal.content.footer.update();
        mal.content.footer.body.show();
        mal.content.list.body.addClass('mr_has_footer');
      },

      hide: function () {
        mal.content.footer.body.hide().empty();
        mal.content.list.body.removeClass('mr_has_footer');
      },

      toggle: function (state) {
        if (state) {
          mal.content.footer.show();
        } else {
          mal.content.footer.hide();
        }
        mal.cache.saveValue('mr_xo' + mal.type[0] + '_quick_settings', state.toString(), 'global');
      },

      update: function () {
        const table = $('<table class="mr_footer_table" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>' +
            '<td class="mr_footer_td mr_footer_td_left"></td>' +
            '<td class="mr_footer_td mr_footer_td_right"></td>' +
            '<td class="mr_footer_td mr_footer_td_other"></td>' +
            '</tr></table>');

        const tableIgnoreLeft = $('<table class="relTable" border="0" cellpadding="0" cellspacing="0" width="100%"><thead><tr>' +
            '<th colspan="2">Treat as missing relations:</th></tr><tbody></tbody></table>');

        const tableIgnoreRight = $('<table class="relTable" border="0" cellpadding="0" cellspacing="0" width="100%"><thead><tr>' +
            '<th colspan="2">Hide from missing relations:</th></tr><tbody></tbody></table>');

        const tableOther = $('<table class="relTable" border="0" cellpadding="0" cellspacing="0" width="100%"><thead><tr>' +
            '<th>Other settings:</th></tr><tbody></tbody></table>');

        const getCbSetting = function (str, id, state) {
          id = toHtmlId(id);
          const flag = mal.cache.loadValue(id, state.toString(), 'global');
          return $('<div class="mr_checkbox">')
            .append($('<input name="' + id + '" id="mr_footer_cb_' + id + '" type="checkbox">')
              .prop('checked', flag === 'true' || flag === true)
              .change(function () {
                const idCb = this.id.replace(/^mr_footer_cb_/, '');
                mal.cache.saveValue(idCb, this.checked.toString(), 'global');
                mal.settings.load();
                mal.content.list.update(false);
              }))
            .append('<label for="mr_footer_cb_' + id + '">' + str + '</label>');
        };

        // Add ignore left & right statuses
        const tbodyLeft = $('tbody', tableIgnoreLeft);
        const tbodyRight = $('tbody', tableIgnoreRight);
        let trLeft = $();
        let trRight = $();

        $.each(mal.settings.availableStatus[mal.type], function (i, status) {
          if (i % 2 > 0) {
            $('<td class="mr_td_right">')
              .append(getCbSetting(status, 'mr_xsl' + mal.type[0] + '_' + status, false))
              .appendTo(trLeft);
            $('<td class="mr_td_right">')
              .append(getCbSetting(status, 'mr_xsr' + mal.type[0] + '_' + status, false))
              .appendTo(trRight);

            trLeft = $();
            trRight = $();
          } else {
            trLeft = $('<tr class="mr_tr_data">').appendTo(tbodyLeft);
            trRight = $('<tr class="mr_tr_data">').appendTo(tbodyRight);

            $('<td class="mr_td_left">')
              .append(getCbSetting(status, 'mr_xsl' + mal.type[0] + '_' + status, false))
              .appendTo(trLeft);
            $('<td class="mr_td_left">')
              .append(getCbSetting(status, 'mr_xsr' + mal.type[0] + '_' + status, false))
              .appendTo(trRight);
          }
        });

        // Add 'Other' status
        let td;
        if (trRight.length === 0) {
          trRight = $('<tr class="mr_tr_data">').appendTo(tbodyRight);
          td = $('<td class="mr_td_left">');
        } else {
          td = $('<td class="mr_td_right">');
        }
        td.append(getCbSetting('Other', 'mr_xsr' + mal.type[0] + '_empty_status', false))
          .appendTo(trRight);

        // Add other settings
        const tbody = $('tbody', tableOther);
        mal.settings.otherSettings[mal.type].forEach(function (opt) {
          if (!opt.footer) {
            return;
          }
          $('<tr class="mr_tr_data">')
            .append($('<td class="mr_td_left">')
              .append(getCbSetting(opt.text, 'mr_xo' + mal.type[0] + '_' + opt.id, false)))
            .appendTo(tbody);
        });

        $('.mr_footer_td_left', table).append(tableIgnoreLeft);
        $('.mr_footer_td_right', table).append(tableIgnoreRight);
        $('.mr_footer_td_other', table).append(tableOther);
        mal.content.footer.body.empty().append(table);
      }
    },

    list: {
      body: $('<div class="mr_list">'),
      addStatus: {
        running: false,
        total: 0,
        done: 0,
        fail: 0
      },

      update: function (save) {
        if (mal.entries.updating(false)) {
          return;
        }

        mal.entries.status.updating = false;

        if (save) {
          mal.cache.save();
        }

        $('.mr_body_title', mal.content.body)
          .text(mal.title + ' - ' + (mal.type === 'anime' ? 'Anime' : 'Manga') + ' - ' + mal.name);

        const opts = {
          expandLong: false,
          expandLongR: false,
          quickSettings: false,
          hideEmpty: false,
          hideNotYet: false,
          hideAiring: false
        };

        mal.settings.otherSettings[mal.type].forEach(function (opt) {
          switch (opt.id) {
            case OPTS.EXPAND_LONG:
              opts.expandLong = opt.val;
              break;
            case OPTS.EXPAND_LONG_R:
              opts.expandLongR = opt.val;
              break;
            case OPTS.HIDE_NOTYET:
              opts.hideNotYet = opt.val;
              break;
            case OPTS.HIDE_AIRING:
              opts.hideAiring = opt.val;
              break;
          }
        });

        {
          const flag = mal.cache.loadValue('mr_xsr' + mal.type[0] + '_empty_status', 'false', 'global');
          opts.hideEmpty = (flag === 'true' || flag === true);
        }

        {
          const flag = mal.cache.loadValue('mr_xo' + mal.type[0] + '_quick_settings', 'false', 'global');
          opts.quickSettings = (flag === 'true' || flag === true);
        }

        const listType = $('<input type="hidden" id="mr_list_type" value="' + mal.type + '">');
        const graph = mal.entries.getGraph();
        const wrong = Object.keys(mal.cache.data.wrong).map(id => parseInt(id)).filter(id => mal.cache.data.wrong[id] === true);

        if (wrong.length === 0 && Object.keys(graph).length === 0) {
          mal.content.list.body.empty().append('<p id="mr_information">No missing relations found.</p>').append(listType);
          mal.content.footer.toggle(opts.quickSettings);
          return;
        }

        const table = $('<table class="relTable" border="0" cellpadding="0" cellspacing="0" width="100%"><thead><tr>' +
            '<th>Entries in your list:</th><th>Found missing relations:</th></tr></table>');

        const undel = $('<div id="mr_undelete"><p id="mr_undelete_msg" style="display: none;">' +
            'There are <span id="mr_undelete_num" style="font-weight: bold;"></span> hidden relations. ' +
            '<a href="javascript:void(0);" title="Show hidden relations" onclick="window.showHiddenRelations();">Show them</a></p></div>');

        const tfoot = $('<tfoot><tr><td class="mr_td_left"><div class="mr_count"><span class="mr_count_stats"></span></div></td>' +
            '<td class="mr_td_right"><div class="mr_count"><span class="mr_count_stats"></span></div></td></tr></tfoot>');

        const getEntryLink = function (id, title) {
          const hint = mal.entries.getStatus(id) || '';
          const status = hint.length > 0 ? toHtmlId(hint) : 'none';
          const tooltip = hint.length > 0 ? (' title="' + hint + '"') : '';
          const url = '/' + mal.type + '/' + id + '/' + title
            .replace(/[)(]/g, '')
            .replace(/[^\w\d-]/g, ' ')
            .replace(/\s/g, '_')
            .replace(/^_+/, '')
            .replace(/_+$/, '');
          return $('<a title="' + title + '" href="' + url + '" target="_blank">' + title + '</a>')
            .prepend('<i class="mr_icon mr_icon-' + status + '"' + tooltip + '>');
        };

        const getLiLeft = function (id, relatedIds) {
          return $('<li>')
            .data('related-ids', Array.isArray(relatedIds) ? relatedIds.join(',') : '')
            .append(getEntryLink(id, mal.entries.getTitle(id)));
        };

        const getLiRight = function (id, relatedIds) {
          const btnHide = $('<div class="mr_hide"><span><a href="javascript:void(0);" ' +
              'title="Hide this relation" onclick="window.hideRelation(' + id + ');">x</a></span></div>');
          return $('<li>')
            .data('related-ids', Array.isArray(relatedIds) ? relatedIds.join(',') : '')
            .append(btnHide)
            .append(getEntryLink(id, mal.entries.getTitle(id)));
        };

        const getMoreLink = function () {
          return $('<td colspan="2">').append(
            $('<a class="mr_more" href="javascript:void(0);">show more</a>').click(function () {
              const tr = $(this).closest('tr');
              tr.prev('.mr_tr_data').removeClass('mr_tr_collapsed');
              tr.remove();
            })
          );
        };

        // red relations
        if (wrong.length > 0) {
          const ul = $('<ul>');
          let size = 0;

          wrong.sort(mal.entries.comparator).forEach(function (id) {
            const relatedIds = mal.cache.data.graph[id] || [];
            getLiLeft(id, relatedIds).prop('id', 'mr_li_red_' + id).appendTo(ul);
            size += 1;
          });

          const warning = $('<div class="mr_warning"><span>Wrong status or ' +
            (mal.type === 'anime' ? 'episode' : 'volume/chapter') + ' count</span></div>');

          const rbodyRed = $('<tbody>');
          const deleteDivRed = $('<div class="mr_delete_strip" title="Delete this group from cache"></div>').click(function () {
            if (confirm('Delete this group of ' + wrong.length + ' entries with wrong status from cache?')) {
              wrong.forEach(function (id) { mal.cache.clear(id); });
              mal.cache.save();
              $(this).closest('tbody').remove();
              mal.content.list.updateLineCount();
            }
          });
          rbodyRed.append(deleteDivRed);

          const trRed = $('<tr class="mr_tr_data">')
            .append($('<td class="mr_td_left">').append(ul))
            .append($('<td class="mr_td_right">').append(warning))
            .appendTo(rbodyRed);

          if (!opts.expandLong && size > 6) {
            trRed.addClass('mr_tr_collapsed');
            $('<tr class="mr_tr_more">').append(getMoreLink()).insertAfter(trRed);
          }

          rbodyRed.appendTo(table);
        }

        const excludedStatusLeftRe = new RegExp('^(' + mal.settings.excludedStatus.left[mal.type].join('|') + ')$', 'i');
        const excludedStatusRightRe = new RegExp('^(' + mal.settings.excludedStatus.right[mal.type].join('|') + ')$', 'i');

        // normal relations
        Object.keys(graph).sort(mal.entries.comparator).forEach(function (key) {
          const ulLeft = $('<ul>');
          const ulRight = $('<ul>');
          let lSize = 0;
          let rSize = 0;

          graph[key].sort(mal.entries.comparator).forEach(function (id) {
            const status = mal.entries.getStatus(id) || '';
            const relatedIds = mal.cache.data.graph[id] || [];

            if (mal.cache.data.left[id] === true) {
              if (!status.match(excludedStatusLeftRe)) {
                if (!(opts.hideNotYet && mal.cache.data.airing[id] === SERIES_STATUS.NOT_YET) &&
                    !(opts.hideAiring && mal.cache.data.airing[id] === SERIES_STATUS.IN_PROCESS)) {
                  getLiLeft(id, relatedIds).prop('id', 'mr_li_' + id).appendTo(ulLeft);
                  lSize += 1;
                }
              } else if (!status.match(excludedStatusRightRe)) {
                if (!(opts.hideNotYet && mal.cache.data.airing[id] === SERIES_STATUS.NOT_YET) &&
                    !(opts.hideAiring && mal.cache.data.airing[id] === SERIES_STATUS.IN_PROCESS)) {
                  getLiRight(id, relatedIds).prop('id', 'mr_li_' + id).appendTo(ulRight);
                  rSize += 1;
                }
              }
            } else if (!(opts.hideEmpty && status.length === 0)) {
              if (!(opts.hideNotYet && mal.cache.data.airing[id] === SERIES_STATUS.NOT_YET) &&
                  !(opts.hideAiring && mal.cache.data.airing[id] === SERIES_STATUS.IN_PROCESS)) {
                getLiRight(id, relatedIds).prop('id', 'mr_li_' + id).appendTo(ulRight);
                rSize += 1;
              }
            }
          });

          if (lSize > 0 && rSize > 0) {
            const tbody = $('<tbody>');
            const deleteDiv = $('<div class="mr_delete_strip" title="Delete this group from cache"></div>').click(function () {
              const idsToClear = graph[key];
              if (confirm('Delete this group of ' + idsToClear.length + ' entries from cache?')) {
                idsToClear.forEach(function (id) { mal.cache.clear(id); });
                mal.cache.save();
                $(this).closest('tbody').remove();
                mal.content.list.updateLineCount();
              }
            });
            tbody.append(deleteDiv);

            const tr = $('<tr class="mr_tr_data">')
              .append($('<td class="mr_td_left">').append(ulLeft))
              .append($('<td class="mr_td_right">').append(ulRight))
              .appendTo(tbody);

            if (!opts.expandLong && (lSize > 6 || rSize > 6) && !(opts.expandLongR && (lSize <= 6 || rSize > 6))) {
              tr.addClass('mr_tr_collapsed');
              $('<tr class="mr_tr_more">').append(getMoreLink()).insertAfter(tr);
            }

            tbody.appendTo(table);
          }
        });

        mal.content.list.body.empty()
          .append(undel)
          .append(table.append(tfoot))
          .append(listType);

        mal.content.list.body.off('mouseenter mouseleave').on('mouseenter', '.relTable li', function () {
          const li = $(this);
          const relatedIds = (li.data('related-ids') || '').toString().split(',').filter(Boolean);
          const currentId = (li.prop('id') || '').match(/\d+/);

          if (!currentId) {
            return;
          }
          relatedIds.push(currentId[0]);

          $('.relTable li', mal.content.list.body).removeClass('mr_highlight');

          relatedIds.forEach(function (id) {
            $('li#mr_li_' + id + ', li#mr_li_red_' + id, mal.content.list.body).addClass('mr_highlight');
          });
        }).on('mouseleave', '.relTable li', function () {
          $('.relTable li', mal.content.list.body).removeClass('mr_highlight');
        });

        const tfootRightDiv = $('tfoot td.mr_td_right .mr_count', mal.content.list.body);
        const addContainer = $('<span> - <span id="mr_add_to_list_container"></span></span>');
        tfootRightDiv.append(addContainer);

        if (mal.content.list.addStatus.running) {
          const progress = mal.content.list.addStatus.done + mal.content.list.addStatus.fail;
          $('#mr_add_to_list_container').text('Adding... (' + progress + '/' + mal.content.list.addStatus.total + ')');
        } else {
          $('#mr_add_to_list_container').html('<a href="javascript:void(0);" id="mr_add_to_list" title="Add all visible missing entries to your list">Add to List</a>');
          $('#mr_add_to_list', mal.content.list.body).click(function () {
            if (mal.content.list.addStatus.running) {
              alert('Adding in process!');
              return;
            }
            if (mal.entries.updating(true)) {
              alert('Updating in process!');
              return;
            }
            if (confirm('Add all visible missing entries to your "' + (mal.type === 'anime' ? 'Plan to Watch' : 'Plan to Read') + '" list?')) {
              mal.content.list.addVisibleToList();
            }
          });
        }

        mal.content.list.updateHiddenRelations();
        mal.content.list.updateLineCount();
        mal.content.footer.toggle(opts.quickSettings);
      },

      addVisibleToList: function () {
        const entries = [];
        $('.relTable tbody:not([style*="display: none"]) td.mr_td_right li:not([style*="display: none"])', mal.content.list.body).each(function () {
          const id = parseInt($(this).prop('id').match(/\d+/)[0], 10);
          if (id && mal.cache.data.left[id] !== true) {
            entries.push(id);
          }
        });

        if (entries.length === 0) {
          alert('No visible entries to add.');
          return;
        }

        const csrfToken = $('meta[name="csrf_token"]').attr('content');
        if (!csrfToken) {
          alert('Could not find CSRF token. Cannot add entries.');
          return;
        }

        mal.content.list.addStatus.running = true;
        mal.content.list.addStatus.total = entries.length;
        mal.content.list.addStatus.done = 0;
        mal.content.list.addStatus.fail = 0;

        $('#mr_add_to_list_container').text('Adding... (0/' + mal.content.list.addStatus.total + ')');

        mal.content.list.processAddQueue(entries, csrfToken);
      },

      processAddQueue: function (entries, csrfToken) {
        if (entries.length === 0) {
          mal.content.list.addStatus.running = false;
          alert('Finished adding entries.');
          $('#mr_add_to_list_container').html('<a href="javascript:void(0);" id="mr_add_to_list" title="Add all visible missing entries to your list">Add to List</a>');
          $('#mr_add_to_list', mal.content.list.body).click(function () {
            if (mal.content.list.addStatus.running) {
              alert('Adding in process!');
              return;
            }
            if (mal.entries.updating(true)) {
              alert('Updating in process!');
              return;
            }
            if (confirm('Add all visible missing entries to your "' + (mal.type === 'anime' ? 'Plan to Watch' : 'Plan to Read') + '" list?')) {
              mal.content.list.addVisibleToList();
            }
          });

          if (confirm('Rescan to update the list?')) {
            mal.entries.update(false);
          }
          return;
        }

        const id = entries.shift();
        const postData = mal.type === 'anime'
          ? {
              anime_id: id,
              status: USER_STATUS.PLAN_TO,
              csrf_token: csrfToken
            }
          : {
              manga_id: id,
              status: USER_STATUS.PLAN_TO,
              csrf_token: csrfToken
            };

        $.ajax({
          type: 'POST',
          url: '/ownlist/' + mal.type + '/add.json',
          dataType: 'json',
          data: JSON.stringify(postData)
        })
          .done(function () {
            mal.content.list.addStatus.done++;
          })
          .fail(function () {
            mal.content.list.addStatus.fail++;
            console.log('Failed to add: ' + id + '; ' + mal.entries.getTitle(id));
          })
          .always(function () {
            const progress = mal.content.list.addStatus.done + mal.content.list.addStatus.fail;
            $('#mr_add_to_list_container').text('Adding... (' + progress + '/' + mal.content.list.addStatus.total + ')');
            setTimeout(function () {
              mal.content.list.processAddQueue(entries, csrfToken);
            }, mal.settings.ajaxDelay);
          });
      },

      updateLineCount: function () {
        const totalLeft = $('.relTable td.mr_td_left li', mal.content.list.body).length;
        const visibleLeft = $('.relTable tbody:not([style*="display: none"]) td.mr_td_left li', mal.content.list.body).length;

        $('tfoot td.mr_td_left .mr_count .mr_count_stats', mal.content.list.body)
          .text('Total: ' + totalLeft + ', Visible: ' + visibleLeft);

        const totalRight = $('.relTable td.mr_td_right li', mal.content.list.body).length;
        const visibleRight = $('.relTable td.mr_td_right li:not([style*="display: none"])', mal.content.list.body).length;

        $('tfoot td.mr_td_right .mr_count .mr_count_stats', mal.content.list.body)
          .text('Total: ' + totalRight + ', Visible: ' + visibleRight);
      },

      hideRelation: function (id, save) {
        id = parseInt(id);
        if (isNaN(id)) {
          return;
        }

        const li = $('td.mr_td_right li[id="mr_li_' + id + '"]', mal.content.list.body);
        if (li.length === 0) {
          delete mal.cache.data.hidden[id];
          if (save) {
            mal.cache.saveHiddenRelations();
          }
          return;
        }

        const row = li.hide().closest('tbody');
        const lSize = $('td.mr_td_left li', row).length;
        const rSize = $('td.mr_td_right li:not([style*="display: none;"])', row).length;

        row.toggle(rSize > 0);
        if (lSize <= 6 && rSize <= 6) {
          $('a.mr_more', row).trigger('click');
        }

        mal.cache.data.hidden[id] = true;
        if (save) {
          mal.cache.saveValue('mal.entries.hidden', mal.cache.data.hidden, mal.type, true);
          const count = Object.keys(mal.cache.data.hidden).length;
          $('#mr_undelete_num', mal.content.list.body).text(count);
          $('#mr_undelete_msg', mal.content.list.body).toggle(count > 0);
        }
      },

      showHiddenRelations: function (save) {
        $('#mr_undelete_msg', mal.content.list.body).hide();
        $('li[id^="mr_li_"]', mal.content.list.body).show();
        $('tbody', mal.content.list.body).show();
        if (save) {
          mal.cache.data.hidden = {};
          mal.cache.saveValue('mal.entries.hidden', mal.cache.data.hidden, mal.type, true);
        }
      },

      updateHiddenRelations: function () {
        mal.content.list.showHiddenRelations(false);
        $.each(mal.cache.data.hidden, function (id, val) {
          if (val === true) {
            mal.content.list.hideRelation(id, false);
          }
        });

        const count = Object.keys(mal.cache.data.hidden).length;
        $('#mr_undelete_num', mal.content.list.body).text(count);
        $('#mr_undelete_msg', mal.content.list.body).toggle(count > 0);
        mal.cache.saveValue('mal.entries.hidden', mal.cache.data.hidden, mal.type, true);
      }
    },

    storage: {
      body: $('<div class="mr_body mr_body_storage">' +
              '<textarea class="mr_textarea"></textarea><div class="mr_buttons"></div></div>'),

      update: function () {
        $('.mr_body_title', mal.content.storage.body).text(mal.title + ' - Import');

        const textarea = $('.mr_textarea', mal.content.storage.body).empty();
        textarea.val(JSON.stringify({
          name: mal.cache.name,
          version: OPTS.CACHE_VERSION,
          username: mal.cache.username,
          anime: {
            settings: mal.settings.export('anime'),
            cache: mal.cache.export('anime')
          },
          manga: {
            settings: mal.settings.export('manga'),
            cache: mal.cache.export('manga')
          }
        }));

        const buttons = $('.mr_buttons', mal.content.storage.body).empty();

        if (mal.entries.updating(true)) {
          buttons
            .append('<div class="mr_warning_bottom">The storage can\'t be changed during relations calculation!</div>')
            .append($('<input class="inputButton" value="OK" type="button">').click(function () {
              mal.fancybox.show(function () {
                mal.content.body.show();
                return true;
              });
            }))
            .insertAfter(textarea);
        } else {
          buttons
            .append($('<input class="inputButton" value="Import" type="button">').click(function () {
              mal.content.storage.import();
            }))
            .append($('<input class="inputButton" value="Cancel" type="button">').click(function () {
              textarea.val('');
              mal.fancybox.show(function () {
                mal.content.body.show();
                return true;
              });
            }))
            .append($('<input class="inputButton" value="Reset" type="button">').click(function () {
              mal.content.storage.update();
            }));
        }

        mal.content.storage.body.show();
      },

      import: function () {
        const textarea = $('.mr_textarea', mal.content.storage.body);
        const text = textarea.val();

        let json = null;
        try {
          json = JSON.parse(text);
        } catch (err) {
          console.error(err);
          return;
        }

        if (json === Object(json) &&
            String(json.name) === mal.cache.name &&
            String(json.version) === OPTS.CACHE_VERSION) {
          ['anime', 'manga'].forEach((type) => {
            if (json[type] == null) {
              return;
            }
            if (json[type].settings === Object(json[type].settings)) {
              mal.settings.import(type, json[type].settings);
            }
            if (json[type].cache === Object(json[type].cache)) {
              mal.cache.import(type, json[type].cache);
            }
          });

          textarea.val('');
          mal.fancybox.show(function () {
            mal.settings.load();
            mal.cache.load();
            mal.content.list.update(false);
            mal.content.body.show();
            return true;
          });
        }
      }
    },

    settings: {
      body: $('<div class="mr_body mr_body_settings"><div class="mr_list"></div><div class="mr_buttons"></div></div>'),

      update: function () {
        $('.mr_body_title', mal.content.settings.body).text(mal.title + ' - Settings');

        const tableExclude = $('<table class="relTable" border="0" cellpadding="0" cellspacing="0" width="100%"><thead><tr>' +
            '<th>Exclude anime relations from scan:</th><th>Exclude manga relations from scan:</th></tr><tbody></tbody></table>');

        const tableIgnoreLeft = $('<table class="relTable" border="0" cellpadding="0" cellspacing="0" width="100%"><thead><tr>' +
            '<th>Treat anime entries as missing relations:</th><th>Treat manga entries as missing relations:</th></tr><tbody></tbody></table>');

        const tableIgnoreRight = $('<table class="relTable" border="0" cellpadding="0" cellspacing="0" width="100%"><thead><tr>' +
            '<th>Hide anime entries from missing relations:</th><th>Hide manga entries from missing relations:</th></tr><tbody></tbody></table>');

        const tableOther = $('<table class="relTable" border="0" cellpadding="0" cellspacing="0" width="100%"><thead><tr>' +
            '<th>Other anime settings:</th><th>Other manga settings:</th></tr><tbody></tbody></table>');

        const getCbSetting = function (str, id, state) {
          id = toHtmlId(id);
          const flag = mal.cache.loadValue(id, state.toString(), 'global');
          return $('<div class="mr_checkbox">')
            .append($('<input name="' + id + '" id="' + id + '" type="checkbox">')
              .prop('checked', flag === 'true' || flag === true))
            .append('<label for="' + id + '">' + str + '</label>');
        };

        // Add exclude relations
        {
          const tbody = $('tbody', tableExclude);
          mal.settings.availableRelations.forEach(function (rel) {
            $('<tr class="mr_tr_data">')
              .append($('<td class="mr_td_left">').append(getCbSetting(rel, 'mr_xra_' + rel, false)))
              .append($('<td class="mr_td_right">').append(getCbSetting(rel, 'mr_xrm_' + rel, false)))
              .appendTo(tbody);
          });

          // Add ignore left & right statuses
          const tbodyLeft = $('tbody', tableIgnoreLeft);
          const tbodyRight = $('tbody', tableIgnoreRight);

          $.each(mal.settings.availableStatus.anime, function (i, statusA) {
            const statusM = mal.settings.availableStatus.manga[i];

            $('<tr class="mr_tr_data">')
              .append($('<td class="mr_td_left">').append(getCbSetting(statusA, 'mr_xsla_' + statusA, false)))
              .append($('<td class="mr_td_right">').append(getCbSetting(statusM, 'mr_xslm_' + statusM, false)))
              .appendTo(tbodyLeft);

            $('<tr class="mr_tr_data">')
              .append($('<td class="mr_td_left">').append(getCbSetting(statusA, 'mr_xsra_' + statusA, false)))
              .append($('<td class="mr_td_right">').append(getCbSetting(statusM, 'mr_xsrm_' + statusM, false)))
              .appendTo(tbodyRight);
          });

          $('<tr class="mr_tr_data">')
            .append($('<td class="mr_td_left">').append(getCbSetting('Other', 'mr_xsra_empty_status', false)))
            .append($('<td class="mr_td_right">').append(getCbSetting('Other', 'mr_xsrm_empty_status', false)))
            .appendTo(tbodyRight);
        }

        // Add other settings
        {
          const tbody = $('tbody', tableOther);
          $.each(mal.settings.otherSettings.anime, function (i, optA) {
            const optM = mal.settings.otherSettings.manga[i];

            $('<tr class="mr_tr_data">')
              .append($('<td class="mr_td_left">').append(getCbSetting(optA.text, 'mr_xoa_' + optA.id, false)))
              .append($('<td class="mr_td_right">').append(getCbSetting(optM.text, 'mr_xom_' + optM.id, false)))
              .appendTo(tbody);
          });
        }

        const list = $('.mr_list', mal.content.settings.body).empty()
          .append(tableExclude)
          .append(tableIgnoreLeft)
          .append(tableIgnoreRight)
          .append(tableOther);

        const buttons = $('.mr_buttons', mal.content.settings.body).empty();

        if (mal.entries.updating(true)) {
          buttons
            .append('<div class="mr_warning_bottom">The settings can\'t be changed during relations calculation!</div>')
            .append($('<input class="inputButton" value="OK" type="button">').click(function () {
              mal.fancybox.show(function () {
                mal.content.body.show();
                return true;
              });
            }))
            .insertAfter(list);
        } else {
          buttons
            .append($('<input class="inputButton" value="Save" type="button">').click(function () {
              $('input[type="checkbox"]', mal.content.settings.body).each(function () {
                mal.cache.saveValue(this.id, this.checked.toString(), 'global');
              });
              mal.settings.load();
              mal.fancybox.show(function () {
                mal.content.list.update(false);
                mal.content.body.show();
                return true;
              });
            }))
            .append($('<input class="inputButton" value="Cancel" type="button">').click(function () {
              mal.fancybox.show(function () {
                mal.content.body.show();
                return true;
              });
            }))
            .append($('<input class="inputButton" value="Reset" type="button">').click(function () {
              if (!confirm('Reset all settings?')) {
                return;
              }
              mal.settings.reset();
              mal.settings.load();
              mal.fancybox.show(function () {
                mal.content.list.update(false);
                mal.content.body.show();
                return true;
              });
            }));
        }

        mal.content.settings.body.show();
      }
    }
  };

  window.hideRelation = function (id) {
    mal.content.list.hideRelation(id, true);
    mal.content.list.updateLineCount();
  };

  window.showHiddenRelations = function () {
    mal.content.list.showHiddenRelations(true);
    mal.content.list.updateLineCount();
  };

  function main () {
    mal.name = $('.user-profile .user-function .icon-user-function#comment').prop('href').match(/\/([^/]+)#lastcomment$/)[1].trim();
    mal.cache = new Cache('mal_track_missing_relations', mal.name);
    mal.fancybox.init('#contentWrapper');

    if ($('html').hasClass('appearance-dark')) {
      mal.fancybox.outer.addClass('mr_dark_mode');
    }

    const panel = $('<div class="mr_panel">').append(mal.content.status.body).prependTo(mal.content.body);
    const links = $('<div class="mr_links">').prependTo(panel);

    $('<span id="mr_links_settings">').prependTo(links)
      .append($('<a href="javascript:void(0);" title="Switch lists" id="mr_link_switch">Manga</a>').click(function () {
        if (mal.entries.updating(true)) {
          alert('Updating in process!');
        } else {
          mal.fancybox.show(function () {
            return mal.content.show(mal.type === 'anime' ? 'manga' : 'anime');
          });
        }
      }))
      .append(' - ').append($('<a href="javascript:void(0);" title="Import script data">Import</a>').myfancybox(function () {
        mal.content.storage.update();
        return true;
      }))
      .append(' - ').append($('<a href="javascript:void(0);" title="Change calculation settings">Settings</a>').myfancybox(function () {
        mal.content.settings.update();
        return true;
      }))
      .append(' - ').append($('<a href="javascript:void(0);" title="Recalculate missing relations">Rescan</a>').click(function () {
        if (mal.entries.updating(true)) {
          alert('Updating in process!');
        } else if (confirm('Recalculate missing relations?')) {
          mal.entries.update(true);
        }
      }))
      .append(' - ').append($('<a href="javascript:void(0);" title="Find new missing relations">Update</a>').click(function () {
        if (mal.entries.updating(true)) {
          alert('Updating in process!');
        } else if (confirm('Find new missing relations?')) {
          mal.entries.update(false);
        }
      }));

    mal.content.body
      .prepend('<h2 class="mr_body_title">' + mal.title + '</h2>')
      .append(mal.content.list.body)
      .append(mal.content.footer.body.hide())
      .append(mal.content.footer.footerSwitch)
      .appendTo(mal.fancybox.body);

    mal.content.storage.body
      .prepend('<h2 class="mr_body_title">' + mal.title + '</h2>')
      .appendTo(mal.fancybox.body);

    mal.content.settings.body
      .prepend('<h2 class="mr_body_title">' + mal.title + '</h2>')
      .appendTo(mal.fancybox.body);

    mal.loader = {};
    ['anime', 'manga'].forEach(function (type) {
      mal.loader[type] = new MalData(mal.name, type, 300);

      const el = $('.profile .user-statistics .user-statistics-stats .updates.' + type + ' > h5 > a[href*="/history/"]');
      if (el.length > 0) {
        el.text(el.text().replace(/^(Anime|Manga)\sHistory$/i, 'History'));
      }

      $('<a class="floatRightHeader ff-Verdana mr4" href="javascript:void(0);">' + mal.title + '</a>').myfancybox(function () {
        return mal.content.show(type);
      })
        .appendTo('.profile .user-statistics .user-statistics-stats .updates.' + type + ' > h5')
        .before('<span class="floatRightHeader ff-Verdana mr4">-</span>');
    });
  }

  $('<style type="text/css">').html(
    'div#mr_fancybox_wrapper { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background: rgba(102, 102, 102, 0.3); z-index: 99990; }' +
    'div#mr_fancybox_inner { width: ' + mal.settings.windowWidth + 'px !important; height: ' + mal.settings.windowHeight + 'px !important; overflow: hidden; }' +
    'div#mr_fancybox_outer { position: absolute; display: block; width: auto; height: auto; padding: 10px; border-radius: 8px; top: 80px; left: 50%; margin-top: 0 !important; margin-left: ' + (-mal.settings.windowWidth / 2) + 'px !important; background: #fff; box-shadow: 0 0 15px rgba(32, 32, 32, 0.4); z-index: 99991; }' +
    'div.mr_body { text-align: center; width: 100%; height: 100%; padding: 42px 0 0; box-sizing: border-box; }' +
    'div.mr_body.mr_body_list { padding-top: 65px; }' +
    'div.mr_body a, div.mr_body a:visited { color: #1969cb; text-decoration: none; }' +
    'div.mr_body a:hover { color: #2d7de0; text-decoration: underline; }' +
    'div.mr_body .mr_body_title { position: absolute; top: 10px; left: 10px; width: ' + mal.settings.windowWidth + 'px; font-size: 16px; font-weight: normal; text-align: center; margin: 0; border: 0; }' +
    'div.mr_body .mr_body_title:after { content: ""; position: absolute; left: 0; bottom: -14px; width: 100%; height: 8px; border-top: 1px solid #eee; background: center bottom no-repeat radial-gradient(#f6f6f6, #fff 70%); background-size: 100% 16px; }' +
    'div.mr_body .mr_panel { position: absolute; top: 50px; left: 10px; text-align: left; width: ' + mal.settings.windowWidth + 'px; height: 2em; margin: 0 0 1em; }' +
    'div.mr_body .mr_links { float: right; }' +
    'div.mr_body p#mr_information { margin: 10px 0; }' +
    'div.mr_body #mr_undelete { background-color: #fff; padding: 0; margin: 0; }' +
    'div.mr_body #mr_undelete_msg { margin: 4px 0 6px; font-weight: normal; text-align: center; line-height: 20px; font-size: 11px; }' +
    'div.mr_body .mr_list { width: 100%; height: ' + (mal.settings.windowHeight - mal.settings.footerSwitchHeight - 65) + 'px; overflow-x: hidden; overflow-y: auto; margin: 0 auto; border: 1px solid #eee; box-sizing: border-box; }' +
    'div.mr_body .relTable { border: none; }' +
    'div.mr_body .relTable thead { background-color: #f5f5f5; }' +
    'div.mr_body .relTable th { background-color: transparent; width: 50%; padding: 5px 0 5px 6px; font-size: 12px; font-weight: bold; text-align: left; line-height: 20px !important; box-shadow: none; cursor: default; }' +
    'div.mr_body .relTable tbody { background-color: #fff; position: relative; }' +
    'div.mr_body.mr_body_list .mr_list .relTable th { padding-left: 26px; }' +
    'div.mr_body.mr_body_list .mr_list .relTable tbody:hover { background-color: #f5f5f5; }' +
    'div.mr_body.mr_body_list .mr_list .relTable tbody tr:first-of-type td { box-shadow: 0px 1em 1em -1em #ddd inset; }' +
    'div.mr_body .relTable td { background-color: transparent; width: 50%; padding: 5px 0 5px 6px; font-size: 13px; font-weight: normal; text-align: left; line-height: 20px !important; vertical-align: top; }' +
    'div.mr_body .relTable td div span { line-height: 20px !important; }' +
    'div.mr_body .relTable td ul { list-style-type: none; margin: 0; padding: 0; }' +
    'div.mr_body .relTable tr.mr_tr_collapsed td ul { height: 100px; overflow-y: hidden; }' +
    'div.mr_body .relTable td ul li { width: 100%; padding: 0; margin: 0; transition: background-color 0.2s; }' +
    'div.mr_body .relTable td ul li.mr_highlight { background-color: #eaf2ff; }' +
    'div.mr_body .relTable td ul li > a { display: block; width: ' + (mal.settings.windowWidth / 2 - 40) + 'px !important; line-height: 20px !important; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; text-decoration: none !important; }' +
    'div.mr_body .relTable td.mr_td_left ul li > a { width: ' + (mal.settings.windowWidth / 2 - 25) + 'px !important; }' +
    'div.mr_body .relTable i.mr_icon { display: inline-block; vertical-align: text-top; line-height: 16px; width: 16px; height: 16px; margin: 1px 4px 0 0; background-repeat: no-repeat; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAAAQCAMAAABQvsO3AAABI1BMVEUAAAD///8ZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZacsZactvPr9pAAAAYXRSTlMAAAsMDQ4PFhcaGx4gJCYnKSwuMDE3PEBBRUlKTE1UVldZWltdX2FiZGZoaWpsbnByc3R3eHl9foKEh4mLjY+QlJebnJ6foaOkq6yvs7S1uru8v8DDxMbJys/T2d3n6PH7ZwpR9wAAAXZJREFUeNq11FlTwjAUBeAjpSAuKLjvuCMgWlEUN5BFURG1LlVKwf//Kwy5SSbOyEtn+CaZ5GRuD29gaBDQ2z5cCfiH/9bCASdbV3T+W0/kQW51f1oDCSiB/QDfSng+kZgJQ7mUB7nX6a1GqXkIqHtpmG0DZKFUPW8yF3EIG5tgNjdk1Jds3TFgVGzbXgXJ2SRHv1HIDAPXLJ7ZBQOcUZ4FxssiYVtfovXUqUfqjuPcySHjjiWZo3kDy3MrLN9g+rEelSN7e2oeyWTSYZIctW61yH0QUoQ/ROgOIMNzFcHa5wS44EMq9aA+SAOteLzFL2lqNRvtnoYJyXziL0/qZYTn7O53Y1JOsMukGsgC7ampNr9kqRXmi+d5LyaUokeKEBZrveh+rUE4smKuG7OOQCzL8hiLE60IvXffQ5Aoj/55iy3lcuujUD7Q7Hab7CDH+pKtCFW0Usp89/U69sOMvYLk9SVafXCfO8yzC9LR+W99E/r9uwzCL22kXUBCr0XlAAAAAElFTkSuQmCC); }' +
    'div.mr_body .relTable i.mr_icon-none { background-image: none; }' +
    'div.mr_body .relTable i.mr_icon-watching { background-position: -34px 0; }' +
    'div.mr_body .relTable i.mr_icon-reading { background-position: -34px 0; }' +
    'div.mr_body .relTable i.mr_icon-completed { background-position: 0 0; }' +
    'div.mr_body .relTable i.mr_icon-on_hold { background-position: -51px 0; }' +
    'div.mr_body .relTable i.mr_icon-dropped { background-position: -17px 0; }' +
    'div.mr_body .relTable i.mr_icon-plan_to_watch { background-position: -68px 0; }' +
    'div.mr_body .relTable i.mr_icon-plan_to_read { background-position: -68px 0; }' +
    'div.mr_body .relTable tfoot td { border-top: 1px solid #f5f5f5; }' +
    'div.mr_body .relTable td .mr_count { color: #666; font-size: 11px; font-weight: normal; text-align: left; padding-left: 20px; }' +
    'div.mr_body .relTable td .mr_warning { width: ' + (mal.settings.windowWidth / 2 - 75) + 'px; color: #c56; font-size: 12px; font-weight: bold; text-align: left; padding-left: 20px; }' +
    'div.mr_body .relTable td .mr_hide { display: inline-block !important; width: 15px; float: right; text-align: left; font-size: 11px; }' +
    'div.mr_body .relTable td .mr_hide a { color: #888 !important; line-height: 20px !important; font-style: normal !important; text-decoration: none !important; }' +
    'div.mr_body .relTable tr.mr_tr_more td { padding: 0 0 2px 0; }' +
    'div.mr_body .relTable td .mr_more { display: block !important; text-align: center; color: #c0c0c0 !important; font-style: normal !important; font-size: 0.9em; text-decoration: none !important; }' +
    'div.mr_body .relTable .mr_checkbox > * { vertical-align: middle; font-size: 11px; cursor: pointer; }' +
    'div.mr_body .relTable .mr_comment { background-color: #f6f6f6; border: 1px solid #ebebeb; font-size: 11px; line-height: 16px; padding: 1px 4px; }' +
    'div.mr_body .mr_list.mr_has_footer { height: ' + (mal.settings.windowHeight - mal.settings.footerHeight - mal.settings.footerSwitchHeight - 65) + 'px; }' +
    'div.mr_body .mr_footer { position: absolute; bottom: ' + (10 + mal.settings.footerSwitchHeight) + 'px; width: ' + mal.settings.windowWidth + 'px; height: ' + mal.settings.footerHeight + 'px; overflow: hidden; border: 1px solid #eee; border-width: 0 1px; box-sizing: border-box; }' +
    'div.mr_body .mr_footer .mr_footer_td { vertical-align: top; padding: 2px 0 0; width: 37%; }' +
    'div.mr_body .mr_footer .mr_footer_td:first-of-type { padding-left: 6px; }' +
    'div.mr_body .mr_footer .mr_footer_td_other { width: 26%; }' +
    'div.mr_body .mr_footer .relTable { color: #323232; margin-top: 2px; }' +
    'div.mr_body .mr_footer .relTable thead { background-color: transparent; }' +
    'div.mr_body .mr_footer .relTable th { padding: 0 0 3px; font-size: 11px; line-height: 16px !important; }' +
    'div.mr_body .mr_footer .relTable td { padding: 0; }' +
    'div.mr_body .mr_footer_switch { position: absolute; bottom: 10px; width: ' + mal.settings.windowWidth + 'px; height: ' + mal.settings.footerSwitchHeight + 'px; border: 1px solid #eee; border-width: 0 1px 1px; cursor: pointer; box-sizing: border-box; }' +
    'div.mr_body .mr_footer_switch:hover { background-color: #f5f5f5; }' +
    'div.mr_body .mr_list.mr_has_footer ~ .mr_footer_switch { border-width: 0 1px 1px; }' +
    'div.mr_body.mr_body_settings .relTable { margin-bottom: 10px; }' +
    'div.mr_body.mr_body_settings .relTable td { padding: 0 0 0 6px; }' +
    'div.mr_body.mr_body_settings .mr_list { height: ' + (mal.settings.windowHeight - 75) + 'px !important; }' +
    'div.mr_body .mr_buttons { position: absolute; bottom: 10px; width: ' + mal.settings.windowWidth + 'px; text-align: center; padding: 5px 0 0; box-sizing: border-box; }' +
    'div.mr_body .mr_buttons > .inputButton { margin: 2px 5px !important; font-size: 12px; }' +
    'div.mr_body .mr_warning_bottom { display: inline-block; font-size: 12px; font-weight: bold; color: #c56; margin-bottom: 2px; }' +
    'div.mr_body.mr_body_storage .mr_textarea { width: 100% !important; height: ' + (mal.settings.windowHeight - 75) + 'px !important; resize: none; overflow: auto; margin: 0 auto; padding: 2px; border: 1px solid #eee; box-sizing: border-box; font-family: Consolas, Monospace; font-size: 11px; }' +
    '/* Dark Mode */' +
    'div#mr_fancybox_outer.mr_dark_mode { background: #1f1f1f; box-shadow: 0 0 15px rgba(0, 0, 0, 0.4); }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body { color: #c8c8c8; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body a, div#mr_fancybox_outer.mr_dark_mode .mr_body a:visited { color: #5b99e0; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body a:hover { color: #7cb3ff; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .mr_body_title { color: #f4f4f4; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .mr_body_title:after { border-top: 1px solid #3d3d3d; background: center bottom no-repeat radial-gradient(#2a2a2a, #1f1f1f 70%); }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body #mr_undelete { background-color: #1f1f1f; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .mr_list { border: 1px solid #3d3d3d; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable thead { background-color: #2a2a2a; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable th { color: #f4f4f4; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable tbody { background-color: #1f1f1f; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body.mr_body_list .mr_list .relTable tbody:hover { background-color: #2a2a2a; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body.mr_body_list .mr_list .relTable tbody tr:first-of-type td { box-shadow: 0px 1em 1em -1em #111 inset; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable tfoot td { border-top: 1px solid #3d3d3d; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable td .mr_count { color: #888; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable td .mr_warning { color: #ff8a8a; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable td .mr_hide a { color: #aaa !important; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable td .mr_more { color: #555 !important; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable .mr_comment { background-color: #2a2a2a; border: 1px solid #3d3d3d; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .mr_footer { border-color: #3d3d3d; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .mr_footer .relTable { color: #c8c8c8; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .mr_footer_switch { border-color: #3d3d3d; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .mr_footer_switch:hover { background-color: #2a2a2a; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable td ul li.mr_highlight { background-color: #2a3140; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .mr_buttons > .inputButton { background-image: none; background-color: #2e77d1; border: 1px solid #5b99e0; color: #fff; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .mr_buttons > .inputButton:hover { background-color: #5b99e0; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .mr_warning_bottom { color: #ff8a8a; }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body.mr_body_storage .mr_textarea { background-color: #2a2a2a; color: #c8c8c8; border: 1px solid #3d3d3d; }' +
    '/* Delete strip */' +
    'div.mr_body .relTable .mr_delete_strip { position: absolute; left: 0; top: 0; width: 5px; height: 100%; cursor: pointer; background-color: transparent; z-index: 1; }' +
    'div.mr_body .relTable tbody:hover > .mr_delete_strip { background-color: rgba(220, 0, 0, 0.15); }' +
    'div#mr_fancybox_outer.mr_dark_mode .mr_body .relTable tbody:hover > .mr_delete_strip { background-color: rgba(255, 100, 100, 0.15); }'
  ).appendTo('head');

  main();
}(jQuery));
