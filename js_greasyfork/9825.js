// ==UserScript==
// @name         Auto-chan ded
// @namespace    http://localhost/
// @version      0.9.3
// @description  rough replacement to autoupdate. Best effort to fix but will not be as good as the original.
// @author       chronomeister
// @match        http://www.himeuta.net/f32*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9825/Auto-chan%20ded.user.js
// @updateURL https://update.greasyfork.org/scripts/9825/Auto-chan%20ded.meta.js
// ==/UserScript==
//
// possible issues:
// if the latest post is on a new page it will stop updating posts on previous page.
// only update if text changed. wont update just a image/video.
 
var afkcheck = 0;
const MAXAFK = 10;
const DELAYTIME = 30000; // time between updates
const MINDELAY = 29000; // if delay time is low make sure not to bombard
var lastcheck = Date.now();
var latestpage;
var baseurl;
var lastpost;
 
var GREATDELAY = MINDELAY > DELAYTIME ? MINDELAY : DELAYTIME; 
 
var blackjack = true;
var hookers = true;
 
var maxpostnum = "";
 
var ajfunc;
 
$(document).ready(init());
 
function init() {
    $('#postlist .separator').css("text-align", "center");
    $('#postlist .separator').text("Autorefesh active. Refreshing every 30 seconds...");
    if (
        $('span.selected').first().parent().children('span').index(
            $('span.selected').first()) 
        != $('span.selected').first().parent().children('span').length - 1
    ) return;
    $(".postbitim").each(function() {maxpostnum = $(this).attr('id')});
    pageparse = location.href.split(/himeuta\.net\/(.*?)(\d+).html/);
    baseurl = pageparse[1];
    latestpage = pageparse[2];
    ajfunc = setInterval(updatePage, GREATDELAY);
    $('#postlist').hover(resetAFK);
    vb_disable_ajax = 2;
    unsafeWindow.vb_disable_ajax = 2;
    //alert(unsafeWindow.vb_disable_ajax);
}
 
function updatePage() {
     
    if (afkcheck++ < MAXAFK)
    {
        lastpost = $(".postbitim").last().attr('id');
        if ($('input[name=pp]') !== undefined) getNewPosts();
    }　else if (afkcheck > MAXAFK) {
        clearInterval(ajfunc);
        $('#postlist .separator').text("Inactivity detected. Suspending refresh.");
    }
}
 
function getNewPosts() {
    $.ajax(baseurl + latestpage + ".html", {
        processData: false
    })
    .done(function(html) { appendPosts(html)});
    lastcheck = Date.now();
}
 
function appendPosts(html) {
     
    newposts = $(html).find(".postbitim");
    newposts.each(function() {
        if ( $(".postbitim").siblings("#" + $(this).attr("id")).length > 0 && 
             ( $(".postbitim").siblings("#" + $(this).attr("id")).find(".content").remove('.ncode_imageresizer_warning').text() != $(this).find(".content").remove('.ncode_imageresizer_warning').text() && // the text matches
               !$(".postbitim").siblings("#" + $(this).attr("id")).find(".content").find(".twitter").length // posts with twitter always update so we just ignore if it has twitter; not perfect but #works
             )
           ) {//post already exists, update if needed
            oldp = $(".postbitim").siblings("#" + $(this).attr("id")).find(".content").clone();
            newp = $(this).find(".content").clone();
            oldp.find(".ncode_imageresizer_warning").remove();
            oldp.find('a:contains(Spoiler)').remove();
            newp.find('a:contains(Spoiler)').remove();
            if (oldp.text().replace('[−]', '[+]') != newp.text()) {
                console.log( $(this).attr("id") + " : \n" + oldp.text() + " \nnew post: " + newp.text());
                $(".postbitim").siblings("#" + $(this).attr("id")).find(".content").replaceWith($(this).find(".content"));
            }
        } else { //post doesn't exist add to end
            if ($(this).attr('id') > maxpostnum) {
                //console.log($(this).attr('id'));
                $("#posts").append($(this));
                maxpostnum = $(this).attr('id');
                $(this).find(".quickreply, .newreply").click(qr_newreply_activate);
 
            }
        }
    });
    nextpage = $(html).find('span.selected').next('span').first().contents().text();
    if (nextpage !== "")
    {
        latestpage = nextpage;
        getNewPosts();
    }
    $(".postbitim").each(function() {
        if ($(this).attr('id') < lastpost && $(".postbitim").length > $('input[name=pp]').attr('value'))
        {
            $(this).remove(); //get rid of top posts above limit.
        }
    });
}
 
function resetAFK() {
    if (afkcheck > MAXAFK)
        ajfunc = setInterval(updatePage, GREATDELAY);
    afkcheck = 0;
    $('#postlist .separator').text("Autorefesh active. Refreshing every 30 seconds...");
}