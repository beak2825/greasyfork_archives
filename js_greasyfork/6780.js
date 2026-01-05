// ==UserScript==
// @name          Bibliotik LibraryChecker
// @version       2.1.1
// @author        phracker ( fork of a script by munkybare )
// @namespace     https://bibliotik.org/users/27317
// @description   Check Overdrive libraries for request items.
// @include       http*://bibliotik.org/requests
// @include       http*://bibliotik.org/requests/*
// @include       http*://bibliotik.org/*/*/requests*
// @include       http*://bibliotik.org/*/*/requests/*
// @require       https://code.jquery.com/jquery-latest.min.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/6780/Bibliotik%20LibraryChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/6780/Bibliotik%20LibraryChecker.meta.js
// ==/UserScript==

var category_match = {
  "Applications": "https://dl.dropboxusercontent.com/s/wuhqbdmacu5rfu3/Applications_match2.png",
  "Audiobooks": "https://dl.dropboxusercontent.com/s/jsh958h8yh2ebj6/Audiobooks_match2.png",
  "Articles": "https://dl.dropboxusercontent.com/s/9y5ukpvqjvpmjmh/Articles_match2.png",
  "Ebooks": "https://dl.dropboxusercontent.com/s/q3r81n0a13643es/Ebooks_match2.png",
  "Journals": "https://dl.dropboxusercontent.com/s/idkhcr547z3y2sv/Journals_match2.png",
  "Comics": "https://dl.dropboxusercontent.com/s/jutqv12hux26sh4/Comics_match2.png",
  "Magazines": "https://dl.dropboxusercontent.com/s/4sy0iwno3ibdwaq/Magazines_match2.png"
};

function insertStylesheet() {
  //<link rel="stylesheet" href="animate.min.css">
  ss_url = "https://dl.dropboxusercontent.com/s/dxcqyd1nyiu63ma/animate.min.css";
  ss = document.createElement('link');
  ss.setAttribute('rel','stylesheet');
  ss.setAttribute('href',ss_url);
  document.head.appendChild(ss);
};

$(document).ready(function() {

  insertStylesheet();

  var path = window.location.pathname, inputFieldLibraries, GMSavedLibraries;

  // Load saved settings if they exist
  if (typeof GM_getValue('GMSavedLibraries') !== 'undefined') {
    GMSavedLibraries = GM_getValue('GMSavedLibraries').split(',');
    inputFieldLibraries = GMSavedLibraries.join(',');
  }
  else {
    inputFieldLibraries = 'Case Sensitive,Library 1,Library 2';
    GMSavedLibraries = inputFieldLibraries.split(',');
  }
  // Check and run different parts of the script on appropriate pages
  // Main request page
  if(/^\/requests(?:\/)?$/.test(path)) {
    var searchForm = $('form[name="searchform"]');
    // Input field for users libraries
    $('tbody', searchForm).prepend('<tr><td class="Flabel"><label for="libraryOptions">Libraries:</label></td><td class="Ffield"> <input id="libraryOptions" type="text" value="" name="libraryOptions" size="95"><button id="setLibraryOptions" value="Set" type="button" role="button">Set</button><td></tr><br>');
    $('#libraryOptions').val(inputFieldLibraries);
    $('#setLibraryOptions').click(function() {
      GM_setValue('GMSavedLibraries', $('#libraryOptions').val());
    });
    checkLibraries(GMSavedLibraries);
  }
  // Single request page (description)
  if(/^\/requests\/[0-9]+(?:\/)?$/.test(path)) {
    var matchedLibrary;
    var matchedLibraries = [];
    // #todo: Need something smart here... maybe add jquery objects to array.
    for (var i = 0; i < GMSavedLibraries.length; i++) {
      matchedLibrary = $('a').filter(function(index) { return $(this).text() == GMSavedLibraries[i]; });
      if (matchedLibrary.text() !== '') {
        matchedLibrary.css({ 'background-color': '#464646', 'color': '#FFFFFF' });
        matchedLibraries.push(matchedLibrary.clone());
      }
    }
    if (matchedLibraries.length > 0) {
      $('#description').prepend('<br>');
      $.each(matchedLibraries, function(i) {
        $('#description').prepend(this.append('<br>'));
      });
      $('#description').prepend('<strong>Your libraries:</strong><br>');
    }
  }
  // Categories
  if(/^\/\w+\/[0-9]+\/requests(?:\/)?$/.test(path)) {
    checkLibraries(GMSavedLibraries);
  }
  for (var i = $('span[class="title"] a').length - 1; i >= 0; i--) {
    $('span[class="title"] a')[i].textContent = $('span[class="title"] a')[i].textContent.replace(/\W*Related titles:$/,'');
  };
  var matches = [];
  // Can be used on pages which follow the same table structure
  function checkLibraries(libraries) {
    $('a[href$="bibliotik.org/tags/20911"]').each(function(index) {
      var tableRow =$(this).parents().eq(2),
      title = $('span[class="title"] a', tableRow),
      statusCell = tableRow.children().eq(0),
      categoryImage = $('td img', tableRow)[0];
      GM_xmlhttpRequest({
        method: "GET",
        url: title.attr('href'),
        onload: function(response) {
          // Easy way to transform the responseText into a jQuery object
          var responseObject = $(response.responseText);
          var matchedLibraryLink;
          var libraryWasFound = false;
          for (var i = 0; i < libraries.length; i++) {
            matchedLibraryLink = $('a', responseObject).filter(function(index) { return $(this).text() == libraries[i]; });
            if (matchedLibraryLink.text() == libraries[i]) {
              console.log('Match: ' + title.text().replace(/\W+/,' ') + ' @ '+ matchedLibraryLink.text());
              libraryWasFound = true;
            }
          }
          if (libraryWasFound) {
            statusCell.css({ 'opacity': 0.9 });
            tableRow.css({
              '-webkit-filter': 'brightness(160%)'
            });
            // tableRow.class = tableRow.class + ' od_match';
            // tableRow.addClass('animated infinite pulse');
            categoryImage.src = category_match[categoryImage.title];
            matches.push(tableRow);
          }
          else {
            statusCell.css({ 'opacity': 0.5 });
          }
        }
      });
    });
  }  
});