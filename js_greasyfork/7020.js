// ==UserScript==
// @name        1043nd Statistics KB/MB/GB
// @namespace   Alpe
// @include     http://192.168.1.254/
// @include     http://192.168.1.254/userRpm/SystemStatisticRpm.htm*
// @include     http://192.168.1.254/userRpm/StatusRpm.htm*
// @include     http://192.168.1.254/userRpm/AssignedIpAddrListRpm.htm
// @include     http://192.168.1.254/userRpm/FixMapCfgRpm.htm*
// @include     http://192.168.1.254/userRpm/SystemLogRpm.htm*
// @include     http://192.168.1.254/userRpm/WlanStationRpm.htm*
// @version     1.6.2
// @grant       none
// @description Show KB, MB and GB on 1043nd router statistics.
// @downloadURL https://update.greasyfork.org/scripts/7020/1043nd%20Statistics%20KBMBGB.user.js
// @updateURL https://update.greasyfork.org/scripts/7020/1043nd%20Statistics%20KBMBGB.meta.js
// ==/UserScript==

var loaded = document.forms.length;

if (document.querySelector("div.loginBox")){
    auth = "Basic "+Base64Encoding("admin:yzwn35rw");
    document.cookie = "Authorization="+escape(auth)+";path=/";
    location.reload();
}

var colorip = [['(6.)|(250)', 'Blue'],['(7.)|(241)', 'BlueViolet'],['8.', 'DarkCyan'],['1..', 'DeepPink'],['252', 'DarkOrange'],['2(5|4).', 'DarkGreen']]
function changecolor(element, ip){
    ip = (ip.indexOf('.') !== -1 ? ip.split('.')[3] : ip)
    for (var i=0; i<colorip.length; i++){
        if(RegExp(colorip[i][0]).test(ip)){
            element.style.color = colorip[i][1];
            break;
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function convertvalue(n, x) {
    if (typeof(x) == "undefined"){
        return numberWithCommas(n) + " B";
    } else if (x == "TB" && n >= 1099511627776){
        return numberWithCommas((n / 1024 / 1024 / 1024 /1024).toFixed(2)) + " TB";
    } else if ((x == "TB" || x == "GB") && n >= 1073741824){
        return numberWithCommas((n / 1024 / 1024 / 1024).toFixed(2)) + " GB";
    } else if ((x == "TB" || x == "GB" || x == "MB") && n >= 1048576){
        return (n / 1024 / 1024).toFixed(2) + " MB";
    } else if ((x == "TB" || x == "GB" || x == "MB" || x == "KB") && n >= 1024){
        return (n / 1024).toFixed(2) + " KB";
    } else return n + " B";
}

if (loaded && document.URL.indexOf("/userRpm/SystemStatisticRpm.htm") != "-1"){
    hid = document.querySelectorAll("tr");
    //hid[5].parentNode.removeChild(hid[5]);
    hid[1].parentNode.removeChild(hid[1]);
    if (document.forms[0].Num_per_page.value < 100){ document.forms[0].Num_per_page.value = "100"; window.setTimeout("doChange()",50); }
    element = document.getElementsByClassName('ListM');
    total = 0;
    current = 0;
    totalpack = 0;

    for (var i=6; i<=8; i+=2){
        if (element[i].innerHTML == "Bytes"){
            element[i].innerHTML = "Data";
        }
    }

    if(localStorage['1043nd']){
        for (var i=12; i<element.length-2; i+=9) {
            elements = JSON.parse(localStorage['1043nd']);
            idx = elements.indexOf(element[i].innerHTML.split("<br>")[1]);
            if (idx !== -1){
                element[i].title = elements[idx];
                element[i].innerHTML = element[i].innerHTML.replace(element[i].innerHTML.split("<br>")[1], elements[idx-1].split("*")[0]);
                //element[i].title = elements[idx-1];
            }
        }
    }
    
    for (var i=13; i<element.length; i+=9) {
        if (isNaN(element[i].innerHTML)){
        } else {
            totalpack = totalpack + parseInt(element[i].innerHTML);
            //element[i].innerHTML = numberWithCommas(element[i].innerHTML);
        }
    }
    
    for (var i=14; i<element.length; i+=9) {
        if (isNaN(element[i].innerHTML)){
        } else {         
            total = total + parseInt(element[i].innerHTML);
            element[i].innerHTML = convertvalue(element[i].innerHTML, "MB");
            element[i].innerHTML += "<br>(~" + convertvalue(element[i-1].innerHTML*800, "TB") + ")";
            element[i].title = "Considering 800 bytes/packet";
            
            percent = parseFloat(element[i-1].innerHTML/totalpack*100).toFixed(3);
            element[i-1].innerHTML = numberWithCommas(element[i-1].innerHTML) + "<br>(" + percent + "%)";
            
            current = current + parseInt(element[i+2].innerHTML);
            element[i+2].innerHTML = convertvalue(element[i+2].innerHTML, "KB") + "/s";
            
            changecolor(element[i].parentElement, element[i-2].innerHTML.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.([0-9]{1,3})/)[1]);
        }
    }
 
    if(totalpack*700<total){ console.log(convertvalue(total, "MB") + " - " + convertvalue(current, "KB") + "/s"); } else { console.log("~" + convertvalue(totalpack*800, "MB") + " - " + convertvalue(current, "KB") + "/s"); }
    
    //var a = GM_getValue("historycurrent", "0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0");
    //var a = a.split('|');
    //a.shift();
    //a.push((current/ 1024).toFixed(2));
    //console.log(a);
    //var a = a.join('|');
    //GM_setValue("historycurrent", a);    
    
    if (StatRulePara[1] == 5 && StatRulePara[2] && StatRulePara[0] && bRefreshFlag == 1){ window.setTimeout("doChange()",5000); }

} else if (loaded && document.URL.indexOf("/userRpm/StatusRpm.htm") != "-1"){
    element = document.querySelectorAll("TD.ListC2");
    if (element[0].parentNode.children[0].innerHTML === "Bytes:"){
        element[0].parentNode.children[0].innerHTML = "Data:";
        element[0].innerHTML = convertvalue(element[0].innerHTML, "GB");
        element[1].innerHTML = convertvalue(element[1].innerHTML, "GB");
        element[2].innerHTML = numberWithCommas(element[2].innerHTML) + " (~" + convertvalue(element[2].innerHTML*800, "TB") + ")";
        element[2].title = "Considering 800 bytes/packet";
        element[3].innerHTML = numberWithCommas(element[3].innerHTML) + " (~" + convertvalue(element[3].innerHTML*800, "TB") + ")";
        element[3].title = "Considering 800 bytes/packet";
        console.log("D: " + element[0].innerHTML + "    U: " + element[1].innerHTML);
        //if (wanPara[2] == "0.0.0.0" && wanPara[row+13] == 0){ doConnect(1); }
    }
} else if (loaded && document.URL.indexOf("/userRpm/AssignedIpAddrListRpm.htm") != "-1"){
    element = [];
    for (var i=0; i<DHCPDynList.length-2; i+=4){
        //if (DHCPDynList[i+3] == "Permanent"){
            element.push(DHCPDynList[i], DHCPDynList[i+1], DHCPDynList[i+2]);
        //}
    }
    
    function dhcplist(a, b, c){
        if (!c){ c=""  } else { c="192.168.1." + c; }
        //c=c||"";
        if (element.indexOf(b) === -1){
            element.push(a + "*", b, c);
        }
    }
    
    dhcplist("Odroid", "00-1E-06-C1-32-75", "250");
    dhcplist("Edson", "00-1A-3F-4B-D5-65", "252");
    dhcplist("DIR-809", "90-8D-78-65-7D-5F", "252");
    dhcplist("HP Deskjet 3510 series", "74-46-A0-FA-5C-0E", "241"); // else element[element.indexOf("74-46-A0-FA-5C-0E")-1] += " (HP Deskjet 3510 series)";
    dhcplist("HP LaserJet Professional P 1102w", "7C-E9-D3-91-22-7B", "240");
    dhcplist("NDS", "00-24-F3-7D-A0-29", "62");
    dhcplist("Wifi USB", "00-1A-3F-7B-7B-1A");
    dhcplist("penha-G31M-S2L", "00-1F-D0-E8-4D-9C", "80");
    
    localStorage['1043nd'] = JSON.stringify(element);
    
    element = document.querySelectorAll('TR');
    for (var i=4; i<element.length-2; i++){ changecolor(element[i], element[i].children[3].innerHTML); }
} else if (localStorage['1043nd'] && document.URL.indexOf("userRpm/WlanStationRpm.htm") == "-1"){
    elements = JSON.parse(localStorage['1043nd']);
    if (document.URL.indexOf("/userRpm/FixMapCfgRpm.htm") != "-1"){
        element = document.querySelectorAll("TD.ListC2");
        for (var i=1; i<element.length; i+=5){
            idx = elements.indexOf(element[i].innerHTML);
            if (idx !== -1){
                element[i].innerHTML += " (" + elements[idx-1] + ")";
            }
        }
    } else if (loaded && document.URL.indexOf("userRpm/SystemLogRpm.htm") != "-1"){
        element = document.querySelectorAll("TR");
        for (var i=8; i<element.length-10; i++){
            test = element[i].lastChild.innerHTML.match(/\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\b/);
            //test2 = element[i].lastChild.innerHTML.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/);
            test2 = element[i].lastChild.innerHTML.match(/\b192\.168\.1\.[0-9]{1,3}\b/);
            element[i].innerHTML += '<td style="padding:0 2 0 2;word-break:break-all;">';
            if (test !== null){
                idx = elements.indexOf(test[0].replace(/:/g, "-"));
                if (idx !== -1){
                    element[i].lastChild.innerHTML += elements[idx-1].split("*")[0];
                    changecolor(element[i], elements[idx+1]);
                }
            }
            if (test2 !== null){
                idx = elements.indexOf(test2[0]);
                if (idx !== -1){
                    element[i].lastChild.innerHTML += elements[idx-2];
                }
                changecolor(element[i], test2[0]);
            }
        }
    }
} else if (loaded && document.URL.indexOf("userRpm/WlanStationRpm.htm") != "-1"){
    if (localStorage['1043nd']){
        elements = JSON.parse(localStorage['1043nd']);
        element = document.querySelectorAll("TD.ListC2");
        for (var i=0; i<element.length; i+=4){
            idx = elements.indexOf(element[i].innerHTML);
            if (idx !== -1){
                if (elements[idx-1].substr(-1) == "*"){ a = "*" } else { a = ""; }
                element[i].innerHTML += " (" + elements[idx+1] + a + " / " + elements[idx-1].split("*")[0] + ")";
            }
        }
    }
    
    for (var i=2; i<element.length; i+=4) {
        if (isNaN(element[i].innerHTML)){
        } else {
            changecolor(element[i].parentElement, element[i-2].innerHTML.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.([0-9]{1,3})/)[1]);
            
            element[i].innerHTML = numberWithCommas(element[i].innerHTML) + " (~" + convertvalue(element[i].innerHTML*800, "GB") + ")";
            element[i].title = "Considering 800 bytes/packet";
            
            element[i+1].innerHTML = numberWithCommas(element[i+1].innerHTML) + " (~" + convertvalue(element[i+1].innerHTML*800, "GB") + ")";
            element[i+1].title = "Considering 800 bytes/packet";
        }
    }
}// else if (document.URL.indexOf("file:///") != "-1"){
    //b = [];
    //for (var i=0; i<a.length; i++){
        //c = [];
        //c.push(i, a[i]);
        //b.push(c);
    //}
    //var a = GM_getValue("historycurrent");
    //var a = a.split('|');
    //element = document.getElementsByTagName("div")[0];
    //for (var i=0; i<a.length; i++) {
        //var iDiv = document.createElement('div');
        //iDiv.style = "height: " + a[i] / 3 + "px;";
        //iDiv.float = "left";
        //speed = a[i]>50 ? a[i] + " KB/s" : a[i];
        //iDiv.title = speed;
        //element.appendChild(iDiv);
    //}
    //console.log(document.documentElement.innerHTML);
//}

//extensions.greasemonkey.fileIsGreaseable


//document.getElementsByTagName('SCRIPT')[10] = "a";
//script = document.getElementsByTagName('SCRIPT')[10];
//script.parentNode.removeChild(script);

//console.log(document.getElementsByTagName('SCRIPT')[10]);


    //function checkTime(i) {
        //if (i < 10) {
            //i = "0" + i;
        //}
        //return i;
    //}
    //console.log(new Date().getHours() + ":" + checkTime(new Date().getMinutes()) + ":" + checkTime(new Date().getSeconds()) + " - " + convertvalue(total, "MB") + " - " + convertvalue(current, "KB") + "/s");


//    for (var i=0; i<5; i++){
        //var node = document.getElementsByClassName('ListM')[14].parentNode.cloneNode(true);
        //document.getElementsByClassName('ListM')[14].parentNode.parentNode.appendChild(node);
        //element = document.getElementsByClassName('ListM')[14].parentNode.parentNode.lastChild.children;
        //for (var z = 0; z<element.length; z++) {
            //element[z].innerHTML = "";
        //}
        //element[0].innerHTML = "Total";
        //element[2].innerHTML = convertvalue(total, "GB");
        //element[4].innerHTML = convertvalue(current, "KB") + "/s";
//        if (i == "0"){ element[0].innerHTML = "test"; }
//    }





    //console.time('timerName');
    //var stats = [];
    //for (var i=0; i<13; i++) {
        //stats.push([]);
        //if (i == "1" || i =="3" || i =="4" || i =="5" || i =="6"){
            //for (var n=i; n<statList.length-2; n+=13) {
                //stats[i].push(statList[n]);
            //}
        //}
    //}
    //console.log(stats);
    //console.timeEnd('timerName');