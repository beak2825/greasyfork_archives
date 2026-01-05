// ==UserScript==
// @name         Match against peers in review
// @namespace    http://stackoverflow.com/users/578411/rene
// @version      0.7
// @description  how you reviewed against your peers
// @author       rene
// @match        *://stackoverflow.com/review/*/history*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9996/Match%20against%20peers%20in%20review.user.js
// @updateURL https://update.greasyfork.org/scripts/9996/Match%20against%20peers%20in%20review.meta.js
// ==/UserScript==

/*global $:false */
(function ($, window) {
	"use strict";
    var tasks = [],
        intervalTime = 500, // 200ms (make this larger when throttled often)
        per = 90000, // milliseconds
        penalty = 60000, // msec to wait after 503
        rate = 150, // per 90000 milliseconds  (make this smaller when throttled often, but on 80 you're safe )
        interval;

    // for each review put a task in the queue
	function addTasks(tasks) {
		$('#content > div > table > tbody > tr > td:nth-child(3) > a').each(function () {
			var a = $(this);
			tasks.push(a);
			a.parent().append($('<span class="match" style="float:right; padding-right:20px; "></span>').html('&hellip;'));
			// if (tasks.length > 30) {return false; }
		});
	}

    // find the key, return the index
	function find(arr, val) {
		var index = -1,
			j;
		for (j = 0; j < arr.length; j = j + 1) {
			if (arr[j].key === val) {
				index = j;
				break;
			}
		}
		return index;
	}

    // update the outcomes array based on the html
    // in instruction
    function handleInstruction(instruction, outcomes) {
        var	index,
			outcome;

        if (instruction.find('b').length > 0) { //  review-results
            outcome = instruction.find('b').text();
            index = find(outcomes, outcome);
            if (index === -1) {
                outcomes.push({ key: outcome, value: 1});
            } else {
                outcomes[index].value = outcomes[index].value + 1;
            }
        }
    }

    // parse the review outcome html and return an array
    // with outcomes and it's number of occurences
	function handleInstructions(instructions) {
	    var i,
            ul,
            handled = false,
			outcomes = [];

        ul = $(instructions).find('ul > li');
        ul.each(function(i) {
            var t = this;
            handleInstruction($(t), outcomes);
            handled =true;
        });

        if (!handled) {
            // stangely enough instructions doesn't behave fully as a
            // jquery object, hence the juggling here
            for (i = 0; i < instructions.length; i = i + 1) {
                handleInstruction($(instructions[i]), outcomes);
            }
        }
		//sort on value
		return outcomes.sort(function (a, b) {
			return a.value > b.value ? -1 : a.value === b.value ? 0 : 1;
		});
	}

    function getInstructions(val) {
        if (val !== undefined && typeof val === 'string' && val.indexOf('Approve,') !== 0) {
            return val;
        }
        return '<div></div>';
    }

    // if the postback results are in process and show the (mis)match
	function postresultHandler(data, url) {
		var stats = $(data),
            status = $(getInstructions(data.instructions)),
			peers = handleInstructions($(getInstructions(stats[0].instructions))), // rank hold the reviews of your peers
			rank = find(peers, url.text().trim()), // url is your own review
            match,
            comp = false,
            more = false,
            audit = false;

        if (typeof status[0].textContent === 'string') {
            comp = status[0].textContent.indexOf('Review completed') > 0 ||
                   status[0].textContent.indexOf('Rejected') > 0 || // this is how we know the suggested edit is complete
                   status[0].textContent.indexOf('Approved') > 0;
            more = status[0].textContent.indexOf('needs more reviews from other users') > 0;
            audit = status[0].textContent.indexOf('Review audit') > 0;
        }
        if (comp) {
            if (rank === 0) { // if on top, match
                match = { html: '=', color: 'green'};
            } else if (rank > 0 && peers[rank].value === peers[0].value) { // not on top, but equal
                match = { html: '~', color: 'orange'};
            } else { // no match
                match = { html: '!', color: 'red'};
            }
        } else {
            if (more) {
                match = { html: '.', color: 'black'};
            } else if (audit) {
                match = { html: 'A', color: 'blue'};
            } else if (stats.isUnavailable === true || (stats[0] && stats[0].isUnavailable === true )) {
                match = { html: ' ', color: 'black'};
            } else {
                //console.log(status[0].textContent);
                match = { html: '?', color: 'black'};
            }
        }
        url.parent().find('span.match')
            .html(match.html)
            .css('color', match.color);
	}

    // get array with timestamps from localstorage
    function getThrottle() {
        var calls = window.localStorage.getItem('se-throttle');
        if (calls === null) {
            calls = [ Date.now() ];
        } else {
            calls = JSON.parse(calls);
            if (!Array.isArray(calls)) {
                calls = [ Date.now() ];
            }
        }
        return calls;
    }
    
    // update timestamp array for throttle
    function setThrottle(time) {
        var calls = getThrottle(),
            i;
        
        if (time === undefined) {
            time = Date.now();
        }
        for(i = 0; 
            ((i < calls.length - 1) && (calls[0] < Date.now() - per)); 
            i = i + 1) {
            calls.shift();
        }
        if (calls.length > rate) {
            calls.shift();
        }
        calls.push(time); 
        window.localStorage.setItem('se-throttle', JSON.stringify(calls));
    }
    
    // gets called by the setInterval
	function taskWorker() {
		var url = tasks.shift(),
            partReviewId = 3,
            partQueue = 2,
            // http://meta.stackexchange.com/a/214527/158100
            reviewTypeMap = {
                "suggested-edits": 1,
                close: 2,
                "low-quality-posts": 3,
                "first-posts": 4,
                "late-answers": 5,
                reopen : 6,
                triage : 10,
                helper: 11
            },
            parts;

        if (url !== undefined) {
            parts = url.attr('href').split('/');
            $.post('/review/next-task/' + parts[partReviewId],
				{
					taskTypeId: reviewTypeMap[parts[partQueue]],  /* triage -> 10 */
					fkey: window.StackExchange.options.user.fkey
				},
				function (data) { 
                    setThrottle();
                    postresultHandler(data, url); 
                })
				.fail(function (xhr, stat, error) {
                    // Service Unavailable means we're throttled, panic
                    console.log(xhr);
                    if (xhr.status === 503) {
                        // wait a full minute to get free
                        setThrottle(Date.now() + 60000); 
                    }
				});
        } else {
            setThrottle(); 
            window.clearInterval(interval);
        }
	}
    
    // check if we are within the throttle boundaries
    function isAllowed() {
        var calls = getThrottle(),
            timepassed;
           
        timepassed = Date.now() - calls[0];
       // console.log(timepassed);
        return (((calls.length < rate) || 
            (timepassed > per)) && 
            (calls[calls.length-1] < Date.now()));
    }
    
    // handle a task
    function task() {
        if (isAllowed()) {
            taskWorker();
        } else {
           // console.log('<< throttle >>');
        }
    }
    
    function init(tasks, time) {
        addTasks(tasks);
        return window.setInterval(task, time);
    }
    
    interval = init(tasks, intervalTime);

}($ || unsafeWindow.$, window || unsafeWindow));