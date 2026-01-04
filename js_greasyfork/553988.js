// ==UserScript==
// @name         Move Things Anywhere - Rotate Videos & More
// @namespace    electroknight22_move_things_anywhere_namespace
// @version      0.0.3
// @license      MIT
// @author       ElectroKnight22
// @description  This script allows you to rotate, scale, flip, or move any element on any website. Bypasses websites that have right-clicking blocked. Uses modifier keys (Ctrl by default, configurable in code) to avoid conflicting with the default right-click menu.
// @match        *://*/*
// @noframes
// @grant        none
// @inject-into  page
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553988/Move%20Things%20Anywhere%20-%20Rotate%20Videos%20%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/553988/Move%20Things%20Anywhere%20-%20Rotate%20Videos%20%20More.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {
    const TRANSFORMATION_MANAGER = {
        elementStates: new WeakMap(),

        _getElementState(element) {
            if (!this.elementStates.has(element)) {
                this.elementStates.set(element, {
                    rotate: 0,
                    translateX: 0,
                    translateY: 0,
                    scaleX: 1,
                    scaleY: 1,
                    originalPosition: null,
                    originalZIndex: null,
                });
            }
            return this.elementStates.get(element);
        },

        _animateElement(element, state, duration = 0.3, delay = 0) {
            const transformation = [
                `translate(${state.translateX}px, ${state.translateY}px)`,
                `rotate(${state.rotate}deg)`,
                `scaleX(${state.scaleX})`,
                `scaleY(${state.scaleY})`,
            ].join(' ');

            element.addEventListener(
                'transitionend',
                () => {
                    element.style.transition = '';
                },
                { once: true },
            );

            element.style.transition = `transform ${duration}s ease-out ${delay}s`;
            element.style.transform = transformation;
        },

        resetAll(element) {
            const state = this._getElementState(element);
            state.rotate = 0;
            state.translateX = 0;
            state.translateY = 0;
            state.scaleX = 1;
            state.scaleY = 1;
            this._animateElement(element, state);
        },

        ROTATE: {
            defaultAngle: 90,
            _processRotation(element, angle) {
                const state = TRANSFORMATION_MANAGER._getElementState(element);
                state.rotate += angle;
                TRANSFORMATION_MANAGER._animateElement(element, state);
            },
            right(element, angle = this.defaultAngle) {
                this._processRotation(element, angle);
            },
            left(element, angle = this.defaultAngle) {
                this._processRotation(element, -angle);
            },
            reset(element) {
                const state = TRANSFORMATION_MANAGER._getElementState(element);
                state.rotate = 0;
                TRANSFORMATION_MANAGER._animateElement(element, state);
            },
        },

        TRANSLATE: {
            defaultAmount: 20,
            _processTranslation(element, x, y) {
                const state = TRANSFORMATION_MANAGER._getElementState(element);
                state.translateX += x;
                state.translateY += y;
                TRANSFORMATION_MANAGER._animateElement(element, state);
            },
            up(element, amount = this.defaultAmount) {
                this._processTranslation(element, 0, -amount);
            },
            down(element, amount = this.defaultAmount) {
                this._processTranslation(element, 0, amount);
            },
            left(element, amount = this.defaultAmount) {
                this._processTranslation(element, -amount, 0);
            },
            right(element, amount = this.defaultAmount) {
                this._processTranslation(element, amount, 0);
            },
            reset(element) {
                const state = TRANSFORMATION_MANAGER._getElementState(element);
                state.translateX = 0;
                state.translateY = 0;
                TRANSFORMATION_MANAGER._animateElement(element, state);
            },
        },

        SCALE: {
            minimumScale: 0.1,
            defaultAmount: 0.1,
            _processScale(element, amount) {
                const state = TRANSFORMATION_MANAGER._getElementState(element);
                const calculateNewScale = (currentScale) => {
                    const sign = Math.sign(currentScale);
                    let newAbsoluteValue = Math.abs(currentScale) + amount;
                    if (newAbsoluteValue < this.minimumScale) newAbsoluteValue = this.minimumScale;
                    return newAbsoluteValue * sign;
                };

                state.scaleX = calculateNewScale(state.scaleX);
                state.scaleY = calculateNewScale(state.scaleY);

                TRANSFORMATION_MANAGER._animateElement(element, state);
            },
            up(element, amount = this.defaultAmount) {
                this._processScale(element, amount);
            },
            down(element, amount = this.defaultAmount) {
                this._processScale(element, -amount);
            },
            reset(element) {
                const state = TRANSFORMATION_MANAGER._getElementState(element);
                state.scaleX = 1 * Math.sign(state.scaleX);
                state.scaleY = 1 * Math.sign(state.scaleY);
                TRANSFORMATION_MANAGER._animateElement(element, state);
            },
        },

        FLIP: {
            _processFlip(element, axis) {
                const state = TRANSFORMATION_MANAGER._getElementState(element);
                switch (axis) {
                    case 'x':
                        state.scaleX *= -1;
                        break;
                    case 'y':
                        state.scaleY *= -1;
                        break;
                }
                TRANSFORMATION_MANAGER._animateElement(element, state);
            },
            horizontal(element) {
                this._processFlip(element, 'x');
            },
            vertical(element) {
                this._processFlip(element, 'y');
            },
            reset(element) {
                const state = TRANSFORMATION_MANAGER._getElementState(element);
                state.scaleX = Math.abs(state.scaleX);
                state.scaleY = Math.abs(state.scaleY);
                TRANSFORMATION_MANAGER._animateElement(element, state);
            },
        },
        LAYER: {
            _processFront(element) {
                const state = TRANSFORMATION_MANAGER._getElementState(element);
                const style = window.getComputedStyle(element);
                if (state.originalPosition === null) {
                    state.originalPosition = style.position;
                    state.originalZIndex = style.zIndex;
                }

                if (style.position === 'static') {
                    element.style.position = 'relative';
                }
                element.style.zIndex = '2147483647';
            },
            front(element) {
                this._processFront(element);
            },
            reset(element) {
                const state = TRANSFORMATION_MANAGER._getElementState(element);
                if (state.originalPosition !== null) {
                    element.style.position = state.originalPosition;
                    element.style.zIndex = state.originalZIndex;
                    state.originalPosition = null;
                    state.originalZIndex = null;
                }
            },
        },
    };

    const CUSTOM_MENU = {
        menuElement: null,
        targetElement: null,

        _createMenu() {
            this._closeMenu();

            this.menuElement = document.createElement('div');
            this.menuElement.id = 'mta-custom-menu';

            const createButton = (text, onClick, autoClose = false) => {
                const button = document.createElement('button');
                button.textContent = text;
                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    onClick();
                    if (autoClose) this._closeMenu();
                });
                return button;
            };

            const createSeparator = () => {
                const separator = document.createElement('hr');
                separator.className = 'mta-separator';
                return separator;
            };

            this.menuElement.append(
                createButton('Move Up ↑', () => {
                    TRANSFORMATION_MANAGER.TRANSLATE.up(this.targetElement);
                }),
                createButton('Move Down ↓', () => {
                    TRANSFORMATION_MANAGER.TRANSLATE.down(this.targetElement);
                }),
                createButton('Move Left ←', () => {
                    TRANSFORMATION_MANAGER.TRANSLATE.left(this.targetElement);
                }),
                createButton('Move Right →', () => {
                    TRANSFORMATION_MANAGER.TRANSLATE.right(this.targetElement);
                }),
                createButton('Reset Move ↩', () => {
                    TRANSFORMATION_MANAGER.TRANSLATE.reset(this.targetElement);
                }),
                createSeparator(),
                createButton('Rotate Right ↻', () => {
                    TRANSFORMATION_MANAGER.ROTATE.right(this.targetElement);
                }),
                createButton('Rotate Left ↺', () => {
                    TRANSFORMATION_MANAGER.ROTATE.left(this.targetElement);
                }),
                createButton('Reset Rotate ↩', () => {
                    TRANSFORMATION_MANAGER.ROTATE.reset(this.targetElement);
                }),
                createSeparator(),
                createButton('Scale Up +', () => {
                    TRANSFORMATION_MANAGER.SCALE.up(this.targetElement);
                }),
                createButton('Scale Down -', () => {
                    TRANSFORMATION_MANAGER.SCALE.down(this.targetElement);
                }),
                createButton('Reset Scale ↩', () => {
                    TRANSFORMATION_MANAGER.SCALE.reset(this.targetElement);
                }),
                createSeparator(),
                createButton('Flip Horizontal ↔', () => {
                    TRANSFORMATION_MANAGER.FLIP.horizontal(this.targetElement);
                }),
                createButton('Flip Vertical ↕', () => {
                    TRANSFORMATION_MANAGER.FLIP.vertical(this.targetElement);
                }),
                createButton('Reset Flip ↩', () => {
                    TRANSFORMATION_MANAGER.FLIP.reset(this.targetElement);
                }),
                createSeparator(),
                createButton('Bring to Front ⇪', () => {
                    TRANSFORMATION_MANAGER.LAYER.front(this.targetElement);
                }),
                createButton('Reset Layer ↩', () => {
                    TRANSFORMATION_MANAGER.LAYER.reset(this.targetElement);
                }),
                createSeparator(),
                createButton('Reset All ↩', () => {
                    TRANSFORMATION_MANAGER.resetAll(this.targetElement);
                }),
            );

            document.body.append(this.menuElement);
        },

        _positionMenu(event) {
            const { clientX, clientY } = event;
            const { innerWidth, innerHeight } = window;
            const menuRect = this.menuElement.getBoundingClientRect();

            let menuX = clientX;
            let menuY = clientY;

            if (clientX + menuRect.width > innerWidth) {
                menuX = innerWidth - menuRect.width - 5;
            }
            if (clientY + menuRect.height > innerHeight) {
                menuY = innerHeight - menuRect.height - 5;
            }

            this.menuElement.style.left = `${menuX}px`;
            this.menuElement.style.top = `${menuY}px`;
        },

        _onMouseDown(event) {
            console.log('on pointer down');
            if (this.menuElement && !this.menuElement.contains(event.target)) {
                this._closeMenu();
            }
        },

        _onKeyDown(event) {
            const triggerKeys = ['Escape'];
            if (triggerKeys.includes(event.key)) {
                event.preventDefault();
                event.stopPropagation();
                this._closeMenu();
            }
        },

        _closeMenu() {
            if (this.menuElement) {
                this.menuElement.remove();
                this.menuElement = null;
            }
            window.removeEventListener('mousedown', this._onMouseDown, true);
            window.removeEventListener('keydown', this._onKeyDown, true);
        },

        show(event) {
            this._createMenu();
            this._positionMenu(event);
            window.addEventListener('mousedown', this._onMouseDown, true);
            window.addEventListener('keydown', this._onKeyDown, true);
        },
    };

    CUSTOM_MENU._closeMenu = CUSTOM_MENU._closeMenu.bind(CUSTOM_MENU);
    CUSTOM_MENU._onMouseDown = CUSTOM_MENU._onMouseDown.bind(CUSTOM_MENU);
    CUSTOM_MENU._onKeyDown = CUSTOM_MENU._onKeyDown.bind(CUSTOM_MENU);

    const addMenuStyles = () => {
        const css = `
            #mta-custom-menu {
                position: fixed;
                z-index: 2147483647; /* Max z-index */
                background-color: #2e2e2e;
                border: 1px solid #555;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                padding: 5px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #mta-custom-menu button {
                background: none;
                border: none;
                color: #eee;
                padding: 8px 16px;
                text-align: left;
                cursor: pointer;
                font-size: 14px;
                border-radius: 4px;
                white-space: nowrap;
            }
            #mta-custom-menu button:hover {
                background-color: #4a4a4a;
            }
            #mta-custom-menu .mta-separator {
                border: none;
                border-top: 1px solid #555;
                margin: 4px 0;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.append(style);
    };

    const OPTIONAL_TRIGGER_KEYS = {
        shift: false,
        ctrl: true,
        alt: false,
    };

    const isModifierRequired = Object.values(OPTIONAL_TRIGGER_KEYS).includes(true);

    const originalPreventDefault = Event.prototype.preventDefault;

    Event.prototype.preventDefault = function () {
        if (this.type !== 'contextmenu') {
            return originalPreventDefault.apply(this, arguments);
        }

        const allConditionsMet = Object.keys(OPTIONAL_TRIGGER_KEYS).every((key) => {
            const eventKeyName = `${key}Key`;
            return OPTIONAL_TRIGGER_KEYS[key] === this[eventKeyName];
        });

        if (isModifierRequired && allConditionsMet) {
            return;
        }

        return originalPreventDefault.apply(this, arguments);
    };

    const _findFirstVisibleElement = (x, y) => {
        const elements = document.elementsFromPoint(x, y);
        for (const element of elements) {
            const style = window.getComputedStyle(element);
            const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            if (isVisible) {
                return element;
            }
        }
        return document.body;
    };

    window.addEventListener(
        'contextmenu',
        (event) => {
            const allConditionsMet = Object.keys(OPTIONAL_TRIGGER_KEYS).every((key) => {
                const eventKeyName = `${key}Key`;
                return OPTIONAL_TRIGGER_KEYS[key] === event[eventKeyName];
            });

            if (isModifierRequired && allConditionsMet) {
                originalPreventDefault.call(event);
                event.preventDefault();
                event.stopPropagation();

                const targetElement = _findFirstVisibleElement(event.clientX, event.clientY);
                CUSTOM_MENU.targetElement = targetElement;
                CUSTOM_MENU.show(event);
            }
        },
        true
    );

    addMenuStyles();
})();
