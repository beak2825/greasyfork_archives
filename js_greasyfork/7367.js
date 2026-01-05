// ==UserScript==
// @name        Mangaupdates Hiatus/Discontinued/Axed/Dead Warning
// @namespace   476f64df6392be4940a610f1a484f18d
// @include     https://www.mangaupdates.com/series.html?id=*
// @include     http://www.mangaupdates.com/series.html?id=*
// @version     1.1
// @grant       none
// @description Adds a dark red warning to the titles of manga on their pages if they won't be finished or are on hiatus.
// @downloadURL https://update.greasyfork.org/scripts/7367/Mangaupdates%20HiatusDiscontinuedAxedDead%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/7367/Mangaupdates%20HiatusDiscontinuedAxedDead%20Warning.meta.js
// ==/UserScript==
cell = document.getElementsByClassName("series_content_cell")[0];
dd = cell.getElementsByClassName("inbox")[0];
ddsib = dd.nextSibling;
ddpar = dd.parentElement;
dd.remove();
uconf = cell.textContent.match(/(Hiatus|Discontinued|Axed|[dD]eath of author|author dead)(?! list)/);
if (null!==uconf)
{
  cats = cell.getElementsByClassName("sCat");
  conf = null;
  for (var i=0;i<cats.length;i++)
  {
    if (cats[i].textContent.match("Status in Country of Origin"))
    {
      conf = cats[i].nextElementSibling.textContent.match(/Hiatus|Discontinued|Axed|[dD]eath of author|author dead/);
      break;
    }
  }
  span = document.createElement("span");
  span.style.color = "darkred";
  if (null!==conf)
  {
    warn = document.createTextNode(" ("+conf[0]+")");
  }
  else
  {
    warn = document.createTextNode(" ("+uconf[0]+"?)");
  }
  span.appendChild(warn);
  cell.getElementsByClassName("releasestitle")[0].appendChild(span);
}
ddpar.insertBefore(dd,ddsib);