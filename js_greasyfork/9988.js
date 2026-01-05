// ==UserScript==
// @name LabaBot+BSH
// @description Бот для лабы Fcity.su  - медленный  + БСХ
// @author Catchme
// @license MIT
// @version 1.0
// @include http://www.fcity.su/*
// @namespace https://greasyfork.org/users/10566
// @downloadURL https://update.greasyfork.org/scripts/9988/LabaBot%2BBSH.user.js
// @updateURL https://update.greasyfork.org/scripts/9988/LabaBot%2BBSH.meta.js
// ==/UserScript==
// [1] Оборачиваем скрипт в замыкание, для кроссбраузерности (opera, ie)
(function (window, undefined) {  // [2] нормализуем window
    var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }
    // В юзерскрипты можно вставлять практически любые javascript-библиотеки.
    // Код библиотеки копируется прямо в юзерскрипт.
    // При подключении библиотеки нужно передать w в качестве параметра окна window
    // Пример: подключение jquery.min.js
    // (function(a,b){function ci(a) ... a.jQuery=a.$=d})(w);

    // [3] не запускаем скрипт во фреймах
    // без этого условия скрипт будет запускаться несколько раз на странице с фреймами
    if (w.self != w.top) {
        return;
    }
    // [4] дополнительная проверка наряду с @include
    if (/http:\/\/www.fcity.su/.test(w.location.href)) {
        //Ниже идёт непосредственно код скрипта
     
        
        
        
        $(document).ready(function () {
    var el = document.createElement("frame");
    el.id = 'plugin';
    el.name = 'plugin';
    //el.style.width = "100%";
    el.src = 'refreshed.html';
    $('frameset[rows="37, *, 30, 5"]').attr('rows', '32, 37, *, 30, 5').prepend(el);

    var doc = null;
    if (el.contentDocument)
        doc = el.contentDocument;
    else if (el.contentWindow.document)
        doc = el.contentWindow.document;

    doc.write(
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
        '<html><head><style type="text/css"> body { background-color: rgb(226, 224, 224); } INPUT { BORDER-RIGHT: #b0b0b0 1pt solid; BORDER-TOP: #b0b0b0 1pt solid; MARGIN-TOP: 1px; FONT-SIZE: 10px; HEIGHT: 23px; MARGIN-BOTTOM: 2px; BORDER-LEFT: #b0b0b0 1pt solid; COLOR: #191970; BORDER-BOTTOM: #b0b0b0 1pt solid; FONT-FAMILY: Arial } </style><script type="text/javascript">var autopilot = false; function autopilotEnable() { if (autopilot) { autopilot = false; document.getElementById("autopilot_enable").value = "Старт"; } else { autopilot = true; document.getElementById("autopilot_enable").value = "Стоп"; }   }</script></head>' +
        '<body bgcolor=#e2e0e0><nobr><img src="http://www.fcity.su/i/klan/Eon.gif"><input type="button" id="autopilot_enable" name="autopilot_enable" value="Старт" onclick="autopilotEnable();" /> Бот для Лабиринта + БСХ Fcity.su &copy; Catchme</nobr></body>' +
        '</html>');

    function round(value, precision, mode) {
        var m, f, isHalf, sgn; // helper variables
        precision |= 0; // making sure precision is integer
        m = Math.pow(10, precision);
        value *= m;
        sgn = (value > 0) | -(value < 0); // sign of the number
        isHalf = value % 1 === 0.5 * sgn;
        f = Math.floor(value);


        if (isHalf) {
            switch (mode) {
                case 'PHP_ROUND_HALF_DOWN':
                    value = f + (sgn < 0); // rounds .5 toward zero
                    break;
                case 'PHP_ROUND_HALF_EVEN':
                    value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
                    break;
                case 'PHP_ROUND_HALF_ODD':
                    value = f + !(f % 2); // rounds .5 towards the next odd integer
                    break;
                default:
                    value = f + (sgn > 0); // rounds .5 away from zero
            }
        }

        return (isHalf ? value : Math.round(value)) / m;
    }

    var flag = true;
    var documentUrl = '';
    var unixtimestampStart = Math.round(+new Date()/1000);
    var playerName = '';
    var playerLevel = 0;

    setInterval(function(){
        if (top.frames['plugin'].window.autopilot) {

            var unixtimestamp = Math.round(+new Date()/1000);

            top.frames['main'].frameElement.contentWindow.confirm = function(message) {
                var output = false;
                if (message == 'Использовать сейчас?') {
                    output = true;
                }
                else {
                    output = confirm(message);
                }
                return output;
            }

			  top.frames['main'].frameElement.contentWindow.confirm = function(message) {
                var output2 = false;
                if (message == 'Атаковать этого монстра?') {
                    output2 = true;
                }
                else {
                    output2 = confirm(message);
                }
                return output2;
            }
			
			
			  top.frames['main'].frameElement.contentWindow.confirm = function(message) {
                var output2 = false;
                if (message == 'Купить 1 Бот-атаку за 0.15 кредит?') {
                    output2 = true;
                }
                else {
                    output2 = confirm(message);
                }
                return output2;
            }
			
            var mainFrame = top.frames['main'].document;
            var battle = $(mainFrame).contents();
			// Is main page?
            battle.find(':contains("Активных жителей")').each(function() {
                battle.find('input[value="Поединки"]').click();
				});
				
			 // Is battle splash?
            battle.find(':contains("Выберите раздел")').each(function() {
                mainFrame.location.href = 'http://www.fcity.su/zayavka.php?level=group&' + Math.random();
			});

			         

			// выбор заявки
			battle.find(':contains("бой начнется через 0")').each(function() {
			battle.find('input[name="open1"]').each(function() {
			battle.find(':contains(" против 50(2-50)")').click();
			battle.find('input[value="Принять участие в мясорубке"]').click();
              });
			  });
			
			battle.find(':contains("бой начнется через 1")').each(function() {  
			battle.find('input[name="open1"]').each(function() {
			battle.find(':contains(" против 50(2-50)")').click();
			battle.find('input[value="Принять участие в мясорубке"]').click();
              });
			  });  
			  battle.find(':contains("бой начнется через 2")').each(function() {  
			battle.find('input[name="open1"]').each(function() {
			battle.find(':contains(" против 50(2-50)")').click();
			battle.find('input[value="Принять участие в мясорубке"]').click();
              });
			  });  
			   battle.find(':contains("(Бой с силами Хаоса")').each(function() {
			battle.find('input[value="Вернуться"]').click();
			mainFrame.location.href = 'main.php?setch=1';
            });
			  
			   battle.find(':contains("На данный момент подходящих заявок нет.")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
                 battle.find(':contains("бой начнется через 14")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
                 battle.find(':contains("бой начнется через 13")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
                 battle.find(':contains("бой начнется через 12")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
                 battle.find(':contains("бой начнется через 11")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
                 battle.find(':contains("бой начнется через 10")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
                 battle.find(':contains("бой начнется через 9")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
                 battle.find(':contains("бой начнется через 8")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
			     battle.find(':contains("бой начнется через 7")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
			  
			     battle.find(':contains("бой начнется через 6")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
			     battle.find(':contains("бой начнется через 5")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
			  	   battle.find(':contains("бой начнется через 4")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
			  
			     battle.find(':contains("бой начнется через 3")').each(function() {
				//battle.find('input[value="Вернуться"]').click();
				mainFrame.location.href = 'main.php?setch=1';
              });
			    
			  
			battle.find(':contains("Вы находитесь в другой заявке на бой!")').each(function() {
            mainFrame.location.href = 'http://www.fcity.su/zayavka.php?level=group&' + Math.random();
			 });
			
			            // Is group battle application?
            battle.find(':contains("На чьей стороне будете сражаться?")').each(function() {
                battle.find('input[name="confirm2"]').click();
            });

            var fire = false;
            battle.find(':contains("Ваш ход")').each(function() {
                // img[alt*="Отравление [2]"]
                // img[alt*="Каменный Дождь [4]"]
                if (fire == false) {
                    var magicScroll = battle.find('img[alt*="Пожирающее Пламя"], img[alt*="Отравление"], img[alt*="Цепь Молний"], img[alt*="Каменный Дождь"]')[0];
                    $(magicScroll).parent().click();
                    fire = true;
                }
            });

			
			
			       // На стартовой? -  к заданиям
           // battle.find('#spisok').each(function() {
             //    mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php?&zad=1';
            //});
        			
               // На стартовой? -  в комнаты
			// battle.find(':contains("Активных жителей")').each(function() {
              //  mainFrame.location.href = 'main.php?setch=1';
               //}); 
			   
			   // переход в зал светлых
			 battle.find('input[name="room16"]').each(function() {
                $(this).click();
            });   

			// к заданиям 
			battle.find(':contains("Зал Светлых")').each(function() {
			
             mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php?&zad=1';
            });
			
				// Нет задания? взять
             battle.find('input[name="gokw"]').each(function() {
                $(this).click();
            });
			
				// Выбор квеста
            battle.find(':contains("подарков")').each(function() {
              mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php?otkaz=1';
			});
			  battle.find(':contains("подарков")').each(function() {
              mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php?otkaz=1';
			});
			  battle.find(':contains("записок")').each(function() {
              mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php?otkaz=1';
			});
			 battle.find(':contains("ножей")').each(function() {
              mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php?otkaz=1';
			});
            battle.find(':contains("Убить")').each(function() {
              mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php?otkaz=1';
			});
            battle.find(':contains("Расставьте")').each(function() {
              mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php?otkaz=1';
            }); 
				
				
				// с заданием переход в лабиринт
			battle.find(':contains("жемчужины")').each(function() {
			
                mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php';
			});	
				
				
				
			
			
			
            	// если нет свитков возврата - покупаем
			battle.find(':contains("Свитков оздоровления: 0")').each(function() {
			   battle.find('input[name="buyheal"]').click();
			//   mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php';
			 
            //   mainFrame.location.href = 'http://www.fcity.su/quests.php?new=1';
				  }); 
            

				// входим в лабиринт
			battle.find(':contains("Свитков оздоровления: 1")').each(function() {
			   battle.find('input[name="start"]').each(function() {
                $(this).click();
				 }); 
            });
			
				battle.find(':contains("Свитков оздоровления: 2")').each(function() {
			   battle.find('input[name="start"]').each(function() {
                $(this).click();
				 }); 
            });
										
				// покупка атаки
		//	 battle.find(':contains("Бот-атаки: 0")').each(function() {
			//	mainFrame.location.href = 'http://www.fcity.su/lab.php?buykill=1';
             //});	
			  //battle.find(':contains("Бот-атаки: 1")').each(function() {
			//	mainFrame.location.href = 'http://www.fcity.su/lab.php?buykill=1';
            // });
			// battle.find(':contains("Бот-атаки: 2")').each(function() {
			//	mainFrame.location.href = 'http://www.fcity.su/lab.php?buykill=1';
			//});
			
			
			   battle.find(':contains("У вас нет свитков атаки!")').each(function() {
				battle.find(':contains("[купить]")').click();
				//mainFrame.location.href = 'http://www.fcity.su/lab.php?buykill=1';
             });
			 
			//если нет мобов и чеков- идем вправо
				battle.find(':contains("Мобы:Ресурсы:")').each(function() {
					//battle.find(':contains("Ресурсы:Задание:")').each(function() {
			 mainFrame.location.href = 'http://www.fcity.su/lab.php?go=p2';
             });
			   //  });
			
				 
			// Чек
				//battle.find(':contains(" добл.")').click();
				//battle.find(':contains(" кр")').click();
				//battle.find(':contains("[Обналичить чеки на")').click();
				
				//battle.find(':contains("[Обналичить чеки на кр]")').each(function() {
				//		  var href = document.getElementByName('nal1').href;
				//	mainFrame.location.href = href;
				//}); 
         
				//battle.find(':contains("[Обналичить чеки на добл.]")').each(function() {
				//		  var href = document.getElementByName('nal2').href;
				//	mainFrame.location.href = href;
				//}); 
         
				//если Архивариус идем вправо
				battle.find(':contains("Мобы:Архивариус")').each(function() {
					
			 mainFrame.location.href = 'http://www.fcity.su/lab.php?go=p2';
            });
			   
				 
			    
				
				
				
					// Обналичить
			//battle.find(':contains("Архивариус")').each(function() {
			//mainFrame.location.href = 'http://www.fcity.su/lab.php?nal2='+ (Math.floor(Math.random() * (3920992- 3913489)) + 3913489);
				//mainFrame.location.href = 'http://www.fcity.su/lab.php?nal1='+ (Math.floor(Math.random() * (3920992- 3913489)) + 3913489);
			//});
		
		
			
			
				battle.find(':contains("Вы обналичили у Архивариуса чек на")').each(function() {
						 mainFrame.location.href = 'http://www.fcity.su/lab.php?go=p2';
				}); 
         
		         battle.find(':contains("Ресурсы: Синий жемчуг")').each(function() {
						 mainFrame.location.href = 'http://www.fcity.su/lab.php?go=p2';
				}); 
           
		
		
					
			// Атакуем
		
			
			 
			//battle.find(':contains("Бот-атаки:")').each(function() {
			   battle.find(':contains("Волк")').each(function() {
				battle.find(':contains("Задание: Собрать 3 cиние жемчужины.")').each(function() {
				//mainFrame.location.href = 'http://www.fcity.su/lab.php?buykill=1';
				//mainFrame.location.href = 'lab.php?mobkills=1&idbots=11&name=Волк из Лабиринта';
					mainFrame.location.href = 'lab.php?mobkills=1&idbots=3&name=Волк из Лабиринта';
				   //battle.find(':contains("[атака!]")').click();
				 }); 
            });
			//});  			
			//battle.find(':contains("Бот-атаки:")').each(function() {
			   battle.find(':contains("Зигред")').each(function() {
			battle.find(':contains("Задание: Собрать 3 cиние жемчужины.")').each(function() {
			   //mainFrame.location.href = 'http://www.fcity.su/lab.php?buykill=1';
			  //mainFrame.location.href = 'lab.php?mobkills=1&idbots=11&name=Зигред[6]';
             mainFrame.location.href = 'lab.php?mobkills=1&idbots=2&name=Зигред[6]';
			//battle.find(':contains("[атака!]")').click();
				 }); 
            });
			//});
			//battle.find(':contains("Бот-атаки:")').each(function() {
			battle.find(':contains("Богомол")').each(function() {
			battle.find(':contains("Задание: Собрать 3 cиние жемчужины.")').each(function() {
			//mainFrame.location.href = 'http://www.fcity.su/lab.php?buykill=1';
			//mainFrame.location.href = 'lab.php?mobkills=1&idbots=11&name=Богомол[4]';
			mainFrame.location.href = 'lab.php?mobkills=1&idbots=1&name=Богомол[4]';
			//battle.find(':contains("[атака!]")').click();
				 }); 
            });
			//});
			
					 

			battle.find(':contains("Бой закончен!")').each(function() {
			battle.find(':contains("Вернуться")').each(function() {
              $(this).click();

			});
				});		 
			
			
			
            battle.find('input[name="go"]').click();
            battle.find('input[name="end"]').click();
           
			
			
		 // если глюк 
              battle.find(':contains("Бойцовский Квартал")').each(function() {
                 mainFrame.location.href = 'http://www.fcity.su/vxod_lab.php?&zad=1';
            });
			
		// глюк №2

	
          			
		
		battle.find(':contains("Колодец жизни")').each(function() {
                 mainFrame.location.href = 'http://www.fcity.su/lab.php?go=p2';	
				 });	
			 
								
				// Завершить квест
				battle.find(':contains("ЗАВЕРШИТЬ")').each(function() {
			
				mainFrame.location.href = 'lab.php?kwestend=1';
             });		
				
				
			
            

            var fire = false;
            battle.find(':contains("Ваш ход")').each(function() {
                // img[alt*="Отравление [2]"]
                // img[alt*="Каменный Дождь [4]"]
                if (fire == false) {
                    var magicScroll = battle.find('img[alt*="Пожирающее Пламя"], img[alt*="Отравление"], img[alt*="Цепь Молний"], img[alt*="Каменный Дождь"]')[0];
                    $(magicScroll).parent().click();
                    fire = true;
                }
            });
          	            

            battle.find('input[name="go"]').each(function() {
                $(this).click();
            });

            battle.find('input[name="end"]').each(function() {
                $(this).click();
            });

            // park
            battle.find('input[name="start_raid"]').each(function() {
                $(this).click();
            });

            battle.find('input[name="attack"]').each(function() {
                $(this).click();
            });

            // ЦХ
            battle.find('input[name="go_next"]').each(function() {
                $(this).click();
            });

            battle.find('input[name="go_attack"]').each(function() {
                $(this).click();
            });

            // Refresh
            if ((unixtimestampStart + 5) < unixtimestamp) {
                unixtimestampStart = unixtimestamp;
                battle.find(':contains("Групповые")').find('input[value="Обновить"]').each(function() {
                    $(this).click();
                });
            }
        }
    }, 500);
});
;
  }
})(window);

