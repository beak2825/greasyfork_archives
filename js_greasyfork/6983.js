// ==UserScript==
// @name       Rephrase Sarcastic Utterances (Mechanical Turk HIT)
// @namespace  ScriptSpace0034
// @version    0.1.1
// @description  Copies text to rewrite into box to prevent unncessary retyping also auto selects moderate difficulty
// @include    https://www.mturk.com/mturk*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6983/Rephrase%20Sarcastic%20Utterances%20%28Mechanical%20Turk%20HIT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6983/Rephrase%20Sarcastic%20Utterances%20%28Mechanical%20Turk%20HIT%29.meta.js
// ==/UserScript==

$(document).ready(
    function() {
        // find HIT
        if ( $("div#hit-wrapper").find("p.overview:contains('Rephrase Sarcastic Utterances to Represent Actual Meaning')").length ) {
            // Select moderate difficulty
            $("input[value='Selection_Mw--']").prop('checked', true);
            
            var myString = "something format_abc";
            var myRegexp = /Original sarcastic utterance: (.*)/;
            var match = myRegexp.exec( $("div.question-content-wrapper").first().find("p.title").text() );
            $("textarea#Answer_1_FreeText").val(match[1]);
    		
            $("p.radiobutton-wrapper").mousedown(
                function(event) {
                    switch (event.which) {
                        case 1:
                       		$(this).find("input[type='radio']").prop('checked', true);
                            break;
                    }
        		}
       		);
            
        }
    }
);