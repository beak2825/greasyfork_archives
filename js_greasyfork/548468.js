// ==UserScript==
// @name         Albert Paul Trench для руководства сервера
// @namespace    https://forum.blackrussia.online
// @version      2.3
// @description  Личный
// @author       Albert_Trench
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @license      To use the manual for server 33 "ARZAMAS"
// @collaborator Albert_Trench
// @icon         https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/548468/Albert%20Paul%20Trench%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/548468/Albert%20Paul%20Trench%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
    const PINN_PREFIX = 2; // Prefix that will be set when thread pins
    const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const PEREDACACP_PREFIX = 10;
    const CLOSE_PREFIX = 7;
    const SPECY_PREFIX = 11;
    const TEXY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const VAJNO_PREFIX = 1;
    const PREFIKS = 0;
    const KACHESTVO = 15;
    const RASSMOTRENO_PREFIX = 9;
    const NARASSMOTRENIIRP_PREFIX = 2;
    const buttons = [
          {
            title: 'Для рассмотрения жалобы(снизу)',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #E25041; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Дублирование',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Данная тема является дублированием предыдущей темы.<br>При повторном дублировании ваш форумный аккаунт может быть заблокирован.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Запрошу док-ва',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Запрошу доказательства у администратора.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Выдано верно',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Доказательства предоставлены, наказание выдано верно.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Выдано не верно',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Наказание будет снято.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Выдано не верно + работа с администратором',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Наказание будет снято, с администратором будет проведена работа.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание не на нашем сервере',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание выдано не на нашем сервере. Обратитесь на сервер, где вам выдали наказание, в соотвествующую раздел на форуме.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Не по форме',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша жалоба составлена не по форме, рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            "[CENTER][B][SIZE=4]Ознакомьтесь с правилами подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*кликабельно*[/URL][/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Работа с администратором',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]В сторону администратора будет проведена работа.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Взятие темы на рассмотрение',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша тема взята на рассмотрение руководством сервера, ожидайте вердикта.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Жалобы на игроков и администрацию',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Игроку будет выдано наказание(нет сути какое наказание)',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Игроку будет выдано наказание.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Недостаточно доказательтсв',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Недостаточно доказательств о нарушении(ях) на предоставленных вами доказательствах.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Нельзя проверить через логи',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Данное нарушение нельзя проверить с помощью логов. В данной ситуации нужна видеофиксация.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
                {
            title: 'Не подтверждено логами',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Нарушение со стороны игрока не подтверждено логами.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Заголовок не по форме',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Заголовок не по форме. Рассмотрению не подлежит.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Нет /time',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей жалобе отсутвует /time. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Нет /myreports',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей жалобе отсутвует /myreports. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Жалоба от 3-его лица',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Жалоба написана от 3-его лица. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Нужен фрапс',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В данной ситуации нужны доказательства в виде видеофиксации.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
          {
            title: 'Фрапс обрывается',
            content:
             '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]На предоставленных доказательствах нет полной видеофиксации, возможно, полная видеофиксация не совместима с хостингом. Попробуйте сменить хостинг.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Док-ва отредактированы',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Доказательтсва, которые вы предоставили - отредактированы. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Прошло более 48-ми часов(адм)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]С момента выдачи наказания прошло более 48 часов. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Прошло более 72-ух часов(игроки)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]С момента нарушения игрока прошло более 72 часов. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Нет строки с выдачей наказания',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Нет строки с выдачей наказания. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Нет окна бана',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Нет окна блокировки вашего аккаунта. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Запрещённые соц. сети',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Доказательтсва из социальных сетей не рассматриваются. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Нет доказательтсв',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей теме отсутвуют доказательства.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Не работают доказательства',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей теме доказательства нерабочие.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Нет нарушений от администратора',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Нет нарушений со стороны администратора.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Не написан ник или неверный ник(адм)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Неправильно написан ваш ник/ник администратора. Либо ник вовсе отсутсвует.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Не написан ник или неверный ник(игроки)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Неправильно написан ваш ник/ник другого игрока. Либо ник вовсе отсутсвует.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Перезагрузите роутер/телефон',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Перезагрузите ваш роутер/телефон, или попробуйте воспользоваться VPN.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Передача жалоб',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Передача жалобы ЗГА',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша жалоба передана [COLOR=red]Заместителю Главного администратора.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
 
        {
            title: 'Передача жалобы ГА',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша жалоба передана [COLOR=red]Главному администратору[/COLOR].[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: GA_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Передача жалобы Спец. администратору',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша жалоба передана [COLOR=red]Специальной администрации.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: SPECY_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Передача жалобы Руководителю Модераторов',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша жалоба передана [COLOR=rgb(28, 107, 255)]Руководителю модераторов дискорда.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PEREDACACP_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Ответы для КФ',
            style: 'width: 97%; background: #05ffdeff; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
         {
        title: 'Оскорбление/неуважение к администрации',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.54[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=Red]| Mute 180 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
       {
        title: 'MG',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
       },
      {
        title: 'Транслит',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.01[/color]. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=Red]| Устное замечание / Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Капс',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.02[/color]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Оск в ООС',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.03[/color]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Оск/Упом родни',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил:[Color=Red] 3.04. |[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=Red]| Mute 120 минут / Ban 7 - 15 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Флуд',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.05[/color]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Злоуп знаками',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.06[/color]. Запрещено злоупотребление знаков препинания и прочих символов [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Оскорбление сексуального ракатера',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.07[/color]. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Редактирование в л/ц',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.04[/color]. Запрещено редактировать поданные объявления в личных целях заменяя текст обьявления на несоответствующий отправленному игроком [Color=Red]| Ban 7 дней + Чс Организации.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Слив СМИ',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.04[/color]. Запрещено редактировать поданные объявления в личных целях заменяя текст обьявления на несоответствующий отправленному игроком [Color=Red]| Ban 7 дней + Чс Организации.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Угрозы о наказании со стороны адм',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пункту правил: [Color=Red]3.09[/color]. Запрещены любые угрозы о наказании игрока со стороны администрации [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Выдача себя за адм',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.10[/color]. Запрещена выдача себя за администратора, если таковым не являетесь [Color=Red]| Ban 7 - 15 + ЧС администрации.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Ввод в заблуждение',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил [Color=Red]3.11[/color]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=Red]| Ban 15 - 30 дней / PermBan.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Репорт: Капс/Оффтоп/Транслит',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.12[/color]. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=Red]| Report Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Музыка в voice',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.14[/color]. Запрещено включать музыку в Voice Chat [Color=Red]| Mute 60 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Оск/Упом род в voice',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.15[/color]. Запрещено оскорблять игроков или родных в Voice Chat [Color=Red]| Mute 120 минут / Ban 7 - 15 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Шум в voice',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.16[/color]. Запрещено создавать посторонние шумы или звуки [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Реклама в voice',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.17[/color]. Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=Red]| Ban 7 - 15 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Религиозное и политическая пропаганда',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.18[/color]. Запрещено политическое и религиозное пропагандирование [Color=Red]| Mute 120 минут / Ban 10 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Реклама промо',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.21[/color]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=Red]| Ban 30 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
      {
        title: 'Торговля на тт госс',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.22[/color]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
      },
        {
            title: 'Обжалование наказаний',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
         {
            title: 'Обжаловано',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Наказание будет снято.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Отказ в обжаловании',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Обжаловано не будет.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Не подлежит рассмотрению',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Наказание, выданое вам, не подлежит рассмотрению.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Не по форме',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Не по форме. Обжалование рассмотрению не подлежит. [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*кликабельно*[/URL].[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Не готовы снять/снизить',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Руководство сервера не готово вам снять/снизить ваше наказание.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Нет док-в',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей теме отсутствуют доказательства.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание уже обжаловано',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание уже было обжаловано.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Ссылка на ВКонтакте(Если в доказательтсвах нет)',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Нет доказательтсв, укажите вашу ссылку на страницу Вконтакте в новой теме.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание снижено до 30 дней бана',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание будет снижено до 30 дней блокировки игрового аккаунта.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание снижено до 15 дней бана',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание будет снижено до 15 дней блокировки игрового аккаунта.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание снижено до 7 дней бана',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание будет снижено до 7 дней блокировки игрового аккаунта.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Вынесены из черного списка',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER]Вынесены.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Смена ника(при оскорблени  в нике)',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]У вас есть 24 часа на смену игрового никнейма. Если по истечению этого срока вы не измените никнейм ваш аккаунт будет вновь заблокирован, без возможности обжалования.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Обжалование при NonRP обмане',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Обжалование на ваше имя должен писать игрок, которого вы обманули. Повторные темы от вас будут отказаны.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Обжалование NonRP обман(игрок пишет с другого форумного аккаунта)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Иследуя ваш форумный аккаунт, не увидел жалобу на данного игрока. Не пытайтесь обмануть администрацию.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Обжалование NonRP обман(нет переписки с игроком о возврате имущества)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В предоставленных вами доказательтсвах не увидел переписки с игроком, который вас обманул. Подайте повторную тему с исправлением всех недочетов при обжаловании.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Передача на рассмотрение обжалований',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Передача обжалования Главному Администратору',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше обжалование передано [COLOR=red]Главному администратору[/COLOR].[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: GA_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Передача обжалования Руководителю Модераторов',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше обжалование передано [COLOR=rgba(0, 102, 255, 1)]Руководителю модераторов дискорда.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PEREDACACP_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Передача обжалования Специальной Администрации',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Здравствуйте.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше обжалование передано [COLOR=red]Специальной администрации.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: SPECY_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'Перенаправление в другие разделы',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'В жалобы на администрацию',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Если вы не согласны с наказанием выданным администратором - обратитесь в раздел 'Жалоб на администрацию'. [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1529/']*кликабельно*[/URL].[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'В жалобы на игроков',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Данный раздел предназначен для жалоб на администрацию - обратитесь в раздел 'Жалобы на игроков'. [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1531/']*кликабельно*[/URL].[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'В жалобы на лидеров',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Данный игрок является лидером какой-либо фракции - обратитесь в раздел 'Жалобы на лидеров'. [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1530/']*кликабельно*[/URL].[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'В обжалование наказаний',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Обратитесь в раздел 'Обжалование наказаний' - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1528/']*кликабельно*[/URL].[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
        {
            title: 'В технический раздел',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Здравствуйте.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше наказание выдано техническим специалистом, обратитесь в раздел жалоб на технических специалистов - [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9633-arzamas.1501/']*кликабельно*[/URL]. [/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 1.5px solid #960202ff; background: #000000; font-family: JetBrains Mono',
        },
    ];
 
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'background: #F37934; color: #000000; border: 3px solid #000000; border-radius: 10px');
        addButton('Важно', 'Vajno', 'background: #FF0000; color: #000000; border: 3px solid #000000; border-radius: 10px');
        addButton('Главному администратору', 'Ga', 'background: #FF0000; color: #000000; border: 3px solid #000000; border-radius: 10px');
        addButton('Специальной администрации', 'Spec', 'background: #FF0000; color: #000000; border: 3px solid #000000; border-radius: 10px');
        addButton('Рассмотрено', 'Rassmotreno', 'background: #61BD6D; color: #000000; border: 3px solid #000000; border-radius: 10px');
        addButton('Закрыто', 'Zakrito', 'background: #E25041; color: #000000; border: 3px solid #000000; border-radius: 10px');
        addButton('Ожидание', 'Ojidanie', 'background: #CCCCCC; color: #000000; border: 3px solid #000000; border-radius: 10px');
        addButton('Команде проекта', 'CP', 'background:rgb(229, 255, 0); color: #000000; border: 3px solid #000000; border-radius: 10px');
        addAnswers();
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
        $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
        $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
        $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#CP').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
        $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
        $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
        $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
        $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
        $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
        $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
 
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                }
                else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
        $(`button#Info`).click(() => {
            XF.alert(infoAlert(), null, 'Информация:');
        });
    });
 
    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; ${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 25px; border: 3px solid; border-radius: 25px; background: #FAC51C; padding: 0px 27px 0px 27px; font-family: JetBrains Mono; border-color: #000000;">ОТВЕТЫ</button>`,
                                       );
    }
 
    function buttonsMarkup(buttons) {
        return `<div class="select_answer" style="display:flex; flex-direction:row; flex-wrap:wrap">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; ${btn.style}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function infoAlert() {
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
            6 < hours && hours <= 11 ?
            'Доброе утро' :
            12 < hours && hours <= 17 ?
            'Добрый день' :
            18 < hours && hours <= 23 ?
            'Добрый вечер' :
            0 < hours && hours <= 5 ?
            'Доброй ночи' :
            'Доброй ночи',
        };
    }
 
    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
        if(pin == false){
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
        } else  {
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
    }
 
 
    function moveThread(prefix, type) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
        fetch(`${document.URL}move`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                target_node_id: type,
                redirect_type: 'none',
                notify_watchers: 1,
                starter_alert: 1,
                starter_alert_reason: "",
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
})();