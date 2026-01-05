// ==UserScript==
// @name         Turkdigo FlicksIO Helper
// @author       Turkdigo
// @namespace    Turkdigo
// @description  FlicksIO helper; adds some stuff on Google and IMDb to make searching and submitting (slightly, ever so slightly) less of a problem.
// @match        https://flicksio.com/mturk*
// @match        https://www.google.com/*
// @match        http://www.imdb.com/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @version      1.2
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/8206/Turkdigo%20FlicksIO%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/8206/Turkdigo%20FlicksIO%20Helper.meta.js
// ==/UserScript==

if (window.location.href.indexOf("flicksio.com") > -1) { // Start internal HIT code
   
    GM_deleteValue("inject");
    GM_deleteValue("url");
    GM_deleteValue("count");
    GM_deleteValue("title");
    GM_deleteValue("episode");
    GM_deleteValue("show");
    GM_deleteValue("season");
   
    var inject = [];
    var url = [];
    var title = [];
    var count = 0;
    var episode = [];
    var show = [];
    var season = [];
   
    $("h1").each(function(index){
        title.push($(this).text().trim());
       
        var epget = title[index].substr(0, title[index].indexOf('('));
        var shwget = title[index].substr(title[index].indexOf('("') + 2);
        epget = epget.slice(0, -1);
        shwget = shwget.slice(0, -2);
        var showtru = shwget.substring(0, shwget.indexOf(','));
        var ssntru = shwget.substring( shwget.indexOf(',') + 2);
        episode.push(epget.trim());
        show.push(showtru.trim());
        season.push(ssntru.trim());
    });
   
    $("a[href^='https://www.google.com/search']").each(function( index ) { // Grab Pre-populated Google Search
        url.push( $( this ).attr('href'));
    });
   

   
      GM_setValue("url", JSON.stringify(url));
    GM_setValue("count", count);
    GM_setValue("title", JSON.stringify(title));
    GM_setValue("show", JSON.stringify(show));
    GM_setValue("episode", JSON.stringify(episode));
    GM_setValue("season", JSON.stringify(season));
    GM_setValue("inject", JSON.stringify(inject));
   
     

    window.open(url[0]);
   

   
    $("input[type=submit]").before('<button id="inject" type="button" class="validate fancy-blue-button smaller-button">Inject URLs</button>').hide(); // Add Inject before Submit
   
$(window).keypress(function(e) {
    if (e.keyCode == 115) {
       $("#inject").click();
       $("input[type=submit]").click();
  }
});
   
    $( "button#inject" ).click(function() {
        var inject = JSON.parse(GM_getValue("inject"));
        $("input[placeholder='Enter IMDb URL']:eq(0)").val(inject[0]);
        $("input[placeholder='Enter IMDb URL']:eq(1)").val(inject[1]);
        $(this).hide();
        $("input[type=submit]").show();
    });
   
}

if (window.location.href.indexOf("google.com/search") > -1) { // Start Google code
   
    var inject = JSON.parse(GM_getValue("inject"));
    var url = JSON.parse(GM_getValue("url"));
    var title = JSON.parse(GM_getValue("title"));
    var show = JSON.parse(GM_getValue("show"));
    var episode = JSON.parse(GM_getValue("episode"));
    var season = JSON.parse(GM_getValue("season"));
   
    if (GM_getValue("count")!=1){
        $("div#top_nav").append('<br><center><div style="font-size: 300%;" id="title">"'+show[0]+'" '+episode[0]+' ('+season[0]+')</title></center>');
    } else {
        $("div#top_nav").append('<br><center><div style="font-size: 300%;" id="title">"'+show[1]+'" '+episode[1]+' ('+season[1]+')</title></center>');
    }
    $("div#top_nav").append('<br><center><button id="imdb">Check IMDb</button></center>');
    $("button#imdb").parent().append('&nbsp;<button id="skip">Give Up</button>');
    $( "button#imdb" ).click(function() {
        if (GM_getValue("count")!=1){
            window.open ('http://www.imdb.com/find?ref_=nv_sr_fn&q='+show[0]+' '+episode[0]+'&s=all','_self',false);
        } else {
            window.open ('http://www.imdb.com/find?ref_=nv_sr_fn&q='+show[1]+' '+episode[1]+'&s=all','_self',false);
        }
    });
    $( "button#skip" ).click(function() {
        window.close();
    });
   
      $("h3").prepend('<button id="select">Select</button>&nbsp;');
   
    $( "button#select" ).click(function() {
        var grab = $(this).siblings("a").attr('href');
        inject.push(grab);
       GM_setValue("inject", JSON.stringify(inject));
       
        if (GM_getValue("count")!=1){
            window.open (url[1],'_self',false);
            GM_setValue("count", 1);
        } else {
            window.close();
        }
    });
   
      $("h3").each(function(){
        var getit = $(this).find("a").attr('href').length;
        if (getit > 36) {
            $(this).parent().fadeTo("slow", 0.20);
        } else {
            $(this).show();
        }
    });
   
}

if (window.location.href.indexOf("imdb.com/find") > -1) { // IMDb Search Code  
    $("td.result_text").prepend('<button id="select">Select</button>&nbsp;');
    $( "button#select" ).click(function() {
        var grab = $(this).siblings("a").attr('href');
        grab = "http://www.imdb.com"+grab;
        grab = grab.substring(0,36);
       
        inject.push(grab);
       GM_setValue("inject", JSON.stringify(inject));
       
        if (GM_getValue("count")!=1){
            window.open (url[1],'_self',false);
            GM_setValue("count", 1);
        } else {
            window.close();
        }
    });
}

if (window.location.href.indexOf("imdb.com/title/tt") > -1) { // IMDb Episode Code
    $("a[itemprop=name]").parent().prepend('<button id="episode" name="episodes">Select</button>&nbsp;');    
    $( "button#episode" ).click(function() {
        var grab = $(this).siblings("a").attr('href');
        grab = "http://www.imdb.com"+grab;
        grab = grab.substring(0,36);
       
        inject.push(grab);
       GM_setValue("inject", JSON.stringify(inject));
       
        if (GM_getValue("count")!=1){
            window.open (url[1],'_self',false);
            GM_setValue("count", 1);
        } else {
            window.close();
        }
    });
}

if (window.location.href.indexOf("imdb.com") > -1) { // general search code
    var inject = JSON.parse(GM_getValue("inject"));
    var url = JSON.parse(GM_getValue("url"));
    var title = JSON.parse(GM_getValue("title"));
    var show = JSON.parse(GM_getValue("show"));
    var episode = JSON.parse(GM_getValue("episode"));
    var season = JSON.parse(GM_getValue("season"));
   
    if (GM_getValue("count")!=1){
        $("div#wrapper").prepend('<center><div style="font-size: 200%;" id="title">"'+show[0]+'" '+episode[0]+' ('+season[0]+')</title></center><br>');
    } else {
        $("div#wrapper").prepend('<center><div style="font-size: 200%;" id="title">"'+show[1]+'" '+episode[1]+' ('+season[1]+')</title></center><br>');
    }
   
    $("div#wrapper").prepend('<br><center><button id="page">Submit This Page</button></center>');
    $("button#page").click(function(){
        var grab = $(location).attr('href');
        inject.push(grab);
        GM_setValue("inject", JSON.stringify(inject));
       
        if (GM_getValue("count")!=1){
            window.open (url[1],'_self',false);
            GM_setValue("count", 1);
        } else {
            window.close();
        }
    });
   
    $("button#page").parent().first().append('&nbsp;&nbsp;<button id="none">Give Up</button>');
    $( "button#none" ).click(function() {
        window.close();
    });
   

}