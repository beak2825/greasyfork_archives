// ==UserScript==
// @name         GeoGuessr Club Activities Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds an activities summary dashboard to GeoGuessr clubs with task completion %
// @author       RENNER
// @match        https://www.geoguessr.com/*
// @icon         https://www.geoguessr.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      www.geoguessr.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553895/GeoGuessr%20Club%20Activities%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/553895/GeoGuessr%20Club%20Activities%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CONFIGURAÇÕES ====================
    const CONFIG = {
        API_LIMIT: 25, // Limite por página (máximo permitido pela API)
        CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
        BUTTON_RETRY_INTERVAL: 1000, // ms
        MAX_BUTTON_RETRIES: 4,
        DEFAULT_LANGUAGE: 'en'
    };

    // ==================== TRADUÇÕES ====================
    const TRANSLATIONS = {
        'pt-BR': {
            // Botão principal
            buttonTitle: '📊 Resumo de Atividades',
            loading: '⏳ Carregando...',
            loadingActivities: '⏳ Buscando atividades, total:',
            
            // Cabeçalho
            dashboardTitle: '📊 Resumo de Atividades do Clube',
            
            // Cards de estatísticas
            totalMembers: 'Total de Membros',
            activeMembers: 'Membros Ativos',
            totalMissions: 'Total de Missões',
            avgPerActive: 'Média por Membro',
            avgCompletion: '% Conclusão Média',
            onlineNow: 'Online Agora',
            
            // Controles
            period: 'Período:',
            last7Days: 'Últimos 7 dias',
            last30Days: 'Últimos 30 dias',
            allTime: 'Todos os Tempos',
            sortBy: 'Ordenar:',
            
            // Tabela
            rank: '#',
            online: '🟢',
            user: 'Usuário',
            joined: 'Entrada',
            missions: 'Missões',
            completion: '% Conclusão',
            totalXP: 'XP Total',
            lastActivity: 'Última Atividade',
            
            // Status
            admin: 'Admin',
            newMember: 'Novo',
            today: 'Hoje',
            day: 'dia',
            days: 'dias',
            week: 'sem',
            months: 'meses',
            
            // Legenda
            excellent: '80-100%: Excelente',
            good: '50-79%: Bom',
            moderate: '25-49%: Moderado',
            low: '0-24%: Baixo',
            
            // Avisos
            returningMemberWarning: 'Este membro ficou um tempo fora do clube e retornou, é por isso que o número total de missões está incorreto.',
            refreshPageAlert: '⚠️ Os dados da página estão desatualizados.\n\nPor favor, pressione F5 para atualizar a página e tente novamente.',
            
            // Botões
            exportCSV: '📊 Exportar CSV',
            close: 'Fechar',
            
            // Meses
            months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        'en': {
            // Main button
            buttonTitle: '📊 Activities Summary',
            loading: '⏳ Loading...',
            loadingActivities: '⏳ Fetching activities, total:',
            
            // Header
            dashboardTitle: '📊 Club Activities Summary',
            
            // Stats cards
            totalMembers: 'Total Members',
            activeMembers: 'Active Members',
            totalMissions: 'Total Missions',
            avgPerActive: 'Avg per Member',
            avgCompletion: 'Avg Completion %',
            onlineNow: 'Online Now',
            
            // Controls
            period: 'Period:',
            last7Days: 'Last 7 days',
            last30Days: 'Last 30 days',
            allTime: 'All Time',
            sortBy: 'Sort by:',
            
            // Table
            rank: '#',
            online: '🟢',
            user: 'User',
            joined: 'Joined',
            missions: 'Missions',
            completion: '% Completion',
            totalXP: 'Total XP',
            lastActivity: 'Last Activity',
            
            // Status
            admin: 'Admin',
            newMember: 'New',
            today: 'Today',
            day: 'day',
            days: 'days',
            week: 'wk',
            months: 'mos',
            
            // Legend
            excellent: '80-100%: Excellent',
            good: '50-79%: Good',
            moderate: '25-49%: Moderate',
            low: '0-24%: Low',
            
            // Warnings
            returningMemberWarning: 'This member left the club and returned later, that\'s why the total missions count is incorrect.',
            refreshPageAlert: '⚠️ Page data is outdated.\n\nPlease press F5 to refresh the page and try again.',
            
            // Buttons
            exportCSV: '📊 Export CSV',
            close: 'Close',
            
            // Months
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        'es': {
            // Botón principal
            buttonTitle: '📊 Resumen de Actividades',
            loading: '⏳ Cargando...',
            loadingActivities: '⏳ Buscando actividades, total:',
            
            // Encabezado
            dashboardTitle: '📊 Resumen de Actividades del Club',
            
            // Tarjetas de estadísticas
            totalMembers: 'Total de Miembros',
            activeMembers: 'Miembros Activos',
            totalMissions: 'Total de Misiones',
            avgPerActive: 'Promedio por Miembro',
            avgCompletion: '% Finalización Media',
            onlineNow: 'En Línea Ahora',
            
            // Controles
            period: 'Período:',
            last7Days: 'Últimos 7 días',
            last30Days: 'Últimos 30 días',
            allTime: 'Todo el Tiempo',
            sortBy: 'Ordenar:',
            
            // Tabla
            rank: '#',
            online: '🟢',
            user: 'Usuario',
            joined: 'Ingreso',
            missions: 'Misiones',
            completion: '% Finalización',
            totalXP: 'XP Total',
            lastActivity: 'Última Actividad',
            
            // Estado
            admin: 'Admin',
            newMember: 'Nuevo',
            today: 'Hoy',
            day: 'día',
            days: 'días',
            week: 'sem',
            months: 'meses',
            
            // Leyenda
            excellent: '80-100%: Excelente',
            good: '50-79%: Bueno',
            moderate: '25-49%: Moderado',
            low: '0-24%: Bajo',
            
            // Avisos
            returningMemberWarning: 'Este miembro estuvo fuera del club y regresó, por eso el número total de misiones es incorrecto.',
            refreshPageAlert: '⚠️ Los datos de la página están desactualizados.\n\nPor favor, presione F5 para actualizar la página e intente nuevamente.',
            
            // Botones
            exportCSV: '📊 Exportar CSV',
            close: 'Cerrar',
            
            // Meses
            months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        }
    };

    // ==================== GERENCIAMENTO DE IDIOMA ====================
    let currentLanguage = GM_getValue('gg_language', CONFIG.DEFAULT_LANGUAGE);

    function setLanguage(lang) {
        currentLanguage = lang;
        GM_setValue('gg_language', lang);
    }

    function t(key) {
        return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS[CONFIG.DEFAULT_LANGUAGE][key] || key;
    }

    // ==================== DETECÇÃO AUTOMÁTICA DE IDIOMA ====================
    function detectAndSetLanguage() {
        try {
            const nextDataScript = document.getElementById('__NEXT_DATA__');
            if (!nextDataScript) {
                return;
            }

            const data = JSON.parse(nextDataScript.textContent);
            const locale = data?.locale;

            // Mapear locale para idioma do script
            let detectedLang = 'en'; // Padrão: inglês
            
            if (locale === 'pt') {
                detectedLang = 'pt-BR';
            } else if (locale === 'es') {
                detectedLang = 'es';
            }

            // Só atualizar se ainda não tiver sido configurado manualmente
            const savedLang = GM_getValue('gg_language', null);
            if (!savedLang) {
                setLanguage(detectedLang);
            } else {
                currentLanguage = savedLang;
            }
        } catch (error) {
            console.error('❌ Erro ao detectar idioma:', error);
        }
    }

    // ==================== EXTRAÇÃO DO CLUB ID E DADOS ====================
    function getClubDataFromPage() {
        try {
            // SEMPRE buscar __NEXT_DATA__ fresco do DOM (sem cache)
            const nextDataScript = document.getElementById('__NEXT_DATA__');
            if (!nextDataScript) {
                console.error('❌ __NEXT_DATA__ script não encontrado');
                return null;
            }

            // Parse FRESCO dos dados (não usar variável cacheada)
            const data = JSON.parse(nextDataScript.textContent);
            
            // Extrair club ID da URL para validação
            const urlMatch = window.location.pathname.match(/\/clubs\/([a-f0-9-]{36})/i);
            const clubIdFromUrl = urlMatch ? urlMatch[1] : null;
            
            // Verificar se é página "my clubs" (não tem UUID na URL)
            const isMyClubsPage = window.location.pathname.includes('/clubs/my');
            
            // PRIORIDADE 1: Página "my clubs" - SEMPRE usar API
            if (isMyClubsPage) {
                // Buscar club ID do __NEXT_DATA__ - caminhos específicos para "my clubs"
                // IMPORTANTE: NÃO usar data.props.pageProps.club (pode ser do clube anterior!)
                const paths = [
                    data?.props?.pageProps?.accountProps?.account?.user?.club?.clubId,
                    data?.props?.accountProps?.account?.user?.club?.clubId,
                    data?.props?.pageProps?.dehydratedState?.queries?.find(q => q?.queryKey?.[0] === 'clubs')?.state?.data?.club?.clubId
                ];

                for (const clubId of paths) {
                    if (clubId) {
                        return {
                            clubId: clubId,
                            members: null,
                            hasLocalData: false // Forçar uso da API
                        };
                    }
                }
                
                console.error('❌ Club ID do seu clube não encontrado');
                return null;
            }
            
            // PRIORIDADE 2: Página de clube específico (outro clube) - tem UUID na URL
            if (clubIdFromUrl) {
                const clubData = data?.props?.pageProps?.club;
                
                if (clubData && clubData.clubId && clubData.members) {
                    // Validar se o clubId do __NEXT_DATA__ corresponde à URL
                    if (clubData.clubId !== clubIdFromUrl) {
                        console.warn('⚠️ AVISO: Club ID do __NEXT_DATA__ não corresponde à URL!');
                        console.warn('   URL:', clubIdFromUrl);
                        console.warn('   __NEXT_DATA__:', clubData.clubId);
                        console.warn('   Aguardando atualização do __NEXT_DATA__...');
                        
                        // Retornar null para tentar novamente após o delay
                        return null;
                    }
                    
                    return {
                        clubId: clubData.clubId,
                        members: clubData.members,
                        hasLocalData: true
                    };
                }
                
                // Se não tem dados no __NEXT_DATA__, aguardar
                console.warn('⚠️ Dados do clube não encontrados no __NEXT_DATA__, aguardando...');
                return null;
            }

            console.error('❌ Não foi possível determinar o tipo de página');
            return null;
        } catch (error) {
            console.error('❌ Erro ao extrair dados do clube:', error);
            return null;
        }
    }

    // Manter função antiga para compatibilidade
    function getClubId() {
        const clubData = getClubDataFromPage();
        return clubData?.clubId || null;
    }

    // ==================== REQUISIÇÃO DE MEMBROS ====================
    async function getMembers(clubId) {
        try {
            const url = `https://www.geoguessr.com/api/v4/clubs/${clubId}/members`;

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const members = await response.json();
            return members;
        } catch (error) {
            console.error('❌ Erro ao buscar membros:', error);
            throw error;
        }
    }

    // ==================== REQUISIÇÃO DE ATIVIDADES ====================
    async function getAllActivities(clubId, progressCallback = null) {
        try {
            let allActivities = [];
            let paginationToken = null;
            let pageCount = 0;
            
            do {
                pageCount++;
                
                // Construir URL com paginationToken se disponível
                let url = `https://www.geoguessr.com/api/v4/clubs/${clubId}/activities?limit=${CONFIG.API_LIMIT}`;
                if (paginationToken) {
                    url += `&paginationToken=${encodeURIComponent(paginationToken)}`;
                }

                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const items = data.items || [];
                
                allActivities = allActivities.concat(items);
                
                // Chamar callback de progresso se fornecido
                if (progressCallback) {
                    progressCallback(allActivities.length);
                }
                
                // Atualizar token para próxima página
                paginationToken = data.paginationToken || null;
                
                // Pequeno delay entre requisições para não sobrecarregar a API
                if (paginationToken) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
            } while (paginationToken);
            
            return allActivities;
        } catch (error) {
            console.error('❌ Erro ao buscar atividades:', error);
            throw error;
        }
    }

    // ==================== PROCESSAMENTO DE DADOS ====================
    function processClubData(members, activities, periodDays = null) {
        const now = new Date();
        const userMap = new Map();

        // Calcular data limite se houver filtro de período
        // GeoGuessr considera o dia a partir de 00:00 UTC (21:00 BRT do dia anterior)
        // "Últimos 7 dias" = hoje + 6 dias anteriores (total 7 dias)
        let periodStartDate = null;
        if (periodDays) {
            periodStartDate = new Date(now.getTime() - ((periodDays - 1) * 24 * 60 * 60 * 1000));
            // Ajustar para 00:00 UTC do dia calculado
            periodStartDate.setUTCHours(0, 0, 0, 0);
        }

        // Criar mapa de usuários com informações dos membros
        members.forEach(member => {
            const userId = member.user.userId;
            const joinedAt = new Date(member.joinedAt);
            
            // Calcular dias no clube considerando o fuso UTC do GeoGuessr
            // GeoGuessr considera um "dia" a partir de 00:00 UTC
            const nowUTC = new Date();
            nowUTC.setUTCHours(0, 0, 0, 0);
            const joinedAtUTC = new Date(joinedAt);
            joinedAtUTC.setUTCHours(0, 0, 0, 0);
            const daysInClub = Math.floor((nowUTC - joinedAtUTC) / (1000 * 60 * 60 * 24));

            userMap.set(userId, {
                userId: userId,
                nick: member.user.nick,
                avatar: member.user.avatar,
                countryCode: member.user.countryCode,
                isOnline: member.isOnline,
                role: member.role,
                joinedAt: joinedAt,
                joinedAtStr: member.joinedAt,
                xpTotal: member.xp,
                daysInClub: daysInClub,
                missionsCompleted: 0,
                missionsCompletedAllTime: 0,
                lastActivity: null,
                isVerified: member.user.isVerified,
                tierId: member.user.tierId
            });
        });

        // Processar atividades
        // Log dos tipos de atividade para debug
        const activityTypes = new Set();
        activities.forEach(a => activityTypes.add(a.type));
        
        // Para períodos específicos (7 ou 30 dias), usar dados da API
        if (periodDays) {
            // Criar mapa de dias únicos por usuário (1 missão = 1 dia com atividade)
            const userDaysMap = new Map();
            
            activities.forEach(activity => {
                const user = userMap.get(activity.userId);
                if (user) {
                    const activityDate = new Date(activity.recordedAt);
                    
                    // Contar apenas se estiver dentro do período
                    if (activityDate >= periodStartDate) {
                        // Extrair dia único em UTC (YYYY-MM-DD)
                        const activityDateUTC = new Date(activityDate);
                        const dayKey = `${activityDateUTC.getUTCFullYear()}-${String(activityDateUTC.getUTCMonth() + 1).padStart(2, '0')}-${String(activityDateUTC.getUTCDate()).padStart(2, '0')}`;
                        
                        // Criar Set de dias únicos para este usuário
                        if (!userDaysMap.has(user.userId)) {
                            userDaysMap.set(user.userId, new Set());
                        }
                        userDaysMap.get(user.userId).add(dayKey);
                    }
                    
                    // Atualizar última atividade
                    if (!user.lastActivity || activityDate > user.lastActivity) {
                        user.lastActivity = activityDate;
                    }
                }
            });
            
            // Atualizar contagem de missões baseado em dias únicos
            userDaysMap.forEach((daysSet, userId) => {
                const user = userMap.get(userId);
                if (user) {
                    user.missionsCompleted = daysSet.size; // 1 missão por dia único
                }
            });

            // Debug: Verificar se algum usuário tem mais missões que o esperado (ex: 8/7)
            userMap.forEach(user => {
                if (periodDays === 7 && user.missionsCompleted > 7) {
                    console.warn(`⚠️ ANOMALIA DETECTADA - Usuário ${user.nick}: ${user.missionsCompleted}/7 missões`);
                    
                    // Mostrar dias únicos com atividade
                    const userDays = userDaysMap.get(user.userId);
                    if (userDays) {
                    }
                    
                    // Mostrar todas as atividades para análise
                    const userActivities = activities
                        .filter(a => a.userId === user.userId)
                        .map(a => {
                            const actDate = new Date(a.recordedAt);
                            const dayKey = `${actDate.getUTCFullYear()}-${String(actDate.getUTCMonth() + 1).padStart(2, '0')}-${String(actDate.getUTCDate()).padStart(2, '0')}`;
                            return {
                                date: actDate,
                                dateStr: actDate.toISOString(),
                                dayUTC: dayKey,
                                isInPeriod: actDate >= periodStartDate
                            };
                        })
                        .sort((a, b) => a.date - b.date);
                    
                    console.table(userActivities);
                }
            });
        } else {
            // Para "All Time", calcular a partir do XP (cada missão = 20 XP)
            // pois a API retorna apenas os últimos 30 dias
            userMap.forEach(user => {
                user.missionsCompleted = Math.floor(user.xpTotal / 20);
            });
            
            // Ainda processar atividades para pegar última atividade
            activities.forEach(activity => {
                const user = userMap.get(activity.userId);
                if (user) {
                    const activityDate = new Date(activity.recordedAt);
                    if (!user.lastActivity || activityDate > user.lastActivity) {
                        user.lastActivity = activityDate;
                    }
                }
            });
        }

        // Calcular % de conclusão e estatísticas
        const processedUsers = Array.from(userMap.values()).map(user => {
            let percentage = null;
            let status = 'novo';
            let expectedMissions = 0;

            // Calcular missões esperadas baseado no período
            if (periodDays) {
                // Para período específico (7 ou 30 dias): sempre usar o valor fixo do período
                // pois a API retorna dados desse período
                expectedMissions = periodDays;
            } else {
                // Para all time: total de dias desde que entrou no clube
                expectedMissions = user.daysInClub;
            }

            // Calcular porcentagem apenas se tiver pelo menos 1 dia no clube
            if (expectedMissions > 0) {
                const completionRate = (user.missionsCompleted / expectedMissions) * 100;
                percentage = Math.min(100, completionRate);

                if (percentage >= 80) status = 'excellent';
                else if (percentage >= 50) status = 'good';
                else if (percentage >= 25) status = 'moderate';
                else status = 'low';
            }

            return {
                ...user,
                expectedMissions: expectedMissions,
                completionPercentage: percentage,
                status: status,
                isReturningMember: user.missionsCompleted > expectedMissions // Detectar se completou mais que o esperado
            };
        });

        // Calcular estatísticas gerais
        const activeUsers = processedUsers.filter(u => u.missionsCompleted > 0);
        const totalMissions = processedUsers.reduce((sum, u) => sum + u.missionsCompleted, 0);
        const avgMissionsPerMember = members.length > 0 ? totalMissions / members.length : 0;
        
        const usersWithPercentage = processedUsers.filter(u => u.completionPercentage !== null);
        const avgCompletionPercentage = usersWithPercentage.length > 0
            ? usersWithPercentage.reduce((sum, u) => sum + u.completionPercentage, 0) / usersWithPercentage.length
            : 0;

        const onlineCount = processedUsers.filter(u => u.isOnline).length;

        const stats = {
            totalMembers: members.length,
            activeMembers: activeUsers.length,
            totalMissions: totalMissions,
            avgMissionsPerActive: avgMissionsPerMember,
            avgCompletionPercentage: avgCompletionPercentage,
            onlineCount: onlineCount
        };

        return {
            users: processedUsers,
            stats: stats
        };
    }

    // ==================== RENDERIZAÇÃO DA UI ====================
    function renderDashboard(data, members, activities) {
        // Remover dashboard existente se houver
        const existing = document.getElementById('gg-club-dashboard');
        if (existing) {
            existing.remove();
        }

        // Armazenar dados originais para reprocessamento
        window.ggDashboardData = { members, activities };

        // Criar overlay
        const overlay = document.createElement('div');
        overlay.id = 'gg-club-dashboard';
        overlay.innerHTML = `
            <div class="gg-dashboard-overlay">
                <div class="gg-dashboard-modal">
                    <div class="gg-dashboard-header">
                        <h2>${t('dashboardTitle')}</h2>
                        <div class="gg-header-controls">
                            <select id="gg-language-selector" class="gg-language-selector">
                                <option value="pt-BR" ${currentLanguage === 'pt-BR' ? 'selected' : ''}>🇧🇷 PT</option>
                                <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>🇺🇸 EN</option>
                                <option value="es" ${currentLanguage === 'es' ? 'selected' : ''}>🇪🇸 ES</option>
                            </select>
                            <button class="gg-dashboard-close" id="gg-close-dashboard">✕</button>
                        </div>
                    </div>

                    <div class="gg-dashboard-stats">
                        <div class="gg-stat-card">
                            <div class="gg-stat-label">${t('totalMembers')}</div>
                            <div class="gg-stat-value">${data.stats.totalMembers}</div>
                        </div>
                        <div class="gg-stat-card">
                            <div class="gg-stat-label">${t('totalMissions')}</div>
                            <div class="gg-stat-value">${data.stats.totalMissions}</div>
                        </div>
                        <div class="gg-stat-card">
                            <div class="gg-stat-label">${t('avgPerActive')}</div>
                            <div class="gg-stat-value">${data.stats.avgMissionsPerActive.toFixed(1)}</div>
                        </div>
                        <div class="gg-stat-card">
                            <div class="gg-stat-label">${t('avgCompletion')}</div>
                            <div class="gg-stat-value">${data.stats.avgCompletionPercentage.toFixed(1)}%</div>
                        </div>
                        ${data.stats.onlineCount > 0 ? `
                        <div class="gg-stat-card">
                            <div class="gg-stat-label">${t('onlineNow')}</div>
                            <div class="gg-stat-value">🟢 ${data.stats.onlineCount}</div>
                        </div>
                        ` : ''}
                    </div>

                    <div class="gg-dashboard-controls">
                        <div class="gg-control-group">
                            <span class="gg-control-label">${t('period')}</span>
                            <button class="gg-period-btn" data-period="7">${t('last7Days')}</button>
                            <button class="gg-period-btn" data-period="30">${t('last30Days')}</button>
                            <button class="gg-period-btn active" data-period="all">${t('allTime')}</button>
                        </div>
                        <div class="gg-control-group">
                            <span class="gg-control-label">${t('sortBy')}</span>
                            <button class="gg-sort-btn active" data-sort="percentage">%</button>
                            <button class="gg-sort-btn" data-sort="missions">${t('missions')}</button>
                            <button class="gg-sort-btn" data-sort="name">${t('user')}</button>
                            <button class="gg-sort-btn" data-sort="xp">XP</button>
                        </div>
                    </div>

                    <div class="gg-dashboard-table-container">
                        <table class="gg-dashboard-table">
                            <thead>
                                <tr>
                                    <th>${t('rank')}</th>
                                    <th>${t('online')}</th>
                                    <th>${t('user')}</th>
                                    <th>${t('joined')}</th>
                                    <th>${t('missions')}</th>
                                    <th>${t('completion')}</th>
                                    <th>${t('totalXP')}</th>
                                    <th>${t('lastActivity')}</th>
                                </tr>
                            </thead>
                            <tbody id="gg-dashboard-tbody">
                                ${renderUserRows(data.users)}
                            </tbody>
                        </table>
                    </div>

                    <div class="gg-dashboard-footer">
                        <div class="gg-legend">
                            <span class="gg-legend-item"><span class="gg-status-dot excellent"></span> ${t('excellent')}</span>
                            <span class="gg-legend-item"><span class="gg-status-dot good"></span> ${t('good')}</span>
                            <span class="gg-legend-item"><span class="gg-status-dot moderate"></span> ${t('moderate')}</span>
                            <span class="gg-legend-item"><span class="gg-status-dot low"></span> ${t('low')}</span>
                        </div>
                        <div class="gg-footer-buttons">
                            <button class="gg-btn-primary" id="gg-close-dashboard-btn">${t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Event listeners
        document.getElementById('gg-close-dashboard').addEventListener('click', closeDashboard);
        document.getElementById('gg-close-dashboard-btn').addEventListener('click', closeDashboard);

        // Seletor de idioma
        document.getElementById('gg-language-selector').addEventListener('change', (e) => {
            const newLang = e.target.value;
            setLanguage(newLang);
            
            // Re-renderizar todo o dashboard com novo idioma
            const currentPeriod = document.querySelector('.gg-period-btn.active')?.dataset.period || 'all';
            const filteredData = processClubData(
                window.ggDashboardData.members,
                window.ggDashboardData.activities,
                currentPeriod === 'all' ? null : parseInt(currentPeriod)
            );
            renderDashboard(filteredData, window.ggDashboardData.members, window.ggDashboardData.activities);
            
            // Restaurar período ativo
            document.querySelectorAll('.gg-period-btn').forEach(btn => {
                if (btn.dataset.period === currentPeriod) {
                    btn.classList.add('active');
                }
            });
        });

        // Filtros de período
        document.querySelectorAll('.gg-period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const periodDays = e.target.dataset.period;
                
                // Remover active de todos os botões de período
                document.querySelectorAll('.gg-period-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Reprocessar dados com novo período
                const filteredData = processClubData(
                    window.ggDashboardData.members,
                    window.ggDashboardData.activities,
                    periodDays === 'all' ? null : parseInt(periodDays)
                );
                
                // Atualizar stats cards
                const statsContainer = document.querySelector('.gg-dashboard-stats');
                statsContainer.innerHTML = `
                    <div class="gg-stat-card">
                        <div class="gg-stat-label">${t('totalMembers')}</div>
                        <div class="gg-stat-value">${filteredData.stats.totalMembers}</div>
                    </div>
                    <div class="gg-stat-card">
                        <div class="gg-stat-label">${t('totalMissions')}</div>
                        <div class="gg-stat-value">${filteredData.stats.totalMissions}</div>
                    </div>
                    <div class="gg-stat-card">
                        <div class="gg-stat-label">${t('avgPerActive')}</div>
                        <div class="gg-stat-value">${filteredData.stats.avgMissionsPerActive.toFixed(1)}</div>
                    </div>
                    <div class="gg-stat-card">
                        <div class="gg-stat-label">${t('avgCompletion')}</div>
                        <div class="gg-stat-value">${filteredData.stats.avgCompletionPercentage.toFixed(1)}%</div>
                    </div>
                    ${filteredData.stats.onlineCount > 0 ? `
                    <div class="gg-stat-card">
                        <div class="gg-stat-label">${t('onlineNow')}</div>
                        <div class="gg-stat-value">🟢 ${filteredData.stats.onlineCount}</div>
                    </div>
                    ` : ''}
                `;
                
                // Re-renderizar tabela mantendo a ordenação atual
                const currentSort = document.querySelector('.gg-sort-btn.active')?.dataset.sort || 'percentage';
                sortAndUpdateTable(filteredData.users, currentSort);
            });
        });

        // Ordenação
        document.querySelectorAll('.gg-sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.gg-sort-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Obter dados filtrados atuais baseado no período selecionado
                const currentPeriod = document.querySelector('.gg-period-btn.active')?.dataset.period || 'all';
                const filteredData = processClubData(
                    window.ggDashboardData.members,
                    window.ggDashboardData.activities,
                    currentPeriod === 'all' ? null : parseInt(currentPeriod)
                );
                
                sortAndUpdateTable(filteredData.users, e.target.dataset.sort);
            });
        });

        // Fechar ao clicar fora
        overlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('gg-dashboard-overlay')) {
                closeDashboard();
            }
        });
    }

    function renderUserRows(users, sortBy = 'percentage') {
        const sorted = sortUsers(users, sortBy);
        
        return sorted.map((user, index) => {
            const percentageDisplay = user.completionPercentage !== null
                ? `${user.completionPercentage.toFixed(1)}%`
                : t('newMember');
            
            const progressBar = user.completionPercentage !== null
                ? `<div class="gg-progress-bar">
                     <div class="gg-progress-fill ${user.status}" style="width: ${user.completionPercentage}%"></div>
                   </div>`
                : `<span class="gg-new-badge">${t('newMember')}</span>`;

            const lastActivityStr = user.lastActivity
                ? formatRelativeTime(user.lastActivity)
                : '-';

            const joinedStr = formatDate(user.joinedAt);

            const onlineIndicator = user.isOnline ? '🟢' : '';
            const returningMemberClass = user.isReturningMember ? 'gg-returning-member' : '';
            const returningMemberTitle = user.isReturningMember ? t('returningMemberWarning') : '';

            return `
                <tr class="gg-user-row ${user.status}">
                    <td>${index + 1}</td>
                    <td>${onlineIndicator}</td>
                    <td>
                        <div class="gg-user-info">
                            <span class="gg-user-nick">${escapeHtml(user.nick)}</span>
                            ${user.role === 1 ? `<span class="gg-admin-badge">${t('admin')}</span>` : ''}
                        </div>
                    </td>
                    <td>${joinedStr}</td>
                    <td class="${returningMemberClass}" title="${returningMemberTitle}">${user.missionsCompleted} / ${user.expectedMissions}</td>
                    <td>
                        <div class="gg-percentage-cell">
                            <span class="gg-percentage-text">${percentageDisplay}</span>
                            ${progressBar}
                        </div>
                    </td>
                    <td>${user.xpTotal}</td>
                    <td>${lastActivityStr}</td>
                </tr>
            `;
        }).join('');
    }

    function sortUsers(users, sortBy) {
        const sorted = [...users];
        
        switch(sortBy) {
            case 'percentage':
                sorted.sort((a, b) => {
                    const aVal = a.completionPercentage ?? -1;
                    const bVal = b.completionPercentage ?? -1;
                    
                    // Se porcentagens forem diferentes, ordenar por porcentagem
                    if (bVal !== aVal) {
                        return bVal - aVal;
                    }
                    
                    // Se houver empate na porcentagem, ordenar por número de missões (desempate)
                    return b.missionsCompleted - a.missionsCompleted;
                });
                break;
            case 'missions':
                sorted.sort((a, b) => b.missionsCompleted - a.missionsCompleted);
                break;
            case 'name':
                sorted.sort((a, b) => a.nick.localeCompare(b.nick));
                break;
            case 'xp':
                sorted.sort((a, b) => b.xpTotal - a.xpTotal);
                break;
        }
        
        return sorted;
    }

    function sortAndUpdateTable(users, sortBy) {
        const tbody = document.getElementById('gg-dashboard-tbody');
        tbody.innerHTML = renderUserRows(users, sortBy);
    }

    function closeDashboard() {
        const dashboard = document.getElementById('gg-club-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
    }

    // ==================== EXPORTAR CSV ====================
    function exportToCSV(users) {
        const sorted = sortUsers(users, 'percentage');
        
        const headers = ['#', 'Usuário', 'Entrada no Clube', 'Missões Completadas', 'Missões Esperadas', '% Conclusão', 'XP Total', 'Última Atividade', 'Status'];
        const rows = sorted.map((user, index) => [
            index + 1,
            user.nick,
            formatDate(user.joinedAt),
            user.missionsCompleted,
            user.expectedMissions,
            user.completionPercentage !== null ? user.completionPercentage.toFixed(1) + '%' : 'Novo',
            user.xpTotal,
            user.lastActivity ? formatDate(user.lastActivity) : '-',
            user.isOnline ? 'Online' : 'Offline'
        ]);

        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `geoguessr-club-activities-${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ==================== INJEÇÃO DO BOTÃO ====================
    function injectButton() {
        let retries = 0;

        const tryInject = () => {
            // Verificar se já existe
            if (document.getElementById('gg-activities-btn')) {
                return true; // Retorna true para indicar sucesso
            }

            let actionPanel = null;
            let buttonClass = 'gg-club-panel-button';
            let isOtherClubPage = false;

            // Primeiro, verificar se é página de outro clube (club-preview_actions)
            const clubPreviewActions = document.querySelector('div[class*="club-preview_actions"]');
            
            if (clubPreviewActions) {
                actionPanel = clubPreviewActions;
                isOtherClubPage = true;
                buttonClass = 'gg-club-preview-button';
            } else {
                // Se não for página de outro clube, procurar action-panel_actionsContainer (my clubs)
                const allDivs = document.querySelectorAll('div[class*="action-panel_actionsContainer"]');
                
                if (allDivs.length > 0) {
                    actionPanel = allDivs[0]; // Pegar o primeiro
                }
            }

            if (!actionPanel) {
                retries++;
                if (retries < CONFIG.MAX_BUTTON_RETRIES) {
                    setTimeout(tryInject, CONFIG.BUTTON_RETRY_INTERVAL);
                    return false; // Continua tentando
                }
                console.warn('⚠️ Não foi possível encontrar o painel de ações. Usando posição fixa como fallback.');
                
                // Fallback final: criar container flutuante
                const buttonContainer = document.createElement('div');
                buttonContainer.id = 'gg-button-container';
                buttonContainer.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                `;

                const button = document.createElement('button');
                button.id = 'gg-activities-btn';
                button.className = 'gg-activities-button';
                button.innerHTML = t('buttonTitle');
                button.addEventListener('click', handleButtonClick);

                buttonContainer.appendChild(button);
                document.body.appendChild(buttonContainer);
                
                return true;
            }

            // Criar botão integrado ao painel do jogo
            const button = document.createElement('button');
            button.id = 'gg-activities-btn';
            button.className = buttonClass;
            button.innerHTML = `
                <span class="gg-button-icon">📊</span>
                <span class="gg-button-text">${t('buttonTitle').replace('📊 ', '')}</span>
            `;
            button.addEventListener('click', handleButtonClick);

            // Se for página de outro clube, inserir ANTES do primeiro botão
            if (isOtherClubPage) {
                const firstButton = actionPanel.querySelector('button');
                if (firstButton) {
                    actionPanel.insertBefore(button, firstButton);
                } else {
                    actionPanel.appendChild(button);
                }
            } else {
                // My clubs: adicionar ao final
                actionPanel.appendChild(button);
            }
            
            return true; // Sucesso
        };

        tryInject();
    }

    // ==================== HANDLER DO BOTÃO ====================
    async function handleButtonClick() {
        const button = document.getElementById('gg-activities-btn');
        if (!button) return;

        // Desabilitar botão durante carregamento
        button.disabled = true;
        button.innerHTML = t('loading');

        try {
            // IMPORTANTE: Limpar qualquer variável de cache antes de buscar
            let clubDataInfo = null;
            let previousClubId = null;
            
            // Tentar até 3 vezes com delay progressivo (para aguardar __NEXT_DATA__ atualizar)
            const maxRetries = 3;
            
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                if (attempt > 1) {
                    await new Promise(resolve => setTimeout(resolve, 500 * attempt));
                }
                
                // SEMPRE buscar dados FRESCOS (sem cache)
                clubDataInfo = null; // Limpar antes de cada tentativa
                clubDataInfo = getClubDataFromPage();
                
                if (clubDataInfo && clubDataInfo.clubId) {
                    // Verificar se não é um ID cacheado da tentativa anterior
                    if (attempt > 1 && clubDataInfo.clubId === previousClubId) {
                        previousClubId = clubDataInfo.clubId;
                        continue; // Tentar novamente
                    }
                    
                    break; // Sucesso!
                }
                
                previousClubId = clubDataInfo?.clubId || null;
            }
            
            if (!clubDataInfo || !clubDataInfo.clubId) {
                console.error('❌ Club ID não encontrado após todas as tentativas');
                console.error('⚠️ __NEXT_DATA__ está desatualizado - necessário refresh da página');
                alert(t('refreshPageAlert'));
                throw new Error('Club ID não encontrado na página atual após várias tentativas - página precisa ser atualizada');
            }

            let members, activities;

            // Se tiver dados locais (página de clube de outro jogador), usar eles
            if (clubDataInfo.hasLocalData) {
                members = clubDataInfo.members;
                
                // Ainda precisamos buscar atividades da API com callback de progresso
                activities = await getAllActivities(clubDataInfo.clubId, (count) => {
                    button.innerHTML = `${t('loadingActivities')} ${count}`;
                });
            } else {
                // Página "my clubs" - buscar tudo da API
                members = await getMembers(clubDataInfo.clubId);
                activities = await getAllActivities(clubDataInfo.clubId, (count) => {
                    button.innerHTML = `${t('loadingActivities')} ${count}`;
                });
            }

            // Processar (inicialmente sem filtro de período - all time)
            const data = processClubData(members, activities, null);

            // Renderizar com dados originais para permitir refiltragem
            renderDashboard(data, members, activities);

        } catch (error) {
            console.error('❌ Erro ao carregar dashboard:', error);
        } finally {
            // Reabilitar botão
            button.disabled = false;
            button.innerHTML = t('buttonTitle');
        }
    }

    // ==================== UTILIDADES ====================
    function formatDate(date) {
        const d = new Date(date);
        const months = t('months');
        const day = d.getDate();
        return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    function formatRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return t('today');
        if (days === 1) return `1 ${t('day')}`;
        if (days < 7) return `${days} ${t('days')}`;
        if (days < 30) return `${Math.floor(days / 7)} ${t('week')}`;
        return `${Math.floor(days / 30)} ${t('months')}`;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==================== ESTILOS CSS ====================
    GM_addStyle(`
        /* Botão integrado ao painel do clube (my clubs) */
        .gg-club-panel-button {
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            padding: 12px 16px !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            font-size: 14px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
            font-family: inherit !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 8px !important;
            margin-top: 8px !important;
        }

        .gg-club-panel-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5) !important;
        }

        .gg-club-panel-button:disabled {
            opacity: 0.6 !important;
            cursor: not-allowed !important;
            transform: none !important;
        }

        /* Botão para página de preview de outro clube */
        .gg-club-preview-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            padding: 12px 16px !important;
            border-radius: 60px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            font-size: 14px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
            font-family: inherit !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 44px !important;
            width: 100% !important;
        }

        .gg-club-preview-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5) !important;
        }

        .gg-club-preview-button:disabled {
            opacity: 0.6 !important;
            cursor: not-allowed !important;
            transform: none !important;
        }

        .gg-button-icon {
            font-size: 18px;
        }

        .gg-button-text {
            font-size: 14px;
            font-weight: 600;
        }

        /* Fallback: Botão flutuante (se não encontrar o painel) */
        #gg-button-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999 !important;
        }

        .gg-activities-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            padding: 12px 24px !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            font-size: 14px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5) !important;
            font-family: inherit !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            width: 100% !important;
        }

        .gg-activities-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6) !important;
        }

        .gg-activities-button:disabled {
            opacity: 0.6 !important;
            cursor: not-allowed !important;
            transform: none !important;
        }

        .gg-dashboard-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        }

        .gg-dashboard-modal {
            background: #1a1a2e;
            border-radius: 16px;
            max-width: 1400px;
            width: 100%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            color: #ffffff;
        }

        .gg-dashboard-header {
            padding: 24px 32px;
            border-bottom: 1px solid #2d2d44;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .gg-dashboard-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #fff;
        }

        .gg-header-controls {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .gg-language-selector {
            background: #2d2d44;
            color: #fff;
            border: 1px solid #3d3d54;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
        }

        .gg-language-selector:hover {
            background: #3d3d54;
        }

        .gg-language-selector:focus {
            outline: none;
            border-color: #667eea;
        }

        .gg-dashboard-close {
            background: transparent;
            border: none;
            color: #999;
            font-size: 28px;
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            transition: all 0.2s;
        }

        .gg-dashboard-close:hover {
            background: #2d2d44;
            color: #fff;
        }

        .gg-dashboard-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
            padding: 24px 32px;
            background: #16213e;
        }

        .gg-stat-card {
            background: #1a1a2e;
            padding: 16px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #2d2d44;
        }

        .gg-stat-label {
            font-size: 12px;
            color: #999;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .gg-stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #667eea;
        }

        .gg-dashboard-controls {
            padding: 16px 32px;
            display: flex;
            gap: 24px;
            border-bottom: 1px solid #2d2d44;
            align-items: center;
        }

        .gg-control-group {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .gg-control-group label {
            font-size: 12px;
            color: #999;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-right: 4px;
        }

        .gg-sort-btn, .gg-period-btn {
            background: #2d2d44;
            color: #fff;
            border: 1px solid #3d3d54;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            font-family: inherit;
        }

        .gg-sort-btn:hover, .gg-period-btn:hover {
            background: #3d3d54;
        }

        .gg-sort-btn.active, .gg-period-btn.active {
            background: #667eea;
            border-color: #667eea;
        }

        .gg-dashboard-table-container {
            flex: 1;
            overflow-y: auto;
            padding: 0 32px;
        }

        .gg-dashboard-table {
            width: 100%;
            border-collapse: collapse;
        }

        .gg-dashboard-table thead {
            position: sticky;
            top: 0;
            background: #1a1a2e;
            z-index: 10;
        }

        .gg-dashboard-table th {
            padding: 16px 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #2d2d44;
        }

        .gg-dashboard-table td {
            padding: 16px 12px;
            border-bottom: 1px solid #2d2d44;
            font-size: 14px;
        }

        .gg-user-row:hover {
            background: #16213e;
        }

        .gg-returning-member {
            background: rgba(251, 191, 36, 0.15) !important;
            cursor: help;
            position: relative;
        }

        .gg-returning-member:hover {
            background: rgba(251, 191, 36, 0.25) !important;
        }

        .gg-user-info {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .gg-user-nick {
            font-weight: 600;
        }

        .gg-admin-badge {
            background: #f59e0b;
            color: #000;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .gg-percentage-cell {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .gg-percentage-text {
            min-width: 60px;
            font-weight: 600;
        }

        .gg-progress-bar {
            flex: 1;
            height: 8px;
            background: #2d2d44;
            border-radius: 4px;
            overflow: hidden;
        }

        .gg-progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
        }

        .gg-progress-fill.excellent {
            background: linear-gradient(90deg, #10b981, #059669);
        }

        .gg-progress-fill.good {
            background: linear-gradient(90deg, #fbbf24, #f59e0b);
        }

        .gg-progress-fill.moderate {
            background: linear-gradient(90deg, #f97316, #ea580c);
        }

        .gg-progress-fill.low {
            background: linear-gradient(90deg, #ef4444, #dc2626);
        }

        .gg-new-badge {
            background: #3b82f6;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }

        .gg-dashboard-footer {
            padding: 24px 32px;
            border-top: 1px solid #2d2d44;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .gg-legend {
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
        }

        .gg-legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #999;
        }

        .gg-status-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }

        .gg-status-dot.excellent {
            background: #10b981;
        }

        .gg-status-dot.good {
            background: #fbbf24;
        }

        .gg-status-dot.moderate {
            background: #f97316;
        }

        .gg-status-dot.low {
            background: #ef4444;
        }

        .gg-footer-buttons {
            display: flex;
            gap: 12px;
        }

        .gg-btn-primary, .gg-btn-secondary {
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            border: none;
        }

        .gg-btn-primary {
            background: #667eea;
            color: white;
        }

        .gg-btn-primary:hover {
            background: #5568d3;
        }

        .gg-btn-secondary {
            background: #2d2d44;
            color: white;
        }

        .gg-btn-secondary:hover {
            background: #3d3d54;
        }

        /* Scrollbar personalizada */
        .gg-dashboard-table-container::-webkit-scrollbar {
            width: 8px;
        }

        .gg-dashboard-table-container::-webkit-scrollbar-track {
            background: #1a1a2e;
        }

        .gg-dashboard-table-container::-webkit-scrollbar-thumb {
            background: #3d3d54;
            border-radius: 4px;
        }

        .gg-dashboard-table-container::-webkit-scrollbar-thumb:hover {
            background: #4d4d64;
        }
    `);

    // ==================== INICIALIZAÇÃO SIMPLIFICADA ====================
    function init() {
        // Verificar se estamos em uma página de clube
        const isMyClubs = window.location.pathname.includes('/clubs/my');
        // Verifica se a URL contém /clubs/ seguido de UUID (com ou sem locale antes)
        const isSpecificClub = /\/clubs\/[a-f0-9-]{36}/i.test(window.location.pathname);
        
        if (!isMyClubs && !isSpecificClub) {
            return;
        }
        
        // Detectar idioma
        detectAndSetLanguage();

        // Injetar botão com retry simples
        let attempts = 0;
        const maxAttempts = 50;
        
        const tryInject = () => {
            if (document.getElementById('gg-activities-btn')) {
                return;
            }

            const actionPanel = document.querySelector('div[class*="action-panel_actionsContainer"], div[class*="club-preview_actions"]');
            
            if (actionPanel) {
                injectButton();
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(tryInject, 300);
                } else {
                    console.warn('⚠️ Timeout: Painel não encontrado. Usando fallback...');
                    injectButton();
                }
            }
        };

        // Delay inicial para garantir que o DOM esteja pronto
        setTimeout(tryInject, 500);
    }

    // ==================== DETECTOR DE NAVEGAÇÃO SPA ====================
    let lastUrl = location.href;

    function onUrlChange() {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(init, 100); // Pequeno delay para garantir que a página carregou
        }
    }

    // Interceptar pushState e replaceState
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function(...args) {
        pushState.apply(this, args);
        onUrlChange();
    };

    history.replaceState = function(...args) {
        replaceState.apply(this, args);
        onUrlChange();
    };

    // Também capturar evento popstate (ex: voltar navegador)
    window.addEventListener('popstate', onUrlChange);

    // Iniciar quando o documento estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    } else {
        setTimeout(init, 500);
    }

})();
