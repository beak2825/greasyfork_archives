// ==UserScript==
// @name       Epic battle notifier
// @author Rashe
// @version    2.0
// @description  Alert when epic battle detected, checks every 5 min. It does NOT fight for you, only notify.
// @match      http://www.erepublik.com/*
// @copyright  lol what?
// @noframes
// @namespace https://greasyfork.org/users/11245
// @downloadURL https://update.greasyfork.org/scripts/9800/Epic%20battle%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/9800/Epic%20battle%20notifier.meta.js
// ==/UserScript==


//Dom ready
window.readyHandlers = [];
window.ready = function ready(handler) {
    window.readyHandlers.push(handler);
    handleState();
};
window.handleState = function handleState() {
    if (['interactive', 'complete'].indexOf(document.readyState) > -1) {
        while (window.readyHandlers.length > 0) {
            window.readyHandlers.shift()();
        }
    }
};
document.onreadystatechange = window.handleState;

(function () {
    var epic_alert = function () {
        var _that = this;
        this.settings = {

            debug: false,
            selectors: {
                epic_selector: 'isEpicBattle',
                epic_text: 'war_details_text'
            },
            urls: {
                war_url: 'http://www.erepublik.com/en/military/campaigns',
                battle_url_part: 'battlefield-new'
            },
            messages: {
                message: 'Hey Epic battle is waiting',
                epic_text_span: 'War: Epic battle '
            }
        };

        this.init = function () {
            this.main.start();
        };

        this.main = {
            start: function () {
                _that.main.wait_1min();
            },
            go_to: function () {
                if (window.location.href == _that.settings.urls.war_url) {
                    _that.main.check_if_epic();
                }
                else if (_that.main.check_if_not_in_battle()) {
                    _that.main.wait_20min();
                }
                else {
                    window.location.href = _that.settings.urls.war_url;
                }
            },
            check_if_epic: function () {
                var elements = document.getElementsByClassName(_that.settings.selectors.epic_selector);
                if (elements.length > 0) {
                    for (var i = 0; i < elements.length; i++) {
                        var parent = elements[i].parentNode,
                            value = parent.childNodes[0].textContent;
                        if (value == _that.settings.messages.epic_text_span) {
                            alert(_that.settings.messages.message);
                        }
                    }
                } else {
                    _that.main.wait_5min();
                }
            },
            wait_1min: function () {
                setTimeout(function () {
                    _that.main.go_to();
                }, 60 * 1000);
            },
            wait_5min: function () {
                setTimeout(function () {
                    document.location.reload(true);
                }, 5 * 60 * 1000);
            },
            wait_20min: function () {
                setTimeout(function () {
                    window.location.href = _that.settings.urls.war_url;
                }, 20 * 60 * 1000);
            },
            check_if_not_in_battle: function () {
                var url_parts_arr = window.location.pathname.split('/');
                return (url_parts_arr[3] == _that.settings.urls.battle_url_part);
            }
        };
    };
    window.epic_alert = new epic_alert();
}());

ready(function () {
    epic_alert.init({debug: false});
});