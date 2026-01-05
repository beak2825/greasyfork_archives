// ==UserScript==
// @name        MyAnimeList (MAL) Alternative History
// @namespace   https://greasyfork.org/users/7517
// @description Displays anime/manga series history based on RSS feed, instead of default episode/chapter history
// @icon        http://i.imgur.com/b7Fw8oH.png
// @version     4.2.1
// @author      akarin
// @include     /^https?:\/\/myanimelist\.net\/history\//
// @run-at      document-start
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/9000/MyAnimeList%20%28MAL%29%20Alternative%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/9000/MyAnimeList%20%28MAL%29%20Alternative%20History.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class Cache {
    constructor (name, username) {
      this.version = '4.0';
      this.name = name;
      this.username = username;
      this.time = 1000 * 60 * 60 * 36;
      this.fetchDelay = 800;
    }

    encodeKey (key) {
      return this.name + '#' + this.version + '#' + key;
    }

    loadValue (key, value) {
      try {
        const result = JSON.parse(localStorage.getItem(this.encodeKey(key)));
        return result == null ? value : result;
      } catch (e) {
        console.error(e.name + ': ' + e.message);
        return value;
      }
    }

    saveValue (key, value) {
      localStorage.setItem(this.encodeKey(key), JSON.stringify(value));
    }
  }

  class Content {
    constructor ($, cache) {
      this.$ = $;
      this.cache = cache;
      this.date = Date.now();
      this.body = this.$('<div id="ah_history_content">Loading history...</div>');
      this.entries = [];

      this.feedsCount = 0;
      this.feedsTotal = document.URL.match(/^https?:\/\/myanimelist\.net\/history\/(?!.*\/.)/) ? 2 : 1;
    }

    setItem (id, type, item) {
      if (!item || typeof item !== 'object' || item.constructor !== Object) {
        return false;
      }

      if (!item.hasOwnProperty('info') || item.info.length === 0 ||
          !item.hasOwnProperty('cover') || item.cover.length === 0) {
        return false;
      }

      let el = document.querySelector('div#info_' + type + '_' + id);
      if (!el) {
        return false;
      }
      el.innerHTML = item.info;

      el = document.querySelector('img#cover_' + type + '_' + id);
      if (!el) {
        return false;
      }
      el.setAttribute('src', item.cover);

      return true;
    }

    loadItem (id, type) {
      const itemData = this.cache.loadValue('item.data_' + type + '_' + id, {});
      const itemTime = this.cache.loadValue('item.time_' + type + '_' + id, 0);
      return this.setItem(id, type, itemData) ? (this.date <= parseInt(itemTime)) : false;
    }

    saveItem (id, type, data) {
      const item = { info: '', cover: '' };

      const info = {
        first: this.$('span.dark_text:contains(' + (type === 'anime' ? 'Studios' : 'Authors') + ':)', data).parent(),
        genres: this.$('span.dark_text:contains(Genres:)', data).parent(),
        score: this.$('span.dark_text:contains(Score:)', data).parent(),
        rank: this.$('span.dark_text:contains(Ranked:)', data).parent(),
        popularity: this.$('span.dark_text:contains(Popularity:)', data).parent()
      };

      this.$('meta, sup, .statistics-info', info.score).remove();
      this.$('sup, .statistics-info', info.rank).remove();

      item.info = info.first.html() + '<br>' + info.genres.html() + '<br>' +
                  info.score.html() + info.rank.html() + info.popularity.html();

      const cover = this.$('img[itemprop="image"]', data);
      if (cover.length > 0 && cover[0].hasAttribute('data-src')) {
        item.cover = cover.attr('data-src').replace(/\.(\w+)$/, 't.$1');
      } else if (cover.length > 0 && cover[0].hasAttribute('src')) {
        item.cover = cover.attr('src').replace(/\.(\w+)$/, 't.$1');
      } else {
        item.cover = 'https://myanimelist.cdn-dena.com/images/qm_50.gif';
      }

      this.cache.saveValue('item.data_' + type + '_' + id, item);
      this.cache.saveValue('item.time_' + type + '_' + id, this.date + this.cache.time);
      return this.setItem(id, type, item);
    }

    async loadFeeds () {
      const self = this;
      const $ = this.$;

      const request = async (url, feed) => {
        const response = await fetch(url);
        if (!response.ok) {
          return;
        }

        $('item', this.$.parseXML(await response.text())).each(function () {
          self.entries.push({
            gtype: feed,
            title: $('title', this).text().match(/^(.+)(\s-(?!.*\s-))/)[1],
            type: $('title', this).text().match(/(\s-(?!.*\s-))\s?(.*)$/)[2].replace(/^$/, '-'),
            link: $('link', this).text().replace(/^https?:\/\/[^/]+\//, '/'),
            id: $('link', this).text().match(/\/(\d+)\//)[1],
            status: $('description', this).text().match(/^(.+)\s-\s/)[1]
              .replace(/(Watch)/, feed === 'manga' ? 'Read' : '$1'),
            progress: $('description', this).text().match(/\s-\s(.+)$/)[1]
              .replace(/\s(chapters|episodes)/, '')
              .replace(/\sof\s/, '/')
              .replace(/^0\//, '-/')
              .replace(/\?/, '-'),
            date: new Date($('pubDate', this).text())
          });
        });

        this.feedsCount += 1;
      };

      if (this.feedsTotal > 1 || document.URL.match(/^https?:\/\/myanimelist\.net\/history\/[^/]+\/anime/)) {
        await request('/rss.php?type=rw&u=' + this.cache.username, 'anime');
      }

      if (this.feedsTotal > 1 || document.URL.match(/^https?:\/\/myanimelist\.net\/history\/[^/]+\/manga/)) {
        await request('/rss.php?type=rm&u=' + this.cache.username, 'manga');
      }

      const table = $('<table id="ah_history_table" width="100%" border="0" cellpadding="0" cellspacing="0">')
        .html('<tr>' +
              '<td class="normal_header" width="50">Image</td>' +
              '<td class="normal_header">Title</td>' +
              '<td class="normal_header" width="70">Type</td>' +
              '<td class="normal_header" width="90">Status</td>' +
              '<td class="normal_header" width="70">Progress</td>' +
              '<td class="normal_header" width="125">Date</td>' +
              '</tr>')
        .appendTo(this.body.empty());

      const queue = [];

      this.entries.sort((a, b) => b.date - a.date);
      this.entries.forEach((entry, i) => {
        const dateLast = (i < this.entries.length - 1) && (entry.date.getDate() !== this.entries[i + 1].date.getDate());
        const date = entry.date.toString()
          .replace(/^\w+\s/, '')
          .replace(/(\d+)/, '$1,')
          .replace(/(\d{4})/, '$1,')
          .replace(/(\d\d:\d\d).+$/, '$1');

        this.$('<tr' + (dateLast ? ' class="date_last"' : '') + '>')
          .html('<td valign="top"><div class="picSurround"><a href="' + entry.link + '">' +
                '<img id="cover_' + entry.gtype + '_' + entry.id + '" src="/images/spacer.gif" /></a></div></td>' +
                '<td valign="top"><a href="' + entry.link + '"><strong>' + entry.title + '</strong></a>' +
                '<div id="info_' + entry.gtype + '_' + entry.id + '"></div></td>' +
                '<td>' + entry.type + '</td>' +
                '<td>' + entry.status + '</td>' +
                '<td>' + entry.progress + '</td>' +
                '<td>' + date + '</td>'
          ).appendTo(table);

        if (!this.loadItem(entry.id, entry.gtype)) {
          queue.push(async () => {
            const response = await fetch('/' + entry.gtype + '/' + entry.id + '/_/pics');
            if (response.ok) {
              this.saveItem(entry.id, entry.gtype, await response.text());
            }
          });
        }
      });

      queue.forEach((request, i) => {
        setTimeout(request, i * this.cache.fetchDelay);
      });
    }
  }

  class MAL {
    constructor ($, name) {
      const username = document.URL.match(/^https?:\/\/myanimelist\.net\/history\/([^/]+)/)[1];
      this.cache = new Cache(name, username);
      this.content = new Content($, this.cache);
    }

    main () {
      const history = document.querySelector('#horiznav_nav ~ div:last-of-type');
      history.style.display = 'none';
      history.parentNode.insertBefore(this.content.body[0], history);

      if (history.querySelector('td')) {
        const toggler = document.createElement('a');
        toggler.setAttribute('href', 'javascript:void(0);');
        toggler.appendChild(document.createTextNode('Show Detailed History'));
        toggler.style.display = 'block';
        toggler.style.width = '100%';
        toggler.style.textAlign = 'center';

        toggler.onclick = () => {
          if (history.style.display !== 'none') {
            toggler.textContent = 'Show Detailed History';
            history.style.display = 'none';
          } else {
            toggler.textContent = 'Hide Detailed History';
            history.style.display = '';
          }
        };

        history.parentNode.insertBefore(toggler, history);
      } else {
        history.remove();
      }

      this.content.loadFeeds();

      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.appendChild(document.createTextNode(
        '#ah_history_content { padding: 0 15px 10px 15px; }' +
        '#ah_history_table { min-width: 100%; }' +
        '#ah_history_table td { padding: 4px; border-bottom: 1px solid #ebebeb; text-align: center; }' +
        '#ah_history_table tr.date_last td { border-bottom: 2px solid #dadada; }' +
        '#ah_history_table td.normal_header { border-bottom: 1px solid #bebebe; }' +
        '#ah_history_table td:nth-of-type(2) { text-align: left; }' +
        '#ah_history_table td div[id^="info_"] { padding: 4px 0 2px; font-size: 10px; color: #666; }'
      ));
      document.querySelector('head').appendChild(style);
    }
  }

  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.appendChild(document.createTextNode('.page-common #content { display: none !important; }'));

  const head = document.querySelector('head');
  if (head) {
    head.appendChild(style);
  }

  const callback = () => {
    try {
      (new MAL(jQuery, 'alternative_history')).main();
    } catch (e) {
      console.error(e.name + ': ' + e.message);
    } finally {
      style.remove();
    }
  };

  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}());
