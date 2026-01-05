// ==UserScript==
// @name        Emotes
// @namespace   InstaSynchP
// @description I dont know what it does

// @version     1.1.6
// @author      Unknown
// @source      https://github.com/Zod-/InstaSynchP-Layouts
// @license     MIT

// @include     http://*.instasynch.com/*
// @include     http://instasynch.com/*
// @include     http://*.instasync.com/*
// @include     http://instasync.com/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js
// @require     https://greasyfork.org/scripts/2858-jquery-fullscreen/code/jqueryfullscreen.js?version=26079
// @downloadURL https://update.greasyfork.org/scripts/7998/Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/7998/Emotes.meta.js
// ==/UserScript==

setField({
    'name': 'NSFWEmotes',
    'data': {
        'label': 'NSFW Emotes',
        'title': '/meatspin /boobies',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Chat Additions'
});

function loadEmotesOnce(){
    "use strict";
    events.bind('onSettingChange[NSFWEmotes]', toggleNSFWEmotes);
}

function loadEmotes(){
    "use strict";
    for(var i = 0; i < emotes.length; i += 1){
        var parameter = emotes[i];
        window.$codes[parameter.title] = $('<img>', parameter)[0].outerHTML;
    }
}

function toggleNSFWEmotes() {
    "use strict";
    for(var i = 0; i < nsfwEmotes.length; i += 1){
        var parameter = nsfwEmotes[i];
        if (GM_config.get('NSFWEmotes')) {
            window.$codes[parameter.title] = $('<img>', parameter)[0].outerHTML;
        }else{
            delete window.$codes[parameter.title];
        }
    }
}

events.bind('onPostConnect', loadEmotes);
events.bind('onExecuteOnce', loadEmotesOnce);
events.bind('onPostConnect', toggleNSFWEmotes);
