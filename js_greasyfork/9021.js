// ==UserScript==
// @name         Dota2Lounge Match Statistics 
// @namespace    http://your.homepage/
// @version      0.1
// @description  Simple tampermonkey javascript for showing up teams statistics on d2l match page
// @author       chpz
// @include     http://dota2lounge.com/match*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9021/Dota2Lounge%20Match%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/9021/Dota2Lounge%20Match%20Statistics.meta.js
// ==/UserScript==

$("<div id='spinner'><img src='http://loungetools.16mb.com/ajax-loader.gif' alt='Loading...'></div>").insertBefore("div .full:eq(0)");

var arr = [];
arr["d2lname"] = [];  
arr["ggname"] = []; 
arr["jdname"] = [];
arr["ggurl"] = [];
arr["jdurl"] = [];

var matchInfo =[];
matchInfo["url"] = [];
matchInfo["t1"] = [];
matchInfo["t2"] = [];

var jdnameT1;
var jdnameT2;
var flag = 0;

jQuery.fn.outerHTML = function(s) {
    return s
    ? this.before(s).remove()
    : jQuery("<p>").append(this.eq(0).clone()).html();
};

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.item_small { display: block;padding: 5px;overflow: hidden; }');
addGlobalStyle('.ct {text-decoration: underline;} ');
addGlobalStyle('.match_compare_line {height: 25px;background: #888;margin-bottom: 10px;}');
addGlobalStyle('.match_compare_line div {height: 25px;background: #d42;}');
addGlobalStyle('.match_compare_r {float: right;padding-bottom: 10px;}');
addGlobalStyle('.match_compare_l {float: left;padding-bottom: 10px;}');
addGlobalStyle('.match_compare_c {text-align: center;padding-bottom: 10px;}');
addGlobalStyle('.sub {text-align: center;}');
addGlobalStyle('.cl {background-color: #B8B8B8;height: 1px;margin: 10px 0;}');
addGlobalStyle('div#spinner{float: left;font-size: 0.8em;text-align: center;width: 100%;padding-top:20px;padding-bottom:20px;position: relative;}');
addGlobalStyle('span.lose {color: #C00;}');
addGlobalStyle('span.draw {color: #F60;}');

function parseMatchInfoGT(matchInfo,flag) { 
    var teamInfo =[];
    GM_xmlhttpRequest({
        method: "GET",
        url: matchInfo,   
        onload: function(data) {
            var html = data.responseText;
            teamInfo.push($("<div>").html(html).find(".match_head .left a").attr("target","_blank").outerHTML());
            $("<div>").html(html).find("#content .pad:eq(1),#content .pad:eq(0)").each(function()  {
                $(this).find('a').attr("target","_blank");
                $(this).find(".item.small .sub").css('width', '');
                $(this).find(".item.small").each(function()  {
                    $(this).find(".sub:eq(0)").css("display","block");
                });
                $(this).find(".item.small").each(function()  {
                    $(this).find(".sub:eq(4)").css("display","block");
                });
                $(this).find(".item.small .sub:eq(4)").css("display","block");
                if (flag == 0) {
                    teamInfo.push($(this).find(".match_compare_line"));
                    teamInfo.push($(this).find(".match_compare_r"));
                    teamInfo.push($(this).find(".match_compare_l"));
                    teamInfo.push($(this).find(".match_compare_c"));
                    teamInfo.push($(this).find(".item.small").attr("class","item-small"));
                }
                if (flag == 1) {
                    $(this).find(".match_compare_line div").css("float","right");
                    teamInfo.push($(this).find(".match_compare_line"));
                    teamInfo.push($(this).find(".match_compare_r").css("float","left"));
                    teamInfo.push($(this).find(".match_compare_l").css("float","right"));
                    teamInfo.push($(this).find(".match_compare_c"));
                    teamInfo.push($(this).find(".item.small").attr("class","item-small"));
                }
            });
            $("div .full:eq(0) .half:eq(1)").append(teamInfo);

        }		
    });
}

function callServerAsync(arr,jdname,flag,jdteam) { 
    var teamInfo =[];
    GM_xmlhttpRequest({
        method: "GET",
        url: arr,   
        onload: function(data) {
            var html = data.responseText;
            var tag = $("<div>").html(html).find('#content .pad h1 small').text().replace("(","").replace(")","").trim();
            console.log(tag);
            $("<div>").html(html).find('.item_small').each(function()  {
                $(this).find('a').attr("target","_blank");
                var team1 = $(this).find('span:eq(1)').text().replace("vs.","").trim();
                var team2 = $(this).find('span:eq(2)').text().replace("vs.","").trim();
                var score = $(this).find('span:eq(3)').text().trim();
                if (tag == team1 && score.substr(0,1) > score.substr(2,3) || tag == team2 && score.substr(0,1) < score.substr(2,3))
                {
                   $(this).find('span:eq(3)').addClass("win"); 
                }
                else if (score.substr(0,1) == score.substr(2,3))
                {
                    $(this).find('span:eq(3)').addClass("draw");
                }
                else {
                    $(this).find('span:eq(3)').addClass("lose");
                }
                
                $(this).find('span:eq(1)').css("padding-left","10px");
                var replace = $(this).find('span:contains(' + jdname.substr(0,3) + ')').text().replace("vs.","").trim();
                $(this).find('span:contains(' + jdname.substr(0,3) + ')').html(function(_, html) {
                    return html.replace(replace, '<span class="ct">' + replace + '</span>');
                });
                              
                $(this).attr("target","_blank");
                teamInfo.push($(this).outerHTML());
            });

            if (flag == 0) {
                $("div .full:eq(0) .half:eq(0)").append(teamInfo);
            }
            else if (flag == 1) {
                $("div .full:eq(0) .half:eq(2)").append(teamInfo);
            }		
        }		
    });

}
var url = "http://loungetools.16mb.com/teams.json" + "?" +new Date();
console.log(url);
GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: function(xhr) {
        
        var data = eval("(" + xhr.responseText + ")"); 
        var teams = data.teams;
        for ( var i in teams) {
            arr["d2lname"].push(teams[i].d2lname);
            arr["ggname"].push(teams[i].ggname);
            arr["jdname"].push(teams[i].jdname);
            arr["ggurl"].push(teams[i].ggurl);
            arr["jdurl"].push(teams[i].jdurl);
        }
        console.log(arr["d2lname"]); 
        $("<div class='full'></div>").insertBefore("div .full");
        $("<div class='half' style='float:left;font-size: 0.8em;text-align: left;width: 35%;position:relative'></div>").prependTo("div .full:eq(0)");
        $("<div class='half' style='float:left;font-size: 0.8em;text-align: center;width: 24%;position:relative'></div>").prependTo("div .full:eq(0)");
        $("<div class='half' style='float:left;font-size: 0.8em;text-align: justify;width: 35%;position:relative;'></div>").prependTo("div .full:eq(0)");
        var i;
        var t1 = $("span[style='width: 45%; float: left; text-align: right'] b").text().replace(" (win)", "");
        var t2 = $("span[style='width: 45%; float: left; text-align: left'] b").text().replace(" (win)", "");
        for (i=0; i < arr['d2lname'].length; i++) {
            var jdname = arr['jdname'][i];
            var jdteam = arr['jdname'][i];
            if (t1 == arr['d2lname'][i]) {
                flag = 0;
                jdnameT1 = arr['jdname'][i];
                jdname = t1;
                callServerAsync(arr["jdurl"][i],jdname,flag,jdteam);
            }
            else if (t2 == arr['d2lname'][i]) {
                flag = 1;
                jdnameT2 = arr['jdname'][i];
                jdname = t2;
                callServerAsync(arr["jdurl"][i],jdname,flag,jdteam);
            }
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: "http://www.joindota.com/en/matches",   
            onload: function(data) {
                var html = data.responseText;
                $("<div>").html(html).find("#content .item").each(function()  {
                    $(this).find('a').attr("target","_blank");
                    matchInfo["url"].push($(this).find('a:not(.widget-matches-score-streams)').attr("href"));
                    matchInfo["t1"].push($(this).find('a:not(.widget-matches-score-streams) .sub:eq(0)').text().trim());
                    matchInfo["t2"].push($(this).find('a:not(.widget-matches-score-streams) .sub:eq(1)').text().replace("vs.","").trim());
                });
                var j = 0;
                for (i=0; i < matchInfo["url"].length; i++) {               
                    if (matchInfo["t1"][i] == jdnameT1 && matchInfo["t2"][i] == jdnameT2 && j == 0) {
                        j++;
                        flag = 0;
                        parseMatchInfoGT(matchInfo["url"][i],flag);
                        
                    }
                    else if (matchInfo["t1"][i] == jdnameT2 && matchInfo["t2"][i] == jdnameT1 && j == 0) {
                        j++;
                        flag = 1;
                        parseMatchInfoGT(matchInfo["url"][i],flag);
                    }
                }
                $('#spinner').hide();	
            }		
        });
        
    }
});

