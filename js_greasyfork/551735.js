// ==UserScript==
// @name                ORANGE | Skript for me
// @namespace           https://forum.blackrussia.online
// @version             1.5.3
// @author              Dany_Forbs
// @connection          https://vk.com/kwaazzi
// @updateversion       Создан 06.10.2025
// @match               https://forum.blackrussia.online/threads/*
// @include             https://forum.blackrussia.online/threads/
// @license             MIT
// @icon                https://i.postimg.cc/tRx0hF8P/01fdde7ae0d9dd957948e83fc946ff29.jpg
// @description         Эта моё
// @downloadURL https://update.greasyfork.org/scripts/551735/ORANGE%20%7C%20Skript%20for%20me.user.js
// @updateURL https://update.greasyfork.org/scripts/551735/ORANGE%20%7C%20Skript%20for%20me.meta.js
// ==/UserScript==
 
(function () {
'esversion 6' ;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const TECH_PREFIX = 13; // Префикс "Тех. специалисту"
    const WAIT_PREFIX = 14; // Префикс "Ожидание"
    const PINBIO_PREFIX = 15; // Префикс "На рассмотрении" для биографий (закреплено + открыто)
    const buttons = [
    {
    title: '------> Раздел Жалоб на игроков <------',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6); background: linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFD700 50%, #B8860B 75%, #D4AF37 100%); border: 2px solid #FFD700; border-radius: 10px; box-shadow: 0 0 14px rgba(255, 215, 0, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 4px 0 #8B6914, 0 6px 12px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'Приветствие + свой текст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(255, 0, 0, 0.8); font-family: UtromPressKachat',
    content: 
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR]![/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[COLOR=#FFA500]▪ (Свой текст)[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br><br>' +
          '[COLOR=#B8860B]С уважением, [B]администрация сервера![/B][/COLOR]' +
          '[/FONT][/CENTER]'
},
{
    title: 'ГКФ | ЗГКФ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(0, 0, 255, 0.8); font-family: UtromPressKachat',
    content: 
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша жалоба передана [COLOR=#FFFF00]на рассмотрение[/COLOR] [COLOR=#0000FF]Главному/Заместителю Главного Куратора Форума.[/COLOR][/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Убедительная просьба не создавать копий данной темы.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#0000FF]▪ ГКФ/ЗГКФ ▪[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Ожидайте ответа.[/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Главному Администратору',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша жалоба передана [COLOR=#FFFF00]на рассмотрение[/COLOR] [COLOR=#FF0000]Главному Администратору.[/COLOR][/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Убедительная просьба не создавать копий данной темы.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF0000]▪ Главному Администратору ▪[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Ожидайте ответа.[/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: GA_PREFIX,
    status: true,
},
{
    title: 'Тех. специалисту',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(0, 0, 255, 0.8); font-family: UtromPressKachat',
    content: 
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша жалоба передана [COLOR=#FFFF00]на рассмотрение[/COLOR] [COLOR=#0000FF]Техническому специалисту.[/COLOR][/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Убедительная просьба не создавать копий данной темы.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#0000FF]▪ Техническому специалисту ▪[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Ожидайте ответа.[/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: TECH_PREFIX,
    status: true,
},
{
    title: 'На рассмотрении',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(255, 140, 0, 0.8); font-family: UtromPressKachat',
    content: 
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша жалоба взята [COLOR=#FFFF00]на рассмотрение.[/COLOR][/COLOR][/SIZE]<br>' +
          '[COLOR=#FF4444]Убедительная просьба не создавать копий данной темы.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FFFF00]▪ На рассмотрении ▪[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Ожидайте ответа.[/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Запрос док-в на лид-во семьи + ПТ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(255, 140, 0, 0.8); font-family: UtromPressKachat',
    content: 
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Предоставьте доказательства того, что Вы являетесь лидером данной семьи.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Только лидер семьи может создавать подобные жалобы.[/COLOR]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Предоставьте доказательства того, что в описании семьи запрещено брать такое количество патронов.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Если Вы не являетесь лидером семьи, то отпишите об этом ниже, чтобы закрыть тему.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FFFF00]▪ На рассмотрении ▪[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FF4444]Ожидаем обратной связи.[/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: PINBIO_PREFIX,
    status: true,
},
{
    title: 'Запрос док-в на лид-во семьи без ПТ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(255, 140, 0, 0.8); font-family: UtromPressKachat',
    content: 
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Предоставьте доказательства того, что Вы являетесь лидером данной семьи.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Только лидер семьи может создавать подобные жалобы.[/COLOR]<br><br>' +
          '[COLOR=#E5E5E5]Если Вы не являетесь лидером семьи, то отпишите об этом ниже, чтобы закрыть тему.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FFFF00]▪ На рассмотрении ▪[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FF4444]Ожидаем обратной связи.[/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: PINBIO_PREFIX,
    status: true,
},
{
    title: '----> Направить в другие разделы <----',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6); background: linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFD700 50%, #B8860B 75%, #D4AF37 100%); border: 2px solid #FFD700; border-radius: 10px; box-shadow: 0 0 14px rgba(255, 215, 0, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 4px 0 #8B6914, 0 6px 12px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'В ЖБ на АДМ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:  
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша жалоба получает статус [COLOR=#FF4444]Отказано.[/COLOR][/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Внимательно ознакомившись с Вашей жалобой, было решено, что Вам нужно обратиться в «Раздел жалоб на Администрацию».[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'В ЖБ на Тех спец',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:  
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша жалоба получает статус [COLOR=#FF4444]Отказано.[/COLOR][/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Внимательно ознакомившись с Вашей жалобой, было решено, что Вам нужно обратиться в «Раздел жалоб на Технических Специалистов».[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'В ЖБ на ЛД',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша жалоба получает статус [COLOR=#FF4444]Отказано.[/COLOR][/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Внимательно ознакомившись с Вашей жалобой, было решено, что Вам нужно обратиться в «Раздел жалоб на Лидеров».[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'В ЖБ на сотрудников',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Обратитесь в раздел жалоб на сотрудников той или иной организации.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '-------------> Отказ жалоб <-------------',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6); background: linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFD700 50%, #B8860B 75%, #D4AF37 100%); border: 2px solid #FFD700; border-radius: 10px; box-shadow: 0 0 14px rgba(255, 215, 0, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 4px 0 #8B6914, 0 6px 12px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'Не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +         
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +         
          '[SIZE=4][COLOR=#FFA500]▪ Ваша жалоба составлена не по форме.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Заполните данную форму и подайте новую заявку:[/COLOR]<br><br>' +          
          '[INDENT][FONT=Courier New][SIZE=3]' +
          '[COLOR=#FFD700]1.[/COLOR] [COLOR=#E5E5E5]Ваш Nick_Name:[/COLOR]<br>' +
          '[COLOR=#FFD700]2.[/COLOR] [COLOR=#E5E5E5]Nick_Name игрока:[/COLOR]<br>' +
          '[COLOR=#FFD700]3.[/COLOR] [COLOR=#E5E5E5]Суть жалобы:[/COLOR]<br>' +
          '[COLOR=#FFD700]4.[/COLOR] [COLOR=#E5E5E5]Доказательство:[/COLOR]' +
          '[/SIZE][/FONT][/INDENT]<br><br>' +          
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +          
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +          
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нарушения не найдены',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушения игрока не были обнаружены.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет в логах',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Проверив систему логирования, нарушение не было обнаружено.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет нарушений',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ На Ваших доказательствах отсутствуют нарушения игрока.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная ЖБ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша жалоба составлена неадекватно.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Составьте жалобу адекватно и создайте новую тему.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Условия',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Отсутствуют условия сделки или они расписаны не корректно.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Не тот сервер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +         
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +          
          '[SIZE=4][COLOR=#FFA500]▪ При составлении жалобы, Вы ошиблись сервером.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Подайте жалобу в раздел Вашего сервера.[/COLOR]<br>' +
          '[COLOR=#E5E5E5]Свой сервер Вы можете найти на главной странице форума:[/COLOR]<br><br>' +          
          '[URL=https://forum.blackrussia.online/][COLOR=#FFD700][U]➔ Главная страница форума[/U][/COLOR][/URL]<br><br>' +         
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +         
          '[COLOR=#D4AF37]Приятной игры на [B][COLOR=#FFD700]BLACK RUSSIA[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет тайма',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +         
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +          
          '[SIZE=4][COLOR=#FFA500]▪ На Ваших доказательствах отсутствует /time.[/COLOR][/SIZE]<br><br>' +          
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +          
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +          
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет таймкодов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FF4444]Пример оформления тайм-кодов:[/COLOR]<br>' +
          '[QUOTE][COLOR=#E5E5E5]' +
          '0:25 - Начало нарушения<br>' +
          '1:10 - Демонстрация оружия<br>' +
          '2:30 - Угрозы в сторону игрока<br>' +
          '3:45 - Попытка ограбления<br>' +
          '4:20 - Конец ситуации' +
          '[/COLOR][/QUOTE]<br>' +
          '[COLOR=#E5E5E5]Указывайте точное время каждого нарушения для быстрого просмотра.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '3+ дня',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Вашим доказательствам более трёх дней.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Жалоба от 3-го лица',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша жалоба составлена от третьего лица.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Дубликат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша тема является дубликатом предыдущей.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Дублирование',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ответ на Вашу жалобу был дан в предыдущей теме.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обмен ИВ на BC',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Обменивать Игровую Валюту на Донат Валюту запрещено.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]В последующих случаях это будет приравниваться к пункту правил:[/COLOR]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.28.[/COLOR] [COLOR=#E5E5E5]Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде[/COLOR] [COLOR=#FF0000]| PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/QUOTE]<br>' +
          '[COLOR=#FF0000]Примечание: [/COLOR][COLOR=#E5E5E5]любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.[/COLOR]<br>' +
          '[COLOR=#FF0000]Примечание: [/COLOR][COLOR=#E5E5E5][B]обмен донат-услуг на игровую валюту запрещен.[/B][/COLOR]<br>' +
          '[COLOR=#FF0000]Примечание: [/COLOR][COLOR=#E5E5E5]нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.[/COLOR]<br>' +
          '[COLOR=#FF0000]Пример:[/COLOR] [COLOR=#E5E5E5]пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.[/COLOR]<br>' +
          '[COLOR=#FF0000]Примечание: [/COLOR][COLOR=#E5E5E5]продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/COLOR]<br>' +
          '[COLOR=#FF0000]Примечание: [/COLOR][COLOR=#E5E5E5]покупка игровой валюты или ценностей через официальный сайт разрешена.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Долг отказ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Исходя из общих правил проекта, нарушений от игрока нет.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Подобные долги никак не наказуемые со стороны администрации. Долги, которые были выданы через трейд, полностью Ваша ответственность. По правилам, выдача долга должна быть начислена через банковский счет.[/COLOR]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.57.[/COLOR] [COLOR=#E5E5E5]Запрещается брать в долг игровые ценности и не возвращать их. | [/COLOR][COLOR=#FF0000]Ban 30 дней / permban[/COLOR]<br>' +
          '[COLOR=#FF0000]Примечание:[/COLOR] [COLOR=#E5E5E5]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR]<br>' +
          '[COLOR=#FF0000]Примечание:[/COLOR] [COLOR=#E5E5E5]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR]<br>' +
          '[COLOR=#FF0000]Примечание:[/COLOR] [COLOR=#E5E5E5]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Игрок наказан',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель уже наказан.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Закрыто ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
    title: '--------> Проблемы с док-вами <--------',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6); background: linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFD700 50%, #B8860B 75%, #D4AF37 100%); border: 2px solid #FFD700; border-radius: 10px; box-shadow: 0 0 14px rgba(255, 215, 0, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 4px 0 #8B6914, 0 6px 12px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'Нужен фрапс',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В данном случае требуется Видеодоказательство на нарушение от игрока.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Создайте новую тему и прикрепите доказательства в виде видео, загруженные на хостинги (Rutube, Youtube, Imgur).[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Не те док-ва',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ NickName в доказательствах не соответствует указанному в жалобе.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Составьте жалобу корректно и создайте новую тему.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва в соц сетях',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Доказательства должны быть загружены на фото/видео хостинги (Rutube, Япикс, Imgur).[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва удалены',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Доказательства удалены или недоступны для просмотра.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Недостаточно доказательств',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В Вашей жалобе недостаточно доказательств на нарушение игрока.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ссылка не работает',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ссылка с доказательствами нерабочая.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Проверьте работоспособность ссылки или загрузите на фото/видео хостинги (Rutube, Япикс, imgur) и напишите новую жалобу.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва отредактированы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Доказательства, которые были отредактированы, могут быть не рассмотрены.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Доказательства с посторонней музыкой, неадекватной речью, нецензурными словами или выражениями не принимаются.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отсутвуют док-ва',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В Вашей жалобе не загружены доказательства на нарушение игрока.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Создайте новую жалобу, загрузив доказательства с нарушениями игрока.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва приватны',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В Вашей жалобе доказательства приватны.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Создайте новую жалобу, загрузив доказательства с нарушениями игрока на любой другой хостинг.[/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '-----------> Правила форума <-----------',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6); background: linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFD700 50%, #B8860B 75%, #D4AF37 100%); border: 2px solid #FFD700; border-radius: 10px; box-shadow: 0 0 14px rgba(255, 215, 0, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 4px 0 #8B6914, 0 6px 12px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'Неадекватное поведение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Пользователь форума будет наказан по пункту правил пользования форумом:[/COLOR][/SIZE]<br>' +
          '[QUOTE][SIZE=4][COLOR=#FF0000]2.02.[/COLOR] [COLOR=#E5E5E5]Запрещено неадекватное поведение в любой возможной форме, от оскорблений простых пользователей, до оскорбления администрации или других членов команды проекта.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Травля пользователя',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Пользователь форума будет наказан по пункту правил пользования форумом:[/COLOR][/SIZE]<br>' +
          '[QUOTE][SIZE=4][COLOR=#FF0000]2.03.[/COLOR] [COLOR=#E5E5E5]Запрещена массовая травля, то есть агрессивное преследование одного из пользователей данного форума.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Провокация/розжиг конфликта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Пользователь форума будет наказан по пункту правил пользования форумом:[/COLOR][/SIZE]<br>' +
          '[QUOTE][SIZE=4][COLOR=#FF0000]2.04.[/COLOR] [COLOR=#E5E5E5]Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Реклама',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Пользователь форума будет наказан по пункту правил пользования форумом:[/COLOR][/SIZE]<br>' +
          '[QUOTE][SIZE=4][COLOR=#FF0000]2.05.[/COLOR] [COLOR=#E5E5E5]Запрещена совершенно любая реклама любого направления.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '18+',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Пользователь форума будет наказан по пункту правил пользования форумом:[/COLOR][/SIZE]<br>' +
          '[QUOTE][SIZE=4][COLOR=#FF0000]2.06.[/COLOR] [COLOR=#E5E5E5]Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Флуд/оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Пользователь форума будет наказан по пункту правил пользования форумом:[/COLOR][/SIZE]<br>' +
          '[QUOTE][SIZE=4][COLOR=#FF0000]2.07.[/COLOR] [COLOR=#E5E5E5]Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Религия/политика',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Пользователь форума будет наказан по пункту правил пользования форумом:[/COLOR][/SIZE]<br>' +
          '[QUOTE][SIZE=4][COLOR=#FF0000]2.09.[/COLOR] [COLOR=#E5E5E5]Запрещены споры на тему религии/политики.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Помеха развитию проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Пользователь форума будет наказан по пункту правил пользования форумом:[/COLOR][/SIZE]<br>' +
          '[QUOTE][SIZE=4][COLOR=#FF0000]2.14.[/COLOR] [COLOR=#E5E5E5]Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Злоуп капсом/транслитом',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Пользователь форума будет наказан по пункту правил пользования форумом:[/COLOR][/SIZE]<br>' +
          '[QUOTE][SIZE=4][COLOR=#FF0000]2.17.[/COLOR] [COLOR=#E5E5E5]Запрещено злоупотребление Caps Lock`ом или транслитом.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Бессмысленный/оск ник ФА',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Пользователь форума будет наказан по пункту правил пользования форумом:[/COLOR][/SIZE]<br>' +
          '[QUOTE][SIZE=4][COLOR=#FF0000]3.02.[/COLOR] [COLOR=#E5E5E5]Запрещено регистрировать аккаунты с бессмысленными никнеймами и содержащие нецензурные выражения.[/COLOR][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '------> Правила Текстового Чата <------',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6); background: linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFD700 50%, #B8860B 75%, #D4AF37 100%); border: 2px solid #FFD700; border-radius: 10px; box-shadow: 0 0 14px rgba(255, 215, 0, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 4px 0 #8B6914, 0 6px 12px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'CapsLock',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.02.[/COLOR] [COLOR=#E5E5E5]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [/COLOR][COLOR=#FF0000]Mute 30 минут.[/COLOR][/QUOTE]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оск/Расизм в OOC',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.03.[/COLOR] [COLOR=#E5E5E5]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Упом/Оск Родни',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.04.[/COLOR] [COLOR=#E5E5E5]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'FLOOD',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.05.[/COLOR] [COLOR=#E5E5E5]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Злоуп Символами',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.06.[/COLOR] [COLOR=#E5E5E5]Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Слив Глоб Чатов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.08.[/COLOR] [COLOR=#E5E5E5]Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 0, 0)]PermBan. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Выдача себя за адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.10.[/COLOR] [COLOR=#E5E5E5]Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ввод в заблуждение командами',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.11.[/COLOR] [COLOR=#E5E5E5]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Музыка в Voice чат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.14.[/COLOR] [COLOR=#E5E5E5]Запрещено включать музыку в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шумы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.16.[/COLOR] [COLOR=#E5E5E5]Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Политика/Религия',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.18.[/COLOR] [COLOR=#E5E5E5]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Софт для голоса',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.19.[/COLOR] [COLOR=#E5E5E5]Запрещено использование любого софта для изменения голоса | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Транслит',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.20.[/COLOR] [COLOR=#E5E5E5]Запрещено использование транслита в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Реклама Промо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.21.[/COLOR] [COLOR=#E5E5E5]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(255, 0, 0)]Ban 30 дней. [/QUOTE][/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание: [/COLOR]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.<br>'+
          '[COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.<br>'+
          '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обьявления на тт ГОСС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.22.[/COLOR] [COLOR=#E5E5E5]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Мат в VIP чат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.23.[/COLOR] [COLOR=#E5E5E5]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>'+
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
}, 
{
    title: '-----> Правила RolePlay Процесса <-----',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6); background: linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFD700 50%, #B8860B 75%, #D4AF37 100%); border: 2px solid #FFD700; border-radius: 10px; box-shadow: 0 0 14px rgba(255, 215, 0, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 4px 0 #8B6914, 0 6px 12px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'Постороннее ПО',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.22.[/COLOR] [COLOR=#E5E5E5]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/QUOTE][/COLOR]<br>' +        
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP повeдение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.01.[/COLOR] [COLOR=#E5E5E5]Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP /edit',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]4.01.[/COLOR] [COLOR=#E5E5E5]Запрещено редактирование объявлений, не соответствующих ПРО [Color=Red]| Mute 30 минут[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP Эфир',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]4.02.[/COLOR] [COLOR=#E5E5E5]Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=Red]| Mute 30 минут[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Замена текста',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]4.04.[/COLOR] [COLOR=#E5E5E5]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=Red]| Ban 7 дней + ЧС организации[/color][/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP адвокат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]3.01.[/COLOR] [COLOR=#E5E5E5]Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий [Color=Red]| Warn[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Поимка/арест на тт ОПГ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]1.16.[/COLOR] [COLOR=#E5E5E5]Игроки, состоящие в силовых структурах, не имеют права находиться и открывать огонь на территории ОПГ с целью поимки или ареста преступника вне проведения облавы [Color=#FF0000]| Warn[/color]<br>' +
          '[Color=#FF0000]Примечание:[/COLOR] территория ОПГ — это место, где находятся автопарк криминальной организации и её штаб со складом.[/QUOTE]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},        
{
    title: 'Ввод в забл. (ЦБ)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]5.02.[/COLOR] [COLOR=#E5E5E5]Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами [Color=#FF0000]| Ban 3-5 дней + ЧС организации[/color][/QUOTE]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},    
{
    title: 'Розыск без причины (УМВД)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]6.02.[/COLOR] [COLOR=#E5E5E5]Запрещено выдавать розыск без IC причины [Color=#FF0000]| Warn[/color][/QUOTE]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
}, 
{
    title: 'Розыск/штраф без причины (ГИБДД)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]7.02.[/COLOR] [COLOR=#E5E5E5]Запрещено выдавать розыск, штраф без IC причины [Color=#FF0000]| Warn[/color][/QUOTE]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},            
{
    title: 'nRP поведение (УМВД/ГИБДД/ФСБ)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]6.03.[/COLOR] [COLOR=#E5E5E5]Запрещено nRP поведение [Color=#FF0000]| Warn[/color][/QUOTE]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},              
{
    title: 'nRP ФСИН',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]9.01.[/COLOR] [COLOR=#E5E5E5]Запрещено освобождать заключённых, нарушая игровую логику организации [Color=#FF0000]| Warn[/color][/QUOTE]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},         
{
    title: 'Уход от RP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.02.[/COLOR] [COLOR=#E5E5E5]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Помеха RP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.04.[/COLOR] [COLOR=#E5E5E5]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(255, 0, 0)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP обман(Попытка)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.05.[/COLOR] [COLOR=#E5E5E5]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Аморальные действия',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.08.[/COLOR] [COLOR=#E5E5E5]Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Слив фам склада',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.09.[/COLOR] [COLOR=#E5E5E5]Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/QUOTE][/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обман в /do',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.10.[/COLOR] [COLOR=#E5E5E5]Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Фракционный тс в личных целях',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.11.[/COLOR] [COLOR=#E5E5E5]Запрещено использование рабочего или фракционного транспорта в личных целях | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>'+
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'DB',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.13.[/COLOR] [COLOR=#E5E5E5]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'TK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>    {{ user.mention }}.<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.15.[/COLOR] [COLOR=#E5E5E5]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'SK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.16.[/COLOR] [COLOR=#E5E5E5]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'MetaGaming',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.18.[/COLOR] [COLOR=#E5E5E5]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'DM',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.19.[/COLOR] [COLOR=#E5E5E5]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Mass DM',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.20.[/COLOR] [COLOR=#E5E5E5]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Скрытие багов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.23.[/COLOR] [COLOR=#E5E5E5]Запрещено скрывать от администрации баги системы, а также распространять их игрокам | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Скрытие от адм нарушителей',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.24.[/COLOR] [COLOR=#E5E5E5]Запрещено скрывать от администрации нарушителей или злоумышленников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan + ЧС проекта.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Вред репутиции проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.25.[/COLOR] [COLOR=#E5E5E5]Запрещены попытки или действия, которые могут навредить репутации проекта | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Вред ресурсам проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.26.[/COLOR] [COLOR=#E5E5E5]Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Реклама соц сетей',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.31.[/COLOR] [COLOR=#E5E5E5]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обман администрации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.32.[/COLOR] [COLOR=#E5E5E5]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Уязвимость правил',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.33.[/COLOR] [COLOR=#E5E5E5]Запрещено пользоваться уязвимостью правил | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Конфликты о национальности',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.35.[/COLOR] [COLOR=#E5E5E5]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'OOC угрозы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.37.[/COLOR] [COLOR=#E5E5E5]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Расп. личной информации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.38.[/COLOR] [COLOR=#E5E5E5]Запрещено распространять личную информацию игроков и их родственников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan + ЧС проекта.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Злоуп. нарушениями',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.39.[/COLOR] [COLOR=#E5E5E5]Злоупотребление нарушениями правил сервера | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней.[/QUOTE][/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока.<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются.<br>' +
          '[COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов.<br>' +
          '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR] было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Критика проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.40.[/COLOR] [COLOR=#E5E5E5]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(255, 0, 0)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP Drive (30 мин)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.03.[/COLOR] [COLOR=#E5E5E5]Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP Drive (60 мин) [фура/инко]',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.47.[/COLOR] [COLOR=#E5E5E5]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Аресты в интерьере',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.50.[/COLOR] [COLOR=#E5E5E5]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней + увольнение из организации.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP аксессуар',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.52.[/COLOR] [COLOR=#E5E5E5]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=rgb(255, 0, 0)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оск адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.54.[/COLOR] [COLOR=#E5E5E5]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 0, 0)]Mute 180 минут.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Багаюз с аним',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.55.[/COLOR] [COLOR=#E5E5E5]Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(255, 0, 0)]Jail 120 минут.[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'NRP В/Ч',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя  из правил нападания на военную часть по пункту:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]2.[/COLOR] [COLOR=#E5E5E5]За нарушение правил нападения на Военную Часть выдаётся предупреждение | [COLOR=rgb(255, 0, 0)]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/QUOTE][/COLOR]<br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Исп. маскировки в лич. целях (NRP В/Ч)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан, исходя  из правил нападания на военную часть по пункту:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]16.[/COLOR] [COLOR=#E5E5E5]Участникам криминальных организаций запрещено использовать форму военного и путевой лист в личных целях [COLOR=rgb(255, 0, 0)]| Warn NonRP В/Ч[/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] участник криминальной организации купил форму военного и путевой лист, скрытно проник на территорию воинской части, но вместо угона камаза для материалов, пошел к складу и добывает материалы для себя.<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] форма военного и путевой лист предназначены исключительно для угона камаза для материалов.[/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Долг одобрен',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE]<br> '+
          '[QUOTE][COLOR=rgb(255, 0, 0)]2.57.[/COLOR] Запрещается брать в долг игровые ценности и не возвращать их. | [COLOR=rgb(255, 0, 0)] Ban 30 дней / permban [/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Фейк никнейм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana][SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> [COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нарушитель будет наказан по пункту правил:[/COLOR][/SIZE][QUOTE][SIZE=4][COLOR=#FF0000]4.10.[/COLOR] [COLOR=#E5E5E5]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan.[/COLOR]<br><br>' +
          '[COLOR=red]Пример:[/COLOR] подменять букву i на L и так далее, по аналогии.[/QUOTE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '---------> RolePlay Биографии <---------',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6); background: linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFD700 50%, #B8860B 75%, #D4AF37 100%); border: 2px solid #FFD700; border-radius: 10px; box-shadow: 0 0 14px rgba(255, 215, 0, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 4px 0 #8B6914, 0 6px 12px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
	},
{
    title: 'Биография одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша RolePlay биография получает статус [COLOR=#00AA00]Одобрено.[/COLOR][/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша Role Play Биография составлена не по форме.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Создайте новую Биографию по форме.[/COLOR]<br><br>' +
          '[COLOR=#FF4444]Форма подачи RP биографии:[/COLOR]<br>'+
          '[QUOTE][COLOR=#E5E5E5]Имя и фамилия персонажа:<br>' +
          'Пол:<br>' +
          'Возраст:<br>' +
          'Национальность:<br>' +
          'Образование:<br>' +
          'Описание внешности:<br>' +
          'Характер:<br>' +
          'Детство:<br>' +    
          'Настоящее время:<br>' +
          'Итог:[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Заголовок Вашей Role Play Биографии не соответствует правилам подачи.[/COLOR][/SIZE]<br>'+
          '[QUOTE][COLOR=#FF0000]1.1.[/COLOR] [COLOR=#E5E5E5]Заголовок RP биографии должен быть составлен по следующей форме: Биография | Nick_Name[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шрифт/размер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша Role Play Биография не соответствует требованиям подачи.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#FF0000]1.6.[/COLOR] [COLOR=#E5E5E5]Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отсутствуют фото',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В Вашей Role Play Биографии отсутствуют фото и иные материалы.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#FF0000]1.7.[/COLOR] [COLOR=#E5E5E5]В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории Вашего персонажа.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Объем инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша RolePlay биография имеет не соответствующий объем информации.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#FF0000]1.9.[/COLOR] [COLOR=#E5E5E5]Минимальный объём RP биографии — 200 слов, максимальный — 600.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Логика',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Содержание биографии имеет логические противоречия.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#FF0000]1.10.[/COLOR] [COLOR=#E5E5E5]В биографии не должно быть логических противоречий.[/COLOR]<br>' +
          '[COLOR=#FFA500]Пример:[/COLOR] [COLOR=#E5E5E5]в пункте «Возраст» Вы указываете, что Вам 16 лет, а дальше описываете, что окончили университет, открыли свой бизнес и зарабатываете миллионы рублей.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Супер способности',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Вы присвоили своему персонажу супер-способности.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В биографии содержится много грамматических ошибок.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Биография скопирована.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Тема не относится к данному разделу.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная Биография',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В биографии присутствует нецензурная брань или оскорбления.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ответ был дан в предыдущей теме.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '----------> RolePlay Ситуации <----------',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6); background: linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFD700 50%, #B8860B 75%, #D4AF37 100%); border: 2px solid #FFD700; border-radius: 10px; box-shadow: 0 0 14px rgba(255, 215, 0, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 4px 0 #8B6914, 0 6px 12px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'Ситуация одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша RolePlay ситуация получает статус [COLOR=#00AA00]Одобрено.[/COLOR][/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Не внутриигр. инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша RolePlay ситуация отражает не внутриигровую информацию.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#FF0000]1.1.[/COLOR] [COLOR=#E5E5E5]В RP ситуации должна быть отражена только внутриигровая информация.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В ситуации содержится много грамматических ошибок.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша RolePlay ситуация составлена не по форме.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Создайте новую RP ситуацию по форме.[/COLOR]<br><br>' +
          '[COLOR=#FF4444]Форма подачи RP ситуации:[/COLOR]<br>' +
          '[QUOTE][COLOR=#E5E5E5]1. Название:<br>' +
          '2. Пролог: (введение / предыстория)<br>' +
          '3. Сюжет: (основная часть RP ситуации)<br>' +
          '4. Эпилог: (заключение / итоги)<br>' +
          '5. Ссылка на исходные материалы с отыгровками:[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Заголовок Вашей RolePlay ситуации не соответствует правилам подачи.[/COLOR][/SIZE]<br>'+
          '[QUOTE][COLOR=#FF0000]1.5.[/COLOR] [COLOR=#E5E5E5]Название темы с RP ситуацией оформляется по форме: [Краткое название события] Событие[/COLOR]<br><br>' +
          '[COLOR=#FFA500]Пример:[/COLOR] [COLOR=#E5E5E5][Катастрофа] Взрыв на химическом заводе[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'На фото ООС инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ На фото присутствует ООС информация.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#FF0000]1.7.[/COLOR] [COLOR=#E5E5E5]Скриншоты не должны содержать OOC-информацию и интерфейс, кроме того, который нельзя убрать системно.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет ссылок на RP отыгр',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Нет ссылок на материалы с RP отыгровками.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#FF0000]1.8.[/COLOR] [COLOR=#E5E5E5]В конце RP ситуации игрок должен предоставить ссылку на исходные материалы, где видны RP отыгровки.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шрифт/размер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ситуация не соответствует требованиям подачи.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#FF0000]1.9.[/COLOR] [COLOR=#E5E5E5]RP ситуация должна быть читабельной. Минимальный размер шрифта — 15. Разрешенные шрифты: Verdana, Times New Roman.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ситуация скопирована.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Тема не относится к данному разделу.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная Ситуация',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В ситуации присутствует нецензурная брань или оскорбления.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ответ был дан в предыдущей теме.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '-----> Неоф. RolePlay организация <-----',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 1px 3px rgba(255, 215, 0, 0.6); background: linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #FFD700 50%, #B8860B 75%, #D4AF37 100%); border: 2px solid #FFD700; border-radius: 10px; box-shadow: 0 0 14px rgba(255, 215, 0, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 4px 0 #8B6914, 0 6px 12px rgba(0, 0, 0, 0.5); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'Орг-ция одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ваша Неофициальная RolePlay организация получает статус [COLOR=#00AA00]Одобрено.[/COLOR][/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00AA00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: true,
},
{
    title: 'Меньше 3-х человек',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ У Вас меньше 3-х участников.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#E5E5E5]Минимальный состав участников для создания неофициальной RP организации — 3 человека.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Род деят-ти/история',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Не описан род деятельности и(или) история.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#E5E5E5]Организация должна иметь чёткий род деятельности и свою историю.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В организации содержится много грамматических ошибок.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Организация составлена не по форме.[/COLOR][/SIZE]<br>' +
          '[COLOR=#E5E5E5]Создайте новую организацию по форме.[/COLOR]<br><br>' +
          '[COLOR=#FF4444]Форма подачи заявки:[/COLOR]<br>'+
          '[QUOTE][COLOR=#E5E5E5]1. Название Вашей организации:<br>' +
          '2. История создания:<br>' +
          '3. Состав участников:<br>' +
          '4. Устав:<br>' +
          '5. Описание деятельности:<br>' +
          '6. Отличительная визуальная особенность:<br>' +
          '7. Как и где можно попасть в Вашу организацию:<br>' +
          '8. Ссылка на одобренную RP биографию:[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Заголовок организации не соответствует правилам подачи.[/COLOR][/SIZE]<br>'+
          '[QUOTE][COLOR=#FF0000]1.8.[/COLOR] [COLOR=#E5E5E5]Название темы должно быть оформлено по шаблону: Неофициальная RP организация [Название][/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Организация скопирована.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#FF0000]1.5.[/COLOR] [COLOR=#E5E5E5]Запрещено копировать чужие неофициальные RP организации, а также воссоздавать собственные ранее созданные неофициальные RP организации, которые были распущены.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Орг-я в форме ГОСС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Организация создана в форме государственной фракции.[/COLOR][/SIZE]<br>'+
          '[QUOTE][COLOR=#FF0000]1.6.[/COLOR] [COLOR=#E5E5E5]Запрещено создавать организации в форме государственных фракций.[/COLOR]<br>' +
          '[COLOR=#FFA500]Пример:[/COLOR] [COLOR=#E5E5E5]неофициальная RP организация «Росгвардия».[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Осутствуют фото',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В организации отсутствуют фото и иные материалы.[/COLOR][/SIZE]<br>' +
          '[QUOTE][COLOR=#FF0000]1.10.[/COLOR] [COLOR=#E5E5E5]Заявка на организацию должна сопровождаться фото- или видеоматериалами.[/COLOR]<br>' +
          '[COLOR=#FFA500]Примечание:[/COLOR] [COLOR=#E5E5E5]скриншоты не должны содержать OOC-информацию и интерфейс (кроме тех элементов, которые невозможно убрать системно).[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная неоф. орг-я',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ В организации присутствует нецензурная брань или оскорбления.[/COLOR][/SIZE]<br><br>' +
          '[COLOR=#E5E5E5]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Тема не относится к данному разделу.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #D4AF37; font-family: UtromPressKachat; background: linear-gradient(to bottom, #D4AF37, #B8860B); color: #000000; font-weight: bold;',
    content:
          '[CENTER][FONT=Verdana]' +
          '[SIZE=4][COLOR=#FFD700]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>' +
          '[COLOR=#D4AF37]{{ user.mention }}[/COLOR].[/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/MTK8CnN1/2c4f6b93a412c9f4348290d4baabdaf9.png[/img]<br><br>' +
          '[SIZE=4][COLOR=#FFA500]▪ Ответ был дан в предыдущей теме.[/COLOR][/SIZE]<br><br>' +
          '[img]https://i.postimg.cc/Ghs1nw7X/bp.webp[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#FF4444]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#D4AF37]Приятной игры на сервере [B][COLOR=ORANGE]ORANGE (05)[/COLOR][/B].[/COLOR]<br>' +
          '[COLOR=#B8860B][I]С уважением, Главный Куратор Форума![/I][/COLOR]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
];
 
$(document).ready(() => {
	$('body').append('<script src=https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js></script>');

	addAnswers();
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
 $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});
 
    function addButton(name, id, style) {
     $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}
 
function buttonsMarkup(buttons) {
	return `
		<div class="select_answer" style="
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			width: 100%;
		">
			${buttons.map((btn, i) => {
				const isHeader = btn.title.includes('---->') || btn.title.includes('———>') || btn.title.includes('------>');
				
				if (isHeader) {
					// Для золотых заголовков - растягиваем на всю ширину с золотыми пунктирными линиями
					return `
					<div style="width: 100%; display: flex; align-items: center; gap: 15px; margin: 8px 0;">
						<div style="flex: 1; border-bottom: 2px dashed #FFD700; opacity: 0.7;"></div>
						<button id="answers-${i}" class="button--primary button rippleButton" 
							style="flex-shrink: 0; margin: 0; ${btn.dpstyle}">
							<span class="button-text">${btn.title}</span>
						</button>
						<div style="flex: 1; border-bottom: 2px dashed #FFD700; opacity: 0.7;"></div>
					</div>`;
				} else {
					// Для обычных золотых кнопок - компактный размер
					return `<button id="answers-${i}" class="button--primary button rippleButton" 
						style="width: auto; margin: 0; ${btn.dpstyle}">
						<span class="button-text">${btn.title}</span>
					</button>`;
				}
			}).join('')}
		</div>
	`;
}
function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if (send == true) {
		editThreadData(buttons[id].prefix, buttons[id].status);
		$('.button--icon.button--icon--reply.rippleButton').trigger('click');
	}
}
 
	function getThreadData() {
	const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
	const authorName = $('a.username').html();
	const hours = new Date().getHours();
	return {
	user: {
	id: authorID,
	name: authorName,
	mention: `[USER=${authorID}]${authorName}[/USER]`,
	},
  greeting: () =>
	6 < hours && hours <= 12
	  ? 'Доброе утро'
	  : 12 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 6
	  ? 'Добрый вечер'
	  : 'Добрый вечер',
};
}
 
function editThreadData(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    
    // Для PINBIO_PREFIX - тема закреплена, открыта и с префиксом "На рассмотрении"
    if (prefix === PINBIO_PREFIX) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: PIN_PREFIX, // Используем PIN_PREFIX для префикса "На рассмотрении"
                title: threadTitle,
                sticky: 1,           // Закрепление
                discussion_open: 1,  // Тема ОТКРЫТА
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для PIN_PREFIX - тема закреплена, закрыта и с префиксом "На рассмотрении"
    else if (prefix === PIN_PREFIX) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                sticky: 1,           // Закрепление
                // discussion_open не передаем - тема ЗАКРЫТА
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для остальных случаев с pin = true
    else if (pin == true) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                sticky: 1,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для случаев с pin = false
    else {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
}
    // Функция для открытой темы (без закрытия)
function editThreadDataOpen(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    
    fetch(`${document.URL}edit`, {
        method: 'POST',
        body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            discussion_open: 1, // 1 = тема открыта
            sticky: pin ? 1 : 0,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
        }),
    }).then(() => location.reload());
}
    
 function getFormData(data) {
            const formData = new FormData();
            Object.entries(data).forEach(i => formData.append(i[0], i[1]));
            return formData;
            }

// Добавляем кнопку "Префиксы" и выпадающий блок
// Сделать немного более заметными
addButton('ПРЕФИКСЫ', 'prefixesToggle', 'border-radius: 10px; margin: 2px; border: 2px solid #FFD700; font-family: UtromPressKachat; padding: 6px 12px; background: linear-gradient(to bottom, #FFD700, #D4AF37); color: #000000; font-weight: bold; font-size: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.4);');

// Создаем блок с кнопками статусов
$('button#prefixesToggle').after(`
    <div id="prefixesBox" style="
        position: absolute;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        z-index: 1000;
        margin-top: 5px;
        min-width: 220px;
        display: none;
    ">
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="на рассмотрении" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #ff7700, #e56a00); color: white;">
                📌 На рассмотрении
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="главному администратору" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #ff0000, #cc0000); color: white;">
                🔻 Главному Администратору
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="тех специалисту" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #0066ff, #0055dd); color: white;">
                👨‍💻 Тех. специалисту
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="ожидание" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #6c757d, #5a6268); color: white;">
             ⏳ Ожидание
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="одобрено" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #28a745, #218838); color: white;">
                Одобрено ✓
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="отказано" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #dc3545, #c82333); color: white;">
                Отказано ✗
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="закрыто" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #ff4444, #cc3333); color: white;">
                Закрыто 🔒
            </button>
        </div>
    </div>
`);

// Обработчики для префиксов
$('button#prefixesToggle').click(function(e) {
    e.stopPropagation();
    $('#prefixesBox').toggle();
});

// Обработка кликов по кнопкам статусов
$('.status-btn').click(function() {
    const status = $(this).data('status');
    const PREFIXES = {
        'на рассмотрении': PIN_PREFIX,
        'одобрено': ACCEPT_PREFIX,  
        'отказано': UNACCEPT_PREFIX,
        'ожидание': WAIT_PREFIX,
        'главному администратору': GA_PREFIX,
        'тех специалисту': TECH_PREFIX,
        'закрыто': CLOSE_PREFIX
    };
    
    const prefixId = PREFIXES[status];
    
    // Определяем какие кнопки закрепляют тему (pin = true)
    const PIN_BUTTONS = [
        'на рассмотрении',
        'главному администратору', 
        'тех специалисту',
        'ожидание'
    ];
    
    // Особый случай для кнопки "Ожидание" - открывает тему
    if (status === 'ожидание') {
        editThreadDataOpen(prefixId, true); // pin = true, тема ОТКРЫТА
    } 
    // Остальные кнопки
    else if (PIN_BUTTONS.includes(status)) {
        editThreadData(prefixId, true); // pin = true, тема ЗАКРЫТА
    } else {
        editThreadData(prefixId, false); // pin = false, тема ЗАКРЫТА
    }
    
    $('#prefixesBox').hide();
});

// Закрытие блока при клике вне области
$(document).click(function(e) {
    if (!$(e.target).closest('#prefixesToggle, #prefixesBox').length) {
        $('#prefixesBox').hide();
    }
});

// Предотвращаем закрытие при клике внутри блока
$('#prefixesBox').click(function(e) {
    e.stopPropagation();
});
          })();