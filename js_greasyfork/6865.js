// ==UserScript==
// @name         New emojis+ :3
// @namespace    awkward_potato
// @version      2.5
// @description  adds many many more emojis to the oneplus forums
// @author       awkward_potato, EyeZiS
// @include      https://forums.oneplus.net/threads/*
// @include      https://forums.oneplus.net/conversations/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6865/New%20emojis%2B%20%3A3.user.js
// @updateURL https://update.greasyfork.org/scripts/6865/New%20emojis%2B%20%3A3.meta.js
// ==/UserScript==


var iframe2;
if (document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_NoAutoComplete')[0]) {
    iframe2 = document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_NoAutoComplete')[0];
} else if (document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_')[0]) {
    iframe2 = document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_')[0];
}
    
    iframe2 = iframe2.contentWindow.document.getElementsByTagName('body')[0];

function clickHandlerC(index) {
    return function () {
        var pp = iframe2.getElementsByTagName('p');
        pp[pp.length -1].innerHTML = pp[pp.length -1].innerHTML + '<img src="' + c[index].src + '">&nbsp;';
    };
}

function clickHandlerH(index) {
    return function () {
        var pp = iframe2.getElementsByTagName('p');
        pp[pp.length -1].innerHTML = pp[pp.length -1].innerHTML + '<img src="' + h[index].src + '">&nbsp;';
    };
}

function clickHandlerO1(index) {
    return function () {
        var pp = iframe2.getElementsByTagName('p');
        pp[pp.length -1].innerHTML = pp[pp.length -1].innerHTML + '<img src="' + o1[index].src + '">&nbsp;';
    };
}

function clickHandlerS(index) {
    return function () {
        var pp = iframe2.getElementsByTagName('p');
        pp[pp.length -1].innerHTML = pp[pp.length -1].innerHTML + '<img src="' + s[index].src + '">&nbsp;';
    };
}

function clickHandlerO2(index) {
    return function () {
        var pp = iframe2.getElementsByTagName('p');
        pp[pp.length -1].innerHTML = pp[pp.length -1].innerHTML + '<img src="' + o2[index].src + '">&nbsp;';
    };
}

if ($('input[value="Post Reply"]').length > 0 || $('input[value="Reply to Conversation"]').length > 0 || $('input[value="Reply to Thread"]').length > 0) {
    var c = [
        {'src':'http://i.imgur.com/s2mnHPj.png'},
        {'src':'http://i.imgur.com/xQEgir2.png'},
        {'src':'http://i.imgur.com/uQKnAHL.png'},
        {'src':'http://i.imgur.com/77QKaCF.png'},
        {'src':'http://i.imgur.com/aEIFMOD.png'},
        {'src':'http://i.imgur.com/3xmvLQB.png'},
        
        {'src':'http://i.imgur.com/j8kVjQx.png'},
        {'src':'http://i.imgur.com/Osrk8Z6.png'},
        {'src':'http://i.imgur.com/PLXyQoG.png'},
        {'src':'http://i.imgur.com/Wt6Mt5Y.png'},
        {'src':'http://i.imgur.com/coW4gmv.png'},
        {'src':'http://i.imgur.com/U7sQeeB.png'},
        {'src':'http://i.imgur.com/SOIm2QI.png'},
        {'src':'http://i.imgur.com/1CQnfI4.png'},
        {'src':'http://i.imgur.com/n0LxE67.png'},
        {'src':'http://i.imgur.com/0vO27Us.png'},
        {'src':'http://i.imgur.com/NJ6VaZd.png'},
        {'src':'http://i.imgur.com/Iz9dIeF.png'},
        {'src':'http://i.imgur.com/SCcL49G.png'},
        {'src':'http://i.imgur.com/jJz11mk.png'},
        {'src':'http://i.imgur.com/JKsX6sA.png'},
        {'src':'http://i.imgur.com/TE23JDQ.png'},
        {'src':'http://i.imgur.com/Z6rEbOj.png'},
        {'src':'http://i.imgur.com/7x4vE57.png'},
        {'src':'http://i.imgur.com/4kuBhCa.png'},
        {'src':'http://i.imgur.com/5ySsWCx.png'},
        {'src':'http://i.imgur.com/oGC5iz9.png'},
        {'src':'http://i.imgur.com/mlVCJNQ.png'},
        {'src':'http://i.imgur.com/exbEJw6.png'},
        {'src':'http://i.imgur.com/XtcLVi8.png'},
        {'src':'http://i.imgur.com/oXnPJzK.png'},
        {'src':'http://i.imgur.com/7nQzs1N.png'},
        {'src':'http://i.imgur.com/C35tWRr.png'},
        {'src':'http://i.imgur.com/dTeca6e.png'},
        {'src':'http://i.imgur.com/kz4sU6E.png'},
        {'src':'http://i.imgur.com/dXV0bPZ.png'},
        {'src':'http://i.imgur.com/jpgBiOo.png'},
        {'src':'http://i.imgur.com/e1rc3vr.png'},
        {'src':'http://i.imgur.com/Pq6xcYg.png'},
        {'src':'http://i.imgur.com/hO7m9ga.png'},
    ];
        
        var h = [
        //hangouts        
        {'src':'http://i.imgur.com/vpOXVGK.png'},
        {'src':'http://i.imgur.com/Y1vZjiX.png'},
        {'src':'http://i.imgur.com/qPVDTQ9.png'},
        {'src':'http://i.imgur.com/zkaTlAd.png'},
        {'src':'http://i.imgur.com/scUISw8.png'},
        {'src':'http://i.imgur.com/xp1jqJf.png'},
        {'src':'http://i.imgur.com/4Kn0YBJ.png'},
        {'src':'http://i.imgur.com/hK8EFTv.png'},
        {'src':'http://i.imgur.com/X9SqjQ2.png'},
        
        {'src':'http://i.imgur.com/aYRlrHV.png'},
        {'src':'http://i.imgur.com/I3AS64C.png'},
        {'src':'http://i.imgur.com/kJJNiwZ.png'},
        {'src':'http://i.imgur.com/fKAFbm0.png'},
        {'src':'http://i.imgur.com/JICfIFj.png'},
        {'src':'http://i.imgur.com/FytXaEh.png'},
        {'src':'http://i.imgur.com/rrekvUn.png'},
        {'src':'http://i.imgur.com/ad6HSLi.png'},
        {'src':'http://i.imgur.com/ER0gWHb.png'},
        {'src':'http://i.imgur.com/1wkDeWB.png'},
        {'src':'http://i.imgur.com/KwDoZ9A.png'},
        {'src':'http://i.imgur.com/ovqPLQn.png'},
        {'src':'http://i.imgur.com/qOtWwcH.png'},
        {'src':'http://i.imgur.com/mU1RKXd.png'},
        {'src':'http://i.imgur.com/x0pychj.png'},
        {'src':'http://i.imgur.com/u1WHrgx.png'},
        {'src':'http://i.imgur.com/G3w9kef.png'},
        {'src':'http://i.imgur.com/HzTxh21.png'},
        {'src':'http://i.imgur.com/dFUn4OG.png'},
        {'src':'http://i.imgur.com/ejes95e.png'},
        {'src':'http://i.imgur.com/OwA33Zb.png'},
        {'src':'http://i.imgur.com/kmvVMTC.png'},
        {'src':'http://i.imgur.com/AX9Rut8.png'},
        {'src':'http://i.imgur.com/pQpnv0k.png'},
        {'src':'http://i.imgur.com/pf4L6gk.png'},
        {'src':'http://i.imgur.com/AOKKQP1.png'},
        {'src':'http://i.imgur.com/WAaoHfp.png'},
        {'src':'http://i.imgur.com/GmMXwZB.png'},
        {'src':'http://i.imgur.com/XPVBoet.png'},
        {'src':'http://i.imgur.com/jbNBigO.png'},
        {'src':'http://i.imgur.com/817AGU4.png'},
        {'src':'http://i.imgur.com/sCKxAV9.png'},
        {'src':'http://i.imgur.com/vI1c2TU.png'},
        {'src':'http://i.imgur.com/vP3I9w3.png'},
        {'src':'http://i.imgur.com/pAUELjY.png'},
        {'src':'http://i.imgur.com/urJYVoa.png'},
        {'src':'http://i.imgur.com/kV7PgWJ.png'},
        {'src':'http://i.imgur.com/esFvxar.png'},
        {'src':'http://i.imgur.com/zDZkc7W.png'},
        {'src':'http://i.imgur.com/5fC1h4r.png'},
        {'src':'http://i.imgur.com/TheqhpC.png'},
        {'src':'http://i.imgur.com/VJnirgH.png'},
        {'src':'http://i.imgur.com/xLhnK5d.png'},
        {'src':'http://i.imgur.com/E9W6WN3.png'},
        {'src':'http://i.imgur.com/kP2djp2.png'},
        {'src':'http://i.imgur.com/Qx2wwAi.png'},
        {'src':'http://i.imgur.com/WwrbsDX.png'},
        {'src':'http://i.imgur.com/Zj2aBHy.png'},
        {'src':'http://i.imgur.com/QRr7pgi.png'},
        {'src':'http://i.imgur.com/ynah5l8.png'},
        {'src':'http://i.imgur.com/TPqkjBo.png'},
        {'src':'http://i.imgur.com/mXZQQyR.png'},
        {'src':'http://i.imgur.com/VOesKVE.png'},
        {'src':'http://i.imgur.com/sPrcwnI.png'},
        {'src':'http://i.imgur.com/v3eZTzx.png'},
        {'src':'http://i.imgur.com/QjrFTOo.png'},
        
        {'src':'http://i.imgur.com/Oul1J4D.png'},
        {'src':'http://i.imgur.com/REaECno.png'},
        {'src':'http://i.imgur.com/tZD9WDu.png'},
        {'src':'http://i.imgur.com/1snuG0r.png'},
        {'src':'http://i.imgur.com/nzAP2JG.png'},
        {'src':'http://i.imgur.com/j7C4Aq0.png'},
        {'src':'http://i.imgur.com/tMxIx7S.png'},
        {'src':'http://i.imgur.com/SJbR6sm.png'},
        {'src':'http://i.imgur.com/YKlOs0W.png'},
        {'src':'http://i.imgur.com/WTMNq8v.png'},
        {'src':'http://i.imgur.com/GWilqh2.png'},
        {'src':'http://i.imgur.com/Bbsm9n5.png'},
        {'src':'http://i.imgur.com/pGU6x8S.png'},
        {'src':'http://i.imgur.com/FDP39zz.png'},
        {'src':'http://i.imgur.com/79VA6TT.png'},
        {'src':'http://i.imgur.com/WdCtOnn.png'},
    ];
    
    var o1 = [
        //other1
        {'src':'http://i.imgur.com/KaCv5op.gif'},
        {'src':'http://i.imgur.com/ejU2fcF.png'},
        {'src':'http://i.imgur.com/bio1pvI.gif'},
        {'src':'http://i.imgur.com/Ltd5iU6.png'},
        {'src':'http://i.imgur.com/T4IgzTY.gif'},
        {'src':'http://i.imgur.com/PbUaxYx.png'},
        {'src':'http://i.imgur.com/R8W6I0w.png'},
        {'src':'http://i.imgur.com/xG4RIrA.gif'},
        {'src':'http://i.imgur.com/rbFuPXF.gif'},
        {'src':'http://i.imgur.com/wyYOabT.gif'},
        {'src':'http://i.imgur.com/S6UEbHD.gif'},
        {'src':'http://i.imgur.com/4xMO5KD.gif'},
        {'src':'http://i.imgur.com/TwFgi2c.gif'},
        {'src':'http://i.imgur.com/hbETBD0.png'},
        {'src':'http://i.imgur.com/tQ9iHT6.gif'},
        {'src':'http://i.imgur.com/jomyAJ4.gif'},
        {'src':'http://i.imgur.com/1hHjhXy.gif'},
        {'src':'http://i.imgur.com/JBLi3hO.png'},
        {'src':'http://i.imgur.com/2zCelqA.gif'},
        {'src':'http://i.imgur.com/v6wvs7A.gif'},
        {'src':'http://i.imgur.com/HN61JpJ.png'},
        {'src':'http://i.imgur.com/p80TRPX.gif'},
        {'src':'http://i.imgur.com/jKIo5cV.gif'},
        {'src':'http://i.imgur.com/qENwY90.gif'},
        {'src':'http://i.imgur.com/3fIiDj2.gif'},
        {'src':'http://i.imgur.com/6t2Edws.png'},
        {'src':'http://i.imgur.com/QFgTdCv.gif'},
        {'src':'http://i.imgur.com/IesFNjq.gif'},
        {'src':'http://i.imgur.com/dqSaOBe.png'},
        {'src':'http://i.imgur.com/LFhYb3I.gif'},
        {'src':'http://i.imgur.com/7ggKVAO.gif'},
        {'src':'http://i.imgur.com/AccmU5M.gif'},
        {'src':'http://i.imgur.com/T2CfvSd.gif'},
        {'src':'http://i.imgur.com/ueULm7y.gif'},
        {'src':'http://i.imgur.com/euU0YPC.gif'},
        {'src':'http://i.imgur.com/2cgWGlH.gif'},
        {'src':'http://i.imgur.com/MPPaTyz.png'},
        {'src':'http://i.imgur.com/iy5JEtV.gif'},
        {'src':'http://i.imgur.com/ZENu745.gif'},
        {'src':'http://i.imgur.com/nfFXKjo.gif'},
        {'src':'http://i.imgur.com/ebWpush.png'},
        {'src':'http://i.imgur.com/ZF06woy.gif'},
        {'src':'http://i.imgur.com/PQ46nnT.gif'},
        {'src':'http://i.imgur.com/ERHUlCz.gif'},
        {'src':'http://i.imgur.com/6RjFMle.gif'},
        {'src':'http://i.imgur.com/f5T2Orb.png'},
        {'src':'http://i.imgur.com/Sjxv94d.gif'},
        {'src':'http://i.imgur.com/j79a9aH.gif'},
        {'src':'http://i.imgur.com/V5cCsWh.png'},
        {'src':'http://i.imgur.com/cMyP5ad.gif'},
        {'src':'http://i.imgur.com/HCRlrTz.gif'},
        {'src':'http://i.imgur.com/UEJ07GO.gif'},
        {'src':'http://i.imgur.com/FhxkvG1.gif'},
        {'src':'http://i.imgur.com/OphqGmp.gif'},
        {'src':'http://i.imgur.com/ltpLsUw.gif'},
        {'src':'http://i.imgur.com/L8qFDbk.gif'},
        {'src':'http://i.imgur.com/VdsR7Kd.gif'},
        {'src':'http://i.imgur.com/Qh7HS3l.gif'},
        {'src':'http://i.imgur.com/sR5ERGu.png'},
        {'src':'http://i.imgur.com/NSLcMn7.gif'},
        {'src':'http://i.imgur.com/1goqhMM.gif'},
        {'src':'http://i.imgur.com/HrYLFFB.gif'},
        {'src':'http://i.imgur.com/Jbt4I2Z.gif'},
        {'src':'http://i.imgur.com/CKbSOtO.png'},
        {'src':'http://i.imgur.com/hd1dUWI.png'},
        {'src':'http://i.imgur.com/ylaLgZg.gif'},
        {'src':'http://i.imgur.com/lYIYWaG.gif'},
        {'src':'http://i.imgur.com/OfDMTt5.gif'},
        {'src':'http://i.imgur.com/DtZamGL.gif'},
        {'src':'http://i.imgur.com/2PfclL5.gif'},
        {'src':'http://i.imgur.com/mjDDoYp.png'},
        {'src':'http://i.imgur.com/AFAlTnd.gif'},
        {'src':'http://i.imgur.com/AbXv6rW.gif'},
        {'src':'http://i.imgur.com/DdGW27Z.png'},
        {'src':'http://i.imgur.com/1PWsDVr.gif'},
        {'src':'http://i.imgur.com/qsn9fnc.png'},
        {'src':'http://i.imgur.com/p9FSUKE.gif'},
        {'src':'http://i.imgur.com/Uh85EFc.gif'},
        {'src':'http://i.imgur.com/WVE2soK.png'},
        {'src':'http://i.imgur.com/ynRV5zk.png'},
        {'src':'http://i.imgur.com/hXawssJ.gif'},
    ];
        
        var s = [
        //skype
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0100-smile.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0101-sadsmile.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0102-bigsmile.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0103-cool.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0105-wink.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0106-crying.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0107-sweating.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0108-speechless.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0109-kiss.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0110-tongueout.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0111-blush.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0112-wondering.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0113-sleepy.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0114-dull.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0115-inlove.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0116-evilgrin.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0117-talking.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0118-yawn.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0119-puke.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0120-doh.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0121-angry.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0122-itwasntme.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0123-party.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0124-worried.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0125-mmm.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0126-nerd.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0127-lipssealed.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0128-hi.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0129-call.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0130-devil.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0131-angel.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0132-envy.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0133-wait.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0134-bear.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0135-makeup.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0136-giggle.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0137-clapping.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0138-thinking.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0139-bow.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0140-rofl.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0141-whew.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0142-happy.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0143-smirk.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0144-nod.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0145-shake.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0146-punch.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0147-emo.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0148-yes.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0149-no.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0150-handshake.gif'},
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0152-heart.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0153-brokenheart.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0154-mail.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0155-flower.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0156-rain.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0157-sun.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0158-time.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0159-music.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0160-movie.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0161-phone.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0162-coffee.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0163-pizza.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0164-cash.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0165-muscle.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0166-cake.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0167-beer.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0168-drink.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0169-dance.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0170-ninja.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0171-star.gif'},
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0174-bandit.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0175-drunk.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0176-smoke.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0177-toivo.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0178-rock.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0179-headbang.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0180-bug.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0181-fubar.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0182-poolparty.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0183-swear.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0184-tmi.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0185-heidy.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0186-myspace.gif'}, 
        {'src':'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0189-priidu.gif'},
    ];
    
    var o2 = [
        //other2
        {'src':'http://tweakimg.net/g/s/smile.gif'},
        {'src':'http://tweakimg.net/g/s/frown.gif'},
        {'src':'http://tweakimg.net/g/s/redface.gif'},
        {'src':'http://tweakimg.net/g/s/biggrin.gif'},
        {'src':'http://tweakimg.net/g/s/biggrin.gif'},
        {'src':'http://tweakimg.net/g/s/cry.gif'},
        {'src':'http://tweakimg.net/g/s/devil.gif'},
        {'src':'http://tweakimg.net/g/s/clown.gif'},
        {'src':'http://tweakimg.net/g/s/wink.gif'},
        {'src':'http://tweakimg.net/g/s/puh2.gif'},
        {'src':'http://tweakimg.net/g/s/yummie.gif'},
        {'src':'http://tweakimg.net/g/s/shiny.gif'},
        {'src':'http://tweakimg.net/g/s/heart.gif'},
        {'src':'http://tweakimg.net/g/s/sleephappy.gif'},
        {'src':'http://tweakimg.net/g/s/vork.gif'},
        {'src':'http://tweakimg.net/g/s/rc5.gif'},
        {'src':'http://tweakimg.net/g/s/yawnee.gif'},
        {'src':'http://tweakimg.net/g/s/sadley.gif'},
        {'src':'http://tweakimg.net/g/s/coool.gif'},
        {'src':'http://tweakimg.net/g/s/confused.gif'},
        {'src':'http://tweakimg.net/g/s/frusty.gif'},
        {'src':'http://tweakimg.net/g/s/nosmile2.gif'},
        {'src':'http://tweakimg.net/g/s/nosmile.gif'},
        {'src':'http://tweakimg.net/g/s/puh.gif'},
        {'src':'http://tweakimg.net/g/s/kwijl.gif'},
        {'src':'http://tweakimg.net/g/s/shutup.gif'},
        {'src':'http://tweakimg.net/g/s/bonk.gif'},
        {'src':'http://tweakimg.net/g/s/hypocrite.gif'},
        {'src':'http://tweakimg.net/g/s/worshippy.gif'}
    ];
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        if($('input[value="Post Reply"]').length > 0) {
            $('form#QuickReply').after('<div id="emojis" style="margin-left: 0px;"></div>');
        }else{
            $('form.Preview').after('<div id="emojis" style="margin: 20px auto 10px auto;"></div>');
        }
    }else{
        if($('input[value="Post Reply"]').length > 0) {
            $('form#QuickReply').after('<div id="emojis" style="margin-left: 140px;"></div>');
        }else{
            $('form.Preview').after('<div id="emojis" style="margin: 10px auto;max-width: 800px;"></div>');
        }
    }
    var p1 = '<div><input class="spoilerbutton" style="display: inline;" type="button" value="Show" onclick="this.value=this.value==\'Show\'?\'Hide\':\'Show\';">';
    var p2 = '<div class="spoiler"><div id="';
    var p3 = '"></div></div></div>';
    $('div#emojis').append('<style type="text/css">.spoilerbutton {display:block;margin:5px 0;}.spoiler'+
                           ' {overflow:hidden;background: #f5f5f5;}.spoiler > div {-webkit-transition: all'+
                           ' 0.2s ease;-moz-transition: margin 0.2s ease;-o-transition: all 0.2s ease;trans'+
                           'ition: margin 0.2s ease;}.spoilerbutton[value="Show"] + .spoiler > div {margin-to'+
                           'p:-100%;}.spoilerbutton[value="Hide"] + .spoiler {padding:5px;}</style>');
    $('div#emojis').append('<span id="c"></span>');
    $('div#emojis').append(p1+' hangouts emojis'+p2+'h'+p3);
    $('div#emojis').append(p1+' other1 emojis'+p2+'o1'+p3);
    $('div#emojis').append(p1+' skype emojis'+p2+'s'+p3);
    $('div#emojis').append(p1+' other2 emojis'+p2+'o2'+p3);
    for (i = 0; i < c.length; i++){
        c[i].element = document.createElement("a");
        c[i].element.innerHTML = '<img src="' + c[i].src +'" class="mceSmilieSprite">&nbsp;';
        $('span#c').append(c[i].element);
        c[i].element.onclick = clickHandlerC(i);
    }
    for (i = 0; i < h.length; i++){
        h[i].element = document.createElement("a");
        h[i].element.innerHTML = '<img src="' + h[i].src +'" class="mceSmilieSprite">&nbsp;';
        $('div#h').append(h[i].element);
        h[i].element.onclick = clickHandlerH(i);
    }
    for (i = 0; i < o1.length; i++){
        o1[i].element = document.createElement("a");
        o1[i].element.innerHTML = '<img src="' + o1[i].src +'" class="mceSmilieSprite">&nbsp;';
        $('div#o1').append(o1[i].element);
        o1[i].element.onclick = clickHandlerO1(i);
    }
    for (i = 0; i < s.length; i++){
        s[i].element = document.createElement("a");
        s[i].element.innerHTML = '<img src="' + s[i].src +'" class="mceSmilieSprite">&nbsp;';
        $('div#s').append(s[i].element);
        s[i].element.onclick = clickHandlerS(i);
    }
    for (i = 0; i < o2.length; i++){
        o2[i].element = document.createElement("a");
        o2[i].element.innerHTML = '<img src="' + o2[i].src +'" class="mceSmilieSprite">&nbsp;';
        $('div#o2').append(o2[i].element);
        o2[i].element.onclick = clickHandlerO2(i);
    }
    console.log(c.length);
    
    $("input.primary").first().click(function (){
        var iframe2;
        if (document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_NoAutoComplete')[0]) {
            iframe2 = document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_NoAutoComplete')[0];
        } else if (document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_')[0]) {
            iframe2 = document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_')[0];
        }
        var quoteReg=/(\[QUOTE\]?[\s\S]*?\[\/QUOTE\])/igm
        
        var message = iframe2.contentWindow.document.getElementsByTagName('body')[0].innerHTML;
        var misc = message.match(quoteReg);
        var numMisc = (misc === null) ? 0 : misc.length;
        message = message.replace(quoteReg, "▓");
        var em = [/:3&lt;3/igm,/&gt;:3/igm,/:'3/igm, 
        /x#3/gm,/=3/gm,
        /8\)/gm,/&gt;:\(/gm, 
        /:poop:/igm, /X\)/igm,
        /}:\(/igm, /:\|/gm, 
        /-\.-/igm, /:\\/gm,
        /(\:\/)(?![\/])/gm, /:'\(/gm,
        /:o(?![\w\d])/gm, /D:/gm,
        /:O/gm, /X\(/igm,
        /\\o\//igm, /o\/(?![\w\d])/igm,
        /\\o(?![\w\d])/igm, /&gt;_&lt;/igm,
        /B\)/gm, /&lt;3/gm, 
        /;3/gm,
        /:3/gm];
        var li = ['<img src="http://i.imgur.com/esFvxar.png">&nbsp;','<img src="http://i.imgur.com/77QKaCF.png">&nbsp;',
        '<img src="http://i.imgur.com/3xmvLQB.png">&nbsp;',
        '<img src="http://i.imgur.com/uQKnAHL.png">&nbsp;', '<img src="http://i.imgur.com/s2mnHPj.png">&nbsp;',
        '<img src="http://i.imgur.com/U7sQeeB.png">&nbsp;', ' :mad: ',
        '<img src="http://i.imgur.com/FDP39zz.png">&nbsp;', '<img src="http://i.imgur.com/X9SqjQ2.png">&nbsp;',
        '<img src="http://i.imgur.com/I3AS64C.png">&nbsp;', '<img src="http://i.imgur.com/JICfIFj.png">&nbsp;',
        '<img src="http://i.imgur.com/FytXaEh.png">&nbsp;', '<img src="http://i.imgur.com/rrekvUn.png">&nbsp;',
        '<img src="http://i.imgur.com/rrekvUn.png">&nbsp;', '<img src="http://i.imgur.com/KwDoZ9A.png">&nbsp;',
        '<img src="http://i.imgur.com/qOtWwcH.png">&nbsp;', '<img src="http://i.imgur.com/G3w9kef.png">&nbsp;',
        '<img src="http://i.imgur.com/pQpnv0k.png">&nbsp;', '<img src="http://i.imgur.com/AOKKQP1.png">&nbsp;',
        '<img src="http://i.imgur.com/ynah5l8.png">&nbsp;', '<img src="http://i.imgur.com/QRr7pgi.png">&nbsp;',
        '<img src="http://i.imgur.com/QRr7pgi.png">&nbsp;', '<img src="http://i.imgur.com/mU1RKXd.png">&nbsp;',
        '<img src="http://i.imgur.com/5fC1h4r.png">&nbsp;', '<img src="http://i.imgur.com/817AGU4.png">&nbsp;',
        '<img src="http://i.imgur.com/aEIFMOD.png">&nbsp;',
        '<img src="http://i.imgur.com/xQEgir2.png">&nbsp;'
        ];
        console.log(message);
        for(x=0;x<em.length;x++){
        message = message.replace(em[x], li[x]);
        console.log(message);
        }
        
        for (var i = 0; i < numMisc; i++) {
            message = message.replace(/▓/im, misc[i]);
        }
        
        iframe2.contentWindow.document.getElementsByTagName('body')[0].innerHTML=message;
    });
}
