// ==UserScript==
// @name        InstaSynch Addons
// @namespace   Bibby
// @description adds lots of features
// @include     http://*.instasynch.com/*
// @include     http://instasynch.com/*
// @version     1.35.3.5
// @license     GPL-3.0

// @author      Julian Hangstoerfer
// @contributor fugXD
// @contributor Rollermiam
// @contributor BigBubba
// @contributor dirtyharry
// @contributor Catmosphere
// @contributor wednesday

// @grant       none

// @source      http://github.com/BibbyTube/Instasynch-Addons

// @icon        http://i.imgur.com/bw2Zthys.jpg
// @icon64      http://i.imgur.com/f3vYHNNs.jpg

// @require     https://greasyfork.org/scripts/2855-gm-config/code/GM_config.js
// @require     https://greasyfork.org/scripts/2859-video-url-parser/code/Video%20Url%20Parser.js

// @require     https://greasyfork.org/scripts/2857-jquery-bind-first/code/jquerybind-first.js
// @require     https://greasyfork.org/scripts/2858-jquery-fullscreen/code/jqueryfullscreen.js

// @require     https://greasyfork.org/scripts/5470-bibby-emotes/code/Bibby%20Emotes.js 

// @downloadURL https://update.greasyfork.org/scripts/7180/InstaSynch%20Addons.user.js
// @updateURL https://update.greasyfork.org/scripts/7180/InstaSynch%20Addons.meta.js
// ==/UserScript==
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2014  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2014  Bibbytube

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    http://opensource.org/licenses/GPL-3.0
*/
var settingsFields = {},
    version = '1.35.3.5',
    events = (function () {
        "use strict";
        var listeners = {};

        return {
            //bind event handlers
            'bind': function (eventName, callback, preOld) {
                eventName = eventName.trim();
                if (listeners[eventName] === undefined) {
                    listeners[eventName] = {
                        'preOld': [],
                        'postOld': []
                    };
                }
                //execute it before are after the overwritten function
                if (preOld) {
                    listeners[eventName].preOld.push({
                        callback: callback
                    });
                } else {
                    listeners[eventName].postOld.push({
                        callback: callback
                    });
                }
            },
            //bind event handler and remove any previous once
            'once': function (eventName, callback, preOld) {
                this.unbind(eventName, callback);
                this.bind(eventName, callback, preOld);
            },
            //unbind event handlers
            'unbind': function (eventName, callback) {
                var i;
                //search all occurences of callback and remove it
                if (listeners[eventName] !== undefined) {
                    for (i = 0; i < listeners[eventName].preOld.length; i += 1) {
                        if (listeners[eventName].preOld[i].callback === callback) {
                            listeners[eventName].preOld.splice(i, 1);
                            i -= 1;
                        }
                    }
                    for (i = 0; i < listeners[eventName].postOld.length; i += 1) {
                        if (listeners[eventName].postOld[i].callback === callback) {
                            listeners[eventName].postOld.splice(i, 1);
                            i -= 1;
                        }
                    }
                }
            },
            //fire the event with the given parameters
            'fire': function (eventName, parameters, preOld) {
                var i,
                    listenersCopy;
                if (listeners[eventName] === undefined) {
                    return;
                }
                //make a copy of the listener list since some handlers
                //could remove listeners changing the length of the array
                //while iterating over it
                if (preOld) {
                    listenersCopy = [].concat(listeners[eventName].preOld);
                } else {
                    listenersCopy = [].concat(listeners[eventName].postOld);
                }
                //fire the events and catch possible errors
                for (i = 0; i < listenersCopy.length; i += 1) {
                    try {
                        listenersCopy[i].callback.apply(this, parameters);
                    } catch (err) {
                        logError(eventName, listenersCopy[i].callback, err);
                    }
                }
            }
        };
    }());

function setField(field) {
    "use strict";
    //prepare settings by sorting it into sections, subsections
    if (field.section) {
        settingsFields[field.section] = settingsFields[field.section] || {};
        if (field.subsection) {
            settingsFields[field.section][field.subsection] = settingsFields[field.section][field.subsection] || {};
            settingsFields[field.section][field.subsection][field.name] = field.data;
        } else {
            settingsFields[field.section][field.name] = field.data;
        }
    } else {
        settingsFields[field.name] = field.data;
    }
}

function postConnect() {
    "use strict";
    events.fire('onPostConnect');
    //events.unbind('onUserlist', postConnect);
}

function resetVariables() {
    "use strict";
    events.fire('onResetVariables');
}


//Priority scripts
events.bind('onExecuteOnce', loadNewLoadUserlist);
events.bind('onExecuteOnce', cssLoaderLoadOnce);
events.bind('onExecuteOnce', loadGeneralStuff);
events.bind('onExecuteOnce', loadCommandLoaderOnce);
events.bind('onExecuteOnce', loadSettingsLoader);
events.bind('onExecuteOnce', loadThemesOnce);
events.bind('onExecuteOnce', loadBigPlaylistOnce);
events.bind('onExecuteOnce', loadNameNotificationOnce);

events.bind('onPreConnect', resetVariables);
events.bind('onDisconnect', resetVariables);
events.bind('onPreConnect', loadBigPlaylist);
events.bind('onPreConnect', loadControlBar);
events.bind('onPreConnect', loadEvents);
events.bind('onPreConnect', loadLayout);

//events.bind('onPostConnect', );
//----------------- end deployHeader.js -----------------
//----------------- start autocomplete.js -----------------
setField({
    'name': 'TagsAutoComplete',
    'data': {
        'label': '<a style="color:white;" href="https://github.com/BibbyTube/Instasynch/blob/master/Chat%20Additions/Messagefilter/tags.js" target="_blank">Tags</a> ([)',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions',
    'subsection': 'Autocomplete'
});
setField({
    'name': 'EmotesAutoComplete',
    'data': {
        'label': '<a style="color:white;" href="http://dl.dropboxusercontent.com/u/75446821/Bibby/Emotes.htm" target="_blank"> Emotes</a> (/)',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions',
    'subsection': 'Autocomplete'
});
setField({
    'name': 'CommandsAutoComplete',
    'data': {
        'label': '<a style="color:white;" href="https://github.com/BibbyTube/Instasynch-Addons#command-list" target="_blank">Commands</a> (\')',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions',
    'subsection': 'Autocomplete'
});
setField({
    'name': 'BotCommandsAutoComplete',
    'data': {
        'label': 'Bot Commands ($)',
        'title': '$help for Bot Commands',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Chat Additions',
    'subsection': 'Autocomplete'
});
setField({
    'name': 'NamesAutoComplete',
    'data': {
        'label': 'Names (@)',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions',
    'subsection': 'Autocomplete'
});


function loadAutoComplete() {
    "use strict";
    var i,
        tagKeys = Object.keys(tags);

    //add the tags to the autocomplete data
    for (i = 0; i < tagKeys.length; i += 1) {
        autoCompleteData.push(tagKeys[i].replace(/\\/g, ''));
    }

    //add the normal commands to the autocomplete data
    autoCompleteData = autoCompleteData.concat(commands.get('regularCommands'));
    if (isUserMod()) {
        //add the mod commands to the autocomplete data
        autoCompleteData = autoCompleteData.concat(commands.get('modCommands'));
    }
    autoCompleteData.sort();

    //add the jquery autcomplete widget to InstaSynch's input field
    $("#chat input").bind("keydown", function (event) {
        // don't navigate away from the field on tab when selecting an item
        if (event.keyCode === $.ui.keyCode.TAB && isAutocompleteMenuActive) {
            event.keyCode = $.ui.keyCode.ENTER; // fake select the item
            $(this).trigger(event);
        }
    }).autocomplete({
        delay: 0,
        minLength: 0,
        source: sourceAutocomplete,
        select: selectAutocomplete,
        autoFocus: true,
        focus: function () {
            return false; // prevent value inserted on focus
        },
        close: function () {
            isAutocompleteMenuActive = false;
        },
        open: function () {
            isAutocompleteMenuActive = true;
        }
    });
}

function sourceAutocomplete(request, response) {
    //return if autocomplete is turned off while using the input history
    if (!autocomplete) {
        response([]);
        return;
    }
    var message = request.term,
        caretPosition = doGetCaretPosition(window.cin),
        lastIndex = lastIndexOfSet(message.substring(0, caretPosition), ['/', '\'', '[', '@', '$']),
        partToComplete = message.substring(lastIndex, caretPosition),
        matches = [];
    //return if there is nothing to autocomplete
    if (partToComplete.length === 0) {
        response([]);
        return;
    }
    //return if one of the autocompletes is turned off
    switch (partToComplete[0]) {
    case '/':
        if (!GM_config.get('EmotesAutoComplete') || (lastIndex !== 0 && (!message[lastIndex - 1].match(/\s/) && !message[lastIndex - 1].match(/\]/)))) {
            return;
        }
        break;
    case '\'':
        if (!GM_config.get('CommandsAutoComplete') || (lastIndex !== 0 && !message[lastIndex - 1].match(/\s/))) {
            return;
        }
        break;
    case '[':
        if (!GM_config.get('TagsAutoComplete')) {
            return;
        }
        break;
    case '@':
        if (!GM_config.get('NamesAutoComplete') || (lastIndex !== 0 && !message[lastIndex - 1].match(/\s/))) {
            return;
        }
        break;
    case '$':
        if (!GM_config.get('BotCommandsAutoComplete') || (lastIndex !== 0 && !message[lastIndex - 1].match(/\s/))) {
            return;
        }
        break;
    }
    //autocomplete names
    if (partToComplete[0] === '@') {
        matches = $.map(getUsernameArray(), function (item) {
            item = '@' + item;
            if (item.toLowerCase().indexOf(partToComplete.toLowerCase()) === 0) {
                return item;
            }
        });
    } else if(partToComplete[0] === '/'){
        matches = $.map(Object.keys(window.$codes).sort(), function (item) {
            item = '/' + item;
            if (item.toLowerCase().indexOf(partToComplete.toLowerCase()) === 0) {
                return item;
            }
        });
    }else {
        //autocomplete the rest
        matches = $.map(autoCompleteData, function (item) {
            if (item.toLowerCase().indexOf(partToComplete.toLowerCase()) === 0) {
                return item;
            }
        });
    }

    //show only 7 responses
    response(matches.slice(0, 7));
}

function selectAutocomplete(event, ui) {
    var message = this.value,
        caretPosition = doGetCaretPosition(window.cin),
        lastIndex = lastIndexOfSet(message.substring(0, caretPosition), ['/', '\'', '[', '@', '$']);
    //prevent it from autocompleting when a little changed has been made and its already there
    if (message.indexOf(ui.item.value) === lastIndex && lastIndex + ui.item.value.length !== caretPosition) {
        doSetCaretPosition(window.cin, lastIndex + ui.item.value.length);
        return false;
    }
    //insert the autocompleted text and set the cursor position after it
    this.value = message.substring(0, lastIndex) + ui.item.value + message.substring(caretPosition, message.length);
    doSetCaretPosition(window.cin, lastIndex + ui.item.value.length);
    //if the selected item is a emote trigger a fake enter event
    if (lastIndex === 0 && ((ui.item.value[0] === '/' || ui.item.value[0] === '\'' || ui.item.value[0] === '$') && ui.item.value[ui.item.value.length - 1] !== ' ')) {
        $(this).trigger($.Event('keypress', {
            which: 13,
            keyCode: 13
        }));
    }
    return false;
}

function lastIndexOfSet(input, set) {
    "use strict";
    //get last index of ['/', '\'', '[', '@', '$'] in the input string
    var index = -1,
        i;
    for (i = 0; i < set.length; i += 1) {
        index = Math.max(index, input.lastIndexOf(set[i]));
    }
    if (index > 0) {
        //tags may contain [/ so reduce index by 1
        if (input[index] === '/' && input[index - 1] === '[') {
            index -= 1;
        }
    }
    return index;
}


var isAutocompleteMenuActive = false,
    autocomplete = true,
    autoCompleteData = [];

events.bind('onResetVariables', function () {
    "use strict";
    isAutocompleteMenuActive = false;
    autocomplete = true;
    autoCompleteData = [];
});
//----------------- end autocomplete.js -----------------
//----------------- start autoscrollFix.js -----------------
/* jshint ignore:start */
function loadAutoscrollFix() {

    //remove autoscroll stop on hover (for now by cloning the object and thus removing all events)
    //could not figure out how to delete an anonymous function from the events
    var old_element = document.getElementById("chat_list"),
        new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    //all not working
    // var eventListeners = jQuery._data( chat_list, "events" );
    // for(var e in eventListeners){
    //     if(e === 'mouseover' || e === 'mouseout'){
    //         $('#chat_list')[0].removeEventListener(e,eventListeners[e][0]['handler']);
    //         $('#chat_list').unbind(e,eventListeners[e][0]['handler']);
    //     }
    // }
    // $('#chat_list').unbind('mouseover');
    // $('#chat_list').unbind('mouseout');
    // $('#chat_list').unbind('hover');


    //add a scrolling event to the chat
    $('#chat_list').on('scroll', function () {
        var scrollHeight = $(this)[0].scrollHeight,
            scrollTop = $(this).scrollTop(),
            height = $(this).height();

        //scrollHeight - scrollTop will be 290 when the scrollbar is at the bottom
        //height of the chat window is 280, not sure where the 10 is from
        if ((scrollHeight - scrollTop) < height * 1.05) {
            window.autoscroll = true;
        } else {
            window.autoscroll = false;
        }
    });

    //overwrite cleanChat Function so it won't clean when autoscroll is off
    //,also clean all the messages until messages === MAXMESSAGES
    window.cleanChat = function cleanChat() {
        var max = window.MAXMESSAGES;
        //increasing the maximum messages by the factor 2 so messages won't get cleared 
        //and won't pile up if the user goes afk with autoscroll off
        if (!window.autoscroll) {
            max = max * 2;
        }
        while (window.windmessages > max) {
            $('#chat_list > :first-child').remove(); //span user
            $('#chat_list > :first-child').remove(); //span message
            $('#chat_list > :first-child').remove(); //<br>
            window.messages -= 1;
        }
    };
}

//now added oficially on InstaSynch
//postConnectFunctions.push(loadAutoscrollFix);
/* jshint ignore:end */
//----------------- end autoscrollFix.js -----------------
//----------------- start emotes.js -----------------

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
//----------------- end emotes.js -----------------
//----------------- start inputHistory.js -----------------
function loadInputHistoryOnce() {
    "use strict";
    events.bind('onInputKeypress', function (event, message) {
        if (event.keyCode === 13 && message !== '') {
            if (inputHistoryIndex !== 0) {
                //remove the string from the array
                inputHistory.splice(inputHistoryIndex, 1);
            }
            //add the string to the array at position 1
            inputHistory.splice(1, 0, message);

            //50 messages limit (for now)
            if (inputHistory.length === 50) {
                //delete the last
                inputHistory.splice(inputHistory.length - 1, 1);
            }
        }
        setInputHistoryIndex(0);
    });
}

function loadInputHistory() {
    "use strict";
    $("#chat input").bind('keydown', function (event) {
        if (isAutocompleteMenuActive && inputHistoryIndex === 0) {
            return;
        }
        if (event.keyCode === 38) { //upkey
            if (inputHistoryIndex < inputHistory.length) {
                setInputHistoryIndex(inputHistoryIndex + 1);
            } else {
                setInputHistoryIndex(0);
            }
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);

        } else if (event.keyCode === 40) { //downkey
            if (inputHistoryIndex > 0) {
                setInputHistoryIndex(inputHistoryIndex - 1);
            } else {
                setInputHistoryIndex(inputHistory.length - 1);
            }
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);
        }
    });
}

function setInputHistoryIndex(index) {
    "use strict";
    inputHistoryIndex = index;
    if (index === 0) {
        autocomplete = true;
    } else {
        autocomplete = false;
    }
}

var inputHistory = [''],
    inputHistoryIndex = 0;

events.bind('onResetVariables', function () {
    "use strict";
    inputHistoryIndex = 0;
});

events.bind('onPreConnect', loadInputHistory);
events.bind('onExecuteOnce', loadInputHistoryOnce);
//----------------- end inputHistory.js -----------------
//----------------- start logInOffMessages.js -----------------
setField({
    'name': 'LogInOffMessages',
    'data': {
        'label': 'Login/off Messages',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Chat Additions'
});

function userLoggedOn(user) {
    "use strict";
    if (user.loggedin && GM_config.get('LogInOffMessages')) {
        addSystemMessage('{0} logged on.'.format(user.username));
    }
}

function userLoggedOff(id, user) {
    "use strict";
    if (user.loggedin && GM_config.get('LogInOffMessages')) {
        addSystemMessage('{0} logged off.'.format(user.username));
    }
}

function loadLogInOffMessages() {
    "use strict";
    events.bind('onAddUser', userLoggedOn);
    events.bind('onRemoveUser', userLoggedOff);
}

events.bind('onResetVariables', function () {
    "use strict";
    events.unbind('onAddUser', userLoggedOn);
    events.unbind('onRemoveUser', userLoggedOff);
});
events.bind('onPostConnect', loadLogInOffMessages);
//----------------- end logInOffMessages.js -----------------
//----------------- start me.js -----------------
/* jshint ignore:start */
function loadMe() {
    "use strict";
    autoCompleteData = autoCompleteData.concat(['/me ']);
}

function loadMeOnce() {
    "use strict";
    var oldAddMessage = window.addMessage;
    window.addMessage = function (username, message, userstyle, textstyle) {
        if (message.indexOf('/me ') === 0 && message.length > 4) {
            message = '<span style="color:grey;">{0} {1}</span>'.format(username.match(/(\d\d:\d\d - )?([\w\-]+)/)[2], message.substring(3));
            window.addMessage('', message, '', '');
        } else {
            oldAddMessage(username, message, userstyle, textstyle);
        }
    };
}


//now added oficially on InstaSynch
//events.bind('onExecuteOnce', loadMeOnce);
//events.bind('onPreConnect', loadMe);

/* jshint ignore:end */
//----------------- end me.js -----------------
//----------------- start messagefilter.js -----------------
setField({
    'name': 'Tags',
    'data': {
        'label': 'Parse <a style="color:white;" href="https://github.com/BibbyTube/Instasynch/blob/master/Chat%20Additions/Messagefilter/tags.js" target="_blank">tags</a> in the chat',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions'
});

function loadMessageFilterOnce() {
    "use strict";

    var oldLinkify = window.linkify,
        oldAddMessage = window.addMessage,
        oldCreatePoll = window.createPoll;

    window.linkify = function (str, buildHashtagUrl, includeW3, target) {
        var tags = [],
            index = -1;
        //remove image urls so they wont get linkified
        str = str.replace(/(src|href)=\"([^\"]*)\"/gi, function ($0, $1, $2) {
            tags.push({
                'tagName': $1,
                'url': $2
            });
            return '{0}=\"\"'.format($1);
        });
        str = oldLinkify(str, buildHashtagUrl, includeW3, target);
        //put them back in
        str = str.replace(/(src|href)=\"\"/gi, function () {
            index += 1;
            return '{0}="{1}"'.format(tags[index].tagName, tags[index].url);
        });
        return str;
    };
    //overwrite addMessage to change the data
    window.addMessage = function (user, message, textstyle) {
        oldAddMessage(user, parseMessage(user, message, true), textstyle);
    };
    //same for createPoll
    window.createPoll = function (poll) {
        var i;
        poll.title = window.linkify(parseMessage(null, poll.title, false), false, true);
        for (i = 0; i < poll.options.length; i += 1) {
            poll.options[i].option = parseMessage(null, poll.options[i].option, false);
        }
        oldCreatePoll(poll);
    };
}

function parseMessage(user, message, isChatMessage) {
    "use strict";
    var emoteFound = false,
        match = message.match(/^((?:\[[^\]]*\])*)\/([^\[ ]+)((?:\[[^\]]*\])*)/i),
        emote,
        word,
        greentext,
        i,
        words,
        marqueeCount = 0;
    if (message.startsWith('/me ')) {
        return message;
    }

    //if the text matches [tag]/emote[/tag] or /emote
    if (match && isChatMessage) {
        //does the emote exist
        if (window.$codes.hasOwnProperty(match[2].toLowerCase())) {
            emoteFound = true;
            emote = window.$codes[match[2].toLowerCase()];
            message = "<span class='cm'>{0}{1}{2}</span>".format(match[1], emote, match[3]);
        }
    } else {
        //check for greentext
        greentext = false;
        //if the text matches [tag]>* or >*
        if (message.match(/^((\[[^\]]*\])*)((&gt;)|>)/)) {
            greentext = true;
        } else {
            //split up the message and add hashtag colors #SWAG #YOLO
            words = message.split(" ");
            for (i = 0; i < words.length; i += 1) {
                if (words[i][0] === "#") {
                    words[i] = "<span class='cm hashtext'>{0}</span>".format(words[i]);
                }
            }
            //join the message back together
            message = words.join(" ");
        }
        message = "<span class='cm{0}'>{1}</span>".format(greentext ? ' greentext' : '', message);
    }
    if (!isChatMessage) {
        //filter all emotes
        message = parseEmotes(message);
    }
    //filter words
    for (word in filteredwords) {
        if (filteredwords.hasOwnProperty(word)) {
            message = message.replace(new RegExp(word, 'g'), filteredwords[word]);
        }
    }

    function parseAdvancedTags(match, $0, $1) {
        var ret = '',
            str,
            current = new Date(),
            previous = new Date("6.6.2000");
        switch (word) {
        case 'hexcolor':
            if($0 !== undefined){
                $0 = 'background-';
            }else{
                $0 = '';
            }
            if ($1 === '#7882BF') {
                $1 = '#000000';
            }
            str = '<span style="{0}color:{1}">';
            break;
        case 'marquee':
            marqueeCount += 1;
            if (marqueeCount > 2) {
                return '';
            }
            str = '<marquee behavior="scroll" direction={0} width="100%" scrollamount="{1}">';
            $0 = ($0 ? "left" : "right");
            $1 = Math.min($1, 99);
            if ($1 === 0) {
                $1 = 1;
            }
            break;
        case 'alternate':
            marqueeCount += 1;
            if (marqueeCount > 2) {
                return '';
            }
            str = '<marquee behavior="alternate" direction="right" width="100%" scrollamount="{1}">';
            $1 = Math.min($1, 99);
            if ($1 === 0) {
                $1 = 1;
            }
            break;
        case 'spoiler':
            str = '[spoiler]{0}[/]';
            break;
        case 'kickbanned':
            if (user === null || user.username === '') {
                return match;
            }
            return '';
        case 'happyBirthdayJPB':
            //is it jpbs birthday
            if (previous.getMonth() === current.getMonth() && previous.getDate() === current.getDate()) {
                return '';
            }
            return match;
        }
        ret = str.format($0, $1);
        return GM_config.get('Tags') ? ret : '';
    }
    //filter advancedTags
    for (word in advancedTags) {
        if (advancedTags.hasOwnProperty(word)) {
            message = message.replace(advancedTags[word], parseAdvancedTags);
        }
    }

    function parseTags() {
        if (tags[word].startsWith('<marquee')) {
            marqueeCount += 1;
            if (marqueeCount > 2) {
                return '';
            }
        }
        return GM_config.get('Tags') ? tags[word] : '';
    }
    //filter tags
    for (word in tags) {
        if (tags.hasOwnProperty(word)) {
            message = message.replace(new RegExp(word, 'gi'), parseTags);
        }
    }
    //remove unnused tags [asd] if there is a emote
    if (emoteFound && isChatMessage) {
        message = message.replace(/\[[^\]]*\]/g, '');
    }
    return message;
}

//parse multiple emotes in a message
function parseEmotes(message) {
    "use strict";
    var possibleEmotes = [],
        exactMatches = [],
        emoteStart = -1,
        emote = '',
        i,
        j,
        code,
        temp;
    while (true) {
        //find the next /
        emoteStart = message.indexOf('/', emoteStart + 1);
        //stop if there are no more /
        if (emoteStart === -1) {
            break;
        }
        //get the emotes
        possibleEmotes = Object.keys(window.$codes);
        exactMatches = [];
        emote = '';
        //search for matches by keep going over the message and trying
        //to find a match in the emotes
        for (i = emoteStart + 1, emote = message[i]; i < message.length && possibleEmotes.length > 0; i += 1, emote += message[i]) {
            //eliminate no matches
            for (j = 0; j < possibleEmotes.length; j += 1) {
                if (emote.startsWith(possibleEmotes[j])) {
                    //save exact matches
                    exactMatches.push(possibleEmotes[j]);
                    possibleEmotes.splice(j, 1);
                    j -= 1;
                } else if (possibleEmotes[j].indexOf(emote) !== 0) {
                    //remove no matches
                    possibleEmotes.splice(j, 1);
                    j -= 1;
                }
            }
        }
        //continue if there are no matches
        if (exactMatches.length === 0) {
            emoteStart = i - 1;
            continue;
        }
        temp = exactMatches.length - 1;
        //get the last exact match (longest emote, /bro vs /brody)
        code = window.$codes[exactMatches[temp]];
        //check for escape character
        if (emoteStart !== 0 && message[emoteStart - 1] === '\\') {
            //remove the escape character
            message =
                message.substring(0, emoteStart - 1) +
                message.substring(emoteStart);
            temp = exactMatches[temp].length;
        } else {
            //otherwise put in the emote
            message =
                message.substring(0, emoteStart) +
                code +
                message.substring(emoteStart + exactMatches[temp].length + 1);
            temp = code.length;
        }
        //set the new position after the just found emote
        i = emoteStart + temp;
    }
    return message;
}

events.bind('onExecuteOnce', loadMessageFilterOnce);
//----------------- end messagefilter.js -----------------
//----------------- start tags.js -----------------
var advancedTags = {
        'hexcolor': /\[(b)?(#[0-9A-F]{1,6})\]/ig, //[#00FFAA] any hex color as tag
        'marquee': /\[r?marquee(?:(-)?|\+?)(\d+)\]/ig, //[marquee10] marquee with specified speed
        'alternate': /\[f?alt(?:(-)?|\+?)?(\d+)\]/ig, //[alt10] alternate with specified speed
        'spoiler': /\|([^\|]*)\|/ig, // |spoiler| shortcut
        'happyBirthdayJPB': /(?:happy\s+bir(?:th|f)day)|(?:bir(?:th|f)day)/ig, //filter out happy birthday on jpbs birthday
        'kickbanned': /you\s*(have|\'\s*ve)\s*been\s*(?:kicked|banned)/ig
    },
    tags = {

        //colors
        '\\[black\\]': '<span style="color:black">',
        '\\[blue\\]': '<span style="color:blue">',
        '\\[blueviolet\\]': '<span style="color:blueviolet">',
        '\\[brown\\]': '<span style="color:brown">',
        '\\[darkblue\\]': '<span style="color:darkblue">',
        '\\[cyan\\]': '<span style="color:cyan">',
        '\\[red\\]': '<span style="color:red">',
        '\\[green\\]': '<span style="color:green">',
        '\\[darkgreen\\]': '<span style="color:darkgreen">',
        '\\[violet\\]': '<span style="color:violet">',
        '\\[purple\\]': '<span style="color:purple">',
        '\\[orange\\]': '<span style="color:orange">',
        '\\[deeppink\\]': '<span style="color:deeppink">',
        '\\[aqua\\]': '<span style="color:aqua">',
        '\\[indigo\\]': '<span style="color:indigo">',
        '\\[pink\\]': '<span style="color:pink">',
        '\\[chocolate\\]': '<span style="color:chocolate">',
        '\\[yellowgreen\\]': '<span style="color:yellowgreen">',
        '\\[steelblue\\]': '<span style="color:steelblue">',
        '\\[silver\\]': '<span style="color:silver">',
        '\\[tomato\\]': '<span style="color:tomato">',
        '\\[tan\\]': '<span style="color:tan">',
        '\\[royalblue\\]': '<span style="color:royalblue">',
        '\\[navy\\]': '<span style="color:navy">',
        '\\[yellow\\]': '<span style="color:yellow">',
        '\\[white\\]': '<span style="color:white">',
        //background colors
        '\\[bblack\\]': '<span style="background-color:black">',
        '\\[bblue\\]': '<span style="background-color:blue">',
        '\\[bblueviolet\\]': '<span style="background-color:blueviolet">',
        '\\[bbrown\\]': '<span style="background-color:brown">',
        '\\[bdarkblue\\]': '<span style="background-color:darkblue">',
        '\\[bcyan\\]': '<span style="background-color:cyan">',
        '\\[bred\\]': '<span style="background-color:red">',
        '\\[bgreen\\]': '<span style="background-color:green">',
        '\\[bdarkgreen\\]': '<span style="background-color:darkgreen">',
        '\\[bviolet\\]': '<span style="background-color:violet">',
        '\\[bpurple\\]': '<span style="background-color:purple">',
        '\\[borange\\]': '<span style="background-color:orange">',
        '\\[bdeeppink\\]': '<span style="background-color:deeppink">',
        '\\[baqua\\]': '<span style="background-color:aqua">',
        '\\[bindigo\\]': '<span style="background-color:indigo">',
        '\\[bpink\\]': '<span style="background-color:pink">',
        '\\[bchocolate\\]': '<span style="background-color:chocolate">',
        '\\[byellowgreen\\]': '<span style="background-color:yellowgreen">',
        '\\[bsteelblue\\]': '<span style="background-color:steelblue">',
        '\\[bsilver\\]': '<span style="background-color:silver">',
        '\\[btomato\\]': '<span style="background-color:tomato">',
        '\\[btan\\]': '<span style="background-color:tan">',
        '\\[broyalblue\\]': '<span style="background-color:royalblue">',
        '\\[bnavy\\]': '<span style="background-color:navy">',
        '\\[byellow\\]': '<span style="background-color:yellow">',
        '\\[bwhite\\]': '<span style="background-color:white">',

        '\\[/\\]': '</span>', //shortcut to close tags

        '\\[rmarquee\\]': '<marquee>', //move text to right
        '\\[alt\\]': '<marquee behavior="alternate" direction="right">', //alternate between left and right
        '\\[falt\\]': '<marquee behavior="alternate" scrollamount="50" direction="right">', //different speeds etc.
        '\\[marquee\\]': '<marquee direction="right">',
        '\\[rsanic\\]': '<marquee behavior="scroll" direction="left" width="100%" scrollamount="50">',
        '\\[sanic\\]': '<marquee behavior="scroll" direction="right" width="100%" scrollamount="50">',
        '\\[spoiler\\]': "<span class=\"spoiler\">",
        '\\[/marquee\\]': '</marquee>',
        '\\[/m\\]': '</marquee>',

        '\\[italic\\]': '<span style="font-style:italic">',
        '\\[i\\]': '<span style="font-style:italic">', //shortcut italic
        '\\[strike\\]': '<strike>',
        '\\[/strike\\]': '</strike>',
        '\\[-\\]': '<strike>', //shortcut strike
        '\\[/-\\]': '</strike>',
        '\\[strong\\]': '<strong>',
        '\\[/strong\\]': '</strong>',
        '\\[b\\]': '<strong>', //shortcut strong
        '\\[/b\\]': '</strong>'
    };
//----------------- end tags.js -----------------
//----------------- start wordFilter.js -----------------
var filteredwords = {
};
//----------------- end wordFilter.js -----------------
//----------------- start ModSpy.js -----------------
setField({
    'name': 'ModSpy',
    'data': {
        'label': 'ModSpy (mod actions will be shown in the chat)',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions'
});

function loadModSpy() {
    "use strict";
    // Overwriting console.log
    var oldLog = window.console.log,
        filterList = [
            /^Resynch request(?:ed)? ?(?:sent)?\.?\.$/,
            /cleaned the playlist/,
            /^play(?:ing)?$/,
            /Using HTML5 player is not recomended\./,
            /^load start$/,
            /^paused$/,
            /^stalled$/
        ],
        filter,
        i,
        match,
        lastRemovedVideo,
        lastMovedVideoInfo,
        lastSkipPercentage;

    window.console.log = function (message) {

        //only check for strings
        if (typeof message !== 'string') {
            oldLog.apply(window.console, arguments);
            return;
        }

        //add as error message and then return
        if (message.startsWith("Error:")) {
            addErrorMessage(message);
            oldLog.apply(window.console, arguments);
            return;
        }

        filter = false;
        for (i = 0; i < filterList.length; i += 1) {
            if (message.match(filterList[i])) {
                filter = true;
                break;
            }
        }
        //return if setting is off or message is filtered
        if (filter || !GM_config.get('ModSpy')) {
            oldLog.apply(window.console, arguments);
            return;
        }
        //prepare the message for each log
        if ((match = message.match(/([^\s]+) moved a video\./))) {
            message = '{0} {1} a <a href="{2}" target="_blank">video</a>'.format(match[1], bumpCheck ? 'bumped' : 'moved', urlParser.create(lastMovedVideoInfo));
            bumpCheck = false;
        } else if ((match = message.match(/([^\s]+) has banned a user\./))) {
            lastAction = 'banned';
            actiontaker = match[1];
        } else if ((match = message.match(/([^\s]+) has kicked a user\./))) {
            lastAction = 'kicked';
            actiontaker = match[1];
        } else if ((match = message.match(/([^\s]+) removed a video\./))) {
            message = '{0} removed a <a href="{1}" target="_blank">video</a> via {2}.'.format(match[1], urlParser.create(lastRemovedVideo.info), lastRemovedVideo.addedby);
        } else if ((match = message.match(/([^\s]+) modified skip ratio\./))) {
            message = '{0} set skip to {1}%'.format(match[1], lastSkipPercentage);
        }

        //add the message to the chat if we don't have to wait for the event to happen
        //user removed events gets fired after the log
        if (!lastAction) {
            addSystemMessage(message);
        }

        oldLog.apply(window.console, arguments);
    };

    events.bind('onRemoveUser', function (id, user) {
        //print the kick/ban log
        if (lastAction && (lastAction === 'banned' || lastAction === 'kicked')) {
            addSystemMessage('{0} has {1} {2}'.format(actiontaker, lastAction, user.username));
            lastAction = undefined;
            actiontaker = undefined;
        }
    });

    events.bind('onMoveVideo', function (vidinfo, position, oldPosition) {
        //save the vidinfo for the log
        lastMovedVideoInfo = vidinfo;
        //check if the video got bumped
        if (Math.abs(getActiveVideoIndex() - position) <= 10 && Math.abs(oldPosition - position) > 10) { // "It's a bump ! " - Amiral Ackbar
            bumpCheck = true;
        }
    });

    events.bind('onRemoveVideo', function (vidinfo, indexOfVid, video) {
        //save the video for the log
        lastRemovedVideo = video;
    });

    events.bind('onSkips', function (skips, skipsNeeded, percent) {
        //save the percentage for the log
        lastSkipPercentage = Math.round(percent * 100) / 100;
    });
}
var bumpCheck = false,
    lastAction,
    actiontaker;
events.bind('onResetVariables', function () {
    "use strict";
    bumpCheck = false;
});
events.bind('onExecuteOnce', loadModSpy);
//----------------- end ModSpy.js -----------------
//----------------- start nameAutocomplete.js -----------------
function loadNameAutocomplete() {
    "use strict";
    $("#chat input").bind('keydown', function (event) {
        if (event.keyCode !== 9) { //tab
            return;
        }

        //prevent loosing focus from input
        event.preventDefault();

        //split the message
        var message = $(this).val().split(' '),
            //make a regex out of the last part
            messagetags = message[message.length - 1].match(/^((?:\[[^\]]*\])*\[?@?)([\w\-]+)/),
            name,
            partToComplete = '',
            i,
            j,
            sub,
            usernames = getUsernameArray(false);

        //return if it doesn't match
        if (!messagetags || !messagetags[2]) {
            return;
        }
        messagetags[1] = messagetags[1] || '';

        //make a regex out of the name
        name = new RegExp('^' + messagetags[2], 'i');

        //find matching users
        for (i = 0; i < usernames.length; i += 1) {
            if (usernames[i].match(name)) {
                if (partToComplete === '') {
                    partToComplete = usernames[i];
                } else {
                    //check for partial matches with other found users
                    for (j = partToComplete.length; j >= 0; j -= 1) {
                        sub = partToComplete.substring(0, j);
                        if (usernames[i].toLowerCase().indexOf(sub) === 0) {
                            partToComplete = sub;
                            break;
                        }
                    }
                }
            }
        }
        if (partToComplete !== '') {
            //put messagetags and the autocompleted name back into the message
            message[message.length - 1] = messagetags[1] + partToComplete;
            $(this).val(message.join(' '));
        }

    });
}
events.bind('onPreConnect', loadNameAutocomplete);
//----------------- end nameAutocomplete.js -----------------
//----------------- start nameNotification.js -----------------
function loadNameNotificationOnce() {
    "use strict";
    var oldAddMessage = window.addMessage;

    //overwrite addMessage to change the data
    window.addMessage = function (user, message, extraStyles) {
        if (user.username === '' || message.startsWith('/me ')) {
            oldAddMessage(user, message, extraStyles);
            return;
        }
        var found = false,
            oldNewMsg = window.newMsg;
        //find the username, make it bold and add red text
        message = message.replace(new RegExp('@?{0}'.format(thisUsername), 'gi'),
            function (match) {
                found = true;
                return '<strong><font color=red>{0}</font></strong>'.format(match);
            });
        oldAddMessage(user, message, extraStyles);

        //change favicon when getting notified
        if (window.newMsg) {
            if (window.newMsg != oldNewMsg) {
                addFavicon(newMessageFavicon);
                blinkerFavicon = newMessageFavicon;
                //start blinker
                faviconBlinkerIntervalId = setInterval(function () {
                    if (faviconBlinker) {
                        faviconBlinker = false;
                        addFavicon(defaultFavicon);
                    } else {
                        faviconBlinker = true;
                        addFavicon(blinkerFavicon);
                    }
                }, 425);
            }
            if (found && !notified) {
                toggleNotify();
            }
        }
    };

    //find and modify favicon element on the page
    $('link').each(function () {
        if ($(this).attr('href') === '/favicon.ico') {
            $(this).attr('favicon');
        }
    });
    addFavicon(defaultFavicon);
}

function addFavicon(url) {
    $('#favicon').remove();
    $('head').append(
        $('<link />', {
            'id': 'favicon',
            'type': 'image/png',
            'rel': 'shortcut icon',
            'href': url
        })
    );
}

function loadNameNotification() {
    "use strict";
    //turn of notify when focusing the chat input
    $('#cin').focus(function () {
        addFavicon(defaultFavicon);
        notified = false;
        faviconBlinker = true;
        if (faviconBlinkerIntervalId) {
            clearInterval(faviconBlinkerIntervalId);
            faviconBlinkerIntervalId = undefined;
        }
    });
}
var notified = false,
    faviconBlinkerIntervalId = undefined,
    faviconBlinker = true,
    defaultFavicon = 'http://i.imgur.com/BMpkAgE.png',
    newMessageFavicon = 'http://i.imgur.com/V7JNt8N.png',
    notifiedFavicon = 'http://i.imgur.com/KEQVRCl.png',
    blinkerFavicon;

function toggleNotify() {
    "use strict";
    if (window.newMsg && !notified) {
        blinkerFavicon = notifiedFavicon;
        notified = true;
    } else {
        if (faviconBlinkerIntervalId) {
            clearInterval(faviconBlinkerIntervalId);
            faviconBlinkerIntervalId = undefined;
        }
        faviconBlinker = true;
        addFavicon(defaultFavicon);
        notified = false;
    }
}

events.bind('onRoomChange', function () {
    "use strict";
    addFavicon(defaultFavicon);
    notified = false;
    faviconBlinker = true;
    if (faviconBlinkerIntervalId) {
        clearInterval(faviconBlinkerIntervalId);
        faviconBlinkerIntervalId = undefined;
    }
});
events.bind('onPreConnect', loadNameNotification);
//----------------- end nameNotification.js -----------------
//----------------- start OnClickKickBan.js -----------------
function loadOnClickKickBanOnce() {
    "use strict";

    function kickOrBan(kick, ban, data) {
        if (!kick) {
            return;
        }
        var user = JSON.parse(data).username,
            userFound = false,
            isMod = false,
            userId,
            i,
            action = ban ? 'ban' : 'kick';
        //search for the user and check if he is a user
        for (i = 0; i < window.users.length; i += 1) {
            if (window.users[i].username === user) {
                if (window.users[i].permissions > 0) {
                    isMod = true;
                    break;
                }
                userId = window.users[i].id;
                userFound = true;
                break;
            }
        }
        //can't kick/ban a mod
        if (isMod) {
            addSystemMessage("Can't {0} a mod.".format(action));
            return;
        }
        //kick/ban the user if he is in the room
        if (userFound) {
            window.global.sendcmd(action, {
                userid: userId
            });
        } else {
            //leaverban him
            if (ban) {
                window.global.sendcmd('leaverban', {
                    username: user
                });
                addSystemMessage('Leaverbanned user: {0}.'.format(user));
            } else {
                //do nothing when he wasn't found on kick
                addSystemMessage("Didn't find the user.");
            }
        }
    }

    //add the onClick event to the message
    events.bind('onAddMessage', function (user) {
        //only for mods and non system messages
        if (user.username === '' || !isUserMod()) {
            return;
        }
        var currentElement,
            //the cursor doesnt need to be changed if the key is still held down
            isCtrlKeyDown = false,
            //change the cursor when holding down ctrl/ctrl+alt
            keyDown = function (event) {
                if (!isCtrlKeyDown && (event.ctrlKey || (event.ctrlKey && event.altKey))) {
                    isCtrlKeyDown = true;
                    currentElement.css('cursor', 'pointer');
                }
            },
            //change it back
            keyUp = function (event) {
                if (isCtrlKeyDown && !event.ctrlKey) {
                    isCtrlKeyDown = false;
                    currentElement.css('cursor', 'default');
                }
            };
        //add the events to the latest username in the chat list
        $('#chat-messages > :last-child > :first-child')
            .on('click', function (event) {
                kickOrBan(event.ctrlKey, event.altKey, $(this).parent().attr('data'));
            })
            .hover(function () {
                currentElement = $(this);
                $(document).bind('keydown', keyDown);
                $(document).bind('keyup', keyUp);
            }, function () {
                currentElement.css('cursor', 'default');
                isCtrlKeyDown = false;
                $(document).unbind('keydown', keyDown);
                $(document).unbind('keyup', keyUp);
            });
    });

}

function loadOnClickKickBan() {
    "use strict";
    var chatCtrlDown = false;

    //block scroll event when holding ctrl/ctrl+alt to preven missclicks
    function chatKeyDown(event) {
        if (!chatCtrlDown && (event.ctrlKey || (event.ctrlKey && event.altKey))) {
            window.autoscroll = false;
            $('#chat-messages').bind('scroll', blockEvent);
            chatCtrlDown = true;
        }
    }

    //remove block events
    function chatKeyUp(event) {
        if (chatCtrlDown && !event.ctrlKey) {
            window.autoscroll = true;
            $('#chat-messages').unbind('scroll', blockEvent);
            $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
            chatCtrlDown = false;
        }
    }

    //bind the events
    $('#chat-messages').hover(
        function () {
            $(document).bind('keydown', chatKeyDown);
            $(document).bind('keyup', chatKeyUp);
        },
        function () {
            chatCtrlDown = false;
            $(document).unbind('keydown', chatKeyDown);
            $(document).unbind('keyup', chatKeyUp);
        }
    );
}


events.bind('onPreConnect', loadOnClickKickBan);
events.bind('onExecuteOnce', loadOnClickKickBanOnce);
//----------------- end OnClickKickBan.js -----------------
//----------------- start playMessages.js -----------------
/*
    Copyright (C) 2014  fugXD
*/

setField({
    'name': 'PlayMessages',
    'data': {
        'label': 'PlayMessages',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions'
});

function loadPlayMessages() {
    "use strict";
    events.bind('onPlayVideo', function (vidinfo, time, playing, indexOfVid) {
        if (GM_config.get('PlayMessages')) {
            addSystemMessage('Now playing: ' + trimTitle(window.playlist[indexOfVid].title, 240));
        }
    });
}
events.bind('onExecuteOnce', loadPlayMessages);
//----------------- end playMessages.js -----------------
//----------------- start prefix.js -----------------
setField({
    'name': 'ChatPrefix',
    'data': {
        'label': 'Chat Prefix',
        'type': 'text',
        'default': ''
    },
    'section': 'Chat Additions'
});

function loadPrefixOnce() {
    events.bind('onSendChat', function(event, message) {
        if(!message.match(/^[\[>#$'/@]/)){
            var prefix = GM_config.get('ChatPrefix');
            $("#chat input").val(prefix + message);
        }
    });
}

events.bind('onExecuteOnce', loadPrefixOnce);
//----------------- end prefix.js -----------------
//----------------- start timestamp.js -----------------
setField({
    'name': 'Timestamp',
    'data': {
        'label': 'Timestamp (in front of messages)',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Chat Additions'
});

function loadTimestamp() {
    "use strict";
    var oldAddMessage = window.addMessage,
        date,
        hours,
        minutes,
        timestamp,
        data;

    //add/remove timestamps when changing the setting
    events.bind('onSettingChange[Timestamp]', function () {
        $('#chat-messages').children().each(function () {
            //parse the data
            var data = JSON.parse($(this).attr('data')),
                newText;

            //format the text
            if ($(this).find('.emote').length > 0){
                newText = $(this).find('.emote').text();
                if (GM_config.get('Timestamp')) {
                    newText = '{0} - {1}'.format(data.timestamp, newText);
                } else {
                    newText = newText.replace(/^\d\d:\d\d\s-\s/, '');
                }
                $(this).find('.emote').text(newText);
            }else{
                if (GM_config.get('Timestamp')) {
                    newText = '{0} - {1}: '.format(data.timestamp, data.username);
                } else {
                    newText = '{0}: '.format(data.username);
                }
                //apply the new text
                $(this).find('.username').text(newText);
            }

        });
        //scroll the chat down
        $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
    });

    //overwrite InstaSynch's addMessage function
    window.addMessage = function (user, message, extraStyles) {
        date = new Date();
        minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        hours = date.getHours();
        if (hours < 10) {
            hours = "0" + hours;
        }
        timestamp = '{0}:{1}'.format(hours, minutes);

        data = {
            'timestamp': timestamp,
            'username': user.username
        };

        if (GM_config.get('Timestamp')) {
            user.username = '{0} - {1}'.format(timestamp, user.username);
        }
        oldAddMessage(user, message, extraStyles);
        $('#chat-messages .message :last').attr('data', JSON.stringify(data));
    };
}

events.bind('onExecuteOnce', loadTimestamp);
//----------------- end timestamp.js -----------------
//----------------- start aliases.js -----------------
function aliases(params) {
    "use strict";
    if (!params[1]) {
        addSystemMessage('No name given. See ipLogs in the console for all ips.');
        return;
    }
    var username = params[1],
        output = '',
        tempOutput = '',
        found,
        ip,
        i,
        str;

    //search for ips with the given username
    for (ip in window.ipLogs) {
        if (window.ipLogs.hasOwnProperty(ip)) {
            //reset
            tempOutput = '{0}: '.format(ip);
            found = false;
            for (i = 0; i < window.ipLogs[ip].length; i += 1) {

                //set the string to format
                if (!window.ipLogs[ip][i].loggedin) {
                    str = '{0}(g), ';
                } else {
                    str = '{0}, ';
                }
                //add it to the output
                tempOutput += str.format(window.ipLogs[ip][i].username);

                //is the searched name in the ip array?
                if (window.ipLogs[ip][i].username.toLowerCase() === username.toLowerCase()) {
                    found = true;
                }
            }
            tempOutput = '{0}<br>'.format(tempOutput.substring(0, tempOutput.length - 2));

            //add the output if it got found
            if (found) {
                output += tempOutput;
            }
        }
    }
    if (output !== '') {
        addSystemMessage(output);
    }

}

function loadIPLog() {
    "use strict";
    commands.set('regularCommands', 'aliases ', aliases, 'Shows other users that have logged in with the same IP. See ipLogs in the console for all ips.');

    //create ipLogs object to be accessable on the site scope
    window.ipLogs = {};
    //bind the evnt
    events.bind('onAddUser', function (user) {
        var found = false,
            i;
        //create the array
        window.ipLogs[user.ip] = window.ipLogs[user.ip] || [];

        //has the username already been added?
        for (i = 0; i < window.ipLogs[user.ip].length; i += 1) {
            if (window.ipLogs[user.ip][i].username.toLowerCase() === user.username.toLowerCase()) {
                found = true;
                break;
            }
        }
        //if not add it
        if (!found) {
            window.ipLogs[user.ip].push(user);
        }
    });
}

events.bind('onExecuteOnce', loadIPLog);
//----------------- end aliases.js -----------------
//----------------- start botCommands.js -----------------
function loadBotCommands() {
    "use strict";
    var emptyFunc = function () {
        return undefined;
    };

    commands.set('modCommands', "$autoclean", emptyFunc);
    commands.set('modCommands', "$addRandom ", emptyFunc);
    commands.set('modCommands', "$addToUserBlacklist ", emptyFunc);
    commands.set('modCommands', "$addToVideoBlacklist ", emptyFunc);
    commands.set('modCommands', "$addAutobanMessage ", emptyFunc);
    commands.set('modCommands', "$clearAutobanMessages", emptyFunc);
    commands.set('modCommands', "$voteBump ", emptyFunc);
    commands.set('modCommands', "$shuffle ", emptyFunc);
    commands.set('modCommands', "$exportUserBlacklist", emptyFunc);
    commands.set('modCommands', "$poll ", emptyFunc);
    commands.set('modCommands', "$mute", emptyFunc);
    commands.set('modCommands', "$bump ", emptyFunc);
    commands.set('modCommands', "$grant ", emptyFunc);
    commands.set('modCommands', "$revoke ", emptyFunc);

    commands.set('regularCommands', "$translateTitle ", emptyFunc);
    commands.set('regularCommands', "$languageCodes", emptyFunc);
    commands.set('regularCommands', "$greet", emptyFunc);
    commands.set('regularCommands', "$derka ", emptyFunc);
    commands.set('regularCommands', "$languageCodes ", emptyFunc);
    commands.set('regularCommands', "$ask ", emptyFunc);
    commands.set('regularCommands', "$askC ", emptyFunc);
    commands.set('regularCommands', "$askJ ", emptyFunc);
    commands.set('regularCommands', "$eval ", emptyFunc);
    commands.set('regularCommands', "$emotes", emptyFunc);
    commands.set('regularCommands', "$script", emptyFunc);
    commands.set('regularCommands', "$wolfram ", emptyFunc);
    commands.set('regularCommands', "$8Ball ", emptyFunc);
    commands.set('regularCommands', "$roll ", emptyFunc);
    commands.set('regularCommands', "$quote ", emptyFunc);
    commands.set('regularCommands', "$help ", emptyFunc);
    commands.set('regularCommands', "$stats", emptyFunc);
    commands.set('regularCommands', "$skiprate", emptyFunc);
    commands.set('regularCommands', "$mostPlayed", emptyFunc);
    commands.set('regularCommands', "$exportPlaylist ", emptyFunc);
    commands.set('regularCommands', "$rustle ", emptyFunc);
    commands.set('regularCommands', "$search ", emptyFunc);
    commands.set('regularCommands', "$seen ", emptyFunc);
    commands.set('regularCommands', "$urbandict ", emptyFunc);
}

events.bind('onExecuteOnce', loadBotCommands);
//----------------- end botCommands.js -----------------
//----------------- start bump.js -----------------
function loadBumpCommand() {
    "use strict";
    commands.set('modCommands', "bump ", bump, 'Bumps a video right under the active video. Parameters: the user to bump, the position to bump to, a url to bump.');

    //bind event for bumping an url
    events.bind('onAddVideo', function (vidinfo) {
        //bump the video after it got added
        if (videoInfoEquals(vidinfo.info, bumpInfo)) {
            window.global.sendcmd('move', {
                info: vidinfo.info,
                position: bumpTo || getActiveVideoIndex() + 1
            });
            bumpInfo = undefined;
            bumpTo = undefined;
        }
    });

}

function bump(params) {
    "use strict";
    var user,
        bumpIndex = -1,
        bumpUrl,
        i,
        activeIndex = getActiveVideoIndex();
    //read the parameters
    for (i = 1; i < params.length; i += 1) {
        if (isUsername(params[i])) {
            //is it a username?
            user = params[i];
        } else if (!bumpInfo && (bumpInfo = urlParser.parse(params[i]))) {
            //is it a url?
            bumpUrl = params[i];
        } else {
            //is it a position
            bumpTo = parseInt(params[i], 10);

            //try to parse position otherwise pick activeIndex + 1
            if (window.isNaN(bumpTo)) {
                bumpTo = activeIndex + 1;
            } else {
                bumpTo = Math.min(bumpTo, window.playlist.length - 1);
            }
        }
    }

    //return if nothing to bump got found
    if (!user && !bumpInfo) {
        addSystemMessage('Nothing found to bump: \'bump [user]? [url]? [position]?');
        return;
    }

    //search the video to be bumped
    for (i = window.playlist.length - 1; i >= 0; i -= 1) {
        if (videoInfoEquals(window.playlist[i].info, bumpInfo) ||
            (user && window.playlist[i].addedby.toLowerCase() === user.toLowerCase())) {
            bumpIndex = i;
            break;
        }
    }
    //video not found
    if (bumpIndex === -1) {
        //no link provided
        if (!bumpInfo) {
            addSystemMessage("The user didn't add any videos");
        } else {
            //add the video and bump it in the addVideo event
            window.global.sendcmd('add', {
                URL: bumpUrl
            });
        }
    } else {
        if (!bumpTo && bumpIndex < activeIndex) {
            bumpTo = activeIndex;
        }
        window.global.sendcmd('move', {
            info: window.playlist[bumpIndex].info,
            position: bumpTo || activeIndex + 1
        });
        bumpTo = undefined;
        bumpInfo = undefined;
    }
}

var bumpTo,
    bumpInfo;
events.bind('onExecuteOnce', loadBumpCommand);
//----------------- end bump.js -----------------
//----------------- start clearChat.js -----------------
function loadClearChatCommand() {
    "use strict";
    commands.set('regularCommands', "clearChat", clearChat, 'Clears the chat.');
}

function clearChat() {
    "use strict";
    $('#chat-messages').empty();
    window.messages = 0;
}

events.bind('onExecuteOnce', loadClearChatCommand);
//----------------- end clearChat.js -----------------
//----------------- start commandFloodProtect.js -----------------
function loadCommandFloodProtect() {
    "use strict";
    var oldsendcmd = window.global.sendcmd;
    window.global.sendcmd = function (command, data) {
        if (command) {
            //add the command to the cache
            commandCache.push({
                command: command,
                data: data
            });
        }
        //are we ready to send a command?
        if (sendcmdReady) {
            if (commandCache.length !== 0) {
                //set not ready
                sendcmdReady = false;
                //send the command
                oldsendcmd(commandCache[0].command, commandCache[0].data);
                //remove the sent command
                commandCache.splice(0, 1);
                //after 400ms send the next command
                setTimeout(function () {
                    sendcmdReady = true;
                    window.global.sendcmd();
                }, 400);
            }
        }
    };
}

var sendcmdReady = true,
    commandCache = [];

events.bind('onResetVariables', function () {
    "use strict";
    sendcmdReady = true;
    commandCache = [];
});
events.bind('onExecuteOnce', loadCommandFloodProtect);
//----------------- end commandFloodProtect.js -----------------
//----------------- start commandLoader.js -----------------
function loadCommandLoaderOnce() {
    "use strict";
    var items = {};
    //add site commands
    items.regularCommands = [
        "'reload",
        "'resynch",
        "'toggleFilter",
        "'toggleAutosynch",
        "'mute",
        "'unmute"
    ];
    items.modCommands = [
        "'togglePlaylistLock",
        "'kick ",
        "'ban ",
        "'unban ",
        "'clean",
        "'remove ",
        "'purge ",
        "'move ",
        "'play ",
        "'pause",
        "'resume",
        "'seekto ",
        "'seekfrom ",
        "'setskip ",
        "'banlist",
        "'modlist",
        "'save",
        "'leaverban ",
        //commented those so you can't accidently use them
        //"'clearbans",
        //"'motd ",
        //"'mod ",
        //"'demod ",
        //"'description ",
        "'next"
    ];
    items.commandFunctionMap = {};
    items.descriptionMap = {};

    //commands gets executed by posting a message to the site and catching it
    //in the script scope
    events.bind('onExecuteCommand', function (data) {
        items.commandFunctionMap[data.parameters[0].toLowerCase()](data.parameters);
    });

    //set up the commands object
    commands = {
        //add a command
        set: function (arrayName, funcName, func, description) {
            if (funcName[0] !== '$') {
                funcName = "'" + funcName;
            }
            items[arrayName].push(funcName);
            items.commandFunctionMap[funcName.toLowerCase()] = func;
            items.descriptionMap[funcName.toLowerCase()] = description;
        },
        //get the commands
        get: function (arrayName) {
            return items[arrayName];
        },
        //get command info
        getDescription: function (funcName) {
            funcName = funcName.toLowerCase();
            if (items.descriptionMap.hasOwnProperty(funcName + ' ')) {
                funcName = funcName + ' ';
            } else if (!items.descriptionMap.hasOwnProperty(funcName)) {
                funcName = undefined;
            }
            if (funcName) {
                return items.descriptionMap[funcName.toLowerCase()];
            }
        },
        //get all commands
        getAll: function () {
            return items;
        },
        //execute a command
        execute: function (funcName, params) {
            funcName = funcName.toLowerCase();
            if (funcName[0] === '$') {
                return;
            }
            if (items.commandFunctionMap.hasOwnProperty(funcName + ' ')) {
                funcName = funcName + ' ';
            } else if (!items.commandFunctionMap.hasOwnProperty(funcName)) {
                funcName = undefined;
            }
            if (funcName) {
                params[0] = funcName;
                //send the event to the site
                window.postMessage(JSON.stringify({
                    action: 'onExecuteCommand',
                    data: {
                        parameters: params
                    }
                }), "*");
            }
        }
    };
    events.bind('onInputKeypress', function (event, message) {
        if (event.keyCode === 13) { //enter
            //execute command on enter
            var params = message.split(' ');
            commands.execute(params[0], params);
        }
    });
}

var commands;
//----------------- end commandLoader.js -----------------
//----------------- start help.js -----------------
function loadHelpCommand() {
    "use strict";
    commands.set('regularCommands', "help ", help, 'Prints out all the commands (use $help for bot commands) or prints more info on a specific command. Optional Parameter: the command to get info on.');
}

function help(params) {
    "use strict";
    var description,
        output = '';
    if (params[1]) {
        //look for the given command 
        description = commands.getDescription(params[1]);
        if (!description) {
            output = 'Command {0} not found'.format(params[1]);
        } else {
            output = '{0}: {1}'.format(params[1], description);
        }
    } else {
        //just print all
        output += commands.get('modCommands').join(' ') + ' ';
        output += commands.get('regularCommands').join(' ') + ' ';
        output = output.replace(/\$[\w]+ /g, '');
    }
    addSystemMessage(output);
}

events.bind('onExecuteOnce', loadHelpCommand);
//----------------- end help.js -----------------
//----------------- start purgeTooLong.js -----------------
function loadPurgeTooLongCommand() {
    "use strict";
    commands.set('modCommands', "purgeTooLong ", purgeTooLong, 'Removes all videos over the timelimit with 1 hour as the standard timelimit. Parameters: timelimit in minutes.');
}

function purgeTooLong(params) {
    "use strict";
    //parameter or 60 minutes default
    var maxTimeLimit = params[1] ? parseInt(params[1], 10) * 60 : 60 * 60,
        videos = [],
        i;

    //get all Videos longer than maxTimeLimit
    for (i = 0; i < window.playlist.length; i += 1) {
        if (window.playlist[i].duration >= maxTimeLimit) {
            videos.push(window.playlist[i].info);
        }
    }

    //remove the videos
    for (i = 0; i < videos.length; i += 1) {
        window.global.sendcmd('remove', {
            info: videos[i]
        });
    }
}

events.bind('onExecuteOnce', loadPurgeTooLongCommand);
//----------------- end purgeTooLong.js -----------------
//----------------- start removeLast.js -----------------
function loadRemoveLast() {
    "use strict";
    commands.set('modCommands', "removeLast ", removeLast, 'Removes the last video of a user. Parameters: the user.');
}

// Remove the last video from the user
function removeLast(params) {
    "use strict";
    if (!params[1]) {
        addSystemMessage('No user specified: \'removeLast [user]');
        return;
    }
    var user = params[1],
        removeIndex = -1,
        i;

    // Look for the user last added video
    for (i = window.playlist.length - 1; i >= 0; i -= 1) {
        if (window.playlist[i].addedby.toLowerCase() === user.toLowerCase()) {
            removeIndex = i;
            break;
        }
    }

    if (removeIndex === -1) {
        addSystemMessage("The user didn't add any video");
    } else {
        //remove the video
        window.global.sendcmd('remove', {
            info: window.playlist[removeIndex].info
        });
    }
}

events.bind('onExecuteOnce', loadRemoveLast);
//----------------- end removeLast.js -----------------
//----------------- start replace.js -----------------
function loadReplace() {
    "use strict";
    commands.set('modCommands', "replace ", replace, 'Replaces the given video with a different video. Parameters: the two video urls');
}

function replace(params) {
    "use strict";
    if (!params[1] || !params[2]) {
        addSystemMessage('Need to specify 2 videos.');
        return;
    }
    //try to parse the parameters
    var video1 = urlParser.parse(params[1]),
        video2 = urlParser.parse(params[2]),
        videoToBump,
        videoToRemove,
        index = -1,
        i;

    //return if they are no urls
    if (!video1 || !video2) {
        addSystemMessage('No valid video urls given.');
        return;
    }
    //try to find one of the videos in the playlist
    for (i = 0; i < window.playlist.length; i += 1) {
        index = i;
        videoToRemove = window.playlist[i].info;
        if (videoInfoEquals(window.playlist[i].info, video1)) {
            videoToBump = params[2];
            break;
        } else if (videoInfoEquals(window.playlist[i].info, video2)) {
            videoToBump = params[1];
            break;
        }
    }
    //check if the video has been found
    if (!videoToRemove) {
        addSystemMessage('Video not found.');
        return;
    }

    //remove the first video
    window.global.sendcmd('remove', {
        info: videoToRemove
    });

    //bump the other video
    commands.execute("'bump", ["'bump", videoToBump, index]);
}

events.bind('onExecuteOnce', loadReplace);
//----------------- end replace.js -----------------
//----------------- start shuffle.js -----------------
function loadShuffleCommand() {
    "use strict";
    commands.set('modCommands', "shuffle ", shuffle, 'Shuffles the playlist or a wall of a user (prepare for spam combined with ModSpy). Possible parameters: the user');
}

function shuffle(params) {
    "use strict";
    var user = params[1],
        i,
        shuffleList = [],
        tempInfo,
        randIndex,
        newPosition;

    //save all the videos with their index
    for (i = getActiveVideoIndex() + 1; i < window.playlist.length; i += 1) {
        if (!user || window.playlist[i].addedby.toLowerCase() === user.toLowerCase()) {
            shuffleList.push({
                i: i,
                info: window.playlist[i].info
            });
        }
    }

    //move the videos to a new random position
    for (i = 0; i < shuffleList.length; i += 1) {
        randIndex = Math.floor(Math.random() * shuffleList.length);
        tempInfo = shuffleList[i].info;
        newPosition = shuffleList[randIndex].i;
        window.global.sendcmd('move', {
            info: tempInfo,
            position: newPosition
        });
    }
}

events.bind('onExecuteOnce', loadShuffleCommand);
//----------------- end shuffle.js -----------------
//----------------- start trimWall.js -----------------
function loadTrimWallCommand() {
    "use strict";
    commands.set('modCommands', "trimWall ", trimWall, 'Trims a wall of a user to the timelimit with 1 hour as standard timelimit. Possible parameters: timelimit in minutes.');
}

function trimWall(params) {
    "use strict";
    if (!params[1]) {
        addSystemMessage('No user specified: \'trimWall [user] [maxMinutes]');
        return;
    }
    resetWallCounter();
    var user = params[1],
        maxTimeLimit = params[2] ? parseInt(params[2], 10) * 60 : 60 * 60,
        currentTime = wallCounter[user],
        videos = [],
        i;

    if (currentTime < maxTimeLimit) {
        addSystemMessage('The wall is smaller than the timelimit');
        return;
    }
    //get all Videos for the user
    for (i = 0; i < window.playlist.length; i += 1) {
        if (window.playlist[i].addedby.toLowerCase() === user.toLowerCase()) {
            videos.push({
                info: window.playlist[i].info,
                duration: window.playlist[i].duration
            });
        }
    }

    function compareVideos(a, b) {
        return b.duration - a.duration;
    }
    //sort the array so we will get the longest first
    videos.sort(compareVideos);

    for (i = 0; i < videos.length && currentTime > maxTimeLimit; i += 1) {
        currentTime -= videos[i].duration;
        // rmVideo(i,videos[i].info);
        //delay via commandFloodProtect.js
        window.global.sendcmd('remove', {
            info: videos[i].info
        });
    }
}

events.bind('onExecuteOnce', loadTrimWallCommand);
//----------------- end trimWall.js -----------------
//----------------- start controlBar.js -----------------
setField({
    'name': 'chat-opacity',
    'data': {
        'label': 'Chat',
        'type': 'int',
        'title': '0-100',
        'min': 0,
        'max': 100,
        'default': 30,
        'size': 1
    },
    'section': 'General Additions',
    'subsection': 'Fullscreen Opacity'
});
setField({
    'name': 'poll-opacity',
    'data': {
        'label': 'Poll',
        'type': 'int',
        'title': '0-100',
        'min': 0,
        'max': 100,
        'default': 30,
        'size': 1
    },
    'section': 'General Additions',
    'subsection': 'Fullscreen Opacity'
});
setField({
    'name': 'playlist-opacity',
    'data': {
        'label': 'Playlist',
        'type': 'int',
        'title': '0-100',
        'min': 0,
        'max': 100,
        'default': 30,
        'size': 1
    },
    'section': 'General Additions',
    'subsection': 'Fullscreen Opacity'
});

setField({
    'name': 'button-animations',
    'data': {
        'label': 'Button Animations',
        'type': 'checkbox',
        'default': true
    },
    'section': 'General Additions'
});

function loadControlBar() {
    "use strict";
    var skipRate = 0,
        skipText = $('#skip-count').text(),
        playlistLock = $('#toggleplaylistlock img').attr('src');

    setUpFullscreen();

    //get the skiprate if we are already connected
    if (isConnected) {
        skipRate = Math.round(parseInt(skipText.split('/')[1], 10) / blacknamesCount * 100 * 100) / 100;
    }

    //add the slidercontainer
    $('.sliderContainer').prependTo('#playlist');

    //empty and create the control bar
    //playlist-controls
    //    skip-contaier
    //        skip
    //            animationContainer
    //        skip-count
    //    addVid
    //        URLinput
    //        addUrl
    //            animationContainer
    //    toggleplaylistlock
    //        img
    //    reloadPlayer
    //        animationContainer
    //    resynchPlayer
    //        animationContainer
    //    mirrorPlayer
    //        animationContainer
    //    fullscreen
    //        animationContainer
    //    nnd-mode
    //        animationContainer
    $('.playlist-controls').empty().append(
        $('<div>', {
            'id': 'skip-container'
        }).append(
            $('<div>', {
                'id': 'skip',
                'class': 'controlIcon',
                'title': 'Skip'
            }).append(
                $('<div>').addClass('animationContainer')
            ).click(function () {
                if (window.userInfo.loggedin) {
                    window.global.sendcmd('skip', null);
                } else {
                    addErrorMessage("You must be logged in to vote to skip.");
                }
            })
        ).append(
            $('<div>', {
                'id': 'skip-count',
                'title': skipRate + '%'
            }).text(skipText)
        )
    ).append(
        $('<div>', {
            'id': 'addVid'
        }).append(
            $('<input>', {
                'name': 'URLinput',
                'id': 'URLinput',
                'type': 'text',
                'title': 'Start typing to search',
                'placeholder': 'Add Video / Search'
            })
        ).append(
            $('<div>', {
                'id': 'addUrl',
                'class': 'controlIcon',
                'title': 'Add Video'
                //.css('background-image', 'url(http://i.imgur.com/Fv1wJk5.png)')
            }).append(
                $('<div>').addClass('animationContainer')
            ).click(function () {
                var url = $('#URLinput').val();
                if ($('#URLinput').val().trim() !== '') {
                    window.global.sendcmd('add', {
                        URL: url
                    });
                }
                $('#URLinput').val('');
            })
        )
    ).append(
        $('<div>', {
            'id': 'toggleplaylistlock'
        }).append(
            $('<img>', {
                'src': playlistLock
            }).css('top', '3px').css('position', 'relative')
        ).click(function () {
            window.global.sendcmd('toggleplaylistlock', null);
        })
    ).append(
        $('<div>', {
            'id': 'reloadPlayer',
            'title': 'Reload',
            'class': 'controlIcon'
        }).append(
            $('<div>').addClass('animationContainer')
        ).click(reloadPlayer)
    ).append(
        $('<div>', {
            'id': 'resynchPlayer',
            'title': 'Resynch',
            'class': 'controlIcon'
        }).append(
            $('<div>').addClass('animationContainer')
        ).click(function () {
            window.global.sendcmd('resynch', null);
        })
    ).append(
        $('<div>', {
            'id': 'mirrorPlayer',
            'title': 'Mirror Player',
            'class': 'controlIcon'
        }).append($('<div>').addClass('animationContainer')).click(function () {
            //toggle mirror
            $('#media > :first-child').toggleClass('mirror');
            $('#block-fullscreen').toggleClass('block-fullscreen2');
        })
    ).append(
        $('<div>', {
            'id': 'fullscreen',
            'title': 'Fullscreen',
            'class': 'controlIcon'
        }).append(
            $('<div>').addClass('animationContainer')
        ).click(toggleFullscreen)
    ).append(
        $('<div>', {
            'id': 'nnd-Mode',
            'title': 'NND Mode (scrolling Text)',
            'class': 'controlIcon'
        }).append(
            $('<div>').addClass('animationContainer')
        ).click(function () {
            GM_config.set('NNDMode', !GM_config.get('NNDMode'));
            saveSettings();
        })
    ).append(
        $('<div>', {
            'id': 'toggleplayer',
            'title': 'Turn player off',
            'class': 'controlIcon toggleplayeractive'
        }).append(
            $('<div>').addClass('animationContainer')
        ).click(function () {
            GM_config.set('PlayerActive', !GM_config.get('PlayerActive'));
            saveSettings();
            togglePlayer();
        })
    );
    toggleAnimations();
}

function loadControlBarOnce() {
    "use strict";

    events.bind('onSettingChange[button-animations]', toggleAnimations);

    events.bind('onSkips', function (skips, skipsNeeded, percent) {
        $('#skip-count').attr('title', '{0}%'.format(Math.round(percent * 100) / 100));
    });

    //make poll visible in fullscreen when it is hidden
    events.bind('onCreatePoll', function () {
        $('.poll-container').removeClass('poll-container2');
        $('#hide-poll').removeClass('hide-poll2');
    });

    //on fullscreen change
    $(document).bind('fscreenchange', function () {
        if ($.fullscreen.isFullScreen()) {
            if (userFullscreenToggle) {
                //remove all nnd elements
                $('.NND-element').remove();

                cssLoader.load('fullscreenLayout');
                //the event somehow doesn't affect it when changing to fullscreen so fire it by hand again after half a second
                setTimeout(function () {
                    events.fire('onCSSLoad[layout]');
                }, 500);
                //set opacity bars to their values
                $('#chat').css('opacity', GM_config.get('chat-opacity') / 100.0);
                $('#playlist').css('opacity', GM_config.get('playlist-opacity') / 100.0);
                $('.poll-container').css('opacity', GM_config.get('poll-opacity') / 100.0);
                $('#chat-slider').slider('option', 'value', GM_config.get('chat-opacity'));
                $('#poll-slider').slider('option', 'value', GM_config.get('poll-opacity'));
                $('#playlist-slider').slider('option', 'value', GM_config.get('playlist-opacity'));
            }
        } else {
            //turn back to normal if user canceled fullscreen
            if (userFullscreenToggle) {
                cssLoader.load('{0}Layout'.format(GM_config.get('Layout')));
                $('#chat').css('opacity', '1');
                $('#playlist').css('opacity', '1');
                $('.poll-container').css('opacity', '1');
            }
            userFullscreenToggle = false;
        }
    });
}

function addAnimation(child, cls) {
    "use strict";
    child.unbind('webkitAnimationIteration oanimationiteration MSAnimationIteration animationiteration').addClass(cls);
}

function removeAnimation(child, cls) {
    "use strict";
    child.one('webkitAnimationIteration oanimationiteration MSAnimationIteration animationiteration', function () {
        child.removeClass(cls);
    });
}

function toggleAnimations() {
    "use strict";
    //remove mouse events
    $('#skip').unbind('mouseenter mouseleave');
    $('#addUrl').unbind('mouseenter mouseleave');
    $('#reloadPlayer').unbind('mouseenter mouseleave');
    $('#resynchPlayer').unbind('mouseenter mouseleave');
    $('#mirrorPlayer').unbind('mouseenter mouseleave');
    $('#fullscreen').unbind('mouseenter mouseleave');
    $('#nnd-Mode').unbind('mouseenter mouseleave');

    //readd them if setting is on
    if (GM_config.get('button-animations')) {
        //start animation on hover and reset with each iteration
        $('#skip').hover(function () {
            addAnimation($(this).children().eq(0), 'shake');
        }, function () {
            removeAnimation($(this).children().eq(0), 'shake');
        });
        $('#addUrl').hover(function () {
            addAnimation($(this).children().eq(0), 'pulse');
        }, function () {
            removeAnimation($(this).children().eq(0), 'pulse');
        });
        $('#reloadPlayer').hover(function () {
            addAnimation($(this).children().eq(0), 'spiral');
        }, function () {
            removeAnimation($(this).children().eq(0), 'spiral');
        });
        $('#resynchPlayer').hover(function () {
            addAnimation($(this).children().eq(0), 'spiral');
        }, function () {
            removeAnimation($(this).children().eq(0), 'spiral');
        });
        $('#mirrorPlayer').hover(function () {
            addAnimation($(this).children().eq(0), 'spinner');
        }, function () {
            removeAnimation($(this).children().eq(0), 'spinner');
        });
        $('#fullscreen').hover(function () {
            addAnimation($(this).children().eq(0), 'grow');
        }, function () {
            removeAnimation($(this).children().eq(0), 'grow');
        });
        $('#nnd-Mode').hover(function () {
            addAnimation($(this).children().eq(0), 'marquee');
        }, function () {
            removeAnimation($(this).children().eq(0), 'marquee');
        });
    }
}
var userFullscreenToggle = false;

function toggleFullscreen() {
    "use strict";
    if (!$.fullscreen.isFullScreen()) {
        userFullscreenToggle = true;
        $('body').fullscreen();
    } else {
        $.fullscreen.exit();
    }
}

function setUpFullscreen() {
    "use strict";
    var opacitySaveTimer;

    //don't save opacity with every little value change
    function saveOpacity() {
        $('#chat').css('opacity', GM_config.get('chat-opacity') / 100.0);
        $('#playlist').css('opacity', GM_config.get('playlist-opacity') / 100.0);
        $('.poll-container').css('opacity', GM_config.get('poll-opacity') / 100.0);
        if (opacitySaveTimer) {
            clearTimeout(opacitySaveTimer);
            opacitySaveTimer = undefined;
        }
        opacitySaveTimer = setTimeout(function () {
            saveSettings();
        }, 5000);
    }

    //add div to block the fullscreen button of the player
    $('#stage').append($('<div>', {
        'id': 'block-fullscreen'
    }).click(toggleFullscreen));

    //add buttons to hide playlist/poll
    $('.playlist').prepend($('<div>', {
        'id': 'hide-playlist'
    }).append(
        $('<div>').click(function () {
            $('#videos').toggleClass('playlist2');
            $('#hide-playlist').toggleClass('hide-playlist2');
            $('#chat').toggleClass('chat2');
        })
    ));
    $('.poll-container').prepend(
        $('<div>', {
            'id': 'hide-poll'
        }).append(
            $('<div>').click(function () {
                $('.poll-container').toggleClass('poll-container2');
                $('#hide-poll').toggleClass('hide-poll2');
            })
        )
    );

    //add opacity sliders
    $('.overall').append(
        $('<div>', {
            'id': 'opacity-sliders'
        }).append(
            $('<span>').text('Opacity')
        ).append(
            $('<div>', {
                'id': 'chat-slider'
            }).slider({
                range: "min",
                value: GM_config.get('chat-opacity'),
                min: 0,
                max: 100,
                slide: function (event, ui) {
                    GM_config.set('chat-opacity', ui.value);
                    saveOpacity();
                }
            }).append(
                $('<span>').text('chat').addClass('text-shadow')
            )
        ).append(
            $('<div>', {
                'id': 'poll-slider'
            }).slider({
                range: "min",
                value: GM_config.get('poll-opacity'),
                min: 0,
                max: 100,
                slide: function (event, ui) {
                    GM_config.set('poll-opacity', ui.value);
                    saveOpacity();
                }
            }).append(
                $('<span>').text('poll').addClass('text-shadow')
            )
        ).append(
            $('<div>', {
                'id': 'playlist-slider'
            }).slider({
                range: "min",
                value: GM_config.get('playlist-opacity'),
                min: 0,
                max: 100,
                slide: function (event, ui) {
                    GM_config.set('playlist-opacity', ui.value);
                    saveOpacity();
                }
            }).append(
                $('<span>').text('playlist').addClass('text-shadow')
            )
        )
    );
}

events.bind('onExecuteOnce', loadControlBarOnce);
//----------------- end controlBar.js -----------------
//----------------- start CSSLoader.js -----------------
function cssLoaderLoadOnce() {
    "use strict";
    cssLoader = (function () {
        var styles = {};

        return {
            'add': function (style) {
                //set the id as the name if it didn't get set
                if (!style.id) {
                    style.id = style.name;
                }

                //save the style
                styles[style.name] = style;

                //load it
                if (style.autoload) {
                    cssLoader.load(style.name);
                }
            },
            'load': function (styleName) {
                var style = styles[styleName],
                    id = '#{0}'.format(style.id);
                $(id).remove();

                $('head').append(
                    $('<link>', {
                        'rel': 'stylesheet',
                        'type': 'text/css',
                        'id': style.id,
                        'href': style.url
                    }).on('load', function () {
                        //fire event after the CSS has been loaded
                        events.fire('onCSSLoad[{0}]'.format($(this).attr('id')));
                    })
                );
                //if the is nothing to load fire the event directly
                if (style.url === '') {
                    events.fire('onCSSLoad[{0}]'.format(style.id));
                }
            }
        };
    }());
}

var cssLoader;
//----------------- end CSSLoader.js -----------------
//----------------- start Description.js -----------------
function loadDescription() {
    "use strict";
    if (!isBibbyRoom()) {
        return;
    }
    var descr = "";
    descr += "<p style=\"font-family: Palatino; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\"><strong style=\"font-size: 20pt; \">Bibbytube<\/strong><\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 16pt; text-align: center; \">";
    descr += "  <strong>instasynch&#39;s most <img src=\"http:\/\/i.imgur.com\/L1Nuk.gif\" \/> room<\/strong><\/p>";
    descr += "<hr noshade color='black' width='550' size='5' align='center'>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <span style=\"font-size: 14pt; \">Playlist is always unlocked, so add videos for everyone to watch.<\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\">New content\/OC is appreciated.<\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 12pt; text-align: center; \">";
    descr += "  Note: Many of our videos are NSFW.<\/p>";
    descr += "<hr noshade color='black' width='550' size='5' align='center'>";
    descr += "<p style=\"font-family: Palatino; font-size: 18pt; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\"><strong>Rules&nbsp;<\/strong><\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  1. No RWJ, Ponies, or Stale Videos. &nbsp;Insta-skip<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  2. BEGGING FOR SKIPS IS FOR GAYLORDS<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  3. &nbsp;NO SEAL JOKES<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  If your video gets removed and shouldn't have been, try adding it later.<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  MODS=GODS<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <strong><span style=\"color:#003399; font-family: Palatino; font-size: 18pt; \">Rules for the Reading Impaired<\/span><\/strong><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesEnglish.mp3\"><img src=\"http:\/\/i.imgur.com\/LIXqI5Q.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesDutch.mp3\"><img src=\"http:\/\/i.imgur.com\/giykE7C.jpg?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesFrench.mp3\"><img src=\"http:\/\/i.imgur.com\/BucOmRs.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesGerman.mp3\"><img src=\"http:\/\/i.imgur.com\/bTwmX9v.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesSpanish.mp3\"><img src=\"http:\/\/i.imgur.com\/aZvktnt.png?1\" \/><\/a><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <strong><span style=\"color:#003399;\"><span style=\" font-family: Palatino; font-size: 18pt; \">Connect with Bibbytube in other ways!<\/span><\/span><\/strong><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/steamcommunity.com\/groups\/Babbytube\"><img src=\"http:\/\/i.imgur.com\/AZHszva.png?1\" \/><\/a><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/facebook.com\/babbytube\"><img src=\"http:\/\/i.imgur.com\/NuT2Bti.png?4\" \/><\/a><a href=\"http:\/\/twitter.com\/bibbytube_\/\"><img src=\"http:\/\/i.imgur.com\/T6oWmfB.png?4\" \/><\/a><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "Send complaints with some form of log to <a href=\"mailto:complaintsbibby@gmail.com\" style=\"color:#003399;\">complaintsbibby@gmail.com<\/a><\/p>";
    $('#roomFooter >').html(descr);
}

events.bind('onPreConnect', loadDescription);
//----------------- end Description.js -----------------
//----------------- start events.js -----------------
var currentPlayer = '',
    blacknamesCount = 0,
    greynamesCount = 0,
    modsCount = 0;

function loadEventsOnce() {
    "use strict";

    //grab the functions from the site
    var oldAddMessage = window.addMessage,
        oldCreatePoll = window.createPoll,
        oldAddVideo = window.addVideo,
        oldRemoveVideo = window.removeVideo,
        oldLoadRoomObj = window.global.loadRoomObj,
        oldPlayVideo = window.playVideo,
        oldMoveVideo = window.moveVideo,
        oldAddUser = window.addUser,
        oldRemoveUser = window.removeUser,
        oldSkips = window.skips,
        oldMakeLeader = window.makeLeader,
        oldLoadUserlist = window.loadUserlist,
        oldLoadPlaylist = window.loadPlaylist,
        oldOnConnecting = window.global.onConnecting,
        oldOnConnected = window.global.onConnected,
        oldOnReconnecting = window.global.onReconnecting,
        oldOnDisconnect = window.global.onDisconnect,
        i;

    //overwrite them
    window.loadUserlist = function (userlist) {
        events.fire('onUserlist', [userlist], true);
        oldLoadUserlist(userlist);
        events.fire('onUserlist', [userlist], false);
    };

    window.loadPlaylist = function (playlist) {
        events.fire('onPlaylist', [playlist], true);
        oldLoadPlaylist(playlist);
        events.fire('onPlaylist', [playlist], false);
    };

    window.global.loadRoomObj = function () {
        events.fire('onRoomChange', [], true);
        oldLoadRoomObj();
        events.fire('onRoomChange', [], false);
    };
    window.global.onConnecting = function () {
        events.fire('onConnecting', [], true);
        oldOnConnecting();
        events.fire('onConnecting', [], false);
    };
    window.global.onConnected = function () {
        events.fire('onConnect', [], true);
        oldOnConnected();
        events.fire('onConnect', [], false);
    };
    window.global.onReconnecting = function () {
        events.fire('onReconnecting', [], true);
        oldOnReconnecting();
        events.fire('onReconnecting', [], false);
    };
    window.global.onDisconnect = function () {
        events.fire('onDisconnect', [], true);
        oldOnDisconnect();
        events.fire('onDisconnect', [], false);
    };

    window.playVideo = function (vidinfo, time, playing) {
        if (!vidinfo) {
            return;
        }

        if (GM_config.get('PlayerActive') && currentPlayer !== vidinfo.provider) {
            events.fire('onPlayerChange', [currentPlayer, vidinfo.provider], true);
        }
        var indexOfVid = window.getVideoIndex(vidinfo),
            oldAfterReady;
        events.fire('onPlayVideo', [vidinfo, time, playing, indexOfVid], true);
        oldPlayVideo(vidinfo, time, playing);
        if (GM_config.get('PlayerActive') && currentPlayer !== vidinfo.provider) {
            events.fire('onPlayerChange', [currentPlayer, vidinfo.provider], false);
            videojs().player.ready(function () {
                events.fire('onPlayerReady', [currentPlayer, vidinfo.provider], false);
            });
            currentPlayer = vidinfo.provider;
        }
        events.fire('onPlayVideo', [vidinfo, time, playing, indexOfVid], false);
    };

    window.moveVideo = function (vidinfo, position) {
        var oldPosition = window.getVideoIndex(vidinfo);
        events.fire('onMoveVideo', [vidinfo, position, oldPosition], true);
        oldMoveVideo(vidinfo, position);
        events.fire('onMoveVideo', [vidinfo, position, oldPosition], false);
    };

    window.addUser = function (user, css, sort) {
        countUser(user, true);
        events.fire('onAddUser', [user, css, sort], true);
        oldAddUser(user, css, sort);
        events.fire('onAddUser', [user, css, sort], false);
    };

    window.removeUser = function (id) {
        var user = window.users[getIndexOfUser(id)];
        countUser(user, false);
        events.fire('onRemoveUser', [id, user], true);
        oldRemoveUser(id);
        events.fire('onRemoveUser', [id, user], false);
    };
    window.skips = function (skips, skipsNeeded) {
        events.fire('onSkips', [skips, skipsNeeded, skipsNeeded / blacknamesCount * 100], true);
        oldSkips(skips, skipsNeeded);
        events.fire('onSkips', [skips, skipsNeeded, skipsNeeded / blacknamesCount * 100], false);
    };
    window.makeLeader = function (userId) {
        events.fire('onMakeLeader', [userId], true);
        oldMakeLeader(userId);
        events.fire('onMakeLeader', [userId], false);
    };

    window.addMessage = function (user, message, extraStyles) {
        events.fire('onAddMessage', [user, message, extraStyles], true);
        oldAddMessage(user, message, extraStyles);
        events.fire('onAddMessage', [user, message, extraStyles], false);
    };

    function pollEquals(oldPoll, newPoll) {
        if (oldPoll.title === newPoll.title && oldPoll.options.length === newPoll.options.length) {
            for (i = 0; i < newPoll.options.length; i += 1) {
                if (oldPoll.options[i].option !== newPoll.options[i].option) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    window.createPoll = function (poll) {
        if (!pollEquals(oldPoll, poll)) {
            events.fire('onCreatePoll', [poll], true);
            oldCreatePoll(poll);
            events.fire('onCreatePoll', [poll], false);
        } else {
            oldCreatePoll(poll);
        }
    };

    window.addVideo = function (vidinfo, updateScrollbar) {
        events.fire('onAddVideo', [vidinfo, updateScrollbar], true);
        oldAddVideo(vidinfo, updateScrollbar);
        events.fire('onAddVideo', [vidinfo, updateScrollbar], false);
    };
    window.removeVideo = function (vidinfo) {
        var indexOfVid = window.getVideoIndex(vidinfo),
            video = window.playlist[indexOfVid];
        events.fire('onRemoveVideo', [vidinfo, indexOfVid, video], true);
        oldRemoveVideo(vidinfo);
        events.fire('onRemoveVideo', [vidinfo, indexOfVid, video], false);
    };
    //stuff that has to be executed in the scope of greasemonkey for the GM API to work
    window.addEventListener("message", function (event) {
        try {
            var parsed = JSON.parse(event.data);
            if (parsed.action) {
                //own events
                events.fire(parsed.action, [parsed.data], false);
            }
            //all
            events.fire('onPageMessage', [parsed], false);
        } catch (ignore) {}
    }, false);
}

function loadEvents() {
    "use strict";
    var oldPlayerDestroy = window.video.destroy;

    window.video.destroy = function () {
        events.fire('onPlayerDestroy', [], true);
        oldPlayerDestroy();
        events.fire('onPlayerDestroy', [], false);
        currentPlayer = '';
    };

    $("#chat input").bindFirst('keypress', function (event) {
        events.fire('onInputKeypress', [event, $("#chat input").val()], false);
        if (event.keyCode === 13 && $("#chat input").val() !== '') {
            events.fire('onSendChat', [event, $("#chat input").val()], false);
        }
    });
}

function countUser(user, increment) {
    "use strict";
    var val = increment ? 1 : -1;
    if (user.loggedin) {
        if (parseInt(user.permissions, 10) > 0) {
            modsCount += val;
        }
        blacknamesCount += val;
    } else {
        greynamesCount += val;
    }
}

events.bind('onResetVariables', function () {
    "use strict";
    currentPlayer = '';
});
//----------------- end events.js -----------------
//----------------- start General.js -----------------
function loadGeneralStuff() {
    "use strict";

    //http://stackoverflow.com/a/646643
    if (typeof String.prototype.startsWith !== 'function') {
        // see below for better implementation!
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) === 0;
        };
    }

    thisUsername = $.cookie('username');

    // window.addEventListener("message",
    // function(event){
    //     try{
    //         var parsed = JSON.parse(event.data);
    //         if(parsed.newTabParameters){
    //             openInNewTab(parsed.newTabParameters[0],parsed.newTabParameters[1]);
    //         }
    //     }catch(err){
    //     }
    // }, false);
    // function openInNewTab(url, options){
    //     GM_openInTab(url,options);
    // }
    events.bind('onUserlist', function () {
        isConnected = true;
    });
    events.bind('onDisconnect', function () {
        isConnected = false;
    });
    events.bind('onRoomChange', function () {
        isConnected = false;
    });
    events.bind('onResetVariables', function () {
        if (!isConnected) {
            window.users = [];
            window.playlist = [];
            window.playlist.move = function (old_index, new_index) //Code is property of Reid from stackoverflow
            {
                if (new_index >= this.length) {
                    var k = new_index - this.length;
                    while ((k -= 1) + 1) {
                        this.push(undefined);
                    }
                }
                this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            };
            window.totalTime = 0;
            window.messages = 0;
            window.MAXMESSAGES = 175;
            window.mouseOverBio = false;
            window.autoscroll = true;
            window.isMod = false;
            window.isLeader = false;
            window.mutedIps = [];
            window.userInfo = null;
            window.newMsg = false;
        }
    });
    //we are already connected
    if (window.userInfo) {
        isConnected = true;
    }

    cssLoader.add({
        'name': 'general',
        'url': 'https://cdn.rawgit.com/BibbyTube/Instasynch-Addons/master/General%20Additions/general.css',
        'autoload': true
    });
}

function htmlDecode(value) {
    "use strict";
    return $('<div/>').html(value).text();
}
var isConnected = false;

function logError(eventName, origin, err) {
    "use strict";
    window.console.log("Error: {0}, eventName {1}, function {2} %s %s %o, please check the console (ctrl + shift + j) and make a pastebin of everything in there".format(err.message, eventName, origin.name), origin, err.stack, err);
}

function isUsername(username) {
    "use strict";
    if (typeof username !== 'string') {
        return false;
    }
    return username.match(/^([A-Za-z0-9]|([\-_](?![\-_]))){5,16}$/) !== null;
}

function getActiveVideoIndex() {
    "use strict";
    return $('#playlist .active').index();
}

function videojs() {
    return $('.video-js')[0];
}

function isUserMod() {
    "use strict";
    return window.isMod;
}

function reloadPlayer() {
    if (window.video) {
        window.video.destroy();
    }
    window.global.sendcmd('reload', null);
}

function isBibbyRoom() {
    "use strict";
    return window.ROOMNAME.match(/bibby/i) ? true : false;
}

function getIndexOfUser(id) {
    "use strict";
    var i;
    for (i = 0; i < window.users.length; i += 1) {
        if (id === window.users[i].id) {
            return i;
        }
    }
    return -1;
}

function addSystemMessage(message) {
    "use strict";
    window.addMessage({
        username: ""
    }, message, 'system');
}

function addErrorMessage(message) {
    "use strict";
    window.addMessage({
        username: ""
    }, message, 'errortext');
}

function blockEvent(event) {
    "use strict";
    event.stopPropagation();
}

function getUsernameArray(lowerCase) {
    "use strict";
    var arr = [],
        i;
    for (i = 0; i < window.users.length; i += 1) {
        if (window.users[i].username !== 'unnamed') {
            if (!lowerCase) {
                arr.push(window.users[i].username);
            } else {
                arr.push(window.users[i].username.toLowerCase());
            }
        }
    }
    return arr;
}

function videoInfoEquals(info1, info2) {
    "use strict";
    if (!info1 || !info2) {
        return false;
    }
    if (info1.provider && info1.provider === info2.provider &&
        info1.mediaType && info1.mediaType === info2.mediaType &&
        info1.id && info1.id === info2.id) {
        return true;
    }
    return false;
}

var thisUsername;

/*
 ** Returns the caret (cursor) position of the specified text field.
 ** Return value range is 0-oField.value.length.
 ** http://flightschool.acylt.com/devnotes/caret-position-woes/
 */
function doGetCaretPosition(oField) {

    // Initialize
    var iCaretPos = 0,
        oSel;

    // IE Support
    if (document.selection) {
        // Set focus on the element
        oField.focus();

        // To get cursor position, get empty selection range
        oSel = document.selection.createRange();

        // Move selection start to 0 position
        oSel.moveStart('character', -oField.value.length);

        // The caret position is selection length
        iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart === '0') { // Firefox support
        iCaretPos = oField.selectionStart;
    }

    // Return results
    return iCaretPos;
}

function doSetCaretPosition(oField, position) {
    //IE
    if (document.selection) {
        var oSel;
        oField.focus();
        oSel = document.selection.createRange();
        oSel.moveStart('character', position);
        oSel.moveEnd('character', position);
    } else if (oField.selectionStart || oField.selectionStart === '0') { // Firefox support
        oField.selectionStart = position;
        oField.selectionEnd = position;
    }
}

function pasteTextAtCaret(text) {
    var sel,
        range,
        textNode;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            textNode = document.createTextNode(text);
            range.insertNode(textNode);

            // Preserve the selection
            range = range.cloneRange();
            range.setStartAfter(textNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection && document.selection.type !== "Control") {
        // IE < 9
        document.selection.createRange().text = text;
    }
}

//http://stackoverflow.com/a/9329476
function arrayHasOwnIndex(array, prop) {
    return array.hasOwnProperty(prop) && /^0$|^[1-9]\d*$/.test(prop) && prop <= 4294967294; // 2^32 - 2
}
//----------------- end General.js -----------------
//----------------- start greynameCount.js -----------------
function loadGreynameCountOnce() {
    "use strict";
    events.bind('onAddUser', setViewerCount);
    events.bind('onRemoveUser', setViewerCount);
}

function setViewerCount() {
    "use strict";
    $('#viewercount').html('{0}/{1}'.format(blacknamesCount, greynamesCount));
}

function loadGreynameCount() {
    "use strict";
    var i;

    //reset
    blacknamesCount = greynamesCount = modsCount = 0;

    //count the users
    for (i = 0; i < window.users.length; i += 1) {
        countUser(window.users[i], true);
    }

    //set the count
    setViewerCount();
}
events.bind('onDisconnect', function () {
    "use strict";
    blacknamesCount = greynamesCount = modsCount = 0;
});
events.bind('onPostConnect', loadGreynameCount);
events.bind('onExecuteOnce', loadGreynameCountOnce);
//----------------- end greynameCount.js -----------------
//----------------- start largeLayout.js -----------------
setField({
    'name': 'Layout',
    'data': {
        'label': 'Layout',
        'type': 'select',
        'options': ['normal', 'large'],
        'default': 'normal'
    },
    'section': 'General Additions'
});

function loadLayoutOnce() {
    "use strict";
    events.bind('onSettingChange[Layout]', changeLayout);
    var i,
        layouts = [{
            'name': 'normalLayout',
            'url': ''
        }, {
            'name': 'largeLayout',
            'url': 'https://cdn.rawgit.com/BibbyTube/Instasynch-Addons/df387c00846d3d45075c90d0c6733ece180d2af9/General%20Additions/Large%20Layout/largeLayout.css'
        }, {
            'name': 'fullscreenLayout',
            'url': 'https://cdn.rawgit.com/BibbyTube/Instasynch-Addons/0d078f0f03fc6553b72f200302a48101588373f0/General%20Additions/Control%20Bar/fullscreen.css'
        }];
    for (i = 0; i < layouts.length; i += 1) {
        layouts[i].id = 'layout';
        cssLoader.add(layouts[i]);
    }

    //reinitialise once the css has been loaded to fix the size
    events.bind('onCSSLoad[layout]', function () {
        playerWidth = $('#media').width();
        playerHeight = $('#media').height();
        $("#videos").data("jsp").reinitialise();
    });
}

function loadLayout() {
    "use strict";
    $('#playlistcontrols').css('width', '100%');
    $('.roomFooter ').css('margin-top', '0px');

    //change layout if it is a different one and then save
    function setLayout(event) {
        if (GM_config.get('Layout') !== $(event.currentTarget).text()) {
            GM_config.set('Layout', $(event.currentTarget).text());
            saveSettings();
        }
    }

    $('<div>', {
        'id': 'layoutSelector'
    }).text('layout:').insertBefore('#roomFooter');

    var i,
        layouts = [
            'normal',
            'large'
        ];

    //add all possible layouts
    for (i = 0; i < layouts.length; i += 1) {
        $('#layoutSelector').append($('<a>', {
            'id': '{0}Layout'.format(layouts[i])
        }).text(layouts[i]).click(setLayout).addClass('layoutClickable'));
    }

    //set active layout
    $('#{0}Layout'.format(GM_config.get('Layout'))).addClass('layoutNotClickable');

    //change to that layout
    changeLayout();
}
var largeLayoutCSS;

function changeLayout() {
    "use strict";

    //remove class from old layout
    $('.layoutNotClickable').removeClass('layoutNotClickable');

    //add to new layout
    $('#{0}Layout'.format(GM_config.get('Layout'))).addClass('layoutNotClickable');

    //load layout
    cssLoader.load('{0}Layout'.format(GM_config.get('Layout')));

    setPlayerDimension();
    $("#videos").data("jsp").reinitialise(); //this uses alot of resources
}

function setPlayerDimension() {
    "use strict";
    playerWidth = $('#media').width();
    playerHeight = $('#media').height();
}


events.bind('onExecuteOnce', loadLayoutOnce);
//----------------- end largeLayout.js -----------------
//----------------- start leaderseal.js -----------------
function loadLeaderSeal() {
    "use strict";
    var oldMakeLeader = window.makeLeader;
    window.makeLeader = function (userId) {
        oldMakeLeader(userId);
        $('#leaderSymbol').attr('src', 'http://i.imgur.com/BMpkAgE.png');
    };
}

events.bind('onPreConnect', loadLeaderSeal);
//----------------- end leaderseal.js -----------------
//----------------- start loadUserlist.js -----------------
function loadNewLoadUserlist() {
    "use strict";

    //rewrite of addUser from InstaSynch to use InsertionSort instead
    //of sorting the elements after adding the new one
    window.addUser = function (user, sort) {
        var css = '',
            index,
            i,
            userElement;
        if (user.loggedin) {
            css += 'registered ';
        }
        if (user.permissions > 0) {
            css += 'm ';
        }
        css += window.isMuted(user.ip) ? "muted" : "";
        user.css = css;
        index = window.users.length;
        userElement = $('<li/>', {
            "class": css,
            "text": user.username,
            "data": {
                username: String(user.username),
                id: user.id,
                css: css,
                loggedin: user.loggedin,
                ip: user.ip
            },
            "click": function () {
                $('#cin').val($('#cin').val() + $(this).data('username'));
                $('#cin').focus();
            }
        });
        userElement.hover(function () {
            var thisElement = $(this);
            $(this).data('hover', setTimeout(function () {
                $('#bio-username').text(thisElement.data('username').toUpperCase());
                $("#user_bio_hover").css('top', $(thisElement).offset().top - $("#chat").offset().top + 10);
                $('#bio-image').attr('src', '');
                $('#bio-text').text('');
                //reset
                $('#ban').data('id', "");
                $('#kick').data('id', "");
                $('#mute-button').data('ip', "");
                //
                $('#user_bio_hover').show();
                if (thisElement.data('loggedin') === true) {
                    window.getUserInfo(thisElement.data('username'), function (avatar, bio) {
                        $('#bio-image').attr('src', avatar);
                        $('#bio-text').text(bio);
                    });
                } else {
                    $('#bio-text').html("<span style='color: grey; font-style:italic'>User is not registered.</span>");
                }
                $('#ban').data('id', user.id);
                $('#kick').data('id', user.id);
                $('#mute-button').data('ip', user.ip);
                //show or hide mute/unmute buttons
                if (window.isMuted(user.ip)) {
                    $("#mute-button").removeClass("");
                    $("#mute-button").addClass("");
                } else {
                    $("#mute-button").removeClass("");
                    $("#mute-button").addClass("");
                }
            }, 600));
        }, function () {
            clearTimeout($(this).data('hover'));
            setTimeout(function () {
                if (!window.mouseOverBio) {
                    $('#user_bio_hover').hide();
                }
            }, 50);
        });
        //Search for the index where we need to insert
        for (i = 0; i < window.users.length; i += 1) {
            if (compareUser(user, window.users[i]) < 0) {
                index = i;
                break;
            }
        }

        //Inserting the users rather than sorting afterwards
        if ($("#userlist").children().length === 0 || index === window.users.length) {
            $("#userlist").append(userElement);
        } else {
            $("#userlist").children().eq(index).before(userElement);
        }
        window.users.splice(index, 0, user);
        $('#viewercount').html(window.users.length);
    };


    window.loadUserlist = function (userlist) {
        window.users = [];
        var i;
        $('#userlist').empty();
        for (i = 0; i < userlist.length; i += 1) {
            window.addUser(userlist[i], false);
        }
    };

    //just remove and readd the user
    window.renameUser = function (id, username) {
        var user,
            i;
        //start from the end since unnamed will be at the end of the list
        for (i = window.users.length - 1; i >= 0; i -= 1) {
            if (window.users[i].id === id) {
                user = window.users[i];
                user.username = username;
                window.removeUser(id);
                window.addUser(user, '', false);
                break;
            }
        }
    };
}

//compare users first by greynames / blacknames then by blacknames / mods
//and then by alphabet
function compareUser(a, b) {
    "use strict";
    if (!b) {
        return -1;
    }
    if (a.loggedin !== b.loggedin) {
        return (a.loggedin) ? -1 : 1;
    }
    if (a.permissions !== b.permissions) {
        return parseInt(b.permissions, 10) - parseInt(a.permissions, 10);
    }

    return a.username.localeCompare(b.username);
}
//----------------- end loadUserlist.js -----------------
//----------------- start logos.js -----------------
function loadLogos() {
    "use strict";
    $('.descr-stat-tip :first').empty().append($('<div>', {
        'id': 'viewing-logo'
    })).attr('title', 'viewing');
    $('.descr-stat-tip :last').empty().append($('<div>', {
        'id': 'visits-logo'
    })).attr('title', 'visits');
    if (isBibbyRoom()) {
        var temp = $('.top-descr :first > :first');
        $('.top-descr').empty().append(
            $('<div>', {
                'id': 'room-logo'
            })
        ).append(temp);
    }
}

events.bind('onPreConnect', loadLogos);
//----------------- end logos.js -----------------
//----------------- start pollMenu.js -----------------
function loadPollMenu() {
    "use strict";

    //recreate the poll menu to add +, -, copy old and clear buttons
    //at the top rather than the bottom so they don't move down when adding
    //more rows
    $('#create-pollBtn').text('Poll Menu');
    $('#create-poll').empty().append(
        $('<button>', {
            'id': 'add-poll-options'
        }).text('+').click(function () {

            //add another row if there are less than 10
            if ($('#create-poll > .create-poll-option').length < 10) {
                $('#create-poll').append(
                    $('<input/>', {
                        'class': 'formbox create-poll-option',
                        'placeholder': 'Option'
                    }).css('width', '97%')
                ).append($('<br>'));
            }
        }).css('margin-right', '0px')
    ).append(
        $('<button>').text('-').click(function () {

            //remove a row
            if ($('#create-poll > .create-poll-option').length > 1) {
                $('#create-poll > :last-child').remove();
                $('#create-poll > :last-child').remove();
            }
        }).css('width', '22px').css('margin-right', '2px')
    ).append(
        $('<button>').text('Copy Old').click(function () {

            //fill the rows with the old poll if there is one
            if (oldPoll) {
                var i = 0;
                $('#clear-poll-options').click();

                //add more rows until we got enough to fit the old poll
                if ($('#create-poll > .create-poll-option').length < oldPoll.options.length) {
                    while (oldPoll.options.length > $('#create-poll > .create-poll-option').length) {
                        $('#add-poll-options').click();
                    }
                }

                //set the title
                $('#create-poll > #title').val(htmlDecode(oldPoll.title));

                //set the options
                $(".create-poll-option").each(function () {
                    $(this).val(htmlDecode(oldPoll.options[i].option));
                    i += 1;
                    if (i >= oldPoll.options.length) {
                        return false;
                    }
                });
            }
        })
    ).append(
        $('<button>', {
            'id': 'clear-poll-options'
        }).text('Clear').click(function () {

            //just clear the options and title
            $('#create-poll > #title').val('');
            $(".create-poll-option").each(function () {
                $(this).val('');
            });
        })
    ).append(
        $('<button>').text('Create').click(function () {

            //copied from InstaSynch core.js
            var poll = {};
            poll.title = $("#title").val();
            poll.options = [];
            $(".create-poll-option").each(function () {
                if ($(this).val().trim() !== "") {
                    poll.options.push($(this).val().trim());
                }
            });
            window.global.sendcmd("poll-create", poll);
        })
    ).append(
        $('<br>')
    ).append(
        $('<input/>', {
            'class': 'formbox',
            'id': 'title',
            'placeholder': 'Poll Title'
        }).css('width', '97%')
    ).append(
        $('<br>')
    ).append(
        $('<input/>', {
            'class': 'formbox create-poll-option',
            'placeholder': 'Option'
        }).css('width', '97%')
    ).append(
        $('<br>')
    ).append(
        $('<input/>', {
            'class': 'formbox create-poll-option',
            'placeholder': 'Option'
        }).css('width', '97%')
    ).append(
        $('<br>')
    ).append(
        $('<input/>', {
            'class': 'formbox create-poll-option',
            'placeholder': 'Option'
        }).css('width', '97%')
    ).append(
        $('<br>')
    ).css('width', '400px');

    //read the current poll when the script got loaded after we got connected
    if (isConnected) {
        var poll = {};
        poll.title = $(".poll-title").text();
        poll.options = [];
        $('.poll-item').each(function () {
            poll.options.push({
                votes: $(this).children().eq(0).text(),
                option: $(this).children().eq(1).text()
            });
        });
        oldPoll = poll;
        if (poll.options.length !== 0) {
            window.createPoll(poll);
        }
    }
}

function loadPollMenuOnce() {
    "use strict";
    events.bind('onCreatePoll', function (poll) {
        //make a deep copy of the poll
        oldPoll = $.extend(true, {}, poll);
    }, true);
}

var oldPoll = {};

events.bind('onPreConnect', loadPollMenu);
events.bind('onExecuteOnce', loadPollMenuOnce);
//----------------- end pollMenu.js -----------------
//----------------- start settingsLoader.js -----------------
function loadSettingsLoader() {
    "use strict";
    //add the button
    $('#loginfrm > :first-child').before(
        $('<div>', {
            'id': 'addons-menu'
        }).append(
            $('<div>').append(
                $('<ul>').append(
                    $('<li>').append(
                        $('<a>', {
                            'id': 'addons-clicker'
                        }).append(
                            $('<img>', {
                                'src': 'http://i.imgur.com/V3vOIkS.png'
                            })
                        ).append('Addon Settings').click(function () {
                            if (GM_config.isOpen) {
                                GM_config.close();
                            } else {
                                GM_config.open();
                            }
                        })
                    )
                ).addClass('js')
            ).addClass('click-nav')
        )
    );
    $('.friendsList').detach().appendTo('#loginfrm');
    var fields = {},
        firstMiddle = true,
        firstInner = true,
        outerProp,
        middleProp,
        innerProp;
    //combine each sections settings with each other
    //first items with no section (is a section when it has no type)
    for (outerProp in settingsFields) {
        if (settingsFields.hasOwnProperty(outerProp)) {
            if (settingsFields[outerProp].type) {
                fields[outerProp] = settingsFields[outerProp];
            }
        }
    }
    //sections
    for (outerProp in settingsFields) {
        if (settingsFields.hasOwnProperty(outerProp)) {
            if (!settingsFields[outerProp].type) {
                firstMiddle = true;
                //items with no sub section
                for (middleProp in settingsFields[outerProp]) {
                    if (settingsFields[outerProp].hasOwnProperty(middleProp)) {
                        if (middleProp !== 'isSection' && settingsFields[outerProp][middleProp].type) {
                            fields[middleProp] = settingsFields[outerProp][middleProp];
                            //first item has to have the section description
                            if (firstMiddle) {
                                firstMiddle = false;
                                fields[middleProp].section = [outerProp];
                            }
                        }
                    }
                } //no subsections
                //subsections
                for (middleProp in settingsFields[outerProp]) {
                    if (settingsFields[outerProp].hasOwnProperty(middleProp)) {
                        if (!settingsFields[outerProp][middleProp].type) {
                            firstInner = true;
                            //all the items in the subsection
                            for (innerProp in settingsFields[outerProp][middleProp]) {
                                if (settingsFields[outerProp][middleProp].hasOwnProperty(innerProp) && innerProp !== 'isSection') {
                                    fields[innerProp] = settingsFields[outerProp][middleProp][innerProp];
                                    //first item has to have the subsection description
                                    if (firstInner) {
                                        fields[innerProp].section = [undefined, middleProp];
                                        firstInner = false;
                                    }
                                    //or both section/subsection description if there has been no item with no subsection
                                    if (firstMiddle) {
                                        firstMiddle = false;
                                        fields[innerProp].section = [outerProp, middleProp];
                                    }
                                } //has property
                            } //items in subsection
                        } //is no section
                    } //has property
                } //subsections
            } //is section
        } //has property
    } //sections

    GM_config.init({
        'id': 'GM_config',
        'title': '<div style="height:50px";><img src="http://i.imgur.com/f3vYHNN.png" style="float:left;" height="50"/> <p style="margin:inherit;">InstaSynch Addon Settings</p><a style="margin:inherit; color:white;" href="https://github.com/BibbyTube/Instasynch-Addons/releases" target="_blank">{0}</a></div>'.format(version),
        'fields': fields,
        'events': {
            'open': function (args) {
                //load GM_config css
                $('#GM_config').each(function () {
                    //context of the iframe
                    $('head', this.contentWindow.document || this.contentDocument).append(
                        $('<link>', {
                            type: 'text/css',
                            rel: 'stylesheet',
                            'href': 'https://cdn.rawgit.com/BibbyTube/Instasynch-Addons/443e8fb54911bb69401cf8071f4a70096c6c128f/General%20Additions/Settings%20Loader/GMconfig.css'
                        })
                    );
                });
                $('#GM_config').css('height', '90%').css('top', '55px').css('left', '5px').css('width', '375px');
                //collapse all items in the section
                $('#GM_config').each(function () {
                    $('#GM_config .section_header', this.contentWindow.document || this.contentDocument).click(function () {
                        $(this).nextUntil().slideToggle(250);
                    });
                });
                //collapse all items in the subsection
                $('#GM_config').each(function () {
                    $('#GM_config .section_desc', this.contentWindow.document || this.contentDocument).click(function () {
                        $(this).nextUntil('#GM_config .section_desc').slideToggle(250);
                    });
                });
                //Add a "save and close" button
                $('#GM_config').each(function () {
                    var saveAndCloseButton = $('#GM_config_closeBtn', this.contentWindow.document || this.contentDocument).clone(false);
                    saveAndCloseButton.attr({
                        id: 'GM_config_save_closeBtn',
                        title: 'Save and close window'
                    }).text("Save and Close").click(function () {
                        saveSettings(true);
                    });

                    $('#GM_config_buttons_holder > :last-child', this.contentWindow.document || this.contentDocument).before(saveAndCloseButton);
                });

                events.fire('onSettingsOpen');
            },
            'save': function (args) {
                events.fire('onSettingsSave');
            },
            'reset': function (args) {
                events.fire('onSettingsReset');
            },
            'close': function (args) {
                events.fire('onSettingsClose');
            },
            'change': function (args) {
                //fire an event for each setting that changed
                for (var setting in args) {
                    if (args.hasOwnProperty(setting)) {
                        events.fire('onSettingChange[{0}]'.format(setting), [args[setting].old, args[setting].new]);
                    }
                }
            }

        }
    });
    events.bind('onSettingsSaveInternal', function (data) {
        GM_config.save();
        if (data.close) {
            GM_config.close();
        }
    });
}

function saveSettings(close) {
    "use strict";
    //post message to site and catch in the script scope fix for #21
    window.postMessage(JSON.stringify({
        action: 'onSettingsSaveInternal',
        data: {
            close: close
        }
    }), "*");
}
//----------------- end settingsLoader.js -----------------
//----------------- start themes.js -----------------
setField({
    'name': 'Theme',
    'data': {
        'label': '<a style="color:white;" href="https://github.com/BibbyTube/Instasynch-Addons/tree/master/General%20Additions/Themes" target="_blank">Theme</a>',
        'type': 'select',
        'options': ['default', 'black'],
        'default': 'default'
    },
    'section': 'General Additions',
    'subsection': 'Themes'
});
setField({
    'name': 'CustomCSS',
    'data': {
        'label': 'Custom CSS url',
        'type': 'text',
        'default': ''
    },
    'section': 'General Additions',
    'subsection': 'Themes'
});
setField({
    'name': 'CustomCSSMode',
    'data': {
        'label': 'Custom CSS mode',
        'type': 'radio',
        'options': ['append', 'replace'],
        'default': 'append'
    },
    'section': 'General Additions',
    'subsection': 'Themes'
});

function loadThemesOnce() {
    "use strict";
    var i,
        themes = [{
            'name': 'defaultTheme',
            'url': 'https://cdn.rawgit.com/BibbyTube/Instasynch-Addons/955d3e178d6b83135479d9d319d2a47f70c254fe/General%20Additions/Themes/defaultTheme.css'
        }, {
            'name': 'blackTheme',
            'url': 'https://cdn.rawgit.com/BibbyTube/Instasynch-Addons/195f22c16bbf53ecd545a0843b6f7ad380d76799/General%20Additions/Themes/black.css'
        }];

    for (i = 0; i < themes.length; i += 1) {
        themes[i].id = 'theme';
        cssLoader.add(themes[i]);
    }

    $('head').append(
        $('<link>', {
            type: 'text/css',
            rel: 'stylesheet',
            id: 'theme-append'
        })
    );

    //change the theme when one of the settings get changed
    events.bind('onSettingChange[Theme]', applyThemes);
    events.bind('onSettingChange[CustomCSS]', applyThemes);
    events.bind('onSettingChange[CustomCSSMode]', applyThemes);

    applyThemes();
}

function applyThemes() {
    "use strict";
    //reset
    $('#theme').attr('href', '');
    $('#theme-append').attr('href', '');

    /*jshint newcap: false */
    if (GM_config.get('CustomCSS') === '') {
        //use theme from the theme chooser
        cssLoader.load('{0}Theme'.format(GM_config.get('Theme')));
    } else {
        //add theme from theme chooser in append mode
        if (GM_config.get('CustomCSSMode') === 'append') {
            cssLoader.load('{0}Theme'.format(GM_config.get('Theme')));
        }
        //add the custom css url
        $('#theme-append').attr('href', GM_config.get('CustomCSS'));
    }
    /*jshint newcap: true */
}
//----------------- end themes.js -----------------
//----------------- start youtubeSearch.js -----------------
function loadYoutbeSearchOnce() {
    "use strict";

    //set up the template for a search result
    searchResultTemplate = $('<a>', {
        'target': '_blank'
    }).append(
        $('<img>').addClass('search-result-thumbnail')
    ).append(
        $('<p>').append(
            $('<span>').addClass('text-shadow')
        ).addClass('search-result-duration')
    ).append(
        $('<div>').append(
            $('<div>', {
                'class': 'controlIcon',
                'title': 'Add Video'
            }).append(
                $('<div>').css('background-image', 'url(http://i.imgur.com/Fv1wJk5.png)').addClass('animationContainer')
            ).addClass('search-result-add')
        ).append(
            $('<span>').addClass('text-shadow').addClass('search-result-title')
        ).addClass('opacity0').addClass('search-result-inf')
    ).addClass('search-result');
}

function loadYoutubeSearch() {
    "use strict";
    //insert search result container
    $('.poll-container').before(
        $('<div>', {
            'id': 'search-results'
        }).append(
            $('<div>', {
                'id': 'divmore'
            }).append(
                $('<input>', {
                    'id': 'prevButton'
                }).prop('disabled', true).prop('type', 'button').val('<< Prev').click(prevPage)
            ).append(
                $('<input>', {
                    'id': 'nextButton'
                }).prop('disabled', true).prop('type', 'button').val('Next >>').click(nextPage)
            )
        ).append(
            $('<div>', {
                'id': 'divclosesearch'
            }).addClass('x').click(closeResults)
        )
    );

    //Listen for key events on the add video input
    $("#URLinput").bind("keydown", function (event) {
        if (event.keyCode === $.ui.keyCode.ESCAPE) {
            closeResults();
        } else {
            //restart timeout when typing faster than half a second per key
            if (searchTimeout) {
                clearInterval(searchTimeout);
            }
            searchTimeout = setTimeout(startSearch, 500);
        }
    });
}

function startSearch() {
    "use strict";
    searchTimeout = null;
    closeResults();
    searchFirst();
}

function searchFirst() {
    "use strict";

    //get the query
    query = $("#URLinput").val();
    if (query && query !== "") {
        //parse it to check if it is a playlist later
        urlInfo = urlParser.parse(query);
        //reset variables
        entriesHistory = [];
        page = 0;
        $('#divmore').css('display', 'block');
        //start searching
        search(0, true, true);
    }
}

function prevPage() {
    "use strict";
    //go back one page if possible
    page -= 1;
    showResults(entriesHistory[page], page !== 0);
    $('#nextButton').prop('disabled', false);
}

function nextPage() {
    "use strict";
    //go forward one page and load more results when they have not been
    //loaded yet
    page += 1;
    showResults(entriesHistory[page], true);
    if (page === entriesHistory.length - 1) {
        if (entriesHistory[page].length === 9) {
            search((page + 1) * 9, false, false);
        }
    } else {
        $('#nextButton').prop('disabled', false);
    }
}

function search(startIndex, show, nextResults) {
    "use strict";
    startIndex = startIndex + 1;
    var entries,
        url,
        prevButtonActive = startIndex !== 1;
    if (!urlInfo) {
        url = "https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&format=5&max-results=9&q={0}&start-index={1}&safeSearch=none".format(query, startIndex);
    } else { // is a link
        if (urlInfo.playlistId) {
            url = "https://gdata.youtube.com/feeds/api/playlists/{0}?v=2&alt=json&max-results=9&start-index={1}&safeSearch=none".format(urlInfo.playlistId, startIndex);
        }
    }
    if (!url) {
        return;
    }
    $.getJSON(url, function (data) {
        //load up the results
        entries = data.feed.entry;
        if (entries && entries.length !== 0) {

            //add entries to history
            entriesHistory.push(entries);

            //show the results (or just store them if the next page gets preloaded)
            if (show) {
                showResults(entries, prevButtonActive);
            }

            //enable next button
            $('#nextButton').prop('disabled', false);

            //preload the next page but don't preload the page after that
            if (nextResults) {
                search(startIndex + 9, false, false);
            }
        } else {
            //disable next button when there are no results
            $('#nextButton').prop('disabled', true);
        }
    });
}

function showResults(entries, prevButtonActive) {
    "use strict";

    //reset results
    $('#prevButton').prop('disabled', !prevButtonActive);
    $('#nextButton').prop('disabled', true);
    $('.search-result').remove();
    $('#search-results').css('display', 'initial');

    var i;

    //fill up with empty results when we got less than 9
    for (i = 0; i < 9 - entries.length; i += 1) {
        $('#search-results').prepend(
            $('<div>').css('cursor', 'default').addClass('search-result')
        );
    }

    //add the entries
    for (i = entries.length - 1; i >= 0; i -= 1) {
        addEntry(entries[i]);
    }

}

function addEntry(entry) {
    "use strict";
    //copy the template and fill it with values
    var seconds,
        searchResult = searchResultTemplate.clone(false);

    if (entry.media$group.media$thumbnail === undefined) { //video got removed
        $('#search-results').prepend(
            $('<div>', {
                'class': 'search-result'
            }).text('Video Remove By Youtube').addClass('search-result').css('cursor', 'default')
        );
    } else {
        seconds = entry.media$group.yt$duration.seconds;

        //video url
        searchResult.attr('href', urlParser.create(urlParser.parse(entry.link[1].href))).hover(toggleElements, toggleElements);
        //thumbnails
        searchResult.find('>:eq(0)').attr('src', entry.media$group.media$thumbnail[0].url);
        //duration
        searchResult.find('>:eq(1)>:eq(0)').text(formatTime(seconds)).css('color', getDurationColor(seconds));
        //title
        searchResult.find('>:eq(2)>:eq(1)').text(entry.title.$t);
        //add button
        if (GM_config.get('button-animations')) {
            searchResult.find('>:eq(2)>:eq(0)').hover(function () {
                addAnimation($(this).children().eq(0), 'pulse');
            }, function () {
                removeAnimation($(this).children().eq(0), 'pulse');
            }).click(addSearchResultToPl);
        } else {
            searchResult.find('>:eq(2)>:eq(0)').click(addSearchResultToPl);
        }

        $('#search-results').prepend(searchResult);
    }
}

function getDurationColor(seconds) {
    "use strict";
    if (seconds < 60 * 15) {
        return 'white';
    }
    if (seconds < 60 * 25) {
        return 'orange';
    }
    return 'red';
}

function formatTime(seconds) {
    "use strict";
    var date = new Date(null),
        duration = '';
    date.setSeconds(seconds);
    if (date.getUTCHours() !== 0) {
        duration = date.getUTCHours() + 'h';
    }
    if ((date.getUTCMinutes() !== 0) || duration) {
        duration += date.getUTCMinutes() + 'm';
    }
    if ((date.getUTCSeconds() !== 0) || duration) {
        duration += date.getUTCSeconds() + 's';
    }
    return duration;
}

function closeResults() {
    "use strict";
    $('#search-results').css('display', 'none');
}

function toggleElements(event) {
    "use strict";
    $(event.currentTarget).find('>:eq(2)').toggleClass('opacity0');
}

function addSearchResultToPl(event) {
    "use strict";
    window.global.sendcmd('add', {
        URL: $(event.currentTarget).parent().parent().attr('href')
    });
    return false;
}
var page = 0,
    query,
    urlInfo,
    entriesHistory,
    searchResultTemplate,
    searchTimeout;

events.bind('onPreConnect', loadYoutubeSearch);
events.bind('onExecuteOnce', loadYoutbeSearchOnce);
//----------------- end youtubeSearch.js -----------------
//----------------- start mousewheelvolumecontrol.js -----------------
/*
    Copyright (C) 2014  fugXD, filtering duplicate events, scroll speed dependent volume adjustments
*/

setField({
    'name': 'MouseWheelVolumecontrol',
    'data': {
        'label': 'Mousewheel volume control of the player (no ff atm)',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions',
    'subsection': 'Volume'
});

setField({
    'name': 'Volumebar',
    'data': {
        'label': 'Volume bar when changing volume',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions',
    'subsection': 'Volume'
});

function loadMouseWheelVolumecontrolOnce() {
    "use strict";
    //prevent the site from scrolling while over the player
    function preventScroll(event) {
        if (GM_config.get('MouseWheelVolumecontrol') && mouserOverPlayer) {
            event.preventDefault();
            event.returnValue = !mouserOverPlayer;

            var currentVolumeScrollTime = new Date().getTime(),
                scrollDirection = parseFloat(event.wheelDeltaY / Math.abs(event.wheelDeltaY)); // -1 or 1 depending on direction, *1.0 forces float div

            if ((currentVolumeScrollTime - previousVolumeScrollTime) > 200) { // 'slow' scrolling
                adjustVolume(scrollDirection);
            } else if ((currentVolumeScrollTime - previousVolumeScrollTime) >= 10) {
                adjustVolume(6.66 * scrollDirection); // faster scrolling
            }
            previousVolumeScrollTime = currentVolumeScrollTime;
        }
    }
    window.onmousewheel = document.onmousewheel = preventScroll;
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', preventScroll, false);
    }

    //message origin = http: //www.youtube.com, data={"event":"infoDelivery","info":{"muted":false,"volume":0},"id":1}
    //listen to volume change on the youtube player
    events.bind('onPageMessage', function (data) {
        if (data.event && data.event === 'infoDelivery' && data.info && data.info.volume) {
            setGlobalVolume(data.info.volume);
        }
    });

    events.bind('onPlayerReady', function (oldPlayer, newPlayer) {
        if (vimeoVolumePollingIntervalId) {
            clearInterval(vimeoVolumePollingIntervalId);
            vimeoVolumePollingIntervalId = undefined;
        }
        initGlobalVolume();
        switch (newPlayer) {
        case 'vimeo':
            //since I didn't find a way to listen to volume change on the vimeo player we have to use polling here
            vimeoVolumePollingIntervalId = setInterval(function () {
                $f($('#vimeo')[0]).api('getVolume', function (vol) {
                    setGlobalVolume(vol * 100.0);
                });
            }, 500);
            break;
        }
    });
}

function loadMouseWheelVolumecontrol() {
    "use strict";
    $('<div>', {
        'id': 'volumebar-container'
    }).append(
        $('<div>', {
            'id': 'volumebar'
        }).addClass('blur5')
    ).insertBefore('#media');

    //TODO: find firefox fix, mousescroll event doesnt fire while over youtube player

    //add hover event to the player
    $('#media').hover(
        function () {
            mouserOverPlayer = true;
        },
        function () {
            mouserOverPlayer = false;
        }
    );

}

var isPlayerReady = false,
    globalVolume = 50,
    oldGlobalVolume = 50,
    mouserOverPlayer = false,
    vimeoVolumePollingIntervalId,
    previousVolumeScrollTime = new Date().getTime(), // used to measure speed of scrolling
    volumebarFadeoutTimeout;

function setGlobalVolume(val) {
    "use strict";
    oldGlobalVolume = globalVolume;
    globalVolume = val;
    if (oldGlobalVolume !== globalVolume) {
        displayVolumebar();
    }
}

function initGlobalVolume() {
    "use strict";
    if (isPlayerReady) {
        setVol(globalVolume);
    } else {
        setVol($('.video-js')[0].player.volume() * 100);
        isPlayerReady = true;
    }
}

// Increments or decrements the volume. This is to keep other code from having to know about globalVolume. Argument is desired change in volume.
function adjustVolume(deltaVolume) {
    "use strict";
    setVol(globalVolume + deltaVolume);
}

function setUpVolumebarTimeout() {
    "use strict";
    if (volumebarFadeoutTimeout) {
        clearTimeout(volumebarFadeoutTimeout);
    }
    volumebarFadeoutTimeout = setTimeout(function () {
        $('#volumebar').fadeOut("slow", function () {
            $('#volumebar').css('display', 'initial');
            $('#volumebar').css('display', 'none');
        });
    }, 500);
}

function displayVolumebar() {
    "use strict";
    if (GM_config.get('Volumebar')) {
        $('#volumebar').stop();
        $('#volumebar').css('top', playerHeight - (globalVolume / 100) * playerHeight).css('height', (globalVolume / 100) * playerHeight).css('opacity', '1').css('display', 'initial');
        setUpVolumebarTimeout();
    }
}
// Set volume to specific value, argument is number 0-100
function setVol(volume) {
    "use strict";
    // clamp input value
    volume = Math.max(0, volume);
    volume = Math.min(100, volume);
    setGlobalVolume(volume);

    $('.video-js')[0].player.volume(volume / 100.0);
}

events.bind('onExecuteOnce', loadMouseWheelVolumecontrolOnce);
events.bind('onPreConnect', loadMouseWheelVolumecontrol);
//----------------- end mousewheelvolumecontrol.js -----------------
//----------------- start NND-Mode.js -----------------
setField({
    'name': 'NNDMode',
    'data': {
        'label': 'NicoNicoDouga-Mode(scrolling text)',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Player Additions',
    'subsection': 'NicoNicoDouga-Mode'
});
setField({
    'name': 'NNDModeEmotes',
    'data': {
        'label': 'Emotes',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions',
    'subsection': 'NicoNicoDouga-Mode'
});
setField({
    'name': 'NNDModeLimit',
    'data': {
        'label': 'Message Limit',
        'title': '-1 unlimited',
        'type': 'int',
        'min': -1,
        'default': -1,
        'size': 1
    },
    'section': 'Player Additions',
    'subsection': 'NicoNicoDouga-Mode'
});
setField({
    'name': 'NNDModeSpeed',
    'data': {
        'label': 'Speed',
        'title': '10 - 50',
        'type': 'int',
        'min': 3,
        'max': 50,
        'default': 25,
        'size': 1
    },
    'section': 'Player Additions',
    'subsection': 'NicoNicoDouga-Mode'
});
setField({
    'name': 'NNDModeFontSize',
    'data': {
        'label': 'Font-Size',
        'title': '10 - 50',
        'type': 'int',
        'min': 10,
        'max': 50,
        'default': 13,
        'size': 1
    },
    'section': 'Player Additions',
    'subsection': 'NicoNicoDouga-Mode'
});

function loadNNDModeOnce() {
    "use strict";
    events.bind('onAddMessage', function (user, message) {
        if (GM_config.get('NNDMode') && user.username !== '' && message[0] !== '$' && !$.fullscreen.isFullScreen()) {
            if (GM_config.get('NNDModeLimit') < 0 || marqueeMessages.length < GM_config.get('NNDModeLimit')) {
                addMarqueeMessage(user, message);
            }
        }
    });
}

function loadNNDMode() {
    "use strict";
    $('#media').css('position', 'relative');
    playerWidth = $('#media').width();
    playerHeight = $('#media').height();
}

var marqueeMessages = [],
    marqueeIntervalId,
    playerHeight,
    playerWidth;


function addMarqueeMessage(user, message) {
    "use strict";
    var i,
        jqueryMessage,
        top;
    message = parseMessageForNND(message);
    if (message.startsWith('/me ')) {
        message = message.substring(3);
        message = '<span class="emote">{0} {1}</span>'.format(user.username, message);
    }
    jqueryMessage = $('<div>').append(
        $('<marquee direction="left" />').append(
            $('<div/>').html(message).css('font-size', GM_config.get('NNDModeFontSize')).css('opacity', 0.65)
        ).attr('scrollamount', GM_config.get('NNDModeSpeed'))
    ).css('color', 'white').css('position', 'absolute').css('width', playerWidth).css('pointer-events', 'none').addClass('text-shadow').addClass('NND-element');

    top = (Math.random() * (playerHeight - 60));
    jqueryMessage.css('top', top + 'px');
    $('#media').append(jqueryMessage);
    marqueeMessages.push({
        message: $('#media > div:last-Child'),
        min: jqueryMessage.children().eq(0).children().eq(0).position().left
    });
    if (!marqueeIntervalId) {
        marqueeIntervalId = setInterval(function () {
            if (marqueeMessages.length === 0) {
                clearInterval(marqueeIntervalId);
                marqueeIntervalId = undefined;
            }
            for (i = 0; i < marqueeMessages.length; i += 1) {
                marqueeMessages[i].min = Math.min(marqueeMessages[i].min, marqueeMessages[i].message.children().eq(0).children().eq(0).position().left);
                if (marqueeMessages[i].message.children().eq(0).children().eq(0).position().left > marqueeMessages[i].min) {
                    marqueeMessages[i].message.remove();
                    marqueeMessages.splice(i, 1);
                    i -= 1;
                }
            }

        }, 50);
    }
}

function parseMessageForNND(message) {
    "use strict";
    var match = message.match(/^((?:\[[^\]]*\])*)\/([^\[ ]+)((?:\[[^\]]*\])*)/i),
        word,
        emoteFound = false,
        greentext,
        emote,
        words,
        i,
        excludeTags = {
            '\\[rmarquee\\]': '<marquee>', //move text to right
            '\\[/rmarquee\\]': '</marquee>',
            '\\[alt\\]': '<marquee behavior="alternate" direction="right">', //alternate between left and right
            '\\[/alt\\]': '</marquee>',
            '\\[falt\\]': '<marquee behavior="alternate" scrollamount="50" direction="right">', //different speeds etc.
            '\\[/falt\\]': '</marquee>',
            '\\[marquee\\]': '<marquee direction="right">',
            '\\[/marquee\\]': '</marquee>',
            '\\[rsanic\\]': '<MARQUEE behavior="scroll" direction="left" width="100%" scrollamount="50">',
            '\\[/rsanic\\]': '</marquee>',
            '\\[sanic\\]': '<MARQUEE behavior="scroll" direction="right" width="100%" scrollamount="50">',
            '\\[/sanic\\]': '</marquee>'
        };
    if (message.startsWith('/me ')) {
        return message;
    }
    if (match) {
        if (window.$codes.hasOwnProperty(match[2].toLowerCase())) {
            emoteFound = true;
            emote = window.$codes[match[2].toLowerCase()];
            if (GM_config.get('NNDModeEmotes')) {
                message = "{0}{1}{2}".format(match[1], emote, match[3]);
            } else {
                message = "{0}/{1}{2}".format(match[1], match[2].toLowerCase(), match[3]);
            }
        }
    } else {
        greentext = false;
        //if the text matches [tag]>* or >*
        if (message.match(/^(?:(?:\[[^\]]*\])*)(?:(?:&gt;)|>)/)) {
            greentext = true;
        } else {
            //split up the message and add hashtag colors #SWAG #YOLO
            words = message.split(" ");
            for (i = 0; i < words.length; i += 1) {
                if (words[i][0] === "#") {
                    words[i] = "<span class='cm hashtext'>{0}</span>".format(words[i]);
                }
            }
            //join the message back together
            message = words.join(" ");
        }
        message = "<span class='cm{0}'>{1}</span>".format(greentext ? ' greentext' : '', message);
    }
    for (word in filteredwords) {
        if (filteredwords.hasOwnProperty(word)) {
            message = message.replace(new RegExp(word, 'g'), filteredwords[word]);
        }
    }

    function parseAdvancedTags(match, $0, $1) {
        var ret = '',
            str,
            current = new Date(),
            previous = new Date("6.6.2000");
        switch (word) {
        case 'hexcolor':
            if($0 !== undefined){
                $0 = 'background-';
            }else{
                $0 = '';
            }
            if ($1 === '#7882BF') {
                $1 = '#000000';
            }
            str = '<span style="{0}color:{1}">';
            break;
        case 'spoiler':
            str = '[spoiler]{0}[/]';
            break;
        case 'happyBirthdayJPB':
            //is it jpbs birthday
            if (previous.getMonth() === current.getMonth() && previous.getDate() === current.getDate()) {
                return '';
            }
            return match;
        default:
            str = '';
            break;
        }
        ret = str.format($0, $1);
        return GM_config.get('Tags') ? ret : '';
    }

    //filter advancedTags
    for (word in advancedTags) {
        if (advancedTags.hasOwnProperty(word)) {
            message = message.replace(advancedTags[word], parseAdvancedTags);
        }
    }

    //exclude tags
    for (word in excludeTags) {
        if (excludeTags.hasOwnProperty(word)) {
            message = message.replace(new RegExp(word, 'gi'), '');
        }
    }
    //text in spoilers will be black
    message = message.replace(/\[spoiler\]/gi, "<span style=\"background-color: #000;color:black;\" onmouseover=\"this.style.backgroundColor='#FFF';\" onmouseout=\"this.style.backgroundColor='#000';\">");

    function parseTags() {
        return GM_config.get('Tags') ? tags[word] : '';
    }
    //filter tags
    for (word in tags) {
        if (tags.hasOwnProperty(word) && word !== '\\[spoiler\\]') {
            message = message.replace(new RegExp(word, 'gi'), parseTags);
        }
    }
    if (emoteFound) {
        message = message.replace(/\[[^\]]*\]/g, '');
    }
    return message;
}

events.bind('onExecuteOnce', loadNNDModeOnce);
events.bind('onPreConnect', loadNNDMode);
//----------------- end NND-Mode.js -----------------
//----------------- start progressBar.js -----------------
setField({
    'name': 'ProgressBar',
    'data': {
        'label': 'Progress Bar above the Player',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions'
});

function loadProgressbarOnce() {
    "use strict";
    var maxTime = 0,
        progressbarInterval;

    events.bind('onSettingChange[ProgressBar]', function () {
        $("#progressbar-container").css('display', GM_config.get('ProgressBar') ? 'flex' : 'none');
    });

    function setUpInterval() {
        return setInterval(function () {
            time = videojs().player.currentTime();
            $("#progressbar").css('width', (time / maxTime) * playerWidth);
        }, 200);
    }
    events.bind('onPlayVideo', function (vidinfo, time, playing, indexOfVid) {
        maxTime = window.playlist[indexOfVid].duration;
        $("#progressbar").css('width', '0px');
    });
    events.bind('onPlayerReady', function (oldPlayer, newPlayer) {
        progressbarInterval = setUpInterval();
    });

    function clearProgressbarInterval() {
        if (progressbarInterval) {
            clearInterval(progressbarInterval);
            progressbarInterval = undefined;
        }
    }
    events.bind('onPlayerChange', clearProgressbarInterval);
    events.bind('onPlayerDestroy', clearProgressbarInterval);
    events.bind('onDisconnect', clearProgressbarInterval);
    events.bind('onRoomChange', clearProgressbarInterval);
}

function loadProgressbar() {
    "use strict";
    $('.stage').prepend(
        $('<div>', {
            'id': 'progressbar-container'
        }).append(
            $('<hr>', {
                'id': 'progressbar'
            }).addClass('blur5')
        ).append(
            $('<div>').addClass('mirror')
        ).css('display', GM_config.get('ProgressBar') ? 'flex' : 'none')
    );
}

events.bind('onExecuteOnce', loadProgressbarOnce);
events.bind('onPreConnect', loadProgressbar);
//----------------- end progressBar.js -----------------
//----------------- start togglePlayer.js -----------------
setField({
    'name': 'PlayerActive',
    'data': {
        'label': 'Videoplayer active',
        'title': '\'togglePlayer command',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions'
});

function loadTogglePlayer() {
    "use strict";
    if (!GM_config.get('PlayerActive')) {
        setTimeout(togglePlayer, 3000);
    }
}

function loadTogglePlayerOnce() {
    "use strict";
    var oldPlayVideo = window.playVideo;
    //bind on change event
    events.bind('onSettingChange[PlayerActive]', togglePlayer);
    //bind command
    commands.set('regularCommands', "togglePlayer", function () {
        GM_config.set('PlayerActive', !GM_config.get('PlayerActive'));
        saveSettings();
        togglePlayer();
    }, 'Turns the embedded player on and off.');

    //overwrite playVideo to prevent playing of the next video
    window.playVideo = function (vidinfo, time, playing) {
        //keep on going as usual if the player is active
        if (GM_config.get('PlayerActive')) {
            oldPlayVideo(vidinfo, time, playing);
            return;
        }

        //only update the active video in the playlist and titlebar if the player isn't active
        var indexOfVid = window.getVideoIndex(vidinfo),
            addedby = window.playlist[indexOfVid].addedby,
            title = trimTitle(window.playlist[indexOfVid].title, 240);
        if (indexOfVid > -1) {
            $('.active').removeClass('active');
            if (GM_config.get('BigPlaylist')) {
                $($('#tablePlaylistBody').children('tr')[indexOfVid]).addClass('active');
                $('#slider').slider('option', 'max', window.playlist[indexOfVid].duration);
                $('#sliderDuration').html('/' + window.secondsToTime(window.playlist[indexOfVid].duration));
            } else {
                $($('#video-list').children('li')[indexOfVid]).addClass('active');
            }
            $('#vidTitle').html('{0}<div class=\'via\'> via {1}</div>'.format(title, addedby));
        }

    };
}

function togglePlayer() {
    "use strict";
    //Destroy or reload the player
    if (!GM_config.get('PlayerActive')) {
        $('#toggleplayer').attr('title', 'Turn player on').removeClass('toggleplayeractive').addClass('toggleplayerdisabled');
        window.video.destroy();
    } else {
        $('#toggleplayer').attr('title', 'Turn player off').addClass('toggleplayeractive').removeClass('toggleplayerdisabled');
        window.global.sendcmd('reload', null);
    }
}

events.bind('onExecuteOnce', loadTogglePlayerOnce);
events.bind('onPreConnect', loadTogglePlayer);
//----------------- end togglePlayer.js -----------------
//----------------- start YouTubeControls.js -----------------
setField({
    'name': 'YouTubeControls',
    'data': {
        'label': 'YouTube Controls',
        'title': 'Brings back old YouTube controls by default',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions'
});

function loadYouTubeControlsOnce() {
    "use strict";

    function toggleYouTubeControls() {
        window.showYTcontrols = !window.showYTcontrols;
        if (isConnected) {
            reloadPlayer();
        }
    }

    //bind on settings change event
    events.bind('onSettingChange[YouTubeControls]', toggleYouTubeControls);

    //load on the first run
    if (GM_config.get('YouTubeControls')) {
        toggleYouTubeControls();
    }
}

events.bind('onExecuteOnce', loadYouTubeControlsOnce);
//----------------- end YouTubeControls.js -----------------
//----------------- start bigPlaylist.js -----------------
/*
    Copyright (C) 2014  fugXD, Bibbytube modification
*/

setField({
    'name': 'BigPlaylist',
    'data': {
        'label': 'Big playlist with thumbnails',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Playlist Additions'
});

function loadBigPlaylist() {
    "use strict";

    if (GM_config.get('BigPlaylist')) {
        reloadPlaylistHTML();
        if (isConnected) {
            reloadPlaylist();
        }
    }
}

function loadBigPlaylistOnce() {
    "use strict";
    var oldAddVideo = window.addVideo,
        oldPlayVideo = window.playVideo,
        oldRemoveVideo = window.removeVideo,
        oldMoveVideo = window.moveVideo,
        oldPlaylist = $('#video-list').clone(true),
        oldIsLeader,
        $originals,
        $helper,
        i;

    cssLoader.add({
        'name': 'bigPlaylist',
        'url': 'https://cdn.rawgit.com/BibbyTube/Instasynch-Addons/8d83c44caf289a067fce4f3df62714e8407c6402/Playlist%20Additions/BigPlaylist/bigPlaylist.css',
        'autoload': true
    });

    events.bind('onConnect', function () {
        $('#tablePlaylistBody').empty();
    });

    function enableSortable() {
        if (GM_config.get('BigPlaylist')) {
            $("#tablePlaylistBody").sortable({
                update: function (event, ui) {
                    window.global.sendcmd('move', {
                        info: ui.item.data("info"),
                        position: ui.item.index()
                    });
                    $("#tablePlaylistBody").sortable("cancel");
                },
                start: function (event, ui) {
                    //Prevents click event from triggering when sorting videos
                    $("#tablePlaylistBody").addClass('noclick');
                },
                helper: function (e, tr) {
                    $originals = tr.children();
                    $helper = tr.clone();
                    $helper.children().each(function (index) {
                        // Set helper cell sizes to match the original sizes
                        $(this).width($originals.eq(index).width());
                    });
                    return $helper;
                },
                opacity: 0.5
            }).disableSelection();
            $("#tablePlaylistBody").sortable("enable");
        } else {
            //core.js, version 0.9.7
            $("#video-list").sortable({
                update: function (event, ui) {
                    window.global.sendcmd('move', {
                        info: ui.item.data("info"),
                        position: ui.item.index()
                    });
                    $("#video-list").sortable("cancel");
                },
                start: function (event, ui) {
                    //Prevents click event from triggering when sorting videos
                    $("#video-list").addClass('noclick');
                }

            });
            $("#video-list").sortable("enable");
        }
    }
    events.bind('onSettingChange[BigPlaylist]', function () {
        reloadPlaylistHTML(oldPlaylist);
        reloadPlaylist();
        if (window.isLeader) {
            enableSortable();
        }
    });

    events.bind('onMakeLeader', function () {
        oldIsLeader = window.isLeader;
    }, true);

    events.bind('onMakeLeader', function (userId) {
        if (GM_config.get('BigPlaylist')) {
            //InstaSynch core.js, version 0.9.7
            if (userId === window.userInfo.id) {
                enableSortable();
            } else if (oldIsLeader) {
                $("#tablePlaylistBody").sortable("disable");
            }
        }
    });


    function addBigPlaylistVideo(vidinfo) {
        window.playlist.push({
            info: vidinfo.info,
            title: vidinfo.title,
            addedby: vidinfo.addedby,
            duration: vidinfo.duration
        });

        var vidurl = urlParser.create(vidinfo.info),
            vidicon = '',
            removeBtn;

        if (vidinfo.info.provider === 'youtube') {
            vidicon = 'https://www.youtube.com/favicon.ico';
        } else if (vidinfo.info.provider === 'vimeo') {
            vidicon = 'https://vimeo.com/favicon.ico';
        } else if (vidinfo.info.provider === 'twitch' && vidinfo.info.mediaType === 'stream') {
            vidicon = ''; // no need for icon, thumbnail for twitch says 'twitch.tv'
        } else if (vidinfo.info.provider === 'dailymotion') {
            vidicon = 'https://www.dailymotion.com/favicon.ico';
        }

        removeBtn = $('<div/>', {
            'class': 'removeBtn x',
            'title': 'Remove this video.',
            'click': function () {
                window.global.sendcmd('remove', {
                    info: $(this).parent().parent().data('info')
                });
            }
        });
        $('#tablePlaylistBody').append(
            $('<tr>', {
                'data': {
                    info: vidinfo.info
                }
            }).append(
                $('<td>').append(
                    $('<a>', {
                        'href': vidurl,
                        'target': '_blank'
                    }).append(
                        $('<img>', {
                            'src': vidinfo.info.thumbnail
                        })
                    ).append( // overlay icon for youtube or vimeo, bottom right
                        $('<img>', {
                            'src': vidicon
                        })
                    )
                ).addClass('playlist-thumbnail')
            ).append(
                $('<td>', {
                    'title': vidinfo.title
                }).append(
                    $('<div>').text(trimTitle(vidinfo.title, 100))
                ).on('click', function () {
                    //InstaSynch io.js, version 0.9.7
                    if ($("#tablePlaylistBody").hasClass("noclick")) {
                        $("#tablePlaylistBody").removeClass('noclick');
                    } else {
                        if (window.isLeader) {
                            window.global.sendcmd('play', {
                                info: $(this).parent().data('info')
                            });
                        } else {
                            $('#cin').val($('#cin').val() + window.getVideoIndex($(this).parent().data('info')) + ' ');
                            $('#cin').focus();
                        }
                    }
                }).addClass('playlist-title')
            ).append(
                $('<td>').html(window.secondsToTime(vidinfo.duration) + '<br/>' + vidinfo.addedby).addClass('playlist-duration')
            ).append($('<td>')
                .append(removeBtn)
                .append($('<br>')).addClass('table-playlist-controls')
                .append($('<div/>', {
                    "class": "info",
                    "title": "More information about this video.",
                    "click": function () {
                        $(".detailed-info").fadeIn(); //to show loading spinner
                        window.getVideoInfo(vidinfo.info, function (err, data) {
                            if (err) {
                                addErrorMessage(err);
                            } else {
                                window.showVideoInfo(vidinfo.info, data);
                            }
                        });
                    }
                }))
            )
        );
        window.totalTime += vidinfo.duration;
        $('.total-videos').html(window.playlist.length + ' videos');
        $('.total-duration').html(window.secondsToTime(window.totalTime));
    }
    // override functions from InstaSynch's io.js, version 0.9.7
    // overrides addVideo, removeVideo, moveVideo and playVideo
    window.addVideo = function (vidinfo, updateScrollbar) {
        if (!GM_config.get('BigPlaylist')) {
            oldAddVideo(vidinfo);
        } else {
            addBigPlaylistVideo(vidinfo);
        }
        refreshPlaylistScrollbar(updateScrollbar);
    };

    window.removeVideo = function (vidinfo, updateScrollbar) {
        var indexOfVid = window.getVideoIndex(vidinfo);
        if (!GM_config.get('BigPlaylist')) {
            oldRemoveVideo(vidinfo);
        } else {
            if (indexOfVid > -1 && indexOfVid < window.playlist.length) {
                window.totalTime -= window.playlist[indexOfVid].duration;
                window.playlist.splice(indexOfVid, 1);
                $($('#tablePlaylistBody').children('tr')[indexOfVid]).remove();
            }
            $('.total-videos').html(window.playlist.length + ' videos');
            $('.total-duration').html(window.secondsToTime(window.totalTime));
        }
        refreshPlaylistScrollbar(updateScrollbar);
    };

    window.moveVideo = function (vidinfo, position) {
        if (!GM_config.get('BigPlaylist')) {
            oldMoveVideo(vidinfo, position);
        } else {
            var indexOfVid = window.getVideoIndex(vidinfo),
                playlistElements,
                k;
            if (indexOfVid > -1) {
                window.playlist.move(indexOfVid, position);
                playlistElements = $('#tablePlaylistBody tr').clone(true);
                playlistElements.move = function (old_index, new_index) {
                    if (new_index >= this.length) {
                        k = new_index - this.length;
                        while ((k -= 1) + 1) {
                            this.push(undefined);
                        }
                    }
                    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
                };
                playlistElements.move(indexOfVid, position);
                $('#tablePlaylistBody').empty();
                $('#tablePlaylistBody').html(playlistElements);
            }
        }
    };

    window.playVideo = function (vidinfo, time, playing) {
        if (!GM_config.get('BigPlaylist')) {
            oldPlayVideo(vidinfo, time, playing);
        } else {
            var addedby = '',
                title = '',
                indexOfVid = window.getVideoIndex(vidinfo);
            if (indexOfVid > -1) {
                title = trimTitle(window.playlist[indexOfVid].title, 240);
                addedby = window.playlist[indexOfVid].addedby;
                $('.active').removeClass('active');
                $($('#tablePlaylistBody').children('tr')[indexOfVid]).addClass('active');
                $('#vidTitle').html(title + '<div class="via"> via ' + addedby + '</div>');
                window.video.play(vidinfo, time, playing);
                $('#slider').slider('option', 'max', window.playlist[indexOfVid].duration);
                $('#sliderDuration').html('/' + window.secondsToTime(window.playlist[indexOfVid].duration));
            }
        }
    };
}

function refreshPlaylistScrollbar(updateScrollbar) {
    "use strict";
    if (!updateScrollbar) {
        return;
    }
    $("#videos").data("jsp").reinitialise(); //this uses alot of resources
}

function reloadPlaylistHTML(oldPlaylist) {
    "use strict";
    if (!GM_config.get('BigPlaylist')) {
        $('#tablePlaylist').replaceWith(oldPlaylist);
    } else {
        // change window.playlist to table based
        $('#video-list').replaceWith(
            $('<table>', {
                'id': 'tablePlaylist'
            }).append(
                $('<tbody>', {
                    'id': 'tablePlaylistBody'
                })
            )
        );
    }
}

function reloadPlaylist(activeIndex) {
    "use strict";
    wallCounterActive = false;
    window.loadPlaylist($.extend(true, [], window.playlist));
    wallCounterActive = true;
    window.global.sendcmd('reload', null);
}

function trimTitle(title, length) {
    "use strict";
    if (title.length > length) {
        title = title.substring(0, length) + "...";
    }
    return title;
}
//----------------- end bigPlaylist.js -----------------
//----------------- start ExportPlaylistCommand.js -----------------
function loadExportPlaylist() {
    "use strict";
    commands.set('regularCommands', "exportPlaylist ", exportPlaylist, 'Exports the playlist to the clipboard. Optional Parameters: title duration addedby thumbnail all xml');
}


function exportPlaylist(params) {
    "use strict";
    var rawOutput = '',
        xmlOutput = $('<playlist>'),
        videoxml = '',
        i = 0,
        options = 1,
        line = '',
        xml = false;
    /*jshint bitwise: false*/
    for (i = 1; i < params.length; i += 1) {
        switch (params[i].toLowerCase()) {
        case 'title':
            options = options | 2;
            break;
        case 'duration':
            options = options | 4;
            break;
        case 'addedby':
            options = options | 8;
            break;
        case 'thumbnail':
            options = options | 16;
            break;
        case 'all':
            options = options | 31;
            break;
        case 'xml':
            xml = true;
            break;
        }
    }

    for (i = 0; i < window.playlist.length; i += 1) {
        line = '';
        videoxml = $('<video>');
        line += urlParser.create(window.playlist[i].info);
        videoxml.append($('<url>').text(line));
        if ((options & 2) !== 0) { //title
            line += " " + window.playlist[i].title;
            videoxml.append($('<title>').text(window.playlist[i].title));
        }
        if ((options & 4) !== 0) { //duration
            line += " " + window.playlist[i].duration;
            videoxml.append($('<duration>').text(window.playlist[i].duration));
        }
        if ((options & 8) !== 0) { //addedby
            line += " " + window.playlist[i].addedby;
            videoxml.append($('<addedby>').text(window.playlist[i].addedby));
        }
        if ((options & 16) !== 0) { //thumbnail
            line += " " + window.playlist[i].info.thumbnail;
            videoxml.append($('<thumbnail>').text(window.playlist[i].info.thumbnail));
        }
        xmlOutput.append(videoxml);
        rawOutput += line + '\n';
    }
    /*jshint bitwise: true*/
    if (xml) {
        rawOutput = $('<div>').append(xmlOutput.clone()).remove().html();
        //format the xml
        rawOutput = rawOutput.replace(/(<\/?video>)/g, '\n\t$1');
        rawOutput = rawOutput.replace(/((<url>)|(<title>)|(<addedby>)|(<duration>)|(<thumbnail>))/g, '\n\t\t$1');
        rawOutput = rawOutput.replace(/(<\/playlist>)/g, '\n$1');
    }

    /*jshint newcap: false */
    GM_setClipboard(rawOutput, 'text');
    /*jshint newcap: true */
    addSystemMessage('Playlist has been copied to the clipboard');
}

events.bind('onExecuteOnce', loadExportPlaylist);
//----------------- end ExportPlaylistCommand.js -----------------
//----------------- start History.js -----------------
function loadHistory() {
    "use strict";
    commands.set('regularCommands', "history", printHistory, 'Shows the last 9 played videos on the YoutubeSearch panel.');
    events.bind('onPlayVideo', function (vidinfo, time, playing, indexOfVid) {
        //Keep the last 9 videos
        if (history.length === 9) {
            history.pop();
        }
        if (history[history.length - 1] !== window.playlist[indexOfVid]) {
            var video = window.playlist[indexOfVid];
            //save as youtube query result (see youtubeSearch.js)
            history.splice(0, 0, {
                media$group: {
                    media$thumbnail: [{
                        url: video.info.thumbnail
                    }],
                    yt$duration: {
                        seconds: video.duration
                    }
                },
                title: {
                    $t: video.title
                },
                link: [{}, {
                    href: urlParser.create(video.info)
                }]
            });
        }
    });
}

function printHistory() {
    "use strict";
    $('#divmore').css('display', 'none');
    showResults(history);
}

var history = [];

events.bind('onExecuteOnce', loadHistory);
//----------------- end History.js -----------------
//----------------- start timeTo.js -----------------
function loadTimeTo() {
    "use strict";

    //recalctulate the times till the videos get played when playing, moving and removing a video
    events.bind('onPlayVideo', setupTimeTo);
    events.bind('onMoveVideo', setupTimeTo);
    events.bind('onRemoveVideo', function (vidinfo, indexOfVid) {
        if (indexOfVid > getActiveVideoIndex()) {
            setupTimeTo();
        }
    });
    //only calculate time for the last video
    events.bind('onAddVideo', function (vidinfo, updateScrollbar) {
        if (!updateScrollbar) {
            return;
        }
        var timeTo = 0,
            selector = '#video-list',
            i;
        if (GM_config.get('BigPlaylist')) {
            selector = '#tablePlaylistBody';
        }
        //subtract all the videos that have already been played
        timeTo = window.totalTime - vidinfo.duration;
        for (i = 0; i < getActiveVideoIndex(); i += 1) {
            timeTo -= window.playlist[i].duration;
        }
        $(selector + ' > :last-child').attr('title', '{0} until this video gets played.'.format(window.secondsToTime(timeTo)));
    });

}

function setupTimeTo() {
    "use strict";

    if (!window.playlist) {
        return;
    }

    var timeTo = 0,
        i,
        selector = '#video-list';

    if (GM_config.get('BigPlaylist')) {
        selector = '#tablePlaylistBody';
    }
    //set all videos to 00:00 that are in front of the active video
    for (i = 0; i <= getActiveVideoIndex(); i += 1) {
        $(selector).children().eq(i).attr('title', '[00:00] until this video gets played.');
    }
    //add up times from previous vids and set the time 
    for (i -= 1; i < window.playlist.length - 1 && i >= 0; i += 1) {
        timeTo += window.playlist[i].duration;
        $(selector).children().eq(i + 1).attr('title', '{0} until this video gets played.'.format(window.secondsToTime(timeTo)));
    }
}

events.bind("onExecuteOnce", loadTimeTo);
//----------------- end timeTo.js -----------------
//----------------- start wallcounter.js -----------------
function loadWallCounterOnce() {
    "use strict";

    var oldAddMessage = window.addMessage;

    //add commands
    commands.set('regularCommands', "printWallCounter", printWallCounter, 'Prints the length of the walls for each user.');
    commands.set('regularCommands', "printMyWallCounter", printMyWallCounter, 'Prints the length of your own wall.');

    window.addMessage = function (user, message, extraStyles) {
        if (!(user.username === '' && message === 'Video added successfully.')) {
            oldAddMessage(user, message, extraStyles);
        }
    };

}

function checkWallCounter(vidinfo) {
    if (!wallCounterActive) {
        return;
    }
    resetWallCounter();
    var value = wallCounter[vidinfo.addedby];

    if (vidinfo.addedby === thisUsername) {
        if (value >= 3600 && isBibbyRoom()) {
            addErrorMessage('Video added successfully. [{0}]'.format(window.secondsToTime(value)));
        } else {
            addSystemMessage('Video added successfully. [{0}]'.format(window.secondsToTime(value)));
        }
    } else if (value >= 3600 && isBibbyRoom()) {
        addErrorMessage('{0} wall: [{1}]'.format(vidinfo.addedby, window.secondsToTime(value)));
    }
}

function loadWallCounter() {
    events.once('onAddVideo', checkWallCounter);
    events.unbind('onPostConnect', loadWallCounter);
}
var wallCounter = {},
    wallCounterActive = true;

function resetWallCounter() {
    "use strict";
    var video,
        value,
        i;
    wallCounter = {};
    for (i = 0; i < window.playlist.length; i += 1) {
        video = window.playlist[i];
        value = wallCounter[video.addedby];
        value = (value || 0) + video.duration;
        wallCounter[video.addedby] = value;
    }
}

function printWallCounter() {
    "use strict";
    resetWallCounter();
    var output = "",
        key,
        strTemp;
    for (key in wallCounter) {
        if (wallCounter.hasOwnProperty(key)) {
            strTemp = '[{0}: {1}]';
            if (wallCounter[key] > 3600) {
                strTemp = "<span style='color:red'>" + strTemp + "</span>";
            }
            output += strTemp.format(key, window.secondsToTime(wallCounter[key]));
        }
    }
    addSystemMessage(output);
}

function printMyWallCounter() {
    "use strict";
    resetWallCounter();
    var output = "",
        timeToWall = 0,
        i;
    for (i = Math.max(getActiveVideoIndex(), 0); i < window.playlist.length; i += 1) {
        if (window.playlist[i].addedby.toLowerCase() === thisUsername.toLowerCase()) {
            break;
        }
        timeToWall += window.playlist[i].duration;
    }
    output = '[{0}: {1}], {2} till your videos play.'.format(thisUsername, window.secondsToTime(wallCounter[thisUsername] || 0), window.secondsToTime(timeToWall));
    addSystemMessage(output);
}

events.bind('onResetVariables', function () {
    "use strict";
    wallCounter = {};
    events.unbind('onAddVideo', checkWallCounter);
    events.once('onPostConnect', loadWallCounter);
});
events.bind('onExecuteOnce', loadWallCounterOnce);
//----------------- end wallcounter.js -----------------
//----------------- start deployFooter.js -----------------
window.addEventListener('load', function () {
    "use strict";

    function loadStuff() {
        //are we in a room or on the frontpage
        if (window.global.page.name === 'room') {
            //reset variables
            events.fire('onResetVariables');
            //we are not connected yet
            events.fire('onPreConnect');
            //these need to be executed last
            events.once('onPostConnect', loadAutoComplete);
            events.once('onPostConnect', setPlayerDimension);

            //if the script was loading slow and we are already connected
            //fire the event
            if (isConnected) {
                postConnect();
            } else {
                //otherwise wait for userlist event
                events.once('onUserlist', postConnect);
            }
            if (!GM_config.get('ModSpy')) {
                addSystemMessage('Script {0} loaded.'.format(version));
            }
            window.console.log('Script {0} loaded.'.format(version));
        }
    }
    //these need to be executed last
    events.bind('onExecuteOnce', loadEventsOnce);
    //execute one time only scripts
    events.fire('onExecuteOnce');
    //load the scripts
    loadStuff();
    //reload the scripts when changing a room
    events.bind('onRoomChange', loadStuff);

}, false);
//----------------- end deployFooter.js -----------------