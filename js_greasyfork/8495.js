// ==UserScript==
// @name         Mazaki
// @namespace    http://your.homepage/
// @version      0.18
// @description  enter something useful
// @author       You
// @match        https://*.plemiona.pl/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/8495/Mazaki.user.js
// @updateURL https://update.greasyfork.org/scripts/8495/Mazaki.meta.js
// ==/UserScript==
(function(window, $) {
    var world = (/(pl\d+)/.exec(window.location.href))[1];
    $(function() {
        function Resources(wood, stone, iron) {
            this.wood = wood || 0;
            this.stone = stone || 0;
            this.iron = iron || 0;
        }
        
        function App(container) {
            var images = {
                'units': 'http://dspl.innogamescdn.com/8.33/24961/graphic/unit/unit___unit__.png'
            };
            var speeds = [{s: 9, u: 'spy'}, {s: 10, u: 'light'}, {s: 11, u: 'heavy'}, {s: 18, u: 'axe'}, {s: 22, u: 'sword'}, {s: 30, u: 'ram'}, {s: 35, u: 'snob'}];
            var units = {
                spear: {
                    type: 'infranty',
                    purpose: 'def',
                    attack: 10,
                    def: {
                        'infranty': 15,
                        'cavalery': 45,
                        'archer': 20
                    },
                    cost: {
                        'wood': 50,
                        'stone': 30,
                        'iron': 10
                    },
                    speed: 18,
                    cap: 25
                },
                sword: {
                    type: 'infranty',
                    purpose: 'def',
                    attack: 25,
                    def: {
                        'infranty': 50,
                        'cavalery': 15,
                        'archer': 40
                    },
                    cost: {
                        'wood': 30,
                        'stone': 30,
                        'iron': 70
                    },
                    speed: 22,
                    cap: 15
                },
                axe: {
                    type: 'infranty',
                    purpose: 'attack',
                    attack: 40,
                    def: {
                        'infranty': 10,
                        'cavalery': 5,
                        'archer': 10
                    },
                    cost: {
                        'wood': 60,
                        'stone': 30,
                        'iron': 40
                    },
                    speed: 18,
                    cap: 10
                },
                archer: {
                    type: 'infranty',
                    purpose: 'def',
                    attack: 15,
                    def: {
                        'infranty': 50,
                        'cavalery': 40,
                        'archer': 5
                    },
                    cost: {
                        'wood': 100,
                        'stone': 30,
                        'iron': 60
                    },
                    speed: 18,
                    cap: 10
                },
                spy: {
                    type: 'cavalery',
                    purpose: 'spy',
                    attack: 0,
                    def: {
                        'infranty': 2,
                        'cavalery': 1,
                        'archer': 2
                    },
                    cost: {
                        'wood': 50,
                        'stone': 50,
                        'iron': 20
                    },
                    speed: 9,
                    cap: 0
                },
                light: {
                    type: 'cavalery',
                    purpose: 'attack',
                    attack: 130,
                    def: {
                        'infranty': 30,
                        'cavalery': 40,
                        'archer': 30
                    },
                    cost: {
                        'wood': 125,
                        'stone': 100,
                        'iron': 250
                    },
                    speed: 10,
                    cap: 80
                },
                marcher: {
                    type: 'cavalery',
                    purpose: 'attack',
                    attack: 120,
                    def: {
                        'infranty': 40,
                        'cavalery': 30,
                        'archer': 50
                    },
                    cost: {
                        'wood': 250,
                        'stone': 100,
                        'iron': 150
                    },
                    speed: 10,
                    cap: 50
                },
                heavy: {
                    type: 'cavalery',
                    purpose: 'def',
                    attack: 150,
                    def: {
                        'infranty': 200,
                        'cavalery': 80,
                        'archer': 180
                    },
                    cost: {
                        'wood': 200,
                        'stone': 150,
                        'iron': 600
                    },
                    speed: 11,
                    cap: 50
                },
                ram: {
                    type: 'infranty',
                    purpose: 'attack',
                    attack: 2,
                    def: {
                        'infranty': 20,
                        'cavalery': 50,
                        'archer': 20
                    },
                    cost: {
                        'wood': 300,
                        'stone': 200,
                        'iron': 200
                    },
                    speed: 30,
                    cap: 0
                },
                catapult: {
                    type: 'infranty',
                    purpose: 'def',
                    attack: 100,
                    def: {
                        'infranty': 100,
                        'cavalery': 50,
                        'archer': 100
                    },
                    cost: {
                        'wood': 320,
                        'stone': 400,
                        'iron': 100
                    },
                    speed: 30,
                    cap: 0
                }
            };
            
            var data = GM_getValue('mazaki.data') || '{}';
            var meta = GM_getValue('mazaki.meta') || '{}';
            var self = this;
            var village = (/village=(\d+)/).exec($('a','#menu_row2_village').attr('href'));
            data = (JSON.parse(data))[world] || {};
            meta = (JSON.parse(meta))[world] || {};
            
            function saveData() {
                var d = GM_getValue('mazaki.data') || '{}';
                d = JSON.parse(d);
                d[world] = data;
                GM_setValue('mazaki.data', JSON.stringify(d));
            }
            
            function saveMeta() {
                var m = GM_getValue('mazaki.meta') || '{}';
                m = JSON.parse(m);
                m[world] = meta;
                GM_setValue('mazaki.meta', JSON.stringify(m));
            }
            
            if (village) {
                village = village[1];
 
                function getVillageName() {
                    return $('a','#menu_row2_village').filter(function() {
                        if ((/screen=overview/).test($(this).attr('href'))) {
                            return true;
                        }
                        return false;
                    }).text();
                }
            
                if (!(village in data)) {
                    var coords = false;
                    $('b','#menu_row2').each(function() {
                        var c = (/\((\d+)\|(\d+)\)/).exec($(this).text());
                        if (c) {
                            coords = {
                                x: parseInt(c[1]),
                                y: parseInt(c[2])
                            };
                            return false;
                        }
                    });
                    data[village] =  {
                        coords: coords,
                        name: getVillageName()
                    };
                } else {
                    var newName = getVillageName();
                    if (data[village].name !== newName) {
                        data[village].name = newName;
                    }
                }
                
                // Resources update
                var perHourRegex = /(\d+)/;
                function extract(reg, val, int) {
                    var m = reg.exec(val);
                    return m && m[int];
                }
                data[village].resources = {
                    wood: { 
                        current: parseInt($('#wood').text()),
                        prod: parseInt(extract(perHourRegex, $('#wood').attr('title'), 1))
                    },
                    stone: { 
                        current: parseInt($('#stone').text()),
                        prod: parseInt(extract(perHourRegex, $('#stone').attr('title'), 1))
                    },
                    iron: { 
                        current: parseInt($('#iron').text()),
                        prod: parseInt(extract(perHourRegex, $('#iron').attr('title'), 1))
                    },
                };
                data[village].meta = {
                    lastResourceUpdate: (new Date()).getTime() / 1000,
                    storage: parseInt($('#storage').text())
                };
                saveData();
            }
            
            function formatInt(int)
            {
                var f = '' + int;
                return f.split('').reverse().join('').replace(/(\d{3})/g, '$1 ').split('').reverse().join('');
            }
            
            function updateResources() {
                var time = (new Date()).getTime() / 1000;
                var res = new Resources(), prod = new Resources(), curr = new Resources();
                for (var i in data) {
                    for (var r in data[i].resources) {
                        res[r] = Math.min(data[i].resources[r].current + data[i].resources[r].prod / 3600 * (time - data[i].meta.lastResourceUpdate), data[i].meta.storage);
                        curr[r] += res[r];
                        prod[r] += data[i].resources[r].prod;
                    }
                    $('#resources-' + i).empty()
                        .append('<div>' + numberFormat(parseInt(res.wood)) + ', '+ numberFormat(parseInt(res.stone)) + ', ' + numberFormat(parseInt(res.iron)) + ' / ' + numberFormat(data[i].meta.storage) + '</div>')
                        .append('<a href="http://' + world + '.plemiona.pl/game.php?village=' + i + '&screen=overview"><div style="position: absolute; top-margin: 18px; right: 5px; margin: 0; display: inline-block;"><span class="icon header village"></span></div></a>')
                        .append('<a href="http://' + world + '.plemiona.pl/game.php?village=' + i + '&screen=train"><div style="position: absolute; margin-top: 8px; right: 25px; margin: 0; display: inline-block;"><span class="icon header" style="background-image: none;"><img src="http://dspl.innogamescdn.com/8.33.2/25392/graphic/unit/att.png" /></span></div></a>');
                    var barContainer = $('<div style="position:relative; width: 75%;"></div>');
                    $('#resources-' + i).append(barContainer);
                    barContainer.append('<div class="mazaki-progressbar-container"><div class="mazaki-progressbar" style="background-color: #8B4513; width: ' + res.wood / data[i].meta.storage * 100 + '%;"></div>')
                        .append('<div class="mazaki-progressbar-container"><div class="mazaki-progressbar" style="background-color: #B22222; width: ' + res.stone / data[i].meta.storage * 100 + '%;"></div>')
                        .append('<div class="mazaki-progressbar-container"><div class="mazaki-progressbar" style="background-color: #696969; width: ' + res.iron / data[i].meta.storage * 100 + '%;"></div>')
                    .append('<div style="right: 1px; position:absolute; overflow: hidden; top: -1px; text-align: right; color: rgba(255,255,255,0.7); text-shadow: 0px 0px 3px #000;">' + data[i].name + '</div>');
                            
                    
                }
                var totalResProd = (prod.wood + prod.stone + prod.iron);
                var totalRes = (curr.wood + curr.stone + curr.iron);
                var coins = Math.round(Math.min(Math.min(curr.wood / 280, curr.stone / 300), curr.stone / 250)) / 100;
                var maxCoins = Math.round(totalRes / 830) / 100;
                $res = $('#total-res').empty();
                $res.append('<span class="icon header wood" title="' + numberFormat(prod.wood) + '/h"> </span> ' + numberFormat(curr.wood) + ' <span class="icon header stone" title="' + numberFormat(prod.stone) + '/h"> </span> ' + numberFormat(curr.stone) + ' <span class="icon header iron" title="' + numberFormat(prod.iron) + '/h"> </span> ' + numberFormat(curr.iron) + '<br />');
                $res.append('<span class="icon header ressources"> </span> <b>' + numberFormat(totalRes) + '</b> (' + numberFormat(totalResProd) + '/h)<br /><img src="http://dspl.innogamescdn.com/8.33.3/25531/graphic/gold_big.png" alt="Złote monety" class="icon header" style="background-image: none;"> <b>' + coins + ' - ' + maxCoins + '</b> (' +Math.round(totalResProd / 83000 * 100) / 100 + '/h)<p></p>');
                setTimeout(updateResources, 1000);
            }
            
            function action(name, options) {
                switch (name) {
                    case 'removeVillage':
                        (options in data) && delete data[options];
                        break;
                }
            }
            
            function numberFormat(number) {
                var i, units = ['', 'k', 'M', 'G', 'T'];
                for (i = 0; i < units.length && number > 1000; i++) {
                    number /= 1000;
                }
                
                return (Math.round(number * 100) / 100) + units[i];
            }
            
            container.on('click', 'a[data-action]', function(e) {
                e.preventDefault()
                action($(this).data('action'), $(this).data('options'));
                saveData();
                render();
            });
            
            function getSortedData(a, fn) {
                var i, obj = [];
                for (i in a) {
                    obj.push({
                        id: i,
                        obj: a[i]
                    });
                }
                return obj.sort(fn);
            }
            
            function render() {
                function uc(v,s,t) {
                    return v.units.data[s] ? v.units.data[s][t] : 0;
                }
                container.empty();
                var $header = $('<p><a href="#" id="toggle-army">Toggle army</a><div id="total-res"></div>');
                container.append($header);
                var j, armySection, k = getSortedData(data, function(a, b) {
                    return a.obj.name > b.obj.name ? 1 : -1;
                });
                for (j = 0; j < k.length; j++) {
                    var i = k[j].id;
                    v = data[i];
                    container.append('<div title="' + v.name + '" id="resources-' + i + '"></div>');
                    armySection = $('<div class="army-section" style="' + (meta.armySectionVisible ? '' : 'display: none;') + '"></div>');
                    armySection.append('<p>[<a href="#" data-action="removeVillage" data-options="' + i + '">remove village</a>]</p>');
                    if (v.units) {
                        var unitTable = $('<table style="width: 100%;"></table>');
                        unitTable.append('<tr><th style="width: 25%;">Def</th><th style="width: 25%;"></th><th style="width: 25%;">Off</th><th style="width: 25%;"></th></tr>');
                        unitTable.append('<tr><td><img style="height: 10px;" src="' + images.units.replace(/__unit__/g, 'spear') + '" /> ' + uc(v,'spear','atHome') + '</td><td>' + uc(v,'spear','total') + '</td><td><img style="height: 10px;" src="' + images.units.replace(/__unit__/g, 'axe') + '" /> ' + uc(v,'axe','atHome') + '</td><td>' + uc(v,'axe','total') + '</td></tr>');
                        unitTable.append('<tr><td><img style="height: 10px;" src="' + images.units.replace(/__unit__/g, 'sword') + '" /> ' + uc(v,'sword','atHome') + '</td><td>' + uc(v,'sword','total') + '</td><td><img style="height: 10px;" src="' + images.units.replace(/__unit__/g, 'light') + '" /> ' + uc(v,'light','atHome') + '</td><td>' + uc(v,'light','total') + '</td></tr>');
                        unitTable.append('<tr><td><img style="height: 10px;" src="' + images.units.replace(/__unit__/g, 'archer') + '" /> ' + uc(v,'archer','atHome') + '</td><td>' + uc(v,'archer','total') + '</td><td><img style="height: 10px;" src="' + images.units.replace(/__unit__/g, 'marcher') + '" /> ' + uc(v,'marcher','atHome') + '</td><td>' + uc(v,'marcher','total') + '</td></tr>');
                        unitTable.append('<tr><td><img style="height: 10px;" src="' + images.units.replace(/__unit__/g, 'spy') + '" /> ' + uc(v,'spy','atHome') + '</td><td>' + uc(v,'spy','total') + '</td><td><img style="height: 10px;" src="' + images.units.replace(/__unit__/g, 'ram') + '" /> ' + uc(v,'ram','atHome') + '</td><td>' + uc(v,'ram','total') + '</td></tr>');
                        unitTable.append('<tr><td><img style="height: 10px;" src="' + images.units.replace(/__unit__/g, 'heavy') + '" /> ' + uc(v,'heavy','atHome') + '</td><td>' + uc(v,'heavy','total') + '</td><td><img style="height: 10px;" src="' + images.units.replace(/__unit__/g, 'catapult') + '" /> ' + uc(v,'catapult','atHome') + '</td><td>' + uc(v,'catapult','total') + '</td></tr>');
                        armySection.append(unitTable);
                        unitTable.after(v.units.lastUpdate);
                    }
                    container.append(armySection);
                    container.append('<br />');
                }
                $('#toggle-army').click(function(e) {
                    e.preventDefault();
                    $('.army-section').toggle();
                    meta.armySectionVisible = $('.army-section').is(':visible');
                    saveMeta();
                });
                
                $('[data-command-id]', 'td').each(function() {
                    var cmdId = $(this).data('command-id');
                    if (cmdId in data[village].attacks) {
                        if (data[village].attacks[cmdId].distance > 0) {
                            $(this).closest('td').append('<span style="float: right;"><img src="' + images.units.replace(/__unit__/g, data[village].attacks[cmdId].unit) + '" title="spotted at: ' + (new Date(data[village].attacks[cmdId].spottedAt * 1000)).toLocaleString() + '" alt="' + data[village].attacks[cmdId].unit + '"/></span>');
                        }
                    }
                });
                if (!GM_getValue('mazaki.show_bar')) {
                    container.hide();
                }
            }
            
            var screens = {
                'train': function() {
                    data[village].units = {
                        lastUpdate: (new Date()).toLocaleString(),
                        data: {}
                    };
                    var trainForm = $('#train_form');
                    var unitLinkRegex = /UnitPopup\.open\(event, '([^']+)'\)/;
                    var unitCountRegex = /(\d+)\/(\d+)/;
                    $('tr[class^="row_"]', trainForm).each(function() {
                        var unit = unitLinkRegex.exec($(this).find('.unit_link').attr('onclick'));
                        if (unit) {
                            var count = unitCountRegex.exec($('td:nth-child(3)', this).text());
                            if (count) {
                                data[village].units.data[unit[1]] = {
                                    atHome: parseInt(count[1]),
                                    total: parseInt(count[2])
                                };
                            }
                        }
                    });
                    saveData();
                },
                'overview': function() {
                    var attackImgRegex = /command\/attack.png/;
                    var currentAttacks = {};
                    data[village].attacks = data[village].attacks || {};
                    $('[data-command-id]', '#show_incoming_units').filter(function() {
                        return attackImgRegex.test($(this).children('img').attr('src'));
                    }).each(function() {
                        var row = $(this).closest('tr');
                        var endTime = row.find('[data-endtime]').data('endtime');
                        var id = $(this).data('command-id');
                        var link = $(this).closest('a').attr('href');
                        var now = parseInt((new Date()).getTime() / 1000);
                        
                        currentAttacks[id] = {
                            endTime: endTime,
                            link: link,
                            spottedAt: now,
                            distance: 0,
                            unit: false,
                            travelTime: endTime - now,
                            coord: false,
                            village: false
                        }
                    });
                    
                    for (var a in data[village].attacks) {
                        if (a in currentAttacks) {
                            currentAttacks[a] = data[village].attacks[a];
                        }
                    }
                    data[village].attacks = currentAttacks;
                    saveData();
                    
                    $('td:not(:last)', '#show_units').each(function() {
                        var lnk = $(this).find('a');
                        var count = $(this).find('strong');
                        var unit = (/unit_(.*)\.png/).exec(lnk.find('img').attr('src'));
                        unit = unit[1];
                        if (unit in units) {
                            var count = parseInt(count.text());
                            $(this).css('position', 'relative');
                            lnk.on('mouseover', function() {
                               $(this).siblings('.tooltip').show(); 
                            });
                            lnk.on('mouseout', function() {
                               $(this).siblings('.tooltip').hide(); 
                            });
                            $(this).append('<span class="tooltip small" style="display: none; width: 140px; height: 25px; background-color: #d2c09e; position: absolute; top: 1px; right: 1px; text-align: right;"><img style="height: 10px;" src="http://dspl.innogamescdn.com/8.33.2/25392/graphic/unit/att.png" /> ' + numberFormat(units[unit].attack * count) + '<br /><img style="height: 10px;" src="http://dspl.innogamescdn.com/8.33.2/25392/graphic/unit/def.png" /> ' + numberFormat(units[unit].def.infranty * count) + '<img style="height: 10px;" src="http://dspl.innogamescdn.com/8.33.2/25392/graphic/unit/def_cav.png" /> ' + numberFormat(units[unit].def.cavalery * count) + '<img style="height: 10px;" src="http://dspl.innogamescdn.com/8.33.2/25392/graphic/unit/def_archer.png" /> ' + numberFormat(units[unit].def.archer * count) + '</span>');
                        }
                    });
                },
                'info_command': function() {
                    var reg = /\((\d+)\|(\d+)\) K\d+$/;
                    var regId = /id=(\d+)/;
                    
                    var attackId = regId.exec(window.location.href);
                    attackId = parseInt(attackId[1]);
                    if (typeof data[village].attacks == 'undefined' || (data[village].attacks[attackId] && data[village].attacks[attackId].distance > 0)) {
                        $('h2', 'table.main').append('<img style="margin-left: 10px;" src="' + images.units.replace(/__unit__/g, data[village].attacks[attackId].unit) + '" />').after('(spotted at: ' + (new Date(data[village].attacks[attackId].spottedAt * 1000)).toLocaleString() + ')');
                        return;
                    }
                    var v = $('tr:nth-child(3) .village_anchor a');
                    var d = $('tr:nth-child(5) .village_anchor a');
                    var id = regId.exec(v.attr('href'));
                    id = parseInt(id[1]);
                    var coord1 = reg.exec($.trim(v.text()));
                    var coord2 = reg.exec($.trim(d.text()));
                    var coord1 = {
                        x: parseInt(coord1[1]),
                        y: parseInt(coord1[2])
                    }
                    var coord2 = {
                        x: parseInt(coord2[1]),
                        y: parseInt(coord2[2])
                    }
                    var distance = Math.round(Math.pow(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2), 0.5) * 100) / 100;
                    if (data[village].attacks[attackId]) {
                        var attack = data[village].attacks[attackId];
                        attack.village = id;
                        attack.distance = distance;
                        attack.coord = coord1;
                        attack.speed = (distance != 0 ? (attack.travelTime / 60) / distance: 0);
                        var i=0;
                        while (i < speeds.length - 1 && speeds[i].s < attack.speed) {
                            i++;
                        }
                        attack.unit = speeds[i].u;
                        $('h2', 'table.main').append('<img style="margin-left: 10px;" src="' + images.units.replace(/__unit__/g, attack.unit) + '" />').after('(spotted at: ' + (new Date(data[village].attacks[attackId].spottedAt * 1000)).toLocaleString() + ')');
                    }
                    saveData();
                }
            };
            
            this.run = function(screen) {
                screen in screens && screens[screen].apply(self);
                render();
                updateResources();
            };
            
            this.data = function() {
                return data;
            };
        }
        
        $('body').prepend('<a id="toolbar-visible-btn" style="z-index: 15000; position: absolute; display: inline-block; background-color: #eee; font-size: 9px; left: 0px; top:0px;" href="#">[' + (GM_getValue('mazaki.show_bar') ? 'Hide' : 'Show') + ' toolbar]</a><div id="mazaki-container" style="width: 200px; bottom: 29px; overflow-y: auto; overflow-x: visible; font-size: 0.8em; background-color: #e3d5b3; padding: 5px; position: fixed; top:48px; left: 0;"></div>');
        $('body').append('<style type="text/css">.mazaki-progressbar-container {position: relative; width: 100%; height: 3px; background-color: #eee; margin-top: 1px;} .mazaki-progressbar {height: 3px;}</div>');
        var mzk = $('#mazaki-container');
        var currentScreen = (/screen=([^&?]+)/).exec(window.location.href);
        var app = new App(mzk);
        app.run(currentScreen && currentScreen[1]);
        $('#toolbar-visible-btn').on('click', function() {
            $('#mazaki-container').toggle();
            if ($('#mazaki-container').is(':visible')) {
                $(this).text('[Hide toolbar]');
                GM_setValue('mazaki.show_bar', true);
            } else {
                $(this).text('[Show toolbar]');
                GM_setValue('mazaki.show_bar', false);
            }
        });
        $('#menu_row .menu-item').last().after('<td class="menu-item"><a href="http://' + world + '.plemiona.pl/game.php?screen=welcome">Welcome</a></td>'); 
    });
})(window, jQuery);
