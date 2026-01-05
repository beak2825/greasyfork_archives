// ==UserScript==
// @name         PI Search Helper Script
// @namespace    https://greasyfork.org/en/users/10782
// @version      0.4111
// @description  Keyword highlighting, keyboard shortcuts and autoselect options. Helper script for PI search in mturk. Disable script when not in use.
// @author       tismyname
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js  
// @include      https://s3.amazonaws.com/*
// @downloadURL https://update.greasyfork.org/scripts/9598/PI%20Search%20Helper%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/9598/PI%20Search%20Helper%20Script.meta.js
// ==/UserScript==

// Makes Instructions Hidable
$(".panel-heading").before('<label id="toggle-label" style="color:#0000EE; "><input type="checkbox" id="toggler"><span>-Show Instructions-<span></input><br></label>')
$(".panel-heading").hide();
$(".panel-body").hide();
var text = $('#toggle-label').text();

// Button to show or hide instructions
$('#toggler').click(function() {
    $(".panel-heading").toggle();
    $(".panel-body").toggle();
    $('#toggle-label').text() == '-Show Instructions-' ? str = '-Hide Instructions-' : str = '-Show Instructions-';
    $('#toggle-label span').html(str);
});    

var ITEMS = 6;
var currentQ = 1;


// Auto Select First Option
for(var i = 1; i <= ITEMS; i++) {
     $('#Q'+i+'_5').click();
     // Quick Fix for the Pi Search with Two Choices
     $('#Q'+currentQ+'_Y').click();
}

// Auto focuses on first radio button
 $('#Q'+currentQ+'_5').focus();

// Sets current clicked element to match keyboard shortcuts
$("input[type=radio]").click(function(){
    currentQ = this.id.charAt(1);
});


// Checks for keypresses
 $(document).keyup(function (event) {
	        var key = toCharacter(event.keyCode);
	                         
	        if (key=='1') {
	            $('#Q'+currentQ+'_5').prop("checked", true);
	            // Quick Fix for the Pi Search with Two Choices
                $('#Q'+currentQ+'_Y').prop("checked", true);
                currentQ++;
	        }
	        
	        if (key=='2') {
                $('#Q'+currentQ+'_4').prop("checked", true);
                // Quick Fix for the Pi Search with Two Choices
                $('#Q'+currentQ+'_Y').prop("checked", true);
                currentQ++;
	        }
	        
	        if (key=='3') {
	           $('#Q'+currentQ+'_3').prop("checked", true);
                currentQ++;
	        }
            
            if (key=='4') {
	           $('#Q'+currentQ+'_2').prop("checked", true);
                currentQ++;
	        }
     
            if (key=='5') {
	           $('#Q'+currentQ+'_1').prop("checked", true);
               currentQ++;
	        } 
     
            if(key=='N' || key=='W') {
                currentQ++;
            }
     
            if(key=='B' || key=='Q') {
                currentQ--;           
            }   
     
            if(currentQ > ITEMS)
            {
                currentQ = 6;
                
            }
            if(currentQ < 1)
            {
                currentQ = 1;
                
            }
            if(key != 'ARROWKEY')
            {
                $('#Q'+currentQ+'_5').focus();
                $('#Q'+currentQ+'_Y').focus();
            }
            
});

// keyboard logic from https://greasyfork.org/en/scripts/5978-mturk-dave-cobb-hit-helper
function toCharacter(keyCode) {
    // delta to convert num-pad key codes to QWERTY codes.
    var numPadToKeyPadDelta = 48;

	// if a numeric key on the num pad was pressed.
	if (keyCode >= 96 && keyCode <= 105) {
        keyCode = keyCode - numPadToKeyPadDelta;
	    return String.fromCharCode(keyCode);
	}
    
    if(keyCode >= 37 && keyCode <= 40)
        return "ARROWKEY";
    
    if (keyCode == 13)
        return "ENTER"; // not sure if I need to add code to hit the submit button
	
    return String.fromCharCode(keyCode);
}


/*
SUPER AWESOME NOT MINE PLUGIN CODE STARTS HERE ====================================================

highlight v5

Highlights arbitrary terms.

<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/
jQuery.fn.highlight = function(pat) {
 function innerHighlight(node, pat) {
  var skip = 0;
  if (node.nodeType == 3) {
   var pos = node.data.toUpperCase().indexOf(pat);
   pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
   if (pos >= 0) {
    var spannode = document.createElement('span');
    spannode.className = 'highlight';
    var middlebit = node.splitText(pos);
    var endbit = middlebit.splitText(pat.length);
    var middleclone = middlebit.cloneNode(true);
    spannode.appendChild(middleclone);
    middlebit.parentNode.replaceChild(spannode, middlebit);
    skip = 1;
   }
  }
  else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
   for (var i = 0; i < node.childNodes.length; ++i) {
    i += innerHighlight(node.childNodes[i], pat);
   }
  }
  return skip;
 }
 return this.length && pat && pat.length ? this.each(function() {
  innerHighlight(this, pat.toUpperCase());
 }) : this;
};

jQuery.fn.removeHighlight = function() {
 return this.find("span.highlight").each(function() {
  this.parentNode.firstChild.nodeName;
  with (this.parentNode) {
   replaceChild(this.firstChild, this);
   normalize();
  }
 }).end();
};
// PLUGIN CODE ENDS  ===================================================

// Adds Styling Class for Highlighting Text
var sheet = document.createElement('style')
sheet.innerHTML = ".highlight { font-weight: bold; background-color: yellow; font-size: 110%;}";
document.body.appendChild(sheet);

// Regex to find keywords to highlight
var match =  $('tbody').text().match(/searched for[: ](.*)/g);

// Loops through matched terms, cleans regex junk and then highlights them
for(var i = 0; i < match.length; i++)
{
    // Remove the noise in front used to find the area
    var cleanedString = match[i].toString().substring(13);
    // Replace any searches with '+' with spaces
    cleanedString = cleanedString.replace(/[+]/g, " ");        
    var words = cleanedString.split(" ");
    
    for(var j = 0; j < words.length; j++)
    {
        var word = words[j];

        // Highlights only first row of each table
        $('tr:eq('+i*2+')').highlight(word);
        
        // If word ends in s, highlight the case without it
        var patt = new RegExp("[s]$");
    	if( patt.test(word) ) {
        	$('tr:eq('+i*2+')').highlight(word.substring(0, word.length - 1));
        }

        // Cases where word ends in 'es'
        patt = new RegExp("es$");
    	if( patt.test(word) ) {
        	$('tr:eq('+i*2+')').highlight(word.substring(0, word.length - 2));
        }
    }
}