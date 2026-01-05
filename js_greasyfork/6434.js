// ==UserScript==
// @name         Mobile FB Photo Tag Removal
// @version      0.5
// @namespace    http://ongspxm.wordpress.com
// @description  Remove photo tags using the FB Mobile Interface
// @author       Metta Ong
// @match        https://m.facebook.com/photo.php*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/6434/Mobile%20FB%20Photo%20Tag%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/6434/Mobile%20FB%20Photo%20Tag%20Removal.meta.js
// ==/UserScript==


/* Instruction for usage
- Install this user script
- Open up this page: https://m.facebook.com/ongspxm?v=photos&ref=bookmark
- In Chrome(other broswer works too): open up the javascript console
- Run the program in the comment block below (Link Generation), all of it
- Sit back and relax, if you got quite abit of photos, you gotta wait for quite a long time
*/

/* Link Generation
as=document.getElementsByClassName("_39pi _4dvp");l=[];for(i in as){l.push(as[i]["href"]);}
document.body.innerHTML="";for(i=0; i<l.length; i+=1){document.write("<a href='"+l[i]+"' id='ll"+i.toString()+"' target='_blank'>"+i.toString()+" </a>")}
for(i=0; i<l.length; i+=1){document.getElementById("ll"+i.toString()).click();}
*/ 

function aaa(){
    if(document.getElementsByClassName("_56bs _56b_ _3ax- _56bu").length){
    	document.getElementsByClassName("_56bs _56b_ _3ax- _56bu")[0].click();
    }else{
        a.click();
     	setTimeout(aaa,500);   
    }
}

tagged = false;
as = document.getElementsByTagName("a")
for(i=0; i<as.length; i+=1){if(as[i] && as[i].text=="Remove Tag"){
    console.log(as[i].click());
    tagged = true;
    a=as[i];
    aaa();
}}

if(!tagged){window.close();}