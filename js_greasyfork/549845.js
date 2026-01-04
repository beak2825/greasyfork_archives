// ==UserScript==
// @name         RTT Toggle Trains
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Display enhancements for Real Time Trains
// @author       Mark Sreeves
// @match        https://www.realtimetrains.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=realtimetrains.co.uk
// @grant		GM_getValue
// @grant		GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549845/RTT%20Toggle%20Trains.user.js
// @updateURL https://update.greasyfork.org/scripts/549845/RTT%20Toggle%20Trains.meta.js
// ==/UserScript==

   var url=document.URL;

    var tocFlag='';
    var tocArray='';
    var hiddenElementList='';
var hideRTTads=true;
var filteredServices=''



if (window.top === window) {
    window.addEventListener('load', function () {
        // do something here ...

         if(url.indexOf('service')>0)
        {
            rtt_highlightRow()
            rtt_createPrevNextButtons()
            RTT_hideAds()
            rtt_updateServiceURLTimeStamps()

                let iframes = document.getElementsByTagName('iframe');

            for (let i = 0; i < iframes.length; i++) {
                iframes[i].style.display='none'
            }
        }else{
            loadSavedSettings();

        }

    }, false);
}

run_rtt_functions();


/*******************************************************************/

function run_rtt_functions()
{try{

         rtt_setDefaultValues()

         rtt_listTOCs()

         rtt_create_buttons();

      
      }
  catch(err) {
  alert(err.message + ' run_rtt_functions');
 }
}
/*******************************************************************/
function rtt_listTOCs()
{
    try{
        var el=document.getElementsByClassName('servicelist');
        if(el.length>0)
        {
            var a=el[0].getElementsByTagName('a');
            var strout='';
        if(document.body.innerHTML.indexOf('(Q)') > 0)
        {
            strout+='(Q),'
        }

        if(document.body.innerHTML.indexOf('>Cancel<') > 0)
        {
            strout+='Cancel,'
        }

        for(var i=0;i<a.length;i++)
        {
            var toc=a[i].getElementsByClassName('toc');

              if(toc.length>0){
                var t=toc[0].innerHTML
                if(strout.indexOf(t)<0)
                {
                    strout+=t+','
                }
            }
        }

        tocArray= strout.split(',').sort();

        tocFlag=new Array(tocArray.length)

        for (i=0; i<tocFlag.length;i++)
        {
            tocFlag[i] = false;
        }
        }
    }
  catch(err) {
  alert(err.message + ' rtt_listTOCs()');
 }
}



/*******************************************************************/

function rtt_create_buttons()
{
    try{
    //var el=document.getElementsByClassName('clearfix hour_buttons');'

        var el=document.getElementsByClassName('hour_buttons');
        if (typeof el[0] == 'undefined') {return}
       
        el[0].style.setProperty('display', 'flex')
        el[0].style.setProperty('flex-wrap', 'wrap')
        //el[0].style.setProperty('gap', '0.5em')
        el[0].style.setProperty('gap', '0')
        el[0].style.setProperty('justify-content', 'flex-start')

        el[0].innerHTML='' // Remove the existing buttons and banner


        //Add buttons to the web page

       var bu = document.createElement('a');
       
        bu.innerHTML='Unhide All';
        bu.id='x';
        bu.title='Unhide All';
        bu.className='hollow button small float-left'
        bu.addEventListener('click', rtt_ToggleElements, false);
        el[0].append(bu);

    //Add buttons to the web page
    for(var i=1;i<tocArray.length;i++)
    {
        bu = document.createElement('a');
        bu.innerHTML='Toggle ' + tocArray[i];
        bu.id=i;
        bu.title='Toggle ' + tocArray[i];
        bu.className='hollow button small float-left'
        bu.addEventListener('click', rtt_ToggleElements, false);
        el[0].append(bu);
    }



        //remove the ones at the bottom
        if(el[1]){el[1].remove()}
      }
  catch(err) {
  alert(err.message + ' realtimetrains_create_buttons()');
 }

}





/*******************************************************************/

function rtt_ToggleElements()
{
    try{
    if(this.id=='x')
    {hiddenElementList='';
        for(var i=0;i<tocFlag.length;i++)
        {tocFlag[i]=false}

    }else{

        tocFlag[this.id]=!tocFlag[this.id];
        if(tocFlag[this.id]==true)
        {
            hiddenElementList += ',' + tocArray[this.id]
        }else{
            hiddenElementList = hiddenElementList.replaceAll(',' + tocArray[this.id],'');
        }
    }
    GM_setValue('rtt_hiddenElementList',hiddenElementList);
    rtt_ShowHideElements();

         }
  catch(err) {
  alert(err.message + ' rtt_ToggleElements()');
 }
}
/********************************************************/
function rtt_ShowHideElements()
{
    try{

        filteredServices=''
    var eventList=document.getElementsByClassName('servicelist');
    if (typeof eventList[0] == 'undefined') {return}

    var elm = eventList[0].getElementsByTagName('a');
    var hide=false;


   //  alert(flag[this.id])
   // GM_setValue('rttflag'+this.id,flag[this.id]);

        for(var i=0;i<elm.length;i++)
        {
            hide=false;
            for(var j=0;j<tocArray.length;j++)//
            {
                //alert(tocArray[j] + ' ' + tocFlag[j])
            //alert(elm[i].innerHTML);

                if(elm[i].innerHTML.indexOf('>'+tocArray[j]+'<')>0)
                {
                    hide=hide||tocFlag[j];
                }
            }

            if (hide==false) {
                filteredServices=filteredServices + rtt_getServiceId(elm[i].href) + ','
                if(elm[i].style.display == 'none'){
                    elm[i].style.display = ''

                }
                //elm[i].style.display = "inline-block";
            } else {

                elm[i].style.display = 'none'; // Hide
            }
       }//end of for
        filteredServices=filteredServices.replace(/,\s*$/, '')
        GM_setValue('filteredServices',filteredServices)
         }
  catch(err) {
  alert(err.message + ' rtt_ShowHideElements()');
 }


}//end of function

/***************************************************************/
function rtt_getServiceId(u) {
    //alert(u)
  const match = u.match(/gb-nr:([^/?]+)/);
  return match ? match[1] : null;
}


/*******************************************************************/

function loadSavedSettings()
{try{
    
        hiddenElementList = GM_getValue('rtt_hiddenElementList',hiddenElementList);
        for(var i=0;i<tocArray.length;i++)
        {
            tocFlag[i]=hiddenElementList.indexOf(tocArray[i])>0;
        }
        rtt_ShowHideElements()

        if(hideRTTads==true){RTT_hideAds()}


 }
  catch(err) {
  alert(err.message + ' loadSavedSettings()');
 }
}



/***************************************************************/

function RTT_hideAds(){


    var elm = document.getElementsByTagName('div');
        for(var i=0;i<elm.length;i++)
        {
            if(elm[i].innerHTML.indexOf('data-google')>0){
            //elm[i].style.display = "none";
            }

            if(elm[i].className.indexOf('ad-wrapper')>-1){

            elm[i].style.display = "none";
            }
            if(elm[i].className.indexOf('ad-unit')>-1){
                elm[i].style.display = "none";
            }
                        if(elm[i].className.indexOf('ad_unit')>-1){
                elm[i].style.display = "none";
            }
             if(elm[i].className.indexOf('ad-unit stickyspacer')>-1){

            elm[i].style.display = "none";
            }
            if(elm[i].className.indexOf('ci-bg')>-1){

            elm[i].style.display = "none";
            }

        }
//if(hideRTTads==true){
    var myTimeout = setTimeout(RTT_hideAds, 1000);
//}
}

/***************************************************************/

function rtt_setDefaultValues()
{try{

    var pos = url.indexOf('.co.uk');
    var urlpath = ''
    if (pos !== -1)
    {
        urlpath = url.substring(pos +6);

        //This is the bare url so redirect to saved location
        if(urlpath=='/')
        {
            let today = new Date().toISOString().split('T')[0];
            let loc= GM_getValue('loc',null)
            if(loc!=null){
                window.location.href= url + 'search/detailed/gb-nr:'+ loc +'/'+ today +'/0000-2359?stp=WVS&show=all&order=wtt'
            }
        }

    }

    pos = url.indexOf('search');
//We don't want to save the info from a 'service' page
     if (pos !== -1)
    {
        const match = url.match(/gb-nr:([^/?]+)/);
        var loc= match ? match[1] :null;

        GM_setValue('loc',loc)

    }
   }catch(err) {
  alert(err.message);
 }
}

/***************************************************************/

function rtt_highlightRow()
{try{

    var loc= GM_getValue('loc','XXXXXX')
    var row=document.getElementsByClassName('location')
    if(row.length>0){
        for(var i=0;i<row.length;i++)
        {
            if(row[i].innerHTML.indexOf('gb-nr:'+ loc)>=0)
            {
                row[i].style.backgroundColor = "yellow";
            }
        }
    }

 }
  catch(err) {
  alert(err.message + '  highlightRow()');
 }
}

/***************************************************************/

function rtt_createPrevNextButtons()
{try{

    let data= GM_getValue('filteredServices','')

    // Split into an array
    let items = data.split(',');

    // Find index of current service
    let target = rtt_getServiceId(url)
    let index = items.indexOf(target);

    // Get the item before and after (if they exist)
    let before = index > 0 ? items[index - 1] : null;
    let after = index < items.length - 1 ? items[index + 1] : null;

    var menu=document.getElementsByClassName('menu');
        //alert(menu.length)
        if(menu[0]!=null)
        {
            var li = document.createElement('li');
            var link=document.createElement('a');
            var linkText = document.createTextNode('Previous');
            link.appendChild(linkText);
            if(before===null){
                link.title='End of List'
            }else{
            link.title='Previous'
             link.href=url.replace(target,before);
            }

            li.appendChild(link)
            menu[0].appendChild(li)

            li = document.createElement('li');
            link=document.createElement('a');
            linkText = document.createTextNode('Next');
            link.appendChild(linkText);
            if(after===null){
                link.title='End of List'
            }else{
                link.title='Next'
            link.href=url.replace(target,after);
            }

            li.appendChild(link)
            menu[0].appendChild(li)

        }
}
  catch(err) {
  alert(err.message + '  rtt_createPrevNextButtons()');
 }
}

/*************************************************/
function rtt_updateServiceURLTimeStamps()
{
    try{


    var eventList=document.getElementsByClassName('locationlist');
    if (typeof eventList[0] == 'undefined') {return}

    var elm = eventList[0].getElementsByTagName('a');

        for(var i=0;i<elm.length;i++)
        {
const parts = elm[i].href.split('/');
    parts[parts.length - 1] = '0000-2359';
    elm[i].href = parts.join('/');


         }
    }
  catch(err) {
  alert(err.message + ' rtt_ShowHideElements()');
 }


}//end of function

