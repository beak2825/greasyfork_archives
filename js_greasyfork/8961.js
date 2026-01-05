// ==UserScript==
// @name        chat colors
// @namespace   chatroll
// @include     http://chatroll.com/*
// @version     2.5.3
// @description makes the chat nice,
// @grant       none
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/8961/chat%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/8961/chat%20colors.meta.js
// ==/UserScript==

// modern : 0
// classic: 1
var tm = 0;

function colorName (n){
 var color = 'white';
      switch (n.children[0].text) {
        case 'Rebel-':
          n.children[0].innerHTML = 'Rebel <img class="pro-badge-icon pro-badge-icon-100" src="/t.gif">';
          n.style.background = 'red';
          break;
        case 'Pinguster':
          n.children[0].text = 'Pingu';
          n.style.background = '#164712';
          break;
        case 'Burpman':
          n.style.background = '#0DF100';
          break;
        case 'Zog':
        n.style.background = '#CAFF0A';
        color = 'black';
          break;
        case 'Blasto':
          n.children[0].text = 'Grey';
          n.style.background = 'Grey';
          //n.parentElement.parentElement.style.display = 'none'; //shut up grey
          break;
        case 'Rousseau':
          n.children[0].text = 'Bubble';
          n.style.background = '#99FF00';
          color = 'black';
          break;
        case 'Kiino':
          n.children[0].text = 'Razer';
          n.style.background = '#990000';
          break;
        case 'Shoeman':
          n.style.background = '#990022';
          break;
        default:
          color = 'black';
      }
      n.children[0].style.cssText = 'font-weight : bold; text-decoration: underline; color : ' + color + ';';
      n.style.color = color;
}

function textTriggers(n){
var msg = n.innerHTML;
  
  
//Twitch Emotes
msg = msg.replace(/4Head/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/354/1.0' />");
msg = msg.replace(/ANELE/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/3792/1.0' />");
msg = msg.replace(/ArsonNoSexy/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/50/1.0' />");
msg = msg.replace(/AsianGlow/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/74/1.0' />");
msg = msg.replace(/AtGL/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/9809/1.0' />");
msg = msg.replace(/AthenaPMS/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/32035/1.0' />");
msg = msg.replace(/AtIvy/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/9800/1.0' />");
msg = msg.replace(/AtWW/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/9801/1.0' />");
msg = msg.replace(/BabyRage/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/22639/1.0' />");
msg = msg.replace(/BatChest/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1905/1.0' />");
msg = msg.replace(/BCWarrior/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/30/1.0' />");
msg = msg.replace(/BibleThump/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/86/1.0' />");
msg = msg.replace(/BigBrother/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1904/1.0' />");
msg = msg.replace(/BionicBunion/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/24/1.0' />");
msg = msg.replace(/BlargNaut/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/38/1.0' />");
msg = msg.replace(/BloodTrail/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/69/1.0' />");
msg = msg.replace(/BORT/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/243/1.0' />");
msg = msg.replace(/BrainSlug/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/881/1.0' />");
msg = msg.replace(/BrokeBack/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/4057/1.0' />");
msg = msg.replace(/BuddhaBar/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/27602/1.0' />");
msg = msg.replace(/CougarHunt/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/21/1.0' />");
msg = msg.replace(/DAESuppy/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/973/1.0' />");
msg = msg.replace(/DansGame/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/33/1.0' />");
msg = msg.replace(/DatSheffy/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/170/1.0' />");
msg = msg.replace(/DBstyle/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/73/1.0' />");
msg = msg.replace(/DendiFace/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/29695/1.0' />");
msg = msg.replace(/DogFace/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1903/1.0' />");
msg = msg.replace(/EagleEye/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/20/1.0' />");
msg = msg.replace(/EleGiggle/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/4339/1.0' />");
msg = msg.replace(/EvilFetus/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/72/1.0' />");
msg = msg.replace(/FailFish/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/360/1.0' />");
msg = msg.replace(/FPSMarksman/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/42/1.0' />");
msg = msg.replace(/FrankerZ/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/65/1.0' />");
msg = msg.replace(/FreakinStinkin/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/39/1.0' />");
msg = msg.replace(/FUNgineer/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/244/1.0' />");
msg = msg.replace(/FunRun/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/48/1.0' />");
msg = msg.replace(/FuzzyOtterOO/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/168/1.0' />");
msg = msg.replace(/GasJoker/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/9802/1.0' />");
msg = msg.replace(/GingerPower/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/32/1.0' />");
msg = msg.replace(/GrammarKing/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/3632/1.0' />");
msg = msg.replace(/HassaanChop/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/20225/1.0' />");
msg = msg.replace(/HassanChop/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/68/1.0' />");
msg = msg.replace(/HeyGuys/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/30259/1.0' />");
msg = msg.replace(/HotPokket/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/357/1.0' />");
msg = msg.replace(/HumbleLife/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/27301/1.0' />");
msg = msg.replace(/ItsBoshyTime/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/169/1.0' />");
msg = msg.replace(/Jebaited/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/90/1.0' />");
msg = msg.replace(/JKanStyle/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/15/1.0' />");
msg = msg.replace(/JonCarnage/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/26/1.0' />");
msg = msg.replace(/KAPOW/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/9803/1.0' />");
msg = msg.replace(/Kappa/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/25/1.0' />");
msg = msg.replace(/Keepo/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1902/1.0' />");
msg = msg.replace(/KevinTurtle/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/40/1.0' />");
msg = msg.replace(/Kippa/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1901/1.0' />");
msg = msg.replace(/Kreygasm/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/41/1.0' />");
msg = msg.replace(/KZskull/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/5253/1.0' />");
msg = msg.replace(/Mau5/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/30134/1.0' />");
msg = msg.replace(/mcaT/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/35063/1.0' />");
msg = msg.replace(/MechaSupes/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/9804/1.0' />");
msg = msg.replace(/MrDestructoid/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/28/1.0' />");
msg = msg.replace(/MVGame/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/29/1.0' />");
msg = msg.replace(/NightBat/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/9805/1.0' />");
msg = msg.replace(/NinjaTroll/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/45/1.0' />");
msg = msg.replace(/NoNoSpot/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/44/1.0' />");
msg = msg.replace(/noScope/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/13084/1.0' />");
msg = msg.replace(/NotAtk/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/34875/1.0' />");
msg = msg.replace(/OMGScoots/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/91/1.0' />");
msg = msg.replace(/OneHand/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/66/1.0' />");
msg = msg.replace(/OpieOP/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/356/1.0' />");
msg = msg.replace(/OptimizePrime/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/16/1.0' />");
msg = msg.replace(/panicBasket/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/22998/1.0' />");
msg = msg.replace(/PanicVis/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/3668/1.0' />");
msg = msg.replace(/PazPazowitz/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/19/1.0' />");
msg = msg.replace(/PeoplesChamp/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/3412/1.0' />");
msg = msg.replace(/PermaSmug/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/27509/1.0' />");
msg = msg.replace(/PicoMause/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/27/1.0' />");
msg = msg.replace(/PipeHype/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/4240/1.0' />");
msg = msg.replace(/PJHarley/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/9808/1.0' />");
msg = msg.replace(/PJSalt/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/36/1.0' />");
msg = msg.replace(/PMSTwin/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/92/1.0' />");
msg = msg.replace(/PogChamp/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/88/1.0' />");
msg = msg.replace(/Poooound/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/358/1.0' />");
msg = msg.replace(/PraiseIt/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/38586/1.0' />");
msg = msg.replace(/PRChase/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/28328/1.0' />");
msg = msg.replace(/PunchTrees/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/47/1.0' />");
msg = msg.replace(/PuppeyFace/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/30252/1.0' />");
msg = msg.replace(/RaccAttack/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/27679/1.0' />");
msg = msg.replace(/RalpherZ/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1900/1.0' />");
msg = msg.replace(/RedCoat/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/22/1.0' />");
msg = msg.replace(/ResidentSleeper/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/245/1.0' />");
msg = msg.replace(/RitzMitz/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/4338/1.0' />");
msg = msg.replace(/RuleFive/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/361/1.0' />");
msg = msg.replace(/Shazam/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/9807/1.0' />");
msg = msg.replace(/shazamicon/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/9806/1.0' />");
msg = msg.replace(/ShazBotstix/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/87/1.0' />");
msg = msg.replace(/ShibeZ/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/27903/1.0' />");
msg = msg.replace(/SMOrc/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/52/1.0' />");
msg = msg.replace(/SMSkull/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/51/1.0' />");
msg = msg.replace(/SoBayed/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1906/1.0' />");
msg = msg.replace(/SoonerLater/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/355/1.0' />");
msg = msg.replace(/SriHead/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/14706/1.0' />");
msg = msg.replace(/SSSsss/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/46/1.0' />");
msg = msg.replace(/StoneLightning/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/17/1.0' />");
msg = msg.replace(/StrawBeary/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/37/1.0' />");
msg = msg.replace(/SuperVinlin/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/31/1.0' />");
msg = msg.replace(/SwiftRage/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/34/1.0' />");
msg = msg.replace(/tbBaconBiscuit/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/44499/1.0' />");
msg = msg.replace(/tbChickenBiscuit/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/44498/1.0' />");
msg = msg.replace(/tbQuesarito/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/40863/1.0' />");
msg = msg.replace(/tbSausageBiscuit/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/44500/1.0' />");
msg = msg.replace(/tbSpicy/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/40864/1.0' />");
msg = msg.replace(/tbSriracha/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/40871/1.0' />");
msg = msg.replace(/TF2John/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1899/1.0' />");
msg = msg.replace(/TheRinger/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/18/1.0' />");
msg = msg.replace(/TheTarFu/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/70/1.0' />");
msg = msg.replace(/TheThing/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/7427/1.0' />");
msg = msg.replace(/ThunBeast/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1898/1.0' />");
msg = msg.replace(/TinyFace/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/67/1.0' />");
msg = msg.replace(/TooSpicy/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/359/1.0' />");
msg = msg.replace(/TriHard/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/171/1.0' />");
msg = msg.replace(/TTours/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/38436/1.0' />");
msg = msg.replace(/UleetBackup/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/49/1.0' />");
msg = msg.replace(/UncleNox/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/3666/1.0' />");
msg = msg.replace(/UnSane/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/71/1.0' />");
msg = msg.replace(/Volcania/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/166/1.0' />");
msg = msg.replace(/WholeWheat/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1896/1.0' />");
msg = msg.replace(/WinWaker/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/167/1.0' />");
msg = msg.replace(/WTRuck/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/1897/1.0' />");
msg = msg.replace(/WutFace/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/28087/1.0' />");
msg = msg.replace(/YouWHY/g, "<img src='https://static-cdn.jtvnw.net/emoticons/v1/4337/1.0' />");
  
msg = msg.replace(/daily dose/g, "<img src='http://i1.kym-cdn.com/photos/images/newsfeed/000/243/347/90d.gif'  style='width:20px;height:20px;'/>");

if(msg == "checkem"){
  msg = "<img src='http://i2.kym-cdn.com/entries/icons/original/000/001/714/doublesguy.jpg' style='width:40px;height:40px;'/>"
}
  
//greentext
if(msg.startsWith("&gt;<wbr>")){
  n.style.color = "#789922";
}
n.innerHTML = msg;
}


function format(n){
if(tm == 0){
//time style modern
n.children[0].children[0].style.float = 'right';
}else{
//time style classic
var time = n.children[0].children[0].innerHTML;
n.children[0].children[1].innerHTML = n.children[0].children[1].innerHTML + ' ' + time;
n.children[0].children[0].style.display = 'none';
}
  
//moves the numbers from the message class to user namespace
//move numbers to inside user
var number = n.classList[1].slice(-3);

n.children[0].children[1].className = "";
if(number == "420"){
n.children[0].children[1].innerHTML = n.children[0].children[1].innerHTML + ' No. <img src="http://fc08.deviantart.net/fs70/f/2014/340/3/5/_420weed__by_romenx-d88xdm8.gif" />' ;
}else{
n.children[0].children[1].innerHTML = n.children[0].children[1].innerHTML + ' No.' + number;
}
//fake span to get modified while shown one stays the same,
var fakespan = document.createElement("span");
fakespan.className = "message-profile-name";
fakespan.style.cssText = 'display:none;';
n.children[0].appendChild(fakespan);
  
  //remove semicolon
n.children[0].childNodes[4].data = "";
  //make text next line
n.children[0].children[2].style.display = 'block';
}

function desktopNotify(n){
      var user = n.children[0].children[1].children[0].text;
      var message = n.children[0].children[2].textContent;
      var img = n.children[1].children[0].children[0].currentSrc;
      new Notification(user,{body:message,icon:img,dir:'auto'});
}

function init() {
  Notification.requestPermission(function(permission){
    var notification = new Notification("Alert!",{body:'Desktop Notifications Active',icon:'icon.png',dir:'auto'});
  });
  var x = document.getElementsByClassName('chat-messages');
  for(var i = 0; i < x[0].childElementCount - 1; i++){
    var message = x[0].children[i];
  format(message);
  colorName(message.children[0].children[1]);
	textTriggers(message.children[0].children[2]);
  }
}


// The node to be monitored
var target = $('.chat-messages') [0];

// Create an observer instance
var observer = new MutationObserver(function (mutations) {

  mutations.forEach(function (mutation) {
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      var message = mutation.addedNodes[i];
      format(message);
      colorName(message.children[0].children[1]);
      desktopNotify(message);
	    textTriggers(message.children[0].children[2]);

    }
  });
});

// Configuration of the observer:
var config = {
  attributes: true,
  childList: true,
  characterData: true
};
// Pass in the target node, as well as the observer options
observer.observe(target, config);


 init();