// ==UserScript==
// @name         Console Log Styler
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Styles console.log() output with customizable colors, borders, and visual effects for better debugging visibility.
// @author       hacker09
// @match        *://*/*
// @run-at       document-start
// @icon         https://i.imgur.com/27mYVlx.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548182/Console%20Log%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/548182/Console%20Log%20Styler.meta.js
// ==/UserScript==

(function(){
  //EASY CONFIG - Change these values
  const showScriptName=true; //Set to false to hide the script name/(Page) label
  const autoColor=true; //Set to false to force white text for all logs
  const selectedBorderStyle="leftRightBorder"; //leftBorder, leftRightBorder, topBorder, fullBorder, glow, arrow, bullet
  const borderColor="#007acc"; //any hex color

  //Border styles
  const borderStyles={
    leftBorder:`border-left:3px solid ${borderColor};`,
    leftRightBorder:`border-left:3px solid ${borderColor};border-right:3px solid ${borderColor};`,
    topBorder:`border-top:2px solid ${borderColor};`,
    fullBorder:`border:2px solid ${borderColor};`,
    glow:`box-shadow:0 0 8px rgba(0,122,204,0.6);`,
    arrow:`border-left:3px solid ${borderColor};`, //add ▶ manually to logs
    bullet:`border-left:3px solid ${borderColor};padding-left:13px;` //add ● manually to logs
  };

  //Color options
  const styles={
    green:`color:#00ff00;background:#2d2d2d;padding:4px 8px;border-radius:3px;font-size:13px;${borderStyles[selectedBorderStyle]}`,
    orange:`color:#ff8c00;background:#2d2d2d;padding:4px 8px;border-radius:3px;font-size:13px;${borderStyles[selectedBorderStyle]}`,
    cyan:`color:#00ffff;background:#2d2d2d;padding:4px 8px;border-radius:3px;font-size:13px;${borderStyles[selectedBorderStyle]}`,
    yellow:`color:#ffff00;background:#2d2d2d;padding:4px 8px;border-radius:3px;font-size:13px;${borderStyles[selectedBorderStyle]}`,
    purple:`color:#ff00ff;background:#2d2d2d;padding:4px 8px;border-radius:3px;font-size:13px;${borderStyles[selectedBorderStyle]}`,
    red:`color:#ff4444;background:#2d2d2d;padding:4px 8px;border-radius:3px;font-size:13px;${borderStyles[selectedBorderStyle]}`,
    white:`color:#ffffff;background:#404040;padding:4px 8px;border-radius:3px;font-size:13px;${borderStyles[selectedBorderStyle]}`
  };

  const colorKeys = Object.keys(styles).filter(k => k !== 'white'); //exclude white from auto-picker

  const originalLog=console.log;
  console.log=function(...args){
    //Parse stack, default to 'Page' if no script name found
    const origin = ((new Error().stack.split('\n')[2]||'').match(/name=([^&]+)/)||['','Page'])[1].replace('.user.js','');
    const prefix = showScriptName ? `(${decodeURIComponent(origin)}): ` : '';

    //Pick color based on script name hash if enabled (and not Page), otherwise white
    let chosenStyle = styles.white;
    if(autoColor && origin !== 'Page') {
      let hash = 0;
      for (let i = 0; i < origin.length; i++) hash = origin.charCodeAt(i) + ((hash << 5) - hash);
      chosenStyle = styles[colorKeys[Math.abs(hash) % colorKeys.length]];
    }

    originalLog("%c"+prefix+args.join(" "), chosenStyle);
  };
})();