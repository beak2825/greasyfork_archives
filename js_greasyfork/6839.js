// ==UserScript==
// @name        Livelib ExternalSearch
// @version     0.7
// @description Integration with external sources - searching the book on external web-sites
// @namespace   http://greasyfork.org/ru/users/7350-plesk
// @match       http://www.livelib.ru/book/*
// @match       http://www.livelib.ru/work/*
// @copyright   2015, plesk
// @downloadURL https://update.greasyfork.org/scripts/6839/Livelib%20ExternalSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/6839/Livelib%20ExternalSearch.meta.js
// ==/UserScript==

//TODO Fix work-pages.

//The array with external sources
var sources = new Array(); 
//0 - The name of the source
//1 - URL of favicon
//2 - Search URL
//3 - The type of the search URL: 0 - the only name of the book, 1 - both the author and the name 

i = sources.length;
sources[i] = new Array();
sources[i][0] = "flibusta.is";                           
sources[i][1] = "http://flibusta.is/favicon.ico";        
sources[i][2] = "http://flibusta.is/booksearch?ask={0}"; 
sources[i][3] = 0; 

i = sources.length;
sources[i] = new Array();
sources[i][0] = "rutracker.org";                          
sources[i][1] = "http://rutracker.org/favicon.ico";       
sources[i][2] = "http://rutracker.org/forum/tracker.php?nm={0}"; 
sources[i][3] = 1;

//Format method. Builds string with parameters
String.prototype.format = String.prototype.f = function () {
    var args = arguments;
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m == "{{") { return "{"; }
        if (m == "}}") { return "}"; }
        return args[n];
    });
};

/* OLD version. Theoreticalty works with "work"-pages... Practicaly - not :(
//Единый код для поисковых кнопок
buttonHTML = '<a class="action" target="_blank" href="{0}" title="{1}"><span style="margin-right: 4px"><img src="{2}" height=17 width=17 align="top"></span>{3}</a>';

//Автор и название искомой книги
//Внезнапно структура сайта немного поменялась
author = document.getElementById('leftside').childNodes[9].childNodes[1].childNodes[0].textContest;
title  = document.getElementById('leftside').childNodes[5].textContest;

// Кнопку прилепим ниже кнопки с предложением загрузить книгу на свою полку
tg0 = document.getElementsByClassName('sources actionbar bar-vertical')
// Такой блок вроде последний
tg1 = tg0[tg0.length-1];
if (tg1.innerHTML.indexOf("externalsearch") == -1){
   // Добавим отбивочку
   tg1.innerHTML = tg1.innerHTML + '<br><hr>';
   tg1.innerHTML = tg1.innerHTML + '<div class="externalsearch">'
   tg1.innerHTML = tg1.innerHTML + '<a class="action" target="_blank">Искать электронную книгу</a>'
   sources.forEach(function(s) {
       // Кнопка поиска
       searchText = "";
       if(s[3] == 0){
         searchText = title;
       }else if(s[3] == 1){
         searchText = author + " " + title;
       }else{
         searchText = "";
       }    
               
       tg1.innerHTML = tg1.innerHTML + buttonHTML.format(s[2].format(searchText.replace(/\s/g, "+")), s[0], s[1], s[0]);
   }); 
   tg1.innerHTML = tg1.innerHTML + '</div>'
} 
*/

//The union source code for searching buttons
buttonHTML = '<a onclick="" target="_blank" class="source-action" href="{0}"><span style="margin-right: 4px"><img src="{1}" height=17 width=17 align="top"></span>{2}</a>';

//Author and name of the book
author = document.getElementsByClassName('author-name')[0].textContent;
title  = document.getElementsByClassName('author-name')[0].previousSibling.previousSibling.textContent;

//Header
header = document.createElement ("h2");
header.className = "source-ebook-search";
header.innerHTML = "Найти электронную книгу";

//Table
table = document.createElement("TABLE");
table.setAttribute("cellspacing", "0");
table.setAttribute("style", "");

sources.forEach(function(s) {
    // Search button
    searchText = "";
    if(s[3] == 0){
        searchText = title;
    }else if(s[3] == 1){
        searchText = author + " " + title;
    }else{
        searchText = "";
    }
    
    row = table.insertRow();
    cell1 = row.insertCell(0);
    cell1.innerHTML = buttonHTML.format(s[2].format(searchText.replace(/\s/g, "+")), s[1], s[0]);
    cell1.setAttribute("style", "");

    cell2 = row.insertCell(1);
    cell2.innerHTML = '<span class="source-action" style="white-space: nowrap;margin-left: 20px;padding-left: 2px;">бесплатно</span>';
    cell2.setAttribute("style", "text-align: right; font-weight: bold; color:#018b11;");
});

//Here we add our custom search buttons for free of charge sources afrewards all other sources
sources_inner = document.getElementsByClassName('sources-inner')[0];
sources_inner.insertBefore(header, sources_inner.lastChild);
sources_inner.insertBefore(table , sources_inner.lastChild);
