// ==UserScript==
// @name         SGWG Army
// @namespace    ui
// @version      0.1
// @author       Ondřej Jodas
// @match        http://sgwg.net/elitky.php?vyber=1
// @grant        none
// @description  zadost o armadu
// @downloadURL https://update.greasyfork.org/scripts/9693/SGWG%20Army.user.js
// @updateURL https://update.greasyfork.org/scripts/9693/SGWG%20Army.meta.js
// ==/UserScript==

$.widget('ui.army', {
    
    _create: function(){
        var self = this,
            element = self.element;
        self._shipyard = parseInt(self.options.mistaVLodenicich);
        self._barracks = parseInt(self.options.mistaVKasarnach);
        self._fillData(element.find('tr'));
        self._recalculate(element);
        $('.quantity').keyup(function(){
            self._recalculate(element);
        });
        $('#needArmy').click(function(){
            self._sendMail(element, $("#playerSelect").val());
            location.reload();
            return false;
        });
    },
    
    _fillData: function(rows) {
        var self = this;
        $.each(rows, function(key, row){
            var td1Element = $('<th></th>', {
                class: "title"
            }).html('Potřebuji');
            var td2Element = $('<th></th>', {
                class: "title"
            }).html('Možno');
            column = $(row).find("th");
            if (key > 0) {
                column = $(row).find("td");
                var place = place = parseInt($(column[7]).html()),
                    type = 'kasarna';
                if ($(column[2]).html() == 'orbitál' || $(column[2]).html() == 'obranná stanice' || $(column[2]).html() == 'těžký orbitál'){
                    type = 'lodenice';
                }
                td1Element = $('<td></td>', {}).html('<input class="quantity" type="text" data-key="'+key+'" data-name="'+$(column[0]).html()+'" data-place="'+place+'" data-type="'+type+'"; size="5" />');
                td2Element = $('<td></td>', {
                    id: "quantity-"+key
                });
                $(column[4]).html($(column[4]).html()+"<br />"+$(column[5]).html());
            } else {
                $(column[4]).html('Síla<br />HP');
            }
            column[3].remove();
            column[5].remove();
            $(row).append(td1Element);
            $(row).append(td2Element);
        });
        
        var playerSelect = $('<select>', {
            id: 'playerSelect'
        });
        $.get('/hraci.xml?rasa=30', function(xml){
            $.each($(xml).children().children().children(), function(key, player){
                var status = $(player).find('status').html(),
                    nick = $(player).find('nick').html();
                if (status == 'Ministr' || status == 'Vůdce' || status == 'Zástupce') {
                    playerSelect.append($('<option>', {value: nick, html: nick}));   
                }
            }); 
        });
        $(rows).last().after($('<tr></tr>').html($('<td></td>', {
            colspan: 10   
        }).html('Požádat o armádu hráče ').append(playerSelect).append(" ").append($('<input>', {
            type: 'submit',
            id: 'needArmy',
            value: 'Požádat'
        }))));
    }, 
    
    _recalculate: function(element) {
        self = this;
        var barracks = self._barracks,
            shipyard = self._shipyard;
        $.each($(element[0]).find('.quantity'), function(key, row) {
            var count = parseInt($(row).val()),
                place = parseInt($(row).data('place')),
                type = $(row).data('type');
            if (count > 0) {
                var needPlace = count*place;
                if (type == 'kasarna') {
                    barracks = barracks-needPlace;
                } else {
                    shipyard = shipyard-needPlace;
                }   
            }
        });
        $.each($(element[0]).find('.quantity'), function(key, row) {
            var inputKey = $(row).data('key'),
                place = $(row).data('place'),
                type = $(row).data('type');
            var freePlace = shipyard;
            if (type == 'kasarna') {
                freePlace = barracks;
            }
            $(element[0]).find('#quantity-'+inputKey).html(Math.floor(freePlace/place)+'x');
        });
    },
    
    _sendMail: function(element, nick) {
        self = this;
        var need = [];
        var i = 0;
        $.each($(element[0]).find('.quantity'), function(key, row) {
            var count = parseInt($(row).val()),
                name = $(row).data('name');
            if (count > 0) {
                need[i] = count + 'x ' + name;
                i = i+1;
            }
        });
        var message = "Ahoj prosím tě potřeboval bych:\n"+need.join("\n")+"\n\nDíky moc";
        var data = {
            antihack: self.options.antihack,
            typ_zpravy: 1,
            komu: nick,
            tema: "Armáda",
            co: message,
            kera: ''
        };
        
        console.log(message);
        console.log(need);
        $.ajax({
            type: "POST",
            url: "posta.php?write",
            data: data
        });
    }
    
});

$(function(){
    var antihack = $( "input[name='antihack']" ).val();
    var mista = $(".half1");
    var mistaVKasarnach = $(mista[0]).html().match(/Voln[\d\D]*\"\>([0-9]*)/);
    var mistaVLodenicich = $(mista[1]).html().match(/Voln[\d\D]*\"\>([0-9]*)/);
    $('.full').army({antihack: antihack, mistaVLodenicich: mistaVLodenicich[1], mistaVKasarnach: mistaVKasarnach[1]});
});