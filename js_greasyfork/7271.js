// ==UserScript==
// @name TW-Collections-RU Translation
// @namespace TomRobert
// @author Anch665 (updated by Tom Robert)
// @description Russian (ру́сский) Translation - TW-Collections - (Anch665 & russia-spb)
// @include http*://*.the-west.*/game.php*
// @version 1.4.0
// @grant none 
// @downloadURL https://update.greasyfork.org/scripts/7271/TW-Collections-RU%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/7271/TW-Collections-RU%20Translation.meta.js
// ==/UserScript==
(function (e) {
  var t = document.createElement('script');
  t.type = 'application/javascript';
  t.textContent = '(' + e + ')();';
  document.body.appendChild(t);
  t.parentNode.removeChild(t)
})
(function () {
  if (window.location.href.indexOf('.the-west.') > 0) {
    TWT_ADDLANG = {
      translator: 'Anch665 & russia-spb',
      idscript: '7271',
      version: '1.4.0',
      short_name: 'ru',
      name: 'Русский',
      translation: {
        description: '<center><BR /><b>TW-Collections</b><br>Советы и отчеты о недостающих предметах коллекций<br>список необходимых предметов<br>Оплата услуг банка мышью<br>Различные ярлыки<br>Удаление всех отчетов<br>Дополнительные кнопки в инвентаре (дубликаты, рецепты, наборы)<br>другое...',
        Options: {
          tab: {
            setting: 'Настройки'
          },
          checkbox_text: {
            box: {
              title: 'Особенности / Меню',
              options: {
                goHome: 'Домой',
                goToDaily1: 'Город Призрак',
                goToDaily2: 'Деревня Вупи ',
                ownSaloon: 'Салун',
                openMarket: 'Рынок',
                mobileTrader: 'Коммивояжёр',
                forum: 'Сплетни',
                listNeeded: 'Коллекции предметов'
              }
            },
            collection: {
              title: 'Коллекции',
              options: {
                gereNewItems: 'Новые предметы для достижений',
                patchsell: 'Отсутствует в багаже',
                patchtrader: 'Отсутствует у коммивояжёра',
                patchmarket: 'Отсутствует на рынке',
                showmiss: 'Список отсутствующих вещей',
                filterMarket: 'Фильтр рынка: показывать только недостающие вещи (коллекции)'
              }
            },
            inventory: {
              title: 'Кнопки в инвентаре',
              //doublons: 'Дополнительные кнопки инвентаря (дублирует,можно съесть, рецепт, наборы)',
              options: {
                doublons: 'Добавить кнопку для поиска дубликатов',
                useables: 'Добавить кнопку для поиска можно съёсть',
                recipe: 'Добавить кнопку для поиска рецептов',
                sets: 'Добавить кнопку для списка наборов',
                sum: 'Сумма продажи'
              }
            },
            miscellaneous: {
              title: 'разнообразный',
              options: {
                lang: 'Язык',
                logout: 'Добавить кнопку Выход',
                deleteAllReports: 'Скрыть все отчёты',
                showFees: 'Комиссия банка',
                popupTWT: 'Открыть меню TW Collection'
              }
            },
			craft: {
                title: 'Craft',
                options: {
                  filterMarket: 'Icon for searching craft item in the market',
                  filterMiniMap: 'Icon for searching craft item job in the minimap'
                }
              },
            twdbadds: {
              title: 'Калькулятор',
              options: {
                filterBuyMarket: 'Фильтр рынка : показывать только недостающие вещи <a target=\'_blanck\' href="http://tw-db.info/?strana=userscript">(twdb add)</a>',
                //addNewToShop: 'Показать вещи в магазине'
              }
            }
          },
          message: {
            title: 'Информация',
            message: 'Предпочтения были применены',
            reloadButton: 'Перезагрузить страницу',
            gameButton: 'Вернуться в игру',
            indispo: 'Установка недоступна (Коллекции собраны или скрипт недоступен)',
            more: 'Подробнее?',
            moreTip: 'Показать советы'
          },
          update: {
            title: 'TW Collection обновление',
            upddaily: 'Каждый день',
            updweek: 'Каждую неделю',
            updnever: 'Никогда',
            checknow: 'Проверить сейчас?',
            updok: 'Скрипт TW Collection\'s обновлен до последней версии',
            updlangmaj: 'Доступно обновление, перейдите по ссылкам ниже, чтобы обновить',
            updscript: 'Доступно обновление TW Collection. Обновить?',
            upderror: 'Невозможно обновить, вы должны установить скрипт вручную'
          },
          saveButton: 'Сохранить'
        },
		Craft: {
            titleMarket: 'Search this item in the market',
            titleMinimap: 'Find corresponding job in the minimap'
          },
        ToolBox: {
          title: 'Особенности',
          list: {
            openOptions: 'Настройки'
          }
        },
        Doublons: {
          tip: 'Дубликаты',
          current: 'Поиск',
          noset: 'Без наборов',
          sellable: 'Частично',
          auctionable: 'Аукцион',
          tipuse: 'Можно съесть',
          tiprecipe: 'Рецепты',
          tipsets: 'Наборы',
          sellGain: 'Сумма продажи'
        },
        Logout: {
          title: 'Выход'
        },
        AllReportsDelete: {
          button: 'Запретить всё',
          title: 'Запретить все отчеты',
          work: 'Работа',
          progress: 'Прогресс',
          userConfirm: 'Подтверждение пользователя',
          loadPage: 'Время загрузки',
          deleteReports: 'Удалить отчеты',
          confirmText: 'Удалить отчеты - Вы уверены?',
          deleteYes: 'Да, удалить',
          deleteNo: 'Нет, оставить',
          status: {
            title: 'Статус',
            wait: 'Подождите',
            successful: 'Успешно',
            fail: 'Ошибка',
            error: 'Ошибка'
          }
        },
        fees: {
          tipText: '%1% Сборы: $%2'
        },
        twdbadds: {
          buyFilterTip: 'Показать только недостающие предметы',
          buyFilterLabel: 'Недостающие'
        },
        collection: {
          miss: 'Отсутствуют: ',
		  colTabTitle: 'Collections',
          setTabTitle: 'Sets',
          thText: 'Отсутствующие предметы',
          thEncours: 'У вас есть заявка на этот предмет',
          thFetch: 'Вы можете получить этот предмет на %1 рынке',
          allOpt: 'Все',
          collectionFilterTip: 'Показать только коллекции предметов',
          collectionFilterLabel: 'Только коллекции',
          select: 'Выберите...',
          listText: 'Нужно для коллекции',
		  listSetText: 'Set\'s items needed',
          filters: 'Фильтры',
          atTrader: 'Коммивояжёр',
          atBid: 'Текущая ставка',
          atCurBid: 'Конечная ставка',
          atTraderTitle: 'Можно купить у коммивояжёра',
          atBidTitle: 'Показать только ставки',
          atCurBidTitle: 'Товары доступные на рынке',
          searchMarket: 'Поиск по рынку',
          patchsell: {
            title: 'Предметы необходимые для коллекции'
          }
        }
      },
      // DO NOT CHANGE BELOW THIS LIGNE
      init: function () {
        var that = this;
        if (typeof window.TWT == 'undefined'
        || window.TWT == null) {
          EventHandler.listen('twt.init', function () {
            TWT.addPatchLang(that);
            return EventHandler.ONE_TIME_EVENT;
          });
        } else {
          EventHandler.signal('twt_lang_started_'
          + that.short_name);
          TWT.addPatchLang(that);
        }
      }
    }.init();
  }
});

