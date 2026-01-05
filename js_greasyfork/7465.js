/*jslint browser: true, devel: true */
/*global unsafeWindow, exportFunction */

var DAD = (function (window, unsafeWindow) {
    "use strict";
    
    var utils, debug,
        slice = Array.prototype.slice;
    
    function noop() {
    }
    
    function injectCSS(css) {
        var style,
            head = document.getElementsByTagName("head")[0];
        
        if (head) {
            style = document.createElement("style");
                
            style.textContent = css;
            style.type = "text/css";
                
            head.appendChild(style);
        }
    }
    
    function wrapValue(value, writable) {
        var wrapper;
        
        writable = !!writable;
        
        if (value instanceof Function) {
            wrapper = exportFunction(value, unsafeWindow);
        } else if (value instanceof Array) {
            wrapper = exportProperties(new unsafeWindow.Array(), value, writable);
        } else if (value instanceof Object) {
            wrapper = exportProperties(new unsafeWindow.Object(), value, writable);
        }
        
        return wrapper || value;
    }
    
    function wrapArgs(args) {
        var index, value;
        
        args =  wrapValue(args, true);
        
        for (index = args.length - 1; index >= 0; --index) {
            value = args[index];
            
            if (typeof value === "function" && !value.isProxy) {
                createProxy(args, index, true);
            }
        }
        
        return args;
    }
    
    function exportProperty(target, name, value, writable) {
        writable = !!writable;
        
        if (debug) {
            console.log("export property " + name);
        }
        
        var descriptor = {
            configurable: false,
            enumerable: true,
            value: wrapValue(value, writable),
            writable: writable
        };
        
        try {
            Object.defineProperty(target, name, descriptor);
        } catch (exception) {
            console.error(exception);
        }
        
        return target[name];
    }
    
    function exportProperties(target, object, writable) {
        writable = !!writable;
        
        var index, key;
        
        if (object instanceof Array) {
            for (index = object.length - 1; index >= 0; --index) {
                exportProperty(target, index, object[index], writable);
            }
        } else if (object instanceof Object) {
            for (key in object) {
                if (object.hasOwnProperty(key)) {
                    exportProperty(target, key, object[key], writable);
                }
            }
        }
        
        return target;
    }
    
    function createProxy(target, name, fn, writable) {
        if (debug) {
            console.log("createProxy", arguments);
        }
        
        var caller, handler, proxy,
            native = target[name];

        if (native.isProxy) {
            console.warn("method " + name + " of", target, "is already a proxy");
        } else {
            caller = function (args) {
                return native.apply(target, wrapArgs(args));
            };
            
            if (typeof fn === "function") {
                writable = !!writable;
                
                handler = function () {
                    return fn(caller, wrapArgs(slice.call(arguments)));
                };
            } else {
                writable = !!fn;
                
                handler = function () {
                    return caller(slice.call(arguments));
                };
            }
            
            proxy = exportProperty(target, name, handler, writable);
            proxy.isProxy = true;
        }
        
        return target[name];
    }
    
    function extractString(script, options) {
        var endIndex, string,
            startIndex = 0;

        options = options || {};
        
        if (options.hasOwnProperty("before")) {
            startIndex = script.indexOf(options.before) + options.before.length;
        }
        
        if (!options.hasOwnProperty("separator")) {
            options.separator = "'";
        }

        if (!options.hasOwnProperty("start")) {
            options.start = "";
        }
        
        if (startIndex > -1) {
            startIndex = script.indexOf(options.separator + options.start, startIndex) + 1;
            endIndex = script.indexOf(options.separator, startIndex);

            string = script.substring(startIndex, endIndex);
        } else {
            string = null;
        }
        
        return string;
    }
    
    function DAD(filter, config) {
        if (filter instanceof RegExp) {
            if (!filter.test(location.href)) {
                return;
            }
        } else {
            config = filter;
        }
        
        if (typeof config === "function") {
            try {
                config = config(unsafeWindow, utils);
            } catch (exception) {
                console.error(exception);
            }
        }
        
        debug = !!config.debug;
        
        if (typeof config.css === "string") {
            injectCSS(config.css);
        }
        
        if (typeof config.exports === "object") {
            exportProperties(unsafeWindow, config.exports);
        }
        
        if (typeof config.init === "function") {
            window.addEventListener("DOMContentLoaded", function () {
                try {
                    config.init();
                } catch (exception) {
                    console.error(exception);
                }
            }, true);
        }
    }
    
    utils = {
        noop: noop,
        createProxy: createProxy,
        extractString: extractString
    };
    
    return DAD;
}(this, unsafeWindow));
