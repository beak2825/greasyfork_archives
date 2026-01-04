// ==UserScript==
// @name            IMDB List Importer (No Duplicates)
// @namespace       http://nimabehkar.ir
// @include         https://www.imdb.com/list/*
// @version         2
// @author          NimaBhk
// @license         GPL-3.0-or-later
// @description     Import titles and people from CSV or text to IMDb lists with smart duplicate detection (both local and remote).
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/560762/IMDB%20List%20Importer%20%28No%20Duplicates%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560762/IMDB%20List%20Importer%20%28No%20Duplicates%29.meta.js
// ==/UserScript==

/**
 * This script is a derivative work based on the original IMDB List Importer by Neinei0k.
 * Portions of the UI and logic have been rewritten to support duplicate detection
 * and enhanced CSV parsing.
 */


// GraphQL query
var request_data_get_current_items = {
    "query": "query GetListItems($listId: ID!) {\n  list(id: $listId) {\n    items(first: 500) {\n      edges {\n        node {\n          listItem {\n            ... on Title { id }\n            ... on Name { id }\n          }\n        }\n      }\n    }\n  }\n}",
    "operationName": "GetListItems",
    "variables": {
        "listId": ""
    }
};

var request_data_add_item = {
    "query": "mutation AddConstToList($listId: ID!, $constId: ID!, $includeListItemMetadata: Boolean!, $refTagQueryParam: String, $originalTitleText: Boolean) {\n  addItemToList(input: {listId: $listId, item: {itemElementId: $constId}}) {\n    listId\n    modifiedItem {\n      ...ListItemMetadata\n      listItem @include(if: $includeListItemMetadata) {\n        ... on Title {\n          ...TitleListItemMetadata\n        }\n        ... on Name {\n          ...NameListItemMetadata\n        }\n        ... on Image {\n          ...ImageListItemMetadata\n        }\n        ... on Video {\n          ...VideoListItemMetadata\n        }\n      }\n    }\n  }\n}\n\nfragment ListItemMetadata on ListItemNode {\n  itemId\n  createdDate\n  description {\n    originalText {\n      markdown\n      plaidHtml(showLineBreak: true)\n      plainText\n    }\n  }\n}\n\nfragment TitleListItemMetadata on Title {\n  ...BaseTitleCard\n  plot {\n    plotText {\n      plainText\n    }\n  }\n  latestTrailer {\n    id\n  }\n  series {\n    series {\n      id\n      originalTitleText {\n        text\n      }\n      releaseYear {\n        endYear\n        year\n      }\n      titleText {\n        text\n      }\n    }\n  }\n}\n\nfragment BaseTitleCard on Title {\n  id\n  titleText {\n    text\n  }\n  titleType {\n    id\n    text\n    canHaveEpisodes\n    displayableProperty {\n      value {\n        plainText\n      }\n    }\n  }\n  originalTitleText {\n    text\n  }\n  primaryImage {\n    id\n    width\n    height\n    url\n    caption {\n      plainText\n    }\n  }\n  releaseYear {\n    year\n    endYear\n  }\n  ratingsSummary {\n    aggregateRating\n    voteCount\n  }\n  runtime {\n    seconds\n  }\n  certificate {\n    rating\n  }\n  canRate {\n    isRatable\n  }\n  titleGenres {\n    genres(limit: 3) {\n      genre {\n        text\n      }\n    }\n  }\n  canHaveEpisodes\n}\n\nfragment NameListItemMetadata on Name {\n  id\n  primaryImage {\n    url\n    caption {\n      plainText\n    }\n    width\n    height\n  }\n  nameText {\n    text\n  }\n  primaryProfessions {\n    category {\n      text\n    }\n  }\n  knownFor(first: 1) {\n    edges {\n      node {\n        summary {\n          yearRange {\n            year\n            endYear\n          }\n        }\n        title {\n          id\n          originalTitleText {\n            text\n          }\n          titleText {\n            text\n          }\n          titleType {\n            canHaveEpisodes\n          }\n        }\n      }\n    }\n  }\n  bio {\n    displayableArticle {\n      body {\n        plaidHtml(\n          queryParams: $refTagQueryParam\n          showOriginalTitleText: $originalTitleText\n        )\n      }\n    }\n  }\n}\n\nfragment ImageListItemMetadata on Image {\n  id\n  url\n  height\n  width\n  caption {\n    plainText\n  }\n  names(limit: 4) {\n    id\n    nameText {\n      text\n    }\n  }\n  titles(limit: 1) {\n    id\n    titleText {\n      text\n    }\n    originalTitleText {\n      text\n    }\n    releaseYear {\n      year\n      endYear\n    }\n  }\n}\n\nfragment VideoListItemMetadata on Video {\n  id\n  thumbnail {\n    url\n    width\n    height\n  }\n  name {\n    value\n    language\n  }\n  description {\n    value\n    language\n  }\n  runtime {\n    unit\n    value\n  }\n  primaryTitle {\n    id\n    originalTitleText {\n      text\n    }\n    titleText {\n      text\n    }\n    titleType {\n      canHaveEpisodes\n    }\n    releaseYear {\n      year\n      endYear\n    }\n  }\n}",
    "operationName": "AddConstToList",
    "variables": {
        "listId": "",
        "constId": "",
        "includeListItemMetadata": true,
        "refTagQueryParam": "lsedt_add_items",
        "originalTitleText": false
    }
};

var request_data_add_description = {
    "query": "mutation EditListItemDescription($listId: ID!, $itemId: ID!, $itemDescription: String!) {\n  editListItemDescription(\n    input: {listId: $listId, itemId: $itemId, itemDescription: $itemDescription}\n  ) {\n    formattedItemDescription {\n      originalText {\n        markdown\n        plaidHtml(showLineBreak: true)\n        plainText\n      }\n    }\n  }\n}",
    "operationName": "EditListItemDescription",
    "variables": {
        "listId": "",
        "itemId": "",
        "itemDescription": ""
    }
};

var request_data_reorder_item = {
    "query": "mutation reorderListItems($input: ReorderListInput!) {\n  reorderList(input: $input) {\n    listId\n  }\n}",
    "operationName": "reorderListItems",
    "variables": {
        "input": {
            "newPositions": [],
            "listId": ""
        }
    }
};

if (/^https:\/\/(www.)?imdb.com\/list\/ls[0-9]+\/edit/.test(document.location)) {
    var elements = createHTMLForm();
}

function log(level, message) {
    console.log("(IMDB List Importer) " + level + ": " + message);
}

function setStatus(message) {
    elements.status.textContent = message;
}

function createHTMLForm() {
    let elements = {};
    try {
        let root = createRoot();
        elements.text = createTextField(root);
        if (isFileAPISupported()) {
            elements.file = createFileInput(root);
            elements.isFromFile = createFromFileCheckbox(root);
        } else {
            createFileAPINotSupportedMessage(root);
        }
        elements.isCSV = createCSVCheckbox(root);
        elements.isUnique = createUniqueCheckbox(root);
        elements.isReverse = createReverseCheckbox(root);
        elements.insert = createInsertRadio(root);
        elements.insertOther = createInsertOtherInput(root);
        elements.status = createStatusBar(root);
        createImportButton(root);
    } catch (message) {
        log("Error", message);
    }
    return elements;
}

function isFileAPISupported() {
    return window.File && window.FileReader && window.FileList && window.Blob;
}

function createRoot() {
    let container = document.querySelector('section.ipc-page-section--base');
    if (container === null) throw "Container element not found";
    let root = document.createElement('div');
    root.setAttribute('class', 'search-bar ipc-list-card--base ipc-list-card--border-line');
    root.style.cssText = 'height: initial; margin: 30px 0; padding: 10px;';
    container.insertBefore(root, container.children[1]);
    return root;
}

function createTextField(root) {
    let text = document.createElement('textarea');
    text.style.cssText = "background-color: white; width: 100%; height: 100px; overflow: initial;";
    root.appendChild(text);
    root.appendChild(document.createElement('br'));
    return text;
}

function createFileInput(root) {
    let file = document.createElement('input');
    file.type = 'file';
    file.disabled = true;
    file.style.marginBottom = '10px';
    root.appendChild(file);
    root.appendChild(document.createElement('br'));
    return file;
}

function createFromFileCheckbox(root) {
    let isFromFile = createCheckbox("Import from file (otherwise import from text)");
    root.appendChild(isFromFile.label);
    root.appendChild(document.createElement('br'));
    isFromFile.checkbox.addEventListener('change', (e) => {
        elements.text.disabled = e.target.checked;
        elements.file.disabled = !e.target.checked;
    });
    return isFromFile.checkbox;
}

function createCheckbox(textContent) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.width = 'initial';
    let text = document.createElement('span');
    text.style.fontWeight = 'normal';
    text.textContent = textContent;
    let label = document.createElement('label');
    label.appendChild(checkbox);
    label.appendChild(text);
    return {label, checkbox};
}

function createRadio(name, value, textContent) {
    let radio = document.createElement('input');
    radio.type = 'radio';
    radio.style.width = 'initial';
    radio.name = name;
    radio.value = value;
    let text = document.createElement('span');
    text.style.fontWeight = 'normal';
    text.textContent = textContent;
    let label = document.createElement('label');
    label.appendChild(radio);
    label.appendChild(text);
    return {label, radio};
}

function createCSVCheckbox(root) {
    let isCSV = createCheckbox("Data from .csv file (otherwise extract ids from text)");
    isCSV.checkbox.checked = true;
    root.appendChild(isCSV.label);
    root.appendChild(document.createElement('br'));
    return isCSV.checkbox;
}

function createUniqueCheckbox(root) {
    let isUnique = createCheckbox("Check for duplicates (Skip titles already in list)");
    isUnique.checkbox.checked = true;
    root.appendChild(isUnique.label);
    root.appendChild(document.createElement('br'));
    return isUnique.checkbox;
}

function createReverseCheckbox(root) {
    let isReverse = createCheckbox("Reverse Items on Insertion");
    root.appendChild(document.createElement('br'));
    root.appendChild(isReverse.label);
    root.appendChild(document.createElement('br'));
    return isReverse.checkbox;
}

function createInsertRadio(root) {
    let begin = createRadio("imdb_list_importer_insert", "1", "Insert in the Beginning");
    let end = createRadio("imdb_list_importer_insert", "-1", "Insert in the End");
    let other = createRadio("imdb_list_importer_insert", "0", "Insert in Other Position");
    end.radio.checked = true;
    [begin, end, other].forEach(r => {
        root.appendChild(r.label);
        root.appendChild(document.createElement('br'));
        r.radio.addEventListener('change', (e) => elements.insertOther.disabled = e.target.value != "0");
    });
    return {'begin': begin.radio, 'end': end.radio, 'other': other.radio};
}

function createInsertOtherInput(root) {
    let input = document.createElement('input');
    input.type = 'text';
    input.disabled = true;
    root.appendChild(input);
    root.appendChild(document.createElement('br'));
    return input;
}

function createStatusBar(root) {
    let status = document.createElement('div');
    status.textContent = "Ready. Set parameters and click Import.";
    status.style.margin = '10px 0';
    root.appendChild(status);
    return status;
}

function createImportButton(root) {
    let btn = document.createElement('button');
    btn.textContent = "Import List";
    btn.addEventListener('click', () => {
        if (elements.isFromFile && elements.isFromFile.checked) readFile();
        else importList(extractItems(elements.text.value));
    });
    root.appendChild(btn);
}

function readFile() {
    let file = elements.file.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = (e) => importList(extractItems(e.target.result));
        reader.readAsText(file);
    } else setStatus("Error: No file selected");
}

function extractItems(text) {
    try {
        let re = "[a-z]{2}[0-9]{7,8}";
        return elements.isCSV.checked ? extractItemsFromCSV(re, text) : extractItemsFromText(re, text);
    } catch (e) {
        setStatus("Error: " + e);
        return [];
    }
}

function extractItemsFromCSV(re, text) {
    let table = parseCSV(text);
    let fields = findFieldNumbers(table);
    let items = [];
    let regex = new RegExp("^" + re + "$");
    for (let i = 1; i < table.length; i++) {
        let row = table[i];
        if (!regex.test(row[fields.const])) throw "Invalid format on line " + (i+1);
        items.push({const: row[fields.const], description: fields.description == -1 ? "" : row[fields.description]});
    }
    return items;
}

function parseCSV(text) {
    let lines = text.split(/\r|\n/).filter(l => l.trim().length > 0);
    return lines.map(line => {
        let res = [], cell = '', inStr = false;
        for (let char of line) {
            if (char === '"') inStr = !inStr;
            else if (char === ',' && !inStr) { res.push(cell); cell = ''; }
            else cell += char;
        }
        res.push(cell);
        return res;
    });
}

function findFieldNumbers(table) {
    let head = table[0].map(h => h.toLowerCase().trim());
    let res = {const: head.indexOf('const'), description: head.indexOf('description')};
    if (res.const === -1) throw "Field 'const' not found.";
    return res;
}

function extractItemsFromText(re, text) {
    let regex = new RegExp(re, 'g'), items = [], match;
    while ((match = regex.exec(text)) !== null) items.push({const: match[0], description: ""});
    return items;
}

async function importList(list) {
    if (list.length === 0) return;
    let list_id = /ls[0-9]{1,}/.exec(location.href)[0];

    // Local Duplicate Detection (within the input data itself)
    let seenLocal = new Set();
    let uniqueLocalList = list.filter(item => {
        let duplicate = seenLocal.has(item.const);
        seenLocal.add(item.const);
        return !duplicate;
    });

    if (uniqueLocalList.length < list.length) {
        log("Info", `Local duplicates found and skipped: ${list.length - uniqueLocalList.length}`);
        list = uniqueLocalList;
    }

    // Remote Duplicate Detection (against IMDb existing items)
    if (elements.isUnique.checked) {
        setStatus("Fetching current list items to prevent duplicates...");
        request_data_get_current_items.variables.listId = list_id;
        try {
            let current = await sendRequest(request_data_get_current_items);
            let existingIds = new Set();
            if (current.data.list && current.data.list.items) {
                current.data.list.items.edges.forEach(e => {
                    if (e.node.listItem && e.node.listItem.id) existingIds.add(e.node.listItem.id);
                });
            }
            let originalCount = list.length;
            list = list.filter(item => !existingIds.has(item.const));
            log("Info", `Existing items in list skipped: ${originalCount - list.length}`);
        } catch (e) {
            log("Error", "Could not fetch existing items. Proceeding with caution.");
        }
    }

    if (list.length === 0) {
        setStatus("No new items to add (all duplicates skipped).");
        return;
    }

    if (elements.isReverse.checked) list.reverse();

    let addedItemIds = [];
    for (let i = 0; i < list.length; i++) {
        setStatus(`Adding ${i+1}/${list.length}: ${list[i].const}`);
        request_data_add_item.variables.listId = list_id;
        request_data_add_item.variables.constId = list[i].const;
        let res = await sendRequest(request_data_add_item);
        let newItemId = res.data.addItemToList.modifiedItem.itemId;
        addedItemIds.push(newItemId);

        if (list[i].description) {
            request_data_add_description.variables.listId = list_id;
            request_data_add_description.variables.itemId = newItemId;
            request_data_add_description.variables.itemDescription = list[i].description;
            await sendRequest(request_data_add_description);
        }
    }

    // Reorder logic
    let pos = elements.insert.begin.checked ? 1 : (elements.insert.other.checked ? Number(elements.insertOther.value) : -1);
    if (pos > 0) {
        request_data_reorder_item.variables.input.listId = list_id;
        request_data_reorder_item.variables.input.newPositions = addedItemIds.reverse().map(id => ({"position": pos, "itemId": id}));
        await sendRequest(request_data_reorder_item);
    }

    location.reload();
}

function sendRequest(data) {
    return fetch("https://api.graphql.imdb.com/", {
        "credentials": "include",
        "headers": {"Accept": "application/graphql+json, application/json", "content-type": "application/json"},
        "body": JSON.stringify(data),
        "method": "POST"
    }).then(r => r.ok ? r.json() : Promise.reject(r.status));
}