// ==UserScript==
// @name         Sportlogiq: Video Scrubber
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Керуйте відео на Sportlogiq за допомогою колеса миші та бічних кнопок.
// @author       Volodymyr Kerdiak
// @match        https://app.sportlogiq.com/EventorApp.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554189/Sportlogiq%3A%20Video%20Scrubber.user.js
// @updateURL https://update.greasyfork.org/scripts/554189/Sportlogiq%3A%20Video%20Scrubber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VideoScrubber = {
        _isEnabled: GM_getValue('videoScrubberEnabled', true),
        _isScrubberInverted: GM_getValue('videoScrubberInverted', false),
        _areSideButtonsEnabled: GM_getValue('videoScrubberSideButtonsEnabled', true),
        _isMouseOverGameEvents: false,
        _boundOnWheel: null,
        _boundOnMouseDown: null,
        _boundMouseEnter: null,
        _boundMouseLeave: null,

        init: function () {
            this._boundOnWheel = this._onWheel.bind(this);
            this._boundOnMouseDown = this._onMouseDown.bind(this);
            this._boundMouseEnter = () => { this._isMouseOverGameEvents = true; };
            this._boundMouseLeave = () => { this._isMouseOverGameEvents = false; };

            if (this._isEnabled) {
                this.enable();
            }
        },

        enable: function () {
            if (document.body.style.overflow === 'hidden') return;
            GM_setValue('videoScrubberEnabled', true);
            this._isEnabled = true;

            document.addEventListener("wheel", this._boundOnWheel, { passive: false });
            document.addEventListener("mousedown", this._boundOnMouseDown);
            document.body.style.overflow = 'hidden';

            const gameEventsContainer = document.querySelector(".game-events-container");
            if (gameEventsContainer) {
                gameEventsContainer.addEventListener("mouseenter", this._boundMouseEnter);
                gameEventsContainer.addEventListener("mouseleave", this._boundMouseLeave);
            }
        },

        disable: function () {
            GM_setValue('videoScrubberEnabled', false);
            this._isEnabled = false;

            document.removeEventListener("wheel", this._boundOnWheel);
            document.removeEventListener("mousedown", this._boundOnMouseDown);
            document.body.style.overflow = '';

            const gameEventsContainer = document.querySelector(".game-events-container");
            if (gameEventsContainer) {
                gameEventsContainer.removeEventListener("mouseenter", this._boundMouseEnter);
                gameEventsContainer.removeEventListener("mouseleave", this._boundMouseLeave);
            }
        },

        reload: function() {
            this._isScrubberInverted = GM_getValue('videoScrubberInverted', false);
            this._areSideButtonsEnabled = GM_getValue('videoScrubberSideButtonsEnabled', true);
        },

        _onWheel: function (event) {
            if (this._isMouseOverGameEvents) return;
            event.preventDefault();

            const delta = this._isScrubberInverted ? -event.deltaY : event.deltaY;
            const frameEditActive = document.querySelector("#frame-edit-controls.edit-current");

            if (frameEditActive) {
                const btnId = delta < 0 ? "f-previous-frame" : "f-next-frame";
                document.getElementById(btnId)?.click();
            } else {
                let btnId;
                if (event.shiftKey) {
                    btnId = delta < 0 ? "m-1s" : "p-1s";
                } else {
                    btnId = delta < 0 ? "m-1f" : "p-1f";
                }
                document.getElementById(btnId)?.click();
            }
        },

        _onMouseDown: function (event) {
            if (!this._areSideButtonsEnabled) return;

            const frameEditActive = document.querySelector("#frame-edit-controls.edit-current");
            let btnId;

            // Mouse 4 (Back) = button 3; Mouse 5 (Forward) = button 4
            if (event.button === 3 || event.button === 4) {
                 if (frameEditActive) {
                    if (event.button === 3) btnId = "f-previous-frame";
                    else if (event.button === 4) btnId = "f-next-frame";
                } else {
                    if (event.shiftKey) {
                        if (event.button === 3) btnId = "m-1s";
                        else if (event.button === 4) btnId = "p-1s";
                    } else {
                        if (event.button === 3) btnId = "m-1f";
                        else if (event.button === 4) btnId = "p-1f";
                    }
                }

                if (btnId) {
                    event.preventDefault();
                    document.getElementById(btnId)?.click();
                }
            }
        }
    };

    function toggleInvertedMode() {
        const newState = !GM_getValue('videoScrubberInverted', false);
        GM_setValue('videoScrubberInverted', newState);
        VideoScrubber.reload();
        alert(`Інвертований режим ${newState ? 'увімкнено' : 'вимкнено'}`);
    }

    function toggleSideButtons() {
        const newState = !GM_getValue('videoScrubberSideButtonsEnabled', true);
        GM_setValue('videoScrubberSideButtonsEnabled', newState);
        VideoScrubber.reload();
        alert(`Бічні кнопки миші ${newState ? 'увімкнено' : 'вимкнено'}`);
    }

    GM_registerMenuCommand('Перемкнути інвертований режим', toggleInvertedMode);
    GM_registerMenuCommand('Перемкнути бічні кнопки миші', toggleSideButtons);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => VideoScrubber.init());
    } else {
        VideoScrubber.init();
    }

})();