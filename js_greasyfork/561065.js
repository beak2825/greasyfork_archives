// ==UserScript==
// @name         Milovana: Sidebar
// @namespace    wompi72
// @author       wompi72
// @version      1.0.5
// @description  Milovana Sidebar
// @match        *://milovana.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561065/Milovana%3A%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/561065/Milovana%3A%20Sidebar.meta.js
// ==/UserScript==


// TODO add sessions history
// {orgasm type, edges, duration (auto start/or manual star)}

'use strict';
const STORAGE_PREFIX = 'mv_sidebar_';

const TEASE_TYPES = {
    none: 'none',
    text: 'Text Tease',
    eos: 'Eos Tease'
}

function getPageData() {
    const currentURL = new URL(window.location.href);
    const id = currentURL.searchParams.get('id');

    const page = currentURL.searchParams.get('p');
    const isReload = localStorage.getItem(`${STORAGE_PREFIX}_${id}_lastPage`) !== page;
    localStorage.setItem(`${STORAGE_PREFIX}_${id}_lastPage`, page);

    function getTeaseType() {
        if (!currentURL.pathname.includes('/showtease.php')) return TEASE_TYPES.none;

        return document.querySelector(".eosIframe") ? TEASE_TYPES.eos : TEASE_TYPES.text;
    }

    const type = getTeaseType();

    function getTeaseTitle(type) {
        if (type === TEASE_TYPES.eos) {
            return document.body.dataset.title;
        } else if (type === TEASE_TYPES.text) {
            const titleElement = document.querySelector('#tease_title');
            if (!titleElement) return null;

            const autorElement = titleElement.querySelector('.tease_author');
            if (autorElement) autorElement.remove();

            return titleElement.textContent.trim();
        }
    }

    const title = getTeaseTitle(type)
    return {id, page, type, title, isReload};
}

const pageData = getPageData();

console.log(pageData);

const STORAGE = {
    SIDEBAR_COLLAPSED: `${STORAGE_PREFIX}_collapsed`,
    VOLUME: `${STORAGE_PREFIX}_volume`,
    NOTES: `${STORAGE_PREFIX}_${pageData.id}_notes`,
    STOPWATCH_START_ON_LOAD: `${STORAGE_PREFIX}_${pageData.id}_stopwatch_start_on_load`,
    PAGES_VISITED: `${STORAGE_PREFIX}_${pageData.id}_pages_visited`,
    RANDOM_PAGE_FROM: `${STORAGE_PREFIX}_${pageData.id}_random_page_from`,
    RANDOM_PAGE_TO: `${STORAGE_PREFIX}_${pageData.id}_random_page_to`,
    RANDOM_PAGE_RELATIVE: `${STORAGE_PREFIX}_${pageData.id}_random_page_relative`,
    RNG_FROM: `${STORAGE_PREFIX}_${pageData.id}_rng_from`,
    RNG_TO: `${STORAGE_PREFIX}_${pageData.id}_rng_to`,
    RNG_HISTORY: `${STORAGE_PREFIX}_${pageData.id}_rng_history`,
    METRONOME_BPM: `${STORAGE_PREFIX}_${pageData.id}_metronome_bpm`,
    METRONOME_TARGET_COUNT: `${STORAGE_PREFIX}_${pageData.id}_metronome_target_count`,
    METRONOME_TARGET_COUNT_ACTIVE: `${STORAGE_PREFIX}_${pageData.id}_metronome_target_count_active`,
    METRONOME_TARGET_TIME: `${STORAGE_PREFIX}_${pageData.id}_metronome_target_time`,
    METRONOME_TARGET_TIME_ACTIVE: `${STORAGE_PREFIX}_${pageData.id}_metronome_target_time_active`,
    EDGE_TOTAL: `${STORAGE_PREFIX}_${pageData.id}_edge_total`,
    EDGE_COOLDOWN_ACTIVE: `${STORAGE_PREFIX}_${pageData.id}_edge_cooldown_active`,
    EDGE_COOLDOWN_TIME: `${STORAGE_PREFIX}_${pageData.id}_edge_cooldown_time`,
    EDGE_PAUSE_METRONOME: `${STORAGE_PREFIX}_${pageData.id}_edge_pause_metronome`,
    TIMERS: `${STORAGE_PREFIX}_${pageData.id}_timers`,
    OVERLAY_SIDEBAR: `${STORAGE_PREFIX}_overlay_sidebar`,
    OVERLAY_EOS: `${STORAGE_PREFIX}_overlay_sidebar_eos`,
    
}

class Sidebar {
    sidebar;
    toggleBtn;
    sections = {};

    constructor() {
        this.sidebar = document.createElement('div');
        this.sidebar.id = 'mv-sidebar';
        const collapseText = "<"
        this.sidebar.innerHTML = `
        <div class="mv-sidebar-header-main flex">
            <button id="mv-collapse" class="icon-btn">${collapseText}</button>
            <span class="mv-sidebar-main-title">Milovana Sidebar</span>
        </div>
        `;
        document.body.appendChild(this.sidebar);

        this.toggleBtn = document.createElement('button');
        this.toggleBtn.id = 'mv-sidebar-toggle';
        this.toggleBtn.classList.add('icon-btn');
        this.toggleBtn.textContent = '>';
        document.body.appendChild(this.toggleBtn);


        if (localStorage.getItem(STORAGE.SIDEBAR_COLLAPSED) === 'true') {
            this.collapse();
        } else {
            this.expand();
        }

        this.sidebar.querySelector('#mv-collapse').addEventListener('click', this.collapse.bind(this));
        this.toggleBtn.addEventListener('click', this.expand.bind(this));
    }

    unfoldAll() {
        Object.keys(this.sections).forEach(key => this.unfoldSection(key));
    }

    foldAll() {
        Object.keys(this.sections).forEach(key => this.foldSection(key));
    }

    foldSection(key) {
        const section = this.sections[key];
        if (!section) return;
        const storageKey = `${STORAGE_PREFIX}_${pageData.id}_section_${key}`;

        section.indicator.textContent = '▶ ';
        section.content.style.display = 'none';
        localStorage.setItem(storageKey, 'true');
    }

    unfoldSection(key) {
        const section = this.sections[key];
        if (!section) return;
        const storageKey = `${STORAGE_PREFIX}_${pageData.id}_section_${key}`;

        section.indicator.textContent = '▼ ';
        section.content.style.display = 'flex';
        localStorage.setItem(storageKey, 'false');
    }

    collapse() {
        this.sidebar.classList.add('collapsed');
        document.body.classList.remove('mv-sidebar-expanded');
        this.toggleBtn.style.display = 'block';
        localStorage.setItem(STORAGE.SIDEBAR_COLLAPSED, 'true');
    }

    expand() {
        this.sidebar.classList.remove('collapsed');
        
        const isOverlay = this.getIsOverlayed();
        if (!isOverlay) {
            document.body.classList.add('mv-sidebar-expanded');
            document.body.classList.add('mv-sidebar-dynamic-tease-size');
        } else {
            document.body.classList.remove('mv-sidebar-expanded');
        }

        this.toggleBtn.style.display = 'none';
        localStorage.setItem(STORAGE.SIDEBAR_COLLAPSED, 'false');
    }

    getIsOverlayed() {
        if (pageData.type === TEASE_TYPES.eos) {
            return localStorage.getItem(STORAGE.OVERLAY_EOS) === 'true';
        } else if (pageData.type === TEASE_TYPES.text) {
            return localStorage.getItem(STORAGE.OVERLAY_SIDEBAR) === 'true';
        } else {
            return true;
        }
    }

    addSection(key, label, classes = []) {
        const storageKey = `${STORAGE_PREFIX}_${pageData.id}_section_${key}`;

        const sectionEl = document.createElement('div');
        sectionEl.classList.add('mv-sidebar-section');

        const header = document.createElement('div');
        header.classList.add('mv-sidebar-section-header');
        header.dataset.key = key;

        const indicator = document.createElement('span');
        indicator.classList.add('mv-sidebar-section-indicator');

        const title = document.createElement('span');
        title.textContent = label;

        const content = document.createElement('div');
        content.classList.add('mv-sidebar-section-content');
        content.classList.add(...classes);

        header.appendChild(indicator);
        header.appendChild(title);
        sectionEl.appendChild(header);
        sectionEl.appendChild(content);
        this.sidebar.appendChild(sectionEl);

        this.sections[key] = {
            node: sectionEl,
            header: header,
            indicator: indicator,
            content: content
        };

        let collapsed = localStorage.getItem(storageKey) !== 'false';

        if (collapsed) {
            this.foldSection(key);
        } else {
            this.unfoldSection(key);
        }

        header.addEventListener('click', () => {
            const isCollapsed = localStorage.getItem(storageKey) === 'true';
            if (isCollapsed) {
                this.unfoldSection(key);
            } else {
                this.foldSection(key);
            }
        });
        return content;
    }

    getHeader(key) {
        return this.sections[key]?.header;
    }

    getSectionContent(key) {
        return this.sections[key]?.content;
    }

    addButton(label, callback, parent, classes = []) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.classList.add(...classes);
        btn.addEventListener('click', callback);
        parent.appendChild(btn);
        return btn;
    }

    addCheckbox(label, callback, parent) {
        const container = document.createElement('div');
        container.classList.add('flex-row');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', callback);
        container.appendChild(checkbox);
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.classList.add('auto-margin-height')
        container.appendChild(labelEl);
        parent.appendChild(container);
        return checkbox;
    }

    addNumberInput(placeholder, parent, classes = [], callback = null) {
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = placeholder;
        input.classList.add(...classes);
        if (callback) {
            input.addEventListener('input', callback);
        }
        parent.appendChild(input);
        return input;
    }

    addText(text, parent, classes = []) {
        const el = document.createElement('div');
        el.textContent = text;
        el.classList.add(...classes);
        parent.appendChild(el);
        return el;
    }

    addTextInput(placeholder, parent, classes = []) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.classList.add(...classes);
        parent.appendChild(input);
        return input;
    }

    addSlider(label, min, max, value, callback, parent, labelWidth = '100px') {
        const container = document.createElement('div');
        container.classList.add('flex-row');
        container.style.width = '100%';

        const labelEl = document.createElement('label');
        labelEl.textContent = `${label}: ${value.toFixed(2)}`;
        labelEl.style.width = "100%";
        labelEl.classList.add('auto-margin-height');

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = 0.01;
        slider.value = value;

        slider.addEventListener('input', () => {
            labelEl.textContent = `${label}: ${slider.value}`;
            callback(parseFloat(slider.value));
        });

        container.appendChild(labelEl);
        container.appendChild(slider);
        parent.appendChild(container);
        return slider;
    }
}

const sidebar = new Sidebar();

class Sound {
    audioContext;
    volumeGainNode;
    content;
    constructor() {
        this.storedVolume = Math.max(0, Math.min(1, parseFloat(localStorage.getItem(STORAGE.VOLUME)) || 0.5));
    }
    
    initAudio() {
        if (this.audioContext) return;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.volumeGainNode = this.audioContext.createGain();
        this.volumeGainNode.connect(this.audioContext.destination);

        this.volumeGainNode.gain.setValueAtTime(this.storedVolume, this.audioContext.currentTime);
    }

    addOptions() {
        const settingsContent = sidebar.getSectionContent('settings');
        sidebar.addSlider('Volume', 0, 1, this.storedVolume, (val) => {
            this.storedVolume = val;
            if (this.audioContext) {
                this.volumeGainNode.gain.setValueAtTime(val, this.audioContext.currentTime);
            }
            localStorage.setItem(STORAGE.VOLUME, val);
        }, settingsContent);

        sidebar.addButton('Test', this.playSound.bind(this), settingsContent);
    }

    playSound(frequency = 440, duration = 0.1, waveform = 'sine', localVolume = 1) {
        // Handle cases where frequency is an Event object from a button click
        if (typeof frequency !== 'number' || !isFinite(frequency)) {
            frequency = 440;
        }

        // Ensure other parameters are finite numbers to prevent Web Audio API errors
        duration = (typeof duration === 'number' && isFinite(duration)) ? duration : 0.1;
        localVolume = (typeof localVolume === 'number' && isFinite(localVolume)) ? localVolume : 1;

        this.initAudio();
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const oscillator = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();

        oscillator.type = waveform;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        // Local volume relative to master
        noteGain.gain.setValueAtTime(localVolume, this.audioContext.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.connect(noteGain);
        noteGain.connect(this.volumeGainNode);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
}

const sound = new Sound();

class Stopwatch {
    content
    currentTime = 0;
    timer = null;
    timerDisplay;
    toggleButton;

    constructor() {
        this.content = sidebar.addSection('stopwatch', 'Stopwatch');
        this.timerDisplay = document.createElement('div');
        this.timerDisplay.classList.add('auto-margin-height');
        const startOnLoadSetting = localStorage.getItem(STORAGE.STOPWATCH_START_ON_LOAD) === 'true';
        this.content.appendChild(this.timerDisplay);
        this.toggleButton = sidebar.addButton('Start', this.toggleTimer.bind(this), this.content);
        this.updateDisplay()
        if (startOnLoadSetting){
            this.startTimer();
        }
        sidebar.addButton('Reset', this.resetTimer.bind(this), this.content);
        this.startOnLoadCheckbox = sidebar.addCheckbox('Start on page load', this.startOnLoad.bind(this), this.content);
        this.startOnLoadCheckbox.checked = startOnLoadSetting;
    }

    startOnLoad() {
        localStorage.setItem(STORAGE.STOPWATCH_START_ON_LOAD, this.startOnLoadCheckbox.checked ? 'true' : 'false');
    }

    toggleTimer() {
        if (this.timer) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.updateDisplay();
        this.timer = setInterval(() => {
            this.currentTime += 1;
            this.updateDisplay();
        }, 1000);
        this.toggleButton.textContent = 'Stop';
    }

    stopTimer() {
        clearInterval(this.timer);
        this.timer = null;
        this.toggleButton.textContent = 'Start';
    }

    resetTimer() {
        this.stopTimer();
        this.currentTime = 0;
        this.updateDisplay();
    }


    updateDisplay() {
        this.timerDisplay.textContent = this.formatTime(this.currentTime);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

class Notes {
    constructor() {
        this.content = sidebar.addSection('notes', "Notes")
        this.notesField = document.createElement('textarea');

        this.content.appendChild(this.notesField);
        this.notesField.addEventListener('input', () => {
            localStorage.setItem(STORAGE.NOTES, this.notesField.value);
            this.textAreaAdjust();
        });
        this.notesField.value = localStorage.getItem(STORAGE.NOTES) || '';


        this.textAreaAdjust();
    }

    textAreaAdjust() {
        this.notesField.style.height = this.notesField.scrollHeight + "px";
    }
}

class TextTeasePageNavigation {
    constructor() {
        if (pageData.type !== TEASE_TYPES.text) return;
        this.content = sidebar.addSection('navigation', 'Navigation', ['flex-column']);
        const statsRow = document.createElement('div');
        statsRow.classList.add(...['flex-row', 'text-small', 'flex-space-between', 'full-width']);
        statsRow.style.width = '100%';
        sidebar.addText(`Current Page: ${pageData.page || 1}`, statsRow);
        this.trackPage();

        const stats = JSON.parse(localStorage.getItem(STORAGE.PAGES_VISITED) || '[]');
        const uniquePages = new Set(stats).size;
        const currentRevisits = stats.filter(p => p === pageData.page).length - 1;

        statsRow.appendChild(sidebar.addText(`Pages this session: ${uniquePages}`, statsRow));
        statsRow.appendChild(sidebar.addText(`Revisited this page: ${Math.max(0, currentRevisits)}`, statsRow));
        this.content.appendChild(statsRow);

        const randomRow = document.createElement('div');
        randomRow.classList.add(...['flex-row', 'full-width']);
        this.content.appendChild(randomRow);

        sidebar.addButton('Random', this.goRandom.bind(this), randomRow);
        this.randFrom = sidebar.addNumberInput('From', randomRow, ['small-input'], () => {
            localStorage.setItem(STORAGE.RANDOM_PAGE_FROM, this.randFrom.value);
        });
        this.randTo = sidebar.addNumberInput('To', randomRow, ['small-input'], () => {
            localStorage.setItem(STORAGE.RANDOM_PAGE_TO, this.randTo.value);
        });
        this.randFrom.value = localStorage.getItem(STORAGE.RANDOM_PAGE_FROM) || 1;
        this.randTo.value = localStorage.getItem(STORAGE.RANDOM_PAGE_TO) || 6;

        this.relativeRandom = sidebar.addCheckbox('Relative to current Page', () => {
            localStorage.setItem(STORAGE.RANDOM_PAGE_RELATIVE, this.relativeRandom.checked);
        }, this.content);
        this.relativeRandom.checked = localStorage.getItem(STORAGE.RANDOM_PAGE_RELATIVE) === 'true';

        const gotoRow = document.createElement('div');
        gotoRow.classList.add('flex-row');
        this.content.appendChild(gotoRow);

        sidebar.addButton('Go To', this.goTo.bind(this), gotoRow);
        this.gotoInput = sidebar.addNumberInput('Page #', gotoRow, ['small-input']);
        this.gotoInput.value = pageData.page || 1;
        const resetBtn = sidebar.addButton('Reset Stats', () => {
            localStorage.setItem(STORAGE.PAGES_VISITED, '[]');
            if (pageData.type === TEASE_TYPES.eos) return; // should still display reset data.

            location.reload();
        }, this.content);
        resetBtn.style.width = "5rem";

        this.replacePageWithAnchors(document.querySelector("#tease_content > p.text"));
    }

    trackPage() {
        if (!pageData.page) return;
        const stats = JSON.parse(localStorage.getItem(STORAGE.PAGES_VISITED) || '[]');
        // Only track if it's a new "hit" (reload or navigation)
        stats.push(pageData.page);
        localStorage.setItem(STORAGE.PAGES_VISITED, JSON.stringify(stats));
    }

    goRandom() {
        const from = parseInt(this.randFrom.value);
        const to = parseInt(this.randTo.value);
        let roll = Math.floor(Math.random() * (to - from + 1)) + from;

        if (this.relativeRandom.checked) {
            roll += parseInt(pageData.page || 0);
        }
        this.navigateTo(roll);
    }

    goTo() {
        const target = parseInt(this.gotoInput.value);
        if (!isNaN(target)) this.navigateTo(target);
    }

    navigateTo(pageNum) {
        const url = new URL(window.location.href);
        url.searchParams.set('p', pageNum);
        window.location.href = url.toString();
    }

    replacePageWithAnchors(node) {
        if (!node || !(node instanceof Node)) return;
        const url = new URL(window.location.href);
        node.innerHTML = node.innerHTML.replace(/page (\d+)/gi, (match, pageNumber) => {
            url.searchParams.set('p', pageNumber);
            return `<a href="${url}">${match}</a>`;
        });
    }
}

class EdgeCounter {
    constructor() {
        this.content = sidebar.addSection('edge-counter', 'Edges', ['flex-column']);
        this.cooldownTimer = null;
        this.pageEdges = 0;
        this._restartMetronome = false;

        const statsRow = document.createElement('div');
        statsRow.classList.add('flex-row', 'flex-space-between', 'full-width');
        this.totalDisplay = sidebar.addText('Total: 0', statsRow);
        this.pageDisplay = sidebar.addText('This page: 0', statsRow);
        this.content.appendChild(statsRow);

        const actionRow = document.createElement('div');
        actionRow.classList.add('flex-row');
        sidebar.addButton('Edge!', this.addEdge.bind(this), actionRow);
        sidebar.addButton('Reset Total', this.resetTotal.bind(this), actionRow);
        this.content.appendChild(actionRow);

        const cooldownRow = document.createElement('div');
        cooldownRow.classList.add('flex-row');
        this.cooldownActive = sidebar.addCheckbox('Cooldown (s):', (e) => {
            localStorage.setItem(STORAGE.EDGE_COOLDOWN_ACTIVE, e.target.checked);
        }, cooldownRow);
        this.cooldownInput = sidebar.addNumberInput('Secs', cooldownRow, ['small-input'], () => {
            localStorage.setItem(STORAGE.EDGE_COOLDOWN_TIME, this.cooldownInput.value);
        });
        this.cooldownDisplay = sidebar.addText('', cooldownRow, ['auto-margin-height']);
        this.content.appendChild(cooldownRow);

        this.pauseMetronomeCheckbox = sidebar.addCheckbox('Pause Metronome on Edge', (e) => {
            localStorage.setItem(STORAGE.EDGE_PAUSE_METRONOME, e.target.checked);
        }, this.content);

        this.totalCount = parseInt(localStorage.getItem(STORAGE.EDGE_TOTAL)) || 0;
        this.cooldownInput.value = localStorage.getItem(STORAGE.EDGE_COOLDOWN_TIME) || 30;
        this.cooldownActive.checked = localStorage.getItem(STORAGE.EDGE_COOLDOWN_ACTIVE) !== 'false';
        this.pauseMetronomeCheckbox.checked = localStorage.getItem(STORAGE.EDGE_PAUSE_METRONOME) !== 'false';

        this.updateDisplay();
    }

    addEdge() {
        this.totalCount++;
        this.pageEdges++;
        localStorage.setItem(STORAGE.EDGE_TOTAL, this.totalCount);
        this.updateDisplay();

        if (this.cooldownActive.checked) {
            if (this.pauseMetronomeCheckbox.checked && metronome.isRunning) {
                this._restartMetronome = true;
                metronome.stop();
            }
            this.startCooldown();
        }
    }

    startCooldown() {
        let remaining = parseInt(this.cooldownInput.value) || 0;

        this.cooldownDisplay.textContent = ` (${remaining}s)`;

        clearInterval(this.cooldownTimer);
        this.cooldownTimer = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                this.stopCooldown();
            } else {
                this.cooldownDisplay.textContent = ` (${remaining}s)`;
            }
        }, 1000);
    }

    stopCooldown() {
        clearInterval(this.cooldownTimer);
        this.cooldownTimer = null;
        this.cooldownDisplay.textContent = '';
        sound.playSound(880, 0.5, 'triangle', 1);
        if (this.pauseMetronomeCheckbox.checked && this._restartMetronome) {
            metronome.start();
            this._restartMetronome = false;
        }
    }

    resetTotal() {
        if (confirm("Reset total edge count?")) {
            this.totalCount = 0;
            localStorage.setItem(STORAGE.EDGE_TOTAL, 0);
            this.updateDisplay();
        }
    }

    updateDisplay() {
        this.totalDisplay.textContent = `Total: ${this.totalCount}`;
        this.pageDisplay.textContent = `This page: ${this.pageEdges}`;
    }
}

class Metronome {
    content;
    isRunning = false;
    beatCount = 0;
    totalSeconds = 0;
    
    bpmInterval = null;
    timerInterval = null;
    bpmUpdatePending = false;

    constructor() {
        this.content = sidebar.addSection('metronome', 'Metronome', ['flex-column']);
        
        // Stats Row (Strokes and Duration)
        const statsRow = document.createElement('div');
        statsRow.classList.add('flex-row', 'flex-space-between', 'full-width');
        this.strokeDisplay = sidebar.addText('Strokes: 0', statsRow);
        this.timeDisplay = sidebar.addText('Time: 00:00', statsRow);
        this.content.appendChild(statsRow);

        // Controls Row (Start/Stop/Reset)
        const ctrlRow = document.createElement('div');
        ctrlRow.classList.add('flex-row');
        sidebar.addText('BPM:', ctrlRow, ["auto-margin-height"]);
        this.bpmInput = sidebar.addNumberInput('BPM', ctrlRow, ['small-input']);
        this.bpmInput.value = localStorage.getItem(STORAGE.METRONOME_BPM) || 120;
        this.bpmInput.addEventListener('change', () => {
            this.saveToStorage();
        });
        this.bpmInput.addEventListener('input', () => {
            this.saveToStorage();
        });

        this.toggleBtn = sidebar.addButton('Start', this.toggle.bind(this), ctrlRow);
        sidebar.addButton('Reset', this.reset.bind(this), ctrlRow);
        this.content.appendChild(ctrlRow);

        // BPM Row
        const bpmRow = document.createElement('div');
        bpmRow.classList.add('flex-row');


        sidebar.addButton('-10', () => this.adjustBpm(-10), bpmRow, ["icon-btn"]);
        sidebar.addButton('+10', () => this.adjustBpm(10), bpmRow, ["icon-btn"]);
        sidebar.addButton('1ps', () => this.setBpm(60), bpmRow, ["icon-btn"]);
        sidebar.addButton('2ps', () => this.setBpm(120), bpmRow, ["icon-btn"]);
        sidebar.addButton('3ps', () => this.setBpm(180), bpmRow, ["icon-btn"]);
        sidebar.addButton('4ps', () => this.setBpm(240), bpmRow, ["icon-btn"]);
        this.content.appendChild(bpmRow);

        // Targets Section
        const targetCountRow = document.createElement('div');
        targetCountRow.classList.add('flex-row');
        const targetCountActiveValue = localStorage.getItem(STORAGE.METRONOME_TARGET_COUNT_ACTIVE) === 'true';
        this.targetCountActive = sidebar.addCheckbox('Target Count:', () => {
            localStorage.setItem(STORAGE.METRONOME_TARGET_COUNT_ACTIVE, this.targetCountActive.checked ? 'true' : 'false');
        }, targetCountRow);
        this.targetCountActive.checked = targetCountActiveValue;
        this.targetCountInput = sidebar.addNumberInput('Count', targetCountRow, ['small-input'], () => {
            localStorage.setItem(STORAGE.METRONOME_TARGET_COUNT, this.targetCountInput.value);
        });
        this.targetCountInput.value = localStorage.getItem(STORAGE.METRONOME_TARGET_COUNT) || 100;
        this.content.appendChild(targetCountRow);

        const targetTimeRow = document.createElement('div');
        targetTimeRow.classList.add('flex-row');
        const targetTimeActiveValue = localStorage.getItem(STORAGE.METRONOME_TARGET_TIME_ACTIVE) === 'true';
        this.targetTimeActive = sidebar.addCheckbox('Target Time (s):', () => {
            localStorage.setItem(STORAGE.METRONOME_TARGET_TIME_ACTIVE, this.targetTimeActive.checked ? 'true' : 'false');
        }, targetTimeRow);
        this.targetTimeActive.checked = targetTimeActiveValue;
        this.targetTimeInput = sidebar.addNumberInput('Secs', targetTimeRow, ['small-input'], () => {
            localStorage.setItem(STORAGE.METRONOME_TARGET_TIME, this.targetTimeInput.value);
        });
        this.targetTimeInput.value = localStorage.getItem(STORAGE.METRONOME_TARGET_TIME) || 60;
        this.content.appendChild(targetTimeRow);
    }

    saveToStorage() {
        const val = parseInt(this.bpmInput.value);
        if (val > 0) {
            localStorage.setItem(STORAGE.METRONOME_BPM, val);
            if (this.isRunning) this.bpmUpdatePending = true;
        }
    }

    toggle() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        this.isRunning = true;
        this.toggleBtn.textContent = 'Stop';
        this.bpmUpdatePending = false;
        this.startBeat();
        this.timerInterval = setInterval(() => {
            this.totalSeconds++;
            this.updateDisplay();
            this.checkTargets();
        }, 1000);
    }

    stop() {
        this.isRunning = false;
        this.bpmUpdatePending = false;
        this.toggleBtn.textContent = 'Start';
        clearInterval(this.bpmInterval);
        clearInterval(this.timerInterval);
    }

    reset() {
        this.stop();
        this.bpmUpdatePending = false;
        this.beatCount = 0;
        this.totalSeconds = 0;
        this.updateDisplay();
    }

    startBeat() {
        if (this.bpmInterval) clearInterval(this.bpmInterval);
        const bpm = parseInt(this.bpmInput.value) || 120;
        const ms = (60 / bpm) * 1000;

        this.bpmInterval = setInterval(() => {
            this.beatCount++;
            this.updateDisplay();
            sound.playSound(440, 0.05, 'sine', 0.5);
            this.checkTargets();

            if (this.bpmUpdatePending) {
                this.bpmUpdatePending = false;
                this.startBeat();
            }
        }, ms);
    }

    adjustBpm(delta) {
        let bpm = parseInt(this.bpmInput.value) || 120;
        bpm = Math.max(1, bpm + delta);
        this.bpmInput.value = bpm;
        this.saveToStorage();
        if (this.isRunning) this.bpmUpdatePending = true;
    }

    setBpm(bpm) {
        this.bpmInput.value = bpm;
        this.saveToStorage();
        if (this.isRunning) this.bpmUpdatePending = true;
    }

    checkTargets() {
        if (this.targetCountActive.checked && this.beatCount >= parseInt(this.targetCountInput.value)) {
            this.onTargetReached("Stroke target reached!");
        }
        if (this.targetTimeActive.checked && this.totalSeconds >= parseInt(this.targetTimeInput.value)) {
            this.onTargetReached("Time target reached!");
        }
    }

    onTargetReached(msg) {
        this.stop();
        sound.playSound(880, 0.5, 'triangle', 1);
    }

    updateDisplay() {
        this.strokeDisplay.textContent = `Strokes: ${this.beatCount}`;
        const mins = Math.floor(this.totalSeconds / 60);
        const secs = this.totalSeconds % 60;
        this.timeDisplay.textContent = `Time: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

}

class RNG {
    constructor() {
        this.content = sidebar.addSection('rng', 'RNG');
        this.rngHistory = JSON.parse(localStorage.getItem(STORAGE.RNG_HISTORY) || '[]');
        this.thisPageHisory = []

        const randomRow = document.createElement('div');
        randomRow.classList.add(...['flex-row', 'full-width']);
        this.content.appendChild(randomRow);
        this.randFrom = sidebar.addNumberInput('From', randomRow, ['small-input'], () => {
            localStorage.setItem(STORAGE.RNG_FROM, this.randFrom.value);
        });
        this.randTo = sidebar.addNumberInput('To', randomRow, ['small-input'], () => {
            localStorage.setItem(STORAGE.RNG_TO, this.randTo.value);
        });
        this.randFrom.value = localStorage.getItem(STORAGE.RNG_FROM) || 1;
        this.randTo.value = localStorage.getItem(STORAGE.RNG_TO) || 6;
        sidebar.addButton('Generate', this.generateNumber.bind(this), randomRow);
        this.displayGenerated = sidebar.addText("...", randomRow, ["rng-result"])
        this.hitoryEl = sidebar.addText(`History: ${this.rngHistory.join(',')}`, this.content, ["text-small"]);
    }

    async generateNumber() {
        this.displayGenerated.textContent = "...";
        const max = parseInt(this.randTo.value);
        const min = parseInt(this.randFrom.value);
        const generated = Math.floor(Math.random() * (max - min + 1)) + min;

        this.thisPageHisory.unshift(generated);
        localStorage.setItem(STORAGE.RNG_HISTORY, JSON.stringify([...this.thisPageHisory,...this.rngHistory].slice(0,15)));
        let numberLog = `History: ${this.thisPageHisory.join(',')}`;
        if (this.rngHistory.length > 0) {
            numberLog += ` | ${this.rngHistory.join(',')}`;
        }
        await new Promise(r => setTimeout(r, 200));
        this.hitoryEl.textContent = numberLog;
        this.displayGenerated.textContent = generated;
        return generated;
    }
}

class Settings {
    constructor() {
        this.overlaySidebarStored = localStorage.getItem(STORAGE.OVERLAY_SIDEBAR) === 'true';
        this.overlayEosStored = localStorage.getItem(STORAGE.OVERLAY_EOS) === 'true';
    }
    addSection() {
        this.content = sidebar.addSection('settings', 'Settings');
    }
    addSectionContent() {
        sidebar.addButton('Reset Everything', this.resetEverything.bind(this), this.content);
        sidebar.addButton('Unfold All', this.unfoldAll.bind(this), this.content);
        sidebar.addButton('Fold All', this.foldAll.bind(this), this.content);
        this.overlaySidebar = sidebar.addCheckbox("Overlay Sidebar", () => {
            localStorage.setItem(STORAGE.OVERLAY_SIDEBAR, this.overlaySidebar.checked);
        }, this.content)
        this.overlaySidebar.checked = this.overlaySidebarStored;

        this.overlayEos = sidebar.addCheckbox("Overlay Sidebar EOS", () => {
            localStorage.setItem(STORAGE.OVERLAY_EOS, this.overlayEos.checked);
        }, this.content)
        this.overlayEos.checked = this.overlayEosStored;
    }

    resetEverything() {
        const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith(`${STORAGE_PREFIX}_${pageData.id}`));
        keysToRemove.forEach(key => localStorage.removeItem(key));
        if (pageData.type === TEASE_TYPES.eos) return; // should still display reset data.

        location.reload();
    }
    unfoldAll() {
        sidebar.unfoldAll();
    }
    foldAll() {
        sidebar.foldAll();
        sidebar.unfoldSection('settings');
    }
}

class Timers {
    content;
    timers = [];
    listContainer;
    refreshInterval = null;

    constructor() {
        this.content = sidebar.addSection('timers', 'Timers', ['flex-column']);
        this.header = sidebar.getHeader('timers');

        const inputRow = document.createElement('div');
        inputRow.classList.add('flex-column', 'full-width');
        inputRow.style.gap = '2px';
        inputRow.style.marginBottom = '5px';

        this.labelInput = sidebar.addTextInput('Timer Label', inputRow);

        const timeRow = document.createElement('div');
        timeRow.classList.add('flex-row', 'flex-space-between');
        this.daysInput = sidebar.addNumberInput('Days', timeRow, ['small-input']);
        this.daysInput.placeholder = 'D';
        this.hoursInput = sidebar.addNumberInput('Hours', timeRow, ['small-input']);
        this.hoursInput.placeholder = 'H';
        this.minsInput = sidebar.addNumberInput('Mins', timeRow, ['small-input']);
        this.minsInput.placeholder = 'M';
        inputRow.appendChild(timeRow);

        sidebar.addButton('Add Timer', this.addTimer.bind(this), inputRow);
        this.content.appendChild(inputRow);

        this.listContainer = document.createElement('div');
        this.listContainer.classList.add('flex-column', 'full-width');
        this.content.appendChild(this.listContainer);

        this.loadTimers();
        this.startRefresh();
    }

    addTimer() {
        const label = this.labelInput.value || 'Timer';
        const days = parseInt(this.daysInput.value) || 0;
        const hours = parseInt(this.hoursInput.value) || 0;
        const mins = parseInt(this.minsInput.value) || 0;

        const totalMs = ((days * 24 * 60 * 60) + (hours * 60 * 60) + (mins * 60)) * 1000;
        if (totalMs <= 0) return;

        const endTime = Date.now() + totalMs;
        this.timers.push({ label, endTime, id: Date.now() });
        this.saveTimers();
        this.renderTimers();

        this.labelInput.value = '';
        this.daysInput.value = '';
        this.hoursInput.value = '';
        this.minsInput.value = '';
    }

    loadTimers() {
        this.timers = JSON.parse(localStorage.getItem(STORAGE.TIMERS) || '[]');
        this.renderTimers();
    }

    saveTimers() {
        localStorage.setItem(STORAGE.TIMERS, JSON.stringify(this.timers));
    }

    removeTimer(id) {
        this.timers = this.timers.filter(t => t.id !== id);
        this.saveTimers();
        this.renderTimers();
    }

    renderTimers() {
        this.listContainer.innerHTML = '';
        this.timers.forEach(timer => {
            const row = document.createElement('div');
            row.classList.add('flex-row', 'flex-space-between', 'full-width');
            row.style.borderBottom = '1px solid #eee';
            row.style.padding = '2px 0';

            const info = document.createElement('div');
            info.classList.add('flex-column');

            const label = document.createElement('strong');
            label.textContent = timer.label;
            info.appendChild(label);

            const countdown = document.createElement('span');
            countdown.className = 'timer-display';
            countdown.dataset.endTime = timer.endTime;
            countdown.title = `Ends at: ${new Date(timer.endTime).toLocaleString()}`;
            info.appendChild(countdown);

            row.appendChild(info);

            const delBtn = sidebar.addButton('X', () => this.removeTimer(timer.id), row, ['icon-btn']);
            delBtn.style.minWidth = '1.5rem';
            delBtn.style.height = '1.5rem';

            this.listContainer.appendChild(row);
        });
        this.updateDisplays();
    }

    startRefresh() {
        this.refreshInterval = setInterval(() => this.updateDisplays(), 1000);
    }

    updateDisplays() {
        const now = Date.now();
        let anyExpired = false;
        this.listContainer.querySelectorAll('.timer-display').forEach(el => {
            const endTime = parseInt(el.dataset.endTime);
            const diff = endTime - now;

            if (diff <= 0) {
                el.textContent = 'EXPIRED';
                el.style.color = 'red';
                anyExpired = true;
            } else {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                let timeStr = '';
                if (d > 0) timeStr += `${d}d `;
                timeStr += `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                el.textContent = timeStr;
            }
        });
        if (anyExpired) {
            this.header.classList.add('highlight');
        } else {
            this.header.classList.remove('highlight');
        }
    }
}

const settings = new Settings();
new TextTeasePageNavigation();
const metronome = new Metronome();
new EdgeCounter();
new RNG();
new Stopwatch()
new Notes();
new Timers();
settings.addSection();
sound.addOptions();
settings.addSectionContent();


window.pageData = pageData;
window.TEASE_TYPES = TEASE_TYPES;
window.sidebar = sidebar;

if (pageData.type !== TEASE_TYPES.none) {

    function disableRedirectOnSpacebar() {
        function isEditable(el) {
            return el && (
                el.tagName === 'INPUT' ||
                el.tagName === 'TEXTAREA' ||
                el.isContentEditable
            );
        }
        const handleKey = function(e) {
            if ((e.code === 'Space' || e.key === ' ' || e.keyCode === 32)) {
                const target = e.target;

                if (isEditable(target)) {
                    // Allow spacebar behavior inside inputs by manually dispatching
                    e.stopImmediatePropagation();
                    e.preventDefault();

                    // Create and dispatch a new event to simulate a space input
                    const evt = new InputEvent("input", {
                        bubbles: true,
                        cancelable: true,
                        inputType: "insertText",
                        data: " ",
                        dataTransfer: null
                    });

                    if (target.setRangeText) {
                        target.setRangeText(" ", target.selectionStart, target.selectionEnd, "end");
                        target.dispatchEvent(evt);
                    } else {
                        // Fallback for contenteditable
                        document.execCommand("insertText", false, " ");
                    }

                } else {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleKey, true);
        window.addEventListener('keypress', handleKey, true);
    }
    disableRedirectOnSpacebar();
}

function addCSS() {
    const style = document.createElement('style');
    style.textContent =  `
:root {
    --mv-primary: #00779b;
    --mv-bg: #f2cfcf;
    --mv-section-bg: #eebfb8;
    --mv-header-bg: #6671a3;
    --mv-text: #333333;
    --mv-text-muted: #666666;
    --mv-hover: #f5f5f5;
    --mv-shadow: 0 4px 12px rgba(0,0,0,0.1);
    --mv-btn-bg: #a36666;
    --mv-btn-text: #ffffff;
    --mv-input-bg: #f2cfcf;
    --mv-border: #cccccc;
}    
    
#mv-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;
    background: var(--mv-bg);
    border-right: 1px solid #ccc;
    transform: translateX(0);
    transition: transform 0.2s linear;
    z-index: 9999;
    overflow-y: auto;
    padding: .3rem;
    font-size: 13px;
}
.mv-sidebar-main-title {
    font-size: 1.3em;
    color: #6f1313;
    border-radius: 4px;
    padding: .1rem .5rem;
    font-weight: bold;
}
#mv-sidebar.collapsed {
    transform: translateX(-100%);
}

body.mv-sidebar-expanded {
    margin-left: 240px;
    width: calc(100% - 240px);
}
body.mv-sidebar-dynamic-tease-size #csl {
    width: calc(100% - 25px);
}

#mv-sidebar-toggle {
    position: fixed;
    left: .3rem;
    top: 25px;
    transform: translateY(-50%);
    z-index: 9999;
    display: none;
}

#mv-sidebar button,
.icon-btn  {
    min-width: 4rem;
    background-color: var(--mv-btn-bg);
    color: var(--mv-btn-text);
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 12px;
    transition: opacity 0.2s;
    margin: 2px;
}
#mv-sidebar .icon-btn,
.icon-btn {
    min-width: unset;
    padding: 2px 6px;
}
#mv-sidebar button:hover {
    opacity: 0.9;
}
#mv-sidebar button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
#mv-sidebar button:active {
    transform: translateY(1px);
}
#mv-sidebar input[type="text"],
#mv-sidebar input[type="number"],
#mv-sidebar textarea {
    background-color: var(--mv-input-bg);
    border: 1px solid var(--mv-btn-bg);
    border-radius: 4px;
    color: var(--mv-text);
    margin: 2px;
    accent-color: var(--mv-btn-bg);
}

#mv-sidebar input[type="checkbox"] {
    accent-color: var(--mv-btn-bg);
    cursor: pointer;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    margin: 4px;
}
#mv-sidebar input[type="range"] {
    accent-color: var(--mv-btn-bg);
    cursor: pointer;
}
#mv-sidebar textarea {
    width: 100%;
    min-height: 3rem;
    box-sizing: border-box;
}
.mv-sidebar-section-header {
    background: var(--mv-section-bg);
    padding: .3rem;
    border-radius: 4px;
}
.mv-sidebar-section-header:hover {
    background: var(--mv-bg);;
}
.mv-sidebar-section-content {
    display: flex;
    flex-wrap: wrap;
    padding: .5rem 0;
}
.flex-column {
    display: flex;
    flex-direction: column;
}
.flex-row {
    display: flex;
}
.full-width {
    width: 100%;
}
.flex-space-between {
    justify-content: space-between;
}
.text-small {
    font-size: 0.5rem;
}
.small-input {
    width: 3rem;
}
.auto-margin-height {
    margin: auto 0;
}
.mv-sidebar-section-header.highlight {
    background: #ffcccc;
    animation: pulse-red 2s infinite;
}
@keyframes pulse-red {
    0% { background-color: #ffcccc; }
    50% { background-color: #ff8888; }
    100% { background-color: #ffcccc; }
}
.rng-result {
    margin: auto;
    font-size: 1.2rem;
}
.width-100 {
    width: 100%;
}

`;
    document.head.appendChild(style);
}
addCSS();
