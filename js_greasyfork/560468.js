// ==UserScript==
// @name         NextDNS Manager 
// @description  Manage Allow/Deny lists and view info in a nice looking GUI for NextDNS 
// @namespace    https://nextdns.io/
// @license      MIT
// @version      2.8
// @match        https://my.nextdns.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560468/NextDNS%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/560468/NextDNS%20Manager.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const parseDomains = text => [...new Set((text.match(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi) || []).map(d => d.toLowerCase()))];

    let stopImport = false;

    const getProfiles = async () => {
        try {
            const res = await fetch("https://api.nextdns.io/accounts/@me?withProfiles=true", {
                credentials: "include"
            });
            if (!res.ok) return null;
            const data = await res.json();
            return data.profiles || [];
        } catch (e) {
            return null;
        }
    };

    const getProfileInfo = async profileId => {
        const profiles = await getProfiles();
        if (!profiles) return null;
        return profiles.find(p => p.id === profileId);
    };

    const getProfileIdFromURL = () => {
        const match = window.location.pathname.match(/^\/([a-z0-9]+)\//i);
        return match ? match[1] : null;
    };

    const getListTypeFromURL = () => {
        if (window.location.pathname.includes("/allowlist")) return "allowlist";
        if (window.location.pathname.includes("/denylist")) return "denylist";
        return null;
    };

    const fetchList = async (profileId, listType) => {
        try {
            const res = await fetch(`https://api.nextdns.io/profiles/${profileId}/${listType}`, {
                credentials: "include"
            });
            const data = await res.json();
            return data.data || [];
        } catch (e) {
            return [];
        }
    };

    const addDomain = async (profileId, listType, domain) => {
        let attempts = 0;
        while (attempts < 5) {
            try {
                const res = await fetch(`https://api.nextdns.io/profiles/${profileId}/${listType}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        id: domain,
                        active: true
                    })
                });
                if (res.status === 429 || !res.ok) {
                    attempts++;
                    await new Promise(r => setTimeout(r, 2000));
                } else {
                    return true;
                }
            } catch (e) {
                attempts++;
                await new Promise(r => setTimeout(r, 2000));
            }
        }
        console.warn(`Failed to add ${domain} after 5 retries`);
        return false;
    };

    const removeDomain = async (profileId, listType, domain) => fetch(`https://api.nextdns.io/profiles/${profileId}/${listType}/hex:${Array.from(domain).map(c=>c.charCodeAt(0).toString(16)).join('')}`, {
        method: "DELETE",
        credentials: "include"
    });

    const toggleDomainActive = async (profileId, listType, domain, active) => fetch(`https://api.nextdns.io/profiles/${profileId}/${listType}/hex:${Array.from(domain).map(c=>c.charCodeAt(0).toString(16)).join('')}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            active
        })
    });

    let guiBox = null;

    const createGUI = async () => {
        if (guiBox) guiBox.remove();

        guiBox = document.createElement("div");
        guiBox.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 2147483647;
            width: 450px;
            background: #111;
            color: #fff;
            padding: 12px;
            border-radius: 8px;
            font-family: monospace;
            box-shadow: 0 0 15px rgba(0,0,0,0.8);
            display: flex;
            flex-direction: column;
            max-height: 650px;
        `;

        guiBox.innerHTML = `
            <div id="ndns-header" style="cursor:move; font-weight:bold; display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div>
                    <div id="ndns-profile-name" style="font-size:16px;"></div>
                    <div id="ndns-profile-info" style="font-size:11px;opacity:0.7;"></div>
                    <div id="ndns-list-type" style="font-size:13px;font-weight:bold;margin-top:2px;"></div>
                </div>
                <button id="ndns-toggle" style="background:#222;color:#fff;border:none;padding:2px 6px;border-radius:3px;cursor:pointer;">Hide</button>
            </div>
            <div id="ndns-content" style="flex:1; display:flex; flex-direction:column; overflow:hidden;"></div>
        `;
        document.documentElement.appendChild(guiBox);

        const toggleBtn = guiBox.querySelector("#ndns-toggle");
        const contentDiv = guiBox.querySelector("#ndns-content");
        const profileNameEl = guiBox.querySelector("#ndns-profile-name");
        const profileInfoEl = guiBox.querySelector("#ndns-profile-info");
        const listTypeEl = guiBox.querySelector("#ndns-list-type");

        let hidden = false;
        toggleBtn.onclick = () => {
            hidden = !hidden;
            contentDiv.style.display = hidden ? "none" : "flex";
            toggleBtn.innerText = hidden ? "Show" : "Hide";
        };

        // Dragging
        const header = guiBox.querySelector("#ndns-header");
        let offsetX = 0,
            offsetY = 0,
            dragging = false;
        header.onmousedown = e => {
            dragging = true;
            offsetX = e.clientX - guiBox.getBoundingClientRect().left;
            offsetY = e.clientY - guiBox.getBoundingClientRect().top;
        };
        document.onmouseup = () => dragging = false;
        document.onmousemove = e => {
            if (dragging) {
                guiBox.style.left = e.clientX - offsetX + "px";
                guiBox.style.top = e.clientY - offsetY + "px";
            }
        };

        const refreshGUI = async () => {
            const currentProfileId = getProfileIdFromURL();
            const currentListType = getListTypeFromURL();
            const onSetupPage = window.location.pathname.includes("/setup");

            // Check login
            const profiles = await getProfiles();
            if (!profiles) {
                profileNameEl.innerText = "Not logged in";
                profileInfoEl.innerText = "";
                listTypeEl.innerText = "";
                contentDiv.innerHTML = "<div style='color:red;'>Please log in to view your profiles and lists.</div>";
                document.title = "NextDNS - Not logged in";
                return;
            }

            // Update profile info
            const profile = await getProfileInfo(currentProfileId);
            if (profile) {
                profileNameEl.innerText = profile.name;
                profileInfoEl.innerText = `ID: ${profile.id} | Role: ${profile.role}`;
                document.title = `NextDNS - ${profile.name} (${currentListType ? currentListType.toUpperCase() : ''})`;
            } else {
                profileNameEl.innerText = "Profile not found";
                profileInfoEl.innerText = "";
            }

            // Setup page
            if (onSetupPage && profile) {
                const res = await fetch(`https://api.nextdns.io/profiles/${currentProfileId}/setup`, {
                    credentials: "include"
                });
                const data = await res.json();
                listTypeEl.innerText = "SETUP";
                listTypeEl.style.color = "#66ccff";
                contentDiv.innerHTML = `
                    <div style="margin-bottom:6px;font-weight:bold;">Setup Info</div>
                    <div><span style="color:#ffcc00">IPv4:</span> ${data.data.ipv4.join(", ") || "None"}</div>
                    <div><span style="color:#ffcc00">IPv6:</span> ${data.data.ipv6.join(", ") || "None"}</div>
                    <div><span style="color:#66ff66">Linked IP:</span> ${data.data.linkedIp?.ip || "None"}</div>
                    <div><span style="color:#66ff66">Servers:</span> ${data.data.linkedIp?.servers.join(", ") || "None"}</div>
                    <div><span style="color:#66ccff">DNSCrypt:</span> ${data.data.dnscrypt || "None"}</div>
                `;
            }
            // Allow/Deny list page
            else if (currentListType && profile) {
                listTypeEl.innerText = currentListType.toUpperCase();
                listTypeEl.style.color = currentListType === "denylist" ? "#ff4136" : "#2ecc40";

                contentDiv.innerHTML = `
    <div style="margin-bottom:6px; display:flex; align-items:center; gap:4px;">
        <button id="ndns-import" style="width:80px;background:#444;color:#fff;border:none;padding:6px;border-radius:4px;font-weight:bold;cursor:pointer;">Import</button>
        <div id="ndns-selected-file" style="flex:1; font-size:12px; color:#ccc; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">No file selected</div>
        <button id="ndns-stop" style="width:60px;background:#aa3333;color:#fff;border:none;padding:6px;border-radius:4px;font-weight:bold;cursor:pointer;">Stop</button>
    </div>
    <textarea id="ndns-bulk" placeholder="Paste multiple domains..." style="width:100%;height:80px;padding:6px;resize:none;background:#1c1c1c;color:#fff;border:none;border-radius:4px;margin-bottom:6px;"></textarea>
    <button id="ndns-add-bulk" style="width:100%;margin-bottom:6px;background:#333;color:#fff;border:none;padding:6px;border-radius:4px;font-weight:bold;cursor:pointer;transition:0.2s;">Add Domains</button>
    <div id="ndns-list" style="flex:1;overflow-y:auto;max-height:400px;"></div>
    <div id="ndns-status" style="margin-top:6px;font-size:12px;opacity:0.8;"></div>
`;


                const listDiv = contentDiv.querySelector("#ndns-list");
                const bulkInput = contentDiv.querySelector("#ndns-bulk");
                const addBulkBtn = contentDiv.querySelector("#ndns-add-bulk");
                const importBtn = contentDiv.querySelector("#ndns-import");
                const stopBtn = contentDiv.querySelector("#ndns-stop");
                const selectedFileLabel = contentDiv.querySelector("#ndns-selected-file");
                const status = contentDiv.querySelector("#ndns-status");

                addBulkBtn.onmouseenter = () => {
                    addBulkBtn.style.background = "#444";
                }
                addBulkBtn.onmouseleave = () => {
                    addBulkBtn.style.background = "#333";
                }
                importBtn.onmouseenter = () => {
                    importBtn.style.background = "#555";
                }
                importBtn.onmouseleave = () => {
                    importBtn.style.background = "#444";
                }
                stopBtn.onmouseenter = () => {
                    stopBtn.style.background = "#cc5555";
                }
                stopBtn.onmouseleave = () => {
                    stopBtn.style.background = "#aa3333";
                }

                stopBtn.onclick = () => {
                    stopImport = true;
                    status.innerText = "Import stopped.";
                };

                const refreshList = async () => {
                    const list = await fetchList(currentProfileId, currentListType);
                    listDiv.innerHTML = "";
                    const borderColor = currentListType === "denylist" ? "rgb(255,65,54)" : "rgb(46,204,64)";
                    list.forEach(d => {
                        const item = document.createElement("div");
                        item.style.cssText = `
                            display:flex;
                            align-items:center;
                            justify-content:space-between;
                            padding:6px;
                            border-left:4px solid ${borderColor};
                            margin-bottom:4px;
                            background:#1a1a1a;
                            border-radius:4px;
                        `;
                        const domainContainer = document.createElement("div");
                        domainContainer.style.cssText = "display:flex;align-items:center;gap:6px;";
                        const img = document.createElement("img");
                        img.src = `https://favicons.nextdns.io/hex:${Array.from(d.id).map(c=>c.charCodeAt(0).toString(16)).join('')}@2x.png`;
                        img.style.cssText = "width:16px;height:16px;";
                        const span = document.createElement("span");
                        span.style.cssText = "word-break: break-all;";
                        span.innerText = d.id;
                        domainContainer.appendChild(img);
                        domainContainer.appendChild(span);

                        const controls = document.createElement("div");
                        controls.style.cssText = "display:flex;align-items:center;gap:6px;";
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.checked = d.active;
                        checkbox.onchange = async () => {
                            await toggleDomainActive(currentProfileId, currentListType, d.id, checkbox.checked);
                        };
                        const delBtn = document.createElement("button");
                        delBtn.innerText = "🗑️";
                        delBtn.style.cssText = "background:none;border:none;color:#fff;cursor:pointer;";
                        delBtn.onclick = async () => {
                            await removeDomain(currentProfileId, currentListType, d.id);
                            item.remove();
                        };
                        controls.appendChild(checkbox);
                        controls.appendChild(delBtn);

                        item.appendChild(domainContainer);
                        item.appendChild(controls);
                        listDiv.appendChild(item);
                    });
                };

                addBulkBtn.onclick = async () => {
                    const domains = parseDomains(bulkInput.value);
                    if (!domains.length) return alert("No valid domains found");
                    stopImport = false;
                    status.innerText = `Adding ${domains.length} domains...`;
                    for (let i = 0; i < domains.length; i++) {
                        if (stopImport) break;
                        await addDomain(currentProfileId, currentListType, domains[i]);
                        status.innerText = `Added ${i+1}/${domains.length}: ${domains[i]}`;
                        await new Promise(r => setTimeout(r, 500));
                    }
                    bulkInput.value = "";
                    if (!stopImport) status.innerText = `Done! Added ${domains.length} domains.`;
                    await refreshList();
                };

                importBtn.onclick = async () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".txt";
                    input.onchange = async () => {
                        if (!input.files.length) return;
                        const file = input.files[0];
                        selectedFileLabel.innerText = `Selected file: ${file.name}`;
                        const text = await file.text();
                        const domains = parseDomains(text).slice(0, 200);
                        if (domains.length === 0) return alert("No valid domains in file.");
                        stopImport = false;
                        status.innerText = `Importing ${domains.length} domains...`;
                        for (let i = 0; i < domains.length; i++) {
                            if (stopImport) break;
                            await addDomain(currentProfileId, currentListType, domains[i]);
                            status.innerText = `Imported ${i+1}/${domains.length}: ${domains[i]}`;
                            await new Promise(r => setTimeout(r, 500));
                        }
                        if (!stopImport) status.innerText = `Done! Imported ${domains.length} domains.`;
                        await refreshList();
                    };
                    input.click();
                };

                await refreshList();

                // Live sync
                const pageList = document.querySelector(".list-group.list-group-flush");
                if (pageList) {
                    const observer = new MutationObserver(() => {
                        const pageItems = Array.from(pageList.querySelectorAll(".list-group-item"));
                        const uiItems = Array.from(listDiv.querySelectorAll("div"));

                        const pageDomains = pageItems.map(item => {
                            const span = item.querySelector("span.notranslate");
                            if (!span) return null;
                            const domain = span.innerText.replace(/^\*\./, "").trim();
                            const active = parseFloat(item.querySelector(".flex-grow-1")?.style.opacity || "1") > 0.5;
                            return {
                                domain,
                                active
                            };
                        }).filter(d => d);

                        uiItems.forEach(uiItem => {
                            const domain = uiItem.querySelector("span").innerText;
                            if (!pageDomains.some(d => d.domain === domain)) uiItem.remove();
                        });

                        pageDomains.forEach(d => {
                            let uiItem = uiItems.find(i => i.querySelector("span").innerText === d.domain);
                            if (!uiItem) {
                                const item = document.createElement("div");
                                item.style.cssText = `
                                    display:flex;
                                    align-items:center;
                                    justify-content:space-between;
                                    padding:6px;
                                    border-left:4px solid ${currentListType==="denylist"?"rgb(255,65,54)":"rgb(46,204,64)"};
                                    margin-bottom:4px;
                                    background:#1a1a1a;
                                    border-radius:4px;
                                `;
                                const domainContainer = document.createElement("div");
                                domainContainer.style.cssText = "display:flex;align-items:center;gap:6px;";
                                const img = document.createElement("img");
                                img.src = `https://favicons.nextdns.io/hex:${Array.from(d.domain).map(c=>c.charCodeAt(0).toString(16)).join('')}@2x.png`;
                                img.style.cssText = "width:16px;height:16px;";
                                const span = document.createElement("span");
                                span.style.cssText = "word-break: break-all;";
                                span.innerText = d.domain;
                                domainContainer.appendChild(img);
                                domainContainer.appendChild(span);

                                const controls = document.createElement("div");
                                controls.style.cssText = "display:flex;align-items:center;gap:6px;";
                                const checkbox = document.createElement("input");
                                checkbox.type = "checkbox";
                                checkbox.checked = d.active;
                                checkbox.onchange = async () => {
                                    await toggleDomainActive(currentProfileId, currentListType, d.domain, checkbox.checked);
                                };
                                const delBtn = document.createElement("button");
                                delBtn.innerText = "🗑️";
                                delBtn.style.cssText = "background:none;border:none;color:#fff;cursor:pointer;";
                                delBtn.onclick = async () => {
                                    await removeDomain(currentProfileId, currentListType, d.domain);
                                    item.remove();
                                };
                                controls.appendChild(checkbox);
                                controls.appendChild(delBtn);

                                item.appendChild(domainContainer);
                                item.appendChild(controls);
                                listDiv.appendChild(item);
                            } else {
                                const checkbox = uiItem.querySelector("input[type=checkbox]");
                                if (checkbox) checkbox.checked = d.active;
                            }
                        });
                    });
                    observer.observe(pageList, {
                        childList: true,
                        subtree: true
                    });
                }
            }
        };

        await refreshGUI();

        let lastURL = location.href;
        setInterval(() => {
            if (location.href !== lastURL) {
                lastURL = location.href;
                refreshGUI();
                lastURL = location.href;
            }
        }, 1000);
    };

    setTimeout(createGUI, 1500);
})();