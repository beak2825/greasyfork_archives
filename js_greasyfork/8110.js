// ==UserScript==
// @name         Leetcode problem acceptance assistant
// @namespace    http://halfcrazy.me
// @version      0.1
// @description  Show the problem's acceptance on the problem page
// @author       halfcrazy
// @match        http*://oj.leetcode.com/problems/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8110/Leetcode%20problem%20acceptance%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/8110/Leetcode%20problem%20acceptance%20assistant.meta.js
// ==/UserScript==
function getElementsByClassName(node,classname){
    if(node.getElementsByClassName){
        return node.getElementsByClassName(classname);
    }else{
        var results = new Array();
        var elems = node.getElementsByTag("*");
        for (var i=0;i<elems.length;i++){
            if(elems[i].className.indexOf(classname) != -1){
                results[elems.length] = elems[i];
            }
        }
        return results;
    }
}

function changeTwoDecimal(x)
{
    var f_x = parseFloat(x);
    if (isNaN(f_x))
    {
        alert('function:changeTwoDecimal->parameter error');
        return false;
    }
    f_x = Math.round(f_x *100)/100;
    
    return f_x;
}

function insertAfter(newElement, targetElement) 
{ 
    var parent = targetElement.parentNode; 
    if(parent.lastChild == targetElement) 
    { 
        parent.appendChild(newElement); 
    } 
    else 
    { 
        parent.insertBefore(newElement, targetElement.nextSibling); 
    } 
} 

var question_title = getElementsByClassName(document,"question-title");
if(typeof(question_title[0]) == "undefined")
{
    return;
}
else
{
    var Total_Accepted = question_title[0].childNodes[3].getElementsByTagName("strong");
    var Total_Submissions = question_title[0].childNodes[5].getElementsByTagName("strong");
    var accepted = Total_Accepted[0].innerText;
    var submissions = Total_Submissions[0].innerText;
    var rate = changeTwoDecimal(accepted/submissions*100);
    var newNode = document.createElement("span");
    newNode.setAttribute("class", "total-ac text-info");
    newNode.innerHTML = "Accepted Rate: <strong>"+rate+"%"+"</strong>";
    insertAfter(newNode,question_title[0].childNodes[5]);
}
