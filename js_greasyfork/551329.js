// ==UserScript==
// @name        Chaturbate Quick Model sorting
// @version     1.0
// @description Sorts Models in descending (High to Low) order quickly
// @author      Brsrk
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=32&domain=chaturbate.com
// @icon64      https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @include     https://chaturbate.com/*
// @include     https://*.chaturbate.com/*
// @exclude     https://chaturbate.com/b/*
// @grant       none
// @run-at      document-end
// @namespace https://greasyfork.org/users/726492
// @downloadURL https://update.greasyfork.org/scripts/551329/Chaturbate%20Quick%20Model%20sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/551329/Chaturbate%20Quick%20Model%20sorting.meta.js
// ==/UserScript==

(function(){
    function sortModels() {
        var contentHolder = document.getElementsByClassName("list");
        var subClass = "cams";

        if (contentHolder !== null && contentHolder.length > 0) {
            _sortModels(contentHolder);
        }
    }

    function _sortModels(contentHolder) {
        for (var i = 0; i < contentHolder.length; i++) {
            var mainList = contentHolder[i];
            var elems = mainList.getElementsByClassName("cams");
            var fragment = document.createDocumentFragment();
            var sortedElems = Array.prototype.slice.call(elems).sort(function(a, b) {
                var infoA = a.innerText.replace(/\,/g, ".");
                var camsinfoA = infoA.match(/(.*)(\. )(\d+)(.*)/);
                var viewersA = camsinfoA !== null && camsinfoA.length > 2 ? parseInt(camsinfoA[3]) : 0;

                var infoB = b.innerText.replace(/\,/g, ".");
                var camsinfoB = infoB.match(/(.*)(\. )(\d+)(.*)/);
                var viewersB = camsinfoB !== null && camsinfoB.length > 2 ? parseInt(camsinfoB[3]) : 0;

                return viewersB - viewersA;
            });
            for (var j = 0; j < sortedElems.length; j++) {
                var pElement = sortedElems[j].parentElement.parentElement.parentElement;
                fragment.appendChild(pElement);
            }
            mainList.appendChild(fragment);
        }
    }

    sortModels();

    var observeDOM = (function() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback) {
            if (MutationObserver) {
                var obs = new MutationObserver(function(mutations, observer) {
                    if (mutations[0].addedNodes.length) {
                        callback(observer);
                    }
                });
                obs.observe(obj, {
                    childList: true,
                    subtree: true
                });
            } else if (eventListenerSupported) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();

    observeDOM(document.getElementById('main'), function(observer) {
        observer.disconnect();
        sortModels();
        observer.observe(document.getElementById('main'), {
            childList: true,
            subtree: true
        });
    });
})();