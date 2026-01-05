// ==UserScript==
// @name         Easier Lids Routing Request Form and AutoFill
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.5.2.3
// @description  makes submitting Lids routing requests easier by auto-filling some fields
// @match        http://www.genescopartners.com/routing_request_form_online.php?busgroup=LD&mail=TRUE
// @grant        none
// @copyright    2012+, Saibotshamtul
// @downloadURL https://update.greasyfork.org/scripts/7393/Easier%20Lids%20Routing%20Request%20Form%20and%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/7393/Easier%20Lids%20Routing%20Request%20Form%20and%20AutoFill.meta.js
// ==/UserScript==
debug = function(x){
    //console.log(x);
};

// Version 0.5.2 page was updated 3/1/2018 so I had to take those changes into account.

debug(0);
//window.wrappedJSObject.dq = function(x){return document.querySelector("[name="+x+"]")}
window.wrappedJSObject.dq = function(x,y,parents){
    a = document.querySelector("[name="+x+"]");
    if (y!==undefined){
        if (parents==1){
            a.parentNode.style.color="lightblue";
        }
        if (parents==2){
        //a.parentNode.parentNode.parentNode.style.color="lightblue";
            a.parentNode.parentNode.style.color="lightblue";
        }
        if (parents==3){
            a.parentNode.parentNode.parentNode.style.color="lightblue";
        }
    }
    return a;};
window.wrappedJSObject.dqa = function(x){return document.querySelectorAll("[name="+x+"]");};
window.wrappedJSObject.g = function(x){
    //x.parentNode.parentNode.parentNode.style.color="lightblue";
    x.parentNode.parentNode.style.color="lightblue";
};

debug(1);
//window.wrappedJSObject.Validate = function(x){}
//window.wrappedJSObject.ValNumbers = function(x){}

//make these less visible
    dq("FAX_NUMBER_AREA_CODE",1,3);
    g(dqa("WILL_ASN_BE_SENT")[1]);
    dq("PHONE_PICK_UP_LOCATION_AREA_CODE",1,3);
debug(2);
    dq("COMPANY_NAME",1,3).value="Outerstuff/Statco";
    dq("CONTACT_NAME",1,3).value="Michael Cimino";
    dq("CONTACT_PHONE_AREA_CODE",1,3).value="201";
    dq("CONTACT_PHONE_3").value="792";
    dq("CONTACT_PHONE_4").value="7000";
    dq("CONTACT_PHONE_EXTENSION").value="278";
    dq("email",1,2).value="michaelc@statcowhse.com";
    dqa("WILL_ASN_BE_SENT")[1].checked=true;
    dq("ADDRESS_LINE_1",1,3).value="Outerstuff/Statco";
    dq("ADDRESS_LINE_2").value="301 16th Street";
    dq("CITY").value="Jersey City";
    dq("STATE").value="NJ";
    dq("ZIP").value="07310";
debug(3);
    dq("FROM_SHIPPING_HOUR",1,3).value=10;
    dq("FROM_SHIPPING_MINUTE").value="00";
    dq("TO_SHIPPING_HOUR").value="04";
    dq("TO_SHIPPING_MINUTE").value="00";
    dq("TO_SHIPPING_AMPM").value="PM";

    dq("VENDOR_CONTACT_NAME",1,3).value = "Gina Kuchinski";
    dq("VENDOR_CONTACT_EMAIL",1,2).value = "GinaK@outerstuff.com";
    dq("WAREHOUSE_NAME",1,2).value = "Statco Warehouse";
    dq("freight",1,1).value = "150";

    document.querySelectorAll("[name=WILL_ASN_BE_SENT]")[0].click();
    document.querySelectorAll("[name=WILL_ASN_BE_SENT]")[0].parentNode.parentNode.parentNode.style.color="lightblue";

debug(4);
// auto-pick this month, tomorrow, and this year
function autoPickTomorrow(){
    console.log('date pick tomorrow try');
    try{
        mydate = new Date();
        dq('DATE_READY_MONTH').options[mydate.getMonth()].selected=true;
        dq('DATE_READY_DAY').options[mydate.getDate()].selected=true;
        dq('DATE_READY_YEAR').options[0].selected=true;
    }
    catch(e){
        setTimeout(autoPickTomorrow,2000);
    }
}
autoPickTomorrow();
debug(5)    ;
// make some fields auto-calculate themselves
    for (b=1;b<16;b++){
        if (b==1){
            dq("CARTON_LINE_"+b).setAttribute("onchange",'dq("CUBE_LINE_'+b+'").value= Math.ceil(dq("CARTON_LINE_'+b+'").value*1.5);');
        } else {
            dq("CARTON_LINE_"+b).setAttribute("onchange",'dq("CUBE_LINE_'+b+'").value= Math.ceil(dq("CARTON_LINE_'+b+'").value*1.5);dq("DC_LINE_'+b+'").value=dq("DC_LINE_'+(b-1)+'").value');
        }
        dq("PAIRS_LINE_"+b).setAttribute("onchange",'dq("WEIGHT_LINE_'+b+'").value=Math.floor(dq("PAIRS_LINE_' +b+'").value/72*31);');
        //dq("PAIRS_LINE_"+b).setAttribute("onchange",'dq("WEIGHT_LINE_'+b+'").value=Math.floor(dq("PAIRS_LINE_' +b+'").value/72*31);dq("pallets_line_'+b+'").value=Math.round(dq("WEIGHT_LINE_'+b+'").value/500);');

        //dq("PO_NUMBER_LINE_"+b).setAttribute("onchange",'dq("plength_line_'+b+'").value=48;dq("pwidth_line_'+b+'").value=48;dq("pheight_line_'+b+'").value=40;dq("freight_class_'+b+'").value=100;')
        //dq("PO_NUMBER_LINE_"+b).setAttribute("onchange",'dq("plength_line_'+b+'").value=48;dq("pwidth_line_'+b+'").value=48;dq("pheight_line_'+b+'").value=40;dq("freight_class_'+b+'").value=100;if(dq("PO_NUMBER_LINE_'+b+'").value.length<6){dq("PO_NUMBER_LINE_'+b+'").value=("000000"+dq("PO_NUMBER_LINE_'+b+'").value).slice(-6);}');
        dq("PO_NUMBER_LINE_"+b).setAttribute("onchange",'if(dq("PO_NUMBER_LINE_'+b+'").value.length<6){dq("PO_NUMBER_LINE_'+b+'").value=("000000"+dq("PO_NUMBER_LINE_'+b+'").value).slice(-6);}');
    }
debug(6);
// "force" a file to be attached
    dq("Submit").disabled=true;
    dq("file1").setAttribute("onclick",'dq("Submit").disabled=false');
debug(7);
// button_handler to calculate totals
window.wrappedJSObject.CalcTotals = function(){
    po=0;unit=0;ctn=0;lbs=0;skid=0;
    for (b=1;b<16;b++){
        //po+=Number(dq("PO_NUMBER_LINE_"+b).value)
        po+=Number(dq("PO_NUMBER_LINE_"+b).value>0);
        unit+=Number(dq("PAIRS_LINE_"+b).value);
        ctn+=Number(dq("CARTON_LINE_"+b).value);
        lbs+=Number(dq("WEIGHT_LINE_"+b).value);
        //skid+=Number(dq("pallets_line_"+b).value);
    }
    dq("Total_POs").value=po;
    dq("Total_Pcs").value=unit;
    dq("Total_Ctns").value=ctn;
    dq("Total_Wgt").value=lbs;
    //dq("Total_Skids").value=skid;
    return;
};

// add a Totals field at the bottom of the page
//                       TD          TR        TBODY     TABLE      TD
a = document.forms[0].parentNode.parentNode.parentNode.parentNode.parentNode;
b = "<tr><td>Total POs:<br/><input size=5 name='Total_POs'></td><td>Total Units:<br/><input size=7 name='Total_Pcs'></td><td>Total Ctns:<br/><input size=5 name='Total_Ctns'></td><td>Total Weight:<br/><input size=7 name='Total_Wgt'></td><td>Total Pallets:<br/><input size=5 name='Total_Skids'></td><td><button onclick='CalcTotals(1)'>GetTotals</button></td></tr>";
c = document.createElement("TABLE");
c.innerHTML = b;
a.appendChild(c);
debug(8);
//fix stupid Lids mistake
    function myLoadDay(thisMo,thisDay,thisYear)
    {
        selDay = thisDay.selectedIndex;
        myDays = thisDay.options.length;
        for (i=0;i<myDays;i++) thisDay.options.remove(0);
        myMo = (thisMo.selectedIndex +1);

        modays = 31;

        if ((myMo == 4)||(myMo == 6)||(myMo == 9)||(myMo == 11)) modays = 30;
        if (myMo == 2){
            modays = 28;
            selYr = thisYear.selectedIndex;
            if (selYr != (-1))
            {
                //myYr = thisYear.options(selYr).Value;
                myYr = thisYear.value;
                if (myYr%4 === 0) modays = 29;
            }
        }

        for (d=0;d<modays;d++){
            var dOption = document.createElement("OPTION");
            thisDay.options.add(dOption);
            dOption.innerHTML = d+1;
            dOption.Value = d+1;
        }
        thisDay.selectedIndex = selDay;
    }
    window.wrappedJSObject.LoadDay = myLoadDay;

    function easyParseData(){
        mydata = prompt('data');
        window.mydata = mydata.split(",");
        window.currow = 1;
        window.passData = function(){
            if (window.mydata.length > 0){
                temp = [0,0,0,0,0];
                for (var b in temp){
                    popped = window.mydata.splice(0,1).toString();
                    temp[b] = popped;
                }
                b = window.currow;
                dq("PO_NUMBER_LINE_"+b).value = temp[1];
                dq("PO_NUMBER_LINE_"+b).onchange();
                dq("CARTON_LINE_"+b).value = temp[2];
                dq("CARTON_LINE_"+b).onchange();
                dq("PAIRS_LINE_"+b).value = temp[3];
                dq("PAIRS_LINE_"+b).onchange();
                dq("WEIGHT_LINE_"+b).value = temp[4];

                if (temp[0] === "DC"){
                    dq('DC_LINE_'+b).children[1].selected = true;
                } else {
                    dq('DC_LINE_'+b).children[2].selected = true;
                }
                window.currow++;
                setTimeout(window.passData,750);
            }
        };
        window.passData();
    }
spot = document.querySelectorAll(".horizontal_menu")[3];
spot.onclick = easyParseData;
spot.innerHTML="<span style='color:#060'>"+spot.innerHTML+"</span>";

