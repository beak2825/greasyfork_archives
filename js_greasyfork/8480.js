// ==UserScript==
// @name        Set cookies
// @namespace   Alpe
// @include     http://museudodvdr.blogspot.com.br/
// @include     http://museudodvdr.blogspot.com.br/*.html
// @include     http://store.steampowered.com/app/*
// @version     1
// @grant       none
// @run-at      document-start
// @description Cria cookies dependendo do site
// @downloadURL https://update.greasyfork.org/scripts/8480/Set%20cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/8480/Set%20cookies.meta.js
// ==/UserScript==

var list1 = ["museudodvdr.blogspot.com.br", "store.steampowered.com"];
var list2 = ["visited", "bGameHighlightAutoplayDisabled"];
var list3 = ["true", "true"];

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

(function(){
  Array.prototype.allIndexOf = function(searchElement) {
    if (this === null) { return [-1]; }
    var len = this.length,
    hasIndexOf = Array.prototype.indexOf, // you know, because of IE
    i = (hasIndexOf) ? this.indexOf(searchElement) : 0,
    n,
    indx = 0,
    result = [];
    if (len === 0 || i === -1) { return [-1]; }
    if (hasIndexOf) {
      // Array.indexOf does exist
      for (n = 0; n <= len; n++) {
        i = this.indexOf(searchElement, indx);
        if (i !== -1) {
          indx = i + 1;
          result.push(i);
        } else {
          return result;
        }
      }
      return result;
    } else {
    // Array.indexOf doesn't exist
      for (n = 0; n <= len; n++) {
        if (this[n] === searchElement) {
          result.push(n);
        }
      }
      return (result.length > 0) ? result : [-1];
    }
  };
})();



index = list1.allIndexOf(document.domain);

if (index[0] != "-1"){
    for (var i=0; i<index.length; i++) {
        number = index[i];
        cookie = list2[number];
        value = list3[number];
        if (getCookie(cookie) === ""){
            document.cookie=cookie+"="+value+"; path=/";
            console.log("cookie ["+cookie+"] criado ["+document.URL+"]");
        } else if (getCookie(cookie) != value){
            console.log("cookie ["+cookie+"="+getCookie(cookie)+"] modificado ("+value+") ["+document.URL+"]");
            document.cookie=cookie+"="+value+"; path=/";
        } else console.log("cookie ["+cookie+"] ok ["+document.URL+"]");
    }
} else console.log("no cookies for ["+document.URL+"]");