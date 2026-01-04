// ==UserScript==
// @name         Trakt.tv | Enhanced Title Metadata
// @description  Adds links of filtered search results to the metadata section (languages, genres, networks, studios, writers, certification, year) on title summary pages, similar to the vip feature. Also adds a country flag and allows for "combined" searches by clicking on the labels. See README for details.
// @version      1.0.0
// @namespace    https://github.com/Fenn3c401
// @author       Fenn3c401
// @license      GPL-3.0-or-later
// @homepageURL  https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection#readme
// @supportURL   https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection/issues
// @icon         https://trakt.tv/assets/logos/logomark.square.gradient-b644b16c38ff775861b4b1f58c1230f6a097a2466ab33ae00445a505c33fcb91.svg
// @match        https://trakt.tv/*
// @match        https://classic.trakt.tv/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/550076/Trakttv%20%7C%20Enhanced%20Title%20Metadata.user.js
// @updateURL https://update.greasyfork.org/scripts/550076/Trakttv%20%7C%20Enhanced%20Title%20Metadata.meta.js
// ==/UserScript==

/* README
> Based on sergeyhist's [Trakt.tv Clickable Info](https://github.com/sergeyhist/trakt-scripts/blob/main/trakt-info.user.js) userscript.

### General
- By clicking on the label for languages, genres, networks, studios and writers, you can make a search for all their respective values combined, ANDed for genres, languages and writers,
    ORed for networks and studios. For example if the genres are "Crime" and "Drama", then a label search will return a selection of other titles that also have the genres "Crime" AND "Drama".
- The writers label search was mostly added as an example of how to search for filmography intersections with trakt's search engine (there's no official tutorial about this,
    just some vague one liner in the api docs about how `+ - && || ! ( ) { } [ ] ^ " ~ * ? : /` have "special meaning" when used in a query).
    It's much more interesting with actors e.g. [Movies with Will Smith and Alan Tudyk](https://trakt.tv/search/movies?query=%22Will%20Smith%22+%22Alan%20Tudyk%22&fields=people).
- The title's certification links to the respective `/parentalguide` imdb page (which contains descriptions of nude scenes, graphic content etc.).
- The title's year links to the search page for other titles from the same year.
- The search results default to either the "movies" or "shows" search category depending on the type of the current title.
- A "+ n more" button is added for networks when needed (some anime have more than a dozen listed).
- Installing the [Trakt.tv | Partial VIP Unlock](x70tru7b.md) userscript will allow free users to further modify the applied advanced filters on the linked search pages.
- This script won't work for vip users.
*/


'use strict';

let $, toastr, traktApiModule;

const logger = {
  _defaults: {
    title: GM_info.script.name.replace('Trakt.tv', 'Userscript'),
    toast: true,
    toastrOpt: { positionClass: 'toast-top-right', timeOut: 10000, progressBar: true },
    toastrStyles: '#toast-container#toast-container a { color: #fff !important; border-bottom: dotted 1px #fff; }',
  },
  _print(fnConsole, fnToastr, msg = '', opt = {}) {
    const { title = this._defaults.title, toast = this._defaults.toast, toastrOpt, toastrStyles = '', consoleStyles = '', data } = opt,
          fullToastrMsg = `${msg}${data !== undefined ? ' See console for details.' : ''}<style>${this._defaults.toastrStyles + toastrStyles}</style>`;
    console[fnConsole](`%c${title}: ${msg}`, consoleStyles, ...(data !== undefined ? [data] : []));
    if (toast) toastr[fnToastr](fullToastrMsg, title, { ...this._defaults.toastrOpt, ...toastrOpt });
  },
  info(msg, opt) { this._print('info', 'info', msg, opt) },
  success(msg, opt) { this._print('info', 'success', msg, { consoleStyles: 'color:#00c853;', ...opt }) },
  warning(msg, opt) { this._print('warn', 'warning', msg, opt) },
  error(msg, opt) { this._print('error', 'error', msg, opt) },
};

const gmStorage = { ...(GM_getValue('enhancedTitleMetadata')) };
GM_setValue('enhancedTitleMetadata', gmStorage);


addStyles();

document.addEventListener('turbo:load', async () => {
  if (!/^\/(shows|movies)\//.test(location.pathname)) return;

  $ ??= unsafeWindow.jQuery;
  toastr ??= unsafeWindow.toastr;
  traktApiModule ??= unsafeWindow.userscriptTraktApiModule?.isFulfilled ? await unsafeWindow.userscriptTraktApiModule : null;
  if (!$ || !toastr) return;

  const $additionalStatsLi = $('#overview .additional-stats > li'),
        pathSplit = location.pathname.split('/').filter(Boolean);
  if (!$additionalStatsLi.length) return;


  // YEAR
  const $year = $('#summary-wrapper .year');
  if ($year.parent().is('a')) $year.insertAfter($year.parent()); // year is part of link to title summary page on e.g. /comments pages
  $year.wrapAll(`<a href="/search/${pathSplit[0]}?years=${$year.text().slice(0, 4)}-${$year.text().slice(-4)}"></a>`); // year range on /seasons/all


  // CERTIFICATION
  const $certification = $('#summary-wrapper div.certification');
  $certification.wrap(`<a href="${$('#external-link-imdb').attr('href').split('/episodes')[0]}/parentalguide"></a>`);


  // WRITERS
  const $writers = $additionalStatsLi.filter((_, e) => $(e).find('label').text().toLowerCase() === 'writers');
  $writers.find('label').wrap(`<a href="/search/${pathSplit[0]}?query=%22${$writers.find('a:not(.writers-expand)').get().map((e) => e.textContent).join('%22+%22')}%22&fields=people"></a>`);


  // GENRES
  const $genres = $additionalStatsLi.filter(':has([itemprop="genre"])'),
        matchingGenres = [];
  $genres.find('[itemprop="genre"]').each((i, e) => {
    matchingGenres[i] = $(e).text().toLowerCase().replaceAll(' ', '-');
    $(e).wrap(`<a href="/search/${pathSplit[0]}?genres=${matchingGenres[i]}"></a>`);
  });
  if (matchingGenres.length > 1) $genres.find('label').wrap(`<a href="/search/${pathSplit[0]}?genres=+${matchingGenres.join(',+')}"></a>`);


  // COUNTRY
  const $country = $additionalStatsLi.filter((_, e) => $(e).find('label').text().toLowerCase() === 'country'); // countryOfOrigin + name meta tags are unreliable
  let matchingCountry; // also used for networks and studios
  if ($country.length) {
    const allCountriesMap = await getAllCountriesMap(),
          countryText = $country.contents().get(-1)?.textContent;

    matchingCountry = allCountriesMap[countryText];
    if (matchingCountry) {
      // flags seem to only be available for countries that are also watch-now countries (~139)
      const countryFlag = unsafeWindow.watchnowAllCountries?.[matchingCountry]?.image;
      if (countryFlag) $country.children().last().after(`<img class="country-flag" src="${countryFlag}">`);

      $country.contents().filter((_, e) => !$(e).is('meta, label')).wrapAll(`<a href="/search/${pathSplit[0]}?countries=${matchingCountry}"></a>`);
    } else {
      gmStorage.allCountriesMap = null;
      GM_setValue('enhancedTitleMetadata', gmStorage);
      logger.error(`Failed to match title country. Cached countries have been cleared. Reload page to try again.`);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  // LANGUAGES
  const $languages = $additionalStatsLi.filter((_, e) => $(e).find('label').text().toLowerCase().startsWith('language')),
        matchingLanguages = {}; // also used for networks and studios
  if ($languages.length) {
    const allLanugagesArrSorted = await getAllLanguagesArrSorted(),
          allLanugagesMap = Object.fromEntries(allLanugagesArrSorted);
    let languagesText = $languages.contents().get(-1).textContent;

    allLanugagesArrSorted.forEach(([id, name], i) => {
      const regExp = new RegExp(`${RegExp.escape(name)}(, |$)`);
      if (regExp.test(languagesText)) {
        matchingLanguages[languagesText.indexOf(name)] = id;
        languagesText = languagesText.replace(regExp, (m) => ' '.repeat(m.length));
      }
    });

    if (!languagesText.trim()) {
      const matchingLanguagesIds = Object.values(matchingLanguages);

      $languages.contents().last().replaceWith(
        matchingLanguagesIds
          .map((id) => `<a href="/search/${pathSplit[0]}?languages=${id}">${allLanugagesMap[id]}</a>`)
          .join(', ')
      );

      if (matchingLanguagesIds.length > 1) $languages.find('label').wrap(`<a href="/search/${pathSplit[0]}?languages=+${matchingLanguagesIds.join(',+')}"></a>`);
    } else {
      gmStorage.allLanguagesArrSorted = null;
      GM_setValue('enhancedTitleMetadata', gmStorage);
      logger.error(`Failed to match all title languages (ORIGINAL: ${$languages.contents().get(-1).textContent} REMAINDER: ${languagesText.trim()}). ` +
                   `Cached languages have been cleared. Reload page to try again.`);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  // NETWORKS
  const $networks = $additionalStatsLi.filter((_, e) => $(e).find('label').text().toLowerCase().startsWith('network')), // .stat class is unreliable
        $networkAlt = $additionalStatsLi.filter((_, e) => /airs|aired|premiered/i.test($(e).find('label').text())).first(); // can have one network as suffix
  if ($networks.length && pathSplit[3] !== 'all') { // network names on /seasons/all are invalid (memory addresses instead of names)
    const matchingNetworks = {},
          allNetworksArrSorted = await getAllNetworksArrSorted(),
          allNetworksMap = Object.fromEntries(allNetworksArrSorted);
    let networksText = $networks.contents().get(-1).textContent; // text is not sanitized and can contain tabs and stray spaces from network names

    allNetworksArrSorted.forEach(([id, { name, countryId }], i) => {
      const regExp = new RegExp(`${RegExp.escape(name)}(, |$)`);
      if (regExp.test(networksText) && (
        // !countryId || // TODO
        countryId === matchingCountry || Object.hasOwn(matchingLanguages, countryId) ||
        name !== allNetworksArrSorted[i+1]?.[1].name
      )) {
        matchingNetworks[networksText.indexOf(name)] = id;
        networksText = networksText.replace(regExp, (m) => ' '.repeat(m.length));
      }
    });

    if (!networksText.trim()) {
      const matchingNetworksIds = Object.values(matchingNetworks);

      $networks.contents().last().replaceWith(
        matchingNetworksIds
          .map((id) => `<a href="/search/shows?network_ids=${id}">${allNetworksMap[id].name}${allNetworksMap[id].countryId ? ` (${allNetworksMap[id].countryId.toUpperCase()})` : ''}</a>`)
          .join('')
      );

      if (matchingNetworksIds.length > 1) {
        $networks.find('label').wrap(`<a href="/search/shows?network_ids=${matchingNetworksIds.join(',')}"></a>`);

        $(`<a href onclick="$(this).hide(); $(this).next().show(); return false;"> + ${matchingNetworksIds.length - 1} more</a>`)
          .insertAfter($networks.children().eq(1))
          .nextAll().wrapAll(`<span style="display: none;"></span>`);
      }

      $networks.find('a:not(:has(label), [onclick])').slice(1).before(', '); // comma insertion done here because nextAll() doesn't support text nodes
    } else {
      gmStorage.allNetworksArrSorted = null;
      GM_setValue('enhancedTitleMetadata', gmStorage);
      logger.error(`Failed to match all title networks (ORIGINAL: ${$networks.contents().get(-1).textContent} REMAINDER: ${networksText.trim()}). ` +
                   `Cached networks have been cleared. Reload page to try again.`);
    }
  } else if ($networkAlt.text().includes(' on ') && pathSplit[3] !== 'all') {
    const allNetworksArrSorted = await getAllNetworksArrSorted(),
          networkText = $networkAlt.contents().last().text().split(' on ')[1];

    const matchingNetwork = networkText ? allNetworksArrSorted.find(([id, { name, countryId }], i) =>
      new RegExp(`${RegExp.escape(name)}(, |$)`).test(networkText) && (
        // !countryId || // TODO
        countryId === matchingCountry || Object.hasOwn(matchingLanguages, countryId) ||
        name !== allNetworksArrSorted[i+1]?.[1].name
      )
    ) : null;

    if (matchingNetwork) {
      $networkAlt.contents().last().remove();
      $networkAlt.append(` on <a href="/search/shows?network_ids=${matchingNetwork[0]}">${matchingNetwork[1].name}` +
                         `${matchingNetwork[1].countryId ? ` (${matchingNetwork[1].countryId.toUpperCase()})` : ''}</a>`)
    } else {
      gmStorage.allNetworksArrSorted = null;
      GM_setValue('enhancedTitleMetadata', gmStorage);
      logger.error(`Failed to match title network (${networkText}). Cached networks have been cleared. Reload page to try again.`);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  // STUDIOS
  const $studios = $additionalStatsLi.filter((_, e) => $(e).find('label').text().toLowerCase().startsWith('studio'));
  if ($studios.length) {
    if (traktApiModule) {
      let hasRun = false;

      const matchStudioFromElemContext = async function(evt) {
        if (hasRun) return;
        hasRun = true;
        evt?.preventDefault();

        unsafeWindow.showLoading?.();
        const dataStudios = await traktApiModule[pathSplit[0]].studios({ id: $('.summary-user-rating').attr(`data-${pathSplit[0].slice(0, -1)}-id`) }), // has the same order as $studios
              allStudioIdsJoined = dataStudios.map((studio) => studio.ids.trakt).join();
        unsafeWindow.hideLoading?.();

        if (evt) {
          const url = `/search/${pathSplit[0]}?studio_ids=${$(this).find('label').length ? allStudioIdsJoined : dataStudios[0].ids.trakt}`;
          if (evt.type === 'click') location.href = url;
          else if (evt.originalEvent.button === 1) GM_openInTab(location.origin + url, { setParent: true });
        }

        $studios.children().eq(0).attr('href', `/search/${pathSplit[0]}?studio_ids=${allStudioIdsJoined}`);
        $studios.children().eq(1).attr('href', `/search/${pathSplit[0]}?studio_ids=${dataStudios[0].ids.trakt}`);
        $studios.find('.studios-more').html(dataStudios.slice(1).map((studio) => `, <a href="${studio.ids.trakt}">${studio.name}</a>`));
      }

      // wrap names with unresolved anchor tags to minimize api requests
      $studios.find('label').wrap($(`<a href="#"></a>`).one('click auxclick', matchStudioFromElemContext));
      $studios.contents().eq(1).wrap($(`<a href="#"></a>`).one('click auxclick', matchStudioFromElemContext));
      $studios.find('.studios-expand').one('click', () => matchStudioFromElemContext());
    } else {
      const matchingStudios = new Set(),
            $studiosMore = $studios.find('.studios-more'),
            $studiosExpand = $studios.find('.studios-expand'),
            studiosMoreSplit = $studiosMore.text().split(', ').slice(1),
            studiosMoreCount = +$studiosExpand.text().match(/\d+/)?.[0] || null;

      // use studio search endpoint from advanced filters modal (~250.000 studios total; several thousand studio names contain commas; returns max. of 1000 results per request sorted lexicographically)
      const queryStudioNameMatches = (query) => {
        return fetch('/autocomplete/studios?query=' + encodeURIComponent(query))
          .then((r) => r.json())
          .then((r) => Object.fromEntries(
            r.map(({ label: name, value: studioId, tag: countryId }) => [name, +studioId, countryId?.toLowerCase() ?? null])
             .sort(([nameA, studioIdA, countryIdA], [nameB, studioIdB, countryIdB]) => nameA === nameB
                   ? (countryIdA && (countryIdA === matchingCountry || Object.hasOwn(matchingLanguages, countryIdA))) -
                     (countryIdB && (countryIdB === matchingCountry || Object.hasOwn(matchingLanguages, countryIdB))) ||
                     // (countryIdB && 1) - (countryIdA && 1) || // TODO
                     studioIdB - studioIdA // the lower the studio id, the more major the studio tends to be
                   : 0)
          ));
      };

      // executed from the context of an unresolved anchor tag (no lookup on page load to minimize api requests)
      const matchStudioFromElemContext = async function(evt) {
        evt?.preventDefault();
        $(this).off();

        unsafeWindow.showLoading?.();
        const studioName = $(this).text(),
              queryResult = await queryStudioNameMatches(studioName),
              studioId = queryResult[studioName];
        unsafeWindow.hideLoading?.();

        if (studioId) {
          matchingStudios.add(studioId);
          const url = `/search/${pathSplit[0]}?studio_ids=${studioId}`;

          if (evt) {
            if (evt.type === 'click') location.href = url;
            else if (evt.originalEvent.button === 1) GM_openInTab(location.origin + url, { setParent: true });
          }
          $(this).attr('href', url);
        } else {
          logger.error('Failed to match title studio: ' + studioName, { data: queryResult });
        }
      };

      // algorithm to deal with getting ids for a list of studio names, separated by commas, which by themseves can contain commas:
      // for split(', ') part at index i try to find longest possible match in part's result list by looking for results[parts(i)], then results[parts(i) + parts(i+1)] etc. longest match wins
      const matchStudiosMoreSplit = async () => {
        if (matchingStudios.size > 1) return;

        unsafeWindow.showLoading?.();
        const partsQueryResults = await Promise.all(studiosMoreSplit.map((part) => queryStudioNameMatches(part).then((results) => [part, results])));
        let consumedUntilIndex = -1;
        unsafeWindow.hideLoading?.();

        $studiosMore.html(partsQueryResults.map(([part, results], i) => {
          if (i <= consumedUntilIndex) return null;

          let longestMatch;
          for (let j = i; j < partsQueryResults.length; j++) {
            if (j !== i) part += ', ' + partsQueryResults[j][0];
            if (results[part]) {
              consumedUntilIndex = j;
              longestMatch = [part, results[part]];
            }
          };
          if (longestMatch) {
            matchingStudios.add(longestMatch[1]);
            return `, <a href="/search/${pathSplit[0]}?studio_ids=${longestMatch[1]}">${longestMatch[0]}</a>`;
          } else {
            logger.error('Failed to match all title studios. Could not match: ' + partsQueryResults[i][0], { data: results });
            throw new Error('Failed to match all title studios.'); // don't mutate original elem
          }
        }).join(''));
      }

      $studios.contents().eq(1).wrap($(`<a href="#"></a>`).on('click auxclick', matchStudioFromElemContext));

      if (studiosMoreCount) {
        // matchStudiosMoreSplit() always works, but it's overkill in most cases as only a small subset of studios have names containing commas
        if (studiosMoreCount === 1) {
          $studiosMore
            .text(', ')
            .append($(`<a href="#">${studiosMoreSplit.join(', ')}</a>`).on('click auxclick', matchStudioFromElemContext));
        } else if (studiosMoreCount === studiosMoreSplit.length) {
          $studiosMore.empty();
          studiosMoreSplit.forEach((part) => $studiosMore.append(', ', $(`<a href="#">${part}</a>`).on('click auxclick', matchStudioFromElemContext)));
        } else {
          $studiosExpand.one('click', matchStudiosMoreSplit);
        }

        $studios.find('label')
          .wrap(`<a href="#"></a>`)
          .parent()
          .on('click auxclick', async function(evt) {
            evt.preventDefault();
            $(this).off();

            await Promise.all([...$studios.find('a[href="#"]:not(:has(label), .studios-expand)').get().map((e) => matchStudioFromElemContext.call(e)), matchStudiosMoreSplit()]);
            const url = `/search/${pathSplit[0]}?studio_ids=${Array.from(matchingStudios).join(',')}`;

            if (evt.type === 'click') location.href = url;
            else if (evt.originalEvent.button === 1) GM_openInTab(location.origin + url, { setParent: true });
            $(this).attr('href', url);
          });
      }
    }
  }
}, { capture: true });

///////////////////////////////////////////////////////////////////////////////////////////////

async function getAllCountriesMap() { // ~235
  if (!gmStorage.allCountriesMap) {
    const doc = await fetch('/search/movies').then((r) => r.text()).then((r) => new DOMParser().parseFromString(r, 'text/html')); // movie countries are superset of show countries

    gmStorage.allCountriesMap = JSON.stringify(Object.fromEntries(
      $(doc).find('#filter-countries').children().get()
        .map((e) => [$(e).text(), $(e).attr('value').toLowerCase()])
    ));
    GM_setValue('enhancedTitleMetadata', gmStorage);
  }
  return JSON.parse(gmStorage.allCountriesMap);
}

async function getAllLanguagesArrSorted() { // ~179
  if (!gmStorage.allLanguagesArrSorted) {
    const doc = await fetch('/search/movies').then((r) => r.text()).then((r) => new DOMParser().parseFromString(r, 'text/html')); // movie langs are superset of show langs

    gmStorage.allLanguagesArrSorted = JSON.stringify(
      $(doc).find('#filter-languages').children().get()
        .map((e) => [$(e).attr('value'), $(e).text()])
        .sort(([, nameA], [, nameB]) => nameB.length - nameA.length) // ensure longest names get matched first, necessary because language names can include other language names and commas
    );
    GM_setValue('enhancedTitleMetadata', gmStorage);
  }
  return JSON.parse(gmStorage.allLanguagesArrSorted);
}

async function getAllNetworksArrSorted() { // ~4000; trakt api only returns one network (not full list) and only the name, not id
  if (!gmStorage.allNetworksArrSorted) {
    const doc = await fetch('/search/shows').then((r) => r.text()).then((r) => new DOMParser().parseFromString(r, 'text/html')),
          collator = new Intl.Collator();

    gmStorage.allNetworksArrSorted = JSON.stringify(
      $(doc).find('#filter-network_ids').children().get()
        .map((e) => $(e).text() ? [+$(e).attr('value'), { name: $(e).text(), countryId: $(e).attr('data-tag')?.toLowerCase() }] : null) // names can contain leading/trailing whitespace (even tabs)
        .filter(Boolean)
        .sort(([networkIdA, { name: nameA, countryId: countryIdA }], [networkIdB, { name: nameB, countryId: countryIdB }]) => {
          return nameB.length - nameA.length || // ensure longest names get matched first, necessary because network names can include names of other networks and commas
            collator.compare(nameA, nameB) || // make sure all those with the same name are neighbors
            (countryIdB && 1) - (countryIdA && 1) || // prioritize those with country code
            networkIdB - networkIdA; // the lower the network id, the more major the network tends to be
        })
    );
    GM_setValue('enhancedTitleMetadata', gmStorage);
  }
  return JSON.parse(gmStorage.allNetworksArrSorted);
}

///////////////////////////////////////////////////////////////////////////////////////////////

function addStyles() {
  GM_addStyle(`
#overview .additional-stats .country-flag {
  width: 20px !important;
  margin: -2px 5px 0 0 !important;
  transition: transform .5s ease;
}
#overview .additional-stats a:hover > .country-flag {
  transform: scale(1.1);
}

:is(#info-wrapper .additional-stats a > label, #summary-wrapper a > .year):hover {
  color: var(--link-color) !important;
  cursor: pointer !important;
}
#summary-wrapper a:has(> .certification):hover {
  color: #fff !important;
}
  `);
}