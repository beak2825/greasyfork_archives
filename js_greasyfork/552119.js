// ==UserScript==
// @name         janitorai branch chat
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  A way to create a branch and create a new chat with previous message, remember to put the chat memory from before
// @author       James
// @icon         https://ella.janitorai.com/hotlink-ok/logo.png
// @license      MIT
// @match        https://janitorai.com/chats/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552119/janitorai%20branch%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/552119/janitorai%20branch%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var inProgress = false;

    var style = document.createElement('style');
    style.innerHTML = 'body {font-family: Arial, Helvetica, sans-serif;}.my-modal-branch {display: none; /* Hidden by default */position: fixed; /* Stay in place */z-index: 20; /* Sit on top */padding-top: 100px; /* Location of the box */left: 0;top: 0;width: 100%; /* Full width */height: 100%; /* Full height */overflow: auto; /* Enable scroll if needed */background-color: rgb(0,0,0); /* Fallback color */background-color: rgba(0,0,0,0.4); /* Black w/ opacity */font-size: 18px;}.my-modal-content-branch {background-color: black;margin: auto;padding: 20px;border: 1px solid #888;width: 80%;color: #42b01a}.my-close-branch {color: #aaaaaa;float: right;font-size: 28px;font-weight: bold;}.my-close-branch:hover,.my-close-branch:focus {color: red;text-decoration: none;cursor: pointer;}';
    document.head.appendChild(style);

    var elemDiv = document.createElement('div');
    document.body.appendChild(elemDiv);
    elemDiv.innerHTML = '<div id="myModalbranch" class="my-modal-branch"><div class="my-modal-content-branch"><span id="my-close-branch" class="my-close-branch">&times;</span>Number of message to copy(You can inspect with element and check the data number if you want a precise number): <input type="number" id="my-number-message" value="50"><br>Number start when importing(Default 1 and In case of error, click inspector and select the index number): <input type="number" id="my-number-start-message" value="1"><br><div>In progress: </div><div id="in-progress">❌</div><br><input type="button" id="my-branch-button" value="Start Exporting">  <input type="button" id="my-branch-import-button" value="Start Importing(Content of the json)">  <input type="file" id="jsonFile" accept=".json" /><div id="output"></div><br>  <input type="button" id="my-branch-button-stop" value="Stop"></div></div>';

    var modal = document.getElementById("myModalbranch");
    var btn = document.getElementById("myButtonModal");
    var span = document.getElementById("my-close-branch");
    var divRerollNumber = document.getElementById("my-number-of-branch");

    span.onclick = function() {
        modal.style.display = "none";//The x button to close
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";//When the user clicks anywhere outside of the modal, close it
        }
    }

    document.onkeydown = function(){
        if(window.event && window.event.keyCode == 112)//F1 keyboard listen
        {
            modal.style.display = "block";//Hidden button to active pop-up
        }
    }

    var myBranchButton = document.getElementById("my-branch-button");
    myBranchButton.onclick = function() { startExporting();};

    var myBranchImportButton = document.getElementById("my-branch-import-button");
    myBranchImportButton.onclick = function() { importChatlog();};

    var myBranchButtonStop = document.getElementById("my-branch-button-stop");
    myBranchButtonStop.onclick = function() { stopOperation();};

    var listOfMessage;
    var isExporting = false;
    var scrollDiv;
    var RealIndex;
    var numberMessage;
    var intervalID;
    var listOfChat = [];
    var numberStartChat;
    var stage;
    var maxTry;
    var jsonFile;

    function startExporting(){
        myBranchButton.disabled = true;
        myBranchImportButton.disabled = true;
        isExporting = true;
        numberStartChat = 1;
        numberMessage = parseInt(document.getElementById("my-number-message").value);
        document.getElementById("in-progress").innerText = "✅";
        listOfMessage = document.querySelectorAll('[data-index]');
        scrollDiv = document.querySelectorAll('[data-virtuoso-scroller]')[0];
        stage = 0;
        maxTry = 0;

        //This is piece of shit way to make it work to wait for dom change
        intervalID = setInterval(_ => {
            if(numberStartChat > numberMessage){
                stopOperation();
                return;
            }

            if(!inProgress){
                listOfMessage = document.querySelectorAll('[data-index]');
                for (let i = 0; i < listOfMessage.length; i++) {//Continue until nothing no message left or number of selected message
                    if(listOfMessage[i].getAttribute('data-index') == numberStartChat){
                        RealIndex = [i];
                        break;
                    }
                }
            }
            try{

                if(listOfMessage[RealIndex].getAttribute('data-index') == numberStartChat){
                    if(stage == 0){
                        inProgress = true;
                        maxTry = 0;
                        if(listOfMessage[RealIndex].getElementsByClassName('_controlPanelButton_1v19f_8').length == 2){//Length 2 is user response which has delete and edit
                            listOfMessage[RealIndex].getElementsByClassName('_controlPanelButton_1v19f_8')[1].click();//Important 0 is delete while 1 is edit
                            stage++;
                        }else{//Bot response, only edit button
                            listOfMessage[RealIndex].getElementsByClassName('_controlPanelButton_1v19f_8')[0].click();//Important 0 is delete while 1 is edit
                            stage++;
                        }

                    }else if(stage == 1){
                        listOfChat.push(listOfMessage[RealIndex].getElementsByClassName('_autoResizeTextarea_48ugw_1 ')[0].value);//Text value inside text area edit mode
                        stage++;
                    }else if(stage == 2){
                        listOfMessage[RealIndex].getElementsByClassName('_editPanelButton_1v19f_175 _cancel_1v19f_143')[0].click();//Cancel edit button
                        stage++;
                    }else if(stage == 3){
                        if(listOfMessage[RealIndex].getElementsByClassName('_autoResizeTextarea_48ugw_1 ').length == 0){//Textarea has dissapear
                            numberStartChat++;
                            stage = 0;
                            listOfMessage[RealIndex].scrollIntoView({ block: "end" });
                            scrollDiv.scrollBy(0, 500);
                            maxTry = 0;
                            inProgress = false;
                        }
                    }
                }
            }catch(error){
                console.error(error);
            }

            if(!inProgress){
                maxTry++;
            }

            if(maxTry == 5 || maxTry == 10 || maxTry == 15 || maxTry == 20 || maxTry == 25 || maxTry == 30 || maxTry == 35 || maxTry == 40 || maxTry == 45 || maxTry == 50 || maxTry == 55 || maxTry == 60 || maxTry == 65){//Should not have to scroll more than 1500
                scrollDiv.scrollBy(0, 500);
            }else if(maxTry >= 70){
                stopOperation();
                return;
            }

        }, 1500);

    }

    function importChatlog(){
        //I really wanted to make it work as sending all the message for you but it require an keyboard press and no other workaround worked for me, you have to send all 100 empty message yourself
        if(jsonFile !== undefined || jsonFile.length != 0){
            document.getElementById("in-progress").innerText = "✅";
            myBranchButton.disabled = true;
            myBranchImportButton.disabled = true;
            numberStartChat = parseInt(document.getElementById("my-number-start-message").value);
            scrollDiv = document.querySelectorAll('[data-virtuoso-scroller]')[0];
            stage = 0;
            maxTry = 0;

            intervalID = setInterval(_ => {
                if(numberStartChat > jsonFile.length){
                    stopOperation();
                    return;
                }

                if(!inProgress){
                    listOfMessage = document.querySelectorAll('[data-index]');
                    for (let i = 0; i < listOfMessage.length; i++) {//Continue until nothing no message left or number of selected message
                        if(listOfMessage[i].getAttribute('data-index') == numberStartChat){
                            RealIndex = [i];
                            break;
                        }
                    }
                }

                try{

                    if(listOfMessage[RealIndex].getAttribute('data-index') == numberStartChat){
                        if(stage == 0){
                            inProgress = true;
                            maxTry = 0;
                            if(listOfMessage[RealIndex].getElementsByClassName('_controlPanelButton_1v19f_8').length == 2){//Length 2 is user response which has delete and edit
                                listOfMessage[RealIndex].getElementsByClassName('_controlPanelButton_1v19f_8')[1].click();//Important 0 is delete while 1 is edit
                                stage++;
                            }else{//Bot response, only edit button
                                listOfMessage[RealIndex].getElementsByClassName('_controlPanelButton_1v19f_8')[0].click();//Important 0 is delete while 1 is edit
                                stage++;
                            }

                        }else if(stage == 1){
                            listOfMessage[RealIndex].getElementsByClassName('_autoResizeTextarea_48ugw_1 ')[0].value = jsonFile[numberStartChat - 1];//Put json value from previous text in text area
                            stage++;
                        }else if(stage == 2){
                            listOfMessage[RealIndex].getElementsByClassName('_editPanelButton_1v19f_175 _save_1v19f_205')[0].click();//Click the save button
                            stage++;
                        }else if(stage == 3){
                            if(listOfMessage[RealIndex].getElementsByClassName('_autoResizeTextarea_48ugw_1 ').length == 0){//Textarea has dissapear
                                numberStartChat++;
                                stage = 0;
                                listOfMessage[RealIndex].scrollIntoView({ block: "end" });
                                scrollDiv.scrollBy(0, 500);
                                maxTry = 0;
                                inProgress = false;
                            }else{
                                scrollDiv.scrollBy(0, -250);
                            }
                        }
                    }
                }catch(error){
                    console.error(error);
                }

                if(!inProgress){
                    maxTry++;
                }

                if(maxTry == 3){
                    scrollDiv.scrollBy(0, -3000);
                }

                if(maxTry == 5 || maxTry == 10 || maxTry == 15 || maxTry == 20 || maxTry == 25 || maxTry == 30 || maxTry == 35 || maxTry == 40 || maxTry == 45 || maxTry == 50 || maxTry == 55 || maxTry == 60 || maxTry == 65){//Should not have to scroll more than 1500
                    scrollDiv.scrollBy(0, 300);
                }else if(maxTry >= 70){
                    stopOperation();
                    return;
                }

            }, 1500);

        }

    }



    function stopOperation(){
        document.getElementById("in-progress").innerText = "❌";
        myBranchButton.disabled = false;
        myBranchImportButton.disabled = false;
        clearInterval(intervalID);
        if(isExporting){
            // Create a blob of the data
            var fileToSave = new Blob([JSON.stringify(listOfChat)], {
                type: 'application/json'
            });

            // Save the file
            try{
                saveAs(fileToSave, document.title + '_chat_Log.json');
            }catch(error){
                //Save a normal name in case title is unable to save due to character
                saveAs(fileToSave, '1_chat_Log.json');
            }
            isExporting = false;
        }
    }

    document.getElementById('jsonFile').addEventListener('change', function(event) {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader(); // Create a FileReader object
            reader.onload = function(e) {
                try {
                    let jsonContent = e.target.result; // Get the file content as a string
                    jsonFile = JSON.parse(jsonContent); // Parse the JSON string into a JavaScript object
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            };
            reader.readAsText(file); // Read the file content as text
        }
    });

})();