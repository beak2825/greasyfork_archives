// ==UserScript==
// @name       TEST
// @namespace  http://scratch.mit.edu
// @version    0.1
// @description  all tests for my extensions
// @match      *://scratch.mit.edu/projects/*
// @user		minirag (scratch)
// @downloadURL https://update.greasyfork.org/scripts/5683/TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/5683/TEST.meta.js
// ==/UserScript==
(function(ext) {
    ext._shutdown = function() {
    };
    
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'}; 
    };
    var descriptor = {
        blocks: [
            ['r', '%n to string', 'string'],
            ['r', '%n to binary', 'binary'],
            ['r', '%n ^ %n', 'power'],
            ['b', 'Is %n ≥ %n', 'testgreat'],
            ['b', 'Is %n ≤ %n', 'testless'],
        ]
    };
    ext.string = function(num) {
        var answer = "foo";
		var binary = num;
		answer = parseInt(binary, 2);
        return answer
    };
    ext.binary = function(num) {
        var x = "foo";
        x = num;
		x = parseInt(x);
		x = x.toString(2);
        return x;
    };
    ext.power = function(n1,n2) {          
        var answer = Math.pow(n1,n2);
        return answer;
    };
    ext.testgreat = function(num1,num2) {
        var answer = "foo";
        if (num1 >= num2) {
            answer = true;
        }
        else {
            answer = false;
        }
        return answer;
    };
     ext.testless = function(num1,num2) {
        var answer = "foo";
        if (num1 <= num2) {
            answer = true;
        }
        else {
            answer = false;
        }
        return answer;
    };
    ScratchExtensions.register('lolwut', descriptor, ext);
})({});