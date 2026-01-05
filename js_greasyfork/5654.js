// ==UserScript==
// @name        InstaSynchP Input History
// @namespace   InstaSynchP
// @description Plugin to browse your chat history
// @version     1.1.2
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Input-History
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// @downloadURL https://update.greasyfork.org/scripts/5654/InstaSynchP%20Input%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/5654/InstaSynchP%20Input%20History.meta.js
// ==/UserScript==

function InputHistory(version) {
    "use strict";
    this.version = version;
    this.name = 'InstaSynchP Input History';
    this.history = [''];
    this.index = 0;
}

InputHistory.prototype = {
    get history() {
        return this._history;
    },
    set history(value) {
        this._history = value;
    },

    get index() {
        return this._index % this._history.length;
    },
    set index(value) {
        if (value < 0) {
            value = this._history.length - 1;
        }
        this._index = value;
        //disable autocomplete when browsing history
        if (window.plugins.autocomplete) {
            window.plugins.autocomplete.autocompleteEnabled = (this.index === 0);
        }
    }
};

InputHistory.prototype.executeOnce = function () {
    "use strict";
    var th = this;
    events.on(th, 'SendChat', function (message) {
        if (th.index !== 0) {
            //remove the string from the array
            th.history.splice(th.index, 1);
        }
        //add the string to the array at position 1
        th.history.splice(1, 0, message);
        th.index = 0;
    });

    function checkAutocomplete() {
        if (window.plugins.autocomplete && window.plugins.autocomplete.menuActive && th.index === 0) {
            return true;
        }
        return false;
    }

    events.on(th, 'InputKeydown[38]', function () {
        if (checkAutocomplete()) {
            return;
        }
        th.index += 1;
        th.writeHistory();
    });
    events.on(th, 'InputKeydown[40]', function () {
        if (checkAutocomplete()) {
            return;
        }
        th.index -= 1;
        th.writeHistory();
    });
};

InputHistory.prototype.writeHistory = function () {
    "use strict";
    var len = this.history[this.index].length;
    $('#cin').val(this.history[this.index]);
    $('#cin')[0].setSelectionRange(len, len);
};

InputHistory.prototype.resetVariables = function () {
    "use strict";
    this.index = 0;
};
window.plugins = window.plugins || {};
window.plugins.inputHistory = new InputHistory('1.1.2');
