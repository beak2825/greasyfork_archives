// ==UserScript==
// @name        Отчет
// @namespace   virtonomica
// @description Обобщение  Финансовый отчёт->По статьям, Финансовый отчёт->По подразделениям
// @include     http://*virtonomic*.*/*/main/company/view/*/finance_report/by_units*
// @include     http://*virtonomic*.*/*/main/company/view/*/finance_report/by_item
// @include     http://*virtonomic*.*/*/main/unit/view/*/finans_report/by_item
// @version     1.29
// @downloadURL https://update.greasyfork.org/scripts/6521/%D0%9E%D1%82%D1%87%D0%B5%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/6521/%D0%9E%D1%82%D1%87%D0%B5%D1%82.meta.js
// ==/UserScript==

///////////
// Функции
var fun = function() {
    return ({
        'floatP': function (val){
            return ( parseFloat( val.replace(/\s+/g, '').replace(/\$/g, '') ) )
        },
        'int_str': function (val){
            return ('<td class="nowrap' + (val<0?' moneySmallerZero':'') + '" align="right">' + val.toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '$</td>')
        }
    });
}

//////////////
// По статьям
var run = function() {
    var str = [
        [ // Доходы
            "Возвращение аукционного залога",
            "Прочие доходы",
            "Продажа товаров",
            "Оказание ремонтных услуг",
            "Продажа технологий",
            "Продажа имущества",
            "Продажа электроэнергии потребителям",
            "Выручка от реализации товаров со склада",
        
            "Продажа ценных бумаг",
            "Доход от купленных облигаций"
        ],
        [ // Расходы
            "Аукционный залог",
            "Ликвидация предприятий",
            "Налог на продажу имущества",
            "Остальные",
            "Сборы рынка технологий",
            "Покупка товаров",
            "Покупка сырья и материалов",
            "Закупка товаров на склад",
            "Покупка технологий",
            "Внедрение технологий",
            "Расходы на транспортировку",
            "Таможенные пошлины",
            "Заработная плата",
            "Топливо, энергия",
            "Реклама",
            "Расходы на персонал",
            "Складские расходы",
            "Брак, потери",
            "Налог на прибыль",
            "Налог на продажу технологий и технологических лицензий",
        
            "Общепроизводственные расходы",
            "Аренда помещений",
            "Управленческие расходы",
            "Выплаты по инновациям",
        
            "Покупка имущества",
            "Строительство и модернизация",
            "Закупка и ремонт оборудования",
            "Внедрение инноваций",
        
            "Покупка ценных бумаг",
            "Комиссия за выпуск ценных бумаг",
            "Погашение облигаций"
        ]
    ];

    for(var y in str) {
        for(var s in str[y]) {
            n[2] = 0;
            $("tr:contains(" + str[y][s] + ") > td.nowrap").each(function() {
                n[y][n[2]] +=  funFinReport.floatP( $(this).html() );
                n[2]++;
            });
        }
    }

    // Выведем результат
    $( "#mainContent > table" ).append( '<tr><td class="title" colspan="6">Всего</td></tr>'
                                       +'<tr class="odd" onmouseout="this.className = \'odd\'" onmouseover="this.className = \'selected\'">'
                                       +'<td style="padding-left: 30px">Доходы</td>'
                                       + funFinReport.int_str(n[0][0])
                                       + funFinReport.int_str(n[0][1])
                                       + funFinReport.int_str(n[0][2])
                                       + funFinReport.int_str(n[0][3])
                                       + funFinReport.int_str(n[0][4])
                                       +'</tr>'
                                       +'<tr class="even" onmouseout="this.className = \'even\'" onmouseover="this.className = \'selected\'">'
                                       +'<td style="padding-left: 30px">Расходы</td>'
                                       + funFinReport.int_str(n[1][0])
                                       + funFinReport.int_str(n[1][1])
                                       + funFinReport.int_str(n[1][2])
                                       + funFinReport.int_str(n[1][3])
                                       + funFinReport.int_str(n[1][4])
                                       +'</tr>'
                                       +'<tr class="odd" onmouseout="this.className = \'odd\'" onmouseover="this.className = \'selected\'">'
                                       +'<td style="padding-left: 30px">Сумма</td>'
                                       + funFinReport.int_str(n[0][0]-n[1][0])
                                       + funFinReport.int_str(n[0][1]-n[1][1])
                                       + funFinReport.int_str(n[0][2]-n[1][2])
                                       + funFinReport.int_str(n[0][3]-n[1][3]) 
                                       + funFinReport.int_str(n[0][4]-n[1][4])
                                       +'</tr>');
}

/////////////////////
// По подразделениям
var run1 = function(){
    $('#mainContent > table.grid > tbody > tr').each(function() {
        if( $(this).hasClass('odd') || $(this).hasClass('even') ) {
            n[1][0]++;
            n[2] = 0;
            $(this).find('td.nowrap').each(function() {
                n[0][n[2]] += funFinReport.floatP( $(this).html() );
                n[2]++;
            });
            n[0][3] = n[0][0]-n[0][1]-n[0][2];
        }
    }).find('td > table.paging').parent().parent().before(
        '<tr style="background: #EEFACA"> <td colspan="3">Итого:</td>'
        +'<td class="nowrap" align="center">' + n[1][0] + '</td>'
        + funFinReport.int_str(n[0][0])
        + funFinReport.int_str(n[0][1])
        + funFinReport.int_str(n[0][2])
        + funFinReport.int_str(n[0][3])
        + funFinReport.int_str( n[0][3]/(n[0][1]+n[0][2])*100 ).replace('\$', ' %') 
        +'</tr>'
    );
}

window.onload = function()
{
    var script = document.createElement("script");
    script.textContent = 'var n = [[0,0,0,0,0],[0,0,0,0,0],0], '
                        +'funFinReport = (' + fun.toString() + ')();';
    document.documentElement.appendChild(script);
    
    script = document.createElement("script");
    if( window.location.href.indexOf('by_units') + 1 )
        script.textContent = '(' + run1.toString() + ')();';
    else
        script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}