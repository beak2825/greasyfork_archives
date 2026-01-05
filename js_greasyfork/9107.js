// ==UserScript==
// @name         Osu! Top 50 Leaderboard Changes
// @namespace    https://greasyfork.org/users/10036
// @version      0.13
// @description  Outlines the changes in rank, accuracy, PP and playcount for each user in the top 50.
// @author       D.Slee
// @icon         http://osu.ppy.sh/favicon.ico
// @match        http*://osu.ppy.sh/p/pp
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/9107/Osu%21%20Top%2050%20Leaderboard%20Changes.user.js
// @updateURL https://update.greasyfork.org/scripts/9107/Osu%21%20Top%2050%20Leaderboard%20Changes.meta.js
// ==/UserScript==

//Booleans
var first = true;                                                                    //Indicates whether or not this is the first time loading (for times call)

//Table
var table = $("table")[0];                                                           //The table
var tableRows = [[1, ''], [0, ''], [2, '%'], [4, 'pp'], [3, '']];                    //Rows of the arrays in index form and characters for their respective rows
var usernames = GenerateArray($("table td:nth-child(2)"));                           //Returns an array of the usernames in order
var ranks = GenerateArray($("table td:nth-child(1)"));                               //Returns an array of the ranks in order
var accs = GenerateArray($("table td:nth-child(3)"));                                //Returns an array of the accuracies in order
var pps = GenerateArray($("table td:nth-child(5)"));                                 //Returns an array of the pp scores in order
var pcs = GenerateArray($("table td:nth-child(4)"));                                 //Returns an array of the play counts in order

var users = [usernames, ranks, accs, pps, pcs];                                      //Multidimensional array of information from the webpage
var oldUsers = localGet("users");                                                    //Local storage = cookies, oldUsers needs to be parsed
var altNames = [{'name1':'hi','name2':'hi'}];                                        //Alternate names
var selectOption = localStorage.selectOption;                                        //The current selected option (in terms of epoch)
var times = localGet("times");                                                       //All the available times

var selectTab = "<li style = \"color:#5e5e5e; padding:0 10px 0 10px; float:right\">Update: <select id='selectTab' style='width:9em'><option value=0>Last Visit</option></li>";
$(selectTab).insertAfter("#tablist ul");

MainProgram();
function MainProgram(){
    if (oldUsers === null) oldUsers = users; //A backup option (I think?)
    if (selectOption === undefined || selectOption === 0){
        selectOption = 0;
        MainProgram2();
    } else {
        GetUsersFromDatabase(function(xhr){
            oldUsers = eval("(" + xhr.responseText + ")");
            GetNamesFromDatabase(function(xhr){
                altNames = eval("(" + xhr.responseText + ")");
                MainProgram2();
            });
        });
    }
}

function GetUsersFromDatabase(callback){
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://osustats.net78.net/apis/dbget.php?format=1&time="+selectOption,
        onload: callback
    });
}

function GetNamesFromDatabase(callback){
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://osustats.net78.net/apis/dbnamesget.php",
        onload: callback
    });
}

function MainProgram2(){
    MatchOrder();
    UpdateTable();
    if (first === true){
        localSet("users", users);
        UpdateTimes();
    }
}

function MatchOrder(){
    for (var oldIndex = 0; oldIndex<users[0].length; oldIndex++){
        if (users[0][oldIndex] !== oldUsers[0][oldIndex]){
            var newIndex = oldUsers[0].indexOf(users[0][oldIndex]);                      //Find the index to swap with
            if (newIndex === -1){
                var newName = CheckForAlternativeNames(users[0][oldIndex]);
                newIndex = oldUsers[0].indexOf(newName);
            }
            if (newIndex !== -1) SwapRecords(newIndex, oldIndex);                       //Swap oldArray[oldIndex] with oldArray[newIndex]
        }
    }
}

//Make oldArray[oldIndex] swap with oldArray[newIndex]
function SwapRecords(newIndex, oldIndex){
    for (var i = 0; i<users.length; i++){
        var temp = oldUsers[i][newIndex];
        oldUsers[i][newIndex] = oldUsers[i][oldIndex];
        oldUsers[i][oldIndex] = temp;
    }
}

function CheckForAlternativeNames(name){
    newName = false;
	for (var i in altNames){
        for (var j in [0, 1]){
            if (altNames[i]['name'+(Number(j)+1).toString()] === name){
                num = 2 - Number(j);
                var temp = altNames[i]['name'+num];
                if (oldUsers[0].indexOf(newName) > -1){
                    newName = temp;
                }
            }
        }
	}
    return newName;
}

function UpdateTable(){
    if (first === true) $("table tbody td").append($("<span>", {style:"font-family:arial"}));
    $("table tbody td").find("span:last").text("");
    var displacement = 0;
    for (var i = 1; i<users.length; i++){
        for (var j = 0; j<users[i].length; j++){
            if (oldUsers[i][j] === undefined) oldUsers[i][j] = users[i][j];
            displacement = users[i][j].replace(/[^\d.-]/g,'') - oldUsers[i][j].replace(/[^\d.-]/g,'');
            if (displacement.toString().indexOf('.') > -1) displacement = displacement.toFixed(2);  //Fixes floating point problem with percentages
            if (displacement !== 0) AppendCell(i, tableRows[i][0], j+1, displacement);       //Offset is j+1 because of the first row being titles
        }
    }
}

function FormatNumber(num){
    num = Math.abs(num);
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function AppendCell(property, column, row, amount){
    if (property === 1) amount *= -1;                                                 //If it is rankings, invert the amount used to determine if good or bad  
    var obj = {'good':{'colour':"#007700", 'arrow':"↑", 'cellBg':"#90EE90"}, 'bad':{'colour':"#BB0000", 'arrow':"↓", 'cellBg':"#F09090"}};
    var newObj = obj['good'];

    if (amount < 0) newObj = obj['bad']
    amount = FormatNumber(amount);
    
    cell = $(table.rows[row].cells[column]);
    cell.find("span:last").text(newObj['arrow'] + " " + amount + tableRows[property][1]).css("color", newObj['colour']);
}

function GenerateArray(array){
    var newArray = [];
    var index;
    for (var i = 0; i<50; i++){
        newArray[i] = $(array[i]).text().trim();
        index = newArray[i].indexOf('(');                                            //Handles playcounts            
        if (index > -1) newArray[i] = newArray[i].slice(0, index);
    }
    return newArray;
}

//Local storage functions, with arrays
function localGet(key){
    return $.parseJSON(localStorage.getItem(key));
}

function localSet(key, object){
    localStorage.setItem(key, JSON.stringify(object));
}

function UpdateTimes(){
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://osustats.net78.net/apis/dbtimesget.php",
        onload: function(xhr) {
            var times = eval("(" + xhr.responseText + ")");
            AppendDates(times);
            localSet("times", times);
            
            $("#selectTab").val(selectOption).change(ChangeSelect);;                 //Set default tab and event listener
        }
    });
}

function AppendDates(times){
    for (var i = 0; i<times.length; i++){
        var date = new Date(times[i]*1000);
        var string = ("0" + date.getDate()).slice(-2) + "/" + ("0" + parseInt(date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getFullYear()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
        var entry = $("<option>", {
            value: times[i],
            html: string
        });
        $("#selectTab").append(entry);
    }
}

function ChangeSelect(){
    selectOption = $("#selectTab").val();
    localStorage.selectOption = selectOption;
    first = false;
    MainProgram();
}