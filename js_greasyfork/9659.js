// ==UserScript==
// @name        iks: virtonomica покупка. Смешиватель.
// @namespace   virtonomica
// @description Расчитывает нужное качество из двух представленых вариантов, так-же можно сделать заказ со всех своих юнитов
// @include     http*://*virtonomic*.*/*/window/unit/equipment/*
// @include     http*://*virtonomic*.*/*/window/unit/supply/create/*/step2*
// @version     1.25
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9659/iks%3A%20virtonomica%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%A1%D0%BC%D0%B5%D1%88%D0%B8%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/9659/iks%3A%20virtonomica%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%A1%D0%BC%D0%B5%D1%88%D0%B8%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C.meta.js
// ==/UserScript==

var strCss = '.blendingTable{ width:100%; text-align:left; background-color: #EEE; border-collapse: collapse }'
            +' .blendingTable th{ border:2px solid #fff }'
            +' .blendingTable input{ width: 100px; text-align:right; float:right }'
            +' .blendingTable span{ float:right }'
            +' .blendingTableBlue{ border-color: blue }'
            +' .w100{ width: 100% }';

var run = function()
{
  var p = ( ( window.location.href.indexOf('supply/create') + 1 ) ? 'goods' : 'rig' ),
      val = {
        'goods': 'div#supply_content > table > tbody > tr.wborder > td:nth-child(8).supply_data',
        'rig': 'div.content > table#mainTable.list.main_table > tbody > tr > td:nth-child(9).digits'
      },
      work = function() {
        // Требуемое
        kol_t = parseFloat( $('#quantityCorner').val().replace(/\$/g, '') );
        kach_t = parseFloat( $('#topRightQuality').val() );
        // В наличии
        kol_n = parseFloat( $('#quantityCorner1').val().replace(/\$/g, '') );
        kach_n = parseFloat( $('#topRightQuality1').val().replace(/\$/g, '') );
        // Продавцы
        kach_p1 = parseFloat( $('#topRightQuality2').val().replace(/\$/g, '') );
        kach_p2 = parseFloat( $('#topRightQuality3').val().replace(/\$/g, '') );
      
        n = (kol_t * ( kach_t - kach_p1 ) - kol_n * ( kach_n - kach_p1 ) ) / ( kach_p2 - kach_p1 );
        if(!n || n == 'Infinity')  n = 0;
        $('#quantityCorner3').html(n.toFixed(1));
      
        n = ( kol_t * ( kach_t - kach_p2 ) - kol_n * ( kach_n - kach_p2 ) ) / ( kach_p1 - kach_p2 );
        if(!n || n == 'Infinity')  n = 0;
        $('#quantityCorner2').html(n.toFixed(1));
      },
      str = '<table class="blendingTable" cellpadding="4"><tr style="text-align:center">'
             +'<th></th>'
             +'<th>Требуемое</th>'
             +'<th>В наличии</th>'
             +'<th>Продавец 1</th>'
             +'<th>Продавец 2</th>'
           +'</tr><tr>'
             +'<th style="text-align:left">Количество:</th>'
             +'<th><input type="text" value="0" id="quantityCorner" /></th>'
             +'<th><input type="text" value="0" id="quantityCorner1" /></th>'
             +'<th><span id="quantityCorner2">0</span></th>'
             +'<th><span id="quantityCorner3">0</span></th>'
           +'</tr><tr>'
             +'<th style="text-align:left">Качество:</th>'
             +'<th><input type="text" value="0.00" id="topRightQuality" /></th>'
             +'<th><input type="text" value="0.00" id="topRightQuality1" /></th>'
             +'<th><input type="text" value="0.00" id="topRightQuality2" class="blendingTableBlue" /></th>'
             +'<th><input type="text" value="0.00" id="topRightQuality3" /></th>'
           +'</tr></table>';
  
  if( p == 'goods' ) $( 'div#supply_content > table:nth-child(1)' ).before( str + '<br>' );
  else {
    $('#headerWithSeparator').after( str + '<div class="headerSeparator w100"><img src="/img/1.gif" width="1" height="1" border="0"/></div>' );
  
    $('#quantityCorner1').val( $('#quantity_corner').html().replace(/\s+/g, '') );
    $('#topRightQuality1').val( $('#top_right_quality').html() );
    
    
		$.ajax({
			url: '//' + location.host + '/vera/main/unit/view/' + location.href.split('/')[7],
			success: function(data){
        var kvp = $(data).find("td:contains('Уровень квалификации')").next().html().match(/-?\d+(?:\.\d+)?/g, '')[0];
        $('#headerWithSeparator > div.headerContainer > div.corner_info > div.tech_supply > div.recommended_quality').append( '<br>Максимальное качество по персоналу: <span class="bold">' + (Math.floor(100*Math.pow(kvp, 1.5))/100) + '</span>' );
			}
		});
  }
  
  $( val[ p ] ).each(function() {
    if( parseFloat( $(this).html().replace(/\s+/g, '') ) > 0 ){
      $(this).css('cursor', 'pointer').click(function() {
        var n = parseFloat( $(this).html().replace(/\s+/g, '') ).toFixed(2);
        if( $('#topRightQuality2').hasClass('blendingTableBlue') ) {
          $('#topRightQuality2').removeClass('blendingTableBlue');
          $('#topRightQuality2').val(n);
          $('#topRightQuality3').addClass('blendingTableBlue');
        } else {
          $('#topRightQuality2').addClass('blendingTableBlue');
          $('#topRightQuality3').removeClass('blendingTableBlue');
          $('#topRightQuality3').val(n);
        }
        work();
      });
    }
  });
  
  $('table.blendingTable input').bind("change keyup input click", function() {
    if( $(this).attr('id').indexOf('quantityCorner') + 1 ) $(this).val( parseInt( $(this).val().replace(/[^0-9]/g, '') ) | 0 );
    else {
      var n = parseFloat( $(this).val() );
      if(!n)  n = 0;
      $(this).val( n.toFixed(2) );
    }
    work();
  });
}

var run1 = function(){
  $('table.blendingTable').after( '<br><p align="right">Со всех подразделений <input type="text" value="1" id="impNum" style="width:100px; text-align:right"></input>'
                                 +' <input id="makeOrders" class="button160" value="Заказать" type="button"></p>' );
  $( "#makeOrders" ).click(function() {
    $("td > span.pseudolink:contains('Выбрать')").each(function() {
      $(this).parent().click();
      $('#amountInput').val( $('#impNum').val() );
      $('#submitLink').click();
    });
  });
}

if(window.top == window) {
  $('head').append( '<style type="text/css"> ' + strCss + ' </style>'
                   +'<script type="text/javascript"> (' + run.toString() + ')(); </script>' );
  
  $("td.selected:contains('Свои')").each(function() {
    $('head').append( '<script type="text/javascript"> ('+run1.toString()+')(); </script>' );
  });
}