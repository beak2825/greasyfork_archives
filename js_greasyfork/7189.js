// ==UserScript==
// @name        Daniel Barrett Human/Horses Script
// @author      Rat Monkey
// @description Uses Hotkeys on the keyboard to move to the next video. R = Back, F = Forward. All videos are labeled false by default.
// @include     https://www.mturk.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     0.1
// @grant       none
// @namespace https://greasyfork.org/en/users/7541-ratmonkey
// @downloadURL https://update.greasyfork.org/scripts/7189/Daniel%20Barrett%20HumanHorses%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/7189/Daniel%20Barrett%20HumanHorses%20Script.meta.js
// ==/UserScript==


var blocks = document.getElementsByClassName("overview text");
var blockNum = 0;
var curBlock = blocks[blockNum];



document.getElementById("hit-wrapper").style.zIndex = 1;
for (var i = 0; i < blocks.length; i++){
    blocks[i].style.position = "relative";
    blocks[i].style.zIndex = 1000;
}
    
curBlock.scrollIntoView();    
document.addEventListener("keyup", function(e){
    if (e.keyCode==70){
      while (blockNum < blocks.length && blocks[blockNum].offsetTop == curBlock.offsetTop){
      	blockNum++;
      }
      if(curBlock)
      {
         curBlock = blocks[blockNum];
         curBlock.scrollIntoView();
          
      }else{ 
          blockNum = blocks.length - 1 ;
          curBlock = blocks[blocks.length - 1];
      }
    } 
    if(e.keyCode==67){
    	curBlock.scrollIntoView();
        
    }
    if(e.keyCode==82){
    	while (blockNum > 0 && blocks[blockNum].offsetTop == curBlock.offsetTop){
      	blockNum--;
      }
      if(curBlock)
      {
         curBlock = blocks[blockNum];
         curBlock.scrollIntoView();
      }else{ 
          blockNum++;
          curBlock = blocks[blockNum];
      }
    }
});



var radioButtons = document.getElementsByClassName("question selection");
for (i = 0; i < radioButtons.length; ++i){
  var item = radioButtons[i];
  if (item.value == "Selection_MQ--"){
    item.checked = true;
  }
}