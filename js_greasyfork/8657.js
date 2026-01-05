// ==UserScript==
// @name         TweetDeck Sizer
// @namespace    http://twitter.com/DikUln
// @version      1.1
// @description  Небольшой подарок любимой Ивичке
// @author       DikUln
// @match        https://tweetdeck.twitter.com/
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/8657/TweetDeck%20Sizer.user.js
// @updateURL https://update.greasyfork.org/scripts/8657/TweetDeck%20Sizer.meta.js
// ==/UserScript==

function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;
 
    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);
 
    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;
 
            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }
 
    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];
 
    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

waitForKeyElements (
            "div.js-app-content"
            , createWidthSelectors
        );

function createWidthSelectors(){
    var columns = $(".js-column");
    for (var i = 0; i < columns.length; i++) { $(columns[i]).addClass("column_" + i) };
    if (GM_getValue("column_0") != undefined) { $(".column_0").css("width", GM_getValue("column_0") ); };
    if (GM_getValue("column_1") != undefined) { $(".column_1").css("width", GM_getValue("column_1") ); };
    if (GM_getValue("column_2") != undefined) { $(".column_2").css("width", GM_getValue("column_2") ); };
    if (GM_getValue("column_3") != undefined) { $(".column_3").css("width", GM_getValue("column_3") ); };
    if (GM_getValue("column_4") != undefined) { $(".column_4").css("width", GM_getValue("column_4") ); };
    if (GM_getValue("column_5") != undefined) { $(".column_5").css("width", GM_getValue("column_5") ); };
    if (GM_getValue("column_6") != undefined) { $(".column_6").css("width", GM_getValue("column_6") ); };
    if (GM_getValue("column_7") != undefined) { $(".column_7").css("width", GM_getValue("column_7") ); };
       
    $(".js-column-options").on('DOMNodeInserted', 
function(e) { 
  if ($(e.target).is('.facet-type-thumb-size')) { 
      
    var options = $(".js-column-options");
    for (var i = 0; i < options.length; i++) { 
    if ($(".column_" + i + " .js-column-size").length == 0) {
    $(options[i]).find("fieldset:eq(1)").after('<fieldset class="js-column-size"><div class="facet-type facet-type-thumb-size"> <div class="accordion-header not-actionable link-clean block cf txt-base-medium"> <div class="obj-left facet-title"> <i class="icon icon-arrow-r-double facet-type-icon icon-small"></i> <span class="txt-base-smallest">Width</span> </div> <div class="facet-subtitle nbfc"><input id="widthRange_' + i + '" type="range" min="250" max="750" style="width: 150px; height: 10px"></div> </div> </div></fieldset>'); 
    }
    }
    
      $("#widthRange_0").val($(".column_0").width());
      $("#widthRange_1").val($(".column_1").width());
      $("#widthRange_2").val($(".column_2").width());
      $("#widthRange_3").val($(".column_3").width());
      $("#widthRange_4").val($(".column_4").width());
      $("#widthRange_5").val($(".column_5").width());
      $("#widthRange_6").val($(".column_6").width());
      $("#widthRange_7").val($(".column_7").width());
    
    $("#widthRange_0").change(function() { $(".column_0").css("width", $(this).val() ); GM_setValue("column_0", $(this).val()) } );
    $("#widthRange_1").change(function() { $(".column_1").css("width", $(this).val() ); GM_setValue("column_1", $(this).val()) } );
    $("#widthRange_2").change(function() { $(".column_2").css("width", $(this).val() ); GM_setValue("column_2", $(this).val()) } );
    $("#widthRange_3").change(function() { $(".column_3").css("width", $(this).val() ); GM_setValue("column_3", $(this).val()) } );
    $("#widthRange_4").change(function() { $(".column_4").css("width", $(this).val() ); GM_setValue("column_4", $(this).val()) } );
    $("#widthRange_5").change(function() { $(".column_5").css("width", $(this).val() ); GM_setValue("column_5", $(this).val()) } );
    $("#widthRange_6").change(function() { $(".column_6").css("width", $(this).val() ); GM_setValue("column_6", $(this).val()) } );
    $("#widthRange_7").change(function() { $(".column_7").css("width", $(this).val() ); GM_setValue("column_7", $(this).val()) } );
  } 
});
    
};