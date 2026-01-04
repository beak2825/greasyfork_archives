// ==UserScript==
// @name         Trophymanager Skill Color Circles for Tactics
// @name:ru     Trophymanager цветные кружки навыков для экрана тактики
// @description Adds green or red circles next to skill values in the tactics screen, indicating skills that have changed after the last training session. Data is loaded once when hovering over a player and cached until the page is refreshed. Compatible with both English and Russian languages.
// @description:ru На экране тактики добавляет зелёные или красные кружки рядом со значениями навыков, которые изменились на последней тренировке. Данные загружаются один раз при наведении мышки на игрока и кэшируются до обновления страницы. Совместимо с английским и русским языком.
// @namespace    tm.skill.color.circles.tactics
// @version      1.0
// @match        https://trophymanager.com/tactics/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557034/Trophymanager%20Skill%20Color%20Circles%20for%20Tactics.user.js
// @updateURL https://update.greasyfork.org/scripts/557034/Trophymanager%20Skill%20Color%20Circles%20for%20Tactics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Карта навыков для двух языков
    const skillNameMap = {
        'reflexes': ['Реакция', 'Reflexes'],
        'handling': ['Игра руками', 'Handling'],
        'pace': ['Скорость', 'Pace'],
        'strength': ['Сила', 'Strength'],
        'jumping': ['Прыгучесть', 'Jumping'],
        'aerial_ability': ['Игра на выходе', 'Aerial Ability'],
        'one_on_ones': ['Один на один', 'One on Ones'],
        'kicking': ['Удар', 'Kicking'],
        'throwing': ['Вбрасывание', 'Throwing'],
        'stamina': ['Выносливость', 'Stamina'],
        'communication': ['Коммуникабельность', 'Communication'],
        'marking': ['Опека', 'Marking'],
        'workrate': ['Работоспособность', 'Workrate'],
        'passing': ['Пас', 'Passing'],
        'tackling': ['Отбор', 'Tackling'],
        'positioning': ['Выбор позиции', 'Positioning'],
        'technique': ['Техника', 'Technique'],
        'crossing': ['Навес', 'Crossing'],
        'heading': ['Игра головой', 'Heading'],
        'finishing': ['Удары', 'Finishing'],
        'longshots': ['Дальние удары', 'Longshots'],
        'set_pieces': ['Стандарты', 'Set Pieces']
    };

    const supportedSkills = Object.keys(skillNameMap); // Список поддерживаемых навыков

    // Кэш для данных игроков
    const cache = new Map();

    // Функция для получения данных с кэшированием
    async function getCachedData(playerId) {
        if (cache.has(playerId)) {
            return cache.get(playerId);
        }
        const response = await fetch('https://trophymanager.com/ajax/players_get_info.ajax.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'player_id=' + playerId + '&type=graphs&show_non_pro_graphs=false'
        });
        const data = await response.json();
        cache.set(playerId, data);
        return data;
    }

    const observer = new MutationObserver(async function(mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.matches('.player_tooltip')) {
                    const activePlayerElement = document.querySelector('.field_player[show_flag="false"][player_set="true"]:hover, .bench_player[show_flag="false"][player_set="true"]:hover, .player_name[player_id]:hover');
                    if (!activePlayerElement) return;
                    const playerId = activePlayerElement.getAttribute('player_id');

                    try {
                        const data = await getCachedData(playerId);
                        if (!data.skillpoints) return;
                        const upSkills = new Set(data.skillpoints.up);
                        const downSkills = new Set(data.skillpoints.down);

                        // Для теста добавляем навыки в downSkills
                        //downSkills.add('pace'); // например, добавляем "Скорость"
                        //downSkills.add('reflexes'); // и "Реакция"

                        const rows = node.querySelectorAll('table.padding tr');
                        for (const row of rows) {
                            // Левый столбец
                            const skillNameCell = row.children[0];
                            const valueCell = row.children[1];
                            if (skillNameCell && valueCell) {
                                const skillName = skillNameCell.textContent.trim();
                                let color = null;
                                for (const [key, names] of Object.entries(skillNameMap)) {
                                    if (names.includes(skillName)) {
                                        if (upSkills.has(key)) color = 'green';
                                        else if (downSkills.has(key)) color = 'red';
                                        break;
                                    }
                                }
                                if (color) {
                                    const circle = document.createElement('span');
                                    circle.style.position = 'absolute';
                                    circle.style.width = '8px';
                                    circle.style.height = '8px';
                                    circle.style.borderRadius = '50%';
                                    circle.style.backgroundColor = color;
                                    circle.style.marginRight = '5px';
                                    circle.style.top = '50%';
                                    circle.style.left = '-10px';
                                    circle.style.transform = 'translateY(-50%)';
                                    valueCell.style.position = 'relative';
                                    valueCell.appendChild(circle);
                                }
                            }

                            // Правый столбец
                            const skillNameCell2 = row.children[3];
                            const valueCell2 = row.children[4];
                            if (skillNameCell2 && valueCell2) {
                                const skillName2 = skillNameCell2.textContent.trim();
                                let color = null;
                                for (const [key, names] of Object.entries(skillNameMap)) {
                                    if (names.includes(skillName2)) {
                                        if (upSkills.has(key)) color = 'green';
                                        else if (downSkills.has(key)) color = 'red';
                                        break;
                                    }
                                }
                                if (color) {
                                    const circle = document.createElement('span');
                                    circle.style.position = 'absolute';
                                    circle.style.width = '8px';
                                    circle.style.height = '8px';
                                    circle.style.borderRadius = '50%';
                                    circle.style.backgroundColor = color;
                                    circle.style.marginRight = '5px';
                                    circle.style.top = '50%';
                                    circle.style.left = '-10px';
                                    circle.style.transform = 'translateY(-50%)';
                                    valueCell2.style.position = 'relative';
                                    valueCell2.appendChild(circle);
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Ошибка при загрузке данных игрока:', error);
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
