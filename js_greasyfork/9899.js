// ==UserScript==
// @name        skiline.cc direct media links
// @namespace   http://www.skiline.cc
// @description Adds direct media download links (without the overlayed logos) to www.skiline.cc photo point pages
// @include     http://www.skiline.cc/*/media/*
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/9899/skilinecc%20direct%20media%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/9899/skilinecc%20direct%20media%20links.meta.js
// ==/UserScript==


function addDlRawMediaButton()
{
    // get the album ID, photo ID and media name
    var backLink = document.getElementById("header_album_show_link");
    var albumId = /^.*\/([0-9a-fA-F]*)$/.exec(backLink.href)[1];
    var photo = document.getElementById("j_id479:mediaForm").getElementsByClassName("photo")[0];
    var photoId = /^.*id=([0-9a-fA-F]*).*$/.exec(photo.src)[1];
    var directLink = "http://www.skiline.cc/shared/media/images/" + albumId + "/" + photoId + ".jpg";
    var photoName = document.getElementById("j_id479:mediaForm:media_name").innerHTML.replace(/<(?:.|\n)*?>/gm, '');
    
    // create the download link button and add it near the original one
    var img = document.createElement("img");
    img.src = "data:image/png;base64,"+
              "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAA"+
              "IGNIUk0AAHMmAACBVAAA9dsAAID8AABuWwAA+hYAADuqAAAbTK34OlwAAAI6SURBVHjazFRNaxNR"+
              "FD1v3oRxopCo4Ecl2J2urGRCNqa2szGRkAlBkiwEV9UfIChmFi5ECiLSvXVVdBNXGYgmbtKPTSht"+
              "YVxk4cKlRAiaFGPTycd10ZmQSJOqZOGB2dz77nnnvnvuMCLCJCGOS0YikVMul+vKYKzdbn8sFArf"+
              "/olQkqQgEb3/LXYTQGFUjYAJ4/8nZESEhsdTAoDvknT2hyie1gOBkp0/B2BON00szswAAJ7s7NQf"+
              "+/1FAFjc2lIzinL/9fr6GwAlT6OhDipUH87PX80oSlk3zTSA9CCZbpoAgBbnXgBp3TTTGUUpr2xs"+
              "3BvZ8nKxaMmynHR3OrWjWnN3OjVZlpMCUW+UbUo2Ke6Gwxdob+8tY0w7jIyIDF+z6V0uFq1xQ1Ht"+
              "r6+UiAwA/XbHKRsaSmVq6sujQOAzY+zWyurqV1ut2mNs7c7sbN1R+nR7u+ZrNisC0ZxzZp/z8kIo"+
              "1H6+uem7VK1OC9Fo9OKuy3UewDUiSg3JJ+o5Su02h8gAYCEUeqebZuhBMOhLJBJekXMuO5YAcNzT"+
              "aDjtA4CaBZBKpZIAcLJetwae5wCa5rbrBcuyjondbrfOOXfS04e9SzabtcYM3Knpcc53hXw+XwVQ"+
              "tYO34/H49T/aCMaYpmk3ACTs0CfDMH6KdnKJiJ4BOEFEa5qmVQHsjyOMxWIygDMDFyz1fShJ0otW"+
              "q+W3t8NZub/Bq1wu97Jvm4FbY4IghIno8lH/SiJqM8YqAPKGYXwY8uEk8WsA0YbvPPKn3ysAAAAA"+
              "SUVORK5CYII=";
    img.alt = img.title = "Download original photo";
    var link = document.createElement("a");
    link.href = directLink;
    link.setAttribute("download",photoName + ".jpg");
    link.className = "download";
    link.style.right = "40px";  
    link.appendChild(img);
    var div = document.getElementById("j_id479:mediaForm:media_download");
    div.appendChild(link);
}

addDlRawMediaButton();
