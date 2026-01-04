// ==UserScript==
// @name           TestLib
// @description    This script is only a test.
// @namespace      https://greasyfork.org/users/788550
// @version        1.0.2
// @author         Cyrano68
// @license        MIT
// @grant          none
// @run-at         document-start
// ==/UserScript==

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";
    const myVersion = "1.0.2";  // It must be the same value indicated in @version.

    function getVersion()
    {
        return myVersion;
    }

    // Expose the public interface by returning an object.
    window.BasicLib =
    {
        getVersion: getVersion
    };
})();
