// ==UserScript==
// @name           virtonomica:Salary & Education edited
// @namespace      virtonomica
// @license MIT
// @description    Облегчение установку зарплат на странице управления персоналом
// @description    Облегчение установку обучения
// @description    - установка зарплаты по требуемой квалификации 1:1
// @description    - установка зарплаты по среднегородской 100%
// @description    - увеличение зарплаты на 1%
// @version        1.5.3
// @include        https://virtonomic*.*/*/main/company/view/*/unit_list/employee
// @include        https://virtonomic*.*/*/main/company/view/*/unit_list/employee?old
// @include        https://virtonomic*.*/*/main/company/view/*/unit_list/employee/salary
// @include        https://virtonomic*.*/*/main/company/view/*/unit_list/employee/salary?old
// @downloadURL https://update.greasyfork.org/scripts/5662/virtonomica%3ASalary%20%20Education%20edited.user.js
// @updateURL https://update.greasyfork.org/scripts/5662/virtonomica%3ASalary%20%20Education%20edited.meta.js
// ==/UserScript==

var run = function() {
    // "округляем" зарплату на 1 сотую вверху
    function getSalary( sal) {
        return (Math.floor(sal *100) +1)/100;
    }

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    console.log( "wc_set11 started" );
    // Стили
    var st = $("style");
    if ( $(".my_div", st).length == 0 ) {
        st.append(".my_div{border: 1px solid rgb(1, 132, 208); border-radius: 4px; float: left; white-space: nowrap; color: rgb(1, 132, 208);padding-left:8px;padding-right:8px;margin: 2px;}");
        st.append(".click_div{background-color: lightgray;cursor:pointer}");
        st.append(".click_div:hover{background-color: lightblue;}");
    }

    function set_ok(objSalary, Sreq, Savg)
    {
        objSalary.empty().append($("<span>").text(getSalary(Sreq) + "$"));
        objSalary.append($("<br>"));
        var bbb=parseFloat(Math.floor(Sreq/Savg*10000)/100);
        var color=bbb>89?"blue":'rgb(150,170,10)';
        color=bbb<81?'rgb(111,165,55)':color;
        color=bbb<80?'red':color;
        var font=bbb>81.0?"bold":'';
        font=bbb<80.0?"bold":font;
        objSalary.append($("<span>").text(bbb + " %").css({'color':color,'fontWeight':font,'fontSize':'9px'}));
        objSalary.prev().append("+")
    }

    function setSalary(url, objSalary, objLevel, action){
        // помечсем что уже как бы кликнули
        objSalary.prev().prev().css("background-color","lightyellow");
        // проверка на отпуск
        let pr = objSalary.next().next().next().next();
        if ( $("div.in-holiday", pr).length > 0 ) {
            return;
        }

        objSalary.empty().append($('<img>').attr({'src': 'https://preloaders.net/preloaders/35/Fading%20lines.gif', 'height': 16, 'width': 16}).css('padding-right', '20px'));
        console.log("--setSalary " + url);
        $.get(url, function(data){
            var quantity = $("#quantity", data).val();
            // зарплата
            var S = new Number($("#salary", data).val());
            // средняя зарплата
            var Savg = /([\D]+)([\d\s]+\.*\d*)/.exec($("table.list td:contains(Средняя зарплата)", data).text())[2].replace(" ", "");
            // уровень квалификации
            var Q = $("#apprisedEmployeeLevel", data).text();
            /(\d+\.*\d+)\D*(\d+\.*\d+)/.exec($("span:contains(требуется)", data).text() );
            // средняя квалификация по городу
            var Qavg = new Number(RegExp.$1);
            // требуемый уровень квалификации
            var Qreq = new Number(RegExp.$2);
            // требуемая зарпдата
            var Sreq = S;
            if (action=='==') {
                Qreq = parseFloat( $("#kvala_set").val() );
                console.log('action ========');
            }

            if (action=='100%'){
                Sreq = Savg;
            }else {
                var k = S/Savg;
                var k1 = k*k;
                if(k <= 1){
                    b = (Q/k1);
                    Sreq = Math.sqrt(Qreq/b)*Savg;
                    // если зарплата превысила среднею
                    if( Sreq/Savg > 1){
                        b = b / Qavg;
                        b = 2 * Math.pow(0.5, b);
                        Sreq = (Math.pow(2, Qreq/Qavg)*b - 1)*Savg;
                    }
                } else {
                    b = (k+1)/Math.pow(2, Q/Qavg);
                    Sreq = (Math.pow(2, Qreq/Qavg)*b - 1)*Savg;
                    // если зарплата стала меньше средней;
                    if(Sreq/Savg < 1){
                        b = Qavg * Math.log(b/2)/Math.log(0.5);
                        Sreq = Math.sqrt(Qreq/b)*Savg;
                    }
                }
                if(action=='1:1+'){
                    Sreq = Sreq*1.01;
                }

                // блокировка от потери обученности
                if (Sreq/Savg <= 0.80){
                    Sreq = Math.floor(0.80 * Savg) + 1;
                }
            }
            //получаем новое значение квалификации
            /(.*)window(.*)engage(.*)/.exec(url);//url калькулятора
            var calcUrl = RegExp.$1 + "ajax/unit/employees/calc_new_lvl" + RegExp.$3;
            $.ajax({url : calcUrl, data:{employees:quantity, salary:Sreq},type:'get',dataType:'json',
                success:function(data){
                    $('a',objLevel).text(data["employees_level"]);//заменяем значение квалы на странице
                    //отправляем форму на сервер
                    $.ajax({url : url, type : "post", data : {'unitEmployeesData[quantity]' : quantity, 'unitEmployeesData[salary]' : getSalary(Sreq)},
                        success : function(){//заменяем абсолютную и относительную ЗП на странице
                            set_ok(objSalary, Sreq, Savg);
                        }}).fail(function (jqXHR, textStatus, error){
                        console.log("FAIL (post) {textStatus=" + textStatus + ", error=" + error + "}");
                        objSalary.prev().append("p")
                        setTimeout(
                            set_ok(objSalary, Sreq, Savg),
                            350 + Math.random()*550
                        )
                    });
                }
            }).fail( function (jqXHR, textStatus, error) {
                console.log("FAIL (calcUrl) {textStatus=" + textStatus + ", error=" + error + "}");
                objSalary.prev().append("c")
                setTimeout(setSalary(url, objSalary, objLevel, action), 350 + Math.random()*350);
            });
        })
            .fail( function (jqXHR, textStatus, error){
                console.log("FAIL {textStatus=" + textStatus + ", error=" + error + "}");
                let lstr = objSalary.prev().text().length;

                if ( objSalary.prev().text().length % 32 == 1 ) {
                    objSalary.prev().append("<br>");
                }
                objSalary.prev().append("!")
                setTimeout(setSalary(url, objSalary, objLevel, action), 350 + Math.random()*550 + lstr * 10);
            });
    }//end function setSalary

    function setEducation(url, objLevel, srcElement){
        $.get(url, function(data){
            var quantity = $("#unitEmployeesData_employees", data).val();
            var time = $("#unitEmployeesData_timeCount", data).val();
            if(quantity != undefined && time != undefined){
                $.ajax({url : url, type : "post", data : {'unitEmployeesData[employees]' : quantity, 'unitEmployeesData[time_count]' : 4}, success : function(){
                        if(!($("div", objLevel).is('.sizebar')))
                            objLevel.append($("<div title='Оставшиеся недели обучения: 4' class='sizebar'>■■■■</div>"));
                        else $("div.sizebar", objLevel).text('■■■■');
                        srcElement.style.border = "1px solid red";
                        srcElement.title = "Отменить обучение";
                    }});
            } else {
                if(($("div:last", objLevel).prop('title')).slice(-1) == 4){
                    $.get(url + "/cancel", function(){
                        srcElement.style.border = "0px";
                        srcElement.title = "Обучить весь персонал 4 недели";
                        $('div:last',objLevel).empty();
                    });
                }
            }//end else
        });//end get
    }//end function setEducation

    var wc_input = $("<td><div id=set11 class=my_div>Квалификация:<input id=kvala_set size=6 type=text value='6' style='margin:8px 2px 2px 2px;'/></div");
    $("#filterDiv table tr").append( wc_input );
    $("#kvala_set").change( function(){
        $(".kv_set").text("=" + $(this).val() );
    });

    // везде, где требуется нажать кнопку по заданному значению
    var wc_set11 = $("<div class='my_div click_div'>set 1:1</div>");
    $("#set11").after( wc_set11 );
    wc_set11.click(function(){
        var list_tr = $("a[href*='unit/employees/education']");
        for(var i=0; i< list_tr.length; i++){
            var kv_current = parseFloat( list_tr.eq(i).text() );
            var kv_required = parseFloat( list_tr.eq(i).parent().next().text() );

            //console.log( kv_current + " == " + kv_required );
            if ( kv_current == kv_required ) continue;
            if ( kv_current == 0 ) continue;
            if ( kv_current > kv_current ) continue;

            var tr = list_tr.eq(i).parent().parent();
            //console.log( tr.text() );
            var el = $(".kv11", tr);
            //el.click();
            setTimeout(function(item){item.click();}, i*350, el);
        }

    });

    var wc_mass_set = $("<div class='my_div click_div'>mass set</div>");
    $("#set11").after( wc_mass_set );
    wc_mass_set.click(function(){
        var list_tr = $("a[href*='unit/employees/education']");
        //alert("wc_set11.click");
        //console.log( list_tr );
        //console.log( "wc_set11.click" );
        let step = 350;
        if ( list_tr.length > 50 ) {
            step += (list_tr.length- 50)/4;
            if ( step > 600 ) step = 600;
        }
        for(var i=0; i< list_tr.length; i++){
            var tr = list_tr.eq(i).parent().parent();
            var el = $(".kv_set", tr);
            //el.click();
            setTimeout(function(item){item.click();}, i*step, el);
        }
    });

    var wc_mass_edu = $("<div class='my_div click_div'>edu</div>");
    $("#set11").after( wc_mass_edu );
    wc_mass_edu.click(function(){
        var list_tr = $("a[href*='unit/employees/education']");
        //alert("wc_set11.click");
        //console.log( list_tr );
        //console.log( "wc_set11.click" );
        for(var i=0; i< list_tr.length; i++){
            var tr = list_tr.eq(i).parent().parent();
            var el = $(".edu", tr);
            //el.click();
            setTimeout(function(item){item.click();}, i*350, el);
        }
    });


    $("table.list tr:gt(0):has(:checkbox)").each(function(){
        var url = $("td a[title*='Сотрудники']", this).attr('href');
        var objSalary = $("td:eq(6)", this);
        var objSalary2 = $("td:eq(6)>span:first", this);
        var aaa=parseFloat( objSalary2.text() );

        var color=aaa>89?"blue":'rgb(150,170,10)';
        color=aaa<81?'rgb(111,165,55)':color;
        color=aaa<80?'red':color;
        var font=aaa>81?"bold":'';
        font=aaa<80?"bold":font;
        objSalary2.css({'color':color,'fontWeight':font,'fontSize':'9px'});
        var objLevel = $("td:eq(8)", this);
        var ccc=$('td:eq(2)',this);
        var container = $("td:eq(7)", this);
        container.append($("<br><span title='Среднегородская зарплата'>100%</span>").click(function(){
            setSalary(url, objSalary, objLevel, "100%");
        }));
        container.append($("<span class=kv11 title='Согласно требуемой квалификации'>1:1</span>").click(function(){
            setSalary(url, objSalary, objLevel, "1:1");
        }));
        container.append($("<span class=kv11p  title='Согласно требуемой квалификации с запасом'>1:1+</span>").click(function(){
            setSalary(url, objSalary, objLevel, "1:1+");
        }));
        container.append($("<span class=kv_set title='Согласно указанной квалификации'>="+ $("#kvala_set").val() +"</span>").click(function(){
            setSalary(url, objSalary, objLevel, "==" );
        }));
        var length = $('div.sizebar',this).prop('title');
        if(length){length=length.slice(-1);}else length=0;
        if( length == 0 || length == 4){
            container.append($("<img class=edu>").attr({src: "/img/reward/16/diploma.gif", title:'Обучить весь персонал 4 недели'})
                .css({position:'relative', top:'5px',margin:'0px', paddingLeft:'2px', paddingRight:'2px', cursor:'pointer', border:'0px', borderRadius:'3px'})
                .click(function(e){
                    if (window.event) e = window.event;
                    srcEl = e.srcElement? e.srcElement : e.target;
                    /(.*)window(.*)engage(.*)/.exec(url);//url обучения
                    urlEducation = RegExp.$1 + "window/unit/employees/education" + RegExp.$3;
                    setEducation(urlEducation, ccc, srcEl);
                }));
        }
        if(length == 4) $("img", container).css({border:'1px solid red'}).attr({title:'Отменить обучение'});

        $("span",container).css({fontSize:'75%',margin:'1px', padding:'1px', border:'1px solid #2222ff', borderRadius:'3px', cursor:'pointer'})
            .hover(function () {this.style.color = 'red';},function () {this.style.color = 'black';});
    });

}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}