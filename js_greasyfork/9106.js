// ==UserScript==
// @name           Facebook Timeline Cleaner
// @include        http://*.facebook.com/*
// @include        https://*.facebook.com/*
// @require        http://code.jquery.com/jquery-1.7.1.min.js
// @grant       none
// @version 3
// @namespace https://greasyfork.org/users/10328
// @description delete you facebook timeline
// @downloadURL https://update.greasyfork.org/scripts/9106/Facebook%20Timeline%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/9106/Facebook%20Timeline%20Cleaner.meta.js
// ==/UserScript==

/*
 * For jQuery Conflicts.
 */
this.$ = this.jQuery = jQuery.noConflict(true);

/*
 * No warranty. Use with your own risk. V0.6
 */

/*
 * Some Global Variables for User Edit
 */

var expandCount = 3;
var deleteCount = 3;
var limit = false;
/*
 * This is the Debug Level for the firebug console output. It goes up to 5
 */
var debug = 5;
/**
 * If this Option is true, nothing will be really deleted. But you can test
 * something without losing your timeline....
 */

var just_test = true;

/*
 * Internal Variables. Do not edit!
 */
var deletedMap = {};
var visi = {};
var triggeredMap = {};
var post_form_id = null;
var fb_dtsg = null;
var delete_time_bevor = null;
var iamstillontimeline = false;
var start = false;
var lastselected = null;
var insert_button = false;
var deleted = 0;
var hided = 0;
var only_hide = false;
var clicked_buttons = {};

/*
 * * * * *
 */
 
 


function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    var year = a.getFullYear();
    var month = months[a.getMonth() - 1];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

function parseUri(str) {
    var o = parseUri.options, m = o.parser[o.strictMode ? "strict" : "loose"].exec(str), uri = {}, i = 14;

    while (i--)
        uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
        if ($1)
            uri[o.q.name][$1] = $2;
    });

    return uri;
};

parseUri.options = {
    strictMode : false,
    key : [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ],
    q : {
        name : "queryKey",
        parser : /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser : {
        strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};

/**
 * This function scroll down on the Website and load new entrys.
 */
var expandMoreActivity = function() {
    /*
	var links = $('a[onclick]'); //
    for ( var i = 0; i < links.length; ++i) {
        // Umg this works only in german or english :
        if ((links[i].innerHTML === "More Activity") || (links[i].innerHTML === "Weitere Aktivitäten")) {
            if (limit) {
                expandCount -= 1;
            }
            links[i].click();
        }
    }
	*/
    if (!limit || (limit && expandCount >= 0)) {
        if (iamstillontimeline == true) {
            setTimeout(expandMoreActivity, 10000);

            if ($("#scrollen").length > 0) {
                if ($("#scrollen").is(':checked')) {
                    scrollTo(0, 1000000000); // Scroll Down!
                }
            }

            /*
             * Wir klicken jeden Button, damit die Daten generiert werden.
             */
            $('a[class="_42ft _42fu _4-s1 _2agf _p _42gx"] ').each(function() {
                if (clicked_buttons[$(this).attr("id")] == 1) {
                    // get the id of the button.
                    // logging("Id wurde schon geklickt",3);
                } else {

                    clicked_buttons[$(this).attr("id")] = 1;
                    $("i", this).click();
                }
            });
        }
    }
    logging('Expand', 2);
};

var getConstantParameters = function() {
    if (post_form_id != null && fb_dtsg !== null) {
        return true;
    } else {
        if (post_form_id === null) {
            $('input[name="post_form_id"]').each(function() {
                post_form_id = $(this).attr("value");
            });
        }
        if (fb_dtsg === null) {
            $('input[name="fb_dtsg"]').each(function() {
                fb_dtsg = $(this).attr("value");
            });
        }
        return (fb_dtsg !== null);
    }
};

/**
 * Change the color of the button
 * 
 * @param x
 *            object
 * @param y
 *            text
 * @param z
 *            color
 * 
 */
function button_status(x, y, z) {
    var text = $(x).find('span').text();

    if (text.match("-->")) {
        return

    }
    $(x).parent().css("background-color", z);
    $(x).find('span').text(text + " --> " + y);
}
/**
 * 
 * @param x
 *            this
 * @param y
 *            was
 */

function change_status(x, y) {
    if ($('#fd_set', x) === undefined) {
        $(x).parents('tr').prepend(' <p id="fd_set"> ' + y + '<p> ');
    }

}


function change_story_dom_color(story_dom_id,color){
    if($(String("#" + story_dom_id)).css("background-color") == 'red'){
        console.log("Eintrag ist bereits rot,keine aenderung!");
        return;
        }
    $(String("#" + story_dom_id)).css("background-color", color);
}

var createDeleteRequests = function() {

    if (start == false) {
        console.log("!!!!Abbruch");
        return;
    }
    if (getConstantParameters()) {
        logging('Begine.', 2);
        check_for_timeline(); // Mh does im on the right site?
        // Sometimes Facebook change here some shit...
        if ($('#globalContainer').size() == 0) {
            if (iamstillontimeline == true) {
                alert("ERROR: Maybe Facebook changed his design... \n please take a look for a newer version of this Script...");
            }
        }

        $('#globalContainer').each(
                function() {
                    $(this).find('a[ajaxify][rel=async-post]').each(
                            function() {
                                var remove = true;
                                var ajaxify = parseUri("https://facebook.com" + $(this).attr("ajaxify"));
                                now = Math.round((new Date()).getTime() / 1000);

                                /*
                                 * 
                                 * /ajax/timeline/all_activity/remove_content.php?action=
                                 * unlike&ent_identifier=S%3A_I1088313701%3A10202313708259264%3A1&story_dom_id=u_jsonp_7_q
                                 * &timeline_token=1088313701%3A10202313708259264%3A1%3A1406920461%3A1406617627
                                 */
                                var keys = [ 'action', 'timeline_token' ];
                                //
                                if (ajaxify.queryKey['action'] === undefined) {
                                    var tmp = this;
                                    var pfad = String(ajaxify.relative);
                                    if (pfad.match(/delete/)) {
                                        // console.log('What!?'+ajaxify.queryKey['story_dom_id']);
                                        var wasd = $(String("#" + ajaxify.queryKey['story_dom_id'])).parent().parent().parent().attr("id");
                                        if (wasd === undefined) {
                                            change_story_dom_color(ajaxify.queryKey['story_dom_id'],'magenta');
                                            console.log("Mh undefined alter");
                                            return;
                                        }
                                        console.log("NAME:" + wasd);
                                        var res = wasd.split("_");
                                        year = res[3];
                                        month = res[4];
                                        // var
                                        // newDate=month+",0,"+year;
                                        NEW_TIMESTAMP = new Date(year, month - 1, 0, 0, 0, 0).getTime() / 1000;

                                        if ((now - NEW_TIMESTAMP) < delete_time_bevor) {
                                            // $(String("#"+ajaxify.queryKey['story_dom_id'])).css("background-color",
                                            // 'orange');
                                            button_status(tmp, 'Keine Action,aber zu Jung!(' + NEW_TIMESTAMP + ')', 'green');
                                            change_story_dom_color(ajaxify.queryKey['story_dom_id'],'green');


                                        } else {
                                            /*
                                             * Die hier loeschen!
                                             */
                                            change_story_dom_color(ajaxify.queryKey['story_dom_id'],'orange');
                                            button_status(tmp, 'no action,but delete(' + NEW_TIMESTAMP + ')', 'orange');

                                            tmp_atrr = $(this).attr('ajaxify').replace(/confirm/, "");
                                            $(this).attr('ajaxify', tmp_atrr);
                                            if (just_test == false) {
                                                // confirm
                                               counter_up("delete");
                                                $(this).find("span").click();
                                            }
                                        }

                                        return;
                                    }
                                    button_status(tmp, 'Keine Action', 'green');
                                    console.log(ajaxify.relative);
                                    return;

                                }
                                var time = 0;
                                time = ajaxify.queryKey['timeline_token'];
                                time = time.split('%3A');
                                var Post_timestamp = "";
                                Post_timestamp = parseInt(time[3]);

                                var tmp_date = timeConverter(time[3]);
                                $(this).parents('tr').prepend(tmp_date);
                                // console.log(tmp_date);

                                for ( var i = 0; i < keys.length; ++i) {
                                    if (ajaxify.queryKey[keys[i]] === undefined) {
                                        remove = false;
                                        console.log("Nichtgenug Parameter!" + keys[i]);
                                        var tmp = this;
                                        button_status(tmp, 'Nichtgenug Parameter!', 'green');
                                        return;
                                    }
                                }

                                // logging("AjaxDatei:"+ajaxify.file,2);

                                /*
                                 * Hier wird überprüft, ob die Post ggf. ein
                                 * bestimmtes alter haben sollen. Definiert
                                 * über delete_time_bevor in sec vor now
                                 */
                                now = Math.round((new Date()).getTime() / 1000);
                                // Testen ob die ID schon
                                // bearbeitet wurde

                                if (deletedMap[ajaxify.queryKey['ent_identifier']] !== undefined) {
                                    // $(this).parents('tr').prepend("schon
                                    // geloescht!");
                                    // return;
                                }

                                // zugelassende aktionen

                                if (ajaxify.queryKey['action'] !== "hide" && ajaxify.queryKey['action'] !== "remove_comment"
                                        && ajaxify.queryKey['action'] !== "unlike" && ajaxify.queryKey['action'] !== "remove_content"
                                        && ajaxify.queryKey['action'] !== "unvote") {
                                    // $(this).parents('tr').prepend("Falsche
                                    // Action");
                                    var tmp = this;
                                    button_status(tmp, 'wrong action', 'green');

                                    if (ajaxify.queryKey['action'] !== "star" && ajaxify.queryKey['action'] !== "allow"
                                            && ajaxify.queryKey['action'] !== "mark_spam") {

                                        console.log("Wrong action:" + ajaxify.queryKey['action']);
                                    }
                                    return;

                                }

                                if (delete_time_bevor !== false) {
                                    if (Post_timestamp === "") {
                                        console.log("ORANGE:" + Post_timestamp);
                                        var newtext = $(this).find('span').text() + " -->Kein Timestamp";
                                        $(this).find('span').text(newtext);
                                        return;
                                    }

                                    if ((now - Post_timestamp) < delete_time_bevor) {

                                        deletedMap[ajaxify.queryKey['story_fbid']] = "Zu Jung!";
                                        console.log("This Entry is too young! NEXT! ID:", ajaxify.queryKey['story_fbid']);
                                        console.log("SollZeit: >", delete_time_bevor, " Ist Zeit:", now - Post_timestamp);
										console.log("SollZeit: >",timeConverter(now-delete_time_bevor));
                                        var tmp = this;
                                        button_status(tmp, 'to young', 'green');
                                        change_story_dom_color(ajaxify.queryKey['story_dom_id'],'green');

                                        return;
                                    }
                                }

                                /** Verstecken von Eintraegen * */
                                if ("visibility.php" === ajaxify.file) {
                                    var tmp = this;
                                    button_status(tmp, '-->Hide', 'yellow');
                                    change_story_dom_color(ajaxify.queryKey['story_dom_id'],'yellow');

                                    if (just_test == false) {
                                        $(this).find("span").click();
                                        //$(this).remove();
                                    }

                                    $("#hided").text(parseInt($("#hided").text()) + 1);
                                    /** Loeschen von Eintraegen * */
                                } else if ("remove_content.php" === ajaxify.file && only_hide == false) {
                                    var tmp = this;
                                    button_status(tmp, '-->delete', 'red');
                                    change_story_dom_color(ajaxify.queryKey['story_dom_id'],'red');
									if (just_test == false) {
									if(ajaxify.queryKey['action']  === 'unlike')
									{
									counter_up("unlike");
									}else
									{
                                      counter_up("delete");
									  }
                                    
                                        $(this).find("span").click();
                                    }
                                    // $(this).remove();
                                } else if (ajaxify.file === "show_story_options.php") {
                                    if (triggeredMap[ajaxify.queryKey['story_fbid']] === undefined) {
                                        var evt = document.createEvent("MouseEvents");
                                        evt.initMouseEvent("mouseover", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                                        $(this).context.dispatchEvent(evt);
                                        triggeredMap[ajaxify.queryKey['story_fbid']] = true;
                                    }
                                }

                                else {
                                    console.log("Cant handle -->", ajaxify.file);
                                }
                            });

                });
        //$("#delete").text($("div[style='background-color: red;']").size()+$("div[style='background-color: orange;']").size());
    }
    if (iamstillontimeline == true) {
        setTimeout(createDeleteRequests, 10000);

    }
};

/**
 * This function check your URL. If your url cotain "$suchstring", the script
 * will load.
 * @returns bool --> true = on timeline or  false = not on timeline
 */
function check_for_timeline() {
    var suchstring = /(allactivity)/g; // REGEX for the URL
    var suchergebnis = suchstring.test($(location).attr('href'));
    if (suchergebnis != false) {
        iamstillontimeline = true; // You are on the right Site!
    } else {
        if ((iamstillontimeline == true) && (start == true)) {
            // Ugh it seems the user change the side...
            alert('Abort!');
            start = false;
        }
        iamstillontimeline = false;
        insert_button = false;
    }
}
/**
 * A Logging Function with global debug level.
 * @param text Logtext
 * @param level loglevel
 */
function logging(text, level) {
    if (debug >= level) {
        console.log(text);
    }
}

/**
 * Insert the GUI Button
 */
function add_button() {
    insert_button = true;
    $('#pagelet_main_column_personal div [class="_2o3t fixed_elem"] div[class="clearfix uiHeaderTop"] ').append('<input type="checkbox" id="scrollen"  name="scrollen" checked>Autoscrollen');
    $('#pagelet_main_column_personal div [class="_2o3t fixed_elem"] div[class="clearfix uiHeaderTop"]').append('<input type="checkbox" id="enginerun"  name="enginerun">Run <input type="checkbox" id="test_checkbox"  name="test_checkbox"><b>DryRun</b>');
	$('#pagelet_main_column_personal div [class="_2o3t fixed_elem"] div[class="clearfix uiHeaderTop"]').append('<br>Entrys older than <input id="groesse" type="number" min="1"  step="1" value="90" style = "width: 4em";> Days');
    $('span[class="uiSearchInput"]').append(
                    '<br><span class="uiButtonGroupItem selectorItem"><div class="uiSelector inlineBlock sectionMenu uiSelectorNormal uiSelectorDynamicLabel"><div class="wrap "><button class="hideToggler"></button><a rel="toggle" data-length="30" aria-haspopup="1" href="#" role="button" class="uiSelectorButton uiButton uiButtonOverlay "><span class="uiButtonText">Privacy Extension</span></a><div class="uiSelectorMenuWrapper uiToggleFlyout"><div class="uiMenu uiSelectorMenu" role="menu"><ul class="uiMenuInner"><li class="uiMenuItem uiMenuItemRadio uiSelectorOption " data-key="year_2012" data-label="Hide everything on Timeline" ><a href="#" rel="ignore" class="itemAnchor"   tabindex="0" aria-checked="true"><span class="itemLabel fsm">Hide everything on Timeline older than X days</span></a></li><li class="uiMenuItem uiMenuItemRadio uiSelectorOption" data-key="year_2011" data-label="Delete everything"><a href="#" rel="ignore" class="itemAnchor" tabindex="0"  aria-checked="false"><span class="itemLabel fsm">Delete everything</span></a></li><li class="uiMenuItem uiMenuItemRadio uiSelectorOption " data-key="Hide everything on Timeline" data-label="Hide everything on Timeline"><a href="#" rel="ignore"  class="itemAnchor" tabindex="0" aria-checked="false"><span class="itemLabel fsm">Hide everything on Timeline</span></a></li><li class="uiMenuItem uiMenuItemRadio uiSelectorOption" data-key="year_2009" data-label="Delete everything older than X Days"><a href="#"  rel="ignore" class="itemAnchor" tabindex="0" aria-checked="false"><span class="itemLabel fsm">Delete everything older than X Days</span></a></li></ul></div></div><button class="hideToggler"></button></div><select id="selectvalue"><option value=""></option><option value="year_2012">Hide everything on Timeline older than X days</option><option value="year_2011">Delete everything</option><option value="year_201x">Hide everything on Timeline</option><option value="year_2009">Delete things older than X Days</option><option value="year_2010" >Hide everything on Timeline older than X Days</option></select></div></span>');
					
    if (just_test != false) {
       /* $("#test_checkbox").prop('checked', true); */
    }
}

function counter_up(objectname){
var aktuell=parseInt($("#"+objectname).text());
aktuell=aktuell+1;
$("#"+objectname).text(aktuell);
}


/**
 * This is the Main Function. It checks if you are on the activies log or not.
 * :D
 */


 
function main() {

 check_for_timeline(); // Get my location.
  if (iamstillontimeline == true) {
    if ($("#test_checkbox").length > 0) {
        if ($("#test_checkbox").is(':checked')) {
            just_test = true;
        } else {
            just_test = false;
        }
    }
    if ($("#enginerun").length > 0) {
        if ($("#enginerun").is(':checked') === false) {
            start = false;
            console.log("Setze Start auf false");
        }
    }

   
    // console.log($(location).attr('href')); // Say me where iam
   
        if (insert_button == false) {
            console.log('Button rein!');
            add_button();
        }

        if (just_test != false) {
            logging("This is only a test! Nothing will really deleted!", 1);
        } else {
            logging("WARNING: bomb is planted", 1);
        }

        // Check thas the Button is really inserted...
        if (document.getElementById("selectvalue")) {
            var selected = document.getElementById("selectvalue").options[document.getElementById("selectvalue").selectedIndex].text;

            if (selected == "Stop") {
                console.log("Stop");
                start = false;
            }

            if (start == false) {
                logging('Waiting for Startsignal', 1);

                if ((lastselected != selected) && (selected != "")) {
                    var text = "";
					var days=parseInt($('#groesse').val());
                    switch (selected) {

                    case "Hide everything on Timeline":
                        text = 'WARNING: Are you sure you want hide EVERYTHING on your Timeline? Only you can see the old entrys!';
                        only_hide = true;
                        delete_time_bevor = false;
                        break;

                    case "Delete everything":
                        text = 'WARNING: Are you sure to delete EVERYTHING on your Timeline?!';
                        only_hide = false;
                        delete_time_bevor = false;
                        break;

                    case "Hide everything on Timeline older than X days":
                        text = 'WARNING: Are you sure you want hide all entrys that older than '+days+' Days?';
                        only_hide = true;
                        delete_time_bevor = 60 * 60 * 24 * days;
                        break;

                    case "Delete things older than X Days":
                        text = 'WARNING: Are you sure you want DELETE all entrys that older than '+days+' Days?';
                        only_hide = false;
                        delete_time_bevor = 60 * 60 * 24 * days;
                        break;

                    case "Stop":
                        text = 'WARNING: ' + selected;

                        return;
                        break;
                    }
                    lastselected = selected;

                    if (confirm(text)) {
					        if (just_test != false) {
								alert("This is only a test! Nothing will really deleted!\nIf you want a normal run, unselect DryRun");
							}
                        /* $("#enginerun").prop('checked', true); */
                        $('div[class="_2o49"] span[class="uiButtonGroupItem selectorItem"]').append(
                                ' Unlike: <span  id="unlike">0</span> Deleted: <span  id="delete">0</span>Hide:<span  id="hided">0</span >');
                        start = true;
                        console.log("Start with ", selected);
                        createDeleteRequests();
                        expandMoreActivity();
                        console.log("ajaxify:", $('*[ajaxify]').attr("ajaxify"));
                    }
                }
            }

        } else {
            // dafuq?! Button was not found... so insert it!!!
			console.log("mh button not found... intert it");
            add_button();
        }
    }
    setTimeout(main, 2000); // Start itself in 2 seconds again.
}
setTimeout(main, 4000);
