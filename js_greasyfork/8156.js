// ==UserScript==
// @name        FFN Filters Auto-Select
// @description Auto-selects fanfiction.net filters.
// @include     *://*.fanfiction.net/*
// @include     *://*.fictionpress.com/*
// @version     1.4
// @copyright   2014+, Azurewren
// @history     1.4 14th Aug 2015 - Tweaks. Fixed unsafeWindows error. 
// @history     1.3 Added comments/documentation.
// @history     1.2 Bug fixing.
// @history     1.1 Bug fixing.
// @history     1.0 First Version. 
// @namespace https://greasyfork.org/users/3972
// @downloadURL https://update.greasyfork.org/scripts/8156/FFN%20Filters%20Auto-Select.user.js
// @updateURL https://update.greasyfork.org/scripts/8156/FFN%20Filters%20Auto-Select.meta.js
// ==/UserScript==

// HOW TO (Until I can figure out how to create a options menu)
//   For each filter option on ffn create a 'setting preference' entry. 
//   All values should be exact. 
//   Setting Preference name should not be the same name as on ffn. 
//   To remove a filter preference, simply remove its USER SETTING PREFERENCE.

// USER SETTING PREFERENCES
// Format: 'setting filtername: "exact text as ffn filtername option",' 
settings = {
  language: 'English',
  rating: 'Rating: All',
  wordlength: '> 20K words'
};

var $ = unsafeWindow.$;
var filter = $('form[name="myform"]');

// FFN SETTINGS
// Format: 'exact ffn filtername: {prefer: settings.usersettingname, default: '0'},'
var filteroptions = {
  languageid: {prefer: settings.language, default: '0'},
  censorid: {prefer: settings.rating, default: document.URL.search('fanfiction.net/community/') === - 1 ? '103' : '3'},
  length: {prefer: settings.wordlength, default: '0'}
};

function select(values, name) {
  var filteroption = filter.find('select[name="' + name + '"]');
  if (filteroption.val() === values.default) {
    var option = filteroption.find('option:contains("' + values.prefer + '")');
    return option.length && filteroption.val(option.val());
  }
};

if ($.map(filteroptions, select).some(function (a) {
  return a;
})) {
  filter.find('span.btn-primary, input[type="Submit"]').click();
}