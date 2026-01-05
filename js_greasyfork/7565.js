// ==UserScript==
// @name           SMDb - Sharing Movie Databases
// @namespace      www.surrealmoviez.info
// @description    Cross-site searching for IMDb, cinema communities and open trackers
// @include        http://www.imdb.com/title/*
// @require        http://code.jquery.com/jquery-1.11.1.min.js
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @license        GNU GPL v3.0 http://www.gnu.org/licenses/gpl-3.0.txt
// @version        0.9.0
// @downloadURL https://update.greasyfork.org/scripts/7565/SMDb%20-%20Sharing%20Movie%20Databases.user.js
// @updateURL https://update.greasyfork.org/scripts/7565/SMDb%20-%20Sharing%20Movie%20Databases.meta.js
// ==/UserScript==

/**
* CREDITS
*
* Silk icon set 1.3 by Mark James
* http://www.famfamfam.com/lab/icons/silk/
* Creative Commons Attribution 2.5 License http://creativecommons.org/licenses/by/2.5/
* (+ custom icons gimpped from the collection)
*/

// Add "special" styles (for hover, hidding table-rows, etc)
GM_addStyle('.aux-button { opacity: 0.4; }' +
  '.aux-button:hover { opacity: 1; }' +
  '.smdb-table-row { display: table-row; }' +
  '.smdb-hidden-row { display: none; }' +
  '.smdb-search-icon { opacity: 0.4; }' +
  '.smdb-search-icon:hover { opacity: 1; }'
);

// IMDb parameters
var imdb = {
  id: null,
  idNum: null,
  name: null,
  tName: null,
  year: null,
  extractId: function() {
    var IMDbID = document.documentURI.match(/tt\d{4,}/i)[0];
    if (typeof IMDbID === 'string') {
      this.id = IMDbID;
      this.idNum = IMDbID.replace('tt', '');
    } else {
      alert('Critical error, no IMDb ID found. Please report this issue.');
      throw new Error('No regex match in URI');
    }
  },
  extractTitle: function() {
    var tempTitle = '';
    if (this.isOldDisplay()) {
      tempTitle = $('#tn15title > h1').clone().children().remove().end().text()
        .replace(/"/g, '').trim();
      var tempYear = $('#tn15title > h1 > span > a').text().trim();
      this.name = tempTitle;
      this.year = tempYear;
    } else if (this.isTestingDisplay()) {
      this.year = $('#titleYear > a').text().trim();
      this.name = $('#titleYear').parent().clone().children().remove().end()
        .text().trim();
      if ($('.originalTitle').length > 0) {
        this.tName = this.name;
        this.name = $('.originalTitle').clone().children().remove().end()
          .text().trim();
      }
    } else {
      tempTitle = $('#overview-top > .header > .itemprop');
      var tempOriginalTitle = $('#overview-top > .header > .title-extra');
      this.year = $('#overview-top > .header > .nobr').text()
        .replace('(', '').replace(')', '').trim();
      if (tempOriginalTitle.length > 0) {
        this.name = tempOriginalTitle.clone().children().remove().end()
          .text().replace(/"/g, '').trim();
        this.tName = tempTitle.text().replace('"', '').trim();
      } else {
        this.name = tempTitle.text().trim();
      }
    }
  },
  getTitle: function(withYear, preferOriginal) {
    var tempName = this.name;
    if (!preferOriginal && this.tName !== null) {
      tempName = this.tName;
    }
    var tempYear = ' ' + this.year;
    if (!withYear) {
      tempYear = '';
    }
    return tempName + tempYear;
  },
  isOldDisplay: function() {
    if (document.documentURI.indexOf('/reference') !== -1 ||
        document.documentURI.indexOf('/combined') !== -1) {
      return true;
    }
    return false;
  },
  isTestingDisplay: function() {
    if ($('.plot_summary_wrapper > .plot_summary').length === 1) {
      return true;
    }
    return false;
  },
  getContainerPosition: function() {
    if (this.isOldDisplay()) {
      return '#tn15content';
    }
    if (this.isTestingDisplay()) {
      return '.plot_summary';
    }
    return '.star-box';
  }
};

imdb.extractId();
imdb.extractTitle();

// Images for the possible search result statuses
var status = {
  none: {
    img: 'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/statusicons/none.png',
    description: 'Not searched yet'
  },
  found: {
    img: 'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/statusicons/corner_found.png',
    description: 'Something found'
  },
  notFound: {
    img: 'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/statusicons/corner_not-found.png',
    description: 'Nothing found'
  },
  notLoggedIn: {
    img: 'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/statusicons/corner_not-logged-in.png',
    description: 'Not logged in'
  },
  error: {
    img: 'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/statusicons/corner_error.png',
    description: 'Site error (down, moved, etc)'
  },
  bug: {
    img: 'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/statusicons/corner_bug.png',
    description: 'Bug in the script code (report <a href="https://github.com/surrealcode/smz-userscripts/issues" target="reportIssues">here</a>)'
  },
  timeout: {
    img: 'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/statusicons/corner_timeout.png',
    description: 'Timeout (no response after 15 seconds)'
  }
};

// Settings switch
var switchy = {
  on: 'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/configicons/switch-on.png',
  off: 'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/configicons/switch-off.png',
  getImg: function(bool) {
    if (bool) {
      return switchy.on;
    }
    return switchy.off;
  },
  getOpositeImg: function(src) {
    if (src === switchy.on) {
      return switchy.off;
    }
    return switchy.on;
  }
};

// GM values getter/setter
var gm = {
  setBool: function(valueName, bool) {
    if (typeof bool === 'boolean') {
      GM_setValue(valueName, bool);
      return true;
    }
    return false;
  },
  getBool: function(valueName) {
    return GM_getValue(valueName, true);
  }
};

/**
* Creates a linkeable site.
*
* @constructor
* @this {MiniSite}
* @param {string} name - Complete name of the site.
* @param {string} icon - Site icon (favicon if available), 20x20 px.
* @param {string} query - String to perform a search using the IMDb parameter.
* @param {string} imdbInput - Parameter extracted from IMDb to use as search string.
*/
function MiniSite(name, icon, query, imdbInput) {
  this.name = name;
  this.icon = icon;
  this.query = query;
  this.imdbInput = imdbInput;
  this.getSearchUrl = function() {
    return query.replace('%q', imdbInput);
  };
}

/**
* Creates a searcheable site.
*
* @constructor
* @this {Site}
* @param {string} name - Complete name of the site.
* @param {string} abbreviation - Abbreviation of the site.
* @param {string} icon - Site icon (favicon if available), 20x20 px.
* @param {string} query - String to perform a search using the IMDb parameter.
* @param {string} resultsPath - CSS path indicating matches in the site.
* @param {string} noResultsPath - CSS path indicating no matches in the site.
* @param {string} loginPath - CSS path to identify the site's login page.
* @param {string} imdbInput - Parameter extracted from IMDb to use as search string.
*/
function Site(name, abbreviation, icon, query, resultsPath, noResultsPath,
              loginPath, imdbInput) {
  this.name = name;
  this.abbreviation = abbreviation;
  this.icon = icon;
  this.query = query;
  this.resultsPath = resultsPath;
  this.noResultsPath = noResultsPath;
  this.loginPath = loginPath;
  this.imdbInput = imdbInput;
  this.searchMe = true; // After a successful search (with or without results), will be false to prevent re-searching if the user hits the pirate button again
  this.isEnabled = function() {
    return gm.getBool(this.getGMValueName());
  };
  this.getImageId = function() {
    return 'platypus-icon-' + abbreviation.toLowerCase();
  };
  this.getSearchUrl = function() {
    return query.replace('%q', imdbInput);
  };
  this.getGMValueName = function() {
    return 'smdb-' + this.abbreviation.toLowerCase() + '-enabled';
  };
  this.performSearch = function() {
    if (!this.searchMe || !this.isEnabled()) {
      return false;
    }
    var targetImage = $('#' + this.getImageId());
    var thisSite = this;
    targetImage.attr('src', status.none.img);
    GM_xmlhttpRequest({
      method: 'GET',
      timeout: 15000,
      url: this.getSearchUrl(),
      onload: function(response) {
        var responseDom = $(response.responseText);
        if ($(thisSite.resultsPath, responseDom).length > 0) {
          targetImage.attr('src', status.found.img);
          thisSite.searchMe = false;
        } else if ($(thisSite.noResultsPath, responseDom).length > 0) {
          targetImage.attr('src', status.notFound.img);
          thisSite.searchMe = false;
        } else if (thisSite.loginPath !== null &&
                   $(thisSite.loginPath, responseDom).length > 0) {
          targetImage.attr('src', status.notLoggedIn.img)
            .attr('title', thisSite.name + ' - not logged in');
        } else {
          targetImage.attr('src', status.bug.img);
        }
      },
      onerror: function(response) {
        var errorStatus = response.statusText;
        if (errorStatus === null) {
          errorStatus = 'Site unreachable';
        }
        console.log(name + ' - error\n\n*****Status*****\n\n' +
          response.status + ' ' + response.statusText +
          '\n\n*****Content*****\n\n' + response.responseText
        );
        targetImage.attr('src', status.error.img).attr('title', thisSite.name +
          ' - error: ' + errorStatus);
      },
      ontimeout: function(response) {
        targetImage.attr('src', status.timeout.img)
          .attr('title', thisSite.name + ' - timeout');
      }
    });
  };
}

var miniSites = [
  new MiniSite(
    'Youtube',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/youtube.png',
    'https://www.youtube.com/results?search_query=%q',
    imdb.getTitle(true, true)
  ),
  new MiniSite(
    'OpenSubtitles',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/opensubtitles.png',
    'http://www.opensubtitles.org/en/search/imdbid-%q',
    imdb.idNum
  ),
  new MiniSite(
    'SubtitleSeeker',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/subtitleseeker.png',
    'http://www.subtitleseeker.com/search/TITLES/%q',
    imdb.getTitle(false, true)
  ),
  new MiniSite(
    'Rotten Tomatoes',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/rottentomatoes.png',
    'https://www.rottentomatoes.com/search/?search=%q',
    imdb.getTitle(true, true)
  ),
  new MiniSite(
    'TMDb',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/tmdb.png',
    'http://www.themoviedb.org/search?query=%q',
    imdb.id
  ),
  new MiniSite(
    'Filmaffinity',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/filmaffinity.png',
    'http://www.filmaffinity.com/en/search.php?stext=%q&stype=title',
    imdb.getTitle(false, true)
  ),
  new MiniSite(
    'AllMovie',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/allmovie.png',
    'http://www.allmovie.com/search/all/%q',
    imdb.getTitle(false, true)
  ),
  new MiniSite(
    'Letterboxd',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/letterboxd.png',
    'http://letterboxd.com/search/%q/',
    imdb.id
  )
];

var sites = [
  new Site(
    'Surrealmoviez',
    'SMz',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/smz.png',
    'https://surrealmoviez.info/search.php?stext=%q&search=Search',
    '.main-bg .main-body > a',
    '.main-body > center:contains(0 Movies found matching search criteria.)',
    '.side-body [name=loginform]',
    imdb.id
  ),
  new Site(
    'Karagarga',
    'KG',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/kg.png',
    'https://karagarga.in/browse.php?search=%q&search_type=imdb',
    '#browse .oddrow',
    '.outer center > h2:contains(No torrents found)',
    '.outer > h1:contains(Not logged in!)',
    imdb.id
  ),
  new Site(
    'Cinemageddon',
    'CG',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/cg.png',
    'http://cinemageddon.net/browse.php?search=%q&proj=0&descr=1',
    '.torrenttable .prim, .torrenttable .torrenttable_usersnatched',
    '.outer form h2:contains(Nothing found!)',
    'input[value="Log in!"]',
    imdb.id
  ),
  new Site(
    'Cinematik',
    'Tik',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/tik.png',
    'http://cinematik.net/browse.php?search=%q&cat=0&incldead=1&sort=1&type=asc&srchdtls=1',
    '.outer table .brolin',
    '.outer h2:contains(Nothing found!)',
    '#usrlogin',
    imdb.id
  ),
  new Site(
    'PassThePopcorn',
    'PtP',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/ptp.png',
    'https://passthepopcorn.me/torrents.php?order_by=relevance&searchstr=%q',
    '.basic-movie-list__torrent-row, .page__title',
    'h2:contains(Your search did not match anything)',
    '#loginfields',
    imdb.id
  ),
  new Site(
    'I Love Classics',
    'ILC',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/ilc.png',
    'http://www.iloveclassics.com/browse.php?cat=0&incldead=1&search=%q&searchin=2',
    '.NB_fmmain > #hover-over',
    '.table_col1 > td:contains(Try again with a refined search string.)',
    '#topdrag:contains(Log On To I Love Classics)',
    imdb.id
  ),
  new Site(
    'Gormogon',
    'GG',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/gg.png',
    'http://www.gormogon.com/index.php?page=torrents&search=%q&category=0&options=1&active=0',
    '.lista > a > img[alt=torrent]',
    '.lista .header > a:contains(AddDate)', // No real way to know, using a selector to determine that we are at least in a search result page
    '.b-content td:contains(not authorized to view the Torrents!)',
    imdb.id
  ),
  new Site(
    'CinemaZ',
    'CZ',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/cz.png',
    'https://cinemaz.to/torrents?in=2&search=%q&type=0',
    '.torrent-file',
    '#form_search_torrents', // No real way to know, using a selector to determine that we are at least in a search result page
    '#form_login',
    imdb.id
  ),
  new Site(
    'Asian DVD Club',
    'ADV',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/adc.png',
    'http://asiandvdclub.org/browse.php?search=%q&descr=1&btnSubmit=Search!',
    '.torrenttable .torrentname',
    '#resultcount > h1:contains(Your search returned zero results!)',
    'form > .clean #username',
    imdb.id
  ),
  new Site(
    'AvistaZ',
    'AZ',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/at.png',
    'https://avistaz.to/torrents?in=2&search=%q&type=0',
    '.torrent-file',
    '#form_search_torrents', // No real way to know, using a selector to determine that we are at least in a search result page
    '#form_login',
    imdb.id
  ),
  new Site(
    'ruTracker',
    'RT',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/rt.png',
    'http://rutracker.org/forum/tracker.php?nm=%q',
    '#search-results .f-name',
    '#search-results .row1:contains(Не найдено)',
    'input[name=login_username]',
    imdb.getTitle(true, true)
  ),
  new Site(
    't411',
    't411',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/t411.png',
    'https://www.t411.al/torrents/search/?search=%q',
    '.results .down',
    '.error:contains(Aucun Résultat)',
    null,
    imdb.getTitle(true, true)
  ),
  new Site(
    'The Pirate Bay',
    'TPB',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/tpb.png',
    'https://thepiratebay.org/search/%q/0/7/0',
    '.vertTh',
    'h2:contains(No hits. Try adding)',
    null,
    imdb.id
  ),
  new Site(
    'RARBG',
    'RARBG',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/rarbg.png',
    'https://rarbg.to/torrents.php?search=%q&order=seeders&by=DESC',
    '.lista2t .lista2',
    '.lista2t:not(:has(.lista2))',
    null,
    imdb.id
  ),
  new Site(
    'My Duck is Dead',
    'MDiD',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/mdid.png',
    'http://www.myduckisdead.org/search?q=%q',
    '.postwrap',
    '.status-msg-body:contains(No posts matching)',
    null,
    imdb.id
  ),
  new Site(
    'Rarelust',
    'RL',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/rl.png',
    'http://rarelust.com/?s=%q',
    '.entry-content',
    '.entry-header > .entry-title:contains(Nothing Found)',
    null,
    imdb.id
  ),
  new Site(
    'AvaxHome',
    'AH',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/ah.png',
    'https://avaxsearch.pro/search?q=%q&a=&exact=0&c=54&l=any&sort_by=relevance',
    '.title-link',
    '.amount:contains(Found 0 post)',
    null,
    imdb.getTitle(true, true)
  ),
  new Site(
    'alluc',
    'alluc',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/alluc.png',
    'http://www.alluc.ee/stream/%q',
    '#resultitems .resblock > .clickable',
    '#noresultsadvice',
    null,
    imdb.getTitle(true, true)
  ),
  new Site(
    'VeeHD',
    'VeeHD',
    'https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/favicons/veehd.png',
    'http://veehd.com/search?q=%q',
    '.movieList .previewBlockHolder',
    '.movieList .error_message',
    null,
    imdb.getTitle(true, true)
  )
];

var container = '<div style="display: table; width: 100%; max-width: 400px; border-top: 1px solid #e8e8e8, padding-top: 1em, padding-bottom: 1em; border-collapse: collapse;">' +

 '<div style="display: table-row;">' +
 '<div id="mini-container" style="display: table-cell; vertical-align: middle; text-align: center;"></div>' +
 '</div>' +

 '<div style="display: table-row;">' +
 '<div id="platypus-container" style="display: table-cell; vertical-align: middle; text-align: center;"></div>' +
 '<div style="display: table-cell; width: 70px; vertical-align: middle;">' +
 '<img id="platypus-button" src="https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/button.png" alt="Search!" title="Search!" style="margin-left: 20px; cursor: pointer;">' +
 '</div>' +
 '</div>' +

 '<div style="display: table-row; height: 20px;">' +
 '<div style="display: table-cell;">' +
 '</div>' +
 '<div style="display: table-cell; vertical-align: bottom; text-align: center;">' +
 '<img id="smdb-settings-button" class="aux-button row-displayer" target-row="smdb-settings-row" src="https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/config.png" alt="Settings" title="Settings" style="cursor: pointer;">' +
 '<img id="smdb-help-button" class="aux-button row-displayer" target-row="smdb-help-row" src="https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/manual.png" alt="Help" title="Help" style="cursor: pointer;">' +
 '</div>' +
 '</div>' +

 '<div id="smdb-settings-row" class="smdb-hidden-row" style="border: 1px dashed silver;">' +
 '<div id="smdb-settings" style="display: table-cell;"></div>' +
 '<div style="display: table-cell; vertical-align: middle; text-align: center;"><img id="smdb-reload" src="https://raw.githubusercontent.com/surrealcode/smz-userscripts/master/smdb/img/reload.png" alt="Reload" title="Reload" style="cursor: pointer; display: none;"></div>' +
 '</div>' +

 '<div id="smdb-help-row" class="smdb-hidden-row" style="border: 1px dashed silver;">' +
 '<div id="smdb-help" style="display: table-cell; padding: 5px;">' +
 '<h4>Usage:</h4>See the complete usage instructions <a href="https://github.com/surrealcode/smz-userscripts/tree/master/smdb#usage" target="smdbHelp">here</a>.<br>' +
 '<h4>Statuses:</h4><ul id="smdb-statuses-list" style="list-style-type: none;"></ul><br>' +
 '<h4>Accuracy:</h4>The results are only a reference. Sites can have missing info or misspelled names. Do some manual searches if you want to be 100% sure.<br><br>' +
 '<h4>Why is site X not listed?</h4>Some sites don\'t support straightforward searches (listed <a href="https://github.com/surrealcode/smz-userscripts/tree/master/smdb#list-of-unsupported-sites" target="smdbHelp">here</a>). Others are currently out of my reach, I don\'t know them or are not in the focus of the script.<br><br>' +
 '</div>' +
 '</div>' +

 '</div>';

$(document).ready(function() {
  $(container).insertBefore(imdb.getContainerPosition());

  // Insert the list of mini sites to be clicked only
  for (var i = 0; i < miniSites.length; i++) {
    var miniSite = miniSites[i];
    $('#mini-container')
      .append('<a href="' + miniSite.getSearchUrl() +
        '" target="miniTab"><img src="' + miniSite.icon +
        '" style="width: 16px; height: 16px; margin: 2px;" alt="' +
        miniSite.name + '" title="' + miniSite.name + '"></a>'
      );
  }

  // Insert the list of sites to be searched
  for (var i = 0; i < sites.length; i++) {
    var site = sites[i];
    // Add it to the fetch list
    if (site.isEnabled()) {
      $('#platypus-container')
        .append('<a href="' + site.getSearchUrl() + '" target="platypusTab">' +
          '<img id="' + site.getImageId() +
          '" class="smdb-search-icon" src="' + status.none.img +
          '" style="width: 20px; height: 20px; background: url(' +
          site.icon + '); background-repeat: no-repeat; margin: 2px;" alt="' +
          site.abbreviation + '" title="' + site.name + '"></a>'
        );
    }
    // Add it to the settings list
    $('#smdb-settings')
      .append('<div style="display: inline-block; width: 33px; margin: 11px;">' +
        '<img class="smdb-settings-switch" target-gm-value="' +
        site.getGMValueName() + '" src="' + switchy.getImg(site.isEnabled()) +
        '" style="margin-right: 3px; cursor: pointer;"><img src="' + site.icon +
        '" alt="' + site.abbreviation + '" title="' + site.name + '"></div>'
      );
  }

  // Insert the list of possible statuses in the help area
  for (var stat in status) {
    $('#smdb-statuses-list')
      .append('<li style="padding: 0; margin: 0;">' +
        '<img src="' + status[stat].img + '"> = ' +
        status[stat].description + '</li>'
      );
  }

  // Add action to the search button
  $('#platypus-button').click(function() {
    $('.smdb-search-icon').css('opacity', '1');
    $('#platypus-button').attr('alt', 'Retry!').attr('title', 'Retry!');
    for (var i = 0; i < sites.length; i++) {
      var site = sites[i];
      site.performSearch();
    }
  });

  // Add action to the auxiliary buttons (config, help, etc)
  $('.row-displayer').click(function() {
    $(this).toggleClass('aux-button');
    $('#' + $(this).attr('target-row'))
      .toggleClass('smdb-hidden-row smdb-table-row');
  });

  // Add action to the site switches in the config area
  $('.smdb-settings-switch').click(function() {
    var targetGMValue = $(this).attr('target-gm-value');
    if (gm.setBool(targetGMValue, !gm.getBool(targetGMValue))) {
      $(this).attr('src', switchy.getOpositeImg($(this).attr('src')));
      $('#smdb-reload').show();
    } else {
      alert('Error saving settings!');
    }
  });

  // Add action to the reload button in the search area
  $('#smdb-reload').click(function() {
    window.location.reload();
  });
});
