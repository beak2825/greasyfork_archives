// ==UserScript==
// @name           Virtonomica: "Обзор рынка лицензий: Спрос" и "Итоги торгов лицензиями"
// @namespace      virtonomica
// @version 	   2.35
// @description    выделяет технологии изученные вами, а так же добавляет кнопку продажи лицензий в итоги торгов лицензиями	
// @include        http*://*virtonomic*.*/*/main/globalreport/technology/*/*/target_market_summary
// @include        http*://*virtonomic*.*/*/main/globalreport/technology/*/*/target_market_summary/*
// @include        http*://*virtonomic*.*/*/main/management_action/*/investigations/technologies
// @include        http*://*virtonomic*.*/*/main/globalreport/technology_target_market/total
// @include        http*://*virtonomic*.*/*/main/globalreport/technology_target_market/total?old
// @include        http*://*virtonomic*.*/*/main/globalreport/technology_market/total
// @include        http*://*virtonomic*.*/*/window/technology_market/ask/by_unit/*/offer/set
// @include        http*://*virtonomic*.*/*/main/management_action/*/technology_target_market/technologies
// @include        http*://*virtonomic*.*/*/window/technology_market/bid/*/*/*/set
// @downloadURL https://update.greasyfork.org/scripts/9616/Virtonomica%3A%20%22%D0%9E%D0%B1%D0%B7%D0%BE%D1%80%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D0%B9%3A%20%D0%A1%D0%BF%D1%80%D0%BE%D1%81%22%20%D0%B8%20%22%D0%98%D1%82%D0%BE%D0%B3%D0%B8%20%D1%82%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F%D0%BC%D0%B8%22.user.js
// @updateURL https://update.greasyfork.org/scripts/9616/Virtonomica%3A%20%22%D0%9E%D0%B1%D0%B7%D0%BE%D1%80%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D0%B9%3A%20%D0%A1%D0%BF%D1%80%D0%BE%D1%81%22%20%D0%B8%20%22%D0%98%D1%82%D0%BE%D0%B3%D0%B8%20%D1%82%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F%D0%BC%D0%B8%22.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

	//резделитель разрядов
	function commaSeparateNumber(val, sep){
		var separator = sep || ',';
		while (/(\d+)(\d{3})/.test(val.toString())){
			val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+separator);
		}
		return val;
	}
	function getLast(str){
		var matches = str.match(/\/(\d+)$/);
		return matches[1];
	}
	function getRealm(){
		var svHref = window.location.href;
        var matches = svHref.match(/\/(\w+)\/main\//);
if (matches == null){
        matches = svHref.match(/\/(\w+)\/window\//);
}
		return matches[1];
	}
	function getVal(spName){
		return JSON.parse(window.localStorage.getItem(getRealm() + '_' + spName));
	}
	function setVal(spName, pValue){
		window.localStorage.setItem(getRealm() + '_' + spName, JSON.stringify(pValue));
	}
    function trim(str) {
        return str.replace(/^\s+|\s+$/g,"");
    }
    function getLvl(str) {
        var first = str.indexOf('</') + 4;
        var perc = trim(str.substr(0, first));

        var second = str.substr(first+1).indexOf('</') + 4;
        //var lvl = parseFloat(trim(str.substr(first+1, second)).replace("<b>","").replace("</b>",""), 10);
        var matches = str.substr(first+1, second).match(/([0-9]+\.[0-9]+)/);
        var lvl;
        if(matches == null || matches.length == 0){
            lvl = 0;
        }else{
            lvl =  parseFloat(matches[1], 10);
        }
        // console.log("'"+ lvl+"'" );
        return lvl;
    }
    function sort_table(tbody, col, asc){
        var rows = tbody.rows;
        var rlen = rows.length;
        var arr = [];
        var i, j, cells;
        // fill the array with values from the table
        for(i = 0; i < rlen; i++){
            cells = rows[i].cells;
            arr.push([rows[i], cells[col].innerHTML]);
        }
        // sort the array by the specified column number (col) and order (asc)
        arr.sort(function(a, b){
            return asc*compareSpec(a[1], b[1]);
        });
        for(i = 0; i < rlen; i++){
            tbody.appendChild(arr[i][0]);
        }
    }
	function getCurrDate(){
		return new Date().getDate();
	}
    function setTechList(callback) {
		var stab = getVal('techList');
		//console.log(Object.keys(stab).length);
		if (stab == null || stab['update_date'] != getCurrDate() || Object.keys(stab).length == 1) {
			stab = {};
			// получение информации о своих изученных технах	
			var tmurl=$( 'ul.main_menu a:contains("Предприятия")').attr('href').slice(0,-10);
			var numpos=tmurl.indexOf("company");
			var tmurl0=tmurl.substring(numpos+12); // 
			tmurl=tmurl.substring(0,numpos); // 
			tmurl=tmurl+"management_action"+tmurl0+"/investigations/technologies";

			$.get(tmurl,function(data){
				$('div[class="tech_row"] > div > div > a', data).each(function(){
					var link = $(this);
					//http://virtonomica.ru/olga/window/management_action/4207337/investigations/technology_offer_create/5/370088
					var matches = link.attr('href').match(/technology_offer_create\/(\d+)\/(\d+)/);
					var nteh = matches[1];
					var techId = matches[2];
					//console.log(link.attr('href'));
					stab[techId + '|' + nteh] = 1;
                  	//купленные
                  	$('> div.tech_cell > div.tech_b', link.parent().parent().parent()).first().children().remove();
                  	var fromTech = parseFloat(nteh);
                  	var maxTech = parseFloat($('> div.tech_cell > div.tech_b', link.parent().parent().parent()).first().text()) || 0;
                  	while(maxTech > fromTech) {
                      	if(stab[techId + '|' + maxTech] !== 1) {
							stab[techId + '|' + maxTech] = 2; 
                        }
                      	--maxTech;
                    }
				});
				stab['update_date'] = getCurrDate();
				setVal('techList', stab);
				//alert(stab);
				if(callback != null) {
					callback();
				}
			});
		} else {
			if(callback != null) {
				callback();
			}
		}
	}
	function sortTable(){
		var rows = $('table[class="list"] > tbody > tr:has(td):has(a)');
		//console.log(rows.length);
		var path = '> td[style="background: rgb(154, 255, 154);"]';
		rows.sort(function(a, b) {
			//console.log($(path, a).length +' > '+ $(path, b).length);
			return $(path, b).length - $(path, a).length;
		});
		rows.each(function() {
        	var row = $(this);
			$('table[class="list"] > tbody:last-child').append(row);
		});
	}
	function getSum(obj) {
		var sum = 0;
		for(var i=0, n=obj.length; i < n; i++) 
		{ 
			sum += obj[i].p * obj[i].q; 
		}
		return sum;
	}
	function getRowSum(cells) {
		var sum = 0;
		cells.each( function() {
        	var cell = $(this);
			//console.log('sum = ' + sum);
			sum += parseFloat(cell.attr('asksum')); 
		});
		return sum;
	}
    function sellLicense(spTechID, spTechLvl, npPrice, opBtn){
      opBtn.attr('disabled', true);
      opBtn.attr('value', 'Ожидаем подтверждения');
                      
      var unit_list_url = $('a[href*="/unit_list"]').first().attr('href');
      var matches = unit_list_url.match(/\/(\d+)\/unit_list$/);
      var svCompanyID = matches[1];
      
      //https://virtonomica.ru/olga/main/company/view/4207337/unit_list
      //https://virtonomica.ru/olga/window/technology_market/bid/4207337/359894/17/set
      var svUrl = unit_list_url.replace('/main/company/view/'+svCompanyID+'/unit_list', '/window/technology_market/bid/'+svCompanyID+'/'+spTechID+'/'+spTechLvl+'/set');
      var data = {};
      data['data[min_price]'] = round(npPrice, 1000) || 1000;
      data['data[license_count]'] = 1;
      data['data[offer_type]'] = 1;
      data['data[trade_type]'] = 1;
      data['data[is_polimorphic]'] = 0;

      console.log( 'price = ' + data['data[min_price]'] );
      
      $.post( svUrl, data )
        .done(function() {
        opBtn.remove();
        console.log( "success" );
      })
        .fail(function() {
        console.log( "error" );
      });
    }
	function set_color_teh() {
		var stab = getVal('techList');

		$('table[class="list"] > tbody > tr > td > a').each( function() {
        	var link = $(this);
			var href = link.attr('href');
			var matches = href.match(/technology\/(\d+)\/(\d+)\//);
			var techId = matches[1];
			var nteh = matches[2];
			//console.log(techId+'|'+nteh);
			// названия техн совпали
			var exist = stab[techId+'|'+nteh];
			if (exist != null && exist == 1){
              link.parent().css('background','#9AFF9A'); 
			} else if (exist != null && exist == 2){
              link.parent().css('background','#ddd'); 
			}
			link.parent().attr('title','lvl: '+nteh);
		});
		//sortTable();
		var techPrices = [];
		$.getJSON('https://cobr123.github.io/tech/'+getRealm()+'/technology_market.json', function (data) {
			$.each(data, function (key, val) {
              techPrices[val.i+'|'+val.l] = val.p;
			});
		});
        var sellAllBtn7perc = $('<input type="button" value="all by 7%">');
        sellAllBtn7perc.click(function(){
          if(confirm('Продать все лицензии по цене 7% от минимальной стоимости технологии?')){
            sellAllBtn7perc.attr('disabled', true);
            $('input[name="sell7perc"]').show();
            $('input[name="sell7perc"]').click(); 
          }
          return false;
        });
        var sellAllBtn1k = $('<input type="button" value="all by 1k">');
        sellAllBtn1k.click(function(){
          if(confirm('Продать все лицензии по 1000?')){
            sellAllBtn1k.attr('disabled', true);
            $('input[name="sell1k"]').show();
            $('input[name="sell1k"]').click();
          }
          return false;
        });
        var showTechBtns = $('<input type="checkbox" id="show_all_sell_buttons"><label for="show_all_sell_buttons">Показать кнопки продажи для каждой технологии отдельно</label>');
        showTechBtns.change(function(){
          if($('#show_all_sell_buttons:checked').length === 1){
            $('input[name="sell7perc"]').show();
            $('input[name="sell1k"]').show();
          } else {
            $('input[name="sell7perc"]').hide();
            $('input[name="sell1k"]').hide();
          }
          return false;
        });
      	$('#childMenu').append(sellAllBtn1k).append(sellAllBtn7perc).append(showTechBtns);
      
		$.getJSON('https://cobr123.github.io/tech/'+getRealm()+'/license_ask_wo_bid.json', function (data) {
			var found = false;
			$.each(data, function (key, val) {
				//console.log(val.i+'/'+val.l);
				//console.log(JSON.stringify(val));
				$('table[class="list"] > tbody > tr > td[style="background: rgb(154, 255, 154);"] > a[href*="/globalreport/technology/'+val.i+'/'+val.l+'/target_market_summary/"]').each( function() {
					var link = $(this);
					link.parent().css('background','#ffff6b');
					var sum = getSum(val.awb);
					//console.log('sum = ' + sum);
					link.parent().attr('asksum', sum);
					link.parent().attr('title', commaSeparateNumber(sum, ' '));
					found = true;
                  	var sellBtn7perc = $('<input type="button" value="7%" name="sell7perc">');
                  	var sellBtn1k = $('<input type="button" value="1k" name="sell1k">');
                  	sellBtn7perc.click(function(){
                      var nvPrice = parseFloat(techPrices[val.i+'|'+val.l]) * 0.02 * 0.07;
                      sellLicense(val.i, val.l, nvPrice, sellBtn7perc);
                      return false;
                    });
                  	sellBtn7perc.hide();
                  	sellBtn1k.click(function(){
                      var nvPrice = 1000;
                      sellLicense(val.i, val.l, nvPrice, sellBtn1k);
                      return false;
                    });
                  	sellBtn1k.hide();
                  	link.append(sellBtn1k).append(sellBtn7perc);
				});
			});
			if (found) {
				var rows = $('table[class="list"] > tbody > tr:has(td):has(a)');
				//console.log(rows.length);
				var pathSum = '> td[asksum]';
				var pathSelf = '> td[style="background: rgb(154, 255, 154);"]';
				rows.sort(function(a, b) {
					var sumA = getRowSum($(pathSum, a));
					var sumB = getRowSum($(pathSum, b));
					if (sumB === sumA){
						return $(pathSelf, b).length - $(pathSelf, a).length;
					} else {
						return sumB - sumA;
					}
				});
				rows.each(function() {
					var row = $(this);
					$('table[class="list"] > tbody:last-child').append(row);
				});
			}
		});
	}
  
	function addSellLicenseLink() {
		var stab = getVal('techList');
		//http://virtonomica.ru/olga/main/globalreport/technology/380082/2/target_market_summary
		var svHref = window.location.href;
		var matches = svHref.match(/technology\/(\d+)\/(\d+)\//);
		var techId = matches[1];
		var nteh = matches[2];
		var exist = stab[techId+'|'+nteh];
		if (exist != null && exist == 1)  {
			//http://virtonomica.ru/olga/main/globalreport/technology/422577/2/target_market_summary/2015-05-01/bid
			//http://virtonomica.ru/olga/window/technology_market/bid/4207337/422577/5/set
			//http://virtonomica.ru/olga/main/company/view/4207337/dashboard
			matches = $('a[class="dashboard"]').attr('href').match(/([0-9]+)/);
			var companyId = matches[1];
			var svSellHref = svHref.replace('main/globalreport/technology/','window/technology_market/bid/'+companyId+'/').replace(/\/target_market_summary(\/\d+-\d+-\d+\/\w+)?/,'/set');
			var svSellLink = '<b><a href="'+svSellHref+'" onclick="return doWindow(this, 1000, 800);">Продать лицензии</a></b>';
			//http://virtonomica.ru/olga/main/management_action/4207337/technology_target_market/technologies
			var svOpenListHref = svHref.replace(/\/globalreport\/technology\/\w+\/\w+\/target_market_summary(\/\d+-\d+-\d+\/\w+)?/,'/management_action/'+companyId+'/technology_target_market/technologies');
			var svOpenListLink = '<b><a href="'+svOpenListHref+'" target="_blank">Список лицензий</a></b>';
			$('table[class="list"] > tbody > tr:last').after('<tr><td colspan="2">'+svSellLink+'</td><td colspan="3">'+svOpenListLink+'</td></tr>');
      
      $('#mainContent > table > tbody > tr > td > b > a[href$=bid]').each(function(){
        var link = $(this);
        link.attr('href', link.attr('href')+'?old');
      });
      $('#mainContent > table > tbody > tr > td > b > a[href$=ask]').each(function(){
        var link = $(this);
        link.attr('href', link.attr('href')+'?old');
      });
		}
	}
  
	function addTargetMarketSummaryLink(){
		//http://virtonomica.ru/olga/main/globalreport/technology/380082/2/target_market_summary
		//http://virtonomica.ru/olga/graph/globalreport/technology_market/summary/423170/4
		var svDate = new Date().toISOString().slice(0, 10);
		var svUrl = $('img#graphreport').attr('src').replace('/graph/globalreport/technology_market/summary/','/main/globalreport/technology/') + '/target_market_summary/'+svDate+'/bid';
		var svTargetMarketSummaryLink = '<b><a href="'+svUrl+'" target="_blank">Итоги торгов лицензиями</a></b>';
		$('table[class="list"] > tbody > tr:last').after('<tr><td colspan="5">'+svTargetMarketSummaryLink+'</td></tr>');
	}
  
    var postCount = 0;
    var postDoneCount = 0;
    var total = 0;
	function cancelBid(delAllBidsBtn, svUrl){
      postCount += 1;
      delAllBidsBtn.val('Отправляю запросы: ' + postCount + ' / ' + total);
      //console.log("svUrl = " + svUrl);
      $.get( svUrl )
        .done(function() {
        console.log( "success" );
      })
        .fail(function() {
        console.log( "error" );
      })
        .always(function() {
        console.log( "always" );
        postDoneCount += 1;
        delAllBidsBtn.val('Ожидаю ответы: ' + postDoneCount + ' / ' + total);
        if(postCount === postDoneCount){
          window.location = window.location.href;
        }
      });
    }
  	function updDelAllBidsBtnTitle(){
      var confirmMsg = '';
      var checkedCnt = $('input[name="cancel_bid"]:checked').length;
      if(checkedCnt === 0) {
        confirmMsg = 'Удалить все предложения отображаемые на странице';
      } else {
        confirmMsg = 'Удалить ' + checkedCnt + ' предложения(й) отображаемые на странице';
      }
      $('input#del_all_bids').val(confirmMsg);
    }
	function addDelAllBidsBtn(){
      var links = $('table.grid > tbody > tr > td > a:has(img[src="/img/icon/cancel.gif"])');
      if(links.length === 0) return;

      $('#technologyListTable > tbody > tr:nth-child(1) > th:nth-child(7)').append('<input type="checkbox" id="cancel_all_bid">');

      $('input#cancel_all_bid').click(function() {
        var checked = $(this).is(':checked');
        $('input[name="cancel_bid"]').each(function() {
          $(this).attr('checked', checked);
        });
        updDelAllBidsBtnTitle();
      });

      var confirmMsg = 'Удалить все предложения отображаемые на странице';
      var delAllBidsBtn = $('<input id="del_all_bids" type="button" value="Удалить все предложения отображаемые на странице"/>').click(function() {
        if(confirm(confirmMsg + '?')) {
          delAllBidsBtn.attr('disabled', true);
          postCount = 0;
          postDoneCount = 0;
          var checkedCnt = $('input[name="cancel_bid"]:checked').length;
          if(checkedCnt === 0) {
            total = links.length;
            links.each(function() {
              var svUrl = $(this).attr('href');
              cancelBid(delAllBidsBtn, svUrl);
            });
          } else {
            total = checkedCnt;
            $('input[name="cancel_bid"]:checked').each(function() {
              var svUrl = $(this).prev().attr('href');
              cancelBid(delAllBidsBtn, svUrl);
            });
          }
          delAllBidsBtn.val('Ожидаю ответы: ' + postDoneCount + ' / ' + total);
        }
      });
      var linkImgs = $('img[src="/img/icon/cancel.gif"]');
      linkImgs.each(function() {
        var img = $(this);
        var checkbox = $('<input type="checkbox" name="cancel_bid">').click(function() {
          updDelAllBidsBtnTitle();
        });
        img.parent().after(checkbox);
      });
      $('label[for="groupByUnitType"]').after(delAllBidsBtn).after('&nbsp;');
	}
	function formatMoney(spSum) {
		var rounded = Math.abs(parseFloat(spSum,10));
		var idx = 0;
		while (rounded >= 1000) {
			rounded = rounded / 1000;
			idx += 1;
		}
		if (idx === 1) {
			return rounded.toFixed(0) + 'Th';
		} else if (idx === 2) {
			return rounded.toFixed(0) + 'M';
		} else if (idx === 3) {
			return rounded.toFixed(0) + 'B';
		} else if (idx === 4) {
			return rounded.toFixed(0) + 'Tr';
		} else if (idx === 5) {
			return rounded.toFixed(0) + 'Qua';
		} else if (idx === 6) {
			return rounded.toFixed(0) + 'Qui';
		} else if (idx === 7) {
			return rounded.toFixed(0) + 'Sex';
		} else if (idx === 8) {
			return rounded.toFixed(0) + 'Sep';
		} else {
			return rounded;
		}
	}
	function sumMoneyToNumber(spSum){
		return parseFloat(spSum.replace('$','').replace(/\s+/g,''),10);
	}
	function getShortSum(spSum) {
		return formatMoney(sumMoneyToNumber(spSum));
	}
	function sortTechTable(){
      function toNumber(spSum){
        if(spSum == null) {
          return 0;
        } else {
          return parseFloat(spSum.replace('$','').replace(/\s+/g,''),10) || 0; 
        }
      }
      function getMin(spNum1, npNum2){
        var tmp = toNumber(spNum1);
        if(tmp > 0){
          if(npNum2 > 0){
            return Math.min(npNum2, tmp); 
          } else {
            return tmp; 
          }
        } else {
          return npNum2;
        }
      }
      var rows = $('table[class="list"] > tbody > tr:has(td):has(th)');
      //наиболее изученные вверху
      var pathByKnown = '> td[style="background: rgb(154, 255, 154);"]';
      
      if($('#toggleSortByPrice').is(':checked')){
        var len = 0;
        var prcA = 0;
        var prcB = 0;
        var cellA = null;
        var cellB = null;
        //наиболее дешевые для покупки вверху
        var path = '> td[price]';
        rows.sort(function(a, b) {
          prcA = 0;
          prcB = 0;
          len = $('> td', a).length;
          if(len === $('> td', b).length){
            for(var idx = 0; idx < len; ++idx){
              cellA = $(path, a).eq(idx);
              cellB = $(path, b).eq(idx);
              if(cellA.attr('known') != '1' && cellA.attr('style') !== 'background: rgb(154, 255, 154);'){
                prcA = getMin(cellA.attr('price'), prcA);
              }
              if(cellB.attr('known') != '1' && cellB.attr('style') !== 'background: rgb(154, 255, 154);'){
                prcB = getMin(cellB.attr('price'), prcB);
              }
            }
          }
          //console.log($('>th', a).text() + ' > ' + $('>th', b).text() + ' = ' + (prcA > prcB) );
          if(prcA !== 0 && prcB !== 0) {
            return prcA - prcB; 
          } else {
            return $(pathByKnown, b).length - $(pathByKnown, a).length;
          }
        });
      } else {
        rows.sort(function(a, b) {
          //console.log($(path, a).length +' > '+ $(path, b).length);
          return $(pathByKnown, b).length - $(pathByKnown, a).length;
        });
      }
      rows.each(function() {
        var row = $(this);
        $('table[class="list"] > tbody:last-child').append(row);
      });
	}
	function sortAndColorTechTable(){
		var stab = getVal('techList');
      
		var svLabStartFilterArray = getVal('labStartFilterArray');
      	var avLabStartFilterArray = [];
      	if(svLabStartFilterArray !== null && svLabStartFilterArray != ''){
          var tmp = svLabStartFilterArray.split('|');
          $.each(tmp, function (key, val) {
            var values = val.split(';');
            if(values != ''){
              var nteh = Math.floor(parseFloat(values[2]));
              avLabStartFilterArray[values[1]+'|'+nteh] = parseFloat(values[2]);
              //console.log(values[1] + ': ' + Math.floor(parseFloat(values[2])));
            }
          });
		}
      
		var techLvls = $('table[class="list"] > tbody > tr:nth-child(2) > th');

		//$('table[class="list"] > tbody > tr > td[title^="$"]').each( function() {
		$('table[class="list"] > tbody > tr > td[title]').each( function() {
        	var cell = $(this);
			//console.log('techIdlink = ' + $('> th > a:has(img)', cell.parent()).attr('href'));
			var techId = getLast($('> th > a:has(img)', cell.parent()).attr('href'));
			var nteh = techLvls.eq(cell.index()).text();
          	var techName = $('> th', cell.parent()).text();
			//console.log(techName);
			//console.log(techId+'|'+nteh);
          	cell.attr('price', cell.attr('title'));
			// названия техн совпали
			var exist = stab[techId+'|'+nteh];
			if (Math.floor(avLabStartFilterArray[techName+'|'+nteh]) === parseFloat(nteh))  {
              cell.attr('known', '1');
              cell.attr('title', cell.attr('title') + ' ('+ avLabStartFilterArray[techName+'|'+nteh] +')');
              cell.css('background','#bb88ee');
            } else if (exist != null && exist == 1)  {
              cell.attr('known', '1');
              cell.css('background','#9AFF9A');
			} else if (exist != null && exist == 2)  {
              cell.attr('known', '1');
              cell.css('background','#ddd');
			} else if (sumMoneyToNumber(cell.attr('title')) <= 500000000) {
				cell.css('background','#ffff6b');
			} else if (sumMoneyToNumber(cell.attr('title')) <= 5000000000) {
				cell.css('background','#ffaa6b');
			}
          	cell.attr('title', nteh + ': ' + cell.attr('title'));
		});
      	hideFirstEmptyColumns();
      
      var svToggleHideMinableAndGrown = '<label><input id="toggleHideMinableAndGrown" type="checkbox">Скрыть ресурсы</label>';
      $('table.list').first().before(svToggleHideMinableAndGrown);
      $('#toggleHideMinableAndGrown').change( function(){
          var bvChecked = $(this).is(':checked');
          if (bvChecked) {
            $('table[class="list"] > tbody > tr > th > a:contains(рудник)').parent().parent().hide();
            $('table[class="list"] > tbody > tr > th > a:contains(карьер)').parent().parent().hide();
            $('table[class="list"] > tbody > tr > th > a:contains(шахта)').parent().parent().hide();
            $('table[class="list"] > tbody > tr > th > a:contains(Шахта)').parent().parent().hide();
            $('table[class="list"] > tbody > tr > th > a:contains(Плантация)').parent().parent().hide();
            $('table[class="list"] > tbody > tr > th > a:contains(Лесопилка)').parent().parent().hide();
            $('table[class="list"] > tbody > tr > th > a:contains(Земледельческая ферма)').parent().parent().hide();
            $('table[class="list"] > tbody > tr > th > a:contains(Золотодобывающее предприятие)').parent().parent().hide();	
            $('table[class="list"] > tbody > tr > th > a:contains(Нефтедобывающее предприятие)').parent().parent().hide();	
          } else {
            $('table[class="list"] > tbody > tr > th > a:contains(рудник)').parent().parent().show();
            $('table[class="list"] > tbody > tr > th > a:contains(карьер)').parent().parent().show();
            $('table[class="list"] > tbody > tr > th > a:contains(шахта)').parent().parent().show();
            $('table[class="list"] > tbody > tr > th > a:contains(Шахта)').parent().parent().show();
            $('table[class="list"] > tbody > tr > th > a:contains(Плантация)').parent().parent().show();
            $('table[class="list"] > tbody > tr > th > a:contains(Лесопилка)').parent().parent().show();	
            $('table[class="list"] > tbody > tr > th > a:contains(Земледельческая ферма)').parent().parent().show();
            $('table[class="list"] > tbody > tr > th > a:contains(Золотодобывающее предприятие)').parent().parent().show();	
            $('table[class="list"] > tbody > tr > th > a:contains(Нефтедобывающее предприятие)').parent().parent().show();	
          }
      });
      $('#toggleHideMinableAndGrown').click();
      
      var svToggleSortByPrice = '<label><input id="toggleSortByPrice" type="checkbox">Сортировать по цене</label>';
      $('table.list').first().before(svToggleSortByPrice);
      $('#toggleSortByPrice').change( function(){
          sortTechTable();
      });
      $('#toggleSortByPrice').click();
            
	}
	function addQuickPriceBtns(){
      var ov7perc = $('<button>7%</button>').click(function() {
        var minPrc = sumMoneyToNumber($('body > form > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2) > div').text());
        minPrc = round(minPrc * 0.07, 1000);
        $('input#min_price').val(minPrc.toFixed(0));
        return false;
      });
      var ovBtn1k = $('<button>1k</button>').click(function() {
        $('input#min_price').val(1000);
        return false;
      });
      var ovBtn10k = $('<button>10k</button>').click(function() {
        $('input#min_price').val(10000);
        return false;
      });
      var ovBtn100k = $('<button>100k</button>').click(function() {
        $('input#min_price').val(100000);
        return false;
      });
      var ovBtn1m = $('<button>1m</button>').click(function() {
        $('input#min_price').val(1000000);
        return false;
      });
      var ovBtn10m = $('<button>10m</button>').click(function() {
        $('input#min_price').val(10000000);
        return false;
      });
      var ovBtn100m = $('<button>100m</button>').click(function() {
        $('input#min_price').val(100000000);
        return false;
      });

      $('input#min_price').after(ovBtn100m).after(ovBtn10m).after(ovBtn1m).after(ovBtn100k).after(ovBtn10k).after(ovBtn1k).after(ov7perc);
    }
	function addQuickMaxPriceBtns(){
      var ov7perc = $('<button>7%</button>');
      //https://virtonomica.ru/olga/graph/globalreport/technology_market/summary/16042/20
      var matches = window.location.href.match(/\/(\w+)\/window\//);
      var svRealm = matches[1];
      var minPrc = 0;
      matches = $('img#graphreport').attr('src').match(/\/(\d+)\/(\d+)$/);
      var svTechId = matches[1];
      var nvTechLvl = parseFloat(matches[2]);
      $.getJSON('https://cobr123.github.io/tech/'+ svRealm +'/technology_market.json', function (data) {
        $.each(data, function (key, val) {
          if(val.i == svTechId && parseFloat(val.l) == nvTechLvl){
            minPrc = round(parseFloat(val.p) * 0.02 * 0.07, 1000);
            ov7perc.text(commaSeparateNumber(minPrc.toFixed(0), ' ') + ' (7%)');
            ov7perc.click(function() {
              $('input#max_price').val(minPrc.toFixed(0));
              return false;
            });
          }
        });
      });
      var ovBtn1m = $('<button>1m</button>').click(function() {
        $('input#max_price').val(1000000);
        return false;
      });
      var ovBtn10m = $('<button>10m</button>').click(function() {
        $('input#max_price').val(10000000);
        return false;
      });
      var ovBtn100m = $('<button>100m</button>').click(function() {
        $('input#max_price').val(100000000);
        return false;
      });

      $('input#max_price').after(ovBtn100m).after(ovBtn10m).after(ovBtn1m).after(ov7perc);
    }
  	function hideFirstEmptyColumns(){
      var idx = 0;
      var notEmptyFound = false;
      var total = $('table.list > tbody > tr[class]:eq(0) > td').length;
      while(idx < total) {
        $('table.list > tbody > tr[class]').each(function(){
          var row = $(this);
          var cell = $('> td', row).eq(idx);
          if(!notEmptyFound && cell.text() !== '--'){
            notEmptyFound = true;
          }
        });
        if(notEmptyFound) {
          break;
        }
        //hide column
        $('table.list > tbody > tr[class]').each(function(){
          var row = $(this);
          var cell = $('> td', row).eq(idx);
          cell.hide();
        });
        
        $('table.list > tbody > tr:eq(1)').each(function(){
          var row = $(this);
          var cell = $('> th', row).eq(idx + 1);
          cell.hide();
        });
        ++idx;
      }
      //console.log(idx);
      hideLastKnownColumns();	
    }
  	function hideLastKnownColumns(){
      var notEmptyFound = false;
      var idx = $('table.list > tbody > tr[class]:eq(0) > td').length - 1;
      while(idx > 0) {
        $('table.list > tbody > tr[class]').each(function(){
          var row = $(this);
          var cell = $('> td', row).eq(idx);
          if(!notEmptyFound  && cell.text() !== '--' && cell.attr('style') !== 'background: rgb(154, 255, 154);'){
            notEmptyFound = true;
          }
        });
        if(notEmptyFound) {
          break;
        }
        //hide column
        $('table.list > tbody > tr[class]').each(function(){
          var row = $(this);
          var cell = $('> td', row).eq(idx);
          cell.hide();
        });
        
        $('table.list > tbody > tr:eq(1)').each(function(){
          var row = $(this);
          var cell = $('> th', row).eq(idx + 1);
          cell.hide();
        });
        --idx;
      }
      //console.log(idx);
      sortTechTable();
    }
    //
    if (/\w*virtonomic\w+.\w+\/\w+\/main\/globalreport\/technology_target_market\/total\?old/.test(window.location)) {
		setTechList(set_color_teh);
		var link = null;
		$('table[class="list"] > tbody > tr > td > a').each(function(){
        	link = $(this);
			link.attr('href', link.attr('href')+'/ask?old');
			link.attr('onclick', 'return doWindow(this, 1000, 600);');
			//console.log(link.attr('href'));
		});
	}
    if (/\w*virtonomic\w+.\w+\/\w+\/main\/globalreport\/technology_market\/total\?old/.test(window.location)) {
		var cell = null;
		var svNewVal = '';
		$('table[class="list"] > tbody > tr > td[title^="$"]').each(function(){
        	cell = $(this);
			svNewVal = getShortSum(cell.attr('title'));
			cell.html(svNewVal);
			cell.attr('style','');
		});
		setTechList(sortAndColorTechTable);
	}
    if (/\w*virtonomic\w+.\w+\/\w+\/main\/globalreport\/technology\/\w+\/\w+\/target_market_summary/.test(window.location)
		||/\w*virtonomic\w+.\w+\/\w+\/main\/globalreport\/technology\/\w+\/\w+\/target_market_summary\/\w+\/\w+/.test(window.location)
		) {
		setTechList(addSellLicenseLink);
	}
    if (/\w*virtonomic\w+.\w+\/\w+\/window\/technology_market\/ask\/by_unit\/\w+\/offer\/set/.test(window.location)
		) {
		addTargetMarketSummaryLink();
      	addQuickMaxPriceBtns();
	}
    if (/\w*virtonomic\w+.\w+\/\w+\/main\/management_action\/\w+\/technology_target_market\/technologies/.test(window.location)
		) {
		addDelAllBidsBtn();
	}
    if (/\w*virtonomic\w+.\w+\/\w+\/window\/technology_market\/bid\/\w+\/\w+\/\w+\/set/.test(window.location)
		) {
		addQuickPriceBtns();
	}
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}