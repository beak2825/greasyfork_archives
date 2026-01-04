// ==UserScript==
// @name        Catto's Slowdown 2048verse.com
// @namespace   Violentmonkey Scripts
// @match       https://2048verse.com/*
// @grant       none
// @version     1.1
// @author      emalek
// @description 21/11/2025, 08:32:31
// @require https://unpkg.com/guify@0.15.1/lib/guify.min.js
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM.getValue
// @grant              GM.setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556512/Catto%27s%20Slowdown%202048versecom.user.js
// @updateURL https://update.greasyfork.org/scripts/556512/Catto%27s%20Slowdown%202048versecom.meta.js
// ==/UserScript==
let slowdown = {
  yellowIPS_set : 3,
  yellowIPS_reset : 2,
  redIPS_set : 5,
  redIPS_reset : 2,
  enable : true,
  yellowBGC : "#fabd2f",
  redBGC : "#fb4934",
  oldBGC : document.getElementsByClassName("game-container")[0].style.background,
  enableHK : "KeyH",
updateBGC(th){
  if(!th.enable){
    document.getElementsByClassName("game-container")[0].style.background = th.oldBGC;
    return;
  }
  let newcolor = document.getElementsByClassName("game-container")[0].style.background;
  if(IPS > th.yellowIPS_set)
    yellow_set = true;
  if(IPS > th.redIPS_set)
    red_set = true;
  if(IPS < th.yellowIPS_reset)
    yellow_set = false;
  if(IPS < th.redIPS_reset)
    red_set = false;

  if(red_set){
    newcolor = th.redBGC;
  }
  else if(yellow_set){
    newcolor = th.yellowBGC
  }
  else{
    newcolor = th.oldBGC;
  }
  document.getElementsByClassName("game-container")[0].style.background = newcolor;
},
keybindcallback(e){
  if(e.code == this.enableHK){
    this.enable = !this.enable;
  }
},
main(){
  console.log(this.yellowIPS_set);
  console.dir(this);

  this.yellowIPS_set = GM_getValue("yellowIPS_set", 3); // get our saved settings
  this.yellowIPS_reset = GM_getValue("yellowIPS_reset", 2);
  this.redIPS_set = GM_getValue("redIPS_set", 5);
  this.redIPS_reset = GM_getValue("redIPS_reset", 2);
  this.enable = GM_getValue("enable", true);
  this.yellowBGC = GM_getValue("yellowBGC", "#fabd2f");
  this.redBGC = GM_getValue("redBGC", "#fb4943");
  this.enableHK = GM_getValue("enableHK", "KeyY");


  let red_set = false;
  let yellow_set = false;
  let settings = document.createElement("div"); // make a place for the settings window
  let style = document.createElement("style");
  style.innerHTML = ".guify-bar {\nvisibility:hidden;\n}"; // delete the top bar cause we don't need it

  document.getElementById("belowHeader").after(settings); // insert the settings window
  settings.style = ""
  var gui = new guify({
    root: settings,
    barMode: "inner",
    width: "300px",
    open: true
  });
  gui.Register([
    {
      type: 'title', label: "Catto's slowdown script"
    },
    {
        type: 'checkbox', label: 'Enable', object: this, property: "enable",
        onChange: (value) => {
          GM_setValue("enable", value);
        }
    },
    {
        type: 'range', label: 'Yellow set point',
        min: 0, max: 20, step: 1, object: this, property: "yellowIPS_set",
        onChange: (value) => {
          GM_setValue("yellowIPS_set", value);
        }
    },
    {
        type: 'range', label: 'Yellow reset point',
        min: 0, max: 20, step: 1, object: this, property: "yellowIPS_reset",
        onChange: (value) => {
          GM_setValue("yellowIPS_reset", value);
        }
    },
    {
        type: 'range', label: 'Red set point',
        min: 0, max: 20, step: 1, object: this, property: "redIPS_set",
        onChange: (value) => {
          GM_setValue("redIPS_set", value);
        }
    },
    {
        type: 'range', label: 'Red reset point',
        min: 0, max: 20, step: 1, object: this, property: "redIPS_reset",
        onChange: (value) => {
          GM_setValue("redIPS_reset", value);
        }
    },
    {
      type: 'text', label: "Red color", object: this, property: "redBGC",
        onChange: (value) => {
          GM_setValue("redBGC", value);
        }
    },
    {
      type: 'text', label: "Yellow color", object: this, property: "yellowBGC",
        onChange: (value) => {
          GM_setValue("yellowBGC", value);
        }
    },
    {
      type: 'text', label: "Enable keybind", object: this, property: "enableHK",
        onChange: (value) => {
          GM_setValue("enableHK", value);
        }
    }
  ]);

  setInterval(this.updateBGC, IPSupdateTime * 3, this);
  document.head.appendChild(style);
  document.addEventListener('keydown', this.keybindcallback.bind(this));
}
};
slowdown.main();