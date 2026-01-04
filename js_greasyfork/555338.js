// ==UserScript==
// @name         Director Plugins
// @namespace    http://tampermonkey.net/
// @version      2025-05-29
// @description  Director Plugins by Brent
// @license      MIT
// @author       You
// @match        https://director/Director/*
// @match        https://director.ad.leadinghealth.co.nz/Director/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leadinghealth.co.nz
// @downloadURL https://update.greasyfork.org/scripts/555338/Director%20Plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/555338/Director%20Plugins.meta.js
// ==/UserScript==

function AddMachinesNavButton() {
    const navMenu = document.querySelector(".leftNavigationMenuContainer");
    const machinesEl = document.createElement("li");
    machinesEl.setAttribute("tabindex", "0");
    machinesEl.className = "menuItems";
    machinesEl.setAttribute("aria-selected", "false");
    machinesEl.id = "NavigationMenu-MachinesButton";
    machinesEl.setAttribute("role", "tab");
    machinesEl.setAttribute("data-for", "dashboard_tooltip");
    machinesEl.setAttribute("data-tip", "Monitor this site");
    machinesEl.setAttribute("currentitem", "false");

    machinesEl.innerHTML = `
            <div class="itemSelectedIndicator"></div>
            <div style="min-width: 54px; height: 60px; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" height="45px" viewBox="0 -960 960 960" width="32px" fill="#1f1f1f"><path d="M209.38-176.92q-24.31 0-42.23-17.94-17.92-17.93-17.92-42.26 0-25.1 17.92-42.6 17.92-17.51 42.23-17.51h541.24q24.31 0 42.23 17.55 17.92 17.54 17.92 42.64 0 24.33-17.92 42.23-17.92 17.89-42.23 17.89H209.38Zm0-485.85q-24.31 0-42.23-17.55-17.92-17.54-17.92-42.64 0-24.33 17.92-42.23 17.92-17.89 42.23-17.89h541.24q24.31 0 42.23 17.94 17.92 17.93 17.92 42.26 0 25.1-17.92 42.6-17.92 17.51-42.23 17.51H209.38Zm0 242.92q-24.31 0-42.23-17.93-17.92-17.93-17.92-42.26t17.92-42.22q17.92-17.89 42.23-17.89h541.24q24.31 0 42.23 17.93 17.92 17.93 17.92 42.26t-17.92 42.22q-17.92 17.89-42.23 17.89H209.38Zm22.7-272.46q12.77 0 21.73-8.5t8.96-22.04q0-12.77-8.89-21.73-8.88-8.96-21.65-8.96-13.54 0-22.11 8.89-8.58 8.88-8.58 21.65 0 13.54 8.5 22.12 8.5 8.57 22.04 8.57Zm0 242.93q12.77 0 21.73-8.89t8.96-21.65q0-12.77-8.89-21.73-8.88-8.97-21.65-8.97-13.54 0-22.11 8.89-8.58 8.89-8.58 21.65 0 12.77 8.5 21.73 8.5 8.97 22.04 8.97Zm0 242.92q12.77 0 21.73-8.89 8.96-8.88 8.96-21.65 0-13.54-8.89-22.12-8.88-8.57-21.65-8.57-13.54 0-22.11 8.5-8.58 8.5-8.58 22.04 0 12.77 8.5 21.73t22.04 8.96Z"/></svg>
            </div>
            <div class="menuItem">Machines</div>
            `;

    navMenu.appendChild(machinesEl);
    document.querySelector("#NavigationMenu-MachinesButton").addEventListener("click", ()=> {
        document.location = `/Director/filters/machines/server-os?locale=en_US&locale=en_US&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52`;
    });
}

function AddNewHomeButtonBehaviour() {
    const oldEl = document.querySelector("#t_topbar_logo_product");
    const newEl = oldEl.cloneNode(true);
    oldEl.parentNode.replaceChild(newEl, oldEl);
    const url = `/Director`;
    newEl.addEventListener("mouseup", (event) => {
        if (event.button === 1) {
            window.open(url, "_blank");
            event.preventDefault();
        }
    });
    newEl.addEventListener("click", (event) => { document.location.href = url; });
}

function AddNewUserManagerMachineButtonBehaviour() {
    if (!document.location.pathname.includes("helpDesk/user/activityManager")) {
        return
    }

    const checkContentLoaded = setInterval(()=>{
        if (document.querySelector(".machine")) {
            clearInterval(checkContentLoaded);
            const newEl = document.querySelector(".machine");
            const match = newEl.textContent.match(/\(([^:]+):/);
            const machineName = match ? match[1] : null;
            const urls = {
                "LEADINGHEALTH\\LH-CTXVDA-01": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-7894&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-01&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-02": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5141&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-02&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-03": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5123&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-03&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-04": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5751&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-04&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-05": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5727&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-05&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-06": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-2914&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-06&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-07": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-2915&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-07&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-08": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-2916&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-08&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-09": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-1240&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-09&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-10": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-2917&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-10&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-11": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-1241&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-11&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-12": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-2918&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-12&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-13": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-1334&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-13&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-14": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8650&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-14&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-15": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-3262&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-15&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-16": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8651&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-16&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-17": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-3268&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-17&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-18": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-1355&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-18&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-19": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5725&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-19&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-20": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5119&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-20&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-21": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5726&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-21&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-22": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5120&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-22&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-23": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8740&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-23&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-24": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5143&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-24&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-25": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8814&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-25&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-26": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5752&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-26&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-27": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-7760&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-27&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-28": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-7440&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-28&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-29": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-7441&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-29&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-30": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-7442&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-30&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-31": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-7832&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-31&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-32": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8741&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-32&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-33": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8335&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-33&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-34": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-3349&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-34&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-35": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-7589&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-35&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-36": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-7715&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-36&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-37": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5710&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-37&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-38": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8336&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-38&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-39": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8103&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-39&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-40": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5642&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-40&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-51": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5785&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-51&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-52": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5786&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-52&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-53": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5787&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-53&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-54": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5174&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-54&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-55": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-6136&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-55&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-56": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-5375&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-56&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-57": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8459&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-57&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-58": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8458&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-58&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-FIN02": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-7556&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-FIN02&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                },
                "LEADINGHEALTH\\LH-CTXVDA-FIN03": {
                    "url": "/Director/helpDesk/machine/details?locale=en_US&machineId=S-1-5-21-935138676-4156650735-3080456164-8617&originalFrom=%2Ffilters%2Fmachines%2Fserver-os&machineName=LEADINGHEALTH%5CLH-CTXVDA-FIN03&siteid=18f5f262-250c-47db-b8bf-b57cf74f0b52"
                }
            }
            const machineUrl = urls[machineName].url;

            function OpenMachine() {
                document.location.href = machineUrl;
            }

            if (!attachedListeners.has(OpenMachine)) {
                newEl.addEventListener("click", OpenMachine);
                attachedListeners.add(OpenMachine);
            }
        }
    }, 500);


    /*newEl.addEventListener("mouseup", (event) => {
        if (event.button === 1) {
            window.open(machineUrl, "_blank");
            event.preventDefault();
        }
    });*/


}

function ExpandMachinesTable() {
    if (!document.location.pathname.includes("/machines/server-os")) {
        return;
    }
    document.querySelector(".fixedDataTableLayout_rowsContainer").parentElement.parentElement.parentElement.style.height = "1240px";
    window.dispatchEvent(new Event('resize'));
}

const checkContentLoaded = setInterval(()=>{
    if (document.querySelector(".leftNavigationMenuContainer")) {
        clearInterval(checkContentLoaded);
        AddMachinesNavButton();
        AddNewHomeButtonBehaviour();
        AddNewUserManagerMachineButtonBehaviour();
        ExpandMachinesTable();
    }
}, 1000);

// Hook into History API to catch SPA navigation
const origPushState = history.pushState;
const origReplaceState = history.replaceState;
const attachedListeners = new Set();

history.pushState = function (...args) {
    origPushState.apply(this, args);
    AddNewUserManagerMachineButtonBehaviour();
};

history.replaceState = function (...args) {
    origReplaceState.apply(this, args);
    AddNewUserManagerMachineButtonBehaviour();
};

window.addEventListener('popstate', AddNewUserManagerMachineButtonBehaviour);