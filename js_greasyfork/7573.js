/***************************************************************************************
****************************************************************************************
*****
*****   Storage.prototype extension to store all kinds of data
*****
*****   NOTE: Nested functions in objects are not supported (ignored).
*****
*****   This library extends the Storage object used by localStorage and sessionStorage
*****   to allow them to store all types of javascript variables with some optimizations.
*****
*****      sessionStorage maintains a separate storage area for each given origin that's
*****      available for the duration of the page session (as long as the browser is open,
*****      including page reloads and restores).
*****
*****      localStorage does the same thing,
*****      but persists even when the browser is closed and reopened.
*****
*****   Usage:
*****       localStorage.set            (key, value);
*****       sessionStorage.set          (key, value);
*****
*****       var x = localStorage.get    (key, defaultValue);
*****       var y = sessionStorage.get  (key, defaultValue);
*****
*****   Size:
*****       Storage.getSize             ();
*****
*****   Test mode:
*****       Storage.runTestCases        ();
*****
*/

(function() {

    var BOOLEAN_MARKER = 'b';
    var NUMBER_MARKER = 'n';
    var STRING_MARKER = 's';
    var JSON_MARKER = 'j';
    var FUNCTION_MARKER = 'f';

    var TEST_CASES = {
        t00: true,
        t01: false,
        t02: 0,
        t03: 1,
        t04: 2147483646,
        t05: -2147483646,
        t06: "",
        t07: !0,
        t08: !1,
        t09: null,
        t10: undefined,
        t11: "true",
        t12: "false",
        t13: {
            t131: "t131",
            t132: {
                t1321: 't621',
                t1322: true,
                t1323: this.t1321,  // ignored
                t1324: 1324
            },
            t133: undefined,        // ignored
            t134: function(){
                console.log("t134");
            }                       // ignored
        },
        t14: function(){
                console.log("t14");
        },                          // fine
        t15: {
            t151: function (){
                console.log("t151");
            }                       // ignored
        }                           // empty object
    };

    //--- Check that the environment is proper.
    if (typeof(window.Storage) != "function")
        console.error('Storage is not supported! This library requires your browser to support the Web Storage function.');
    if (typeof(window.localStorage) != "object")
        console.error('This library requires localStorage support. Your current browser does not support localStorage!');
    if (typeof(window.sessionStorage) != "object")
        console.warn('Your browser does not support sessionStorage. Store locally only!');


    /*--- set (key, value)
        The Storage object stores only strings, like a cookie,
        but in a more intuitive way.

        This function extends that to allow storing any data type.

        Parameters:
            key
                String: The unique (within this domain) name for this value.
                Should be restricted to valid Javascript identifier characters.

            value
                Any valid javascript value. Strings in JavaScript are UTF-16,
                so each character requires two bytes of memory.
                This means that while many browsers have a 5 MB limit,
                you can only store 2.5 M characters. This function logs an
                error if your browser limit is exceeded.

        Returns:
            When browser limit has been reached...
                undefined and an error is thrown wherever possible.

            In all other cases...
                undefined only.
    */
    Storage.prototype.set = function(key, value) {

        if (typeof key != "string") {
            console.error('Illegal key passed to Storage.set(). Name: ' + key + ' Value: ' + value);
            return;
        }

        if(value == void 0){
            console.error('Illegal value sent to Storage.set(). Name: ' + key + ' Value: ' + value);
            return;
        }

        if (/[^\w _-]/.test(key)) {
            console.warn('Suspect, probably illegal, key passed to Storage.set(). Name: ' + key + ' Value: ' + value);
        }

        var safeStr = false;
        switch (typeof value) {
            case 'boolean':
                safeStr = BOOLEAN_MARKER + (value ? '!0' : '!1');
                break;
            case 'string':
                safeStr = STRING_MARKER + value;
                break;
            case 'number':
                safeStr = NUMBER_MARKER + value;
                break;
            case 'object':
                safeStr = JSON_MARKER + JSON.stringify(value);
                break;
            case 'function':
                safeStr = FUNCTION_MARKER + value.toString();
                break;
            default:
                console.error('Unknown type in Storage.set()!');
                break;
        }

        try {
            if(safeStr)
                this.setItem(key, safeStr);
        } catch(err){
             console.error("Problem occurred while saving: " + err);
        }
    };  //-- End of set()


    /*--- get (key, defaultValue)
        The Storage object retrieves only strings, like a cookie,
        but in a more intuitive way.

        This function extends that to allow retrieving
        stored data from the correct data type.

        Parameters:
            key
                String: The unique (within this domain) name for this value.
                Should be restricted to valid Javascript identifier characters.

            defaultValue
                Optional. Any value to be returned, when no value has previously
                been set.

        Returns:
            When this name has been set...
                The variable or function value as previously set.

            When this name has not been set and a default is provided...
                The value passed in as a default.

            When this name has not been set and default is not provided...
                undefined
     */
    Storage.prototype.get = function(key, defaultValue) {
        var value = this.getItem(key);

        if(value == void 0)
            return defaultValue;

        switch (value[0]) {
            case 'b':
                return eval(value.substr(1));
                break;
            case 's':
                return value.substr(1);
                break;
            case 'n':
            case 'j':
                return JSON.parse(value.substr(1));
                break;
            case 'f':
                return eval('(' + value.substr(1) + ')');
                break;
            default:
                console.error('Unknown type in Storage.get()! Name: ' + key + ' DefaultValue: ' + defaultValue);
                break;
        }

        return undefined;
    }; //-- End of get()

    /*--- getSize ()
        Each separate storage object when local and session are instantiated
        can hold up to 5 MB of stringified data. This is an approximation
        of the current local or session object size in bytes.

        Parameters:
            none

        Returns:
            int showing the length of the local / session object in bytes.
     */
    Storage.prototype.getSize = function () {

        var size = 0;
        for (var i = 0; i < this.length; i++) {
            var key = this.key(i);
            size += lengthInUtf8Bytes(this.getItem(key));
        }
        return size;

        function lengthInUtf8Bytes(str) {
            // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
            var m = encodeURIComponent(str).match(/%[89ABab]/g);
            return str.length + (m ? m.length : 0);
        }
    };

    /*--- runTests ()
        Tests setting and retrieving values of all types on the Storage
        object with this extension.

        Parameters:
            none

        Returns:
            undefined and console output with test results.
     */
    Storage.prototype.runTests = function(){

        for(var testCase in TEST_CASES){
            if(TEST_CASES.hasOwnProperty(testCase)){

                try{

                    var testValue = TEST_CASES[testCase];
                    console.log("Setting", testCase, "with value", testValue, "(", typeof testValue, ")");

                    this.set(testCase, testValue);

                    console.log("Variable successfully set. Retrieving...");

                    var retrieved = this.get(testCase);
                    console.log("Retrieved", testCase, "with value", retrieved, "(", typeof retrieved, ")");

                    testValue === retrieved && (typeof testValue == typeof retrieved)
                        ? console.info("Test case succeeded.")
                        : console.warn("Test case failed: expected",
                        testValue, "of type", typeof testValue, "got", retrieved, "of type", typeof retrieved);

                } catch (err){
                    console.error("Test case failed:", err);
                }

            }
        }
    };
}());