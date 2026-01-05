// ==UserScript==
// @name       Form Hijack
// @namespace  http://scratch.mit.edu
// @version    1.0
// @description  Sctatch Ext:  Blocks to hijack forms for the purposes of fun
// @match      *://scratch.mit.edu/projects/*
// @author ThistleEverfreen
// @downloadURL https://update.greasyfork.org/scripts/5646/Form%20Hijack.user.js
// @updateURL https://update.greasyfork.org/scripts/5646/Form%20Hijack.meta.js
// ==/UserScript==

function doStuff() {
    (function(ext) {
        // Cleanup function when the extension is unloaded
        ext._shutdown = function() {};

        // Status reporting code
        // Use this to report missing hardware, plugin or unsupported browser
        ext._getStatus = function() {
            return {status: 2, msg: 'Installed'};
        };
        
        // Block and block menu descriptions
        var descriptor = {
            blocks: [
                ['b', 'true', 'returnTrue'],
                ['b', 'false', 'returnFalse'],
                ['r', 'get element %n of form %n', 'formHijackRead', '', ''],
                [' ', 'set element %n of form %n to %s', 'formHijackWrite', '', ''],
                [' ', 'submit form %n', 'formHijackSubmit', '']
            ],

            menus: {
                yesno: ['yes', 'no'],
            }
        };
        
        
        ext.returnTrue = function(){
			return true;
        }
        
        ext.returnFalse = function(){
			return false;
        }
        
     	//Form hijack Read
    	ext.formHijackRead = function(elementIndex, formIndex){
        	if(document.forms[formIndex].elements[elementIndex].getAttribute('type') == 'password'){
                //Dont hijack passwords
                console.log("Stopped attempt to hijack password");
                //Return 12345
                return('12345');
            }
      		else{
        		//Warning label
      			if(document.forms[formIndex].lastChild.innerHTML != 'WARNING: This form has been hijacked'){
					var warningLabel = document.createElement('label');
                	warningLabel.innerHTML = 'WARNING: This form has been hijacked';
                	warningLabel.setAttribute('style', 'font-weight:bold');
                    document.forms[formIndex].appendChild(warningLabel);
        		}
        		//Evil red warning color
      			document.forms[formIndex].elements[elementIndex].setAttribute('style', 'background-color:#FF0000');
                //Return value
                return(document.forms[formIndex].elements[elementIndex].value);
        	}
   		}
    
    	//Form hijack write
    	ext.formHijackWrite = function(elementIndex, formIndex, newValue){
        	if(document.forms[formIndex].elements[elementIndex].getAttribute('type') == 'password'){
                //Dont hijack passwords
                console.log("Stopped attempt to hijack password");
            }
      		else{
        		//Warning label
      			if(document.forms[formIndex].lastChild.innerHTML != 'WARNING: This form has been hijacked'){
					var warningLabel = document.createElement('label');
                	warningLabel.innerHTML = 'WARNING: This form has been hijacked';
                	warningLabel.setAttribute('style', 'font-weight:bold');
                    document.forms[formIndex].appendChild(warningLabel);
        		}
        		//Evil red warning color
      			document.forms[formIndex].elements[elementIndex].setAttribute('style', 'background-color:#FF0000');
                //Change value
                document.forms[formIndex].elements[elementIndex].value = newValue;
        	}
   		}
    	
        //Submit form
        ext.formHijackSubmit = function(formIndex){
            if(confirm('Are you sure you want to submit this form?')){
				document.forms[formIndex].submit();
            }
            else{
				console.log('User pressed cancel');
            }
        }
     
        // Register the extension
        ScratchExtensions.register('Form Hijack', descriptor, ext);
    })({});
}

doStuff();