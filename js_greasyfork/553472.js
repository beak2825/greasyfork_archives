// ==UserScript==
// @license         MIT
// @name            CleanURLs and SkipRedirects
// @name:en         CleanURLs and SkipRedirects
// @version         9.0
// @description     Supprime les paramètres de suivi des URLs et passe les redirections
// @description:en  Removes tracking parameters from URLs and skips redirects
// @author          LeDimiScript
// @match           *://*/*
// @grant           none
// @run-at          document-start
// @icon            data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjxzdmcgaGVpZ2h0PSI4MDBweCIgd2lkdGg9IjgwMHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDUxMS45OTUgNTExLjk5NSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Y2lyY2xlIHN0eWxlPSJmaWxsOiMwMDY3NzU7IiBjeD0iMjU1Ljk5NyIgY3k9IjI1NS45OTciIHI9IjI1NS45OTciLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiMwNTU2NjE7IiBkPSJNNTExLjc4OSwyNzAuMTYzYy02Ljk3NiwxMzAuMjItMTExLjE5NCwyMzQuNDM3LTI0MS40MTQsMjQxLjYyNUwxNTcuMDY3LDM5OC40OGwxMDguMjM1LTEwOS43MTUNCglsLTIwLjcxNy0yMS4zNTFsMjIuODMxLTIyLjQwOGwyMC41MDYsMjAuOTI4TDM5Ni43OSwxNTUuNTg2bDExNC43ODgsMTE0Ljc4OEw1MTEuNzg5LDI3MC4xNjN6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojRkZENjMwOyIgZD0iTTIxNi4yNTgsMjI1Ljc3bC01MC45NDYsMi41MzdDMTY0Ljg4OCwyMjguMzA3LDE5NS41NDEsMTkwLjY3OCwyMTYuMjU4LDIyNS43N3oiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGNUJFMTg7IiBkPSJNMjI5Ljc4NywyMTQuMzU1bC0zMC4yMy04Mi4yMzNDMjEwLjEyNywxNDIuMjcsMjc3LjEzOSwxNzEuODY1LDIyOS43ODcsMjE0LjM1NXoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRjVCRTE4OyIgZD0iTTIxNi4yNTgsMjI1Ljc3di0wLjIxMWwtMC44NDYtMS4yNjlsLTQ5LjI1NSwyLjk2bC0wLjg0NiwxLjA1Nw0KCQlDMTY0LjQ2NiwyMjguMzA3LDE5Ny44NjYsMjYwLjg2MiwyMTYuMjU4LDIyNS43N3oiLz4NCjwvZz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkQ2MzA7IiBkPSJNMjI5Ljc4NywyMTQuMzU1bDEuNDgtMS4yNjlsLTI4Ljc1LTc4LjAwNWwtMi45Ni0yLjk2DQoJQzE5OC45MjMsMTMzLjgxMywxNjkuNzUsMjA3LjM3OSwyMjkuNzg3LDIxNC4zNTV6Ii8+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojMDBDQzk2OyIgZD0iTTExNS40MjIsMzI2LjYwNmw4MC4xMTktNzguNjM5YzguNDU2LTguMjQ0LDIxLjk4Ni04LjAzMywzMC4yMywwLjIxMWwyLjc0OCwyLjk2bDMxLjkyMSwzMi41NTUNCgkJbDIuNzQ4LDIuOTZjOC4yNDQsOC40NTYsOC4wMzMsMjEuOTg2LTAuMjExLDMwLjIzbC04MC4xMTksNzguNjM5Yy04LjQ1Niw4LjI0NC0yMS45ODYsOC4wMzMtMzAuMjMtMC4yMTFsLTM3LjQxNy0zOC4yNjMNCgkJYy04LjI0NC04LjQ1Ni04LjAzMy0yMS45ODYsMC4yMTEtMzAuMjN2LTAuMjEySDExNS40MjJ6IE0yMTQuNTY2LDI2NC44NzlsLTIuNzQ4LTIuOTZjLTAuNjM0LTAuNjM0LTEuNjkxLTAuNjM0LTIuMzI1LDANCgkJbC04MC4xMTksNzguNjM5Yy0wLjYzNCwwLjYzNC0wLjYzNCwxLjY5MSwwLDIuMzI1bDM3LjQxNywzOC4yNjNjMC42MzQsMC42MzQsMS42OTEsMC42MzQsMi4zMjUsMGw4MC4xMTktNzguNjM5DQoJCWMwLjYzNC0wLjYzNCwwLjYzNC0xLjY5MSwwLTIuMzI1bC0yLjc0OC0yLjk2bC0zMS45MjEtMzIuNTU1TDIxNC41NjYsMjY0Ljg3OUwyMTQuNTY2LDI2NC44Nzl6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6IzAwQ0M5NjsiIGQ9Ik0yNDkuMDI0LDE5NS41NDFsODAuMTE5LTc4LjYzOWM4LjQ1Ni04LjI0NCwyMS45ODYtOC4wMzMsMzAuMjMsMC4yMTFsMzcuNDE3LDM4LjI2Mw0KCQljOC4yNDQsOC40NTYsOC4wMzMsMjEuOTg2LTAuMjExLDMwLjIzbC04MC4xMTksNzguNjM5Yy04LjQ1Niw4LjI0NC0yMS45ODYsOC4wMzMtMzAuMjMtMC4yMTFsLTIuNzQ4LTIuOTZsLTMxLjcxLTMyLjU1NQ0KCQlsLTAuMjExLDAuMjExbC0yLjc0OC0yLjk2QzI0MC41NjgsMjE3LjMxNSwyNDAuNzc5LDIwMy43ODUsMjQ5LjAyNCwxOTUuNTQxeiBNMjk3LjQzMywyNDcuMzMzbDIuNzQ4LDIuOTYNCgkJYzAuNjM0LDAuNjM0LDEuNjkxLDAuNjM0LDIuMzI1LDBsODAuMTE5LTc4LjYzOWMwLjYzNC0wLjYzNCwwLjYzNC0xLjY5MSwwLTIuMzI1bC0zNy40MTctMzguMjYzYy0wLjYzNC0wLjYzNC0xLjY5MS0wLjYzNC0yLjMyNSwwDQoJCWwtODAuMTE5LDc4LjYzOWMtMC42MzQsMC42MzQtMC42MzQsMS42OTEsMCwyLjMyNWwyLjc0OCwyLjk2bDMxLjkyMSwzMi41NTV2LTAuMjEySDI5Ny40MzN6Ii8+DQo8L2c+DQo8cGF0aCBzdHlsZT0iZmlsbDojRkZENjMwOyIgZD0iTTIwOC42NDcsMjg1LjE3Mmw3NC40MTEtNzIuOTMyYzQuODYyLTQuNjUxLDEyLjY4NC00LjY1MSwxNy4zMzUsMC4yMTFsMCwwDQoJYzQuNjUxLDQuODYyLDQuNjUxLDEyLjY4NC0wLjIxMSwxNy4zMzVsLTc0LjQxMSw3Mi45MzJjLTQuODYyLDQuNjUxLTEyLjY4NCw0LjY1MS0xNy4zMzUtMC4yMTFsMCwwDQoJQzIwMy43ODUsMjk3LjY0NSwyMDMuNzg1LDI4OS44MjMsMjA4LjY0NywyODUuMTcyeiIvPg0KPGc+DQoJPHBhdGggc3R5bGU9ImZpbGw6IzA3QjU4NzsiIGQ9Ik0yNTMuMjUyLDI3Ni4wODNsNy4xODcsNy4zOTlsMi43NDgsMi45NmM4LjI0NCw4LjQ1Niw4LjAzMywyMS45ODYtMC4yMTEsMzAuMjNsLTgwLjExOSw3OC42MzkNCgkJYy04LjQ1Niw4LjI0NC0yMS45ODYsOC4wMzMtMzAuMjMtMC4yMTFsLTE4LjgxNS0xOS4wMjZsMTQuMTY0LTEzLjk1M2wxOC44MTUsMTkuMDI2YzAuNjM0LDAuNjM0LDEuNjkxLDAuNjM0LDIuMzI1LDANCgkJbDgwLjExOS03OC42MzljMC42MzQtMC42MzQsMC42MzQtMS42OTEsMC0yLjMyNWwtMi43NDgtMi45NmwtNy4xODctNy4zOTlsMTQuMTY0LTEzLjk1M0wyNTMuMjUyLDI3Ni4wODN6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6IzA3QjU4NzsiIGQ9Ik0zNzguMTg3LDEzNi4xMzlsMTguODE1LDE5LjAyNmM4LjI0NCw4LjQ1Niw4LjAzMywyMS45ODYtMC4yMTEsMzAuMjNsLTgwLjExOSw3OC42MzkNCgkJYy04LjQ1Niw4LjI0NC0yMS45ODYsOC4wMzMtMzAuMjMtMC4yMTFsLTIuNzQ4LTIuOTZsLTcuMTg3LTcuMzk5bDE0LjE2NC0xMy43NGw3LjE4Nyw3LjM5OWwyLjc0OCwyLjk2DQoJCWMwLjYzNCwwLjYzNCwxLjY5MSwwLjYzNCwyLjMyNSwwbDgwLjExOS03OC42MzljMC42MzQtMC42MzQsMC42MzQtMS42OTEsMC0yLjMyNWwtMTguODE1LTE5LjAyNmwxNC4xNjQtMTMuOTUzSDM3OC4xODd6Ii8+DQo8L2c+DQo8cGF0aCBzdHlsZT0iZmlsbDojRjVCRTE4OyIgZD0iTTMwMC42MDQsMjEyLjQ1M0wzMDAuNjA0LDIxMi40NTNjNC42NTEsNC44NjIsNC42NTEsMTIuNjg0LTAuMjExLDE3LjMzNWwtNzQuNDExLDcyLjkzMg0KCWMtNC44NjIsNC42NTEtMTIuNjg0LDQuNjUxLTE3LjMzNS0wLjIxMWwwLDBsOTEuOTU3LTkwLjI2NlYyMTIuNDUzeiIvPg0KPC9zdmc+
// @namespace       https://greasyfork.org/users/1291639
// @downloadURL https://update.greasyfork.org/scripts/553472/CleanURLs%20and%20SkipRedirects.user.js
// @updateURL https://update.greasyfork.org/scripts/553472/CleanURLs%20and%20SkipRedirects.meta.js
// ==/UserScript==
//
// ┌────────────────────────────────────────────┐
// │                  SOMMAIRE                  │
// ├────────────────────────────────────────────┤
// │ [1] Configuration                          │
// │ [2] Cas spéciaux                           │
// │ [3] Outils de décodage                     │
// │ [4] Nettoyage des URLs                     │
// │ [5] Barre d’adresse                        │
// │ [6] Balises <a>                            │
// │ [7] Observateurs DOM & URL                 │
// │ [8] Initialisation                         │
// └────────────────────────────────────────────┘

(function() {
    'use strict';

    // Quitter si le document n'est pas HTML
    if (document.doctype == null) return;



    // ===============[1]===============
    //           CONFIGURATION
    // =================================


    // ---------- Liste des protocoles pris en charge ----------

    const validProtocols = [
      'finger:',
      'ftp://',
      'ftps://',
      'freenet:',
      'gemini:',
      'gopher:',
      'http://',
      'https://',
      'ipfs:',
      'mailto:',
      'magnet:',
      'wap:',
      'xmpp:'
    ];


    // ---------- Liste des paramètres d'URL à nettoyer ----------

    const blacklist = [
      'a',
      'abcId',
      'accountId',
      'acnt',
      'ad',
      'adgroupid',
      'adgrp',
      'adgrpid',
      'ad-location',
      'ad_medium',
      'ad_name',
      'ad_pvid',
      'ad_sub',
      'ad_tags',
      'adt_ei',
      'ad_type',
      'advertising-id',
      'adword',
      'aem_p4p_detail',
      'af',
      'aff',
      'aff_fcid',
      'aff_fsk',
      'affiliate',
      'affiliateCode',
      'affiliationId',
      'aff_platform',
      'affparams',
      'aff_short_key',
      'afSmartRedirect',
      'aff_trace_key',
      'afftrack',
      'af_assettype_id',
      'af_creative_id',
      'af_id',
      'af_placement_id',
      'agid',
      'aid',
      'albag',
      'albch',
      'albcp',
      'algo_exp_id',
      'algo_pvid',
      'APID',
      'ap_id',
      'appver',
      'ar',
      'ascsubtag',
      'asc_contentid',
      'asgtbndr',
      'atc',
      'at_campaign',
      'at_campaign_group',
      'at_creation',
      'at_medium',
      'at_network',
      'at_platform',
      'ats',
      'at_term',
      'at_variant',
      'autostart',
      'bb',
      'bbn',
      'bdmtchtyp ',
      'bdmtchtyp+',
      'bizType',
      'block',
      'bp',
      '_bsa_req',
      'bta',
      'businessType',
      'c',
      'caifrq',
      'campaign',
      'campaignId',
      'campaignid',
      'campaign_id',
      'campid',
      'cd',
      '__cf_chl_rt_tk',
      '__cf_chl_tk',
      '__cf_chl_f_tk',
      '__cf_chl_jschl_tk__',
      '__cf_chl_captcha_tk__',
      '__cf_chl_managed_tk__',
      '__cf_chl_rt_tk__',
      'cha',
      'chb',
      'chbr',
      'chf',
      'child_sku',
      'chm',
      'chmd',
      'chn',
      'chnl',
      'chp',
      'chv',
      'cid',
      'ck',
      'clickid',
      'client_id',
      'cm_mmc',
      'cm_ven',
      'cmd',
      'cmpgn',
      'cnvs',
      'cod',
      'comId',
      'content-id',
      'country',
      'crea',
      'creative',
      'crid',
      'cs',
      'cst',
      'cti',
      'cts',
      'curPageLogUid',
      'custom3',
      'customid',
      'dc',
      'dchild',
      'dclid',
      'deals-widget',
      'device',
      'dgcid',
      'dib',
      'dib_tag',
      'dicbo',
      'dim1',
      'dim2',
      'discounts-widget',
      'docid',
      'ds',
      'dt',
      'dTag',
      'dv',
      'e',
      'e9s',
      'eclog',
      'edd',
      'edm_click_module',
      'ei',
      'email',
      'embed',
      'em_cmp',
      'emid',
      'em_src',
      '_encoding',
      'eventSource',
      'exp_price',
      'fbclid',
      'fdl',
      'feature',
      'febuild',
      'fid',
      'field',
      'field-lbr_brands_browse-bin',
      'fn',
      'forced_click',
      'fr',
      'freq',
      'from',
      'frs',
      '_ga',
      'ga_order',
      'ga_search_query',
      'ga_search_type',
      'ga_view_type',
      'gadid',
      'gatewayAdapt',
      'gbv',
      'gclid',
      'gclsrc',
      'gg_dev',
      'gh_jid',
      'goods_id',
      'googleloc',
      'gps-id',
      'gsAttrs',
      'gs_lcp',
      'gs_lp',
      'gt',
      'gtin',
      'guccounter',
      'hdtime',
      'helpid',
      'hosted_button_id',
      'hvadid',
      'hvbmt',
      'hvdev',
      'hvlocphy',
      'hvnetw',
      'hvqmt',
      'hvtargid',
      'hydadcr',
      'i',
      'ICID',
      'ico',
      'idOffre',
      'idzone',
      'ie',
      'iflsig',
      'ig_rid',
      'im',
      'index',
      'intake',
      'intcmp',
      'irclickid',
      'irgwc',
      'irpid',
      'isdl',
      'is_from_webapp',
      'itemId',
      'itemid',
      'itid',
      'itok',
      'ix',
      'kard',
      'katds_labels',
      'kb',
      'keyno',
      'keywords',
      'KwdID',
      'kwmt',
      'l10n',
      'landed',
      'ld',
      'linkCode',
      'loc_physical_ms',
      'ls',
      'mark',
      'mc',
      'mc_cid',
      'mcid',
      'md',
      'md5',
      'media',
      'merchantid',
      'mid',
      'mkcid',
      '__mk_de_DE',
      'mkevt',
      'mkgroupid',
      'mkrid',
      'mkscid',
      'mortyurl',
      'mp',
      'msadgroup',
      'mscampaign',
      'msclid',
      'msclkid',
      'msdevice',
      'msmatchtype',
      'msnetwork',
      'mstargetid',
      'mtchtyp',
      'mtctp',
      'nats',
      'nbbct',
      'nci',
      'netw',
      'nojs',
      'norover',
      'nsdOptOutParam',
      'ntwrk',
      'obOrigUrl',
      'offerId',
      'offerid',
      'offer_id',
      'opened-from',
      'opt_92',
      'optout',
      'oq',
      'organic_search_click',
      'origin',
      'os',
      'p',
      'p1',
      'p2',
      'p3',
      'pa',
      'Partner',
      'partner',
      'partner_id',
      'partner_ID',
      'pb',
      'pcampaignid',
      'pd_rd_i',
      'pd_rd_r',
      'pd_rd_w',
      'pd_rd_wg',
      'pdp_npi',
      'pf',
      'pf_rd_i',
      'pf_rd_m',
      'pf_rd_p',
      'pf_rd_r',
      'pf_rd_s',
      'pf_rd_t',
      'pg',
      'pgId',
      'PHPSESSID',
      'pid',
      'pk_campaign',
      'pdp_ext_f',
      'pkey',
      'Platform',
      'platform',
      'pli',
      'plkey',
      'pload',
      'plu',
      'pp',
      'pqr',
      'pr',
      'preselect',
      'pro',
      'prod',
      'prodid',
      'product_id',
      'product_partition_id',
      'prom',
      'promo',
      'promocode',
      'promoid',
      'provider',
      'psc',
      'psp',
      'psprogram',
      'psr',
      'pv',
      'pvid',
      'qid',
      'Query',
      'r',
      '_randl_currency',
      '_randl_shipto',
      'rb_css',
      'rb_geo',
      'rb_itemId',
      'rb_pgeo',
      'rb_plang',
      'realDomain',
      'recruiter_id',
      'ref',
      'ref_',
      'ref_src',
      'refcode',
      'referral',
      'referrer',
      'refinements',
      'reftag',
      'related_post_from',
      'retailer',
      'rf',
      'rlp',
      'rlid',
      'rlsatarget',
      'rnid',
      'rowan_id1',
      'rowan_msg_id',
      'rs',
      'ru',
      'rss',
      'sbo',
      'sCh',
      'sca_esv',
      'scene',
      'sclient',
      'scm',
      'scm_id',
      'scm-url',
      'sd',
      'search_id',
      'search_page',
      'search_page_position',
      'searchText',
      'sei',
      'sender_device',
      'service',
      'serviceIdserviceId',
      'sh',
      'shareId',
      'shownav',
      'showVariations',
      'si',
      'sid',
      '___SID',
      '.sig',
      'site',
      'site_id',
      'sk',
      'smid',
      'social_params',
      'soluteclid',
      'source',
      'sourceId',
      'sp',
      'sp_csd',
      'spLa',
      'spm',
      'spreadType',
      'sprefix',
      'sr',
      'src',
      '_src',
      'src_cmp',
      'src_player',
      'src_src',
      'srcSns',
      'start_radio',
      'su',
      'supplier',
      'sxin_0_pb',
      'syslcid',
      '_t',
      'tag',
      't_agid',
      'targetid',
      'tcampaign',
      't_cid',
      't_crid',
      't_crname',
      'td',
      't_device',
      'terminal_id',
      'test',
      'text',
      'tgt',
      'th',
      'tl',
      't_match_type',
      't_network',
      'token',
      'tokenId',
      'toolid',
      'tracelog',
      'trafficChannelId',
      'traffic_id',
      'traffic_source',
      'traffic_type',
      'trgt',
      '.ts',
      't_s',
      'tt',
      'tuid',
      't_validation',
      'tz',
      'uact',
      'ug_edm_item_id',
      'ui',
      'uilcid',
      '_ul',
      'url_from',
      'userId',
      'utm',
      'utm1',
      'utm2',
      'utm3',
      'utm4',
      'utm5',
      'utm6',
      'utm7',
      'utm8',
      'utm9',
      'utm_campaign',
      'utm_channel',
      'utm_content',
      'utm_feed',
      'utm_hash',
      'utm_id',
      'utm_medium',
      'utm_productid',
      'utm_source',
      'utm_source_platform',
      'utm_term',
      'uuid',
      'utype',
      'var',
      'variant',
      'variant_id',
      'variant_sku_code',
      'vcn',
      'vcv',
      've',
      'ved',
      'wait',
      'wcks',
      'wgl',
      'wprov',
      'x',
      '_xiid',
      'xpid',
      'y',
      'zone',
      'zoneid'
    ];


    // ---------- Liste des paramètres de hash à nettoyer ----------

    const hash = [
      '!psicash',
      'back-url',
      'back_url',
      'dealsGridLinkAnchor',
      'ebo',
      'int',
      'intcid',
      'mpos',
      'niche-',
      'searchinput',
      'src',
      'xtor'
    ];


    // ---------- Liste des paramètres de redirection ----------

    const redirectParams = [
      'continue',
      'ds_dest_url',
      'kaRdt',
      'lp',
      'rdr',
      'redirect',
      'redirect_uri',
      'spld',
      'target',
      'tURL',
      'u',
      'url',
      'url64fb'
    ];



    // ===============[2]===============
    //           CAS SPÉCIAUX
    // =================================

    /**
     * Réécrit les URL pour certains sites spécifiques :
     * - Amazon
     * - Wikimedia
     */
    function rewriteSpecialCases(url) {


        // ---------- Cas Amazon ----------

        // Domaines Amazon
        const amazonDomains = [
          'amazon.com',
          'amazon.be',
          'amazon.ae',
          'amazon.ca',
          'amazon.co.uk',
          'amazon.com.au',
          'amazon.com.br',
          'amazon.com.mx',
          'amazon.com.tr',
          'amazon.de',
          'amazon.es',
          'amazon.fr',
          'amazon.in',
          'amazon.it',
          'amazon.nl',
          'amazon.pl',
          'amazon.sa',
          'amazon.se',
          'amazon.sg'
        ];
        const isAmazon = amazonDomains.some(domain => url.hostname.endsWith(domain));
        if (isAmazon && url.pathname.match(/^\/s/) && url.searchParams.has('keywords')) {
            // Unifie le chemin
            url.pathname = '/s';
            // Remplace 'keywords' par 'k'
            const keywords = url.searchParams.get('keywords');
            url.searchParams.delete('keywords');
            url.searchParams.set('k', keywords);
        }


        // ---------- Cas Wikimedia ----------

        // Domaines Wikimedia
        const wikimediaDomains = [
          'mediawiki.org',
          'wikibooks.org',
          'wikidata.org',
          'wikimedia.org',
          'wikinews.org',
          'wikipedia.org',
          'wikiquote.org',
          'wikisource.org',
          'wikiversity.org',
          'wikivoyage.org',
          'wiktionary.org'
        ];
        const isWikimedia = wikimediaDomains.some(domain => url.hostname.endsWith(domain));
        if (isWikimedia && url.pathname.match(/^\/w\/index.php/) && url.searchParams.has('title')) {
            // Récupère la valeur du paramètre 'title'
            const title = url.searchParams.get('title');
            // Supprime le paramètre 'title' de l'URL
            url.searchParams.delete('title');
            // Modifie le chemin en fonction de la valeur de 'title'
            url.pathname = `/wiki/${encodeURIComponent(title)}`;
        }
    }



    // ===============[3]===============
    //        OUTILS DE DÉCODAGE
    // =================================


    // ---------- Décodage en URL ----------

    function tryUrlDecode(value) {
        if (!value) return null;
        try {
            let decoded = decodeURIComponent(value);
            return decoded;
        } catch (e) {
            return null; // Cas de chaîne mal formée
        }
    }


    // ---------- Décodage en base64 ----------

    function tryBase64Decode(value) {
        if (!value) return null;
        try {
            // Corrige le format base64url → base64 standard
            let base64 = value.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4 !== 0) base64 += '=';
            const decoded = atob(base64);
            return decoded;
        } catch (e) {
            return null;
        }
    }


    // ---------- Décodage JSON ----------

    function tryDecodeJson(value) {
        if (!value) return null;

        // Étape 1 : tentative sans décodage URL
        try {
            return JSON.parse(value);
        } catch (e1) {
          
            // Étape 2 : tentative après décodage URL
            const decoded = tryUrlDecode(value);
            if (decoded) {
                try {
                    return JSON.parse(decoded);
                } catch (e2) {
                    return null;
                }
            }
            return null;
        }
    }


    /**
     * Tente de décoder une URL de redirection encodée :
     * - en URL
     * - en base64
     * - en json
     * Retourne l'url décodée ou null
     */
    function tryDecodeRedirectUrl(value) {
        if (!value) return null;

        // 1. Essayer un décodage URL
        const urlDecoded = tryUrlDecode(value);
        for (const protocol of validProtocols) {
            if (urlDecoded && urlDecoded.startsWith(protocol)) {
                return urlDecoded;
            }
        }

        // 2. Essayer un décodage base64, puis, si besoin, décodage URL
        let temp = value;
        for (let i = 0; i < 4; i++) {
            const base64Decoded = tryBase64Decode(temp);
            if (base64Decoded) {
                // On teste d'abord base64Decoded, puis sa version URL décodée
                const candidates = [base64Decoded, tryUrlDecode(base64Decoded)];
                for (const candidate of candidates) {
                    if (!candidate) continue;
                    for (const protocol of validProtocols) {
                        const index = candidate.indexOf(protocol);
                        if (index !== -1) {
                            return candidate.substring(index);
                        }
                    }
                }
            }
            // Supprime le premier caractère pour la prochaine itération
            temp = temp.substring(1);
        }

        // 3. Essayer un décodage JSON
        const json = tryDecodeJson(value);
        if (json && typeof json === 'object') {
            // On cherche un champ contenant une URL potentielle
            for (const param of redirectParams) {
                const possible = json[param];
                if (typeof possible === 'string') {
                    const candidate = tryDecodeRedirectUrl(possible);
                    if (candidate) {
                        return candidate;
                    }
                }
            }
        }

        // 4. Aucun résultat valide : ce n'était pas une URL de redirection
        return null;
    }



    // ===============[4]===============
    //        NETTOYAGE DES URLS
    // =================================


    /**
     * Suit les redirections et nettoie l'URL en plusieurs étapes :
     * - traitement du chemin
     * - nettoyage des paramètres
     * - nettoyage du hash
     * S'assure qu'il n'y a pas de paramètres encodés en URL.
     */
    function cleanUrl(url) {
        if (typeof url === 'string') url = new URL(url);


       // ---------- Passage des redirections ----------

        const urlString = url.href;
        const originalOrigin = url.origin;
        let lastValidRedirect = url;

        // 1. Traitement des urls mal encodées
        for (const param of redirectParams) {
          let startIndex = 0;
          const pattern = `${param}=`;
          while (true) {
            const index = urlString.indexOf(pattern, startIndex);
            if (index === -1) break;
            const rawValue = urlString.slice(index + pattern.length);
            for (const protocol of validProtocols) {
              if (rawValue.startsWith(protocol)) {
                try {
                  const nextUrl = new URL(rawValue);
                  if (nextUrl.origin !== originalOrigin) {
                    return cleanUrl(nextUrl);
                  } else {
                    lastValidRedirect = cleanUrl(nextUrl);
                  }
                } catch {
                  return null;
                }
                break;
              }
            }
            startIndex = index + pattern.length;
          }
        }

        // 2. Traitement classique
        for (const param of redirectParams) {
          const values = url.searchParams.getAll(param);
          for (const rawValue of values) {
            const decodedRedirect = tryDecodeRedirectUrl(rawValue);
            if (decodedRedirect) {
              const decodedUrl = new URL(decodedRedirect);
              if (decodedUrl.origin !== originalOrigin) {
                return cleanUrl(decodedUrl);
              } else {
                lastValidRedirect = cleanUrl(decodedUrl);
              }
            } else {
              lastValidRedirect.searchParams.delete(param);
            }
          }
        }

        // 3. Retourne l'url de destination
        url = lastValidRedirect;


        // ---------- Nettoyage de l'URL ----------

        // Appliquer les réécriture spécifiques
        rewriteSpecialCases(url);
        let href = url.href;

        // 1. Supprimer les paramètres dans le chemin
        const path = url.pathname;
        const pathParts = path.split('/').filter(part => {
            if (!part.includes('=')) return true;
            const [key, ...rest] = part.split('=');
            const value = rest.join('=');
            // Supprime si la clé est blacklistée ou la valeur est vide
            return !!value && !blacklist.includes(key);
        });
        // Reconstruire le chemin avec ce qu'il reste
        url.pathname = pathParts.join('/');

        // 2. Supprime les paramètres vides et tous les paramètres blacklistés
        if (url.search.includes('=')) {
            const newParams = new URLSearchParams();
            for (const [key, value] of url.searchParams.entries()) {
                  if (!!value && !blacklist.includes(key)) {
                      newParams.append(key, value);
                  }
            }
            url.search = newParams.toString();
        }

        // 3. Supprime les hash vides et tous les paramètres blacklistés dans hash
        if (url.hash) {
          // Enlève le '#'
          let hashContent = url.hash.substring(1);
          if (hashContent.includes('=')) {
              // Parser comme une liste de paramètres
              const hashParams = new URLSearchParams(hashContent);
              // Nettoyage
              const newHashParams = new URLSearchParams();
              for (const [key, value] of hashParams.entries()) {
                  if (!!value && !hash.includes(key)) {
                      newHashParams.append(key, value);
                  }
              }
              // Reconstruire le hash avec ce qu'il reste
              url.hash = newHashParams.toString() ? '#' + newHashParams.toString() : '';
            }
        }


        // ---------- Décodage des paramètres restants ----------

        let finalURL = url.href;
        const newParams = new URLSearchParams();
        if (!url.search || !url.search.includes('=')) {
            return url;
        }

        // 1. Parcourir tous les paramètres de l'URL
        for (const [key, value] of url.searchParams.entries()) {
            // Décoder la valeur du paramètre
            let decodedValue = tryUrlDecode(value);
            // On cherche si la valeur est une suite de paramètres encodés
            if (decodedValue && decodedValue.includes('=')) {
                const innerParams = new URLSearchParams(decodedValue);

                // Si la valeur décodée ressemble à une série de paramètres, les ajouter comme nouveaux paramètres en remplaçant la clef par sa valeur décodée
                for (const [innerKey, innerValue] of innerParams.entries()) {
                    newParams.append(innerKey, innerValue);  // Ajouter chaque paramètre comme s'il était indépendant
                }
                // On ne garde pas le param original, car il est remplacé par ses composants décodés
            } else {
                // Si ce n'est pas une suite de paramètres, ajouter le paramètre normalement
                newParams.append(key, decodedValue);
            }
        }

        // 2. Remplacer les paramètres dans l'URL nettoyée avec les nouveaux paramètres décodés
        url.search = newParams.toString();

        // 3. Si l'URL a changé suite à ce décodage des paramètres, rappeler cleanUrl
        if (url.href !== finalURL) {
            url = cleanUrl(url);
        }

        return url;  // Retourner l'URL nettoyée avec les paramètres réécrits
    }



    // ===============[5]===============
    //         BARRE D'ADRESSE
    // =================================

    // Modifie l'URL actuelle dans la barre d'adresse pour supprimer les paramètres de suivi
    function modifyURL() {
        const url = new URL(window.location.href);
        const cleanedUrl = cleanUrl(url);
        const newURL = cleanedUrl.href;
        if (window.location.href !== newURL) {
            window.history.replaceState(null, '', newURL);
        }
    }



    // ===============[6]===============
    //           BALISES <a>
    // =================================


    // ---------- Redéfinir la propriété `href` de HTMLAnchorElement ----------

    (function redefineHrefSetter() {
        const descriptor = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href');
        Object.defineProperty(HTMLAnchorElement.prototype, 'href', {
            get: descriptor.get,
            set(value) {
                try {
                    const cleaned = validateAndCleanUrl(value);
                    descriptor.set.call(this, cleaned ?? value);
                } catch (e) {
                    descriptor.set.call(this, value);
                }
            }
        });
    })();


    // ---------- Nettoyer une URL et éventuellement suivre la redirection ----------

    /**
     * Valide et nettoie une URL.
     * Retourne une URL absolue nettoyée ou null si invalide.
     */
    function validateAndCleanUrl(href) {
        if (!href) return null; // Ignore les valeurs vides
        try {
            // Transforme les href en URL absolue
            const url = new URL(href, window.location.href);
            // Corrige les redoublements successifs de segments
            const segments = url.pathname.split("/").filter(Boolean);
            const result = [];
            for (const segment of segments) {
                if (result[result.length - 1] !== segment) {
                    result.push(segment);
                }
            }
            url.pathname = "/" + result.join("/");
            // Nettoie l'URL
            let cleaned = cleanUrl(url);
            // Retourne l'URL nettoyée (toujours absolue)
            return cleaned.href;
        } catch (e) {
            return null;
        }
    }


    // ---------- Intercepter les modifications de href via setAttribute() ----------

    (function redefineSetAttribute() {
        const original = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            if (this.tagName === 'A' && name.toLowerCase() === 'href') {
                try {
                    const cleaned = validateAndCleanUrl(value);
                    if (cleaned) {
                        return original.call(this, name, cleaned);
                    }
                } catch (e) {}
            }
            return original.call(this, name, value);
        };
    })();


    // ---------- Traiter tous les liens dans un conteneur ----------

    /**
     * Parcourir tous les liens du conteneur,
     * nettoyer leur attribut href si nécessaire,
     * et remplacer par l’URL nettoyée.
     */
    function handleLinks(container = document) {
        const links = container.getElementsByTagName('a');
        for (const link of links) {
            try {
                // On récupère l'attribut brut, sans résolution automatique en URL absolue
                if (!link.hasAttribute('href')) continue;
                const originalHref = link.getAttribute('href');
                const cleanedHref = validateAndCleanUrl(originalHref);
                // Si une URL nettoyée valide existe et qu'elle est différente, on remplace
                if (cleanedHref && cleanedHref !== originalHref) {
                    link.setAttribute('href', cleanedHref);
                }
            } catch (e) {}
        }
    }



    // ===============[7]===============
    //      OBSERVATEURS DOM & URL
    // =================================


    // ---------- Configure un MutationObserver pour nettoyer dynamiquement les URLs ----------

    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        handleLinks(node);
                    }
                }
            });
        });
        function tryObserve() {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            } else {
                requestAnimationFrame(tryObserve);
            }
        }
        tryObserve();
    }


    // ---------- Observation des changement dynamique de l'URL ----------

    function observeURLChanges() {
        let lastUrl = window.location.href;
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                modifyURL();
                lastUrl = currentUrl;
            }
        });
        observer.observe(document, { subtree: true, childList: true });
        // Observe les ajouts de hash
        window.addEventListener('hashchange', () => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                modifyURL();
                lastUrl = currentUrl;
            }
        });
    }



    // ===============[8]===============
    //          INITIALISATION
    // =================================


    // ---------- Nettoyage initial ----------

    modifyURL();


    // ---------- Nettoyage une fois la page chargée ----------

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            handleLinks();
            setupMutationObserver();
            observeURLChanges();
        });
    } else {
        handleLinks();
        setupMutationObserver();
        observeURLChanges();
    }
})();