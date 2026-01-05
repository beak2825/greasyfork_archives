// ==UserScript==
// @name        iks: virtonomica юнит/снабжение
// @namespace   virtonomica
// @description Показывает средний кач и цену закупаемого сырья.
// @include     http*://*virtonomic*.*/*/main/unit/view/*/supply
// @version     1.21
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9592/iks%3A%20virtonomica%20%D1%8E%D0%BD%D0%B8%D1%82%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/9592/iks%3A%20virtonomica%20%D1%8E%D0%BD%D0%B8%D1%82%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==

var fun = function() {
  return ({
    'span': {
      'a': function(s, c){ return ('<span title="' + s + '" style="color:' + c + '">') },
      'b': '</span>'
    }
  });
}

var run = function() {
  $('div#mainContent > form > table.list').css('min-width', '100%');
  
  var o = iksSupplyOptions,
      endT = function() {
        if(o.id) {
          var sumId = $(o.id).find('>td:nth-child(2) strong');
          $(o.id).find('td:nth-child(6) strong').append('&nbsp;<span title="Цена за единицу качества">($'+(o.summa[0]/o.zakaz[0]/(o.kach[0]/o.zakaz[0])).toFixed(2)+')'+o.span.b);
          if( o.zakaz[0] > o.zakaz[1] ) {
            sumId.append('<br><span title="Значение реально свободного сырья" style="color:green">'+o.zakaz[1].toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+o.span.b);
            $(o.id).find('td:nth-child(4) strong').append('<br>$<span title="Цена с учётом оценки запасов сырья" style="color:green">'+(o.summa[1]/o.zakaz[1]).toFixed(2)+o.span.b);
            $(o.id).find('td:nth-child(8) strong').append('<br>$<span title="С учётом оценки запасов сырья" style="color:green">'
                                                          +o.summa[1].toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+o.span.b);
            o.kach[1] = o.kach[1]/o.zakaz[1];
            $(o.id).find('td:nth-child(6) strong').append('<br><span style="color:green"><span title="Качество с учётом оценки запасов сырья">'+o.kach[1].toFixed(2)+o.span.b
                                                          +'&nbsp;<span title="Цена за единицу качества с учётом запасов сырья">($'+(o.summa[1]/o.zakaz[1]/o.kach[1]).toFixed(2)+')'+o.span.b+o.span.b);
          }
        }
        o.p = 0, o.n = 0, o.summa = [0,0], o.kach = [0,0], o.zakaz = [0,0], o.idTr = false, o.id = false;
      }

  $('div#mainContent > form > table.list > tbody > tr').each(function() {
    var z, t, c, k, s;
    switch ( $(this).attr('class') ) {
      case 'p_title': // Титульная строка покупки товара
        endT();
        o.id = this;
        break;
      case 'odd':
      case 'even': // Строки покупки ресурсов
        // количество заказа
        z = parseFloat( $(this).find('td:nth-child(2) > input[type=text]').val() );
        o.zakaz[0] += z;
        // остаток на складе продавца
        t = $(this).find('td:nth-child(9)');
        if( $(t).html().replace(/\s+/g, '') == 'Неогр.' ) t = z;
        else {
          t = $(t).find('span').html().replace('<br>','-').replace(/\s+/g, '').split('-');
          t = parseFloat( t[0] );
        }
        // общая стоимость заказа
        c = $(this).find('td:nth-child(8)').html().replace(/\s+/g, '').replace(/\$/g, '');
        c = parseFloat( c );
        o.summa[0] += c;
        // качество
        k = $(this).find('td:nth-child(6)').html();
        k = parseFloat( k );
        o.kach[0] += z * k;
        if(t < z) {
          o.zakaz[1] += t;
          o.summa[1] += c/z*t;
          o.kach[1] += t * k;
        } else {
          o.zakaz[1] += z;
          o.summa[1] += c;
          o.kach[1] += z * k;
        }

        break;
      default:
        break;
    }// end switch
  });
  endT();

  //////////////////////////////
  // Скрыть/показать поставщиков
  $('div#mainContent > form > table.list > tbody > tr:nth-child(1) > th:nth-child(1)').html('<div style="width:100%; text-align:center; color:blue; cursor:pointer"><strong name="showSeller"><span>Скрыть</span> поставщиков</strong></div>');
  $('strong[name=showSeller]').click(function() {
    s = $(this).find('span');
    $('div#mainContent > form > table.list > tbody > tr[class]').each(function() {
      if( $(this).hasClass('odd') || $(this).hasClass('even') ) { // Строки покупки ресурсов
          if(s.html() == 'Скрыть') $(this).css('display', 'none');
          else $(this).removeAttr('style');
      }// end switch
    });
    var sButton = $('div#mainContent > form > table.list > tbody > tr > td[colspan=9] > input.button160').parent().parent();
    if( s.html() == 'Скрыть' ) {
      s.html('Показать');
      $(sButton).css('display', 'none');
    } else {
      s.html('Скрыть');
      $(sButton).removeAttr('style');
    }
  });

	var cbs = $('table.list > tbody > tr > td:nth-child(1) > input[type="checkbox"]');
	if(cbs.length > 0){
		var box = $('<br><input type="checkbox">').click(function(){
			var row = $(this).closest('tr');
			var checked = $(this).is(':checked');
			var next = row.next();
			while (next.length > 0 && !next.hasClass('p_title')) {
				$('> td:nth-child(1) > input[type="checkbox"]', next).attr('checked', checked);
				next = next.next();
			}
		});
		$('a:has(img[src="/img/supplier_add.gif")').after(box);
	}
}

var run1 = function() {
  var o = iksSupplyOptions,
      funZero = function() {
        o.p = 0;
        o.p1 = false;
        o.n = 0;
        o.summa = [0,0];
        o.kach = [0,0];
        o.zakaz = [0,0];
        o.idTr = false;
        o.id = false;
      };
  funZero();

  $('div#mainContent > form > table.list > tbody > tr[id]').each(function() {
    o.id = $(this).attr('id');
    if( o.id.indexOf('product_') + 1 ) {
      if( o.id.indexOf('product_row_') + 1 ) {
        o.p = parseInt( $(this).find('th[rowspan]').attr('rowspan') );
        o.idTr = $(this).find('table td:contains("Заказ")').parent();
        
        o.zakaz[0] = $(this).find('table td:contains("Заказ")').next().html().replace(/\s+/g, '');
        o.zakaz[0] = parseFloat( o.zakaz[0] );
      }

      var n1 = $(this).find('table tr:nth-child(2) > td:nth-child(1):contains("Стоимость")').next().next().html().replace(/\s+/g, '').replace(/\$/g, '');
      if(n1) sum = n1.split('/');
      else sum = [0,0];
      o.summa[0] += parseFloat(sum[0]);

      n1 = $(this).find('table tr:nth-child(3) > td:nth-child(1):contains("Качество")').next().html().replace(/\s+/g, '').replace(/[^\d.]/g, '');
      if(n1) n1 = parseFloat( n1 );
      else n1 = 0;
      var n2 = parseFloat( $(this).find('input[type="type"]').val() );
      if(!n2) n2 = 0;
      o.kach[0] += n1 * n2;

      var z = parseInt( $(this).find('table tr:nth-child(2) > td:nth-child(1):contains("Свободно")').next().html().replace(/\s+/g, '').replace(/[^\d.]/g, '') );
      if(!z) z = 0;
      else if(z == 'Неогр.') z = n2;
      else z = parseFloat( z );

      if(n2 > z) {
        o.zakaz[1] += z;
        o.kach[1] += n1 * z;
        o.summa[1] += parseFloat(sum[0])/n2 * z;
//        o.summa[1] += o.summa[0]/n2 * z;
      } else {
        o.zakaz[1] += n2;
        o.kach[1] += n1 * n2;
        o.summa[1] += parseFloat(sum[0]);
      }

      o.n++;
      if(o.n==o.p) {
        var s = '';
        if(o.zakaz[0] > o.zakaz[1]) {
          o.p1 = true;
          s = o.span.a('Значение при сделаном заказе', 'red');

          var strZakaz = $(o.idTr).find('td:contains("Заказ")').next();
          strZakaz.html( s+strZakaz.html()+o.span.b+'<br>'+o.span.a('Значение реально свободного сырья', 'green')+o.zakaz[1].toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+o.span.b );
        }
        var k = o.kach[0]/o.zakaz[0];
        if(k) k = k.toFixed(2);
        else  k = '0.00';
        var s1 = o.summa[0]/o.zakaz[0];
        if(s1) s1 = s1.toFixed(2);
        else s1 = '0.00';
        if(o.summa[0]) o.summa[0] = o.summa[0].toFixed(2);
        else  o.summa[0] = '0.00';

        var str = '<tr><td nowrap="">Стоимость</td><td nowrap="" align="right">&nbsp;$'+s+o.summa[0].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        if(o.p1) str += o.span.b+'&nbsp;/&nbsp;$'+o.span.a('Стоимость реально свободного сырья', 'green')+o.summa[1].toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+o.span.b;
        str += '</td></tr>';

        str += '<tr><td nowrap="">Качество</td><td nowrap="" align="right">'+s+k;
        if(o.p1) str += o.span.b+'&nbsp;/&nbsp;'+o.span.a('Качесто ед. реально свободного сырья', 'green')+(o.kach[1]/o.zakaz[1]).toFixed(2)+o.span.b;
        str += '</td></tr>';

        str += '<tr><td nowrap="">Себестоимость</td><td nowrap="" align="right">&nbsp;$'+s+s1;
        if(o.p1) str += o.span.b+'&nbsp;/&nbsp;$'+o.span.a('Цена ед. реально свободного сырья', 'green')+(o.summa[1]/o.zakaz[1]).toFixed(2)+o.span.b;
        str += '</td></tr>';

        str += '<tr><td nowrap="">Цена ед. кач.</td><td nowrap="" align="right">&nbsp;$'+s+(o.summa[0]/o.zakaz[0]/(o.kach[0]/o.zakaz[0])).toFixed(2);
        if(o.p1) str += o.span.b+'&nbsp;/&nbsp;$'+o.span.a('Реально свободного сырья', 'green')+(o.summa[1]/o.zakaz[1]/(o.kach[1]/o.zakaz[1])).toFixed(2)+o.span.b;
        str += '</td></tr>';

        o.idTr.after( str );

        funZero();
      }
    }
  });
      
}

if(window.top == window)
{
  var img = $('div#unitImage > img').attr('src').replace('\/img\/v2\/units\/', '');
  $('head').append( '<script type="text/javascript">'
                   +'var iksSupplyOptions = (' + fun.toString() + ')();'
                   + ' (' + ( img.substr(0,img.length-6) == 'warehouse' ? run.toString() : run1.toString() ) + ')();' + '</script>' );
}