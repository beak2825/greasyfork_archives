// ==UserScript==
// @name        ValidatorReportProcessor
// @description Created Code to be pasted into Validator Processor SK by SuperMedic
// @namespace   com.supermedic.validatorReportProcessor
// @include     file:*WME*Validator*Report*
// @version     0.1.0SK
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/7142/ValidatorReportProcessor.user.js
// @updateURL https://update.greasyfork.org/scripts/7142/ValidatorReportProcessor.meta.js
// ==/UserScript==


function init() {
  $('[target="Validator"]').each(processURL)
  console.info(JSON.stringify(ret));
  $('body').prepend($('<textarea>').val(JSON.stringify(ret)).css('width','850px').css('height','200px'));
}

function processURL() {
  var url = $(this).attr('href');
  var parts = url.split('?');
  var args = parts[1].split('&');
  var obj = {};
  for(var i in args) {
    var sep = args[i].split('=');
    obj[sep[0]] = sep[1];
  }
  console.info(obj);
  ret.push(obj);
}

var ret = []

$().ready(init);
