// ==UserScript==
// @name        Erepublik Epic PT
// @include     *www.erepublik.com/*
// @version     1.5
// @description Monitoriza Batalhas épicas, e contagem de Gold ganho.
// @grant       GM_addStyle
// @grant       unsafeWindow
// @namespace   https://greasyfork.org/en/users/1559074-xtryker
// @downloadURL
// @updateURL
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/562217/Erepublik%20Epic%20PT.user.js
// @updateURL https://update.greasyfork.org/scripts/562217/Erepublik%20Epic%20PT.meta.js
// ==/UserScript==
/* global jQuery */
var $ = jQuery;
var timeout = 60e3;
var me = $('.user_name').text().trim();
var i = 0;
var myPrice = 9999;
var lowestPrice = 9999;
var pricer = 0;
var provider = "";
var epc = ["", "FSB", "Épica"];
var nefl = true;

// Variáveis para controle de energia
var energyRecoveryInterval = 6 * 60 * 1000; // 6 minutos em milissegundos

function style(t) {
	$("head").append("<style>" + t + "</style>");
}

function getTodayKey() {
    var today = new Date();
    return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
}

function getWeekKey() {
    var today = new Date();
    // Calcular o número da semana ISO 8601 (segunda-feira como primeiro dia)
    var tempDate = new Date(today.valueOf());
    var dayNum = (today.getDay() + 6) % 7;
    tempDate.setDate(tempDate.getDate() - dayNum + 3);
    var firstThursday = tempDate.valueOf();
    tempDate.setMonth(0, 1);
    if (tempDate.getDay() !== 4) {
        tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
    }
    var weekNumber = 1 + Math.ceil((firstThursday - tempDate) / 604800000);
    return today.getFullYear() + "-S" + weekNumber;
}

function getMonthKey() {
    var today = new Date();
    return today.getFullYear() + "-" + (today.getMonth() + 1);
}

function updateGoldTracker() {
    try {
        var citizenData = unsafeWindow.erepublik && unsafeWindow.erepublik.citizen;

        if (!citizenData || citizenData.gold === undefined) {
            $('#gold-tracker').html("<div>💰 A aguardar dados...</div>");
            return;
        }

        var currentGold = parseFloat(citizenData.gold) || 0;
        var todayKey = getTodayKey();
        var weekKey = getWeekKey();
        var monthKey = getMonthKey();

        // Chaves de armazenamento
        var todayStorageKey = 'erep_goldTracker_' + me + '_day_' + todayKey;
        var weekStorageKey = 'erep_goldTracker_' + me + '_week_' + weekKey;
        var monthStorageKey = 'erep_goldTracker_' + me + '_month_' + monthKey;

        // Obter valores salvos
        var storedGoldToday = localStorage.getItem(todayStorageKey);
        var storedGoldWeek = localStorage.getItem(weekStorageKey);
        var storedGoldMonth = localStorage.getItem(monthStorageKey);

        // Gold do início do dia
        var startGoldToday = currentGold;
        if (storedGoldToday !== null) {
            startGoldToday = parseFloat(storedGoldToday);
        } else {
            localStorage.setItem(todayStorageKey, currentGold.toString());
            // Limpa dias anteriores
            for (var storageKey in localStorage) {
                if (storageKey.startsWith('erep_goldTracker_' + me + '_day_') && storageKey !== todayStorageKey) {
                    localStorage.removeItem(storageKey);
                }
            }
        }

        // Gold do início da semana
        var startGoldWeek = currentGold;
        if (storedGoldWeek !== null) {
            startGoldWeek = parseFloat(storedGoldWeek);
        } else {
            localStorage.setItem(weekStorageKey, currentGold.toString());
            // Limpa semanas anteriores
            for (var storageKey2 in localStorage) {
                if (storageKey2.startsWith('erep_goldTracker_' + me + '_week_') && storageKey2 !== weekStorageKey) {
                    localStorage.removeItem(storageKey2);
                }
            }
        }

        // Gold do início do mês
        var startGoldMonth = currentGold;
        if (storedGoldMonth !== null) {
            startGoldMonth = parseFloat(storedGoldMonth);
        } else {
            localStorage.setItem(monthStorageKey, currentGold.toString());
            // Limpa meses anteriores
            for (var storageKey3 in localStorage) {
                if (storageKey3.startsWith('erep_goldTracker_' + me + '_month_') && storageKey3 !== monthStorageKey) {
                    localStorage.removeItem(storageKey3);
                }
            }
        }

        // Calcular diferenças
        var goldDiffToday = currentGold - startGoldToday;
        var goldDiffWeek = currentGold - startGoldWeek;
        var goldDiffMonth = currentGold - startGoldMonth;

        // Formatar strings
        var diffStrToday = goldDiffToday >= 0 ? "+" + goldDiffToday.toFixed(2) : goldDiffToday.toFixed(2);
        var diffStrWeek = goldDiffWeek >= 0 ? "+" + goldDiffWeek.toFixed(2) : goldDiffWeek.toFixed(2);
        var diffStrMonth = goldDiffMonth >= 0 ? "+" + goldDiffMonth.toFixed(2) : goldDiffMonth.toFixed(2);

        var colorToday = goldDiffToday >= 0 ? "#00aa00" : "#aa0000";
        var colorWeek = goldDiffWeek >= 0 ? "#00aa00" : "#aa0000";
        var colorMonth = goldDiffMonth >= 0 ? "#00aa00" : "#aa0000";

        $('#gold-tracker').html(
            "<div>💰 Ouro: <b>" + currentGold.toFixed(2) + "</b></div>" +
            "<div style='font-size: 10px; margin-top: 2px;'>" +
            "Hoje: <span style='color: " + colorToday + "; font-weight: bold;'>" + diffStrToday + "</span> | " +
            "Semana: <span style='color: " + colorWeek + "; font-weight: bold;'>" + diffStrWeek + "</span> | " +
            "Mês: <span style='color: " + colorMonth + "; font-weight: bold;'>" + diffStrMonth + "</span>" +
            "</div>"
        );

    } catch (e) {
        $('#gold-tracker').html("<div>💰 Erro: " + e.message + "</div>");
        console.error("Erro ao rastrear gold:", e);
    }
}

function updateEnergyTimer() {
    try {
        // Tenta obter dados de várias fontes possíveis
        var citizenData = unsafeWindow.erepublik && unsafeWindow.erepublik.citizen;

        // Debug - lista todas as propriedades disponíveis (apenas na primeira execução)
        if (!window.energyDebugDone && citizenData) {
            console.log("Propriedades do citizen:", Object.keys(citizenData));
            console.log("Citizen data completo:", citizenData);
            window.energyDebugDone = true;
        }

        var currentEnergy, maxEnergy, recoveryRate;

        // Tenta várias possíveis localizações dos dados
        if (citizenData) {
            currentEnergy = citizenData.energy || citizenData.currentEnergy;
            maxEnergy = citizenData.maxEnergy || citizenData.max_energy ||
                       citizenData.limitEnergy || citizenData.limit_energy ||
                       citizenData.energyLimit || citizenData.energy_limit;
            recoveryRate = citizenData.energyPerInterval || citizenData.energy_per_interval ||
                          citizenData.recoveryRate || citizenData.recovery_rate ||
                          citizenData.energyRecoveryRate || 10;
        }

        // Tenta obter da página via jQuery se não conseguiu do unsafeWindow
        if (!currentEnergy || !maxEnergy) {
            var energyElement = $('.energy_amount, .energy, [class*="energy"]');
            if (energyElement.length > 0) {
                var energyText = energyElement.text();
                var match = energyText.match(/(\d+)\s*\/\s*(\d+)/);
                if (match) {
                    currentEnergy = currentEnergy || parseInt(match[1]);
                    maxEnergy = maxEnergy || parseInt(match[2]);
                }
            }
        }

        // Tenta obter via API se ainda não tiver maxEnergy
        if (currentEnergy !== undefined && !maxEnergy && !window.fetchingMaxEnergy) {
            window.fetchingMaxEnergy = true;
            $.getJSON("/en/main/citizen-profile-json/" + (citizenData ? citizenData.citizenId : ''), function(data) {
                if (data && data.citizen) {
                    window.cachedMaxEnergy = data.citizen.maxEnergy || data.citizen.max_energy ||
                                            data.citizen.limitEnergy || data.citizen.limit_energy;
                    window.cachedRecoveryRate = data.citizen.energyPerInterval ||
                                               data.citizen.energy_per_interval || 10;
                    console.log("Max Energy obtida da API:", window.cachedMaxEnergy);
                    console.log("Recovery Rate obtida da API:", window.cachedRecoveryRate);
                }
                window.fetchingMaxEnergy = false;
            }).fail(function() {
                window.fetchingMaxEnergy = false;
            });
        }

        // Usa valores em cache se disponíveis
        maxEnergy = maxEnergy || window.cachedMaxEnergy;
        recoveryRate = recoveryRate || window.cachedRecoveryRate || 10;

        if (!currentEnergy && currentEnergy !== 0) {
            $('#energy-timer').html("<div>⚡ A aguardar dados... (verifique a consola)</div>");
            return;
        }

        if (!maxEnergy) {
            $('#energy-timer').html("<div>⚡ Energia: <b>" + currentEnergy + "</b> / ? (a obter máx...)</div>");
            return;
        }

        if (currentEnergy >= maxEnergy) {
            $('#energy-timer').html("<div style='color: #00ff00; font-weight: bold;'>⚡ Energia: " + currentEnergy + "/" + maxEnergy + " (CHEIA) [+" + recoveryRate + "/6min]</div>");
            return;
        }

        var energyNeeded = maxEnergy - currentEnergy;
        var intervalsNeeded = Math.ceil(energyNeeded / recoveryRate);
        var timeNeeded = intervalsNeeded * energyRecoveryInterval;

        var fullEnergyTime = new Date(Date.now() + timeNeeded);
        var hours = String(fullEnergyTime.getHours()).padStart(2, '0');
        var minutes = String(fullEnergyTime.getMinutes()).padStart(2, '0');

        // Calcula tempo restante
        var hoursRemaining = Math.floor(timeNeeded / (60 * 60 * 1000));
        var minutesRemaining = Math.floor((timeNeeded % (60 * 60 * 1000)) / (60 * 1000));

        var timeRemainingStr = hoursRemaining > 0
            ? hoursRemaining + "h " + minutesRemaining + "min"
            : minutesRemaining + "min";

        $('#energy-timer').html(
            "<div>⚡ Energia: <b>" + currentEnergy + "/" + maxEnergy + "</b> [+" + recoveryRate + "/6min]</div>" +
            "<div>🕐 Cheia às: <b>" + hours + ":" + minutes + "</b> (em " + timeRemainingStr + ")</div>"
        );
    } catch (e) {
        $('#energy-timer').html("<div>⚡ Erro: " + e.message + "</div>");
        console.error("Erro ao obter dados de energia:", e);
    }
}

function main() {
	$("#epl").html('');
	$.getJSON("/en/military/campaigns-new", function (r) {
		var a = 0;
        var fl = true;
        $('#mybattles').html('');
        $.getJSON("/en/military/campaignsJson/citizen", function (j) {
            $.each(j.contributions, function (i, e) {
                var country = getKeyByValue(img_country, e.side_country_id);
                var flag = "<img src='https://www.erepublik.net/images/flags_png/S/" + country + ".png' alt=''>";
                $('#mybattles').append("<div><a href='https://erepublik.com/en/military/battlefield/" + e.battle_id + "'>" + flag + " D"+ e.division + ", " + r.battles[e.battle_id].region.name + "</a></div>");
            });
        });
		$('#epl').append("<div id='eps'></div>");
		$.each(r.battles, function (i, b) {
			fl = true;
			$.each(b.div, function (i, d) {
				if (typeof d.epic !== "undefined" && d.epic >= 1) {
					if (fl) {
						$('#eps').append("<div id='epid" + b.id + "'><p> &gt;&gt; <a href='/en/military/battlefield/" + b.id + "'>" + b.region.name + "</a></p></div>");
						fl = false;
					}
					$('#epid' + b.id).append("<div><b>div " + d.div + " " + epc[d.epic] + "</b></div>");
					nefl = false;
				}
			});
		});
		if (nefl) {
			$('#eps').append("<div id='ne'><p> Nenhuma Batalha Épica</p></div>");
			fl = false;
		}
		if (/military\/battlefield/.test(location.href)) {
            var cCountry = unsafeWindow.erepublik.citizen.citizenshipCountryId;
            var cMU = unsafeWindow.erepublik.citizen.muId;
			$('#eps').append("<div class='div pointer'> <span title='Lado' style='width: 16px; display: inline-block; text-align: center;'> L </span> <span title='Divisão'> D </span> <span title='Disponibilidade (Global / Bloqueado para país/UM)'> B </span> Detalhes</div>");
			var battleId = location.href.replace(/[^0-9]/g, '');
			$.each(r.battles[battleId].div, function (i, d) {
				if (typeof d.co.inv !== "undefined" || typeof d.co.def !== "undefined") {
                    var def = getKeyByValue(img_country, r.battles[battleId].def.id);
                    var inv = getKeyByValue(img_country, r.battles[battleId].inv.id);
                    var defFlag = "https://www.erepublik.net/images/flags_png/S/" + def + ".png";
                    var invFlag = "https://www.erepublik.net/images/flags_png/S/" + inv + ".png";
					$('#epl').append("<div id='eps" + a + "'></div>");
					if (typeof d.co.inv !== "undefined") {
						$.each(d.co.inv, function (i, cc) {
                            var lock = (cc.sub_mu !== 0 && cc.sub_mu !== cMU) || (cc.sub_country !== 0 && cc.sub_country !== cCountry) ? ' &#128274;' : ' &#128154;';
							$('#eps' + a).append("<div class='div'><img src='" + invFlag +"' alt=''> " + d.div + lock + " <span>" + cc.reward + "/mil.</span><span>  / " + cc.threshold + "%</span><span>  / " + cc.budget + " cc </span></div>");
						});
					}
					if (typeof d.co.def !== "undefined") {
						$.each(d.co.def, function (i, cc) {
                            var lock = (cc.sub_mu !== 0 && cc.sub_mu !== cMU) || (cc.sub_country !== 0 && cc.sub_country !== cCountry) ? ' &#128274;' : ' &#128154;';
							$('#eps' + a).append("<div class='div'><img src='" + defFlag +"' alt=''> " + d.div + lock + " <span>" + cc.reward + "/mil.</span><span>  / " + cc.threshold + "%</span><span>  / " + cc.budget + " cc </span></div>");
						});
					}
					a++;
				}
			});
            $("#maxhit").html('');
            $.getJSON("/en/military/nbp-stats/" + battleId, function (r) {
                var maxHit = r.maxHit;
                if (typeof maxHit !== 'undefined' && maxHit > 0) {
                    $('#maxhit').html("<div>Meu hit máximo: <b>" + maxHit + "</b></div>");
                }
            });
        }
	});

    // Atualiza o timer de energia e gold tracker
    updateEnergyTimer();
    updateGoldTracker();
}

style("#epinf{z-index: 99999; position: fixed; top: 0; left: 0;margin: 7px;padding: 5px;border-radius: 3px;font-size: 11px;background-color:rgba(255,255,255,0.8);border:1px solid #999;box-shadow: 1px 1px 8px #aaaaaa; max-width: 350px; cursor: move;};");
style("#epinf.dragging{cursor: grabbing;};");
style(".bb{font-weight: 700;}");
style(".div, #ne, #mybattles {border-bottom: 1px solid #666; margin-bottom: 4px;}");
style(".pointer {cursor: pointer}");
style(".div img {vertical-align: bottom;}");
style(".div span:first-of-type {font-weight: 700}");
style("#mybattles img{vertical-align: text-bottom;}");
style("#energy-timer, #gold-tracker {border-bottom: 1px solid #666; margin-bottom: 4px; padding-bottom: 4px; color: #333;}");

$("body").after("<div id='epinf'><div id='epl'></div></div>");
$("#epl").after("<div id='energy-timer'></div><div id='gold-tracker'></div><div>O meu contributo em batalha</div><div id='mybattles'></div><div id='maxhit'></div>");

// Carregar posição salva
var savedPosition = localStorage.getItem('erep_gui_position');
var xOffset = 0;
var yOffset = 0;

if (savedPosition) {
    try {
        var pos = JSON.parse(savedPosition);
        $('#epinf').css({
            'top': pos.top + 'px',
            'left': pos.left + 'px',
            'right': 'auto',
            'margin': '0'
        });
        xOffset = pos.left;
        yOffset = pos.top;
    } catch (e) {
        console.error("Erro ao carregar posição:", e);
    }
}

// Tornar o GUI arrastável
var isDragging = false;
var currentX;
var currentY;
var initialX;
var initialY;

$('#epinf').on('mousedown', function(e) {
    if (e.target === this || $(e.target).closest('#epl, #energy-timer, #gold-tracker, #mybattles, #maxhit').length > 0) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
        $(this).addClass('dragging');
    }
});

$(document).on('mousemove', function(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        $('#epinf').css({
            'top': currentY + 'px',
            'left': currentX + 'px',
            'right': 'auto',
            'margin': '0'
        });
    }
});

$(document).on('mouseup', function() {
    if (isDragging) {
        isDragging = false;
        $('#epinf').removeClass('dragging');

        // Salvar posição
        localStorage.setItem('erep_gui_position', JSON.stringify({
            top: yOffset,
            left: xOffset
        }));
    }
});

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

var img_country = {
    Romania: 1,
    Brazil: 9,
    Italy: 10,
    France: 11,
    Germany: 12,
    Hungary: 13,
    China: 14,
    Spain: 15,
    Canada: 23,
    USA: 24,
    Mexico: 26,
    Argentina: 27,
    Venezuela: 28,
    "United-Kingdom": 29,
    Switzerland: 30,
    Netherlands: 31,
    Belgium: 32,
    Austria: 33,
    "Czech-Republic": 34,
    Poland: 35,
    Slovakia: 36,
    Norway: 37,
    Sweden: 38,
    Finland: 39,
    Ukraine: 40,
    Russia: 41,
    Bulgaria: 42,
    Turkey: 43,
    Greece: 44,
    Japan: 45,
    "South-Korea": 47,
    India: 48,
    Indonesia: 49,
    Australia: 50,
    "South-Africa": 51,
    "Republic-of-Moldova": 52,
    Portugal: 53,
    Ireland: 54,
    Denmark: 55,
    Iran: 56,
    Pakistan: 57,
    Israel: 58,
    Thailand: 59,
    Slovenia: 61,
    Croatia: 63,
    Chile: 64,
    Serbia: 65,
    Malaysia: 66,
    Philippines: 67,
    Singapore: 68,
    "Bosnia-Herzegovina": 69,
    Estonia: 70,
    Latvia: 71,
    Lithuania: 72,
    "North-Korea": 73,
    Uruguay: 74,
    Paraguay: 75,
    Bolivia: 76,
    Peru: 77,
    Colombia: 78,
    "Republic-of-Macedonia-FYROM": 79,
    Montenegro: 80,
    "Republic-of-China-Taiwan": 81,
    Cyprus: 82,
    Belarus: 83,
    "New-Zealand": 84,
    "Saudi-Arabia": 164,
    Egypt: 165,
    "United-Arab-Emirates": 166,
    Albania: 167,
    Georgia: 168,
    Armenia: 169,
    Nigeria: 170,
    Cuba: 171
};

main();

setInterval(function () {
	main();
}, 30e3);

// Atualiza o timer de energia e gold tracker a cada minuto
setInterval(function () {
    updateEnergyTimer();
    updateGoldTracker();
}, 60e3);