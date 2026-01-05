// ==UserScript==
// @name        ninja text viewer
// @namespace   awkward_potato
// @description white text will be turned to a lighter grey than the ninja quote text which will be darker
// @include     *.oneplus.net*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6866/ninja%20text%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/6866/ninja%20text%20viewer.meta.js
// ==/UserScript==
function color() {
    //change signature color because above changed it as well
    var c = document.getElementsByClassName('signature');
    for (d = 0; d < c.length; d++) {
        c[d].style.color = 'black';
    }
    //change ninja text
    var s = document.getElementsByTagName('span');
    for (q = 0; q < s.length; q++) {
        if (s[q].style.color.indexOf("#ffffff") >= 0 || s[q].style.color.indexOf("255, 255, 255") >= 0 || s[q].style.color.indexOf("white") >= 0 || s[q].style.color.indexOf("transparent") >= 0)
        {
            s[q].style.color = '#a8a8a8';
        }
        if (s[q].style.color.indexOf("#ecebea") >= 0 || s[q].style.color.indexOf("236, 235, 234") >= 0)
        {
            s[q].style.color = '#8a8a8a';
        }
    }
    
    if (document.URL.indexOf("threads") >= 0 || document.URL.indexOf("conversations") >= 0){
        document.getElementsByClassName('button primary')[0].onclick = waut;
    }
}

//function to be activated three seconds after pressing post
function waut(){
    setTimeout(function(){color();}, 3000);
}

//upon page load change colors
color();