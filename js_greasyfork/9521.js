// ==UserScript==
// @name           XioScript
// @namespace      Virtonomics
// @description    XioScript with XioFunctions and TopManagerInfo
// @version        9.0
// @include        http://*virtonomic*.*/*/*
// @exclude        http://virtonomics.wikia.com*
// @downloadURL https://update.greasyfork.org/scripts/9521/XioScript.user.js
// @updateURL https://update.greasyfork.org/scripts/9521/XioScript.meta.js
// ==/UserScript==

function XioScript(){

    function addJQuery(){
        var script = document.createElement("script");
        script.setAttribute("src", '//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js');
        script.addEventListener('load', function () {
            var script = document.createElement("script");
            script.textContent = "(" + XioScript.toString() + ")();";
            document.head.appendChild(script);
        }, false);
        document.head.appendChild(script);
    }
    
    function addJQueryUI(){
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/themes/smoothness/jquery-ui.css";
        document.head.appendChild(link);

        var script = document.createElement("script");
        script.setAttribute("src", '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js');
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "(" + XioScript.toString() + ")();";
            document.head.appendChild(script);
        }, false);
        document.head.appendChild(script);
    }
    
    function addCustomStyle(){        
        var style = document.createElement("style");
        style.id = "xioStyle";
        style.type = 'text/css';
        style.innerHTML = ""
			+".unselectable{ -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none;  -ms-user-select: none; user-select: none;}\n"

			+".ui-selected td { background-color: #FEE068 !important;} \n"
			+".ui-selecting td { background-color: #FEE88F !important;} \n"

			+".xfInputs{ display:block; width: 580px; }\n"
			+".xfElement{ border-style: outset; border-color: lightblue; background-color:#ffffff; height: 16px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }\n"
			+".xfMinor{ border-style: outset; background-color:#ffffff; height: 16px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }\n"
			+".xfSelected{ border-color: gold }\n"
			+".xfHide{ display: none; }\n"
			+".xfButtons { margin-right: 10px }\n"
			+".xfButtons:disabled { background: #bbbbbb; }\n"
			+".xfImageFolding { width: 10px; height: 10px; }\n"
			+".xfTextArea { height: 200px; width: 660px; word-break:break-all; }\n"
			+".xfTitle{ font-size: 22px; margin-top: 15px; margin-left: 30px; color: gold; }\n"
			+".xfMinimize{ float: right; text-align: center; color: gold; font-size: 20px; width: 30px; height: 30px; }\n"
			+"#xfMenu{ width: 500px; height: 280px; border-style:ridge }\n"
			+"#xfMain{ height: 170px; width: 440px; margin-top: 15px; margin-left: 30px; background-color: white; overflow-y: scroll; }\n"
			+"#xfActions{ margin-top:15px; margin-left:30px }\n"

			+"#mapName{ font-size:20px; color:gold; }\n"
			+".mapTooltip { background-color: lightgreen !important }\n"
			+"input.mapTooltip, select.mapTooltip { outline: 4px ridge pink !important ; }"
			


			document.getElementsByTagName("head")[0].appendChild(style);      
    }
    
    if(!window.jQuery){
        addJQuery();
        return false;
    }
    
    if(!window.jQuery.ui){
        addJQueryUI();
        return false;
    }
    
    addCustomStyle();
    
    console.log("XioScript is running!");
    
    //Usefull stuff        
    function numberfy(variable){
        return parseFloat(String(variable).replace(/[\s\$\%]/g, "")) || 0;
    }
        
    function spaces(value){
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    var ls = localStorage;
    
    //Top1 and Top3      
    function subdType(){
        var link = $("#unitImage").find($("img")).attr('src');

        var n = link.indexOf('animalfarm');
        if (n > 0) return "farm";

        n = link.indexOf('orchard');
        if (n > 0) return "plantation";

        n = link.indexOf('restaurant');
        if (n > 0) return "restaurant";

        n = link.indexOf('service_light');
        if (n > 0) return "service";

        n = link.indexOf('medicine');
        if (n > 0) return "medical";

        n = link.indexOf('fishingbase');
        if (n > 0) return "fishing";

        n = link.indexOf('lab');
        if (n > 0) return "laboratory";

        n = link.indexOf('workshop');
        if (n > 0) return "factory";

        n = link.indexOf('shop');
        if (n > 0) return "shop";

        n = link.indexOf('office');
        if (n > 0) return "office";

        n = link.indexOf('mill');
        if (n > 0) return "mill";

        n = link.indexOf('mine');
        if (n > 0) return "mine";
        
        n = link.indexOf('farm');
        if (n > 0) return "agriculture";
        
        n = link.indexOf('power');
        if (n > 0) return "power";
        
        return "unknow";
    }
      
    function subdFactor(){
        var factor = 0;
        var mill = false;
        switch(subdType()){
            case "mine":
                factor = 8;
                break;
            case "power":
                factor = 6;
                break;
            case "factory":
                factor = 4;
                break;
            case "agriculture":  //fall-trough
                factor = 1.6;
                break;
            case "plantation":
                factor = 1.2;
                break;
            case "medical":  //fall-trough
            case "fishing":
                factor = 1;
                break;
            case "farm":
                factor = 0.6;
                break;
            case "restaurant": //fall-trough
            case "shop":
            case "laboratory":
                factor = 0.4;
                break;
            case "mill":                
                factor = 0.4;
                mill = true;
                break;
            case "service":
                factor = 0.12;
                break;
            case "office":
                factor = 0.08;
                break;            
        }   
        return [factor, mill];
    }
    
    function calcTop1(empl, qual, factor){
        return Math.pow(5, 1/2*(-1-qual)) * Math.pow(7, 1/2*(-1+qual)) * Math.sqrt(empl / factor);
    }
    
    function calcTop3(empl, factor){
        factor = factor * (1 + subdFactor()[1]*9);
        return (-15*factor+Math.sqrt(225*factor*factor + 4*factor*empl))/(10*factor);
    }
    
    function calcQualification(empl, manager, factor){
        var value = -Math.log(empl/(35*factor*manager*manager))/Math.log(7/5);
        return Math.floor(value*100)/100;
    }
    
    function calcEmployees(qual, manager, factor){
        var value = Math.pow(5,1+qual) * Math.pow(7, 1-qual) * factor * manager * manager;
        return Math.floor(value);
    }
    
    function calcMaxEmployees(manager, factor){        
        factor = factor * (1 + subdFactor()[1]*9); //Mills are specials       
        return 25 * factor * manager * (manager + 3);
    }
    
    function calcMaxTech(manager){
        return Math.floor(Math.pow(manager*156.25, 1/3));
    }
    
    function calcManagerTech(techLevel){
        return Math.pow(techLevel, 3)/156.25;
    }
    
    function calcEquipment(qualification){
        return Math.floor(Math.pow(qualification, 1.5)*100)/100;
    }
    
    function calcEfficiency(employees, allEmployees, manager, factor, qualification, techLevel){
        var effi = [];
        effi[0] = 100;
        effi[1] = manager * calcMaxEmployees(manager, factor) / allEmployees / calcTop1(employees, qualification, factor) * 100;
        effi[2] = manager / calcTop1(employees, qualification, factor) * 6/5 * 100;
        effi[3] = calcMaxEmployees(manager, factor) / allEmployees * 6/5 * 100;
        effi[4] = manager / calcManagerTech(techLevel) * calcMaxEmployees(manager, factor) / allEmployees * 100;
        effi[5] = manager / calcManagerTech(techLevel) * 6/5 * 100;
        
        console.log(effi);
        return (Math.round(Math.min.apply(null, effi)*10)/10).toFixed(2) + "%";
    }
    
    function placeText($place, text, value, special){
        if(special){
            $place.html("<span style='color:blue'>"+text+"<input id=customManager value="+value+" style='width:25px'></span><br>"+$place.html());
        }
        else{
            $place.html($place.html()+"<br><span style='color:purple' class='xioTop'><b>"+value+"</b>"+text+"</span>");
        }
        
    }
    
    function makeRed($place, value, maxValue){
        if(value > maxValue){
            $place.css("color", "red");
        }
    }
            
    function seeTops(){
              
        var $qualRow = $("tr:contains('Qualification of employees'), tr:contains('Qualification of scientists'), \n\
                          tr:contains('Workers qualification')");
        var $levelRow = $("tr:contains('Qualification of player')");
        var $empRow = $("tr:contains('Number of employees'), tr:contains('Number of scientists'),\n\
                            tr:contains('Number of workers')");
        var $totalEmpRow = $("tr:contains('profile qualification')");
        var $techRow = $("tr:contains('Technology level'), tr:contains('Current research')");
        var $equipRow = $("tr:contains('Equipment quality'), tr:contains('Computers quality'),\n\
             tr:contains('Livestock quality'), tr:contains('Quality of agricultural machines')");
        var $effiRow =  $("tr:contains('Top manager efficiency')");       
        
        var amount = numberfy($empRow.find("td:eq(1)").text());
        var qual = numberfy($qualRow.find("td:eq(1)").text());
        var level = numberfy($levelRow.find("td:eq(1)").text());
        var factor = subdFactor()[0];
        var totalEmp = numberfy($totalEmpRow.find("td:eq(1)").text());
        var tech = numberfy($techRow.find("td:eq(1)").text());
        var eqQual = numberfy($equipRow.find("td:eq(1)").text());
        
        var topQual = calcQualification(amount, level, factor);
        var topEmp = spaces(calcEmployees(qual, level, factor));
        var maxEmp = spaces(calcMaxEmployees(level, factor));
        var topTech = calcMaxTech(level);
        var topEqQual = calcEquipment(qual);
        var effi = calcEfficiency(amount, totalEmp, level, factor, qual, tech);
        var top1 = Math.round(calcTop1(amount, qual, factor)*10)/10;
        var top3 = Math.round(calcTop3(totalEmp, factor)*10)/10;
        
        placeText($empRow.find("td:eq(1)")," (Maximum amount of employees with this employee qualification)", topEmp);       
        placeText($qualRow.find("td:eq(1)")," (Maximum employee qualification with this amount of employees)", topQual);
        placeText($totalEmpRow.find("td:eq(1)")," (Maximum amount of employees in all subdivisions)", maxEmp);
        placeText($techRow.find("td:eq(1)")," (Maximum technology level with this top manager qualification)", topTech);
        placeText($equipRow.find("td:eq(1)")," (Maximum equipment quality with this employee qualification)", topEqQual);
        placeText($effiRow.find("td:eq(1)")," (Expected top manager efficiency with these settings"+(subdFactor()[1]?", <b>but not correct for mills</b>":"")+")", effi);
        placeText($levelRow.find("td:eq(1)")," (Top 1)", top1);
        placeText($levelRow.find("td:eq(1)")," (Top 3)", top3);
//        placeText($levelRow.find("td:eq(1)"), "Custom Qualification: ", level, true);
        
        makeRed($empRow.find("td:eq(0)"), amount, topEmp);
        makeRed($qualRow.find("td:eq(0)"), qual, topQual);
        makeRed($totalEmpRow.find("td:eq(0)"), totalEmp, maxEmp);
        makeRed($techRow.find("td:eq(0)"), tech, topTech);
        makeRed($equipRow.find("td:eq(0)"), eqQual, topEqQual);
        
//        $("body").delegate("#customManager", "change", function(){
//           $("span[style*=purple]").each(function(){
//               this.css("color", "blue");
//           });
//        });       
    }

    //Core XioFunctions
    var $xfSelect = null;
    
    function setXfDefault(){
        //Make the things clickable that have to be clickable and run the menu function

        ls.xfData = ls.xfData || '[]';
		
		setXfMain();

        $("body").delegate(".xfImageFolding", "click", function(event){
            event.stopPropagation();
            if(!document.getElementById("xfDialog")){
                this.parentNode.xf.close = true;
                updateXfDataFromList();
                setXfMain();
            }
        });
        $("body").delegate(".xfElement, .xfMinor", "click", function(event){
            event.stopPropagation();
            if(!document.getElementById("xfDialog")){
                if($xfSelect !== null){
                    $xfSelect.removeClass("xfSelected");
                }
                $(this).addClass("xfSelected");
                $xfSelect = $(this);
                updateXfButtons();
            }
        });
        $("body").delegate("#xfMain", "click", function(){
            if(!document.getElementById("xfDialog")){
                if($xfSelect !== null){
                    $xfSelect.removeClass("xfSelected");
                }
                $xfSelect = null;
                updateXfButtons();
            }
        });
    }
    
    function setXfMain(){
        //Transform the xfData into readable divs, and initiate the buttons update function

        var data = JSON.parse(ls.xfData);
        $("#xfMain").empty();
        $xfSelect = null;

        function levelJSON(array, level, type, parName, parType){
            level++;
            if(type === "content"){
                for(var i = 0; i < array.length; i++){
                    if(array[i].delete === true){
                        array.splice(i, 1);
                        i--;
                        continue;
                    }

                    var div = document.createElement("div");
                    div.classList.add("xfElement");
                    div.style.marginLeft = (15*(level-1))+"px";
                    $("#xfMain").append(div);

                    if(array[i].close === true && array[i].open === true){
                        array[i].open = false;
                        delete array[i].close;
                    }
                    else if(array[i].close === true && array[i].open === false){
                        array[i].open = true;
                        delete array[i].close;
                    }

                    div.xf = {
                        minor: false,
                        level: level,
                        parName: parName,
                        parType: parType
                    };
                    if(array[i].open === true){
                        div.innerHTML = '<img class="xfImageFolding" src="/img/down_gr_sort.png"> '+array[i].type +": "+array[i].name;

                        for(var key in array[i]){
                            div.xf[key] = array[i][key];

                            if(["name", "type", "open", "level", "close", "minor", "parName", "parType", "content"].indexOf(key) === -1){
                                levelJSON(array[i][key], level, key, array[i].name, array[i].type);
                            }
                        }

                        if(array[i].content){
                            levelJSON(array[i].content, level, "content", array[i].name, array[i].type);
                        }
                    }
                    else{
                        div.innerHTML = '<img class="xfImageFolding" src="/img/up_gr_sort.png"> '+array[i].type +": "+array[i].name;
                        for(var key in array[i]){
                            div.xf[key] = array[i][key];
                        }
                    }
                }
            }
            else{
                var div = document.createElement("div");
                div.classList.add("xfMinor");
                div.textContent = type +": "+array;
                div.style.marginLeft = (15*(level-1))+"px";
                div.xf = {
                    minor: true,
                    level: level,
                    parName: parName,
                    parType: parType,
                    category: type,
                    value: array
                };

                $("#xfMain").append(div);
            }
        }

        levelJSON(data, 0, "content", null, null);
        ls.xfData = JSON.stringify(data);
        $xfSelect = null;
        updateXfButtons();
    }

    function updateXfButtons(){
        var allArray = ["#xfRun", "#xfNew", "#xfEdit", "#xfDelete", "#xfCode"];
        var enableArray = [];

        var type = getXfSelectType();
        if(type === false){
            enableArray = ["#xfNew"];
        }
        else if(type === "Minor"){
            enableArray = ["#xfEdit"];
        }
        else if(type === "XioProgram"){
            enableArray = ["#xfRun", "#xfNew", "#xfEdit", "#xfDelete", "#xfCode"];
        }
		else if(type === "Empty"){
            enableArray = ["#xfEdit", "#xfDelete", "#xfCode"];
        }
        else if(["XioInfo", "XioUpdate"].indexOf(type) >= 0){
            enableArray = ["#xfEdit", "#xfDelete"];
        }
        else if(!type){
            enableArray = ["#xfDelete"];
        }
        else{
            enableArray = ["#xfEdit", "#xfDelete"];
        }
        
        for(var i = 0; i < allArray.length; i++){
            if(enableArray.indexOf(allArray[i]) >= 0){
                $(allArray[i]).removeAttr("disabled");
            }
            else{                
                $(allArray[i]).attr("disabled", true);
            }
        }
    }  
    
    function updateXfDataFromList(){
        ls.xfData = elementsToCode($(".xfElement"), 1);
    }

    function getXfSelectType(){
        return $xfSelect? ($xfSelect[0].xf.minor? "Minor" : $xfSelect[0].xf.type) : false;
    }

    function elementsToCode($elements, minLevel){
        var maxLevel = 1;
        var array = $elements.map(function(){
            maxLevel = Math.max(maxLevel, this.xf.level);
            var block = this.xf;
            if(block.content && block.open === true){
                block.content = [];
            }
            return block;
        }).get();

        for(maxLevel; maxLevel > 0; maxLevel--){
            if(maxLevel > minLevel){
                for(var i = 0; i < array.length; i++){
                    if(array[i].level === maxLevel){
                        array[i].level = undefined;
                        array[i].parName = undefined;
                        array[i].parType = undefined;
                        array[i].minor = undefined;
                        array[i].head = undefined;
                        var spliced = array.splice(i, 1)[0];
                        array[i-1].content.push(spliced);
                        i--;
                    }
                }
            }
            else{
                for(var i = 0; i < array.length; i++){
                    array[i].level = undefined;
                    array[i].parName = undefined;
                    array[i].parType = undefined;
                    array[i].minor = undefined;
                    array[i].head = undefined;
                }
            }
        }
        return JSON.stringify(array);
    }

    function xfMinimize(){
        //If the minimize button is pressed, remove the menu interface and 'replace' it with a button.
        //Also works the other way around.

        var $xfMenu = $("#xfMenu");
        var $xfHidMenu = $("#xfHidMenu");

        if($xfMenu.hasClass("xfHide")){
            $xfMenu.removeClass("xfHide");
            $xfHidMenu.addClass("xfHide");
        }
        else{
            $xfMenu.addClass("xfHide");
            $xfHidMenu.removeClass("xfHide");
        }

        updateXfStyle();
    }

    function xfStyle(){
        //Set the style on page load.
        //If the ls.xfStyle is not present, it is created and set to standard values.
        //Using the values in ls.xfStyle, the Menu and Main width and height are edited.

        ls.xfStyle = ls.xfStyle || "{}";
        var xfStyle = JSON.parse(ls.xfStyle);
        var $xfMenu = $("#xfMenu");
        var $xfMain = $("#xfMain");
        xfStyle.height = xfStyle.height || $xfMenu.height();
        xfStyle.width = xfStyle.width || $xfMenu.width();

        var dHeight = xfStyle.height - $xfMenu.height();
        var dWidth = xfStyle.width - $xfMenu.width();
        $xfMenu.height(xfStyle.height).width(xfStyle.width);
        $xfMain.height($xfMain.height()+dHeight).width($xfMain.width()+dWidth);

        ls.xfStyle = JSON.stringify(xfStyle);
    }

    function updateXfStyle(){
        //Updates the ls.xfStyle through user-changes.
        var $xfMenu = $("#xfMenu");
        var xfStyle = {
            height: $xfMenu.height(),
            width: $xfMenu.width(),
            minimize: String($xfMenu.hasClass("xfHide"))
        }
        ls.xfStyle = JSON.stringify(xfStyle);
    }

    function initiateSelecting(){
        //Enables the yellow selecting on the main page.

        var first = true;
        var selector = "tr:not(.unit_comment)";

        $('table.unit-list-2014').selectable({
            filter: selector,
            tolerance: 'touch',
            cancel: ':input,option,a'
        });
    }

    //Button XioFunctions

    function xfRun(){
        //Map all ids of the selected rows
        var $selected = $(".ui-selected");
        var subIds = $selected.map(function(){
            return parseFloat($(this).find(".unit_id").text());
        }).get();
		
		xvar.mainList = [];
		xvar.mainList[0] = {};
		xvar.mainList[0].subId = subIds;
		
		//Find the selected program in the xfData and start the process
        var programName = $(".xfSelected")[0].xf.name;
        var programs = JSON.parse(ls.xfData);
        for(var i = 0; i < programs.length; i++){
            if(programs[i].name === programName){
                xpcProgram(programs[i]);
            }
        }
    }

    function xfNew(){

        var type = getXfSelectType();

        //Get the previous type if the type is repeat
        var parType = $xfSelect? ($xfSelect[0].xf.parType) : false;

        var typeSelect = {
            "XioProgram":[
                {id:"xfName", text:"Name", type:"text", value:""},
                {id:"xfType", text:"Type", type:"select", value:["XioInfo", "XioUpdate"]}
            ],
            "XioInfo":[
                {id:"xfName", text:"Name", type:"text", value:""},
            ],
			"XioUpdate":[
                {id:"xfName", text:"Name", type:"text", value:""},
            ],
            false:[
                {id:"xfName", text:"Name", type:"text", value:""},
                {id:"xfType", text:"Type", type:"select", value:["XioProgram", "Empty"]}
            ]
        };

        var chosenSelect = {
            "XioProgram":[
                {text:"fire", value:""}
            ],
            "XioInfo":[
                {text:"map", value:""},
                {text:"after", value:""}
            ],
			"XioUpdate":[
                {text:"map", value:""},
                {text:"after", value:""},
                {text:"input", value:""},
                {text:"submit", value:""}
            ],
            "Empty":[]
        };

        createDialog("New BuildingBlock", "Select which brilliant addition you want to add to your XioProgram.", typeSelect[type], "Create!", function(){
            var chosen = $("#xfType").val();

            var div = document.createElement("div");
            div.classList.add("xfElement");
            div.xf = {
                name: $("#xfName").val(),
                open: true,
                type: chosen,
                level: type? ($xfSelect[0].xf.level + 1) : (1),
                content: []
            };
            var array = chosenSelect[chosen];
            if(array){
                for(var i = 0; i < array.length; i++){
                    div.xf[array[i].text] = array[i].value;
                }
            }

            if(type){
                var minLevel = $xfSelect[0].xf.level;
                while($xfSelect.next()[0] && $xfSelect.next()[0].xf.level > minLevel){
                    $xfSelect = $xfSelect.next();
                }
                $xfSelect.after(div);
            }
            else{
                $("#xfMain").append(div);
            }


            updateXfDataFromList();
            setXfMain();
        });

    }
    
    function xfEdit(){
        var type = getXfSelectType();
        if(type !== "Minor"){
            createDialog("Edit "+type, "Edit the name of your "+type, [
                {id:"xfName", text:"Name", type:"text", value:$xfSelect[0].xf.name}
            ], "Edit", function(){
                $xfSelect[0].xf.name = $("#xfName").val();
                updateXfDataFromList();
                setXfMain();
            });
        }
        else{
            var category = $xfSelect[0].xf.category;
            var parent = $xfSelect[0].xf.parName;
            createDialog("Edit "+category, "Edit the "+category+" of "+parent, [
                {id:"xfValue", text:category, type:"text", value:$xfSelect[0].xf.value}
            ], "Edit", function(){
                while($xfSelect[0].xf.parName === parent){
                    $xfSelect = $xfSelect.prev();
                }
                $xfSelect[0].xf[category] = $("#xfValue").val();
                updateXfDataFromList();
                setXfMain();
            });
        }
    }
    
    function xfDelete(){
        var type = getXfSelectType();
        createDialog("Delete "+type, "Are you sure you want to delete this "+type+"?", [], "Delete!", function(){
            $xfSelect[0].xf.delete = true;
            updateXfDataFromList();
            setXfMain();
        });
    }

    function xfCode(){
        var type = getXfSelectType();
        var $elements = $xfSelect;
        var minLevel = $xfSelect[0].xf.level;
        while($xfSelect.next()[0] && $xfSelect.next()[0].xf.level > minLevel){
            $xfSelect = $xfSelect.next();
            if($xfSelect.hasClass("xfElement")){
                $elements = $elements.add($xfSelect);
            }
        }
        var oldCode = elementsToCode($elements, minLevel);
        oldCode = oldCode.slice(1, -1);
        var dialogHTML = ''
            +'<div id="xfDialog" title="Code">'
                +'<textarea id="xfCodeArea" type="text" class="xfTextArea">'+oldCode.replace(/"/g, "&quot;");+'</textarea>'
            +'</div>';
        $("#topblock").append(dialogHTML);

        var save = [];

        if(type === "Empty"){
            save.push({
                "text": "Save",
                "click": function(){
                    console.log(ls.xfData, oldCode);
                    ls.xfData = ls.xfData.replace(oldCode, $("#xfCodeArea").val());
                    $(this).remove();
                    setXfMain();
                }
            });
        }

        save.push({
            "text": "Close",
            "click": function(){
                $(this).dialog("close");
            }
        });

        $("#xfDialog").dialog({
            width: 700,
            buttons:save,
            close: function(){
                $(this).remove();
                setXfMain();
            }
        }).dialog("widget").resizable("destroy").resizable({
            alsoResize: ".xfInputs",
            handles: "e"
        });
    }

	//Mapping
		
	mapJSON = {
		mainList:{
			regExp: "\/.*\/main\/company\/view\/[0-9]+\/unit_list$",
			url: "/main/company/view/XF/unit_list",
			subName : {
				path: "[class^='info '] a",
				type: "item",
				mod: function($x){
					return $x.text();
				}
			},
			subId : {
				path: ".unit_id",
				type: "item",
				mod: function($x){
					return $x.text();
				}
			},
			compId : {
				path: ".unit-top a:has(img)",
				type: "item",
				mod: function($x){
					var href = $x.attr("href");
					return href.substring(href.lastIndexOf("/")+1, href.length);
				}
			}
		},
		prodSale:{
			regExp: "\/.*\/main\/unit\/view\/[0-9]+\/sale$",
			url: "/main/unit/view/XF/sale",
			id: "subId",
			primeCost: {
				path: "td:has('table')  tr:contains('Prime cost') td:nth-child(2):odd",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			primeQuality: {
				path: "td:has('table') tr:nth-child(2) td:nth-child(2):odd",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			price: {
				path: "input.money:even",
				type: "input",
				mod: function($x){
					return numberfy($x.val());
				},
				edit: function($x, value){
					return $x.val(value);
				}
			},
			policy: {
				path: "select:even",
				type: "input",
				mod: function($x){
					return $x.find("[selected]").text();
				},
				edit: function($x, value){
					return $x.val($x.find(":contains("+value+")").val());
				}
			},
			save: {
				path: ":submit.button205:not([name])",
				type: "submit",
				form: "form"
			},
			form: {
				path: "[name=storageForm]",
				type: "form",
				inputs: ["price", "policy"],
				mod: function($form){
					return $form
				}
			}			
		},
		storeTrade:{
			regExp: "\/.*\/main\/unit\/view\/[0-9]+\/trading_hall$",
			url: "/main/unit/view/XF/trading_hall",
			id: "subId",
			sales : {
				path: ".nowrap:nth-child(4)",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			bought : {
				path: ".nowrap:nth-child(5)",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			stock : {
				path: ".nowrap:nth-child(6)",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			share : {
				path: ".nowrap:nth-child(11)",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			pricePurchase : {
				path: ".nowrap:nth-child(9)",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			priceSale : {
				path: ":text",
				type: "input",
				mod: function($x){
					return numberfy($x.val());
				},
				edit: function($x, value){
					return $x.val(value);
				}
			},
			setprice : {
				path: "[name=setprice]",
				type: "submit",
				form: "priceForm"
			},
			priceForm : {
				path: "form[name=tradingHallForm]",
				type: "form",
				inputs: ["priceSale"],
				mod: function($form){
					$form[0]['action'].value = "setprice";
					return $form;
				}
			},
			checkbox : {
				path: ":checkbox[name^=product]",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				}				
			},
			eliminate: {
				path: "[name=terminate]",	
				type: "submit",
				form: "eliminateForm"
			},
			eliminateForm : {
				path: "form[name=tradingHallForm]",
				type: "form",
				inputs: ["checkbox"],
				mod: function($form){
					$form[0]['action'].value = "terminate";
					return $form;
				}
			}
		},
		storeSupply:{
			regExp: "\/.*\/main\/unit\/view\/[0-9]+\/supply$",
			url: "/main/unit/view/XF/supply",
			id: "subId",
			quantity : {
				path: "td:nth-child(2) table:nth-child(1) tr:nth-child(1) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			sold : {
				path: "td:nth-child(2) table:nth-child(1) tr:nth-child(5) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			supply : {
				path: "input:text[name^='supplyContractData[party_quantity]']",
				type: "input",
				mod: function($x){
					return numberfy($x.val());
				},
				edit: function($x, value){
					return $x.val(value);
				}
			},
			edit : {
				path: "[name=applyChanges]",
				type: "submit",
				form: "supplyForm"
			},
			supplyForm : {
				path: "form[name=supplyContractForm]",
				type: "form",
				inputs: ["supply"],
				mod: function($form){
					if($form.find("[name=applyChanges]").length){
						return $form.append($form.find("[name=applyChanges]").clone().wrap("<p></p>").parent().html().replace("submit","hidden"));
					}
					else return $form;
				},
			},
			checkbox : {
				path: ".destroy",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				}				
			},
			cancel: {
				path: "[name=destroy]",	
				type: "submit",
				form: "destroyForm"
			},
			destroyForm : {
				path: "form[name=supplyContractForm]",
				type: "form",
				inputs: ["checkbox"],
				mod: function($form){
					if($form.find("[name=destroy]").length){
						return $form.append($form.find("[name=destroy]").clone().wrap("<p></p>").parent().html().replace("submit","hidden"));
					}
					else return $form;
				}
			}
		},
		employeeSalary:{
			regExp: "\/.*\/window\/unit\/employees\/engage\/[0-9]+$",
			url: "/window/unit/employees/engage/XF",
			id: "subId",
			number : {
				path: "#quantity",
				type: "input",
				mod: function($x){
					return numberfy($x.val());
				},
				edit: function($x, value){
					return $x.val(value);
				}
			},
			salaryNow : {
				path: "#salary",
				type: "input",
				mod: function($x){
					return numberfy($x.val());
				},
				edit: function($x, value){
					return $x.val(value);
				}
			},
			salaryCity : {
				path: "tr:eq(3) td",
				type: "item",
				mod: function($x){
					return numberfy($x.text().split("$")[1]);
				}
			},
			skillNow : {
				path: "#apprisedEmployeeLevel",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			skillCity : {
				path: "div span[id]:eq(1)",
				type: "item",
				mod: function($x){
					return numberfy($x.text().match(/\d+(\.\d+)?/)[0]);
				}
			},
			skillRequired : {
				path: "div span[id]:eq(1)",
				type: "item",
				mod: function($x){
					return numberfy($x.text().split(",")[1]);
				}
			},
			save : {
				path: ":submit.button160",
				type: "submit",
				form: "form"
			},
			form : {
				path: "form",
				type: "form",
				inputs: ["number", "salaryNow"],
				mod: function($form){
					return $form;
				}
			}
		},
		changeName: {			
			regExp: "\/.*\/window\/unit\/changename\/[0-9]+$",
			url: "/window/unit/changename/XF",
			id: "subId",
			intName : {
				path: "#international_name",
				type: "input",
				mod: function($x){
					return $x.val();
				},
				edit: function($x, value){
					return $x.val(value);
				}
			},
			save : {
				path: "#save",
				type: "submit",
				form: "form"
			},
			form : {
				path: "form",
				type: "form",
				inputs: ["intName"],
				mod: function($form){
					return $form;
				},
			}
		},
		build1:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+(\/step1)?$",
			url: "/main/unit/create/XF/",
			id: "compId",
			subClass: {
				path: ".list:eq(0) td:nth-child(3)",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},				
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build1type:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step1-type-select$",
			url: "/main/unit/create/XF/step1-type-select",
			id: "compId",
			subType: {
				path: ".list:eq(0) td:nth-child(3)",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},				
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build1prod:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step1-type-select$",
			url: "/main/unit/create/XF/step1-type-select",
			id: "compId",
			subType: {
				path: ".zavod_list label",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ".zavod_list :radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},			
			},
			next: {
				path: ":submit[name=next]:eq(1)",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form.zavod_list",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build2:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step2$",
			url: "/main/unit/create/XF/step2",
			id: "compId",
			country: {
				path: ".list:eq(0) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},				
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build2farm:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step2-farm$",
			url: "/main/unit/create/XF/step2-farm",
			id: "compId",
			culture: {
				path: ".list:eq(0) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},				
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build3:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step3$",
			url: "/main/unit/create/XF/step3",
			id: "compId",
			region: {
				path: ".list:eq(0) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},				
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build4:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step4$",
			url: "/main/unit/create/XF/step4",
			id: "compId",
			city: {
				path: ".list:eq(0) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},					
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build4district:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step4-shop-district?$",
			url: "/main/unit/create/XF/step4-shop-district",
			id: "compId",
			district: {
				path: ".list:eq(0) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},				
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build4warehouse:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step4-warehouse?$",
			url: "/main/unit/create/XF/step4-warehouse",
			id: "compId",
			district: {
				path: ".list:eq(0) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},	
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build5:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step5$",
			url: "/main/unit/create/XF/step5",
			id: "compId",
			specialization: {
				path: ".list:eq(0) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},		
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build6:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step6$",
			url: "/main/unit/create/XF/step6",
			id: "compId",
			size: {
				path: ".list:eq(0) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return $x.text().trim();
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},		
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build7:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step7$",
			url: "/main/unit/create/XF/step7",
			id: "compId",
			level: {
				path: ".list:eq(0) td:nth-child(2)",
				type: "item",
				mod: function($x){
					return numberfy($x.text().match(/\d+/));
				}
			},
			purchase: {
				path: ".list:eq(0) td:nth-child(3)",
				type: "item",
				mod: function($x){
					return numberfy($x.text());
				}
			},
			radio: {
				path: ":radio",
				type: "input",
				mod: function($x){
					return $x.is(":checked");
				},
				edit: function($x, value){
					return $x.prop("checked", value);
				},	
			},
			next: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["radio"],
				mod: function($x){
					return $x;
				}
			}
		},
		build8:{
			regExp: "\/.*\/main\/unit\/create\/[0-9]+\/step8$",
			url: "/main/unit/create/XF/step8",
			id: "compId",
			buildName: {
				path: ":text",
				type: "input",
				mod: function($x){
					return $x.val();
				},
				edit: function($x, value){
					return $x.val(value);
				}			
			},
			build: {
				path: ":submit[name=next]",
				type: "submit", 
				form: "form"
			},
			form: {
				path: "form:has(.list)",
				type: "form",
				inputs: ["buildName"],
				mod: function($x){
					return $x;
				}
			}
		}
	}
		
	function xfShowMap(){		
		
		var docUrl = document.URL;
		
		//determine the url category
		var mapped = false;
		for(var key in mapJSON){
			
			//First, the document url has to match the regExp
			if(new RegExp(mapJSON[key].regExp).test(docUrl)){
								
				var allElements = true;
				
				//Then, all elements have to be available on the page
				for(var j in mapJSON[key]){
			
					//regExp, url and id are never an item
					if(j === "regExp" || j === "url" || j === "id"){
						continue;
					}
					
					if(!$(mapJSON[key][j].path).length){
						allElements = false;
						break;
					}					
				}	

				if(allElements){
					mapped = true;
					break;
				}
			}
		}		
		
		if(!mapped){
			return false;
		}
		
		$("[title]").removeAttr("title");
		
		//Tooltip does not work on windows
		if(jQuery.ui.version !== "1.6rc6"){
			$(document).tooltip();			
		}
		
		//Show map name
		var html = "<div id=mapName>Map Name: "+key+"</div>"
		//Main pages
		if($("#topblock").length){
			$("#topblock").append(html);
		}		
		//Windows
		else{
			$("#headerWithSeparator").append(html);
			$("#headerWithSeparator").next().css("margin-top", "30px");
		}
		
		
		//Show items and inputs tooltips
		for(var j in mapJSON[key]){
			
			//regExp and url are never an item
			if(j === "regExp" || j === "url"){
				continue;
			}
			
			var path = mapJSON[key][j].path;
			var curTitle = $(path).attr("title")? $(path).attr("title") + " & ":"";	
			
			var typeJSON = {
				item : true,
				input : true,
				link: true,
				submit : true,
				form: false
			}		
			
			if(typeJSON[mapJSON[key][j].type]){
				$(path)				
					.attr("title", curTitle + j)
					.addClass("mapTooltip")
			}		
		}
		
		//Switch buttons
		$("#xfShowMap").addClass("xfHide");
		$("#xfHideMap").removeClass("xfHide");
		
	}
	
	function xfHideMap(){
		
		//remove map name
		$("#mapName").remove();
	
		//remove items and inputs tooltips
		$(".mapTooltip")
			.css("background-color", "")
			.removeAttr("title")
			.removeClass("mapTooltip");		
		
		//Switch buttons
		$("#xfHideMap").addClass("xfHide");
		$("#xfShowMap").removeClass("xfHide");		
	}
	
    //Processing XioFunctions
		
	function xpcValue($context, page, item){
		//Extract a JQuery object from the context, and receive the editFunction from the mapJSON
		//Use the edit function in the mapJSON on all elements in the object, if defined, and return their edits in an array
		return $context.find(mapJSON[page][item].path).map(function(){
			//if(mapJSON[page][item].edit){
				return mapJSON[page][item].mod($(this));/*
			}
			else{
				return mapJSON[page][item];
			}*/			
		}).get();
	}
				
	
    function xpcProgram(data, ids){
		//data = the program as saved in the local storage
		//ids = selected subdivision ids
		
        //Start of the whole process
        console.log("Program "+ data.name +" is running!");	
		
		//initialize the company id
		var compId = xpcValue($(document), "mainList", "compId");		
		xvar.mainList[0].compId = compId;
		
        //If "fire" has a value, the ids of the subdivisions, of which the name starts with the string saved in fire, will be used
        if(data.fire !== ""){						
			
			//Extract the subIds and subNames	
			var subNames = xpcValue($(document), "mainList", "subName");
			var subIds = xpcValue($(document), "mainList", "subId");	
			
			//check the subNames for the "fire"-string
			for(var i = 0; i < subNames.length; i++){
				if(subNames[i].indexOf(data.fire) !== 0){
					subIds.splice(i, 1);
					subNames.splice(i, 1);
					//splice updates the array, so i-- is necessary to counter that
					i--;
				}
			}
			
			//Save the ids in the xvar
			xvar.mainList[0].subId = subIds;
			xvar.mainList[0].subName = subNames;
			
        }
												
		//List the different XioFunctions: a certain XioFunction will only be called
		//after the XioFunction defined by "after:" are completed.
		for(var i = 0; i < data.content.length; i++){
            					
			//Split the "after:" in chucks of XioFunction names and save them all in a list
			//The following function can immediately be called with the xlist
			xlist.push({
				after : data.content[i].after.split(", "),
				data: data.content[i],
				func : function(data, i){					
					
					//Discriminate between XioInfo and XioUpdate
					if(data.type === "XioInfo"){
						xpcXioInfo(data, false);
					}
					else if(data.type === "XioUpdate"){
						xpcXioInfo(data, true);
					}
					
				}
			});					
		
        }
				
        xpcList("");
    }
	
	function xpcList(add){
        //Go through the list of the Ajax calls and check which new ones can be fired.
		//add = the name of the last finished call
		
        //Delete the last finished call from the "after:"-list	        
		for(var i = 0; i < xlist.length; i++){
			var index = xlist[i].after.indexOf(add);
			if(index >= 0){
				xlist[i].after.splice(index, 1);
			}
		}
        

		//Recheck the list for new Ajax calls to fire, they are the calls where all "after:"-elements have been deleted		
        for(var i = 0; i < xlist.length; i++){
            if(!xlist[i].after.length){
                var removed = xlist.splice(i, 1);
                removed[0].func(removed[0].data);
            }
        }
		
        //Check if all ajaxCalls are complete and the xlist is empty
		var emptyXlist = !xlist.length;
		var emptyXcount = true;
		
		for (var key in xcount){			
			if (xcount[key] !== 0){
				emptyXcount = false;
			}
		}	
		
		if( emptyXcount && emptyXlist ){
			console.log("all done!");
			console.log(xvar);
		}
		
    }
	
	function xpcXioInfo(data, XioUpdate){
		
		//map the links
		//var links = xpcUrlArray(data.map);
		var idName = mapJSON[data.map].id;
		var ids = xvar.mainList[0][idName] || [""];
								
		//get the data
		//the p for page
		xcount["XioInfo: "+data.name] = ids.length;
		
		for(var p = 0; p < ids.length; p++){			
			//run the load function	

			//ready the link
			link = "/"+realm+mapJSON[data.map].url;
			if(link.indexOf("XF") >= 0){
				link = link.replace("XF", ids[p]);
			}
						
			//Has to be in a function: or p will always be on it's maximum
			(function runAjax(p, link, data){
                
				$.ajax({
					url: link,
					type: "GET",
					
					success: function(html, status, xhr){
											
						xcount["XioInfo: "+data.name]--;
						
						var mapName = data.map.split(", ")[0];
						
						//Save the mapName under "map", documentHTML under "document", and the url under "url"
						xvar[data.name] = xvar[data.name] || [];
						xvar[data.name][p] = {};
						xvar[data.name][p]["map"] = mapName;
						xvar[data.name][p]["document"] = $(html.replace("body", "bodya"));
						xvar[data.name][p]["url"] = link;
						
						//Extract the values defined in mapJSON
						//the m for mapVariables
												
						for(var m in mapJSON[mapName]){
													
							//Extract the values that are an "item" or an "input", from the document and save it in xvar							
							if(mapJSON[mapName][m].type === "item" || mapJSON[mapName][m].type === "input"){
								xvar[data.name][p][m] = xpcValue(xvar[data.name][p]["document"], mapName, m);	
							}
									
						}	
						
						console.log("Get "+data.name+": "+xcount["XioInfo: "+data.name]);
						
						if(xcount["XioInfo: "+data.name] === 0){
							if(XioUpdate){
								xpcXioUpdate(data);
							}
							else{
								xpcList(data.name);								
							}
						}				
						
					},
					
					error: function(){
						//Resend the 
						setTimeout(function(){
							runAjax(p, link, data);
						}, 3000);
					}
					
				});
				
			})(p, link, data);		
		
		}
		
	}
	
	function xpcXioUpdate(data){
				
		//prepare the form, inputs and submit
		var mapName = xvar[data.name][0].map;
		var submitName = data.submit;
		var formName = mapJSON[mapName][submitName].form;
		var formInputs = mapJSON[mapName][formName].inputs;
		var inputString = data.input.split("; ");
		var cutInputs = [];
		
		//Check which inputs are going to be modified
		for (var n = 0; n < inputString.length; n++){
				
			var string = inputString[n];
			
			//Illegal syntax
			if(!/^#\w+ = /.test(string)){
				inputString.splice(n, 1);
				n--;
				continue;
			}
				
			//The first word of the inputsString, after the #, should be a variable name
			var variableWord = /\w+/.exec(string)[0];									
			
			//Cut off the variable name: "#variableName = "
			string = string.replace("#"+variableWord+" = ", "");
			
			//Save the variable name + the function that is going to determine the value
			cutInputs.push({
				varName : variableWord,
				valueFunc : string,
				//Check if the variable really has something to do with the form that is going to be submitted	
				//If not, it means that it is a new, temporary variable
				inForm : formInputs.indexOf( variableWord ) >= 0
			});			
			
		}
			
		xcount["XioUpdate: "+data.name] = xvar[data.name].length;		
		
		for(var p = 0; p < xvar[data.name].length; p++){	
		
			var $form = xvar[data.name][p].document.find(mapJSON[mapName][formName].path)
						
			//Determine all the real values of variable instances and put it in the form
			for(var n = 0; n < cutInputs.length; n++){
				
				var func = cutInputs[n].valueFunc;
								
				//Split the func into pieces and save them separately
				//Also, determine the required variables and put them in array 
				var varsToReplace = func.match(/#\w+(\.\w+)?/g) || [];
				var varArray = [];
				for (var i = 0; i < varsToReplace.length; i++){
					
					var pieces = /#(\w+)(\.(\w+))?/.exec(varsToReplace[i]);					
					
					//Variables from the own XioUpdate do not need a #XioUpdate.variableName: just a #variableName is enough;
					if(pieces[3]){
						varArray.push({
							name: varsToReplace[i],
							saved: xvar[pieces[1]][p][pieces[3]]
						});
					}
					else{
						varArray.push({
							name: varsToReplace[i],
							saved: xvar[data.name][p][pieces[1]]
						});
					}						
					
				}
								
				//If the variable is a not used in the form
				if(cutInputs[n].inForm === false){
					
					var oneFunc = func;
					for(var j = 0; j < varArray.length; j++){												
						oneFunc = oneFunc.replace(varArray[j].name, varArray[j].saved[0]);						
					}					
							
					var realValue = eval(oneFunc);
					xvar[data.name] = xvar[data.name] || [];
					xvar[data.name][p] = xvar[data.name][p] || {};
					xvar[data.name][p][cutInputs[n].varName] = [realValue];
					
				}
				//The variable has to be filled in the form
				else{
					
					var rows = xvar[data.name][p][cutInputs[n].varName].length
					
					//Determine the real values and edit the form based on the real values					
					for (var i = 0; i < rows; i++){
												
						var oneFunc = func;
						for(var j = 0; j < varArray.length; j++){
													
							var value;
							
							//is varArray[j].saved an array with two or more elements?
							if(varArray[j].saved.length >= 2){
								value = varArray[j].saved[i];								
							}
							else{
								value = varArray[j].saved[0];								
							}
							
							//as string has to be read as string
							if(typeof value === "string"){
								value = "\""+value+"\"";
							}
							oneFunc = oneFunc.replace(varArray[j].name, value);
						}					
						
						var realValue = eval(oneFunc);						
						var editFunc = mapJSON[mapName][cutInputs[n].varName].edit;					
						editFunc($form.find(mapJSON[mapName][cutInputs[n].varName].path).eq(i), realValue);						
						
					}					
				}					
			}
			
			mapJSON[mapName][formName].mod($form);
			xvar[data.name] = xvar[data.name] || [];
			xvar[data.name][p] = xvar[data.name][p] || {};
			xvar[data.name][p]["XioUpdateForm"] = $form;
												
			(function runAjax(url, $form, data){                				
				
				$.ajax({
					url: url,					
					data: $form.serialize(),
					type: "POST",
					
					success: function(html, status, xhr){
											
						xcount["XioUpdate: "+data.name]--;	
						console.log("Post "+data.name+": "+xcount["XioUpdate: "+data.name]);
						
						if(xcount["XioUpdate: "+data.name] === 0){
							xpcList(data.name);
						}				
						
					},
					
					error: function(){
						//Resend runAjax
						setTimeout(function(){
							runAjax(p, data);
						}, 3000);
					}
					
				});
				
			})(xvar[data.name][p].url, $form, data);				
		}		
	}
	
    //Global Variables
    var realm = readCookie('last_realm');
    var xvar = {}; //saving variables
    var xlist = []; //saving Ajax calls order list
	var xcount = {}; //counting the Ajax calls left for a certain group
    
    //Dialogs
    function createDialog(title, content, inputs, buttonName, callback){
        var dialogHTML = ''
        +'<div id="xfDialog" title="'+title+'">'
            +'<div id="xfDialogText">'+content+'</div>'
            +'<div>';

        for(var i = 0; i < inputs.length; i++){
            dialogHTML += '<br><label for='+inputs[i].id+' class="xfInputs">'+inputs[i].text+'</label>';
            
            if(inputs[i].type === "text"){
                dialogHTML += '<input id="'+inputs[i].id+'" type="text" class="xfInputs" value="'+inputs[i].value.replace(/"/g, "&quot;")+'";>';
            }
            else if(inputs[i].type === "select"){
                dialogHTML += '<select id="'+inputs[i].id+'" class="xfInputs">';
                for(var j = 0; j < inputs[i].value.length; j++){
                    dialogHTML += '<option>'+inputs[i].value[j].replace(/"/g, "&quot;")+'</option>';
                }
                dialogHTML += '</select>';
            }
        }

        dialogHTML += '</div></div>';
        $("#topblock").append(dialogHTML);
        
        $("#xfDialog").dialog({
            width: 700,
            buttons:[
                {
                    "text": buttonName,
                    "click": function(){
                        if(validateDialog()){
                            callback();
                            setXfMain();
                            $(this).remove();
                        }                        
                    }
                },                
                {
                    "text": "Cancel",
                    "click": function(){
                        $(this).dialog("close");
                    }
                }                
            ],
            close: function(){
                $(this).remove();
            }
        }).dialog("widget").resizable("destroy").resizable({
            alsoResize: ".xfInputs",
            handles: "e"    
        });           
    }
    
    function validateDialog(){
        //Validate the given names for length and text content.
        var $xfName = $("#xfName");
        if($xfName.length){
            if($xfName.val().length > 20 || $xfName.val().length < 3){
                $("#xfDialogText").addClass("ui-state-error")
                    .text("Please make sure that the length of your chosen name is between 3 and 20.");
                return false;
            }
            if($xfName.val().match(/([a-zA-Z0-9_])+/)[0] !== $xfName.val()){
                $("#xfDialogText").addClass("ui-state-error")
                    .text("Only letters and underscores are allowed for the variable name. Please remove anything else.");
                return false;
            }
        }
        return true;
    }
          
    //Buttons      
    function XFButton(){
        var menuHTML = ''
        +'<button id="xfHidMenu">XioFunctions</button>'
        +'<div id="xfMenu" class="xfHide">'
            +'<span id="xfMin" class="xfMinimize">x</span>'
            +'<div id="xfTitle" class="xfTitle">XioFunctions</div>'
            +'<div id="xfMain" class="unselectable"></div>'
            +'<div id="xfActions">'
                +'<input type="submit" id="xfRun" class="xfButtons" value=Run>'
                +'<input type="submit" id="xfNew" class="xfButtons" value=New>'
                +'<input type="submit" id="xfEdit" class="xfButtons" value=Edit>'
                +'<input type="submit" id="xfDelete" class="xfButtons" value=Delete>'
                +'<input type="submit" id="xfCode" class="xfButtons" value=Code>'
            +'</div>'
        +'</div>';

        $("#topblock").append(menuHTML);

        var resized = 0;
        $("#xfMenu").resizable({
            alsoResize: '#xfMain',
            minHeight: 250,
            minWidth: 370,
            maxWidth: 950,
            resize: function(event, ui){
                updateXfStyle();
                var inputs = $("#xfPathResult, #xfPathOutput");
                var width = inputs.eq(0).css("width");
                if(!resized){
                    resized = ui.originalSize.width;
                }
                inputs.css("width", parseFloat(width) + ui.size.width - resized);
                resized = ui.size.width;
            }
        });
        $("#xfMin, #xfHidMenu").click(function(){ xfMinimize(); });
        $("#xfRun").click(function(){ xfRun(); });
        $("#xfNew").click(function(){ xfNew(); });
        $("#xfDelete").click(function(){ xfDelete(); });
        $("#xfEdit").click(function(){ xfEdit(); });
        $("#xfCode").click(function(){ xfCode(); });

        xfStyle();
    }

	function MapButton(){
		var menuHTML = ''
        +'<button id="xfShowMap">Show Map</button>'
        +'<button id="xfHideMap" class="xfHide">Hide Map</button>';
		
		$("#topblock, #headerWithSeparator").append(menuHTML);
		
		$("#xfShowMap").click(function(){ xfShowMap(); });
		$("#xfHideMap").click(function(){ xfHideMap(); });
	}
	
    //Main
    var running = false;
    
    var urlRegEx = {
        main : "\/(.*)\/main\/.*",
        unitList : "\/.*\/main\/company\/view\/[0-9]+\/unit_list$",
        companyMain : "\/.*\/main\/company\/view\/[0-9]+$",
        companyView : "\/(.*)\/main\/company\/view\/([0-9]+/.*)",
        unitViewMain: "\/(.*)\/main\/unit\/view\/([0-9]+#?$)",
        unitViewSubPage : "\/(.*)\/main\/unit\/view\/([0-9]{1,})/(.*)",
        globalReport : "\/(.*)\/window\/globalreport\/marketing\/by_products\/([0-9]+)",
        unitSupplyCreate : "\/(.*)\/window\/unit\/supply\/create\/([0-9]+)\/step2",
        unitSupply :  "\/.*\/main\/unit\/view\/[0-9]+\/supply",
        unitSale :  "\/.*\/main\/unit\/view\/[0-9]+\/sale",
        equipment : "\/.*/window/unit/equipment/[0-9]+",
        companyEmployeeMgmnt : "\/.*\/main\/company\/view\/[0-9]+\/unit_list/employee",
        qualification : "\/.*\/main\/user\/privat\/persondata\/knowledge",
        unitMarket : "\/.*\/main\/unit_market\/list",
        MgmntEquipmentRepair : "\/.*\/window\/management_units\/equipment\/repair",
        reportsIndustry : "\/.*\/main/company\/.*/.*\/sales_report/by_produce",
        warehouseSaleScreen: "\/.*\/window\/unit\/supply\/multiple\/vendor:([0-9]+)\/product:([0-9]+)/brandname:([0-9]*)"
    };
    
    var url = document.URL;

    //Load the map button into the topblock    
	MapButton();

    //If we are on the main page, enable selecting of subdivision rows.
    if(new RegExp(urlRegEx["unitList"]).test(url)){
		XFButton();
        setXfDefault();
        initiateSelecting();
    }
	

    if(new RegExp(urlRegEx["unitViewMain"]).test(url)){
        //seeTops();
    }

    

}

var script = document.createElement("script");
script.textContent = '(' + XioScript.toString() + ')();';
document.documentElement.appendChild(script);
