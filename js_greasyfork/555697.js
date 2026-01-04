// ==UserScript==
// @name               NedFox Auto KHR
// @namespace          NedFoxAutoKHR
// @version            5
// @description        Auto-Proceed Nedfox steps in the packing portal
// @author             Kevin van der Bij
// @license MIT
// @match              https://retailvista.net/bztrs/*
// @icon               https://www.kampeerhalroden.nl/media/e9/9d/08/1703346720/favicon.ico
// @grant              GM_xmlhttpRequest
// @grant              GM_addStyle
// @connect            kampeerhalroden.nl
// @require            https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @require            https://retailvista.net/bztrs/packingportal/lib/jquery/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/555697/NedFox%20Auto%20KHR.user.js
// @updateURL https://update.greasyfork.org/scripts/555697/NedFox%20Auto%20KHR.meta.js
// ==/UserScript==

/*
ToDo:
1. Repeat barcode / print all (singleline?) orders of product
2. Refactor!
*/

/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    // Path to the shopware API url the integration will use
    const shopwareApiUrl = "https://www.kampeerhalroden.nl";
    
    // Get the path for the current window location
    var path = window.location.pathname;

    // Enable christmas theme
    merryChristmas();

    // Ensure localstorage does not get too large
    manageLocalStorage();

    // Switch based on the current page location with regular expression testing
    switch(true){
        case /bztrs\/packingportal\/Reservations\/Index\/.*/.test(path):
            // Skips the second step and sets all products to collected, we do not need the 2nd step anymore because of the loaded product list in step 3
            skipSecondStep();
            break;

        case /bztrs\/packingportal\/Parcels.*/.test(path):
            // Click button to third step to finalize order processing when it is enabled
            proceedStep("#ParcelsContainer > div > div:nth-child(4) > div > button:not(:disabled)");

            // HACKY WORKAROUND to clear input after scan
            document.querySelector("#verifyProduct").addEventListener("click", clearInput("#productBarcode"), false);

            addProductList();
            editReservationDetails();
            createCommentBox();
            clearAllParcelItems();
            saveLastOpenReservation();
            break;

        case /bztrs\/packingportal\/CompleteReservations.*/.test(path):
            // Save current reservation as last completed.
            saveLastCompletedReservation();

            // Click button to complete the process and go back to first step once it appears
            proceedStep("#ReservationContainer > div:nth-child(11) > div > button");
            break;

        case /bztrs\/packingportal.*/.test(path):
            addLastReservationButtons();

            // Select the barcode field in the first step
            waitForKeyElements("#Productbarcode", (element) => {
                element.focus();
                return false;
            });

            // Automatically select first order in list of multiple orders
            proceedStep(".card:nth-child(1) .btn");
            break;

        default:
            alert("Location switch fail!");
            break;
    }

    // Function that waits for element to exist and executes a click
    function proceedStep(selector){
        // disable the function for testing
        //return;

        waitForKeyElements(selector, elements =>
                           elements[0].click());
    }

    // Clear input form with a weird delay !!!HACKY WORKAROUND FOR CHROME/EDGE 142 BEHAVIOUR!!!
    function clearInput(selector){
        setTimeout(() => {
            waitForKeyElements(selector, elements => {
                           elements[0].value = ""});
        }, "0");
    }

    // Add product list in the 3rd step, this is useful for seeing which products need to be collected in the packages
    function addProductList(){
        // Create empty div to load list content into
        var productList = document.createElement("div");
        productList.setAttribute("id", "productList");
        productList.setAttribute("style", "min-height:173px; overflow-y: auto; overflow-x: hidden;");
        document.querySelector("#ReservationOverview > div:nth-child(2) > div.col-9").prepend(productList);

        // Create title for content
        var productListTitle = document.createElement("h4");
        document.querySelector("#ReservationOverview > div:nth-child(2) > div.col-9").prepend(productListTitle);
        $(productListTitle).html("Nodige Producten");

        var reservationID = document.getElementById("ReservationId").value;

        // Load productlist content from previous step
        let cachedList = localStorage.getItem("NKHR_productList_" + reservationID);

        // Load productlist from cached data if it exists, otherwise AJAX load
        if (cachedList) {
            document.querySelector("#productList").innerHTML = cachedList;
            alterList();
        } else {
            $("#productList").load("https://retailvista.net/bztrs/packingportal/Reservations/Index/" + reservationID + " #ReservationContainer > div > div.container.my-2 > div", function(data){
                alterList();
            });
        }
    }

    function manageLocalStorage() {
        // If local storage does not contain more than 1.25 million characters do nothing
        if (JSON.stringify(localStorage).length < 1250000) return;

        // Get all keys from local storage
        var keys = Object.keys(localStorage);

        // Filter keys for cached product lists
        var productLists = keys.filter(key => key.startsWith("NKHR_productList_"))

        // Clear every productlist from localstorage
        productLists.forEach((list) => {
            localStorage.removeItem(list);
        });
    }

    // Companion function to structure the list
    function alterList(){
        // Remove scan message
        $("#productList > div > div > div").remove();

        // remove check symbol from list
        Array.from($("#productList > div > div > table > tbody").children()).forEach(function(item){
            item.children[4].remove();
        });

    }

    // Skip second step, set product values correctly and instantly forward page.
    function skipSecondStep(){
        let reservationID = document.getElementById("ReservationId").value;
        let productList = document.querySelector("#ReservationContainer > div > div.container.my-2 > div");

        // Cache the product list for the next page in the packing process
        localStorage.setItem("NKHR_productList_" + reservationID, productList.outerHTML);

        // Replace button with enabled variant
        $("#ReservationContainer > div > div:nth-child(5) > div").html('<div class="col-3"><button type="submit" class="btn btn-primary " formaction="/bztrs/packingportal/Reservations/Update">Volgende&nbsp;<span class="material-icons">chevron_right</span></button></div>');

        // Loop through all products and set collected variables to true so the package fires correctly
        for(let i = 0; i < 200; i++){
            let collected = document.querySelector("#ReservationRowsNotInCarriers_" + i + "__Collected");

            if(collected){
                collected.value = true;
            }
            else {
                break;
            }
        }

        // Click the button to continue step
        $("#ReservationContainer > div > div:nth-child(5) > div > div > button").click();
    }

    function clearAllParcelItems(){
        // Get all delete buttons for parcel items and start iterating through them
        var removeButtons = document.querySelectorAll('#button-addon2');
        removeButtons.forEach(function(button) {
            // format the onclick event to usable data
            var parcelInfo = button.onclick.toString().split('(').pop().split(')').shift().split(',')

            // Get the amount and active controls for the parcel item
            var amountControl = document.querySelector('#Items_' + parcelInfo[1] + '__Items_' + parcelInfo[2] + '__Amount');
            var activeControl = document.querySelector('#Items_' + parcelInfo[1] + '__Items_' + parcelInfo[2] + '__Active');

            // Set the controls to 0 and active, this makes the update remove the parcel items
            amountControl.value = 0;
            activeControl.value = 'True';
        });

        // Call page original update function to apply changes
        location.href = "javascript:void(update());";
    }

    // Turn the ordernumber in the reservation details into a link that opens the order
    function editReservationDetails(){
        var returnButton = document.querySelector("#ReservationOverview > div:nth-child(1) > div > a");
        returnButton.setAttribute('href', '/bztrs/packingportal');
        returnButton.innerHTML = '<span class="material-icons">chevron_left</span>&nbsp;Nieuwe zoekopdracht';
    }

    function createCommentBox(){
        var orderNumber = document.querySelector("#ReservationSummary\\ mb-2 > div:nth-child(3)").innerHTML.split(' ')[2];

        // Return and do not create the comment box if the number length does not match shopware
        if (orderNumber.length != 6) return;

        // Create the comment box dialog
        var commentBox = document.createElement("div");
        commentBox.setAttribute("id", "commentBox");
        commentBox.setAttribute("style", "margin-top: 20px;")

        var commentTextLabel = document.createElement("label");
        commentTextLabel.setAttribute("for", "commentTextArea");
        commentTextLabel.setAttribute("class", "row mb-2");
        commentTextLabel.setAttribute("style", "font-weight: bold;")
        commentTextLabel.innerText = "Shopware Notitie:";
        commentBox.appendChild(commentTextLabel);

        var commentTextArea = document.createElement("textarea");
        commentTextArea.setAttribute("name", "commentTextArea")
        commentTextArea.setAttribute("id", "commentTextArea");
        commentTextArea.setAttribute("class", "row mb2 form-control");
        commentTextArea.setAttribute("style", "height: 150px;width: 100%;-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */-moz-box-sizing: border-box;    /* Firefox, other Gecko */box-sizing: border-box; ");
        commentTextArea.disabled = true;
        commentBox.appendChild(commentTextArea);

        var commentSaveButton = document.createElement("button");
        commentSaveButton.setAttribute("id", "commentSaveButton");
        commentSaveButton.setAttribute("type", "button");
        commentSaveButton.setAttribute("class", "btn btn-primary row mb2");
        commentSaveButton.setAttribute("style", "width:100px; margin-top:10px;");
        commentSaveButton.innerText = "Opslaan";
        commentSaveButton.disabled = true;
        commentBox.appendChild(commentSaveButton);

        var openShopwareButton = document.createElement("button");
        openShopwareButton.setAttribute("id", "openShopwareButton");
        openShopwareButton.setAttribute("type", "button");
        openShopwareButton.setAttribute("class", "btn btn-primary row mb2");
        openShopwareButton.setAttribute("style", "width:100px; margin-top:10px; margin-left:20px; ");
        openShopwareButton.innerText = "Open";
        openShopwareButton.disabled = true;
        commentBox.appendChild(openShopwareButton);

        document.querySelector("#ReservationOverview > div:nth-child(2) > div.col-3").insertBefore(commentBox, document.querySelector("#ReservationSummary\\ mb-2").nextSibling);

        // Initialize shopware integration, this authenticates us and retrieves a valid token
        shopwareInitialize().then(async (token) => {
            // Get the order data from ordernumber
            var orderData = await shopwareGetOrderData(token, orderNumber)

            // Update the text box with the current customer comment data
            commentTextArea.value = orderData.data[0].customerComment;

            // enable comment box dialog
            openShopwareButton.disabled = false;
            commentSaveButton.disabled = false;
            commentTextArea.disabled = false;

            var clickTimeout;
            // Create onclick function that will update the customer comment in shopware
            commentSaveButton.onclick = () => {
                // Change the data object with value from text box
                orderData.data[0].customerComment = commentTextArea.value

                // Send info to server
                var updateData = shopwareUpdateOrderComment(token, orderData.data[0])

                // clear timeout if one is already running
                if (clickTimeout != undefined ) { clearTimeout(clickTimeout) }

                // change comment box state to reflect save in progress
                commentSaveButton.innerHTML = "Opgeslagen!";
                commentTextArea.disabled = true;

                // reset comment box
                clickTimeout = setTimeout(function() {
                    commentSaveButton.innerHTML = "Opslaan";
                    commentTextArea.disabled = false;
                }, 2000);
            };

            // Set onclick for open button to open shopware order
            openShopwareButton.onclick = () => {
                window.open("https://www.kampeerhalroden.nl/admin#/sw/order/detail/" + orderData.data[0].id + "/general", "_blank").focus();
            }
        });
    }

    // Add button to search portal to open last completed reservation, this makes it easy to add new packages to an order that was just completed.
    function addLastReservationButtons(){
        var lastCompletedReservationDetails = JSON.parse(localStorage.getItem("NKHR_LastCompletedReservationDetails"));

        // Test if we have a saved last saved reservation and create the button if we do
        if (lastCompletedReservationDetails)
        {
            // Setup the button element with proper text, attributes and url
            var lastCompletedButton = document.createElement("a");
            lastCompletedButton.setAttribute("class", "btn btn-primary btn-block");
            lastCompletedButton.setAttribute("id", "lastCompletedButton");
            lastCompletedButton.setAttribute("href", "https://retailvista.net/bztrs/packingportal/AddParcels/Search?ReservationNumber=" + lastCompletedReservationDetails.number);
            lastCompletedButton.innerText = "Laatst voltooide reservering";

            // Insert the button after the reservation search button
            document.querySelector("#frmAddParcels > div.form-group.pt-3").insertBefore(lastCompletedButton, $('#frmAddParcels > div.form-group.pt-3 > button').nextSibling);
        }

        var lastOpenReservationDetails = JSON.parse(localStorage.getItem("NKHR_LastOpenReservationDetails"))

        // Test if we have a saved last saved reservation and create the button if we do
        if (lastOpenReservationDetails != null)
        {
            // Return and do not create the button if it is the same as last completed
            if (lastOpenReservationDetails && lastCompletedReservationDetails && lastOpenReservationDetails.number == lastCompletedReservationDetails.number ) { return; }

            // Setup the button element with proper text, attributes and url
            var lastOpenButton = document.createElement("a");
            lastOpenButton.setAttribute("class", "btn btn-primary btn-block");
            lastOpenButton.setAttribute("id", "lastCompletedButton");
            lastOpenButton.setAttribute("href", "https://retailvista.net/bztrs/packingportal/Parcels?reservationId=" + lastOpenReservationDetails.id + "&allowCashOnDelivery=False");
            lastOpenButton.innerText = "Laatst geopende reservering";

            // Insert the button after the reservation search button
            document.querySelector("#frmReservations > div.form-group.pt-3").insertBefore(lastOpenButton, $('#frmAddParcels > div.form-group.pt-3 > button').nextSibling);
        }
    }

    // This function saves the currently open reservation to local storage as the last open reservation
    function saveLastOpenReservation(){
        var reservationNumber = document.querySelector("#Reservation_ReservationNumber").value;
        var reservationID = document.querySelector("#VerificationReservationRows_0__ReservationId").value;

        var reservationDetails = { id: reservationID, number: reservationNumber };

        localStorage.setItem("NKHR_LastOpenReservationDetails", JSON.stringify(reservationDetails));
    }

        // This function saves the currently open reservation to local storage as the last completed reservation
    function saveLastCompletedReservation(){
        var reservationNumber = document.querySelector("#Reservation_ReservationNumber").value;
        var reservationID = window.location.href.split('reservationId=').pop().split('&').shift();

        var reservationDetails = { id: reservationID, number: reservationNumber };

        localStorage.setItem("NKHR_LastCompletedReservationDetails", JSON.stringify(reservationDetails));
    }

    // Enable christmas theming for the portal
    function merryChristmas(){
        // Christmas snowflakes
        $("body").append ( `
        <style>
            /* customizable snowflake styling */
            .snowflake {
              color: #fff;
              font-size: 1em;
              font-family: Arial, sans-serif;
              text-shadow: 0 0 5px #000;
            }

            .snowflake,.snowflake .inner{animation-iteration-count:infinite;animation-play-state:running}@keyframes snowflakes-fall{0%{transform:translateY(0)}100%{transform:translateY(110vh)}}@keyframes snowflakes-shake{0%,100%{transform:translateX(0)}50%{transform:translateX(80px)}}.snowflake{position:fixed;top:-10%;z-index:9999;-webkit-user-select:none;user-select:none;cursor:default;pointer-events:none;animation-name:snowflakes-shake;animation-duration:3s;animation-timing-function:ease-in-out}.snowflake .inner{animation-duration:10s;animation-name:snowflakes-fall;animation-timing-function:linear}.snowflake:nth-of-type(0){left:1%;animation-delay:0s}.snowflake:nth-of-type(0) .inner{animation-delay:0s}.snowflake:first-of-type{left:10%;animation-delay:1s}.snowflake:first-of-type .inner,.snowflake:nth-of-type(8) .inner{animation-delay:1s}.snowflake:nth-of-type(2){left:20%;animation-delay:.5s}.snowflake:nth-of-type(2) .inner,.snowflake:nth-of-type(6) .inner{animation-delay:6s}.snowflake:nth-of-type(3){left:30%;animation-delay:2s}.snowflake:nth-of-type(11) .inner,.snowflake:nth-of-type(3) .inner{animation-delay:4s}.snowflake:nth-of-type(4){left:40%;animation-delay:2s}.snowflake:nth-of-type(10) .inner,.snowflake:nth-of-type(4) .inner{animation-delay:2s}.snowflake:nth-of-type(5){left:50%;animation-delay:3s}.snowflake:nth-of-type(5) .inner{animation-delay:8s}.snowflake:nth-of-type(6){left:60%;animation-delay:2s}.snowflake:nth-of-type(7){left:70%;animation-delay:1s}.snowflake:nth-of-type(7) .inner{animation-delay:2.5s}.snowflake:nth-of-type(8){left:80%;animation-delay:0s}.snowflake:nth-of-type(9){left:90%;animation-delay:1.5s}.snowflake:nth-of-type(9) .inner{animation-delay:3s}.snowflake:nth-of-type(10){left:25%;animation-delay:0s}.snowflake:nth-of-type(11){left:65%;animation-delay:2.5s}
        </style>

        <div class="snowflakes" aria-hidden="true">
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
          <div class="snowflake">
            <div class="inner">❅</div>
          </div>
        </div>
    ` );

        // Santa image
        $("body").append (
            '<img id="christmasImage" src="https://i.pinimg.com/originals/fc/15/63/fc15634baf60b9b5c3f80e439978efb0.gif">'
        );

        $("#christmasImage").css ( {
            position:   "fixed",
            width:      "128px",
            height:     "128px",
            bottom:        "60px",
            right:       "0px"
        } );
    }

    // ||| SHOPWARE INTEGRATION FUNCTIONS |||

    // This function initializes the shopware integration
    async function shopwareInitialize() {
        var token;

        // Check if token exists locally
        var storageToken = localStorage.getItem("NKHR_ShopwareToken");
        if (typeof storageToken !== 'undefined' && storageToken !== null) {
            // Parse the local storage item if it exists
            token = JSON.parse(storageToken);

            console.log("Retrieving token from storage...");
        }
        else {
            // If no token exists in local storage retrieve a new one
            let login = await shopwareLoginDialog();

            token = await shopwareGetToken(login.username, login.password);
        }

        var version;

        try {
            version = await shopwareGetVersion(token);
        } catch(err) {
            // If it throws unauthorized error try refreshing the token
            if (err.responseJSON.errors[0].status == 401 && err.responseJSON.errors[0].code == 9) {
                try {
                    token = await shopwareRefreshToken(token);
                } catch {
                    // get a new token if refresing fails
                    let login = await shopwareLoginDialog();

                    token = await shopwareGetToken(login.username, login.password);
                }
            }
            else {
                // try getting a new token if the error is not recognized
                let login = await shopwareLoginDialog();

                token = await shopwareGetToken(login.username, login.password);
            }

            version = await shopwareGetVersion(token);
        }

        console.log(version);

        console.log("Shopware integration initialized");

        return token;
    }

    // Function that sends a request for a new token with the given credentials
    async function shopwareGetToken(username, password) {
        // Request a new token if it doesn't exist locally

        const settings = {
            async: true,
            crossDomain: true,
            url: shopwareApiUrl + "/api/oauth/token",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            processData: false,
            data: JSON.stringify({
                client_id: "administration",
                grant_type: "password",
                scopes: "write",
                username: username,
                password: password
            })
        };

        console.log("Retrieving shopware token...");

        var token = await $.ajax(settings);

        // Save the token to local storage
        localStorage.setItem("NKHR_ShopwareToken", JSON.stringify(token));

        return token;
    }

    // Function that refreshes the given token
    async function shopwareRefreshToken(token) {
        const settings = {
            async: true,
            crossDomain: true,
            url: shopwareApiUrl + '/api/oauth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            processData: false,
            data: JSON.stringify({
                grant_type: "refresh_token",
                client_id: "administration",
                refresh_token: token.refresh_token
            })
        };

        console.log("Refreshing shopware token...");

        var newToken = await $.ajax(settings);

        // Save the token to local storage
        localStorage.setItem("NKHR_ShopwareToken", JSON.stringify(newToken));

        return newToken;
    }

    // Function that retrieves the shopware API version
    async function shopwareGetVersion(token) {
        const settings = {
            async: true,
            crossDomain: true,
            url: shopwareApiUrl + '/api/_info/version',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token.access_token
            }
        };

        console.log("Getting shopware version...");

        return $.ajax(settings);
    }

    // Function that retrieves the order data for a given ordernumber
    async function shopwareGetOrderData(token, orderNumber) {
        const settings = {
            async: true,
            crossDomain: true,
            url: shopwareApiUrl + '/api/search/order',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token.access_token
            },
            processData: false,
            // Create filter settings for ordernumber
            data: JSON.stringify({
                filter: [
                    {
                        type: "contains",
                        field: "orderNumber",
                        value: orderNumber
                    }
                ]
            })
        };

        console.log("Retrieving order data for order with number (" + orderNumber + ").");

        return $.ajax(settings);
    }

    // Function that updates order customer comment
    async function shopwareUpdateOrderComment(token, data){
        const settings = {
            async: true,
            crossDomain: true,
            url: shopwareApiUrl + '/api/order/' + data.id,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.api+json, application/json',
                Authorization: 'Bearer ' + token.access_token
            },
            // Filter out the rest of the data and send only the customer comment
            data: JSON.stringify({
                customerComment: data.customerComment
            })
        };

        console.log("Updating shopware order customer comment...");

        return $.ajax(settings);
    }

    // Create a login dialog to retrieve shopware login credentials
    async function shopwareLoginDialog() {
        //--- Use jQuery to add the form in a "popup" dialog.
        $("body").append ( `
            <div id="shopwarePopupContainer">
            <center><h3>Shopware Login</h3></center>
                <form>
                <label for="sw_username">Username: </label><br>
                    <input type="text" id="sw_username" value=""><br>
                    <label for="sw_password">Password: </label><br>
                    <input type="text" id="sw_password" value=""><br>

                    <center><button id="shopwareLoginButton" type="button">Login</button></center>
                </form>
            </div>
        `);

        $("#shopwareLoginButton").click ( function () {
            $("#gmPopupContainer").hide ();
        } );

        GM_addStyle (`
            #shopwarePopupContainer {
                position:               fixed;
                align-self:             center;
                top:                    25px;
                padding:                2em;
                background:             #eff6f3;
                border:                 1px solid black;
                border-radius:          1ex;
                z-index:                777;
            }
            #shopwarePopupContainer button{
                cursor:                 pointer;
                margin:                 1em 1em 0;
                border:                 1px outset buttonface;

            }
        `);

        return new Promise((resolve, reject) => {
            $("#shopwareLoginButton").click ( function () {
                let username = document.querySelector("#sw_username").value;
                let password = document.querySelector("#sw_password").value;

                $("#shopwarePopupContainer").hide();
                resolve({
                    username: username,
                    password: password
                });
            });
        });
    }
})();