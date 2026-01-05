// ==UserScript==
// @name        InstaSynchP Name Completion
// @namespace   InstaSynchP
// @description Autocomplete usernames by hitting tab

// @version     1.0.2
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Name-Completion
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// @require     https://greasyfork.org/scripts/6707-jquery-caret/code/jquerycaret.js?version=26377
// @downloadURL https://update.greasyfork.org/scripts/6708/InstaSynchP%20Name%20Completion.user.js
// @updateURL https://update.greasyfork.org/scripts/6708/InstaSynchP%20Name%20Completion.meta.js
// ==/UserScript==

function NameCompletion(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP Name Completion';
  this.doubleTabTimeoutId = undefined;
}

NameCompletion.prototype.executeOnce = function () {
  var th = this;

  function checkDoubleTab() {
    //check for double tabs within 500 ms
    if (typeof th.doubleTabTimeoutId !== 'undefined') {
      clearInterval(th.doubleTabTimeoutId);
      th.doubleTabTimeoutId = undefined;
      return true;
    }

    th.doubleTabTimeoutId = setTimeout(function () {
      th.doubleTabTimeoutId = undefined;
    }, 500);
    return false;
  }

  function getPartToComplete(str, caretPosition) {
    //go back from the caret position as long as it fits the username regex
    var temp, partToComplete = '';
    for (var i = caretPosition - 1; i >= 0; i -= 1) {
      temp = str.substr(i, caretPosition);
      if (isGreyname(temp)) {
        partToComplete = temp.toLowerCase();
      } else {
        break;
      }
    }
    return partToComplete;
  }

  function getUsers(partToComplete, comp) {
    //get all users that start with or contain partToComplete
    return $.map(window.room.userlist.users, function (user) {
      return (user.username.toLowerCase()[comp](partToComplete)) ? user.username : undefined;
    });
  }

  function printUsers(users) {
    var unique = [],
      output = '';
    //get unique users
    $.each(users, function (i, el) {
      if ($.inArray(el, unique) === -1) unique.push(el);
    });
    for (i = 0; i < unique.length; i += 1) {
      output += unique[i] + ' ';
    }
    addSystemMessage(output);
  }

  events.on(th, 'InputKeydown[9]', function () {
    var str = $('#cin').val(),
      caretPosition = $('#cin').caret(),
      partToComplete = getPartToComplete(str, caretPosition),
      startIndex = caretPosition - partToComplete.length;
    if (str === '' || partToComplete === '') {
      return;
    }
    var startsWithArr = getUsers(partToComplete, 'startsWith'),
      containsArr = getUsers(partToComplete, 'contains'),
      result;
    if (containsArr.length === 0 && startsWithArr.length === 0) {
      return;
    }
    if (startsWithArr.length > 1 || (containsArr.length > 1 && startsWithArr.length !== 1)) {
      if (checkDoubleTab()) {
        printUsers(startsWithArr.length > 1 ? startsWithArr : containsArr);
      }
      return;
    }

    result = startsWithArr[0] || containsArr[0];
    //put string back together with the found username
    str = '{0}{1}{2}'.format(
      str.substr(0, startIndex),
      result,
      str.substr(caretPosition)
    );
    //set string and cursor
    $('#cin').val(str).caret(startIndex + result.length);
  });
};

window.plugins = window.plugins || {};
window.plugins.nameCompletion = new NameCompletion('1.0.2');
