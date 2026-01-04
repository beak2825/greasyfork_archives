// ==UserScript==
// @name         Transfer List - Calculadora Automática FINAL
// @version      2.4.4
// @author       Douglas_Kraft (Correção e modificação por Gemini)
// @description  Calcula Rating, REC, TI, Sell Bank e Lucro. Prioriza o último TI observado para projeções e deduz salários e taxas para um lucro líquido.
// @match        https://trophymanager.com/transfer/*
// @match        https://trophymanager.com/*/*
// @namespace    https://greasyfork.org/users/1018640
// @downloadURL https://update.greasyfork.org/scripts/555648/Transfer%20List%20-%20Calculadora%20Autom%C3%A1tica%20FINAL.user.js
// @updateURL https://update.greasyfork.org/scripts/555648/Transfer%20List%20-%20Calculadora%20Autom%C3%A1tica%20FINAL.meta.js
// ==/UserScript==
//  https://greasyfork.org/users/721529- original script
//  https://openuserjs.org/users/andrizz - Lógica do último TI
let wage_rate = 15.808;

// --- DADOS DE PESOS ---
let weightR4=[[.51872935,.29081119,.57222393,.89735816,.84487852,.5088794,.5088794,.13637928,.05248024,.09388931,.57549122,0,0,0],[.45240063,.31762087,.68150374,.77724031,.74690951,.50072196,.45947168,.17663123,.23886264,.18410349,.46453393,0,0,0],[.43789335,.31844356,.53515723,.63671706,.59109742,.51311701,.53184426,.32421168,.06318165,.27931537,.50093723,.19317517,.07490902,0],[.42311032,.32315966,.62271745,.53932111,.51442838,.49835997,.47896659,.26434782,.22586124,.32182902,.45537227,.23961054,.09291562,0],[.3184988,.36581214,.50091016,.31726444,.2802902,.5202217,.55763723,.60199246,.10044356,.51811057,.38320838,.38594825,.14966211,0],[.35409971,.34443972,.64417234,.30427501,.27956082,.49925481,.46093655,.32887111,.38695101,.47884837,.37465446,.39194758,.15198852,0],[.32272636,.35024067,.48762872,.22888914,.19049636,.52620414,.57842512,.53330409,.07523792,.55942740,.39986691,.53866926,.20888391,0],[.36311066,.33106245,.61831416,.19830147,.17415753,.50049575,.47737842,.28937553,.34729042,.5283421,.39939218,.55684664,.21593269,0],[.40622753,.29744114,.39446722,.09952139,.07503885,.50402399,.5850585,.36932466,.05210389,.5367799,.51998862,.83588627,.32413803,0],[.37313433,.37313433,.37313433,.74626866,.52238806,.74626866,.52238806,.52238806,.37313433,.2238806,.2238806]];
let weightR5=[[.41029304,.18048062,.56730138,1.06344654,1.02312672,.40831256,.58235457,.12717479,.05454137,.0908983,.42381693,.04626272,.02199046,0],[.42126371,.18293193,.60567629,.91904794,.89070915,.40038476,.56146633,.15053902,.15955429,.15682932,.42109742,.09460329,.03589655,0],[.23412419,.32032289,.62194779,.63162534,.63143081,.45218831,.47370658,.55054737,.17744915,.39932519,.26915814,.16413124,.07404301,0],[.27276905,.26814289,.61104798,.39865092,.42862643,.43582015,.46617076,.44931076,.25175412,.46446692,.2998635,.43843061,.21494592,0],[.2521926,.25112993,.56090649,.18230261,.1837649,.45928749,.53498118,.59461481,.09851189,.6160195,.31243959,.65402884,.29982016,0],[.28155678,.24090675,.60680245,.19068879,.20018012,.45148647,.48230007,.42982389,.26268609,.57933805,.31712419,.65824985,.29885649,0],[.22029884,.2922969,.63248227,.09904394,.10043602,.47469498,.52919791,.7755588,.10531819,.71048302,.27667115,.56813972,.21537826,0],[.21151292,.3580471,.88688492,.14391236,.13769621,.46586605,.34446036,.51377701,.59723919,.75126119,.16550722,.29966502,.12417045,0],[.3547978,.14887553,.4327338,.00023928,.00021111,.46931131,.57731335,.41686333,.05607604,.62121195,.45370457,1.03660702,.43205492,0],[.45462811,.30278232,.45462811,.90925623,.45462811,.90925623,.45462811,.45462811,.30278232,.15139116,.15139116]];
let weightRb=[[.10493615,.05208547,.07934211,.14448971,.13159554,.06553072,.07778375,.06669303,.05158306,.02753168,.1205517,.01350989,.02549169,.0388755],[.07715535,.04943315,.11627229,.11638685,.12893778,.07747251,.06370799,.03830611,.10361093,.06253997,.09128094,.0131411,.02449199,.03726305],[.08219824,.08668831,.07434242,.09661001,.08894242,.08998026,.09281287,.08868309,.04753574,.06042619,.05396986,.05059984,.05660203,.03060871],[.06744248,.06641401,.09977251,.08253749,.09709316,.09241026,.08513703,.06127851,.1027552,.07985941,.0461896,.0392727,.05285911,.02697852],[.07304213,.08174111,.07248656,.08482334,.07078726,.09568392,.09464529,.09580381,.04746231,.07093008,.04595281,.05955544,.07161249,.03547345],[.06527363,.0641027,.09701305,.07406706,.08563595,.09648566,.08651209,.06357183,.10819222,.07386495,.03245554,.05430668,.06572005,.03279859],[.07842736,.07744888,.0720115,.06734457,.05002348,.08350204,.08207655,.11181914,.03756112,.07486004,.06533972,.07457344,.09781475,.02719742],[.06545375,.06145378,.10503536,.06421508,.07627526,.09232981,.07763931,.07001035,.11307331,.07298351,.04248486,.06462713,.07038293,.02403557],[.07738289,.05022488,.07790481,.01356516,.01038191,.06495444,.07721954,.07701905,.02680715,.07759692,.12701687,.15378395,.12808992,.03805251],[.07466384,.07466384,.07466384,.14932769,.10452938,.14932769,.10452938,.10344411,.0751261,.04492581,.04479831]];
let weightR=[[.653962303361921,.330014238020285,.562994547223387,.891800163983125,.871069095865164,.454514672470839,.555697278549252,.42777598627972,.338218821750765,.134348455965202,.796916786677566,.048831870932616,.116363443378865,.282347752982916],[.565605120229193,.430973382039533,.917125432457378,.815702528287723,.99022325015212,.547995876625372,.522203232914265,.309928898819518,.837365352274204,.483822472259513,.656901420858592,.137582588344562,.163658117596413,.303915447383549],[.55838825558912,.603683502357502,.563792314670998,.770425088563048,.641965853834719,.675495235675077,.683863478201805,.757342915150728,.473070797767482,.494107823556837,.397547163237438,.429660916538242,.56364174077388,.224791093448809],[.582074038075056,.420032202680124,.7887541874616,.726221389774063,.722972329840151,.737617252827595,.62234458453736,.466946909655194,.814382915598981,.561877829393632,.367446981999576,.360623408340649,.390057769678583,.249517737311268],[.578431939417021,.778134685048085,.574726322388294,.71400292078636,.635403391007978,.822308254446722,.877857040588335,.864265671245476,.433450219618618,.697164252367046,.412568516841575,.586627586272733,.617905053049757,.308426814834866],[.497429376361348,.545347364699553,.788280917110089,.578724574327427,.663235306043286,.772537143243647,.638706135095199,.538453108494387,.887935381275257,.572515970409641,.290549550901104,.476180499897665,.526149424898544,.287001645266184],[.656437768926678,.617260722143117,.656569986958435,.63741054520629,.55148452726771,.922379789905246,.790553566121791,.999688557334153,.426203575603164,.778770912265944,.652374065121788,.662264393455567,.73120100926333,.274563618133769],[.483341947292063,.494773052635464,.799434804259974,.628789194186491,.633847969631333,.681354437033551,.671233869875345,.536121458625519,.849389745477645,.684067723274814,.389732973354501,.499972692291964,.577231818355874,.272773352088982],[.493917051093473,.370423904816088,.532148929996192,.0629206658586336,.0904950078155216,.415494774080483,.54106107545574,.468181146095801,.158106484131194,.461125738338018,.83399612271067,.999828328674183,.827171977606305,.253225855459207],[.5,.333,.5,1,.5,1,.5,.5,.333,.333,.333]];

let posToCheck = -1;
let minRec = 0;
let minTI = null;
let ratingType = 'R5';

// MODIFICADO: Lida com valores nulos ou indefinidos
const funFix2 = i => (i !== null && i !== undefined) ? (Math.round(i * 100) / 100).toFixed(2) : '-';

const seasonTI = (player, SI, positionIndex) => {
    var wage = Number(String(player.wage).replace(/<[^>]*>/g, '').replace(/,/g, ""));
    var today = new Date();
    var SS = new Date("07 10 2017 08:00:00 GMT");
    var training1 = new Date("07 10 2017 23:00:00 GMT");
    var day = (today.getTime() - training1.getTime()) / 1000 / 3600 / 24;
    while (day > 84 - 16 / 24) day -= 84;
    var session = Math.floor(day / 7) + 1;
    if (session <= 0) session = 1;
    var ageMax = 20.1 + session / 12;
    var age = Number(player.age) + (Number(player.months) / 12);
    var check = today.getTime() - SS.getTime();
    var seasonInMs = 84 * 24 * 3600 * 1000;
    var count = 0;
    while (check > seasonInMs) {
        check -= seasonInMs;
        count++;
    }
    let weight = 263533760000;
    if (positionIndex === 9) weight = 48717927500;
    if (!(wage == 30000 || (Number(player.player_id) > 120359295 && count == 0))) {
        wage_rate = 15.808;
        var TI1 = Math.pow(2, Math.log(weight * SI) / Math.log(Math.pow(2, 7))) - Math.pow(2, Math.log(weight * wage / (wage_rate)) / Math.log(Math.pow(2, 7)));
        return (Math.round(TI1 * 10) / session);
    }
    if (Number(player.player_id) > 124048574 && age < ageMax) {
        wage_rate = 23.75;
        var TI2 = Math.pow(2, Math.log(weight * SI) / Math.log(Math.pow(2, 7))) - Math.pow(2, Math.log(weight * wage / (wage_rate)) / Math.log(Math.pow(2, 7)));
        return (TI2 / session);
    }
    return null
};

// ADICIONADO: Função para calcular o TI da última semana
const calculateLastTi = (player, tableAsi) => {
    const tooltipAsi = player.asi;
    if (tooltipAsi === tableAsi || !tableAsi) {
        return null; // Sem mudança, sem TI para calcular
    }

    const isGk = player.favposition.includes('gk');
    let sk1, sk2; // sk1 = old skills (table), sk2 = new skills (tooltip)

    if (isGk) {
        sk1 = Math.pow(tableAsi * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1/7) / 14 * 11;
        sk2 = Math.pow(tooltipAsi * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1/7) / 14 * 11;
    } else {
        sk1 = Math.pow(tableAsi * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1/7);
        sk2 = Math.pow(tooltipAsi * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1/7);
    }

    return (sk2 - sk1) * 10;
};


const calculateRemainders = (player, positionIndex, skills, SI) => {
    let weight = 263533760000;
    if (positionIndex === 9) weight = 48717927500;
    let rec = 0;
    let ratingR = 0;
    let skillSum = 0;
    for (let i = 0; i < skills.length; i++) {
        skillSum += parseInt(skills[i]);
    }
    let remainder = Math.round((Math.pow(2, Math.log(weight * SI) / Math.log(Math.pow(2, 7))) - skillSum) * 10) / 10;
    let remainderWeight = 0;
    let remainderWeight2 = 0;
    let not20 = 0;
    weightR[positionIndex].forEach((value, index) => {
        rec += skills[index] * weightRb[positionIndex][index];
        const weight = ratingType === 'R5' ? weightR5 : weightR4;
        ratingR += skills[index] * weight[positionIndex][index];
        if (skills[index] != 20) {
            remainderWeight += weightRb[positionIndex][index];
            remainderWeight2 += weight[positionIndex][index];
            not20++;
        }
    });
    if (remainder / not20 > 0.9 || !not20) {
        if (positionIndex === 9) not20 = 11;
        else not20 = 14;
        remainderWeight = 1;
        remainderWeight2 = 5;
    }
    rec = funFix2((rec + remainder * remainderWeight / not20 - 2) / 3);
    return [remainder, Math.round(remainderWeight2), not20, ratingR, rec];
};

const calculateRERECOld = (player, positionIndex, skills, SI, rou) => {
    const remainders = calculateRemainders(player, positionIndex, skills, SI);
    let rou2 = (3 / 100) * (100 - (100) * Math.pow(Math.E, -rou * 0.035));
    const remainder = remainders[0] * remainders[1] / remainders[2];
    let ratingR = remainders[3] + remainder;
    return Number(funFix2(ratingR + rou2 * 5));
};

const calculateREREC = (player, positionIndex, skills, SI, rou) => {
    let ratingR4 = calculateRERECOld(player, positionIndex, skills, SI, rou);
    let rou2 = (3 / 100) * (100 - (100) * Math.pow(Math.E, -rou * 0.035));
    const remainders = calculateRemainders(player, positionIndex, skills, SI);
    var goldstar = 0;
    var skillsB = [];
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < skills.length; i++) {
            if (j == 0 && skills[i] == 20) goldstar++;
            if (j == 1) {
                if (skills[i] != 20) skillsB[i] = skills[i] * 1 + remainders[0] / (skills.length - goldstar);
                else skillsB[i] = skills[i];
            }
        }
    }
    var skillsB_rou = [];
    for (let i = 0; i < skills.length; i++) {
        if (i == 1) skillsB_rou[1] = skillsB[1];
        else skillsB_rou[i] = skillsB[i] * 1 + rou2;
    }
    var headerBonus = skillsB_rou[10] > 12 ? funFix2((Math.pow(Math.E, (skillsB_rou[10] - 10) ** 3 / 1584.77) - 1) * 0.8 + Math.pow(Math.E, (skillsB_rou[0] * skillsB_rou[0] * 0.007) / 8.73021) * 0.15 + Math.pow(Math.E, (skillsB_rou[6] * skillsB_rou[6] * 0.007) / 8.73021) * 0.05) : 0;
    var fkBonus = funFix2(Math.pow(Math.E, Math.pow(skillsB_rou[13] + skillsB_rou[12] + skillsB_rou[9] * 0.5, 2) * 0.002) / 327.92526);
    var ckBonus = funFix2(Math.pow(Math.E, Math.pow(skillsB_rou[13] + skillsB_rou[8] + skillsB_rou[9] * 0.5, 2) * 0.002) / 983.65770);
    var pkBonus = funFix2(Math.pow(Math.E, Math.pow(skillsB_rou[13] + skillsB_rou[11] + skillsB_rou[9] * 0.5, 2) * 0.002) / 1967.31409);
    var gainBase = funFix2((skillsB_rou[0] ** 2 + skillsB_rou[1] ** 2 * 0.5 + skillsB_rou[2] ** 2 * 0.5 + skillsB_rou[3] ** 2 + skillsB_rou[4] ** 2 + skillsB_rou[5] ** 2 + skillsB_rou[6] ** 2) / 6 / 22.9 ** 2);
    var keepBase = funFix2((skillsB_rou[0] ** 2 * 0.5 + skillsB_rou[1] ** 2 * 0.5 + skillsB_rou[2] ** 2 + skillsB_rou[3] ** 2 + skillsB_rou[4] ** 2 + skillsB_rou[5] ** 2 + skillsB_rou[6] ** 2) / 6 / 22.9 ** 2);
    var posGain = [gainBase * 0.3, gainBase * 0.3, gainBase * 0.9, gainBase * 0.6, gainBase * 1.5, gainBase * 0.9, gainBase * 0.9, gainBase * 0.6, gainBase * 0.3];
    var posKeep = [keepBase * 0.3, keepBase * 0.3, keepBase * 0.9, keepBase * 0.6, keepBase * 1.5, keepBase * 0.9, keepBase * 0.9, keepBase * 0.6, keepBase * 0.3];
    var allBonus = skills.length == 11 ? 0 : Number(headerBonus) + Number(fkBonus) + Number(ckBonus) + Number(pkBonus);
    if (positionIndex === 9) {
        ratingR4 = funFix2(Number(ratingR4) + allBonus);
    } else {
        ratingR4 = funFix2(Number(ratingR4) + allBonus + posGain[positionIndex] + posKeep[positionIndex]);
    }
    return ratingR4;
};

const getPosition = pos => {
    switch (pos) {
        case 'gk': return 9;
        case 'dc': return 0;
        case 'dr': case 'dl': return 1;
        case 'dmr': case 'dml': return 3;
        case 'dmc': return 2;
        case 'mr': case 'ml': return 5;
        case 'mc': return 4;
        case 'omr': case 'oml': return 7;
        case 'omc': return 6;
        case 'fc': return 8;
    }
};

const calculateFutureValues = (player, trainings) => {
    const ti_value = parseFloat(player.ti);
    const numeric_wage = parseFloat(String(player.wage).replace(/<[^>]*>/g, '').replace(/,/g, ""));

    if (isNaN(ti_value) || trainings <= 0) {
        return { futureAsi: null, futureSellBank: null, totalWages: null };
    }

    const totalWages = numeric_wage * trainings;

    const isGk = player.favposition.includes('gk');
    let allSkills;

    if (!isGk) {
        allSkills = Math.pow(player.asi * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1 / 7);
    } else {
        allSkills = Math.pow(player.asi * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1 / 7) / 14 * 11;
    }

    allSkills += (trainings * ti_value / 10);

    let futureAsi;
    if (!isGk) {
        futureAsi = Math.pow(allSkills, 7) / (Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7));
    } else {
        futureAsi = Math.pow(allSkills / 11 * 14, 7) / (Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7));
    }

    const currentAgeInMonths = (player.age * 12) + player.months;
    const futureAgeInMonths = currentAgeInMonths + trainings;
    const futureAgeInYears = futureAgeInMonths / 12;

    const ageD = 25 / futureAgeInYears;
    let futureSellBank = Math.round(futureAsi * 500 * Math.pow(ageD, 2.5));
    if (isGk) {
        futureSellBank = Math.round(futureSellBank * 0.75);
    }

    futureSellBank = Math.round(futureSellBank * 0.94);

    return { futureAsi: Math.round(futureAsi), futureSellBank, totalWages };
};


const GetPlayerData = (playerID) => {
    return new Promise((resolve) => {
        // MODIFICADO: Adicionado para ler o ASI da tabela
        const row = document.getElementById('player_row_' + playerID);
        const asiCell = row ? row.querySelector('td.align_center.align_right') : null;
        const tableAsi = asiCell ? Number(asiCell.innerText.replace(/,/g, '')) : null;

        $.post("/ajax/tooltip.ajax.php", { "player_id": playerID, minigame: undefined })
            .done((data) => {
                let player = JSON.parse(data).player;
                player.asi = Number(String(player.skill_index).replace(/,/g, ''));
                player.xp = Number(String(player.routine).replace(/,/g, ''));
                player.age = Number(player.age);
                player.months = Number(player.months);

                if (player.xp < 40) player.xp = 40;

                player.rec = [];
                player.rating = [];

                // MODIFICADO: Lógica de priorização de TI
                const lastTi = calculateLastTi(player, tableAsi);
                let seasonalTi = null;

                let positions = player.favposition.split(',');
                positions.forEach(pos => {
                    let position = getPosition(pos);
                    if (seasonalTi === null) { // Calcula o TI sazonal apenas uma vez
                       seasonalTi = seasonTI(player, player.asi, position);
                    }
                    let skills = [];
                    const checkSkills = player.skills.filter(skill => skill.value);
                    if (position === 9) {
                         skills = [checkSkills[0].value, checkSkills[2].value, checkSkills[4].value, checkSkills[1].value, checkSkills[3].value, checkSkills[5].value, checkSkills[6].value, checkSkills[7].value, checkSkills[8].value, checkSkills[9].value, checkSkills[10].value]
                    } else {
                        skills.push(...checkSkills.filter((s, i) => i % 2 === 0).map(s => s.value));
                        skills.push(...checkSkills.filter((s, i) => i % 2 !== 0).map(s => s.value));
                    }
                    skills.forEach((skill, index) => {
                        if (typeof(skill) === 'string') {
                            if (skill.includes('silver')) skills[index] = 19
                            else skills[index] = 20
                        }
                    });
                    const selectedPosition = posToCheck > -1 ? posToCheck : position;
                    const params = [player, selectedPosition, skills, player.asi, player.xp];
                    player.rating.push(ratingType === 'R5' ? calculateREREC(...params) : calculateRERECOld(...params));
                    player.rec.push(Number(calculateRemainders(player, selectedPosition, skills, player.asi)[4]));
                });

                player.ti = lastTi !== null ? lastTi : seasonalTi; // Prioriza o último TI, se existir

                const isGk = player.favposition.includes('gk');
                const baseValue = (player.asi * 500 * ((25 / (player.age + (player.months / 12))) ** 2.5));

                let numericSellBank = isGk ? Math.round(baseValue * 0.75 * 0.94) : Math.round(baseValue * 0.94);

                const trainingsDone = player.months;
                const numTrainings = 11 - trainingsDone;
                const { futureAsi, futureSellBank, totalWages } = calculateFutureValues(player, numTrainings);

                resolve({ ...player, numericSellBank, futureAsi, futureSellBank, totalWages });
            });
    });
};

const addColumn = (row, text, color = '#000', classList = 'align_center') => {
    let el = document.createElement('td');
    el.style.color = color;
    el.style.fontWeight = 'bold';
    el.classList.add(classList);
    el.innerText = text;
    row.appendChild(el);
};

const updateRow = (playerData, index) => {
    let row = document.querySelectorAll('div#transfer_list table tr[id]')[index];
    if (!row) return;

    let numericPrice = 0;
    const numericSellBank = playerData.numericSellBank;

    if (row.childNodes[2]) row.childNodes[2].innerText = playerData.age + '.' + playerData.months;

    if ((!playerData.rating.find(skill => Number(skill) >= Number(minRec))) || (minTI && Number(playerData.ti) < Number(minTI))) {
        row.style.display = 'none';
    } else {
        row.style.display = 'table-row';

        const priceCell = row.childNodes[7];
        const priceSpan = priceCell.querySelector('span');
        if (priceSpan) {
            numericPrice = Number(priceSpan.getAttribute('sort'));
            priceCell.innerText = (Math.round(numericPrice / 100000) / 10).toLocaleString() + 'M';
            priceCell.classList.remove('align_right');
            priceCell.classList.add('align_center');
        }

        row.childNodes[6].style.textAlign = 'center';
        const asiCell = row.childNodes[4];
        asiCell.innerText = (Math.round(numericSellBank / 100000) / 10).toLocaleString() + 'M';
        asiCell.classList.add('align_center');

        while (row.childNodes.length > 8) {
            row.lastChild.remove();
        }

        addColumn(row, playerData.rating.join(' - '), '#ffb354');
        addColumn(row, playerData.rec.join(' - '));
        addColumn(row, funFix2(playerData.ti), '#fff');

        const profit = numericSellBank - numericPrice;
        const formattedProfit = (Math.round(profit / 100000) / 10).toLocaleString() + 'M';
        const profitColor = profit >= 0 ? '#90EE90' : '#FF7F7F';
        addColumn(row, formattedProfit, profitColor);

        if (playerData.futureSellBank) {
            const futureProfit = parseFloat(playerData.futureSellBank) - parseFloat(numericPrice) - parseFloat(playerData.totalWages);
            const formattedFutureSellBank = (Math.round(playerData.futureSellBank / 100000) / 10).toLocaleString() + 'M';
            const formattedTotalWages = (Math.round(playerData.totalWages / 100000) / 10).toLocaleString() + 'M';
            const formattedFutureProfit = (Math.round(futureProfit / 100000) / 10).toLocaleString() + 'M';
            const futureProfitColor = futureProfit >= 0 ? '#90EE90' : '#FF7F7F';

            addColumn(row, formattedFutureSellBank, '#87CEFA');
            addColumn(row, formattedTotalWages, '#FFD700');
            addColumn(row, formattedFutureProfit, futureProfitColor);
        } else {
            addColumn(row, '-', '#87CEFA');
            addColumn(row, '-', '#FFD700');
            addColumn(row, '-', 'grey');
        }
    }
};

const resizeTable = () => {
    const thead = document.querySelectorAll('div#transfer_list tr')[0];
    if (thead.hasAttribute('data-script-processed')) return;

    thead.childNodes[1].innerText = 'Name';
    thead.childNodes[1].style.textAlign = 'left';
    thead.childNodes[2].innerText = 'Age';
    thead.childNodes[4].innerText = 'Sell Bank';
    thead.childNodes[6].innerText = 'Time';
    thead.childNodes[7].innerText = 'Price';

    while (thead.childNodes.length > 8) {
        thead.lastChild.remove();
    }

    addColumn(thead, 'Rating', '#fff');
    addColumn(thead, 'REC', '#fff');
    addColumn(thead, 'TI', '#fff');
    addColumn(thead, 'Lucro', '#fff');
    addColumn(thead, 'Sell Bank Futuro', '#fff');
    addColumn(thead, 'Salários Fut.', '#fff');
    addColumn(thead, 'Lucro Fut. Líquido', '#fff');

    document.querySelectorAll('.transfer_list_outer')[0].style.width = '1200px';
    [...document.querySelectorAll('.main_center')].forEach(el => {
        el.style.width = '1310px'
    });
    document.querySelectorAll('.column1_d')[0].style.width = '1300px';

    thead.setAttribute('data-script-processed', 'true');
};

const addFilters = () => {
    if (document.getElementById('search_btn_container')) return;
    const searchBtn = document.getElementById('search_btn');
    const filtersEl = document.getElementById('filters');
    if (!searchBtn || !filtersEl) return;

    searchBtn.parentElement.id = 'search_btn_container';
    searchBtn.remove();

    const el = document.createElement('div');
    const div1 = document.createElement('div');
    div1.classList.add('align_center', 'padding');

    const inputPosEl = document.createElement('select');
    inputPosEl.id = 'pos_rating';
    inputPosEl.classList.add('embossed')
    for (let i = -1; i <= 9; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        let positionName = 'DC';
        switch (i) {
            case -1: positionName = 'Default Position'; break;
            case 0: positionName = 'DC'; break;
            case 1: positionName = 'DR/L'; break;
            case 2: positionName = 'DMC'; break;
            case 3: positionName = 'DMR/L'; break;
            case 4: positionName = 'MC'; break;
            case 5: positionName = 'MR/L'; break;
            case 6: positionName = 'OMC'; break;
            case 7: positionName = 'OMR/L'; break;
            case 8: positionName = 'FC'; break;
            case 9: positionName = 'GK'; break;
        }
        opt.innerHTML = positionName;
        inputPosEl.appendChild(opt);
    }
    const labelPosEl = document.createElement('label');
    labelPosEl.innerText = 'Select Position for Rating'
    div1.appendChild(labelPosEl);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputPosEl);
    div1.appendChild(document.createElement('br'));

    const inputEl = document.createElement('input');
    inputEl.id = 'min_r4';
    inputEl.type = 'number';
    inputEl.classList.add('embossed')
    const labelEl = document.createElement('label');
    labelEl.innerText = 'Min Rating'
    div1.appendChild(labelEl);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputEl);
    div1.appendChild(document.createElement('br'));

    const inputTIEl = document.createElement('input');
    inputTIEl.id = 'min_ti';
    inputTIEl.type = 'number';
    inputTIEl.classList.add('embossed')
    const labelTiEl = document.createElement('label');
    labelTiEl.innerText = 'Min TI'
    div1.appendChild(labelTiEl);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputTIEl);
    div1.appendChild(document.createElement('br'));

    const labelR = document.createElement('label');
    labelR.innerText = 'Rating Type'
    labelR.style.marginBottom = '8px'
    const labelR4 = document.createElement('label');
    labelR4.innerText = 'R4'
    const labelR5 = document.createElement('label');
    labelR5.innerText = 'R5'
    const inputR4 = document.createElement('input');
    inputR4.id = 'r4';
    inputR4.type = 'radio';
    inputR4.classList.add('embossed')
    inputR4.value = 'R4'
    inputR4.name = 'ratingType'
    const inputR5 = document.createElement('input');
    inputR5.id = 'r5';
    inputR5.type = 'radio';
    inputR5.name = 'ratingType'
    inputR5.value = 'R5'
    inputR5.checked = true;
    inputR5.classList.add('embossed')
    labelR5.style.marginLeft = '8px'
    div1.appendChild(document.createElement('br'));
    div1.appendChild(labelR);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(labelR4);
    div1.appendChild(inputR4);
    div1.appendChild(labelR5);
    div1.appendChild(inputR5);

    const div2 = document.createElement('div');
    div2.classList.add('align_center', 'padding');
    const buttonEl = document.createElement('button');
    buttonEl.style.padding = '4px 60px';
    buttonEl.style.marginTop = '4px';
    buttonEl.classList.add('button', 'button_icon');
    buttonEl.textContent = 'Filter';
    buttonEl.addEventListener('click', () => {
        posToCheck = Number(document.getElementById('pos_rating').value);
        minRec = document.getElementById('min_r4').value;
        minTI = document.getElementById('min_ti').value;
        ratingType = document.getElementById('r4').checked ? 'R4' : 'R5';
        init();
    });
    div2.appendChild(buttonEl);

    el.appendChild(div1);
    el.appendChild(div2);
    filtersEl.appendChild(el);
};

function init() {
    const transferListTable = document.querySelector('div#transfer_list table');
    if (transferListTable === null) return;

    const thead = transferListTable.querySelector('tr');
    if (thead) thead.removeAttribute('data-script-processed');

    resizeTable();
    let playersIDs = [];
    [...transferListTable.querySelectorAll('tr[id^=player_row]')].forEach(el => {
        playersIDs.push(el.id.split('_')[2]);
    });
    playersIDs.map(GetPlayerData).map((promise, index) => {
        promise.then(playerData => updateRow(playerData, index));
    });
}

(function() {
    'use strict';
    addFilters();
    let observer = new MutationObserver(init);
    observer.observe(document.querySelector('div#transfer_list'), {
        childList: true
    });
    init();
})();