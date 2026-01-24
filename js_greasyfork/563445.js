// ==UserScript==
// @name         Скрипт на обжалования | KAZAN
// @namespace    https://forum.blackrussia.online
// @version      1.3
// @description  Скрипт для сервера KAZAN.
// @author       ɴɪᴋᴀ ᴀᴄᴏᴠᴇʀʀʏ
// @match        *://forum.blackrussia.online/threads/*
// @match        *://*.forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @icon         https://i.postimg.cc/h4Cx53SK/image.png
// @downloadURL https://update.greasyfork.org/scripts/563445/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BD%D0%B0%20%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%7C%20KAZAN.user.js
// @updateURL https://update.greasyfork.org/scripts/563445/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BD%D0%B0%20%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%7C%20KAZAN.meta.js
// ==/UserScript==


(function () {
  'use strict';


  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;


  function addGlobalStyle(css) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  addGlobalStyle(`
  :root {
  --btn-bg: #2a0b1c;
  --btn-bg-hover: #3a0f28;
  --btn-border: #ff7ab6;
  --btn-border-hover: #ffb3d9;
  --btn-shadow: 0 8px 22px rgba(255, 105, 180, 0.22);

  --card-bg: #12000a;
  --card-border: #ff7ab6;
  --card-shadow: 0 18px 40px rgba(255, 105, 180, 0.22);

  --accent-blue: #ff5fa2;
  --accent-cyan: #ffb3d9;

  --text-main: #fff7fb;
  --text-soft: #ffe3f1;
  --text-muted: #ffc1de;
}


    .persona-btn,
    .persona-answer-btn,
    .persona-answer-divider,
    .select_answer_container .overlay-title,
    .select_answer_container .overlay-content,
    .br-zga-ny-garland span {
      font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
      font-weight: 600;
      letter-spacing: 0.01em;
      -webkit-tap-highlight-color: transparent;
    }

   
    .persona-btn {
      border-radius: 999px;
      border: 1px solid var(--btn-border);
      color: var(--text-main);
      padding: 9px 18px;
      margin: 6px 6px !important;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      outline: none;
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 55%),
        radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.18), transparent 60%),
        var(--btn-bg);
      box-shadow: var(--btn-shadow);
      transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, border-color 0.15s ease-out, background 0.15s ease-out, color 0.15s ease-out;
      touch-action: manipulation;
      user-select: none;
    }

    .persona-btn::before,
    .persona-btn::after { content: none !important; }

  .persona-btn:hover {
  transform: translateY(-1px);
  border-color: #ffffff;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.35);
  color: #020617;
}


    .persona-btn:active {
      transform: translateY(0) scale(0.98);
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.85);
    }

   
    .select_answer_container .overlay-content {
      background: var(--card-bg);
      border-radius: 16px;
      border: 1px solid var(--card-border);
      box-shadow: var(--card-shadow);
      max-width: min(980px, 94vw);
    }

    .select_answer_container .overlay-title {
      color: var(--text-soft);
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 8px;
      text-shadow: none;
    }

    .select_answer_container .overlay-title::before { content: none !important; }

    .select_answer {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      padding: 18px 18px 20px;
    }

    .persona-answer-btn {
      background: #020617;
      border-radius: 12px;
      border: 1px solid var(--btn-border);
      color: var(--text-soft);
      padding: 11px 12px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      min-width: 170px;
      text-align: center;
      box-shadow: 0 10px 22px rgba(15, 23, 42, 0.85);
      transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, border-color 0.15s ease-out, background 0.15s ease-out, color 0.15s ease-out;
      touch-action: manipulation;
      user-select: none;
    }

   .persona-answer-btn:hover {
  transform: translateY(-2px);
  border-color: #ffffff;
  background: #ffffff;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.35);
  color: #020617;
}


    .persona-answer-divider {
      width: 100%;
      text-align: center;
      color: var(--text-muted);
      font-weight: 900;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1.1px;
      margin: 14px 0 6px 0;
      border-bottom: 1px solid rgba(148, 163, 184, 0.45);
      padding-bottom: 6px;
      user-select: none;
      position: relative;
    }

    .persona-answer-divider::before,
    .persona-answer-divider::after {
      position: absolute;
      top: -2px;
      font-size: 10px;
    }
    .persona-answer-divider::before { content: "•"; left: 0; color: rgba(255, 95, 162, 0.85); }
    .persona-answer-divider::after  { content: "•"; right: 0; color: rgba(255, 179, 217, 0.95); }



    .br-zga-ny-garland {
      display: flex;
      justify-content: center;
      font-size: 13px;
      margin-bottom: 6px;
      margin-top: 8px;
      user-select: none;
    }

    .br-zga-ny-garland span {
      color: var(--text-soft);
      background: #020617;
      padding: 4px 11px;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.55);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.85);
      white-space: nowrap;
      max-width: 92vw;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    @media (max-width: 768px) {
      .persona-btn { padding: 10px 16px; font-size: 14px; margin: 6px 4px !important; }
      .select_answer { padding: 12px; gap: 10px; }
      .persona-answer-btn { font-size: 14px; padding: 12px 10px; min-width: 46%; }
      .select_answer_container .overlay-content { max-width: 96vw; }
    }

    @media (max-width: 420px) {
      .persona-answer-btn { min-width: 100%; }
    }

    
    .formButtonGroup,
    .formButtonGroup-primary { display:flex; align-items:center; justify-content:center; gap:6px; }
    .formButtonGroup button,
    .formButtonGroup .button,
    .formButtonGroup-primary button,
    .formButtonGroup-primary .button { display:inline-flex; align-items:center; justify-content:center; text-align:center; }
    .formButtonGroup button::before,
    .formButtonGroup button::after,
    .formButtonGroup .button::before,
    .formButtonGroup .button::after,
    .formButtonGroup-primary button::before,
    .formButtonGroup-primary button::after,
    .formButtonGroup-primary .button::before,
    .formButtonGroup-primary .button::after { content:none !important; }
  `);


  const PREFIXES = {
    UNACCEPT: 4,
    ACCEPT: 8,
    PIN: 2,
    COMMAND: 10,
    WATCHED: 9,
    CLOSE: 7,
    GA: 12,
    SPECADM: 11,
    DECIDED: 6,
    MAINADM: 12,
    TECHADM: 13,
    CHECKED: 9
  };

const topImage = `[CENTER][IMG]https://i.postimg.cc/tg2f3qFM/1.png[/IMG][/CENTER]`;
const bottomImage = `[CENTER][IMG]https://i.postimg.cc/tg2f3qFM/1.png[/IMG][/CENTER]`;


  const wrapTemplate = (content) =>
    `${topImage}\n\n[CENTER][FONT=georgia][SIZE=4]${content}[/SIZE][/FONT][/CENTER]\n\n${bottomImage}`;


  const buttons = [


    { title: 'Отказы по форме и правилам', isDivider: true },
    {
      title: `Не указан VK`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br>Ваше обжалование [COLOR=rgb(255, 0, 0)]отклонено[/COLOR], так как не был указан аккаунт VK.<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.CLOSE,
      status: false
    },
    {
      title: `Жалоба на Администрацию`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Если вы не согласны с выданным наказанием, обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1274/']«Жалобы на Администрацию»[/URL].<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.CLOSE,
      status: false
    },
    {
      title: `Дубликат`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ответ на своё обжалование вы уже получили в предыдущей теме.<br>Напоминаем, при трёх дублированиях форумный аккаунт будет заблокирован.<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.CLOSE,
      status: false
    },
    {
      title: `Жб на теха`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9627-kazan.1289/']«Жалобы на Технических Специалистов»[/URL].<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.CLOSE,
      status: false
    },
    {
      title: `Ошибка сервера`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Пожалуйста, обратитесь в раздел «Обжалование наказаний» своего сервера.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `От третьего лица`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение составлено от третьего лица и не подлежит рассмотрению.<br>Рекомендую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']правилами подачи[/URL] обжалования.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `Нет скриншота бана`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Для рассмотрения обжалования предоставьте скриншот окна блокировки с сервера.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.CLOSE,
      status: false
    },
    {
      title: `Не по форме`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение составлено не по форме.<br>Создайте новую тему, придерживаясь следующего шаблона:<br>[QUOTE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть заявки:<br>5. Доказательство:[/QUOTE]<br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `Док-ва из соцсетей`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Доказательства из социальных сетей не принимаются. Вам необходимо загрузить их на сервис [URL='https://imgur.com/']imgur.com[/URL] и создать новую тему.<br><br>Рекомендую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']правилами подачи[/URL] обжалования.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `Нет доказательств`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Вы не предоставили скриншот выдачи наказания от администратора. Обращение не подлежит рассмотрению.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `Неработающая ссылка`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Предоставленная вами ссылка недействительна или не работает. Создайте новую тему и убедитесь, что ссылка открывается корректно.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `Ошибочный раздел`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение не соответствует тематике данного раздела.<br><br>Полезные ссылки:<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1275/']Жалобы на лидеров[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1276/']Жалобы на игроков[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-kazan.1290/']Технический раздел сервера[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1274/']Жалобы на Администрацию[/URL]<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },


    { title: 'Отказы по сути', isDivider: true },
    {
      title: `Не подлежит обжалованию`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>К сожалению, данное наказание не подлежит обжалованию.<br>[COLOR=rgb(255, 0, 0)]Нарушения, по которым заявка не рассматривается:[/COLOR]<br>[QUOTE]4.1. различные формы "слива";<br>4.2. продажа игровой валюты;<br>4.3. махинации;<br>4.4. целенаправленный багоюз;<br>4.5. продажа, передача аккаунта;<br>4.6. сокрытие ошибок, багов системы;<br>4.7. использование стороннего программного обеспечения;<br>4.8. распространение конфиденциальной информации;<br>4.9. обман администрации.[/QUOTE]Рекомендую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']правилами подачи[/URL] обжалования.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `Отказано`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>В обжаловании вашего наказания — [COLOR=red]отказано.[/COLOR] Мы не готовы пойти к вам на встречу.<br><br>Пожалуйста, помните:<br>[QUOTE]• Каждая заявка на обжалование рассматривается индивидуально.<br>• Оформленная заявка не означает гарантированного одобрения со стороны руководства сервера.[/QUOTE]<br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `Обжаловалось ранее`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Вы уже получили шанс на обжалование своего наказания, срок уже был снижен.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `Наказание выдано верно`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Наказание было выдано верно.<br>В обжаловании вашего наказания — [COLOR=red]отказано.[/COLOR] Мы не готовы пойти к вам на встречу.<br><br>Пожалуйста, помните:<br>[QUOTE]• Каждая заявка на обжалование рассматривается индивидуально.<br>• Оформленная заявка не означает гарантированного одобрения со стороны руководства сервера.[/QUOTE]<br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `Минимальное наказание`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Вам уже было выдано минимальное наказание за совершённое нарушение.<br>В обжаловании вашего наказания — [COLOR=red][ICODE]отказано.[/ICODE][/COLOR]`),
      prefix: PREFIXES.UNACCEPT,
      status: false
    },
    {
      title: `Обман`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Данное наказание можно обжаловать только при условии выдачи компенсации пострадавшей стороне. Для этого свяжитесь с обманутым игроком и обсудите условия.<br>[U]Примечание:[/U] обманутый игрок должен подтвердить ваши слова в игре.<br>[COLOR=red]Любые попытки обмана администрации будут наказаны блокировкой форумного аккаунта.[/COLOR]<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
      prefix: PREFIXES.CLOSE,
      status: false
    },

    { title: 'Одобрения', isDivider: true },
    {
      title: `Снижено до минимума`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обжалование — [color=lightgreen]одобрено.[/color] Наказание будет снижено до минимальных мер.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.`),
      prefix: PREFIXES.ACCEPT,
      status: false
    },
    {
      title: `Полностью снято`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет полностью снято.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`),
      prefix: PREFIXES.ACCEPT,
      status: false
    },
    {
      title: `Снижено до 7 дней`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 7 дней блокировки аккаунта.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`),
      prefix: PREFIXES.ACCEPT,
      status: false
    },
    {
      title: `Снижено до 15 дней`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 15 дней блокировки аккаунта.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`),
      prefix: PREFIXES.ACCEPT,
      status: false
    },
    {
      title: `Снижено до 30 дней`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 30 дней блокировки аккаунта.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`),
      prefix: PREFIXES.ACCEPT,
      status: false
    },
    {
      title: `Наказание выдано ошибочно`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше наказание было выдано по ошибке администратора и будет снято.<br>С администратором будет проведена профилактическая беседа. Приношу извинения за доставленные неудобства.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`),
      prefix: PREFIXES.ACCEPT,
      status: false
    },

    { title: 'На рассмотрении / Передача', isDivider: true },
    {
      title: `Возврат ущерба`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваш аккаунт будет разблокирован для выдачи компенсации пострадавшей стороне. Весь процесс необходимо фиксировать на запись экрана с командой /time. У вас есть 24 часа на ответ после совершения сделки.<br>Напоминаю: попытки передачи имущества на другие аккаунты будут строго наказываться, и вы можете лишиться права на обжалование.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
      prefix: PREFIXES.PIN,
      status: true
    },
    {
      title: `На рассмотрении`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение находится на рассмотрении администрации сервера.<br>Просим не создавать дубликаты. Ответ будет дан в этой теме, как только это будет возможно. Благодарим за ожидание.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
      prefix: PREFIXES.PIN,
      status: true
    },
    {
      title: `Нужна ссылка на VK`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение находится на рассмотрении администрации.<br>Пожалуйста, предоставьте ссылку на вашу страницу ВКонтакте.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
      prefix: PREFIXES.PIN,
      status: true
    },
    {
      title: `Передано Спец. Администрации`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение было передано [COLOR=red]Специальной администрации проекта.[/COLOR]<br>Иногда рассмотрение таких обращений занимает больше времени. Настоятельно рекомендуем вам не создавать дубликаты. Ответ будет дан в данной теме, как только это будет возможно.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
      prefix: PREFIXES.SPECADM,
      status: true
    },
    {
      title: `Передано Руководству`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обжалование было передано [COLOR=yellow]Руководству модерации.[/COLOR]<br>Иногда рассмотрение таких обжалований занимает больше времени, чем 3 дня. Настоятельно рекомендуем вам не создавать дубликаты. Ответ будет дан в данной теме, как только это будет возможно.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
      prefix: PREFIXES.COMMAND,
      status: true
    },
    {
      title: `Передано Главному Администратору`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обжалование было передано [COLOR=red]Главному администратору.[/COLOR]<br><br>[COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
      prefix: PREFIXES.GA,
      status: true
    },
    {
      title: `Смена никнейма`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваш аккаунт будет разблокирован на 24 часа. За это время вам необходимо сменить никнейм. Если вы не выполните это условие, аккаунт будет заблокирован без права на амнистию.<br><br>[COLOR=red][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
      prefix: PREFIXES.PIN,
      status: true
    },
    {
      title: `Проверка ППВ`,
      content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Для проверки аккаунта предоставьте следующую информацию:<br>— Город регистрации аккаунта:<br>— Дата регистрации аккаунта:<br>— Сколько донатили на свой аккаунт?<br>— Провайдер интернета при регистрации аккаунта:<br>— Город, в котором проживаете на данный момент:<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
      prefix: PREFIXES.PIN,
      status: true
    }
  ];

  const shortcuts = {
    rps: "[CENTER][IMG]https://i.postimg.cc/5tctzDgF/022-EB1-E9-5-C30-402-A-81-D4-08-C349-A08-FFF.gif[/IMG]\n\n[COLOR=#F40] Зде[/COLOR][COLOR=#F50]сь[/COLOR] [COLOR=#F50]б[/COLOR][COLOR=#F60]ыл[/COLOR] [COLOR=#F60]Т[/COLOR][COLOR=#F70]от[/COLOR][COLOR=#F70]с[/COLOR][COLOR=#F80]амы[/COLOR][COLOR=#F90]й[/COLOR] [COLOR=#F90]Ра[/COLOR][COLOR=#FA0]сул.[/COLOR] [COLOR=#FB0]Кто[/COLOR] [COLOR=#FC0]зна[/COLOR][COLOR=#FD0]ет[/COLOR] [COLOR=#FD0]-[/COLOR] [COLOR=#FD0]по[/COLOR][COLOR=#FC0]ймёт.[/COLOR] [COLOR=#FC0]Кт[/COLOR][COLOR=#FC1]о[/COLOR] [COLOR=#FC1]н[/COLOR][COLOR=#FB1]е[/COLOR] [COLOR=#FB1]знает—[/COLOR] [COLOR=#FB1]у[/COLOR][COLOR=#FA2]знает.[/COLOR]\n\n[IMG align=\"right\" width=\"150px\"]https://i.postimg.cc/wjvfKwYC/Rasul-cocosign-2.png[/IMG][/CENTER]",
    ost: "[B][FONT=book antiqua]Оставил[/FONT][/B]"
  };


  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '16px',
      color: 'white',
      background: type === 'success'
        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
        : 'linear-gradient(135deg, #ef4444, #b91c1c)',
      boxShadow: '0 18px 40px rgba(15,23,42,0.9)',
      zIndex: '99999',
      opacity: '0',
      transform: 'translateX(100%)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      fontSize: '14px',
      fontWeight: '600'
    });
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 2600);
  }


  function addButton(name, id) {
    const replyBtn = document.querySelector('.button--icon--reply');
    if (!replyBtn || !replyBtn.parentNode) return;
    if (document.getElementById(id)) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button rippleButton persona-btn';
    btn.id = id;
    btn.textContent = name;
    replyBtn.parentNode.insertBefore(btn, replyBtn);
  }

  function addNewYearGarland() {
    const replyBtn = document.querySelector('.button--icon--reply');
    if (!replyBtn || !replyBtn.parentNode) return;
    if (document.querySelector('.br-zga-ny-garland')) return;

    const container = replyBtn.parentNode.parentNode;
    const garland = document.createElement('div');
    garland.className = 'br-zga-ny-garland';
    garland.innerHTML = `<span>ɴɪᴋᴀ ᴀᴄᴏᴠᴇʀʀʏ</span>`;
    container.insertBefore(garland, replyBtn.parentNode);
  }

  function buttonsMarkup(buttonsArr) {
    return `<div class="select_answer">${buttonsArr.map((btn, i) =>
      btn.isDivider
        ? `<div class="persona-answer-divider">${btn.title}</div>`
        : `<button id="answers-${i}" class="persona-answer-btn"><span class="button-text">${btn.title}</span></button>`
    ).join('')}</div>`;
  }


  function pasteContent(id, data = {}, send = false) {
    const btn = buttons[id];
    if (!btn || !btn.content) {
      console.error('Button content not found');
      return;
    }

    if (typeof Handlebars === 'undefined') {
      setTimeout(() => pasteContent(id, data, send), 150);
      return;
    }

    try {
      const compiled = Handlebars.compile(btn.content);
      const $ = window.jQuery;
      const editorElement = $ ? $('.fr-element.fr-view') : null;

      if (!editorElement || !editorElement.length) {
        showNotification('Редактор сообщения не найден.', 'error');
        return;
      }

      editorElement.html(compiled(data));

      if (send) {
        if (btn.prefix) editThreadData(btn.prefix, btn.status);
        setTimeout(() => {
          $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }, 250);
      }
    } catch (e) {
      console.error('Error pasting content', e);
      showNotification('Ошибка при вставке контента.', 'error');
    }
  }

  async function getThreadData() {
    const $ = window.jQuery;
    const authorLink = $ ? $('a.username').first() : null;
    if (!authorLink || !authorLink.length) throw new Error('Author link not found');

    const authorID = authorLink.attr('data-user-id');
    const authorName = authorLink.text().trim();

    const hours = new Date().getHours();
    const greeting =
      hours >= 5 && hours <= 11 ? 'Доброе утро' :
      hours >= 12 && hours <= 17 ? 'Добрый день' :
      hours >= 18 && hours <= 22 ? 'Добрый вечер' :
      'Доброй ночи';

    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`
      },
      greeting
    };
  }

  function getFormData(data) {
    const formData = new FormData();
    Object.keys(data).forEach((k) => formData.append(k, data[k]));
    return formData;
  }


  function editThreadData(prefix, pin = false) {
    if (typeof XF === 'undefined' || !XF.config) {
      showNotification('XF недоступен. Вы не на странице темы?', 'error');
      return;
    }

    const titleEl = document.querySelector('.p-title-value');
    const threadTitle = titleEl && titleEl.lastChild ? titleEl.lastChild.textContent.trim() : null;
    if (!threadTitle) {
      showNotification('Название темы не найдено.', 'error');
      return;
    }

    const fullBase = XF.config.url && XF.config.url.fullBase ? XF.config.url.fullBase : '';
    let requestUri = document.location.pathname + document.location.search;
    if (fullBase && document.URL.indexOf(fullBase) === 0) {
      requestUri = document.URL.substring(fullBase.length);
    }

    const bodyData = {
      prefix_id: prefix,
      title: threadTitle,
      _xfToken: XF.config.csrf,
      _xfRequestUri: requestUri,
      _xfWithData: 1,
      _xfResponseType: 'json'
    };
    if (pin) bodyData.sticky = 1;

    fetch(`${document.URL}edit`, { method: 'POST', body: getFormData(bodyData) })
      .then((r) => {
        if (!r.ok) throw new Error('Network error');
        return r.json();
      })
      .then((data) => {
        if (data.status === 'ok') {
          showNotification('Статус темы успешно изменён!', 'success');
          setTimeout(() => location.reload(), 1400);
        } else {
          showNotification('Ошибка при изменении темы.', 'error');
        }
      })
      .catch((e) => {
        console.error('Fetch error', e);
        showNotification('Сетевая ошибка или ошибка API.', 'error');
      });
  }


  function init() {
    const $ = window.jQuery;
    if (!$ || typeof XF === 'undefined') {
      setTimeout(init, 120);
      return;
    }

    addNewYearGarland();


    if (!document.querySelector('script[src*="handlebars"]')) {
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
    }


    addButton('Ответы', 'selectAnswer');
    addButton('Закрепить', 'pin');
    addButton('Одобрить', 'accepted');
    addButton('Отказать', 'unaccept');
    addButton('КП', 'teamProject');
    addButton('Закрыть', 'closed');
    addButton('Спец.А', 'specialAdmin');
    addButton('Проверено', 'checked');


    $('#unaccept').on('click', () => editThreadData(PREFIXES.UNACCEPT, false));
    $('#pin').on('click', () => editThreadData(PREFIXES.PIN, true));
    $('#accepted').on('click', () => editThreadData(PREFIXES.ACCEPT, false));
    $('#teamProject').on('click', () => editThreadData(PREFIXES.COMMAND, true));
    $('#specialAdmin').on('click', () => editThreadData(PREFIXES.SPECADM, true));
    $('#checked').on('click', () => editThreadData(PREFIXES.CHECKED, false));
    $('#closed').on('click', () => editThreadData(PREFIXES.CLOSE, false));


    $('#selectAnswer').on('click', async () => {
      try {
        const data = await getThreadData();
        if (typeof XF === 'undefined' || !XF.alert) {
          alert('Невозможно открыть список ответов (XF.alert недоступен).');
          return;
        }

        XF.alert(buttonsMarkup(buttons), null, 'Выберите готовый ответ:', 'select_answer_container');

        buttons.forEach((btn, id) => {
          if (btn.isDivider) return;
          $(`button#answers-${id}`).on('click', () => {
            pasteContent(id, data, true);
            $('a.overlay-titleCloser').trigger('click');
          });
        });
      } catch (e) {
        console.error('Error getThreadData', e);
        showNotification('Ошибка при получении данных темы.', 'error');
      }
    });


    $(document).on('keydown', (e) => {
      if (!e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
      const key = e.key.toLowerCase();
      let shortcutKey = null;
      if (key === 'r') shortcutKey = 'rps';
      if (key === 'o') shortcutKey = 'ost';
      if (!shortcutKey) return;

      const editorElement = $('.fr-element.fr-view');
      const contentToPaste = shortcuts[shortcutKey];
      if (editorElement.length && contentToPaste) {
        e.preventDefault();
        editorElement.html(contentToPaste);
      }
    });

    console.log('%c[KAZAN Appeals] ZGA+ style loaded. Mobile:', 'color:#22c55e', isMobile);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
