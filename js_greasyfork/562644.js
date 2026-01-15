// ==UserScript==
// @name         MZ Report Transfer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  User script to easy report cheat transfer on Managerzone transfers market
// @author       xente
// @match        https://www.managerzone.com/?p=transfer*
// @icon         https://statsxente.com/MZ1/View/Images/main_icon.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562644/MZ%20Report%20Transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/562644/MZ%20Report%20Transfer.meta.js
// ==/UserScript==

(function() {
    'use strict';
getSport()
generateCSS()
const observer = new MutationObserver((mutations) => {
    if (mutations.length > 0) {
        renderButtons()
    }
});



var rated="Transfer Reported\nPlayer ID: 224485899\n---------------------------\n"
generateModal();

observer.observe( document.getElementById("players_container"), { characterData: true, subtree: true, childList: true });


function renderButtons(){

    setTimeout(() => {


    const players = document.querySelectorAll('.playerContainer');

players.forEach(player => {

    if(!player.innerHTML.includes("Report Transfer Icon")){

    let boxs=player.getElementsByClassName("box_dark");
        let subheaders=player.getElementsByClassName("subheader");
        let player_links=subheaders[0].getElementsByTagName("a")

        let href =player_links[0].href;
        let urlParams = new URLSearchParams(new URL(href).search);
        let pid = urlParams.get('pid');

    let links=boxs[2].getElementsByClassName("player_icon_placeholder training_graphs "+window.sport)
    let ids=player.getElementsByClassName("player_name");


    let txt = '<span id=but' + pid + ' class="player_icon_placeholder"><a href="#" onclick="return false"'
        txt += 'title="Report Transfer Icon" class="player_icon"><span class="player_icon_wrapper">'
        txt += '<span class="player_icon_image" style="background-image: url(\'https://statsxente.com/MZ1/View/Images/spy_tiny.png\'); width: 21px; height: 18px; background-size: auto;'
        txt += 'z-index: 0;"></span><span class="player_icon_text"></span></span></a></span>'

if(links[0]){
    if(!document.getElementById('but' + pid)){
    links[0].insertAdjacentHTML('afterend',txt);
}
}else{
     let links=boxs[1].getElementsByClassName("player_icon_placeholder training_graphs "+window.sport)
     if(links[0]){
     links[0].insertAdjacentHTML('afterend',txt);
     }

}

        if(document.getElementById('but' + pid)){
         document.getElementById('but' + pid).addEventListener('click', function () {
             rated="Transfer Reported\nPlayer ID: "+pid+"\n---------------------------\n"
             document.getElementById("description").value=rated
            document.getElementById("myModal_cargando1").style.display = "flex";
            document.getElementById("modal_content_div_cargando1").style.backgroundColor = "#f2f2f200";
          document.getElementById("modal_content_div_cargando1").style.paddingBottom = "25%";
             document.getElementById("contenido_modal_cargando1").style.borderRadius = "5px";
             document.getElementById("contenido_modal_cargando1").style.backgroundColor = "#f2f2f2";
    });
        }


}





});

}, 2000);

    }

function generateModal(){
    var footer = document.getElementById("links_copy");
    footer.innerHTML += '<center><div id="snackbar"></div></center><div id="myModal_cargando1" class="modal_cargando_report"><div class="modal-content_cargando_report" id="modal_content_div_cargando1"><div id="contenido_modal_cargando1" style="background-color:#f2f2f200;"></div></div></div>'
    let newContent='<div style="margin: 0 auto; text-align:center;"><img alt="" id="closeButtonMarket" src="https://statsxente.com/MZ1/View/Images/error.png" style="width:40px; height:40px; cursor:pointer;"/></div></br></br>'
    document.getElementById("modal_content_div_cargando1").innerHTML = newContent+document.getElementById("modal_content_div_cargando1").innerHTML
    document.getElementById("closeButtonMarket").addEventListener('click', function () {
            document.getElementById("myModal_cargando1").style.display = "none";
        });

    var select = document.createElement("select");
    select.id="cs"
    select.name="cs"
    select.className="mi-select"
    select.setAttribute("autocomplete", "off");
    var textarea = document.createElement("textarea");
    var button = document.createElement("button");


    
    var opciones = [
        {value: "0", text: "Choose lang", selected: true, disabled: true},
        {value: "cn", text: "Chinese"},
        {value: "de", text: "Deutsch"},
        {value: "en", text: "English"},
        {value: "es", text: "Español"},
        {value: "fr", text: "Français"},
        {value: "it", text: "Italiano"},
        {value: "nl", text: "Nederlands"},
        {value: "pl", text: "Polski"},
        {value: "pt", text: "Português"},
        {value: "ro", text: "Romanian"},
        {value: "ru", text: "Russian"},
        {value: "se", text: "Svenska"},
        {value: "tr", text: "Türkçe"}
    ];


opciones.forEach(function(opcion) {
  var option = document.createElement("option");
  option.value = opcion.value;
  option.textContent = opcion.text;
  opcion.selected = opcion.value === GM_getValue("favorite_support","0");
  if (opcion.selected) {
    option.selected = true;
  }
  if (opcion.disabled) {
    option.disabled = true;
  }
  select.appendChild(option);
});




    textarea.placeholder = "Your comment here";
    textarea.id="user_comment"
    textarea.name="user_comment"
    textarea.style.height="7.5em"
    var textarea1 = document.createElement("textarea");
    textarea1.id="description"
    textarea1.name="description"
    textarea1.value=rated
    textarea1.setAttribute("readonly", true);
    textarea1.style.height="10em"
    textarea1.style.backgroundColor="#8f8f8f"

    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-incognito" viewBox="0 0 16 16"><path fill-rule="evenodd" d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205l-.014-.058-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5s-1.411-.136-2.025-.267c-.541-.115-1.093.2-1.239.735m.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a30 30 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274M3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5m-1.5.5q.001-.264.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085q.084.236.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5"/></svg> Report';
    button.id="send_support_form"
    button.className="mi-boton"

    var formularioDiv = document.createElement("form");
    formularioDiv.className="mail_form";
    formularioDiv.setAttribute("method", "post");
    formularioDiv.setAttribute("action", "https://www.managerzone.com/?p=support_form");


    var inputHidden = document.createElement("input");
    inputHidden.type = "hidden";
    inputHidden.name = "send";
    inputHidden.value = "true";
    formularioDiv.appendChild(inputHidden);

    inputHidden = document.createElement("input");
    inputHidden.type = "hidden";
    inputHidden.name = "selected_section";
    inputHidden.value = "14";

    formularioDiv.appendChild(inputHidden);
    formularioDiv.appendChild(document.createElement("br"));
    formularioDiv.appendChild(select);
    formularioDiv.appendChild(document.createElement("br"));
    formularioDiv.appendChild(document.createElement("br"));
    formularioDiv.appendChild(textarea);
    formularioDiv.appendChild(document.createElement("br"));
    formularioDiv.appendChild(textarea1);
    formularioDiv.appendChild(document.createElement("br"));
    formularioDiv.appendChild(button);
    formularioDiv.appendChild(document.createElement("br"));
    formularioDiv.appendChild(document.createElement("br"));



     document.getElementById("contenido_modal_cargando1").appendChild(formularioDiv);

     document.getElementById("cs").addEventListener('change', function () {
         const actual_cat = this.value;
         GM_setValue("favorite_support", actual_cat);
            });




     document.getElementById("user_comment").addEventListener('input', function () {
              document.getElementById("description").value=rated+document.getElementById("user_comment").value
            });

    document.getElementById('send_support_form').addEventListener('click', function(e) {
        e.preventDefault();
        var formData = new FormData(document.querySelector('.mail_form'));
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.managerzone.com/?p=support_form', true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                showSnackBar(true)
                document.getElementById("myModal_cargando1").style.display = "none";
            } else {
                //console.error('Error en la solicitud AJAX:', xhr.statusText);
                showSnackBar(false)
                document.getElementById("myModal_cargando1").style.display = "none";
            }
        };
        xhr.onerror = function() {
            showSnackBar(false)
            document.getElementById("myModal_cargando1").style.display = "none";
        };
        xhr.send(formData);
    });

}


function showSnackBar(status){
let x = document.getElementById("snackbar_stx");
if(status){
    let txt = "<img alt='' src='https://statsxente.com/MZ1/View/Images/spy.png' width='25px' height='25px'> <span style='color:#4caf50; font-size: 17px;'>"
    txt+='Success: </span>Transfer reported</br></br>'
    x.innerHTML = txt;
}else{
    let txt = "<img alt='' src='https://statsxente.com/MZ1/View/Images/spy.png' width='25px' height='25px'> <span style='color:#d75a4a; font-size: 17px;'>"
    txt+='Error: </span>Something went wrong, please try again</br></br>'
    x.innerHTML = txt;
}
    x.className = "showSnackBar_stx";
    setTimeout(function () { x.className = x.className.replace("showSnackBar_stx", ""); }, 8000);
}


    function getSport() {
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

        let lsport = "F"
        let sport_id = 1;
        if (sportCookie === "hockey") {
            lsport = "H";
            sport_id = 2;
        }
        window.sport = sportCookie;
        window.lsport = lsport;
        window.sport_id = sport_id;
        window.userLocal = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    }

       function getCookie(nombre) {
        let regex = new RegExp("(?:(?:^|.*;\\s*)" + nombre + "\\s*\\=\\s*([^;]*).*$)|^.*$");
        let valorCookie = document.cookie.replace(regex, "$1");
        return decodeURIComponent(valorCookie);
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

function generateCSS(){
     GM_addStyle(`.modal_cargando_report {
        display: none;
        position: fixed;
        z-index: 150;
        padding-top: 25px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.75);
        justify-content: center;
        align-items: center;
    }

    .modal-content_cargando_report {
    position:relative;
border-radius:7px;
        background-color: #fefefe;
        width: 50%;
        height: 20%;
        display: block;
 justify-content: space-around;
    align-items: flex-start;
    }
    .close_cargando_report {
        color: #aaaaaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close_cargando_report:hover,
    .close_cargando_report:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }


    textarea {
    width: 80%;
    background-color: #f0f8ff;
    color: #333;            /* Color del texto */
    font-size: 16px;        /* Tamaño de la fuente */
    border: 2px solid #ccc; /* Borde */
    border-radius: 5px;     /* Bordes redondeados */
    padding: 10px;          /* Espaciado interno */
    resize: none;           /* Evita que el usuario cambie el tamaño */
}


#snackbar_stx {
  visibility: hidden;
  position: fixed;
  /*display: flex;*/
  align-items: center;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 350px;
  background-color: #323232;
  color: #ffffffb3;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  z-index: 170;
  bottom: 30px;
  font-size: 17px;
  border-radius: 5px;
  box-shadow: 0 3px 5px -1px #0003, 0 6px 10px #00000024, 0 1px 18px #0000001f;
}

#snackbar_stx.showSnackBar_stx {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 8s forwards;
  animation: fadein 0.5s, fadeout 0.5s 8s forwards;
}

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}


.mi-select {
    width: 10em;
    height: 2.5em;
    background-color: #f0f8ff;
    border: 2px solid #ccc;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    font-size: 16px;
    padding: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Sombra */
    color: #333;
    outline: none;
}



.mi-boton {
    font-weight: bold;
    background-color: #4caf50; /* Fondo naranja */
    color: white;             /* Texto blanco */
    font-size: 16px;          /* Tamaño del texto */
    border: none;             /* Sin bordes */
    border-radius: 5px;      /* Bordes redondeados */
    padding: 10px 20px;       /* Espaciado interno */
    font-family: Arial, sans-serif;
    cursor: pointer;          /* Cambia el cursor al pasar */
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Sombra */
    transition: background-color 0.3s ease, transform 0.2s ease; /* Animaciones */
}

.mi-boton:hover {
    background-color: #3e8e41; /* Fondo más claro al pasar el mouse */
}

.mi-boton:active {
    background-color: #2e6f32; /* Fondo más oscuro al hacer clic */
}


    `)
    }


})();