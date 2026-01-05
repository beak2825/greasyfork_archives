// ==UserScript==
// @name       123yourNLP
// @version    1.7
// @description  1-3 to select answers. 4 and 0 move up, 5 and . move down.
// @match      https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/9455/123yourNLP.user.js
// @updateURL https://update.greasyfork.org/scripts/9455/123yourNLP.meta.js
// ==/UserScript==

$(document).ready(function() {
    var count = 1;
    var name = "cap" + count;
    var div = document.getElementsByName(name)[0].parentNode.parentNode;
    div.style.backgroundColor = "#F3E88E";
    div.cells[0].width = "40%";
    div.cells[1].width = "40%";
    $( "input[name='cap" + count + "'][value='correct']" ).focus();
    
	    $(document).keyup(function (event) {
	        var key = toCharacter(event.keyCode);
	        
	        if (key=='1') {
	            $( "input[name='cap" + count + "'][value='correct']" ).prop( "checked", true );
                if (count < 5)
                    count++
                name = "cap" + count;
                div.style.backgroundColor="white";
                div = document.getElementsByName(name)[0].parentNode.parentNode;
                div.style.backgroundColor="#F3E88E";
                $( "input[name='cap" + count + "'][value='correct']" ).focus();
	        }
	        
	        if (key=='2') {
	            $( "input[name='cap" + count + "'][value='maybe']" ).prop( "checked", true );
                if (count < 5)
                    count++
                name = "cap" + count;
                div.style.backgroundColor="white";
                div = document.getElementsByName(name)[0].parentNode.parentNode;
                div.style.backgroundColor="#F3E88E";
                $( "input[name='cap" + count + "'][value='correct']" ).focus();
	        }
	        
	        if (key=='3') {
	            $( "input[name='cap" + count + "'][value='incorrect']" ).prop( "checked", true );
                if (count < 5)
                    count++
                name = "cap" + count;
                div.style.backgroundColor="white";
                div = document.getElementsByName(name)[0].parentNode.parentNode;
                div.style.backgroundColor="#F3E88E";
                $( "input[name='cap" + count + "'][value='correct']" ).focus();
	        }
            
            if (key=='0' || key=='4') {
                if (count > 1)
                    count--
                name = "cap" + count;
                div.style.backgroundColor="white";
                div = document.getElementsByName(name)[0].parentNode.parentNode;
                div.style.backgroundColor="#F3E88E";
                $( "input[name='cap" + count + "'][value='correct']" ).focus();
	        }
            
            if (key=='.' || key=='5' ) {
                if (count < 5)
                    count++
                name = "cap" + count;
                div.style.backgroundColor="white";
                div = document.getElementsByName(name)[0].parentNode.parentNode;
                div.style.backgroundColor="#F3E88E";
                $( "input[name='cap" + count + "'][value='correct']" ).focus();
	        }
            
            //if (key=='ENTER') {
            //    $('#submitButton').click();
            //}
	    });

	    function toCharacter(keyCode) {
			// delta to convert num-pad key codes to QWERTY codes.
			var numPadToKeyPadDelta = 48;

			// if a numeric key on the num pad was pressed.
			if (keyCode >= 96 && keyCode <= 105) {
			    keyCode = keyCode - numPadToKeyPadDelta;
			    return String.fromCharCode(keyCode);
			}

			if (keyCode == 106)
			    return "*";

			if (keyCode == 107)
			    return "+";

			if (keyCode == 109)
			    return "-";

			if (keyCode == 110)
			    return ".";

			if (keyCode == 111)
			    return "/";

			// the 'Enter' key was pressed
			if (keyCode == 13)
			    return "ENTER";  //TODO: you should change this to interpret the 'Enter' key as needed by your app.

			return String.fromCharCode(keyCode);
		}
});