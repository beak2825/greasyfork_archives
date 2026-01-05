// ==UserScript==
// @name Facebook Admin GraphLinks
// @namespace https://www.facebook.com/groups
// @author Mark
// @version 2.03
// @description Inserts user graph search links to aid user vetting
// @match *://www.facebook.com/*
// @exclude *://*.facebook.net/*
// @exclude *://*.facebook.com/search/*
// @exclude *://*.facebook.com/photo.php*
// @exclude *://*.facebook.com/*/photos
// @exclude *://*.facebook.com/messages/*
// @exclude *://*.facebook.com/rsrc.php/v3/*
// @exclude *://*.facebook.com/plugins/*
// @exclude *://*.facebook.com/ajax/*
// @exclude *://*.facebook.com/xti.php*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/7167/Facebook%20Admin%20GraphLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/7167/Facebook%20Admin%20GraphLinks.meta.js
// ==/UserScript==
// <div class="_5h60" id="pagelet_timeline_main_column" data-referrer="pagelet_timeline_main_column" data-gt="&#123;&quot;profile_owner&quot;:&quot;100004418554372&quot;,&quot;ref&quot;:&quot;timeline:timeline&quot;&#125;">
// 1.8: Update for new profile layout
// 1.9: Bold high integrity groupnames
// 1.10: New admin source variable name
// 1.11 FB reverted source variable name...
// 1.12 Double declaration removal
// 1.13 Red group text
// 1.14 FB group layout de jour
// 1.19 FB matching excludes
// 1.20 storyies-by
// 1.21 date ranges
// 1.22 version sync
// 1.23 _66jq admin list layout
// 1.24 Switch to mtouch and graphsearch url as a stop-gap
// 2.02 New graph posts-by
// 2.03 Emit userNumber

(function(){
    /***********************************************************/

    var profileBarClass = '_70k';

    function add_extra_to_admin (jNode) {
        console.log("add_extra_to_admin: start");
        var ajaxtext = jNode.attr('ajaxify');
        var hovertext = jNode.attr('data-hovercard');
        // var display = jNode.attr('display', 'block');
        $('._66jq').css({display:'block'});
        var userNumber = 0;
        // /ajax/groups/members/add_post.php?group_id=123456&members%5B0%5D=987654321&source=request_queue_managed_groups&inner_tab=qualified_pending_members&sort_option=managed_groups&ignore=1&block_user=1
        var inforegex = /\/ajax\/groups\/members.*=(.*)\&.*source=request_queue.*block_user=1/;
        var regexresult = inforegex.exec( ajaxtext );
        if (regexresult !== null) {
            userNumber = regexresult[1];
            add_nodes(jNode, userNumber, 'requests');
        }
        regexresult = inforegex.exec( hovertext );
        if (regexresult !== null) {
            userNumber = regexresult[1];
            add_nodes(jNode, userNumber, 'requests');
        }
        inforegex = /\/ajax\/groups\/members.*=(.*)\&.*source=requests_queue.*block_user=1/;
        regexresult = inforegex.exec( hovertext );
        if (regexresult !== null) {
            userNumber = regexresult[1];
            add_nodes(jNode, userNumber, 'requests');
        }
        // 2017.07.08: data-hovercard="/ajax/hovercard/user.php?id=1683288317"
        inforegex = /\/user.php\?id=(\d+)/;
        regexresult = inforegex.exec( hovertext );
        console.log('regexresult ' + regexresult);
        if (regexresult !== null) {
            userNumber = regexresult[1];
            console.log('add_extra_to_admin userNumber ' + userNumber);
            add_nodes(jNode, userNumber, 'requests');
        }
    }

    var Base64 = { 
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", 

        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input); 
            while (i < input.length) { 
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++); 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63; 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                } 
                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4); 
            } 
            return output;
        },


        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ""); 
            while (i < input.length) { 
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++)); 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4; 
                output = output + String.fromCharCode(chr1); 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            } 
            output = Base64._utf8_decode(output); 
            return output; 
        },

        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) { 
                var c = string.charCodeAt(n); 
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                } 
            } 
            return utftext;
        },

        _utf8_decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) { 
                c = utftext.charCodeAt(i); 
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                } 
            } 
            return string;
        } 
    } 

    function add_bold_to_group_name (jNode) {
        jNode.css({'font-weight':'Bold', 'color':'red'});
    }

    function add_extra_to_profile_using_button (jNode) {
        var userNumber = jNode.attr('data-profileid');
        if (userNumber !== null) {
            console.log("add_extra_to_profile: userNumber is " + userNumber);
            var profileBar = $("DIV." + profileBarClass);
            if (profileBar !== null) {
                add_nodes(profileBar, userNumber, 'profile');
            }
        }
    }

    function add_extra_to_profile_no_button (jNode) {
        var userNumberstring = jNode.attr('data-gt');
        if (userNumberstring !== null) {
            console.log("add_extra_to_profile: userNumberstring is " + userNumberstring);
            // "profile_owner":"100004418554372"
            userNumberregex = /.*profile_owner":"([0-9]+)".*/;
            var userNumber = userNumberstring.match(userNumberregex)[1];
            console.log("add_extra_to_profile: userNumber is " + userNumber);
            var profileBar = $("DIV." + profileBarClass);
            if (profileBar !== null) {
                add_nodes(profileBar, userNumber, 'profile');
            }
        }
    }

    function add_nodes (jNode, userNumber, linestyle) {
        var br_elem = '<BR>';
        var spaces = '&nbsp;&nbsp;&nbsp;';
        var propic = '<A HREF="https://graph.facebook.com/' + userNumber + '/picture?width=999">ProfPic</A>';
        var posts_by_filter = Base64.encode('{"rp_author":"{\\"name\\":\\"author\\",\\"args\\":\\"' + userNumber + '\\"}","rp_chrono_sort":"{\\"name\\":\\"chronosort\\",\\"args\\":\\"\\"}"}');
        var posts_by = '<A HREF="https://www.facebook.com/search/posts/?q=*&epa=FILTERS&filters=' + posts_by_filter + '">Posts-By</A>';
        if (linestyle === 'requests') {
            jNode.after(br_elem, userNumber, spaces, propic, spaces, posts_by);
        } else {
            jNode.after(br_elem, userNumber, spaces, propic, spaces, posts_by, br_elem, br_elem);
        }
    }

    // waitForKeyElements ('A[ajaxify$="block_user=1"]', add_extra_to_admin);
    waitForKeyElements ('A[class="_z_3"]', add_extra_to_admin);
    waitForKeyElements ('BUTTON[text="Block"]', add_extra_to_admin);
    waitForKeyElements ('DIV[id="member_requests_pagelet"]', add_extra_to_admin);
    // waitForKeyElements ('BUTTON[data-floc="profile_box"]', add_extra_to_profile_using_button);
    waitForKeyElements ('DIV[id="pagelet_timeline_main_column"]', add_extra_to_profile_no_button);
    waitForKeyElements ('A[HREF$="/groups/aupairssydney/"]', add_bold_to_group_name);
    waitForKeyElements ('A[HREF$="/groups/sydneyaupairs/"]', add_bold_to_group_name);
    waitForKeyElements ('A[HREF$="/groups/aupairsupportaustralia/"]', add_bold_to_group_name);
    waitForKeyElements ('A[HREF$="https://www.facebook.com/groups/aupairssydney/"]', add_bold_to_group_name);
    waitForKeyElements ('A[HREF$="https://www.facebook.com/groups/sydneyaupairs/"]', add_bold_to_group_name);
    waitForKeyElements ('A[HREF$="https://www.facebook.com/groups/aupairsupportaustralia/"]', add_bold_to_group_name);
    function waitForKeyElements (selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
        var targetNodes, btargetsFound;
        if (typeof iframeSelector == "undefined")            targetNodes     = $(selectorTxt);
        else            targetNodes     = $(iframeSelector).contents () .find (selectorTxt);

        if (targetNodes  &&  targetNodes.length > 0) {
            targetNodes.each ( function () {
                var jThis        = $(this);
                var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                if (!alreadyFound) {
                    console.log('waitForKeyELements running ' + jThis);
                    actionFunction (jThis);
                    jThis.data ('alreadyFound', true);
                }
            } );
            btargetsFound   = true;
        } else { btargetsFound   = false; }
        var controlObj      = waitForKeyElements.controlObj  ||  {};
        var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl     = controlObj [controlKey];
        if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
            clearInterval (timeControl);
            delete controlObj [controlKey];
        } else {
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                    waitForKeyElements ( selectorTxt, actionFunction, bWaitOnce, iframeSelector );
                }, 500);
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj   = controlObj;
    }
})();

