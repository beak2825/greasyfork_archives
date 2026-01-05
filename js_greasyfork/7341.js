// ==UserScript Library==
// @name            Pardusmonkey Assistance Library (PAL)
// @description     Provides functions to abstract common tasks for Pardus greasemonkey scripts in a cross-browser fashion.
// @version         1
// @author          Richard Broker (Beigeman)
// ==/UserScript Library==

/*
 * Constructor for the PAL Object.
 * scriptName is the name of the script you're registering for use with PAL.
 * scriptKey is a unique key obtainable from the following URL: http://grandunifyingalliance.com/gm/doc/id_generator.php
 */
function PardusMonkey(scriptName, scriptKey)
{
    /* **************************
     * Enums
     * ************************* */
    this.e_logLevel =
    {
        QUIET : 0,
        DEBUG : 1,
        VERBOSE : 2
    };

    this.e_configAttach =
    {
        LEFT : 0,
        RIGHT : 1
    };

    this.e_storageType =
    {
        SESSION : 0,
        LOCAL : 1
    };

    this.e_toastStyle = // Different toast styles.
    {
        SUCCESS : "#BADA55",
        ERROR : "#D7546B",
        NOTIFY : "#E5DE59"
    };

    this.e_pageVar = // Enum to hold common page variables.
    {
        USER_LOC : "userloc",
        NAV_SIZE : "navAreaSize",
        TILE_RES : "tileRes",
        IMG_DIR : "imgDir",
        USER_ID : "userid",
        MILLI_TIME : "milliTime"
    };

    this.e_page = // Enum to hold different pardus pages.
    {
        GAME : "game.php",
        NAV : "main.php",
        BUILDING : "building.php",
        AMBUSH : "ambush.php",
        MSGFRAME : "msgframe.php",
        OVERVIEW : "overview.php",
        ADVANCED_SKILLS : "overview_advanced_skills.php",
        CHAT : "chat.php",
        PLANET : "planet.php",
        STARBASE : "starbase.php",
        BLACK_MARKET : "blackmarket.php",
        PLANET_TRADE : "planet_trade.php",
        BUILDING_TRADE : "building_trade.php",
        STARBASE_TRADE : "starbase_trade.php",
        SHIP_EQUIPMENT : "ship_equipment.php",
        BULLETIN_BOARD : "bulletin_board.php",
        SHIP_2_SHIP : "ship2ship_combat.php",
		SHIP_2_NPC : "ship2opponent_combat.php",
        LOGOUT : "logout.php",
        OPTIONS : "/options.php"
        // #TODO add more of these
        // #TODO ensure functions which might fail when not on specific pages check their location first.
    };

    /* **************************
     * Global Variables
     * ************************* */
     this.g_logLevel = this.e_logLevel.QUIET;
     this.g_scriptName = scriptName;
     this.g_scriptKey = scriptKey;
     this.g_toastDuration_ms = 3000;
     this.g_configInputWidth = "90%";

     /* **************************
     * Private Variables
     * ************************* */
    var priv_document = document;
    var priv_uniqid = (this.g_scriptKey + this.g_scriptName).replace(/\W/g, "_");
    var priv_toastName = priv_uniqid + "pardusMonkeyToast";
    var priv_toastTimeout = null;
    var priv_toastMilliTime = 0;
    var priv_currentToast = null;
    var priv_pageURL = null;
    var priv_partialRefresh = null;
    var priv_div = null;
    var priv_input = null;
    var priv_p = null;
    var priv_span = null;
    var priv_script = null;
    var priv_configObject = null;
    var priv_configValues = [];
    var priv_configCallback = null;
    var priv_userlocIsStale = false;
    var priv_mutationConfig = { attributes : true }; // Config for the PR mutation observer.

    /* **************************
     * Public Functions
     * ************************* */
    /*
     * Storage Class Functions
     */
    this.SetValue = function(name, value, storage)
    {
        if(!name)
        {
            this.DebugLog("(FATAL:SetValue) name parameter is required.", this.e_logLevel.QUIET);
            return;
        }

        name = priv_uniqid + name;

        if (typeof(Storage) !== "undefined")
        {
            value = (typeof value)[0] + value;

            if (storage === this.e_storageType.SESSION)
            {
                storage = sessionStorage;
            }
            else
            {
                storage = localStorage;
            }

            storage.setItem(name, value);
        }
        else
        {
            this.DebugLog("(FATAL:SetValue) HTML5 localStorage support required.", this.e_logLevel.QUIET);
        }
    };

    this.GetValue = function(name, defaultValue, storage)
    {
        if(!name)
        {
            this.DebugLog("(FATAL:GetValue) name parameter is required.", this.e_logLevel.QUIET);
            return null;
        }

        name = priv_uniqid + name;

        if (typeof(Storage) !== "undefined")
        {
            if (name)
            {
                if (storage === this.e_storageType.SESSION)
                {
                    storage = sessionStorage;
                }
                else
                {
                    storage = localStorage;
                }

                var value = storage.getItem(name);

                if ((!value) && defaultValue) return defaultValue;
                if (!value) return null;

                var type = value[0];
                value = value.substring(1);
                switch (type) {
                    case 'b':
                        return value === 'true';
                    case 'n':
                        return Number(value);
                    default:
                        return value;
                }
            }
        }
        else
        {
            this.DebugLog("(FATAL:GetValue) HTML5 localStorage support required.", this.e_logLevel.QUIET);
            return null;
        }
    };

    /*
     * Output Class Functions
     */
    this.DebugLog = function(msg, verbosity)
    {
        if (!msg)
        {
            this.console.log("[" + scriptName + "] (FATAL:DebugLog) : msg parameter is required!");
            return;
        }

        if (verbosity === null)
        {
            verbosity = this.e_logLevel.QUIET;
        }

        if(this.g_logLevel < verbosity)
           return;

        var caller = "";

        try
        {
            caller = arguments.callee.caller.name;
        }
        catch (e) { /* Not the end of the world, we just wont use the function name. */ }

        if (caller !== "")
        {
            console.log("[" + scriptName + "] " + caller.toString() + ": " + msg);
        }
        else
        {
            console.log("[" + scriptName + "] " + msg);
        }
    };

    this.Toast = function(msg, toastStyle)
    {
        var attach = priv_GetToastAttachPoint();
        var toastDiv = attach.getElementById(priv_toastName);

        // In case the msgframe is reloaded while the toast is showing, note the current time.
        priv_toastMilliTime = this.GetPageVariable(this.e_pageVar.MILLI_TIME, attach);
        priv_currentToast = { text:msg, style:toastStyle };

        // No toast has been used yet, so we need to create an element to contain the toasts.
        if(!toastDiv)
        {
            priv_InitialiseToasts();
            toastDiv = attach.getElementById(priv_toastName);
        }

        if (toastDiv)
        {
            if (!toastStyle)
            {
                toastStyle = this.e_toastStyle.SUCCESS;
            }

            if (priv_toastTimeout !== null)
            {
                clearTimeout(priv_toastTimeout);
            }

            toastDiv.innerHTML = '<b>' + this.g_scriptName + '</b>: ' + msg + '&nbsp;&nbsp;';
            toastDiv.style.background = toastStyle;
            toastDiv.style.display = "block";
            toastDiv.style.opacity = 1;
            priv_toastTimeout = setTimeout(priv_CloseToast, this.g_toastDuration_ms);
        }
        else
        {
            this.DebugLog("(FATAL:Toast) Unable to locate toast div");
        }
    };

    /*
     * Utility Class Functions
     */
    // Derived from Victoria Axworthy's trick for cross browser userloc retrieval.
    this.GetPageVariable = function(variableName, doc)
    {
        var stripQuotes = false;

        if(!variableName)
        {
            this.DebugLog("(FATAL:GetPageVariable) variableName parameter is required.", this.e_logLevel.QUIET);
            return null;
        }

        if (!doc)
        {
            doc = priv_document;
        }

        if ((variableName === this.e_pageVar.USER_LOC) && (priv_userlocIsStale === true))
        {
            /* Update the userloc variable store in the pardus source, so that GetPageVariable() doesn't break. */
            ExecuteInPage(priv_UpdateUserLoc.toString() + "\npriv_UpdateUserLoc();");
            priv_userlocIsStale = false;
        }
        else if (variableName === this.e_pageVar.IMG_DIR)
        {
            stripQuotes = true;
        }

        variableName += " = ";

        // We avoid using unsafeWindow by reading the actual script text embedded in the Pardus HTML.
        var scripts = doc.getElementsByTagName('script');
        for(var i = 0; i < scripts.length; i++)
        {
            if(!scripts[i].src)
            {
                if(scripts[i].textContent.indexOf(variableName) !== -1)
                {
                    var line = scripts[i].textContent.split(variableName)[1];
                    var pageVar = line.split(';')[0];

                    if (pageVar)
                    {
                        // These will always be string types probably. #TODO #FIXME
                        var type = (typeof pageVar)[0];
                        switch (type)
                        {
                            case 'boolean':
                                return pageVar === 'true';
                            case 'number':
                                return Number(pageVar);
                            default:
                                if (stripQuotes === true)
                                {
                                    pageVar = pageVar.replace(/\"/g, '');
                                }
                                return pageVar;
                        }
                    }
                }
            }
        }
        return null;
    };

    this.ExecuteInPage = function(sJavascript)
    {
        var script = priv_CreateScript();
        script.textContent = sJavascript;
        priv_document.body.appendChild(script);
        priv_document.body.removeChild(script);
    };

    this.GetUniverseName = function()
    {
        return priv_document.location.hostname.substr(0, priv_document.location.hostname.indexOf('.'));
    };

    /* In the event that the cached "document" is out of date due to DOM manipulations in the user script, this call can be used to update the cached copy.
     This method should also reset any other values which have been cached, so the next time they are requested they will be regenerated.
    */
    this.UpdateCache = function()
    {
        priv_document = document;
        priv_pageURL = null;
        priv_div = null;
        priv_input = null;
        priv_p = null;
        priv_span = null;
    };

    this.PageIs = function(page)
    {
        if (priv_pageURL === null)
        {
            priv_pageURL = priv_document.location.href.substr(priv_document.location.href.lastIndexOf('/'), priv_document.location.href.length);
        }

        if (priv_pageURL.indexOf(page) < 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };

    /*
     * Partial Refresh Class Functions
     */
    this.PREnabled = function()
    {
        if (priv_partialRefresh === null)
        {
            if (priv_document.getElementById('nav'))
            {
                priv_partialRefresh = true;
            }
            else
            {
                priv_partialRefresh = false;
            }
        }

        return priv_partialRefresh;
    };

    /* We attach to the AP counter because if we attach to something like document.body and watch for events
       in the whole subtree, then other scripts changing things will fire off this observer. If both scripts
       are using an observer, then they will enter an infinite loop on each other's changes. */
    this.AddPRCallback = function(callbackFunction)
    {
        if (!callbackFunction)
        {
            this.DebugLog("(FATAL:AddPRCallback) callbackFunction parameter is required.");
            return;
        }

        var mutationTarget = priv_document.getElementById('apsleft');

        if (this.PageIs(this.e_page.NAV) && (mutationTarget))
        {
            /* Initialise the obeserver for the first click */
            PRObserver = new MutationObserver(function(mutations) {

                /* Prevent function running multiple times per click. */
                PRObserver.disconnect();

                /* Ensure anything we have cached about the current page is refreshed on
                next use. */
                UpdateCache();

                /* Ensure getPageVariable knows that the userloc needs updating next time it runs. */
                priv_userlocIsStale = true;

                /* Run the function to do whatever we want. */
                callbackFunction();

                /* Initialise a new observer for subsequent nav clicks. */
                var newTarget = priv_document.getElementById('apsleft');
                if(newTarget)
                {
                    PRObserver.observe(newTarget, priv_mutationConfig);
                }
                else
                {
                    this.DebugLog("(FATAL:priv_addPRCallback) Unable to attach to AP Counter body for Partial Refresh detection.", this.e_logLevel.QUIET);
                }
            });

            PRObserver.observe(mutationTarget, priv_mutationConfig);
        }
        else
        {
            this.DebugLog("(FATAL:priv_addPRCallback) Unable to attach to AP Counter body for Partial Refresh detection.", this.e_logLevel.QUIET);
        }
    };

    /*
     * Configuration Class Functions
     */
     this.AddConfiguration = function(arrConfigItems, eAttachment, sTitle, fSaveCallback, oConfigObject)
     {
        if (!this.PageIs(this.e_page.OPTIONS))
        {
            this.DebugLog("(FATAL:AddConfiguration) Configuration can only be called from " + this.e_page.OPTIONS, this.e_logLevel.QUIET);
            return;
        }

        var configDivRows = [];

        if (oConfigObject !== null)
        {
            if ((priv_configObject === null) || (priv_configObject === oConfigObject))
            {
                priv_configObject = oConfigObject;
            }
            else
            {
                this.DebugLog("(WARNING:AddConfiguration) Attempted to add a new configuration object, you must use the same object for all configuration forms!", this.e_logLevel.QUIET);
            }
        }
        else
        {
            this.DebugLog("(WARNING:AddConfiguration) oConfigObject is null", this.e_logLevel.QUIET);
        }

        for (var i = 0; i < arrConfigItems.length; i++)
        {
            var div = null;
            var key = null;
            var description = null;
            var initialValue = null;
            var arrOptions = null;
			var arrOptionStrings = null;

            if (arrConfigItems[i].length >= 1)
            {
                description = arrConfigItems[i][0];
            }
            if (arrConfigItems[i].length >= 2)
            {
                key = arrConfigItems[i][1];
                initialValue = priv_GetProperty(key, priv_configObject);
                priv_configValues.push(key);
            }
            if (arrConfigItems[i].length >= 3)
            {
                arrOptions = arrConfigItems[i][2];
				
				if (arrConfigItems[i].length >= 4)
					arrOptionStrings = arrConfigItems[i][3];
            }

            // This is not a text or spacer object.
            if (initialValue !== null)
            {
                if (description === null)
                {
                    this.DebugLog("FATAL:AddConfiguration) Description value for config object at index " + i + " must be set.");
                    return;
                }

                // if arrOptions is set assume select box
                if (arrOptions !== null)
                {
                    div = priv_CreateSelectBox(key, description, initialValue, arrOptions, arrOptionStrings);
                }
                else
                {
                    switch (typeof initialValue)
                    {
                        case "boolean":
                            div = priv_CreateCheckBox(key, description, initialValue);
                            break;

                        case "number":
                            // Don't let this fall through to the "string" case because we don't want to confuse
                            // char and number handling, and it's perfectly valid to have a 1-digit number.
                            div = priv_CreateTextBox(key, description, initialValue, true);
                            break;

                        case "string":
                            if (initialValue.length === 1)
                            {
                                div = priv_CreateCharBox(key, description, initialValue, false);
                            }
                            else
                            {
                                div = priv_CreateTextBox(key, description, initialValue, false);
                            }
                            break;

                        default:
                            this.DebugLog("(WARNING:AddConfiguration) Unsupported type " + typeof initialValue + " at index " + i);
                            continue;
                    }
                }
            }
            else if (description)
            {
                div = priv_CreateText(description);
            }
            else
            {
                div = priv_CreateSpacer();
            }

            if (div !== null)
            {
                configDivRows.push(div);
            }
        }

        var attachPoint = null;
        var configDiv = priv_GetConfigDiv(sTitle);
        var saveButton = priv_document.createElement('input');

        /* Hold on to the callback, it will be called after priv_SaveConfig has modified the original object vlaues. */
        if (fSaveCallback !== null)
        {
            priv_configCallback = fSaveCallback;
        }

        saveButton.type = "submit";
        saveButton.value = "Save";
        saveButton.addEventListener('click', priv_SaveConfig);

        var auntieScriptWorkAround = priv_document.getElementById('Table_Options');
        if (auntieScriptWorkAround !== null)
        {
            if (eAttachment === this.e_configAttach.RIGHT)
            {
                attachPoint = auntieScriptWorkAround.getElementsByTagName('table')[0].rows[0].cells[2];
            }
            else
            {
                attachPoint = auntieScriptWorkAround.getElementsByTagName('table')[0].rows[0].cells[0];
            }
        }
        else
        {
            if (eAttachment === this.e_configAttach.RIGHT)
            {
                attachPoint = priv_document.getElementsByTagName('table')[3].rows[0].cells[2];
            }
            else
            {
                attachPoint = priv_document.getElementsByTagName('table')[3].rows[0].cells[0];
            }
        }

        configDiv.appendChild(priv_CreateSpacer());

        for (var i = 0; i < configDivRows.length; i++)
        {
            configDiv.appendChild(configDivRows[i]);
        }

        configDiv.appendChild(priv_CreateSpacer());
        configDiv.appendChild(saveButton);

        attachPoint.appendChild(priv_CreateSpacer());
        attachPoint.appendChild(priv_CreateSpacer());
        attachPoint.appendChild(configDiv);
     };

    this.GetConfigElement = function(sKey)
    {
        var unique_id = priv_uniqid + sKey;
        return priv_document.getElementById(unique_id);
    };


    /* **************************
     * Private Functions
     * ************************* */
     // Returns true if the key is valid, otherwise false.
     priv_IsScriptKeyValid = function(key)
     {
        if (key.length !== 16)
        {
            this.DebugLog("(FATAL:Constructor) scriptKey parameter must be 16 characters long.", this.e_logLevel.QUIET);
            return false;
        }
        if (key.slice(0,3) !== "PAL")
        {
            this.DebugLog("(FATAL:Constructor) scriptKey parameter must start with 'PAL'.", this.e_logLevel.QUIET);
            return false;
        }
        if (!(/^[0-9A-F]+$/i.test(key.slice(3, key.length))))
        {
            this.DebugLog("(FATAL) scriptKey parameter must be the word 'PAL' followed by 13 hexadecimal characters.", this.e_logLevel.QUIET);
            return false;
        }
        return true;
     };

    /*
     * Functions for Toast Notifications
     */
     priv_InitialiseToasts = function()
     {
        var attach = priv_GetToastAttachPoint();
        var styleTag = attach.createElement('style');
        styleTag.type = "text/css";
        styleTag.media = "screen";

        styleTag.innerHTML = "#" + priv_uniqid + "pardusMonkeyToast { cursor: pointer; border-color: #DDD; border-style: solid; border-radius: 2px; color: #222; width: 50%; margin: 0 auto; position: fixed; z-index: 101; top: 0; left: 0; right: 0; background: " + this.e_toastStyle.SUCCESS + ";text-align: center; line-height: 2.5; overflow: hidden; -webkit-box-shadow: 0 0 5px black; -moz-box-shadow: 0 0 5px black; box-shadow: 0 0 5px black; display: none;} ";

        var toastDiv = attach.createElement('div');
        toastDiv.id = priv_toastName;
        toastDiv.innerHTML = this.g_scriptName + ': No messages available.';
        toastDiv.addEventListener('click', priv_CloseToast, false);

        attach.head.appendChild(styleTag);
        attach.body.appendChild(toastDiv);
     };

     priv_CloseToast = function()
     {
        var attach = priv_GetToastAttachPoint();
        var toastDiv = attach.getElementById(priv_toastName);
        var timeNow = GetPageVariable(e_pageVar.MILLI_TIME, attach);

        if (timeNow !== priv_toastMilliTime)
        {
            // If the frame was reloaded while we were showing the Toast, show it again in case the user
            // didn't have time to read it.
            Toast(priv_currentToast.text, priv_currentToast.style);
        }
        else
        {
            if(toastDiv)
            {
               toastDiv.style.display = "none";
            }
            else
            {
                console.log("[PardusMonkey]: (FATAL:priv_CloseToast) Unable to locate notification div with ID: " + priv_toastName);
            }
        }
     };

     priv_GetToastAttachPoint = function()
     {
        // window.content.frames doesn't work in PR mode, window object is hella messed up. Damn AJAX. :o
        if (this.PREnabled())
            return priv_document;

        try
        {
            return window.content.frames.msgframe.document;
        }
        catch (e){}

        return priv_document;
     };

     priv_IsNumber = function(n)
     {
        n = n.replace(/,/,".");
        return (!isNaN(parseFloat(n)) && isFinite(n));
     };

     /*
      * Private Partial Refresh Functions
      */
    function priv_UpdateUserLoc()
    {
        var scripts = document.getElementsByTagName('head')[0].getElementsByTagName('script');

        for (var i = 0; i < scripts.length; i++)
        {
            if(!scripts[i].src)
            {
                if(scripts[i].textContent.indexOf("userloc") !== -1)
                {
                    scripts[i].textContent = scripts[i].textContent.replace(/userloc = (\d+);/, "userloc = " + userloc + ";");
                   break;
                }
            }
        }
    }

     /*
      * Private Config Functions
      */
    priv_CreateSpacer = function()
    {
        return priv_document.createElement('br');
    };

    priv_CreateCheckBox = function(sKey, sDescription, bInitialValue)
    {
        var tr = priv_document.createElement('tr');
        var input = priv_document.createElement('input');
        var label = priv_document.createElement('label');
        var unique_id = priv_uniqid + sKey;

        input.id = unique_id;
        input.type = "checkbox";
        input.value = unique_id;
        label.setAttribute('for', unique_id);
        label.textContent = sDescription;

        input.checked = bInitialValue;

        tr.appendChild(input);
        tr.appendChild(label);
        return tr;
    };

     priv_CreateTextBox = function(sKey, sDescription, sInitialValue, bNumber)
     {
        var div = priv_CreateDiv();
        var input = priv_CreateInput();
        var label = priv_document.createElement('label');
        var unique_id = priv_uniqid + sKey;

        label.setAttribute('for', unique_id);
        label.textContent = sDescription;

        input.id = unique_id;
        input.type = "text";
        input.style.width = this.g_configInputWidth;
        if (sInitialValue) input.value = sInitialValue;
        if (bNumber === true) input.className = "number";

        div.appendChild(label);
        div.appendChild(input);
        return div;
     };

     priv_CreateSelectBox = function(sKey, sDescription, nInitialValue, arrData, arrDataStrings)
     {
        var div = priv_CreateDiv();
        var select = priv_document.createElement('select');
        var label = priv_document.createElement('label');
        var unique_id = priv_uniqid + sKey;
        var option;

        label.setAttribute('for', unique_id);
        label.textContent = sDescription;

        select.id = unique_id;
        select.style.width = this.g_configInputWidth;

        for (var i = 0; i < arrData.length; i++)
        {
            option = priv_document.createElement('option');
			
			if ((arrDataStrings == null) || (arrDataStrings.length != arrData.length))
				option.textContent = arrData[i];
			else
				option.textContent = arrDataStrings[i];
				
            option.value = arrData[i];
            select.appendChild(option);
        }

        if (nInitialValue) select.value = nInitialValue;

        div.appendChild(label);
        div.appendChild(select);
        return div;
     };

     priv_CreateCharBox = function(sKey, sDescription, cInitialValue)
     {
        var div = priv_CreateDiv();
        var span = priv_CreateSpan();
        var tb = priv_CreateInput();
        var unique_id = priv_uniqid + sKey;

        span.innerHTML = sDescription;
        span.style.marginLeft = "5px";
        tb.type = "text";
        tb.id = unique_id;
        tb.maxLength = "1";
        tb.style.width = "25px";
        tb.style.textAlign = "center";
        tb.setAttribute("onclick","this.focus(); this.select();");

        if (cInitialValue) tb.value = cInitialValue;

        div.style.marginBottom = "4px";

        div.appendChild(tb);
        div.appendChild(span);
        return div;
     };

     priv_CreateText = function(sText)
     {
        var div = priv_CreateDiv();

        div.innerHTML = sText;

        return div;
     };

     priv_GetConfigDiv = function(sTitle)
     {
        var div = priv_CreateDiv();
        var headerDiv = priv_CreateDiv();

        div.width = "100%";
        div.style.padding = "5px";
        div.style.backgroundImage = "url(http://static.pardus.at/img/stdhq/bgd.gif)";

        headerDiv.innerHTML = "<b>" + this.g_scriptName + " - " + sTitle + "</b>";
        headerDiv.setAttribute('style', 'background:none repeat scroll 0 0 #600; color:#CCC; padding: 4px; margin: -5px; text-align: center;');

        div.appendChild(headerDiv);

        return div;
     };

     /* Creating new elements is slower than cloning, so cache the element we create and just return a clone of it. */
     priv_CreateDiv = function()
     {
        if (priv_div === null)
        {
            priv_div = priv_document.createElement('div');
        }

        return priv_div.cloneNode(true);
     };

     priv_CreateInput = function()
     {
        if (priv_input === null)
        {
            priv_input = priv_document.createElement('input');
        }

        return priv_input.cloneNode(true);
     };

     priv_CreateParagraph = function()
     {
        if (priv_p === null)
        {
            priv_p = priv_document.createElement('p');
        }

        return priv_p.cloneNode(true);
     };

     priv_CreateScript = function()
     {
        if (priv_script === null)
        {
            priv_script = priv_document.createElement('script');
        }

        return priv_script.cloneNode(true);
     };

     priv_CreateSpan = function()
     {
        if (priv_span === null)
        {
            priv_span = priv_document.createElement('span');
        }

        return priv_span.cloneNode(true);
     };

     priv_SaveConfig = function()
     {
        for (var i = 0; i < priv_configValues.length; i++)
        {
            var key = priv_configValues[i];
            var item = priv_document.getElementById(priv_uniqid + key);

            if (item)
            {
               switch (typeof priv_GetProperty(key, priv_configObject))
               {
                    case "boolean":
                        priv_SetProperty(key, priv_configObject, item.checked);
                        break;
                    case "string":
                        if ((item.className === "number") && (!priv_IsNumber(item.value)))
                        {
                            Toast("Value for " + key + " must be numeric", e_toastStyle.ERROR);
                            return;
                        }
                        else
                        {
                            priv_SetProperty(key, priv_configObject, item.value);
                        }
                        break;
                    case "number":
                        priv_SetProperty(key, priv_configObject, item.value);
                        break;
                     default:
                        DebugLog("Unable to determine property type: " + key + ":" + typeof priv_GetProperty(key, priv_configObject), e_logLevel.QUIET);
                     break;
               }
            }
            else
            {
                DebugLog("(FATAL:priv_SaveConfig) Unable to locate element for ID: " + priv_uniqid + key, e_logLevel.QUIET);
            }
        }

        /* Allow the author to save whatever we just changed. */
        if (priv_configCallback instanceof Function)
        {
            priv_configCallback();
        }
        else
        {
            DebugLog("(FATAL:priv_SaveConfig) user defined callback function is not a function!", e_logLevel.QUIET);
        }
     };

     priv_GetProperty = function(propName, object)
     {
        return object[propName];
     };

     priv_SetProperty = function(propName, object, value)
     {
        object[propName] = value;
     };

    /* **************************
     * PardusMonkey Constructor
     * ************************* */
     // Ensure the key is a valid PAL key before returning a valid object.
    if (!priv_IsScriptKeyValid(scriptKey))
    {
        return null;
    }

    return this;
}