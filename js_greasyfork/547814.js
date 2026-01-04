// ==UserScript==
// @name         Fanatical reveal keys
// @namespace    pal
// @version      3.2
// @description  reveal keys with multi-select functionality
// @author       pal
// @contributor  revadike
// @match        https://www.fanatical.com/*
// @icon         https://cdn.fanatical.com/production/icons/favicon-32x32.png
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547814/Fanatical%20reveal%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/547814/Fanatical%20reveal%20keys.meta.js
// ==/UserScript==

(() => {
    let gameCount = 0
    let isRun = false
    let lastSelectedCheckbox = null
    let selectedOrders = new Set()

    const writeToTextarea = (gameName, key) => {
        const input = document.querySelector('.zf-redeem-text')
        if (input) {
            input.value += `${gameName};; ${key}\n`
            input.scrollTop = input.scrollHeight
        }
    }

    const revealSingleKey = async (item, bundleName, gameName) => {
        return new Promise(async (resolve) => {
            if (item.key) {
                item.key += `(scraped)`
                writeToTextarea(gameName, item.key)
                resolve(item)
            } else {
                delete item.key
                try {
                    const result = await request(`https://www.fanatical.com/api/user/orders/redeem`, {
                        method: 'POST',
                        body: JSON.stringify(item)
                    })
                    writeToTextarea(gameName, result.key)
                    resolve(result)
                } catch (e) {
                    const failedKey = 'Request failed'
                    writeToTextarea(gameName, failedKey)
                    resolve({ key: failedKey })
                }
            }
        })
    }

    const redeem = async (obj, totalCount, ele) => {
        // Clear textarea at start
        const input = document.querySelector('.zf-redeem-text')
        if (input) {
            input.value = '------------------------------------------------------------------------\n'
        }

        // First, collect all key items with their metadata
        const allKeyItems = []

        // Process each bundle
        for (const bundleName of Object.keys(obj)) {
            // Write bundle header
            if (input) {
                input.value += `【${bundleName}】\n`
            }

            // Process each game in the bundle
            for (const gameName of Object.keys(obj[bundleName])) {
                const gameKeys = obj[bundleName][gameName]

                // Add each key item to the collection with metadata
                for (const keyItem of gameKeys) {
                    allKeyItems.push({
                        keyItem,
                        bundleName,
                        gameName
                    })
                }
            }
        }

        let revealedCount = 0
        const batchSize = 200

        // Process keys in batches of 200
        for (let i = 0; i < allKeyItems.length; i += batchSize) {
            const batch = allKeyItems.slice(i, i + batchSize)

            if (ele) {
                ele.innerHTML = `Revealing keys (${revealedCount} / ${totalCount}) - Batch ${Math.floor(i / batchSize) + 1}`
            }

            // Process current batch with Promise.all
            const promises = batch.map(({ keyItem, bundleName, gameName }) =>
                revealSingleKey(keyItem, bundleName, gameName)
            )

            const results = await Promise.all(promises)

            // Update key items with results
            results.forEach((result, index) => {
                batch[index].keyItem.key = result.key
            })

            revealedCount += batch.length

            if (ele) {
                ele.innerHTML = `Revealing keys (${revealedCount} / ${totalCount})`
            }

            // Wait 6 seconds between batches (except for the last batch)
            if (i + batchSize < allKeyItems.length) {
                if (ele) {
                    ele.innerHTML = `Revealing keys (${revealedCount} / ${totalCount}) - Waiting 61s...`
                }
                await new Promise(resolve => setTimeout(resolve, 61000))
            }
        }

        // Copy to clipboard after revealing all keys
        if (input && input.value.trim()) {
            GM_setClipboard(input.value)
            console.log('Keys copied to clipboard!')
        }

        gameCount = 0
        isRun = false
    }

    const func = (obj, name, item, atok, order_id, bid) => {
        if (item.status === 'refunded' || item.type === 'software') return
        if (!obj[name][item.name]) {
            obj[name][item.name] = []
        }
        gameCount++
        obj[name][item.name].push(Object.assign({
            atok,
            oid: order_id,
            iid: item.iid,
            serialId: item.serialId,
            key: item.key
        }, bid ? { bid } : null))
    }

    const getData = ({ status, _id: order_id, items: orderList }, obj = {}) => {
        if (status !== 'COMPLETE') {
            return alert('order not completed')
        }

        const atok = window.localStorage.bsatok
        orderList.forEach(item => {
            if (item.status === 'refunded') {
                return
            }

            if (item.pickAndMix) {
                if (!obj[item.pickAndMix]) {
                    obj[item.pickAndMix] = {}
                }
                if (item.bundles.length) {
                    item.bundles.forEach(gameList => {
                        gameList.games.forEach(item2 => {
                            func(obj, item.pickAndMix, item2, atok, order_id)
                        })
                    })
                } else {
                    func(obj, item.pickAndMix, item, atok, order_id)
                }
            } else {
                if (item.bundles.length) {
                    if (!obj[item.name]) {
                        obj[item.name] = {}
                    }
                    item.bundles.forEach(item2 => {
                        item2.games.forEach(item3 => {
                            func(obj, item.name, item3, atok, order_id, item._id)
                        })
                    })
                } else {
                    if (!obj['single game']) {
                        obj['single game'] = {}
                    }
                    func(obj, 'single game', item, atok, order_id)
                }
            }
        })
        return obj
    }

    const request = async (url, { method = 'GET', body = null } = {}) => {
        const result = await fetch(url, {
            method,
            body,
            headers: {
                anonid: JSON.parse(window.localStorage.bsanonymous).id,
                authorization: JSON.parse(window.localStorage.bsauth).token,
                'content-type': 'application/json; charset=utf-8'
            }
        })
        return await result.json()
    }

    const handleCheckboxClick = function (event, order) {
        event.stopPropagation();
        const checkbox = this
        const isShiftClick = event.shiftKey

        if (isShiftClick && lastSelectedCheckbox && lastSelectedCheckbox !== checkbox) {
            // Select all checkboxes between last selected and current
            const allCheckboxes = Array.from(document.querySelectorAll('.zf-checkbox'))
            const lastIndex = allCheckboxes.indexOf(lastSelectedCheckbox)
            const currentIndex = allCheckboxes.indexOf(checkbox)

            const startIndex = Math.min(lastIndex, currentIndex)
            const endIndex = Math.max(lastIndex, currentIndex)

            for (let i = startIndex; i <= endIndex; i++) {
                const cb = allCheckboxes[i]
                const cbOrder = cb.getAttribute('data-order')
                cb.checked = true
                selectedOrders.add(cbOrder)
            }
        } else {
            // Single checkbox selection
            if (checkbox.checked) {
                selectedOrders.add(order)
            } else {
                selectedOrders.delete(order)
            }
        }

        lastSelectedCheckbox = checkbox
        updateRevealSelectedButton()
    }

    const updateSelectAllCheckbox = () => {
        const allCheckboxes = document.querySelectorAll('.zf-checkbox');
        const selectAllCheckbox = document.querySelector('.zf-checkbox-all');
        if (allCheckboxes.length === 0 || !selectAllCheckbox) { return; }

        const allSelected = Array.from(allCheckboxes).every(cb => cb.checked);
        selectAllCheckbox.checked = allSelected;
    };
    const updateRevealSelectedButton = () => {
        const button = document.querySelector('.zf-reveal-selected')
        if (button) {
            const count = selectedOrders.size
            button.innerHTML = count > 0 ? `Reveal Selected Keys (${count})` : 'Reveal Selected Keys'
            button.disabled = count === 0
        }
    }

    const revealSelectedKeys = async function () {
        if (isRun || selectedOrders.size === 0) {
            return
        }

        isRun = true
        const ordersArray = Array.from(selectedOrders)
        let allObj = {}
        let totalCount = 0

        this.innerHTML = 'Revealing selected keys...'

        // Process orders one by one in sequence
        for (let i = 0; i < ordersArray.length; i++) {
            const order = ordersArray[i]
            this.innerHTML = `Revealing ${i + 1}/${ordersArray.length}`

            try {
                const orderData = await request(`https://www.fanatical.com/api/user/orders/${order}`)
                const obj = getData(orderData, {})

                // Merge objects
                for (const bundleName in obj) {
                    if (!allObj[bundleName]) {
                        allObj[bundleName] = {}
                    }
                    for (const gameName in obj[bundleName]) {
                        if (!allObj[bundleName][gameName]) {
                            allObj[bundleName][gameName] = []
                        }
                        allObj[bundleName][gameName].push(...obj[bundleName][gameName])
                    }
                }

                totalCount += gameCount
                gameCount = 0 // Reset for next iteration
            } catch (error) {
                console.error(`Failed to process order ${order}:`, error)
            }
        }

        // Now reveal all keys sequentially
        gameCount = totalCount
        const count = gameCount
        this.innerHTML = `Revealing keys (${count} / 0)`
        await redeem(allObj, count, this)

        // Uncheck all selected checkboxes after revealing
        document.querySelectorAll('.zf-checkbox').forEach(cb => {
            if (selectedOrders.has(cb.getAttribute('data-order'))) {
                cb.checked = false;
            }
        });
        selectedOrders.clear();
        updateRevealSelectedButton();
        updateSelectAllCheckbox();
        this.innerHTML = 'Reveal Selected Keys'
    }

    const init = () => {
        const orderList = document.querySelectorAll('.d-none.d-md-block.action-col:not(.zf-has)') || []
        if (orderList.length === 0) return

        for (const item of orderList) {
            if (item.previousElementSibling.innerText !== 'COMPLETE' || item.childElementCount !== 1) {
                continue;
            }

            item.classList.add('zf-has')
            const [, order] = item.parentElement.parentElement.href.match(/orders\/(\w+)/)
            const me = document.querySelector(`.v-${order}`)
            if (me) continue

            const div = document.createElement('div')
            div.className = `zf-wrap v-${order}`
            div.style = `width: 4%; padding: 1rem;`

            // Create checkbox
            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.className = 'zf-checkbox'
            checkbox.setAttribute('data-order', order)
            checkbox.addEventListener('click', (e) => handleCheckboxClick.call(checkbox, e, order))

            div.appendChild(checkbox)
            item.parentNode.prepend(div)
        }

        const container = document.querySelector('.account-content.orders-and-keys')
        if (!container) return

        const hasTextarea = container.querySelector('.zf-redeem-wrap') !== null
        if (hasTextarea) return


        const ele = document.createElement('div')
        ele.className = 'zf-redeem-wrap'

        const textarea = document.createElement('textarea')
        textarea.className = 'zf-redeem-text'
        textarea.placeholder = 'Keys will appear here'

        const revealSelectedBtn = document.createElement('button')
        revealSelectedBtn.className = 'zf-reveal-selected'
        revealSelectedBtn.innerHTML = 'Reveal Selected Keys'
        revealSelectedBtn.disabled = true
        revealSelectedBtn.onclick = revealSelectedKeys

        ele.appendChild(textarea);
        ele.appendChild(revealSelectedBtn);
        container.insertBefore(ele, container.firstElementChild);

        const hasSelectAll = document.querySelector('.zf-checkbox-all');
        if (hasSelectAll) {
            return
        }

        const div = document.createElement('div')
        div.style = `width: 4%; padding: 1rem;`

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.className = 'zf-checkbox-all'
        checkbox.addEventListener('click', () => {
            document.querySelectorAll('.zf-checkbox').forEach(cb => {
                const isChecked = checkbox.checked;
                if ((isChecked && !cb.checked) || (!isChecked && cb.checked)) {
                    cb.click();
                }
            });
        });

        div.appendChild(checkbox)
        document.querySelector('.orders-table .table-header').prepend(div)
    }

    if (window.dirtyObserver) {
        clearInterval(window.dirtyObserver);
    }

    window.dirtyObserver = setInterval(init, 200);

    GM_addStyle(`
        .zf-coustom {
            padding: 5px 15px;
            border-radius: 5px;
            background-color: #212121;
            cursor: pointer;
            font-size: 14px;
            text-align: center;
            color: #fff;
            margin-top: 5px;
        }

        .zf-coustom:hover {
            opacity: 0.5;
        }

        .zf-checkbox,
        .zf-checkbox-all {
            margin-right: 8px;
            transform: scale(2.0);
        }

        .zf-redeem-wrap {
            display: flex;
            align-items: flex-end;
            gap: 10px;
        }

        .zf-redeem-text {
            width: 500px;
            height: 250px;
            outline: none;
        }

        .zf-reveal-selected {
            display: block;
            padding: 10px 15px;
            border-radius: 5px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 14px;
            white-space: nowrap;
        }

        .zf-reveal-selected:hover:not(:disabled) {
            background-color: #0056b3;
        }

        .zf-reveal-selected:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
        }

        .zf-wrap {
            display: block;
        }
    `)
})()