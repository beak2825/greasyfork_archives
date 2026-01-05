// ==UserScript==
// @name            GoogleMusicEnhancer (GME)
// @version         0.7.1
// @namespace       http://www.tobsch.org/
// @author          Tobias Schneider
// @homepage        http://www.tobsch.org/
// @licence         http://www.opensource.org/licenses/mit-license.php
// @description     Improvements and better usability for google music
//
// @include         https://play.google.com/music/listen*
//
// @require         http://code.jquery.com/jquery-2.1.3.min.js
//
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_info
//
// @downloadURL https://update.greasyfork.org/scripts/6791/GoogleMusicEnhancer%20%28GME%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6791/GoogleMusicEnhancer%20%28GME%29.meta.js
// ==/UserScript==

GM_addStyle('.lyrics-clip {background-color: #FB8521;color: #FFFFFF;font-size: 16px;height: 25px;left: -63px;margin-top: -10px;position: absolute;text-align: center;top: 47px;transform: rotate(-90deg);transform-origin: 50% 50% 0;width: 100px;}.lyrics-clip:hover {cursor: pointer;}.lyrics-panel {color: #333333;background-color: white;border: 1px solid #D1D1D1;position: fixed;right: -370px;height: 70%;width: 350px;z-index: 1000000;padding: 10px;}.lyrics-header {font-size: 16px;position: relative;min-height: 30px;width: 100%;text-align: center;border-bottom: 1px solid #D1D1D1;}.lyrics-body {color: #707070;font-size: 13px;position: relative;height: 90%;width: 100%;margin-top: 15px;padding-left: 5px;overflow-y: auto;}#lyrics-panel.clicked {right: 0;transition: 0.5s;}#lyrics-panel.un-clicked {right: -370px;transition: 0.3s;}.lyrics-not-found-text {text-align: center;}.lyrics-not-found-link {text-align: center;}.space-top {margin-top: 10px;}.update-box {z-index: 102;border: 1px solid;border-radius: 5px;font-size: 1.1em;width: 400px;height: 400px;position: absolute;top: 15%;background-color: white;}.update-body {text-align: center;}.update-header {text-align: center;}.update-header h2 {margin: 20px auto;}');

$(window).load(function () {
    'use strict';

    var persist = new Persist();
    var build = new Build();

    new Update(persist, build)
        .registerUpdateButtonEvent($('.menu-logo'))
        .check(false);

    new LyricContainer($('#main'), build)
        .registerToggler()
        .registerEvents();

    new Lyric($('#lyrics-panel'), persist)
        .registerSongChangeListener('#playerSongInfo', '#player-song-title', '#player-artist');
});

function Build() {
    'use strict';

    return {
        div: function (options) {
            return merge($('<div></div>'), options);
        },
        link: function (options) {
            return merge($('<a></a>'), options);
        }
    };

    function merge($element, options) {
        if (typeof options === 'undefined') {
            return $element.clone();
        }

        if (options.text) {
            $element.html(options.text);
        }
        if (options.attr) {
            $element.attr(options.attr);
        }
        if (options.css) {
            $element.css(options.css);
        }
        return $element.clone();
    }
}

function Lyric($panel, persist) {
    'use strict';

    if (typeof $panel === 'undefined' || typeof persist === 'undefined') {
        throw 'Panel and/or persist object undefined';
    }

    var lastSearchParameter;
    var $lyricsPanel = $panel;
    var Persist = persist;

    return {
        search: function (parameter, strategy) {
            if (typeof parameter === 'undefined' || typeof strategy !== 'object') {
                throw 'Wrong parameters or strategy object';
            }

            findBy(strategy, parameter);

            return this;
        },

        registerSongChangeListener: function (changeListenerSelector, titleSelector, artistSelector) {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            var myObserver = new MutationObserver(mutationHandler);
            myObserver.observe(document.querySelector(changeListenerSelector), { childList: true });

            function mutationHandler() {
                var searchParameter = {artist: $(artistSelector).text(), title: $(titleSelector).text()};

                if (!lastSearchParameter || (lastSearchParameter && JSON.stringify(lastSearchParameter) !== JSON.stringify(searchParameter))) {
                    try {
                        findBy(new LyricsWiki(new Build()), searchParameter);
                        lastSearchParameter = searchParameter;
                    } catch (e) {
                        console.log('GME: ' + e.message);
                    }
                }
            }

            return this;
        }
    };

    function findBy(strategy, parameter) {
        if (typeof parameter === 'undefined' || !parameter.artist || !parameter.title || typeof strategy !== 'object') {
            throw 'Wrong parameters or strategy object';
        }

        $lyricsPanel.trigger('update', {artist: parameter.artist, title: parameter.title});

        var persistLyric = Persist.findBy('lyric:' + parameter.artist + '-' + parameter.title);
        if (persistLyric && persistLyric.lyric) {
            $lyricsPanel.trigger('update', {lyric: persistLyric.lyric});
        }
        else {
            $lyricsPanel.trigger('add-loading-overlay');

            strategy.execute(parameter.artist, parameter.title,
                function (lyric) {
                    Persist.persist('lyric:' + parameter.artist + '-' + parameter.title, {lyric: lyric});
                    $lyricsPanel.trigger('update', {lyric: lyric});
                },
                function ($object) {
                    $lyricsPanel.trigger('update', {lyric: $object});
                }
            );
        }
    }
}

function LyricContainer($parent, build) {
    'use strict';

    var $lyricsClip, $lyricsPanel, $lyricsHeader, $lyricsBody;
    var $overlayLoading;


    if (typeof build === 'undefined') {
        throw 'Build object undefined';
    }

    if (typeof $parent === 'undefined') {
        throw 'Please define a selector';
    }
    var Build = build;

    init($parent);

    return {
        registerToggler: function () {
            if ($lyricsClip) {
                $lyricsClip.on('click', function () {
                    $lyricsPanel.toggleClass('clicked un-clicked');
                });
            }

            return this;
        },

        registerEvents: function () {
            if ($lyricsPanel) {
                $lyricsPanel
                    .on('add-loading-overlay', function () {
                        if ($overlayLoading) {
                            $lyricsBody.append($overlayLoading);
                        }
                    })
                    .on('update', function (event, parameter) {
                        if (parameter) {
                            if (parameter.title && parameter.artist) {
                                $lyricsHeader.html(parameter.artist + ' - ' + parameter.title);
                            }
                            if (parameter.lyric) {
                                $lyricsBody.html(parameter.lyric);
                                $lyricsBody.scrollTop(0);
                            }
                        }
                    });
            }

            return this;
        }
    };

    function init(){
        $lyricsPanel = Build.div({attr: {class: 'lyrics-panel un-clicked', id: 'lyrics-panel'}});
        $lyricsClip = Build.div({attr: {class: 'lyrics-clip', id: 'lyrics-clip'}, text: 'Lyric'});
        $lyricsHeader = Build.div({attr: {class: 'lyrics-header', id: 'lyrics-header'}, text: 'Lyrics Panel'});
        $lyricsBody = Build.div({attr: {class: 'lyrics-body', id: 'lyrics-body'}, text: 'I can not hear a sound. Play something loud!' });

        $parent.append($lyricsPanel.append($lyricsClip).append($lyricsHeader).append($lyricsBody));

        $overlayLoading = $('<div id="loading-overlay" data-type="regular-loading-overlay"></div>');
    }
}

function LyricsWiki(build) {
    'use strict';

    var name = 'LyricsWiki';
    var baseLyricsWikiUrl = 'https://lyrics.wikia.com/api.php?fmt=realjson';

    var baseGoogleUrl = 'http://www.google.com/';

    if (typeof build === 'undefined') {
        throw 'Build object undefined';
    }

    var Build = build;

    return {
        execute: function (artist, title, success, error) {
            if (typeof artist === 'undefined' || typeof title === 'undefined' ||
                typeof success !== 'function' || typeof error !== 'function') {
                throw 'Wrong or undefined arguments';
            }

            var songObject;
            get(prepareUrl(artist, title), function (response) {
                songObject = JSON.parse(response.responseText);

                if (songObject && songObject.lyrics !== 'Not found' && songObject.url) {
                    get(songObject.url, function (response) {
                        success(extractLyric(response));
                    });
                }
                else {
                    error(getErrorMessage(artist, title, songObject.url));
                }
            });
        }
    };

    function getErrorMessage(artist, title, url) {
        var googleSearchString = encodeURI(baseGoogleUrl + '?q=lyrics+"' + artist +
            ' ' + title + '"#q=lyrics+"' + artist + ' ' + title +'"');

        return $('<div></div>')
            .append(
                Build.div({text: '<b>Oh No. No lyric found.<b>', attr: {class: 'lyrics-not-found-text space-top'}})
            ).append(
                Build.div({text: 'Add one and make this experience a little bit better!',
                    attr: {class: 'lyrics-not-found-text'}})
            ).append(
                Build.div({text: '<b>First</b> search for the correct lyric. YippieYeah!',
                    attr: {class: 'lyrics-not-found-text space-top'}})
            ).append(
                Build.div({attr: {class: 'lyrics-not-found-link'}})
                    .append(Build.link({attr: {href: googleSearchString},
                        text: 'Search for \'' + artist + ' - ' + title + '\''}))
            ).append(
                Build.div({text: '<b>Then</b> add it to ' + name + '. Awesome!',
                    attr: {class: 'lyrics-not-found-text space-top'}})
            ).append(
                Build.div({attr: {class: 'lyrics-not-found-link'}})
                    .append(Build.link({attr: {href: url}, text: 'Add this great song!'}))
            ).append(
                Build.div({text: '<b>At Last</b> refresh to load the lyric you provided',
                    attr: { class: 'lyrics-not-found-text space-top'}})
            );
    }

    function get(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: callback
        });
    }

    function extractLyric(response) {
        var lyricWithComment = $(response.responseText).find('.lyricbox').clone().children(':not(br)').remove().end().html();
        return lyricWithComment.substr(0, lyricWithComment.indexOf('<!--'));
    }

    function prepareUrl(artist, title) {
        return encodeURI(baseLyricsWikiUrl + '&artist=' + toTitleCase(artist) + '&song=' + toTitleCase(title));
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1);
        });
    }
}

function Persist() {
    'use strict';

    var prefix = 'gme:';

    return {
        persist: function (key, value) {
            if (typeof key === 'undefined') {
                return false;
            }

            key = prefix + '' + key;
            return GM_setValue(key, JSON.stringify(value));
        },

        findBy: function (key) {
            if (typeof key === 'undefined') {
                return undefined;
            }

            key = prefix + '' + key;
            var storedObject = GM_getValue(key);
            if (storedObject) {
                try {
                    return JSON.parse(storedObject);
                } catch (e) {
                    return undefined;
                }
            }
            return undefined;
        },

        remove: function (key) {
            if (typeof key === 'undefined') {
                return undefined;
            }

            key = prefix + '' + key;
            return GM_deleteValue(key);
        }
    };
}

function Update(persist, build) {
    'use strict';

    if (typeof persist === 'undefined') {
        throw 'Persist object undefined';
    }
    if (typeof build === 'undefined') {
        throw 'Build object undefined';
    }

    var version = GM_info.script.version;
    var updateString = 'last-update';

    var name = 'GoogleMusicEnhancer (GME)';
    var linkToNewVersion = 'http://www.tobsch.org/downloads/GoogleMusicEnhancer.user.js';
    var newVersionCheckUrl = 'http://tobsch.org/?site=GoogleMusicEnhancer';

    var Persist = persist;
    var Build = build;

    return {
        registerUpdateButtonEvent: function ($updateButton) {
            if (typeof $updateButton === 'undefined' ) {
                throw 'Update button object undefined';
            }

            if ($updateButton) {
                var that = this;
                $updateButton.on('click', function () {
                    that.check(true);
                });
            }

            return this;
        },

        check: function (force) {
            var lastUpdateTime = Persist.findBy(updateString);

            if (force === true || lastUpdateTime === undefined ||
                parseInt(lastUpdateTime) + parseInt(24 * 60 * 60 * 1000) < parseInt(String(new Date().getTime()))) {

                var newVersion = this.getNewVersion();

                if (newVersion) {
                    var actVersionStripped = parseInt(version.replace(/\./g, ''));
                    var newVersionStripped = parseInt(newVersion.replace(/\./g, ''));

                    if (!!newVersionStripped && newVersionStripped > actVersionStripped) {
                        draw({'newVersion': newVersion});
                    }
                    else {
                        console.log('No new version of the ' + name + ' available ' + newVersion + ' <= ' + version);
                    }

                    Persist.persist(updateString, String(new Date().getTime()));
                }
            }

            return this;
        },

        getNewVersion: function() {
            var response = GM_xmlhttpRequest({
                method: 'GET',
                synchronous: 'true',
                url: newVersionCheckUrl
            });

            if (response.status === 200) {
                return $(response.responseText).find('#projectVersion').text();
            }
            return undefined;
        }
    };

    function draw(options) {

        var newVersionText = 'A new version of the ' + name + ' is available.<br><br>';
        newVersionText += 'Your version: ' + version + '<br>';
        newVersionText += 'Brand new version: ' + options.newVersion + '<br><br><br>';

        blackOut({classesToHide: '.update-box'});

        var updateDiv = $('<div></div>')
            .css({
                left: ($(document).width() / 2) - 250,
                'z-index': '500'
            })
            .attr({
                id: 'update-box',
                class: 'update-box'
            })
            .append($('<div><h2>New version available</h2></div>').addClass('update-header'))
            .append($('<div>' + newVersionText + '</div>')
                .addClass('update-body')
                .append(
                $('<a>' + name + ' ' + options.newVersion + '</a>')
                    .attr({href: linkToNewVersion, title: name + ' ' + version})
            )
        );

        $('body').append(updateDiv);
    }

    function blackOut(options) {
        var blackCurtain = Build.div(
            {
                css: {
                    'width': $(document).width(),
                    'height': $(document).height(),
                    'top': '0',
                    'left': '0',
                    'position': 'absolute',
                    'z-index': '499',
                    'background-color': 'rgb(0, 0, 0)'
                },
                attr: {
                    id: 'black-curtain'
                }
            })
            .fadeTo('slow', 0.7)
            .click(function () {
                $(this).hide();
                $(options.classesToHide).hide();
            });

        $('body').prepend(blackCurtain);
    }
}