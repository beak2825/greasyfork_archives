// ==UserScript==
// @name        Chat notifications | Bonk.io
// @namespace   https://greasyfork.org/en/users/1558569-ancient-player
// @match       https://bonk.io/*
// @grant       window.focus
// @grant       GM_notification
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addValueChangeListener
// @version     1.0
// @author      ancient_player
// @description When on different tab, chat messages will show up as notifications.
// @downloadURL https://update.greasyfork.org/scripts/563203/Chat%20notifications%20%7C%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/563203/Chat%20notifications%20%7C%20Bonkio.meta.js
// ==/UserScript==

function setupMain(){
  if(GM_getValue("isEnabled", null) == null) { GM_setValue("isEnabled", true) };
  if(GM_getValue("messageGrouping", null) == null) { GM_setValue("messageGrouping", ["none", "username", "all"]) };
  if(GM_getValue("focusMode", null) == null) { GM_setValue("focusMode", "tabbed") };


  const toggleButton = GM_registerMenuCommand(`${GM_getValue("isEnabled") ? "Enabled" : "Disabled"}`, () => {
    function update(){
      GM_setValue("isEnabled", !GM_getValue("isEnabled"))
      if (GM_getValue("isEnabled")){
        addExtraButtons();
      } else {
        removeExtraButtons();
      }

      GM_registerMenuCommand(`${GM_getValue("isEnabled") ? "Enabled" : "Disabled"}`, update, {id: toggleButton, autoClose: false });
    }
    update();
    return update;
  } , { autoClose: false });

  let groupingButton;
  let focusButton;

  function addExtraButtons(){
    groupingButton = GM_registerMenuCommand(`Group ${"none username all".replace(GM_getValue("messageGrouping", ["none", "username", "all"])[0], ">" + GM_getValue("messageGrouping", ["none", "username", "all"])[0] + "<")}`, () => {
      function update(){
        function arrayRotate(arr, reverse = false) {
          if (reverse) arr.unshift(arr.pop());
          else arr.push(arr.shift());
          return arr;
        }
        GM_setValue("messageGrouping", arrayRotate(GM_getValue("messageGrouping", ["none", "username", "all"])))

        GM_registerMenuCommand(`Group: ${"none username all".replace(GM_getValue("messageGrouping", ["none", "username", "all"])[0], ">" + GM_getValue("messageGrouping", ["none", "username", "all"])[0] + "<")}`, update, {id: groupingButton, autoClose: false });
      }
      update();
      return update;
    } , { autoClose: false });

    focusButton = GM_registerMenuCommand(`Notify only when: ${GM_getValue("focusMode", "lostFocus")}`, () => {
      function update(){
        GM_setValue("focusMode", GM_getValue("focusMode", "lostFocus") == "lostFocus" ? "tabbed" : "lostFocus")

        GM_registerMenuCommand(`Notify only when: ${GM_getValue("focusMode", "lostFocus")}`, update, {id: focusButton, autoClose: false });
      }
      update();
      return update;
    } , { autoClose: false });
  }
  function removeExtraButtons(){
    GM_unregisterMenuCommand(groupingButton)
    GM_unregisterMenuCommand(focusButton)
  }


  if (GM_getValue("isEnabled", true)){
    addExtraButtons();
  }
}



function setupIframe(){

  let chatBox = document.getElementById("newbonklobby_chatbox");
  let observer = new MutationObserver((mutations) => {
    if (document.hasFocus() == false) {
      mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE && node.querySelector(".newbonklobby_chat_msg_txt") && node.querySelector(".newbonklobby_chat_msg_name") && node.querySelector(".newbonklobby_chat_msg_avatar")) {
                const message = node.querySelector(".newbonklobby_chat_msg_txt").textContent.trim()
                const username = node.querySelector(".newbonklobby_chat_msg_name").textContent.split(":")[0].trim()
                const avatar = node.querySelector(".newbonklobby_chat_msg_avatar").src

                const messageGrouping = GM_getValue("messageGrouping", ["none", "username", "all"])[0]


                let tag;

                switch(messageGrouping){
                  case "username":
                    tag = username
                    break;
                  case "all":
                    tag = "bonkio"
                    break;
                  case "none":
                    tag = null
                    break;
                }
                GM_notification({
                  text: username + ": " + message,
                  title: "Bonk.io",
                  image: avatar,
                  tag: tag,
                  timeout: 2500,
                  url: 'https://bonk.io/',
                  onclick: (event) => {
                    event.preventDefault();
                    window.focus()
                  }
                });


              }
          });
      });
    }
  });


  function startObserving(){
    if(GM_getValue("isEnabled", true)){
      observer.disconnect() // Make sure only one observer is active
      observer.observe(chatBox, { childList: true, subtree: true });
    }
  }

  function stopObserving(){
    if(GM_getValue("isEnabled", true)){
      observer.disconnect()
    }
  }

  function visibilityChanged(){
    if (document.hidden) {
      startObserving();
    } else {
      stopObserving();
    }
  }

   GM_addValueChangeListener("isEnabled", (key, old_value, new_value, remote) => {
     if(new_value == false){
       stopObserving();
     }
   });


  if(GM_getValue("focusMode", "lostFocus") == "lostFocus"){
    window.addEventListener("focus", stopObserving, false);
    window.addEventListener("blur", startObserving, false);
  } else if(GM_getValue("focusMode", "lostFocus") == "tabbed") {
    document.addEventListener("visibilitychange", visibilityChanged);
  }

  GM_addValueChangeListener("focusMode", (key, old_value, new_value, remote) => {
    if(new_value != old_value){
     if(new_value == "lostFocus"){
       stopObserving();

      document.removeEventListener("visibilitychange", visibilityChanged);
      window.addEventListener("focus", stopObserving, false);
      window.addEventListener("blur", startObserving, false);
     } else if(new_value == "tabbed"){
       stopObserving();

      document.addEventListener("visibilitychange", visibilityChanged);
      window.removeEventListener("focus", stopObserving, false);
      window.removeEventListener("blur", startObserving, false);
     }
    }
  });
}



// Script is run at main window and all of iframes
if (window.top === window.self) {
  setupMain(); // This is run in main window
}
else {
  setupIframe() // This is run in the gameframe iframe
}

