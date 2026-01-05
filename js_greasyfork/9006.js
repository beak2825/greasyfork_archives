// ==UserScript==
// @name          YouTube Auto Enhanced (Auto Buffer & Auto HD)
// @namespace     https://greasyfork.org/en/users/10166-moriarty
// @description   Buffers the video without autoplaying and puts it in HD if the option is on. For Firefox, Opera, & Chrome
// @include       http://*.youtube.com/*
// @include       http://youtube.com/*
// @include       https://*.youtube.com/*
// @include       https://youtube.com/*
// @copyright     CodeFelony
// @author        Moriarty
// @version       1.0.0
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require       https://greasyfork.org/scripts/9005-gm-config/code/GM_config.js?version=44609
// @require       https://greasyfork.org/scripts/9003-codefelony-js-library/code/CodeFelony%20JS%20Library.js?version=44596
// @require       https://greasyfork.org/scripts/9004-youtube-button-container-require/code/YouTube%20-%20Button%20Container%20(@require).js?version=44603
// @grant         GM_info
// @grant         GM_getValue
// @grant         GM_log
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/9006/YouTube%20Auto%20Enhanced%20%28Auto%20Buffer%20%20Auto%20HD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/9006/YouTube%20Auto%20Enhanced%20%28Auto%20Buffer%20%20Auto%20HD%29.meta.js
// ==/UserScript==

// run the script in an IIFE, to hide its variables from the global scope
(function (undefined) {

    'use strict';

    var aBlank = ['', '', ''],
        URL = location.href,
        navID = 'watch7-user-header',
        rYoutubeUrl = /^https?:\/\/([^\.]+\.)?youtube\.com\//,
        // rYoutubeBlacklistedUrl = /^https?:\/\/([^\.]+\.)?youtube\.com\/(feed\/(?!subscriptions)|account|inbox|my_|tags|view_all|analytics)/i,
        rList = /[?&]list=/i,
        rPlaySymbol = /^\u25B6\s*/,
        script_name = 'YouTube - Auto-Buffer & Auto-HD',
        tTime = (URL.match(/[&#?]t=([sm0-9]+)/) || aBlank)[1],
        ads = [
            'supported_without_ads',
            'ad3_module',
            'adsense_video_doc_id',
            'allowed_ads',
            'baseUrl',
            'cafe_experiment_id',
            'afv_inslate_ad_tag',
            'advideo',
            'ad_device',
            'ad_channel_code_instream',
            'ad_channel_code_overlay',
            'ad_eurl',
            'ad_flags',
            'ad_host',
            'ad_host_tier',
            'ad_logging_flag',
            'ad_preroll',
            'ad_slots',
            'ad_tag',
            'ad_video_pub_id',
            'aftv',
            'afv',
            'afv_ad_tag',
            'afv_instream_max',
            'afv_ad_tag_restricted_to_instream',
            'afv_video_min_cpm',
            'prefetch_ad_live_stream'
        ],
        hasMainBeenRun, nav, uw, wait_intv;

    function toNum(a) {
        return parseInt(a, 10);
    }

    function msg(infoObject) {

        var box_id_name = 'script_msg',
            box = document.getElementById(box_id_name),
            rLinebreaks = /[\r\n]/g,
            title = typeof infoObject.title === 'string' && infoObject.title.length > 3 ? infoObject.title : 'Message Box by Moriarty.';

        // add BR tags to line breaks
        infoObject.text = infoObject.text.replace(rLinebreaks, '<br />\n');

        function msg_close(event) {
            event.preventDefault();

            document.getElementById(box_id_name).style.display = 'none';

            if (typeof infoObject.onclose === 'function') {
                infoObject.onclose();
            }
        }

        if (box == null) {
            CFL.addStyle('' +
                '@keyframes blink { ' +
                    '50% { color: #B95C00; } ' +
                '}\n\n' +
                '#' + box_id_name + ' .msg-header { ' +
                    'animation: blink 1s linear infinite normal; ' +
                '}' +
            '');
            document.body.appendChild(
                CFL.create('div', {id : box_id_name, style : 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999999; background-color: rgba(0, 0, 0, 0.6);'}, [
                    // main box
                    CFL.create('div', {id : box_id_name + '_box', style : 'position: absolute; top: 25%; left: 25%; width: 50%; height: 50%; padding-top: 50px; background-color: #E9E9E9; border: 3px double #006195;'}, [
                        // header
                        CFL.create('div', {style : 'margin: 0 auto; padding-bottom: 40px; color: #F07800; font-size: 21pt; font-family: Arial, Verdana, "Myriad Pro"; font-weight: normal; text-shadow: 2px 2px 4px #C7C7C7; text-align: center;', 'class' : 'msg-header', textContent : title}),

                        // text (message)
                        CFL.create('div', {innerHTML : infoObject.text, style : 'text-align: center; margin: 0 auto; padding-top: 39px; border-top: 1px solid #B0B0B0; color: #000000; font-size: 11pt; font-family: Arial, Verdana, "Myriad Pro"; font-weight: normal; text-shadow: 0 0 8px #AEAEAE;'}),

                        // close button
                        CFL.create('div', {style : 'position: absolute; bottom: 20px; left: 0; width: 100%; text-align: center;'}, [
                            CFL.create('input', {id : box_id_name + '_close', type : 'button', value : 'Close Message', onclick : msg_close, style : 'margin: 0 auto; padding: 2px 20px; font-size: 11pt; font-family: Arial, Verdana, "Myriad Pro"; font-weight: normal;'})
                        ])
                    ])
                ])
            );
        } else {
            box.innerHTML += infoObject.text;
        }
        
    }

    // will return true if the value is a primitive value
    function isPrimitiveType(value) {
        switch (typeof value) {
            case 'string': case 'number': case 'boolean': case 'undefined': {
                return true;
            }
            case 'object': {
                return !value;
            }
        }

        return false;
    }

    function setPref(str, values) {
        var i, value, rQuery;

        for (i = 0; value = values[i]; i += 1) {
            // (several lines for readability)
            rQuery = new RegExp('[?&]?' + value[0] + '=[^&]*');
            str = str.replace(rQuery, '') + '&' + value[0] + '=' + value[1];
            str = str.replace(/^&+|&+$/g, '');
        }

        return str;
    }

    // unwraps the element so we can use its methods freely
    function unwrap(elem) {
        if (elem) {
            if ( typeof XPCNativeWrapper === 'function' && typeof XPCNativeWrapper.unwrap === 'function' ) {
                return XPCNativeWrapper.unwrap(elem);
            } else if (elem.wrappedJSObject) {
                return elem.wrappedJSObject;
            }
        }

        return elem;
    }

    function fixPlaySymbol() {
        document.title = document.title.replace(rPlaySymbol, '');
    }

    // grabs the un-wrapped player
    function getPlayer() {
        var doc = uw.document;
        return doc.getElementById('c4-player') || doc.getElementById('movie_player');
    }

    // adds the Options button below the video
    function addButton() {
        var footer = GM_config.get('footer') === true,
            footerHolder = document.getElementById('footer-main');

        addButtonToContainer('Auto-Buffer Options', function () { GM_config.open(); }, 'autobuffer-options');

        if (footer && footerHolder) {
            footerHolder.appendChild( document.getElementById('autobuffer-options') );
        }
    }

     // this function sets up the script
    function init() {
        hasMainBeenRun = false;

        // get the raw window object of the YouTube page
        uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : unwrap(window);

        // temporary fix to disable SPF aka the "red bar" feature
        if (uw._spf_state && uw._spf_state.config) {
            uw._spf_state.config['navigate-limit'] = 0;
            uw._spf_state.config['navigate-part-received-callback'] = function (targetUrl) {
                location.href = targetUrl;
            };
        }

        uw.onYouTubePlayerReady = function onYouTubePlayerReady(player) {
            if (typeof player === 'object' && hasMainBeenRun === false) {
                window.postMessage('YTAB__ready', '*');
            }
        };

        CFL.waitFor({
            selector : '#c4-player, #movie_player',
            verifier : function (elem) {
                elem = unwrap( elem[0] );
                return typeof elem.stopVideo === 'function';
            },
            done : function () {
                if (hasMainBeenRun === false) {
                    main();
                }
            }
        });
    }

    // this is the main function. it does all the autobuffering, quality/volume changing, annotation hiding, etc
    function main() {
        var player = getPlayer(),
            parent = player.parentNode,
            alreadyBuffered = false,
            time = 0,
            args, arg, buffer_intv, fv, isHTML5, playerClone,
            playIfPlaylist, val, userOpts;

        // don't let main() run again unless a new video is loaded
        hasMainBeenRun = true;

        // remove the player out of the document temporarily while other things are being done,
        // to reduce the time the player may be playing the video
        parent.removeChild(player);

        // set up the user options object
        userOpts = {
            activationMode    : GM_config.get('activationMode'),
            disableDash       : GM_config.get('disableDash') === true,
            hideAnnotations   : GM_config.get('hideAnnotations') === true,
            hideAds           : GM_config.get('hideAds') === true,
            quality           : GM_config.get('autoHD'),
            theme             : GM_config.get('theme'),
            volume            : GM_config.get('volume')
        };

        // set up other variables
        playerClone = player.cloneNode(true);
        fv = player.getAttribute('flashvars');
        isHTML5 = !!document.querySelector('video.html5-main-video');
        playIfPlaylist = !!URL.match(rList) && GM_config.get('autoplayplaylists') === true;

        if (uw.ytplayer && uw.ytplayer.config && uw.ytplayer.config.args) {
            args = uw.ytplayer.config.args;
        }

        // set the volume to the user's preference
        if (userOpts.volume != 1000) {
            player.setVolume(userOpts.volume);
        }

        if (isHTML5) {
            if (player.getPlaybackQuality() !== userOpts.quality) {
                player.setPlaybackQuality(userOpts.quality);
            }

            if (!playIfPlaylist) {
                if (userOpts.activationMode === 'buffer') {
                    player.pauseVideo();
                } else if (userOpts.activationMode === 'none') {
                    player.stopVideo();
                }
            }
        } else {
            // copy 'ytplayer.config.args' into the flash vars
            if (args) {
                for (arg in args) {
                    val = args[arg];
                    if ( args.hasOwnProperty(arg) && isPrimitiveType(val) ) {
                        fv = setPref(fv, [ [ arg, encodeURIComponent(val) ] ]);
                    }
                }
            }

            // ad removal
            if (userOpts.hideAds) {
                fv = fv.replace(new RegExp('(&amp;|[&?])?(' + ads.join('|') + ')=[^&]*', 'g'), '');
                /*
                fv = setPref(fv, 
                    ads.map(function (ad) {
                        return [ad, ''];
                    })
                );
                */
            }

            // disable DASH playback
            if (userOpts.disableDash) {
                fv = setPref(fv, [
                    ['dashmpd', ''],
                    ['dash', '0']
                ]);
            }

            // edit the flashvars
            fv = setPref(fv, [
                ['vq', userOpts.quality],                                                           // set the quality
                ['autoplay', (userOpts.activationMode !== 'none' || playIfPlaylist) ? '1' : '0' ],  // enable/disable autoplay
                ['iv_load_policy', userOpts.hideAnnotations ? '3' : '1' ],                          // enable/disable annotations
                ['theme', userOpts.theme],                                                          // use light/dark theme

                // some "just-in-case" settings
                ['enablejsapi',           '1'],                                                     // enable JS API
                ['jsapicallback',         'onYouTubePlayerReady'],                                  // enable JS ready callback
                ['fs',                    '1'],                                                     // enable fullscreen button, just in-case
                ['modestbranding',        '1'],                                                     // hide YouTube logo in player
                ['disablekb',             '0']                                                      // enable keyboard controls in player
            ]);

            // handle video starting time
            if ( tTime.match(/\d+m/) ) {
                time += toNum( tTime.match(/(\d+)m/)[1] ) * 60;
            }
            if ( tTime.match(/\d+s/) ) {
                time += toNum( tTime.match(/(\d+)s/)[1] );
            }
            if ( tTime.match(/^\d+$/) ) {
                time += toNum(tTime);
            }
            if (time <= 3) {
                // if no time is in the url, check the player's time
                try {
                    // sometimes causes a weird error.
                    // it will say getCurrentTime isn't a function,
                    // even though the typeof is "function",
                    // and alerting its value says [native code]
                    time = player.getCurrentTime();
                } catch (e) {}
                if (time <= 3) {
                    time = 0;
                }
            }
            fv = setPref( fv, [ ['start', time] ] );

            // set the new player's flashvars
            playerClone.setAttribute('flashvars', fv);

            // replace the original player with the modified clone
            parent.appendChild(playerClone);

            if (userOpts.activationMode === 'buffer' && playIfPlaylist === false) {
                // handle auto-buffering
                buffer_intv = CFL.setInterval(function () {
                    var player = getPlayer();

                    if (player && typeof player.getPlayerState === 'function') {
                        CFL.clearInterval(buffer_intv);

                        // pause the video so it can buffer
                        player.pauseVideo();

                        // seek back to beginning if time elapsed is not much
                        if (player.getCurrentTime() <= 3) {
                            player.seekTo(0);
                        }

                        // adjust to the 'play symbol in title' feature
                        window.setTimeout(fixPlaySymbol, 1000);
                    }
                }, 100);
            } else if (userOpts.activationMode === 'none') {
                // adjust to the 'play symbol in title' feature
                window.setTimeout(fixPlaySymbol, 1500);
            }
        }

        // show the first time user message, then set it to never show again
        if (GM_config.getValue('yt-autobuffer-autohd-first', 'yes') === 'yes') {
            msg({
                text : 'Welcome to "' + script_name + '".\n\n\n\n' +
                    'There is an options button below the video.\n\n\n\n' +
                    'The options screen will automatically open when you close this message.',
                title : '"' + script_name + '" Message',
                onclose : function () { GM_config.open(); }
            });
            GM_config.setValue('yt-autobuffer-autohd-first', 'no');
        }
    }

    // make sure the page is not in a frame
    // & is on a YouTube page (the @include works most of the time, but this is 100%)
    // & isn't on a blacklisted YouTube page
    if ( window !== window.top || !URL.match(rYoutubeUrl) /*|| URL.match(rYoutubeBlacklistedUrl)*/ ) { return; }

    // quit if CFL/GM_config is non-existant
    if (typeof CFL === 'undefined' || typeof GM_config === 'undefined' || typeof addButtonToContainer === 'undefined') {
        return alert('' +
            'A @require is missing.\n\n' +
            'Either you\'re not using the correct plug-in, or @require isn\'t working.\n\n' +
            'Please review the script\'s main page to see which browser & add-on to use.' +
        '');
    }

    // add a user-script command
    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('"' + script_name + '" Options', GM_config.open);
    }

    // init GM_config
    GM_config.init('"' + script_name + '" Options', {
        activationMode : {
            section : ['Main Options'],
            label : 'Activation Mode',
            type : 'select',
            options : {
                'buffer' : 'Auto Buffer (aka Auto Pause)',
                'play' : 'Auto Play',
                'none' : 'Stop Loading Immediately'
            },
            'default' : 'buffer'
        },
        autoHD : {
            label : 'Auto HD',
            type : 'select',
            options : {
                'default' : 'Automatic (default)',
                'tiny' : '144p',
                'small' : '240p',
                'medium' : '360p',
                'large' : '480p',
                'hd720' : '720p (HD)',
                'hd1080' : '1080p (HD)',
                'hd1440' : '1440p (HD)',
                'highres' : 'Original (highest)'
            },
            'default' : 'hd1080'
        },
        disableDash : {
            label : 'Disable DASH Playback',
            type : 'checkbox',
            'default' : true,
            title : '"DASH" loads the video in blocks/pieces; disrupts autobuffering -- Note: Qualities are limited when disabled'
        },
        hideAds : {
            label : 'Disable Ads',
            type : 'checkbox',
            'default' : true,
            title : 'Should disable advertisements. AdBlock is better, though. Get that instead'
        },
        hideAnnotations : {
            label : 'Disable Annotations',
            type : 'checkbox',
            'default' : false
        },
        theme : {
            section : ['Other Options'],
            label : 'Player Color Scheme',
            type : 'select',
            options : {
                'dark' : 'Dark Theme',
                'light' : 'Light Theme'
            },
            'default' : 'dark'
        },
        volume : {
            label : 'Set volume to: ',
            type : 'select',
            options : {
                '1000' : 'Don\'t Change',
                '0' : 'Off',
                '5' : '5%',
                '10' : '10%',
                '20' : '20%',
                '25' : '25% (quarter)',
                '30' : '30%',
                '40' : '40%',
                '50' : '50% (half)',
                '60' : '60%',
                '70' : '70%',
                '75' : '75% (three quarters',
                '80' : '80%',
                '90' : '90%',
                '100' : '100% (full)',
            },
            title : 'What to set the volume to',
            'default' : '1000'
        },
        autoplayplaylists : {
            label : 'Autoplay on Playlists (override)',
            type : 'checkbox',
            'default' : false,
            title : 'This will enable autoplay on playlists, regardless of the "Activation Mode" option'
        },
        footer : {
            label : 'Options Button In Footer',
            type : 'checkbox',
            'default' : false,
            title : 'This will make the options button show at the bottom of the page in the footer'
        }
    }, '' +
    'body { ' +
        'background-color: #DDDDDD !important; ' +
        'color: #434343 !important; ' +
        'font-family: Arial, Verdana, sans-serif !important; ' +
    '}' +
    '#config_header { ' +
        'font-size: 16pt !important; ' +
    '}' +
    '.config_var { ' +
        'margin-left: 20% !important; ' +
        'margin-top: 20px !important; ' +
    '}' +
    '#header { ' +
        'margin-bottom: 40px !important; ' +
        'margin-top: 20px !important; ' +
    '}' +
    '.indent40 { ' +
        'margin-left: 20% !important; ' +
    '}' + 
    '.config_var * { ' +
        'font-size: 10pt !important; ' +
    '}' +
    '.section_header_holder { ' +
        'border-bottom: 1px solid #BBBBBB !important; ' +
        'margin-top: 14px !important; ' +
    '}' +
    '.section_header { ' +
        'background-color: #BEDBFF !important; ' +
        'color: #434343 !important; ' +
        'margin-left: 20% !important; ' +
        'margin-top: 8px !important; ' +
        'padding: 2px 200px !important; ' +
        'text-decoration: none !important; ' +
    '}' +
    '.section_kids { ' +
        'margin-bottom: 14px !important; ' +
    '}' +
    '.saveclose_buttons { ' +
        'font-size: 14pt !important; ' +
    '}' +
    '#buttons_holder { ' +
        'padding-right: 50px; ' +
    '}' +
    '', {
        close : function () {
            CFL('#c4-player, #movie_player').css('visibility', 'visible');
            CFL('#lights_out').hide();
        },
        open : function () {
            CFL('#c4-player, #movie_player').css('visibility', 'hidden');
            CFL('#lights_out').show('block');
            CFL('#GM_config').css('height', '80%').css('width', '80%');
        }
    });

    // this is for the "lights out" feature of GM_config
    CFL.runAt('interactive', function () {
        CFL(document.body).append('div', {
            id : 'lights_out',
            style : 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999998; background: rgba(0, 0, 0, 0.72);'
        });

        // call the function that sets up everything
        init();
    });

    // add a message listener for when the unsafeWindow function fires a message
    window.addEventListener('message', function (msg) {
        if (msg.data === 'YTAB__ready') {
            main();
        }
    }, false);

    // wait for an element that can hold the options button to load,
    // then run our add button function
    CFL.waitFor({
        selector : '#watch7-headline, #gh-overviewtab div.c4-spotlight-module-component, #footer-main',
        done : addButton
    });

}());
