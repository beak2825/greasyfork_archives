// ==UserScript==
// @name         Rail Advent Toggle Trains
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display enhancements for Rail Advent Railtours pages
// @author       Mark Sreeves
// @match        https://www.railadvent.co.uk/steam-locomotives-on-the-mainline*
// @match        https://www.railadvent.co.uk/railtours*
// @match        https://www.railadvent.co.uk/events/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=railadvent.co.uk
// @grant		GM_getValue
// @grant		GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549846/Rail%20Advent%20Toggle%20Trains.user.js
// @updateURL https://update.greasyfork.org/scripts/549846/Rail%20Advent%20Toggle%20Trains.meta.js
// ==/UserScript==

   var url=document.URL;

    //Variables for the state of each button
   var flag=[false,false,false,false];

if (window.top === window) {
    window.addEventListener('load', function () {
        // do something here ...

        loadSavedSettings();
        railadvent_hideclutter()

        if(url.indexOf('railadvent.co.uk/events')>0)
        {
            showDetails()
        }


    }, false);
}

 if(url.indexOf('railadvent.co.uk/events')>0)
 {

   }else if(url.indexOf('www.railadvent.co.uk')>0)
    {
        railadvent_hideEvcalListAds()

       railadvent_create_buttons();

       railadvent_createMissingSubTitles()

    }

hidechatwidget()

/*******************************************************************/

function loadSavedSettings()
{try{
   
      flag[0]=GM_getValue('raflag0',false);
      flag[1]=GM_getValue('raflag1',false);
      
      railadvent_ShowHideElements();
}
  catch(err) {
  alert(err.message + ' loadSavedSettings()');
 }
}

/**********************************************************/

function railadvent_create_buttons()
{//Add buttons to the web page
    var el=document.getElementsByClassName('evo_cal_above_content');
    var caption=["\'Timings?: No\'","Cancelled"];

    var link = document.createElement('span');
        link.innerHTML='Unhide All';
        link.id='x'
        link.className='cal_head_btn'
        link.addEventListener('click', railadvent_ToggleElements, false);
        el[0].append(link);

    for(var i=0;i<caption.length;i++)
    {
        link = document.createElement('span');
        link.innerHTML='Toggle ' + caption[i];
        link.id=i;
        link.className='cal_head_btn'
        link.addEventListener('click', railadvent_ToggleElements, false);
        el[0].append(link);
   }
}

/*******************************************************************/
function railadvent_ToggleElements()
{//alert(this.id);
     if(this.id=='x')
     {//toggle all
         for(var i=0;i<flag.length;i++)
         {
             flag[i]=false;
             GM_setValue('raflag'+i,flag[i]);
         }
     }else{

         flag[this.id]=!flag[this.id];
         GM_setValue('raflag'+this.id,flag[this.id]);
     }
    railadvent_ShowHideElements()
}

/*******************************************************************/
function railadvent_ShowHideElements()
{try{//alert('x')
        var eventList=document.getElementById('evcal_list');
        var hide=false;

for (let i = 0; i < eventList.children.length; i++) {
  let elm = eventList.children[i];


    if (elm.tagName === 'DIV') {

        hide=false;
        //if(elm.innerHTML.indexOf('Jacobite')>0){hide=hide||flag[0];}

        if(elm.innerHTML.indexOf('>No<')>0){hide=hide||flag[0];}

        //if(elm.className.indexOf('past_event')>0){hide=hide||flag[2];}

        if(elm.className.indexOf('cancelled')>0){hide=hide||flag[1];}

        if (hide==false) {
            elm.style.display = "block";
        } else {
            elm.style.display = "none";
        }
    }
         }//end of for


 }catch(err) {
  alert(err.message);
 }
}//end of function


/********************************************************/
function railadvent_hideEvcalListAds()
{
   let parentDiv = document.getElementById('evcal_list');

    for (let i = 0; i < parentDiv.children.length; i++) {
        let child = parentDiv.children[i];

        if (child.tagName === 'DIV') {
            if(child.id.indexOf('event')==-1){
                child.style.display = "none";
            }
        }
    }

}

/*******************************************************************/

function showDetails()
{
    var el=document.getElementsByClassName('padb5 evo_h3');

    if(el[1].parentElement.innerHTML.indexOf('IMPORTANT INFO!')>-1)
    {
        var d=document.getElementsByClassName('eventon_full_description');
        var strBody = document.body.innerHTML;
        d[0].innerHTML= eventDetailHeading() + getDescription(strBody)
    }
}

/********************************************************/

function getDescription(strin)
{try{
   var pos=strin.indexOf('"description":')
    var retval=strin.substring(pos+15)
    pos=retval.indexOf('"}')
    retval=retval.substring(0, pos)
   // alert(retval)
   // alert(retval.length)
    return retval;

}catch(err) {
  alert(err.message);
 }
}

/*******************************************/
function getRRTUrl()
{

try{
   var strBody = document.body.innerHTML;
    var rrtUrl=''
 var pos=strBody.indexOf('realtimetrains.co.uk')
 if(pos>0){
     rrtUrl=strBody.substring(pos)
     rrtUrl='http://www.' + rrtUrl
     rrtUrl= rrtUrl.substring(0, rrtUrl.indexOf('>')-1)
     return rrtUrl
 }

}catch(err) {
  alert(err.message);
 }
}

/********************************************************/

function eventDetailHeading(){
    return '<h3 class="padb5 evo_h3"><span class="evcal_evdata_icons"><i class="fa fa-align-justify"></i></span>Event Details<br></h3>'
}

/********************************************************/

function eventSubTitle(strin)
{
    var strout ='<span class="evoet_subtitle evo_below_title">\n'
		strout+='<span class="evcal_event_subtitle ">\n'
		strout+=strin +'\n'
		strout+='</span>\n'
	strout+='</span>\n'
    return strout
}

/********************************************************/

function cleanup(strin)
{
 var pos=strin.indexOf('detailed')

    var retval=strin.substring(pos)
    retval=retval.replaceAll('<strong>','')
    pos=retval.indexOf('>')
    retval= retval.substring(pos+1)
    pos=retval.indexOf('<')
    return retval.substring(0, pos)
}

/********************************************************/

function railadvent_createMissingSubTitles()
{try{
//var evo=document.getElementsByClassName('evo_event_schema');
    var eventList=document.getElementById('evcal_list');
        var elm = eventList.getElementsByTagName('div');
   var span=''
var d=''
for(var i=0;i<elm.length;i++)
{
    if(elm[i].className.indexOf('eventon_list_event')>-1)
    {

        if(elm[i].innerHTML.indexOf('evoet_subtitle evo_below_title')<=0)
           {//no subtitle
               span=elm[i].getElementsByTagName('span');
               for(var j=0;j<span.length;j++)
               {
                   d=cleanup(getDescription(elm[i].innerHTML))
                   if(span[j].className.indexOf('evoet_c3')>-1)
                   {
                       span[j].appendChild(document.createTextNode (d));
                   }
               }
           }

}
}


}catch(err) {
  alert(err.message);
 }
}

/*********************************************************/

function railadvent_hideclutter()
{try{

    // Get all div elements on the page
     let container = document.getElementById('main');
    let divs = container.getElementsByClassName('elementor-widget-container');

    // Loop through and find the one with the matching text
    let targetDiv = Array.from(divs).find(div =>
                                          div.textContent.includes('On this page you can choose from upcoming tours')
                                         );

    if (targetDiv) {
        targetDiv.parentElement.style.display = "none";
    }


    var elm = document.getElementsByTagName('div');
     for(var i=0;i<elm.length;i++)
        {
            if(elm[i].className.indexOf('raila')>-1)
            {//alert('x')
             elm[i].style.display = 'none';
            }
            if(elm[i].className.indexOf('google-auto-placed')>-1)
            {//alert('x')
             elm[i].style.display = 'none';
            }


        }

         elm=document.getElementById('onesignal-bell-container')
        if(elm!=null){elm.style.display = 'none'}

        elm=document.getElementById('mys-wrapper')
        if(elm!=null){elm.style.display = 'none'}




    let chatwidget = document.querySelector('iframe[title="chat widget"]');
    if (chatwidget) {
    chatwidget.style.display = 'none';
    }

    let iframes = document.getElementsByTagName('iframe');

            for (let i = 0; i < iframes.length; i++) {
                iframes[i].style.display='none'
            }


}catch(err) {
  alert(err.message);
 }
}

/************************************************************/

function hidechatwidget()
{
try{
    const startTime = Date.now();
    const timeout = 10000
    const interval = 100
    const timer = setInterval(() => {
    const el = document.querySelector('iframe[title="chat widget"]');
    if (el) {
      clearInterval(timer);
      el.style.display = 'none';
    } else if (Date.now() - startTime > timeout) {
      clearInterval(timer);
      console.warn('Element not found within timeout.');
    }
  }, interval);
}catch(err) {
  alert(err.message + ' hidechatwidget');
 }
}


