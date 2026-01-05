// ==UserScript==
// @name       RelevanceQuest HIT Helper
// @namespace  http://ericfraze.com
// @version    0.8
// @description  (mTurk) Selects all "Non Adult" radio buttons in "Flag images - (WARNING: This HIT may contain adult content. Worker discretion is advised.)" Clicking on an image flags it as explicit. Clicking on an image twice flags it as fetish. Right clicking on an image flags it as gruesome. Middle clicking an image flags it as suggestive.
// @include    https://s3.amazonaws.com/mturk_bulk/hits/*
// @include    https://www.mturkcontent.com/dynamic/hit*
// @copyright  2014+, Eric Fraze
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5609/RelevanceQuest%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5609/RelevanceQuest%20HIT%20Helper.meta.js
// ==/UserScript==

$(document).ready(function() {
    // Make sure we are on the right HIT
    if ( ( $("label[for='illegal_content']:contains('We do our best to prevent illegal content from being included in the task.')").length ) 
                                                                                            && ( $("#__Result1_0[value='PERVERSION']").length ) ) {
        // Check all radi buttons as non-adult
    	$("input[value='NOT_ADULT']").prop('checked', true);
        
        // Check "fetish" on double click
        $("img").dblclick( function() {
            // Check the button
            $(this).parents("td").find("input[value='PERVERSION']").click();

            // Focus so the enter key can submit the HIT
            $(this).parents("td").find("input[value='PERVERSION']").focusWithoutScrolling();

            // Change image opacity so the user knows the script ran correctly
            $(this).css("opacity", "0.6");
        });
        
        // All other mouse clicks
        $('img').mousedown(function(event) {
            switch (event.which) {
                case 1:
                    // Check "Adult" on left click
                    $(this).parents("td").find("input[value='EXPLICIT']").click();
                    $(this).parents("td").find("input[value='EXPLICIT']").focusWithoutScrolling();
                    $(this).css("opacity", "0.6");
                    break;
                case 2:
                    // Check "Suggestive" on middle click
                    $(this).parents("td").find("input[value='SUGGESTIVE']").click();
                    $(this).parents("td").find("input[value='SUGGESTIVE']").focusWithoutScrolling();
                    $(this).css("opacity", "0.6");
                    break;
                case 3:
                    // Check "Gruesome" on right click
                    $(this).parents("td").find("input[value='GRUESOME']").click();
                    $(this).parents("td").find("input[value='GRUESOME']").focusWithoutScrolling();
                    $(this).css("opacity", "0.6");
                    break;
            }
        });

        // Stop right click menu
        document.addEventListener("contextmenu", function(e){
            if (e.target.nodeName === "IMG") {
                e.preventDefault();
            }
        }, false);

        // Stop scrolling on focus of radio button
        $.fn.focusWithoutScrolling = function(){
          var x = window.scrollX, y = window.scrollY;
          this.focus();
          window.scrollTo(x, y);
        };

        // Stop scrolling on middle mouse press
        $(document.body).on("mousedown", function (e) { e.preventDefault(); } );

    }
});