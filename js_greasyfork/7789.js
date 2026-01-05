// ==UserScript==
// @name        DiasPlus
// @namespace   diasplus
// @description Userscript that adds tweaks to diaspora*.
// @include     *
// @version     2.0.0
// @copyright   2016 Armando Lüscher
// @author      Armando Lüscher
// @oujs:author noplanman
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       window
// @require     https://code.jquery.com/jquery-3.1.1.slim.min.js
// @homepageURL https://github.com/noplanman/DiasPlus
// @supportURL  https://github.com/noplanman/DiasPlus/issues
// @downloadURL https://update.greasyfork.org/scripts/7789/DiasPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/7789/DiasPlus.meta.js
// ==/UserScript==

// Make sure we're on a diaspora* pod.
if (typeof unsafeWindow.Diaspora === 'undefined') {
  throw 'Not a diaspora* pod, move along...';
}

var DiasPlus = {};
DiasPlus.gon = unsafeWindow.gon;
DiasPlus.secure = true;
DiasPlus.domain = '';

/**
 * Get the pod URL (protocol + domain).
 *
 * @return {string} The pod URL.
 */
DiasPlus.getPodURL = function () {
  return 'http' + (DiasPlus.secure ? 's' : '') + '://' + DiasPlus.domain;
};


/**
 * Get the pod info from the GM settings.
 */
DiasPlus.loadPodInfo = function () {
  DiasPlus.setPodInfo(GM_getValue('dplus-pod-url', ''));
};

/**
 * Set the pod info and save it to the DiasPlus object and the GM settings.
 *
 * @param {string} podURL Pod URL to save.
 *
 * @return {boolean}
 */
DiasPlus.setPodInfo = function (podURL) {
  var info = podURL.split('://');
  if (info.length === 2) {
    DiasPlus.secure = info[0] === 'https';
    DiasPlus.domain = info[1];
    GM_setValue('dplus-pod-url', DiasPlus.getPodURL());

    return true
  }

  return false;
};

/**
 * Add the settings button to the top right navbar.
 */
DiasPlus.addSettingsButton = function () {
  // Add settings button.
  $('<li class="dplus-settings-button" title="DiasPlus Settings"><a><i class="entypo-cog"></i>D+</a></li>')
    .click(function () {
      var p = prompt('Modify your pod URL (eg. https://diasp.eu)', DiasPlus.getPodURL());
      DiasPlus.setPodInfo(p) && DiasPlus.addOompButton();
    })
    .appendTo('ul.navbar-right:first');
};

/**
 * Add the "Open on my pod" button to the top right navbar.
 */
DiasPlus.addOompButton = function () {
  // Remove the existing button if it already exists.
  $('.dplus-oomp-button').remove();

  // If we are not logged into this pod, it must be a foreign one.
  if (!('user' in DiasPlus.gon) && location.hostname !== DiasPlus.domain) {
    var $button = $('<li class="dplus-oomp-button" title="Open on my pod"><a target="_self"><i class="entypo-export"></i></a></li>')

    // Is this the first time we're setting the pod URL?
    if ('' === DiasPlus.domain) {
      $button.click(function () {
        var p = prompt('Your pod has not been defined yet!\n\nEnter your pod domain (eg. https://diasp.eu)', DiasPlus.getPodURL());
        DiasPlus.setPodInfo(p) && DiasPlus.addOompButton();
      });
    } else {
      var url = DiasPlus.getPodURL();

      if ('post' in DiasPlus.gon) {
        url += '/posts/' + DiasPlus.gon.post.guid;
      } else {
        url += location.pathname;
      }

      $('a', $button).attr('href', url);
    }

    $button.appendTo('ul.navbar-right');
  }
};

/**
 * Add the "Liked" and "Commented" links to the stream selection menu.
 */
DiasPlus.addExtraMenuLinks = function () {
  var $streamSelection = $('#stream_selection');
  $('li:nth-child(2)', $streamSelection).after(
    '<li><a class="hoverable" href="/liked">Liked</a></li>' +
    '<li><a class="hoverable" href="/commented">Commented</a></li>'
  );

  // Highlight the background of the active nav item's page.
  $streamSelection.find('li').each(function () {
    var navHref = $('a', this).attr('href');
    if (navHref === location.href.substring(location.href.length - navHref.length)) {
      $(this).addClass('selected');
    }
  });
};

/**
 * Add button that reverses the order of conversation messages.
 */
DiasPlus.addMessageSortingButton = function () {
  if ($('body').hasClass('page-conversations')) {
    var revMessages = function () {
      $('<a class="dplus-reverse-messages" title="Reverse message order"><i class="entypo-switch"></i></a>')
        .click(function () {
          $('#conversation-show .stream').html($('#conversation-show .stream-element').get().reverse());
        })
        .prependTo('.control-icons');
    };
    revMessages();
    DiasPlus.Observer.add('#conversation-show', revMessages);
  }
};

// Time when the mouse button was pressed, or false if not pressed.
var md = false;

/**
 * Initialise the "long click tags" feature.
 */
DiasPlus.initLongClickTags = function () {
  // MouseDown and MouseUp actions for the post entry field.
  $('#status_message_fake_text')
    .mousedown(function () {
      md = Date.now();
      DiasPlus.makeTag($(this));
    })
    .mouseup(function () {
      md = false;
    });
};

/**
 * Check if the passed character is not a space or new line character.
 *
 * @param {string} c The character to check.
 *
 * @return {boolean} True if not a space or new line, else False.
 */
DiasPlus.isValidChar = function (c) {
  return undefined !== c && !/\s/.test(c);
};

/**
 * Convert the currently selected word of the passed text area to a tag.
 *
 * @param {jQuery} $textArea The text area to be handled.
 */
DiasPlus.makeTag = function ($textArea) {
  try {
    // Mouse has been released early.
    if (!md) {
      return;
    }

    // Mouse button down long enough? Loop with timeouts until yes.
    if (md + 500 > Date.now()) {
      setTimeout(function () {
        DiasPlus.makeTag($textArea);
      }, 50);
    } else if ($textArea instanceof jQuery && $textArea.is('textarea')) {
      // Make sure we have been passed a text area.
      var textAreaText = $textArea.val();
      var cPos1 = $textArea[0].selectionStart;
      var cPos2 = $textArea[0].selectionEnd;

      // Only if there is no selection.
      if (cPos1 === cPos2) {

        // Search for the word end backwards.
        while (--cPos1 >= 0 && DiasPlus.isValidChar(textAreaText[cPos1]));
        cPos1++;

        // Let's handle the tag.
        if (DiasPlus.isValidChar(textAreaText[cPos1])) {
          if (textAreaText[cPos1] === '#') {
            // Looks like we're removing the tag.
            if (DiasPlus.isValidChar(textAreaText[cPos1 + 1]) && textAreaText[cPos1 + 1] !== '#') {
              $textArea.val(textAreaText.substring(0, cPos1) + textAreaText.substring(cPos1 + 1));
              // If we're removing the tag from the left, compensate for the # character.
              (textAreaText[cPos2] === '#') || cPos2--;
            }
          } else {
            // Looks like we're adding the tag.
            $textArea.val(textAreaText.substring(0, cPos1) + '#' + textAreaText.substring(cPos1));
            cPos2++;
          }
          // Set new caret positions.
          $textArea[0].selectionStart = $textArea[0].selectionEnd = cPos2;
        }
      }
      md = false;
    }
  } catch (e) {
    DiasPlus.doLog('Error while making tag.', 'e', false, e);
    md = false;
  }
};

/**
 * Make a log entry.
 *
 * @param {string}  logMessage Message to write to the log console.
 * @param {string}  logLevel   Level to log ([l]og,[i]nfo,[w]arning,[e]rror).
 * @param {boolean} alsoAlert  Also echo the message in an alert box.
 * @param {Error}   e          If an exception is passed too, add that info.
 */
DiasPlus.doLog = function (logMessage, logLevel, alsoAlert, e) {
  // Default to "log" if nothing is provided.
  logLevel = logLevel || 'l';

  // Add exception details if available.
  if (e instanceof Error) {
    logMessage += ' (' + e.name + ': ' + e.message + ')';
  }

  logLevel === 'l' && console.log(logMessage);
  logLevel === 'i' && console.info(logMessage);
  logLevel === 'w' && console.warn(logMessage);
  logLevel === 'e' && console.error(logMessage);

  alsoAlert && alert(logMessage);
};

/**
 * Start the party.
 */
DiasPlus.init = function () {
  // Add the global CSS rules.
  GM_addStyle(
    '.dplus-settings-button, .dplus-oomp-button { cursor: pointer; }' +
    '.dplus-oomp-button { background: #0c0; }' +
    '.dplus-oomp-button a { color: #fff !important; }' +
    '.page-conversations .control-icons a { cursor: pointer; display: inline-block !important; }' +
    '.page-conversations .control-icons .dplus-reverse-messages i { font-size: 20px; }'
  );

  // Load the pod infos from the GM settings.
  DiasPlus.loadPodInfo();

  // Load all the features.
  DiasPlus.addSettingsButton();
  DiasPlus.initLongClickTags();
  DiasPlus.addExtraMenuLinks();
  DiasPlus.addOompButton();
  DiasPlus.addMessageSortingButton();
};

// source: https://muffinresearch.co.uk/does-settimeout-solve-the-domcontentloaded-problem/
if (/(?!.*?compatible|.*?webkit)^mozilla|opera/i.test(navigator.userAgent)) { // Feeling dirty yet?
  document.addEventListener('DOMContentLoaded', DiasPlus.init, false);
} else {
  window.setTimeout(DiasPlus.init, 0);
}

/**
 * The MutationObserver to detect page changes.
 */
DiasPlus.Observer = {
  // The mutation observer objects.
  observers: [],

  /**
   * Add an observer to observe for DOM changes.
   *
   * @param {string}   queryToObserve Query string of elements to observe.
   * @param {function} cb             Callback function for the observer.
   */
  add: function (queryToObserve, cb) {
    // Check if we can use the MutationObserver.
    if ('MutationObserver' in window) {
      var toObserve = document.querySelector(queryToObserve);
      if (toObserve) {
        var mo = new MutationObserver(cb);
        DiasPlus.Observer.observers.push(mo);

        // Observe child changes.
        mo.observe(toObserve, {
          childList: true
        });
      }
    }
  }
};
