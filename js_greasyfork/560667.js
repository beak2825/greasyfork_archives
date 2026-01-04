// ==UserScript==
// @name        Warranty Filter For diskprices.com
// @namespace   EliotScripts
// @match       https://diskprices.com/*
// @license     MIT
// @grant       none
// @version     1.0
// @author      -
// @description 29/12/2025, 09:32:52
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/560667/Warranty%20Filter%20For%20diskpricescom.user.js
// @updateURL https://update.greasyfork.org/scripts/560667/Warranty%20Filter%20For%20diskpricescom.meta.js
// ==/UserScript==

const HtmlWarranty = '<fieldset id="Warranty" data-warr-checked="false"><legend><label><input type="checkbox" data-category="warranty">Warranty</label></legend><label id="LblWarrMin">Min<select name="WarrantyMin" id="WarrantyMin" disabled><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></label><label id="LblWarrMin">Max<select name="WarrantyMax" id="WarrantyMax" disabled><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5" selected>5</option></select></label></fieldset>';
const CssWarranty = '<style id="CssWarranty">fieldset#Warranty > input, fieldset#Warranty > label, fieldset#Warranty > select {display: inline-block;}.WarrantyNoDisp{display:none;}</style>';
$('div#filters > fieldset.capacity').after( CssWarranty );
$('div#filters > style#CssWarranty').after( HtmlWarranty );

$('table > tbody#diskprices-body > tr.disk > td:nth-of-type(5)').addClass('DskWarr').attr({'data-haswarr':false,'data-hasspace':false,'data-hasy':false,'data-wartxtlw':'','data-waryrs':0});

$('.DskWarr:contains("1"),.DskWarr:contains("2"),.DskWarr:contains("3"),.DskWarr:contains("4"),.DskWarr:contains("5"),.DskWarr:contains("6"),.DskWarr:contains("7"),.DskWarr:contains("8"),.DskWarr:contains("9"),.DskWarr:contains("0")').attr('data-haswarr',true);
$('.DskWarr:contains(" ")').attr('data-hasspace',true);
$('.DskWarr:contains("y"),.DskWarr:contains("Y")').attr('data-hasy',true);
$('.DskWarr[data-haswarr=true]').each(function(){
  let WarTxty = $(this).text().trim().toLowerCase();
  $(this).attr('data-wartxtlw',WarTxty)
});
$('.DskWarr[data-haswarr=true][data-hasspace=true]').each(function(){
  let DaWrYrInt = parseInt($(this).attr('data-wartxtlw').split(' ',1));
  $(this).attr('data-waryrs',DaWrYrInt);
});
$('.DskWarr[data-haswarr=true][data-hasspace=false][data-hasy=true]').each(function(){
  let DaWrYrInt = parseInt($(this).attr('data-wartxtlw').split('y',1));
  $(this).attr('data-waryrs',DaWrYrInt);
});
$('.DskWarr[data-haswarr=true][data-waryrs!=0]').each(function(){
  let DaWrYrInt = parseInt($(this).attr('data-waryrs'));
  $(this).closest('tr').addClass('Warranty').attr('data-warr',DaWrYrInt).data('WarrantyInt',DaWrYrInt);
});
$('.DskWarr[data-haswarr=false]').each(function(){
  $(this).closest('tr').addClass('WarrantyNone').data('WarrantyInt',0);
});

$( 'fieldset#Warranty > legend > label > input[type="checkbox"][data-category="warranty"]' ).on( 'change', function() {
  if(this.checked){
    $('fieldset#Warranty').attr('data-warr-checked','true');
    $('table#diskprices > tbody#diskprices-body > tr.WarrantyNone').addClass('WarrantyNoDisp');
    $('select#WarrantyMin,select#WarrantyMax').prop('disabled',false);
    let WarrantyValMax = $('select#WarrantyMax').val();
    let WarrantyValMin = $('select#WarrantyMin').val();
    FilterByWarrantyVal(WarrantyValMin,WarrantyValMax);
  }
  else{
    $('fieldset#Warranty').attr('data-warr-checked','false');
    $('table#diskprices > tbody#diskprices-body > tr.WarrantyNone,table#diskprices > tbody#diskprices-body > tr.Warranty').removeClass('WarrantyNoDisp');
    $('select#WarrantyMin, select#WarrantyMax').prop('disabled',true);
  };
} );

$( 'fieldset#Warranty > label#LblWarrMin > select#WarrantyMin' ).on( 'change', function() {
  let WarrantyValMin = parseInt($(this).val());
  let WarrantyValMax = parseInt($('select#WarrantyMax').val());
  console.log('MinChange Initial Max: '+WarrantyValMax);
  if ( WarrantyValMax < WarrantyValMin ) {
    $('select#WarrantyMax').val(WarrantyValMin);
    WarrantyValMax = parseInt($('select#WarrantyMax').val());
  };
  FilterByWarrantyVal(WarrantyValMin,WarrantyValMax);
} );
$( 'fieldset#Warranty > label > select#WarrantyMax' ).on( 'change', function() {
  let WarrantyValMax = $(this).val();
  let WarrantyValMin = $('select#WarrantyMin').val();
  if ( WarrantyValMin > WarrantyValMax ) {
    $('select#WarrantyMin').val(WarrantyValMax);
    WarrantyValMin = parseInt($('select#WarrantyMin').val());
  };
  FilterByWarrantyVal(WarrantyValMin,WarrantyValMax);
} );
function FilterByWarrantyVal (WarrMin,WarrMax) {
  console.log('FILTERING!!!');
  let MatchyVal = WarrMin == WarrMax;
  $('table#diskprices > tbody#diskprices-body > tr.Warranty').addClass('WarrantyNoDisp');
  if ( MatchyVal ) {
    console.log('FILTERING ON: '+WarrMin);
    $('table#diskprices > tbody#diskprices-body > tr.Warranty').filter('[data-warr="'+WarrMin+'"]').removeClass('WarrantyNoDisp');
  } else {
    console.log('FILTERING ON MIN '+WarrMin+' AND MAX '+WarrMax);
    $('table#diskprices > tbody#diskprices-body > tr.Warranty').filter(function() {
      return $(this).data('WarrantyInt') >= WarrMin && $(this).data('WarrantyInt') <= WarrMax ;
    }).removeClass('WarrantyNoDisp');
  };
};