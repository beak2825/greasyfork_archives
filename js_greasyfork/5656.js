// ==UserScript==
// @name          WaniKani Lesson User Synonyms
// @namespace     https://www.wanikani.com
// @description   adds User Synonyms to the lesson page. adds User Synonyms and Notes to unlearned item pages.
// @version       0.1.2
// @include       https://www.wanikani.com/lesson/session
// @include       https://www.wanikani.com/*radicals/*
// @include       https://www.wanikani.com/*kanji/*
// @include       https://www.wanikani.com/*vocabulary/*
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/5656/WaniKani%20Lesson%20User%20Synonyms.user.js
// @updateURL https://update.greasyfork.org/scripts/5656/WaniKani%20Lesson%20User%20Synonyms.meta.js
// ==/UserScript==

/*jslint browser: true, plusplus: true*/
/*global $, console, Notes */

/*
A large portion of this code has been extracted from the WaniKani Review page.
It has been reformatted for improved readability and slightly edited.
Synonyms and notes cannot be read from the WK server until lesson quiz completion, so they are stored in jStorage.
Entries should be auto-deleted from jStorage after lesson quiz completion as they can then be retrieved from the WK server.
jStorage keys need an expiration TTL so they are auto-deleted if they are lost track of.
For example if you make a User Synonym and then complete the lesson on another browser or computer it would not be deleted on completion.
The TTL is set to renew on viewing as well as changing Notes and User Synonyms.
With the default set below data will be deleted after 180-days of not looking at it.
It will still exist on the WK server, but will be invisible until after lesson quiz completion.
jStorage has a ~5MB size limit for WK on chrome and firefox
If you really want to disable TTL for this UserScript, set keyTTL=0
*/

(function () {
    'use strict';

    var managedNotes = [], UserSynonyms = {},
        keyTTL = 180 * 24 * 60 * 60 * 1000; // expire 180-days after last read

    function addManagedNote(key) {
        managedNotes = $.grep(managedNotes, function (item) {
            return item !== key;
        });
        managedNotes.push(key);
    }
    function flushManagedNotes() {
        managedNotes = [];
    }
    function checkManagedNote(key) {
        return managedNotes.indexOf(key) >= 0;
    }
    function getTypeChar(item) {
        var type = 'x';
        if (item.rad) {
            type = 'r';
        } else if (item.kan) {
            type = 'k';
        } else if (item.voc) {
            type = 'v';
        }
        return type;
    }
    function getSynKeyItem(item) {
        return 'l/syn/' + getTypeChar(item) + item.id;
    }
    function getSynKey(type, id) {
        return 'l/syn/' + type.substring(0, 1) + id;
    }
    function getSynList(type, id) {
        var synKey = getSynKey(type, id);
        $.jStorage.setTTL(synKey, keyTTL); // extend TTL on read. setting TTL on non-existant keys seems fine.
        return $.jStorage.get(synKey) || [];
    }
    function getSynListItem(item) {
        var synKey = getSynKeyItem(item);
        $.jStorage.setTTL(synKey, keyTTL); // extend TTL on read. setting TTL on non-existant keys seems fine.
        return $.jStorage.get(synKey) || [];
    }
    function setSynList(type, id, syn, add) {
        var synKey, synList;
        synKey = getSynKey(type, id);
        synList = $.jStorage.get(synKey) || [];
        synList = $.grep(synList, function (item) {
            return item !== syn;
        });
        if (add) {
            synList.push(syn);
        }
        if (synList.length > 0) {
            $.jStorage.set(synKey, synList);
            $.jStorage.setTTL(synKey, keyTTL);
        } else {
            $.jStorage.deleteKey(synKey);
        }
    }
    UserSynonyms.load = function (itemType, userSynStr, itemId, element) {
        UserSynonyms.generateList(element, userSynStr);
        UserSynonyms.addOption(itemType, itemId);
        UserSynonyms.removeOption(itemType, itemId);
    };
    UserSynonyms.addOption = function (itemType, itemId) {
        var btnAdd, wrapper;
        btnAdd = $('.user-synonyms-add-btn');
        wrapper = UserSynonyms.wrapper();
        btnAdd.off('click');
        btnAdd.on('click', function () {
            var inputBtnRemove, inputBtnAdd, inputLi, inputForm, inputInput;
            $(this).hide();
            inputLi = $('<li></li>', {
                'class': 'user-synonyms-add-form'
            }).appendTo(wrapper);
            inputForm = $('<form></form>').appendTo(inputLi);
            inputInput = $('<input></input>', {
                type: 'text',
                autocapitalize: 'off',
                autocomplete: 'off',
                autocorrect: 'off'
            }).appendTo(inputForm).focus();
            inputInput.keyup(function (event) { event.stopPropagation(); }); // prevent hotkeys while typing
            inputBtnAdd = $('<button></button>', {
                type: 'submit',
                text: 'Add'
            }).appendTo(inputForm);
            inputBtnRemove = $('<button></button>', {
                type: 'button',
                html: '<i class="icon-remove"></i>'
            }).appendTo(inputForm);
            inputBtnAdd.off('click');
            inputBtnAdd.on('click', function (event) {
                var newSynText, synLiElems, newLen;
                event.preventDefault();
                event.stopPropagation();
                newSynText = inputInput.val();
                // fake accept duplicate, but don't send to server (server doesn't check?)
                if (getSynList(itemType, itemId).indexOf(newSynText.toLowerCase()) >= 0) {
                    // delay for key events to be caught
                    setTimeout(function () {
                        inputLi.remove();
                        btnAdd.show();
                    }, 100);
                    return;
                }
                synLiElems = wrapper.find('li');
                newLen = newSynText.length + synLiElems.slice(0, synLiElems.size() - 1).text().length;
                if (newLen > 255) {
                    inputBtnAdd.attr('disabled', 'disabled').text('Exceeded Synonym Limit');
                } else if (newSynText.trim().length !== 0) {
                    $.ajax({
                        type: 'POST',
                        url: '/user_synonym/create/',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            item_type: itemType,
                            item_id: itemId,
                            synonym: newSynText
                        })
                    }).success(function (data) {
                        var newSynElem;
                        setSynList(itemType, itemId, data.user_synonym, true);
                        newSynElem = $('<li></li>', {
                            text: data.user_synonym
                        });
                        wrapper.find('li:last').prev().before(newSynElem);
                        inputLi.remove();
                        btnAdd.show();
                        UserSynonyms.removeOption(itemType, itemId);
                    });
                }
            });
            inputBtnRemove.off('click');
            inputBtnRemove.on('click', function (event) {
                event.preventDefault();
                inputLi.remove();
                btnAdd.show();
            });
        });
    };
    UserSynonyms.generateList = function (element, userSynStr) {
        var wrapper, i, userSyn;
        $('.user-synonyms ul').remove();
        element.append($('<ul></ul>'));
        wrapper = UserSynonyms.wrapper();
        if (!userSynStr) {
            userSynStr = '';
        }
        userSyn = UserSynonyms.stringToArray(userSynStr);
        for (i = 0; i < userSyn.length; i++) {
            $('<li></li>', {
                text: userSyn[i],
                title: 'Click to remove synonym'
            }).appendTo(wrapper);
        }
        $('<li></li>', {
            html: '&nbsp;',
            title: 'Add your own synonym',
            'class': 'user-synonyms-add-btn'
        }).appendTo(wrapper);
    };
    UserSynonyms.removeOption = function (itemType, itemId) {
        var synElems = UserSynonyms.wrapper().find('li:not(.user-synonyms-add-btn):not(.user-synonyms-add-form)');
        synElems.off('click');
        synElems.on('click', function () {
            var clickedSynElem = $(this);
            $.ajax({
                type: 'DELETE',
                url: '/user_synonym/destroy/',
                contentType: 'application/json',
                data: JSON.stringify({
                    item_type: itemType,
                    item_id: itemId,
                    synonym: clickedSynElem.text()
                })
            }).success(function (data) {
                setSynList(itemType, itemId, data.user_synonym_destroyed, false);
                clickedSynElem.remove();
            });
        });
    };
    UserSynonyms.stringToArray = function (str) {
        if (str.length === 0) {
            return [];
        }
        return str.split(',');
    };
    UserSynonyms.wrapper = function () {
        return $('.user-synonyms ul');
    };
    // from: https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js
    function addStyle(aCss) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    }
    function loadNoteHooks() {
        var add, keyName;
        if (typeof Notes === 'object' && typeof Notes.add === 'function') {
            add = Notes.add;
            Notes.add = function (type, readMeaning, id, note, container) {
                keyName = 'l/note/' + type.substring(0, 3) + '/' + readMeaning.substring(0, 1) + '/' + id;
                addManagedNote(keyName); // add to managed list
                $.jStorage.setTTL(keyName, keyTTL); // update TTL on read
                add(type, readMeaning, id, note, container);
            };
        }
        $.jStorage.listenKeyChange('*', function (key, action) {
            // only for keys this page is managing. otherwise it messes with other tabs and extends TTL for learned items.
            if (action === 'updated' && key.substr(0, 7) === 'l/note/' && checkManagedNote(key)) {
                setTimeout(function () {
                    if ($.jStorage.get(key)) {
                        $.jStorage.setTTL(key, keyTTL); // update TTL on write
                        console.log('set TTL for key ', key);
                    } else {
                        // notes code writes empty keys if you delete a note. cleanup.
                        $.jStorage.deleteKey(key);
                        console.log('deleted empty key ', key);
                    }
                }, 1000);
            }
        });
    }
    if (document.location.pathname === '/lesson/session') {
        // this is a lesson page
        loadNoteHooks();

        // add base display elements
        $('#supplement-rad-name-mne').after('<h2>User Synonyms</h2><section class="user-synonyms user-synonyms-radical"></section>');
        $('#supplement-kan-meaning .col1 div').after('<h2>User Synonyms</h2><section class="user-synonyms user-synonyms-kanji"></section>');
        $('#supplement-voc-synonyms').after('<h2>User Synonyms</h2><section class="user-synonyms user-synonyms-vocabulary"></section>');

        // update the data when looking at different lessons
        $.jStorage.listenKeyChange('l/currentLesson', function (key, action) {
            if (action === 'updated') {
                // this listenKeyChange should always get registered before the main application's
                // so it should get called first and then Notes.add hook after to register new notes
                flushManagedNotes();
                var currentLesson = $.jStorage.get(key);
                if (currentLesson.rad) {
                    UserSynonyms.load('radical', getSynListItem(currentLesson).join(), currentLesson.id, $('.user-synonyms-radical'));
                } else if (currentLesson.kan) {
                    UserSynonyms.load('kanji', getSynListItem(currentLesson).join(), currentLesson.id, $('.user-synonyms-kanji'));
                } else if (currentLesson.voc) {
                    UserSynonyms.load('vocabulary', getSynListItem(currentLesson).join(), currentLesson.id, $('.user-synonyms-vocabulary'));
                }
            }
        });
        // copy user synonyms into the answers list for quiz
        $.jStorage.listenKeyChange('l/currentQuizItem', function (key, action) {
            if (action === 'updated') {
                var currentQuizItem = $.jStorage.get(key);
                if (!currentQuizItem.synAdded) {
                    currentQuizItem.synAdded = true;
                    currentQuizItem.en = currentQuizItem.en.concat(getSynListItem(currentQuizItem));
                    $.jStorage.set(key, currentQuizItem);
                }
            }
        });
        // watch for completed items. completed items should be safe to delete local storage...
        (function () {
            var lastCompleted = 0;
            $.jStorage.listenKeyChange('l/count/completed', function (key, action) {
                var completed, currentQuizItem, synKey;
                if (action === 'updated') {
                    completed = $.jStorage.get(key);
                    if (completed > lastCompleted) {
                        currentQuizItem = $.jStorage.get('l/currentQuizItem');
                        synKey = getSynKeyItem(currentQuizItem);
                        $.jStorage.deleteKey(synKey); // harmless to delete non-existant keys
                        // delete keys for notes
                        if (currentQuizItem.rad) {
                            $.jStorage.deleteKey('l/note/rad/m/' + currentQuizItem.id);
                        } else if (currentQuizItem.kan) {
                            $.jStorage.deleteKey('l/note/kan/m/' + currentQuizItem.id);
                            $.jStorage.deleteKey('l/note/kan/r/' + currentQuizItem.id);
                        } else if (currentQuizItem.voc) {
                            $.jStorage.deleteKey('l/note/voc/m/' + currentQuizItem.id);
                            $.jStorage.deleteKey('l/note/voc/r/' + currentQuizItem.id);
                        }
                    }
                    lastCompleted = completed;
                }
            });
        }());
        // this is style extracted from the wanikani review page
        addStyle('\n' +
            '.user-synonyms ul {\n' +
            '    margin: 0;\n' +
            '    padding: 0;\n' +
            '}\n' +
            '.user-synonyms ul li {\n' +
            '    display: inline-block;\n' +
            '    line-height: 1.5em;\n' +
            '}\n' +
            '.user-synonyms ul li:not(.user-synonyms-add-btn):not(.user-synonyms-add-form) {\n' +
            '    cursor: pointer;\n' +
            '    vertical-align: middle;\n' +
            '}\n' +
            '.user-synonyms ul li:not(.user-synonyms-add-btn):not(.user-synonyms-add-form):after {\n' +
            '    background-color: #EEEEEE;\n' +
            '    border-radius: 3px;\n' +
            '    color: #A2A2A2;\n' +
            '    content: "\\f00d";\n' +
            '    font-family: FontAwesome;\n' +
            '    font-size: 0.5em;\n' +
            '    margin-left: 0.5em;\n' +
            '    margin-right: 1.5em;\n' +
            '    padding: 0.15em 0.3em;\n' +
            '    transition: background-color 0.3s linear 0s, color 0.3s linear 0s;\n' +
            '    vertical-align: middle;\n' +
            '}\n' +
            '.user-synonyms ul li:hover:not(.user-synonyms-add-btn):not(.user-synonyms-add-form):after {\n' +
            '    background-color: #FF0033;\n' +
            '    color: #FFFFFF;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-btn {\n' +
            '    cursor: pointer;\n' +
            '    display: block;\n' +
            '    font-size: 0.75em;\n' +
            '    margin-top: 0.25em;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-btn:after {\n' +
            '    content: "";\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-btn:before {\n' +
            '    background-color: #EEEEEE;\n' +
            '    border-radius: 3px;\n' +
            '    color: #A2A2A2;\n' +
            '    content: "+ ADD SYNONYM";\n' +
            '    margin-right: 0.5em;\n' +
            '    padding: 0.15em 0.3em;\n' +
            '    transition: background-color 0.3s linear 0s, color 0.3s linear 0s;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-btn:hover:before {\n' +
            '    background-color: #A2A2A2;\n' +
            '    color: #FFFFFF;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-form {\n' +
            '    display: block;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-form form {\n' +
            '    display: block;\n' +
            '    margin: 0;\n' +
            '    padding: 0;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-form form input, .user-synonyms ul li.user-synonyms-add-form form button {\n' +
            '    line-height: 1em;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-form form input {\n' +
            '    -moz-border-bottom-colors: none;\n' +
            '    -moz-border-left-colors: none;\n' +
            '    -moz-border-right-colors: none;\n' +
            '    -moz-border-top-colors: none;\n' +
            '    border-color: -moz-use-text-color -moz-use-text-color #A2A2A2;\n' +
            '    border-image: none;\n' +
            '    border-style: none none solid;\n' +
            '    border-width: 0 0 1px;\n' +
            '    display: block;\n' +
            '    margin: 0;\n' +
            '    outline: medium none;\n' +
            '    padding: 0;\n' +
            '    width: 100%;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-form form button {\n' +
            '    background-color: #EEEEEE;\n' +
            '    border: medium none;\n' +
            '    border-radius: 3px;\n' +
            '    color: #A2A2A2;\n' +
            '    font-size: 0.75em;\n' +
            '    outline: medium none;\n' +
            '    transition: background-color 0.3s linear 0s, color 0.3s linear 0s;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-form form button:hover {\n' +
            '    background-color: #A2A2A2;\n' +
            '    color: #FFFFFF;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-form form button:disabled {\n' +
            '    background-color: #FF0000;\n' +
            '    color: #FFFFFF;\n' +
            '    cursor: default;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-form form button[type="button"] {\n' +
            '    margin-left: 0.25em;\n' +
            '    padding-left: 0.3em;\n' +
            '    padding-right: 0.3em;\n' +
            '}\n' +
            '.user-synonyms ul li.user-synonyms-add-form form button[type="button"]:hover {\n' +
            '    background-color: #FF0000;\n' +
            '    color: #FFFFFF;\n' +
            '}\n');
    } else {
        // this is an item page
        (function () { // add a hide event to jQuery's hide function
            var hide = $.fn.hide;
            $.fn.hide = function () {
                var ret = hide.apply(this, arguments);
                this.trigger('hide');
                return ret;
            };
        }());
        (function () {
            var match, itemInfo = {}, text, script = $('div script:last-of-type');
            if (script) {
                text = script.html();
                match = text.match("UserSynonyms.load\\('(.*)', (.*), (.*), (.*)\\);");
                if (match) {
                    itemInfo.type = match[1];
                    itemInfo.id = match[3];
                    itemInfo.learned = text.match('Stats for item does not exist') ? false : true;
                }
            }
            if (itemInfo && itemInfo.learned === false) {
                // this is an unlearned/lesson item
                loadNoteHooks();
                $('.user-synonyms').one('hide', function () { // trigger right after elements get hidden
                    $('#note-meaning, #note-reading, .user-synonyms').show();
                    UserSynonyms.load(itemInfo.type, getSynList(itemInfo.type, itemInfo.id).join(), itemInfo.id, $('.user-synonyms'));
                    Notes.add(itemInfo.type, 'meaning', itemInfo.id, $.jStorage.get('l/note/' + itemInfo.type.substring(0, 3) + '/m/' + itemInfo.id), $('#note-meaning'));
                    if (itemInfo.type === 'kanji' || itemInfo.type === 'vocabulary') {
                        Notes.add(itemInfo.type, 'reading', itemInfo.id, $.jStorage.get('l/note/' + itemInfo.type.substring(0, 3) + '/r/' + itemInfo.id), $('#note-reading'));
                    }
                });
                // this is a workaround for the hide event not getting triggered on chrome (due to a race condition)
                setTimeout(function () {
                    if( $('.user-synonyms').is(':hidden') ) {
                        $('.user-synonyms').trigger('hide');
                    }
                }, 100);
            }
        }());
    }
    console.log('WaniKani Lesson User Synonyms: script load end');
}());
