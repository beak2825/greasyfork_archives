// ==UserScript==
// @name            LZT HoldSkipper
// @version         1.0.1
// @description     Автоматическое ускорение таймеров ожидания на lzt.market
// @description:en  Automatic timer acceleration for lzt.market
// @author          https://lolz.live/eternal
// @match           https://lzt.market/*
// @match           http://lzt.market/*
// @require         https://greasyfork.org/scripts/372672-everything-hook/code/Everything-Hook.js?version=881251
// @run-at          document-start
// @grant           none
// @license         GPL-3.0-or-later
// @namespace https://greasyfork.org/users/1355696
// @downloadURL https://update.greasyfork.org/scripts/556511/LZT%20HoldSkipper.user.js
// @updateURL https://update.greasyfork.org/scripts/556511/LZT%20HoldSkipper.meta.js
// ==/UserScript==
/**
 * Based on TimerHooker by Cangshi
 * Modified for lzt.market by https://lolz.live/eternal
 */


~function (global) {

    var workerURLs = [];
    var extraElements = [];

    var helper = function (eHookContext, timerContext, util) {
        return {
            applyHooking: function () {
                var _this = this;
                // 劫持循环计时器
                eHookContext.hookReplace(window, 'setInterval', function (setInterval) {
                    return _this.getHookedTimerFunction('interval', setInterval);
                });
                // 劫持单次计时
                eHookContext.hookReplace(window, 'setTimeout', function (setTimeout) {
                    return _this.getHookedTimerFunction('timeout', setTimeout)
                });
                // 劫持循环计时器的清除方法
                eHookContext.hookBefore(window, 'clearInterval', function (method, args) {
                    _this.redirectNewestId(args);
                });
                // 劫持循环计时器的清除方法
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
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1]
                                );
                                break;
                            case 3:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                );
                                break;
                            case 4:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                );
                                break;
                            case 5:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                    arguments[4]
                                );
                                break;
                            case 6:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                    arguments[4],
                                    arguments[5]
                                );
                                break;
                            default:
                            case 7:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                    arguments[4],
                                    arguments[5],
                                    arguments[6]
                                );
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
                    // console.log(__this.__lastDatetime + hookPassTime, now,__this.__lastDatetime + hookPassTime - now);
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
                    // 储存原始时间间隔
                    var originMS = arguments[1];
                    // 获取变速时间间隔
                    arguments[1] *= timerContext._percentage;
                    var resultId = timer.apply(window, arguments);
                    // 保存每次使用计时器得到的id以及参数等
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
                    // 清除该记录id
                    delete timerContext._intervalIds[id];
                }
                if (timerContext._timeoutIds[id]) {
                    args[0] = timerContext._timeoutIds[id].nowId;
                    // 清除该记录id
                    delete timerContext._timeoutIds[id];
                }
            },
            /**
             * 当计时器速率被改变时调用的回调方法
             * @param percentage
             * @private
             */
            percentageChangeHandler: function (percentage) {
                // 改变所有的循环计时
                util.ergodicObject(timerContext, timerContext._intervalIds, function (idObj, id) {
                    idObj.args[1] = Math.floor((idObj.originMS || 1) * percentage);
                    // 结束原来的计时器
                    this._clearInterval.call(window, idObj.nowId);
                    // 新开一个计时器
                    idObj.nowId = this._setInterval.apply(window, idObj.args);
                });
                // 改变所有的延时计时
                util.ergodicObject(timerContext, timerContext._timeoutIds, function (idObj, id) {
                    var now = this._Date.now();
                    var exceptTime = idObj.exceptNextFireTime;
                    var oldPercentage = idObj.oldPercentage;
                    var time = exceptTime - now;
                    if (time < 0) {
                        time = 0;
                    }
                    var changedTime = Math.floor(percentage / oldPercentage * time);
                    idObj.args[1] = changedTime;
                    // 重定下次执行时间
                    idObj.exceptNextFireTime = now + changedTime;
                    idObj.oldPercentage = percentage;
                    // 结束原来的计时器
                    this._clearTimeout.call(window, idObj.nowId);
                    // 新开一个计时器
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

                        console.log('[LZT HoldSkipper] Extension loaded and active');
                        console.log('[LZT HoldSkipper] RegTimer element detected');
                        console.log('[LZT HoldSkipper] Acceleration applied: x100');

                        timerContext.change(1 / 100);

                        if (resetTimeoutId) {
                            originalClearTimeout.call(window, resetTimeoutId);
                        }

                        resetTimeoutId = originalSetTimeout.call(window, function() {
                            console.log('[LZT HoldSkipper] Restoring normal speed after 3 seconds');
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
            // disable worker
            workerURLs.forEach(function (url) {
                if (util.urlMatching(location.href, 'http.*://.*' + url + '.*')) {
                    window['Worker'] = undefined;
                    console.log('Worker disabled');
                }
            });
            var eHookContext = this;
            var timerHooker = {
                // 用于储存计时器的id和参数
                _intervalIds: {},
                _timeoutIds: {},
                _auoUniqueId: 1,
                // 计时器速率
                __percentage: 1.0,
                // 劫持前的原始的方法
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
                        // 清除 timeout 所储存的记录
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
                    // console.log(uniqueId, 'called')
                },
                /**
                 * 初始化方法
                 */
                init: function () {
                    var timerContext = this;
                    var h = helper(eHookContext, timerContext, util);

                    h.hookDefine();
                    h.applyHooking();

                    // 设定百分比属性被修改的回调
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
            // 默认初始化
            timerHooker.init();
            return timerHooker;
        }
    };

    if (global.eHook) {
        global.eHook.plugins({
            name: 'timer',
            /**
             * 插件装载
             * @param util
             */
            mount: generate()
        });
    }
}(window);