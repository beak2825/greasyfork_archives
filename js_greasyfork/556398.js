// ==UserScript==
// @name        GGN Torrent Group Totals
// @author      sippy
// @description Add total torrent count/size to torrent groups across the site
// @namespace   sippy-scripts
// @match       https://gazellegames.net/torrents.php*
// @match       https://gazellegames.net/collections.php*
// @grant       none
// @run-at      document-start
// @version     1.2.1
// @downloadURL https://update.greasyfork.org/scripts/556398/GGN%20Torrent%20Group%20Totals.user.js
// @updateURL https://update.greasyfork.org/scripts/556398/GGN%20Torrent%20Group%20Totals.meta.js
// ==/UserScript==

'use strict'

const state = {
    groupings: Object.create(null),
    userStats: { seeding: 0, leeching: 0, ratio: -1 },
    needsHeaderUpdate: false,
    needPaddingValue: true
}

const sheet = new CSSStyleSheet();
const styles = `
    td.sippy.edition_info div {
        font-style: italic;
        opacity: 0.7;
        display:inline-block;
        padding-bottom:1px;
        margin-bottom:2px;
        border-bottom:1px solid rgba(0,0,0,0.30);
    }

    td.edition_info b.sippy {
        opacity: 0.8;
        letter-spacing: 0.1em;
    }
    
    .colhead b.sippy, .colhead_dark b.sippy {
        opacity: 0.7;
        margin-left: 3px;
        padding: 1px;
    }

    .colhead b.sippy:nth-of-type(1), .colhead_dark b.sippy:nth-of-type(1) {
        color: inherit;
        opacity: inherit;
    }

    .rating_container.sippy {
        line-height: normal;
    }
`

// #region Utils

function parseFileSizeMB(sizeStr = "") {
    const parts = sizeStr.trim().split(/\s+/)
    if (parts.length < 2) return 0

    const value = parseFloat(parts[0].replace(/,/g, "")) || 0
    const unit = parts[1].toUpperCase()

    switch (unit) {
        case "KB":
            return value / 1000
        case "MB":
            return value
        case "GB":
            return value * 1000
        case "TB":
            return value * 1000 * 1000
        default:
            console.warn("Unknown size unit:", unit, "in", sizeStr)
            return 0
    }
}

function sizeToStr(sizeMB) {
    if (sizeMB < 1) return `${(sizeMB * 1000).toFixed(2)} KB`
    if (sizeMB < 1000) return `${sizeMB.toFixed(2)} MB`
    if (sizeMB < 1000 * 1000) return `${(sizeMB / 1000).toFixed(2)} GB`
    return `${(sizeMB / (1000 * 1000)).toFixed(2)} TB`
}

function format0(format, value) {
    if (!format) return String(value)
    return String(format).replace("{0}", value)
}

function debounce(func, delay) {
    let timeout

    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

function getClassWithPrefix(prefix, classesStr = "") {
    if (!classesStr) return null
    const classes = classesStr.split(/\s+/)
    for (const c of classes) {
        if (c.startsWith(prefix)) return c
    }
    return null
}

function getIDFromClasses(prefix, classesStr = "") {
    const cls = getClassWithPrefix(prefix, classesStr)
    if (!cls) return null
    const raw = cls.split(prefix)[1]
    return raw ? parseInt(raw, 10) : null
}

function getColumnPadding() {
    document.querySelectorAll('.group_torrent td').forEach(td => td.style.paddingRight = '0');('source-element-id');
}

// #endregion

// #region Grouping Utils

function addGrouping(name, cfg = {}) {
    if (state.groupings[name]) return
    state.groupings[name] = {
        sizeMB: 0,
        count: 0,
        countElement: cfg.countElement || null,
        sizeElement: cfg.sizeElement || null,
        countFormat: cfg.countFormat || "{0}",
        sizeFormat: cfg.sizeFormat || "{0}"
    }
}

const debounceUpdateHeaders = debounce(updateHeaders, 50)
function addStats(names, sizeMB, count = 1) {
    for (const n of names) {
        const g = state.groupings[n]
        if (g) {
            g.sizeMB += sizeMB
            g.count += count
        }
    }

    debounceUpdateHeaders()
}

function updateHeaders() {
    for (const [key, group] of Object.entries(state.groupings)) {
        const { countElement, sizeElement, countFormat, sizeFormat, count, sizeMB } = group

        if (count == 0) return

        if (countElement && countFormat) countElement.text(format0(countFormat, count))
        if (sizeElement && sizeFormat) {
            const groupSizeText = format0(sizeFormat, sizeToStr(sizeMB))

            sizeElement.text(groupSizeText)

            if (
                state.userStats.ratio !== -1 &&
                Number.isFinite(state.userStats.leeching) &&
                state.userStats.leeching > 0
            ) {
                const currentRatio = state.userStats.seeding / state.userStats.leeching
                const newDownload = state.userStats.leeching + sizeMB
                const newRatio = state.userStats.seeding / newDownload
                const difference = newRatio - currentRatio

                sizeElement.attr("title", `Ratio after downloading this group: ${newRatio.toFixed(2)} (${difference.toFixed(2)})\nClick to copy links`)
            }
        }
    }
}

function populateUserStats() {
    const keys = ["seeding", "leeching"]
    for (const key of keys) {
        const tooltip = $(`#stats_${key}`).find("span.tooltip").first()
        if (tooltip.length > 0) {
            const value = tooltip.text().trim()
            const actualValue = value.split(" [")[0]
            state.userStats[key] = parseFileSizeMB(actualValue)
        }
    }

    const ratio = $("#stats_ratio").find("span.tooltip").find("span").first()
    if (ratio.length) {
        const value = ratio.text().trim()
        const parsed = parseFloat(value)
        state.userStats.ratio = Number.isFinite(parsed) ? parsed : -1
    }
}

/** @param {JQuery} torrent */
function ensureMainHeader(torrent, attachFirst = true) {
    if (state.groupings.main) return

    const table = torrent.closest(".torrent_table")
    let torrentTblHeader = table.find(".colhead, .colhead_dark").find("td[width='100%'], strong").first()

    const countLabel = $("<b class='sippy'></b>")
    const sizeLabel = $("<b class='sippy'></b>")

    if (attachFirst) {
        torrentTblHeader.append(countLabel)
        torrentTblHeader.append(sizeLabel)
    } else {
        torrentTblHeader.after(sizeLabel)
        torrentTblHeader.after(countLabel)
    }

    if (torrentTblHeader.length) {
        addGrouping("main", {
            countElement: countLabel,
            sizeElement: sizeLabel,
            countFormat: "[{0}]",
            sizeFormat: "- Size: {0}"
        })
    }
}

let indexOfSizeNode = -1
/** @param {JQuery} torrentNode */
function getGroupTorrentSizeNode(torrentNode) {
    let result = null
    let children = torrentNode.children()

    if (indexOfSizeNode != -1) {
        let sizeNode = children.eq(indexOfSizeNode)
        if (sizeNode.length > 0)
            result = sizeNode
    }

    children.each((i, child) => {
        if (child.tagName != "TD" || child.className.includes("sippy")) return
        let size = parseFileSizeMB(child.textContent)

        if (size != 0) {
            result = $(child)
            if (indexOfSizeNode == -1) {
                indexOfSizeNode = i
        }
        }
    })

    return result
}


/**
 * Returns the .edition_info node that is a sibling of the given torrent node's parent <tbody>
 * and the id of the parent <tbody>
 * @param {JQuery} torrentNode
 * @returns {Array.<JQuery, string>} An array containing the .edition_info node and the id of the parent <tbody>
 */
function getEditionInfoNode(torrentNode, groupId) {
    let id = torrentNode.attr("id")
    let isEditionInfo = id != null && id.includes("edition_")
    if (id != null && id.startsWith("torrent")) {
        let parentTbody = torrentNode.closest("tbody")
        let id = parentTbody.attr("id")
        
        return [parentTbody.prev().find(".edition_info").first(), id]
    }

    if (isEditionInfo) return [null, null]

    let editionInfo = torrentNode.prevAll(".group_torrent").find(".edition_info").first()
    if (editionInfo.length != 0) {
        if (groupId != null && !editionInfo.parent().hasClass(`groupid_${groupId}`)) return [null, null]

        let classId = getClassWithPrefix("edition_", torrentNode.attr("class"))
        let editionId = classId ? classId : editionInfo.text().trim()

        return [editionInfo, editionId]

    }

    //console.error("Failed to get edition info node for torrent", torrentNode, id)
    return [null, null]
}

// #endregion

// #region Torrent Group Handler

/** @param {HTMLElement} torrentGroupNode */
function processTorrentNode(torrentGroupNode) {
    let torrent = $(torrentGroupNode)
    if (torrent.data("sippy-processed")) return
    torrent.data("sippy-processed", true)

    let torrentSizeNode = getGroupTorrentSizeNode(torrent)
    if (torrentSizeNode == null) {
        return
    }

    // Torrent Header
    let torrentSizeMB = parseFileSizeMB(torrentSizeNode.text()) || 0

    if (torrentSizeMB == 0) {
        return
    }

    ensureMainHeader(torrent, true)
    addStats(["main"], torrentSizeMB)

    // #region Torrent Group Headers (Browse/Collection)
    const groupId = getIDFromClasses("groupid_", torrent.attr("class") || "")
    let gotGroup = Number.isInteger(groupId)
    if (Number.isInteger(groupId) && !state.groupings[groupId]) {
        const ratingTags = $(`.group_${groupId}, #group_${groupId}`).find(".tags")
        const countLabel = $(`<strong class='rating_container sippy'></strong>&nbsp;`)
        const sizeLabel = $(`<strong class='rating_container sippy'></strong>&nbsp;`)
    
        ratingTags.prepend(sizeLabel)
        ratingTags.prepend(countLabel)

        if (ratingTags.length) {
            addGrouping(groupId, {
                countElement: countLabel,
                sizeElement: sizeLabel,
                countFormat: "Count: {0}",
                sizeFormat: "Size: {0}"
            })
        } else {
            gotGroup = false
        }
    }
    // #endregion

    if (gotGroup) addStats([groupId], torrentSizeMB)

    // #region Torrent Collections
    let [editionInfo, editionId] = getEditionInfoNode(torrent, groupId)
    if (gotGroup) editionId = `${groupId}_${editionId}`
    if (editionInfo != null && !state.groupings[editionId]) {
        let sizeIndex = $(".colhead, .colhead_dark").find("td:contains('Size')").index()
        let currentColSpan = editionInfo.attr("colspan")
        editionInfo.attr("colspan", sizeIndex)

        const labelElement = editionInfo.find("strong").first()
        const countLabel = $(`<b class='sippy'></b>`)
        const sizeColumn = $(`<td colspan="${currentColSpan - sizeIndex}" class="sippy edition_info"></td>`)
        const sizeLabel = $(`<div class='sippy'></div>`)

        labelElement.after(countLabel)
        sizeColumn.append(sizeLabel)
        editionInfo.after(sizeColumn)
        

        addGrouping(editionId, {
            countElement: countLabel,
            sizeElement: sizeLabel,
            countFormat: " - [{0}]",
            sizeFormat: "{0}"
        })
    }

    // #endregion

    if (editionInfo != null) {
        addStats([editionId], torrentSizeMB)
    }
}

// #endregion

// #region Init

/** @type {Array.<HTMLElement>} */
let observed = []
let currentSelector = null
const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
        for (const node of m.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;

            console.log(state.needPaddingValue)
            let isGroupTorrentCell = node.tagName == "TD" && node.parentElement && node.parentElement.className.includes("group_torrent")
            let isSippy = node.className.includes("sippy")
            if (isGroupTorrentCell && !isSippy) {
                let sizeMB = parseFileSizeMB(node.textContent) || 0
                if (sizeMB > 0) {
                    processTorrentNode(node.parentElement)
                    observed.push(node.parentElement)
                }
            }

            console.log(state.needPaddingValue)
            if (state.needPaddingValue && node.matches("#torrents .group_torrent td"))
            {
                const computedStyle = window.getComputedStyle(node)
                state.needPaddingValue = false

                let style = `.group_torrent td.sippy.edition_info { padding-left: ${computedStyle.paddingRight} !important; }`
                sheet.insertRule(style, 0)
                console.log("Padding:", style, node)
            }

            if (node.matches("#connectable")) populateUserStats();
        }
    }
});

observer.observe(document, { childList: true, subtree: true });

var readyFunc = () => {
    let allGroupTorrents = document.querySelectorAll(".group_torrent")
    allGroupTorrents.forEach(torrent => {
        let processed = $(torrent).data("sippy-processed")
        if (processed == null)
            processTorrentNode(torrent)
    })

    if (state.needPaddingValue) {
        let td = document.querySelector("#torrents .group_torrent td")
        if (td == null) return
        const style = `.group_torrent td.sippy.edition_info { padding-left: ${computedStyle.paddingRight} !important; }`
        sheet.insertRule(style, 0)

    }
}

document.addEventListener("DOMContentLoaded", readyFunc)

sheet.replaceSync(styles)
document.adoptedStyleSheets.push(sheet)