// ==UserScript==
// @name        AutoChallenge (hardcoded to population, no +4 level check)
// @namespace   Titannia
// @include     http://www.nationstates.net/page=challenge
// @version     1
// @grant       none
// @description Automates the challenge functionality of Nationstates, warning works only for level +4 advantage!
// @downloadURL https://update.greasyfork.org/scripts/6600/AutoChallenge%20%28hardcoded%20to%20population%2C%20no%20%2B4%20level%20check%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6600/AutoChallenge%20%28hardcoded%20to%20population%2C%20no%20%2B4%20level%20check%29.meta.js
// ==/UserScript==

function reloadChallengePage(){


  //Acquire proper nation names via first links in challenge screen.
  var self = document.getElementsByClassName("nlink")[0].href.split("=")[1]
  var target = document.getElementsByClassName("nlink")[1].href.split("=")[1]

  var nations = self + "+" + target;
  var specialty = "3" //hardcoded to youth rebellion. Check bottom of script for full list of values and their description
  var go = "+Go!+";

    
  //Performs a post or get with the specified key/values.
  performPost(window.location, {nations:nations,speciality:specialty,go:go});


    function performPost(path, params, method) {

        //console.log(params);
        //alert(params);
        method = method || "post"; // Set method to post by default if not specified.
       
        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);

        for(var key in params) {
            if(params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
             }
        }

        document.body.appendChild(form);
    form.submit();
  }


}

window.onload = function () {

        
    //See if there is a 'Round 1' and click it, then schedule a reload.
    var link = document.getElementsByClassName("next-round")[0];
    if(link) {
        link.click();
         //link.click();
        setTimeout(reloadChallengePage,3600 + (Math.random() * 200)); //random reload time to avoid raising flags if Nationstates has certain measures in effect.
    }
        
};


/*
Full list of all the possible specialties that can be selected.
<value to enter> <description>
none None
0 Civil Rights
1 Economy
2 Political Freedoms
3 Population
53 Authoritarianism
67 Averageness
31 Business Subsidization
6 Compassion
51 Corruption
55 Culture
46 Defense Forces
7 Eco-Friendliness
56 Employment
63 Environmental Beauty
52 Freedom From Corruption
50 Freedom From Taxation
62 Godlessness
27 Government Size
40 Happiness
39 Health
68 Human Development Index
45 Ideological Radicality
33 Income Equality
16 Industry: Arms Manufacturing
10 Industry: Automobile Manufacturing
12 Industry: Basket Weaving
18 Industry: Beverage Sales
24 Industry: Book Publishing
11 Industry: Cheese Exports
22 Industry: Furniture Restoration
25 Industry: Gambling
13 Industry: Information Technology
21 Industry: Insurance
20 Industry: Mining
14 Industry: Pizza Delivery
23 Industry: Retail
19 Industry: Timber Woodchipping
15 Industry: Trout Fishing
65 Influence
36 Intelligence
30 Law Enforcement
44 Lifespan
48 Most Pro-Market
34 Niceness
9 Nudity
61 Obesity
47 Pacifism
38 Political Apathy
69 Primitiveness
29 Public Healthcare
57 Public Transport
60 Recreational Drug Use
32 Religiousness
35 Rudeness
43 Safety
42 Safety from Crime
70 Scientific Advancement
17 Sector: Agriculture
26 Sector: Manufacturing
8 Social Conservatism
37 Stupidity
49 Taxation
58 Tourism
64 Toxicity
5 Unexpected Death Rate
4 Wealth Gaps
59 Weaponization
41 Weather
28 Welfare
66 World Assembly Endorsements
54 Youth Rebelliousness

*/