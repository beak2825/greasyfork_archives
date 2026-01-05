// ==UserScript==
// @name         WME Change RUS NameStreet
// @version      0.10
// @description  Замена ул на улица и т.д при вставке в поле ввода.
// @author       ixxvivxxi
// @include      https://*.waze.com/editor*
// @include      https://*.waze.com/*/editor*
// @grant        none
// @namespace    https://greasyfork.org/scripts/8903-WME-rus-name-street
// @downloadURL https://update.greasyfork.org/scripts/8903/WME%20Change%20RUS%20NameStreet.user.js
// @updateURL https://update.greasyfork.org/scripts/8903/WME%20Change%20RUS%20NameStreet.meta.js
// ==/UserScript==

function replace_status(streetname) {
  streetname = streetname.replace('ул.', 'улица')
                .replace(/^ул[ ]/, 'улица ')
                .replace(/[ ]ул$/, ' улица')
                .replace('пер.', 'переулок')
                .replace(/^пер[ ]/, 'переулок ')
                .replace(/[ ]пер$/, ' переулок')
                .replace('просп.', 'проспект')
                .replace(/^просп[ ]/, 'проспект ')
                .replace(/[ ]просп$/, ' проспект')
                .replace('пр-т.', 'проспект')
                .replace(/^пр-т[ ]/, 'проспект ')
                .replace(/[ ]пр-т$/, ' проспект')
                .replace('пр-д.', 'проезд')
                .replace(/^пр-д[ ]/, 'проезд ')
                .replace(/[ ]пр-д/, ' проезд')
                .replace('пл.', 'площадь')
                .replace(/^пл[ ]/, 'площадь ')
                .replace(/[ ]пл$/, ' площадь')
                .replace('ш.', 'шоссе')
                .replace(/^б-р[ ]/, 'бульвар ')
                .replace(/[ ]б-р$/, ' бульвар');
  //streetname = streetname.trim(); 
  
    
  streetname = streetname.replace(/^улица(?=[0-9а-яА-Я])/, 'улица ')
                .replace(/^переулок(?=[0-9а-яА-Я])/, 'переулок ')
                .replace(/^проспект(?=[0-9а-яА-Я])/, 'проспект ')
                .replace(/^проезд(?=[0-9а-яА-Я])/, 'проезд ')
                .replace(/^площадь(?=[0-9а-яА-Я])/, 'площадь ')
                .replace(/^шоссе(?=[0-9а-яА-Я])/, 'шоссе ')
                .replace(/^бульвар(?=[0-9а-яА-Я])/, 'бульвар ')
                .replace(/(?=[0-9а-яА-Я])улица$/, ' улица')
                .replace(/(?=[0-9а-яА-Я])переулок$/, ' переулок')
                .replace(/(?=[0-9а-яА-Я])проспект$/, ' проспект')
                .replace(/(?=[0-9а-яА-Я])проезд$/, ' проезд')
                .replace(/(?=[0-9а-яА-Я])площадь$/, ' площадь')
                .replace(/(?=[0-9а-яА-Я])шоссе$/, ' шоссе')
                .replace(/(?=[0-9а-яА-Я])бульвар$/, ' бульвар');
  streetname = streetname.replace(/^[ ](?=[0-9а-яА-Я])/, '').replace(/[ ]+/g, ' ');
  
  return streetname;
}

function correct_adjectives(streetname) {
  $('.a_replace_name_street').remove();
  var lastchars = streetname.substring(streetname.length-2);
      
  if (lastchars == 'ая' || lastchars == 'ый'|| lastchars == 'ий' || lastchars == 'яя') {
    var arr_words = streetname.split(" ");
      if (arr_words.length > 1) {
        var firstword = arr_words[0];
    
        streetname = streetname.replace(firstword + ' ', '');
        streetname = streetname + ' ' + firstword;
        $('#sidebar .primary-street').append('<div class="a_replace_name_street" style="color:red;font-weight:bold">Возможно: <a id="a_replace_name_street" href="#" streetname="' + streetname + '">' + streetname + '</a></div>');
      }
   }
}

$('#sidebar').on('input', '.street-name', function() {
  var newstr = replace_status($(this).val());
  if ($(this).val() != newstr) {
     $(this).val(newstr);
  }
  correct_adjectives($(this).val());
});

$('#sidebar').on('change', '.street-name', function() {
  var newstr = replace_status($(this).val());
  if ($(this).val() != newstr) {
     $(this).val(newstr);
  }
  correct_adjectives($(this).val());
});

$('#sidebar').on('focus', '.street-name', function() {
  var newstr = replace_status($(this).val());
  if ($(this).val() != newstr) {
     $(this).val(newstr);
  }
  correct_adjectives($(this).val());
});

$('#sidebar').on('focusout', '.street-name', function() {
  var newstr = replace_status($(this).val());
  if ($(this).val() != newstr) {
     $(this).val(newstr);
  }
  correct_adjectives($(this).val());
});