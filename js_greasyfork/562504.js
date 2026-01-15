// ==UserScript==
// @name        Auto winners picks
// @license     MIT
// @namespace   https://greasyfork.org/en/users/1558569-ancient-player
// @match       https://*.bonk.io/gameframe-release.html
// @grant       none
// @version     1.0
// @author      ancient_player
// @description Automatically load winners picked maps, start game and chose the next persons map. Also updates roomname with current map.
// @downloadURL https://update.greasyfork.org/scripts/562504/Auto%20winners%20picks.user.js
// @updateURL https://update.greasyfork.org/scripts/562504/Auto%20winners%20picks.meta.js
// ==/UserScript==

// Thanks Legendboss for cha2 function :)

/*

When player joins, welcome them and notify of what is happening.

Allow players to specify rounds?

*/




function isHost(){
  let playerName = document.getElementById("pretty_top_name").textContent
  let playerDiv = Array.from(document.querySelectorAll(".newbonklobby_playerentry_name")).filter((p) => p.textContent == playerName)[0]
  return playerDiv.parentNode.querySelector(".newbonklobby_playerentry_host").src == "https://bonk.io/graphics/host_3.png" ? true : false
}



function getHost(){
  var pn = document.getElementById("pretty_top_name").textContent
  console.log(pn.trim())
}

let toggleButton = document.createElement("button")
    toggleButton.classList.add("newbonklobby_settings_button", "brownButton_classic", "buttonShadow", "brownButton")
    toggleButton.style = "right: 50px;  top: 70px; position: absolute; width: 50px;height: 30px;"
    toggleButton.title = "Enable auto winner picks"
    toggleButton.textContent = "OFF"
    toggleButton.id = "autoWP"

document.getElementById("newbonklobby_settingsbox").prepend(toggleButton)


let isOn = false

toggleButton.addEventListener("click", () => {
  if(isOn == false){
    send("Starting Winner Picks AUTO")
    startGame();
    start();
    document.querySelector("#autoWP").textContent = "ON"
  } else {
    send("Stopping Winner Picks AUTO")
    document.querySelector("#autoWP").textContent = "OFF"
  }
  isOn = !isOn;
});


async function start(){
  let winner = await getWinner()

  if(winner != getHost() && await selectMap(winner) && isOn && await selectMode(winner) && isOn){
      setRoomNameWithMapinfo()
      startGame()
      start();
  } else {
    await hostSelect()
    setRoomNameWithMapinfo()
    if(isOn){
      start();
    }
  }
}


async function hostSelect(){
  return new Promise((resolve) => {

    let observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if(document.getElementById("newbonklobby_startbutton").textContent.includes("Abort")){
            observer.disconnect()
            resolve(true)
          }
        })
      })
    });

    var startButton = document.getElementById("newbonklobby_startbutton")

    observer.observe(startButton, { childList: true, subtree: true, });

  });
}






async function getWinner(){
    return new Promise((resolve) => {



    let observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          rounds = document.getElementById("newbonklobby_roundsinput").value

          if(document.getElementById("ingamewinner_scores_right").textContent.includes(rounds)){
            let winner = document.getElementById("ingamewinner_top").textContent
            observer.disconnect()
            resolve(winner)
          }
        })
      })
    });

    var winnerBox = document.getElementById("ingamewinner_top")

    observer.observe(winnerBox, { childList: true, subtree: true, });
  })
}


async function selectMap(player, waitSeconds = 30) {
    let isCancelled = false;

    return new Promise((resolve) => {
        send(`${player} won! They can suggest the next map.`);

        let timeout = setTimeout(() => {
            if (!isCancelled) {
                send(`${player} took too long. Host decides map.`);
                observer.disconnect();
                resolve(false);
            }
        }, waitSeconds * 1000);

        let observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.querySelector(".newbonklobby_chat_link")) {
                        if (node.querySelector(".newbonklobby_chat_msg_name").textContent.split("*")[1].trim() === player) {
                            node.querySelector(".newbonklobby_chat_link").click();
                            clearTimeout(timeout); // Use clearTimeout instead of clearInterval
                            observer.disconnect();
                            resolve(true);
                        }
                    }
                });
            });
        });

        var chatBox = document.getElementById("newbonklobby_chatbox");
        observer.observe(chatBox, { childList: true, subtree: true });

        // Cancel pick map
        this.cancel = () => {
            isCancelled = true;
            clearTimeout(timeout);
            observer.disconnect();
            resolve(false);
        };
    });
}

async function selectMode(player, waitSeconds = 10){
  return new Promise((resolve) => {

    var modeHelp = ""
    switch(document.getElementById("mapeditor_modeselect").value){
      case 'b':
        modeHelp = "classic"
        break;
      case 'ar':
        modeHelp = "arrow"
        break;
      case 'ard':
        modeHelp = "deatharrows"
        break;
      case 'sp':
        modeHelp = "grapple"
        break;
      case 'v':
        modeHelp = "vtol"
        break;
    }

    if(modeHelp != ""){
      send(`What mode ${player}? (${modeHelp}?)`)
      waitSeconds = 7
    } else {
      send(`What mode ${player}?`)
    }


    let timeout = setTimeout(() => {
      if(modeHelp != ""){
        send(`Using "${modeHelp}" mode.`)
      } else {
        send(`${player} `)
      }
      observer.disconnect()
      resolve(false)
    }, waitSeconds * 1000)


      let observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if(node.className == "newbonklobby_chat_msg_name"){
            if(node.textContent.split(":")[0].trim() == player){
              let input = node.parentNode.querySelector(".newbonklobby_chat_msg_txt").textContent.toLowerCase()


              let grappleTags = ['1', 'grap', 'grapple', 'graple']
              let arrowTags = ['2', 'arrow', 'arow', 'arrows', 'arows']
              let darrowTags = ['3', 'death', 'd', 'darrow']
              let classicTags = ['4', 'classic', 'clasic', 'clasc', 'classsic']
              let vtolTags = ['5', 'vtol', 'v-tol']
              let yesTags = ['y', 'yes', 'ye']


              if(arrowTags.some(tag => input.includes(tag)) && darrowTags.some(tag => input.includes(tag))){
                  modeChosen("deatharrows")
              } else if (arrowTags.some(tag => input.includes(tag))){
                modeChosen("arrow")
              } else if (grappleTags.some(tag => input.includes(tag))){
                modeChosen("grapple")
              } else if (classicTags.some(tag => input.includes(tag))){
                modeChosen("classic")
              } else if (vtolTags.some(tag => input.includes(tag))){
                modeChosen("vtol")
              } else if (yesTags.some(tag => input.includes(tag))){
                modeChosen(modeHelp)
              }


              function modeChosen(mode){
                  setMode(mode)
                  clearTimeout(timeout)
                  observer.disconnect()
                  resolve(true)
              }
            }
          }
        })
      })
    });


    var chatBox = document.getElementById("newbonklobby_chat_content")

    observer.observe(chatBox, { childList: true, subtree: true, });
  })

  function setMode(mode){
    document.getElementById("newbonklobby_mode_" + mode).click()
    document.getElementById("newbonklobby_modebutton").click()
  }

}






function endGame(){
  document.getElementById("pretty_top_exit").click()
}

function startGame(){
  document.getElementById("newbonklobby_startbutton").click()
}


function setRoomNameWithMapinfo() {
  console.log("setting roomname")
  function isHost(){
    let playerName = document.getElementById("pretty_top_name").textContent
    let playerDiv = Array.from(document.querySelectorAll(".newbonklobby_playerentry_name")).filter((p) => p.textContent == playerName)[0]
    return playerDiv.parentNode.querySelector(".newbonklobby_playerentry_host").src == "https://bonk.io/graphics/host_3.png" ? true : false
  }

  function getMap(){
    return {
      name: document.getElementById("newbonklobby_maptext").innerText,
      author: document.getElementById("newbonklobby_mapauthortext").innerText
    }
  }


  //document.getElementById("newbonklobby_startbutton").addEventListener('click', () => {
  //  if(document.getElementById("newbonklobby_startbutton").innerText == "Start"){
      var mapInfo = getMap()
      send(`/roomname Winner Picks | Playing: ${mapInfo.name}`)
  //  }
  //})
}

// helpers
function send(message, enteragain = false){
  mess = document.getElementById("newbonklobby_chat_input").value;
  mess2 = document.getElementById("ingamechatinputtext").value;

  document.getElementById("newbonklobby_chat_input").value = message;
  document.getElementById("ingamechatinputtext").value = message;

  fire("keydown", { keyCode: 13 });
  if (!enteragain) {
    fire("keydown", { keyCode: 13 });
  }

  document.getElementById("newbonklobby_chat_input").value = mess;
  document.getElementById("ingamechatinputtext").value = mess2;


  function fire (type, options, d = document) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent(type, true, false);
    for (var p in options) {
      event[p] = options[p];
    }
    d.dispatchEvent(event);
  };
}



