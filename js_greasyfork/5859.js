// ==UserScript==
// @name        InstaSynchP Autocomplete
// @namespace   InstaSynchP
// @description Autocomplete emotes, commands and others for the chat

// @version     1.1.1
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Autocomplete
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// @downloadURL https://update.greasyfork.org/scripts/5859/InstaSynchP%20Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/5859/InstaSynchP%20Autocomplete.meta.js
// ==/UserScript==

function Autocomplete(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP Autocomplete';
  this.menuActive = false;
  this.autocompleteEnabled = true;
  this.sources = [];
  this.selects = [];
  this.settings = [{
    label: 'Autocomplete chat commands starting with \'',
    id: 'autocomplete-commands',
    type: 'checkbox',
    'default': true,
    section: ['Chat', 'Autocomplete']
  }, {
    label: 'Autocomplete emotes starting with /',
    id: 'autocomplete-emotes',
    type: 'checkbox',
    'default': true,
    section: ['Chat', 'Autocomplete']
  }, {
    label: 'Sort the results of the autocomplete',
    id: 'autocomplete-sort',
    type: 'checkbox',
    'default': true,
    section: ['Chat', 'Autocomplete']
  }, {
    label: '# of results shown in the autocomplete',
    id: 'autocomplete-results',
    type: 'int',
    min: 0,
    'default': 7,
    size: 1,
    section: ['Chat', 'Autocomplete']
  }];
  this.styles = [{
    name: 'autocomplete',
    url: 'https://cdn.rawgit.com/Zod-/InstaSynchP-Autocomplete/b3812c5c3f27a72ff36d5f130b8e20ee96cad2ee/jquery-ui.css',
    autoload: true
  }];
}

Autocomplete.prototype.resetVariables = function () {
  "use strict";
  this.menuActive = false;
  this.autocompleteEnabled = true;
};

Autocomplete.prototype.addSource = function (source, select) {
  "use strict";
  this.sources.push(source);
  this.selects.push(select);
};

Autocomplete.prototype.executeOnce = function () {
  "use strict";
  var th = this;
  events.on(th, 'InputKeydown[9]', function (event) {
    if (!th.menuActive) {
      return;
    }
    event.keyCode = $.ui.keyCode.ENTER;
    $(this).trigger(event);
  });
  //emotes
  th.addSource(function (term) {
      if (!gmc.get('autocomplete-emotes')) {
        return [];
      }
      var lastIndex = term.lastIndexOf('/'),
        partToComplete = term.substring(lastIndex, term.length).toLowerCase();
      return $.map(Object.keys(window.$codes), function (item) {
        item = '/' + item;
        if (item.toLowerCase().startsWith(partToComplete)) {
          return item;
        }
      });
    },
    function (val, item) {
      //check if emote is at the beginning of the input
      if (window.$codes[item.substring(1, item.length)]) {
        return val.lastIndexOf(item) === 0;
      }
      return false;
    }
  );

  //commands
  th.addSource(function (term) {
      term = term.toLowerCase();
      if (!gmc.get('autocomplete-commands')) {
        return [];
      }
      return $.map(Object.keys(commands.getAll()), function (item) {
        var command = commands.get(item);
        if (item.startsWith(term)) {
          if (command.type === 'mod' && !isMod()) {
            return undefined;
          }
          return command.name;
        }
      });
    },
    function (val, item) {
      var command = commands.get(item);
      if (command) {
        return val.lastIndexOf(item) === 0 && !command.hasArguments;
      }
      return false;
    }
  );

  events.on(th, 'InputKeydown', function (event) {
    if (event.keyCode !== 40 && event.keyCode !== 38) {
      th.autocompleteEnabled = true;
    }
  });
};

Autocomplete.prototype.preConnect = function () {
  "use strict";
  var th = this;
  //add the jquery autcomplete widget to InstaSynch's input field
  $("#cin").autocomplete({
    delay: 0,
    minLength: 0,
    source: function (request, response) {
      var result = [],
        i,
        words = request.term.split(' '),
        last = words[words.length - 1];
      //return if autocomplete has been turned off by other plugins
      if (!th.autocompleteEnabled || last.length === 0 || request.term.length !==
        $('#cin')[0].selectionStart) {
        response(result);
        return;
      }
      for (i = 0; i < th.sources.length; i += 1) {
        try {
          result = result.concat(th.sources[i].apply(this, [last]));
        } catch (err) {
          logger().error(th.name, "Source Error", err);
        }
      }
      if (gmc.get('autocomplete-sort')) {
        result.sort();
      }

      response(result.slice(0, gmc.get('autocomplete-results')));
    },
    select: function (event, ui) {
      var val = this.value,
        uiVal = ui.item.value,
        i,
        instant = false;
      this.value = val.substring(0, val.lastIndexOf(uiVal[0])) + uiVal;

      for (i = 0; i < th.selects.length; i += 1) {
        try {
          //check if the item can be sent instantly
          if (th.selects[i].apply(this, [this.value, uiVal])) {
            instant = true;
            break;
          }
        } catch (err) {
          logger().error(th.name, "Select Error", err);
        }
      }
      if (instant) {
        $(this).trigger(
          $.Event('keypress', {
            which: 13,
            keyCode: 13
          })
        );
      } else {
        this.value = this.value + ' ';
      }
      return false;
    },
    autoFocus: true,
    focus: function () {
      return false;
    },
    close: function () {
      th.menuActive = false;
    },
    open: function () {
      th.menuActive = true;
    }
  }).on('paste', function () {
    th.autocompleteEnabled = false;
  });
};

window.plugins = window.plugins || {};
window.plugins.autocomplete = new Autocomplete('1.1.1');
