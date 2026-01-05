// ==UserScript==
// @name        taybear
// @namespace   http://userscripts.org 
// @include     http://mugenguild.com/*
// @version     2.6
// @grant GM_getValue
// @grant GM_setValue
// @description none
// @downloadURL https://update.greasyfork.org/scripts/6050/taybear.user.js
// @updateURL https://update.greasyfork.org/scripts/6050/taybear.meta.js
// ==/UserScript==

var list = "";
list = GM_getValue( "list", "" );
var substitute = "http://signavatar.com/21720_v.png";
var debug="";
function KeyCheck(e)
{
   if(e.keyCode == 112){
    editList();
   }
   if(e.keyCode == 113){
    addList();
   }
}

function isListed(avatar)
{

  var elem = list.split(",");
  for(var i=0 ; i < elem.length ; i++){
    if ( avatar == elem[i]){
      return true; 
    }
  }
  return false
  
}

/**/
function editList()
{
  var tmpList = prompt("edit the list , is a separator", list);

  if (tmpList != null) {
    list = tmpList;
    GM_setValue( "list", list );
  }
}

function addList()
{
  var tmpList = prompt("add new element to the list", "");

  if (tmpList != null) {
    list += "," +tmpList;
    GM_setValue( "list", list );
  }
}
/**/

window.addEventListener('keydown', KeyCheck, true);


/*
* avatar swap support
*/
var x = document.getElementsByClassName("avatar");
var i;
for (i = 0; i < x.length; i++) {
   debug += x[i].src + "\n";
  if( x[i].nodeName == "IMG" )
    {
      if( isListed( x[i].src) == true ){
       x[i].src = substitute +"?" + Date.now();
     }
    }
  else if( x[i].nodeName == "LI" )
  {
    if( isListed( x[i].childNodes[1].src) == true ){
       x[i].childNodes[1].src = substitute + "?" + Date.now();
     }
    
  }

    
    
}

//alert(debug);
/*
* webm, support
*/

var postbody = document.getElementById("posts_container");
var posts = postbody.children;

/*
* for tag
*/
for(i=0 ; i < posts.length ; i++){
  var code = posts[i].innerHTML;
  var indexStart = code.indexOf("[webm]"); 
  var indexEnd = code.indexOf("[/webm]");
  if(indexStart > -1){
    //alert(code.substring(0, indexStart));
    //alert(code.substring(indexStart+6, indexEnd) );
    //alert(code.substring(indexEnd+7, code.length));
    var codeNew = code.substring(0, indexStart) + "<video width='100%' src=' " + code.substring(indexStart+6, indexEnd) + "' controls></video>" + code.substring(indexEnd+7, code.length);
    //alert(codeNew);
    posts[i].innerHTML = codeNew;
  }
  
}

/*
* to automatically convert links to webm
*/

var links = document.getElementsByClassName("bbc_link");
for(var i=0 ; i < links.length ; i++){
    if( links[i].href.indexOf(".webm") > -1 ){
      var codeNew = "<video width='100%' src='"+ links[i].href + "' controls></video>" ;
      var old = links[i].innerHTML + "<br/>" ;
      links[i].innerHTML = old + codeNew;
    }
    
  }
  
  