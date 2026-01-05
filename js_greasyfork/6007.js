// ==UserScript==
// @name           Grepolis Academy Overview
// @name:de        Grepolis Akademie Übersicht
// @name:en        Grepolis Academy Overview
// @namespace      grepolis
// @description    Grepolis: List all researches of all towns
// @description:de Grepolis: Eine Übersicht über alle Forschungen aller Städte.
// @description:en Grepolis: List all researches of all towns
// @include        http://*.grepolis.*
// @exclude        http://forum.*.grepolis.*
// @exclude        http://wiki.*.grepolis.*
// @icon           http://s3.amazonaws.com/uso_ss/icon/185038/large.png?1385676234
// @version        2.15
// @grant          GM_listValues
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_info
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/6007/Grepolis%20Academy%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/6007/Grepolis%20Academy%20Overview.meta.js
// ==/UserScript==

/************************************************************************
 * Main Script
 ***********************************************************************/
function XR_main_script(DATA) {
    /************************************************************************
	 * Global variables
	 ***********************************************************************/
    var XR = {};
    var wID = Game.world_id;
    var mID = Game.market_id;
    var aID = Game.alliance_id;
    var sID = Game.player_id;
    var pName = Game.player_name;

    $(".tb_activities").css("left","227px");

    $(".toolbar_buttons").append('\
<div class="toolbar_button academy">\
<div id="BTN_academyoverview" class="icon" style="background:url(http://gpde.innogamescdn.com/images/game/academy/points_25x25.png) no-repeat scroll 0 0 rgba(0, 0, 0, 0); margin:2px;">\
<div class="js-caption"></div>\
</div>\
</div>\
');
    
    $("#BTN_academyoverview").click(function() {
        XR.Functions.academyOverview();
    });

    /************************************************************************
	 * Languages
	 ***********************************************************************/
    XR.Lang = {
        get : function (a, b) {
            if (XR.Lang[mID] !== undefined && XR.Lang[mID][a] !== undefined && XR.Lang[mID][a][b] !== undefined) {
                return XR.Lang[mID][a][b];
            } else if (XR.Lang[mID] !== undefined && XR.Lang[mID][a] !== undefined) {
                return XR.Lang[mID][a];
            } else if (XR.Lang.en !== undefined && XR.Lang.en[a] !== undefined && XR.Lang.en[a][b] !== undefined) {
                return XR.Lang.en[a][b];
            } else {
                return XR.Lang.en[a];
            }
        },
        de : {
            meta : {
                lang : 'deutsch'
            },
            academyoverview :"Akademie-Übersicht",
            research_technology :"Technologie erforschen",
            reset_technology :"Forschung zurücksetzen",
            confirm_reset_technology :"Bestätigungsabfrage beim Zurücksetzen einer Forschung",
            save :"Speichern"
        },
        en : {
            meta : {
                lang : 'english'
            },
            academyoverview :"Academy Overview",
            research_technology :"Research technology",
            reset_technology :"Reset technology",
            confirm_reset_technology :"Confirmation prompt when reset a technology",
            save :"Save"
        }
    };

    /************************************************************************
	 * Ajax Call functions
	 ***********************************************************************/
    XR.CallAjaxFunction = {
        player : {
            index : function () {
                XR.Functions.SettingsWindow();
            },
        },
        notify : {
            fetch : function () {
                console.log("fetch");
                console.log(document.URL);
            },
        }
    };

    /************************************************************************
	 * Functions
	 ***********************************************************************/
    XR.Functions = {
        academyOverview : function () {
            var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_XR_ACADEMYOVERVIEW) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_XR_ACADEMYOVERVIEW);
            var research_ids = [];
            for (i=1; i<=34; i=i+3) {
                $.each(GameData.researches, function () {
                    if ($(this)[0].building_dependencies.academy==i) {
                        research_ids.push($(this)[0].id);
                    }
                });
            }

            var factor = Math.min(Math.max(Math.ceil(research_ids.length/3), 10), 13);
            wincontent = '\
<style type="text/css">\
.fleft { float:left; }\
.cleft { clear:left; }\
.XRresearchHeader { float:left; border: 1px solid #000000; margin: 0 2px; }\
.XRresearch { float:left; margin: 0 2px; }\
.XRresearchleft  { float:left; width:2px; height:24px; background:url(http://gpde.innogamescdn.com/images/game/survey/survey_sprite.png) no-repeat scroll 0px -39px rgba(0, 0, 0, 0); }\
.XRresearchright { float:left; width:2px; height:24px; background:url(http://gpde.innogamescdn.com/images/game/survey/survey_sprite.png) no-repeat scroll -360px -39px rgba(0, 0, 0, 0); }\
.XRresearchtrue { float:left; width:38px; height:24px; background:url(http://gpde.innogamescdn.com/images/game/survey/survey_sprite.png) no-repeat scroll -321px -39px rgba(0, 0, 0, 0); position:relative; }\
.XRresearchfalse { float:left; width:38px; height:24px; background:url(http://gpde.innogamescdn.com/images/game/survey/survey_sprite.png) no-repeat scroll -2px -39px rgba(0, 0, 0, 0); position:relative; }\
.XRresearchgrey { float:left; width:38px; height:24px; background:url(http://gpde.innogamescdn.com/images/game/survey/survey_sprite.png) no-repeat scroll -2px 0 / auto 36px rgba(0, 0, 0, 0); opacity:0.8; position:relative; }\
.XRresearchUp { position:absolute; bottom:2px; right:0px; cursor:pointer; width:15px; height:15px; background:url(http://gpde.innogamescdn.com/images/game/academy/up.png) no-repeat scroll 0 0 rgba(0, 0, 0, 0); background-size:15px auto; }\
.XRresearchUp:hover { background-position:0 -15px; }\
.XRresearchDown { position:absolute; bottom:2px; right:0px; cursor:pointer; width:15px; height:15px; background:url(http://gpde.innogamescdn.com/images/game/academy/down.png) no-repeat scroll 0 0 rgba(0, 0, 0, 0); background-size:15px auto; }\
.XRresearchDown:hover { background-position:0 -15px; }\
</style>\
<div style="margin-bottom:5px">\
<div style="width:850px; height:440px; overflow:hidden; background:url(http://gpde.innogamescdn.com/images/game/overviews/fixed_table_header_bg.jpg) repeat-x scroll 0 0 rgba(0, 0, 0, 0)">\
<div id="header">\
<div class="townlist_width" style="width:200px; height:40px; float:left;"></div>\
</div>\
<div id="datalist" style="width:850px; height:400px; overflow:auto;">\
<ul id="academyoverview_townlist" class="game_list">\
</ul>\
</div>\
</div>\
</div>';
            wnd.setContent(wincontent);
            if (research_ids.length>0) { 
                $("#header").append('<a href="#" id="moveleft" class="game_arrow_left" style="margin:11px 4px 0 0;"></a><div id="academyoverview_container" style="float:left; width:'+Math.round(factor*46).toString()+'px; height:42px; overflow:hidden;"><div id="academyoverview_header" class="academyoverview_movetab" style="width:'+Math.round(research_ids.length*46).toString()+'px; height:42px; position:relative; left:0px;"></div></div><a href="#" id="moveright" class="game_arrow_right" style="margin:11px 0 0 4px;"></a>');
                $("#moveleft").click(function(){
                    if (parseInt($("#academyoverview_header").css("left"))<0) {
                        $(".academyoverview_movetab").animate({left:'+='+factor*46+'px'},"slow");
                    } else {
                        $(".academyoverview_movetab").animate({left:'-'+(Math.ceil(research_ids.length/factor)-1)*factor*46+'px'},"slow");
                    }
                });
                $("#moveright").click(function(){
                    if (parseInt($("#academyoverview_header").css("left"))<=(Math.ceil(research_ids.length/factor)-1)*factor*-46) {
                        $(".academyoverview_movetab").animate({left:'0px'},"slow");
                    } else {
                        $(".academyoverview_movetab").animate({left:'-='+factor*46+'px'},"slow");
                    }
                });
            }

            $.each(research_ids, function(i, val) {
                if (research_ids[i]=="take_over") {
                    $("#academyoverview_header").append('<div class="research_box XRresearchHeader"><div class="research_icon research40x40 '+research_ids[i]+'_old"></div></div>');
                } else {
                    $("#academyoverview_header").append('\
<div class="research_box XRresearchHeader">\
<div class="research_icon research40x40 '+research_ids[i]+'" style="position:relative;">\
<div style="position:absolute; bottom:0px; right:2px; color:#FFF; text-shadow:1px 1px 0 #000; font-family:Verdana; font-size:14px; font-weight:700;">'+GameData.researches[research_ids[i]].research_points+'</div>\
</div>\
</div>\
');
                }
            });
            for (i=research_ids.length; i<=Math.floor(research_ids.length/factor+1)*factor; i++) {
                $("#academyoverview_header").append('<div class="research_box XRresearchHeader" style="border-color:transparent;"><div class="research_icon research40x40" style="background-position:-580px -580px;"></div></div>');
            }

            XRTownNames = [];
            for (i=0; i<ITowns.towns_collection.length; i++) {
                XRTownNames.push(ITowns.towns_collection.models[i].attributes.name);
            }
            XRTownNames.sort();

            var liclass = "even";
            for (k=0; k<XRTownNames.length; k++) {
                for (i=0; i<ITowns.towns_collection.length; i++) {
                    if (XRTownNames[k] == ITowns.towns_collection.models[i].attributes.name) {
                        XRtownid = ITowns.towns_collection.models[i].attributes.id;
                        XRtownname = ITowns.towns_collection.models[i].attributes.name;
                        XRtownlink = ITowns.towns_collection.models[i].attributes.link_fragment;
                        XRacademypoints = (ITowns.getTown(XRtownid).getBuildings().attributes.academy * GameDataResearches.getResearchPointsPerAcademyLevel()) + (ITowns.getTown(XRtownid).getBuildings().attributes.library * GameDataResearches.getResearchPointsPerLibraryLevel());
                        for (j=0; j<research_ids.length; j++) {
                            if (ITowns.towns[XRtownid].researches().attributes[research_ids[j]]===true) {
                                XRacademypoints -= GameData.researches[research_ids[j]].research_points;
                            }
                        }
                        /*						$("#XRpoints"+XRtownid).html(XRacademypoints+' P.');*/
                        $("#academyoverview_townlist").append('\
<li class="'+liclass+'">\
<div class="townlist_width" style="width:200px; float:left; margin-top:2px;">\
<a href="#'+XRtownlink+'" class="gp_town_link">'+XRtownname+'</a>\
<div id="XRpoints'+XRtownid+'" style="float:right; width:40px; height:20px; font-size:12px; line-height:20px;">'+XRacademypoints+' P.</div>\
<div style="clear: both;"></div>\
</div>\
<div style="float:left; width:20px; height:20px; background:url(http://gpde.innogamescdn.com/images/game/academy/points_25x25.png) no-repeat;"></div>\
<div style="float:left; width:'+Math.round(factor*46).toString()+'px; height:24px; overflow:hidden;">\
<div id="researches_'+XRtownid+'" class="academyoverview_movetab" style="width:'+Math.round(research_ids.length*46).toString()+'px; height:24px; position:relative; left:0px;">\
</div>\
</div>\
<div style="clear:left;"></div>\
</li>\
');
                        for (j=0; j<research_ids.length; j++) {
                            if (ITowns.towns[XRtownid].buildings().attributes.academy < GameData.researches[research_ids[j]].building_dependencies.academy) {
                                $("#researches_"+XRtownid).append('\
<div class="XRresearch">\
<div class="XRresearchleft"></div>\
<div class="XRresearchgrey"></div>\
<div class="XRresearchright"></div>\
</div>\
');
                            } else if (ITowns.towns[XRtownid].researches().attributes[research_ids[j]]===true) {
                                XR_researchDown = (DATA.XR_reset_technology!=="checked") ? '' : '<div id="DOWN_'+XRtownid+'_'+research_ids[j]+'" class="XRresearchDown"></div>';
                                $("#researches_"+XRtownid).append('\
<div class="XRresearch">\
<div class="XRresearchleft"></div>\
<div class="XRresearchtrue">'+XR_researchDown+'</div>\
<div class="XRresearchright"></div>\
</div>\
');
                            } else {
                                XR_researchUp = (DATA.XR_research_technology!=="checked" || XRacademypoints < GameData.researches[research_ids[j]].research_points) ? '' : '<div id="UP_'+XRtownid+'_'+research_ids[j]+'" class="XRresearchUp"></div>';
                                $("#researches_"+XRtownid).append('\
<div class="XRresearch">\
<div class="XRresearchleft"></div>\
<div class="XRresearchfalse">'+XR_researchUp+'</div>\
<div class="XRresearchright"></div>\
</div>\
');
                            }
                        }
                        if (liclass=="even") { liclass = "odd"; } else { liclass = "even"; }
                        break;
                    }
                }
            }
            $(".research40x40").css("background-repeat","no-repeat");
            $(".townlist_width").css("width",Math.round(200+((13-factor)*46)).toString()+"px");
            $(".XRresearchUp").click(function() {
                console.log($(this).attr("id")+" Up");
                splitid = $(this).attr("id").split("_");
                for (i=0; i<splitid.length; i++) {
                    console.log(splitid[i]);
                }
                thistownid = splitid[1];
                thisresearchid = '';
                for (i=2; i<splitid.length; i++) {
                    if (i>2) {
                        thisresearchid += '_'+splitid[i];
                    } else {
                        thisresearchid += splitid[i];
                    }
                }
                $.ajax({
                    type: "POST",
                    url: "/game/frontend_bridge?town_id="+ thistownid + "&action=execute&h="+ Game.csrfToken,
                    data:  
                    	'json=%7B%22model_url%22%3A%22ResearchOrder%22%2C%22action_name%22%3A%22research%22%2C%22arguments%22%3A%7B%22id%22%3A%22'+thisresearchid+'%22%7D%2C%22town_id%22%3A'+thistownid+'%2C%22nl_init%22%3Atrue%7D'
                }).done(function (data) {
									console.log(data);
									$("#UP_"+thistownid+"_"+thisresearchid).parent().removeClass("XRresearchfalse").addClass("XRresearchtrue");
									$("#UP_"+thistownid+"_"+thisresearchid).remove();
								});
                console.log($(this).attr("id")+" Up");
            });
            $(".XRresearchDown").click(function() {
                console.log($(this).attr("id")+" Down");
            });
        },
        SettingsWindow : function () {
            if ($(".XR_settings").length===0)  {
                $("DIV.settings-menu ul:last").append('\
<li class="with-icon">\
<img class="support-menu-item-icon XR_settings" src="http://gpde.innogamescdn.com/images/game/academy/points_25x25.png" style="width:20px; height:15px; vertical-align:bottom;">\
<a href="#" class="XR_settings">'+XR.Lang.get("academyoverview")+'</a>\
</li>\
');
                $(".XR_settings").click(function() {
                    console.log("XR_settings");
                    if ($("#settings_form").length === 0) {
                        $(".settings-container").html('\
<div id="player_settings">\
<form id="settings_form" method="post" action="javascript:void(0)">\
<div id="s_academy_overview" class="section" style="display: block;">\
<div class="game_header bold">'+XR.Lang.get("academyoverview")+'</div>\
<div class="checkbox_new research_technology '+DATA.XR_research_technology+'">\
<div class="cbx_icon XR_cbox"></div><div class="cbx_caption">'+XR.Lang.get("research_technology")+'</div>\
</div>\
<div class="checkbox_new reset_technology '+DATA.XR_reset_technology+'">\
<div class="cbx_icon XR_cbox"></div><div class="cbx_caption">'+XR.Lang.get("reset_technology")+'</div>\
</div>\
<div style="margin-left:20px;" class="checkbox_new confirm_reset_technology '+DATA.XR_confirm_reset_technology+'">\
<div class="cbx_icon XR_cbox"></div><div class="cbx_caption">'+XR.Lang.get("confirm_reset_technology")+'</div>\
</div>\
</div>\
</form>\
</div>\
');
                    } else {
                        $("#s_email_notifications").hide();
                        $("#s_notifications").hide();
                        $("#s_windows_mgr").hide();
                        $("#s_buffering").hide();
                        $("#s_map").hide();
                        $("#s_timezone").hide();
                        $("#s_city_preview").hide();
                        $("#s_confirmations").hide();
                        $("#s_sound_config").hide();
                        $("#settings_form").append('\
<div id="s_academy_overview" class="section" style="display: block;">\
<div class="game_header bold">'+XR.Lang.get("academyoverview")+'</div>\
<div class="checkbox_new research_technology '+DATA.XR_research_technology+'">\
<div class="cbx_icon XR_cbox"></div><div class="cbx_caption">'+XR.Lang.get("research_technology")+'</div>\
</div>\
<div class="checkbox_new reset_technology '+DATA.XR_reset_technology+'">\
<div class="cbx_icon XR_cbox"></div><div class="cbx_caption">'+XR.Lang.get("reset_technology")+'</div>\
</div>\
<div style="margin-left:20px;" class="checkbox_new confirm_reset_technology '+DATA.XR_confirm_reset_technology+'">\
<div class="cbx_icon XR_cbox"></div><div class="cbx_caption">'+XR.Lang.get("confirm_reset_technology")+'</div>\
</div>\
</div>\
');
                    }
                    $(".research_technology").click(function() {
                        if ($(this).hasClass("checked")) {
                            $(this).removeClass("checked");
                            DATA.XR_research_technology = "";
                            XR_setValue("XR_research_technology", "");
                        } else {
                            $(this).addClass("checked");
                            DATA.XR_research_technology = "checked";
                            XR_setValue("XR_research_technology", "checked");
                        }
                    });
                    $(".reset_technology").click(function() {
                        if ($(this).hasClass("checked")) {
                            $(this).removeClass("checked");
                            DATA.XR_reset_technology = "";
                            XR_setValue("XR_reset_technology", "");
                        } else {
                            $(this).addClass("checked");
                            DATA.XR_reset_technology = "checked";
                            XR_setValue("XR_reset_technology", "checked");
                        }
                    });
                    $(".confirm_reset_technology").click(function() {
                        if ($(this).hasClass("checked")) {
                            $(this).removeClass("checked");
                            DATA.XR_confirm_reset_technology = "";
                            XR_setValue("XR_confirm_reset_technology", "");
                        } else {
                            $(this).addClass("checked");
                            DATA.XR_confirm_reset_technology = "checked";
                            XR_setValue("XR_confirm_reset_technology", "checked");
                        }
                    });
                });
            }
        },
        mutationobserver : function () {
            var observer = new MutationObserver(function (mutations) {
            });
            observer.observe($('body').get(0), {
                attributes : false,
                childList : true,
                characterData : false
            });
        },
        windowmanager : function () {
            //Academyoverview
            function WndHandlerXRacademyoverview(wndhandle) {
                this.wnd = wndhandle;
            }
            Function.prototype.inherits.call(WndHandlerXRacademyoverview, WndHandlerDefault);
            WndHandlerXRacademyoverview.prototype.getDefaultWindowOptions = function () {
                return {
                    position : ["center","center"],
                    width : 850,
                    height : 500,
                    minimizable : true,
                    title : XR.Lang.get("academyoverview")
                };
            };
            GPWindowMgr.addWndType("XR_ACADEMYOVERVIEW","xracademyoverview", WndHandlerXRacademyoverview, 1);
        }
    };

    /************************************************************************
	 * Observer
	 ***********************************************************************/
    $.Observer(GameEvents.game.load).subscribe('XR', function (e, data) {
        XR.Functions.mutationobserver();
        XR.Functions.windowmanager();
        $(document).ajaxComplete(function (event, xhr, settings) {
            var a = settings.url.split("?");
            var b = a[0].substr(6);
            var c = a[1].split("&")[1].substr(7);
            console.log(b+" "+c);
            if (b in XR.CallAjaxFunction && c in XR.CallAjaxFunction[b]) {
                XR.CallAjaxFunction[b][c](event, xhr, settings);
            }
        });
    });
}

/************************************************************************
 * Start Method
 ***********************************************************************/
var DATA = {
    script_version : GM_info.script.version,
    XR_research_technology : (GM_getValue("XR_research_technology") !== undefined ? GM_getValue("XR_research_technology") : "checked"),
    XR_reset_technology : (GM_getValue("XR_reset_technology") !== undefined ? GM_getValue("XR_reset_technology") : ""),
    XR_confirm_reset_technology : (GM_getValue("XR_confirm_reset_technology") !== undefined ? GM_getValue("XR_confirm_reset_technology") : "checked")
};

unsafeWindow.XR_setValue = function (name, val) {
    setTimeout(function () {
        GM_setValue(name, val);
    }, 0);
};

if (typeof exportFunction == 'function') {
    exportFunction(unsafeWindow.XR_setValue, unsafeWindow, {
        defineAs : "XR_setValue"
    });
}

function appendScript() {
    if (unsafeWindow.Game) {
        var XR_script = document.createElement('script');
        XR_script.type = 'text/javascript';
        XR_script.id ="XR_script";
        XR_script.textContent = XR_main_script.toString() +"\n XR_main_script(" + JSON.stringify(DATA) +");";
        document.body.appendChild(XR_script);
    } else if (mID==="") {
        setTimeout(function () {
            appendScript();
        }, 100);
    }
}

appendScript();
