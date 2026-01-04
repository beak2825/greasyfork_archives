// ==UserScript==
// @name        RailChecker Integration
// @description Integrate RailChecker with other sources
// @match       https://railchecker.app/service/*
// @version 0.0.1.20251015144853
// @namespace https://greasyfork.org/users/1526162
// @downloadURL https://update.greasyfork.org/scripts/552689/RailChecker%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/552689/RailChecker%20Integration.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    var url = window.location.toString();

    var splitUrl = url.split("/")

    var serviceId = splitUrl[5]
    var year = splitUrl[4].substring(0,4)
    var month = splitUrl[4].substring(5,7)
    var day = splitUrl[4].substring(8,10)

    var origbutton = document.getElementsByClassName("d-block")[0]

    let button = document.createElement("a")
    button.setAttribute("class","btn btn-primary d-block")
    button.setAttribute("href","http://timetablehistory.com/times.aspx?uid=" + serviceId + "&date=" + year + month + day)
    button.setAttribute("target","_blank")
    let text  = document.createTextNode("Open Timetable History")
    button.appendChild(text)

    let button2 = document.createElement("a")
    button2.setAttribute("class","btn btn-primary d-block")
    button2.setAttribute("href","https://www.realtimetrains.co.uk/service/gb-nr:" + serviceId + "/" + year + "-" + month + "-" + day + "/detailed")
    button2.setAttribute("target","_blank")
    let text2  = document.createTextNode("Open RealTimeTrains")
    button2.appendChild(text2)

    let button3 = document.createElement("a")
    button3.setAttribute("class","btn btn-primary d-block")
    button3.setAttribute("href","https://trackit.uppyjc.co.uk/TrackIT/Forms/Train.aspx?Today=" + serviceId + "&Estimate=True")
    button3.setAttribute("target","_blank")
    let text3  = document.createTextNode("Open TrackIT!")
    button3.appendChild(text3)

    var br = document.createElement("br")
    var br2 = document.createElement("br")
    var br3 = document.createElement("br")

    origbutton.after(br)
    br.after(button2)
    button2.after(br2)
    br2.after(button)
    button.after(br3)
    br3.after(button3)

})();