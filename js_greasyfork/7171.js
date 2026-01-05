// ==UserScript==
// @name          MetricConverter
// @description   Allow the instant conversion of metrics on /r/Fitness (Box on the bottom right)
// @author                Scarwolf
// @include       http://www.reddit.com/r/Fitness/*
// @include       http://www.reddit.com/r/Fitness
// @version       1.1
// @namespace https://greasyfork.org/users/7891
// @downloadURL https://update.greasyfork.org/scripts/7171/MetricConverter.user.js
// @updateURL https://update.greasyfork.org/scripts/7171/MetricConverter.meta.js
// ==/UserScript==
 
 
var MetricConverter = document.createElement('div');
document.body.appendChild(MetricConverter);
MetricConverter.id = "MetricConverter";
 
MetricConverter.style.position = 'fixed';
MetricConverter.style.bottom = '0';
MetricConverter.style.right = '50px';
MetricConverter.style.width = '300px';
MetricConverter.style.height = '30px';
MetricConverter.style.backgroundColor = '#E7E7E7';
MetricConverter.style.paddingLeft = '7px';
MetricConverter.style.border = 'thin solid black';
MetricConverter.style.borderWidth = '1px 1px 0px 1px';
MetricConverter.innerHTML = "Convert Metrics: ";
 
var inputField = document.createElement('input');
inputField.type = 'text';
inputField.id = 'MCInput';
inputField.style.marginTop = '8px';
inputField.size = '5';
MetricConverter.appendChild(inputField);
 
var toSpan = document.createElement('span');
toSpan.innerHTML = ' -> ';
MetricConverter.appendChild(toSpan);
 
var inputField2 = document.createElement('input');
inputField2.type = 'text';
inputField2.id = 'MCInput2';
inputField2.style.marginTop = '8px';
inputField2.size = '5';
MetricConverter.appendChild(inputField2);
 
var goButton = document.createElement('button');
goButton.style.marginLeft = '7px';
goButton.id = 'MCGoButton';
goButton.innerHTML = 'GO';
goButton.onclick = MCConvert;
MetricConverter.appendChild(goButton);
 
function roundit(which){
    return Math.round(which*100)/100
}
 
function FeetToCm(val){
    return roundit(val*30.48);
}
function CmToFeet(val){
        return roundit(val/30.84);
}
 
function KgToLbs(val){
        return roundit(val*2.2046);
}
 
function LbsToKg(val){
        return roundit(val/2.2046);
}
 
function determineMetric(value){
    var type = -1;
    if(value.indexOf("lbs") != -1)type = 1;
    else if(value.indexOf("kg") != -1)type = 2;
        else if(value.indexOf("ft") != -1)type = 3;
        else if(value.indexOf("cm") != -1)type = 4;
            return type;
}
 
function MCConvert(){
    var MCgetValue = document.getElementById("MCInput").value;
    if(determineMetric(MCgetValue) == -1){
                alert("There was an error with your value. Please write write one of the following after your value into the input box: lbs, kg, ft, cm.\n\nAlso your values have to be floating numbers, so as an example you have to write 6.1ft instead of 6\x221'.\n\nExamples of possible values:\n180cm\n6.1ft\n114kg\n250lbs");
    }
    else {
        var type = determineMetric(MCgetValue);
        var parseVal = parseFloat(MCgetValue);
        if(type == 1) {
                        document.getElementById("MCInput2").value = LbsToKg(parseVal) + "kg";
                }
        if(type == 2) {
                        document.getElementById("MCInput2").value = KgToLbs(parseVal) + "lbs";
                }
        if(type == 3) {
            document.getElementById("MCInput2").value = FeetToCm(parseVal) + "cm";
        }
        if(type == 4) {
                        document.getElementById("MCInput2").value = CmToFeet(parseVal) + "ft";
                }
    }
    return 0;
}