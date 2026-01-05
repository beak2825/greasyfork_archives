// ==UserScript==
// @name Spammers be gone!
// @namespace Deadman
// @description : This script will provide a feature to block unwanted threads 
//                  on Warlight forums.
//
//
// @include https://www.warlight.net/Forum/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
//
// @version 1.3.1
// @downloadURL https://update.greasyfork.org/scripts/8981/Spammers%20be%20gone%21.user.js
// @updateURL https://update.greasyfork.org/scripts/8981/Spammers%20be%20gone%21.meta.js
// ==/UserScript==


function main()
{
  var path = window.location.pathname;
  if(isForumPostPage(path))
  {
    // TODO : Ignore posts from blacklisted players
  }

  if(isMainForumPage(path))
  {
      // Do nothing
  }
  
  if(isAllForumPage(path))
  {
      newColumnCountOnPage = 5;
      showIgnoreCheckBox(newColumnCountOnPage);    
      hideIgnoredThreads();
  }

  if(isSubForumPage(path))
  {
      newColumnCountOnPage = 4;
      showIgnoreCheckBox(newColumnCountOnPage);    
      hideIgnoredThreads();
  }
}

/**
 * Check if given path is a Forum post.
 */
function isForumPostPage(path) {
    var ForumPostPage = new RegExp('^\/Forum/[0-9]+(\/-*[A-Z]*[0-9]*[a-z]*)*' , 'i');
    return ForumPostPage.test(path);
}

/**
 * Check if given path is a Sub-forum page.
 */
function isSubForumPage(path) {
    var SubForumPage = new RegExp('^\/Forum\/[A-Z]+([A-Z]*[a-z]*[0-9]*\-*)*' , 'i');
    return SubForumPage.test(path);
}

/**
 * Check if given path is the Main Forum page.
 */
function isMainForumPage(path) {
    var ForumMainPage = new RegExp('^\/Forum\/$' , 'i');
    return ForumMainPage.test(path);
}

/**
 * Check if given path is the All posts Forum page.
 */
function isAllForumPage(path) {
    var ForumAllPage = new RegExp('^\/Forum\/Forum$' , 'i');
    return ForumAllPage.test(path);
}

/**
 * Inserts a new column of check boxes for each Forum thread.
 */
function showIgnoreCheckBox(columnCountOnPage) {
  var $row = "<th> Ignore <button type='button' onClick='undoIgnore()'>Undo All</button> </th>";
  var header = $("table.region tr:first");
    
  if(header.children("th").length < columnCountOnPage) 
  {
      header.append($row);
  }
  
  var allPosts = $('table.region tr').not(':first');
    
  allPosts.each(function( index, post){
    if($(this).children("td").length < columnCountOnPage) 
    {
      var postId = $(this).find('a:first').attr('href');
      $(this).append("<td> <input type='checkbox' name='"+ postId +"' class='checkbox' value='Yes'/> </td>");
    }
  }); 
}

/**
 * Clears any previous blacklisted threads. Sub-Forum pages look as 
 * shown by Warlight.
 */
function undoIgnore()
{
  // reset blacklisted threads to empty list
  setBlacklistedThreads([]);
  
  var allPosts = $('table.region tr').not(':first');
  
  // show all threads.
  allPosts.each(function( index, post){    
      $(this).show();        
  });
}

/**
 * Hides all threads marked as "ignored" by a user.
 */
function hideIgnoredThreads(blacklistedThreads)
{
  var blackListedThreads = getBlacklistedThreads();
  
  var allPosts = $('table.region tr').not(':first');
  
  allPosts.each(function( index, post){
    var postId = $(this).find('a:first').attr('href');
      
    if($.inArray(postId, blackListedThreads) > -1){
      $(this).hide();
    }    
  });
}

/**
 * Gets all the threads which have ever been blacklisted by a user from
 * local storage.
 */
function getBlacklistedThreads()
{
  var blackListedThreads = [];
      
  try {
    blackListedThreads = JSON.parse(localStorage["blackListedThreads"]);       
  }
  catch(err) {
    // No previous threads blacklisted.
  }  
  
  return blackListedThreads;
}

/**
 * Update local storage with new list of blacklisted threads.
 */
function setBlacklistedThreads(blacklistedThreads)
{
  localStorage["blackListedThreads"] = JSON.stringify(blacklistedThreads);
}


/**
 * On check-box click event, update blacklisted threads and hide them.
 */
$(document).on("change", ".checkbox", function(){
    if(this.checked) {
      var postId = $(this).parent().parent().find('a:first').attr('href');
      var blackListedThreads = getBlacklistedThreads();
      
      blackListedThreads.push(postId);
      
      setBlacklistedThreads(blackListedThreads);
      hideIgnoredThreads();
    }
});

main();