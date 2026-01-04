// ==UserScript==
// @name           BasicLib
// @description    This script contains some simple basic-functions.
// @namespace      https://greasyfork.org/users/788550
// @version        1.0.6
// @author         Cyrano68
// @license        MIT
// @grant          none
// @run-at         document-start
// ==/UserScript==

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    let showLogToScreen = false;
    let maxNumScreenLogs = 200;

    const myVersion = "1.0.6";  // It must be the same value indicated in @version.
    consoleLog(`CY==> BasicLib: HELLO! Loading script (version: ${myVersion})...`);

    function getZeroFilledMillisecs(dateNow)
    {
        const millisecs = dateNow.getMilliseconds();
        return ("00" + millisecs).slice(-3);
    }

    function logToScreen(now, text)
    {
        const DEBUG_ID = "DebugContainer";
        let debugContainer = document.getElementById(DEBUG_ID);

        if (!debugContainer)
        {
            debugContainer = document.createElement("div");
            debugContainer.id = DEBUG_ID;

            debugContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                width: 100%;
                background: rgba(0, 0, 0, 0.95);
                color: #00ff00;
                font-family: monospace;
                font-size: 12px;
                z-index: 200000;
                border-bottom: 2px solid #444;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                pointer-events: auto;
                display: flex;
                flex-direction: column;
            `;

            // Area messaggi (scrollabile)
            const logArea = document.createElement("div");
            logArea.id = `${DEBUG_ID}-logs`;
            logArea.style.cssText = `max-height: 200px; overflow-y: auto; padding: 10px; flex-grow: 1;`;

            // Contenitore per i pulsanti (per non occupare troppo spazio verticale)
            const btnBar = document.createElement("div");
            btnBar.style.cssText = `display: flex; background: #222;`;

            const clearBtn = document.createElement("button");
            clearBtn.innerText = "CLEAR LOGS";
            clearBtn.style.cssText = `
                flex: 1;
                background: #444;
                color: #fff;
                border: none;
                padding: 8px;
                cursor: pointer;
                font-size: 11px;
                text-transform: uppercase;
                border-right: 1px solid #555;
            `;

            clearBtn.onclick = function()
            {
                logArea.innerHTML = "";
            };

            // Aggiungiamo anche un tasto per minimizzare/chiudere visto che è grande
            const closeBtn = document.createElement("button");
            closeBtn.innerText = "HIDE";
            closeBtn.style.cssText = `width: 60px; background: #600; color: #fff; border: none; cursor: pointer;`;

            closeBtn.onclick = function()
            {
                debugContainer.style.display = "none";
            };

            btnBar.appendChild(clearBtn);
            btnBar.appendChild(closeBtn);
            debugContainer.appendChild(logArea);
            debugContainer.appendChild(btnBar);
            document.body.appendChild(debugContainer);
        }

        const logArea = document.getElementById(`${DEBUG_ID}-logs`);
        debugContainer.style.display = "flex";

        const newEntry = document.createElement("div");
        newEntry.style.cssText = `border-bottom: 1px solid #333; padding: 4px 0; white-space: pre-wrap; word-break: break-all;`;
        newEntry.innerHTML = `<span style="color: #888; font-size: 10px;">[${now}]</span> ${text}`;

        logArea.prepend(newEntry);

        if (logArea.childNodes.length > maxNumScreenLogs)
        {
            for (let i = 0; i < 10; ++i)
            {
                if (logArea.lastChild)
                {
                    logArea.removeChild(logArea.lastChild);
                }
            }
        }
    }

    function consoleLog(text, showLog = true)
    {
        if (showLog)
        {
            const dateNow = new Date();
            //const now = dateNow.toISOString();
            const now = dateNow.toLocaleString() + "." + getZeroFilledMillisecs(dateNow);
            console.log(`${now} ${text}`);

            if (showLogToScreen)
            {
                logToScreen(now, text);
            }
        }
    }

    function getMathRandomInteger(val1, val2)
    {
        let min = 0;
        let max = 100;

        const val1IsValid = ((val1 !== undefined) && (val1 !== undefined));
        const val2IsValid = ((val2 !== undefined) && (val2 !== undefined));
        consoleLog(`CY==> BasicLib: getMathRandomInteger - val1IsValid=${val1IsValid}, val2IsValid=${val2IsValid}`);

        if (val1IsValid || val2IsValid)
        {
            if (val1IsValid && val2IsValid)
            {
                min = val1;
                max = val2;
            }
            else
            {
                min = 0;
                max = (val1IsValid ? val1 : val2);
            }
        }

        if (max < min)
        {
            const tmp = min;
            min = max;
            max = tmp;
        }

        consoleLog(`CY==> BasicLib: getMathRandomInteger - min=${min}, max=${max}`);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function generateID()
    {
        // NOTE-1: The function "toString(36)" converts the number to a base-36 string (i.e. a string containing digits 0-9 and letters a-z).
        // NOTE-2: THe function "substring(2)" is used to remove the "0." from the start of the random number string.
        const ID = Date.now().toString(36) + "_" + Math.random().toString(36).substring(2);
        consoleLog(`CY==> BasicLib: generateID - ID='${ID}'`);
        return ID;
    }

    function setInterval2(callback, interval_ms, execCallbackNow)
    {
        // I defined a new "setInterval" function because I want to call the "setInterval" function and then
        // (if required) call immediately the callback function, instead of wait for the first timeout.
        //

        // Call the "setInterval" for the periodic timer.
        consoleLog(`CY==> BasicLib: setInterval2 - STARTING TIMER - interval_ms=${interval_ms}`);
        const timerId = setInterval(callback, interval_ms);
        consoleLog(`CY==> BasicLib: setInterval2 - TIMER STARTED - timerId=${timerId}`);

        if (execCallbackNow)
        {
            // Call immediately the callback function.
            callback(timerId);
        }

        return timerId;
    }

    function textMatchesArray(text, array, index)
    {
        // This function returns true if there is an element in the array that matches with "text".
        //
        // IMPORTANT: The input "index" must be an object with a field named "value". For example:
        //     let index = {value: -1};
        // At the end the "index.value" will contain the index of the element of the array that matched with "text" (or -1 if there is no match).
        //
        for (let i = 0; i < array.length; ++i)
        {
            if (text.startsWith(array[i]))
            {
                index.value = i;
                return true;
            }
        }

        index.value = -1;
        return false;
    }

    function setShowLogToScreen(showLogToScreenIn)
    {
        showLogToScreen = showLogToScreenIn;
    }

    function setMaxNumScreenLogs(maxNumScreenLogsIn)
    {
        maxNumScreenLogs = maxNumScreenLogsIn
    }

    function getVersion()
    {
        return myVersion;
    }

    // Expose the public interface by returning an object.
    window.BasicLib =
    {
        consoleLog:           consoleLog,
        getMathRandomInteger: getMathRandomInteger,
        generateID:           generateID,
        setInterval2:         setInterval2,
        textMatchesArray:     textMatchesArray,
        setShowLogToScreen:   setShowLogToScreen,
        setMaxNumScreenLogs:  setMaxNumScreenLogs,
        getVersion:           getVersion
    };

    consoleLog("CY==> BasicLib: Script loaded");
})();
