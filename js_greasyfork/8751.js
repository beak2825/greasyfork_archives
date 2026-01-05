// ==UserScript==
// @version     1.0.2   
// @name    TPB
// @description     Add YouTube link to all and IMDb rating to search|top/207|top/201|top/all
// @namespace     https://greasyfork.org/users/3159  
// @include     https://thepiratebay.*/*
// @downloadURL https://update.greasyfork.org/scripts/8751/TPB.user.js
// @updateURL https://update.greasyfork.org/scripts/8751/TPB.meta.js
// ==/UserScript==
style = document.createElement('style');
style.innerText = ".youtube{color:#b2491a;cursor:pointer}.imdb{color:grey}#bg{background:rgba(0, 0, 0,.8);position:fixed;top:0;left:0;z-index:9001;width:100%;height:100%;display:none}iframe{border:0;width:640px;height:390px;max-width:90%;max-height:90%;margin:auto;position:absolute;top:0;left:0;bottom:0;right:0}";
document.head.appendChild(style);

function filter(x) {
    x = x.replace(/\./g, ' '); //dots to spaces
    x = x.replace(/\(/g, ''); // ( to nothing
    y = x.replace(/(S[0-9].*?)\ .*/, '$1'); //remove after season
    z = x.match(/18|19|20[0-9]{2}/); // year
    if (y != x){
        x = y;
    } else {
        y = x.replace(/(.*?.)((18|19|20)[0-9]{2}).*/, '$1$2');
        x = x.split(' ' + z)[0];
    } // if no season then year
    results = [y, x, z];
    return results;
}

function iIMDb(ir, n, ii) {
    if (ir) {
        l = document.getElementsByClassName('imdb')[n - 1];
        l.href = "http://imdb.com/title/" + ii + "/";
        l.children[0].innerHTML = ir;
    }
}

list = document.getElementsByTagName('tr');
for (i = 1; i < list.length; i++) {
    q = list[i].children[1];
    //YouTube
    yt = document.createElement('a');
    yt.className = "youtube";
    yt.innerHTML = "<em>Yt</em> ";
    q.appendChild(yt);
    bg = document.createElement("div");
    bg.id = "bg";
    bg.onclick = function () {
        bg.style.display = "none";
        bg.innerHTML = "";
    };
    document.body.appendChild(bg);
    f1 = filter(list[i].children[1].children[0].className ? list[i].children[1].children[0].children[0].innerHTML : list[i].children[1].children[0].innerHTML[0]); // name
    eval("yt.onclick=function(){bg.style.display='block';bg.innerHTML='<iframe src=//youtube.com/embed/?listType=search&list=" + escape(f1) + "&autohide=1></iframe>'};");
    //IMDb
    if( document.location.pathname.match(/search|top\/207|top\/201|top\/all/) ){
       f2 = filter(list[i].children[1].children[0].className ? list[i].children[1].children[0].children[0].innerHTML : list[i].children[1].children[0].innerHTML[0])[1]; // id
       f3 = filter(list[i].children[1].children[0].className ? list[i].children[1].children[0].children[0].innerHTML : list[i].children[1].children[0].innerHTML[0])[2]; // year
       imdb = document.createElement('a');
       imdb.className = "imdb";
       imdb.innerHTML = "<code></code>";
       q.appendChild(imdb);
       eval("var r" + i + "= new XMLHttpRequest;r" + i + ".open('GET', 'https://www.omdbapi.com/?t='+f2+'&y='+f3, true);r" + i + ".onreadystatechange = function () {var num" + i + "=JSON.parse(r" + i + ".responseText).imdbRating;var ii" + i + "=JSON.parse(r" + i + ".responseText).imdbID;iIMDb(num" + i + "," + i + ",ii" + i + ");};r" + i + ".send();");
    }
}