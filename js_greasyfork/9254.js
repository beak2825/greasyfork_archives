// ==UserScript==
// @name        TW Fred Timer
// @name:ru     TW Fred Timer
// @namespace   TW Fred Timer
// @description Timer View for Event's free action
// @description:ru Счетчик времени бесплатного события Праздника
// @include         http://*.the-west.*/game.php*
// @include         https://*.the-west.*/game.php*

// @version     0.5.7
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/9254/TW%20Fred%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/9254/TW%20Fred%20Timer.meta.js
// ==/UserScript==


function TWFredScript(fn) {
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = '(' + fn + ')();';
	document.body.appendChild(script);
	document.body.removeChild(script);
}

TWFredScript(function() {
  
  var VERSION = "0.5.7";
  var NAME = "TW Fred Timer";
  var installURL = '';

	console.log(NAME + ' ' + VERSION + ' : start...');
  
  fcContainer = $("<div />", 
                   { 
id: "twfred_container", 
//2015 style: "position: absolute; top: 64px; right: 50%; margin-right: 140px; z-index: 10; width: 142px; height: 16px;  background: url('/images/interface/character/character.png') no-repeat scroll left -160px transparent;" 
style: "position: absolute; top: 64px; left: 50%; margin-left: 140px; z-index: 10; width: 142px; height: 16px;  background: url('/images/interface/character/character.png') no-repeat scroll left -160px transparent;" 
                   }
                  );
  
  fcContainer.appendTo("#user-interface");
  
  fcWrap = $('<div />',
              {
id: "twfred_wrap",
style:"padding-top:1px; font-size:10px; color:#FFF; text-align:center;",
              }
            );
    
  fcContainer.append(fcWrap);
  
  TWFred = {
    wofid:13, // don't know where find it //2015 =2, 2016 =13
    diff: 0,
    timer:2, // seconds
    execCount:0,
    reInitVal:60, // execs to reinit data - on start
    reInitValN:60, // execs to reinit data - on normal work
    reInitValI:7, // execs to reinit data - on zero Timer
    clickObj: null,
    timerId: 0,
  };
  
  fcWrap.click(function(){TWFred.click()});
  
  TWFred.init = function()
  {
    TWFred.execCount = 0;
    TWFred.reInitVal = TWFred.reInitValN;
    TWFred.getClicker();
    
    $.post("/game.php?window=wheeloffortune&mode=init", {wofid:TWFred.wofid},
           function(data)
           {
             var diff = 0;
             var ctime = 0;
             var cdl = 0;
             //console.log(data);
             
             if (data.error) {TWFred.destroy(); return;}
             
             var  diff = 0;
             var cd = data.mode;
             
             if (cd.cooldowns !== undefined)  // FRED
             {
               cd = cd.cooldowns;
               //cdl = cd.length;
							 cdl = cd[0];
               if (cdl !== undefined) // cuz no data at end of Event
               {
                ctime = cdl.cdstamp
                var stime = Game.getServerTime();
                diff = ctime-stime;
               }
             }
             else if (cd.states !== undefined)  // IndDay
             {
               cd = cd.states;
               cdl = Object.keys(cd).length;
               if (cdl)
               {
                 ctime = cd[0].finish_date;
                 var stime = Game.getServerTime();
                 if (!ctime) ctime = stime;
                 diff = ctime-stime;
               }
             }
             else {console.log('No Fred data'); TWFred.destroy(); return;} // no data
             
             if (!cdl) {console.log('No Fred cooldowns'); TWFred.destroy(); return;}
             
             TWFred.diff = diff;
             TWFredTimer();
           }
          ); //post
  };
  
  TWFred.showTimer = function()
  {
    var str = TWFred.diff.formatDuration();
    fcWrap.html(str);
  };
  
  TWFred.doTimer = function()
  {
    //console.log('doTimer:' + TWFred.execCount + ',' + TWFred.reInitVal);
    TWFred.timerId = 0;
    if (undefined === TWFred) return;
    
    if (!TWFred.clickObj) TWFred.getClicker(); // init clicker
    
    var diff = TWFred.diff - TWFred.timer;
    if (diff < 0) diff = 0;
    if (!diff) TWFred.reInitVal = TWFred.reInitValI; 
    TWFred.diff = diff;
        
    TWFred.showTimer();
    TWFred.execCount++;
    if (TWFred.execCount > TWFred.reInitVal)
    {
      TWFred.init();
    }
    else
    {
      TWFredTimer();
    }
  };
  
  
  TWFred.getClicker = function()
  {
    if (TWFred.clickObj) return;
    
    var bar = WestUi.NotiBar.getBar();
        
    if (!bar) return;
    bar = bar.list;
        
    TWFred.reInitVal = TWFred.reInitValN;
    
    $.each(bar, function(key,val)
    {
      //console.log(val);
           
      if ((val.uid == 'easterwof')||(val.uid == 'independencewof'))
      {
        TWFred.clickObj = val.element;
      }
            
    });
    
    if (TWFred.clickObj) fcWrap.css("cursor","pointer");
  };
  
  
  TWFred.click = function()
  {
    if (!TWFred.clickObj) return;
    TWFred.init();
    TWFred.clickObj.click();
  };
  
  
  TWFred.destroy = function()
  {
    console.log('Removing TWFred');
    fcContainer.remove();
    delete TWFred;
    TWFred = undefined;
  };
  
  function TWFredTimer()
  {
    if (undefined === TWFred) return;
    if (!TWFred.timerId) TWFred.timerId = setTimeout(TWFred.doTimer,TWFred.timer * 1000);
  };
  
  TWFred.init();
  
}
);
