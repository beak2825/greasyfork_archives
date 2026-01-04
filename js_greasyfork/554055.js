// ==UserScript==
// @name         tickettable
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  buttonticketproject
// @author       v.kondrateya
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/554055/tickettable.user.js
// @updateURL https://update.greasyfork.org/scripts/554055/tickettable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Общие стили для обеих кнопок
    const buttonStyles = {
        position: 'fixed',
        right: '10px',
        zIndex: 10000,
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    // =======================
    // Первая кнопка: "Поиск проекты"
    // =======================

    const searchProjectsBtn = document.createElement('button');
    searchProjectsBtn.innerText = 'Поиск проекты';
    Object.assign(searchProjectsBtn.style, buttonStyles);
    searchProjectsBtn.style.bottom = '10px'; // Расположена внизу
    document.body.appendChild(searchProjectsBtn);

    // Создаем модальное окно для поиска проектов
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '520px',
        maxHeight: '80%',
        overflowY: 'auto',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius:'10px',
        boxShadow:'0 4px 12px rgba(0,0,0,0.3)',
        zIndex:'10001',
        display:'none'
    });
    document.body.appendChild(modal);

    let modalVisible = false;
    searchProjectsBtn.addEventListener('click', () => {
        modalVisible = !modalVisible;
        modal.style.display = modalVisible ? 'block' : 'none';
    });

    // Внутри модального окна
let clientSerchTel = '';
let clientSearchEmail = '';

const inputContainer = document.createElement('div');
inputContainer.style.marginBottom='8px';

const inputLabel = document.createElement('div');
inputLabel.innerText='Введите номер телефона или email';
inputLabel.style.fontSize='12px';
inputLabel.style.color='#555';

const inputField = document.createElement('input');
inputField.type='text';
inputField.placeholder='Телефон или email';
Object.assign(inputField.style,{
    width:'100%',
    padding:'6px 8px',
    fontSize:'14px',
    border:'1px solid #ccc',
    borderRadius:'4px'
});

inputContainer.appendChild(inputLabel);
inputContainer.appendChild(inputField);
modal.appendChild(inputContainer);

const buttonsContainer = document.createElement('div');
Object.assign(buttonsContainer.style, {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 колонки
    gap: '10px', // промежутки между кнопками
    marginTop: '15px'
});

modal.appendChild(buttonsContainer);

// Массив шаблонов для ссылок
const linksDataTemplate= [
   { text:'Rox', label:'rox' },
   { text:'Sol', label:'sol' },
   { text:'Jet', label:'jet' },
   { text:'Fresh', label:'fresh' },
   { text:'Izzi', label:'izzi' },
   { text:'Legzo', label:'legzo' },
   { text:'Starda', label:'starda' },
   { text:'Drip', label:'drip' },
   { text:'Monro', label:'monro' },
   { text:'1go', label:'1go' },
   { text:'Lex', label:'lex' },
   { text:'Gizbo', label:'gizbo' },
   { text:'Irwin', label:'irwin' },
   { text:'Flagman', label:'flagman' },
];

let links=[];

function generateLinks() {
   links=[];
   linksDataTemplate.forEach(item => {
       links.push({
           text:item.text,
           label:item.label,
           url:`https://admin.crimson.${item.label}.prd.maxbit.private/admin/players?order=id_desc&q%5B${clientSerchTel?'phones_number_cont':'email_cont'}%5D=${encodeURIComponent(clientSerchTel||clientSearchEmail)}&scope=all`
       });
   });
}

function clearButtons() {
   buttonsContainer.innerHTML='';
}

function createButton(linkInfo) {
   const btn=document.createElement('button');
   btn.innerText=linkInfo.text;
   Object.assign(btn.style,{
       margin:'5px',
       padding:'8px 12px',
       borderRadius:'4px',
       border:'none',
       backgroundColor:'#007bff',
       color:'#fff',
       cursor:'pointer'
   });
   btn.addEventListener('click', ()=> {
       if(linkInfo.text==='так так'){
           alert('Хорошего дня и побольше улыбок!');
       } else if(linkInfo.text==='Все'){
           // Эта кнопка убрана, можно оставить пустым или убрать
       } else if(linkInfo.text==='All'){
           links.forEach(li => openLink(li.label));
       } else {
           openLink(linkInfo.label);
       }
   });
   return btn;
}

function renderButtons() {
   clearButtons();
   links.forEach(li => {
       const btn=createButton(li);
       buttonsContainer.appendChild(btn);
   });
}

function updateLinks() {
   generateLinks();
   renderButtons();
}

function openLink(label) {
 const searchParam=clientSerchTel?'phones_number_cont':'email_cont';
 const searchValue=clientSerchTel||clientSearchEmail;
 const url=`https://admin.crimson.${label}.prd.maxbit.private/admin/players?order=id_desc&q%5B${searchParam}%5D=${encodeURIComponent(searchValue)}&scope=all`;
 window.open(url,'_blank');
}

// Обработка ввода
inputField.addEventListener('input', ()=> {
 const val=inputField.value.trim();
 if(/^\d+$/.test(val)){
     clientSerchTel=val;
     clientSearchEmail='';
 } else{
     clientSearchEmail=val;
     clientSerchTel='';
 }
 updateLinks();
});

// =======================
// Вторая часть: "Поиск тикетов"
// =======================

// Функция для получения email из элемента с id="enhancerLinkElem"
function getEmail() {
    const emailLink = document.querySelector('#enhancerLinkElem');
    if (emailLink) {
        return emailLink.innerText.trim();
    }
    return null;
}

// Создаем кнопку "Поиск тикетов"
const ticketBtn = document.createElement('button');
ticketBtn.innerText = 'Поиск тикетов';

// Общие стили для обеих кнопок (чтобы было одинаково)
Object.assign(ticketBtn.style, buttonStyles);
// Расположим чуть выше первой кнопки (например, на 60 пикселей от низа)
ticketBtn.style.bottom='60px';

document.body.appendChild(ticketBtn);

// Обработчик клика по второй кнопке
ticketBtn.addEventListener('click', () => {
    const email = getEmail();

    if (email) {
        const encodedEmail = encodeURIComponent(email);
        const url=`https://supdeskt.atlassian.net/servicedesk/customer/user/requests?filter=${encodedEmail}&page=1&reporter=all&statuses=open&statuses=closed`;
        GM_openInTab(url, { active:true });

// Можно оставить уведомление или убрать
// GM_notification({text: 'Открыт запрос по email', timeout:3000});

} else {
// Можно оставить уведомление или убрать
// GM_notification({text: 'Электронная почта не найдена', timeout:3000});
alert('Электронная почта не найдена на странице.');
}
});

})();
