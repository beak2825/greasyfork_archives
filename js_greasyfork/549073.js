// ==UserScript==
// @name         Popmundo Scheduler
// @namespace    http://tampermonkey.net/
// @version      4.9.6
// @description  Agenda moderna e bonitinha para o popmundo.
// @author       Sua Mãe
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @license      MIT
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/549073/Popmundo%20Scheduler.user.js
// @updateURL https://update.greasyfork.org/scripts/549073/Popmundo%20Scheduler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PopmundoScheduler = {
        currentYear: null,
        currentMonth: null,
        EVENT_LIMIT_PER_DAY: 20,
        VISUAL_SLOTS_PER_DAY: 5,

        init() {
            const today = this.utils.getBrazilianDateInfo();
            this.currentYear = today.year;
            this.currentMonth = today.monthJS;
            this.injectStyles();
            this.createMenuButton();
            this.checkTodayEvents();
            this.setupNotificationHandler();
        },

        data: {
            getEvents(dateKey) { return GM_getValue(dateKey, []); },
            saveEvent(dateKey, eventData) { let events = this.getEvents(dateKey); if (events.length >= PopmundoScheduler.EVENT_LIMIT_PER_DAY) return false; events.push(eventData); GM_setValue(dateKey, events); return true; },
            editEvent(dateKey, index, newEventData) { let events = this.getEvents(dateKey); if (events[index]) { Object.assign(events[index], newEventData); GM_setValue(dateKey, events); } },
            deleteEvent(dateKey, eventIndex) { let events = this.getEvents(dateKey); events.splice(eventIndex, 1); if (events.length > 0) GM_setValue(dateKey, events); else GM_deleteValue(dateKey); },
            deleteSeries(uid) { GM_listValues().forEach(key => { let events = this.getEvents(key); const filteredEvents = events.filter(event => event.uid !== uid); if (filteredEvents.length < events.length) { if (filteredEvents.length > 0) GM_setValue(key, filteredEvents); else GM_deleteValue(key); } }); },
            toggleDone(dateKey, index) { let events = this.getEvents(dateKey); if (events[index]) { events[index].done = !events[index].done; GM_setValue(dateKey, events); } }
        },

        ui: {
            showCalendar() {
                Swal.fire({
                    title: 'Agenda de Eventos',
                    html: `
                        <div id="schedulerCalendarView">
                            <div class="calendar-controls"><button id="schedulerPrevMonth" class="scheduler-nav-button"><i class="fas fa-chevron-left"></i></button><span id="schedulerCalendarTitle"></span><button id="schedulerNextMonth" class="scheduler-nav-button"><i class="fas fa-chevron-right"></i></button></div>
                            <div id="schedulerCalendarContainer"></div>
                            <div class="scheduler-actions-footer"><button id="schedulerImport" class="scheduler-action-button" title="Importar eventos"><i class="fas fa-upload"></i> Importar</button><button id="schedulerExport" class="scheduler-action-button" title="Exportar eventos"><i class="fas fa-download"></i> Exportar</button></div>
                        </div>`,
                    width: '90%',
                    showConfirmButton: false,
                    showCloseButton: true,
                    didOpen: () => {
                        this.updateCalendarView();
                        const $popup = $('.swal2-popup');

                        if ($('#schedulerTooltip').length === 0) { $('body').append('<div id="schedulerTooltip"></div>'); }
                        const $tooltip = $('#schedulerTooltip');
                        let tooltipTimer;
                        // Usa .off().on() para evitar múltiplos listeners
                        $popup.off('mouseenter mouseleave', '.event-tag').on('mouseenter', '.event-tag', function() { clearTimeout(tooltipTimer); const $tag = $(this); const titleText = $tag.data('full-title'); if (titleText) { $tooltip.text(titleText); const tagRect = $tag[0].getBoundingClientRect(); $tooltip.css({ opacity: 1, top: (tagRect.top - $tooltip.outerHeight() - 8) + 'px', left: (tagRect.left + (tagRect.width / 2) - ($tooltip.outerWidth() / 2)) + 'px' }); } });
                        $popup.on('mouseleave', '.event-tag', function() { tooltipTimer = setTimeout(() => { $tooltip.css('opacity', 0); }, 100); });
                        $tooltip.off('mouseenter mouseleave').on('mouseenter', () => clearTimeout(tooltipTimer)).on('mouseleave', () => $tooltip.css('opacity', 0));
                        Swal.getPopup().addEventListener('close', () => { $tooltip.remove(); });

                        $popup.on('click', '#schedulerPrevMonth', () => PopmundoScheduler.changeMonth(-1));
                        $popup.on('click', '#schedulerNextMonth', () => PopmundoScheduler.changeMonth(1));
                        $popup.on('dblclick', '.calendar-day:not(.empty)', (e) => {
                            const dateKey = $(e.currentTarget).data('date');
                            Swal.close();
                            setTimeout(() => this.popups.add(dateKey), 200);
                        });
                        $popup.on('click', '.event-actions button', (e) => {
                            e.stopPropagation();
                            const button = $(e.currentTarget);
                            PopmundoScheduler.handleEventAction(button.data('action'), button.data('date'), parseInt(button.data('index'), 10), button.data('uid'));
                        });
                        $popup.on('click', '#schedulerImport', () => PopmundoScheduler.handleImport());
                        $popup.on('click', '#schedulerExport', () => PopmundoScheduler.handleExport());
                    }
                });
            },
            generateCalendar(year, month) {
                const daysInMonth = new Date(year, month + 1, 0).getDate(); const firstDay = new Date(year, month, 1).getDay(); const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; let html = '<div class="calendar-grid">'; daysOfWeek.forEach(day => html += `<div class="calendar-header">${day}</div>`); for (let i = 0; i < firstDay; i++) html += '<div class="calendar-day empty"></div>'; const todayKey = PopmundoScheduler.utils.getBrazilianDateInfo().key; for (let day = 1; day <= daysInMonth; day++) { const dateKey = `${year}-${month + 1}-${day}`; const isToday = (dateKey === todayKey) ? 'today' : ''; html += `<div class="calendar-day ${isToday}" data-date="${dateKey}"><div class="day-number">${day}</div><div class="events">${this.renderEventsHtml(dateKey)}</div></div>`; } html += '</div>'; return html;
            },
            renderEventsHtml(dateKey) {
                const events = PopmundoScheduler.data.getEvents(dateKey);
                let html = events.map((e, index) => {
                    let linkPart = e.description;
                    if (e.url) {
                        const finalUrl = PopmundoScheduler.utils.processPopmundoUrl(e.url);
                        // Links internos (processados para o servidor atual) abrem na mesma aba. Externos em nova aba.
                        const isInternal = finalUrl.startsWith(window.location.origin);
                        const target = isInternal ? '_self' : '_blank';
                        linkPart = `<a href="${finalUrl}" target="${target}" rel="noopener noreferrer" class="event-link">${e.description}</a>`;
                    }
                    const eventLabel = e.time ? `<strong>${e.time}</strong> - ${linkPart}` : linkPart;
                    const fullTitle = `${e.time ? e.time + ' - ' : ''}${e.description}`;
                    return `<div class="event-tag ${e.done ? 'done' : ''}" data-full-title="${fullTitle}"><span class="event-text">${eventLabel}</span><div class="event-actions"><button data-action="toggle-done" data-date="${dateKey}" data-index="${index}"><i class="fas fa-check"></i></button><button data-action="edit" data-date="${dateKey}" data-index="${index}"><i class="fas fa-pencil-alt"></i></button><button data-action="delete" data-date="${dateKey}" data-index="${index}" data-uid="${e.uid}"><i class="fas fa-trash-alt"></i></button></div></div>`;
                }).join('');
                const remainingSlots = PopmundoScheduler.VISUAL_SLOTS_PER_DAY - events.length;
                if (remainingSlots > 0 && events.length < PopmundoScheduler.VISUAL_SLOTS_PER_DAY) {
                    for (let i = 0; i < remainingSlots; i++) { html += '<div class="event-placeholder"></div>'; }
                }
                return html;
            },
            updateDayView(dateKey) { $(`.calendar-day[data-date="${dateKey}"] .events`).html(this.renderEventsHtml(dateKey)); },
            updateCalendarView() {
                const { currentYear, currentMonth } = PopmundoScheduler; const date = new Date(currentYear, currentMonth); const monthName = date.toLocaleString('pt-BR', { month: 'long' }); const year = date.toLocaleString('pt-BR', { year: 'numeric' }); const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1); const title = `${capitalizedMonth} de ${year}`; $('#schedulerCalendarTitle').text(title); $('#schedulerCalendarContainer').html(this.generateCalendar(currentYear, currentMonth));
            },
            popups: {
                add(dateKey) {
                    Swal.fire({
                        title: `🗓️ Adicionar Evento`, html: this.getEventFormHtml(), width: '550px', showCancelButton: true,
                        cancelButtonText: '<i class="fas fa-arrow-left"></i> Voltar', confirmButtonText: '<i class="fas fa-save"></i> Salvar',
                        didOpen: () => { $('#isRecurring').on('change', () => $('#recurringOptions').slideToggle(250)); },
                        preConfirm: () => { return this.processFormData(); }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const formData = result.value;
                            if (formData === false || formData === null) {
                                setTimeout(() => Swal.fire('Erro', formData === false ? 'O texto do evento é obrigatório.' : 'Intervalo de repetição inválido.', 'error'), 200);
                            } else {
                                const uid = PopmundoScheduler.utils.generateUID();
                                const eventDetails = { ...formData, uid, done: false };
                                let success = true;
                                if (formData.isRecurring) { PopmundoScheduler.scheduleRecurringEvents(dateKey, eventDetails, formData.interval, formData.endDate); }
                                else { success = PopmundoScheduler.data.saveEvent(dateKey, eventDetails); }
                                if (!success) { setTimeout(() => { Swal.fire('Limite atingido', `Máximo de ${PopmundoScheduler.EVENT_LIMIT_PER_DAY} eventos por dia.`, 'warning'); }, 200); }
                            }
                        }
                        PopmundoScheduler.ui.showCalendar();
                    });
                },
                edit(dateKey, index, eventData) {
                    Swal.fire({
                        title: '✏️ Editar Evento', html: this.getEventFormHtml(eventData, true), showCancelButton: true,
                        confirmButtonText: '<i class="fas fa-save"></i> Salvar', width: '550px',
                        preConfirm: () => {
                           const data = this.processFormData(true);
                           if (!data) { Swal.showValidationMessage('O texto do evento é obrigatório.'); }
                           return data;
                        }
                    }).then(result => {
                        if (result.isConfirmed) { PopmundoScheduler.data.editEvent(dateKey, index, result.value); }
                        PopmundoScheduler.ui.showCalendar();
                    });
                },
                getEventFormHtml(event = {}, isEdit = false) {
                     return `
                        <div class="scheduler-form-wrapper">
                            <div class="event-form">
                                <div class="form-group"><label><i class="fas fa-pencil-alt fa-fw"></i> Evento</label><input type="text" id="eventDescription" class="swal2-input" placeholder="Ex: Casamento" maxlength="100" value="${event.description || ''}"></div>
                                <div class="form-group"><label><i class="fas fa-link fa-fw"></i> Link</label><input type="url" id="eventUrl" class="swal2-input" placeholder="https://... ou /Character/View/1234" value="${event.url || ''}"></div>
                                <div class="form-group"><label><i class="fas fa-clock fa-fw"></i> Horário</label><input type="time" id="eventTime" class="swal2-input" value="${event.time || ''}"></div>
                                ${!event.uid ? `<div class="recurring-toggle-row"><label><input type="checkbox" id="isRecurring" class="swal2-checkbox"> Evento recorrente?</label></div>
                                <div id="recurringOptions" style="display:none;"><div class="form-group"><label><i class="fas fa-repeat fa-fw"></i> Repetir</label><input type="number" id="recurringInterval" class="swal2-input" min="1" value="7"></div><div class="form-group"><label><i class="fas fa-calendar-times fa-fw"></i> Até</label><input type="date" id="endDate" class="swal2-input"></div></div>` : ''}
                            </div>
                        </div>`;
                },
                processFormData(isEdit = false) {
                    const popup = Swal.getPopup(); const desc = popup.querySelector('#eventDescription').value; if (!desc) return false; const eventData = { description: desc, url: popup.querySelector('#eventUrl').value, time: popup.querySelector('#eventTime').value }; if (!isEdit) { const isRecurring = popup.querySelector('#isRecurring').checked; const interval = parseInt(popup.querySelector('#recurringInterval').value, 10); if (isRecurring && (!interval || interval <= 0)) return null; eventData.isRecurring = isRecurring; eventData.interval = interval; eventData.endDate = popup.querySelector('#endDate').value; } return eventData;
                }
            }
        },

        handleEventAction(action, dateKey, index, uid) {
            const event = this.data.getEvents(dateKey)[index];
            switch (action) {
                case 'toggle-done': this.data.toggleDone(dateKey, index); this.ui.updateDayView(dateKey); break;
                case 'edit': $('#schedulerTooltip').remove(); Swal.close(); setTimeout(() => this.ui.popups.edit(dateKey, index, event), 200); break;
                case 'delete': $('#schedulerTooltip').remove(); this.handleDelete(dateKey, index, uid); break;
            }
        },
        handleDelete(dateKey, index, uid) { Swal.fire({ title: 'Remover Evento?', icon: 'warning', showCancelButton: true, showDenyButton: true, confirmButtonText: 'Apenas este', denyButtonText: `Toda a série` }).then((result) => { if (result.isConfirmed) { this.data.deleteEvent(dateKey, index); this.ui.updateDayView(dateKey); } else if (result.isDenied) { this.data.deleteSeries(uid); this.ui.updateCalendarView(); } }); },
        handleExport: function() { const allData = {}; const keys = GM_listValues(); if (keys.length === 0) { Swal.fire('Nada para Exportar', 'Sua agenda está vazia.', 'info'); return; } keys.forEach(key => { allData[key] = this.data.getEvents(key); }); const jsonString = JSON.stringify(allData, null, 2); const blob = new Blob([jsonString], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `popmundo_scheduler_backup_${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); },
        handleImport: function() { const input = document.createElement('input'); input.type = 'file'; input.accept = '.json,application/json'; input.onchange = e => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = event => { try { const jsonData = JSON.parse(event.target.result); if (typeof jsonData !== 'object' || jsonData === null) throw new Error('Formato de JSON inválido.'); Swal.fire({ title: 'Importar Eventos', text: 'Como você deseja importar os eventos?', icon: 'question', showDenyButton: true, showCancelButton: true, confirmButtonText: '<i class="fas fa-plus-circle"></i> Mesclar', denyButtonText: '<i class="fas fa-exclamation-triangle"></i> Substituir Tudo', cancelButtonText: 'Cancelar' }).then((result) => { if (result.isConfirmed) this.processImport(jsonData, 'merge'); else if (result.isDenied) this.processImport(jsonData, 'replace'); }); } catch (error) { Swal.fire('Erro na Importação', `Não foi possível ler o arquivo. Erro: ${error.message}`, 'error'); } }; reader.readAsText(file); }; input.click(); },
        processImport: function(jsonData, mode) { if (mode === 'replace') { GM_listValues().forEach(key => GM_deleteValue(key)); } let importedCount = 0; Object.keys(jsonData).forEach(dateKey => { const newEvents = jsonData[dateKey]; if (Array.isArray(newEvents)) { let existingEvents = mode === 'merge' ? this.data.getEvents(dateKey) : []; let combinedEvents = [...existingEvents]; newEvents.forEach(newEvent => { if (mode !== 'merge' || !existingEvents.some(e => e.uid === newEvent.uid)) { combinedEvents.push(newEvent); importedCount++; } }); if (combinedEvents.length > PopmundoScheduler.EVENT_LIMIT_PER_DAY) { combinedEvents = combinedEvents.slice(0, PopmundoScheduler.EVENT_LIMIT_PER_DAY); } if (combinedEvents.length > 0) GM_setValue(dateKey, combinedEvents); } }); Swal.fire('Importação Concluída', `${importedCount} eventos foram importados no modo "${mode === 'merge' ? 'Mesclar' : 'Substituir'}".`, 'success'); this.ui.updateCalendarView(); },
        scheduleRecurringEvents: function(startDateKey, eventData, interval, endDate) { let [year, month, day] = startDateKey.split('-').map(Number); let currentDate = new Date(year, month - 1, day); let limitDate = endDate ? new Date(endDate) : new Date(currentDate.getFullYear() + 2, 11, 31); while (currentDate <= limitDate) { let currentKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`; this.data.saveEvent(currentKey, { ...eventData }); currentDate.setDate(currentDate.getDate() + interval); } },
        checkTodayEvents: function() {
            const todayKey = this.utils.getBrazilianDateInfo().key;
            const events = this.data.getEvents(todayKey).filter(event => !event.done);
            if (events.length > 0) {
                $('#notifications .notification-none').remove();
                events.forEach((event) => {
                    const originalIndex = this.data.getEvents(todayKey).findIndex(e => e.uid === event.uid);
                    let eventText = event.time ? `${event.time} - ${event.description}` : event.description;
                    const notificationHTML = `<div class="notification-real notification-normal scheduler-notification-item"><span>Atenção! Agenda de hoje: ${eventText}</span><button class="scheduler-mark-done-btn" data-index="${originalIndex}"><i class="fas fa-check"></i></button></div>`;
                    $('#notifications').append(notificationHTML);
                });
            }
        },
        setupNotificationHandler: function() {
            $('#notifications').on('click', '.scheduler-mark-done-btn', (e) => {
                const button = $(e.currentTarget);
                const index = button.data('index');
                const todayKey = this.utils.getBrazilianDateInfo().key;
                this.data.toggleDone(todayKey, index);
                const notificationItem = button.closest('.scheduler-notification-item');
                notificationItem.addClass('scheduler-notification-done');
                button.remove();
                setTimeout(() => {
                    notificationItem.remove();
                    if ($('#notifications .notification-real').length === 0) {
                        $('#notifications').append('<div class="notification-none">Nenhuma nova informação para exibir.</div>');
                    }
                }, 300);
            });
        },
        createMenuButton: function() { let careerMenu = $('div.menu ul').eq(1); if (careerMenu.length) { let newMenuItem = $('<li><a href="#" id="openScheduler">Agenda</a></li>'); careerMenu.prepend(newMenuItem); newMenuItem.on('click', (e) => { e.preventDefault(); this.ui.showCalendar(); }); } },
        utils: {
            getBrazilianDateInfo: function() { const now = new Date(); const options = { timeZone: 'America/Sao_Paulo' }; const year = parseInt(now.toLocaleString('en-US', { ...options, year: 'numeric' }), 10); const month = parseInt(now.toLocaleString('en-US', { ...options, month: 'numeric' }), 10); const day = parseInt(now.toLocaleString('en-US', { ...options, day: 'numeric' }), 10); return { year, monthJS: month - 1, day, key: `${year}-${month}-${day}` }; },
            generateUID: function() { return Math.random().toString(36).substring(2, 11); },
            /**
             * Processa uma URL para garantir que links do Popmundo (de qualquer servidor)
             * sejam convertidos para o servidor atual do usuário, evitando problemas de sessão.
             * Links externos são mantidos como estão.
             * @param {string} url - A URL a ser processada.
             * @returns {string} A URL processada.
             */
            processPopmundoUrl: function(url) {
                if (!url || typeof url !== 'string') return url;
                try {
                    // Se for um link de qualquer servidor do Popmundo...
                    if (url.includes('.popmundo.com/')) {
                        const urlObject = new URL(url);
                        // ...reescreve usando a origem do servidor atual.
                        return window.location.origin + urlObject.pathname + urlObject.search + urlObject.hash;
                    }
                    // Se for um link relativo (começa com '/')...
                    if (url.startsWith('/')) {
                        // ...completa com a origem do servidor atual.
                        return window.location.origin + url;
                    }
                } catch (e) {
                    // Se houver um erro (ex: URL mal formada), retorna a original para não quebrar.
                    console.warn("PopmundoScheduler: URL inválida ou relativa detectada:", url);
                    return url;
                }
                // Se não for um link do Popmundo nem relativo, é um link externo. Retorna como está.
                return url;
            }
        },
        changeMonth: function(direction) { this.currentMonth += direction; if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; } else if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; } this.ui.updateCalendarView(); },

        injectStyles() {
            GM_addStyle(`
                :root { --scheduler-bg: #2d3748; --scheduler-border: #4a5568; --day-bg: #4a5568; --day-hover-bg: #718096; --today-bg: #4c51bf; --text-color: #e2e8f0; --text-light: #a0aec0; --primary-color: #667eea; --primary-text: #ffffff; --done-color: #718096; --done-text: #1a202c; --accent-color: #f6e05e; --shadow: 0 4px 6px rgba(0, 0, 0, 0.4); --border-radius: 8px; }
                .swal2-popup { transition: width 0.3s ease; background-color: var(--scheduler-bg) !important; color: var(--text-color) !important; border-radius: var(--border-radius) !important; }
                .swal2-title { color: var(--text-color) !important; } .swal2-html-container { margin: 1em 0 0 !important; } .swal2-close:focus { box-shadow: none !important; }
                .calendar-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 10px; }
                #schedulerCalendarTitle { font-size: 1.5em; font-weight: 600; color: var(--text-color); }
                .calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; }
                .calendar-header { text-align: center; font-weight: 600; padding: 10px 5px; color: var(--text-light); }
                .calendar-day { background-color: var(--day-bg); border: 1px solid var(--scheduler-border); border-radius: var(--border-radius); cursor: pointer; height: 140px; display: flex; flex-direction: column; transition: all 0.2s ease; }
                .calendar-day:not(.empty):hover { background-color: var(--day-hover-bg); transform: translateY(-2px); box-shadow: var(--shadow); }
                .calendar-day.empty { background-color: transparent; border: none; cursor: default; } .calendar-day.today { background-color: var(--today-bg); border-color: var(--primary-color); }
                .day-number { padding: 8px; font-weight: 600; align-self: flex-start; color: var(--text-color); } .calendar-day.today .day-number { color: var(--accent-color); }
                .events { flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding: 0 6px 6px; }
                .events::-webkit-scrollbar { width: 5px; } .events::-webkit-scrollbar-thumb { background: #718096; border-radius: 10px; }
                .event-tag { background-color: var(--primary-color); color: var(--primary-text); padding: 4px 8px; border-radius: 6px; font-size: 12px; text-align: left; display: flex; align-items: center; justify-content: space-between; transition: opacity 0.2s ease; height: 23px; box-sizing: border-box; }
                .event-tag.done { background-color: var(--done-color); color: var(--done-text); text-decoration: line-through; opacity: 0.7; }
                .event-text { flex-grow: 1; margin-right: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .event-actions { display: flex; align-items: center; flex-shrink: 0; opacity: 0; transition: opacity 0.2s ease; }
                .event-tag:hover .event-actions { opacity: 1; }
                .event-actions button { background: none; border: none; color: var(--primary-text); cursor: pointer; padding: 0 3px; font-size: 12px; transition: transform 0.2s ease; }
                .event-tag.done .event-actions button { color: var(--done-text); } .event-actions button:hover { transform: scale(1.3); }
                .event-link { color: inherit !important; text-decoration: underline !important; font-weight: 600; } .event-link:hover { color: var(--accent-color) !important; }
                .scheduler-form-wrapper { max-width: 500px; margin: 0 auto; text-align: left; }
                .event-form { display: flex; flex-direction: column; gap: 15px; } .form-group { display: flex; flex-direction: column; }
                .form-group label { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; font-weight: 500; color: var(--text-light); }
                .swal2-input, .swal2-checkbox { background-color: var(--day-bg) !important; color: var(--text-color) !important; border: 1px solid var(--scheduler-border) !important; }
                .scheduler-actions-footer { display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--scheduler-border); }
                .scheduler-action-button { background-color: var(--day-bg); color: var(--text-light); border: 1px solid var(--scheduler-border); padding: 8px 15px; border-radius: var(--border-radius); cursor: pointer; font-weight: 600; transition: all 0.2s ease; text-decoration: none !important; display: inline-flex; align-items: center; gap: 8px;}
                .scheduler-action-button:hover { background-color: var(--day-hover-bg); color: var(--text-color); border-color: var(--primary-color); }
                .swal2-confirm, .swal2-cancel { gap: 8px; }
                .scheduler-notification-item { display: flex; justify-content: center; align-items: center; position: relative; padding: 0 45px; box-sizing: border-box; transition: all 0.3s ease-out; overflow: hidden; }
                .scheduler-mark-done-btn { background: rgba(0, 0, 0, 0.2); color: var(--text-color); border: none; border-radius: 5px; cursor: pointer; padding: 3px 8px; transition: background-color 0.2s; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); }
                .scheduler-mark-done-btn:hover { background: rgba(0, 0, 0, 0.4); }
                .scheduler-notification-item.scheduler-notification-done { opacity: 0; height: 0; padding-top: 0; padding-bottom: 0; margin-bottom: -1px; border: none; }
                .notification-none { text-align: center; padding: 10px; }
                .event-placeholder { background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; height: 23px; box-sizing: border-box; }
                #schedulerTooltip { position: fixed; background-color: var(--scheduler-bg); color: var(--text-color); border: 1px solid var(--primary-color); padding: 8px 12px; border-radius: var(--border-radius); box-shadow: var(--shadow); z-index: 10000; font-size: 13px; max-width: 300px; text-align: center; pointer-events: none; opacity: 0; transition: opacity 0.2s ease-out; white-space: normal; word-wrap: break-word; }
                #schedulerTooltip::after { content: ''; position: absolute; top: 100%; left: 50%; margin-left: -6px; border-width: 6px; border-style: solid; border-color: var(--primary-color) transparent transparent transparent; }
            `);
        }
    };

    $(document).ready(() => {
        PopmundoScheduler.init();
    });

})();
