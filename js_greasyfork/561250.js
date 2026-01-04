// ==UserScript==
// @name         Geoguessr duel round analysis
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Analyse duel round data on a map
// @author       irrational
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1408713
// @require      https://cdn.jsdelivr.net/npm/ol@10.7.0/dist/ol.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.5.1
// @resource     openlayersCSS https://cdn.jsdelivr.net/npm/ol@v10.7.0/ol.css
// @resource     countries https://cdn.jsdelivr.net/npm/world-countries@5.1.0/countries.json
// @grant        GM_getResourceText
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
const MODE_SELECT_ID = '__userscript_mode_select';
const COUNTRY_SELECT_ID = '__userscript_country_select';


let map = null;
const locSource = new ol.source.Vector();
const selectSource = new ol.source.Vector();
const selectDraw = new ol.interaction.Draw({source: selectSource, type: 'Polygon'});
let allRounds = [];
let chart = null;

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

const makeSelect = (options) => {
    const select = document.createElement('select');
    for (const [value, label] of options) {
        const option = makeStyledElement('option', {backgroundColor: 'black'});
        option.value = value;
        option.innerHTML = label;
        select.append(option);
    }
    return select;
};

const flag = (cc) =>
    String.fromCodePoint(...cc.toUpperCase().split('').map(char => 127397 + char.charCodeAt()));

const openMap = (userId) => {
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

    const controlsContainer = makeStyledElement('div', {
        position: 'absolute',
        left: 'calc(40px + 1vw)',
        top: '2vh',
        width: '20vw',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999
    });
    controlsContainer.className = ANALYSIS_CONTROLS_CLASS;

    const chartContainer = makeStyledElement('div', {
        position: 'absolute',
        right: '2vh',
        bottom: 'calc(17px + 2vh)',
        width: '50vh',
        height: '25vh',
        padding: '1vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '1vh',
        zIndex: 9999
    });
    const chartCanvas = document.createElement('canvas');
    chartContainer.append(chartCanvas);

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
                                       ['NmpzDuels', 'NMPZ']]);
    gameModeSelect.id = GAME_MODE_SELECT_ID;
    controlsContainer.append(gameModeSelect);

    const modeSelect = makeSelect([['show', 'Show all of my guesses'],
                                   ['guess', 'Select where I guessed, show locations'],
                                   ['loc', 'Select where it was, show my guesses'],
                                   ['country', 'Select country of location, show my guesses']]);
    modeSelect.id = MODE_SELECT_ID;
    modeSelect.value = 'guess';
    controlsContainer.append(modeSelect);

    const countryList = JSON.parse(GM_getResourceText('countries'));
    countryList.sort((a, b) => a.name.common < b.name.common ? -1 : 1);
    const countrySelect = makeSelect(countryList.map((country) => [country.cca2.toLowerCase(),
                                                                   `${flag(country.cca2)} ${country.name.common}`]));
    countrySelect.id = COUNTRY_SELECT_ID;
    countrySelect.style.display = 'none';
    controlsContainer.append(countrySelect);

    const olStyleSheet = document.createElement('style');
    let styles = GM_getResourceText('openlayersCSS');
    styles += `#${ANALYSIS_MAP_ID} * { font-family: sans-serif; font-size: 0.75rem; }`;
    styles += `.${ANALYSIS_MAP_TILES_CLASS} { filter: grayscale(100%) brightness(50%); }`;
    styles += `.${ANALYSIS_CONTROLS_CLASS} input { padding: 0; border:0; color: white; background-color: transparent; }`;
    styles += `.${ANALYSIS_CONTROLS_CLASS} > * { padding: 0; border:0; color: white; background-color: transparent; margin-bottom: 0.5em }`;
    styles += `.ol-viewport { border-radius: 1vh }`;
    olStyleSheet.innerHTML = styles;
    olStyleSheet.type = 'text/css';

    modal.append(olStyleSheet);
    modal.append(closeButton);
    modal.append(controlsContainer);
    modal.append(chartContainer);
    document.body.append(modal);

    for (const control of [fromDateInput, toDateInput, gameModeSelect]) {
        control.addEventListener('change', () => {
            fetchRounds(userId).then(makeDataLayers);
        });
    }
    modeSelect.addEventListener('change', () => {
        countrySelect.style.display = modeSelect.value == 'country' ? null : 'none';
        if (['show', 'country'].includes(modeSelect.value)) {
            selectSource.clear();
            map.removeInteraction(selectDraw);
            makeDataLayers();
        } else if (selectSource.getFeatures().length > 0) makeDataLayers();
        else {
            locSource.clear();
            chart.data.datasets[0].data = new Array(11).fill(0);
            chart.update();
            map.addInteraction(selectDraw);
        }
    });
    countrySelect.addEventListener('change', makeDataLayers);

    const osmLayer = new ol.layer.Tile({ source: new ol.source.OSM(), className: ANALYSIS_MAP_TILES_CLASS });
    const heatmapLayer = new ol.layer.Heatmap({
        source: locSource,
        blur: 15,
        radius: 5,
        weight: 'weight'
    });
    const selectLayer = new ol.layer.Vector({ source: selectSource });

    map = new ol.Map({
        target: ANALYSIS_MAP_ID,
        layers: [
            osmLayer,
            heatmapLayer,
            selectLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 1
        })
    });

    map.addInteraction(selectDraw);
    selectDraw.on('drawstart', () => { selectSource.clear(); });
    selectDraw.on('drawend', (event) => makeDataLayers(event.feature));

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

    fetchRounds(userId).then(makeDataLayers);
};

const getControls = () => {
    return {
        fromDate: document.getElementById(FROM_DATE_INPUT_ID).value,
        toDate: document.getElementById(TO_DATE_INPUT_ID).value,
        gameMode: document.getElementById(GAME_MODE_SELECT_ID).value,
        mode: document.getElementById(MODE_SELECT_ID).value,
        country: document.getElementById(COUNTRY_SELECT_ID).value
    };
};

const fetchRounds = async (userId) => {
    const db = await openDB(userId);
    const tx = db.transaction(`rounds_${userId}`, 'readonly');
    const roundsStore = tx.objectStore(`rounds_${userId}`);
    const index = roundsStore.index('timeGameModeIndex');

    const controls = getControls();
    const bounds = IDBKeyRange.bound([controls.gameMode, new Date(controls.fromDate)],
                                     [controls.gameMode, new Date(controls.toDate)]);
    const duels = await fetchResult(index.getAll(bounds));

    allRounds = [];
    for (const duel of duels) {
        allRounds.push(...duel.rounds.filter((round) => round.ourGuess));
    }
};

const makeDataLayers = (selectFeature = null) => {
    const controls = getControls();
    let features = null;

    const selectFeatures = selectSource.getFeatures();
    if (! selectFeature && selectFeatures.length > 0) selectFeature = selectFeatures[0];
    locSource.clear();
    if (['guess', 'loc'].includes(controls.mode) && ! selectFeature) return;
    let activeRounds = [];

    if (controls.mode == 'show') {
        features = allRounds.map((round) => {
            return new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([round.ourGuess.lng, round.ourGuess.lat])),
                weight: 10000/allRounds.length
            });
        });
        activeRounds = allRounds;
    } else if (controls.mode == 'guess') {
        activeRounds = allRounds.filter((round) =>
            selectFeature.getGeometry().intersectsCoordinate(ol.proj.fromLonLat([round.ourGuess.lng, round.ourGuess.lat])));
        features = activeRounds.map((round) => {
            return new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([round.panorama.lng, round.panorama.lat])),
                weight: 10000/activeRounds.length
            });
        });
    } else if (controls.mode == 'loc') {
        activeRounds = allRounds.filter((round) =>
            selectFeature.getGeometry().intersectsCoordinate(ol.proj.fromLonLat([round.panorama.lng, round.panorama.lat])));
        features = activeRounds.map((round) => {
            return new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([round.ourGuess.lng, round.ourGuess.lat])),
                weight: 10000/activeRounds.length
            });
        });
    } else if (controls.mode == 'country') {
        activeRounds = allRounds.filter((round) => round.panorama.countryCode == controls.country);
        features = activeRounds.map((round) => {
            return new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([round.ourGuess.lng, round.ourGuess.lat])),
                weight: 10000/activeRounds.length
            });
        });
    }

    if (chart) {
        const scores = new Array(11).fill(0);
        activeRounds.forEach((round) => scores[10 - Math.floor(round.ourGuess.score / 500)] += 1);
        chart.data.datasets[0].data = scores;
        chart.update();
    }

    if (features) locSource.addFeatures(features);
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