// ==UserScript==
// @name         metal4chan
// @namespace    https://greasyfork.org/en/scripts/7327-metal4chan/
// @version      6.7011170
// @description  Emoticons for Vidya4chan by MetalxXxGear, never asked for this edition 
// @match        *://instasync.com/r/v4c
// @match        *://instasync.com/r/movie4chan
// @match        *://instasync.com/r/*
// @grant        none
// @copyright    2015
// @downloadURL https://update.greasyfork.org/scripts/7327/metal4chan.user.js
// @updateURL https://update.greasyfork.org/scripts/7327/metal4chan.meta.js
// ==/UserScript==
  

self.$externalEmotes = {};
	//if (typeof(self.$animEmotes) === "undefined") self.$animEmotes = {};
script.$metalMemes={
  //decent emotes
  'chen3': '<img src="http://i.imgur.com/MSoQrxX.gif" width="54" height="55" onclick="script.fns.playSound(script.emoteSounds.chen);">',
  'chen4': '<img src="http://i.imgur.com/vRgXgKd.gif" width="60" height="60" onclick="script.fns.playSound(script.emoteSounds.chen);">',
  'duckgif': '<img src="http://i.imgur.com/7VcUcYJ.gif" width="54" height="55";>',
  'cry': '<img src="http://i.imgur.com/MMdhwkH.gif" width="40" height="60";>',
  'thom': '<img src="http://i.imgur.com/HWYBpFp.gif" width="44" height="75";>',
  'guts': '<img src="http://i.imgur.com/Vwq5J2n.png" width="65" height="60";>',
  'mysides2': '<img src="http://i.imgur.com/DtINozi.gif" width="50" height="60";>',
  'wow2': '<img src="http://i.imgur.com/Gx5wmqn.gif" width="67" height="50";>',
  'ae86': '<img src="http://i.imgur.com/WFHNOxP.gif" width="60" height="60";>',
  'xenomorph': '<img src="http://i.imgur.com/UQozZkR.gif" width="60" height="60";>',
  'xenomorph2': '<img src="http://i.imgur.com/hC1fUu7.gif" width="60" height="60";>',
  'saltyduane': '<img src="http://smashboards.com/attachments/salty-duane-gif.34388/" width="60" height="74";>',
  'clippy': '<img src="http://i.imgur.com/A57Z837.gif" width="50" height="60";>',
  'bustin': '<img src="http://i.imgur.com/FXmuLOs.gif" width="67" height="50";>',
  'sonic3': '<img src="http://i.imgur.com/mwR0qnK.gif" width="60" height="60";>',
    'sonic2': '<img src="http://i.imgur.com/EOW60AQ.gif" width="60" height="60";>',
   'feelsscared': '<img src="http://i.imgur.com/uTUjZpq.png" width="50" height="50";>',
   'feels3d': '<img src="http://i.imgur.com/TWSedg5.gif" width="50" height="50";>',
  'feelsgooddance': '<img src="http://i.imgur.com/20tobXF.gif" width="50" height="36";>',
  'feelsguddance': '<img src="http://i.imgur.com/20tobXF.gif" width="50" height="36";>',
  'feelssuicidal': '<img src="http://i.imgur.com/JIqXkac.png" width="50" height="50";>',
//  'feelsmadman': '<img src="http://i.imgur.com/zR8xP2G.png" width="39" height="39";>',
//  'feelsmad': '<img src="http://i.imgur.com/zR8xP2G.png" width="39" height="39";>',
  'feelsjihad': '<img src="http://i.imgur.com/T6LHB0b.png" width="50" height="75";>',
  'feek': '<img src="http://i.imgur.com/BeaCBjD.png" width="37" height="39";>',
  'feeksbadman': '<img src="http://i.imgur.com/BeaCBjD.png" width="37" height="40";>',
  '^': '<img src="http://i.imgur.com/0NFfYFq.gif" width="55" height="38";>',
//'yee': '<img src="http://i.imgur.com/RpznRYJ.gif" width="40" height="45" onclick="script.fns.playSound(script.emoteSounds.yee);>',
  'n64': '<img src="http://i.imgur.com/AJv1S35.gif" width="60" height="60";>',
  'rare': '<img src="http://i.imgur.com/FPf04tV.gif" width="60" height="60";>',
  'diddy': '<img src="http://i.imgur.com/ZEE0jZF.gif" width="66" height="66";>',
  'expanddong': '<img src="http://i.imgur.com/RoQiAtP.png" width="43" height="52";>',
'chris': '<img src="http://i.imgur.com/HjgVrfe.png" width="54" height="60";">',
  'dk': '<img src="http://i.imgur.com/yLLNCsh.gif" width="80" height="50";>',
  'freedum': '<img src="http://i.imgur.com/uDUO8Nw.gif" width="57" height="45";>',
  'kappa': '<img src="http://i.imgur.com/NiMJaW6.png" width="30" height="40";>',
  'myminisides': '<img src="http://i.imgur.com/vETtK.png" width="17" height="24";>',
  'mytinysides': '<img src="http://i.imgur.com/vETtK.png" width="17" height="24";>',
    'shantae': '<img src="http://i.imgur.com/8tfoctn.gif" width="60" height=60";>',
  'ayylmao': '<img src="http://i.imgur.com/7AyGv1a.gif" width="60" height="74";>',
  'gigalien': '<img src="http://i.imgur.com/fNkI3M5.gif" width="40" height="60";>',
  'bongalien': '<img src="http://i.imgur.com/0JF6Nul.gif" width="70" height="70";>',
  'alien2': '<img src="http://i.imgur.com/jBji5uc.gif" width="53" height="73";>',
  'disgusting': '<img src="http://i.imgur.com/4zsobUd.png" width="36" height="61";>',
  'yes': '<img src="http://i.imgur.com/TvtnuqI.gif" width="70" height="45";>',
  'calcium': '<img src="http://i.imgur.com/QZ4qCEE.gif" width="68" height="60";>',
  'snab': '<img src="http://i.imgur.com/5pDD0HW.gif" width="55" height="55";>',
  'sweat': '<img src="http://i.imgur.com/DxlIunk.png" width="60" height="60";>',
  'whores': '<img src="http://i.imgur.com/EWhvuNJ.png" width="57" height="55";>',
  '333': '<img src="http://i.imgur.com/qzKaSUr.png" width="36" height="37";>',
  'pull': '<img src="http://i.imgur.com/jhuvqTo.gif" width="60" height="56";>',
  'push2': '<img src="http://i.imgur.com/WMwbr7n.gif" width="60" height="56";>',
  'gookfood': '<img src="http://i.imgur.com/nfDwcil.png" width="40" height="56";>',
'wut3': '<img src="http://i.imgur.com/pfPLxk6.png" width="60" height="60";">',
  'riptheskin': '<img src="http://i.imgur.com/b3ex5cx.png" width="42" height="49";>',
  'sanic2': '<img src="http://i.imgur.com/GI19OKs.png" width="41" height="45";>',
  'snoic': '<img src="http://i.imgur.com/GI19OKs.png" width="41" height="45";>',
  'neat': '<img src="http://i.imgur.com/34vCnqr.gif" width="80" height="53";>',
  'lewd': '<img src="http://i.imgur.com/byEQnHn.png" width="62" height="70";>',
  'lewd2': '<img src="http://i.imgur.com/5FtdsyK.gif" width="75" height="50";>',
  'birthday': '<img src="http://i.imgur.com/pJznstY.jpg" width="60" height="60";>',
'shrug': '<img src="http://i.imgur.com/AjSWflZ.png" width="86" height="62":>',
//  'hibiki': '<img src="http://i.imgur.com/Uv3e0UT.gif" width="90" height="80";>',
  'lefunnymeme': '<img src="http://i.imgur.com/r8LzdsE.jpg" width="60" height="60";>',
  'lewd3': '<img src="http://i.imgur.com/d6lNkQR.gif" width="68" height="55";>',
  'slowgo': '<img src="http://i.imgur.com/9oEhfOB.gif" width="60" height="60";>',
  'spam': '<img src="http://i.imgur.com/iFvF8q0.gif" width="60" height="55";>',
  'ballin': '<img src="http://i.imgur.com/fP7bAxr.gif" width="60" height="55";>',
  'melon': '<img src="http://i.imgur.com/px7Zn4z.gif" width="60" height="60";>',
  'spooked': '<img src="http://i.imgur.com/C0hi1NC.gif" width="60" height="60";>',
  'suicide2': '<img src="http://i.imgur.com/WlYMFRt.gif" width="60" height="60";>',
  'killme': '<img src="http://i.imgur.com/iVNBNIT.gif" width="80" height="48";>',
  'myfuckingsides': '<img src="http://i.imgur.com/vETtK.png" width="58.5" height="85";>',
  'john': '<img src="http://i.imgur.com/LXaCgmO.png" width="36" height="54";>',
  'notbad': '<img src="http://i.imgur.com/09TQ5oP.png" width="33" height="54";>',
  'spin': '<img src="http://i.imgur.com/pd3vXcV.gif" width="72" height="64";>',
  'kojima': '<img src="http://i.imgur.com/9M40dsy.png" width="60" height="60";>',
  'ken': '<img src="http://i.imgur.com/r5T9ym7.gif" width="56" height="54";>',
  'skelejii': '<img src="http://i.imgur.com/ONTL0jO.gif" width="58" height="61";>',
  'o2': '<img src="http://i.imgur.com/mJPnC0s.gif" width="84" height="63";>',
  'corey': '<img src="http://i.imgur.com/de9cG0t.gif" width="54" height="40";>',
  'sluts': '<img src="http://i.imgur.com/pb6WX9n.png" width="55" height="68";>',
  'rekt2': '<img src="http://i.imgur.com/wMLPDk8.gif" width="60" height="60";>',
  'bot': '<img src="http://i.imgur.com/JbTgsAa.gif" width="28" height="60";>',
  'triggered': '<img src="http://mercilesstruth.com/wp-content/uploads/2015/02/triggered.jpg" width="50" height="58";">',
  'kek2': '<img src="http://i.imgur.com/87P6Xy6.gif" width="58" height="50";>',
  'illusory': '<img src="http://i.imgur.com/nfdzyCE.png" width="58" height="50";>',
  'pomf3': '<img src="http://i.imgur.com/Mjhxhef.png" width="55" height="55";>',
    'wew': '<img src="http://i.imgur.com/SvDjLlY.png" width="55" height="55";>',
  'weeaboo': '<img src="http://i.imgur.com/ug1KSIr.png" width="55" height="55";>',
  'doit': '<img src="http://i.imgur.com/2qCZE52.gif" width="60" height="60";>',
  'autism2': '<img src="http://i.imgur.com/yzJfjvg.gif" width="111" height="32";>',
  'lean': '<img src="http://i.imgur.com/cIOR35M.gif" width="65" height="55";>',


  //dancing/music
    'mario2': '<img src="http://i.imgur.com/A4eNPZW.gif" width="53" height="55";>',
  'yoshi': '<img src="http://i.imgur.com/B6bBva0.gif" width="50" height="51";>',
  'crash': '<img src="http://i.imgur.com/n87b7Ha.gif" width="60" height="60";>',
  'cyrax': '<img src="http://i.imgur.com/8WGVGYh.gif" width="35" height="59";>',
  'dhalsim': '<img src="http://i.imgur.com/DdcpChu.gif" width="53" height="55";>',
  'sakura': '<img src="http://i.imgur.com/xv1O1si.gif" width="75" height="75";>',
  'bridget': '<img src="http://i.imgur.com/mkoBhqm.gif" width="75" height="75";>',
    "ludicolo": '<img src="http://i.imgur.com/Ibjqkzi.gif" width="55" height="45";>',
  'strut': '<img src="http://i.imgur.com/199ZHvl.gif" width="74" height="75";>',
  'kakyoin': '<img src="http://i.imgur.com/AiqM7ep.gif" width="55" height="70";>',
  'ravi2': '<img src="http://i.imgur.com/zy5MRSE.gif" width="85" height="58";>',
  'mj': '<img src="http://i.imgur.com/WSYPYKm.gif" width="66" height="69";>',
  'arthur': '<img src="http://i.imgur.com/RDP8xDj.gif" width="49" height="70";>',
  'monkey': '<img src="http://i.imgur.com/pKXZaQM.gif" width="67" height="50";>',
  'mememe2': '<img src="http://i.imgur.com/6HbdRYv.gif" width="60" height="70";>',
  'moe': '<img src="http://i.imgur.com/j7xljnX.gif" width="57" height="57";>',
  'cirno': '<img src="http://i.imgur.com/NpUPZSn.gif" width="80" height="80";>',
    'skeletal': '<img src="http://i.imgur.com/EOJVmvF.gif" width="53" height="55";>',
  'dubass': '<img src="http://i.imgur.com/Q029MEI.gif" width="62" height="50";>',
  'kabi': '<img src="http://i.imgur.com/F5qdDtE.gif" width="125" height="45";>',
  'mememe': '<img src="http://i.imgur.com/giQjsb3.gif" width="48" height="70";>',
  'ayylien': '<img src="http://i.imgur.com/RgnpAPE.gif" width="45" height="59";>',
  'hestia': '<img src="http://i.imgur.com/66Mb5ih.gif" width="70" height="74";>',
  'jam': '<img src="http://i.imgur.com/6R7qAKv.gif" width="50" height="64";>',
  'illya': '<img src="https://38.media.tumblr.com/961a8b7582140768d50617450b928fa5/tumblr_ngh20fkbak1tl6vgyo1_250.gif" width="60" height="67.5";>',
  'shark': '<img src="http://i.imgur.com/mPYJxxt.gif" width="75" height="42";>',
  'gigashark': '<img src="http://i.imgur.com/i807n8q.gif" width="75" height="41";>',
  'snoop2': '<img src="https://i.areyoucereal.com/HGbLpu.gif" width="33" height="50";>',
   'swerve': '<img src="https://i.imgur.com/d0glWaV.png" width="72" height="64";>',
    'babyguitar': '<img src="https://i.imgur.com/qOCgzsL.gif" width="59" height="59";>',
      'conker': '<img src="http://i.imgur.com/Hh9huYW.gif" width="70" height="66";>',








  

  //weebshit
  'mako':'<img src="http://i.imgur.com/1tME9i9.gif" width="50" height="49";>',
  
  //weebshit that will never be used
  'harahu': '<img src="http://i.imgur.com/IcHOs.gif" width="60" height="70";>',
  'penguin': '<img src="http://i.imgur.com/FBcmjnJ.gif" width="75" height="43";>',
  'buttjuice': '<img src="http://i.imgur.com/S417M86.gif" width="54" height="55";>',
  'laughinganime': '<img src="http://i.imgur.com/HOdSCiN.gif" width="54" height="55";>',
  'wop': '<img src="http://i.imgur.com/wAVQL4D.gif" width="60" height="47";>',
  'miku3': '<img src="http://i.imgur.com/l1jmNIC.gif" width="60" height="47";>',
  'marissa': '<img src="http://i.imgur.com/kauEfnn.gif" width="60" height="60";>',
  'reimu': '<img src="http://i.imgur.com/RRPNiqa.gif" width="50" height="60";>',
  'dj': '<img src="http://i.imgur.com/9gVht7Y.gif" width="60" height="60";>',
  'goblinu2': '<img src="http://i.imgur.com/cCkq4Yb.gif" width="55" height="38";>',
  'kirino': '<img src="http://i.imgur.com/ojyywy4.gif" width="67" height="50";>',
  'awoo': '<img src="http://i.imgur.com/zZzW3S2.gif" width="70,height:68";>',
  'moe2': '<img src="http://i.imgur.com/U5NVxsR.gif" width="55" height="55";>',
  'hi': '<img src="http://i.imgur.com/nANdISW.gif" width="60" height="86.4";>',
  'ree2': '<img src="http://i.imgur.com/h6M9I84.gif" width="75" height="50";>',
  'wow3': '<img src="http://i.imgur.com/n8pl8H9.gif" width="75" height="66";>',
  'wop2': '<img src="http://i.imgur.com/4qf8zh3.gif" width="45" height="70";>',
  'slut': '<img src="http://i.imgur.com/4wunBBM.png" width="60" height="52";>',
  'ritsu': '<img src="http://i.imgur.com/bjnH4nN.gif" width="106" height="66";>',
  'awoo2': '<img src="http://i.imgur.com/78w0OiM.gif" width="60" height="69";>',
  'brushie': '<img src="http://i.imgur.com/tGenRHO.gif" width="64" height="36";>',
  'bye': '<img src="http://i.imgur.com/D2kvAo7.gif" width="88" height="65";>',
  'anime': '<img src="http://i.imgur.com/2OmBZZU.gif" width="60" height="60";>',
  'shy': '<img src="http://i.imgur.com/6UEZ2ar.gif" width="62" height="70";>',
  'suicide': '<img src="http://i.imgur.com/omaV2Sh.png" width="80" height="80";>',
  'uguu': '<img src="http://i.imgur.com/yvW4UWK.gif" width="53" height="70";>',




    //will never be used
  'ff6kappa': '<img src="http://i.imgur.com/6tqguge.gif" width="68" height="50";>',
  'joey': '<img src="http://s9.postimg.org/7jgdsbfe3/Joey_transparent.png" width="60" height="60";>',
  'rekt3': '<img src="http://i.imgur.com/YTX76GS.gif" width="100" height="55";>',
  'rekt': '<img src="http://i.imgur.com/hUvNXZS.gif" width="55" height="40";>',
  'ps': '<img src="http://i.imgur.com/FH5Y7Ni.gif" width="75" height="35";>',
  'raiden': '<img src="http://i.imgur.com/zs8NHsQ.gif" width="70" height="80";>',
  'pew': '<img src="http://i.imgur.com/QWONFwf.gif" width="60" height="50";>',
  'rasm': '<img src="http://i.imgur.com/rcyjkbW.png" width="60" height="60";>',
   




  //old, irrelevant memes
  'respectfulnod': '<img src="http://i.imgur.com/XNCKzV8.gif" width="40" height="60";>',

  //unfunny

};
script.$aniMemes={
        
        //anime
        'smuggestanime': '<img src="http://i.imgur.com/FEkG7Va.png" width="81" height="60";">',
        'rikka': '<img src="http://i.imgur.com/HrBC4jG.gif" width="54" height="53";">',
        'doit3': '<img src="http://i.imgur.com/eIF1R2L.png" width="80" height="60";">',
        'papi': '<img src="http://i.imgur.com/ZBRuxX6.png" width="63" height="57";">',
        'yaranaika': '<img src="http://i.imgur.com/QZrm2LE.png" width="60" height="60";">',
        'bikki': '<img src="http://i.imgur.com/Q5xWyWh.png" width="61" height="72";">',
        'rustle': '<img src="http://i.imgur.com/W7cAfBL.png" width="55" height="56";">',
        'wut2': '<img src="http://i.imgur.com/GRTwulq.gif" width="42" height="68";">',
        'hibiki': '<img src="http://i.imgur.com/Uv3e0UT.gif" width="80" height="60";">',
        'gojira': '<img src="http://i.imgur.com/e7agwHG.jpg" width="60" height="59";">',
        'laughinganime2': '<img src="http://i.imgur.com/jvJA4YE.gif" width="58" height="68";">',
        'rin': '<img src="http://i.imgur.com/PB3hHru.gif" width="54" height="60";">',
        'sogoodnow': '<img src="http://i.imgur.com/gdNlSq6.gif" width="80" height="60";">',
        
        //vidya
        'bigboss': '<img src="http://i.imgur.com/uJrM3u0.png" width="70" height="40";">',
        'servbot': '<img src="http://i.imgur.com/Imolf.gif" width="50" height="50";">',
        'crono': '<img src="http://i.imgur.com/7XFNWrl.gif" width="36" height="72";">',
        'pew2': '<img src="http://i.imgur.com/mWAan6J.gif" width="120" height="54";">',
        'pew3': '<img src="http://i.imgur.com/fb5r3Bw.gif" width="66" height="52";">',
        'terry': '<img src="http://i.imgur.com/GLKVdaG.gif" width="40" height="75";">',
        'wario': '<img src="http://i.imgur.com/TpFDOXv.gif" width="70" height="70";">',
        'chuckle': '<img src="http://i.imgur.com/8B0GAY0.gif" width="42" height="57";">',     
        'he': '<img src="http://i.imgur.com/ZUDYg30.png" width="33" height="60";>',
        'pssh': '<img src="http://i.imgur.com/aSZqQt0.png" width="50" height="50";>',
        'pac': '<img src="http://i.imgur.com/E7GuNSW.gif" width="62" height="50">',
        'strut2': '<img src="http://i.imgur.com/3ewp7sD.gif" width="70" height="72";>',
        'skelestrut': '<img src="http://i.imgur.com/CMvONhr.gif" width="45" height="60";>',
        'frog': '<img src="http://i.imgur.com/JCVY8WY.gif"  width="36" height="72";">',
        'robo': '<img src="http://i.imgur.com/FYbjRHx.gif" width="36" height="70";">',
        'ness': '<img src="http://i.imgur.com/nALMPb7.png" width="50" height="55";>',
        'jotaro': '<img src="http://i.imgur.com/67vdvMo.gif" width="83" height="65";>',
        'dio': '<img src="http://i.imgur.com/x3Xw7V9.gif" width="120" height="70">',
        'megaman': '<img src="http://i.imgur.com/L5JCadl.gif" width="60" height="48";>',
        'fox': '<img src="http://i.imgur.com/u2JoaaP.gif" width="40" height="60";>',
        'link2': '<img src="http://i.imgur.com/8TxZoU9.gif" width="48" height="48";>',
        'blackmage': '<img src="http://i.imgur.com/n7174B2.gif" width="50" height="50":>',
        'doomguy': '<img src="http://i.imgur.com/9lfphNU.png" width="55" height="55";>',
        'doomed': '<img src="http://i.imgur.com/MxtvarH.gif" width="45" height="45";>',
        'treasure': '<img src="http://i.imgur.com/fdZCRCE.gif" width="35" height="60";>',
        'gato': '<img src="http://i.imgur.com/uNVIDJM.gif" width="50" height="50";>',
        'redfield': '<img src="http://i.imgur.com/XlEeB5u.gif" width="63" height="66";">',

    
    
    
        //memes
        'putin': '<img src="http://i.imgur.com/yDrpKH3.png" width="70" height="60";">',
        'just': '<img src="http://i.imgur.com/OOXqit5.png" width="42" height="60";">',
        'doit2': '<img src="http://i.imgur.com/WlYMFRt.gif" width="60" height="60";">',
        'wakemeup': '<img src="http://i.imgur.com/rpFA4eT.png" width="38" height="54";>',
        'cantwakeup': '<img src="http://i.imgur.com/gAqA8PP.png" width="60" height="64";">',
        'feels': '<img src="http://i.imgur.com/QZodT3T.png" width="43" height="50";">',
        'mystery': '<img src="http://i.imgur.com/Zs6sciz.png" width="64" height="60";">',
        'feel': '<img src="http://i.imgur.com/1MJdYMA.png" width="50" height="50" onclick="this.src = \'http://i.imgur.com/miFcyXz.png\'">',
        'feelsbadman': '<img src="http://i.imgur.com/1MJdYMA.png" width="50" height="50" onclick="this.src = \'http://i.imgur.com/miFcyXz.png\'">',
        'feelsgud': '<img src="http://i.imgur.com/miFcyXz.png" width="50" height="50" onclick="this.src = \'http://i.imgur.com/1MJdYMA.png\'">',
        'feelsgoodman': '<img src="http://i.imgur.com/miFcyXz.png" width="50" height="50" onclick="this.src = \'http://i.imgur.com/1MJdYMA.png\'">',
        'feelsmad': '<img src="http://i.imgur.com/zR8xP2G.png" width="50" height="50">',
        'feelsmadman': '<img src="http://i.imgur.com/zR8xP2G.png" width="50" height="50">',
        'feelssmug': '<img src="http://i.imgur.com/HrXSS44.png" width="50" height="50">',
        'ree': '<img src="http://i.imgur.com/U1Trjzq.gif" width="50" height="50">',
        'aniki': '<img src="http://i.imgur.com/tYTy13s.jpg" width="63" height="48" onclick="this.src = \'http://i.imgur.com/VRE07P7.png\'">',
        'shieeet': '<img src="http://i.imgur.com/lArXmLg.png" width="53" height="53">',
        'autism2': '<img src="http://i.imgur.com/yzJfjvg.gif" width="111" height="32";>',
        'yee': '<img src="http://i.imgur.com/RpznRYJ.gif" width="40" height="45";>',
        'eey': '<img src="http://i.imgur.com/064jiZo.gif" width="62" height="43";>',
        'aesthetic': '<img src="http://i.imgur.com/3Vfz8mx.png" width="42" height="60">',
        '40keks': '<img src="http://i.imgur.com/WcPOe64.png" width="60" height="50">',
        'spooped': '<img src="http://i.imgur.com/N6dctIS.gif" width="45" height="50";>',
    'skeletal2': '<img src="http://i.imgur.com/LGpFvyw.gif" width="45" height"65";>',
    'skelestrut2': '<img src="http://i.imgur.com/gHkrhwl.gif" width="30" height"52";>',
    
    

};
$.extend(script.$externalEmotes, script.$metalMemes, script.$aniMemes);