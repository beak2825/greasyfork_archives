// ==UserScript==
// @name         WebPad
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Comfortable gamepad control for webtoon, comic, and video sites.
// @author       Gemini
// @match        https://k-hentai.org/*
// @match        https://harpi.in/*
// @match        https://*.avsee.ru/*
// @match        https://kone.gg/*
// @match        https://*.com/webtoon/*
// @match        https://*.net/comic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552350/WebPad.user.js
// @updateURL https://update.greasyfork.org/scripts/552350/WebPad.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEY_CODES = {
        'ArrowLeft': 37,
        'ArrowUp': 38,
        'ArrowRight': 39,
        'ArrowDown': 40
    };

    const defaultConfig = {
        scrollStep: 20,
        scrollTargetElement: 'documentElement',
        axisSensitivity: 0.1,
        longPressDelay: 100,
        buttonMappings: {
            '4': { singlePress: { action: 'toggleFullscreen' } },
            '8': { singlePress: { action: 'closeCurrentTab' } },
            '14': {
                singlePress: { action: 'sendKey', params: { key: 'ArrowLeft' } },
                continuousPress: { action: 'sendKey', params: { key: 'ArrowLeft' } }
            },
            '15': {
                singlePress: { action: 'sendKey', params: { key: 'ArrowRight' } },
                continuousPress: { action: 'sendKey', params: { key: 'ArrowRight' } }
            }
        }
    };

    const siteSpecificConfig = {
        'k-hentai.org': {
            scrollTargetElement: window.location.href.includes('/r') ? '#khReader' : 'documentElement',
            buttonMappings: {
                '4': { singlePress: { action: 'toggleFullscreen', params: { selector: '#khButtonFullscreen' } } },
                '6': { singlePress: { action: 'performClick', params: { selector: '#khButtonReadMode' } } }
            }
        },
        'harpi.in': {
            scrollTargetElement: '#A0H56QkFGLIbL9kx9B3Q',
            buttonMappings: {
                '6': { singlePress: { action: 'performClick', params: { selector: '#FloatingMenu-actions > button:nth-child(1)' } } }
            }
        },
        'avsee.ru': {
            buttonMappings: {
                '4': { singlePress: { action: 'toggleVideoFullscreen' } },
                '6': { singlePress: { action: 'toggleVideoPlayback' } },
                '8': { singlePress: { action: 'goBackHistory' } },
                '12': {
                    singlePress: { action: 'adjustVideoVolume', params: { value: 0.1 } },
                    continuousPress: { action: 'adjustVideoVolume', params: { value: 0.1 } }
                },
                '13': {
                    singlePress: { action: 'adjustVideoVolume', params: { value: -0.1 } },
                    continuousPress: { action: 'adjustVideoVolume', params: { value: -0.1 } }
                },
                '14': {
                    singlePress: { action: 'adjustVideoTime', params: { value: -10 } },
                    continuousPress: { action: 'adjustVideoTime', params: { value: -30 } }
                },
                '15': {
                    singlePress: { action: 'adjustVideoTime', params: { value: 10 } },
                    continuousPress: { action: 'adjustVideoTime', params: { value: 30 } }
                }
            }
        },
        'kone.gg': {
            buttonMappings: {
                '8': { singlePress: { action: 'goBackHistory' } },
            }
        },
        'newtoki': {
            scrollStep: 40,
            buttonMappings: {
                '14': { singlePress: { action: 'performClick', params: { selector: '#goPrevBtn' } } },
                '15': { singlePress: { action: 'performClick', params: { selector: '#goNextBtn' } } }
            }
        },
        'manatoki': {
            buttonMappings: {
                '6': { singlePress: { action: 'performClick', params: { selector: '.show_viewer' } } },
                '8': { singlePress: { action: 'performClick', params: { selector: '#mcv_closeBtn' } } },
                '12': { singlePress: { action: 'goBackHistory' } },
                '13': { singlePress: { action: 'performClick', params: { selector: '#mcv_messageArea' } } },
            }
        }
    };

    const actions = {
        closeCurrentTab: () => window.close(),
        goBackHistory: () => window.history.back(),
        performClick: (params) => document.querySelector(params.selector)?.click(),
        sendKey: (params) => {
            const keyCode = KEY_CODES[params.key];
            if (keyCode) {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: params.key,
                    keyCode,
                    which: keyCode,
                    bubbles: true,
                    cancelable: true
                }));
            }
        },
        toggleFullscreen: (params) => {
            if (params?.selector) {
                document.fullscreenElement ? document.exitFullscreen() : document.querySelector(params.selector)?.click();
            } else {
                document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
            }
        },
        toggleVideoPlayback: () => {
            try {
                const player = jwplayer();
                if (player) player.getState() === 'playing' ? player.pause() : player.play();
            } catch (error) { }
        },
        toggleVideoFullscreen: () => {
            try {
                const player = jwplayer();
                if (player) player.setFullscreen(!player.getFullscreen());
            } catch (error) { }
        },
        adjustVideoTime: (params) => {
            try {
                const player = jwplayer();
                if (player) player.seek(player.getPosition() + params.value);
            } catch (error) { }
        },
        adjustVideoVolume: (params) => {
            try {
                const player = jwplayer();
                if (player) {
                    let currentVolume = player.getVolume() / 100;
                    let newVolume = Math.max(0, Math.min(1, currentVolume + params.value));
                    player.setVolume(newVolume * 100);
                }
            } catch (error) { }
        }
    };

    function getActiveConfig() {
        const hostname = Object.keys(siteSpecificConfig).find(hostname => window.location.href.includes(hostname));
        const siteConfig = siteSpecificConfig[hostname] || {};
        return {
            ...defaultConfig,
            ...siteConfig,
            buttonMappings: { ...defaultConfig.buttonMappings, ...siteConfig.buttonMappings }
        };
    }

    class GamepadHandler {
        constructor(config) {
            this.config = config;
            this.buttonStates = {};
            this.longPressTimers = {};
        }

        processGamepadInput(gamepad) {
            this.handleScrolling(gamepad);
            this.handleButtonEvents(gamepad);
        }

        handleScrolling(gamepad) {
            const verticalMovement = Math.abs(gamepad.axes[1]) > this.config.axisSensitivity ? gamepad.axes[1] : 0;
            const scrollTarget = this.config.scrollTargetElement === 'documentElement' ? document.documentElement : document.querySelector(this.config.scrollTargetElement);
            if (scrollTarget) {
                scrollTarget.style.scrollBehavior = 'auto';
                scrollTarget.scrollTop += verticalMovement * this.config.scrollStep;
            }
        }

        handleButtonEvents(gamepad) {
            for (const buttonIndex in this.config.buttonMappings) {
                const buttonMapping = this.config.buttonMappings[buttonIndex];
                if (!buttonMapping) continue;

                const buttonKey = `button_${buttonIndex}`;
                const isButtonPressed = gamepad.buttons[buttonIndex].pressed;

                if (isButtonPressed) {
                    if (!this.buttonStates[buttonKey]) {
                        this.buttonStates[buttonKey] = true;
                        this.longPressTimers[buttonKey] = setTimeout(() => {
                            if (gamepad.buttons[buttonIndex].pressed && buttonMapping.continuousPress) {
                                this.longPressTimers[buttonKey] = setInterval(
                                    () => this.executeMappedAction(buttonMapping.continuousPress),
                                    this.config.longPressDelay
                                );
                            }
                        }, 500);
                    }
                } else if (this.buttonStates[buttonKey]) {
                    this.buttonStates[buttonKey] = false;
                    clearTimeout(this.longPressTimers[buttonKey]);
                    clearInterval(this.longPressTimers[buttonKey]);
                    if (this.longPressTimers[buttonKey] && !this.longPressTimers[buttonKey].intervalId) {
                        this.executeMappedAction(buttonMapping.singlePress);
                    }
                    delete this.longPressTimers[buttonKey];
                }
            }
        }

        executeMappedAction(actionConfig) {
            if (actionConfig && actions[actionConfig.action]) {
                actions[actionConfig.action](actionConfig.params);
            }
        }
    }

    function gameLoop() {
        const gamepad = navigator.getGamepads()?.[0];
        if (gamepad) {
            gamepadHandler.processGamepadInput(gamepad);
        }
        requestAnimationFrame(gameLoop);
    }

    const activeConfig = getActiveConfig();
    const gamepadHandler = new GamepadHandler(activeConfig);
    gameLoop();
})();