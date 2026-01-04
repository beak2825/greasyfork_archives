// ==UserScript==
// @name         Weighted score for AOTY
// @namespace    https://albumoftheyear.org
// @version      1.1
// @description  A score weighting system for AOTY which incorporates popularity into the score. Not fully implemented, many bugs abound.
// @author       Astrid
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://greasyfork.org/scripts/421384-gm-fetch/code/GM_fetch.js?version=1134973
// @match        https://www.albumoftheyear.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=albumoftheyear.org
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552315/Weighted%20score%20for%20AOTY.user.js
// @updateURL https://update.greasyfork.org/scripts/552315/Weighted%20score%20for%20AOTY.meta.js
// ==/UserScript==

(function() {
    let url = document.URL
    function weight(a, b){
        let result = a + (Math.log(b)/Math.log(1.45)) - 21;
        result = Math.round(10*result)/10.0
        return result;
    }
    if (url.startsWith("https://www.albumoftheyear.org/album/")) {
        if (document.getElementsByClassName("albumUserScore")[0]) {
            if (document.getElementsByClassName("albumUserScore")[0].textContent !== "NR") {
                let userscore = document.getElementsByClassName("albumUserScore")[0].children[0];
                let unrounded = userscore.getAttribute("title");
                let reviews = document.getElementsByClassName("numReviews")
                let ratings = reviews[reviews.length-1].children[0];
                ratings = ratings.textContent;
                ratings = ratings.substring(0, ratings.length-7)
                ratings = ratings.replace(/,/g, '');
                let newScore = weight(parseInt(unrounded), parseInt(ratings));
                if(newScore > 100){
                    newScore = 100
                }
                if(newScore < 0){
                    newScore = 0;
                }
                let color = ""
                if(newScore >= 69.5){
                    color = "rgb(134, 207, 115)";
                } else if (newScore >= 49.5){
                    color = "rgb(241, 231, 140)";
                } else {
                    color = "rgb(215, 102, 103)";
                }
                userscore.textContent = newScore;
                if(unrounded >= 69.5){
                                    document.getElementsByClassName("ratingBar")[reviews.length-1].getElementsByClassName("green")[0].outerHTML = '<div class="green" style="width: '+newScore+'%; background-color: '+color+';"></div>'
                } else if (unrounded >= 49.5){
                                    document.getElementsByClassName("ratingBar")[reviews.length-1].getElementsByClassName("yellow")[0].outerHTML = '<div class="yellow" style="width: '+newScore+'%; background-color: '+color+';"></div>'
                } else {
                                    document.getElementsByClassName("ratingBar")[reviews.length-1].getElementsByClassName("red")[0].outerHTML = '<div class="red" style="width: '+newScore+'%; background-color: '+color+';"></div>'
                }
            }
        } else {
            console.log(document.getElementsByClassName("albumUserScore")[0]);
        }
    }
    if (url == 'https://www.albumoftheyear.org/'){
        let n = document.getElementsByClassName("ratingRow").length;
        for(let i = 0; i < n; i++){
            if(document.getElementsByClassName("ratingRow")[i].children[1].innerText == "user score"){
                let userscore = document.getElementsByClassName("ratingRow")[i].children[0].children[0].innerText;
                let ratings = document.getElementsByClassName("ratingRow")[i].children[2].innerText;
                ratings = ratings.substring(1, ratings.length-1).replace(/,/g, '');
                let newScore = weight(parseInt(userscore), parseInt(ratings));
                newScore = Math.round(newScore);
                document.getElementsByClassName("ratingRow")[i].children[0].children[0].innerText = newScore
                let color = ""
                if(newScore >= 70){
                    color = "green";
                } else if (newScore >= 50){
                    color = "yellow";
                } else {
                    color = "red";
                }
                document.getElementsByClassName("ratingRow")[i].children[0].children[1].children[0].className = color
                document.getElementsByClassName("ratingRow")[i].children[0].children[1].children[0].style.cssText = "width:"+newScore+"%"
                //if(userscore >= 69.5){
                //                    document.getElementsByClassName("ratingRow")[0].children[0].children[1].children[0].outerHTML = '<div class='+color+' style="width:'+newScore%;"></div>'
                //} else if (userscore >= 49.5){
                //                    document.getElementsByClassName("ratingRow")[0].children[0].children[1].children[0].outerHTML
                //} else {
                //                    document.getElementsByClassName("ratingRow")[0].children[0].children[1].children[0].outerHTML
                //}
            }
        }
    }
})();