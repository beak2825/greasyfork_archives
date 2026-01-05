// ==UserScript==
// @name          Tumblr notes filtering, autoloading & counts
// @include       http://*tumblr.com/post/*
// @description   Allows filtering of Tumblr notes by type (with counts) & autoloading of all notes
// @version       1.3
// @author        JesseW
// @contributor   wOxxOm
// @license       MIT License
// @run-at        document-start
// @grant         none
// @namespace https://greasyfork.org/users/2423
// @downloadURL https://update.greasyfork.org/scripts/8737/Tumblr%20notes%20filtering%2C%20autoloading%20%20counts.user.js
// @updateURL https://update.greasyfork.org/scripts/8737/Tumblr%20notes%20filtering%2C%20autoloading%20%20counts.meta.js
// ==/UserScript==

// The original code for autoloading came from wOxxOm's script,
//available at: https://greasyfork.org/en/scripts/8157-tumblr-notes-autoload

window.addEventListener('DOMContentLoaded', function () {
  filterWhenLoadingMoreNotes();
  document.querySelector('.notes') .insertAdjacentHTML(
    'beforebegin', 
    '<div style="border: 2px black ridge">'
    + '<input checked id="with_commentary_checkbox" type="checkbox"/>Reblogs with commentary (<span id="with_commentary_count"></span>)'
    + '<br/><input checked id="reply_checkbox" type="checkbox"/>Replies (<span id="reply_count"></span>)'
    + '<br/><input checked id="reblog_checkbox" type="checkbox"/>Reblogs without commentary  (<span id="reblog_count"></span>)'
    + '<br/><input checked id="like_checkbox" type="checkbox">Likes  (<span id="like_count"></span>)'
    + '<br/><button id="loadallBtn">Load all notes</button></div>')
  document.getElementById('loadallBtn').addEventListener('click', clickMore);
  document.getElementById('with_commentary_checkbox').addEventListener('change', filterNotes);
  document.getElementById('reply_checkbox').addEventListener('change', filterNotes);
  document.getElementById('reblog_checkbox').addEventListener('change', filterNotes);
  document.getElementById('like_checkbox').addEventListener('change', filterNotes);
});

function filterWhenLoadingMoreNotes() {
    var more = document.querySelector('.more_notes_link');
  more.addEventListener('click', filterWhenLoadingMoreNotes);
  if (more) {
      var ob = new MutationObserver(function (mutations) {
      ob.disconnect();
        filterNotes();
        filterWhenLoadingMoreNotes()
    });
    ob.observe(more.parentNode.parentNode, {
      subtree: true,
      childList: true
    });
  }
}

function shouldFilter(note) {
  if (note.classList.contains('more_notes_link_container') ||
     (document.getElementById('with_commentary_checkbox').checked &&
      note.classList.contains('with_commentary')) || 
     (document.getElementById('reply_checkbox').checked &&
      note.classList.contains('reply')) ||
     (document.getElementById('reblog_checkbox').checked &&
      note.classList.contains('reblog') &&
      note.classList.contains('without_commentary')) ||
     (document.getElementById('like_checkbox').checked &&
      note.classList.contains('like'))) {
      return false;
  }
  return true;
}

function filterNotes() {
  var notes = document.querySelectorAll('.note');
  var counts = {'commentary': 0, 'reply': 0, 'reblog': 0, 'like': 0};
  for (var i = 0; i < notes.length; ++i) {
    notes[i].hidden = shouldFilter(notes[i]);
    if (notes[i].classList.contains('with_commentary')) {
      counts['commentary'] += 1
    } else if (notes[i].classList.contains('reply')) {
      counts['reply'] += 1
    } else if (notes[i].classList.contains('reblog') &&
              notes[i].classList.contains('without_commentary')) {
      counts['reblog'] += 1
    } else if (notes[i].classList.contains('like')) {
      counts['like'] += 1
    }
  }
  document.getElementById('with_commentary_count').textContent = counts['commentary'];
  document.getElementById('reply_count').textContent = counts['reply'];
  document.getElementById('reblog_count').textContent = counts['reblog'];
  document.getElementById('like_count').textContent = counts['like'];
}

function clickMore() {
  filterNotes();
  var more = document.querySelector('.more_notes_link');
  if (more) {
    more.click();
    var ob = new MutationObserver(function (mutations) {
      ob.disconnect();
      setTimeout(function () {
        clickMore()
      }, 200);
    });
    ob.observe(more.parentNode.parentNode, {
      subtree: true,
      childList: true
    });
  }
}
