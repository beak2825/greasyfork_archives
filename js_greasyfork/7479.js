// ==UserScript==
// @name        Stats Link
// @namespace   tf2b.com
// @include     https://tf2b.com/tf2/*
// @version     1
// @grant       none
// @description Adds Stats.tf link to tf2b.com profile pages. Links won't be added until the page loads. Wait until you see "Links loaded!" above the MOTD bar.
// @downloadURL https://update.greasyfork.org/scripts/7479/Stats%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/7479/Stats%20Link.meta.js
// ==/UserScript==
window.onload = function () {
  var alertText = document.createElement("span");
  alertText.textContent = "Links loaded!"; //Preparing the after-load message
  var center = document.createElement("center");
  center.appendChild(alertText); //Making the text centered
  
  function openSummary(e) //Overriding the actual function
  {
    if (e.target.getAttribute("data-tip") !== null)
    {
      var defind = e.target.className.split(" ")[1].substring(1);
      dbox.style.top = e.pageY + "px";
      dbox.style.left = e.pageX + "px";
      dbox.style.display = "block";
      hbox.style.display = "none";
      dbox.innerHTML = "<div>Count: " + document.getElementsByClassName(e.target.className.split(" ")[1]).length + "</div>"+
      "<a href=\"//tf2b.com/" + gpath[1] + "/item/" + gpath[2] + "/" + e.target.id + "\">Item Page</a>"+
      "<a href=\"//tf2b.com/r.php?id="+defind+"&gid="+bp.getAttribute("data-appid")+"\">Wiki Article</a>"+
      '<a href="//stats.tf/item/'+defind+'">Stats.tf</a>';
    }
    else
    {
      dbox.style.display = "none";
      hbox.style.display = "block";
    }
  }
  document.addEventListener("click", openSummary, false); //redefining the click event
  document.body.insertBefore(center, document.getElementById("motd")); //Adding the after-load text
}
