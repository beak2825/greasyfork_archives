// ==UserScript==
// @name         Ciudadelas Deluxe
// @namespace    http://ciudadelas.net/
// @version      0.2
// @description  It's better then best!
// @author       ogur
// @match        http://ciudadelas.net/games/game/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8571/Ciudadelas%20Deluxe.user.js
// @updateURL https://update.greasyfork.org/scripts/8571/Ciudadelas%20Deluxe.meta.js
// ==/UserScript==

$(function(){
    
    var Game = {};
    
    Game.init = function(){
        var $style = "<style>"+
            "div#gamelogs {width: auto!important;}"+
            ".main-board {float: right;width: 60%;}"+
            "section.not-game {float: left; width: 40%;}"+
            ".player-hand td {display:inline-block; }"+
            "</style>";
        $('head').append($style);
        
        Game.Id = location.pathname.split('/').pop();
        Game.BoardHref = 'http://ciudadelas.net/games/game/id/' + Game.Id;
        Game.LogHref = 'http://ciudadelas.net/index/rs-commands/command/get_gamelogs/id/' + Game.Id;
        Game.Player = $('#right strong').text().trim();
        Game.CurrentPlayer = $('#main-game h3 em').text().trim();

        Game.timer = setInterval(function(){
            Game.getCheckLog();
        }, 5000);
        localStorage.setItem('lastNotifiedPlayer', '');
        if(!localStorage.phase){
            localStorage.phase = '';
        }
        
        
        $('.not-game').children('br').remove();
        var $notGame = $('<section>', {class: 'not-game'});
        $('#main-game').prepend($notGame);
        $('#main-game > *').not($notGame).each(function(i, element){
            if(!$(element).find('#game').length){
                $notGame.append($(element));
            } else {
                $(element).addClass('main-board');
            }
        });

        toggle_hidden('gamelogs');

        Game.$actions = $('<section>', {class: 'game-actions'});
        $('.toolt[href^="/games/notes"]').after(Game.$actions);
        Game.$actions.nextAll('*').each(function(i, element){
            Game.$actions.append($(element));
        });
        $('.game-actions > div strong:contains("Hand")').nextAll('table').addClass('player-hand');
        
        Game.$actions.on('click', 'a', function(event){
            var $a = $(this);
            Game.getReloadGame($a.attr('href'));
            Game.reloadLog();
            event.preventDefault();
            return false;
        });
        
        if(Notification.permission !== "granted"){
            $('#left ul').append($('<li>&nbsp;</li>'));

            var $notificationButton = $('<li><a>Włącz powiadomienia</a></li>');
            $('#left ul').append($notificationButton);
            $notificationButton.click(function() {
                Notification.requestPermission();
            });
        }
    };

    Game.reloadActions = function(data){
        var startAppending = false;
        Game.$actions.html('');
        $(data).find('#main-game > *').each(function(i, element){
            if($(element).find('#game').length){
                startAppending = false;
            }
            if(startAppending){
                $(element).appendTo(Game.$actions);
            }
            if(typeof $(element).attr('href') !== "undefined" && $(element).attr('href').search('/games/notes') !== -1){
                startAppending = true;
            }
        });
        $('.game-actions > div strong:contains("Hand")').nextAll('table').addClass('player-hand');
    };
    
    Game.getReloadActions = function(href){
        if(typeof href === "undefined"){
            href = Game.BoardHref;
        }
        $.get(href).success(Game.reloadActions);
    };
    
    Game.getReloadBoard = function(href){
        if(typeof href === "undefined"){
            href = Game.BoardHref;
        }
        $.get(href).success(Game.reloadBoard);
    };
    
    Game.reloadBoard = function(data){
        $('.main-board').html($(data).find('#game').parent().html());
        $('h3').html($(data).find('h3').html());
        
        var roundNumber = $('h3').html().match(/\. *([0-9]+)/)[1];
        Game.CurrentPlayer = $('#main-game h3 em').text().trim();
        
        if(localStorage.getItem('lastNotifiedPlayer') !== (localStorage.phase + roundNumber + Game.CurrentPlayer) && Game.CurrentPlayer === Game.Player){
            localStorage.setItem('lastNotifiedPlayer', localStorage.phase + roundNumber + Game.CurrentPlayer);
            Game.showNotification(Game.Player + ' twoja kolej!', 20000, {icon: 'http://dominion.frenopatico.net/images/dominion/en/card28.jpg', getFocus: true}); 
            Game.soundNotify.play();
        }      
        
    };
    
    Game.getReloadGame = function(href){
        if(typeof href === "undefined"){
            href = Game.BoardHref;
        }
        $.get(href).success(Game.reloadGame);
    };
    
    Game.reloadGame = function(data){
        Game.reloadBoard(data);
        Game.reloadActions(data);
    };

    Game.reloadLog = function(){
        $.get(Game.LogHref).success(function(data) {
            $('#gamelogs').html(data);
        });
    };

    Game.getCheckLog = function(){
        $.get(Game.LogHref).success(Game.checkLog);
    };
    
    Game.checkLog = function(data) {
        $('#gamelogs').html(data);
        Game.checkUpdates();
    };
    
    Game.checkUpdates = function(){
        var logsHtml = $('#gamelogs').html().split(/<br\/?>/i);
        var lastItem = "";

        $.each(logsHtml, function(i, item) {
            if (item === "") {return;}
            lastItem = item;
        });

        var lastItemObj = {
            date: lastItem.match(/<strong>(.*?)<\/strong>/i)[1],
            msg: lastItem.split('</strong>: ')[1],
            icon: ''
        };
        

        if(typeof localStorage.lastMsgProcessed === "undefined"){
            localStorage.lastMsgProcessed = lastItemObj.date;
        }

        if (Game.parseDate(localStorage.lastMsgProcessed) < Game.parseDate(lastItemObj.date)) {
            lastItemObj.icon = Game.matchIcon(lastItemObj.msg);
            localStorage.lastMsgProcessed = lastItemObj.date;
            Game.showNotification(lastItemObj.msg, 5000, {body: lastItemObj.date, icon: lastItemObj.icon});
            $.get(Game.BoardHref).success(Game.reloadGame);
        }
    };
    

    
    
    Game.matchIcon = function(msg){
        if(msg.search('gold') !== -1){
            return 'http://ciudadelas.net/images/ciudadelas/monedas.jpg';
        }
        if(msg.search('Choose Character phase') !== -1){
            localStorage.phase = 'character' + $('h3').html().match(/\. *([0-9]+)/)[1];
            return 'http://ciudadelas.net/images/ciudadelas/crown.jpg';
        }        
        if(msg.search('Crown') !== -1){
            return 'http://ciudadelas.net/images/ciudadelas/crown.jpg';
        }               
        if(msg.search('takes a card') !== -1){
            return 'http://ciudadelas.net/images/ciudadelas/card0.jpg';
        }
        if(msg.search('Districts phase') !== -1){
            localStorage.phase = 'district' + $('h3').html().match(/\. *([0-9]+)/)[1];
            return 'http://ciudadelas.net/images/ciudadelas/card0.jpg';
        }
        if(msg.search('reveals') !== -1){
            var character = msg.match(/.*?reveals the (.*?)\./)[1];    
            return 'http://ciudadelas.net/images/ciudadelas/character'+Game.characters[character]+'.jpg';
        }
        if(msg.search('chooses a Character') !== -1){
            return 'http://ciudadelas.net/images/ciudadelas/character0.jpg';
        }
        if(msg.search('builds ') !== -1){                 
            var district = msg.match(/.*?builds (the|a) (.*?)\./i)[1];            
            return  'http://ciudadelas.net/images/ciudadelas/'+Game.districts[district];
        }
        return '';
    };
    
    Game.parseDate = function(date){
        var dateParts = date.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/i);
        return new Date(dateParts[3], dateParts[2], dateParts[1], dateParts[4], dateParts[5], dateParts[6], 0);
    }
    
    Game.showNotification = function(title, duration, options){
        var notification = new Notification(title, options);        
        if(typeof options.getFocus !== 'undefined'){ 
            notification.onclick = function(){window.focus();};
        }
        if(duration !== 0){
            notification.onshow = function (){setTimeout(notification.close.bind(notification), duration);};
        }
    };
    
    Game.districts = {
                "Domain": "card19.jpg",
                "Castle": "card18.jpg",
                "Palace": "card21.jpg",
                "Temple": "card9.jpg",
                "Church": "card2.jpg",
                "Monastery": "card23.jpg",
                "Cathedral": "card8.jpg",
                "Tavern": "card6.jpg",
                "Store": "card11.jpg",
                "Market": "card20.jpg",
                "Warehouse": "card26.jpg",
                "Harbour": "card27.jpg",
                "Town Hall": "card24.jpg",
                "Watchtower": "card12.jpg",
                "Prison": "card14.jpg",
                "Barracks": "card16.jpg",
                "Fortress": "card17.jpg",
                "Imperial Treasure": "card28.jpg",
                "Miracle Courtyard": "card15.jpg",
                "Keep": "card13.jpg",
                "Lighthouse": "card35.jpg",
                "Powderhouse": "card37.jpg",
                "Museum": "card40.jpg",
                "Poorhouse": "card34.jpg",
                "Tower Bell": "card41.jpg",
                "Workshop": "card39.jpg",
                "Quarry": "card30.jpg",
                "Map Room": "card32.jpg",
                "Fountain of Wishes": "card29.jpg",
                "Observatory": "card22.jpg",
                "Laboratory": "card7.jpg",
                "Factory": "card25.jpg",
                "Graveyard": "card4.jpg",
                "Library": "card1.jpg",
                "School of Magic": "card10.jpg",
                "Ball room": "card38.jpg",
                "Park": "card36.jpg",
                "Hospital": "card33.jpg",
                "Great Wall": "card31.jpg",
                "Throne Hall": "card42.jpg",
                "Dragon Gate": "card5.jpg",
                "University": "card3.jpg"
            };
    
    Game.characters = {
                'Assassin': 1,
                'Thief': 2,
                'Magician': 3,
                'King': 4,
                'Bishop': 5,
                'Merchant': 6,
                'Architect': 7,
                'Warlord': 8,
                'Queen': 9,

                'Witch': 11,
                'Tax Collector': 12,
                'Wizard': 13,
                'Emperor': 14,
                'Abbot': 15,
                'Alchemist': 16,
                'Navigator': 17,
                'Diplomat': 18,
                'Artist': 19
            };

    Game.init();

    Game.soundData = "UklGRi4vAABXQVZFZm10IB4AAABVAAIARKwAACBOAAABAAAADAABAAIAAAAKAgEAcQVmYWN0BAAAAAAAAABkYXRh8C4AAP/7oAAAAAKtMb9p5VrQUkU3/WFlWg4CD0HsFU3Bk8HoPPCduBW2k1GU42SB8qQ70wdpciJHWWNUOwwNBAOBAOdnI1Tz0b3dnT///6+38V/HX8TbGtc1zTYkjqDgkBPHQS0FYrZT4mGr0A2FyBsB7tRMw9D93XQad6dCskkZrTcbSIyuvU0VnylKPxEUWWLDSQWuDgEcEQd5ITn9k3HU7PmKYf6370V3Z9GW/oyu5BMYIiQdBgQCB8VIHyhNUm9FBtLN+g2Ef6O9PbKLNVmKRiQBXbDTSLgMQeSZZe1iVwVDjIzGsIfWx6oDgf/kZ/yKd//nP//0bPPKBcDQLsVgCg4Yv/oYropk8fn6KPG/ssz5hhhjf///5hhhh5Ix57mEYtkA/ObmVZX/bkZP3MMX//9DP//5naef9GuhlS9ZTkQgrzUw00iWwhBwHe0lsX0KVhMCkHrfTXqpWDASf7JH/5If//8888blABBY//+lT0cwfEsox6KNGf/1fQ8+Y3////MMmE0MMaYYODc5v6N/mKN38wz//+hn///5kxj3zz/qXLDlIQKQ3qBEklJDj/fEqlSeFyFYgv/kMP+0upjA/+GZf//1KiqSmBcBQCBAS//6nKaVPJzTmZif/9Waexh8d////+cpxKxOaSHjIkD0//s5y2ZCmMpFTv+W///XQZDCBAG9MIkEq4f/6P/7ogA0gALfYVN54VNoXswqXzxKbQ49k0vMIa2hrjJpOYOptEE4U6IXUAmZr/+cR/1/PQiP/7sn//+aPSUQITwHxDANJ//opARIpc4053J//+9z8v////1NnFiAjJRsLZgvOBkn/0nm0cuTrURjNTv+W//97FUyoIkion5FK0Fv2VsOSsAPTq0MHF6RI743G42H4SB4AuAuC8P7QUFDH4RErlFFo5e///f///7TIT4phFAWP//3PkA6hSTLDUof/6knTNy6Tyl/+r//+kkmaGZEMRkGJH//pOtTG8iuqqZt/53//yyAsap1QhIUM7yFFoLnsrXMtQEvNZ0AcXqMEVruy+ndSw3G43J0MMMPzDG8QCj/+b///WyHjEFwAWAJX//1IxPKkk4hJkGjf/9S55cqTf/p///Q4qWKiDOJx6H//5rKcYhIoe2MWRm/+d//6yrDiKBaqTdabSja7WGqA3gNVvrMZmrT2T25SJCoFM5RERKVmKUraI9QdDPr+ptv+cnXR2kcF4DRT//84TRRzgvyH//80sK5N//////RAuxACd//5xEP4kVAV//T//+kjqSinJZIGGkofUFZysLeBTXmq2YkVRU2f4mCIqaUpSlsUpW0fQT//t///01TAkheB3f//rRNiN0Cw7//9bGxi//////rU5NGOYD4Qv/+tIxaOzDwb/9///5iMlL/+6AAXAAC5WFT0wVTZFksOn1grW0MHZFPrK4tkYGyajWENbJJttutttMBaM7KfbgHH40yWU8sQLeyHKe0JVWtN1DhueNGlz7Qp9sl78jc///+z3qXUh6vetbWL4/gNlF//9XK5n1mpt///MiHv/+r///S7mRPD6Nv//yyZEX6pz/rRYUkk225m4214s8cFLuGDThxIYr0gVERAw3kFVmXintJOe0p+u5b////hvvZdqv/VSTMAKYLSzf//QEsMeTh3jKf//+Yv/////qX0xPRkBAJbpf/1j4ajDtWYMVf////kYyopNdbu22lNrqVtZAmMcnIskuVXiQrYqj1vK0odgdPAIicHwcoAlLybYsl5UcuGTZ7A6mPmeteuVz97P3q0qPbV/RWjMlDFAxjn//1LLhCfnSz//+cTLf/////V1pjU3//6y4z3l//Z///RyzX7brbbUfU2XK0hUxvYpBOy3iwqZbZonFX2JiFABkPCYQngsjFMjKz0MEU2UoyavJeNZ///eelRum1r/qTWxisewKYbP//9RuW+MZv//6ya//9v//7qqWwqj4e///Mkyi8gf/////DjqJMas7xvxLa0xBwYIYWrIZnSLCXYpOBUTZrCM8gIwQBu5roX4BA1m7Z6AWt6eZPGX//r1LPmyaCYaKAOo0S0//6muTwcmQ47Y1Ictv/S3Wt4zz/+6IAk4ADXWFT6yxraGjMOnplLWyN2ZFH7apNobjB6PGlSb5ABpf/3///pIOufHWHEEt///LJKIdAw/8j///LRgopyQ8VQZw3GCGfvgY+U5FWWPSOF4bgTuAU5KTnn78Cob/yoKL/9FKlv//6luXS6SgfwBazyf/9umREchFaBqLJGx/+rZ0ESVHIIVv/qf//7UkrnHGdFTJZbf/+olBfIO1M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gAg49q+tzVpPlckn//3v+pdv/oer////1qdX///1JmTGzPckAALO+9GtjSOJpGH2rh6WogYGtUU1A/Ak4jwRgxHw0GFWVG1SZgfWnZFSlmQwaCSbNb9X//60E1McNhmEwJU1S//qc+kdJITNKTBDhJRgD3tsdEBAWAfFelS62FiHIKVX9M2fEpCzNG+9h0N6xf6wjZ//ij//rBAzHkSk5G3EiQGns9x4ytdFptQGS/6q8JqTymQ3AmzqboqPFpPNFPpqbQWs1MH1o9fX9/vV9FkDGfLBLQQJij//7LNBkIOtEB1g7P+8LcMlJfqOpanH4J8Jam3+g2SgnB3+ON////+//+TsjJJkjcrRIDrpV53/+6AAt4AEB4LQewqLeHoJyh89rW0NDTVFrLWtsaamqPWGtbZZ12KNXIZWNoey/7qWiIKlAKkNBaZpH6DJGRxlzOp0TVXey2autuyftq9aBfMFrGKO8JoF6Z///U5sJ065mHkz/rrLoKeKDa7JG7+oLsh/1+UyQO/raT/9///3//qSjLIhI3h/+PbEJAuVp7SnAaXmVAA/coSVi9BIFCAFcBHHh4oliA0iNEsXjbVOmaqjEui+plLMjdbrpVmSP/+ykEjIolY0UPgioQAnguf/+ifYcRu6zAh4gAG+t+pa4n0KhbZfUnqzhDBzD/+j5Exrkx//WzJX///po/////+tD////UfQQzUIAAqz232NkLmZVLsY7GadVASfx5VC8bhUSDcBUGgVgtw3jxihNzrDlMSg60jQ2c4cVU6Rx2+tvfWi36S5QJxOKj4kgfAcZGS/13ay1rTHqOJbRjgGGF8/6ZOCpArp5JlorTQP1LTMhiCi/+mmlWUBK3//rW//////////pIf///3lNlXmEEVV4e7DWNAhxCC9GWki5rI6w1UFlESLirRdwQZACoOwiQ4BYSLilS8ZOV3pmB9WpRimZtXfUteaN//rWggZFcmyiopLE/gOpil/qruupBIhg7jSgXBBQdj/TegsZcgrv7vq0hxks6v7Jn1LICOaRW//9P/////////1r///+6IAxAAEJYJPew2DeIUwSb9hrW9QRgc5584t6dkmp/T2ybL//5hO5miVJJJbJGGchj+iyQdOHGDmSAIQxvkCsA1gAJx3jeGYTccLHmSTMU0jbezkucXrWbG3qrbZd9VkU2ao4smzYuk+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YpmhqWBbwJqCYHmi39v9FiHokmIwUW/1GBYOP+v5xE1//2KT/1Pbko3W2CyMCXwO7MdkrgDI14l6YeUSIpZvuWSEbJmwRN4yZVblV6IvA0Wqfz8vy5+GfKTfc/y11bu//+qu7IGyZKoEQBmLb9fv6rqpk+yqA5I7W/VlgvEYW/rb8h5n+DKM8IJLDNtR7YRF31wlVLEm4MVFguQh0rTvkYwKoJoIPAu45AZeFLl5zqR8tMmb3Lq1qf/7ogDGAATOTcrrFItgX+mpTWHtbAwJEyesZiuBjyalfYlBsGRc/Wgicbupdv/9TNSNzUzLY5xBRZYMzJv/+tJSyILpsMYm3v41Eykn+z+kOs0//1GARXgzYUdtqNZCJuK/buuEqqisiXVIcCIJrbvjyqMonLAkMajNAwx5pmZ5r8Medx1vCo++P773n9H//1arnmNEjgDfHZ//7rZZxHSYt/7nBPzFX7/USCL/wp/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ksOhkbs1tGkYEbcegWsSYcALoHmbAA4FD2ZDuPQHnXtTOKyWU75dqzFLVz7v8eYferd//z4pVfb//tuiaIpkUkR5g4QE6zf/+o+o11ogtpu//Jwyk/6/rNDv6jBs8OiJDrdRrGRR6lXKeQr4QDhYJlAVoQoj6s4YWMLHAm7jsBwSk4enn1gGtz/3vn//+iSSlITv9T//+nugmuTxzIgQEcv//+j1F4vO8izXxE/+ETLaA642xEiAqrO1SpUoTongOINSEmBeG5gAzwyQBeDXAtA//+6AA2oAHG0VK+zlq4FvImU8/DVwKZNsr7OWrQUqipDT4tXCFAipkpOUzpopdkqOUD3p+1Jb//6uki6CBfLoQIFCQb//7pF/TQEuv/1Egh/W/yc4uWgGxtoRIgTri+7vRPFsAQieiFA6TAgYKEBCoBW5aFzkkLEPRBi+eLSl2opapiat01f3//9etjMuMYlMfQAEjb///N+owN2/6jBF/4B////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MmhKskgEaIFfs5HdzTdkQC0rDRVZQ0vKAUYOeAqceSFDG5eLrNNTxip7VKdGTZ6kktP////UitkjJEcY5QKq//b/WlrYcZp/83N3v/JPraBhGBXoLFinsO9P0iL5YmRFIYI7BRYxwE1FccZFSYY85aQZqlV9bLb////+66eTzosQHb///rX1E8MepH9P9IcqANb+MkNdzzrSOAoBQiVtKt3dT/+6IA2wAInD1IafNq4EqHqR1ibVwIdNkrrE2rQRkipDGJqXASAUGCFIDehQYlMUINAiR5F6qkmVXoIlPd1qb///+j2aMIeBF///mlugiC3/qyf/1Kmi5Mm5HYcgSM7LuNSqlJ4AMgkU6TwgKAUId8DKBkR6JEwRJk1ROo6l3822v////+1B8VhEW////mEflHflv////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////LuqK0kgEDIH3+fhFYEYSXAgECVIh3tloCRJ8JK1eMtVppMtbx3/ce/nrmOfLXf/97////57VNHxWBgm///7coDs//5f+sKS6WRmGIFd18fNFS/BRAIJeiqOEGwcsDJJw9QnhpmZ06mkg7f9BLdP////TWo7iP//9fhn/M/yZk3SWkEAgRAzjO//ugANqACWo2yGHyOtBFh5ktYwdcBwTZIYfQS0DolGS0/J0o7cgLGAWknL6DyV6IFp1VAWzGEgH+d+k7++f3WX/oPNTb////rziijIX//SZ+t34iDklrjBhgBnzLU3jcna0vGTvwUAwmDZkNeAxSFHJ80Lhq60f/zjfv////92saPhv///R/I////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////l3ZOVwQCBEDtnPCWyuMLnUCZsWJFrImQN8BCiAzo0aZ4QcRYq9mSST/oTbzv///+tjkQ8KgM/++Wf8K/0F2XbSAgQApmyTHWgXiG1m61EGVkCkp0MSLs7RZ7ufj////sT////uiANsACp8pSGMUOtA8xSkdZodaBXijI4RkqWCthaT0HOSQ///6tdzBhl2umkEAgSA4RDnZFcgQw8B5h/4ALLv8HnPPFochy/Q9XW3//11Av//K/jgiXbW0AEAFOx5VwGq0FAdVkZEMsQbVilS1nhhl3X//////////+YG////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////DltvoBhiBe7cmIQ9FgrMUUjJi1RRQgdOxJx6N+bPP//////1f6/////vkDCv/4eAEltkBAgB+V1DQsuE/kRGKA1oTgCIkwxsbsv/7oADagAtaKMng+SpYL0UZHC8iSgS8oyOCyElgkRRkbLoVLEzof/n//////alxIcll0YCDq3vNUtEHwkjDQS8wcmK0AUqjeOU0X/////////zACAAU2yR02ShQoutgQipiOUZ2rzf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////gpKuIAIN3VoCjCgYheFmzRMTYEIAAoORJZeS//////7oADbAAy/CcYgDMEqJCUY2xaCSgK8JxiAJeSAUIUjkBfglP////5kAgASmyB6yhlzAkwuRTRXovMM////6SQKTjiA3CHOrtQOIVtnkN1gw0jv2QAAAgBkgFm5GgjJV//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7ogDbAA5WCUUgAYkoDMEotAFpJQEcIRqABESoHoBjEAAABP///////////////////////////AAKJAH24CyXs8H4JoAAKSIHIWgoM0AACSAPnSwl////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+6AA2oAPKABLgAAACAAACXAAAAEAAAEuAAAAIAAAJcAAAAT///////////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    Game.soundNotify = new Audio("data:audio/wav;base64," + Game.soundData);
    
});
