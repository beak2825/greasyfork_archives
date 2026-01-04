// ==UserScript==
// @name         Отчёты чёрного списка
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Автоматическое составление отчётов северного Чёрного списка
// @author       Nori
// @match        https://catwar.net/blog187808
// @match        https://catwar.su/blog187808
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557073/%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B%20%D1%87%D1%91%D1%80%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/557073/%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B%20%D1%87%D1%91%D1%80%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
'use strict';

const branchDiv=document.getElementById('view_blocks');
const place=createElement('div',{className:'form'});
const forms=createElement('div',{className:'forms-container'});
const textarea=document.getElementById('comment');

branchDiv.appendChild(place);
branchDiv.appendChild(forms);

place.innerHTML="<hr><h2>Отчёты в чёрном списке</h2>";

const versionInfo=createElement('div',{
className:'version-info',
innerHTML:`Текущая версия: <strong>0.1</strong>`,
style:'text-align:center;font-size:14px;color:#ffffff;margin:10px 0;padding:8px;background:#2b323b;border-radius:4px;'
});
place.appendChild(versionInfo);

const violationSection=createSection('Отчёт о нарушении','violation');
const workoffSection=createSection('Отчёт об отработке','workoff');

place.appendChild(violationSection);
place.appendChild(workoffSection);

const warning=createElement('div',{
className:'warning',
innerHTML:'Мод может работать плохо, так что желательно перепроверять правильность написания отчета',
style:'text-align:center;font-size:12px;color:#ffffff;margin:10px 0;font-style:italic;background:#2b323b!important;padding:8px;border-radius:4px;'
});
place.appendChild(warning);

function closeAllSections(){
document.querySelectorAll('.section-content').forEach(content=>{
content.style.display='none';
});
document.querySelectorAll('.section-header').forEach(header=>{
header.innerHTML=header.innerHTML.replace('▲','▼');
});
}

function createSection(title,type){
const section=createElement('div',{className:'section'});
const header=createElement('div',{
className:'section-header',
innerHTML:title+' ▼'
});
const content=createElement('div',{
className:'section-content',
style:'display:none;'
});

addSectionButtons(content,type);

header.addEventListener('click',function(){
const isHidden=content.style.display==='none';
closeAllSections();
if(isHidden){
content.style.display='block';
header.innerHTML=title+' ▲';
}
});

section.appendChild(header);
section.appendChild(content);
return section;
}

function addSectionButtons(section,type){
let buttons=[];
switch(type){
case 'violation':
buttons=[
{text:'Безопасность',func:safetyReport},
{text:'Дисциплина',func:disciplineReport},
{text:'Здоровье',func:healthReport}
];
break;
case 'workoff':
buttons=[
{text:'Чистка',func:cleaningReport},
{text:'Активность',func:activityReport},
{text:'Активность внутри клана',func:clanActivityReport},
{text:'Ошибки',func:errorsReport},
{text:'Детские патрули',func:childPatrolReport},
{text:'Взрослые патрули',func:adultPatrolReport},
{text:'Дозоры',func:watchReport}
];
break;
}

buttons.forEach(btn=>{
const button=createButton(btn.text,function(){
closeAllSections();
btn.func();
});
section.appendChild(button);
section.appendChild(document.createElement('br'));
});
}

// Функции для нарушений
function safetyReport(){
clearForm();
forms.appendChild(createElement('h3',{textContent:'Нарушение: Безопасность'}));

const elements=[
{label:'ID нарушителя:',inputType:'text',id:'violatorId',placeholder:'ID нарушителя',br:1},
{label:'Нарушение:',id:'violation',customFunction:createSafetySelect,br:1},
{label:'Доказательство:',inputType:'text',id:'proof',placeholder:'ссылка на доказательство',br:1}
];

generateForm(elements,forms);
forms.appendChild(createButton('Сгенерировать отчёт',generateSafety));
}

function disciplineReport(){
clearForm();
forms.appendChild(createElement('h3',{textContent:'Нарушение: Дисциплина'}));

const elements=[
{label:'ID нарушителя:',inputType:'text',id:'violatorId',placeholder:'ID нарушителя',br:1},
{label:'Нарушение:',id:'violation',customFunction:createDisciplineSelect,br:1},
{label:'Доказательство:',inputType:'text',id:'proof',placeholder:'ссылка на доказательство',br:1}
];

generateForm(elements,forms);
forms.appendChild(createButton('Сгенерировать отчёт',generateDiscipline));
}

function healthReport(){
clearForm();
forms.appendChild(createElement('h3',{textContent:'Нарушение: Здоровье'}));

const elements=[
{label:'ID нарушителя:',inputType:'text',id:'violatorId',placeholder:'ID нарушителя',br:1},
{label:'Нарушение:',id:'violation',customFunction:createHealthSelect,br:1},
{label:'Доказательство:',inputType:'text',id:'proof',placeholder:'ссылка на доказательство',br:1}
];

generateForm(elements,forms);
forms.appendChild(createButton('Сгенерировать отчёт',generateHealth));
}

// Функции для отработок
function cleaningReport(){
clearForm();
forms.appendChild(createElement('h3',{textContent:'Отработка: Чистка'}));

const elements=[
{label:'Ваш ID:',inputType:'text',id:'playerId',placeholder:'ваш ID',br:1},
{label:'Вид отработки:',id:'workoffType',customFunction:createCleaningSelect,br:1},
{label:'Доказательство:',inputType:'text',id:'proof',placeholder:'ссылка на доказательство',br:1}
];

generateForm(elements,forms);
forms.appendChild(createButton('Сгенерировать отчёт',generateCleaning));
}

function activityReport(){
clearForm();
forms.appendChild(createElement('h3',{textContent:'Отработка: Активность'}));

const elements=[
{label:'Ваш ID:',inputType:'text',id:'playerId',placeholder:'ваш ID',br:1},
{label:'Вид отработки:',id:'workoffType',customFunction:createActivitySelect,br:1},
{label:'Доказательство:',inputType:'text',id:'proof',placeholder:'ссылка на доказательство',br:1}
];

generateForm(elements,forms);
forms.appendChild(createButton('Сгенерировать отчёт',generateActivity));
}

function clanActivityReport(){
clearForm();
forms.appendChild(createElement('h3',{textContent:'Отработка: Активность внутри клана'}));

const elements=[
{label:'Ваш ID:',inputType:'text',id:'playerId',placeholder:'ваш ID',br:1},
{label:'Вид отработки:',id:'workoffType',customFunction:createClanActivitySelect,br:1},
{label:'Доказательство:',inputType:'text',id:'proof',placeholder:'ссылка на доказательство',br:1}
];

generateForm(elements,forms);
forms.appendChild(createButton('Сгенерировать отчёт',generateClanActivity));
}

function errorsReport(){
clearForm();
forms.appendChild(createElement('h3',{textContent:'Отработка: Ошибки'}));

const elements=[
{label:'Ваш ID:',inputType:'text',id:'playerId',placeholder:'ваш ID',br:1},
{label:'Вид отработки:',id:'workoffType',customFunction:createErrorsSelect,br:1},
{label:'ID кота с ошибкой:',inputType:'text',id:'errorCatId',placeholder:'ID кота (если применимо)',br:1},
{label:'Доказательство:',inputType:'text',id:'proof',placeholder:'ссылка на доказательство',br:1}
];

generateForm(elements,forms);
forms.appendChild(createButton('Сгенерировать отчёт',generateErrors));
}

function childPatrolReport(){
clearForm();
forms.appendChild(createElement('h3',{textContent:'Отработка: Детские патрули'}));

const elements=[
{label:'Ваш ID:',inputType:'text',id:'playerId',placeholder:'ваш ID',br:1},
{label:'Вид отработки:',id:'workoffType',customFunction:createChildPatrolSelect,br:1},
{label:'Доказательство:',inputType:'text',id:'proof',placeholder:'ссылка на доказательство',br:1}
];

generateForm(elements,forms);
forms.appendChild(createButton('Сгенерировать отчёт',generateChildPatrol));
}

function adultPatrolReport(){
clearForm();
forms.appendChild(createElement('h3',{textContent:'Отработка: Взрослые патрули'}));

const elements=[
{label:'Ваш ID:',inputType:'text',id:'playerId',placeholder:'ваш ID',br:1},
{label:'Вид отработки:',id:'workoffType',customFunction:createAdultPatrolSelect,br:1},
{label:'Доказательство:',inputType:'text',id:'proof',placeholder:'ссылка на доказательство',br:1}
];

generateForm(elements,forms);
forms.appendChild(createButton('Сгенерировать отчёт',generateAdultPatrol));
}

function watchReport(){
clearForm();
forms.appendChild(createElement('h3',{textContent:'Отработка: Дозоры'}));

const elements=[
{label:'Ваш ID:',inputType:'text',id:'playerId',placeholder:'ваш ID',br:1},
{label:'Вид отработки:',id:'workoffType',customFunction:createWatchSelect,br:1},
{label:'Доказательство:',inputType:'text',id:'proof',placeholder:'ссылка на доказательство',br:1}
];

generateForm(elements,forms);
forms.appendChild(createButton('Сгенерировать отчёт',generateWatch));
}

// Select создатели для нарушений
function createSafetySelect(){
const select=createElement('select',{id:'violation'});
const options=[
{value:'',text:'-- выберите нарушение --'},
{value:'Посещение 5 ярус скал и Уступов под водопадом без допуска',text:'Посещение 5 ярус скал и Уступов под водопадом без допуска'},
{value:'Взаимодействие с Барсуком-Визгуном',text:'Взаимодействие с Барсуком-Визгуном'},
{value:'Заход в опасный боережим',text:'Заход в опасный боережим'},
{value:'Создание ситуации, угрожающей здоровью и жизни соклановцев/представителей иных фракций, или высказывание о намерении создать таковую',text:'Создание ситуации, угрожающей здоровью и жизни'},
{value:'Повторная активация бота Рунический камень',text:'Повторная активация бота Рунический камень'},
{value:'Активация Пещерной Лисы, Разозлённой Орлицы и/или любое взаимодействие с ними',text:'Активация Пещерной Лисы, Разозлённой Орлицы'},
{value:'Посещение смертельного лабиринта',text:'Посещение смертельного лабиринта'},
{value:'Убийство игрока',text:'Убийство игрока'}
];
options.forEach(opt=>{
const option=createElement('option',{value:opt.value,textContent:opt.text});
select.appendChild(option);
});
return select;
}

function createDisciplineSelect(){
const select=createElement('select',{id:'violation'});
const options=[
{value:'',text:'-- выберите нарушение --'},
{value:'Превышение лимита на свободной охоте/в охотничьем патруле',text:'Превышение лимита на свободной охоте/в охотничьем патруле'},
{value:'Разговор во время сборов патрулей/травника/собраний, непрекращаемое повышение голоса',text:'Разговор во время сборов патрулей/травника/собраний'},
{value:'Пренебрежение правилами посещения Прочной ниши и Шепчущих покоев',text:'Пренебрежение правилами посещения Прочной ниши и Шепчущих покоев'},
{value:'Пренебрежение правилами ношения дичи и наполненного мха вне Склада под снегом',text:'Пренебрежение правилами ношения дичи и наполненного мха'},
{value:'Вынос игрока с локации без весомой причины или уборка локаций, не предусмотренных для этого',text:'Вынос игрока с локации без весомой причины'},
{value:'Пренебрежение правилами ежедневных мероприятий',text:'Пренебрежение правилами ежедневных мероприятий'},
{value:'Многократный сон в неположенном месте',text:'Многократный сон в неположенном месте'},
{value:'Тренировка с представителем иной фракции',text:'Тренировка с представителем иной фракции'},
{value:'Нарушение правил выноса котят за пределы лагеря',text:'Нарушение правил выноса котят за пределы лагеря'},
{value:'Посещение Прочной ниши',text:'Посещение Прочной ниши'},
{value:'Уничтожение полезных клановых ресурсов или массовая порча дичи',text:'Уничтожение полезных клановых ресурсов или массовая порча дичи'},
{value:'Нарушение границ; посещение Водопада и 7ДЛ без допуска',text:'Нарушение границ; посещение Водопада и 7ДЛ без допуска'},
{value:'Пренебрежительное отношение к соклановцам/представителям иных фракций',text:'Пренебрежительное отношение к соклановцам/представителям иных фракций'},
{value:'Кража ресурсов/дичи/личных предметов',text:'Кража ресурсов/дичи/личных предметов'},
{value:'Порча и любые взаимодействия с целительскими ресурсами вне ежедневных и/или отрядных мероприятий, предназначенных для их сбора',text:'Порча и взаимодействия с целительскими ресурсами'},
{value:'Посещение Каменного карниза',text:'Посещение Каменного карниза'},
{value:'Распространение клановой информации за его пределами',text:'Распространение клановой информации за его пределами'},
{value:'Распространение ответов на вопросы и самих вопросов клановых экзаменов',text:'Распространение ответов на вопросы клановых экзаменов'},
{value:'Обзаведение потомством',text:'Обзаведение потомством'}
];
options.forEach(opt=>{
const option=createElement('option',{value:opt.value,textContent:opt.text});
select.appendChild(option);
});
return select;
}

function createHealthSelect(){
const select=createElement('select',{id:'violation'});
const options=[
{value:'',text:'-- выберите нарушение --'},
{value:'Простуда',text:'Простуда'},
{value:'Причинение вреда собственному здоровью',text:'Причинение вреда собственному здоровью'}
];
options.forEach(opt=>{
const option=createElement('option',{value:opt.value,textContent:opt.text});
select.appendChild(option);
});
return select;
}

// Select создатели для отработок
function createCleaningSelect(){
const select=createElement('select',{id:'workoffType'});
const options=[
{value:'',text:'-- выберите отработку --'},
{value:'Уборка кучи с мусором',text:'Уборка кучи с мусором'},
{value:'Чистка локаций, не предназначенных для выхода в оффлайн, от спящих',text:'Чистка локаций от спящих'},
{value:'Чистка куч от падали',text:'Чистка куч от падали'}
];
options.forEach(opt=>{
const option=createElement('option',{value:opt.value,textContent:opt.text});
select.appendChild(option);
});
return select;
}

function createActivitySelect(){
const select=createElement('select',{id:'workoffType'});
const options=[
{value:'',text:'-- выберите отработку --'},
{value:'Посещение Активной охоты',text:'Посещение Активной охоты'},
{value:'5 единиц дичи, пойманной на свободной охоте',text:'5 единиц дичи, пойманной на свободной охоте'},
{value:'Добыча любых целебных ресурсов',text:'Добыча любых целебных ресурсов'},
{value:'Полчаса грушевания',text:'Полчаса грушевания'}
];
options.forEach(opt=>{
const option=createElement('option',{value:opt.value,textContent:opt.text});
select.appendChild(option);
});
return select;
}

function createClanActivitySelect(){
const select=createElement('select',{id:'workoffType'});
const options=[
{value:'',text:'-- выберите отработку --'},
{value:'Вылизал грязного кота',text:'Вылизал грязного кота'},
{value:'Провёл экскурсию по лагерю',text:'Провёл экскурсию по лагерю'},
{value:'Отнёс котёнка попить',text:'Отнёс котёнка попить'},
{value:'Набор 50 единиц боевых умений',text:'Набор 50 единиц боевых умений'},
{value:'Набор 100 единиц активности',text:'Набор 100 единиц активности'}
];
options.forEach(opt=>{
const option=createElement('option',{value:opt.value,textContent:opt.text});
select.appendChild(option);
});
return select;
}

function createErrorsSelect(){
const select=createElement('select',{id:'workoffType'});
const options=[
{value:'',text:'-- выберите отработку --'},
{value:'Нашёл кота с некорректным именем',text:'Нашёл кота с некорректным именем'},
{value:'Нахождение ошибок/неточностей в блогах',text:'Нахождение ошибок/неточностей в блогах'}
];
options.forEach(opt=>{
const option=createElement('option',{value:opt.value,textContent:opt.text});
select.appendChild(option);
});
return select;
}

function createChildPatrolSelect(){
const select=createElement('select',{id:'workoffType'});
const options=[
{value:'',text:'-- выберите отработку --'},
{value:'Сбор ночного детского патруля',text:'Сбор ночного детского патруля'},
{value:'Посещение ночного детского патруля',text:'Посещение ночного детского патруля'},
{value:'Посещение дневного детского патруля',text:'Посещение дневного детского патруля'},
{value:'Сбор дневного детского патруля',text:'Сбор дневного детского патруля'}
];
options.forEach(opt=>{
const option=createElement('option',{value:opt.value,textContent:opt.text});
select.appendChild(option);
});
return select;
}

function createAdultPatrolSelect(){
const select=createElement('select',{id:'workoffType'});
const options=[
{value:'',text:'-- выберите отработку --'},
{value:'Сбор ночного свободного патруля',text:'Сбор ночного свободного патруля'},
{value:'Посещение ночного свободного патруля',text:'Посещение ночного свободного патруля'},
{value:'Посещение дневного планового патруля',text:'Посещение дневного планового патруля'},
{value:'Сбор дневного планового патруля',text:'Сбор дневного планового патруля'},
{value:'Посещение водного патруля',text:'Посещение водного патруля'},
{value:'Сбор водного патруля',text:'Сбор водного патруля'},
{value:'Посещение охотничьего патруля',text:'Посещение охотничьего патруля'},
{value:'Сбор охотничьего патруля',text:'Сбор охотничьего патруля'}
];
options.forEach(opt=>{
const option=createElement('option',{value:opt.value,textContent:opt.text});
select.appendChild(option);
});
return select;
}

function createWatchSelect(){
const select=createElement('select',{id:'workoffType'});
const options=[
{value:'',text:'-- выберите отработку --'},
{value:'Полчаса пассивного свободного дозора',text:'Полчаса пассивного свободного дозора'},
{value:'Полчаса активного свободного дозора',text:'Полчаса активного свободного дозора'}
];
options.forEach(opt=>{
const option=createElement('option',{value:opt.value,textContent:opt.text});
select.appendChild(option);
});
return select;
}

// Генераторы отчетов для нарушений
function generateSafety(){
const violatorId=document.getElementById('violatorId').value;
const violation=document.getElementById('violation').value;
const proof=document.getElementById('proof').value;

if(!violatorId||!violation||!proof){
alert("Заполните все поля!");
return;
}

const result=`[b]Имя нарушителя:[/b] [link${violatorId}]\n[b]Нарушение:[/b] ${violation}\n[b]Доказательство:[/b] ${proof}`;
textarea.value=result;
}

function generateDiscipline(){
const violatorId=document.getElementById('violatorId').value;
const violation=document.getElementById('violation').value;
const proof=document.getElementById('proof').value;

if(!violatorId||!violation||!proof){
alert("Заполните все поля!");
return;
}

const result=`[b]Имя нарушителя:[/b] [link${violatorId}]\n[b]Нарушение:[/b] ${violation}\n[b]Доказательство:[/b] ${proof}`;
textarea.value=result;
}

function generateHealth(){
const violatorId=document.getElementById('violatorId').value;
const violation=document.getElementById('violation').value;
const proof=document.getElementById('proof').value;

if(!violatorId||!violation||!proof){
alert("Заполните все поля!");
return;
}

const result=`[b]Имя нарушителя:[/b] [link${violatorId}]\n[b]Нарушение:[/b] ${violation}\n[b]Доказательство:[/b] ${proof}`;
textarea.value=result;
}

// Генераторы отчетов для отработок
function generateCleaning(){
const playerId=document.getElementById('playerId').value;
const workoffType=document.getElementById('workoffType').value;
const proof=document.getElementById('proof').value;

if(!playerId||!workoffType||!proof){
alert("Заполните все поля!");
return;
}

const result=`Я, [link${playerId}], выполнил(а) отработку: ${workoffType}\n[b]Доказательство:[/b] ${proof}`;
textarea.value=result;
}

function generateActivity(){
const playerId=document.getElementById('playerId').value;
const workoffType=document.getElementById('workoffType').value;
const proof=document.getElementById('proof').value;

if(!playerId||!workoffType||!proof){
alert("Заполните все поля!");
return;
}

const result=`Я, [link${playerId}], выполнил(а) отработку: ${workoffType}\n[b]Доказательство:[/b] ${proof}`;
textarea.value=result;
}

function generateClanActivity(){
const playerId=document.getElementById('playerId').value;
const workoffType=document.getElementById('workoffType').value;
const proof=document.getElementById('proof').value;

if(!playerId||!workoffType||!proof){
alert("Заполните все поля!");
return;
}

const result=`Я, [link${playerId}], выполнил(а) отработку: ${workoffType}\n[b]Доказательство:[/b] ${proof}`;
textarea.value=result;
}

function generateErrors(){
const playerId=document.getElementById('playerId').value;
const workoffType=document.getElementById('workoffType').value;
const errorCatId=document.getElementById('errorCatId').value;
const proof=document.getElementById('proof').value;

if(!playerId||!workoffType||!proof){
alert("Заполните все обязательные поля!");
return;
}

let result=`Я, [link${playerId}], выполнил(а) отработку: ${workoffType}`;
if(errorCatId&&workoffType==='Нашёл кота с некорректным именем'){
result+=` (ID кота: [link${errorCatId}])`;
}
result+=`\n[b]Доказательство:[/b] ${proof}`;
textarea.value=result;
}

function generateChildPatrol(){
const playerId=document.getElementById('playerId').value;
const workoffType=document.getElementById('workoffType').value;
const proof=document.getElementById('proof').value;

if(!playerId||!workoffType||!proof){
alert("Заполните все поля!");
return;
}

const result=`Я, [link${playerId}], выполнил(а) отработку: ${workoffType}\n[b]Доказательство:[/b] ${proof}`;
textarea.value=result;
}

function generateAdultPatrol(){
const playerId=document.getElementById('playerId').value;
const workoffType=document.getElementById('workoffType').value;
const proof=document.getElementById('proof').value;

if(!playerId||!workoffType||!proof){
alert("Заполните все поля!");
return;
}

const result=`Я, [link${playerId}], выполнил(а) отработку: ${workoffType}\n[b]Доказательство:[/b] ${proof}`;
textarea.value=result;
}

function generateWatch(){
const playerId=document.getElementById('playerId').value;
const workoffType=document.getElementById('workoffType').value;
const proof=document.getElementById('proof').value;

if(!playerId||!workoffType||!proof){
alert("Заполните все поля!");
return;
}

const result=`Я, [link${playerId}], выполнил(а) отработку: ${workoffType}\n[b]Доказательство:[/b] ${proof}`;
textarea.value=result;
}

// Вспомогательные функции
function createElement(type,attributes={}){
const element=document.createElement(type);
Object.keys(attributes).forEach(key=>{
element[key]=attributes[key];
});
return element;
}

function createLabel(id,labelText){
const label=createElement('label',{htmlFor:id});
label.textContent=labelText;
return label;
}

function createInput(id,type,placeholder=''){
const input=createElement('input',{id,type,placeholder});
return input;
}

function createButton(value,onclick){
const button=createElement('input',{
type:'button',
value:value
});
button.addEventListener('click',onclick);
return button;
}

function clearForm(){
while(forms.firstChild){
forms.removeChild(forms.firstChild);
}
}

function generateForm(elements,place){
elements.forEach(item=>{
if(item.customFunction){
if(item.label){
place.appendChild(createLabel(item.id,item.label));
}
place.appendChild(item.customFunction());
}else{
if(item.label){
place.appendChild(createLabel(item.id,item.label));
}
const input=createInput(item.id,item.inputType,item.placeholder);
place.appendChild(input);
}
if(item.br){
place.appendChild(document.createElement('br'));
}
});
}

// Стили
const customStyles=createElement('style');
customStyles.textContent=`
.form{
background:#cad0de;
padding:15px;
border-radius:8px;
border:1px solid #a7b3c3;
margin:10px 0;
}
.forms-container{
background:#eaeff6;
padding:15px;
border-radius:8px;
border:1px solid #a7b3c3;
margin:10px 0;
}
.section{
margin:10px 0;
border:1px solid #a7b3c3;
border-radius:8px;
background:#eaeff6;
}
.section-header{
background:#2b323b;
color:#ffffff;
padding:12px;
cursor:pointer;
user-select:none;
font-size:16px;
font-weight:bold;
border-radius:8px 8px 0 0;
}
.section-header:hover{
background:#3a4450;
}
.section-content{
padding:15px;
background:#eaeff6;
border-radius:0 0 8px 8px;
}
.section-content input[type="button"]{
margin:5px;
padding:8px 16px;
background:#a7b3c3;
color:#2b323b;
border:none;
border-radius:4px;
cursor:pointer;
font-weight:bold;
}
.section-content input[type="button"]:hover{
background:#969fb0;
}
.form input,.form select,.form button,.form label{
margin:3px 5px 3px 0;
}
.forms-container input,.forms-container select,.forms-container button,.forms-container label{
margin:3px 5px 3px 0;
}
.form input[type="text"],.form input[type="date"],.form input[type="time"],.form input[type="number"]{
padding:4px;
border:1px solid #a7b3c3;
border-radius:3px;
background:#ffffff;
color:#2b323b;
}
.forms-container input[type="text"],.forms-container input[type="date"],.forms-container input[type="time"],.forms-container input[type="number"]{
padding:4px;
border:1px solid #a7b3c3;
border-radius:3px;
background:#ffffff;
color:#2b323b;
}
.form select,.forms-container select{
padding:4px;
border:1px solid #a7b3c3;
border-radius:3px;
background:#ffffff;
color:#2b323b;
}
h2,h3{
margin:8px 0;
color:#2b323b;
}
h2{
background:#2b323b;
color:#ffffff;
padding:10px;
border-radius:5px;
text-align:center;
}
h3{
background:#2b323b;
color:#ffffff;
padding:8px;
border-radius:4px;
}
label{
color:#2b323b;
font-weight:bold;
}
.info-message{
background:#fff3cd;
border:1px solid #ffeaa7;
border-radius:4px;
padding:10px;
margin:10px 0;
color:#856404;
font-size:14px;
}
.warning{
text-align:center;
font-size:12px;
color:#ffffff;
margin:10px 0;
font-style:italic;
background:#2b323b!important;
padding:8px;
border-radius:4px;
}
.version-info{
text-align:center;
font-size:14px;
color:#ffffff;
margin:10px 0;
padding:8px;
background:#2b323b;
border-radius:4px;
}
`;
document.head.appendChild(customStyles);

})();