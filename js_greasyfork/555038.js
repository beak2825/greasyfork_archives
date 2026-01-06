// ==UserScript==
// @name             HWHHideButtonsExt
// @name:en          HWHHideButtonsExt
// @name:ru          HWHHideButtonsExt
// @namespace        HWHHideButtonsExt
// @version          2.7
// @description      Extension for HeroWarsHelper script
// @description:en   Extension for HeroWarsHelper script
// @description:ru   Расширение для скрипта HeroWarsHelper
// @author           Green
// @license          Copyright Green
// @icon             https://i.ibb.co/xtmhK7zS/icon.png
// @match            https://www.hero-wars.com/*
// @match            https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at           document-start
// @downloadURL https://update.greasyfork.org/scripts/555038/HWHHideButtonsExt.user.js
// @updateURL https://update.greasyfork.org/scripts/555038/HWHHideButtonsExt.meta.js
// ==/UserScript==

(async function () {
	if (!this.HWHClasses) {
		console.log('%cObject for extension not found', 'color: red');
		return;
	}

    console.log('%cStart Extension ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: red');
    const { addExtentionName } = HWHFuncs;

    addExtentionName(GM_info.script.name, GM_info.script.version, GM_info.script.author);



    const { buttons, othersPopupButtons, i18nLangData, extintionsList} = HWHData;

    const { popup, confShow, setSaveVal, getSaveVal, I18N, getCheckBoxes, Events, setProgress, hideProgress} = HWHFuncs;

    const i18nLangDataEn = {
        HIDE_BUTTONS: 'Hide buttons',
        HIDE_BUTTONS_TITLE: 'Hide buttons in the "Others" section',
        HB_BUTTON_COLOR: 'Button color',
        HB_BUTTON_COLOR_TITLE: 'Change the color of buttons in the "Others" section',
        HB_BUTTON_COLOR_MESSAGE: 'Select color',
        HB_SELECT_BUTTONS:
          `Choose the buttons <br> you want to hide`,
        HB_APPLY: 'Apply',
        HB_OTHERS_SETTINGS:
          `<span style="color: White;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style="width: 22px;height: 22px;"><path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg>
          </span>`,
        HB_OTHERS_SETTINGS_TITLE: 'Button settings',
        HB_OTHERS_SETTINGS_MESSAGE: 'Button setting in the "Others" section',
        HB_CHANGE_COLOR_EXTENSION_BUTTONS: 'Change the color of extension buttons',
        HB_COLOR_GREEN: 'Green',
        HB_COLOR_BROWN: 'Brown',
        HB_COLOR_BLUE: 'Blue',
        HB_COLOR_VIOLET: 'Violet',
        HB_COLOR_YELLOW: 'Yellow',
        HB_COLOR_ORANGE: 'Orange',
        HB_COLOR_INDIGO: 'Indigo',
        HB_COLOR_PINK: 'Pink',
        HB_COLOR_RED: 'Red',
        HB_COLOR_GRAPHITE: 'Graphite',
        HB_GRAPHICS_SWITCH_ON_TITLE: 'Turn on game graphics',
        HB_GRAPHICS_SWITCH_OFF_TITLE: 'Turn off game graphics',
        HB_GRAPHICS_SWITCH_OFF:
          `<span style="color: Lime;">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 512 512" fill="currentColor" xml:space="preserve">
					<path d="M237.545,255.816c9.899,0,18.468-3.609,25.696-10.848c7.23-7.229,10.854-15.799,10.854-25.694V36.547
						c0-9.9-3.62-18.464-10.854-25.693C256.014,3.617,247.444,0,237.545,0c-9.9,0-18.464,3.621-25.697,10.854
						c-7.233,7.229-10.85,15.797-10.85,25.693v182.728c0,9.895,3.617,18.464,10.85,25.694
						C219.081,252.207,227.648,255.816,237.545,255.816z"/>
					<path d="M433.836,157.887c-15.325-30.642-36.878-56.339-64.666-77.084c-7.994-6.09-17.035-8.47-27.123-7.139
						c-10.089,1.333-18.083,6.091-23.983,14.273c-6.091,7.993-8.418,16.986-6.994,26.979c1.423,9.998,6.139,18.037,14.133,24.128
						c18.645,14.084,33.072,31.312,43.25,51.678c10.184,20.364,15.27,42.065,15.27,65.091c0,19.801-3.854,38.688-11.561,56.678
						c-7.706,17.987-18.13,33.544-31.265,46.679c-13.135,13.131-28.688,23.551-46.678,31.261c-17.987,7.71-36.878,11.57-56.673,11.57
						c-19.792,0-38.684-3.86-56.671-11.57c-17.989-7.71-33.547-18.13-46.682-31.261c-13.129-13.135-23.551-28.691-31.261-46.679
						c-7.708-17.99-11.563-36.877-11.563-56.678c0-23.026,5.092-44.724,15.274-65.091c10.183-20.364,24.601-37.591,43.253-51.678
						c7.994-6.095,12.703-14.133,14.133-24.128c1.427-9.989-0.903-18.986-6.995-26.979c-5.901-8.182-13.844-12.941-23.839-14.273
						c-9.994-1.332-19.085,1.049-27.268,7.139c-27.792,20.745-49.344,46.442-64.669,77.084c-15.324,30.646-22.983,63.288-22.983,97.927
						c0,29.697,5.806,58.054,17.415,85.082c11.613,27.028,27.218,50.34,46.826,69.948c19.602,19.603,42.919,35.215,69.949,46.815
						c27.028,11.615,55.388,17.426,85.08,17.426c29.693,0,58.052-5.811,85.081-17.426c27.031-11.604,50.347-27.213,69.952-46.815
						c19.602-19.602,35.207-42.92,46.818-69.948s17.412-55.392,17.412-85.082C456.809,221.174,449.16,188.532,433.836,157.887z"/>
			</svg>
          </span>`,
        HB_GRAPHICS_SWITCH_ON:
          `<span style="color: Silver;">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 512 512" fill="currentColor" xml:space="preserve">
					<path d="M237.545,255.816c9.899,0,18.468-3.609,25.696-10.848c7.23-7.229,10.854-15.799,10.854-25.694V36.547
						c0-9.9-3.62-18.464-10.854-25.693C256.014,3.617,247.444,0,237.545,0c-9.9,0-18.464,3.621-25.697,10.854
						c-7.233,7.229-10.85,15.797-10.85,25.693v182.728c0,9.895,3.617,18.464,10.85,25.694
						C219.081,252.207,227.648,255.816,237.545,255.816z"/>
					<path d="M433.836,157.887c-15.325-30.642-36.878-56.339-64.666-77.084c-7.994-6.09-17.035-8.47-27.123-7.139
						c-10.089,1.333-18.083,6.091-23.983,14.273c-6.091,7.993-8.418,16.986-6.994,26.979c1.423,9.998,6.139,18.037,14.133,24.128
						c18.645,14.084,33.072,31.312,43.25,51.678c10.184,20.364,15.27,42.065,15.27,65.091c0,19.801-3.854,38.688-11.561,56.678
						c-7.706,17.987-18.13,33.544-31.265,46.679c-13.135,13.131-28.688,23.551-46.678,31.261c-17.987,7.71-36.878,11.57-56.673,11.57
						c-19.792,0-38.684-3.86-56.671-11.57c-17.989-7.71-33.547-18.13-46.682-31.261c-13.129-13.135-23.551-28.691-31.261-46.679
						c-7.708-17.99-11.563-36.877-11.563-56.678c0-23.026,5.092-44.724,15.274-65.091c10.183-20.364,24.601-37.591,43.253-51.678
						c7.994-6.095,12.703-14.133,14.133-24.128c1.427-9.989-0.903-18.986-6.995-26.979c-5.901-8.182-13.844-12.941-23.839-14.273
						c-9.994-1.332-19.085,1.049-27.268,7.139c-27.792,20.745-49.344,46.442-64.669,77.084c-15.324,30.646-22.983,63.288-22.983,97.927
						c0,29.697,5.806,58.054,17.415,85.082c11.613,27.028,27.218,50.34,46.826,69.948c19.602,19.603,42.919,35.215,69.949,46.815
						c27.028,11.615,55.388,17.426,85.08,17.426c29.693,0,58.052-5.811,85.081-17.426c27.031-11.604,50.347-27.213,69.952-46.815
						c19.602-19.602,35.207-42.92,46.818-69.948s17.412-55.392,17.412-85.082C456.809,221.174,449.16,188.532,433.836,157.887z"/>
			</svg>
          </span>`,
        HB_GRAPHICS_SWITCH_OFF_MESSAGE:
          `You are going to <span style="color: Lime;"> turn of </span> game graphics
          <br><span style="color: DeepSkyBlue;">The game will restart automatically to apply the changes</span>
          <br> <br> This mode disables the game's graphics and keeps only the essential script buttons active.
          This significantly lowers the strain on your computer, which is perfect for running multiple accounts during long tasks like titanite mining.
          <br>Click the same button again to <span style="color: Lime;">restore the graphics</span>
          <br><br>`,
        HB_GRAPHICS_SWITCH_ON_MESSAGE:
          `You are going to <span style="color: Lime;"> turn on </span> game graphics
          <br><span style="color: DeepSkyBlue;">The game will restart automatically to apply the changes</span>
          <br><br>`,
        HB_DO_NOT_SHOW_AGAIN: 'Don\'t show this window again',


        IS_IMPROVING_SKILLS: 'Skills Improvement',
        IS_IMPROVING_SKILLS_TITLE: 'Automatic Skills Improvement',
        IS_IMPROVING_SKILLS_MESSAGE: `To enable automatic skills improvement, you need to select heroes and turn on automatic improvement.
          The script will notify you when the skills for selected heroes are upgraded to the maximum available level. The order of heroes for improvement is determined by ID.
          <br><br>The first skills improvement occurs during game loading. If you turn on a timer, repeated improvements will occur every hour.
          <br><br><span style='color: Lime;'>When automatic improvement is disabled, skills won't be upgraded regardless of the timer status</span>
          <br><br>You need to reload the game to apply changes`,
        IS_TURN_ON_SKILL_IMPROVEMENT: 'Turn On',
        IS_TURN_ON_SKILL_IMPROVEMENT_TITLE: 'Turn on automatic skills improvement',
        IS_TURN_ON_SKILL_IMPROVEMENT_MESSAGE: 'Automatic skills improvement is enabled',
        IS_TURN_OFF_SKILL_IMPROVEMENT: 'Turn Off',
        IS_TURN_OFF_SKILL_IMPROVEMENT_TITLE: 'Turn off automatic skills improvement',
        IS_TURN_OFF_SKILL_IMPROVEMENT_MESSAGE: 'Automatic skills improvement is disabled',
        IS_HEROES: 'Heroes',
        IS_HEROES_TITLE: 'Select heroes for skills improvement',
        IS_SELECT_HEROES: 'Select heroes<br>to improve their skills',
        IS_HAVE_NO_HEROES: 'You have no heroes that can improve their skills',
        IS_NO_HEROES_SELECTED: 'Automatic skills improvement is enabled, but no heroes are selected.<br>Select heroes or disable automatic improvement.',
        IS_IMPROVING_SKILLS_RESULT: 'Hero skills improved <span style="color: Lime;">{skillPointsSpent}</span> times',
        IS_SKILLS_IMPROVED_TO_MAXIMUM_LEVEL: 'Maximum available hero skill level reached. Improve current heroes or select different ones',
        IS_NOT_ENOUGH_GOLD: 'Not enough gold to further improve hero skills',
        IS_TURN_ON_TIMER: 'Enable Timer',
        IS_TURN_ON_TIMER_MESSAGE: 'Hourly automatic skills improvement activated',
        IS_TURN_OFF_TIMER: 'Disable Timer',
        IS_TURN_OFF_TIMER_MESSAGE: 'Hourly automatic skills improvement deactivated',
        IS_TURN_ON_TIMER_TITLE: 'Turn on hourly automatic skills improvement',
        IS_TURN_OFF_TIMER_TITLE: 'Turn off hourly automatic skills improvement',
        IS_IMPROVING_SKILLS_TIMER_RESULT: `Hero skills improved <span style="color: Lime;">{skillPointsSpent}</span> times <br> Next upgrade in 1 hour`,
    };

    i18nLangData['en'] = Object.assign(i18nLangData['en'], i18nLangDataEn);

    const i18nLangDataRu = {
        BATTLE_RECALCULATION: 'Предрасчет боя',
        HIDE_BUTTONS: 'Скрыть кнопки',
        HIDE_BUTTONS_TITLE: 'Скрыть кнопки в разделе "разное"',
        HB_BUTTON_COLOR: 'Цвет',
        HB_BUTTON_COLOR_TITLE: 'Изменить цвет кнопок в разделе "разное"',
        HB_BUTTON_COLOR_MESSAGE: 'Выберите цвет',
        HB_SELECT_BUTTONS:
          `Выберите кнопки, <br> которые нужно скрыть`,
        HB_APPLY: 'Применить',
        HB_OTHERS_SETTINGS:
          `<span style="color: White;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style="width: 22px;height: 22px;"><path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg>
          </span>`,
        HB_OTHERS_SETTINGS_TITLE: 'Настройки кнопок',
        HB_OTHERS_SETTINGS_MESSAGE: 'Настройки кнопок в разделе "Разное"',
        HB_CHANGE_COLOR_EXTENSION_BUTTONS: 'Изменить цвет кнопок расширений',
        HB_COLOR_GREEN: 'Зеленый',
        HB_COLOR_BROWN: 'Коричневый',
        HB_COLOR_BLUE: 'Синий',
        HB_COLOR_VIOLET: 'Фиолетовый',
        HB_COLOR_YELLOW: 'Желтый',
        HB_COLOR_ORANGE: 'Оранжевый',
        HB_COLOR_INDIGO: 'Индиго',
        HB_COLOR_PINK: 'Розовый',
        HB_COLOR_RED: 'Красный',
        HB_COLOR_GRAPHITE: 'Серый',
        HB_GRAPHICS_SWITCH_ON_TITLE: 'Включить графику игры',
        HB_GRAPHICS_SWITCH_OFF_TITLE: 'Выключить графику игры',
        HB_GRAPHICS_SWITCH_OFF:
        `<span style="color: Lime;">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 512 512" fill="currentColor" xml:space="preserve">
					<path d="M237.545,255.816c9.899,0,18.468-3.609,25.696-10.848c7.23-7.229,10.854-15.799,10.854-25.694V36.547
						c0-9.9-3.62-18.464-10.854-25.693C256.014,3.617,247.444,0,237.545,0c-9.9,0-18.464,3.621-25.697,10.854
						c-7.233,7.229-10.85,15.797-10.85,25.693v182.728c0,9.895,3.617,18.464,10.85,25.694
						C219.081,252.207,227.648,255.816,237.545,255.816z"/>
					<path d="M433.836,157.887c-15.325-30.642-36.878-56.339-64.666-77.084c-7.994-6.09-17.035-8.47-27.123-7.139
						c-10.089,1.333-18.083,6.091-23.983,14.273c-6.091,7.993-8.418,16.986-6.994,26.979c1.423,9.998,6.139,18.037,14.133,24.128
						c18.645,14.084,33.072,31.312,43.25,51.678c10.184,20.364,15.27,42.065,15.27,65.091c0,19.801-3.854,38.688-11.561,56.678
						c-7.706,17.987-18.13,33.544-31.265,46.679c-13.135,13.131-28.688,23.551-46.678,31.261c-17.987,7.71-36.878,11.57-56.673,11.57
						c-19.792,0-38.684-3.86-56.671-11.57c-17.989-7.71-33.547-18.13-46.682-31.261c-13.129-13.135-23.551-28.691-31.261-46.679
						c-7.708-17.99-11.563-36.877-11.563-56.678c0-23.026,5.092-44.724,15.274-65.091c10.183-20.364,24.601-37.591,43.253-51.678
						c7.994-6.095,12.703-14.133,14.133-24.128c1.427-9.989-0.903-18.986-6.995-26.979c-5.901-8.182-13.844-12.941-23.839-14.273
						c-9.994-1.332-19.085,1.049-27.268,7.139c-27.792,20.745-49.344,46.442-64.669,77.084c-15.324,30.646-22.983,63.288-22.983,97.927
						c0,29.697,5.806,58.054,17.415,85.082c11.613,27.028,27.218,50.34,46.826,69.948c19.602,19.603,42.919,35.215,69.949,46.815
						c27.028,11.615,55.388,17.426,85.08,17.426c29.693,0,58.052-5.811,85.081-17.426c27.031-11.604,50.347-27.213,69.952-46.815
						c19.602-19.602,35.207-42.92,46.818-69.948s17.412-55.392,17.412-85.082C456.809,221.174,449.16,188.532,433.836,157.887z"/>
			</svg>
        </span>`,
        HB_GRAPHICS_SWITCH_ON:
        `<span style="color: Silver;">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 512 512" fill="currentColor" xml:space="preserve">
					<path d="M237.545,255.816c9.899,0,18.468-3.609,25.696-10.848c7.23-7.229,10.854-15.799,10.854-25.694V36.547
						c0-9.9-3.62-18.464-10.854-25.693C256.014,3.617,247.444,0,237.545,0c-9.9,0-18.464,3.621-25.697,10.854
						c-7.233,7.229-10.85,15.797-10.85,25.693v182.728c0,9.895,3.617,18.464,10.85,25.694
						C219.081,252.207,227.648,255.816,237.545,255.816z"/>
					<path d="M433.836,157.887c-15.325-30.642-36.878-56.339-64.666-77.084c-7.994-6.09-17.035-8.47-27.123-7.139
						c-10.089,1.333-18.083,6.091-23.983,14.273c-6.091,7.993-8.418,16.986-6.994,26.979c1.423,9.998,6.139,18.037,14.133,24.128
						c18.645,14.084,33.072,31.312,43.25,51.678c10.184,20.364,15.27,42.065,15.27,65.091c0,19.801-3.854,38.688-11.561,56.678
						c-7.706,17.987-18.13,33.544-31.265,46.679c-13.135,13.131-28.688,23.551-46.678,31.261c-17.987,7.71-36.878,11.57-56.673,11.57
						c-19.792,0-38.684-3.86-56.671-11.57c-17.989-7.71-33.547-18.13-46.682-31.261c-13.129-13.135-23.551-28.691-31.261-46.679
						c-7.708-17.99-11.563-36.877-11.563-56.678c0-23.026,5.092-44.724,15.274-65.091c10.183-20.364,24.601-37.591,43.253-51.678
						c7.994-6.095,12.703-14.133,14.133-24.128c1.427-9.989-0.903-18.986-6.995-26.979c-5.901-8.182-13.844-12.941-23.839-14.273
						c-9.994-1.332-19.085,1.049-27.268,7.139c-27.792,20.745-49.344,46.442-64.669,77.084c-15.324,30.646-22.983,63.288-22.983,97.927
						c0,29.697,5.806,58.054,17.415,85.082c11.613,27.028,27.218,50.34,46.826,69.948c19.602,19.603,42.919,35.215,69.949,46.815
						c27.028,11.615,55.388,17.426,85.08,17.426c29.693,0,58.052-5.811,85.081-17.426c27.031-11.604,50.347-27.213,69.952-46.815
						c19.602-19.602,35.207-42.92,46.818-69.948s17.412-55.392,17.412-85.082C456.809,221.174,449.16,188.532,433.836,157.887z"/>
			</svg>
        </span>`,
        HB_GRAPHICS_SWITCH_OFF_MESSAGE:
        `Вы собираетесь <span style="color: Lime;">отключить</span> графику игры
        <br><span style="color: DeepSkyBlue;"> Для применения изменений игра будет перезагружена автоматически </span>
        <br> <br> Отключается визуальная часть игры, остаются активными только кнопки скрипта.
        Это значительно снижает нагрузку на компьютер, что особенно полезно при копании титанита несколькими аккаунтами одновременно.
        <br>Чтобы <span style="color: Lime;">включить графику </span> обратно, просто нажмите на эту же кнопку.
        <br><br>`,
        HB_GRAPHICS_SWITCH_ON_MESSAGE:
        `Вы собираетесь <span style="color: Lime;">включить</span> графику игры
        <br><span style="color: DeepSkyBlue;"> Для применения изменений игра будет перезагружена автоматически </span>
        <br><br>`,
        HB_DO_NOT_SHOW_AGAIN: `Больше не показывать это сообщение`,

        IS_IMPROVING_SKILLS: 'Улучшение умений',
        IS_IMPROVING_SKILLS_TITLE: 'Автоматическое улучшение умений героев',
        IS_IMPROVING_SKILLS_MESSAGE: `Для автоматического улучшения умений необходимо выбрать героев, и включить автоматическое улучшение.
          Скрипт оповестит, когда умения для выбранных героев будут улучшены до максимально доступного уровня. Очередность героев для улучшения определяется по Id.
          <br> <br> Первое улучшение умений происходит во время загрузки игры.
          Если добавить таймер, то повторное улучшение умений будет происходить каждый час.
          <br> <br> <span style="color: Lime;">При выключении автоматического улучшения умения не улучшаются, независимо от состояния таймера</span>
          <br> <br> Для применения изменений необходимо перезагрузить игру`,
        IS_TURN_ON_SKILL_IMPROVEMENT: 'Включить',
        IS_TURN_ON_SKILL_IMPROVEMENT_TITLE: 'Включить автоматическое улучшение умений',
        IS_TURN_ON_SKILL_IMPROVEMENT_MESSAGE: 'Автоматическое улучшение  умений включено',
        IS_TURN_OFF_SKILL_IMPROVEMENT: 'Выключить',
        IS_TURN_OFF_SKILL_IMPROVEMENT_TITLE: 'Выключить автоматическое улучшение умений',
        IS_TURN_OFF_SKILL_IMPROVEMENT_MESSAGE: 'Автоматическое улучшение умений выключено',
        IS_HEROES: 'Герои',
        IS_HEROES_TITLE: 'Выбрать героев для улучшения умений',
        IS_SELECT_HEROES: 'Выберите героев, <br> которым улучшать умения',
        IS_HAVE_NO_HEROES: 'У Вас нет героев, которым можно улучшить умения',
        IS_NO_HEROES_SELECTED: 'Автоматическое улучшение умений включено, но герои не выбраны. <br>Выберите героев или выключите автоматическое улучшение уменийА.',
        IS_IMPROVING_SKILLS_RESULT: 'Умения героев улучшены <span style="color: Lime;">{skillPointsSpent}</span> раз',
        IS_SKILLS_IMPROVED_TO_MAXIMUM_LEVEL: 'Достигнут максимальный доступный уровень умений героев. Улучшите текущих героев или выберите других',
        IS_NOT_ENOUGH_GOLD: 'Для дальнейшего улучшения умений героя недостаточно золота',
        IS_TURN_ON_TIMER: 'Добавить таймер',
        IS_TURN_ON_TIMER_MESSAGE: 'Автоматическое улучшение умений каждый час включено',
        IS_TURN_OFF_TIMER: 'Убрать таймер',
        IS_TURN_OFF_TIMER_MESSAGE: 'Автоматическое улучшение умений каждый час выключено',
        IS_TURN_ON_TIMER_TITLE: 'Включить автоматическое улучшение умений каждый час',
        IS_TURN_OFF_TIMER_TITLE: 'Выключить автоматическое улучшение умений каждый час',
        IS_IMPROVING_SKILLS_TIMER_RESULT: `Умения героев улучшены <span style="color: Lime;">{skillPointsSpent}</span> раз
          <br> Следующее улучшение умений через час`,
    };

    i18nLangData['ru'] = Object.assign(i18nLangData['ru'], i18nLangDataRu);

    document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.innerText = `.scriptMenu_otherButton {width: 114px;}`;
        document.head.appendChild(style);
    });

    //Для включения / отключения графики
    let buttonState = null;
    let graphicsEnabled = true;
    let doNotShowAgain = false;
    const buttonStateString = localStorage.getItem('buttonState');
    if (buttonStateString) {
        try {
            buttonState = JSON.parse(buttonStateString);
            graphicsEnabled = buttonState.graphicsEnabled;
            doNotShowAgain = buttonState.doNotShowAgain;
        } catch (e) {
            console.error(e);
            graphicsEnabled = true;
            doNotShowAgain = false;
        }
    }

    //Выключить графику при старте игры
    if (!graphicsEnabled) {
        turnOffGraphics();
    }

    //Список расширений
    let versionHWHBestDungeonExt = '0.0.23';
    if (extintionsList) {
        for (let ext of extintionsList) {
            if (ext.name == 'HWHBestDungeonExt') {
                versionHWHBestDungeonExt = ext.ver;
            }
        }
    }

    let automaticSkillImprovement = false;
    let automaticSkillImprovementTimer = false;
    Events.on('startGame', async () => {
        //Для включения / выключения автоматического улучшения умений
        automaticSkillImprovement = getSaveVal('automaticSkillImprovement', false);
        automaticSkillImprovementTimer = getSaveVal('automaticSkillImprovementTimer', false);
        if (automaticSkillImprovement) {
            await automaticallyImproveHeroesSkills();
            if (automaticSkillImprovementTimer) {
                for (let i = 1; i <= 6; i++){
                    const startTime = Date.now();
                    const hour = 57 * 60 * 1000; // 57 минут в миллисекундах
                    while (Date.now() - startTime < hour) {
                        await new Promise((e) => setTimeout(e, 60000)); // таймаут 60 секунд
                        console.log('Прошло времени:', Math.round((Date.now() - startTime) / 1000), 'сек');
                    }
                    let stopTheTimer = await automaticallyImproveHeroesSkills();
                    if (stopTheTimer) {
                        console.log("Улучшение умений по времени остановлено");
                        break;
                    }
                }
            }
        }
    });


    //Замена кнопки "Разное"
    buttons['doOthers'] = {
        isCombine: true,
        combineList: [
            {
                get name() {
                    return I18N('OTHERS');
                },
                get title() {
                    return I18N('OTHERS_TITLE');
                },
                onClick: async function () {
                    await makeListOfButtons();
                },
                classes: ['scriptMenu_otherButton']
            },
            {
                get name() {
                    if (graphicsEnabled) {
                        if (compareVersions(scriptInfo.version, '2.400') >= 0 && compareVersions(versionHWHBestDungeonExt, '0.0.23') >= 0) {
                            return I18N('HB_GRAPHICS_SWITCH_OFF');
                        }
                        return '<span style="color: Lime; font-size: 25px;">⏻</span>';
                    }
                    if (compareVersions(scriptInfo.version, '2.400') >= 0 && compareVersions(versionHWHBestDungeonExt, '0.0.23') >= 0) {
                        return I18N('HB_GRAPHICS_SWITCH_ON');
                    }
                    return '<span style="color: Silver; font-size: 25px;">⏻</span>';
                },
                get title() {
                    if (graphicsEnabled) {
                        return I18N('HB_GRAPHICS_SWITCH_OFF_TITLE');
                    }
                    return I18N('HB_GRAPHICS_SWITCH_ON_TITLE');
                },
                onClick: async function () {
                    await onClicGraphicsSwitchButton();
                }
            },
        ],
    };
    //Добавить кнопку в Разное
    othersPopupButtons.unshift({
        get msg() {
            if (compareVersions(scriptInfo.version, '2.400') >= 0) {
                return I18N('HB_OTHERS_SETTINGS');
            }
            return '<span style="color: White; font-size: 28px;">⚙</span>';
        },
        get title() {
            return I18N('HB_OTHERS_SETTINGS_TITLE');
        },
        result:async function () {
            await onClickSettings();
        },
        color: 'blue',
    });

    othersPopupButtons.push({
        get msg() {
            return I18N('IS_IMPROVING_SKILLS');
        },
        get title() {
            return I18N('IS_IMPROVING_SKILLS_TITLE');
        },
        result:async function () {
			await onClickImprovingSkillss();
		},
		color: 'pink',
	});

    async function onClickSettings() {
        let colorMainButtons = getSaveVal('colorMainButtons', false);
        let color = 'green';
        if (colorMainButtons) {
            color = colorMainButtons;
        }
        const popupButtons = [
            {
                get msg() {
                    return I18N('HIDE_BUTTONS');
                },
                get title() {
                    return I18N('HIDE_BUTTONS_TITLE');
                },
                result: async function () {
                    await selectButtons();
                },
                color: color,
            },
            {
                get msg() {
                    return I18N('HB_BUTTON_COLOR');
                },
                get title() {
                    return I18N('HB_BUTTON_COLOR_TITLE');
                },
                result: async function () {
                    await selectColor();
                },
                color: color,
            },
        ];
        popupButtons.push({
            result:async function () {
                await makeListOfButtons();
            },
            isClose: true,
        });

        const answer = await popup.confirm(`${I18N('HB_OTHERS_SETTINGS_MESSAGE')}`, popupButtons);
        if (typeof answer === 'function') {
            answer();
        }
    };
    async function onClickImprovingSkillss() {
        automaticSkillImprovement = getSaveVal('automaticSkillImprovement', false);
        let colorButton = 'green';
        if (!automaticSkillImprovement) {
            colorButton = 'graphite';
        }
        automaticSkillImprovementTimer = getSaveVal('automaticSkillImprovementTimer', false);
        let timerButtonColor = 'green';
        if (!automaticSkillImprovementTimer) {
            timerButtonColor = 'graphite';
        }
        const popupButtons = [
            {
                get msg() {
                    if (automaticSkillImprovement) {
                        return I18N('IS_TURN_OFF_SKILL_IMPROVEMENT');
                    }
                    return I18N('IS_TURN_ON_SKILL_IMPROVEMENT');
                },
                get title() {
                    if (automaticSkillImprovement) {
                        return I18N('IS_TURN_OFF_SKILL_IMPROVEMENT_TITLE');
                    }
                    return I18N('IS_TURN_ON_SKILL_IMPROVEMENT_TITLE');
                },
                result: async function () {
                    let msg = '';
                    //Выключить автоматическое улучшение, если оно включено
                    if (automaticSkillImprovement) {
                        automaticSkillImprovement = false;
                        msg = I18N('IS_TURN_OFF_SKILL_IMPROVEMENT_MESSAGE');
                    } else {
                        //Включить автоматическое улучшение, если оно выключено
                        automaticSkillImprovement = true;
                        msg = I18N('IS_TURN_ON_SKILL_IMPROVEMENT_MESSAGE');
                    }
                    setSaveVal('automaticSkillImprovement', automaticSkillImprovement);
                    confShow(msg);
                    return;
                },
                color: colorButton,
            },
            {
                get msg() {
                    if (automaticSkillImprovementTimer) {
                        return I18N('IS_TURN_OFF_TIMER');
                    }
                    return I18N('IS_TURN_ON_TIMER');
                },
                get title() {
                    if (automaticSkillImprovementTimer) {
                        return I18N('IS_TURN_OFF_TIMER_TITLE');
                    }
                    return I18N('IS_TURN_ON_TIMER_TITLE');
                },
                result: async function () {
                    let msg = '';
                    //Выключить автоматическое улучшение, если оно включено
                    if (automaticSkillImprovementTimer) {
                        automaticSkillImprovementTimer = false;
                        msg = I18N('IS_TURN_OFF_TIMER_MESSAGE');
                    } else {
                        //Включить автоматическое улучшение, если оно выключено
                        automaticSkillImprovementTimer = true;
                        msg = I18N('IS_TURN_ON_TIMER_MESSAGE');
                    }
                    setSaveVal('automaticSkillImprovementTimer', automaticSkillImprovementTimer);
                    confShow(msg);
                    return;
                },
                color: timerButtonColor,
            },
            {
                get msg() {
                    return I18N('IS_HEROES');
                },
                get title() {
                    return I18N('IS_HEROES_TITLE');
                },
                result: async function () {
                    await selectHeroes();
                },
                //color: 'blue',
            },
        ];
        popupButtons.push({ result: false, isClose: true });
        const answer = await popup.confirm(`${I18N('IS_IMPROVING_SKILLS_MESSAGE')}`, popupButtons);
        if (typeof answer === 'function') {
            answer();
        }
    };

    async function automaticallyImproveHeroesSkills() {
        let stopTheTimer = false;
        let selectedHeroIdsForImprovement = getSaveVal('selectedHeroIdsForImprovement', []);
        if (selectedHeroIdsForImprovement.length == 0) {
            confShow(I18N('IS_NO_HEROES_SELECTED'));
            stopTheTimer = true;
            return stopTheTimer;
        }
        const [heroes, user] = await Caller.send(['heroGetAll', 'userGetInfo']);
        let skillPoints = user.refillable[1].amount;
        let skillPointsStart = skillPoints;
        let gold = user.gold;
        let notEnoughGold = false;
        if (skillPoints < 3) {
            stopTheTimer = false;
            return stopTheTimer;
        }
        /**
		 * color - 1 (белый) открывает 1 умение
		 * color - 2 (зеленый) открывает 2 умение
		 * color - 4 (синий) открывает 3 умение
		 * color - 7 (фиолетовый) открывает 4 умение
		 */
        const colors = [1, 2, 4, 7];
        for (let heroId of selectedHeroIdsForImprovement) {
            if (skillPoints == 0 || notEnoughGold) {
                break;
            }
            let skills = getHeroSkills(Number(heroId));
            let heroLvl = heroes[heroId].level;
            let heroColor = heroes[heroId].color;
            for (let skill of skills) {
                let skillLvl = heroes[heroId].skills[skill];
                if (heroColor < colors[skills.indexOf(skill)] || skillPoints == 0 || notEnoughGold) {
                    break;
                }
                if (skillLvl == heroLvl) {
                    continue;
                }
                let calls = [];
                while (skillPoints > 0){
                    if (skillLvl == heroLvl) {
                        break;
                    }
                    let nextLevelSkillCost = lib.data.level.skillLevelCost[skillLvl+1].tierCost[1];
                    if (gold > nextLevelSkillCost) {
                        calls.push({name: 'heroUpgradeSkill', args: {heroId: heroId, skill: skills.indexOf(skill)+1}});
                        gold -= nextLevelSkillCost;
                        skillLvl ++;
                        skillPoints --;
                    } else {
                        notEnoughGold = true;
                        break;
                    }
                }
                if (calls.length >= 1) {
                    await Caller.send(calls);
                }
            }
        }
        if (skillPoints < skillPointsStart) {
            await new Promise((e) => setTimeout(e, 4000));
            if (automaticSkillImprovementTimer) {
                setProgress(I18N('IS_IMPROVING_SKILLS_TIMER_RESULT', {skillPointsSpent: skillPointsStart - skillPoints}), false, hideProgress);
                console.log("%cУмений героев улучшено / Hero skills have been improved: " + (skillPointsStart - skillPoints), "color: red; font-weight: bold;");
            } else {
                setProgress(I18N('IS_IMPROVING_SKILLS_RESULT', {skillPointsSpent: skillPointsStart - skillPoints}), false, hideProgress);
                console.log("%cУмений героев улучшено / Hero skills have been improved: " + (skillPointsStart - skillPoints), "color: red; font-weight: bold;");
            }
        }
        if (notEnoughGold) {
            confShow(I18N('IS_NOT_ENOUGH_GOLD'));
            stopTheTimer = true;
            return stopTheTimer;
        }
        if (skillPoints > 0) {
            confShow(I18N('IS_SKILLS_IMPROVED_TO_MAXIMUM_LEVEL'));
            stopTheTimer = true;
            return stopTheTimer;
        }
    }

    async function makeListOfButtons() {
        let colorMainButtons = getSaveVal('colorMainButtons', false);
        let changeColorExtensionButtons = getSaveVal('changeColorExtensionButtons', false);
        let hideSelectedButtons = getSaveVal('hideSelectedButtons', false);
        let buttonLanguage = getSaveVal('buttonLanguage', false);

        let changedGameLanguage = false;
        if (buttonLanguage != I18N('HIDE_BUTTONS')) {
            changedGameLanguage = true;
        }
        //Сохранение списка цветов кнопок "по умолчанию"
        let othersPopupButtonsColors = [];
        for (let button of othersPopupButtons) {
            othersPopupButtonsColors.push(button.color);
        }

        let newOthersPopupButtons = othersPopupButtons;
        if (hideSelectedButtons && !changedGameLanguage) {
            for (let button of hideSelectedButtons) {
                if (button.checked == true) {
                    newOthersPopupButtons = newOthersPopupButtons.filter((e) => e.msg != button.name);
                }
            }
        }

        //Смена цвета кнопок
        let othersPopupButtonsName = ['GET_ENERGY', 'ITEM_EXCHANGE','BUY_SOULS','BUY_FOR_GOLD','BUY_OUTLAND','CLAN_STAT','EPIC_BRAWL',
                                      'ARTIFACTS_UPGRADE','SKINS_UPGRADE','SEASON_REWARD','SELL_HERO_SOULS','CHANGE_MAP','HERO_POWER'];
        let color = '';
        if (colorMainButtons && !changeColorExtensionButtons) {
            color = colorMainButtons;
            for (let button of newOthersPopupButtons) {
                for (let buttonName of othersPopupButtonsName) {
                    if (button.msg == I18N(buttonName)){
                        button.color = color;
                    }
                }
            }
        }
        if (colorMainButtons && changeColorExtensionButtons) {
            color = colorMainButtons;
            for (let button of newOthersPopupButtons) {
                button.color = color;
            }
        }
        console.log(othersPopupButtons);
        console.log(newOthersPopupButtons);
        newOthersPopupButtons.push({ result: false, isClose: true });

        const answer = await popup.confirm(`${I18N('CHOOSE_ACTION')}:`, newOthersPopupButtons);
        if (typeof answer === 'function') {
            answer();
        }
        //Возвращение цвета кнопкам "по умолчанию"
        for (let i = 0; i < othersPopupButtons.length; i++) {
            othersPopupButtons[i].color = othersPopupButtonsColors[i]
        }
    }

    async function selectButtons() {
        let hideSelectedButtons = getSaveVal('hideSelectedButtons', false);
        let buttonLanguage = getSaveVal('buttonLanguage', false);

        let changedGameLanguage = false;
        if (buttonLanguage != I18N('HIDE_BUTTONS')) {
            changedGameLanguage = true;
        }

        //Пересобираем список чекбоксов
        if (hideSelectedButtons && !changedGameLanguage){
            let newSelectedButtons = [];
            for (let button of othersPopupButtons) {
                if (!button.result || button.title == I18N('HB_OTHERS_SETTINGS_TITLE')) {
                    continue;
                }
                let newButton = true;
                for (let b of hideSelectedButtons) {
                    if (button.msg == b.name) {
                        newSelectedButtons.push({
                            name:button.msg,
                            label: button.msg,
                            title: button.title,
                            checked: b.checked,
                        });
                        newButton = false;
                        break;
                    }
                }
                if (newButton) {
                    newSelectedButtons.push({
                        name:button.msg,
                        label: button.msg,
                        title: button.title,
                        checked: false,
                    });
                }
            }
            hideSelectedButtons = newSelectedButtons;
        }

        //Впервые собираем или пересобираем все чекбоксы если изменен язык игры
        if (!hideSelectedButtons || changedGameLanguage){
            hideSelectedButtons = [];
            for (let button of othersPopupButtons) {
                if (!button.result || button.title == I18N('HB_OTHERS_SETTINGS_TITLE')) {
                    continue;
                }
                hideSelectedButtons.push({
                    name:button.msg,
                    label: button.msg,
                    title: button.title,
                    checked: false,
                });
            }
        }

        let answer = await popup.confirm(
            I18N('HB_SELECT_BUTTONS'),
            [
                { msg: I18N('HB_APPLY'), result: true, color: 'green' },
                { msg: I18N('BTN_CANCEL'), result: false, isCancel: true, color: 'red' },
            ],
            hideSelectedButtons
        );
        if (!answer) {
            await onClickSettings();
            return;
        }
        const taskList = popup.getCheckBoxes();
        for (let button of taskList) {
            hideSelectedButtons[taskList.indexOf(button)].checked = button.checked;
        }

        setSaveVal('hideSelectedButtons', hideSelectedButtons);
        setSaveVal('buttonLanguage', I18N('HIDE_BUTTONS'));

        await makeListOfButtons();
    }

    async function onClicGraphicsSwitchButton() {
        //Если галочка "не показывать это" не выбрана
        if (!doNotShowAgain) {
            //Показать предупреждающее окно
            let result = await showWarningWindow();
            if(!result) {
                return;
            }
        }
        //Если графика включена, то выключаем
        if (graphicsEnabled) {
            graphicsEnabled = false;
            //Если выключена, то включаем
        } else {
            graphicsEnabled = true;
        }
        buttonState = {graphicsEnabled :graphicsEnabled, doNotShowAgain: doNotShowAgain};
        localStorage.setItem('buttonState', JSON.stringify(buttonState));
        //Перезагрузить игру
        location.reload();
    }


    async function showWarningWindow() {
        let checkboxDoNotShowAgain = [];
        checkboxDoNotShowAgain.push({
            name: I18N('HB_DO_NOT_SHOW_AGAIN'),
            label: I18N('HB_DO_NOT_SHOW_AGAIN'),
            checked: false,
        });
        let massege = '';
        if(graphicsEnabled)
        {
            massege = I18N('HB_GRAPHICS_SWITCH_OFF_MESSAGE')
        } else {
            massege = I18N('HB_GRAPHICS_SWITCH_ON_MESSAGE')
        }
        let answer = await popup.confirm(
            massege,
            [
                { msg: I18N('HB_APPLY'), result: true, color: 'green' },
                { msg: I18N('BTN_CANCEL'), result: false, isCancel: true, color: 'red' },
            ],
            checkboxDoNotShowAgain
        );
        if (!answer) {
            return false;
        }
        const taskList = popup.getCheckBoxes();
        for (let button of taskList) {
            if(button.checked) {
                doNotShowAgain = true;
            }
        }
        return true;
    }

    function turnOffGraphics(){
        // Контроль FPS
        const oldRequestAnimationFrame = this.requestAnimationFrame;
        this.requestAnimationFrame = async function (e) {
            const delay = 100000000;
            await new Promise((e) => setTimeout(e, delay));
        };
    }

    function compareVersions(version1, version2) {
        const v1 = version1.split('.').map(Number);
        const v2 = version2.split('.').map(Number);

        const maxLength = Math.max(v1.length, v2.length);

        for (let i = 0; i < maxLength; i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;

            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }

        return 0;
    }

    async function selectColor() {
        let colorMainButtons = getSaveVal('colorMainButtons', false);
        let changeColorExtensionButtons = getSaveVal('changeColorExtensionButtons', false);
        let buttonColors = ['green', 'brown', 'blue', 'violet', 'yellow', 'orange', 'indigo', 'pink', 'red', 'graphite'];
        let colors = [];
        let checked = false;
        if(changeColorExtensionButtons) {
            checked = true;
        }
        colors.push({
            name: 'changeColorExtensionButtons',
            label: I18N('HB_CHANGE_COLOR_EXTENSION_BUTTONS'),
            checked: checked,
        });
        for (let color of buttonColors) {
            checked = false;
            if(color == colorMainButtons) {
                checked = true;
            }
            colors.push({
                name: color,
                label: I18N('HB_COLOR_' + color.toUpperCase()),
                checked: checked,
            });
        }

        let answer = await popup.confirm(
            I18N('HB_BUTTON_COLOR_MESSAGE'),
            [
                { msg: I18N('HB_APPLY'), result: true, color: 'green' },
                { msg: I18N('BTN_CANCEL'), result: false, isCancel: true, color: 'red' },
            ],
            colors
        );
        if (!answer) {
            await onClickSettings();
            return;
        }

        const taskList = popup.getCheckBoxes();
        changeColorExtensionButtons = taskList[0].checked;
        colorMainButtons = false;
        for (let color of taskList) {
            if (color.name == 'changeColorExtensionButtons') {
                continue;
            }
            if (color.checked == true) {
                colorMainButtons = color.name;
                break;
            }
        }
        setSaveVal('colorMainButtons', colorMainButtons);
        setSaveVal('changeColorExtensionButtons', changeColorExtensionButtons);
        await makeListOfButtons();
    }

    async function selectHeroes() {
        let heroes = await getAllHeroesWithoutMaxSkills();
        if (heroes.length == 0) {
            confShow(I18N('IS_HAVE_NO_HEROES'));
            return;
        }
        let selectedHeroIdsForImprovement = getSaveVal('selectedHeroIdsForImprovement', []);
        let newListHeroIds = [];
        //Пересобираем список чекбоксов
        if (selectedHeroIdsForImprovement.length > 0){
            for (let hero of heroes) {
                let newHero = true;
                for (let heroId of selectedHeroIdsForImprovement) {
                    if (hero.id == Number(heroId)) {
                        newListHeroIds.push({
                            name: hero.id,
                            label: cheats.translate(`LIB_HERO_NAME_${hero.id}`),
                            //title: button.title,
                            checked: true,
                        });
                        newHero = false;
                        break;
                    }
                }
                if (newHero) {
                    newListHeroIds.push({
                        name: hero.id,
                        label: cheats.translate(`LIB_HERO_NAME_${hero.id}`),
                        //title: button.title,
                        checked: false,
                    });
                }
            }
        }

        //Впервые собираем список чекбоксов
        if (selectedHeroIdsForImprovement.length == 0){
            for (let hero of heroes) {
                newListHeroIds.push({
                    name: hero.id,
                    label: cheats.translate(`LIB_HERO_NAME_${hero.id}`),
                    //title: button.title,
                    checked: false,
                });
            }
        }
        //console.log(newListHeroIds);
        newListHeroIds = newListHeroIds.sort((a, b) => a.label.localeCompare(b.label));
        let answer = await popup.confirm(
            I18N('IS_SELECT_HEROES'),
            [
                { msg: I18N('HB_APPLY'), result: true, color: 'green' },
                { msg: I18N('BTN_CANCEL'), result: false, isCancel: true, color: 'red' },
            ],
            newListHeroIds
        );
        if (!answer) {
            return;
        }
        const taskList = popup.getCheckBoxes();
        selectedHeroIdsForImprovement = [];
        for (let hero of taskList) {
            if (hero.checked == true) {
                selectedHeroIdsForImprovement.push(hero.name);
            }
        }
        setSaveVal('selectedHeroIdsForImprovement', selectedHeroIdsForImprovement);
    }

    async function getAllHeroesWithoutMaxSkills() {
        /**
		 * color - 1 (белый) открывает 1 умение
		 * color - 2 (зеленый) открывает 2 умение
		 * color - 4 (синий) открывает 3 умение
		 * color - 7 (фиолетовый) открывает 4 умение
		 */
        const colors = [1, 2, 4, 7];
        const skillLib = lib.getData('skill');

        let result = await Caller.send('heroGetAll');
        let heroGetAll = Object.values(result);
        let heroes = heroGetAll;
        for (let hero of heroGetAll) {
            const heroLvl = hero.level;
            const heroColor = hero.color;
            let allSkillsLvl = [];
            for (let skillId in hero.skills) {
                const tier = skillLib[skillId].tier;
                if (heroColor < colors[tier] || tier < 1 || tier > 4) {
                    continue;
                }
                allSkillsLvl.push(hero.skills[skillId]);
            }
            if (allSkillsLvl.length != 4){
                continue;
            }
            if (allSkillsLvl.every((e) => e == 130)){
                heroes = heroes.filter((e) => e.id != hero.id);
            }
        }
        //console.log(heroes);
        return heroes;
    }

    function getHeroSkills(heroId) {
        const skils = Object.values(lib.getData('skill'))
        .filter((e) => e.hero === heroId &&
                e.tier >= 1 &&
                e.tier <= 4 &&
                e.disabled == null
               ).sort((a, b) => a.tier - b.tier).map((e) => e.id);
        //console.log(skils);
        return skils;
    }
})();