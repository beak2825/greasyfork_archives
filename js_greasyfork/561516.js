// ==UserScript==
// @name        TrainSplit Beta Integration
// @description Integrate TrainSplit Beta with other sources
// @match       https://timetables-beta.trainsplit.com/times.aspx*
// @version 0.0.1.20260105152647
// @namespace https://greasyfork.org/users/1526162
// @downloadURL https://update.greasyfork.org/scripts/561516/TrainSplit%20Beta%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/561516/TrainSplit%20Beta%20Integration.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    var url = window.location.toString();

    var splitUrl = url.split("=")

    var serviceId = splitUrl[1].substring(0,6)
    var year = splitUrl[2].substring(0,4)
    var month = splitUrl[2].substring(4,6)
    var day = splitUrl[2].substring(6,8)

    var buttonDiv = document.getElementsByClassName("service-info-cards")[0]

    let button = document.createElement("a")
    button.setAttribute("class","service-info-card")
    button.setAttribute("href","https://www.realtimetrains.co.uk/service/gb-nr:" + serviceId + "/" + year + "-" + month + "-" + day + "/detailed")
    button.setAttribute("target","_blank")
    //button.setAttribute("style","margin:5px;")
    let text  = document.createTextNode("Open RealTimeTrains")

    let button2 = document.createElement("a")
    button2.setAttribute("class","service-info-card")
    button2.setAttribute("href","https://timetables-beta.trainsplit.com/times.aspx?uid=" + serviceId + "&date=" + year + month + day)
    //button2.setAttribute("target","_blank")
    let text2  = document.createTextNode("Open Darwin")

    let button3 = document.createElement("a")
    button3.setAttribute("class","service-info-card")
    button3.setAttribute("href","https://trackit.uppyjc.co.uk/TrackIT/Forms/Train.aspx?Today=" + serviceId + "&Estimate=True")
    button3.setAttribute("target","_blank")
    //button3.setAttribute("style","margin:5px;")
    let text3  = document.createTextNode("Open TrackIT!")

    button.appendChild(text)
    buttonDiv.appendChild(button)

    button2.appendChild(text2)
    buttonDiv.appendChild(button2)

    button3.appendChild(text3)
    buttonDiv.appendChild(button3)

})();