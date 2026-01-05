// ==UserScript==
// @name                Waze Forum Tools
// @author		davielde
// @description         Highlight forum topic text
// @include             https://www.waze.com/forum/*
// @version             0.1.6
// @grant               none
// @namespace https://greasyfork.org/users/5252
// @downloadURL https://update.greasyfork.org/scripts/5712/Waze%20Forum%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/5712/Waze%20Forum%20Tools.meta.js
// ==/UserScript==


function bootstrapWFT()
{
    var bGreasemonkeyServiceDefined = false;
    
    try {
        bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
    }
    catch (err) { /* Ignore */ }
    
    if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
        unsafeWindow    = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }
    
    setTimeout(initializeWFT, 2000);

}

function WFT_ResetTopicCSS(){
    $( 'a.topictitle' )
		.css( "background", "transparent" )
    	.css( "color","#006699")
		;
}

function WFT_ResetButton(){
    $('#WFT_HighlightReset').click(function(e) {
        $('#WFT_HighlightText').val('');
        location.reload(); 
    });
}

function WFT_HighlightTopics(){
    var WFT_highlightInputText = $('#WFT_HighlightText').val();
    var WFT_highlightInputTextLC = WFT_highlightInputText.toLowerCase();
    if(WFT_highlightInputText == 'WFTResetCode'){
        location.reload();
    }
    else{
        console.log('Waze Forum Tools: Highlighting topics containing ' + WFT_highlightInputText);
        $( 'a.topictitle:containsCI(' + WFT_highlightInputText + ')' )
        .css( 'background', 'red' )
        .css( 'color','white')
        ;
        
        $( 'a.topictitle:not(:containsCI(' + WFT_highlightInputText + '))' ).parent().parent().remove();
    }
}

function initializeWFT()
{   
    
    //Extend JQuery CONTAINS to be case-insensitive
    $.extend($.expr[":"], {
        "containsCI": function(elem, i, match, array) {
        return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });
        
    function WFT_SaveOptions(){
        if (localStorage){
            var WFT_Save = [];
            
            var WFT_HighlightTextSave = $('#WFT_HighlightText').val();
            WFT_Save[0] = WFT_HighlightTextSave;
            
            localStorage.setItem('WazeForumTools', JSON.stringify(WFT_Save));
        }
    }
    
    window.addEventListener('beforeunload', WFT_SaveOptions, false);
    
    //add input textbox for highlights only if on forum page, not on thread
    if ($('.posts').length){
        var WFT_highlightInput = $('<input/>')
            .attr({ 
                type: 'text', 
                id: 'WFT_HighlightText', 
                name: 'WFT_HighlightText',
                title: 'Highlight Waze forum thread topics...'
                })
            .css({color: 'grey'})
            .appendTo('.waze-header-contents');
        
        var WFT_highlightReset = $('<input/>')
        	.attr({ 
                type: 'button',
                id: 'WFT_HighlightReset',
                value: 'Clear',
                title: 'Clear topic highlight filter'
            	})
        	.appendTo('.waze-header-contents');
        	
        
        if (localStorage.WazeForumTools) {
            var WFT_Load = JSON.parse(localStorage.getItem('WazeForumTools'));
            WFT_HighlightTextLoad = WFT_Load[0]; 
            $('#WFT_HighlightText').val(WFT_HighlightTextLoad);
    	}
        else{
            $('#WFT_HighlightText').val('Highlight forum topics...');
        }
        
        //evaluate when highlight textbox changes, page loads, or focus changes
        $('#WFT_HighlightText').change(function(e) {
            WFT_ResetTopicCSS();
            WFT_HighlightTopics();            
        });
        
        $('#WFT_HighlightText').focus(function(e) {
            WFT_ResetTopicCSS();   
            WFT_HighlightTopics();  
        });
        
               
    }
    
    WFT_ResetButton();
}

bootstrapWFT();