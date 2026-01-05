// ==UserScript==
// @name         Enocta Canlı Dersler
// @namespace    #
// @version      1.2
// @description  Amasya Üniversitesi Enocta Kolay Canlı Ders Ekleme Scripti
// @author       halil ceyhan
// @grant        none
// @require     https://code.jquery.com/jquery-1.11.2.min.js
// @include 		http://www.myenocta.com/amasya/*
// @downloadURL https://update.greasyfork.org/scripts/8553/Enocta%20Canl%C4%B1%20Dersler.user.js
// @updateURL https://update.greasyfork.org/scripts/8553/Enocta%20Canl%C4%B1%20Dersler.meta.js
// ==/UserScript==

$(document).ready(function(){
    $("#divMainContainer").css('margin-left','350px');
    var from =$("tr.Cell01 td").eq(2).text().split(" ")[0].split(".");
    var f = new Date(from[2], from[1] - 1, from[0]); 
    f = f.toString().split(" ")[0];
    var s =$("#ctl00_cphMain_ctl01").val().split(".");
    var k = new Date(s[2], s[1] - 1, s[0]); 
    k = k.toString().split(" ")[0];
    $("#GMDatePicker_ctl00_cphMain_ctl01").append(" " +gunler(k));
    var tr =$("#ctl00_cphMain__tblList tr");
    for(var i=0;i<tr.length;i++){
    $("#ctl00_cphMain__tblList tr").eq(i).find("td").eq(2).append(gunler(f));
    }
  
    function gunler(str)
    {
        if(str =="Mon"){
           return "Pazartesi";
        }
        if(str =="Tue"){
           return "Salı";
        }
        if(str =="Wed"){
           return "Çarşamba";
        }
        if(str =="Thu"){
           return "Perşembe";
        }
        if(str =="Fri"){
           return "Cuma";
        }
        if(str =="Sat"){
           return "Cumartesi";
        }
        if(str =="Sun"){
           return "Pazar";
        }
    }
    
    $("#divError").hide(1000);
   /* $( "input[name='ctl00$cphMain$ctl07']" ).attr("checked","checked");
    $("select[name='ctl00$cphMain$ctl02'] option").eq(8).attr("selected", "selected");*/
    $("#tdMenu3 tbody tr").append('<td id="dersdegis" class="SubMenu">Ders Değiştir</td>');
    $("#dersdegis").click(function(){
    window.location.href="http://www.myenocta.com/amasya/akademik50/ASPX/Advisor/section_switch.aspx";
    });
    
    var aktifders = $("#spnActiveSession").html().split(". Aktif")[0].split("</b>");
    var aktifders2 = $.trim($("#spnActiveSession").text().split("ubeniz: ")[1]);
   var url =String(window.location);
   var urlkontrol = url.split("?");
   if(urlkontrol[0]=="http://www.myenocta.com/amasya/akademik50/ASPX/Advisor/adobe_meeting_list.aspx"){
   var getdegeri = url.split("adobe_meeting_list.aspx?")[1];
    $("#divTitle").append("<button id='yenidersekle' onclick='return false;'>Haftasına Canlı Ders Ekle </button>");
    }    
    $("#yenidersekle").click(function(){
        
         $("input:checked").each(
        function(){
           var name = $(this).attr("name"); 
           var geneltablo = $(this).parent();
            var oturumadi  = geneltablo.next().text(); // oturum adi
            var baslangic  = geneltablo.next().next().text();
            var bitis      = geneltablo.next().next().next().text();
           var oturumtarih = baslangic.split(" ")[0];
            var oturumsaatbaslangic = baslangic.split(" ")[1].split(":"); 
            var oturumsaatbitis = bitis.split(" ")[1].split(":");
            var oturumsaati ="01.01.0001 "+ baslangic.split(" ")[1];//oturumsaati
            var kacsaat = parseInt(oturumsaatbitis[0])-parseInt(oturumsaatbaslangic[0]);
            var kacdakika = parseInt(oturumsaatbitis[1])-parseInt(oturumsaatbaslangic[1]);
            var saat = kacsaat*60+kacdakika;
            var dakika =saat%60;
            if(dakika==0){
                dakika="0" + dakika;
            }
            saat = "0" +Math.floor(saat/60);
            var oturumdakika = saat + ":" + dakika +":00";/// kaç dakika
            
            var from = oturumtarih.split(".");
            var f = new Date(from[2], from[1] - 1, from[0]); 
            f.setDate(f.getDate() + 7);
            var date = f;
            var yil = (date.getFullYear());
            var gun = (date.getDate());
            if(parseInt(gun)<10){
                gun = "0" + gun;
            }
            
            var ay =(date.getMonth() + 1);
            if(parseInt(ay)<10){
                ay = "0" + ay;
            }
            var baslangictarihi = gun +"."+ay+"."+yil; //başlangıç tarihi
            var oturumdili = 0 // oturum dili
            var oturumsablonu = "11023"; // oturum şablonu
            var mail = true;   
            var bos = "";
          oturumadi = prompt("Oturum Adını Giriniz",oturumadi);
            
            $.ajax({
                   method: "POST",
                   url: "ASPX/Advisor/adobe_meeting_add.aspx",
                data: {
                       '__EVENTVALIDATION':'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',
                       '__EVENTTARGET':'',
                       '__EVENTARGUMENT':'',
                       'ToolkitScriptManager1_HiddenField':'',
                       '__VIEWSTATE':'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',
                       'ctl00$cphMain$ctl00': oturumadi,
                       'ctl00$cphMain$ctl01$ctl00': baslangictarihi,
                       'ctl00$cphMain$ctl01$ctl01': oturumsaati,
                       'ctl00$cphMain$ctl02':oturumdakika,
                    'ctl00$cphMain$ctl13' : null,
                       'ctl00$cphMain$ctl04':oturumdili,
                       'ctl00$cphMain$ctl05':oturumsablonu,
                    'ctl00$cphMain$ctl06':'',
                    'ctl00$cphMain$ctl09':null,
                       'ctl00$cphMain$ctl07':mail,
                       'ctl00$cphMain$btnField$btnEkle':"Ekle",
                       'ctl00$cphMain$btnField$ctl02':"Geri Dön" 
                      }
                  }).done(function( msg ) {
    $("body").html (msg );
       $('#form1').submit();
  });
        });
    });
});