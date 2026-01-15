// ==UserScript==
// @name         MZ Investigate User
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Review a user's connections and ip's in a graph model
// @author       xente
// @icon         https://statsxente.com/MZ1/View/Images/main_icon.png
// @license      GNU
// @match        https://www.managerzone.com/?p=profile*
// @match        https://www.managerzone.com/?p=league*
// @match        https://www.managerzone.com/?p=team*
// @downloadURL https://update.greasyfork.org/scripts/562645/MZ%20Investigate%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/562645/MZ%20Investigate%20User.meta.js
// ==/UserScript==

(function() {
    'use strict';
    getSportMain()
    var token="3afa2aba0a4fc59bfa6bb02beb7909cb"
    var basePath="https://statsxente.com/MZ1/View/investigateUser.php?token="+token+"&sport="+window.sport


    setTimeout(function () {
        const urlParams = new URLSearchParams(window.location.search);
        if ((urlParams.has('p')) && (urlParams.get('p') === 'league')){
            leagues();
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'profile')){
            profile()
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'team')){
            team()
        }
    }, 1000);





    function leagues(){
            let elems = document.getElementsByClassName("nice_table");
            let tabla = elems[0]
            let filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

            for (let i = 0; i < filas.length; i++) {
                let celda = filas[i].cells[0];
                let celda1 = filas[i].cells[1];
                let as=celda1.getElementsByTagName("a");
                let index=0;
                if(as.length>1){
                    index=1;
                }
                let urlParams1 = new URLSearchParams(as[index].href);
                celda.innerHTML="<img id='but_"+urlParams1.get("tid")+"' src='https://statsxente.com/MZ1/View/Images/spy.png' style='cursor:pointer;' width='11px'/>"+ celda.innerHTML
                 document.getElementById("but_"+urlParams1.get("tid")).addEventListener('click', function () {
                      event.preventDefault();
        var text=urlParams1.get("tid")
        var url = basePath+"&team_id="+text
       openWindow(url)


            })


            }


    }


    function profile(){
             let mainDiv = document.querySelectorAll('div[class="flex-grow-1"]');
                 let mainTable=mainDiv[1].getElementsByTagName("table")[0];
                 let secondTd = mainTable.querySelector("table tr td:nth-child(2)");
                 let username=secondTd.innerText;
                 let elems = document.getElementsByClassName("box_dark");
                 let table = elems[0].getElementsByTagName("table")[0];
                 let lastTr = table.querySelector("tr:last-child");
                 let tds = lastTr.getElementsByTagName("td");
                 if(tds.length===4){
                  let tr1 = document.createElement("tr");
                 let td1 = document.createElement("td");
                 td1.style.width="38px";
                 td1.style.textAlign ="right";
                 td1.innerHTML = '<a class="messenger-link"><img src="https://statsxente.com/MZ1/View/Images/spy.png" style="padding-right: 0px; width: 15px; height: 15px;" /></a>';

                 let td2 = document.createElement("td");
                 td2.innerHTML = '<a id="invest" class="messenger-link" href="">Investigate</a>'

                 tr1.appendChild(td1);
                 tr1.appendChild(td2);

                      lastTr.parentNode.appendChild(tr1);



                 }else{

                 let td1 = document.createElement("td");
                 td1.style.width="38px";
                 td1.style.textAlign ="right";
                 td1.innerHTML = '<a class="messenger-link"><img src="https://statsxente.com/MZ1/View/Images/spy.png" style="padding-right: 5px; width: 15px; height: 15px;" /></a>';

                 let td2 = document.createElement("td");
                 td2.innerHTML = '<a id="invest" class="messenger-link" href="">Investigate</a>'
                 lastTr.appendChild(td1);
                 lastTr.appendChild(td2);

                 }


                           document.getElementById("invest").addEventListener('click', function () {
                      event.preventDefault();
                               var url = basePath+"&username="+username
                               openWindow(url)

            })


    }

    function team(){
 let mainDiv = document.querySelectorAll('div[class="box_dark"]');
                mainDiv[0].innerHTML+='<center><img id="investigate" src="https://statsxente.com/MZ1/View/Images/spy.png" style="cursor:pointer; width: 15px; height: 15px;" /></center>'
                  document.getElementById("investigate").addEventListener('click', function () {
                      event.preventDefault();
                      const urlParams1 = new URLSearchParams(window.location.search);
        var url = basePath+"&team_id="+urlParams1.get('tid')

openWindow(url)

            })

    }

    function openWindow(url){
        let porAncho=0.85
        let porAlto=1.1
        let ventanaAncho = (window.innerWidth) * porAncho
        let ventanaAlto = (window.innerHeight) * porAlto
        let ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
        let ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
        let opcionesVentana = "width=" + ventanaAncho +
            ",height=" + ventanaAlto +
            ",left=" + ventanaIzquierda +
            ",top=" + ventanaArriba;
        window.open(url, "_blank", opcionesVentana);
    }

     function getSportMain(){


        let sportCookie=getSportByMessenger()
        if(sportCookie===""){
            sportCookie = getCookie("MZSPORT");
        }
        if(sportCookie===""){
            sportCookie=getSportByLink()
        }
        if(sportCookie===""){
            sportCookie=getSportByScript()
        }

        window.sport = sportCookie;
    }

     function getSportByLink(){
        let element = document.getElementById("settings-wrapper");
        if (element) {
            let firstLink = element.getElementsByTagName("a")[0];
            if (firstLink) {
                if(firstLink.href.includes("soccer")){
                    return "hockey"
                }else{
                    return "soccer"
                }
            }
        }
    }
    function getSportByScript(){
        const script = document.createElement('script');
        script.textContent = `
    let newElement = document.createElement("input");
        newElement.id= "stx_sport";
        newElement.type = "hidden";
        newElement.value=window.ajaxSport;
        let body = document.body;
        body.appendChild(newElement);

`;
        document.documentElement.appendChild(script);
        script.remove();
        return document.getElementById("stx_sport").value
    }
    function getSportByMessenger() {
        if (document.getElementById("messenger")) {

            if ((document.getElementById("messenger").className === "soccer") || (document.getElementById("messenger").className === "hockey")) {
                return document.getElementById("messenger").className
            }
        }
        return ""
    }


    function getCookie(nombre) {
        let regex = new RegExp("(?:(?:^|.*;\\s*)" + nombre + "\\s*\\=\\s*([^;]*).*$)|^.*$");
        let valorCookie = document.cookie.replace(regex, "$1");
        return decodeURIComponent(valorCookie);
    }



})();