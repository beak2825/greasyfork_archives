// ==UserScript==
// @name         HP BlueSkin
// @namespace    http://www.hacker-project.com/
// @version      0.7
// @description  Changes some of the icons / colors of HP
// @author       You
// @match        http://www.hacker-project.com/*
// @match        http://hacker-project.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7558/HP%20BlueSkin.user.js
// @updateURL https://update.greasyfork.org/scripts/7558/HP%20BlueSkin.meta.js
// ==/UserScript==

function setup() {
    document.getElementsByTagName("img")[0].setAttribute("src", "http://i.imgur.com/f4Uw6VE.png");
    var classChng = [
        
        ["m1", 
         ["background", "#3366CC"]
        ],
        
        ["m2", 
         ["background", "#003399"]
        ],
        
        ["p", 
         ["color", "white"]
        ],
        
        ["def", 
         ["color", "white"]
        ],
        
        ["yellow", 
         ["color", "white"]
        ],
        
        ["emi6", 
         ["background-color", "#003366"], 
         ["border", "1px solid lightgrey"]
        ],
        
        ["p1", 
         ["color", "#3366CC"]
        ],
        
        ["green", 
         ["color", "lightgrey"]
        ],
        
        ["g", 
         ["color", "lightgrey"]
        ],
        
        ["sel2", 
         ["color", "white"], 
         ["background", "#003399"]
        ],
        
        ["bred", 
         ["background", "black"]
        ],
        
        ["pbig", 
         ["color", "white"]
        ],
        
        ["sm2", 
         ["color", "#3366CC"]
        ],
        
        ["bblue", 
         ["color", "#000099"]
        ]
        
    ];
    change(classChng, 0);
    var tagChange = [
    
        ["a", 
         ["color", "white"]
        ],
        
        ["small", 
         ["color", "#3366CC"]
        ],
        
        ["td", 
         ["color", "white"]
        ]
        
    ];
    change(tagChange, 1);
    document.getElementsByTagName("body")[0].setAttribute("background", "http://www.99hdwallpaper.com/blue/wallpapers/navy-blue-backgrounds.jpg");
}
function change(chng, det) {
    for (var clsi = 0; clsi < chng.length; clsi++) {
        var clso = chng[clsi];
        var cls = clso[0];
        for (var pairi = 1; pairi < clso.length; pairi++) {
            var pair = clso[pairi];
            var sc = pair[0];
            var ss = pair[1];
            var elArray;
            if (det===0) elArray = document.getElementsByClassName(cls);
            else elArray = document.getElementsByTagName(cls);
            for (var eli = 0; eli < elArray.length; eli++) {
                var append = elArray[eli].getAttribute("style");
                if (append===null) append = "";
                if (append.substring(append.length-1, append.length) != ";" && append !== "") append += ";";
                elArray[eli].setAttribute("style", append+" "+sc+": "+ss+";");
            }
        }
    }
}
setup();