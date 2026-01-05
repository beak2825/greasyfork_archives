// ==UserScript==
// @name        HKO overlay
// @description Add overlay to HKO
// @namespace   NoNameSpace
// @include     *://www.hko.gov.hk/*
// @include     *://www.weather.gov.hk/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant GM_info 
// @grant GM_deleteValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_addStyle
// @grant GM_log
// @grant GM_openInTab
// @grant GM_registerMenuCommand
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @grant unsafeWindow

// @version 1.1.2
// @downloadURL https://update.greasyfork.org/scripts/9923/HKO%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/9923/HKO%20overlay.meta.js
// ==/UserScript==

$("body").append (
      '<div id="gmLayerWrapper1" align="left">'
	+ '<table width="100%" border="0" align="left" cellpadding="0" cellspacing="0">'
	+ '<tr>'
	+ '<td align="left" valign="top">'
	+ '中環碼頭向東(11)<br/>'
	+ '<img src="https://www.hko.gov.hk/wxinfo/aws/hko_mica/cp1/latest_CP1.jpg" width="400"></img><br/><br/>'
	+ '尖沙咀天文台總部向東(10)<br/>'
	+ '<img src="https://www.hko.gov.hk/wxinfo/aws/hko_mica/hko/latest_HKO.jpg" width="400"></img><br/><br/>'
	+ '尖沙咀天文台總部向西(9)<br/>'
	+ '<img src="https://www.hko.gov.hk/wxinfo/aws/hko_mica/hk2/latest_HK2.jpg" width="400"></img><br/><br/>'
  + '九龍城(8)<br/>'
  + '<img src="https://www.hko.gov.hk/wxinfo/aws/hko_mica/klt/latest_KLT.jpg" width="400"></img><br/><br/>'
	//+ '<img src="https://www.hko.gov.hk/wxinfo/aws/hko_mica/gsi/latest_GSI.jpg" width="300"></img>'
	+ '</td>'
	+ '</tr>'
	+ '</table>'
	+ '</div>'
	+ '<div id="gmLayerWrapper2" align="right">'
	+ '<table width="100%" border="0" align="right" cellpadding="0" cellspacing="0">'
	+ '<tr>'
	+ '<td align="right" valign="top">'
	+ '<img src="https://pda.weather.gov.hk/radar/rad_064_320/rad064_6.jpg" width="400"></img><br/>'
	+ '<img src="https://pda.weather.gov.hk/TC_HK_CG.jpg" width="400"></img><br/>'
	+ '<img src="https://pda.weather.gov.hk/mtsate/MTSAT1RIR/mtsat_6.jpg" width="400"></img><br/>'
	+ '<img src="https://pda.weather.gov.hk/tcpos_orig.jpg" width="400"></img>'
	+ '</td>'
	+ '</tr>'
	+ '</table>'
	+ '</div>'
);

$("#gmLayerWrapper1").width  ( 400 )
                    .height ( 100 )
                    ;
$("#gmLayerWrapper2").width  ( 400 )
                    .height ( 100 )
                    ;

GM_addStyle ("#gmLayerWrapper1 { "+
"  margin-top:    10px; "+
"  margin-bottom: 0px; "+
"  margin-right:  0px; "+
"  margin-left:   10px; "+
"  padding:       0; "+
"  position:      absolute; "+
"  top:           0; "+
"  left:         0; "+
"  min-width:     300px; "+
"  z-index:       -1; "+
"} ");

GM_addStyle ("#gmLayerWrapper2 { "+
"  margin-top:    10px; "+
"  margin-bottom: 0px; "+
"  margin-right:  10px; "+
"  margin-left:   0px; "+
"  padding:       0; "+
"  position:      absolute; "+
"  top:           0; "+
"  right:         0; "+
"  min-width:     300px; "+
"  z-index:       -1; "+
"} ");

GM_xmlhttpRequest({
  method: "GET",
  url: "http://www.aqhi.gov.hk/tc.html",
  headers: {
    //"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
    "Accept": "text/xml"            // If not specified, browser defaults will be used.
  },
  onload: function(response) {
    var $response = $(response.responseText);
    var table = $response.find("table#tblCurrAQHI").addClass('apitable-class');
    $("#gmLayerWrapper2").append(table);
  }
});

GM_addStyle ("\
#tblCurrAQHI {color:#333333;width:100%;border-width: 1px;border-color: #729ea5;border-collapse: collapse;}\
#tblCurrAQHI th {background-color:#acc8cc;border-width: 1px;border-style: solid;border-color: #729ea5;text-align:left;}\
#tblCurrAQHI tr {background-color:#ffffff;}\
#tblCurrAQHI td {border-width: 1px;border-style: solid;border-color: #729ea5;}\
#tblCurrAQHI tr:hover {background-color:#ffff99;}\
");