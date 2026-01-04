// ==UserScript==
// @name            HWHGiftOfTheElementsExt
// @name:en         HWHGiftOfTheElementsExt
// @name:ru         HWHGiftOfTheElementsExt
// @namespace       HWHGiftOfTheElementsExt
// @version         3.9
// @description     Extension for HeroWarsHelper script
// @description:en  Extension for HeroWarsHelper script
// @description:ru  Расширение для скрипта HeroWarsHelper
// @author          Green
// @license         Copyright Green
// @icon            https://i.ibb.co/xtmhK7zS/icon.png
// @match           https://www.hero-wars.com/*
// @match           https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/551144/HWHGiftOfTheElementsExt.user.js
// @updateURL https://update.greasyfork.org/scripts/551144/HWHGiftOfTheElementsExt.meta.js
// ==/UserScript==

(function () {
	if (!this.HWHClasses) {
		console.log('%cObject for extension not found', 'color: red');
		return;
	}

	console.log('%cStart Extension ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: red');
	const { addExtentionName } = HWHFuncs;
	addExtentionName(GM_info.script.name, GM_info.script.version, GM_info.script.author);

	const { buttons } = HWHData;

	const { popup, confShow, setProgress, hideProgress, mailGetAll } = HWHFuncs;
	const { i18nLangData } = HWHData;

	const i18nLangDataEn = {
		GIFT_OF_ELEMENTS: 'Gift of the Elements',
		GIFT_OF_ELEMENTS_TITLE: 'Spend "Sparks of Power" or Reset "Gifts of the Elements"',
		GOE_SPEND_SPARKS_OF_POWER: 'Spend "Sparks of Power"',
		GOE_SPEND_SPARKS_OF_POWER_TITLE: 'Spend "Sparks of Power"',
		GOE_RESET_GIFTS: 'Reset "Gifts of the Elements"',
        GOE_RESET_GIFTS_LIGHT: 'Reset "Gifts of the Elements" <br> <span style="color: aqua;"> level 1 - 29 </span>',
		GOE_RESET_GIFTS_LIGHT_TITLE: 'Reset "Gifts of the Elements". You can\'t reset Gift of the Elements level 30.',
        GOE_RESET_GIFTS_EXTREME: 'Reset "Gifts of the Elements" <span style="color: red;"> level 30 </span>',
		GOE_RESET_GIFTS_EXTREME_TITLE: 'Reset "Gifts of the Elements". There is no limit to the level of the Gift of Elements.',
		GOE_SELECT_ACTION: 'Select an action',
		GOE_NOTHING_TO_IMPROVE_LVL30: 'Nothing to improve. Account hasn\'t reached team level 30',
        GOE_NOTHING_TO_IMPROVE: 'Nothing to improve. All heroes have maximum elemental gift level',
		GOE_SPEND_SPARKS_OF_POWER_MESSAGE:
			'Available <span style="color: green;"> {titanGift} </span> sparks of power <br> Specify how many sparks of power need to be spent',
		GOE_INCORRECT_VALUE: 'Incorrect value',
		GOE_IMPROVING_START: 'Improving the Gift of the Elements...',
		GOE_NOT_ENOUGH_RESOURCES: 'Not enough gold or sparks of power',
		GOE_ALL_HEROES_HAVE_30LVL: '<br>All heroes have reached level 30 in Gifts of the Elements',
		GOE_GOLD_IS_GONE: '<br><span style="color: red;"> The gold is gone </span>',
		GOE_PROGRESS_OF_IMPROVEMENT_MESSAGE: 'Gift of the Elements has been upgraded to level <span style="color: green;"> {titanGiftLevel} </span>',
		GOE_RESULT_OF_IMPROVEMENT: 'Gift of the Elements has been upgraded <span style="color: green;"> {counter} </span> time(s)',
		GOE_NOTHING_TO_RESET: 'Nothing to reset',
		GOE_IMPOSSIBLE_TO_RESET: 'You don\'t have any heroes with Elemental Gift below level 30',
		GOE_RESET_GIFTS_LIGHT_MESSAGE:
			`Specify the <span style="color:red;"> maximum </span> reset level for Gift of the Elements
            <br> Range: <span style="color:green;"> 1 </span> to <span style="color:green;"> 29 </span>`,
		GOE_RESULT_RESET_GIFTS: 'Gift of the Elements has been reset for <span style="color: green;"> {counter} </span> hero(es)',
		GOE_RESET_GIFTS_EXTREME_MESSAGE:
			`You have <span style="color:green;"> {level30} </span> hero(es) with level <span style="color:green;">30</span> Gift of the Elements
            <br> Enter how many level <span style="color:green;">30</span> Gifts of the Elements to reset
            <br> <span style="color:red;"> The reset will start with the weakest hero </span> <br> Gifts of the Elements of lower levels will be reset automatically`,
		GOE_EXTREME_DO_NOT_HAVE_HERO_30LVL:
			'You don\'t have any heroes with Gift of the Elements level 30 <br> Reset Gifts of the Elements to a lower level?',
		GOE_EXTREME_RESULT_RESET_GIFTS:
			'<br> <span style="color: green;"> {counter30} </span> of them are level <span style="color:green;">30</span>',
        GOE_GET_POWER: 'Get power',
        GOE_GET_POWER_TITLE: 'Increase the overall power of heroes by the specified amount',
        GOE_GET_POWER_MESSAGE:
			`By spending sparks of power and gold you can get а maximum <span style="color: green;"> {maxHeroPawer} </span> units of hero power
            <br> Specify how much hero power you want to get`,
        GOE_GOT_POWER: '<br> Received <span style="color: green;"> {gotPower} </span> hero power',
        GOE_NOT_ENOUGH_GOLD:
            `<br><br><span style="color: red;">Not enough gold</span> to get all available hero power
            <br> Heve gold: <span style="color: green;">{haveGold} </span> <br> Gold needed: <span style="color: red;"> {goldIsNeeded} </span>`,
	};

	i18nLangData['en'] = Object.assign(i18nLangData['en'], i18nLangDataEn);

	const i18nLangDataRu = {
		GIFT_OF_ELEMENTS: 'Дар стихий',
		GIFT_OF_ELEMENTS_TITLE: 'Потратить "Искры мощи" или Сбросить "Дары стихий"',
		GOE_SPEND_SPARKS_OF_POWER: 'Потратить "Искры мощи"',
		GOE_SPEND_SPARKS_OF_POWER_TITLE: 'Потратить "Искры мощи"',
		GOE_RESET_GIFTS: 'Сбросить "Дары стихий"',
        GOE_RESET_GIFTS_LIGHT: 'Сбросить "Дары стихий" <br> <span style="color: aqua;"> 1 - 29 уровня </span>',
		GOE_RESET_GIFTS_LIGHT_TITLE: 'Сбросить "Дары стихий". Не сбрасывается 30 уровень дара стихий',
        GOE_RESET_GIFTS_EXTREME: 'Сбросить "Дары стихий" <span style="color: red;"> 30 уровня </span>',
		GOE_RESET_GIFTS_EXTREME_TITLE: 'Сбросить "Дары стихий". Нет ограничений уровня дара стихий',
		GOE_SELECT_ACTION: 'Выберите действие',
		GOE_NOTHING_TO_IMPROVE_LVL30: 'Нечего улучшать. Аккаунт не достиг 30 уровня команды',
        GOE_NOTHING_TO_IMPROVE: 'Нечего улучшать. У всех героев максимальный уровень дара стихий',
		GOE_SPEND_SPARKS_OF_POWER_MESSAGE:
			'Доступно <span style="color: green;"> {titanGift} </span> искр мощи <br> Укажите сколько искр мощи потратить',
		GOE_INCORRECT_VALUE: 'Некорректное значение',
		GOE_IMPROVING_START: 'Улучшаем дар стихий...',
		GOE_NOT_ENOUGH_RESOURCES: 'Недостаточно золота или искр мощи',
		GOE_ALL_HEROES_HAVE_30LVL: '<br>Достигнут 30 уровень дара стихий у всех героев',
		GOE_GOLD_IS_GONE: '<br><span style="color: red;"> Закончилось золото </span>',
		GOE_PROGRESS_OF_IMPROVEMENT_MESSAGE: 'Дар стихий улучшен до <span style="color: green;"> {titanGiftLevel} </span> уровня',
		GOE_RESULT_OF_IMPROVEMENT: 'Дар стихий улучшен <span style="color: green;"> {counter} </span> раз(а)',
        GOE_NOTHING_TO_RESET: 'Нечего сбрасывать',
		GOE_IMPOSSIBLE_TO_RESET: 'Нет героев с даром стихий меньше 30 уровня',
        GOE_RESET_GIFTS_LIGHT_MESSAGE:
			`Укажите <span style="color:red;"> максимальный </span> сбрасываемый уровень дара стихий
            <br> Диапазон от <span style="color: green;"> 1 </span> до <span style="color: green;"> 29 </span>`,
		GOE_RESULT_RESET_GIFTS: 'Дар стихий сброшен у <span style="color: green;"> {counter} </span> героев(я)',
		GOE_RESET_GIFTS_EXTREME_MESSAGE:
			`У Вас <span style="color:green;"> {level30} </span> героя(ев) с <span style="color:green;">30</span> уровнем дара стихий
            <br> Укажите сколько даров стихий <span style="color:green;">30</span> уровня сбросить
            <br> <span style="color:red;"> Сброс начнется с самого слабого героя </span> <br> Дары стихий меньших уровней будут сброшены автоматически`,
		GOE_EXTREME_DO_NOT_HAVE_HERO_30LVL:
			'У Вас нет героев с 30 уровнем дара стихий <br> Сбросить дары стихий меньшего уровня?',
		GOE_EXTREME_RESULT_RESET_GIFTS:
			'<br> <span style="color: green;"> {counter30} </span> из них <span style="color:green;">30</span> уровня',
        GOE_GET_POWER: 'Увеличить мощь',
        GOE_GET_POWER_TITLE: 'Увеличить общую мощи героев на указанное количество',
        GOE_GET_POWER_MESSAGE:
			`Потратив искры мощи и золото, вы можете получить максимум <span style="color: green;"> {maxHeroPawer} </span> единиц мощи героев
            <br> Укажите, сколько мощи героев необходимо получить`,
        GOE_GOT_POWER: '<br> Получили мощи героев: <span style="color: green;"> {gotPower} </span>',
        GOE_NOT_ENOUGH_GOLD:
			`<br><br><span style="color: red;">Не достаточно золота</span>, чтобы получить всю доступную мощь героев
			<br> Имеем золота: <span style="color: green;">{haveGold}</span> <br> Необходимо золота: <span style="color: red;"> {goldIsNeeded} </span>`,
	};

	i18nLangData['ru'] = Object.assign(i18nLangData['ru'], i18nLangDataRu);

	// Добавление кнопок в окно Разное
	const { othersPopupButtons } = HWHData;

	othersPopupButtons.push({
		get msg() {
			return I18N('GIFT_OF_ELEMENTS');
		},
		get title() {
			return I18N('GIFT_OF_ELEMENTS_TITLE');
		},
		result: async function () {
			await onClickGiftOfTheElements();
		},
		color: 'pink',
	});

	async function onClickGiftOfTheElements() {
		const popupButtons = [
			{
				get msg() {
					return I18N('GOE_SPEND_SPARKS_OF_POWER');
				},
				get title() {
					return I18N('GOE_SPEND_SPARKS_OF_POWER_TITLE');
				},
				result: async function () {
					await spendSparksPower();
				},
                color: 'green',
			},
            {
				get msg() {
					return I18N('GOE_GET_POWER');
				},
				get title() {
					return I18N('GOE_GET_POWER_TITLE');
				},
				result: async function () {
					await getPower();
				},
                color: 'green',
			},
			{
				get msg() {
					return I18N('GOE_RESET_GIFTS_LIGHT');
				},
				get title() {
					return I18N('GOE_RESET_GIFTS_LIGHT_TITLE');
				},
				result: async function () {
					await resetTitanGifts();
				},
			},
			{
				get msg() {
					return I18N('GOE_RESET_GIFTS_EXTREME');
				},
				get title() {
					return I18N('GOE_RESET_GIFTS_EXTREME_TITLE');
				},
				result: async function () {
					await resetTitanGifts30LVL();
				},
			},
		];
		popupButtons.push({ result: false, isClose: true });
		const answer = await popup.confirm(`${I18N('GOE_SELECT_ACTION')}`, popupButtons);
		if (typeof answer === 'function') {
			answer();
		}
	}

    const powerLevel = [22, 22, 22, 22, 22, 66, 66, 66, 66, 66, 110, 110, 110, 110, 110, 154,
                        154, 154, 154, 154, 198, 198, 198, 198, 198, 242, 242, 242, 242, 242 ];
    // Получить мощь
    async function getPower() {
		let [heroGetAll, inventory, user] = await new Caller(['heroGetAll', 'inventoryGet', 'userGetInfo']).execute();
		let heroes = Object.values(heroGetAll).sort((a, b) => a.titanGiftLevel - b.titanGiftLevel);
        const heroSumPowerStart = Object.values(heroGetAll).reduce((a, e) => a + e.power, 0);
		const titanGiftLib = lib.getData('titanGift');
		let titanGift = inventory.consumable[24];
		let titanGiftMax = titanGift;
		let gold = user.gold;
		let userLevel = user.level;
		let calls = [];
		let minTitanGiftLevel = heroes[0].titanGiftLevel;
		let titanGiftLevel = minTitanGiftLevel;
		let titanGiftUpgradeCounter = 0;
		let message = '';

		if (userLevel < 30) {
			confShow(`${I18N('GOE_NOTHING_TO_IMPROVE_LVL30')}`);
			return;
		}
        if (minTitanGiftLevel == 30) {
            confShow(`${I18N('GOE_NOTHING_TO_IMPROVE')}`);
            return;
        }

        let result = findMaximumPossiblePower(heroes, titanGift, titanGiftLib);
        let maximumPowerWeCanGet = result.maximumPowerWeCanGet;
        let needGoldToGetMaxPower = result.needGoldToGetMaxPower;
        let notEnoughGold = '';
        if (needGoldToGetMaxPower > gold) {
            notEnoughGold = I18N('GOE_NOT_ENOUGH_GOLD', {haveGold: gold.toLocaleString(), goldIsNeeded: needGoldToGetMaxPower.toLocaleString() });
        }

        let needHeroPower = +(await popup.confirm(`${I18N('GOE_GET_POWER_MESSAGE', { maxHeroPawer: maximumPowerWeCanGet.toLocaleString() })} ${notEnoughGold}`, [
			{ result: 0, isClose: true },
			{ msg: `${I18N('GOE_GET_POWER')}`, isInput: true, default: maximumPowerWeCanGet, color: 'green' },
            //{ msg: I18N('BTN_CANCEL'), result: 0, color: 'red' },
		]));

        if (needHeroPower == 0) {
			return;
		}
		if (!needHeroPower || needHeroPower < 0 || needHeroPower > maximumPowerWeCanGet) {
			confShow(`${I18N('GOE_INCORRECT_VALUE')}`);
			return;
		}
        let gotHeroPower = 0;
		setProgress(I18N('GOE_IMPROVING_START'), false);
		let cycle = true;
		while (cycle) {
			for (const hero of heroes) {
				if (titanGiftLevel >= 30) {
					message += I18N('GOE_ALL_HEROES_HAVE_30LVL');
					cycle = false;
					break;
				}
				if (hero.titanGiftLevel > titanGiftLevel) {
					break;
				}
				let nextLevelCost = titanGiftLib[hero.titanGiftLevel + 1].cost;
				if (titanGift < nextLevelCost.consumable[24] || gold < nextLevelCost.gold) {
					if (titanGiftUpgradeCounter == 0 && calls.length == 0) {
						setProgress('', true);
						confShow(`${I18N('GOE_NOT_ENOUGH_RESOURCES')}`);
						return;
					}
					if (gold < nextLevelCost.gold) {
						message += I18N('GOE_GOLD_IS_GONE');
					}
					cycle = false;
					break;
				}
				calls.push({ name: 'heroTitanGiftLevelUp', args: { heroId: hero.id } });
				titanGift -= nextLevelCost.consumable[24];
				gold -= nextLevelCost.gold;
                gotHeroPower += powerLevel[hero.titanGiftLevel];
                if (gotHeroPower >= needHeroPower) {
                    cycle = false;
                    break;
                }
			}
			if (calls.length >= 1) {
				await Caller.send(calls);
				titanGiftUpgradeCounter += calls.length;
				heroGetAll = await new Caller('heroGetAll').execute();
				heroes = Object.values(heroGetAll).sort((a, b) => a.titanGiftLevel - b.titanGiftLevel);
				calls = [];
				titanGiftLevel++;
				setProgress(I18N('GOE_PROGRESS_OF_IMPROVEMENT_MESSAGE', { titanGiftLevel }), false);
			}
		}
        const heroSumPowerFinish = Object.values(heroGetAll).reduce((a, e) => a + e.power, 0);
        message += I18N('GOE_GOT_POWER', { gotPower: (heroSumPowerFinish - heroSumPowerStart).toLocaleString() });
		//await new Promise((e) => setTimeout(e, 2000));
		setProgress('', true);
		confShow(`${I18N('GOE_RESULT_OF_IMPROVEMENT', { counter: titanGiftUpgradeCounter })} ${message}`);
	}

    function findMaximumPossiblePower(heroes, titanGift, titanGiftLib) {
        let mass = {maximumPowerWeCanGet: 0, needGoldToGetMaxPower: 0};

        for (let tGiftLvl = heroes[0].titanGiftLevel; tGiftLvl < 30; tGiftLvl++) {
            for (let hero of heroes) {
                if (hero.titanGiftLevel > tGiftLvl) {
                    continue;
                }
                let nextLevelCost = titanGiftLib[tGiftLvl + 1].cost;
                if (titanGift < nextLevelCost.consumable[24]) {
                    return mass;
                }
                titanGift -= nextLevelCost.consumable[24];
                mass.maximumPowerWeCanGet += powerLevel[tGiftLvl];
                mass.needGoldToGetMaxPower += nextLevelCost.gold;
            }
        }
        return mass;
    }

	// Потратить искры мощи
	async function spendSparksPower() {
		let [heroGetAll, inventory, user] = await new Caller(['heroGetAll', 'inventoryGet', 'userGetInfo']).execute();
		let heroes = Object.values(heroGetAll).sort((a, b) => a.titanGiftLevel - b.titanGiftLevel);
        const heroSumPowerStart = Object.values(heroGetAll).reduce((a, e) => a + e.power, 0);
		const titanGiftLib = lib.getData('titanGift');
		let titanGift = inventory.consumable[24];
		let titanGiftMax = titanGift;
		let gold = user.gold;
		let userLevel = user.level;
		let calls = [];
		let minTitanGiftLevel = heroes[0].titanGiftLevel;
		let titanGiftLevel = minTitanGiftLevel;
		let titanGiftUpgradeCounter = 0;
		let message = '';

		if (userLevel < 30) {
			confShow(`${I18N('GOE_NOTHING_TO_IMPROVE_LVL30')}`);
			return;
		}
        if (minTitanGiftLevel == 30) {
            confShow(`${I18N('GOE_NOTHING_TO_IMPROVE')}`);
            return;
        }
		titanGift = +(await popup.confirm(I18N('GOE_SPEND_SPARKS_OF_POWER_MESSAGE', { titanGift: titanGift.toLocaleString() }), [
			{ result: 0, isClose: true },
			{ msg: `${I18N('GOE_SPEND_SPARKS_OF_POWER')}`, isInput: true, default: titanGift.toString(), color: 'green' },
            //{ msg: I18N('BTN_CANCEL'), result: 0, color: 'red' },
		]));
		if (titanGift == 0) {
			return;
		}
		if (!titanGift || titanGift < 0 || titanGift > titanGiftMax) {
			confShow(`${I18N('GOE_INCORRECT_VALUE')}`);
			return;
		}
		setProgress(I18N('GOE_IMPROVING_START'), false);
		let cycle = true;
		while (cycle) {
			for (const hero of heroes) {
				if (titanGiftLevel >= 30) {
					message += I18N('GOE_ALL_HEROES_HAVE_30LVL');
					cycle = false;
					break;
				}
				if (hero.titanGiftLevel > titanGiftLevel) {
					break;
				}
				let nextLevelCost = titanGiftLib[hero.titanGiftLevel + 1].cost;
				if (titanGift < nextLevelCost.consumable[24] || gold < nextLevelCost.gold) {
					if (titanGiftUpgradeCounter == 0 && calls.length == 0) {
						setProgress('', true);
						confShow(`${I18N('GOE_NOT_ENOUGH_RESOURCES')}`);
						return;
					}
					if (gold < nextLevelCost.gold) {
						message += I18N('GOE_GOLD_IS_GONE');
					}
					cycle = false;
					break;
				}
				calls.push({ name: 'heroTitanGiftLevelUp', args: { heroId: hero.id } });
				titanGift -= nextLevelCost.consumable[24];
				gold -= nextLevelCost.gold;
			}
			if (calls.length >= 1) {
				await Caller.send(calls);
				titanGiftUpgradeCounter += calls.length;
				heroGetAll = await new Caller(['heroGetAll']).execute();
				heroes = Object.values(heroGetAll).sort((a, b) => a.titanGiftLevel - b.titanGiftLevel);
				calls = [];
				titanGiftLevel++;
				setProgress(I18N('GOE_PROGRESS_OF_IMPROVEMENT_MESSAGE', { titanGiftLevel }), false);
			}
		}
        const heroSumPowerFinish = Object.values(heroGetAll).reduce((a, e) => a + e.power, 0);
        message += I18N('GOE_GOT_POWER', { gotPower: (heroSumPowerFinish - heroSumPowerStart).toLocaleString() });
		//await new Promise((e) => setTimeout(e, 2000));
		setProgress('', true);
		confShow(`${I18N('GOE_RESULT_OF_IMPROVEMENT', { counter: titanGiftUpgradeCounter })} ${message}`);
	}

	//Сбросить дары стихий
	async function resetTitanGifts() {
		const [heroGetAll, user] = await new Caller(['heroGetAll', 'userGetInfo']).execute();
		const heroes = Object.values(heroGetAll).sort((a, b) => a.titanGiftLevel - b.titanGiftLevel);
		const userLevel = user.level;
		let calls = [];
		let maxResetTitanGiftLevel = 0;
		for (const hero of heroes) {
			if (hero.titanGiftLevel > 0) {
				maxResetTitanGiftLevel = hero.titanGiftLevel;
				break;
			}
		}
		if (userLevel < 30 || maxResetTitanGiftLevel == 0) {
			confShow(`${I18N('GOE_NOTHING_TO_RESET')}`);
			return;
		}
		if (maxResetTitanGiftLevel == 30) {
			confShow(`${I18N('GOE_IMPOSSIBLE_TO_RESET')}`);
			return;
		} else {
			maxResetTitanGiftLevel = +(await popup.confirm(I18N('GOE_RESET_GIFTS_LIGHT_MESSAGE'), [
				{ result: 0, isClose: true },
				{ msg: I18N('GOE_RESET_GIFTS'), isInput: true, default: maxResetTitanGiftLevel.toString(), color: 'green' },
                //{ msg: I18N('BTN_CANCEL'), result: 0, color: 'red' },
			]));
		}
		if (maxResetTitanGiftLevel == 0) {
			return;
		}
		if (!maxResetTitanGiftLevel || maxResetTitanGiftLevel < 0 || maxResetTitanGiftLevel > 29) {
			confShow(`${I18N('GOE_INCORRECT_VALUE')}`);
			return;
		}
		for (const hero of heroes) {
			if (hero.titanGiftLevel == 0) {
				continue;
			}
			if (hero.titanGiftLevel > maxResetTitanGiftLevel || hero.titanGiftLevel == 30) {
				break;
			}
			calls.push({ name: 'heroTitanGiftDrop', args: { heroId: hero.id } });
		}
		if (calls.length == 0) {
			confShow(`${I18N('GOE_NOTHING_TO_RESET')}`);
			return;
		}
		await Caller.send(calls);
		confShow(`${I18N('GOE_RESULT_RESET_GIFTS', { counter: calls.length })}`);
	}

	//Сбросить дары стихий 30 уровень
	async function resetTitanGifts30LVL() {
		const [heroGetAll, user] = await new Caller(['heroGetAll', 'userGetInfo']).execute();
		const heroes = Object.values(heroGetAll).sort((a, b) => a.titanGiftLevel - b.titanGiftLevel);
		const userLevel = user.level;
		const heroesLvl1_29 = Object.values(heroGetAll).filter((e) => e.titanGiftLevel > 0 && e.titanGiftLevel < 30);
		const heroesLvl30 = Object.values(heroGetAll)
			.filter((e) => e.titanGiftLevel == 30)
			.sort((a, b) => a.power - b.power);
		let calls = [];
		let maxResetTitanGiftLevel = 0;
		for (const hero of heroes) {
			if (hero.titanGiftLevel > 0) {
				maxResetTitanGiftLevel = hero.titanGiftLevel;
				break;
			}
		}
		if (userLevel < 30 || maxResetTitanGiftLevel == 0) {
			confShow(`${I18N('GOE_NOTHING_TO_RESET')}`);
			return;
		}
		let numberHeroesWithLevel1_29 = heroesLvl1_29.length;
		let numberHeroesWithLevel30 = heroesLvl30.length;
		let numberHeroesToReset = numberHeroesWithLevel30;
		if (numberHeroesWithLevel30 == 0) {
			let resultPopup = await popup.confirm(I18N('GOE_EXTREME_DO_NOT_HAVE_HERO_30LVL'), [
				{ msg: I18N('GOE_RESET_GIFTS'), result: true, color: 'green' },
				{ msg: I18N('BTN_CANCEL'), result: false, color: 'red' },
				{ isClose: true, result: false },
			]);
			if (!resultPopup) {
				return;
			}
		} else {
			numberHeroesToReset = +(await popup.confirm(I18N('GOE_RESET_GIFTS_EXTREME_MESSAGE', { level30: numberHeroesWithLevel30 }), [
				{ result: 0, isClose: true },
				{ msg: I18N('GOE_RESET_GIFTS'), isInput: true, default: numberHeroesToReset.toString(), color: 'green' },
                //{ msg: I18N('BTN_CANCEL'), result: 0, color: 'red' },
			]));

            if (numberHeroesToReset == 0) {
                return;
            }
			if (!numberHeroesToReset || numberHeroesToReset < 0 || numberHeroesToReset > numberHeroesWithLevel30) {
				confShow(`${I18N('GOE_INCORRECT_VALUE')}`);
				return;
			}
		}

		// 1-29
		for (const hero of heroesLvl1_29) {
			calls.push({ name: 'heroTitanGiftDrop', args: { heroId: hero.id } });
		}
		// 30
		for (let i = 0; i < numberHeroesToReset; i++) {
			calls.push({ name: 'heroTitanGiftDrop', args: { heroId: heroesLvl30[i].id } });
		}

		if (calls.length == 0) {
			confShow(`${I18N('GOE_NOTHING_TO_RESET')}`);
			return;
		}
		await Caller.send(calls);
		confShow(
			`${I18N('GOE_RESULT_RESET_GIFTS', { counter: calls.length })} ${I18N('GOE_EXTREME_RESULT_RESET_GIFTS', {
				counter30: numberHeroesToReset,
			})}`
		);
	}
})();
