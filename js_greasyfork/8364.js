// ==UserScript==
// @name        HPMOR Checklist
// @namespace   http://jaredtylermiller.com
// @description Adds a checkbox to each chapter. Stores checked history.
// @include     http://hpmor.com/
// @include     http://hpmor.com/chapter/*
// @require     https://code.jquery.com/jquery-1.11.2.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/store.js/1.3.14/store.min.js
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/8364/HPMOR%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/8364/HPMOR%20Checklist.meta.js
// ==/UserScript==


// Grab chapter from URL if possible
var chapterPath = window.location.pathname.split("/")

// If so, let's store that we've read it in DB
if (chapterPath.length === 3) {
  var chapter = chapterPath[chapterPath.length -1]
  store.set(chapter, true)
}

// Add a checkbox to every chapter and check if it needed
$(".toclist a").each(function() {
  var link = $(this),
      chapter = link.closest("li").index()+1

  link.before("<input type='checkbox'>")
  saved = store.get(chapter)

  if (typeof saved !== "undefined") {
    link.siblings("input").prop("checked", saved)
  }
})

// Store in DB if we click a link
$(".toclist a").click(function(e) {
  e.preventDefault()
  var chapter = $(this).closest("li").index()+1,
      checkbox = $(this).find("input"),
      checked = checkbox.prop("checked")

  store.set(chapter, !checked)
  checkbox.prop("checked", !checked)
  window.location.href = $(this).attr("href")
})

// Store when clicking checkboxes
$(".toclist input").click(function(e) {
  var chapter = $(this).closest("li").index()+1,
      checked = $(this).prop("checked")

  store.set(chapter, checked)
})
