// ==UserScript==
// @name       Epic Erepublik - EPIC TOURNAMENT
// @version    1.24
// @description  Automated epic fighting.
// @include      *www.erepublik.com*
// @namespace https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/8210/Epic%20Erepublik%20-%20EPIC%20TOURNAMENT.user.js
// @updateURL https://update.greasyfork.org/scripts/8210/Epic%20Erepublik%20-%20EPIC%20TOURNAMENT.meta.js
// ==/UserScript==

var $ = jQuery,
    tournament = true,
    autocollect = true,
    autogetdo = true,
    autopost_medal = true,
    RWfightfor = "Bulgaria",
    main_type,
    military_type,
    url,
    hp,
    max_hp,
    rec_hp,
    i;

$(function() {

    function e() {
        setTimeout(function() {
            if ($(".green_beauty.on").length) {
                function g() {
                    $j(".green_beauty.on").trigger("click");
                    setTimeout(function() {
                        $j("#getRewardDailyOrderPopClose").trigger("click")
                    }, 2000);
                }
                var i = document.createElement("script");
                i.appendChild(document.createTextNode("(" + g + ")();"));
                (document.body || document.head || document.documentElement).appendChild(i);
            };
        }, 3000)
    }

    function f() {
        setTimeout(function() {
            if ($(".get_reward").length) {
                function g() {
                    $j(".get_reward").trigger("click");
                }
                var i = document.createElement("script");
                i.appendChild(document.createTextNode("(" + g + ")();"));
                (document.body || document.head || document.documentElement).appendChild(i);
            };
        }, 3000)
    }

    function c() {
        setTimeout(function() {
            if ($(".get_milestone_reward").length) {
                function g() {
                    $j(".get_milestone_reward").trigger("click");
                    setTimeout(function() {
                        $j("a.close").trigger("click")
                    }, 2000);
                }
                var i = document.createElement("script");
                i.appendChild(document.createTextNode("(" + g + ")();"));
                (document.body || document.head || document.documentElement).appendChild(i);
            };
        }, 3000)
    }

    function main() {
        autopost_medal && f();
        main_type = location.href.split("/")[4];
        military_type = location.href.split("/")[5];
        hp = erepublik.citizen.energy;
        max_hp = reset_health_to_recover;
        rec_hp = parseInt($(".tooltip_health_limit").html());
        rw = document.referrer.split("/")[4];
        $(".icon_energy_booster").click();

        if (main_type == "military") {
            if (military_type == "campaigns") {
                function campns() {

                    ////////////////////////
                    //EPIC TOURNAMENT CODE//
                    ////////////////////////
                    flag = false;
                    $(".epic_battle_entry").each(function() {
                        row = $(this);
                        if (!row.hasClass("dictatorship") && !row.hasClass("liberation") && tournament) {
                            epic_url = row.find("img[src$='epic_battles_icon.png']").parent().parent().find("a").attr("href");
                            window.location = "http://www.erepublik.com" + epic_url;
    //                        console.log("Epic battle on.");
                            flag = true;
                            return false;
                        }
                    });

                    /////////////
                    //ENDS HERE//
                    /////////////

                    if (!flag) {
                        $("#battle_listing").find("li").each(function() {
                            row = $(this);
                            i = 0;
                            if (!row.hasClass("dictatorship")) {
                                url = "http://www.erepublik.com" + row.find(".std_global_btn").attr("href");
    //                            console.log(url);
                                if (url.indexOf("undefined") > 0) {
                                    location.href = "http://www.erepublik.com/en/military/campaigns";
                                    console.log("something is wrong");
                                } else {
                                    window.location = url;
                                    return false;
                                }
                            }
                            i++;
                        })
                    }

                }
                setTimeout(function() {
                   campns();
                }, 2e3);

            }
        }
        if (military_type == "battlefield" || military_type == "battlefield-new") {
            battleFX.pop = function() {} //disable popups during  fighting
                //battle page, let's fight
                ////////////////////////
                //EPIC TOURNAMENT CODE//
                ////////////////////////        
            function wait() {
                if (isFirstRequest) { //wait for xhr to complete
                    if (aoeBattleData.epicBattle && tournament) {

                        // change location code
//                        console.log("battle is epic");
                        setTimeout(function() {
                            changeloc = $("#change_location");
                            changeloc.click();
//                            console.log("trying to move");

                            if (mov = $("#move")) {
                                setTimeout(function() {
                                    $("#country_list").val($("#country_list option:eq(1)").val());
                                    $("#country_list").change();
                                    $("#move").click();
                                }, 100);
                                mov.click();
//                                console.log("changed location");
                            }
                        }, 500);
                        ///change location code
                        //epic battle, go all in
//                        console.log("Epic Battle, vreme za pew pew pew!");
                        t = setInterval(function() {
                            if (SERVER_DATA.points.defender >= 1800 || SERVER_DATA.points.attacker >= 1800) {
                                //battle finished, back to home page
                                location.href = "http://www.erepublik.com/en";
                            }
                            if (erepublik.citizen.energy < 50) {
                                //regen energy
                                if ($("#DailyConsumtionTrigger").hasClass("energy")) {
                                    //energy bars, ignore
                                    location.href = "http://www.erepublik.com/en";
                                } else {
                                    //let's eat food
                                    $("#DailyConsumtionTrigger").click();
                                }
                            }
                            $('#fight_btn').click();
//                            console.log("Udar v Epic Battle");
                        }, 900);
                    } else if (reset_health_to_recover - parseInt($(".tooltip_health_limit").html()) <= 350) { //health to max      
                        /////////////
                        //ENDS HERE//
                        /////////////
//                        console.log("not epic");
                        setTimeout(function() {
                            if (SERVER_DATA.points.defender >= 1800 || SERVER_DATA.points.attacker >= 1800) {
                                //battle finished, let's find another one
                                location.href = "http://www.erepublik.com/en/military/campaigns";
                            }
                            i = 1;

                            t = setInterval(function() {
                                if (erepublik.citizen.energy < 10) {
                                    location.href = "http://www.erepublik.com/en";
                                }
                                $('#fight_btn').click();
//                                console.log("hit");
                                i++;
                                if (i == 10) { //beshe 2
                                    setTimeout(function() {
                                        location.href = "http://www.erepublik.com/en";
                                    }, 1200);
                                }
                            }, 900);
                        }, 1000);
                    }
                    ///////////////////////////////////////////////
                    //THIS ELSE IS TO BE REMOVED AFTER TOURNAMENT//
                    ///////////////////////////////////////////////            
                    else {
                        setTimeout(function() {
//                            console.log("back to main page");
                            location.href = "http://www.erepublik.com/en";
                        }, 5000);
                    }

                } else {
                    setTimeout(wait, 200);
                };

            }
            wait();
        } else if (main_type == "wars") {
            //join defenders if it is your citizenship country
            if (jQuery(".reversed:contains(" + RWfightfor + ")").length > 0)
            {
                var addressValue = $(".reversed").attr("href");
                location.href = addressValue;
            }
            //join resistance by default
            else {
                var addressValue = $(".join").attr("href");
                location.href = addressValue;
            }
        } else {
            // we are on main page
            if (reset_health_to_recover - erepublik.citizen.energy >= 10 && parseInt($(".tooltip_health_limit").html()) >= 10) {
                if ($("#DailyConsumtionTrigger").hasClass("energy")) {
                    //energy bars, ignore
                } else {
                    //let's eat food
                    $("#DailyConsumtionTrigger").click();
                }
            }
            autocollect && c();
            autogetdo && e();
            setTimeout(function() {
                location.href = "http://www.erepublik.com/en/military/campaigns";
            }, 360000);
        }
    }

    function wait() {
        if (unsafeWindow.jQuery === 'undefined') {
            setTimeout(wait, 100);
        } else {
            $ = unsafeWindow.jQuery;
            main();
        }
    }
    wait();
});
