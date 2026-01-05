// ==UserScript==
// @name        KAT - Sort FAQ
// @namespace   Sort FAQ
// @version     1.00
// @description Sorts FAQ by most recently updated
// @include   /https?:\/\/kickass.to\/faq\/(?!suggest|my|search)[\w-]+\//
// @downloadURL https://update.greasyfork.org/scripts/9719/KAT%20-%20Sort%20FAQ.user.js
// @updateURL https://update.greasyfork.org/scripts/9719/KAT%20-%20Sort%20FAQ.meta.js
// ==/UserScript==

// Sort function from http://stackoverflow.com/questions/7831712/jquery-sort-divs-by-innerhtml-of-children#answers-header
function sortUsingNestedText(parent, childSelector, keySelector) {
    var items = parent.children(childSelector).sort(function(a, b) {
        var vA = getDate($(keySelector, a).text());
        var vB = getDate($(keySelector, b).text());
        return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    });
    parent.append(items);
}

// Written to parse everything in terms of hours to be able to sort
function getDate(text)
{
 var total = 0;
 text = text.substr(18);
 seperator = String.fromCharCode(160);
 if (text.search("yesterday") == -1) 
 {
     var hours = text.search(/\d+\shours?/);
     if (hours != -1) total += parseInt(text.substr(hours, text.indexOf(seperator, hours)));
     var days = text.search(/\d+\sdays?/);
     if (days != -1) total += parseInt(text.substr(days, text.indexOf(seperator, days))) * 24;
     var weeks = text.search(/\d+\sweeks?/);
     if (weeks != -1) total += parseInt(text.substr(weeks, text.indexOf(seperator, weeks))) * 24 * 7;
     var months = text.search(/\d+\smonths?/);
     if (months != -1) total += parseInt(text.substr(months, text.indexOf(seperator, months))) * 24 * 7 * 4;
     var years = text.search(/\d+\syears?/);
     if (years != -1) total += parseInt(text.substr(years, text.indexOf(seperator, years))) * 24 * 7 * 4 * 12;
 }
 else
 {
     total = 24;
 }
 return total;
}

// Perform sort
sortUsingNestedText($('.questionList'), "li", "span");

// Add (never updated) if there is no update date
jQuery(".questionList li").filter(function() {
    return this.children.length == 1;
}).append('&nbsp;<span class="font11px lightgrey">(never updated)</span>');
