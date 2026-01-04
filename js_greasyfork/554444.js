// ==UserScript==
// @name         Variational PnL
// @namespace    variational-tools
// @version      0.1
// @description  Adds Total PnL to the Variational Portfolio page & header
// @author       inco
// @match        https://omni.variational.io/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/554444/Variational%20PnL.user.js
// @updateURL https://update.greasyfork.org/scripts/554444/Variational%20PnL.meta.js
// ==/UserScript==

(function() {

    const dataUpdateInterval = 30000; // How often to retrieve new data
    const portfolioPageCheckInterval = 1000; // How often to check whether we're on the portfolio page

    // ---------- HTML elements ----------
    const PnLBox = document.createElement('div');
    // flex flex-col sm:flex-col gap-0.5
    PnLBox.classList.add('flex', 'flex-col', 'sm:flex-col', 'gap-0.5')
    PnLBox.innerHTML = `
    <span class="text-blackwhite/50 truncate">Total PnL</span>
    <div class="flex items-center gap-1">
        <span class="inline-block tabular-nums text-left text-red transition ease-in-out duration-300" id="pnl-value-header">N/A</span>
    </div>
    `;

    const statsBar = document.createElement('div');
    statsBar.classList.add('relative', 'flex', 'items-center', 'justify-around', 'px-8', 'gap-3', 'h-16', 'bg-darkblue-400', 'rounded-sm', 'm-[2px]');

    statsBar.innerHTML = `
    <!--Num Transfers-->
    <div class="flex flex-col items-start text-xs text-center gap-0.5 whitespace-nowrap" style="width:100px">
        <div role="button" tabindex="0" class="text-blackwhite/50" style="color: #f7f5efc2">Num Orders</div>
        <div slot="value" class="transition ease-in-out duration-300">
            <span class="" id="num-transfers">N/A</span>
        </div>
    </div>

    <!--PnL-->
    <div class="flex flex-col items-start text-xs text-center gap-0.5 whitespace-nowrap" style="width:100px">
        <div role="button" tabindex="0" class="text-blackwhite/50" style="color: #f7f5efc2">Total Realized PnL</div>
        <div slot="value" class="transition ease-in-out duration-300">
            <span class="text-red" id="pnl-value">N/A</span>
        </div>
    </div>

    <!--Funding-->
    <div class="flex flex-col items-start text-xs text-center gap-0.5 whitespace-nowrap" style="width:100px">
        <div role="button" tabindex="0" class="text-blackwhite/50" style="color: #f7f5efc2">Total Funding</div>
        <div slot="value" class="transition ease-in-out duration-300">
            <span class="" id="funding-value">N/A</span>
        </div>
    </div>

    <!--Refunds-->
    <div class="flex flex-col items-start text-xs text-center gap-0.5 whitespace-nowrap" style="width:100px">
        <div role="button" tabindex="0" class="text-blackwhite/50" style="color: #f7f5efc2">Num Refunds</div>
        <div slot="value" class="transition ease-in-out duration-300">
            <span class="" id="num-refunds">N/A</span>
        </div>
    </div>

    <!--Refund Value-->
    <div class="flex flex-col items-start text-xs text-center gap-0.5 whitespace-nowrap" style="width:100px">
        <div role="button" tabindex="0" class="text-blackwhite/50" style="color: #f7f5efc2">Total Refund Value</div>
        <div slot="value" class="transition ease-in-out duration-300">
            <span class="" id="refund-value">N/A</span>
        </div>
    </div>
    `;

    const checkInterval = setInterval(() => {

        
        const pnlBoxInjectionTarget = document.querySelector('[data-testid="portfolio-summary"]');
        if (pnlBoxInjectionTarget) {
            pnlBoxInjectionTarget.prepend(PnLBox);
            console.log('PnL box added.');
            clearInterval(checkInterval); // Stop the interval once the element is found
        }
    }, 500); // Check every 500 milliseconds until found

    let statsBarAdded = false;

    setInterval(() => {
        if( !statsBarAdded && window.location.pathname === "/portfolio" ) {
            const statsBarInjectionTarget = document.querySelector('.relative.flex.flex-col.w-full.px-2.my-12');
            if (statsBarInjectionTarget) {
                //Select second child
                statsBarInjectionTarget.insertBefore(statsBar, statsBarInjectionTarget.children[2]);
                console.log('Stats bar added.');
                statsBarAdded = true;
            }
        } else if (statsBarAdded && window.location.pathname !== "/portfolio") {
            statsBarAdded = false;
        }
    }, portfolioPageCheckInterval); // Check every 1 second

    const $ = (sel) => statsBar.querySelector(sel);

    const el = {
        numTransfers: $('#num-transfers'),
        pnlValue: $('#pnl-value'),
        fundingValue: $('#funding-value'),
        numRefunds: $('#num-refunds'),
        refundValue: $('#refund-value'),
    }
    
    const pnlValueHeader = PnLBox.querySelector('#pnl-value-header');
    

    async function getTransfers(offset) {
    return await fetch(`https://omni.variational.io/api/transfers?limit=100&offset=${offset}&order_by=created_at&order=desc`, {
        headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.6",
        "content-type": "application/json",
        },
        method: "GET",
        mode: "cors",


        credentials: "include"
    })
        .then(r => r.json())
        .then(r => {
            return r.result;
        })
    }

    // Queries paginated API endpoint, calculates PnL
    async function getPnL() {
        let offset = 0;
        let count = 0;
        let PnL = 0;
        let funding = 0;
        let refund = 0;
        let refundCount = 0;
        // Get pnl
        while (true) {
            const transactions = await getTransfers(offset);
            //console.log(transactions)
            if (transactions.length === 0) break;
            
            transactions.forEach(t => {
                if (t.transfer_type === "realized_pnl") {
                    PnL += parseFloat(t.qty);
                }
                if (t.transfer_type === "funding") {
                    funding += parseFloat(t.qty);
                }
                if (t.transfer_type === "reward") {
                    refund += parseFloat(t.qty);
                    refundCount += 1;
                }
            });
            offset += 100;
            count += transactions.length;
        }


        el.numTransfers.textContent = `${count}`;
        //console.log(`Total PnL over ${count} transfers: \$${PnL}`);
        el.pnlValue.textContent = `$${PnL.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        el.fundingValue.textContent = `$${funding.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        el.numRefunds.textContent = `${refundCount}`;
        el.refundValue.textContent = `$${refund.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

        pnlValueHeader.textContent = `$${PnL.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

        if( PnL > 0 ) {
            el.pnlValue.classList.replace('text-red', 'text-green');
            pnlValueHeader.classList.replace('text-red', 'text-green');
        } else {
            el.pnlValue.classList.replace('text-green', 'text-red');
            pnlValueHeader.classList.replace('text-green', 'text-red');
        }
        if( funding > 0 ) {
            el.fundingValue.classList.replace('text-red', 'text-green');
        } else {
            el.fundingValue.classList.replace('text-green', 'text-red');
        }
    }

    getPnL();
    // Update data every 30 seconds
    setInterval(getPnL, dataUpdateInterval);

})();