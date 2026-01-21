// ==UserScript==
// @name         MTN User Blocker
// @namespace    mactechnews.de
// @version      0.1
// @description  blocks defined users
// @author       MetallSnake
// @match        http*://mactechnews.de/*
// @match        http*://www.mactechnews.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563354/MTN%20User%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/563354/MTN%20User%20Blocker.meta.js
// ==/UserScript==

var ich = ["MetallSnake"]
var blocked = ["Quickmix", "makru", "MacNu92"];
var nazi = ["FeanorGargoil"];
var spinner = ["makru", "MacNu92"];

// Makru: https://www.mactechnews.de/account/profile/makru-194853.html
// MacNu92 https://www.mactechnews.de/account/profile/MacNu92-196998.html
// Quickmix https://www.mactechnews.de/account/profile/Quickmix-148832.html
// https://www.mactechnews.de/account/profile/FeanorGargoil-198858.html


var nickList = document.getElementsByClassName('MtnCommentAccountName');
var content = document.getElementById('ContentPlaceHolder1_MtnNewsCommentScrollNewsComments');

for (var i = 0; i < nickList.length; i++) {
  //console.log(nickList[i]);
  //console.log(i + " " + nickList[i].innerHTML);
  if(blocked.indexOf(nickList[i].innerHTML) >= 0)
  {
      //console.log("++++++++++++++++++++++++++++++++");
      //nickList[i].parentElement.parentElement.parentElement.style.display = "none";
      nickList[i].parentElement.parentElement.parentElement.style.backgroundColor = "yellow";
  }

  if(nazi.indexOf(nickList[i].innerHTML) >= 0)
  {
      //console.log("++++++++++++++++++++++++++++++++");
      nickList[i].innerHTML += " (NAZI)";
      //nickList[i].style.color = "brown";
      nickList[i].parentElement.parentElement.parentElement.style.backgroundColor = "brown";
  }

  if(spinner.indexOf(nickList[i].innerHTML) >= 0)
  {
      //console.log("++++++++++++++++++++++++++++++++");
      nickList[i].innerHTML += " (Spinner)";

  }

  if(ich.indexOf(nickList[i].innerHTML) >= 0)
  {
      //console.log("++++++++++++++++++++++++++++++++");
      nickList[i].parentElement.parentElement.parentElement.style.backgroundColor = "green";

  }

}