// ==UserScript==
// @name Taming.io Zoom hack
// @author Murka
// @description Allows to change zoom of the game using mouse wheel
// @icon https://taming.io/img/interface/favicon.png
// @version 0.1
// @match *://taming.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/563115/Tamingio%20Zoom%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/563115/Tamingio%20Zoom%20hack.meta.js
// ==/UserScript==
/* jshint esversion:8 */

/*
    DISCORD: https://discord.gg/cPRFdcZkeD
    GITHUB: https://github.com/murka007

    THIS SCRIPT MAY GET YOUR ACCOUNT BANNED
    TO SAFELY TEST IT, USE A TOR BROWSER!!! 
*/

(function() {
    "use strict";

    // Fix console.log
    const log = console.log;

    class Regex {
        constructor(code, unicode) {
            this.code = code;
            this.COPY_CODE = this.code;
            this._unicode = unicode || false;
            this._ANY_LETTER = "(?:[^\\x00-\\x7F-]|\\$|\\w)";
            this.hooks = {};
            this._NumberSystem = [
                { type: "binary", radix: 2, template: "0b" },
                { type: "octal", radix: 8, template: "0+" },
                { type: "decimal", radix: 10, template: "" },
                { type: "hexadecimal", radix: 16, template: "0x" },
            ];
            this._REPLACE_TYPE = {
                APPEND: 0,
                PREPEND: 1
            };
        }

        static parseData(value) {
            try {
                return Function(`return (${value});`)();
            } catch(err) {
                return null;
            }
        }

        _isRegexp(regex) {
            return Object.prototype.toString.call(regex) === "[object RegExp]";
        }

        // Used to replace number into it's representation in different number systems
        _generateNumberSystem(integer) {
            const copy = [...this._NumberSystem];
            const template = copy.map((system) => system.template + integer.toString(system.radix));
            return `(?:${ template.join("|") })`;
        }

        // Used to replace `{VAR}` into `(?:let|var|const)`
        _parseVariable(regex) {
            return regex.replace(/\{VAR\}/g, "(?:let|var|const)");
        }

        _parseNumber(regex) {
            return regex.replace(/NUMBER\{(.+?)\}/g, (...args) => {
                const number = Number(args[1]);
                return this._generateNumberSystem(number);
            })
        }

        // Used to format regular expressions, can support following types [RegExp, RegExp], [string, string], RegExp, string
        _format(name, regex, flags) {
            if (Array.isArray(regex)) {
                regex = regex.map(exp => this._isRegexp(exp) ? exp.source : exp).join("\\s*");
            }
            if (this._unicode) {
                regex = this._isRegexp(regex) ? regex.source : regex;
                regex = regex.replace(/\\w/g, this._ANY_LETTER);
            }
            regex = this._parseVariable(regex);
            regex = this._parseNumber(regex);
            const expression = new RegExp(regex, flags);
            if (!expression.test(this.code)) throw new Error("Failed to find: " + name);
            return expression;
        }

        _template(type, name, regex, substr) {
            const expression = new RegExp(`(${this._format(name, regex).source})`);
            this.code = this.code.replace(expression, type === this._REPLACE_TYPE.APPEND ? ("$1" + substr) : (substr + "$1"));
        }

        // Used to find some strings, variables etc and use it somewhere else
        match(name, regex, flags, debug) {
            const expression = this._format(name, regex, flags);
            const match = this.code.match(expression);
            this.hooks[name] = {
                expression: expression,
                match: match
            };
            if (debug) log(name, this.hooks[name]);
            return match;
        }

        matchAll(name, regex, flags, debug) {
            const expression = this._format(name, regex, flags);
            const matches = this.code.matchAll(expression);
            this.hooks[name] = {
                expression: expression,
                match: matches
            };
            if (debug) log(name, this.hooks[name]);
            return matches;
        }

        replace(name, regex, substr, flags) {
            const expression = this._format(name, regex, flags);
            this.code = this.code.replace(expression, substr);
        }

        // Used to add something to a string
        append(name, regex, substr) {
            this._template(this._REPLACE_TYPE.APPEND, name, regex, substr);
        }

        // Used to add something before a string
        prepend(name, regex, substr) {
            this._template(this._REPLACE_TYPE.PREPEND, name, regex, substr);
        }
    }

    function defineProperty(target, name, value) {
        Object.defineProperty(target, name, {
            value: value
        })
    }

    function linker(value) {
        const hook = {
            0: value,
            toString: (radix) => hook[0].toString(radix),
            valueOf: () => hook[0].valueOf(),
            get length() {
                return hook[0].length;
            }
        };
        return hook;
    }

    window.max_width = linker(1920 + 192 * 6);
    window.max_height = linker(1080 + 108 * 6);

    function applyRegex(code) {
        // return code;

        const Hook = new Regex(code, true);
        const matches = Hook.matchAll("max_scale", [/const /, /(\w+)/, /=/, /(?=[\d(-+])(.+?);/], "g", true);
        const scale = {
            max_width: false,
            max_height: false
        };

        for (const [match, name, value] of matches) {
            if (scale.max_width && scale.max_height) break;

            const integer = Regex.parseData(value);
            if (Number.isInteger(integer)) {
                if (integer === 1920) {
                    Hook.replace("max_width_var", [`const `, `${name}`, `=.+?;`], `const ${name} = window.max_width;`);
                    scale.max_width = true;
                }
                if (integer === 1080) {
                    Hook.replace("max_height_var", [`const `, `${name}`, `=.+?;`], `const ${name} = window.max_height;`);
                    scale.max_height = true;
                }
            }
        }

        Hook.replace("max_width", [/NUMBER{1920}/, /\//], `window.max_width/`, "gi");
        Hook.replace("max_height", [/NUMBER{1080}/, /\//], `window.max_height/`, "gi");

        return Hook.code;
    }

    async function loadScript(target, script) {

        const response = await fetch(script.src);
        let code = await response.text();
        code = applyRegex(code);

        const blob = new Blob([code], { type: "text/plain" });
        const element = document.createElement("script");
        element.src = URL.createObjectURL(blob);

        // lol
        defineProperty(element, "src", script.src);

        target.appendChild(element);
        URL.revokeObjectURL(element.src);

        START();
    }

    let count = 0;
    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === "SCRIPT" && /^https?:\/\/taming\.io\/js\/.+?\.js$/.test(node.src)) {
                    if (count !== 2) {
                        count += 1;
                        return;
                    }
                    observer.disconnect();
                    loadScript(mutation.target, node);

                    // Firefox support
                    function scriptExecuteHandler(event) {
                        event.preventDefault();
                        node.removeEventListener("beforescriptexecute", scriptExecuteHandler);
                    }
                    node.addEventListener("beforescriptexecute", scriptExecuteHandler);
                    node.remove();
                }
            }
        }
    })
    observer.observe(document, { childList: true, subtree: true });

    function START() {

        let resize = null;
        window.addEventListener = new Proxy(window.addEventListener, {
            apply(target, _this, args) {
                const [type, listener, ...options] = args;
                if (type === "resize" && /max_(?:width|height)/.test(listener.toString())) {
                    resize = listener;
                    window.addEventListener = target;
                }
                return target.apply(_this, args);
            }
        })

        let wheels = 0;
        const scaleFactor = {
            width: 192,
            height: 108
        };

        window.addEventListener("wheel", function(event) {
            if (!(event.target instanceof HTMLCanvasElement) || event.ctrlKey) return;
            const { max_width, max_height } = window;

            // Used to create a small gap, so users could easily find the default scale
            if (max_width[0] === 1920 && max_height[0] === 1080) wheels += 1;
            if (wheels % 5 !== 0) return;

            const { width, height } = scaleFactor;
            max_width[0] = Math.max(width, max_width[0] + (event.deltaY > 0 ? -width : width));
            max_height[0] = Math.max(height, max_height[0] + (event.deltaY > 0 ? -height : height));
            if (typeof resize === "function") resize();
        })
    }

})();