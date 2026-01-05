// ==UserScript==
// @name        PTSCheckoutWithFakeName
// @description Used to populate Public Ticket Checkout page with fake name and contact info retrieved from fakenamegenerator.com
// @namespace   https://greasyfork.org/en/scripts/8742-ptscheckoutwithfakename
// @include     http://*/ticket/*
// @include     https://*/ticket/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     1.5
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8742/PTSCheckoutWithFakeName.user.js
// @updateURL https://update.greasyfork.org/scripts/8742/PTSCheckoutWithFakeName.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

function pad (str, max) {
	return str.length < max ? pad("0" + str, max) : str;
}

var emailDomain;

if ($("body").find("div.content.publicticketcheckout").length > 0) {
    $("tr.buttonRow").find("td").append("<input id='FakeName' type='button' value='Get Fake Name'/>");
    
    $("#FakeName").on("click", function() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://www.fakenamegenerator.com/gen-random-us-us.php",
            onload: function(response) {
                var $fakeNameDocument = $(response.responseText);
                var fullName = $fakeNameDocument.find("div.address").find("h3").text().trim();
                var splitName = fullName.split(/\s[A-Z][\.]\s/);
                var firstName = splitName[0];
                var lastName = splitName[1];
                var fullAddress = $fakeNameDocument.find("div.adr").html().trim();
                var splitAddress = fullAddress.split(/<br>/);
                var streetAddress = splitAddress[0].trim();
                splitAddress = splitAddress[1].trim().split(',');
                var city = splitAddress[0].trim();
                splitAddress = splitAddress[1].trim().split(' ');
                var state = splitAddress[0];
                var zipCode = splitAddress[1];
            
                var $dl = $fakeNameDocument.find('dl.dl-horizontal');
                var phone = $($dl.get(3)).find('dd').text().trim();
                var email = $($dl.get(8)).find('dd').text().trim().split(' ')[0];
                if (emailDomain) {
                    email = email.replace(/@.*/, "@" + emailDomain);
                }
                var ccType = $($dl.get(13)).find('dt').text().trim();
                var ccNumber = $($dl.get(13)).find('dd').text().trim().replace(/ /g, '');
                var expMonth = $($dl.get(14)).find('dd').text().trim().split('/')[0];
                expMonth = (expMonth.length < 2) ? "0" + expMonth : expMonth;
                var expYear = $($dl.get(14)).find('dd').text().trim().split('/')[1];
                var cvv2 = $($dl.get(15)).find('dd').text().trim();

                /* Debug
                console.log("Full Name: " + fullName);
                console.log("First Name: " + firstName);
                console.log("Last Name: " + lastName);
                console.log("Address: " + fullAddress);
                console.log("Street Address: " + streetAddress);
                console.log("City: " + city);
                console.log("State: " + state);
                console.log("Zip: " + zipCode);
                console.log("Phone: " + phone);
                console.log("Email: " + email);
                console.log("CC Type: " + ccType);
                console.log("CC Number: " + ccNumber);
                console.log("Expiration Month: " + expMonth);
                console.log("Expiration Year: " + expYear);
                console.log("CVV2: " + cvv2);
                */
                
                $("input[id*=firstName]").val(firstName);
                $("input[id*=lastName]").val(lastName);
                $("textarea[id*=streetAddress]").val(streetAddress);
                $("input[id*=city]").val(city);
                $("input[id*=stateText]").val(state);
                $("select[id*=stateList]").val(state);
                $("input[id*=postalCode]").val(zipCode);
                $("input[id*=phone]").val(phone);
                $("input[id*=email]").val(email);
                $("input[id*=emailConfirmation]").val(email);
                $("select[id*=orderSource]").val("Other");
                // Crap... they dropped the fake CC info from fakenamegenerator.com, so just use our bypass number
                $("select[id*=ccType]").val(ccType);
                $("input[id*=ccNumber]").val(ccNumber);
                $("input[id*=ccCVV2]").val(cvv2);
                $("select[id*=ccExpMonth]").val(expMonth);
                $("select[id*=ccExpYear]").val(expYear);
                // Fire the onblur event on the phone field to format the phone field 
                $("input[id*=phone]").blur();
                
            },
            onerror: function(response) {
                alert("Error! Unable to get fake name from www.fakenamegenerator.com: " + response.responseText);
            }
        });
    });
}