// ==UserScript==
// @name         Filter Games from Twitch Listing
// @namespace    filter.twitch.com
// @version      1.3.3
// @description  Allows for easy filtering of the twitch directory listing
// @match        http://www.twitch.tv/directory*
// @match        https://www.twitch.tv/directory*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM.setValue
// @grant GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/9023/Filter%20Games%20from%20Twitch%20Listing.user.js
// @updateURL https://update.greasyfork.org/scripts/9023/Filter%20Games%20from%20Twitch%20Listing.meta.js
// ==/UserScript==

let CL_CARD = '.live-channel-card';
let CL_CARD_GAMES = '.preview-card';
let hiddenGames;

var GM_setValue = GM_setValue || GM.setValue;
var GM_getValue_extra = GM && GM.getValue || async function(name, def) {
  return GM_getValue(name, def);
};

var GM_addStyle_extra = function(css) {
  var _head = document.getElementsByTagName('head')[0];
  if (_head) {
    var _style = document.createElement('style');
    _style.setAttribute('type', 'text/css');
    _style.textContent = css;
    _head.appendChild(_style);
    return _style;
  }
  return null;
};

var favorites = new Set();
function addFavorite(channel) {
  favorites.add(channel.getAttribute('href'));
  channel.addEventListener('contextmenu', livestreamer);
}

function loadFavorites() {
  // expanded sidebar
  document.querySelectorAll('a[data-a-target="followed-channel"]')
    .forEach(addFavorite);

  // collapsed sidebar
  document.querySelectorAll('div[data-test-selector="side-nav-card-collapsed"] > a')
    .forEach(addFavorite);
}

function updateLink(card, link, href, cl, obj, handler) {
  card.classList.toggle(cl, obj.has(href));
  link.addEventListener('contextmenu', handler);
}

function handle(card) {
  var isIntl = card.classList.contains('intlstream');
  card.querySelectorAll('a')
    .forEach(function(link) {
    let href = link.getAttribute('href');
    if (/^\/directory\/game\//.test(href)) {
      updateLink(card, link, href, 'hiddenGame', hiddenGames, toggleGame);
    } else if (/^\/[^/]+$/.test(href)) {
      updateLink(card, link, href, 'favoriteStream', favorites, livestreamer);
    } else if (!isIntl && /\/videos$/.test(href)) {
      if (/^[^(]*\([^)]+\)$/.test(link.innerText)) {
        link.addEventListener('contextmenu', toggleIntl);
        card.classList.add('intlstream');
        isIntl = true;
      }
    }
  });
  if (isIntl) card.classList.toggle('hiddenIntl', hiddenGames.has('intl'));

  var isRerun = card.querySelector('.stream-type-indicator--rerun');
  if (isRerun) card.classList.add('rerunStream');
}

function handleAllCards() {
  if (/\/videos[/$]/.test(location.href)) {
    document.querySelectorAll('a[href^="/videos/"]').forEach(function(link) {
      link.addEventListener('contextmenu', livestreamer);
    });
  } else {
    document.querySelectorAll(CL_CARD).forEach(handle);
    document.querySelectorAll(CL_CARD_GAMES).forEach(handle);
  }
}

function livestreamer(e) {
  if (e.ctrlKey) {
    // show context menu as usual
  } else if (e.shiftKey) {
    let ref = window.open(this.href + '/chat?popup=', 'twitchchat', 'height=1000,width=450');
    ref.focus();
    e.preventDefault();
  } else if (!this.href) {
    console.log('this element is not a link');
    console.log(this);
  } else {
    var card = this.closest(CL_CARD) || this.closest(CL_CARD_GAMES) || this;
    if (!card.classList.contains('openingStream')) {
      card.classList.add('openingStream');
      setTimeout(function() {
        card.classList.remove('openingStream', 'highStream');
      }, 7000);
      var url = 'vid' + /^https?(.*)/.exec(this.href)[1];
      console.log('opening ' + url);
      location.href = url;
    }
    e.preventDefault();
  }
}

function save(game, games, name) {
  if (!games.delete(game)) {
    games.add(game);
  }
  GM_setValue(name, JSON.stringify(Array.from(games)));
}

function toggleGame(e) {
  if (!e.shiftKey && !e.ctrlKey) {
    var game = this.getAttribute('href');
    save(game, hiddenGames, 'hiddenGames');
    handleAllCards();
    e.preventDefault();
  }
}

function toggleIntl(e) {
  if (!e.shiftKey && !e.ctrlKey) {
    save('intl', hiddenGames, 'hiddenGames');
    var intlHidden = hiddenGames.has('intl');
    document.querySelectorAll('.intlstream').forEach(function(card) {
      card.classList.toggle('hiddenIntl', intlHidden);
    });
    e.preventDefault();
  }
}

async function setupFG() {
  var savedValue = await GM_getValue_extra('hiddenGames', '[]');
  console.log("loaded", savedValue);
  var saved = JSON.parse(savedValue);
  if (!Array.isArray(saved)) {
    console.log('migrating saved value: ' + saved + ' to ' + Object.keys(saved));
    saved = Object.keys(saved);
  }
  hiddenGames = new Set(saved);

  var timeout; // simple debounce timeout
  var observer = new MutationObserver(function() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      loadFavorites();
      handleAllCards();
    }, 100);
  });

  // Configuration of the observer:
  var config = {
    childList: true,
    subtree: true
  };

  // Pass in the target node, as well as the observer options
  observer.observe(document.body, config);

  GM_addStyle_extra(`
.rerunStream:hover{opacity:.9}
.hiddenGame:hover,.hiddenIntl:hover,.rerunStream{opacity:.7; transition: opacity .4s}
.hiddenGame,.hiddenIntl{opacity:.3; transition: opacity .4s}
.hiddenGame .tw-image,.hiddenIntl .tw-image,.rerunStream .tw-image{opacity:0.3}
.favoriteStream .tw-aspect,.openingStream .tw-aspect{overflow:inherit}
.favoriteStream .tw-image{box-shadow:0 0 19px 2px #ffaf00}
.favoriteStream a{color:#FFA80A!important;text-shadow:0 0 10px #FFA80A!important}
.openingStream a.tw-link{color:#FFA80A!important;text-shadow:0 0 10px #A8000A!important}
.openingStream .tw-image{box-shadow:0 0 19px 2px; animation: pulse-c 1s ease-in infinite alternate;}
@keyframes pulse-c { from { color: #af0000 } to { color: #afff00 } }`);
}

setupFG();