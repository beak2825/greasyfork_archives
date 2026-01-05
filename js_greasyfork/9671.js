// @name Neverwinter Gateway Advanced Library - Profession Tasks
// @description Adds Profession tasks. Should be part of main script for Public!!!

/*
 * Tasklist can be modified to configure the training you want to perform.
 * The configurable options window sets how many profession slots you want to use for each profession.
 * The level array below for each professions specifies the tasks you want to learn at each crafting level.
 * Each craft slot will pick the first task that meets requirements.
 * See http://pastebin.com/VaGntEha for Task Name Map.
 * Updated list, see http://pastebin.com/inR0Hwv0
 * Tools,
 * Tasknames extraction, https://greasyfork.org/en/scripts/7977-nw-profession-names
 * Inventory listing, https://greasyfork.org/en/scripts/8506-nw-inventory-names
 * Some names above do not match, use below code to check:
 * var tasks = client.dataModel.model.craftinglist['craft_' + profname].entries.filter(function(entry) { return entry.def && entry.def.displayname == taskname; }); tasks[0].def.name;
 */


/*** Profession priority list by order **/
var tasklist = [
    definedTask["Winter Event"],
    definedTask["Siege Event"],
    definedTask["Black Ice Shaping"],
    definedTask["Alchemy"],
    definedTask["Weaponsmithing_Axe"],
    /*definedTask["Weaponsmithing_Bow"],
     definedTask["Weaponsmithing_Dagger"],
     definedTask["Weaponsmithing_Greatsword"],
     definedTask["Weaponsmithing_Longsword"],*/
    definedTask["Artificing"],
    definedTask["Jewelcrafting"],
    definedTask["Mailsmithing"],
    definedTask["Platesmithing"],
    definedTask["Leatherworking"],
    definedTask["Tailoring"],
    definedTask["Leadership"],
    definedTask["Leadership XP"],
];

/** EndOf Profession priority**/


/*** Profession Tasks definition ***/
definedTask["Leadership"] = {
  // modded to prioritize RAD production, added low level task for speeding up levelling up
  taskListName: "Leadership",
  taskName: "Leadership",
  level: {
      0: ["Leadership_Tier0_Intro_1"],
      1: ["Leadership_Tier0_Intro_5", "Leadership_Tier0_Intro_4", "Leadership_Tier0_Intro_3", "Leadership_Tier0_Intro_2"],
      2: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
      3: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
      4: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
      5: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
      6: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
      7: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
      8: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
      9: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
      // Begin prioritizing "Battle Undead"
      10: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
      11: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
      12: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
      // Add "protect diamonds rare" and the patrol quest as a backup
      13: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier3_13_Patrol", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
      14: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier3_13_Patrol", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
      15: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier1_4_Protect", "Leadership_Tier3_15r_Raidtreasury", "Leadership_Tier1_5_Explore"],
      // Production mode: Spellplague + Battle Undead
      16: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol","Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier3_16_Fight", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_15r_Raidtreasury", "Leadership_Tier1_5_Explore"],
      17: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol","Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier3_16_Fight", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol",  "Leadership_Tier3_15r_Raidtreasury", "Leadership_Tier1_5_Explore"],
      18: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol","Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier3_16_Fight", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_15r_Raidtreasury", "Leadership_Tier1_5_Explore"],
      19: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol","Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier3_16_Fight", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_15r_Raidtreasury", "Leadership_Tier1_5_Explore"],

      20: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_20r_Master2",
          "Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3","Leadership_Tier3_20_Destroy",
          "Leadership_Tier2_12_Taxes", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_16_Fight",
          "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],

      21: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_20r_Master2",
          "Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3","Leadership_Tier3_20_Destroy", "Leadership_Tier4_21_Protectmagic",
          "Leadership_Tier2_12_Taxes", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_16_Fight",
          "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore"],

      22: ["Leadership_Tier4_22r_Capturebandithq", "Leadership_Tier3_13r_Protectdiamonds",
          "Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1",
          "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier4_21_Protectmagic",
          "Leadership_Tier2_12_Taxes", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_16_Fight",
          "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],

      23: ["Leadership_Tier4_22r_Capturebandithq", "Leadership_Tier3_13r_Protectdiamonds",
          "Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3",
          "Leadership_Tier3_20_Destroy", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_12_Taxes",
          "Leadership_Tier4_21_Protectmagic","Leadership_Tier3_13_Patrol","Leadership_Tier3_16_Fight",
          "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore"],

      24: ["Leadership_Tier4_22r_Capturebandithq", "Leadership_Tier3_13r_Protectdiamonds",
          "Leadership_Tier4_24r_Killdragon","Leadership_Tier3_20r_Master2","Leadership_Tier3_20r_Master1",
          "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier2_12_Taxes",
          "Leadership_Tier4_21_Protectmagic","Leadership_Tier3_13_Patrol","Leadership_Tier3_16_Fight",
          "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],

      25: ["Leadership_Tier4_25r_Huntexperiment","Leadership_Tier4_22r_Capturebandithq",
          "Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier4_24r_Killdragon",
          "Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3",
          "Leadership_Tier3_20_Destroy","Leadership_Tier2_12_Taxes", "Leadership_Tier4_25_Battleelementalcultists",
          "Leadership_Tier4_21_Protectmagic", "Leadership_Tier3_13_Patrol","Leadership_Tier3_16_Fight",
          "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],

      /*

       "Leadership_Tier1_2_Guardduty"                                 0/2   ->  0
       "Leadership_Tier1_4_Protect"                                 100/2   -> 50
       "Leadership_Tier2_8_Protect"                                 200/6   -> 33.33
       "Leadership_Tier2_10_Battle"                                 400/6   -> 66.66
       "Leadership_Tier3_16_Fight"                                  400/6   -> 66.66

       "Leadership_Tier3_18_Resell", 3x "Leadership_Tier2_8_Protect"  1000/26 -> 38.46
       "Leadership_Tier3_18_Resell"                                 400/8   -> 50
       "Leadership_Tier2_8_Protect"                                 200/6   -> 33.33

       "Leadership_Tier2_12_Taxes", "Leadership_Tier2_9_Chart", 3x "Leadership_Tier1_5_Explore"  800/16  -> 50
       "Leadership_Tier2_12_Taxes", "Leadership_Tier2_9_Chart"      800/10  -> 80
       "Leadership_Tier2_12_Taxes"                                  800/8   -> 100
       "Leadership_Tier2_9_Chart"                                     0/2   -> 0
       "Leadership_Tier1_5_Explore"                                   0/2   -> 0

       2x "Leadership_Tier2_12_Taxes", Leadership_Tier2_10r_Seekmaps  1600/22   -> 72.72
       "Leadership_Tier2_12_Taxes"                                      800/8   -> 100
       "Leadership_Tier2_10r_Seekmaps"                                    0/6   -> 0  (2x District Maps) (1x optional)

       "Leadership_Tier2_12_Taxes", Leadership_Tier2_9_Chart, Leadership_Tier1_6r_Protectsurvey   800/18 -> 44.44
       "Leadership_Tier2_12_Taxes", Leadership_Tier2_9_Chart                                      800/16 -> 50
       Leadership_Tier2_12_Taxes"                                         800/8 -> 100
       "Leadership_Tier2_9_Chart"                                         0/2   -> 0
       Leadership_Tier1_6r_Protectsurvey                                    0/8 -> 0 (3x Local Map)

       Leadership_Tier3_17_Deliver, 3x Leadership_Tier3_13_Patrol   1200/20 -> 60
       "Leadership_Tier3_17_Deliver"                                1200/8  -> 150 (No, because we can get a purple chest if we use this with Leadership_Tier3_20r_Master3)
       Leadership_Tier3_13_Patrol                                      0/4  -> 0

       // Has an asset slot... so marginally better if you have better people....
       "Leadership_Tier1_4r_Gatherdiamonds"                           400/8 -> 50 (1x optional)

       Leadership_Tier3_13r_Protectdiamonds, 1x Leadership_Tier3_13_Patrol  1600/16 -> 100
       Leadership_Tier3_13r_Protectdiamonds                                 1600/12 -> 133.33
       Leadership_Tier3_13_Patrol                                              0/4  -> 0

       Leadership_Tier2_8r_Givehome                                          800/12 -> 66.66  (Barrel of Goods)

       "Leadership_Tier3_15r_Raidtreasury"                                    400/8 -> 50 (1x optional) (blue chest)
       Leadership_Tier3_14_Assemble                                             0/4 -> 0

       Leadership_Tier3_19r_Siegekeep, 3x Leadership_Tier3_19_Acquire       1600/48 ->  33.33 (1x optional) (purple chest)
       Leadership_Tier3_19r_Siegekeep                                       1600/12 -> 133.33 (1x optional) (purple chest)
       Leadership_Tier3_19_Acquire                                             0/12 -> 0

       Leadership_Tier3_20r_Master1, 1x Leadership_Tier3_14_Assemble, 3x Build Shelters   1600/52 ->  30.77
       Leadership_Tier3_20r_Master1, 1x Leadership_Tier3_14_Assemble                      1600/16 -> 100
       Leadership_Tier3_20r_Master1                                                       1600/12 -> 133.33
       Leadership_Tier3_14_Assemble                                                          0/4  -> 0
       Build Shelters (L16)                                                                  0/12 -> 0

       Leadership_Tier3_20r_Master2, 1x Leadership_Tier3_19_Acquire, 3x Build Shelters    1600/60 ->  26.66
       Leadership_Tier3_20r_Master2, 1x Leadership_Tier3_19_Acquire,                      1600/24 ->  66.66
       Leadership_Tier3_20r_Master2                                                       1600/12 -> 133.33
       Leadership_Tier3_19_Acquire                                                           0/12 -> 0
       Build Shelters (L16)                                                                  0/12 -> 0

       Leadership_Tier3_20r_Master3, 1x Leadership_Tier3_13_Patrol, 3x Build Shelters      1600/52 ->  30.77
       Leadership_Tier3_20r_Master3  1x Leadership_Tier3_13_Patrol                         1600/16 -> 100
       Leadership_Tier3_20r_Master3                                                        1600/12 -> 133.33
       Leadership_Tier3_13_Patrol                                                              0/4 -> 0
       Build Shelters (L16)                                                                   0/12 -> 0

       Leadership_Tier3_20_Destroy                                                         1600/12 -> 133.33

       Leadership_Tier3_16r_Buildshelters   12hr -> purple chest, Mark of Gratitude
       15 Refugees


       /professions-tasks/Leadership/Leadership_Tier3_15_Rescue  0/8 -> 8
       /professions-tasks/Leadership/Leadership_Tier2_8r_Helpneedy

       /professions-tasks/Leadership/Leadership_Tier2_11r_Escortgoods    400/12 -> 33.33  (2x Bill Of Sale)


       */


      /*
       0: ["Leadership_Tier0_Intro_1"],
       1: ["Leadership_Tier0_Intro_5", "Leadership_Tier0_Intro_4", "Leadership_Tier0_Intro_3", "Leadership_Tier0_Intro_2"],
       2: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
       3: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
       4: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
       5: ["Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
       6: ["Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
       7: ["Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
       8: ["Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
       9: ["Leadership_Tier1_4_Protect", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       // Begin prioritizing "Battle Undead"
       10: ["Leadership_Tier2_10_Battle", "Leadership_Tier1_4_Protect", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       11: ["Leadership_Tier2_10_Battle", "Leadership_Tier1_4_Protect", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       12: ["Leadership_Tier2_10_Battle", "Leadership_Tier1_4_Protect", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       // Add "protect diamonds rare" and the patrol quest as a backup
       13: ["Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4_Protect", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       14: ["Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4_Protect", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       15: ["Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4_Protect", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       // AD Production mode: Spellplague + Battle Undead
       16: ["Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       17: ["Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_17_Deliver", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       18: ["Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_17_Deliver", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       19: ["Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_17_Deliver", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       // 20
       20: ["Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1", "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier2_12_Taxes", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       21: ["Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1", "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier2_12_Taxes", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       22: ["Leadership_Tier4_22r_Capturebandithq","Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1", "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier2_12_Taxes", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       23: ["Leadership_Tier4_22r_Capturebandithq","Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1", "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier2_12_Taxes", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       24: ["Leadership_Tier4_22r_Capturebandithq","Leadership_Tier4_24r_Killdragon","Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1", "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier2_12_Taxes", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       25: ["Leadership_Tier4_25r_Huntexperiment","Leadership_Tier4_22r_Capturebandithq","Leadership_Tier4_24r_Killdragon","Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1", "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier4_25_Battleelementalcultists", "Leadership_Tier2_12_Taxes", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
       */

  },
};

definedTask["Leadership XP"] = {
  taskListName: "Leadership_XP",
  taskName: "Leadership",
  level: {

      /* Info here isn't reflected in list below as yet.
       Leadership_Tier1_Feedtheneedy Exp5/0.166 -> 30
       Leadership_Tier1_2_Training   Exp80/4    -> 20
       Leadership_Tier1_2_Guardduty  Exp40/2    -> 20
       Leadership_Tier1_4_Protect    Exp40/2    -> 20
       Leadership_Tier1_5_Explore    Exp40/2    -> 20
       Leadership_Tier2_7_Training   Exp160/8   -> 20
       Leadership_Tier2_7_Raid       Exp80/4    -> 20
       Leadership_Tier2_9_Chart      Exp80/2    -> 40
       Leadership_Tier2_9_Chart, 3x Leadership_Tier1_5_Explore      Exp200/8    -> 25
       Leadership_Tier3_13_Training  Exp240/8   -> 30
       Leadership_Tier3_13_Patrol    Exp120/4   -> 30
       Leadership_Tier3_14_Assemble  Exp120/4   -> 30
       */


      0: ["Leadership_Tier0_Intro_1"],
      1: ["Leadership_Tier0_Intro_5", "Leadership_Tier0_Intro_4", "Leadership_Tier0_Intro_3", "Leadership_Tier0_Intro_2"],
      2: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
      3: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
      4: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
      5: ["Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
      6: ["Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
      7: ["Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
      8: ["Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
      9: ["Leadership_Tier1_5_Explore", "Leadership_Tier2_9_Chart", "Leadership_Tier1_4_Protect"],
      10: ["Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
      11: ["Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
      12: ["Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
      13: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
      14: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
      15: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
      16: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
      17: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
      18: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
      19: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
      20: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore", "Leadership_Tier3_13_Training", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
      // 20: ["Leadership_Tier3_13_Patrol","Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1", "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier2_12_Taxes", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol"],
      21: ["Leadership_Tier4_21_Protectmagic","Leadership_Tier4_21_Training","Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore","Leadership_Tier3_13_Patrol"],
      22: ["Leadership_Tier4_22_Guardclerics","Leadership_Tier4_21_Training","Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore","Leadership_Tier3_13_Patrol"],
      23: ["Leadership_Tier4_21_Protectmagic","Leadership_Tier4_22_Guardclerics","Leadership_Tier4_21_Protectmagic","Leadership_Tier4_21_Training","Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
      24: ["Leadership_Tier4_24_Wizardsseneschal","Leadership_Tier4_22_Guardclerics","Leadership_Tier4_21_Protectmagic","Leadership_Tier4_21_Training","Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
      25: ["Leadership_Tier4_25r_Huntexperiment", "Leadership_Tier4_21_Protectmagic", "Leadership_Tier4_24_Wizardsseneschal","Leadership_Tier4_22_Guardclerics","Leadership_Tier4_22_Guardclerics","Leadership_Tier4_25_Battleelementalcultists", "Leadership_Tier3_20_Destroy", "Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier2_12_Taxes", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
  },
};

definedTask["Winter Event"] = {
  taskListName: "WinterEvent",
  taskName: "WinterEvent",
  level: {
      /*
       0:["Event_Winter_Tier1_Heros_Feast, Event_Winter_Tier1_Lightwine, Event_Winter_Tier1_Sparkliest_Gem"],
       1:["Event_Winter_Tier1_Heros_Feast, Event_Winter_Tier1_Lightwine, Event_Winter_Tier1_Sparkliest_Gem"],
       2:["Event_Winter_Tier1_Heros_Feast, Event_Winter_Tier1_Lightwine, Event_Winter_Tier1_Sparkliest_Gem"],
       3:["Event_Winter_Tier1_Heros_Feast, Event_Winter_Tier1_Lightwine, Event_Winter_Tier1_Sparkliest_Gem"],
       */

      0: ["Event_Winter_Tier0_Intro"],
      1: ["Event_Winter_Tier1_Rankup", /*"Event_Winter_Tier1_Shiny_Lure",*/"Event_Winter_Tier1_Refine", "Event_Winter_Tier1_Gather"],
      2: ["Event_Winter_Tier1_Rankup_2", /*"Event_Winter_Tier1_Fishingpole_Blue","Event_Winter_Tier1_Shiny_Lure_Mass",*/"Event_Winter_Tier1_Refine_2", "Event_Winter_Tier1_Gather_2"],
      3: [/*"Event_Winter_Tier1_Heros_Feast","Event_Winter_Tier1_Lightwine","Event_Winter_Tier1_Sparkliest_Gem","Event_Winter_Tier1_Mesmerizing_Lure",*/"Event_Winter_Tier1_Gather_3"],
  },
};

definedTask["Siege Event"] = {
  taskListName: "Event_Siege",
  taskName: "Event_Siege",
  level: {
      0:["Event_Siege_Tier0_Intro"], // Hire a Siege Master
      1:["Event_Siege_Tier1_Donate_Majorinjury", "Event_Siege_Tier1_Donate_Injury", "Event_Siege_Tier1_Donate_Resources_T3", "Event_Siege_Tier1_Donate_Resources_T2"],
      /*
       0: ["Event_Siege_Tier0_Intro"], // Hire a Siege Master
       //1:["Event_Siege_Tier1_Donate_Minorinjury"], // Create Defense Supplies from Minor Injury Kits
       //1:["Event_Siege_Tier1_Donate_Injury"], // Create Defense Supplies from Injury Kits
       //1:["Event_Siege_Tier1_Donate_Majorinjury"], // Create Defense Supplies from Major Injury Kits
       //1:["Event_Siege_Tier1_Donate_Altar_10"], // Create Defense Supplies from 10 Portable Altars
       //1:["Event_Siege_Tier1_Donate_Altar_50"], // Create Defense Supplies from 50 Portable Altars
       //1:["Event_Siege_Tier1_Donate_Resources_T2"], // Create Defense Supplies from Tier 2 crafting resources
       //1:["Event_Siege_Tier1_Donate_Resources_T3"], // Create Defense Supplies from Tier 3 crafting resources
       1: ["Event_Siege_Tier1_Donate_Resources_T3", "Event_Siege_Tier1_Donate_Resources_T2", "Event_Siege_Tier1_Donate_Minorinjury", "Event_Siege_Tier1_Donate_Injury", "Event_Siege_Tier1_Donate_Majorinjury", "Event_Siege_Tier1_Donate_Altar_10"],
       */
  },
};

definedTask["Black Ice Shaping"] = {
  taskListName: "BlackIce",
  taskName: "BlackIce",
  level: {
      1: ["Blackice_Tier1_Process_Blackice"],
      2: ["Blackice_Tier1_Process_Blackice"],
      3: ["Blackice_Tier1_Process_Blackice"],
      4: ["Blackice_Tier1_Process_Blackice"],
      5: ["Blackice_Tier1_Process_Blackice"],

      /*
       1:["Forge Hammerstone Pick","Gather Raw Black Ice","Truesilver Pick Grip","Process Raw Black Ice","Upgrade Chillwright","Hire an additional Chillwright"],
       2:["Forge Hammerstone Pick","Gather Raw Black Ice","Truesilver Pick Grip","Process Raw Black Ice","Upgrade Chillwright","Hire an additional Chillwright"],
       3:["Forge Hammerstone Pick","Gather Raw Black Ice","Truesilver Pick Grip","Process Raw Black Ice","Upgrade Chillwright","Hire an additional Chillwright"],
       */
  },
};

definedTask["Jewelcrafting"] = {
  taskListName: "Jewelcrafting",
  taskName: "Jewelcrafting",
  level: {
      // Gather Mithral Ore and Exotic Pelts (14): Jewelcrafting_Tier3_Gather_Basic,
      // Semi-Precious Gem and Tough Leather Strip Crafting (7): Jewelcrafting_Tier2_Refine_Basic,
      // Gather High Quality Iron Ore and Tough Pelts (7): Jewelcrafting_Tier2_Gather_Basic,
      // Craft Raw Gems and Simple Leather Strips (1): Jewelcrafting_Tier1_Refine_Basic,
      // Gather Iron Ore and Simple Pelts (1):  Jewelcrafting_Tier1_Gather_Basic
      //			0:["Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],

      0: ["Jewelcrafting_Tier0_Intro"],
      1: ["Jewelcrafting_Tier1_Waist_Offense_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      2: ["Jewelcrafting_Tier1_Waist_Offense_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      3: ["Jewelcrafting_Tier1_Neck_Offense_1", "Jewelcrafting_Tier1_Waist_Offense_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      4: ["Jewelcrafting_Tier1_Neck_Offense_1", "Jewelcrafting_Tier1_Waist_Misc_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      5: ["Jewelcrafting_Tier1_Neck_Offense_1", "Jewelcrafting_Tier1_Waist_Misc_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      6: ["Jewelcrafting_Tier1_Neck_Misc_1", "Jewelcrafting_Tier1_Waist_Misc_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      7: ["Jewelcrafting_Tier2_Waist_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      8: ["Jewelcrafting_Tier2_Waist_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      9: ["Jewelcrafting_Tier2_Neck_Offense_2", "Jewelcrafting_Tier2_Waist_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      10: ["Jewelcrafting_Tier2_Waist_Misc_2", "Jewelcrafting_Tier2_Neck_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      11: ["Jewelcrafting_Tier2_Waist_Misc_2", "Jewelcrafting_Tier2_Neck_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      12: ["Jewelcrafting_Tier2_Waist_Misc_2", "Jewelcrafting_Tier2_Neck_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      13: ["Jewelcrafting_Tier2_Neck_Misc_2", "Jewelcrafting_Tier2_Waist_Misc_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      14: ["Jewelcrafting_Tier3_Waist_Offense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      15: ["Jewelcrafting_Tier3_Waist_Offense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      16: ["Jewelcrafting_Tier3_Neck_Offense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      17: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      18: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      19: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      20: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      21: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      22: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      23: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      24: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
      25: ["Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier1_Refine_Basic"],

      /*

       Jewelcrafting_Tier3_Gather_Basic         60/30 -> 2
       Jewelcrafting_Tier3_Gather_Basic_Mass  800/480 -> 1.66

       10%
       60/(30/1.1)  -> 2.2
       800/(480/1.1) -> 1.833

       25%:
       60/(30/1.25)  -> 2.5
       800/(480/1.25) -> 2.0833

       */



  },
};

definedTask["Mailsmithing"] = {
  taskListName: "Mailsmithing",
  taskName: "Armorsmithing_Med",
  level: {
      //            Med_Armorsmithing_Tier3_Scale_Pants (15)
      //            Med_Armorsmithing_Tier3_Scale_Shirt (14)
      //			      0:["Med_Armorsmithing_Tier3_Scale_Pants", "Med_Armorsmithing_Tier3_Scale_Shirt", "Med_Armorsmithing_Tier2_Scale_Pants_1_Set2", "Med_Armorsmithing_Tier2_Scale_Shirt", "Med_Armorsmithing_Tier1_Scale_Gloves_1", "Med_Armorsmithing_Tier1_Scale_Armor_1", "Med_Armorsmithing_Tier1_Scale_Shirt_1"],

      0: ["Med_Armorsmithing_Tier0_Intro"],
      1: ["Med_Armorsmithing_Tier1_Gather_Basic"],
      2: ["Med_Armorsmithing_Tier1_Chain_Armor_1", "Med_Armorsmithing_Tier1_Chain_Pants_1","Med_Armorsmithing_Tier1_Gather_Basic"],
      3: ["Med_Armorsmithing_Tier1_Chain_Armor_1", "Med_Armorsmithing_Tier1_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
      4: ["Med_Armorsmithing_Tier1_Chain_Armor_1", "Med_Armorsmithing_Tier1_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
      5: ["Med_Armorsmithing_Tier1_Chain_Armor_Set_1", "Med_Armorsmithing_Tier1_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
      6: ["Med_Armorsmithing_Tier1_Chain_Armor_Set_1", "Med_Armorsmithing_Tier1_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
      7: ["Med_Armorsmithing_Tier1_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
      8: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_1", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt","Med_Armorsmithing_Tier1_Gather_Basic"],
      9: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_1", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt","Med_Armorsmithing_Tier1_Gather_Basic"],
      10: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_1", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt_2","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
      11: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_2", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt_2", "Med_Armorsmithing_Tier2_Chain_Pants_1","Med_Armorsmithing_Tier1_Gather_Basic"],
      12: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_2", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt_2", "Med_Armorsmithing_Tier2_Chain_Pants_1","Med_Armorsmithing_Tier1_Gather_Basic"],
      13: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_2", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt_2", "Med_Armorsmithing_Tier2_Chain_Pants_1","Med_Armorsmithing_Tier1_Gather_Basic"],
      14: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_2", "Med_Armorsmithing_Tier3_Chain_Shirt", "Med_Armorsmithing_Tier3_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
      15: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
      16: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
      17: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
      18: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
      19: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
      20: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
      21 :["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
      22 :["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
      23 :["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
      24 :["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
      25 :["Med_Armorsmithing_Tier2_Refine_Basic"],
      //20: ["Med_Armorsmithing_Tier2_Refine_Basic"],
      //19:["Chain Armor +4","Fancy Chain Pants","Fancy Chain Shirt","Chain Helm +4","Ornate Chain Pants","Upgrade Blacksmith","Upgrade Prospector","Hire an additional Prospector"],
      //20:["Forge Steel Rings and Scales"],

  },
};

definedTask["Platesmithing"] = {
  taskListName: "Platesmithing",
  taskName: "Armorsmithing_Heavy",
  level: {
      0: ["Hvy_Armorsmithing_Tier0_Intro"],
      1: ["Hvy_Armorsmithing_Tier1_Plate_Boots_1", "Hvy_Armorsmithing_Tier1_Plate_Shirt_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      2: ["Hvy_Armorsmithing_Tier1_Plate_Armor_1", "Hvy_Armorsmithing_Tier1_Plate_Pants_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      3: ["Hvy_Armorsmithing_Tier1_Plate_Armor_1", "Hvy_Armorsmithing_Tier1_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      4: ["Hvy_Armorsmithing_Tier1_Plate_Armor_1", "Hvy_Armorsmithing_Tier1_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      5: ["Hvy_Armorsmithing_Tier1_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier1_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      6: ["Hvy_Armorsmithing_Tier1_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier1_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      7: ["Hvy_Armorsmithing_Tier1_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt", "Hvy_Armorsmithing_Tier2_Shield_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      8: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_1", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      9: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_1", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      10: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_1", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt_2","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      11: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_2", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt_2", "Hvy_Armorsmithing_Tier2_Plate_Pants_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      12: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_2", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt_2", "Hvy_Armorsmithing_Tier2_Plate_Pants_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      13: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_2", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt_2", "Hvy_Armorsmithing_Tier2_Plate_Pants_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      14: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_2", "Hvy_Armorsmithing_Tier3_Plate_Shirt", "Hvy_Armorsmithing_Tier3_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      15: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      16: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      17: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      18: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      19: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      20: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      21 :["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      22 :["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      23 :["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      24 :["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
      25 :["Hvy_Armorsmithing_Tier2_Refine_Basic"],
      //20: ["Hvy_Armorsmithing_Tier2_Refine_Basic"],
      //19:["Plate Armor +4","Fancy Plate Pants","Fancy Plate Shirt","Plate Helm +4","Ornate Plate Pants","Upgrade Armorer","Upgrade Miner","Hire an additional Miner"],
      //20:["Forge Steel Plates"],
  },
};

definedTask["Leatherworking"] = {
  taskListName: "Leatherworking",
  taskName: "Leatherworking",
  level: {
      /* No Residuum:
       0:["Leatherworking_Tier0_Intro_1"],
       //      1:["Leatherworking_Tier1_Darkleather_Boots_1"],
       1:["Leatherworking_Tier1_Hide_Boots_1"],
       //      1:["Leatherworking_Tier1_Leather_Boots_1"],
       //      1:["Leatherworking_Tier1_Leather_Shirt_1_Set2"],
       //      2:["Leatherworking_Tier1_Darkleather_Armor_1"],
       2:["Leatherworking_Tier1_Hide_Armor_1"],
       //      2:["Leatherworking_Tier1_Leather_Armor_1"],
       //      2:["Leatherworking_Tier1_Leather_Pants_1"],
       //      2:["Leatherworking_Tier1_Leather_Pants_1_Set2"],
       //      3:["Leatherworking_Tier1_Darkleather_Gloves_1"],
       3:["Leatherworking_Tier1_Hide_Gloves_1"],
       4:["Leatherworking_Tier1_Hide_Gloves_1"],
       5:["Leatherworking_Tier1_Hide_Gloves_1"],
       6:["Leatherworking_Tier1_Hide_Gloves_1"],
       //      3:["Leatherworking_Tier1_Leather_Gloves_1"],
       7:["Leatherworking_Tier2_Leather_Shirt"],
       //      7:["Leatherworking_Tier2_Leather_Shirt_Set2"],
       8:["Leatherworking_Tier2_Leather_Pants_1"],
       9:["Leatherworking_Tier2_Leather_Pants_1"],
       10:["Leatherworking_Tier2_Leather_Pants_1"],
       11:["Leatherworking_Tier2_Leather_Pants_1"],
       12:["Leatherworking_Tier2_Leather_Pants_1"],
       13:["Leatherworking_Tier2_Leather_Pants_1"],
       //      8:["Leatherworking_Tier2_Leather_Pants_1_Set2"],
       14:["Leatherworking_Tier3_Leather_Shirt"],
       //      14:["Leatherworking_Tier3_Leather_Shirt_Set2"],
       15:["Leatherworking_Tier3_Leather_Pants"],
       16:["Leatherworking_Tier3_Leather_Pants"],
       17:["Leatherworking_Tier3_Leather_Pants"],
       18:["Leatherworking_Tier3_Leather_Pants"],
       19:["Leatherworking_Tier3_Leather_Pants"],
       20:["Leatherworking_Tier3_Leather_Pants"],
       //      15:["Leatherworking_Tier3_Leather_Pants_Set2"],
       */

      0: ["Leatherworking_Tier0_Intro_1"],
      1: ["Leatherworking_Tier1_Leather_Boots_1", "Leatherworking_Tier1_Leather_Shirt_1","Leatherworking_Tier1_Gather_Basic"],
      2: ["Leatherworking_Tier1_Leather_Armor_1", "Leatherworking_Tier1_Leather_Pants_1","Leatherworking_Tier1_Gather_Basic"],
      3: ["Leatherworking_Tier1_Leather_Armor_1", "Leatherworking_Tier1_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
      4: ["Leatherworking_Tier1_Leather_Armor_1", "Leatherworking_Tier1_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
      5: ["Leatherworking_Tier1_Leather_Armor_Set_1", "Leatherworking_Tier1_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
      6: ["Leatherworking_Tier1_Leather_Armor_Set_1", "Leatherworking_Tier1_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
      7: ["Leatherworking_Tier1_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt","Leatherworking_Tier1_Gather_Basic"],
      8: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_1", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt","Leatherworking_Tier1_Gather_Basic"],
      9: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_1", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt","Leatherworking_Tier1_Gather_Basic"],
      10: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_1", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt_2","Leatherworking_Tier1_Gather_Basic"],
      11: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_2", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt_2", "Leatherworking_Tier2_Leather_Pants_1","Leatherworking_Tier1_Gather_Basic"],
      12: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_2", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt_2", "Leatherworking_Tier2_Leather_Pants_1","Leatherworking_Tier1_Gather_Basic"],
      13: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_2", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt_2", "Leatherworking_Tier2_Leather_Pants_1","Leatherworking_Tier1_Gather_Basic"],
      14: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_2", "Ornate Leatherworking_Tier1_Leather_Shirt_1", "Leatherworking_Tier3_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
      15: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
      16: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
      17: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
      18: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
      19: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
      20: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
      21 :["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
      22 :["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
      23 :["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
      24 :["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
      25 :["Leatherworking_Tier2_Refine_Basic"],
      //20: ["Leatherworking_Tier2_Refine_Basic"],
      //19:["Leather Armor +4","Fancy Leather Pants","Fancy Leather Shirt","Leather Helm +4","Ornate Leather Pants","Upgrade Tanner","Upgrade Skinner","Hire an additional Skinner"],
      //20:["Cure Tough Pelts"],
  },
};

definedTask["Tailoring"] = {
  taskListName: "Tailoring",
  taskName: "Tailoring",
  level: {
      // power
      //			      0:["Tailoring_Tier3_Cloth_Pants", "Tailoring_Tier3_Cloth_Shirt", "Tailoring_Tier2_Cloth_Pants_1", "Tailoring_Tier2_Cloth_Shirt", "Tailoring_Tier1_Cloth_Gloves_1", "Tailoring_Tier1_Cloth_Armor_1", "Tailoring_Tier1_Cloth_Boots_1"],
      // critical strike
      //			0:["Tailoring_Tier3_Cloth_Pants_Set2", "Tailoring_Tier3_Cloth_Shirt_Set2", "Tailoring_Tier2_Cloth_Pants_1_Set2", "Tailoring_Tier2_Cloth_Shirt_Set2", "Tailoring_Tier1_Cloth_Gloves_1", "Tailoring_Tier1_Cloth_Gloves_1", "Tailoring_Tier1_Cloth_Shirt_1_Set2"],

      0: ["Tailoring_Tier0_Intro"],
      1: [ "Tailoring_Tier1_Cloth_Shirt_1","Tailoring_Tier1_Cloth_Boots_1","Tailoring_Tier1_Gather_Basic"],
      2: ["Tailoring_Tier1_Cloth_Armor_1", "Tailoring_Tier1_Cloth_Pants_1","Tailoring_Tier1_Gather_Basic"],
      3: ["Tailoring_Tier1_Cloth_Armor_1", "Tailoring_Tier1_Cloth_Shirt_1", "Tailoring_Tier1_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
      4: ["Tailoring_Tier1_Cloth_Armor_1", "Tailoring_Tier1_Cloth_Shirt_1", "Tailoring_Tier1_Cloth_Shirt_1", "Tailoring_Tier1_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
      5: ["Tailoring_Tier1_Cloth_Armor_Set_1", "Tailoring_Tier1_Cloth_Shirt_1", "Tailoring_Tier1_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
      6: ["Tailoring_Tier1_Cloth_Armor_Set_1", "Tailoring_Tier1_Cloth_Shirt_1", "Tailoring_Tier1_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
      7: ["Tailoring_Tier1_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
      8: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_1", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt","Tailoring_Tier1_Gather_Basic"],
      9: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_1", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt","Tailoring_Tier1_Gather_Basic"],
      10: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_1", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt_2","Tailoring_Tier1_Gather_Basic"],
      11: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_2", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt_2", "Tailoring_Tier2_Cloth_Pants_1","Tailoring_Tier1_Gather_Basic"],
      12: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_2", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt_2", "Tailoring_Tier2_Cloth_Pants_1","Tailoring_Tier1_Gather_Basic"],
      13: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_2", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt_2", "Tailoring_Tier2_Cloth_Pants_1","Tailoring_Tier1_Gather_Basic"],
      14: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_2", "Tailoring_Tier3_Cloth_Shirt", "Tailoring_Tier3_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
      15: ["Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
      16: ["Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1","Tailoring_Tier1_Gather_Basic"],
      17: ["Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1","Tailoring_Tier1_Gather_Basic"],
      18: ["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
      19: ["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
      20: ["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
      21 :["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
      22 :["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
      23 :["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
      24 :["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
      25 :["Tailoring_Tier2_Refine_Basic"],
      //20: ["Tailoring_Tier2_Refine_Basic"],
  },
};

definedTask["Artificing"] = {
  taskListName: "Artificing",
  taskName: "Artificing",
  level: {
      0: ["Artificing_Tier0_Intro_1"],
      1: ["Artificing_Tier1_Pactblade_Convergence_1", "Artificing_Tier1_Symbol_Virtuous_1", "Artificing_Tier1_Gather_Basic"],
      2: ["Artificing_Tier1_Pactblade_Convergence_1", "Artificing_Tier1_Icon_Virtuous_1", "Artificing_Tier1_Gather_Basic"],
      3: ["Artificing_Tier1_Pactblade_Convergence_1", "Artificing_Tier1_Icon_Virtuous_1", "Artificing_Tier1_Gather_Basic"],
      4: ["Artificing_Tier1_Pactblade_Convergence_2", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier1_Gather_Basic"],
      5: ["Artificing_Tier1_Pactblade_Convergence_2", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier1_Gather_Basic"],
      6: ["Artificing_Tier1_Pactblade_Convergence_2", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier1_Gather_Basic"],
      7: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      8: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      9: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      10: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      11: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      12: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      13: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      14: ["Artificing_Tier3_Pactblade_Temptation_4", "Artificing_Tier3_Icon_Virtuous_4", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      15: ["Artificing_Tier3_Pactblade_Temptation_4", "Artificing_Tier3_Icon_Virtuous_4", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      16: ["Artificing_Tier3_Pactblade_Temptation_4", "Artificing_Tier3_Icon_Virtuous_4", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      17: ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      18: ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      19: ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      20:  ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      21 : ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      22 : ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      23 : ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      24 : ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
      25 :["Artificing_Tier2_Refine_Basic"],
      //20: ["Artificing_Tier2_Refine_Basic"],
      //19:["Virtuous Icon +5","Upgrade Engraver","Upgrade Carver","Hire an additional Carver"],
      //20:["7:Craft Ornamental metal and Carved Wood"],
  },
};

definedTask["Weaponsmithing_Axe"] = {
  taskListName: "Weaponsmithing_Axe",
  taskName: "Weaponsmithing",
  level: {
      0: ["Weaponsmithing_Tier0_Intro"],

      /* No use of Residuum:
       1: ["Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass", "Weaponsmithing_Tier1_Gather_Basic"],
       */
      // We don't have axes until level 2
      1: ["Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
      2: ["Weaponsmithing_Tier1_Greataxe_1", "Weaponsmithing_Tier1_Battleaxe_1", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
      3: ["Weaponsmithing_Tier1_Greataxe_1", "Weaponsmithing_Tier1_Battleaxe_1", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
      4: ["Weaponsmithing_Tier1_Greataxe_1", "Weaponsmithing_Tier1_Battleaxe_1", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
      5: ["Weaponsmithing_Tier1_Greataxe_2", "Weaponsmithing_Tier1_Battleaxe_2", "Weaponsmithing_Tier1_Gather_Basic"],
      6: ["Weaponsmithing_Tier1_Greataxe_2", "Weaponsmithing_Tier1_Battleaxe_2", "Weaponsmithing_Tier1_Gather_Basic"],
      // Just make resources at the new resource level -- they'll be used at higher levels
      // (even though the swords at this level seem more efficient -- they require lower level swords, which we haven't made and don't have inventory space for)
      // (we'll make 24 sets (of 2 each) "refined" resources in 16 hours (with no speed bonuses), which will be used by levels 8 and 9 alone
      7: ["Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
      8: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
      9: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
      10: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
      11: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
      12: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
      13: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
      // (we'll make 160 sets (of 2 each) "refined" resources in 133.33 hours (5.55 days) (with no speed bonuses)
      14: ["Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      15: ["Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      16: ["Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      17: ["Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      // If we have Fundamental Fire or Ice, we get a bit more exp by using it (and both options are not dependancies of anything else, unlike lower levels)
      18: ["Weaponsmithing_Tier3_Greataxe_Set_2", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_Set_2", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      19: ["Weaponsmithing_Tier3_Greataxe_Set_2", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_Set_2", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      20 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      21 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      22 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      23 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      24 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
      25 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
      // 20: ["Weaponsmithing_Tier3_Gather_Basic_Mass"],   // We want Gather here, because the raw materials can be used in other profs
      // If we actually want experience at level 20, these would be the tasks:
      //20: ["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
  },
};

definedTask["Weaponsmithing_Bow"] = {
  taskListName: "Weaponsmithing_Bow",
  taskName: "Weaponsmithing",
  level: {
      1: ["Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
      2: ["Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
      3: ["Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
      4: ["Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1"],
      5: ["Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
      6: ["Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
      7: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      8: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      9: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      10: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      11: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      12: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      14: ["Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      15: ["Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      16: ["Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      // If we have Desert Rose, we get a bit more exp by using it (and both options are not dependancies of anything else, unlike lower levels)
      17: ["Weaponsmithing_Tier3_Longbow_Set_2", "Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      18: ["Weaponsmithing_Tier3_Longbow_Set_2", "Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      19: ["Weaponsmithing_Tier3_Longbow_Set_2", "Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      20 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      21 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      22 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      23 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      24 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      25 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
      // 20: ["Weaponsmithing_Tier3_Gather_Basic_Mass"],  // We want Gather here, because the raw materials can be used in other profs
      // If we actually want experience at level 20, these would be the tasks:
      //20: ["Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
  },
};

definedTask["Weaponsmithing_Dagger"] = {
  taskListName: "Weaponsmithing_Dagger",
  taskName: "Weaponsmithing",
  level: {
      0: ["Weaponsmithing_Tier0_Intro"],
      1: ["Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
      2: ["Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
      3: ["Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
      4: ["Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
      5: ["Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
      6: ["Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
      7: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      8: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      9: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      10: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      11: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      12: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      13: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      14: ["Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      15: ["Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      16: ["Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      // If we have Fundamental Ice, we get a bit more exp by using it (and both options are not dependancies of anything else, unlike lower levels)
      17: ["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      18: ["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      19: ["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      20 :["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      21 :["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      22 :["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      23 :["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      24 :["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      25 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
  },
};

definedTask["Weaponsmithing_Greatsword"] = {
  taskListName: "Weaponsmithing_Greatsword",
  taskName: "Weaponsmithing",
  level: {
      0: ["Weaponsmithing_Tier0_Intro"],
      1: ["Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      2: ["Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      3: ["Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      4: ["Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      5: ["Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      6: ["Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      7: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      8: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      9: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      10: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      11: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      12: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      13: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      14: ["Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      15: ["Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      16: ["Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      // If we have Fundamental Ice, we get a bit more exp by using it (and both options are not dependancies of anything else, unlike lower levels)
      17: ["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      18: ["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      19: ["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      20 :["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      21 :["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      22 :["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      23 :["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      24 :["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      25 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
  },
};

definedTask["Weaponsmithing_Longsword"] = {
  taskListName: "Weaponsmithing_Longsword",
  taskName: "Weaponsmithing",
  level: {
      0: ["Weaponsmithing_Tier0_Intro"],
      1: ["Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      2: ["Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      3: ["Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      4: ["Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      5: ["Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      6: ["Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
      7: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      8: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      9: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      10: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      11: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      12: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      13: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
      14: ["Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      15: ["Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      16: ["Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      // If we have Fundamental Ice, we get a bit more exp by using it (and both options are not dependancies of anything else, unlike lower levels)
      17: ["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      18: ["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      19: ["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      20 :["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      21 :["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      22 :["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      23 :["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      24 :["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
      25 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
  },
};

/*
"Weaponsmithing_Tier1_Refine_Basic"      7/15        -> 0.4666
Weaponsmithing_Tier1_Refine_Basic_Mass   50/360 (6h) -> 0.1388
"Weaponsmithing_Tier1_Gather_Basic"      8/15        -> 0.5333
Weaponsmithing_Tier1_Gather_Basic_Mass  50/360  (6h) -> 0.1388

"Weaponsmithing_Tier2_Refine_Basic"          12/20       -> 0.6
Weaponsmithing_Tier2_Refine_Basic_Mass      200/420 (7h) -> 0.48
"Weaponsmithing_Tier2_Gather_Basic"          13/20       -> 0.65
Weaponsmithing_Tier2_Gather_Basic_Mass      200/420 (7h) -> 0.48

"Weaponsmithing_Tier3_Refine_Basic"                 30/25 ->  1.2
Weaponsmithing_Tier3_Refine_Basic_Mass      800/480 (8h)  -> 1.66
"Weaponsmithing_Tier3_Gather_Basic"                 30/25 ->  1.2
Weaponsmithing_Tier3_Gather_Basic_Mass      800/480 (8h)  -> 1.66

time / (1 + speedBonus)

360 / (1 + speedBonus) == 93.75
-> 265% bonus

420 / (1 + speedBonus) == 333.3
-> 26% bonus

25%:
480 / 1.25 == 384 => 800/384 == 2.0833

40%:
480 / (1.4) == 342.86 => 800/342.84 == 2.33

50%:
480 / 1.5 == 320 => 2.5

100%:
480 / 2 == 240 => 800/240 == 3.33


*/



definedTask["Alchemy"] = {
  taskListName: "Alchemy",
  taskName: "Alchemy",
  level: {
      0: ["Alchemy_Tier0_Intro_1"],
      1: ["Alchemy_Tier1_Experiment_Rank2", "Alchemy_Tier1_Experimentation_Rank1"],
      2: ["Alchemy_Tier1_Experiment_Rank3", "Alchemy_Tier1_Experimentation_Rank2"],
      3: ["Alchemy_Tier1_Experiment_Rank4", "Alchemy_Tier1_Experimentation_Rank3"],
      4: ["Alchemy_Tier1_Experiment_Rank5", "Alchemy_Tier1_Experimentation_Rank4"],
      5: ["Alchemy_Tier1_Experiment_Rank6", "Alchemy_Tier1_Experimentation_Rank5"],
      6: ["Alchemy_Tier1_Experiment_Rank7", "Alchemy_Tier1_Experimentation_Rank6"],
      7: ["Alchemy_Tier2_Experiment_Rank08", "Alchemy_Tier2_Experimentation_Rank07"],
      8: ["Alchemy_Tier2_Experiment_Rank09", "Alchemy_Tier2_Experimentation_Rank08"],
      9: ["Alchemy_Tier2_Experiment_Rank10", "Alchemy_Tier2_Experimentation_Rank09"],
      10: ["Alchemy_Tier2_Experiment_Rank11", "Alchemy_Tier2_Experimentation_Rank10"],
      11: ["Alchemy_Tier2_Experiment_Rank12", "Alchemy_Tier2_Experimentation_Rank11"],
      12: ["Alchemy_Tier2_Experiment_Rank13", "Alchemy_Tier2_Experimentation_Rank12"],
      13: ["Alchemy_Tier2_Experiment_Rank14", "Alchemy_Tier2_Experimentation_Rank13"],
      14: ["Alchemy_Tier3_Experiment_Rank15", "Alchemy_Tier3_Experimentation_Rank14"],
      15: ["Alchemy_Tier3_Experiment_Rank16", "Alchemy_Tier3_Experimentation_Rank15"],
      16: ["Alchemy_Tier3_Experiment_Rank17", "Alchemy_Tier3_Experimentation_Rank16"],
      17: ["Alchemy_Tier3_Experiment_Rank18", "Alchemy_Tier3_Experimentation_Rank17"],
      18: ["Alchemy_Tier3_Experiment_Rank19", "Alchemy_Tier3_Experimentation_Rank18"],
      19: ["Alchemy_Tier3_Experiment_Rank20", "Alchemy_Tier3_Experimentation_Rank19"],
      //20: ["Alchemy_Tier3_Protection_Potion_Major", "Alchemy_Tier2_Aquaregia", "Alchemy_Tier3_Refine_Basic", "Alchemy_Tier3_Gather_Components"], //disable for mod6
      20 : ["Alchemy_Tier3_Experiment_Rank21", "Alchemy_Tier3_Experimentation_Rank20"], // Enable for mod6
      21 : ["Alchemy_Tier4_Experiment_Rank22", "Alchemy_Tier4_Experimentation_Rank21"],
      22 : ["Alchemy_Tier4_Experiment_Rank23", "Alchemy_Tier4_Experimentation_Rank22"], //,"Alchemy_Tier4_Aquaregia_2"],
      23 : ["Alchemy_Tier4_Experiment_Rank24", "Alchemy_Tier4_Experimentation_Rank23"],
      24 : ["Alchemy_Tier4_Experiment_Rank25", "Alchemy_Tier4_Experimentation_Rank24"],
      25 : ["Alchemy_Tier4_Experimentation_Rank25","Alchemy_Tier4_Create_Elemental_Unified","Alchemy_Tier4_Create_Elemental_Aggregate","Alchemy_Tier4_Aquaregia_2"], //"Alchemy_Tier2_Aquaregia", "Alchemy_Tier3_Refine_Basic","Alchemy_Tier4_Potency_Potion_Superior", "Alchemy_Tier4_Protection_Potion_Superior"],
  },
};

/** EndOf Profession Tasks Definition **/