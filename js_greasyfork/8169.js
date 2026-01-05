// ==UserScript==
// @name         WME UR Responder
// @namespace    https://greasyfork.org/en/scripts/8169-wme-ur-responder
// @version      0.1.7
// @description  Responds with canned messages to URs of various states
// @author       Joshua M Kriegshauser (WME: autenil)
// @match        https://editor-beta.waze.com/*editor*
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8169/WME%20UR%20Responder.user.js
// @updateURL https://update.greasyfork.org/scripts/8169/WME%20UR%20Responder.meta.js
// ==/UserScript==

// Version history
// 0.1 - Initial (unlisted) release
// 0.1.1 - Added alert after all ajax requests have completed
// 0.1.2 - Performance improvements for lots of URs
// 0.1.3 - Moved config into its own tab/configuration to respond to certain types of URs
// 0.1.3.1 - Bugfix: wouldn't save a checkbox if it had been un-set and re-set.
// 0.1.4 - Speculative fix for the tab not appearing all the time; added a day delay for sending Hello requests.
// 0.1.4.1 - Turn off debug mode :/
// 0.1.5 - Fix bootstrap
// 0.1.6 - Fix tabs for new WME
// 0.1.7 - Fixed to work with latest version of WME 9/6/2018
var URResponder_Version = "0.1.7";

var URResponder_DefaultHello = "Hi there! Waze didn't provide enough information to solve this issue. Please provide more information including start location and destination address.";
var URResponder_DefaultRemind = ""; // No default reminder
var URResponder_DefaultGoodbye = "We didn't hear back so we're going to close this map issue. If the problem persists please report again.";
var URResponder_DefaultDays = 7;
var URResponder_DefaultHelloDays = 0;
var URResponder_DefaultTypeMask=-1; // everything

var URResponder_BaseURI = "https://" + window.location.host + W.Config.api_base+"/MapProblems/UpdateRequests?ids=";
var URResponder_PostURI = "https://" + window.location.host + W.Config.api_base+"/MapProblems/UpdateRequests/Comment";

var URResponder_DAY_IN_MS = 86400000;

var URResponder_debugOnly = false;

function URResponder_bootstrap() {
    console.log("URResponder_bootstrap");

    var URResponder = {};
    // Add functions below this point

    var mapping = {};
    mapping[6]='Incorrect turn';
    mapping[7]='Incorrect address';
    mapping[9]='Missing roundabout';
    mapping[10]='General error';
    mapping[11]='Turn not allowed';
    mapping[12]='Incorrect junction';
    mapping[13]='Missing bridge overpass';
    mapping[14]='Wrong driving direction';
    mapping[16]='Missing road';

    URResponder.allowedMask = URResponder_DefaultTypeMask;

    URResponder.install = function() {
        // Create our text boxes
        console.log("URResponder.install");

        // CSS
        var c = '';
        c += '#sidepanel-urresponder label { cursor:pointer; margin:0px 0px 0px; vertical-align: middle;font-size: 10px;}';
        c += '#sidepanel-urresponder .URResponderCheckbox { text-decoration:none; cursor:pointer; color: #000000; margin:0px 0px 0px; vertical-align: middle; font-size: 12px;}';
        c += '#sidepanel-urresponder .URResponderLabel { text-decoration:none; cursor:pointer; color: #000000; font-size: 12px;}'; // margin-top: 5px;

        // Install CSS
        $("head").append($('<style type="text/css">' + c + '</style>'));

        // Add a tab
        $('#user-info ul.nav-tabs').first()
            .append($('<li>')
                    .append($('<a>UR Responder</a>')
                            .attr('data-toggle','tab')
                            .attr('href','#sidepanel-urresponder')
                            .css('padding','4px')));

        $('#user-info div.tab-content').first()
        	.append($("<div>")
                    .attr('class','tab-pane')
                    .attr('id','sidepanel-urresponder')
                    .append($('<div>')
                            .css("clear","both")
                            .css("margin-bottom","10px")
                            .append($("<h4>")
                                    .html("UR Responder v"+URResponder_Version+(URResponder_debugOnly?" [DEBUG]":""))
                                    .css("color","black"))
                            .append($("<h5>")
                                    .html("Hello message")
                                    .css("color","black")
                                    .css("text-align","left"))
                            .append($("<textarea>")
                                    .attr("id","URResponderHello")
                                    .css("height","40px")
                                    .css("position","relative")
                                    .css("margin-top","0px")
                                    .css("margin-bottom","10px")
                                    .css("width","100%")
                                    .css("clear","both"))
                            .append($("<h5>")
                                    .html("Reminder message")
                                    .css("color","black")
                                    .css("text-align","left"))
                            .append($("<textarea>")
                                    .attr("id","URResponderRemind")
                                    .css("height","40px")
                                    .css("position","relative")
                                    .css("margin-top","0px")
                                    .css("margin-bottom","10px")
                                    .css("width","100%")
                                    .css("clear","both"))
                            .append($("<h5>")
                                    .html("Goodbye message")
                                    .css("color","black")
                                    .css("text-align","left"))
                            .append($("<textarea>")
                                    .attr("id","URResponderGoodbye")
                                    .css("height","40px")
                                    .css("position","relative")
                                    .css("margin-top","0px")
                                    .css("margin-bottom","10px")
                                    .css("width","100%")
                                    .css("clear","both"))
                            .append($('<div>')
                                    .attr('id', 'URResponderOptions')
                                    .append('<h5>')
                                            .html('Respond for the following types:')
                                            .css('color','black')
                                            .css('text-align','left')
                                    .append($('<br>')))
                            .append($("<div>")
                                    .append($("<label>Wait</label>")
                                            .css('text-align','right')
                                            .css('margin-right','2%')
                                            .css('color','black'))
                                    .append($("<input>")
                                            .css("type","number")
                                            .css("width","10%")
                                            .css('text-align','center')
                                            .attr("id","URResponderHelloDays"))
                                    .append($("<label>Days before sending hello</label>")
                                            .css("text-align","left")
                                            .css("margin-left","2%")
                                            .css("color","black")))
                            .append($("<div>")
                                    .css("class","container")
                                    .append($("<button>Save</button>")
                                            .click(URResponder.save)
                                            .css("margin-left","2%")
                                            .css("margin-right","3%")
                                            .css("width","20%")
                                            .attr("title","Saves the current settings"))
                                    .append($("<button>GO!</button>")
                                            .click(URResponder.execute)
                                            .css("margin-left","2%")
                                            .css("margin-right","3%")
                                            .css("width","20%")
                                            .attr("title","Runs the UR Responder on the currently visible URs"))
                                    .append($("<input>")
                                            .css("type","number")
                                            .css("margin-left","20%")
                                            .css("width","10%")
                                            .attr("id","URResponderDays"))
                                    .append($("<label>Days</label>")
                                            .css("text-align","left")
                                            .css("margin-left","2%")
                                            .css("color","black"))
                                    .css("margin-bottom","50px"))));

        // Add in the option checkboxes
        for (var k in mapping) {
            $('#URResponderOptions').append($('<label>')
                                             //.attr('class','checkbox')
                                             .append($('<input>' + mapping[k] + '</input>')
                                                     .attr('type','checkbox')
                                                     .attr('id','URResponderAllow'+k)
                                                     .attr('class', 'URResponderCheckbox')
                                                     .change(URResponder.rebuildAllowedMask))
                                             ).append($('<br>'));
                                             //.append($('<span>'+mapping[k]+'</span>')
                                             //        .css('pointer-events','none')));
        };

        URResponder.load();
    };

    URResponder.load = function() {
        console.log("URResponder.load");
        $("#URResponderHello").val(localStorage.getItem('URResponderHello')||URResponder_DefaultHello);
        $("#URResponderRemind").val(localStorage.getItem('URResponderRemind')||URResponder_DefaultRemind);
        $("#URResponderGoodbye").val(localStorage.getItem('URResponderGoodbye')||URResponder_DefaultGoodbye);
        $("#URResponderDays").val(localStorage.getItem('URResponderDays')||URResponder_DefaultDays);
        $("#URResponderHelloDays").val(localStorage.getItem('URResponderHelloDays')||URResponder_DefaultHelloDays);

        URResponder.allowedMask = localStorage.getItem('URResponderAllowed')||URResponder_DefaultTypeMask;
        for (var k in mapping) {
            $('#URResponderAllow'+k).prop('checked', !!(URResponder.allowedMask & (1<<k)));
        }
    };

    URResponder.rebuildAllowedMask = function() {
        URResponder.allowedMask = URResponder_DefaultTypeMask;
        for (var k in mapping) {
            if (!$('#URResponderAllow'+k).prop('checked')) {
                URResponder.allowedMask &= ~(1 << k);
            }
        }
    };


    URResponder.save = function() {
        console.log("URResponder.save");

        var days = parseInt($('#URResponderDays').val());
        if (isNaN(days) || days < 3) {
            alert('Days must be at least 3. Setting to 3.');
            days = 3;
            $('#URResponderDays').val(days);
        }

        var helloDays = parseInt($('#URResponderHelloDays').val());
        if (isNaN(helloDays) || helloDays < 0) {
            helloDays = 0;
            $('#URResponderHelloDays').val(helloDays);
        }
        localStorage.setItem('URResponderHello', $('#URResponderHello').val());
        localStorage.setItem('URResponderRemind', $('#URResponderRemind').val());
        localStorage.setItem('URResponderGoodbye', $('#URResponderGoodbye').val());
        localStorage.setItem('URResponderDays', days);
        localStorage.setItem('URResponderHelloDays', helloDays);

        localStorage.setItem('URResponderAllowed', URResponder.allowedMask);
    };

    URResponder.reset = function() {
        // Can be invoked from the JS console to reset localStorage
        console.log("URResponder.reset");
        localStorage.removeItem('URResponderHello');
        localStorage.removeItem('URResponderRemind');
        localStorage.removeItem('URResponderGoodbye');
        localStorage.removeItem('URResponderDays');
        localStorage.removeItem('URResponderHelloDays');
        localStorage.removeItem('URResponderAllowed');
        URResponder.load();
    };

    URResponder.execute = function() {
        console.log("URResponder.execute");

        function onScreen(obj) {
            return obj.geometry && W.map.getExtent().intersectsBounds(obj.geometry.getBounds());
        }

        var myUserId = W.model.loginManager.user.id;
        console.log("User is " + myUserId + " (" + W.model.loginManager.user.userName + ")");

        var helloDays = parseInt($('#URResponderHelloDays').val());
        if (isNaN(helloDays) || days < 0) {
            helloDays = 0;
        }

        var days = parseInt($('#URResponderDays').val());
        if (isNaN(days) || days < 0) {
            console.log("URResponder.execute failed: days (" + days + ") NaN or < 0");
            return;
        }

        var helloDaysElapsed = URResponder_DAY_IN_MS * helloDays;

        var myHelloText = $('#URResponderHello').val();
        var myRemindText = $('#URResponderRemind').val();
        var myGoodbyeText = $('#URResponderGoodbye').val();

        var minElapsed = URResponder_DAY_IN_MS * days;

        function addComment(v, comment) {
            if (comment.length > 0) {
                console.log('Adding comment (' + comment + ') to UR ' + v.id + (URResponder_debugOnly?"**DEBUG**":""));
                if (!URResponder_debugOnly) {
                    // Send the comment via post
                    $.ajax({
                        url: URResponder_PostURI,
                        type: 'post',
                        data: {mapUpdateRequestID: v.id, text: comment},
                        headers: {'x-csrf-token': $.cookie('_csrf_token')},
                    }).always(function (data, status, xhr) {
                        console.log(status);
                    });
                }
            } else {
                console.log('Not adding empty comment to UR ' + v.id);
            }
        }

        var hello = 0;
        var remind = 0;
        var goodbye = 0;
        var evaluated = 0;
        var errors = 0;

        // Track outstanding ajax requests
        var requests = 0;
        var done = false;

        function report() {
            if (!done || requests !== 0) {
                return;
            }

            // Show a follow-up message
            var message = "Evaluated "+evaluated+" URs.";
            if ((hello + remind + goodbye) === 0) {
                message = message + " Nothing to do!";
            } else {
                if (hello) { message = message + " Sent "+hello+" Hello(s)."; }
                if (remind) { message = message + " Sent "+remind+" Reminder(s)."; }
                if (goodbye) { message = message + " Sent "+goodbye+" Goodbye(s)."; }
            }
            if (errors) { message = message + " (" + errors + " reported--see console)"; }
            // TODO: Hook toolbox (there doesn't appear to be a way to do this, but this is a reimplementation of WMETB_DispLog)
            if ($("#WMETB_logger") && $("#WMETB_logger").length > 0) {
                var n = $('<div id="mylog">').append('URResponder: ' + message);
                $("#WMETB_logger").append(n);
                n.delay(3e3).slideUp({ duration: 200, complete: function() { n.remove(); } });
            } else {
            	alert(message);
            }
        }

        function evalSession(v, ur, testOnly) {
            console.log("evalSession testOnly:"+testOnly);
            console.log(v);
            console.log(ur);
            if (!testOnly) ++evaluated;

            if ((URResponder.allowedMask & (1 << v.attributes.type)) === 0) {
                console.log('evalSession failed for '+v.attributes.id+': not allowed to respond to type '+v.attributes.type+'/'+v.attributes.typeText);
                return false;
            }

            if (ur.comments.length === 0) {
                // No comments. Send the hello message if there is no description.
                if (v.attributes.description == null || v.attributes.description == 'URResponderTest' || !isNaN(v.attributes.description)) {
                    if (helloDays <= 0 || (Date.now() - v.attributes.driveDate) >= helloDaysElapsed) {
                    	if (!testOnly) {
                    		++hello;
                    		addComment(ur, myHelloText);
                        }
                        return true;
                    }
                    console.log('evalSession failed for '+v.attributes.id+': not allowed to add a hello message yet');
                    return false;
                }
                console.log('evalSession failed for '+v.attributes.id+': no description or URResponderTest description');
                return false;
            }

            if (!ur.isFollowing) {
                // Weed out any that we're not following.
                console.log("evalSession failed for " + v.attributes.id + ": not following");
                return false;
            }

            // Time since last comment
            var elapsed = Date.now() - ur.comments[ur.comments.length-1].createdOn;
            if (elapsed < minElapsed) {
                console.log("evalSession failed for " + v.attributes.id + ": too short since last comment (" + (elapsed / URResponder_DAY_IN_MS) + " days)");
                return false;
            }

            var hasReminder = myRemindText.length > 0;
            if (hasReminder) {
                if (ur.comments.length != 1) { console.log("evalSession " + v.attributes.id + ": skipping reminder due to comments=" + ur.comments.length); }
                else if (ur.comments[0].userID != myUserId && ur.comments[0].userID != -1) { console.log("evalSession " + v.attributes.id + ": skipping reminder due to user " + ur.comments[0].userID + " is not me (" + myUserId +")"); }
                else if (ur.comments[0].text != myHelloText) { console.log("evalSession " + v.attributes.id + ": skipping reminder due to comment text (" + ur.comments[0].text + ") doesn't match my hello text (" + myHelloText + ")"); }
                else {
                    // Add the reminder text
                    if (!testOnly) {
                    	console.log("evalSession " + v.attributes.id + ": SUCCESS! Adding reminder text: " + myRemindText);
                    	++remind;
                    	addComment(ur, myRemindText);
                    }
                    return true;
                }
            }

            var hasGoodbye = myGoodbyeText.length > 0;
            if (hasGoodbye) {
                var prevText = hasReminder ? myRemindText : myHelloText;
                if (ur.comments[ur.comments.length-1].userID != myUserId && ur.comments[ur.comments.length-1].userID != -1) { console.log("evalSession " + v.attributes.id + ": skipping goodbye due to last comment from user other than me"); }
                else if (ur.comments[ur.comments.length-1].text != prevText) { console.log("evalSession " + v.attributes.id + ": skipping goodbye due to previous text ("+ur.comments[ur.comments.length-1].text+") doesn't match expected ("+prevText+")"); }
                else {
                    // Add the goodbye text
                    if (!testOnly) {
                    	console.log("evalSession " + v.attributes.id + ": SUCCESS! Adding goodbye text: " + myGoodbyeText);
                    	++goodbye;
                    	addComment(ur, myGoodbyeText);

                    	// Close out the session, but don't save it:
                    	console.log("Creating UpdateObject action for "+v.attributes.id + (URResponder_debugOnly?" **DEBUG**":""));
                    	if (!URResponder_debugOnly) {
                    		W.model.actionManager.add(new UpdateObject(v, {open: false, resolution: 1/*not identified*/}));
                        }
                    }

                    return true;
                }
            }

            console.log("evalSession reached the end with nothing to do. id="+v.attributes.id+" desc("+v.attributes.description+") comments: " + ur.comments);
            return false;
        }

        for (var k in W.model.mapUpdateRequests.objects) {
            var v = W.model.mapUpdateRequests.objects[k];
            //console.log("execute is evaluating " + v.attributes.id);
            if (v.type=="mapUpdateRequest" && onScreen(v) && v.editable && v.attributes.open) {
                // Early outs--ones we're not following that have comments
                if (v.attributes.hasComments) {
                    // If we already have a session for this, we can do some tests on it.
                    // If these tests pass, we'll fetch the most up-to-date info in case comments were added
                    var session = W.model.updateRequestSessions.objects[v.attributes.id];
                    if (session && !evalSession(v, session, true)) {
                        // evalSession in test mode doesn't mark as evaluated, so we'll do that here.
                        ++evaluated;
                        return;
                    }
                }
                // Fetch the comments. We have to have the session open to add new comments.
                ++requests;
                $.ajax({
                    dataType:"json",
                    url: URResponder_BaseURI+v.attributes.id,
                    success: function(json) {
                        for (var i = 0; i < $(json.updateRequestSessions.objects).length; ++i) {
                            try {
                                var ur = json.updateRequestSessions.objects[i];
                                evalSession(v, ur);
                            } catch(e) {
                                console.log('Ajax request for data for UR '+v.attributes.id+' failed: '+e);
                            }
                        }
                    },
                    complete: function() {
                        --requests;
                        report();
                    }
                });
            } else {
                //console.log(v.attributes.id + " didn't meet criteria: type("+v.type+") onScreen("+onScreen(v)+") editable("+v.editable+") open("+v.attributes.open+")");
            }
        }

        done = true;
        report();
    };

    URResponder.attempt = function() {
        console.log("URResponder.attempt");
        try {
            var t = $('#user-info ul.nav-tabs');
            var c = $('#user-info div.tab-content');
            if (typeof t !== "undefined" && t.length > 0 && typeof c !== "undefined" && c.length > 0) {
                console.log("URResponder installing: typeof(t):" + typeof t + ", t.length:" + t.length + ", typeof(c):" + typeof c + ", c.length:" + c.length);
                URResponder.install();
            } else {
                // try again shortly (half second)
                console.log("URResponder waiting because: typeof(t):" + typeof t + ", len:"+t.length+", typeof(c):" + typeof c+", len:"+c.length);
                setTimeout(URResponder.attempt, 500);
            }
        } catch (err) {
            console.log("URRepsonder caught exception: " + err);
            setTimeout(URResponder.attempt, 500);
        }
    };

    // Start up
    setTimeout(URResponder.attempt, 2000);
}
URResponder_bootstrap();