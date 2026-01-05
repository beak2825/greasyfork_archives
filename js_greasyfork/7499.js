// ==UserScript==
// @name        tftv keyboard shortcuts
// @namespace   Lense
// @description Adds keyboard shortcuts for navigating forum pages on teamfortress.tv
// @include     /^https?://(www\.)?teamfortress.tv/.*/
// @version     0.5.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7499/tftv%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/7499/tftv%20keyboard%20shortcuts.meta.js
// ==/UserScript==

// Toggle highlighting of focused post. With this off, there are no visual changes.
var focus_highlight = true;

/*
 * Style post with a highlight
 */
function focus_post(post) {
  if(!focus_highlight) {
    return;
  }
  post.style.background = "#fff";
  post.style.boxShadow = "1px 1px 8px";
  post.style.zIndex = "1";
}

/*
 * Reset style to normal
 */
function unfocus_post(post) {
  post.style.background = "";
  post.style.boxShadow = "";
  post.style.zIndex = "";
}

/*
 * Helper function to scroll to post by id
 */
function goto_post(id) {
  unfocus_post(document.getElementById(prev_post_id));
  prev_post_id = id;

  var post = document.getElementById(id);
  post.scrollIntoView();
  // Show upper border
  window.scrollBy(0,-1);
  // Highlight the current post
  focus_post(post);
}

/*
 * Update styles on plus/minus frag and send the http request
 * id is the post id
 * frag_action is either plus or minus
 */
function frag(id, frag_action) {
  var btn_container = document.querySelector('.post-frag-container[data-post-id="'+id+'"]');
  var type;
  if(btn_container.classList.contains("self")) {
    // This post doesn't actually have frags; it's the OP.
    type = "thread";
    btn_container = document.querySelector('.thread-frag-container' + (type=="post" ? '[data-'+type+'-id="'+id+'"]' : ''));
  } else {
    type = "post";
  }

  // Most of this is ripped+modified from tftv js
  var frag_status = btn_container.attributes["data-frag-status"].value;
  if(frag_status == 'neutral' && frag_action == 'plus' || frag_status == 'minused' && frag_action == 'minus')
    var diff = 1;
  if(frag_status == 'neutral' && frag_action == 'minus' || frag_status == 'plused' && frag_action == 'plus')
    var diff = -1;
  if(frag_status == 'minused' && frag_action == 'plus')
    var diff = 2;
  if(frag_status == 'plused' && frag_action == 'minus')
    var diff = -2;
  var frag_count_container = type=="post" ? btn_container.firstElementChild : btn_container.querySelector("#thread-frag-count");
  var new_frag_count = parseInt(frag_count_container.textContent, 10) + diff;
  frag_count_container.textContent = new_frag_count;
  if(type == "post") {
    btn_container.children[0].classList.remove("positive");
    btn_container.children[0].classList.remove("negative");
    btn_container.children[0].classList.remove("neutral");
    btn_container.children[0].classList.add(new_frag_count > 0 ? "positive" : (new_frag_count < 0 ? "negative" : "neutral"));
  }

  if(frag_status == 'plused' && frag_action == 'plus' || frag_status == 'minused' && frag_action == 'minus')
    new_status = 'neutral';
  if(frag_action == 'plus' && frag_status !== 'plused')
    new_status = 'plused';
  if(frag_action == 'minus' && frag_status !== 'minused')
    new_status = 'minused';
  btn_container.setAttribute("data-frag-status", new_status);

  var plus_classes = btn_container.querySelector("." + type + "-frag-btn.plus").classList;
  var minus_classes = btn_container.querySelector("." + type + "-frag-btn.minus").classList;
  if(frag_action == "plus") {
    if(plus_classes.contains("clicked")) {
      plus_classes.remove("clicked");
    } else {
      plus_classes.add("clicked");
    }
    minus_classes.remove("clicked");
  } else {
    if(minus_classes.contains("clicked")) {
      minus_classes.remove("clicked");
    } else {
      minus_classes.add("clicked");
    }
    plus_classes.remove("clicked");
  }

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState == XMLHttpRequest.DONE) {
      if(xmlhttp.status != 200) {
        alert('VOTE NOT SENT');
      }
    }
  }
  xmlhttp.open("POST", '/' + type + '/frag/' + (type=="post" ? id : btn_container.attributes["data-thread-id"].value) + '/' + frag_action, true);
  xmlhttp.send();
}

/*
 * Find the number of pages in the thread
 */
var pageList = document.querySelectorAll(".mod-page:not(.mod-to-top):not(.mod-to-bottom)");
var lastPage = pageList.length > 0 ? parseInt(pageList[pageList.length - 1].textContent) : 1;

var posts = document.querySelectorAll(".post");
focus_post(posts[0]);
var cur_post_index = 0;
var prev_post_id = posts[0].id;

/*
 * Handle keypresses
 */
document.onkeypress = function(e) {
  // Not entirely sure why this is useful, but it can't break anything that isn't already broken
  e = e || window.event;
  // Ignore keypresses in text boxes, but allow if nothing or a link is selected
  if(e.target.nodeName != "BODY" && e.target.nodeName != "A") {
    // Got keypress, but it's probably in a textbox, so ignore it
    return;
  }

  // Current page number
  var page = window.location.search == "" || parseInt(window.location.search.match("page=([0-9]*)")[1]);

  switch(e["key"]) {
    /*
     * Pages (left/right)
     */
    case "d":
      if(page != lastPage) {
        page = (page+1).toString();
        window.location.search = "?page=" + page;
      }
      break;
    case "a":
      if(page != 1) {
        page = (page-1).toString();
        window.location.search = "?page=" + page;
      }
      break;
    case "D":
      if(page != lastPage) {
        window.location.search = "?page=" + lastPage.toString();
      }
      break;
    case "A":
      if(page != 1) {
        window.location.search = "?page=1";
      }
      break;
    /*
     * Posts (up/down)
     */
    case "w":
      if(cur_post_index > 0) {
        cur_post_index--;
      }
      goto_post(posts[cur_post_index].id);
      break;
    case "s":
      if(cur_post_index < posts.length - 1) {
        cur_post_index++;
      }
      goto_post(posts[cur_post_index].id);
      break;
    case "W":
      cur_post_index = 0;
      goto_post(posts[cur_post_index].id);
      break;
    case "S":
      cur_post_index = posts.length - 1;
      goto_post(posts[cur_post_index].id);
      break;
    /*
     * Frags (+/-)
     */
    case "q":
      frag(posts[cur_post_index].id.slice(8), "plus");
      break;
    case "e":
      frag(posts[cur_post_index].id.slice(8), "minus");
      break;
  }};