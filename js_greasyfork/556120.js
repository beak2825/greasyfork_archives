// ==UserScript==
// @name         FV - Inventory Search Bar
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.7
// @description  Adds the ability to search in your inventory. Includes Clear and Search buttons.
// @author       necroam
// @match        https://www.furvilla.com/inventory*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556120/FV%20-%20Inventory%20Search%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/556120/FV%20-%20Inventory%20Search%20Bar.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //  Build search form
    const searchForm = document.createElement('form');
    searchForm.className = "search-form";
    searchForm.style.margin = "10px 0";
    searchForm.style.display = "flex";
    searchForm.style.alignItems = "center";

    // Search bar
    const searchInput = document.createElement('input');
    searchInput.type = "text";
    searchInput.className = "input small search";
    searchInput.placeholder = "Search...";
    searchInput.name = "search";
    searchInput.style.marginRight = "5px";
    searchInput.style.width = "500px";

    // Search button
    const searchButton = document.createElement('input');
    searchButton.type = "submit";
    searchButton.value = "Search";
    searchButton.className = "btn";
    searchButton.style.textAlign = "center";
    searchButton.style.marginLeft = "20px";

    // Clear button
    const clearButton = document.createElement('button');
    clearButton.type = "button";
    clearButton.textContent = "Clear";
    clearButton.className = "btn";
    clearButton.style.marginLeft = "10px";
    clearButton.addEventListener("click", () => {
        window.location.href = "/inventory";
    });

    // Append controls
    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchButton);
    searchForm.appendChild(clearButton);

    // Insert form before inventory list
    const invList = document.querySelector("ul.inventory");
    if (invList) {
        invList.parentNode.insertBefore(searchForm, invList);
    }

    // Helper ffetch and parse inventory page
    async function fetchInventoryPage(pageNum, typeFilter) {
        const url = typeFilter ? `/inventory?type=${encodeURIComponent(typeFilter)}&page=${pageNum}`
                               : `/inventory?page=${pageNum}`;
        const res = await fetch(url);
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        return Array.from(doc.querySelectorAll("ul.inventory li.inventory-item"));
    }

    searchForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const query = searchInput.value.toLowerCase();
        invList.innerHTML = "<li>Checking. Please wait...</li>";

        // Detect max page
        let maxPage = 1;
        const pagination = document.querySelector(".pagination");
        if (pagination) {
            const links = pagination.querySelectorAll("a[href*='page=']");
            links.forEach(link => {
                const match = link.href.match(/page=(\d+)/);
                if (match) {
                    const num = parseInt(match[1], 10);
                    if (num > maxPage) maxPage = num;
                }
            });
        }

        // Detect current filter from official sorter
        const typeSelect = document.querySelector("select[name='type']");
        const typeFilter = typeSelect ? typeSelect.value : "";

        // Fetch ALL pages in parallel
        const promises = [];
        for (let p = 1; p <= maxPage; p++) {
            promises.push(fetchInventoryPage(p, typeFilter));
        }
        const results = await Promise.all(promises);
        let allItems = [].concat(...results); // Firefox-safe flatten

        // Filter across ALL items
        let filtered = allItems.filter(item => {
            const nameSpan = item.querySelector(".name");
            return nameSpan && nameSpan.textContent.toLowerCase().includes(query);
        });

        // pagination
        const itemsPerPage = 24;
        const totalItems = filtered.length;
        const totalPages = Math.ceil(Math.max(totalItems, 1) / itemsPerPage);

        function renderPage(pageNum) {
            const start = (pageNum - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            invList.innerHTML = "";
            filtered.slice(start, end).forEach(item => invList.appendChild(item));
        }

        // Remove ALL native and previous pagination blocks
        document.querySelectorAll(".text-center ul.pagination").forEach(ul => {
            ul.parentNode.remove();
        });

        // Build new pagination
        const paginationDiv = document.createElement('div');
        paginationDiv.className = "text-center";
        const paginationUl = document.createElement('ul');
        paginationUl.className = "pagination";

        const prevLi = document.createElement('li');
        const prevA = document.createElement('a');
        prevA.href = "#";
        prevA.textContent = "«";
        prevLi.appendChild(prevA);
        paginationUl.appendChild(prevLi);

        const pageLis = [];
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#";
            a.textContent = i;
            a.addEventListener("click", ev => {
                ev.preventDefault();
                setActivePage(i);
            });
            li.appendChild(a);
            pageLis.push(li);
            paginationUl.appendChild(li);
        }

        const nextLi = document.createElement('li');
        const nextA = document.createElement('a');
        nextA.href = "#";
        nextA.textContent = "»";
        nextLi.appendChild(nextA);
        paginationUl.appendChild(nextLi);

        paginationDiv.appendChild(paginationUl);
        invList.parentNode.insertBefore(paginationDiv, invList.nextSibling);

        let currentPage = 1;

        function updateArrows() {
            prevLi.className = currentPage === 1 ? "disabled" : "";
            nextLi.className = currentPage === totalPages ? "disabled" : "";
        }

        function updateActiveLi() {
            pageLis.forEach(li => li.classList.remove("active"));
            const activeLi = pageLis[currentPage - 1];
            if (activeLi) activeLi.classList.add("active");
        }

        function setActivePage(pageNum) {
            currentPage = Math.max(1, Math.min(totalPages, pageNum));
            renderPage(currentPage);
            updateActiveLi();
            updateArrows();
        }

        prevA.addEventListener("click", ev => {
            ev.preventDefault();
            if (currentPage > 1) setActivePage(currentPage - 1);
        });
        nextA.addEventListener("click", ev => {
            ev.preventDefault();
            if (currentPage < totalPages) setActivePage(currentPage + 1);
        });

        setActivePage(1);
    });
})();


