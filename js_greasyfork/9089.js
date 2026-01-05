// ==UserScript==
// @name         Todoist enhancer
// @namespace    https://todoist.com/app
// @version      0.3
// @description  Todoist.com differnt enhancements
// @copyright    plesk, 2015
// @match        https://todoist.com/app*
// @downloadURL https://update.greasyfork.org/scripts/9089/Todoist%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/9089/Todoist%20enhancer.meta.js
// ==/UserScript==

//TODO Font size according task priority

//Array with labels parameters
// 0 - Label name
// 1 - Text color
// 2 - Background color
var label_style = [["letter" , "white", "orangered" ],
                   ["call"   , "white", "red"       ],
                   ["control", "blue" , "lightgreen"]
                  ];

// Changing labels colour
function colour_labels(){ 
    var labels = document.getElementsByClassName("label");
    var i;
    for (i = 0; i < labels.length; i++){
        if (labels[i].className == "label"){
            label_style.forEach(function(ls){
                if(labels[i].innerText == ls[0]){
                    labels[i].innerText = labels[i].innerText.toUpperCase();
                    labels[i].style.color = ls[1];
                    labels[i].style.backgroundColor = ls[2];
                } 
            })
        }
    }
}

setInterval(colour_labels, 1000);