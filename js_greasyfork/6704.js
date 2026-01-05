// ==UserScript==
// @name        CH MTurkContent Y-N HIT Improvements
// @author      clickhappier
// @namespace   clickhappier
// @description Y/N with confirm and sticky header for SET Master (y/n), Machine Learning (s/t).
// @version     1.4.4c
// @match       https://www.mturkcontent.com/dynamic/hit*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/6704/CH%20MTurkContent%20Y-N%20HIT%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/6704/CH%20MTurkContent%20Y-N%20HIT%20Improvements.meta.js
// ==/UserScript==


// based on https://greasyfork.org/en/scripts/6266-zing-receipt-compare-script


document.addEventListener("keydown", showkeycode, false);


// sticky heading

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

if ( $("a#title[href='http://www.set.tv/']") ){  // verify this is a SET Master HIT
    addGlobalStyle('div#description { width: 100% !important;  position: relative !important;  top: 0px !important;  background-color: #FFFFFF !important;  margin-left: 0px !important; }');
    addGlobalStyle('p#instructions { width: 100% !important;  position: fixed !important;  z-index: 999 !important;  top: 0px !important;  left: 0px !important;  background-color: #FFFFFF !important;  margin-left: 0px !important; }');
}
else if ( $("#TranscriptionFromAnImage") ){  // verify this is a Machine Learning HIT
    addGlobalStyle('h4 { width: 100%;  position: fixed;  top: 0px;  background-color: #FFFFFF; }');
}



// for SET Master

var radiosSET = document.getElementsByTagName("input");
var buttonSET = document.getElementById("submitButton");
var submitButSET = buttonSET;

var taskTypeSET;
    if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Does this webpage contain") > -1 )  // Web Page Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Does this webpage contain", "a webpage containing").replace("content related to ", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Does this web page contain") > -1 )  // Web Page Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Does this web page contain", "a webpage containing").replace("content related to ", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Is this content related to") > -1 )  // Web Page Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Is this content related to", "a webpage containing").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Does this webpage has content related to") > -1 )  // Web Page Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Does this webpage has content related to", "a webpage containing").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Does this webpage content about") > -1 )  // Web Page Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Does this webpage content about", "a webpage containing").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Is the content of this page mainly POSITIVE in sentiment?") > -1 )  // Web Page Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Is the content of this page", "a webpage containing content").replace("A sentiment is a view or attitude towards a thing, situation, event, thing etc. Eg: Positive - \"Company A's stock has performed well in the past year\" Negative - \"This is a terrible song\" Neutral - \"How to fix your PC\" with no comments", "").trim();
    }
    
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Does this video collage contain") > -1 )  // Image Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Does this video collage contain", "a video collage containing").replace("content related to ", "").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Is this video collage about") > -1 )  // Image Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Is this video collage about", "a video collage containing").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Is this video about") > -1 )  // Image Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Is this video about", "a video collage containing").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Does this collage contain") > -1 )  // Image Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Does this collage contain", "a video collage containing").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Does this video contain") > -1 )  // Image Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Does this video contain", "a video collage containing").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Are these images related to") > -1 )  // Image Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Are these images related to", "a video collage containing").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Are these images about") > -1 )  // Image Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Are these images about", "a video collage containing").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Do these images show") > -1 )  // Image Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Do these images show", "a video collage containing").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Are frames in this") > -1 )  // Image Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Are frames in this video collage", "a video collage containing").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Are all frames in this") > -1 )  // Image Categorization
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Are all frames in this video collage", "a video collage containing all").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Click on all the images where") > -1 )  // Clickable Image Tagging
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Click on all the", "").replace('Please select the "No Matches" checkbox if there are no such images. The images will turn gray when you click them.', "").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Click on the images that contain") > -1 )  // Clickable Image Tagging
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Click on the", "").replace('Please select the "No Matches" checkbox if there are no such images. The images will turn gray when you click them.', "").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Click on all the images that contain") > -1 )  // Clickable Image Tagging
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Click on all the", "").replace('Please select the "No Matches" checkbox if there are no such images. The images will turn gray when you click them.', "").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Click on the images that have") > -1 )  // Clickable Image Tagging
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Click on the", "").replace('Please select the "No Matches" checkbox if there are no such images. The images will turn gray when you click them.', "").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Click on the images whose content is related to") > -1 )  // Clickable Image Tagging
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Click on the images whose content is related to", "images that contain content related to").replace('Please select the "No Matches" checkbox if there are no such images. The images will turn gray when you click them.', "").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("example logo") > -1 )  // Clickable Image Tagging
    {
        taskTypeSET = document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").replace("Please click on the images that contain", "images that contain").replace("The example logo might be slightly different from the logo in the red box", "").replace('Please select the "No Matches" checkbox if there are no such images. The images will turn gray when you click them.', "").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }
    else if ( document.querySelector("p#instructions").textContent.replace(/  /g, " ").replace(/  /g, " ").indexOf("Please read the") > -1 )
    {
        taskTypeSET = document.querySelector("p#instructions").replace(/  /g, " ").replace(/  /g, " ").replace("Please read the", "").replace("FAQ", "").replace("if you have any questions.", "").trim();
    }


// for Machine Learning

var radiosML = document.getElementsByTagName("input");
var buttonML = document.getElementById("submitButton");
var submitButML = buttonML;

/* for (i = 0; i < buttonML.length; i++) {
    if (buttonML[i].type == "submit") {
        submitButML = buttonML[i];
    }
} */

var taskTypeML;
    if ( document.querySelector(".panel-heading").textContent.indexOf("Login") > -1 )
    {
        taskTypeML = "a properly-labeled LOGIN form";
    }
    else if ( document.querySelector(".panel-heading").textContent.indexOf("Sign") > -1 )
    {
        taskTypeML = "a properly-labeled SIGN-UP form";
    }




// SET Master: press n for no, y for yes, o for no matches on SET clickable images hits
// Machine Learning: press t for no, s for yes

function showkeycode(evt){

   if ( ( $("a#title[href='http://www.set.tv/']") ) || ( $("#TranscriptionFromAnImage") ) )
   {  // verify this is a SET Master or Machine Learning HIT

        var keycode = evt.keyCode;
        switch (keycode) {
        
            case 78: //n for SET
                   for (i = 0; i < radiosSET.length; i++) {
                      if (radiosSET[i].type == "radio"){
                        if (radiosSET[i].value == "no") {
                            radiosSET[i].click();
                            if (confirm("Are you sure this is NOT " + taskTypeSET)) submitButSET.click();
                    }
                }
            }
            break;
            
            case 89: //y for SET
                for (i = 0; i < radiosSET.length; i++) {
                    if (radiosSET[i].type == "radio"){
                        if (radiosSET[i].value == "yes") {
                            radiosSET[i].click();
                               if (confirm("Are you sure this IS " + taskTypeSET)) submitButSET.click();
                    }
                }
            }
            break;
            
            case 79: //o for SET
                for (i = 0; i < radiosSET.length; i++) {
                    if (radiosSET[i].type == "checkbox"){
                        if (radiosSET[i].name == "no-matches") {
                            radiosSET[i].click();
                            if (confirm("Are you sure there are NO " + taskTypeSET + "?")) submitButSET.click();
                            else radiosSET[i].click();
                    }
                }
            }
            break;
            
            case 84: //t=no for ML
                for (i = 0; i < radiosML.length; i++) {
                    if (radiosML[i].type == "radio"){
                        if (radiosML[i].value == "false") {
                            radiosML[i].click();
                            if (confirm("Are you sure this is NOT " + taskTypeML + "?")) submitButML.click();
                    }
                }
            }
            break;
            
            case 83: //s=yes for ML
                for (i = 0; i < radiosML.length; i++) {
                    if (radiosML[i].type == "radio"){
                        if (radiosML[i].value == "true") {
                            radiosML[i].click();
                            if (confirm("Are you sure this IS " + taskTypeML + "?")) submitButML.click();
                    }
                }
            }
            break;
            
            default: break;
        }
    }    
}
