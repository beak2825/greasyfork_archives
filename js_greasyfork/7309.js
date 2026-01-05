// ==UserScript==
// @name        Plex Freebox
// @namespace   Kalmac
// @description Add a "play on freebox server" button on plex interface.
// @include     http://plex.tv/web/app*
// @include     https://plex.tv/web/app*
// @version     1.01
// @grant       GM_xmlhttpRequest
// @require     https://cdn.jsdelivr.net/jquery.cookie/1.4.1/jquery.cookie.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/hmac-sha1.js
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/7309/Plex%20Freebox.user.js
// @updateURL https://update.greasyfork.org/scripts/7309/Plex%20Freebox.meta.js
// ==/UserScript==
(function () {
    var HOST = 'http://mafreebox.freebox.fr';
    var APP_ID = 'fr.freebox.kalmac';
    var APP_NAME = 'Plex 4 Freebox';
    var APP_VERSION = '0.1';
    var DEVICE_NAME = 'Plex remote';
    var COOKIE_TRACK_ID = 'freebox_plex_track_id';    
    var COOKIE_TOKEN = 'freebox_plex_token';   
    var COOKIE_AIRPLAY_PASS = 'freebox_plex_airplay_pass';
    var STATE_UNINITIALIZED = 0;
    var STATE_INITIALIZED = 1;
    var STATE_UNAUTHORIZED = 2;
    var STATE_PENDING = 3;
    var STATE_AUTHORIZED = 4;
    
    var STATE_ERROR = 10;
    
    var track_id, token, state = STATE_UNINITIALIZED;
    
    function callFreeboxApi(path, callback, params, method, headers) {
        if (typeof(params) != 'object') {
            params = {};
        }
        if (method !== 'POST') {
            method = 'GET';
        }
        if (typeof(headers) != 'object') {
            headers = {};
        }
        
        GM_xmlhttpRequest({
            url: HOST + path,
            data: JSON.stringify(params),
            method: method,
            headers: headers,
            onload:function(response) {
                callback(JSON.parse(response.responseText));
            },
            onerror: function(response) {
                state = STATE_ERROR;
                core();
            }
        });
    }
    
    function init() {
        track_id = $.cookie(COOKIE_TRACK_ID);
        token = $.cookie(COOKIE_TOKEN);
        if (typeof(track_id) != 'undefined' && typeof(token) != 'undefined') {
            state = STATE_PENDING;
        } else {
            state = STATE_UNAUTHORIZED;
        }
    }
    
    function authorize() {
        callFreeboxApi('/api/v3/login/authorize/', function(response) {
            if (response.success) {
                $.cookie(COOKIE_TRACK_ID, response.result.track_id, { expires: 1000, path: '/' });
                $.cookie(COOKIE_TOKEN, response.result.app_token, { expires: 1000, path: '/' });
                state = STATE_INITIALIZED;
                core();
            }
        }, {
            'app_id': APP_ID,
            'app_name': APP_NAME,
            'app_version': APP_VERSION,
            'device_name': DEVICE_NAME }, 'POST');
        
        var airplay_password = prompt("Veuillez autoriser l\'appli sur votre Freebox (fleche de droite) et saisir le mot de passe AirPlay...", "1111");
        $.cookie(COOKIE_AIRPLAY_PASS, airplay_password, { expires: 1000, path: '/' });
        updateAdminButton('Veuillez autoriser l\'appli sur votre Freebox (fleche de droite).', 'refresh', false);
    }
    
    function pending() {
        callFreeboxApi('/api/v3/login/authorize/' + track_id, function(response) {
            if (response.success) {
                switch(response.result.status) {
                    case 'pending':
                        break;
                    case 'granted':
                        state = STATE_AUTHORIZED;
                        break;
                    default:
                        console.log('Freebox returned ' + response.result.status);
                        $.removeCookie(COOKIE_TRACK_ID, { path: '/' });
                        $.removeCookie(COOKIE_TOKEN, { path: '/' });
                        state = STATE_INITIALIZED;
                        break;
                }
            }
        });
    }
    
    
    function insertAdminButton() {
        var result = false;
        if (!$('li#plex-freebox-admin').length) {
            var elt = $('li#primary-player-dropdown');
            if (elt.length == 1) {
                elt.after('<li id="plex-freebox-admin"><a class="settings-btn" href="#" title="Plex 4 Freebox" data-toggle="tooltip" data-original-title="Plex 4 Freebox"><i class="glyphicon refresh"></i></a></li>');
                
                state = STATE_INITIALIZED;
            }
        }
        return result;
    }
    
    function updateAdminButton(text, glyph, callback) {
        var button = $('li#plex-freebox-admin > a');
        var icon = $('li#plex-freebox-admin > a > i');
        
        button.unbind('click');
        icon.attr('class', 'glyphicon');
        
        button.attr('data-original-title', text);
        button.attr('title', text);
        icon.addClass(glyph);
        if (callback) {
            button.click(callback);
        }
    }
    
    function decoratePlayer() {
        
        if ($('button#plex-freebox-play').length == 0) {
            $('div.video-controls-right span#player-quality-dropdown').before('<button id="plex-freebox-play" class="btn-link recommend-btn pull-left" title="Play 4 Freebox"><i class="glyphicon play">F</i></button>');
            $('button#plex-freebox-play').click(function(event) {
                play(event);
                event.preventDefault();
                return false;
            });
        }
    }
    
    function play(event) {
        
        login(function(challenge) {
            session(challenge, function(session_token) {
                
                var pass = $.cookie(COOKIE_AIRPLAY_PASS);
                var video = $('video#html-video').attr('src');
                var params = {
                    'action':'start',
                    'media_type': 'video',
                    'media': video,
                    'password': typeof(pass) == 'undefined'?'1111':pass
                };
                
                callFreeboxApi('/api/v3/airmedia/receivers/Freebox%20Player/', function(response) {
                    if (!response.success) {
                        alert(response.msg);
                    }
                }, params, 'POST', {'X-Fbx-App-Auth': session_token});
            });
        });
        
        
        event.preventDefault();
        return false;
    }
    
    function login(callback) {
        callFreeboxApi('/api/v3/login/', function(response) {
        	callback(response.result.challenge);
        });
    }
    
    function session(challenge, callback) {
        
        var params = {
            'app_id':APP_ID,
            'password': CryptoJS.HmacSHA1(challenge, token).toString(CryptoJS.enc.Hex)
        };
        
        callFreeboxApi('/api/v3/login/session/', function(response) {
        	callback(response.result.session_token);
        }, params, 'POST');
        
    }
    
    function core() {
        var retry = false;
        
        switch(state) {
            case STATE_UNINITIALIZED:
                insertAdminButton();
                retry = 1000;
                break;
            case STATE_INITIALIZED:
                updateAdminButton('Plex 4 Freebox en attente ...', 'refresh', false);
                init();
                retry = 2000;
                break;
            case STATE_UNAUTHORIZED:
                updateAdminButton('Cliquez ici pour authoriser Plex 4 Freebox', 'router', authorize);
                // no retry core until button is clicked.
                break;
            case STATE_PENDING:
                updateAdminButton('Plex 4 Freebox en attente ...', 'refresh', false);
                pending();
                retry = 2000;
                break;
            case STATE_AUTHORIZED:
                updateAdminButton('Plex 4 Freebox', 'ok', false);
                decoratePlayer();
                retry = 2000;
                break;
                
                
            case STATE_ERROR:
                updateAdminButton('Plex 4 Freebox : ERREUR FATALE!', 'remove', false);
                break;
                
        }
        
        console.log('core with state = ' + state);
        
        if (retry) {
            setTimeout(core, retry);
        }
    }
    
    $( window ).load(function() {
        
        core();
    });
    
}) ();
