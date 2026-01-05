// ==UserScript==
// @name         StackOverflow close votes shortcuts
// @namespace    albireo.stackoverflow.close-votes-shortcuts
// @version      1.0.0-rc.5
// @description  A script to add keyboard shortcuts to StackOverflow's close votes review queue
// @author       Albireo
// @match        http://stackoverflow.com/review/close*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5630/StackOverflow%20close%20votes%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/5630/StackOverflow%20close%20votes%20shortcuts.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    $(document).ready(function () {
        var keys = {
            '1': 49,
            '2': 50,
            '3': 51,
            '4': 52,
            '5': 53,
            '6': 54,
            '7': 55,
            '8': 56,
            '9': 57,
            '0': 48
        };
        
        var configuration = {
            'actions': {
                'leaveOpen': { 'key': '1', 'value': '8' },
                'close': { 'key': '2', 'value': '6' },
                'edit': { 'key': '3', 'value': '5' },
                'skip': { 'key': '4', 'value': '1' }
            },
            'closeReasons': {
                'duplicate': { 'key': '1', 'value': 'Duplicate' },
                'offTopic': { 'key': '2', 'value': 'OffTopic' },
                'unclear': { 'key': '3', 'value': 'Unclear' },
                'tooBroad': { 'key': '4', 'value': 'TooBroad' },
                'opinionBased': { 'key': '5', 'value': 'OpinionBased' }
            },
            'offTopicReasons': {
                'superUser': { 'key': '1', 'value': '4' },
                'serverFault': { 'key': '2', 'value': '7' },
                'recommend': { 'key': '3', 'value': '16' },
                'minimalProgram': { 'key': '4', 'value': '13' },
                'typo': { 'key': '5', 'value': '11' },
                'migration': { 'key': '6', 'value': '2' },
                'other': { 'key': '7', 'value': '3' },
            },
            'migrationReasons': {
                'meta': { 'key': '1', 'value': 'meta.stackoverflow.com' },
                'superUser': { 'key': '2', 'value': 'superuser.com' },
                'tex': { 'key': '3', 'value': 'tex.stackexchange.com' },
                'dba': { 'key': '4', 'value': 'dba.stackexchange.com' },
                'stats': { 'key': '5', 'value': 'stats.stackexchange.com' },
            }
        };
        
        (function () {
            var states = {
                atQuestion: 1,
                atCloseReason: 2,
                atDuplicate: 3,
                atOffTopic: 4,
                atOtherSite: 5
            };
            
            var state = states.atQuestion;
            
            var clickElement = function (selector) {
                $(selector).focus().click();
            };
            
            var clickAction = function (action) {
                clickElement('.review-actions [data-result-type="' + action + '"]');
            };
            
            var clickCloseReason = function (reason) {
                clickElement('[name="close-reason"][value="' + reason + '"]');
            };
            
            var clickOffTopicReason = function (reason) {
                clickElement('[name="close-as-off-topic-reason"][value="' + reason + '"][data-other-comment-id=""]');
            };
            
            var clickOtherSite = function (site) {
                clickElement('[name="migration"][value="' + site + '"]');
            };
            
            var keyHandler = function(key) {
                switch (state) {
                    case states.atQuestion:
                        actionHandler(key);
                        break;
                    case states.atCloseReason:
                        closeReasonHandler(key);
                        break;
                    case states.atOffTopic:
                        offTopicHandler(key);
                        break;
                    case states.atOtherSite:
                        otherSiteHandler(key);
                        break;
                }
            };
            
            var actionHandler = function (key) {
                switch (key) {
                    case keys[configuration.actions.leaveOpen.key]:
                        clickAction(configuration.actions.leaveOpen.value);
                        resetState();
                        break;
                    case keys[configuration.actions.close.key]:
                        state = states.atCloseReason;
                        clickAction(configuration.actions.close.value);
                        break;
                    case keys[configuration.actions.edit.key]:
                        clickAction(configuration.actions.edit.value);
                        resetState();
                        break;
                    case keys[configuration.actions.skip.key]:
                        clickAction(configuration.actions.skip.value);
                        resetState();
                        break;
                }
            };
            
            var closeReasonHandler = function (key) {
                switch (key) {
                    case keys[configuration.closeReasons.duplicate.key]:
                        clickCloseReason(configuration.closeReasons.duplicate.value);
                        state = states.atDuplicate;
                        break;
                    case keys[configuration.closeReasons.offTopic.key]:
                        clickCloseReason(configuration.closeReasons.offTopic.value);
                        state = states.atOffTopic;
                        break;
                    case keys[configuration.closeReasons.unclear.key]:
                        clickCloseReason(configuration.closeReasons.unclear.value);
                        break;
                    case keys[configuration.closeReasons.tooBroad.key]:
                        clickCloseReason(configuration.closeReasons.tooBroad.value);
                        break;
                    case keys[configuration.closeReasons.opinionBased.key]:
                        clickCloseReason(configuration.closeReasons.opinionBased.value);
                        break;
                }
            };
            
            var offTopicHandler = function (key) {
                switch (key) {
                    case keys[configuration.offTopicReasons.superUser.key]:
                        clickOffTopicReason(configuration.offTopicReasons.superUser.value);
                        break;
                    case keys[configuration.offTopicReasons.serverFault.key]:
                        clickOffTopicReason(configuration.offTopicReasons.serverFault.value);
                        break;
                    case keys[configuration.offTopicReasons.recommend.key]:
                        clickOffTopicReason(configuration.offTopicReasons.recommend.value);
                        break;
                    case keys[configuration.offTopicReasons.minimalProgram.key]:
                        clickOffTopicReason(configuration.offTopicReasons.minimalProgram.value);
                        break;
                    case keys[configuration.offTopicReasons.typo.key]:
                        clickOffTopicReason(configuration.offTopicReasons.typo.value);
                        break;
                    case keys[configuration.offTopicReasons.migration.key]:
                        state = states.atOtherSite;
                        clickOffTopicReason(configuration.offTopicReasons.migration.value);
                        break;
                    case keys[configuration.offTopicReasons.other.key]:
                        clickOffTopicReason(configuration.offTopicReasons.other.value);
                        break;
                }
            };
            
            var otherSiteHandler = function (key) {
                switch (key) {
                    case keys[configuration.migrationReasons.meta.key]:
                        clickOtherSite(configuration.migrationReasons.meta.value);
                        break;
                    case keys[configuration.migrationReasons.superUser.key]:
                        clickOtherSite(configuration.migrationReasons.superUser.value);
                        break;
                    case keys[configuration.migrationReasons.tex.key]:
                        clickOtherSite(configuration.migrationReasons.tex.value);
                        break;
                    case keys[configuration.migrationReasons.dba.key]:
                        clickOtherSite(configuration.migrationReasons.dba.value);
                        break;
                    case keys[configuration.migrationReasons.stats.key]:
                        clickOtherSite(configuration.migrationReasons.stats.value);
                        break;
                }
            };
            
            var resetState = function () {
                state = states.atQuestion;
            };
            
            $(document).on('click', '#popup-close-question .popup-close a', function () {
                resetState();
            });
            
            $(document).on('click', '#popup-close-question .popup-submit', function () {
                resetState();
            });
            
            $(document).on('keyup', function (e) {
                if (e.keyCode === 27) {
                    resetState();
                    return;
                }
                
                if ((e.target.tagName === 'INPUT' && e.target.type === 'text') || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                
                keyHandler(e.keyCode);
            });
        })();
        
        (function () {
            var lookup = { };
            lookup[configuration.actions.leaveOpen.value] = configuration.actions.leaveOpen.key;
            lookup[configuration.actions.close.value] = configuration.actions.close.key;
            lookup[configuration.actions.edit.value] = configuration.actions.edit.key;
            lookup[configuration.actions.skip.value] = configuration.actions.skip.key;
            
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    for (var i = 0, j = mutation.addedNodes.length; i < j; i++) {
                        var node = $(mutation.addedNodes[i]);
                        if (node.prop('tagName') !== 'INPUT' || node.prop('type') !== 'button') {
                            continue;
                        }
                        var key = lookup[node.data('result-type')];
                        if (!key) {
                            continue;
                        }
                        node.val('[' + key + '] ' + node.val());
                    }
                });
            });
            
            observer.observe(document.querySelector('.review-actions'), { 'childList': true });
        })();
        
        (function () {
            var addSiblingHelper = function (root, selector, key) {
                var element = $(root).find(selector).next();
                element.html('[' + key + '] ' + element.html());
            };
            
            var addCousinHelper = function (root, selector, key) {
                var element = $(root).find(selector).parent().next().next();
                element.html('[' + key + '] ' + element.html());
            };
            
            var addCloseReasonHelper = function (root, reason, key) {
                addSiblingHelper(root, '[name="close-reason"][value="' + reason + '"]', key);
            };
            
            var addOffTopicReasonHelper = function (root, reason, key) {
                addSiblingHelper(root, '[name="close-as-off-topic-reason"][value="' + reason +'"][data-other-comment-id=""]', key);
            };
            
            var addMigrationHelper = function (root, reason, key) {
                addCousinHelper(root, '[name="migration"][value="' + reason + '"]', key);
            };
            
            var addHelpers = function (root) {
                addCloseReasonHelper(root, configuration.closeReasons.duplicate.value, configuration.closeReasons.duplicate.key);
                addCloseReasonHelper(root, configuration.closeReasons.offTopic.value, configuration.closeReasons.offTopic.key);
                addCloseReasonHelper(root, configuration.closeReasons.unclear.value, configuration.closeReasons.unclear.key);
                addCloseReasonHelper(root, configuration.closeReasons.tooBroad.value, configuration.closeReasons.tooBroad.key);
                addCloseReasonHelper(root, configuration.closeReasons.opinionBased.value, configuration.closeReasons.opinionBased.key);
                addOffTopicReasonHelper(root, configuration.offTopicReasons.superUser.value, configuration.offTopicReasons.superUser.key);
                addOffTopicReasonHelper(root, configuration.offTopicReasons.serverFault.value, configuration.offTopicReasons.serverFault.key);
                addOffTopicReasonHelper(root, configuration.offTopicReasons.recommend.value, configuration.offTopicReasons.recommend.key);
                addOffTopicReasonHelper(root, configuration.offTopicReasons.minimalProgram.value, configuration.offTopicReasons.minimalProgram.key);
                addOffTopicReasonHelper(root, configuration.offTopicReasons.typo.value, configuration.offTopicReasons.typo.key);
                addOffTopicReasonHelper(root, configuration.offTopicReasons.migration.value, configuration.offTopicReasons.migration.key);
                addOffTopicReasonHelper(root, configuration.offTopicReasons.other.value, configuration.offTopicReasons.other.key);
                addMigrationHelper(root, configuration.migrationReasons.meta.value, configuration.migrationReasons.meta.key);
                addMigrationHelper(root, configuration.migrationReasons.superUser.value, configuration.migrationReasons.superUser.key);
                addMigrationHelper(root, configuration.migrationReasons.tex.value, configuration.migrationReasons.tex.key);
                addMigrationHelper(root, configuration.migrationReasons.dba.value, configuration.migrationReasons.dba.key);
                addMigrationHelper(root, configuration.migrationReasons.stats.value, configuration.migrationReasons.stats.key);
            };
            
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    for (var i = 0, j = mutation.addedNodes.length; i < j; i++) {
                        var node = mutation.addedNodes[i];
                        if (node.tagName === 'DIV' && node.id === 'popup-close-question') {
                            addHelpers(node);
                        }
                    }
                });
            });
            
            observer.observe(document.querySelector('.review-content'), { 'childList': true, 'subtree': true });
        })();
    });
})();
