// ==UserScript==
// @name            HTPC--NZB [by SPENGLER]
// @namespace       SPENGLER
// @version         0.9.4
// @include         *://localhost:*/
// @require         http://code.jquery.com/jquery-2.1.1.min.js
// @description     Simple script to add SmackDownOnYou and KickAss direct search icons to NZB utilities
// @author          SPENGLER
// @license         free
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/6611/HTPC--NZB%20%5Bby%20SPENGLER%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/6611/HTPC--NZB%20%5Bby%20SPENGLER%5D.meta.js
// ==/UserScript==

//
// Simple script to add SmackDownOnYou and "Old"PirateBay direct search icons to NZB utilities
//
// I recommend adding the below "user includes" after installing this script.
//  This will stop it from running accidentally on external sites.
//  Additionally your user includes won't be affected by updates to the script.
//
// EX:
// *://<ServerIP>:*/
// *://<ServerName>:*/
//
// TamperMonkey Documentation : http://tampermonkey.net/documentation.php

// global variables
var iconPB = "//iwebchk.com/img/reports/icons/k/kickass.to.png";
var iconSD = "//www.smackdownonyou.com/views/images/favicon.ico";
var basePB = "<a href='//derefer.me/?https://kat.cr/usearch/";
var baseSD = "<a href='//derefer.me/?https://www.smackdownonyou.com/index.php?page=search&id=";
var extraPB = "/?field=seeders&sorder=desc";
var extraSD = "";


// inject code once source page finishes loading
$(document).ready(function() {
    var docTitle = $(document).prop('title');
    docTitle = docTitle==null ? "" : docTitle;
    var sPathName = $(location).attr('pathname')

    // check page titles (primary test)
    var bIsSAB = docTitle.indexOf('SABnzbd')>=0;
    var bIsSickBeard = docTitle.indexOf('Sick Beard')>=0

    // if primary tests fail, perform additional
    //      SABnzbd - look for: id=sabnzbd_shutdown
    if ( !bIsSAB ) {
        var aMatches = $("#sabnzbd_shutdown");
        bIsSAB = aMatches.length>0;
    }
    //      SickBeard - look for : <img src="/app.sickbeard/images/sickbeard.png">
    if ( !bIsSickBeard ) {
        var aMatches = $( "img[src*='/app.sickbeard/images/sickbeard.png']" ); 
        bIsSickBeard = aMatches.length>0;
    }

    // follow through with modifications
    if ( bIsSAB ) {
        switch ( sPathName ){
            case '/sabnzbd/':
            case '/sabnzbd':
            case '/':
                SAB_main();
                break;
            default:
                break;
        }
    }else if ( bIsSickBeard ) {
        switch ( sPathName ){
            case '/app.sickbeard/comingEpisodes/':
            case '/app.sickbeard/comingEpisodes':
                SB_comingEpisodes();
                break;
            case '/app.sickbeard/home/displayShow/':
            case '/app.sickbeard/home/displayShow':
                SB_displayShow();
                break;
            case '/app.sickbeard/history/':
            case '/app.sickbeard/history':
                SB_history();
                break;
            case '/app.sickbeard/manage/backlogOverview/':
            case '/app.sickbeard/manage/backlogOverview':
                SB_backlog();
                break;
            default:
                break;
        }
    }
});



/* This removes the year and/or region of a show for the friendliness of search links that often don't use the same labels
 *  Test site: http://www.regexr.com/
 */
function cleanShowName(sShow){
    var sShow_ = sShow;
    sShow_ = sShow_.replace(/'/g , "");  //sShow_.replace(/'/g , "&#39;");
    sShow_ = sShow_.replace(/( \([0-z]+\))/g , "");
    return sShow_;
}

// SABnzbd+
function SAB_main(){
    var sShow, sHTML, sHREF, sLinkPB, sLinkSD;
    $("td.historyTitle > a").each(function(){
        sHTML = $(this).html();
        sShow = cleanShowName( sHTML );
        sLinkPB = basePB + sShow + extraPB + "' target='_blank'><img src='"+iconPB+"'/></a>";
        sLinkSD = baseSD + sShow + extraSD +"' target='_blank'><img src='"+iconSD+"'/></a>";
        //alert( sLinkPB + sLinkSD + sHTML );
        //$(this).html( sLinkPB + sLinkSD + sHTML );
        $(this).before( sLinkPB +"&nbsp;&nbsp;"+ sLinkSD +"&nbsp;&nbsp;" );
    });
}


// SickBeard
function SB_comingEpisodes(){
    $("tr.listing-overdue, tr.listing-current, tr.listing-default, tr.listing-toofar").each(function(){
        sShow		= $(this).find("td").eq(1).find("a").html();
        sShow		= cleanShowName(sShow);
        sEpisode	= "s" + $(this).find("td").eq(2).html().replace("x", "e");
        sLink    	= $(this).find("td").eq(7);
        sLinkSD 	= baseSD + sShow+" "+sEpisode + extraSD + "' target='_blank'><img src='"+iconSD+"'/></a>";
        sLinkPB 	= basePB + sShow+" "+sEpisode + extraPB + "' target='_blank'><img src='"+iconPB+"'/></a>";
        sLink.after( "<td>"+sLinkSD+"&nbsp;"+sLinkPB+"</td>" );
    });
}

function SB_displayShow(){
    //alert('displayShow');
    var sShow = $("h1.title > a").html();
    sShow     = cleanShowName(sShow);
    var sHTML, sHREF, sSeason, sEpisode, sLinkPB, sLinkSD;
    $("a.epSearch").each(function(){
        sHREF = $(this).attr('href'); // searchEpisode?show=265074&amp;season=1&amp;episode=10
		sSeason = sHREF.split("&")[1].split("=")[1];
		sEpisode = sHREF.split("&")[2].split("=")[1];
        sSeason = "s" + ( sSeason.length==1 ? "0" : "" ) + sSeason;
        sEpisode = "e" + ( sEpisode.length==1 ? "0" : "" ) + sEpisode;
        sLinkPB = basePB + sShow+" "+ sSeason+sEpisode + extraPB + "' target='_blank'><img src='"+iconPB+"'/></a>";
        sLinkSD = baseSD + sShow+" "+ sSeason+sEpisode + extraSD + "' target='_blank'><img src='"+iconSD+"'/></a>";
        $(this).parent().after( "<td>"+sLinkSD+"&nbsp;"+sLinkPB+"</td>" );
    });
}

function SB_history(){
    $("#historyTable > tbody > tr").each(function(){
        sTitle		= $(this).find("td").eq(1).find("a").eq(0).html().replace(" - ","|");
        sShow		= sTitle.split("|")[0];
        sShow       = cleanShowName(sShow);
        sEpisode	= "s" + (sTitle.split("|")[1].length=4 ? "0" : "") + sTitle.split("|")[1].replace("x","e");
        sLink = $(this).find("td").eq(1).html();
        sLinkPB = basePB + sShow+" "+sEpisode+ extraPB +"' target='_blank'><img src='"+iconPB+"'/></a>";
        sLinkSD = baseSD + sShow+" "+sEpisode+ extraPB +"' target='_blank'><img src='"+iconSD+"'/></a>";
        //$(this).find("td").eq(1).html(sLinkSD +"&nbsp;"+ sLinkPB +"&nbsp;"+ sLink);
        $(this).find("td > a").before( sLinkSD+"&nbsp;"+sLinkPB+"&nbsp;" );
    });
}

function SB_backlog(){
    var aShows = [];
    var aShows_ = [];
    var aEpisodes = [];
    var sSearchLink = "";
    var iCount = 0;
    // GATHER DATA
    //       GET SHOWS
    $("tr").each(function(){
        var sShow_ = $(this).find("h2.backlogShow > a").eq(0).html();
        if (!sShow_) {
            sShow_ = aShows_[aShows_.length-1];
            iCount++;
        }else{
            iCount=0;
        }
        if (iCount >= 2) {
        	aShows.push( cleanShowName(sShow_) );
        }
        aShows_.push( cleanShowName(sShow_) );
    });;

    //       GET MATCHING EPISODES
    $("tr.wanted").each(function(){
        var sEpisode_ = $(this).find("td").eq(0).html();
        var aEpisode_ = sEpisode_.split("x");
        sEpisode_ = "s" + (aEpisode_[0].length==1 ? "0" : "") + aEpisode_[0] + "e" + (aEpisode_[1].length==1 ? "0" : "") + aEpisode_[1]
        aEpisodes.push( sEpisode_ );
    });

    // OUTPUT DATA
    var iIndex = 0;
    $("tr.wanted").each(function(){
        var sHTML = $(this).find("td").eq(0).html();
        var sLinkPB = basePB + aShows[iIndex]+" "+aEpisodes[iIndex]+ extraPB +"' target='_blank'><img src='"+iconPB+"'/></a>";
        var sLinkSD = baseSD + aShows[iIndex]+" "+aEpisodes[iIndex]+ extraPB +"' target='_blank'><img src='"+iconSD+"'/></a>";
        $(this).find("td").eq(0).html(sLinkPB +"&nbsp;"+ sLinkSD +"&nbsp;"+ sHTML);
        iIndex++;
    });
}