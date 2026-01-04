// ==UserScript==
// @name         RTT Location Record Count Check
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Compares the number of records to a second location
// @author       You
// @match        https://www.realtimetrains.co.uk/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=realtimetrains.co.uk
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @grant		GM_getValue
// @grant		GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549848/RTT%20Location%20Record%20Count%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/549848/RTT%20Location%20Record%20Count%20Check.meta.js
// ==/UserScript==
var currentloc=''
var lastloc=''
var url=document.URL
var currentLocationCount=''
var checkLocationCount=''
var locAServiceList=''
var locBServiceList=''
var showExtras=false
var previousLocation=''
var nextLocation=''

var fsb=false;

if (window.top === window) {
    window.addEventListener('load', function () {
        // do something here ...

         if(url.indexOf('service')>0)
        {

        }else{

            fsb=GM_getValue('fsb',false)
            if(fsb==true){fixSearchBox()}

         showExtras=GM_getValue('showExtras',false)

          if(showExtras==true)
          {
              rtt_showAutoCompleteLink()
              rtt_showExtras()

          }

           rtt_createMenuButton()

        }

    }, false);
}

/***************************************************************/
function rtt_showExtras(){
try{


    var retval=countRows(document)

    if(retval!==null)
    {
        currentloc=getLocationId(url)
        lastloc=GM_getValue('loc',null)
        //alert( currentloc + ' ' + lastloc)
        if(currentloc!=lastloc)
        {//read a service page to find neighbouring locations
            GM_setValue('loc',currentloc)

          var firstService=getFirstService(document)
          //alert(firstService)
           getNeighbouringLocations(firstService)

        }else{

        //OK, we now have the neighbouring locations, so write some links
         previousLocation=GM_getValue('previousLocation',null)
         nextLocation=GM_getValue('nextLocation',null)

        addLinkToSearchPage(previousLocation)
        addLinkToSearchPage(nextLocation)
        }
    }
}
  catch(err) {
  alert(err.message + ' rtt_showExtras');
 }

}
/***************************************************************/
function rtt_removeExtras()
{try{
    //The locationcodes have been used as div IDs
     previousLocation=GM_getValue('previousLocation',null)
     nextLocation=GM_getValue('nextLocation',null)

     document.getElementById(previousLocation).remove();
     document.getElementById(nextLocation).remove();

     document.getElementById('divfsb').remove();

  }
  catch(err) {
  alert(err.message + ' rtt_removeExtras()');
 }
}

/***************************************************************/
function rtt_toggleExtras()
 {
     showExtras=!showExtras
     GM_setValue('showExtras',showExtras)
     if(showExtras==true)
     {
         rtt_showAutoCompleteLink()
         rtt_showExtras()

     }else{
         rtt_removeExtras()
     }

 }
/***************************************************************/

function countRows(d)
{try{
        var el=d.getElementsByClassName('servicelist');
        if(el.length>0)
        {
            var a=el[0].getElementsByTagName('a');
            return a.length;
        }else{return null}

  }
  catch(err) {
  alert(err.message + 'countRows');
 }

}

/***************************************************************/

function listServices(d)
{try{var s=''
        var el=d.getElementsByClassName('servicelist');
        if(el.length>0)
        {
            var a=el[0].getElementsByTagName('a');
            for(var i = 0;i<a.length;i++)
            {
               s=s+getLocationId(a[i].getAttribute("href")) + ','
            }

            let items = s.split(",");
            items.sort();

            return items.join(",");
        }else{return null}

  }
  catch(err) {
  alert(err.message + ' listServices()');
 }

}

/**************************************************************************/

function getFirstService(d)
{
    try{
        var el=d.getElementsByClassName('servicelist');
        var retval=''
        if(el.length>0)
        {
            var a=el[0].getElementsByTagName('a');
            if(a.length>0)
            {
               retval=a[0].getAttribute("href")
            }

            return retval
        }else{return null}

  }
  catch(err) {
  alert(err.message + ' getFirstService()');
 }

}

/**************************************************************************/

function getNeighbouringLocations(checkUrl)
{
    try{
        GM_xmlhttpRequest({
                method: "GET",
                url: checkUrl,
                onload: function(response) {
                    const html = response.responseText;
                    // You can now parse and manipulate this HTML
                    console.log("Fetched content:", html);

                    // Example: extract the row containing "Whalley"
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");

                    getNextLocs(doc)

                }
                });

  }
  catch(err) {
  alert(err.message + '  getNeighbouringLocations');
 }
}


/***************************************************************/
function getLocationId(u) {
  const match = u.match(/gb-nr:([^/?]+)/);
  return match ? match[1] : null;
}


/***************************************************************/

function getNextLocs(d)
{try{
    var loc=GM_getValue('loc',null)
    var locationlist=d.getElementsByClassName('locationlist')
    if(locationlist.length==1){

    var row=locationlist[0].getElementsByTagName('a')

    if(row.length>0){

        for(var i=0;i<row.length;i++)
        {
            if(getLocationId(row[i].getAttribute("href"))==loc)
            {
                if(row[i-1]){
                    //Might be the first loaction on the service page
                    previousLocation = getLocationId(row[i-1].getAttribute("href"))
                }
                if(row[i+1]){
                    //Might be the last location on the service page
                    nextLocation = getLocationId(row[i+1].getAttribute("href"))
                }

                GM_setValue('previousLocation',previousLocation)
                GM_setValue('nextLocation',nextLocation)
               // alert(previousLocation + '-' + loc + '-' + nextLocation)


                //These have to be included here because we have to wait until the location infor has been picked out
                if(!!previousLocation)
                {addLinkToSearchPage(previousLocation)}

                 if(!!nextLocation)
                {addLinkToSearchPage(nextLocation)}

                return
            }
        }
    }
}
 }
  catch(err) {
  alert(err.message + '   getNextLocs');
 }
}

/***************************************************************/
 function rtt_showAutoCompleteLink()
{
var filter_show=document.getElementById('filter-show')
    if(filter_show){
        var currentState='enabled'

        if(fsb==true){currentState='disabled'}

        const containerDiv = document.createElement('div');
        containerDiv.id='divfsb'
       var link = document.createElement('a');
       var linkText = document.createTextNode('Toggle search box autocomplete: ' + currentState );
       link.id='fsb'
       link.appendChild(linkText);
       link.title = 'Toggle search box autocomplete'
       //link.href='#';
       //a.addEventListener('click', checkLocs, false);

        link.addEventListener('click', toggleAutocomplete)


        // Style it to be left-aligned
        link.style.display = 'block'; // Makes it a block element
        link.style.textAlign = 'left'; // Aligns text to the left
        //a.style.marginBottom = '10px';   // Optional spacing
        containerDiv.appendChild(link);
       filter_show.insertBefore(containerDiv, filter_show.firstChild);
    }

    }
/***************************************************************/
function toggleAutocomplete()
{try{
    fsb=!fsb
     var currentState='enabled'
       if(fsb==true){currentState='disabled'}
    document.getElementById('fsb').textContent ='Toggle search box autocomplete: ' + currentState

    GM_setValue('fsb',fsb)
    location.reload();
}
  catch(err) {
  alert(err.message + ' toggleAutocomplete');
 }

}
/***************************************************************/
function addLinkToSearchPage(loc){
/* create a new hyperlink on the new change page */
try{

    var filter_show=document.getElementById('filter-show')
    if(filter_show){

        const containerDiv = document.createElement('div');
        containerDiv.id=loc
       var link = document.createElement('a');
       var linkText = document.createTextNode('Compare service count to ' + loc);
       link.appendChild(linkText);
        link.id='compare'+loc
       link.title = 'Compare service count to ' + loc
       //link.href='#';
       //a.addEventListener('click', checkLocs, false);

        link.addEventListener('click', function(event) {
            checkLocs(loc, event);
        });

        // Style it to be left-aligned
        link.style.display = 'block'; // Makes it a block element
        link.style.textAlign = 'left'; // Aligns text to the left
        //a.style.marginBottom = '10px';   // Optional spacing
        containerDiv.appendChild(link);

        // add link to open page
        link = document.createElement('a');
       linkText = document.createTextNode('View services for ' + loc);
       link.appendChild(linkText);
       link.title = 'View services for ' + loc
       link.href=url.replace(GM_getValue('loc',null),loc);
       //a.addEventListener('click', checkLocs, false);
        var sp =document.createTextNode(' ');

        link.style.display = 'block'; // Makes it a block element
        link.style.textAlign = 'left'; // Aligns text to the left

        containerDiv.appendChild(sp);
        containerDiv.appendChild(link);


    filter_show.insertBefore(containerDiv, filter_show.firstChild);
    }

 }
  catch(err) {
  alert(err.message);
 }

}

/***************************************************************/
function checkLocs(checkLocation){
 try{
    //alert('check ' + checkLocation)
const compareLinkText = document.getElementById('compare'+checkLocation).textContent
document.getElementById('compare'+checkLocation).textContent = compareLinkText + ' loading...'

    // this is the row count of the current location
    var retval=countRows(document)

    if(retval!==null)
    {


        const loc=getLocationId(url)

       // alert(loc+ ' ' + checkLocation)

        currentLocationCount=retval

        var chkDiv=document.getElementById(checkLocation)
        var newtext=''
            locAServiceList=listServices(document)

            //alert(retval)
            const checkUrl = url.replace(loc,checkLocation)
            //alert(checkUrl)

            GM_xmlhttpRequest({
                method: "GET",
                url: checkUrl,
                onload: function(response) {
                    const html = response.responseText;
                    // You can now parse and manipulate this HTML
                    console.log("Fetched content:", html);

                    // Example: extract the row containing "Whalley"
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");

                    retval=countRows(doc)
                    if(retval!==null)
                    {//alert(retval)
                        checkLocationCount=retval
                        locBServiceList=listServices(doc)

                        newtext = loc + ': ' + currentLocationCount + ' '+ checkLocation +' '+ checkLocationCount
                        if(locAServiceList!=locBServiceList)
                        {
                            newtext = newtext +' **Service lists differ** '

                            // Step 2: Convert to Sets
                            const set1 = new Set(locAServiceList.split(','));
                            const set2 = new Set(locBServiceList.split(','));

                            // Step 3: Find unique words
                            const onlyInStr1 = [...set1].filter(word => !set2.has(word));
                            const onlyInStr2 = [...set2].filter(word => !set1.has(word));
                            if(onlyInStr1.length>0){
                             newtext = newtext + onlyInStr1 + ' only in ' + loc + ' '
                                highlightServices(onlyInStr1)
                            }
                            if(onlyInStr2.length>0){
                                newtext = newtext + onlyInStr2 + ' only in ' + checkLocation
                                highlightServices(onlyInStr2)
                            }
                        }

                        const textNode = document.createTextNode(newtext);
                        //textNode.style.display = 'block'; // Makes it a block element
                        //textNode.style.textAlign
                        chkDiv.appendChild(textNode);

                        document.getElementById('compare'+checkLocation).textContent = compareLinkText
                    }
                }
            });

        }
//

 }
  catch(err) {
  alert(err.message);
 }

}
/************************************************************************************************/
function highlightServices(codelist)
{try{var s=''
        var el=document.getElementsByClassName('servicelist');
        if(el.length>0)
        {
            var a=el[0].getElementsByTagName('a');
            for(var i = 0;i<a.length;i++)
            {
               s=getLocationId(a[i].getAttribute("href"))
                if(codelist.indexOf(s)>-1)
                {
                  a[i].style.backgroundColor = 'yellow';
                }
            }

    }


  }
  catch(err) {
  alert(err.message + ' highlightSerices()');
 }

}


/*******************************************************/
function rtt_createMenuButton()
{try{

    var menu=document.getElementsByClassName('menu');
        //alert(menu.length)
        if(menu[0]!=null)
        {
            var li = document.createElement('li');
            var link=document.createElement('a');
            var linkText = document.createTextNode('Extras');
            link.appendChild(linkText);
            link.title='Extras'
            //link.href='';
            li.addEventListener('click', rtt_toggleExtras, false);
            li.appendChild(link)
            menu[0].appendChild(li)

        }
}
  catch(err) {
  alert(err.message + '  rtt_createMenuButton()');
 }
}

/*******************************************************/
function fixSearchBox()
{
    try{
const delay = 500; // delay in ms
  const input = document.querySelector('#mainlocsearch');
  if (!input) return;

  // Prevent existing Typeahead from triggering
  input.removeAttribute('typeahead');

  // Clone the input to remove bound events
  const clone = input.cloneNode(true);
  input.parentNode.replaceChild(clone, input);

    clone.addEventListener('focus', function () {
    this.value = '';
});

}
  catch(err) {
  alert(err.message + ' rtt_fix search');
 }
}

