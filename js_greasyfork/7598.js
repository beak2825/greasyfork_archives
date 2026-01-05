// ==UserScript==
// @name           Adervarul Curat
// @name:ro        Adervarul Curat
// @version        0.5
// @description    Hides annoying tabloid articles from the from the first page, and replaces naughty words with better ones
// @description:ro Ascunde articolele de tabloid de pe prima pagina, si inlocuieste cuvintele nepotrivite
// @author         Razvan Pat
// @match          http://adevarul.ro/*
// @require http://code.jquery.com/jquery-latest.js
// @require http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js
// @run-at document-end
// @namespace https://greasyfork.org/users/8565
// @downloadURL https://update.greasyfork.org/scripts/7598/Adervarul%20Curat.user.js
// @updateURL https://update.greasyfork.org/scripts/7598/Adervarul%20Curat.meta.js
// ==/UserScript==


$.fn.directText = function() {
    var str = '';

    this.contents().each(function() {
        if (this.nodeType == 3) {
            str += this.textContent || this.innerText || '';
        }
    });

    return str;
};

jQuery.extend(jQuery.expr[':'], { 
    containsText: function(node, index, meta) {
        if(node.nodeName.toLowerCase() == 'iframe') {
            return false;
        }
        return $(node).directText().indexOf(meta[3]) != -1;
    }
}); 

//Hide front page articles
$('span.category-tag:contains("click.ro")').parents('article').hide();
$('span.category-tag:contains("wowbiz.ro")').parents('article').hide();
$('span.category-tag:contains("Realitatea.net")').parents('article').hide();
$('span.category-tag:contains("cancan.ro")').parents('article').hide();
$('.antena-3-cross').hide();

var naughtyWords = [
    ['penisului', 'lalelei'],
    ['penisuri', 'lalele'],    
    ['penisul', 'laleaua'],
    ['penis', 'lalea'],
    ['sex oral', 'un desen'],
    ['sexualizate', 'înfrumusețate'],
    ['sexuală', 'frumoasă'],
    ['sexuale', 'florale'],
    ['sexului', 'florei'],
    ['sexul', 'flora'],
    ['sex', 'gem'],
    ['căcatul', 'ciocolata'],
    ['căcat', 'ciocolată'],
    ['în pielea goală', 'în șlapi'],
    ['organele genitale ale', 'culorile'],
    ['organele genitale', 'culorile'],
    ['organe genitale', 'culori'],
    ['pornografică', 'de râs'],
    ['pornografic', 'de râs'],
    ['porno', 'de comedie']
];

var allNaughty = [];

_.forEach(naughtyWords, function(word) {
    allNaughty.push(word);
    allNaughty.push([toTitleCase(word[0]), toTitleCase(word[1])]);
    allNaughty.push([capitalize(word[0]), capitalize(word[1])]);
});

_.forEach(allNaughty, function(word) {
    $('*:containsText("' + word[0] + '")').each(function() {
        var ihtml = $(this).text();   
        ihtml = ihtml.replace(new RegExp(word[0], 'g'), word[1]); 
        $(this).text(ihtml);                  
    });
});

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function capitalize(s) {
    return s.toUpperCase();
};