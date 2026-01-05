// ==UserScript==
// @name		Imdb Rating on Pirate Bay
// @description Displays Imdb ratings and highlights the best movies
// @namespace   https://greasyfork.org/en/scripts/8271-imdb-rating-on-pirate-bay
// @include	http*://thepiratebay.*/top/20*
// @include	http*://thepiratebay.*/top/20*
// @include http*://tpb.piraten.*/top/20*
// @include http*://tpb.piraten.*/browse/20*
// @include http*://thepiratebay.*/browse/20*
// @include http*://thepiratebay.*/search/*/*/*/20*
// @include http*://thepiratebay.*/search/*/*/*/20*
// @include http*://tpb.piraten.*/search/*/*/*/20*
// @include http*://tpb.piraten.*/search/*/*/*/20*
// @author	    Crawler
// @contributor trollkarlen
// @grant   GM_xmlhttpRequest
// @require	https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require	https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.5/js/jquery.dataTables.min.js
// @version	1.8.3
// @downloadURL https://update.greasyfork.org/scripts/8271/Imdb%20Rating%20on%20Pirate%20Bay.user.js
// @updateURL https://update.greasyfork.org/scripts/8271/Imdb%20Rating%20on%20Pirate%20Bay.meta.js
// ==/UserScript==


/*
 * VERSION HISTORY
 *
 * version 1.8.3
 * Made it work again and updated to new datatables
 *
 * version 1.8.0
 * added some additional URLs in the @includes as requested by the users of the script.
 * The IMDB link now displays the plot summary as a link title so you take a quick look on the 
 * summary without navigating on the IMDB site. 
 *
 * version 1.7.3
 * removed the param string in genres.
 * added the http://tpb.piraten.lu to the @include url
 *
 * version 1.7.2
 * Changed the PirateBay url to thepiratebay.se
 *
 * version 1.7.1:
 * Refactored the source code and fixed the filtering functionality.
 *
 * version 1.7:
 * Added sorting funtions to the torrents table.
 *
 * version 1.6:
 * Changed the pattern to get the rating and the votes from IMDB due to the change of IMDB.
 *
 * version 1.5:
 * IMDB changed again and there was the same problem as in version 1.2 retrieving the rating
 * Pattern changed again to resolve the issue.
 *
 * version 1.4:
 * Gets from IMDB the movie's genres and displays them under the title.
 *
 * version 1.3:
 * IMDB changed the style of its pages so the
 * rating could not be retrieved 
 * Changed the rating pattern in order to be parsed correctly by the script.
 *
 * version 1.2:
 * If the script can't find the IMDB url in the first page of the torrent details then it loads the 1st comment screen
 * where usually some user has added the IMDB url as a comment. This adds approximately 25% additional IMDB votes and links
 *
 * version 1.1:
 * Added a loading indicator in each row in the torrents table to indicate that some processing occurs regarding this row.
 * Because the loading happens asynchronously each rating will appear without any specific order. If no info can be found about the movie then a warning message appears. 
 *
 * version 1.0:
 * Initial version. The script loads with AJAX the page that the Piratebay link points to and searches the link to the IMDB that provides the movie info.
 * When it finds it, gets the IMDB page with AJAX, gets the rating and the number of votes and updates the pirate bay torrents table. 
 */

// Images
var loadingImg = "data:image/gif;base64,R0lGODlhEAAQAPQAAPbx7pmZmfPu662sq8jGxJqamqampefj4NXS0KCfn8PAv727uuvn5NDNy+Dc2rKxsLi2tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAkKAAAALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkECQoAAAAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkECQoAAAAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAkKAAAALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAkKAAAALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==";
var timeout = 1;

var dataTablesCss1 = "//cdn.datatables.net/1.10.5/css/jquery.dataTables.css";

function addStyle(style) {
    var head = document.getElementsByTagName("HEAD")[0];
    var ele = head.appendChild(window.document.createElement( 'style' ));
    ele.innerHTML = style;
    return ele;
}

function addScript(script) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = script;
    $("head").append(s);
}

function findImdbID(url) {
    if (url === null) {
        return null;
    }
    var m = url.match(/^http:\/\/(.*\.)?imdb.com\/title\/(tt\d*)/i);
    if (m) return m[2];
    return null;
}

function getMovieInfo(imdbUrl, index, callback) {
    setTimeout(function() {
        var url = imdbUrl;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(details) {
                callback(extractMovieInfo(details.responseText, index, imdbUrl));
            }
        });
    }, timeout);
}

function extractMovieInfo(content, index, url) {
    //var match = content.match(/<span class="rating-rating">(\d.\d)<span>\/10<\/span><\/span>/);
    //var match = content.match(/<span class="value" itemprop="ratingValue">(\d.\d)<\/span>/);
    //var match = content.match(/<span class="rating-rating"><span class="value">(\d.\d)<\/span>/);
    var ratingValue = content.match(/<span itemprop="ratingValue">(\d.\d)<\/span>/);
    //var match2 = content.match(/([\d,]+ votes)/);
    //<span itemprop="ratingCount">153&nbsp;035</span>
    var votes = content.match(/<span itemprop="ratingCount">([\d,\u00A0]+)<\/span>/);

    var pattern = /href="\/genre\/([^"]*)\?ref_=tt_ov_inf"/g;
    var match3, count, genres = new Array();
    if (ratingValue === null) {
        ratingValue = '-';
    } else {
        ratingValue = ratingValue[1].replace(',', '.');
    }
    if (votes === null) {
        votes = '-';
    } else {
        votes = votes[1];
    }

    count = 0;
    while ( match3 = pattern.exec(content)){
        var gen = ' ' + match3[1];
        if (genres.indexOf(gen) == -1) {
            // put each genre only once
            genres[count++] = gen;
        }

    }

    var plot = content.match(/<p itemprop="description">\s([^<]*)(?:<a href.*)?\s?<\/p>/);
    if (plot === null) {
        plot = "";
    } else {
        plot = plot[1];
    }

    return { rating: ratingValue, index: index, votecount: ""+votes, url: url, genres: genres, plot: plot };
}

function getPage1Comments(details, index, torrentID) {
    setTimeout(function() {
        var page=1;
  
        var error_html = '<span style="white-space: nowrap;"><em>Link not found</em></span>';
        var match1 = details.match(/<a href="#" onclick="comPage\(1,\s*(\d+),\s*'([a-fA-F0-9]+)',\s*'(\d+)'\).*>1<\/a>/i);
        if (match1 !== null) {
            var pages=match1[1];
            var crc=match1[2];
            var id=match1[3];

            $.ajax({
                type: 'POST',
                url: 'http://thepiratebay.se/ajax_details_comments.php',
                data: 'id='+id+'&page='+page+'&pages='+pages+'&crc='+crc,
                success: function(data, textStatus, jqXHR) {
                    if (!processTorrentDetails(data, index, torrentID)) {
                        $('#loading_'+index).html(error_html);
                    }
                }
            });
        } else {
            $('#loading_'+index).html(error_html);
        }
        // TODO: cache this also for one or 2 days.
    }, timeout);
}

function highlightByRating(element, movieInfo, torrentID) {
    var bestColor = "red";
    var otherColor = "green";

    var aElement = element.eq(movieInfo.index).children("td:eq(2)");

    if(movieInfo.votecount.length >= 12 && parseFloat(movieInfo.rating) >= 7.5 ) {
        aElement.css('color', bestColor);
    } else {
        aElement.css('color', otherColor);
    }
    var linkElement = '<span style="white-space: nowrap;"><a class="imdb_rating" href="'+movieInfo.url+'" title="' + movieInfo.plot + '" target="_blank">' + movieInfo.rating + '/10 (' + movieInfo.votecount + ')</a></span>' +
        '<br/><span style="white-space: nowrap;"><div class="movie-genres">' + movieInfo.genres + '</div></span>';
    aElement.append(linkElement)
    /*.click(function() {
        LightboxBG();
        Lightbox('www', movieInfo.url, 'nobg');
    });*/

    $('#loading_'+movieInfo.index).remove();

    // Insert item in cache if we have one and also adjust the expire when voters is to low
    if ($imdb_rating_cache !== null) {
        $imdb_rating_cache.setItem(torrentID, linkElement,
                                   (parseInt(movieInfo.votecount.replace(/[,\u00A0]/g, "")) < 10000) ? 3600*24*1000 : undefined );
    }

}

function processTorrentDetails(details, index, torrentID) {
    var url2 = details.match(/(http:\/\/(?:.*?\.)?imdb.com\/title\/tt\d*\/?)/i);

    if (url2 !== null) {
        url2 = url2[1];
        if (findImdbID(url2) !== null) {
            getMovieInfo(url2, index, function(movieInfo) {
                highlightByRating($processElement, movieInfo, torrentID);
            });
        }
        return true;
    }
    return false;
}

jQuery.extend( jQuery.fn.dataTable.ext.order, {
    'tpb-title': function  ( settings, col )
    {
        return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
            return $('a:eq(0)', td).text();
        }); 
    },
});

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "rating-pre": function ( a ) {
        return a.replace(/^The[. ]/i, "");
    },
});



function Cache( nativeStorage, serializer ) {

    // Store the native storage reference as the object that
    // we are going to proxy. This object must uphold the
    // HTML5 Storage interface.
    this.storage = nativeStorage;

    // Store the serialization behavior. This object must
    // uphold the JSON interface for serialization and
    // deserialization.
    this.serializer = serializer;
}


// TODO: create library of this
// Set up the class methods.
Cache.prototype = {

    // I clear the cache.
    clear: function(){
        // Clear the storage container.
        this.storage.clear();

        // Return this object reference for method chaining.
        return( this );
    },

    // I get an item from the cache. If the item cannot be
    // found, I can pass back an optional default value.
    getItem: function( key, defaultValue ){
        // Get the cached item.
        var value = this.storage.getItem( key );

        // Check to see if it exists. If it does, then we
        // need to deserialize it.
        if (value === null){

            // No cached item could be found. Now, we either
            // have to return the default value, or we have
            // to return Null. We have to be careful here,
            // though, because the default value might be a
            // falsy.
            return(
                (typeof( defaultValue ) != "undefined") ?
                defaultValue :
                null
            );

        } else {

            // The value was found; return it in its
            // original form.
            return(
                this.serializer.parse( value )
            );

        }
    },

    // I check to see if the given key exists in the storage
    // container.
    hasItem: function( key ){
        // Simply check to see if the key access results in a
        // null value.
        return(
            this.getItem( key ) !== null
        );
    },

    // I remove the given item from the cache.
    removeItem: function( key ){
        // Remove the key from the storage container.
        this.storage.removeItem( key );

        // Return this object reference for method chaining.
        return( this );
    },

    // I store the item in the cache. When doing this, I
    // automatically serialize the value.
    //
    // NOTE: Not all value (ex. functions and private
    // variables) will serialize.
    setItem: function( key, value ){
        // Store the serialize value.
        this.storage.setItem(
            key,
            this.serializer.stringify( value )
        );

        // Return this object reference for method chaining.
        return( this );
    }
};

// -------------------------------------------------- //

function ExpireCache(nativeStorage, serializer, expire){
    // Store the native storage reference as the object that
    // we are going to proxy. This object must uphold the
    // HTML5 Storage interface.
    this.storage = nativeStorage;

    // Store the serialization behavior. This object must
    // uphold the JSON interface for serialization and
    // deserialization.
    this.serializer = serializer;
    // Timeout of values in ms
    this.expire = expire;
}

ExpireCache.prototype = {

    // I clear the cache.
    clear: function(){
        // Clear the storage container.
        this.storage.clear();

        // Return this object reference for method chaining.
        return( this );
    },

    // I remove the given item from the cache.
    removeItem: function( key ){
        // Remove the key from the storage container.
        this.storage.removeItem( key );

        // Return this object reference for method chaining.
        return( this );
    },

    // I store the item in the cache. When doing this, I
    // automatically serialize the value.
    //
    // NOTE: Not all value (ex. functions and private
    // variables) will serialize.
    setItem: function( key, value, expire) {

        // Use default value 
        var local_expire = (typeof( expire ) != "undefined") ?
            (new Date()).getTime() + expire : (new Date()).getTime() + this.expire;

        // Store the serialize value.
        this.storage.setItem(
            key,
            this.serializer.stringify( {expire: local_expire,
                                        data: value }
                                     ));

        // Return this object reference for method chaining.
        return( this );
    },
    // I get an item from the cache. If the item cannot be
    // found, I can pass back an optional default value.
    getItem: function( key, defaultValue ) {
        // Get the cached item.
        var value = this.storage.getItem( key );

        // Check to see if it exists. If it does, then we
        // need to deserialize it.
        if (value === null){

            // No cached item could be found. Now, we either
            // have to return the default value, or we have
            // to return Null. We have to be careful here,
            // though, because the default value might be a
            // falsy.
            return(
                (typeof( defaultValue ) != "undefined") ?
                defaultValue :
                null
            );

        } else {

            // The value was found; return it in its
            // original form.
            var item = this.serializer.parse( value );

            if (item.expire < (new Date()).getTime()) {
                // Remove item and return none
                this.removeItem(key);
                return(
                    (typeof( defaultValue ) != "undefined") ?
                    defaultValue :
                    null
                );
            } else {
                return(
                    item.data
                );
            }
        }
    },

    // I check to see if the given key exists in the storage
    // container.
    hasItem: function( key ) {
        // Simply check to see if the key access results in a
        // null value.
        return(
            this.storage.getItem( key ) !== null
        );
    },

};

/* This shows a black translucent background, exactly like a lightbox background */
function LightboxBG(){
    $("body").append($('<div id="tpbc_lightbox" style="width:100%!important;height:100%!important;position:fixed;z-index:1000;top:0;left:0;background:#000 url(\'//i.imgur.com/ByMmVtd.gif\');opacity:0.75;background-repeat:no-repeat;background-attachment:fixed;background-position:center; "><img src="//i.imgur.com/NMFMQRZ.png" title="Close" style="position:fixed; top:5px;right:5px; cursor:pointer"></div>').hide().fadeIn('fast'));
}
/* Depending on the type, url and nobg. type can be www for websites, img for an image, code for text or settings for TPBC settings window. With www, you'll also need the url to be set and you can choose to use nobg or not, which is whether or not you want to show the black background */
function Lightbox(type, url, nobg){
    /* if nobg has nothing set, then show the background */
    if(!nobg) LightboxBG();
    switch (type){
            /* Show a website */
        case 'www':
            if(url){
                window.Escapable = true;
                var scrWidth = $(window).width(); var scrHeight = $(window).height();
                $('<iframe id="tpbc_holder" style="width:'+ (scrWidth-100) +'px!important;height:'+ (scrHeight-100) +'px!important;position:fixed;z-index:1002;top:50px;left:50px;background:#ffffff;display:none;" src="' + $.trim(url) + '" />').appendTo("body");
                $("#tpbc_holder").load(function (){
                    $('#tpbc_holder').fadeIn('fast');
                    $("#tpbc_lightbox").css({'background':'#000'});
                })
            }
            SettingsChanged = false;
            break;
    }
    /* If we click anywhere on the lightbox then it closes and checks for things that have changed and alerts etc. */
    $("#tpbc_lightbox").click(function(){
        $("#tpbc_lightbox").css({'background':'#000'});
        $('#tpbc_holder').remove();
        $('#tpbc_holder_form').remove();
        $("#tpbc_lightbox").fadeOut('fast', function () {
            $(this).remove();
        });
    });
    /* Same as above, but against a different object. Check for things that may have changed and alerts or refreshes etc. */
    $("#tpbc_holder").click(function(){
        $("#tpbc_lightbox").css({'background':'#000'});
        $('#tpbc_holder').remove();
        $("#tpbc_lightbox").fadeOut('fast', function () {
            $("#tpbc_lightbox").remove();
        });
    });
}
/* Check for Escape Key, used for some windows */
$('body').keyup(function(e){
    if( e.which == 27 && window.Escapable === true ){
        $("#tpbc_lightbox").css({'background':'#000'});
        $('#tpbc_holder').remove();
        $('#tpbc_holder_form').remove();
        $("#tpbc_lightbox").fadeOut('fast', function () {
            $(this).remove();
        });
        window.Escapable = false;
    }
});

// -------------------------------------------------- //

$(document).ready(function() {
    addStyle('@import "' + dataTablesCss1 + '"');

    var elementName = '#searchResult > tbody > tr';
    $processElement = $(elementName);
    var url1;
    var columnIndex = 2;

    //Lightbox('www', "//www.rottentomatoes.com/m/birdman_2014/", false);

    if(typeof(Storage) !== "undefined") {
        // Expire in 10 days default
        $imdb_rating_cache = new ExpireCache( localStorage, JSON, (3600*24*1000)*10);
    } else {
        console.log("No Web Storage support..will not used cache");
        $imdb_rating_cache = null;
    }

    // Insert column for Imdb info
    $("<th>Imdb</th>").insertBefore("#tableHead > tr > th:eq(" + columnIndex + ")");

    // Slay next page thingy
    if ($(elementName + ":eq(-1) > td").length <= 3) {   
        var table = $('<table class="no-fotter" style="width: 100%;">').append("<thead>").append("<tbody>");
        table.append($(elementName + ":eq(-1)"));
        $("#main-content").append(table);
    }

    $(elementName).each(function(i) {

        var processElement = $(this);

        url1 = $(this).children("td:eq(1)").children("a:eq(0)").attr('href');

        var torrentID = jQuery("td:eq(3) > nobr > a", this).attr('href').match(/[0-9a-f]{40}/gi)[0];

        // TODO: add cache with validity here to 
        //var itemString = ($imdb_rating_cache !== null) ? null : $imdb_rating_cache.getItem(torrentID);
        var itemString = $imdb_rating_cache.getItem(torrentID);

        // Add to clear local storage
        // $imdb_rating_cache.clear();

        if (itemString === null) {
            $("<td><span id='loading_"+i+"'><img src='" + loadingImg + "' alt='Loading...'></span></td>").insertBefore($(this).children("td:eq(" + columnIndex + ")"));
            //children("td:eq(1)").append("&nbsp;<span id='loading_"+i+"'><img src='" + loadingImg + "' alt='Loading...'></span>");
            $.ajax({
                type:"GET",
                url:url1,
                success:function(details) {
                    if (!processTorrentDetails(details, i, torrentID)) {
                        getPage1Comments(details, i, torrentID);
                    } 
                }
            });
        } else {
            $("<td>" + itemString + "</td>").insertBefore($(this).children("td:eq(" + columnIndex + ")"));
        }   
    });

    var rowsLength = 31;

    if (document.URL.indexOf('top') > -1) {
        rowsLength = 100;
    }

    var mc = $('#searchResult').dataTable( {
        "iDisplayLength": rowsLength,
        "sDom": '<f><"clear">rt<i>',
        "columnDefs": [ 
            {"targets": [ 1 ], "orderable": true, "orderDataType": "tpb-title", "type": "rating", "sorting": [ "desc", "asc"]},
            {"targets": [ 2 ], "orderable": true, "sorting": ["desc", "asc"]},
            {"targets": [ 3, -1, -2, -3 ], "orderable": true },
            {"targets": [ '_all' ], "orderable": false }
        ],
    } );
    // TODO: fix this
    $('#tableHead th.sorting').css('background', '#D2B9A6 url("//datatables.net/media/images/sort_both.png") no-repeat center right');
    $('#tableHead th.sorting').css('padding-right', '12px');
});	