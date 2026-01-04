// ==UserScript==
// @name         janitorai image censorship
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  A way to replace image from the shitty janitorai mod team that censor character hugging
// @author       James
// @icon         https://ella.janitorai.com/hotlink-ok/logo.png
// @license      MIT
// @match        https://janitorai.com/chats/*
// @downloadURL https://update.greasyfork.org/scripts/558801/janitorai%20image%20censorship.user.js
// @updateURL https://update.greasyfork.org/scripts/558801/janitorai%20image%20censorship.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var intervalTime = 3;
    var linkImage;
    var avatarName;
    var automatic;

    var style = document.createElement('style');
    style.innerHTML = 'body {font-family: Arial, Helvetica, sans-serif;}.my-modal-image {display: none; /* Hidden by default */position: fixed; /* Stay in place */z-index: 20; /* Sit on top */padding-top: 100px; /* Location of the box */left: 0;top: 0;width: 100%; /* Full width */height: 100%; /* Full height */overflow: auto; /* Enable scroll if needed */background-color: rgb(0,0,0); /* Fallback color */background-color: rgba(0,0,0,0.4); /* Black w/ opacity */font-size: 18px;}.my-modal-content-image {background-color: black;margin: auto;padding: 20px;border: 1px solid #888;width: 80%;color: #42b01a}.my-close-image {color: #aaaaaa;float: right;font-size: 28px;font-weight: bold;}.my-close-image:hover,.my-close-image:focus {color: red;text-decoration: none;cursor: pointer;}';
    document.head.appendChild(style);

    var elemDiv = document.createElement('div');
    document.body.appendChild(elemDiv);
    elemDiv.innerHTML = '<div id="myModalImage" class="my-modal-image"><div class="my-modal-content-image"><span id="my-close-image" class="my-close-image">&times;</span>Interval check of time (In seconds): <input type="number" id="my-interval-time-image" value="3"><br>Image link, can be external or base64: <input type="text" id="my-image-link"><br>Avatar name(needed to avoid changing your avatar picture and only the bot): <input type="text" id="my-image-avatar"><br><div>In progress: </div><div id="in-progress-image">❌</div> <div id="my-number-of-image"></div><br><input type="button" id="my-image-button" value="Start changing Image">  <input type="button" id="my-image-button-stop" value="Stop">  Automatic on<input id="my-automatic-image" type="checkbox"></div></div>';

    var modal = document.getElementById("myModalImage");
    var span = document.getElementById("my-close-image");

    span.onclick = function() {
        modal.style.display = "none";//The x button to close
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";//When the user clicks anywhere outside of the modal, close it
        }
    }

    document.onkeydown = function(){
        if(window.event && window.event.keyCode == 113)//F1 keyboard listen
        {
            openModal();//Hidden button to active pop-up
        }
    }

    function openModal(){
        document.getElementById("my-image-avatar").value = localStorage.getItem("imageavatar");
        document.getElementById("my-image-link").value = localStorage.getItem(document.URL+"imagelink");
        if(localStorage.getItem("automatic") == "true"){
            document.getElementById("my-automatic-image").checked = localStorage.getItem("automatic");
        }
        modal.style.display = "block";
    }

    var myImageButton = document.getElementById("my-image-button");
    myImageButton.onclick = function() { startChangingImage();};

    var myImageButtonStop = document.getElementById("my-image-button-stop");
    myImageButtonStop.onclick = function() { stopOperation();};

    var intervalID;
    var listOfMessage;
    var allImage;
    var zoomImage;

    function startChangingImage(){
        myImageButton.disabled = true;
        document.getElementById("in-progress-image").innerText = "✅";



        intervalTime = parseInt(document.getElementById("my-interval-time-image").value);
        linkImage = document.getElementById("my-image-link").value;
        avatarName = document.getElementById("my-image-avatar").value;
        automatic = document.getElementById("my-automatic-image").checked;

        localStorage.setItem(document.URL+"imagelink", linkImage);
        localStorage.setItem("imageavatar", avatarName);
        localStorage.setItem("automatic", automatic);


        if(linkImage){

            intervalID = setInterval(_ => {
                listOfMessage = document.querySelectorAll('[data-index]');
                for (let i = 0; i < listOfMessage.length; i++) {
                    if(listOfMessage[i].getElementsByClassName('_nameText_1v19f_275')[0].innerText != avatarName){
                        changeImage(listOfMessage[i].getElementsByClassName('_messageAvatarImage_1v19f_305 _borderRadiusMd_1v19f_344')[0]);

                    }
                }


                zoomImage = document.getElementsByClassName('_enlargedAvatarImage_1v19f_242');
                if(zoomImage.length != 0){
                    changeImage(zoomImage[0]);
                }


            }, intervalTime * 1000);//Every second check current status 1 seconds = 1000 millseconds

        }

    }

    function changeImage(image){
        image.src = linkImage;
    }

    var timeoutId = setTimeout(_ => {
        if(localStorage.getItem("automatic") == "true"){
            document.getElementById("my-image-avatar").value = localStorage.getItem("imageavatar");
            document.getElementById("my-image-link").value = localStorage.getItem(document.URL+"imagelink");
            document.getElementById("my-automatic-image").checked = localStorage.getItem("automatic");
            startChangingImage();
        }
    }, 2000);//2 second dealy

    function stopOperation(){
        document.getElementById("in-progress-image").innerText = "❌";
        myImageButton.disabled = false;
        clearInterval(intervalID);
    }

    document.getElementById("my-automatic-image").addEventListener('change', function() {
        automatic = document.getElementById("my-automatic-image").checked;
        localStorage.setItem("automatic", automatic);
    });


    //Added the image icon to click
    elemDiv = document.createElement('div');
    elemDiv.innerHTML = '<div class="_tooltipContainer_1v19f_40"><button id="button-for-image-modal" type="button" class="_controlPanelButton_1v19f_8" style="color: rgb(255, 255, 255);" aria-label="Change image with his"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M18.22 19.9628C17.8703 20 17.4213 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.7157 19.5903 4.40973 19.2843 4.21799 18.908C4.12583 18.7271 4.07264 18.5226 4.04193 18.2622M18.22 19.9628C18.5007 19.9329 18.7175 19.8791 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V13M11 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M18 9V6M18 6V3M18 6H21M18 6H15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';
    setTimeout(() => {
        document.body.getElementsByClassName('_menuWrapper_hs488_2')[0].prepend(elemDiv);
    }, "3000");
    setTimeout(() => {
        document.getElementById("button-for-image-modal").onclick = openModal;
    }, "4000");


})();