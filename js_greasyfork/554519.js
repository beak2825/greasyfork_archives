// ==UserScript==
// @name         Torn Radial MiniApps Library
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Mini applications for Torn Radial Menu (Calculator, Timers, Notes, API Monitor)
// @author       Sensimillia (2168012)
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CALCULATOR ====================
    class Calculator {
        constructor() {
            this.currentValue = '0';
            this.previousValue = null;
            this.operation = null;
        }

        handleInput(value) {
            if (value === 'C') {
                this.currentValue = '0';
                this.previousValue = null;
                this.operation = null;
            } else if (['+', '-', '*', '/', '%'].includes(value)) {
                if (this.previousValue !== null && this.operation !== null) {
                    this.calculate();
                }
                this.previousValue = parseFloat(this.currentValue);
                this.operation = value;
                this.currentValue = '0';
            } else if (value === '=') {
                this.calculate();
            } else if (value === '.') {
                if (!this.currentValue.includes('.')) {
                    this.currentValue += '.';
                }
            } else {
                if (this.currentValue === '0') {
                    this.currentValue = value;
                } else {
                    this.currentValue += value;
                }
            }
            return this.currentValue;
        }

        calculate() {
            if (this.previousValue === null || this.operation === null) return;
            
            const current = parseFloat(this.currentValue);
            const previous = this.previousValue;
            let result;

            switch(this.operation) {
                case '+':
                    result = previous + current;
                    break;
                case '-':
                    result = previous - current;
                    break;
                case '*':
                    result = previous * current;
                    break;
                case '/':
                    result = previous / current;
                    break;
                case '%':
                    result = (previous * current) / 100;
                    break;
            }

            this.currentValue = result.toString();
            this.previousValue = null;
            this.operation = null;
        }

        getCurrentValue() {
            return this.currentValue;
        }

        reset() {
            this.currentValue = '0';
            this.previousValue = null;
            this.operation = null;
        }
    }

    // ==================== TIMER MANAGER ====================
    class TimerManager {
        constructor() {
            this.timers = this.loadTimers();
        }

        loadTimers() {
            try {
                const stored = localStorage.getItem('tornRadialTimers');
                return stored ? JSON.parse(stored) : [];
            } catch(e) {
                console.error('Failed to load timers:', e);
                return [];
            }
        }

        saveTimers() {
            try {
                localStorage.setItem('tornRadialTimers', JSON.stringify(this.timers));
            } catch(e) {
                console.error('Failed to save timers:', e);
            }
        }

        addTimer(name, minutes) {
            const timer = {
                name: name,
                endTime: Date.now() + (minutes * 60000)
            };
            this.timers.push(timer);
            this.saveTimers();
            return timer;
        }

        removeTimer(index) {
            this.timers.splice(index, 1);
            this.saveTimers();
        }

        getTimers() {
            return this.timers;
        }

        updateTimers() {
            const completedTimers = [];
            this.timers = this.timers.filter(timer => {
                if (Date.now() >= timer.endTime) {
                    completedTimers.push(timer);
                    return false;
                }
                return true;
            });
            
            if (completedTimers.length > 0) {
                this.saveTimers();
            }
            
            return completedTimers;
        }

        getTimeRemaining(timer) {
            const remaining = Math.max(0, timer.endTime - Date.now());
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            return { minutes, seconds };
        }
    }

    // ==================== NOTES MANAGER ====================
    class NotesManager {
        constructor() {
            this.notes = this.loadNotes();
        }

        loadNotes() {
            try {
                return localStorage.getItem('tornRadialNotes') || '';
            } catch(e) {
                console.error('Failed to load notes:', e);
                return '';
            }
        }

        saveNotes(content) {
            try {
                localStorage.setItem('tornRadialNotes', content);
                this.notes = content;
                return true;
            } catch(e) {
                console.error('Failed to save notes:', e);
                return false;
            }
        }

        getNotes() {
            return this.notes;
        }

        clearNotes() {
            this.notes = '';
            try {
                localStorage.removeItem('tornRadialNotes');
                return true;
            } catch(e) {
                console.error('Failed to clear notes:', e);
                return false;
            }
        }
    }

    // ==================== API MONITOR ====================
    class APIMonitor {
        constructor(apiInstance) {
            this.api = apiInstance;
            this.lastData = null;
        }

        async fetchBars() {
            try {
                this.lastData = await this.api.getBars();
                return this.formatBarsData(this.lastData);
            } catch(e) {
                console.error('Failed to fetch API bars:', e);
                throw e;
            }
        }

        formatBarsData(data) {
            return {
                energy: {
                    current: data.energy.current,
                    max: data.energy.maximum,
                    percent: (data.energy.current / data.energy.maximum) * 100
                },
                nerve: {
                    current: data.nerve.current,
                    max: data.nerve.maximum,
                    percent: (data.nerve.current / data.nerve.maximum) * 100
                },
                happy: {
                    current: data.happy.current,
                    max: data.happy.maximum,
                    percent: (data.happy.current / data.happy.maximum) * 100
                },
                life: {
                    current: data.life.current,
                    max: data.life.maximum,
                    percent: (data.life.current / data.life.maximum) * 100
                }
            };
        }

        getLastData() {
            return this.lastData;
        }
    }

    // ==================== EXPORT ====================
    window.TornRadialMiniApps = {
        Calculator: Calculator,
        TimerManager: TimerManager,
        NotesManager: NotesManager,
        APIMonitor: APIMonitor
    };

})();