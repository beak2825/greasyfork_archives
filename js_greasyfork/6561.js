
// ==UserScript==
// @name         Gains Emotes                           
// @namespace    https://greasyfork.org/en/users/7035-hench          
// @version      2.55
// @description  Custom emotes for  instasync.com/r/gains                                
// @grant        none                                   
// @copyright    2016                                    
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/6561/Gains%20Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/6561/Gains%20Emotes.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


var emotes = [

// room emotes
    
    { src:"http://i.imgur.com/DhrPa3h.gif", width:40, height:60, title:'alien'},
    { src:"http://i.imgur.com/grzlkIC.jpg", width:60, height:45, title:'ayylmao'},
    { src:"http://i.imgur.com/F8BaGVW.gif", width:50, height:50, title:'autism'},
    { src:"http://i.imgur.com/Ovw6xXO.png", width:55, height:55, title:'b8'},
    { src:"http://i.imgur.com/tua4xS9.gif", width:50, height:50, title:'ban'},
    { src:"http://i.imgur.com/Wk8MOXa.png", width:55, height:55, title:'breh'},
    { src:"http://i.imgur.com/gU5VFPr.png", width:50, height:50, title:'comfy'},
    { src:"http://i.imgur.com/gsUPzs8.jpg", width:65, height:49, title:'disgusting'},
    { src:"http://i.imgur.com/K769Z9m.jpg", width:55, height:55, title:'cringe'},
    { src:"http://i.imgur.com/SUS5HmM.gif", width:55, height:55, title:'costanza'},
    { src:"http://i.imgur.com/DzqbxE8.jpg", width:60, height:55, title:'damp'},
    { src:"http://i.imgur.com/lQ87V77.gif", width:55, height:45, title:'dc'},
    { src:"http://i.imgur.com/UkAuKNm.jpg", width:55, height:55, title:'drenched'},
    { src:"http://i.imgur.com/89L9A91.jpg", width:55, height:53, title:'don'},
    { src:"http://i.imgur.com/YFkj7oi.gif", width:55, height:55, title:'doot'},
    { src:"http://i.imgur.com/Ml7BNyd.png", width:25, height:25, title:'downvote'},
    { src:"http://i.imgur.com/uOzyYGx.jpg", width:57, height:50, title:'edgy'},
    { src:"http://i.imgur.com/PXOErsu.png", width:55, height:55, title:'feelsgood'},
    { src:"http://i.imgur.com/kbSBf8p.gif", width:55, height:55, title:'gay'},
    { src:"http://i.imgur.com/Gp5leNo.gif", width:64, height:36, title:'getrekt'},
    { src:"http://i.imgur.com/J48994t.gif", width:70, height:47, title:'gigaduane'},
    { src:"http://i.imgur.com/aqhrV.gif", width:50, height:38, title:'go'},
    { src:"http://i.imgur.com/C3oeQu8.png", width:42, height:55, title:'gook'},
    { src:"http://i.imgur.com/wtdCaAt.gif", width:50, height:50, title:'haters'},
    { src:"http://i.imgur.com/aB4i0Va.png", width:48, height:55, title:'heem'},
    { src:"http://i.imgur.com/2CkbU2h.jpg", width:45, height:56, title:'heypussy'},
    { src:"http://i.imgur.com/bVzBQ6d.png", width:55, height:55, title:'hmmm'},
    { src:"http://i.imgur.com/QKeGa7l.jpg", width:50, height:50, title:'hnnng'},
    { src:"http://i.imgur.com/9qdbS0q.jpg", width:55, height:55, title:'hue'},
    { src:"http://i.imgur.com/xW7eqcj.png", width:50, height:55, title:'laughinggirls'},
    { src:"http://i.imgur.com/0KqhbSd.jpg", width:50, height:55, title:'lmao'},
    { src:"http://i.imgur.com/otPauQK.png", width:55, height:55, title:'lysol'},
    { src:"http://i.imgur.com/5GlRI.gif", width:76, height:51, title:'popcorn'},
    { src:"http://i.imgur.com/5KIe37G.gif", width:65, height:40, title:'puke'},
    { src:"http://i.imgur.com/zWa3XkS.jpg", width:55, height:55, title:'rage'},
    { src:"http://i.imgur.com/iDzFfbY.gif", width:55, height:50, title:'stfu'},
    { src:"http://i.imgur.com/zeZ2YxP.png", width:46, height:56, title:'tinman'},
    { src:"http://i.imgur.com/VOhCgkC.gif", width:80, height:52, title:'topkek'},
    { src:"http://i.imgur.com/FBUdBdV.png", width:48, height:55, title:'triggered'},
    { src:"http://i.imgur.com/QJ41dQb.png", width:25, height:25, title:'upvote'},
    { src:"http://i.imgur.com/0sZCe2L.gif", width:55, height:55, title:'wow'},
    

// wojak emotes

    { src:"http://i.imgur.com/CorSVqK.png", width:44, height:55, title:'bucketfeels'},
    { src:"http://i.imgur.com/5ymyU7a.png", width:55, height:55, title:'cuck'},
    { src:"http://i.imgur.com/hnefnVf.png", width:55, height:50, title:'feelssmug'},
    { src:"http://i.imgur.com/pid1Q6q.png", width:55, height:55, title:'ssfeels'},
    { src:"http://i.imgur.com/tc2HpdM.jpg", width:47, height:55, title:'suicide'},
    
// pepe emotes
    
    { src:"http://i.imgur.com/SicUnXK.png", width:55, height:55, title:'90spepe'},
    { src:"http://i.imgur.com/of7zEEs.png", width:55, height:46, title:'bed'},
    { src:"http://i.imgur.com/Er4PZbQ.png", width:50, height:60, title:'bee'},
    { src:"http://i.imgur.com/57z7AFA.png", width:55, height:55, title:'big'},
    { src:"http://i.imgur.com/SF8tSoO.jpg", width:55, height:55, title:'blackpepe'},
    { src:"http://i.imgur.com/ySnOinb.jpg", width:55, height:54, title:'bliss'},
    { src:"http://i.imgur.com/3pbLtZL.jpg", width:55, height:55, title:'chad'},
    { src:"http://i.imgur.com/myKR0o0.png", width:55, height:55, title:'columbinepepe'},
    { src:"http://i.imgur.com/Rd6gdlT.jpg", width:55, height:51, title:'cool'},
    { src:"http://i.imgur.com/oQ1e85Q.jpg", width:46, height:55, title:'devilish'},
    { src:"http://i.imgur.com/YFIgSxW.jpg", width:75, height:48, title:'enough'},
    { src:"http://i.imgur.com/XuD8yA7.png", width:50, height:55, title:'eazyp'},
    { src:"http://i.imgur.com/ciCmM39.jpg", width:50, height:43, title:'feelsmad'},
    { src:"http://i.imgur.com/CCMYYYB.jpg", width:55, height:53, title:'grillpepe'},
    { src:"http://i.imgur.com/afgxDQd.jpg", width:47, height:55, title:'jew'},
    { src:"http://i.imgur.com/9CGbjCr.jpg", width:55, height:55, title:'normies'},
    { src:"http://i.imgur.com/A9vXLOd.jpg", width:47, height:55, title:'nippon'},
    { src:"http://i.imgur.com/9EcoW6T.jpg", width:50, height:53, title:'patrick'},
    { src:"http://i.imgur.com/eZBnzJ6.jpg", width:55, height:55, title:'reee'},
    { src:"http://i.imgur.com/H4Eur5e.png", width:40, height:37, title:'sadpepe'},
    { src:"http://i.imgur.com/4q3Zc9k.jpg", width:55, height:55, title:'smug'},
    { src:"http://i.imgur.com/q7ldsDW.jpg", width:55, height:51, title:'sweat'},
    { src:"http://i.imgur.com/7DcmUoX.jpg", width:50, height:53, title:'tip'},
    { src:"http://i.imgur.com/7sMhzaH.png", width:55, height:55, title:'tired'},

// flag emotes

    { src:"http://i.imgur.com/Wpw7XN2.gif", width:36, height:26, title:'aus'},
    { src:"http://i.imgur.com/fZ44WVA.gif", width:36, height:26, title:'br'},
    { src:"http://i.imgur.com/t2t6hm1.gif", width:36, height:26, title:'ca'},
    { src:"http://i.imgur.com/3DEQ5zg.gif", width:36, height:26, title:'co'},
    { src:"http://i.imgur.com/kb8yinu.gif", width:36, height:26, title:'de'},
    { src:"http://i.imgur.com/hUnHJvO.gif", width:36, height:26, title:'fin'},
    { src:"http://i.imgur.com/GHnQRYG.gif", width:36, height:26, title:'fr'},
    { src:"http://i.imgur.com/vnhY9Mu.gif", width:36, height:26, title:'isr'},
    { src:"http://i.imgur.com/Nffo2UR.gif", width:36, height:26, title:'jp'},
    { src:"http://i.imgur.com/mMtrKYK.gif", width:36, height:26, title:'mex'},
    { src:"http://i.imgur.com/ZYcwsa1.gif", width:36, height:26, title:'nz'},
    { src:"http://i.imgur.com/QYfr3Q3.gif", width:36, height:26, title:'pol'},
    { src:"http://i.imgur.com/CUlQsfH.gif", width:36, height:26, title:'ru'},
    { src:"http://i.imgur.com/kURaCY6.gif", width:36, height:26, title:'sco'},
    { src:"http://i.imgur.com/3GvSRC6.gif", width:36, height:26, title:'sk'},
    { src:"http://i.imgur.com/9eCWp0T.gif", width:36, height:26, title:'som'},
    { src:"http://i.imgur.com/YGciAOM.gif", width:36, height:26, title:'tx'},
    { src:"http://i.imgur.com/SbNJ2tq.gif", width:36, height:26, title:'uk'},
    { src:"http://i.imgur.com/Yd8m2gA.gif", width:36, height:26, title:'usa'},

// default emotes

    { src:"http://i.imgur.com/SAyYM.png", width:30, height:29, title:':3'},
    { src:"http://i.imgur.com/cw2K1qQ.gif", width:50, height:49, title:':o'},
    { src:"http://i.imgur.com/eKMaWME.jpg", width:59, height:45, title:'2slow'},
    { src:"http://i.imgur.com/zU4MWxt.gif", width:50, height:50, title:'applause'},
    { src:"http://i.imgur.com/KMtUc.png", width:20, height:27, title:'babby'},
    { src:"http://i.imgur.com/GiBiY.png", width:30, height:21, title:'babyseal'},
    { src:"http://i.imgur.com/sNwfW.png", width:83, height:28, title:'bagger288'},
    { src:"http://i.imgur.com/C7jqbVR.gif", width:50, height:65, title:'bardy'},
    { src:"http://i.imgur.com/sqmG0.gif", width:60, height:60, title:'bateman'},
    { src:"http://i.imgur.com/JVbAzkh.gif", width:35, height:58, title:'bear'},
    { src:"http://i.imgur.com/AAulUfx.gif", width:50, height:50, title:'bender'},
    { src:"http://i.imgur.com/mAQAc.gif", width:24, height:36, title:'bikenigger'},
    { src:"http://i.imgur.com/7rhHQ.gif", width:55, height:38, title:'birdy'},
    { src:"http://i.imgur.com/NHWMFAV.png", width:27.2, height:40, title:'bogs'},
    { src:"http://i.imgur.com/6aqGVba.gif", width:60, height:60, title:'boogie'},
    { src:"http://i.imgur.com/dVo0h.gif", width:40, height:40, title:'brody'},
    { src:"http://i.imgur.com/6bkHh.gif", width:50, height:50, title:'burt'},
    { src:"http://i.imgur.com/j5Znq.gif", width:50, height:50, title:'chikkin'},
    { src:"http://i.imgur.com/qTy2s.gif", width:60, height:40, title:'clap'},
    { src:"http://i.imgur.com/KWKwd.gif", width:60, height:45, title:'daddycool'},
    { src:"http://i.imgur.com/Pvq0s.gif", width:40, height:40, title:'dansen'},
    { src:"http://i.imgur.com/1awtK.png", width:30, height:30, title:'datass'},
    { src:"http://i.imgur.com/3Nzl3gQ.gif", width:50, height:63, title:'ded'},
    { src:"http://i.imgur.com/LIe61.gif", width:50, height:31, title:'deowitit'},
    { src:"http://i.imgur.com/VpmN8.jpg", width:56, height:38, title:'dilbert'},
    { src:"http://i.imgur.com/QbPMBnT.jpg", width:50, height:50, title:'disguy'},
    { src:"http://i.imgur.com/DaUdTh0.gif", width:46, height:60, title:'disco'},
    { src:"http://i.imgur.com/wtfdb.gif", width:40, height:49, title:'dog'},
    { src:"http://i.imgur.com/93FIGRJ.gif", width:60, height:60, title:'doge'},
    { src:"http://i.imgur.com/gZe9z.png", width:30, height:37, title:'dolan'},
    { src:"http://i.imgur.com/uYK1FIh.jpg", width:40, height:40, title:'dreck'},
    { src:"http://i.imgur.com/NSodE.gif", width:55, height:38, title:'duane'},
    { src:"http://i.imgur.com/0gq5a.gif", width:40, height:40, title:'dynamite'},
    { src:"http://i.imgur.com/i2SWp.gif", width:60, height:60, title:'ecchi'},
    { src:"http://i.imgur.com/aOXm1.gif", width:45, height:45, title:'epicsaxguy'},
    { src:"http://i.imgur.com/PsY5I.gif", width:33, height:40, title:'fap'},
    { src:"http://i.imgur.com/FGs29.jpg", width:40, height:30, title:'facepalm'},
    { src:"http://i.imgur.com/3d9rVYL.gif", width:55, height:60, title:'feels'},
    { src:"http://i.imgur.com/D5Pb9CK.png", width:55, height:55, title:'feelsbadman'},
    { src:"http://i.imgur.com/obllO.png", width:30, height:36, title:'foreveralone'},
    { src:"http://i.imgur.com/rPd1rF4.png", width:30, height:40, title:'foreverfedora'},
    { src:"http://i.imgur.com/HK8Mc.gif", width:60, height:44, title:'frog'},
    { src:"http://i.imgur.com/e6oan.gif", width:50, height:37, title:'fukkireta'},
    { src:"http://i.imgur.com/5ziar.gif", width:30, height:40, title:'gang'},
    { src:"http://i.imgur.com/RQDcT0t.gif", width:50, height:50, title:'gir'},
    { src:"http://i.imgur.com/OzoGMzC.jpg", width:45, height:50, title:'glad'},
    { src:"http://i.imgur.com/tZ7uG.png", width:40, height:40, title:'gooby'},
    { src:"http://i.imgur.com/zg7DE.gif", width:50, height:58, title:'goyim'},
    { src:"http://i.imgur.com/0YH5oDz.jpg", width:60, height:52, title:'haveaseat'},
    { src:"http://i.imgur.com/tyu9p.png", width:29, height:30, title:'imokwiththis'},
    { src:"http://i.imgur.com/XTRtP.jpg", width:40, height:41, title:'invadinggecko'},
    { src:"http://i.imgur.com/0gRnsme.jpg", width:45, height:55, title:'jimmy'},
    { src:"http://i.imgur.com/JeUM7i7.png", width:40, height:54, title:'kek'},
    { src:"http://i.imgur.com/fjnKFla.jpg", width:45, height:58, title:'kekefeels'},
    { src:"http://i.imgur.com/lMNHVOi.gif", width:50, height:60, title:'kidzbop'},
    { src:"http://i.imgur.com/LoiLTWx.png", width:30, height:30, title:'like'},
    { src:"http://i.imgur.com/LLXMuJ1.jpg", width:50, height:45, title:'lefunnymeme'},
    { src:"http://i.imgur.com/r6OJDU5.png", width:50, height:53, title:'lewd'},
    { src:"http://i.imgur.com/jP8QL.png", width:28, height:34, title:'lolface'},
    { src:"http://i.imgur.com/lwZ8K.gif", width:40, height:31, title:'lolicatgirls1080p'},
    { src:"http://i.imgur.com/USvG7.gif", width:40, height:40, title:'meattball'},
    { src:"http://i.imgur.com/1x6es.png", width:30, height:31, title:'megusta'},
    { src:"http://i.imgur.com/slU5Ibx.gif", width:35, height:58, title:'merica'},
    { src:"http://i.imgur.com/7Zpq3i9.gif", width:45, height:55, title:'metal'},
    { src:"http://i.imgur.com/aHk0nnU.gif", width:60, height:45, title:'mewte'},
    { src:"http://i.imgur.com/ScyKroE.gif", width:32, height:43, title:'miku'},
    { src:"http://i.imgur.com/GDa6R.jpg", width:40, height:40, title:'mmmm'},
    { src:"http://i.imgur.com/f8QbyJk.gif", width:45, height:55, title:'monkey'},
    { src:"http://i.imgur.com/MYnVAEY.gif", width:50, height:38, title:'motherofgod'},
    { src:"http://i.imgur.com/Gg1asUN.gif", width:50, height:45, title:'mysides'},
    { src:"http://i.imgur.com/UsUdb.png", width:60, height:60, title:'nice'},
    { src:"http://i.imgur.com/eAqvn.jpg", width:20, height:30, title:'nigga'},
    { src:"http://i.imgur.com/N97Di.png", width:30, height:41, title:'nope'},
    { src:"http://i.imgur.com/NaJOipw.jpg", width:50, height:50, title:'notsure'},
    { src:"http://i.imgur.com/XVR2I.jpg", width:46, height:40, title:'nowai'},
    { src:"http://i.imgur.com/doRcz.gif", width:40, height:40, title:'o'},
    { src:"http://i.imgur.com/TN1xn.png", width:21, height:30, title:'okay'},
    { src:"http://i.imgur.com/Moz8e.gif", width:50, height:50, title:'omnom'},
    { src:"http://i.imgur.com/ifjt6ru.gif", width:50, height:49, title:'oo'},
    { src:"http://i.imgur.com/2cRoc.jpg", width:48, height:44, title:'orly'},
    { src:"http://i.imgur.com/vRZA9.png", width:18, height:25, title:'pedobear'},
    { src:"http://i.imgur.com/gbqK7.png", width:30, height:33, title:'pokerface'},
    { src:"http://i.imgur.com/lotDJ.gif", width:50, height:40, title:'pomf'},
    { src:"http://i.imgur.com/fomgV.jpg", width:40, height:40, title:'pull'},
    { src:"http://i.imgur.com/pad58.gif", width:60, height:50, title:'racist'},
    { src:"http://i.imgur.com/LzEUn.gif", width:60, height:40, title:'rape'},
    { src:"http://i.imgur.com/rgeL0X0.gif", width:56, height:60, title:'rin'},
    { src:"http://i.imgur.com/WGVec1g.png", width:40, height:50, title:'sad'},
    { src:"http://i.imgur.com/CTZGo.png", width:31, height:33, title:'sanic'},
    { src:"http://i.imgur.com/0Bwax.gif", width:20, height:45, title:'snoop'},
    { src:"http://i.imgur.com/30e00.png", width:28, height:59, title:'success'},
    { src:"http://i.imgur.com/FhdArn4.gif", width:55, height:55, title:'thuglife'},
    { src:"http://i.imgur.com/q0erE.gif", width:40, height:40, title:'timotei'},
    { src:"http://i.imgur.com/idXUK.png", width:30, height:25, title:'trollface'},
    { src:"http://i.imgur.com/kODDJ.gif", width:66, height:46, title:'umad'},
    { src:"http://i.imgur.com/Yk6ZV.png", width:33, height:14, title:'umaood'},
    { src:"http://i.imgur.com/xpamg.png", width:40, height:40, title:'unamused'},
    { src:"http://i.imgur.com/CALcK.png", width:38, height:42, title:'wat'},
    { src:"http://i.imgur.com/65QFT.png", width:51, height:60, title:'weegee'},
    { src:"http://i.imgur.com/FL5zr.jpg", width:48, height:44, title:'yarly'}
    ];

function addEmotes(){
    emotes.forEach(function(emote){
        window.$codes[emote.title || emote.name] = $('<img>', emote)[0].outerHTML;
    });
}
 
function main(){
    if(!window.$codes || Object.keys(window.$codes).length === 0){
        setTimeout(main, 75);
    }else{
        addEmotes();    
    }
}
if (window.document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main, false);
}