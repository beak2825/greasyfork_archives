// ==UserScript==
// @name         Отчёты в объятиях заботливой Ласки
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Автоматическое составление отчётов северного гнёздышка
// @author       Nori
// @match        https://catwar.net/blog223122
// @match        https://catwar.su/blog223122
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557028/%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B%20%D0%B2%20%D0%BE%D0%B1%D1%8A%D1%8F%D1%82%D0%B8%D1%8F%D1%85%20%D0%B7%D0%B0%D0%B1%D0%BE%D1%82%D0%BB%D0%B8%D0%B2%D0%BE%D0%B9%20%D0%9B%D0%B0%D1%81%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/557028/%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B%20%D0%B2%20%D0%BE%D0%B1%D1%8A%D1%8F%D1%82%D0%B8%D1%8F%D1%85%20%D0%B7%D0%B0%D0%B1%D0%BE%D1%82%D0%BB%D0%B8%D0%B2%D0%BE%D0%B9%20%D0%9B%D0%B0%D1%81%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const REPORTS_CONFIG = {
        kittens: [
            {
                id: 'achievement',
                title: 'Получение ачивки',
                info: 'Внимание! Запрос ачивок необходимо отписывать в отдельном комментарии, не смешивая с остальными деятельностями (навыки, бабочки и т.д.). Если запрос ачивок будет отписан в одном комментарии с какой-либо другой деятельностью, обновляющие вам его не зачтут.<br><br><span style="color:#d32f2f;font-weight:bold;">Примечание:</span> Если у вас уже есть выбранная шапка, оставьте поле "Шапка" в значении "-- выберите шапку --".',
                fields: [
                    {id: 'achievement', type: 'select', label: 'Ачивка:', options: ['','Пришел, увидел, победил','Не покладая лапок','Помощник','Легендарный творец','Почти взрослый…','Проворный малый','Самые шустрые лапки на Севере','Зоркий глаз']},
                    {id: 'hatType', type: 'select', label: 'Шапка:', options: ['','star','water','leaf'], optionTexts: {'': '-- выберите шапку --', 'star': 'звезда', 'water': 'вода', 'leaf': 'листик'}},
                    {id: 'proof', type: 'text', label: 'Подтверждение:', placeholder: 'ссылка на скриншот'}
                ],
                template: (data, playerId) => {
                    const proof = data.proof ? (Storage.getAddUrlTag() ? `[url=${data.proof}]скриншот выполненных требований[/url]` : data.proof) : '';
                    return `[b]Ачивка[/b]\nЯ, ${playerId}, желаю получить ачивку под названием «${data.achievement}».${data.hatType ? `\n[b]Выбор шапки:[/b] ${data.hatType === 'star' ? 'звезда' : data.hatType === 'water' ? 'вода' : 'листик'}.` : ''}\n[b]Подтверждение:[/b] ${proof}`;
                }
            },
            {
                id: 'medal',
                title: 'Получение ледяшек за медаль',
                fields: [
                    {id: 'medal', type: 'text', label: 'Медаль:', placeholder: 'название медали'},
                    {id: 'proof', type: 'text', label: 'Подтверждение:', placeholder: 'ссылка на изображение'}
                ],
                template: (data, playerId) => {
                    const proof = data.proof ? (Storage.getAddUrlTag() ? `[url=${data.proof}]ссылка на изображение[/url]` : data.proof) : '';
                    return `[b]Медаль[/b]\nЯ, ${playerId}, желаю получить 15 ледяшек за медаль под названием «${data.medal}».\n[b]Подтверждение:[/b] ${proof}`;
                }
            },
            {
                id: 'hunt',
                title: 'Отчёт о свободной охоте',
                info: 'Внимание! За день ловлю можно отписать максимум один раз.',
                fields: [],
                template: (data, playerId) => `[b]Охота[/b]\nЯ, ${playerId}, словил(а) 5 бабочек в рамках свободной охоты.`
            },
            {
                id: 'butterfly',
                title: 'Активация бабочки',
                fields: [
                    {id: 'trainee', type: 'text', label: 'Тренирующийся:', placeholder: 'ID'},
                    {id: 'buCount', type: 'number', label: 'Количество БУ:', placeholder: 'N'}
                ],
                template: (data, playerId) => `[b]Детская активация[/b]\n[b]Активирующий:[/b] ${playerId};\n[b]Тренирующийся:[/b] ${data.trainee};\n[b]Количество БУ:[/b] ${data.buCount}.`
            },
            {
                id: 'skills',
                title: 'Получение навыков',
                fields: [
                    {id: 'skillType', type: 'select', label: 'Вид навыка:', options: ['','нюх','копание','боевые умения','плавательные умения','лазательные умения','уровень зоркости','активность'], dynamic: true},
                    {id: 'skillLevel', type: 'select', label: 'Уровень навыка:', options: [], dynamic: true},
                    {id: 'proof', type: 'text', label: 'Подтверждение:', placeholder: 'ссылка на навыки'}
                ],
                template: (data, playerId) => {
                    const proof = data.proof ? (Storage.getAddUrlTag() ? `[url=${data.proof}]ссылка на навыки[/url]` : data.proof) : '';
                    return `[b]Навыки[/b]\nЯ, ${playerId}, хочу получить ледяшки за прокаченный навык.\n[b]Вид навыка:[/b] ${data.skillType}.\n[b]Уровень навыка:[/b] ${data.skillLevel}.\n[b]Подтверждение:[/b] ${proof}`;
                }
            },
            {
                id: 'resource',
                title: 'Полезный ресурс со дна/расщелины',
                fields: [
                    {id: 'resourceType', type: 'select', label: 'Вид ресурса:', options: ['','съедобная дичь','водяной мох','обычный мох','паутина','целебный ресурс','камень','ракушка ПУ','ракушка сон','перья']},
                    {id: 'proof', type: 'text', label: 'Подтверждение:', placeholder: 'ссылка на скриншот'}
                ],
                template: (data, playerId) => {
                    const proof = data.proof ? (Storage.getAddUrlTag() ? `[url=${data.proof}]скриншот[/url]` : data.proof) : '';
                    return `[b]Ресурс[/b]\nЯ, ${playerId}, хочу получить баллы за выловленный ресурс.\n[b]Вид ресурса:[/b] ${data.resourceType}.\n[b]Подтверждение:[/b] ${proof}`;
                }
            }
        ],
        guardians: [
            {
                id: 'guardianButterfly',
                title: 'Активация бабочки',
                fields: [
                    {id: 'trainee', type: 'text', label: 'Тренирующийся:', placeholder: 'ID'},
                    {id: 'buCount', type: 'number', label: 'Количество БУ:', placeholder: 'N'}
                ],
                template: (data, playerId) => `[b]Активация[/b]\n[b]Активирующий:[/b] ${playerId};\n[b]Тренирующийся:[/b] ${data.trainee};\n[b]Количество БУ:[/b] ${data.buCount}.`
            },
            {
                id: 'toys',
                title: 'Создание игрушек',
                fields: [
                    {id: 'toys', type: 'text', label: 'Сделанные игрушки:', placeholder: 'название [количество], название [количество]', style: 'width: 300px;'},
                    {id: 'proof', type: 'text', label: 'Подтверждение:', placeholder: 'ссылка на скриншот'}
                ],
                template: (data, playerId) => {
                    const proof = data.proof ? (Storage.getAddUrlTag() ? `[url=${data.proof}]скриншот[/url]` : data.proof) : '';
                    return `[b]Игрушки[/b]\nЯ, ${playerId}, сделал(а) игрушки из подручных материалов для наших малышей.\n[b]Сделанные игрушки:[/b] ${data.toys};\n[b]Подтверждение:[/b] ${proof}.`;
                }
            },
            {
                id: 'tales',
                title: 'Проведение вечера сказок',
                fields: [
                    {id: 'date', type: 'date', label: 'Дата:'},
                    {id: 'time', type: 'time', label: 'Время:'},
                    {id: 'speakers', type: 'text', label: 'Список выступающих:', placeholder: 'ID, ID, ID'},
                    {id: 'listeners', type: 'text', label: 'Список слушателей:', placeholder: 'ID, ID, ID'}
                ],
                template: (data, playerId) => {
                    const date = data.date ? `${String(new Date(data.date).getDate()).padStart(2, '0')}.${String(new Date(data.date).getMonth() + 1).padStart(2, '0')}.${String(new Date(data.date).getFullYear()).slice(-2)}` : '';
                    return `[b]Вечер сказок[/b]\n[b]Дата и время:[/b] ${date}, ${data.time};\n[b]Ведущий:[/b] ${playerId};\n[b]Список выступающих:[/b] ${formatIDs(data.speakers)};\n[b]Список слушателей:[/b] ${formatIDs(data.listeners)}.`;
                }
            },
            {
                id: 'tournament',
                title: 'Турнир',
                fields: [
                    {id: 'date', type: 'date', label: 'Дата:'},
                    {id: 'time', type: 'time', label: 'Время:'},
                    {id: 'organizersCount', type: 'select', label: 'Проводящих было:', options: ['','one','several'], optionTexts: {'': '-- выберите --', 'one': 'один', 'several': 'несколько'}},
                    {id: 'organizers', type: 'text', label: 'Проводящие:', placeholder: 'ID, ID, ID', hidden: true, dependsOn: {field: 'organizersCount', value: 'several'}},
                    {id: 'participants', type: 'text', label: 'Список участников:', placeholder: 'ID (+), ID, ID'}
                ],
                template: (data, playerId) => {
                    const date = data.date ? `${String(new Date(data.date).getDate()).padStart(2, '0')}.${String(new Date(data.date).getMonth() + 1).padStart(2, '0')}.${String(new Date(data.date).getFullYear()).slice(-2)}` : '';
                    const organizersText = data.organizersCount === 'several' && data.organizers ? formatIDs(data.organizers) : playerId;
                    return `[b]Турнир[/b]\n[b]Дата и время:[/b] ${date}, ${data.time};\n[b]Проводящий(ие):[/b] ${organizersText};\n[b]Список всех участников:[/b] ${formatIDs(data.participants)}.`;
                }
            },
            {
                id: 'watering',
                title: 'Сопровождение котёнка на Дрейфующие льды',
                fields: [
                    {id: 'kittens', type: 'text', label: 'Котята:', placeholder: 'ID, ID, ID'},
                    {id: 'timeStart', type: 'time', label: 'Время начала:'},
                    {id: 'timeEnd', type: 'time', label: 'Время окончания:'}
                ],
                template: (data, playerId) => `[b]Водопой[/b]\n[b]Относящий:[/b] ${playerId};\n[b]Котята:[/b] ${formatIDs(data.kittens)};\n[b]Время:[/b] ${data.timeStart} — ${data.timeEnd}.`
            },
            {
                id: 'expedition',
                title: 'Вылазка',
                fields: [
                    {id: 'expeditionType', type: 'select', label: 'Цель вылазки:', options: ['','Экскурсия','Арин','Вылазка']},
                    {id: 'kittens', type: 'text', label: 'Котята:', placeholder: 'ID, ID, ID'},
                    {id: 'proof', type: 'text', label: 'Подтверждение:', placeholder: 'чч:мм-чч:мм', hidden: true, dependsOn: {field: 'expeditionType', value: 'Вылазка'}},
                    {id: 'proofArin', type: 'number', label: 'Подтверждение:', placeholder: 'кол-во локаций до цветка', min: '1', hidden: true, dependsOn: {field: 'expeditionType', value: 'Арин'}}
                ],
                template: (data, playerId) => {
                    let result = `[b]Вылазка[/b]\n[b]Цель вылазки:[/b] ${data.expeditionType};\n[b]Проводящий:[/b] ${playerId};\n[b]Котята:[/b] ${formatIDs(data.kittens)};`;
                    if (data.expeditionType === 'Вылазка' && data.proof) {
                        result += `\n[b]Подтверждение:[/b] ${data.proof}`;
                    } else if (data.expeditionType === 'Арин' && data.proofArin) {
                        result += `\n[b]Подтверждение:[/b] ${data.proofArin}`;
                    }
                    return result;
                }
            }
        ],
        nest: [
            {
                id: 'familyUpdate',
                title: 'Обновление информации о семье',
                requiresParents: true,
                fields: [
                    {id: 'requirement', type: 'select', label: 'Требуется:', options: ['','замена личной карточки','профиля вк','сфер деятельности','etc']},
                    {id: 'newInfo', type: 'text', label: 'Новая информация:', placeholder: 'текст'}
                ],
                template: (data, playerId, parentsId) => `[b]Гнёздышко[/b]\n[b]Родители:[/b] ${parentsId}.\nТребуется замена ${data.requirement}.\n[b]Новая информация:[/b] ${data.newInfo}`
            },
            {
                id: 'graduate',
                title: 'Выпуск котёнка',
                requiresParents: true,
                fields: [
                    {id: 'graduates', type: 'text', label: 'Котята-выпускники:', placeholder: 'ID'}
                ],
                template: (data, playerId, parentsId) => `[b]Гнёздышко[/b]\n[b]Родители:[/b] ${parentsId}.\nНекоторые котята в нашей семье подросли и стали воспитанниками.\n[b]Котята-выпускники:[/b] ${data.graduates}.`
            },
            {
                id: 'newMembers',
                title: 'Пополнение в семье',
                requiresParents: true,
                fields: [
                    {id: 'newMembers', type: 'text', label: 'Новая информация:', placeholder: 'ID, ID, ID'}
                ],
                template: (data, playerId, parentsId) => {
                    const membersFormatted = data.newMembers.split(',').map(id => `[[n]link[/n]${id.trim()}]`).join(', ');
                    return `[b]Гнёздышко[/b]\n[b]Родители:[/b] ${parentsId}.\nВ нашей семье прибавление.\n[b]Новая информация:[/b] ${membersFormatted}.`;
                }
            }
        ]
    };

    const Storage = {
        getPlayerId: () => localStorage.getItem('lasksa_player_id') || '',
        savePlayerId: (id) => localStorage.setItem('lasksa_player_id', id),
        getParentsId: () => localStorage.getItem('lasksa_parents_id') || '',
        saveParentsId: (id) => localStorage.setItem('lasksa_parents_id', id),
        getAddUrlTag: () => localStorage.getItem('lasksa_add_url_tag') === 'true',
        saveAddUrlTag: (value) => localStorage.setItem('lasksa_add_url_tag', value.toString())
    };

    const Utils = {
        createElement: (type, attributes = {}) => {
            const element = document.createElement(type);
            Object.keys(attributes).forEach(key => element[key] = attributes[key]);
            return element;
        },
        
        formatIDs: (idsString) => {
            return idsString ? idsString.split(',').map(id => id.trim()).join(', ') : '';
        },
        
        clearElement: (element) => {
            while (element.firstChild) element.removeChild(element.firstChild);
        }
    };

    class ReportsApp {
        constructor() {
            this.formsContainer = null;
            this.textarea = null;
            this.pairSection = null;
            this.skillsDependencies = {
                'нюх': ['3','4','5'],
                'копание': ['3','4','5'],
                'плавательные умения': ['3','4','5'],
                'уровень зоркости': ['3','4','5'],
                'боевые умения': ['4','5','6+'],
                'лазательные умения': ['4','5','6+'],
                'активность': ['ЛС','ХМ','ИИ+']
            };
        }

        init() {
            const branchDiv = document.getElementById('view_blocks');
            if (!branchDiv) return;
            
            this.textarea = document.getElementById('comment');
            if (!this.textarea) return;
            
            this.createInterface(branchDiv);
            this.addStyles();
        }

        createInterface(container) {
            const place = Utils.createElement('div', {className: 'form'});
            this.formsContainer = Utils.createElement('div', {className: 'forms-container'});
            
            container.appendChild(place);
            container.appendChild(this.formsContainer);
            
            place.innerHTML = "<hr><h2>Отчёты в объятиях заботливой Ласки</h2>";
            
            const settingsSection = Utils.createElement('div', {
                id: 'settingsSection',
                style: 'background: #eaeff6; padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid #a7b3c3;'
            });
            
            place.appendChild(settingsSection);
            this.showProfileSettings();
            
            place.appendChild(Utils.createElement('div', {
                className: 'version-info',
                innerHTML: 'Текущая версия: <strong>3.3</strong>',
                style: 'text-align:center;font-size:14px;color:#ffffff;margin:10px 0;padding:8px;background:#2b323b;border-radius:4px;'
            }));

            this.createSection('Шаблоны для котят', 'kittens', place);
            this.createSection('Шаблоны для хранителей очага', 'guardians', place);
            this.createSection('Шаблоны для гнёздышка', 'nest', place);
            
            this.pairSection = Utils.createElement('div', {
                id: 'pairSection',
                style: 'background: #eaeff6; padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid #a7b3c3; display: none;'
            });
            place.appendChild(this.pairSection);
            
            place.appendChild(Utils.createElement('div', {
                className: 'warning',
                innerHTML: 'Мод может работать плохо, так что желательно перепроверять правильность написания отчета',
                style: 'text-align:center;font-size:12px;color:#ffffff;margin:10px 0;font-style:italic;background:#2b323b!important;padding:8px;border-radius:4px;'
            }));
        }

        createSection(title, type, container) {
            const section = Utils.createElement('div', {className: 'section'});
            const header = Utils.createElement('div', {className: 'section-header', innerHTML: title + ' ▼'});
            const content = Utils.createElement('div', {className: 'section-content', style: 'display:none;'});
            
            if (type === 'guardians') {
                content.innerHTML = '<div class="info-message">Внимание! Проведение игр и лекций отписывается по специальной форме. Заполнять форму необходимо внимательно и один раз. Баллы за проведённые игры вносятся сразу как игровику, так и котятам.</div><br>';
            }
            
            REPORTS_CONFIG[type].forEach(report => {
                const button = Utils.createElement('input', {type: 'button', value: report.title});
                button.addEventListener('click', () => this.showReportForm(type, report.id));
                content.appendChild(button);
                content.appendChild(Utils.createElement('br'));
            });
            
            header.addEventListener('click', () => {
                const isHidden = content.style.display === 'none';
                
                document.querySelectorAll('.section-content').forEach(otherContent => {
                    if (otherContent !== content) otherContent.style.display = 'none';
                });
                
                document.querySelectorAll('.section-header').forEach(otherHeader => {
                    if (otherHeader !== header) otherHeader.innerHTML = otherHeader.innerHTML.replace('▲', '▼');
                });
                
                if (type === 'nest' && isHidden) {
                    this.pairSection.style.display = 'block';
                    this.showPairSettings();
                } else {
                    this.pairSection.style.display = 'none';
                }
                
                if (isHidden) {
                    content.style.display = 'block';
                    header.innerHTML = title + ' ▲';
                } else {
                    content.style.display = 'none';
                    header.innerHTML = title + ' ▼';
                }
            });
            
            section.appendChild(header);
            section.appendChild(content);
            container.appendChild(section);
        }

        showReportForm(sectionType, reportId) {
            const report = REPORTS_CONFIG[sectionType].find(r => r.id === reportId);
            if (!report) return;
            
            Utils.clearElement(this.formsContainer);
            
            if (report.requiresParents && !Storage.getParentsId()) {
                const warning = Utils.createElement('div', {
                    className: 'info-message',
                    innerHTML: 'Сначала сохраните ID родителей в разделе "Информация о паре"'
                });
                this.formsContainer.appendChild(warning);
                this.formsContainer.appendChild(Utils.createElement('br'));
                return;
            }
            
            this.formsContainer.appendChild(Utils.createElement('h3', {textContent: report.title}));
            
            if (report.info) {
                const infoDiv = Utils.createElement('div', {className: 'info-message', innerHTML: report.info});
                this.formsContainer.appendChild(infoDiv);
                this.formsContainer.appendChild(Utils.createElement('br'));
            }
            
            if (report.requiresParents) {
                const info = Utils.createElement('div', {
                    className: 'info-message',
                    innerHTML: `Родители: <strong>${Storage.getParentsId()}</strong>`
                });
                this.formsContainer.appendChild(info);
                this.formsContainer.appendChild(Utils.createElement('br'));
            }
            
            const formData = {};
            report.fields.forEach(field => {
                this.createField(field, formData);
            });
            
            const btn = Utils.createElement('input', {type: 'button', value: `Сгенерировать ${report.title}`});
            btn.addEventListener('click', () => {
                const playerId = Storage.getPlayerId();
                if (!playerId) return alert("Сначала сохраните ID!");
                
                const requiredFields = report.fields.filter(f => !f.hidden);
                for (const field of requiredFields) {
                    if (!formData[field.id] && field.type !== 'select') {
                        return alert(`Заполните поле "${field.label}"`);
                    }
                }
                
                const parentsId = report.requiresParents ? Storage.getParentsId() : '';
                this.textarea.value = report.template(formData, playerId, parentsId);
            });
            
            this.formsContainer.appendChild(btn);
        }

        createField(field, formData) {
            const container = Utils.createElement('div');
            
            const label = Utils.createElement('label', {
                htmlFor: field.id,
                textContent: field.label
            });
            container.appendChild(label);
            
            let input;
            switch (field.type) {
                case 'select':
                    input = Utils.createElement('select', {id: field.id});
                    const options = field.optionTexts ? 
                        field.options.map(opt => ({value: opt, text: field.optionTexts[opt] || opt})) :
                        field.options.map(opt => ({value: opt, text: opt || '-- выберите --'}));
                    
                    options.forEach(opt => {
                        input.appendChild(Utils.createElement('option', {value: opt.value, textContent: opt.text}));
                    });
                    
                    if (field.dynamic) {
                        input.addEventListener('change', () => this.handleDynamicField(field, input.value));
                    }
                    
                    if (field.dependsOn) {
                        input.style.display = field.hidden ? 'none' : 'inline-block';
                        const dependsOnField = document.getElementById(field.dependsOn.field);
                        if (dependsOnField) {
                            dependsOnField.addEventListener('change', () => {
                                input.style.display = dependsOnField.value === field.dependsOn.value ? 'inline-block' : 'none';
                            });
                        }
                    }
                    break;
                    
                case 'text':
                case 'number':
                case 'date':
                case 'time':
                    input = Utils.createElement('input', {
                        type: field.type,
                        id: field.id,
                        placeholder: field.placeholder || ''
                    });
                    if (field.min) input.min = field.min;
                    if (field.style) input.style.cssText = field.style;
                    break;
            }
            
            input.addEventListener('input', () => {
                formData[field.id] = field.type === 'select' && input.value === '' ? null : input.value;
            });
            
            formData[field.id] = field.type === 'select' ? null : '';
            
            container.appendChild(input);
            container.appendChild(Utils.createElement('br'));
            this.formsContainer.appendChild(container);
            
            if (field.hidden && field.dependsOn) {
                container.style.display = 'none';
                const dependsOnField = document.getElementById(field.dependsOn.field);
                if (dependsOnField) {
                    dependsOnField.addEventListener('change', () => {
                        container.style.display = dependsOnField.value === field.dependsOn.value ? 'block' : 'none';
                        if (dependsOnField.value !== field.dependsOn.value) {
                            input.value = '';
                            formData[field.id] = '';
                        }
                    });
                }
            }
        }

        handleDynamicField(field, value) {
            if (field.id === 'skillType') {
                const levelSelect = document.getElementById('skillLevel');
                Utils.clearElement(levelSelect);
                
                const levels = this.skillsDependencies[value] || [''];
                levels.forEach(lvl => {
                    levelSelect.appendChild(Utils.createElement('option', {
                        value: lvl,
                        textContent: lvl || '-- выберите --'
                    }));
                });
            }
        }

        showProfileSettings() {
            const settingsSection = document.getElementById('settingsSection');
            const savedId = Storage.getPlayerId();
            const savedUrlTag = Storage.getAddUrlTag();
            
            settingsSection.innerHTML = `
                <h3>Настройки профиля</h3>
                <div style="margin-bottom:10px;">
                    <label for="playerIdInput">Ваш ID:</label>
                    <input type="text" id="playerIdInput" placeholder="введите ваш ID" value="${savedId}" style="margin:0 10px;">
                </div>
                <div style="margin-bottom:10px;">
                    <label for="urlTagToggle" style="cursor:pointer;display:inline-flex;align-items:center;">
                        <input type="checkbox" id="urlTagToggle" ${savedUrlTag ? 'checked' : ''} style="margin-right:8px;">
                        Добавлять тег [url] к ссылкам в отчётах
                    </label>
                    <span style="font-size:11px;color:#666;margin-left:5px;">(автоматически оборачивает ссылки в [url=ссылка]текст[/url])</span>
                </div>
                <div>
                    <input type="button" id="saveIdBtn" value="Сохранить настройки" style="background:#2b323b;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">
                    <span id="saveStatus" style="margin-left:10px;color:#2b323b;font-size:12px;"></span>
                </div>
            `;
            
            const displayDiv = Utils.createElement('div', {id: 'settingsDisplay'});
            this.updateSettingsDisplay(displayDiv, savedId, savedUrlTag);
            settingsSection.appendChild(displayDiv);
            
            document.getElementById('saveIdBtn').addEventListener('click', () => {
                const idInput = document.getElementById('playerIdInput');
                const urlTagToggle = document.getElementById('urlTagToggle');
                const id = idInput.value.trim();
                const urlTag = urlTagToggle.checked;
                
                if (id) {
                    Storage.savePlayerId(id);
                    Storage.saveAddUrlTag(urlTag);
                    const status = document.getElementById('saveStatus');
                    status.textContent = 'Настройки успешно сохранены!';
                    status.style.color = '#4CAF50';
                    this.updateSettingsDisplay(displayDiv, id, urlTag);
                    setTimeout(() => { status.textContent = ''; }, 2000);
                } else {
                    const status = document.getElementById('saveStatus');
                    status.textContent = 'Заполните ID!';
                    status.style.color = '#f44336';
                }
            });
        }

        showPairSettings() {
            const savedParents = Storage.getParentsId();
            
            this.pairSection.innerHTML = `
                <h3>Информация о паре</h3>
                <div style="margin-bottom:10px;">
                    <label for="parentsIdInput">ID родителей:</label>
                    <input type="text" id="parentsIdInput" placeholder="ID × ID" value="${savedParents}" style="margin:0 10px;width:200px;">
                </div>
                <div>
                    <input type="button" id="saveParentsBtn" value="Сохранить ID" style="background:#2b323b;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">
                    <span id="saveParentsStatus" style="margin-left:10px;color:#2b323b;font-size:12px;"></span>
                </div>
            `;
            
            const parentsDisplayDiv = Utils.createElement('div', {id: 'parentsDisplay'});
            this.updateParentsDisplay(parentsDisplayDiv, savedParents);
            this.pairSection.appendChild(parentsDisplayDiv);
            
            document.getElementById('saveParentsBtn').addEventListener('click', () => {
                const parentsInput = document.getElementById('parentsIdInput');
                const parents = parentsInput.value.trim();
                
                if (parents) {
                    Storage.saveParentsId(parents);
                    const status = document.getElementById('saveParentsStatus');
                    status.textContent = 'ID родителей успешно сохранен!';
                    status.style.color = '#4CAF50';
                    this.updateParentsDisplay(parentsDisplayDiv, parents);
                    setTimeout(() => { status.textContent = ''; }, 2000);
                } else {
                    const status = document.getElementById('saveParentsStatus');
                    status.textContent = 'Введите ID родителей!';
                    status.style.color = '#f44336';
                }
            });
        }

        updateSettingsDisplay(container, id, urlTag) {
            if (id || urlTag !== undefined) {
                let html = '';
                if (id) html += `<div style="margin-top:5px;color:#2b323b;">Текущий ID: <strong>${id}</strong></div>`;
                if (urlTag !== undefined) html += `<div style="margin-top:5px;color:#2b323b;">Тег [url]: <strong>${urlTag ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}</strong></div>`;
                container.innerHTML = html;
            } else {
                container.innerHTML = '';
            }
        }

        updateParentsDisplay(container, parents) {
            if (parents) {
                container.innerHTML = `<div style="margin-top:10px;color:#2b323b;">Текущие сохраненные ID: <strong>${parents}</strong></div>`;
            } else {
                container.innerHTML = '';
            }
        }

        addStyles() {
            const styles = `
                .form { background: #cad0de; padding: 15px; border-radius: 8px; border: 1px solid #a7b3c3; margin: 10px 0; }
                .forms-container { background: #eaeff6; padding: 15px; border-radius: 8px; border: 1px solid #a7b3c3; margin: 10px 0; }
                .section { margin: 10px 0; border: 1px solid #a7b3c3; border-radius: 8px; background: #eaeff6; }
                .section-header { background: #2b323b; color: #ffffff; padding: 12px; cursor: pointer; user-select: none; font-size: 16px; font-weight: bold; border-radius: 8px 8px 0 0; }
                .section-header:hover { background: #3a4450; }
                .section-content { padding: 15px; background: #eaeff6; border-radius: 0 0 8px 8px; }
                .section-content input[type="button"] { margin: 5px; padding: 8px 16px; background: #a7b3c3; color: #2b323b; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
                .section-content input[type="button"]:hover { background: #969fb0; }
                .form input, .form select, .form button, .form label { margin: 3px 5px 3px 0; }
                .forms-container input, .forms-container select, .forms-container button, .forms-container label { margin: 3px 5px 3px 0; }
                .form input[type="text"], .form input[type="date"], .form input[type="time"], .form input[type="number"] { padding: 4px; border: 1px solid #a7b3c3; border-radius: 3px; background: #ffffff; color: #2b323b; }
                .forms-container input[type="text"], .forms-container input[type="date"], .forms-container input[type="time"], .forms-container input[type="number"] { padding: 4px; border: 1px solid #a7b3c3; border-radius: 3px; background: #ffffff; color: #2b323b; }
                .form select, .forms-container select { padding: 4px; border: 1px solid #a7b3c3; border-radius: 3px; background: #ffffff; color: #2b323b; }
                h2, h3 { margin: 8px 0; color: #2b323b; }
                h2 { background: #2b323b; color: #ffffff; padding: 10px; border-radius: 5px; text-align: center; }
                h3 { background: #2b323b; color: #ffffff; padding: 8px; border-radius: 4px; }
                label { color: #2b323b; font-weight: bold; }
                .info-message { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 10px; margin: 10px 0; color: #856404; font-size: 14px; }
                .warning { text-align: center; font-size: 12px; color: #ffffff; margin: 10px 0; font-style: italic; background: #2b323b !important; padding: 8px; border-radius: 4px; }
                .version-info { text-align: center; font-size: 14px; color: #ffffff; margin: 10px 0; padding: 8px; background: #2b323b; border-radius: 4px; }
            `;
            
            const styleElement = Utils.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }
    }

    function formatIDs(idsString) {
        return idsString ? idsString.split(',').map(id => id.trim()).join(', ') : '';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ReportsApp().init());
    } else {
        new ReportsApp().init();
    }
})();