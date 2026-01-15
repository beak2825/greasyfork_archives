// ==UserScript==
// @name               NedFox Auto KHR
// @namespace          NedFoxAutoKHR
// @version            5.2.4
// @description        Auto-Proceed Nedfox steps in the packing portal
// @author             Kevin van der Bij
// @license            MIT
// @match              https://retailvista.net/bztrs/*
// @match              file:///C:/Users/Kevin/OneDrive%20-%20Kampeerhal%20Roden%20B.V/Backoffice/Tampermonkey/*
// @icon               https://www.kampeerhalroden.nl/media/e9/9d/08/1703346720/favicon.ico
// @grant              GM_xmlhttpRequest
// @grant              GM_addStyle
// @grant              GM_addValueChangeListener
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              window.focus
// @grant              window.close
// @connect            kampeerhalroden.nl
// @require            https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @downloadURL https://update.greasyfork.org/scripts/555697/NedFox%20Auto%20KHR.user.js
// @updateURL https://update.greasyfork.org/scripts/555697/NedFox%20Auto%20KHR.meta.js
// ==/UserScript==

/*
ToDo:
1. Refactor!
*/

/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    // Path to the shopware API url the integration will use
    const shopwareApiUrl = "https://www.kampeerhalroden.nl";
    
    // Get the path for the current window location
    var path = window.location.pathname;

    console.log(path)

    // Ensure localstorage does not get too large
    manageLocalStorage();

    // Switch based on the current page location with regular expression testing
    switch(true){
        case /bztrs\/packingportal\/CompleteReservations.*/.test(path):
            onCompleteReservationStep();
            break;

        case /bztrs\/packingportal\/Parcels.*/.test(path):
            onShipReservationStep();
            break;

        case /bztrs\/packingportal\/Reservations\/Index\/.*/.test(path):
            onVerifyReservationStep();
            break;

        case /bztrs\/packingportal.*/.test(path):
            onSelectReservationStep();
            break;

        case /\/C:\/Users\/Kevin\/OneDrive%20-%20Kampeerhal%20Roden%20B.V\/Backoffice\/Tampermonkey\/TestPages.*/.test(path):
            //completeReservation();
            //processOrderSelection();
            break;
    }

    // Step 1: called on the home page where the user has to select a reservation
    function onSelectReservationStep() {
        addLastReservationButtons();
        processOrderSelection();

        // Select the barcode field in the first step
        waitForKeyElements("#Productbarcode", (elements) => {
            elements[0].focus();
        });
    }

    // Step 2: called on the second page where the user has to verify the products in the reservation
    function onVerifyReservationStep() {
        let reservationID = document.getElementById("ReservationId").value;
        let productList = document.querySelector("#ReservationContainer > div > div.container.my-2 > div");

        // Cache the product list for the next page in the packing process
        localStorage.setItem("NKHR_productList_" + reservationID, productList.outerHTML);

        // Skips the second step and sets all products to collected, we do not need the 2nd step anymore because of the loaded product list in step 3
        skipSecondStep();
    }

    // Step 3: called on the third page where the user has to create the shipping parcel
    function onShipReservationStep() {
        // Click button to third step to finalize order processing when it is enabled
        proceedStep("#ParcelsContainer > div > div:nth-child(4) > div > button:not(:disabled)");

        // HACKY WORKAROUND to clear input after scan
        document.querySelector("#verifyProduct").addEventListener("click", clearInput("#productBarcode"), false);

        addProductList();
        editReservationDetails();
        createCommentBox();
        clearAllParcelItems();
        saveLastOpenReservation();
        autoFillParcel();
        
        onScanProductForParcel();
    }

    // Step 4: called on the fourth page with the completion status of the reservation
    function onCompleteReservationStep() {
        // Save current reservation as last completed.
        saveLastCompletedReservation();

        let completionSuccess = document.querySelector("#Reservation_Status").value == "ClosedByInvoiceSale" ? true : false;
        
        // Update mass complete status
        updateMassComplete(completionSuccess);

        // Click button to complete the process and go back to first step once it appears
        if (completionSuccess == true) {
            proceedStep("#ReservationContainer > div:nth-child(11) > div > button");
        }
    }

    function processOrderSelection() {
        // Wait for the modal to exist before we start processing
        waitForKeyElements("#productReservationsModal", (modal) => {
            let reservations = [];

            let singleLineReservationsElement = modal[0].querySelector(".singleline-reservations");
            
            // Process all of the needed info for single line reservations
            if (singleLineReservationsElement) {
                for (let reservation of singleLineReservationsElement.children) {
                    
                    let reservationNumber = Array.from(reservation.querySelector(".col-4").children).find(child => /Reservering:.*/.test(child.innerText)).innerText.split(": ").pop();

                    reservations.push({
                        reservationNumber: reservationNumber,
                        type: "singleLine",
                        ref: reservation
                    });
                }
            }

            let validReservationsElement = modal[0].querySelector(".valid-reservations");
            
            // Process all of the needed info for multi line reservations
            if (validReservationsElement) {
                for (let reservation of validReservationsElement.children) {
                    
                    let reservationNumber = Array.from(reservation.querySelector(".col-4").children).find(child => /Reservering:.*/.test(child.innerText)).innerText.split(": ").pop();

                    reservations.push({
                        reservationNumber: reservationNumber,
                        type: "multiLine",
                        ref: reservation
                    });
                }
            }

            let singleLineReservations = reservations.filter((reservation) => reservation.type == "singleLine");

            let massCompleteThreshold = 3;

            console.log(singleLineReservations.length);
            console.log(massCompleteThreshold);

            // If the amount of single line orders is past the threshold, create the mass complete button
            if (singleLineReservations.length >= massCompleteThreshold) {
                var massCompleteButton = document.createElement("button");
                massCompleteButton.setAttribute("class", "btn btn-primary");
                massCompleteButton.setAttribute("style", "height:40px;");
                massCompleteButton.innerText = "Massa voltooien";

                massCompleteButton.onclick = function(){
                    startMassComplete(singleLineReservations)
                    massCompleteButton.disabled = true;
                };

                modal[0].querySelector("div > div > div.modal-body > div > div > div:nth-child(3)").append(massCompleteButton);
            }
            
            // Open the first reservation in the array
            if (singleLineReservations.length < massCompleteThreshold) {
                reservations[0].ref.querySelector(".btn").click();
            }
        })
    }

    function startMassComplete(reservations) {
        for(let reservation of reservations) {
            // Create element displaying status
            let status = document.createElement("div");
            status.setAttribute("id", "status_" + reservation.reservationNumber);
            status.innerText = "Bezig..."

            // Find the open button, open the window and remove the element
            let button = reservation.ref.querySelector("div > div.col-2 > div > a");
            button.setAttribute("target", "_blank");

            window.open(button.href);

            button.after(status);
            button.remove();

            // Set the status to uncompleted
            reservation.status = 0;
        }
        
        window.focus();

        GM_setValue("NKHR_MassCompleteStatus", JSON.stringify(reservations))
        monitorMassComplete();
    }

    // Checks to see if any of the mass orders have been completed and sets the status element
    async function monitorMassComplete() {
        setInterval(function(){
            let status = JSON.parse(GM_getValue("NKHR_MassCompleteStatus", "[{}]"));

            for (let reservation of status) {
                let statusElement = document.querySelector("#status_" + reservation.reservationNumber);
                
                if (statusElement) {
                    switch(reservation.status){
                        case 1:
                            statusElement.innerText = "Voltooid";
                            break;

                        case 2:
                            statusElement.innerText = "Fout";
                            break;
                    }
                }
            }
        }, 200);
    }

    function updateMassComplete(completionSuccess) {
        let reservationNumber = document.querySelector("#Reservation_ReservationNumber").value;

        // Get the status value and parse it
        var status = JSON.parse(GM_getValue("NKHR_MassCompleteStatus", "[{}]"));
        
        // Add the listener so the status value gets updated automatically
        GM_addValueChangeListener("NKHR_MassCompleteStatus", function(key, oldValue, newValue, remote) {
            status = JSON.parse(newValue);
        })

        // Check if the current order is tracked by masscomplete status
        if (status.find((reservation) => reservation.reservationNumber == reservationNumber)) {
            // Get the status again to be sure that we are working on the latest value
            status = JSON.parse(GM_getValue("NKHR_MassCompleteStatus", "[{}]"));
            
            // Set the status value for the current reservation
            status.find((reservation) => reservation.reservationNumber == reservationNumber).status = completionSuccess ? 1 : 2;

            // Write the value to storage
            GM_setValue("NKHR_MassCompleteStatus", JSON.stringify(status))

            // Close window if the reservation has been completed and is part of mass complete instance
            if (completionSuccess) {
                window.close();
            }
        }
    }

    function autoFillParcel() {
        let reservationNumber = document.getElementById("Reservation_ReservationNumber").value;

        let status = JSON.parse(GM_getValue("NKHR_MassCompleteStatus"));

        waitForKeyElements("#productList", (productList) => {
            // Check if the current reservation is being tracked by masscomplete
            if (status.find((reservation) => reservation.reservationNumber == reservationNumber)) {
                let productItems = Array.from(productList[0].querySelector("div > div > table > tbody").children);
                
                // iterate over the product list
                for (let i = 1; i < productItems.length; i++) {
                    // Set the barcode input and click the button to scan
                    document.querySelector("#productBarcode").value = productItems[i].children[2].innerText;
                    document.querySelector("#verifyProduct").click();
                }
            }
        })
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
            //item.children[4].remove();
        });

    }

    var barcodeInput = "";

    function onScanProductForParcel() {
        // Create observer that checks when the parcels container changes
        let observer = new MutationObserver(() => {
            let matchingProduct = Array.from(document.querySelector("#productList > div > div > table > tbody").children)
                .find((element) => element.children[2].innerText == barcodeInput);

            // Change the collected status of the scanned product in the product list
            if (matchingProduct) {
                matchingProduct.children[4].outerHTML = '<td><span class="text-success"><span class="material-icons">done</span></span></td>';
            }
        });

        const observerOptions = {
            childList: true,
            subtree: true,
        };

        observer.observe(document.querySelector("#ParcelsContainer"), observerOptions);

        // Track the barcode input element
        waitForKeyElements("#productBarcode", (elements) => {
            elements[0].addEventListener("input", (event) => {
                barcodeInput = elements[0].value;
                console.log(barcodeInput)
            });
        })
    }

    // Skip second step, set product values correctly and instantly forward page.
    function skipSecondStep(){
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

        if (removeButtons.length > 0) {
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
            
            // hopefully fix 0 issue
            setTimeout(() => location.href = "javascript:void(update());", 500);
        }
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

    /********************************************
     *                                          *
     *          SHOPWARE INTEGRATION            *
     *                                          *
     ********************************************/

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