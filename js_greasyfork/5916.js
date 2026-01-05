// ==UserScript==
// @name         Twitter Script
// @version      0.3
// @description  helps with the twitter event stuff
// @author       Tjololo12
// @match        https://s3.amazonaws.com/eventeval-akiai7vktywrmkata7ra/Hits_EventEval/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant        none
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/5916/Twitter%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/5916/Twitter%20Script.meta.js
// ==/UserScript==

var buttons = document.getElementsByTagName("button");
var index = buttons.length;
var isButtonClicked = false;
var isTyping = false;
var index = 0;

document.onkeydown = showkeycode;

function stopTyping (){
    console.log("Not typing");
    isTyping = false;
}

function startTyping (){
    console.log("Typing");
    isTyping = true;
}

function showkeycode(evt){
        var keycode = evt.keyCode;
        console.log(keycode);
        switch (keycode) {
            case 192: //`
                var textbox = document.getElementById("topic"+(index+1)+"-sum");
                var texted = true;
                if (textbox){
                    var text = textbox.value;
                    if (text.length == 0){
                        if (textbox.style.display === 'block')
                            texted = false;
                    }
                }
                if (!isButtonClicked && texted){
                    isButtonClicked = true;
                    if (index == buttons.length - 1){
                        if (confirm("Are you sure you want to submit?"))
                            buttons[index].click();
                    }
                    else
                    	buttons[index].click();
                }
                else{
                    if (isButtonClicked)
                        alert("Choose an answer by pressing 1, 2, or 3");
                    if (!texted)
                        alert("Make sure to enter a few keywords in the box");
                }
                break;
            case 49: //1
                if (!isTyping){
                    if (isButtonClicked){
                        document.getElementById("topic"+(index+1)+"-1").click();
                        document.getElementById("topic"+(index+1)+"-sum").focus();
                        document.getElementById("topic"+(index+1)+"-sum").onblur=function(event){stopTyping();};
                        document.getElementById("topic"+(index+1)+"-sum").onfocus=function(event){startTyping();};
                        isTyping = true;
                        isButtonClicked = false;
                        var num = index+1;
                        setTimeout(function(){document.getElementById("topic"+(num)+"-sum").value="";index += 1;},50);
                    }
                    else
                        alert("Hit ` to open the tweet link before selecting an answer.");
                }
                break;
            case 97: //numpad 1
                if (!isTyping){
                    if (isButtonClicked){
                        document.getElementById("topic"+(index+1)+"-1").click();
                        document.getElementById("topic"+(index+1)+"-sum").focus();
                        document.getElementById("topic"+(index+1)+"-sum").onblur=function(event){stopTyping();};
                        document.getElementById("topic"+(index+1)+"-sum").onfocus=function(event){startTyping();};
                        setTimeout(function() {document.getElementById("topic"+(index+1)+"-sum").value="";},200);
                        isTyping = true;
                        isButtonClicked = false;
                        index += 1;
                    }
                    else
                        alert("Hit ` to open the tweet link before selecting an answer.");
                }
                break;
            case 50: //2
                if (!isTyping){
                    if (isButtonClicked){
                        document.getElementById("topic"+(index+1)+"-0").click();
                        isButtonClicked = false;
                        index += 1;
                    }
                    else
                        alert("Hit ` to open the tweet link before selecting an answer.");
                }
                break;
            case 98: //numpad 2
                if (!isTyping){
                    if (isButtonClicked){
                        document.getElementById("topic"+(index+1)+"-0").click();
                        isButtonClicked = false;
                        index += 1;
                    }
                    else
                        alert("Hit ` to open the tweet link before selecting an answer.");
                }
                break;
            case 51: //3
                if (!isTyping){
                    if (isButtonClicked){
                        document.getElementById("topic"+(index+1)+"-2").click();
                        isButtonClicked = false;
                        index += 1;
                    }
                    else
                        alert("Hit ` to open the tweet link before selecting an answer.");
                }
                break;
            case 99: //numpad 3
                if (!isTyping){
                    if (isButtonClicked){
                        document.getElementById("topic"+(index+1)+"-2").click();
                        isButtonClicked = false;
                        index += 1;
                    }
                    else
                        alert("Hit ` to open the tweet link before selecting an answer.");
                }
                break;
            default: break;
        }
}