// ==UserScript==
// @name           Funnyjunk Submitter Checker v1.1
// @description    Highlights OP and user's username in comments sections
// @author         kittywithclaws <http://www.funnyjunk.com/user/kittywithclaws>
// @include        http://funnyjunk.com/*
// @include        http://www.funnyjunk.com/*
// @version        1.1
// @namespace      https://greasyfork.org/users/9506
// @downloadURL https://update.greasyfork.org/scripts/9142/Funnyjunk%20Submitter%20Checker%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/9142/Funnyjunk%20Submitter%20Checker%20v11.meta.js
// ==/UserScript==
 

document.onload = startFunction();

function startFunction(){
    checkSubmitter();
    console.log("Running first time!");
    window.setInterval(function(){
        checkSubmitter();
        console.log("Script Refresh!");
    }, 10000);
}
 
function checkSubmitter(){
    //console.log("Running");
    var submittedBy = document.getElementById('cntSbmtBy');
    var submitterString = "NULLBUTTS";
    var submitter = "NULLBUTTS";
    if(submittedBy != null){
        submitterString = submittedBy.textContent;
        submitter = submitterString.substring(10);
        submitter = submitter.replace(/\s+/g, '');
        var channelIndex = submitter.indexOf("Channel:");
        if(channelIndex!=-1){
            //console.log("channel removed");
            submitter = submitter.substring(0,channelIndex);
        }
    }    
    //console.log("Submitted by: " + submitter);
        
    var currentUser = document.getElementById('userbarLoginInf');
    var userString = "NULLBUTTS2";
    if(currentUser.innerText != "anonymous."){
        userString = currentUser.children[0].innerHTML;
    }
    //console.log("Logged in as: " + userString);
    
    var commentUser = document.getElementsByClassName("uName");  // Find the elements
    
    var submitterElement = document.createElement('a');
    submitterElement.innerText = "BLAHBLAHBLAH";
    submitterElement.className = 'uName';
    submitterElement.style.color = "red";
    
    var z = 0;
    
    for(var i = 0; i < commentUser.length; i++){
        
            (function(x,y,s,cu){
                //Check if comment is made by uploader
                if(cu[x].textContent == s){
                    
                    /* IMPROVED VERSION
                    *  Adds an OP element which can be coloured seperately
                    *  Personal Preference: Prefer existing functionality.
                    if(cu[x].nextSibling.className != "OPClass uName"){
                        var OPTag = document.createElement('a');
                        OPTag.innerHTML = " [OP]";
                        OPTag.setAttribute("class", "OPClass uName");
                        var userRef = "/user/" + userString;
                        OPTag.setAttribute("href", userRef);
                        OPTag.style.color = cu[x].style.color;
                        cu[x].style.color = "#ff6666";
                        cu[x].parentNode.insertBefore(OPTag, cu[x].nextSibling);
                    }
                    */
                    
                    cu[x].style.color = "#ff6666";
                    cu[x].style.font = "bold italic 12px Arial,sans-serif";
                    cu[x].innerText = s + " [OP]";
                    
                    //SECTION OF CODE CHANGES BACKGROUND OF SUBMITTER'S COMMENTS SLIGHTLY RED 
                    //Disabled for personal preference. Remove the "/*" and "*/" marks to re-enable. 
                    /*
                    cu[x].parentNode.setAttribute("style", "background-color: #1a0f0f;");
                    cu[x].parentNode.setAttribute("onmouseover", "this.setAttribute(\"style\", \"background-color: #231919;\")");
                    cu[x].parentNode.setAttribute("onmouseout", "this.setAttribute(\"style\", \"background-color: #1a0f0f;\")");  
                    */
                    //END OF BACKGROUND CHANGE
                    
                    z++;
                }
                //Check if comment is made by user logged in
                if(cu[x].textContent == userString || cu[x].textContent == userString + " [OP]"){
                    cu[x].style.color = "#ffff33";
                    cu[x].style.font = "bold italic 12px Arial,sans-serif";
                }
                //}
            })(i, submitterElement, submitter, commentUser) 
            
            //z++;
            //console.log(z + " changed");
        //}
    }
    //console.log(submitter);
    //console.log(z + " changed");
}
