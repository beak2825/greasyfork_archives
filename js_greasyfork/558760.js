// ==UserScript==
// @name         Transfer History
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Script to be able to view a transfer history summary on the team page
// @author       José de los Ríos (FC Cortadura)
// @match        https://footballmanagerproject.com/Team/Board*
// @match        https://www.footballmanagerproject.com/Team/Board*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558760/Transfer%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/558760/Transfer%20History.meta.js
// ==/UserScript==

async function retrieveTransferHistory(teamId, season, firstUpdate) {

    // Return a new Promise that resolves when the AJAX succeeds
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Transfers/GetTeamTransfers',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({ teamId, season }),

            success: function (result) {
                // Resolve the promise with the data
                resolve(result);
            },

            error: function (xhr, resp, text) {
                console.error("AJAX Error:", text);
                reject(text);
            }
        });
    });
}

async function retrieveAllTransferHistory(teamId){

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "/Transfers/GetTeamTransfersSummary",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({ teamId }),

            success: function (result) {
                resolve(result);
            },
            error: function(xhr, resp, text){
                console.error("AJAX Error:", text);
                reject(text);
            }
        });
    });
}

async function retrieveTeamIdFromBoardPage(){

    var teamId = null;

    const url = window.location.href;
    const urlObject = new URL(url);

    // Si estamos en nuestro propio Board
    if (url.endsWith("/Board")) {
        try {
            // await funciona si $.getJSON devuelve un objeto Promise-like
            const ajaxResults = await $.getJSON({
                "url": "/Team/Home?handler=HomeData",
                "datatype": "json",
                "contentType": "application/json",
                "type": "GET"
            });

            teamId = ajaxResults.teamId;

        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    }

    else{
        const params = new URLSearchParams(urlObject.search);
        teamId = params.get('id');
    }

    return teamId;

}

async function getPlayerInfo(playerIds){
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Players/GetPlayersInfo',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                playerIds: playerIds
            }),
            success: function (response) {
                if (response.success) {
                    resolve(response.playersInfo);
                    console.log(response.playersInfo);
                } else {
                    console.error(response.message);
                }
            },
            error: function (xhr) {
                console.error(
                    'HTTP error:',
                    xhr.status,
                    xhr.responseText
                );
            }
        });
    });
}

async function htmlElementTransferHistory(teamId, data) {

    var sumPurchased = 0;
    var sumSold = 0;
    var homegrownIncome = 0;
    var tradingIncome = 0;

    var maxPurchase = [0,0]; // [playerId, price]
    var maxSale = [0,0]; // [playerId, price]


    var inTransferIds = new Set();
    var outTransferIds = new Set();

    var playerBuyPrices = new Map(); // [playerId, price] // This is for doing the trading balance

    var outPlayers = [];

    teamId = parseInt(teamId);

    const transferHistory = data.transferHistory || [];


    transferHistory.forEach(transfer => {

        const playerId = parseInt(transfer.playerID);
        const price = parseInt(transfer.price);
        const transferId = parseInt(transfer.transferID);
        const isSale = transfer.isSell;

        // --- OUTGOING (Sold) ---
        if (isSale) {

            if (outTransferIds.has(transferId)) return;
            outTransferIds.add(transferId);

            const boughtPrice = playerBuyPrices.get(playerId);

            if (boughtPrice === undefined) {
                homegrownIncome += price;
            } else {
                tradingIncome += (price - boughtPrice);

                playerBuyPrices.delete(playerId);
            }

            if(price > maxSale[1]){
                maxSale = [playerId, price];
            }

            outPlayers.push([playerId, price]);
            sumSold += price;

        }

        // --- INCOMING (Bought) ---
        else if (!isSale) {

            if (inTransferIds.has(transferId)) return;
            inTransferIds.add(transferId);

            playerBuyPrices.set(playerId, price);

            if(price > maxPurchase[1]){
                maxPurchase = [playerId, price];
            }

            sumPurchased += price;
        }
    });

    // Creamos el elemento HTML

    var transferHistoryWrapper = document.createElement('div');

    var transferHistoryTitle = document.createElement('div');
    transferHistoryTitle.style.fontSize = '16px';
    transferHistoryTitle.style.color = "#a1e2ba";
    transferHistoryTitle.classList.add('title');
    transferHistoryTitle.textContent = 'Transfer Summary';

    var transferHistoryMain = document.createElement('div');
    transferHistoryMain.style.display = 'flex';

    var transferHistoryList = document.createElement('ul');
    var transferHistorySold = document.createElement('li');
    var transferHistoryBought = document.createElement('li');
    var transferHistoryBalance = document.createElement('li');
    var transferHistoryHomegrown = document.createElement('li');
    var transferHistoryTrading = document.createElement('li');

    var playerRecordsTitle = document.createElement('div');
    playerRecordsTitle.style.fontSize = '16px';
    playerRecordsTitle.style.color = "#a1e2ba";
    playerRecordsTitle.classList.add('title');
    playerRecordsTitle.classList.add('section');
    playerRecordsTitle.textContent = 'Top Transfers';

    var playerRecordsContainer = document.createElement('div');

    var playerRecordsList = document.createElement('ul');
    var playerRecordPurchase = document.createElement('li');
    var playerRecordPurchaseLink = document.createElement('a');
    var playerRecordPurchasePrice = document.createElement('span');
    var playerRecordSale = document.createElement('li');
    var playerRecordSaleLink = document.createElement('a');
    var playerRecordSalePrice = document.createElement('span');

    playerRecordsContainer.appendChild(playerRecordsTitle);
    playerRecordsContainer.appendChild(playerRecordsList);

    transferHistorySold.textContent = "Purchased Players: ⓕ" + sumPurchased.toLocaleString("en-US");
    transferHistoryBought.textContent = "Sold Players: ⓕ" + sumSold.toLocaleString("en-US");

    var balance = sumSold - sumPurchased;
    transferHistoryBalance.textContent = "Balance: ⓕ" + balance.toLocaleString("en-US");
    (balance < 0) ? transferHistoryBalance.style.color = '#ff7979' : transferHistoryBalance.style.color = '#95d694';
    transferHistoryHomegrown.textContent = "Homegrown Players Income: ⓕ" + homegrownIncome.toLocaleString();

    transferHistoryTrading.textContent = "Trading Balance: ⓕ" + tradingIncome.toLocaleString("en-US");
    (tradingIncome < 0) ? transferHistoryTrading.style.color = '#ff7979' : transferHistoryTrading.style.color = '#95d694';

    const recordHoldersInfo = await getPlayerInfo([maxPurchase[0], maxSale[0]]);

    // <a href="/NationalTeam/NtBoard?nt=pt"><img class="small-flag" src="\images\flags\pt.png"></a>

    playerRecordPurchase.textContent = "Purchase: ";
    playerRecordPurchasePrice.textContent = "ⓕ" + maxPurchase[1].toLocaleString("en-US");
    playerRecordPurchaseLink.href = "/Team/Player?id=" + maxPurchase[0];
    playerRecordPurchaseLink.textContent = recordHoldersInfo[0].id == maxPurchase[0] ? recordHoldersInfo[0].fullName : recordHoldersInfo[1].fullName;

    playerRecordSale.textContent = "Sale: ";
    playerRecordSalePrice.textContent = "ⓕ" + maxSale[1].toLocaleString("en-US");
    playerRecordSaleLink.href = "/Team/Player?id=" + maxSale[0];
    playerRecordSaleLink.textContent = recordHoldersInfo[0].id == maxSale[0] ? recordHoldersInfo[0].fullName : recordHoldersInfo[1].fullName;


    transferHistoryList.appendChild(transferHistorySold);
    transferHistoryList.appendChild(transferHistoryBought);
    transferHistoryList.appendChild(transferHistoryBalance);
    transferHistoryList.appendChild(transferHistoryHomegrown);
    transferHistoryList.appendChild(transferHistoryTrading);

    playerRecordPurchase.appendChild(playerRecordPurchaseLink);
    playerRecordPurchase.appendChild(playerRecordPurchasePrice);
    playerRecordSale.appendChild(playerRecordSaleLink);
    playerRecordSale.appendChild(playerRecordSalePrice);

    playerRecordsList.appendChild(playerRecordPurchase);
    playerRecordsList.appendChild(playerRecordSale);

    transferHistoryMain.appendChild(transferHistoryList);
    transferHistoryMain.appendChild(playerRecordsContainer);

    transferHistoryWrapper.appendChild(transferHistoryTitle);
    transferHistoryWrapper.appendChild(transferHistoryMain);

    Object.assign(transferHistoryList.style, {
        listStyle: "none",
        paddingLeft: '5px'

    });

    Object.assign(playerRecordPurchase.style, {
        display: "flex",
        justifyContent: "space-between",
    });

    Object.assign(playerRecordSale.style, {
        display: "flex",
        justifyContent: "space-between",
    });

    Object.assign(playerRecordsList.style, {
        listStyle: "none",
        paddingLeft: "5px",
        // border: "1px solid #a2f1a255",
        // borderRadius: "10px",
    });

    Object.assign(transferHistoryMain.style, {
        display: "flex",
        flexDirection: "column",
        marginTop: "5px",
        gap: "10px"
    });

    Object.assign(transferHistoryWrapper.style, {
        marginTop: "20px",
        // padding: "15px",
        display: "flex",
        flexDirection: 'column',
        // borderRadius: "15px",   // To get a similar UI as Vanilla FMP
        // boxShadow: "0 0 20px #0004",
        color: "#cce8ba"
    });

    // Efecto Hover Compra
    playerRecordPurchaseLink.addEventListener('mouseenter', () => {
        playerRecordPurchaseLink.style.textDecoration = "underline";
    });
    playerRecordPurchaseLink.addEventListener('mouseleave', () => {
        playerRecordPurchaseLink.style.textDecoration = "none";
    });

    // Efecto Hover Compra
    playerRecordSaleLink.addEventListener('mouseenter', () => {
        playerRecordSaleLink.style.textDecoration = "underline";
    });
    playerRecordSaleLink.addEventListener('mouseleave', () => {
        playerRecordSaleLink.style.textDecoration = "none";
    });

    return transferHistoryWrapper;
}

(function() {
    'use strict';

    // 2. Wait for document ready
    $(document).ready(async function() {

        var teamId = await retrieveTeamIdFromBoardPage();
        var htmlElement = null;

        try{
            const teamData = await retrieveAllTransferHistory(teamId);

            htmlElement = await htmlElementTransferHistory(teamId, teamData);

        } catch(error){
            console.error("Failed to fetch team data:", error);
        }

        if(htmlElement){
            document.getElementById('team2Summary').appendChild(htmlElement);
        }

    });



})();