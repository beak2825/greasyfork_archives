// ==UserScript==
// @name        RTT Integration
// @description Integrate RTT with other sources
// @match       https://www.realtimetrains.co.uk/service/*/detailed
// @version 0.0.1.20251224132707
// @namespace https://greasyfork.org/users/1526162
// @downloadURL https://update.greasyfork.org/scripts/552690/RTT%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/552690/RTT%20Integration.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    var url = window.location.toString();

    var splitUrl = url.split("/")

    var serviceId = splitUrl[4].substring(6)
    var year = splitUrl[5].substring(0,4)
    var month = splitUrl[5].substring(5,7)
    var day = splitUrl[5].substring(8,10)
    var enc = serviceId.charCodeAt(0)
    var RIDend = enc + serviceId.slice(1)

    var buttonDiv = document.getElementsByClassName("alter-type")[0]

    let button = document.createElement("a")
    button.setAttribute("class","button secondary hollow")
    button.setAttribute("href","https://railchecker.app/service/" + year + "-" + month + "-" + day + "/" + serviceId + "/")
    button.setAttribute("target","_blank")
    button.setAttribute("style","margin:5px;")
    let text  = document.createTextNode("Open RailChecker")

    let button2 = document.createElement("a")
    button2.setAttribute("class","button secondary hollow")
    button2.setAttribute("href","https://trains.gaelan.me/stations/BTH/train/" + year + month + day + RIDend + "?")
    //button2.setAttribute("href","https://railchecker.app/service/" + year + "-" + month + "-" + day + "/" + serviceId + "/")
    button2.setAttribute("target","_blank")
    let text2  = document.createTextNode("Open Gaelan Darwin")

    let button3 = document.createElement("a")
    button3.setAttribute("class","button secondary hollow")
    button3.setAttribute("href","https://trackit.uppyjc.co.uk/TrackIT/Forms/Train.aspx?Today=" + serviceId + "&Estimate=True")
    button3.setAttribute("target","_blank")
    button3.setAttribute("style","margin:5px;")
    let text3  = document.createTextNode("Open TrackIT!")
    
    let button4 = document.createElement("a")
    button4.setAttribute("class","button secondary hollow")
    button4.setAttribute("href","https://timetables.trainsplit.com/times.aspx?uid=" + serviceId + "&date=" + year + month + day)
    button4.setAttribute("target","_blank")
    button4.setAttribute("style","margin:5px;")
    let text4  = document.createTextNode("Open Timetable History")

    button.appendChild(text)
    buttonDiv.appendChild(button)

    button2.appendChild(text2)
    buttonDiv.appendChild(button2)

    button3.appendChild(text3)
    buttonDiv.appendChild(button3)
    
    button4.appendChild(text4)
    buttonDiv.appendChild(button4)
})();