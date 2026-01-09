// ==UserScript==
// @name            FUCK COOLDOWN
// @version         2.0.1
// @description     Удаление таймера в 30 секунд, инвойсы + холды
// @author          https://lolz.live/eternal + lolz.live/rsz9
// @match           https://lzt.market/*
// @match           http://lzt.market/*
// @match           https://*.lzt.market/*
// @run-at          document-start
// @grant           none
// @license         GPL-3.0-or-later
// @namespace       https://greasyfork.org/users/1355696
// @downloadURL https://update.greasyfork.org/scripts/561746/FUCK%20COOLDOWN.user.js
// @updateURL https://update.greasyfork.org/scripts/561746/FUCK%20COOLDOWN.meta.js
// ==/UserScript==

(function(global) {
    'use strict';

    // ========== КОНФИГУРАЦИЯ ==========
    const AUTO_CONFIRM = true; // Автоматическое подтверждение оплаты
    const ACCELERATION_MULTIPLIER = 100; // Ускорение для RegTimer (x100)

    // ========== PAYMENT TIMER BYPASS (FUCK THE TIMER) ==========
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    window.setTimeout = function(fn, delay, ...args) {
        if (delay >= 900 && delay <= 31000) {
            delay = 1;
        }
        return originalSetTimeout.call(window, fn, delay, ...args);
    };

    window.setInterval = function(fn, delay, ...args) {
        if (delay >= 900 && delay <= 1100) {
            return originalSetTimeout.call(window, fn, 1, ...args);
        }
        return originalSetInterval.call(window, fn, delay, ...args);
    };

    function processPaymentForm() {
        // Скрываем все таймеры RegTimer
        const timers = document.querySelectorAll('.RegTimer');
        timers.forEach(timer => {
            timer.style.display = 'none';
        });

        // Обработка формы оплаты инвойса
        const invoiceForm = document.querySelector('form.xenForm.formOverlay.AutoValidator[action*="invoice"][action*="pay"]') ||
                            document.querySelector('form[action*="invoice"][action*="pay"]');
        const invoiceBtn = invoiceForm ? invoiceForm.querySelector('input[type="submit"].SubmitButton') : null;

        if (invoiceBtn && invoiceForm) {
            invoiceBtn.removeAttribute('disabled');
            invoiceBtn.disabled = false;

            if (AUTO_CONFIRM) {
                setTimeout(() => invoiceBtn.click(), 50);
                setTimeout(() => {
                    if (invoiceForm) invoiceForm.submit();
                }, 200);
            } else {
                const newBtn = invoiceBtn.cloneNode(true);
                invoiceBtn.parentNode.replaceChild(newBtn, invoiceBtn);
                newBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    invoiceForm.submit();
                }, true);
            }
        }

        // Обработка формы подтверждения холда/перевода
        const holdForm = document.querySelector('form.xenForm.formOverlay[action*="balance/transfer/finish"]') ||
                         document.querySelector('form[action*="balance/transfer/finish"]');
        const holdBtn = holdForm ? holdForm.querySelector('input[type="submit"].SubmitButton') : null;

        if (holdBtn && holdForm) {
            holdBtn.removeAttribute('disabled');
            holdBtn.disabled = false;

            if (AUTO_CONFIRM) {
                setTimeout(() => holdBtn.click(), 50);
                setTimeout(() => {
                    if (holdForm) holdForm.submit();
                }, 200);
            } else {
                const newHoldBtn = holdBtn.cloneNode(true);
                holdBtn.parentNode.replaceChild(newHoldBtn, holdBtn);
                newHoldBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    holdForm.submit();
                }, true);
            }
        }

        // Дополнительная обработка кнопок в paymentFooterExtra
        const footerLinks = document.querySelectorAll('.paymentFooterExtra a[href*="balance/transfer/finish"]');
        footerLinks.forEach(link => {
            if (link.classList.contains('OverlayTrigger')) {
                // Убираем класс OverlayTrigger если нужно
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
            }
        });
    }

    // ========== REGTIMER ACCELERATION (HOLDSKIPPER) ==========
    var workerURLs = [];
    var extraElements = [];

    var helper = function (eHookContext, timerContext, util) {
        return {
            applyHooking: function () {
                var _this = this;
                eHookContext.hookReplace(window, 'setInterval', function (setInterval) {
                    return _this.getHookedTimerFunction('interval', setInterval);
                });
                eHookContext.hookReplace(window, 'setTimeout', function (setTimeout) {
                    return _this.getHookedTimerFunction('timeout', setTimeout)
                });
                eHookContext.hookBefore(window, 'clearInterval', function (method, args) {
                    _this.redirectNewestId(args);
                });
                eHookContext.hookBefore(window, 'clearTimeout', function (method, args) {
                    _this.redirectNewestId(args);
                });
                var newFunc = this.getHookedDateConstructor();
                eHookContext.hookClass(window, 'Date', newFunc, '_innerDate', ['now']);
                Date.now = function () {
                    return new Date().getTime();
                };
                eHookContext.hookedToString(timerContext._Date.now, Date.now);
                var objToString = Object.prototype.toString;

                Object.prototype.toString = function toString() {
                    'use strict';
                    if (this instanceof timerContext._mDate) {
                        return '[object Date]';
                    } else {
                        return objToString.call(this);
                    }
                };

                eHookContext.hookedToString(objToString, Object.prototype.toString);
                eHookContext.hookedToString(timerContext._setInterval, setInterval);
                eHookContext.hookedToString(timerContext._setTimeout, setTimeout);
                eHookContext.hookedToString(timerContext._clearInterval, clearInterval);
                timerContext._mDate = window.Date;
                this.hookShadowRoot();
            },
            getHookedDateConstructor: function () {
                return function () {
                    if (arguments.length === 1) {
                        Object.defineProperty(this, '_innerDate', {
                            configurable: false,
                            enumerable: false,
                            value: new timerContext._Date(arguments[0]),
                            writable: false
                        });
                        return;
                    } else if (arguments.length > 1) {
                        var definedValue;
                        switch (arguments.length) {
                            case 2:
                                definedValue = new timerContext._Date(arguments[0], arguments[1]);
                                break;
                            case 3:
                                definedValue = new timerContext._Date(arguments[0], arguments[1], arguments[2]);
                                break;
                            case 4:
                                definedValue = new timerContext._Date(arguments[0], arguments[1], arguments[2], arguments[3]);
                                break;
                            case 5:
                                definedValue = new timerContext._Date(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                                break;
                            case 6:
                                definedValue = new timerContext._Date(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                                break;
                            default:
                            case 7:
                                definedValue = new timerContext._Date(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                                break;
                        }

                        Object.defineProperty(this, '_innerDate', {
                            configurable: false,
                            enumerable: false,
                            value: definedValue,
                            writable: false
                        });
                        return;
                    }
                    var now = timerContext._Date.now();
                    var passTime = now - timerContext.__lastDatetime;
                    var hookPassTime = passTime * (1 / timerContext._percentage);
                    Object.defineProperty(this, '_innerDate', {
                        configurable: false,
                        enumerable: false,
                        value: new timerContext._Date(timerContext.__lastMDatetime + hookPassTime),
                        writable: false
                    });
                };
            },
            getHookedTimerFunction: function (type, timer) {
                var property = '_' + type + 'Ids';
                return function () {
                    var uniqueId = timerContext.genUniqueId();
                    var callback = arguments[0];

                    if (typeof callback === 'string') {
                        callback += ';timer.notifyExec(' + uniqueId + ')';
                        arguments[0] = callback;
                    }
                    if (typeof callback === 'function') {
                        arguments[0] = function () {
                            var returnValue = callback.apply(this, arguments);
                            timerContext.notifyExec(uniqueId);
                            return returnValue;
                        }
                    }
                    var originMS = arguments[1];
                    arguments[1] *= timerContext._percentage;
                    var resultId = timer.apply(window, arguments);
                    timerContext[property][resultId] = {
                        args: arguments,
                        originMS: originMS,
                        originId: resultId,
                        nowId: resultId,
                        uniqueId: uniqueId,
                        oldPercentage: timerContext._percentage,
                        exceptNextFireTime: timerContext._Date.now() + originMS
                    };
                    return resultId;
                };
            },
            redirectNewestId: function (args) {
                var id = args[0];
                if (timerContext._intervalIds[id]) {
                    args[0] = timerContext._intervalIds[id].nowId;
                    delete timerContext._intervalIds[id];
                }
                if (timerContext._timeoutIds[id]) {
                    args[0] = timerContext._timeoutIds[id].nowId;
                    delete timerContext._timeoutIds[id];
                }
            },
            percentageChangeHandler: function (percentage) {
                util.ergodicObject(timerContext, timerContext._intervalIds, function (idObj, id) {
                    idObj.args[1] = Math.floor((idObj.originMS || 1) * percentage);
                    this._clearInterval.call(window, idObj.nowId);
                    idObj.nowId = this._setInterval.apply(window, idObj.args);
                });
                util.ergodicObject(timerContext, timerContext._timeoutIds, function (idObj, id) {
                    var now = this._Date.now();
                    var exceptTime = idObj.exceptNextFireTime;
                    var oldPercentage = idObj.oldPercentage;
                    var time = exceptTime - now;
                    if (time < 0) time = 0;
                    var changedTime = Math.floor(percentage / oldPercentage * time);
                    idObj.args[1] = changedTime;
                    idObj.exceptNextFireTime = now + changedTime;
                    idObj.oldPercentage = percentage;
                    this._clearTimeout.call(window, idObj.nowId);
                    idObj.nowId = this._setTimeout.apply(window, idObj.args);
                });
            },
            hookShadowRoot: function () {
                var origin = Element.prototype.attachShadow;
                eHookContext.hookAfter(Element.prototype, 'attachShadow',
                    function (m, args, result) {
                        extraElements.push(result);
                        return result;
                    }, false);
                eHookContext.hookedToString(origin, Element.prototype.attachShadow);
            },
            hookDefine: function () {
                const _this = this;
                eHookContext.hookBefore(Object, 'defineProperty', function (m, args) {
                    var option = args[2];
                    var ele = args[0];
                    var key = args[1];
                    var afterArgs = _this.hookDefineDetails(ele, key, option);
                    afterArgs.forEach((arg, i) => {
                        args[i] = arg;
                    })
                });
                eHookContext.hookBefore(Object, 'defineProperties', function (m, args) {
                    var option = args[1];
                    var ele = args[0];
                    if (ele && ele instanceof Element) {
                        Object.keys(option).forEach(key => {
                            var o = option[key];
                            var afterArgs = _this.hookDefineDetails(ele, key, o);
                            args[0] = afterArgs[0];
                            delete option[key];
                            option[afterArgs[1]] = afterArgs[2]
                        })
                    }
                })
            },
            hookDefineDetails: function (target, key, option) {
                if (option && target && target instanceof Element && typeof key === 'string' && key.indexOf('on') >= 0) {
                    option.configurable = true;
                }
                return [target, key, option];
            },
            setupRegTimerObserver: function (timerContext) {
                var resetTimeoutId = null;
                var lastRegTimerElement = null;
                var originalSetTimeout = timerContext._setTimeout;
                var originalClearTimeout = timerContext._clearTimeout;

                function checkForRegTimer() {
                    var regTimer = document.querySelector('.RegTimer');

                    if (regTimer && regTimer !== lastRegTimerElement) {
                        lastRegTimerElement = regTimer;

                        console.log('[FUCK COOLDOWN] RegTimer detected - applying x' + ACCELERATION_MULTIPLIER + ' acceleration');

                        timerContext.change(1 / ACCELERATION_MULTIPLIER);

                        if (resetTimeoutId) {
                            originalClearTimeout.call(window, resetTimeoutId);
                        }

                        resetTimeoutId = originalSetTimeout.call(window, function() {
                            console.log('[FUCK COOLDOWN] Restoring normal speed');
                            timerContext.change(1);
                            resetTimeoutId = null;
                            lastRegTimerElement = null;
                        }, 3000);
                    }
                }

                function startObserver() {
                    checkForRegTimer();

                    var observer = new MutationObserver(function(mutations) {
                        checkForRegTimer();
                    });

                    if (document.body) {
                        observer.observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                    }
                }

                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', startObserver);
                } else {
                    startObserver();
                }
            }
        }
    };

    var generate = function () {
        return function (util) {
            workerURLs.forEach(function (url) {
                if (util.urlMatching(location.href, 'http.*://.*' + url + '.*')) {
                    window['Worker'] = undefined;
                    console.log('Worker disabled');
                }
            });
            var eHookContext = this;
            var timerHooker = {
                _intervalIds: {},
                _timeoutIds: {},
                _auoUniqueId: 1,
                __percentage: 1.0,
                _setInterval: window['setInterval'],
                _clearInterval: window['clearInterval'],
                _clearTimeout: window['clearTimeout'],
                _setTimeout: window['setTimeout'],
                _Date: window['Date'],
                __lastDatetime: new Date().getTime(),
                __lastMDatetime: new Date().getTime(),
                videoSpeedInterval: 1000,
                defineProperty: Object.defineProperty,
                defineProperties: Object.defineProperties,
                genUniqueId: function () {
                    return this._auoUniqueId++;
                },
                notifyExec: function (uniqueId) {
                    var _this = this;
                    if (uniqueId) {
                        var timeoutInfos = Object.values(this._timeoutIds).filter(
                            function (info) {
                                return info.uniqueId === uniqueId;
                            }
                        );
                        timeoutInfos.forEach(function (info) {
                            _this._clearTimeout.call(window, info.nowId);
                            delete _this._timeoutIds[info.originId]
                        })
                    }
                },
                init: function () {
                    var timerContext = this;
                    var h = helper(eHookContext, timerContext, util);

                    h.hookDefine();
                    h.applyHooking();

                    Object.defineProperty(timerContext, '_percentage', {
                        get: function () {
                            return timerContext.__percentage;
                        },
                        set: function (percentage) {
                            if (percentage === timerContext.__percentage) {
                                return percentage;
                            }
                            h.percentageChangeHandler(percentage);
                            timerContext.__percentage = percentage;
                            return percentage;
                        }
                    });

                    h.setupRegTimerObserver(timerContext);
                },
                change: function (percentage) {
                    this.__lastMDatetime = this._mDate.now();
                    this.__lastDatetime = this._Date.now();
                    this._percentage = percentage;
                }
            };
            timerHooker.init();
            return timerHooker;
        }
    };

    if (global.eHook) {
        global.eHook.plugins({
            name: 'timer',
            mount: generate()
        });
    }

    // ========== PAYMENT FORM OBSERVER ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processPaymentForm);
    } else {
        processPaymentForm();
    }

    setTimeout(processPaymentForm, 100);
    setTimeout(processPaymentForm, 500);
    setTimeout(processPaymentForm, 1000);
    setTimeout(processPaymentForm, 2000);

    const paymentObserver = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.classList && (
                        node.classList.contains('xenOverlay') ||
                        node.classList.contains('confirmPayInvoice') ||
                        (node.querySelector && (
                            node.querySelector('.RegTimer') ||
                            node.querySelector('form[action*="balance/transfer/finish"]') ||
                            node.querySelector('form[action*="invoice"][action*="pay"]')
                        ))
                    )) {
                        console.log('[FUCK COOLDOWN] Payment form detected, processing...');
                        setTimeout(processPaymentForm, 50);
                        setTimeout(processPaymentForm, 200);
                        setTimeout(processPaymentForm, 500);
                        setTimeout(processPaymentForm, 1000);
                    }
                }
            }
        }
    });

    const waitForBody = setInterval(function() {
        if (document.body) {
            clearInterval(waitForBody);
            paymentObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('[FUCK COOLDOWN] Script loaded successfully');
        }
    }, 10);

})(window);