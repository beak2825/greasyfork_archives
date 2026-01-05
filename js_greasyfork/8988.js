// ==UserScript==
// @name           Funnyjunk Submitter Checker
// @description    Highlights OP and user's username in comments sections, and brings back NSFW board menus.
// @author         kittywithclaws <http://www.funnyjunk.com/user/kittywithclaws>
// @include        http://funnyjunk.com/*
// @include        http://www.funnyjunk.com/*
// @version        1
// @namespace      https://greasyfork.org/users/9506
// @downloadURL https://update.greasyfork.org/scripts/8988/Funnyjunk%20Submitter%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/8988/Funnyjunk%20Submitter%20Checker.meta.js
// ==/UserScript==
 

document.onload = startFunction();

function startFunction(){
    checkSubmitter();
    addNSFWBoardMenu();
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
    submitterElement.innerHTML = "$*$*$*$*$*$*$*$*$*$*$*$*$*$&nbsp";
    submitterElement.className = 'uName';
    submitterElement.style.color = "red";
    
    var z = 0;
    
    for(var i = 0; i < commentUser.length; i++){
        
        //if(commentUser[i].textContent == submitter){
            //commentUser[i].innerText = "[S] " + submitter ;    // Change the content
            //commentUser[i].parentNode.insertBefore(submitterElement, commentUser[i]);
        	//appendChild and insertBefore do NOT work. Only effects last member in commentUser list.
        	//Must be researched more
            //console.log(submitter);
        
            (function(x,y,s,cu){
                //console.log("Closure");
                //return function(){
                //console.log("Closure2");
                
                //Check if comment is made by uploader
                if(cu[x].textContent == s){
                    //console.log("Closure3");
                    cu[x].style.color = "#ff6666";
                    cu[x].style.font = "bold italic 12px Arial,sans-serif";
                    //cu[x].appendChild(y);
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
                    //console.log("logged in user colour change");
                }
                //}
            })(i, submitterElement, submitter, commentUser);
            
            //z++;
            //console.log(z + " changed");
        //}
    }
    //console.log(submitter);
    //console.log(z + " changed");
}

function addNSFWBoardMenu(){
    
    var NSFWContentEntry = document.getElementsByClassName("f_ie mature forLogged").item(0);
    console.log(NSFWContentEntry.innerHTML);
    
    var NSFWBoardMenuEntry = document.createElement('tr');
    NSFWBoardMenuEntry.setAttribute("class", "f_ie mature forLogged");
    NSFWBoardMenuEntry.setAttribute("rel", "nofollow");
    NSFWBoardMenuEntry.setAttribute("style", "");
    
    var NSFWBoardMenuTD = document.createElement('td');
    NSFWBoardMenuTD.setAttribute("class", "left_menu_boards left_menu_mature center");

    var NSFWBoardMenuUL = document.createElement('ul');
    NSFWBoardMenuUL.setAttribute("class", "boardsMenu");

    var NSFWBoardMenuLI = document.createElement('li');

    var NSFWBoardMenuTitle = document.createElement('span');
    NSFWBoardMenuTitle.textContent = "NSFW Boards >";
    
    var NSFWBoardMenuSub = document.createElement('ul');
    NSFWBoardMenuSub.setAttribute("class", "boardsMenu_sub");
    NSFWBoardMenuSub.setAttribute("style", "display: none;");
    
    NSFWBoardMenuTD.setAttribute("onmouseover", "NSFWBoardMenuSub.setAttribute(\"style\", \"display: block;\")");
    NSFWBoardMenuTD.setAttribute("onmouseout", "NSFWBoardMenuSub.setAttribute(\"style\", \"display: none;\")");
    
    var NSFWBoardFurry = document.createElement('li');
    NSFWBoardFurry.innerHTML = "<a href =\"/furry/\" class=\"1\" title=\"Furry\">Furry</a>";
    var NSFWBoardGay = document.createElement('li');
    NSFWBoardGay.innerHTML = "<a href =\"/gay/\" class=\"1\" title=\"Gay\">Gay</a>";
    var NSFWBoardHentai = document.createElement('li');
    NSFWBoardHentai.innerHTML = "<a href =\"/hentai/\" class=\"1\" title=\"Hentai\">Hentai</a>";
    var NSFWBoardBrony = document.createElement('li');
    NSFWBoardBrony.innerHTML = "<a href =\"/nsfw_brony/\" class=\"1\" title=\"NSFW Brony\">NSFW Brony</a>";
    var NSFWBoardRandom = document.createElement('li');
    NSFWBoardRandom.innerHTML = "<a href =\"/random/\" class=\"1\" title=\"Random\">Random</a>";
    var NSFWBoardStraight = document.createElement('li');
    NSFWBoardStraight.innerHTML = "<a href =\"/straight/\" class=\"1\" title=\"Straight\">Straight</a>";
    
    NSFWBoardMenuSub.appendChild(NSFWBoardFurry);
    NSFWBoardMenuSub.appendChild(NSFWBoardGay);
    NSFWBoardMenuSub.appendChild(NSFWBoardHentai);
    NSFWBoardMenuSub.appendChild(NSFWBoardBrony);
    NSFWBoardMenuSub.appendChild(NSFWBoardRandom);
    NSFWBoardMenuSub.appendChild(NSFWBoardStraight);
    
    NSFWBoardMenuLI.appendChild(NSFWBoardMenuTitle);
    NSFWBoardMenuLI.appendChild(NSFWBoardMenuSub);
    NSFWBoardMenuUL.appendChild(NSFWBoardMenuLI);
    NSFWBoardMenuTD.appendChild(NSFWBoardMenuUL);
    NSFWBoardMenuEntry.appendChild(NSFWBoardMenuTD);
    
    NSFWContentEntry.parentNode.insertBefore(NSFWBoardMenuEntry, NSFWContentEntry.nextSibling);
}







