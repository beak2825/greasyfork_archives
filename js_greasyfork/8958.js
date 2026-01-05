// ==UserScript==
// @name          Torrentz : The Bobcat add-on (mod)
// @name:tr       Torrentz : The Bobcat add-on (mod)
// @namespace     http://torrentzBobCat
// @homepage      http://www.youtube.com/watch?v=1QyuIDw0CIw&feature=youtu.be
// @description   Torrentz.eu: Add IMDB ratings, download links, movie plot/actors (movie poster added on the mod), and other goodies. Also features an light built-in serie tracker (remove tracker on the mod). Torrentz gets so much simpler and efficient! Demo video here: http://www.youtube.com/watch?v=1QyuIDw0CIw&feature=youtu.be
// @description:tr Torrentz.eu: Aramlarınız sonucunda karşınıza çıkan listedeki filmlere indirme bağlantısı, film hakkında poster (orijinal sürümde poster yoktur) ve çeşitli bilgiler ekler. Orijinal sürümünde dizi bölümlerini takip eden bir kod vardır ama bende bir türlü çalışmadığı için kaldırdım.
// @author        CoolMatt (moder: aytecesmebasi)
// @version        1.3.9 (mod)
// @include       *://torrentz*.*
// @match         *://torrentz.com/*
// @match         *://torrentz.eu/*
// @match         *://torrentz.in/*
// @match         *://torrentz.me/*
// @match         *://torrentz.ch/*
// @match         *://torrentz-proxy.com/*
// @grant GM_xmlhttpRequest 
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAABNVBMVEUAAAAlSm8lSnAlS3AmS3AmTHImTHMmTXQnTnYnT3coTHEoUXkpUnsqVH4qVYArT3MrV4IsWYUtWoguXIovXo0vX44wYJAwYZIxVHcxYpQxY5UyZJYyZZcyZZgzZpk0Z5k1Z5k2aJo3WXs3aZo8bJ09Xn8+bp5CcaBFZYRHdaJJdqNNeaVPbYtQe6dSfahVf6lYdJFbhKxchK1hiK9iibBjfZhnjLJvh6Bylbhzlrh6m7x8kqh8nb2KnrGNqcWRrMeYqbuYssuas8ymtcSovdOqv9SvwtawxNezv8y2yNq5ytu+ydTD0eDJ0tvJ1uPP2ubT2uLZ4uvc4efe5u7f5+7i6fDl6e3p7vPq7fHq7/Ts8PXu8vbw8vTx9Pf19vj2+Pr4+fr4+fv6+/z8/Pz8/P39/f3///871JlNAAAAAXRSTlMAQObYZgAAAXFJREFUeNrt20dPw0AQBeBs6DX0niGhhN57Db333kJn//9PYOdgCQlYEEJ5Ab13mhnb8nfwYSRrQyGBxr3fQiMEEEAAAW8BkrZ8DJA0hgACCCCAAAIIIIAAAgjwAuy346cvBRdRgC0wIHYFBsxaLGAghQWMnlskoG/12f4c4H1CvIknuoYn59dPrAYBCO4igAAA4H0IIIAAAggggAACCPh3AG+MIQALWDalqI9w/NHNdguLoiBAf8qNzlryGgQD6Dh1k9verBrBAFr3dTJhKgUE2NTBgikTEGBR++3s4igIMK3tUV1+o2AAIw+uu+nMqRUMoOfaNU9j4SrBABLH2syZcsEA4ntab5gSAQHWtDyIFDSBAEmtLtpz6wUDmHpxxf1guFowgKE7LWZMhWAA3ZfBCoABtB3aYAWAAJp37OcrgNgv8guAFRusAACAbykl4I8A+PecAAIIIIAAAggggAACMhQAEPC0HQEEEJBJAPjx/1f83wbVqAm3rAAAAABJRU5ErkJggg==
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/8958/Torrentz%20%3A%20The%20Bobcat%20add-on%20%28mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/8958/Torrentz%20%3A%20The%20Bobcat%20add-on%20%28mod%29.meta.js
// ==/UserScript==
// @date    03 Apr 2015
// @license    GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
//Define the namespace
var Torrentz = Torrentz || {};
Torrentz.GM = {};
Torrentz.GM.BobCatTorrentz = {};



Torrentz.GM.BobCatTorrentz = {

    PageCache_movieInfo: {}, //Store info about movies of the page
    PageCache_lk_id_info: {}, //Lookup table - as several torrentz can point at the same movie info

    start: function() {

        initCss();
        this.addBadgeAndButtons();

        $("div.cloud").hide();

        var loginStore = Enbalaba.GetLocalStore("moviesInfo"),
            loginData = loginStore.get(),
            that = this,
            results;

        //Calculate cache size and clear it if too big
        this.checkCacheSize(loginStore);

        //Get rid of this incredibly annoying & ridiculous advertising banner
        $("body>iframe:first").hide();

        //Start processing of the rows
        results = $(".results");


        results.find("h3:first").append("<span>|&nbsp</span><b title='IMDB Rating. Brought to you by the Torrentz Dominion Plugin'>Rating</b>");
        results.children("dl").each(function(index) {
            that.processRow($(this), loginData, false);
        });

        results.find("span.downloadLink").click(function() {
            $(this).replaceWith("<div class='fleft bobcatStamp' style='width:80px;height:25px;position:relative;top:-4px'></div>");
            downloadTorrent($(this).attr("data-torrentid"));
        });

        //Add events for when the row is clicked
        results.find("dt").click(function() {
            var dt = $(this),
                text,
                divDesc = dt.find(".movieDesc"),
                div, lk, aElement;

            if (divDesc.length == 0) { //First time the user clicks here
                aElement = dt.children("a:first");
                if (aElement.length == 0) return;
                var id = aElement.attr("href").substr(1).toUpperCase(),
                    info = null;
                if (!id) return;

                //Retrieve info from cache
                if (that.PageCache_lk_id_info[id]) {
                    info = that.PageCache_movieInfo[that.PageCache_lk_id_info[id]];
                }

                if (info) {
                    // 
                    text = "<table class='infoinfo'><tr><th class='PosterInfo' rowspan='3'><img src=" + info.Poster + "width='135' height='200'></img>" +
                        "</th><td class='PlotInfo'><b>Synopsis</b>: " + info.Plot +
                        "</td></tr><tr><td class='GenreInfo'><b>Genre</b>: " + info.Genre + " <b>Runtime</b>:" + info.Runtime + " <b>Metascore</b>:" + info.Metascore + "/100" +
                        "</td></tr><tr><td class='ActorsInfo'><b>Actors</b>: " + info.Actors +
                        "</td></tr></table>";
                } else {
                    //No info > display the title
                    text = aElement.attr("title");
                }

                divDesc = $("<div class='movieDesc'>" + text + "</div>");

                div = $();
                div.append(lk).append($().hide());
                divDesc.append(div).hide();
                dt.append(divDesc);
            }
            if (divDesc.is(":hidden")) {
                divDesc.children().hide();
                divDesc.slideDown(150, function() {
                    divDesc.children().show();
                });
                dt.children(".expandCollapse").removeClass("expand").addClass("collapse");
                //dt.children(".expand").addClass("collapse");
            } else {
                divDesc.slideUp();
                dt.children(".expand").removeClass("collapse");
            }
        });


    }

    ,
    processRow: function(row, loginData, isIFrameDownload) {
        if (!row) return;
        var tags = null,
            name,
            lk = row.find("dt>a");

        if (lk.length > 0) {
            var id = lk.attr("href").substr(1).toUpperCase(), //Get id from href
                info = lk.parent().text(),
                index = info.indexOf('\u00BB'), //Look for the utf-8 character >> in the row
                rightCol = row.find("dd");

            rightCol.css("width", "400px");
            row.find("dt").css("width", "100%");

            if (index > -1) {
                tags = info.substr(index + 1);
                name = info.substr(0, index);
            }
            lk.attr("title", "").parent().html(lk); //Remove info to make some room

            //lk.after("<span class='moreLk'>more</span>");
            var type = this.getType(name, tags);
            if (this.isTVSerie(name)) {
                type = "tv"; //extra verification as sometimes a tv serie is not tagged as such
            }
            if (type == "movie") {
                if (!loginData) return;
                lk.css('color', '#3F14FF');

                var yearIndex = name.search(/\s[0-9]{4}\s/); //Year is mandatory
                if (yearIndex != -1) {
                    var year = name.substr(yearIndex + 1, 4);
                    name = name.substr(0, yearIndex);
                    //console.log(name + ":" + year);

                    info = loginData[(name + year).toLowerCase()]; //Search in cache

                    this.searchIMDBinfo(name, year, lk, rightCol);
                }
            } else if (type == "tv") {
                lk.css('color', 'Black' /*'#47D4FF'*/ );
            } else {
                lk.css('color', '#555');
            }
            //Add link
            //if (isIFrameDownload == true) {
            rightCol.prepend("<span class='downloadLink hyperlink' data-torrentid='" + id + "'>Download</span>");
            //rightCol.prepend("<div class='downloadIcon fleft' data-torrentid='" + id + "'></div>");

            lk.parent().prepend("<div class='expand fleft'></div>");
        }
        //this.attachRowEvent(row);

        //row.find("span.downloadLink").text("download");
    }

    ,
    getType: function(name, tags) {
            if (tags.indexOf("movies") > -1) return "movie";
            else if (tags.indexOf("tv") > -1) return "tv";
            else if (tags.indexOf("games") > -1) return "game";
        }
        /*As sometimes the tv serie is not tagged as such. This test will help catch those ones*/
        ,
    isTVSerie: function(fullName) {
        return (
            new RegExp(/[sS][0-9]+[eE][0-9]+/).test(fullName) || new RegExp(/[0-9]+[x][0-9]+/).test(fullName) || new RegExp(/season[\s]?[0-9]{1,2}[\s]/i).test(fullName)
        );
    }

    /*
     *
     */
    ,
    searchIMDBinfo: function(name, year, link, rightCol, isRetry) {
        //console.log("encodeURI('http://www.imdbapi.com/?t=" + name + "')");
        var url = encodeURI("http://www.imdbapi.com/?t=" + name + "&y=" + year + "&plot=full&r=json"),
            that = this;
        console.log("URL: " + url);


        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var obj = $.parseJSON(response.responseText);
                //console.log(url + ":" + obj);
                if (obj) {
                    if (obj.imdbRating) {
                        var loginStore = Enbalaba.GetLocalStore("moviesInfo"),
                            loginData = loginStore.get();
                        if (loginData) {
                            refName = (name + "&y=" + year).toLowerCase();
                            that.PageCache_movieInfo[refName] = {
                                imdbRating: obj.imdbRating,
                                Plot: obj.Plot,
                                Actors: obj.Actors,
                                ImdbID: obj.imdbID,
                                Poster: obj.Poster,
                                Genre: obj.Genre,
                                Runtime: obj.Runtime,
                                Metascore: obj.Metascore
                            };
                            that.PageCache_lk_id_info[link.attr("href").substr(1).toUpperCase()] = refName;

                            loginData[refName] = {
                                imdbRating: obj.imdbRating,
                                Plot: obj.Plot,
                                Actors: obj.Actors,
                                ImdbID: obj.imdbID,
                                Poster: obj.Poster,
                                Genre: obj.Genre,
                                Runtime: obj.Runtime,
                                Metascore: obj.Metascore
                            };
                            loginStore.set(loginData);
                        }
                        rightCol.append($("<a class='rateBox' " + (obj.imdbID && obj.imdbID != "" ? "target='_blank' href='http://www.imdb.com/title/" + obj.imdbID + "'" : "") + " >" + obj.imdbRating + "</a>"));
                        //rightCol.prepend($("<input type='text' disabled='disabled' class='rateBox' value='" + obj.imdbRating + "'></input>")); //tbMark.val(obj.imdbRating);
                        //if (obj.Plot) link.attr("title", obj.Plot).data("MovieInfo", { imdbRating: obj.imdbRating, Plot: obj.Plot, Actors: obj.Actors });
                    } else if (obj.Response == "False") {
                        if (isRetry != true) { //Tries a second search
                            var name2 = name.replace(/thats/gi, "that's").replace(/it's/gi, "its").replace(/spiderman/i, "spider man").replace(/extended$/i, "");
                            if (name2 != name) {
                                that.searchIMDBinfo(name2, year, link, rightCol, true);
                                return;
                            }
                        }
                        console.info(name + ": " + obj.Error);
                        //rightCol.prepend($("<input type='text' disabled='disabled' class='rateBox' value='?'></input>"));
                    }
                }
            }
        });


        return;
    }



    /*
     * Calculate cache size and clear it if too big
     */
    ,
    checkCacheSize: function(loginStore) {
        var cacheSize,
            k,
            that = this,
            loginData = loginStore.get();

        try {
            //Works in all recent browsers
            cacheSize = Object.keys(loginData).length;
        } catch (err) {

            cacheSize = 0;
            for (k in loginData) {
                if (loginData.hasOwnProperty(k)) cacheSize++;
            }
        }
        console.log("Bobcat - Cache size:" + cacheSize);
        if (cacheSize > 150) {
            //Clear the cache from time to time
            loginStore.set({});
            console.info("Bobcat - Movie cache cleared");
        }
    }

    /*
     * Add badges and buttons
     */
    ,
    addBadgeAndButtons: function() {
        //Add bobcat badge in the top banner
        $("div.top").append("<div id='bobcatLogoContainer' class='bobcatLogo'><a href='http://www.youtube.com/watch?v=1QyuIDw0CIw&feature=youtu.be'>with the Bobcat add-on</a></div>");


    }
}

//Basic Class to deal with the localstorage
Enbalaba = {};

//Add CSS
function initCss() {
    var css = [
        " .rateBox{ margin-left:10px;position:relative;bottom:3px; cursor: pointer; padding:1px; background-color:#EEE; border:#AAA solid 1px; border-radius:4px}", ".bobcatLogo{background:transparent url(http://i.imgur.com/MlVVyzX.png) no-repeat scroll 0 0}", "#bobcatLogoContainer a{color:White}", "#bobcatLogoContainer a:hover{color:White}", ".bobcatStamp{background:transparent url(http://i.imgur.com/tDWKswF.png) no-repeat scroll 0 0}", ".bobcatStamp2{background:transparent url(http://i.imgur.com/n7tvk8I.png) no-repeat scroll 0 0}", "#bobcatLogoContainer{color:White;height:30px;width:150px;float:left;padding-left:50px;padding-top:5px; margin-top:10px}", ".downloadLink{;margin-right:20px}", ".moreLk{padding-left:30px;cursor:pointer}", ".movieDesc{width:100%;margin:10px 0px 40px 0px;color:Black;white-space:normal}", ".fleft{ float:left}", "dt:hover{ background-color:#EEE}", ".infoinfo,.ActorsInfo,.qualityComments,.divQuality, .PlotInfo,.PosterInfo,.GenreInfo{margin-top:11px;margin-bottom:5px; font-size:12px;font-family:Verdana,Tahoma,sans-serif}", "#pluginZoneContainer{ position:absolute; left: 210px; top:10px; width: 200px; height: 200px;background-color:Gray}", ".expand{  background:transparent url(http://i.imgur.com/mIIop2R.png) no-repeat scroll 0 0; width:15px; height: 9px; position: relative; top:3px}" //arrow1.png
        , ".downloadIcon{  background:transparent url(http://i.imgur.com/7Jkx1N9.png) no-repeat scroll 0 0; width:17px; height: 18px; position: relative; top:3px}", ".collapse{  background-image:url(http://i.imgur.com/apcKFJ5.png)}" //arrow2.png




        //Generic
        , ".hyperlink{color:#0066EE;text-decoration:none;cursor:pointer;text-decoration:underline}", ".bcButton{color:#6B3F2E; border-radius: 6px; border: 1px solid #6B3F2E; height:25px; padding-bottom:1px; min-width:80px; font-weight:bold;cursor:pointer}", ".bcButton:hover{color:#AA3F2E; }", ".bcTextbox{background-color:#FFF;border: 1px solid #B5B8C8; font-size: 14px; height: 16px;  line-height: 14px; padding: 2px; vertical-align: middle;border-radius: 5px; color:color:#6B3F2E}", ".bcSelect{ background-color:#FFFFFF;height:26px;line-height:26px;border:1px solid #CCCCCC;color:Black;font-size:16px;    padding:4px;border-radius:5px}", " .col1{ float:left; width:100px; }", ".col2{ float:left; width:200px}", ".col3{ float:left; width:200px}", ".row{ clear:both; width : 500px; margin:10px 0px; padding-bottom:20px}"
    ];
    css = css.join("\n");
    if (typeof GM_addStyle != "undefined") GM_addStyle(css);
    else if (typeof PRO_addStyle != "undefined") PRO_addStyle(css);
    else if (typeof addStyle != "undefined") addStyle(css);
    else {
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(css));
            heads[0].appendChild(node);
        }
    }
}

/*Parse a string with a basic format (yyyyMMdd HHmmss) to a date object */
function getDateFromDateString(dateString, isUTCDate) {
    try {
        //This is for Javascript to understand format 'yymmdd hhmmmss'
        var year = dateString.substring(0, 4),
            month = dateString.substring(4, 6),
            day = dateString.substring(6, 8),
            hours = dateString.substring(9, 11),
            minutes = dateString.substring(11, 13),
            seconds = dateString.substring(13, 15);
        var date = new Date(year, month - 1, day, hours, minutes, seconds, "00"); // months are 0-based
        if (isUTCDate == true) { //Must convert the date from UTC/GMT to local time
            var n = date.getTimezoneOffset();
            date.setMinutes(date.getMinutes() - n);
        }
        return date;
    } catch (err) {
        return new Date(dateString);
    }
}

/** Encode a date : "yyyyMMdd"
 */
function encodeDate(d) {
    //debugger;
    var twoDigit = function(val) {
        if (val < 10) return "0" + val;
        else return val;
    };
    if (d && d.getMonth) return d.getFullYear().toString() + twoDigit((d.getMonth() + 1)) + twoDigit(d.getDate()); // + " " + twoDigit(d.getHours()) + twoDigit(d.getMinutes()) + twoDigit(d.getSeconds());
    else return null;
}


function downloadTorrent(id) {
    if (!id) return;

    var hiddenIFrameID = 'hiddenDownloader',
        url = 'http://torcache.net/torrent/' + id + '.torrent';
    iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        console.log("SRC : " + url);
    }
    iframe.src = url;
}


//--Application specific. Ensure Singleton, single location to set up the specific configs. Better to use that than using new Enbalaba.LocalStore()
Enbalaba.GetLocalStore = (function() {
    var _stores = []; //*Private*
    return function(name) {
        if (!_stores[name]) {
            var config = {};
            switch (name) {
                case "moviesInfo":
                    config = {
                        MaxProperties: 500
                    };
                    break;
                case "trackedSeries":
                    config = {
                        IsArray: true
                    };
                    break;
            }
            _stores[name] = new Enbalaba.LocalStore(name, config);
        }
        return _stores[name];
    }
})();
//--------------
Enbalaba.LocalStore = function(name, config) {
    this.Name = name;
    var defaultConfig = {
        EmptyValue: {},
        MaxTotalSize: 500000
    };
    //Notes : 1 char = 2octets (Strings in JavaScript are UTF-16, so each character requires two bytes of memory)
    if (!config) config = {};
    else {
        if (config.IsArray == true) defaultConfig = {
            EmptyValue: [],
            MaxItems: 200,
            MaxTotalSize: 500000
        }; //MaxTotalSize for arrays (usually used for MRU)== 500Ko        
    }
    this.Config = $.extend(defaultConfig, config);
};

Enbalaba.LocalStore.prototype = {

    _isSupported: !(typeof localStorage == 'undefined' || typeof JSON == 'undefined'),

    set: function(val) {
        if (this._isSupported) {
            if ($.isArray(val) && val.length > this.Config.MaxItems) {
                for (var i = 0, dif = val.length - this.Config.MaxItems; i < dif; i++) val.shift(); //remove X first elements
            }

            var s = JSON.stringify(val);

            if (s.length > this.Config.MaxTotalSize) return false; //todo: something more significant
            localStorage.setItem(this.Name, s);
            return true;
        }
    }

    /*Get the value associated with the store are. Can return null, except if Config.EmptyValue has been defined */
    ,
    get: function() {
        if (this._isSupported) {
            var s = localStorage.getItem(this.Name);
            if (s != null && s != "") {
                return JSON.parse(s);
            } else if (this.Config.EmptyValue) return this.Config.EmptyValue;
        }
        if (this.Config.EmptyValue) return this.Config.EmptyValue;
        return null;
    }
};



Torrentz.GM.BobCatTorrentz.start();