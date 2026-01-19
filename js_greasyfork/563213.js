// ==UserScript==
// @name         GC Reverse Geocache Decoder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Decodes 'Reverse Geocache' Wherigos
// @author       delta68_geo@yahoo.co.uk
// @match        https://www.geocaching.com/geocache/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563213/GC%20Reverse%20Geocache%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/563213/GC%20Reverse%20Geocache%20Decoder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //if the co-ordinates are already corrected, don't bother doing anything else
    var strBody=document.body.innerHTML;
    if(strBody.split("icon-correctedcoords").length<3)
    {

        strBody = document.getElementById('ctl00_ContentBody_LongDescription').innerHTML;
        // alert(strBody);

        //see if cache page contains link for reverse geocahce cartidge
        if(strBody.indexOf('dcdcd2ff-c171-4487-93bc-678f6d03ac4f')>0)
        {
            //alert('Reverse Wherigo');
            var strCacheNote=document.getElementById('viewCacheNote').innerHTML;
            var retval=findCodeNumbers(strCacheNote)

            if(retval.indexOf('NaN')>0)
            {// no valid numbers in the cache note so try the long description
                //strBody = document.getElementById('viewCacheNote').innerHTML;

                //this image sometimes get picked up as a valid code number
                //68228390-fa50-42d4-a9ef-d18d906c8c3a.jpg
                strBody=strBody.replace('68228390-fa50-42d4-a9ef-d18d906c8c3a.jpg', '');

                retval=findCodeNumbers(strBody);
                if(retval.indexOf('NaN')>0)
                {
                    alert('GC Reverse Geocache Decoder\n\nNo usable codes found');
                }else{
                    alert(retval);
                }
                //alert(findCodeNumbers(strBody));
            }else{
                alert(retval);
            }
        }else{
            //    alert('Some other cache');
        }
    }else{
            //alert('Coordinates already updated');
    }



})();
function findCodeNumbers(strin) {

var s ='';
var nextChar ='';
var n = new Array(3);
var j =0;
var strTemp = strin + ' '; //append a space just to be sure

    for(var i = 0; i<= strin.length;i++)
    {
        s = strTemp.substring(i, i+6);
        // alert(s + ' ' + i);
        if(myIsNumeric(s)==true)
        {//alert('true');
            //see what next char is
            nextChar = strTemp.substring(i + 6, i + 7);
            if(myIsNumeric(nextChar)==true)
            {
                //not a code number as there's more than six digts
            }else{
                //alert(s);
                n[j] = s;
                j++;
                if(j == 3){break;}

            }
        }
    }
//alert(retval);
//alert(n[0] + ',' + n[1] + ',' + n[2]);
return code2LatLong(n[0],n[1],n[2]);
}
/*****************************************/

function myIsNumeric(strin)
{
   // alert(strin);
var c ='';
var retval = true;
for(var i = 0;i<strin.length;i++)
{
    c = strin.substring(i, 1+i);
    //alert(c);
    switch(c)
    {
    case '1':break;
case '2':break;
case '3':break;
case '4':break;
case '5':break;
case '6':break;
case '7':break;
case '8':break;
case '9':break;
case '0':break;
  default:
        retval = false;
    }
}
  // alert(retval);
return retval;

}

function code2LatLong(varA, varB, varC)
{
var varLatVorz =0;
var varLongVorz =0;
var varLatKOMP;
var varLongKOMP;

  if((varA % 1000 - varA % 100) / 100 == 1){
    varLatVorz = 1;
    varLongVorz = 1;
  }else if ((varA % 1000 - varA % 100) / 100 == 2){
    varLatVorz = -1;
    varLongVorz = 1;
  }else if ((varA % 1000 - varA % 100) / 100 == 3){
    varLatVorz = 1;
    varLongVorz = -1;
  }else if ((varA % 1000 - varA % 100) / 100 ==4){
    varLatVorz = -1;
    varLongVorz = -1;
  }

  if(((varC % 100000 - varC % 10000) / 10000 + (varC % 100 - varC % 10) / 10) % 2 == 0){
    varLatKOMP = Number(varLatVorz * ((varA % 10000 - varA % 1000) / 1000 * 10 + (varB % 100 - varB % 10) / 10 + (varB % 100000 - varB % 10000) / 10000 * 0.1 + (varC % 1000 - varC % 100) / 100 * 0.01 + (varA % 1000000 - varA % 100000) / 100000 * 0.001 + (varC % 100 - varC % 10) / 10 * 0.0001 + (varA % 10) * 0.00001));
  }else if(((varC % 100000 - varC % 10000) / 10000 + (varC % 100 - varC % 10) / 10) % 2 != 0){
    varLatKOMP = Number(varLatVorz * ((varB % 1000000 - varB % 100000) / 100000 * 10 + varA % 10 + (varA % 10000 - varA % 1000) / 1000 * 0.1 + (varC % 1000000 - varC % 100000) / 100000 * 0.01 + (varC % 1000 - varC % 100) / 100 * 0.001 + (varC % 100 - varC % 10) / 10 * 0.0001 + (varA % 1000000 - varA % 100000) / 100000 * 0.00001));
  }

  if(((varC % 100000 - varC % 10000) / 10000 + (varC % 100 - varC % 10) / 10) % 2 == 0){
    varLongKOMP = Number(varLongVorz * ((varA % 100000 - varA % 10000) / 10000 * 100 + (varC % 1000000 - varC % 100000) / 100000 * 10 + varC % 10 + (varB % 1000 - varB % 100) / 100 * 0.1 + (varB % 1000000 - varB % 100000) / 100000 * 0.01 + (varA % 100 - varA % 10) / 10 * 0.001 + (varC % 100000 - varC % 10000) / 10000 * 0.0001 + (varB % 10) * 0.00001));
  }else if(((varC % 100000 - varC % 10000) / 10000 + (varC % 100 - varC % 10) / 10) % 2 != 0){
    varLongKOMP = Number(varLongVorz * (((varB % 100) - (varB % 10)) / 10 * 100 + (varC % 10) * 10 + ((varA % 100) - (varA % 10)) / 10 + ((varA % 100000) - (varA % 10000)) / 10000 * 0.1 + ((varB % 1000) - (varB % 100)) / 100 * 0.01 + (varB % 10) * 0.001 + ((varC % 100000) - (varC % 10000)) / 10000 * 0.0001 + ((varB % 100000) - (varB % 10000)) / 10000 * 0.00001));
  }

return decimal_minutes(varLatKOMP,'lat') + ',' + decimal_minutes(varLongKOMP,'lon');
}


function decimal_minutes(din, latlon)
{
  var s = Math.abs(din);
  var deg = Math.floor(s);
  var m = Math.floor((s - deg) * 60 * 1000) / 1000;
  var nsew = "";
  if(latlon == "lat")
  {
    nsew = "N";
    if(din < 0){
        nsew = "S";
    }
   } else{
    nsew = "E";
    if(din < 0){
      nsew = "W";
    }
  }
  return nsew + deg + " " + m;
}

