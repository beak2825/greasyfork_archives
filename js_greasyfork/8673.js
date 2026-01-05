// ==UserScript==
// @name         Mute MML
// @namespace    http://www.tedweatherly.com/
// @version      0.1
// @description  Mutes all the ANNOYING ads presented from NCAA's march madness web site
// @author       Ted Weatherly
// @match        http://www.ncaa.com/march-madness-live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8673/Mute%20MML.user.js
// @updateURL https://update.greasyfork.org/scripts/8673/Mute%20MML.meta.js
// ==/UserScript==

$(function() {
    var _jqBody;
    var _mmlElem;
    var _jqAdLock;
    var _jqTveAdblock;
    var _DEBUG_MODE = false;
    var _lastVolume;

    function _init() {
        _jqBody = $('body');
        _lastVolume = 0.5; // default
        _checkForLoad();
    }
    
    function _checkForLoad() {
        var bIsLoading = _jqBody.hasClass("mml-loading");
        if (_DEBUG_MODE) console.log("Mute MML: bIsLoading = " + bIsLoading); // DEBUG
        if (bIsLoading) {
            window.setTimeout(_checkForLoad, 2000); // check every 2 seconds
        } else {
            $('div#ad-skyscraper').hide();
            $('div#ad-marketing').hide();            
            _mmlElem = $('object#MML')[0];
            _jqAdLock = $('div#ad-lock');
            _jqTveAdblock = null;
            _checkForAd();
        }
    }
    
    function _checkForAd() {
        var isAdShowing = _isAdShowing();
        if (_DEBUG_MODE) console.log("Mute MML: isAdShowing = " + isAdShowing); // DEBUG
        if (_DEBUG_MODE) console.log("Mute MML: _mmlElem = " + _mmlElem); // DEBUG
        var volume = _mmlElem.getVolume();
        var isMuted = (volume === 0);
        if (_DEBUG_MODE) console.log("Mute MML: isAdShowing = " + isAdShowing); // DEBUG
        if (_DEBUG_MODE) console.log("Mute MML: isMuted = " + isMuted); // DEBUG
        if (isAdShowing && !isMuted) {
            if (_DEBUG_MODE) console.log("Mute MML: Need to mute"); // DEBUG
            _lastVolume = volume;
            _mmlElem.setVolume(0); // mute
            _jqAdLock.hide(); // allow nav changes
        } else if (!isAdShowing && isMuted) {
            if (_DEBUG_MODE) console.log("Mute MML: Need to unmute"); // DEBUG
            _mmlElem.setVolume(_lastVolume); // unmute
        }
        window.setTimeout(_checkForAd, 2000); // check every 2 seconds
    }

    function _isAdShowing() {
        if (_jqTveAdblock === null) _jqTveAdblock = $('#tve-adblock');
        return _jqTveAdblock.is(':visible');
    }
    
    _init();

});

