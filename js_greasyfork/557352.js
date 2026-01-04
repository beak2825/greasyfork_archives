// ==UserScript==
// @name         Prepara Moon
// @namespace    http://violetmonkey.scripts/
// @version      18.1
// @description  Plataforma Prepara SP
// @author       hackermoon & Mpon Scripts™
// @match        https://preparasp.jovensgenios.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      ecs-em-graphql-api.jovensgenios.com
// @connect      preparasp.jovensgenios.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557352/Prepara%20Moon.user.js
// @updateURL https://update.greasyfork.org/scripts/557352/Prepara%20Moon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getIcon(name, size = 16, color = '#ffffff') {
        const icons = {
            moon: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
            book: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
            calendar: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
            target: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
            chevronLeft: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
            chevronRight: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
            folder: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
            fileText: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
            zap: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
            settings: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 9.96l4.24 4.24m12.44 0l4.24 4.24M1.54 14.04l4.24-4.24"></path></svg>`,
            check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
            x: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            info: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
            play: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
            clock: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
            minus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
            plus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
            messageSquare: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
            externalLink: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
        };
        return icons[name] || '';
    }

    GM_addStyle(`
        #auto-panel {
            position: fixed;
            top: 15px;
            right: 15px;
            width: 260px;
            max-height: 80vh;
            background: linear-gradient(145deg, #2a1a3a, #0f0f1a);
            border: 1px solid #4a3a6a;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #e0e0e0;
            display: flex;
            flex-direction: column;
            transform: translateX(300px);
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        #auto-panel.visible {
            transform: translateX(0);
        }
        .panel-header {
            background: linear-gradient(90deg, #4a3a6a, #3a2a5a);
            color: #ffffff;
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 10px 10px 0 0;
            cursor: move;
            border-bottom: 1px solid #5a4a7a;
            flex-shrink: 0;
        }
        .panel-header h2 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .panel-header h2 svg { fill: #ffffff; }
        .header-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .credits-dropdown {
            position: relative;
        }
        .credits-btn {
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            padding: 2px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .credits-btn:hover { background: rgba(255,255,255,0.1); }
        .credits-content {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            background-color: #2a1a3a;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.4);
            z-index: 1;
            border-radius: 6px;
            border: 1px solid #4a3a6a;
            padding: 8px;
            margin-top: 5px;
        }
        .credits-content a {
            color: #a8c8f8;
            padding: 6px 8px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 6px;
            border-radius: 4px;
            transition: background 0.2s;
            font-size: 12px;
        }
        .credits-content a:hover { background: rgba(255,255,255,0.1); }
        .credits-content svg { fill: #a8c8f8; }
        .credits-dropdown:hover .credits-content { display: block; }
        #toggle-btn {
            background: none;
            border: none;
            color: #ffffff;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s, background 0.2s;
        }
        #toggle-btn:hover { background: rgba(255,255,255,0.1); }
        #toggle-btn svg { transition: transform 0.3s; }
        #auto-panel:not(.visible) #toggle-btn svg { transform: rotate(180deg); }
        .panel-content {
            padding: 12px;
            overflow-y: auto;
            flex-grow: 1;
        }
        #status {
            font-size: 11px;
            color: #b0b0b0;
            margin-bottom: 8px;
            padding: 6px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 5px;
            text-align: center;
            border: 1px solid transparent;
            transition: border-color 0.3s;
        }
        #status.ready { border-color: #4caf50; }
        #status.error { border-color: #f44336; }
        #status span { font-weight: bold; }
        #breadcrumb {
            font-size: 10px;
            color: #9a9a9a;
            margin-bottom: 10px;
            padding: 6px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 5px;
            border-left: 3px solid #6a4a8a;
            transition: border-left-color 0.3s;
        }
        .section {
            margin: 12px 0;
        }
        select, button, input[type="number"] {
            width: 100%;
            padding: 8px;
            margin: 4px 0;
            border: 1px solid #5a3a7a;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.08);
            color: #ffffff;
            font-size: 12px;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s, transform 0.1s, box-shadow 0.2s;
        }
        select:hover, button:hover, input[type="number"]:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: #7a5a9a;
        }
        select:focus, button:focus, input[type="number"]:focus {
            outline: none;
            border-color: #9a7aba;
            box-shadow: 0 0 0 2px rgba(154, 122, 186, 0.2);
        }
        button:active { transform: scale(0.98); }
        select option { background: #2a1a3a; color: #e0e0e0; }
        button {
            background: linear-gradient(90deg, #6a4a8a, #4a2a6a);
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        button:disabled {
            background: #4a4a4a;
            cursor: not-allowed;
            opacity: 0.6;
        }
        #back-btn {
            background: linear-gradient(90deg, #b8751f, #8b5a00);
        }
        #assessments-config {
            display: none;
            margin-top: 12px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            border: 1px solid #5a3a7a;
        }
        #assessments-config div { margin-bottom: 6px; }
        #assessments-config label {
            font-size: 11px;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }
        #assessments-config input[type="number"] {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid #6a4a8a;
            color: #ffffff;
            padding: 4px;
            border-radius: 4px;
            width: 50px;
            font-size: 11px;
        }
        #assessments-config .info-text {
            font-size: 9px;
            color: #888;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        #moon-float-icon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            background: linear-gradient(145deg, #4a3a6a, #2a1a3a);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        #moon-float-icon:hover {
            transform: scale(1.1);
            box-shadow: 0 8px 20px rgba(0,0,0,0.5);
        }
        #moon-float-icon svg {
            fill: #ffffff;
            animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }
        #toast-container {
            position: fixed;
            bottom: 75px;
            right: 20px;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: flex-end;
        }
        .toast {
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 200px;
            max-width: 300px;
            font-size: 11px;
            opacity: 0;
            transform: translateX(100%);
            transition: opacity 0.3s, transform 0.3s;
        }
        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }
        .toast svg { flex-shrink: 0; }
        .toast.success { background: #4caf50; }
        .toast.error { background: #f44336; }
        .toast.info { background: #2196f3; }
        .toast.pending { background: #ff9800; }
        .toast.assessment { background: #9c27b0; }
        .toast.question { background: #ffeb3b; color: #333; }
    `);

    let bearerToken = null;
    let userInfo = { id: null, name: null };
    const API_URL = "https://ecs-em-graphql-api.jovensgenios.com/graphql";
    let scheduleCache, topicsCache, allAssessmentsCache;
    
    let navigationState = {
        level: 'type',
        currentSubject: null,
        currentTopic: null,
        currentSubtopic: null,
        currentAssessment: null
    };

    // --- SISTEMA DE NOTIFICAÇÕES OTIMIZADO ---
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);

    const MAX_VISIBLE_TOASTS = 3;
    let toastQueue = [];
    let activeToasts = [];
    let progressToast = null; // Para notificações de progresso

    function processQueue() {
        if (toastQueue.length === 0 || activeToasts.length >= MAX_VISIBLE_TOASTS) {
            return;
        }
        const toastData = toastQueue.shift();
        showToastElement(toastData.message, toastData.type, toastData.duration);
    }

    function showToastElement(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '';
        switch(type) {
            case 'success': icon = getIcon('check', 16); break;
            case 'error': icon = getIcon('x', 16); break;
            case 'info': icon = getIcon('info', 16); break;
            case 'pending': icon = getIcon('clock', 16); break;
            case 'assessment': icon = getIcon('target', 16); break;
            case 'question': icon = getIcon('fileText', 16); break;
        }
        
        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);
        activeToasts.push(toast);

        toast.offsetHeight; // Força reflow
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                activeToasts = activeToasts.filter(t => t !== toast);
                processQueue(); // Processa a próxima da fila
            }, 300);
        }, duration);
    }

    function showToast(message, type = 'info', duration = 3000) {
        // Se for uma notificação de progresso, atualiza a existente
        if (type === 'pending' || type === 'question') {
            if (progressToast) {
                progressToast.querySelector('span').textContent = message;
                return;
            } else {
                progressToast = { message, type, duration };
                toastQueue.push(progressToast);
            }
        } else {
            // Notificações de progresso são limpas quando uma de sucesso/erro aparece
            progressToast = null;
            toastQueue.push({ message, type, duration });
        }
        processQueue();
    }

    function log(msg, type = 'info') {
        showToast(msg, type);
    }

    function setStatus(msg, isReady = false) {
        const statusEl = document.getElementById('status');
        statusEl.innerHTML = `Status: <span style="color: ${isReady ? '#4caf50' : '#f44336'}">${msg}</span>`;
        statusEl.className = isReady ? 'ready' : 'error';
    }

    function updateBreadcrumb() {
        const breadcrumbEl = document.getElementById('breadcrumb');
        let path = `${getIcon('target', 14)} `;
        
        switch(navigationState.level) {
            case 'type': path += 'Selecione o tipo'; break;
            case 'subject': path += 'Selecione a matéria'; break;
            case 'topic': path += `${navigationState.currentSubject.name} → Selecione o tópico`; break;
            case 'subtopic': path += `${navigationState.currentSubject.name} → ${navigationState.currentTopic.name} → Selecione o subtópico`; break;
            case 'assessments': path += `${navigationState.currentSubject?.name || 'Simulados'} → Selecione o simulado`; break;
            case 'processing':
                if (navigationState.currentAssessment) {
                    path += `Simulado: ${navigationState.currentAssessment.name} → Processando...`;
                } else {
                    path += `${navigationState.currentSubject.name} → ${navigationState.currentTopic.name} → ${navigationState.currentSubtopic.name} → Processando...`;
                }
                break;
        }
        
        breadcrumbEl.innerHTML = path;
    }

    async function apiCall(query, variables) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST", url: API_URL,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${bearerToken}` },
                data: JSON.stringify({ query, variables }),
                onload: res => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.errors) { reject(data.errors[0].message); }
                        else { resolve(data.data); }
                    } catch (e) { reject(`Erro ao parsear resposta: ${e.message}`); }
                },
                onerror: err => reject(`Erro de rede: ${err}`)
            });
        });
    }

    async function isSubtopicCompleted(subtopicId) {
        try {
            const data = await apiCall(`
                query GetTopicContentRounds($topicsWhere: TopicWhere, $reportWhere: ContentRoundReportWhere, $options: ContentRoundReportOptions) {
                    topics(where: $topicsWhere) { contentRounds { report(where: $reportWhere, options: $options) { isContentRoundCompleted } } }
                }
            `, { topicsWhere: { id: subtopicId }, reportWhere: { user: { id: userInfo.id } }, options: { sort: [{ createdAt: "ASC" }] } });
            if (!data.topics || data.topics.length === 0) return false;
            const rounds = data.topics[0].contentRounds;
            return rounds.every(round => round.report && round.report.length > 0 && round.report[0].isContentRoundCompleted);
        } catch (error) {
            log(`Erro ao verificar completude: ${error}`, 'error');
            return false;
        }
    }

    async function loadRecommendedAssessments() {
        try {
            log("Carregando simulados recomendados...", "info");
            const data = await apiCall(`
                query RecommendAssessments(
                    $where: UserWhere,
                    $recommendAssessmentsWhere1: AssessmentWhere,
                    $recommendAssessmentsWhere2: AssessmentWhere,
                    $recommendAssessmentsWhere3: AssessmentWhere,
                    $recommendAssessmentsWhere4: AssessmentWhere,
                    $assessmentReportsWhere2: AssessmentReportWhere,
                    $options: AssessmentOptions
                ) {
                    users(where: $where) {
                        humanas: recommendAssessments(where: $recommendAssessmentsWhere1, options: $options) { id name endDate area assessmentReports(where: $assessmentReportsWhere2) { contentRound { id report { id isContentRoundCompleted contentsToComplete contentsCompletedAggregate { count } } } } }
                        matematica: recommendAssessments(where: $recommendAssessmentsWhere2, options: $options) { id name endDate area assessmentReports(where: $assessmentReportsWhere2) { contentRound { id report { id isContentRoundCompleted contentsToComplete contentsCompletedAggregate { count } } } } }
                        linguagens: recommendAssessments(where: $recommendAssessmentsWhere3, options: $options) { id name endDate area assessmentReports(where: $assessmentReportsWhere2) { contentRound { id report { id isContentRoundCompleted contentsToComplete contentsCompletedAggregate { count } } } } }
                        natureza: recommendAssessments(where: $recommendAssessmentsWhere4, options: $options) { id name endDate area assessmentReports(where: $assessmentReportsWhere2) { contentRound { id report { id isContentRoundCompleted contentsToComplete contentsCompletedAggregate { count } } } } }
                    }
                }
            `, {
                where: { id: userInfo.id },
                recommendAssessmentsWhere1: { area: "Ciências Humanas e suas Tecnologias", visible: true },
                recommendAssessmentsWhere2: { area: "Matemática e suas Tecnologias", visible: true },
                recommendAssessmentsWhere3: { area: "Linguagens, Códigos e suas Tecnologias", visible: true },
                recommendAssessmentsWhere4: { area: "Ciências da Natureza e suas Tecnologias", visible: true },
                assessmentReportsWhere2: { user: { id: userInfo.id } },
                options: { limit: 1, sort: [{ order: "DESC" }] }
            });
            const recommendedAssessments = [...data.users[0].humanas, ...data.users[0].matematica, ...data.users[0].linguagens, ...data.users[0].natureza];
            allAssessmentsCache = recommendedAssessments;
            log(`${recommendedAssessments.length} simulados recomendados carregados`, "success");
            return recommendedAssessments;
        } catch (error) {
            log(`Erro ao carregar simulados: ${error}`, "error");
            return [];
        }
    }

    async function registerUserInAssessment(assessmentId) {
        try {
            log("Registrando usuário no simulado...", "info");
            const result = await apiCall(`
                mutation RegisterUserInAssessment($userId: ID!, $assessmentId: ID!) { registerUserInAssessment(userId: $userId, assessmentId: $assessmentId) }
            `, { userId: userInfo.id, assessmentId: assessmentId });
            log("Usuário registrado com sucesso no simulado", "success");
            return { success: true, data: result };
        } catch (error) {
            log(`Erro ao registrar usuário: ${error}`, "error");
            return { success: false, error };
        }
    }

    async function initializeAssessment(assessmentId, assessmentName) {
        try {
            log(`Iniciando simulado: ${assessmentName}`, "info");
            const assessmentData = await apiCall(`
                query GetUserAssessmentReport($where: AssessmentWhere, $assessmentReportsWhere2: AssessmentReportWhere) {
                    assessments(where: $where) { name assessmentReports(where: $assessmentReportsWhere2) { contentRound { id report { id isContentRoundCompleted } } } }
                }
            `, { where: { id: assessmentId }, assessmentReportsWhere2: { user: { id: userInfo.id } } });
            const assessment = assessmentData.assessments[0];
            if (!assessment.assessmentReports || assessment.assessmentReports.length === 0) {
                log("Simulado não iniciado, registrando usuário...", "info");
                const registration = await registerUserInAssessment(assessmentId);
                if (!registration.success) throw new Error('Falha ao registrar usuário no simulado');
                await new Promise(r => setTimeout(r, 2000));
                const updatedAssessmentData = await apiCall(`
                    query GetUserAssessmentReport($where: AssessmentWhere, $assessmentReportsWhere2: AssessmentReportWhere) {
                        assessments(where: $where) { name assessmentReports(where: $assessmentReportsWhere2) { contentRound { id report { id isContentRoundCompleted } } } }
                    }
                `, { where: { id: assessmentId }, assessmentReportsWhere2: { user: { id: userInfo.id } } });
                const updatedAssessment = updatedAssessmentData.assessments[0];
                if (!updatedAssessment.assessmentReports || updatedAssessment.assessmentReports.length === 0) throw new Error('Não foi possível criar o contentRound após o registro');
                const contentRoundId = updatedAssessment.assessmentReports[0].contentRound?.id;
                if (!contentRoundId) throw new Error('ContentRound ID não encontrado após registro');
                log(`Simulado iniciado com sucesso! ContentRound: ${contentRoundId}`, "success");
                return { success: true, contentRoundId: contentRoundId, wasInitialized: true };
            } else {
                const contentRoundId = assessment.assessmentReports[0].contentRound?.id;
                log("Simulado já estava iniciado", "success");
                return { success: true, contentRoundId: contentRoundId, wasInitialized: false };
            }
        } catch (error) {
            log(`Erro ao iniciar simulado: ${error}`, "error");
            return { success: false, error };
        }
    }

    async function getAssessmentRealStatus(assessmentId) {
        try {
            const assessmentData = await apiCall(`
                query GetUserAssessmentReport($where: AssessmentWhere, $assessmentReportsWhere2: AssessmentReportWhere) {
                    assessments(where: $where) { name assessmentReports(where: $assessmentReportsWhere2) { contentRound { id report { id isContentRoundCompleted contentsToComplete contentsCompletedAggregate { count } } } } }
                }
            `, { where: { id: assessmentId }, assessmentReportsWhere2: { user: { id: userInfo.id } } });
            const assessment = assessmentData.assessments[0];
            if (!assessment) return { status: 'not_found', contentRoundId: null };
            if (!assessment.assessmentReports || assessment.assessmentReports.length === 0) return { status: 'not_started', contentRoundId: null };
            const report = assessment.assessmentReports[0];
            const contentRoundId = report.contentRound?.id;
            if (!contentRoundId) return { status: 'not_started', contentRoundId: null };
            let userInteractions = [];
            try {
                const interactionsData = await apiCall(`
                    query GetUserInteraction($contentRoundId: ID!, $userId: ID) {
                        users(where: { id: $userId }) { userInteractions(where: { contentRound: { id: $contentRoundId } }) { content { id } answer } }
                    }
                `, { contentRoundId: contentRoundId, userId: userInfo.id });
                userInteractions = interactionsData.users[0]?.userInteractions || [];
            } catch (error) { log(`Não foi possível buscar interações: ${error}`, "info"); }
            let availableQuestions = [];
            try {
                const questionsData = await apiCall(`
                    query GetContentRoundContentsIds($where: ContentRoundWhere) { contentRounds(where: $where) { contents { id } } }
                `, { where: { id: contentRoundId } });
                availableQuestions = questionsData.contentRounds[0]?.contents || [];
            } catch (error) { log(`Não foi possível buscar questões: ${error}`, "info"); return { status: 'error', contentRoundId: contentRoundId, error: 'cannot_get_questions' }; }
            const uniqueAnsweredQuestions = [...new Set(userInteractions.map(i => i.content.id))];
            const allQuestionsAnswered = uniqueAnsweredQuestions.length >= availableQuestions.length;
            const platformSaysCompleted = report.contentRound?.report?.[0]?.isContentRoundCompleted || false;
            if (allQuestionsAnswered || platformSaysCompleted) return { status: 'completed', contentRoundId: contentRoundId, answeredCount: uniqueAnsweredQuestions.length, totalQuestions: availableQuestions.length };
            else if (uniqueAnsweredQuestions.length > 0) return { status: 'in_progress', contentRoundId: contentRoundId, answeredCount: uniqueAnsweredQuestions.length, totalQuestions: availableQuestions.length, unansweredQuestions: availableQuestions.filter(q => !uniqueAnsweredQuestions.includes(q.id)) };
            else return { status: 'not_started', contentRoundId: contentRoundId, totalQuestions: availableQuestions.length };
        } catch (error) {
            log(`Erro ao verificar status do simulado: ${error}`, "error");
            return { status: 'error', contentRoundId: null };
        }
    }

    async function getQuestionWithCorrectAnswer(questionId) {
        try {
            const data = await apiCall(`
                query GetQuestionAndAnswers($where: QuestionWhere) {
                    questions(where: $where) { id text answers { id text fraction } solution { text } }
                }
            `, { where: { id: questionId } });
            const question = data.questions[0];
            if (!question) throw new Error('Questão não encontrada');
            const correctAnswer = question.answers.find(answer => answer.fraction === 1);
            if (!correctAnswer) throw new Error('Nenhuma resposta correta encontrada');
            return { ...question, correctAnswerId: correctAnswer.id };
        } catch (error) {
            throw new Error(`Erro ao buscar questão: ${error}`);
        }
    }

    async function submitCorrectAnswer(questionData, contentRoundId, assessmentId) {
        const baseTimePerQuestion = parseInt(document.getElementById('time-per-question').value) || 60;
        const simulateHuman = document.getElementById('simulate-human').checked;
        let timeSpent = baseTimePerQuestion;
        if (simulateHuman) {
            timeSpent = baseTimePerQuestion + Math.floor(Math.random() * 60) - 30;
            timeSpent = Math.max(45, Math.min(150, timeSpent));
            const questionComplexity = Math.random();
            if (questionComplexity > 0.7) timeSpent += Math.floor(Math.random() * 30);
        }
        try {
            const result = await apiCall(`
                mutation CreateUserInteractionInAssessment($userId: ID!, $performance: Float!, $timeSpentInSeconds: Int!, $contentId: ID!, $contentRoundId: ID!, $assessmentId: ID, $answer: String) {
                    createUserInteraction(userId: $userId, performance: $performance, timeSpentInSeconds: $timeSpentInSeconds, contentId: $contentId, contentRoundId: $contentRoundId, assessmentId: $assessmentId, answer: $answer)
                }
            `, { userId: userInfo.id, performance: 1, timeSpentInSeconds: timeSpent, contentId: questionData.id, contentRoundId: contentRoundId, assessmentId: assessmentId, answer: questionData.correctAnswerId });
            return { success: true, timeSpent, answerId: questionData.correctAnswerId };
        } catch (error) {
            return { success: false, error };
        }
    }

    async function completeAssessment(contentRoundId) {
        try {
            const reportData = await apiCall(`
                query { contentRoundReports(where: { contentRound: {id: "${contentRoundId}"}, user: {id: "${userInfo.id}"}}) { id } }
            `);
            if (reportData.contentRoundReports && reportData.contentRoundReports[0]) {
                await apiCall(`
                    mutation { updateContentRoundReports(where: {id: "${reportData.contentRoundReports[0].id}"}, update: {isContentRoundCompleted: true}) { contentRoundReports { id } } }
                `);
                log("Simulado marcado como completo", "success");
                return true;
            }
            return false;
        } catch (error) {
            log(`Não foi possível marcar como completo: ${error}`, "info");
            return false;
        }
    }

    async function processAssessmentIntelligently(assessmentId, assessmentName) {
        log(`PROCESSANDO SIMULADO: ${assessmentName}`, "assessment");
        try {
            const initialization = await initializeAssessment(assessmentId, assessmentName);
            if (!initialization.success) { log(`Falha ao iniciar simulado: ${initialization.error}`, "error"); return; }
            const contentRoundId = initialization.contentRoundId;
            if (initialization.wasInitialized) { log("Aguardando sistema processar inicialização...", "info"); await new Promise(r => setTimeout(r, 3000)); }
            const status = await getAssessmentRealStatus(assessmentId);
            if (status.status === 'completed') { log(`${assessmentName} já está completo! (${status.answeredCount}/${status.totalQuestions} questões)`, "success"); return; }
            if (status.status === 'not_found') { log(`${assessmentName} não encontrado ou não acessível`, "error"); return; }
            if (status.status === 'error') { log(`${assessmentName} com erro: ${status.error || 'erro desconhecido'}`, "error"); return; }
            if (status.status === 'not_started') { log(`${assessmentName} pronto para iniciar - ${status.totalQuestions} questões`, "info"); }
            else if (status.status === 'in_progress') { log(`${assessmentName} em progresso - ${status.answeredCount}/${status.totalQuestions} questões respondidas`, "info"); }
            if (!contentRoundId) { log(`Não foi possível obter contentRound para ${assessmentName}`, "error"); return; }
            let allQuestions = [];
            try {
                const questionsData = await apiCall(`
                    query GetContentRoundContentsIds($where: ContentRoundWhere) { contentRounds(where: $where) { contents { id } } }
                `, { where: { id: contentRoundId } });
                allQuestions = questionsData.contentRounds[0]?.contents || [];
                if (allQuestions.length === 0) { log(`Nenhuma questão encontrada para ${assessmentName}`, "error"); return; }
            } catch (error) { log(`Erro ao buscar questões: ${error}`, "error"); return; }
            let questionsToAnswer = allQuestions;
            if (status.status === 'in_progress' && status.unansweredQuestions) { questionsToAnswer = status.unansweredQuestions; }
            if (questionsToAnswer.length === 0) { log(`Todas questões já respondidas para ${assessmentName}`, "success"); await completeAssessment(contentRoundId); return; }
            log(`${questionsToAnswer.length}/${allQuestions.length} questões para responder`, "info");
            let processedCount = 0; let totalTime = 0; let errorCount = 0;
            for (const question of questionsToAnswer) {
                try {
                    log(`Processando questão ${processedCount + 1}/${questionsToAnswer.length}...`, "question");
                    const questionWithAnswer = await getQuestionWithCorrectAnswer(question.id);
                    const result = await submitCorrectAnswer(questionWithAnswer, contentRoundId, assessmentId);
                    if (result.success) {
                        processedCount++; totalTime += result.timeSpent;
                        log(`Questão ${processedCount} respondida corretamente (${result.timeSpent}s)`, "success");
                        errorCount = 0;
                        const pauseTime = 3000 + Math.random() * 5000;
                        await new Promise(r => setTimeout(r, pauseTime));
                    } else {
                        errorCount++; log(`Erro na questão: ${result.error}`, "error");
                        if (errorCount >= 3) { log("Muitos erros consecutivos, parando processamento", "error"); break; }
                    }
                } catch (error) {
                    errorCount++; log(`Erro ao processar questão: ${error}`, "error");
                    if (errorCount >= 3) { log("Muitos erros consecutivos, parando processamento", "error"); break; }
                }
            }
            if (processedCount > 0) {
                await completeAssessment(contentRoundId);
                const totalMinutes = Math.floor(totalTime/60); const totalSeconds = totalTime % 60;
                log(`${assessmentName} - ${processedCount} questões processadas em ${totalMinutes}min ${totalSeconds}s`, "success");
            } else { log(`Nenhuma questão processada para ${assessmentName}`, "info"); }
        } catch (error) {
            log(`ERRO CRÍTICO no simulado ${assessmentName}: ${error}`, "error");
        }
    }

    async function loadOptionsForCurrentLevel() {
        const select = document.getElementById('main-select');
        const actionBtn = document.getElementById('action-btn');
        const backBtn = document.getElementById('back-btn');
        const assessmentsConfig = document.getElementById('assessments-config');
        const showCompleted = document.getElementById('show-completed').checked;
        
        select.innerHTML = '<option>Carregando...</option>';
        actionBtn.disabled = true;
        assessmentsConfig.style.display = 'none';
        
        try {
            let options = [];
            switch(navigationState.level) {
                case 'type':
                    options = [{ value: 'schedule', text: `${getIcon('calendar', 14)} Cronograma Diário`, data: null }, { value: 'topics', text: `${getIcon('book', 14)} Tópicos Livres`, data: null }, { value: 'assessments', text: `${getIcon('target', 14)} Simulados Recomendados`, data: null }];
                    backBtn.style.display = 'none';
                    actionBtn.innerHTML = `${getIcon('chevronRight', 14)} Selecionar`;
                    break;
                case 'subject':
                    options = topicsCache.filter(subject => subject.children && subject.children.length > 0).map(subject => ({ value: subject.id, text: `${getIcon('folder', 14)} ${subject.name}`, data: subject }));
                    backBtn.style.display = 'block';
                    actionBtn.innerHTML = `${getIcon('chevronRight', 14)} Selecionar Matéria`;
                    break;
                case 'topic':
                    const subjectChildren = navigationState.currentSubject.children;
                    options = subjectChildren.filter(topic => topic.childrenCount > 0).map(topic => ({ value: topic.id, text: `${getIcon('folder', 14)} ${topic.name}`, data: topic }));
                    if (options.length === 0) options = [{ value: '', text: `${getIcon('x', 14)} Nenhum tópico com sub-tópicos encontrado`, data: null }];
                    actionBtn.innerHTML = `${getIcon('chevronRight', 14)} Selecionar Tópico`;
                    break;
                case 'subtopic':
                    const subtopicData = await apiCall(`query ($topicId: ID!) { getAllDescendantsTopicFromTopic(topicId: $topicId) { id name children { id name contentRoundCount parentName } } }`, { topicId: navigationState.currentTopic.id });
                    log(`Buscando subtópicos para: ${navigationState.currentTopic.name}`, 'info');
                    if (!subtopicData.getAllDescendantsTopicFromTopic || !subtopicData.getAllDescendantsTopicFromTopic.children) {
                        log('Nenhum subtópico encontrado na resposta', 'error');
                        options = [{ value: '', text: `${getIcon('x', 14)} Nenhum subtópico encontrado`, data: null }];
                    } else {
                        log(`Encontrados ${subtopicData.getAllDescendantsTopicFromTopic.children.length} subtópicos`, 'success');
                        const subtopicsWithStatus = [];
                        for (const subtopic of subtopicData.getAllDescendantsTopicFromTopic.children) {
                            if (subtopic.contentRoundCount > 0) {
                                const isCompleted = await isSubtopicCompleted(subtopic.id);
                                subtopicsWithStatus.push({ ...subtopic, isCompleted: isCompleted });
                            }
                        }
                        if (showCompleted) {
                            options = subtopicsWithStatus.map(subtopic => ({ value: subtopic.id, text: `${subtopic.isCompleted ? getIcon('check', 14) : getIcon('clock', 14)} ${subtopic.name} (${subtopic.contentRoundCount} atividades)`, data: subtopic, isCompleted: subtopic.isCompleted }));
                        } else {
                            options = subtopicsWithStatus.filter(subtopic => !subtopic.isCompleted).map(subtopic => ({ value: subtopic.id, text: `${getIcon('clock', 14)} ${subtopic.name} (${subtopic.contentRoundCount} atividades)`, data: subtopic, isCompleted: false }));
                        }
                        if (options.length === 0) {
                            if (showCompleted) { log('Nenhum subtópico com atividades encontrado', 'info'); options = [{ value: '', text: `${getIcon('info', 14)} Nenhum subtópico com atividades`, data: null }]; }
                            else { log('Todos os subtópicos estão completos!', 'success'); options = [{ value: '', text: `${getIcon('check', 14)} Todos os subtópicos estão completos!`, data: null }]; }
                        }
                    }
                    actionBtn.innerHTML = `${getIcon('zap', 14)} Processar Atividades`;
                    break;
                case 'assessments':
                    assessmentsConfig.style.display = 'block';
                    const assessments = await loadRecommendedAssessments();
                    const assessmentsWithStatus = [];
                    for (const assessment of assessments) {
                        const status = await getAssessmentRealStatus(assessment.id);
                        assessmentsWithStatus.push({ ...assessment, realStatus: status });
                    }
                    options = assessmentsWithStatus.map(item => {
                        const status = item.realStatus;
                        let statusIcon, statusText;
                        switch(status.status) {
                            case 'completed': statusIcon = getIcon('check', 14); statusText = `COMPLETO (${status.answeredCount}/${status.totalQuestions})`; break;
                            case 'in_progress': statusIcon = getIcon('clock', 14); statusText = `EM ANDAMENTO (${status.answeredCount}/${status.totalQuestions})`; break;
                            case 'not_started': statusIcon = getIcon('play', 14); statusText = `NÃO INICIADO (${status.totalQuestions || '?'} questões)`; break;
                            case 'not_found': statusIcon = getIcon('x', 14); statusText = 'NÃO ENCONTRADO'; break;
                            case 'error': statusIcon = getIcon('info', 14); statusText = 'ERRO'; break;
                            default: statusIcon = getIcon('info', 14); statusText = 'STATUS DESCONHECIDO';
                        }
                        return { value: item.id, text: `${statusIcon} ${item.area}: ${item.name} - ${statusText}`, data: item, isCompleted: status.status === 'completed', isAvailable: status.status !== 'not_found' && status.status !== 'error' };
                    }).filter(item => item.isAvailable);
                    if (options.length === 0) options = [{ value: '', text: `${getIcon('x', 14)} Nenhum simulado disponível`, data: null }];
                    backBtn.style.display = 'block';
                    actionBtn.innerHTML = `${getIcon('target', 14)} Processar Simulado`;
                    break;
            }
            select.innerHTML = '';
            if (options.length > 0 && !(options.length === 1 && options[0].value === '')) {
                select.innerHTML = '<option value="">-- Selecione --</option>';
                options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option.value;
                    opt.innerHTML = option.text;
                    opt.data = option.data;
                    if (option.isCompleted) { opt.style.color = '#888888'; opt.style.textDecoration = 'line-through'; }
                    select.appendChild(opt);
                });
                actionBtn.disabled = false;
            } else {
                select.innerHTML = '<option value="">Nenhuma opção disponível</option>';
                actionBtn.disabled = true;
            }
            updateBreadcrumb();
        } catch (error) {
            log(`Erro ao carregar opções: ${error}`, 'error');
            select.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    }

    async function processSubtopicActivities(subtopicId, subtopicName) {
        log(`INICIANDO PROCESSAMENTO: ${subtopicName}`, 'info');
        try {
            const data = await apiCall(`
                query GetTopicContentRounds($topicsWhere: TopicWhere, $reportWhere: ContentRoundReportWhere, $options: ContentRoundReportOptions) {
                    topics(where: $topicsWhere) { id name imageUrl expectedCompletionTimeInSeconds contentRounds { contentType id report(where: $reportWhere, options: $options) { contentsCompletedAggregate { count } contentsToComplete isContentRoundCompleted } contents { id expectedCompletionTimeInSeconds } } rootTopic { name imageUrl } }
                }
            `, { topicsWhere: { id: subtopicId }, reportWhere: { user: { id: userInfo.id } }, options: { sort: [{ createdAt: "ASC" }] } });
            if (!data.topics || data.topics.length === 0) { log(`Nenhuma atividade encontrada para: ${subtopicName}`, 'error'); return; }
            const topic = data.topics[0];
            const rounds = topic.contentRounds;
            log(`${subtopicName}: ${rounds.length} tipos de atividades encontrados`, 'info');
            const pendingRounds = rounds.filter(round => {
                const isEmptyReport = !round.report || round.report.length === 0;
                const isCompleted = round.report && round.report.length > 0 && round.report[0].isContentRoundCompleted;
                const isPending = isEmptyReport || !isCompleted;
                log(`${round.contentType}: ${isPending ? '🔄 PENDENTE' : '✅ COMPLETO'}`, 'info');
                return isPending;
            });
            if (pendingRounds.length === 0) { log(`${subtopicName} já está completo!`, 'success'); return; }
            log(`${pendingRounds.length}/${rounds.length} rounds pendentes para processar`, 'success');
            for (const round of pendingRounds) {
                log(`PROCESSANDO: ${round.contentType} (${round.contents.length} conteúdos)`, 'info');
                const repeats = round.contentType === "TOPIC_EXPLANATION" ? 3 : 1;
                for (let r = 0; r < repeats; r++) {
                    log(`Repetição ${r + 1}/${repeats}`, 'info');
                    for (const content of round.contents) {
                        await apiCall(`mutation { createUserInteraction(performance: 1, timeSpentInSeconds: ${Math.floor(30 + Math.random() * 60)}, contentId: "${content.id}", contentRoundId: "${round.id}", userId: "${userInfo.id}") }`);
                        await new Promise(r => setTimeout(r, 200));
                    }
                }
                const reportData = await apiCall(`query { contentRoundReports(where: { contentRound: {id: "${round.id}"}, user: {id: "${userInfo.id}"}}) { id } }`);
                if (reportData.contentRoundReports && reportData.contentRoundReports[0]) {
                    await apiCall(`mutation { updateContentRoundReports(where: {id: "${reportData.contentRoundReports[0].id}"}, update: {isContentRoundCompleted: true}) { contentRoundReports { id } } }`);
                    log(`${round.contentType} finalizado com sucesso`, 'success');
                }
                await new Promise(r => setTimeout(r, 500));
            }
            log(`${subtopicName} PROCESSAMENTO CONCLUÍDO!`, 'success');
        } catch (error) {
            log(`ERRO em ${subtopicName}: ${error}`, 'error');
        }
    }

    async function processScheduleDay(day) {
        log(`Processando cronograma: ${new Date(day.date).toLocaleDateString('pt-BR')}`, 'info');
        for (const slot of day.slots) {
            await processSubtopicActivities(slot.topicId, slot.name || 'Atividade do Cronograma');
        }
    }

    async function processAction() {
        const select = document.getElementById('main-select');
        const selectedOption = select.options[select.selectedIndex];
        if (!selectedOption || !selectedOption.value) { return log("Selecione uma opção primeiro", "error"); }
        const actionBtn = document.getElementById('action-btn');
        actionBtn.disabled = true;
        try {
            switch(navigationState.level) {
                case 'type':
                    if (selectedOption.value === 'schedule') {
                        actionBtn.innerHTML = `${getIcon('clock', 14)} Processando...`;
                        const days = scheduleCache.filter(day => day.slots.length > 0);
                        for (const day of days) { await processScheduleDay(day); }
                        log("Cronograma completo!", "success");
                    } else if (selectedOption.value === 'assessments') {
                        navigationState.level = 'assessments';
                        await loadOptionsForCurrentLevel();
                    } else {
                        navigationState.level = 'subject';
                        await loadOptionsForCurrentLevel();
                    }
                    break;
                case 'subject':
                    navigationState.currentSubject = selectedOption.data;
                    navigationState.level = 'topic';
                    await loadOptionsForCurrentLevel();
                    break;
                case 'topic':
                    navigationState.currentTopic = selectedOption.data;
                    navigationState.level = 'subtopic';
                    await loadOptionsForCurrentLevel();
                    break;
                case 'subtopic':
                    navigationState.currentSubtopic = selectedOption.data;
                    navigationState.level = 'processing';
                    updateBreadcrumb();
                    actionBtn.innerHTML = `${getIcon('clock', 14)} Processando...`;
                    await processSubtopicActivities(selectedOption.value, selectedOption.data.name);
                    navigationState.level = 'subtopic';
                    await loadOptionsForCurrentLevel();
                    break;
                case 'assessments':
                    navigationState.currentAssessment = selectedOption.data;
                    navigationState.level = 'processing';
                    updateBreadcrumb();
                    actionBtn.innerHTML = `${getIcon('clock', 14)} Processando...`;
                    await processAssessmentIntelligently(selectedOption.value, selectedOption.data.name);
                    navigationState.level = 'assessments';
                    await loadOptionsForCurrentLevel();
                    break;
            }
        } catch (error) {
            log(`Erro: ${error}`, 'error');
        } finally {
            actionBtn.disabled = false;
            actionBtn.innerHTML = getActionButtonText();
        }
    }

    function getActionButtonText() {
        switch(navigationState.level) {
            case 'type': return `${getIcon('chevronRight', 14)} Selecionar`;
            case 'subject': return `${getIcon('chevronRight', 14)} Selecionar Matéria`;
            case 'topic': return `${getIcon('chevronRight', 14)} Selecionar Tópico`;
            case 'subtopic': return `${getIcon('zap', 14)} Processar Atividades`;
            case 'assessments': return `${getIcon('target', 14)} Processar Simulado`;
            default: return `${getIcon('play', 14)} Iniciar`;
        }
    }

    async function loadData() {
        try {
            scheduleCache = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({ url: "https://preparasp.jovensgenios.com/assets/assets/json/preparasp_schedule.json", onload: res => resolve(JSON.parse(res.responseText)), onerror: reject });
            });
            const topicsData = await apiCall(`query { getRootTopicsAndDescendantsInStudyPlan(studyPlanId: "a92c62c5-c9a5-421f-88f9-a038a806a8e7") { id name children { id name contentRoundCount childrenCount } } }`);
            topicsCache = topicsData.getRootTopicsAndDescendantsInStudyPlan;
            log("Dados carregados com sucesso", "success");
            await loadOptionsForCurrentLevel();
        } catch (error) {
            log(`Erro ao carregar dados: ${error}`, 'error');
        }
    }

    function initialize() {
        const panel = document.createElement('div');
        panel.id = 'auto-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h2>${getIcon('moon', 18)} Prepara Moon v18.1</h2>
                <div class="header-actions">
                    <div class="credits-dropdown">
                        <button class="credits-btn">${getIcon('info', 18)}</button>
                        <div class="credits-content">
                            <a href="https://discord.gg/KsxH2z7Tg5" target="_blank">${getIcon('messageSquare', 14)} Moon Scripts™ Discord</a>
                            <span style="color:#ccc; padding: 8px 10px; display:block;">by hackermoon1</span>
                        </div>
                    </div>
                    <button id="toggle-btn">${getIcon('minus', 16)}</button>
                </div>
            </div>
            <div class="panel-content">
                <div id="status">Status: <span>Carregando...</span></div>
                <div id="breadcrumb">${getIcon('target', 14)} Selecione o tipo</div>
                <div class="section">
                    <select id="main-select"><option>Carregando...</option></select>
                    <button id="action-btn" disabled>${getIcon('play', 14)} Iniciar</button>
                    <button id="back-btn" style="display:none;">${getIcon('chevronLeft', 14)} Voltar</button>
                    <div style="margin-top: 8px; text-align: center;">
                        <label style="font-size: 11px; color: #b0b0b0;"><input type="checkbox" id="show-completed" checked> Mostrar completos</label>
                    </div>
                </div>
                <div id="assessments-config">
                    <div style="font-size: 12px; font-weight: bold; margin-bottom: 10px;">${getIcon('settings', 14)} Configurações do Simulado</div>
                    <label><input type="checkbox" id="smart-mode" checked> Modo inteligente (100% correto)</label>
                    <label><input type="checkbox" id="simulate-human" checked> Simular tempo humano</label>
                    <div>Tempo por questão: <input type="number" id="time-per-question" min="30" max="180" value="60" style="width: 60px;"> segundos</div>
                    <div class="info-text">${getIcon('info', 12)} Recomendado: 60-120s (mais realista)</div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        const moonIcon = document.createElement('div');
        moonIcon.id = 'moon-float-icon';
        moonIcon.innerHTML = getIcon('moon', 28);
        document.body.appendChild(moonIcon);

        moonIcon.addEventListener('click', () => { panel.classList.toggle('visible'); });
        
        document.getElementById('toggle-btn').onclick = () => { panel.classList.remove('visible'); };

        document.getElementById('back-btn').onclick = () => {
            switch(navigationState.level) {
                case 'subject': navigationState.level = 'type'; navigationState.currentSubject = null; break;
                case 'topic': navigationState.level = 'subject'; navigationState.currentTopic = null; break;
                case 'subtopic': navigationState.level = 'topic'; navigationState.currentSubtopic = null; break;
                case 'assessments': navigationState.level = 'type'; navigationState.currentAssessment = null; break;
            }
            loadOptionsForCurrentLevel();
        };

        document.getElementById('show-completed').addEventListener('change', () => {
            if (navigationState.level === 'subtopic' || navigationState.level === 'assessments') { loadOptionsForCurrentLevel(); }
        });

        document.getElementById('action-btn').onclick = processAction;
        
        const checkSession = setInterval(() => {
            const dataString = localStorage.getItem('data');
            if (dataString) {
                try {
                    const data = JSON.parse(dataString);
                    if (data.userIdToken) {
                        clearInterval(checkSession);
                        bearerToken = data.userIdToken;
                        userInfo = { id: data.user.id, name: data.user.name };
                        setStatus(`Pronto! 👋 ${userInfo.name}`, true);
                        loadData();
                    }
                } catch (e) { log(`Erro ao parsear sessão: ${e}`, 'error'); }
            }
        }, 500);
        
        setTimeout(() => {
            if (!bearerToken) {
                clearInterval(checkSession);
                setStatus("Sessão não encontrada", false);
                log("Faça login no site para usar o script.", 'error');
            }
        }, 10000);
    }

    initialize();
})();