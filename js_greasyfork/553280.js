// ==UserScript==
// @name         ✨💱汇率转换器|货币换算|Currency Converter - 美元/欧元/比特币价格实时转换✨
// @name:zh-CN   ✨💱汇率转换器|货币换算 - 价格转换工具✨
// @name:en      ✨💱Currency Converter|Exchange Rate - Real-time Price Conversion✨
// @name:ja      ✨💱為替換算|通貨変換 - リアルタイム価格コンバーター✨
// @name:ko      ✨💱환율 변환기|통화 계산기 - 실시간 가격 변환✨
// @namespace    https://greasyfork.org/en/scripts/553280-%E5%85%A8%E8%83%BD%E8%B4%A7%E5%B8%81%E8%BD%AC%E6%8D%A2%E5%99%A8-universal-currency-converter?locale_override=1
// @version      1.7.5
// @description  💰汇率换算工具|实时货币转换器|价格转换助手💰 自动识别USD美元/EUR欧元/CNY人民币/JPY日元/GBP英镑/KRW韩元等127种货币(含BTC比特币/ETH以太坊/USDT等加密货币)。支持淘宝/天猫/京东/拼多多/Amazon亚马逊/eBay/Steam游戏/阿里云/AWS等全网站。鼠标悬停显示汇率弹窗tooltip，支持外汇牌价查询、跨境电商海淘、游戏充值、VPS服务器购买等场景。Currency Exchange Rate Converter Price Calculator Bitcoin Crypto 換算 両替 為替レート
// @description:zh-CN  💰汇率换算|货币转换|价格计算💰 网页价格自动识别转换工具，支持美元/欧元/人民币/日元/英镑/韩元等127种货币。淘宝天猫京东Amazon海淘Steam游戏充值阿里云服务器全支持。实时外汇牌价查询，跨境电商必备神器。
// @description:en  💰Currency Converter|Exchange Rate Calculator|Price Conversion Tool💰 Auto-detect & convert USD/EUR/CNY/JPY/GBP/KRW + 127 currencies including Bitcoin/Ethereum crypto. Works on Amazon/eBay/Taobao/Steam/AWS. Hover tooltip shows real-time forex rates. Perfect for cross-border shopping, gaming, cloud services. 汇率 货币 両替 換算
// @description:ja  💰為替換算ツール|通貨コンバーター|価格変換💰 USD/EUR/JPY/CNY等127通貨(ビットコイン/イーサリアム含)を自動認識変換。Amazon/楽天/Steam/AWSで利用可能。マウスホバーでリアルタイム為替レート表示。越境EC・ゲーム課金・クラウドサービス購入に最適。Currency Exchange Rate 汇率 환율
// @description:ko  💰환율 계산기|통화 변환기|가격 변환 도구💰 USD/EUR/CNY/JPY/KRW 등 127개 통화(비트코인/이더리움 포함) 자동 인식 변환. Amazon/쿠팡/Steam/AWS 지원. 마우스 호버로 실시간 환율 툴팁 표시. 해외직구/게임충전/클라우드서비스 구매 필수. Currency Converter 汇率 為替
// @author       FronNian
// @copyright    2025, FronNian (huayuan4564@gmail.com)
// @match        *://*/*
// @match        *://*.youtube.com/*
// @match        *://*.twitch.tv/*
// @match        *://*.bilibili.com/*
// @match        *://*.douyin.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.kuaishou.com/*
// @match        *://*.gifshow.com/*
// @match        *://*.huya.com/*
// @match        *://*.douyu.com/*
// @match        *://*.xiaohongshu.com/*
// @match        *://*.xhslink.com/*
// @match        *://*.netflix.com/*
// @match        *://*.primevideo.com/*
// @match        *://*.disneyplus.com/*
// @match        *://*.hulu.com/*
// @match        *://*.kick.com/*
// @match        *://*.rumble.com/*
// @match        *://*.vimeo.com/*
// @match        *://*.dailymotion.com/*
// @match        *://*.nicovideo.jp/*
// @match        *://*.afreecatv.com/*
// @match        *://*.naver.com/*
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.qq.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.acfun.cn/*
// @match        *://*.weibo.com/*
// @match        *://*.weishi.qq.com/*
// @match        *://*.huoshan.com/*
// @match        *://*.ixigua.com/*
// @match        *://*.v.qq.com/*
// @match        *://*.live.com/*
// @match        *://*.mixer.com/*
// @match        *://*.facebook.com/*
// @match        *://*.instagram.com/*
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.amazon.com/*
// @match        *://*.amazon.cn/*
// @match        *://*.amazon.co.jp/*
// @match        *://*.amazon.co.uk/*
// @match        *://*.amazon.de/*
// @match        *://*.amazon.fr/*
// @match        *://*.ebay.com/*
// @match        *://*.aliexpress.com/*
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.jd.com/*
// @match        *://*.pinduoduo.com/*
// @match        *://*.shopify.com/*
// @match        *://*.etsy.com/*
// @match        *://*.walmart.com/*
// @match        *://*.bestbuy.com/*
// @match        *://*.target.com/*
// @match        *://*.steam.com/*
// @match        *://*.epicgames.com/*
// @match        *://*.playstation.com/*
// @match        *://*.xbox.com/*
// @match        *://*.nintendo.com/*
// @match        *://*.gog.com/*
// @match        *://*.origin.com/*
// @match        *://*.ea.com/*
// @match        *://*.ubisoft.com/*
// @match        *://*.ubisoftconnect.com/*
// @match        *://*.battle.net/*
// @match        *://*.blizzard.com/*
// @match        *://*.riotgames.com/*
// @match        *://*.leagueoflegends.com/*
// @match        *://*.valorant.com/*
// @match        *://*.humblebundle.com/*
// @match        *://*.fanatical.com/*
// @match        *://*.greenmangaming.com/*
// @match        *://*.cdkeys.com/*
// @match        *://*.kinguin.net/*
// @match        *://*.g2a.com/*
// @match        *://*.gamersgate.com/*
// @match        *://*.indiegala.com/*
// @match        *://*.itch.io/*
// @match        *://*.gamebillet.com/*
// @match        *://*.gamesplanet.com/*
// @match        *://*.nuuvem.com/*
// @match        *://*.dlgamer.com/*
// @match        *://*.wingamestore.com/*
// @match        *://*.gamestop.com/*
// @match        *://*.playasia.com/*
// @match        *://*.razer.com/*
// @match        *://*.logitechg.com/*
// @match        *://*.corsair.com/*
// @match        *://*.nzxt.com/*
// @match        *://*.game.qq.com/*
// @match        *://*.wegame.com/*
// @match        *://*.tgp.qq.com/*
// @match        *://*.yx.tv/*
// @match        *://*.youxi.com/*
// @match        *://*.3dmgame.com/*
// @match        *://*.ali213.net/*
// @match        *://*.gamersky.com/*
// @match        *://*.3dm.com/*
// @match        *://*.coinmarketcap.com/*
// @match        *://*.coingecko.com/*
// @match        *://*.binance.com/*
// @match        *://*.coinbase.com/*
// @match        *://*.kraken.com/*
// @match        *://*.booking.com/*
// @match        *://*.airbnb.com/*
// @match        *://*.expedia.com/*
// @match        *://*.trip.com/*
// @match        *://*.ctrip.com/*
// @match        *://*.agoda.com/*
// @match        *://*.hotels.com/*
// @match        *://*.priceline.com/*
// @match        *://*.kayak.com/*
// @match        *://*.trivago.com/*
// @match        *://*.skyscanner.com/*
// @match        *://*.momondo.com/*
// @match        *://*.hotwire.com/*
// @match        *://*.orbitz.com/*
// @match        *://*.travelocity.com/*
// @match        *://*.cheaptickets.com/*
// @match        *://*.marriott.com/*
// @match        *://*.hilton.com/*
// @match        *://*.hyatt.com/*
// @match        *://*.ihg.com/*
// @match        *://*.accor.com/*
// @match        *://*.radisson.com/*
// @match        *://*.wyndham.com/*
// @match        *://*.choicehotels.com/*
// @match        *://*.bestwestern.com/*
// @match        *://*.hostelworld.com/*
// @match        *://*.hostelbookers.com/*
// @match        *://*.vrbo.com/*
// @match        *://*.vacationrentals.com/*
// @match        *://*.homeaway.com/*
// @match        *://*.flipkey.com/*
// @match        *://*.tripadvisor.com/*
// @match        *://*.yelp.com/*
// @match        *://*.opentable.com/*
// @match        *://*.rentalcars.com/*
// @match        *://*.enterprise.com/*
// @match        *://*.hertz.com/*
// @match        *://*.avis.com/*
// @match        *://*.budget.com/*
// @match        *://*.europcar.com/*
// @match        *://*.sixt.com/*
// @match        *://*.thrifty.com/*
// @match        *://*.alamo.com/*
// @match        *://*.dollar.com/*
// @match        *://*.national.com/*
// @match        *://*.viator.com/*
// @match        *://*.getyourguide.com/*
// @match        *://*.klook.com/*
// @match        *://*.tiqets.com/*
// @match        *://*.musement.com/*
// @match        *://*.trainline.com/*
// @match        *://*.rome2rio.com/*
// @match        *://*.omio.com/*
// @match        *://*.12306.cn/*
// @match        *://*.qunar.com/*
// @match        *://*.elong.com/*
// @match        *://*.tuniu.com/*
// @match        *://*.lvmama.com/*
// @match        *://*.mafengwo.cn/*
// @match        *://*.qyer.com/*
// @match        *://*.meituan.com/*
// @match        *://*.dianping.com/*
// @match        *://*.fliggy.com/*
// @match        *://*.alitrip.com/*
// @match        *://*.aws.amazon.com/*
// @match        *://*.console.aws.amazon.com/*
// @match        *://*.cloud.google.com/*
// @match        *://*.console.cloud.google.com/*
// @match        *://*.azure.microsoft.com/*
// @match        *://*.portal.azure.com/*
// @match        *://*.digitalocean.com/*
// @match        *://*.vultr.com/*
// @match        *://*.linode.com/*
// @match        *://*.hetzner.com/*
// @match        *://*.ovh.com/*
// @match        *://*.ovhcloud.com/*
// @match        *://*.cloudflare.com/*
// @match        *://*.heroku.com/*
// @match        *://*.vercel.com/*
// @match        *://*.netlify.com/*
// @match        *://*.railway.app/*
// @match        *://*.render.com/*
// @match        *://*.fly.io/*
// @match        *://*.aliyun.com/*
// @match        *://*.cloud.tencent.com/*
// @match        *://*.console.cloud.tencent.com/*
// @match        *://*.huaweicloud.com/*
// @match        *://*.console.huaweicloud.com/*
// @match        *://*.cloud.baidu.com/*
// @match        *://*.ucloud.cn/*
// @match        *://*.qiniu.com/*
// @match        *://*.upyun.com/*
// @match        *://*.qcloud.com/*
// @match        *://*.bandwagonhost.com/*
// @match        *://*.bwh88.net/*
// @match        *://*.kiwivm.64clouds.com/*
// @match        *://*.virmach.com/*
// @match        *://*.hostwinds.com/*
// @match        *://*.contabo.com/*
// @match        *://*.racknerd.com/*
// @match        *://*.hosthatch.com/*
// @match        *://*.buyvm.net/*
// @match        *://*.namecheap.com/*
// @match        *://*.godaddy.com/*
// @match        *://*.bluehost.com/*
// @match        *://*.hostgator.com/*
// @match        *://*.siteground.com/*
// @match        *://*.dreamhost.com/*
// @match        *://*.a2hosting.com/*
// @match        *://*.inmotion.com/*
// @match        *://*.greengeeks.com/*
// @match        *://*.spotify.com/*
// @match        *://*.apple.com/*
// @match        *://*.icloud.com/*
// @match        *://*.adobe.com/*
// @match        *://*.creativecloud.com/*
// @match        *://*.microsoft.com/*
// @match        *://*.office.com/*
// @match        *://*.office365.com/*
// @match        *://*.canva.com/*
// @match        *://*.figma.com/*
// @match        *://*.notion.so/*
// @match        *://*.notion.site/*
// @match        *://*.slack.com/*
// @match        *://*.discord.com/*
// @match        *://*.zoom.us/*
// @match        *://*.dropbox.com/*
// @match        *://*.onedrive.live.com/*
// @match        *://*.box.com/*
// @match        *://*.mega.nz/*
// @match        *://*.pcloud.com/*
// @match        *://*.sync.com/*
// @match        *://*.nordvpn.com/*
// @match        *://*.expressvpn.com/*
// @match        *://*.surfshark.com/*
// @match        *://*.protonvpn.com/*
// @match        *://*.cyberghostvpn.com/*
// @match        *://*.privateinternetaccess.com/*
// @match        *://*.ipvanish.com/*
// @match        *://*.tunnelbear.com/*
// @match        *://*.udemy.com/*
// @match        *://*.coursera.org/*
// @match        *://*.edx.org/*
// @match        *://*.skillshare.com/*
// @match        *://*.linkedin.com/*
// @match        *://*.pluralsight.com/*
// @match        *://*.datacamp.com/*
// @match        *://*.codecademy.com/*
// @match        *://*.udacity.com/*
// @match        *://*.domestika.com/*
// @match        *://*.masterclass.com/*
// @match        *://*.grammarly.com/*
// @match        *://*.quillbot.com/*
// @match        *://*.overleaf.com/*
// @match        *://*.medium.com/*
// @match        *://*.substack.com/*
// @match        *://*.patreon.com/*
// @match        *://*.buymeacoffee.com/*
// @match        *://*.ko-fi.com/*
// @match        *://*.github.com/*
// @match        *://*.gitlab.com/*
// @match        *://*.bitbucket.org/*
// @match        *://*.jira.atlassian.com/*
// @match        *://*.trello.com/*
// @match        *://*.asana.com/*
// @match        *://*.monday.com/*
// @match        *://*.clickup.com/*
// @match        *://*.airtable.com/*
// @match        *://*.coda.io/*
// @match        *://*.evernote.com/*
// @match        *://*.onenote.com/*
// @match        *://*.goodnotes.com/*
// @match        *://*.bear.app/*
// @match        *://*.obsidian.md/*
// @match        *://*.roamresearch.com/*
// @match        *://*.todoist.com/*
// @match        *://*.any.do/*
// @match        *://*.ticktick.com/*
// @match        *://*.chatgpt.com/*
// @match        *://*.openai.com/*
// @match        *://*.anthropic.com/*
// @match        *://*.claude.ai/*
// @match        *://*.midjourney.com/*
// @match        *://*.stability.ai/*
// @match        *://*.fireflies.ai/*
// @match        *://*.otter.ai/*
// @match        *://*.jasper.ai/*
// @match        *://*.copy.ai/*
// @match        *://*.writesonic.com/*
// @match        *://*.rytr.me/*
// @match        *://*.mailchimp.com/*
// @match        *://*.sendinblue.com/*
// @match        *://*.constantcontact.com/*
// @match        *://*.activecampaign.com/*
// @match        *://*.convertkit.com/*
// @match        *://*.calendly.com/*
// @match        *://*.acuityscheduling.com/*
// @match        *://*.setmore.com/*
// @match        *://*.zapier.com/*
// @match        *://*.ifttt.com/*
// @match        *://*.make.com/*
// @match        *://*.integromat.com/*
// @match        *://*.semrush.com/*
// @match        *://*.ahrefs.com/*
// @match        *://*.moz.com/*
// @match        *://*.similarweb.com/*
// @match        *://*.hotjar.com/*
// @match        *://*.crazyegg.com/*
// @match        *://*.optimizely.com/*
// @match        *://*.vwo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      v6.exchangerate-api.com
// @connect      api.fixer.io
// @connect      api.currencyapi.com
// @connect      ipapi.co
// @connect      api.coingecko.com
// @license      GPL-3.0-or-later
// @icon         https://raw.githubusercontent.com/FronNian/Currency-Converter/f34fe97c36eb706e51e6b8d252ea63f6da620797/assets/icon.svg
// @run-at       document-idle
// @homepage     https://greasyfork.org/zh-CN/scripts/553280-%E5%85%A8%E8%83%BD%E8%B4%A7%E5%B8%81%E8%BD%AC%E6%8D%A2%E5%99%A8-universal-currency-converter
// @supportURL   https://greasyfork.org/en/scripts/553280-%E5%85%A8%E8%83%BD%E8%B4%A7%E5%B8%81%E8%BD%AC%E6%8D%A2%E5%99%A8-universal-currency-converter?locale_override=1
// @downloadURL https://update.greasyfork.org/scripts/553280/%E2%9C%A8%F0%9F%92%B1%E6%B1%87%E7%8E%87%E8%BD%AC%E6%8D%A2%E5%99%A8%7C%E8%B4%A7%E5%B8%81%E6%8D%A2%E7%AE%97%7CCurrency%20Converter%20-%20%E7%BE%8E%E5%85%83%E6%AC%A7%E5%85%83%E6%AF%94%E7%89%B9%E5%B8%81%E4%BB%B7%E6%A0%BC%E5%AE%9E%E6%97%B6%E8%BD%AC%E6%8D%A2%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553280/%E2%9C%A8%F0%9F%92%B1%E6%B1%87%E7%8E%87%E8%BD%AC%E6%8D%A2%E5%99%A8%7C%E8%B4%A7%E5%B8%81%E6%8D%A2%E7%AE%97%7CCurrency%20Converter%20-%20%E7%BE%8E%E5%85%83%E6%AC%A7%E5%85%83%E6%AF%94%E7%89%B9%E5%B8%81%E4%BB%B7%E6%A0%BC%E5%AE%9E%E6%97%B6%E8%BD%AC%E6%8D%A2%E2%9C%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /*
   * 全能货币转换器 - Universal Currency Converter
   * Copyright (C) 2025 FronNian (huayuan4564@gmail.com)
   * 
   * This program is free software: you can redistribute it and/or modify
   * it under the terms of the GNU General Public License as published by
   * the Free Software Foundation, either version 3 of the License, or
   * (at your option) any later version.
   * 
   * This program is distributed in the hope that it will be useful,
   * but WITHOUT ANY WARRANTY; without even the implied warranty of
   * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
   * GNU General Public License for more details.
   * 
   * 如果您修改了此代码，请：
   * 1. 保留原作者信息（FronNian - huayuan4564@gmail.com）
   * 2. 注明修改内容
   * 3. 使用相同的GPL-3.0许可证
   * 4. 建议通知原作者（邮箱或GreasyFork评论区）
   * 
   * 完整许可证: https://www.gnu.org/licenses/gpl-3.0.txt
   */

  // API密钥配置
  // ExchangeRate-API: 04529d4768099d362afffc31
  // Fixer.io: 147078d87fed12fc4266aa216b3c98c9
  // CurrencyAPI: cur_live_cqiOETlTuk2UvLSDONtdIxhTZIlq6PPElZ9wtxlv

  /* ==================== 货币名称映射 ==================== */

  /**
   * 货币中文名称映射（57种主流货币）
   */
  const CURRENCY_NAMES_ZH = {
    // 主要货币
    'USD': '美元', 'EUR': '欧元', 'GBP': '英镑', 'JPY': '日元', 'CHF': '瑞士法郎',
    // 亚洲
    'CNY': '人民币', 'HKD': '港币', 'TWD': '新台币', 'KRW': '韩元', 'SGD': '新加坡元', 
    'THB': '泰铢', 'MYR': '马来西亚林吉特', 'IDR': '印尼盾', 'PHP': '菲律宾比索', 'VND': '越南盾', 
    'INR': '印度卢比', 'PKR': '巴基斯坦卢比', 'BDT': '孟加拉塔卡', 'LKR': '斯里兰卡卢比', 'NPR': '尼泊尔卢比',
    // 大洋洲
    'AUD': '澳元', 'NZD': '新西兰元',
    // 北美
    'CAD': '加元', 'MXN': '墨西哥比索',
    // 南美
    'BRL': '巴西雷亚尔', 'ARS': '阿根廷比索', 'CLP': '智利比索', 'COP': '哥伦比亚比索', 'PEN': '秘鲁索尔',
    // 欧洲
    'RUB': '卢布', 'PLN': '波兰兹罗提', 'CZK': '捷克克朗', 'HUF': '匈牙利福林', 'RON': '罗马尼亚列伊', 
    'BGN': '保加利亚列弗', 'HRK': '克罗地亚库纳', 'SEK': '瑞典克朗', 'NOK': '挪威克朗', 'DKK': '丹麦克朗', 
    'ISK': '冰岛克朗', 'TRY': '土耳其里拉', 'UAH': '乌克兰格里夫纳',
    // 中东
    'AED': '阿联酋迪拉姆', 'SAR': '沙特里亚尔', 'QAR': '卡塔尔里亚尔', 'KWD': '科威特第纳尔', 
    'BHD': '巴林第纳尔', 'OMR': '阿曼里亚尔', 'JOD': '约旦第纳尔', 'ILS': '以色列新谢克尔', 'EGP': '埃及镑',
    // 非洲
    'ZAR': '南非兰特', 'NGN': '尼日利亚奈拉', 'KES': '肯尼亚先令', 'GHS': '加纳塞地', 
    'MAD': '摩洛哥迪拉姆', 'TND': '突尼斯第纳尔', 'DZD': '阿尔及利亚第纳尔'
  };

  /* ==================== 默认配置 ==================== */
  
  /**
   * 默认配置对象
   * @type {Object}
   */
  const DEFAULT_CONFIG = {
    // 界面语言
    language: 'auto',  // auto: 自动检测, zh-CN, en, ja, ko
    
    // 排除的域名（不进行货币转换）
    excludedDomains: ['localhost', '127.0.0.1', 'xe.com', 'wise.com'],
    
    // 目标货币列表（最多5个，可在设置中修改）
    targetCurrencies: ['CNY', 'USD', 'EUR', 'GBP', 'JPY'],
    
    // 智能货币显示
    autoDetectLocation: true,  // 根据IP自动检测用户所在国家
    excludeSourceCurrency: true, // 排除原货币（如价格是USD就不显示USD转换）
    userCountryCurrency: null,  // 用户所在国家货币（自动检测后保存）
    maxDisplayCurrencies: 3,    // 最多显示的货币数量
    
    // 内联显示模式
    inlineMode: false,          // 直接在价格旁显示转换结果，无需悬停
    inlineShowCurrency: 'CNY',  // 内联模式显示的货币（默认显示第一个）
    
    // 自定义汇率（离线模式）
    enableCustomRates: false,   // 启用自定义汇率
    customRates: {              // 自定义汇率表（基准货币：USD）
      // 示例：'CNY': 7.25 表示 1 USD = 7.25 CNY
    },
    
    // API密钥配置（主密钥）
    apiKeys: {
      exchangeRateApi: '04529d4768099d362afffc31',
      fixer: '147078d87fed12fc4266aa216b3c98c9',
      currencyapi: 'cur_live_cqiOETlTuk2UvLSDONtdIxhTZIlq6PPElZ9wtxlv'
    },
    
    // API密钥池（备用密钥，用于轮换）
    apiKeyPools: {
      exchangeRateApi: [],  // 用户可添加多个备用密钥
      fixer: [],
      currencyapi: []
    },
    
    // 当前使用的密钥索引（用于轮换）
    currentKeyIndex: {
      exchangeRateApi: 0,
      fixer: 0,
      currencyapi: 0
    },
    
    // 缓存配置
    cacheExpiry: 3600000, // 1小时（毫秒）
    cryptoCacheExpiry: 300000, // 加密货币缓存5分钟（波动大）
    
    // 加密货币支持
    enableCrypto: false,  // 启用加密货币识别和转换
    cryptoCurrencies: ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'DOT', 'MATIC'],
    showCryptoInTooltip: true,  // 在工具提示中显示加密货币
    cryptoApiKey: '',  // CoinGecko Pro API Key (可选，免费版无需)
    
    // UI配置
    tooltipDelay: 500,       // 工具提示显示延迟（毫秒，推荐300-800）
    tooltipTheme: 'gradient', // 工具提示主题：gradient | light | dark
    
    // 性能配置
    enableLazyLoad: true,    // 启用懒加载
    scanOnIdle: true,        // 在空闲时扫描
    
    // 识别配置
    minAmount: 0.01,         // 最小金额
    maxAmount: 999999999,    // 最大金额
    
  };

  /* ==================== 配置管理模块 ==================== */
  
  /**
   * 配置管理器类
   * 负责用户配置的加载、保存、获取和重置
   */
  class ConfigManager {
    constructor() {
      this.config = this.load();
    }

    /**
     * 从GM_storage加载配置
     * @returns {Object} 配置对象
     */
    load() {
      try {
        const saved = GM_getValue('cc_config');
        if (saved) {
          const parsedConfig = JSON.parse(saved);
          // 合并默认配置和已保存配置，确保向后兼容
          const mergedConfig = { ...DEFAULT_CONFIG, ...parsedConfig };
          
          // 检查是否使用了自定义API密钥
          if (parsedConfig.apiKeys) {
            const customKeys = [];
            if (parsedConfig.apiKeys.exchangeRateApi !== DEFAULT_CONFIG.apiKeys.exchangeRateApi) {
              customKeys.push('ExchangeRate-API');
            }
            if (parsedConfig.apiKeys.fixer !== DEFAULT_CONFIG.apiKeys.fixer) {
              customKeys.push('Fixer.io');
            }
            if (parsedConfig.apiKeys.currencyapi !== DEFAULT_CONFIG.apiKeys.currencyapi) {
              customKeys.push('CurrencyAPI');
            }
            
            if (customKeys.length > 0) {
              console.log(`[CC] 🔑 使用自定义API密钥: ${customKeys.join(', ')}`);
            } else {
              console.log('[CC] 使用默认API密钥');
            }
          }
          
          return mergedConfig;
        }
      } catch (error) {
        console.error('[CurrencyConverter] Failed to load config:', error);
      }
      // 返回默认配置的副本
      console.log('[CC] 使用默认配置');
      return { ...DEFAULT_CONFIG };
    }

    /**
     * 保存配置到GM_storage
     * @param {Object} newConfig - 新的配置对象（部分或完整）
     */
    save(newConfig) {
      try {
        // 合并现有配置和新配置
        this.config = { ...this.config, ...newConfig };
        GM_setValue('cc_config', JSON.stringify(this.config));
        
        // 显示保存的密钥信息
        if (newConfig.apiKeys) {
          const keys = [];
          if (newConfig.apiKeys.exchangeRateApi) {
            keys.push(`ExchangeRate-API: ${newConfig.apiKeys.exchangeRateApi.substring(0, 8)}****`);
          }
          if (newConfig.apiKeys.fixer) {
            keys.push(`Fixer: ${newConfig.apiKeys.fixer.substring(0, 8)}****`);
          }
          if (newConfig.apiKeys.currencyapi) {
            keys.push(`CurrencyAPI: ${newConfig.apiKeys.currencyapi.substring(0, 8)}****`);
          }
          console.log('[CC] ✅ API密钥已保存:', keys.join(', '));
        } else {
          console.log('[CC] 配置已保存');
        }
      } catch (error) {
        console.error('[CurrencyConverter] Failed to save config:', error);
      }
    }

    /**
     * 获取单个配置项
     * @param {string} key - 配置项的键
     * @returns {*} 配置项的值
     */
    get(key) {
      return this.config[key];
    }

    /**
     * 设置单个配置项
     * @param {string} key - 配置项的键
     * @param {*} value - 配置项的值
     */
    set(key, value) {
      this.config[key] = value;
      this.save(this.config);
    }

    /**
     * 重置为默认配置
     */
    reset() {
      try {
        this.config = { ...DEFAULT_CONFIG };
        GM_setValue('cc_config', JSON.stringify(this.config));
        console.log('[CurrencyConverter] Config reset to defaults');
      } catch (error) {
        console.error('[CurrencyConverter] Failed to reset config:', error);
      }
    }

    /**
     * 获取所有配置
     * @returns {Object} 完整的配置对象
     */
    getAll() {
      return { ...this.config };
    }
  }

  /* ==================== 国际化翻译 ==================== */
  
  /**
   * 多语言翻译对象
   * 支持中文(zh-CN)、英文(en)、日文(ja)、韩文(ko)
   */
  const I18N_TRANSLATIONS = {
    'zh-CN': {
      tooltip: { update: '更新', history: '历史', errorUnavailable: '汇率数据暂时不可用', errorQuota: '可能是API配额用完了', errorHint: '点击油猴菜单 → 设置面板', close: '关闭' },
      settings: { title: '货币转换器设置', smartDisplay: '智能显示', autoDetect: '根据IP自动检测所在国家', autoDetectDesc: '启用后，优先显示你所在国家的货币（首次加载时检测）', excludeSource: '排除原货币', excludeSourceDesc: '转换结果中不显示原价格的货币（例如：美元价格不再显示美元转换）', maxDisplay: '最多显示货币数量', inlineMode: '一键批量显示模式', inlineModeDesc: '直接在价格旁显示转换结果，无需鼠标悬停（Alt+I 切换）', inlineCurrency: '内联显示货币', inlineCurrencyDesc: '选择在内联模式中显示的货币', targetCurrency: '目标货币', targetCurrencyDesc: '选择2-5个要转换的目标货币', apiKeys: 'API密钥（可选）', apiKeysDesc: '如果默认API配额用完，可以免费申请自己的API密钥：', getKey: '获取密钥', placeholder: '留空使用默认密钥', customRates: '自定义汇率（离线模式）', enableCustom: '启用自定义汇率', enableCustomDesc: '开启后将使用您手动设置的汇率，不再调用API（适用于离线或固定汇率场景）', customTip: '所有汇率以 USD（美元） 为基准货币', customExample: '例如：输入 CNY = 7.25 表示 1美元 = 7.25人民币', excludeSites: '排除网站', excludeSitesDesc: '不进行货币转换的网站', excludeSitesPlaceholder: '这些域名的网页不会进行价格识别和转换（每行一个域名）', excludeCurrent: '排除当前网站', hotkeys: '快捷键', hotkeysAvailable: '可用的快捷键：', language: '界面语言', languageDesc: '选择界面显示语言', cancel: '取消', save: '保存并刷新' },
      menu: { settings: '⚙️ 设置面板', reset: '🔄 重置配置', view: '🔍 查看当前配置', calculator: '💱 货币计算器 (Alt+C)' },
      calculator: { title: '货币计算器', rate: '汇率', updated: '更新', error: '无法获取汇率数据' },
      messages: { saved: '✅ 配置已保存！\n\n页面即将刷新以应用新设置。', resetConfirm: '确定要重置所有配置吗？\n这将恢复到默认设置。', resetSuccess: '配置已重置！刷新页面后生效。', minCurrency: '❌ 请至少选择2个目标货币！', maxCurrency: '❌ 最多只能选择5个目标货币！', invalidRate: '❌ 无效的汇率值', invalidRateDesc: '请输入大于0的数字！', minCustomRate: '❌ 请至少设置一个货币的汇率，或关闭自定义汇率功能！', excludeAdded: '已将 "{domain}" 添加到排除列表\n刷新页面后生效', excludeExists: '"{domain}" 已在排除列表中', excludeAddedPanel: '已添加 "{domain}" 到排除列表\n保存后将生效', rateUnavailable: '汇率数据不可用，请检查网络' },
      notification: { apiQuotaTitle: '🚨 汇率API配额已用完', apiQuotaBody: '所有内置API密钥的免费配额已耗尽，货币转换功能暂时不可用。', apiQuotaAction: '点击此处注册免费API密钥', apiQuotaHint: '在油猴菜单 → 设置面板中填入您的API密钥', dismiss: '我知道了' },
      config: { apiKeyTitle: 'API密钥配置', displaySettings: '显示设置', targetCurrenciesLabel: '目标货币', maxDisplay: '最多显示', pieces: '个', enabled: '启用', disabled: '禁用', userCountryCurrency: '用户国家货币', notDetected: '未检测', customKey: '自定义', defaultKey: '默认', freeQuota: '免费额度', requestsPerMonth: '请求/月', exampleText: '例如：输入 CNY = 7.25 表示 1美元 = 7.25人民币', selectCurrencyHint: '选择要显示的货币（至少2个，最多5个）', getKeyLink: '获取密钥 →' }
    },
    'en': {
      tooltip: { update: 'Updated', history: 'History', errorUnavailable: 'Exchange rate data temporarily unavailable', errorQuota: 'API quota may be exhausted', errorHint: 'Click Tampermonkey Menu → Settings', close: 'Close' },
      settings: { title: 'Currency Converter Settings', smartDisplay: 'Smart Display', autoDetect: 'Auto-detect country by IP', autoDetectDesc: 'When enabled, prioritize displaying your country\'s currency', excludeSource: 'Exclude source currency', excludeSourceDesc: 'Don\'t show the original currency in conversion results', maxDisplay: 'Max currencies to display', inlineMode: 'Batch Inline Display Mode', inlineModeDesc: 'Show conversion results directly next to prices (Alt+I to toggle)', inlineCurrency: 'Inline display currency', inlineCurrencyDesc: 'Select the currency to display in inline mode', targetCurrency: 'Target Currencies', targetCurrencyDesc: 'Select 2-5 target currencies for conversion', apiKeys: 'API Keys (Optional)', apiKeysDesc: 'If default API quota is exhausted, you can apply for free API keys:', getKey: 'Get Key', placeholder: 'Leave blank to use default key', customRates: 'Custom Exchange Rates (Offline Mode)', enableCustom: 'Enable custom rates', enableCustomDesc: 'When enabled, use your manually set rates instead of API calls', customTip: 'All rates are based on USD (US Dollar)', customExample: 'Example: CNY = 7.25 means 1 USD = 7.25 CNY', excludeSites: 'Exclude Websites', excludeSitesDesc: 'Websites where currency conversion will be disabled', excludeSitesPlaceholder: 'These domains will not have price detection and conversion (one domain per line)', excludeCurrent: 'Exclude Current Site', hotkeys: 'Keyboard Shortcuts', hotkeysAvailable: 'Available shortcuts:', language: 'Interface Language', languageDesc: 'Select interface display language', cancel: 'Cancel', save: 'Save & Refresh' },
      menu: { settings: '⚙️ Settings', reset: '🔄 Reset Config', view: '🔍 View Current Config', calculator: '💱 Currency Calculator (Alt+C)' },
      calculator: { title: 'Currency Calculator', rate: 'Rate', updated: 'Updated', error: 'Unable to fetch exchange rates' },
      messages: { saved: '✅ Settings saved!\n\nPage will refresh to apply changes.', resetConfirm: 'Reset all settings to defaults?', resetSuccess: 'Settings reset! Refresh the page to take effect.', minCurrency: '❌ Please select at least 2 target currencies!', maxCurrency: '❌ Maximum 5 target currencies allowed!', invalidRate: '❌ Invalid exchange rate', invalidRateDesc: 'Please enter a number greater than 0!', minCustomRate: '❌ Please set at least one currency rate, or disable custom rates!', excludeAdded: 'Added "{domain}" to exclusion list\nRefresh the page to take effect', excludeExists: '"{domain}" is already in the exclusion list', excludeAddedPanel: 'Added "{domain}" to exclusion list\nWill take effect after saving', rateUnavailable: 'Exchange rate data unavailable, please check network' },
      notification: { apiQuotaTitle: '🚨 API Quota Exhausted', apiQuotaBody: 'All built-in API keys have run out of free quota. Currency conversion is temporarily unavailable.', apiQuotaAction: 'Click here to get your free API key', apiQuotaHint: 'Enter your API key in Tampermonkey Menu → Settings Panel', dismiss: 'Got it' },
      config: { apiKeyTitle: 'API Key Configuration', displaySettings: 'Display Settings', targetCurrenciesLabel: 'Target Currencies', maxDisplay: 'Max Display', pieces: '', enabled: 'Enabled', disabled: 'Disabled', userCountryCurrency: 'User Country Currency', notDetected: 'Not Detected', customKey: 'Custom', defaultKey: 'Default', freeQuota: 'Free Quota', requestsPerMonth: 'requests/month', exampleText: 'Example: CNY = 7.25 means 1 USD = 7.25 CNY', selectCurrencyHint: 'Select currencies to display (minimum 2, maximum 5)', getKeyLink: 'Get Key →' }
    },
    'ja': {
      tooltip: { update: '更新', history: '履歴', errorUnavailable: '為替レートデータが一時的に利用できません', errorQuota: 'APIクォータが使い果たされた可能性があります', errorHint: 'Tampermonkeyメニュー → 設定', close: '閉じる' },
      settings: { title: '通貨換算設定', smartDisplay: 'スマート表示', autoDetect: 'IPで国を自動検出', autoDetectDesc: '有効にすると、あなたの国の通貨を優先表示します', excludeSource: '元の通貨を除外', excludeSourceDesc: '換算結果に元の通貨を表示しない', maxDisplay: '最大表示通貨数', inlineMode: '一括インライン表示モード', inlineModeDesc: '価格の横に直接換算結果を表示（Alt+I で切替）', inlineCurrency: 'インライン表示通貨', inlineCurrencyDesc: 'インラインモードで表示する通貨を選択', targetCurrency: '対象通貨', targetCurrencyDesc: '換算する通貨を2～5個選択', apiKeys: 'APIキー（オプション）', apiKeysDesc: 'デフォルトのAPIクォータが使い果たされた場合、無料でAPIキーを申請できます：', getKey: 'キー取得', placeholder: '空白でデフォルトキーを使用', customRates: 'カスタム為替レート（オフラインモード）', enableCustom: 'カスタムレートを有効化', enableCustomDesc: '有効にすると、APIの代わりに手動設定したレートを使用します', customTip: 'すべてのレートはUSD（米ドル）を基準にしています', customExample: '例：CNY = 7.25 は 1米ドル = 7.25人民元を意味します', excludeSites: '除外するウェブサイト', excludeSitesDesc: '通貨換算が無効になるウェブサイト', excludeSitesPlaceholder: 'これらのドメインでは価格検出と換算が行われません（1行に1ドメイン）', excludeCurrent: '現在のサイトを除外', hotkeys: 'キーボードショートカット', hotkeysAvailable: '利用可能なショートカット：', language: 'インターフェース言語', languageDesc: 'インターフェース表示言語を選択', cancel: 'キャンセル', save: '保存して更新' },
      menu: { settings: '⚙️ 設定', reset: '🔄 リセット', view: '🔍 現在の設定を表示', calculator: '💱 通貨計算機 (Alt+C)' },
      calculator: { title: '通貨計算機', rate: 'レート', updated: '更新', error: '為替レートを取得できません' },
      messages: { saved: '✅ 設定を保存しました！\n\nページを更新して変更を適用します。', resetConfirm: 'すべての設定をデフォルトにリセットしますか？', resetSuccess: '設定をリセットしました！ページを更新して反映してください。', minCurrency: '❌ 少なくとも2つの通貨を選択してください！', maxCurrency: '❌ 最大5つまでの通貨を選択できます！', invalidRate: '❌ 無効な為替レート', invalidRateDesc: '0より大きい数値を入力してください！', minCustomRate: '❌ 少なくとも1つの通貨レートを設定するか、カスタムレートを無効にしてください！', excludeAdded: '"{domain}" を除外リストに追加しました\nページを更新して反映してください', excludeExists: '"{domain}" は既に除外リストにあります', excludeAddedPanel: '"{domain}" を除外リストに追加しました\n保存後に反映されます', rateUnavailable: '為替レートデータが利用できません、ネットワークを確認してください' },
      notification: { apiQuotaTitle: '🚨 APIクォータが枯渇しました', apiQuotaBody: 'すべての組み込みAPIキーの無料枠が使い果たされました。通貨変換機能は一時的に利用できません。', apiQuotaAction: 'ここをクリックして無料APIキーを取得', apiQuotaHint: 'Tampermonkeyメニュー → 設定パネルでAPIキーを入力', dismiss: '了解' },
      config: { apiKeyTitle: 'APIキー設定', displaySettings: '表示設定', targetCurrenciesLabel: '対象通貨', maxDisplay: '最大表示', pieces: '個', enabled: '有効', disabled: '無効', userCountryCurrency: 'ユーザー国通貨', notDetected: '未検出', customKey: 'カスタム', defaultKey: 'デフォルト', freeQuota: '無料枠', requestsPerMonth: 'リクエスト/月', exampleText: '例：CNY = 7.25 は 1米ドル = 7.25人民元を意味します', selectCurrencyHint: '表示する通貨を選択（最低2個、最大5個）', getKeyLink: 'キー取得 →' }
    },
    'ko': {
      tooltip: { update: '업데이트', history: '기록', errorUnavailable: '환율 데이터를 일시적으로 사용할 수 없습니다', errorQuota: 'API 할당량이 소진되었을 수 있습니다', errorHint: 'Tampermonkey 메뉴 → 설정', close: '닫기' },
      settings: { title: '통화 변환기 설정', smartDisplay: '스마트 표시', autoDetect: 'IP로 국가 자동 감지', autoDetectDesc: '활성화하면 귀하의 국가 통화를 우선 표시합니다', excludeSource: '원본 통화 제외', excludeSourceDesc: '변환 결과에 원본 통화를 표시하지 않음', maxDisplay: '최대 표시 통화 수', inlineMode: '일괄 인라인 표시 모드', inlineModeDesc: '가격 옆에 직접 변환 결과 표시 (Alt+I로 전환)', inlineCurrency: '인라인 표시 통화', inlineCurrencyDesc: '인라인 모드에서 표시할 통화 선택', targetCurrency: '대상 통화', targetCurrencyDesc: '변환할 통화 2~5개 선택', apiKeys: 'API 키 (선택사항)', apiKeysDesc: '기본 API 할당량이 소진된 경우 무료로 API 키를 신청할 수 있습니다:', getKey: '키 받기', placeholder: '비워두면 기본 키 사용', customRates: '사용자 정의 환율 (오프라인 모드)', enableCustom: '사용자 정의 환율 활성화', enableCustomDesc: '활성화하면 API 대신 수동 설정한 환율을 사용합니다', customTip: '모든 환율은 USD (미국 달러)를 기준으로 합니다', customExample: '예: CNY = 7.25는 1달러 = 7.25위안을 의미합니다', excludeSites: '제외할 웹사이트', excludeSitesDesc: '통화 변환이 비활성화될 웹사이트', excludeSitesPlaceholder: '이러한 도메인에서는 가격 감지 및 변환이 수행되지 않습니다 (한 줄에 하나의 도메인)', excludeCurrent: '현재 사이트 제외', hotkeys: '키보드 단축키', hotkeysAvailable: '사용 가능한 단축키:', language: '인터페이스 언어', languageDesc: '인터페이스 표시 언어 선택', cancel: '취소', save: '저장 및 새로고침' },
      menu: { settings: '⚙️ 설정', reset: '🔄 재설정', view: '🔍 현재 설정 보기', calculator: '💱 통화 계산기 (Alt+C)' },
      calculator: { title: '통화 계산기', rate: '환율', updated: '업데이트됨', error: '환율 데이터를 가져올 수 없습니다' },
      messages: { saved: '✅ 설정이 저장되었습니다!\n\n변경사항을 적용하기 위해 페이지를 새로고침합니다.', resetConfirm: '모든 설정을 기본값으로 재설정하시겠습니까?', resetSuccess: '설정이 재설정되었습니다! 페이지를 새로고침하여 적용하세요.', minCurrency: '❌ 최소 2개의 통화를 선택하세요!', maxCurrency: '❌ 최대 5개의 통화까지 선택할 수 있습니다!', invalidRate: '❌ 잘못된 환율', invalidRateDesc: '0보다 큰 숫자를 입력하세요!', minCustomRate: '❌ 최소 하나의 통화 환율을 설정하거나 사용자 정의 환율을 비활성화하세요!', excludeAdded: '"{domain}"을(를) 제외 목록에 추가했습니다\n페이지를 새로고침하여 적용하세요', excludeExists: '"{domain}"은(는) 이미 제외 목록에 있습니다', excludeAddedPanel: '"{domain}"을(를) 제외 목록에 추가했습니다\n저장 후 적용됩니다', rateUnavailable: '환율 데이터를 사용할 수 없습니다. 네트워크를 확인하세요' },
      notification: { apiQuotaTitle: '🚨 API 할당량 소진', apiQuotaBody: '모든 내장 API 키의 무료 할당량이 소진되었습니다. 통화 변환 기능을 일시적으로 사용할 수 없습니다.', apiQuotaAction: '여기를 클릭하여 무료 API 키 받기', apiQuotaHint: 'Tampermonkey 메뉴 → 설정 패널에서 API 키 입력', dismiss: '알겠습니다' },
      config: { apiKeyTitle: 'API 키 설정', displaySettings: '표시 설정', targetCurrenciesLabel: '대상 통화', maxDisplay: '최대 표시', pieces: '개', enabled: '활성화', disabled: '비활성화', userCountryCurrency: '사용자 국가 통화', notDetected: '미감지', customKey: '커스텀', defaultKey: '기본', freeQuota: '무료 할당량', requestsPerMonth: '요청/월', exampleText: '예: CNY = 7.25는 1달러 = 7.25위안을 의미합니다', selectCurrencyHint: '표시할 통화 선택 (최소 2개, 최대 5개)', getKeyLink: '키 받기 →' }
    }
  };

  /**
   * 国际化管理器类
   */
  class I18nManager {
    constructor(configManager) {
      this.config = configManager;
      this.currentLang = this.detectLanguage();
      this.translations = I18N_TRANSLATIONS[this.currentLang] || I18N_TRANSLATIONS['zh-CN'];
    }

    detectLanguage() {
      const savedLang = this.config.get('language');
      if (savedLang && savedLang !== 'auto') return savedLang;
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith('zh')) return 'zh-CN';
      if (browserLang.startsWith('ja')) return 'ja';
      if (browserLang.startsWith('ko')) return 'ko';
      return 'en';
    }

    t(key, params = {}) {
      const keys = key.split('.');
      let value = this.translations;
      for (const k of keys) {
        value = value?.[k];
        if (!value) return key;
      }
      if (typeof value === 'string' && Object.keys(params).length > 0) {
        return value.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
      }
      return value;
    }

    setLanguage(lang) {
      if (I18N_TRANSLATIONS[lang]) {
        this.currentLang = lang;
        this.translations = I18N_TRANSLATIONS[lang];
        this.config.set('language', lang);
      }
    }

    getCurrentLanguage() {
      return this.currentLang;
    }
  }

  /* ==================== 通知管理器 ==================== */
  
  /**
   * 通知管理器类
   * 负责显示右上角 Toast 通知，支持每日一次提醒
   */
  class NotificationManager {
    constructor(i18nManager) {
      this.i18n = i18nManager;
      this.STORAGE_KEY = 'cc_last_quota_notification';
      this.ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24小时
    }

    /**
     * 检查今天是否已经显示过通知
     * @returns {boolean}
     */
    hasShownToday() {
      try {
        const lastShown = GM_getValue(this.STORAGE_KEY, 0);
        const now = Date.now();
        return (now - lastShown) < this.ONE_DAY_MS;
      } catch (e) {
        return false;
      }
    }

    /**
     * 记录今天已显示通知
     */
    markAsShown() {
      try {
        GM_setValue(this.STORAGE_KEY, Date.now());
      } catch (e) {
        console.error('[CC] Failed to save notification state:', e);
      }
    }

    /**
     * 显示 API 配额耗尽通知（每天最多一次）
     */
    showApiQuotaExhausted() {
      // 检查今天是否已显示
      if (this.hasShownToday()) {
        console.log('[CC] API quota notification already shown today, skipping');
        return;
      }

      // 标记已显示
      this.markAsShown();

      // 创建并显示 Toast
      this.createToast();
    }

    /**
     * 创建 Toast 通知元素
     */
    createToast() {
      // 如果已存在则移除
      const existing = document.getElementById('cc-quota-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.id = 'cc-quota-toast';
      toast.innerHTML = `
        <style>
          #cc-quota-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 360px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            animation: cc-toast-slide-in 0.4s ease-out;
            overflow: hidden;
          }
          @keyframes cc-toast-slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes cc-toast-slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          #cc-quota-toast.hiding {
            animation: cc-toast-slide-out 0.3s ease-in forwards;
          }
          #cc-quota-toast .cc-toast-header {
            padding: 16px 16px 12px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          #cc-quota-toast .cc-toast-icon {
            font-size: 28px;
          }
          #cc-quota-toast .cc-toast-title {
            color: white;
            font-size: 16px;
            font-weight: 600;
            flex: 1;
          }
          #cc-quota-toast .cc-toast-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            transition: background 0.2s;
          }
          #cc-quota-toast .cc-toast-close:hover {
            background: rgba(255,255,255,0.3);
          }
          #cc-quota-toast .cc-toast-body {
            padding: 0 16px 16px;
            color: rgba(255,255,255,0.95);
            font-size: 14px;
            line-height: 1.5;
          }
          #cc-quota-toast .cc-toast-action {
            display: block;
            margin: 12px 16px 16px;
            padding: 12px 16px;
            background: white;
            color: #ee5a24;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          #cc-quota-toast .cc-toast-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          #cc-quota-toast .cc-toast-hint {
            padding: 12px 16px;
            background: rgba(0,0,0,0.1);
            color: rgba(255,255,255,0.9);
            font-size: 12px;
            text-align: center;
          }
          #cc-quota-toast .cc-toast-dismiss {
            display: block;
            width: 100%;
            padding: 10px;
            background: rgba(0,0,0,0.15);
            border: none;
            color: rgba(255,255,255,0.8);
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
          }
          #cc-quota-toast .cc-toast-dismiss:hover {
            background: rgba(0,0,0,0.25);
          }
        </style>
        <div class="cc-toast-header">
          <span class="cc-toast-icon">💱</span>
          <span class="cc-toast-title">${this.i18n.t('notification.apiQuotaTitle')}</span>
          <button class="cc-toast-close" title="Close">×</button>
        </div>
        <div class="cc-toast-body">
          ${this.i18n.t('notification.apiQuotaBody')}
        </div>
        <a class="cc-toast-action" href="https://www.exchangerate-api.com/" target="_blank" rel="noopener">
          ${this.i18n.t('notification.apiQuotaAction')} →
        </a>
        <div class="cc-toast-hint">
          💡 ${this.i18n.t('notification.apiQuotaHint')}
        </div>
        <button class="cc-toast-dismiss">${this.i18n.t('notification.dismiss')}</button>
      `;

      document.body.appendChild(toast);

      // 绑定关闭事件
      const closeBtn = toast.querySelector('.cc-toast-close');
      const dismissBtn = toast.querySelector('.cc-toast-dismiss');
      
      const hideToast = () => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
      };

      closeBtn.addEventListener('click', hideToast);
      dismissBtn.addEventListener('click', hideToast);

      // 30秒后自动隐藏
      setTimeout(() => {
        if (document.getElementById('cc-quota-toast')) {
          hideToast();
        }
      }, 30000);

      console.log('[CC] 🚨 API quota exhausted notification shown');
    }
  }

  /* ==================== 工具函数库 ==================== */
  
  /**
   * 通用工具函数库
   * 提供防抖、节流、休眠等辅助功能
   */
  const Utils = {
    /**
     * 防抖函数 - 延迟执行，多次调用只执行最后一次
     * @param {Function} func - 要防抖的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {Function} 防抖后的函数
     * 
     * @example
     * const debouncedFn = Utils.debounce(() => console.log('Hello'), 300);
     * debouncedFn(); // 只有在300ms内没有再次调用时才会执行
     */
    debounce(func, delay) {
      let timer = null;
      return function(...args) {
        const context = this;
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(context, args);
        }, delay);
      };
    },

    /**
     * 节流函数 - 限制函数执行频率
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 时间间隔（毫秒）
     * @returns {Function} 节流后的函数
     * 
     * @example
     * const throttledFn = Utils.throttle(() => console.log('Hello'), 300);
     * throttledFn(); // 在300ms内多次调用只执行一次
     */
    throttle(func, limit) {
      let inThrottle = false;
      return function(...args) {
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => {
            inThrottle = false;
          }, limit);
        }
      };
    },

    /**
     * 异步休眠函数
     * @param {number} ms - 休眠时间（毫秒）
     * @returns {Promise} Promise对象
     * 
     * @example
     * await Utils.sleep(1000); // 休眠1秒
     */
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * HTML转义函数 - 防止XSS攻击
     * @param {string} text - 要转义的文本
     * @returns {string} 转义后的文本
     * 
     * @example
     * Utils.escapeHTML('<script>alert("XSS")</script>');
     * // 返回: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
     */
    escapeHTML(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, m => map[m]);
    },

    /**
     * 数字格式化函数
     * @param {number} num - 要格式化的数字
     * @param {number} decimals - 小数位数（默认2位）
     * @returns {string} 格式化后的数字字符串
     * 
     * @example
     * Utils.formatNumber(1234567.89); // 返回: "1,234,567.89"
     * Utils.formatNumber(1234.5, 0);  // 返回: "1,235"
     */
    formatNumber(num, decimals = 2) {
      if (isNaN(num)) return '0';
      
      const fixed = Number(num).toFixed(decimals);
      const parts = fixed.split('.');
      
      // 添加千分位分隔符
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      
      return parts.join('.');
    }
  };

  /* ==================== 地理位置检测模块 ==================== */
  
  /**
   * 地理位置检测器类
   * 根据IP地址检测用户所在国家，并映射到对应货币
   */
  class GeoLocationDetector {
    constructor(configManager) {
      this.config = configManager;
      this.countryToCurrency = {
        'US': 'USD', 'CN': 'CNY', 'GB': 'GBP', 'JP': 'JPY', 'EU': 'EUR',
        'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR',
        'HK': 'HKD', 'TW': 'TWD', 'KR': 'KRW', 'AU': 'AUD', 'CA': 'CAD',
        'SG': 'SGD', 'CH': 'CHF', 'RU': 'RUB', 'IN': 'INR', 'BR': 'BRL',
        'MX': 'MXN', 'ID': 'IDR', 'TR': 'TRY', 'SA': 'SAR', 'ZA': 'ZAR'
      };
    }

    /**
     * 检测用户所在国家并返回对应货币
     * @returns {Promise<string|null>} 国家对应的货币代码
     */
    async detectUserCurrency() {
      // 先检查是否已缓存
      const cached = this.config.get('userCountryCurrency');
      if (cached) {
        console.log(`[CC] 使用缓存的用户国家货币: ${cached}`);
        return cached;
      }

      // 如果用户禁用了自动检测
      if (!this.config.get('autoDetectLocation')) {
        console.log('[CC] 自动检测已禁用');
        return null;
      }

      try {
        console.log('[CC] 正在检测用户地理位置...');
        
        // 使用免费IP地理位置API（ipapi.co）
        const countryCode = await this.fetchCountryCode();
        
        if (!countryCode) {
          console.log('[CC] 无法获取国家代码');
          return null;
        }

        const currency = this.countryToCurrency[countryCode] || null;
        
        if (currency) {
          console.log(`[CC] 🌍 检测到用户位于: ${countryCode}, 货币: ${currency}`);
          // 保存到配置
          this.config.save({ userCountryCurrency: currency });
          return currency;
        } else {
          console.log(`[CC] 国家代码 ${countryCode} 未映射到货币`);
          return null;
        }
      } catch (error) {
        console.error('[CC] 地理位置检测失败:', error);
        return null;
      }
    }

    /**
     * 调用IP API获取国家代码
     * @returns {Promise<string|null>}
     */
    async fetchCountryCode() {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'https://ipapi.co/country/',
          timeout: 5000,
          onload: (response) => {
            if (response.status === 200) {
              const countryCode = response.responseText.trim().toUpperCase();
              resolve(countryCode);
            } else {
              console.warn('[CC] IP API返回错误:', response.status);
              resolve(null);
            }
          },
          onerror: (error) => {
            console.error('[CC] IP API请求失败:', error);
            resolve(null);
          },
          ontimeout: () => {
            console.warn('[CC] IP API请求超时');
            resolve(null);
          }
        });
      });
    }

    /**
     * 手动设置用户国家货币
     * @param {string} currency - 货币代码
     */
    setUserCurrency(currency) {
      this.config.save({ userCountryCurrency: currency });
      console.log(`[CC] 用户国家货币已设置为: ${currency}`);
    }

    /**
     * 清除缓存的国家货币
     */
    clearCache() {
      this.config.save({ userCountryCurrency: null });
      console.log('[CC] 已清除用户国家货币缓存');
    }
  }

  /* ==================== 汇率数据管理器 ==================== */
  
  /**
   * 汇率数据管理器类
   * 负责调用汇率API、缓存管理和货币转换计算
   */
  class ExchangeRateManager {
    constructor(configManager, notificationManager = null) {
      this.config = configManager;
      this.notificationManager = notificationManager;
      this.apis = [
        {
          name: 'exchangerate-api',
          url: 'https://v6.exchangerate-api.com/v6/{key}/latest/{base}',
          priority: 1,
          requiresKey: true,
          parseResponse: (data) => ({
            base: data.base_code,
            rates: data.conversion_rates,
            timestamp: Date.now(),
            source: 'exchangerate-api'
          })
        },
        {
          name: 'fixer',
          url: 'https://api.fixer.io/latest?access_key={key}&base={base}',
          priority: 2,
          requiresKey: true,
          parseResponse: (data) => ({
            base: data.base,
            rates: data.rates,
            timestamp: Date.now(),
            source: 'fixer'
          })
        },
        {
          name: 'currencyapi',
          url: 'https://api.currencyapi.com/v3/latest?apikey={key}&base_currency={base}',
          priority: 3,
          requiresKey: true,
          parseResponse: (data) => {
            const rates = {};
            if (data.data) {
              for (const [currency, info] of Object.entries(data.data)) {
                rates[currency] = info.value;
              }
            }
            return {
              base: data.meta?.last_updated_at ? 'USD' : 'USD',
              rates: rates,
              timestamp: Date.now(),
              source: 'currencyapi'
            };
          }
        }
      ];
      this.currentRates = null;
      this.updatePromise = null;
    }

    /**
     * 获取汇率数据（带缓存）
     * @param {string} baseCurrency - 基准货币代码（默认USD）
     * @returns {Promise<Object>} 汇率数据对象
     */
    async getRates(baseCurrency = 'USD') {
      // 检查是否启用自定义汇率
      if (this.config.get('enableCustomRates')) {
        const customRates = this.buildCustomRates(baseCurrency);
        if (customRates) {
          console.log('[CC] 使用自定义汇率（离线模式）');
          this.currentRates = customRates;
          return customRates;
        }
      }

      // 检查缓存
      const cached = this.getFromCache(baseCurrency);
      if (cached && !this.isExpired(cached)) {
        this.currentRates = cached.ratesData;
        return cached.ratesData;
      }

      // 避免并发请求
      if (this.updatePromise) {
        return this.updatePromise;
      }

      this.updatePromise = this.fetchRates(baseCurrency);
      try {
        const rates = await this.updatePromise;
        this.saveToCache(baseCurrency, rates);
        this.currentRates = rates;
        return rates;
      } catch (error) {
        console.warn('[CC] API failed, trying cache:', error);
        // 降级到缓存（即使过期）
        if (cached) {
          console.log('[CC] Using expired cache as fallback');
          this.currentRates = cached.ratesData;
          return cached.ratesData;
        }
        throw error;
      } finally {
        this.updatePromise = null;
      }
    }

    /**
     * 从API获取汇率
     * @param {string} baseCurrency - 基准货币代码
     * @returns {Promise<Object>} 汇率数据对象
     */
    async fetchRates(baseCurrency) {
      // 按优先级尝试每个API
      for (const api of this.apis) {
        // 检查是否需要密钥
        if (api.requiresKey) {
          const keyName = api.name === 'exchangerate-api' ? 'exchangeRateApi' : api.name;
          const apiKey = this.config.get('apiKeys')[keyName];
          if (!apiKey) {
            console.warn(`[CC] No API key for ${api.name}, skipping`);
            continue;
          }
        }

        const keyName = api.name === 'exchangerate-api' ? 'exchangeRateApi' : api.name;
        const allKeys = this.getAllKeys(keyName);
        
        // 尝试该API的所有可用密钥
        for (let keyAttempt = 0; keyAttempt < allKeys.length; keyAttempt++) {
          try {
            console.log(`[CC] Trying API: ${api.name} (key ${keyAttempt + 1}/${allKeys.length})`);
            const data = await this.callAPI(api, baseCurrency);
            if (data && data.rates) {
              console.log(`[CC] ✅ Successfully got rates from ${api.name}`);
              return data;
            }
          } catch (error) {
            console.warn(`[CC] ❌ API ${api.name} failed (key ${keyAttempt + 1}/${allKeys.length}):`, error.message);
            
            // 如果还有其他密钥，切换并重试
            if (keyAttempt < allKeys.length - 1) {
              this.switchToNextKey(keyName);
              console.log(`[CC] 🔄 Retrying ${api.name} with next key...`);
            }
          }
        }
        
        console.warn(`[CC] All keys exhausted for ${api.name}, trying next API...`);
      }

      // 所有 API 和密钥都用尽，触发通知
      if (this.notificationManager) {
        this.notificationManager.showApiQuotaExhausted();
      }

      throw new Error('All APIs and keys exhausted');
    }

    /**
     * 获取API的所有可用密钥（主密钥 + 备用密钥池）
     * @param {string} keyName - 密钥名称
     * @returns {Array<string>} 密钥数组
     */
    getAllKeys(keyName) {
      const mainKey = this.config.get('apiKeys')[keyName] || '';
      const keyPool = this.config.get('apiKeyPools')[keyName] || [];
      
      // 合并主密钥和备用密钥池（去重）
      const allKeys = [mainKey, ...keyPool].filter(key => key && key.trim());
      return [...new Set(allKeys)]; // 去重
    }
    
    /**
     * 获取当前应使用的密钥
     * @param {string} keyName - 密钥名称
     * @returns {string} 当前密钥
     */
    getCurrentKey(keyName) {
      const allKeys = this.getAllKeys(keyName);
      if (allKeys.length === 0) return '';
      
      const currentIndex = this.config.get('currentKeyIndex')[keyName] || 0;
      return allKeys[currentIndex % allKeys.length];
    }
    
    /**
     * 切换到下一个可用密钥
     * @param {string} keyName - 密钥名称
     * @returns {boolean} 是否还有其他密钥可用
     */
    switchToNextKey(keyName) {
      const allKeys = this.getAllKeys(keyName);
      if (allKeys.length <= 1) {
        console.warn(`[CC] No alternative keys available for ${keyName}`);
        return false;
      }
      
      const currentIndex = this.config.get('currentKeyIndex');
      const newIndex = (currentIndex[keyName] + 1) % allKeys.length;
      
      // 更新索引
      this.config.set('currentKeyIndex', {
        ...currentIndex,
        [keyName]: newIndex
      });
      
      console.log(`[CC] 🔄 Switched to key ${newIndex + 1}/${allKeys.length} for ${keyName}`);
      return newIndex !== 0; // 如果回到第一个密钥，说明已轮换一圈
    }

    /**
     * 调用单个API（带重试机制和密钥轮换）
     * @param {Object} api - API配置对象
     * @param {string} baseCurrency - 基准货币代码
     * @param {number} retries - 重试次数（默认3次）
     * @returns {Promise<Object>} API响应数据
     */
    async callAPI(api, baseCurrency, retries = 3) {
      const keyName = api.name === 'exchangerate-api' ? 'exchangeRateApi' : api.name;
      const apiKey = this.getCurrentKey(keyName);
      
      // 显示正在使用的API密钥（部分遮盖）
      const maskedKey = apiKey ? `${apiKey.substring(0, 8)}****${apiKey.substring(apiKey.length - 4)}` : 'no-key';
      const allKeys = this.getAllKeys(keyName);
      const currentIndex = this.config.get('currentKeyIndex')[keyName] || 0;
      console.log(`[CC] 调用 ${api.name} API (密钥 ${currentIndex + 1}/${allKeys.length}: ${maskedKey})`);
      
      const url = api.url
        .replace('{key}', apiKey)
        .replace('{base}', baseCurrency);

      for (let i = 0; i < retries; i++) {
        try {
          const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'GET',
              url: url,
              timeout: 10000,
              onload: (resp) => {
                if (resp.status === 200) {
                  try {
                    const data = JSON.parse(resp.responseText);
                    resolve(data);
                  } catch (e) {
                    reject(new Error('Invalid JSON response'));
                  }
                } else {
                  reject(new Error(`HTTP ${resp.status}: ${resp.statusText}`));
                }
              },
              onerror: (resp) => {
                reject(new Error('Network error'));
              },
              ontimeout: () => {
                reject(new Error('Request timeout'));
              }
            });
          });

          // 使用API特定的解析函数
          return api.parseResponse(response);
        } catch (error) {
          if (i === retries - 1) {
            throw error;
          }
          // 指数退避
          const backoffTime = 1000 * (i + 1);
          console.log(`[CC] Retry ${i + 1}/${retries} after ${backoffTime}ms`);
          await Utils.sleep(backoffTime);
        }
      }
    }

    /**
     * 货币转换
     * @param {number} amount - 金额
     * @param {string} fromCurrency - 源货币代码
     * @param {string} toCurrency - 目标货币代码
     * @returns {number} 转换后的金额
     */
    convert(amount, fromCurrency, toCurrency) {
      if (!this.currentRates) {
        throw new Error('Rates not loaded');
      }

      if (fromCurrency === toCurrency) {
        return amount;
      }

      const base = this.currentRates.base;
      const rates = this.currentRates.rates;

      // 如果from是base货币
      if (fromCurrency === base) {
        return amount * (rates[toCurrency] || 1);
      }

      // 如果to是base货币
      if (toCurrency === base) {
        return amount / (rates[fromCurrency] || 1);
      }

      // 两者都不是base，需要中转
      const inBase = amount / (rates[fromCurrency] || 1);
      return inBase * (rates[toCurrency] || 1);
    }

    /**
     * 从缓存读取汇率数据
     * @param {string} baseCurrency - 基准货币代码
     * @returns {Object|null} 缓存数据或null
     */
    getFromCache(baseCurrency) {
      try {
        const key = `cc_rates_${baseCurrency}`;
        const cached = GM_getValue(key);
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.error('[CC] Failed to read cache:', error);
        return null;
      }
    }

    /**
     * 保存汇率数据到缓存
     * @param {string} baseCurrency - 基准货币代码
     * @param {Object} ratesData - 汇率数据对象
     */
    saveToCache(baseCurrency, ratesData) {
      try {
        const key = `cc_rates_${baseCurrency}`;
        const cacheExpiry = this.config.get('cacheExpiry') || 3600000;
        const cacheData = {
          ratesData,
          cachedAt: Date.now(),
          expiresAt: Date.now() + cacheExpiry
        };
        GM_setValue(key, JSON.stringify(cacheData));
        console.log(`[CC] Rates cached for ${baseCurrency}, expires in ${cacheExpiry / 1000}s`);
      } catch (error) {
        console.error('[CC] Failed to save cache:', error);
      }
    }

    /**
     * 检查缓存是否过期
     * @param {Object} cached - 缓存数据对象
     * @returns {boolean} 是否过期
     */
    isExpired(cached) {
      return Date.now() > cached.expiresAt;
    }

    /**
     * 构建自定义汇率数据
     * @param {string} baseCurrency - 基准货币
     * @returns {Object|null} 汇率数据对象或null
     */
    buildCustomRates(baseCurrency) {
      const customRates = this.config.get('customRates') || {};
      
      // 如果没有配置任何自定义汇率，返回null
      if (Object.keys(customRates).length === 0) {
        console.warn('[CC] 自定义汇率已启用，但未配置任何汇率数据');
        return null;
      }

      // 如果基准货币是USD，直接返回自定义汇率
      if (baseCurrency === 'USD') {
        return {
          base: 'USD',
          date: new Date().toISOString().split('T')[0],
          rates: { USD: 1, ...customRates }
        };
      }

      // 如果基准货币不是USD，需要换算
      if (!customRates[baseCurrency]) {
        console.warn(`[CC] 自定义汇率中未配置 ${baseCurrency} 的汇率`);
        return null;
      }

      const baseRate = customRates[baseCurrency];
      const convertedRates = {};
      
      // 换算所有汇率（以新基准货币为准）
      convertedRates[baseCurrency] = 1;
      convertedRates['USD'] = 1 / baseRate;
      
      for (const [currency, rate] of Object.entries(customRates)) {
        if (currency !== baseCurrency) {
          convertedRates[currency] = rate / baseRate;
        }
      }

      return {
        base: baseCurrency,
        date: new Date().toISOString().split('T')[0],
        rates: convertedRates
      };
    }
  }

  /* ==================== 加密货币汇率管理器 ==================== */
  
  /**
   * 加密货币汇率管理器类
   * 使用CoinGecko API获取加密货币价格（免费，无需API密钥）
   */
  class CryptoRateManager {
    constructor(configManager) {
      this.config = configManager;
      this.currentRates = null;
      this.updatePromise = null;
      
      // CoinGecko API配置
      this.api = {
        name: 'coingecko',
        url: 'https://api.coingecko.com/api/v3/simple/price',
        freeLimit: 50, // 50 requests/minute
        parseResponse: (data) => ({
          rates: data,
          timestamp: Date.now(),
          source: 'coingecko'
        })
      };
      
      // 加密货币ID映射（CoinGecko格式）
      this.cryptoIdMap = {
        'BTC': 'bitcoin', 'ETH': 'ethereum', 'USDT': 'tether', 'BNB': 'binancecoin', 'SOL': 'solana',
        'XRP': 'ripple', 'USDC': 'usd-coin', 'ADA': 'cardano', 'DOGE': 'dogecoin', 'TRX': 'tron',
        'DOT': 'polkadot', 'MATIC': 'matic-network', 'LTC': 'litecoin', 'SHIB': 'shiba-inu', 'DAI': 'dai',
        'AVAX': 'avalanche-2', 'UNI': 'uniswap', 'LINK': 'chainlink', 'ATOM': 'cosmos', 'XLM': 'stellar',
        'OKB': 'okb', 'BCH': 'bitcoin-cash', 'XMR': 'monero', 'ETC': 'ethereum-classic', 'FIL': 'filecoin',
        'APT': 'aptos', 'ARB': 'arbitrum', 'OP': 'optimism', 'NEAR': 'near', 'VET': 'vechain',
        'ALGO': 'algorand', 'GRT': 'the-graph', 'SAND': 'the-sandbox', 'MANA': 'decentraland', 'AXS': 'axie-infinity',
        'FTM': 'fantom', 'THETA': 'theta-token', 'XTZ': 'tezos', 'EOS': 'eos', 'EGLD': 'elrond-erd-2',
        'AAVE': 'aave', 'BSV': 'bitcoin-cash-sv', 'FLOW': 'flow', 'ICP': 'internet-computer', 'ZEC': 'zcash',
        'MKR': 'maker', 'SNX': 'havven', 'NEO': 'neo', 'KLAY': 'klay-token', 'CRV': 'curve-dao-token',
        'BUSD': 'binance-usd', 'TUSD': 'true-usd', 'USDP': 'paxos-standard', 'FRAX': 'frax',
        'CAKE': 'pancakeswap-token', 'SUSHI': 'sushi', 'COMP': 'compound-governance-token', 'YFI': 'yearn-finance',
        'STRK': 'starknet', 'IMX': 'immutable-x', 'LRC': 'loopring',
        'HBAR': 'hedera-hashgraph', 'QNT': 'quant-network', 'RUNE': 'thorchain', 'GALA': 'gala', 'CHZ': 'chiliz'
      };
    }

    /**
     * 获取加密货币价格（支持多种法币）
     * @param {Array<string>} cryptos - 加密货币代码列表 ['BTC', 'ETH']
     * @param {Array<string>} fiatCurrencies - 法币代码列表 ['USD', 'CNY']
     * @returns {Promise<Object>} 价格数据
     */
    async getRates(cryptos, fiatCurrencies) {
      if (!this.config.get('enableCrypto')) {
        return null;
      }

      try {
        // 检查缓存
        const cached = this.getFromCache();
        if (cached && !this.isExpired(cached)) {
          console.log('[CC] Using cached crypto rates');
          return cached;
        }

        // 避免并发请求
        if (this.updatePromise) {
          return await this.updatePromise;
        }

        this.updatePromise = this.fetchRates(cryptos, fiatCurrencies);
        const rates = await this.updatePromise;
        this.saveToCache(rates);
        this.currentRates = rates;
        this.updatePromise = null;
        return rates;

      } catch (error) {
        console.warn('[CC] Crypto API failed, trying cache:', error);
        const cached = this.getFromCache();
        if (cached) {
          console.log('[CC] Using expired crypto cache as fallback');
          return cached;
        }
        throw error;
      }
    }

    /**
     * 调用CoinGecko API获取价格
     * @param {Array<string>} cryptos - 加密货币代码列表
     * @param {Array<string>} fiatCurrencies - 法币代码列表
     * @returns {Promise<Object>} API响应数据
     */
    async fetchRates(cryptos, fiatCurrencies) {
      // 转换为CoinGecko ID
      const cryptoIds = cryptos
        .map(code => this.cryptoIdMap[code])
        .filter(id => id)
        .join(',');
      
      // 转换法币代码为小写
      const vsCurrencies = fiatCurrencies.map(c => c.toLowerCase()).join(',');
      
      const url = `${this.api.url}?ids=${cryptoIds}&vs_currencies=${vsCurrencies}`;
      
      console.log(`[CC] Fetching crypto rates: ${cryptos.join(', ')} → ${fiatCurrencies.join(', ')}`);

      try {
        const response = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 10000,
            onload: (resp) => {
              if (resp.status === 200) {
                try {
                  const data = JSON.parse(resp.responseText);
                  resolve(data);
                } catch (e) {
                  reject(new Error('Invalid JSON response'));
                }
              } else {
                reject(new Error(`HTTP ${resp.status}: ${resp.statusText}`));
              }
            },
            onerror: () => reject(new Error('Network error')),
            ontimeout: () => reject(new Error('Request timeout'))
          });
        });

        // 转换响应格式为易用的结构
        // CoinGecko返回: { "bitcoin": { "usd": 50000, "cny": 350000 } }
        // 转换为: { "BTC": { "USD": 50000, "CNY": 350000 } }
        const normalizedRates = {};
        for (const [code, coinId] of Object.entries(this.cryptoIdMap)) {
          if (response[coinId]) {
            normalizedRates[code] = {};
            for (const fiat of fiatCurrencies) {
              const price = response[coinId][fiat.toLowerCase()];
              if (price) {
                normalizedRates[code][fiat] = price;
              }
            }
          }
        }

        console.log(`[CC] ✅ Got crypto rates for ${Object.keys(normalizedRates).length} coins`);
        
        return {
          rates: normalizedRates,
          timestamp: Date.now(),
          source: 'coingecko'
        };

      } catch (error) {
        console.error('[CC] ❌ Crypto API error:', error);
        throw error;
      }
    }

    /**
     * 转换加密货币到法币
     * @param {string} crypto - 加密货币代码 (如 'BTC')
     * @param {number} amount - 数量
     * @param {string} targetCurrency - 目标法币 (如 'USD')
     * @returns {Promise<number|null>} 转换后的金额
     */
    async convert(crypto, amount, targetCurrency) {
      try {
        const rates = await this.getRates([crypto], [targetCurrency]);
        if (!rates || !rates.rates[crypto] || !rates.rates[crypto][targetCurrency]) {
          return null;
        }
        return amount * rates.rates[crypto][targetCurrency];
      } catch (error) {
        console.warn(`[CC] Failed to convert ${crypto} to ${targetCurrency}:`, error);
        return null;
      }
    }

    /**
     * 从缓存获取数据
     * @returns {Object|null} 缓存的汇率数据
     */
    getFromCache() {
      try {
        const cached = GM_getValue('cc_crypto_rates_cache', null);
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.error('[CC] Failed to get crypto cache:', error);
        return null;
      }
    }

    /**
     * 保存数据到缓存
     * @param {Object} data - 汇率数据
     */
    saveToCache(data) {
      try {
        GM_setValue('cc_crypto_rates_cache', JSON.stringify(data));
      } catch (error) {
        console.error('[CC] Failed to save crypto cache:', error);
      }
    }

    /**
     * 检查缓存是否过期
     * @param {Object} data - 缓存数据
     * @returns {boolean} 是否过期
     */
    isExpired(data) {
      if (!data || !data.timestamp) return true;
      const expiry = this.config.get('cryptoCacheExpiry') || 300000; // 5分钟
      return Date.now() - data.timestamp > expiry;
    }
  }

  /* ==================== 货币识别引擎 ==================== */
  
  /**
   * 货币检测器类
   * 负责扫描网页、识别价格和货币符号、标记元素
   */
  class CurrencyDetector {
    constructor(configManager) {
      this.config = configManager;
      this.detectedElements = new WeakMap(); // 缓存已识别元素
      this.currencyPatterns = this.buildPatterns();
    }

    /**
     * 构建货币识别正则表达式模式
     * @returns {Array} 正则模式数组
     */
    buildPatterns() {
      return [
        {
          // 标准货币符号（扩展支持）：$123.45, €1,234.56, £99.99, ¥1000, ₹500, ₩1000
          pattern: /([A-Z]{2,3})?\s*([$¥€£₹₩₱₦₪₴₽฿₡₵₸₺₼₾])\s*([0-9]{1,3}(?:[,\s][0-9]{3})*(?:\.[0-9]{1,2})?)/g,
          currencyGroup: 1,
          symbolGroup: 2,
          amountGroup: 3,
          prefixSymbol: true
        },
        {
          // 多字符货币符号：R$ 123.45, S$ 99.00, A$ 50.00, NZ$ 75, HK$ 100, NT$ 200
          pattern: /\b([A-Z]{1,2})\$\s*([0-9]{1,3}(?:[,\s][0-9]{3})*(?:\.[0-9]{1,2})?)/g,
          currencyGroup: 1,
          amountGroup: 2,
          withPrefix: true
        },
        {
          // 特殊多字符符号：Rp 1.000, Rs. 500
          pattern: /\b(Rp|Rs\.?)\s*([0-9]{1,3}(?:[,.\s][0-9]{3})*(?:[,.][0-9]{1,2})?)/g,
          currencyGroup: 1,
          amountGroup: 2,
          specialSymbol: true
        },
        {
          // ISO代码在前：USD 123.45, CNY 1234.56, EUR 99.99
          pattern: /\b([A-Z]{3})\s+([0-9]{1,3}(?:[,\s][0-9]{3})*(?:\.[0-9]{1,2})?)\b/g,
          currencyGroup: 1,
          amountGroup: 2
        },
        {
          // 数字在前：123.45 USD, 1234 CNY, 99.99 EUR
          pattern: /\b([0-9]{1,3}(?:[,\s][0-9]{3})*(?:\.[0-9]{1,2})?)\s+([A-Z]{3})\b/g,
          amountGroup: 1,
          currencyGroup: 2
        },
        {
          // 欧洲格式（小数点用逗号）：€1.234,56, £9.999,99
          pattern: /([€£₹])\s*([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{1,2})?)/g,
          currencyGroup: 1,
          amountGroup: 2,
          europeanFormat: true
        },
        {
          // 直播平台特殊格式（考虑更多变体）：US$ 4.99, CA$ 5.99
          pattern: /\b([A-Z]{2,3})\s*[$]\s*([0-9]{1,3}(?:[,\s][0-9]{3})*(?:\.[0-9]{1,2})?)/gi,
          currencyGroup: 1,
          amountGroup: 2,
          streamingFormat: true
        },
        {
          // 加密货币格式1：数字在前：0.5 BTC, 1.23456 ETH, 100 USDT
          pattern: /\b([0-9]+(?:\.[0-9]{1,8})?)\s+(BTC|ETH|USDT|BNB|SOL|XRP|USDC|ADA|DOGE|TRX|DOT|MATIC|LTC|SHIB|DAI|AVAX|UNI|LINK|ATOM|XLM|OKB|BCH|XMR|ETC|FIL|APT|ARB|OP|NEAR|VET|ALGO|GRT|SAND|MANA|AXS|FTM|THETA|XTZ|EOS|EGLD|AAVE|BSV|FLOW|ICP|ZEC|MKR|SNX|NEO|KLAY|CRV|BUSD|TUSD|USDP|FRAX|CAKE|SUSHI|COMP|YFI|STRK|IMX|LRC|HBAR|QNT|RUNE|GALA|CHZ)\b/gi,
          amountGroup: 1,
          currencyGroup: 2,
          isCrypto: true
        },
        {
          // 加密货币格式2：货币在前：BTC 0.5, ETH 1.23456
          pattern: /\b(BTC|ETH|USDT|BNB|SOL|XRP|USDC|ADA|DOGE|TRX|DOT|MATIC|LTC|SHIB|DAI|AVAX|UNI|LINK|ATOM|XLM|OKB|BCH|XMR|ETC|FIL|APT|ARB|OP|NEAR|VET|ALGO|GRT|SAND|MANA|AXS|FTM|THETA|XTZ|EOS|EGLD|AAVE|BSV|FLOW|ICP|ZEC|MKR|SNX|NEO|KLAY|CRV|BUSD|TUSD|USDP|FRAX|CAKE|SUSHI|COMP|YFI|STRK|IMX|LRC|HBAR|QNT|RUNE|GALA|CHZ)\s+([0-9]+(?:\.[0-9]{1,8})?)\b/gi,
          currencyGroup: 1,
          amountGroup: 2,
          isCrypto: true
        },
        {
          // 简单货币格式（宽松匹配）：$0.5, €1.99, ¥100 等（支持小数点开头或结尾）
          // 用于捕获分离式结构组合后的文本
          pattern: /([$¥€£₹₩₱₦₪₴₽฿₡₵₸₺₼₾])\s*([0-9]+(?:\.[0-9]+)?)/g,
          symbolGroup: 1,
          amountGroup: 2,
          simpleFormat: true
        },
        {
          // 带单位后缀的价格：$0.5/GB, €10/月, ¥99/年
          pattern: /([$¥€£₹₩₱₦₪₴₽฿₡₵₸₺₼₾])\s*([0-9]+(?:\.[0-9]+)?)\s*\/[a-zA-Z\u4e00-\u9fff]+/g,
          symbolGroup: 1,
          amountGroup: 2,
          hasUnitSuffix: true
        }
      ];
    }

    /**
     * 扫描整个页面
     */
    scanPage() {
      const startTime = performance.now();
      
      // 方法1: 扫描文本节点（原有方法）
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // 过滤script、style等标签
            const parent = node.parentElement;
            if (!parent || parent.matches('script, style, noscript, textarea, [contenteditable="true"]')) {
              return NodeFilter.FILTER_REJECT;
            }
            // 过滤已标记的元素
            if (parent.classList.contains('cc-price-detected') || parent.closest('.cc-tooltip')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      let count = 0;
      while (node = walker.nextNode()) {
        if (this.analyzeTextNode(node)) {
          count++;
        }
      }

      // 方法2: 扫描价格容器元素（处理分离的货币符号和数字）
      count += this.scanPriceContainers();

      const elapsed = performance.now() - startTime;
      console.log(`[CC] Page scan completed in ${elapsed.toFixed(2)}ms, found ${count} prices`);
    }

    /**
     * 扫描单个元素
     * @param {HTMLElement} element - 要扫描的元素
     */
    scanElement(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent || parent.matches('script, style, noscript, textarea')) {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.classList.contains('cc-price-detected') || parent.closest('.cc-tooltip')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        this.analyzeTextNode(node);
      }
    }

    /**
     * 分析文本节点
     * @param {Text} textNode - 文本节点
     * @returns {boolean} 是否找到价格
     */
    analyzeTextNode(textNode) {
      const text = textNode.textContent;
      if (!text || text.trim().length === 0) return false;

      let foundPrice = false;

      for (const patternDef of this.currencyPatterns) {
        const pattern = new RegExp(patternDef.pattern);
        let match;
        
        while ((match = pattern.exec(text)) !== null) {
          try {
            const priceData = this.extractPriceData(match, patternDef);
            if (this.validatePrice(priceData)) {
              this.markElement(textNode.parentElement, priceData);
              foundPrice = true;
              break; // 一个元素只标记一次
            }
          } catch (error) {
            // 单个识别失败不影响其他
            continue;
          }
        }
        
        if (foundPrice) break;
      }

      return foundPrice;
    }

    /**
     * 提取价格数据
     * @param {Array} match - 正则匹配结果
     * @param {Object} patternDef - 模式定义
     * @returns {Object} 价格数据对象
     */
    extractPriceData(match, patternDef) {
      let currency = match[patternDef.currencyGroup];
      const amountStr = match[patternDef.amountGroup];
      
      // 处理不同的货币符号格式
      if (patternDef.symbolGroup) {
        // 新格式：支持扩展货币符号
        const symbol = match[patternDef.symbolGroup];
        const prefix = match[patternDef.currencyGroup];
        if (prefix && prefix.length > 0) {
          // 带前缀：US$, HK$, CA$
          currency = prefix + symbol;
        } else {
          // 纯符号：$, €, £, ₹
          currency = symbol;
        }
      } else if (patternDef.withPrefix && currency) {
        // 多字符货币符号：R$, S$, A$
        currency = currency + '$';
      } else if (patternDef.specialSymbol) {
        // 特殊符号：Rp, Rs
        currency = currency;
      } else if (patternDef.streamingFormat) {
        // 直播平台格式：US$, CA$
        currency = currency + '$';
      } else if (patternDef.prefixSymbol) {
        // 旧格式：从匹配的文本中提取完整的货币符号
        const symbolMatch = match[0].match(/([A-Z]{2,3})?[$¥€£₹₩]/);
        if (symbolMatch) {
          currency = symbolMatch[0];
        }
      }
      
      return {
        originalText: match[0],
        currency: this.normalizeCurrency(currency || '$'),
        amount: this.parseAmount(amountStr, patternDef.europeanFormat),
        position: match.index,
        isCrypto: patternDef.isCrypto || false  // 标记是否为加密货币
      };
    }

    /**
     * 货币符号标准化
     * @param {string} currencyStr - 货币符号或代码
     * @returns {string} 标准化的货币代码
     */
    normalizeCurrency(currencyStr) {
      const symbolMap = {
        // 标准货币符号
        '$': 'USD',
        '¥': 'CNY',  // 默认CNY，也可能是JPY
        '€': 'EUR',
        '£': 'GBP',
        '₹': 'INR',
        '₩': 'KRW',
        '₽': 'RUB',
        '₱': 'PHP',
        '₦': 'NGN',
        '₪': 'ILS',
        '₴': 'UAH',
        '฿': 'THB',
        '₡': 'CRC',
        '₵': 'GHS',
        '₸': 'KZT',
        '₺': 'TRY',
        '₼': 'AZN',
        '₾': 'GEL',
        
        // 多字符货币符号（美元系）
        'A$': 'AUD', 'AU$': 'AUD',
        'C$': 'CAD', 'CA$': 'CAD',
        'HK$': 'HKD',
        'NT$': 'TWD',
        'S$': 'SGD', 'SG$': 'SGD',
        'US$': 'USD',
        'NZ$': 'NZD',
        'R$': 'BRL',
        
        // 特殊符号
        'Rp': 'IDR',
        'Rs': 'INR', 'Rs.': 'INR',
        
        // ISO代码前缀（处理歧义）
        'US': 'USD',
        'CA': 'CAD',
        'AU': 'AUD',
        'NZ': 'NZD',
        'HK': 'HKD',
        'SG': 'SGD',
        'NT': 'TWD',
        'BR': 'BRL',
        'MX': 'MXN',
        'AR': 'ARS',
        'CL': 'CLP',
        'CO': 'COP',
        'PE': 'PEN',
        'TH': 'THB',
        'MY': 'MYR',
        'ID': 'IDR',
        'PH': 'PHP',
        'VN': 'VND',
        'IN': 'INR',
        'TR': 'TRY',
        'IL': 'ILS',
        'ZA': 'ZAR',
        'NG': 'NGN'
      };
      
      return symbolMap[currencyStr] || currencyStr;
    }

    /**
     * 解析金额（处理千分位）
     * @param {string} amountStr - 金额字符串
     * @param {boolean} europeanFormat - 是否是欧洲格式
     * @returns {number} 解析后的金额
     */
    parseAmount(amountStr, europeanFormat = false) {
      if (europeanFormat) {
        // 欧洲格式：1.234,56 -> 1234.56
        return parseFloat(amountStr.replace(/\./g, '').replace(',', '.'));
      } else {
        // 标准格式：1,234.56 -> 1234.56
        return parseFloat(amountStr.replace(/[,\s]/g, ''));
      }
    }

    /**
     * 验证价格（排除误识别）
     * @param {Object} priceData - 价格数据对象
     * @returns {boolean} 是否是有效价格
     */
    validatePrice(priceData) {
      const minAmount = this.config.get('minAmount') || 0.01;
      const maxAmount = this.config.get('maxAmount') || 999999999;

      // 金额范围检查
      if (priceData.amount < minAmount || priceData.amount > maxAmount) {
        return false;
      }

      // 货币代码白名单验证
      if (!this.isValidCurrency(priceData.currency, priceData.isCrypto)) {
        console.log(`[CC] Invalid currency code: ${priceData.currency}`);
        return false;
      }

      // 排除版本号、编号等关键词
      const excludeKeywords = [
        'JDK', 'SDK', 'API', 'JRE', 'JVM', 'IDE', 'SQL', 'HTML', 'CSS', 'PHP', 'XML', 'JSON',
        'HTTP', 'HTTPS', 'FTP', 'SSH', 'SSL', 'TLS', 'DNS', 'TCP', 'UDP', 'SMTP', 'POP', 'IMAP',
        'PDF', 'DOC', 'PPT', 'XLS', 'ZIP', 'RAR', 'ISO', 'IMG', 'EXE', 'DLL', 'SYS',
        'CPU', 'GPU', 'RAM', 'SSD', 'HDD', 'USB', 'VGA', 'HDMI', 'WIFI', 'LTE',
        'IOS', 'MAC', 'WIN', 'APP', 'WEB', 'NET', 'ORG', 'COM', 'EDU', 'GOV',
        'VPN', 'CDN', 'CMS', 'CRM', 'ERP', 'SaaS', 'PaaS', 'IaaS',
        'RGB', 'CMYK', 'PNG', 'JPG', 'GIF', 'SVG', 'MP3', 'MP4', 'AVI', 'MKV',
        'GMT', 'UTC', 'PST', 'EST', 'CST', 'BST', 'JST', 'KST'
      ];
      
      const normalizedCurrency = this.normalizeCurrency(priceData.currency);
      if (excludeKeywords.includes(normalizedCurrency)) {
        console.log(`[CC] Excluded keyword: ${normalizedCurrency}`);
        return false;
      }

      // 检查上下文：排除包含版本、编号相关的词汇
      const context = priceData.originalText || '';
      const versionPatterns = [
        /\bv\d+(\.\d+)?/i,           // v1.0, V2.0
        /版本|version/i,              // 版本、version
        /\bspring\s+boot\b/i,        // Spring Boot
        /\bmaven\b/i,                // Maven
        /\bgradle\b/i,               // Gradle
        /\bnpm\b/i,                  // NPM
        /\bnode\b/i,                 // Node
        /\bpython\b/i,               // Python
        /\bjava\b/i,                 // Java
        /\bjavascript\b/i,           // JavaScript
        /\btypescript\b/i,           // TypeScript
        /分支|branch/i               // 分支、branch
      ];
      
      for (const pattern of versionPatterns) {
        if (pattern.test(context)) {
          console.log(`[CC] Excluded by context pattern: ${pattern}`);
          return false;
        }
      }

      // 排除明显的日期格式（如 2024.10.21）
      if (priceData.amount > 1000 && priceData.amount < 9999) {
        const str = priceData.originalText;
        if (/\d{4}[.\/]\d{1,2}[.\/]\d{1,2}/.test(str)) {
          return false;
        }
      }

      // 排除电话号码格式
      if (priceData.originalText.replace(/\D/g, '').length > 10) {
        return false;
      }

      return true;
    }

    /**
     * 验证货币代码是否有效
     * @param {string} currency - 货币代码
     * @param {boolean} isCrypto - 是否为加密货币
     * @returns {boolean} 是否有效
     */
    isValidCurrency(currency, isCrypto = false) {
      const normalizedCurrency = this.normalizeCurrency(currency);
      
      // 加密货币白名单
      if (isCrypto) {
        const cryptoList = [
          'BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'USDC', 'ADA', 'DOGE', 'TRX',
          'DOT', 'MATIC', 'LTC', 'SHIB', 'DAI', 'AVAX', 'UNI', 'LINK', 'ATOM', 'XLM',
          'OKB', 'BCH', 'XMR', 'ETC', 'FIL', 'APT', 'ARB', 'OP', 'NEAR', 'VET',
          'ALGO', 'GRT', 'SAND', 'MANA', 'AXS', 'FTM', 'THETA', 'XTZ', 'EOS', 'EGLD',
          'AAVE', 'BSV', 'FLOW', 'ICP', 'ZEC', 'MKR', 'SNX', 'NEO', 'KLAY', 'CRV',
          'BUSD', 'TUSD', 'USDP', 'FRAX', 'CAKE', 'SUSHI', 'COMP', 'YFI', 'STRK', 'IMX',
          'LRC', 'HBAR', 'QNT', 'RUNE', 'GALA', 'CHZ'
        ];
        return cryptoList.includes(normalizedCurrency);
      }
      
      // 法币白名单（ISO 4217 + 常见符号）
      const fiatList = [
        'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CHF', 'CAD', 'AUD', 'NZD', 'HKD',
        'SGD', 'SEK', 'NOK', 'DKK', 'KRW', 'INR', 'RUB', 'BRL', 'ZAR', 'MXN',
        'TRY', 'TWD', 'THB', 'IDR', 'MYR', 'PHP', 'PLN', 'CZK', 'HUF', 'ILS',
        'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'EGP', 'MAD', 'DZD',
        'TND', 'NGN', 'GHS', 'KES', 'TZS', 'UGX', 'ZMW', 'BWP', 'MUR', 'SCR',
        'VND', 'MMK', 'KHR', 'LAK', 'BDT', 'PKR', 'LKR', 'NPR', 'AFN', 'IRR',
        'IQD', 'SYP', 'LBP', 'JMD', 'TTD', 'BSD', 'BBD', 'XCD', 'AWG', 'ANG',
        // 货币符号
        '$', '¥', '€', '£', '₹', '₩', '₱', '₦', '₪', '₴', '₽', '฿', '₡', '₵', '₸', '₺', '₼', '₾',
        // 多字符符号
        'US$', 'HK$', 'NT$', 'NZ$', 'CA$', 'AU$', 'S$', 'R$', 'A$', 'Rp', 'Rs', 'Rs.'
      ];
      
      return fiatList.includes(normalizedCurrency);
    }

    /**
     * 扫描价格容器元素（处理分离的货币符号和数字）
     * @returns {number} 找到的价格数量
     */
    scanPriceContainers() {
      // 查找可能包含价格的容器
      const priceSelectors = [
        '[class*="price"]',
        '[class*="pricing"]',
        '[class*="cost"]',
        '[class*="amount"]',
        '[class*="fee"]',
        '[class*="total"]',
        '[class*="money"]',
        '[class*="rate"]',
        '[data-price]',
        '[itemprop="price"]',
        // 分离式价格结构的容器
        ':has(> [class*="currency"]):has(> b)',
        ':has(> [class*="currency"]):has(> span)',
        ':has(> .currency):has(> .value)',
        ':has(> .symbol):has(> .number)'
      ];

      let count = 0;
      const containers = document.querySelectorAll(priceSelectors.join(','));

      for (const container of containers) {
        // 跳过已标记或不可见的元素
        if (container.classList.contains('cc-price-detected') || 
            container.closest('.cc-tooltip') ||
            container.offsetParent === null) {
          continue;
        }

        // 获取容器的纯文本内容
        const text = container.textContent.trim();
        if (!text || text.length > 100) continue; // 跳过过长的文本

        // 尝试识别价格
        if (this.analyzePriceContainer(container, text)) {
          count++;
        }
      }

      // 方法2: 扫描分离式价格结构（货币符号和数字在不同元素中）
      count += this.scanSplitCurrencyElements();

      return count;
    }

    /**
     * 扫描分离式货币元素（货币符号和数字在不同元素中）
     * 处理如: <span class="currency">$</span><b>0.5</b> 这种结构
     * @returns {number} 找到的价格数量
     */
    scanSplitCurrencyElements() {
      let count = 0;
      const currencySymbols = '$¥€£₹₩₱₦₪₴₽฿₡₵₸₺₼₾';
      
      // 查找可能包含货币符号的元素
      const symbolSelectors = [
        '[class*="currency"]',
        '[class*="symbol"]',
        '[class*="sign"]',
        '[class*="unit"]'
      ];
      
      try {
        const symbolElements = document.querySelectorAll(symbolSelectors.join(','));
        
        for (const symbolEl of symbolElements) {
          // 跳过已处理的元素
          if (symbolEl.closest('.cc-price-detected') || symbolEl.closest('.cc-tooltip')) {
            continue;
          }
          
          const symbolText = symbolEl.textContent.trim();
          // 检查是否只包含货币符号
          if (symbolText.length > 3 || !this.containsCurrencySymbol(symbolText, currencySymbols)) {
            continue;
          }
          
          // 查找相邻的数字元素
          const parent = symbolEl.parentElement;
          if (!parent || parent.classList.contains('cc-price-detected')) continue;
          
          // 获取父容器的完整文本
          const fullText = parent.textContent.trim();
          if (!fullText || fullText.length > 100) continue;
          
          // 尝试匹配价格
          if (this.analyzePriceContainer(parent, fullText)) {
            count++;
          }
        }
      } catch (error) {
        // 选择器可能在某些环境下失败，静默处理
      }
      
      return count;
    }

    /**
     * 检查文本是否包含货币符号
     * @param {string} text - 要检查的文本
     * @param {string} symbols - 货币符号字符串
     * @returns {boolean} 是否包含货币符号
     */
    containsCurrencySymbol(text, symbols) {
      for (const char of text) {
        if (symbols.includes(char)) return true;
      }
      // 也检查多字符符号
      return /^[A-Z]{1,2}\$$/.test(text) || /^(Rp|Rs\.?)$/.test(text);
    }

    /**
     * 分析价格容器
     * @param {HTMLElement} container - 容器元素
     * @param {string} text - 容器的文本内容
     * @returns {boolean} 是否找到价格
     */
    analyzePriceContainer(container, text) {
      for (const patternDef of this.currencyPatterns) {
        const pattern = new RegExp(patternDef.pattern);
        const match = pattern.exec(text);
        
        if (match) {
          try {
            const priceData = this.extractPriceData(match, patternDef);
            if (this.validatePrice(priceData)) {
              // 直接标记容器元素，markElement 会自动处理精确定位
              this.markElement(container, priceData);
              return true;
            }
          } catch (error) {
            continue;
          }
        }
      }
      
      return false;
    }
    
    /**
     * 根据文本内容查找最小的包含元素
     * @param {HTMLElement} container - 容器元素
     * @param {string} searchText - 要查找的文本
     * @returns {HTMLElement|null} 找到的元素或null
     */
    findElementByText(container, searchText) {
      if (!container || !searchText) return null;
      
      try {
        const searchLength = searchText.length;
        let bestMatch = null;
        let minSize = Infinity;
        
        // 递归查找包含文本的最小元素
        const findRecursive = (element) => {
          if (!element || !element.children) return;
          
          const children = Array.from(element.children);
          
          for (const child of children) {
            if (!child.textContent.includes(searchText)) continue;
            
            const textLength = child.textContent.trim().length;
            
            // 优先选择文本长度接近价格的元素（2.5倍容差）
            if (textLength <= searchLength * 2.5 && textLength < minSize) {
              minSize = textLength;
              bestMatch = child;
            }
            // 如果没找到很小的元素，选择相对小的（不超过容器的50%）
            else if (!bestMatch && textLength < container.textContent.length * 0.5) {
              if (textLength < minSize) {
                minSize = textLength;
                bestMatch = child;
              }
            }
            
            // 继续向下查找
            findRecursive(child);
          }
        };
        
        findRecursive(container);
        
        // 如果找到的元素仍然太大（超过价格的5倍），尝试包装价格
        if (bestMatch && bestMatch.textContent.length > searchLength * 5) {
          const wrapped = this.wrapPriceInElement(bestMatch, searchText);
          if (wrapped) return wrapped;
        }
        
        // 如果没有找到合适的子元素，检查容器本身
        if (!bestMatch) {
          const containerText = container.textContent.trim();
          if (containerText.length <= searchLength * 2.5) {
            return container;
          }
          // 容器太大，尝试包装
          const wrapped = this.wrapPriceInElement(container, searchText);
          if (wrapped) return wrapped;
        }
        
        return bestMatch;
      } catch (error) {
        return null;
      }
    }

    /**
     * 标记元素（智能定位到精确价格位置）
     * @param {HTMLElement} element - 要标记的元素
     * @param {Object} priceData - 价格数据对象
     */
    markElement(element, priceData) {
      if (!element || this.detectedElements.has(element)) return;

      try {
        // 尝试找到更精确的价格元素（避免标记过大的容器）
        let preciseElement = this.findPrecisePriceElement(element, priceData.originalText);
        
        // 如果没有找到精确元素，检查原始元素是否太大
        if (!preciseElement) {
          const elementText = element.textContent.trim();
          const priceText = priceData.originalText;
          
          // 如果元素文本远大于价格文本（超过2.5倍），强制包装
          if (elementText.length > priceText.length * 2.5) {
            preciseElement = this.wrapPriceInElement(element, priceText);
            if (preciseElement) {
              console.log('[CC] ✓ 已包装价格到精确元素');
            }
          }
        }
        
        const targetElement = preciseElement || element;
        
        // 避免重复标记
        if (this.detectedElements.has(targetElement)) return;
        
        targetElement.dataset.ccOriginalPrice = priceData.amount;
        targetElement.dataset.ccCurrency = priceData.currency;
        targetElement.dataset.ccIsCrypto = priceData.isCrypto ? 'true' : 'false';
        
        // 标记是否为精确定位（用于鼠标悬停判断）
        // 所有情况都标记为精确定位，因为现在都会尝试包装
        targetElement.dataset.ccPriceOnly = 'true';
        
        targetElement.classList.add('cc-price-detected');
        this.detectedElements.set(targetElement, priceData);
        
        // 内联显示模式
        if (this.config.get('inlineMode')) {
          this.addInlineConversion(targetElement, priceData);
        }
      } catch (error) {
        console.warn('[CC] Failed to mark element:', error);
      }
    }
    
    /**
     * 查找包含价格的最精确元素
     * @param {HTMLElement} element - 起始元素
     * @param {string} priceText - 价格文本
     * @returns {HTMLElement|null} 精确元素或null
     */
    findPrecisePriceElement(element, priceText) {
      if (!element || !priceText) return null;
      
      try {
        // 查找所有包含价格文本的子元素
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let node;
        let matchedParent = null;
        let minSize = Infinity;
        const priceLength = priceText.length;
        
        while (node = walker.nextNode()) {
          if (node.textContent.includes(priceText)) {
            const parent = node.parentElement;
            if (!parent || parent === element) continue;
            
            // 跳过已标记的元素
            if (parent.classList.contains('cc-price-detected')) continue;
            
            const parentText = parent.textContent.trim();
            const textLength = parentText.length;
            
            // 优先选择文本长度接近价格的元素（容差倍数：2.5倍）
            // 例如：价格 "$2,290" (6字符)，元素文本不超过 15 字符
            if (textLength <= priceLength * 2.5 && textLength < minSize) {
              minSize = textLength;
              matchedParent = parent;
            } 
            // 如果没有找到很小的元素，选择相对小的（不超过原始元素的50%）
            else if (!matchedParent && textLength < element.textContent.length * 0.5) {
              if (textLength < minSize) {
                minSize = textLength;
                matchedParent = parent;
              }
            }
          }
        }
        
        // 如果找到的元素仍然太大（超过价格的5倍），尝试包装价格
        if (matchedParent && matchedParent.textContent.length > priceLength * 5) {
          const wrapped = this.wrapPriceInElement(matchedParent, priceText);
          if (wrapped) return wrapped;
        }
        
        return matchedParent;
      } catch (error) {
        return null;
      }
    }
    
    /**
     * 在元素中包装价格文本
     * @param {HTMLElement} element - 父元素
     * @param {string} priceText - 价格文本
     * @returns {HTMLElement|null} 包装后的元素
     */
    wrapPriceInElement(element, priceText) {
      try {
        // 查找包含价格的文本节点
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent;
          const index = text.indexOf(priceText);
          
          if (index !== -1) {
            // 找到价格文本，用 span 包装它
            const range = document.createRange();
            range.setStart(node, index);
            range.setEnd(node, index + priceText.length);
            
            const wrapper = document.createElement('span');
            wrapper.className = 'cc-price-wrapper';
            
            try {
              range.surroundContents(wrapper);
              return wrapper;
            } catch (e) {
              // 如果包装失败（例如跨越多个节点），使用替代方案
              console.warn('[CC] Failed to wrap price:', e);
              return null;
            }
          }
        }
        
        return null;
      } catch (error) {
        console.warn('[CC] Failed to wrap price element:', error);
        return null;
      }
    }

    /**
     * 添加内联转换显示
     * @param {HTMLElement} element - 价格元素
     * @param {Object} priceData - 价格数据
     */
    async addInlineConversion(element, priceData) {
      // 检查是否已添加
      if (element.querySelector('.cc-inline-conversion')) return;
      
      try {
        // 获取要显示的目标货币
        const inlineCurrency = this.config.get('inlineShowCurrency') || 'CNY';
        
        // 如果目标货币与原货币相同，不显示
        if (inlineCurrency === priceData.currency) return;
        
        // 创建内联元素
        const inlineElement = document.createElement('span');
        inlineElement.className = 'cc-inline-conversion';
        inlineElement.dataset.loading = 'true';
        inlineElement.textContent = '...';
        
        // 插入到价格元素后面
        if (element.nextSibling) {
          element.parentNode.insertBefore(inlineElement, element.nextSibling);
        } else {
          element.parentNode.appendChild(inlineElement);
        }
        
        // 异步获取汇率并更新
        this.updateInlineConversion(inlineElement, priceData, inlineCurrency);
      } catch (error) {
        console.warn('[CC] Failed to add inline conversion:', error);
      }
    }

    /**
     * 更新内联转换显示
     * @param {HTMLElement} inlineElement - 内联元素
     * @param {Object} priceData - 价格数据
     * @param {string} toCurrency - 目标货币
     */
    async updateInlineConversion(inlineElement, priceData, toCurrency) {
      try {
        // 这个方法会在TooltipManager初始化时被替换
        // 因为需要访问rateManager
        inlineElement.textContent = '...';
      } catch (error) {
        inlineElement.textContent = '';
        inlineElement.style.display = 'none';
      }
    }

    /**
     * 移除所有内联转换显示
     */
    removeAllInlineConversions() {
      document.querySelectorAll('.cc-inline-conversion').forEach(el => el.remove());
    }

    /**
     * 刷新所有内联转换显示
     */
    async refreshAllInlineConversions() {
      const inlineElements = document.querySelectorAll('.cc-inline-conversion');
      for (const element of inlineElements) {
        const priceElement = element.previousSibling;
        if (priceElement && priceElement.dataset.ccOriginalPrice) {
          const priceData = {
            amount: parseFloat(priceElement.dataset.ccOriginalPrice),
            currency: priceElement.dataset.ccCurrency
          };
          const toCurrency = this.config.get('inlineShowCurrency') || 'CNY';
          await this.updateInlineConversion(element, priceData, toCurrency);
        }
      }
    }
  }

  /* ==================== UI工具提示管理器 ==================== */
  
  /**
   * 工具提示管理器类
   * 负责监听鼠标事件、渲染工具提示、显示转换结果
   */
  class TooltipManager {
    constructor(rateManager, configManager, i18n, cryptoRateManager) {
      this.rateManager = rateManager;
      this.cryptoRateManager = cryptoRateManager;
      this.config = configManager;
      this.i18n = i18n;
      this.currentTooltip = null;
      this.hoverTimer = null;
      this.hideTimer = null;
      this.init();
    }

    /**
     * 初始化
     */
    init() {
      this.injectStyles();
      this.attachEvents();
    }

    /**
     * 绑定事件
     */
    attachEvents() {
      // 使用事件委托监听鼠标事件
      const debouncedMouseOver = Utils.debounce(this.handleMouseOver.bind(this), this.config.get('tooltipDelay'));
      
      document.body.addEventListener('mouseover', (e) => {
        const target = e.target.closest('.cc-price-detected');
        if (target) {
          debouncedMouseOver(e);
        }
      });

      document.body.addEventListener('mouseout', this.handleMouseOut.bind(this));
    }

    /**
     * 处理鼠标悬停
     * @param {MouseEvent} event - 鼠标事件
     */
    handleMouseOver(event) {
      const target = event.target.closest('.cc-price-detected');
      if (!target) return;

      // 检查鼠标是否在UI元素内（设置面板、计算器、tooltip本身）
      const uiElements = [
        '.cc-settings-panel',
        '.cc-calculator-panel',
        '.cc-tooltip'
      ];
      
      for (const selector of uiElements) {
        if (event.target.closest(selector)) {
          return; // 鼠标在UI元素上，不显示tooltip
        }
      }

      // 精确检测：只在鼠标真正碰到文字时显示
      if (!this.isMouseOverTextPrecise(event, target)) {
        return; // 鼠标不在文字上，不显示tooltip
      }

      clearTimeout(this.hideTimer);
      this.showTooltip(target, event);
    }

    /**
     * 精确检测鼠标是否在文本上（使用 caretRangeFromPoint）
     * @param {MouseEvent} event - 鼠标事件
     * @param {HTMLElement} element - 目标元素
     * @returns {boolean} 是否在文本上
     */
    isMouseOverTextPrecise(event, element) {
      try {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        // 先检查是否在元素边界内
        const rect = element.getBoundingClientRect();
        if (mouseX < rect.left || mouseX > rect.right || 
            mouseY < rect.top || mouseY > rect.bottom) {
          return false;
        }
        
        // 使用 caretRangeFromPoint 精确检测鼠标位置的元素
        let range;
        if (document.caretRangeFromPoint) {
          range = document.caretRangeFromPoint(mouseX, mouseY);
        } else if (document.caretPositionFromPoint) {
          const position = document.caretPositionFromPoint(mouseX, mouseY);
          if (position) {
            range = document.createRange();
            range.setStart(position.offsetNode, position.offset);
          }
        }
        
        if (range) {
          // 检查范围是否在目标元素内
          const container = range.startContainer;
          
          // 必须是文本节点，不能是元素节点
          if (container.nodeType !== Node.TEXT_NODE) {
            return this.isMouseOverTextFallback(event, element);
          }
          
          const rangeElement = container.parentElement;
          
          // 检查是否是目标元素或其子元素
          if (rangeElement === element || element.contains(rangeElement)) {
            // 额外检查：确保文本节点有内容且不是纯空白
            const textContent = container.textContent.trim();
            if (textContent.length > 0) {
              return true;
            }
          }
        }
        
        // 降级方案：使用文本边界检测（负容差）
        return this.isMouseOverTextFallback(event, element);
      } catch (error) {
        // 如果精确检测失败，使用降级方案
        return this.isMouseOverTextFallback(event, element);
      }
    }
    
    /**
     * 降级方案：检查鼠标是否在文本边界内（负容差，范围更小）
     * @param {MouseEvent} event - 鼠标事件
     * @param {HTMLElement} element - 目标元素
     * @returns {boolean} 是否在文本上
     */
    isMouseOverTextFallback(event, element) {
      try {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        // 获取所有文本节点的边界
        const textNodes = this.getTextNodes(element);
        if (textNodes.length === 0) {
          // 没有文本节点，检查元素本身（使用负容差）
          const rect = element.getBoundingClientRect();
          const inset = 5; // 5px 负容差，范围更小
          return mouseX >= rect.left + inset && mouseX <= rect.right - inset &&
                 mouseY >= rect.top + inset && mouseY <= rect.bottom - inset;
        }
        
        // 检查鼠标是否在任何文本节点的边界内
        for (const textNode of textNodes) {
          const range = document.createRange();
          range.selectNodeContents(textNode);
          const rects = range.getClientRects();
          
          for (const rect of rects) {
            // 使用负容差（inset），让检测范围比实际文字小一点
            // 这样可以避免在文字边缘的空白处触发
            const inset = 4; // 4px 负容差，必须更接近文字中心
            
            if (mouseX >= rect.left + inset && mouseX <= rect.right - inset &&
                mouseY >= rect.top + inset && mouseY <= rect.bottom - inset) {
              return true;
            }
          }
        }
        
        return false;
      } catch (error) {
        // 最终降级：检测失败时不显示（更严格）
        console.warn('[CC] Text detection failed:', error);
        return false;
      }
    }

    /**
     * 获取元素内的所有文本节点
     * @param {HTMLElement} element - 目标元素
     * @returns {Array<Text>} 文本节点数组
     */
    getTextNodes(element) {
      const textNodes = [];
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // 只接受非空文本节点
            if (node.textContent.trim().length > 0) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }

      return textNodes;
    }

    /**
     * 处理鼠标移出
     * @param {MouseEvent} event - 鼠标事件
     */
    handleMouseOut(event) {
      const target = event.target.closest('.cc-price-detected');
      if (!target) return;

      clearTimeout(this.hoverTimer);
      
      // 延迟隐藏，给用户时间移动到tooltip
      this.hideTimer = setTimeout(() => {
        if (this.currentTooltip && !this.currentTooltip.matches(':hover')) {
          this.hideTooltip();
        }
      }, 200);
    }

    /**
     * 显示工具提示
     * @param {HTMLElement} element - 价格元素
     * @param {MouseEvent} event - 鼠标事件
     */
    async showTooltip(element, event) {
      const amount = parseFloat(element.dataset.ccOriginalPrice);
      const fromCurrency = element.dataset.ccCurrency;
      
      if (!amount || !fromCurrency) {
        return;
      }

      // 获取汇率
      let rates;
      try {
        rates = await this.rateManager.getRates('USD');
      } catch (error) {
        console.error('[CC] Failed to get rates:', error);
        this.showErrorTooltip(element, '汇率数据暂时不可用');
        return;
      }

      // 获取智能排序的目标货币列表
      const targetCurrencies = this.getSmartTargetCurrencies(fromCurrency);
      
      // 计算转换结果
      const conversions = targetCurrencies.map(toCurrency => {
        try {
          const converted = this.rateManager.convert(amount, fromCurrency, toCurrency);
          return {
            currency: toCurrency,
            amount: converted,
            formatted: this.formatCurrency(converted, toCurrency)
          };
        } catch (error) {
          return null;
        }
      }).filter(c => c !== null);

      if (conversions.length === 0) {
        this.showErrorTooltip(element, '无法转换货币');
        return;
      }

      // 渲染tooltip
      this.renderTooltip(element, {
        original: { amount, currency: fromCurrency },
        conversions,
        rates,
        timestamp: rates.timestamp
      });
    }

    /**
     * 渲染工具提示
     * @param {HTMLElement} anchor - 锚点元素
     * @param {Object} data - 数据对象
     */
    renderTooltip(anchor, data) {
      // 移除旧tooltip
      this.hideTooltip();

      // 创建tooltip元素
      const tooltip = document.createElement('div');
      tooltip.className = 'cc-tooltip';
      tooltip.innerHTML = this.buildTooltipHTML(data);

      document.body.appendChild(tooltip);
      this.currentTooltip = tooltip;

      // 绑定关闭按钮事件
      const closeBtn = tooltip.querySelector('.cc-tooltip-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.hideTooltip();
        });
      }

      // 定位
      this.positionTooltip(tooltip, anchor);

      // 添加动画
      requestAnimationFrame(() => {
        tooltip.classList.add('cc-tooltip-visible');
      });
    }

    /**
     * 构建工具提示HTML
     * @param {Object} data - 数据对象
     * @returns {string} HTML字符串
     */
    buildTooltipHTML(data) {
      const { original, conversions, rates, timestamp } = data;
      
      const updateTime = new Date(timestamp).toLocaleTimeString();
      
      return `
        <button class="cc-tooltip-close" title="${this.i18n.t('tooltip.close')}">&times;</button>
        <div class="cc-tooltip-header">
          <span class="cc-original">
            ${this.formatCurrency(original.amount, original.currency)}
          </span>
        </div>
        <div class="cc-tooltip-body">
          ${conversions.map(conv => `
            <div class="cc-conversion-row">
              <span class="cc-currency-code">${conv.currency}</span>
              <span class="cc-converted-amount">${conv.formatted}</span>
            </div>
          `).join('')}
        </div>
        <div class="cc-tooltip-footer">
          <span class="cc-update-time">${this.i18n.t('tooltip.update')}: ${updateTime}</span>
          <span class="cc-source">${rates.source}</span>
          <a href="https://www.xe.com/currencyconverter/convert/?Amount=1&From=${original.currency}&To=USD" 
             target="_blank" 
             class="cc-history-link" 
             title="${this.i18n.t('tooltip.history')}"
             onclick="event.stopPropagation()">
            📊 ${this.i18n.t('tooltip.history')}
          </a>
        </div>
      `;
    }

    /**
     * 显示错误提示
     * @param {HTMLElement} anchor - 锚点元素
     * @param {string} message - 错误信息
     */
    showErrorTooltip(anchor, message) {
      this.hideTooltip();

      const tooltip = document.createElement('div');
      tooltip.className = 'cc-tooltip cc-tooltip-error';
      
      // 判断是否是API配额问题
      const isApiQuotaError = message.includes('不可用') || message.includes('failed');
      
      tooltip.innerHTML = `
        <button class="cc-tooltip-close" title="${this.i18n.t('tooltip.close')}">&times;</button>
        <div class="cc-tooltip-body">
          <div class="cc-error-message">⚠️ ${Utils.escapeHTML(message)}</div>
          ${isApiQuotaError ? `
            <div class="cc-error-hint">
              💡 ${this.i18n.t('tooltip.errorQuota')}<br>
              <small>${this.i18n.t('tooltip.errorHint')}</small>
            </div>
          ` : ''}
        </div>
      `;

      document.body.appendChild(tooltip);
      this.currentTooltip = tooltip;

      // 绑定关闭按钮事件
      const closeBtn = tooltip.querySelector('.cc-tooltip-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.hideTooltip();
        });
      }

      this.positionTooltip(tooltip, anchor);

      requestAnimationFrame(() => {
        tooltip.classList.add('cc-tooltip-visible');
      });

      // 自动隐藏错误提示
      setTimeout(() => this.hideTooltip(), isApiQuotaError ? 5000 : 3000);
    }

    /**
     * 定位工具提示
     * @param {HTMLElement} tooltip - 工具提示元素
     * @param {HTMLElement} anchor - 锚点元素
     */
    positionTooltip(tooltip, anchor) {
      const anchorRect = anchor.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // 默认显示在元素下方
      let top = anchorRect.bottom + window.scrollY + 8;
      let left = anchorRect.left + window.scrollX;

      // 防止超出右侧视口
      if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
      }

      // 防止超出左侧视口
      if (left < 10) {
        left = 10;
      }

      // 防止超出底部视口，显示在上方
      if (top + tooltipRect.height > window.innerHeight + window.scrollY) {
        top = anchorRect.top + window.scrollY - tooltipRect.height - 8;
      }

      // 防止超出顶部视口
      if (top < window.scrollY + 10) {
        top = window.scrollY + 10;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }

    /**
     * 隐藏工具提示
     */
    hideTooltip() {
      if (this.currentTooltip) {
        this.currentTooltip.remove();
        this.currentTooltip = null;
      }
    }

    /**
     * 获取智能排序的目标货币列表
     * @param {string} sourceCurrency - 原货币代码
     * @returns {Array<string>} 目标货币列表
     */
    getSmartTargetCurrencies(sourceCurrency) {
      // 获取所有配置的目标货币
      let targetCurrencies = this.config.get('targetCurrencies') || ['CNY', 'USD', 'EUR', 'GBP', 'JPY'];
      
      // 是否排除原货币
      if (this.config.get('excludeSourceCurrency')) {
        targetCurrencies = targetCurrencies.filter(c => c !== sourceCurrency);
      }
      
      // 获取用户国家货币（优先显示）
      const userCountryCurrency = this.config.get('userCountryCurrency');
      
      // 智能排序：用户国家货币 > 其他配置货币
      if (userCountryCurrency && userCountryCurrency !== sourceCurrency) {
        // 移除用户国家货币（如果在列表中）
        targetCurrencies = targetCurrencies.filter(c => c !== userCountryCurrency);
        // 添加到第一位
        targetCurrencies.unshift(userCountryCurrency);
      }
      
      // 限制显示数量
      const maxDisplay = this.config.get('maxDisplayCurrencies') || 3;
      targetCurrencies = targetCurrencies.slice(0, maxDisplay);
      
      console.log(`[CC] 目标货币: ${targetCurrencies.join(', ')} (原货币: ${sourceCurrency})`);
      
      return targetCurrencies;
    }

    /**
     * 格式化货币显示
     * @param {number} amount - 金额
     * @param {string} currency - 货币代码
     * @returns {string} 格式化后的货币字符串
     */
    formatCurrency(amount, currency) {
      try {
        return new Intl.NumberFormat('zh-CN', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      } catch (error) {
        // 如果货币代码不支持，使用简单格式
        return `${currency} ${Utils.formatNumber(amount)}`;
      }
    }

    /**
     * 注入CSS样式
     */
    injectStyles() {
      GM_addStyle(`
        /* 价格元素样式 */
        .cc-price-detected {
          cursor: help;
          position: relative;
          text-decoration: underline;
          text-decoration-style: dotted;
          text-decoration-color: #667eea;
          text-underline-offset: 2px;
        }
        
        /* 价格包装器样式 */
        .cc-price-wrapper {
          display: inline;
        }

        /* 内联转换显示样式 */
        .cc-inline-conversion {
          display: inline;
          margin-left: 4px;
          font-size: 0.9em;
          color: #10b981;
          font-weight: 500;
          opacity: 0;
          animation: cc-fade-in 0.3s ease forwards;
        }

        .cc-inline-conversion[data-loading="true"] {
          color: #9ca3af;
          opacity: 0.6;
        }

        @keyframes cc-fade-in {
          from {
            opacity: 0;
            transform: translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* 暗色模式下的内联转换 */
        @media (prefers-color-scheme: dark) {
          .cc-inline-conversion {
            color: #34d399;
          }
          
          .cc-inline-conversion[data-loading="true"] {
            color: #6b7280;
          }
        }

        /* 工具提示基础样式 */
        .cc-tooltip {
          position: absolute;
          background: white;
          color: #1f2937;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 999999;
          min-width: 220px;
          max-width: 320px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 14px;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: auto;
        }

        /* 关闭按钮样式 */
        .cc-tooltip-close {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background: #f3f4f6;
          border: none;
          border-radius: 50%;
          color: #6b7280;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          padding: 0;
          z-index: 1;
        }

        .cc-tooltip-close:hover {
          background: #e5e7eb;
          color: #1f2937;
          transform: scale(1.1);
        }

        .cc-tooltip-close:active {
          transform: scale(0.95);
          background: #d1d5db;
        }

        .cc-tooltip-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* 错误提示样式 */
        .cc-tooltip-error {
          background: #fef2f2;
          border-color: #fecaca;
          color: #991b1b;
        }

        .cc-tooltip-error .cc-tooltip-header,
        .cc-tooltip-error .cc-converted-amount {
          color: #991b1b;
        }

        .cc-tooltip-error .cc-tooltip-header {
          border-bottom-color: #fecaca;
        }

        .cc-tooltip-error .cc-tooltip-close {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .cc-tooltip-error .cc-tooltip-close:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #991b1b;
        }

        /* 头部样式 */
        .cc-tooltip-header {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
          padding-bottom: 8px;
          padding-right: 20px;
          border-bottom: 1px solid #e5e7eb;
          color: #1f2937;
        }

        .cc-original {
          display: block;
          text-align: center;
        }

        /* 主体样式 */
        .cc-tooltip-body {
          margin: 0;
        }

        .cc-conversion-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 6px 0;
          padding: 4px 0;
        }

        .cc-currency-code {
          font-weight: 600;
          color: #6b7280;
          font-size: 13px;
        }

        .cc-converted-amount {
          font-weight: bold;
          font-size: 15px;
          color: #1f2937;
        }

        /* 底部样式 */
        .cc-tooltip-footer {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #e5e7eb;
          font-size: 11px;
          color: #9ca3af;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cc-update-time {
          font-size: 10px;
        }

        .cc-source {
          font-size: 10px;
          text-transform: uppercase;
        }

        .cc-history-link {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 2px 6px;
          font-size: 11px;
          color: #3b82f6;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .cc-history-link:hover {
          background: #eff6ff;
          color: #2563eb;
        }

        /* 错误消息样式 */
        .cc-error-message {
          text-align: center;
          padding: 8px;
          font-size: 13px;
        }

        .cc-error-hint {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #fecaca;
          font-size: 12px;
          text-align: center;
          line-height: 1.5;
        }

        .cc-error-hint small {
          font-size: 11px;
          opacity: 0.9;
        }

        /* 暗色模式支持 - Tooltip */
        @media (prefers-color-scheme: dark) {
          .cc-tooltip {
            background: #1f2937;
            border-color: #374151;
            color: #f3f4f6;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
          }

          .cc-tooltip-close {
            background: #374151;
            color: #9ca3af;
          }

          .cc-tooltip-close:hover {
            background: #4b5563;
            color: #f3f4f6;
          }

          .cc-tooltip-close:active {
            background: #374151;
          }

          .cc-tooltip-header {
            border-bottom-color: #374151;
            color: #f3f4f6;
          }

          .cc-currency-code {
            color: #9ca3af;
          }

          .cc-converted-amount {
            color: #f3f4f6;
          }

          .cc-tooltip-footer {
            border-top-color: #374151;
            color: #6b7280;
          }

          .cc-history-link {
            color: #60a5fa;
          }

          .cc-history-link:hover {
            background: #1e3a8a;
            color: #93c5fd;
          }

          .cc-error-hint {
            border-top-color: #374151;
          }

          /* 暗色模式下的错误提示 */
          .cc-tooltip-error {
            background: #7f1d1d;
            border-color: #991b1b;
            color: #fecaca;
          }

          .cc-tooltip-error .cc-tooltip-header,
          .cc-tooltip-error .cc-converted-amount {
            color: #fecaca;
          }

          .cc-tooltip-error .cc-tooltip-header {
            border-bottom-color: #991b1b;
          }

          .cc-tooltip-error .cc-tooltip-close {
            background: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
          }

          .cc-tooltip-error .cc-tooltip-close:hover {
            background: rgba(239, 68, 68, 0.3);
            color: #fecaca;
          }
        }

        /* 响应式 */
        @media (max-width: 480px) {
          .cc-tooltip {
            min-width: 180px;
            max-width: calc(100vw - 20px);
            font-size: 12px;
          }
          
          .cc-tooltip-header {
            font-size: 14px;
          }
          
          .cc-converted-amount {
            font-size: 13px;
          }
        }
      `);
    }
  }

  /* ==================== 设置面板（简化版） ==================== */
  
  /**
   * 简化版设置面板类
   * 主要用于API密钥配置
   */
  class SettingsPanel {
    constructor(configManager, i18n) {
      this.config = configManager;
      this.i18n = i18n;
      this.panel = null;
      this.registerMenuCommand();
    }

    /**
     * 注册油猴菜单命令
     */
    registerMenuCommand() {
      GM_registerMenuCommand(this.i18n.t('menu.settings'), () => {
        this.show();
      });
      
      GM_registerMenuCommand(this.i18n.t('menu.view'), () => {
        const apiKeys = this.config.get('apiKeys');
        const isCustom = (key, defaultKey) => key !== defaultKey ? `✅ ${this.i18n.t('config.customKey')}` : `📦 ${this.i18n.t('config.defaultKey')}`;
        
        const info = `
【${this.i18n.t('config.apiKeyTitle')}】
ExchangeRate-API: 
  ${apiKeys.exchangeRateApi.substring(0, 8)}****${apiKeys.exchangeRateApi.substring(apiKeys.exchangeRateApi.length - 4)}
  ${isCustom(apiKeys.exchangeRateApi, DEFAULT_CONFIG.apiKeys.exchangeRateApi)}

Fixer.io: 
  ${apiKeys.fixer.substring(0, 8)}****${apiKeys.fixer.substring(apiKeys.fixer.length - 4)}
  ${isCustom(apiKeys.fixer, DEFAULT_CONFIG.apiKeys.fixer)}

CurrencyAPI: 
  ${apiKeys.currencyapi.substring(0, 8)}****${apiKeys.currencyapi.substring(apiKeys.currencyapi.length - 4)}
  ${isCustom(apiKeys.currencyapi, DEFAULT_CONFIG.apiKeys.currencyapi)}

【${this.i18n.t('config.displaySettings')}】
${this.i18n.t('config.targetCurrenciesLabel')}: ${this.config.get('targetCurrencies').join(', ')}
${this.i18n.t('config.maxDisplay')}: ${this.config.get('maxDisplayCurrencies')}${this.i18n.t('config.pieces')}
${this.i18n.t('settings.autoDetect')}: ${this.config.get('autoDetectLocation') ? `✅ ${this.i18n.t('config.enabled')}` : `❌ ${this.i18n.t('config.disabled')}`}
${this.i18n.t('settings.excludeSource')}: ${this.config.get('excludeSourceCurrency') ? `✅ ${this.i18n.t('config.enabled')}` : `❌ ${this.i18n.t('config.disabled')}`}
${this.i18n.t('config.userCountryCurrency')}: ${this.config.get('userCountryCurrency') || this.i18n.t('config.notDetected')}
        `.trim();
        
        alert(info);
      });
      
      GM_registerMenuCommand(this.i18n.t('menu.reset'), () => {
        if (confirm(this.i18n.t('messages.resetConfirm'))) {
          this.config.reset();
          alert(this.i18n.t('messages.resetSuccess'));
          location.reload();
        }
      });

      GM_registerMenuCommand(`🚫 ${this.i18n.t('settings.excludeCurrent')} (${window.location.hostname})`, () => {
        const currentDomain = window.location.hostname;
        const excludedDomains = this.config.get('excludedDomains') || [];
        
        if (excludedDomains.includes(currentDomain)) {
          alert(`⚠️ ${this.i18n.t('messages.excludeExists', { domain: currentDomain })}`);
        } else {
          excludedDomains.push(currentDomain);
          this.config.set('excludedDomains', excludedDomains);
          alert(`✅ ${this.i18n.t('messages.excludeAdded', { domain: currentDomain })}`);
          location.reload();
        }
      });
    }

    /**
     * 显示设置面板
     */
    show() {
      if (this.panel) {
        this.panel.style.display = 'flex';
        this.loadCurrentSettings();
        return;
      }

      this.panel = this.create();
      document.body.appendChild(this.panel);
      this.loadCurrentSettings();
    }

    /**
     * 创建设置面板
     */
    create() {
      // 50+种主流货币（按地区分组）
      const allCurrencies = [
        // 主要货币
        'USD', 'EUR', 'GBP', 'JPY', 'CHF',
        // 亚洲
        'CNY', 'HKD', 'TWD', 'KRW', 'SGD', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'INR', 'PKR', 'BDT', 'LKR', 'NPR',
        // 大洋洲
        'AUD', 'NZD',
        // 北美
        'CAD', 'MXN',
        // 南美
        'BRL', 'ARS', 'CLP', 'COP', 'PEN',
        // 欧洲
        'RUB', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'SEK', 'NOK', 'DKK', 'ISK', 'TRY', 'UAH',
        // 中东
        'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'ILS', 'EGP',
        // 非洲
        'ZAR', 'NGN', 'KES', 'GHS', 'MAD', 'TND', 'DZD'
      ];
      
      const panel = document.createElement('div');
      panel.className = 'cc-settings-panel';
      panel.innerHTML = `
        <div class="cc-settings-overlay"></div>
        <div class="cc-settings-modal">
          <div class="cc-settings-header">
            <h2>⚙️ 货币转换器设置</h2>
            <button class="cc-close-btn" id="cc-close">&times;</button>
          </div>
          <div class="cc-settings-body">
            <!-- 智能显示设置 -->
            <div class="cc-section">
              <h3>🎯 ${this.i18n.t('settings.smartDisplay')}</h3>
              
              <div class="cc-setting-group">
                <label class="cc-checkbox-label">
                  <input type="checkbox" id="cc-auto-detect" />
                  <span><strong>${this.i18n.t('settings.autoDetect')}</strong></span>
                </label>
                <small>${this.i18n.t('settings.autoDetectDesc')}</small>
              </div>

              <div class="cc-setting-group">
                <label class="cc-checkbox-label">
                  <input type="checkbox" id="cc-exclude-source" />
                  <span><strong>${this.i18n.t('settings.excludeSource')}</strong></span>
                </label>
                <small>${this.i18n.t('settings.excludeSourceDesc')}</small>
              </div>

              <div class="cc-setting-group">
                <label>
                  <strong>${this.i18n.t('settings.maxDisplay')}</strong>
                </label>
                <select id="cc-max-display">
                  <option value="2">2${this.i18n.t('config.pieces')}</option>
                  <option value="3">3${this.i18n.t('config.pieces')}</option>
                  <option value="4">4${this.i18n.t('config.pieces')}</option>
                  <option value="5">5${this.i18n.t('config.pieces')}</option>
                </select>
              </div>

              <div class="cc-setting-group">
                <label>
                  <strong>⏱️ 弹窗延迟时间</strong>
                </label>
                <small style="display: block; margin-bottom: 8px; color: #6b7280;">
                  鼠标悬停多久后显示弹窗（毫秒）。时间越长，越不容易误触发。
                </small>
                <select id="cc-tooltip-delay">
                  <option value="100">极快 (100ms)</option>
                  <option value="300">快速 (300ms)</option>
                  <option value="500">适中 (500ms) 推荐</option>
                  <option value="700">稳定 (700ms)</option>
                  <option value="1000">缓慢 (1000ms)</option>
                </select>
              </div>

              <div class="cc-setting-group">
                <label class="cc-checkbox-label">
                  <input type="checkbox" id="cc-inline-mode" />
                  <span><strong>${this.i18n.t('settings.inlineMode')}</strong></span>
                </label>
                <small>${this.i18n.t('settings.inlineModeDesc')}</small>
              </div>

              <div class="cc-setting-group" id="cc-inline-currency-group" style="margin-left: 24px; display: none;">
                <label>
                  <strong>${this.i18n.t('settings.inlineCurrency')}</strong>
                </label>
                <select id="cc-inline-currency">
                  ${allCurrencies.slice(0, 30).map(code => `
                    <option value="${code}">${code} - ${CURRENCY_NAMES_ZH[code] || code}</option>
                  `).join('')}
                </select>
                <small>${this.i18n.t('settings.inlineCurrencyDesc')}</small>
              </div>
            </div>

            <!-- 目标货币选择 -->
            <div class="cc-section">
              <h3>💰 ${this.i18n.t('settings.targetCurrency')}</h3>
              <small style="display: block; margin-bottom: 10px; color: #6b7280;">
                ${this.i18n.t('config.selectCurrencyHint')}
              </small>
              <div class="cc-currency-grid" id="cc-currency-checkboxes">
                ${allCurrencies.map(cur => `
                  <label class="cc-currency-option">
                    <input type="checkbox" name="cc-currency" value="${cur}" />
                    <span>${cur}</span>
                  </label>
                `).join('')}
              </div>
              
              <!-- 已选货币排序区域 -->
              <div id="cc-selected-currencies-section" style="margin-top: 20px; display: none;">
                <h4 style="font-size: 14px; color: #374151; margin-bottom: 10px;">
                  📋 已选货币排序 <small style="color: #9ca3af; font-weight: normal;">(拖拽调整显示顺序)</small>
                </h4>
                <div id="cc-selected-currencies-list" class="cc-sortable-list">
                  <!-- 动态生成的已选货币列表 -->
                </div>
              </div>
            </div>

            <!-- API密钥配置 -->
            <div class="cc-section">
              <h3>🔑 ${this.i18n.t('settings.apiKeys')}</h3>
              <div class="cc-info-box">
                <p>📝 ${this.i18n.t('settings.apiKeysDesc')}</p>
              </div>
              
              <div class="cc-setting-group">
                <label>
                  <strong>ExchangeRate-API</strong> 
                  <a href="https://www.exchangerate-api.com/" target="_blank">${this.i18n.t('config.getKeyLink')}</a>
                </label>
                <small>${this.i18n.t('config.freeQuota')}: 1,500 ${this.i18n.t('config.requestsPerMonth')}</small>
                <input type="text" id="cc-key-exchangerate" placeholder="${this.i18n.t('settings.placeholder')}" />
                <details style="margin-top: 8px;">
                  <summary style="cursor: pointer; color: #3b82f6; font-size: 13px;">🔄 备用密钥池（可选，支持轮换）</summary>
                  <textarea id="cc-keypool-exchangerate" rows="2" placeholder="每行输入一个备用密钥&#10;配额用完时自动切换" style="width: 100%; margin-top: 6px; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-family: monospace; font-size: 12px;"></textarea>
                </details>
              </div>

              <div class="cc-setting-group">
                <label>
                  <strong>Fixer.io</strong>
                  <a href="https://fixer.io/" target="_blank">${this.i18n.t('config.getKeyLink')}</a>
                </label>
                <small>${this.i18n.t('config.freeQuota')}: 100 ${this.i18n.t('config.requestsPerMonth')}</small>
                <input type="text" id="cc-key-fixer" placeholder="${this.i18n.t('settings.placeholder')}" />
                <details style="margin-top: 8px;">
                  <summary style="cursor: pointer; color: #3b82f6; font-size: 13px;">🔄 备用密钥池（可选，支持轮换）</summary>
                  <textarea id="cc-keypool-fixer" rows="2" placeholder="每行输入一个备用密钥&#10;配额用完时自动切换" style="width: 100%; margin-top: 6px; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-family: monospace; font-size: 12px;"></textarea>
                </details>
              </div>

              <div class="cc-setting-group">
                <label>
                  <strong>CurrencyAPI</strong>
                  <a href="https://currencyapi.com/" target="_blank">${this.i18n.t('config.getKeyLink')}</a>
                </label>
                <small>${this.i18n.t('config.freeQuota')}: 300 ${this.i18n.t('config.requestsPerMonth')}</small>
                <input type="text" id="cc-key-currencyapi" placeholder="${this.i18n.t('settings.placeholder')}" />
                <details style="margin-top: 8px;">
                  <summary style="cursor: pointer; color: #3b82f6; font-size: 13px;">🔄 备用密钥池（可选，支持轮换）</summary>
                  <textarea id="cc-keypool-currencyapi" rows="2" placeholder="每行输入一个备用密钥&#10;配额用完时自动切换" style="width: 100%; margin-top: 6px; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-family: monospace; font-size: 12px;"></textarea>
                </details>
              </div>
            </div>

            <!-- 自定义汇率 -->
            <div class="cc-section">
              <h3>⚙️ ${this.i18n.t('settings.customRates')}</h3>
              
              <div class="cc-setting-group">
                <label class="cc-checkbox-label">
                  <input type="checkbox" id="cc-enable-custom-rates" />
                  <span><strong>${this.i18n.t('settings.enableCustom')}</strong></span>
                </label>
                <small>${this.i18n.t('settings.enableCustomDesc')}</small>
              </div>

              <div id="cc-custom-rates-panel" style="display: none; margin-top: 12px; padding: 12px; background: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                <div class="cc-info-box" style="background: #fef3c7; border-left-color: #f59e0b;">
                  <p style="color: #92400e; font-size: 13px;">
                    <strong>💡 ${this.i18n.t('settings.customTip')}</strong><br>
                    ${this.i18n.t('config.exampleText')}
                  </p>
                </div>

                <div style="margin-top: 12px;">
                  <div class="cc-custom-rate-row">
                    <label style="width: 80px; font-weight: 500;">CNY (¥)</label>
                    <span style="margin: 0 8px;">1 USD =</span>
                    <input type="number" id="cc-rate-cny" step="0.0001" min="0" placeholder="7.25" style="flex: 1; max-width: 120px;" />
                    <span style="margin-left: 8px; color: #9ca3af;">CNY</span>
                  </div>

                  <div class="cc-custom-rate-row">
                    <label style="width: 80px; font-weight: 500;">EUR (€)</label>
                    <span style="margin: 0 8px;">1 USD =</span>
                    <input type="number" id="cc-rate-eur" step="0.0001" min="0" placeholder="0.85" style="flex: 1; max-width: 120px;" />
                    <span style="margin-left: 8px; color: #9ca3af;">EUR</span>
                  </div>

                  <div class="cc-custom-rate-row">
                    <label style="width: 80px; font-weight: 500;">GBP (£)</label>
                    <span style="margin: 0 8px;">1 USD =</span>
                    <input type="number" id="cc-rate-gbp" step="0.0001" min="0" placeholder="0.73" style="flex: 1; max-width: 120px;" />
                    <span style="margin-left: 8px; color: #9ca3af;">GBP</span>
                  </div>

                  <div class="cc-custom-rate-row">
                    <label style="width: 80px; font-weight: 500;">JPY (¥)</label>
                    <span style="margin: 0 8px;">1 USD =</span>
                    <input type="number" id="cc-rate-jpy" step="0.01" min="0" placeholder="110.50" style="flex: 1; max-width: 120px;" />
                    <span style="margin-left: 8px; color: #9ca3af;">JPY</span>
                  </div>

                  <div class="cc-custom-rate-row">
                    <label style="width: 80px; font-weight: 500;">HKD (HK$)</label>
                    <span style="margin: 0 8px;">1 USD =</span>
                    <input type="number" id="cc-rate-hkd" step="0.0001" min="0" placeholder="7.85" style="flex: 1; max-width: 120px;" />
                    <span style="margin-left: 8px; color: #9ca3af;">HKD</span>
                  </div>

                  <div class="cc-custom-rate-row">
                    <label style="width: 80px; font-weight: 500;">KRW (₩)</label>
                    <span style="margin: 0 8px;">1 USD =</span>
                    <input type="number" id="cc-rate-krw" step="0.01" min="0" placeholder="1180.50" style="flex: 1; max-width: 120px;" />
                    <span style="margin-left: 8px; color: #9ca3af;">KRW</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 界面语言 -->
            <div class="cc-section">
              <h3>🌍 ${this.i18n.t('settings.language')}</h3>
              <div class="cc-setting-group">
                <label>
                  <strong>${this.i18n.t('settings.language')}</strong>
                </label>
                <small>${this.i18n.t('settings.languageDesc')}</small>
                <select id="cc-language">
                  <option value="auto">🌍 Auto Detect (自动检测)</option>
                  <option value="zh-CN">🇨🇳 简体中文 (Chinese Simplified)</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="ja">🇯🇵 日本語 (Japanese)</option>
                  <option value="ko">🇰🇷 한국어 (Korean)</option>
                </select>
              </div>
            </div>

            <!-- 排除域名 -->
            <div class="cc-section">
              <h3>⛔ ${this.i18n.t('settings.excludeSites')}</h3>
              <div class="cc-setting-group">
                <label>
                  <strong>${this.i18n.t('settings.excludeSitesDesc')}</strong>
                </label>
                <small>${this.i18n.t('settings.excludeSitesPlaceholder')}</small>
                <textarea id="cc-excluded-domains" rows="5" placeholder="localhost&#10;127.0.0.1&#10;xe.com&#10;wise.com" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-family: monospace; font-size: 13px;"></textarea>
                <div style="margin-top: 8px;">
                  <button type="button" class="cc-btn-exclude-current" style="padding: 4px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                    🚫 ${this.i18n.t('settings.excludeCurrent')} (${window.location.hostname})
                  </button>
                </div>
              </div>
            </div>

            <!-- 快捷键说明 -->
            <div class="cc-section">
              <h3>⌨️ ${this.i18n.t('settings.hotkeys')}</h3>
              <div class="cc-info-box" style="background: #f0fdf4; border-left-color: #10b981;">
                <p style="color: #065f46; margin-bottom: 12px;"><strong>${this.i18n.t('settings.hotkeysAvailable')}</strong></p>
                <div style="color: #065f46; font-size: 13px; line-height: 1.8;">
                  <div><kbd style="background: #d1fae5; padding: 2px 6px; border-radius: 3px; font-family: monospace;">Alt + C</kbd> - ${this.i18n.t('menu.calculator')}</div>
                  <div><kbd style="background: #d1fae5; padding: 2px 6px; border-radius: 3px; font-family: monospace;">Alt + H</kbd> - Hide/Show Price Marks</div>
                  <div><kbd style="background: #d1fae5; padding: 2px 6px; border-radius: 3px; font-family: monospace;">Alt + I</kbd> - Toggle Inline Mode</div>
                  <div><kbd style="background: #d1fae5; padding: 2px 6px; border-radius: 3px; font-family: monospace;">Esc</kbd> - Close All Popups</div>
                </div>
              </div>
            </div>
          </div>
          <div class="cc-settings-footer">
            <button class="cc-btn cc-btn-secondary" id="cc-cancel">${this.i18n.t('settings.cancel')}</button>
            <button class="cc-btn cc-btn-primary" id="cc-save">${this.i18n.t('settings.save')}</button>
          </div>
        </div>
      `;

      this.attachEvents(panel);
      this.injectPanelStyles();
      return panel;
    }

    /**
     * 加载当前设置
     */
    loadCurrentSettings() {
      // 加载智能显示设置
      const autoDetect = document.getElementById('cc-auto-detect');
      const excludeSource = document.getElementById('cc-exclude-source');
      const maxDisplay = document.getElementById('cc-max-display');
      const inlineMode = document.getElementById('cc-inline-mode');
      const inlineCurrency = document.getElementById('cc-inline-currency');
      const inlineCurrencyGroup = document.getElementById('cc-inline-currency-group');
      
      if (autoDetect) {
        autoDetect.checked = this.config.get('autoDetectLocation');
      }
      if (excludeSource) {
        excludeSource.checked = this.config.get('excludeSourceCurrency');
      }
      if (maxDisplay) {
        maxDisplay.value = this.config.get('maxDisplayCurrencies') || 3;
      }
      if (inlineMode) {
        inlineMode.checked = this.config.get('inlineMode') || false;
        // 控制内联货币选择的显示
        if (inlineCurrencyGroup) {
          inlineCurrencyGroup.style.display = inlineMode.checked ? 'block' : 'none';
        }
        // 添加监听器
        inlineMode.addEventListener('change', () => {
          if (inlineCurrencyGroup) {
            inlineCurrencyGroup.style.display = inlineMode.checked ? 'block' : 'none';
          }
        });
      }
      if (inlineCurrency) {
        inlineCurrency.value = this.config.get('inlineShowCurrency') || 'CNY';
      }
      
      // 加载弹窗延迟设置
      const tooltipDelay = document.getElementById('cc-tooltip-delay');
      if (tooltipDelay) {
        tooltipDelay.value = this.config.get('tooltipDelay') || 500;
      }

      // 加载目标货币
      const targetCurrencies = this.config.get('targetCurrencies') || ['CNY', 'USD', 'EUR', 'GBP', 'JPY'];
      const currencyCheckboxes = document.querySelectorAll('input[name="cc-currency"]');
      currencyCheckboxes.forEach(checkbox => {
        if (targetCurrencies.includes(checkbox.value)) {
          checkbox.checked = true;
        }
        
        // 添加监听器：当货币选择变化时更新排序列表
        checkbox.addEventListener('change', () => {
          this.updateSortableList();
        });
      });
      
      // 初始化排序列表
      this.updateSortableList();

      // 加载API密钥
      const apiKeys = this.config.get('apiKeys');
      const exchangeInput = document.getElementById('cc-key-exchangerate');
      const fixerInput = document.getElementById('cc-key-fixer');
      const currencyapiInput = document.getElementById('cc-key-currencyapi');

      if (exchangeInput && apiKeys.exchangeRateApi) {
        exchangeInput.value = apiKeys.exchangeRateApi;
      }
      if (fixerInput && apiKeys.fixer) {
        fixerInput.value = apiKeys.fixer;
      }
      if (currencyapiInput && apiKeys.currencyapi) {
        currencyapiInput.value = apiKeys.currencyapi;
      }
      
      // 加载API密钥池
      const apiKeyPools = this.config.get('apiKeyPools');
      const exchangePoolInput = document.getElementById('cc-keypool-exchangerate');
      const fixerPoolInput = document.getElementById('cc-keypool-fixer');
      const currencyapiPoolInput = document.getElementById('cc-keypool-currencyapi');
      
      if (exchangePoolInput && apiKeyPools.exchangeRateApi) {
        exchangePoolInput.value = apiKeyPools.exchangeRateApi.join('\n');
      }
      if (fixerPoolInput && apiKeyPools.fixer) {
        fixerPoolInput.value = apiKeyPools.fixer.join('\n');
      }
      if (currencyapiPoolInput && apiKeyPools.currencyapi) {
        currencyapiPoolInput.value = apiKeyPools.currencyapi.join('\n');
      }

      // 加载自定义汇率设置
      const enableCustomRates = document.getElementById('cc-enable-custom-rates');
      const customRatesPanel = document.getElementById('cc-custom-rates-panel');
      
      if (enableCustomRates) {
        enableCustomRates.checked = this.config.get('enableCustomRates') || false;
        
        // 控制自定义汇率面板的显示
        if (customRatesPanel) {
          customRatesPanel.style.display = enableCustomRates.checked ? 'block' : 'none';
        }
        
        // 添加监听器
        enableCustomRates.addEventListener('change', () => {
          if (customRatesPanel) {
            customRatesPanel.style.display = enableCustomRates.checked ? 'block' : 'none';
          }
        });
      }

      // 加载自定义汇率值
      const customRates = this.config.get('customRates') || {};
      const rateInputs = {
        'CNY': document.getElementById('cc-rate-cny'),
        'EUR': document.getElementById('cc-rate-eur'),
        'GBP': document.getElementById('cc-rate-gbp'),
        'JPY': document.getElementById('cc-rate-jpy'),
        'HKD': document.getElementById('cc-rate-hkd'),
        'KRW': document.getElementById('cc-rate-krw')
      };

      for (const [currency, input] of Object.entries(rateInputs)) {
        if (input && customRates[currency]) {
          input.value = customRates[currency];
        }
      }

      // 加载语言设置
      const languageSelect = document.getElementById('cc-language');
      if (languageSelect) {
        const savedLang = this.config.get('language') || 'auto';
        languageSelect.value = savedLang;
      }

      // 加载排除域名
      const excludedDomainsTextarea = document.getElementById('cc-excluded-domains');
      if (excludedDomainsTextarea) {
        const excludedDomains = this.config.get('excludedDomains') || [];
        excludedDomainsTextarea.value = excludedDomains.join('\n');
      }

      // 绑定"排除当前网站"按钮事件
      const excludeCurrentBtn = document.querySelector('.cc-btn-exclude-current');
      if (excludeCurrentBtn) {
        excludeCurrentBtn.addEventListener('click', () => {
          const currentDomain = window.location.hostname;
          const textarea = document.getElementById('cc-excluded-domains');
          const currentDomains = textarea.value.split('\n').map(d => d.trim()).filter(d => d);
          
          if (!currentDomains.includes(currentDomain)) {
            currentDomains.push(currentDomain);
            textarea.value = currentDomains.join('\n');
            alert(`✅ ${this.i18n.t('messages.excludeAddedPanel', { domain: currentDomain })}`);
          } else {
            alert(`⚠️ ${this.i18n.t('messages.excludeExists', { domain: currentDomain })}`);
          }
        });
      }
    }

    /**
     * 绑定事件
     */
    attachEvents(panel) {
      // 关闭按钮
      panel.querySelector('#cc-close').addEventListener('click', () => {
        this.hide();
      });

      panel.querySelector('#cc-cancel').addEventListener('click', () => {
        this.hide();
      });

      // 保存按钮
      panel.querySelector('#cc-save').addEventListener('click', () => {
        this.saveSettings();
      });

      // 点击遮罩层关闭
      panel.querySelector('.cc-settings-overlay').addEventListener('click', () => {
        this.hide();
      });
    }

    /**
     * 更新可排序的货币列表
     */
    updateSortableList() {
      const selectedCurrencies = Array.from(document.querySelectorAll('input[name="cc-currency"]:checked'))
        .map(cb => cb.value);
      
      const section = document.getElementById('cc-selected-currencies-section');
      const listContainer = document.getElementById('cc-selected-currencies-list');
      
      if (selectedCurrencies.length === 0) {
        section.style.display = 'none';
        return;
      }
      
      section.style.display = 'block';
      
      // 获取当前保存的顺序
      const currentOrder = this.config.get('targetCurrencies') || [];
      
      // 按照当前顺序排列，新添加的货币放在最后
      const orderedCurrencies = [];
      currentOrder.forEach(cur => {
        if (selectedCurrencies.includes(cur)) {
          orderedCurrencies.push(cur);
        }
      });
      selectedCurrencies.forEach(cur => {
        if (!orderedCurrencies.includes(cur)) {
          orderedCurrencies.push(cur);
        }
      });
      
      // 生成列表
      listContainer.innerHTML = orderedCurrencies.map((cur, index) => `
        <div class="cc-sortable-item" data-currency="${cur}" draggable="true">
          <span class="cc-drag-handle">⋮⋮</span>
          <span class="cc-currency-code">${cur}</span>
          <span class="cc-currency-name">${this.getCurrencyName(cur)}</span>
        </div>
      `).join('');
      
      // 绑定拖拽事件
      this.attachSortableEvents();
    }

    /**
     * 获取货币名称
     */
    getCurrencyName(code) {
      const currencyNames = {
        'zh-CN': {
          // 法币
          'CNY': '人民币', 'USD': '美元', 'EUR': '欧元', 'GBP': '英镑', 'JPY': '日元',
          'HKD': '港币', 'KRW': '韩元', 'AUD': '澳元', 'CAD': '加元', 'SGD': '新加坡元',
          'TWD': '新台币', 'THB': '泰铢', 'MYR': '马来西亚林吉特', 'RUB': '卢布', 
          'CHF': '瑞士法郎', 'SEK': '瑞典克朗', 'NZD': '新西兰元', 'MXN': '墨西哥比索',
          'INR': '印度卢比', 'BRL': '巴西雷亚尔', 'ZAR': '南非兰特', 'NOK': '挪威克朗',
          'DKK': '丹麦克朗', 'PLN': '波兰兹罗提', 'TRY': '土耳其里拉', 'IDR': '印尼盾',
          'PHP': '菲律宾比索', 'VND': '越南盾', 'AED': '阿联酋迪拉姆', 'SAR': '沙特里亚尔',
          // 加密货币
          'BTC': '比特币', 'ETH': '以太坊', 'USDT': '泰达币', 'BNB': '币安币', 
          'SOL': 'Solana', 'XRP': '瑞波币', 'USDC': 'USD Coin', 'ADA': '艾达币',
          'DOGE': '狗狗币', 'TRX': '波场', 'DOT': '波卡', 'MATIC': 'Polygon',
          'UNI': 'Uniswap', 'LINK': 'Chainlink', 'SHIB': '柴犬币', 'AVAX': '雪崩'
        },
        'en': {
          // Fiat
          'CNY': 'Chinese Yuan', 'USD': 'US Dollar', 'EUR': 'Euro', 'GBP': 'British Pound', 'JPY': 'Japanese Yen',
          'HKD': 'Hong Kong Dollar', 'KRW': 'South Korean Won', 'AUD': 'Australian Dollar', 'CAD': 'Canadian Dollar',
          'SGD': 'Singapore Dollar', 'TWD': 'Taiwan Dollar', 'THB': 'Thai Baht', 'MYR': 'Malaysian Ringgit',
          'RUB': 'Russian Ruble', 'CHF': 'Swiss Franc', 'SEK': 'Swedish Krona', 'NZD': 'New Zealand Dollar',
          'MXN': 'Mexican Peso', 'INR': 'Indian Rupee', 'BRL': 'Brazilian Real', 'ZAR': 'South African Rand',
          'NOK': 'Norwegian Krone', 'DKK': 'Danish Krone', 'PLN': 'Polish Zloty', 'TRY': 'Turkish Lira',
          'IDR': 'Indonesian Rupiah', 'PHP': 'Philippine Peso', 'VND': 'Vietnamese Dong', 'AED': 'UAE Dirham',
          'SAR': 'Saudi Riyal',
          // Crypto
          'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'USDT': 'Tether', 'BNB': 'Binance Coin', 'SOL': 'Solana',
          'XRP': 'Ripple', 'USDC': 'USD Coin', 'ADA': 'Cardano', 'DOGE': 'Dogecoin', 'TRX': 'TRON',
          'DOT': 'Polkadot', 'MATIC': 'Polygon', 'UNI': 'Uniswap', 'LINK': 'Chainlink', 'SHIB': 'Shiba Inu',
          'AVAX': 'Avalanche'
        },
        'ja': {
          'CNY': '中国人民元', 'USD': '米ドル', 'EUR': 'ユーロ', 'GBP': '英ポンド', 'JPY': '日本円',
          'HKD': '香港ドル', 'KRW': '韓国ウォン', 'AUD': '豪ドル', 'CAD': 'カナダドル',
          'BTC': 'ビットコイン', 'ETH': 'イーサリアム'
        }
      };

      const lang = this.i18n.currentLanguage;
      const names = currencyNames[lang] || currencyNames['en'];
      return names[code] || code;
    }

    /**
     * 绑定拖拽排序事件
     */
    attachSortableEvents() {
      const items = document.querySelectorAll('.cc-sortable-item');
      let draggedItem = null;
      
      items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
          draggedItem = item;
          item.classList.add('cc-dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/html', item.innerHTML);
        });
        
        item.addEventListener('dragend', (e) => {
          item.classList.remove('cc-dragging');
          items.forEach(i => i.classList.remove('cc-drag-over'));
        });
        
        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          
          if (draggedItem === item) return;
          
          const listContainer = document.getElementById('cc-selected-currencies-list');
          const items = Array.from(listContainer.querySelectorAll('.cc-sortable-item'));
          const draggedIndex = items.indexOf(draggedItem);
          const targetIndex = items.indexOf(item);
          
          if (draggedIndex < targetIndex) {
            item.parentNode.insertBefore(draggedItem, item.nextSibling);
          } else {
            item.parentNode.insertBefore(draggedItem, item);
          }
        });
        
        item.addEventListener('dragenter', (e) => {
          e.preventDefault();
          if (draggedItem !== item) {
            item.classList.add('cc-drag-over');
          }
        });
        
        item.addEventListener('dragleave', (e) => {
          item.classList.remove('cc-drag-over');
        });
      });
    }

    /**
     * 保存设置
     */
    saveSettings() {
      // 获取智能显示设置
      const autoDetect = document.getElementById('cc-auto-detect').checked;
      const excludeSource = document.getElementById('cc-exclude-source').checked;
      const maxDisplay = parseInt(document.getElementById('cc-max-display').value);
      const tooltipDelay = parseInt(document.getElementById('cc-tooltip-delay').value);
      const inlineMode = document.getElementById('cc-inline-mode').checked;
      const inlineCurrency = document.getElementById('cc-inline-currency').value;

      // 获取排序后的货币列表（从排序区域获取）
      const sortedItems = Array.from(document.querySelectorAll('.cc-sortable-item'));
      const selectedCurrencies = sortedItems.length > 0 
        ? sortedItems.map(item => item.dataset.currency)
        : Array.from(document.querySelectorAll('input[name="cc-currency"]:checked'))
            .map(cb => cb.value);

      // 验证货币选择
      if (selectedCurrencies.length < 2) {
        alert(this.i18n.t('messages.minCurrency'));
        return;
      }
      if (selectedCurrencies.length > 5) {
        alert(this.i18n.t('messages.maxCurrency'));
        return;
      }

      // 获取API密钥
      const exchangeKey = document.getElementById('cc-key-exchangerate').value.trim();
      const fixerKey = document.getElementById('cc-key-fixer').value.trim();
      const currencyapiKey = document.getElementById('cc-key-currencyapi').value.trim();

      const newApiKeys = {};
      newApiKeys.exchangeRateApi = exchangeKey || DEFAULT_CONFIG.apiKeys.exchangeRateApi;
      newApiKeys.fixer = fixerKey || DEFAULT_CONFIG.apiKeys.fixer;
      newApiKeys.currencyapi = currencyapiKey || DEFAULT_CONFIG.apiKeys.currencyapi;
      
      // 获取API密钥池
      const exchangePool = document.getElementById('cc-keypool-exchangerate').value
        .split('\n')
        .map(k => k.trim())
        .filter(k => k);
      const fixerPool = document.getElementById('cc-keypool-fixer').value
        .split('\n')
        .map(k => k.trim())
        .filter(k => k);
      const currencyapiPool = document.getElementById('cc-keypool-currencyapi').value
        .split('\n')
        .map(k => k.trim())
        .filter(k => k);
      
      const newApiKeyPools = {
        exchangeRateApi: exchangePool,
        fixer: fixerPool,
        currencyapi: currencyapiPool
      };

      // 获取自定义汇率设置
      const enableCustomRates = document.getElementById('cc-enable-custom-rates').checked;
      const customRates = {};
      
      if (enableCustomRates) {
        // 读取所有汇率输入
        const rateInputs = {
          'CNY': document.getElementById('cc-rate-cny'),
          'EUR': document.getElementById('cc-rate-eur'),
          'GBP': document.getElementById('cc-rate-gbp'),
          'JPY': document.getElementById('cc-rate-jpy'),
          'HKD': document.getElementById('cc-rate-hkd'),
          'KRW': document.getElementById('cc-rate-krw')
        };

        let hasAnyRate = false;
        for (const [currency, input] of Object.entries(rateInputs)) {
          if (input && input.value) {
            const rate = parseFloat(input.value);
            if (isNaN(rate) || rate <= 0) {
              alert(`${this.i18n.t('messages.invalidRate')}: ${currency} = ${input.value}\n${this.i18n.t('messages.invalidRateDesc')}`);
              return;
            }
            customRates[currency] = rate;
            hasAnyRate = true;
          }
        }

        // 如果启用了自定义汇率但没有设置任何值
        if (!hasAnyRate) {
          alert(this.i18n.t('messages.minCustomRate'));
          return;
        }
      }

      // 获取语言设置
      const language = document.getElementById('cc-language').value;

      // 获取排除域名
      const excludedDomainsText = document.getElementById('cc-excluded-domains').value;
      const excludedDomains = excludedDomainsText
        .split('\n')
        .map(d => d.trim())
        .filter(d => d.length > 0);

      // 保存所有配置
      const newConfig = {
        language: language,
        excludedDomains: excludedDomains,
        autoDetectLocation: autoDetect,
        excludeSourceCurrency: excludeSource,
        maxDisplayCurrencies: maxDisplay,
        tooltipDelay: tooltipDelay,
        inlineMode: inlineMode,
        inlineShowCurrency: inlineCurrency,
        enableCustomRates: enableCustomRates,
        customRates: customRates,
        targetCurrencies: selectedCurrencies,
        apiKeys: newApiKeys,
        apiKeyPools: newApiKeyPools
      };

      // 如果禁用了自动检测，清除缓存的国家货币
      if (!autoDetect) {
        newConfig.userCountryCurrency = null;
      }

      this.config.save(newConfig);

      alert(this.i18n.t('messages.saved'));
      this.hide();
      
      // 1秒后自动刷新
      setTimeout(() => {
        location.reload();
      }, 1000);
    }

    /**
     * 隐藏设置面板
     */
    hide() {
      if (this.panel) {
        this.panel.style.display = 'none';
      }
    }

    /**
     * 注入设置面板样式
     */
    injectPanelStyles() {
      GM_addStyle(`
        .cc-settings-panel {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cc-settings-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
        }

        .cc-settings-modal {
          position: relative;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: cc-modal-in 0.3s ease;
        }

        @keyframes cc-modal-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .cc-settings-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          color: #1f2937;
        }

        .cc-settings-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .cc-close-btn {
          background: none;
          border: none;
          color: #6b7280;
          font-size: 32px;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .cc-close-btn:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .cc-settings-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .cc-info-box {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 12px 16px;
          margin-bottom: 20px;
          border-radius: 4px;
        }

        .cc-info-box.cc-tip {
          background: #fef3c7;
          border-left-color: #f59e0b;
        }

        .cc-info-box p {
          margin: 0 0 8px 0;
          color: #1e40af;
          font-size: 14px;
        }

        .cc-info-box.cc-tip p {
          color: #92400e;
        }

        .cc-info-box ul {
          margin: 0;
          padding-left: 20px;
          color: #92400e;
          font-size: 13px;
        }

        .cc-info-box ul li {
          margin: 4px 0;
        }

        .cc-setting-group {
          margin-bottom: 20px;
        }

        .cc-setting-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #374151;
        }

        .cc-custom-rate-row {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .cc-custom-rate-row input[type="number"] {
          padding: 6px 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
          text-align: right;
        }

        .cc-custom-rate-row input[type="number"]:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .cc-setting-group label a {
          color: #667eea;
          text-decoration: none;
          font-size: 13px;
          margin-left: 8px;
          font-weight: normal;
        }

        .cc-setting-group label a:hover {
          text-decoration: underline;
        }

        .cc-setting-group small {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .cc-setting-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: 'Courier New', monospace;
          transition: border-color 0.2s;
        }

        .cc-setting-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .cc-setting-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .cc-setting-group select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .cc-section {
          margin-bottom: 30px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .cc-section:last-child {
          border-bottom: none;
        }

        .cc-section h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cc-checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin-bottom: 8px;
        }

        .cc-checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #667eea;
        }

        .cc-currency-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .cc-currency-option {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .cc-currency-option:hover {
          border-color: #667eea;
          background: #f5f7ff;
        }

        .cc-currency-option input[type="checkbox"] {
          display: none;
        }

        .cc-currency-option input[type="checkbox"]:checked + span {
          color: white;
        }

        .cc-currency-option:has(input:checked) {
          background: #3b82f6;
          border-color: #3b82f6;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .cc-currency-option span {
          font-weight: 600;
          font-size: 14px;
          color: #374151;
          transition: color 0.2s;
        }

        .cc-currency-option:has(input:checked) span {
          color: white;
        }

        /* 可排序货币列表 */
        .cc-sortable-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cc-sortable-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: move;
          transition: all 0.2s;
          user-select: none;
        }

        .cc-sortable-item:hover {
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .cc-sortable-item.cc-dragging {
          opacity: 0.5;
          transform: scale(0.95);
        }

        .cc-sortable-item.cc-drag-over {
          border-color: #667eea;
          border-style: dashed;
        }

        .cc-drag-handle {
          font-size: 16px;
          color: #9ca3af;
          cursor: grab;
          padding: 4px;
        }

        .cc-drag-handle:active {
          cursor: grabbing;
        }

        .cc-currency-code {
          font-weight: bold;
          color: #374151;
          font-size: 14px;
          min-width: 50px;
        }

        .cc-currency-name {
          color: #6b7280;
          font-size: 13px;
          flex: 1;
        }

        .cc-settings-footer {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #f9fafb;
        }

        .cc-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cc-btn-primary {
          background: #3b82f6;
          color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .cc-btn-primary:hover {
          background: #2563eb;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .cc-btn-primary:active {
          background: #1d4ed8;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .cc-btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .cc-btn-secondary:hover {
          background: #d1d5db;
        }

        /* 暗色模式支持 */
        @media (prefers-color-scheme: dark) {
          .cc-settings-modal {
            background: #1f2937;
            color: #f3f4f6;
          }

          .cc-settings-header {
            background: #1f2937;
            border-bottom-color: #374151;
          }

          .cc-settings-header h2 {
            color: #f3f4f6;
          }

          .cc-close-btn {
            color: #9ca3af;
          }

          .cc-close-btn:hover {
            background: #374151;
            color: #f3f4f6;
          }

          .cc-settings-body {
            background: #1f2937;
          }

          .cc-section {
            border-bottom-color: #374151;
          }

          .cc-section h3 {
            color: #f3f4f6;
          }

          .cc-info-box {
            background: #1e3a5f;
            border-left-color: #3b82f6;
          }

          .cc-info-box p {
            color: #93c5fd;
          }

          .cc-setting-group label {
            color: #f3f4f6;
          }

          .cc-setting-group small {
            color: #9ca3af;
          }

          .cc-setting-group input,
          .cc-setting-group select {
            background: #374151;
            border-color: #4b5563;
            color: #f3f4f6;
          }

          .cc-setting-group input:focus,
          .cc-setting-group select:focus {
            border-color: #3b82f6;
            background: #374151;
          }

          .cc-currency-option {
            background: #374151;
            border-color: #4b5563;
          }

          .cc-currency-option:hover {
            border-color: #3b82f6;
            background: #2d3748;
          }

          .cc-currency-option span {
            color: #f3f4f6;
          }

          .cc-btn-secondary {
            background: #374151;
            color: #f3f4f6;
          }

          .cc-btn-secondary:hover {
            background: #4b5563;
          }

          .cc-settings-footer {
            background: #111827;
            border-top-color: #374151;
          }
        }

        @media (max-width: 640px) {
          .cc-settings-modal {
            width: 95%;
            max-height: 90vh;
          }

          .cc-settings-header,
          .cc-settings-body,
          .cc-settings-footer {
            padding: 16px;
          }
        }
      `);
    }
  }

  /* ==================== 货币计算器 ==================== */
  
  /**
   * 货币计算器类
   * 提供独立的浮动计算器窗口
   */
  class CalculatorPanel {
    constructor(rateManager, configManager, i18n) {
      this.rateManager = rateManager;
      this.config = configManager;
      this.i18n = i18n;
      this.panel = null;
      this.isDragging = false;
      this.dragOffset = { x: 0, y: 0 };
      
      // 加载保存的配置
      this.position = this.loadPosition();
      this.fromCurrency = this.loadSavedCurrency('calcFromCurrency') || 'USD';
      this.toCurrency = this.loadSavedCurrency('calcToCurrency') || 'CNY';
      this.fromAmount = 100;
      
      this.create();
    }

    /**
     * 加载保存的位置
     */
    loadPosition() {
      try {
        const saved = GM_getValue('cc_calc_position');
        return saved ? JSON.parse(saved) : { x: window.innerWidth - 350, y: 100 };
      } catch (error) {
        return { x: window.innerWidth - 350, y: 100 };
      }
    }

    /**
     * 保存位置
     */
    savePosition() {
      try {
        GM_setValue('cc_calc_position', JSON.stringify(this.position));
      } catch (error) {
        console.error('[CC] Failed to save calculator position:', error);
      }
    }

    /**
     * 加载保存的货币
     */
    loadSavedCurrency(key) {
      try {
        return GM_getValue(key);
      } catch (error) {
        return null;
      }
    }

    /**
     * 保存货币选择
     */
    saveCurrency(key, currency) {
      try {
        GM_setValue(key, currency);
      } catch (error) {
        console.error('[CC] Failed to save currency:', error);
      }
    }

    /**
     * 创建计算器面板
     */
    create() {
      const supportedCurrencies = ['USD', 'CNY', 'EUR', 'GBP', 'JPY', 'HKD', 'TWD', 'KRW', 'AUD', 'CAD', 'SGD', 'CHF', 'RUB', 'INR', 'BRL'];
      
      this.panel = document.createElement('div');
      this.panel.className = 'cc-calculator-panel';
      this.panel.style.left = `${this.position.x}px`;
      this.panel.style.top = `${this.position.y}px`;
      this.panel.style.display = 'none';
      
      this.panel.innerHTML = `
        <div class="cc-calc-header" id="cc-calc-header">
          <span>💱 货币计算器</span>
          <button class="cc-calc-close" id="cc-calc-close">&times;</button>
        </div>
        <div class="cc-calc-body">
          <div class="cc-calc-input-group">
            <input type="number" id="cc-calc-from-amount" value="${this.fromAmount}" step="0.01" min="0" />
            <select id="cc-calc-from-currency">
              ${supportedCurrencies.map(c => `<option value="${c}" ${c === this.fromCurrency ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="cc-calc-swap">
            <button id="cc-calc-swap" title="交换货币">⇅</button>
          </div>
          <div class="cc-calc-input-group">
            <input type="number" id="cc-calc-to-amount" value="0" readonly />
            <select id="cc-calc-to-currency">
              ${supportedCurrencies.map(c => `<option value="${c}" ${c === this.toCurrency ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="cc-calc-rate" id="cc-calc-rate">
            1 ${this.fromCurrency} = 0 ${this.toCurrency}
          </div>
        </div>
      `;

      document.body.appendChild(this.panel);
      this.attachEvents();
      this.injectStyles();
      this.calculate(); // 初始计算
    }

    /**
     * 绑定事件
     */
    attachEvents() {
      // 关闭按钮
      this.panel.querySelector('#cc-calc-close').addEventListener('click', () => {
        this.hide();
      });

      // 拖拽
      const header = this.panel.querySelector('#cc-calc-header');
      header.addEventListener('mousedown', (e) => {
        if (e.target.id === 'cc-calc-close') return;
        this.isDragging = true;
        this.dragOffset.x = e.clientX - this.position.x;
        this.dragOffset.y = e.clientY - this.position.y;
        this.panel.style.cursor = 'grabbing';
        header.style.cursor = 'grabbing';
      });

      document.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;
        e.preventDefault();
        this.position.x = e.clientX - this.dragOffset.x;
        this.position.y = e.clientY - this.dragOffset.y;
        
        // 边界限制
        this.position.x = Math.max(0, Math.min(this.position.x, window.innerWidth - this.panel.offsetWidth));
        this.position.y = Math.max(0, Math.min(this.position.y, window.innerHeight - this.panel.offsetHeight));
        
        this.panel.style.left = `${this.position.x}px`;
        this.panel.style.top = `${this.position.y}px`;
      });

      document.addEventListener('mouseup', () => {
        if (this.isDragging) {
          this.isDragging = false;
          this.panel.style.cursor = '';
          header.style.cursor = '';
          this.savePosition();
        }
      });

      // 输入变化
      const fromAmountInput = this.panel.querySelector('#cc-calc-from-amount');
      const fromCurrencySelect = this.panel.querySelector('#cc-calc-from-currency');
      const toCurrencySelect = this.panel.querySelector('#cc-calc-to-currency');

      fromAmountInput.addEventListener('input', () => {
        let value = parseFloat(fromAmountInput.value);
        
        // 验证输入
        if (isNaN(value) || value < 0) {
          value = 0;
        }
        if (value > 999999999) {
          value = 999999999;
          fromAmountInput.value = value;
        }
        
        this.fromAmount = value;
        this.calculate();
      });

      // 失去焦点时格式化显示
      fromAmountInput.addEventListener('blur', () => {
        if (this.fromAmount > 0) {
          fromAmountInput.value = this.fromAmount.toFixed(2);
        }
      });

      // Enter键快速计算
      fromAmountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          fromAmountInput.blur();
          this.calculate();
        }
      });

      fromCurrencySelect.addEventListener('change', () => {
        this.fromCurrency = fromCurrencySelect.value;
        this.saveCurrency('calcFromCurrency', this.fromCurrency);
        this.calculate();
      });

      toCurrencySelect.addEventListener('change', () => {
        this.toCurrency = toCurrencySelect.value;
        this.saveCurrency('calcToCurrency', this.toCurrency);
        this.calculate();
      });

      // 交换按钮
      this.panel.querySelector('#cc-calc-swap').addEventListener('click', () => {
        // 交换货币
        const tempCurrency = this.fromCurrency;
        this.fromCurrency = this.toCurrency;
        this.toCurrency = tempCurrency;
        
        // 交换金额（使用当前转换后的金额）
        const toAmountInput = this.panel.querySelector('#cc-calc-to-amount');
        const currentToAmount = parseFloat(toAmountInput.value) || 0;
        this.fromAmount = currentToAmount;
        fromAmountInput.value = this.fromAmount.toFixed(2);
        
        // 更新下拉框
        fromCurrencySelect.value = this.fromCurrency;
        toCurrencySelect.value = this.toCurrency;
        
        // 保存货币选择
        this.saveCurrency('calcFromCurrency', this.fromCurrency);
        this.saveCurrency('calcToCurrency', this.toCurrency);
        
        // 重新计算
        this.calculate();
      });
    }

    /**
     * 计算转换
     */
    async calculate() {
      try {
        // 获取汇率
        await this.rateManager.getRates('USD');
        
        const converted = this.rateManager.convert(this.fromAmount, this.fromCurrency, this.toCurrency);
        const rate = this.rateManager.convert(1, this.fromCurrency, this.toCurrency);
        
        // 更新显示
        const toAmountInput = this.panel.querySelector('#cc-calc-to-amount');
        const rateDisplay = this.panel.querySelector('#cc-calc-rate');
        
        toAmountInput.value = converted.toFixed(2);
        rateDisplay.textContent = `1 ${this.fromCurrency} = ${rate.toFixed(4)} ${this.toCurrency}`;
        rateDisplay.style.color = '#6b7280';
      } catch (error) {
        const toAmountInput = this.panel.querySelector('#cc-calc-to-amount');
        const rateDisplay = this.panel.querySelector('#cc-calc-rate');
        
        toAmountInput.value = '0.00';
        rateDisplay.textContent = `⚠️ ${this.i18n.t('messages.rateUnavailable')}`;
        rateDisplay.style.color = '#ef4444';
        
        console.warn('[CC] Calculator conversion failed:', error);
      }
    }

    /**
     * 显示计算器
     */
    show() {
      this.panel.style.display = 'block';
      this.calculate(); // 刷新汇率
      this.panel.querySelector('#cc-calc-from-amount').focus();
    }

    /**
     * 隐藏计算器
     */
    hide() {
      this.panel.style.display = 'none';
    }

    /**
     * 切换显示/隐藏
     */
    toggle() {
      if (this.panel.style.display === 'none') {
        this.show();
      } else {
        this.hide();
      }
    }

    /**
     * 注入样式
     */
    injectStyles() {
      GM_addStyle(`
        .cc-calculator-panel {
          position: fixed;
          width: auto;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 9999998;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .cc-calc-header {
          padding: 12px 16px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 8px 8px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: grab;
          user-select: none;
        }

        .cc-calc-header span {
          font-weight: 600;
          font-size: 14px;
          color: #1f2937;
        }

        .cc-calc-close {
          background: none;
          border: none;
          color: #6b7280;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .cc-calc-close:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .cc-calc-body {
          padding: 16px;
        }

        .cc-calc-input-group {
          display: flex;
          gap: 8px;
        }

        .cc-calc-input-group input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .cc-calc-input-group input:read-only {
          background: #f9fafb;
          color: #6b7280;
        }

        .cc-calc-input-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .cc-calc-input-group select {
          padding: 10px 8px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          background: white;
          cursor: pointer;
        }

        .cc-calc-input-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .cc-calc-swap {
          display: flex;
          justify-content: center;
          margin: 10px 0;
        }

        .cc-calc-swap button {
          background: #f3f4f6;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 18px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cc-calc-swap button:hover {
          background: #e5e7eb;
          color: #1f2937;
          transform: rotate(180deg);
        }

        .cc-calc-swap button:active {
          background: #d1d5db;
        }

        .cc-calc-rate {
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        /* 暗色模式 */
        @media (prefers-color-scheme: dark) {
          .cc-calculator-panel {
            background: #1f2937;
            border-color: #374151;
          }

          .cc-calc-header {
            background: #1f2937;
            border-bottom-color: #374151;
          }

          .cc-calc-header span {
            color: #f3f4f6;
          }

          .cc-calc-close {
            color: #9ca3af;
          }

          .cc-calc-close:hover {
            background: #374151;
            color: #f3f4f6;
          }

          .cc-calc-input-group input,
          .cc-calc-input-group select {
            background: #374151;
            border-color: #4b5563;
            color: #f3f4f6;
          }

          .cc-calc-input-group input:read-only {
            background: #2d3748;
            color: #9ca3af;
          }

          .cc-calc-swap button {
            background: #374151;
            color: #9ca3af;
          }

          .cc-calc-swap button:hover {
            background: #4b5563;
            color: #f3f4f6;
          }

          .cc-calc-rate {
            border-top-color: #374151;
            color: #6b7280;
          }
        }
      `);
    }
  }

  /* ==================== 快捷键管理器 ==================== */
  
  /**
   * 快捷键管理器类
   * 处理全局快捷键
   */
  class KeyboardManager {
    constructor(calculatorPanel, tooltipManager, configManager, detector) {
      this.calculator = calculatorPanel;
      this.tooltipManager = tooltipManager;
      this.config = configManager;
      this.detector = detector;
      this.init();
    }

    /**
     * 初始化快捷键监听
     */
    init() {
      document.addEventListener('keydown', (e) => {
        // Alt + C: 打开/关闭计算器
        if (e.altKey && e.key.toLowerCase() === 'c') {
          e.preventDefault();
          this.calculator.toggle();
          console.log('[CC] 快捷键: Alt+C - 切换计算器');
        }

        // Escape: 关闭计算器和所有tooltip
        if (e.key === 'Escape') {
          this.calculator.hide();
          if (this.tooltipManager.currentTooltip) {
            this.tooltipManager.hideTooltip();
          }
        }

        // Alt + H: 隐藏/显示所有价格标记
        if (e.altKey && e.key.toLowerCase() === 'h') {
          e.preventDefault();
          this.togglePriceHighlights();
          console.log('[CC] 快捷键: Alt+H - 切换价格标记');
        }

        // Alt + I: 切换内联模式
        if (e.altKey && e.key.toLowerCase() === 'i') {
          e.preventDefault();
          this.toggleInlineMode();
          console.log('[CC] 快捷键: Alt+I - 切换内联模式');
        }
      });

      console.log('[CC] 快捷键已启用: Alt+C (计算器), Alt+H (切换标记), Alt+I (内联模式), Esc (关闭)');
    }

    /**
     * 切换价格高亮显示
     */
    togglePriceHighlights() {
      const priceElements = document.querySelectorAll('.cc-price-detected');
      if (priceElements.length === 0) return;

      const firstElement = priceElements[0];
      const isHidden = firstElement.style.textDecoration === 'none';

      priceElements.forEach(el => {
        if (isHidden) {
          el.style.textDecoration = ''; // 恢复下划线
          el.style.textDecorationStyle = '';
          el.style.textDecorationColor = '';
        } else {
          el.style.textDecoration = 'none'; // 隐藏下划线
        }
      });
    }

    /**
     * 切换内联模式
     */
    toggleInlineMode() {
      const currentMode = this.config.get('inlineMode');
      const newMode = !currentMode;
      
      // 保存新配置
      this.config.set('inlineMode', newMode);
      
      if (newMode) {
        // 开启内联模式：为所有已检测的价格添加内联显示
        this.detector.detectedElements.forEach((priceData, element) => {
          this.detector.addInlineConversion(element, priceData);
        });
        console.log('[CC] ✅ 内联模式已开启');
      } else {
        // 关闭内联模式：移除所有内联显示
        this.detector.removeAllInlineConversions();
        console.log('[CC] ❌ 内联模式已关闭');
      }
    }
  }

  /* ==================== 动态内容监听 ==================== */
  
  /**
   * 设置动态内容观察器
   * 用于监听DOM变化，支持SPA网站
   * @param {CurrencyDetector} detector - 货币检测器实例
   */
  function setupDynamicObserver(detector) {
    // 使用节流优化性能
    const throttledScan = Utils.throttle((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              detector.scanElement(node);
            }
          });
        }
      }
    }, 300);

    const observer = new MutationObserver(throttledScan);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('[CC] MutationObserver started for dynamic content');
  }

  /* ==================== 主程序初始化 ==================== */
  
  /**
   * 主初始化函数
   */
    function init() {
      console.log('%c💱 Currency Converter v1.7.5 Loaded',
      'color: #667eea; font-size: 14px; font-weight: bold;');

    try {
      // 1. 实例化配置管理器
      const configManager = new ConfigManager();
      console.log('[CC] ConfigManager initialized');

      // 1.2. 检查当前域名是否被排除
      const currentDomain = window.location.hostname;
      const excludedDomains = configManager.get('excludedDomains') || [];
      
      if (excludedDomains.some(domain => currentDomain.includes(domain))) {
        // 仍然注册设置菜单，以便用户可以管理排除列表
        const i18n = new I18nManager(configManager);
        const settingsPanel = new SettingsPanel(configManager, i18n);
        return;
      }

      // 1.5. 实例化国际化管理器
      const i18n = new I18nManager(configManager);
      console.log(`[CC] I18nManager initialized (${i18n.getCurrentLanguage()})`);

      // 1.6. 实例化通知管理器
      const notificationManager = new NotificationManager(i18n);
      console.log('[CC] NotificationManager initialized');

      // 2. 实例化汇率管理器
      const rateManager = new ExchangeRateManager(configManager, notificationManager);
      console.log('[CC] ExchangeRateManager initialized');
      
      // 5. 实例化加密货币汇率管理器
      const cryptoRateManager = new CryptoRateManager(configManager);
      console.log('[CC] CryptoRateManager initialized');

      // 3. 实例化地理位置检测器
      const geoDetector = new GeoLocationDetector(configManager);
      console.log('[CC] GeoLocationDetector initialized');

      // 3.5. 检测用户所在国家货币（异步，不阻塞）
      geoDetector.detectUserCurrency().catch(err => {
        console.warn('[CC] 地理位置检测失败（不影响功能）:', err.message);
      });

      // 4. 实例化价格检测器
      const detector = new CurrencyDetector(configManager);
      console.log('[CC] CurrencyDetector initialized');

      // 5. 实例化工具提示管理器
      const tooltipManager = new TooltipManager(rateManager, configManager, i18n, cryptoRateManager);
      console.log('[CC] TooltipManager initialized');

      // 5.1. 连接detector和rateManager以支持内联模式
      detector.updateInlineConversion = async function(inlineElement, priceData, toCurrency) {
        try {
          await rateManager.getRates('USD');
          const converted = rateManager.convert(priceData.amount, priceData.currency, toCurrency);
          
          // 格式化显示
          const formattedAmount = new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: toCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(converted);
          
          inlineElement.textContent = ` (≈${formattedAmount})`;
          inlineElement.dataset.loading = 'false';
        } catch (error) {
          inlineElement.textContent = '';
          inlineElement.style.display = 'none';
          console.warn('[CC] Inline conversion failed:', error);
        }
      };

      // 5.5. 实例化设置面板
      const settingsPanel = new SettingsPanel(configManager, i18n);
      console.log('[CC] SettingsPanel initialized');

      // 5.6. 实例化货币计算器
      const calculator = new CalculatorPanel(rateManager, configManager, i18n);
      console.log('[CC] CalculatorPanel initialized');

      // 5.7. 实例化快捷键管理器
      const keyboardManager = new KeyboardManager(calculator, tooltipManager, configManager, detector);
      console.log('[CC] KeyboardManager initialized');

      // 5.8. 添加计算器菜单命令
      GM_registerMenuCommand(i18n.t('menu.calculator'), () => {
        calculator.toggle();
      });

      // 6. 延迟扫描页面（性能优化）
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          detector.scanPage();
        }, { timeout: 2000 });
      } else {
        setTimeout(() => {
          detector.scanPage();
        }, 1000);
      }

      // 7. 设置动态内容监听
      setupDynamicObserver(detector);

      // 8. 预加载汇率数据
      rateManager.getRates('USD').then(() => {
        console.log('[CC] Exchange rates preloaded');
      }).catch(err => {
        console.warn('[CC] Failed to preload rates:', err.message);
      });

      console.log('%c✅ Currency Converter is ready!', 'color: #10b981; font-size: 12px; font-weight: bold;');
    } catch (error) {
      console.error('[CC] Initialization failed:', error);
    }
  }

  /* ==================== 全局错误处理 ==================== */
  
  window.addEventListener('error', (event) => {
    // 只处理本脚本的错误
    if (event.error && event.error.stack && event.error.stack.includes('currency')) {
      console.error('[CC] Script error:', event.error);
      // 防止错误传播到页面
      event.preventDefault();
    }
  });

  /* ==================== 启动脚本 ==================== */
  
  // 在DOM就绪后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

