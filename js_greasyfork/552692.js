// ==UserScript==
// @name        TrackIt Integration
// @description Integrate TrackIt with other sources
// @match       https://trackit.uppyjc.co.uk/TrackIT/Forms/Train.aspx*
// @version 0.0.1.20251017131738
// @namespace https://greasyfork.org/users/1526162
// @downloadURL https://update.greasyfork.org/scripts/552692/TrackIt%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/552692/TrackIt%20Integration.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    var children =document.getElementById("lblTrainDetails").children
    var length = children.length
    let i = 0
    var serviceId = ""
    var RegEx = /Today's  ?([A-Z0-9]{1,6})/

    while (i < length) {
        var matchtext = children[i].textContent
        if (matchtext) {
            var match = matchtext.match(RegEx)
            if (match) {
                serviceId = match[1]
            }
        }
        i = i + 1
    }

    var year = new Date().getFullYear()
    var month = new Date().getMonth()+1
    var day = new Date().getDate()
    var enc = serviceId.charCodeAt(0)
    var RIDend = enc + serviceId.slice(1)

    month = String(month).padStart(2, '0')
    day = String(day).padStart(2, '0')

    var origbutton = document.getElementById("lblModeLink")

    let button = document.createElement("a")
    button.setAttribute("href","https://timetables.trainsplit.dev/times.aspx?uid=" + serviceId + "&date=" + year + month + day)
    button.setAttribute("target","_blank")
    let text  = document.createTextNode("Open TrainSplit Darwin")
    button.appendChild(text)

    let button2 = document.createElement("a")
    button2.setAttribute("href","https://www.realtimetrains.co.uk/service/gb-nr:" + serviceId + "/" + year + "-" + month + "-" + day + "/detailed")
    button2.setAttribute("target","_blank")
    let text2  = document.createTextNode("Open RealTimeTrains")
    button2.appendChild(text2)

    let button3 = document.createElement("a")
    button3.setAttribute("href","https://trains.gaelan.me/stations/BTH/train/" + year + month + day + RIDend + "?")
    button3.setAttribute("target","_blank")
    let text3  = document.createTextNode("Open Gaelan Darwin")
    button3.appendChild(text3)
    
    let button4 = document.createElement("a")
    button4.setAttribute("href","https://timetables.trainsplit.com/times.aspx?uid=" + serviceId + "&date=" + year + month + day)
    button4.setAttribute("target","_blank")
    let text4  = document.createTextNode("Open Timetable History")
    button4.appendChild(text4)

    origbutton.after(button2)
    button2.after(button)
    button.after(button3)
    button3.after(button4)

    origbutton.insertAdjacentText("afterend", " - ")
    button2.insertAdjacentText("afterend", " - ")
    button.insertAdjacentText("afterend", " - ")
    button3.insertAdjacentText("afterend", " - ")
})();