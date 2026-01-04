        // ==UserScript==
        // @name         TOLYATTI | Скрипт для ЗГКФ/ГКФ by H.Myrphy
        // @namespace    https://forum.blackrussia.online
        // @version      2.3
        // @description  Специально для Черной России BLACK RUSSIA | TOLYATTI
        // @author       H.Myrphy
        // @match        https://forum.blackrussia.online/threads/*
        // @include      https://forum.blackrussia.online/threads/
        // @grant        none
        // @license      MIT
        // @icon         https://i.postimg.cc/RZYbVCD9/uj2-AJLEBHKKc-Onm2-Yx-Ftu-HAhm-VEap-IPZn7o-RNYolw-PFs4-WCAOODSr-Ni-Bk-AAz-Ndvo764q-LZ75bs0-Ms-Vwq-E2w-IW7d.webpbp.jpg8.webp
// @downloadURL https://update.greasyfork.org/scripts/548968/TOLYATTI%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%9A%D0%A4%D0%93%D0%9A%D0%A4%20by%20HMyrphy.user.js
// @updateURL https://update.greasyfork.org/scripts/548968/TOLYATTI%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%9A%D0%A4%D0%93%D0%9A%D0%A4%20by%20HMyrphy.meta.js
        // ==/UserScript==
         
        (function () {
          'use strict';
        'esversion 6' ;
           const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
        const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
        const PIN_PREFIX = 2; // Префикс "На рассмотрении"
        const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
        const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
        const CLOSE_PREFIX = 7; // Префикс "Закрыто"
        const TEX_PREFIX = 13; // Префикс "Техническому специалисту"
        const GA_PREFIX = 12; // Префикс "ГА"
        const V_PREFIX = 1; // Префикс "Важно"
        const WAIT_PREFIX = 14; // Префикс "Ожидание"
        const buttons = [
             {
              title: '------------------------------------------------------| 🔥Взять на рассмотрение🔥 |------------------------------------------------------',
              content:
                  '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
              },
               {
            title: '| 🔥На рассмотрение🔥 |',
          content:
        "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]"+
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша жалоба взята на рассмотрение. Ожидайте пожалуйста ответа в ближайшее время.[/SIZE][/FONT][FONT=georgia][SIZE=4].[/I][/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
        "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
        "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF8C00][I]На рассмотрении.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
           prefix: PIN_PREFIX,
          status:true,
        },
        
                {
                title: '----------------------------------------------------------------| 💥CHAT+Логи💥 |---------------------------------------------------------------',
          content:
              '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
          },
     
    {
            title: '|💥 3.04 7 дней 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]По результатам проверки жалобы установлено нарушение правил. В соответствии с пунктом [COLOR=rgb(255, 0, 0)]3.04[/COLOR] общих правил серверов нарушителю назначена блокировка аккаунта на [COLOR=rgb(255, 0, 0)]7 дней[/COLOR]. В случае повторных нарушений могут быть применены более строгие меры.[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено косвенное упоминание и оскорбление родных вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7-15 дней [COLOR=rgb(255, 0, 0)][/COLOR] [/COLOR][/SIZE][/FONT][/SPOILER]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] термины «MQ», «rnq» расценивается как упоминание родных. [/SIZE][/FONT][/COLOR]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] если упоминание и оскорбление родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления. [/SIZE][/FONT][/COLOR]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(255, 215, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
     
       {
            title: '|💥 3.04 15 дней 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]По результатам проверки жалобы установлено нарушение правил. В соответствии с пунктом [COLOR=rgb(255, 0, 0)]3.04[/COLOR] общих правил серверов нарушителю назначена блокировка аккаунта на [COLOR=rgb(255, 0, 0)]15 дней[/COLOR] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено косвенное упоминание и оскорбление родных вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7-15 дней [COLOR=rgb(255, 0, 0)][/COLOR] [/COLOR][/SIZE][/FONT][/SPOILER]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] термины «MQ», «rnq» расценивается как упоминание родных. [/SIZE][/FONT][/COLOR]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] если упоминание и оскорбление родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления. [/SIZE][/FONT][/COLOR]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
     
      {
            title: '|💥 3.04 МУТ 120 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]По результатам проверки жалобы установлено нарушение правил. В соответствии с пунктом [COLOR=rgb(255, 0, 0)]3.04[/COLOR] общих правил серверов нарушителю назначена блокировка чата на [COLOR=rgb(255, 0, 0)]120 минут[/COLOR]. В случае повторных нарушений могут быть применены более строгие меры.[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено косвенное упоминание и оскорбление родных вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7-15 дней [COLOR=rgb(255, 0, 0)][/COLOR] [/COLOR][/SIZE][/FONT][/SPOILER]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] термины «MQ», «rnq» расценивается как упоминание родных. [/SIZE][/FONT][/COLOR]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] если упоминание и оскорбление родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления. [/SIZE][/FONT][/COLOR]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
      {
            title: '|💥2.54 Оск Адм 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель понесёт наказание, предусмотренное соответствующим пунктом общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещены любые формы неуважительного обращения, неадекватного поведения и угроз в адрес администрации, независимо от их характера и способа выражения.  [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 180 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] Также недопустимо использование оскорбительных или пренебрежительных формулировок при подаче жалоб, например: 'Быстро почини меня', 'Админы, вы задрали', 'Когда работать будете', 'Мозги включите', 'Я вас уволю сейчас'. Подобное поведение рассматривается как нарушение установленных правил и влечёт за собой соответствующие меры ответственности. [/SIZE][/FONT][/COLOR]"+
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
         {
          title: '|💥2.35 Оск религии/нации 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель понесёт наказание, предусмотренное соответствующим пунктом общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.35.[/COLOR][COLOR=rgb(255, 215, 0)] На игровых серверах строго запрещены любые IC и OOC конфликты, связанные с национальными или религиозными разногласиями. Это касается любых форм взаимодействия, включая высказывания, намёки или действия, нарушающие принципы уважения и равенства. Нарушение правила повлечёт строгое наказание.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 215, 0)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
         },
           {
          title: '|💥2.19 СОФТ ГОЛОС 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель понесёт наказание, предусмотренное соответствующим пунктом общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.19.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено использование любого софта для изменения голоса [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | | Mute 60 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 215, 0)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
         },
    {
            title: '|💥3.21 РЕКЛАМА ПРОМОКОДА 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.21.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 30 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее. [/SIZE][/FONT][/COLOR]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта. [/SIZE][/FONT][/COLOR]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается. [/SIZE][/FONT][/COLOR]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 215, 0)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
     
     
        {
            title: '|💥 3.02 CAPS 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.02.[/COLOR][COLOR=rgb(255, 215, 0)]На игровых серверах запрещено использование текста, полностью написанного заглавными буквами (CapsLock), во всех чатах. Такой стиль написания считается несоответствующим правилам общения, поскольку затрудняет восприятие текста и нарушает общую гармонию коммуникации. Соблюдение этого правила способствует поддержанию удобного и приятного общения между игроками. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238 )][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
         {
            title: '|💥2.18 MG 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.18.[/COLOR][COLOR=rgb(255, 215, 0)]Запрещено использовать метагейминг (MG) — применение информации из OOC, которая недоступна вашему персонажу в рамках IC процесса. Такое поведение нарушает границы игрового процесса и мешает созданию правдоподобной ролевой атмосферы.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/FONT][/COLOR]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4]телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SIZE][/FONT][/COLOR]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
            title: '|💥 3.05 Flood 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.05.[/COLOR][COLOR=rgb(255, 215, 0)]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
         {
            title: '|💥2.40 Оск Проекта 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.40.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
         {
           title: '|💥3.23 Мат в Vip chat 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.23.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
     {
            title: '|💥3.18 Полит Пропаганда 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.18.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено политическое и религиозное пропагандирование [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 10 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER[/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
            title: '|💥2.35 Политика 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.35.[/COLOR][COLOR=rgb(255, 215, 0)] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
            title: '|💥2.31 Реклама 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.31.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 7 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
            title: '|💥4.04 Редактирование в лич целях 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]4.04.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 7 дней + ЧС организации [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
            title: '|💥3.20 Транслит 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.20.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено использование транслита в любом из чатов [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4]«Privet», «Kak dela», «Narmalna».[/SIZE][/FONT][/COLOR]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
         {
            title: '|💥 3.06 Злоуп знаком 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.06.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено злоупотребление знаков препинания и прочих символов [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)]][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SIZE][/FONT][/COLOR]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
            title: '|💥 3.10 Выдача себя за Адм 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.10.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещена выдача себя за администратора, если таковым не являетесь [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 7 - 15 + ЧС администрации [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
            title: '|💥 3.08 Слив глобального чата 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.08.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещены любые формы «слива» посредством использования глобальных чатов [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
     {
          title: '|💥 3.14 Музыка в войс чате 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.14.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено включать музыку в Voice Chat  [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 60 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
         },
    {
          title: '|💥 3.16 ШУМ В ВОЙС ЧАТЕ 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.16.[/COLOR][COLOR=rgb(255, 215, 0)]  Запрещено создавать посторонние шумы или звуки  [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
            title: '|💥 2.38 Распространение личной информации 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        '[HEADING=3][CENTER][/CENTER][/HEADING]'+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.38.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено распространять личную информацию игроков и их родственников. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Ban 15 - 30 дней / PermBan + ЧС проекта [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[HEADING=3][CENTER][/CENTER][/HEADING]" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4]распространение личной информации пользователя без его согласия запрещено.[/SIZE][/FONT][/COLOR]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
     {
            title: '|💥 3.11 Ввод в заблуждение 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        '[HEADING=3][CENTER][/CENTER][/HEADING]'+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.11. [/COLOR][COLOR=rgb(255, 215, 0)] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Ban 15 - 30 дней / PermBan  [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][/CENTER][/HEADING]" +
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена..[/SIZE][/FONT][/COLOR]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
            title: '|💥 2.37. ОСС Угрозы 💥|',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        '[HEADING=3][CENTER][/CENTER][/HEADING]'+
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.37. [/COLOR][COLOR=rgb(255, 215, 0)]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7 - 15 дней. [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
        "[HEADING=3][CENTER][/CENTER][/HEADING]" +
        "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4]блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/SIZE][/FONT][/COLOR]<br>" +
        "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(123, 104, 238)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
        "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: ACCEPT_PREFIX,
          status: false,
        },
        
              {
              title: '------------------------------------------------------| 🔥Одобрение Жалобы🔥 |------------------------------------------------------',
              content:
                  '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
        },
             {
                title: '| 🔥DM🔥 |',
              content:
             "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
             "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
             "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.19.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[COLOR=rgb(255,0,0)] | Jail 60 минут[/QUOTE][/FONT][/COLOR][/SIZE]" +
             "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/FONT][/SIZE]<br>" +
             "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/FONT][/SIZE]<br>" +
             "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
                prefix: ACCEPT_PREFIX,
               status: false,
               },
               {
                title: '| 🔥DB🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/SIZE][/FONT]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.13.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[COLOR=rgb(255,0, 0)] | Jail 60 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Исключение:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Mass DM🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/SIZE][/FONT]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.20.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[COLOR=rgb(255,0,0)] | Warn / Ban 3 - 7 дней[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥TK🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.15.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(255, 0, 0)] | Jail 60 минут / Warn (за два и более убийства)[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥SK🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.16.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[COLOR=rgb(255, 0, 0)] | Jail 60 минут / Warn (за два и более убийства)[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            
             {
                title: '| 🔥помеха рп процессу🔥 |',
              content:
             "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
             "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
             "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.04.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[COLOR=rgb(255,0,0)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/QUOTE][/FONT][/COLOR][/SIZE]" +
             "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Пример:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Таран дальнобойщиков, инкассаторов под разными предлогами.[/FONT][/SIZE]<br>" +
             "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
                prefix: ACCEPT_PREFIX,
               status: false,
             },
            
            {
                title: '| 🔥Nrp поведение🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.01.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[COLOR=rgb(255, 0, 0)] | Jail 30 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/SIZE]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            
              {
        title: '|🔥 2.22 Стороннее ПО 🔥 |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.22.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] запрещено внесение любых изменений в оригинальные файлы игры. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] разрешено изменение шрифта, его размера и длины чата (кол-во строк). [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] блокировка за включенный счетчик FPS не выдается. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
      
          {
        title: '|🔥 2.09 СЛИВ СКЛАДА/СОСТАВА СЕМЬИ 🔥 |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.09.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле, а также запрещено исключение всех или части игроков из состава семьи без ведома лидера также считается сливом [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    
        {
        title: '| 🔥 3.04 долг 🔥 |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(255, 215, 0)] Запрещается брать в долг игровые ценности и не возвращать их. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 30 дней / permban [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется; [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда; [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[CENTER][I][B][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 215, 0)][FONT=georgia][SIZE=4] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    
        {
      title: '| 🔥 4.09 Оск ник 🔥 |',
      content:
  "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
  "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]4.09.[/COLOR][COLOR=rgb(255, 215, 0)]   Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Устное замечание + смена игрового никнейма / PermBan. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
      },
      
            {
      title: '| 🔥 4.10 Фейк акк 🔥 |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]4.10.[/COLOR][COLOR=rgb(255, 215, 0)]  Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Устное замечание + смена игрового никнейма / PermBan. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(123, 104, 238)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(123, 104, 238)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
   "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
              title: '| 🔥Провокация госс🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.01.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено провоцировать сотрудников государственных организаций[COLOR=rgb(255, 0, 0)] | Jail 30 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
              },
              {
                title: '| 🔥nRP Адвокат🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]3.01.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий[COLOR=rgb(255,0,0)] | Warn[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Раб в форме госс🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]1.07.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции[COLOR=rgb(255,0,0)] | Jail 30 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Уход от RP🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.02.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[COLOR=rgb(255,0,0)] | Jail 30 минут / Warn[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥NRP drive🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.03.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[COLOR=rgb(255,0,0)] | Jail 30 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥fdrive🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.47.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[COLOR=rgb(255, 0, 0)] | Jail 60 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
             {
                title: '| 🔥Аморал🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.08.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[COLOR=rgb(255,0,0)] | Jail 30 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Исключение:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Обоюдное согласие обеих сторон.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Багоюз🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.21.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено пытаться обходить игровую систему или использовать любые баги сервера[COLOR=rgb(255,0,0)] | Ban 15 - 30 дней / PermBan[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Пример:[/I][/COLOR][COLOR=rgb(255, 215, 0)] аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене для передачи виртуальной валюты между игроками; Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; Банк и личные счета предназначены для передачи денежных средств между игроками; Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Багоюз Аним🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/SIZE][/FONT]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.55.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещается багоюз связанный с анимацией в любых проявлениях.[COLOR=rgb(255,0,0)] | Jail 120 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Пример:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Исключение:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Nrp Аксессуар🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.52.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера[COLOR=rgb(255,0,0)] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Пример:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Т/С орг в лич целях🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]1.08.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено использование рабочего или фракционного транспорта в личных целях[COLOR=rgb(255,0,0)] | Jail 30 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
              title: '| 🔥Помеха ОПГ🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.03.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено блокировать транспортными средствами метку сбора (с целью сохранения материалов на складе), будку КПП (с целью воспрепятствования нападению ОПГ) или брешь в стене (с целью блокировки въезда/выезда ОПГ).[COLOR=rgb(255,0,0)] | Jail 30 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
              title: '| 🔥nRP ФСИН🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]9.02.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено выдавать выговор или поощрять заключенных, а также сажать их в карцер без особой IC причины[COLOR=rgb(255,0,0)] | Warn[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Пример:[/I][/COLOR][COLOR=rgb(255, 215, 0)] сотруднику ФСИН не понравилось имя заключенного и он решил его наказать выговором или посадить в карцер.[/FONT][/SIZE]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
              },
              {
              title: '| 🔥Вывод заключённых🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]9.01.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено освобождать заключённых, нарушая игровую логику организации[COLOR=rgb(255,0,0)] | Warn[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Пример:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Выводить заключённых за территорию, используя фракционные команды, или открывать ворота территории ФСИН для выхода заключённых.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Побег заключённого возможен только на системном уровне через канализацию.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
              title: '| 🔥Оруж в раб форме🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]5.01.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено использование оружия в рабочей форме[COLOR=rgb(255,0,0)] | Jail 30 минут[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][COLOR=rgb(123, 104, 238)][SIZE=4][I]Исключение:[/I][/COLOR][COLOR=rgb(255, 215, 0)] защита в целях самообороны, обязательно иметь видео доказательство в случае наказания администрации.[/FONT][/SIZE]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
             },
             {
                title: '| 🔥Nrp коп🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]6.03.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено поведение не подражающее полицейскому[COLOR=rgb(255,0,0)] | Warn[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] поведение, не соответствующее сотруднику правоохранительных органов[/COLOR][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Пример:[/I][/COLOR][COLOR=rgb(255, 215, 0)] открытие огня по игрокам без причины, расстрел машин без причины, нарушение ПДД без причины, сотрудник на служебном транспорте кричит о наборе в свою семью на спавне, сотрудник с целью облегчить процесс конвоирования, убивает преступника в наручниках.[/COLOR][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Штраф без Причины🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]7.02.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено выдавать штраф без IC причины.[COLOR=rgb(255,0,0)] | Warn[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Розыск без причины🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]6.02.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено выдавать розыск без IC причины[COLOR=rgb(255,0,0)] | Warn[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Nrp ВЧ🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE]<br>" +
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]2.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение[COLOR=rgb(255,0,0)] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/QUOTE][/COLOR][/SIZE][/FONT]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🔥Гос в каз/аук/конт🔥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]"+
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/COLOR][/SIZE][/FONT]<br>"+
            "[FONT=georgia][QUOTE][COLOR=rgb(255,0,0)][SIZE=4]1.13.[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(255, 215, 0)][SIZE=4]Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в семейных активностях, находится на Б/У рынке с целью покупки или продажи авто, находится на аукционе с целью покупки или продажи лота[/COLOR][/SIZE][/FONT][FONT=georgia][COLOR=rgb(209,213,216)][SIZE=4][COLOR=rgb(255, 0, 0)] | Jail 30 минут[/QUOTE][/COLOR][/SIZE][/FONT]"+
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Пример:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Семейные активности — захват семейного контейнера, битва за территорию, битва семей[/COLOR][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] за участие в семейных активностях в форме организации, игроку по решению администрации может быть выдано предупреждение[COLOR=rgb(255,0,0)] | Warn[/COLOR][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 0)][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
               title: '----------------------------------------------------|💥Передача жалобы💥 |----------------------------------------------------',
               content:
                  '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
            },
     
            {
                title: '| 💥ГКФ/ЗГКФ💥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]"+
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша жалоба передана на рассмотрение [COLOR=rgb(255, 215, 0)] Главному Куратору Форума и Заместителю Главного Куратора Форума [COLOR=rgb(123, 104, 238)][I][FONT=georgia][SIZE=4] Один из них тщательно изучит все обстоятельства и примет решение в соответствии с правилами.​ [/SIZE][/FONT][FONT=georgia][SIZE=4].[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF8C00][I]На рассмотрении.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: PIN_PREFIX,
              status:true,
            },
                    {
                title: '| 💥Тех спецу💥 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша жалоба переадресована [COLOR=rgb(0, 0, 205)][I][FONT=georgia][SIZE=4] Техническому Специалисту, [COLOR=rgb(123, 104, 238)] ожидайте ответа в данной теме.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF8C00][I]На рассмотрении.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: TEX_PREFIX,
              status: true,
            },
            
            {
              title: '| 💥Кураторам Адм💥 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT][/HEADING]"+
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша жалоба переадресована [/SIZE][/FONT][FONT=georgia][SIZE=4] [COLOR=rgb(128, 0, 128)] Кураторам Администрации [COLOR=rgb(123, 104, 238)][I][FONT=georgia][SIZE=4] Один из них тщательно изучит все обстоятельства и примет решение в соответствии с правилами.​ [/SIZE][/FONT][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF8C00][I]На рассмотрении.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: PIN_PREFIX,
              status: true,
            },
            {
              title: '| 💥Главному Администратору💥 |',
              content:
            "[HEADING=3][CENTER][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша жалоба переадресована [/COLOR][COLOR=#FF0000]Главному Администратору[/COLOR][COLOR=rgb(123, 104, 238)][/SIZE][/FONT][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF8C00][I]На рассмотрении.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: GA_PREFIX,
              status:true,
             },
             {
               title: '| 💥В жб на тех💥 |',
             content:
             "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
             "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Вы ошиблись разделом, обратитесь в раздел жалоб на [COLOR=rgb(0, 0, 205)][I][FONT=georgia][SIZE=4] Технических Специалистов - [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-tolyatti.2682/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]<br>" +
             "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
             "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
             "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
             "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
                prefix: CLOSE_PREFIX,
               status: false,
           },
            {
                title: '| 💥В жб на адм💥 |',
              content:
             "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
             "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Вы ошиблись разделом, обратитесь в раздел жалоб на [COLOR=rgb(178, 34, 34)][I][FONT=georgia][SIZE=4] Администрацию - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2700/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]<br>" +
              "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
             "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
             "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
             "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
                  prefix: CLOSE_PREFIX,
                status: false,
            },
            {
                 title: '|💥В жб на АП💥 |',
               content:
             "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
             "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
             "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Вы ошиблись разделом, обратитесь в раздел жалоб на [COLOR=rgb(255, 160, 122)][I][FONT=georgia][SIZE=4] Агентов Поддержки - [URL='https://forum.blackrussia.online/threads/tolyatti-%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.6288119/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]<br>" +
             "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
             "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
             "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
             "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: CLOSE_PREFIX,
               status: false,
            },
            {
                title: '| 💥В жб на ЛД💥 |',
                content:
              "[HEADING=3][CENTER][I][COLOR=rgb(123, 10, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
              "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
              "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Вы ошиблись разделом, обратитесь в раздел жалоб на [COLOR=rgb(175, 238, 238)][I][FONT=georgia][SIZE=4] Лидеров - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2701/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]<br>" +
              "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
              "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
              "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
              "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
                 prefix: CLOSE_PREFIX,
               status: false,
            },
            {
                  title: '| 💥В жб на сотрудников💥 |',
                content:
              "[HEADING=3][CENTER][I][COLOR=rgb(123, 10, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
              "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
              "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 10, 238)]Вы ошиблись разделом, обратитесь в раздел жалоб на [COLOR=rgb(119, 136, 153)][I][FONT=georgia][SIZE=4] Сотрудников [COLOR=rgb(123, 10, 238)][I][FONT=georgia][SIZE=4] в разделе вашей организации.[/I][/SIZE][/FONT][/CENTER]<br>" +
              "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
              "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 10, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
              "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
              "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
                 prefix: CLOSE_PREFIX,
                status: false,
            },
            {
                  title: '|💥В ОБЖ💥 |',
                content:
              "[HEADING=3][CENTER][I][COLOR=rgb(123, 10, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
              "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
              "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 10, 238)]Вы ошиблись разделом, обратитесь в раздел [COLOR=rgb(255, 255, 0)][I][FONT=georgia][SIZE=4] Обжалований наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2703/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]<br>" +
              "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
              "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 10, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
              "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
              "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
                prefix: CLOSE_PREFIX,
               status: false,
              },
              {
                 title: '| 💥В тех. раздел💥 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 10, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 10, 238)]Вы ошиблись разделом, обратитесь в [COLOR=rgb(255, 140, 0)][I][FONT=georgia][SIZE=4] Технический раздел - [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-tolyatti.2682/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 10, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: CLOSE_PREFIX,
              status: false,
            },
            {
              title: '----------------------------------------------------| 🩸Отказ жалобы🩸 |----------------------------------------------------',
              content:
                  '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
              },
              {
                title: '| 🩸вирт на донат🩸|',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Обмен автокейса, покупка доп слота на машину в семью и тд на виртуальную валюту запрещен, соответственно никакого нарушения со стороны игрока нет.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸жб на 2+ игроков🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Нельзя писать одну жалобу на двух и более игроков (на каждого игрока отдельная жалоба).[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            
                 {
        title: '| 🩸 СШ набор букв 🩸 |',
      content:
       "[CENTER][IMG width=695px]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 0, 0)][FONT=georgia][SIZE=4] Выражение  СШ не содержит явного оскорбления и может рассматриваться как набор букв. В правилах проекта нет конкретного запрета на его использование, однако в зависимости от контекста администрация оставляет за собой право принимать меры в случае нарушения норм общения. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 255, 255)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/IMG][/CENTER]<br>"+
      "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(0, 0, 0)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
            
            {
                title: '| 🩸Отказ никнейм🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Никнейм игрока в ваших доказательствах не соответствует никнейму игрока на которого вы жалуетесь.(Создайте новую жалобу и укажите корректный никнейм).[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
              },
              {
                title: '| 🩸отказ долг🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша жалоба не подлежит рассмотрению. Жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. Также игровой долг может быть осуществлен ТОЛЬКО через банковский счет.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Не достаточно док-в🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Отсутствуют док-ва🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸нецензурный заголовок🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша жалоба отказана, так как в заголовке содержится нецензурная лексика и некорректное оформление. Обратите внимание, что за подобные нарушения ваш форумный аккаунт будет заблокирован.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Док-ва не открывается🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваши доказательства не открываются, что делает невозможным их рассмотрение. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее еще раз и сделайте новую жалобу.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Док-ва обрываются🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша жалоба отказана, так как видео-доказательства обрываются. Загрузите полную видеозапись на любой другой видеохостинг, например YouTube, Google Диск, Яндекс Диск, Rutube и так далее.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Отсутствует сервер🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]На доказательствах отсутствует сервер - следовательно, рассмотрению не подлежит.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
              },
              {
                title: '| 🩸Док-ва отредакт🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Доказательства, предоставленные вами, были отредактированы, что делает их недействительными для рассмотрения.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Док-ва в соц сетях🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
              },
              {
                title: '| 🩸Док-ва в плохом качестве🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Предоставленные вами доказательства имеют плохое качество, что затрудняет их анализ и делает невозможным для дальнейшего рассмотрения жалобы. Для корректного рассмотрения просьба предоставить более четкие и качественные материалы.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Нарушений нет🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Игрок не совершил никаких нарушений.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][HR][/HR][/CENTER]<br>" +
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Внимательно изучите общие правила серверов - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Нет условий сделки🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]На предоставленных доказательствах отсутствуют условия сделки - следовательно, рассмотрению не подлежит.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Нет time🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша жалоба отказана так как на предоставленных доказательствах отсутствуют дата и время (/time), что делает их невозможными для корректного рассмотрения.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Нет таймкодов🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]В вашей жалобе отсутствуют таймкоды, что делает невозможным её рассмотрение. Если жалоба длится более 3-х минут, для корректного анализа нам необходимы точные временные метки событий. Например: 0:30 — условие сделки. 1:20 — обмен машинами. 2:20 — подмена машины на другую и выход из игры. Пожалуйста, укажите таймкоды в самой сути жалобы, чтобы мы могли корректно рассмотреть ваше обращение[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Прошло 3 дня🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша жалоба отказана, так как с момента нарушения прошло более 72 часов.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Уже был ответ🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша жалоба отказана, так как по данной жалобе ранее уже был предоставлен полный и обоснованный ответ. Решение остается в силе, и повторные жалобы без новых значимых обстоятельств рассматриваться не будут. Рекомендуем ознакомиться с предыдущим ответом.[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 🩸Не по форме🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/I][/FONT][/SIZE][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            
            {
                title: '| 🩸От 3-го лица🩸 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Жалобы от 3-го лица не подлежат рассмотрению[/I][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
              },
            
            {
              title: '------------------------------------------------------| ⚡️RP Биографии⚡️️ |------------------------------------------------------',
              content:
                  '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
              },
            {
                title: '| ⚡️RP био одобрена⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша RolePlay биография успешно прошла проверку и одобрена.[/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| ⚡️RP био отказана⚡️️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша RolePlay - биография отказана после тщательной проверки.[/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
              prefix: UNACCEPT_PREFIX,
               status: false,
            },
            {
                title: '| ⚡️На доработке⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Ваша RolePlay биография поставлена на доработку.[/SIZE][/FONT]<br>" +
            "[HR][/HR]" +
            "[FONT=georgia][SIZE=4][I][COLOR=rgb(123, 104, 238)]Внимательно прочитайте правила создания RP - биографий, закрепленные в данном разделе. Вам даётся 24 часа для исправления ошибок.[/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][COLOR=rgb(154, 205, 50)][SIZE=4]На доработке.[/FONT][/COLOR][/SIZE][/CENTER]",
              prefix: PIN_PREFIX,
               status: false,
            },
            {
                title: '| ⚡️RP био nRP Ник⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как у вас NonRP NickName.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)]Внимательно изучите правила написания RP Биографии - [URL='https://forum.blackrussia.online/threads/black-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12561030/']*Нажмите сюда*[/URL][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
              prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био заголовок не по форме⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как заголовок оформлен неправильно.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)]Внимательно изучите правила написания RP Биографии - [URL='https://forum.blackrussia.online/threads/black-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12561030/']*Нажмите сюда*[/URL][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
              prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️более 1 рп био на ник⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как запрещено создавать более одной RP Биографии на один ник.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)]Внимательно изучите правила написания RP Биографии - [URL='https://forum.blackrussia.online/threads/black-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12561030/']*Нажмите сюда*[/URL][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
              prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био некоррект. возраст⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как в ней указан некорректный возраст.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био мало информации⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как в ней написано мало информации.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био нет 18 лет⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как персонажу нет 18 лет.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био от 1 лица⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как написана от 1-го лица.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)]Внимательно изучите правила написания RP Биографии - [URL='https://forum.blackrussia.online/threads/black-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12561030/']*Нажмите сюда*[/URL][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
              prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био не по форме⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как она составлена не по форме.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)]Внимательно изучите правила написания RP Биографии - [URL='https://forum.blackrussia.online/threads/black-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12561030/']*Нажмите сюда*[/URL][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био не до работал⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как вы её не до работали.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био неграмотная⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как она оформлена неграмотно.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био тавтология⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как она оформлена неграмотно.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
              },
              {
                title: '| ⚡️RP био знаки препинания⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как она оформлена неграмотно.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био граммат. ошибки⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана т.к. она оформлена неграмотно.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Примечание:[/I][/COLOR][COLOR=rgb(255, 215, 0)] Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️RP био скопирована⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как она скопирована.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)]Внимательно изучите правила написания RP Биографии - [URL='https://forum.blackrussia.online/threads/black-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12561030/']*Нажмите сюда*[/URL][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️Скопирована со своей старой био⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как она скопирована с вашей прошлой РП Биографии на другой ник. Нужно на новый ник писать новую историю.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)]Внимательно изучите правила написания RP Биографии - [URL='https://forum.blackrussia.online/threads/black-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12561030/']*Нажмите сюда*[/URL][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: '| ⚡️Мало инфо детство⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как в пункте *Детство* мало информации.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
              prefix: UNACCEPT_PREFIX,
               status: false,
            },
            {
                title: '| ⚡️Мало инфо юность⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay - биография отказана, так как в пункте *Юность и Взрослая жизнь* мало информации.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
              prefix: UNACCEPT_PREFIX,
               status: false,
            },
            {
                title: '| ⚡️Мало инфо⚡️ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay биография отказана по причине недостаточного объема информации в разделах *Детство* и *Юность и взрослая жизнь*.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
              prefix: UNACCEPT_PREFIX,
               status: false,
            },
            {
              title: '------------------------------------------------------| ✨RP Ситуации✨|------------------------------------------------------',
              content:
                  '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
              },
            {
                title: '| ✨RP сит одобрена✨ |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay Ситуация одобрена.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| ✨RP сит отказана✨|',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay Ситуация отказана.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| ✨Ошибка разделом✨|',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Вы ошиблись разделом, это раздел для написания RP-ситуаций.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| ✨RP сит скопирована✨|',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay Ситуация отказана, так как она скопирована.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| ✨RP сит не по форме✨|',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay Ситуация отказана, так как она составлена не по форме.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| ✨RP сит тег темы✨|',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay Ситуация отказана, так как название темы указано не верно[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| ✨RP сит нет смысла✨|',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша RolePlay Ситуация отказана, так как в ней нет имеющего смысла.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
              title: '---------------------------------------------------| 💫Неофициальные RP организации💫 |---------------------------------------------------',
              content:
                  '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
              },
              {
                title: '| 💫Неофиц орг одобрена💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша Неофициальная RolePlay организация одобрена.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Вы должны проявлять активность в организации. Раз в неделю прикрепляйте в данную тему любые скриншоты, видеозаписи об каких либо активных действиях в вашей организации. В случае отсутствия активности организация будет закрыта.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: ACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 💫Неофиц орг отказано💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша Неофициальная RolePlay организация отказана.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 💫На доработке💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша Неофициальная RolePlay организация поставлена на доработку.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Вам нужно доработать свою неофиц. организацию и исправить всевозможные ошибки. На это вам даётся 24 часа.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>" +
            "[FONT=georgia][COLOR=rgb(154, 205, 50)][SIZE=4][I]На доработке.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
              prefix: V_PREFIX,
               status: false,
            },
            {
                title: '| 💫Не доработал💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша Неофициальная RolePlay организация отказана.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Поскольку вы её не доработали и не исправили ошибки в отведённый срок.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
              prefix: V_PREFIX,
               status: false,
            },
            {
                title: '| 💫Нарушает правила💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша Неофициальная RolePlay организация отказана.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Деятельность вашей организации может нарушать какие-либо правила на проекте, что запрещается не только правилами проекта, но и правилами создания неофициальных организаций.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 💫Неофиц орг нет смысла💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша Неофициальная RolePlay организация отказана, так как в ней нет имеющего смысла.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 💫дата создания некорректно💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша неофициальная RolePlay организация отказана, так как дата создания в заголовке указана некорректно.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 💫нет старт состава 3+ человек💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша неофициальная RolePlay организация отказана, так как у вас нет стартового состава из трёх и более человек.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 💫не зарегистрированы💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша неофициальная RolePlay организация отказана, так как указанные вами участники не зарегистрированы на сервере.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 💫Ошибка разделом💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Вы ошиблись разделом, это раздел для создания неофициальных организаций.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 💫не по форме💫 |',
              content:
            "[HEADING=3][CENTER][I][COLOR=rgb(123, 104, 238)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша Неофициальная RolePlay организация отказана, так как составлена не по форме.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 💫заголовок не по форме💫 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/SIZE][/FONT][/HEADING]"+
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша неофициальная RolePlay организация отказана, так как заголовок составлен не по форме.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
            },
            {
                title: '| 💫скопирована💫 |',
              content:
            "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/SIZE][/FONT][/HEADING]"+
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]Ваша Неофициальная RolePlay организация отказана, так как она скопирована.[/I][/SIZE][/FONT]<br>" +
            "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
            "[FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
               prefix: UNACCEPT_PREFIX,
              status: false,
                },
                {
                   title: '-------------------------------------------------------| 👾Отказ жалобы👾 |------------------------------------------------------',
                   content:
                  '[COLOR=rgb(123, 104, 238)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
                },
                {
                      title: '|👾 Ошибка сервером 👾|',
                    content:
                    "[HEADING=3][CENTER][FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT][/HEADING]" +
                    "[IMG width=695px]https://vk.com/doc758928850_688186340?hash=UW8BEhCZPSgxlTkUn7Rj7ub9Z1iRLf8cPDg0IKr2ZJX&dl=kmF1K5zQRlmUV1q2qnMzbgEYJJp0KzvzK4x8dVMpvtc&api=1&no_preview=1[/IMG]<br>"+
                    "[FONT=georgia][SIZE=4][COLOR=rgb(123, 104, 238)] Ошиблись сервером, переношу на нужный. Ожидайте ответа От Администрации вашего сервера.[/I][/SIZE][/FONT][/CENTER]",
                    prefix: WAIT_PREFIX,
                   status: false,
            },
              {
          title: '------------------------------------------------------| INFORMATION |-------------------------------------------------------------------',
          content:
              '[COLOR=rgb(123, 104, 238)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
          },
             {
          title: '| РАЗРАБОТЧИК HARDIN MYRPHY  |',
          content:
              '[COLOR=rgb(123, 104, 238)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
          },
               {
          title: '| SERVER TOLYATTI|',
          content:
     
    "[HEADING=3][CENTER][COLOR=rgb(123, 104, 238)][I][B][FONT=georgia][SIZE=4] SERVER TOLYATTI [/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: UNACCEPT_PREFIX,
            status: false,
            },
              {
          title: '|  VK  |',
          content:
     
    "[HEADING=3][CENTER][COLOR=rgb(123, 104, 238)][I][B][FONT=georgia][SIZE=4]https://vk.com/smyrfak[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: UNACCEPT_PREFIX,
            status: false,
            },
             {
          title: '| Форумный аккаунт |',
          content:
     
    "[HEADING=3][CENTER][COLOR=rgb(123, 104, 238)][I][B][FONT=georgia][SIZE=4]https://forum.blackrussia.online/members/hardin-myrphy.3850784/[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: UNACCEPT_PREFIX,
            status: false,
            },
            ];
         
          $(document).ready(() => {
            // Загрузка скрипта для обработки шаблонов
            $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
         
            // Добавление кнопок при загрузке страницы
            addButton('💥На рассмотрени💥', 'pin');
            addButton('🔥Вынести приговор🔥', 'selectAnswer');
         
            // Поиск информации о теме
            const threadData = getThreadData();
         
            $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
            $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
            $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
            $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
            $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
            $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
            $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
            $('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
            $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
            $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
         
            $('button#selectAnswer').click(() => {
              XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
              buttons.forEach((btn, id) => {
                if (id > 0) {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
              });
            });
          });
         
          function addButton(name, id) {
            $('.button--icon--reply').before(
              `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
            );
          }
         
          function buttonsMarkup(buttons) {
            return `<div class="select_answer">${buttons
              .map(
                (btn, i) =>
                  `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
              )
              .join('')}</div>`;
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
                4 < hours && hours <= 11 ?
                  'Доброе утро' :
                  11 < hours && hours <= 15 ?
                    'Добрый день' :
                    15 < hours && hours <= 21 ?
                      'Добрый вечер' :
                      'Доброй ночи',
            };
          }
         
        function editThreadData(prefix, pin = false) {
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
            }
            if(pin == true){
                fetch(`${document.URL}edit`, {
                  method: 'POST',
                  body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    discussion_open: 0,
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

