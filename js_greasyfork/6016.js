// ==UserScript==
// @name        MyAnimeList - Genre filter for anime lists
// @namespace   mal.tools.filterbygenre
// @description Filters animelists by genre. All anime entries without tags will be set to a comma separated list of genres to enable filtering. Warning: has functionality that permanently deletes all current tags when used.
// @include     https://myanimelist.net/animelist/*
// @version     1.1.4
// @downloadURL https://update.greasyfork.org/scripts/6016/MyAnimeList%20-%20Genre%20filter%20for%20anime%20lists.user.js
// @updateURL https://update.greasyfork.org/scripts/6016/MyAnimeList%20-%20Genre%20filter%20for%20anime%20lists.meta.js
// ==/UserScript==

// SETTINGS
const INIT_HIDE_TAGS = true; // true => tags/genres are hidden by default; false => tags/genres are shown by default
const AJAX_DELAY = 300; // delay between requests. Shouldn't go lower than 300, but you may want to set it slightly higher if some tags/genres are skipped when populating/clearing them.

// START
addButtons();
init();

// FUNCTIONS
function addButtons(){
    $(  "<span>&nbsp;&nbsp;|&nbsp;&nbsp;"+
            "<a onclick='window.populateAllTags();' style='cursor: pointer;'>Populate tags</a>&nbsp;&nbsp;"+
            "<a onclick='if(confirm(\"Are you sure you want to wipe all tags?\")){ window.clearAllTags(); }' style='cursor: pointer;'>Clear tags</a>&nbsp;&nbsp;"+
            "<a onclick='window.showHideAllTags();' style='cursor: pointer;'>Show/hide tags</a>&nbsp;&nbsp;"+
            "<a onclick='location = \""+getBaseUrl()+"\";' style='cursor: pointer;'>Clear filter</a>"+
        "</span>")
        .insertAfter("#mal_cs_otherlinks div:last a:last");
}

window.showHideAllTags = function(){
    $("span[id*='tagLinks']").each(function(){
        $(this).toggle();
    });
}

window.populateAllTags = function(){
    var counter = 0;
    
    $('.animetitle').each(function(index){
        var ID = $(this).attr('href').match(/\d+/)[0];
        var tagElm = '#tagLinks' + ID;
        var animeInfoURL = "https://myanimelist.net/includes/ajax.inc.php?t=64&id=" + ID;
        var setTagURL = "https://myanimelist.net/includes/ajax.inc.php?t=22&aid=" + ID + "&tags=";
        
        if($(tagElm).children().length == 0){
            window.setTimeout(populateTag, AJAX_DELAY * counter++, tagElm, animeInfoURL, setTagURL);
        }
    });
}

window.clearAllTags = function(){
    var counter = 0;
    
    $('.animetitle').each(function(index){
        var ID = $(this).attr('href').match(/\d+/)[0];
        var tagElm = '#tagLinks' + ID;
        var setTagURL = "https://myanimelist.net/includes/ajax.inc.php?t=22&aid=" + ID + "&tags=";
        
        if($(tagElm).children().length != 0){
            window.setTimeout(clearTag, AJAX_DELAY * counter++, tagElm, setTagURL);
        }
    });
}

function clearTag(tagElm, setTagURL){
    $.get(setTagURL, function(data){
        $(tagElm).html(data);
    });
}

function populateTag(tagElm, animeInfoURL, setTagURL){
    $.get(animeInfoURL, function(data){
        var genres = data.match(/Genres:<\/span>.*?(.*)</)[1];
        $.get(setTagURL + genres, function(data){
            $(tagElm).html(data);
        });
    });
}

function init(){
    var url = window.location.href;
    
    if(typeof($) == 'undefined'){
        var $ = unsafeWindow.jQuery;
    }
    if(typeof($) != 'function'){
        alert('ERROR: failed to use/load jQuery!!')
    }
    // Defines :ContainsAll as a case insensitive version of :contains with multiple, comma-seperated args
    jQuery.expr[":"].ContainsAll = jQuery.expr.createPseudo(function(arg) {
        return function( elem ) {
            var elm = jQuery(elem).text().toUpperCase();
            var genreArray = arg.split(',');
            
            for(var i = 0; i < genreArray.length; i++){
                if(elm.indexOf(genreArray[i].toUpperCase()) == -1){
                    return false;
                }
            }
            return true;
        };
    });
    if(INIT_HIDE_TAGS){
        $("span[id*='tagLinks']").each(function(){
            $(this).hide();
        });
    }
    filter(url);
    $(window).bind('hashchange', function() {
        filter(window.location.href);
    });
}

function filter(url){
    var hashtagIndex = url.indexOf('#')
    var nextParamIndex = url.indexOf(',', hashtagIndex);
    // Hide all tags if no genres are specified; else start filtering
    if(hashtagIndex != -1){
        var genre = (nextParamIndex == -1) ? url.slice(hashtagIndex + 1) : url.slice(hashtagIndex + 1, url.length);
        if(genre.length > 0){
            filterByGenre(genre.replace(/%20/g, ' '));
        }
    }
    replaceAllTagLinks(url);
}

function filterByGenre(genre){
    $("table:has(span[id*='tagLinks']:not(:ContainsAll(" + genre + ")))").each(function(){
        $(this).hide();
    });
    $("table:has(span[id*='tagLinks']:ContainsAll(" + genre + "))").each(function(){
        $(this).show();
    });
}

function replaceAllTagLinks(url){
    var hashtagIndex = url.indexOf('#');
    if(hashtagIndex == -1){
        url = url + "#";
        hashtagIndex = url.length;
    }
    
    
    $("span[id*='tagLinks'] a").each(function(){
        if(url.indexOf($(this).text()) == -1){
            $(this).attr('href', url.slice(0, hashtagIndex + 1) + $(this).text() + "," + url.slice(hashtagIndex + 1));
        }else{
            $(this).attr('href', url);
        }
        var href = $(this).attr('href');
        if(href.slice(-1) == ","){
            href = href.slice(0, href.length-1);
            $(this).attr('href', href);
        }
        $(this).unbind('click').click(function(){
            filter(href);
        });
    });
}

function getBaseUrl(){
    var url = window.location.pathname;
    var ampIndex = url.indexOf('&');
    
    if(ampIndex == -1) return url;
    else return url.slice(0, url.indexOf('&'));
}