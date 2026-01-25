// ==UserScript==
// @name         Geoguessr duel round analysis
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Analyse duel round data on a map
// @author       irrational
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1408713
// @require      https://cdn.jsdelivr.net/npm/ol@10.7.0/dist/ol.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.5.1
// @require      https://cdn.jsdelivr.net/npm/kdbush@4.0.2
// @require      https://cdn.jsdelivr.net/npm/chroma-js@3.2.0/dist/chroma.cjs
// @resource     openlayersCSS https://cdn.jsdelivr.net/npm/ol@10.7.0/ol.css
// @resource     countries https://cdn.jsdelivr.net/npm/world-countries@5.1.0/countries.json
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/561250/Geoguessr%20duel%20round%20analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/561250/Geoguessr%20duel%20round%20analysis.meta.js
// ==/UserScript==


const DATABASE_MIN_VERSION = 7;
const ANALYSIS_ANCHOR_CLASS = '__userscript_analysis_anchor';
const ANALYSIS_MAP_ID = '__userscript_analysis_map';
const ANALYSIS_MAP_TILES_CLASS = '__userscript_analysis_map_tiles';
const ANALYSIS_CONTROLS_CLASS = '__userscript_analysis_controls';
const FROM_DATE_INPUT_ID = '__userscript_from_date_input';
const TO_DATE_INPUT_ID = '__userscript_to_date_input';
const GAME_MODE_SELECT_ID = '__userscript_game_mode_select';
const SELECT_SELECT_ID = '__userscript_select_select';
const FILTER_SELECT_ID = '__userscript_filter_select';
const COUNTRY_SELECT_ID = '__userscript_country_select';
const SHOW_SELECT_ID = '__userscript_show_select';
const LINES_INPUT_ID = '__userscript_lines_input';
const LINES_LABEL_ID = '__userscript_lines_label';
const LINECOLOUR_SELECT_ID = '__userscript_linecolour_select';
const KEEP_INPUT_ID = '__userscript_keep_input';


let map = null;
const heatSource = new ol.source.Vector();
const selectSource = new ol.source.Vector();
const pairsSource = new ol.source.Vector();
const selectDraw = new ol.interaction.Draw({source: selectSource, type: 'Polygon'});
let allRounds = [];
let activeRounds = [];
let activeRoundIndexes = [];
let roundsToDuels = [];
let chart = null;
let locIndex = null;
let guessIndex = null;

const openDB = async (userId) => {
    const request = indexedDB.open('userscript_duels');
    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            const db = event.target.result;
            db.version >= DATABASE_MIN_VERSION ? resolve(db) : reject();
        };
        request.onerror = (event) => reject();
    });
};

const fetchResult = (request) => new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event);
});

const fetchProfile = () => {
    return fetch('https://www.geoguessr.com/api/v3/profiles')
           .then(response => response.json());
};

const makeStyledElement = (el, style) => {
    const element = document.createElement(el);
    Object.assign(element.style, style);
    return element;
};

const makeSelect = (options, id = null, preset = null) => {
    const select = document.createElement('select');
    for (const [value, label] of options) {
        const option = makeStyledElement('option', {backgroundColor: 'black'});
        option.value = value;
        option.innerHTML = label;
        select.append(option);
    }
    if (id) select.id = id;
    if (preset) select.value = preset;
    return select;
};

const makeCheckbox = (text, checkboxId, labelId = null) => {
    const div = document.createElement('div');
    const checkbox = makeStyledElement('input', {verticalAlign: 'middle', margin: '0 1ex 0 0'});
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    div.append(checkbox);
    const label = makeStyledElement('label', {verticalAlign: 'middle'});
    label.id = labelId;
    label.htmlFor = checkboxId;
    label.innerHTML = text;
    div.append(label);
    return [div, checkbox, label];
};

const makeMinimisableDiv = (titleText, contentDisplayStyle = null) => {
    const div = document.createElement('div');
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.gap = '1em';
    header.style.width = '100%';
    const title = document.createElement('div');
    title.style.flex = 1;
    title.style.color = 'rgba(255, 255, 255, 0.6)';
    title.innerHTML = titleText;
    const minimise = document.createElement('div');
    minimise.style.flex = 2;
    minimise.style.textAlign = 'right';
    minimise.style.cursor = 'pointer';
    minimise.innerHTML = '➖';
    header.append(title, minimise);
    const content = document.createElement('div');
    content.style.display = contentDisplayStyle;
    content.style.marginTop = '1em';
    div.append(header, content);
    minimise.addEventListener('click', () => {
        content.style.display = content.style.display == 'none' ? contentDisplayStyle : 'none';
        minimise.innerHTML = content.style.display == 'none' ? '➕' : '➖';
    });
    return [div, content];
};

const radiusToExtent = (lon, lat, radius) => {
    const degPerMetre = 360/(2*Math.PI * 6371000);
    const dLat = radius * degPerMetre;
    const dLon = Math.cos(Math.PI*lat/180) * radius * degPerMetre;
    return [lon - dLon, lat - dLat, lon + dLon, lat + dLat];
};

const lineColour = (value, min, max) => {
    const gradient = chroma.scale('RdYlBu').mode('lab');
    const clamped = Math.max(min, Math.min(max, value));
    return gradient((clamped - min)/(max - min)).hex();
};

const openMap = (userId) => {
    /* ===== Interface ===== */

    const modal = makeStyledElement('div', {
        position: 'fixed',
        top: '3vh',
        left: '3vh',
        width: 'calc(100% - 6vh)',
        height: 'calc(100% - 6vh)',
        backgroundColor: 'rgb(102, 102, 102)',
        borderRadius: '1vh',
        zIndex: 9998
    });
    modal.id = ANALYSIS_MAP_ID;

    const closeButton = makeStyledElement('div', {
        position: 'absolute',
        top: '2vh',
        right: '2vh',
        color: 'white',
        cursor: 'pointer',
        zIndex: 9999
    });
    closeButton.innerHTML = '❌';
    closeButton.addEventListener('click', () => {
        selectSource.clear();
        chart = null;
        modal.remove();
    });

    const [controlsDiv, controlsContainer] = makeMinimisableDiv('Controls', 'flex');
    Object.assign(controlsDiv.style, {
        position: 'absolute',
        left: 'calc(0.5em + 18.5px + 1vw)',
        top: '2vh',
        padding: '2ex',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '1vh',
        zIndex: 9999
    });
    Object.assign(controlsContainer.style, {
        flexDirection: 'column',
        gap: '0.5em'
    });
    controlsContainer.className = ANALYSIS_CONTROLS_CLASS;

    const dateDiv = document.createElement('div');

    let fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 90);
    fromDate = fromDate.toISOString().split('T')[0];
    dateDiv.append(document.createTextNode('From '));
    const fromDateInput = document.createElement('input');
    fromDateInput.type = 'date';
    fromDateInput.id = FROM_DATE_INPUT_ID;
    fromDateInput.value = fromDate;
    dateDiv.append(fromDateInput);

    const toDate = new Date().toISOString().split('T')[0];
    dateDiv.append(document.createTextNode(' to '));
    const toDateInput = document.createElement('input');
    toDateInput.type = 'date';
    toDateInput.id = TO_DATE_INPUT_ID;
    toDateInput.value = toDate;
    dateDiv.append(toDateInput);
    controlsContainer.append(dateDiv);

    const gameModeSelect = makeSelect([['StandardDuels', 'Moving'],
                                       ['NoMoveDuels', 'NM'],
                                       ['NmpzDuels', 'NMPZ']],
                                      GAME_MODE_SELECT_ID);
    controlsContainer.append(gameModeSelect);

    const selectSelect = makeSelect([['guesses', 'Take all round guesses,'],
                                     ['locs', 'Take all round locations,']],
                                    SELECT_SELECT_ID,
                                    'locs');
    controlsContainer.append(selectSelect);

    const filterSelect = makeSelect([['polygon', 'filter them by polygon,'],
                                     ['country', 'filter them by country/territory:'],
                                     ['none', 'don\'t filter them,']],
                                    FILTER_SELECT_ID);
    controlsContainer.append(filterSelect);

    const countryList = JSON.parse(GM_getResourceText('countries'));
    countryList.sort((a, b) => a.name.common < b.name.common ? -1 : 1);
    const countrySelect = makeSelect(countryList.map((country) => [country.cca2.toLowerCase(),
                                                                   `${country.flag} ${country.name.common}`]));
    countrySelect.id = COUNTRY_SELECT_ID;
    countrySelect.style.display = 'none';
    controlsContainer.append(countrySelect);

    const showSelect = makeSelect([['guesses', 'and show the corresponding guesses.'],
                                   ['locs', 'and show the corresponding locations.']],
                                  SHOW_SELECT_ID);
    controlsContainer.append(showSelect);

    const [linesDiv, linesCheckbox, linesLabel] = makeCheckbox('Inspect', LINES_INPUT_ID, LINES_LABEL_ID);
    controlsContainer.append(linesDiv);

    const lineColourSelect = makeSelect([['score', 'Colour by score'],
                                         ['damage', 'Colour by damage (before multipliers)'],
                                         ['multidamage', 'Colour by damage (after multipliers)']],
                                        LINECOLOUR_SELECT_ID);
    lineColourSelect.style.display = 'none';
    controlsContainer.append(lineColourSelect);

    const [keepDiv, keepCheckbox] = makeCheckbox('Keep these settings for next time', KEEP_INPUT_ID);
    controlsContainer.append(keepDiv);

    const [chartDiv, chartContainer] = makeMinimisableDiv('Statistics');
    Object.assign(chartDiv.style, {
        position: 'absolute',
        right: '2vh',
        bottom: 'calc(17px + 2vh)',
        padding: '1vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '1vh',
        zIndex: 9999
    });
    chartContainer.style.width = '50vh';
    const chartCanvas = document.createElement('canvas');
    const countsDiv = makeStyledElement('div', {color: 'white', textAlign: 'right'});
    chartContainer.append(chartCanvas);
    chartContainer.append(countsDiv);

    const olStyleSheet = document.createElement('style');
    let styles = GM_getResourceText('openlayersCSS');
    styles += `#${ANALYSIS_MAP_ID} * { font-family: sans-serif; font-size: 0.75rem; }`;
    styles += `.${ANALYSIS_MAP_TILES_CLASS} { filter: grayscale(100%) brightness(50%); }`;
    styles += `.${ANALYSIS_CONTROLS_CLASS} input { padding: 0; border:0; color: white; background-color: transparent; }`;
    styles += `.${ANALYSIS_CONTROLS_CLASS} > * { padding: 0; border:0; color: white; background-color: transparent; }`;
    styles += `.ol-viewport { border-radius: 1vh }`;
    olStyleSheet.innerHTML = styles;
    olStyleSheet.type = 'text/css';

    modal.append(olStyleSheet);
    modal.append(closeButton);
    modal.append(controlsDiv);
    modal.append(chartDiv);
    document.body.append(modal);


    /* ===== Event handlers ===== */

    for (const control of [fromDateInput, toDateInput, gameModeSelect]) {
        control.addEventListener('change', () => {
            fetchRounds(userId).then(() => {
                makeHeatLayer();
                updateCounts(countsDiv);
            });
        });
    }
    selectSelect.addEventListener('change', () => {
        if (selectSelect.value == 'guesses') {
            if (filterSelect.value == 'country') {
                filterSelect.value = 'polygon';
                filterSelect.dispatchEvent(new Event('change'));
            }
            filterSelect.querySelector("option[value='country']").disabled = true;
        } else if (selectSelect.value == 'locs') {
            filterSelect.querySelector("option[value='country']").disabled = false;
        }
        makeHeatLayer();
        updateCounts(countsDiv);
    });
    filterSelect.addEventListener('change', () => {
        countrySelect.style.display = filterSelect.value == 'country' ? null : 'none';
        if (filterSelect.value == 'country' ||
            filterSelect.value == 'none')
        {
            selectSource.clear();
            map.removeInteraction(selectDraw);
        } else if (filterSelect.value == 'polygon') {
            heatSource.clear();
            map.addInteraction(selectDraw);
            chart.data.datasets[0].data = new Array(11).fill(0);
            chart.update();
        }
        makeHeatLayer();
        updateCounts(countsDiv);
    });

    countrySelect.addEventListener('change', () => {
        makeHeatLayer();
        updateCounts(countsDiv);
    });

    showSelect.addEventListener('change', () => {
        linesLabel.innerHTML = `Inspect corresponding ${showSelect.value == 'guesses' ? 'locations' : 'guesses'}`;
        makeHeatLayer();
    });

    linesCheckbox.addEventListener('change', () => {
        lineColourSelect.style.display = linesCheckbox.checked ? null : 'none';
        if (! linesCheckbox.checked) pairsSource.clear();
    });

    for (const control of [fromDateInput, toDateInput, gameModeSelect, selectSelect, filterSelect,
                           countrySelect, showSelect, linesCheckbox, lineColourSelect, keepCheckbox])
    {
        control.addEventListener('change', () => {
            GM_setValue('controls', keepCheckbox.checked ? getControls() : null);
        });
    }

    /* ===== OpenLayers ===== */

    const osmLayer = new ol.layer.Tile({ source: new ol.source.OSM(), className: ANALYSIS_MAP_TILES_CLASS });
    const heatmapLayer = new ol.layer.Heatmap({
        source: heatSource,
        blur: 15,
        radius: 5,
        weight: 'weight'
    });
    const selectLayer = new ol.layer.Vector({ source: selectSource });
    const pairsLayer = new ol.layer.Vector({ source: pairsSource });

    map = new ol.Map({
        target: ANALYSIS_MAP_ID,
        layers: [
            osmLayer,
            selectLayer,
            heatmapLayer,
            pairsLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 1
        })
    });

    selectDraw.on('drawstart', (event) => {
         event.feature.setStyle(new ol.style.Style({
             fill: new ol.style.Fill({
                 color: 'rgba(255, 255, 255, 0.2)'
             })
         }));
        selectSource.clear();
    });
    selectDraw.on('drawend', (event) => {
        makeHeatLayer(event.feature);
        updateCounts(countsDiv);
    });

    map.on('pointermove', drawPairs);


    /* ===== Chart ===== */

    const color = 'rgba(255, 255, 255, 0.6)';
    chart = new Chart(chartCanvas, {
        type: 'bar',
        data: { labels: ['5000', '4999-4500', '4499-4000', '3999-3500', '3499-3000',
                         '2999-2500', '2499-2000', '1999-1500', '1499-1000',
                         '999-500', '499-0'],
                datasets: [{ label: 'Score', data: new Array(11).fill(0) }] },
        options: {
            scales: {
                x: { grid: { color: color }, ticks: { color: color } },
                y: { beginAtZero: true, grid: { color: color }, ticks: { color: color } }
            },
            plugins: {
                legend: { labels: { color: color } }
            }
        }
    });


    /* ===== Initialise ===== */

    const controls = GM_getValue('controls');
    if (controls) {
        fromDateInput.value = controls.fromDate;
        toDateInput.value = controls.toDate;
        gameModeSelect.value = controls.gameMode;
        selectSelect.value = controls.select;
        filterSelect.value = controls.filter;
        countrySelect.value = controls.country;
        showSelect.value = controls.show;
        linesCheckbox.checked = controls.lines;
        lineColourSelect.value = controls.linecolour;
        keepCheckbox.checked = controls.keep;
    }
    linesLabel.innerHTML = `Inspect corresponding ${showSelect.value == 'guesses' ? 'locations' : 'guesses'}`;
    if (filterSelect.value == 'polygon') map.addInteraction(selectDraw);
    if (filterSelect.value == 'country') countrySelect.style.display = null;
    if (linesCheckbox.checked) lineColourSelect.style.display = null;

    fetchRounds(userId).then(() => {
        makeHeatLayer();
        updateCounts(countsDiv);
    });
};

const getControls = () => {
    return {
        fromDate: document.getElementById(FROM_DATE_INPUT_ID).value,
        toDate: document.getElementById(TO_DATE_INPUT_ID).value,
        gameMode: document.getElementById(GAME_MODE_SELECT_ID).value,
        select: document.getElementById(SELECT_SELECT_ID).value,
        filter: document.getElementById(FILTER_SELECT_ID).value,
        country: document.getElementById(COUNTRY_SELECT_ID).value,
        show: document.getElementById(SHOW_SELECT_ID).value,
        lines: document.getElementById(LINES_INPUT_ID).checked,
        linecolour: document.getElementById(LINECOLOUR_SELECT_ID).value,
        keep: document.getElementById(KEEP_INPUT_ID).checked
    };
};

const fetchRounds = async (userId) => {
    const db = await openDB(userId);
    const tx = db.transaction(`rounds_${userId}`, 'readonly');
    const roundsStore = tx.objectStore(`rounds_${userId}`);
    const index = roundsStore.index('timeGameModeIndex');

    const controls = getControls();
    const bounds = IDBKeyRange.bound([controls.gameMode, new Date(controls.fromDate + "T00:00:00")],
                                     [controls.gameMode, new Date(controls.toDate + "T23:59:59")]);
    const duels = await fetchResult(index.getAll(bounds));

    allRounds = [];
    roundsToDuels = [];
    for (let i = 0; i < duels.length; ++i) {
        const filteredRounds = duels[i].rounds.filter((round) => round.ourGuess);
        allRounds.push(...filteredRounds);
        roundsToDuels.push(...new Array(filteredRounds.length).fill(i));
    }
    guessIndex = new KDBush(allRounds.length);
    locIndex = new KDBush(allRounds.length);
    for (const round of allRounds) {
        /* We ignore the wraparound at +- 180 degrees longitude. This is a bug, but because
           we're unlikely to have to index anything in a reasonably wide band around it,
           we'll let it slide for now. */
        guessIndex.add(round.ourGuess.lng, round.ourGuess.lat);
        locIndex.add(round.panorama.lng, round.panorama.lat);
    }
    guessIndex.finish();
    locIndex.finish();
};

const makeHeatLayer = (selectFeature = null) => {
    const controls = getControls();
    let features = null;

    const selectFeatures = selectSource.getFeatures();
    if (! selectFeature && selectFeatures.length > 0) selectFeature = selectFeatures[0];

    heatSource.clear();

    activeRounds = [];
    activeRoundIndexes = [];
    if (controls.filter == 'polygon' && selectFeature) {
        const selectGeom = selectFeature.getGeometry();
        if (controls.select == 'locs') {
            activeRoundIndexes = locIndex
                .range(...ol.proj.transformExtent(selectGeom.getExtent(), 'EPSG:3857', 'EPSG:4326'))
                .filter((i) => selectGeom.intersectsCoordinate(ol.proj.fromLonLat([allRounds[i].panorama.lng,
                                                                                   allRounds[i].panorama.lat])));
            activeRounds = activeRoundIndexes.map((i) => allRounds[i]);
        } else if (controls.select == 'guesses') {
            activeRoundIndexes = guessIndex
                .range(...ol.proj.transformExtent(selectGeom.getExtent(), 'EPSG:3857', 'EPSG:4326'))
                .filter((i) => selectGeom.intersectsCoordinate(ol.proj.fromLonLat([allRounds[i].ourGuess.lng,
                                                                                   allRounds[i].ourGuess.lat])));
            activeRounds = activeRoundIndexes.map((i) => allRounds[i]);
        }
    } else if (controls.filter == 'country') {
        // country filtering is only active when we are selecting locations
        for (let i = 0; i < allRounds.length; ++i) {
            if (allRounds[i].panorama.countryCode == controls.country) {
                activeRounds.push(allRounds[i]);
                activeRoundIndexes.push(i);
            }
        }
    } else if (controls.filter == 'none') {
        activeRoundIndexes = Array(allRounds.length).fill().map((e, i) => i);
        activeRounds = allRounds;
    }

    if (controls.show == 'locs') {
        features = activeRounds.map((round) =>
            new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([round.panorama.lng, round.panorama.lat])),
                weight: 10000/activeRounds.length
            }));
    } else if (controls.show == 'guesses') {
        features = activeRounds.map((round) =>
            new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([round.ourGuess.lng, round.ourGuess.lat])),
                weight: 10000/activeRounds.length
            }));
    }

    if (chart) {
        const scores = new Array(11).fill(0);
        activeRounds.forEach((round) => scores[10 - Math.floor(round.ourGuess.score / 500)] += 1);
        chart.data.datasets[0].data = scores;
        chart.update();
    }

    if (features) heatSource.addFeatures(features);
};

const drawPairs = (event) => {
    if (event.dragging) return;
    if (! locIndex || ! guessIndex) return;
    const controls = getControls();
    if (! controls.lines) return;

    const radius = Math.min(map.getView().getResolution() * 100, 200000); // 100 pixels, but at most 200 km
    const centre = ol.proj.toLonLat(event.coordinate);
    const searchBox = radiusToExtent(...centre, radius);
    const guessesNotLocs = controls.show == 'guesses';
    const candidates =
          (guessesNotLocs ? guessIndex.range(...searchBox) : locIndex.range(...searchBox))
          .filter((i) => activeRoundIndexes.includes(i))
          .map((i) => allRounds[i]);

    pairsSource.clear();
    const focusCircle = new ol.Feature(new ol.geom.Circle(event.coordinate, radius));
    focusCircle.setStyle(new ol.style.Style({ fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.2)' }) }));
    pairsSource.addFeature(focusCircle);

    for (const candidate of candidates) {
        const measure =
              new ol.geom.LineString([
                  ol.proj.fromLonLat(centre),
                  ol.proj.fromLonLat(guessesNotLocs ? [candidate.ourGuess.lng, candidate.ourGuess.lat] :
                                     [candidate.panorama.lng, candidate.panorama.lat])]);
        if (measure.getLength() < radius) {
            const pairLine = new ol.Feature(new ol.geom.LineString([
                    ol.proj.fromLonLat([candidate.ourGuess.lng, candidate.ourGuess.lat]),
                    ol.proj.fromLonLat([candidate.panorama.lng, candidate.panorama.lat])
                ]));
            const damage = candidate.ourGuess.score - (candidate.theirGuess.score ? candidate.theirGuess.score : 0);
            pairLine.setStyle(new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 2,
                    color: controls.linecolour == 'score' ? lineColour(candidate.ourGuess.score, 0, 5000) :
                           controls.linecolour == 'damage' ? lineColour(damage, -5000, 5000)
                                                           : lineColour(damage * candidate.multiplier, -6000, 6000)
                })}));
            pairsSource.addFeature(pairLine);
        }
    }
};

const updateCounts = (element) => {
    const uniqueDuels = new Set();
    activeRoundIndexes.forEach((idx) => uniqueDuels.add(roundsToDuels[idx]));
    element.innerHTML = `Selected ${activeRounds.length} rounds from ${uniqueDuels.size} duels.`;
};

const run = async (mutations) => {
    navigator.locks.request("userscript_analysis_menu_item", async (lock) => {
        if (document.querySelector(`.${ANALYSIS_ANCHOR_CLASS}`)) return;
        await scanStyles();
        const teamDuelsMenuItem = document.querySelector(`a.${cn('menu-dropdown-item_dropdownItem__')}[href="/multiplayer/teams"]`);
        if (teamDuelsMenuItem) {
            const profile = await fetchProfile();
            const analysisAnchor = document.createElement('a');
            analysisAnchor.className = `${cn('next-link_anchor__')} ${cn('menu-dropdown-item_dropdownItem__')} ${ANALYSIS_ANCHOR_CLASS}`;
            const analysisImage = document.createElement('img');
            analysisImage.className = cn('menu-dropdown-item_image__');
            analysisImage.src = 'https://www.geoguessr.com/images/resize:auto:144:144/gravity:ce/plain/' + profile.user.pin.url;
            analysisImage.width = 46;
            analysisImage.height = 46;
            analysisImage.style.borderRadius = '10px';
            analysisImage.style.marginLeft = '5px';
            const analysisTitle = document.createElement('div');
            analysisTitle.className = cn('menu-dropdown-item_title__');
            analysisTitle.innerHTML = 'Duel analysis';
            const analysisDesc = document.createElement('div');
            analysisDesc.className = cn('menu-dropdown-item_description__');
            analysisDesc.innerHTML = 'Analyse your guesses in duels';
            analysisAnchor.append(analysisImage);
            analysisAnchor.append(analysisTitle);
            analysisAnchor.append(analysisDesc);
            analysisAnchor.addEventListener('click', () => openMap(profile.user.id));
            teamDuelsMenuItem.insertAdjacentElement('afterend', analysisAnchor);
        }
    });
};
new MutationObserver(run).observe(document.body, { subtree: true, childList: true });
run();
