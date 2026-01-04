// ==UserScript==
// @name         Readwise Reader Bulk Tagger
// @namespace    https://axley.net/
// @version      1.1
// @description  This script will apply tags to items in bulk (e.g. from a search result)
// @author       Jason Axley
// @license      MIT
// @match        https://read.readwise.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=readwise.io
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/559865/Readwise%20Reader%20Bulk%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/559865/Readwise%20Reader%20Bulk%20Tagger.meta.js
// ==/UserScript==

const cfg = new GM_config({
    id: 'readwiseBulkTagger',
    title: 'readwise Bulk Tagger Settings', // Panel Title
    fields: {
        "apiKey": {
            'label': 'Readwise API key (https://readwise.io/access_token)', // Appears next to field
            'type': 'string', // Makes this setting a text field
            'default': null
        }
    }
});

const headers_orig = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-requested-with": "XMLHttpRequest"
};

const base_headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9"
};

function buildRequestHeaders() {
    const theHeaders = base_headers;

    const apiKey = cfg.get('apiKey');
    if (apiKey) {
        theHeaders["Authorization"] = `Token ${apiKey}`;
    }
    return theHeaders;
}

let tagstring = "";

function bulkApplyTags() {
    tagstring = window.prompt("Comma-separated tag list", tagstring);
    let tags = tagstring.replace(" ", "").split(",");
    if (tags && tags.length) {
        const articles = document.querySelectorAll('[id^=document-row-]');
        for (var i=0; i<articles.length; i++) {
            // for every document ID, add the tag to the document
            let article_id = articles[i].getAttribute("id").replace("document-row-", "")
            updateDocumentTags(article_id, tags);
        }
    }
    return;
}

async function listAllTags() {
    const headers = buildRequestHeaders();
    headers["Content-Type"] = "application/json";
    // GET https://readwise.io/api/v3/tags
    let tags = await fetchWithPagination("https://readwise.io/api/v3/tags/?page_size=1000", {
        "headers": headers,
        "referrer": "https://readwise.io/articles",
        "body": null,
        "method": "GET"
    });

    if (tags) {
        return tags.map((t) => t.key);
    }
    console.error("Did not list tags successfully!");
    return [];
}

async function listBooksHavingTag(tag) {
   const headers = buildRequestHeaders();
   headers["Content-Type"] = "application/json";

   let books = await fetchWithPagination(`https://readwise.io/api/v3/list/?tag=${tag}&page_size=1000`, {
        "headers": headers,
        "referrer": "https://readwise.io/articles",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    return books;
}

async function listBookDetails(book_id) {
   const headers = buildRequestHeaders();
   headers["Content-Type"] = "application/json";

   let books = await fetchWithPagination(`https://readwise.io/api/v3/list/?id=${book_id}&page_size=1000`, {
        "headers": headers,
        "referrer": "https://readwise.io/articles",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    return books;
}

async function updateDocumentTags(book_id, tag_list) {
    console.debug(`updating tags for ${book_id}: ${tag_list}`);
    const headers = buildRequestHeaders();
    headers["Content-Type"] = "application/json";

    // PATCH allows to update only the tags without having to echo back existing values for other fields. However, to preserve existing tags,
    // you need to query the existing tags and merge them together.
    let book_info = await listBookDetails(book_id);

    let current_tags = book_info && book_info.length === 1 ? (book_info[0].tags ? Object.entries(book_info[0].tags).map(t => t[0]) : []) : [];
    let union_tag_list = [...new Set([...current_tags, ...tag_list])];

    // New v3 UPDATE API supposed to work
    // Request: PATCH to https://readwise.io/api/v3/update/<document_id>/
    const update_result = fetch(`https://readwise.io/api/v3/update/${book_id}`, {
            "headers": headers,
            "referrer": "https://readwise.io/articles",
            "body": JSON.stringify({
                tags: union_tag_list
            }),
            "method": "PATCH",
        "mode": "cors",
        "credentials": "include"
        });
}


async function fetchWithPagination(url, params) {
    let aggregate_results = [];

    let next_url = url;
    while (next_url) {
        let results = await fetch(next_url, params);
        if (results.ok) {
            let results_json = await results.json();

            aggregate_results = aggregate_results.concat(results_json.results);
            next_url = results_json.next;
        } else if (results.status == 429) {
            // too many requests
            // book list endpoints are restricted to 20 per minute (per access token).
            // Retry-After to sleep before retry
            let secs = results.headers.get("Retry-After");
            console.warn(`Throttled: Waiting for ${secs} seconds before retry`);
            await new Promise(r => setTimeout(r, secs));
        }
    }

    return aggregate_results;
}


(async function() {
    'use strict';

    GM_registerMenuCommand("Change settings", function(event) {
        cfg.open();
    }, {
        autoClose: true
    });

    GM_registerMenuCommand('Bulk apply tags', () => {
        bulkApplyTags();
    }, {
        autoClose: true
    });

    window.addEventListener("load", (event) => {

        let observer = new MutationObserver(mutationRecords => {
            console.log(mutationRecords);
        });

        // watch for new nodes added to DOM
        const listRootElement = document.querySelector('.listRoot > ol');
        observer.observe(listRootElement, {
            childList: true // observe direct children
        });
    });

})();