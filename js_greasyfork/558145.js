// ==UserScript==
// @name         Северные маршруты
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Список маршрутов северного клана +заметки
// @author       Nori
// @match        https://catwar.net/cw3/
// @match        https://catwar.su/cw3/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/558145/%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D1%8B%D0%B5%20%D0%BC%D0%B0%D1%80%D1%88%D1%80%D1%83%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558145/%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D1%8B%D0%B5%20%D0%BC%D0%B0%D1%80%D1%88%D1%80%D1%83%D1%82%D1%8B.meta.js
// ==/UserScript==

(function() {
'use strict';

const CONFIG = {
colors: {
header: '#2b323b',
headerHover: '#3a4450',
background: '#eaeff6',
border: '#a7b3c3',
text: '#2b323b',
button: '#a7b3c3',
buttonHover: '#969fb0',
accent: '#2b323b',
light: '#cad0de',
tabActive: '#2b323b',
tabInactive: '#a7b3c3',
noteBg: '#ffffff',
noteBorder: '#d1d9e6'
},
defaultPosition: {top: '100px', left: '20px'}
};

const ROUTES_DATA = {
'Взрослая деятельность': {
'Патрули': {
'Общий маршрут': 'Перевал → Ельник → Величественный бор → Дрейфующие льды → Каменистая мель → Вороникин кряж → <u><strong>Заиндевевшие кусты голубики</strong></u> → Мёрзлые земли → Скалистая гряда* → Заиндевевшие кусты голубики → Лавинный конус → Место-где-огни-касаются-земли → Хребет → Горбатая гора → Ледопад → Морозный яр → Переправа → Манящий обрыв* → Крутой подъём.<br><br><em>Помеченные * локации проверяются ведущим ветки с отменой перехода;<br>Подчёркнутые и жирные локации показывают до какого момента (включая эти же локации) можно присоединиться к патрулированию.</em>',
'Верхний маршрут': 'Перевал → Крутой подъём → Лавинный конус → Место-где-огни-касаются-земли → Хребет → <u><strong>Горбатая гора</strong></u> → Ледопад → Морозный яр → Переправа → Манящий обрыв* → Крутой подъём.<br><br><em>Помеченные * локации проверяются ведущим ветки с отменой перехода;<br>Подчёркнутые и жирные локации показывают до какого момента (включая эти же локации) можно присоединиться к патрулированию.</em>',
'Нижний маршрут': 'Перевал → Ельник → Величественный бор → Дрейфующие льды → Каменистая мель → <u><strong>Вороникин кряж</strong></u> → Заиндевевшие кусты голубики → Мёрзлые земли → Скалистая гряда* → Заиндевевшие кусты голубики → Лавинный конус → Крутой подъём.<br><br><em>Помеченные * локации проверяются ведущим ветки с отменой перехода;<br>Подчёркнутые и жирные локации показывают до какого момента (включая эти же локации) можно присоединиться к патрулированию.</em>'
},
'Дозоры': {
'Маршрут 1': 'Крутой подъём ↔ Лавинный конус ↔ Место-где-огни-касаются-земли ↔ Хребет ↔ Крутой подъём;',
'Маршрут 2': 'Ельник ↔ Величественный бор ↔ Дрейфующие льды ↔ Величественный бор ↔ Ельник;',
'Маршрут 3': 'Крутой подъём ↔ Переправа ↔ Морозный яр;',
'Маршрут 4': 'Заиндевевшие кусты голубики ↔ Мёрзлые земли ↔ Заиндевевшие кусты голубики;',
'Маршрут 5': 'Манящий обрыв ↔ Неприметная опора ↔ Рокочущий откос;'
}
},
'Детская деятельность': {
'Патрули': {
'Общий маршрут': 'Рытвина в корнях ели → Поляна танцующих огней → Стрекочущий лаз → Сплетения корней → Укрытый лужок → Заметённая прогалина → Можжевеловая грива → Клонящееся древо → Хворостняк → Галечник → Тёплый ручей → Старая лиственница → Чащоба → Воющие кроны → Поредевший осинник → Перекат → Пестрящая следами тропа → Замшелые камни → Величавый склон → <u><strong>Перевал</strong></u> → Склад под снегом → Перевал → Грязное место → Перевал → Величавый склон → Грот → Острозубая пасть → Затаившееся эхо метели → Царство льда → Пещера плачущих духов → Солнечная дымка → Застывший зёв → Влажная почва → Родник → Дымящиеся расщелины → Влажная почва → Застывший зёв → Солнечная дымка → Царапучая борозда → Осколки горящих камней → Кристаллический лес → Каменные колонны → Грот.<br><br><em>Подчёркнутые и жирные локации показывают до какого момента можно присоединиться к патрулированию.</em>',
'Левый маршрут': 'Рытвина в корнях ели → Поляна танцующих огней → Стрекочущий лаз → Сплетения корней → Укрытый лужок → Заметённая прогалина → Можжевеловая грива → Клонящееся древо → Хворостняк → Галечник → Тёплый ручей → Старая лиственница → <u><strong>Чащоба</strong></u> → Воющие кроны → Поредевший осинник → Перекат → Пестрящая следами тропа → Замшелые камни → Величавый склон → Перевал → Склад под снегом → Перевал → Грязное место → Перевал → Величавый склон → Грот.<br><br><em>Подчёркнутые и жирные локации показывают до какого момента можно присоединиться к патрулированию.</em>',
'Правый маршрут': 'Рытвина в корнях ели → Величавый склон → Перевал → Грязное место → Перевал → Склад под снегом → Перевал → Величавый склон → Грот → Острозубая пасть → Затаившееся эхо метели → Царство льда → Пещера плачущих духов → <u><strong>Солнечная дымка</strong></u> → Застывший зёв → Влажная почва → Родник → Дымящиеся расщелины → Влажная почва → Застывший зёв → Солнечная дымка → Царапучая борозда → Осколки горящих камней → Кристаллический лес → Каменные колонны → Грот.<br><br><em>Подчёркнутые и жирные локации показывают до какого момента можно присоединиться к патрулированию.</em>'
},
'Дозоры': {
'Маршрут 1': 'Перевал ↔ Склад под снегом ↔ Перевал ↔ Величавый склон ↔ Рытвина в корнях ели.',
'Маршрут 2': 'Перевал ↔ Грязное место ↔ Перевал ↔ Величавый склон ↔ Грот.'
}
},
'Водные патрули': {
'Патрули': {
'Общий маршрут': 'Ельник → Каменистая мель → Дрейфующие льды → Начало ледяного моста → Конец ледяного моста → Святилище гор → Неумолимое течение → Тёмное низовье* → Заиндевевшие кусты голубики → Лавинный конус → Крутой подъём → Гиблый омут → Шепчущий о гибели бурный поток* → Прорва → Неспокойные воды морливой излучины* → Морозный яр → Переправа → <u><strong>Крутой подъём</strong></u>.<br><br><em>* Только ведущий ветки проверяет локацию с отменой перехода.<br>Подчеркнутые и жирные локации обозначают до какой локации вы можете присоединиться к патрулю.</em>',
'Верхний маршрут': 'Крутой подъём → Гиблый омут → Шепчущий о гибели бурный поток* → <u><strong>Прорва</strong></u> → Неспокойные воды морливой излучины* → Морозный яр → Переправа → Крутой подъём.<br><br><em>* Только ведущий ветки проверяет локацию с отменой перехода.<br>Подчеркнутые и жирные локации обозначают до какой локации вы можете присоединиться к патрулю.</em>',
'Нижний маршрут': 'Ельник → Каменистая мель → Дрейфующие льды → Начало ледяного моста → Конец ледяного моста → <u><strong>Святилище гор</strong></u> → Неумолимое течение → Тёмное низовье* → Заиндевевшие кусты голубики → Лавинный конус → Крутой подъём.<br><br><em>* Только ведущий ветки проверяет локацию с отменой перехода.<br>Подчеркнутые и жирные локации обозначают до какой локации вы можете присоединиться к патрулю.</em>'
}
}
};

class NorthernRoutes {
constructor() {
this.isDragging = false;
this.isCollapsed = false;
this.currentPath = [];
this.mode = 'routes';
this.notes = {};
this.currentNotePath = [];
this.init();
}

init() {
this.createBlock();
this.loadPosition();
this.loadNotes();
this.addEventListeners();
this.addStyles();
this.showRoutesMainMenu();
}

createBlock() {
this.container = document.createElement('div');
this.container.id = 'northern-routes-block';
this.container.style.cssText = `
position: absolute;
z-index: 9999;
background: ${CONFIG.colors.background};
border: 1px solid ${CONFIG.colors.border};
border-radius: 8px;
box-shadow: 0 4px 12px rgba(0,0,0,0.15);
font-family: Arial, sans-serif;
overflow: hidden;
width: 400px;
user-select: none;
`;

this.container.style.top = CONFIG.defaultPosition.top;
this.container.style.left = CONFIG.defaultPosition.left;

this.header = document.createElement('div');
this.header.style.cssText = `
background: ${CONFIG.colors.header};
color: #ffffff;
padding: 12px;
user-select: none;
display: flex;
justify-content: space-between;
align-items: center;
border-radius: 8px 8px 0 0;
font-size: 16px;
font-weight: bold;
`;
this.header.innerHTML = `
<span>Северные маршруты</span>
<div style="display: flex; gap: 5px;">
<button class="route-btn back-btn" title="Назад" style="display: none;">←</button>
<button class="route-btn move-btn" title="Переместить">↔</button>
<button class="route-btn collapse-btn" title="Свернуть">−</button>
</div>
`;

this.tabs = document.createElement('div');
this.tabs.style.cssText = `
display: flex;
background: ${CONFIG.colors.light};
border-bottom: 1px solid ${CONFIG.colors.border};
`;

this.routesTab = this.createTab('Маршруты', 'routes');
this.notesTab = this.createTab('Заметки', 'notes');

this.routesTab.style.background = CONFIG.colors.background;
this.routesTab.style.borderBottomColor = CONFIG.colors.tabActive;
this.routesTab.style.color = CONFIG.colors.tabActive;

this.notesTab.style.background = CONFIG.colors.light;
this.notesTab.style.borderBottomColor = 'transparent';
this.notesTab.style.color = CONFIG.colors.text;

this.tabs.appendChild(this.routesTab);
this.tabs.appendChild(this.notesTab);

this.breadcrumbs = document.createElement('div');
this.breadcrumbs.style.cssText = `
padding: 10px 15px;
background: ${CONFIG.colors.light};
border-bottom: 1px solid ${CONFIG.colors.border};
font-size: 12px;
color: ${CONFIG.colors.text};
display: flex;
flex-wrap: wrap;
gap: 5px;
align-items: center;
`;

this.contentContainer = document.createElement('div');
this.contentContainer.style.cssText = `
height: 450px;
overflow-y: auto;
`;

this.mainContent = document.createElement('div');
this.mainContent.id = 'routes-content';
this.mainContent.style.cssText = `
padding: 15px;
min-height: 100%;
overflow-y: auto;
`;

this.contentContainer.appendChild(this.breadcrumbs);
this.contentContainer.appendChild(this.mainContent);
this.container.appendChild(this.header);
this.container.appendChild(this.tabs);
this.container.appendChild(this.contentContainer);
document.body.appendChild(this.container);

this.collapseBtn = this.header.querySelector('.collapse-btn');
this.backBtn = this.header.querySelector('.back-btn');
this.moveBtn = this.header.querySelector('.move-btn');
}

createTab(text, mode) {
const tab = document.createElement('div');
tab.style.cssText = `
flex: 1;
padding: 10px;
text-align: center;
cursor: pointer;
font-size: 14px;
font-weight: bold;
transition: all 0.2s;
border-bottom: 3px solid transparent;
`;
tab.textContent = text;

tab.addEventListener('click', () => {
this.switchMode(mode);
});

return tab;
}

switchMode(mode) {
this.mode = mode;

this.routesTab.style.background = mode === 'routes' ? CONFIG.colors.background : CONFIG.colors.light;
this.routesTab.style.borderBottomColor = mode === 'routes' ? CONFIG.colors.tabActive : 'transparent';
this.routesTab.style.color = mode === 'routes' ? CONFIG.colors.tabActive : CONFIG.colors.text;

this.notesTab.style.background = mode === 'notes' ? CONFIG.colors.background : CONFIG.colors.light;
this.notesTab.style.borderBottomColor = mode === 'notes' ? CONFIG.colors.tabActive : 'transparent';
this.notesTab.style.color = mode === 'notes' ? CONFIG.colors.tabActive : CONFIG.colors.text;

if (mode === 'routes') {
if (this.currentPath.length === 0) {
this.showRoutesMainMenu();
} else if (this.currentPath.length === 1) {
this.showSubMenu(this.currentPath[0]);
} else if (this.currentPath.length === 2) {
this.showRoutes(this.currentPath[0], this.currentPath[1]);
} else if (this.currentPath.length === 3) {
this.showRouteDetails(this.currentPath[0], this.currentPath[1], this.currentPath[2]);
}
} else {
if (this.currentNotePath.length === 0) {
this.showNotesMainMenu();
} else {
this.showNoteContent();
}
}
}

addEventListeners() {
this.moveBtn.addEventListener('click', (e) => {
e.stopPropagation();
this.toggleMoveMode();
});

this.collapseBtn.addEventListener('click', (e) => {
e.stopPropagation();
this.toggleCollapse();
});

this.backBtn.addEventListener('click', (e) => {
e.stopPropagation();
this.goBack();
});
}

toggleMoveMode() {
if (this.isDragging) {
this.stopDrag();
this.moveBtn.style.background = CONFIG.colors.button;
this.moveBtn.title = 'Переместить';
} else {
this.startDragMode();
}
}

startDragMode() {
this.isDragging = true;
this.moveBtn.style.background = '#e74c3c';
this.moveBtn.title = 'Завершить перемещение';

const handleMouseMove = (e) => {
if (!this.isDragging) return;

let clientX, clientY;
if (e.type.includes('touch')) {
if (!e.touches || e.touches.length === 0) return;
clientX = e.touches[0].clientX;
clientY = e.touches[0].clientY;
} else {
clientX = e.clientX;
clientY = e.clientY;
}

const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
const scrollY = window.pageYOffset || document.documentElement.scrollTop;
const newX = clientX + scrollX - this.container.offsetWidth / 2;
const newY = clientY + scrollY - 20;

this.container.style.left = newX + 'px';
this.container.style.top = newY + 'px';
};

const stopMoving = () => {
if (!this.isDragging) return;
this.stopDrag();
this.moveBtn.style.background = CONFIG.colors.button;
this.moveBtn.title = 'Переместить';
};

document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('touchmove', handleMouseMove, {passive: false});

document.addEventListener('mouseup', stopMoving);
document.addEventListener('touchend', stopMoving);
document.addEventListener('touchcancel', stopMoving);

this.container.style.cursor = 'grabbing';
this.container.style.opacity = '0.9';
this.container.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
}

stopDrag() {
this.isDragging = false;
this.container.style.cursor = '';
this.container.style.opacity = '';
this.container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
this.savePosition();
}

toggleCollapse() {
this.isCollapsed = !this.isCollapsed;

if (this.isCollapsed) {
this.contentContainer.style.display = 'none';
this.tabs.style.display = 'none';
this.collapseBtn.textContent = '+';
this.collapseBtn.title = 'Развернуть';
this.container.style.height = '50px';
} else {
this.contentContainer.style.display = 'block';
this.tabs.style.display = 'flex';
this.collapseBtn.textContent = '−';
this.collapseBtn.title = 'Свернуть';
this.container.style.height = '500px';
}

this.savePosition();
}

showRoutesMainMenu() {
this.currentPath = [];
this.updateBreadcrumbs();
this.updateBackButton();

const content = this.mainContent;
content.innerHTML = '';

this.updateBreadcrumbs();

const title = document.createElement('div');
title.style.cssText = `
margin-bottom: 15px;
color: #2b323b;
font-weight: bold;
font-size: 16px;
`;
title.textContent = 'Выберите категорию:';
content.appendChild(title);

Object.keys(ROUTES_DATA).forEach(category => {
const button = this.createButton(category, () => {
this.showSubMenu(category);
});
content.appendChild(button);
});
}

showSubMenu(category) {
this.currentPath = [category];
this.updateBreadcrumbs();
this.updateBackButton();

const content = this.mainContent;
content.innerHTML = '';

this.updateBreadcrumbs();

Object.keys(ROUTES_DATA[category]).forEach(subCategory => {
const button = this.createButton(subCategory, () => {
this.showRoutes(category, subCategory);
});
content.appendChild(button);
});
}

showRoutes(category, subCategory) {
this.currentPath = [category, subCategory];
this.updateBreadcrumbs();
this.updateBackButton();

const content = this.mainContent;
content.innerHTML = '';

this.updateBreadcrumbs();

Object.keys(ROUTES_DATA[category][subCategory]).forEach(routeName => {
const button = this.createButton(routeName, () => {
this.showRouteDetails(category, subCategory, routeName);
});
content.appendChild(button);
});
}

showRouteDetails(category, subCategory, routeName) {
this.currentPath = [category, subCategory, routeName];
this.updateBreadcrumbs();
this.updateBackButton();

const content = this.mainContent;
content.innerHTML = '';

this.updateBreadcrumbs();

const routeText = ROUTES_DATA[category][subCategory][routeName];

const title = document.createElement('div');
title.style.cssText = `
padding: 10px;
margin-bottom: 15px;
background: #2b323b;
color: white;
border-radius: 4px;
font-weight: bold;
text-align: center;
`;
title.textContent = routeName;
content.appendChild(title);

const text = document.createElement('div');
text.style.cssText = `
padding: 15px;
background: white;
border: 1px solid ${CONFIG.colors.border};
border-radius: 4px;
line-height: 1.6;
font-size: 14px;
color: ${CONFIG.colors.text};
overflow-y: auto;
max-height: 380px;
`;
text.innerHTML = routeText;
content.appendChild(text);
}

showNotesMainMenu() {
this.currentNotePath = [];
this.updateBreadcrumbs();
this.updateBackButton();

const content = this.mainContent;
content.innerHTML = '';

this.updateBreadcrumbs();

const title = document.createElement('div');
title.style.cssText = `
margin-bottom: 15px;
color: #2b323b;
font-weight: bold;
font-size: 16px;
`;
title.textContent = 'Мои заметки';
content.appendChild(title);

const newNoteContainer = document.createElement('div');
newNoteContainer.style.cssText = `
margin-bottom: 20px;
padding: 15px;
background: white;
border: 1px solid ${CONFIG.colors.border};
border-radius: 6px;
`;

const newNoteTitle = document.createElement('input');
newNoteTitle.type = 'text';
newNoteTitle.placeholder = 'Название новой заметки';
newNoteTitle.style.cssText = `
width: 100%;
padding: 8px;
margin-bottom: 10px;
border: 1px solid ${CONFIG.colors.border};
border-radius: 4px;
font-size: 14px;
box-sizing: border-box;
`;

const createBtn = this.createButton('Создать заметку', () => {
const title = newNoteTitle.value.trim();
if (!title) {
this.showNotification('Введите название заметки', 'error');
return;
}

if (this.notes[title]) {
this.showNotification('Заметка с таким названием уже существует', 'error');
return;
}

this.createNewNote(title);
newNoteTitle.value = '';
this.showNotesMainMenu();
});
createBtn.style.margin = '5px 0 0 0';

newNoteContainer.appendChild(newNoteTitle);
newNoteContainer.appendChild(createBtn);
content.appendChild(newNoteContainer);

const notesList = document.createElement('div');

const noteKeys = Object.keys(this.notes);
if (noteKeys.length === 0) {
const empty = document.createElement('div');
empty.style.cssText = `
padding: 30px;
text-align: center;
color: ${CONFIG.colors.border};
font-style: italic;
`;
empty.textContent = 'Заметок пока нет. Создайте первую!';
notesList.appendChild(empty);
} else {
noteKeys.forEach(noteName => {
const noteItem = this.createNoteItem(noteName, this.notes[noteName]);
notesList.appendChild(noteItem);
});
}

content.appendChild(notesList);
}

createNoteItem(name, noteData) {
const item = document.createElement('div');
item.style.cssText = `
margin-bottom: 8px;
padding: 12px;
background: ${CONFIG.colors.noteBg};
border: 1px solid ${CONFIG.colors.noteBorder};
border-radius: 6px;
cursor: pointer;
transition: all 0.2s;
display: flex;
justify-content: space-between;
align-items: center;
`;

item.innerHTML = `
<div>
<div style="font-weight: bold; color: #2b323b;">${name}</div>
</div>
<button class="delete-note-btn" style="
background: #e74c3c;
color: white;
border: none;
width: 24px;
height: 24px;
border-radius: 3px;
cursor: pointer;
font-size: 12px;
">×</button>
`;

item.addEventListener('click', (e) => {
if (!e.target.classList.contains('delete-note-btn')) {
this.currentNotePath = [name];
this.showNoteContent();
}
});

item.querySelector('.delete-note-btn').addEventListener('click', (e) => {
e.stopPropagation();
if (confirm(`Удалить заметку "${name}"?`)) {
delete this.notes[name];
this.saveNotes();
this.showNotesMainMenu();
this.showNotification('Заметка удалена');
}
});

item.addEventListener('mouseenter', () => {
item.style.background = CONFIG.colors.light;
item.style.borderColor = CONFIG.colors.button;
});

item.addEventListener('mouseleave', () => {
item.style.background = CONFIG.colors.noteBg;
item.style.borderColor = CONFIG.colors.noteBorder;
});

return item;
}

createNewNote(name) {
this.notes[name] = {
content: ''
};
this.saveNotes();
this.showNotification(`Заметка "${name}" создана`);
}

showNoteContent() {
this.updateBreadcrumbs();
this.updateBackButton();

const content = this.mainContent;
content.innerHTML = '';

this.updateBreadcrumbs();

const currentNote = this.getCurrentNote();
if (!currentNote) {
this.showNotesMainMenu();
return;
}

const noteName = this.currentNotePath[this.currentNotePath.length - 1];

const title = document.createElement('div');
title.style.cssText = `
padding: 10px;
margin-bottom: 15px;
background: #2b323b;
color: white;
border-radius: 4px;
font-weight: bold;
text-align: center;
font-size: 16px;
`;
title.textContent = noteName;
content.appendChild(title);

const textarea = document.createElement('textarea');
textarea.style.cssText = `
width: 100%;
min-height: 350px;
padding: 10px;
border: 1px solid ${CONFIG.colors.border};
border-radius: 4px;
font-size: 14px;
line-height: 1.5;
resize: vertical;
margin-bottom: 10px;
box-sizing: border-box;
font-family: inherit;
overflow-y: auto;
`;
textarea.value = currentNote.content || '';
textarea.placeholder = 'Введите текст заметки...';

textarea.addEventListener('input', () => {
currentNote.content = textarea.value;
this.saveNotes();
});

content.appendChild(textarea);
}

getCurrentNote() {
let current = this.notes;
for (const path of this.currentNotePath) {
if (current[path]) {
current = current[path];
} else {
return null;
}
}
return current;
}

updateBreadcrumbs() {
this.breadcrumbs.innerHTML = '';

const homeText = this.mode === 'routes' ? 'Главная' : 'Заметки';
const homeFunc = this.mode === 'routes' ?
() => this.showRoutesMainMenu() :
() => this.showNotesMainMenu();

const home = document.createElement('span');
home.style.cssText = 'cursor: pointer; color: #2b323b; font-weight: bold;';
home.textContent = homeText;
home.addEventListener('click', homeFunc);
this.breadcrumbs.appendChild(home);

const path = this.mode === 'routes' ? this.currentPath : this.currentNotePath;

path.forEach((item, index) => {
const arrow = document.createElement('span');
arrow.innerHTML = ' → ';
arrow.style.color = CONFIG.colors.border;
this.breadcrumbs.appendChild(arrow);

const crumb = document.createElement('span');
crumb.style.cssText = 'cursor: pointer; color: #2b323b; font-weight: bold;';
crumb.textContent = item;

if (this.mode === 'routes') {
crumb.addEventListener('click', () => {
if (index === 0) {
this.showSubMenu(item);
} else if (index === 1) {
this.showRoutes(this.currentPath[0], item);
}
});
} else {
crumb.addEventListener('click', () => {
this.currentNotePath = path.slice(0, index + 1);
this.showNoteContent();
});
}

this.breadcrumbs.appendChild(crumb);
});
}

updateBackButton() {
const shouldShow = (this.mode === 'routes' && this.currentPath.length > 0) ||
(this.mode === 'notes' && this.currentNotePath.length > 0);

this.backBtn.style.display = shouldShow ? 'inline-block' : 'none';
}

goBack() {
if (this.mode === 'routes') {
if (this.currentPath.length === 3) {
this.showRoutes(this.currentPath[0], this.currentPath[1]);
} else if (this.currentPath.length === 2) {
this.showSubMenu(this.currentPath[0]);
} else if (this.currentPath.length === 1) {
this.showRoutesMainMenu();
}
} else {
if (this.currentNotePath.length > 0) {
this.currentNotePath.pop();
if (this.currentNotePath.length === 0) {
this.showNotesMainMenu();
} else {
this.showNoteContent();
}
}
}
}

createButton(text, onClick) {
const button = document.createElement('input');
button.type = 'button';
button.value = text;
button.style.cssText = `
margin: 5px;
padding: 8px 16px;
background: ${CONFIG.colors.button};
color: #2b323b;
border: none;
border-radius: 4px;
cursor: pointer;
font-weight: bold;
width: calc(100% - 10px);
text-align: left;
`;

button.addEventListener('mouseenter', () => {
button.style.background = CONFIG.colors.buttonHover;
});

button.addEventListener('mouseleave', () => {
button.style.background = CONFIG.colors.button;
});

button.addEventListener('click', onClick);

return button;
}

showNotification(message, type = 'success') {
const notification = document.createElement('div');
notification.style.cssText = `
position: fixed;
top: 20px;
right: 20px;
background: ${type === 'success' ? '#2b323b' : '#d9534f'};
color: white;
padding: 10px 15px;
border-radius: 4px;
z-index: 10000;
font-size: 14px;
box-shadow: 0 4px 12px rgba(0,0,0,0.15);
animation: fadeInOut 3s ease-in-out;
`;
notification.textContent = message;

if (!document.querySelector('#notification-styles')) {
const style = document.createElement('style');
style.id = 'notification-styles';
style.textContent = `
@keyframes fadeInOut {
0% { opacity: 0; transform: translateY(-20px); }
15% { opacity: 1; transform: translateY(0); }
85% { opacity: 1; transform: translateY(0); }
100% { opacity: 0; transform: translateY(-20px); }
}
`;
document.head.appendChild(style);
}

document.body.appendChild(notification);
setTimeout(() => notification.remove(), 3000);
}

savePosition() {
GM_setValue('northernRoutes_position', JSON.stringify({
top: this.container.style.top,
left: this.container.style.left
}));
}

saveNotes() {
GM_setValue('northernRoutes_notes', JSON.stringify(this.notes));
}

loadPosition() {
try {
const saved = GM_getValue('northernRoutes_position');
if (saved) {
const pos = JSON.parse(saved);
this.container.style.top = pos.top || CONFIG.defaultPosition.top;
this.container.style.left = pos.left || CONFIG.defaultPosition.left;
}
} catch (e) {
console.error('Ошибка загрузки позиции:', e);
}
}

loadNotes() {
try {
const saved = GM_getValue('northernRoutes_notes');
if (saved) {
this.notes = JSON.parse(saved);
} else {
this.notes = {};
}
} catch (e) {
console.error('Ошибка загрузки заметок:', e);
this.notes = {};
}
}

addStyles() {
const styles = `
.route-btn {
background: ${CONFIG.colors.button};
color: #2b323b;
border: none;
padding: 4px 8px;
border-radius: 3px;
cursor: pointer;
font-size: 12px;
transition: background 0.2s;
min-width: 24px;
height: 24px;
display: flex;
align-items: center;
justify-content: center;
}

.route-btn:hover {
background: ${CONFIG.colors.buttonHover};
}

#northern-routes-block {
position: absolute !important;
}

#northern-routes-block ::-webkit-scrollbar {
width: 8px;
}

#northern-routes-block ::-webkit-scrollbar-track {
background: #f1f1f1;
border-radius: 4px;
}

#northern-routes-block ::-webkit-scrollbar-thumb {
background: ${CONFIG.colors.button};
border-radius: 4px;
}

#northern-routes-block ::-webkit-scrollbar-thumb:hover {
background: ${CONFIG.colors.buttonHover};
}

u {
text-decoration: underline;
}
strong {
font-weight: bold;
}
`;

const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
}
}

function init() {
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', () => new NorthernRoutes());
} else {
new NorthernRoutes();
}
}

init();
})();