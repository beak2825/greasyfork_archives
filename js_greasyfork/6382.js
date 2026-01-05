// ==UserScript==
// @name                Myschool einkunnir
// @namespace	        http://www.ru.is/
// @version				0.2
// @author				Björn Ingi Baldvinsson
// @description	        Birtir einkunnadreifingu.
// @include				https://myschool.ru.is/myschool/*verkID*
// @require				http://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/6382/Myschool%20einkunnir.user.js
// @updateURL https://update.greasyfork.org/scripts/6382/Myschool%20einkunnir.meta.js
// ==/UserScript==
var myList = document.getElementsByTagName("h3"); // get all h3 elements
for(var i = 0; i < myList.length; i++){
    if(myList[i].textContent  == 'Tölfræði'){

        var cell = myList[i].nextSibling.firstChild.firstChild.firstChild;
        var cellContent = cell.innerHTML;

        var dataIndex = cellContent.indexOf('data');
        var data = cellContent.substring(dataIndex);
        data = data.substring(data.indexOf('=') + 1, data.indexOf('&'));

        data = data.split('|');
        
        var legendIndex = cellContent.indexOf('legend');
        var legend = cellContent.substring(legendIndex);
        legend = legend.substring(legend.indexOf('=') + 1, legend.indexOf('"'));

        legend = legend.split('|');
        
        var selectedIndex = cellContent.indexOf('selected');
        var selected = cellContent.substring(selectedIndex);
        selected = selected.substring(selected.indexOf('=') + 1, selected.indexOf('&'));
        selected = parseInt(selected);
        
        var chartData = [];
        
        for(var i = 0; i < data.length; i++){
            if(i + 1 == selected){
                chartData[i] = {label: legend[i], y: parseInt(data[i]), x: i, color: "red" };
            }else{
                chartData[i] = {label: legend[i], y: parseInt(data[i]), x: i};
            }
        }
        cell.innerHTML = '<div id="chartContainer" style="height: 400px; width: 75%;"></div>';
        
        var chart = new CanvasJS.Chart("chartContainer", {
            
            title:{
                text: "Dreifing einkunna"              
            },
            
            axisX:{ 
                title: "Einkunn",
            },
            
            axisY:{ 
                title: "Fjöldi nemenda",
            },
            
            data: [            
                { 
                    indexLabelFontSize: 32,
                    indexLabelFontFamily:"Lucida Console" ,
                    /*** Change type "column" to "bar", "area", "line" or "pie"***/
                    type: "column",
                    color: "blue",
                    dataPoints: chartData
                }
            ]
        });
        
        chart.render();
    }
}