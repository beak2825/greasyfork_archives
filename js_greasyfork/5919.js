// ==UserScript==
// @name         (mTurk) ProductRnR HIT Helper 
// @namespace    http://ericfraze.com
// @version      0.2
// @description  (mTurk) Selects "Non-Adult" for all images. Click the image to flag. Left mouse selects "Explicit". Double click (left mouse) selects "Hard-Core". Right mouse selects "Suggestive". Double click (right mouse) selects "Educational Nudity". Middle mouse reverts back to "Non-Adult".
// @author       Eric Fraze
// @match    https://s3.amazonaws.com/mturk_bulk/hits/*
// @match    https://www.mturkcontent.com/dynamic/hit*
// @grant        none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5919/%28mTurk%29%20ProductRnR%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5919/%28mTurk%29%20ProductRnR%20HIT%20Helper.meta.js
// ==/UserScript==

$(document).ready(function() {
	// Make sure we are on the right HIT
	if ( $("label.style2:contains('We are doing our best to keep illegal content out of this task.')").length ) {

		// Select non-adult as default
		$("input[value='notadult']").click();

		// Detect mouse clicks
		$('.imagebox').mouseup(function (evt) {
			var par = $(this).parent();
			if (evt.which === 1) { // left-click
				if (evt.originalEvent.detail === 2) {
					$("input[value='hardcore']", par).click();
					$("#SubmitButton").focusWithoutScrolling();
				} else if (evt.originalEvent.detail === 1) {
					$("input[value='explicit']", par).click();
					$("#SubmitButton").focusWithoutScrolling();
				}
			}

			if (evt.which === 2) { // middle-click
				if (evt.originalEvent.detail === 1) {
					$("input[value='notadult']", par).click();
					$("#SubmitButton").focusWithoutScrolling();
				}
			}

			if (evt.which === 3) { // right-click
				if (evt.originalEvent.detail === 2) {
					$("input[value='educationalnudity']", par).click();
					$("#SubmitButton").focusWithoutScrolling();
				} else if (evt.originalEvent.detail === 1) {
					$("input[value='erotic']", par).click();
					$("#SubmitButton").focusWithoutScrolling();
				}
			}
		});

		// Disable image link and make a new link under the image.
		$(".imagebox").filter(function(index) {
			var url = $("a", this).attr("href");
			$(this).after("<a href='" + url + "' target='_blank'>Open full image</a>");
			$("a", this).removeAttr("href");
			$("a", this).removeAttr("target");
		});

		// suppress the right-click menu
		$('.imagebox').on('contextmenu', function (evt) {
			evt.preventDefault();
		});

		// Stop scrolling on focus of radio button
		$.fn.focusWithoutScrolling = function(){
		  var x = window.scrollX, y = window.scrollY;
		  this.focus();
		  window.scrollTo(x, y);
		};

		// Stop scrolling on middle mouse press
		$(".imagebox").on("mousedown", function (e) { e.preventDefault(); } );
	}
});