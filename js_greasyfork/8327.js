// ==UserScript==
// @name        Full Queue
// @description All 25 hits on one page, return all, return by requester name and open by requester name.
// @version       0.6
// @include       https://www.mturk.com/mturk/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_openInTab
// @author        Cristo
// @copyright    2012+
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/8327/Full%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/8327/Full%20Queue.meta.js
// ==/UserScript==

var capArr = [], time = 1000, working = false;
var que25 = 'https://www.mturk.com/mturk/sortmyhits?searchSpec=HITSearch%23T%231%2325%23-1%23T%23%21Status%210%21rO0ABXQACEFzc2lnbmVk%21%23%21Deadline%211%21%23%21';
var trdLink = document.getElementById('subtabs').getElementsByTagName('a')[2];

if (trdLink.href === 'https://www.mturk.com/mturk/myhits'){
    trdLink.href = que25;
}

if (window.location.href === que25 && document.getElementById('collapseall')){
    //Return all link
    var collapseall = document.getElementById('collapseall');

    var nonBr1 = document.createTextNode('\u00a0\u00a0');
    collapseall.parentNode.appendChild(nonBr1);

    var bar = document.createElement('font');
    bar.innerHTML = '|';
    bar.setAttribute('color', '#9ab8ef');
    collapseall.parentNode.appendChild(bar);

    var nonBr2 = document.createTextNode('\u00a0\u00a0');
    collapseall.parentNode.appendChild(nonBr2);

    var retunLink = document.createElement('a');
    retunLink.addEventListener('click', returnAll, false);
    retunLink.innerHTML='Return all hits';
    retunLink.setAttribute('id', 'retunall');
    retunLink.setAttribute('class', 'footer_links');
    retunLink.setAttribute('href', '#');
    bar.parentNode.appendChild(retunLink);

    //Delay settings
    var timeTd = document.getElementsByTagName('table')[5].getElementsByTagName('td')[2];
    var delayTextN = document.createElement('span');
    delayTextN.setAttribute('class', 'capsule_black_text');
    delayTextN.innerHTML='Time delay:';
    var nonBr3 = document.createTextNode('\u00a0');
    var delayTextI = document.createElement('input');
    delayTextI.addEventListener('keyup', saveTime, false);
    delayTextN.setAttribute('input', 'delaytextn');
    delayTextI.type = 'text';
    delayTextI.title = 'Delay between page requests in seconds';
    delayTextI.style.width ='25px';

    if(GM_getValue('QueueDelay') === undefined){
        GM_setValue('QueueDelay','0.5');
    }
    delayTextI.value = GM_getValue('QueueDelay');
    time *= delayTextI.value;

    timeTd.appendChild(delayTextN);
    timeTd.appendChild(nonBr3);
    timeTd.appendChild(delayTextI);

    //Open/Return Sets
    var queTable = document.getElementsByTagName('table')[6];
    var container = queTable.firstElementChild;
    var singleContainer = container.children;

    //Add open/return    
    for (var f = 0; f < singleContainer.length; f++){

        var newD = document.createElement('td');
        newD.style.paddingRight = "80px";
        var handle = singleContainer[f].getElementsByClassName('requesterIdentity')[0];
        handle.parentNode.parentNode.insertBefore(newD, handle.parentNode.nextSibling);

        var butO = document.createElement("span");
        butO.addEventListener('click', openSome, false);
        butO.title = 'Open all ' + handle.innerHTML + ' hits';
        butO.style.color = "#1170A0";
        butO.style.cursor = "pointer";
        butO.style.paddingRight = "50%";
        butO.innerHTML = "Open";
        newD.appendChild(butO);

        var butR = document.createElement("span");
        butR.addEventListener('click', returnSome, false);
        butR.title = 'Return all ' + handle.innerHTML + ' hits';
        butR.style.color = "#1170A0";
        butR.style.cursor = "pointer";
        butR.innerHTML = "Return";
        newD.appendChild(butR);

        //Current Links
        /*
        var requesterName = singleContainer[f].getElementsByClassName('requesterIdentity')[0].innerHTML;
        var returnCap = singleContainer[f].getElementsByClassName('capsulelink')[1];
        returnCap.addEventListener('click', returnOne, false);
        var continueCaps = singleContainer[f].getElementsByClassName('capsulelink')[2];

        var singleBits = new Object();
        singleBits.Name = requesterName;
        singleBits.Id = returnCap.getElementsByTagName('a')[0].href.split('hitId=')[1];
        singleBits.Place = f;
        capArr.push(singleBits);
        */
    }
    currenHits();
}
//Keep arry updated temp fix
function currenHits(){
    capArr = [];
    for (var f = 0; f < singleContainer.length; f++){
        if (singleContainer[f].getAttribute('temp') != 'h'){
            var requesterName = singleContainer[f].getElementsByClassName('requesterIdentity')[0].innerHTML;
            var returnCap = singleContainer[f].getElementsByClassName('capsulelink')[1];
            returnCap.addEventListener('click', returnOne, false);
            var continueCaps = singleContainer[f].getElementsByClassName('capsulelink')[2];

            var singleBits = new Object();
            singleBits.Name = requesterName;
            singleBits.Id = returnCap.getElementsByTagName('a')[0].href.split('hitId=')[1];
            singleBits.Place = f;
            capArr.push(singleBits);
        }
    }
    console.log(capArr);
    console.log(singleContainer);
}
//UI Functions
function returnAll(rA){
    if(working === false){
        working = true;
        masterLoop(0,capArr);
    }
}
function returnSome(rS){
    if(working === false){
        working = true;
        var returns = [];
        var clickedName = rS.target.parentNode.parentNode.getElementsByClassName('requesterIdentity')[0].innerHTML;
        for (var f = 0; f < capArr.length; f++){
            if (capArr[f].Name === clickedName){
                var someBundle = new Object();
                someBundle.Id = capArr[f].Id;
                someBundle.Place = capArr[f].Place;
                returns.push(someBundle);
            }
        }
        masterLoop(0,returns);
    }
}
function returnOne(rO){
    rO.preventDefault();
    if(working === false){
        working = true;
        var hitId = rO.target.href.split('hitId=')[1];
        for (var f = 0; f < capArr.length; f++){
            if(capArr[f].Id === hitId){
                break;
            }
        }
        var oneBundle = new Object();
        oneBundle.Id = capArr[f].Id;
        oneBundle.Place = capArr[f].Place;
        masterLoop(0,[oneBundle]);
    }
}
function openSome(oS){
    if(working === false){
        working = true;
        var openings = [];
        var clickedName = oS.target.parentNode.parentNode.getElementsByClassName('requesterIdentity')[0].innerHTML;
        for (var f = 0; f < capArr.length; f++){
            if (capArr[f].Name === clickedName){
                openings.push(capArr[f].Id);
            }
        }
        masterLoop(1,openings);
    }
}
function saveTime(){
    time = 1000;
    GM_setValue('QueueDelay',delayTextI.value);
    time *= GM_getValue('QueueDelay');
}
//Time Loop
function masterLoop(ty,mL){
    setTimeout(function () {
        if(ty === 1){
            openTab(mL[0]);
        } else if(ty === 0){
            fadeHit(mL[0].Place);
            returnHit(mL[0].Id);
        } else{
            console.log('tY NF');
        }

        if(mL.length > 1) {   
            mL.shift();
            masterLoop(ty,mL);            
        } else {
            working = false;
            currenHits();//Update array after bundles are done
            console.log('timeLoop',singleContainer)
        }                        
    }, time);
}
//Page events
function returnHit(rH){
    var returnUrl = 'https://www.mturk.com/mturk/return?inPipeline=false&hitId='+ rH;
    getHttp = new XMLHttpRequest();
    getHttp.open( 'GET', returnUrl, true );
    getHttp.send(null);
}
function fadeHit(fH){
    singleContainer[fH].setAttribute('temp', 'h');//due to timer element is still visable when arry is updated
    var orangeT = document.getElementsByClassName('title_orange_text')[0];
    var oragneAmount = orangeT.innerHTML.split('1-')[1].split(' of')[0];
    if(oragneAmount > 1){
        orangeT.innerHTML = '1-'+(oragneAmount-1)+' of '+(oragneAmount-1)+' Results';
    } else {
        document.getElementsByTagName('table')[5].style.display = 'none';
        orangeT.innerHTML = '0-'+(oragneAmount-1)+' of '+(oragneAmount-1)+' Results';
    }

    var op = 1;
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            singleContainer[fH].style.display = 'none';
        }
        singleContainer[fH].style.opacity = op;
        op -= op * 0.1;

    }, 20);
}
function openTab(oT){
    GM_openInTab('https://www.mturk.com/mturk/continue?hitId='+ oT,{active: false, insert: true});
}