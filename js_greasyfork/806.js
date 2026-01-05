// ==UserScript==
// @name        Letterboxd.com to KG
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @namespace   http://userscripts.org/users/luckyluciano
// @description It adds a link in the right side panel for searching kg for torrents with the respective IMDb code(main film page) or Title(pages such as 'user reviewed film').
// @include     *letterboxd.com/*
// @version     3.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/806/Letterboxdcom%20to%20KG.user.js
// @updateURL https://update.greasyfork.org/scripts/806/Letterboxdcom%20to%20KG.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

function addLinkIMDB() {
      
     
             //IMDb search
           var imdbUrl = $(".text-link a").first().attr("href"); 
            var link = "https://karagarga.in/browse.php?search=" + getImdb(imdbUrl) + "&search_type=imdb";               
                                 
                    
           var l = $("#userpanel ul");
           var parent = l[0];
    
            var listItem = document.createElement('li');
            listItem.setAttribute('id','listitem');
               var a = document.createElement("a");
             a.innerHTML="KG - Search by IMDb code";
             a.setAttribute('href', link);
             listItem.appendChild(a);
            
             //DIRECTOR search
            var dir = $("#featured-film-header a")[1].innerHTML;
            var link2 = "https://karagarga.in/browse.php?dirsearch="+dir;  
    
           var listItem2 = document.createElement('li');
            listItem2.setAttribute('id','listitem2');
               var a2 = document.createElement("a");
             a2.innerHTML="KG - Search Director";
             a2.setAttribute('href', link2);
             listItem2.appendChild(a2);
    
             
              parent.appendChild(listItem);
             parent.appendChild(listItem2);
            $(l[0]).listview("refresh");
            
    }

function addLinkTitle() {
      
     
    // var parent = document.getElementById('featured-film-header');
             
            var title = $(".film-title-wrapper a").first().text(); 
            var link = "https://karagarga.in/browse.php?search=" + title + "&search_type=title";               
                 //alert(link);                
                    
           var l = $("#userpanel ul");
           var parent = l[0];
    
            var listItem = document.createElement('li');
            listItem.setAttribute('id','listitem');
             var a = document.createElement("a");
             a.innerHTML="KG - Search by Title";
             a.setAttribute('href', link);
             listItem.appendChild(a);
             
             parent.appendChild(listItem);
    
            $(l[0]).listview("refresh");
             
    
    }

function getImdb(href) {
    var from = href.indexOf("imdb.com/title/tt") + 17;
    if(from < 17)
        return null;
    var to = href.indexOf("/", from);
    if(to < 0)
        to = href.length;
    return href.substring(from, to);
}
 


String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
}

function xpath(query) {
    return document.evaluate(query, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

(function () {
    var href = window.location.href;
    if(!href.contains("letterboxd.com/film/") && href.contains("/film/"))
       addLinkTitle();
    else if(href.contains("letterboxd.com/film/"))
       addLinkIMDB();
       
})();