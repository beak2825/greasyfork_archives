// ==UserScript==
// @name         HWM: Прогресс достижений
// @author       Sargonnas
// @namespace    hwm-achievements-progress
// @version      1.1.4
// @description  Достижения, комплекты, медали и прочее в виде прогресса
// @match        https://www.heroeswm.ru/pl_info.php*
// @match        https://mirror.heroeswm.ru/pl_info.php*
// @match        https://my.lordswm.com/pl_info.php*
// @match        https://www.lordswm.com/pl_info.php*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552051/HWM%3A%20%D0%9F%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%20%D0%B4%D0%BE%D1%81%D1%82%D0%B8%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/552051/HWM%3A%20%D0%9F%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%20%D0%B4%D0%BE%D1%81%D1%82%D0%B8%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9.meta.js
// ==/UserScript==
(function () {
  'use strict';

const SETS = {
  "Комплект Ученика": [
    {
      "fname": "n_sword.png",
      "src": "/i/artifacts/nset/n_sword.png",
	  "name": "Меч ученика"
    },
    {
      "fname": "n_shield.png",
      "src": "/i/artifacts/nset/n_shield.png",
	  "name": "Щит ученика"
    },
    {
      "fname": "n_boots.png",
      "src": "/i/artifacts/nset/n_boots.png",
	  "name": "Ботинки ученика"
    },
    {
      "fname": "n_armor.png",
      "src": "/i/artifacts/nset/n_armor.png",
	  "name": "Доспех ученика"
    },
    {
      "fname": "n_clk.png",
      "src": "/i/artifacts/nset/n_clk.png",
	  "name": "Плащ ученика"
    },
    {
      "fname": "n_ringa.png",
      "src": "/i/artifacts/nset/n_ringa.png",
	  "name": "Кольцо силы ученика"
    },
    {
      "fname": "n_ringd.png",
      "src": "/i/artifacts/nset/n_ringd.png",
	  "name": "Кольцо упорства ученика"
    },
    {
      "fname": "n_amul.png",
      "src": "/i/artifacts/nset/n_amul.png",
	  "name": "Амулет ученика"
    },
    {
      "fname": "n_helmet.png",
      "src": "/i/artifacts/nset/n_helmet.png",
	  "name": "Шлем ученика"
    }
  ],
  "Комплект Охотника": [
    {
      "fname": "hunter_sword1.png",
      "src": "/i/artifacts/hunter_sword1.png",
	  "name": "Тесак охотника"
    },
    {
      "fname": "hunter_shield1.png",
      "src": "/i/artifacts/hunter_shield1.png",
	  "name": "Щит охотника"
    },
    {
      "fname": "hunter_boots1.png",
      "src": "/i/artifacts/hunter_boots1.png",
	  "name": "Сапоги охотника"
    },
    {
      "fname": "hunter_jacket1.png",
      "src": "/i/artifacts/hunter_jacket1.png",
	  "name": "Рубаха охотника"
    },
    {
      "fname": "hunter_bow1.png",
      "src": "/i/artifacts/hunter_bow1.png",
	  "name": "Лук охотника"
    },
    {
      "fname": "hunter_gloves1.png",
      "src": "/i/artifacts/hunter_gloves1.png",
	  "name": "Перчатка охотника"
    },
    {
      "fname": "hunter_pendant1.png",
      "src": "/i/artifacts/hunter_pendant1.png",
	  "name": "Кулон охотника"
    },
    {
      "fname": "hunter_hat1.png",
      "src": "/i/artifacts/hunter_hat1.png",
	  "name": "Шляпа охотника"
    }
  ],
  "Комплект Мастера-охотника": [
    {
      "fname": "hunterdsword.png",
      "src": "/i/artifacts/hunterdsword.png",
	  "name": "Сабля мастера-охотника"
    },
    {
      "fname": "huntersword2.png",
      "src": "/i/artifacts/huntersword2.png",
	  "name": "Лёгкая сабля мастера-охотника"
    },
    {
      "fname": "hunterdagger.png",
      "src": "/i/artifacts/hunterdagger.png",
	  "name": "Кинжал мастера-охотника"
    },
    {
      "fname": "huntershield2.png",
      "src": "/i/artifacts/huntershield2.png",
	  "name": "Щит мастера-охотника"
    },
    {
      "fname": "hunter_boots2.png",
      "src": "/i/artifacts/hunter_boots2.png",
	  "name": "Сапоги мастера-охотника"
    },
    {
      "fname": "hunter_boots3.png",
      "src": "/i/artifacts/hunter_boots3.png",
	  "name": "Лёгкие сапоги мастера-охотника"
    },
    {
      "fname": "hunter_armor1.png",
      "src": "/i/artifacts/hunter_armor1.png",
	  "name": "Броня мастера-охотника"
    },
    {
      "fname": "hunter_mask1.png",
      "src": "/i/artifacts/hunter_mask1.png",
	  "name": "Маскхалат мастера-охотника"
    },
    {
      "fname": "hunter_bow2.png",
      "src": "/i/artifacts/hunter_bow2.png",
	  "name": "Лук мастера-охотника"
    },
    {
      "fname": "hunter_arrows1.png",
      "src": "/i/artifacts/hunter_arrows1.png",
	  "name": "Стрелы мастера-охотника"
    },
    {
      "fname": "hunter_amulet1.png",
      "src": "/i/artifacts/hunter_amulet1.png",
	  "name": "Амулет мастера-охотника"
    },
    {
      "fname": "hunter_ring1.png",
      "src": "/i/artifacts/hunter_ring1.png",
	  "name": "Кольцо полёта мастера-охотника"
    },
    {
      "fname": "hunter_ring2.png",
      "src": "/i/artifacts/hunter_ring2.png",
	  "name": "Кольцо ловкости мастера-охотника"
    },
    {
      "fname": "hunter_helm.png",
      "src": "/i/artifacts/hunter_helm.png",
	  "name": "Шлем мастера-охотника"
    },
    {
      "fname": "hunter_roga1.png",
      "src": "/i/artifacts/hunter_roga1.png",
	  "name": "Костяной шлем мастера-охотника"
    }
  ],
  "Комплект Великого охотника": [
    {
      "fname": "gm_sword.png",
      "src": "/i/artifacts/gm/gm_sword.png",
	  "name": "Меч великого охотника"
    },
    {
      "fname": "gm_kastet.png",
      "src": "/i/artifacts/gm/gm_kastet.png",
	  "name": "Кастет великого охотника"
    },
    {
      "fname": "gm_defence.png",
      "src": "/i/artifacts/gm/gm_defence.png",
	  "name": "Щит великого охотника"
    },
    {
      "fname": "gm_spdb.png",
      "src": "/i/artifacts/gm/gm_spdb.png",
	  "name": "Сапоги великого охотника"
    },
    {
      "fname": "gm_arm.png",
      "src": "/i/artifacts/gm/gm_arm.png",
	  "name": "Броня великого охотника"
    },
    {
      "fname": "gm_protect.png",
      "src": "/i/artifacts/gm/gm_protect.png",
	  "name": "Маскхалат великого охотника"
    },
    {
      "fname": "gm_abow.png",
      "src": "/i/artifacts/gm/gm_abow.png",
	  "name": "Лук великого охотника"
    },
    {
      "fname": "gm_3arrows.png",
      "src": "/i/artifacts/gm/gm_3arrows.png",
	  "name": "Стрелы великого охотника"
    },
    {
      "fname": "gm_amul.png",
      "src": "/i/artifacts/gm/gm_amul.png",
	  "name": "Амулет великого охотника"
    },
    {
      "fname": "gm_sring.png",
      "src": "/i/artifacts/gm/gm_sring.png",
	  "name": "Кольцо ловкости в. охотника"
    },
    {
      "fname": "gm_rring.png",
      "src": "/i/artifacts/gm/gm_rring.png",
	  "name": "Заколдованное кольцо в. охотника"
    },
    {
      "fname": "gm_hat.png",
      "src": "/i/artifacts/gm/gm_hat.png",
	  "name": "Шлем великого охотника"
    }
  ],
  "Комплект Зверобоя": [
    {
      "fname": "sh_sword.png",
      "src": "/i/artifacts//sh/sh_sword.png",
	  "name": "Меч зверобоя"
    },
    {
      "fname": "sh_spear.png",
      "src": "/i/artifacts/sh/sh_spear.png",
	  "name": "Копьё зверобоя"
    },
    {
      "fname": "sh_shield.png",
      "src": "/i/artifacts/sh/sh_shield.png",
	  "name": "Щит зверобоя"
    },
    {
      "fname": "sh_boots.png",
      "src": "/i/artifacts/sh/sh_boots.png",
	  "name": "Сапоги зверобоя"
    },
    {
      "fname": "sh_armor.png",
      "src": "/i/artifacts/sh/sh_armor.png",
	  "name": "Броня зверобоя"
    },
    {
      "fname": "sh_cloak.png",
      "src": "/i/artifacts/sh/sh_cloak.png",
	  "name": "Маскхалат зверобоя"
    },
    {
      "fname": "sh_bow.png",
      "src": "/i/artifacts/sh/sh_bow.png",
	  "name": "Лук зверобоя"
    },
    {
      "fname": "sh_4arrows.png",
      "src": "/i/artifacts/sh/sh_4arrows.png",
	  "name": "Стрелы зверобоя"
    },
    {
      "fname": "sh_amulet2.png",
      "src": "/i/artifacts/sh/sh_amulet2.png",
	  "name": "Амулет зверобоя"
    },
    {
      "fname": "sh_ring1.png",
      "src": "/i/artifacts/sh/sh_ring1.png",
	  "name": "Кольцо ловкости зверобоя"
    },
    {
      "fname": "sh_ring2.png",
      "src": "/i/artifacts/sh/sh_ring2.png",
	  "name": "Кольцо силы зверобоя"
    },
    {
      "fname": "sh_helmet.png",
      "src": "/i/artifacts/sh/sh_helmet.png",
	  "name": "Шлем зверобоя"
    }
  ],
  "Комплект Вора": [
    {
      "fname": "thief_dagger.png",
      "src": "/i/artifacts/thief_dagger.png",
	  "name": "Кинжал вора"
    },
    {
      "fname": "thief_boots.png",
      "src": "/i/artifacts/thief_boots.png",
	  "name": "Сапоги вора"
    },
    {
      "fname": "thief_armor.png",
      "src": "/i/artifacts/thief_armor.png",
	  "name": "Доспехи вора"
    },
    {
      "fname": "thief_cape.png",
      "src": "/i/artifacts/thief_cape.png",
	  "name": "Плащ вора"
    },
    {
      "fname": "thief_arb.png",
      "src": "/i/artifacts/thief_arb.png",
	  "name": "Арбалет вора"
    },
    {
      "fname": "thief_amulet.png",
      "src": "/i/artifacts/thief_amulet.png",
	  "name": "Амулет вора"
    },
    {
      "fname": "thief_ring.png",
      "src": "/i/artifacts/thief_ring.png",
	  "name": "Кольцо вора"
    },
    {
      "fname": "thief_mask.png",
      "src": "/i/artifacts/thief_mask.png",
	  "name": "Маска вора"
    }
  ],
  "Комплект Налётчика": [
    {
      "fname": "tm_knife.png",
      "src": "/i/artifacts/tm_knife.png",
	  "name": "Кинжал налётчика"
    },
    {
      "fname": "tm_boots.png",
      "src": "/i/artifacts/tm_boots.png",
	  "name": "Сапоги налётчика"
    },
    {
      "fname": "tm_armor.png",
      "src": "/i/artifacts/tm_armor.png",
	  "name": "Доспехи налётчика"
    },
    {
      "fname": "tm_cape.png",
      "src": "/i/artifacts/tm_cape.png",
	  "name": "Плащ налётчика"
    },
    {
      "fname": "tm_arb.png",
      "src": "/i/artifacts/tm_arb.png",
	  "name": "Арбалет налётчика"
    },
    {
      "fname": "tm_amulet.png",
      "src": "/i/artifacts/tm_amulet.png",
	  "name": "Амулет налётчика"
    },
    {
      "fname": "tm_wring.png",
      "src": "/i/artifacts/tm_wring.png",
	  "name": "Кольцо налётчика"
    },
    {
      "fname": "tm_mring.png",
      "src": "/i/artifacts/tm_mring.png",
	  "name": "Колдовское кольцо налётчика"
    },
    {
      "fname": "tm_mask.png",
      "src": "/i/artifacts/tm_mask.png",
	  "name": "Маска налётчика"
    }
  ],
  "Комплект Рейнджера": [
    {
      "fname": "r_bigsword.png",
      "src": "/i/artifacts/ranger/r_bigsword.png",
	  "name": "Меч рейнджера"
    },
    {
      "fname": "r_magy_staff.png",
      "src": "/i/artifacts/ranger/r_magy_staff.png",
	  "name": "Посох рейнджера"
    },
    {
      "fname": "r_dagger.png",
      "src": "/i/artifacts/ranger/r_dagger.png",
	  "name": "Кинжал рейнджера"
    },
    {
      "fname": "r_goodscroll.png",
      "src": "/i/artifacts/ranger/r_goodscroll.png",
	  "name": "Свиток рейнджера"
    },
    {
      "fname": "r_bootsmb.png",
      "src": "/i/artifacts/ranger/r_bootsmb.png",
	  "name": "Сапоги рейнджера"
    },
    {
      "fname": "r_zarmor.png",
      "src": "/i/artifacts/ranger/r_zarmor.png",
	  "name": "Жилет рейнджера"
    },
    {
      "fname": "r_clck.png",
      "src": "/i/artifacts/ranger/r_clck.png",
	  "name": "Плащ рейнджера"
    },
    {
      "fname": "r_bow.png",
      "src": "/i/artifacts/ranger/r_bow.png",
	  "name": "Лук рейнджера"
    },
    {
      "fname": "r_warriorsamulet.png",
      "src": "/i/artifacts/ranger/r_warriorsamulet.png",
	  "name": "Амулет удачи рейнджера"
    },
    {
      "fname": "r_m_amulet.png",
      "src": "/i/artifacts/ranger/r_m_amulet.png",
	  "name": "Амулет энергии рейнджера"
    },
    {
      "fname": "r_warring.png",
      "src": "/i/artifacts/ranger/r_warring.png",
	  "name": "Кольцо ловкости рейнджера"
    },
    {
      "fname": "r_magicsring.png",
      "src": "/i/artifacts/ranger/r_magicsring.png",
	  "name": "Кольцо духа рейнджера"
    },
    {
      "fname": "r_helmb.png",
      "src": "/i/artifacts/ranger/r_helmb.png",
	  "name": "Шлем рейнджера"
    }
  ],
  "Комплект Тактика": [
    {
      "fname": "tactaz_axe.png",
      "src": "/i/artifacts/tact/tactaz_axe.png",
	  "name": "Топор тактика"
    },
    {
      "fname": "tactmag_staff.png",
      "src": "/i/artifacts/tact/tactmag_staff.png",
	  "name": "Посох тактика"
    },
    {
      "fname": "tactsm0_dagger.png",
      "src": "/i/artifacts/tact/tactsm0_dagger.png",
	  "name": "Кинжал тактика"
    },
    {
      "fname": "tactdff_shield.png",
      "src": "/i/artifacts/tact/tactdff_shield.png",
	  "name": "Щит тактика"
    },
    {
      "fname": "tactzl4_boots.png",
      "src": "/i/artifacts/tact/tactzl4_boots.png",
	  "name": "Сапоги тактика"
    },
    {
      "fname": "tactcv1_armor.png",
      "src": "/i/artifacts/tact/tactcv1_armor.png",
	  "name": "Доспех тактика"
    },
    {
      "fname": "tactpow_cloack.png",
      "src": "/i/artifacts/tact/tactpow_cloack.png",
	  "name": "Плащ тактика"
    },
    {
      "fname": "tact765_bow.png",
      "src": "/i/artifacts/tact/tact765_bow.png",
	  "name": "Лук тактика"
    },
    {
      "fname": "tactms1_mamulet.png",
      "src": "/i/artifacts/tact/tactms1_mamulet.png",
	  "name": "Магический амулет тактика"
    },
    {
      "fname": "tact1w1_wamulet.png",
      "src": "/i/artifacts/tact/tact1w1_wamulet.png",
	  "name": "Боевой кулон тактика"
    },
    {
      "fname": "tactspw_mring.png",
      "src": "/i/artifacts/tact/tactspw_mring.png",
	  "name": "Кольцо мудрости тактика"
    },
    {
      "fname": "tactwww_wring.png",
      "src": "/i/artifacts/tact/tactwww_wring.png",
	  "name": "Кольцо силы тактика"
    },
    {
      "fname": "tacthapp_helmet.png",
      "src": "/i/artifacts/tact/tacthapp_helmet.png",
	  "name": "Шлем тактика"
    }
  ],
  "Комплект Вербовщика": [
    {
      "fname": "verb11_sword.png",
      "src": "/i/artifacts/verb/verb11_sword.png",
	  "name": "Меч вербовщика"
    },
    {
      "fname": "vrb_shild.png",
      "src": "/i/artifacts/verb/vrb_shild.png",
	  "name": "Щит вербовщика"
    },
    {
      "fname": "verbboots.png",
      "src": "/i/artifacts/verb/verbboots.png",
	  "name": "Сапоги вербовщика"
    },
    {
      "fname": "v_1armor.png",
      "src": "/i/artifacts/verb/v_1armor.png",
	  "name": "Доспех вербовщика"
    },
    {
      "fname": "ve_helm.png",
      "src": "/i/artifacts/verb/ve_helm.png",
	  "name": "Шлем вербовщика"
    }
  ],
  "Комплект Наёмника-воина": [
    {
      "fname": "merc_sword.png",
      "src": "/i/artifacts/merc_sword.png",
	  "name": "Меч наёмника-воина"
    },
    {
      "fname": "merc_dagger.png",
      "src": "/i/artifacts/merc_dagger.png",
	  "name": "Кинжал наёмника-воина"
    },
    {
      "fname": "merc_boots.png",
      "src": "/i/artifacts/merc_boots.png",
	  "name": "Сапоги наёмника-воина"
    },
    {
      "fname": "merc_armor.png",
      "src": "/i/artifacts/merc_armor.png",
	  "name": "Броня наёмника-воина"
    }
  ],
  "Комплект Рыцаря-воина": [
    {
      "fname": "kk_sword.png",
      "src": "/i/artifacts/kwar/kk_sword.png",
	  "name": "Меч рыцаря-воина"
    },
    {
      "fname": "kk_shield.png",
      "src": "/i/artifacts/kwar/kk_shield.png",
	  "name": "Щит рыцаря-воина"
    },
    {
      "fname": "kk_boots.png",
      "src": "/i/artifacts/kwar/kk_boots.png",
	  "name": "Сапоги рыцаря-воина"
    },
    {
      "fname": "kk_armor.png",
      "src": "/i/artifacts/kwar/kk_armor.png",
	  "name": "Доспех рыцаря-воина"
    },
    {
      "fname": "kk_helmet.png",
      "src": "/i/artifacts/kwar/kk_helmet.png",
	  "name": "Шлем рыцаря-воина"
    }
  ],
  "Комплект Паладина": [
    {
      "fname": "hc_sword.png",
      "src": "/i/artifacts/kwar/hc_sword.png",
	  "name": "Меч паладина"
    },
    {
      "fname": "hc_shield.png",
      "src": "/i/artifacts/kwar/hc_shield.png",
	  "name": "Щит паладина"
    },
    {
      "fname": "hc_boots.png",
      "src": "/i/artifacts/kwar/hc_boots.png",
	  "name": "Сапоги паладина"
    },
    {
      "fname": "hc_armor.png",
      "src": "/i/artifacts/kwar/hc_armor.png",
	  "name": "Доспех паладина"
    },
    {
      "fname": "hc_helmet.png",
      "src": "/i/artifacts/kwar/hc_helmet.png",
	  "name": "Шлем паладина"
    },
    {
      "fname": "hc_crossbow.png",
      "src": "/i/artifacts/kwar/hc_crossbow.png",
	  "name": "Арбалет паладина"
    }
  ],
  "Комплект Некроманта-ученика": [
    {
      "fname": "necr_staff.png",
      "src": "/i/artifacts/necr_staff.png",
	  "name": "Посох некроманта-ученика"
    },
    {
      "fname": "necr_cloak.png",
      "src": "/i/artifacts/necr_cloak.png",
	  "name": "Халат некроманта-ученика"
    },
    {
      "fname": "necr_helm.png",
      "src": "/i/artifacts/necr_helm.png",
	  "name": "Капюшон некроманта-ученика"
    },
    {
      "fname": "necr_amulet.png",
      "src": "/i/artifacts/necr_amulet.png",
	  "name": "Амулет некроманта-ученика"
    }
  ],
  "Комплект Мага-ученика": [
    {
      "fname": "mage_staff.png",
      "src": "/i/artifacts/war/mage_staff.png",
	  "name": "Посох мага-ученика"
    },
    {
      "fname": "mage_scroll.png",
      "src": "/i/artifacts/war/mage_scroll.png",
	  "name": "Свиток мага-ученика"
    },
    {
      "fname": "mage_boots.png",
      "src": "/i/artifacts/war/mage_boots.png",
	  "name": "Сапоги мага-ученика"
    },
    {
      "fname": "mage_robe.png",
      "src": "/i/artifacts/war/mage_robe.png",
	  "name": "Роба мага-ученика"
    },
    {
      "fname": "mage_cape.png",
      "src": "/i/artifacts/war/mage_cape.png",
	  "name": "Плащ мага-ученика"
    },
    {
      "fname": "mage_hat.png",
      "src": "/i/artifacts/war/mage_hat.png",
	  "name": "Шляпа мага-ученика"
    }
  ],
  "Комплект Великого мага": [
    {
      "fname": "bm_staff.png",
      "src": "/i/artifacts/kwar/bm_staff.png",
	  "name": "Посох великого мага"
    },
    {
      "fname": "bm_scroll.png",
      "src": "/i/artifacts/kwar/bm_scroll.png",
	  "name": "Свиток великого мага"
    },
    {
      "fname": "bm_boots.png",
      "src": "/i/artifacts/kwar/bm_boots.png",
	  "name": "Сапоги великого мага"
    },
    {
      "fname": "bm_robe.png",
      "src": "/i/artifacts/kwar/bm_robe.png",
	  "name": "Роба великого мага"
    },
    {
      "fname": "bm_cloack.png",
      "src": "/i/artifacts/kwar/bm_cloack.png",
	  "name": "Накидка великого мага"
    },
    {
      "fname": "bm_crown.png",
      "src": "/i/artifacts/kwar/bm_crown.png",
	  "name": "Корона великого мага"
    }
  ],
  "Комплект Эльфа-скаута": [
    {
      "fname": "elfbow.png",
      "src": "/i/artifacts/elfbow.png",
	  "name": "Лук эльфа-скаута"
    },
    {
      "fname": "elfboots.png",
      "src": "/i/artifacts/elfboots.png",
	  "name": "Сапоги эльфа-скаута"
    },
    {
      "fname": "elfshirt.png",
      "src": "/i/artifacts/elfshirt.png",
	  "name": "Рубаха эльфа-скаута"
    },
    {
      "fname": "elfamulet.png",
      "src": "/i/artifacts/elfamulet.png",
	  "name": "Амулет эльфа-скаута"
    }
  ],
  "Комплект Эльфа-воина": [
    {
      "fname": "ew_sword.png",
      "src": "/i/artifacts/kwar/ew_sword.png",
	  "name": "Меч эльфа-воина"
    },
    {
      "fname": "ew_shield.png",
      "src": "/i/artifacts/kwar/ew_shield.png",
	  "name": "Щит эльфа-воина"
    },
    {
      "fname": "ew_bootshields.png",
      "src": "/i/artifacts/kwar/ew_bootshields.png",
	  "name": "Поножи эльфа-воина"
    },
    {
      "fname": "ew_armor.png",
      "src": "/i/artifacts/kwar/ew_armor.png",
	  "name": "Доспех эльфа-воина"
    },
    {
      "fname": "ew_bow.png",
      "src": "/i/artifacts/kwar/ew_bow.png",
	  "name": "Лук эльфа-воина"
    },
    {
      "fname": "ew_helmet.png",
      "src": "/i/artifacts/kwar/ew_helmet.png",
	  "name": "Шлем эльфа-воина"
    }
  ],
  "Комплект Друида": [
    {
      "fname": "dd_staff.png",
      "src": "/i/artifacts/kwar/dd_staff.png",
	  "name": "Посох друида"
    },
    {
      "fname": "dd_boots.png",
      "src": "/i/artifacts/kwar/dd_boots.png",
	  "name": "Сапоги друида"
    },
    {
      "fname": "dd_cloack.png",
      "src": "/i/artifacts/kwar/dd_cloack.png",
	  "name": "Плащ друида"
    },
    {
      "fname": "dd_robe.png",
      "src": "/i/artifacts/kwar/dd_robe.png",
	  "name": "Роба друида"
    },
    {
      "fname": "dd_amulet.png",
      "src": "/i/artifacts/kwar/dd_amulet.png",
	  "name": "Амулет друида"
    }
  ],
  "Комплект Варвара-воина": [
    {
      "fname": "barb_club.png",
      "src": "/i/artifacts/barb_club.png",
	  "name": "Дубина варвара-воина"
    },
    {
      "fname": "barb_shield.png",
      "src": "/i/artifacts/barb_shield.png",
	  "name": "Щит варвара-воина"
    },
    {
      "fname": "barb_armor.png",
      "src": "/i/artifacts/barb_armor.png",
	  "name": "Броня варвара-воина"
    },
    {
      "fname": "barb_boots.png",
      "src": "/i/artifacts/barb_boots.png",
	  "name": "Сапоги варвара-воина"
    },
    {
      "fname": "barb_helm.png",
      "src": "/i/artifacts/barb_helm.png",
	  "name": "Шлем варвара-воина"
    }
  ],
  "Комплект Слуги тьмы": [
    {
      "fname": "darkelfstaff.png",
      "src": "/i/artifacts/darkelfstaff.png",
	  "name": "Посох слуги тьмы"
    },
    {
      "fname": "darkelfboots.png",
      "src": "/i/artifacts/darkelfboots.png",
	  "name": "Сапоги слуги тьмы"
    },
    {
      "fname": "darkelfcloack.png",
      "src": "/i/artifacts/darkelfcloack.png",
	  "name": "Плащ слуги тьмы"
    },
    {
      "fname": "darkelfciras.png",
      "src": "/i/artifacts/darkelfciras.png",
	  "name": "Кираса слуги тьмы"
    },
    {
      "fname": "darkelfpendant.png",
      "src": "/i/artifacts/darkelfpendant.png",
	  "name": "Кулон слуги тьмы"
    },
    {
      "fname": "darkelfkaska.png",
      "src": "/i/artifacts/darkelfkaska.png",
	  "name": "Венец слуги тьмы"
    }
  ],
  "Комплект Демона-воина": [
    {
      "fname": "dem_axe.png",
      "src": "/i/artifacts/dem_axe.png",
	  "name": "Топор демона-воина"
    },
    {
      "fname": "dem_shield.png",
      "src": "/i/artifacts/dem_shield.png",
	  "name": "Щит демона-воина"
    },
    {
      "fname": "dem_bootshields.png",
      "src": "/i/artifacts/dem_bootshields.png",
	  "name": "Стальные щитки демона-воина"
    },
    {
      "fname": "dem_armor.png",
      "src": "/i/artifacts/dem_armor.png",
	  "name": "Броня демона-воина"
    },
    {
      "fname": "dem_amulet.png",
      "src": "/i/artifacts/dem_amulet.png",
	  "name": "Амулет демона-воина"
    },
    {
      "fname": "dem_helmet.png",
      "src": "/i/artifacts/dem_helmet.png",
	  "name": "Шлем демона-воина"
    }
  ],
  "Комплект Гнома-воина": [
    {
      "fname": "hammer1.png",
      "src": "/i/artifacts/gnomewar/hammer1.png",
	  "name": "Молот гнома-воина"
    },
    {
      "fname": "shield1.png",
      "src": "/i/artifacts/gnomewar/shield1.png",
	  "name": "Щит гнома-воина"
    },
    {
      "fname": "boots1.png",
      "src": "/i/artifacts/gnomewar/boots1.png",
	  "name": "Сапоги гнома-воина"
    },
    {
      "fname": "armor1.png",
      "src": "/i/artifacts/gnomewar/armor1.png",
	  "name": "Доспех гнома-воина"
    },
    {
      "fname": "helmet1.png",
      "src": "/i/artifacts/gnomewar/helmet1.png",
	  "name": "Шлем гнома-воина"
    }
  ],
  "Комплект Гнома-мастера": [
    {
      "fname": "hammer2.png",
      "src": "/i/artifacts/gnomewar/hammer2.png",
	  "name": "Молот гнома-мастера"
    },
    {
      "fname": "shield2.png",
      "src": "/i/artifacts/gnomewar/shield2.png",
	  "name": "Щит гнома-мастера"
    },
    {
      "fname": "gw_boots2.png",
      "src": "/i/artifacts/gnomewar/gw_boots2.png",
	  "name": "Сапоги гнома-мастера"
    },
    {
      "fname": "armor2.png",
      "src": "/i/artifacts/gnomewar/armor2.png",
	  "name": "Доспех гнома-мастера"
    },
    {
      "fname": "helmet2.png",
      "src": "/i/artifacts/gnomewar/helmet2.png",
	  "name": "Шлем гнома-мастера"
    },
    {
      "fname": "amulet2.png",
      "src": "/i/artifacts/gnomewar/amulet2.png",
	  "name": "Амулет гнома-мастера"
    }
  ],
  "Комплект Степного варвара": [
    {
      "fname": "sv_weap.png",
      "src": "/i/artifacts/bwar/sv_weap.png",
	  "name": "Дубина степного варвара"
    },
    {
      "fname": "sv_shield.png",
      "src": "/i/artifacts/bwar/sv_shield.png",
	  "name": "Щит степного варвара"
    },
    {
      "fname": "sv_boot.png",
      "src": "/i/artifacts/bwar/sv_boot.png",
	  "name": "Сапоги степного варвара"
    },
    {
      "fname": "sv_body.png",
      "src": "/i/artifacts/bwar/sv_body.png",
	  "name": "Доспех степного варвара"
    },
    {
      "fname": "sv_helm.png",
      "src": "/i/artifacts/bwar/sv_helm.png",
	  "name": "Шлем степного варвара"
    },
    {
      "fname": "sv_arb.png",
      "src": "/i/artifacts/bwar/sv_arb.png",
	  "name": "Арбалет степного варвара"
    }
  ],
  "Комплект Непокорного варвара": [
    {
      "fname": "nv_weap.png",
      "src": "/i/artifacts/bwar/nv_weap.png",
	  "name": "Меч непокорного варвара"
    },
    {
      "fname": "nv_shield.png",
      "src": "/i/artifacts/bwar/nv_shield.png",
	  "name": "Щит непокорного варвара"
    },
    {
      "fname": "nv_body.png",
      "src": "/i/artifacts/bwar/nv_body.png",
	  "name": "Доспех непокорного варвара"
    },
    {
      "fname": "nv_boot.png",
      "src": "/i/artifacts/bwar/nv_boot.png",
	  "name": "Сапоги непокорного варвара"
    },
    {
      "fname": "nv_helm.png",
      "src": "/i/artifacts/bwar/nv_helm.png",
	  "name": "Шлем непокорного варвара"
    }
  ],
  "Комплект Рыцаря солнца": [
    {
      "fname": "kn_weap.png",
      "src": "/i/artifacts/bwar/kn_weap.png",
	  "name": "Меч рыцаря солнца"
    },
    {
      "fname": "kn_shield.png",
      "src": "/i/artifacts/bwar/kn_shield.png",
	  "name": "Щит рыцаря солнца"
    },
    {
      "fname": "kn_body.png",
      "src": "/i/artifacts/bwar/kn_body.png",
	  "name": "Доспех рыцаря солнца"
    },
    {
      "fname": "kn_helm.png",
      "src": "/i/artifacts/bwar/kn_helm.png",
	  "name": "Шлем рыцаря солнца"
    }
  ],
  "Комплект Инквизитора": [
    {
      "fname": "inq_weap.png",
      "src": "/i/artifacts/bwar/inq_weap.png",
	  "name": "Посох инквизитора"
    },
    {
      "fname": "inq_boot.png",
      "src": "/i/artifacts/bwar/inq_boot.png",
	  "name": "Сапоги инквизитора"
    },
    {
      "fname": "inq_body.png",
      "src": "/i/artifacts/bwar/inq_body.png",
	  "name": "Доспех инквизитора"
    },
    {
      "fname": "inq_cl.png",
      "src": "/i/artifacts/bwar/inq_cl.png",
	  "name": "Плащ инквизитора"
    },
    {
      "fname": "inq_helm.png",
      "src": "/i/artifacts/bwar/inq_helm.png",
	  "name": "Шлем инквизитора"
    }
  ],
  "Комплект Амфибии": [
    {
      "fname": "amf_weap.png",
      "src": "/i/artifacts/bwar/amf_weap.png",
	  "name": "Посох амфибии"
    },
    {
      "fname": "amf_scroll.png",
      "src": "/i/artifacts/bwar/amf_scroll.png",
	  "name": "Свиток амфибии"
    },
    {
      "fname": "amf_boot.png",
      "src": "/i/artifacts/bwar/amf_boot.png",
	  "name": "Поножи амфибии"
    },
    {
      "fname": "amf_body.png",
      "src": "/i/artifacts/bwar/amf_body.png",
	  "name": "Доспех амфибии"
    },
    {
      "fname": "amf_cl.png",
      "src": "/i/artifacts/bwar/amf_cl.png",
	  "name": "Накидка амфибии"
    },
    {
      "fname": "amf_helm.png",
      "src": "/i/artifacts/bwar/amf_helm.png",
	  "name": "Шлем амфибии"
    }
  ],
  "Комплект Сурвилурга": [
    {
      "fname": "surv_sword_surv.png",
      "src": "/i/artifacts/survarts/surv_sword_surv.png",
	  "name": "Меч сурвилурга"
    },
    {
      "fname": "surv_wring1my.png",
      "src": "/i/artifacts/survarts/surv_wring1my.png",
	  "name": "Кольцо силы сурвилурга"
    },
    {
      "fname": "surv_crossbowsurv.png",
      "src": "/i/artifacts/survarts/surv_crossbowsurv.png",
	  "name": "Арбалет сурвилурга"
    },
    {
      "fname": "surv_shieldvv.png",
      "src": "/i/artifacts/survarts/surv_shieldvv.png",
	  "name": "Щит сурвилурга"
    },
    {
      "fname": "surv_bootsurv.png",
      "src": "/i/artifacts/survarts/surv_bootsurv.png",
	  "name": "Сапоги сурвилурга"
    },
    {
      "fname": "surv_armorsu.png",
      "src": "/i/artifacts/survarts/surv_armorsu.png",
	  "name": "Доспех сурвилурга"
    },
    {
      "fname": "surv_wamuletik.png",
      "src": "/i/artifacts/survarts/surv_wamuletik.png",
	  "name": "Амулет сурвилурга"
    },
    {
      "fname": "surv_helmetpi.png",
      "src": "/i/artifacts/survarts/surv_helmetpi.png",
	  "name": "Шлем сурвилурга"
    },
    {
      "fname": "surv_staffik.png",
      "src": "/i/artifacts/survarts/surv_staffik.png",
	  "name": "Посох сурвилурга"
    },
    {
      "fname": "surv_mring1fd.png",
      "src": "/i/artifacts/survarts/surv_mring1fd.png",
	  "name": "Магическое кольцо сурвилурга"
    },
    {
      "fname": "surv_mcloacksv.png",
      "src": "/i/artifacts/survarts/surv_mcloacksv.png",
	  "name": "Мантия сурвилурга"
    },
    {
      "fname": "surv_scrollcd.png",
      "src": "/i/artifacts/survarts/surv_scrollcd.png",
	  "name": "Свиток сурвилурга"
    },
    {
      "fname": "surv_mbootsbb.png",
      "src": "/i/artifacts/survarts/surv_mbootsbb.png",
	  "name": "Магические сапоги сурвилурга"
    },
    {
      "fname": "surv_marmoroz.png",
      "src": "/i/artifacts/survarts/surv_marmoroz.png",
	  "name": "Магический доспех сурвилурга"
    },
    {
      "fname": "surv_mamulka.png",
      "src": "/i/artifacts/survarts/surv_mamulka.png",
	  "name": "Магический амулет сурвилурга"
    },
    {
      "fname": "surv_mhelmetcv.png",
      "src": "/i/artifacts/survarts/surv_mhelmetcv.png",
	  "name": "Магический шлем сурвилурга"
    },
    {
      "fname": "surv_sword2sd.png",
      "src": "/i/artifacts/survarts/surv_sword2sd.png",
	  "name": "Клинок сурвилурга"
    },
    {
      "fname": "surv_mring2fpg.png",
      "src": "/i/artifacts/survarts/surv_mring2fpg.png",
	  "name": "Кольцо мудрости сурвилурга"
    },
    {
      "fname": "surv_cloacksrv.png",
      "src": "/i/artifacts/survarts/surv_cloacksrv.png",
	  "name": "Плащ сурвилурга"
    },
    {
      "fname": "surv_daggermd.png",
      "src": "/i/artifacts/survarts/surv_daggermd.png",
	  "name": "Кинжал сурвилурга"
    },
    {
      "fname": "surv_halberdzg.png",
      "src": "/i/artifacts/survarts/surv_halberdzg.png",
	  "name": "Алебарда сурвилурга"
    },
    {
      "fname": "surv_wring2o.png",
      "src": "/i/artifacts/survarts/surv_wring2o.png",
	  "name": "Золотое кольцо сурвилурга"
    },
    {
      "fname": "surv_axes.png",
      "src": "/i/artifacts/survarts/surv_axes.png",
	  "name": "Топор сурвилурга"
    }
  ],
  "Комплект Времён": [
    {
      "fname": "vtmsword3.png",
      "src": "/i/artifacts/events/vtmsword3.png",
	  "name": "Лёгкий меч времён"
    },
    {
      "fname": "vtmaxe3.png",
      "src": "/i/artifacts/events/vtmaxe3.png",
	  "name": "Лёгкий топор времён"
    },
    {
      "fname": "staff_v3.png",
      "src": "/i/artifacts/events/staff_v3.png",
	  "name": "Лёгкий посох времён"
    },
    {
      "fname": "vrdagger3.png",
      "src": "/i/artifacts/events/vrdagger3.png",
	  "name": "Лёгкий кинжал времён"
    },
    {
      "fname": "mring3.png",
      "src": "/i/artifacts/events/mring3.png",
	  "name": "Простое магическое кольцо времён"
    },
    {
      "fname": "v-ring3.png",
      "src": "/i/artifacts/v-ring3.png",
	  "name": "Малое кольцо времён"
    },
    {
      "fname": "vbolt3.png",
      "src": "/i/artifacts/event/vbolt3.png",
	  "name": "Малый перстень времён"
    },
    {
      "fname": "tj-shield3.png",
      "src": "/i/artifacts/tj-shield3.png",
	  "name": "Лёгкий щит времён"
    },
    {
      "fname": "vscroll3.png",
      "src": "/i/artifacts/events/vscroll3.png",
	  "name": "Малый свиток времён"
    },
    {
      "fname": "tj_vboots3.png",
      "src": "/i/artifacts/tj_vboots3.png",
	  "name": "Лёгкие сапоги времён"
    },
    {
      "fname": "tj_mtuf3.png",
      "src": "/i/artifacts/events/tj_mtuf3.png",
	  "name": "Лёгкие туфли времён"
    },
    {
      "fname": "vtmsword2.png",
      "src": "/i/artifacts/events/vtmsword2.png",
	  "name": "Меч времён"
    },
    {
      "fname": "vtmaxe2.png",
      "src": "/i/artifacts/events/vtmaxe2.png",
	  "name": "Топор времён"
    },
    {
      "fname": "staff_v2.png",
      "src": "/i/artifacts/events/staff_v2.png",
	  "name": "Посох времён"
    },
    {
      "fname": "vrdagger2.png",
      "src": "/i/artifacts/events/vrdagger2.png",
	  "name": "Кинжал времён"
    },
    {
      "fname": "mring2.png",
      "src": "/i/artifacts/events/mring2.png",
	  "name": "Магическое кольцо времён"
    },
    {
      "fname": "v-ring2.png",
      "src": "/i/artifacts/v-ring2.png",
	  "name": "Кольцо времён"
    },
    {
      "fname": "vbolt2.png",
      "src": "/i/artifacts/event/vbolt2.png",
	  "name": "Перстень времён"
    },
    {
      "fname": "tj-shield2.png",
      "src": "/i/artifacts/tj-shield2.png",
	  "name": "Щит времён"
    },
    {
      "fname": "vscroll2.png",
      "src": "/i/artifacts/events/vscroll2.png",
	  "name": "Свиток времён"
    },
    {
      "fname": "tj_vboots2.png",
      "src": "/i/artifacts/tj_vboots2.png",
	  "name": "Сапоги времён"
    },
    {
      "fname": "tj_mtuf2.png",
      "src": "/i/artifacts/events/tj_mtuf2.png",
	  "name": "Туфли времён"
    },
    {
      "fname": "vtmsword1.png",
      "src": "/i/artifacts/events/vtmsword1.png",
	  "name": "Великий меч времён"
    },
    {
      "fname": "vtmaxe1.png",
      "src": "/i/artifacts/events/vtmaxe1.png",
	  "name": "Великий топор времён"
    },
    {
      "fname": "staff_v1.png",
      "src": "/i/artifacts/events/staff_v1.png",
	  "name": "Великий посох времён"
    },
    {
      "fname": "vrdagger1.png",
      "src": "/i/artifacts/events/vrdagger1.png",
	  "name": "Мифриловый кинжал времён"
    },
    {
      "fname": "mring1.png",
      "src": "/i/artifacts/events/mring1.png",
	  "name": "Великое магическое кольцо времён"
    },
    {
      "fname": "v-ring1.png",
      "src": "/i/artifacts/v-ring1.png",
	  "name": "Мифриловое кольцо времён"
    },
    {
      "fname": "vbolt1.png",
      "src": "/i/artifacts/event/vbolt1.png",
	  "name": "Мифриловый перстень времён"
    },
    {
      "fname": "tj-shield1.png",
      "src": "/i/artifacts/tj-shield1.png",
	  "name": "Тяжёлый щит времён"
    },
    {
      "fname": "vscroll1.png",
      "src": "/i/artifacts/events/vscroll1.png",
	  "name": "Великий свиток времён"
    },
    {
      "fname": "tj_vboots1.png",
      "src": "/i/artifacts/tj_vboots1.png",
	  "name": "Тяжёлые сапоги времён"
    },
    {
      "fname": "tj_mtuf1.png",
      "src": "/i/artifacts/events/tj_mtuf1.png",
	  "name": "Великие туфли времён"
    },
    {
      "fname": "tjarmor3.png",
      "src": "/i/artifacts/tjarmor3.png",
	  "name": "Лёгкий доспех времён"
    },
    {
      "fname": "tmarmor3.png",
      "src": "/i/artifacts/events/tmarmor3.png",
	  "name": "Лёгкая роба времён"
    },
    {
      "fname": "vbow3.png",
      "src": "/i/artifacts/event/vbow3.png",
	  "name": "Лёгкий лук времён"
    },
    {
      "fname": "vtjcloak3.png",
      "src": "/i/artifacts/other/vtjcloak3.png",
	  "name": "Лёгкий плащ времён"
    },
    {
      "fname": "mtcloak3.png",
      "src": "/i/artifacts/other/mtcloak3.png",
	  "name": "Лёгкая мантия времён"
    },
    {
      "fname": "tjam3.png",
      "src": "/i/artifacts/tjam3.png",
	  "name": "Малый кулон времён"
    },
    {
      "fname": "tj_magam3.png",
      "src": "/i/artifacts/events/tj_magam3.png",
	  "name": "Малый амулет времён"
    },
    {
      "fname": "tj_helmet3.png",
      "src": "/i/artifacts/tj_helmet3.png",
	  "name": "Лёгкий шлем времён"
    },
    {
      "fname": "mhelmv3.png",
      "src": "/i/artifacts/events/mhelmv3.png",
	  "name": "Лёгкий магический шлем времён"
    },
    {
      "fname": "sph3.png",
      "src": "/i/artifacts/events/sph3.png",
	  "name": "Простая сфера времён"
    },
    {
      "fname": "tjarmor2.png",
      "src": "/i/artifacts/tjarmor2.png",
	  "name": "Доспех времён"
    },
    {
      "fname": "tmarmor2.png",
      "src": "/i/artifacts/events/tmarmor2.png",
	  "name": "Роба времён"
    },
    {
      "fname": "vbow2.png",
      "src": "/i/artifacts/event/vbow2.png",
	  "name": "Лук времён"
    },
    {
      "fname": "vtjcloak2.png",
      "src": "/i/artifacts/other/vtjcloak2.png",
	  "name": "Плащ времён"
    },
    {
      "fname": "mtcloak2.png",
      "src": "/i/artifacts/other/mtcloak2.png",
	  "name": "Мантия времён"
    },
    {
      "fname": "tjam2.png",
      "src": "/i/artifacts/tjam2.png",
	  "name": "Кулон времён"
    },
    {
      "fname": "tj_magam2.png",
      "src": "/i/artifacts/events/tj_magam2.png",
	  "name": "Амулет времён"
    },
    {
      "fname": "tj_helmet2.png",
      "src": "/i/artifacts/tj_helmet2.png",
	  "name": "Шлем времён"
    },
    {
      "fname": "mhelmv2.png",
      "src": "/i/artifacts/events/mhelmv2.png",
	  "name": "Магический шлем времён"
    },
    {
      "fname": "sph2.png",
      "src": "/i/artifacts/events/sph2.png",
	  "name": "Сфера времён"
    },
    {
      "fname": "tjarmor1.png",
      "src": "/i/artifacts/tjarmor1.png",
	  "name": "Тяжёлый доспех времён"
    },
    {
      "fname": "tmarmor1.png",
      "src": "/i/artifacts/events/tmarmor1.png",
	  "name": "Великая роба времён"
    },
    {
      "fname": "vbow1.png",
      "src": "/i/artifacts/event/vbow1.png",
	  "name": "Великий лук времён"
    },
    {
      "fname": "vtjcloak1.png",
      "src": "/i/artifacts/other/vtjcloak1.png",
	  "name": "Великий плащ времён"
    },
    {
      "fname": "mtcloak1.png",
      "src": "/i/artifacts/other/mtcloak1.png",
	  "name": "Великая мантия времён"
    },
    {
      "fname": "tjam1.png",
      "src": "/i/artifacts/tjam1.png",
	  "name": "Мифриловый кулон времён"
    },
    {
      "fname": "tj_magam1.png",
      "src": "/i/artifacts/events/tj_magam1.png",
	  "name": "Мифриловый амулет времён"
    },
    {
      "fname": "tj_helmet1.png",
      "src": "/i/artifacts/tj_helmet1.png",
	  "name": "Тяжёлый шлем времён"
    },
    {
      "fname": "mhelmv1.png",
      "src": "/i/artifacts/events/mhelmv1.png",
	  "name": "Великий магический шлем времён"
    },
    {
      "fname": "sph1.png",
      "src": "/i/artifacts/events/sph1.png",
	  "name": "Великая сфера времён"
    }
  ],
  "Комплект Мироходца": [
    {
      "fname": "mh_sword3.png",
      "src": "/i/artifacts/events/mh_sword3.png",
	  "name": "Лёгкий меч мироходца"
    },
    {
      "fname": "mir_am3.png",
      "src": "/i/artifacts/events/mir_am3.png",
	  "name": "Простой амулет мироходца"
    },
    {
      "fname": "mir_shld3.png",
      "src": "/i/artifacts/events/mir_shld3.png",
	  "name": "Лёгкий щит мироходца"
    },
    {
      "fname": "mir_armor3.png",
      "src": "/i/artifacts/events/mir_armor3.png",
	  "name": "Лёгкий доспех мироходца"
    },
    {
      "fname": "mir_boots3.png",
      "src": "/i/artifacts/events/mir_boots3.png",
	  "name": "Лёгкие сапоги мироходца"
    },
    {
      "fname": "mir_helmt3.png",
      "src": "/i/artifacts/events/mir_helmt3.png",
	  "name": "Лёгкий шлем мироходца"
    },
    {
      "fname": "mir_cl3.png",
      "src": "/i/artifacts/events/mir_cl3.png",
	  "name": "Лёгкий плащ мироходца"
    },
    {
      "fname": "mir_bow3.png",
      "src": "/i/artifacts/events/mir_bow3.png",
	  "name": "Лёгкий лук мироходца"
    },
    {
      "fname": "mirh_ring3.png",
      "src": "/i/artifacts/events/mirh_ring3.png",
	  "name": "Простое кольцо мироходца"
    },
    {
      "fname": "mh_dag3.png",
      "src": "/i/artifacts/events/mh_dag3.png",
	  "name": "Лёгкий кинжал мироходца"
    },
    {
      "fname": "mh_sword2.png",
      "src": "/i/artifacts/events/mh_sword2.png",
	  "name": "Меч мироходца"
    },
    {
      "fname": "mir_am2.png",
      "src": "/i/artifacts/events/mir_am2.png",
	  "name": "Амулет мироходца"
    },
    {
      "fname": "mir_shld2.png",
      "src": "/i/artifacts/events/mir_shld2.png",
	  "name": "Щит мироходца"
    },
    {
      "fname": "mir_armor2.png",
      "src": "/i/artifacts/events/mir_armor2.png",
	  "name": "Доспех мироходца"
    },
    {
      "fname": "mir_boots2.png",
      "src": "/i/artifacts/events/mir_boots2.png",
	  "name": "Сапоги мироходца"
    },
    {
      "fname": "mir_helmt2.png",
      "src": "/i/artifacts/events/mir_helmt2.png",
	  "name": "Шлем мироходца"
    },
    {
      "fname": "mir_cl2.png",
      "src": "/i/artifacts/events/mir_cl2.png",
	  "name": "Плащ мироходца"
    },
    {
      "fname": "mir_bow2.png",
      "src": "/i/artifacts/events/mir_bow2.png",
	  "name": "Лук мироходца"
    },
    {
      "fname": "mirh_ring2.png",
      "src": "/i/artifacts/events/mirh_ring2.png",
	  "name": "Кольцо мироходца"
    },
    {
      "fname": "mh_dag2.png",
      "src": "/i/artifacts/events/mh_dag2.png",
	  "name": "Кинжал мироходца"
    },
    {
      "fname": "mh_sword1.png",
      "src": "/i/artifacts/events/mh_sword1.png",
	  "name": "Великий меч мироходца"
    },
    {
      "fname": "mir_am1.png",
      "src": "/i/artifacts/events/mir_am1.png",
	  "name": "Великий амулет мироходца"
    },
    {
      "fname": "mir_shld1.png",
      "src": "/i/artifacts/events/mir_shld1.png",
	  "name": "Тяжёлый щит мироходца"
    },
    {
      "fname": "mir_armor1.png",
      "src": "/i/artifacts/events/mir_armor1.png",
	  "name": "Тяжёлый доспех мироходца"
    },
    {
      "fname": "mir_boots1.png",
      "src": "/i/artifacts/events/mir_boots1.png",
	  "name": "Тяжёлые сапоги мироходца"
    },
    {
      "fname": "mir_helmt1.png",
      "src": "/i/artifacts/events/mir_helmt1.png",
	  "name": "Тяжёлый шлем мироходца"
    },
    {
      "fname": "mir_cl1.png",
      "src": "/i/artifacts/events/mir_cl1.png",
	  "name": "Великий плащ мироходца"
    },
    {
      "fname": "mir_bow1.png",
      "src": "/i/artifacts/events/mir_bow1.png",
	  "name": "Великий лук мироходца"
    },
    {
      "fname": "mirh_ring1.png",
      "src": "/i/artifacts/events/mirh_ring1.png",
	  "name": "Великое кольцо мироходца"
    },
    {
      "fname": "mh_dag1.png",
      "src": "/i/artifacts/events/mh_dag1.png",
	  "name": "Великий кинжал мироходца"
    }
  ],
  "Комплект Пирата": [
    {
      "fname": "p_pistol3.png",
      "src": "/i/artifacts/pirate_event/p_pistol3.png",
	  "name": "Простой пистолет пирата"
    },
    {
      "fname": "p_sword3.png",
      "src": "/i/artifacts/pirate_event/p_sword3.png",
	  "name": "Клинок пирата"
    },
    {
      "fname": "p_dag3.png",
      "src": "/i/artifacts/events/p_dag3.png",
	  "name": "Простой кинжал пирата"
    },
    {
      "fname": "piring3.png",
      "src": "/i/artifacts/pirate_event/piring3.png",
	  "name": "Простой перстень пирата"
    },
    {
      "fname": "pn_ring3.png",
      "src": "/i/artifacts/pirate_event/pn_ring3.png",
	  "name": "Малое кольцо пирата"
    },
    {
      "fname": "p_cloak3.png",
      "src": "/i/artifacts/pirate_event/p_cloak3.png",
	  "name": "Простой плащ пирата"
    },
    {
      "fname": "p_boots3.png",
      "src": "/i/artifacts/pirate_event/p_boots3.png",
	  "name": "Туфли пирата"
    },
    {
      "fname": "pir_armor3.png",
      "src": "/i/artifacts/pirate_event/pir_armor3.png",
	  "name": "Пиратская жилетка"
    },
    {
      "fname": "p_amulet3.png",
      "src": "/i/artifacts/pirate_event/p_amulet3.png",
	  "name": "Простой амулет пирата"
    },
    {
      "fname": "piratehat3.png",
      "src": "/i/artifacts/pirate_event/piratehat3.png",
	  "name": "Бандана пирата"
    },
    {
      "fname": "p_compass3.png",
      "src": "/i/artifacts/pirate_event/p_compass3.png",
	  "name": "Простой компас пирата"
    },
    {
      "fname": "p_pistol2.png",
      "src": "/i/artifacts/pirate_event/p_pistol2.png",
	  "name": "Пистолет пирата"
    },
    {
      "fname": "p_sword2.png",
      "src": "/i/artifacts/pirate_event/p_sword2.png",
	  "name": "Сабля пирата"
    },
    {
      "fname": "p_dag2.png",
      "src": "/i/artifacts/events/p_dag2.png",
	  "name": "Кинжал пирата"
    },
    {
      "fname": "piring2.png",
      "src": "/i/artifacts/pirate_event/piring2.png",
	  "name": "Перстень пирата"
    },
    {
      "fname": "pn_ring2.png",
      "src": "/i/artifacts/pirate_event/pn_ring2.png",
	  "name": "Кольцо пирата"
    },
    {
      "fname": "p_cloak2.png",
      "src": "/i/artifacts/pirate_event/p_cloak2.png",
	  "name": "Плащ пирата"
    },
    {
      "fname": "p_boots2.png",
      "src": "/i/artifacts/pirate_event/p_boots2.png",
	  "name": "Сапоги пирата"
    },
    {
      "fname": "pir_armor2.png",
      "src": "/i/artifacts/pirate_event/pir_armor2.png",
	  "name": "Пиратский сюртук"
    },
    {
      "fname": "p_amulet2.png",
      "src": "/i/artifacts/pirate_event/p_amulet2.png",
	  "name": "Амулет пирата"
    },
    {
      "fname": "piratehat2.png",
      "src": "/i/artifacts/pirate_event/piratehat2.png",
	  "name": "Шляпа пирата"
    },
    {
      "fname": "p_compass2.png",
      "src": "/i/artifacts/pirate_event/p_compass2.png",
	  "name": "Компас пирата"
    },
    {
      "fname": "p_pistol1.png",
      "src": "/i/artifacts/pirate_event/p_pistol1.png",
	  "name": "Пистолет пирата-капитана"
    },
    {
      "fname": "p_sword1.png",
      "src": "/i/artifacts/pirate_event/p_sword1.png",
	  "name": "Шпага пирата-капитана"
    },
    {
      "fname": "p_dag1.png",
      "src": "/i/artifacts/events/p_dag1.png",
	  "name": "Кинжал пирата-капитана"
    },
    {
      "fname": "piring1.png",
      "src": "/i/artifacts/pirate_event/piring1.png",
	  "name": "Перстень пирата-капитана"
    },
    {
      "fname": "pn_ring1.png",
      "src": "/i/artifacts/pirate_event/pn_ring1.png",
	  "name": "Кольцо пирата-капитана"
    },
    {
      "fname": "p_cloak1.png",
      "src": "/i/artifacts/pirate_event/p_cloak1.png",
	  "name": "Плащ пирата-капитана"
    },
    {
      "fname": "p_boots1.png",
      "src": "/i/artifacts/pirate_event/p_boots1.png",
	  "name": "Сапоги пирата-капитана"
    },
    {
      "fname": "pir_armor1.png",
      "src": "/i/artifacts/pirate_event/pir_armor1.png",
	  "name": "Камзол пирата-капитана"
    },
    {
      "fname": "p_amulet1.png",
      "src": "/i/artifacts/pirate_event/p_amulet1.png",
	  "name": "Амулет пирата-капитана"
    },
    {
      "fname": "piratehat1.png",
      "src": "/i/artifacts/pirate_event/piratehat1.png",
	  "name": "Шляпа пирата-капитана"
    },
    {
      "fname": "p_compass1.png",
      "src": "/i/artifacts/pirate_event/p_compass1.png",
	  "name": "Компас пирата-капитана"
    }
  ],
"Комплект Полководца": [
  {
    "fname": "polk_sword3.png",
    "src": "/i/artifacts/events/polk_sword3.png",
    "name": "Легкий меч полководца"
  },
  {
    "fname": "polkboots3.png",
    "src": "/i/artifacts/events/polkboots3.png",
    "name": "Лёгкие сапоги полководца"
  },
  {
    "fname": "polk_armor3.png",
    "src": "/i/artifacts/events/polk_armor3.png",
    "name": "Лёгкая кираса полководца"
  },
  {
    "fname": "polk__helm3.png",
    "src": "/i/artifacts/polk__helm3.png",
    "name": "Лёгкий шлем полководца"
  },
  {
    "fname": "polk_sword2.png",
    "src": "/i/artifacts/events/polk_sword2.png",
    "name": "Меч полководца"
  },
  {
    "fname": "polkboots2.png",
    "src": "/i/artifacts/events/polkboots2.png",
    "name": "Сапоги полководца"
  },
  {
    "fname": "polk_armor2.png",
    "src": "/i/artifacts/events/polk_armor2.png",
    "name": "Кираса полководца"
  },
  {
    "fname": "polk__helm2.png",
    "src": "/i/artifacts/polk__helm2.png",
    "name": "Шлем полководца"
  },
  {
    "fname": "gring.png",
    "src": "/i/artifacts/events/gring.png",
    "name": "Кольцо генерала"
  },
  {
    "fname": "polk_sword1.png",
    "src": "/i/artifacts/events/polk_sword1.png",
    "name": "Великий меч полководца"
  },
  {
    "fname": "polkboots1.png",
    "src": "/i/artifacts/events/polkboots1.png",
    "name": "Тяжёлые сапоги полководца"
  },
  {
    "fname": "polk_armor1.png",
    "src": "/i/artifacts/events/polk_armor1.png",
    "name": "Тяжёлая кираса полководца"
  },
  {
    "fname": "polk__helm1.png",
    "src": "/i/artifacts/polk__helm1.png",
    "name": "Тяжёлый шлем полководца"
  },
  {
    "fname": "gringd.png",
    "src": "/i/artifacts/events/gringd.png",
    "name": "Перстень генерала"
  }
],
 "Комплект Подземелий": [
  {
    "fname": "dun_sword3.png",
    "src": "/i/artifacts/events/dun_sword3.png",
    "name": "Лёгкий меч подземелий"
  },
  {
    "fname": "dun_dagger3.png",
    "src": "/i/artifacts/events/dun_dagger3.png",
    "name": "Лёгкий кинжал подземелий"
  },
  {
    "fname": "dun_bow3.png",
    "src": "/i/artifacts/events/dun_bow3.png",
    "name": "Лёгкий арбалет подземелий"
  },
  {
    "fname": "dung_axe3.png",
    "src": "/i/artifacts/events/dung_axe3.png",
    "name": "Лёгкий топор подземелий"
  },
  {
    "fname": "dun_ring3.png",
    "src": "/i/artifacts/events/dun_ring3.png",
    "name": "Простой перстень подземелий"
  },
  {
    "fname": "dun_boots3.png",
    "src": "/i/artifacts/events/dun_boots3.png",
    "name": "Легкие сапоги подземелий"
  },
  {
    "fname": "dun_armor3.png",
    "src": "/i/artifacts/events/dun_armor3.png",
    "name": "Легкий доспех подземелий"
  },
  {
    "fname": "dun_shield3.png",
    "src": "/i/artifacts/events/dun_shield3.png",
    "name": "Легкий щит подземелий"
  },
  {
    "fname": "drak_crown3.png",
    "src": "/i/artifacts/events/drak_crown3.png",
    "name": "Простая корона подземелий"
  },
  {
    "fname": "dun_bw3.png",
    "src": "/i/artifacts/events/dun_bw3.png",
    "name": "Простой лук подземелий"
  },
  {
    "fname": "dung_glefa3.png",
    "src": "/i/artifacts/events/dung_glefa3.png",
    "name": "Лёгкая глефа подземелий"
  },
  {
    "fname": "dun_pendant3.png",
    "src": "/i/artifacts/events/dun_pendant3.png",
    "name": "Простой кулон подземелий"
  },
  {
    "fname": "drak_greaves3.png",
    "src": "/i/artifacts/events/drak_greaves3.png",
    "name": "Лёгкие поножи подземелий"
  },
  {
    "fname": "drak_shield3.png",
    "src": "/i/artifacts/events/drak_shield3.png",
    "name": "Лёгкий аспис подземелий"
  },
  {
    "fname": "dun_sword2.png",
    "src": "/i/artifacts/events/dun_sword2.png",
    "name": "Меч подземелий"
  },
  {
    "fname": "dun_dagger2.png",
    "src": "/i/artifacts/events/dun_dagger2.png",
    "name": "Кинжал подземелий"
  },
  {
    "fname": "dun_bow2.png",
    "src": "/i/artifacts/events/dun_bow2.png",
    "name": "Арбалет подземелий"
  },
  {
    "fname": "dung_axe2.png",
    "src": "/i/artifacts/events/dung_axe2.png",
    "name": "Топор подземелий"
  },
  {
    "fname": "dun_ring2.png",
    "src": "/i/artifacts/events/dun_ring2.png",
    "name": "Перстень подземелий"
  },
  {
    "fname": "dering.png",
    "src": "/i/artifacts/event/dering.png",
    "name": "Кольцо подземелий"
  },
  {
    "fname": "dun_boots2.png",
    "src": "/i/artifacts/events/dun_boots2.png",
    "name": "Сапоги подземелий"
  },
  {
    "fname": "dun_armor2.png",
    "src": "/i/artifacts/events/dun_armor2.png",
    "name": "Доспех подземелий"
  },
  {
    "fname": "dun_shield2.png",
    "src": "/i/artifacts/events/dun_shield2.png",
    "name": "Щит подземелий"
  },
  {
    "fname": "drak_crown2.png",
    "src": "/i/artifacts/events/drak_crown2.png",
    "name": "Корона подземелий"
  },
  {
    "fname": "dun_bw2.png",
    "src": "/i/artifacts/events/dun_bw2.png",
    "name": "Лук подземелий"
  },
  {
    "fname": "dung_glefa2.png",
    "src": "/i/artifacts/events/dung_glefa2.png",
    "name": "Глефа подземелий"
  },
  {
    "fname": "dun_pendant2.png",
    "src": "/i/artifacts/events/dun_pendant2.png",
    "name": "Амулет подземелий"
  },
  {
    "fname": "drak_greaves2.png",
    "src": "/i/artifacts/events/drak_greaves2.png",
    "name": "Поножи подземелий"
  },
  {
    "fname": "drak_shield2.png",
    "src": "/i/artifacts/events/drak_shield2.png",
    "name": "Аспис подземелий"
  },
  {
    "fname": "hm1.png",
    "src": "/i/artifacts/events/hm1.png",
    "name": "Шлем подземелий"
  },
  {
    "fname": "dun_sword1.png",
    "src": "/i/artifacts/events/dun_sword1.png",
    "name": "Великий меч подземелий"
  },
  {
    "fname": "dun_dagger1.png",
    "src": "/i/artifacts/events/dun_dagger1.png",
    "name": "Великий кинжал подземелий"
  },
  {
    "fname": "dun_bow1.png",
    "src": "/i/artifacts/events/dun_bow1.png",
    "name": "Великий арбалет подземелий"
  },
  {
    "fname": "dung_axe1.png",
    "src": "/i/artifacts/events/dung_axe1.png",
    "name": "Великий топор подземелий"
  },
  {
    "fname": "dun_ring1.png",
    "src": "/i/artifacts/events/dun_ring1.png",
    "name": "Великий перстень подземелий"
  },
  {
    "fname": "dun_boots1.png",
    "src": "/i/artifacts/events/dun_boots1.png",
    "name": "Великие сапоги подземелий"
  },
  {
    "fname": "dun_armor1.png",
    "src": "/i/artifacts/events/dun_armor1.png",
    "name": "Великий доспех подземелий"
  },
  {
    "fname": "dun_shield1.png",
    "src": "/i/artifacts/events/dun_shield1.png",
    "name": "Великий щит подземелий"
  },
  {
    "fname": "drak_crown1.png",
    "src": "/i/artifacts/events/drak_crown1.png",
    "name": "Великая корона подземелий"
  },
  {
    "fname": "dun_bw1.png",
    "src": "/i/artifacts/events/dun_bw1.png",
    "name": "Великий лук подземелий"
  },
  {
    "fname": "dung_glefa1.png",
    "src": "/i/artifacts/events/dung_glefa1.png",
    "name": "Великая глефа подземелий"
  },
  {
    "fname": "dun_pendant1.png",
    "src": "/i/artifacts/events/dun_pendant1.png",
    "name": "Великий кулон подземелий"
  },
  {
    "fname": "drak_greaves1.png",
    "src": "/i/artifacts/events/drak_greaves1.png",
    "name": "Великие поножи подземелий"
  },
  {
    "fname": "drak_shield1.png",
    "src": "/i/artifacts/events/drak_shield1.png",
    "name": "Великий аспис подземелий"
  },
  {
    "fname": "hm2.png",
    "src": "/i/artifacts/events/hm2.png",
    "name": "Великий шлем подземелий"
  },
  {
    "fname": "dun_amul3.png",
    "src": "/i/artifacts/events/dun_amul3.png",
    "name": "Простой амулет подземелий"
  },
  {
    "fname": "dun_cloak3.png",
    "src": "/i/artifacts/events/dun_cloak3.png",
    "name": "Простой плащ подземелий"
  },
  {
    "fname": "drak_armor3.png",
    "src": "/i/artifacts/events/drak_armor3.png",
    "name": "Лёгкие латы подземелий"
  },
  {
    "fname": "dun_amul2.png",
    "src": "/i/artifacts/events/dun_amul2.png",
    "name": "Кулон подземелий"
  },
  {
    "fname": "crystal.png",
    "src": "/i/artifacts/events/crystal.png",
    "name": "Подземный кристалл"
  },
  {
    "fname": "dun_cloak2.png",
    "src": "/i/artifacts/events/dun_cloak2.png",
    "name": "Плащ подземелий"
  },
  {
    "fname": "drak_armor2.png",
    "src": "/i/artifacts/events/drak_armor2.png",
    "name": "Латы подземелий"
  },
  {
    "fname": "dun_amul1.png",
    "src": "/i/artifacts/events/dun_amul1.png",
    "name": "Великий амулет подземелий"
  },
  {
    "fname": "dun_cloak1.png",
    "src": "/i/artifacts/events/dun_cloak1.png",
    "name": "Великий плащ подземелий"
  },
  {
    "fname": "drak_armor1.png",
    "src": "/i/artifacts/events/drak_armor1.png",
    "name": "Великие латы подземелий"
  }
],
"Комплект Разбойника": [
  {
    "fname": "raxe2.png",
    "src": "/i/artifacts/events/raxe2.png",
    "name": "Лёгкий топор разбойника"
  },
  {
    "fname": "rsword2.png",
    "src": "/i/artifacts/events/rsword2.png",
    "name": "Лёгкий меч разбойника"
  },
  {
    "fname": "rdagger2.png",
    "src": "/i/artifacts/events/rdagger2.png",
    "name": "Простой кинжал разбойника"
  },
  {
    "fname": "rbow2.png",
    "src": "/i/artifacts/events/rbow2.png",
    "name": "Простой лук разбойника"
  },
  {
    "fname": "rogring2.png",
    "src": "/i/artifacts/events/rogring2.png",
    "name": "Простое кольцо разбойника"
  },
  {
    "fname": "ramul2.png",
    "src": "/i/artifacts/events/ramul2.png",
    "name": "Простой амулет разбойника"
  },
  {
    "fname": "rboots2.png",
    "src": "/i/artifacts/events/rboots2.png",
    "name": "Легкие сапоги разбойника"
  },
  {
    "fname": "rhelm2.png",
    "src": "/i/artifacts/events/rhelm2.png",
    "name": "Легкий шлем разбойника"
  },
  {
    "fname": "rarmor2.png",
    "src": "/i/artifacts/events/rarmor2.png",
    "name": "Легкая броня разбойника"
  },
  {
    "fname": "rshield2.png",
    "src": "/i/artifacts/events/rshield2.png",
    "name": "Простой щит разбойника"
  },
  {
    "fname": "rcloak2.png",
    "src": "/i/artifacts/events/rcloak2.png",
    "name": "Простой плащ разбойника"
  },
  {
    "fname": "raxe1.png",
    "src": "/i/artifacts/events/raxe1.png",
    "name": "Топор разбойника"
  },
  {
    "fname": "rsword1.png",
    "src": "/i/artifacts/events/rsword1.png",
    "name": "Меч разбойника"
  },
  {
    "fname": "rdagger1.png",
    "src": "/i/artifacts/events/rdagger1.png",
    "name": "Кинжал разбойника"
  },
  {
    "fname": "rbow1.png",
    "src": "/i/artifacts/events/rbow1.png",
    "name": "Лук разбойника"
  },
  {
    "fname": "rogring1.png",
    "src": "/i/artifacts/events/rogring1.png",
    "name": "Кольцо разбойника"
  },
  {
    "fname": "ramul1.png",
    "src": "/i/artifacts/events/ramul1.png",
    "name": "Амулет разбойника"
  },
  {
    "fname": "rboots1.png",
    "src": "/i/artifacts/events/rboots1.png",
    "name": "Сапоги разбойника"
  },
  {
    "fname": "rhelm1.png",
    "src": "/i/artifacts/events/rhelm1.png",
    "name": "Шлем разбойника"
  },
  {
    "fname": "rarmor1.png",
    "src": "/i/artifacts/events/rarmor1.png",
    "name": "Броня разбойника"
  },
  {
    "fname": "rshield1.png",
    "src": "/i/artifacts/events/rshield1.png",
    "name": "Щит разбойника"
  },
  {
    "fname": "rcloak1.png",
    "src": "/i/artifacts/events/rcloak1.png",
    "name": "Плащ разбойника"
  },
  {
    "fname": "sumka.png",
    "src": "/i/artifacts/events/sumka.png",
    "name": "Сумка разбойника"
  }
],
  "Комплект Империи": [
  {
    "fname": "imp_helmet.png",
    "src": "/i/artifacts/events/imp_helmet.png",
    "name": "Имперский шлем"
  },
  {
    "fname": "imp_amul.png",
    "src": "/i/artifacts/events/imp_amul.png",
    "name": "Имперский амулет"
  },
  {
    "fname": "imp_ring.png",
    "src": "/i/artifacts/events/imp_ring.png",
    "name": "Имперское кольцо"
  },
  {
    "fname": "imp_armor.png",
    "src": "/i/artifacts/events/imp_armor.png",
    "name": "Имперский доспех"
  },
  {
    "fname": "imp_cloak.png",
    "src": "/i/artifacts/events/imp_cloak.png",
    "name": "Имперский плащ"
  },
  {
    "fname": "imp_crossbow.png",
    "src": "/i/artifacts/events/imp_crossbow.png",
    "name": "Имперский арбалет"
  },
  {
    "fname": "imp_sword.png",
    "src": "/i/artifacts/events/imp_sword.png",
    "name": "Имперский меч"
  },
  {
    "fname": "imp_boots.png",
    "src": "/i/artifacts/events/imp_boots.png",
    "name": "Имперские сапоги"
  },
  {
    "fname": "imp_shield.png",
    "src": "/i/artifacts/events/imp_shield.png",
    "name": "Имперский щит"
  },
  {
    "fname": "imp_dagger.png",
    "src": "/i/artifacts/events/imp_dagger.png",
    "name": "Имперский кинжал"
  }
],
  "Комплект Тьмы": [
  {
    "fname": "dark_helmet.png",
    "src": "/i/artifacts/events/dark_helmet.png",
    "name": "Шлем тьмы"
  },
  {
    "fname": "dark_amul.png",
    "src": "/i/artifacts/events/dark_amul.png",
    "name": "Амулет тьмы"
  },
  {
    "fname": "dark_ring.png",
    "src": "/i/artifacts/events/dark_ring.png",
    "name": "Кольцо тьмы"
  },
  {
    "fname": "dark_armor.png",
    "src": "/i/artifacts/events/dark_armor.png",
    "name": "Доспех тьмы"
  },
  {
    "fname": "dark_cloak.png",
    "src": "/i/artifacts/events/dark_cloak.png",
    "name": "Плащ тьмы"
  },
  {
    "fname": "dark_bow.png",
    "src": "/i/artifacts/events/dark_bow.png",
    "name": "Лук тьмы"
  },
  {
    "fname": "dark_axe.png",
    "src": "/i/artifacts/events/dark_axe.png",
    "name": "Топор тьмы"
  },
  {
    "fname": "dark_boots.png",
    "src": "/i/artifacts/events/dark_boots.png",
    "name": "Сапоги тьмы"
  },
  {
    "fname": "dark_shield.png",
    "src": "/i/artifacts/events/dark_shield.png",
    "name": "Щит тьмы"
  },
  {
    "fname": "dark_dagger.png",
    "src": "/i/artifacts/events/dark_dagger.png",
    "name": "Кинжал тьмы"
  }
],
  "Комплект Небес": [
  {
    "fname": "heaven_helm.png",
    "src": "/i/artifacts/events/heaven_helm.png",
    "name": "Небесная диадема"
  },
  {
    "fname": "heaven_amlt.png",
    "src": "/i/artifacts/events/heaven_amlt.png",
    "name": "Небесный амулет"
  },
  {
    "fname": "heaven_rn.png",
    "src": "/i/artifacts/events/heaven_rn.png",
    "name": "Небесное кольцо"
  },
  {
    "fname": "heaven_armr.png",
    "src": "/i/artifacts/events/heaven_armr.png",
    "name": "Небесный доспех"
  },
  {
    "fname": "heaven_clk.png",
    "src": "/i/artifacts/events/heaven_clk.png",
    "name": "Небесная мантия"
  },
  {
    "fname": "heaven_bow.png",
    "src": "/i/artifacts/events/heaven_bow.png",
    "name": "Небесный лук"
  },
  {
    "fname": "heaven_staff.png",
    "src": "/i/artifacts/events/heaven_staff.png",
    "name": "Небесный посох"
  },
  {
    "fname": "heaven_bts.png",
    "src": "/i/artifacts/events/heaven_bts.png",
    "name": "Небесные сандалии"
  },
  {
    "fname": "heaven_shield.png",
    "src": "/i/artifacts/events/heaven_shield.png",
    "name": "Небесный щит"
  },
  {
    "fname": "heaven_dagger.png",
    "src": "/i/artifacts/events/heaven_dagger.png",
    "name": "Небесный кинжал"
  }
],
  "Комплект Магмы": [
  {
    "fname": "magma_helm.png",
    "src": "/i/artifacts/events/magma_helm.png",
    "name": "Магма шлем"
  },
  {
    "fname": "magma_pend.png",
    "src": "/i/artifacts/events/magma_pend.png",
    "name": "Магма кулон"
  },
  {
    "fname": "magma_armor.png",
    "src": "/i/artifacts/events/magma_armor.png",
    "name": "Магма доспех"
  },
  {
    "fname": "magma_swrd.png",
    "src": "/i/artifacts/events/magma_swrd.png",
    "name": "Магма меч"
  },
  {
    "fname": "magma_boots.png",
    "src": "/i/artifacts/events/magma_boots.png",
    "name": "Магма сапоги"
  },
  {
    "fname": "magma_lshield.png",
    "src": "/i/artifacts/events/magma_lshield.png",
    "name": "Магма щит"
  },
  {
    "fname": "magma_dagger.png",
    "src": "/i/artifacts/events/magma_dagger.png",
    "name": "Магма кинжал"
  },
  {
    "fname": "magma_rd.png",
    "src": "/i/artifacts/events/magma_rd.png",
    "name": "Магма кольцо"
  },
  {
    "fname": "magma_clc.png",
    "src": "/i/artifacts/events/magma_clc.png",
    "name": "Магма плащ"
  },
  {
    "fname": "magma_arb.png",
    "src": "/i/artifacts/events/magma_arb.png",
    "name": "Магма арбалет"
  }
],
  "Комплект Страха": [
  {
    "fname": "fear_amulk.png",
    "src": "/i/artifacts/events/fear_amulk.png",
    "name": "Амулет страха"
  },
  {
    "fname": "fear_bonearmour.png",
    "src": "/i/artifacts/events/fear_bonearmour.png",
    "name": "Роба страха"
  },
  {
    "fname": "fear_scythe.png",
    "src": "/i/artifacts/events/fear_scythe.png",
    "name": "Коса страха"
  },
  {
    "fname": "fear_boots.png",
    "src": "/i/artifacts/events/fear_boots.png",
    "name": "Сапоги страха"
  },
  {
    "fname": "fear_shield.png",
    "src": "/i/artifacts/events/fear_shield.png",
    "name": "Щит страха"
  },
  {
    "fname": "fear_maska.png",
    "src": "/i/artifacts/events/fear_maska.png",
    "name": "Маска страха"
  },
  {
    "fname": "fear_dring.png",
    "src": "/i/artifacts/events/fear_dring.png",
    "name": "Кольцо страха"
  },
  {
    "fname": "fear_lantern.png",
    "src": "/i/artifacts/events/fear_lantern.png",
    "name": "Фонарь страха"
  },
  {
    "fname": "fear_sickle.png",
    "src": "/i/artifacts/events/fear_sickle.png",
    "name": "Серп страха"
  },
  {
    "fname": "fear_cloack.png",
    "src": "/i/artifacts/events/fear_cloack.png",
    "name": "Плащ страха"
  },
  {
    "fname": "fear_bow.png",
    "src": "/i/artifacts/events/fear_bow.png",
    "name": "Лук страха"
  }
],
	"Комплект Войны": [
  {
    "fname": "warlord_armor.png",
    "src": "/i/artifacts/events/warlord_armor.png",
    "name": "Доспех войны"
  },
  {
    "fname": "warlord_cape.png",
    "src": "/i/artifacts/events/warlord_cape.png",
    "name": "Плащ войны"
  }
],
  "Комплект Океана": [
  {
    "fname": "ocean_sword3.png",
    "src": "/i/artifacts/events/ocean_sword3.png",
    "name": "Лёгкий меч океана"
  },
  {
    "fname": "ocean_dgr3.png",
    "src": "/i/artifacts/events/ocean_dgr3.png",
    "name": "Лёгкий кинжал океана"
  },
  {
    "fname": "ocean_boots3.png",
    "src": "/i/artifacts/events/ocean_boots3.png",
    "name": "Легкие сапоги океана"
  },
  {
    "fname": "m_armor3.png",
    "src": "/i/artifacts/events/m_armor3.png",
    "name": "Легкий доспех океана"
  },
  {
    "fname": "ocean_cl3.png",
    "src": "/i/artifacts/events/ocean_cl3.png",
    "name": "Простой плащ океана"
  },
  {
    "fname": "ocean_bw3.png",
    "src": "/i/artifacts/events/ocean_bw3.png",
    "name": "Простой лук океана"
  },
  {
    "fname": "ocean_eye3.png",
    "src": "/i/artifacts/events/ocean_eye3.png",
    "name": "Простое око океана"
  },
  {
    "fname": "m_shield3.png",
    "src": "/i/artifacts/events/m_shield3.png",
    "name": "Лёгкий щит океана"
  },
  {
    "fname": "ocean_per3.png",
    "src": "/i/artifacts/events/ocean_per3.png",
    "name": "Простой перстень океана"
  },
  {
    "fname": "ocean_ring3.png",
    "src": "/i/artifacts/events/ocean_ring3.png",
    "name": "Простое кольцо океана"
  },
  {
    "fname": "m_amul3.png",
    "src": "/i/artifacts/events/m_amul3.png",
    "name": "Простой амулет океана"
  },
  {
    "fname": "ocean_hlm3.png",
    "src": "/i/artifacts/events/ocean_hlm3.png",
    "name": "Лёгкий шлем океана"
  },
  {
    "fname": "ocean_sword2.png",
    "src": "/i/artifacts/events/ocean_sword2.png",
    "name": "Меч океана"
  },
  {
    "fname": "ocean_dgr2.png",
    "src": "/i/artifacts/events/ocean_dgr2.png",
    "name": "Кинжал океана"
  },
  {
    "fname": "ocean_boots2.png",
    "src": "/i/artifacts/events/ocean_boots2.png",
    "name": "Сапоги океана"
  },
  {
    "fname": "m_armor2.png",
    "src": "/i/artifacts/events/m_armor2.png",
    "name": "Доспех океана"
  },
  {
    "fname": "ocean_cl2.png",
    "src": "/i/artifacts/events/ocean_cl2.png",
    "name": "Плащ океана"
  },
  {
    "fname": "ocean_bw2.png",
    "src": "/i/artifacts/events/ocean_bw2.png",
    "name": "Лук океана"
  },
  {
    "fname": "ocean_eye2.png",
    "src": "/i/artifacts/events/ocean_eye2.png",
    "name": "Око океана"
  },
  {
    "fname": "m_shield2.png",
    "src": "/i/artifacts/events/m_shield2.png",
    "name": "Щит океана"
  },
  {
    "fname": "ocean_per2.png",
    "src": "/i/artifacts/events/ocean_per2.png",
    "name": "Перстень океана"
  },
  {
    "fname": "ocean_ring2.png",
    "src": "/i/artifacts/events/ocean_ring2.png",
    "name": "Кольцо океана"
  },
  {
    "fname": "m_amul2.png",
    "src": "/i/artifacts/events/m_amul2.png",
    "name": "Амулет океана"
  },
  {
    "fname": "ocean_hlm2.png",
    "src": "/i/artifacts/events/ocean_hlm2.png",
    "name": "Шлем океана"
  },
  {
    "fname": "ocean_sword1.png",
    "src": "/i/artifacts/events/ocean_sword1.png",
    "name": "Великий меч океана"
  },
  {
    "fname": "ocean_dgr1.png",
    "src": "/i/artifacts/events/ocean_dgr1.png",
    "name": "Великий кинжал океана"
  },
  {
    "fname": "ocean_boots1.png",
    "src": "/i/artifacts/events/ocean_boots1.png",
    "name": "Великие сапоги океана"
  },
  {
    "fname": "m_armor1.png",
    "src": "/i/artifacts/events/m_armor1.png",
    "name": "Великий доспех океана"
  },
  {
    "fname": "ocean_cl1.png",
    "src": "/i/artifacts/events/ocean_cl1.png",
    "name": "Великий плащ океана"
  },
  {
    "fname": "ocean_bw1.png",
    "src": "/i/artifacts/events/ocean_bw1.png",
    "name": "Великий лук океана"
  },
  {
    "fname": "ocean_eye1.png",
    "src": "/i/artifacts/events/ocean_eye1.png",
    "name": "Великое око океана"
  },
  {
    "fname": "m_shield1.png",
    "src": "/i/artifacts/events/m_shield1.png",
    "name": "Великий щит океана"
  },
  {
    "fname": "ocean_per1.png",
    "src": "/i/artifacts/events/ocean_per1.png",
    "name": "Великий перстень океана"
  },
  {
    "fname": "ocean_ring1.png",
    "src": "/i/artifacts/events/ocean_ring1.png",
    "name": "Великое кольцо океана"
  },
  {
    "fname": "m_amul1.png",
    "src": "/i/artifacts/events/m_amul1.png",
    "name": "Великий амулет океана"
  },
  {
    "fname": "ocean_hlm1.png",
    "src": "/i/artifacts/events/ocean_hlm1.png",
    "name": "Великий шлем океана"
  }
],
  "Комплект Авантюриста": [
  {
    "fname": "adv_saber2.png",
    "src": "/i/artifacts/events/adv_saber2.png",
    "name": "Лёгкий ятаган авантюриста"
  },
  {
    "fname": "a_dagger2.png",
    "src": "/i/artifacts/events/a_dagger2.png",
    "name": "Простой кинжал авантюриста"
  },
  {
    "fname": "adv_armor2.png",
    "src": "/i/artifacts/events/adv_armor2.png",
    "name": "Лёгкая броня авантюриста"
  },
  {
    "fname": "adv_clk2.png",
    "src": "/i/artifacts/events/adv_clk2.png",
    "name": "Простой плащ авантюриста"
  },
  {
    "fname": "adv_longbow2.png",
    "src": "/i/artifacts/events/adv_longbow2.png",
    "name": "Простой лук авантюриста"
  },
  {
    "fname": "adv_shild2.png",
    "src": "/i/artifacts/events/adv_shild2.png",
    "name": "Лёгкий щит авантюриста"
  },
  {
    "fname": "adv_fring2.png",
    "src": "/i/artifacts/events/adv_fring2.png",
    "name": "Простое кольцо авантюриста"
  },
  {
    "fname": "adv_neck2.png",
    "src": "/i/artifacts/events/adv_neck2.png",
    "name": "Простой амулет авантюриста"
  },
  {
    "fname": "adv_hm2.png",
    "src": "/i/artifacts/events/adv_hm2.png",
    "name": "Лёгкий шлем авантюриста"
  },
  {
    "fname": "adv_boot2.png",
    "src": "/i/artifacts/events/adv_boot2.png",
    "name": "Лёгкие сапоги авантюриста"
  },
  {
    "fname": "adv_sumk2.png",
    "src": "/i/artifacts/events/adv_sumk2.png",
    "name": "Простая сумка авантюриста"
  },
  {
    "fname": "adv_saber1.png",
    "src": "/i/artifacts/events/adv_saber1.png",
    "name": "Ятаган авантюриста"
  },
  {
    "fname": "a_dagger1.png",
    "src": "/i/artifacts/events/a_dagger1.png",
    "name": "Кинжал авантюриста"
  },
  {
    "fname": "adv_armor1.png",
    "src": "/i/artifacts/events/adv_armor1.png",
    "name": "Броня авантюриста"
  },
  {
    "fname": "adv_clk1.png",
    "src": "/i/artifacts/events/adv_clk1.png",
    "name": "Плащ авантюриста"
  },
  {
    "fname": "adv_longbow1.png",
    "src": "/i/artifacts/events/adv_longbow1.png",
    "name": "Лук авантюриста"
  },
  {
    "fname": "adv_shild1.png",
    "src": "/i/artifacts/events/adv_shild1.png",
    "name": "Щит авантюриста"
  },
  {
    "fname": "adv_fring1.png",
    "src": "/i/artifacts/events/adv_fring1.png",
    "name": "Кольцо авантюриста"
  },
  {
    "fname": "adv_neck1.png",
    "src": "/i/artifacts/events/adv_neck1.png",
    "name": "Амулет авантюриста"
  },
  {
    "fname": "adv_hm1.png",
    "src": "/i/artifacts/events/adv_hm1.png",
    "name": "Шлем авантюриста"
  },
  {
    "fname": "adv_boot1.png",
    "src": "/i/artifacts/events/adv_boot1.png",
    "name": "Сапоги авантюриста"
  },
  {
    "fname": "adv_sumk1.png",
    "src": "/i/artifacts/events/adv_sumk1.png",
    "name": "Сумка авантюриста"
  }
],
  "Комплект Единства": [
  {
    "fname": "ed_bsword3.png",
    "src": "/i/artifacts/events/ed_bsword3.png",
    "name": "Лёгкий меч единства"
  },
  {
    "fname": "ed_mbook3.png",
    "src": "/i/artifacts/events/ed_mbook3.png",
    "name": "Простая книга единства"
  },
  {
    "fname": "ed_svboots3.png",
    "src": "/i/artifacts/events/ed_svboots3.png",
    "name": "Лёгкие сапоги единства"
  },
  {
    "fname": "ed_armr3.png",
    "src": "/i/artifacts/events/ed_armr3.png",
    "name": "Лёгкий доспех единства"
  },
  {
    "fname": "ed_ring3.png",
    "src": "/i/artifacts/events/ed_ring3.png",
    "name": "Простое кольцо единства"
  },
  {
    "fname": "eddem_ring3.png",
    "src": "/i/artifacts/events/eddem_ring3.png",
    "name": "Простой перстень единства"
  },
  {
    "fname": "ed_elfbow3.png",
    "src": "/i/artifacts/events/ed_elfbow3.png",
    "name": "Простой лук единства"
  },
  {
    "fname": "ed_pendant3.png",
    "src": "/i/artifacts/events/ed_pendant3.png",
    "name": "Простая подвеска единства"
  },
  {
    "fname": "ed_barrel3.png",
    "src": "/i/artifacts/events/ed_barrel3.png",
    "name": "Простая кега единства"
  },
  {
    "fname": "ed_nemes3.png",
    "src": "/i/artifacts/events/ed_nemes3.png",
    "name": "Лёгкий немес единства"
  },
  {
    "fname": "ed_bsword2.png",
    "src": "/i/artifacts/events/ed_bsword2.png",
    "name": "Меч единства"
  },
  {
    "fname": "ed_mbook2.png",
    "src": "/i/artifacts/events/ed_mbook2.png",
    "name": "Книга единства"
  },
  {
    "fname": "ed_svboots2.png",
    "src": "/i/artifacts/events/ed_svboots2.png",
    "name": "Сапоги единства"
  },
  {
    "fname": "ed_armr2.png",
    "src": "/i/artifacts/events/ed_armr2.png",
    "name": "Доспех единства"
  },
  {
    "fname": "ed_ring2.png",
    "src": "/i/artifacts/events/ed_ring2.png",
    "name": "Кольцо единства"
  },
  {
    "fname": "eddem_ring2.png",
    "src": "/i/artifacts/events/eddem_ring2.png",
    "name": "Перстень единства"
  },
  {
    "fname": "ed_elfbow2.png",
    "src": "/i/artifacts/events/ed_elfbow2.png",
    "name": "Лук единства"
  },
  {
    "fname": "ed_pendant2.png",
    "src": "/i/artifacts/events/ed_pendant2.png",
    "name": "Подвеска единства"
  },
  {
    "fname": "ed_barrel2.png",
    "src": "/i/artifacts/events/ed_barrel2.png",
    "name": "Кега единства"
  },
  {
    "fname": "ed_nemes2.png",
    "src": "/i/artifacts/events/ed_nemes2.png",
    "name": "Немес единства"
  },
  {
    "fname": "ed_bsword1.png",
    "src": "/i/artifacts/events/ed_bsword1.png",
    "name": "Великий меч единства"
  },
  {
    "fname": "ed_mbook1.png",
    "src": "/i/artifacts/events/ed_mbook1.png",
    "name": "Великая книга единства"
  },
  {
    "fname": "ed_svboots1.png",
    "src": "/i/artifacts/events/ed_svboots1.png",
    "name": "Великие сапоги единства"
  },
  {
    "fname": "ed_armr1.png",
    "src": "/i/artifacts/events/ed_armr1.png",
    "name": "Великий доспех единства"
  },
  {
    "fname": "ed_ring1.png",
    "src": "/i/artifacts/events/ed_ring1.png",
    "name": "Великое кольцо единства"
  },
  {
    "fname": "eddem_ring1.png",
    "src": "/i/artifacts/events/eddem_ring1.png",
    "name": "Великий перстень единства"
  },
  {
    "fname": "ed_elfbow1.png",
    "src": "/i/artifacts/events/ed_elfbow1.png",
    "name": "Великий лук единства"
  },
  {
    "fname": "ed_pendant1.png",
    "src": "/i/artifacts/events/ed_pendant1.png",
    "name": "Великая подвеска единства"
  },
  {
    "fname": "ed_barrel1.png",
    "src": "/i/artifacts/events/ed_barrel1.png",
    "name": "Великая кега единства"
  },
  {
    "fname": "ed_nemes1.png",
    "src": "/i/artifacts/events/ed_nemes1.png",
    "name": "Великий немес единства"
  }
],
  "Комплект Леса": [
{
"fname": "forest_helm.png",
"src": "/i/artifacts/events/forest_helm.png",
"name": "Шлем леса"
},
{
"fname": "sh_amulet.png",
"src": "/i/artifacts/sh/sh_amulet.png",
"name": "Амулет леса"
},
{
"fname": "neut_leaf.png",
"src": "/i/artifacts/events/neut_leaf.png",
"name": "Талисман леса"
},
{
"fname": "forest_bolt.png",
"src": "/i/artifacts/events/forest_bolt.png",
"name": "Перстень леса"
},
{
"fname": "forest_ring.png",
"src": "/i/artifacts/events/forest_ring.png",
"name": "Кольцо леса"
},
{
"fname": "forest_armor.png",
"src": "/i/artifacts/events/forest_armor.png",
"name": "Доспех леса"
},
{
"fname": "les_cl.png",
"src": "/i/artifacts/events/les_cl.png",
"name": "Лесной плащ"
},
{
"fname": "forest_bow.png",
"src": "/i/artifacts/events/forest_bow.png",
"name": "Лук леса"
},
{
"fname": "forest_crossbow.png",
"src": "/i/artifacts/events/forest_crossbow.png",
"name": "Арбалет леса"
},
{
"fname": "forest_edge.png",
"src": "/i/artifacts/events/forest_edge.png",
"name": "Остриё леса"
},
{
"fname": "forest_spear.png",
"src": "/i/artifacts/events/forest_spear.png",
"name": "Копьё леса"
},
{
"fname": "forest_blade.png",
"src": "/i/artifacts/events/forest_blade.png",
"name": "Клинок леса"
},
{
"fname": "forest_boots.png",
"src": "/i/artifacts/events/forest_boots.png",
"name": "Сапоги леса"
},
{
"fname": "shieldofforest.png",
"src": "/i/artifacts/events/shieldofforest.png",
"name": "Щит леса"
},
{
"fname": "forest_dagger.png",
"src": "/i/artifacts/events/forest_dagger.png",
"name": "Кинжал леса"
},
{
"fname": "forest_knives.png",
"src": "/i/artifacts/events/forest_knives.png",
"name": "Метательные ножи леса"
}
],

"Комплект Ловчего": [
  { fname: "stalker_aml1.png",  src: "/i/artifacts/events/stalker_aml1.png",  name: "Великий амулет ловчего" },
  { fname: "stalker_aml2.png",  src: "/i/artifacts/events/stalker_aml2.png",  name: "Амулет ловчего" },
  { fname: "stalker_aml3.png",  src: "/i/artifacts/events/stalker_aml3.png",  name: "Простой амулет ловчего" },

  { fname: "stalker_ark1.png",  src: "/i/artifacts/events/stalker_ark1.png",  name: "Великий аркан ловчего" },
  { fname: "stalker_ark2.png",  src: "/i/artifacts/events/stalker_ark2.png",  name: "Аркан ловчего" },
  { fname: "stalker_ark3.png",  src: "/i/artifacts/events/stalker_ark3.png",  name: "Простой аркан ловчего" },

  { fname: "stalker_armour1.png", src: "/i/artifacts/events/stalker_armour1.png", name: "Доспех ловчего" },
  { fname: "stalker_armour2.png", src: "/i/artifacts/events/stalker_armour2.png", name: "Лёгкий доспех ловчего" },
  { fname: "stalker_armour3.png", src: "/i/artifacts/events/stalker_armour3.png", name: "Лёгкий доспех ловчего" },

  { fname: "stalker_backsword1.png", src: "/i/artifacts/events/stalker_backsword1.png", name: "Великий палаш ловчего" },
  { fname: "stalker_backsword2.png", src: "/i/artifacts/events/stalker_backsword2.png", name: "Палаш ловчего" },
  { fname: "stalker_backsword3.png", src: "/i/artifacts/events/stalker_backsword3.png", name: "Лёгкий палаш ловчего" },

  { fname: "stalker_boot1.png", src: "/i/artifacts/events/stalker_boot1.png", name: "Великие сапоги ловчего" },
  { fname: "stalker_boot2.png", src: "/i/artifacts/events/stalker_boot2.png", name: "Сапоги ловчего" },
  { fname: "stalker_boot3.png", src: "/i/artifacts/events/stalker_boot3.png", name: "Лёгкие сапоги ловчего" },

  { fname: "stalker_cl1.png", src: "/i/artifacts/events/stalker_cl1.png", name: "Великий плащ ловчего" },
  { fname: "stalker_cl2.png", src: "/i/artifacts/events/stalker_cl2.png", name: "Плащ ловчего" },
  { fname: "stalker_cl3.png", src: "/i/artifacts/events/stalker_cl3.png", name: "Простой плащ ловчего" },

  { fname: "stalker_crsb1.png", src: "/i/artifacts/events/stalker_crsb1.png", name: "Великий арбалет ловчего" },
  { fname: "stalker_crsb2.png", src: "/i/artifacts/events/stalker_crsb2.png", name: "Арбалет ловчего" },
  { fname: "stalker_crsb3.png", src: "/i/artifacts/events/stalker_crsb3.png", name: "Лёгкий арбалет ловчего" },

  { fname: "stalker_dagger1.png", src: "/i/artifacts/events/stalker_dagger1.png", name: "Великий кинжал ловчего" },
  { fname: "stalker_dagger2.png", src: "/i/artifacts/events/stalker_dagger2.png", name: "Кинжал ловчего" },
  { fname: "stalker_dagger3.png", src: "/i/artifacts/events/stalker_dagger3.png", name: "Простой кинжал ловчего" },

  { fname: "stalker_hlm1.png", src: "/i/artifacts/events/stalker_hlm1.png", name: "Великий капюшон ловчего" },
  { fname: "stalker_hlm2.png", src: "/i/artifacts/events/stalker_hlm2.png", name: "Капюшон ловчего" },
  { fname: "stalker_hlm3.png", src: "/i/artifacts/events/stalker_hlm3.png", name: "Простой капюшон ловчего" },

  { fname: "stalker_iring1.png", src: "/i/artifacts/events/stalker_iring1.png", name: "Великое кольцо ловчего" },
  { fname: "stalker_iring2.png", src: "/i/artifacts/events/stalker_iring2.png", name: "Кольцо ловчего" },
  { fname: "stalker_iring3.png", src: "/i/artifacts/events/stalker_iring3.png", name: "Простое кольцо ловчего" },

  { fname: "stalker_shid1.png", src: "/i/artifacts/events/stalker_shid1.png", name: "Великий щит ловчего" },
  { fname: "stalker_shid2.png", src: "/i/artifacts/events/stalker_shid2.png", name: "Щит ловчего" },
  { fname: "stalker_shid3.png", src: "/i/artifacts/events/stalker_shid3.png", name: "Лёгкий щит ловчего" },

  { fname: "stalker_sring1.png", src: "/i/artifacts/events/stalker_sring1.png", name: "Великий перстень ловчего" },
  { fname: "stalker_sring2.png", src: "/i/artifacts/events/stalker_sring2.png", name: "Перстень ловчего" },
  { fname: "stalker_sring3.png", src: "/i/artifacts/events/stalker_sring3.png", name: "Простой перстень ловчего" }
],

  "Комплект Армады": [
  { fname: "arm_armor1.png",    src: "/i/artifacts/events/arm_armor1.png",   name: "Великий камзол армады" },
  { fname: "arm_armor2.png",    src: "/i/artifacts/events/arm_armor2.png",   name: "Камзол армады" },
  { fname: "arm_armor3.png",    src: "/i/artifacts/events/arm_armor3.png",   name: "Простой камзол армады" },

  { fname: "arm_bts1.png",      src: "/i/artifacts/events/arm_bts1.png",     name: "Великие сапоги армады" },
  { fname: "arm_bts2.png",      src: "/i/artifacts/events/arm_bts2.png",     name: "Сапоги армады" },
  { fname: "arm_bts3.png",      src: "/i/artifacts/events/arm_bts3.png",     name: "Лёгкие сапоги армады" },

  { fname: "arm_cap1.png",      src: "/i/artifacts/events/arm_cap1.png",     name: "Великий капюшон армады" },
  { fname: "arm_cap2.png",      src: "/i/artifacts/events/arm_cap2.png",     name: "Капюшон армады" },
  { fname: "arm_cap3.png",      src: "/i/artifacts/events/arm_cap3.png",     name: "Лёгкий капюшон армады" },

  { fname: "arm_clk1.png",      src: "/i/artifacts/events/arm_clk1.png",     name: "Великий плащ армады" },
  { fname: "arm_clk2.png",      src: "/i/artifacts/events/arm_clk2.png",     name: "Плащ армады" },
  { fname: "arm_clk3.png",      src: "/i/artifacts/events/arm_clk3.png",     name: "Простой плащ армады" },

  { fname: "arm_garp1.png",     src: "/i/artifacts/events/arm_garp1.png",    name: "Великий гарпун армады" },
  { fname: "arm_garp2.png",     src: "/i/artifacts/events/arm_garp2.png",    name: "Гарпун армады" },
  { fname: "arm_garp3.png",     src: "/i/artifacts/events/arm_garp3.png",    name: "Простой гарпун армады" },

  { fname: "arm_handgun1.png",  src: "/i/artifacts/events/arm_handgun1.png", name: "Великий пистолет армады" },
  { fname: "arm_handgun2.png",  src: "/i/artifacts/events/arm_handgun2.png", name: "Пистолет армады" },
  { fname: "arm_handgun3.png",  src: "/i/artifacts/events/arm_handgun3.png", name: "Простой пистолет армады" },

  { fname: "arm_r1.png",        src: "/i/artifacts/events/arm_r1.png",       name: "Великое кольцо армады" },
  { fname: "arm_r2.png",        src: "/i/artifacts/events/arm_r2.png",       name: "Кольцо армады" },
  { fname: "arm_r3.png",        src: "/i/artifacts/events/arm_r3.png",       name: "Простое кольцо армады" },

  { fname: "arm_sekstant1.png", src: "/i/artifacts/events/arm_sekstant1.png", name: "Великий секстант армады" },
  { fname: "arm_sekstant2.png", src: "/i/artifacts/events/arm_sekstant2.png", name: "Секстант армады" },
  { fname: "arm_sekstant3.png", src: "/i/artifacts/events/arm_sekstant3.png", name: "Простой секстант армады" },

  { fname: "arm_tesak1.png",    src: "/i/artifacts/events/arm_tesak1.png",   name: "Великий тесак армады" },
  { fname: "arm_tesak2.png",    src: "/i/artifacts/events/arm_tesak2.png",   name: "Тесак армады" },
  { fname: "arm_tesak3.png",    src: "/i/artifacts/events/arm_tesak3.png",   name: "Лёгкий тесак армады" },

  { fname: "armad_aml1.png",    src: "/i/artifacts/events/armad_aml1.png",   name: "Великий амулет армады" },
  { fname: "armad_aml2.png",    src: "/i/artifacts/events/armad_aml2.png",   name: "Амулет армады" },
  { fname: "armad_aml3.png",    src: "/i/artifacts/events/armad_aml3.png",   name: "Простой амулет армады" }
],

  "Комплект Странника": [
  {
    fname: "wanderer_amul1.png",
    src: "/i/artifacts/events/wanderer_amul1.png",
    name: "Великий амулет странника"
  },
  {
    fname: "wanderer_amul2.png",
    src: "/i/artifacts/events/wanderer_amul2.png",
    name: "Амулет странника"
  },
  {
    fname: "wanderer_amul3.png",
    src: "/i/artifacts/events/wanderer_amul3.png",
    name: "Простой амулет странника"
  },
  {
    fname: "wanderer_armor1.png",
    src: "/i/artifacts/events/wanderer_armor1.png",
    name: "Великий доспех странника"
  },
  {
    fname: "wanderer_armor2.png",
    src: "/i/artifacts/events/wanderer_armor2.png",
    name: "Доспех странника"
  },
  {
    fname: "wanderer_armor3.png",
    src: "/i/artifacts/events/wanderer_armor3.png",
    name: "Лёгкий доспех странника"
  },
  {
    fname: "wanderer_boot1.png",
    src: "/i/artifacts/events/wanderer_boot1.png",
    name: "Великие сапоги странника"
  },
  {
    fname: "wanderer_boot2.png",
    src: "/i/artifacts/events/wanderer_boot2.png",
    name: "Сапоги странника"
  },
  {
    fname: "wanderer_boot3.png",
    src: "/i/artifacts/events/wanderer_boot3.png",
    name: "Лёгкие сапоги странника"
  },
  {
    fname: "wanderer_cb1.png",
    src: "/i/artifacts/events/wanderer_cb1.png",
    name: "Великий арбалет странника"
  },
  {
    fname: "wanderer_cb2.png",
    src: "/i/artifacts/events/wanderer_cb2.png",
    name: "Арбалет странника"
  },
  {
    fname: "wanderer_cb3.png",
    src: "/i/artifacts/events/wanderer_cb3.png",
    name: "Лёгкий арбалет странника"
  },
  {
    fname: "wanderer_hat1.png",
    src: "/i/artifacts/events/wanderer_hat1.png",
    name: "Великая шляпа странника"
  },
  {
    fname: "wanderer_hat2.png",
    src: "/i/artifacts/events/wanderer_hat2.png",
    name: "Шляпа странника"
  },
  {
    fname: "wanderer_hat3.png",
    src: "/i/artifacts/events/wanderer_hat3.png",
    name: "Простая шляпа странника"
  },
  {
    fname: "wandr_cloack1.png",
    src: "/i/artifacts/events/wandr_cloack1.png",
    name: "Великий плащ странника"
  },
  {
    fname: "wandr_cloack2.png",
    src: "/i/artifacts/events/wandr_cloack2.png",
    name: "Плащ странника"
  },
  {
    fname: "wandr_cloack3.png",
    src: "/i/artifacts/events/wandr_cloack3.png",
    name: "Простой плащ странника"
  }
],

"Комплект Ронина": [
  {
    "fname": "ronin_sh3.png",
    "src": "/i/artifacts/events/ronin_sh3.png",
    "name": "Забытые поножи ронина"
  },
  {
    "fname": "ronin_sh2.png",
    "src": "/i/artifacts/events/ronin_sh2.png",
    "name": "Мрачные поножи ронина"
  },
  {
    "fname": "ronin_sh1.png",
    "src": "/i/artifacts/events/ronin_sh1.png",
    "name": "Зловещие поножи ронина"
  },
  {
    "fname": "ronin_mask3.png",
    "src": "/i/artifacts/events/ronin_mask3.png",
    "name": "Забытая маска ронина"
  },
  {
    "fname": "ronin_mask2.png",
    "src": "/i/artifacts/events/ronin_mask2.png",
    "name": "Мрачная маска ронина"
  },
  {
    "fname": "ronin_mask1.png",
    "src": "/i/artifacts/events/ronin_mask1.png",
    "name": "Зловещая маска ронина"
  },
  {
    "fname": "ronin_d3.png",
    "src": "/i/artifacts/events/ronin_d3.png",
    "name": "Забытый доспех ронина"
  },
  {
    "fname": "ronin_d2.png",
    "src": "/i/artifacts/events/ronin_d2.png",
    "name": "Мрачный доспех ронина"
  },
  {
    "fname": "ronin_d1.png",
    "src": "/i/artifacts/events/ronin_d1.png",
    "name": "Зловещий доспех ронина"
  }
],

"Комплект Чести": [
  {
    "fname": "honorhelm_3.png",
    "src": "/i/artifacts/events/honorhelm_3.png",
    "name": "Лёгкий шлем чести"
  },
  {
    "fname": "honorhelm_2.png",
    "src": "/i/artifacts/events/honorhelm_2.png",
    "name": "Шлем чести"
  },
  {
    "fname": "honorhelm_1.png",
    "src": "/i/artifacts/events/honorhelm_1.png",
    "name": "Великий шлем чести"
  },
  {
    "fname": "honorplate_3.png",
    "src": "/i/artifacts/events/honorplate_3.png",
    "name": "Лёгкий доспех чести"
  },
  {
    "fname": "honorplate_2.png",
    "src": "/i/artifacts/events/honorplate_2.png",
    "name": "Доспех чести"
  },
  {
    "fname": "honorplate_1.png",
    "src": "/i/artifacts/events/honorplate_1.png",
    "name": "Великий доспех чести"
  }
],

"Комплект Легенд": [
  {
    "fname": "icemask3.png",
    "src": "/i/artifacts/events/icemask3.png",
    "name": "Маска морозного притворства"
  },
  {
    "fname": "icemask2.png",
    "src": "/i/artifacts/events/icemask2.png",
    "name": "Маска морозного обмана"
  },
  {
    "fname": "icemask1.png",
    "src": "/i/artifacts/events/icemask1.png",
    "name": "Маска морозного долга"
  },
  {
    "fname": "legend_nature3.png",
    "src": "/i/artifacts/events/legend_nature3.png",
    "name": "Амулет природной лёгкости"
  },
  {
    "fname": "legend_nature2.png",
    "src": "/i/artifacts/events/legend_nature2.png",
    "name": "Амулет природной ловкости"
  },
  {
    "fname": "legend_nature1.png",
    "src": "/i/artifacts/events/legend_nature1.png",
    "name": "Амулет природной грации"
  }
],

    "Медали за Малый турнир": [
      { fname: "mt_gold.png",   src: "/i/rewards/mt_gold.png",		"name": "Малый турнир. Золото" },
      { fname: "mt_silver.png", src: "/i/rewards/mt_silver.png",	"name": "Малый турнир. Серебро" },
      { fname: "mt_bronze.png", src: "/i/rewards/mt_bronze.png",	"name": "Малый турнир. Бронза" },
    ],
    "Медали за Малый турнир+": [
      { fname: "mtp_gold.png",   src: "/i/rewards/mtp_gold.png",	"name": "Малый турнир+. Золото" },
      { fname: "mtp_silver.png", src: "/i/rewards/mtp_silver.png",	"name": "Малый турнир+. Серебро" },
      { fname: "mtp_bronze.png", src: "/i/rewards/mtp_bronze.png",	"name": "Малый турнир+. Бронза" },
    ],
    "Медали за Малый турнир++": [
	  { fname: "mtpp_g1.png", src: "/i/rewards/mtpp/mtpp_g1",	"name": "Малый турнир++. Золото. Рыцарь" },
      { fname: "mtpp_g2.png", src: "/i/rewards/mtpp/mtpp_g2",	"name": "Малый турнир++. Золото. Некромант" },
      { fname: "mtpp_g3.png", src: "/i/rewards/mtpp/mtpp_g3",	"name": "Малый турнир++. Золото. Маг" },
      { fname: "mtpp_g4.png", src: "/i/rewards/mtpp/mtpp_g4",	"name": "Малый турнир++. Золото. Эльф" },
      { fname: "mtpp_g5.png", src: "/i/rewards/mtpp/mtpp_g5",	"name": "Малый турнир++. Золото. Варвар" },
      { fname: "mtpp_g6.png", src: "/i/rewards/mtpp/mtpp_g6",	"name": "Малый турнир++. Золото. Тёмный эльф" },
      { fname: "mtpp_g7.png", src: "/i/rewards/mtpp/mtpp_g7",	"name": "Малый турнир++. Золото. Демон" },
      { fname: "mtpp_g8.png", src: "/i/rewards/mtpp/mtpp_g8",	"name": "Малый турнир++. Золото. Гном" },
      { fname: "mtpp_g9.png", src: "/i/rewards/mtpp/mtpp_g9",	"name": "Малый турнир++. Золото. Степной варвар" },
      { fname: "mtpp_g10.png", src: "/i/rewards/mtpp/mtpp_g10",	"name": "Малый турнир++. Золото. Фараон" },
	  { fname: "mtpp_s1.png", src: "/i/rewards/mtpp/mtpp_s1",	"name": "Малый турнир++. Серебро. Рыцарь" },
      { fname: "mtpp_s2.png", src: "/i/rewards/mtpp/mtpp_s2",	"name": "Малый турнир++. Серебро. Некромант" },
      { fname: "mtpp_s3.png", src: "/i/rewards/mtpp/mtpp_s3",	"name": "Малый турнир++. Серебро. Маг" },
      { fname: "mtpp_s4.png", src: "/i/rewards/mtpp/mtpp_s4",	"name": "Малый турнир++. Серебро. Эльф" },
      { fname: "mtpp_s5.png", src: "/i/rewards/mtpp/mtpp_s5",	"name": "Малый турнир++. Серебро. Варвар" },
      { fname: "mtpp_s6.png", src: "/i/rewards/mtpp/mtpp_s6",	"name": "Малый турнир++. Серебро. Тёмный эльф" },
      { fname: "mtpp_s7.png", src: "/i/rewards/mtpp/mtpp_s7",	"name": "Малый турнир++. Серебро. Демон" },
      { fname: "mtpp_s8.png", src: "/i/rewards/mtpp/mtpp_s8",	"name": "Малый турнир++. Серебро. Гном" },
      { fname: "mtpp_s9.png", src: "/i/rewards/mtpp/mtpp_s9",	"name": "Малый турнир++. Серебро. Степной варвар" },
      { fname: "mtpp_s10.png", src: "/i/rewards/mtpp/mtpp_s10",	"name": "Малый турнир++. Серебро. Фараон" },
	  { fname: "mtpp_b1.png", src: "/i/rewards/mtpp/mtpp_b1",	"name": "Малый турнир++. Бронза. Рыцарь" },
      { fname: "mtpp_b2.png", src: "/i/rewards/mtpp/mtpp_b2",	"name": "Малый турнир++. Бронза. Некромант" },
      { fname: "mtpp_b3.png", src: "/i/rewards/mtpp/mtpp_b3",	"name": "Малый турнир++. Бронза. Маг" },
      { fname: "mtpp_b4.png", src: "/i/rewards/mtpp/mtpp_b4",	"name": "Малый турнир++. Бронза. Эльф" },
      { fname: "mtpp_b5.png", src: "/i/rewards/mtpp/mtpp_b5",	"name": "Малый турнир++. Бронза. Варвар" },
      { fname: "mtpp_b6.png", src: "/i/rewards/mtpp/mtpp_b6",	"name": "Малый турнир++. Бронза. Тёмный эльф" },
      { fname: "mtpp_b7.png", src: "/i/rewards/mtpp/mtpp_b7",	"name": "Малый турнир++. Бронза. Демон" },
      { fname: "mtpp_b8.png", src: "/i/rewards/mtpp/mtpp_b8",	"name": "Малый турнир++. Бронза. Гном" },
      { fname: "mtpp_b9.png", src: "/i/rewards/mtpp/mtpp_b9",	"name": "Малый турнир++. Бронза. Степной варвар" },
      { fname: "mtpp_b10.png", src: "/i/rewards/mtpp/mtpp_b10",	"name": "Малый турнир++. Бронза. Фараон" },
    ],
    "Медали за Парный турнир": [
      { fname: "pt_gold.png",        src: "/i/rewards/pt/pt_gold.png",			"name": "Парный турнир. Золото. Командный зачёт" },
      { fname: "pt_silver.png",      src: "/i/rewards/pt/pt_silver.png",		"name": "Парный турнир. Серебро. Командный зачёт" },
      { fname: "pt_bronze.png",      src: "/i/rewards/pt/pt_bronze.png",		"name": "Парный турнир. Бронза. Командный зачёт" },
      { fname: "pt_gold_rand.png",   src: "/i/rewards/pt/pt_gold_rand.png",		"name": "Парный турнир. Золото. Случайный зачёт" },
      { fname: "pt_silver_rand.png", src: "/i/rewards/pt/pt_silver_rand.png",	"name": "Парный турнир. Серебро. Случайный зачёт" },
      { fname: "pt_bronze_rand.png", src: "/i/rewards/pt/pt_bronze_rand.png",	"name": "Парный турнир. Бронза. Случайный зачёт" },
    ],
    "Медали за Парный турнир энергии": [
      { fname: "ptt_gold.png",        src: "/i/rewards/pt_time/ptt_gold.png",			"name": "Парный турнир энергии. Золото. Командный зачёт" },
      { fname: "ptt_silver.png",      src: "/i/rewards/pt_time/ptt_silver.png",			"name": "Парный турнир энергии. Серебро. Командный зачёт" },
      { fname: "ptt_bronze.png",      src: "/i/rewards/pt_time/ptt_bronze.png",			"name": "Парный турнир энергии. Бронза. Командный зачёт" },
      { fname: "ptt_gold_rand.png",   src: "/i/rewards/pt_time/ptt_gold_rand.png",		"name": "Парный турнир энергии. Золото. Случайный зачёт" },
      { fname: "ptt_silver_rand.png", src: "/i/rewards/pt_time/ptt_silver_rand.png",	"name": "Парный турнир энергии. Серебро. Случайный зачёт" },
      { fname: "ptt_bronze_rand.png", src: "/i/rewards/pt_time/ptt_bronze_rand.png",	"name": "Парный турнир энергии. Бронза. Случайный зачёт" },
    ],
    "Медали за Парный турнир+": [
      { fname: "ptp_gold.png",        src: "/i/rewards/pt/ptp_gold.png",		"name": "Парный турнир+. Золото. Командный зачёт" },
      { fname: "ptp_silver.png",      src: "/i/rewards/pt/ptp_silver.png",		"name": "Парный турнир+. Серебро. Командный зачёт" },
      { fname: "ptp_bronze.png",      src: "/i/rewards/pt/ptp_bronze.png",		"name": "Парный турнир+. Бронза. Командный зачёт" },
      { fname: "ptp_gold_rand.png",   src: "/i/rewards/pt/ptp_gold_rand.png",	"name": "Парный турнир+. Золото. Случайный зачёт" },
      { fname: "ptp_silver_rand.png", src: "/i/rewards/pt/ptp_silver_rand.png",	"name": "Парный турнир+. Серебро. Случайный зачёт" },
      { fname: "ptp_bronze_rand.png", src: "/i/rewards/pt/ptp_bronze_rand.png",	"name": "Парный турнир+. Бронза. Случайный зачёт" },
    ],
    "Медали за Парный турнир++": [
      { fname: "ptpp_gold.png",        src: "/i/rewards/ptpp/ptpp_gold.png",		"name": "Парный турнир++. Золото. Командный зачёт" },
      { fname: "ptpp_silver.png",      src: "/i/rewards/ptpp/ptpp_silver.png",		"name": "Парный турнир++. Серебро. Командный зачёт" },
      { fname: "ptpp_bronze.png",      src: "/i/rewards/ptpp/ptpp_bronze.png",		"name": "Парный турнир++. Бронза. Командный зачёт" },
      { fname: "ptpp_gold_rand.png",   src: "/i/rewards/ptpp/ptpp_gold_rand.png",	"name": "Парный турнир++. Золото. Случайный зачёт" },
      { fname: "ptpp_silver_rand.png", src: "/i/rewards/ptpp/ptpp_silver_rand.png",	"name": "Парный турнир++. Серебро. Случайный зачёт" },
      { fname: "ptpp_bronze_rand.png", src: "/i/rewards/ptpp/ptpp_bronze_rand.png",	"name": "Парный турнир++. Бронза. Случайный зачёт" },
    ],
    "Медали за Тёмный турнир": [
      { fname: "tt_gold.png",   src: "/i/rewards/tt_gold.png",		"name": "Тёмный турнир. Золото" },
      { fname: "tt_silver.png", src: "/i/rewards/tt_silver.png",	"name": "Тёмный турнир. Серебро" },
      { fname: "tt_bronze.png", src: "/i/rewards/tt_bronze.png",	"name": "Тёмный турнир. Бронза" },
    ],
    "Медали за ТреТёмный турнир(+)": [
      { fname: "t3t_gold.png",   src: "/i/rewards/t3t_gold.png",	"name": "ТреТёмный турнир(+). Золото" },
      { fname: "t3t_silver.png", src: "/i/rewards/t3t_silver.png",	"name": "ТреТёмный турнир(+). Серебро" },
      { fname: "t3t_bronze.png", src: "/i/rewards/t3t_bronze.png",	"name": "ТреТёмный турнир(+). Бронза" },
    ],
    "Медали за Тёмный турнир+": [
      { fname: "tt0001.png",   src: "/i/rewards/ttp/tt0001.png",	"name": "Тёмный турнир+. Золото. Рыцарь" },
      { fname: "tt1001.png", src: "/i/rewards/ttp/tt1001.png",		"name": "Тёмный турнир+. Серебро. Рыцарь" },
      { fname: "tt2001.png", src: "/i/rewards/ttp/tt2001.png",		"name": "Тёмный турнир+. Бронза. Рыцарь" },
      { fname: "tt0002.png",   src: "/i/rewards/ttp/tt0002.png",	"name": "Тёмный турнир+. Золото. Некромант" },
      { fname: "tt1002.png", src: "/i/rewards/ttp/tt1002.png",		"name": "Тёмный турнир+. Серебро. Некромант" },
      { fname: "tt2002.png", src: "/i/rewards/ttp/tt2002.png",		"name": "Тёмный турнир+. Бронза. Некромант" },
      { fname: "tt0003.png",   src: "/i/rewards/ttp/tt0003.png",	"name": "Тёмный турнир+. Золото. Маг" },
      { fname: "tt1003.png", src: "/i/rewards/ttp/tt1003.png",		"name": "Тёмный турнир+. Серебро. Маг" },
      { fname: "tt2003.png", src: "/i/rewards/ttp/tt2003.png",		"name": "Тёмный турнир+. Бронза. Маг" },
      { fname: "tt0004.png",   src: "/i/rewards/ttp/tt0004.png",	"name": "Тёмный турнир+. Золото. Эльф" },
      { fname: "tt1004.png", src: "/i/rewards/ttp/tt1004.png",		"name": "Тёмный турнир+. Серебро. Эльф" },
      { fname: "tt2004.png", src: "/i/rewards/ttp/tt2004.png",		"name": "Тёмный турнир+. Бронза. Эльф" },
      { fname: "tt0005.png",   src: "/i/rewards/ttp/tt0005.png",	"name": "Тёмный турнир+. Золото. Варвар" },
      { fname: "tt1005.png", src: "/i/rewards/ttp/tt1005.png",		"name": "Тёмный турнир+. Серебро. Варвар" },
      { fname: "tt2005.png", src: "/i/rewards/ttp/tt2005.png",		"name": "Тёмный турнир+. Бронза. Варвар" },
      { fname: "tt0006.png",   src: "/i/rewards/ttp/tt0006.png",	"name": "Тёмный турнир+. Золото. Тёмный эльф" },
      { fname: "tt1006.png", src: "/i/rewards/ttp/tt1006.png",		"name": "Тёмный турнир+. Серебро. Тёмный эльф" },
      { fname: "tt2006.png", src: "/i/rewards/ttp/tt2006.png",		"name": "Тёмный турнир+. Бронза. Тёмный эльф" },
      { fname: "tt0007.png",   src: "/i/rewards/ttp/tt0007.png",	"name": "Тёмный турнир+. Золото. Демон" },
      { fname: "tt1007.png", src: "/i/rewards/ttp/tt1007.png",		"name": "Тёмный турнир+. Серебро. Демон" },
      { fname: "tt2007.png", src: "/i/rewards/ttp/tt2007.png",		"name": "Тёмный турнир+. Бронза. Демон" },
      { fname: "tt0008.png",   src: "/i/rewards/ttp/tt0008.png",	"name": "Тёмный турнир+. Золото. Гном" },
      { fname: "tt1008.png", src: "/i/rewards/ttp/tt1008.png",		"name": "Тёмный турнир+. Серебро. Гном" },
      { fname: "tt2008.png", src: "/i/rewards/ttp/tt2008.png",		"name": "Тёмный турнир+. Бронза. Гном" },
      { fname: "tt0009.png",   src: "/i/rewards/ttp/tt0009.png",	"name": "Тёмный турнир+. Золото. Степной варвар" },
      { fname: "tt1009.png", src: "/i/rewards/ttp/tt1009.png",		"name": "Тёмный турнир+. Серебро. Степной варвар" },
      { fname: "tt2009.png", src: "/i/rewards/ttp/tt2009.png",		"name": "Тёмный турнир+. Бронза. Степной варвар" },
    ],
    "Медали за Тёмный смешанный турнир": [
      { fname: "tmt1.png", src: "/i/rewards/tmt1.png",	"name": "Тёмный смешанный турнир. Золото" },
      { fname: "tmt2.png", src: "/i/rewards/tmt2.png",	"name": "Тёмный смешанный турнир. Серебро" },
      { fname: "tmt3.png", src: "/i/rewards/tmt3.png",	"name": "Тёмный смешанный турнир. Бронза" },
    ],
    "Медали за Турнир Лучший...": [
	  { fname: "bf1011.png",   src: "/i/rewards/bf1011.png",	"name": "Турнир Лучший рыцарь света. Золото" },
	  { fname: "bf1012.png",   src: "/i/rewards/bf1012.png",	"name": "Турнир Лучший рыцарь света. Серебро" },
	  { fname: "bf1013.png",   src: "/i/rewards/bf1013.png",	"name": "Турнир Лучший рыцарь света. Бронза" },
	  { fname: "bf1021.png",   src: "/i/rewards/bf1021.png",	"name": "Турнир Лучший некромант - повелитель смерти. Золото" },
	  { fname: "bf1022.png",   src: "/i/rewards/bf1022.png",	"name": "Турнир Лучший некромант - повелитель смерти. Серебро" },
	  { fname: "bf1023.png",   src: "/i/rewards/bf1023.png",	"name": "Турнир Лучший некромант - повелитель смерти. Бронза" },
	  { fname: "bf1031.png",   src: "/i/rewards/bf1031.png",	"name": "Турнир Лучший маг-разрушитель. Золото" },
	  { fname: "bf1032.png",   src: "/i/rewards/bf1032.png",	"name": "Турнир Лучший маг-разрушитель. Серебро" },
	  { fname: "bf1033.png",   src: "/i/rewards/bf1033.png",	"name": "Турнир Лучший маг-разрушитель. Бронза" },
	  { fname: "bf1041.png",   src: "/i/rewards/bf1041.png",	"name": "Турнир Лучший эльф-заклинатель. Золото" },
	  { fname: "bf1042.png",   src: "/i/rewards/bf1042.png",	"name": "Турнир Лучший эльф-заклинатель. Серебро" },
	  { fname: "bf1043.png",   src: "/i/rewards/bf1043.png",	"name": "Турнир Лучший эльф-заклинатель. Бронза" },
	  { fname: "bf1051.png",   src: "/i/rewards/bf1051.png",	"name": "Турнир Лучший варвар крови. Золото" },
	  { fname: "bf1052.png",   src: "/i/rewards/bf1052.png",	"name": "Турнир Лучший варвар крови. Серебро" },
	  { fname: "bf1053.png",   src: "/i/rewards/bf1053.png",	"name": "Турнир Лучший варвар крови. Бронза" },
	  { fname: "bf2051.png",   src: "/i/rewards/bf2051.png",	"name": "Турнир Лучший варвар-шаман. Золото" },
	  { fname: "bf2052.png",   src: "/i/rewards/bf2052.png",	"name": "Турнир Лучший варвар-шаман. Серебро" },
	  { fname: "bf2053.png",   src: "/i/rewards/bf2053.png",	"name": "Турнир Лучший варвар-шаман. Бронза" },
	  { fname: "bf1061.png",   src: "/i/rewards/bf1061.png",	"name": "Турнир Лучший тёмный эльф-укротитель. Золото" },
	  { fname: "bf1062.png",   src: "/i/rewards/bf1062.png",	"name": "Турнир Лучший тёмный эльф-укротитель. Серебро" },
	  { fname: "bf1063.png",   src: "/i/rewards/bf1063.png",	"name": "Турнир Лучший тёмный эльф-укротитель. Бронза" },
	  { fname: "bf0071.png",   src: "/i/rewards/bf0071.png",	"name": "Турнир Лучший демон. Золото" },
	  { fname: "bf0072.png",   src: "/i/rewards/bf0072.png",	"name": "Турнир Лучший демон. Серебро" },
	  { fname: "bf0073.png",   src: "/i/rewards/bf0073.png",	"name": "Турнир Лучший демон. Бронза" },
	  { fname: "bf1071.png",   src: "/i/rewards/bf1071.png",	"name": "Турнир Лучший демон тьмы. Золото" },
	  { fname: "bf1072.png",   src: "/i/rewards/bf1072.png",	"name": "Турнир Лучший демон тьмы. Серебро" },
	  { fname: "bf1073.png",   src: "/i/rewards/bf1073.png",	"name": "Турнир Лучший демон тьмы. Бронза" },
	  { fname: "bf0081.png",   src: "/i/rewards/bf0081.png",	"name": "Турнир Лучший гном. Золото" },
	  { fname: "bf0082.png",   src: "/i/rewards/bf0082.png",	"name": "Турнир Лучший гном. Серебро" },
	  { fname: "bf0083.png",   src: "/i/rewards/bf0083.png",	"name": "Турнир Лучший гном. Бронза" },
	  { fname: "bf1081.png",   src: "/i/rewards/bf1081.png",	"name": "Турнир Лучший гном огня. Золото" },
	  { fname: "bf1082.png",   src: "/i/rewards/bf1082.png",	"name": "Турнир Лучший гном огня. Серебро" },
	  { fname: "bf1083.png",   src: "/i/rewards/bf1083.png",	"name": "Турнир Лучший гном огня. Бронза" },
	  { fname: "bf0091.png",   src: "/i/rewards/bf0091.png",	"name": "Турнир Лучший степной варвар. Золото" },
	  { fname: "bf0092.png",   src: "/i/rewards/bf0092.png",	"name": "Турнир Лучший степной варвар. Серебро" },
	  { fname: "bf0093.png",   src: "/i/rewards/bf0093.png",	"name": "Турнир Лучший степной варвар. Бронза" },
      { fname: "bf00101.png",  src: "/i/rewards/bf00101.png",	"name": "Турнир Лучший фараон. Золото" },
      { fname: "bf00102.png",  src: "/i/rewards/bf00102.png",	"name": "Турнир Лучший фараон. Серебро" },
      { fname: "bf00103.png",  src: "/i/rewards/bf00103.png",	"name": "Турнир Лучший фараон. Бронза" },
    ],
    "Медали за Турнир на выживание": [
      { fname: "dost0010.png", src: "/i/rewards/dost0010.png",	"name": "Турнир на выживание. Золото. Рыцарь" },
	  { fname: "dost0011.png", src: "/i/rewards/dost0011.png",	"name": "Турнир на выживание. Серебро. Рыцарь" },
	  { fname: "dost0012.png", src: "/i/rewards/dost0012.png",	"name": "Турнир на выживание. Бронза. Рыцарь" },
      { fname: "dost0013.png", src: "/i/rewards/dost0013.png",	"name": "Турнир на выживание. Золото. Некромант" },
	  { fname: "dost0014.png", src: "/i/rewards/dost0014.png",	"name": "Турнир на выживание. Серебро. Некромант" },
	  { fname: "dost0015.png", src: "/i/rewards/dost0015.png",	"name": "Турнир на выживание. Бронза. Некромант" },
      { fname: "dost0016.png", src: "/i/rewards/dost0016.png",	"name": "Турнир на выживание. Золото. Маг" },
	  { fname: "dost0017.png", src: "/i/rewards/dost0017.png",	"name": "Турнир на выживание. Серебро. Маг" },
	  { fname: "dost0018.png", src: "/i/rewards/dost0018.png",	"name": "Турнир на выживание. Бронза. Маг" },
      { fname: "dost0019.png", src: "/i/rewards/dost0019.png",	"name": "Турнир на выживание. Золото. Эльф" },
	  { fname: "dost0020.png", src: "/i/rewards/dost0020.png",	"name": "Турнир на выживание. Серебро. Эльф" },
	  { fname: "dost0021.png", src: "/i/rewards/dost0021.png",	"name": "Турнир на выживание. Бронза. Эльф" },
      { fname: "dost0022.png", src: "/i/rewards/dost0022.png",	"name": "Турнир на выживание. Золото. Варвар" },
	  { fname: "dost0023.png", src: "/i/rewards/dost0023.png",	"name": "Турнир на выживание. Серебро. Варвар" },
	  { fname: "dost0024.png", src: "/i/rewards/dost0024.png",	"name": "Турнир на выживание. Бронза. Варвар" },
      { fname: "dost0025.png", src: "/i/rewards/dost0025.png",	"name": "Турнир на выживание. Золото. Тёмный эльф" },
	  { fname: "dost0026.png", src: "/i/rewards/dost0026.png",	"name": "Турнир на выживание. Серебро. Тёмный эльф" },
	  { fname: "dost0027.png", src: "/i/rewards/dost0027.png",	"name": "Турнир на выживание. Бронза. Тёмный эльф" },
	  { fname: "dost0028.png", src: "/i/rewards/dost0028.png",	"name": "Турнир на выживание. Золото. Демон" },
	  { fname: "dost0029.png", src: "/i/rewards/dost0029.png",	"name": "Турнир на выживание. Серебро. Демон" },
	  { fname: "dost0030.png", src: "/i/rewards/dost0030.png",	"name": "Турнир на выживание. Бронза. Демон" },
	  { fname: "dost0031.png", src: "/i/rewards/dost0031.png",	"name": "Турнир на выживание. Золото. Гном" },
	  { fname: "dost0032.png", src: "/i/rewards/dost0032.png",	"name": "Турнир на выживание. Серебро. Гном" },
	  { fname: "dost0033.png", src: "/i/rewards/dost0033.png",	"name": "Турнир на выживание. Бронза. Гном" },
	  { fname: "dost0034.png", src: "/i/rewards/dost0034.png",	"name": "Турнир на выживание. Золото. Степной варвар" },
	  { fname: "dost0035.png", src: "/i/rewards/dost0035.png",	"name": "Турнир на выживание. Серебро. Степной варвар" },
	  { fname: "dost0036.png", src: "/i/rewards/dost0036.png",	"name": "Турнир на выживание. Бронза. Степной варвар" },
	  { fname: "dost0037.png", src: "/i/rewards/dost0037.png",	"name": "Турнир на выживание. Золото. Фараон" },
	  { fname: "dost0038.png", src: "/i/rewards/dost0038.png",	"name": "Турнир на выживание. Серебро. Фараон" },
	  { fname: "dost0039.png", src: "/i/rewards/dost0039.png",	"name": "Турнир на выживание. Бронза. Фараон" },
    ],
    "Медали за Смешанный турнир": [
      { fname: "st_gold.png", src: "/i/rewards/st_gold.png",		"name": "Смешанный турнир. Золото" },
      { fname: "st_silver.png", src: "/i/rewards/st_silver.png",	"name": "Смешанный турнир. Серебро" },
      { fname: "st_bronze.png", src: "/i/rewards/st_bronze.png",	"name": "Смешанный турнир. Бронза" },
    ],
    "Медали за Смешанный турнир+": [
      { fname: "smtp1.png", src: "/i/rewards/smtp1.png",	"name": "Смешанный турнир+. Золото" },
      { fname: "smtp2.png", src: "/i/rewards/smtp2.png",	"name": "Смешанный турнир+. Серебро" },
      { fname: "smtp3.png", src: "/i/rewards/smtp3.png",	"name": "Смешанный турнир+. Бронза" },
    ],
    "Достижения Тыквика": [
      { fname: "pum1.png", src: "/i/rewards/pum1.png",	"name": "Хэллоуин. Золото" },
      { fname: "pum2.png", src: "/i/rewards/pum2.png",	"name": "Хэллоуин. Серебро" },
      { fname: "pum3.png", src: "/i/rewards/pum3.png",	"name": "Хэллоуин. Бронза" },
    ],
    "Достижения Охотника": [
      { fname: "hunt_1.png", src: "/i/rewards/hunt_1.png",	"name": "Первый результат в охоте" },
      { fname: "hunt_2.png", src: "/i/rewards/hunt_2.png",	"name": "Второй результат в охоте" },
      { fname: "hunt_3.png", src: "/i/rewards/hunt_3.png",	"name": "Третий результат в охоте" },
    ],
    "Достижения Рулетки": [
      { fname: "best_win.png", src: "/i/rewards/roul/best_win.jpg",	"name": "Самый успешный игрок в рулетку за сутки" },
      { fname: "best_bet.png", src: "/i/rewards/roul/best_bet.jpg",	"name": "Самый азартный игрок в рулетку за сутки" },
    ],
    "Достижения Наёмника": [
      { fname: "task2.png", src: "/i/rewards/gn/task2.png",		"name": "Лучший результат в заданиях ГН. Захватчики" },
      { fname: "task3.png", src: "/i/rewards/gn/task3.png",		"name": "Лучший результат в заданиях ГН. Разбойники" },
      { fname: "task4.png", src: "/i/rewards/gn/task4.png",		"name": "Лучший результат в заданиях ГН. Монстры" },
      { fname: "task5.png", src: "/i/rewards/gn/task5.png",		"name": "Лучший результат в заданиях ГН. Набеги" },
      { fname: "task7.png", src: "/i/rewards/gn/task7.png",		"name": "Лучший результат в заданиях ГН. Отряды" },
      { fname: "task9.png", src: "/i/rewards/gn/task9.png",		"name": "Лучший результат в заданиях ГН. Армии" },
      { fname: "task10.png", src: "/i/rewards/gn/task10.png",	"name": "Лучший результат в заданиях ГН. Заговорщики" },
    ],
    "Достижения Заданий лидеров": [
      { fname: "lg_spec1.png", src: "/i/rewards/lgt_spec/lg_spec1.png",	"name": "Задание лидеров. Золото" },
      { fname: "lg_spec2.png", src: "/i/rewards/lgt_spec/lg_spec2.png",	"name": "Задание лидеров. Серебро" },
      { fname: "lg_spec3.png", src: "/i/rewards/lgt_spec/lg_spec3.png",	"name": "Задание лидеров. Бронза" },
    ],
    "Медали за Карточный турнир": [
      { fname: "sun.png", src: "/i/rewards/arc/sun.png",	"name": "Карточный турнир. Кубок Солнечного города" },
      { fname: "gold.png", src: "/i/rewards/arc/gold.png",	"name": "Карточный турнир. Золотая колода" },
      { fname: "bk.png", src: "/i/rewards/arc/bk.png",		"name": "Карточный турнир. Синяя карта" },
    ],
    "Медали за Турнир лидеров": [
      { fname: "rewards1.png", src: "/i/rewards/lgt/rewards1.png",	"name": "Турнир лидеров. Золото" },
      { fname: "rewards2.png", src: "/i/rewards/lgt/rewards2.png",	"name": "Турнир лидеров. Серебро" },
      { fname: "rewards3.png", src: "/i/rewards/lgt/rewards3.png",	"name": "Турнир лидеров. Бронза" },
    ],
    "Медали за Тактический турнир лидеров": [
      { fname: "tactleader1.png", src: "/i/rewards/lgt_tactic/tactleader1.png",	"name": "Тактический турнир лидеров. Золото" },
      { fname: "tactleader2.png", src: "/i/rewards/lgt_tactic/tactleader2.png",	"name": "Тактический турнир лидеров. Серебро" },
      { fname: "tactleader3.png", src: "/i/rewards/lgt_tactic/tactleader3.png",	"name": "Тактический турнир лидеров. Бронза" },
    ],
    "Медали за Быстрый турнир четырёхлетия": [
      { fname: "4ysmall.png", src: "/i/rewards/fast_t/4ysmall.png",	"name": "Быстрый турнир четырёхлетия" },
    ],
    "Медали за Быстрый турнир 1x1": [
      { fname: "1x1_1.png", src: "/i/rewards/fast_t/1x1_1.png",		"name": "Быстрый турнир 1x1. Рыцарь" },
      { fname: "1x1_2.png", src: "/i/rewards/fast_t/1x1_2.png",		"name": "Быстрый турнир 1x1. Некромант" },
      { fname: "1x1_3.png", src: "/i/rewards/fast_t/1x1_3.png",		"name": "Быстрый турнир 1x1. Маг" },
      { fname: "1x1_4.png", src: "/i/rewards/fast_t/1x1_4.png",		"name": "Быстрый турнир 1x1. Эльф" },
      { fname: "1x1_5.png", src: "/i/rewards/fast_t/1x1_5.png",		"name": "Быстрый турнир 1x1. Варвар" },
      { fname: "1x1_6.png", src: "/i/rewards/fast_t/1x1_6.png",		"name": "Быстрый турнир 1x1. Тёмный эльф" },
      { fname: "1x1_7.png", src: "/i/rewards/fast_t/1x1_7.png",		"name": "Быстрый турнир 1x1. Демон" },
      { fname: "1x1_8.png", src: "/i/rewards/fast_t/1x1_8.png",		"name": "Быстрый турнир 1x1. Гном" },
      { fname: "1x1_9.png", src: "/i/rewards/fast_t/1x1_9.png",		"name": "Быстрый турнир 1x1. Степной варвар" },
	  { fname: "1x1_10.png", src: "/i/rewards/fast_t/1x1_10.png",	"name": "Быстрый турнир 1x1. Фараон" },
    ],
    "Медали за Быстрый турнир 2x2": [
      { fname: "2x2_1.png", src: "/i/rewards/fast_t/2x2_1.png",		"name": "Быстрый турнир 2x2. Рыцарь" },
      { fname: "2x2_2.png", src: "/i/rewards/fast_t/2x2_2.png",		"name": "Быстрый турнир 2x2. Некромант" },
      { fname: "2x2_3.png", src: "/i/rewards/fast_t/2x2_3.png",		"name": "Быстрый турнир 2x2. Маг" },
      { fname: "2x2_4.png", src: "/i/rewards/fast_t/2x2_4.png",		"name": "Быстрый турнир 2x2. Эльф" },
      { fname: "2x2_5.png", src: "/i/rewards/fast_t/2x2_5.png",		"name": "Быстрый турнир 2x2. Варвар" },
      { fname: "2x2_6.png", src: "/i/rewards/fast_t/2x2_6.png",		"name": "Быстрый турнир 2x2. Тёмный эльф" },
      { fname: "2x2_7.png", src: "/i/rewards/fast_t/2x2_7.png",		"name": "Быстрый турнир 2x2. Демон" },
      { fname: "2x2_8.png", src: "/i/rewards/fast_t/2x2_8.png",		"name": "Быстрый турнир 2x2. Гном" },
      { fname: "2x2_9.png", src: "/i/rewards/fast_t/2x2_9.png",		"name": "Быстрый турнир 2x2. Степной варвар" },
	  { fname: "2x2_10.png", src: "/i/rewards/fast_t/2x2_10.png",	"name": "Быстрый турнир 2x2. Фараон" },
    ],
    "Медали за Быстрый турнир 3x3": [
      { fname: "3x3_1.png", src: "/i/rewards/fast_t/3x3_1.png",		"name": "Быстрый турнир 3x3. Рыцарь" },
      { fname: "3x3_2.png", src: "/i/rewards/fast_t/3x3_2.png",		"name": "Быстрый турнир 3x3. Некромант" },
      { fname: "3x3_3.png", src: "/i/rewards/fast_t/3x3_3.png",		"name": "Быстрый турнир 3x3. Маг" },
      { fname: "3x3_4.png", src: "/i/rewards/fast_t/3x3_4.png",		"name": "Быстрый турнир 3x3. Эльф" },
      { fname: "3x3_5.png", src: "/i/rewards/fast_t/3x3_5.png",		"name": "Быстрый турнир 3x3. Варвар" },
      { fname: "3x3_6.png", src: "/i/rewards/fast_t/3x3_6.png",		"name": "Быстрый турнир 3x3. Тёмный эльф" },
      { fname: "3x3_7.png", src: "/i/rewards/fast_t/3x3_7.png",		"name": "Быстрый турнир 3x3. Демон" },
      { fname: "3x3_8.png", src: "/i/rewards/fast_t/3x3_8.png",		"name": "Быстрый турнир 3x3. Гном" },
      { fname: "3x3_9.png", src: "/i/rewards/fast_t/3x3_9.png",		"name": "Быстрый турнир 3x3. Степной варвар" },
	  { fname: "3x3_10.png", src: "/i/rewards/fast_t/3x3_10.png",	"name": "Быстрый турнир 3x3. Фараон" },
    ]
};


  const ORDINARY_EXCEPTIONS = new Set(["treasure.png"]); // /i/artifacts/other/treasure.png

  // helpers ────────────────────────────────────────────────────────────────────
  const isRewardsPath   = (p) => /\/i\/rewards\//i.test(p);
  const isArtifactsPath = (p) => /\/i\/artifacts\//i.test(p);

  // если в src нет расширения — добавим .png
  const ensureExt = (src) => /\.(png|jpg)(?:$|\?)/i.test(src||'') ? src : (src + '.png');

  // имя файла (для распознавания вариантов …1/…2/…3)
  function fileNameFromSrc(src) {
    const m = (src || '').match(/([^\/?#]+\.(?:png|jpg))(?:$|\?)/i);
    if (m) return m[1].toLowerCase();
    const m2 = (src || '').match(/\/([^\/?#]+)(?:$|\?)/);
    return m2 ? (m2[1].toLowerCase() + '.png') : '';
  }

  // КЛЮЧ для сопоставления: ПОЛНЫЙ путь, начиная с /i/, с расширением (отличает rewards/artifacts)
  function pathKeyFromSrc(src) {
    const s = ensureExt(src || '').toLowerCase();
    const i = s.indexOf('/i/');
    if (i >= 0) return s.slice(i); // например: /i/rewards/lgt_spec/lg_spec3.png
    return '/i/' + fileNameFromSrc(s); // fallback
  }

  // перевод "строки" в объект
  const toFileObj = (x) => (typeof x === 'string' ? { fname:x, src:'/i/artifacts/'+x } : x);

  // пропуск фоновых подложек
  const isBackground = (fname, src) => {
    const f = (fname||'').toLowerCase(), s = (src||'').toLowerCase();
    return /^art_fon_\d+x\d+\.png$/.test(f) || /\/i\/artifacts\/art_fon_/i.test(s);
  };

  // заголовок из DOM
  function getDomTitle(img) {
    return img.getAttribute('title')
        || img.getAttribute('alt')
        || img.closest('.show_hint')?.getAttribute('hint')
        || img.closest('a')?.getAttribute('title')
        || '';
  }
  
    // ссылка из DOM (если иконка была кликабельной)
  function getDomHref(img) {
    const a = img.closest('a');
    return a ? (a.getAttribute('href') || '') : '';
  }

  // число на значке (как «45» в примере с prs.gif)
  function getCountFromDOM(img) {
    const root = img.closest('.cre_mon_parent') || img.closest('td') || img.parentElement;
    if (!root) return 1;
    const divs = Array.from(root.querySelectorAll('div'));
    for (const d of divs) {
      const txt = (d.textContent || '').trim();
      if (!/^\d+$/.test(txt)) continue;
      const st = (d.getAttribute('style') || '').toLowerCase();
      const looksLikeBadge = /prs\.gif/.test(st) || /position\s*:\s*absolute/.test(st) || d.offsetWidth <= 30;
      if (looksLikeBadge) return Math.max(1, parseInt(txt,10));
    }
    return 1;
  }

  // медали — по названию/составу
  function isMedalishName(fname) {
    const f = (fname||'').toLowerCase();
    return (
      /^k?medal\d+\.png$/.test(f) || /^bmedal\d+\.png$/.test(f) ||
      /^mtp_/.test(f) || /^mtpp_/.test(f) || /^ptp_/.test(f) || /^t3t_/.test(f) ||
      /^smtp\d+\.png$/.test(f) || /^tmt\d+\.png$/.test(f) || /^dost00\d+\.png$/.test(f) ||
      /^tiger_(gold|silver|bronze)\.png$/.test(f) ||
      /(necr|elf|dem|mage)war\d+(st)?\.png$/.test(f)
    );
  }
  function isMedalSet(name, files) {
    if (/медал/i.test(name) || /турнир/i.test(name)) return true;
    const arr = files || []; if (!arr.length) return false;
    let medalish = 0;
    for (const x of arr) {
      const f = (x.fname||'').toLowerCase();
      const p = (x.src||'').toLowerCase();
      if (isRewardsPath(p) || isMedalishName(f)) medalish++;
    }
    return medalish / arr.length >= 0.6;
  }

  // вариант «…1.png / …2.png / …3.png»
  function parseVariant(fname) {
    const m = (fname||'').toLowerCase().match(/^(.*?)(\d+)\.(png|jpg)$/);
    return m ? { base:m[1], num:parseInt(m[2],10), ext:m[3] } : null;
  }

  // найти блок «Достижения»
function findAchievementsBlock() {
  const norm = s => (s||'').replace(/\u00A0/g,' ').trim().toLowerCase();

  // 1) найти текст «Достижения»/«Achievements»
  const heads = Array.from(document.querySelectorAll('b,strong,td,div,span'))
    .filter(el => ['достижения','achievements'].includes(norm(el.textContent)));

  for (const head of heads) {
    // 2) работаем в рамках той же таблицы
    const tr = head.closest('tr');
    const table = tr?.closest('table');
    if (!tr || !table) continue;

    // 3) следующая строка после заголовка — там лежит контент
    let row = tr.nextElementSibling;
    if (!row || row.parentElement !== tr.parentElement) continue; // на всякий случай

    // 4) контейнером делаем либо сам <tr>, либо первый <td> внутри
    let container = row.querySelector('td') || row;

    // 5) если внутри хотя бы одна иконка — это наш блок
    const cnt = container.querySelectorAll('img[src*="/i/"]').length;
    if (cnt >= 1) return { container };
  }

  // 6) на крайний случай — мягкий фолбэк РЯДОМ с заголовком (но уже без «самый большой»)
  for (const head of heads) {
    const tr = head.closest('tr'); if (!tr) continue;
    let p = tr.nextElementSibling, steps = 0;
    while (p && steps++ < 6) {
      const t = p.querySelector('td') || p;
      const cnt = t.querySelectorAll('img[src*="/i/"]').length;
      if (cnt >= 1) return { container: t };
      p = p.nextElementSibling;
    }
  }

  // 7) иначе — ничего не делаем (лучше молча уйти, чем собрать мусор)
  return null;
}


  // если другой скрипт полностью скрыл оригинал — не грузимся
  function isHidden(el) {
    let cur = el;
    while (cur) {
      const cs = getComputedStyle(cur);
      if (cs && cs.display === 'none') return true;
      cur = cur.parentElement;
    }
    return false;
  }

  // собрать иконки, агрегировать дубликаты, считать количество
  function collectIcons(container) {
    const imgs = Array.from(container.querySelectorAll('img[src*="/i/"]'));
    const map = new Map(); // key -> {src,key,fname,kind,count,title}
    for (const img of imgs) {
      const raw = img.getAttribute('src') || '';
      const src = ensureExt(raw);
      const key = pathKeyFromSrc(src);   // /i/.../xxx.png — различает rewards vs artifacts
      const fname = fileNameFromSrc(src);
      if (!fname || isBackground(fname, src)) continue;

      const title    = getDomTitle(img);
      const href     = getDomHref(img);
      const countDom = getCountFromDOM(img);
      const rec = map.get(key);
      if (rec) {
        rec.count += countDom;
        if (!rec.title && title) rec.title = title;
        if (!rec.href  && href)  rec.href  = href;
      } else {
        map.set(key, {
          src,
          key,
          fname, // нужно для логики вариантов
          kind: isRewardsPath(src) ? 'reward' : (isArtifactsPath(src) ? 'artifact' : 'other'),
          count: countDom,
          title,
          href
        });
      }
    }
    return Array.from(map.values());
  }

  // коллапс вариантов (только для наборов «Комплект …»)
  function collapseVariants(files, poolSet, playerIndex) {
    const groups = new Map(); // baseKey -> [{obj, v|null}]
    const baseKeyFor = f => { const v = parseVariant(f); return v ? (v.base + '.' + v.ext) : null; };

    for (const x of files) {
      const bk = baseKeyFor(x.fname);
      if (bk) {
        if (!groups.has(bk)) groups.set(bk, []);
        groups.get(bk).push({ obj:x, v:parseVariant(x.fname) });
      } else {
        const k = '::single::'+x.fname;
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push({ obj:x, v:null });
      }
    }

    const owned = [], missing = [];

    for (const [, arr] of groups) {
      const vars = arr.filter(e => e.v);
      if (!vars.length) {
        const o = arr[0].obj;
        if (poolSet.has(o.key)) {
          const rec = playerIndex.get(o.key);
		  owned.push({ ...o, count: rec?.count || 1, title: (rec?.title || o.name || ''), href:  rec?.href  || '' });

        } else {
          missing.push(o);
        }
        continue;
      }
      const ownedVars = vars.filter(e => poolSet.has(e.obj.key));
      if (ownedVars.length) {
        ownedVars.sort((a,b)=> a.v.num - b.v.num);
        const o = ownedVars[0].obj;
		const rec = playerIndex.get(o.key);
		owned.push({ ...o, count: rec?.count || 1, title: (rec?.title || o.name || ''), href:  rec?.href  || '' });
      } else {
        vars.sort((a,b)=> a.v.num - b.v.num);
        missing.push(vars[0].obj); // показываем только лучший «недополученный»
      }
    }
    return { owned, missing };
  }

  // группировка по наборам
  function groupBySets(items) {
    const playerIndex  = new Map(items.map(i => [i.key, i])); // key -> {count,title,...}
    const allKeys      = new Set(items.map(i => i.key));
    const artifactKeys = new Set(items.filter(i => i.kind !== 'reward').map(i => i.key));

    const groups = [];
    for (const [name, arr0] of Object.entries(SETS)) {
      const filesRaw = (arr0 || []).map(toFileObj).filter(x => x && x.fname && x.src);
      if (!filesRaw.length) continue;

      // нормализуем
      const files = filesRaw.map(x => {
        const src = ensureExt(x.src||'');
        return {
          fname: (x.fname ? x.fname : fileNameFromSrc(src)).toLowerCase(), // для вариантов
          key: pathKeyFromSrc(src),                                       // для сопоставления
          src,
          name: x.name || ''
        };
      });

      const medalSet = isMedalSet(name, files);
      const pool = new Set(medalSet ? allKeys : artifactKeys); // локальный пул

      const isComplect = /^\s*комплект\s/i.test(name);
	  const isPumpkinAch  = /^\s*достижения тыквика\s*$/i.test(name);
      let owned, missing;

      if (isComplect) {
        ({ owned, missing } = collapseVariants(files, pool, playerIndex));
      } else {
  owned = files.filter(x => pool.has(x.key)).map(x => {
    const rec           = playerIndex.get(x.key);
    const originalTitle = rec?.title || '';
    const preferDomTitle = isPumpkinAch || /комплект/i.test(originalTitle);

    const title = preferDomTitle
      ? (originalTitle || x.name || '')
      : (x.name || originalTitle || '');

    return { ...x, count: rec?.count || 1, title, href:  rec?.href  || '' };
  });
  missing = files.filter(x => !pool.has(x.key));
}

      const total = owned.length + missing.length;
      const percent = total ? Math.round(owned.length/total*100) : 0;

      groups.push({ name, owned, missing, total, percent, medalSet });

      // вынимаем учтённые элементы из глобального пула
      for (const x of owned) { allKeys.delete(x.key); artifactKeys.delete(x.key); }
    }

    // остатки
    const otherAchievements = items
      .filter(i => i.kind === 'reward' || ORDINARY_EXCEPTIONS.has(i.fname))
      .filter(i => !groups.some(g => g.owned.some(x => x.key === i.key)));
    const restArtifacts = items
      .filter(i => i.kind !== 'reward' && !ORDINARY_EXCEPTIONS.has(i.fname))
      .filter(i => !groups.some(g => g.owned.some(x => x.key === i.key)));

    return { groups, otherAchievements, restArtifacts };
  }

  // UI ──────────────────────────────────────────────────────────────────────────
  function ensureCSS(){
    if (document.getElementById('hwm-sets-styles')) return;
    const s = document.createElement('style');
    s.id = 'hwm-sets-styles';
    s.textContent = `
      .hwm-wrap{margin-top:8px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
      .hwm-toolbar{display:flex;gap:8px;align-items:center;margin:0 0 8px;flex-wrap:wrap}
      .hwm-btn{font-size:12px;padding:4px 8px;border-radius:8px;border:1px solid #445;background:#2a2f3a;color:#dde;cursor:pointer}
      .hwm-btn:hover{filter:brightness(1.08)}
      .hwm-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:12px}
      .hwm-card{background:#111a22;border:1px solid #0a0d12;border-radius:12px;padding:10px;box-shadow:0 1px 0 #0008 inset}
      .hwm-card h4{margin:0 0 8px;font-size:14px;color:#f0f4ff;display:flex;justify-content:space-between;align-items:center}
      .hwm-grid{display:grid;grid-template-columns:repeat(auto-fill,36px);gap:6px}
      .hwm-cell{position:relative;width:36px;height:36px}
      .hwm-cell>img,
      .hwm-cell>a>img{width:36px;height:36px;object-fit:contain;display:block}
      .hwm-missing{opacity:.28;filter:grayscale(1)}
      .hwm-badge{
        position:absolute;right:-4px;bottom:-3px;
        min-width:18px;height:16px;padding:0 4px;border-radius:6px;
        background:rgba(12,16,24,.92);color:#fff;font-weight:700;font-size:11px;line-height:16px;text-align:center;
        box-shadow:0 0 0 1px rgba(0,0,0,.85),0 1px 2px rgba(0,0,0,.6);
        text-shadow:0 0 2px #000,0 0 3px #000,0 1px 0 #000;z-index:2;
      }
      .hwm-complete{border:2px solid #4caf50;border-radius:12px}
    `;
    document.head.appendChild(s);
  }

    function makeCell({src, missing=false, title='', count=1, href=''}) {
    const cell = document.createElement('div'); cell.className='hwm-cell';
    const img = document.createElement('img'); img.src = ensureExt(src);
    if (missing) img.classList.add('hwm-missing');
    if (title)   img.title = title;

    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.appendChild(img);
      cell.appendChild(a);
    } else {
      cell.appendChild(img);
    }

    if (count && count > 1) {
      const b = document.createElement('div'); b.className = 'hwm-badge'; b.textContent = String(count);
      cell.appendChild(b);
    }
    return cell;
  }


 function renderUI(originalRow, data){
  ensureCSS();

  const wrap = document.createElement('div'); wrap.className='hwm-wrap';
  const toolbar = document.createElement('div'); toolbar.className='hwm-toolbar';
  const btnSort = document.createElement('button'); btnSort.className='hwm-btn'; btnSort.textContent='Сортировка: по %';
  const btnEmpty= document.createElement('button'); btnEmpty.className='hwm-btn'; btnEmpty.textContent='Показать пустые сеты';
  const btnOrig = document.createElement('button'); btnOrig.className='hwm-btn'; btnOrig.textContent='Показать оригинал';
  toolbar.append(btnSort, btnEmpty, btnOrig); wrap.appendChild(toolbar);

  const cards = document.createElement('div'); cards.className='hwm-cards'; wrap.appendChild(cards);

  let sortMode = 0;          // 0: по %, 1: A→Я
  let showEmptySets = false; // пустые скрыты

  function draw(){
    cards.innerHTML = '';

    const list = data.groups.filter(g => showEmptySets ? true : g.owned.length > 0);
    if (sortMode === 0) list.sort((a,b)=> b.percent-a.percent || a.name.localeCompare(b.name,'ru'));
    else list.sort((a,b)=> a.name.localeCompare(b.name,'ru'));

    for (const g of list) {
      const card = document.createElement('div'); card.className='hwm-card';
      if (g.percent===100) card.classList.add('hwm-complete');
      const h4 = document.createElement('h4');
      const label = g.medalSet ? '' : '';
      h4.innerHTML = `${g.name}${label} <span>${g.owned.length}/${g.total} (${g.percent}%)</span>`;
      card.appendChild(h4);

      if (g.owned.length>0 || showEmptySets) {
        const grid = document.createElement('div'); grid.className='hwm-grid';
        for (const x of g.owned)   grid.appendChild(makeCell({src:x.src, title:x.title||'', count:x.count||1, href:x.href||''}));
        for (const x of g.missing) grid.appendChild(makeCell({src:x.src, title:x.name||'',  missing:true}));
        card.appendChild(grid);
      }
      cards.appendChild(card);
    }

    if (data.otherAchievements.length){
      const c=document.createElement('div'); c.className='hwm-card';
      const h=document.createElement('h4'); h.textContent=`Прочие достижения (${data.otherAchievements.length})`;
      const g=document.createElement('div'); g.className='hwm-grid';
      for (const r of data.otherAchievements){ g.appendChild(makeCell({src:r.src, title:r.title||'', count:r.count||1})); }
      c.append(h,g); cards.appendChild(c);
    }
    if (data.restArtifacts.length){
      const c=document.createElement('div'); c.className='hwm-card';
      const h=document.createElement('h4'); h.textContent=`Артефакты без комплекта (${data.restArtifacts.length})`;
      const g=document.createElement('div'); g.className='hwm-grid';
      for (const r of data.restArtifacts){ g.appendChild(makeCell({src:r.src, title:r.title||'', count:r.count||1})); }
      c.append(h,g); cards.appendChild(c);
    }

    // Если последний блок один — растягиваем на всю ширину
    const cols = (getComputedStyle(cards).gridTemplateColumns || '').split(' ').filter(Boolean).length || 1;
    [...cards.children].forEach(el => el.style.gridColumn = '');
    if (cols > 1 && (cards.children.length % cols === 1)) {
      cards.lastElementChild.style.gridColumn = '1 / -1';
    }

    if (!Object.keys(SETS).length) {
      const note=document.createElement('div'); note.className='hwm-card';
      note.innerHTML='<h4>Нет базы SETS</h4><div style="opacity:.8;font-size:12px">Пока показаны только «Прочие достижения» и «Артефакты без комплекта».</div>';
      cards.prepend(note);
    }
  }

  btnSort.addEventListener('click', ()=>{ sortMode=(sortMode+1)%2; btnSort.textContent = sortMode===0?'Сортировка: по %':'Сортировка: A→Я'; draw(); });
  btnEmpty.addEventListener('click', ()=>{ showEmptySets=!showEmptySets; btnEmpty.textContent=showEmptySets?'Скрыть пустые сеты':'Показать пустые сеты'; draw(); });
  btnOrig.addEventListener('click', ()=>{
    // переключаем видимость исходного блока (строки или контейнера)
    const rowToHide = originalRow?.closest ? (originalRow.closest('tr') || originalRow) : originalRow;
    if (rowToHide && rowToHide.style) {
      const show = rowToHide.style.display === 'none';
      rowToHide.style.display = show ? '' : 'none';
      btnOrig.textContent = show ? 'Скрыть оригинал' : 'Показать оригинал';
    }
  });

  // ==== ВСТАВКА БЛОКА И СКРЫТИЕ ОРИГИНАЛА (исправлено) ====
  const rowToHide = originalRow?.closest ? (originalRow.closest('tr') || originalRow) : originalRow;

  if (rowToHide && rowToHide.nodeName === 'TR') {
    // создаём новую строку перед исходной и скрываем всю исходную строку
    const newTr = document.createElement('tr');
    const td = document.createElement('td');
    const firstCell = rowToHide.querySelector('td') || rowToHide.cells?.[0];
    td.colSpan = (firstCell && firstCell.colSpan) ? firstCell.colSpan : 1;
    td.appendChild(wrap);
    newTr.appendChild(td);
    rowToHide.parentNode.insertBefore(newTr, rowToHide);
    rowToHide.style.display = 'none';
  } else if (rowToHide && rowToHide.parentNode) {
    // контейнер не <tr> (например, <td> или <div>) — вставляем перед ним и скрываем его
    rowToHide.parentNode.insertBefore(wrap, rowToHide);
    rowToHide.style.display = 'none';
  } else {
    // на всякий случай
    (document.body).insertBefore(wrap, null);
  }
  // ========================================================

  draw();
  window.addEventListener('resize', ()=>draw(), { passive:true });
}

  // запуск ─────────────────────────────────────────────────────────────────────
  function main(){
    const blk = findAchievementsBlock(); if (!blk) return;
    if (isHidden(blk.container)) return; // скрыто другим скриптом — не грузимся

    const items = collectIcons(blk.container); if (!items.length) return;
    const data  = groupBySets(items);
    renderUI(blk.container, data);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
