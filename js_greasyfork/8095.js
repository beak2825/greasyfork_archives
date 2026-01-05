// ==UserScript==
// @namespace      virtonomica
// @name           Virtonomica: Quick Price Set
// @description:en Quick installation prices of goods in the trading hall.
// @description:ru Быстрая установка цены товаров в торговом зале.
// @include        https://virtonomica*.*/*/main/unit/view/*/trading_hall
// @include        https://virtonomica.ru/*/main/unit/view/*/trading_hall
// @version        102
// @grant          AntiStream
// @description Quick installation prices of goods in the trading hall.
// @downloadURL https://update.greasyfork.org/scripts/8095/Virtonomica%3A%20Quick%20Price%20Set.user.js
// @updateURL https://update.greasyfork.org/scripts/8095/Virtonomica%3A%20Quick%20Price%20Set.meta.js
// ==/UserScript==

(function(window) {
	let run = function() {
		const VER = 102;

		//
		// Localization
		//

		let en_EN = {
			"storeList": "Store List:",
			"addStoreToList": "Add Store To List",
			"removeStoreFromList": "Remove Store From List",
			"itsMagicFrame": "IT'S MAGIC IFRAME, RUN! (Сalculate the price for all stores from the list!)",
			"wait": "Wait...",
			"smoothTitle": "Smooth change",

			"saveStoreConfig": "Save Config",
			"rule1Dis": "Minimum price: X (If at the end of the % sign, then purchase if it is not known that 100% of the city)",
			"rule2Dis": "Price tends to X (If end of sign % then from price of city)",
			"rule3Dis": "IF market share SIGN X%, THAT price is multiplied by Y",
			"rule3_lt": "less",
			"rule3_gt": "greater",
			"rule4Dis": "The adjustment of prices depending on quality of item and city: P * ((IQ / CQ) ^ (1 / X))",
			"rule5Dis": "The adjustment of prices depending on brand of item and city: P * (((1+IB) / (1+CB)) ^ (1 / X))",
			"rule6Dis": "The block of rules for group of products X",
			"rule7Dis": "The block of rules for a type of product X",
			"rule8Dis": "Price is multiplied by X",
			"addRule": "Add rule...",
			"deleteRule": "Delete rule",
			"ruleMoveToUp": "Move the rule to up",
			"ruleMoveToDown": "Move the rule to down",

			"storeClcVec": "Calculate vector for all",
			"storeMove2Vec": "To bring the prices of all goods to their vectors",
			"storeSetPrice": "Ask prices of all commodities at their prices of vector",
			"storeClcAndMov": "To calculate the vector and bring the price to them",
			"storeClcAndSet": "To calculate the vector and ask prices from them",

			"groupClcVec": "To calculate price vector for group",
			"groupMove2Vec": "Bring price of product group in their vectors",
			"groupSetPrice": "Ask price groups on price vector",

			"itemPrice": "The current price of goods",
			"itemPriceVector": "The vector of prices of goods",
			"itemClcVec": "To calculate vector of prices of goods",
			"itemMoveToVec": "To bring the price of goods to price vector",
			"itemSetPrice": "Ask the price of goods at price vector",
			"itemAllowPriceChange": "Allow automatic change of the item",
		};

		let ru_RU = {
			"storeList": "Список магазинов:",
			"addStoreToList": "Добавить магазин в список",
			"removeStoreFromList": "Удалить магазин из списка",
			"itsMagicFrame": "IT'S MAGIC IFRAME, RUN! (Вычислить цену для всего во всех магазинах из списка)",
			"wait": "Жди...",
			"smoothTitle": "Плавность изменения цен",

			"saveStoreConfig": "Сохранить параметры",
			"calcGroupPrice": "Вычислить цены группы",
			"rule1Dis": "Минимальная цена: X (Если в конце знак %, то закупочной, если она не известна то 100% цены города)",
			"rule2Dis": "Цена стремится к X (Если в конце знак %, то от цены города)",
			"rule3Dis": "Если доля рынка SIGN X%, то цена скалируется на Y",
			"rule3_lt": "меньше",
			"rule3_gt": "больше",
			"rule4Dis": "Корректировка цены в зависимости от качества предмета и города: P * ((IQ / CQ) ^ (1 / X))",
			"rule5Dis": "Корректировка цены в зависимости от бренда предмета и города: P * (((1+IB) / (1+CB)) ^ (1 / X))",
			"rule5Dis": "Корректировка цены в зависимости от бренда предмета и города: P * (((1+IB) / (1+CB)) ^ (1 / X))",
			"rule6Dis": "Блок правил для группы товаров X",
			"rule7Dis": "Блок правил для типа товара X",
			"rule8Dis": "Цена скалируется на X",
			"addRule": "Добавить правило:",
			"deleteRule": "Удалить правило",
			"ruleMoveToUp": "Поднять правило верх",
			"ruleMoveToDown": "Опустить правило вниз",

			"storeClcVec": "Вычислить вектор всего",
			"storeMove2Vec": "Приблизить товара к их векторам",
			"storeSetPrice": "Задать цены всех товаров на цены их вектора",
			"storeClcAndMov": "Вычислить вектора и приблизить цены к ним",
			"storeClcAndSet": "Вычислить вектора и задать цены от них",

			"groupClcVec": "Вычислить вектор цен для группы",
			"groupMove2Vec": "Приблизить цены товаров группы в их векторам",
			"groupSetPrice": "Задать цены группы на цены вектора",

			"itemPrice": "Текущая цена товара",
			"itemPriceVector": "Вектор цены товара",
			"itemClcVec": "Вычислить вектор цены для товара",
			"itemMoveToVec": "Приблизить цену товара к цене вектора",
			"itemSetPrice": "Задать цену товара на цену вектора",
			"itemAllowPriceChange": "Разрешить автоматическое изменение цены предмета",
		};

		let loc = (navigator.language || navigator.languages[0]) == "ru" ? ru_RU : en_EN;

		// qps_mainCont
		//

		let $tbody = $("table.grid:eq(0) > tbody:eq(0)");
		$tbody.parent().before(`
			<div class="qps_mainCont">
			</div>
		`);
		let $qps_mainCont = $(".qps_mainCont");
		const thisStoreUrl = window.location.toString();

		let storeListGroups = [];
		let storeListItems = [];
		$tbody.children("tr").each(function() {
			let $tr = $(this);
			let itemType, groupType;

			if ($tr.children("td").length === 1) {
				groupType = $tr.children("td:eq(0)").text().split("\n")[1].split("			")[1];
				storeListGroups.push(groupType);
			} else if ($tr.children("td").length > 1) {
				itemType = $tr.children("td:eq(2)").attr("title").replace(/^(.*) \(.*$/, "$1");
				storeListItems.push(itemType);
			}
		});

		//
		// PRICE
		//

		$qps_mainCont.append(`
			<div>
				<div style="background-color: #e7f0d4;">
					<div class="qps_rulesList">

					</div>

					<div class="qps_addRuleCont">
						<input class='qps_addRule qps_button' type='button' value='${loc["addRule"]}'>
						<select class="qps_ruleType qps_input">
							<option value="rule1">${loc["rule1Dis"]}</option>
							<option value="rule2">${loc["rule2Dis"]}</option>
							<option value="rule8">${loc["rule8Dis"]}</option>
							<option value="rule3">${loc["rule3Dis"]}</option>
							<option value="rule4">${loc["rule4Dis"]}</option>
							<option value="rule5">${loc["rule5Dis"]}</option>
							<option value="rule6">${loc["rule6Dis"]}</option>
							<option value="rule7">${loc["rule7Dis"]}</option>
						</select>
					</div>
				</div>
			</div>
		`);

		let $qps_minCostPrise = $(".qps_minCostPrise:eq(0)"),
			$qps_targetPrice = $(".qps_targetPrice:eq(0)"),
			$qps_rulesList = $(".qps_rulesList:eq(0)"),
			$qps_addRuleCont = $(".qps_addRuleCont:eq(0)");

		let addRuleHandler = function($this) {
			let ruleType = $this.parent().children(".qps_ruleType:eq(0)").val(),
				$rulesList = $this.parent().parent().children(".qps_rulesList:eq(0)");
			if (ruleType == "rule1") {
				addRule({type: "rule1", x: "200%"}, $rulesList);
			} else if (ruleType == "rule2") {
				addRule({type: "rule2", x: "110%"}, $rulesList);
			} else if (ruleType == "rule3") {
				addRule({type: "rule3", sign: "lt", dol: "100", mul:"1.00"}, $rulesList);
			} else if (ruleType == "rule4") {
				addRule({type: "rule4", x: "5"}, $rulesList);
			} else if (ruleType == "rule5") {
				addRule({type: "rule5", x: "5"}, $rulesList);
			} else if (ruleType == "rule6") {
				addRule({type: "rule6", selectType: "", rulesList: []}, $rulesList);
			} else if (ruleType == "rule7") {
				addRule({type: "rule7", selectType: "", rulesList: []}, $rulesList);
			} else if (ruleType == "rule8") {
				addRule({type: "rule8", x: "1.0"}, $rulesList);
			}
		};

		$qps_mainCont.find(".qps_addRule:eq(0)").click(function() {
			addRuleHandler($(this));
		});

		let counter = 0;
		let addRule = function(obj, $rulesList=$qps_rulesList) {
			counter++;
			let ruleType = obj.type,
				ruleC = $rulesList.attr("rule_c"),
				backColor = ruleC ? `background-color: hsl(${(ruleC*4 + 40) % 360}, 100%, 50%)` : "",
				fontColor = ruleC ? `color: hsl(${(ruleC*4 + 200) % 360}, 100%, 50%)` : "";

			let tools = `
				<input value="&#8593;" type="button" title="${loc["ruleMoveToUp"]}" class="qps_button" style="${backColor}; ${fontColor};" onclick="var t=$(this),r=t.parent().parent(),p=r.prev();if(p.length>0)r.insertBefore(p);">
				<input value="&#8595;" type="button" title="${loc["ruleMoveToDown"]}" class="qps_button" style="${backColor}; ${fontColor};" class="qps_button" onclick="var t=$(this),r=t.parent().parent(),n=r.next();if(n.length>0)r.insertAfter(n);">
				<input type="button" value="X" title="${loc["deleteRule"]}" class="qps_delButton" onclick="$(this).parent().parent().remove()">
			`;

			let ruleId = `ruleId${counter}`;

			if (["rule1", "rule2"].indexOf(ruleType) > -1) {
				$rulesList.append(`
					<div id="${ruleId}" rule_type="${ruleType}">
						<div>
							${loc[ruleType+"Dis"].replace("X", `<input class="qpsX qps_input" type="text" size=4 value="${obj.x}">`)}
							${tools}
						</div>
					</div>
				`);
			} else if (ruleType == "rule3") {
				$rulesList.append(`
					<div id="${ruleId}" rule_type="${ruleType}">
						<div>
							${
								loc[ruleType+"Dis"].
								replace("SIGN", `
									<select class="qpsSign" value="${obj.sign}">
										<option value="lt">${loc["rule3_lt"]}</option>
										<option value="gt">${loc["rule3_gt"]}</option>
									</select>
								`).
								replace("X", `<input class="qpsDol qps_input" type="text" size=4 value="${obj.dol}">`).
								replace("Y", `<input class="qpsMul qps_input" type="text" size=4 value="${obj.mul}">`)
							}
							${tools}
						</div>
					</div>
				`);
			} else if (["rule4", "rule5"].indexOf(ruleType) > -1) {
				$rulesList.append(`
					<div id="${ruleId}" rule_type="${ruleType}">
						<div>
							${loc[ruleType+"Dis"].replace("X", `<input class="qpsX qps_input" type="text" size=4 value="${obj.x}">`)}
							${tools}
						</div>
					</div>
				`);
			} else if (["rule6", "rule7"].indexOf(ruleType) > -1) {
				let options="";
				if (ruleType == "rule6") {
					for (let group of storeListGroups) {
						options += `<option value="${group}">${group}</option>`;
					}
				} else if (ruleType == "rule7") {
					for (let item of storeListItems) {
						options += `<option value="${item}">${item}</option>`;
					}
				}
				let ruleC = counter,
					backColor = `background-color: hsl(${(ruleC*4 + 40) % 360}, 100%, 50%)`,
					fontColor = `color: hsl(${(ruleC*4 + 200) % 360}, 100%, 50%)`;
				$rulesList.append(`
					<div id="${ruleId}" rule_type="${ruleType}" style="padding-left: 8px; margin: 0px 4px; background-color: hsl(${counter*4 % 360}, 100%, 50%);">
						<div>
							${loc[ruleType+"Dis"].replace("X", `
								<select class="qps_selectType">${options}</select>
							`)}
							<input value="&#8593;" type="button" title="${loc["ruleMoveToUp"]}" class="qps_button" style="${backColor}; ${fontColor};" onclick="var t=$(this),r=t.parent().parent(),p=r.prev();if(p.length>0)r.insertBefore(p);">
							<input value="&#8595;" type="button" title="${loc["ruleMoveToDown"]}" class="qps_button" style="${backColor}; ${fontColor};" onclick="var t=$(this),r=t.parent().parent(),n=r.next();if(n.length>0)r.insertAfter(n);">
							<input type="button" value="X" title="${loc["deleteRule"]}" class="qps_delButton" onclick="$(this).parent().parent().remove()">
						</div>
						<div class="qps_rulesList" rule_c="${counter}"></div>
						<div class="qps_addRuleCont" >
							<input class='qps_addRule qps_button' style="${backColor}; ${fontColor};" type='button' value='${loc["addRule"]}'>
							<select class="qps_ruleType qps_input">
								<option value="rule1">${loc["rule1Dis"]}</option>
								<option value="rule2">${loc["rule2Dis"]}</option>
								<option value="rule8">${loc["rule8Dis"]}</option>
								<option value="rule3">${loc["rule3Dis"]}</option>
								<option value="rule4">${loc["rule4Dis"]}</option>
								<option value="rule5">${loc["rule5Dis"]}</option>
							</select>
						</div>
					</div>
				`);
				let $thisRule = $(`#${ruleId}`);
				if (obj.selectType) {
					$thisRule.find(".qps_selectType:eq(0)").val(obj.selectType)
				}
				let $localRulesList = $thisRule.find("div.qps_rulesList:eq(0)");
				console.log($localRulesList.html());
				for (let rule of obj.rulesList) {
					addRule(rule, $localRulesList)
				}
				$thisRule.find("input.qps_addRule:eq(0)").click(function() {
					addRuleHandler($(this));
				});
			} else if (ruleType == "rule8") {
				$rulesList.append(`
					<div id="${ruleId}" rule_type="${ruleType}">
						<div>
							${loc[ruleType+"Dis"].replace("X", `<input class="qpsX qps_input" type="text" size=4 value="${obj.x}">`)}
							${tools}
						</div>
					</div>
				`);
			}
		};

		/* killer feature, unbalance! =)

		//
		// STORE LIST
		//

		$qps_mainCont.append(`
			<div style="background-color: #3dd4ab;">
				<div>
					${loc["storeList"]}
				</div>
				<div id='qps_storeList'>

				</div>
				<div>
					<input id='qps_addStoreToList' class='qps_button' type='button' value='${loc["addStoreToList"]}'>
				</div>
				<div>
					<input id='qps_removeStoreFromList' class='qps_button' type='button' value='${loc["removeStoreFromList"]}'>
				</div>
			</div>
		`);

		let storeList = JSON.parse(localStorage.getItem("storeList") || `{}`);
		let $qps_storeList = $("#qps_storeList");
		let $qps_addStoreToList = $("#qps_addStoreToList");
		let $qps_removeStoreFromList = $("#qps_removeStoreFromList");

		let drawStoreList = function() {
			$qps_storeList.empty();

			for (let store in storeList) {
				$qps_storeList.append(`
					<div store="${store}">
						${store}
					</div>
				`);
			}
		};
		drawStoreList();

		$qps_addStoreToList.click(function() {
			storeList[thisStoreUrl] = thisStoreUrl;
			localStorage.setItem("storeList", JSON.stringify(storeList));
			drawStoreList();
		});

		$qps_removeStoreFromList.click(function() {
			delete storeList[thisStoreUrl];
			localStorage.setItem("storeList", JSON.stringify(storeList));
			drawStoreList();
		});

		//
		// MAGIC IFRAME
		//

		$qps_mainCont.append(`
			<div style="background-color: #c92094;">
				<iframe id='qps_iframe' style="width:0;height:0;border:0;border:none;"></iframe>
				<input id='qps_iframeMagic' class='qps_button' type='button' value="${loc["itsMagicFrame"]}">
			</div>
		`);

		let $qps_iframe = $("#qps_iframe");
		let $qps_iframeMagic = $("#qps_iframeMagic");

		$qps_iframeMagic.click(function() {
			let $this = $(this);
			$this.attr("disabled", "disabled");
			$this.val(loc["wait"]);

			let $MIF = $qps_iframe;
			let stores = [];
			for (let store in storeList) {
				stores.push(store);
			}
			let index = -1;

			let endMagic = function() {
				window.location = window.location;
			};

			let nextStore = function() {
				index++;
				let firstLoad = true;
				let store = stores[index];

				$MIF.load(function() {
					if (firstLoad) {
						firstLoad = false;

						$qps_storeList.find(`div[store="${store}"]`).css("background-color", "yellow");

						$MIF.contents().find(".qps_storeClcAndSet:eq(0)").click();
						setTimeout(function() {
							$MIF.contents().find(".qps_savePrices:eq(0)").click();
						}, 300);
					} else {
						setTimeout(function() {
							$qps_storeList.find(`div[store="${store}"]`).css("background-color", "green");
							nextStore();
						}, 3000);
					}
				});

				if (stores[index]) {
					$MIF.attr("src", stores[index]);
				} else {
					endMagic();
				}
			};
			nextStore();
		});

		*/

		//
		// SET STORE PRICE
		//

		$qps_mainCont.append(`
			<div class="qps_footer">
				<input class='qps_vectorSmooth qps_input' size=4 value="5" type='text' title='${loc["smoothTitle"]}'>
				<input class='qps_storeClcVec qps_button' type='button' title='${loc["storeClcVec"]}' value="Store Clc">
				<input class='qps_storeMove2Vec qps_button' type='button' title='${loc["storeMove2Vec"]}' value="Store Mov">
				<input class='qps_storeSetPrice qps_button' type='button' title='${loc["groupSetPrice"]}' value="Store Set">
				<input class='qps_storeClcAndMov qps_button' type='button' title='${loc["groupSetPrice"]}' value="Store Clc & Mov">
				<input class='qps_storeClcAndSet qps_button' type='button' title='${loc["groupSetPrice"]}' value="Store Clc & Set">
			</div>
		`);
		let $qps_footer = $qps_mainCont.children(".qps_footer:eq(0)");
		let $qps_vectorSmooth = $qps_footer.find(".qps_vectorSmooth:eq(0)");

		$(".qps_storeClcVec:eq(0)").click(function() {
			calcPriceVector(-1, -1);
		});

		$(".qps_storeMove2Vec:eq(0)").click(function() {
			moveToPriceVector(-1, -1);
		});

		$(".qps_storeSetPrice:eq(0)").click(function() {
			setPriceToVector(-1, -1);
		});

		$(".qps_storeClcAndMov:eq(0)").click(function() {
			calcPriceVector(-1, -1);
			moveToPriceVector(-1, -1);
		});

		$(".qps_storeClcAndSet:eq(0)").click(function() {
			calcPriceVector(-1, -1);
			setPriceToVector(-1, -1);
		});

		//
		//	Store Config and Set Price
		//

		$qps_footer.append(`
				<input id='qps_saveStoreConfig' class='qps_button' type='button' title='${loc["saveStoreConfig"]}' value='${loc["saveStoreConfig"]}'>
				<input id="qps_savePrices" class='qps_button' type='button' title='${$("input[name='setprice']").val()}' value='${$("input[name='setprice']").val()}'>
				<span style="font-size: 80%;"><a href="https://greasyfork.org/ru/scripts/8095-virtonomica-quick-price-set">Virtonomica: QPS</a> ${"v"+VER}</span>
		`);

		let thisStoreData = JSON.parse(localStorage.getItem(thisStoreUrl) || `{}`);
		thisStoreData.rulesListV2 = thisStoreData.rulesListV2 || [];
		thisStoreData.itemsData = thisStoreData.itemsData || {};

		$("#qps_savePrices").click(function() {
			$("input[name='setprice']").click();
		});

		if (thisStoreData.vectorSmooth) {
			$qps_footer.find(".qps_vectorSmooth:eq(0)").val(thisStoreData.vectorSmooth);
		}

		if (thisStoreData.rulesListV2.length > 0) {
			for (let rule of thisStoreData.rulesListV2) {
				addRule(rule);
			}
		} else {
			addRule({type: "rule1", x: "200%"});
			addRule({type: "rule2", x: "110%"});
			addRule({type: "rule3", sign: "gt", dol: "90", mul: "1.05"});
			addRule({type: "rule3", sign: "lt", dol: "30", mul: "0.95"});
		}

		$("#qps_saveStoreConfig").click(function() {
			thisStoreData = {};
			thisStoreData.itemsData = {};
			thisStoreData.vectorSmooth = $qps_footer.find(".qps_vectorSmooth:eq(0)").val() - 0;

			$tbody.children("tr").each(function() {
				let $tr = $(this);
				if ($tr.children("td").length > 1) {
					let $td10 = $tr.children("td:eq(9)");
					let itemType = $tr.children("td:eq(2)").attr("title").replace(/^(.*) \(.*$/, "$1").trim();
					thisStoreData.itemsData[itemType] = {};
					thisStoreData.itemsData[itemType].priceVector = $td10.find("input.qps_itemPriceVector:eq(0)").val();
					thisStoreData.itemsData[itemType].itemAllowPriceChange = $td10.find("input.qps_itemAllowPriceChange:eq(0)").is(':checked');
				}
			});

			let tmpRls = [];
			let parseRules = function(rulisList, $rulesList) {
				$rulesList.children().each(function() {
					$this = $(this);
					let ruleType = $this.attr("rule_type");

					if (["rule1", "rule2"].indexOf(ruleType) > -1) {
						rulisList.push({
							type: ruleType,
							x: $this.find(".qpsX:eq(0)").val()
						});
					} else if (ruleType == "rule3") {
						rulisList.push({
							type: ruleType,
							sign: $this.find(".qpsSign:eq(0)").val(),
							dol: $this.find(".qpsDol:eq(0)").val(),
							mul: $this.find(".qpsMul:eq(0)").val().replace(",", ".")
						});
					} else if (["rule4", "rule5"].indexOf(ruleType) > -1) {
						rulisList.push({
							type: ruleType,
							x: $this.find(".qpsX:eq(0)").val().replace(",", "."),
						});
					} else if (["rule6", "rule7"].indexOf(ruleType) > -1) {
						let obj = {
							type: ruleType,
							selectType: $this.find(".qps_selectType:eq(0)").val(),
							rulesList: []
						};
						parseRules(obj.rulesList, $this.children(".qps_rulesList:eq(0)"));
						rulisList.push(obj);
					} else if (ruleType == "rule8") {
						rulisList.push({
							type: ruleType,
							x: $this.find(".qpsX:eq(0)").val().replace(",", ".")
						});
					}
				});
			};
			parseRules(tmpRls, $qps_rulesList);
			thisStoreData.rulesListV2 = tmpRls;

			console.log(JSON.stringify(thisStoreData.rulesListV2))
			thisStoreData.ver = VER;
			localStorage.setItem(thisStoreUrl, JSON.stringify(thisStoreData));
		});

		//
		// Price Work
		//

		let calcPriceVector = function(group, item) {
			let groupId = 0, itemId = 0, groupType = "";
			$tbody.children("tr").each(function() {
				let $tr = $(this);

				if ($tr.children("td").length === 1) {
					groupId++;
					groupType = $tr.children("td:eq(0)").text().split("\n")[1].split("			")[1];
				} else if ($tr.children("td").length > 1) {
					itemId++;
					if ((group === -1 || group === groupId) && (item === -1 || item === itemId)) {
						let $td10 = $tr.children("td:eq(9)");
						let $priceInput = $td10.children("input:eq(0)");
						let $qps_itemPriceVector = $td10.find("input.qps_itemPriceVector:eq(0)");

						const itemType = $tr.children("td:eq(2)").attr("title").replace(/^(.*) \(.*$/, "$1").trim();
						let itemQuality = $tr.children("td:eq(6)").text().trim() - 0;
						let itemBrand = $tr.children("td:eq(7)").text().trim() - 0;
						let itemCost = $tr.children("td:eq(8)").text().trim().replace(" ", "").replace("$", "") - 0;

						const cityPrice = $tr.children("td:eq(11)").text().trim().replace(" ", "").replace("$", "") - 0;
						const cityQuality = $tr.children("td:eq(12)").text().trim() - 0;
						const cityBrand = $tr.children("td:eq(13)").text().trim() - 0;
						const marketShare = $tr.children("td:eq(10)").text().trim().replace(" ", "").replace("%", "") - 0;

						let currentPrice = $priceInput.val().trim().replace(" ", "") - 0;

						let targetPrice = 0;
						let minPrice = 0;
						let maxPrice = Number.POSITIVE_INFINITY;

						// Rules

						let rulesParse = function($rulesList) {
							$rulesList.children().each(function() {
								$this = $(this);
								let ruleType = $this.attr("rule_type");

								if (ruleType == "rule1") {
									let rX = $this.find(".qpsX").val();
									if (rX.endsWith("%")) {
										rX = rX.replace("%", "").replace(",", ".") - 0;
										if (Number.isFinite(rX)) {
											if (itemCost.toString() !== "NaN") {
												minPrice = itemCost * (rX/100);
											} else {
												itemCost = cityPrice;
												itemQuality = cityQuality;
												itemBrand = cityBrand;
											}
										}
									} else {
										rX = rX.replace(",", ".") - 0;
										if (Number.isFinite(rX)) {
											minPrice = rX;
										}
									}
								} else if (ruleType == "rule2") {
									let rX = $this.find(".qpsX").val();
									if (rX.endsWith("%")) {
										rX = rX.replace("%", "").replace(",", ".") - 0;
										if (Number.isFinite(rX)) {
											targetPrice = cityPrice * (rX/100);
										}
									} else {
										rX = rX.replace(",", ".") - 0;
										if (Number.isFinite(rX)) {
											targetPrice = rX;
										}
									}
								} else if (ruleType == "rule3") {
									let sign = $this.find(".qpsSign:eq(0)").val(),
										rDol = $this.find(".qpsDol:eq(0)").val().replace(",", ".") - 0,
										rMul = $this.find(".qpsMul:eq(0)").val().replace(",", ".") - 0;

									if (Number.isFinite(rDol) && Number.isFinite(rMul)) {
										if (
											(sign == "lt" && marketShare < rDol) ||
											(sign == "gt" && marketShare > rDol)
										) {
											targetPrice *= rMul;
										}
									}
								} else if (["rule4", "rule5"].indexOf(ruleType) > -1) {
									let rX = $this.find(".qpsX:eq(0)").val().replace(",", ".") - 0;
									if (Number.isFinite(rX)) {
										if (ruleType == "rule4") {
											targetPrice *= Math.pow(itemQuality / cityQuality, 1 / rX);
										} else if (ruleType == "rule5") {
											targetPrice *= Math.pow((1+itemBrand) / (1+cityBrand), 1 / rX);
										}
									}
								} else if (ruleType == "rule6") {
									let selectType = $this.find(".qps_selectType:eq(0)").val();
									if (selectType == groupType) {
										rulesParse($this.find(".qps_rulesList:eq(0)"));
									}
								} else if (ruleType == "rule7") {
									let selectType = $this.find(".qps_selectType:eq(0)").val();
									if (selectType == itemType) {
										rulesParse($this.find(".qps_rulesList:eq(0)"));
									}
								} else if (ruleType == "rule8") {
									let rX = $this.find(".qpsX:eq(0)").val().replace(",", ".") - 0;
									if (Number.isFinite(rX)) {
										targetPrice *= rX
									}
								}
							});
						};
						rulesParse($qps_rulesList);

						if (targetPrice < minPrice) {
							targetPrice = minPrice;
						}

						if (targetPrice > maxPrice) {
							targetPrice = maxPrice;
						}

						$qps_itemPriceVector.val(targetPrice.toFixed(2));
					}
				}
			});
		};

		let moveToPriceVector = function(group, item) {
			let groupId = 0, itemId = 0;
			$tbody.children("tr").each(function() {
				let $tr = $(this);
				if ($tr.children("td").length === 1) {
					groupId++;
				} else if ($tr.children("td").length > 1) {
					itemId++;
					if ((group === -1 || group === groupId) && (item === -1 || item === itemId)) {
						let $td10 = $tr.children("td:eq(9)");
						let $priceInput = $td10.children("input:eq(0)"),
							$qps_itemPriceVector = $td10.find("input.qps_itemPriceVector:eq(0)"),
							$qps_itemAllowPriceChange = $td10.find("input.qps_itemAllowPriceChange:eq(0)"),
							currentPrice = $priceInput.val().trim().replace(" ", "") - 0,
							vectorPrice = $qps_itemPriceVector.val().trim().replace(" ", "") - 0;
						const itemType = $tr.children("td:eq(2)").attr("title").replace(/^(.*) \(.*$/, "$1").trim();

						let smooth = $qps_vectorSmooth.val() - 0;
						if (Number.isFinite(smooth)) {
							smooth = 1 / smooth;
						} else {
							smooth = 0.2;
						}

						console.log(smooth)

						if (Number.isFinite(vectorPrice) && $qps_itemAllowPriceChange.is(':checked')) {
							currentPrice += (vectorPrice - currentPrice) * smooth;
							$priceInput.val(currentPrice.toFixed(2));
						}
					}
				}
			});
		};

		let setPriceToVector = function(group, item) {
			let groupId = 0, itemId = 0;
			$tbody.children("tr").each(function() {
				let $tr = $(this);
				if ($tr.children("td").length === 1) {
					groupId++;
				} else if ($tr.children("td").length > 1) {
					itemId++;
					if ((group === -1 || group === groupId) && (item === -1 || item === itemId)) {
						let $td10 = $tr.children("td:eq(9)");
						let $priceInput = $td10.children("input:eq(0)"),
							$qps_itemPriceVector = $td10.find("input.qps_itemPriceVector:eq(0)"),
							$qps_itemAllowPriceChange = $td10.find("input.qps_itemAllowPriceChange:eq(0)");
						if ($qps_itemAllowPriceChange.is(':checked')) {
							$priceInput.val($qps_itemPriceVector.val());
						}
					}
				}
			});
		};

		let groupId = 0, itemId = 0;
		$tbody.children("tr").each(function() {
			let $tr = $(this);

			if ($tr.children("td").length === 1) {
				(function(groupId) {
					$tr.children("td:eq(0)").append(`
						<input class='qps_groupClcVec qps_button' type='button' title="${loc["groupClcVec"]}" value='Group Clc'>
						<input class='qps_groupMoveToVec qps_button' type='button' title="${loc["groupMove2Vec"]}" value='Group Mov'>
						<input class='qps_groupSetPrice qps_button' type='button' title="${loc["groupSetPrice"]}" value='Group Set'>
					`);
					$tr.find("input.qps_groupClcVec:eq(0)").click(function() {
						calcPriceVector(groupId, -1);
					});
					$tr.find("input.qps_groupMoveToVec:eq(0)").click(function() {
						moveToPriceVector(groupId, -1);
					});
					$tr.find("input.qps_groupSetPrice:eq(0)").click(function() {
						setPriceToVector(groupId, -1);
					});
				})(++groupId);
			} else if ($tr.children("td").length > 1) {
				let $td10 = $tr.children("td:eq(9)");
				let itemType = $tr.children("td:eq(2)").attr("title").replace(/^(.*) \(.*$/, "$1");
				(function(groupId, itemId) {
					$td10.append(`
						<input class="qps_itemAllowPriceChange" title="${loc["itemAllowPriceChange"]}" type="checkbox" checked="checked">
						<div class="qps_cont">
							<input class="qps_itemPriceVector qps_input" size=8 title="${loc["itemPriceVector"]}" type="text" value="0">
							<input class='qps_itemClcVec qps_button' type='button' title="${loc["itemClcVec"]}" value='Clc'>
							<input class='qps_itemMoveToVec qps_button' type='button' title="${loc["itemMoveToVec"]}" value='Mov'>
							<input class='qps_itemSetPrice qps_button' type='button' title="${loc["itemSetPrice"]}" value='Set'>
						</div>
					`);
					$td10.children("input:eq(0)").attr("title", loc["itemPrice"]);
					$td10.find("input.qps_itemClcVec").click(function() {
						calcPriceVector(groupId, itemId);
					});
					$td10.find("input.qps_itemMoveToVec").click(function() {
						moveToPriceVector(groupId, itemId);
					});
					$td10.find("input.qps_itemSetPrice").click(function() {
						if ($td10.find("input.qps_itemAllowPriceChange:eq(0)").is(":checked")) {
							$td10.children("input:eq(0)").val($(this).parent().find(".qps_itemPriceVector:eq(0)").val());
						}
					});
					thisStoreData.itemsData[itemType] = thisStoreData.itemsData[itemType] || {};
					if (thisStoreData.itemsData[itemType].priceVector) {
						$td10.find("input.qps_itemPriceVector:eq(0)").val(thisStoreData.itemsData[itemType].priceVector);
					}
					if (!thisStoreData.itemsData[itemType].itemAllowPriceChange && thisStoreData.itemsData[itemType].itemAllowPriceChange !== undefined) {
						$td10.find("input.qps_itemAllowPriceChange:eq(0)").attr("checked", null);
					}
				})(groupId, ++itemId);
			}
		});
	};

	$("head").append(
`<style>
.qps_input {
	border: 1px;
	padding: 1px 5px;
}
.qps_select:hover {
	background-color: white;
}
.qps_button {
	background-color: #02b002;
	color: white;
	font-size: small;
	border: 0;
	padding: 1px 5px;
}
.qps_button:hover {
	background-color: #35bf24;
}
.qps_button:active {
	background-color: #179f35;
}
.qps_delButton {
	background-color: #df3d3d;
	color: #ffec64;
	font-size: small;
	border: 0;
	padding: 1px 5px;
}
.qps_delButton:hover {
	background-color: #ec586f;
}
.qps_delButton:active {
	background-color: #c7644f;
}
.qps_mainCont {
	background-color: #aee9ae;
}
.qps_cont {
	background-color: #aee9ae;
}
table.grid td {
	height: 0px;
	padding: 1px 2px;
}
</style>`);

	let script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
})(window);
