// ==UserScript==
// @name        iks: virtonomica управление страницы
// @namespace   virtonomica
// @description Дублирование номеров страниц, а так-же на персонале позволяет выставить точный процент до сотых долей
// @include     http*://*virtonomic*.*/*/main/company/view/*/unit_list/*
// @version     1.23
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9463/iks%3A%20virtonomica%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/9463/iks%3A%20virtonomica%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B.meta.js
// ==/UserScript==

var run = function() {
  $("div#mainContent > form > table.list > tbody").prepend('<tr><td colspan="12"><table cellspacing="0" class="paging">'
                                                           + $('div#mainContent > form > table.list > tbody > tr > td[colspan="12"]').html()
                                                           + '</table></td></tr>');
  if(window.location.href.indexOf('/unit_list/employee') + 1 ) {
      $("div#mainContent > form > table > tbody > tr > td > fieldset > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > span#selectedPercent").detach();
      $('div#mainContent > form > table > tbody > tr > td > fieldset > table > tbody > tr > td > table > tbody > tr > td:nth-child(2)').prepend('<input type="text" value="100.00" id="selectedPercent" style="width: 50px; text-align:right" />');
      $('#selectedPercent').bind("change keyup input click", function() {
          var num = parseFloat(this.value).toFixed(2);
          if(num >1000) num = 1000;
          $(this).val( num );
          $('#selectedPercent_input').val(num);
          $('div#salarySlider > a').attr('style', 'left: '+(num/10)+'%;').click();
      });
      
      $('div#mainContent > form > table > tbody > tr > td:nth-child(1) > fieldset > table > tbody').prepend('<tr>'
           +'<td><input class="button130" type="button" id="markStringTable" value="Отметить все"></input>'
           +'</td><td>от <input type="text" value="0" id="aPercent" style="width: 50px; text-align:right; border-color: blue" onkeyup="this.value=parseFloat(this.value).toFixed(2)" /> % '
           +'до <input type="text" value="1000" id="bPercent" style="width: 50px; text-align:right; border-color: #fff" onkeyup="this.value=parseFloat(this.value).toFixed(2)" /> % зарплаты от средней по городу<td><tr>');
      
      pNum = 1;
      $('div#mainContent > form > table.list > tbody > tr > td.nowrap > span').each(function() {
          $(this).css('cursor', 'pointer');
          $(this).click(function() {
              var n = parseFloat( $(this).html() ).toFixed(2);
              switch (pNum) {
                  case 1:
                      pNum++;
                      $('#aPercent').css('border-color', '#fff');
                      $('#bPercent').css('border-color', 'blue');
                      $('#selectedPercent').css('border-color', '#fff');
                      $('#aPercent').val(n);
                      break;
                  case 2:
                      pNum++;
                      $('#aPercent').css('border-color', '#fff');
                      $('#bPercent').css('border-color', '#fff');
                      $('#selectedPercent').css('border-color', 'blue');
                      $('#bPercent').val(n);
                      break;
                  default:
                      pNum = 1;
                      $('#aPercent').css('border-color', 'blue');
                      $('#bPercent').css('border-color', '#fff');
                      $('#selectedPercent').css('border-color', '#fff');
                      $('#selectedPercent').val(n);
                      $('#selectedPercent_input').val(n);
                      $('div#salarySlider > a').attr('style', 'left: '+(n/10)+'%;').click();
              }
          });
      });
      
      $('#markStringTable').click(function() {
          n1 = parseFloat( $('#aPercent').val() );
          n2 = parseFloat( $('#bPercent').val() );
          if(n1 > n2) {
              $('#aPercent').val(n2);
              $('#bPercent').val(n1);
              n1 = n2;
              n2 = parseFloat( $('#bPercent').val() );
          }
          $('div#mainContent > form > table.list > tbody > tr').each(function() {
              var n = parseFloat( $(this).find('td.nowrap > span').html() );
              if(n >= n1 && n <= n2 ) {
                  $(this).find('td > input:checkbox').prop('checked','checked');
                  $('input.buttonDisabled130').each(function() {
                      $(this).attr('class', 'button130');
                      $(this).prop('disabled', false);
                  });
              }
          });
      });
  }
}


if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}