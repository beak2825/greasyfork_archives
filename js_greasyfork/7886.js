// ==UserScript==
// @name        MyAnimeList (MAL) Tags Cloud
// @namespace   https://greasyfork.org/users/7517
// @description Displays tags cloud on profile pages.
// @icon        http://i.imgur.com/b7Fw8oH.png
// @license     Unlicense
// @version     3.1.3
// @author      akarin
// @include     /^https?:\/\/myanimelist\.net\/profile/
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/7886/MyAnimeList%20%28MAL%29%20Tags%20Cloud.user.js
// @updateURL https://update.greasyfork.org/scripts/7886/MyAnimeList%20%28MAL%29%20Tags%20Cloud.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STATUS = {
    ALL: 7, IN_PROGRESS: 1, COMPLETED: 2, ON_HOLD: 3, DROPPED: 4, PLAN_TO: 6
  };

  const OPTS = {
    CACHE_VERSION: '3.0.1',
    WIDTH: 900,
    HEIGHT: 700,
    FONT_MIN: 9,
    FONT_MAX: 70,
    FETCH_DELAY: 1000,
    FETCH_TIMEOUT: 30000
  };

  function fetchUrl (url, timeout, delay) {
    if (timeout === undefined) {
      timeout = OPTS.FETCH_TIMEOUT;
    }

    if (delay === undefined) {
      delay = 0;
    }

    let isTimeout = false;
    return new Promise((resolve, reject) => setTimeout(() => {
      const t = setTimeout(() => {
        isTimeout = true;
        reject(new Error('fetch timeout'));
      }, timeout);

      fetch(url)
        .then((response) => {
          clearTimeout(t);
          if (!isTimeout) {
            resolve(response);
          }
        })
        .catch((err) => {
          if (!isTimeout) {
            reject(err);
          }
        });
    }, delay));
  }

  class Cache {
    constructor (name, username) {
      this.name = name;
      this.username = username;
    }

    encodeKey (key) {
      return this.name + '#' + OPTS.CACHE_VERSION + '#' + this.username + '#' + key;
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

  class Fancybox {
    constructor () {
      this.body = document.createElement('div');
      this.body.setAttribute('id', 'tc_fancybox_inner');

      this.outer = document.createElement('div');
      this.outer.setAttribute('id', 'tc_fancybox_outer');
      this.outer.appendChild(this.body);

      this.wrapper = document.createElement('div');
      this.wrapper.setAttribute('id', 'tc_fancybox_wrapper');
      this.wrapper.onlick = () => this.hide();

      this.hide();
    }

    init (node) {
      node.parentNode.insertBefore(this.outer, node.nextSibling);
      node.parentNode.insertBefore(this.wrapper, node.nextSibling);
      this.wrapper.onclick = () => this.hide();
    }

    show (callback) {
      if (this.body.hasChildNodes()) {
        Array.from(this.body.childNodes).forEach((node) => {
          node.style.display = 'none';
        });
      }

      if (callback === undefined || callback === true || callback()) {
        this.wrapper.style.display = '';
        this.outer.style.display = '';
      } else {
        this.hide();
      }
    }

    hide () {
      this.outer.style.display = 'none';
      this.wrapper.style.display = 'none';
    }
  }

  class MalData {
    constructor (username, type, offset, timeout, delay) {
      this.username = username;
      this.type = type;
      this.offset = offset;
      this.timeout = timeout;
      this.delay = delay;
      this.data = {};
      this.size = 0;
      this.running = false;
    }

    clear () {
      this.running = false;
      this.data = {};
      this.size = 0;
    }

    load (offset) {
      return new Promise((resolve, reject) => {
        fetchUrl('/' + this.type + 'list/' + this.username + '/load.json?status=7&offset=' + offset, this.timeout, this.delay)
          .then((response) => response.json())
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      });
    }

    async populate (callbacks, filter) {
      if (this.running) {
        return;
      }

      this.clear();
      this.running = true;

      const hasFilter = Array.isArray(filter) && filter.length > 0;

      for (let offset = 0; ; offset = offset + this.offset) {
        let data;
        try {
          data = await this.load(offset);
        } catch (err) {
          this.clear();
          if (callbacks.hasOwnProperty('onError')) {
            callbacks.onError();
          }
          break;
        }

        if (!Array.isArray(data) || data.length === 0) {
          break;
        }

        for (const entry of data) {
          this.data[entry[this.type + '_id']] = hasFilter ? Object.keys(entry)
            .filter((key) => filter.includes(key))
            .reduce((obj, key) => {
              obj[key] = entry[key];
              return obj;
            }, {}) : entry;
        }

        this.size = this.size + data.length;
        if (callbacks.hasOwnProperty('onNext')) {
          callbacks.onNext(this.size);
        }
      }

      let data = Object.assign({}, this.data);
      this.clear();
      if (callbacks.hasOwnProperty('onFinish')) {
        callbacks.onFinish(data);
      }
    }
  }

  class TagsCloud {
    constructor (username, fancybox) {
      this.username = username;
      this.fancybox = fancybox;
      this.cache = new Cache('mal_tags_cloud', this.username);
      this.content = {};
      this.status = {};
      this.tags = {};
      this.loader = {};
      this.onclick = {};

      this.header = document.createElement('div');
      this.header.classList.add('tc_title');

      ['anime', 'manga'].forEach((type) => {
        let node = document.createElement('select');
        node.setAttribute('id', 'tc_sel_' + type);
        this.header.appendChild(node);
      });

      this.header.appendChild(document.createElement('span'));
      this.header.appendChild(document.createTextNode(' ('));

      ['anime', 'manga'].forEach((type) => {
        let node = document.createElement('a');
        node.setAttribute('id', 'tc_upd_' + type);
        node.setAttribute('href', 'javascript:void(0);');
        node.setAttribute('title', 'Update tags');
        node.appendChild(document.createTextNode('update'));
        this.header.appendChild(node);
      });

      this.header.appendChild(document.createTextNode(') '));

      ['anime', 'manga'].forEach((type) => {
        let node = document.createElement('sup');
        node.setAttribute('id', 'tc_sup_' + type);
        this.header.appendChild(node);
      });

      this.body = document.createElement('div');
      this.body.setAttribute('id', 'tags_cloud');
      this.body.appendChild(this.header);
    }

    init (type, onStatusChange) {
      let node = document.createElement('div');
      node.classList.add('tags_list');

      let el = document.createElement('div');
      el.classList.add('tags_not_found');
      node.appendChild(el);

      this.body.appendChild(node);
      this.content[type] = node;

      this.status[type] = STATUS.ALL;
      this.tags[type] = this.cache.loadValue(type, {});
      this.loader[type] = new MalData(this.username, type, 300, OPTS.FETCH_TIMEOUT, OPTS.FETCH_DELAY);
      this.onclick[type] = () => {};

      node = this.header.querySelector('select#tc_sel_' + type);
      if (node) {
        while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
        }

        el = document.createElement('option');
        el.value = STATUS.ALL;
        el.appendChild(document.createTextNode('All ' + type.replace(/^a/, 'A').replace(/^m/, 'M')));
        node.appendChild(el);

        el = document.createElement('option');
        el.value = STATUS.IN_PROGRESS;
        el.appendChild(document.createTextNode(type === 'anime' ? 'Watching' : 'Reading'));
        node.appendChild(el);

        el = document.createElement('option');
        el.value = STATUS.COMPLETED;
        el.appendChild(document.createTextNode('Completed'));
        node.appendChild(el);

        el = document.createElement('option');
        el.value = STATUS.ON_HOLD;
        el.appendChild(document.createTextNode('On-Hold'));
        node.appendChild(el);

        el = document.createElement('option');
        el.value = STATUS.DROPPED;
        el.appendChild(document.createTextNode('Dropped'));
        node.appendChild(el);

        el = document.createElement('option');
        el.value = STATUS.PLAN_TO;
        el.appendChild(document.createTextNode('Plan to ' + (type === 'anime' ? 'Watch' : 'Read')));
        node.appendChild(el);

        node.onchange = () => {
          let select = this.header.querySelector('select#tc_sel_' + type);
          if (select) {
            onStatusChange(select.value);
          }
        }
      }

      node = this.header.querySelector('a#tc_upd_' + type);
      if (node) {
        node.onclick = () => this.onclick[type]();
      }
    }

    show (type, status) {
      status = parseInt(status);

      this.onclick[type] = () => {
        if (this.loader[type].running) {
          alert('Updating in process!');
          return;
        }

        let node = this.header.querySelector('select#tc_sel_' + type);
        if (node) {
          node.setAttribute('disabled', 'disabled');
        }

        node = this.content[type];
        while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
        }

        let text = document.createTextNode('Loading...');
        node = document.createElement('div');
        node.classList.add('tags_not_found');
        node.appendChild(text);
        this.content[type].appendChild(node);

        this.loader[type].populate({
          onFinish: (data) => {
            let tags = {};
            for (const entry of Object.values(data)) {
              if (typeof entry.tags === 'string' || entry.tags instanceof String) {
                for (let tag of entry.tags.split(',')) {
                  tag = tag.trim();
                  if (tag.length === 0) {
                    continue;
                  }

                  if (!tags.hasOwnProperty(tag)) {
                    tags[tag] = {};
                  }

                  let keyStatus = String(entry.status);
                  tags[tag][keyStatus] = tags[tag].hasOwnProperty(keyStatus) ? tags[tag][keyStatus] + 1 : 1;

                  let keyTotal = String(STATUS.ALL);
                  tags[tag][keyTotal] = tags[tag].hasOwnProperty(keyTotal) ? tags[tag][keyTotal] + 1 : 1;
                }
              }
            }

            this.tags[type] = tags;
            this.cache.saveValue(type, tags);
            this.update(type, status);
          },
          onNext: (count) => text.nodeValue = 'Loading... (' + count + ' entries)',
          onError: () => text.nodeValue = 'Loading... (failed)'
        }, [ 'status', 'tags' ]);
      };

      if (this.status[type] !== status || this.content[type].querySelector('.tags_not_found')) {
        this.update(type, status);
      }

      this.status[type] = status;
      const invType = type === 'anime' ? 'manga' : 'anime';

      this.content[invType].style.display = 'none';
      this.header.querySelectorAll(
        'select#tc_sel_' + invType + ', ' +
        'a#tc_upd_' + invType + ', ' +
        'sup#tc_sup_' + invType
      ).forEach((node) => {
        node.style.display = 'none';
      });

      this.content[type].style.display = '';
      this.header.querySelectorAll(
        'select#tc_sel_' + type + ', ' +
        'a#tc_upd_' + type + ', ' +
        'sup#tc_sup_' + type
      ).forEach((node) => {
        node.style.display = '';
      });

      let node = this.header.querySelector('span');
      if (node) {
        while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
        }

        node.appendChild(document.createTextNode('Tags Cloud — '));

        let el = document.createElement('a');
        el.setAttribute('id', 'tc_link_' + type);
        el.setAttribute('href', 'javascript:void(0);');
        el.setAttribute('title', 'Switch to ' + invType);
        el.appendChild(document.createTextNode(type.toLowerCase().replace(/^a/, 'A').replace(/^m/, 'M')));
        el.onclick = () => this.fancybox.show(() => this.show(invType, this.status[invType]));
        node.appendChild(el);

        node.appendChild(document.createTextNode(' · ' + this.username));
      }

      this.body.style.display = '';
      return true;
    }

    update (type, status) {
      if (this.loader[type].running) {
        return;
      }
      let node = this.header.querySelector('select#tc_sel_' + type);
      if (node) {
        node.setAttribute('disabled', 'disabled');
      }
      this.remap(type, status);
      if (node) {
        node.removeAttribute('disabled');
      }
    }

    remap (type, status) {
      status = parseInt(status);
      const keyStatus = String(status);

      let node = this.content[type];
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }

      let max = 0;
      let min = Number.MAX_VALUE;
      let tags = {};

      for (const [tag, data] of Object.entries(this.tags[type])) {
        if (data.hasOwnProperty(keyStatus)) {
          tags[tag] = data[keyStatus];
          max = Math.max(max, tags[tag]);
          min = Math.min(min, tags[tag]);
        }
      }

      let keys = Object.keys(tags)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      const len = keys.length;

      if (len === 0) {
        node = document.createElement('div');
        node.classList.add('tags_not_found');
        node.appendChild(document.createTextNode('Tags not found'));
        this.content[type].appendChild(node);

        node = this.header.querySelector('sup#tc_sup_' + type);
        if (node) {
          while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
          }
        }

        return;
      }

      node = this.header.querySelector('sup#tc_sup_' + type);
      if (node) {
        while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
        }
        if (len > 1) {
          node.appendChild(document.createTextNode('Total: ' + len));
        }
      }

      const sizeDiff = max - min;
      const fontDiff = OPTS.FONT_MAX - OPTS.FONT_MIN;
      const tagLink = '/' + type + 'list/' + this.username + '?status=' + status + '&tag=';

      keys.forEach((tag, i) => {
        const count = tags[tag];
        const fontSize = OPTS.FONT_MIN + (fontDiff * (count - min) / sizeDiff);

        let span = document.createElement('span');
        span.classList.add('cloud_tag');
        span.style.fontSize = Math.round(fontSize) + 'px';
        span.style.margin = '0 ' + Math.round(fontSize / 4) + 'px';

        let el = document.createElement('a');
        el.setAttribute('href', tagLink + tag);
        el.setAttribute('target', '_blank');
        el.appendChild(document.createTextNode(tag));
        span.appendChild(el);

        if (count > 1) {
          el = document.createElement('sup');
          el.appendChild(document.createTextNode(String(count)));
          span.appendChild(el);
        }

        node = this.content[type];
        node.appendChild(span);
        if (i + 1 < len) {
          node.appendChild(document.createTextNode(', '));
        }
      });
    }
  }

  const username = document.querySelector('.user-profile .user-function .icon-user-function#comment')
    .getAttribute('href').match(/\/([^/]+)#lastcomment$/)[1].trim();

  let fancybox = new Fancybox();
  fancybox.init(document.querySelector('#contentWrapper'));

  let cloud = new TagsCloud(username, fancybox);
  fancybox.body.appendChild(cloud.body);

  ['anime', 'manga'].forEach((type) => {
    cloud.init(type, (status) => fancybox.show(() => cloud.show(type, status)));

    let el = document.querySelector('.profile .user-statistics .user-statistics-stats .updates.' + type + ' > h5');
    if (el) {
      let history = el.querySelector('a[href*="/history/"]');
      if (history) {
        history.textContent = history.textContent.replace(/^(Anime|Manga)\sHistory$/, 'History');

        let node = document.createElement('a');
        node.setAttribute('href', 'javascript:void(0);');
        node.classList.add('floatRightHeader');
        node.classList.add('ff-Verdana');
        node.classList.add('mr4');
        node.appendChild(document.createTextNode('Tags Cloud'));
        node.onclick = () => fancybox.show(() => cloud.show(type, cloud.status[type]));
        el.insertBefore(node, history.nextSibling);

        let span = document.createElement('span');
        span.classList.add('floatRightHeader');
        span.classList.add('ff-Verdana');
        span.classList.add('mr4');
        span.appendChild(document.createTextNode('-'));
        el.insertBefore(span, node);
      }
    }
  });

  let style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.appendChild(document.createTextNode(
    'div#tc_fancybox_wrapper { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background: rgba(102, 102, 102, 0.3); z-index: 99990; }' +
    'div#tc_fancybox_inner { width: ' + OPTS.WIDTH + 'px !important; height: ' + OPTS.HEIGHT + 'px !important; overflow: hidden; }' +
    'div#tc_fancybox_outer { position: absolute; display: block; width: auto; height: auto; padding: 10px; border-radius: 8px; top: 80px; left: 50%; margin-top: 0 !important; margin-left: ' + (-OPTS.WIDTH / 2) + 'px !important; background: #fff; box-shadow: 0 0 15px rgba(32, 32, 32, 0.4); z-index: 99991; }' +
    'div#tags_cloud { width: 100%; height: 100%; text-align: center; padding-top: 45px; box-sizing: border-box; }' +
    'div#tags_cloud sup { color: #90a0b0; font-weight: lighter; }' +
    'div#tags_cloud .tc_title { position: absolute; top: 10px; left: 10px; width: ' + OPTS.WIDTH + 'px; font-size: 16px; font-weight: normal; text-align: center; margin: 0; border: 0; }' +
    'div#tags_cloud .tc_title select { position: absolute; left: 0; top: 0; }' +
    'div#tags_cloud .tc_title a[id^="tc_upd_"] { font-size: 12px; font-weight: normal; }' +
    'div#tags_cloud .tc_title sup { position: absolute; right: 0; top: 0; }' +
    'div#tags_cloud .tc_title:after { content: ""; display: block; position: relative; width: 100%; height: 8px; margin: 0.5em 0 0; padding: 0; border-top: 1px solid #ebebeb; background: center bottom no-repeat radial-gradient(#f6f6f6, #fff 70%); background-size: 100% 16px; }' +
    'div.tags_list { width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; color: #666; font-size:' + OPTS.FONT_MIN + 'px; border: 1px solid #eee; box-sizing: border-box; }' +
    'div.tags_list .cloud_tag { white-space: nowrap; }' +
    'div.tags_list .tags_not_found { font-size: 12px; font-weight: normal; margin-top: 20px; }'
  ));
  document.querySelector('head').appendChild(style);
}());